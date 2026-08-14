// draw-store.js — draw / poly-brush scene state (refactor 3c-2).
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
import { readStoredBooleanPreference } from "../core/preference-storage.js?v=20260814-12";

export const DRAW_PREFERENCE_KEYS = Object.freeze({
  proceduralDrawExperimental: "anime-hair-studio-experimental-procedural-draw"
});

export function createDrawStore() {
  const store = createSceneStore({
    polyAltDeleteCandidate: null,
    polyFillPreviewGroup: null,
    polyFillPreviewCandidate: null,
    polyShiftPreviewHeld: false,
    activeCustomDrawClumpTemplate: null,
    proceduralDrawExperimentalEnabled: readStoredBooleanPreference(
      window,
      DRAW_PREFERENCE_KEYS.proceduralDrawExperimental,
      false
    )
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
