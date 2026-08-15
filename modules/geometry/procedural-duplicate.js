// procedural-duplicate.js - procedural duplicate: dialog/live preview/arc preview/evenly-spaced
// duplicate build + duplicate placement flow (refactor batch B6b / plan A3). Extracted from
// app.js; all app.js coupling injected via createProceduralDuplicateApi(deps).
import * as THREE from "three";
import {
  blendDirectionPointData,
  blendCylindricalPolylinePointData,
  blendEnvelopeCurves,
  blendSampleArrays,
  blendSurfaceOrientedPolylinePointData,
  blendTaperCurves,
  evenlySpacedInteriorAmounts,
  horizontalCirclePointData,
  horizontalCircleThroughPointData,
  lowestSharedHorizontalPolylinePointData,
  proximityCurveBlendAmount,
  rootCorrectionFalloff,
  sampleArray,
  surfaceArcBlendAmount,
  surfaceArcPolylinePointData
} from "./curve-math.js?v=20260813-3";
import {
  DEFAULT_TWIST_CURVE,
  ROOT_SCALP_OFFSET_DISTANCE,
  TWIST_CURVE_VALUE_MAX
} from "../core/app-config.js?v=20260815-2";

export function createProceduralDuplicateApi(deps) {
  // deps: store .state proxy (sculptState: duplicatePlacement/proceduralDuplicatePreview/
  //   proceduralDuplicateWindowSourceIds/rebuildingProceduralDuplicatePreview/
  //   proceduralDuplicateModeActive/altOrbitDrag; use deps.X.y, never deps.X.state.y),
  // shared history (undoHistory/redoHistory) + objects (locks/raycaster),
  // procedural duplicate DOM elements (proceduralDuplicateDialog/proceduralDuplicateCountInput/
  //   proceduralDuplicateRootSinkInput/proceduralDuplicateSecondPointOutwardInput/
  //   proceduralDuplicateSecondPointTowardRootInput/proceduralDuplicateSpacingNote/
  //   proceduralDuplicateStatus/placementStatus),
  // THREE preview objects (proceduralDuplicateArcPreview/proceduralDuplicateCirclePreview/
  //   proceduralDuplicateArcMarker),
  // cross-module apis (drawFlowApi: worldNormalAtHit; placementApi: updatePlacementStatus x7;
  //   scalpBuilder: activeScalpSurfaceMesh/rootScalpOffsetDistance/scalpTriangleRegion/
  //   scalpBuilderHeadMeshes/closestPointOnActiveScalp),
  // app.js spine helpers (19: snapshotState/restoreLock/selectLock/deleteLocks/renderLockList/
  //   updateCount/updateInteractionLocks/updateHistoryButtons/createMirrorPartnerForNewLock/
  //   syncActiveMirror/syncLockFromCurve/updateLockGeometry/flushPendingLockGeometryUpdates/
  //   createRootAttachment/layerOffsetForLock/layerRootOffsetFactor/rayFromViewportEvent/
  //   viewPlaneNormal/selectedLocksInOrder).
  // Batch-fill point in app.js: after the placementDeps batch (all const/let deps defined) and
  // before the bootstrap init; see devlog/in-progress/clump-procedural-refactor-map.md.

function duplicatePlacementTarget(event, placement) {
  const ray = deps.rayFromViewportEvent(event);
  const scalpHit = deps.raycaster.intersectObject(deps.scalpBuilder.activeScalpSurfaceMesh(), false)[0] || null;
  if (scalpHit) {
    const normal = deps.drawFlowApi.worldNormalAtHit(scalpHit);
    return {
      root: scalpHit.point.clone().addScaledVector(
        normal,
        deps.scalpBuilder.rootScalpOffsetDistance(placement.lock.rootScalpOffset)
          + deps.layerOffsetForLock(placement.lock) * deps.layerRootOffsetFactor(placement.lock.hairLayer)
      ),
      surfacePoint: scalpHit.point.clone(),
      surfaceNormal: normal,
      scalpRegion: deps.scalpBuilder.scalpTriangleRegion(scalpHit.object, scalpHit.faceIndex),
      attached: placement.sourceAttachmentEnabled
    };
  }
  const root = ray.intersectPlane(placement.viewPlane, new THREE.Vector3());
  if (!root) return null;
  return {
    root,
    surfacePoint: root.clone(),
    surfaceNormal: placement.lock.rootSurfaceNormal?.clone() || deps.viewPlaneNormal(),
    attached: false
  };
}

function proceduralDuplicateSourceSnapshots(sources, undoState) {
  return sources.map((source) => undoState.locks.find((snapshot) => snapshot.id === source.id)).filter(Boolean);
}

function proceduralDuplicateEligibleLock(lock) {
  return Boolean(
    lock
    && deps.locks.includes(lock)
    && !lock.proceduralDuplicatePreview
    && lock.points?.length >= 2
    && !["poly", "surface", "curve-surface"].includes(lock.geometryType)
  );
}

function selectedProceduralDuplicateSources() {
  const selected = deps.selectedLocksInOrder();
  return selected.length === 2 && selected.every(proceduralDuplicateEligibleLock) ? selected : [];
}

function updateProceduralDuplicateSpacingNote() {
  const count = THREE.MathUtils.clamp(Math.round(Number(deps.proceduralDuplicateCountInput.value) || 1), 1, 32);
  deps.proceduralDuplicateCountInput.value = String(count);
  const numberInput = deps.proceduralDuplicateCountInput
    .closest(".slider-input-row")
    ?.querySelector(".slider-number-input");
  if (numberInput && document.activeElement !== numberInput) numberInput.value = String(count);
  deps.proceduralDuplicateSpacingNote.textContent = count === 1
    ? "1 duplicate will be placed halfway between the selected strands."
    : `${count} duplicates will evenly divide the space into ${count + 1} intervals.`;
}

function clearProceduralDuplicatePreview() {
  hideProceduralDuplicateArcPreview();
  const previewIds = deps.sculptState.proceduralDuplicatePreview?.createdIds || [];
  deps.sculptState.proceduralDuplicatePreview = null;
  if (!previewIds.length) return;
  const previewLocks = previewIds
    .map((id) => deps.locks.find((lock) => lock.id === id))
    .filter(Boolean);
  if (previewLocks.length) deps.deleteLocks(previewLocks);
}

function closeProceduralDuplicateDialog({ commit = false } = {}) {
  if (!commit) clearProceduralDuplicatePreview();
  hideProceduralDuplicateArcPreview();
  deps.sculptState.proceduralDuplicateWindowSourceIds = [];
  deps.proceduralDuplicateStatus.textContent = "";
  if (deps.proceduralDuplicateDialog.open) deps.proceduralDuplicateDialog.close();
}

function openProceduralDuplicateDialog() {
  const sources = selectedProceduralDuplicateSources();
  if (sources.length !== 2) {
    deps.placementStatus.textContent = "Duplicate Procedural requires exactly two selected strand curves.";
    return false;
  }
  deps.sculptState.proceduralDuplicateWindowSourceIds = sources.map((source) => source.id);
  deps.proceduralDuplicateCountInput.value = "1";
  deps.proceduralDuplicateStatus.textContent = "";
  updateProceduralDuplicateSpacingNote();
  if (!deps.proceduralDuplicateDialog.open) deps.proceduralDuplicateDialog.show();
  rebuildProceduralDuplicatePreview();
  deps.proceduralDuplicateCountInput.focus();
  deps.proceduralDuplicateCountInput.select();
  return true;
}

function proceduralDuplicateCopySnapshot(sourceSnapshot, duplicateId, name) {
  return {
    ...sourceSnapshot,
    id: duplicateId,
    name,
    mirrorPartnerId: null,
    clumpId: null,
    clumpName: null,
    clumpGuide: false,
    clumpGuideId: null,
    clumpRestPoints: null,
    clumpGuideRestPoints: null,
    clumpRestTwists: null,
    clumpGuideRestTwists: null,
    clumpRestScales: null,
    clumpGuideRestScales: null,
    curveLatticeBinding: null,
    groupLatticeBasePoints: null
  };
}

function proceduralDuplicateHeadCenter() {
  const meshes = deps.scalpBuilder.scalpBuilderHeadMeshes().filter((mesh) => mesh.visible !== false);
  if (!meshes.length) return null;
  meshes.forEach((mesh) => mesh.updateMatrixWorld(true));
  const bounds = meshes.reduce(
    (box, mesh) => box.expandByObject(mesh, true),
    new THREE.Box3()
  );
  return bounds.isEmpty() ? null : bounds.getCenter(new THREE.Vector3());
}

function hideProceduralDuplicateArcPreview() {
  deps.proceduralDuplicateCirclePreview.visible = false;
  deps.proceduralDuplicateArcPreview.visible = false;
  deps.proceduralDuplicateArcMarker.visible = false;
}

function proceduralDuplicateReferencePoints(procedural) {
  const [first, second] = procedural?.sources || [];
  if (!first?.points?.length || !second?.points?.length) return null;
  return lowestSharedHorizontalPolylinePointData(first.points, second.points)?.intersections || null;
}

function updateProceduralDuplicateArcPreview(procedural) {
  const references = proceduralDuplicateReferencePoints(procedural);
  const center = proceduralDuplicateHeadCenter();
  if (!references || !center) {
    hideProceduralDuplicateArcPreview();
    return;
  }
  const circle = horizontalCircleThroughPointData(references[0], references[1], center);
  const points = Array.from({ length: 49 }, (_, index) => horizontalCirclePointData(
    circle,
    index / 48
  )).map((point) => new THREE.Vector3(point.x, point.y, point.z));
  const circlePoints = Array.from({ length: 96 }, (_, index) => {
    const angle = index / 96 * Math.PI * 2;
    return new THREE.Vector3(
      circle.center.x + Math.cos(angle) * circle.radius,
      circle.firstY,
      circle.center.z + Math.sin(angle) * circle.radius
    );
  });
  deps.proceduralDuplicateCirclePreview.geometry.dispose();
  deps.proceduralDuplicateCirclePreview.geometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
  deps.proceduralDuplicateCirclePreview.visible = true;
  deps.proceduralDuplicateArcPreview.geometry.dispose();
  deps.proceduralDuplicateArcPreview.geometry = new THREE.BufferGeometry().setFromPoints(points);
  deps.proceduralDuplicateArcPreview.visible = true;
  const markerIndex = Math.round(
    THREE.MathUtils.clamp(Number(procedural.blendAmount ?? 0), 0, 1) * (points.length - 1)
  );
  deps.proceduralDuplicateArcMarker.position.copy(points[markerIndex]);
  deps.proceduralDuplicateArcMarker.visible = true;
}

function applyProceduralDuplicateBlend(lock, procedural, placedRoot, explicitBlend = null) {
  const [first, second] = procedural.sources;
  const headCenter = proceduralDuplicateHeadCenter();
  const blend = Number.isFinite(explicitBlend)
    ? THREE.MathUtils.clamp(explicitBlend, 0, 1)
    : headCenter
      ? surfaceArcBlendAmount(placedRoot, first.points[0], second.points[0], headCenter)
      : proximityCurveBlendAmount(placedRoot, first.points[0], second.points[0]);
  const blendedSourceNormal = blendDirectionPointData(
    first.rootSurfaceNormal,
    second.rootSurfaceNormal,
    blend
  );
  const pointCount = Math.max(first.points.length, second.points.length);
  const cylindricalPoints = headCenter
    ? blendCylindricalPolylinePointData(
      first.points,
      second.points,
      headCenter,
      blend,
      pointCount
    )
    : null;
  if (cylindricalPoints) {
    const rootCorrection = placedRoot.clone().sub(new THREE.Vector3(
      cylindricalPoints[0].x,
      cylindricalPoints[0].y,
      cylindricalPoints[0].z
    ));
    const lastPointIndex = Math.max(1, cylindricalPoints.length - 1);
    const automaticRootBlendEnd = Math.min(1, 2 / lastPointIndex);
    lock.points = cylindricalPoints.map((point, index) => {
      const correctionWeight = rootCorrectionFalloff(
        index / lastPointIndex,
        automaticRootBlendEnd
      );
      return new THREE.Vector3(
        point.x + rootCorrection.x * correctionWeight,
        point.y + rootCorrection.y * correctionWeight,
        point.z + rootCorrection.z * correctionWeight
      );
    });
    const sourcesAttached = first.rootAttachmentEnabled !== false
      && second.rootAttachmentEnabled !== false;
    const secondPointOutwardDistance = THREE.MathUtils.clamp(
      Number(procedural.secondPointOutward) || 0,
      0,
      1
    ) * ROOT_SCALP_OFFSET_DISTANCE;
    const secondPointTowardRoot = THREE.MathUtils.clamp(
      Number(procedural.secondPointTowardRoot) || 0,
      0,
      0.95
    );
    if (lock.points[1] && secondPointTowardRoot > 0) {
      lock.points[1].lerp(lock.points[0], secondPointTowardRoot);
    }
    let secondPointSurfaceNormal = null;
    if (sourcesAttached) {
      const bridgePointCount = Math.min(2, lock.points.length - 2);
      const minimumSurfaceOffset = Math.max(
        0.003,
        deps.scalpBuilder.rootScalpOffsetDistance(lock.rootScalpOffset)
          + deps.layerOffsetForLock(lock) * deps.layerRootOffsetFactor(lock.hairLayer)
      );
      for (let index = 1; index <= bridgePointCount; index += 1) {
        const surface = deps.scalpBuilder.closestPointOnActiveScalp(lock.points[index], null);
        if (!surface?.point || !surface?.normal) continue;
        const normal = surface.normal.clone().normalize();
        if (index === 1) secondPointSurfaceNormal = normal;
        const signedDistance = lock.points[index].clone().sub(surface.point).dot(normal);
        if (signedDistance < minimumSurfaceOffset) {
          lock.points[index].copy(surface.point).addScaledVector(normal, minimumSurfaceOffset);
        }
      }
    }
    if (lock.points[1] && secondPointOutwardDistance > 0) {
      const outwardNormal = secondPointSurfaceNormal || new THREE.Vector3(
        blendedSourceNormal.x,
        blendedSourceNormal.y,
        blendedSourceNormal.z
      ).normalize();
      lock.points[1].addScaledVector(outwardNormal, secondPointOutwardDistance);
    }
  } else {
    const relativePoints = blendSurfaceOrientedPolylinePointData(
      first.points,
      second.points,
      first.rootSurfaceNormal,
      second.rootSurfaceNormal,
      blendedSourceNormal,
      blend,
      pointCount
    );
    lock.points = relativePoints.map((point) => new THREE.Vector3(
      placedRoot.x + point.x,
      placedRoot.y + point.y,
      placedRoot.z + point.z
    ));
  }
  lock.pointWidths = blendSampleArrays(first.pointWidths, second.pointWidths, blend, pointCount, 1);
  lock.pointTwists = blendSampleArrays(first.pointTwists, second.pointTwists, blend, pointCount, 0);
  lock.pointScales = Array.from({ length: pointCount }, (_, index) => {
    const t = pointCount === 1 ? 0 : index / (pointCount - 1);
    return {
      x: THREE.MathUtils.lerp(
        sampleArray(first.pointScales?.map((scale) => scale.x), t, 1),
        sampleArray(second.pointScales?.map((scale) => scale.x), t, 1),
        blend
      ),
      z: THREE.MathUtils.lerp(
        sampleArray(first.pointScales?.map((scale) => scale.z), t, 1),
        sampleArray(second.pointScales?.map((scale) => scale.z), t, 1),
        blend
      )
    };
  });
  lock.pointSurfaceNormals = [];
  lock.taperCurve = blendTaperCurves(first.taperCurve, second.taperCurve, blend);
  lock.depthCurve = blendTaperCurves(first.depthCurve, second.depthCurve, blend);
  lock.taperCurveSecondary = blendTaperCurves(first.taperCurveSecondary, second.taperCurveSecondary, blend);
  lock.depthCurveSecondary = blendTaperCurves(first.depthCurveSecondary, second.depthCurveSecondary, blend);
  lock.twistCurve = blendEnvelopeCurves(
    first.twistCurve,
    second.twistCurve,
    blend,
    DEFAULT_TWIST_CURVE,
    -TWIST_CURVE_VALUE_MAX,
    TWIST_CURVE_VALUE_MAX
  );
  [
    "baseWidth",
    "depth",
    "widthScale",
    "depthScale",
    "strandRotation",
    "twist",
    "profileOffset",
    "curlCount",
    "curlDisplacement",
    "surfaceNormalInfluence"
  ].forEach((key) => {
    lock[key] = THREE.MathUtils.lerp(Number(first[key] ?? lock[key] ?? 0), Number(second[key] ?? lock[key] ?? 0), blend);
  });
  lock.width = Math.max(0.04, lock.baseWidth * (
    lock.pointWidths.reduce((sum, value) => sum + value, 0) / lock.pointWidths.length
  ));
  lock.asymmetricWidthCurve = Boolean(first.asymmetricWidthCurve || second.asymmetricWidthCurve);
  lock.asymmetricDepthCurve = Boolean(first.asymmetricDepthCurve || second.asymmetricDepthCurve);
  lock.centerAsymmetricProfile = blend < 0.5
    ? Boolean(first.centerAsymmetricProfile)
    : Boolean(second.centerAsymmetricProfile);
  procedural.blendAmount = blend;
}

function buildEvenlySpacedProceduralDuplicates(sources, count, undoState) {
  const amounts = evenlySpacedInteriorAmounts(count, 32);
  const sourceSnapshots = proceduralDuplicateSourceSnapshots(sources, undoState);
  if (sourceSnapshots.length !== 2) {
    deps.proceduralDuplicateStatus.textContent = "The selected strands could not be duplicated.";
    return [];
  }
  const [first, second] = sourceSnapshots;
  const headCenter = proceduralDuplicateHeadCenter();
  const rootSink = THREE.MathUtils.clamp(Number(deps.proceduralDuplicateRootSinkInput.value) || 0, 0, 1);
  const secondPointOutward = THREE.MathUtils.clamp(
    Number(deps.proceduralDuplicateSecondPointOutwardInput.value) || 0,
    0,
    1
  );
  const secondPointTowardRoot = THREE.MathUtils.clamp(
    Number(deps.proceduralDuplicateSecondPointTowardRootInput.value) || 0,
    0,
    0.95
  );
  const arcPoints = headCenter
    ? surfaceArcPolylinePointData(
      first.points[0],
      second.points[0],
      headCenter,
      count + 1
    ).slice(1, -1)
    : amounts.map((amount) => ({
      x: THREE.MathUtils.lerp(first.points[0].x, second.points[0].x, amount),
      y: THREE.MathUtils.lerp(first.points[0].y, second.points[0].y, amount),
      z: THREE.MathUtils.lerp(first.points[0].z, second.points[0].z, amount)
    }));
  const createdIds = [];
  amounts.forEach((amount, index) => {
    const duplicateId = crypto.randomUUID();
    deps.restoreLock(proceduralDuplicateCopySnapshot(
      first,
      duplicateId,
      `${sources[0].name} Procedural ${index + 1}`
    ));
    const duplicate = deps.locks.find((lock) => lock.id === duplicateId);
    if (!duplicate) return;
    duplicate.rootScalpOffset = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(
        Number(first.rootScalpOffset ?? duplicate.rootScalpOffset ?? 0),
        Number(second.rootScalpOffset ?? duplicate.rootScalpOffset ?? 0),
        amount
      ) - rootSink,
      -1,
      1
    );
    const arcPointData = arcPoints[index];
    const arcRoot = new THREE.Vector3(arcPointData.x, arcPointData.y, arcPointData.z);
    const sourceNormalData = blendDirectionPointData(first.rootSurfaceNormal, second.rootSurfaceNormal, amount);
    const sourceNormal = new THREE.Vector3(
      sourceNormalData.x,
      sourceNormalData.y,
      sourceNormalData.z
    ).normalize();
    const sourcesAttached = first.rootAttachmentEnabled !== false && second.rootAttachmentEnabled !== false;
    const surface = sourcesAttached ? deps.scalpBuilder.closestPointOnActiveScalp(arcRoot, null) : null;
    const surfaceNormal = surface?.normal?.clone().normalize() || sourceNormal;
    const surfacePoint = surface?.point?.clone() || arcRoot.clone();
    const placedRoot = surface
      ? surfacePoint.clone().addScaledVector(
        surfaceNormal,
        deps.scalpBuilder.rootScalpOffsetDistance(duplicate.rootScalpOffset)
          + deps.layerOffsetForLock(duplicate) * deps.layerRootOffsetFactor(duplicate.hairLayer)
      )
      : arcRoot;
    const procedural = {
      sources: sourceSnapshots,
      sourceIds: sources.map((source) => source.id),
      sourceNames: sources.map((source) => source.name),
      blendAmount: amount,
      secondPointOutward,
      secondPointTowardRoot
    };
    applyProceduralDuplicateBlend(duplicate, procedural, placedRoot, amount);
    duplicate.scalpRegion = amount < 0.5 ? sources[0].scalpRegion : sources[1].scalpRegion;
    duplicate.rootSurfacePoint = surfacePoint;
    duplicate.rootSurfaceNormal = surfaceNormal;
    duplicate.rootAttachmentEnabled = Boolean(surface);
    duplicate.rootAttachment = surface ? deps.createRootAttachment(duplicate, surfacePoint) : null;
    deps.syncLockFromCurve(duplicate);
    deps.updateLockGeometry(duplicate, { defer: true });
    const mirrored = deps.createMirrorPartnerForNewLock(duplicate);
    duplicate.proceduralDuplicatePreview = true;
    duplicate.mesh.raycast = () => {};
    createdIds.push(duplicate.id);
    if (mirrored) {
      mirrored.proceduralDuplicatePreview = true;
      mirrored.mesh.raycast = () => {};
      createdIds.push(mirrored.id);
    }
  });
  deps.flushPendingLockGeometryUpdates();
  deps.renderLockList();
  deps.updateCount();
  return createdIds;
}

function rebuildProceduralDuplicatePreview({ updateSources = false } = {}) {
  if (!deps.proceduralDuplicateDialog.open || deps.sculptState.rebuildingProceduralDuplicatePreview) return false;
  deps.sculptState.rebuildingProceduralDuplicatePreview = true;
  try {
    clearProceduralDuplicatePreview();
    if (updateSources) {
      const selectedSources = selectedProceduralDuplicateSources();
      deps.sculptState.proceduralDuplicateWindowSourceIds = selectedSources.map((source) => source.id);
    }
    const sources = deps.sculptState.proceduralDuplicateWindowSourceIds
      .map((id) => deps.locks.find((lock) => lock.id === id))
      .filter(proceduralDuplicateEligibleLock);
    if (sources.length !== 2) {
      deps.proceduralDuplicateStatus.textContent = "Select exactly two strand curves to update the live preview.";
      return false;
    }
    const count = THREE.MathUtils.clamp(Math.round(Number(deps.proceduralDuplicateCountInput.value) || 1), 1, 32);
    const undoState = deps.snapshotState();
    const previewSources = proceduralDuplicateSourceSnapshots(sources, undoState);
    const createdIds = buildEvenlySpacedProceduralDuplicates(sources, count, undoState);
    if (!createdIds.length) {
      deps.proceduralDuplicateStatus.textContent = "No duplicate strands could be previewed.";
      return false;
    }
    deps.sculptState.proceduralDuplicatePreview = {
      undoState,
      createdIds,
      sourceIds: sources.map((source) => source.id)
    };
    updateProceduralDuplicateArcPreview({
      sources: previewSources,
      blendAmount: 0.5
    });
    deps.proceduralDuplicateStatus.textContent = "Live preview — confirm to keep these duplicates.";
    deps.placementApi.updatePlacementStatus();
    return true;
  } finally {
    deps.sculptState.rebuildingProceduralDuplicatePreview = false;
  }
}

function confirmProceduralDuplicatePreview() {
  const preview = deps.sculptState.proceduralDuplicatePreview;
  if (!preview?.createdIds?.length) {
    deps.proceduralDuplicateStatus.textContent = "There is no valid duplicate preview to confirm.";
    return false;
  }
  const createdLocks = preview.createdIds
    .map((id) => deps.locks.find((lock) => lock.id === id))
    .filter(Boolean);
  if (!createdLocks.length) return false;
  createdLocks.forEach((lock) => {
    lock.proceduralDuplicatePreview = false;
    lock.mesh.raycast = THREE.Mesh.prototype.raycast;
  });
  deps.undoHistory.push(preview.undoState);
  deps.redoHistory.clear();
  deps.updateHistoryButtons();
  deps.markProjectChangedForRecovery?.();
  deps.sculptState.proceduralDuplicatePreview = null;
  closeProceduralDuplicateDialog({ commit: true });
  deps.selectLock(createdLocks[0].id, {
    individualClumpMember: true,
    selectedIds: createdLocks.map((lock) => lock.id)
  });
  deps.placementApi.updatePlacementStatus();
  return true;
}

function updateDuplicatePlacement(event) {
  const placement = deps.sculptState.duplicatePlacement;
  if (!placement || deps.sculptState.altOrbitDrag || event.altKey) return;
  const anchorLock = deps.locks.find((item) => item.id === placement.lockId);
  if (!anchorLock?.points?.length) {
    deps.sculptState.duplicatePlacement = null;
    deps.sculptState.proceduralDuplicateModeActive = false;
    hideProceduralDuplicateArcPreview();
    deps.updateInteractionLocks();
    return;
  }
  placement.lock = anchorLock;
  const target = duplicatePlacementTarget(event, placement);
  if (!target) return;
  const anchorEntry = placement.entries.find((entry) => entry.lockId === placement.lockId);
  const sharedDelta = target.root.clone().sub(anchorEntry.startRoot);
  placement.entries.forEach((entry) => {
    const lock = deps.locks.find((item) => item.id === entry.lockId);
    if (!lock?.points?.length) return;
    const desiredRoot = entry.startRoot.clone().add(sharedDelta);
    const proceduralAnchor = Boolean(placement.procedural && entry.lockId === placement.lockId);
    const surface = target.attached && entry.sourceAttachmentEnabled
      ? proceduralAnchor
        ? { point: target.surfacePoint, normal: target.surfaceNormal }
        : deps.scalpBuilder.closestPointOnActiveScalp(desiredRoot, lock.scalpRegion || null)
      : null;
    if (proceduralAnchor && target.scalpRegion) lock.scalpRegion = target.scalpRegion;
    const surfacePoint = surface?.point?.clone() || desiredRoot.clone();
    const surfaceNormal = surface?.normal?.clone()
      || lock.rootSurfaceNormal?.clone()
      || target.surfaceNormal.clone();
    surfaceNormal.normalize();
    const placedRoot = surface
      ? surfacePoint.clone().addScaledVector(
        surfaceNormal,
        deps.scalpBuilder.rootScalpOffsetDistance(lock.rootScalpOffset)
          + deps.layerOffsetForLock(lock) * deps.layerRootOffsetFactor(lock.hairLayer)
      )
      : desiredRoot;
    const delta = placedRoot.clone().sub(lock.points[0]);
    if (placement.procedural && entry.lockId === placement.lockId) {
      applyProceduralDuplicateBlend(lock, placement.procedural, placedRoot);
    } else {
      lock.points.forEach((point) => point.add(delta));
    }
    lock.placementFrame?.root?.add(delta);
    lock.rootSurfacePoint = surfacePoint;
    lock.rootSurfaceNormal = surfaceNormal;
    lock.rootAttachmentEnabled = Boolean(surface);
    lock.rootAttachment = surface ? deps.createRootAttachment(lock, surfacePoint) : null;
    deps.syncLockFromCurve(lock);
    deps.updateLockGeometry(lock, placement.procedural ? { defer: true } : { immediate: true });
    if (placement.procedural && entry.lockId === placement.lockId) {
      deps.syncActiveMirror(lock, { deferGeometry: true });
    }
  });
  if (placement.procedural) {
    updateProceduralDuplicateArcPreview(placement.procedural);
    deps.placementApi.updatePlacementStatus();
  }
  event.preventDefault();
  event.stopImmediatePropagation();
}

function beginDuplicatePlacement(sourceOrSources) {
  if (!sourceOrSources || deps.sculptState.duplicatePlacement) return null;
  const sources = [...new Set(Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources])]
    .filter((source) => deps.locks.includes(source));
  if (!sources.length) return null;
  const undoState = deps.snapshotState();
  const duplicateIds = [];
  sources.forEach((source) => {
    const sourceSnapshot = undoState.locks.find((lock) => lock.id === source.id);
    if (!sourceSnapshot) return;
    const duplicateId = crypto.randomUUID();
    duplicateIds.push(duplicateId);
    deps.restoreLock({
      ...sourceSnapshot,
      id: duplicateId,
      name: `${source.name} Copy`,
      mirrorPartnerId: null,
      clumpId: null,
      clumpName: null,
      clumpGuide: false,
      clumpGuideId: null,
      clumpRestPoints: null,
      clumpGuideRestPoints: null,
      clumpRestTwists: null,
      clumpGuideRestTwists: null,
      clumpRestScales: null,
      clumpGuideRestScales: null,
      curveLatticeBinding: null,
      groupLatticeBasePoints: null
    });
  });
  const duplicates = duplicateIds
    .map((id) => deps.locks.find((lock) => lock.id === id))
    .filter(Boolean);
  if (!duplicates.length) return null;
  const duplicate = duplicates[0];
  deps.sculptState.duplicatePlacement = {
    lockId: duplicate.id,
    lockIds: duplicates.map((lock) => lock.id),
    sourceIds: sources.map((source) => source.id),
    lock: duplicate,
    entries: duplicates.map((lock, index) => ({
      lockId: lock.id,
      startRoot: lock.points[0].clone(),
      sourceAttachmentEnabled: sources[index]?.rootAttachmentEnabled !== false
    })),
    sourceAttachmentEnabled: sources[0].rootAttachmentEnabled !== false,
    undoState,
    viewPlane: new THREE.Plane().setFromNormalAndCoplanarPoint(
      deps.viewPlaneNormal(),
      duplicate.points[0]
    )
  };
  deps.selectLock(duplicate.id, {
    individualClumpMember: true,
    selectedIds: duplicates.map((lock) => lock.id)
  });
  deps.renderLockList();
  deps.updateCount();
  deps.updateInteractionLocks();
  deps.placementApi.updatePlacementStatus();
  return duplicates.length === 1 ? duplicate : duplicates;
}

function beginProceduralDuplicatePlacement(
  sourceLocks = null,
  { cancelSelectionIds = null } = {}
) {
  const currentSelection = deps.selectedLocksInOrder();
  const sourceSelection = Array.isArray(sourceLocks) ? sourceLocks : currentSelection;
  const sources = sourceSelection.filter((lock) => (
    deps.locks.includes(lock)
    &&
    lock.points?.length >= 2
    && !["poly", "surface", "curve-surface"].includes(lock.geometryType)
  ));
  if (sources.length !== 2 || (!sourceLocks && currentSelection.length !== 2)) {
    deps.placementStatus.textContent = "Duplicate Procedural requires exactly two selected strand curves.";
    return null;
  }
  const duplicate = beginDuplicatePlacement(sources[0]);
  if (!duplicate || Array.isArray(duplicate) || !deps.sculptState.duplicatePlacement) return null;
  const sourceSnapshots = proceduralDuplicateSourceSnapshots(sources, deps.sculptState.duplicatePlacement.undoState);
  if (sourceSnapshots.length !== 2) {
    cancelDuplicatePlacement();
    return null;
  }
  duplicate.name = `${sources[0].name} Procedural Copy`;
  deps.sculptState.duplicatePlacement.sourceIds = sources.map((source) => source.id);
  deps.sculptState.duplicatePlacement.cancelSelectionIds = cancelSelectionIds || deps.sculptState.duplicatePlacement.sourceIds;
  deps.sculptState.duplicatePlacement.procedural = {
    sources: sourceSnapshots,
    sourceIds: sources.map((source) => source.id),
    sourceNames: sources.map((source) => source.name),
    blendAmount: 0
  };
  updateProceduralDuplicateArcPreview(deps.sculptState.duplicatePlacement.procedural);
  const mirrored = deps.createMirrorPartnerForNewLock(duplicate);
  if (mirrored) deps.sculptState.duplicatePlacement.lockIds.push(mirrored.id);
  deps.renderLockList();
  deps.updateCount();
  deps.placementApi.updatePlacementStatus();
  return duplicate;
}

function confirmDuplicatePlacement(event) {
  if (
    !deps.sculptState.duplicatePlacement
    || event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return false;
  updateDuplicatePlacement(event);
  const placement = deps.sculptState.duplicatePlacement;
  const { lockId, lockIds, undoState } = placement;
  deps.sculptState.duplicatePlacement = null;
  hideProceduralDuplicateArcPreview();
  deps.undoHistory.push(undoState);
  deps.redoHistory.clear();
  deps.updateHistoryButtons();
  deps.markProjectChangedForRecovery?.();
  deps.updateInteractionLocks();
  deps.selectLock(lockId, {
    individualClumpMember: true,
    selectedIds: placement.procedural ? [lockId] : lockIds
  });
  deps.placementApi.updatePlacementStatus();
  if (placement.procedural && deps.sculptState.proceduralDuplicateModeActive) {
    const sources = placement.procedural.sourceIds
      .map((id) => deps.locks.find((lock) => lock.id === id))
      .filter(Boolean);
    const nextDuplicate = beginProceduralDuplicatePlacement(sources, {
      cancelSelectionIds: [lockId]
    });
    if (!nextDuplicate) deps.sculptState.proceduralDuplicateModeActive = false;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function cancelDuplicatePlacement() {
  if (!deps.sculptState.duplicatePlacement) return false;
  const procedural = Boolean(deps.sculptState.duplicatePlacement.procedural);
  const duplicateIds = deps.sculptState.duplicatePlacement.lockIds || [deps.sculptState.duplicatePlacement.lockId];
  const selectionIds = deps.sculptState.duplicatePlacement.cancelSelectionIds
    || deps.sculptState.duplicatePlacement.sourceIds
    || [];
  const duplicates = duplicateIds
    .map((id) => deps.locks.find((lock) => lock.id === id))
    .filter(Boolean);
  deps.sculptState.duplicatePlacement = null;
  if (procedural) deps.sculptState.proceduralDuplicateModeActive = false;
  hideProceduralDuplicateArcPreview();
  if (duplicates.length) deps.deleteLocks(duplicates);
  const source = deps.locks.find((lock) => selectionIds.includes(lock.id));
  if (source) {
    deps.selectLock(source.id, {
      individualClumpMember: true,
      selectedIds: selectionIds
    });
  }
  deps.updateInteractionLocks();
  deps.placementApi.updatePlacementStatus();
  return true;
}

  return {
    duplicatePlacementTarget,
    proceduralDuplicateSourceSnapshots,
    proceduralDuplicateEligibleLock,
    selectedProceduralDuplicateSources,
    updateProceduralDuplicateSpacingNote,
    clearProceduralDuplicatePreview,
    closeProceduralDuplicateDialog,
    openProceduralDuplicateDialog,
    proceduralDuplicateCopySnapshot,
    proceduralDuplicateHeadCenter,
    hideProceduralDuplicateArcPreview,
    proceduralDuplicateReferencePoints,
    updateProceduralDuplicateArcPreview,
    applyProceduralDuplicateBlend,
    buildEvenlySpacedProceduralDuplicates,
    rebuildProceduralDuplicatePreview,
    confirmProceduralDuplicatePreview,
    updateDuplicatePlacement,
    beginDuplicatePlacement,
    beginProceduralDuplicatePlacement,
    confirmDuplicatePlacement,
    cancelDuplicatePlacement
  };
}
