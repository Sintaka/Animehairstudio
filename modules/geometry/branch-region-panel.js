// branch-region-panel.js — Branch Root Region 2D editor / selection panel (refactor 3d-3a).
// Extracted from app.js; coupling injected via createBranchRegionApi(deps).
import * as THREE from "three";

const branchRegionCanvas = document.querySelector("#branchRegionCanvas");

const BRANCH_ROOT_REGION_DEFAULTS = Object.freeze({
  centerV: 0.5,
  upLength: 0.08,
  downLength: 0.08,
  leftWidth: 0.12,
  rightWidth: 0.12
});

export function clampRegionParam(value) {
  return THREE.MathUtils.clamp(Number(value) || 0, 0, 1);
}

export function createBranchRegionApi(deps) {
  // deps: locks, rebuildLockGeometry, updateCurveObjects, getSelectedLock, pushUndoState,
  //   resize, pointerToNdc, closeSweepProfileEditor, closeTaperCurveEditor,
  //   branchRootRegionWorldPoints, strandGeometryCurve, raycaster, camera, renderer,
  //   branchRegionMeshPointsGroup, branchRegionMeshPointGeometry, branchRegionMeshPointMaterial,
  //   branchRegionCenterMeshPointMaterial,
  //   branchState, sculptState, viewportState, selState, hairState (store .state proxies)

function syncBranchRootRegionOffsets(lock) {
  const region = lock?.branchRootRegion;
  const cross = region?.cross;
  if (!region || !cross) return null;
  // The orange center is a stable anchor (where the direct bridge attaches), NOT a
  // value recomputed from the edges: dragging a single edge (e.g. only the bottom)
  // must not move the center. Initialize it once from the rectangle's geometric
  // center when it is missing (new regions / old files).
  if (!region.center) {
    region.center = {
      u: clampRegionParam((cross.up.u + cross.down.u) / 2),
      v: clampRegionParam((cross.left.v + cross.right.v) / 2)
    };
  }
  const centerU = clampRegionParam(region.center.u);
  const centerV = clampRegionParam(region.center.v);
  region.edgeOffsets = {
    up: Math.max(0, centerU - cross.up.u),
    down: Math.max(0, cross.down.u - centerU),
    left: Math.max(0, cross.left.v - centerV),
    right: Math.max(0, centerV - cross.right.v)
  };
  return region.edgeOffsets;
}

function updateBranchRootRegionCenter(lock, u, v) {
  const region = lock?.branchRootRegion;
  const cross = region?.cross;
  if (!region || !cross) return;
  const uc = clampRegionParam((cross.up.u + cross.down.u) / 2);
  const vc = clampRegionParam((cross.left.v + cross.right.v) / 2);
  const nu = clampRegionParam(u);
  const nv = clampRegionParam(v);
  // Keep the region center's offset from the root bone: the user may have dragged
  // the region (points or rect) away from the bone, and a later bone move should
  // follow with that relative offset instead of snapping the center back to the bone.
  const bone = region.boneSync || { u: nu, v: nv };
  const targetU = clampRegionParam(nu + (uc - clampRegionParam(bone.u)));
  const targetV = clampRegionParam(nv + (vc - clampRegionParam(bone.v)));
  // Anchor the bone sync point even when the region does not move (first sync), so a
  // later bone move applies the preserved center offset instead of snapping to the bone.
  region.boneSync = { u: nu, v: nv };
  const du = (targetU - uc) * deps.branchState.branchRegionSyncVertical;
  const dv = (targetV - vc) * deps.branchState.branchRegionSyncLateral;
  if (Math.abs(du) < 0.0005 && Math.abs(dv) < 0.0005) return;
  // Translate every edge AND the orange anchor by the same delta so the region keeps
  // its exact shape (the anchor may differ from the geometric center after a single-
  // edge drag; reconstructing from center + offsets would shift it).
  cross.up = { u: clampRegionParam(cross.up.u + du), v: clampRegionParam(cross.up.v + dv) };
  cross.down = { u: clampRegionParam(cross.down.u + du), v: clampRegionParam(cross.down.v + dv) };
  cross.left = { u: clampRegionParam(cross.left.u + du), v: clampRegionParam(cross.left.v + dv) };
  cross.right = { u: clampRegionParam(cross.right.u + du), v: clampRegionParam(cross.right.v + dv) };
  region.center = {
    u: clampRegionParam((region.center?.u ?? uc) + du),
    v: clampRegionParam((region.center?.v ?? vc) + dv)
  };
  normalizeBranchRootRegion(lock);
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (parent) deps.rebuildLockGeometry(parent);
  else deps.rebuildLockGeometry(lock);
  renderBranchRegionEditor();
  updateBranchRegionMeshPoints();
}

function clampRegionParam(value) {
  return THREE.MathUtils.clamp(Number(value) || 0, 0, 1);
}

function branchRootRegionFromParam(parameter) {
  const u0 = clampRegionParam(parameter);
  const { centerV, upLength, downLength, leftWidth, rightWidth } = BRANCH_ROOT_REGION_DEFAULTS;
  const v0 = clampRegionParam(centerV);
  const up = clampRegionParam(u0 - upLength);
  const down = clampRegionParam(u0 + downLength);
  const left = clampRegionParam(v0 + leftWidth);
  const right = clampRegionParam(v0 - rightWidth);
  return {
    center: { u: u0, v: v0 },
    edgeOffsets: { up: u0 - up, down: down - u0, left: left - v0, right: v0 - right },
    boneSync: null,
    cross: {
      // up = region top (toward root, smaller u); down = bottom (toward tip, larger u).
      up: { u: up, v: v0 },
      down: { u: down, v: v0 },
      // left = larger v (world-left for a left-side strand), right = smaller v.
      left: { u: u0, v: left },
      right: { u: u0, v: right }
    }
  };
}

function cloneBranchRootRegion(region, { mirror = false } = {}) {
  if (!region) return null;
  const flip = (value) => (mirror ? 1 - clampRegionParam(value) : clampRegionParam(value));
  const left = mirror ? region.cross?.right : region.cross?.left;
  const right = mirror ? region.cross?.left : region.cross?.right;
  const cross = {
    up: { u: clampRegionParam(region.cross?.up?.u), v: flip(region.cross?.up?.v) },
    down: { u: clampRegionParam(region.cross?.down?.u), v: flip(region.cross?.down?.v) },
    left: { u: clampRegionParam(left?.u), v: flip(left?.v) },
    right: { u: clampRegionParam(right?.u), v: flip(right?.v) }
  };
  const centerU = (cross.up.u + cross.down.u) / 2;
  const centerV = (cross.left.v + cross.right.v) / 2;
  return {
    center: { u: clampRegionParam(centerU), v: clampRegionParam(centerV) },
    edgeOffsets: {
      up: Math.max(0, centerU - cross.up.u),
      down: Math.max(0, cross.down.u - centerU),
      left: Math.max(0, cross.left.v - centerV),
      right: Math.max(0, centerV - cross.right.v)
    },
    boneSync: region.boneSync
      ? { u: clampRegionParam(region.boneSync.u), v: flip(region.boneSync.v) }
      : null,
    cross
  };
}

function normalizeBranchRootRegion(lock) {
  const cross = lock?.branchRootRegion?.cross;
  if (!cross) return false;
  const MIN_REGION_SPAN = 0.02;
  let changed = false;
  const offsets = lock?.branchRootRegion?.edgeOffsets;
  if (cross.up.u >= cross.down.u) {
    const u = cross.up.u; cross.up.u = cross.down.u; cross.down.u = u;
    const v = cross.up.v; cross.up.v = cross.down.v; cross.down.v = v;
    if (offsets) { const t = offsets.up; offsets.up = offsets.down; offsets.down = t; }
    changed = true;
  }
  if (cross.left.v <= cross.right.v) {
    const u = cross.left.u; cross.left.u = cross.right.u; cross.right.u = u;
    const v = cross.left.v; cross.left.v = cross.right.v; cross.right.v = v;
    if (offsets) { const t = offsets.left; offsets.left = offsets.right; offsets.right = t; }
    changed = true;
  }
  if (cross.down.u - cross.up.u < MIN_REGION_SPAN) {
    cross.up.u = clampRegionParam(cross.down.u - MIN_REGION_SPAN);
    if (cross.down.u - cross.up.u < MIN_REGION_SPAN) cross.down.u = clampRegionParam(cross.up.u + MIN_REGION_SPAN);
    changed = true;
  }
  if (cross.left.v - cross.right.v < MIN_REGION_SPAN) {
    cross.right.v = clampRegionParam(cross.left.v - MIN_REGION_SPAN);
    if (cross.left.v - cross.right.v < MIN_REGION_SPAN) cross.left.v = clampRegionParam(cross.right.v + MIN_REGION_SPAN);
    changed = true;
  }
  return changed;
}

function setBranchRootRegionPoint(lock, name, param) {
  const cross = lock?.branchRootRegion?.cross;
  if (!cross?.[name] || !param) return;
  const MIN_REGION_SPAN = 0.02;
  const u = clampRegionParam(param.u);
  const v = clampRegionParam(param.v);
  // Normalize first: an inverted pair would make the clamps snap the dragged point
  // to the opposite side (e.g. clicking a point that already crossed its partner).
  normalizeBranchRootRegion(lock);
  // The four side points may never cross the orange center (the stable bridge
  // anchor): each edge is clamped to stay on its own side of region.center.
  const center = lock?.branchRootRegion?.center;
  const cu = clampRegionParam(center?.u ?? (cross.up.u + cross.down.u) / 2);
  const cv = clampRegionParam(center?.v ?? (cross.left.v + cross.right.v) / 2);
  if (name === "up") {
    cross.up = { u: clampRegionParam(Math.min(u, Math.min(cross.down.u, cu) - MIN_REGION_SPAN)), v };
  } else if (name === "down") {
    cross.down = { u: clampRegionParam(Math.max(u, Math.max(cross.up.u, cu) + MIN_REGION_SPAN)), v };
  } else if (name === "left") {
    cross.left = { u, v: clampRegionParam(Math.max(v, Math.max(cross.right.v, cv) + MIN_REGION_SPAN)) };
  } else {
    cross.right = { u, v: clampRegionParam(Math.min(v, Math.min(cross.left.v, cv) - MIN_REGION_SPAN)) };
  }
  syncBranchRootRegionOffsets(lock);
  // Rebuild the parent from scratch so carving always starts from the full grid:
  // carving mutates quadFaces, so re-carving an already-carved mesh drifts the
  // row/col mapping and deletes extra fragments on every pass (Reset accumulation).
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (parent) deps.rebuildLockGeometry(parent);
  else deps.rebuildLockGeometry(lock);
  deps.updateCurveObjects(lock);
}

function branchRegionUVToCanvas(u, v) {
  return { x: 20 + v * 180, y: 20 + u * 360 };
}

function branchRegionCanvasToUV(cx, cy) {
  return {
    u: THREE.MathUtils.clamp((cy - 20) / 360, 0, 1),
    v: THREE.MathUtils.clamp((cx - 20) / 180, 0, 1)
  };
}

function openBranchRegionEditor(lockId) {
  const lock = deps.locks.find((item) => item.id === lockId);
  if (!lock?.branchRootRegion) return;
  if (deps.sweepProfileEditor?.open) deps.closeSweepProfileEditor();
  if (deps.taperCurveEditor?.open) deps.closeTaperCurveEditor();
  deps.sculptState.branchRegionEdit = lockId;
  applyBranchRegionView();
  const target = document.querySelector("#branchRegionTarget");
  if (target) target.textContent = lock.name || "Selected branch";
  renderBranchRegionEditor();
  updateBranchRegionMeshPoints();
  const dialog = document.querySelector("#branchRegionEditor");
  if (dialog && !dialog.open) dialog.show();
}

function closeBranchRegionEditor() {
  deps.sculptState.branchRegionEdit = null;
  deps.branchRegionMeshPointsGroup.visible = false;
  const dialog = document.querySelector("#branchRegionEditor");
  if (dialog?.open) dialog.close();
}

function retargetBranchRegionEditor() {
  const lock = deps.getSelectedLock();
  if (lock?.branchRootRegion) openBranchRegionEditor(lock.id);
  else closeBranchRegionEditor();
}

function renderBranchRegionEditor() {
  const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
  const region = lock?.branchRootRegion;
  if (!region) return;
  const cross = region.cross;
  const vc = clampRegionParam((cross.left.v + cross.right.v) / 2);
  const uc = clampRegionParam((cross.up.u + cross.down.u) / 2);
  const pts = {
    up: branchRegionUVToCanvas(clampRegionParam(cross.up.u), vc),
    down: branchRegionUVToCanvas(clampRegionParam(cross.down.u), vc),
    left: branchRegionUVToCanvas(uc, clampRegionParam(cross.left.v)),
    right: branchRegionUVToCanvas(uc, clampRegionParam(cross.right.v))
  };
  const rect = document.querySelector("#branchRegionRect");
  const c1 = branchRegionUVToCanvas(clampRegionParam(cross.down.u), clampRegionParam(cross.left.v));
  const c2 = branchRegionUVToCanvas(clampRegionParam(cross.down.u), clampRegionParam(cross.right.v));
  const c3 = branchRegionUVToCanvas(clampRegionParam(cross.up.u), clampRegionParam(cross.left.v));
  if (rect) {
    rect.setAttribute("x", Math.min(c1.x, c2.x));
    rect.setAttribute("y", Math.min(c1.y, c3.y));
    rect.setAttribute("width", Math.abs(c2.x - c1.x));
    rect.setAttribute("height", Math.abs(c3.y - c1.y));
  }
  const g = document.querySelector("#branchRegionPoints");
  if (!g) return;
  g.innerHTML = "";
  Object.entries(pts).forEach(([name, p]) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", 7);
    circle.setAttribute("fill", "#8fd8ff");
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "1.5");
    circle.setAttribute("data-region-point", name);
    circle.style.cursor = "move";
    g.appendChild(circle);
  });
  // Region center marker (orange): the bridge anchor. Dragging it translates the
  // whole region; Ctrl+dragging mirror-scales both sides around it. It is drawn at
  // the stable anchor (region.center), not the edge average, so editing a single
  // edge does not move it.
  const anchorU = clampRegionParam(region.center?.u ?? uc);
  const anchorV = clampRegionParam(region.center?.v ?? vc);
  const centerCanvas = branchRegionUVToCanvas(anchorU, anchorV);
  const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  centerCircle.setAttribute("cx", centerCanvas.x);
  centerCircle.setAttribute("cy", centerCanvas.y);
  centerCircle.setAttribute("r", 5);
  centerCircle.setAttribute("fill", "#ff9a3c");
  centerCircle.setAttribute("stroke", "#ffffff");
  centerCircle.setAttribute("stroke-width", "1.5");
  centerCircle.setAttribute("data-region-point", "center");
  centerCircle.style.cursor = "move";
  g.appendChild(centerCircle);
  // Four corner handles: diagonal resize (scales both u and v from the opposite
  // corner). Cursor follows the system diagonal-resize glyphs.
  const upU = clampRegionParam(cross.up.u);
  const downU = clampRegionParam(cross.down.u);
  const leftV = clampRegionParam(cross.left.v);
  const rightV = clampRegionParam(cross.right.v);
  const corners = [
    { name: "topleft", u: upU, v: leftV, cursor: "nwse-resize" },
    { name: "topright", u: upU, v: rightV, cursor: "nesw-resize" },
    { name: "bottomleft", u: downU, v: leftV, cursor: "nesw-resize" },
    { name: "bottomright", u: downU, v: rightV, cursor: "nwse-resize" }
  ];
  corners.forEach((corner) => {
    const cp = branchRegionUVToCanvas(corner.u, corner.v);
    const rectEl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectEl.setAttribute("x", cp.x - 4);
    rectEl.setAttribute("y", cp.y - 4);
    rectEl.setAttribute("width", 8);
    rectEl.setAttribute("height", 8);
    rectEl.setAttribute("fill", "#cfe9ff");
    rectEl.setAttribute("stroke", "#5b8fb0");
    rectEl.setAttribute("stroke-width", "1");
    rectEl.setAttribute("data-region-point", corner.name);
    rectEl.style.cursor = corner.cursor;
    g.appendChild(rectEl);
  });
  updateBranchRegionMeshPoints();
}

function applyBranchRegionView() {
  branchRegionCanvas.setAttribute("viewBox", `${deps.branchState.branchRegionView.x} ${deps.branchState.branchRegionView.y} ${deps.branchState.branchRegionView.w} ${deps.branchState.branchRegionView.h}`);
}

function resetBranchRegionZoom() {
  deps.branchState.branchRegionView = { x: 0, y: 0, w: 220, h: 400 };
  applyBranchRegionView();
}

function branchRegionNavAction(event) {
  const mmb = event.button === 1;
  const rmb = event.button === 2;
  if (deps.viewportState.navigationStyle === "houdini") {
    if (mmb) return "pan";
    if (rmb && event.altKey) return "zoom";
  } else if (deps.viewportState.navigationStyle === "blender") {
    if (mmb) return event.ctrlKey ? "zoom" : "pan";
  } else if (rmb && event.altKey) {
    return "pan";
  }
  if (mmb) return "pan";
  return null;
}

function beginBranchRegionCanvasNav(event) {
  const action = branchRegionNavAction(event);
  if (!action) return;
  const rect = branchRegionCanvas.getBoundingClientRect();
  const viewBox = branchRegionCanvas.viewBox.baseVal;
  if (action === "zoom") {
    deps.sculptState.branchRegionZoomDrag = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      contentX: viewBox.x + (event.clientX - rect.left) * (viewBox.width / rect.width),
      contentY: viewBox.y + (event.clientY - rect.top) * (viewBox.height / rect.height)
    };
  } else {
    deps.sculptState.branchRegionPanDrag = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY };
  }
  try { branchRegionCanvas.setPointerCapture?.(event.pointerId); } catch (e) { /* synthetic */ }
  event.preventDefault();
  event.stopPropagation();
}

function updateBranchRegionCanvasNav(event) {
  updateBranchRegionCanvasZoom(event);
  updateBranchRegionCanvasPan(event);
}

function updateBranchRegionCanvasZoom(event) {
  if (!deps.sculptState.branchRegionZoomDrag || event.pointerId !== deps.sculptState.branchRegionZoomDrag.pointerId) return;
  const dx = event.clientX - deps.sculptState.branchRegionZoomDrag.lastX;
  const dy = event.clientY - deps.sculptState.branchRegionZoomDrag.lastY;
  deps.sculptState.branchRegionZoomDrag.lastX = event.clientX;
  deps.sculptState.branchRegionZoomDrag.lastY = event.clientY;
  if (dx === 0 && dy === 0) return;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  const magnitude = ax > ay ? ax + ay * 0.4142 : ay + ax * 0.4142;
  // Reversed: dragging toward top-right zooms in, toward bottom-left zooms out.
  const sign = ay >= ax ? (dy < 0 ? 1 : -1) : (dx > 0 ? 1 : -1);
  const factor = Math.pow(1.02, sign * magnitude);
  const nw = THREE.MathUtils.clamp(deps.branchState.branchRegionView.w / factor, 40, 440);
  const nh = THREE.MathUtils.clamp(deps.branchState.branchRegionView.h / factor, 80, 800);
  const kx = nw / deps.branchState.branchRegionView.w;
  const ky = nh / deps.branchState.branchRegionView.h;
  deps.branchState.branchRegionView = {
    x: deps.sculptState.branchRegionZoomDrag.contentX - (deps.sculptState.branchRegionZoomDrag.contentX - deps.branchState.branchRegionView.x) * kx,
    y: deps.sculptState.branchRegionZoomDrag.contentY - (deps.sculptState.branchRegionZoomDrag.contentY - deps.branchState.branchRegionView.y) * ky,
    w: nw,
    h: nh
  };
  applyBranchRegionView();
  event.preventDefault();
}

function updateBranchRegionCanvasPan(event) {
  if (!deps.sculptState.branchRegionPanDrag || event.pointerId !== deps.sculptState.branchRegionPanDrag.pointerId) return;
  const rect = branchRegionCanvas.getBoundingClientRect();
  const viewBox = branchRegionCanvas.viewBox.baseVal;
  const dx = (event.clientX - deps.sculptState.branchRegionPanDrag.lastX) * (viewBox.width / rect.width);
  const dy = (event.clientY - deps.sculptState.branchRegionPanDrag.lastY) * (viewBox.height / rect.height);
  deps.sculptState.branchRegionPanDrag.lastX = event.clientX;
  deps.sculptState.branchRegionPanDrag.lastY = event.clientY;
  deps.branchState.branchRegionView = { ...deps.branchState.branchRegionView, x: deps.branchState.branchRegionView.x - dx, y: deps.branchState.branchRegionView.y - dy };
  applyBranchRegionView();
  event.preventDefault();
}

function endBranchRegionCanvasNav(event) {
  const pid = event?.pointerId;
  if (deps.sculptState.branchRegionZoomDrag && (pid === undefined || pid === deps.sculptState.branchRegionZoomDrag.pointerId)) deps.sculptState.branchRegionZoomDrag = null;
  if (deps.sculptState.branchRegionPanDrag && (pid === undefined || pid === deps.sculptState.branchRegionPanDrag.pointerId)) deps.sculptState.branchRegionPanDrag = null;
}

function onBranchRegionCanvasWheel(event) {
  if (!deps.sculptState.branchRegionEdit) return;
  event.preventDefault();
  const rect = branchRegionCanvas.getBoundingClientRect();
  const viewBox = branchRegionCanvas.viewBox.baseVal;
  const px = viewBox.x + (event.clientX - rect.left) * (viewBox.width / rect.width);
  const py = viewBox.y + (event.clientY - rect.top) * (viewBox.height / rect.height);
  const factor = Math.pow(1.0015, -event.deltaY);
  const nw = THREE.MathUtils.clamp(deps.branchState.branchRegionView.w / factor, 40, 440);
  const nh = THREE.MathUtils.clamp(deps.branchState.branchRegionView.h / factor, 80, 800);
  const kx = nw / deps.branchState.branchRegionView.w;
  const ky = nh / deps.branchState.branchRegionView.h;
  deps.branchState.branchRegionView = {
    x: px - (px - deps.branchState.branchRegionView.x) * kx,
    y: py - (py - deps.branchState.branchRegionView.y) * ky,
    w: nw,
    h: nh
  };
  applyBranchRegionView();
}

function branchRegionEventUV(event) {
  const canvasRect = branchRegionCanvas.getBoundingClientRect();
  const viewBox = branchRegionCanvas.viewBox.baseVal;
  const svgX = viewBox.x + (event.clientX - canvasRect.left) * (viewBox.width / canvasRect.width);
  const svgY = viewBox.y + (event.clientY - canvasRect.top) * (viewBox.height / canvasRect.height);
  return branchRegionCanvasToUV(svgX, svgY);
}

function beginBranchRegionCanvasDrag(event) {
  if (!deps.sculptState.branchRegionEdit) return;
  const point = event.target?.closest?.("circle[data-region-point], rect[data-region-point]");
  const rectTarget = event.target?.closest?.("#branchRegionRect");
  if (!point && !rectTarget) return;
  if (event.button !== 0) return;
  // One undo for the whole drag.
  deps.pushUndoState();
  if (point && point.getAttribute("data-region-point") === "center") {
    const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
    const cross = lock?.branchRootRegion?.cross;
    if (!cross) return;
    const centerU = clampRegionParam(lock.branchRootRegion.center?.u ?? (cross.up.u + cross.down.u) / 2);
    const centerV = clampRegionParam(lock.branchRootRegion.center?.v ?? (cross.left.v + cross.right.v) / 2);
    // Ctrl+drag the center = mirror-scale: the side you drag toward and the opposite
    // side both move apart symmetrically around the fixed center.
    deps.sculptState.branchRegionCanvasDrag = {
      mode: event.ctrlKey ? "center-mirror" : "move",
      pointerId: event.pointerId,
      startU: centerU,
      startV: centerV,
      startCenter: { u: centerU, v: centerV },
      startRegion: {
        up: { ...cross.up },
        down: { ...cross.down },
        left: { ...cross.left },
        right: { ...cross.right }
      }
    };
  } else if (point && ["topleft", "topright", "bottomleft", "bottomright"].includes(point.getAttribute("data-region-point"))) {
    const cornerName = point.getAttribute("data-region-point");
    if (event.ctrlKey) {
      const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
      const cross = lock?.branchRootRegion?.cross;
      if (!cross) return;
      const startUV = branchRegionEventUV(event);
      deps.sculptState.branchRegionCanvasDrag = {
        mode: "corner-mirror",
        name: cornerName,
        pointerId: event.pointerId,
        startU: startUV.u,
        startV: startUV.v,
        startRegion: {
          up: { ...cross.up },
          down: { ...cross.down },
          left: { ...cross.left },
          right: { ...cross.right }
        }
      };
    } else {
      deps.sculptState.branchRegionCanvasDrag = { mode: "corner", name: cornerName, pointerId: event.pointerId };
    }
  } else if (point) {
    const pointName = point.getAttribute("data-region-point");
    if (event.ctrlKey) {
      const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
      const cross = lock?.branchRootRegion?.cross;
      if (!cross) return;
      const startUV = branchRegionEventUV(event);
      deps.sculptState.branchRegionCanvasDrag = {
        mode: "point-mirror",
        name: pointName,
        pointerId: event.pointerId,
        startU: startUV.u,
        startV: startUV.v,
        startRegion: {
          up: { ...cross.up },
          down: { ...cross.down },
          left: { ...cross.left },
          right: { ...cross.right }
        }
      };
    } else {
      deps.sculptState.branchRegionCanvasDrag = { mode: "point", name: pointName, pointerId: event.pointerId };
    }
  } else {
    // Drag the rect body to translate the whole region.
    const canvasRect = branchRegionCanvas.getBoundingClientRect();
    const viewBox = branchRegionCanvas.viewBox.baseVal;
    const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
    const cross = lock?.branchRootRegion?.cross;
    if (!cross) return;
    const svgX = viewBox.x + (event.clientX - canvasRect.left) * (viewBox.width / canvasRect.width);
    const svgY = viewBox.y + (event.clientY - canvasRect.top) * (viewBox.height / canvasRect.height);
    const startUV = branchRegionCanvasToUV(svgX, svgY);
    const startCenter = lock?.branchRootRegion?.center
      ? { u: clampRegionParam(lock.branchRootRegion.center.u), v: clampRegionParam(lock.branchRootRegion.center.v) }
      : { u: clampRegionParam((cross.up.u + cross.down.u) / 2), v: clampRegionParam((cross.left.v + cross.right.v) / 2) };
    deps.sculptState.branchRegionCanvasDrag = {
      mode: "move",
      pointerId: event.pointerId,
      startU: startUV.u,
      startV: startUV.v,
      startCenter,
      startRegion: {
        up: { ...cross.up },
        down: { ...cross.down },
        left: { ...cross.left },
        right: { ...cross.right }
      }
    };
  }
  try { branchRegionCanvas.setPointerCapture?.(event.pointerId); } catch (e) { /* synthetic */ }
  event.preventDefault();
}

function updateBranchRegionCanvasDrag(event) {
  if (!deps.sculptState.branchRegionCanvasDrag || !deps.sculptState.branchRegionEdit) return;
  const rect = branchRegionCanvas.getBoundingClientRect();
  const viewBox = branchRegionCanvas.viewBox.baseVal;
  const svgX = viewBox.x + (event.clientX - rect.left) * (viewBox.width / rect.width);
  const svgY = viewBox.y + (event.clientY - rect.top) * (viewBox.height / rect.height);
  const uv = branchRegionCanvasToUV(svgX, svgY);
  const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
  const cross = lock?.branchRootRegion?.cross;
  if (!cross) return;
  if (deps.sculptState.branchRegionCanvasDrag.mode === "corner") {
    const region = lock.branchRootRegion;
    const center = region.center;
    const cu = clampRegionParam(center?.u ?? (cross.up.u + cross.down.u) / 2);
    const cv = clampRegionParam(center?.v ?? (cross.left.v + cross.right.v) / 2);
    const MIN = 0.02;
    const name = deps.sculptState.branchRegionCanvasDrag.name;
    // Diagonal resize: the dragged corner moves in BOTH u and v (clamped to the
    // orange center), the opposite corner stays fixed.
    if (name === "topleft") {
      cross.up.u = clampRegionParam(Math.min(uv.u, Math.min(cross.down.u, cu) - MIN));
      cross.left.v = clampRegionParam(Math.max(uv.v, Math.max(cross.right.v, cv) + MIN));
    } else if (name === "topright") {
      cross.up.u = clampRegionParam(Math.min(uv.u, Math.min(cross.down.u, cu) - MIN));
      cross.right.v = clampRegionParam(Math.min(uv.v, Math.min(cross.left.v, cv) - MIN));
    } else if (name === "bottomleft") {
      cross.down.u = clampRegionParam(Math.max(uv.u, Math.max(cross.up.u, cu) + MIN));
      cross.left.v = clampRegionParam(Math.max(uv.v, Math.max(cross.right.v, cv) + MIN));
    } else {
      cross.down.u = clampRegionParam(Math.max(uv.u, Math.max(cross.up.u, cu) + MIN));
      cross.right.v = clampRegionParam(Math.min(uv.v, Math.min(cross.left.v, cv) - MIN));
    }
    normalizeBranchRootRegion(lock);
    syncBranchRootRegionOffsets(lock);
    const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
    if (parent) deps.rebuildLockGeometry(parent);
    else deps.rebuildLockGeometry(lock);
    deps.updateCurveObjects(lock);
    renderBranchRegionEditor();
    return;
  }
  if (deps.sculptState.branchRegionCanvasDrag.mode === "center-mirror") {
    const start = deps.sculptState.branchRegionCanvasDrag.startRegion;
    if (!start) return;
    const region = lock.branchRootRegion;
    const offsets = region.edgeOffsets || syncBranchRootRegionOffsets(lock);
    const centerU = clampRegionParam(region.center?.u ?? (start.up.u + start.down.u) / 2);
    const centerV = clampRegionParam(region.center?.v ?? (start.left.v + start.right.v) / 2);
    const du = uv.u - deps.sculptState.branchRegionCanvasDrag.startU;
    const dv = uv.v - deps.sculptState.branchRegionCanvasDrag.startV;
    if (Math.abs(du) >= Math.abs(dv)) {
      // Mirror along u (top/bottom): both edges move away from the fixed center.
      cross.up.u = clampRegionParam(centerU - (offsets.up + du));
      cross.down.u = clampRegionParam(centerU + (offsets.down + du));
    } else {
      // Mirror along v (left/right).
      cross.left.v = clampRegionParam(centerV + (offsets.left + dv));
      cross.right.v = clampRegionParam(centerV - (offsets.right + dv));
    }
    normalizeBranchRootRegion(lock);
    syncBranchRootRegionOffsets(lock);
    const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
    if (parent) deps.rebuildLockGeometry(parent);
    else deps.rebuildLockGeometry(lock);
    deps.updateCurveObjects(lock);
    renderBranchRegionEditor();
    return;
  }
  if (deps.sculptState.branchRegionCanvasDrag.mode === "point-mirror" || deps.sculptState.branchRegionCanvasDrag.mode === "corner-mirror") {
    const start = deps.sculptState.branchRegionCanvasDrag.startRegion;
    if (!start) return;
    const name = deps.sculptState.branchRegionCanvasDrag.name;
    const du = uv.u - deps.sculptState.branchRegionCanvasDrag.startU;
    const dv = uv.v - deps.sculptState.branchRegionCanvasDrag.startV;
    // Ctrl+drag: the dragged point follows the pointer, the opposite point moves
    // in reverse, mirroring around the pair midpoint (the orange anchor stays put).
    const mirrorU = deps.sculptState.branchRegionCanvasDrag.mode === "corner-mirror" || name === "up" || name === "down";
    const mirrorV = deps.sculptState.branchRegionCanvasDrag.mode === "corner-mirror" || name === "left" || name === "right";
    if (mirrorU) {
      const upFollows = name === "up" || name.startsWith("top");
      cross.up.u = clampRegionParam(start.up.u + (upFollows ? du : -du));
      cross.down.u = clampRegionParam(start.down.u + (upFollows ? -du : du));
    }
    if (mirrorV) {
      const leftFollows = name === "left" || name.endsWith("left");
      cross.left.v = clampRegionParam(start.left.v + (leftFollows ? dv : -dv));
      cross.right.v = clampRegionParam(start.right.v + (leftFollows ? -dv : dv));
    }
    normalizeBranchRootRegion(lock);
    syncBranchRootRegionOffsets(lock);
    const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
    if (parent) deps.rebuildLockGeometry(parent);
    else deps.rebuildLockGeometry(lock);
    deps.updateCurveObjects(lock);
    renderBranchRegionEditor();
    return;
  }
  if (deps.sculptState.branchRegionCanvasDrag.mode === "move") {
    const start = deps.sculptState.branchRegionCanvasDrag.startRegion;
    if (!start) return;
    const du = uv.u - deps.sculptState.branchRegionCanvasDrag.startU;
    const dv = uv.v - deps.sculptState.branchRegionCanvasDrag.startV;
    const region = lock.branchRootRegion;
    // Pure translate of every edge AND the orange anchor by the pointer delta: the
    // anchor may differ from the geometric center after a single-edge drag, so
    // reconstructing from center + offsets would shift the shape.
    cross.up = { u: clampRegionParam(start.up.u + du), v: clampRegionParam(start.up.v + dv) };
    cross.down = { u: clampRegionParam(start.down.u + du), v: clampRegionParam(start.down.v + dv) };
    cross.left = { u: clampRegionParam(start.left.u + du), v: clampRegionParam(start.left.v + dv) };
    cross.right = { u: clampRegionParam(start.right.u + du), v: clampRegionParam(start.right.v + dv) };
    const startCenter = deps.sculptState.branchRegionCanvasDrag.startCenter
      || { u: (start.up.u + start.down.u) / 2, v: (start.left.v + start.right.v) / 2 };
    region.center = {
      u: clampRegionParam(startCenter.u + du),
      v: clampRegionParam(startCenter.v + dv)
    };
    normalizeBranchRootRegion(lock);
    const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
    if (parent) deps.rebuildLockGeometry(parent);
    else deps.rebuildLockGeometry(lock);
    deps.updateCurveObjects(lock);
    renderBranchRegionEditor();
    return;
  }
  const vc = clampRegionParam((cross.left.v + cross.right.v) / 2);
  const uc = clampRegionParam((cross.up.u + cross.down.u) / 2);
  const name = deps.sculptState.branchRegionCanvasDrag.name;
  const next = name === "up" || name === "down"
    ? { u: uv.u, v: vc }
    : { u: uc, v: uv.v };
  setBranchRootRegionPoint(lock, name, next);
  renderBranchRegionEditor();
}

function endBranchRegionCanvasDrag(event) {
  if (!deps.sculptState.branchRegionCanvasDrag) return;
  try { branchRegionCanvas.releasePointerCapture?.(deps.sculptState.branchRegionCanvasDrag.pointerId); } catch (e) { /* synthetic */ }
  deps.sculptState.branchRegionCanvasDrag = null;
}

function beginBranchSweepStartDrag(event) {
  const selected = deps.locks.find((item) => item.id === deps.selState.selectedId);
  const handle = selected?.curveObjects?.branchSweepStartHandle;
  if (!handle || selected?.locked) return false;
  // Navigation modifier keys (Alt rotate/zoom) take priority over handle dragging.
  if (event.button !== 0 || event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return false;
  deps.raycaster.setFromCamera(deps.pointerToNdc(event), deps.camera);
  const hits = deps.raycaster.intersectObjects([handle], false);
  if (!hits.length) return false;
  deps.sculptState.branchSweepStartDrag = { lockId: selected.id, pointerId: event.pointerId };
  deps.pushUndoState();
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  event.stopImmediatePropagation();
  event.preventDefault();
  return true;
}

function updateBranchSweepStartDrag(event) {
  if (!deps.sculptState.branchSweepStartDrag || event.pointerId !== deps.sculptState.branchSweepStartDrag.pointerId) return;
  // Mouse: never move on button-less pointermove (guards a lingering drag state).
  if (event.pointerType === "mouse" && (event.buttons & 1) === 0) return;
  const lock = deps.locks.find((item) => item.id === deps.sculptState.branchSweepStartDrag.lockId);
  if (!lock?.branchRootRegion) { deps.sculptState.branchSweepStartDrag = null; return; }
  deps.raycaster.setFromCamera(deps.pointerToNdc(event), deps.camera);
  const hit = deps.raycaster.intersectObject(lock.mesh, false)[0];
  if (!hit) return;
  const curve = deps.strandGeometryCurve(lock);
  let bestT = Number(lock.branchSweepStartT ?? 0.1);
  let bestDist = Infinity;
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64;
    const d = curve.getPoint(t).distanceToSquared(hit.point);
    if (d < bestDist) { bestDist = d; bestT = t; }
  }
  const clamped = THREE.MathUtils.clamp(bestT, 0.02, 0.6);
  if (Math.abs(clamped - Number(lock.branchSweepStartT ?? 0.1)) < 0.001) return;
  lock.branchSweepStartT = clamped;
  deps.rebuildLockGeometry(lock, { updateBranches: false });
  deps.updateCurveObjects(lock);
}

function endBranchSweepStartDrag(event) {
  if (!deps.sculptState.branchSweepStartDrag || (event?.pointerId !== undefined && event.pointerId !== deps.sculptState.branchSweepStartDrag.pointerId)) return;
  deps.renderer.domElement.releasePointerCapture?.(deps.sculptState.branchSweepStartDrag.pointerId);
  deps.sculptState.branchSweepStartDrag = null;
}

function updateBranchRegionMeshPoints() {
  deps.branchRegionMeshPointsGroup.clear();
  if (!deps.hairState.branchRegionMeshPointsVisible) {
    deps.branchRegionMeshPointsGroup.visible = false;
    return;
  }
  const lock = deps.locks.find((item) => item.id === deps.sculptState.branchRegionEdit);
  const world = lock ? deps.branchRootRegionWorldPoints(lock) : null;
  if (!world) {
    deps.branchRegionMeshPointsGroup.visible = false;
    return;
  }
  Object.entries(world).forEach(([name, point]) => {
    const material = name === "center" ? deps.branchRegionCenterMeshPointMaterial : deps.branchRegionMeshPointMaterial;
    const scale = name === "center" ? 1.6 : 1;
    const handle = new THREE.Mesh(deps.branchRegionMeshPointGeometry, material);
    handle.position.copy(point);
    handle.scale.setScalar(scale);
    handle.renderOrder = 35;
    deps.branchRegionMeshPointsGroup.add(handle);
  });
  deps.branchRegionMeshPointsGroup.visible = true;
}
  return {
    syncBranchRootRegionOffsets, updateBranchRootRegionCenter, clampRegionParam,
    branchRootRegionFromParam, cloneBranchRootRegion, normalizeBranchRootRegion,
    setBranchRootRegionPoint, branchRegionUVToCanvas, branchRegionCanvasToUV,
    openBranchRegionEditor, closeBranchRegionEditor, retargetBranchRegionEditor,
    renderBranchRegionEditor, applyBranchRegionView, resetBranchRegionZoom,
    branchRegionNavAction, beginBranchRegionCanvasNav, updateBranchRegionCanvasNav,
    updateBranchRegionCanvasZoom, updateBranchRegionCanvasPan, endBranchRegionCanvasNav,
    onBranchRegionCanvasWheel, branchRegionEventUV, beginBranchRegionCanvasDrag,
    updateBranchRegionCanvasDrag, endBranchRegionCanvasDrag, beginBranchSweepStartDrag,
    updateBranchSweepStartDrag, endBranchSweepStartDrag, updateBranchRegionMeshPoints
  };
}
