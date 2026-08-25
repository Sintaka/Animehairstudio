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
  sculptTwistBrushDeltas,
  smoothSculptPointDeltas,
  smoothSculptTwistDeltas
} from "../sculpt/sculpt-brush.js?v=20260814-12";
import { sampleArray } from "./curve-math.js?v=20260910-5";
import {
  DEFAULT_SURFACE_LATTICE_COLUMNS,
  DEFAULT_SURFACE_LATTICE_ROWS,
  normalizeSurfaceLatticeCount,
  surfaceLatticePointIndex
} from "./surface-lattice.js?v=20260814-12";
// Width Brush 紫色分支（刷 panel/发丝自己的 WidthCurve）复用的纯函数内核：与绿色
// tip-width 笔刷（bone-interaction.js）同一个模块、同一版本号。见 width-brush.js 文件头
// 关于「为什么这个内核独立成文件」的说明（dom-contract 冻结了 sculpt-brush.js 的版本串）。
import { nearestScreenCandidate, sculptWidthBrushMultiplier, smoothLinearScalarDeltas, SCULPT_WIDTH_BRUSH_VALUE_FLOOR } from "../sculpt/width-brush.js?v=20260910-10";
// 紫色曲线自己的钳位区间 [0, TAPER_VALUE_MAX]（手动拖拽 taper-editor.js:1032 同一个上界）。
// **不要**跟绿色 tip-width 的 TIP_WIDTH_VALUE_MIN/MAX 混用 —— 那是另一套曲线的区间。
import { TAPER_VALUE_MAX } from "../core/app-config.js?v=20260815-4";

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
  //   updateCurveObjects/rebuildLockGeometry/flushPendingLockGeometryUpdates/undoHistory).
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
  // reverseTool 白名单 = 「Ctrl 是反向修饰键、因此不该被当成 orbit 而早退」的笔刷。
  // sculpt-width 在列（Ctrl = 加宽，见 index.html 的 tooltip 与 width-brush.js 文件头）。
  const reverseTool = ["sculpt-slide", "sculpt-scale", "sculpt-push", "sculpt-orient", "sculpt-twist", "sculpt-width"].includes(deps.sel.activeTool);
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
    // Twist snapshots the influence for the same reason move does, but for a different
    // goal: its affected point set must stay FIXED for the whole stroke (see the
    // fixedMoveBrushInfluence comment). The capture is tool-agnostic — plain cursor
    // weights at the stroke-start position — so reusing it here is safe.
    moveInfluence: ["sculpt-move", "sculpt-twist"].includes(deps.sel.activeTool)
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

// ── Width Brush 紫色分支（sculpt-width 刷 panel/发丝自己的 WidthCurve） ───────────────────
// 用户拍板的情况 1（选中发丝/主发片）与情况 3（未选中任何东西）在这里塌缩成同一条路径：
// stroke.units 已经过 sculptBrushEditableLock -> deps.sculptBrushSelectionAllows 过滤
// （:288-319 的 sculptBrushUnits），选中则限定、未选中则放行——本函数不用自己判断选中态。
// 情况 2（选中发尖）已在下面调用点更早的 deps.applySubBoneBrushSample 分支处理并早退，
// 不会走到这里；两个分支互斥（发尖分支优先）。
//
// 方案 C（用户拍板）：只推既有关键点，按屏幕距离取最近的一个，不插点、不重新拟合曲线——
// 候选点来自 taperEditor.taperCurveBrushCandidates，与紫色手柄在视口的绘制
// （addTaperMeshPointsForCurve）同一条几何公式，笔刷与手柄按构造一致（不是靠守卫）。
//
// 未命中任何候选点也要 return true（而非 false）：sculpt-width 激活时必须独占这一笔，
// 不能落到下面的通用 move 主体去移动链点——宁可什么都不做，也不能让宽度笔刷去移动链点
// （那正是本轮要修的"静默退化成 Move"）。
function applyWidthCurveBrushSample(stroke, clientX, clientY, deltaX, deltaY) {
  if (deps.effectiveSculptBrushTool() !== "sculpt-width") return false;
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const cursor = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
  const radius = Number(deps.sculptBrushRadiusInput.value);
  const falloff = Number(deps.sculptBrushFalloffInput.value);
  const strength = Number(
    deps.sculptBrushStrengthByTool[deps.effectiveSculptBrushTool()]
    ?? deps.sculptBrushStrengthInput.value
  );
  const reverse = Boolean(stroke.reverse);
  // 候选点汇总：source 与 partner（若镜像存在）都枚举，可见性判据与主体循环的逐点权重
  // 同一份（sourceVisible/partnerVisible 来自 sculptBrushUnits 的同一次视锥/半空间判定），
  // 而不是自己另写一套。candidate 带 lock 引用，写回时才知道该改哪个 lock 的哪条数组。
  const candidates = [];
  stroke.units.forEach(({ source, partner, sourceVisible, partnerVisible }) => {
    if (sourceVisible) {
      deps.taperEditor.taperCurveBrushCandidates(source, rect).forEach((candidate) => {
        candidates.push({ ...candidate, lock: source });
      });
    }
    if (partner && partnerVisible) {
      deps.taperEditor.taperCurveBrushCandidates(partner, rect).forEach((candidate) => {
        candidates.push({ ...candidate, lock: partner });
      });
    }
  });
  const nearest = nearestScreenCandidate(candidates, cursor.x, cursor.y, radius);
  if (!nearest) return true;
  const target = nearest.candidate;
  // 权重按屏幕距离衰减，用其它笔刷同一个 falloff 内核（与绿色 tip-width 分支的
  // bone-interaction.js:932 同一行为，taperCurveBrushCandidates 已经投影过一次，这里
  // 不重复投影）。
  const weight = sculptBrushWeight(nearest.distance, radius, falloff);
  if (!(weight > 0)) return true;
  const curveArray = target.curveSide === "secondary"
    ? target.lock.taperCurveSecondary
    : target.lock.taperCurve;
  const point = curveArray?.[target.pointIndex];
  if (!point) return true;
  const nextValue = sculptWidthBrushMultiplier(
    point.value,
    Math.hypot(deltaX, deltaY),
    weight,
    strength,
    // 紫色自己的钳位区间 [SCULPT_WIDTH_BRUSH_VALUE_FLOOR, TAPER_VALUE_MAX]（上界同手动拖拽
    // taper-editor.js:1032）。绝不能落回 sculptWidthBrushMultiplier 的默认区间（绿色
    // TIP_WIDTH_VALUE_MIN/MAX）—— 那会让笔刷写出手动拖拽写不出的值。
    // 下界从 0 抬到 floor（而非沿用手动拖拽允许的 0）：乘法模型 `current × (1 + amount)`
    // 在 0 是吸收态（0 × 任何倍数都还是 0），笔刷一旦把某个关键点写到 0 就会永久卡死、
    // 连 Ctrl 加宽都救不回来——普通发丝末端的默认值恰好就是 0（DEFAULT_TAPER_CURVE），
    // 于是第一笔刷到末端就复现这个 bug。手动 2D 曲线编辑器（taper-editor.js）刻意不跟着
    // 抬：它是独立输入通道、单点绝对赋值，没有乘法吸收态的问题，抬它的下界只会限制用户
    // 手动收尖到 0 的合法操作，对本 bug 无意义。笔刷写一个比手动更窄的子集（永不落到 0）
    // 是更安全的方向，不是反过来。
    { reverse, min: SCULPT_WIDTH_BRUSH_VALUE_FLOOR, max: TAPER_VALUE_MAX }
  );
  // undo 捕获必须在"确认要写"之后才推（不是每次采样都推）——权重 <= 0 或候选点缺失的
  // 早退分支都在它之前，不会产生空 undo 步骤。
  if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
  point.value = nextValue;
  // 几何重建：手动拖拽的调用链是 updateTaperMeshPointDrag 写 point.value ->
  // scheduleTaperCurveEdit -> (rAF) -> applyTaperCurveEdit -> editSelectedLocks ->
  // updateLockGeometry/rebuildLockGeometry。那一层 scheduleTaperCurveEdit/editSelectedLocks
  // 绑定的是"当前打开的 2D 曲线编辑器目标"（deps.sculptState.taperCurveEdit.id）且会把
  // 曲线传播给其它被选中的发丝——笔刷可能同一笔触碰多个未打开编辑器的发丝/panel，套用那层
  // 会改错 lock，还会把这一根的曲线意外扩散给其它被选中的发丝（多选传播是编辑器自己的
  // 功能，不该是笔刷的副作用）。故直接调用两条调用链共同落到的同一个原语
  // rebuildLockGeometry（本文件其它笔刷分支——queueSculptBrushGeometryUpdate 排队调用的也
  // 是它——同一个函数，默认 options 已包含 updateCurveObjects）。
  deps.rebuildLockGeometry(target.lock);
  deps.syncActiveMirror(target.lock, { deferGeometry: false });
  deps.updateTopologyStats();
  stroke.editedLockIds.add(target.lock.id);
  return true;
}

// Shift 临时平滑（Width Brush 特化，"width" 自由度）用：给紫色 WidthCurve 的某一条 value
// 数组算出「逐关键点」的笔刷权重。**不能**复用逐链点的 smoothingWeights——那是按屏幕距离对
// 链点算的，WidthCurve 的关键点是曲线数组自己的下标，两者不是同一个索引空间（前者长度=
// 链点数，后者长度=控制点数，见任务里"权重"一节）。做法与其它笔刷取权重的方式完全一致：
// 候选点的屏幕坐标（candidates 来自 taperEditor.taperCurveBrushCandidates，与紫色手柄同一条
// 投影公式）与光标算距离，过 sculptBrushWeight——即 applyWidthCurveBrushSample 取权重
// （:601 nearest.distance -> sculptBrushWeight）的同一条路径，只是这里要给**每一个**关键点
// 都算一份（笔刷推单点，平滑要动一整条邻域）。
// candidates 只传该 lock 自己的候选列表（source 用 source 的、partner 用 partner 的）——
// 不同 lock 各自独立一条 taperCurve，混用会把权重错配到另一条曲线的关键点上。
function widthCurveKeypointWeights(curveArray, candidates, curveSide, cursor, radius, falloff) {
  return curveArray.map((_, pointIndex) => {
    let best = 0;
    (candidates || []).forEach((candidate) => {
      if (candidate.curveSide !== curveSide || candidate.pointIndex !== pointIndex) return;
      const distance = Math.hypot(candidate.x - cursor.x, candidate.y - cursor.y);
      const weight = sculptBrushWeight(distance, radius, falloff);
      if (weight > best) best = weight;
    });
    return best;
  });
}

function applySculptMoveStrokeSample(stroke, clientX, clientY) {
  const deltaX = clientX - stroke.lastX;
  const deltaY = clientY - stroke.lastY;
  stroke.lastX = clientX;
  stroke.lastY = clientY;
  if (Math.abs(deltaX) + Math.abs(deltaY) < 0.01) return;

  // Selected sub-bone brush (masked to that sub-bone; scale centers on its exposed root).
  if (deps.applySubBoneBrushSample(stroke, clientX, clientY, deltaX, deltaY)) return;
  // Width Brush 紫色分支（情况 1/3，见上方函数头注释）：发尖分支优先（情况 2），紫色在其
  // 后面接管。两者互斥，返回 true 即消费掉这一笔——不落到下面的通用 move 主体。
  if (applyWidthCurveBrushSample(stroke, clientX, clientY, deltaX, deltaY)) return;

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
  const twistBrushActive = deps.effectiveSculptBrushTool() === "sculpt-twist";
  // Shift 临时平滑的自由度分派（用户拍板的加法特化）：只有「Shift 临时切到 smooth」且
  // 「底层选中的是登记过的特化笔刷」时才非 undefined。用户主动选中 sculpt-smooth 作为工具
  // 时，sel.activeTool 恒为 "sculpt-smooth"，从未登记在表里 ⇒ 查表结果仍是 undefined，
  // 下面 `if (!shiftSmoothFreedom)` 落回原有默认分支，一个字节不变（加法约束）。
  const shiftSmoothFreedom = deps.sculptState.sculptBrushShiftSmoothHeld
    ? deps.sculptBrushShiftSmoothFreedomByTool[deps.sel.activeTool]
    : undefined;
  const reverse = Boolean(stroke.reverse);
  const preserveTips = Boolean(deps.sculptBrushPreserveTipsByTool[deps.sel.activeTool]);
  // Twist joins move in reading the stroke-START influence snapshot: once the button goes
  // down its affected point set must stay FIXED for the whole stroke (user requirement), so
  // rolling continues on exactly the points picked at mousedown even as the cursor moves
  // away. Orient is the contrast case — it keeps tracking the cursor per sample.
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
      // Twist is applied after this loop: H-mode propagation needs the whole weight array
      // (downstream points have not been visited yet at this iteration).
      if (twistBrushActive) continue;
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
    if (twistBrushActive && pointWeights.some((pointWeightValue) => pointWeightValue > 0)) {
      // Manual axial roll: drag-driven, NO camera term. Positions are never written — only
      // the pointTwists scalars, exactly like the orient brush's write target.
      if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
      if (!source.pointTwists) source.pointTwists = source.points.map(() => 0);
      const range = deps.curveSurfaceControllerPointRange
        ? deps.curveSurfaceControllerPointRange(source)
        : { start: 0, end: source.points.length };
      const deltas = sculptTwistBrushDeltas(source.points.length, pointWeights, {
        deltaX,
        strength,
        reverse,
        // H mode carries the roll to the downstream sub-chain WITHOUT moving it: the same
        // scalar delta accumulates into every later point in range, so no position or axis
        // is re-chained (that is what applyHierarchicalRotate does, and why it is not used).
        hierarchy: Boolean(deps.sculptState.hierarchyEditing),
        rangeStart: range.start,
        rangeEnd: range.end,
        firstIndex: 1
      });
      deltas.forEach((delta, pointIndex) => {
        if (!delta) return;
        source.pointTwists[pointIndex] = (Number(source.pointTwists[pointIndex]) || 0) + delta;
        sourceChanged = true;
      });
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

    // ★加法约束（用户拍板）：这条 if 的判据从 `smoothBrushActive` 收窄成
    // `smoothBrushActive && !shiftSmoothFreedom`——多加的这半句是本条件唯一的改动，块内一个
    // 字节没动。shiftSmoothFreedom 只在「Shift 临时切到 smooth」且「底层选中的是登记过的
    // 特化笔刷」时才非 undefined（定义处见上方，deps.sculptState.sculptBrushShiftSmoothHeld
    // && deps.sculptBrushShiftSmoothFreedomByTool[deps.sel.activeTool]）。用户主动选中
    // sculpt-smooth 作为工具：sel.activeTool 恒为 "sculpt-smooth"，从未登记在表里，
    // shiftSmoothFreedom 恒 undefined ⇒ `!shiftSmoothFreedom` 恒真 ⇒ 走的仍是这条原有分支，
    // 行为不变。真正的新增分派见下面紧接着的 `if (smoothBrushActive && shiftSmoothFreedom)`。
    if (smoothBrushActive && !shiftSmoothFreedom) {
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
    // ── Shift 临时平滑的特化自由度分派（本轮新增，纯加法：上面 smoothBrushActive 块的判据
    // 已经把这三种情况都排除在外，两块互斥，不会重复处理同一次采样）───────────────────────
    if (smoothBrushActive && shiftSmoothFreedom === "twist") {
      // 只平滑 twist/orient 共用的标量字段，位置完全不动（用户拍板决定 2）。
      const smoothingWeights = deps.sculptState.proportionalEditing
        ? proportionalSculptWeights(
            pointWeights,
            Number(deps.proportionalRadiusInput.value),
            Number(deps.proportionalFalloffInput.value)
          )
        : pointWeights;
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
    } else if (smoothBrushActive && shiftSmoothFreedom === "width") {
      // 只平滑紫色 WidthCurve 的 value 序列，位置与 twist 都不动（用户拍板决定 1 的姊妹条款：
      // width 笔刷的 Shift 平滑动的是曲线数据，不是链点）。source 与 partner（镜像存在时）各
      // 自的 taperCurve/taperCurveSecondary 都要处理——与 applyWidthCurveBrushSample 枚举
      // candidates 时 source+partner 都纳入的既有约定一致。
      const rect = deps.renderer.domElement.getBoundingClientRect();
      const cursor = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
      [source, partner].filter(Boolean).forEach((widthLock) => {
        const candidates = deps.taperEditor.taperCurveBrushCandidates(widthLock, rect);
        const asymmetric = Boolean(widthLock.asymmetricWidthCurve);
        const curveTargets = asymmetric
          ? [
              { curveArray: widthLock.taperCurve, curveSide: "primary" },
              { curveArray: widthLock.taperCurveSecondary, curveSide: "secondary" }
            ]
          : [{ curveArray: widthLock.taperCurve, curveSide: "primary" }];
        curveTargets.forEach(({ curveArray, curveSide }) => {
          if (!Array.isArray(curveArray) || curveArray.length < 2) return;
          const keypointWeights = widthCurveKeypointWeights(curveArray, candidates, curveSide, cursor, radius, falloff);
          const values = curveArray.map((point) => Number(point.value) || 0);
          const widthDeltas = smoothLinearScalarDeltas(values, keypointWeights, strength);
          let widthChanged = false;
          widthDeltas.forEach((delta, pointIndex) => {
            if (!delta) return;
            if (!stroke.undoCaptured) {
              deps.pushUndoState();
              stroke.undoCaptured = true;
            }
            // 紫色自己的钳位区间 [0, TAPER_VALUE_MAX]（与 applyWidthCurveBrushSample 手动拖拽
            // /笔刷推点同一个上界，:616），不能落回 width-brush.js 默认的绿色 TIP_WIDTH 区间。
            curveArray[pointIndex].value = Math.min(
              TAPER_VALUE_MAX,
              Math.max(0, curveArray[pointIndex].value + delta)
            );
            widthChanged = true;
          });
          if (widthChanged) {
            deps.rebuildLockGeometry(widthLock);
            deps.syncActiveMirror(widthLock, { deferGeometry: false });
            stroke.editedLockIds.add(widthLock.id);
          }
        });
      });
      deps.updateTopologyStats();
    } else if (smoothBrushActive && shiftSmoothFreedom === "axis") {
      // push/slide 的 Shift 平滑：位置平滑算出的 delta 投影到该笔刷自己的方向轴上，只施加
      // 投影分量（用户拍板决定 1）。axis 取法照抄 slideBrushActive/pushBrushActive 分支现成
      // 的算法（:718-751），不重新实现 guidedNormalAt 的调用方式。
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
      const curve = stroke.originalCurves?.get(source.id);
      if (curve) {
        smoothDeltas.forEach((delta, pointIndex) => {
          if (pointIndex === 0 || (delta.x === 0 && delta.y === 0 && delta.z === 0)) return;
          const t = pointIndex / Math.max(1, source.points.length - 1);
          const tangent = curve.getTangent(t).normalize();
          let axis;
          if (deps.sel.activeTool === "sculpt-slide") {
            axis = tangent;
          } else {
            // sculpt-push：与 pushBrushActive 分支（:722-724）同一条公式取 up 轴。
            const point = curve.getPoint(t);
            axis = deps.guidedNormalAt(source, point, tangent, t)
              .applyAxisAngle(tangent, sampleArray(source.pointTwists || [], t))
              .normalize();
          }
          const deltaVec = new THREE.Vector3(delta.x, delta.y, delta.z);
          const projected = axis.clone().multiplyScalar(deltaVec.dot(axis));
          if (projected.x === 0 && projected.y === 0 && projected.z === 0) return;
          if (!stroke.undoCaptured) {
            deps.pushUndoState();
            stroke.undoCaptured = true;
          }
          source.points[pointIndex].x += projected.x;
          source.points[pointIndex].y += projected.y;
          source.points[pointIndex].z += projected.z;
          const basePoint = source.groupLatticeBasePoints?.[pointIndex];
          if (basePoint) {
            basePoint.x += projected.x;
            basePoint.y += projected.y;
            basePoint.z += projected.z;
          }
          sourceChanged = true;
        });
      }
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
