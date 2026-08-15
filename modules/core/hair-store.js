// hair-store.js — hair strand/mesh viewport state (refactor 3c-7).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
import { DEFAULT_HAIR_MATERIAL_ID } from "./app-config.js";
export function createHairStore() {
  const store = createSceneStore({
    strandRadialGesture: null,
    drawStrandMode: "standard",
    activeHairMaterialId: DEFAULT_HAIR_MATERIAL_ID,
    uvCheckerEnabled: false,
    taperMeshPointsVisible: false,
    moveGrabHandleVisibility: { width: true, depth: false, uniform: false },
    moveCurveControlVisibility: { taperCurve: false, depthCurve: false, twistCurve: false },
    showGroupColors: false,
    hairTopologyVisible: false,
    activeStrandObjectTransform: null,
    strandRadialActions: [],
    pendingLockGeometryFrame: null,
    hoveredStrandWidthEdge: null,
    hoveredStrandId: null,
    headMeshVisible: true,
    bodyMeshVisible: true,
    hairMaterialIndex: 1,
    branchRegionMeshPointsVisible: true,
    uvInspectorDirty: true,
    strandRadialTargetId: null,
    uvCheckerTexture: null,
    uvCheckerPreview: false,
    defaultHairShader: "standard-anisotropic",
    twistCurveAllStrandsPreviewEnabled: true,
    sweepOverlapStrength: 0.7,
    sweepOverlapThreshold: 0.6,
    sweepEdgeSmooth: 0.3,
    sweepOverlapFalloff: 3,
    sweepTangentSmooth: 0.3,
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
