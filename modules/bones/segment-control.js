// segment-control.js - Panel segment control glue (refactor bones B1).
// Extracted from app.js; coupling injected via createXxxApi(deps).
import * as THREE from "three";
import { splitBonesFor, materializeSplitBones } from "./bone-model.js?v=20260813-1";

// deps: store .state proxies (sculptState/sel) + module instances (taperEditor/shapePresets/
//   branchSweep) + DOM elements (panelSegmentLabel/previousPanelSegmentButton/nextPanelSegmentButton/
//   panelSegmentSpread/panelSegmentSpreadValue/panelShapeInputs/panelShapeValues/panelSplitCountValue/
//   addPanelSplitButton/removePanelSplitButton/segmentTaperPreview/segmentDepthPreview/
//   sweepProfileEditor/taperMeshPointsToggleRow/taperCurveEditor) + app.js helper functions
//   (getSelectedLock/isPanelGeometry/pushUndoState/updateDrawStrandPreview/updateLockGeometry/
//   rebuildCurveObjects/syncActiveMirror/updateTopologyStats/updateViewportStatsVisibility/
//   clonePanelSplits/snapPanelSplitHeight) + panelCreationDefaults. document is a browser global.
// Batch-fill point in app.js: after the taperEditorDeps batch (all deps defined).
export function createSegmentControlApi(deps) {
function selectedPanelSegment(lock) {
  const count = Math.max(1, (Array.isArray(lock?.panelSplits) ? lock.panelSplits.length : 0) + 1);
  const index = THREE.MathUtils.clamp(Math.round(Number(deps.sculptState.panelSegmentIndex || 0)), 0, count - 1);
  return { index, count };
}

function syncPanelSegmentControls(target = deps.taperEditor.activeStrandShapeTarget()) {
  // Refresh the width/depth curve preset selects (segment selects included) on every sync,
  // including when no panel target is selected (resets the selects).
  deps.syncShapePresetSelects();
  if (!target) return;
  const { index, count } = selectedPanelSegment(target);
  const bone = splitBonesFor(target)[index] || null;
  if (deps.panelSegmentLabel) deps.panelSegmentLabel.textContent = String(index + 1);
  if (deps.previousPanelSegmentButton) deps.previousPanelSegmentButton.disabled = index === 0;
  if (deps.nextPanelSegmentButton) deps.nextPanelSegmentButton.disabled = index >= count - 1;
  if (deps.panelSegmentSpread) deps.panelSegmentSpread.value = String(bone?.spread ?? 0);
  if (deps.panelSegmentSpreadValue) deps.panelSegmentSpreadValue.textContent = (bone?.spread ?? 0).toFixed(2);
  const previewTarget = {
    ...(bone || {}),
    taperCurve: bone?.taperCurve || target.taperCurve,
    depthCurve: bone?.depthCurve || target.depthCurve
  };
  deps.taperEditor.renderTaperPreview(deps.segmentTaperPreview, previewTarget, "taperCurve");
  deps.taperEditor.renderTaperPreview(deps.segmentDepthPreview, previewTarget, "depthCurve");
  // 浮动面板开着且正在编辑同一 lock 的子发尖曲线时，同步到当前段（热刷新）。
  deps.taperEditor.retargetOpenSegmentTaperEditor?.(target, index);
}

function syncPanelShapeInputs(target = deps.taperEditor.activeStrandShapeTarget()) {
  if (!target) return;
  const splits = deps.clonePanelSplits(target.panelSplits, target.panelSplitHeight);
  if (target.panelSplitSnapToLoops !== false) {
    splits.forEach((split) => { split.height = deps.snapPanelSplitHeight(split.height, target.panelLengthLoops); });
  }
  target.panelSplits = splits;
  target.panelWidthLoops = THREE.MathUtils.clamp(Math.max(
    Math.round(Number(target.panelWidthLoops ?? deps.panelCreationDefaults.panelWidthLoops)),
    splits.length + 1
  ), 3, 24);
  Object.entries(deps.panelShapeInputs).forEach(([key, input]) => {
    if (input.type === "checkbox") input.checked = target[key] !== false;
    else input.value = Number(target[key] ?? deps.panelCreationDefaults[key]);
  });
  Object.entries(deps.panelShapeValues).forEach(([key, output]) => {
    const value = Number(target[key] ?? deps.panelCreationDefaults[key]);
    output.textContent = ["panelLengthLoops", "panelWidthLoops"].includes(key)
      ? String(Math.round(value))
      : value.toFixed(2);
  });
  if (deps.panelSplitCountValue) deps.panelSplitCountValue.textContent = String(splits.length);
  if (deps.removePanelSplitButton) deps.removePanelSplitButton.disabled = splits.length === 0;
  if (deps.addPanelSplitButton) deps.addPanelSplitButton.disabled = splits.length >= Math.min(23, target.panelWidthLoops - 1);
  syncPanelSegmentControls(target);
}

function openPanelSegmentCurveEditor(curveKey = "taperCurve") {
  const selectedLock = deps.getSelectedLock();
  if (!selectedLock || !deps.isPanelGeometry(selectedLock)) return;
  const { index } = selectedPanelSegment(selectedLock);
  const bones = materializeSplitBones(selectedLock);
  const bone = bones[index];
  if (!bone) return;
  if (!Array.isArray(bone[curveKey]) || !bone[curveKey].length) {
    bone[curveKey] = deps.shapePresets.cloneShapePresetValue(selectedLock[curveKey]);
  }
  if (deps.sweepProfileEditor.open) deps.branchSweep.closeSweepProfileEditor();
  deps.sculptState.taperCurveEdit = {
    type: "segment",
    id: selectedLock.id,
    segmentIndex: index,
    curveKey,
    side: "primary",
    selectedIndex: 0,
    dragPointerId: null,
    dragDisplayRange: null
  };
  deps.taperEditor.ensureSecondaryTaperCurve(deps.taperEditor.activeTaperTarget(), curveKey);
  document.querySelector("#taperCurveTitle").textContent = curveKey === "depthCurve" ? "Depth Curve" : "Width Curve";
  deps.taperEditor.updateTaperCurveEditorTargetLabel();
  deps.taperEditor.setTaperMeshPointsVisible(false);
  deps.taperMeshPointsToggleRow.classList.add("hidden");
  deps.taperEditor.renderTaperCurveEditor();
  deps.taperEditor.renderTaperPreview(
    curveKey === "depthCurve" ? deps.segmentDepthPreview : deps.segmentTaperPreview,
    deps.taperEditor.activeTaperTarget(),
    curveKey
  );
  deps.taperCurveEditor.show();
  deps.updateViewportStatsVisibility();
}

function changePanelSplitCount(delta) {
  const selected = deps.getSelectedLock();
  const target = deps.isPanelGeometry(selected)
    ? deps.getSelectedLock()
    : deps.sel.activeTool === "panel" ? deps.panelCreationDefaults : null;
  if (!target) return;
  const widthLoops = THREE.MathUtils.clamp(Math.round(Number(target.panelWidthLoops ?? 6)), 3, 24);
  const splits = deps.clonePanelSplits(target.panelSplits, target.panelSplitHeight, widthLoops - 1);
  if (delta > 0 && splits.length >= widthLoops - 1) return;
  if (delta < 0 && !splits.length) return;
  if (deps.isPanelGeometry(target)) deps.pushUndoState();
  if (delta > 0) {
    const boundaries = [-0.88, ...splits.map((split) => split.position), 0.88];
    let largestGapIndex = 0;
    for (let index = 1; index < boundaries.length - 1; index += 1) {
      if (boundaries[index + 1] - boundaries[index] > boundaries[largestGapIndex + 1] - boundaries[largestGapIndex]) {
        largestGapIndex = index;
      }
    }
    const position = (boundaries[largestGapIndex] + boundaries[largestGapIndex + 1]) * 0.5;
    splits.push({ position, height: Number(target.panelSplitHeight ?? 0.28) });
    splits.sort((a, b) => a.position - b.position);
  } else {
    splits.pop();
  }
  target.panelSplits = splits;
  if (deps.sculptState.drawStrandStroke?.outputType === "panel" && target === deps.panelCreationDefaults) {
    deps.sculptState.drawStrandStroke.panelSplits = deps.clonePanelSplits(splits, target.panelSplitHeight, widthLoops - 1);
    deps.updateDrawStrandPreview();
  }
  if (deps.isPanelGeometry(target)) {
    deps.updateLockGeometry(target, { immediate: true });
    deps.rebuildCurveObjects(target);
    deps.syncActiveMirror(target, { refreshUi: true });
    deps.updateTopologyStats();
  }
  syncPanelShapeInputs(target);
}

  return {
    selectedPanelSegment,
    syncPanelSegmentControls,
    syncPanelShapeInputs,
    openPanelSegmentCurveEditor,
    changePanelSplitCount,
  };
}
