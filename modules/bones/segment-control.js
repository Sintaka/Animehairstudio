// segment-control.js - Panel segment control glue (refactor bones B1).
// Extracted from app.js; coupling injected via createXxxApi(deps).
import * as THREE from "three";
import {
  splitBonesFor,
  materializeSplitBones,
  strandSplitBonesFor,
  materializeStrandSplitBones,
  remapSegmentBonesOnInsert,
  remapSegmentBonesOnDelete
} from "./bone-model.js?v=20260813-1";

// 新拉链需要的最小段跨度：段太窄就放不下一条不退化的拉链。
const MINIMUM_PANEL_SEGMENT_SPAN = 0.02;

// 把段骨骼数组对齐到给定段数（多余截断、缺失补 null 交由 normalize 派生默认值）。
// splits 被 maxCount 截断时，骨骼数组长度可能与段数不一致，重映射前先对齐。
function fitSegmentBones(bones, count) {
  const list = Array.isArray(bones) ? bones : [];
  return Array.from({ length: Math.max(1, Math.round(count)) }, (_, k) => list[k] ?? null);
}

// 相邻边界之间的段跨度：boundaries 有 N+2 项时得到 N+1 段。
function segmentSpans(boundaries) {
  return boundaries.slice(0, -1).map((value, index) => boundaries[index + 1] - value);
}

// 选中的 zipper 已不存在时清掉选择（order 是稳定身份）。悬空选择会让 Del 穿透到
// deleteCurrentSelection() 误删整根头发，因此增删拉链后必须校验。
function hasOrder(splits, order) {
  return Array.isArray(splits) && splits.some((split) => Number(split.order) === Number(order));
}

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
function dropDanglingPanelSplitSelection(target, splits) {
  const selection = deps.sculptState.panelSplitSelection;
  if (!selection || selection.lockId !== target?.id) return;
  if (!hasOrder(splits, selection.order)) deps.sculptState.panelSplitSelection = null;
}

function dropDanglingStrandSplitSelection(target, splits) {
  const selection = deps.sculptState.strandSplitSelection;
  if (!selection || selection.lockId !== target?.id) return;
  if (!hasOrder(splits, selection.order)) deps.sculptState.strandSplitSelection = null;
}

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
    output.textContent = ["panelLengthLoops", "panelWidthLoops", "panelTipLoops"].includes(key)
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
  // 段 = 排序后拉链之间的间隔（N 拉链 → N+1 段）；边界与 splitTipForSegment 的段划分一致。
  const boundaries = [-0.88, ...splits.map((split) => split.position), 0.88];
  const spans = segmentSpans(boundaries);
  // 骨骼重映射的输入：按当前段数对齐的有效骨骼（authored 优先，其次注册表，再默认）。
  const previousBones = fitSegmentBones(splitBonesFor(target), splits.length + 1);
  let insertIndex = -1;
  let deleteIndex = -1;
  if (delta > 0) {
    // 优先细分“当前选中的段”（+ 按钮所见即所得）；选中段放不下新拉链时回退到最大间隙段。
    const { index: selectedIndex, count: selectedCount } = selectedPanelSegment(target);
    let largestGapIndex = 0;
    for (let index = 1; index < spans.length; index += 1) {
      if (spans[index] > spans[largestGapIndex]) largestGapIndex = index;
    }
    const selectionUsable = selectedCount === spans.length
      && selectedIndex >= 0
      && selectedIndex < spans.length
      && spans[selectedIndex] >= MINIMUM_PANEL_SEGMENT_SPAN;
    insertIndex = selectionUsable ? selectedIndex : largestGapIndex;
    // 选中段与回退段都放不下最小跨度时放弃（与既有守卫同义：不产生退化段）。
    if (!(spans[insertIndex] >= MINIMUM_PANEL_SEGMENT_SPAN)) return;
  } else {
    // 删除 order 最大者（最近创建的），而非数组末尾（位置最右者）
    let maxIndex = 0;
    for (let index = 1; index < splits.length; index += 1) {
      if ((Number(splits[index].order) || 0) > (Number(splits[maxIndex].order) || 0)) maxIndex = index;
    }
    deleteIndex = maxIndex;
  }
  if (deps.isPanelGeometry(target)) deps.pushUndoState();
  if (delta > 0) {
    const position = (boundaries[insertIndex] + boundaries[insertIndex + 1]) * 0.5;
    // 分配创建序号：取当前最大 order + 1，保证单调递增、不复用
    const nextOrder = splits.length ? Math.max(...splits.map((s) => Number(s.order) || 0)) + 1 : 0;
    splits.push({ position, height: Number(target.panelSplitHeight ?? 0.28), order: nextOrder });
    splits.sort((a, b) => a.position - b.position);
    // 被细分的段一分为二：两半都继承来源段姿态，其后段整体后移（修正骨骼错位）。
    target.splitBones = remapSegmentBonesOnInsert(previousBones, insertIndex);
  } else {
    splits.splice(deleteIndex, 1);
    // 两段合并为一段：保留跨度更大的那段姿态（最接近合并后的几何），其后段整体前移。
    target.splitBones = remapSegmentBonesOnDelete(previousBones, deleteIndex, { spans });
  }
  target.panelSplits = splits;
  // 双写 lock.splitBones + lock.bones（kind="split"）；此时长度已与新段数一致，重映射不被覆盖。
  materializeSplitBones(target);
  // 选中的 zipper 可能刚被 - 删掉：清掉悬空选择，否则下次按 Del 会因 order 找不到而
  // 穿透到 deleteCurrentSelection() 直接删掉整根头发。
  dropDanglingPanelSplitSelection(target, splits);
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

// 删除当前被选中的 zipper（按 order 匹配），沿用与 changePanelSplitCount 相同的重建路径。
// 返回 true 表示确实删除并重建；false 表示无可删除项。
function deleteSelectedPanelSplit() {
  const selection = deps.sculptState.panelSplitSelection;
  if (!selection) return false;
  const target = deps.getSelectedLock();
  if (!deps.isPanelGeometry(target) || target.id !== selection.lockId) return false;
  const widthLoops = THREE.MathUtils.clamp(Math.round(Number(target.panelWidthLoops ?? 6)), 3, 24);
  const splits = deps.clonePanelSplits(target.panelSplits, target.panelSplitHeight, widthLoops - 1);
  const index = splits.findIndex((split) => Number(split.order) === Number(selection.order));
  if (index < 0) return false;
  deps.pushUndoState();
  // 与 changePanelSplitCount 的删除分支同构：先按段身份重映射骨骼，再改 splits。
  const boundaries = [-0.88, ...splits.map((split) => split.position), 0.88];
  const spans = segmentSpans(boundaries);
  const previousBones = fitSegmentBones(splitBonesFor(target), splits.length + 1);
  splits.splice(index, 1);
  // 两段合并为一段：保留跨度更大的那段姿态（最接近合并后的几何），其后段整体前移。
  target.splitBones = remapSegmentBonesOnDelete(previousBones, index, { spans });
  target.panelSplits = splits;
  materializeSplitBones(target);
  deps.sculptState.panelSplitSelection = null;
  deps.updateLockGeometry(target, { immediate: true });
  deps.rebuildCurveObjects(target);
  deps.syncActiveMirror(target, { refreshUi: true });
  deps.updateTopologyStats();
  syncPanelShapeInputs(target);
  return true;
}

// ── 普通发丝多拉链（strand）：mirror 面板的 +/- 与 Del 删除逻辑 ───────────────
// target = 选中的分裂发丝 lock，或 draw 工具激活时的 strandCreationDefaults。
function strandSplitTarget() {
  const selected = deps.getSelectedLock();
  if (selected?.geometryType === "strand" && selected.strandSplitEnabled) return selected;
  // draw 工具画普通发丝且默认开启分裂时，作用于创建默认值
  if (deps.sel.activeTool === "draw"
    && deps.strandCreationDefaults?.strandSplitEnabled
    && deps.sculptState.drawStrandStroke?.outputType !== "panel") {
    return deps.strandCreationDefaults;
  }
  return null;
}

function isStrandLock(target) {
  return target?.geometryType === "strand";
}

function changeStrandSplitCount(delta) {
  const target = strandSplitTarget();
  if (!target) return;
  const splits = deps.cloneStrandSplits(target.strandSplits, target.strandSplitPosition, target.strandSplitHeight, deps.STRAND_SPLIT_MAX);
  if (delta > 0 && splits.length >= deps.STRAND_SPLIT_MAX) return;
  // 分裂发丝至少保留 1 个拉链（>=2 管）；归零请用 Split Geometry 开关。
  if (delta < 0 && splits.length <= 1) return;
  // 相邻拉链最小间距，避免产生退化（过窄）的段。
  const minimumSeparation = 0.12;
  // 段 = 排序后拉链之间的间隔（N 拉链 → N+1 管）；与 createSplitStrandGeometry 的分段一致。
  const boundaries = [-0.8, ...splits.map((split) => split.position), 0.8];
  const spans = segmentSpans(boundaries);
  // 骨骼重映射的输入：按当前管数对齐的有效骨骼（authored 优先，其次派生默认）。
  const previousBones = fitSegmentBones(strandSplitBonesFor(target), splits.length + 1);
  let largestGapIndex = 0;
  for (let index = 1; index < spans.length; index += 1) {
    if (spans[index] > spans[largestGapIndex]) largestGapIndex = index;
  }
  // 间隙不足以容纳一个最小间距的新拉链时放弃（保持水密、不产生退化段）。
  if (delta > 0 && spans[largestGapIndex] < minimumSeparation * 2) return;
  let deleteIndex = 0;
  if (delta < 0) {
    // 删除 order 最大者（最近创建的），mirror 面板行为。
    for (let index = 1; index < splits.length; index += 1) {
      if ((Number(splits[index].order) || 0) > (Number(splits[deleteIndex].order) || 0)) deleteIndex = index;
    }
  }
  if (isStrandLock(target)) deps.pushUndoState();
  if (delta > 0) {
    // 在最大间隙插入，position 落在间隙中点；order 取当前最大 +1（单调、不复用）。
    const position = (boundaries[largestGapIndex] + boundaries[largestGapIndex + 1]) * 0.5;
    const nextOrder = splits.length ? Math.max(...splits.map((s) => Number(s.order) || 0)) + 1 : 0;
    splits.push({ position, height: Number(target.strandSplitHeight ?? 0.3), order: nextOrder });
    splits.sort((a, b) => a.position - b.position);
    // 被细分的管一分为二：两半都继承来源管姿态，其后管整体后移（修正骨骼错位）。
    target.strandSplitBones = remapSegmentBonesOnInsert(previousBones, largestGapIndex);
  } else {
    splits.splice(deleteIndex, 1);
    // 两管合并为一管：保留跨度更大的那管姿态（最接近合并后的几何），其后管整体前移。
    target.strandSplitBones = remapSegmentBonesOnDelete(previousBones, deleteIndex, { spans });
  }
  target.strandSplits = splits;
  deps.syncStrandSplitLegacyFields(target);
  // 双写持久字段：此时长度已与新管数一致，重映射不被覆盖。
  materializeStrandSplitBones(target);
  dropDanglingStrandSplitSelection(target, splits);
  if (deps.sculptState.drawStrandStroke?.outputType === "strand" && target === deps.strandCreationDefaults) {
    deps.sculptState.drawStrandStroke.strandSplits = splits.map((s) => ({ ...s }));
    deps.sculptState.drawStrandStroke.strandSplitPosition = target.strandSplitPosition;
    deps.sculptState.drawStrandStroke.strandSplitHeight = target.strandSplitHeight;
    deps.updateDrawStrandPreview();
  }
  if (isStrandLock(target)) {
    deps.updateLockGeometry(target, { immediate: true });
    deps.rebuildCurveObjects(target);
    deps.syncActiveMirror(target, { refreshUi: true });
    deps.updateTopologyStats();
  }
  deps.syncStrandSplitInputs(target);
}

// 删除当前被选中的 strand zipper（按 order 匹配），沿用与 changeStrandSplitCount 相同的重建路径。
// 分裂发丝至少保留 1 个拉链：删到只剩 1 时拒绝（返回 false）。
function deleteSelectedStrandSplit() {
  const selection = deps.sculptState.strandSplitSelection;
  if (!selection) return false;
  const target = deps.getSelectedLock();
  if (!isStrandLock(target) || !target.strandSplitEnabled || target.id !== selection.lockId) return false;
  const splits = deps.cloneStrandSplits(target.strandSplits, target.strandSplitPosition, target.strandSplitHeight, deps.STRAND_SPLIT_MAX);
  if (splits.length <= 1) return false;
  const index = splits.findIndex((split) => Number(split.order) === Number(selection.order));
  if (index < 0) return false;
  deps.pushUndoState();
  // 与 changeStrandSplitCount 的删除分支同构：先按段身份重映射骨骼，再改 splits。
  const boundaries = [-0.8, ...splits.map((split) => split.position), 0.8];
  const spans = segmentSpans(boundaries);
  const previousBones = fitSegmentBones(strandSplitBonesFor(target), splits.length + 1);
  splits.splice(index, 1);
  // 两管合并为一管：保留跨度更大的那管姿态（最接近合并后的几何），其后管整体前移。
  target.strandSplitBones = remapSegmentBonesOnDelete(previousBones, index, { spans });
  target.strandSplits = splits;
  deps.syncStrandSplitLegacyFields(target);
  materializeStrandSplitBones(target);
  deps.sculptState.strandSplitSelection = null;
  deps.updateLockGeometry(target, { immediate: true });
  deps.rebuildCurveObjects(target);
  deps.syncActiveMirror(target, { refreshUi: true });
  deps.updateTopologyStats();
  deps.syncStrandSplitInputs(target);
  return true;
}

  return {
    selectedPanelSegment,
    syncPanelSegmentControls,
    syncPanelShapeInputs,
    openPanelSegmentCurveEditor,
    changePanelSplitCount,
    deleteSelectedPanelSplit,
    changeStrandSplitCount,
    deleteSelectedStrandSplit,
  };
}
