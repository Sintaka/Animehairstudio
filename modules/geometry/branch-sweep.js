// branch-sweep.js — child sweep-profile / twist-curve editing (refactor 3d-3d-b).
// Extracted from app.js; coupling injected via createBranchSweepApi(deps).
import * as THREE from "three";
import { symmetricClosedCurveParameters, twistCurveDisplayRange } from "./curve-math.js";

export function createBranchSweepApi(deps) {
  // deps: activeCreationShapeDefaults, activeProfileOffset, applyGroupDefaultsToExistingStrands,
  //   closeTaperCurveEditor, compatibleSelectedLocks, creationToolActive, editSelectedLocks,
  //   getSelectedLock, profileToCanvas, renderHairCardCoveragePath, renderProfilePreview,
  //   strandRegionDisplayLabel, syncShapePresetSelects, taperMeshPointExtentPerValue,
  //   taperMeshPointFrame, taperSamples, updateDrawStrandPreview, updateViewportStatsVisibility,
  //   locks, sculptState, projectState, selState, miscState (store .state proxies)

function activeSweepProfile() {
  if (!deps.sculptState.sweepProfileEdit) return null;
  if (deps.sculptState.sweepProfileEdit.type === "group") return strandGroupDefaults[deps.sculptState.sweepProfileEdit.id]?.sweepProfile || null;
  if (deps.sculptState.sweepProfileEdit.type === "creation") return deps.activeCreationShapeDefaults().sweepProfile;
  return deps.locks.find((lock) => lock.id === deps.sculptState.sweepProfileEdit.id)?.sweepProfile || null;
}

function activeSweepProfileTarget() {
  if (!deps.sculptState.sweepProfileEdit) return null;
  if (deps.sculptState.sweepProfileEdit.type === "group") return strandGroupDefaults[deps.sculptState.sweepProfileEdit.id] || null;
  if (deps.sculptState.sweepProfileEdit.type === "creation") return deps.activeCreationShapeDefaults();
  return deps.locks.find((lock) => lock.id === deps.sculptState.sweepProfileEdit.id) || null;
}

function trimmedSweepProfile(profile, target = null) {
  if (!profile?.length) return profile || [];
  const minX = Math.min(...profile.map((point) => point.x));
  const maxX = Math.max(...profile.map((point) => point.x));
  const centerX = (minX + maxX) * 0.5;
  const leftBoundary = THREE.MathUtils.lerp(minX, centerX, THREE.MathUtils.clamp(Number(target?.profileTrimLeft ?? 0), 0, 1));
  const rightBoundary = THREE.MathUtils.lerp(maxX, centerX, THREE.MathUtils.clamp(Number(target?.profileTrimRight ?? 0), 0, 1));
  const roundness = THREE.MathUtils.clamp(Number(target?.profileTrimRoundness ?? 1), 0, 1);
  const blend = Math.max(0.0001, (maxX - minX) * 0.24 * roundness);
  const roundedLeft = (x) => {
    if (x <= leftBoundary || roundness <= 0) return Math.max(x, leftBoundary);
    if (x >= leftBoundary + blend) return x;
    const t = (x - leftBoundary) / blend;
    return leftBoundary + blend * (-t * t * t + 2 * t * t);
  };
  const roundedRight = (x) => {
    if (x >= rightBoundary || roundness <= 0) return Math.min(x, rightBoundary);
    if (x <= rightBoundary - blend) return x;
    const t = (rightBoundary - x) / blend;
    return rightBoundary - blend * (-t * t * t + 2 * t * t);
  };
  return profile.map((point) => {
    const x = roundedRight(roundedLeft(point.x));
    const clipped = Math.abs(x - point.x) > 0.0001;
    return {
      ...point,
      x,
      interpolation: roundness <= 0.001 && clipped ? "linear" : point.interpolation
    };
  });
}

function mirroredSweepProfileIndex(profile, pointIndex) {
  const point = profile?.[pointIndex];
  if (!point) return null;
  if (Math.abs(point.x) < 0.025) return pointIndex;
  let bestIndex = null;
  let bestDistance = Infinity;
  profile.forEach((candidate, index) => {
    if (index === pointIndex) return;
    const distance = (candidate.x + point.x) ** 2 + (candidate.z - point.z) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function createSmoothSweepProfileCurve(profile) {
  return new THREE.CatmullRomCurve3(
    profile.map((point) => new THREE.Vector3(point.x, 0, point.z)),
    true,
    "centripetal",
    0.5
  );
}

function sampleSweepProfile(profile, t, smoothCurve = createSmoothSweepProfileCurve(profile)) {
  const wrappedT = ((Number(t) % 1) + 1) % 1;
  const segmentPosition = wrappedT * profile.length;
  const segmentIndex = Math.min(profile.length - 1, Math.floor(segmentPosition));
  const segmentT = segmentPosition - segmentIndex;
  const current = profile[segmentIndex];
  const next = profile[(segmentIndex + 1) % profile.length];
  // Interpolation belongs to the point itself: a linear point straightens
  // both adjacent segments, while a curved segment needs smooth endpoints.
  const linearSegment = (current.interpolation || "smooth") === "linear"
    || (next.interpolation || "smooth") === "linear";
  if (linearSegment) {
    return new THREE.Vector3(
      THREE.MathUtils.lerp(current.x, next.x, segmentT),
      0,
      THREE.MathUtils.lerp(current.z, next.z, segmentT)
    );
  }
  return smoothCurve.getPoint(wrappedT);
}

function createSweepProfileTopology(profile, requestedSegments, smoothCurve = createSmoothSweepProfileCurve(profile)) {
  const symmetryAxisIndex = profile.reduce((bestIndex, point, index) => {
    const best = profile[bestIndex];
    if (point.z > best.z + 0.00001) return index;
    if (Math.abs(point.z - best.z) <= 0.00001 && Math.abs(point.x) < Math.abs(best.x)) return index;
    return bestIndex;
  }, 0);
  const symmetryAxisParameter = symmetryAxisIndex / profile.length;
  const hardParameters = profile.flatMap((point, index) => (
    (point.interpolation || "smooth") === "linear" ? [index / profile.length] : []
  ));
  const parameters = symmetricClosedCurveParameters(
    requestedSegments,
    symmetryAxisParameter,
    hardParameters
  );
  let slotCount = 0;
  const samples = parameters.map((t) => {
    const controlIndex = profile.findIndex((_, index) => Math.abs(t - index / profile.length) < 0.00001);
    const hard = controlIndex >= 0 && (profile[controlIndex].interpolation || "smooth") === "linear";
    const incomingSlot = slotCount++;
    const outgoingSlot = hard ? slotCount++ : incomingSlot;
    return {
      t,
      point: sampleSweepProfile(profile, t, smoothCurve),
      hard,
      incomingSlot,
      outgoingSlot
    };
  });
  const slots = Array(slotCount);
  samples.forEach((sample) => {
    slots[sample.incomingSlot] = sample;
    slots[sample.outgoingSlot] = sample;
  });
  const edges = samples.map((sample, index) => ({
    start: sample.outgoingSlot,
    end: samples[(index + 1) % samples.length].incomingSlot
  }));
  return { samples, slots, edges };
}

function twistCurveEditing(curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
  return curveKey === "twistCurve";
}

function proceduralBranchLengthCurveEditing(curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
  return curveKey === "proceduralBranchLengthCurve";
}

function proceduralBranchShapeCurveEditing(curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
  return curveKey === "proceduralBranchShapeCurve";
}

function proceduralBranchCurveEditing(curveKey = deps.sculptState.taperCurveEdit?.curveKey) {
  return proceduralBranchLengthCurveEditing(curveKey) || proceduralBranchShapeCurveEditing(curveKey);
}

function renderTwistCurvePreview(path, target) {
  const curve = target?.twistCurve;
  if (!path || !curve?.length) return;
  const displayRange = twistCurveDisplayRange(
    curve,
    deps.TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
    deps.TWIST_CURVE_VALUE_MAX
  );
  const sampled = deps.taperSamples(curve, 64).map((point) => ({
    x: 9 + point.position * 142,
    y: 35 - (point.value / displayRange) * 27
  }));
  const line = sampled
    .map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
  path.setAttribute("d", `${line} L151,35 L9,35 Z`);
}

function twistMeshPointDistancePerDegree(lock, position, displayRange) {
  const referenceExtent = Math.max(
    deps.taperMeshPointExtentPerValue(lock, position, 1, "x"),
    deps.taperMeshPointExtentPerValue(lock, position, 1, "z")
  );
  return twistCurveHandleDistancePerDegree(referenceExtent, displayRange);
}

function twistMeshGraphAxis(frame) {
  return frame.x.clone().negate();
}

function addTwistMeshCurvePath(lock, curve, twistCurve, displayRange) {
  const samples = [];
  const positions = [...new Set([
    ...Array.from({ length: 65 }, (_, index) => index / 64),
    ...twistCurve.map((point) => Number(point.position))
  ])].sort((left, right) => left - right);
  positions.forEach((position) => {
    const frame = deps.taperMeshPointFrame(lock, curve, position, "twistCurve");
    const value = sampleTaperCurve(twistCurve, position);
    const graphAxis = twistMeshGraphAxis(frame);
    samples.push({
      value,
      center: frame.point.clone(),
      point: frame.point.clone().addScaledVector(
        graphAxis,
        twistMeshPointDistancePerDegree(lock, position, displayRange) * value
      )
    });
  });
  const signedSegments = { positive: [], negative: [] };
  const signedFills = { positive: [], negative: [] };
  const appendSegment = (sign, start, end) => {
    signedSegments[sign < 0 ? "negative" : "positive"].push(start, end);
  };
  const appendFill = (sign, start, end) => {
    signedFills[sign < 0 ? "negative" : "positive"].push(
      start.center, start.point, end.point,
      start.center, end.point, end.center
    );
  };
  const appendSignedSection = (sign, start, end) => {
    appendSegment(sign, start.point, end.point);
    appendFill(sign, start, end);
  };
  for (let index = 1; index < samples.length; index += 1) {
    const start = samples[index - 1];
    const end = samples[index];
    const startSign = Math.sign(start.value);
    const endSign = Math.sign(end.value);
    if (!startSign || !endSign || startSign === endSign) {
      appendSignedSection(startSign || endSign || 1, start, end);
      continue;
    }
    const zeroAmount = Math.abs(start.value) / (Math.abs(start.value) + Math.abs(end.value));
    const zeroCenter = start.center.clone().lerp(end.center, zeroAmount);
    const zero = { value: 0, center: zeroCenter, point: zeroCenter };
    appendSignedSection(startSign, start, zero);
    appendSignedSection(endSign, zero, end);
  }
  [
    [signedFills.positive, twistMeshCurvePositiveFillMaterial, "positive"],
    [signedFills.negative, twistMeshCurveNegativeFillMaterial, "negative"]
  ].forEach(([points, material, sign]) => {
    if (!points.length) return;
    const fill = new THREE.Mesh(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    fill.renderOrder = 33;
    fill.raycast = () => {};
    fill.userData.twistMeshCurveFill = sign;
    taperMeshPointsGroup.add(fill);
  });
  [
    [signedSegments.positive, twistMeshCurvePositiveMaterial, "positive"],
    [signedSegments.negative, twistMeshCurveNegativeMaterial, "negative"]
  ].forEach(([points, material, sign]) => {
    if (!points.length) return;
    const line = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    line.renderOrder = 34;
    line.raycast = () => {};
    line.userData.twistMeshCurvePath = sign;
    taperMeshPointsGroup.add(line);
  });
}

function renderSweepProfileEditor() {
  const profile = activeSweepProfile();
  if (!profile?.length) return;
  const target = activeSweepProfileTarget();
  const visibleProfile = trimmedSweepProfile(profile, target);
  const originalCurve = createSmoothSweepProfileCurve(profile);
  const originalSampled = Array.from({ length: 97 }, (_, index) => sampleSweepProfile(profile, index / 96, originalCurve))
    .map((point) => deps.profileToCanvas({ x: point.x, z: point.z }));
  sweepProfileOriginalPath.setAttribute("d", `${originalSampled.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")} Z`);
  const smoothCurve = createSmoothSweepProfileCurve(visibleProfile);
  const sampled = Array.from({ length: 97 }, (_, index) => sampleSweepProfile(visibleProfile, index / 96, smoothCurve))
    .map((point) => deps.profileToCanvas({ x: point.x, z: point.z }));
  sweepProfilePath.setAttribute("d", `${sampled.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")} Z`);
  deps.renderHairCardCoveragePath(
    sweepProfileHairCardCoveragePath,
    visibleProfile,
    Boolean(target?.hairCard),
    (point) => deps.profileToCanvas({ x: point.x, z: point.z })
  );
  sweepProfilePoints.replaceChildren();
  visibleProfile.forEach((point, index) => {
    const canvasPoint = deps.profileToCanvas(point);
    const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    handle.setAttribute("cx", canvasPoint.x);
    handle.setAttribute("cy", canvasPoint.y);
    handle.setAttribute("r", index === deps.sculptState.sweepProfileEdit.selectedIndex ? 6 : 5);
    handle.setAttribute("class", `profile-point${index === deps.sculptState.sweepProfileEdit.selectedIndex ? " selected" : ""}`);
    handle.dataset.profilePoint = index;
    sweepProfilePoints.appendChild(handle);
  });
  const selected = profile[deps.sculptState.sweepProfileEdit.selectedIndex];
  sweepPointInterpolation.value = selected?.interpolation || "smooth";
  sweepProfileMirrorX.setAttribute("aria-pressed", String(deps.projectState.sweepProfileMirrorEnabled));
  Object.entries(sweepProfileTrimInputs).forEach(([key, input]) => {
    const value = Number(target?.[key] ?? 0);
    input.value = value;
    sweepProfileTrimValues[key].textContent = value.toFixed(2);
  });
  const roundness = Number(target?.profileTrimRoundness ?? 1);
  sweepProfileTrimRoundness.value = roundness;
  sweepProfileTrimRoundnessValue.textContent = roundness.toFixed(2);
}

function applySweepProfileEdit() {
  if (!deps.sculptState.sweepProfileEdit) return;
  if (deps.sculptState.sweepProfileEdit.type === "group") {
    deps.applyGroupDefaultsToExistingStrands(deps.sculptState.sweepProfileEdit.id);
  } else if (deps.sculptState.sweepProfileEdit.type === "creation") {
    if (deps.sculptState.drawStrandStroke) deps.updateDrawStrandPreview();
  } else {
    const lock = deps.locks.find((item) => item.id === deps.sculptState.sweepProfileEdit.id);
    if (lock) {
      const profile = shapePresets.cloneShapePresetValue(lock.sweepProfile);
      const trimLeft = Number(lock.profileTrimLeft ?? 0);
      const trimRight = Number(lock.profileTrimRight ?? 0);
      const roundness = Number(lock.profileTrimRoundness ?? 1);
      deps.editSelectedLocks((item) => {
        if (item !== lock) item.sweepProfile = shapePresets.cloneShapePresetValue(profile);
        item.profileTrimLeft = trimLeft;
        item.profileTrimRight = trimRight;
        item.profileTrimRoundness = roundness;
      }, { renderList: false });
    }
  }
  const previewPath = deps.sculptState.sweepProfileEdit.type === "group" ? profilePreviewPaths.group : profilePreviewPaths.strand;
  deps.renderProfilePreview(previewPath, activeSweepProfile(), deps.activeProfileOffset(), activeSweepProfileTarget());
  renderSweepProfileEditor();
  deps.syncShapePresetSelects();
}

function openSweepProfileEditor() {
  let nextEdit = null;
  const selectedLock = deps.getSelectedLock();
  if (selectedLock) {
    nextEdit = { type: "strand", id: selectedLock.id, selectedIndex: 0, dragPointerId: null };
  } else if (deps.selState.selectedStrandGroup) {
    nextEdit = { type: "group", id: deps.selState.selectedStrandGroup, selectedIndex: 0, dragPointerId: null };
  } else if (deps.creationToolActive()) {
    nextEdit = { type: "creation", id: "new-strand", selectedIndex: 0, dragPointerId: null };
  }
  if (!nextEdit) return;
  if (taperCurveEditor.open) deps.closeTaperCurveEditor();

  if (nextEdit.type === "group" && !deps.miscState.groupDefaultsWarningAcknowledged) {
    const hasExistingStrands = deps.locks.some((lock) => (lock.scalpRegion || "unassigned") === nextEdit.id);
    if (hasExistingStrands) {
      deps.miscState.groupDefaultsWarningContinuation = openSweepProfileEditor;
      groupDefaultsWarning.showModal();
      return;
    }
  }

  deps.sculptState.sweepProfileEdit = nextEdit;
  const group = deps.STRAND_GROUPS.find((item) => item.id === nextEdit.id);
  const lock = deps.locks.find((item) => item.id === nextEdit.id);
  const multiCount = nextEdit.type === "strand" ? deps.compatibleSelectedLocks(lock).length : 0;
  sweepProfileTarget.textContent = nextEdit.type === "creation"
    ? "New strand defaults"
    : nextEdit.type === "group" ? `${group ? deps.strandRegionDisplayLabel(group.id) : "Group"} defaults`
      : multiCount > 1 ? `${multiCount} selected strands` : lock?.name || "Selected strand";
  renderSweepProfileEditor();
  sweepProfileEditor.show();
  deps.updateViewportStatsVisibility();
}

function closeSweepProfileEditor() {
  if (deps.sculptState.sweepProfileEdit?.dragPointerId !== null && sweepProfileCanvas.hasPointerCapture?.(deps.sculptState.sweepProfileEdit.dragPointerId)) {
    sweepProfileCanvas.releasePointerCapture(deps.sculptState.sweepProfileEdit.dragPointerId);
  }
  deps.sculptState.sweepProfileEdit = null;
  if (sweepProfileEditor.open) sweepProfileEditor.close();
  deps.updateViewportStatsVisibility();
}

function finishSweepProfileDrag(event) {
  if (!deps.sculptState.sweepProfileEdit || deps.sculptState.sweepProfileEdit.dragPointerId !== event.pointerId) return;
  if (sweepProfileCanvas.hasPointerCapture?.(event.pointerId)) sweepProfileCanvas.releasePointerCapture(event.pointerId);
  deps.sculptState.sweepProfileEdit.dragPointerId = null;
  deps.sculptState.sweepProfileEdit.mirrorIndex = null;
}
  return {
    activeSweepProfile, activeSweepProfileTarget, trimmedSweepProfile, mirroredSweepProfileIndex,
    createSmoothSweepProfileCurve, sampleSweepProfile, createSweepProfileTopology,
    twistCurveEditing, proceduralBranchLengthCurveEditing, proceduralBranchShapeCurveEditing,
    proceduralBranchCurveEditing, renderTwistCurvePreview, twistMeshPointDistancePerDegree,
    twistMeshGraphAxis, addTwistMeshCurvePath, renderSweepProfileEditor, applySweepProfileEdit,
    openSweepProfileEditor, closeSweepProfileEditor, finishSweepProfileDrag
  };
}
