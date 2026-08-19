// project-store.js — save/export/preset project state (refactor 3c-6).
// Includes the 8 IO deps states that fileApi getter/setters now read from here.
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
import { emptyShapePresetLibrary } from "../data/shape-presets.js";
import { emptyToolPresetLibrary } from "../data/tool-presets.js";
export function createProjectStore() {
  const store = createSceneStore({
    customCreationPresets: emptyToolPresetLibrary(),
    customShapePresets: emptyShapePresetLibrary(),
    sweepProfileMirrorEnabled: false,
    pendingCreationPresetType: null,
    pendingShapePresetSave: null,
    pendingShapePresetRemoval: null,
    pendingCreationPresetRemoval: null,
    activePresetFilter: "full",
    currentProjectName: "Untitled Hair Project",
    pendingDroppedApplicationFile: null,
    quickSaveFileHandle: null,
    quickSaveFileName: null,
    projectSaveInProgress: false,
    lastExport: null,
    quickExportFileHandle: null,
    quickExportInProgress: false,
    pendingFileAction: null
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
