// reference-store.js — reference image scene state (refactor 3c-3).
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";

export function createReferenceStore() {
  const store = createSceneStore({
    referenceImageIndex: 1,
    pendingReferenceImageType: null
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
