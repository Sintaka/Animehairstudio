// creation-presets.js — creation-preset snapshot/normalize/apply logic (refactor 3d-1).
// Extracted from app.js; all app.js coupling injected via createCreationPresetsApi(deps).
import * as THREE from "three";
import { cloneShapePresetValue } from "./shape-presets.js";

export function createCreationPresetsApi(deps) {
  // deps: { normalizeHairLayer, normalizeClumpBrushTemplate,
  //   normalizeToolPresetLibrary, emptyToolPresetLibrary, activeStrokeSurfaceValue,
  //   drawSurfaceDynamicEnabled, createClumpBrushTemplate, normalizeBraidDimensions,
  //   getSelectedLock, syncCreationShapeInputs, updatePlacementStatus, applyCreationToolSettings,
  //   braidCreationDefaults, strandCreationDefaults, DEFAULT_BRAID_MESH_PRESET,
  //   CREATION_PRESET_STORAGE_KEY, LEGACY_CLUMP_PRESET_STORAGE_KEY,
  //   projectState (store), drawState, hairState, selState, guideState }
  const DOM = {
    braidToolSizeInput: document.querySelector("#braidToolSize"),
    braidSmoothingInput: document.querySelector("#braidSmoothing"),
    braidCurveStepInput: document.querySelector("#braidCurveStep"),
    braidScalpOffsetInput: document.querySelector("#braidScalpOffset"),
    braidAutoShowScalpInput: document.querySelector("#braidAutoShowScalp"),
    braidContinueFromTipInput: document.querySelector("#braidContinueFromTip"),
    drawBrushPresetInput: document.querySelector("#drawBrushPreset"),
    drawToolSizeInput: document.querySelector("#drawToolSize"),
    drawStrandSmoothingInput: document.querySelector("#drawStrandSmoothing"),
    drawStrandCurveStepInput: document.querySelector("#drawStrandCurveStep"),
    drawStrandScalpOffsetInput: document.querySelector("#drawStrandScalpOffset"),
    drawSurfaceNormalInfluenceInput: document.querySelector("#drawSurfaceNormalInfluence"),
    drawStrandSurfaceInput: document.querySelector("#drawStrandSurface"),
    drawSurfaceDynamicButton: document.querySelector("#drawSurfaceDynamic"),
    drawAutoShowScalpInput: document.querySelector("#drawAutoShowScalp"),
    drawContinueFromTipInput: document.querySelector("#drawContinueFromTip")
  };

  function presetNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clonePresetShape(value, fallback) {
    const fallbackPoint = fallback?.[0];
    const coordinateKeys = fallbackPoint && "position" in fallbackPoint ? ["position", "value"] : ["x", "z"];
    const usable = Array.isArray(value)
      && value.length >= 2
      && value.every((point) => point && coordinateKeys.every((key) => Number.isFinite(Number(point[key]))));
    return cloneShapePresetValue(usable ? value : fallback);
  }

  function creationPresetSnapshot(source, type) {
    const fallback = type === "braid" ? deps.braidCreationDefaults : deps.strandCreationDefaults;
    const snapshot = {
      width: presetNumber(source.width, fallback.width),
      depth: presetNumber(source.depth, fallback.depth),
      widthScale: presetNumber(source.widthScale, 1),
      depthScale: presetNumber(source.depthScale, 1),
      profileTrimLeft: presetNumber(source.profileTrimLeft, 0),
      profileTrimRight: presetNumber(source.profileTrimRight, 0),
      profileTrimRoundness: presetNumber(source.profileTrimRoundness, 1),
      hairCard: Boolean(source.hairCard),
      strandSplitEnabled: Boolean(source.strandSplitEnabled),
      strandSplitPosition: presetNumber(source.strandSplitPosition, 0),
      strandSplitHeight: presetNumber(source.strandSplitHeight, 0.3),
      strandSplitGap: presetNumber(source.strandSplitGap, 0.12),
      profileOffset: presetNumber(source.profileOffset, 0),
      rootScalpOffset: presetNumber(source.rootScalpOffset, 0),
      strandRotation: presetNumber(source.strandRotation, 0),
      twist: presetNumber(source.twist, 0),
      twistCurve: clonePresetShape(source.twistCurve, fallback.twistCurve),
      hairLayer: deps.normalizeHairLayer(source.hairLayer),
      dynamicDensity: Boolean(source.dynamicDensity),
      densityAggression: presetNumber(source.densityAggression, 0.5),
      twistDensity: presetNumber(source.twistDensity, 0),
      taperCurve: clonePresetShape(source.taperCurve, fallback.taperCurve),
      depthCurve: clonePresetShape(source.depthCurve, fallback.depthCurve),
      taperCurveSecondary: clonePresetShape(source.taperCurveSecondary || source.taperCurve, fallback.taperCurveSecondary),
      depthCurveSecondary: clonePresetShape(source.depthCurveSecondary || source.depthCurve, fallback.depthCurveSecondary),
      asymmetricWidthCurve: Boolean(source.asymmetricWidthCurve),
      asymmetricDepthCurve: Boolean(source.asymmetricDepthCurve),
      centerAsymmetricProfile: Boolean(source.centerAsymmetricProfile),
      sweepProfile: clonePresetShape(source.sweepProfile, fallback.sweepProfile)
    };
    if (type === "strand") {
      snapshot.curlCount = presetNumber(source.curlCount, 4);
      snapshot.curlDisplacement = presetNumber(source.curlDisplacement, 0.18);
      const clumpTemplate = deps.normalizeClumpBrushTemplate(source.clumpTemplate);
      if (clumpTemplate) snapshot.clumpTemplate = clumpTemplate;
    } else {
      snapshot.braidMeshPreset = source.braidMeshPreset || deps.DEFAULT_BRAID_MESH_PRESET;
      snapshot.braidWidth = presetNumber(source.braidWidth, 0.34);
      snapshot.braidDepth = presetNumber(source.braidDepth, 0.44);
      snapshot.braidSegmentLength = presetNumber(source.braidSegmentLength, 0.28);
      snapshot.braidRotation = presetNumber(source.braidRotation, 0);
    }
    return snapshot;
  }

  function creationToolSettingsSnapshot(type) {
    if (type === "braid") {
      return {
        toolSize: Number(DOM.braidToolSizeInput.value),
        smoothing: Number(DOM.braidSmoothingInput.value),
        curveStep: Number(DOM.braidCurveStepInput.value),
        scalpOffset: Number(DOM.braidScalpOffsetInput.value),
        surface: deps.activeStrokeSurfaceValue(),
        dynamicSurface: deps.drawSurfaceDynamicEnabled(),
        autoShowScalp: DOM.braidAutoShowScalpInput.checked,
        continueFromTip: DOM.braidContinueFromTipInput.checked
      };
    }
    return {
      brushPreset: DOM.drawBrushPresetInput.value.startsWith("custom:") ? deps.hairState.drawStrandMode : DOM.drawBrushPresetInput.value,
      toolSize: Number(DOM.drawToolSizeInput.value),
      smoothing: Number(DOM.drawStrandSmoothingInput.value),
      curveStep: Number(DOM.drawStrandCurveStepInput.value),
      scalpOffset: Number(DOM.drawStrandScalpOffsetInput.value),
      surfaceNormalInfluence: Number(DOM.drawSurfaceNormalInfluenceInput.value),
      surface: deps.activeStrokeSurfaceValue(),
      dynamicSurface: deps.drawSurfaceDynamicEnabled(),
      autoShowScalp: DOM.drawAutoShowScalpInput.checked,
      continueFromTip: DOM.drawContinueFromTipInput.checked
    };
  }

  function normalizeCreationPresetLibrary(value) {
    return deps.normalizeToolPresetLibrary(value, (presetValue, type) => {
      const fallback = type === "braid" ? deps.braidCreationDefaults : deps.strandCreationDefaults;
      return creationPresetSnapshot({ ...fallback, ...presetValue }, type);
    });
  }

  function loadCustomCreationPresets() {
    try {
      const saved = JSON.parse(localStorage.getItem(deps.CREATION_PRESET_STORAGE_KEY) || "null");
      deps.projectState.state.customCreationPresets = normalizeCreationPresetLibrary(saved);
    } catch (error) {
      console.warn("Could not load creation presets", error);
      deps.projectState.state.customCreationPresets = deps.emptyToolPresetLibrary();
    }
  }

  function saveCustomCreationPresets() {
    try {
      localStorage.setItem(deps.CREATION_PRESET_STORAGE_KEY, JSON.stringify(deps.projectState.state.customCreationPresets));
    } catch (error) {
      console.warn("Could not save creation presets", error);
    }
  }

  function migrateLegacyClumpPresets() {
    try {
      const legacyRecords = JSON.parse(localStorage.getItem(deps.LEGACY_CLUMP_PRESET_STORAGE_KEY) || "null");
      if (!Array.isArray(legacyRecords) || !legacyRecords.length) return;
      const existingIds = new Set(deps.projectState.state.customCreationPresets.strand.map((preset) => preset.id));
      let migrated = false;
      legacyRecords.forEach((record) => {
        const locks = Array.isArray(record?.value?.locks) ? record.value.locks : [];
        const guide = locks.find((lock) => lock?.clumpGuide);
        const clumpTemplate = deps.createClumpBrushTemplate(locks, guide.id);
        const legacyId = typeof record?.id === "string" ? record.id : "";
        const name = typeof record?.title === "string" ? record.title.trim().slice(0, 60) : "";
        const id = `legacy-clump-${legacyId}`;
        if (!guide || !clumpTemplate || !legacyId || !name || existingIds.has(id)) return;
        deps.projectState.state.customCreationPresets.strand.push({
          id,
          name,
          value: {
            ...creationPresetSnapshot(guide, "strand"),
            clumpTemplate
          },
          toolSettings: {
            ...creationToolSettingsSnapshot("strand"),
            brushPreset: "clump"
          }
        });
        existingIds.add(id);
        migrated = true;
      });
      if (migrated) saveCustomCreationPresets();
      localStorage.removeItem(deps.LEGACY_CLUMP_PRESET_STORAGE_KEY);
    } catch (error) {
      console.warn("Could not migrate legacy clump presets", error);
    }
  }

  function applyCreationPresetSnapshot(target, snapshot, type) {
    const keys = [
      "width", "depth", "widthScale", "depthScale", "profileTrimLeft", "profileTrimRight", "profileTrimRoundness", "hairCard",
      "strandSplitEnabled", "strandSplitPosition", "strandSplitHeight", "strandSplitGap", "profileOffset", "rootScalpOffset", "strandRotation", "twist",
      "hairLayer", "dynamicDensity", "densityAggression", "twistDensity", "curlCount", "curlDisplacement",
      "braidMeshPreset", "braidWidth", "braidDepth", "braidSegmentLength", "braidRotation",
      "asymmetricWidthCurve", "asymmetricDepthCurve", "centerAsymmetricProfile"
    ];
    keys.forEach((key) => {
      if (snapshot[key] !== undefined) target[key] = snapshot[key];
    });
    ["taperCurve", "depthCurve", "taperCurveSecondary", "depthCurveSecondary", "twistCurve", "sweepProfile"].forEach((key) => {
      if (snapshot[key]) target[key] = cloneShapePresetValue(snapshot[key]);
    });
    if (type === "braid") deps.normalizeBraidDimensions(target);
  }

  function applyCustomCreationPreset(type, value) {
    const id = value.replace(/^custom:/, "");
    const preset = deps.projectState.state.customCreationPresets[type].find((item) => item.id === id);
    if (!preset) return;
    const target = type === "braid" ? deps.braidCreationDefaults : deps.strandCreationDefaults;
    if (type === "strand") deps.drawState.activeCustomDrawClumpTemplate = null;
    applyCreationPresetSnapshot(target, preset.value, type);
    deps.applyCreationToolSettings(type, preset.toolSettings, {
      preserveBrushPresetSelection: type === "strand"
    });
    if (type === "strand") {
      deps.drawState.activeCustomDrawClumpTemplate = deps.normalizeClumpBrushTemplate(preset.value.clumpTemplate);
      if (deps.drawState.activeCustomDrawClumpTemplate) deps.hairState.drawStrandMode = "clump";
    }
    if (!deps.getSelectedLock() && ((type === "braid" && deps.selState.activeTool === "braid") || (type === "strand" && deps.selState.activeTool === "draw"))) {
      deps.syncCreationShapeInputs();
    }
    deps.updatePlacementStatus();
  }

  return {
    presetNumber,
    clonePresetShape,
    creationPresetSnapshot,
    creationToolSettingsSnapshot,
    normalizeCreationPresetLibrary,
    loadCustomCreationPresets,
    saveCustomCreationPresets,
    migrateLegacyClumpPresets,
    applyCreationPresetSnapshot,
    applyCustomCreationPreset
  };
}
