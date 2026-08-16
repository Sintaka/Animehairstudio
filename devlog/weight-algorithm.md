# 蒙皮权重算法分析（视口 vs 导出）与 boneCapture 修复（0.2.108）

> 专题文档：回答「视口的权重算法是什么」+ 记录「导出 boneCapture 单影响 → 平滑双影响」修复。
> 相关代码：modules/geometry/panel-tip-strand.js（panelWeights）、modules/geometry/strand-geometry.js
> （strandSplitWeights）、modules/geometry/leaf-weights.js（读取框架）、modules/io/project-files.js
> （导出蒙皮）、modules/io/usda-export.js（smoothMainPair）。

## 1. 视口权重算法是什么：扫掠固有参数化规律（不是距离 proxy，不是 Biharmonic）

视口（几何层）每顶点权重三元组 `[mainJoint, leafIndex, weight]`（Float32Array 每 3 个一组，
`leafWeightAt` 读取）：

- **mainJoint（主骨骼索引）**：`round(t · (mainPointCount - 1))`——t = 该顶点的**扫掠行参数**
  （行号 / 行数），即「沿主链参数化就近取主骨骼」。这是**扫掠固有的参数化分配**：
  骨骼沿链参数等距摆放，顶点按行参数就近绑定，不是按世界距离、也不是拉普拉斯/调和场。
- **leafIndex（叶子/段索引）**：
  - 面板：**按 u 硬分配**——zipper 边界（`panelSplits[].position`）把 u 切成段，段号即 leafIndex
    （边缘段 = 0 / N-1）。
  - 发丝 split：**按管分配**——管 0/1（`section.direction` ±1）。
- **weight（分叉渐变权重）**：
  - 面板 `tipSegmentWeightAt(lock, segment, splits, t, u, lengthLoops)`：每侧以自己 zipper 顶
    `1 - height` 为权重 0 边界（边缘段镜像对侧 zipper），段内按 u **线性插值**成斜线分界
    `forkT(u) = lerp(leftFork, rightFork, localU)`；再往下 `start = forkT(u) + max(1/lengthLoops, 0.02)`
    （行级死区，防笔刷刷到未分开区），`weight = clamp((t - start)/(1 - start))` **线性爬升**到尖端=1。
  - 发丝 split `tipWeightAt(t, splitStart)`：`clamp((t - splitStart)/(1 - splitStart))`——纯 t 线性，
    0 在分叉起点、1 在发尖。
- 普通发丝（无 split/无 panel）：**无权重**——几何直接扫掠，不存在蒙皮权重概念。

**结论**：视口权重 = 「**扫掠参数化就近分配 + 分叉线性渐变**」——纯解析、逐顶点 O(1)、无迭代、
无距离场。与 Biharmonic（调和方程、全局平滑、需求解器）、距离 proxy（按到骨骼的最近距离/衰减）
都不同；与 smoothstep 也只有历史渊源（早期版本用 smoothstep 窄带，0.2.59 起改为死区 + 线性，
见 panel-split-tip-bones.md §8.13/§8.15）。

## 2. 导出 boneCapture 的问题（Houdini 实测 Sussurro_v1_0054）

- 10489 顶点中 **8855 个是假双影响**：`[1, -1] × [1, -1]`（第二槽位 -1 填充）——对应导出代码的
  `[mainIdx, mainIdx] × [1, 0]`（同索引 + 0 权重），Houdini 导入时压成单影响并填充 (-1,-1)。
- 只有 1634 个顶点是真双影响（leafWeights 暴露区 `[main, split] × [1-w, w]`）。
- 根因：① `bindBySweepRow`（普通发丝/权重缺失兜底）整体写 `[round, round] × [1,0]` 单影响；
  ② leafWeights 路径对 weight=0（fork 以上主骨骼驱动区）写 `[main, main] × [1,0]`。

## 3. 修复：每顶点真双影响（0.2.108）+ 暴露区绑最近发尖链关节（0.2.109）

统一规则（与视口一致的"主链参数化 + 暴露区分叉"语义）：

1. **暴露区（leafWeights 有效且 weight > 0.0001）**：tip 侧 = **最近发尖链关节**
   （0.2.109，`tipChainNearestIndex(t, mainCount, forkT)`：顶点行 t → 链位置
   `ci = t·(mainCount-1)` → 暴露区（`t_i > forkT`）内最近索引；`index===i0` 即链根
   `split.${k}` 自身，否则 `split.${k}.tip.${index}`）——`[tip, main]×[w, 1-w]`
   按权重降序排列（主导影响第一槽）。末端行 = 最后一个 tip 关节（0.2.108 前是
   `[main, split.${k}]×[1-w, w]`——全部绑在 fork 处的链根，发尖链关节 0 引用）。
2. **其余（普通发丝、fork 以上主骨骼驱动区、权重缺失）**：`smoothMainPair(t, mainCount)`——
   `x = clamp(t,0,1)·(mainCount-1)`、`main = floor(x)`、`next = min(mainCount-1, main+1)`、
   `frac = x - main` → `[mainIdx, nextIdx] × [1-frac, frac]`：**相邻主骨骼线性混合**，从根到尖
   权重连续过渡，任意顶点都有两个真实影响（链末端 main===next 自然退化为单，属正确语义）。
   - t 来源：顶点 `gridRowIndices[vertex]` → `t = max(0,row)/(rows-1)`（端盖 -1 行 → 根）。
3. 效果：Houdini 中每个顶点 boneCapture 都有两个有效 (index, weight) 对；拖动任意主骨骼，
   其影响带沿链平滑衰减（不再「一个点控制」）；拖动发尖链关节能直接驱动对应暴露区顶点
   （0.2.109，实测 1450 顶点绑定发尖链关节、末端行 `[tip_5@1, main@0]`）。

## 4. 验证

- tests/usda-export.test.mjs：smoothMainPair 数值断言（0/0.5/0.25/1/0.99/clamp/mainCount=1）；
  tipChainNearestIndex 断言（forkT 0.75/0.5625/1、clamp、mainCount=2）。
- 重新导出后 Houdini usdskinimport 复查：假双影响 `(-1,-1)` 槽位消失，真双影响占比 100%
  （除链末端/根行的自然退化行）；发尖链关节被引用（0057：1450 顶点）。
