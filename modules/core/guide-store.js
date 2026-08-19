// guide-store.js — scalp-guide / curve-lattice / capsule guide state (refactor 3c-6).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
export function createGuideStore() {
  const store = createSceneStore({
    guideModel: null,
    capsuleGuidesVisible: true,
    curveLatticeGuidesVisible: true,
    hoveredControlPoint: null,
    activeCapsuleGuideLoopTransform: null,
    activeGuideObjectTransform: null,
    pendingClumpPresetGuideId: null,
    capsuleGuideLoopHover: null,
    curveLatticeLoopHover: null,
    controlPointDisplaySize: 1
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
