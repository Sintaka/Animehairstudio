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
    pendingFileAction: null,
    // File > New 的空场景基准：boot 结束时（在 offerRecoverySnapshot 之前）由 app.js
    // 用 snapshotState() 抓一次并**存成 JSON 字符串**。存字符串而不是对象，是因为
    // restoreState 会把还原出的数组/对象接进场景并就地改写（locks 会被 restoreLock
    // 消费），留着同一份对象引用会让第二次 New 拿到已被污染的基准。
    // 抓取时机 = 应用自己的初始状态，所以 New 与「刚打开应用」逐字段一致，不必另外
    // 维护一份「空项目」定义（那必然与 boot 漂移）。
    pristineProjectSnapshot: null
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
