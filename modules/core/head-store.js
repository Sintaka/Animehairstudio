// head-store.js — imported head/full-body mesh state (refactor 3c-4).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
export function createHeadStore() {
  const store = createSceneStore({
    importedHeadAsset: null,
    enterHeadSetupAfterHeadImport: false,
    enterHeadSetupAfterFullBodyImport: false
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
