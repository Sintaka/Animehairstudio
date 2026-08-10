# Panel split 尖端子骨骼分析：每 split 段一个「类普通发丝尖端」的子骨骼（0.2.59 规划）

> 目标：让用户能控制 panel 每个尖端的长短和走向；在尖端建立与普通发丝一样的子骨骼部分，以兼容现有工具。
> 分支：0.2.58-panel-split-refactor；关联：unified-bone-model.md（bonesFor/架空）、bone-system-roadmap.md（registry）、split-bone-refactor-plan.md（splitBones）。

## 1. 现状：发丝驱动系统梳理

- **主骨骼链**：所有发丝/panel 都有 `lock.points`（单链控制点）→ `strandGeometryCurve` 建 CatmullRom 曲线 → `strandGeometryFrameAt` 逐帧（切线 y + 外法线 z + twist）。几何 = 沿曲线扫掠 profile。
- **panel split（现状）**：`panelSplits`（zipper position/height）把 panel 在 u 方向切成多段；每段一个 `splitBone`（kind=split）携带 `spread`（相对尖端收窄）+ 每段 taper/depth 曲线 + p/orient（手柄）。几何：段内局部 u' + 每段曲线 + 相对缩放（0.2.59 已根除 crossover）。
- **尖端（现状）**：段尖锁定在 t=1（主曲线末端），只由 spread（收窄比例）+ 每段 taper 曲线（宽度）决定——**长短和走向都不可独立控制**。
- **splitBone 的 p/orient**：目前是视图/手柄数据（未驱动几何，orient 预留）。
- **bonesFor / 架空**：有 split 段或 children 时 main 链 role="root"（层级根），叶子 = split.*/child.*；否则 main 链 role="geometry" 直接驱动。
- **子发片参照**：子发片 = 默认扫掠 + 桥接 + 根部移动优化；子发片有自己的主骨骼链（`child.<id>.i`），根挂在父 main 上（branchParentParameter）。

## 2. 目标系统

- 每个 split 段（zipper 切出的子段）在**尖端**建立 1 个「类普通发丝尖端」的子骨骼：
  - 跟随主骨骼的大体（base 锚在段尖、方向初始沿主切线）。
  - 是真实控制点：用户可拖/转它 → 控制该段尖端**长短**（延伸/缩短）和**走向**（方向）。
  - 复用现有工具（strand 点手柄 / transform gizmo / Move-Rotate）编辑，像普通发丝尖端一样。
- 主骨骼**架空**：段尖子骨骼是叶子、真正驱动尖端几何；主链是层级根。
- **判定**：只有存在 split zipper（`panelSplitEnabled && panelSplits.length>0`）才创建段尖子骨骼；无 zipper 时主骨骼直接驱动（现状，bonesFor main role=geometry）。

## 3. 数据模型

- **方案 A（推荐）**：在 `splitBone`（registry kind=split 条目）顶层加 `tip` 字段：
```
splitBone.tip = {
  points: [{x,y,z}, ...],   // 2–3 个点（base…tip），段尖子骨骼链
  followT: <主链参数，默认 1>,
  rest: { base, direction }, // 跟随主骨骼的 rest 帧（base 在段尖、方向沿主切线）
  active: true               // 是否创建（有 zipper 时）
}
```
- 点存储：世界坐标 + 相对 rest 的 delta 派生（编辑存 delta，类似 branchLocalPoints 思路），rest 随主骨骼热更新重算。
- 持久化：随 `lock.bones`（kind=split）条目顶层 `tip` 写入；旧档无 tip → 派生默认（跟随主骨骼、无 delta）；`splitBonesToData/registryForSave/mirrorBones` 补 tip（镜像翻转 x）。
- bonesFor：`split.<k>` 现有条目已是叶子；tip 子骨骼作为该条目的子信息（或独立 `split.<k>.tip.<i>` 命名，parent=该 split 条目），role=leaf。

## 4. 几何驱动（尖端跟随子骨骼）

- 段尖行（t 接近 1 的最后 N 行）采样改为跟随子骨骼：
  - 尖端中心 = tip.points 的 base→tip 插值（相对主框架 rest 的 delta 叠加）。
  - 尖端方向（截面法线/切线） = tip 方向相对主框架的旋转。
  - **长短**：tip.points 的长度/延伸量控制尖端伸出原 t=1 之外（或缩短到段内）。
  - **走向**：tip 方向旋转尖端行（保持墙 quad/端盖 capEnd 跟随，水密）。
- 段内其余行保持现有 u' + 曲线 + spread（不回归）；spread 仍为相对缩放。
- 与 0.2.55 退化/反射 quad 跳过、焊接、法线平滑共存（尖端跟随应保持非退化）。

## 5. 编辑与工具兼容

- 视口：段尖显示 tip.points 手柄（复用 strand 点手柄/`createSplitControlHandle` 一类的拖点），transform gizmo 支持 Move/Rotate。
- 拖动写相对 rest 的 delta（热更新时 rest 重算、delta 保留——同 branchLocalPoints 的「保留用户偏移」原则）。
- 与现有 segment 手柄（拖 spread）并存：段手柄管宽度/开叉，tip 手柄管尖端长短/走向。

## 6. 实施阶段（每步独立 commit + verify-smoke）

| 阶段 | 内容 | 阻塞 |
|---|---|---|
| S1 | 数据模型：splitBone.tip + normalize/序列化/双写/镜像/快照/stroke；几何仍旧（零行为变化） | 是 |
| S2 | 几何：段尖行跟随 tip 子骨骼（长短/走向）；无 tip 时回退现状 | 是 |
| S3 | 视口：tip 手柄 + gizmo（Move/Rotate）+ delta 编辑 | S2 后 |
| S4 | 判定 + 架空：有 zipper 才创建 tip 子骨骼；bonesFor main role 联动；USDA 导出可选带 tip 关节 | 否 |

## 7. 风险 / 兼容

- 旧档无 tip → 派生默认，视觉零回归；无 zipper 的 panel 零改动。
- 水密拓扑（墙 quad/端盖/焊接/退化跳过）必须保留；尖端跟随需验证 0 NaN、无折叠。
- tip 是控制数据非真实网格骨骼：不新增 mesh，只改尖端行的采样。
- 与 USDA 骨骼导出/未来 skinning 的关系：tip 可作为该段 Skeleton 的额外关节（后续）。

## 8.5 实施状态（0.2.59 已落地，S1–S6）

- **S1 程序化权重字段 ✅**：createPanelStrandGeometry 每顶点算 [mainJoint, segment, weight]；weight = smoothstep((t-forkT)/band)，forkT = 1-max(该段两侧 zipper 高度)，u 方向权重 1（zipper 线硬分配、一发尖一骨骼）；geometry.userData.panelWeights（weld 同步）。无 zipper → 权重 0（主骨骼直接驱动）。
- **S2 尖端子骨骼数据模型 ✅**：splitBone.tip = { points, restPoints, active } 照抄主骨骼尾部拓扑（parentMainIndex = fork 最近主控制点）；normalizeSplitBones/normalizeBone/bonesToData/mirrorSplitBones 保留 tip；splitTipForSegment 派生命 rest = 主尾副本、author 存绝对点 + rest（delta 保留）。
- **S3 尖端几何跟随 ✅**：zipper 以下 final = base + w×(author 链截面 - rest 链截面)；rest 恒等（验证 maxDiff 0）；author 只动本段（seg0 动、seg2 不动）。长短 = 子骨骼链长变化、走向 = 链方向。墙/capEnd/焊接/退化跳过保留。
- **S4 视口编辑 ✅**：每段黄色 tip 手柄（panelTipHandles），视平面拖拽写 bone.tip（rest+delta）；zipper 以上无手柄、spread/曲线照常（上部保持现状）。验证：Front Bangs 1 5 手柄、拖拽移动尖端。
- **S5 关联系统改造 ✅**：splitBone p/orient 预留驱动被 tip 链+权重取代；bonesFor 输出 split.<k>.tip.*（role=leaf）；主骨骼有 split 时 role=root（架空）。
- **S6 USDA 蒙皮 ✅**：Mesh 施加 SkelBindingAPI + rel skel:bindTransforms + skel:joints + primvars skel:joints/skel:weights（vertex）；buildHairUsda 从 panelWeights 计算每顶点 [main, N+segment]×[1-w,w]。0044 导出 3 面板带 binding（修 Houdini "no Skeleton children"）。

**验证**：Sussurro_v1_0041/0042/0044 三档 11/11 smoke；尖端 authoring 保存/重载不丢、镜像翻转、rest 零回归。

### 8.6 选中/高亮交互修复（0.2.59，commit 14d6f2c→18eac4a→待提交）

**症状**：视口不卡了，但「选中不了子骨骼」——鼠标悬浮有高亮强调，点击却没有任何选中效果；拉远时高亮与 panel shader 共面 z-fighting 像素抽搐。

**根因（点击不选）**：
1. 原 pointerdown 的 tip 处理块只在「已有 panelTipSelection」时**取消**选择，从不**创建**选择 → 点击面板体永远无法选中子骨骼（只有点 tip 手柄能选，且之前手柄点击还触发视口冻结）。
2. 更隐蔽：即使 tip 块设置了 `panelTipSelection`，它**不 return**，流程继续落到 select 工具的 selection-marquee 逻辑——marquee 会重新 raycast 所有 strand mesh 并**把当前选中切换成点击点最前面的那根发丝**（实测 0044 中点击 Front Bangs 1 面板体后 `getSelectedLock()` 变成 Back 5）。用户看到的现象就是「选中了但立刻没了/没反应」。

**修复（app.js）**：
- 点击面板体（hover 命中段）→ **toggle 选中**该段 tip 子骨骼；再点同一区域 → 取消、回到主发丝选择（仅当主发丝已选中 + 有 split；无 split 的 panel 不触发；手柄/笔刷/draw/place 工具下不 toggle）。
- tip 块成功处理点击后 `event.preventDefault(); event.stopImmediatePropagation(); return;` —— 不再落到 marquee/选择逻辑，主发丝保持选中。
- overlay `tipHighlightMaterial` 设 `depthTest:false`（`depthWrite:false` 已有）→ 高亮与 panel shader 共面不再 z-fighting 抽搐；overlay `renderOrder:7`、`frustumCulled:false`。
- 之前 overlay index 用 `setIndex(rawTypedArray)` 在 THREE r165 被忽略导致数组为空 → 视口冻结（commit ab8a707），改 `new THREE.BufferAttribute(array,1)`。

**新增回归测试**：`scripts/verify-tip-select.mjs`（依赖 app.js 末尾 `?ahstest=1` 才激活的 `__AHS_TEST_SEAM__`）：
- 加载 0044 → 选中 split panel（Front Bangs 1）→ 找一个**无任何 3D 手柄遮挡**的面板体屏幕点（segment 0、权重>0.5、raycast 所有 handles 均不命中）→ 真实 CDP pointer 事件点击：
  - 点击①：`panelTipSelection={lockId,0}`、主发丝保持选中（不再被 marquee 切换）、overlay visible + `depthTest:false` + opacity 0.62。
  - 点击②：toggle 取消、回到主发丝选择。
  - 全程 0 异常。
- 三档 smoke（0041/0042/0044）11/11、12/12 通过。

### 8.7 双段高亮 + 笔刷下保留 tip UI（0.2.59）

**症状**：
1. 选中一个发尖后，再悬停其它发尖不再出现浮动高亮（`updateTipHighlight` 只渲染一个 target：有 selection 就只画选中段，hover 被忽略）。
2. 切到 Scale Brush 后，高亮 + 控制点 + 骨骼全部消失（`curveObjects.group.visible` 在笔刷下被关；tip 手柄/链线又被 `sculptBrushHelpersSuppressed` 单独关掉）。

**修复（app.js）**：
- `updateTipHighlight`：`selectedSeg` 与 `hoveredSeg` 各自独立求值；overlay 每顶点同时写选中段（fade=weight、material.opacity 0.62）与悬停段（fade=weight×(0.34/0.62) → 有效 alpha 0.34）；两者可同屏。无 selection 时仍走纯 hover 路径（opacity 0.34）。
- `updateCurveObjects` 新增 `tipUiActive = isPanelGeometry(lock) && panelTipSelection?.lockId === lock.id`：
  - tip 手柄/链线 visible 条件由 `!sculptBrushHelpersSuppressed` 放宽为 `(!sculptBrushHelpersSuppressed || tipUiActive)`；
  - group visible 在笔刷下额外 `|| tipUiActive`，且绕过 `sculptBrushShowCurvesInput` 的 checkbox 门（`(brushCurveVisibilityAllowed || tipUiActive)`）——选中子骨骼时笔刷下也显示高亮 + 控制点 + 骨骼；未选中时笔刷下保持原样（不打扰）。
- 主发丝手柄/箭头/split/segment 手柄在笔刷下仍按原逻辑隐藏（`sculptBrushHelpersSuppressed` 未放宽），只有 tip UI 例外。

**回归测试（scripts/verify-tip-select.mjs，14/14）**：
- 双段高亮：选中 seg0 后把 hover 设到 seg1 → overlay aFade 同时覆盖 seg0（32 顶点）与 seg1（64 顶点），opacity 0.62。
- 笔刷保留：点击真实 Scale Brush 按钮（sculpt-scale）+ updateCurveObjects 同步 → tool=sculpt-scale、group.visible=true、tipHighlightMesh.visible=true、11 个 tip 手柄 + 4 条链线可见；切回 select 后点击②仍能 toggle 取消。
- 三档 smoke（0041/0042/0044）11/11、12/12 通过。
## 8. 待确认（实施前）

- tip.points 用 2 点（base+tip）还是 3 点（base+mid+tip，可调曲率）；默认长度取多少（如 0.15×面板长度）。
- 尖端跟随的「行数 N」取多少（如最后 2–3 行）与平滑插值方式（smoothstep）。
- 是否允许 tip 越过相邻段（segment 边界约束，类似 zipper 最小间距）。
