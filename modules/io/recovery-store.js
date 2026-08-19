// recovery-store.js — autosave / crash-recovery scheduling state (port of main 0.1.5).
// All autosave state lives here (no new top-level let in app.js); the scheduler itself
// stays in app.js, using the store pattern from modules/core/scene-store.js.
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
import { DEFAULT_AUTOSAVE_INTERVAL_SECONDS } from "./recovery-storage.js?v=20260813-1";

export function createRecoveryStore() {
  const store = createSceneStore({
    autosaveEnabled: true,
    autosaveIntervalSeconds: DEFAULT_AUTOSAVE_INTERVAL_SECONDS,
    recoveryChangeVersion: 0,
    recoveryDirty: false,
    recoveryQuietTimer: null,
    recoveryMaximumTimer: null,
    recoveryIdleHandle: null,
    recoveryWriteInProgress: false,
    recoveryWriteQueued: false,
    recoveryWritePromise: null,
    pendingRecoveryRecord: null
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
