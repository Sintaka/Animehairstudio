// curve-surface-create.js - Curve Surface / Surface Lattice create & edit layer (refactor 3d batch G4).
// Extracted from app.js; coupling injected via createCurveSurfaceCreateApi(deps).
import * as THREE from "three";
import { DEFAULT_HAIR_COLOR } from "../core/app-config.js?v=20260815-4";
import { eightWayScreenDelta } from "./curve-math.js?v=20260813-3";
import {
  buildConnectedCurveCardGrid,
  buildCurveSurfaceGrid,
  curveSurfaceControllerSideDirections,
  curveSurfaceControlPointCount,
  curveSurfaceLineLength,
  DEFAULT_CURVE_SURFACE_ROWS,
  DEFAULT_CURVE_SURFACE_STRIP_WIDTH,
  resampleCurveSurfaceLine
} from "./curve-surface.js?v=20260814-12";
import {
  createLoftSurfaceLatticePointData,
  createSurfaceLatticePointData,
  DEFAULT_SURFACE_LATTICE_COLUMNS,
  DEFAULT_SURFACE_LATTICE_ROWS,
  normalizeSurfaceLatticeCount,
  resampleSurfaceLatticePointData,
  surfaceLatticePointIndex,
  surfaceLatticeWireSegments
} from "./surface-lattice.js?v=20260814-12";


export function createCurveSurfaceCreateApi(deps) {
  // deps: store proxies (sculptState/miscState/sel) + shared objects (renderer/raycaster/panelCreationDefaults/
  // scalpBuilder/STRAIGHT_CUT_PANEL_CURVE) + DOM elements + app.js helper functions; full list:
  // devlog/in-progress/g4-refactor-map.md section 5.
function curveSurfaceControllerCurves(lock) {
  const rows = Math.max(2, Math.round(Number(lock?.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  const columns = Math.max(1, Math.round(Number(lock?.curveSurfaceColumns) || 1));
  if (!lock?.points?.length || lock.points.length !== rows * columns) return [];
  return Array.from({ length: columns }, (_, column) => (
    lock.points.slice(column * rows, (column + 1) * rows)
  ));
}

function curveSurfaceControllerFrameLock(lock, controllerIndex, sources = {}) {
  const rows = Math.max(2, Math.round(Number(lock?.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  const start = controllerIndex * rows;
  const end = start + rows;
  const points = sources.points || lock.points || [];
  const pointTwists = sources.pointTwists || lock.pointTwists || [];
  const pointScales = sources.pointScales || lock.pointScales || [];
  const pointSurfaceNormals = sources.pointSurfaceNormals || lock.pointSurfaceNormals || [];
  const controllerPoints = points.slice(start, end);
  const authoredNormals = pointSurfaceNormals.length
    ? pointSurfaceNormals.slice(start, end)
    : [];
  const side = lock.curveSurfaceSide?.clone?.() || new THREE.Vector3(
    Number(lock.curveSurfaceSide?.x || 1),
    Number(lock.curveSurfaceSide?.y || 0),
    Number(lock.curveSurfaceSide?.z || 0)
  );
  if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
  side.normalize();
  const controllerCurves = Array.from(
    { length: Math.max(1, Math.round(Number(lock.curveSurfaceColumns) || 1)) },
    (_, index) => points.slice(index * rows, (index + 1) * rows)
  );
  const controllerSides = curveSurfaceControllerSideDirections(controllerCurves, side)[controllerIndex] || [];
  const controllerNormals = controllerPoints.map((point, index) => {
    const authored = authoredNormals[index];
    if (authored?.lengthSq?.() > 0.0001) return authored.clone().normalize();
    const previous = controllerPoints[Math.max(0, index - 1)] || point;
    const next = controllerPoints[Math.min(controllerPoints.length - 1, index + 1)] || point;
    const tangent = next.clone().sub(previous).normalize();
    const localSideData = controllerSides[index];
    const localSide = localSideData
      ? new THREE.Vector3(localSideData.x, localSideData.y, localSideData.z)
      : side;
    const normal = new THREE.Vector3().crossVectors(tangent, localSide).normalize();
    return normal.lengthSq() > 0.0001 ? normal : deps.outwardNormalAtPoint(point, tangent);
  });
  return {
    ...lock,
    points: controllerPoints,
    pointTwists: Array.from({ length: rows }, (_, index) => Number(pointTwists[start + index] || 0)),
    pointScales: Array.from({ length: rows }, (_, index) => pointScales[start + index] || { x: 1, z: 1 }),
    pointSurfaceNormals: controllerNormals,
    surfaceNormalInfluence: 1
  };
}

function sampledCurveSurfaceControllerCurves(lock, rowCount) {
  const rows = Math.max(2, Math.round(Number(rowCount) || DEFAULT_CURVE_SURFACE_ROWS));
  return curveSurfaceControllerCurves(lock).map((points) => {
    const curve = new THREE.CatmullRomCurve3(points);
    return Array.from({ length: rows }, (_, row) => curve.getPoint(row / (rows - 1)));
  });
}

function sampledCurveSurfaceControllerSides(lock, rowCount) {
  const rows = Math.max(2, Math.round(Number(rowCount) || DEFAULT_CURVE_SURFACE_ROWS));
  return curveSurfaceControllerCurves(lock).map((_, controllerIndex) => {
    const controllerLock = curveSurfaceControllerFrameLock(lock, controllerIndex);
    const curve = new THREE.CatmullRomCurve3(controllerLock.points);
    let previousFrame = null;
    return Array.from({ length: rows }, (_, row) => {
      const frame = deps.strandGeometryFrameAt(controllerLock, curve, row / (rows - 1), previousFrame);
      previousFrame = frame;
      // Curve Surface's authored left-to-right direction is normal cross
      // tangent, while a strand frame's X axis is tangent cross normal.
      return frame.x.clone().negate();
    });
  });
}

function activeCurveSurfaceControllerIndex(lock) {
  if (
    lock?.geometryType !== "curve-surface"
    || deps.sel.selectedCurveSurfaceController?.lockId !== lock.id
  ) return null;
  const index = Math.round(Number(deps.sel.selectedCurveSurfaceController.index));
  return index >= 0 && index < lock.curveSurfaceColumns ? index : null;
}

function curveSurfaceControllerPointRange(lock, controllerIndex = activeCurveSurfaceControllerIndex(lock)) {
  if (lock?.geometryType !== "curve-surface" || controllerIndex === null) {
    return { start: 0, end: lock?.points?.length || 0 };
  }
  const rows = Math.max(2, Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  return {
    start: controllerIndex * rows,
    end: Math.min(lock.points.length, (controllerIndex + 1) * rows)
  };
}

function curveSurfaceControllerPreviewRows(lock) {
  return THREE.MathUtils.clamp(
    Math.max(32, Math.round(Number(lock?.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS) * 4),
    8,
    256
  );
}

function curveSurfaceControllerSegments(lock, controllerIndex = null) {
  const segments = [];
  const previewRows = curveSurfaceControllerPreviewRows(lock);
  sampledCurveSurfaceControllerCurves(lock, previewRows).forEach((curve, index) => {
    if (controllerIndex !== null && index !== controllerIndex) return;
    for (let row = 0; row < curve.length - 1; row += 1) segments.push(curve[row], curve[row + 1]);
  });
  return segments;
}

function curveSurfaceControllerIndexNearPoint(lock, point) {
  if (lock?.geometryType !== "curve-surface" || !point) return null;
  let nearestIndex = null;
  let nearestDistanceSq = Infinity;
  const closestPoint = new THREE.Vector3();
  const segment = new THREE.Line3();
  sampledCurveSurfaceControllerCurves(lock, curveSurfaceControllerPreviewRows(lock))
    .forEach((curve, controllerIndex) => {
      for (let index = 0; index < curve.length - 1; index += 1) {
        segment.set(curve[index], curve[index + 1]);
        segment.closestPointToPoint(point, true, closestPoint);
        const distanceSq = closestPoint.distanceToSquared(point);
        if (distanceSq >= nearestDistanceSq) continue;
        nearestDistanceSq = distanceSq;
        nearestIndex = controllerIndex;
      }
    });
  return nearestIndex;
}

function curveSurfaceControllerHitFromEvent(event, lock = deps.getSelectedLock()) {
  if (
    deps.sculptState.viewportEditMode !== "strand"
    || lock?.locked
    || !["select", "move", "rotate"].includes(deps.sel.activeTool)
    || lock?.geometryType !== "curve-surface"
    || !lock.curveObjects?.group.visible
    || event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return null;
  deps.rayFromViewportEvent(event);
  const previousThreshold = deps.raycaster.params.Line.threshold;
  deps.raycaster.params.Line.threshold = 0.055;
  const hit = deps.raycaster.intersectObject(lock.curveObjects.line, false)[0] || null;
  deps.raycaster.params.Line.threshold = previousThreshold;
  if (!hit) return null;
  const controllerIndex = curveSurfaceControllerIndexNearPoint(lock, hit.point);
  return controllerIndex === null ? null : { lock, controllerIndex, hit };
}

function surfaceLatticeNormal(points, columns, rows) {
  const centerRow = Math.floor(rows / 2);
  const centerColumn = Math.floor(columns / 2);
  const left = points[surfaceLatticePointIndex(centerRow, 0, columns, rows)];
  const right = points[surfaceLatticePointIndex(centerRow, columns - 1, columns, rows)];
  const top = points[surfaceLatticePointIndex(0, centerColumn, columns, rows)];
  const bottom = points[surfaceLatticePointIndex(rows - 1, centerColumn, columns, rows)];
  const horizontal = right?.clone().sub(left);
  const vertical = bottom?.clone().sub(top);
  const normal = vertical?.cross(horizontal);
  return normal?.lengthSq() > 0.000001
    ? normal.normalize()
    : new THREE.Vector3(0, 0, 1);
}

function createSurfaceLockFromLattice(points, options = {}) {
  const surfaceColumns = normalizeSurfaceLatticeCount(
    options.surfaceColumns,
    DEFAULT_SURFACE_LATTICE_COLUMNS
  );
  const surfaceRows = normalizeSurfaceLatticeCount(
    options.surfaceRows,
    DEFAULT_SURFACE_LATTICE_ROWS
  );
  if (points.length !== surfaceColumns * surfaceRows) return null;
  const centerRow = Math.floor(surfaceRows / 2);
  const centerColumn = THREE.MathUtils.clamp(
    Number.isFinite(Number(options.centerColumn))
      ? Math.round(Number(options.centerColumn))
      : Math.floor(surfaceColumns / 2),
    0,
    surfaceColumns - 1
  );
  const left = points[surfaceLatticePointIndex(centerRow, 0, surfaceColumns, surfaceRows)];
  const right = points[surfaceLatticePointIndex(centerRow, surfaceColumns - 1, surfaceColumns, surfaceRows)];
  const root = points[surfaceLatticePointIndex(0, centerColumn, surfaceColumns, surfaceRows)];
  const tip = points[surfaceLatticePointIndex(surfaceRows - 1, centerColumn, surfaceColumns, surfaceRows)];
  const rootSurfaceNormal = surfaceLatticeNormal(points, surfaceColumns, surfaceRows);
  const lock = deps.addLock("front", {
    geometryType: "surface",
    surfaceColumns,
    surfaceRows,
    x: root.x,
    y: root.y,
    z: root.z,
    length: root.distanceTo(tip),
    curve: tip.x - root.x,
    width: Math.max(0.08, left.distanceTo(right)),
    panelThickness: deps.panelCreationDefaults.panelThickness,
    panelLengthLoops: surfaceRows - 1,
    panelWidthLoops: surfaceColumns - 1,
    panelCurvature: 0,
    panelLeftEdgeTrim: deps.panelCreationDefaults.panelLeftEdgeTrim,
    panelRightEdgeTrim: deps.panelCreationDefaults.panelRightEdgeTrim,
    panelSplitEnabled: false,
    panelSplitSnapToLoops: deps.panelCreationDefaults.panelSplitSnapToLoops,
    panelSplitHeight: deps.panelCreationDefaults.panelSplitHeight,
    panelSplits: [],
    panelSplitGap: deps.panelCreationDefaults.panelSplitGap,
    taperCurve: deps.panelCreationDefaults.taperCurve.map((point) => ({ ...point })),
    depthCurve: deps.panelCreationDefaults.depthCurve.map((point) => ({ ...point })),
    taperCurveSecondary: deps.panelCreationDefaults.taperCurveSecondary.map((point) => ({ ...point })),
    depthCurveSecondary: deps.panelCreationDefaults.depthCurveSecondary.map((point) => ({ ...point })),
    asymmetricWidthCurve: false,
    asymmetricDepthCurve: Boolean(deps.panelCreationDefaults.asymmetricDepthCurve),
    centerAsymmetricProfile: false,
    pointSurfaceNormals: points.map(() => rootSurfaceNormal.clone()),
    color: DEFAULT_HAIR_COLOR,
    scalpRegion: options.scalpRegion || "unassigned",
    hairLayer: deps.panelCreationDefaults.hairLayer,
    rootAttachmentEnabled: false,
    rootScalpOffset: 0,
    rootSurfaceNormal,
    points
  }, { deferUi: true });
  lock.name = `${options.namePrefix || "Surface"} ${deps.sel.lockIndex}`;
  deps.updateLockGeometry(lock);
  return lock;
}

function createViewportSurface() {
  return null;
  /*
   * Retired 2026-07-27. The implementation below remains as a recovery reference
   * while the large-shape blockout workflow is reconsidered.
   */
  deps.finishDrawStrandStroke(null, { cancel: true });
  deps.finishPlacementFlow();
  deps.exitSetupEditors();
  deps.setViewportEditMode("strand", { clearSelection: false, activateSelect: false });
  deps.pushUndoState();
  const surfaceColumns = DEFAULT_SURFACE_LATTICE_COLUMNS;
  const surfaceRows = DEFAULT_SURFACE_LATTICE_ROWS;
  const points = createSurfaceLatticePointData({
    columns: surfaceColumns,
    rows: surfaceRows
  }).map((point) => new THREE.Vector3(point.x, point.y, point.z));
  const lock = createSurfaceLockFromLattice(points, {
    surfaceColumns,
    surfaceRows
  });
  if (!lock) return null;
  deps.renderLockList();
  deps.updateCount();
  deps.selectLock(lock.id);
  deps.setActiveTool("move");
  return lock;
}

function loftSurfaceProfilePoints(samples) {
  if (!samples?.length) return [];
  if (samples.length < 2) return samples.map((sample) => sample.point.clone());
  return deps.processedDrawStroke(samples, 0.35, 0.24).map((sample) => sample.point.clone());
}

function hideLoftSurfacePreviews() {
  [deps.loftHorizontalPreview, deps.loftVerticalPreview, deps.loftSurfaceGridPreview].forEach((preview) => {
    preview.visible = false;
    preview.geometry.setFromPoints([]);
  });
}

function updateLoftSurfaceDraftUi() {
  const hasHorizontal = Boolean(deps.miscState.loftSurfaceDraft?.horizontalPoints?.length);
  deps.loftHorizontalStep.classList.toggle("active", !hasHorizontal);
  deps.loftHorizontalStep.classList.toggle("complete", hasHorizontal);
  deps.loftVerticalStep.classList.toggle("active", hasHorizontal);
  deps.loftVerticalStep.classList.remove("complete");
  deps.resetLoftSurfaceDraftButton.disabled = !hasHorizontal && !deps.miscState.loftSurfaceDraft?.activeStroke;
}

function updateLoftSurfacePreview() {
  const stroke = deps.miscState.loftSurfaceDraft?.activeStroke;
  const horizontalPoints = stroke?.stage === "horizontal"
    ? loftSurfaceProfilePoints(stroke.samples)
    : deps.miscState.loftSurfaceDraft?.horizontalPoints || [];
  const verticalPoints = stroke?.stage === "vertical"
    ? loftSurfaceProfilePoints(stroke.samples)
    : [];
  deps.loftHorizontalPreview.geometry.setFromPoints(horizontalPoints);
  deps.loftHorizontalPreview.visible = horizontalPoints.length > 0;
  deps.loftVerticalPreview.geometry.setFromPoints(verticalPoints);
  deps.loftVerticalPreview.visible = verticalPoints.length > 0;
  if (horizontalPoints.length >= 2 && verticalPoints.length >= 2) {
    const latticePoints = createLoftSurfaceLatticePointData({
      horizontalPoints,
      verticalPoints,
      columns: DEFAULT_SURFACE_LATTICE_COLUMNS,
      rows: DEFAULT_SURFACE_LATTICE_ROWS
    }).map((point) => new THREE.Vector3(point.x, point.y, point.z));
    deps.loftSurfaceGridPreview.geometry.setFromPoints(surfaceLatticeWireSegments(
      latticePoints,
      DEFAULT_SURFACE_LATTICE_COLUMNS,
      DEFAULT_SURFACE_LATTICE_ROWS
    ));
    deps.loftSurfaceGridPreview.visible = latticePoints.length > 0;
  } else {
    deps.loftSurfaceGridPreview.visible = false;
    deps.loftSurfaceGridPreview.geometry.setFromPoints([]);
  }
  updateLoftSurfaceDraftUi();
}

function resetLoftSurfaceDraft() {
  const pointerId = deps.miscState.loftSurfaceDraft?.activeStroke?.pointerId;
  if (pointerId !== undefined && deps.renderer.domElement.hasPointerCapture?.(pointerId)) {
    deps.renderer.domElement.releasePointerCapture(pointerId);
  }
  deps.miscState.loftSurfaceDraft = {
    horizontalPoints: null,
    activeStroke: null
  };
  deps.renderer.domElement.style.cursor = "";
  hideLoftSurfacePreviews();
  updateLoftSurfaceDraftUi();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
}

function cancelLoftSurfaceDraft() {
  const hadDraft = Boolean(
    deps.miscState.loftSurfaceDraft?.activeStroke
    || deps.miscState.loftSurfaceDraft?.horizontalPoints?.length
  );
  const pointerId = deps.miscState.loftSurfaceDraft?.activeStroke?.pointerId;
  if (pointerId !== undefined && deps.renderer.domElement.hasPointerCapture?.(pointerId)) {
    deps.renderer.domElement.releasePointerCapture(pointerId);
  }
  deps.miscState.loftSurfaceDraft = null;
  deps.renderer.domElement.style.cursor = "";
  hideLoftSurfacePreviews();
  updateLoftSurfaceDraftUi();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  return hadDraft;
}

function cloneCurveSurfaceSource(source) {
  if (!source?.curves?.length) return null;
  return {
    rows: Math.max(2, Math.round(Number(source.rows) || DEFAULT_CURVE_SURFACE_ROWS)),
    stripWidth: Math.max(0.001, Number(source.stripWidth) || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    side: {
      x: Number(source.side?.x || 0),
      y: Number(source.side?.y || 0),
      z: Number(source.side?.z || 0)
    },
    curves: source.curves.map((curve) => ({
      attachment: ["center", "left", "right"].includes(curve?.attachment) ? curve.attachment : null,
      column: Number.isInteger(curve?.column) ? curve.column : null,
      points: (curve?.points || []).map((point) => ({
        x: Number(point?.x || 0),
        y: Number(point?.y || 0),
        z: Number(point?.z || 0)
      }))
    }))
  };
}

function curveSurfaceSourceForSnapshot(lock) {
  const source = cloneCurveSurfaceSource(lock?.curveSurfaceSource);
  if (!source) return null;
  if (lock.geometryType === "curve-surface" && source.rows === lock.curveSurfaceRows) {
    const controllers = curveSurfaceControllerCurves(lock);
    source.curves = controllers.map((curve, column) => ({
      attachment: column < lock.curveSurfaceCenterCurve
        ? "left"
        : column > lock.curveSurfaceCenterCurve ? "right" : "center",
      column,
      points: curve.map(deps.vectorToData)
    }));
    source.side = deps.vectorToData(lock.curveSurfaceSide || source.side);
    source.stripWidth = lock.curveSurfaceStripWidth;
    return source;
  }
  if (lock.geometryType !== "surface" || source.rows !== lock.surfaceRows) return source;
  source.curves.forEach((curve) => {
    if (curve.column == null || curve.column < 0 || curve.column >= lock.surfaceColumns) return;
    curve.points = Array.from({ length: lock.surfaceRows }, (_, row) => deps.vectorToData(
      lock.points[surfaceLatticePointIndex(row, curve.column, lock.surfaceColumns, lock.surfaceRows)]
    ));
  });
  return source;
}

function mirroredCurveSurfaceSource(source) {
  const mirrored = cloneCurveSurfaceSource(source);
  if (!mirrored) return null;
  mirrored.side.x *= -1;
  mirrored.curves.forEach((curve) => {
    curve.points.forEach((point) => { point.x *= -1; });
  });
  return mirrored;
}

function curveSurfaceProfilePoints(samples) {
  return loftSurfaceProfilePoints(samples).map((point) => ({ x: point.x, y: point.y, z: point.z }));
}

function curveSurfaceProfileNormals(samples) {
  if (!samples?.some((sample) => sample.onSurface && sample.normal)) return [];
  const processed = samples.length < 2 ? samples : deps.processedDrawStroke(samples, 0.35, 0.24);
  return deps.strokeSurfaceNormals(processed.map((sample) => ({
    ...sample,
    normal: sample.onSurface ? sample.normal : null
  })));
}

function curveSurfacePreviewLock(controllerCurves, side) {
  const rows = controllerCurves[0]?.length || DEFAULT_CURVE_SURFACE_ROWS;
  const points = controllerCurves.flat().map((point) => new THREE.Vector3(point.x, point.y, point.z));
  return {
    geometryType: "curve-surface",
    curveSurfaceColumns: controllerCurves.length,
    curveSurfaceRows: rows,
    curveSurfaceStripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    curveSurfaceSide: side.clone?.() || new THREE.Vector3(side.x, side.y, side.z),
    taperCurve: deps.STRAIGHT_CUT_PANEL_CURVE.map((point) => ({ ...point })),
    taperCurveSecondary: deps.STRAIGHT_CUT_PANEL_CURVE.map((point) => ({ ...point })),
    depthCurve: deps.panelCreationDefaults.depthCurve.map((point) => ({ ...point })),
    depthCurveSecondary: deps.panelCreationDefaults.depthCurveSecondary.map((point) => ({ ...point })),
    asymmetricDepthCurve: false,
    centerAsymmetricProfile: false,
    points,
    pointSurfaceNormals: [],
    width: 0.62,
    color: DEFAULT_HAIR_COLOR,
    scalpRegion: "unassigned"
  };
}

function curveSurfaceCardWireSegments(grid) {
  const points = grid.points.map((point) => new THREE.Vector3(point.x, point.y, point.z));
  const segments = [];
  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns - 1; column += 1) {
      segments.push(points[row * grid.columns + column], points[row * grid.columns + column + 1]);
    }
  }
  for (let column = 0; column < grid.columns; column += 1) {
    for (let row = 0; row < grid.rows - 1; row += 1) {
      segments.push(points[row * grid.columns + column], points[(row + 1) * grid.columns + column]);
    }
  }
  return segments;
}

function hideCurveSurfacePreview() {
  deps.curveSurfaceDraftGroup.visible = false;
  deps.curveSurfaceDraftMesh.visible = false;
  deps.curveSurfaceDraftGroup.children.slice().forEach((child) => {
    child.geometry?.dispose?.();
    child.material?.dispose?.();
  });
  deps.curveSurfaceDraftGroup.clear();
  deps.curveSurfaceDraftMesh.geometry.dispose();
  deps.curveSurfaceDraftMesh.geometry = new THREE.BufferGeometry();
}

function curveSurfaceCurveAverageX(curve) {
  if (!curve?.length) return 0;
  return curve.reduce((sum, point) => sum + Number(point.x || 0), 0) / curve.length;
}

function curveSurfaceCurvesMatch(a, b, tolerance = 0.001) {
  if (!a?.length || a.length !== b?.length) return false;
  return a.every((point, index) => Math.hypot(
    point.x - b[index].x,
    point.y - b[index].y,
    point.z - b[index].z
  ) <= tolerance);
}

function unifiedMirroredCurveSurface(controllerCurves, controllerNormals = [], sourceCenterIndex = 0) {
  const entries = controllerCurves.map((curve, index) => ({
    curve: curve.map((point) => ({ ...point })),
    normals: (controllerNormals[index] || []).map((normal) => normal?.clone?.() || normal || null)
  }));
  if (!deps.sculptState.mirrorXEditing) {
    return {
      curves: entries.map((entry) => entry.curve),
      normals: entries.map((entry) => entry.normals),
      centerIndex: THREE.MathUtils.clamp(sourceCenterIndex, 0, Math.max(0, entries.length - 1)),
      side: null
    };
  }
  controllerCurves.forEach((curve, index) => {
    const mirroredCurve = curve.map((point) => ({ x: -point.x, y: point.y, z: point.z }));
    if (entries.some((entry) => curveSurfaceCurvesMatch(entry.curve, mirroredCurve))) return;
    entries.push({
      curve: mirroredCurve,
      normals: (controllerNormals[index] || []).map((normal) => normal
        ? new THREE.Vector3(-normal.x, normal.y, normal.z).normalize()
        : null)
    });
  });
  entries.sort((a, b) => curveSurfaceCurveAverageX(a.curve) - curveSurfaceCurveAverageX(b.curve));
  let centerIndex = 0;
  entries.forEach((entry, index) => {
    if (Math.abs(curveSurfaceCurveAverageX(entry.curve)) < Math.abs(curveSurfaceCurveAverageX(entries[centerIndex].curve))) {
      centerIndex = index;
    }
  });
  return {
    curves: entries.map((entry) => entry.curve),
    normals: entries.map((entry) => entry.normals),
    centerIndex,
    side: deps.sculptState.mirrorXEditing ? new THREE.Vector3(1, 0, 0) : null
  };
}

function curveSurfaceSideVector(curve, normal) {
  if (!curve?.length) return new THREE.Vector3(1, 0, 0);
  const middle = Math.floor(curve.length * 0.5);
  const tangent = new THREE.Vector3()
    .subVectors(
      new THREE.Vector3(curve[Math.min(curve.length - 1, middle + 1)].x, curve[Math.min(curve.length - 1, middle + 1)].y, curve[Math.min(curve.length - 1, middle + 1)].z),
      new THREE.Vector3(curve[Math.max(0, middle - 1)].x, curve[Math.max(0, middle - 1)].y, curve[Math.max(0, middle - 1)].z)
    )
    .normalize();
  const side = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  return side.lengthSq() > 0.0001 ? side : new THREE.Vector3(1, 0, 0);
}

function curveSurfaceDraftCurves(includeActive = true) {
  const curves = deps.sculptState.curveSurfaceDraft?.curves?.map((curve) => curve.map((point) => ({ ...point }))) || [];
  if (includeActive && deps.sculptState.curveSurfaceDraft?.activeStroke?.samples?.length >= 2) {
    curves.push(curveSurfaceProfilePoints(deps.sculptState.curveSurfaceDraft.activeStroke.samples));
  }
  return curves.filter((curve) => curve.length >= 2);
}

function curveSurfaceFallbackHit(
  event,
  surfaceMode = deps.activeStrokeSurfaceValue(),
  dynamic = deps.activeStrokeDynamicEnabled(surfaceMode)
) {
  if (!event || !deps.strokeSurfaceIsContextual(surfaceMode, dynamic)) return null;
  const contextualPlane = deps.contextualPlaneAtOrigin();
  const point = deps.rayFromViewportEvent(event).intersectPlane(contextualPlane.plane, new THREE.Vector3());
  return point
    ? { point, contextualPlaneNormal: contextualPlane.normal.clone() }
    : null;
}

function updateCurveSurfaceDraftUi() {
  const curveCount = deps.sculptState.curveSurfaceDraft?.curves?.length || 0;
  const activeStrokeCanCommit = (deps.sculptState.curveSurfaceDraft?.activeStroke?.samples?.length || 0) >= 2;
  if (deps.curveSurfaceDraftStatus) {
    deps.curveSurfaceDraftStatus.textContent = deps.sculptState.curveSurfaceDraft?.previewRejected
      ? "Draw beyond the current left or right boundary before releasing."
      : deps.sculptState.curveSurfaceDraft?.lastError
        ? deps.sculptState.curveSurfaceDraft.lastError
      : deps.sculptState.curveSurfaceDraft?.activeStroke
      ? `Drawing curve ${curveCount + 1}. Release to add it to the surface.`
      : curveCount
        ? `${curveCount} curve${curveCount === 1 ? "" : "s"} in draft. Draw another curve or press Enter to confirm.`
        : "Draw the first center curve.";
  }
  if (deps.confirmCurveSurfaceDraftButton) {
    deps.confirmCurveSurfaceDraftButton.disabled = !curveCount && !activeStrokeCanCommit;
  }
  if (deps.resetCurveSurfaceDraftButton) deps.resetCurveSurfaceDraftButton.disabled = !curveCount && !deps.sculptState.curveSurfaceDraft?.activeStroke;
}

function updateCurveSurfacePreview() {
  const curves = curveSurfaceDraftCurves(true);
  if (!curves.length) {
    hideCurveSurfacePreview();
    updateCurveSurfaceDraftUi();
    return;
  }
  const normal = deps.sculptState.curveSurfaceDraft.drawPlaneNormal || deps.viewPlaneNormal();
  const side = deps.sculptState.curveSurfaceDraft.side || curveSurfaceSideVector(curves[0], normal);
  deps.sculptState.curveSurfaceDraft.side = side;
  const grid = buildCurveSurfaceGrid(curves, {
    rows: deps.sculptState.curveSurfaceDraft.rows || DEFAULT_CURVE_SURFACE_ROWS,
    stripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    side
  });
  const activeCurveIndex = deps.sculptState.curveSurfaceDraft.activeStroke ? curves.length - 1 : -1;
  deps.sculptState.curveSurfaceDraft.previewRejected = grid.rejectedCurveIndices.includes(activeCurveIndex);
  const previewCenterIndex = Math.max(0, grid.sourceColumns[0] - 1);
  const unifiedPreview = unifiedMirroredCurveSurface(grid.orderedCurves, [], previewCenterIndex);
  const previewSide = unifiedPreview.side || side;
  const cardGrid = buildConnectedCurveCardGrid(unifiedPreview.curves, {
    rows: grid.rows,
    stripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    side: previewSide
  });
  if (!cardGrid.points.length) return;

  deps.curveSurfaceDraftGroup.children.slice().forEach((child) => {
    child.geometry?.dispose?.();
    child.material?.dispose?.();
  });
  deps.curveSurfaceDraftGroup.clear();
  unifiedPreview.curves.forEach((curve, index) => {
    const rejected = !deps.sculptState.mirrorXEditing && grid.rejectedCurveIndices.includes(index);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.map((point) => new THREE.Vector3(point.x, point.y, point.z))),
      new THREE.LineBasicMaterial({
        color: rejected ? 0xff5b6e : index === unifiedPreview.centerIndex ? 0xff5bca : 0x58f6ff,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        depthWrite: false
      })
    );
    line.renderOrder = 16;
    deps.curveSurfaceDraftGroup.add(line);
  });
  const gridLine = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(curveSurfaceCardWireSegments(cardGrid)),
    new THREE.LineBasicMaterial({ color: 0xf7a5df, transparent: true, opacity: 0.74, depthTest: false, depthWrite: false })
  );
  gridLine.renderOrder = 15;
  deps.curveSurfaceDraftGroup.add(gridLine);
  deps.curveSurfaceDraftGroup.visible = true;

  const previewLock = curveSurfacePreviewLock(unifiedPreview.curves, previewSide);
  deps.curveSurfaceDraftMesh.geometry.dispose();
  deps.curveSurfaceDraftMesh.geometry = deps.createHairGeometry(previewLock);
  deps.curveSurfaceDraftMesh.visible = true;
  updateCurveSurfaceDraftUi();
}

function resetCurveSurfaceDraft() {
  const pointerId = deps.sculptState.curveSurfaceDraft?.activeStroke?.pointerId;
  if (pointerId !== undefined && deps.renderer.domElement.hasPointerCapture?.(pointerId)) {
    deps.renderer.domElement.releasePointerCapture(pointerId);
  }
  deps.sculptState.curveSurfaceDraft = {
    curves: [],
    normals: [],
    activeStroke: null,
    side: null,
    drawPlaneNormal: deps.viewPlaneNormal(),
    rows: DEFAULT_CURVE_SURFACE_ROWS,
    previewRejected: false,
    lastError: ""
  };
  deps.renderer.domElement.style.cursor = "";
  hideCurveSurfacePreview();
  updateCurveSurfaceDraftUi();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
}

function cancelCurveSurfaceDraft() {
  const hadDraft = Boolean(deps.sculptState.curveSurfaceDraft?.activeStroke || deps.sculptState.curveSurfaceDraft?.curves?.length);
  const pointerId = deps.sculptState.curveSurfaceDraft?.activeStroke?.pointerId;
  if (pointerId !== undefined && deps.renderer.domElement.hasPointerCapture?.(pointerId)) {
    deps.renderer.domElement.releasePointerCapture(pointerId);
  }
  deps.sculptState.curveSurfaceDraft = null;
  deps.renderer.domElement.style.cursor = "";
  hideCurveSurfacePreview();
  updateCurveSurfaceDraftUi();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  return hadDraft;
}

function beginCurveSurfaceStroke(event, hit) {
  if (event.button !== 0 || !hit || event.ctrlKey || event.altKey || event.metaKey) return false;
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur?.();
  if (!deps.sculptState.curveSurfaceDraft) resetCurveSurfaceDraft();
  if (deps.sculptState.curveSurfaceDraft.activeStroke) return false;
  const surfaceMode = deps.activeStrokeSurfaceValue();
  const dynamicContextual = deps.activeStrokeDynamicEnabled(surfaceMode);
  const viewportBounds = deps.renderer.domElement.getBoundingClientRect();
  const viewportMidlineX = viewportBounds.left + viewportBounds.width * 0.5;
  const midlineAligned = event.shiftKey && Math.abs(event.clientX - viewportMidlineX) <= 6;
  const startEvent = midlineAligned
    ? { clientX: viewportMidlineX, clientY: event.clientY, shiftKey: true }
    : event;
  const startHit = midlineAligned
    ? deps.drawSurfaceHitFromEvent(startEvent) || curveSurfaceFallbackHit(startEvent, surfaceMode, dynamicContextual) || hit
    : hit;
  const startSample = startHit.contextualPlaneNormal
    ? { point: startHit.point.clone(), normal: startHit.contextualPlaneNormal.clone(), onSurface: false }
    : loftSurfaceSampleFromHit(startHit);
  if (midlineAligned) startSample.point.x = 0;
  deps.sculptState.curveSurfaceDraft.drawPlaneNormal = deps.viewPlaneNormal();
  deps.sculptState.curveSurfaceDraft.lastError = "";
  deps.sculptState.curveSurfaceDraft.previewRejected = false;
  deps.sculptState.curveSurfaceDraft.activeStroke = {
    pointerId: event.pointerId,
    surfaceMode,
    dynamicContextual,
    samples: [startSample],
    startX: midlineAligned ? viewportMidlineX : event.clientX,
    startY: event.clientY,
    lastX: midlineAligned ? viewportMidlineX : event.clientX,
    lastY: event.clientY,
    midlineAligned,
    cardinalConstrained: false,
    cardinalDirectionKey: "",
    initialFreePlane: surfaceMode === "contextual-plane" ? deps.contextualPlaneAtOrigin() : null,
    freePlane: surfaceMode === "contextual-plane" ? deps.contextualPlaneAtOrigin() : null
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = "crosshair";
  updateCurveSurfacePreview();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function curveSurfaceStrokeEvent(stroke, event) {
  if (!event.shiftKey && stroke.cardinalConstrained) {
    stroke.samples = [stroke.samples[0]];
    stroke.cardinalConstrained = false;
    stroke.cardinalDirectionKey = "";
    stroke.freePlane = stroke.initialFreePlane;
    stroke.lastX = stroke.startX;
    stroke.lastY = stroke.startY;
  }
  if (!event.shiftKey) return event;
  if (stroke.midlineAligned) {
    stroke.cardinalConstrained = true;
    stroke.cardinalDirectionKey = `0,${Math.sign(event.clientY - stroke.startY)}`;
    return { clientX: stroke.startX, clientY: event.clientY, shiftKey: true };
  }
  const delta = eightWayScreenDelta(
    event.clientX - stroke.startX,
    event.clientY - stroke.startY
  );
  const directionKey = `${Math.sign(delta.x)},${Math.sign(delta.y)}`;
  if (!stroke.cardinalConstrained || directionKey !== stroke.cardinalDirectionKey) {
    stroke.samples = [stroke.samples[0]];
    stroke.freePlane = stroke.initialFreePlane;
    stroke.lastX = stroke.startX;
    stroke.lastY = stroke.startY;
    stroke.cardinalDirectionKey = directionKey;
  }
  stroke.cardinalConstrained = true;
  return {
    clientX: stroke.startX + delta.x,
    clientY: stroke.startY + delta.y,
    shiftKey: true
  };
}

function updateCurveSurfaceStroke(event) {
  const stroke = deps.sculptState.curveSurfaceDraft?.activeStroke;
  if (!stroke || event.pointerId !== stroke.pointerId) return;
  const sampleEvent = curveSurfaceStrokeEvent(stroke, event);
  const distance = Math.hypot(sampleEvent.clientX - stroke.lastX, sampleEvent.clientY - stroke.lastY);
  if (distance < 4) return;
  let nextSample = null;
  if (!stroke.freePlane) {
    const hit = deps.drawSurfaceHitFromEvent(sampleEvent);
    if (hit) nextSample = loftSurfaceSampleFromHit(hit);
    else if (deps.strokeSurfaceIsContextual(stroke.surfaceMode, stroke.dynamicContextual)) {
      stroke.freePlane = {
        origin: stroke.samples.at(-1).point.clone(),
        normal: deps.viewPlaneNormal(),
        plane: new THREE.Plane().setFromNormalAndCoplanarPoint(deps.viewPlaneNormal(), stroke.samples.at(-1).point)
      };
    }
  }
  if (stroke.freePlane && !nextSample) {
    const point = deps.rayFromViewportEvent(sampleEvent).intersectPlane(stroke.freePlane.plane, new THREE.Vector3());
    if (point) nextSample = { point, normal: stroke.freePlane.normal.clone(), onSurface: false };
  }
  if (stroke.midlineAligned && nextSample) nextSample.point.x = 0;
  if (!nextSample || nextSample.point.distanceTo(stroke.samples.at(-1).point) < 0.008) return;
  stroke.samples.push(nextSample);
  stroke.lastX = sampleEvent.clientX;
  stroke.lastY = sampleEvent.clientY;
  updateCurveSurfacePreview();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishCurveSurfaceStroke(event, { cancel = false } = {}) {
  const stroke = deps.sculptState.curveSurfaceDraft?.activeStroke;
  // Curve Surface owns the mouse stroke lifecycle. In some browsers a captured
  // canvas release is retargeted with a fresh mouse pointer id; accepting that
  // handoff prevents the next stroke from being treated as a continuation of
  // the previous one. Touch/pen pointers still require an exact match.
  const pointerMismatch = event?.pointerId !== undefined && event.pointerId !== stroke?.pointerId;
  const mouseHandoff = pointerMismatch && (!event?.pointerType || event.pointerType === "mouse");
  if (!stroke || (pointerMismatch && !mouseHandoff)) return false;
  deps.sculptState.curveSurfaceDraft.activeStroke = null;
  if (deps.renderer.domElement.hasPointerCapture?.(stroke.pointerId)) deps.renderer.domElement.releasePointerCapture(stroke.pointerId);
  deps.renderer.domElement.style.cursor = "";
  if (!cancel && stroke.samples.length < 2 && event?.clientX !== undefined && event?.clientY !== undefined) {
    const sampleEvent = curveSurfaceStrokeEvent(stroke, event);
    const hit = stroke.freePlane
      ? (() => {
          const point = deps.rayFromViewportEvent(sampleEvent).intersectPlane(stroke.freePlane.plane, new THREE.Vector3());
          return point ? { point, normal: stroke.freePlane.normal.clone(), onSurface: false } : null;
        })()
      : deps.drawSurfaceHitFromEvent(sampleEvent) || curveSurfaceFallbackHit(
        sampleEvent,
        stroke.surfaceMode,
        stroke.dynamicContextual
      );
    if (hit) {
      const sample = hit.contextualPlaneNormal
        ? { point: hit.point.clone(), normal: hit.contextualPlaneNormal.clone(), onSurface: false }
        : loftSurfaceSampleFromHit(hit);
      if (stroke.midlineAligned) sample.point.x = 0;
      if (sample.point.distanceTo(stroke.samples.at(-1).point) >= 0.008) stroke.samples.push(sample);
    }
  }
  const points = !cancel ? curveSurfaceProfilePoints(stroke.samples) : [];
  const normals = !cancel ? curveSurfaceProfileNormals(stroke.samples) : [];
  if (points.length >= 2 && curveSurfaceLineLength(points) >= 0.12) {
    const candidateCurves = [...deps.sculptState.curveSurfaceDraft.curves, points];
    const candidateGrid = buildCurveSurfaceGrid(candidateCurves, {
      rows: deps.sculptState.curveSurfaceDraft.rows || DEFAULT_CURVE_SURFACE_ROWS,
      stripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
      side: deps.sculptState.curveSurfaceDraft.side || curveSurfaceSideVector(candidateCurves[0], deps.sculptState.curveSurfaceDraft.drawPlaneNormal)
    });
    const candidateIndex = candidateCurves.length - 1;
    if (candidateGrid.rejectedCurveIndices.includes(candidateIndex)) {
      deps.sculptState.curveSurfaceDraft.lastError = "Curve was not added. Draw it beyond the current left or right boundary.";
    } else {
      deps.sculptState.curveSurfaceDraft.curves.push(points);
      deps.sculptState.curveSurfaceDraft.normals.push(normals);
      deps.sculptState.curveSurfaceDraft.lastError = "";
    }
  }
  deps.sculptState.curveSurfaceDraft.previewRejected = false;
  updateCurveSurfacePreview();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event?.preventDefault();
  return true;
}

function confirmCurveSurfaceDraft() {
  if (!deps.sculptState.curveSurfaceDraft?.curves?.length || deps.sculptState.curveSurfaceDraft.activeStroke) return false;
  const normal = deps.sculptState.curveSurfaceDraft.drawPlaneNormal || deps.viewPlaneNormal();
  const side = deps.sculptState.curveSurfaceDraft.side || curveSurfaceSideVector(deps.sculptState.curveSurfaceDraft.curves[0], normal);
  const grid = buildCurveSurfaceGrid(deps.sculptState.curveSurfaceDraft.curves, {
    rows: deps.sculptState.curveSurfaceDraft.rows || DEFAULT_CURVE_SURFACE_ROWS,
    stripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    side
  });
  if (!grid.orderedCurves.length) return false;
  const confirmedControlRows = curveSurfaceControlPointCount(grid.orderedCurves);
  const orderedSourceIndices = grid.sourceColumns
    .map((column, sourceIndex) => ({ column, sourceIndex }))
    .filter(({ column }) => Number.isInteger(column))
    .sort((a, b) => a.column - b.column)
    .map(({ sourceIndex }) => sourceIndex);
  const authoredControllerCurves = grid.orderedCurves.map((curve) => (
    resampleCurveSurfaceLine(curve, confirmedControlRows)
  ));
  const authoredControllerNormals = orderedSourceIndices.map((sourceIndex) => {
    const normals = deps.sculptState.curveSurfaceDraft.normals?.[sourceIndex] || [];
    return Array.from({ length: confirmedControlRows }, (_, row) => (
      normals.length
        ? deps.drawClumpSampleNormal(normals, row / Math.max(1, confirmedControlRows - 1))
        : null
    ));
  });
  const sourceCenterIndex = Math.max(0, grid.sourceColumns[0] - 1);
  const unifiedSurface = unifiedMirroredCurveSurface(
    authoredControllerCurves,
    authoredControllerNormals,
    sourceCenterIndex
  );
  const controllerCurves = unifiedSurface.curves;
  const controllerNormals = unifiedSurface.normals;
  const centerCurveIndex = unifiedSurface.centerIndex;
  const confirmedSide = unifiedSurface.side || side;
  const controllerPoints = controllerCurves
    .flat()
    .map((point) => new THREE.Vector3(point.x, point.y, point.z));
  const root = controllerPoints[centerCurveIndex * confirmedControlRows];
  deps.pushUndoState();
  const lock = deps.addLock("front", {
    geometryType: "curve-surface",
    curveSurfaceColumns: controllerCurves.length,
    curveSurfaceRows: confirmedControlRows,
    curveSurfaceSymmetric: deps.sculptState.mirrorXEditing,
    curveSurfaceCenterCurve: centerCurveIndex,
    curveSurfaceStripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    curveSurfaceSide: confirmedSide.clone(),
    scalpRegion: deps.scalpBuilder.scalpRegionNearestWorldPoint(root),
    hairCard: true,
    rootAttachmentEnabled: false,
    pointSurfaceNormals: controllerNormals.flat(),
    points: controllerPoints
  }, { deferUi: true });
  lock.curveSurfaceSource = {
    rows: confirmedControlRows,
    stripWidth: Number(deps.curveSurfaceStripWidthInput?.value || DEFAULT_CURVE_SURFACE_STRIP_WIDTH),
    side: deps.vectorToData(confirmedSide),
    curves: controllerCurves.map((curve, index) => ({
      attachment: index < centerCurveIndex ? "left" : index > centerCurveIndex ? "right" : "center",
      column: index,
      points: curve.map((point) => ({ ...point }))
    }))
  };
  lock.name = `Curve Surface ${deps.sel.lockIndex}`;
  deps.updateLockGeometry(lock);
  deps.sculptState.curveSurfaceDraft = null;
  hideCurveSurfacePreview();
  deps.renderLockList();
  deps.updateCount();
  deps.selectLock(lock.id);
  deps.setActiveTool("move");
  return true;
}

function commitCurveSurfaceDraft(event = null) {
  if (deps.sculptState.curveSurfaceDraft?.activeStroke) finishCurveSurfaceStroke(event);
  return confirmCurveSurfaceDraft();
}

function loftSurfaceSampleFromHit(hit) {
  const normal = deps.worldNormalAtHit(hit);
  return {
    point: hit.point.clone().addScaledVector(normal, 0.012),
    normal,
    onSurface: !hit.contextualPlaneNormal
  };
}

function beginLoftSurfaceStroke(event, hit) {
  if (
    event.button !== 0
    || !hit
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return false;
  if (!deps.miscState.loftSurfaceDraft) resetLoftSurfaceDraft();
  if (deps.miscState.loftSurfaceDraft.activeStroke) return false;
  const surfaceMode = deps.activeStrokeSurfaceValue();
  const dynamicContextual = deps.activeStrokeDynamicEnabled(surfaceMode);
  const contextualPlane = surfaceMode === "contextual-plane" ? deps.contextualPlaneAtOrigin() : null;
  deps.miscState.loftSurfaceDraft.activeStroke = {
    pointerId: event.pointerId,
    stage: deps.miscState.loftSurfaceDraft.horizontalPoints ? "vertical" : "horizontal",
    surfaceMode,
    dynamicContextual,
    samples: [loftSurfaceSampleFromHit(hit)],
    lastX: event.clientX,
    lastY: event.clientY,
    freePlane: contextualPlane
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = "crosshair";
  updateLoftSurfacePreview();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function beginLoftSurfaceFreePlane(stroke) {
  if (stroke.freePlane) return;
  const origin = stroke.samples.at(-1).point.clone();
  const normal = deps.viewPlaneNormal();
  stroke.freePlane = {
    origin,
    normal,
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, origin)
  };
}

function updateLoftSurfaceStroke(event) {
  const stroke = deps.miscState.loftSurfaceDraft?.activeStroke;
  if (!stroke || event.pointerId !== stroke.pointerId) return;
  const screenDistance = Math.hypot(event.clientX - stroke.lastX, event.clientY - stroke.lastY);
  if (screenDistance < 4) return;
  let nextSample = null;
  if (!stroke.freePlane) {
    const hit = deps.drawSurfaceHitFromEvent(event);
    if (hit) nextSample = loftSurfaceSampleFromHit(hit);
    else if (deps.strokeSurfaceIsContextual(stroke.surfaceMode, stroke.dynamicContextual)) beginLoftSurfaceFreePlane(stroke);
  }
  if (stroke.freePlane && !nextSample) {
    const point = deps.rayFromViewportEvent(event).intersectPlane(stroke.freePlane.plane, new THREE.Vector3());
    if (point) {
      nextSample = {
        point,
        normal: stroke.freePlane.normal.clone(),
        onSurface: false
      };
    }
  }
  if (!nextSample || nextSample.point.distanceTo(stroke.samples.at(-1).point) < 0.008) return;
  stroke.samples.push(nextSample);
  stroke.lastX = event.clientX;
  stroke.lastY = event.clientY;
  updateLoftSurfacePreview();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishLoftSurfaceStroke(event, options = {}) {
  const stroke = deps.miscState.loftSurfaceDraft?.activeStroke;
  if (!stroke || (event?.pointerId !== undefined && event.pointerId !== stroke.pointerId)) return false;
  deps.miscState.loftSurfaceDraft.activeStroke = null;
  if (deps.renderer.domElement.hasPointerCapture?.(stroke.pointerId)) {
    deps.renderer.domElement.releasePointerCapture(stroke.pointerId);
  }
  deps.renderer.domElement.style.cursor = "";
  const validStroke = !options.cancel
    && stroke.samples.length >= 2
    && deps.strokeLength(stroke.samples) >= 0.12;
  if (!validStroke) {
    updateLoftSurfacePreview();
    deps.updateInteractionLocks();
    deps.updatePlacementStatus();
    event?.preventDefault();
    return true;
  }
  const profilePoints = loftSurfaceProfilePoints(stroke.samples);
  if (stroke.stage === "horizontal") {
    deps.miscState.loftSurfaceDraft.horizontalPoints = profilePoints;
    updateLoftSurfacePreview();
    deps.updateInteractionLocks();
    deps.updatePlacementStatus();
    event?.preventDefault();
    return true;
  }
  const latticeData = createLoftSurfaceLatticePointData({
    horizontalPoints: deps.miscState.loftSurfaceDraft.horizontalPoints,
    verticalPoints: profilePoints,
    columns: DEFAULT_SURFACE_LATTICE_COLUMNS,
    rows: DEFAULT_SURFACE_LATTICE_ROWS
  });
  const points = latticeData.map((point) => new THREE.Vector3(point.x, point.y, point.z));
  if (points.length) {
    deps.pushUndoState();
    const root = points[0];
    const lock = createSurfaceLockFromLattice(points, {
      namePrefix: "Loft Surface",
      scalpRegion: deps.scalpBuilder.scalpRegionNearestWorldPoint(root)
    });
    deps.miscState.loftSurfaceDraft = null;
    hideLoftSurfacePreviews();
    if (lock) {
      deps.renderLockList();
      deps.updateCount();
      deps.selectLock(lock.id);
      deps.setActiveTool("move");
    }
  }
  deps.updateInteractionLocks();
  deps.updateAttributeEditorMode();
  deps.updatePlacementStatus();
  event?.preventDefault();
  return true;
}

function scaleSurfaceLatticeWidth(lock, previousWidth, nextWidth) {
  if (lock?.geometryType !== "surface" || !lock.points?.length) return;
  const ratio = Math.max(0.001, Number(nextWidth)) / Math.max(0.001, Number(previousWidth));
  const columns = normalizeSurfaceLatticeCount(lock.surfaceColumns, DEFAULT_SURFACE_LATTICE_COLUMNS);
  const rows = normalizeSurfaceLatticeCount(lock.surfaceRows, DEFAULT_SURFACE_LATTICE_ROWS);
  const centerColumn = Math.floor(columns / 2);
  for (let row = 0; row < rows; row += 1) {
    const center = lock.points[surfaceLatticePointIndex(row, centerColumn, columns, rows)];
    for (let column = 0; column < columns; column += 1) {
      const point = lock.points[surfaceLatticePointIndex(row, column, columns, rows)];
      if (point && center) point.copy(center).add(point.clone().sub(center).multiplyScalar(ratio));
    }
  }
}

function resampleSurfaceLock(lock, nextColumns, nextRows) {
  if (lock?.geometryType !== "surface") return false;
  const columns = normalizeSurfaceLatticeCount(lock.surfaceColumns, DEFAULT_SURFACE_LATTICE_COLUMNS);
  const rows = normalizeSurfaceLatticeCount(lock.surfaceRows, DEFAULT_SURFACE_LATTICE_ROWS);
  const targetColumns = normalizeSurfaceLatticeCount(nextColumns, columns);
  const targetRows = normalizeSurfaceLatticeCount(nextRows, rows);
  if (columns === targetColumns && rows === targetRows) return false;
  const pointData = resampleSurfaceLatticePointData(
    lock.points,
    columns,
    rows,
    targetColumns,
    targetRows
  );
  const normalData = resampleSurfaceLatticePointData(
    lock.points.map((_, index) => lock.pointSurfaceNormals?.[index] || new THREE.Vector3(0, 0, 1)),
    columns,
    rows,
    targetColumns,
    targetRows
  );
  if (pointData.length !== targetColumns * targetRows) return false;
  lock.surfaceColumns = targetColumns;
  lock.surfaceRows = targetRows;
  lock.points = pointData.map((point) => new THREE.Vector3(point.x, point.y, point.z));
  lock.pointSurfaceNormals = normalData.map((normal) => new THREE.Vector3(
    normal.x,
    normal.y,
    normal.z
  ).normalize());
  lock.pointScales = lock.points.map(() => ({ x: 1, z: 1 }));
  lock.pointWidths = lock.points.map(() => 1);
  lock.pointTwists = lock.points.map(() => 0);
  lock.x = lock.points[0].x;
  lock.y = lock.points[0].y;
  lock.z = lock.points[0].z;
  lock.length = lock.points[0].distanceTo(lock.points.at(-1));
  lock.curve = lock.points.at(-1).x - lock.points[0].x;
  deps.rebuildCurveObjects(lock);
  deps.updateLockGeometry(lock, { immediate: true });
  deps.updateCurveObjects(lock, { visible: lock.id === deps.sel.selectedId });
  deps.syncActiveMirror(lock, { refreshUi: true });
  deps.updateTopologyStats();
  return true;
}
  return {
    curveSurfaceControllerCurves,
    curveSurfaceControllerFrameLock,
    sampledCurveSurfaceControllerCurves,
    sampledCurveSurfaceControllerSides,
    activeCurveSurfaceControllerIndex,
    curveSurfaceControllerPointRange,
    curveSurfaceControllerPreviewRows,
    curveSurfaceControllerSegments,
    curveSurfaceControllerIndexNearPoint,
    curveSurfaceControllerHitFromEvent,
    surfaceLatticeNormal,
    createSurfaceLockFromLattice,
    createViewportSurface,
    loftSurfaceProfilePoints,
    hideLoftSurfacePreviews,
    updateLoftSurfaceDraftUi,
    updateLoftSurfacePreview,
    resetLoftSurfaceDraft,
    cancelLoftSurfaceDraft,
    cloneCurveSurfaceSource,
    curveSurfaceSourceForSnapshot,
    mirroredCurveSurfaceSource,
    curveSurfaceProfilePoints,
    curveSurfaceProfileNormals,
    curveSurfacePreviewLock,
    curveSurfaceCardWireSegments,
    hideCurveSurfacePreview,
    curveSurfaceCurveAverageX,
    curveSurfaceCurvesMatch,
    unifiedMirroredCurveSurface,
    curveSurfaceSideVector,
    curveSurfaceDraftCurves,
    curveSurfaceFallbackHit,
    updateCurveSurfaceDraftUi,
    updateCurveSurfacePreview,
    resetCurveSurfaceDraft,
    cancelCurveSurfaceDraft,
    beginCurveSurfaceStroke,
    curveSurfaceStrokeEvent,
    updateCurveSurfaceStroke,
    finishCurveSurfaceStroke,
    confirmCurveSurfaceDraft,
    commitCurveSurfaceDraft,
    loftSurfaceSampleFromHit,
    beginLoftSurfaceStroke,
    beginLoftSurfaceFreePlane,
    updateLoftSurfaceStroke,
    finishLoftSurfaceStroke,
    scaleSurfaceLatticeWidth,
    resampleSurfaceLock,
  };
}
