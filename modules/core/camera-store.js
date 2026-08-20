// camera-store.js — viewport/camera UI state (refactor 3c-5). Preference-backed
// fields are assigned by app.js at their original init site (keeps normalize fns local).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
export function createCameraStore() {
  const store = createSceneStore({
    orthographicView: false,
    orthographicHalfHeight: 1,
    turntableActive: false,
    turntableSpeed: 1,
    navigationTipsEnabled: true,
    navigationStyle: "anime-hair-studio",
    cameraSmoothingEnabled: false,
    cameraSmoothingStrength: 0.5,
    viewportStatisticsEnabled: true,
    viewportBackgroundColor: "#17151c",
    activeViewportPointer: null,
    viewportFrameCycleStep: 0
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
