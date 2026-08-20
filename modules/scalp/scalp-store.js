// scalp-store.js — scalp guide/builder/paint state (refactor 3c-final, scalp).
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
export function createScalpStore() {
  const store = createSceneStore({
    defaultScalpGeometryData: null,
    scalpManualRegionQuads: new Set(),
    scalpGuideSource: "default",
    customScalpSurfaceMesh: null,
    customScalpSurfaceWire: null,
    customScalpSelectionOutline: null,
    customScalpRegions: [],
    importedScalpGuideAsset: null,
    editedScalpSurfaceMesh: null,
    editedScalpSurfaceWire: null,
    editedScalpSelectionOutline: null,
    editedScalpRegions: [],
    authoredScalpGuideMatrix: null,
    scalpGuideVisible: false,
    scalpShapeEditing: false,
    scalpLatticeEditing: false,
    scalpPaintEditing: false,
    scalpBuilderEditing: false,
    scalpBuilderStep: 0,
    scalpBuilderStroke: null,
    scalpBuilderPlane: null,
    scalpBuilderCurveLattice: null,
    activeScalpBuilderCurveLatticeEdit: null,
    scalpBuilderEditedPoints: null,
    scalpBuilderCurveLatticeLoadToken: 0,
    scalpBuilderCurveLatticePromise: null,
    scalpPaintDrag: null,
    activeScalpRegion: "bangs",
    selectedScalpLatticeIndex: null,
    scalpLatticeDrag: null,
    scalpTopologyTemplatePromise: null,
    scalpQuadEdges: null,
    scalpActiveVertexIndices: [],
    scalpRegionAssignments: null,
    scalpVisibleQuads: []
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
