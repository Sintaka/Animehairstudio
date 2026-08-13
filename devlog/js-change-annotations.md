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

## 最近更新（0.2.67）

> Sweep 收窄系数沿脊柱扩散（falloff），修复急弯过渡硬跳变/缺口（分支 codex/0.2.67-sweep-falloff，0.2.66 跟进）：
> - **问题**：0.2.66 的曲率收窄只处理超过阈值的环，弯折处被收窄环与相邻“主曲率较平滑”的未收窄环之间宽度硬跳变 → 突兀 + 过渡 quad 可能产生新缺口。
> - **方案（后处理传播）**：`curve-math.js` `sweepCurvatureResponse` 新增 `falloff` 选项（默认 0=旧行为；`strand-sweep.js` `SWEEP_OVERLAP_DEFAULTS.falloff=3`）。算出 factors/heat 后沿脊柱做三角加权扩散（window=min(floor(falloff), count−1)，w=1−|i−j|/(window+1)），端点钉死 factors=1 / heat=0；`falloff=0` 时输出逐位一致。
> - **接入**：`strand-sweep.js` `sweepSide` + `strand-geometry.js` `createSplitStrandGeometry` / `createHairCardGeometry` 读取 `lock.sweepOverlapFalloff`（0–8 整数，默认 3）并传入。
> - **UI**：`#sweepOverlapPanel` 新增第 4 个滑块 Sweep Overlap Falloff（0–8，默认 3）；hairStore 默认 + ZH/JA 各 +1 key。
> - 回归：core-math 116 pass（+2 新单测）、verify-smoke 10/11=基线。

## 最近更新（0.2.66）

> Sweep 转角过大修复：曲率感知环收窄（防自相交/穿插）+ 转角边缘平滑（分支 codex/0.2.66-sweep-corner-smooth，实施依据 devlog/in-progress/delta-mush-plan.md 主任务）：
> - **曲率感知环收窄**：`modules/geometry/curve-math.js` 新增纯函数 `sweepCurvatureResponse(centers, radii, { strength, safety, minScale })`（相邻三点外接圆半径作局部曲率半径 ρ，factor = max(minScale, 1 − (1 − min(1, safety·ρ/r))·strength)，返回 `{ factors, heat }`，heat 为与 strength 无关的曲率热度）。依据 Elber 1997 / Maekawa 1999 判据（偏置距离 > 曲率半径即自相交），业界惯例 scale = min(1, safety·ρ/r)。
> - **接入点**：`strand-sweep.js` `sweepSide`（普通发丝 + 子发片共用内核）+ `strand-geometry.js` `createSplitStrandGeometry` / `createHairCardGeometry`（独立手写环循环同步接入）。脊柱点不动，仅环剖面按曲率收窄。
> - **边缘平滑**：`curve-math.js` 新增 `smoothSweepChains(vertices, rowCount, columnCount, { strength, iterations, weights, pinRows })`（纵向链 Jacobi Laplacian，按 heat 加权、根环 pinned）；三个 sweep 构建器顶点产出后各跑一遍（iterations=2）。
> - **复用/抽取**：`branch-bridge.js` 内联的桥接均匀平滑（Laplacian）抽成新模块 `modules/geometry/mesh-smooth.js` 的 `smoothMeshVertices(vertices, quads, movable, strength, iterations, positionAt)`，branch-bridge 改调用（860 次随机对照逐位一致）。
> - **UI**：新增 `#sweepOverlapPanel`（strands 组，位于 #branchBridgePanel 之后）3 个滑块：Sweep Overlap Strength（0–1，默认 0.7）/ Sweep Overlap Threshold（0.1–2，默认 0.6）/ Sweep Edge Smooth（0–1，默认 0.3）；per-lock 字段随 .ahs 自动持久化；无选中写 hairState 全局默认；ZH/JA 词典各 +3 key。
> - **默认参数**：`SWEEP_OVERLAP_DEFAULTS` 由 `strand-sweep.js` 导出（单源），UI 与几何共用；strength/edgeSmooth 关到 0 时输出与改动前逐位一致。
> - 回归：core-math 114 pass（+2 新单测）、verify-smoke 10/11=基线、dom-contract 16/89 不变。

## 最近更新（0.2.65）

> 发尖控件 4 项修复（分支 0.2.64-panel-tip-curve，详见 [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md) §8.29）：
> - ① 绿色 spread 手柄视口拖拽热同步 Main 面板 Segment Spread（`updatePanelSplitHandleDrag` segment 分支补 `syncPanelSegmentControls`）；
> - ② 所有段绿色手柄在任一子发尖选中时显示、拖非选中段不切换选中——有意设计，`bone-view-handles.js` 补注释规范化；
> - ③ 绿色手柄位置改跟随 tip trim/curve（`tipSurfaceFrameAt`）+ 沿切线外推 `TIP_SEGMENT_HANDLE_TANGENT_OFFSET=0.08`，不再浮在未 trim 尖端；
> - ④ W 移动 gizmo 可挂发尖子骨骼（gizmo 挂载扩为 move/rotate/scale），translate 用 `solvePulledStrand` 按 fork 以下暴露区整体求解（`beginTipSubBoneTranslate` / `applyTipSubBoneTransform` translate 分支），app.js `dragging-changed` 支持 translate。
> - ⑤ 修复两个遗留问题：W 移动 gizmo 拖点不生效（`beginTipSubBoneTranslate` 漏导出，`bonesApi.beginTipSubBoneTranslate` 为 undefined → translate 分支提前 return）；绿色手柄叠加 authored delta（`points[last]−restPoints[last]`），跟随用户修改的发尖位置（详见 §8.30）。
> - ⑥ 快捷键修复：数字/日期等可键入数值的输入框不再被 1/2/3（workspace）与 q/w/e（工具）快捷键抢占——`focusedControlShouldYieldToShortcut` 把 number/date/datetime-local/time/month/week 视为文本输入（core-math 契约测试同断言）。

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
> - 8.25（0.2.59 进行中）：最边缘段 Segment Spread 自动镜像——`tipWidthSpreadGap` 对无 zipper 的外侧取对侧 zipper（同一 bone.spread/ramp 起点），几何 `uStart/uEnd` 守卫改 `(leftSplit || rightSplit)`，两侧一致收窄、无 UI 展示。详见 §8.25。
> - 8.26（0.2.59 进行中）：① Segment Spread 上限 0-0.99（`SPREAD_MAX`、slider、clamp、`tipWidthSpreadGap` 兜底，防退化面）；② 发尖蒙皮权重改为每侧 zipper 顶为 0 边界、段内 u 线性插值成斜线（新增 `tipSegmentWeightAt`，scale 笔刷不再裂一边）；③ 旋转 gizmo 起始朝向对齐发尖链自身 frame（`updateCurveObjects` 设 tip 手柄 quaternion，拖拽中保留），不再一拖跳回主骨骼朝向。详见 §8.26。

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

