# sculpt 几何迁出 — 函数引用图（几何域批次 G6）

> 目标：把 app.js 中 sculpt 笔刷的「几何采样 / 变形 / 光标 / 可行性平面 / 调试曲线 / 几何重建调度」业务函数迁到 `modules/geometry/sculpt-geometry.js`（`createSculptGeometryApi(deps)` 依赖注入），app.js 只保留 DOM 监听、pointer 绑定、boot 调用与脊柱接线。
> 执行（分析）：2026-08-12 · 分支 `0.2.59-refactor` · 只读分析，未改动 app.js/modules/*。
> 行号口径：**`devlog/FUNCTION_INDEX.json`（2026-08-12 07:40 快照，app.js 29,100 行）** + `git show HEAD:app.js`（16d3d26，29,100 行）逐字节复核。本文「行号」均为该 29,100 行口径。
> ⚠ 并发批次：分析期间**并发的 G2+G3 strand-geometry 批次**正在修改工作区，已于分析尾声提交为 `073a0da`（app.js 现在 28,230 行 / 28,229 PowerShell 行）。G6 候选函数均未被该 diff 触碰，仅整体上移：debug 簇（L17128-17174）偏移 **-892**，调度簇（L17920-17954）与主簇（L27107-28055）偏移 **-870**（实测：`applySculptMoveStrokeSample` 27746→26876、`editableStrandWidth` 27107→26237、seam 29043→28173）。执行批次时基于当前 HEAD 重新定位即可。

## 0. 边界判定（关键）

- **迁出 34 个函数（769 行）**，按主题归为 3 个连续簇 + 1 个共享助手块：
  - 簇 A（sculpt 调试曲线几何）：L17128-17174（5 个 + 1 死桩 const）
  - 簇 B（sculpt 几何重建调度）：L17920-17954（3 个 + 2 const）
  - 簇 C（宽度/光标/平面/可行性/采样/变形）：L27107-28055（26 个）
- **不迁移（边界存疑，留在 app.js，报回）**：
  1. **B2 骨骼笔刷**：`applySubBoneBrushSample`（27601-27744）、`updatePanelTipHover`（27571-27599）、`prepareCurvePointSelection`（26963-27072）、`begin/update/endPanelSplitHandleDrag`（26075-26452）、`beginTipSubBoneRotate/applyTipSubBoneTransform`（26013-26073）——骨骼批次 B2，但 B2 消费 G6（见 §6 重接 + §8 存疑）。
  2. **hover/选择簇**（Godel 区间下沿混入，非 sculpt 几何）：`isHairCreateTool`（27526）、`syncStrandHoverOutline`（27530）、`pointerOverTaperEditor`（27543）、`updateStrandBrushHover`（27550）、`strandControlPointHit`（28057）、`begin/update/finishStrandWidthEdgeDrag`（28061/28139/28173）、`setHoveredStrandWidthEdge`（28213）、`updateStrandWidthEdgeHover`（28226）、`setHoveredControlPoint`（28265）、`visibleControlPointHoverTargets`（28278）、`updateControlPointHover`（28314）——约 15 函数 ~304 行，属 hover/selection 域，建议独立批次或暂留。
  3. **sculpt 工具态/UI**（L5827-5878）：`sculptBrushToolActive`/`sculptBrushSelectionMaskActive`/`sculptBrushSelectionAllows`/`effectiveSculptBrushTool`/`updateSculptScaleModeRow`/`syncSculptBrushToolButtons`/`setSculptBrushShiftSmoothHeld`——G6 的 dep，不迁；`updateSculptBrushDockCompact`（24898）纯 UI，不迁。
- **Godel「约 32 函数 / ~860 净减」口径差异**：Godel 盘点区间（32,530 行口径 L30538-31695 ≈ 现 L27107-28314）把相邻 hover/宽度簇（~304 行）与 B2 笔刷（applySubBoneBrushSample+updatePanelTipHover ~173 行）一并计入；本批按任务定义只取 sculpt 几何，34 函数 769 行（含 3 个可选 UI 胶水与 4 个共享宽度/光标助手，见 §8）。

## 1. 迁出函数清单（34，快照行号）

| # | 函数 | 行号 | 类型 | 行数 | 批内互调 / 备注 |
|---|---|---|---|---|---|
| 1 | setSculptBrushMaterialClipping | 17132-17137 | function | 6 | 随迁 const sculptBrushCurveClippingPlanes |
| 2 | sculptBrushDebugCurveVisible | 17139-17149 | function | 11 | 批内：sculptBrushEditableLock/sculptBrushLockViable |
| 3 | refreshSculptBrushDebugView | 17151-17154 | function | 4 | |
| 4 | refreshSculptBrushDebugAfterStateRestore | 17156-17160 | function | 5 | 批内：updateSculptBrushViabilityPlane/refreshSculptBrushDebugView |
| 5 | updateSculptBrushDebugCurve | 17162-17174 | function | 13 | 批内：sculptBrushDebugCurveVisible |
| 6 | scheduleSculptBrushGeometryUpdates | 17920-17926 | function | 7 | 批内：flushSculptBrushGeometryUpdates |
| 7 | queueSculptBrushGeometryUpdate | 17928-17932 | function | 5 | 批内：scheduleSculptBrushGeometryUpdates |
| 8 | flushSculptBrushGeometryUpdates | 17934-17954 | function | 21 | dep：rebuildLockGeometry |
| 9 | editableStrandWidth | 27107-27117 | function | 11 | 共享助手（宽度边缘/B2 也消费） |
| 10 | editableStrandWidthBounds | 27119-27123 | function | 5 | 批内：applyEditableStrandWidth |
| 11 | applyEditableStrandWidth | 27125-27159 | function | 35 | 批内：editableStrandWidthBounds |
| 12 | viewportPixelPoint | 27161-27167 | function | 7 | 共享助手（B2/宽度边缘也消费） |
| 13 | syncSculptBrushControls | 27169-27182 | function | 14 | 光标几何/UI 胶水（可选） |
| 14 | syncSculptBrushStrengthForActiveTool | 27184-27190 | function | 7 | UI 胶水（可选） |
| 15 | updateActiveSculptBrushStrength | 27192-27198 | function | 7 | UI 胶水（可选） |
| 16 | updateActiveSculptBrushPreserveTips | 27200-27204 | function | 5 | UI 胶水（可选） |
| 17 | sculptBrushPlaneOffset | 27206-27208 | function | 3 | |
| 18 | setSculptBrushCursorVisible | 27210-27215 | function | 6 | |
| 19 | updateSculptBrushCursor | 27217-27237 | function | 21 | 批内：setSculptBrushCursorVisible |
| 20 | sculptBrushMirrorUpdateLock | 27239-27244 | function | 6 | |
| 21 | sculptBrushEditableLock | 27246-27252 | function | 7 | 批内：sculptBrushMirrorUpdateLock |
| 22 | sculptBrushWorkingPlaneNormal | 27256-27260 | function | 5 | import cameraFacingPlaneNormal |
| 23 | sculptBrushLockViable | 27262-27271 | function | 10 | 批内：WorkingPlaneNormal/PlaneOffset；import pointInCameraFacingHalfSpace |
| 24 | sculptBrushUnits | 27273-27304 | function | 32 | 批内 5 个 + dep mirrorPartnerFor/strandVisibleForDisplay |
| 25 | updateSculptBrushViabilityPlane | 27311-27359 | function | 49 | 批内 4 个 + dep updateCurveObjects |
| 26 | sculptBrushPointWeight | 27361-27369 | function | 9 | import sculptBrushWeight |
| 27 | sculptBrushWorldDelta | 27371-27378 | function | 8 | |
| 28 | syncSculptBrushMirrorPoints | 27380-27404 | function | 25 | dep mirroredVector/syncLockFromCurve |
| 29 | captureSculptMoveStrokeInfluence | 27406-27462 | function | 57 | 批内：sculptBrushPointWeight；import proportionalSculptWeights |
| 30 | beginSculptMoveStroke | 27464-27524 | function | 61 | 批内 5 个 + dep updateInteractionLocks |
| 31 | applySculptMoveStrokeSample | 27746-27982 | function | 237 | 批内 5 个；**dep applySubBoneBrushSample(B2)**；import smoothSculptPointDeltas/smoothSculptTwistDeltas/inflateSculptPointScale/pointInCameraFacingHalfSpace/sampleArray |
| 32 | flushSculptMoveStrokeSample | 27984-27991 | function | 8 | 批内：applySculptMoveStrokeSample |
| 33 | updateSculptMoveStroke | 27993-28007 | function | 15 | 批内：updateSculptBrushCursor/flushSculptMoveStrokeSample |
| 34 | finishSculptMoveStroke | 28009-28055 | function | 47 | 批内：flushSculptBrushGeometryUpdates；dep undoHistory/flushPendingLockGeometryUpdates 等 |

> 随迁顶层 const：`sculptBrushDebugRaycast`（17128，死桩可删）、`sculptBrushCurveClippingPlane`（17129）、`sculptBrushCurveClippingPlanes`（17130）、`sculptBrushGeometryUpdates`（1814）、`SCULPT_BRUSH_GEOMETRY_FRAME_BUDGET_MS`（1815）、`sculptBrushCameraFacingNormal`（27254）、`sculptBrushPlaneNormal/Right/Depth/Basis`（27306-27309）。可选随迁：`sculptBrushStrengthByTool`（446-454）、`sculptBrushPreserveTipsByTool`（455-458）、`sculptBrushViabilityPlane`+fill（467-489）——见 §8 存疑 4/5。

## 2. 外部调用点（41 处，app.js 快照行号；不含批内互调）

| # | 函数 | 外部点数 | 调用点（行号 + 上下文） |
|---|---|---|---|
| 1 | setSculptBrushMaterialClipping | 2 | 17207、17310（updateCurveObjects 内，curve-objects-core 脊柱） |
| 2 | sculptBrushDebugCurveVisible | 1 | 17183（updateCurveObjects 内） |
| 3 | refreshSculptBrushDebugView | 1 | 23741（sculptBrushShowCurvesInput change handler） |
| 4 | refreshSculptBrushDebugAfterStateRestore | 1 | 1984（restoreRefreshes.register("sculpt-brush-debug", …)） |
| 5 | updateSculptBrushDebugCurve | 0 | — |
| 6 | scheduleSculptBrushGeometryUpdates | 0 | — |
| 7 | queueSculptBrushGeometryUpdate | 0 | — |
| 8 | flushSculptBrushGeometryUpdates | 0 | — |
| 9 | editableStrandWidth | 5 | 19486（syncMultiStrandInputs）、23810、23814（宽度 input handler）、28094、28116（beginStrandWidthEdgeDrag） |
| 10 | editableStrandWidthBounds | 0 | — |
| 11 | applyEditableStrandWidth | 2 | 23818（宽度 input handler）、28160（updateStrandWidthEdgeDrag） |
| 12 | viewportPixelPoint | 3 | 26166（beginPanelSplitHandleDrag，**B2**）、28090、28091（beginStrandWidthEdgeDrag） |
| 13 | syncSculptBrushControls | 5 | 6156（refreshActiveBrushSizeScale）、23735、23737（input 监听）、23744（boot）、28356（boot） |
| 14 | syncSculptBrushStrengthForActiveTool | 2 | 5877（setSculptBrushShiftSmoothHeld）、5944（setActiveTool） |
| 15 | updateActiveSculptBrushStrength | 1 | 23734（sculptBrushStrengthInput input 监听） |
| 16 | updateActiveSculptBrushPreserveTips | 1 | 23736（sculptPreserveTipsInput change 监听） |
| 17 | sculptBrushPlaneOffset | 0 | — |
| 18 | setSculptBrushCursorVisible | 3 | 5517（guideDeps 批填对象）、5887（setActiveTool）、28496（pointerleave） |
| 19 | updateSculptBrushCursor | 2 | 6139（refreshActiveBrushSizeCursor）、6222（finishBrushSizeDrag） |
| 20-24 | sculptBrushMirrorUpdateLock/EditableLock/WorkingPlaneNormal/LockViable/Units | 0 | —（全部批内互调） |
| 25 | updateSculptBrushViabilityPlane | 3 | 23738（change 监听）、23745（boot）、28949（animate 每帧） |
| 26 | sculptBrushPointWeight | 1 | 27642（applySubBoneBrushSample，**B2**） |
| 27 | sculptBrushWorldDelta | 3 | 27661、27679、27728（applySubBoneBrushSample，**B2**） |
| 28 | syncSculptBrushMirrorPoints | 0 | — |
| 29 | captureSculptMoveStrokeInfluence | 0 | — |
| 30 | beginSculptMoveStroke | 1 | 28479（renderer pointerdown 监听） |
| 31 | applySculptMoveStrokeSample | 0 | — |
| 32 | flushSculptMoveStrokeSample | 0 | — |
| 33 | updateSculptMoveStroke | 1 | 28368（window pointermove 监听） |
| 34 | finishSculptMoveStroke | 3 | 5886（setActiveTool）、28396（pointerup）、28428（pointercancel） |

> 跨模块引用（另 1 处）：`modules/geometry/guide-system.js` L2709 `deps.setSculptBrushCursorVisible(false)`——经 app.js guideDeps 批填注入，模块本身不用改，改 app.js 字段为 `sculptGeom.setSculptBrushCursorVisible`。`modules/edit/sculpt-edit-store.js` 的 `sculptBrushGeometryFrame`/store 字段仅为状态字段，无需改动。

## 3. deps 注入清单

- **store 代理（`.state`）**：`sculptState`、`sel` —— 批填 `sculptState: sculptState.state` / `sel: sel.state`，模块内 `deps.X.y`。
- **app.js helper 函数（24）**：`applySubBoneBrushSample`（B2，仅 applySculptMoveStrokeSample L27754 用）、`average`、`commitClumpMemberRestState`、`curveFrameAt`、`effectiveSculptBrushTool`、`flushPendingLockGeometryUpdates`、`getSelectedLock`、`guidedNormalAt`、`isPanelGeometry`、`mirrorPartnerFor`、`mirroredVector`、`pushUndoState`、`rebuildLockGeometry`、`sculptBrushSelectionAllows`、`sculptBrushToolActive`、`setPointScale`、`signedAngleAroundAxis`、`strandVisibleForDisplay`、`syncInputs`、`syncLockFromCurve`、`updateCurveObjects`、`updateHistoryButtons`、`updateInteractionLocks`、`updateTopologyStats`。
- **DOM 元素（14，留在 app.js 注入）**：`proportionalFalloffInput`、`proportionalRadiusInput`、`sculptBrushCursor`、`sculptBrushFalloffInput`、`sculptBrushFalloffValue`、`sculptBrushPlanePositionInput`、`sculptBrushPlanePositionValue`、`sculptBrushRadiusInput`、`sculptBrushRadiusValue`、`sculptBrushShowClippingPlaneInput`、`sculptBrushShowCurvesInput`、`sculptBrushStrengthInput`、`sculptBrushStrengthValue`、`sculptPreserveTipsInput`。`sculptBrushFalloffRing`（433）可由 `sculptBrushCursor.querySelector(".sculpt-brush-falloff")` 在模块工厂内派生。
- **共享对象/常量（注入）**：`renderer`、`camera`、`locks`、`undoHistory`；`sculptBrushViabilityPlane`（若留 app.js）、`sculptBrushStrengthByTool`/`sculptBrushPreserveTipsByTool`（若留 app.js）。
- **模块级 import（不注入）**：`THREE`；`sculpt-brush.js`（`cameraFacingPlaneNormal`、`inflateSculptPointScale`、`pointInCameraFacingHalfSpace`、`proportionalSculptWeights`、`sculptBrushWeight`、`smoothSculptPointDeltas`、`smoothSculptTwistDeltas`）；`curve-math.js`（`sampleArray`）；`surface-lattice.js`（`normalizeSurfaceLatticeCount`、`DEFAULT_SURFACE_LATTICE_COLUMNS`、`DEFAULT_SURFACE_LATTICE_ROWS`、`surfaceLatticePointIndex`）。

## 4. api 创建 / 批填时序（引导期审计）

- `sculptGeomDeps = {}` + `sculptGeom = createSculptGeometryApi(sculptGeomDeps)`：紧跟 `const panelTipStrand = createPanelTipStrandApi(...)`（快照 L1535 之后；当前工作区在 strandGeometryApi 块 L1534-1541 之后）。**必须在 L1984 之前**，因 `restoreRefreshes.register("sculpt-brush-debug", sculptGeom.refreshSculptBrushDebugAfterStateRestore)` 需要函数引用。
- 批填 `Object.assign(sculptGeomDeps, {...})`：放在最后一个 dep `proportionalFalloffInput`（L2270）之后、首个 G6 运行时调用 L23734（sculptBrushStrengthInput input 监听）之前；建议并入 G4 批填块（L2425-2458）之后保持统一风格。
- 引导期无 G6 调用早于批填：L1984 只存函数引用（不调用）；首个运行时调用为 L23734-23746（DOM 监听）与 L28356/L28368/L28396/L28428/L28479/L28496（boot/pointer 绑定）、L28949（animate 每帧 updateSculptBrushViabilityPlane）——全部在批填点之后。

## 5. 硬障碍检查

- **`__AHS_TEST_SEAM`（L29043-29098）**：引用 B2（applySubBoneBrushSample）、hover（updateStrandBrushHover/syncStrandHoverOutline）与 G1/脊柱函数；**无任何 G6 候选引用 → 不需要 seam 重导出**（不同于 G1 的 19 个重导出）。
- **undo/snapshot**：applySculptMoveStrokeSample 调 `pushUndoState`（27801/27816/27835/27855/27886）、finishSculptMoveStroke cancel 路径调 `undoHistory.pop()`+`updateHistoryButtons()`（28037-28039）——undo 脊柱留 app.js，G6 经 deps 调用；snapshot 数据（points/groupLatticeBasePoints/pointScales/pointWidths/width）为模块内纯数据。
- **mirror**：sculptBrushMirrorUpdateLock/syncSculptBrushMirrorPoints/sculptBrushUnits 镜像配对逻辑进 G6，经 dep `mirrorPartnerFor`/`mirroredVector` 读 app.js 脊柱；app.js 无 mirror 改动。
- **curve-objects-core（updateLockGeometry）**：G6 不直接调 updateLockGeometry（B2 applySubBoneBrushSample 才调）；G6 调 `updateCurveObjects`/`rebuildLockGeometry`/`syncLockFromCurve`/`flushPendingLockGeometryUpdates`（注入）。反向：updateCurveObjects 内 L17183/L17207/L17310 调 G6 两函数 → app.js 内 api 改名即可，模块不动。
- **B2 骨骼**：见 §8 存疑 1；G6→B2 边（applySculptMoveStrokeSample 调 applySubBoneBrushSample）需注入。
- **引导期**：见 §4，无冲突。

## 6. 跨批次重接（改 app.js 内调用为 `sculptGeom.*`）

1. guideDeps 批填对象（L5517 `setSculptBrushCursorVisible,`）→ `setSculptBrushCursorVisible: sculptGeom.setSculptBrushCursorVisible`（guide-system.js L2709 消费）。
2. updateCurveObjects（脊柱，17176-17918）：L17183 → `sculptGeom.sculptBrushDebugCurveVisible`；L17207/L17310 → `sculptGeom.setSculptBrushMaterialClipping`。
3. setActiveTool L5886/L5887 → `sculptGeom.finishSculptMoveStroke`/`sculptGeom.setSculptBrushCursorVisible`；setSculptBrushShiftSmoothHeld L5877 → `sculptGeom.syncSculptBrushStrengthForActiveTool`。
4. refreshActiveBrushSizeCursor L6139 / finishBrushSizeDrag L6222 → `sculptGeom.updateSculptBrushCursor`；refreshActiveBrushSizeScale L6156 → `sculptGeom.syncSculptBrushControls`。
5. DOM 监听 L23734-23746 → `sculptGeom.updateActiveSculptBrushStrength/syncSculptBrushControls/updateActiveSculptBrushPreserveTips/updateSculptBrushViabilityPlane/refreshSculptBrushDebugView`。
6. 宽度 input handler L23810-23818 → `sculptGeom.editableStrandWidth/applyEditableStrandWidth`；syncMultiStrandInputs L19486 → `sculptGeom.editableStrandWidth`。
7. **B2** applySubBoneBrushSample L27642/L27661/L27679/L27728 → `sculptGeom.sculptBrushPointWeight/sculptBrushWorldDelta`（B2 读取 `sculptBrushStrengthByTool` 见 §8 存疑 5）；beginPanelSplitHandleDrag L26166 → `sculptGeom.viewportPixelPoint`。
8. 宽度边缘 beginStrandWidthEdgeDrag L28090/L28091/L28094/L28116 → `sculptGeom.viewportPixelPoint/editableStrandWidth`；updateStrandWidthEdgeDrag L28160 → `sculptGeom.applyEditableStrandWidth`。
9. restoreRefreshes L1984 → `sculptGeom.refreshSculptBrushDebugAfterStateRestore`。
10. 顶层 pointer/boot：L28356 → `sculptGeom.syncSculptBrushControls`；L28368 → `sculptGeom.updateSculptMoveStroke`；L28396/L28428 → `sculptGeom.finishSculptMoveStroke`；L28479 → `sculptGeom.beginSculptMoveStroke`；L28496 → `sculptGeom.setSculptBrushCursorVisible`；L28949 → `sculptGeom.updateSculptBrushViabilityPlane`。

## 7. 输出建议

- **模块文件**：`modules/geometry/sculpt-geometry.js`，导出 `createSculptGeometryApi(deps)`，风格对齐 poly-tools.js/taper-editor.js/panel-tip-strand.js（工厂内函数 + 末尾 return { …34 个名字… }）。
- **装配点**：api 创建紧跟 panelTipStrand（快照 L1535 后 / 工作区 strandGeometryApi 后）；批填在 proportionalFalloffInput（L2270）后、L23734 前（建议并入 G4 批填块后）。
- **外部调用点数量**：app.js 41 处 + guide-system.js 1 处（经 deps）。
- **净减行估算**：34 函数 769 行 + 10 随迁 consts ≈ 779 毛行 − 模块脚手架 ~55-65 行 ≈ **净减 ~715-730 行**；若 sculptBrushStrengthByTool/PreserveTipsByTool（+13）或 sculptBrushViabilityPlane 块（+23）随迁可至 ~750-760。低于计划 ~860 的原因见 §0。
- **难度**：**中（偏低）**——几何逻辑集中在 3 个连续簇、批内闭环；复杂度在①G6→B2 双向边界、②共享宽度/光标助手（editableStrandWidth/viewportPixelPoint）被非 sculpt 消费、③viability 平面对象所有权、④并发 G2+G3 工作区需重新定位行号。
- **回归**：沿用模板——`node --check` 双文件 + verify-smoke（layered-side-bun.ahs）与 HEAD 基线一致；G2+G3 已提交（073a0da），当前工作区干净，直接以当前 HEAD 为基线重跑一次 Select-String 定位后执行。

## 8. 边界存疑点（重点）

1. **G6 vs B2 切分**：applySubBoneBrushSample（B2）消费 G6 的 sculptBrushPointWeight/WorldDelta；反向 applySculptMoveStrokeSample L27754 调 applySubBoneBrushSample——**G6→B2 边**（与「几何只读骨骼数据」的方向相反）。建议本批注入 `applySubBoneBrushSample` 为 dep；B2 迁出时改模块间 import（sculpt-geometry → bones-brush）或改回调。
2. **共享宽度助手**：editableStrandWidth/Bounds/applyEditableStrandWidth 被宽度边缘拖拽（begin/updateStrandWidthEdgeDrag）、syncMultiStrandInputs、宽度 input 消费；viewportPixelPoint 被 B2(beginPanelSplitHandleDrag) 消费。留在 G6 则上述调用点 api 改名；也可另立「strand 宽度」小批，本报告按留在 G6 计。
3. **cursor/strength UI 胶水**：syncSculptBrushControls + syncSculptBrushStrengthForActiveTool + updateActiveSculptBrushStrength + updateActiveSculptBrushPreserveTips（33 行）属光标几何/工具 UI 边界；建议随 G6（与 byTool consts 绑定），可单独剥离不影响其余 30 个。
4. **sculptBrushViabilityPlane 所有权**（467-489，GridHelper+fill+scene.add）：模块 import 先于 scene 创建，不能在模块顶层 scene.add；建议留在 app.js 注入（简单），或模块工厂内懒创建（首帧 updateSculptBrushViabilityPlane 时初始化，需 deps.scene）。本报告按「注入」计。
5. **sculptBrushStrengthByTool/PreserveTipsByTool**（446-458）：B2 applySubBoneBrushSample L27634 读取 StrengthByTool；若随 G6 迁出，B2 需经 api 读取。建议留 app.js 注入（避免 B2 重接），代价 +13 行不随迁。
6. **行号基线漂移**：FUNCTION_INDEX 快照（29,100 行）与当前 HEAD（28,230 行，G2+G3 已提交 073a0da）差 -870（debug 簇 -892）；执行前必须基于当前 HEAD 重跑一次 Select-String 定位（本报告 §1/§2 行号均为 29,100 口径）。
---

## 执行记录（G6 已完成）

> 执行：2026-08-12 · 分支 `0.2.59-refactor` · 基线 HEAD `073a0da`（app.js 28,230 行 / 28,229 PowerShell 行）。未 commit；未动 index.html / FUNCTION_INDEX / verify-smoke / 已提交模块与其它批次产物。

### 改动文件
- 新建：`modules/geometry/sculpt-geometry.js`（889 行，含脚手架；`createSculptGeometryApi(deps)` 工厂，末尾 return 34 个名字）
- 修改：`app.js`（28,230 → 27,478 行，净减 752 行）
- 追加：本文件「执行记录」节

### 迁出内容
- **34 个函数，769 行**（与 §1 表逐行一致；函数行数 = 769，实测：见上表函数跨度）。按主题 3 簇 + 共享助手：
  - 簇 A（sculpt 调试曲线几何）：setSculptBrushMaterialClipping / sculptBrushDebugCurveVisible / refreshSculptBrushDebugView / refreshSculptBrushDebugAfterStateRestore / updateSculptBrushDebugCurve
  - 簇 B（几何重建调度）：scheduleSculptBrushGeometryUpdates / queueSculptBrushGeometryUpdate / flushSculptBrushGeometryUpdates
  - 簇 C（宽度/光标/平面/可行性/采样/变形）：editableStrandWidth(Bounds)/applyEditableStrandWidth/viewportPixelPoint/syncSculptBrushControls/syncSculptBrushStrengthForActiveTool/updateActiveSculptBrushStrength/updateActiveSculptBrushPreserveTips/sculptBrushPlaneOffset/setSculptBrushCursorVisible/updateSculptBrushCursor/sculptBrushMirrorUpdateLock/sculptBrushEditableLock/sculptBrushWorkingPlaneNormal/sculptBrushLockViable/sculptBrushUnits/updateSculptBrushViabilityPlane/sculptBrushPointWeight/sculptBrushWorldDelta/syncSculptBrushMirrorPoints/captureSculptMoveStrokeInfluence/beginSculptMoveStroke/applySculptMoveStrokeSample/flushSculptMoveStrokeSample/updateSculptMoveStroke/finishSculptMoveStroke
- **9 个随迁顶层 const**：sculptBrushCurveClippingPlane / sculptBrushCurveClippingPlanes、sculptBrushGeometryUpdates / SCULPT_BRUSH_GEOMETRY_FRAME_BUDGET_MS、sculptBrushCameraFacingNormal、sculptBrushPlaneNormal / Right / Depth / Basis
- 删除总行：811（含簇间空行）；新增模块 889（含 ~55-65 行脚手架），app.js 净减 752

### deps 注入清单（48，与模块 deps.X 使用逐一对应，无缺无余）
- store 代理（2）：`sculptState: sculptState.state`、`sel: sel.state`
- 共享对象（7）：renderer / camera / locks / undoHistory / sculptBrushViabilityPlane / sculptBrushStrengthByTool / sculptBrushPreserveTipsByTool
- DOM（15，比计划多 1：sculptBrushFalloffRing 直接注入而非工厂派生，避免 deps 空期时序问题）：sculptBrushCursor、sculptBrushFalloffRing、sculptBrushStrengthInput/Value、sculptBrushRadiusInput/Value、sculptBrushFalloffInput/Value、sculptBrushPlanePositionInput/Value、sculptBrushShowClippingPlaneInput、sculptBrushShowCurvesInput、sculptPreserveTipsInput、proportionalRadiusInput、proportionalFalloffInput
- app.js helper（24）：applySubBoneBrushSample(B2)、average、commitClumpMemberRestState、curveFrameAt、effectiveSculptBrushTool、flushPendingLockGeometryUpdates、getSelectedLock、guidedNormalAt、isPanelGeometry、mirrorPartnerFor、mirroredVector、pushUndoState、rebuildLockGeometry、sculptBrushSelectionAllows、sculptBrushToolActive、setPointScale、signedAngleAroundAxis、strandVisibleForDisplay、syncInputs、syncLockFromCurve、updateCurveObjects、updateHistoryButtons、updateInteractionLocks、updateTopologyStats
- 模块级 import（不注入）：THREE；sculpt-brush.js 7 个（cameraFacingPlaneNormal/inflateSculptPointScale/pointInCameraFacingHalfSpace/proportionalSculptWeights/sculptBrushWeight/smoothSculptPointDeltas/smoothSculptTwistDeltas）；curve-math sampleArray；surface-lattice 4 个（normalizeSurfaceLatticeCount/DEFAULT_SURFACE_LATTICE_COLUMNS/DEFAULT_SURFACE_LATTICE_ROWS/surfaceLatticePointIndex）

### 装配
- import：app.js L8（strand-geometry import 后）
- api 创建：`const sculptGeomDeps = {}; const sculptGeom = createSculptGeometryApi(sculptGeomDeps);` 紧跟 strandGeometryApi（L1546-1547），早于 restoreRefreshes.register（L1994）
- 批填：`Object.assign(sculptGeomDeps, {...})` 在 G4 curveSurfaceCreateDeps 批填块后（L2495-2549），晚于最后一个 dep proportionalFalloffInput（L2276），早于首个运行时调用（L22840 sculptBrushStrengthInput 监听 / L26734 boot / L27327 animate）

### 外部调用点改写（41 处 app.js + guide-system.js 1 处经 deps，模块本身未改）
setSculptBrushMaterialClipping×2（updateCurveObjects 内）、sculptBrushDebugCurveVisible×1（updateCurveObjects 内）、refreshSculptBrushDebugView×1、refreshSculptBrushDebugAfterStateRestore×1（restoreRefreshes）、editableStrandWidth×5、applyEditableStrandWidth×2、viewportPixelPoint×3（含 B2 beginPanelSplitHandleDrag 1 行 2 调用）、syncSculptBrushControls×5、syncSculptBrushStrengthForActiveTool×2、updateActiveSculptBrushStrength×1、updateActiveSculptBrushPreserveTips×1、setSculptBrushCursorVisible×3（guideDeps 批填 + setActiveTool + pointerleave）、updateSculptBrushCursor×2、updateSculptBrushViabilityPlane×3（change 监听 + boot + animate）、sculptBrushPointWeight×1（B2 applySubBoneBrushSample）、sculptBrushWorldDelta×3（B2 applySubBoneBrushSample）、beginSculptMoveStroke×1、updateSculptMoveStroke×1、finishSculptMoveStroke×3。guideDeps 批填 L5580：`setSculptBrushCursorVisible` → `setSculptBrushCursorVisible: sculptGeom.setSculptBrushCursorVisible`。

### 7 项必做验证结果
1. **裸引用静态扫描归零** ✅ 34 个函数名在 app.js 仅以 sculptGeom.X / 批填 / guideDeps 键形式出现（唯一非 sculptGeom 前缀命中为 guideDeps 对象键 `setSculptBrushCursorVisible:`，属预期）；模块内 48 个 dep 名无裸引用（含 spread `...name`、对象键 `name:` 均覆盖）；模块体与原始簇 token 级 diff 通过（仅 deps 改写）。
2. **store 代理双重 .state 检查** ✅ 模块无 `deps.sculptState.state` / `deps.sel.state`；批填传 `sculptState: sculptState.state`、`sel: sel.state`。
3. **引导期 deps 时序审计** ✅ api 创建（L1547）< restoreRefreshes.register（L1994，仅存引用不调用，RestoreRefreshRegistry.register 只 set）< 批填（L2495）< 首个运行时调用（L22840 监听 / L26734 boot / L27327 animate / L11116 restoreRefreshes.run）。批填前唯一 sculptGeom 引用为 L1994 存函数引用。
4. **跨批次重接** ✅ guideDeps.setSculptBrushCursorVisible → sculptGeom（guide-system.js L2709 经 deps 消费）；其它批填（guideDeps/curveSurfaceCreateDeps/taperEditorDeps/polyToolsDeps/panelTipStrandDeps/strandGeometryDeps）均未引用本批 34 函数名。
5. **编码** ✅ app.js 与 sculpt-geometry.js 均 UTF-8 无 BOM、CRLF；非 ASCII 字节守恒（HEAD 1854 = 现 1854，Δ=0；移除簇含 0 非 ASCII，模块 0 非 ASCII）。
6. **语法** ✅ node --check 双文件（.mjs 副本权威解析）均通过；verify-smoke 回归 **10/11 = 基线**（唯一 FAIL `branch bridge smooth is per-lock` 为既有基线失败，与 G4/G7/G5/G1/G2+G3 一致）。
7. **执行记录** ✅ 本节。

### 边界存疑点处理（对照 §8）
1. **G6↔B2 双向边**：applySubBoneBrushSample（B2，留 app.js）消费 sculptBrushPointWeight×1 / sculptBrushWorldDelta×3 → app.js 内改 `sculptGeom.X`（B2 迁出时已无需再改）；反向 applySculptMoveStrokeSample（G6）调 applySubBoneBrushSample → 注入 dep `applySubBoneBrushSample`（B2 迁出时改 sculpt-geometry 模块 import / 回调即可）。
2. **共享宽度/光标助手**：editableStrandWidth/Bounds、applyEditableStrandWidth、viewportPixelPoint 留在 G6，非 sculpt 消费点（syncMultiStrandInputs、宽度 input、begin/updateStrandWidthEdgeDrag、B2 beginPanelSplitHandleDrag）全部改 api 调用。
3. **cursor/strength UI 胶水**：4 个（syncSculptBrushControls/syncSculptBrushStrengthForActiveTool/updateActiveSculptBrushStrength/updateActiveSculptBrushPreserveTips）随迁。
4. **sculptBrushViabilityPlane 所有权**：留 app.js（L469-491 创建 + scene.add），注入 deps.sculptBrushViabilityPlane；模块内 updateSculptBrushViabilityPlane 只读写其 visible/position/quaternion。
5. **sculptBrushStrengthByTool/PreserveTipsByTool**：留 app.js 注入（避免 B2 重接），B2 applySubBoneBrushSample 继续直接读取 app.js 常量，零重接。
6. **sculptBrushDebugRaycast**：§1 称「死桩可删」，实测 updateCurveObjects 仍引用（L16328/16429）→ **留在 app.js**，未随迁（随迁 const 计 9 个而非 10 个）。
7. **sculptBrushFalloffRing**：工厂内派生改为直接注入（15 个 DOM dep），避免 deps={} 期派生失败。

### 回归
- verify-smoke：`node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs` → **10/11 = 基线**（app boot / 0 异常 / zh / ja / en / ahs 加载重建 / undo / export / save / selection 均 PASS；branch bridge smooth 基线 FAIL）。

