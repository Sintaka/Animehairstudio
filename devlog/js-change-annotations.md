# JS 改动标注

<!-- 本文件已按子系统拆分：详细条目见 devlog/annotations-*.md；时间线见 devlog/local-adaptation-log.md。 -->

## JS 改动标注 / JS change annotations

> 以 main 分支（原版本）为基准，记录本地适配的差别/新增功能。
> 详细条目见各子系统文件，时间线见 local-adaptation-log.md。

## 子系统索引（先 grep 关键词，再跳读对应条目，不要全文顺序读）

| 子系统 | 关键词 / 函数（app.js 行号可 `Select-String` 定位） | 对应条目 | 条目文件 |
|---|---|---|---|
| 子发片桥接（几何）/ 父发片挖洞 | `buildBranchBridgeGeometry` / `createBranchChildGeometry` / `applyBranchRootRegionCarving` / `holeBoundary` / `connectSide` | 2.2、2.4a→2.4t、0.2.43–0.2.44 | [annotations-bridge.md](annotations-bridge.md) |
| Region 选区 / 面板 | `branchRootRegion` / `normalizeBranchRootRegion` / `syncBranchRootRegionOffsets` / `updateBranchRootRegionCenter` / `branchRegionNavAction` | 2.1、2.4u–2.4w、2.5–2.14 选区相关、0.2.40–0.2.47、0.2.52–0.2.53 | [annotations-region-panel.md](annotations-region-panel.md) |
| 根骨骼 gizmo / twist / H 模式 | `captureBranchLocalState` / `pointerHitsTransformGizmo` / `branchRootGizmoFrame` / `strandControlPointFrame` / 扫掠起始手柄 | Phase 2.15–2.16、0.2.23–0.2.42 | [annotations-root-bone.md](annotations-root-bone.md) |
| split 父发片兼容 | `splitFusedGrid` / `parentSupportsTopologyConnect` / `createSplitStrandGeometry` | 0.2.49–0.2.51 | [annotations-split.md](annotations-split.md) |
| 刘海 / 面板线框三角面显示修复 | `createPanelStrandGeometry` / `addQuad` / `triangleEdgeMasks` / `authoredEdgeMasks` | 0.2.54–0.2.56 | [annotations-display-fixes.md](annotations-display-fixes.md) |
| 日常适配（保存/导出、语言、导航、笔刷、拖放、材质、快捷键等） | `saveHairProjectQuickly` / `exportHairProjectQuickly` / `localization.js` / Navigation style / `sculpt-brush.js` / `server.js` | 顶部条目、v0.1.4 迁移、0.2.48 | [annotations-adapt.md](annotations-adapt.md) |
| Panel Split 骨骼化 / 尖端子骨骼 / 统一骨骼模型 / 子发片扫掠 | `lock.splitBones` / `bonesFor` / `sweepStrandGeometry` / `createPanelStrandGeometry` / `createBranchChildGeometry` | 0.2.59 已实施（P1/P2 与 Phase A/B/C 落地；尖端子骨骼 + 修复 + 本轮 5 项见右） | [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md)（**权威当前状态** §8.5–§8.9）+ [in-progress/bone-system-roadmap.md](in-progress/bone-system-roadmap.md) + [in-progress/split-bone-refactor-plan.md](in-progress/split-bone-refactor-plan.md) + [in-progress/unified-bone-model.md](in-progress/unified-bone-model.md) + [in-progress/child-sweep-unification.md](in-progress/child-sweep-unification.md) |

> 新 agent 先读 `devlog/AGENT_QUICKSTART.md`；本文档只作索引，不要全文顺序读。

## 最近更新（0.2.59）

> Panel split 尖端子骨骼系统已落地 + 本轮 UI/交互收尾（详细记录见 [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md) §8.5–§8.9，权威当前状态）：
> - 已实现：程序化权重字段（panelWeights）+ `splitBone.tip` 链 + 每段 tip 手柄/高亮 + USDA SkelBindingAPI 蒙皮 + `bonesFor` 只读骨骼视图 + `lock.bones` registry 双写；§8.6–§8.8 修复：点击 toggle 选中 + 保持主发丝、overlay z-fighting、双段高亮、笔刷保留 tip UI、边界段 tip 链、orient/scale 统一变换、undo tip 持久化、笔刷 bones-only、alt+点击切换。
> - 本轮（0.2.59 进行中）：发丝悬停改柔和橙色高亮（hoverOutline）、切换主选中清旧 tip 选中/高亮、alt+点击仅真点击触发、tip 子骨骼完整切线/副切线/法线帧（orient 旋转几何）、修复选中发尖后 Push 笔刷。
> - 8.19（0.2.59 进行中）：发尖 WidthCurve 修复——① `tipWidthEdgePosition` 的 `lateral` 改用发尖自己 authored 宽度轴（dq*主帧x）并把 baseEdge 提到前表面 shell=1，消除拖拽方向 7°~170° 倾斜的「梯形」手感；② `sampleAsymmetricTaperCurve`（modules/geometry/curve-math.js）由 u<0 硬切分改为线性插值（u=0=左右均值，主面板/strand 非对称一致受益）；③ 拖拽去重（begin 只 materialize 一次并复用 `tipWidthBones`、`setTipWidthCurveValue` 只重建编辑侧曲线）。详见 in-progress/panel-split-tip-bones.md §8.19。
> - 8.20（0.2.59 进行中）：发尖 WidthCurve 拖拽方向真正根因修复——旧实现复用主面板宽度采样（绝对 u、以主中心 u=0 分界），宽度变化沿 `frame.x×edgeU + frame.z×camber(edgeU)` 移动（左半段反向、窄段 camber 主导）→ 手柄沿主骨骼线运动。改造为 tip-relative：几何/UI 的段宽度以段中心为参考（`(u-centerU)×半宽 + centerU×全局半宽` 对齐），camber 固定全局曲线（宽度只改横向）；`splitTipForSegment` rest 链改用全局曲线（稳定基准）；`buildTipWidthCurve` 不再烘焙锁定区网格（采样回退全局），曲线每侧 7 点且全可见；拖拽轴 = `dq×主帧x`。实测全部段/侧 maxAngle=0°。详见 §8.20。
> - 8.21（0.2.59 进行中）：体验优化 4 项——① tip 端 t=1 绿色控制点暴露（`tipWidthControlTs` 6 个位置、手柄数 +1）；② Segment Spread 0–1 + 线性聚合（SPREAD_MAX/slider/clamp 全改 1，`segmentRamp` smoothstep→线性）；③ 调 spread 绿点/曲线跟随几何（共享 `tipWidthSpreadGap`，几何 uStart/uEnd 与 `tipWidthEdgePosition` 同用，不缩放）；④ 两侧等距分布基于最深 zipper（`tipWidthCommonForkT`），短侧低于本侧 fork 的控制隐藏但数据保留，zipper 上拉重新暴露。详见 §8.21。
> - 8.22（0.2.59 进行中）：发尖 WidthCurve 浮动面板 4 项修复——① 视口拖拽后浮动面板同步刷新（tipWidth 拖拽分支调用 `renderTaperCurveEditor`）；② Reset 预设改为全 1（`tipWidthResetCurve`，segment 宽度曲线）；③ Asymmetric 混合改为窄带（`sampleAsymmetricTaperCurve` 加可选 `blendZone`，发尖传 0.25，外侧纯本侧曲线不再带动另一侧）；④ 非对称改为 Ctrl 触发（默认等比对称写两侧、Ctrl 只写一侧；`beginPanelSplitHandleDrag` 允许 tipWidth 手柄带 Ctrl；segment 编辑器隐藏 Asymmetric/Center 开关 + 小字 Ctrl 提示）。详见 §8.22。
> - 8.23（0.2.59 进行中）：5 项深入修复——① Reset 整段全 1（同时重置两侧、`tipWidthResetCurve` 覆盖 [0,1]、`tipWidthMultiplierAt` 曲线从 0 开始时不回退全局、`buildTipWidthCurve` 保留 0 点）；② 对称拖拽两侧直接写同一值（不再按起始比例，消除 2x/延迟）；③ 视口拖拽后右侧 `segmentTaperPreview`（syncPanelSegmentControls）+ 浮动面板都热更新；④ 宽度移动方向改为与发尖子骨骼自身法线垂直（新增 `tipChainFrameAt`，lateral/把手位置用链横向），旋转模式加法线向上箭头；⑤ rotate/scale 工具下 tip 子骨骼手柄挂到 transform gizmo（`beginTipSubBoneRotate`/`applyTipSubBoneTransform`），select/move 保持拖拽。详见 §8.23。
> - 8.24（0.2.59 进行中）：① 鼠标在浮动面板上不再触发头发/发尖高亮（`pointerOverTaperEditor` 守卫）；② 回退 coversWhole——Reset 后未暴露控制区（Zipper 上半部分）始终跟随主骨骼全局宽度，不再开裂；③ 发尖子骨骼 orient 跟随主发片表面曲率（新增 `tipSurfaceFrameAt`，rest 链改用表面帧；tip 点是 rest+delta，rest 生成修正后旧 .ahs 数据自动用新基准）；④ 浮动面板 segment 曲线点可拖动（`activeTaperTarget` 复用 live lock.splitBones）且只允许拖动暴露点（`data-tip-hidden` 拦截）。详见 §8.24。

## 最近更新（0.2.54–0.2.56）

> 三片大刘海（Front Bangs）视口/线框三角面观感修复（几何与导出始终是四边面，均为显示层问题）：
> - 0.2.54：刘海（split 父发片）挖洞后未同步裁剪 `triangleEdgeMasks`，线框按错位 mask 描对角线 → 挖洞重建后同步裁剪（maskLen==三角形数）。
> - 0.2.55：面板 Split 开口处退化/反射折叠 quad（零面积 / 二面角 179–180°）导致视口着色三角观感 → `createPanelStrandGeometry` 的 `addQuad` 跳过退化与折叠 quad（含排查记录）。
> - 0.2.56：`createPanelStrandGeometry` 结尾绕序翻转未同步交换 `triangleEdgeMasks`，mask 错位导致所有 panel 线框画对角线 → 翻转后同步交换 mask [1]/[2]。
> 详细条目见各子系统文件，时间线见 local-adaptation-log.md。

## 条目文件

- [annotations-bridge.md](annotations-bridge.md) —— 子发片桥接几何 / 父发片挖洞（2.2、2.4a→2.4t、0.2.43–0.2.44 等）
- [annotations-region-panel.md](annotations-region-panel.md) —— Region 选区 / 面板（2.1、2.4u–2.4w、0.2.40–0.2.47、0.2.52–0.2.53 等）
- [annotations-root-bone.md](annotations-root-bone.md) —— 根骨骼 gizmo / twist / H 模式（Phase 2.15–2.16、0.2.23–0.2.42 等）
- [annotations-split.md](annotations-split.md) —— split 父发片兼容（0.2.49–0.2.51）
- [annotations-display-fixes.md](annotations-display-fixes.md) —— 刘海 / 面板线框三角面显示修复（0.2.54–0.2.56）
- [annotations-adapt.md](annotations-adapt.md) —— 日常适配（保存/导出、语言、导航、笔刷、拖放、材质、main 合并 0.2.48、server.js、Local 选项移除、快捷键等）

> 详细条目见各子系统文件，时间线见 local-adaptation-log.md。

