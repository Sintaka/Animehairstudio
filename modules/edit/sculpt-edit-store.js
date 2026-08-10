// sculpt-edit-store.js — sculpt / edit / drag / tool interaction state (refactor 3c-final).
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
export function createSculptEditStore() {
  const store = createSceneStore({
    uniformScaleDrag: null, transformScaleDrag: null, transformPrecisionDrag: null, selectionRemoveHeld: false,
    uvInspectorDrag: null, referenceScaleDrag: null, referenceOverlayDrag: null, referenceCropDrag: null,
    sculptMoveStroke: null, sculptBrushShiftSmoothHeld: false, activeHandleEdit: null, activeLatticeMultiEdit: null,
    transformDragging: false, sculptBrushGeometryFrame: null, objectSpaceEditing: true, hierarchyEditing: false,
    mirrorXEditing: false, proportionalEditing: false, proportionalRootLocked: false, headSetupEditing: false,
    capsuleGuideEditing: false, capsuleGuideLoopSelection: null, capsuleGuideLoopDrag: null, selectionMarqueeDrag: null,
    altOrbitDrag: null, blenderNavigationDrag: null, pointRemovalCandidate: null, houdiniZoomDrag: null,
    curvePointInsertionCandidate: null, selectPointerCapture: null, relaxEdit: null, placeEdit: null,
    drawStrandStroke: null, capsuleGuideDrawStroke: null, polyBrushStroke: null, curveSurfaceDraft: null,
    panelSplitDrag: null, panelSegmentIndex: 0, panelTipSelection: null, panelTipHover: null, activeCapsuleGuideEdit: null, placementPointer: null, emptySelectionPointer: null,
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
