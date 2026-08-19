// shape-presets.js — shape-preset logic layer (refactor 3d-2).
// Extracted from app.js; coupling injected via createShapePresetsApi(deps).
export function cloneShapePresetValue(value) {
  return value.map((point) => ({ ...point }));
}

export function createShapePresetsApi(deps) {
  // deps: { sculptState, projectState, selState, normalizeShapePresetLibrary,
  //   emptyShapePresetLibrary, SHAPE_PRESET_STORAGE_KEY, pushUndoState,
  //   applyGroupDefaultsToExistingStrands, syncGroupInputs, syncCreationShapeInputs,
  //   editSelectedLocks, syncInputs, shapeTargetForSelect, syncShapePresetSelects,
  //   segmentCurveTargetForWrite, selectedSegmentIndex, syncSegmentControlsForLock,
  //   SHAPE_PRESETS, strandCreationDefaults, braidCreationDefaults, panelCreationDefaults }

  function taperAsymmetryKey(curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
    return curveKey === "depthCurve" ? "asymmetricDepthCurve" : "asymmetricWidthCurve";
  }

  function taperSecondaryKey(curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
    return curveKey === "depthCurve" ? "depthCurveSecondary" : "taperCurveSecondary";
  }

  function shapeValuesMatch(left, right) {
    if (!left || !right || left.length !== right.length) return false;
    return left.every((point, index) => Object.keys(point).every((key) => {
      const other = right[index]?.[key];
      return typeof point[key] === "number" ? Math.abs(point[key] - other) < 0.0001 : point[key] === other;
    }));
  }

  function shapePresetLabel(key) {
    if (key === "sweepProfile") return "Strand Profile";
    return key === "depthCurve" ? "Depth Curve" : "Width Curve";
  }

  function loadCustomShapePresets() {
    try {
      deps.projectState.state.customShapePresets = deps.normalizeShapePresetLibrary(
        JSON.parse(localStorage.getItem(deps.SHAPE_PRESET_STORAGE_KEY) || "null")
      );
    } catch (error) {
      console.warn("Could not load custom shape presets", error);
      deps.projectState.state.customShapePresets = deps.emptyShapePresetLibrary();
    }
  }

  function saveCustomShapePresets() {
    try {
      localStorage.setItem(deps.SHAPE_PRESET_STORAGE_KEY, JSON.stringify(deps.projectState.state.customShapePresets));
    } catch (error) {
      console.warn("Could not save custom shape presets", error);
    }
  }

  function applyShapePreset(select) {
    const key = select.dataset.shapePreset;
    const custom = select.value.startsWith("custom:");
    const preset = custom
      ? deps.projectState.state.customShapePresets[key].find((item) => item.id === select.value.replace(/^custom:/, ""))
      : deps.SHAPE_PRESETS[key].find((item) => item.id === select.value);
    if (select.closest("[data-segment-curve]")) {
      // Split segment target: write the preset into this segment's live segment bone
      // (segmentCurveTargetForWrite; panel split segment or split-strand tube, resolved by
      // geometry) and refresh geometry/preview immediately. Segments always route through
      // the asymmetric geometry path (asymmetricWidthCurve/asymmetricDepthCurve=true).
      const lock = deps.getSelectedLock();
      const bone = deps.segmentCurveTargetForWrite();
      if (!preset || !lock || !bone) return;
      deps.pushUndoState();
      bone[key] = cloneShapePresetValue(preset.value);
      bone[taperSecondaryKey(key)] = cloneShapePresetValue(preset.secondaryValue || preset.value);
      bone[taperAsymmetryKey(key)] = true;
      deps.updateLockGeometry(lock, { immediate: true, updateBranches: false });
      deps.syncActiveMirror(lock, { deferGeometry: false });
      // 段控件按几何分派（panel 段 / 发丝管段各有一组 DOM）。
      deps.syncSegmentControlsForLock(lock);
      if (
        deps.sculptState.taperCurveEdit?.type === "segment"
        && deps.sculptState.taperCurveEdit.id === lock.id
        && deps.sculptState.taperCurveEdit.segmentIndex === deps.selectedSegmentIndex(lock)
      ) deps.renderTaperCurveEditor();
      deps.syncShapePresetSelects();
      return;
    }
    const target = deps.shapeTargetForSelect(select);
    if (!preset || !target) return;
    deps.pushUndoState();
    target[key] = cloneShapePresetValue(preset.value);
    if (custom && key !== "sweepProfile") {
      target[taperSecondaryKey(key)] = cloneShapePresetValue(preset.secondaryValue || preset.value);
      target[taperAsymmetryKey(key)] = Boolean(preset.asymmetric);
    }
    if (select.closest("#groupSettingsPanel")) {
      deps.applyGroupDefaultsToExistingStrands(deps.selState.selectedStrandGroup);
      deps.syncGroupInputs();
    } else if (target === deps.strandCreationDefaults || target === deps.braidCreationDefaults || target === deps.panelCreationDefaults) {
      deps.syncCreationShapeInputs();
    } else {
      const primaryValue = cloneShapePresetValue(target[key]);
      const secondaryValue = key === "sweepProfile"
        ? null
        : cloneShapePresetValue(target[taperSecondaryKey(key)] || target[key]);
      const asymmetric = key === "sweepProfile" ? false : Boolean(target[taperAsymmetryKey(key)]);
      deps.editSelectedLocks((lock) => {
        lock[key] = cloneShapePresetValue(primaryValue);
        if (key !== "sweepProfile") {
          lock[taperSecondaryKey(key)] = cloneShapePresetValue(secondaryValue);
          lock[taperAsymmetryKey(key)] = asymmetric;
        }
      });
      deps.syncInputs(target);
    }
    deps.syncShapePresetSelects();
  }

  return {
    cloneShapePresetValue,
    taperAsymmetryKey,
    taperSecondaryKey,
    cloneShapePresetValue,
    shapeValuesMatch,
    shapePresetLabel,
    loadCustomShapePresets,
    saveCustomShapePresets,
    applyShapePreset
  };
}
