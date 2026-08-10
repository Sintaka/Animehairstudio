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
| Panel Split 骨骼化 / 尖端子骨骼 / 统一骨骼模型 / 子发片扫掠 | `lock.splitBones` / `bonesFor` / `sweepStrandGeometry` / `createPanelStrandGeometry` / `createBranchChildGeometry` | 0.2.59 实施中（P1 骨骼模型 / P2 扫掠统一） | [in-progress/split-bone-refactor-plan.md](in-progress/split-bone-refactor-plan.md) + [in-progress/unified-bone-model.md](in-progress/unified-bone-model.md) + [in-progress/child-sweep-unification.md](in-progress/child-sweep-unification.md) + [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md) |

> 新 agent 先读 `devlog/AGENT_QUICKSTART.md`；本文档只作索引，不要全文顺序读。

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

