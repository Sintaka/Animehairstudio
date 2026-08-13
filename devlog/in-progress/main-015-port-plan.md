# main 0.1.5 移植计划 / main 0.1.5 port plan

> 状态：**进行中**（2026-08-13，分支 0.2.63-main015-port）
> 原则：**分析后按功能移植，不 merge**（见 development-standards.md「main 上游更新移植（不 merge）」与 main-sync-conflicts.md「Main 更新移植原则」）。
> 基线：`d3358f6`(v0.1.4) → `69f807a`(v0.1.5)，24 文件，+14,099/−683。本地 HEAD 已按域重构，main 仍是扁平结构，故逐功能移植。

## 一、分波策略

| 波次 | 范围 | 处置 |
|---|---|---|
| 第一波（低风险） | 新增纯模块 + 纯函数并入既有模块 + 小 bug 修复 + 测试 | 直接移植/并入，不接 UI |
| 第二波（UI） | 相机（View Cube / Multi-Cam）、浮动面板（数字变换 / 工具设置）、Autosave 调度、Material Presets / Base Gradient 编辑器、Selection Sets 扩展、Panel/Glass 风格 | 在本地架构重新接线 |
| 第三波（单独评审） | Split Panel Tip Curvature、Branch Surface Imprints、Radial pie 子菜单 | 与本地几何模型冲突，暂缓 |

## 二、第一波任务（文件不相交，可并行子智能体）

- A：新增模块 `modules/io/recovery-storage.js`、`modules/geometry/arc-hair-surface.js`、`modules/geometry/branch-knife.js`、`modules/geometry/hair-shell.js`；新增 `tests/*.test.mjs`（6 个）。根 `package.json` 不引入（其 scripts 指向不存在的 verify-project.ps1，web 应用无需）。
- B1：`modules/material/material-state.js` 并入 gradient/preset 纯函数；`modules/core/app-config.js` 加 gradient 默认值 + APP_VERSION=`0.1.5-Sintaka.0.2.63`；`modules/geometry/anime-hair-shaders.js` 加 uBaseGradient/uUseBaseGradient。
- B2：`modules/geometry/topology.js` 并入 `quadCellTopology`/`triangleEdgeMasksFromFaces`；`modules/geometry/compound-strand.js` 并入 zipper 函数；`modules/geometry/radial-layout.js` 并入扇形函数。
- C：`modules/geometry/curve-math.js` 并入 `panelTipCurveParameter`/`panelTipLoopParameters`/`mirroredAsymmetricTaperCurves`；修复 `relaxAngleValue`（mean-angle 跨环绕角）。
- D：`modules/core/shortcut-registry.js` 并入 `pointerControlShouldReturnViewportFocus` + Ctrl+H（与本地 textEntry 版 `focusedControlShouldYieldToShortcut` 融合）。

## 三、第二波任务（UI 接线，app.js/index.html/styles.css 共享，需分批或串行）

- View Cube（`updateCameraViewCube`/`activateView` + index.html + styles.css）
- Multi-Cam（渲染管理 + index.html + styles.css，实验性）
- Numeric Object Transforms 浮动面板（`strandObjectTransformPanel` 系列 + `lock.objectTransform`）
- Autosave 调度接本地保存管线（`markProjectChangedForRecovery`/`queueRecoveryAutosave`）
- Material Presets + Base Gradient 编辑器接本地 `material-ui.js`
- Selection Sets 扩展接本地 outliner
- Panel styles / Glass color / 响应式头部（styles.css 融合）
- Move 曲线控件与本地 Width Curve UI 融合
- Relax Position/Rotation 分离

## 四、决策记录

- 根 package.json 不引入（scripts 引用缺失脚本；`type:module` 已在 modules/package.json）。
- 第一波 bug 修复核对结论：`relaxAngleValue` 本地旧版 → 修复；Guide Capsule 半径保位置本地已修 → 跳过；zipper 硬边本地已用 authored edge masks → 可选收。


## 五、进度记录（2026-08-13）

- `f7ff7a8` Docs：移植原则 + 计划（本文件）。
- `7af449d` 第一波完成：纯模块/纯函数并入 + relaxAngleValue 修复 + shortcut Ctrl+H + 6 tests；verify-smoke 10/11。
- `5b8a785` 第二波 2a：Camera View Cube（复用本地 snapCameraToCardinalAxis/nearestCardinalAxis/cardinalAxisKey）；10/11。
- `eeabd3a` 第二波 2b：Autosave / Crash Recovery（新增 recovery-store，无新顶层 let；Preferences + 恢复对话框 + 三语文案）；10/11。

## 六、剩余待办（下一轮继续派发）

- 第二波 UI 剩余：Numeric Object Transform 浮动面板（用户重点关注）、Multi-Cam（实验性，需渲染循环深度接入）、Material Presets/Base Gradient 编辑器、Selection Sets 扩展、Panel/Glass 风格、Move 曲线控件、Relax 分离。
- 第三波（单独评审）：Split Panel Tip Curvature、Branch Surface Imprints、Radial pie 子菜单。


- `70e989b` 第二波 2c：Numeric Object Transform 浮动面板（lock.objectTransform + 面板 + 序列化/镜像/快照）；10/11。
- `4e083f4` 第二波 2d：Material Presets + Base Color Gradient 编辑器（渐变纹理/编辑器 + 预设持久化 + 偏好备份）；10/11。

## 七、进度修正（2026-08-13 二轮）

- **Relax Position/Rotation 分离已在本地（基线 d3358f6 就带，非 v0.1.5 增量），无需移植**。
- 剩余第二波：Multi-Cam、Selection Sets 扩展、Panel/Glass 风格、Move 曲线控件。
- 第三波（单独评审）不变：Tip Curvature、Branch Imprints、Radial pie。


- `89c2efd` 第二波 2e：Selection Set 成员对话框（选择加入/移出的集合）；10/11。

剩余第二波：Panel/Glass 风格、Move 曲线控件、Multi-Cam；第三波不变。


## 八、剩余项处置策略（用户拍板，2026-08-13）

1. **Radial pie + styles.css（Panel/Glass）**：本地基本没动过、属原版功能；作者在 0.1.5 大幅更新过，**可直接替换**（吸收 main 版本 + 本地模块化适配 + 保留本地少量增强）。
2. **Width Curve / Move 曲线控件**：本地发尖系统曾单独抄了一份曲线控件后融合；**不替换**，把 main 相对原版 curve 系统的新功能 + bug 修复**移植到本地**。先排查本地 Width Curve。
3. **Multi-Cam**：新功能；重点是把原版逻辑适配到本地模块化系统（本地 camera 未大改，仅拆分）。
4. **Split Panel Tip Curvature**：与本地冲突最严重，**最后做**；先深度评估它在原版基础上改进了什么，再评估哪些可移植。

## 九、本地 Width Curve 排查结论（2026-08-13）

- 数据模型（基线 v0.1.4 + 本地增强）：`lock.taperCurve/taperCurveSecondary`（宽度）、`depthCurve/depthCurveSecondary`（深度）、`asymmetricWidthCurve/asymmetricDepthCurve`、`twistCurve`；发尖子骨骼每段 `bone.depthCurve`（本地 0.2.60）。
- 视口宽度边缘线：`strandWidthEdgeSample(lock,t,side,frameOverride,curveOverride)`（app.js:10950）与 `strandWidthEdgePoints(lock,side)`（app.js:10973）——**仍是基线旧签名，没有 main v0.1.5 的 `dimension`（width/depth）参数**。
- 曲线编辑 UI：`taperCurveEditor` DOM（app.js:3091–3106）+ `modules/geometry/taper-editor.js`（G5 拆分，1061 行）。
- main v0.1.5 的 Move 曲线新增：`moveCurveControlsApplicable/syncMoveCurveControls/setMoveCurveControlVisibility/setMoveGrabHandleVisibility/setSelectedMoveCurveShapeFlag/moveGrabHandlesApplicable`；并把 `strandWidthEdgePoints/Sample` 加 dimension 支持 width/depth。
- 结论：Width Curve 移植 = 给本地 `strandWidthEdgePoints/Sample` 加 `dimension` 参数 + 引入 main 的 move 曲线控件函数接到本地 taper/width-edge 视口控件；**不替换本地 taper-editor/宽度曲线 UI**。
