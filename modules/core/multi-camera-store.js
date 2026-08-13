// multi-camera-store.js - experimental four-view camera layout state (main v0.1.5 port).
// Runtime-only state: nothing here is serialized into .ahs project files or the
// preferences backup; the enabled toggle is a UI preference backed by localStorage.
import { createSceneStore } from "./scene-store.js?v=20260809-1";
import { readStoredBooleanPreference } from "./preference-storage.js?v=20260728-1";

export const MULTI_CAMERA_PREFERENCE_KEYS = Object.freeze({
  experimental: "anime-hair-studio-experimental-multi-camera"
});

export function createMultiCameraStore() {
  const store = createSceneStore({
    experimentalEnabled: readStoredBooleanPreference(
      window,
      MULTI_CAMERA_PREFERENCE_KEYS.experimental,
      false
    ),
    enabled: false,
    activeView: "perspective",
    previewRenderers: null,
    previewRenderCursor: 0,
    previewRenderPauseFrames: 0
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
