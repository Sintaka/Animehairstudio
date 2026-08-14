// sculpt-geometry.js - Sculpt brush geometry: debug curves, geometry rebuild scheduling,
// width/cursor/viability-plane/sampling/deformation (refactor 3d batch G6).
// Extracted from app.js; coupling injected via createSculptGeometryApi(deps).
import * as THREE from "three";
import {
  cameraFacingPlaneNormal,
  inflateSculptPointScale,
  pointInCameraFacingHalfSpace,
  proportionalSculptWeights,
  sculptBrushWeight,
  smoothSculptPointDeltas,
  smoothSculptTwistDeltas
} from "../sculpt/sculpt-brush.js?v=20260814-12";
import { sampleArray } from "./curve-math.js?v=20260813-3";
import {
  DEFAULT_SURFACE_LATTICE_COLUMNS,
  DEFAULT_SURFACE_LATTICE_ROWS,
  normalizeSurfaceLatticeCount,
  surfaceLatticePointIndex
} from "./surface-lattice.js?v=20260814-12";

export function createSculptGeometryApi(deps) {
  // deps: store .state proxies (sculptState/sel) + shared objects (renderer/camera/locks/
  //   undoHistory/sculptBrushViabilityPlane/sculptBrushStrengthByTool/sculptBrushPreserveTipsByTool) +
  //   DOM elements (sculptBrushCursor/sculptBrushFalloffRing/sculptBrushStrengthInput/
  //   sculptBrushStrengthValue/sculptBrushRadiusInput/sculptBrushRadiusValue/sculptBrushFalloffInput/
  //   sculptBrushFalloffValue/sculptBrushPlanePositionInput/sculptBrushPlanePositionValue/
  //   sculptBrushShowClippingPlaneInput/sculptBrushShowCurvesInput/sculptPreserveTipsInput/
  //   proportionalRadiusInput/proportionalFalloffInput) + app.js helper functions (24 incl.
  //   applySubBoneBrushSample (B2)/effectiveSculptBrushTool/sculptBrushToolActive/
  //   sculptBrushSelectionAllows/mirrorPartnerFor/mirroredVector/syncLockFromCurve/
  //   updateCurveObjects/rebuildLockGeometry/flushPendingLockGeometryUpdates/undoHistory/
  //   full list: devlog/in-progress/g6-sculpt-geometry-refactor-map.md section 3.
  // Batch-fill point in app.js: after the G4 curveSurfaceCreateDeps batch (all deps defined).

const sculptBrushCurveClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
const sculptBrushCurveClippingPlanes = [sculptBrushCurveClippingPlane];

function setSculptBrushMaterialClipping(material, enabled) {
  const active = material.clippingPlanes === sculptBrushCurveClippingPlanes;
  if (active === enabled) return;
  material.clippingPlanes = enabled ? sculptBrushCurveClippingPlanes : null;
  material.needsUpdate = true;
}

function sculptBrushDebugCurveVisible(lock) {
  return Boolean(
    deps.sculptBrushToolActive()
    && deps.sculptBrushShowCurvesInput.checked
    && deps.sculptState.viewportEditMode === "strand"
    && !lock.locked
    && sculptBrushEditableLock(lock)
    && deps.strandVisibleForDisplay(lock)
    && sculptBrushLockViable(lock)
  );
}

function refreshSculptBrushDebugView() {
  if (!deps.sculptBrushToolActive()) return;
  deps.locks.forEach((lock) => deps.updateCurveObjects(lock, { visible: lock.id === deps.sel.selectedId }));
}

function refreshSculptBrushDebugAfterStateRestore() {
  if (!deps.sculptBrushToolActive()) return;
  updateSculptBrushViabilityPlane();
  refreshSculptBrushDebugView();
}

function updateSculptBrushDebugCurve(lock) {
  if (!sculptBrushDebugCurveVisible(lock) || !lock.curveObjects) return;
  const { group, line, handles } = lock.curveObjects;
  line.geometry.dispose();
  line.geometry = new THREE.BufferGeometry().setFromPoints(
    new THREE.CatmullRomCurve3(lock.points).getPoints(40)
  );
  handles.forEach((handle, index) => {
    handle.visible = Boolean(lock.points[index]);
    if (lock.points[index]) handle.position.copy(lock.points[index]);
  });
  group.visible = true;
}

const sculptBrushGeometryUpdates = new Set();
const SCULPT_BRUSH_GEOMETRY_FRAME_BUDGET_MS = 6;

function scheduleSculptBrushGeometryUpdates() {
  if (deps.sculptState.sculptBrushGeometryFrame !== null || !sculptBrushGeometryUpdates.size) return;
  deps.sculptState.sculptBrushGeometryFrame = requestAnimationFrame(() => {
    deps.sculptState.sculptBrushGeometryFrame = null;
    flushSculptBrushGeometryUpdates();
  });
}

function queueSculptBrushGeometryUpdate(lock) {
  if (!lock?.mesh) return;
  sculptBrushGeometryUpdates.add(lock);
  scheduleSculptBrushGeometryUpdates();
}

function flushSculptBrushGeometryUpdates({ all = false } = {}) {
  if (deps.sculptState.sculptBrushGeometryFrame !== null) {
    cancelAnimationFrame(deps.sculptState.sculptBrushGeometryFrame);
    deps.sculptState.sculptBrushGeometryFrame = null;
  }
  const startedAt = performance.now();
  let rebuiltCount = 0;
  for (const lock of sculptBrushGeometryUpdates) {
    sculptBrushGeometryUpdates.delete(lock);
    if (lock?.mesh && deps.locks.includes(lock)) {
      deps.rebuildLockGeometry(lock);
      rebuiltCount += 1;
    }
    if (
      !all
      && rebuiltCount > 0
      && performance.now() - startedAt >= SCULPT_BRUSH_GEOMETRY_FRAME_BUDGET_MS
    ) break;
  }
  if (sculptBrushGeometryUpdates.size) scheduleSculptBrushGeometryUpdates();
}

function editableStrandWidth(lock) {
  if (!lock) return 0;
  if (deps.isPanelGeometry(lock)) return Math.max(0.08, Number(lock.width ?? 0.62));
  if (lock.geometryType === "braid") {
    return Math.max(0.05, Number(lock.braidWidth ?? 0.34) * Number(lock.widthScale ?? 1));
  }
  return Math.max(
    0.01,
    Number(lock.baseWidth ?? lock.width ?? 0.16) * Number(lock.widthScale ?? 1)
  );
}

function editableStrandWidthBounds(lock) {
  if (deps.isPanelGeometry(lock)) return { minimum: 0.08, maximum: 2.5 };
  if (lock?.geometryType === "braid") return { minimum: 0.05, maximum: 2.5 };
  return { minimum: 0.01, maximum: 3 };
}

function applyEditableStrandWidth(lock, width, drag = deps.sculptState.strandWidthEdgeDrag) {
  if (!lock) return;
  const bounds = editableStrandWidthBounds(lock);
  const nextWidth = THREE.MathUtils.clamp(Number(width), bounds.minimum, bounds.maximum);
  if (lock.geometryType === "surface" && drag?.startPoints?.length === lock.points.length) {
    const ratio = nextWidth / Math.max(0.0001, drag.startWidth);
    const columns = normalizeSurfaceLatticeCount(lock.surfaceColumns, DEFAULT_SURFACE_LATTICE_COLUMNS);
    const rows = normalizeSurfaceLatticeCount(lock.surfaceRows, DEFAULT_SURFACE_LATTICE_ROWS);
    const centerColumn = Math.floor(columns / 2);
    for (let row = 0; row < rows; row += 1) {
      const centerIndex = surfaceLatticePointIndex(row, centerColumn, columns, rows);
      const center = drag.startPoints[centerIndex];
      for (let column = 0; column < columns; column += 1) {
        const pointIndex = surfaceLatticePointIndex(row, column, columns, rows);
        lock.points[pointIndex].copy(center).add(
          drag.startPoints[pointIndex].clone().sub(center).multiplyScalar(ratio)
        );
      }
    }
    lock.width = nextWidth;
    lock.baseWidth = nextWidth;
  } else if (deps.isPanelGeometry(lock)) {
    lock.width = nextWidth;
    lock.baseWidth = nextWidth;
  } else if (lock.geometryType === "braid") {
    lock.braidWidth = nextWidth;
    lock.width = nextWidth;
    lock.baseWidth = nextWidth;
    lock.widthScale = 1;
  } else {
    lock.width = nextWidth;
    lock.baseWidth = nextWidth;
    lock.widthScale = 1;
  }
}

function viewportPixelPoint(worldPoint, rect) {
  const projected = worldPoint.clone().project(deps.camera);
  return new THREE.Vector2(
    (projected.x * 0.5 + 0.5) * rect.width,
    (-projected.y * 0.5 + 0.5) * rect.height
  );
}

function syncSculptBrushControls() {
  const strength = Number(deps.sculptBrushStrengthInput.value);
  const radius = Number(deps.sculptBrushRadiusInput.value);
  const falloff = Number(deps.sculptBrushFalloffInput.value);
  deps.sculptBrushStrengthValue.textContent = strength.toFixed(2);
  deps.sculptBrushRadiusValue.textContent = `${Math.round(radius)} px`;
  deps.sculptBrushFalloffValue.textContent = falloff.toFixed(2);
  deps.sculptBrushCursor.style.width = `${radius * 2}px`;
  deps.sculptBrushCursor.style.height = `${radius * 2}px`;
  const innerDiameter = Math.max(2, radius * 2 * (1 - falloff));
  deps.sculptBrushFalloffRing.style.width = `${innerDiameter}px`;
  deps.sculptBrushFalloffRing.style.height = `${innerDiameter}px`;
  deps.sculptBrushPlanePositionValue.textContent = Number(deps.sculptBrushPlanePositionInput.value).toFixed(2);
}

function syncSculptBrushStrengthForActiveTool() {
  const tool = deps.effectiveSculptBrushTool();
  if (deps.sculptBrushStrengthByTool[tool] !== undefined) {
    deps.sculptBrushStrengthInput.value = String(deps.sculptBrushStrengthByTool[tool]);
  }
  syncSculptBrushControls();
}

function updateActiveSculptBrushStrength() {
  const tool = deps.effectiveSculptBrushTool();
  if (deps.sculptBrushStrengthByTool[tool] !== undefined) {
    deps.sculptBrushStrengthByTool[tool] = Number(deps.sculptBrushStrengthInput.value);
  }
  syncSculptBrushControls();
}

function updateActiveSculptBrushPreserveTips() {
  if (deps.sculptBrushPreserveTipsByTool[deps.sel.activeTool] !== undefined) {
    deps.sculptBrushPreserveTipsByTool[deps.sel.activeTool] = deps.sculptPreserveTipsInput.checked;
  }
}

function sculptBrushPlaneOffset() {
  return (Number(deps.sculptBrushPlanePositionInput.value) - 0.5) * 4;
}

function setSculptBrushCursorVisible(visible) {
  const wasVisible = !deps.sculptBrushCursor.classList.contains("hidden");
  deps.sculptBrushCursor.classList.toggle("hidden", !visible);
  if (visible) deps.renderer.domElement.style.cursor = "none";
  else if (wasVisible && deps.renderer.domElement.style.cursor === "none") deps.renderer.domElement.style.cursor = "";
}

function updateSculptBrushCursor(event) {
  if (!deps.sculptBrushToolActive() || deps.sculptState.viewportEditMode !== "strand" || deps.sculptState.altOrbitDrag) {
    setSculptBrushCursorVisible(false);
    return;
  }
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const anchoredResize = deps.sculptState.brushSizeDrag?.input === deps.sculptBrushRadiusInput;
  const clientX = anchoredResize ? deps.sculptState.brushSizeDrag.startX : event.clientX;
  const clientY = anchoredResize ? deps.sculptState.brushSizeDrag.startY : event.clientY;
  const inside = clientX >= rect.left
    && clientX <= rect.right
    && clientY >= rect.top
    && clientY <= rect.bottom;
  if (!inside) {
    setSculptBrushCursorVisible(false);
    return;
  }
  deps.sculptBrushCursor.style.left = `${clientX - rect.left}px`;
  deps.sculptBrushCursor.style.top = `${clientY - rect.top}px`;
  setSculptBrushCursorVisible(true);
}

function sculptBrushMirrorUpdateLock(lock) {
  return Boolean(
    lock?.points?.length > 1
    && !["poly", "surface", "curve-surface"].includes(lock.geometryType)
  );
}

function sculptBrushEditableLock(lock) {
  return Boolean(
    sculptBrushMirrorUpdateLock(lock)
    && !lock.locked
    && deps.sculptBrushSelectionAllows(lock)
  );
}

const sculptBrushCameraFacingNormal = new THREE.Vector3();

function sculptBrushWorkingPlaneNormal() {
  deps.camera.getWorldDirection(sculptBrushCameraFacingNormal);
  sculptBrushCameraFacingNormal.negate();
  return cameraFacingPlaneNormal(sculptBrushCameraFacingNormal);
}

function sculptBrushLockViable(
  lock,
  planeNormal = sculptBrushWorkingPlaneNormal(),
  planeOffset = sculptBrushPlaneOffset()
) {
  return Boolean(
    lock?.points?.length
    && lock.points.some((point) => pointInCameraFacingHalfSpace(point, planeNormal, planeOffset))
  );
}

function sculptBrushUnits() {
  const units = [];
  const visited = new Set();
  const planeNormal = sculptBrushWorkingPlaneNormal();
  const planeOffset = sculptBrushPlaneOffset();
  deps.locks.forEach((lock) => {
    if (!sculptBrushEditableLock(lock)) return;
    const partner = sculptBrushMirrorUpdateLock(deps.mirrorPartnerFor(lock))
      ? deps.mirrorPartnerFor(lock)
      : null;
    const source = partner && String(partner.id).localeCompare(String(lock.id)) < 0
      ? partner
      : lock;
    if (visited.has(source.id)) return;
    const sourcePartner = deps.mirrorPartnerFor(source);
    const sourceVisible = sculptBrushEditableLock(source)
      && deps.strandVisibleForDisplay(source)
      && sculptBrushLockViable(source, planeNormal, planeOffset);
    const partnerVisible = sculptBrushEditableLock(sourcePartner)
      && deps.strandVisibleForDisplay(sourcePartner)
      && sculptBrushLockViable(sourcePartner, planeNormal, planeOffset);
    if (!sourceVisible && !partnerVisible) return;
    visited.add(source.id);
    units.push({
      source,
      partner: sculptBrushMirrorUpdateLock(sourcePartner) ? sourcePartner : null,
      sourceVisible,
      partnerVisible
    });
  });
  return units;
}

const sculptBrushPlaneNormal = new THREE.Vector3();
const sculptBrushPlaneRight = new THREE.Vector3();
const sculptBrushPlaneDepth = new THREE.Vector3();
const sculptBrushPlaneBasis = new THREE.Matrix4();

function updateSculptBrushViabilityPlane() {
  const visible = deps.sculptBrushToolActive() && deps.sculptState.viewportEditMode === "strand";
  deps.sculptBrushViabilityPlane.visible = visible && deps.sculptBrushShowClippingPlaneInput.checked;
  if (!visible) {
    deps.sculptState.sculptBrushViableLockIds = new Set();
    return;
  }
  const normal = sculptBrushWorkingPlaneNormal();
  const planeOffset = sculptBrushPlaneOffset();
  sculptBrushPlaneNormal.set(normal.x, normal.y, normal.z);
  sculptBrushCurveClippingPlane.normal.copy(sculptBrushPlaneNormal);
  sculptBrushCurveClippingPlane.constant = -planeOffset;
  sculptBrushPlaneRight.set(1, 0, 0).applyQuaternion(deps.camera.quaternion);
  sculptBrushPlaneRight.addScaledVector(
    sculptBrushPlaneNormal,
    -sculptBrushPlaneRight.dot(sculptBrushPlaneNormal)
  ).normalize();
  sculptBrushPlaneDepth.crossVectors(
    sculptBrushPlaneRight,
    sculptBrushPlaneNormal
  ).normalize();
  sculptBrushPlaneBasis.makeBasis(
    sculptBrushPlaneRight,
    sculptBrushPlaneNormal,
    sculptBrushPlaneDepth
  );
  deps.sculptBrushViabilityPlane.position.copy(sculptBrushPlaneNormal).multiplyScalar(planeOffset);
  deps.sculptBrushViabilityPlane.quaternion.setFromRotationMatrix(sculptBrushPlaneBasis);
  const nextViableLockIds = new Set(deps.locks
    .filter((lock) => (
      sculptBrushEditableLock(lock)
      && deps.strandVisibleForDisplay(lock)
      && sculptBrushLockViable(lock, normal, planeOffset)
    ))
    .map((lock) => lock.id)
  );
  const changedLockIds = new Set([
    ...[...nextViableLockIds].filter((id) => !deps.sculptState.sculptBrushViableLockIds.has(id)),
    ...[...deps.sculptState.sculptBrushViableLockIds].filter((id) => !nextViableLockIds.has(id))
  ]);
  deps.sculptState.sculptBrushViableLockIds = nextViableLockIds;
  if (!deps.sculptBrushShowCurvesInput.checked) return;
  if (!changedLockIds.size) return;
  deps.locks.forEach((lock) => {
    if (changedLockIds.has(lock.id)) {
      deps.updateCurveObjects(lock, { visible: lock.id === deps.sel.selectedId });
    }
  });
}

function sculptBrushPointWeight(point, cursor, rect, radius, falloff) {
  const projected = point.clone().project(deps.camera);
  if (projected.z < -1 || projected.z > 1) return 0;
  const pixel = new THREE.Vector2(
    (projected.x * 0.5 + 0.5) * rect.width,
    (-projected.y * 0.5 + 0.5) * rect.height
  );
  return sculptBrushWeight(pixel.distanceTo(cursor), radius, falloff);
}

function sculptBrushWorldDelta(point, deltaX, deltaY, rect) {
  const projected = point.clone().project(deps.camera);
  return new THREE.Vector3(
    projected.x + deltaX * 2 / Math.max(1, rect.width),
    projected.y - deltaY * 2 / Math.max(1, rect.height),
    projected.z
  ).unproject(deps.camera).sub(point);
}

function syncSculptBrushMirrorPoints(source, partner) {
  if (!partner) return;
  if (partner.points.length !== source.points.length) {
    partner.points = source.points.map(deps.mirroredVector);
  } else {
    source.points.forEach((point, index) => {
      partner.points[index].set(-point.x, point.y, point.z);
    });
  }
  if (source.groupLatticeBasePoints) {
    if (partner.groupLatticeBasePoints?.length !== source.groupLatticeBasePoints.length) {
      partner.groupLatticeBasePoints = source.groupLatticeBasePoints.map(deps.mirroredVector);
    } else {
      source.groupLatticeBasePoints.forEach((point, index) => {
        partner.groupLatticeBasePoints[index].set(-point.x, point.y, point.z);
      });
    }
  } else {
    partner.groupLatticeBasePoints = null;
  }
  partner.pointScales = source.pointScales.map((scale) => ({ ...scale }));
  partner.pointWidths = [...source.pointWidths];
  partner.width = source.width;
  deps.syncLockFromCurve(partner);
}

function captureSculptMoveStrokeInfluence(
  units,
  clientX,
  clientY,
  planeNormal,
  planeOffset
) {
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const cursor = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
  const radius = Number(deps.sculptBrushRadiusInput.value);
  const falloff = Number(deps.sculptBrushFalloffInput.value);
  const proportionalRadius = Number(deps.proportionalRadiusInput.value);
  const proportionalFalloff = Number(deps.proportionalFalloffInput.value);
  const influenceBySourceId = new Map();
  units.forEach(({ source, partner, sourceVisible, partnerVisible }) => {
    const sourceWeights = new Array(source.points.length).fill(0);
    const partnerWeights = new Array(source.points.length).fill(0);
    for (let pointIndex = 1; pointIndex < source.points.length; pointIndex += 1) {
      const sourcePoint = source.points[pointIndex];
      const partnerPoint = partner?.points?.[pointIndex];
      if (
        sourceVisible
        && pointInCameraFacingHalfSpace(sourcePoint, planeNormal, planeOffset)
      ) {
        sourceWeights[pointIndex] = sculptBrushPointWeight(
          sourcePoint,
          cursor,
          rect,
          radius,
          falloff
        );
      }
      if (
        partnerVisible
        && partnerPoint
        && pointInCameraFacingHalfSpace(partnerPoint, planeNormal, planeOffset)
      ) {
        partnerWeights[pointIndex] = sculptBrushPointWeight(
          partnerPoint,
          cursor,
          rect,
          radius,
          falloff
        );
      }
    }
    influenceBySourceId.set(source.id, {
      sourceWeights: deps.sculptState.proportionalEditing
        ? proportionalSculptWeights(sourceWeights, proportionalRadius, proportionalFalloff)
        : sourceWeights,
      partnerWeights: deps.sculptState.proportionalEditing
        ? proportionalSculptWeights(partnerWeights, proportionalRadius, proportionalFalloff)
        : partnerWeights
    });
  });
  return influenceBySourceId;
}

function beginSculptMoveStroke(event) {
  const reverseTool = ["sculpt-slide", "sculpt-scale", "sculpt-push", "sculpt-orient"].includes(deps.sel.activeTool);
  if (
    !deps.sculptBrushToolActive()
    || deps.sculptState.brushSizeHotkeyHeld
    || deps.sculptState.viewportEditMode !== "strand"
    || event.button !== 0
    || (!reverseTool && event.ctrlKey)
    || event.altKey
    || event.metaKey
  ) return;
  const planeNormal = sculptBrushWorkingPlaneNormal();
  const planeOffset = sculptBrushPlaneOffset();
  const units = sculptBrushUnits();
  const snapshotLocks = [...new Map(units.flatMap(({ source, partner }) => (
    [source, partner].filter(Boolean).map((lock) => [lock.id, lock])
  ))).values()];
  deps.sculptState.sculptMoveStroke = {
    pointerId: event.pointerId,
    lastX: event.clientX,
    lastY: event.clientY,
    pendingX: null,
    pendingY: null,
    frameRequest: null,
    changed: false,
    undoCaptured: false,
    planeNormal,
    planeOffset,
    units,
    moveInfluence: deps.sel.activeTool === "sculpt-move"
      ? captureSculptMoveStrokeInfluence(
          units,
          event.clientX,
          event.clientY,
          planeNormal,
          planeOffset
        )
      : new Map(),
    reverse: Boolean(event.ctrlKey),
    scaleMode: deps.sel.activeTool === "sculpt-scale" ? (document.querySelector("#sculptScaleMode")?.value || "scale") : null,
    cutExtendOffset: 0,
    editedLockIds: new Set(),
    snapshots: snapshotLocks.map((lock) => ({
      lockId: lock.id,
      points: lock.points.map((point) => point.clone()),
      groupLatticeBasePoints: lock.groupLatticeBasePoints?.map((point) => point.clone()) || null,
      pointScales: lock.pointScales.map((scale) => ({ ...scale })),
      pointWidths: [...lock.pointWidths],
      width: lock.width
    })),
    originalCurves: new Map(
      deps.locks.filter(sculptBrushEditableLock)
        .filter((lock) => lock.points.length >= 2)
        .map((lock) => [lock.id, new THREE.CatmullRomCurve3(lock.points.map((point) => point.clone()))])
    )
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.updateInteractionLocks();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function applySculptMoveStrokeSample(stroke, clientX, clientY) {
  const deltaX = clientX - stroke.lastX;
  const deltaY = clientY - stroke.lastY;
  stroke.lastX = clientX;
  stroke.lastY = clientY;
  if (Math.abs(deltaX) + Math.abs(deltaY) < 0.01) return;

  // Selected sub-bone brush (masked to that sub-bone; scale centers on its exposed root).
  if (deps.applySubBoneBrushSample(stroke, clientX, clientY, deltaX, deltaY)) return;

  const rect = deps.renderer.domElement.getBoundingClientRect();
  const cursor = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
  const strength = Number(
    deps.sculptBrushStrengthByTool[deps.effectiveSculptBrushTool()]
    ?? deps.sculptBrushStrengthInput.value
  );
  const radius = Number(deps.sculptBrushRadiusInput.value);
  const falloff = Number(deps.sculptBrushFalloffInput.value);
  const smoothBrushActive = deps.effectiveSculptBrushTool() === "sculpt-smooth";
  const inflateBrushActive = deps.effectiveSculptBrushTool() === "sculpt-inflate";
  const slideBrushActive = deps.effectiveSculptBrushTool() === "sculpt-slide";
  const scaleBrushActive = deps.effectiveSculptBrushTool() === "sculpt-scale";
  const pushBrushActive = deps.effectiveSculptBrushTool() === "sculpt-push";
  const orientBrushActive = deps.effectiveSculptBrushTool() === "sculpt-orient";
  const reverse = Boolean(stroke.reverse);
  const preserveTips = Boolean(deps.sculptBrushPreserveTipsByTool[deps.sel.activeTool]);
  const fixedMoveBrushInfluence = !smoothBrushActive && !inflateBrushActive && !slideBrushActive && !scaleBrushActive && !pushBrushActive && !orientBrushActive;
  const strokeDistance = Math.hypot(deltaX, deltaY);
  const changedSources = [];

  stroke.units.forEach(({ source, partner, sourceVisible, partnerVisible }) => {
    let sourceChanged = false;
    const pointWeights = new Array(source.points.length).fill(0);
    const initialMoveInfluence = stroke.moveInfluence.get(source.id);
    const firstPointIndex = inflateBrushActive ? 0 : 1;
    for (let pointIndex = firstPointIndex; pointIndex < source.points.length; pointIndex += 1) {
      const sourcePoint = source.points[pointIndex];
      const partnerPoint = partner?.points?.[pointIndex];
      const sourceWeight = fixedMoveBrushInfluence
        ? Number(initialMoveInfluence?.sourceWeights?.[pointIndex]) || 0
        : sourceVisible
          && pointInCameraFacingHalfSpace(sourcePoint, stroke.planeNormal, stroke.planeOffset)
          ? sculptBrushPointWeight(sourcePoint, cursor, rect, radius, falloff)
          : 0;
      const partnerWeight = fixedMoveBrushInfluence
        ? Number(initialMoveInfluence?.partnerWeights?.[pointIndex]) || 0
        : partnerVisible
          && partnerPoint
          && pointInCameraFacingHalfSpace(partnerPoint, stroke.planeNormal, stroke.planeOffset)
          ? sculptBrushPointWeight(partnerPoint, cursor, rect, radius, falloff)
          : 0;
      const weight = Math.max(sourceWeight, partnerWeight);
      if (weight <= 0) continue;
      pointWeights[pointIndex] = weight;
      if (slideBrushActive) {
        if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
        const curve = stroke.originalCurves?.get(source.id);
        if (curve) {
          const t = pointIndex / Math.max(1, source.points.length - 1);
          const tangent = curve.getTangent(t).normalize();
          const dragWorld = sculptBrushWorldDelta(sourcePoint, deltaX, deltaY, rect);
          const amount = (reverse ? -1 : 1) * weight * strength * dragWorld.dot(tangent);
          sourcePoint.addScaledVector(tangent, amount);
          const basePoint = source.groupLatticeBasePoints?.[pointIndex];
          if (basePoint) basePoint.addScaledVector(tangent, amount);
          sourceChanged = true;
        }
        continue;
      }
      if (pushBrushActive) {
        if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
        const curve = stroke.originalCurves?.get(source.id);
        if (curve) {
          const t = pointIndex / Math.max(1, source.points.length - 1);
          const point = curve.getPoint(t);
          const tangent = curve.getTangent(t).normalize();
          const up = deps.guidedNormalAt(source, point, tangent, t)
            .applyAxisAngle(tangent, sampleArray(source.pointTwists || [], t))
            .normalize();
          const dragWorld = sculptBrushWorldDelta(sourcePoint, deltaX, deltaY, rect);
          const amount = (reverse ? -1 : 1) * weight * strength * dragWorld.dot(up);
          sourcePoint.addScaledVector(up, amount);
          const basePoint = source.groupLatticeBasePoints?.[pointIndex];
          if (basePoint) basePoint.addScaledVector(up, amount);
          sourceChanged = true;
        }
        continue;
      }
      if (orientBrushActive) {
        if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
        if (!source.pointTwists) source.pointTwists = source.points.map(() => 0);
        const curve = stroke.originalCurves?.get(source.id);
        if (curve) {
          const t = pointIndex / Math.max(1, source.points.length - 1);
          const tangent = curve.getTangent(t).normalize();
          const point = curve.getPoint(t);
          let targetUp = deps.camera.position.clone().sub(point).projectOnPlane(tangent);
          if (targetUp.lengthSq() < 0.0001) targetUp.set(0, 1, 0).projectOnPlane(tangent);
          targetUp.normalize();
          const currentUp = deps.curveFrameAt(source, t).z;
          const angle = deps.signedAngleAroundAxis(currentUp, targetUp, tangent);
          source.pointTwists[pointIndex] += angle * weight * strength * 0.08;
          sourceChanged = true;
        }
        continue;
      }
            if (smoothBrushActive) continue;
      if (preserveTips && !inflateBrushActive && pointIndex === source.points.length - 1) continue;
      if (scaleBrushActive) continue;
      if (!stroke.undoCaptured) {
        deps.pushUndoState();
        stroke.undoCaptured = true;
      }
      if (inflateBrushActive) {
        const nextScale = inflateSculptPointScale(
          source.pointScales[pointIndex],
          weight,
          strength,
          strokeDistance,
          radius
        );
        deps.setPointScale(source, pointIndex, nextScale.x, nextScale.z);
        sourceChanged = true;
        continue;
      }
      const movingPartner = partnerWeight > sourceWeight;
      const affectedPoint = movingPartner ? partnerPoint : sourcePoint;
      const dragWorldDelta = sculptBrushWorldDelta(affectedPoint, deltaX, deltaY, rect);
      const worldDelta = dragWorldDelta.multiplyScalar(weight * strength);
      if (movingPartner) worldDelta.x *= -1;
      sourcePoint.add(worldDelta);
      if (source.groupLatticeBasePoints?.[pointIndex]) {
        source.groupLatticeBasePoints[pointIndex].add(worldDelta);
      }
      sourceChanged = true;

    }
    if (scaleBrushActive) {
      const unitAffected = pointWeights.some((pointWeightValue) => pointWeightValue > 0);
      if (unitAffected) {
        if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
        if (stroke.scaleMode === "cut-extend") {
          // Whole-strand Cut/Extend: uniform parameter scaling preserves current spacing.
          const curve = stroke.originalCurves?.get(source.id);
          if (curve) {
            stroke.cutExtendOffset += (reverse ? -1 : 1) * strength * strokeDistance * 0.01;
            const factor = Math.max(0.02, 1 + stroke.cutExtendOffset);
            for (let index = 1; index < source.points.length; index += 1) {
              const t0 = index / Math.max(1, source.points.length - 1);
              const t1 = t0 * factor;
              let position;
              if (t1 <= 1) {
                position = curve.getPoint(Math.max(0, t1));
              } else {
                position = curve.getPoint(1).clone()
                  .addScaledVector(curve.getTangent(1).normalize(), (t1 - 1) * curve.getLength());
              }
              source.points[index].copy(position);
            }
            sourceChanged = true;
          }
        } else {
          // Scale mode: root-anchored uniform scaling, point order preserved (no scalp collision).
          const anchor = source.points[0];
          for (let index = 1; index < source.points.length; index += 1) {
            const direction = source.points[index].clone().sub(anchor);
            const factor = Math.max(0.02, 1 + (reverse ? -1 : 1) * strength * strokeDistance * 0.01);
            source.points[index].copy(anchor).addScaledVector(direction, factor);
          }
          sourceChanged = true;
        }
      }
    }

    if (smoothBrushActive) {
      const smoothingWeights = deps.sculptState.proportionalEditing
        ? proportionalSculptWeights(
            pointWeights,
            Number(deps.proportionalRadiusInput.value),
            Number(deps.proportionalFalloffInput.value)
          )
        : pointWeights;
      const smoothDeltas = smoothSculptPointDeltas(
        source.points,
        smoothingWeights,
        strength,
        0.04,
        { preserveTip: preserveTips }
      );
      const smoothTwistDeltas = smoothSculptTwistDeltas(source.pointTwists || [], smoothingWeights, strength);
      smoothTwistDeltas.forEach((delta, pointIndex) => {
        if (delta === 0) return;
        if (!stroke.undoCaptured) {
          deps.pushUndoState();
          stroke.undoCaptured = true;
        }
        if (!source.pointTwists) source.pointTwists = source.points.map(() => 0);
        source.pointTwists[pointIndex] += delta;
        sourceChanged = true;
      });
      smoothDeltas.forEach((delta, pointIndex) => {
        if (pointIndex === 0 || (delta.x === 0 && delta.y === 0 && delta.z === 0)) return;
        if (!stroke.undoCaptured) {
          deps.pushUndoState();
          stroke.undoCaptured = true;
        }
        source.points[pointIndex].x += delta.x;
        source.points[pointIndex].y += delta.y;
        source.points[pointIndex].z += delta.z;
        const basePoint = source.groupLatticeBasePoints?.[pointIndex];
        if (basePoint) {
          basePoint.x += delta.x;
          basePoint.y += delta.y;
          basePoint.z += delta.z;
        }
        sourceChanged = true;
      });
    }
    if (!sourceChanged) return;
    if (inflateBrushActive) {
      source.width = Math.max(0.04, source.baseWidth * deps.average(source.pointWidths));
    }
    stroke.changed = true;
    stroke.editedLockIds.add(source.id);
    if (partner) stroke.editedLockIds.add(partner.id);
    changedSources.push({ source, partner });
  });

  changedSources.forEach(({ source, partner }) => {
    deps.syncLockFromCurve(source);
    syncSculptBrushMirrorPoints(source, partner);
    updateSculptBrushDebugCurve(source);
    if (partner) updateSculptBrushDebugCurve(partner);
    queueSculptBrushGeometryUpdate(source);
    if (partner) queueSculptBrushGeometryUpdate(partner);
  });
}

function flushSculptMoveStrokeSample(stroke = deps.sculptState.sculptMoveStroke) {
  if (!stroke || stroke.pendingX === null || stroke.pendingY === null) return;
  const clientX = stroke.pendingX;
  const clientY = stroke.pendingY;
  stroke.pendingX = null;
  stroke.pendingY = null;
  applySculptMoveStrokeSample(stroke, clientX, clientY);
}

function updateSculptMoveStroke(event) {
  updateSculptBrushCursor(event);
  const stroke = deps.sculptState.sculptMoveStroke;
  if (!stroke || event.pointerId !== stroke.pointerId) return;
  stroke.pendingX = event.clientX;
  stroke.pendingY = event.clientY;
  if (stroke.frameRequest === null) {
    stroke.frameRequest = requestAnimationFrame(() => {
      stroke.frameRequest = null;
      flushSculptMoveStrokeSample(stroke);
    });
  }
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishSculptMoveStroke(event, { cancel = false } = {}) {
  const stroke = deps.sculptState.sculptMoveStroke;
  if (!stroke || (event?.pointerId !== undefined && event.pointerId !== stroke.pointerId)) return;
  if (stroke.frameRequest !== null) {
    cancelAnimationFrame(stroke.frameRequest);
    stroke.frameRequest = null;
  }
  if (!cancel) flushSculptMoveStrokeSample(stroke);
  stroke.pendingX = null;
  stroke.pendingY = null;
  deps.sculptState.sculptMoveStroke = null;
  if (deps.renderer.domElement.hasPointerCapture?.(stroke.pointerId)) {
    deps.renderer.domElement.releasePointerCapture(stroke.pointerId);
  }
  if (cancel && stroke.changed) {
    stroke.snapshots.forEach((snapshot) => {
      const lock = deps.locks.find((item) => item.id === snapshot.lockId);
      if (!lock || lock.points.length !== snapshot.points.length) return;
      snapshot.points.forEach((point, index) => lock.points[index].copy(point));
      if (snapshot.groupLatticeBasePoints) {
        lock.groupLatticeBasePoints = snapshot.groupLatticeBasePoints.map((point) => point.clone());
      }
      lock.pointScales = snapshot.pointScales.map((scale) => ({ ...scale }));
      lock.pointWidths = [...snapshot.pointWidths];
      lock.width = snapshot.width;
      deps.syncLockFromCurve(lock);
    });
    if (stroke.undoCaptured) {
      deps.undoHistory.pop();
      deps.updateHistoryButtons();
    }
  }
  deps.flushPendingLockGeometryUpdates();
  flushSculptBrushGeometryUpdates({ all: true });
  stroke.editedLockIds.forEach((lockId) => {
    const lock = deps.locks.find((item) => item.id === lockId);
    if (!lock) return;
    if (!cancel) deps.commitClumpMemberRestState(lock);
    deps.syncLockFromCurve(lock);
  });
  const selectedLock = deps.getSelectedLock();
  if (selectedLock) deps.syncInputs(selectedLock);
  deps.updateTopologyStats();
  deps.updateInteractionLocks();
  event?.preventDefault();
  event?.stopImmediatePropagation();
}

  return {
    setSculptBrushMaterialClipping,
    sculptBrushDebugCurveVisible,
    refreshSculptBrushDebugView,
    refreshSculptBrushDebugAfterStateRestore,
    updateSculptBrushDebugCurve,
    scheduleSculptBrushGeometryUpdates,
    queueSculptBrushGeometryUpdate,
    flushSculptBrushGeometryUpdates,
    editableStrandWidth,
    editableStrandWidthBounds,
    applyEditableStrandWidth,
    viewportPixelPoint,
    syncSculptBrushControls,
    syncSculptBrushStrengthForActiveTool,
    updateActiveSculptBrushStrength,
    updateActiveSculptBrushPreserveTips,
    sculptBrushPlaneOffset,
    setSculptBrushCursorVisible,
    updateSculptBrushCursor,
    sculptBrushMirrorUpdateLock,
    sculptBrushEditableLock,
    sculptBrushWorkingPlaneNormal,
    sculptBrushLockViable,
    sculptBrushUnits,
    updateSculptBrushViabilityPlane,
    sculptBrushPointWeight,
    sculptBrushWorldDelta,
    syncSculptBrushMirrorPoints,
    captureSculptMoveStrokeInfluence,
    beginSculptMoveStroke,
    applySculptMoveStrokeSample,
    flushSculptMoveStrokeSample,
    updateSculptMoveStroke,
    finishSculptMoveStroke
  };
}
