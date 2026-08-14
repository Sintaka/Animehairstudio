// poly-tools.js - poly topology editing tools (refactor 3d batch G7).
// Extracted from app.js; coupling injected via createPolyToolsApi(deps).
import * as THREE from "three";
import {
  appendPolyQuad,
  deletePolyEdge,
  deletePolyFaceAndOrphans,
  deletePolyVertex,
  normalizePolyFaces,
  polyFillCandidate,
  relaxPolyPoints
} from "./poly-topology.js?v=20260814-12";


export function createPolyToolsApi(deps) {
  // deps: store state proxies (sel/draw/sculptState/hairState) + shared objects (locks/curveGroup/renderer/
  // raycaster/undoHistory/lastPointer/polyRelaxProjectionRaycaster/guideApi) + DOM elements (viewportDrawLayerInput/
  // polyBrushWidthInput/polyBrushSpacingInput/polyBrushSurfaceOffsetInput) + app.js helper functions; full list:
  // devlog/in-progress/g7-poly-refactor-map.md section 4.

function selectedPolyMesh() {
  const lock = deps.getSelectedLock();
  return lock?.geometryType === "poly" ? lock : null;
}

function addPolyLock() {
  const lock = deps.addLock("front", {
    geometryType: "poly",
    points: [],
    polyFaces: [],
    scalpRegion: "unassigned",
    hairLayer: deps.normalizeHairLayer(deps.viewportDrawLayerInput.value),
    materialId: deps.hairState.activeHairMaterialId,
    rootAttachmentEnabled: false,
    width: Number(deps.polyBrushWidthInput.value),
    depth: 0.01
  }, { deferUi: true });
  lock.name = `Poly Mesh ${deps.sel.lockIndex}`;
  deps.selectLock(lock.id);
  deps.renderLockList();
  deps.updateCount();
  return lock;
}

function ensurePolyMesh() {
  return selectedPolyMesh() || addPolyLock();
}

function polySurfaceSample(event, { root = false } = {}) {
  const lock = selectedPolyMesh();
  const hit = deps.drawSurfaceHitFromEvent(event, { root, excludeLockId: lock?.id || null });
  if (!hit) return null;
  const normal = deps.worldNormalAtHit(hit);
  return {
    point: hit.point.clone().addScaledVector(normal, Number(deps.polyBrushSurfaceOffsetInput.value)),
    normal
  };
}

function polyTargetAtEvent(event) {
  const lock = selectedPolyMesh();
  if (!lock) return null;
  deps.rayFromViewportEvent(event);
  const handles = lock.curveObjects?.handles?.filter((handle) => handle.visible) || [];
  const vertexHit = deps.raycaster.intersectObjects(handles, false)[0];
  if (vertexHit) {
    return { type: "vertex", index: vertexHit.object.userData.polyVertexIndex };
  }
  const edges = lock.curveObjects?.edgePickers?.filter((edge) => edge.visible) || [];
  const edgeHit = deps.raycaster.intersectObjects(edges, false)[0];
  if (edgeHit) {
    return {
      type: "edge",
      vertices: [...edgeHit.object.userData.polyEdge],
      boundary: Boolean(edgeHit.object.userData.polyBoundary)
    };
  }
  const faceHit = lock.mesh.visible ? deps.raycaster.intersectObject(lock.mesh, false)[0] : null;
  if (faceHit) {
    const quadId = lock.mesh.geometry.userData.triangleQuadIds?.[faceHit.faceIndex];
    if (Number.isInteger(quadId)) return { type: "face", index: quadId };
  }
  return null;
}

function refreshPolyMesh(lock) {
  lock.polyFaces = normalizePolyFaces(lock.points, lock.polyFaces);
  deps.fitPointAttributes(lock, lock.points.length);
  deps.updateLockGeometry(lock, { immediate: true });
  deps.updateCurveObjects(lock, { visible: true });
  deps.updateTopologyStats();
  deps.renderLockList();
}

function ensurePolyFillPreview() {
  if (deps.draw.polyFillPreviewGroup) return deps.draw.polyFillPreviewGroup;
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      color: 0xff4fd8,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false
    })
  );
  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 0xff8be6,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false
    })
  );
  mesh.renderOrder = 30;
  outline.renderOrder = 31;
  mesh.raycast = () => {};
  outline.raycast = () => {};
  group.add(mesh, outline);
  group.visible = false;
  group.userData.mesh = mesh;
  group.userData.outline = outline;
  deps.curveGroup.add(group);
  deps.draw.polyFillPreviewGroup = group;
  return group;
}

function clearPolyFillPreview() {
  deps.draw.polyFillPreviewCandidate = null;
  if (deps.draw.polyFillPreviewGroup) deps.draw.polyFillPreviewGroup.visible = false;
}

function polyFillCandidateForEvent(event) {
  const lock = selectedPolyMesh();
  if (!lock) return null;
  const sample = polySurfaceSample(event);
  if (!sample) return null;
  const maxDistance = Math.max(
    0.16,
    Number(deps.polyBrushWidthInput.value) * 2.5,
    Number(deps.polyBrushSpacingInput.value) * 2.5
  );
  const candidate = polyFillCandidate(
    lock.points,
    lock.polyFaces,
    sample.point,
    sample.normal,
    { maxDistance }
  );
  return candidate ? { lock, candidate } : null;
}

function showPolyFillPreview(lock, candidate) {
  const face = candidate.faces.at(-1);
  if (!face?.every((index) => lock.points[index])) {
    clearPolyFillPreview();
    return;
  }
  const group = ensurePolyFillPreview();
  const positions = face.flatMap((index) => lock.points[index].toArray());
  const mesh = group.userData.mesh;
  const outline = group.userData.outline;
  mesh.geometry.dispose();
  mesh.geometry = new THREE.BufferGeometry();
  mesh.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  mesh.geometry.setIndex([0, 1, 2, 0, 2, 3]);
  mesh.geometry.computeVertexNormals();
  outline.geometry.dispose();
  outline.geometry = new THREE.BufferGeometry();
  outline.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  deps.draw.polyFillPreviewCandidate = {
    lockId: lock.id,
    kind: candidate.kind,
    vertices: [...face]
  };
  group.visible = true;
}

function updatePolyFillPreview(event) {
  if (
    deps.sel.activeTool !== "poly"
    || !event.shiftKey
    || event.altKey
    || event.ctrlKey
    || event.metaKey
    || deps.sculptState.polyBrushStroke
    || (event.buttons ?? 0) !== 0
  ) {
    clearPolyFillPreview();
    return;
  }
  if (polyTargetAtEvent(event)) {
    clearPolyFillPreview();
    return;
  }
  const result = polyFillCandidateForEvent(event);
  if (!result) {
    clearPolyFillPreview();
    return;
  }
  showPolyFillPreview(result.lock, result.candidate);
}

function refreshPolyFillPreviewFromLastPointer() {
  if (!deps.draw.polyShiftPreviewHeld || deps.sel.activeTool !== "poly") return;
  updatePolyFillPreview({
    clientX: deps.lastPointer.x,
    clientY: deps.lastPointer.y,
    shiftKey: true,
    buttons: 0
  });
}

function fillPolyGap(event) {
  const result = polyFillCandidateForEvent(event);
  if (!result) return false;
  const { lock, candidate } = result;
  clearPolyFillPreview();
  deps.pushUndoState();
  lock.polyFaces = candidate.faces;
  refreshPolyMesh(lock);
  return true;
}

function polyRelaxSurfaceObjects(lock) {
  const surfaceMode = deps.activeStrokeSurfaceValue();
  const guideSurface = deps.liveSurfaceGuide(surfaceMode);
  if (guideSurface) {
    return [guideSurface.mesh, guideSurface.rootMesh]
      .filter((object) => object && object.visible !== false);
  }
  const strandSurface = deps.liveSurfaceStrand(surfaceMode);
  if (strandSurface && strandSurface.id !== lock.id && strandSurface.mesh.visible !== false) {
    return [strandSurface.mesh];
  }
  if (surfaceMode === "lattice") {
    const lattice = deps.selectedCurveLatticeGuide();
    return lattice
      ? [lattice.mesh, lattice.rootMesh].filter((object) => object && object.visible !== false)
      : [];
  }
  return deps.headMeshes().filter((object) => object.visible !== false);
}

function projectPolyRelaxPoint(lock, point, preferredNormal) {
  const offset = Number(deps.polyBrushSurfaceOffsetInput.value);
  const surfaceMode = deps.activeStrokeSurfaceValue();
  if (surfaceMode === "contextual-plane") {
    const contextualPlane = deps.contextualPlaneAtOrigin();
    return {
      point: contextualPlane.plane.projectPoint(point, new THREE.Vector3())
        .addScaledVector(contextualPlane.normal, offset),
      normal: contextualPlane.normal.clone()
    };
  }
  const objects = polyRelaxSurfaceObjects(lock);
  if (!objects.length) return null;
  const normal = preferredNormal?.clone()?.normalize() || new THREE.Vector3(0, 1, 0);
  const castDistance = Math.max(1, Number(deps.polyBrushWidthInput.value) * 8);
  const casts = [
    {
      origin: point.clone().addScaledVector(normal, castDistance),
      direction: normal.clone().negate()
    },
    {
      origin: point.clone().addScaledVector(normal, -castDistance),
      direction: normal.clone()
    }
  ];
  let best = null;
  casts.forEach(({ origin, direction }) => {
    deps.polyRelaxProjectionRaycaster.set(origin, direction);
    const hit = deps.polyRelaxProjectionRaycaster.intersectObjects(objects, false)[0];
    if (!hit) return;
    const distance = hit.point.distanceToSquared(point);
    if (best && best.distance <= distance) return;
    const hitNormal = hit.face.normal.clone()
      .applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld))
      .normalize();
    if (hitNormal.dot(normal) < 0) hitNormal.negate();
    best = { hit, normal: hitNormal, distance };
  });
  return best ? {
    point: best.hit.point.clone().addScaledVector(best.normal, offset),
    normal: best.normal
  } : null;
}

function removePolyPointAttributes(lock, removedVertexIndices) {
  const removed = new Set(removedVertexIndices);
  ["pointWidths", "pointScales", "pointTwists", "pointSurfaceNormals"].forEach((key) => {
    if (Array.isArray(lock[key])) {
      lock[key] = lock[key].filter((_, index) => !removed.has(index));
    }
  });
}

function deletePolyComponent(event) {
  const lock = selectedPolyMesh();
  const target = polyTargetAtEvent(event);
  if (!lock || !target) return false;
  clearPolyFillPreview();
  deps.pushUndoState();
  if (target.type === "vertex") {
    const result = deletePolyVertex(lock.points, lock.polyFaces, target.index);
    lock.points = result.points;
    lock.polyFaces = result.faces;
    removePolyPointAttributes(lock, [target.index]);
  } else if (target.type === "edge") {
    lock.polyFaces = deletePolyEdge(lock.points, lock.polyFaces, target.vertices);
  } else if (target.type === "face") {
    const result = deletePolyFaceAndOrphans(lock.points, lock.polyFaces, target.index);
    lock.points = result.points;
    lock.polyFaces = result.faces;
    removePolyPointAttributes(lock, result.removedVertexIndices);
  }
  refreshPolyMesh(lock);
  return true;
}

function addPolyPoint(lock, point, normal = null) {
  const index = lock.points.length;
  lock.points.push(point.clone());
  lock.pointSurfaceNormals ||= [];
  lock.pointSurfaceNormals.push(normal?.clone()?.normalize() || null);
  deps.fitPointAttributes(lock, lock.points.length);
  return index;
}

function appendPolyStrokeRow(stroke, sample, side) {
  const lock = deps.locks.find((item) => item.id === stroke.lockId);
  if (!lock) return null;
  const halfWidth = Number(deps.polyBrushWidthInput.value) * 0.5;
  const left = addPolyPoint(lock, sample.point.clone().addScaledVector(side, -halfWidth), sample.normal);
  const right = addPolyPoint(lock, sample.point.clone().addScaledVector(side, halfWidth), sample.normal);
  const previous = stroke.rows.at(-1);
  if (previous) {
    lock.polyFaces = appendPolyQuad(lock.points, lock.polyFaces, [
      previous.left,
      previous.right,
      right,
      left
    ]);
  }
  const row = { left, right, center: sample.point.clone(), side: side.clone() };
  stroke.rows.push(row);
  return row;
}

function beginPolyBrushPointer(event) {
  if (deps.sel.activeTool !== "poly" || event.button !== 0 || deps.sculptState.proportionalSizeEdit || deps.sculptState.proportionalHotkeyPress) return;
  if (event.altKey) {
    clearPolyFillPreview();
    const target = polyTargetAtEvent(event);
    const removingSelectedVertex = target?.type === "vertex"
      && deps.guideApi.controlPointIsSelected("strand", selectedPolyMesh()?.id, target.index);
    deps.draw.polyAltDeleteCandidate = !removingSelectedVertex && target
      ? { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY }
      : null;
    return;
  }
  if (event.shiftKey) {
    clearPolyFillPreview();
    const target = polyTargetAtEvent(event);
    if (target) {
      const lock = selectedPolyMesh();
      deps.sculptState.polyBrushStroke = {
        kind: "relax",
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lockId: lock.id,
        startPoints: lock.points.map((point) => point.clone()),
        startNormals: (lock.pointSurfaceNormals || []).map((normal) => normal?.clone() || null),
        changed: false,
        dragging: false
      };
      deps.renderer.domElement.setPointerCapture?.(event.pointerId);
      deps.updateInteractionLocks();
      deps.updatePlacementStatus();
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (fillPolyGap(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }
  if (event.ctrlKey || event.metaKey) return;
  clearPolyFillPreview();
  const target = polyTargetAtEvent(event);
  if (target?.type === "vertex") {
    const lock = selectedPolyMesh();
    deps.sculptState.polyBrushStroke = {
      kind: "vertex",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lockId: lock.id,
      pointIndex: target.index,
      startPoint: lock.points[target.index].clone(),
      startNormal: lock.pointSurfaceNormals?.[target.index]?.clone() || null,
      changed: false,
      dragging: false
    };
    deps.renderer.domElement.setPointerCapture?.(event.pointerId);
    deps.updateInteractionLocks();
    deps.updatePlacementStatus();
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  const sample = polySurfaceSample(event, { root: !selectedPolyMesh()?.points.length });
  if (!sample) return;
  deps.sculptState.polyBrushStroke = {
    kind: "draw",
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startSample: sample,
    lastSample: sample,
    lockId: null,
    rows: [],
    changed: false,
    dragging: false
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishPolyAltDelete(event) {
  const candidate = deps.draw.polyAltDeleteCandidate;
  if (!candidate || event.pointerId !== candidate.pointerId) return;
  deps.draw.polyAltDeleteCandidate = null;
  if (
    deps.sel.activeTool === "poly"
    && event.altKey
    && Math.hypot(event.clientX - candidate.startX, event.clientY - candidate.startY) < 4
  ) {
    deletePolyComponent(event);
    event.preventDefault();
  }
}

function updatePolyBrushStroke(event) {
  const stroke = deps.sculptState.polyBrushStroke;
  if (!stroke || event.pointerId !== stroke.pointerId) return;
  if (!stroke.dragging && Math.hypot(event.clientX - stroke.startX, event.clientY - stroke.startY) < 4) return;
  const sample = polySurfaceSample(event);
  if (!sample) return;
  if (stroke.kind === "relax") {
    const lock = deps.locks.find((item) => item.id === stroke.lockId);
    if (!lock) return;
    const radius = Math.max(
      0.12,
      Number(deps.polyBrushWidthInput.value) * 1.5,
      Number(deps.polyBrushSpacingInput.value) * 2
    );
    const relaxed = relaxPolyPoints(lock.points, lock.polyFaces, sample.point, {
      radius,
      strength: 0.22
    });
    const updates = relaxed.movedVertexIndices.flatMap((index) => {
      const preferredNormal = lock.pointSurfaceNormals?.[index] || sample.normal;
      const projection = projectPolyRelaxPoint(
        lock,
        new THREE.Vector3(
          relaxed.points[index].x,
          relaxed.points[index].y,
          relaxed.points[index].z
        ),
        preferredNormal
      );
      return projection ? [{ index, projection }] : [];
    });
    if (!updates.length) return;
    if (!stroke.changed) deps.pushUndoState();
    stroke.changed = true;
    stroke.dragging = true;
    lock.pointSurfaceNormals ||= [];
    updates.forEach(({ index, projection }) => {
      lock.points[index].copy(projection.point);
      lock.pointSurfaceNormals[index] = projection.normal.clone();
    });
    refreshPolyMesh(lock);
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (stroke.kind === "vertex") {
    const lock = deps.locks.find((item) => item.id === stroke.lockId);
    if (!lock?.points[stroke.pointIndex]) return;
    if (!stroke.changed) deps.pushUndoState();
    stroke.changed = true;
    stroke.dragging = true;
    lock.points[stroke.pointIndex].copy(sample.point);
    lock.pointSurfaceNormals ||= [];
    lock.pointSurfaceNormals[stroke.pointIndex] = sample.normal.clone();
    refreshPolyMesh(lock);
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (!stroke.changed) {
    deps.pushUndoState();
    const lock = ensurePolyMesh();
    stroke.lockId = lock.id;
    stroke.changed = true;
    stroke.dragging = true;
    const direction = sample.point.clone().sub(stroke.startSample.point);
    const normal = stroke.startSample.normal.clone().add(sample.normal).normalize();
    const side = direction.clone().cross(normal).normalize();
    if (side.lengthSq() < 1e-8) side.copy(new THREE.Vector3(1, 0, 0).cross(normal).normalize());
    appendPolyStrokeRow(stroke, stroke.startSample, side);
    appendPolyStrokeRow(stroke, sample, side);
    stroke.lastSample = sample;
    refreshPolyMesh(lock);
  } else {
    const lock = deps.locks.find((item) => item.id === stroke.lockId);
    const previous = stroke.rows.at(-1);
    if (!lock || !previous || previous.center.distanceTo(sample.point) < Number(deps.polyBrushSpacingInput.value)) return;
    const direction = sample.point.clone().sub(previous.center);
    const normal = stroke.lastSample.normal.clone().add(sample.normal).normalize();
    let side = direction.clone().cross(normal).normalize();
    if (side.lengthSq() < 1e-8) side = previous.side.clone();
    if (side.dot(previous.side) < 0) side.negate();
    appendPolyStrokeRow(stroke, sample, side);
    stroke.lastSample = sample;
    refreshPolyMesh(lock);
  }
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishPolyBrushStroke(event, { cancel = false } = {}) {
  const stroke = deps.sculptState.polyBrushStroke;
  if (stroke && event?.pointerId !== undefined && event.pointerId !== stroke.pointerId) return;
  if (stroke?.kind === "relax" && stroke.changed && cancel) {
    const lock = deps.locks.find((item) => item.id === stroke.lockId);
    if (lock) {
      lock.points.forEach((point, index) => point.copy(stroke.startPoints[index]));
      lock.pointSurfaceNormals = stroke.startNormals.map((normal) => normal?.clone() || null);
      refreshPolyMesh(lock);
    }
    deps.undoHistory.pop();
    deps.updateHistoryButtons();
  } else if (stroke?.kind === "vertex" && stroke.changed && cancel) {
    const lock = deps.locks.find((item) => item.id === stroke.lockId);
    if (lock?.points[stroke.pointIndex]) {
      lock.points[stroke.pointIndex].copy(stroke.startPoint);
      lock.pointSurfaceNormals ||= [];
      lock.pointSurfaceNormals[stroke.pointIndex] = stroke.startNormal?.clone() || null;
      refreshPolyMesh(lock);
    }
    deps.undoHistory.pop();
    deps.updateHistoryButtons();
  } else if (stroke?.kind === "draw" && !stroke.changed && !cancel) {
    deps.pushUndoState();
    const lock = ensurePolyMesh();
    addPolyPoint(lock, stroke.startSample.point, stroke.startSample.normal);
    refreshPolyMesh(lock);
  }
  if (stroke && deps.renderer.domElement.hasPointerCapture?.(stroke.pointerId)) {
    deps.renderer.domElement.releasePointerCapture(stroke.pointerId);
  }
  deps.sculptState.polyBrushStroke = null;
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event?.preventDefault();
}

function polyEdgeKey(edge) {
  return [...edge].sort((a, b) => a - b).join(":");
}

function polyMeshEdges(lock) {
  const edges = new Map();
  normalizePolyFaces(lock.points, lock.polyFaces).forEach((face) => {
    face.forEach((start, index) => {
      const end = face[(index + 1) % face.length];
      const key = polyEdgeKey([start, end]);
      const entry = edges.get(key) || { vertices: [start, end], faceCount: 0 };
      entry.faceCount += 1;
      edges.set(key, entry);
    });
  });
  return [...edges.values()].map((edge) => ({ ...edge, boundary: edge.faceCount === 1 }));
}

function populatePolyEditObjects(lock, target) {
  const group = target.group;
  const linePoints = [];
  const edgePickers = polyMeshEdges(lock).map((edge) => {
    const [start, end] = edge.vertices;
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([lock.points[start], lock.points[end]]),
      new THREE.LineBasicMaterial({
        color: edge.boundary ? 0x58f6ff : 0xe7a95d,
        transparent: true,
        opacity: 0.82,
        depthTest: false
      })
    );
    line.renderOrder = 7;
    line.userData.lockId = lock.id;
    line.userData.polyEdge = [...edge.vertices];
    line.userData.polyBoundary = edge.boundary;
    group.add(line);
    linePoints.push(lock.points[start], lock.points[end]);
    return line;
  });
  const line = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(linePoints),
    new THREE.LineBasicMaterial({ color: 0x58f6ff, transparent: true, opacity: 0, depthTest: false })
  );
  group.add(line);
  const handles = lock.points.map((point, index) => {
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 14, 10),
      new THREE.MeshBasicMaterial({
        color: 0x58f6ff,
        transparent: true,
        opacity: 0.86,
        depthTest: false
      })
    );
    handle.position.copy(point);
    handle.renderOrder = 8;
    handle.userData.lockId = lock.id;
    handle.userData.polyVertexIndex = index;
    group.add(handle);
    return handle;
  });
  Object.assign(target, {
    line,
    handles,
    edgePickers,
    arrows: [],
    widthEdgeLines: [],
    panelSplitHandles: [],
    panelSplitLines: [],
    panelTipHandles: [],
    panelTipLines: [],
    tipHighlightMesh: null,
    strandSplitHandle: null,
    strandSplitLine: null,
    branchSweepStartHandle: null,
    surfaceObjectAnchor: null,
    surfaceObjectAnchorHandle: null,
    surfaceObjectAnchorStem: null
  });
}

function createPolyEditObjects(lock) {
  const target = { group: new THREE.Group() };
  target.group.userData.lockId = lock.id;
  populatePolyEditObjects(lock, target);
  target.group.visible = deps.sel.activeTool === "poly" && deps.sel.selectedId === lock.id;
  return target;
}

function rebuildPolyEditObjects(lock, options = {}) {
  const target = lock.curveObjects;
  target.group.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
    else object.material?.dispose?.();
  });
  target.group.clear();
  populatePolyEditObjects(lock, target);
  target.group.visible = ("visible" in options ? options.visible : deps.sel.selectedId === lock.id)
    && deps.sel.activeTool === "poly"
    && deps.strandVisibleForDisplay(lock);
}
  return {
    selectedPolyMesh,
    addPolyLock,
    ensurePolyMesh,
    polySurfaceSample,
    polyTargetAtEvent,
    refreshPolyMesh,
    ensurePolyFillPreview,
    clearPolyFillPreview,
    polyFillCandidateForEvent,
    showPolyFillPreview,
    updatePolyFillPreview,
    refreshPolyFillPreviewFromLastPointer,
    fillPolyGap,
    polyRelaxSurfaceObjects,
    projectPolyRelaxPoint,
    removePolyPointAttributes,
    deletePolyComponent,
    addPolyPoint,
    appendPolyStrokeRow,
    beginPolyBrushPointer,
    finishPolyAltDelete,
    updatePolyBrushStroke,
    finishPolyBrushStroke,
    polyEdgeKey,
    polyMeshEdges,
    populatePolyEditObjects,
    createPolyEditObjects,
    rebuildPolyEditObjects,
  };
}
