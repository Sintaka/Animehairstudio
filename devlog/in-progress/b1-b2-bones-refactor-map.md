# B1+B2 骨骼域迁出 — 函数引用图（骨骼批次）

> 目标：把 app.js 中「段控制胶水」（B1，5 函数）与「骨骼 gizmo/拖拽/笔刷」（B2，8 函数）迁到 `modules/bones/`（`createXxxApi(deps)` 依赖注入），app.js 只保留 DOM/pointer/transformControls 监听注册、boot 调用与脊柱接线。
> 执行（分析）：2026-08-12 · 分支 `0.2.59-refactor` · HEAD `073a0da`（G2+G3 已提交，app.js 28,229 行 / FUNCTION_INDEX lineCount 28,230 口径一致）· **只读分析，未改动 app.js/modules/\***。
> 行号口径：**全部为当前 HEAD 实测**（PowerShell `Get-Content` + `Select-String` + 逐行 brace 扫描）。plan（geometry-bones-extraction-plan.md）的 32,530 行快照区间经 G4/G7/G5/G1/G2+G3 迁出后整体漂移，本表已重定位（例：`openPanelSegmentCurveEditor` 11828→9350、`beginPanelSplitHandleDrag` 26075→25205、seam 29043→28173）。执行批次时若 G6 已落地需再重跑一次定位。
> ⚠ **并发批次（工作区未提交）**：分析期间有并发的 G6（sculpt 几何）批次正在改工作区——`app.js` 现为 **27,477 行**，已新建 `modules/geometry/sculpt-geometry.js`（均未 commit）。G6 diff **未触碰 B1/B2 的 13 个函数**（仍在 app.js，仅上移），seam 由 28173→27421。工作区重定位（供执行时参考，最终以当时 HEAD 重跑为准）：

> | 函数 | HEAD 073a0da | 工作区(未提交) | | 函数 | HEAD 073a0da | 工作区(未提交) |
> |---|---|---|---|---|---|---|
> | openPanelSegmentCurveEditor | 9350 | 9407 | | updatePanelSplitHandleDrag | 25330 | 25306 |
> | selectedPanelSegment | 17872 | 17848 | | endPanelSplitHandleDrag | 25551 | 25527 |
> | syncPanelSegmentControls | 17878 | 17854 | | prepareCurvePointSelection | 26093 | 26069 |
> | syncPanelShapeInputs | 17896 | 17872 | | updatePanelTipHover | 26701 | 26259 |
> | changePanelSplitCount | 23255 | 23231 | | applySubBoneBrushSample | 26731 | 26289 |
> | beginTipSubBoneRotate | 25143 | 25119 | | seam __AHS_TEST_SEAM | 28173 | 27421 |
> | applyTipSubBoneTransform | 25173 | 25149 | | seam: beginTipSubBoneRotate 重导出 | 28190 | 27438 |
> | beginPanelSplitHandleDrag | 25205 | 25181 | | seam: applySubBoneBrushSample 重导出 | 28195 | 27443 |
> | | | | | seam: syncPanelSegmentControls 重导出 | 28213 | 27461 |

> 该并发 G6 已把 B2 的三个跨批 dep 迁入 sculpt-geometry.js：`sculptBrushPointWeight`/`sculptBrushWorldDelta`/`viewportPixelPoint`（B2 模块改 import 或 app.js 批填指 `sculptGeom.*`）；并在 `sculptGeomDeps`（工作区 L2495）**注入 `applySubBoneBrushSample`**（此时仍在 app.js）——B2 落地后该注入改指 `bonesApi.applySubBoneBrushSample`。§2/§3/§5/§6 的行号均为 HEAD 口径；执行批时若 G6 已提交，需按本表偏移重跑定位。


## 0. 边界判定

- **迁出 13 个函数（816 行）**：
  - **B1 段控制胶水（5 个，121 行）**：`selectedPanelSegment` L17872-17876 / `syncPanelSegmentControls` L17878-17894 / `syncPanelShapeInputs` L17896-17921 / `openPanelSegmentCurveEditor` L9350-9384 / `changePanelSplitCount` L23255-23292。
  - **B2 骨骼 gizmo/拖拽/笔刷（8 个，695 行）**：`beginTipSubBoneRotate` L25143-25169 / `applyTipSubBoneTransform` L25173-25203 / `beginPanelSplitHandleDrag` L25205-25328 / `updatePanelSplitHandleDrag` L25330-25549 / `endPanelSplitHandleDrag` L25551-25560 / `applySubBoneBrushSample` L26731-26874 / `updatePanelTipHover` L26701-26729 / `prepareCurvePointSelection` L26093-26202。
- **不迁移（边界存疑，留在 app.js，报回）**：
  1. **B3 视口 handle**：`createCurveObjects`（L15921）/`updateCurveObjects`（L16284）内 bone 段创建与 userData 契约（L16027-16684：panelSplitHandles/panelSegmentHandles/panelTipHandles/tipWidthHandles/strandSplitHandle）。B1/B2 只**消费**这些 handle 与 `updateCurveObjects`（脊柱），不创建。
  2. **脊柱接线**：`pushUndoState`/snapshot/restore/mirror/stroke 与序列化（`splitBonesToData`/`bonesToData` 等）留 app.js；B1/B2 仅经 deps 调 `pushUndoState`/`syncActiveMirror`/`updateLockGeometry` 等。
  3. **G6**（分析基线 HEAD 上尚未落地；工作区已有未提交 G6，见页首 ⚠）：`sculptBrushPointWeight`/`sculptBrushWorldDelta`/`viewportPixelPoint` 是 B2 的跨批 dep（见 §8 存疑 2/3）。
  4. **`prepareCurvePointSelection` 边界存疑**：它是通用 strand 控制点选择 pointerdown 处理器（调 `strandControlPointHitFromEvent`/`addStrandControlPointSelection`/`activateStrandControlPoint`/`closestStrandCurveParameter`），**不引用任何 bone 标识符**；Godel 与 plan 把它归 B2（见 §8 存疑 1）。
- **Godel「5+8 函数 / ~180+540 净减」口径差异**：B1 实测 121 毛行（净减约 90-95，明显低于 plan 的 ~180——plan 为 32,530 行口径毛估）；B2 实测 695 毛行（净减约 520，≈plan 540）。

## 1. 迁出函数清单（13，当前 HEAD 行号）

| # | 批次 | 函数 | 行号 | 类型 | 行数 | 批内互调 / 备注 |
|---|---|---|---|---|---|---|
| 1 | B1 | selectedPanelSegment | 17872-17876 | function | 5 | 叶子；读 sculptState.state.panelSegmentIndex |
| 2 | B1 | syncPanelSegmentControls | 17878-17894 | function | 17 | 批内：selectedPanelSegment；dep taperEditor（activeStrandShapeTarget/renderTaperPreview）|
| 3 | B1 | syncPanelShapeInputs | 17896-17921 | function | 26 | 批内：syncPanelSegmentControls；dep clonePanelSplits/snapPanelSplitHeight |
| 4 | B1 | openPanelSegmentCurveEditor | 9350-9384 | function | 35 | 批内：selectedPanelSegment；dep taperEditor（ensureSecondaryTaperCurve 等 6 项）/shapePresets/branchSweep |
| 5 | B1 | changePanelSplitCount | 23255-23292 | function | 38 | 批内：syncPanelShapeInputs；undo+mirror+geometry 重建 5 处 |
| 6 | B2 | beginTipSubBoneRotate | 25143-25169 | function | 27 | 批内：—；写 sculptState.state.tipSubBoneRotateDrag |
| 7 | B2 | applyTipSubBoneTransform | 25173-25203 | function | 31 | 批内：—；读 tipSubBoneRotateDrag，调 updateLockGeometry/updateCurveObjects/syncActiveMirror |
| 8 | B2 | beginPanelSplitHandleDrag | 25205-25328 | function | 124 | 批内：syncPanelSegmentControls(3)；读 B3 handles；写 userData.tipSubBoneHandle/panelSplitDrag；dep viewportPixelPoint(G6) |
| 9 | B2 | updatePanelSplitHandleDrag | 25330-25549 | function | 220 | 批内：endPanelSplitHandleDrag(2)/syncPanelSegmentControls(1)；四分支 kind=strand/tip/tipWidth/segment |
| 10 | B2 | endPanelSplitHandleDrag | 25551-25560 | function | 10 | 批内：—；releasePointerCapture + updateCurveObjects |
| 11 | B2 | applySubBoneBrushSample | 26731-26874 | function | 144 | 批内：—；**双向 G6 边**（消费 sculptBrushPointWeight/WorldDelta，被 applySculptMoveStrokeSample 调）|
| 12 | B2 | updatePanelTipHover | 26701-26729 | function | 29 | 批内：—；dep panelTipStrand.updateTipHighlight/pointerOverTaperEditor |
| 13 | B2 | prepareCurvePointSelection | 26093-26202 | function | 110 | 批内：—；通用 strand 控制点选择（非 bone 专属，见 §8 存疑 1）|

合计：B1 121 行，B2 695 行，共 816 行（毛）。

## 2. 外部调用点 / 引用图

> 记法：`L<行号>（<所在函数或 "顶层 init">）`。批内互调计入引用图但不计入外部调用点；seam 单列。

### B1

**selectedPanelSegment（L17872-17876，5 行）**
- 外部调用点（3）：L23300 / L23308 / L23321（顶层 init，previous/next 段按钮与 spread input 监听回调）
- 批内被调（2）：L9353（openPanelSegmentCurveEditor）、L17880（syncPanelSegmentControls）
- deps：`sculptState`（state.panelSegmentIndex）、THREE（MathUtils.clamp）、lock.panelSplits（参数对象读）

**syncPanelSegmentControls（L17878-17894，17 行）**
- 外部调用点（5+1 seam）：L15354（applyAltClickCandidate）、L23302 / L23310（顶层 init）、L27776 / L27783（顶层 init pointerdown 回调）；seam L28213
- 批内互调：→ selectedPanelSegment（L17880）；被 syncPanelShapeInputs（L17920）、beginPanelSplitHandleDrag（L25238/25268/25276）、updatePanelSplitHandleDrag（L25475）调
- deps：`taperEditor`（模块实例：activeStrandShapeTarget/renderTaperPreview）、`splitBonesFor`（bone-model）、DOM：panelSegmentLabel/previousPanelSegmentButton/nextPanelSegmentButton/panelSegmentSpread/panelSegmentSpreadValue/segmentTaperPreview/segmentDepthPreview

**syncPanelShapeInputs（L17896-17921，26 行）**
- 外部调用点（4）：L17853（syncCreationShapeInputs）、L18088（updateAttributeEditorMode）、L18373（syncInputs）、L23245（顶层 init panelShapeInputs 监听回调）
- 批内互调：→ syncPanelSegmentControls（L17920）；被 changePanelSplitCount（L23291）调
- deps：`taperEditor`（activeStrandShapeTarget）、`clonePanelSplits`/`snapPanelSplitHeight`（app.js 本地，注入）、`panelCreationDefaults`、DOM：panelShapeInputs/panelShapeValues/panelSplitCountValue/removePanelSplitButton/addPanelSplitButton、THREE/Math/Object/Number/String

**openPanelSegmentCurveEditor（L9350-9384，35 行）**
- 外部调用点（2）：L23336 / L23337（顶层 init，editPanelSegmentWidth/DepthCurveButton click）
- 批内互调：→ selectedPanelSegment（L9353）
- deps：`getSelectedLock`/`isPanelGeometry`/`updateViewportStatsVisibility`、`materializeSplitBones`（bone-model）、`shapePresets`（模块实例，cloneShapePresetValue）、`sweepProfileEditor`(DOM)/`branchSweep`（模块实例，closeSweepProfileEditor）、`sculptState`（state.taperCurveEdit）、`taperEditor`（ensureSecondaryTaperCurve/activeTaperTarget/updateTaperCurveEditorTargetLabel/setTaperMeshPointsVisible/renderTaperCurveEditor/renderTaperPreview）、DOM：taperMeshPointsToggleRow/segmentDepthPreview/segmentTaperPreview/taperCurveEditor、document

**changePanelSplitCount（L23255-23292，38 行）**
- 外部调用点（2）：L23294 / L23295（顶层 init，add/removePanelSplitButton click）
- 批内互调：→ syncPanelShapeInputs（L23291）
- deps：`getSelectedLock`/`isPanelGeometry`/`pushUndoState`/`updateDrawStrandPreview`/`updateLockGeometry`/`rebuildCurveObjects`/`syncActiveMirror`/`updateTopologyStats`、`clonePanelSplits`（注入）、`sel`（state.activeTool）、`panelCreationDefaults`、`sculptState`（state.drawStrandStroke）、THREE/Math/Number

### B2

**beginTipSubBoneRotate（L25143-25169，27 行）**
- 外部调用点（1+1 seam）：L803（顶层 init，transformControls dragging-changed 匿名 handler）；seam L28190
- 批内互调：—
- deps：`locks`、`clonePanelSplits`（注入）、`materializeSplitBones`（bone-model）、`panelTipStrand`（模块实例，splitTipForSegment）、`sculptState`（state.tipSubBoneRotateDrag，写）

**applyTipSubBoneTransform（L25173-25203，31 行）**
- 外部调用点（1）：L928（顶层 init，transformControls objectChange 匿名 handler；L25235 是注释非调用）
- 批内互调：—
- deps：`transformControls`、`sculptState`（state.tipSubBoneRotateDrag，读）、`clonePanelSplits`（注入）、`materializeSplitBones`（bone-model）、`updateLockGeometry`/`updateCurveObjects`/`syncActiveMirror`、THREE（Vector3）

**beginPanelSplitHandleDrag（L25205-25328，124 行）**
- 外部调用点（1）：L27749（顶层 init pointerdown 匿名 handler @L27651）
- 批内互调：→ syncPanelSegmentControls（L25238/25268/25276）
- deps：`getSelectedLock`/`isPanelGeometry`/`configureTransformControls`/`updateCurveObjects`/`updateInteractionLocks`/`pushUndoState`、`clonePanelSplits`（注入）、`splitBonesFor`/`materializeSplitBones`（bone-model）、`panelTipStrand`（splitTipForSegment/tipWidthControlPlacement/tipPanelWidthAt）、`viewportPixelPoint`（**G6**）、`raycaster`/`renderer`、`sel`（state.activeTool）、`sculptState`（state.panelTipSelection/panelSegmentIndex/panelSplitDrag，读+写）、`transformControls`、**B3 handles 读**（lock.curveObjects.panelSplitHandles/panelSegmentHandles/panelTipHandles/tipWidthHandles/strandSplitHandle + userData.panelTipIndex/panelTipPoint/tipWidthIndex/tipWidthSegment/tipWidthSide）、写 hit.object.userData.tipSubBoneHandle（L25242）

**updatePanelSplitHandleDrag（L25330-25549，220 行）**
- 外部调用点（1）：L27518（顶层 init，window pointermove 注册）
- 批内互调：→ endPanelSplitHandleDrag（L25334/L25485）、→ syncPanelSegmentControls（L25475）
- deps：`strandGeometryCurve`/`strandSplitProfileData`/`strandSplitControlPoint`/`panelSplitControlPoint`/`snapPanelSplitHeight`（注入）、`clonePanelSplits`（注入）、`materializeSplitBones`（bone-model）、`panelTipStrand`（splitTipForSegment/tipWidthEdgePosition/setTipWidthCurveValue）、`taperEditor`（renderTaperCurveEditor）、`taperCurveEditor`(DOM，open 读)、`getSelectedLock`、`updateLockGeometry`/`updateCurveObjects`/`syncActiveMirror`/`updateTopologyStats`、`locks`、`sculptState`（state.panelSplitDrag/panelTipSelection）、`camera`/`renderer`、THREE/Math/Number/Array

**endPanelSplitHandleDrag（L25551-25560，10 行）**
- 外部调用点（2）：L27543 / L27577（顶层 init，window pointerup/pointercancel 注册）
- 批内被调（2）：L25334 / L25485（updatePanelSplitHandleDrag）
- deps：`sculptState`（state.panelSplitDrag，读+清）、`renderer`（domElement.releasePointerCapture）、`locks`、`updateCurveObjects`、`sel`（state.selectedId）、`updateInteractionLocks`

**applySubBoneBrushSample（L26731-26874，144 行）**
- 外部调用点（1+1 seam）：L26884（**applySculptMoveStrokeSample，G6 主簇**）；seam L28195
- 批内互调：—
- deps：`sculptState`（state.panelTipSelection）、`locks`、`isPanelGeometry`/`pushUndoState`/`effectiveSculptBrushTool`/`guidedNormalAt`/`strandFrameAt`/`signedAngleAroundAxis`/`updateLockGeometry`/`updateCurveObjects`/`updateTopologyStats`、`clonePanelSplits`（注入）、`materializeSplitBones`（bone-model）、`panelTipStrand`（splitTipForSegment/splitForkT）、`sculptBrushPointWeight`（G6，L26772）、`sculptBrushWorldDelta`（G6，L26791/26809/26858）、`sculptBrushStrengthByTool`（顶层 const，G6 计划留 app.js 注入）、DOM：sculptBrushRadiusInput/sculptBrushFalloffInput/sculptBrushStrengthInput、`renderer`/`camera`、import：`smoothSculptPointDeltas`（sculpt-brush.js）、THREE/Math/Number/Boolean/Array

**updatePanelTipHover（L26701-26729，29 行）**
- 外部调用点（1）：L27499（顶层 init，window pointermove 注册，非 capture）
- 批内互调：—
- deps：`pointerOverTaperEditor`/`getSelectedLock`/`isPanelGeometry`、`sculptState`（state.panelTipHover，读+写）、`panelTipStrand`（updateTipHighlight）、`renderer`/`raycaster`/`camera`、THREE（Vector2）/Array

**prepareCurvePointSelection（L26093-26202，110 行）**
- 外部调用点（1）：L27616（顶层 init，renderer.domElement pointerdown capture 注册）
- 批内互调：—
- deps：`componentEditModeActive`/`selectLock`/`getSelectedLock`/`strandControlPointHitFromEvent`/`pointerHitsTransformGizmo`/`addStrandControlPointSelection`/`activateStrandControlPoint`/`closestStrandCurveParameter`、`guideState`（state.hoveredControlPoint）、`sel`（state.selectedId/clumpViewportSelection/activeTool）、`sculptState`（state.viewportEditMode/proportionalSizeEdit/proportionalHotkeyPress/pointRemovalCandidate/curvePointInsertionCandidate）、`scalpState`（state.scalpShapeEditing/scalpPaintEditing/scalpBuilderEditing/capsuleGuideEditing）、`transformControls`/`renderer`/`pointer`/`raycaster`/`camera`

### 批间 & 跨批次边汇总

- **B1 批内边**（4 条）：selectedPanelSegment←syncPanelSegmentControls；syncPanelSegmentControls←syncPanelShapeInputs；selectedPanelSegment←openPanelSegmentCurveEditor；syncPanelShapeInputs←changePanelSplitCount。
- **B2 批内边**（3 条）：updatePanelSplitHandleDrag→endPanelSplitHandleDrag（2 处）；（B2→B1）beginPanelSplitHandleDrag→syncPanelSegmentControls（3 处）、updatePanelSplitHandleDrag→syncPanelSegmentControls（1 处）。
- **B2↔G6 双向边**：applySculptMoveStrokeSample（G6 主簇 L26876）→ applySubBoneBrushSample（B2）@L26884；applySubBoneBrushSample→sculptBrushPointWeight @L26772 / sculptBrushWorldDelta @L26791/26809/26858；beginPanelSplitHandleDrag→viewportPixelPoint @L25296。
- **B2→B3**：读 lock.curveObjects.* 与 userData（见 beginPanelSplitHandleDrag deps），消费 updateCurveObjects；B3 未迁，契约不动。
- **跨模块引用**：当前 **0 处**（modules/geometry/panel-tip-strand.js、taper-editor.js、strand-geometry.js 及其余 modules 均无 13 个函数名引用；index.html/styles.css 亦无）。G6 落地后 `modules/geometry/sculpt-geometry.js` 不直接引用 B2 名（按 G6 计划注入 applySubBoneBrushSample 为 dep，接线在 app.js）。

## 3. deps 注入清单

- **store 代理（`.state`，注入）**：`sculptState`（B1/B2 核心：panelSegmentIndex/panelTipSelection/tipSubBoneRotateDrag/panelSplitDrag/panelTipHover/taperCurveEdit/drawStrandStroke/viewportEditMode/proportionalSizeEdit/proportionalHotkeyPress/pointRemovalCandidate/curvePointInsertionCandidate）、`sel`（activeTool/selectedId/clumpViewportSelection）、`guideState`（hoveredControlPoint）、`scalpState`（scalpShapeEditing/scalpPaintEditing/scalpBuilderEditing/capsuleGuideEditing）。建议像既有批次注入 `sculptState: sculptState.state` 等，模块内 `deps.X.y`。
- **app.js helper 函数（注入，留在 app.js）**：`getSelectedLock`、`isPanelGeometry`、`pushUndoState`、`updateLockGeometry`、`updateCurveObjects`、`rebuildCurveObjects`、`syncActiveMirror`、`updateTopologyStats`、`updateDrawStrandPreview`、`updateInteractionLocks`、`configureTransformControls`、`updateViewportStatsVisibility`、`effectiveSculptBrushTool`、`guidedNormalAt`、`strandFrameAt`、`signedAngleAroundAxis`、`pointerOverTaperEditor`、`componentEditModeActive`、`selectLock`、`strandControlPointHitFromEvent`、`pointerHitsTransformGizmo`、`addStrandControlPointSelection`、`activateStrandControlPoint`、`closestStrandCurveParameter`、`clonePanelSplits`、`snapPanelSplitHeight`、`strandGeometryCurve`、`strandSplitProfileData`、`strandSplitControlPoint`、`panelSplitControlPoint`。
  - 注：`clonePanelSplits`（L1313）/`snapPanelSplitHeight`（L1317）是 app.js 本地函数（依赖 normalizePanelSplits/THREE），**不是 bone-model.js 导出** → 注入；后续若随 bone-model 下沉可改 import。
- **G6（未落地，注入）**：`sculptBrushPointWeight`、`sculptBrushWorldDelta`、`viewportPixelPoint`。G6 落地后 app.js 批填对象把这三项改指 `sculptGeom.*`（B2 模块内零改动）。
- **DOM 元素（留在 app.js，注入）**：B1：`panelShapeInputs`、`panelShapeValues`、`panelSplitCountValue`、`addPanelSplitButton`、`removePanelSplitButton`、`panelSegmentLabel`、`previousPanelSegmentButton`、`nextPanelSegmentButton`、`panelSegmentSpread`、`panelSegmentSpreadValue`、`editPanelSegmentWidthCurveButton`（仅 app.js 监听用，模块不读）、`editPanelSegmentDepthCurveButton`（同上）、`segmentTaperPreview`、`segmentDepthPreview`、`taperMeshPointsToggleRow`、`taperCurveEditor`、`sweepProfileEditor`。B2：`sculptBrushRadiusInput`、`sculptBrushFalloffInput`、`sculptBrushStrengthInput`、`sculptBrushStrengthByTool`（const，G6 计划留 app.js）、`taperCurveEditor`（updatePanelSplitHandleDrag L25467 读 open）。
- **共享对象/常量（注入）**：`renderer`、`camera`、`raycaster`、`pointer`、`locks`、`transformControls`、`panelCreationDefaults`。
- **模块实例（注入，实例在 app.js 创建）**：`taperEditor`（taper-editor.js）、`panelTipStrand`（panel-tip-strand.js）、`shapePresets`（io/shape-presets.js）、`branchSweep`（branch-sweep.js）。
- **模块级 import（不注入）**：`THREE`（app.js L33）；`smoothSculptPointDeltas`（`./modules/sculpt/sculpt-brush.js`，仅 B2 applySubBoneBrushSample）；`materializeSplitBones`/`splitBonesFor`（`./modules/geometry/bone-model.js`，B0 移入 `./modules/bones/bone-model.js` 后改相对路径，单行）。`curve-math.js`/`app-config.js`：本批 13 函数体内**无引用**，不需要。

## 4. api 创建 / 批填时序（引导期审计）

- **api 创建**：紧跟 `strandGeometryApi` 块（L1540-1541）之后：`const bonesDeps = {}; const bonesApi = createBonesApi(bonesDeps);`。若拆双模块（推荐）：`segmentApi = createSegmentControlApi(segmentDeps)` + `bonesApi = createBoneInteractionApi(bonesDeps)`，均放在 L1541 后（此时 panelTipStrand L1536 / taperEditor L1530 已创建，B2 运行时才消费，无 TDZ）。
- **deps 批填**：B1 最后一个 dep 是 `taperMeshPointsToggleRow`（L2746，另 shapePresets L9056/branchSweep L8407 也在后）；B2 最后一个 dep 是 `locks`（L1961）。**单批填块放 L9081（`Object.assign(taperEditorDeps, …)`）之后、L23203（panelShapeInputs forEach 顶层注册）之前**；G5 风格 `Object.assign(segmentDeps, {…}); Object.assign(bonesDeps, {…});` 或合并一个 `Object.assign(bonesDeps, { …segmentApi })`。
- **引导期无早于批填点的直接调用**：13 个函数全部只在监听回调 / 运行时函数内被调；首条 boot 路径是 **L28168 `updateAttributeEditorMode()`（顶层 boot）→ syncPanelShapeInputs（L18088）→ syncPanelSegmentControls**，以及条件分支 seam（L28173+）。均晚于 L9081 批填点 → 安全。
- **顶层注册（留在 app.js，改 api 调用）**：
  - B1：panelShapeInputs forEach L23203-23253（内 L23245）；add/removePanelSplitButton L23294-23295；previous/nextPanelSegmentButton L23296-23311（L23300/23302/23308/23310）；panelSegmentSpread input L23312-23335（L23321）；editPanelSegmentWidth/DepthCurveButton L23336-23337。
  - B2：transformControls dragging-changed 匿名 handler（L775-864，内 L803 beginTipSubBoneRotate）；transformControls objectChange 匿名 handler（L865-1000，内 L928 applyTipSubBoneTransform）；window pointermove L27499（updatePanelTipHover）/L27518（updatePanelSplitHandleDrag）；pointerup L27543 / pointercancel L27577（endPanelSplitHandleDrag）；renderer pointerdown capture L27616（prepareCurvePointSelection）；pointerdown 主匿名 handler L27651（内 L27749 beginPanelSplitHandleDrag、L27776/27783 syncPanelSegmentControls）。

## 5. 硬障碍检查

- **`__AHS_TEST_SEAM`（L28173-28228，当前已重定位到 28173）**：引用本批 **3 个函数 → 必须 seam 重导出**：
  - B1：`syncPanelSegmentControls`（L28213）
  - B2：`beginTipSubBoneRotate`（L28190）、`applySubBoneBrushSample`（L28195）
  - 改法：seam 内改为 `beginTipSubBoneRotate: bonesApi.beginTipSubBoneRotate`、`applySubBoneBrushSample: bonesApi.applySubBoneBrushSample`、`syncPanelSegmentControls: segmentApi.syncPanelSegmentControls`（或 bonesApi.*）。`scripts/verify-tip-select.mjs` 依赖 seam 对象（sculptState/updateCurveObjects/locks/splitTipForSegment/tipSegmentWeightAt 等已存在），不直接调用这 3 个名字，但 seam 契约须保持完整。
- **pointer 事件层 `userData.tipSubBoneHandle`**：唯一写入点 L25242（beginPanelSplitHandleDrag 内，随 B2 迁出）；读取方是 app.js transformControls dragging-changed handler（L800 `userData.panelTipIndex != null`）→ 事件绑定留 app.js、回调改 api 后契约不变。`tipSubBoneHandle` 目前**只写不读**（app.js 内 0 处读），保留给 B3/测试；B2 模块内照写即可。
- **undo/snapshot/mirror**：undo 捕获经 deps `pushUndoState`（changePanelSplitCount L23265、beginPanelSplitHandleDrag L25248、applySubBoneBrushSample L26744；beginTipSubBoneRotate 的 pushUndoState 在 app.js L802 handler 内，不随迁）；snapshot/restore 序列化（splitBonesToData/bonesFromData 等）留 app.js 脊柱，模块只就地改 lock 对象；mirror 经 deps `syncActiveMirror`（applyTipSubBoneTransform L25202、changePanelSplitCount L23288、updatePanelSplitHandleDrag L25367/25409/25464/25507/25546）。无脊柱改动。
- **B3（视口 handle）边界**：B1/B2 不创建 handle（创建在 createCurveObjects L15921/updateCurveObjects L16284 内 L16027-16684）；beginPanelSplitHandleDrag 只读 handles 数组 + userData、调 updateCurveObjects 刷新可见性。**B3 拆出时须保持本批读取的 object 布局与 userData 字段名**（panelSplitHandles/panelSegmentHandles/panelTipHandles/tipWidthHandles/strandSplitHandle、panelTipIndex/panelTipPoint/tipWidthIndex/tipWidthSegment/tipWidthSide/tipSubBoneHandle）。
- **G6 双向边**：见 §2 边汇总与 §8 存疑 2/3。若 B2 先于 G6 落地：app.js 批填把 sculptBrushPointWeight/sculptBrushWorldDelta/viewportPixelPoint 指向现有顶层函数（HEAD L26491/L26501/L26291），G6 落地后改指 `sculptGeom.*`；G6 落地时其 `sculptGeomDeps` 注入的 applySubBoneBrushSample 改为 `bonesApi.applySubBoneBrushSample`（工作区 G6 已在 L2496 注入，见页首 ⚠）。
- **跨批次重接**（改 app.js 内调用为 `segmentApi.*`/`bonesApi.*`）：B1 5+1 处（L15354、L17853、L18088、L18373、L23245、L23294-23295、L23300/23302/23308/23310/23321、L23336-23337、L27776/27783）；B2 9+2 处（L803、L928、L26884、L27499、L27518、L27543、L27577、L27616、L27749 + seam L28190/L28195）。模块间互调（B2→B1 syncPanelSegmentControls 4 处）经 deps 注入，模块内不改。
- **引导期**：见 §4，无冲突。

## 6. 输出建议

- **模块文件（推荐 modules/bones/ 域，按 plan §二/§三）**：
  - `modules/bones/segment-control.js` → `createSegmentControlApi(deps)`：B1 5 函数（~121 行，含 4 条批内边，纯 UI/数据胶水）。
  - `modules/bones/bone-interaction.js` → `createBoneInteractionApi(deps)`：B2 8 函数（~695 行；经 deps 注入 `syncPanelSegmentControls: segmentApi.syncPanelSegmentControls` 消费 B1）。
  - 备选：单文件 `modules/bones/bone-ui.js`（createBoneUiApi，13 函数）——省去 B2→B1 的 deps 接线；若想 B1 独立 commit 先行，双文件更贴合 plan 顺序（B1→B2）。
  - B0（bone-model.js 移入 modules/bones/）未做：本批模块先 `import … from "../geometry/bone-model.js"`，B0 后改 `./bone-model.js`（单行）。
- **装配点**：api 创建 L1541 后；deps 批填 L9081 后、L23203 前（建议并入 taperEditorDeps 批填块后统一风格）。
- **外部调用点数量**：B1 **16 处**（app.js，不含 seam）+ seam 1 = 17；B2 **9 处**（app.js，不含 seam）+ seam 2 = 11；**合计 25 处 + seam 3**。跨模块当前 0 处。
- **净减行估算**：B1 121 毛行 → ~90-95 净（低于 plan ~180，plan 为 32,530 行口径毛估）；B2 695 毛行 → ~520 净（≈plan 540）。合计 ~610-615 净减（app.js 28,229 → ~27,600）。
- **难度**：B1 **低中**（DOM 胶水 + taperEditor/panelTipStrand 模块实例 + bone-model 数据读；dep 面广但逻辑浅）。B2 **中**（gizmo/pointer/brush 交互；双向 G6 边、B3 handles 契约、seam 3 重导出、220 行大函数 updatePanelSplitHandleDrag 四分支）。
- **边界存疑点**：
  1. `prepareCurvePointSelection` 非 bone 专属（通用 strand 控制点选择，110 行）：建议本批随 B2 迁（plan 已定），但明确其归属可争议，亦可留 app.js 或归未来「strand 选择」批次。
  2. G6 未落地：B2 的三个 G6 dep（sculptBrushPointWeight/sculptBrushWorldDelta/viewportPixelPoint）当前是 app.js 顶层函数；先落 B2 用注入，G6 落地后 app.js 批填改指 sculptGeom.*（模块内零改动）。
  3. G6→B2 反向边（applySculptMoveStrokeSample L26884 调 applySubBoneBrushSample）：方向与「几何只读骨骼数据」相反，G6 批已按注入处理；B2 落地后 app.js 把注入对象改指 bonesApi.applySubBoneBrushSample。
  4. B3 handles 数据结构契约（见 §5）——B3 拆出前保持。
  5. `sculptBrushStrengthByTool` 读取（applySubBoneBrushSample L26764）：G6 计划 §8.5 建议留 app.js 注入，本批同，避免双端重接。
  6. `clonePanelSplits`/`snapPanelSplitHeight` 非 bone-model 导出 → 注入（后续可随 B0 下沉）。
  7. 行号口径：本报告全部基于当前 HEAD（073a0da）；执行时若 G6 已提交需重跑定位（seam 与 B2 主簇会再上移）。
- **seam 重导出清单**（3）：`syncPanelSegmentControls`、`beginTipSubBoneRotate`、`applySubBoneBrushSample`。
- **回归**：沿用模板——`node --check` 三文件（app.js + 两个新模块）+ `scripts/verify-smoke.mjs`（layered-side-bun.ahs）与 HEAD 基线一致（10/11）+ `scripts/verify-tip-select.mjs`（seam 契约，?ahstest=1）必须仍通过。建议按 B1→B2 两 commit 落地（B1 先，零 G6 依赖；B2 次，注入 G6 dep）。


---

## 执行记录（B1+B2 落地，2026-08-12）

> 执行：Codex · 分支 `0.2.59-refactor` · 基线 HEAD `71b8a02`（G6 6ade6f8 + B0 71b8a02 已提交，app.js 27,477 行）· **已改 app.js + 新建 2 模块，未 commit**。行号口径：本记录内全部为执行后工作区实测。

### 实际迁出

- **B1 → `modules/bones/segment-control.js`（createSegmentControlApi，5 函数 / 121 行）**：`selectedPanelSegment` / `syncPanelSegmentControls` / `syncPanelShapeInputs` / `openPanelSegmentCurveEditor` / `changePanelSplitCount`。
- **B2 → `modules/bones/bone-interaction.js`（createBoneInteractionApi，8 函数 / 695 行）**：`beginTipSubBoneRotate` / `applyTipSubBoneTransform` / `beginPanelSplitHandleDrag` / `updatePanelSplitHandleDrag` / `endPanelSplitHandleDrag` / `applySubBoneBrushSample` / `updatePanelTipHover` / `prepareCurvePointSelection`。
- 合计 13 函数 / 816 毛行迁出；app.js 27,477 → **26,761 行**（净减 716；816 毛行 − ~100 脚手架）。
- 模块内函数体由 app.js 逐字节抽取（brace 匹配定界）后仅做 `X` → `deps.X` 标识符改写，字符串/注释不触碰，中文逐字节守恒（13 函数非 ASCII diff 全 0）。

### 25+3 接线（app.js 内全部改 `segmentApi.*` / `bonesApi.*`）

- **B1 16 处**：L15411（applyAltClickCandidate）、L17829（syncCreationShapeInputs）、L18064（updateAttributeEditorMode）、L18349（syncInputs）、L23221（panelShapeInputs 监听）、L23249/23250（add/removePanelSplitButton）、L23255/23257（previous 段按钮）、L23263/23265（next 段按钮）、L23276（panelSegmentSpread 监听）、L23291/23292（editPanelSegmentWidth/DepthCurveButton）、L26305/26312（pointerdown tip 选择/取消选择）。
- **B2 9 处**：L806（transformControls dragging-changed → beginTipSubBoneRotate）、L931（objectChange → applyTipSubBoneTransform）、L2506（sculptGeomDeps.applySubBoneBrushSample）、L26031（pointermove updatePanelTipHover）、L26050（pointermove updatePanelSplitHandleDrag）、L26075（pointerup endPanelSplitHandleDrag）、L26109（pointercancel endPanelSplitHandleDrag）、L26148（pointerdown capture prepareCurvePointSelection）、L26281（pointerdown beginPanelSplitHandleDrag）。
- transformControls 顶层匿名 handler 留 app.js，回调改 api；pointer 层 6 处注册留 app.js，引用改 api。
- **B2→B1**：`syncPanelSegmentControls` 4 处批内调用经 `deps.syncPanelSegmentControls`（app.js 批填 `segmentApi.syncPanelSegmentControls`）。

### 3 个 seam 重导出确认（__AHS_TEST_SEAM，现 L26719 起）

1. `beginTipSubBoneRotate: bonesApi.beginTipSubBoneRotate,`
2. `applySubBoneBrushSample: bonesApi.applySubBoneBrushSample,`
3. `syncPanelSegmentControls: segmentApi.syncPanelSegmentControls,`
- CDP 实测（?ahstest=1）：三者为 function、均可调用不抛（syncPanelSegmentControls(null)=undefined、beginTipSubBoneRotate(undefined)=undefined、applySubBoneBrushSample(null,0,0,0,0)=false）、boot+seam 0 异常。

### 装配与 deps 时序

- api 创建：`sculptGeom`（L1554）后新增 `segmentControlDeps/segmentApi/boneInteractionDeps/bonesApi`。
- deps 批填：`taperEditorDeps` Object.assign 块（L9214 `});`）之后，`segmentControlDeps` 生效行 **L9263**、`boneInteractionDeps` 生效行 **L9314**（最后一个 dep：shapePresets/taperEditorDeps 块）。
- 首条 boot 路径 `updateAttributeEditorMode()`（L26700）→ `segmentApi.syncPanelShapeInputs`（L18081）在批填之后；pointer/gizmo 监听注册（L26031+）亦在批填之后。
- sculptGeomDeps 批填在 L2506 引用 `bonesApi.applySubBoneBrushSample`（bonesApi 于 L1560 创建，早于 L2506，无 TDZ）。

### deps 清单

- **segment-control（B1）**：sculptState/sel（.state 代理）、taperEditor、shapePresets、branchSweep、panelCreationDefaults、DOM（panelSegmentLabel/previous/nextPanelSegmentButton/panelSegmentSpread/panelSegmentSpreadValue/segmentTaperPreview/segmentDepthPreview/panelShapeInputs/panelShapeValues/panelSplitCountValue/add/removePanelSplitButton/sweepProfileEditor/taperMeshPointsToggleRow/taperCurveEditor）、helpers（getSelectedLock/isPanelGeometry/pushUndoState/updateDrawStrandPreview/updateLockGeometry/rebuildCurveObjects/syncActiveMirror/updateTopologyStats/updateViewportStatsVisibility/clonePanelSplits/snapPanelSplitHeight）；import THREE + splitBonesFor/materializeSplitBones（./bone-model.js）。
- **bone-interaction（B2）**：sculptState/sel/guideState/scalpState（.state 代理）、taperEditor、panelTipStrand、sculptGeom、syncPanelSegmentControls（segmentApi）、locks/renderer/camera/raycaster/pointer/transformControls、DOM（taperCurveEditor/sculptBrushRadiusInput/sculptBrushFalloffInput/sculptBrushStrengthInput/sculptBrushStrengthByTool）、helpers（25 个，见模块头注释）；import THREE + splitBonesFor/materializeSplitBones + smoothSculptPointDeltas（sculpt-brush.js）。
- `document` 按既有模块惯例保留浏览器全局，不注入。

### 边界存疑点（B2↔G6 处理）

- G6 已提交：B2 模块内直接用 `deps.sculptGeom.sculptBrushPointWeight/sculptBrushWorldDelta/viewportPixelPoint`（app.js 批填 `sculptGeom` 实例）；app.js `sculptGeomDeps` 的 `applySubBoneBrushSample` 注入改指 `bonesApi.applySubBoneBrushSample`（模块 sculpt-geometry.js L549 `deps.applySubBoneBrushSample` 零改动）。
- `prepareCurvePointSelection` 仍按 plan 归 B2 迁出（通用 strand 选择，非 bone 专属，归属可争议）。
- B3 handles 契约（lock.curveObjects.panelSplitHandles/... + userData.tipSubBoneHandle 等）未动，B2 只读消费。
- `clonePanelSplits`/`snapPanelSplitHeight`/`sculptBrushStrengthByTool` 仍留 app.js 注入（未随 bone-model 下沉）。

### 踩坑

1. **模块生成混行尾**：初版模块脚手架用 `\n` 拼接导致 CRLF/LF 混合，已整体归一为纯 CRLF。
2. **mask-restore 重写方案失效**：先掩码字符串/注释再正则替换再还原，替换改变长度后 span 偏移错位（`taperEd"taperCurve"aperPreview` 乱码）——改为单趟 token 级精确替换（仅代码 token、跳过字符串/注释）后零错误。
3. **verify-tip-select 环境限制**：仓库唯一 .ahs（layered-side-bun.ahs）无 split panel lock，`found split panel lock` 在基线 HEAD 与本次改动**同样 FAIL**（非回归）；改用自写 CDP 脚本直接验证 3 个 seam 重导出全部通过。
4. **裸引用扫描器**：箭头函数参数回溯匹配需取最近配对 `(`（外层 `find(` 会误配）；ident 边界需排除前后 word char（`pointer` vs `pointerId`）。
5. **app.js 全量裸引用扫描**的其余命中均为既有 import 绑定/浏览器全局（createScalpBuilderApi/Event/FileReader 等），与本批无关；本批相关标识符（segmentApi/bonesApi/13 函数名/全部 deps）零命中。

### 7 项验证结果

1. 裸引用静态扫描归零：segment-control.js/bone-interaction.js clean；app.js 13 函数名 targeted scan 0 bare；app.js interesting-set 命中空。
2. store 代理双重 .state：无 `deps.X.state` / `.state.state`。
3. 引导期 deps 时序：批填生效行 L9263/L9314，首条 boot 路径（updateAttributeEditorMode→segmentApi.syncPanelShapeInputs L18081）在批填后。
4. 跨批次重接：sculptGeomDeps.applySubBoneBrushSample→bonesApi（L2506）；guideDeps 无引用；sculpt-geometry.js 仅 deps.applySubBoneBrushSample（L549）。
5. 编码：UTF-8 无 BOM、纯 CRLF（app.js 26,761 CRLF/0 bareLF；两模块 CRLF/0 bareLF）、中文逐字节守恒（13 函数非 ASCII diff=0）。
6. 语法：`node --check` app.mjs + segment-control.mjs + bone-interaction.mjs 全 0。
7. 执行记录：本节约定。
- 附加回归：verify-smoke（layered-side-bun.ahs）**10/11**（与 HEAD 基线一致）；verify-tip-select 在基线/改动同为 `found split panel lock` FAIL（环境限制，见踩坑 3）；自写 seam CDP 检查 8/8 PASS。