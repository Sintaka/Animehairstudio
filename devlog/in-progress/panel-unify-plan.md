# Panel 三级架构统一计划（主发片 / 中间体 / 发尖）

> **给零上下文的新会话**：读完第 0 节与第 1 节就能开工。本文档不假设你读过任何历史 devlog
> 或记忆文件。所有 file:line 均为 2026-09-02 当场 grep 实测。
>
> 状态：**第 0/1/2/4 步已落地并提交；~~第 3 步~~ 已作废（见下）；第 5 步未做。**
> 当前：`APP_VERSION = 0.1.5-Sintaka.0.2.183`，全量 **681 pass / 0 fail**（主脑亲跑）。
> 本地 `DHS/develop`，**未推送**（用户拍板暂不推）。
>
> ## ⛔ 第 3 步（depth 中间层创作入口）已于 0.2.183 作废
>
> **作废理由不是"太难"，是"没有意义"**：用户拍板 depth 的消费口径收敛到第 0 层
> （原话逐字「曲线保持原状, 扫掠横截面整体直接由层0决定」），0.2.183 已把
> `panelThicknessAt` 与 `tipMainSectionPoint` 两处横截面消费点改为**恒读 lock 级**。
> ⇒ 既然横截面只认第 0 层，**给中间层做 depth 创作入口就是造一个刷了不生效的工具**。
> ⇒ 下方「执行后记」里关于 `taperCurveBrushCandidates` 投影轴硬编码的分析仍然准确，
> 但**不必再解决它**。`tests/tier-depth-curve-wiring.test.mjs` 已反转成守新口径，
> 并带一条源码断言挡「有人把 depth 接回三级回落」。
>
> | 版本 | commit | 对应步骤 |
> |---|---|---|
> | 0.2.177 | `0a22202` | 第 0 步（基线） |
> | 0.2.178 | `27c975c` | 第 1 步（分组树进快照） |
> | 0.2.179 | `44abe2a` | 第 2 步（统一取值入口，纯重构） |
> | 0.2.180 | `010e087` | 第 4 步（浮动编辑器认得中间层，①③④） |
>
> **决策点已全部拍板**：D1 未物化则不写键 / D2 笔刷对称 Width（**已延后**）/
> D3 本轮不动只加注释 / D4 主脑核实无重叠、非阻塞 / D5 原为走完全条，
> 执行中因第 3 步实际规模超预估，用户改判为「跳过第 3 步先做第 4 步」。
>
> ⚠ **本文件尚不可删**（第 11 节的删除指令仅在全部步骤完成后生效）。
> 剩余工作见下方「执行后记」。
>
> ## 执行后记（2026-09-02，实测）
>
> **第 3 步比本计划预估大** —— 计划第 1.2 节只点出 `widthBrushCurveArray` 硬编码 key，
> 但实测 `taper-editor.js:427` 的 `taperCurveBrushCandidates` 除了 `curveKey="taperCurve"`，
> **候选点的投影轴 x/z 也按宽度硬编码**（`:457-460` 的注释明写 depth 需要 "z"）。
> 即「泛化成按 key 取」不足以让 depth 可创作，还要把 depth/width 选择器从 UI 状态
> 一路穿到候选点枚举与投影数学。geometry 侧无需改（`bakeTierWidthCurve` /
> `resampleTierCurveToLeaf` 已 key-agnostic）。
>
> **两个「副本 vs 活树」陷阱（各栽一次，都靠探针/测试抓到，读代码看不出）**：
> ① `normalizePanelBoneGroups` 重建节点结构但可创作值**按引用赋值**
>    （`panel-bone-groups.js:299`）⇒ 快照只归一化会与实时树共享曲线数组，
>    而撤销栈存内存对象不经 JSON 往返 ⇒ 必须再补一次深拷贝。
> ② `panelBoneGroupsFor(lock)` 返回**归一化副本**，`materializePanelBoneGroups(lock)`
>    返回**活引用**，两者不是同一个对象。写入必须命中活树，落副本上静默丢失。
>
> **`resolveTipHost` 不能用于展示侧读曲线**：其 `materialize=false` 分支返回
> `{ tip }` 桩对象（`tip-sub-bone-host.js:133`），无任何曲线字段 ⇒ 展示侧会取到
> undefined 再回落 lock 全局值，比不修更错。第 4 步第一版即如此，被新测试的
> 「展示侧与写入侧同源」那条抓出。最终改为新 dep `panelTierNodeForSegment`，
> 两条路径分开（写走活树 / 读走副本）。
>
> **第 2 步的判据一度毫无分辨力**：`tipWidthMultiplierAt` 在 `t < forkT`（= 1 - zipper
> height）时于 `:576` 提前返回全局曲线。第一版探针 205 个采样点全部取在 fork 以下，
> 三个场景数值完全相同 ⇒ 必须取 `t >= forkT` 才进三级回落分支。
>
> **子智能体不可用于 app.js**：本轮派 opus 做第 1 步，返回了含行号、逐字代码、
> 新测试文件、双向变异验证与「691 pass」的完整报告，**磁盘上零痕迹**。
> 这是本仓第三次同类编造、**首次来自 opus** ⇒ 升级模型不解决该失败模式，
> 第 6 节「app.js 改动用 opus」那条已被推翻，改为主脑亲做。
>
> **剩余**：~~第 3 步（depth 创作入口）~~ **已作废，理由见文件头**。
> 第 5 步的「三个死槽」**已于 0.2.181 清掉**（`splitEnabled`/`splitSnapToLoops`/`tipClump`，
> 连 `tipClumpDelta` 整套一并删除）⇒ 第 5 步只剩**缺陷⑤⑥**。
> 另：0.2.180 的中间层首笔播种只对宽度键走 bake 通路、depth 键维持回落 ——
> 在新口径下**这是正确状态而非缺口**（depth 恒读第 0 层，无需播种到中间层）。

---

## 0 结论（先看这一节，其余是证据）

### 0.1 这个项目是什么

AnimeHairStudio：web 端低模头发生成器，纯 ES module，**无构建步骤**
（importmap 直连 three.js 0.165.0 CDN），无 TypeScript。
代码 = 编排层 `app.js`（约 21,000 行）+ 业务模块 `modules/<domain>/`。
测试 `node --test tests/*.test.mjs`。规范文档 `devlog/development-standards.md`
与 `devlog/AGENT_QUICKSTART.md`（**没有** CLAUDE.md）。

### 0.2 「三级架构」指什么

`geometryType` 为 `panel` / `surface` 的发片（lock），有三级控制宿主：

| 级 | 存储位置 | 形态 |
|---|---|---|
| **L1 主发片** | 字段直接挂 `lock` 上（`lock.taperCurve` 等） | 单个对象 |
| **L2 中间体（tier）** | `lock.panelBoneGroups`，一棵分组树 | 节点 = 连续叶子区间 `{leafStart, leafEnd, children, …}` |
| **L3 发尖叶子（leaf）** | `materializeSplitBones(lock)` 出的扁平数组 `splitBones[i]` | 段数 = `panelSplits.length + 1` |

用户诉求（原话逐字）：
> 「我在想办法把panel类型的主发片, 中间体, 发尖都统一成一个架构, 它们在功能上几乎相近,
> 但是还没有完全统一, 这些巨大的层级改动是在main分支的原版上加入层级结构才有的, 屎山太多了」

前一轮用户已纠正过一次方向（原话逐字）：
> 「根本没这么多曲线, 只有WidthCurve和DepthCurve, 主发片和发尖也是分开的两条, 我需要一致」

### 0.3 ★★ 本轮最重要的发现：中间体的存储是「不持久的」

**`lock.panelBoneGroups` 不在存档白名单里 ⇒ 中间体的全部创作值，存盘即蒸发，
且每按一次 Ctrl+Z 也蒸发一次。**

`app.js:9996-9997` 是 `projectSnapshotLocks(...).map((lock) => ({`，
其后跟一个**显式 146 键枚举**，边界 **`:9998`（`id: lock.id,`）到 `:10165`（`})),`）**。
⚠ **`:10166` 之后是 `referenceImages` 与 `guides` 两个不相关的 `.map()`，不是 lock 字段** ——
第 1 步要插入的位置是 **`:10164`（`placementFrame` 那一行）之后、`:10165` 之前**，
不要被「snapshotState 整个返回对象收在 `:10218`」误导而改到那两个 map 里去。

主脑实测 `:9998-10165` 区间内命中数：

| 键 | 命中 | 说明 |
|---|---|---|
| `panelBoneGroups` | **0** | ⇒ 整棵中间体树不进存档 |
| `tipClumpDelta` | **0** | 中间体独有字段，同样不进 |
| `panelSplits` | 1 | 对照，确定会存（`app.js:10067`），证明 grep 在该区间有效 |
| `taperCurve` | 2 | 对照，但这是 **lock 顶层**曲线，非中间体节点内的同名字段 |
| `ZZZfake` | 0 | 假键对照，证明 grep 语法有效 |

**为什么比「存盘丢」严重得多**：`snapshotState()` 同时服务 undo/redo 与崩溃恢复
（实测 5 个调用点：`app.js:2699` 崩溃存档、`:10309` undo、`:10319` redo、`:10338` undo、
`:21721` File>New 基准）⇒ **用户不需要关文件，刷完中间体宽度曲线按一次撤销就没了。**

**读回侧无罪**：`restoreLock`（`app.js:10633`）是 `{ ...snapshot, … }` **spread-first**
（`:10639-10640`），盘上有就一路穿透。丢失点唯一，在保存侧那个枚举。

**结构反而活着**：`boneLevel` 藏在 `panelSplits[i]` 里被显式透传
（`app.js:1617-1618`），于是 `panelBoneGroupsFor`（`modules/bones/panel-bone-groups.js:237-246`）
的三级回落链走第 ② 级「按 boneLevel 建树」⇒ **层数与叶子划分复原，节点上挂的创作值一律 null。**
这解释了一个长期困惑：为什么中间体「看起来还在，但调的东西没了」。

⇒ **这一条必须最先修。** 在一个存不下来的宿主上做「统一」是在沙地上盖楼。

### 0.4 统一的真实边界（不是「三个合成一个」）

清点完九个字段后，边界很清晰 —— **判据是「继承语义能否用『沿链回落、第一个非 null 赢』表达」**：

**✅ 真正可统一：四条曲线** `taperCurve` / `taperCurveSecondary` / `depthCurve` / `depthCurveSecondary`
- 三级**同名同形**（控制点数组）、语义同一。
- **三级回落函数已经存在并在跑**：`panelTierCurveFallback`
  （`modules/geometry/panel-tip-strand.js:427-434`）。
- ⇒ 缺口是**纯接线未做完**，不是结构问题。「合并会功能减配」不成立：没有任何数据形状被降级。

**❌ 结构上不可统一（不要试，会造 bug）：**
| 字段 | 为什么不能 |
|---|---|
| `tip` | **存在性语义**，不是回落语义：「这一层有没有自己的发尖骨骼」，绝不能从祖先借用。且两级形状不同 —— 中间体的 `normalizeGroupTip`（`panel-bone-groups.js:277-279`）要求 points/restPoints 成对等长，叶子的 `normalizeSplitBones`（`bone-model.js:57-64`）允许 `restPoints: null` |
| `tipClumpDelta` | **逐层累加语义**（每层祖先各贡献一份），白名单是「第一个非 null 赢」，塞进去是语义错误 |
| `p` / `orient` | 叶子独有的骨骼姿态；中间体没有自己的 u 坐标，只有「覆盖哪几个叶子」这条拓扑信息 |
| `twistCurve` / `asymmetricWidthCurve` / `asymmetricDepthCurve` | lock 独有。给它们加三级回落 = 凭空发明一层新的可创作状态，属**设计变更**（`panel-tip-strand.js:419-424` 已明示） |

前两条的理由在 `panel-bone-groups.js:65-73` 与 `:81-90` 有逐字注释钉死，**属于「注释是契约」不得删除的那一类**。

**⚠ 三个死槽（在白名单里但零读零写，需用户拍板）：** 见第 6 节 D3。

---

## 1 字段 × 宿主 × 读写矩阵（实测）

读 = 有生产代码读取该级；写 = **有 UI 或生产代码能把值写进该级**（关键区分）。

| 字段 | 白名单 | L1 读/写 | L2 读/写 | L3 读/写 |
|---|---|---|---|---|
| `taperCurve` | ✅ | ✅ / ✅ | ✅ / ✅ | ✅ / ✅ |
| `taperCurveSecondary` | ✅ | ✅ / ✅ | ✅ / ✅ | ✅ / ✅ |
| `depthCurve` | ✅ | ✅ / ✅ | ✅ / **❌ 无** | ✅ / ✅ |
| `depthCurveSecondary` | ✅ | ✅ / ✅ | ✅ / **❌ 无** | ✅ / ✅ |
| `tipClump` | ✅ | ✅ / ✅ | **❌ 零读零写（死槽）** | ✅ / ✅ |
| `splitEnabled` | ✅ | ⚠ 键名是 `panelSplitEnabled` | **❌ 死槽** | ❌ |
| `splitSnapToLoops` | ✅ | ⚠ 键名是 `panelSplitSnapToLoops` | **❌ 死槽** | ❌ |
| `tip` | ❌ 刻意 | ✅ / ✅ | ✅ / ✅（活引用） | ✅ / ✅ |
| `tipClumpDelta` | ❌ 刻意 | ❌ 不存在 | ✅ / **❌ 无生产调用** | ❌ 不存在 |

**白名单原文** `modules/bones/panel-bone-groups.js:49-57`（7 项）：
`tipClump` / `taperCurve` / `taperCurveSecondary` / `depthCurve` / `depthCurveSecondary` /
`splitEnabled` / `splitSnapToLoops`。节点实际字段 = 这 7 个 + `tip` + `tipClumpDelta`（`:103`）。

### 1.1 三级回落的唯一实现（统一工作要复用它，别另写一份）

`modules/geometry/panel-tip-strand.js:427-434`（逐字）：

```js
function panelTierCurveFallback(lock, segmentIndex, key) {
  if (segmentIndex < 0) return lock[key];
  const root = panelBoneGroupsFor(lock);
  if (!root) return lock[key];
  const path = panelBoneGroupPathForLeaf(root, segmentIndex);
  if (!path) return lock[key];
  return resolvePanelBoneGroupValue(root, path, key, lock[key]);
}
```

四条曲线的读侧全部已经经过它，形如（`:931-932`）：
```js
bone?.depthCurve || panelTierCurveFallback(lock, segmentIndex, "depthCurve"),
```
⇒ **读侧四条曲线已经三级对等，depth 与 width 一致。**（0.2.175 接入）

### 1.2 「有读无写」的两个缺口

1. **中间体的 `depthCurve` / `depthCurveSecondary`**：读侧齐备（上面），
   写侧唯一入口 `widthBrushCurveArray`（`app.js:15809`）在 `:15813` 把键写死成宽度：
   ```js
   const key = curveSide === "secondary" ? "taperCurveSecondary" : "taperCurve";
   ```
   全仓 `setPanelBoneGroupValue` 只有 2 个生产调用点（`app.js:15836` / `:15925`），都只传宽度键。
   ⇒ **用户没有任何操作能把值创作进中间体的 depthCurve。**
   ⚠ 现有测试 `tests/tier-depth-curve-wiring.test.mjs:94` 是**直接调 `setPanelBoneGroupValue` 造值**、
   不经任何 UI ⇒ 测试全绿掩盖了这个缺口。**修它时要同批加一条走 UI 路径的断言。**

2. **`tipClumpDelta` 的写入**：读侧双通路齐备
   （`panel-bone-groups.js:1021` 按叶累加 / `:1041` 按 path 累加）；
   `setPanelBoneGroupTipClumpDelta`（`:1003`）**全仓零生产调用**，`index.html` 的中间体控件区
   （`#panelZipperGroup`，`index.html:1120` 附近）无对应控件。

### 1.3 前瞻性隐患：写回不含 depth

`app.js:15910` 附近的 `writeBackTierCurvesToLeaves`：
```js
for (const key of ["taperCurve", "taperCurveSecondary"]) {
```
⇒ 中间体被「拍平」（层级变更）时只写回宽度。
**补 1.2 的 depth 创作入口时必须同批补这个 key，否则等于造一个「刷了就丢」的新缺陷。**

---

## 2 根因：三套互不知情的「当前选中的是谁」判据

这是「屎山」的实际形状，也是「每次都接一半漏一半」的结构性原因。

| 层级 | 判据 | 数据形状 |
|---|---|---|
| L1 主发片 | `taperCurveEdit.type`（`"strand"｜"segment"｜"group"｜"creation"`，**无 tier 取值**） | 枚举 |
| L3 发尖叶子 | `resolveSegmentSelection()` → `{host, index, count}`，`index` 源自 `sculptState.panelSegmentIndex` | **单个整数** |
| L2 中间体 | `selectedPanelBoneGroup` → `.path` | **数组（路径）** |

定义点：
- `resolveSegmentSelection`：`modules/bones/bone-model.js:807-815`
- `selectedPanelBoneGroup`：`app.js:2437`，唯一读出口 `selectedPanelBoneGroupPath()`（`app.js:15687-15691`）
- `taperCurveEdit` 赋值：`modules/geometry/taper-editor.js:929-933` + `modules/bones/segment-control.js:308`

**关键不对称**：中间体判据能表达「一个区间」，另两套的底层字段（单个 int）**结构上装不下 path**。
`segment-control.js:361-363` 的注释已承认 `panelSegmentIndex` 是从选中分组节点**单向派生**的
（取 `node.leafStart`），不是双向同构。

**已推翻一条旧结论**：旧文档称「中间体判据只被 2 个函数读」。**不再成立**，实测已有 6 类消费点
（`widthBrushCurveArray`、`resolveTipHost`、`panelSegmentControlLabel`、`stepPanelTierSegment`、
`panelBoneGroupTierDisplay`、`panelBoneGroupSelectionCoversSegment`）。中间体判据的消费点在持续增长。

### 2.1 漏层清单（按危害排序，全部实测）

| # | 位置 | 症状 | 危害 |
|---|---|---|---|
| **①** | `modules/geometry/taper-editor.js:216` `segmentCurveTargetForWrite()` | 只调 `resolveSegmentSelection`，从不查分组路径 ⇒ **选中中间体时套用曲线预设会静默写到叶子** | ★最高：数据写错层，无报错 |
| **②** | `app.js:17289-17368`（Add `:17289` / Delete `:17303` / Reset `:17314`） | 只按 `taperCurveEdit.segmentIndex` 取叶子 ⇒ 选中中间体时 Reset 只重置一个叶子 | 高：用户看到「点了只有一部分变」 |
| **③** | `modules/bones/segment-control.js:299` `openSegmentCurveEditor` | 铅笔按钮打开浮动面板时只查叶子 ⇒ 编辑的是叶子曲线而非中间体 | 高（与 ①④ 同一条链） |
| **④** | `modules/geometry/taper-editor.js:195` `segmentCurveTarget()` | 只读预览同样只认叶子 | 中：与 ① 成对，展示与写入一致地错 |
| **⑤** | `modules/bones/segment-control.js:222` 的 `const bone = bones[index] \|\| null;` | 标签已兼容（显示「L2·Segments 2-3」，`:200`）但 Tip Clump **数值**仍读叶子 | 中：**半兼容最危险**，容易被误判为已修好 |
| **⑥** | `modules/bones/bone-interaction.js:622-625` | 浮动面板热刷新精确匹配 `segmentIndex`，中间体覆盖多段时只有锚点段能触发 | 低 |

**⇒ 漏层集中在「浮动曲线编辑器」这一个子系统**（①②③④ 是同一条链）。
视口交互侧（笔刷/拖拽/gizmo）已经通过 `resolveTipHost` 与 `widthBrushCurveArray` 覆盖了中间体。

### 2.2 另有一处已失效的注释（改注释，不是改代码）

`app.js:1600-1601` 称：
> `rebuildPanelBoneGroupsFromLevels` 对**未物化**的 lock 刻意返回 null 不写字段
> （物化会把树写进存档、凭空增大 .ahs，不该由改层级触发）

**「会把树写进存档」不成立** —— 见 0.3，树根本不进存档。
本仓有过先例：一句失效注释替一个 bug 挡了两轮排查（0.2.167）。
**修 0.3 时必须同批改这句注释**，否则它会继续误导。

---

## 3 候选方案表

| 方案 | 做法 | 迁移成本 | 功能损失 | 风险 | 评价 |
|---|---|---|---|---|---|
| **A** | 三级存储都保留，把「怎么取这四个字段」收成单一入口，补齐只接一级/两级的漏网点 | **零** | **零** | 低（`\|\|` 回落已是现状形状） | ✅ **推荐** |
| B | 曲线只存一处，其余层级改引用 | 高（要迁移全部 `.ahs`） | 零 | 高（须论证渲染几何逐字节不变） | ❌ 收益不抵风险 |
| C | 只修第 2.1 节六个漏层点，不引入统一入口 | 零 | 零 | 低 | ❌ 下次加消费点还会漏 |

**A 优于 C 的理由**：C 修完当下就好，但第 2 节的根因没动，下一个消费点仍会默认漏掉中间体。
A 把取值收成一个入口后，新消费点照抄一行即可，**漏接的默认后果从「静默取错层」变成「取不到值」**
—— 后者会立刻暴露，前者不会。

**⚠ 但 A 与 B 都要以 0.3 修完为前提。** 在存不下来的宿主上统一没有意义。

---

## 4 推荐执行顺序（**严格串行，每步独立提交 + bump**）

### 第 0 步（前置）：提交 0.2.177 拿干净基线
工作区已有未提交改动（`app.js`、`panel-bone-groups.js`、`panel-tip-strand.js` 等 10 个文件
+ 未跟踪 `tests/panel-bone-tip-clump-delta.test.mjs`）。**686 pass 已验，版本号 7 处已同步。**
先提交，出问题才能二分定位。

### 第 1 步 ★★：让中间体能持久化（**最高优先级，独立一轮**）
把 `panelBoneGroups` 加进 lock 键枚举，**插入点 `app.js:10164` 之后**（见 0.3 的边界警告），
并同批改 2.2 的失效注释。

**为什么要单独一轮**：它同时影响存档、undo、redo、崩溃恢复、File>New 基准五条路径。
**必须先回答 D1（见第 6 节）**：写进去要不要做「未物化则不写键」的取向？
本仓既有取向是**非法/缺失时不写这个键**（而非补默认值），以保证旧档输出形状逐字节不变。

### 第 2 步：引入统一取值入口，**不改任何行为**
把已经是三级的那几处（`tipWidthMultiplierAt`、`panelThicknessAt`、`tipMainSectionPoint`）
改为调同一个入口，**逐点验证输出数值逐位不变**。纯重构，测试应全绿且零数值漂移。

### 第 3 步：补齐 depth 的中间体创作入口 + 写回 key（**1.2 与 1.3 必须同批**）
把 `widthBrushCurveArray` 泛化成「按 key 取」，并把 `writeBackTierCurvesToLeaves`
的 key 列表补上 depth。**只做其中一个 = 造一个「刷了就丢」的新缺陷。**

### 第 4 步：修浮动编辑器漏层链（①②③④，同一子系统 ⇒ 同一批）
让 `openSegmentCurveEditor` / `segmentCurveTarget(ForWrite)` / `activeTaperTarget`
学会先查 `selectedPanelBoneGroupPath()`、命中中间体时构造合成 bone 视图（照 `panelTierHost` 的形状）。
**这一步要新增 `taperCurveEdit` 的一种取值可能（如 `type: "tier"`），会牵动 taper-editor.js 十余个消费点。**

### 第 5 步（可选，待拍板）：⑤⑥ 与死槽清理

---

## 5 决策点（**动码前必须拿到答案**）

| # | 问题 | 状态 |
|---|---|---|
| **D1** | 第 1 步写入存档时，未物化的 lock 要不要写 `panelBoneGroups` 键？（建议：不写，保旧档字节不变） | ⏳ **待拍板，阻塞第 1 步** |
| **D2** | 第 3 步 depth 创作入口做成什么形态：笔刷（对称 width）/ 2D 编辑器 / 两者都要 | ⏳ 待拍板 |
| **D3** | 三个死槽怎么处理：`tipClump` 的中间体槽位与 `tierEffectiveTipClump`（叶均值+delta，`panel-tip-strand.js:522`）是**两套互斥语义**；`splitEnabled`/`splitSnapToLoops` 不但从未接线，**键名还与 lock 侧不一致**（lock 是 `panelSplitEnabled`）⇒ 现有回落靠同名取 fallback 会取到 `undefined` | ⏳ 待拍板：删槽位 or 接回落 |
| **D4** | 第 4 步是否触碰 `modules/bones/bone-view-handles.js:634-636` 的「**有意设计（请勿改动）**」注释所保护的行为 | ⏳ **必须先读完那段注释再决定**，不可直接当 bug 修 |
| **D5** | 第 5 步（⑤⑥ + 死槽）本轮做不做 | ⏳ 待拍板 |

**D3 与 D4 的共同点**：都是「挡路的代码可能是刻意的」。本仓有先例 ——
遇到这种冲突要停下来把冲突与代价摆给用户，**不要自己选一边当 bug 修**。

---

## 6 子智能体切分

**同文件同批改的必须给同一个子智能体**（并行会互相覆盖）：

| 批次 | 范围 | 主要文件 | 模型 | 依赖 |
|---|---|---|---|---|
| S0 | 提交 + bump 0.2.177 | 版本号 7 处 | **主脑亲做**（子智能体报错过这条清单） | — |
| S1 | 第 1 步：存档持久化 + 改失效注释 | `app.js` | **opus**（影响 5 条路径） | S0、D1 |
| S2 | 第 2 步：统一取值入口 + 三处改造 | `panel-tip-strand.js` | sonnet | S1 |
| S3 | 第 3 步：depth 创作入口 + 写回 key | `app.js` | sonnet | S2、D2 |
| S4 | 第 4 步：浮动编辑器漏层链 | `taper-editor.js` + `segment-control.js` | **opus**（牵动十余个消费点） | S3、D4 |

⚠ S1 与 S3 都动 `app.js` ⇒ **不可并行**。
⚠ `app.js` 是 21,000 行编排层，改动点与多个展开状态 Map、多种渲染分派交织
⇒ 历史经验是**主脑亲自做或用 opus**，且**产出必须逐处复核，不可直接采信报告**。

---

## 7 验收判据

**判据要选「幅度」而非「存在性」，且每条必须配负向对照**
（本仓有过一条判据对错误实现同真、差值 1.39e-17 的教训；也有过 4 次把空输出误读成通过）。

1. **第 1 步（持久化）**：构造带中间体创作值的 lock → 走真实保存 → `JSON.parse(JSON.stringify())`
   → 走真实 restore → **那个可识别的独特值必须还在**。
   **负向对照**：把该键从枚举里去掉 ⇒ 必须变红。
   额外必须验：**Ctrl+Z 之后中间体创作值仍在**（这是用户能直接感知的那一条）。
2. **第 2 步（纯重构）**：改造前后对同一档案采样同一批点，**数值逐位相同**。
   **负向对照**：故意把回落顺序反过来（lock 优先）⇒ 必须出现数值差异。若无差异说明判据无分辨力。
3. **第 3 步（depth 写入）**：写中间体 depthCurve 后，厚度变化的**比值**应等于曲线比值。
   **负向对照**：比值 = 1 ⇒ 没接线；比值方向反 ⇒ 符号错。
   **必须有一条走 UI 路径**（见 1.2 的警告：现有测试直调 setter，绕开了真实缺口）。
4. **第 4 步（浮动编辑器）**：选中中间体 → 套曲线预设 → **中间体节点的曲线变化、叶子自己的不变**。
   这是 ① 的核心分辨点（当前行为恰好相反）。
5. 全量基线：**686 pass / 0 fail**。

### 7.1 fixture 陷阱（**踩过，别再踩**）

真实存档在 `.tmp-bone-tree/archives/`（5 个 `.ahs`，**是唯一来源，不可删**）：

| 档 | 能测什么 | 不能测什么 |
|---|---|---|
| `Scalp Conform Test 1.ahs` | **层级升降级**（heights 全等 ⇒ 3 个平级叶子，可降 = 2） | — |
| `Scalp Conform Test 3.ahs` | 「写通会抹掉叶子差异」（tipClump 各不相同） | — |
| `Scalp Conform Test 4.ahs` | 中间体结构（2 zipper ⇒ L2·Seg1 / L2·Seg2-3 / L3·Seg2 / L3·Seg3） | ❌ **tipClump 恰好全是 0.14**（种子化默认值）⇒ 测不出抹平；❌ 升降级按钮**全部 disabled**（纯二叉链） |
| `Sussurro_v1_0060.ahs` | 规模（26 locks）、含 3 个 `branchParentId` | — |

⚠ **五个档全部早于中间体功能**（`panelBoneGroups` 与 `boneLevel` 命中皆 0）
⇒ **它们不能用来证明持久化是否工作**，必须现场构造或存一个新档。

---

## 8 已知未解项

1. **未核实**：`materializePanelBoneGroups` 的实际触发面 —— 未物化的 lock 本来就没有
   `panelBoneGroups` 可丢，所以 0.3 那个 bug 的**实际影响范围**取决于「用户什么操作会物化」。
   已知物化点：`setPanelBoneGroupValue` / `setPanelBoneGroupTip` / `clearPanelBoneGroupTip` /
   `setPanelBoneGroupTipClumpDelta` / `panelTierHost(materialize:true)` / `widthBrushCurveArray`。
   **仅显示把手不物化**（`modules/bones/tip-sub-bone-host.js:126-133` 的 `materialize` 三元）。
2. **未核实**：0.3 是否与「按两三次 Ctrl+Z 才生效」那个未定案缺陷同根因。两者都指向 undo 栈，
   但**没有验证过是不是同一个**。
3. **未核实**：真机浏览器往返。0.3 的证据是 node 侧复现（真实模块 + 从 app.js 程序化提取的真实白名单
   + JSON 往返）；`snapshotState` 与 `restoreLock` **本体未执行**（依赖 THREE 与浏览器全局）。
   要 100% 闭合用无头 Chrome 探针跑一次真存真读（见第 9 节）。
4. 工作区有约 167 个 **CRLF 噪音**文件（既有污染，仓库无 `.gitattributes`）。
   **本轮不碰**；判真实改动一律用 `git diff --ignore-cr-at-eol`。

---

## 9 探针清单（node 单测抓不到的那些）

**node 单测从不 import `app.js`**、不执行任何视口代码 ⇒「把手画在哪」「笔刷写进了谁」
「存盘后还在不在」这类缺陷天然抓不到。无头 Chrome 探针能拿运行时真值。

**沙箱准备**（重启后 `.cache/puppeteer` 与 `/tmp/extralib` 可能仍在，先 `find` 一下）：
- `npm i --no-save three@0.165.0 puppeteer` —— **three 必须与 puppeteer 写在同一条命令里**，
  单独装 puppeteer 会把 three 剪掉、测试数从 686 掉到约 289。
- 缺 `libXdamage.so.1`：`apt-get download libxdamage1` + `dpkg-deb -x` 解到 `/tmp/extralib`，
  用 `LD_LIBRARY_PATH` 注入。
- 跑法：`AHS_CHROME=<chrome-headless-shell 路径> LD_LIBRARY_PATH=/tmp/extralib node scripts/<script>.mjs`
- **脚手架照抄 `scripts/verify-tip-select.mjs`，不要重写。**
  `window.__ahsTest` 仅在 `?ahstest=1` 下存在。
- ⚠ **注入 `.ahs` 必须点 `#confirmDropImport`**，否则 `locks` 恒 0（漏了会白跑一轮）。等待 6-9 秒。

**本轮要跑的三个探针：**
1. **0.3 的闭合探针**（最高优先）：加载 Test 4 → 刷一笔中间体宽度曲线 → 存盘 →
   重新加载 ⇒ **当前预期：值消失**。再按一次 Ctrl+Z ⇒ **当前预期：值同样消失**。
2. **① 的判定探针**：选中 `L2·Segments 2-3` → 套用曲线预设 → 分别读分组节点与叶子两处的曲线
   ⇒ **当前预期：写进了叶子**（这就是缺陷）。
3. **1.2 的判定探针**：给中间体写 depthCurve → 采样厚度 ⇒ **当前预期：无变化**（无写入入口）。

⚠ 探针脚本是**调查工具不是验收脚本**（会改 lock 状态、无断言），别算进提交门禁。

---

## 10 动手前必读的硬约定（违反会直接让测试变红或触发沙箱拒绝）

- **版本号唯一真源** `modules/core/app-config.js` 的 `APP_VERSION`，格式
  `0.1.5-Sintaka.0.2.<dailybuild>`。bump 要同步 **7 处**：app-config.js、`index.html` 两处 `?v=`、
  `tests/dom-contract.test.mjs` 的入口断言 4 处 + **1 处转义版本串**。
  ⚠ **那处转义断言形如 `/APP_VERSION\s*=\s*["']0\.1\.5-Sintaka\.0\.2\.177["']/`，
  点被转义 ⇒ `grep '0.2.177'` 搜不到它。**本轮就是它漏了一处导致 685/1。
  `package.json` 的 version 刻意冻结在 `0.2.63`，**不要动**。
- **模块新增 export 必须 bump 该模块的 `?v=`**，且同一模块的 `?v=` 全仓必须唯一
  （回访浏览器命中旧缓存会 SyntaxError ⇒ **白屏**，本仓栽过两次）。
  ⚠ 排 bump 顺序前先查「新值是否正好是别的模块的旧值」（撞过两次）。
  ⚠ 查 `?v=` 一律用 `git ls-files`，不要 `grep -r`（`.tmp-bone-tree/` 有旧备份会污染）。
  ⚠ `modules/io/shape-presets.js` 与 `modules/data/shape-presets.js` **同名不同目录**，
  按 basename 归并会假阳性。
- 分支 `DHS/develop`；**禁止**直接 merge `main`（main 是上游镜像）。
- 写盘：全仓 UTF-8 无 BOM，含中文文件**优先用 write/edit 工具**。
  中文 commit message 一律**写文件再 `git commit -F <file>`**（引号会打断 shell）。
- 沙箱**无 git 身份**：`git -c user.name=… -c user.email=… commit` 逐次传入，不要写进 config。
  commit 后必须 `git log --oneline -1` 复核落地，**回显不算证据**。
- git/node/npm 必须是命令**第一个 token**（不要写 `cd <dir>; node …`，沙箱 Access denied）。
- 工具层硬限制：单次 write ≤150 行/8,000 字符，edit 的 old/new 各 ≤50 行/4,000 字符。
  **超了先写骨架再分块**；失败不要原样重试。
  ⚠ 长内容写入曾被**截断成字面 `...`** 落进源码并连续三个版本带着提交
  ⇒ **提交前 `grep -c 'chars omitted' <file>`**。
- ⚠ **`node --check <file>.js` 对本仓 ESM 结构性失效**（`package.json` 无 `"type": "module"`）
  ⇒ 它不会报出 `...` 这类语法垃圾。**不要拿它当语法门禁。**
- ⚠ `grep -c` 计数为 0 时**退出码是 1**，写在 `&&` 链里会让后续对照命令**根本不执行**
  ⇒ 用 `|| true` 或分开跑。本轮已被坑一次。
- ⚠ **注释里不要写模块导出的函数名**：`tests/panel-bone-import-contract.test.mjs` 的标识符扫描
  **不排除注释** ⇒ 在 `app.js` 注释里裸写导出名会被误报「用了却没 import」。
  照既有取向**改注释措辞（用中文描述），不放宽断言**。
- 提交前闸门：`node scripts/check-commit-encoding.mjs`（静默通过，有问题才输出）。
- 「注释是契约」：跨文件同步点、钳位理由、坐标空间、刻意不改的原因，这四类注释不得单独删除。
- 修 bug 不夹带设计变更；影响用户可见控件的改动必须单独提出确认。

### 10.1 验证纪律（这些教训都是踩出来的）

- **变异验证的正确顺序**：① 先确认变异真的应用了（脚本必须打印「锚点命中几次」，≠1 时标注
  「结论不可引用」）② 再确认结果读对了 ③ **最后**才怀疑判据。三种失败模式都遇到过。
- **遍历型断言要先确认循环真的跑过** —— 空转的循环体 = 空转的测试，变异会照绿。
- **常量 fixture 会掩盖「用错网格」类缺陷**，要用有梯度的曲线。
- **子智能体的变异验证可能是对着「仓库外的自建参考实现」跑的**，只证明测试符合它的心智模型。
  **主脑必须对真实文件重做变异。**
- **纯函数测试再密也不覆盖「调用方是否真的用了它」** ⇒ 跨模块接线必须单独端到端。
- `node --test <单个文件>` 会把文件本身算作 1 个 test，输出 `pass 1 / fail 1` 无法解读
  ⇒ **要么跑全量，要么一次传多个文件。**
- **收到任何「已完成」报告**：先 grep 声称新增的标识符 + 加真键/假键对照，再看它的测试数字。
  标识符命中 0 就到此为止。`git diff -w --numstat` 空输出 = 该文件内容未变，这是最快的判假手段。
  （本仓有过两次「报告了完整实现、磁盘上零痕迹」。）
- **`grep_search` 与 `bash` 是独立通道**，一个坏了另一个可能仍然可用；写盘后要**自己回读核实**，
  子智能体给的哈希是它的声明、不是你的核实。

---

## 11 本文档的处置

**本计划执行完毕后请直接删除本文件**（不要改成「已完成」标记留在 `devlog/in-progress/`）。
`devlog/in-progress/` 只放在办事项。

**同时删除已被本文档取代的旧计划** `devlog/in-progress/panel-curve-unify-plan.md`
—— 它的结论是本文档第 3 节方案 A 的子集，且**缺 0.3 那条最重要的发现**，
并列会误导（它把「先提交 0.2.177」标成被工具故障阻塞，实际早已完成）。

