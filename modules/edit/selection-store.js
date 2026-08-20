// selection-store.js — selection/outliner scene state (refactor stage 3b).
// Pairs with io/project-state.js createProjectSelectionSnapshot: selectionSnapshot()
// returns exactly the fields that function expects.
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";

export function createSelectionStore() {
  const store = createSceneStore({
    selectedId: undefined,
    selectedStrandIds: new Set(),
    clumpViewportSelection: false,
    selectedGuideId: undefined,
    selectedReferenceImageId: null,
    activeCurveLatticeGuideId: null,
    selectedStrandGroup: null,
    selectedPoint: null,
    selectedCurveSurfaceController: null,
    selectedCurveLatticePoint: null,
    selectedControlPoints: [],
    pendingPlacedLockId: null,
    isolatedStrandIds: null,
    lockIndex: 1,
    activeTool: "select",
    viewportSelectionMode: "component",
    selectedSurfaceObjectAnchorId: null,
    layerColorShiftsEnabled: true,
    outlinerFolderColorsEnabled: true,
    selectionSetsOpen: true,
    activeOutlinerTab: "strands",
    outlinerContextTarget: null,
    viewportFrameSelectionKey: "",
    compactOutlinerCollapsed: false
  });
  return {
    state: store.state,
    selectionSnapshot() {
      const s = store.state;
      return {
        selectedId: s.selectedId,
        selectedStrandIds: [...s.selectedStrandIds],
        clumpViewportSelection: s.clumpViewportSelection,
        selectedGuideId: s.selectedGuideId,
        selectedReferenceImageId: s.selectedReferenceImageId,
        activeCurveLatticeGuideId: s.activeCurveLatticeGuideId,
        selectedStrandGroup: s.selectedStrandGroup,
        selectedPoint: s.selectedPoint ? { ...s.selectedPoint } : null,
        selectedCurveSurfaceController: s.selectedCurveSurfaceController ? { ...s.selectedCurveSurfaceController } : null,
        selectedCurveLatticePoint: s.selectedCurveLatticePoint ? { ...s.selectedCurveLatticePoint } : null,
        selectedControlPoints: s.selectedControlPoints.map((point) => ({ ...point })),
        pendingPlacedLockId: s.pendingPlacedLockId
      };
    }
  };
}
