// taper-editor.js - Taper curve editor: 2D SVG taper/depth/twist/procedural curve editor +
// 3D mesh-point drag handles (refactor 3d batch G5). Extracted from app.js; coupling injected
// via createTaperEditorApi(deps).
import * as THREE from "three";
import {
  normalizeTaperCurve,
  sampleScale,
  sampleTaperCurve,
  twistCurveDisplayRange,
  twistRateUnitsFromDegrees
} from "./curve-math.js?v=20260811-1";
import { materializeSplitBones, splitBonesFor } from "../bones/bone-model.js?v=20260812-1";
import {
  DEFAULT_SWEEP_PROFILE,
  STRAND_GROUPS,
  TAPER_VALUE_MAX,
  TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
  TWIST_CURVE_VALUE_MAX
} from "../core/app-config.js?v=20260809-2";


export function createTaperEditorApi(deps) {
  // deps: store .state proxies (sculptState/sel/hairState/miscState) + cross-module apis
  //   (branchSweep/shapePresets) + shared objects (locks/strandGroupDefaults/camera/renderer/raycaster/
  //   taperMeshPointsGroup/taperMeshPointGeometry/taperMeshPointMaterial/taperMeshPointSelectedMaterial/
  //   taperMeshPointCenterMaterial/DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE) +
  //   DOM elements (taperCurveEditor/taperCurveTarget/taperCurveCanvas/taperCurvePath/taperCurveSecondaryPath/
  //   taperCurveBaseAxis/taperCurveValueAxis/taperCurveCenterLine/taperCurvePoints/taperCurveOptions/
  //   taperAsymmetryToggleRow/taperAsymmetryToggle/centerAsymmetricProfileRow/centerAsymmetricProfileToggle/
  //   taperMeshPointsToggleRow/taperMeshPointsToggle/taperPointValue/taperPointPosition/taperPointInterpolation/
  //   taperPreviewPaths/segmentTaperPreview/segmentDepthPreview/strandTwistCurvePreview/
  //   proceduralBranchLengthCurvePreview/proceduralBranchShapeCurvePreview/sweepProfileEditor/sweepProfileTarget/
  //   groupDefaultsWarning) + app.js helper functions; full list: devlog/in-progress/g5-taper-refactor-map.md
  //   section 5. Batch-fill point in app.js: after createShapePresetsApi (all deps defined).

function activeStrandShapeTarget() {
  return deps.getSelectedLock() || (deps.creationToolActive() ? deps.activeCreationShapeDefaults() : null);
}
function activeTaperTarget() {
  if (!deps.sculptState.taperCurveEdit) return null;
  if (deps.sculptState.taperCurveEdit.type === "segment") {
    // The editor target for a segment is its split sub-bone (live reference into
    // lock.splitBones); curve edits mutate the bone directly.
    const lock = deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id);
    if (!lock) return null;
    // 复用已 materialize 的 lock.splitBones（live 引用）：每次重新调用
    // materializeSplitBones 都会深克隆曲线数组，导致浮动面板拖动 segment 曲线点
    // 时写进临时数组、宽度不生效。length 不匹配（splits 变化）时才重新 materialize。
    const splitCount = (Array.isArray(lock.panelSplits) ? lock.panelSplits.length : 0) + 1;
    const bones = (Array.isArray(lock.splitBones) && lock.splitBones.length === splitCount)
      ? lock.splitBones
      : materializeSplitBones(lock);
    const bone = bones[deps.sculptState.taperCurveEdit.segmentIndex] || null;
    if (!bone) return null;
    const curveKey = deps.sculptState.taperCurveEdit.curveKey;
    if (!Array.isArray(bone[curveKey]) || !bone[curveKey].length) {
      bone[curveKey] = deps.shapePresets.cloneShapePresetValue(lock[curveKey]);
    }
    if (bone.centerAsymmetricProfile == null) bone.centerAsymmetricProfile = Boolean(lock.centerAsymmetricProfile);
    return bone;
  }
  if (deps.sculptState.taperCurveEdit.type === "group") return deps.strandGroupDefaults[deps.sculptState.taperCurveEdit.id] || null;
  if (deps.sculptState.taperCurveEdit.type === "creation") return deps.activeCreationShapeDefaults();
  return deps.locks.find((lock) => lock.id === deps.sculptState.taperCurveEdit.id) || null;
}
function activeTaperCurve() {
  const target = activeTaperTarget();
  if (!target || !deps.sculptState.taperCurveEdit) return null;
  if (deps.branchSweep.twistCurveEditing()) return target.twistCurve || null;
  if (deps.branchSweep.proceduralBranchCurveEditing()) return target[deps.sculptState.taperCurveEdit.curveKey] || null;
  const key = deps.sculptState.taperCurveEdit.side === "secondary"
    ? deps.shapePresets.taperSecondaryKey()
    : deps.sculptState.taperCurveEdit.curveKey;
  return target[key] || target[deps.sculptState.taperCurveEdit.curveKey] || null;
}
function ensureSecondaryTaperCurve(target, curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
  if (!target || !curveKey) return null;
  if (deps.branchSweep.twistCurveEditing(curveKey) || deps.branchSweep.proceduralBranchCurveEditing(curveKey)) return null;
  const secondaryKey = deps.shapePresets.taperSecondaryKey(curveKey);
  if (!target[secondaryKey]?.length) {
    target[secondaryKey] = deps.shapePresets.cloneShapePresetValue(target[curveKey]);
  }
  return target[secondaryKey];
}
function taperSamples(curve, count = 80) {
  return Array.from({ length: count + 1 }, (_, index) => {
    const position = index / count;
    return { position, value: sampleTaperCurve(curve, position) };
  });
}

// Segment editing: the bone's asymmetricWidthCurve/asymmetricDepthCurve flag stays true
// (geometry routing depends on it), but the FLOATING PANEL should show a dual asymmetric
// layout only when the two side curves actually differ (default viewport drags write both
// sides the same value = symmetric). Compare shared sampled points with a tight epsilon.
function taperCurvesActuallyDiffer(target, curveKey) {
  const primary = target?.[curveKey];
  const secondary = target?.[deps.shapePresets.taperSecondaryKey(curveKey)];
  if (!Array.isArray(primary) || !Array.isArray(secondary)) return false;
  const primarySamples = taperSamples(primary, 40);
  const secondarySamples = taperSamples(secondary, 40);
  for (let index = 0; index < primarySamples.length; index += 1) {
    if (Math.abs(primarySamples[index].value - secondarySamples[index].value) > 1e-4) return true;
  }
  return false;
}
// Display-asymmetric flag shared by renderTaperCurveEditor / canvasToTaperPoint /
// refreshTaperCurveEditorAfterStateRestore: segment edits follow whether the actual side
// curves differ; strand/group/creation edits keep the authored data flag.
function taperDisplayAsymmetric(target) {
  if (!deps.sculptState.taperCurveEdit) return false;
  if (deps.branchSweep.twistCurveEditing() || deps.branchSweep.proceduralBranchCurveEditing()) return false;
  if (deps.sculptState.taperCurveEdit.type === "segment") {
    return taperCurvesActuallyDiffer(target, deps.sculptState.taperCurveEdit.curveKey);
  }
  return Boolean(target?.[deps.shapePresets.taperAsymmetryKey()]);
}
function ensureAsymmetricTaperPreviewElements(path) {
  const svg = path?.ownerSVGElement;
  if (!svg) return {};
  let secondaryPath = svg.querySelector(".taper-preview-secondary");
  let centerLine = svg.querySelector(".taper-preview-center");
  if (!secondaryPath) {
    secondaryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    secondaryPath.setAttribute("class", "taper-preview-secondary hidden");
    svg.insertBefore(secondaryPath, path.nextSibling);
  }
  if (!centerLine) {
    centerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    centerLine.setAttribute("class", "taper-preview-center hidden");
    centerLine.setAttribute("x1", "9");
    centerLine.setAttribute("y1", "35");
    centerLine.setAttribute("x2", "151");
    centerLine.setAttribute("y2", "35");
    svg.insertBefore(centerLine, secondaryPath.nextSibling);
  }
  return { secondaryPath, centerLine };
}
function renderTaperPreview(path, target, curveKey) {
  const curve = target?.[curveKey];
  if (!path || !curve?.length) return;
  const asymmetric = !deps.branchSweep.proceduralBranchCurveEditing(curveKey)
    && Boolean(target[deps.shapePresets.taperAsymmetryKey(curveKey)]);
  const baseline = asymmetric ? 35 : 63;
  const verticalExtent = asymmetric ? 26 : 54;
  const secondaryCurve = asymmetric ? (target[deps.shapePresets.taperSecondaryKey(curveKey)] || curve) : null;
  const primarySamples = taperSamples(curve, 48);
  const secondarySamples = asymmetric ? taperSamples(secondaryCurve, 48) : [];
  const previewValueMax = asymmetric
    ? Math.max(0.0001, ...primarySamples.map((point) => point.value), ...secondarySamples.map((point) => point.value))
    : TAPER_VALUE_MAX;
  const sampled = primarySamples.map((point) => ({
    x: 9 + point.position * 142,
    y: baseline - (point.value / previewValueMax) * verticalExtent
  }));
  const line = sampled.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  path.setAttribute("d", `${line} L151,${baseline} L9,${baseline} Z`);
  const { secondaryPath, centerLine } = ensureAsymmetricTaperPreviewElements(path);
  secondaryPath?.classList.toggle("hidden", !asymmetric);
  centerLine?.classList.toggle("hidden", !asymmetric);
  if (!asymmetric) {
    secondaryPath?.removeAttribute("d");
    return;
  }
  const secondarySampled = secondarySamples.map((point) => ({
    x: 9 + point.position * 142,
    y: 35 + (point.value / previewValueMax) * 26
  }));
  const secondaryLine = secondarySampled
    .map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
  secondaryPath?.setAttribute("d", `${secondaryLine} L151,35 L9,35 Z`);
}
// Read-only view of the selected panel's current split segment bone, used by the
// shape-preset selects (syncShapePresetSelects / openSaveShapePreset). Never materializes:
// syncing/displaying the select must not write splitBones. Returns a shallow copy with
// per-field fallback to the lock-level curve so the select shows the segment's effective curve.
function segmentCurveTarget() {
  const lock = deps.getSelectedLock();
  if (!lock || !deps.isPanelGeometry(lock)) return null;
  const splitCount = (Array.isArray(lock.panelSplits) ? lock.panelSplits.length : 0) + 1;
  const index = THREE.MathUtils.clamp(
    Math.round(Number(deps.sculptState.panelSegmentIndex ?? 0)),
    0,
    splitCount - 1
  );
  const bone = splitBonesFor(lock)[index];
  if (!bone) return null;
  return {
    ...bone,
    taperCurve: bone.taperCurve || lock.taperCurve,
    taperCurveSecondary: bone.taperCurveSecondary || lock.taperCurveSecondary,
    depthCurve: bone.depthCurve || lock.depthCurve,
    depthCurveSecondary: bone.depthCurveSecondary || lock.depthCurveSecondary,
    asymmetricWidthCurve: bone.asymmetricWidthCurve == null ? Boolean(lock.asymmetricWidthCurve) : bone.asymmetricWidthCurve,
    asymmetricDepthCurve: bone.asymmetricDepthCurve == null ? Boolean(lock.asymmetricDepthCurve) : bone.asymmetricDepthCurve,
    centerAsymmetricProfile: bone.centerAsymmetricProfile == null ? Boolean(lock.centerAsymmetricProfile) : bone.centerAsymmetricProfile
  };
}
// Live split bone for the selected panel segment (used by applyShapePreset). Reuses the
// already-materialized lock.splitBones when the split count matches (same rule as
// activeTaperTarget so preset writes hit the live bone); materializes otherwise. The index
// is clamped the same way selectedPanelSegment / syncPanelSegmentControls clamp it.
function segmentCurveTargetForWrite() {
  const lock = deps.getSelectedLock();
  if (!lock || !deps.isPanelGeometry(lock)) return null;
  const splitCount = (Array.isArray(lock.panelSplits) ? lock.panelSplits.length : 0) + 1;
  const bones = (Array.isArray(lock.splitBones) && lock.splitBones.length === splitCount)
    ? lock.splitBones
    : materializeSplitBones(lock);
  if (!bones) return null;
  const index = THREE.MathUtils.clamp(
    Math.round(Number(deps.sculptState.panelSegmentIndex ?? 0)),
    0,
    splitCount - 1
  );
  return bones[index] || null;
}
function shapeTargetForSelect(select) {
  if (select.closest("#groupSettingsPanel")) return deps.sel.selectedStrandGroup ? deps.strandGroupDefaults[deps.sel.selectedStrandGroup] : null;
  if (select.closest("[data-segment-curve]")) return segmentCurveTarget();
  return activeStrandShapeTarget();
}
function taperPointToCanvas(point, curveSide = "primary", asymmetric = false) {
  const x = 30 + point.position * 460;
  if (deps.branchSweep.twistCurveEditing()) {
    const displayRange = deps.sculptState.taperCurveEdit?.dragDisplayRange || twistCurveDisplayRange(
      activeTaperCurve(),
      TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
      TWIST_CURVE_VALUE_MAX
    );
    return { x, y: 110 - (point.value / displayRange) * 80 };
  }
  if (!asymmetric) {
    return { x, y: 190 - (point.value / TAPER_VALUE_MAX) * 170 };
  }
  const direction = curveSide === "secondary" ? 1 : -1;
  return { x, y: 110 + direction * (point.value / TAPER_VALUE_MAX) * 80 };
}
function canvasToTaperPoint(event, pointIndex) {
  const rect = deps.taperCurveCanvas.getBoundingClientRect();
  const canvasX = (event.clientX - rect.left) * (520 / rect.width);
  const canvasY = (event.clientY - rect.top) * (220 / rect.height);
  const curve = activeTaperCurve();
  const editingTwist = deps.branchSweep.twistCurveEditing();
  const asymmetric = taperDisplayAsymmetric(activeTaperTarget());
  const isEndpoint = pointIndex === 0 || pointIndex === curve.length - 1;
  const twistDisplayRange = deps.sculptState.taperCurveEdit?.dragDisplayRange || twistCurveDisplayRange(
    curve,
    TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
    TWIST_CURVE_VALUE_MAX
  );
  const value = editingTwist
    ? (110 - canvasY) / 80 * twistDisplayRange
    : asymmetric
    ? (
        deps.sculptState.taperCurveEdit.side === "secondary"
          ? (canvasY - 110) / 80 * TAPER_VALUE_MAX
          : (110 - canvasY) / 80 * TAPER_VALUE_MAX
      )
    : (190 - canvasY) / 170 * TAPER_VALUE_MAX;
  const constrainedValue = deps.branchSweep.proceduralBranchShapeCurveEditing() && isEndpoint
    ? (pointIndex === 0 ? 0 : 1)
    : THREE.MathUtils.clamp(
        value,
        editingTwist ? -TWIST_CURVE_VALUE_MAX : 0,
        editingTwist ? TWIST_CURVE_VALUE_MAX : TAPER_VALUE_MAX
      );
  return {
    position: isEndpoint ? (pointIndex === 0 ? 0 : 1) : THREE.MathUtils.clamp((canvasX - 30) / 460, 0.01, 0.99),
    value: constrainedValue
  };
}
function clearTaperMeshPoints() {
  deps.taperMeshPointsGroup.children.forEach((child) => {
    if (child.userData.twistMeshCurvePath || child.userData.twistMeshCurveFill) {
      child.geometry?.dispose?.();
    }
  });
  deps.taperMeshPointsGroup.clear();
  deps.taperMeshPointsGroup.visible = false;
}
function taperMeshPointFrame(lock, curve, position, curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
  if (curveKey === "twistCurve") {
    return deps.transportedStrandFrameAt(lock, curve, position, {
      twistAt: (parameter) => deps.controlPointRotationAt(lock, parameter)
    });
  }
  if (lock.geometryType === "braid") return deps.braidFrameAt(lock, curve, position);
  return deps.strandGeometryFrameAt(lock, curve, position);
}
function taperMeshPointExtentPerValue(lock, position, side, axis) {
  const scale = sampleScale(lock.pointScales, position, axis);
  if (deps.isPanelGeometry(lock)) {
    const baseDimension = axis === "z"
      ? Number(lock.panelThickness ?? 0.08)
      : Number(lock.width ?? 0.62);
    return Math.max(0.0001, baseDimension * 0.5 * scale);
  }
  if (lock.geometryType === "braid") {
    const baseDimension = axis === "z"
      ? Number(lock.braidDepth ?? 0.44)
      : Number(lock.braidWidth ?? 0.34);
    const dimensionScale = axis === "z"
      ? Number(lock.depthScale ?? 1)
      : Number(lock.widthScale ?? 1);
    return Math.max(0.0001, baseDimension * dimensionScale * 0.5 * scale);
  }
  const profile = deps.branchSweep.trimmedSweepProfile(
    (lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE)
      .map((point) => ({ ...point, z: point.z + Number(lock.profileOffset || 0) })),
    lock
  );
  const profileExtent = side < 0
    ? Math.abs(Math.min(...profile.map((point) => point[axis]), -0.0001))
    : Math.max(...profile.map((point) => point[axis]), 0.0001);
  const baseDimension = axis === "z"
    ? Number(lock.depth ?? 0.16)
    : Number(lock.baseWidth ?? lock.width ?? 0.16);
  const dimensionScale = axis === "z"
    ? Number(lock.depthScale ?? 1)
    : Number(lock.widthScale ?? 1);
  return Math.max(
    0.0001,
    baseDimension * dimensionScale * scale * profileExtent
  );
}
function updateTaperMeshPoints() {
  clearTaperMeshPoints();
  const lock = deps.sculptState.taperCurveEdit?.type === "strand"
    ? deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id)
    : null;
  const target = activeTaperTarget();
  const curvePoints = activeTaperCurve();
  const applicable = Boolean(
    deps.hairState.taperMeshPointsVisible
    && ["taperCurve", "depthCurve", "twistCurve"].includes(deps.sculptState.taperCurveEdit?.curveKey)
    && lock
    && curvePoints?.length
  );
  if (!applicable) return;

  const curve = deps.strandGeometryCurve(lock);
  const editingTwist = deps.branchSweep.twistCurveEditing();
  const axis = editingTwist ? "twist" : deps.sculptState.taperCurveEdit.curveKey === "depthCurve" ? "z" : "x";
  const frameAxis = axis === "z" ? "z" : "x";
  const asymmetric = Boolean(
    axis === "z" ? target?.asymmetricDepthCurve : target?.asymmetricWidthCurve
  );
  const primaryCurve = editingTwist
    ? target.twistCurve
    : axis === "z" ? target.depthCurve : target.taperCurve;
  const twistDisplayRange = editingTwist
    ? deps.sculptState.taperMeshPointDrag?.displayRange || twistCurveDisplayRange(
        primaryCurve,
        TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
        TWIST_CURVE_VALUE_MAX
      )
    : null;
  const curveSides = editingTwist
    ? [{ curvePoints: primaryCurve, sides: [1], curveSide: "primary" }]
    : asymmetric
    ? [
        { curvePoints: primaryCurve, sides: [1], curveSide: "primary" },
        {
          curvePoints: ensureSecondaryTaperCurve(target, deps.sculptState.taperCurveEdit.curveKey),
          sides: [-1],
          curveSide: "secondary"
        }
      ]
    : [{ curvePoints: primaryCurve, sides: [-1, 1], curveSide: "primary" }];
  if (editingTwist) deps.branchSweep.addTwistMeshCurvePath(lock, curve, primaryCurve, twistDisplayRange);
  curveSides.forEach(({ curvePoints: sideCurvePoints, sides, curveSide }) => sideCurvePoints.forEach((point, pointIndex) => {
    const frame = taperMeshPointFrame(lock, curve, point.position, deps.sculptState.taperCurveEdit.curveKey);
    sides.forEach((side) => {
      const selected = curveSide === deps.sculptState.taperCurveEdit.side && pointIndex === deps.sculptState.taperCurveEdit.selectedIndex;
      const handle = new THREE.Mesh(
        deps.taperMeshPointGeometry,
        selected ? deps.taperMeshPointSelectedMaterial : deps.taperMeshPointMaterial
      );
      const extent = editingTwist
        ? deps.branchSweep.twistMeshPointDistancePerDegree(lock, point.position, twistDisplayRange) * point.value
        : taperMeshPointExtentPerValue(lock, point.position, side, axis) * point.value;
      handle.position.copy(frame.point).addScaledVector(
        editingTwist ? deps.branchSweep.twistMeshGraphAxis(frame) : frame[frameAxis],
        editingTwist ? extent : side * extent
      );
      handle.renderOrder = 35;
      handle.userData.taperMeshPoint = true;
      handle.userData.lockId = lock.id;
      handle.userData.pointIndex = pointIndex;
      handle.userData.side = side;
      handle.userData.curveSide = curveSide;
      if (selected) {
        const center = new THREE.Mesh(deps.taperMeshPointGeometry, deps.taperMeshPointCenterMaterial);
        center.scale.setScalar(0.46);
        center.renderOrder = 36;
        center.raycast = () => {};
        handle.add(center);
      }
      deps.taperMeshPointsGroup.add(handle);
    });
  }));
  deps.taperMeshPointsGroup.visible = true;
}
function setTaperMeshPointsVisible(visible) {
  deps.hairState.taperMeshPointsVisible = Boolean(
    visible
    && deps.sculptState.taperCurveEdit?.type === "strand"
    && ["taperCurve", "depthCurve", "twistCurve"].includes(deps.sculptState.taperCurveEdit?.curveKey)
  );
  if (deps.hairState.taperMeshPointsVisible && ["draw", "procedural-draw", "braid", "panel"].includes(deps.sel.activeTool)) {
    deps.setActiveTool("select");
  }
  deps.taperMeshPointsToggle.checked = deps.hairState.taperMeshPointsVisible;
  updateTaperMeshPoints();
  const lock = deps.sculptState.taperCurveEdit?.type === "strand"
    ? deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id)
    : null;
  if (lock) deps.updateCurveObjects(lock, { visible: true });
  if (deps.hairState.taperMeshPointsVisible && deps.branchSweep.twistCurveEditing()) deps.setHoveredStrandWidthEdge(null);
}
function renderTaperCurveEditor() {
  const curve = activeTaperCurve();
  if (!curve?.length) return;
  const target = activeTaperTarget();
  const editingTwist = deps.branchSweep.twistCurveEditing();
  const editingProceduralBranch = deps.branchSweep.proceduralBranchCurveEditing();
  const segmentEditing = deps.sculptState.taperCurveEdit.type === "segment";
  // Segment edits keep the geometric routing flag (asymmetricWidthCurve/asymmetricDepthCurve)
  // true at all times, so the panel's display mode follows whether the two side curves
  // actually differ (default viewport drags write both sides the same value = symmetric).
  const displayAsymmetric = taperDisplayAsymmetric(target);
  if (deps.sculptState.taperCurveEdit) deps.sculptState.taperCurveEdit.displayAsymmetric = displayAsymmetric;
  deps.taperCurveOptions.classList.toggle("hidden", editingProceduralBranch);
  // 发尖子骨骼（segment）宽度曲线的隐藏/记录点：t < 公共 fork（最深 zipper）的点
  // 只用于保持两侧控制参数一致，不应在浮动面板里被拖动。
  const segmentLock = segmentEditing ? deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id) : null;
  const segmentSplits = segmentLock ? deps.clonePanelSplits(segmentLock.panelSplits, segmentLock.panelSplitHeight) : null;
  const tipSideForkFor = () => {
    if (!segmentLock || !segmentSplits || !segmentSplits.length) return 0;
    return deps.tipWidthCommonForkT(
      segmentLock,
      deps.sculptState.taperCurveEdit.segmentIndex,
      segmentSplits
    );
  };
  deps.taperAsymmetryToggleRow.classList.toggle("hidden", editingTwist || editingProceduralBranch || segmentEditing);
  deps.taperAsymmetryToggle.checked = displayAsymmetric;
  deps.centerAsymmetricProfileRow.classList.toggle("hidden", !displayAsymmetric || segmentEditing);
  deps.centerAsymmetricProfileToggle.checked = Boolean(target?.centerAsymmetricProfile);
  const ctrlHint = document.querySelector("#taperCurveCtrlHint");
  if (ctrlHint) ctrlHint.classList.toggle("hidden", !segmentEditing);
  deps.taperCurveBaseAxis.classList.toggle("hidden", displayAsymmetric || editingTwist);
  deps.taperCurveCenterLine.classList.toggle("hidden", !displayAsymmetric && !editingTwist);
  deps.taperCurveSecondaryPath.classList.toggle("hidden", !displayAsymmetric);
  deps.taperCurveValueAxis.setAttribute("y1", displayAsymmetric || editingTwist ? "30" : "20");
  const primaryCurve = target[deps.sculptState.taperCurveEdit.curveKey];
  const primarySampled = taperSamples(primaryCurve, 120)
    .map((point) => taperPointToCanvas(point, "primary", displayAsymmetric));
  const primaryLine = primarySampled
    .map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
  const baseline = displayAsymmetric || editingTwist ? 110 : 190;
  deps.taperCurvePath.setAttribute("d", `${primaryLine} L490,${baseline} L30,${baseline} Z`);
  if (displayAsymmetric) {
    const secondaryCurve = ensureSecondaryTaperCurve(target);
    const secondarySampled = taperSamples(secondaryCurve, 120)
      .map((point) => taperPointToCanvas(point, "secondary", true));
    const secondaryLine = secondarySampled
      .map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(" ");
    deps.taperCurveSecondaryPath.setAttribute("d", `${secondaryLine} L490,110 L30,110 Z`);
  } else {
    deps.taperCurveSecondaryPath.removeAttribute("d");
  }
  deps.taperCurvePoints.replaceChildren();
  const visibleCurves = displayAsymmetric
    ? [
        { curve: primaryCurve, side: "primary" },
        { curve: ensureSecondaryTaperCurve(target), side: "secondary" }
      ]
    : [{ curve: primaryCurve, side: "primary" }];
  visibleCurves.forEach(({ curve: visibleCurve, side }) => {
    visibleCurve.forEach((point, index) => {
      const canvasPoint = taperPointToCanvas(point, side, displayAsymmetric);
      const selected = side === deps.sculptState.taperCurveEdit.side && index === deps.sculptState.taperCurveEdit.selectedIndex;
      const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      handle.setAttribute("cx", canvasPoint.x);
      handle.setAttribute("cy", canvasPoint.y);
      handle.setAttribute("r", selected ? 6 : 5);
      handle.setAttribute("class", `profile-point${selected ? " selected" : ""}`);
      handle.dataset.taperPoint = index;
      handle.dataset.curveSide = side;
      if (segmentEditing && point.position < tipSideForkFor() - 1e-4) {
        handle.dataset.tipHidden = "1";
        handle.classList.add("tip-hidden");
      }
      deps.taperCurvePoints.appendChild(handle);
    });
  });
  const selected = curve[deps.sculptState.taperCurveEdit.selectedIndex];
  deps.taperPointValue.min = editingTwist ? String(twistRateUnitsFromDegrees(-TWIST_CURVE_VALUE_MAX)) : "0";
  deps.taperPointValue.max = editingTwist ? String(twistRateUnitsFromDegrees(TWIST_CURVE_VALUE_MAX)) : String(TAPER_VALUE_MAX);
  deps.taperPointValue.step = "0.01";
  deps.taperPointValue.value = editingTwist
    ? String(Number(twistRateUnitsFromDegrees(selected.value).toFixed(2)))
    : selected.value.toFixed(2);
  deps.taperPointValue.disabled = deps.branchSweep.proceduralBranchShapeCurveEditing()
    && (deps.sculptState.taperCurveEdit.selectedIndex === 0 || deps.sculptState.taperCurveEdit.selectedIndex === curve.length - 1);
  deps.taperPointPosition.value = selected.position.toFixed(2);
  deps.taperPointPosition.disabled = deps.sculptState.taperCurveEdit.selectedIndex === 0 || deps.sculptState.taperCurveEdit.selectedIndex === curve.length - 1;
  deps.taperPointInterpolation.value = selected.interpolation;
  document.querySelector("#deleteTaperPoint").disabled = curve.length <= 2 || deps.taperPointPosition.disabled;
  updateTaperMeshPoints();
}
function updateTaperCurveEditorTargetLabel() {
  if (!deps.sculptState.taperCurveEdit) return;
  const group = STRAND_GROUPS.find((item) => item.id === deps.sculptState.taperCurveEdit.id);
  const lock = deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id);
  const multiCount = deps.sculptState.taperCurveEdit.type === "strand" && lock ? deps.compatibleSelectedLocks(lock).length : 0;
  deps.taperCurveTarget.textContent = deps.sculptState.taperCurveEdit.type === "creation"
    ? "New strand defaults"
    : deps.sculptState.taperCurveEdit.type === "group"
      ? `${group ? deps.strandRegionDisplayLabel(group.id) : "Group"} defaults`
      : multiCount > 1
        ? `${multiCount} selected strands`
        : lock?.name || "Selected strand";
}
function retargetOpenTaperCurveEditor(lock) {
  if (!deps.taperCurveEditor.open || !deps.sculptState.taperCurveEdit) return;
  if (deps.sculptState.taperCurveEdit.type === "segment") {
    // 子发尖段编辑：同一 lock 下切换子发尖时同步浮动面板。视口点击/段步进按钮在
    // syncPanelSegmentControls 里走 retargetOpenSegmentTaperEditor；这里额外覆盖
    // refreshStrandSelectionConsumers（选择变化）路径，strand 行为保持不变。
    if (deps.sculptState.taperCurveEdit.id === lock?.id) {
      retargetOpenSegmentTaperEditor(lock, deps.sculptState.panelSegmentIndex);
    }
    return;
  }
  if (deps.sculptState.taperCurveEdit.type !== "strand") return;
  flushScheduledTaperCurveEdit();
  finishTaperMeshPointDrag(null);
  const nextTarget = deps.branchSweep.proceduralBranchCurveEditing()
    ? deps.proceduralGuideForLock(lock)
    : lock;
  if (!nextTarget) {
    closeTaperCurveEditor();
    return;
  }
  deps.sculptState.taperCurveEdit.id = nextTarget.id;
  updateTaperCurveEditorTargetLabel();
  refreshTaperCurveEditorAfterStateRestore();
}
// 热刷新：浮动面板正在编辑某一 lock 的子发尖曲线时，把 taperCurveEdit 重定向到新的
// segmentIndex（面板曲线 + 目标标签即时更新）。不同 lock 或非 segment 编辑时 no-op。
function retargetOpenSegmentTaperEditor(lock, index) {
  if (!deps.taperCurveEditor.open || deps.sculptState.taperCurveEdit?.type !== "segment") return;
  if (!lock || deps.sculptState.taperCurveEdit.id !== lock.id) return;
  const splitCount = (Array.isArray(lock.panelSplits) ? lock.panelSplits.length : 0) + 1;
  const nextIndex = THREE.MathUtils.clamp(
    Math.max(0, Math.round(Number(index ?? deps.sculptState.panelSegmentIndex ?? 0))),
    0,
    splitCount - 1
  );
  flushScheduledTaperCurveEdit();
  finishTaperMeshPointDrag(null);
  if (deps.sculptState.taperCurveEdit.segmentIndex !== nextIndex) {
    deps.sculptState.taperCurveEdit.segmentIndex = nextIndex;
    deps.sculptState.taperCurveEdit.side = "primary";
    deps.sculptState.taperCurveEdit.selectedIndex = 0;
  }
  updateTaperCurveEditorTargetLabel();
  renderTaperCurveEditor();
}
function refreshTaperCurveEditorAfterStateRestore() {
  if (!deps.taperCurveEditor.open || !deps.sculptState.taperCurveEdit) return;
  const target = activeTaperTarget();
  if (!target) {
    closeTaperCurveEditor();
    return;
  }
  if (!deps.branchSweep.proceduralBranchCurveEditing() && deps.sculptState.taperCurveEdit.side === "secondary" && !taperDisplayAsymmetric(target)) {
    deps.sculptState.taperCurveEdit.side = "primary";
  }
  const curve = activeTaperCurve();
  if (!curve?.length) {
    closeTaperCurveEditor();
    return;
  }
  if (
    deps.sculptState.taperCurveEdit.dragPointerId !== null
    && deps.taperCurveCanvas.hasPointerCapture?.(deps.sculptState.taperCurveEdit.dragPointerId)
  ) {
    deps.taperCurveCanvas.releasePointerCapture(deps.sculptState.taperCurveEdit.dragPointerId);
  }
  deps.sculptState.taperCurveEdit.dragPointerId = null;
  deps.sculptState.taperCurveEdit.dragDisplayRange = null;
  deps.sculptState.taperCurveEdit.selectedIndex = THREE.MathUtils.clamp(
    deps.sculptState.taperCurveEdit.selectedIndex,
    0,
    curve.length - 1
  );
  renderTaperCurveEditor();
}
function scheduleTaperCurveEdit() {
  deps.sculptState.taperCurveEditInteractiveDirty = true;
  if (deps.sculptState.scheduledTaperCurveEditFrame !== null) return;
  deps.sculptState.scheduledTaperCurveEditFrame = requestAnimationFrame(() => {
    deps.sculptState.scheduledTaperCurveEditFrame = null;
    applyTaperCurveEdit({ interactive: true });
  });
}
function flushScheduledTaperCurveEdit() {
  if (deps.sculptState.scheduledTaperCurveEditFrame !== null) {
    cancelAnimationFrame(deps.sculptState.scheduledTaperCurveEditFrame);
    deps.sculptState.scheduledTaperCurveEditFrame = null;
  }
  if (!deps.sculptState.taperCurveEditInteractiveDirty) return false;
  deps.sculptState.taperCurveEditInteractiveDirty = false;
  applyTaperCurveEdit();
  return true;
}
function cancelScheduledTaperCurveEdit() {
  const scheduled = deps.sculptState.scheduledTaperCurveEditFrame !== null || deps.sculptState.taperCurveEditInteractiveDirty;
  if (deps.sculptState.scheduledTaperCurveEditFrame !== null) cancelAnimationFrame(deps.sculptState.scheduledTaperCurveEditFrame);
  deps.sculptState.scheduledTaperCurveEditFrame = null;
  deps.sculptState.taperCurveEditInteractiveDirty = false;
  return scheduled;
}
function applyTaperCurveEdit({ interactive = false } = {}) {
  if (!deps.sculptState.taperCurveEdit) return;
  const editingTwist = deps.branchSweep.twistCurveEditing();
  const editingProceduralBranch = deps.branchSweep.proceduralBranchCurveEditing();
  if (editingProceduralBranch) {
    const guide = deps.proceduralGuideForLock(activeTaperTarget());
    if (guide) {
      const curveKey = deps.sculptState.taperCurveEdit.curveKey;
      const defaultCurve = deps.branchSweep.proceduralBranchShapeCurveEditing(curveKey)
        ? deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
        : deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE;
      guide[curveKey] = normalizeTaperCurve(guide[curveKey] || defaultCurve);
      deps.updateLockGeometry(guide, { immediate: true, updateBranches: false });
      const mirroredGuide = deps.proceduralGuideForLock(deps.mirrorPartnerFor(guide));
      if (mirroredGuide) {
        mirroredGuide[curveKey] = deps.shapePresets.cloneShapePresetValue(guide[curveKey]);
        deps.updateLockGeometry(mirroredGuide, { immediate: true, updateBranches: false });
      }
      renderTaperPreview(
        deps.branchSweep.proceduralBranchShapeCurveEditing(curveKey)
          ? deps.proceduralBranchShapeCurvePreview
          : deps.proceduralBranchLengthCurvePreview,
        guide,
        curveKey
      );
    }
    renderTaperCurveEditor();
    return;
  }
  if (deps.sculptState.taperCurveEdit.type === "group") {
    deps.applyGroupDefaultsToExistingStrands(deps.sculptState.taperCurveEdit.id);
    renderTaperPreview(
      deps.sculptState.taperCurveEdit.curveKey === "depthCurve" ? deps.taperPreviewPaths.groupDepth : deps.taperPreviewPaths.group,
      activeTaperTarget(),
      deps.sculptState.taperCurveEdit.curveKey
    );
  } else if (deps.sculptState.taperCurveEdit.type === "creation") {
    if (editingTwist) deps.branchSweep.renderTwistCurvePreview(deps.strandTwistCurvePreview, activeTaperTarget());
    else {
      renderTaperPreview(
        deps.sculptState.taperCurveEdit.curveKey === "depthCurve" ? deps.taperPreviewPaths.strandDepth : deps.taperPreviewPaths.strand,
        activeTaperTarget(),
        deps.sculptState.taperCurveEdit.curveKey
      );
    }
    if (deps.sculptState.drawStrandStroke) deps.updateDrawStrandPreview();
  } else if (deps.sculptState.taperCurveEdit.type === "segment") {
    const lock = deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id);
    const bone = activeTaperTarget();
    if (lock && bone) {
      const curveKey = deps.sculptState.taperCurveEdit.curveKey;
      if (Array.isArray(bone[curveKey])) bone[curveKey] = normalizeTaperCurve(bone[curveKey]);
      const secondaryKey = deps.shapePresets.taperSecondaryKey(curveKey);
      if (Array.isArray(bone[secondaryKey])) bone[secondaryKey] = normalizeTaperCurve(bone[secondaryKey]);
      // 对称显示模式（面板上一次渲染判定两侧曲线实际相同）下，把被编辑一侧的曲线克隆写入
      // 另一侧，保持两侧一致：浮动面板只显示 primary，一次对称编辑不会因 flag 恒 true
      // 而突然切到非对称显示。视口 Ctrl 非对称拖拽不经过这里，几何数据不受影响。
      if (!deps.sculptState.taperCurveEdit.displayAsymmetric) {
        const editingSide = deps.sculptState.taperCurveEdit.side === "secondary" ? "secondary" : "primary";
        if (editingSide === "secondary") bone[curveKey] = deps.shapePresets.cloneShapePresetValue(bone[secondaryKey]);
        else bone[secondaryKey] = deps.shapePresets.cloneShapePresetValue(bone[curveKey]);
      }
      bone[deps.shapePresets.taperAsymmetryKey(curveKey)] = Boolean(bone[deps.shapePresets.taperAsymmetryKey(curveKey)]);
      bone.centerAsymmetricProfile = Boolean(bone.centerAsymmetricProfile);
      deps.updateLockGeometry(lock, { immediate: true, updateBranches: false });
      deps.syncActiveMirror(lock, { deferGeometry: false });
    }
    renderTaperPreview(
      deps.sculptState.taperCurveEdit.curveKey === "depthCurve" ? deps.segmentDepthPreview : deps.segmentTaperPreview,
      activeTaperTarget(),
      deps.sculptState.taperCurveEdit.curveKey
    );
  } else {
    const lock = deps.locks.find((item) => item.id === deps.sculptState.taperCurveEdit.id);
    if (lock) {
      // A branch child's width/depth curves are normally remapped from the parent
      // (branchHierarchy.updateBranchChildren). Mark them authored so the user's direct edits persist.
      if (lock.branchParentId) lock.branchCurvesAuthored = true;
      const curveKey = deps.sculptState.taperCurveEdit.curveKey;
      const primaryCurve = deps.shapePresets.cloneShapePresetValue(lock[curveKey]);
      if (editingTwist) {
        if (interactive) {
          if (deps.hairState.twistCurveAllStrandsPreviewEnabled) {
            deps.editSelectedLocks((item) => {
              if (item !== lock) item.twistCurve = deps.shapePresets.cloneShapePresetValue(primaryCurve);
            }, {
              immediate: true,
              renderList: false,
              updateCurveObjects: false,
              updateClump: false,
              updateTopology: false
            });
          } else {
            deps.rebuildLockGeometry(lock, {
              updateCurveObjects: false,
              updateClump: false
            });
          }
        } else {
          deps.editSelectedLocks((item) => {
            if (item !== lock) item.twistCurve = deps.shapePresets.cloneShapePresetValue(primaryCurve);
          }, {
            renderList: false,
            updateCurveObjects: false
          });
        }
      } else {
        const secondaryKey = deps.shapePresets.taperSecondaryKey(curveKey);
        const asymmetryKey = deps.shapePresets.taperAsymmetryKey(curveKey);
        const secondaryCurve = deps.shapePresets.cloneShapePresetValue(lock[secondaryKey] || lock[curveKey]);
        const asymmetric = Boolean(lock[asymmetryKey]);
        const centered = Boolean(lock.centerAsymmetricProfile);
        deps.editSelectedLocks((item) => {
          if (item === lock) return;
          item[curveKey] = deps.shapePresets.cloneShapePresetValue(primaryCurve);
          item[secondaryKey] = deps.shapePresets.cloneShapePresetValue(secondaryCurve);
          item[asymmetryKey] = asymmetric;
          item.centerAsymmetricProfile = centered;
        }, { renderList: false });
      }
    }
    if (editingTwist) deps.branchSweep.renderTwistCurvePreview(deps.strandTwistCurvePreview, activeTaperTarget());
    else {
      renderTaperPreview(
        deps.sculptState.taperCurveEdit.curveKey === "depthCurve" ? deps.taperPreviewPaths.strandDepth : deps.taperPreviewPaths.strand,
        activeTaperTarget(),
        deps.sculptState.taperCurveEdit.curveKey
      );
    }
  }
  renderTaperCurveEditor();
  if (!interactive) deps.syncShapePresetSelects();
}
function openTaperCurveEditor(curveKey = "taperCurve") {
  let nextEdit = null;
  const selectedLock = deps.getSelectedLock();
  const proceduralGuide = deps.branchSweep.proceduralBranchCurveEditing(curveKey)
    ? deps.proceduralGuideForLock(selectedLock)
    : null;
  if (proceduralGuide) {
    const defaultCurve = deps.branchSweep.proceduralBranchShapeCurveEditing(curveKey)
      ? deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
      : deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE;
    proceduralGuide[curveKey] = normalizeTaperCurve(proceduralGuide[curveKey] || defaultCurve);
    nextEdit = { type: "strand", id: proceduralGuide.id, curveKey, side: "primary", selectedIndex: 0, dragPointerId: null, dragDisplayRange: null };
  } else if (selectedLock && !deps.branchSweep.proceduralBranchCurveEditing(curveKey)) nextEdit = { type: "strand", id: selectedLock.id, curveKey, side: "primary", selectedIndex: 0, dragPointerId: null, dragDisplayRange: null };
  else if (!deps.branchSweep.proceduralBranchCurveEditing(curveKey) && deps.sel.selectedStrandGroup && curveKey !== "twistCurve") nextEdit = { type: "group", id: deps.sel.selectedStrandGroup, curveKey, side: "primary", selectedIndex: 0, dragPointerId: null, dragDisplayRange: null };
  else if (!deps.branchSweep.proceduralBranchCurveEditing(curveKey) && deps.creationToolActive()) nextEdit = { type: "creation", id: "new-strand", curveKey, side: "primary", selectedIndex: 0, dragPointerId: null, dragDisplayRange: null };
  if (!nextEdit) return;
  if (deps.sweepProfileEditor.open) deps.branchSweep.closeSweepProfileEditor();
  if (nextEdit.type === "group" && !deps.miscState.groupDefaultsWarningAcknowledged) {
    const hasExistingStrands = deps.locks.some((lock) => (lock.scalpRegion || "unassigned") === nextEdit.id);
    if (hasExistingStrands) {
      deps.miscState.groupDefaultsWarningContinuation = () => openTaperCurveEditor(curveKey);
      deps.groupDefaultsWarning.showModal();
      return;
    }
  }
  deps.sculptState.taperCurveEdit = nextEdit;
  if (!deps.branchSweep.twistCurveEditing(curveKey) && !deps.branchSweep.proceduralBranchCurveEditing(curveKey)) ensureSecondaryTaperCurve(activeTaperTarget(), curveKey);
  document.querySelector("#taperCurveTitle").textContent = curveKey === "proceduralBranchShapeCurve"
    ? "Branch Shape"
    : curveKey === "proceduralBranchLengthCurve"
    ? "Branch Length Curve"
    : curveKey === "twistCurve"
    ? "Twist Rate Curve"
    : curveKey === "depthCurve" ? "Depth Curve" : "Width Curve";
  updateTaperCurveEditorTargetLabel();
  setTaperMeshPointsVisible(curveKey !== "twistCurve");
  deps.taperMeshPointsToggleRow.classList.toggle(
    "hidden",
    nextEdit.type !== "strand" || deps.branchSweep.proceduralBranchCurveEditing(curveKey)
  );
  renderTaperCurveEditor();
  deps.taperCurveEditor.show();
  deps.updateViewportStatsVisibility();
}
function closeTaperCurveEditor() {
  flushScheduledTaperCurveEdit();
  if (deps.sculptState.taperCurveEdit?.dragPointerId !== null && deps.taperCurveCanvas.hasPointerCapture?.(deps.sculptState.taperCurveEdit.dragPointerId)) {
    deps.taperCurveCanvas.releasePointerCapture(deps.sculptState.taperCurveEdit.dragPointerId);
  }
  finishTaperMeshPointDrag(null);
  setTaperMeshPointsVisible(false);
  deps.taperMeshPointsToggleRow.classList.add("hidden");
  deps.sculptState.taperCurveEdit = null;
  if (deps.taperCurveEditor.open) deps.taperCurveEditor.close();
  deps.updateViewportStatsVisibility();
}
function retargetFloatingStrandEditors() {
  const lock = deps.getSelectedLock();
  if (!lock) return;
  if (deps.sweepProfileEditor.open && deps.sculptState.sweepProfileEdit?.type === "strand") {
    deps.sculptState.sweepProfileEdit.id = lock.id;
    deps.sweepProfileTarget.textContent = lock.name || "Selected strand";
    deps.branchSweep.renderSweepProfileEditor();
  }
  if (deps.taperCurveEditor.open && deps.sculptState.taperCurveEdit?.type === "strand") {
    deps.sculptState.taperCurveEdit.id = lock.id;
    deps.taperCurveTarget.textContent = lock.name || "Selected strand";
    renderTaperCurveEditor();
  }
}
function releaseTaperCurveEditorFieldFocus() {
  const focused = document.activeElement;
  if (!focused || !deps.taperCurveEditor.contains(focused)) return;
  const tag = focused.tagName?.toLowerCase();
  if (
    tag === "input"
    || tag === "textarea"
    || tag === "select"
    || focused.isContentEditable
  ) focused.blur();
}
function finishTaperCurveDrag(event) {
  if (!deps.sculptState.taperCurveEdit || deps.sculptState.taperCurveEdit.dragPointerId !== event.pointerId) return;
  if (deps.taperCurveCanvas.hasPointerCapture?.(event.pointerId)) deps.taperCurveCanvas.releasePointerCapture(event.pointerId);
  deps.sculptState.taperCurveEdit.dragPointerId = null;
  deps.sculptState.taperCurveEdit.dragDisplayRange = null;
  if (!flushScheduledTaperCurveEdit()) renderTaperCurveEditor();
}
function beginTaperMeshPointDrag(event) {
  if (
    event.button !== 0
    || !deps.hairState.taperMeshPointsVisible
    || !deps.taperMeshPointsGroup.visible
    || deps.sculptState.taperMeshPointDrag
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return;
  deps.rayFromViewportEvent(event);
  const hit = deps.raycaster.intersectObjects(deps.taperMeshPointsGroup.children, false)[0];
  if (!hit?.object?.userData.taperMeshPoint) return;
  releaseTaperCurveEditorFieldFocus();
  const lock = deps.locks.find((item) => item.id === hit.object.userData.lockId);
  deps.sculptState.taperCurveEdit.side = hit.object.userData.curveSide === "secondary" ? "secondary" : "primary";
  const curvePoints = activeTaperCurve();
  const pointIndex = hit.object.userData.pointIndex;
  const curvePoint = curvePoints?.[pointIndex];
  if (!lock || !curvePoint) return;

  const curve = deps.strandGeometryCurve(lock);
  const editingTwist = deps.branchSweep.twistCurveEditing();
  const frame = taperMeshPointFrame(lock, curve, curvePoint.position, deps.sculptState.taperCurveEdit.curveKey);
  const cameraDirection = new THREE.Vector3();
  deps.camera.getWorldDirection(cameraDirection).normalize();
  const axis = editingTwist ? "twist" : deps.sculptState.taperCurveEdit.curveKey === "depthCurve" ? "z" : "x";
  const shapeAxis = editingTwist ? deps.branchSweep.twistMeshGraphAxis(frame) : frame[axis].clone();
  const projectedAxis = shapeAxis.addScaledVector(
    cameraDirection,
    -shapeAxis.dot(cameraDirection)
  );
  const projectedLength = projectedAxis.length();
  if (projectedLength < 0.08) return;
  projectedAxis.multiplyScalar(1 / projectedLength);
  const side = hit.object.userData.side;
  const displayRange = editingTwist
    ? twistCurveDisplayRange(
        curvePoints,
        TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
        TWIST_CURVE_VALUE_MAX
      )
    : null;
  const extentPerValue = editingTwist
    ? deps.branchSweep.twistMeshPointDistancePerDegree(lock, curvePoint.position, displayRange)
    : taperMeshPointExtentPerValue(lock, curvePoint.position, side, axis);
  const screenExtentPerValue = extentPerValue * projectedLength;
  if (screenExtentPerValue < 0.00000001) return;
  const shapeVector = projectedAxis.clone().multiplyScalar(screenExtentPerValue * side);
  const positionVector = frame.y.clone().addScaledVector(
    cameraDirection,
    -frame.y.dot(cameraDirection)
  ).multiplyScalar(curve.getLength());
  const endpoint = pointIndex === 0 || pointIndex === curvePoints.length - 1;

  deps.pushUndoState();
  deps.sculptState.taperCurveEdit.selectedIndex = pointIndex;
  deps.sculptState.taperMeshPointDrag = {
    pointerId: event.pointerId,
    lockId: lock.id,
    point: curvePoint,
    side,
    center: frame.point.clone(),
    shapeVector,
    positionVector: endpoint || positionVector.lengthSq() < 0.0001 ? null : positionVector,
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(cameraDirection, frame.point),
    originalValue: curvePoint.value,
    originalPosition: curvePoint.position,
    displayRange,
    valueMinimum: editingTwist ? -TWIST_CURVE_VALUE_MAX : 0,
    valueMaximum: editingTwist ? TWIST_CURVE_VALUE_MAX : TAPER_VALUE_MAX
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = "ew-resize";
  deps.updateInteractionLocks();
  renderTaperCurveEditor();
  event.preventDefault();
  event.stopImmediatePropagation();
}
function updateTaperMeshPointDrag(event) {
  const drag = deps.sculptState.taperMeshPointDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const curve = activeTaperCurve();
  const point = drag.point;
  const pointIndex = curve?.indexOf(point) ?? -1;
  if (pointIndex < 0) {
    finishTaperMeshPointDrag(event);
    return;
  }
  deps.rayFromViewportEvent(event);
  const intersection = deps.raycaster.ray.intersectPlane(drag.plane, new THREE.Vector3());
  if (!intersection) return;
  const delta = intersection.sub(drag.center);
  const shapeLengthSquared = drag.shapeVector.lengthSq();
  if (drag.positionVector) {
    const positionLengthSquared = drag.positionVector.lengthSq();
    const crossTerm = drag.shapeVector.dot(drag.positionVector);
    const determinant = shapeLengthSquared * positionLengthSquared - crossTerm * crossTerm;
    const determinantThreshold = Math.max(
      0.0000000000000001,
      shapeLengthSquared * positionLengthSquared * 0.000001
    );
    if (determinant > determinantThreshold) {
      const shapeProjection = delta.dot(drag.shapeVector);
      const positionProjection = delta.dot(drag.positionVector);
      point.value = THREE.MathUtils.clamp(
        (shapeProjection * positionLengthSquared - positionProjection * crossTerm) / determinant,
        drag.valueMinimum,
        drag.valueMaximum
      );
      const positionDelta = (
        positionProjection * shapeLengthSquared - shapeProjection * crossTerm
      ) / determinant;
      const minimumPosition = Number(curve[pointIndex - 1]?.position ?? 0) + 0.01;
      const maximumPosition = Number(curve[pointIndex + 1]?.position ?? 1) - 0.01;
      point.position = THREE.MathUtils.clamp(
        drag.originalPosition + positionDelta,
        minimumPosition,
        maximumPosition
      );
    }
  } else if (shapeLengthSquared > 0.0000000000000001) {
    point.value = THREE.MathUtils.clamp(
      delta.dot(drag.shapeVector) / shapeLengthSquared,
      drag.valueMinimum,
      drag.valueMaximum
    );
  }
  deps.sculptState.taperCurveEdit.selectedIndex = curve.indexOf(point);
  scheduleTaperCurveEdit();
  event.preventDefault();
  event.stopImmediatePropagation();
}
function finishTaperMeshPointDrag(event, { cancel = false } = {}) {
  const drag = deps.sculptState.taperMeshPointDrag;
  if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
  if (cancel) {
    cancelScheduledTaperCurveEdit();
    const curve = activeTaperCurve();
    if (curve?.includes(drag.point)) {
      drag.point.value = drag.originalValue;
      drag.point.position = drag.originalPosition;
      deps.sculptState.taperCurveEdit.selectedIndex = curve.indexOf(drag.point);
      applyTaperCurveEdit();
    }
  } else flushScheduledTaperCurveEdit();
  deps.sculptState.taperMeshPointDrag = null;
  if (deps.renderer.domElement.hasPointerCapture?.(drag.pointerId)) {
    deps.renderer.domElement.releasePointerCapture(drag.pointerId);
  }
  deps.renderer.domElement.style.cursor = "";
  deps.updateInteractionLocks();
  updateTaperMeshPoints();
  event?.preventDefault();
  event?.stopImmediatePropagation();
}
function updateSelectedTaperPoint(key, value) {
  const curve = activeTaperCurve();
  const selected = curve?.[deps.sculptState.taperCurveEdit?.selectedIndex];
  if (!selected) return;
  selected[key] = value;
  if (key === "position") {
    selected.position = THREE.MathUtils.clamp(Number(value), 0.01, 0.99);
    curve.sort((a, b) => a.position - b.position);
    deps.sculptState.taperCurveEdit.selectedIndex = curve.indexOf(selected);
  }
  applyTaperCurveEdit();
}

  return {
    activeStrandShapeTarget,
    activeTaperTarget,
    activeTaperCurve,
    ensureSecondaryTaperCurve,
    taperSamples,
    ensureAsymmetricTaperPreviewElements,
    renderTaperPreview,
    segmentCurveTarget,
    segmentCurveTargetForWrite,
    shapeTargetForSelect,
    taperPointToCanvas,
    canvasToTaperPoint,
    clearTaperMeshPoints,
    taperMeshPointFrame,
    taperMeshPointExtentPerValue,
    updateTaperMeshPoints,
    setTaperMeshPointsVisible,
    renderTaperCurveEditor,
    updateTaperCurveEditorTargetLabel,
    retargetOpenTaperCurveEditor,
    retargetOpenSegmentTaperEditor,
    refreshTaperCurveEditorAfterStateRestore,
    scheduleTaperCurveEdit,
    flushScheduledTaperCurveEdit,
    cancelScheduledTaperCurveEdit,
    applyTaperCurveEdit,
    openTaperCurveEditor,
    closeTaperCurveEditor,
    retargetFloatingStrandEditors,
    releaseTaperCurveEditorFieldFocus,
    finishTaperCurveDrag,
    beginTaperMeshPointDrag,
    updateTaperMeshPointDrag,
    finishTaperMeshPointDrag,
    updateSelectedTaperPoint,
  };
}
