// reference-head.js — reference image + head/body guide mesh business layer (refactor batch A4).
// Extracted from app.js; all app.js coupling injected via createReferenceHeadApi(deps).
// Covers: reference image import/placement/crop/transform/visibility/UI (R1-R3) + head/body mesh
// import/transform/material/visibility (H1-H5). App.js keeps boot, store assembly, event binding,
// and the outliner/selection spine; cross-module callers (scalp-builder/poly-tools/draw-flow deps)
// receive this api's functions via referenceHeadApi.
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { polygonOnlyObjSource } from "../io/obj-import.js?v=20260814-12";
import { applicationDropFileKind } from "../io/file-drop.js?v=20260814-12";

const MIN_REFERENCE_CROP_SPAN = 0.02;

const REFERENCE_VIEW_BY_CAMERA_AXIS = Object.freeze({
  "0,0,1": "front",
  "0,0,-1": "back",
  "1,0,0": "right",
  "-1,0,0": "left"
});

const REFERENCE_OUTLINER_GROUPS = Object.freeze([
  { id: "overlay", label: "Viewport Overlays" },
  { id: "front", label: "Front" },
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
  { id: "back", label: "Back" }
]);

const REFERENCE_OVERLAY_HANDLE_HIT_RADIUS = 15;

const REFERENCE_CROP_ANCHORS = Object.freeze(["nw", "ne", "se", "sw"]);

export function createReferenceHeadApi(deps) {
  // deps: store .state proxies (sel/sculptState/guideState/head/scalpState/ref/viewportState/ui;
  //   use deps.X.y, never deps.X.state.y), shared scene state (referenceImages/locks/guides/scene/viewport/
  //   viewportPanel/renderer/raycaster/transformControls/camera/controls/scalpSurfaceGroup/referenceImageGroup),
  //   module apis (scalpBuilder/guideApi/placementApi), app.js spine helpers (pushUndoState/
  //   updateInteractionLocks/setOrthographicView/setViewportEditMode/configureTransformControls/
  //   syncOrthographicFramingFromDistance/updateCameraProjectionForViewport/frameViewportBounds/
  //   deselectStrandsForGuideEditor/applyCharacterMeshDisplayVisibility/syncDisplayVisibilityInputs/
  //   createOutlinerVisibilityToggle/handleOutlinerRenameClick/showOutlinerContextMenu/sideNamingDisplayId/
  //   isCameraInSnappedView/cardinalAxisKey/viewPlaneNormal/clearStrandSelectionState/setStrandSelectionVisual/
  //   updateCurveObjects/setOutlinerTab/renderLockList/updateAttributeEditorMode/refreshRebuildCurveDialog/
  //   strandVisibleForDisplay), constants (SUPPORTED_REFERENCE_IMAGE_TYPES/GUIDE_HEAD_REFERENCE_SIZE/
  //   GUIDE_HEAD_TARGET_HEIGHT/FULL_BODY_TARGET_HEIGHT), and DOM elements (headTransform/headTransformInputs/
  //   headTransformValues/referenceImage*/referencePlane*/referenceOutliner/referenceGroupOpen/
  //   referenceImageDropTarget/referenceOverlayDropMarker/referenceCropHandles/referenceCropHandleElements/
  //   viewportReferenceImages/referenceImageFile/headMeshFileInput/fullBodyMeshFileInput).

function disposeGuideModel(model) {
  if (!model) return;
  deps.scene.remove(model);
  model.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
    else child.material?.dispose();
  });
}

function syncHeadTransformInputs() {
  Object.entries(deps.headTransformInputs).forEach(([key, input]) => {
    input.value = String(deps.headTransform[key]);
    deps.headTransformValues[key].textContent = Number(deps.headTransform[key]).toFixed(2);
  });
}

function applyHeadTransform() {
  if (!deps.guideState.guideModel) return;
  const sourceCenter = deps.guideState.guideModel.userData.sourceCenter;
  const fittedCenter = deps.guideState.guideModel.userData.fittedCenter;
  const baseScale = Number(deps.guideState.guideModel.userData.baseScale);
  if (!sourceCenter || !fittedCenter || !Number.isFinite(baseScale)) return;
  const scaleX = baseScale * deps.headTransform.uniformScale * deps.headTransform.scaleX;
  const scaleY = baseScale * deps.headTransform.uniformScale * deps.headTransform.scaleY;
  const scaleZ = baseScale * deps.headTransform.uniformScale * deps.headTransform.scaleZ;
  deps.guideState.guideModel.scale.set(scaleX, scaleY, scaleZ);
  deps.guideState.guideModel.position.set(
    fittedCenter.x + deps.headTransform.positionX - sourceCenter.x * scaleX,
    fittedCenter.y + deps.headTransform.positionY - sourceCenter.y * scaleY,
    fittedCenter.z + deps.headTransform.positionZ - sourceCenter.z * scaleZ
  );
  deps.guideState.guideModel.updateMatrixWorld(true);
}

function resetHeadTransform() {
  Object.assign(deps.headTransform, {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    uniformScale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1
  });
  syncHeadTransformInputs();
  applyHeadTransform();
}

function installGuideModel(obj, options = {}) {
  const { normalize = false, frame = true, fullBody = false } = options;
  const box = fullBody ? new THREE.Box3().setFromObject(obj) : deps.guideApi.guideHeadBounds(obj);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const sourceSize = fullBody ? size.y : Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(sourceSize) || sourceSize <= 0) throw new Error("Reference OBJ contains no usable mesh bounds");
  const scale = fullBody
    ? deps.FULL_BODY_TARGET_HEIGHT / sourceSize
    : deps.GUIDE_HEAD_TARGET_HEIGHT / (normalize ? sourceSize : deps.GUIDE_HEAD_REFERENCE_SIZE);
  const fittedCenter = new THREE.Vector3(0, 0.05, 0);
  if (fullBody) {
    deps.scalpSurfaceGroup.updateMatrixWorld(true);
    const scalpBounds = new THREE.Box3().setFromObject(deps.scalpBuilder.activeScalpSurfaceMesh());
    const scalpCenter = scalpBounds.getCenter(new THREE.Vector3());
    fittedCenter.set(
      scalpCenter.x,
      scalpBounds.max.y - (size.y * scale * 0.5),
      scalpCenter.z
    );
  }

  obj.scale.setScalar(scale);
  obj.position.set(
    fittedCenter.x - center.x * scale,
    fittedCenter.y - center.y * scale,
    fittedCenter.z - center.z * scale
  );
  obj.userData.sourceCenter = center.clone();
  obj.userData.fittedCenter = fittedCenter;
  obj.userData.baseScale = scale;
  obj.userData.sourceHeight = size.y;
  obj.userData.fullBodyReference = fullBody;
  let meshCount = 0;
  obj.traverse((child) => {
    if (!child.isMesh) return;
    meshCount += 1;
    child.castShadow = true;
    child.receiveShadow = true;
    child.frustumCulled = false;
    child.geometry = mergeVertices(child.geometry, 0.0001);
    child.geometry.deleteAttribute("uv");
    child.geometry.deleteAttribute("color");
    child.geometry.computeVertexNormals();
    child.material = new THREE.MeshStandardMaterial({
      color: 0x3b3d42,
      roughness: 0.9,
      metalness: 0,
      flatShading: false,
      vertexColors: false,
      transparent: false,
      opacity: 1,
      side: THREE.FrontSide,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp
    });
  });
  if (!meshCount) throw new Error("Head OBJ does not contain any mesh geometry");
  disposeGuideModel(deps.guideState.guideModel);
  deps.guideState.guideModel = obj;
  deps.scene.add(obj);
  resetHeadTransform();
  setHeadReferenceTransparency(false);
  deps.applyCharacterMeshDisplayVisibility();
  deps.syncDisplayVisibilityInputs();
  if (frame) {
    frameGuideModel(fullBody
      ? { distanceScale: 1.1, targetYOffset: 0, fullBody: true }
      : { distanceScale: 1.35, targetYOffset: -0.12 });
  }
}

function loadDefaultGuideModel(options = {}) {
  return new Promise((resolve, reject) => {
    new OBJLoader().load("./assets/headplusfeatures.obj?v=20260720-1", (obj) => {
      try {
        installGuideModel(obj, options);
        obj.updateMatrixWorld(true);
        deps.scalpState.authoredScalpGuideMatrix = obj.matrixWorld.clone();
        deps.head.importedHeadAsset = null;
        deps.scalpBuilder.ensureEditedScalpSurface().catch((error) => {
          console.error("Could not initialize the live authored scalp surface", error);
        });
        resolve(obj);
      } catch (error) {
        reject(error);
      }
    }, undefined, reject);
  });
}

function frameGuideModel({
  distanceScale = 1,
  targetYOffset = 0.18,
  fullBody = Boolean(deps.guideState.guideModel?.userData?.fullBodyReference)
} = {}) {
  if (fullBody) {
    deps.frameViewportBounds(deps.scalpBuilder.fullBodyScalpFocusBounds());
    return;
  }
  deps.ui.shiftSnappedViewActive = false;
  const box = deps.guideApi.guideHeadBounds(deps.guideState.guideModel);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.62;
  deps.camera.up.set(0, 1, 0);
  deps.controls.target.copy(center);
  deps.controls.target.y += targetYOffset;
  deps.camera.position.set(center.x, center.y + 0.28, center.z + Math.max(4.2, radius * 2.8) * distanceScale);
  deps.camera.near = 0.05;
  deps.camera.far = 100;
  if (deps.viewportState.orthographicView) deps.syncOrthographicFramingFromDistance();
  deps.updateCameraProjectionForViewport();
  deps.camera.updateProjectionMatrix();
}

function setHeadReferenceTransparency(enabled, opacity = 0.76) {
  deps.guideState.guideModel?.traverse((child) => {
    if (!child.isMesh) return;
    child.material.transparent = enabled;
    child.material.opacity = enabled ? opacity : 1;
    child.material.depthWrite = !enabled;
    child.material.needsUpdate = true;
  });
}

function trianglePlaneIntersections(a, b, c, axis, planePosition) {
  const points = [];
  const epsilon = 1e-5;
  [[a, b], [b, c], [c, a]].forEach(([start, end]) => {
    const startDistance = start[axis] - planePosition;
    const endDistance = end[axis] - planePosition;
    if (Math.abs(startDistance) <= epsilon && Math.abs(endDistance) <= epsilon) return;
    let point = null;
    if (Math.abs(startDistance) <= epsilon) point = start.clone();
    else if (Math.abs(endDistance) <= epsilon) point = end.clone();
    else if (startDistance * endDistance < 0) {
      const amount = startDistance / (startDistance - endDistance);
      point = start.clone().lerp(end, amount);
    }
    if (point && !points.some((candidate) => candidate.distanceToSquared(point) < epsilon * epsilon)) {
      points.push(point);
    }
  });
  return points.slice(0, 2);
}

function headPlaneIntersectionSegments(axis, planePosition) {
  const segments = [];
  const triangle = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const intersectionMeshes = deps.scalpBuilder.scalpBuilderHeadMeshes();
  intersectionMeshes.forEach((mesh) => {
    const geometry = mesh.geometry;
    const position = geometry?.getAttribute("position");
    if (!position) return;
    mesh.updateMatrixWorld(true);
    const index = geometry.index;
    const triangleCount = index ? index.count / 3 : position.count / 3;
    for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
      for (let corner = 0; corner < 3; corner += 1) {
        const vertexIndex = index ? index.getX(triangleIndex * 3 + corner) : triangleIndex * 3 + corner;
        triangle[corner].fromBufferAttribute(position, vertexIndex).applyMatrix4(mesh.matrixWorld);
      }
      const intersections = trianglePlaneIntersections(
        triangle[0], triangle[1], triangle[2], axis, planePosition
      );
      if (intersections.length !== 2) continue;
      segments.push(intersections.map((point) => point.clone()));
    }
  });
  return segments;
}

function setHeadSetupEditing(enabled) {
  if (enabled) deps.deselectStrandsForGuideEditor();
  if (enabled && deps.scalpState.scalpBuilderEditing) deps.scalpBuilder.setScalpBuilderEditing(false);
  if (enabled && deps.scalpState.scalpShapeEditing) deps.scalpBuilder.setScalpShapeEditing(false);
  if (enabled && deps.scalpState.scalpPaintEditing) deps.scalpBuilder.setScalpPaintEditing(false);
  deps.sculptState.headSetupEditing = Boolean(enabled);
  setHeadReferenceTransparency(false);
  if (deps.sculptState.headSetupEditing) {
    deps.scalpBuilder.setScalpGuideVisibility(true);
    deps.scalpBuilder.createScalpBuilderCurveLattice();
  }
  else if (!deps.scalpState.scalpBuilderEditing) deps.scalpBuilder.disposeScalpBuilderVisuals();
  deps.scalpBuilder.updateScalpEditingVisibility();
  deps.placementApi.updatePlacementStatus();
}

async function importHeadMeshFile(file) {
  const importButton = document.querySelector("#importHeadMesh");
  try {
    const content = await file.text();
    const model = new OBJLoader().parse(polygonOnlyObjSource(content));
    installGuideModel(model, { normalize: true });
    deps.head.importedHeadAsset = {
      format: "obj",
      name: file.name || "custom-head.obj",
      content
    };
    importButton.title = `Using ${deps.head.importedHeadAsset.name}. Import another head mesh`;
    document.querySelector("#importFullBodyMesh").title = "Import a full body OBJ, scale it to seven head heights, and align its top to the scalp guide";
    return true;
  } catch (error) {
    console.error("Could not import head OBJ", error);
    window.alert("That OBJ could not be imported as a head mesh. Please check that it contains valid polygon geometry.");
    return false;
  } finally {
    deps.headMeshFileInput.value = "";
  }
}

async function importFullBodyMeshFile(file) {
  const importButton = document.querySelector("#importFullBodyMesh");
  try {
    const content = await file.text();
    const model = new OBJLoader().parse(polygonOnlyObjSource(content));
    installGuideModel(model, { normalize: true, fullBody: true });
    deps.head.importedHeadAsset = {
      format: "obj",
      name: file.name || "custom-full-body.obj",
      content,
      fit: "full-body"
    };
    importButton.title = `Using ${deps.head.importedHeadAsset.name}. Import another full body mesh`;
    document.querySelector("#importHeadMesh").title = "Import head mesh from an OBJ file";
    return true;
  } catch (error) {
    console.error("Could not import full body OBJ", error);
    window.alert("That OBJ could not be imported as a full body mesh. Please check that it contains valid polygon geometry.");
    return false;
  } finally {
    deps.fullBodyMeshFileInput.value = "";
  }
}

function headMeshes() {
  const meshes = [];
  deps.guideState.guideModel?.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

function selectedReferenceImage() {
  return deps.referenceImages.find((reference) => reference.id === deps.sel.selectedReferenceImageId) || null;
}

function normalizeReferenceCrop(crop = {}) {
  const left = THREE.MathUtils.clamp(Number(crop.left ?? 0), 0, 1 - MIN_REFERENCE_CROP_SPAN);
  const top = THREE.MathUtils.clamp(Number(crop.top ?? 0), 0, 1 - MIN_REFERENCE_CROP_SPAN);
  const right = THREE.MathUtils.clamp(Number(crop.right ?? 1), left + MIN_REFERENCE_CROP_SPAN, 1);
  const bottom = THREE.MathUtils.clamp(Number(crop.bottom ?? 1), top + MIN_REFERENCE_CROP_SPAN, 1);
  return { left, top, right, bottom };
}

function referenceCropIsFull(reference) {
  const crop = normalizeReferenceCrop(reference?.crop);
  return crop.left === 0 && crop.top === 0 && crop.right === 1 && crop.bottom === 1;
}

function referencePlaneFrontAxis(view = "front") {
  return ({
    front: { axis: "z", sign: 1 },
    back: { axis: "z", sign: -1 },
    left: { axis: "x", sign: -1 },
    right: { axis: "x", sign: 1 }
  })[view] || { axis: "z", sign: 1 };
}

function referencePlanePlacement(view = "front", inFront = true) {
  const placements = {
    front: { position: [0, 0.8, 2.4], rotation: [0, 0, 0] },
    back: { position: [0, 0.8, -2.4], rotation: [0, Math.PI, 0] },
    left: { position: [-2.4, 0.8, 0], rotation: [0, -Math.PI / 2, 0] },
    right: { position: [2.4, 0.8, 0], rotation: [0, Math.PI / 2, 0] }
  };
  const placement = placements[view] || placements.front;
  if (inFront) return placement;
  const position = [...placement.position];
  const { axis } = referencePlaneFrontAxis(view);
  position[axis === "x" ? 0 : 2] *= -1;
  return { position, rotation: [...placement.rotation] };
}

function migratedReferencePlanePosition(snapshot, view, placement) {
  const position = snapshot.position;
  if (!position) return position;
  const version = Number(snapshot.planePlacementVersion || 1);
  if (version < 2) {
    const legacyZ = view === "front" ? -2.4 : view === "back" ? 2.4 : null;
    const untouchedLegacyPlacement = legacyZ != null
      && Math.abs(Number(position.x)) < 0.0001
      && Math.abs(Number(position.y) - 0.8) < 0.0001
      && Math.abs(Number(position.z) - legacyZ) < 0.0001;
    if (untouchedLegacyPlacement) {
      return { x: placement.position[0], y: placement.position[1], z: placement.position[2] };
    }
  }
  if (version < 3 && isUntouchedLegacySideReferencePlacement(snapshot, view)) {
    return { x: placement.position[0], y: placement.position[1], z: placement.position[2] };
  }
  return position;
}

function isUntouchedLegacySideReferencePlacement(snapshot, view) {
  if (view !== "left" && view !== "right") return false;
  const oldSign = view === "left" ? 1 : -1;
  const oldRotationY = view === "left" ? -Math.PI / 2 : Math.PI / 2;
  const position = snapshot.position;
  const rotation = snapshot.rotation;
  return position
    && Math.abs(Number(position.x) - 2.4 * oldSign) < 0.0001
    && Math.abs(Number(position.y) - 0.8) < 0.0001
    && Math.abs(Number(position.z)) < 0.0001
    && (!rotation || (
      Math.abs(Number(rotation.x)) < 0.0001
      && Math.abs(Number(rotation.y) - oldRotationY) < 0.0001
      && Math.abs(Number(rotation.z)) < 0.0001
    ));
}

function migratedReferencePlaneRotation(snapshot, view, placement) {
  if (
    Number(snapshot.planePlacementVersion || 1) < 3
    && isUntouchedLegacySideReferencePlacement(snapshot, view)
  ) {
    return { x: placement.rotation[0], y: placement.rotation[1], z: placement.rotation[2] };
  }
  if (
    Number(snapshot.planePlacementVersion || 1) < 4
    && isInwardFacingSideReferencePlacement(snapshot, view)
  ) {
    return { x: placement.rotation[0], y: placement.rotation[1], z: placement.rotation[2] };
  }
  return snapshot.rotation;
}

function isInwardFacingSideReferencePlacement(snapshot, view) {
  if (view !== "left" && view !== "right") return false;
  const sideSign = view === "left" ? -1 : 1;
  const inwardRotationY = view === "left" ? Math.PI / 2 : -Math.PI / 2;
  const position = snapshot.position;
  const rotation = snapshot.rotation;
  return position
    && rotation
    && Math.abs(Number(position.x) - 2.4 * sideSign) < 0.0001
    && Math.abs(Number(position.y) - 0.8) < 0.0001
    && Math.abs(Number(position.z)) < 0.0001
    && Math.abs(Number(rotation.x)) < 0.0001
    && Math.abs(Number(rotation.y) - inwardRotationY) < 0.0001
    && Math.abs(Number(rotation.z)) < 0.0001;
}

function snappedReferenceImageView() {
  const snapped = deps.isCameraInSnappedView();
  if (!deps.viewportState.orthographicView || !snapped) return null;
  return REFERENCE_VIEW_BY_CAMERA_AXIS[deps.cardinalAxisKey(deps.viewPlaneNormal())] || null;
}

function updateReferencePlaneVisibility() {
  const snappedView = snappedReferenceImageView();
  deps.referenceImages.forEach((reference) => {
    if (reference.type !== "plane" || !reference.mesh) return;
    const nextVisible = reference.visible
      && (!reference.snappedViewOnly || reference.view === snappedView);
    if (reference.mesh.visible === nextVisible) return;
    reference.mesh.visible = nextVisible;
    if (!nextVisible && deps.transformControls.object === reference.mesh) {
      deps.transformControls.detach();
    } else if (nextVisible && reference.id === deps.sel.selectedReferenceImageId) {
      attachReferenceImageTransform();
    }
  });
}

function applyReferenceImageRuntime(reference) {
  const crop = normalizeReferenceCrop(reference.crop);
  reference.crop = crop;
  if (reference.type === "overlay" && reference.element) {
    const viewportWidth = Math.max(1, deps.viewport.clientWidth);
    const viewportHeight = Math.max(1, deps.viewport.clientHeight);
    const aspect = Math.max(0.05, Number(reference.aspect || 1));
    const baseWidth = Math.min(viewportWidth * 0.68, 900, viewportHeight * 0.88 * aspect);
    reference.element.style.left = `${reference.x}%`;
    reference.element.style.top = `${reference.y}%`;
    reference.element.style.width = `${baseWidth * reference.scale}px`;
    reference.element.style.aspectRatio = String(aspect);
    if (reference.cropElement) {
      reference.cropElement.style.clipPath = `inset(${crop.top * 100}% ${(1 - crop.right) * 100}% ${(1 - crop.bottom) * 100}% ${crop.left * 100}%)`;
    }
    if (reference.imageElement) {
      reference.imageElement.style.opacity = String(reference.opacity);
      reference.imageElement.style.transform = reference.flipX ? "scaleX(-1)" : "none";
    }
    const topLeftAnchored = reference.overlayAnchor === "top-left";
    reference.element.style.transform = topLeftAnchored ? "none" : "translate(-50%, -50%)";
    reference.element.style.transformOrigin = topLeftAnchored ? "top left" : "center";
    reference.element.hidden = !reference.visible;
    return;
  }
  if (reference.type === "plane" && reference.mesh) {
    reference.mesh.position.set(reference.position.x, reference.position.y, reference.position.z);
    reference.mesh.rotation.set(reference.rotation.x, reference.rotation.y, reference.rotation.z);
    reference.mesh.scale.setScalar(reference.scale);
    reference.mesh.material.opacity = reference.opacity;
    const texture = reference.mesh.material.map;
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = reference.flipX ? -1 : 1;
      texture.offset.x = reference.flipX ? 1 : 0;
      texture.repeat.y = 1;
      texture.offset.y = 0;
      texture.needsUpdate = true;
    }
    updateReferencePlaneVisibility();
  }
}

function updateReferenceSelectionVisuals() {
  deps.referenceImages.forEach((reference) => {
    const selected = reference.id === deps.sel.selectedReferenceImageId;
    reference.element?.classList.toggle("selected-reference", selected);
    if (reference.selectionOutline) reference.selectionOutline.visible = selected;
  });
}

function createReferenceImageRuntime(reference) {
  if (reference.type === "overlay") {
    const frame = document.createElement("div");
    frame.className = "viewport-reference-frame";
    frame.dataset.referenceImageId = reference.id;
    const image = document.createElement("img");
    image.className = "viewport-reference-image";
    image.src = reference.source;
    image.alt = "";
    image.draggable = false;
    image.dataset.referenceImageId = reference.id;
    const cropElement = document.createElement("div");
    cropElement.className = "viewport-reference-image-clip";
    cropElement.appendChild(image);
    frame.appendChild(cropElement);
    ["nw", "ne", "sw", "se"].forEach((corner) => {
      const handle = document.createElement("span");
      handle.className = "reference-overlay-scale-handle";
      handle.dataset.overlayCorner = corner;
      handle.setAttribute("aria-hidden", "true");
      frame.appendChild(handle);
    });
    deps.viewportReferenceImages.appendChild(frame);
    reference.element = frame;
    reference.cropElement = cropElement;
    reference.imageElement = image;
    applyReferenceImageRuntime(reference);
    updateReferenceSelectionVisuals();
    return;
  }

  const aspect = Math.max(0.05, Number(reference.aspect || 1));
  const texture = new THREE.TextureLoader().load(reference.source);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(3 * aspect, 3);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: reference.opacity,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: false,
    toneMapped: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  const selectionOutline = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: 0x58f6ff,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
      depthWrite: false,
      toneMapped: false
    })
  );
  selectionOutline.visible = false;
  selectionOutline.renderOrder = 1000;
  selectionOutline.raycast = () => {};
  mesh.add(selectionOutline);
  mesh.userData.referenceImageId = reference.id;
  mesh.renderOrder = 0;
  reference.mesh = mesh;
  reference.selectionOutline = selectionOutline;
  deps.referenceImageGroup.add(mesh);
  applyReferenceImageRuntime(reference);
  updateReferenceSelectionVisuals();
}

function addReferenceImage(snapshot, { select = true } = {}) {
  if (!/^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(String(snapshot.source || ""))) return null;
  const type = snapshot.type === "plane" ? "plane" : "overlay";
  const planeInFront = snapshot.planeInFront !== false;
  const placement = referencePlanePlacement(snapshot.view, planeInFront);
  const savedPlanePosition = migratedReferencePlanePosition(snapshot, snapshot.view, placement);
  const savedPlaneRotation = migratedReferencePlaneRotation(snapshot, snapshot.view, placement);
  const newViewportOverlay = type === "overlay"
    && snapshot.overlayAnchor == null
    && snapshot.x == null
    && snapshot.y == null;
  const activeScale = THREE.MathUtils.clamp(Number(snapshot.scale ?? 1), 0.05, 20);
  const reference = {
    id: snapshot.id || `reference-${deps.ref.referenceImageIndex++}`,
    name: snapshot.name || `Reference ${deps.ref.referenceImageIndex - 1}`,
    type,
    source: snapshot.source,
    aspect: Math.max(0.05, Number(snapshot.aspect || 1)),
    opacity: THREE.MathUtils.clamp(Number(snapshot.opacity ?? 0.55), 0.05, 1),
    visible: snapshot.visible !== false,
    flipX: Boolean(snapshot.flipX),
    crop: normalizeReferenceCrop(snapshot.crop),
    snappedViewOnly: type === "plane" && Boolean(snapshot.snappedViewOnly),
    planeInFront,
    view: ["front", "back", "left", "right"].includes(snapshot.view) ? snapshot.view : "front",
    overlayAnchor: snapshot.overlayAnchor === "top-left" || newViewportOverlay
      ? "top-left"
      : "center",
    x: THREE.MathUtils.clamp(Number(snapshot.x ?? (newViewportOverlay ? 2 : 50)), 0, 100),
    y: THREE.MathUtils.clamp(Number(snapshot.y ?? (newViewportOverlay ? 2 : 50)), 0, 100),
    overlayConfigured: snapshot.overlayConfigured == null
      ? type === "overlay"
      : Boolean(snapshot.overlayConfigured),
    planeConfigured: snapshot.planeConfigured == null
      ? type === "plane"
      : Boolean(snapshot.planeConfigured),
    overlayScale: THREE.MathUtils.clamp(Number(snapshot.overlayScale ?? (type === "overlay" ? activeScale : 1)), 0.05, 20),
    planeScale: THREE.MathUtils.clamp(Number(snapshot.planeScale ?? (type === "plane" ? activeScale : 1)), 0.05, 20),
    scale: activeScale,
    planePlacementVersion: 4,
    position: { ...(savedPlanePosition || { x: placement.position[0], y: placement.position[1], z: placement.position[2] }) },
    rotation: { ...(savedPlaneRotation || { x: placement.rotation[0], y: placement.rotation[1], z: placement.rotation[2] }) }
  };
  const numericId = Number(reference.id.match(/\d+$/)?.[0]);
  if (Number.isFinite(numericId)) deps.ref.referenceImageIndex = Math.max(deps.ref.referenceImageIndex, numericId + 1);
  deps.referenceImages.push(reference);
  createReferenceImageRuntime(reference);
  if (select) selectReferenceImage(reference.id);
  else renderReferenceImagePanel();
  return reference;
}

function disposeReferenceImageRuntime(reference) {
  reference.element?.remove();
  reference.element = null;
  reference.cropElement = null;
  reference.imageElement = null;
  if (reference.selectionOutline) {
    reference.selectionOutline.geometry.dispose();
    reference.selectionOutline.material.dispose();
    reference.selectionOutline = null;
  }
  if (reference.mesh) {
    deps.referenceImageGroup.remove(reference.mesh);
    reference.mesh.geometry.dispose();
    reference.mesh.material.map?.dispose();
    reference.mesh.material.dispose();
  }
  reference.mesh = null;
}

function disposeReferenceImage(reference) {
  disposeReferenceImageRuntime(reference);
}

function clearReferenceImages() {
  deps.referenceImages.forEach(disposeReferenceImage);
  deps.referenceImages.length = 0;
  deps.sel.selectedReferenceImageId = null;
  if (deps.referenceImagePanel) renderReferenceImagePanel();
}

function serializeReferenceImage(reference) {
  return {
    id: reference.id,
    name: reference.name,
    type: reference.type,
    source: reference.source,
    aspect: reference.aspect,
    opacity: reference.opacity,
    visible: reference.visible,
    flipX: Boolean(reference.flipX),
    crop: { ...normalizeReferenceCrop(reference.crop) },
    snappedViewOnly: Boolean(reference.snappedViewOnly),
    planeInFront: reference.planeInFront !== false,
    view: reference.view,
    overlayAnchor: reference.overlayAnchor,
    overlayConfigured: Boolean(reference.overlayConfigured),
    planeConfigured: Boolean(reference.planeConfigured),
    overlayScale: Number(reference.overlayScale ?? reference.scale),
    planeScale: Number(reference.planeScale ?? reference.scale),
    planePlacementVersion: 4,
    x: reference.x,
    y: reference.y,
    scale: reference.scale,
    position: { ...reference.position },
    rotation: { ...reference.rotation }
  };
}

function setReferenceImageType(reference, nextType) {
  if (!reference || !["overlay", "plane"].includes(nextType) || reference.type === nextType) return;
  const previousScale = reference.scale;
  if (reference.type === "overlay") reference.overlayScale = previousScale;
  else {
    syncReferenceImageFromMesh(reference);
    reference.planeScale = reference.scale;
  }

  if (deps.transformControls.object === reference.mesh) deps.transformControls.detach();
  disposeReferenceImageRuntime(reference);
  if (nextType === "overlay") {
    if (!reference.overlayConfigured) {
      reference.x = 2;
      reference.y = 2;
      reference.overlayAnchor = "top-left";
      reference.overlayScale = previousScale;
      reference.overlayConfigured = true;
    }
    reference.scale = reference.overlayScale;
  } else {
    if (!reference.planeConfigured) {
      const placement = referencePlanePlacement(reference.view, reference.planeInFront);
      reference.position = {
        x: placement.position[0],
        y: placement.position[1],
        z: placement.position[2]
      };
      reference.rotation = {
        x: placement.rotation[0],
        y: placement.rotation[1],
        z: placement.rotation[2]
      };
      reference.planeScale = previousScale;
      reference.planeConfigured = true;
    }
    reference.scale = reference.planeScale;
  }
  reference.type = nextType;
  createReferenceImageRuntime(reference);
  selectReferenceImage(reference.id);
  if (nextType === "plane") deps.setOrthographicView(true);
}

function attachReferenceImageTransform() {
  const reference = selectedReferenceImage();
  if (
    reference?.type !== "plane"
    || !reference.mesh?.visible
    || !["move", "scale"].includes(deps.sel.activeTool)
  ) return;
  deps.configureTransformControls(deps.sel.activeTool);
  deps.transformControls.showX = true;
  deps.transformControls.showY = true;
  deps.transformControls.showZ = deps.sel.activeTool === "move";
  deps.transformControls.attach(reference.mesh);
}

function selectReferenceImage(id) {
  deps.setViewportEditMode("reference", { clearSelection: false, activateSelect: false });
  deps.sel.selectedReferenceImageId = deps.referenceImages.some((reference) => reference.id === id) ? id : null;
  deps.clearStrandSelectionState();
  deps.sel.selectedCurveSurfaceController = null;
  deps.sel.selectedGuideId = undefined;
  deps.sel.selectedStrandGroup = null;
  deps.guideApi.clearMultiPointSelection();
  deps.transformControls.detach();
  updateReferenceSelectionVisuals();
  deps.locks.forEach((lock) => {
    deps.setStrandSelectionVisual(lock);
    deps.updateCurveObjects(lock, { visible: false });
  });
  attachReferenceImageTransform();
  deps.setOutlinerTab("references");
  deps.renderLockList();
  deps.guideApi.updateGuideControlsVisibility();
  deps.updateAttributeEditorMode();
  renderReferenceImagePanel();
  deps.refreshRebuildCurveDialog();
}

function placeReferencePlane(reference, view) {
  if (reference?.type !== "plane") return;
  const placement = referencePlanePlacement(view, reference.planeInFront);
  reference.view = view;
  reference.position = { x: placement.position[0], y: placement.position[1], z: placement.position[2] };
  reference.rotation = { x: placement.rotation[0], y: placement.rotation[1], z: placement.rotation[2] };
  reference.planeConfigured = true;
  applyReferenceImageRuntime(reference);
  attachReferenceImageTransform();
}

function setReferencePlaneInFront(reference, inFront) {
  if (reference?.type !== "plane") return;
  const { axis, sign } = referencePlaneFrontAxis(reference.view);
  const distance = Math.abs(Number(reference.position[axis])) || 2.4;
  reference.planeInFront = Boolean(inFront);
  reference.position[axis] = distance * sign * (reference.planeInFront ? 1 : -1);
  applyReferenceImageRuntime(reference);
  attachReferenceImageTransform();
}

function syncReferenceImageFromMesh(reference) {
  if (!reference?.mesh) return;
  reference.position = {
    x: reference.mesh.position.x,
    y: reference.mesh.position.y,
    z: reference.mesh.position.z
  };
  reference.rotation = {
    x: reference.mesh.rotation.x,
    y: reference.mesh.rotation.y,
    z: reference.mesh.rotation.z
  };
  reference.scale = reference.mesh.scale.x;
  reference.planeScale = reference.scale;
  const { axis, sign } = referencePlaneFrontAxis(reference.view);
  const depthCoordinate = reference.position[axis] * sign;
  if (Math.abs(depthCoordinate) > 0.0001) reference.planeInFront = depthCoordinate > 0;
}

function renderReferenceImagePanel() {
  renderReferenceOutliner();
  deps.referenceImageList.replaceChildren();
  deps.referenceImages.forEach((reference) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("active", reference.id === deps.sel.selectedReferenceImageId);
    const name = document.createElement("span");
    name.textContent = reference.name;
    const kind = document.createElement("small");
    kind.textContent = reference.type === "plane" ? `3D · ${referenceViewDisplayLabel(reference.view)}` : "Viewport";
    button.append(name, kind);
    button.addEventListener("click", () => selectReferenceImage(reference.id));
    deps.referenceImageList.appendChild(button);
  });
  const reference = selectedReferenceImage();
  deps.referenceImageEmpty.classList.toggle("hidden", deps.referenceImages.length > 0);
  deps.referenceImageControls.classList.toggle("hidden", !reference);
  if (!reference) return;
  deps.referenceImageType.value = reference.type;
  deps.referenceImageVisible.checked = reference.visible;
  deps.referenceImageOpacity.value = reference.opacity;
  deps.referenceImageOpacityValue.textContent = reference.opacity.toFixed(2);
  deps.referenceImageFlipX.classList.toggle("active", Boolean(reference.flipX));
  deps.referenceImageFlipX.setAttribute("aria-pressed", String(Boolean(reference.flipX)));
  const plane = reference.type === "plane";
  deps.resetReferenceImageCrop.classList.toggle("hidden", plane);
  deps.resetReferenceImageCrop.disabled = plane || referenceCropIsFull(reference);
  deps.referenceImageViewRow.classList.toggle("hidden", !plane);
  deps.referencePlaneInFrontRow.classList.toggle("hidden", !plane);
  deps.referenceImageSnappedViewOnlyRow.classList.toggle("hidden", !plane);
  deps.referencePlaneHint.classList.toggle("hidden", !plane);
  deps.referenceImageView.value = reference.view;
  deps.referencePlaneInFront.checked = reference.planeInFront !== false;
  const viewLabel = referenceViewDisplayLabel(reference.view);
  deps.referenceImageSnappedViewOnlyLabel.textContent = `Only in ${viewLabel} Orthogonal view`;
  deps.referenceImageSnappedViewOnly.checked = Boolean(reference.snappedViewOnly);
}

function referenceOutlinerGroup(reference) {
  return reference.type === "overlay" ? "overlay" : reference.view;
}

function renderReferenceOutliner() {
  deps.referenceOutliner.replaceChildren();
  REFERENCE_OUTLINER_GROUPS.forEach((group) => {
    const groupLabel = referenceViewDisplayLabel(group.id);
    const references = deps.referenceImages.filter((reference) => referenceOutlinerGroup(reference) === group.id);
    const isOpen = deps.referenceGroupOpen.get(group.id) !== false
      || references.some((reference) => reference.id === deps.sel.selectedReferenceImageId);
    const groupElement = document.createElement("div");
    groupElement.className = `reference-outliner-group${isOpen ? " open" : ""}`;
    groupElement.dataset.referenceGroup = group.id;

    const header = document.createElement("div");
    header.className = "reference-outliner-group-head";
    header.dataset.referenceDropTarget = group.id;
    const disclosure = document.createElement("button");
    disclosure.className = "outliner-disclosure";
    disclosure.type = "button";
    disclosure.title = `${isOpen ? "Collapse" : "Expand"} ${groupLabel}`;
    disclosure.setAttribute("aria-label", disclosure.title);
    disclosure.setAttribute("aria-expanded", String(isOpen));
    disclosure.textContent = ">";
    disclosure.addEventListener("click", () => {
      deps.referenceGroupOpen.set(group.id, !isOpen);
      renderReferenceOutliner();
    });
    const label = document.createElement("span");
    label.className = "reference-outliner-group-label";
    label.textContent = groupLabel;
    const count = document.createElement("span");
    count.className = "reference-outliner-group-count";
    count.textContent = String(references.length);
    const visibleCount = references.filter((reference) => reference.visible).length;
    const groupVisibility = deps.createOutlinerVisibilityToggle({
      visible: references.length > 0 && visibleCount === references.length,
      partial: visibleCount > 0 && visibleCount < references.length,
      label: groupLabel,
      onToggle: () => {
        if (!references.length) return;
        deps.pushUndoState();
        const nextVisible = visibleCount !== references.length;
        references.forEach((reference) => {
          reference.visible = nextVisible;
          applyReferenceImageRuntime(reference);
        });
        renderReferenceImagePanel();
      }
    });
    header.append(disclosure, groupVisibility, label, count);

    const items = document.createElement("div");
    items.className = "reference-outliner-group-items";
    if (!references.length) {
      const empty = document.createElement("span");
      empty.className = "outliner-empty";
      empty.textContent = "No references";
      items.appendChild(empty);
    }
    references.forEach((reference) => {
      const item = document.createElement("div");
      item.className = `reference-outliner-item${reference.id === deps.sel.selectedReferenceImageId ? " active" : ""}`;
      const visibility = deps.createOutlinerVisibilityToggle({
        visible: reference.visible,
        label: reference.name,
        onToggle: () => {
          deps.pushUndoState();
          reference.visible = !reference.visible;
          applyReferenceImageRuntime(reference);
          renderReferenceImagePanel();
        }
      });
      const select = document.createElement("button");
      select.className = "reference-outliner-select";
      select.type = "button";
      select.title = reference.name;
      select.setAttribute("aria-label", reference.name);
      const thumbnail = document.createElement("img");
      thumbnail.className = "reference-outliner-thumbnail";
      thumbnail.src = reference.source;
      thumbnail.alt = "";
      thumbnail.draggable = false;
      thumbnail.style.transform = reference.flipX ? "scaleX(-1)" : "none";
      const status = document.createElement("span");
      status.className = "reference-outliner-status";
      status.textContent = reference.type === "overlay"
        ? "Viewport"
        : reference.snappedViewOnly ? "Ortho Only" : "All Views";
      const details = document.createElement("span");
      details.className = "reference-outliner-details";
      const name = document.createElement("span");
      name.className = "reference-outliner-name";
      name.textContent = reference.name;
      details.append(name, status);
      select.append(thumbnail, details);
      select.addEventListener("click", (event) => deps.handleOutlinerRenameClick(event, {
        label: name,
        value: reference.name,
        onSelect: () => {
          selectReferenceImage(reference.id);
          setReferenceImagePanelOpen(true);
        },
        onCommit: (nextName) => {
          reference.name = nextName;
        },
        rerender: renderReferenceImagePanel
      }));
      item.addEventListener("contextmenu", (event) => deps.showOutlinerContextMenu(event, {
        type: "reference",
        referenceId: reference.id
      }));
      item.append(visibility, select);
      items.appendChild(item);
    });
    groupElement.append(header, items);
    deps.referenceOutliner.appendChild(groupElement);
  });
}

function setReferenceImagePanelOpen(open) {
  deps.referenceImagePanel.classList.toggle("hidden", !open);
  if (open) renderReferenceImagePanel();
}

function readReferenceImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Could not read reference image"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Unsupported reference image"));
      image.onload = () => resolve({
        source: String(reader.result),
        aspect: image.naturalWidth / Math.max(1, image.naturalHeight)
      });
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function isSupportedReferenceImageFile(file) {
  return Boolean(file) && (
    deps.SUPPORTED_REFERENCE_IMAGE_TYPES.has(String(file.type).toLowerCase())
    || /\.(?:png|jpe?g|webp|gif)$/i.test(String(file.name))
  );
}

async function addReferenceImagesFromFiles(
  files,
  type = "overlay",
  { view = "front", overlayPosition = null } = {}
) {
  const candidates = [...files].filter(isSupportedReferenceImageFile);
  if (!candidates.length) return [];
  const decoded = await Promise.allSettled(candidates.map(async (file) => ({
    file,
    image: await readReferenceImageFile(file)
  })));
  const successful = decoded
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  decoded
    .filter((result) => result.status === "rejected")
    .forEach((result) => console.error("Could not add dropped reference image", result.reason));
  if (!successful.length) throw decoded.find((result) => result.status === "rejected")?.reason
    || new Error("No supported reference images were found");

  deps.pushUndoState();
  const added = successful.map(({ file, image }) => {
    const overlayPlacement = type === "overlay" && overlayPosition
      ? {
          overlayAnchor: "center",
          overlayConfigured: true,
          x: overlayPosition.x,
          y: overlayPosition.y
        }
      : {};
    return addReferenceImage({
      ...image,
      type,
      view: type === "plane" ? view : undefined,
      ...overlayPlacement,
      name: file.name.replace(/\.[^.]+$/, "") || "Reference"
    }, { select: false });
  }).filter(Boolean);
  const lastAdded = added.at(-1);
  if (lastAdded) selectReferenceImage(lastAdded.id);
  if (type === "plane" && added.length) deps.setOrthographicView(true);
  setReferenceImagePanelOpen(true);
  return added;
}

function dragContainsReferenceImage(event) {
  const items = [...(event.dataTransfer?.items || [])].filter((item) => item.kind === "file");
  if (!items.length) return false;
  return items.some((item) => {
    const file = item.getAsFile?.();
    if (applicationDropFileKind(file)) return false;
    return deps.SUPPORTED_REFERENCE_IMAGE_TYPES.has(String(item.type || "").toLowerCase())
      || isSupportedReferenceImageFile(file);
  });
}

function setReferenceImageDragActive(active) {
  const nextActive = Boolean(active);
  deps.viewportPanel.classList.toggle("reference-image-drag-active", nextActive);
  document.body.classList.toggle("reference-image-drag-active", nextActive);
  deps.referenceImageDropTarget.setAttribute("aria-hidden", String(!nextActive));
  if (!nextActive) setReferenceDropHover();
}

function referenceDropDestination(event) {
  const destination = event.target.closest?.("[data-reference-drop-target]")?.dataset.referenceDropTarget;
  if (["overlay", "front", "back", "left", "right"].includes(destination)) return destination;
  return deps.viewportPanel.contains(event.target) ? "overlay" : null;
}

function viewportOverlayDropPosition(event) {
  if (!deps.viewportPanel.contains(event.target)) return null;
  const bounds = deps.viewport.getBoundingClientRect();
  return {
    x: THREE.MathUtils.clamp((event.clientX - bounds.left) / Math.max(1, bounds.width) * 100, 0, 100),
    y: THREE.MathUtils.clamp((event.clientY - bounds.top) / Math.max(1, bounds.height) * 100, 0, 100)
  };
}

function setReferenceDropHover(event = null) {
  document.querySelectorAll("[data-reference-drop-target].reference-drop-hover").forEach((element) => {
    element.classList.remove("reference-drop-hover");
  });
  deps.referenceOverlayDropMarker.classList.remove("visible");
  if (!event) return;
  const directTarget = event.target.closest?.("[data-reference-drop-target]");
  if (directTarget) {
    directTarget.classList.add("reference-drop-hover");
    return;
  }
  if (!deps.viewportPanel.contains(event.target)) return;
  const bounds = deps.referenceImageDropTarget.getBoundingClientRect();
  deps.referenceOverlayDropMarker.style.left = `${event.clientX - bounds.left}px`;
  deps.referenceOverlayDropMarker.style.top = `${event.clientY - bounds.top}px`;
  deps.referenceOverlayDropMarker.classList.add("visible");
}

function referencePlaneHitFromPointer({ ignoreOcclusion = false } = {}) {
  const planeHit = deps.raycaster.intersectObjects(
    deps.referenceImages
      .filter((reference) => reference.type === "plane" && reference.mesh?.visible)
      .map((reference) => reference.mesh),
    false
  )[0] || null;
  if (!planeHit || ignoreOcclusion) return planeHit;
  const occluders = [
    ...deps.locks.filter(deps.strandVisibleForDisplay).map((lock) => lock.mesh),
    ...deps.guides.flatMap((guide) => [guide.mesh, guide.rootMesh]),
    ...headMeshes(),
    deps.scalpSurfaceGroup.visible ? deps.scalpBuilder.activeScalpSurfaceMesh() : null
  ].filter((object) => object?.visible !== false);
  const occluderHit = deps.raycaster.intersectObjects(occluders, false)[0] || null;
  return occluderHit && occluderHit.distance < planeHit.distance ? null : planeHit;
}

function referenceOverlayAtPointer(event) {
  const selectedReference = selectedReferenceImage();
  if (
    selectedReference?.type === "overlay"
    && selectedReference.visible !== false
    && selectedReference.element
    && referenceOverlayCornerAtPointer(event, selectedReference.element.getBoundingClientRect())
  ) return selectedReference;
  return [...deps.referenceImages].reverse().find((reference) => {
    if (reference.type !== "overlay" || reference.visible === false || !reference.element) return false;
    const bounds = reference.element.getBoundingClientRect();
    return event.clientX >= bounds.left
      && event.clientX <= bounds.right
      && event.clientY >= bounds.top
      && event.clientY <= bounds.bottom;
  }) || null;
}

function referenceOverlayCornerAtPointer(event, bounds) {
  const corners = {
    nw: { x: bounds.left, y: bounds.top },
    ne: { x: bounds.right, y: bounds.top },
    sw: { x: bounds.left, y: bounds.bottom },
    se: { x: bounds.right, y: bounds.bottom }
  };
  return Object.entries(corners).find(([, point]) => (
    Math.abs(event.clientX - point.x) <= REFERENCE_OVERLAY_HANDLE_HIT_RADIUS
      && Math.abs(event.clientY - point.y) <= REFERENCE_OVERLAY_HANDLE_HIT_RADIUS
  ))?.[0] || null;
}

function beginReferenceOverlayDrag(event, reference) {
  if (
    deps.sculptState.referenceOverlayDrag
    || deps.sculptState.viewportEditMode !== "reference"
    || !["select", "move", "scale"].includes(deps.sel.activeTool)
    || reference?.type !== "overlay"
    || !reference.element
    || event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return false;
  const bounds = reference.element.getBoundingClientRect();
  const corner = referenceOverlayCornerAtPointer(event, bounds);
  const mode = corner ? "scale" : "move";
  const opposite = {
    nw: { x: bounds.right, y: bounds.bottom },
    ne: { x: bounds.left, y: bounds.bottom },
    sw: { x: bounds.right, y: bounds.top },
    se: { x: bounds.left, y: bounds.top }
  }[corner] || null;
  deps.sculptState.referenceOverlayDrag = {
    pointerId: event.pointerId,
    referenceId: reference.id,
    mode,
    corner,
    opposite,
    startPointerX: event.clientX,
    startPointerY: event.clientY,
    startX: reference.x,
    startY: reference.y,
    startScale: reference.scale,
    startConfigured: reference.overlayConfigured,
    startBounds: bounds,
    committed: false
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = mode === "scale"
    ? (["nw", "se"].includes(corner) ? "nwse-resize" : "nesw-resize")
    : "move";
  deps.updateInteractionLocks();
  event.preventDefault();
  return true;
}

function updateReferenceOverlayDrag(event) {
  const drag = deps.sculptState.referenceOverlayDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const reference = deps.referenceImages.find((item) => item.id === drag.referenceId);
  if (!reference?.element) return;
  const dx = event.clientX - drag.startPointerX;
  const dy = event.clientY - drag.startPointerY;
  if (!drag.committed && Math.hypot(dx, dy) >= 1) {
    deps.pushUndoState();
    drag.committed = true;
  }
  if (!drag.committed) return;
  const viewportBounds = deps.viewport.getBoundingClientRect();
  if (drag.mode === "move") {
    reference.x = THREE.MathUtils.clamp(drag.startX + dx / viewportBounds.width * 100, 0, 100);
    reference.y = THREE.MathUtils.clamp(drag.startY + dy / viewportBounds.height * 100, 0, 100);
  } else {
    const startDistance = Math.max(1, Math.hypot(
      drag.startPointerX - drag.opposite.x,
      drag.startPointerY - drag.opposite.y
    ));
    const distance = Math.max(1, Math.hypot(
      event.clientX - drag.opposite.x,
      event.clientY - drag.opposite.y
    ));
    const nextScale = THREE.MathUtils.clamp(drag.startScale * distance / startDistance, 0.05, 20);
    const ratio = nextScale / drag.startScale;
    const width = drag.startBounds.width * ratio;
    const height = drag.startBounds.height * ratio;
    const left = ["nw", "sw"].includes(drag.corner)
      ? drag.opposite.x - width
      : drag.startBounds.left;
    const top = ["nw", "ne"].includes(drag.corner)
      ? drag.opposite.y - height
      : drag.startBounds.top;
    reference.scale = nextScale;
    reference.overlayScale = nextScale;
    if (reference.overlayAnchor === "top-left") {
      reference.x = THREE.MathUtils.clamp((left - viewportBounds.left) / viewportBounds.width * 100, 0, 100);
      reference.y = THREE.MathUtils.clamp((top - viewportBounds.top) / viewportBounds.height * 100, 0, 100);
    } else {
      reference.x = THREE.MathUtils.clamp((left + width * 0.5 - viewportBounds.left) / viewportBounds.width * 100, 0, 100);
      reference.y = THREE.MathUtils.clamp((top + height * 0.5 - viewportBounds.top) / viewportBounds.height * 100, 0, 100);
    }
  }
  reference.overlayConfigured = true;
  applyReferenceImageRuntime(reference);
  event.preventDefault();
}

function finishReferenceOverlayDrag(event, { cancel = false } = {}) {
  const drag = deps.sculptState.referenceOverlayDrag;
  if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointerId)) return false;
  deps.sculptState.referenceOverlayDrag = null;
  const reference = deps.referenceImages.find((item) => item.id === drag.referenceId);
  if (cancel && reference && drag.committed) {
    reference.x = drag.startX;
    reference.y = drag.startY;
    reference.scale = drag.startScale;
    reference.overlayScale = drag.startScale;
    reference.overlayConfigured = drag.startConfigured;
    applyReferenceImageRuntime(reference);
  }
  deps.renderer.domElement.releasePointerCapture?.(drag.pointerId);
  deps.renderer.domElement.style.cursor = "";
  setReferenceOverlayScaleHandleHover(null);
  deps.updateInteractionLocks();
  renderReferenceImagePanel();
  event?.preventDefault();
  return true;
}

function setReferenceOverlayScaleHandleHover(reference, corner = null) {
  deps.referenceImages.forEach((item) => {
    item.element?.querySelectorAll(".reference-overlay-scale-handle").forEach((handle) => {
      handle.classList.toggle(
        "picker-hover",
        item === reference && handle.dataset.overlayCorner === corner
      );
    });
  });
}

function updateReferenceOverlayCursor(event) {
  if (
    deps.sculptState.referenceOverlayDrag
    || deps.sculptState.viewportEditMode !== "reference"
    || !["select", "move", "scale"].includes(deps.sel.activeTool)
  ) return;
  setReferenceOverlayScaleHandleHover(null);
  const reference = selectedReferenceImage();
  if (reference?.type !== "overlay" || !reference.element || reference.visible === false) {
    deps.renderer.domElement.style.cursor = "";
    return;
  }
  const bounds = reference.element.getBoundingClientRect();
  const corner = referenceOverlayCornerAtPointer(event, bounds);
  if (corner) {
    setReferenceOverlayScaleHandleHover(reference, corner);
    deps.renderer.domElement.style.cursor = ["nw", "se"].includes(corner) ? "nwse-resize" : "nesw-resize";
  } else {
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
      && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    deps.renderer.domElement.style.cursor = inside ? "move" : "";
  }
}

function referenceCropAnchorCoordinates(crop) {
  return {
    nw: { x: crop.left, y: crop.top },
    ne: { x: crop.right, y: crop.top },
    se: { x: crop.right, y: crop.bottom },
    sw: { x: crop.left, y: crop.bottom }
  };
}

function referenceCropAnchorScreenPositions(reference) {
  if (!reference) return null;
  const crop = normalizeReferenceCrop(reference.crop);
  const anchors = referenceCropAnchorCoordinates(crop);
  if (reference.type !== "overlay" || !reference.element) return null;
  const bounds = reference.element.getBoundingClientRect();
  return Object.fromEntries(REFERENCE_CROP_ANCHORS.map((anchor) => [
    anchor,
    {
      x: bounds.left + anchors[anchor].x * bounds.width,
      y: bounds.top + anchors[anchor].y * bounds.height
    }
  ]));
}

function referenceCropCursor(anchor) {
  if (["nw", "se"].includes(anchor)) return "nwse-resize";
  if (["ne", "sw"].includes(anchor)) return "nesw-resize";
  return "nesw-resize";
}

function updateReferenceCropHandles() {
  const reference = selectedReferenceImage();
  const show = deps.sculptState.viewportEditMode === "reference"
    && reference?.type === "overlay"
    && reference?.visible !== false;
  deps.referenceCropHandles.classList.toggle("hidden", !show);
  if (!show) return;
  const positions = referenceCropAnchorScreenPositions(reference);
  if (!positions) {
    deps.referenceCropHandles.classList.add("hidden");
    return;
  }
  const viewportBounds = deps.viewportPanel.getBoundingClientRect();
  deps.referenceCropHandleElements.forEach((handle) => {
    const anchor = handle.dataset.cropAnchor;
    handle.style.left = `${positions[anchor].x - viewportBounds.left}px`;
    handle.style.top = `${positions[anchor].y - viewportBounds.top}px`;
    handle.style.cursor = referenceCropCursor(anchor);
  });
}

function referenceCropSourcePoint(event, drag) {
  return {
    x: THREE.MathUtils.clamp((event.clientX - drag.bounds.left) / Math.max(1, drag.bounds.width), 0, 1),
    y: THREE.MathUtils.clamp((event.clientY - drag.bounds.top) / Math.max(1, drag.bounds.height), 0, 1)
  };
}

function beginReferenceCrop(event) {
  if (
    deps.sculptState.referenceCropDrag
    || deps.sculptState.viewportEditMode !== "reference"
    || event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return false;
  const reference = selectedReferenceImage();
  if (reference?.type !== "overlay" || reference.visible === false) return false;
  const type = reference.type;
  const bounds = reference.element?.getBoundingClientRect();
  const directAnchor = event.target.closest?.("[data-crop-anchor]")?.dataset.cropAnchor;
  const anchor = REFERENCE_CROP_ANCHORS.includes(directAnchor) ? directAnchor : null;
  if (!anchor || !bounds) return false;
  const drag = {
    pointerId: event.pointerId,
    referenceId: reference.id,
    type,
    mesh: reference.mesh,
    bounds,
    anchor,
    startCrop: normalizeReferenceCrop(reference.crop),
    startClientX: event.clientX,
    startClientY: event.clientY,
    committed: false
  };
  deps.sculptState.referenceCropDrag = drag;
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = referenceCropCursor(anchor);
  deps.updateInteractionLocks();
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function updateReferenceCrop(event) {
  const drag = deps.sculptState.referenceCropDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const reference = deps.referenceImages.find((item) => item.id === drag.referenceId);
  const current = referenceCropSourcePoint(event, drag);
  if (!reference || !current) return;
  const distance = Math.hypot(event.clientX - drag.startClientX, event.clientY - drag.startClientY);
  if (!drag.committed && distance >= 3) {
    deps.pushUndoState();
    drag.committed = true;
  }
  if (!drag.committed) return;
  const crop = { ...drag.startCrop };
  if (drag.anchor.includes("w")) {
    crop.left = THREE.MathUtils.clamp(current.x, 0, crop.right - MIN_REFERENCE_CROP_SPAN);
  }
  if (drag.anchor.includes("e")) {
    crop.right = THREE.MathUtils.clamp(current.x, crop.left + MIN_REFERENCE_CROP_SPAN, 1);
  }
  if (drag.anchor.includes("n")) {
    crop.top = THREE.MathUtils.clamp(current.y, 0, crop.bottom - MIN_REFERENCE_CROP_SPAN);
  }
  if (drag.anchor.includes("s")) {
    crop.bottom = THREE.MathUtils.clamp(current.y, crop.top + MIN_REFERENCE_CROP_SPAN, 1);
  }
  reference.crop = normalizeReferenceCrop(crop);
  applyReferenceImageRuntime(reference);
  updateReferenceCropHandles();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishReferenceCrop(event, { cancel = false } = {}) {
  const drag = deps.sculptState.referenceCropDrag;
  if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointerId)) return false;
  deps.sculptState.referenceCropDrag = null;
  const reference = deps.referenceImages.find((item) => item.id === drag.referenceId);
  if (cancel && reference && drag.committed) {
    reference.crop = { ...drag.startCrop };
    applyReferenceImageRuntime(reference);
  }
  deps.renderer.domElement.releasePointerCapture?.(drag.pointerId);
  deps.renderer.domElement.style.cursor = "";
  deps.updateInteractionLocks();
  updateReferenceCropHandles();
  renderReferenceImagePanel();
  event?.preventDefault();
  return true;
}

function deleteSelectedReferenceImage() {
  const reference = selectedReferenceImage();
  if (!reference) return false;
  deps.pushUndoState();
  deps.transformControls.detach();
  disposeReferenceImage(reference);
  deps.referenceImages.splice(deps.referenceImages.indexOf(reference), 1);
  deps.sel.selectedReferenceImageId = deps.referenceImages.at(-1)?.id || null;
  if (deps.sel.selectedReferenceImageId) selectReferenceImage(deps.sel.selectedReferenceImageId);
  else renderReferenceImagePanel();
  return true;
}

function referenceViewDisplayLabel(view) {
  return ({
    overlay: "Viewport Overlays",
    front: "Front",
    back: "Back",
    left: "Left",
    right: "Right"
  })[deps.sideNamingDisplayId(view)] || "Front";
}

function requestReferenceImage(type) {
  deps.setViewportEditMode("reference");
  deps.ref.pendingReferenceImageType = type;
  deps.referenceImageFile.value = "";
  deps.referenceImageFile.click();
}
  return {
    disposeGuideModel,
    syncHeadTransformInputs,
    applyHeadTransform,
    resetHeadTransform,
    installGuideModel,
    loadDefaultGuideModel,
    frameGuideModel,
    setHeadReferenceTransparency,
    trianglePlaneIntersections,
    headPlaneIntersectionSegments,
    setHeadSetupEditing,
    importHeadMeshFile,
    importFullBodyMeshFile,
    headMeshes,
    selectedReferenceImage,
    normalizeReferenceCrop,
    referenceCropIsFull,
    referencePlaneFrontAxis,
    referencePlanePlacement,
    migratedReferencePlanePosition,
    isUntouchedLegacySideReferencePlacement,
    migratedReferencePlaneRotation,
    isInwardFacingSideReferencePlacement,
    snappedReferenceImageView,
    updateReferencePlaneVisibility,
    applyReferenceImageRuntime,
    updateReferenceSelectionVisuals,
    createReferenceImageRuntime,
    addReferenceImage,
    disposeReferenceImageRuntime,
    disposeReferenceImage,
    clearReferenceImages,
    serializeReferenceImage,
    setReferenceImageType,
    attachReferenceImageTransform,
    selectReferenceImage,
    placeReferencePlane,
    setReferencePlaneInFront,
    syncReferenceImageFromMesh,
    renderReferenceImagePanel,
    referenceOutlinerGroup,
    renderReferenceOutliner,
    setReferenceImagePanelOpen,
    readReferenceImageFile,
    isSupportedReferenceImageFile,
    addReferenceImagesFromFiles,
    dragContainsReferenceImage,
    setReferenceImageDragActive,
    referenceDropDestination,
    viewportOverlayDropPosition,
    setReferenceDropHover,
    referencePlaneHitFromPointer,
    referenceOverlayAtPointer,
    referenceOverlayCornerAtPointer,
    beginReferenceOverlayDrag,
    updateReferenceOverlayDrag,
    finishReferenceOverlayDrag,
    setReferenceOverlayScaleHandleHover,
    updateReferenceOverlayCursor,
    referenceCropAnchorCoordinates,
    referenceCropAnchorScreenPositions,
    referenceCropCursor,
    updateReferenceCropHandles,
    referenceCropSourcePoint,
    beginReferenceCrop,
    updateReferenceCrop,
    finishReferenceCrop,
    deleteSelectedReferenceImage,
    referenceViewDisplayLabel,
    requestReferenceImage,
  };
}
