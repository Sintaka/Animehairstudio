// sculpt-edit-store.js — sculpt / edit / drag / tool interaction state (refactor 3c-final).
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
export function createSculptEditStore() {
  const store = createSceneStore({
    uniformScaleDrag: null, transformScaleDrag: null, transformPrecisionDrag: null, selectionRemoveHeld: false,
    uvInspectorDrag: null, windPreviewDrag: null, referenceScaleDrag: null, referenceOverlayDrag: null, referenceCropDrag: null,
    sculptMoveStroke: null, sculptBrushShiftSmoothHeld: false, activeHandleEdit: null, activeLatticeMultiEdit: null,
    transformDragging: false, sculptBrushGeometryFrame: null, objectSpaceEditing: true, hierarchyEditing: false,
    mirrorXEditing: false, proportionalEditing: false, proportionalRootLocked: false, headSetupEditing: false,
    capsuleGuideEditing: false, capsuleGuideLoopSelection: null, capsuleGuideLoopDrag: null, selectionMarqueeDrag: null,
    altOrbitDrag: null, blenderNavigationDrag: null, pointRemovalCandidate: null, houdiniZoomDrag: null,
    curvePointInsertionCandidate: null, selectPointerCapture: null, relaxEdit: null, placeEdit: null,
    drawStrandStroke: null, capsuleGuideDrawStroke: null, polyBrushStroke: null, curveSurfaceDraft: null,
    // tipSelection / tipHover：发尖子骨骼的**几何无关**选择/悬停状态（0.2.126 起，原名
    // panelTipSelection / panelTipHover 只服务 panel）。形状恒为 { lockId, segmentIndex } |
    // null，segmentIndex 在 panel 上是段号、在普通发丝上是管号（由 segmentBoneHost 决定含义）。
    // 单键而非两套 panel/strand 键：清理路径（selectLock）、表面高亮（updateTipHighlight）、
    // 笔刷门控（applySubBoneBrushSample）与 tipUiActive 各自只有一份实现，两套键会让这四处
    // 都长出 if(几何) 分叉。**与 panelSegmentIndex / strandSegmentIndex 的关系**：那两个是
    // 「右侧面板当前显示哪一段」（恒非 null、被 resolveSegmentSelection 钳位）；本键是
    // 「视口里选中了哪个发尖子骨骼」（可为 null = 未选中，点同一处再点即取消）。选中发尖会
    // 顺带把对应 segmentIndex 指过去，取消选中**刻意不**回退段号（panel 既有手感）。
    panelSplitDrag: null, panelSplitSelection: null, strandSplitSelection: null, panelSegmentIndex: 0, strandSegmentIndex: 0, tipSelection: null, tipHover: null, activeCapsuleGuideEdit: null, placementPointer: null, emptySelectionPointer: null,
    proportionalSizeEdit: null, proportionalHotkeyPress: null, brushSizeDrag: null, strandWidthEdgeDrag: null,
    brushSizeHotkeyHeld: false, viewSnapDrag: null, viewPlaneMoveEnabled: false, viewPlaneNormalMoveHeld: false,
    viewPlaneMoveDrag: null, pullMoveEnabled: false, pullCollisionEnabled: true, pullRigidity: 0.65,
    sweepProfileEdit: null, taperCurveEdit: null, taperMeshPointDrag: null, viewportEditMode: "strand",
    duplicatePlacement: null, proceduralDuplicateModeActive: false, proceduralDuplicateWindowSourceIds: [],
    proceduralDuplicatePreview: null, rebuildingProceduralDuplicatePreview: false, scheduledTaperCurveEditFrame: null,
    taperCurveEditInteractiveDirty: false, branchRegionEdit: null, branchRegionCanvasDrag: null, branchRegionZoomDrag: null,
    branchRegionPanDrag: null, branchSweepStartDrag: null, proceduralAccessoryEditHistoryOpen: false,
    proceduralAccessoryEditPointerActive: false, sculptBrushViableLockIds: new Set(), compactAttributeEditorCollapsed: false
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
