// placement.js - placement flow (createPlacedStrand / beginPlacementPointer / ... / updatePlacementStatus)
// business layer (refactor batch B2-2). Extracted from app.js; all app.js coupling injected via
// createPlacementApi(deps). updatePlacementStatus reads draw-flow surface state via deps.drawFlow.
import * as THREE from "three";
import { DEFAULT_HAIR_COLOR } from "../core/app-config.js?v=20260814-12";

export function createPlacementApi(deps) {
  // deps: store .state proxies (sel/sculptState/scalpState/hairState/miscState; use deps.X.y, never
  // deps.X.state.y), shared scene objects (camera/renderer/locks/guides/scalpSurfaceGroup/scalpSurfaceMesh),
  // scalp builder + shape presets apis (scalpBuilder/shapePresets), creation defaults
  // (strandCreationDefaults/braidMeshPresets), placement DOM elements (placementStatus/
  //   placeStrandScalpOffsetInput/proportionalRadiusInput/braidMeshPresetInput),
  // draw-flow api (drawFlow: drawFlowApi) for updatePlacementStatus surface-state reads,
  // app.js helper functions (addLock/updateLockGeometry/rebuildCurveObjects/updateCount/
  //   renderLockList/selectLock/getSelectedLock/selectCurvePoint/pushUndoState/updateInteractionLocks/
  //   createMirrorPartnerForNewLock/syncLockFromCurve/syncActiveMirror/syncInputs/fitPointAttributes/
  //   deselectStrands/pullMoveActive/componentEditModeActive/sculptBrushToolActive/
  //   effectiveSculptBrushTool/strandRegionDisplayLabel).
  // Batch-fill point in app.js: after the drawFlowDeps batch (all const/let deps defined) and before
  // the preset-library boot (loadBraidMeshPreset -> registerBraidMeshPreset -> updatePlacementStatus).

function createPlacedStrand(hit) {
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
  const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
  const surfaceCenter = deps.scalpSurfaceGroup.getWorldPosition(new THREE.Vector3());
  if (normal.dot(hit.point.clone().sub(surfaceCenter).normalize()) < 0) normal.negate();

  const hitCurveLattice = hit.object.userData.curveLatticeGuideId
    ? deps.guides.find((guide) => guide.id === hit.object.userData.curveLatticeGuideId)
    : null;
  const scalpRegion = hitCurveLattice?.scalpRegion || deps.scalpBuilder.scalpRegionAtHit(hit);
  const localRootOffset = THREE.MathUtils.clamp(
    deps.strandCreationDefaults.rootScalpOffset + Number(deps.placeStrandScalpOffsetInput.value),
    -1,
    1
  );
  const root = hit.point.clone().addScaledVector(normal, deps.scalpBuilder.rootScalpOffsetDistance(localRootOffset));
  let flow = new THREE.Vector3(0, -1, 0).projectOnPlane(normal).normalize();
  if (flow.lengthSq() < 0.01) {
    flow = root.clone().sub(surfaceCenter).setY(0).normalize();
  }
  if (flow.lengthSq() < 0.01) {
    flow = new THREE.Vector3(0, 0, 1).projectOnPlane(normal).normalize();
  }
  const side = new THREE.Vector3().crossVectors(flow, normal).normalize();
  const length = 1.28;
  const frame = { root, normal, flow, side, sideSign: Math.sign(root.x || 1), gravity: new THREE.Vector3(0, -1, 0), orientationStrength: 0 };
  const points = createPlacedPoints(frame, length);
  const placed = deps.addLock("front", {
    x: root.x,
    y: root.y,
    z: root.z,
    length,
    curve: points.at(-1).x - root.x,
    width: 0.16,
    taper: 0.58,
    strandRotation: deps.strandCreationDefaults.strandRotation,
    twist: deps.strandCreationDefaults.twist,
    twistCurve: deps.shapePresets.cloneShapePresetValue(deps.strandCreationDefaults.twistCurve),
    taperCurve: deps.shapePresets.cloneShapePresetValue(deps.strandCreationDefaults.taperCurve),
    depthCurve: deps.shapePresets.cloneShapePresetValue(deps.strandCreationDefaults.depthCurve),
    widthScale: deps.strandCreationDefaults.widthScale,
    depthScale: deps.strandCreationDefaults.depthScale,
    sweepProfile: deps.shapePresets.cloneShapePresetValue(deps.strandCreationDefaults.sweepProfile),
    profileOffset: deps.strandCreationDefaults.profileOffset,
    color: DEFAULT_HAIR_COLOR,
    scalpRegion,
    rootScalpOffset: localRootOffset,
    rootSurfacePoint: hit.point,
    rootSurfaceNormal: normal,
    points
  });
  placed.placementFrame = frame;
  placed.placementFrame.root.copy(placed.points[0]);
  applyPlacedStrandScaleProfile(placed);
  deps.updateLockGeometry(placed);
  deps.sel.pendingPlacedLockId = placed.id;
  if (deps.createMirrorPartnerForNewLock(placed)) {
    deps.renderLockList();
    deps.updateCount();
  }
  deps.selectCurvePoint(placed.id, 0);
  return placed;
}

function placedPointCount(length) {
  return THREE.MathUtils.clamp(Math.round(length / 0.42) + 2, 3, 9);
}

function createPlacedPoints(frame, length, countOverride) {
  const count = countOverride ?? placedPointCount(length);
  const gravity = frame.gravity || new THREE.Vector3(0, -1, 0);
  const orientationStrength = frame.orientationStrength || 0;
  const surfaceSlide = frame.flow.clone().multiplyScalar(length * THREE.MathUtils.lerp(0.18, 0.38, orientationStrength));
  const sideCurl = frame.side.clone().multiplyScalar(frame.sideSign * Math.min(0.12, length * 0.035));
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const t = count <= 1 ? 0 : i / (count - 1);
    const fall = length * t * 0.92;
    const point = frame.root.clone()
      .add(gravity.clone().multiplyScalar(fall))
      .add(surfaceSlide.clone().multiplyScalar(1 - Math.exp(-t * 3.2)))
      .add(sideCurl.clone().multiplyScalar(t * t));
    points.push(i === 0 ? point : pushPointOutsideHead(point, frame.normal, 0.055 + t * 0.035));
  }
  return points;
}

function pushPointOutsideHead(point, fallbackNormal, margin) {
  const local = deps.scalpSurfaceGroup.worldToLocal(point.clone());
  const direction = local.clone();
  if (direction.lengthSq() < 0.0001) {
    direction.set(
      fallbackNormal.x / Math.max(0.001, deps.scalpSurfaceGroup.scale.x),
      fallbackNormal.y / Math.max(0.001, deps.scalpSurfaceGroup.scale.y),
      fallbackNormal.z / Math.max(0.001, deps.scalpSurfaceGroup.scale.z)
    );
  }
  direction.normalize();
  const activeGeometry = deps.scalpBuilder.activeScalpSurfaceMesh().geometry;
  const position = activeGeometry.getAttribute("position");
  const sample = new THREE.Vector3();
  let bestAlignment = -Infinity;
  let surfaceRadius = 1;
  const activeIndices = deps.scalpBuilder.activeScalpSurfaceMesh() === deps.scalpSurfaceMesh
    ? deps.scalpState.scalpActiveVertexIndices
    : [...Array(position.count).keys()];
  for (const index of activeIndices) {
    sample.fromBufferAttribute(position, index);
    const alignment = sample.clone().normalize().dot(direction);
    if (alignment > bestAlignment) {
      bestAlignment = alignment;
      surfaceRadius = Math.max(0.05, sample.dot(direction));
    }
  }
  if (local.length() >= surfaceRadius) return point;
  const averageScale = (deps.scalpSurfaceGroup.scale.x + deps.scalpSurfaceGroup.scale.y + deps.scalpSurfaceGroup.scale.z) / 3;
  return deps.scalpSurfaceGroup.localToWorld(direction.multiplyScalar(surfaceRadius + margin / Math.max(0.001, averageScale)));
}

function resizePlacedStrand(lock, length, width, options = {}) {
  lock.length = length;
  lock.width = width;
  lock.baseWidth = width;
  lock.points = createPlacedPoints(lock.placementFrame, length, options.pointCount);
  deps.fitPointAttributes(lock, lock.points.length);
  applyPlacedStrandScaleProfile(lock);
  deps.syncLockFromCurve(lock);
  if (lock.curveObjects.handles.length !== lock.points.length) {
    deps.rebuildCurveObjects(lock);
  }
  deps.updateLockGeometry(lock);
  deps.syncActiveMirror(lock);
  deps.syncInputs(lock);
  deps.selectCurvePoint(lock.id, Math.min(deps.sel.selectedPoint?.pointIndex || 0, lock.points.length - 1));
}

function applyPlacedStrandScaleProfile(lock) {
  lock.pointScales = lock.points.map(() => ({ x: 1, z: 1 }));
  lock.pointWidths = lock.pointScales.map(() => 1);
}

function beginPlaceEdit(lock, event, options = {}) {
  if (options.saveUndo !== false && !deps.sculptState.placeEdit) deps.pushUndoState();
  deps.sculptState.placeEdit = {
    mode: "two-step",
    step: options.step || "direction",
    lockId: lock.id,
    startX: event.clientX,
    startY: event.clientY,
    baseLength: lock.length,
    baseWidth: lock.baseWidth,
    pointCount: lock.points.length,
    lastLength: lock.length,
    lastWidth: lock.baseWidth
  };
  deps.updateInteractionLocks();
  updatePlacementStatus();
}

function updatePlaceEdit(event) {
  if (!deps.sculptState.placeEdit || deps.sculptState.proportionalSizeEdit) return;
  if (deps.sculptState.placementPointer?.isDown) return;
  const lock = deps.locks.find((item) => item.id === deps.sculptState.placeEdit.lockId);
  if (!lock?.placementFrame) return;
  if (deps.sculptState.placeEdit.step === "direction") {
    updatePlacementOrientation(lock.placementFrame, event);
    resizePlacedStrand(lock, deps.sculptState.placeEdit.lastLength, deps.sculptState.placeEdit.lastWidth, { pointCount: deps.sculptState.placeEdit.pointCount });
    return;
  }
  updatePlacementLength(lock, event);
  event.preventDefault();
}

function updatePlacementLength(lock, event) {
  const dragDistance = Math.hypot(event.clientX - deps.sculptState.placeEdit.startX, event.clientY - deps.sculptState.placeEdit.startY);
  const length = THREE.MathUtils.clamp(0.38 + dragDistance / 115, 0.38, 3.4);
  const width = THREE.MathUtils.clamp(deps.sculptState.placeEdit.baseWidth * (0.85 + length / Math.max(0.1, deps.sculptState.placeEdit.baseLength) * 0.15), 0.045, 0.34);
  deps.sculptState.placeEdit.pointCount = placedPointCount(length);
  deps.sculptState.placeEdit.lastLength = length;
  deps.sculptState.placeEdit.lastWidth = width;
  resizePlacedStrand(lock, length, width, { pointCount: deps.sculptState.placeEdit.pointCount });
}

function updatePlacementOrientation(frame, event) {
  const dx = event.clientX - deps.sculptState.placeEdit.startX;
  const dy = event.clientY - deps.sculptState.placeEdit.startY;
  const dragDistance = Math.hypot(dx, dy);
  if (dragDistance < 8) return;

  const cameraRight = new THREE.Vector3().setFromMatrixColumn(deps.camera.matrixWorld, 0).normalize();
  const cameraUp = new THREE.Vector3().setFromMatrixColumn(deps.camera.matrixWorld, 1).normalize();
  const dragWorld = cameraRight.multiplyScalar(dx).add(cameraUp.multiplyScalar(-dy));
  const flow = dragWorld.projectOnPlane(frame.normal).normalize();
  if (flow.lengthSq() < 0.01) return;

  frame.flow.copy(flow);
  frame.side.crossVectors(frame.flow, frame.normal).normalize();
  frame.sideSign = Math.sign(frame.flow.x || frame.root.x || 1);
  frame.orientationStrength = THREE.MathUtils.clamp((dragDistance - 8) / 90, 0, 1);
}

function endPlaceEdit(event) {
  if (!deps.sculptState.placeEdit) return;
  if (deps.sculptState.placeEdit.mode === "two-step") return;
  const lock = deps.locks.find((item) => item.id === deps.sculptState.placeEdit.lockId);
  if (lock?.placementFrame) {
    resizePlacedStrand(lock, deps.sculptState.placeEdit.lastLength, deps.sculptState.placeEdit.lastWidth);
  }
  if (deps.renderer.domElement.hasPointerCapture?.(event.pointerId)) {
    deps.renderer.domElement.releasePointerCapture(event.pointerId);
  }
  deps.sculptState.placeEdit = null;
  deps.updateInteractionLocks();
  updatePlacementStatus();
}

function confirmPendingPlacedStrand(options = {}) {
  if (!deps.sel.pendingPlacedLockId) return;
  const confirmedId = deps.sel.pendingPlacedLockId;
  deps.sel.pendingPlacedLockId = null;
  if (options.deselect && deps.sel.selectedId === confirmedId) {
    deps.deselectStrands();
  }
  updatePlacementStatus();
}

function pendingPlacedLock() {
  return deps.locks.find((lock) => lock.id === deps.sel.pendingPlacedLockId);
}

function beginPlacementPointer(event, headHit) {
  deps.sculptState.placementPointer = {
    isDown: true,
    startX: event.clientX,
    startY: event.clientY,
    startTime: performance.now(),
    headHit
  };
}

function finishPlacementPointer(event) {
  if (!deps.sculptState.placementPointer?.isDown) return false;
  const heldMs = performance.now() - deps.sculptState.placementPointer.startTime;
  const moved = Math.hypot(event.clientX - deps.sculptState.placementPointer.startX, event.clientY - deps.sculptState.placementPointer.startY);
  const isClick = heldMs < 280 && moved < 6;
  const headHit = deps.sculptState.placementPointer.headHit;
  deps.sculptState.placementPointer = null;
  if (!isClick) {
    updatePlacementStatus();
    return true;
  }
  if (deps.sculptState.placeEdit) {
    confirmPlacementStep(event);
    return true;
  }
  if (headHit) {
    deps.pushUndoState();
    const placed = createPlacedStrand(headHit);
    beginPlaceEdit(placed, event, { saveUndo: false });
    return true;
  }
  return false;
}

function confirmPlacementStep(event) {
  if (!deps.sculptState.placeEdit) return false;
  const lock = deps.locks.find((item) => item.id === deps.sculptState.placeEdit.lockId);
  if (!lock?.placementFrame) {
    finishPlacementFlow();
    return true;
  }
  if (deps.sculptState.placeEdit.step === "direction") {
    updatePlacementOrientation(lock.placementFrame, event);
    resizePlacedStrand(lock, deps.sculptState.placeEdit.lastLength, deps.sculptState.placeEdit.lastWidth, { pointCount: deps.sculptState.placeEdit.pointCount });
    deps.sculptState.placeEdit.step = "length";
    deps.sculptState.placeEdit.startX = event.clientX;
    deps.sculptState.placeEdit.startY = event.clientY;
    deps.sculptState.placeEdit.baseLength = lock.length;
    deps.sculptState.placeEdit.baseWidth = lock.baseWidth;
    updatePlacementStatus();
    return true;
  }
  updatePlacementLength(lock, event);
  finishPlacementFlow({ keepSelected: true });
  return true;
}

function finishPlacementFlow(options = {}) {
  const placedId = deps.sel.pendingPlacedLockId;
  deps.sculptState.placeEdit = null;
  deps.sel.pendingPlacedLockId = null;
  deps.updateInteractionLocks();
  if (options.deselect && deps.sel.selectedId === placedId) {
    deps.deselectStrands();
  } else if (options.keepSelected && placedId) {
    deps.selectLock(placedId);
  }
  updatePlacementStatus();
}

function updatePlacementStatus() {
  if (!deps.placementStatus) return;
  let message = "";
  if (deps.sculptState.duplicatePlacement?.procedural) {
    const blend = Math.round((deps.sculptState.duplicatePlacement.procedural.blendAmount ?? 0) * 100);
    const [firstName, secondName] = deps.sculptState.duplicatePlacement.procedural.sourceNames;
    message = `Procedural duplicate: ${100 - blend}% ${firstName} / ${blend}% ${secondName}. Click to place repeatedly. Press Enter or Alt+D to finish.`;
  } else if (deps.sculptState.duplicatePlacement) {
    const duplicateCount = deps.sculptState.duplicatePlacement.lockIds?.length || 1;
    message = duplicateCount > 1
      ? `Duplicate ${duplicateCount} strands: move the pointer to position them, then left-click to place. Press Esc to cancel.`
      : "Duplicate strand: move the pointer to position its root, then left-click to place. Press Esc to cancel.";
  } else if (deps.sculptState.proportionalSizeEdit) {
    message = `Proportional influence: ${Number(deps.proportionalRadiusInput.value).toFixed(1)}. Release B to finish.`;
  } else if (deps.scalpState.scalpBuilderEditing) {
    message = deps.scalpState.scalpBuilderCurveLattice
      ? "Scalp curve lattice: select a cyan point and use the gizmo to shape the cage. Hold Alt and drag to orbit."
      : "Loading the authored scalp curve lattice...";
  } else if (deps.scalpState.scalpLatticeEditing) {
    message = "Placement lattice: drag a cyan cage point, or select it for axis controls.";
  } else if (deps.scalpState.scalpPaintEditing) {
    message = `Paint ${deps.strandRegionDisplayLabel(deps.scalpState.activeScalpRegion)}: drag over the scalp. Hold Shift, Ctrl, or Alt to orbit.`;
  } else if (deps.scalpState.scalpShapeEditing) {
    message = "Placement shape: adjust the artist controls in the panel. Advanced lattice is optional.";
  } else if (deps.sculptBrushToolActive()) {
    const sculptTool = deps.effectiveSculptBrushTool();
    message = sculptTool === "sculpt-smooth"
      ? "Smooth Brush: drag across visible strands to smooth nearby control points. Roots remain attached; release Shift to restore the selected brush."
      : sculptTool === "sculpt-inflate"
        ? "Inflate Brush: drag across visible strands to make them wider and thicker. Hold Shift for Smooth; Alt-drag orbits."
        : "Move Brush: drag across visible strands to move nearby control points in the view plane. Hold Shift for Smooth; Alt-drag orbits.";
  } else if (deps.sel.activeTool === "place") {
    if (deps.sculptState.placeEdit?.step === "direction") {
      message = "Step 1 of 2: move the mouse to choose hair flow, click to confirm. Hold and drag to orbit.";
    } else if (deps.sculptState.placeEdit?.step === "length") {
      message = "Step 2 of 2: move the mouse to set length, click to finish. Hold and drag to orbit.";
    } else {
      message = deps.drawFlow.selectedCurveLatticeGuide()
        ? "Place strand: click the selected curve lattice to set the root. Hold and drag to orbit."
        : "Place strand: click the scalp guide to set the root. Hold and drag to orbit.";
    }
  } else if (["draw", "procedural-draw"].includes(deps.sel.activeTool)) {
    const drawLabel = deps.sel.activeTool === "procedural-draw"
      ? "Draw procedural strand"
      : deps.hairState.drawStrandMode === "clump"
      ? "Draw 3 strand clump"
      : deps.hairState.drawStrandMode === "ponytail-clump" ? "Draw ponytail clump"
      : deps.hairState.drawStrandMode === "coil" ? "Draw coil" : "Draw strand";
    const surfaceMode = deps.drawFlow.activeStrokeSurfaceValue();
    const dynamicSurface = deps.drawFlow.activeStrokeDynamicEnabled(surfaceMode);
    if (surfaceMode === "contextual-plane") {
      message = `${drawLabel}: draw on the contextual 2D plane at the project origin. The closest view axis chooses its orientation.`;
    } else if (!dynamicSurface) {
      message = `${drawLabel}: drag across the selected surface. The stroke remains strictly conformed to it.`;
    } else {
      message = deps.sculptState.drawStrandStroke
        ? `${drawLabel}: drag across the live surface. Beyond its boundary, the stroke continues on the contextual 2D plane.`
        : `${drawLabel}: drag from the chosen live surface. Hold Shift for a surface-conformed eight-direction stroke; hold Ctrl or Alt for viewport navigation.`;
    }
  } else if (deps.sel.activeTool === "poly") {
    message = deps.sculptState.polyBrushStroke
      ? deps.sculptState.polyBrushStroke.kind === "relax"
        ? "Poly Brush: Shift-drag across the mesh to relax nearby vertices on the live surface."
        : deps.sculptState.polyBrushStroke.kind === "vertex"
        ? "Poly Brush: drag the vertex across the active live surface."
        : "Poly Brush: drag to extend a strip of authored quads."
      : "Poly Brush: Ctrl-click vertices to add them to the selection, Alt-click selected vertices to remove them, Shift-drag the mesh to relax, Shift-click a gap to fill or bridge, and Alt-click unselected components to delete.";
  } else if (deps.sel.activeTool === "braid") {
    const surfaceMode = deps.drawFlow.activeStrokeSurfaceValue();
    const dynamicSurface = deps.drawFlow.activeStrokeDynamicEnabled(surfaceMode);
    if (!deps.braidMeshPresets.has(deps.braidMeshPresetInput.value)) {
      message = "Braid: loading the selected mesh preset...";
    } else if (surfaceMode === "contextual-plane") {
      message = "Draw braid: draw on the contextual 2D plane at the project origin. The closest view axis chooses its orientation.";
    } else if (!dynamicSurface) {
      message = "Draw braid: drag across the selected surface. The braid remains strictly conformed to it.";
    } else {
      message = deps.sculptState.drawStrandStroke
        ? "Draw braid: drag across the live surface. Beyond its boundary, the braid continues on the contextual 2D plane."
        : "Draw braid: drag a continuous path from the chosen live surface. Hold Shift for a surface-conformed eight-direction stroke; hold Ctrl or Alt for viewport navigation.";
    }
  } else if (deps.sel.activeTool === "panel") {
    const surfaceMode = deps.drawFlow.activeStrokeSurfaceValue();
    const dynamicSurface = deps.drawFlow.activeStrokeDynamicEnabled(surfaceMode);
    if (surfaceMode === "contextual-plane") {
      message = "Split Panel: draw its center path on the contextual 2D plane.";
    } else if (!dynamicSurface) {
      message = "Split Panel: drag across the selected surface. The center path remains conformed to it.";
    } else {
      message = deps.sculptState.drawStrandStroke
        ? "Split Panel: drag across the live surface. Beyond its boundary, continue on the contextual plane."
        : "Split Panel: drag a center path from the chosen live surface. Hold Shift for a surface-conformed eight-direction stroke.";
    }
  } else if (deps.sel.activeTool === "curve-surface") {
    message = deps.sculptState.curveSurfaceDraft?.activeStroke
      ? "Curve Surface: release to add this controller and its connected hair card. Hold Shift for an eight-direction surface-conformed curve."
      : deps.sculptState.curveSurfaceDraft?.curves?.length
        ? "Curve Surface: draw another controller, hold Shift for a straight surface-conformed curve, or press Enter to confirm."
        : "Curve Surface: draw the first hair-card controller. Hold Shift for a straight surface-conformed curve; hold Ctrl or Alt for viewport navigation."
  } else if (deps.sel.activeTool === "draw-capsule-guide") {
    message = deps.sculptState.capsuleGuideDrawStroke
      ? "Draw Capsule Guide: drag from the open root toward the rounded tip, then release to create the guide."
      : "Draw Capsule Guide: drag from root to tip on the active live surface. Hold Ctrl or Alt for viewport navigation.";
  } else if (deps.sel.activeTool === "surface-loft") {
    if (deps.miscState.loftSurfaceDraft?.horizontalPoints) {
      message = deps.miscState.loftSurfaceDraft.activeStroke
        ? "Loft Surface step 2 of 2: draw the vertical curve. Release to create the surface."
        : "Loft Surface step 2 of 2: draw a vertical curve crossing the magenta horizontal curve. Press Esc to restart.";
    } else {
      message = deps.miscState.loftSurfaceDraft?.activeStroke
        ? "Loft Surface step 1 of 2: draw the horizontal curve."
        : "Loft Surface step 1 of 2: draw a horizontal profile on the chosen Live Surface.";
    }
  } else if (deps.sculptState.capsuleGuideEditing) {
    message = "Capsule guide: select a horizontal loop, then use Move, Rotate, or Scale to edit the entire loop.";
  } else if (["select", "move", "rotate", "scale"].includes(deps.sel.activeTool) && deps.drawFlow.selectedCurveLatticeGuide()) {
    message = deps.sel.selectedStrandGroup
      ? "Group curve: move a cyan control point to reshape every strand in the selected group."
      : "Curve lattice guide: click a control point, or click an edge to select its full horizontal or vertical loop.";
  } else if (deps.pullMoveActive()) {
    message = "Pull strand: drag a curve point to pose the chain. The root stays planted and nearby points follow.";
  } else if (deps.sculptState.proportionalEditing) {
    message = "Proportional editing: tap B to toggle off, or hold B and drag to resize influence.";
  } else if (
    !deps.componentEditModeActive()
    && deps.sculptState.viewportEditMode === "strand"
    && ["move", "rotate", "scale"].includes(deps.sel.activeTool)
    && deps.getSelectedLock()
  ) {
    message = `${deps.sel.activeTool[0].toUpperCase()}${deps.sel.activeTool.slice(1)} object: the active gizmo is rooted at the strand origin; all selected strands are affected.`;
  } else if (deps.sculptState.objectSpaceEditing && ["move", "rotate", "scale"].includes(deps.sel.activeTool)) {
    message = "Object space: gizmo is aligned to the selected curve point. Press O for world space.";
  }
  deps.placementStatus.textContent = message;
  const hidden = !deps.miscState.toolTipsEnabled || !message;
  deps.placementStatus.classList.toggle("hidden", hidden);
  deps.placementStatus.setAttribute("aria-hidden", String(hidden));
}

  return {
    createPlacedStrand,
    placedPointCount,
    createPlacedPoints,
    pushPointOutsideHead,
    resizePlacedStrand,
    applyPlacedStrandScaleProfile,
    beginPlaceEdit,
    updatePlaceEdit,
    updatePlacementLength,
    updatePlacementOrientation,
    endPlaceEdit,
    confirmPendingPlacedStrand,
    pendingPlacedLock,
    beginPlacementPointer,
    finishPlacementPointer,
    confirmPlacementStep,
    finishPlacementFlow,
    updatePlacementStatus,
  };
}
