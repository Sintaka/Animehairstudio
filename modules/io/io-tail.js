// io-tail.js - IO tail: rootAttachment serialization/metadata + preferences/project/recent
// file flows (refactor batch C1). Extracted from app.js; all app.js coupling injected via
// createIoTailApi(deps). rootAttachment helpers are pure geometry + scalpBuilder deps; the
// preferences/project/recent group carries the open/import/remember flows.
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { cleanFileBaseName } from "./file-actions.js";
import { rememberRecentProject, listRecentProjects } from "./recent-projects.js";
import {
  createPreferencesBackup,
  normalizePreferencesBackup,
  preferencesBackupFileName
} from "../core/preferences-backup.js";
import { validateHairProject } from "./project-schema.js";
import { applicationDropFileKind } from "./file-drop.js";
import { polygonOnlyObjSource } from "./obj-import.js";
import { normalizeShapePresetLibrary } from "../data/shape-presets.js";
import { normalizeLanguage } from "../data/localization.js";
import { APP_VERSION } from "../core/app-config.js";
export function createIoTailApi(deps) {
  // deps: rootAttachment group (scalpBuilder/layerOffsetForLock/layerRootOffsetFactor/
  //   normalizeHairLayer/vectorToData/dataToVector),
  // preferences group (fileApi/documentLocalizer/saveLanguage/languageSelect/braidCreationDefaults/
  //   braidToolPresetInput/creationPresets/shapePresets + store .state proxies
  //   projectState/hairState/sel/ui/draw/miscState/guideState/viewportState/scalpState/head;
  //   use deps.X.y, never deps.X.state.y, except full store objects projectState/scalpState/head
  //   which keep deps.X.state.y),
  // cross-module apis (radialMenuApi/clumpProceduralApi/presetLibraryApi/referenceHeadApi),
  // app.js spine helpers (restoreState/frameViewportBounds/closeAppMenus/updateHistoryButtons/
  //   undoHistory/redoHistory/SUPPORTED_REFERENCE_IMAGE_TYPES + the setXxx preference setters),
  // IO DOM element refs (presetLibraryStatus/hairProjectFileInput/recentProjectsSubmenu/
  //   preferencesAndPresetsFile/preferencesBackupStatus/dropImport*).
  // Batch-fill point in app.js: after dataToVector (last dep; openHairProjectFile also needs
  // fileApi + restoreState defined earlier); see devlog/in-progress/material-io-refactor-map.md.
function rootAttachmentFrame(lock, normal) {
  const tangent = lock.placementFrame?.flow?.clone()
    || lock.points?.[1]?.clone().sub(lock.points[0])
    || new THREE.Vector3(0, -1, 0);
  tangent.projectOnPlane(normal);
  if (tangent.lengthSq() < 0.000001) tangent.set(0, -1, 0).projectOnPlane(normal);
  if (tangent.lengthSq() < 0.000001) tangent.set(1, 0, 0).projectOnPlane(normal);
  tangent.normalize();
  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  return { tangent, bitangent };
}

function rootAttachmentLocalFrame(normal, tangent, bitangent) {
  const mesh = deps.scalpBuilder.activeScalpSurfaceMesh();
  if (!mesh) {
    return {
      normal: normal.clone(),
      tangent: tangent.clone(),
      bitangent: bitangent.clone()
    };
  }
  mesh.updateMatrixWorld(true);
  const inverseWorld = mesh.matrixWorld.clone().invert();
  return {
    normal: normal.clone().transformDirection(inverseWorld).normalize(),
    tangent: tangent.clone().transformDirection(inverseWorld).normalize(),
    bitangent: bitangent.clone().transformDirection(inverseWorld).normalize()
  };
}

function resolveRootAttachment(attachment) {
  const mesh = deps.scalpBuilder.activeScalpSurfaceMesh();
  const geometry = mesh?.geometry;
  const position = geometry?.getAttribute("position");
  const triangleIndex = Number(attachment?.surfaceLocation?.triangleIndex);
  const barycentric = attachment?.surfaceLocation?.barycentric;
  if (!mesh || !position || !Number.isInteger(triangleIndex) || triangleIndex < 0 || !barycentric) return null;

  const index = geometry.getIndex();
  const offset = triangleIndex * 3;
  if (offset + 2 >= (index?.count ?? position.count)) return null;
  const ia = index ? index.getX(offset) : offset;
  const ib = index ? index.getX(offset + 1) : offset + 1;
  const ic = index ? index.getX(offset + 2) : offset + 2;
  const a = new THREE.Vector3().fromBufferAttribute(position, ia);
  const b = new THREE.Vector3().fromBufferAttribute(position, ib);
  const c = new THREE.Vector3().fromBufferAttribute(position, ic);
  const weightTotal = barycentric.x + barycentric.y + barycentric.z || 1;
  const localPoint = a.multiplyScalar(barycentric.x / weightTotal)
    .addScaledVector(b, barycentric.y / weightTotal)
    .addScaledVector(c, barycentric.z / weightTotal);

  mesh.updateMatrixWorld(true);
  const point = localPoint.applyMatrix4(mesh.matrixWorld);
  const localFrame = attachment.localFrame;
  if (!localFrame) return { point };
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const normal = localFrame.normal.clone().applyMatrix3(normalMatrix).normalize();
  const tangent = localFrame.tangent.clone().transformDirection(mesh.matrixWorld).projectOnPlane(normal).normalize();
  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  return { point, normal, tangent, bitangent };
}

const ROOT_LOCAL_CURVE_FIELDS = Object.freeze({
  points: "points",
  clumpRestPoints: "clumpRestPoints",
  clumpGuideRestPoints: "clumpGuideRestPoints",
  groupLatticeBasePoints: "groupLatticeBasePoints"
});

function curvePointsToRootLocal(points, origin, frame) {
  if (!points?.length || !origin || !frame) return null;
  return points.map((point) => {
    const delta = point.clone().sub(origin);
    return new THREE.Vector3(
      delta.dot(frame.bitangent),
      delta.dot(frame.tangent),
      delta.dot(frame.normal)
    );
  });
}

function curvePointsFromRootLocal(points, origin, frame) {
  if (!points?.length || !origin || !frame) return null;
  return points.map((point) => origin.clone()
    .addScaledVector(frame.bitangent, point.x)
    .addScaledVector(frame.tangent, point.y)
    .addScaledVector(frame.normal, point.z));
}

function syncRootAttachmentLocalCurves(lock, attachment) {
  if (!lock?.points?.length || !attachment) return;
  const resolved = resolveRootAttachment(attachment);
  const frame = {
    normal: resolved?.normal || attachment.normal,
    tangent: resolved?.tangent || attachment.tangent,
    bitangent: resolved?.bitangent || attachment.bitangent
  };
  const origin = lock.points[0];
  attachment.localCurves = {};
  Object.entries(ROOT_LOCAL_CURVE_FIELDS).forEach(([attachmentKey, lockKey]) => {
    const localPoints = curvePointsToRootLocal(lock[lockKey], origin, frame);
    if (localPoints) attachment.localCurves[attachmentKey] = localPoints;
  });
}

function applyRootAttachmentLocalCurves(lock) {
  if (lock?.geometryType === "poly") return false;
  const attachment = lock?.rootAttachment;
  if (!attachment?.localCurves?.points?.length) return false;
  const resolved = resolveRootAttachment(attachment);
  if (!resolved?.point || !resolved.normal || !resolved.tangent || !resolved.bitangent) return false;
  const rootOffset = deps.scalpBuilder.rootScalpOffsetDistance(attachment.localOffset)
    + deps.layerOffsetForLock(lock) * deps.layerRootOffsetFactor(attachment.hairLayer);
  const origin = resolved.point.clone().addScaledVector(resolved.normal, rootOffset);
  const frame = {
    normal: resolved.normal,
    tangent: resolved.tangent,
    bitangent: resolved.bitangent
  };

  Object.entries(ROOT_LOCAL_CURVE_FIELDS).forEach(([attachmentKey, lockKey]) => {
    const restored = curvePointsFromRootLocal(attachment.localCurves[attachmentKey], origin, frame);
    if (restored) lock[lockKey] = restored;
  });
  lock.rootSurfacePoint = resolved.point.clone();
  lock.rootSurfaceNormal = resolved.normal.clone();
  if (lock.placementFrame) {
    lock.placementFrame.root.copy(origin);
    lock.placementFrame.normal.copy(resolved.normal);
    lock.placementFrame.flow.copy(resolved.tangent);
    lock.placementFrame.side.copy(resolved.bitangent);
  }
  return true;
}


function createRootAttachment(lock, sourceOverride = null) {
  if (lock?.rootAttachmentEnabled === false) return null;
  const sourcePoint = sourceOverride?.clone() || lock.rootSurfacePoint?.clone() || lock.points?.[0]?.clone();
  if (!sourcePoint) return null;
  const surface = deps.scalpBuilder.closestPointOnActiveScalp(sourcePoint, lock.scalpRegion || null);
  const point = surface?.point || sourcePoint;
  const normal = surface?.normal
    || lock.rootSurfaceNormal?.clone()?.normalize()
    || new THREE.Vector3(0, 1, 0);
  const frame = rootAttachmentFrame(lock, normal);
  const localFrame = rootAttachmentLocalFrame(normal, frame.tangent, frame.bitangent);
  return {
    version: 3,
    coordinateSpace: "scalp-local",
    scalpRegion: lock.scalpRegion || "unassigned",
    regionPosition: surface?.regionPosition ? { ...surface.regionPosition } : null,
    surfaceLocation: surface ? {
      triangleIndex: surface.triangleIndex,
      barycentric: surface.barycentric.clone()
    } : null,
    surfacePoint: point.clone(),
    normal: normal.clone(),
    tangent: frame.tangent,
    bitangent: frame.bitangent,
    localFrame,
    hairLayer: deps.normalizeHairLayer(lock.hairLayer),
    localOffset: Number(lock.rootScalpOffset ?? 0)
  };
}

function syncRootAttachmentMetadata(lock) {
  if (!lock) return null;
  if (lock.rootAttachmentEnabled === false) {
    lock.rootAttachment = null;
    return null;
  }
  if (!lock.rootAttachment) lock.rootAttachment = createRootAttachment(lock);
  if (!lock.rootAttachment) return null;
  lock.rootAttachment.scalpRegion = lock.scalpRegion || "unassigned";
  lock.rootAttachment.hairLayer = deps.normalizeHairLayer(lock.hairLayer);
  lock.rootAttachment.localOffset = Number(lock.rootScalpOffset ?? 0);
  if (lock.rootSurfacePoint) lock.rootAttachment.surfacePoint.copy(lock.rootSurfacePoint);
  if (lock.rootSurfaceNormal) lock.rootAttachment.normal.copy(lock.rootSurfaceNormal).normalize();
  const frame = rootAttachmentFrame(lock, lock.rootAttachment.normal);
  lock.rootAttachment.tangent.copy(frame.tangent);
  lock.rootAttachment.bitangent.copy(frame.bitangent);
  lock.rootAttachment.localFrame = rootAttachmentLocalFrame(
    lock.rootAttachment.normal,
    lock.rootAttachment.tangent,
    lock.rootAttachment.bitangent
  );
  lock.rootAttachment.version = 3;
  lock.rootAttachment.coordinateSpace = "scalp-local";
  syncRootAttachmentLocalCurves(lock, lock.rootAttachment);
  return lock.rootAttachment;
}

function rootAttachmentToData(attachment) {
  if (!attachment) return null;
  return {
    version: Number(attachment.version || 1),
    coordinateSpace: attachment.coordinateSpace || "scalp-local",
    scalpRegion: attachment.scalpRegion || "unassigned",
    regionPosition: attachment.regionPosition ? { ...attachment.regionPosition } : null,
    surfaceLocation: attachment.surfaceLocation ? {
      triangleIndex: Number(attachment.surfaceLocation.triangleIndex),
      barycentric: deps.vectorToData(attachment.surfaceLocation.barycentric)
    } : null,
    surfacePoint: deps.vectorToData(attachment.surfacePoint),
    normal: deps.vectorToData(attachment.normal),
    tangent: deps.vectorToData(attachment.tangent),
    bitangent: deps.vectorToData(attachment.bitangent),
    localFrame: attachment.localFrame ? {
      normal: deps.vectorToData(attachment.localFrame.normal),
      tangent: deps.vectorToData(attachment.localFrame.tangent),
      bitangent: deps.vectorToData(attachment.localFrame.bitangent)
    } : null,
    localCurves: attachment.localCurves ? Object.fromEntries(
      Object.entries(attachment.localCurves).map(([key, points]) => [key, points.map(deps.vectorToData)])
    ) : null,
    hairLayer: deps.normalizeHairLayer(attachment.hairLayer),
    localOffset: Number(attachment.localOffset ?? 0)
  };
}

function rootAttachmentFromData(data, lock, { resolveSurface = true } = {}) {
  if (!data) return createRootAttachment(lock);
  const normal = deps.dataToVector(data.normal || deps.vectorToData(lock.rootSurfaceNormal || new THREE.Vector3(0, 1, 0))).normalize();
  const tangent = deps.dataToVector(data.tangent || { x: 0, y: -1, z: 0 }).normalize();
  const bitangent = deps.dataToVector(data.bitangent || { x: 1, y: 0, z: 0 }).normalize();
  const attachment = {
    version: Number(data.version || 1),
    coordinateSpace: data.coordinateSpace || "scalp-local",
    scalpRegion: data.scalpRegion || lock.scalpRegion || "unassigned",
    regionPosition: data.regionPosition ? { ...data.regionPosition } : null,
    surfaceLocation: data.surfaceLocation ? {
      triangleIndex: Number(data.surfaceLocation.triangleIndex),
      barycentric: deps.dataToVector(data.surfaceLocation.barycentric)
    } : null,
    surfacePoint: deps.dataToVector(data.surfacePoint || deps.vectorToData(lock.rootSurfacePoint || lock.points[0])),
    normal,
    tangent,
    bitangent,
    localFrame: data.localFrame ? {
      normal: deps.dataToVector(data.localFrame.normal).normalize(),
      tangent: deps.dataToVector(data.localFrame.tangent).normalize(),
      bitangent: deps.dataToVector(data.localFrame.bitangent).normalize()
    } : rootAttachmentLocalFrame(normal, tangent, bitangent),
    localCurves: data.localCurves ? Object.fromEntries(
      Object.entries(data.localCurves).map(([key, points]) => [key, points.map(deps.dataToVector)])
    ) : null,
    hairLayer: deps.normalizeHairLayer(data.hairLayer ?? lock.hairLayer),
    localOffset: Number(data.localOffset ?? lock.rootScalpOffset ?? 0)
  };
  const resolved = resolveSurface ? resolveRootAttachment(attachment) : null;
  if (resolved) {
    attachment.surfacePoint.copy(resolved.point);
    if (resolved.normal) attachment.normal.copy(resolved.normal);
    if (resolved.tangent) attachment.tangent.copy(resolved.tangent);
    if (resolved.bitangent) attachment.bitangent.copy(resolved.bitangent);
  }
  return attachment;
}

function downloadPreferencesAndPresets() {
  const exportedAt = new Date();
  const backup = createPreferencesBackup({
    appVersion: APP_VERSION,
    exportedAt: exportedAt.toISOString(),
    preferences: {
      language: deps.documentLocalizer.language,
      navigationTips: deps.viewportState.navigationTipsEnabled,
      navigationStyle: deps.viewportState.navigationStyle,
      cameraSmoothingEnabled: deps.viewportState.cameraSmoothingEnabled,
      cameraSmoothingStrength: deps.viewportState.cameraSmoothingStrength,
      toolTips: deps.miscState.toolTipsEnabled,
      compactToolButtons: deps.miscState.compactToolButtonsEnabled,
      viewportStatistics: deps.viewportState.viewportStatisticsEnabled,
      twistCurveAllStrandsPreview: deps.hairState.twistCurveAllStrandsPreviewEnabled,
      layerColorShifts: deps.sel.layerColorShiftsEnabled,
      outlinerFolderColors: deps.sel.outlinerFolderColorsEnabled,
      sideNamingPerspective: deps.miscState.sideNamingPerspective,
      controlPointDisplaySize: deps.guideState.controlPointDisplaySize,
      viewportBackgroundColor: deps.viewportState.viewportBackgroundColor,
      radialMenus: deps.ui.radialMenusEnabled,
      proceduralDrawExperimental: deps.draw.proceduralDrawExperimentalEnabled,
      defaultShader: deps.hairState.defaultHairShader
    },
    presets: deps.projectState.state.customCreationPresets,
    shapePresets: deps.projectState.state.customShapePresets
  });
  deps.fileApi.downloadProjectFile(
    `${JSON.stringify(backup, null, 2)}\n`,
    preferencesBackupFileName(exportedAt)
  );
}

function importedBooleanPreference(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

async function loadPreferencesAndPresets(file) {
  const backup = normalizePreferencesBackup(JSON.parse(await file.text()));
  const preferences = backup.preferences;
  deps.setNavigationTipsEnabled(importedBooleanPreference(preferences.navigationTips, deps.viewportState.navigationTipsEnabled));
  if (preferences.navigationStyle != null) deps.setNavigationStyle(preferences.navigationStyle);
  deps.setCameraSmoothingEnabled(importedBooleanPreference(preferences.cameraSmoothingEnabled, deps.viewportState.cameraSmoothingEnabled));
  if (preferences.cameraSmoothingStrength != null) {
    deps.setCameraSmoothingStrength(preferences.cameraSmoothingStrength);
  }
  deps.setToolTipsEnabled(importedBooleanPreference(preferences.toolTips, deps.miscState.toolTipsEnabled));
  deps.setCompactToolButtonsEnabled(importedBooleanPreference(preferences.compactToolButtons, deps.miscState.compactToolButtonsEnabled));
  deps.setViewportStatisticsEnabled(importedBooleanPreference(preferences.viewportStatistics, deps.viewportState.viewportStatisticsEnabled));
  deps.setTwistCurveAllStrandsPreviewEnabled(importedBooleanPreference(
    preferences.twistCurveAllStrandsPreview,
    deps.hairState.twistCurveAllStrandsPreviewEnabled
  ));
  deps.setLayerColorShiftsEnabled(importedBooleanPreference(preferences.layerColorShifts, deps.sel.layerColorShiftsEnabled));
  deps.setOutlinerFolderColorsEnabled(importedBooleanPreference(preferences.outlinerFolderColors, deps.sel.outlinerFolderColorsEnabled));
  if (preferences.sideNamingPerspective != null) {
    deps.setSideNamingPerspective(preferences.sideNamingPerspective);
  }
  if (preferences.controlPointDisplaySize != null) {
    deps.setControlPointDisplaySize(preferences.controlPointDisplaySize);
  }
  if (preferences.viewportBackgroundColor != null) {
    deps.setViewportBackgroundColor(preferences.viewportBackgroundColor);
  }
  deps.radialMenuApi.setRadialMenusEnabled(importedBooleanPreference(preferences.radialMenus, deps.ui.radialMenusEnabled));
  deps.clumpProceduralApi.setProceduralDrawExperimentalEnabled(importedBooleanPreference(
    preferences.proceduralDrawExperimental,
    deps.draw.proceduralDrawExperimentalEnabled
  ));
  if (typeof preferences.language === "string") {
    const language = deps.documentLocalizer.setLanguage(normalizeLanguage(preferences.language));
    deps.languageSelect.value = language;
    deps.saveLanguage(language);
  }
  if (preferences.defaultShader != null) deps.setDefaultHairShader(preferences.defaultShader);
  deps.projectState.state.customCreationPresets = deps.creationPresets.normalizeCreationPresetLibrary(backup.presets);
  deps.creationPresets.saveCustomCreationPresets();
  deps.projectState.state.customShapePresets = normalizeShapePresetLibrary(backup.shapePresets);
  deps.shapePresets.saveCustomShapePresets();
  deps.presetLibraryApi.populateShapePresetSelects();
  deps.presetLibraryApi.populateDrawBrushPresetSelect(deps.hairState.drawStrandMode);
  deps.presetLibraryApi.populateCreationPresetSelect(
    deps.braidToolPresetInput,
    "braid",
    deps.braidCreationDefaults.braidMeshPreset === "chain-links" ? "chain-links" : "classic"
  );
  deps.ui.preferencesOpenSnapshot = {
    radialMenusEnabled: deps.ui.radialMenusEnabled,
    proceduralDrawExperimentalEnabled: deps.draw.proceduralDrawExperimentalEnabled,
    navigationTipsEnabled: deps.viewportState.navigationTipsEnabled,
    navigationStyle: deps.viewportState.navigationStyle,
    cameraSmoothingEnabled: deps.viewportState.cameraSmoothingEnabled,
    cameraSmoothingStrength: deps.viewportState.cameraSmoothingStrength,
    toolTipsEnabled: deps.miscState.toolTipsEnabled,
    compactToolButtonsEnabled: deps.miscState.compactToolButtonsEnabled,
    viewportStatisticsEnabled: deps.viewportState.viewportStatisticsEnabled,
    twistCurveAllStrandsPreviewEnabled: deps.hairState.twistCurveAllStrandsPreviewEnabled,
    layerColorShiftsEnabled: deps.sel.layerColorShiftsEnabled,
    outlinerFolderColorsEnabled: deps.sel.outlinerFolderColorsEnabled,
    sideNamingPerspective: deps.miscState.sideNamingPerspective,
    controlPointDisplaySize: deps.guideState.controlPointDisplaySize,
    viewportBackgroundColor: deps.viewportState.viewportBackgroundColor,
    defaultHairShader: deps.hairState.defaultHairShader
  };
  deps.preferencesBackupStatus.textContent = "Preferences and presets loaded.";
}

async function handlePreferencesAndPresetsFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  deps.preferencesBackupStatus.textContent = "Loading preferences and presets...";
  try {
    await loadPreferencesAndPresets(file);
  } catch (error) {
    console.error("Could not load preferences and presets", error);
    deps.preferencesBackupStatus.textContent = error?.message || "Could not load preferences and presets.";
  } finally {
    deps.preferencesAndPresetsFile.value = "";
  }
}

async function openHairProjectFile(file, { handle = null } = {}) {
  try {
    const content = await file.text();
    const project = validateHairProject(JSON.parse(content));
    if (project.headAssetOmitted === true) {
      deps.referenceHeadApi.disposeGuideModel(deps.guideState.guideModel);
      deps.guideState.guideModel = null;
      deps.head.state.importedHeadAsset = null;
      document.querySelector("#importHeadMesh").title = "Import head mesh from an OBJ file";
      document.querySelector("#importFullBodyMesh").title = "Import a full body OBJ, scale it to seven head heights, and align its top to the scalp guide";
    } else if (project.headAsset?.format === "obj" && typeof project.headAsset.content === "string") {
      const model = new OBJLoader().parse(polygonOnlyObjSource(project.headAsset.content));
      const fullBody = project.headAsset.fit === "full-body";
      deps.referenceHeadApi.installGuideModel(model, { normalize: true, fullBody });
      deps.head.state.importedHeadAsset = { ...project.headAsset };
      document.querySelector("#importHeadMesh").title = fullBody
        ? "Import head mesh from an OBJ file"
        : `Using ${project.headAsset.name || "custom head"}. Import another head mesh`;
      document.querySelector("#importFullBodyMesh").title = fullBody
        ? `Using ${project.headAsset.name || "custom full body"}. Import another full body mesh`
        : "Import a full body OBJ, scale it to seven head heights, and align its top to the scalp guide";
    } else if (Object.prototype.hasOwnProperty.call(project, "headAsset")) {
      await deps.referenceHeadApi.loadDefaultGuideModel();
      document.querySelector("#importHeadMesh").title = "Import head mesh from an OBJ file";
      document.querySelector("#importFullBodyMesh").title = "Import a full body OBJ, scale it to seven head heights, and align its top to the scalp guide";
    }
    if (project.scalpGuideAsset?.format === "obj" && typeof project.scalpGuideAsset.content === "string") {
      const scalpModel = new OBJLoader().parse(project.scalpGuideAsset.content);
      deps.scalpBuilder.installCustomScalpGuide(scalpModel, {
        name: project.scalpGuideAsset.name || "custom-scalp.obj",
        content: project.scalpGuideAsset.content,
        preserveCoordinates: Boolean(project.scalpGuideAsset.preserveCoordinates),
        quadWirePositions: project.scalpGuideAsset.quadWirePositions
      });
    } else if (Object.prototype.hasOwnProperty.call(project, "scalpGuideAsset")) {
      deps.scalpState.state.importedScalpGuideAsset = null;
      deps.scalpBuilder.setScalpGuideSource("default");
    }
    deps.restoreState(project.state);
    deps.scalpBuilder.realignFullBodyGuideToScalpTop();
    if (deps.guideState.guideModel?.userData?.fullBodyReference) {
      deps.frameViewportBounds(deps.scalpBuilder.fullBodyScalpFocusBounds());
    }
    if (project.metadata?.name) deps.projectState.state.currentProjectName = project.metadata.name;
    deps.projectState.state.quickSaveFileHandle = handle || null;
    deps.projectState.state.quickSaveFileName = cleanFileBaseName(file.name || `${project.metadata?.name || "Untitled Hair Project"}.ahs`, "Untitled Hair Project");
    deps.presetLibraryStatus.textContent = `${project.metadata?.name || "Project"} opened`;
    deps.undoHistory.clear(); deps.redoHistory.clear(); deps.updateHistoryButtons(); // loading is a fresh undo base, not an undoable step
    deps.presetLibraryApi.setPresetLibraryOpen(false);
    await safelyRememberRecentProject(file.name || `${project.metadata?.name || "Untitled Hair Project"}.ahs`, content);
  } catch (error) {
    console.error(error);
    deps.presetLibraryStatus.textContent = "Could not open project file";
  } finally {
    deps.hairProjectFileInput.value = "";
  }
}

function dragContainsApplicationFile(event) {
  return [...(event.dataTransfer?.items || [])]
    .filter((item) => item.kind === "file")
    .some((item) => (
      applicationDropFileKind(item.getAsFile?.())
      || !deps.SUPPORTED_REFERENCE_IMAGE_TYPES.has(String(item.type || "").toLowerCase())
    ));
}

async function safelyRememberRecentProject(name, content) {
  try {
    await rememberRecentProject({ name, content });
    if (!deps.recentProjectsSubmenu.classList.contains("hidden")) await renderRecentProjectsMenu();
  } catch (error) {
    console.warn("Could not update recent projects", error);
  }
}

async function renderRecentProjectsMenu() {
  deps.recentProjectsSubmenu.replaceChildren();
  let entries = [];
  try {
    entries = await listRecentProjects();
  } catch (error) {
    console.warn("Could not read recent projects", error);
  }
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "app-menu-empty";
    empty.textContent = "No recent projects";
    deps.recentProjectsSubmenu.append(empty);
    return;
  }
  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.textContent = entry.name;
    button.title = entry.name;
    button.addEventListener("click", () => {
      deps.closeAppMenus();
      openDroppedApplicationFilePrompt({
        name: entry.name,
        text: async () => entry.content
      });
    });
    deps.recentProjectsSubmenu.append(button);
  });
}

function openDroppedApplicationFilePrompt(file, { handle = null } = {}) {
  const kind = applicationDropFileKind(file);
  if (!kind) return false;
  deps.projectState.state.pendingDroppedApplicationFile = file;
  deps.miscState.pendingDroppedApplicationKind = kind;
  deps.miscState.pendingDroppedApplicationHandle = handle || null;
  deps.dropImportFileName.textContent = file.name;
  const isProject = kind === "project";
  deps.dropImportDialogTitle.textContent = isProject ? "Open Dropped Project?" : "Import Dropped OBJ?";
  deps.dropImportDescription.textContent = isProject
    ? "Opening this project will replace the current scene."
    : "Choose how the dropped OBJ should be used.";
  deps.dropImportWarning.textContent = isProject
    ? "You will lose any unsaved progress in the current project."
    : "Importing a head or full body mesh replaces the current character mesh. You will lose any unsaved mesh setup.";
  deps.dropObjTargetChoices.classList.toggle("hidden", isProject);
  deps.confirmDropImport.textContent = isProject ? "Open Project" : "Import OBJ";
  if (!isProject) {
    const headTarget = deps.dropImportForm.querySelector('input[name="dropObjTarget"][value="head"]');
    headTarget.checked = true;
  }
  if (!deps.dropImportDialog.open) deps.dropImportDialog.showModal();
  return true;
}

function closeDroppedApplicationFilePrompt() {
  if (deps.dropImportDialog.open) deps.dropImportDialog.close();
}

async function confirmDroppedApplicationFile() {
  const file = deps.projectState.state.pendingDroppedApplicationFile;
  const kind = deps.miscState.pendingDroppedApplicationKind;
  if (!file || !kind) return;
  const objTarget = kind === "obj"
    ? deps.dropImportForm.querySelector('input[name="dropObjTarget"]:checked')?.value
    : null;
  closeDroppedApplicationFilePrompt();
  if (kind === "project") {
    await openHairProjectFile(file, { handle: deps.miscState.pendingDroppedApplicationHandle });
    return;
  }
  if (objTarget === "body") await deps.referenceHeadApi.importFullBodyMeshFile(file);
  else if (objTarget === "head") await deps.referenceHeadApi.importHeadMeshFile(file);
}

  return {
    rootAttachmentFrame,
    rootAttachmentLocalFrame,
    resolveRootAttachment,
    curvePointsToRootLocal,
    curvePointsFromRootLocal,
    syncRootAttachmentLocalCurves,
    applyRootAttachmentLocalCurves,
    createRootAttachment,
    syncRootAttachmentMetadata,
    rootAttachmentToData,
    rootAttachmentFromData,
    downloadPreferencesAndPresets,
    importedBooleanPreference,
    loadPreferencesAndPresets,
    handlePreferencesAndPresetsFile,
    openHairProjectFile,
    dragContainsApplicationFile,
    safelyRememberRecentProject,
    renderRecentProjectsMenu,
    openDroppedApplicationFilePrompt,
    closeDroppedApplicationFilePrompt,
    confirmDroppedApplicationFile
  };
}
