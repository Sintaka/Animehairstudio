// transform-store.js — gizmo/transform interaction state (refactor 3c-4).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
export function createTransformStore() {
  const store = createSceneStore({
    transformPrecisionHeld: false,
    activeSurfaceObjectTransform: null,
    recursiveHierarchyTransforms: false
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
