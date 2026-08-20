// undo-store.js — undo/redo workflow flags (refactor 3c-4).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
export function createUndoStore() {
  const store = createSceneStore({
    restoringHistory: false,
    historyShortcutHeld: false
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
