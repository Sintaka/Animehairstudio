// ui-store.js — viewport/panel UI state (refactor 3c-3b).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
import { readStoredBooleanPreference } from "./preference-storage.js?v=20260728-1";

export const UI_PREFERENCE_KEYS = Object.freeze({
  radialMenus: "anime-hair-studio-radial-menus",
  panelSplitSnapWarning: "anime-hair-panel-split-snap-warning"
});

export function createUiStore() {
  const store = createSceneStore({
    radialMenusEnabled: readStoredBooleanPreference(window, UI_PREFERENCE_KEYS.radialMenus, true),
    preferencesOpenSnapshot: null,
    shiftSnappedViewActive: false,
    viewPlaneMoveSnappedOnly: false,
    inputUndoCaptured: false,
    panelSplitSnapWarningAcknowledged: localStorage.getItem(UI_PREFERENCE_KEYS.panelSplitSnapWarning) === "true",
    panelSplitSnapWarningContinuation: null
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
