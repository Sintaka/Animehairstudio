// scalp-builder.js — scalp guide / builder / paint subsystem.
// Extracted from app.js (refactor 3d batch 4); coupling injected via createScalpBuilderApi(deps).
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { normalizeTaperCurve } from "../geometry/curve-math.js?v=20260910-5";
import { DEFAULT_LAYER_OFFSETS, DEFAULT_SWEEP_PROFILE, ROOT_SCALP_OFFSET_DISTANCE, SCALP_REGIONS } from "../core/app-config.js?v=20260815-4";


export function createScalpBuilderApi(deps) {
  // deps: store state proxies (scalpState/sculptState/sel/guideState) + app.js functions/consts;
  // full injected-dep list: devlog/in-progress/scalp-refactor-map.md section 3

async function createAuthoredScalpGeometry() {
  const materialRegions = {
    lambert2SG: "bangs",
    lambert3SG: "side-bangs-right",
    lambert4SG: "side-right",
    lambert5SG: "back",
    lambert6SG: "side-bangs-left",
    lambert7SG: "side-left"
  };
  const response = await fetch("./assets/scalpcurvelatticeguide.obj?v=20260720-1");
  if (!response.ok) throw new Error(`Could not load the built-in scalp guide (${response.status})`);
  const sourceVertices = [];
  const sourceFaces = [];
  let material = "";
  (await response.text()).split(/\r?\n/).forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === "v" && parts.length >= 4) {
      sourceVertices.push(new THREE.Vector3(Number(parts[1]), Number(parts[2]), Number(parts[3])));
    } else if (parts[0] === "usemtl") {
      material = parts.slice(1).join(" ");
    } else if (parts[0] === "f" && parts.length === 5) {
      sourceFaces.push({
        vertices: parts.slice(1).map((token) => Number(token.split("/")[0]) - 1),
        region: materialRegions[material] || "unassigned"
      });
    }
  });
  if (!sourceVertices.length || !sourceFaces.length) throw new Error("The built-in scalp guide contains no usable quad mesh");
  const bounds = new THREE.Box3().setFromPoints(sourceVertices);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 2 / Math.max(0.0001, size.x, size.y, size.z);
  const normalizedVertices = sourceVertices.map((vertex) => vertex.clone().sub(center).multiplyScalar(scale));
  const edgeMap = new Map();
  const indices = [];
  const quads = sourceFaces.map((face, id) => {
    const [a, b, c, d] = face.vertices;
    indices.push(a, b, c, a, c, d);
    [[a, b], [b, c], [c, d], [d, a]].forEach(([start, end]) => {
      const key = start < end ? `${start}:${end}` : `${end}:${start}`;
      if (!edgeMap.has(key)) edgeMap.set(key, [start, end]);
    });
    return { id, face: "authored", row: 0, column: 0, region: face.region, vertices: [a, b, c, d] };
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(normalizedVertices.flatMap((vertex) => vertex.toArray()), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return { geometry, quadEdges: [...edgeMap.values()], quads };
}

function buildDefaultScalpRegionAssignments(sideBangRows = 5) {
  const rows = THREE.MathUtils.clamp(Math.round(sideBangRows), 0, deps.SCALP_SEGMENTS);
  return deps.scalpQuads.map((quad) => {
    let region = quad.region || "unassigned";
    if (quad.face === "front") region = "bangs";
    else if (quad.face === "back") region = "back";
    else if (quad.face === "left") region = "side-left";
    else if (quad.face === "right") region = "side-right";
    else if (quad.face === "top") region = quad.column < deps.SCALP_SEGMENTS / 2 ? "side-left" : "side-right";

    const isRightSideBang = quad.face === "right" && quad.column < rows;
    const isLeftSideBang = quad.face === "left" && quad.column >= deps.SCALP_SEGMENTS - rows;
    const isTopSideBang = quad.face === "top" && quad.row < rows;
    if (isRightSideBang || isLeftSideBang || isTopSideBang) {
      region = isLeftSideBang || (isTopSideBang && quad.column < deps.SCALP_SEGMENTS / 2)
        ? "side-bangs-left"
        : "side-bangs-right";
    }
    return region;
  });
}

function updateScalpRenderGeometry() {
  const sourcePosition = deps.scalpSurfaceGeometry.getAttribute("position");
  const sourceNormal = deps.scalpSurfaceGeometry.getAttribute("normal");
  const positions = new Float32Array(deps.scalpState.scalpVisibleQuads.length * 12);
  const normals = new Float32Array(deps.scalpState.scalpVisibleQuads.length * 12);
  const colors = new Float32Array(deps.scalpState.scalpVisibleQuads.length * 12);
  const indices = new Uint16Array(deps.scalpState.scalpVisibleQuads.length * 6);
  const triangleQuadIds = [];
  const color = new THREE.Color();

  deps.scalpState.scalpVisibleQuads.forEach((quad, quadIndex) => {
    color.set(SCALP_REGIONS[deps.scalpState.scalpRegionAssignments[quad.id]].color);
    quad.vertices.forEach((sourceIndex, corner) => {
      const renderIndex = quadIndex * 4 + corner;
      const offset = renderIndex * 3;
      positions[offset] = sourcePosition.getX(sourceIndex);
      positions[offset + 1] = sourcePosition.getY(sourceIndex);
      positions[offset + 2] = sourcePosition.getZ(sourceIndex);
      normals[offset] = sourceNormal.getX(sourceIndex);
      normals[offset + 1] = sourceNormal.getY(sourceIndex);
      normals[offset + 2] = sourceNormal.getZ(sourceIndex);
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
    });
    const vertex = quadIndex * 4;
    indices.set([vertex, vertex + 1, vertex + 2, vertex, vertex + 2, vertex + 3], quadIndex * 6);
    triangleQuadIds.push(quad.id, quad.id);
  });

  [["position", positions], ["normal", normals], ["color", colors]].forEach(([name, array]) => {
    const attribute = deps.scalpRenderGeometry.getAttribute(name);
    if (attribute?.array.length === array.length) {
      attribute.array.set(array);
      attribute.needsUpdate = true;
    } else {
      deps.scalpRenderGeometry.setAttribute(name, new THREE.BufferAttribute(array, 3));
    }
  });
  const indexAttribute = deps.scalpRenderGeometry.getIndex();
  if (indexAttribute?.array.length === indices.length) {
    indexAttribute.array.set(indices);
    indexAttribute.needsUpdate = true;
  } else {
    deps.scalpRenderGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
  }
  deps.scalpRenderGeometry.userData.triangleQuadIds = triangleQuadIds;
  deps.scalpRenderGeometry.computeBoundingBox();
  deps.scalpRenderGeometry.computeBoundingSphere();
}

function writeScalpRegionColors() {
  const colorAttribute = deps.scalpRenderGeometry.getAttribute("color");
  if (!colorAttribute) return;
  const color = new THREE.Color();
  deps.scalpState.scalpVisibleQuads.forEach((quad, quadIndex) => {
    color.set(SCALP_REGIONS[deps.scalpState.scalpRegionAssignments[quad.id]].color);
    for (let corner = 0; corner < 4; corner += 1) {
      colorAttribute.setXYZ(quadIndex * 4 + corner, color.r, color.g, color.b);
    }
  });
  colorAttribute.needsUpdate = true;
}

function applyDefaultScalpRegionAssignments(sideBangRows, { preserveManual = true } = {}) {
  const defaults = buildDefaultScalpRegionAssignments(sideBangRows);
  defaults.forEach((region, index) => {
    if (!preserveManual || !deps.scalpState.scalpManualRegionQuads.has(index)) deps.scalpState.scalpRegionAssignments[index] = region;
  });
  writeScalpRegionColors();
}

function createScalpSelectionOutline(geometry) {
  const outline = new THREE.Mesh(
    geometry,
    new THREE.ShaderMaterial({
      uniforms: {
        outlineColor: { value: new THREE.Color(0xffd45c) },
        outlineOpacity: { value: 0.96 }
      },
      vertexShader: `
        varying vec3 vViewNormal;
        varying vec3 vViewDirection;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vViewNormal = normalize(normalMatrix * normal);
          vViewDirection = normalize(-viewPosition.xyz);
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 outlineColor;
        uniform float outlineOpacity;
        varying vec3 vViewNormal;
        varying vec3 vViewDirection;
        void main() {
          float facing = abs(dot(normalize(vViewNormal), normalize(vViewDirection)));
          float silhouette = 1.0 - smoothstep(0.035, 0.16, facing);
          if (silhouette < 0.02) discard;
          gl_FragColor = vec4(outlineColor, silhouette * outlineOpacity);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false
    })
  );
  outline.renderOrder = 20;
  outline.visible = false;
  return outline;
}

function activeScalpSurfaceMesh() {
  if (deps.scalpState.scalpGuideSource === "custom" && deps.scalpState.customScalpSurfaceMesh) return deps.scalpState.customScalpSurfaceMesh;
  return deps.scalpState.editedScalpSurfaceMesh || deps.scalpSurfaceMesh;
}

function activeScalpSurfaceWire() {
  if (deps.scalpState.scalpGuideSource === "custom" && deps.scalpState.customScalpSurfaceWire) return deps.scalpState.customScalpSurfaceWire;
  return deps.scalpState.editedScalpSurfaceWire || deps.scalpSurfaceWire;
}

function activeScalpSelectionOutline() {
  if (deps.scalpState.scalpGuideSource === "custom" && deps.scalpState.customScalpSelectionOutline) return deps.scalpState.customScalpSelectionOutline;
  return deps.scalpState.editedScalpSelectionOutline || deps.scalpSelectionOutline;
}

function inferredCustomScalpRegion(center) {
  const side = center.x < 0 ? "side-left" : "side-right";
  if (center.z > Math.abs(center.x) * 0.72) return "bangs";
  if (center.z < -Math.abs(center.x) * 0.72) return "back";
  return side;
}

function writeCustomScalpRegionColors() {
  if (!deps.scalpState.customScalpSurfaceMesh) return;
  const geometry = deps.scalpState.customScalpSurfaceMesh.geometry;
  const position = geometry.getAttribute("position");
  let colorAttribute = geometry.getAttribute("color");
  if (!colorAttribute || colorAttribute.count !== position.count) {
    colorAttribute = new THREE.BufferAttribute(new Float32Array(position.count * 3), 3);
    geometry.setAttribute("color", colorAttribute);
  }
  const color = new THREE.Color();
  deps.scalpState.customScalpRegions.forEach((region, triangleIndex) => {
    color.set(SCALP_REGIONS[region]?.color || SCALP_REGIONS.unassigned.color);
    for (let corner = 0; corner < 3; corner += 1) {
      colorAttribute.setXYZ(triangleIndex * 3 + corner, color.r, color.g, color.b);
    }
  });
  colorAttribute.needsUpdate = true;
}

function customScalpGeometryFromObject(model, { normalize = true } = {}) {
  model.updateMatrixWorld(true);
  const geometries = [];
  model.traverse((child) => {
    if (!child.isMesh || !child.geometry?.getAttribute("position")) return;
    let geometry = child.geometry.clone();
    geometry.applyMatrix4(child.matrixWorld);
    geometry = geometry.index ? geometry.toNonIndexed() : geometry;
    Object.keys(geometry.attributes).forEach((name) => {
      if (name !== "position") geometry.deleteAttribute(name);
    });
    geometry.clearGroups();
    geometries.push(geometry);
  });
  if (!geometries.length) throw new Error("Custom scalp OBJ contains no polygon geometry");
  const geometry = mergeGeometries(geometries, false);
  geometries.forEach((item) => item.dispose());
  if (!geometry) throw new Error("Custom scalp OBJ geometry could not be combined");
  geometry.computeBoundingBox();
  if (normalize) {
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const scale = 2 / Math.max(0.0001, size.x, size.y, size.z);
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(scale, scale, scale);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function customScalpWireGeometry(geometry) {
  const quadWirePositions = geometry.userData.quadWirePositions;
  if (!Array.isArray(quadWirePositions) || !quadWirePositions.length) {
    return new THREE.WireframeGeometry(geometry);
  }
  const wireGeometry = new THREE.BufferGeometry();
  wireGeometry.setAttribute("position", new THREE.Float32BufferAttribute(quadWirePositions, 3));
  wireGeometry.computeBoundingSphere();
  return wireGeometry;
}

function installCustomScalpGeometry(geometry, regions, { name = "custom-scalp.obj", content = null } = {}) {
  deps.scalpState.customScalpSurfaceMesh?.geometry.dispose();
  deps.scalpState.customScalpSurfaceWire?.geometry.dispose();
  if (!deps.scalpState.customScalpSurfaceMesh) {
    deps.scalpState.customScalpSurfaceMesh = new THREE.Mesh(geometry, deps.scalpSurfaceMesh.material.clone());
    deps.scalpState.customScalpSurfaceMesh.renderOrder = deps.scalpSurfaceMesh.renderOrder;
    deps.scalpState.customScalpSurfaceWire = new THREE.LineSegments(
      customScalpWireGeometry(geometry),
      deps.scalpSurfaceWire.material.clone()
    );
    deps.scalpState.customScalpSurfaceWire.renderOrder = deps.scalpSurfaceWire.renderOrder;
    deps.scalpState.customScalpSelectionOutline = createScalpSelectionOutline(geometry);
    deps.scalpSurfaceGroup.add(deps.scalpState.customScalpSurfaceMesh, deps.scalpState.customScalpSurfaceWire, deps.scalpState.customScalpSelectionOutline);
  } else {
    deps.scalpState.customScalpSurfaceMesh.geometry = geometry;
    deps.scalpState.customScalpSurfaceWire.geometry = customScalpWireGeometry(geometry);
    deps.scalpState.customScalpSelectionOutline.geometry = geometry;
  }
  deps.scalpState.customScalpRegions = [...regions];
  writeCustomScalpRegionColors();
  deps.scalpState.importedScalpGuideAsset = content === null ? deps.importedScalpGuideAsset : { format: "obj", name, content };
  setScalpGuideSource("custom");
}

function installCustomScalpGuide(model, { name = "custom-scalp.obj", content = null, preserveCoordinates = false, quadWirePositions = null } = {}) {
  const geometry = customScalpGeometryFromObject(model, { normalize: !preserveCoordinates });
  if (Array.isArray(quadWirePositions)) geometry.userData.quadWirePositions = [...quadWirePositions];
  const position = geometry.getAttribute("position");
  const center = new THREE.Vector3();
  const regions = Array.from({ length: position.count / 3 }, (_, triangleIndex) => {
    center.set(0, 0, 0);
    for (let corner = 0; corner < 3; corner += 1) {
      center.x += position.getX(triangleIndex * 3 + corner);
      center.y += position.getY(triangleIndex * 3 + corner);
      center.z += position.getZ(triangleIndex * 3 + corner);
    }
    return inferredCustomScalpRegion(center.multiplyScalar(1 / 3));
  });
  installCustomScalpGeometry(geometry, regions, { name, content });
  if (preserveCoordinates && deps.scalpState.importedScalpGuideAsset) deps.scalpState.importedScalpGuideAsset.preserveCoordinates = true;
}

function setScalpGuideSource(source) {
  deps.scalpState.scalpGuideSource = source === "custom" && deps.scalpState.customScalpSurfaceMesh ? "custom" : "default";
  deps.scalpGuideSourceInput.value = deps.scalpState.scalpGuideSource;
  const customOption = deps.scalpGuideSourceInput.querySelector('option[value="custom"]');
  customOption.textContent = deps.scalpState.importedScalpGuideAsset
    ? `Custom: ${deps.scalpState.importedScalpGuideAsset.name}`
    : "Import Custom Mesh...";
  const customActive = deps.scalpState.scalpGuideSource === "custom";
  Object.entries(deps.scalpArtistInputs).forEach(([key, input]) => {
    input.disabled = customActive && key !== "rootScalpOffset";
  });
  deps.advancedLatticeButton.disabled = customActive;
  if (customActive && deps.scalpState.scalpLatticeEditing) setScalpLatticeEditing(false);
  updateScalpEditingVisibility();
}

function updateScalpQuadWire() {
  const surfacePosition = deps.scalpSurfaceGeometry.getAttribute("position");
  const wirePositions = new Float32Array(deps.scalpState.scalpQuadEdges.length * 6);
  deps.scalpState.scalpQuadEdges.forEach(([a, b], edgeIndex) => {
    const offset = edgeIndex * 6;
    wirePositions[offset] = surfacePosition.getX(a);
    wirePositions[offset + 1] = surfacePosition.getY(a);
    wirePositions[offset + 2] = surfacePosition.getZ(a);
    wirePositions[offset + 3] = surfacePosition.getX(b);
    wirePositions[offset + 4] = surfacePosition.getY(b);
    wirePositions[offset + 5] = surfacePosition.getZ(b);
  });
  deps.scalpSurfaceWire.geometry.setAttribute("position", new THREE.BufferAttribute(wirePositions, 3));
  deps.scalpSurfaceWire.geometry.computeBoundingSphere();
}

function updateScalpTopology() {
  const removedRows = Math.round(deps.scalpArtistShape.hairlineRows);
  const visibleQuads = deps.scalpQuads.filter((quad) => quad.face !== "front" || quad.row >= removedRows);
  const indices = [];
  const edges = new Map();
  const activeVertices = new Set();
  visibleQuads.forEach((quad) => {
    const [a, b, c, d] = quad.vertices;
    indices.push(a, b, c, a, c, d);
    activeVertices.add(a);
    activeVertices.add(b);
    activeVertices.add(c);
    activeVertices.add(d);
    [[a, b], [b, c], [c, d], [d, a]].forEach(([start, end]) => {
      const key = start < end ? `${start}:${end}` : `${end}:${start}`;
      if (!edges.has(key)) edges.set(key, [start, end]);
    });
  });
  deps.scalpSurfaceGeometry.setIndex(indices);
  deps.scalpState.scalpQuadEdges = [...edges.values()];
  deps.scalpState.scalpVisibleQuads = visibleQuads;
  deps.scalpState.scalpActiveVertexIndices = [...activeVertices];
  deps.scalpSurfaceGeometry.computeVertexNormals();
  deps.scalpSurfaceGeometry.computeBoundingBox();
  deps.scalpSurfaceGeometry.computeBoundingSphere();
  updateScalpRenderGeometry();
  updateScalpQuadWire();
}

function fullBodyScalpFocusBounds() {
  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(activeScalpSurfaceMesh());
  if (bounds.isEmpty()) return null;
  const size = bounds.getSize(new THREE.Vector3());
  bounds.min.y -= deps.FULL_BODY_FRAME_BOTTOM_MARGIN;
  bounds.max.y += size.y * 0.08;
  bounds.min.x -= size.x * 0.08;
  bounds.max.x += size.x * 0.08;
  bounds.min.z -= size.z * 0.08;
  bounds.max.z += size.z * 0.08;
  return bounds;
}

function syncScalpRoughScaleInputs() {
  deps.scalpRoughScaleInputs.forEach((input) => {
    input.value = String(deps.scalpRoughScale[input.dataset.scalpRoughScaleAxis]);
  });
  deps.scalpRoughScaleValues.forEach((output) => {
    output.textContent = Number(deps.scalpRoughScale[output.dataset.scalpRoughScaleValue]).toFixed(2);
  });
}

function applyScalpRoughScale() {
  const { x, y, z } = deps.scalpRoughScale;
  deps.scalpBuilderGroup.scale.set(x, y, z);
  deps.scalpBuilderGroup.position.set(
    deps.scalpRoughScalePivot.x * (1 - x),
    deps.scalpRoughScalePivot.y * (1 - y),
    deps.scalpRoughScalePivot.z * (1 - z)
  );
  deps.scalpBuilderGroup.updateMatrixWorld(true);
  if (deps.scalpState.scalpBuilderCurveLattice?.lastSubdivided) {
    syncEditedScalpSurface(deps.scalpState.scalpBuilderCurveLattice.lastSubdivided);
  }
}

function realignFullBodyGuideToScalpTop() {
  if (!deps.guideState.guideModel?.userData?.fullBodyReference) return;
  const sourceHeight = Number(deps.guideState.guideModel.userData.sourceHeight);
  const baseScale = Number(deps.guideState.guideModel.userData.baseScale);
  if (!Number.isFinite(sourceHeight) || !Number.isFinite(baseScale)) return;
  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  const scalpBounds = new THREE.Box3().setFromObject(activeScalpSurfaceMesh());
  const scalpCenter = scalpBounds.getCenter(new THREE.Vector3());
  deps.guideState.guideModel.userData.fittedCenter.set(
    scalpCenter.x,
    scalpBounds.max.y - (sourceHeight * baseScale * 0.5),
    scalpCenter.z
  );
  deps.applyHeadTransform();
}

function syncScalpInputs() {
  Object.entries(deps.scalpInputs).forEach(([key, input]) => {
    input.value = deps.scalpSurface[key];
  });
}

// Scalp Conform 拟合椭球（全局，第五版）的滑杆同步：与 syncScalpInputs 同一条路径，
// 额外同步 <output> 读数——scalpInputs 那组滑杆没有读数元素，本组有（照 panelShapeValues
// 的样子），所以多写一行 textContent。
function syncScalpConformFitInputs() {
  Object.entries(deps.scalpConformFitInputs).forEach(([key, input]) => {
    if (!input) return;
    const value = Number(deps.scalpConformFit[key]);
    input.value = value;
    const output = deps.scalpConformFitValueOutputs?.[key];
    if (output) output.textContent = value.toFixed(2);
  });
}

function syncScalpArtistInputs() {
  deps.scalpArtistInputs.mirrorX.checked = deps.scalpArtistShape.mirrorX;
  ["sideFlatten", "topHeight", "bottomHeight", "hairlineRows", "sideBangRows", "rootScalpOffset", "topWidth", "topDepth", "middleWidth", "middleDepth", "bottomWidth", "bottomDepth"].forEach((key) => {
    deps.scalpArtistInputs[key].value = deps.scalpArtistShape[key];
  });
  document.querySelector("#scalpRootOffsetValue").textContent = Number(deps.scalpArtistShape.rootScalpOffset).toFixed(2);
}

function rootScalpOffsetDistance(localOffset = 0) {
  const combinedOffset = Number(deps.scalpArtistShape.rootScalpOffset) + Number(localOffset || 0);
  return THREE.MathUtils.clamp(combinedOffset, -1, 1) * ROOT_SCALP_OFFSET_DISTANCE;
}

function applyLockRootScalpOffset(lock) {
  if (!lock?.rootSurfacePoint || !lock?.rootSurfaceNormal || !lock.points?.length) return;
  const previousRoot = lock.points[0].clone();
  lock.points[0].copy(lock.rootSurfacePoint).addScaledVector(
    lock.rootSurfaceNormal,
    rootScalpOffsetDistance(lock.rootScalpOffset) + deps.layerOffsetForLock(lock) * deps.layerRootOffsetFactor(lock.hairLayer)
  );
  const rootDelta = lock.points[0].clone().sub(previousRoot);
  if (rootDelta.lengthSq() > 0.0000001) {
    lock.clumpRestPoints?.[0]?.add(rootDelta);
    lock.clumpGuideRestPoints?.[0]?.add(rootDelta);
  }
  lock.placementFrame?.root.copy(lock.points[0]);
  deps.syncLockFromCurve(lock);
}

function scalpArtistWeight(y) {
  return THREE.MathUtils.smoothstep(Math.min(1, Math.abs(y)), 0, 1);
}

function scalpArtistScalesAt(y) {
  const weight = scalpArtistWeight(y);
  const widthTarget = y >= 0 ? deps.scalpArtistShape.topWidth : deps.scalpArtistShape.bottomWidth;
  const depthTarget = y >= 0 ? deps.scalpArtistShape.topDepth : deps.scalpArtistShape.bottomDepth;
  return {
    width: THREE.MathUtils.lerp(deps.scalpArtistShape.middleWidth, widthTarget, weight),
    depth: THREE.MathUtils.lerp(deps.scalpArtistShape.middleDepth, depthTarget, weight)
  };
}

function applyScalpArtistShape(point) {
  const sideFace = Math.abs(point.x) >= Math.abs(point.y) && Math.abs(point.x) >= Math.abs(point.z);
  const weight = scalpArtistWeight(point.y);
  const height = point.y >= 0 ? deps.scalpArtistShape.topHeight : deps.scalpArtistShape.bottomHeight;
  const regionScale = scalpArtistScalesAt(point.y);
  point.y *= THREE.MathUtils.lerp(1, height, weight);
  point.x *= regionScale.width;
  point.z *= regionScale.depth;

  const sign = Math.sign(point.x);
  if (sideFace && sign && deps.scalpArtistShape.sideFlatten > 0) {
    const sidePlane = regionScale.width / Math.sqrt(2);
    const inwardTarget = sign * Math.min(Math.abs(point.x), sidePlane);
    point.x = THREE.MathUtils.lerp(point.x, inwardTarget, deps.scalpArtistShape.sideFlatten);
  }
  return point;
}

function inverseScalpArtistShape(point) {
  const ySign = Math.sign(point.y) || 1;
  const targetY = Math.abs(point.y);
  let lowY = 0;
  let highY = 2.5;
  for (let step = 0; step < 14; step += 1) {
    const candidate = (lowY + highY) * 0.5;
    const transformedY = Math.abs(applyScalpArtistShape(new THREE.Vector3(0, candidate * ySign, 0)).y);
    if (transformedY < targetY) lowY = candidate;
    else highY = candidate;
  }
  const baseY = (lowY + highY) * 0.5 * ySign;
  const regionScale = scalpArtistScalesAt(baseY);
  const xSign = Math.sign(point.x) || 1;
  const targetX = Math.abs(point.x);
  let lowX = 0;
  let highX = 2.5;
  for (let step = 0; step < 14; step += 1) {
    const candidate = (lowX + highX) * 0.5;
    const transformedX = Math.abs(applyScalpArtistShape(new THREE.Vector3(candidate * xSign, baseY, 0)).x);
    if (transformedX < targetX) lowX = candidate;
    else highX = candidate;
  }
  point.set((lowX + highX) * 0.5 * xSign, baseY, point.z / Math.max(0.001, regionScale.depth));
  return point;
}

function updateScalpSurface() {
  deps.scalpSurfaceGroup.position.set(deps.scalpSurface.x, deps.scalpSurface.y, deps.scalpSurface.z);
  deps.scalpSurfaceGroup.scale.set(
    deps.scalpSurface.radius * deps.scalpSurface.scaleX,
    deps.scalpSurface.radius * deps.scalpSurface.scaleY,
    deps.scalpSurface.radius * deps.scalpSurface.scaleZ
  );
  updateScalpLatticeObjects();
}

function setActiveScalpRegion(region) {
  if (!SCALP_REGIONS[region]) return;
  deps.scalpState.activeScalpRegion = region;
  deps.scalpRegionButtons.forEach((button) => {
    const active = button.dataset.scalpRegion === region;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  deps.scalpBrushCursor.material.color.set(SCALP_REGIONS[region].color);
  deps.updatePlacementStatus();
}

function clearScalpRegions({ saveUndo = true } = {}) {
  if (saveUndo) deps.pushUndoState();
  if (deps.scalpState.editedScalpSurfaceMesh && deps.scalpState.scalpGuideSource !== "custom") {
    deps.scalpState.editedScalpRegions.fill("unassigned");
    writeEditedScalpRegionColors();
    return;
  }
  if (deps.scalpState.scalpGuideSource === "custom" && deps.scalpState.customScalpSurfaceMesh) {
    deps.scalpState.customScalpRegions.fill("unassigned");
    writeCustomScalpRegionColors();
    return;
  }
  deps.scalpState.scalpRegionAssignments.fill("unassigned");
  deps.scalpState.scalpManualRegionQuads = new Set(deps.scalpState.scalpRegionAssignments.keys());
  writeScalpRegionColors();
}

function scalpHitFromEvent(event) {
  const rect = deps.renderer.domElement.getBoundingClientRect();
  deps.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  deps.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  deps.raycaster.setFromCamera(deps.pointer, deps.camera);
  return deps.raycaster.intersectObject(activeScalpSurfaceMesh(), false)[0];
}

function updateScalpBrushCursor(hit) {
  if (!deps.scalpState.scalpPaintEditing || !hit) {
    deps.scalpBrushCursor.visible = false;
    return;
  }
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
  const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
  const size = Number(deps.scalpBrushSizeInput.value);
  const averageScale = (deps.scalpSurfaceGroup.scale.x + deps.scalpSurfaceGroup.scale.y + deps.scalpSurfaceGroup.scale.z) / 3;
  deps.scalpBrushCursor.position.copy(hit.point).addScaledVector(normal, 0.012);
  deps.scalpBrushCursor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  deps.scalpBrushCursor.scale.setScalar(size * averageScale);
  deps.scalpBrushCursor.visible = true;
}

function paintScalpAt(hit) {
  if (!hit) return;
  const center = deps.scalpSurfaceGroup.worldToLocal(hit.point.clone());
  const radius = Number(deps.scalpBrushSizeInput.value);
  if (hit.object === deps.scalpState.customScalpSurfaceMesh || hit.object === deps.scalpState.editedScalpSurfaceMesh) {
    const editingAuthoredScalp = hit.object === deps.scalpState.editedScalpSurfaceMesh;
    const targetMesh = editingAuthoredScalp ? deps.editedScalpSurfaceMesh : deps.scalpState.customScalpSurfaceMesh;
    const targetRegions = editingAuthoredScalp ? deps.editedScalpRegions : deps.scalpState.customScalpRegions;
    const position = targetMesh.geometry.getAttribute("position");
    const triangleCenter = new THREE.Vector3();
    let nearestTriangle = hit.faceIndex ?? 0;
    let nearestDistance = Infinity;
    let painted = false;
    for (let triangleIndex = 0; triangleIndex < position.count / 3; triangleIndex += 1) {
      triangleCenter.set(0, 0, 0);
      for (let corner = 0; corner < 3; corner += 1) {
        const index = triangleIndex * 3 + corner;
        triangleCenter.x += position.getX(index);
        triangleCenter.y += position.getY(index);
        triangleCenter.z += position.getZ(index);
      }
      triangleCenter.multiplyScalar(1 / 3);
      const distance = triangleCenter.distanceTo(center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTriangle = triangleIndex;
      }
      if (distance > radius) continue;
      targetRegions[triangleIndex] = deps.scalpState.activeScalpRegion;
      painted = true;
    }
    if (!painted) targetRegions[nearestTriangle] = deps.scalpState.activeScalpRegion;
    if (editingAuthoredScalp) writeEditedScalpRegionColors();
    else writeCustomScalpRegionColors();
    return;
  }
  const position = deps.scalpSurfaceGeometry.getAttribute("position");
  const quadCenter = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  const hitQuadId = deps.scalpRenderGeometry.userData.triangleQuadIds?.[hit.faceIndex];
  let nearestQuadId = hitQuadId ?? deps.scalpState.scalpVisibleQuads[0]?.id ?? 0;
  let nearestDistance = Infinity;
  let painted = false;
  for (const quad of deps.scalpState.scalpVisibleQuads) {
    quadCenter.set(0, 0, 0);
    quad.vertices.forEach((index) => {
      vertex.fromBufferAttribute(position, index);
      quadCenter.add(vertex);
    });
    quadCenter.multiplyScalar(0.25);
    const distance = quadCenter.distanceTo(center);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestQuadId = quad.id;
    }
    if (distance > radius) continue;
    deps.scalpState.scalpRegionAssignments[quad.id] = deps.scalpState.activeScalpRegion;
    deps.scalpState.scalpManualRegionQuads.add(quad.id);
    painted = true;
  }
  if (!painted) {
    deps.scalpState.scalpRegionAssignments[nearestQuadId] = deps.scalpState.activeScalpRegion;
    deps.scalpState.scalpManualRegionQuads.add(nearestQuadId);
  }
  writeScalpRegionColors();
}

function beginScalpPaint(event, hit) {
  deps.pushUndoState();
  deps.scalpState.scalpPaintDrag = { pointerId: event.pointerId };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  paintScalpAt(hit);
  updateScalpBrushCursor(hit);
  deps.updateInteractionLocks();
}

function updateScalpPaint(event) {
  if (!deps.scalpState.scalpPaintEditing) return;
  const hit = scalpHitFromEvent(event);
  updateScalpBrushCursor(hit);
  if (!deps.scalpState.scalpPaintDrag || deps.scalpState.scalpPaintDrag.pointerId !== event.pointerId || !hit) return;
  paintScalpAt(hit);
  event.preventDefault();
}

function endScalpPaint(event) {
  if (!deps.scalpState.scalpPaintDrag || (event?.pointerId !== undefined && deps.scalpState.scalpPaintDrag.pointerId !== event.pointerId)) return;
  if (event && deps.renderer.domElement.hasPointerCapture?.(event.pointerId)) deps.renderer.domElement.releasePointerCapture(event.pointerId);
  deps.scalpState.scalpPaintDrag = null;
  deps.updateInteractionLocks();
}

function createScalpLattice() {
  const values = [-1, 0, 1];
  for (let z = 0; z < 3; z += 1) {
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        const index = x + y * 3 + z * 9;
        const point = new THREE.Vector3(values[x], values[y], values[z]);
        const handle = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 14, 10),
          new THREE.MeshBasicMaterial({ color: 0x58f6ff, transparent: true, opacity: 0.82, depthTest: false })
        );
        handle.userData.scalpLatticeIndex = index;
        handle.renderOrder = 8;
        deps.scalpLatticePoints.push(point);
        deps.scalpLatticeHandles.push(handle);
        deps.scalpLatticeGroup.add(handle);
        if (x < 2) deps.scalpLatticeConnections.push([index, index + 1]);
        if (y < 2) deps.scalpLatticeConnections.push([index, index + 3]);
        if (z < 2) deps.scalpLatticeConnections.push([index, index + 9]);
      }
    }
  }
  updateScalpLatticeObjects();
}

function resetScalpLattice() {
  const values = [-1, 0, 1];
  deps.scalpLatticePoints.forEach((point, index) => {
    const x = index % 3;
    const y = Math.floor(index / 3) % 3;
    const z = Math.floor(index / 9);
    point.set(values[x], values[y], values[z]);
  });
  applyScalpLatticeDeformation();
  updateScalpLatticeObjects();
}

function updateScalpLatticeObjects() {
  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  deps.scalpLatticeHandles.forEach((handle, index) => {
    const shapedPoint = applyScalpArtistShape(deps.scalpLatticePoints[index].clone());
    handle.position.copy(deps.scalpSurfaceGroup.localToWorld(shapedPoint));
  });
  const positions = [];
  deps.scalpLatticeConnections.forEach(([a, b]) => {
    positions.push(...deps.scalpLatticeHandles[a].position.toArray(), ...deps.scalpLatticeHandles[b].position.toArray());
  });
  deps.scalpLatticeLine.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  deps.scalpLatticeLine.geometry.computeBoundingSphere();
}

function applyScalpLatticeDeformation() {
  const position = deps.scalpSurfaceGeometry.getAttribute("position");
  const deformed = new THREE.Vector3();
  for (let vertex = 0; vertex < position.count; vertex += 1) {
    const offset = vertex * 3;
    const wx = deps.quadraticWeights(THREE.MathUtils.clamp((deps.scalpBasePositions[offset] + 1) * 0.5, 0, 1));
    const wy = deps.quadraticWeights(THREE.MathUtils.clamp((deps.scalpBasePositions[offset + 1] + 1) * 0.5, 0, 1));
    const wz = deps.quadraticWeights(THREE.MathUtils.clamp((deps.scalpBasePositions[offset + 2] + 1) * 0.5, 0, 1));
    deformed.set(0, 0, 0);
    for (let z = 0; z < 3; z += 1) {
      for (let y = 0; y < 3; y += 1) {
        for (let x = 0; x < 3; x += 1) {
          deformed.addScaledVector(deps.scalpLatticePoints[x + y * 3 + z * 9], wx[x] * wy[y] * wz[z]);
        }
      }
    }
    applyScalpArtistShape(deformed);
    position.setXYZ(vertex, deformed.x, deformed.y, deformed.z);
  }
  position.needsUpdate = true;
  deps.scalpSurfaceGeometry.computeVertexNormals();
  deps.scalpSurfaceGeometry.computeBoundingBox();
  deps.scalpSurfaceGeometry.computeBoundingSphere();
  updateScalpRenderGeometry();
  updateScalpQuadWire();
}

function updateScalpLatticeFromHandle(handle) {
  const index = handle.userData.scalpLatticeIndex;
  const localPoint = inverseScalpArtistShape(deps.scalpSurfaceGroup.worldToLocal(handle.position.clone()));
  const xIndex = index % 3;
  if (deps.scalpArtistShape.mirrorX && xIndex === 1) localPoint.x = 0;
  deps.scalpLatticePoints[index].copy(localPoint);
  if (deps.scalpArtistShape.mirrorX && xIndex !== 1) {
    const mirrorIndex = (2 - xIndex) + Math.floor(index / 3) % 3 * 3 + Math.floor(index / 9) * 9;
    deps.scalpLatticePoints[mirrorIndex].copy(localPoint);
    deps.scalpLatticePoints[mirrorIndex].x *= -1;
  }
  applyScalpLatticeDeformation();
  updateScalpLatticeObjects();
}

function selectScalpLatticePoint(index) {
  deps.scalpState.selectedScalpLatticeIndex = index;
  deps.scalpLatticeHandles.forEach((handle, handleIndex) => {
    handle.material.color.set(handleIndex === index ? deps.CONTROL_POINT_SELECTED_COLOR : 0x58f6ff);
    handle.material.opacity = handleIndex === index ? 1 : 0.64;
  });
  deps.transformControls.detach();
  deps.transformControls.setMode("translate");
  deps.transformControls.setSpace("world");
  deps.transformControls.showX = true;
  deps.transformControls.showY = true;
  deps.transformControls.showZ = true;
  deps.transformControls.attach(deps.scalpLatticeHandles[index]);
}

function beginScalpLatticeDrag(handle, event) {
  const plane = new THREE.Plane();
  const cameraDirection = deps.camera.getWorldDirection(new THREE.Vector3());
  plane.setFromNormalAndCoplanarPoint(cameraDirection, handle.position);
  const intersection = deps.raycaster.ray.intersectPlane(plane, new THREE.Vector3());
  if (!intersection) return;
  deps.scalpState.scalpLatticeDrag = {
    handle,
    plane,
    startIntersection: intersection,
    startPosition: handle.position.clone(),
    startX: event.clientX,
    startY: event.clientY,
    undoCaptured: false
  };
  deps.updateInteractionLocks();
}

function updateScalpLatticeDrag(event) {
  if (!deps.scalpState.scalpLatticeDrag) return;
  const rect = deps.renderer.domElement.getBoundingClientRect();
  deps.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  deps.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  deps.raycaster.setFromCamera(deps.pointer, deps.camera);
  const intersection = deps.raycaster.ray.intersectPlane(deps.scalpState.scalpLatticeDrag.plane, new THREE.Vector3());
  if (!intersection) return;
  const moved = Math.hypot(event.clientX - deps.scalpState.scalpLatticeDrag.startX, event.clientY - deps.scalpState.scalpLatticeDrag.startY);
  if (moved > 2 && !deps.scalpState.scalpLatticeDrag.undoCaptured) {
    deps.pushUndoState();
    deps.scalpState.scalpLatticeDrag.undoCaptured = true;
  }
  deps.scalpState.scalpLatticeDrag.handle.position.copy(deps.scalpState.scalpLatticeDrag.startPosition).add(intersection.sub(deps.scalpState.scalpLatticeDrag.startIntersection));
  updateScalpLatticeFromHandle(deps.scalpState.scalpLatticeDrag.handle);
  event.preventDefault();
}

function endScalpLatticeDrag() {
  if (!deps.scalpState.scalpLatticeDrag) return;
  deps.scalpState.scalpLatticeDrag = null;
  deps.updateInteractionLocks();
}

function disposeScalpBuilderVisuals() {
  deps.scalpState.scalpBuilderCurveLatticeLoadToken += 1;
  if (
    deps.transformControls.object?.userData.scalpBuilderPlane
    || deps.transformControls.object?.userData.scalpBuilderLatticeIndex !== undefined
  ) deps.transformControls.detach();
  while (deps.scalpBuilderGroup.children.length) {
    const child = deps.scalpBuilderGroup.children.pop();
    child.traverse((item) => {
      item.geometry?.dispose();
      if (Array.isArray(item.material)) item.material.forEach((material) => material.dispose());
      else item.material?.dispose();
    });
  }
  deps.scalpState.scalpBuilderPlane = null;
  deps.scalpState.scalpBuilderCurveLattice = null;
}

function updateScalpBuilderPositionReadout() {
  const step = deps.SCALP_BUILDER_STEPS[deps.scalpState.scalpBuilderStep];
  const position = step
    ? deps.scalpState.scalpBuilderPlane?.position[step.axis] ?? deps.scalpBuilderPlanePositions[deps.scalpState.scalpBuilderStep] ?? 0
    : 0;
  deps.scalpBuilderPositionOutput.textContent = Number(position).toFixed(2);
}

function scalpBuilderHeadMeshes() {
  const availableMeshes = deps.headMeshes().filter((mesh) => !deps.GUIDE_BOUNDS_EXCLUDED_GROUPS.has(mesh.name));
  const namedHeadMeshes = availableMeshes.filter((mesh) => /face_retopo_geo/i.test(mesh.name));
  return namedHeadMeshes.length
    ? namedHeadMeshes
    : availableMeshes.slice().sort((a, b) => (
      (b.geometry?.getAttribute("position")?.count || 0) - (a.geometry?.getAttribute("position")?.count || 0)
    )).slice(0, 1);
}

function scalpBuilderIntersectionPositions(group, step) {
  const positions = [];
  group.updateMatrixWorld(true);
  deps.headPlaneIntersectionSegments(step.axis, group.position[step.axis]).forEach((segment) => {
    segment.forEach((point) => {
      const local = group.worldToLocal(point.clone());
      positions.push(local.x, local.y, local.z);
    });
  });
  return positions;
}

function rebuildScalpBuilderIntersection(group, step) {
  const oldLine = group.children.find((child) => child.userData.scalpBuilderIntersection);
  oldLine?.geometry.dispose();
  oldLine?.material.dispose();
  oldLine?.removeFromParent();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(
    scalpBuilderIntersectionPositions(group, step), 3
  ));
  const line = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: step.color,
      transparent: true,
      opacity: group.userData.scalpBuilderPlane ? 0.95 : 0.2,
      depthTest: true,
      depthWrite: false
    })
  );
  line.userData.scalpBuilderIntersection = true;
  line.renderOrder = 20;
  group.add(line);
}

function createScalpBuilderPlaneVisual(position, stepIndex, active = false) {
  const step = deps.SCALP_BUILDER_STEPS[stepIndex];
  const bounds = deps.guideHeadBounds(deps.guideState.guideModel);
  const center = bounds.getCenter(new THREE.Vector3());
  const group = new THREE.Group();
  group.userData.scalpBuilderCalibrationPlane = true;
  group.userData.scalpBuilderPlane = active;
  group.userData.scalpBuilderAxis = step.axis;
  group.position.copy(center);
  group.position[step.axis] = position;
  deps.scalpBuilderGroup.add(group);
  rebuildScalpBuilderIntersection(group, step);
  return group;
}

function createScalpBuilderPlanes() {
  disposeScalpBuilderVisuals();
  if (!deps.guideState.guideModel) return;
  const bounds = deps.guideHeadBounds(deps.guideState.guideModel);
  const size = bounds.getSize(new THREE.Vector3());
  for (let index = 0; index < Math.min(deps.scalpState.scalpBuilderStep, deps.SCALP_BUILDER_STEPS.length); index += 1) {
    if (Number.isFinite(deps.scalpBuilderPlanePositions[index])) {
      createScalpBuilderPlaneVisual(deps.scalpBuilderPlanePositions[index], index, false);
    }
  }
  if (deps.scalpState.scalpBuilderStep < deps.SCALP_BUILDER_STEPS.length) {
    const step = deps.SCALP_BUILDER_STEPS[deps.scalpState.scalpBuilderStep];
    if (!Number.isFinite(deps.scalpBuilderPlanePositions[deps.scalpState.scalpBuilderStep])) {
      const minimum = bounds.min[step.axis];
      deps.scalpBuilderPlanePositions[deps.scalpState.scalpBuilderStep] = minimum + size[step.axis] * step.ratio;
    }
    deps.scalpState.scalpBuilderPlane = createScalpBuilderPlaneVisual(
      deps.scalpBuilderPlanePositions[deps.scalpState.scalpBuilderStep],
      deps.scalpState.scalpBuilderStep,
      true
    );
    deps.transformControls.attach(deps.scalpState.scalpBuilderPlane);
    deps.transformControls.setMode("translate");
    deps.transformControls.setSpace("world");
    deps.transformControls.showX = false;
    deps.transformControls.showY = step.axis === "y";
    deps.transformControls.showZ = step.axis === "z";
  }
  updateScalpBuilderStepUi();
  updateScalpBuilderPositionReadout();
}

function updateScalpBuilderStepUi() {
  const complete = deps.scalpState.scalpBuilderStep >= deps.SCALP_BUILDER_STEPS.length;
  deps.generateScalpBuilderButton.classList.toggle("hidden", !complete);
  if (complete) {
    deps.generateScalpBuilderButton.textContent = "Generate Surface Preview";
    deps.scalpBuilderStepLabel.textContent = "Placement Planes";
    deps.scalpBuilderStepName.textContent = "Calibration Complete";
    deps.scalpBuilderAxisLabel.textContent = "Position";
    deps.scalpBuilderInstruction.textContent = "All placement boundaries have been recorded. Generate the curve-based surface preview and inspect it from every angle.";
    deps.confirmScalpBuilderButton.disabled = true;
    deps.confirmScalpBuilderButton.textContent = "All Planes Confirmed";
    return;
  }
  const step = deps.SCALP_BUILDER_STEPS[deps.scalpState.scalpBuilderStep];
  deps.scalpBuilderStepLabel.textContent = `${step.phase} Plane ${step.phaseIndex} of ${step.phaseCount}`;
  deps.scalpBuilderStepName.textContent = step.name;
  deps.scalpBuilderInstruction.textContent = step.instruction;
  deps.scalpBuilderAxisLabel.textContent = step.axis === "y" ? "Height" : "Depth";
  deps.confirmScalpBuilderButton.disabled = false;
  deps.confirmScalpBuilderButton.textContent = "Confirm Plane";
}

function parseScalpTopologyTemplate(content) {
  const vertices = [];
  const faces = [];
  let material = "";
  content.split(/\r?\n/).forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === "v" && parts.length >= 4) {
      vertices.push(new THREE.Vector3(Number(parts[1]), Number(parts[2]), Number(parts[3])));
    } else if (parts[0] === "usemtl") {
      material = parts.slice(1).join(" ");
    } else if (parts[0] === "f" && parts.length === 5) {
      const indices = parts.slice(1).map((token) => Number(token.split("/")[0]) - 1);
      const normalizedMaterial = material.trim().toLowerCase().replace(/[\s_]+/g, "-");
      const region = deps.SCALP_TEMPLATE_MATERIAL_REGIONS[material]
        || deps.SCALP_TEMPLATE_MATERIAL_REGIONS[normalizedMaterial]
        || "unassigned";
      faces.push({ indices, region });
    }
  });
  if (!vertices.length || !faces.length) throw new Error("Scalp topology template contains no usable quad mesh");
  return { vertices, faces };
}

function loadScalpTopologyTemplate() {
  if (!deps.scalpState.scalpTopologyTemplatePromise) {
    deps.scalpState.scalpTopologyTemplatePromise = fetch("./assets/scalp-topology-template.obj?v=20260720-1")
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load scalp topology template (${response.status})`);
        return response.text();
      })
      .then(parseScalpTopologyTemplate);
  }
  return deps.scalpState.scalpTopologyTemplatePromise;
}

function loadScalpBuilderCurveLatticeTemplate() {
  if (!deps.scalpState.scalpBuilderCurveLatticePromise) {
    deps.scalpState.scalpBuilderCurveLatticePromise = fetch("./assets/scalpcurvelatticeguide.obj?v=20260720-1")
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load scalp curve lattice (${response.status})`);
        return response.text();
      })
      .then(parseScalpTopologyTemplate);
  }
  return deps.scalpState.scalpBuilderCurveLatticePromise;
}

function scalpBuilderCurveLatticeWorldPoints(template) {
  const authoredMatrix = deps.scalpState.authoredScalpGuideMatrix || deps.guideState.guideModel.matrixWorld;
  return template.vertices.map((vertex) => vertex.clone().applyMatrix4(authoredMatrix));
}

function scalpBuilderCurveLatticeEdges(faces) {
  const edges = new Map();
  faces.forEach((face) => {
    face.indices.forEach((start, corner) => {
      const end = face.indices[(corner + 1) % face.indices.length];
      const key = start < end ? `${start}:${end}` : `${end}:${start}`;
      if (!edges.has(key)) edges.set(key, { start, end, region: face.region });
    });
  });
  return [...edges.values()];
}

function subdivideScalpBuilderCage(sourcePoints, sourceFaces, iterations = 2, trackedSourceEdges = null) {
  let points = sourcePoints.map((point) => point.clone());
  let faces = sourceFaces.map((face) => ({ indices: [...face.indices], region: face.region }));
  let trackedEdges = trackedSourceEdges ? new Set(trackedSourceEdges) : null;
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const facePoints = faces.map((face) => {
      const point = new THREE.Vector3();
      face.indices.forEach((index) => point.add(points[index]));
      return point.multiplyScalar(1 / face.indices.length);
    });
    const incidentFaces = Array.from({ length: points.length }, () => []);
    const incidentEdges = Array.from({ length: points.length }, () => []);
    const edgeMap = new Map();
    faces.forEach((face, faceIndex) => {
      face.indices.forEach((start, corner) => {
        const end = face.indices[(corner + 1) % face.indices.length];
        const key = start < end ? `${start}:${end}` : `${end}:${start}`;
        if (!edgeMap.has(key)) edgeMap.set(key, { start: Math.min(start, end), end: Math.max(start, end), faces: [] });
        edgeMap.get(key).faces.push(faceIndex);
        incidentFaces[start].push(faceIndex);
      });
    });
    const edges = [...edgeMap.values()];
    edges.forEach((edge, edgeIndex) => {
      incidentEdges[edge.start].push(edgeIndex);
      incidentEdges[edge.end].push(edgeIndex);
    });
    const vertexPoints = points.map((point, index) => {
      const boundaryNeighbors = [];
      incidentEdges[index].forEach((edgeIndex) => {
        const edge = edges[edgeIndex];
        if (edge.faces.length === 1) boundaryNeighbors.push(edge.start === index ? edge.end : edge.start);
      });
      if (boundaryNeighbors.length >= 2) {
        return point.clone().multiplyScalar(6)
          .add(points[boundaryNeighbors[0]])
          .add(points[boundaryNeighbors[boundaryNeighbors.length - 1]])
          .multiplyScalar(1 / 8);
      }
      const faceSet = [...new Set(incidentFaces[index])];
      const n = faceSet.length;
      if (!n) return point.clone();
      const faceAverage = new THREE.Vector3();
      faceSet.forEach((faceIndex) => faceAverage.add(facePoints[faceIndex]));
      faceAverage.multiplyScalar(1 / n);
      const edgeAverage = new THREE.Vector3();
      incidentEdges[index].forEach((edgeIndex) => {
        const edge = edges[edgeIndex];
        edgeAverage.add(points[edge.start]).add(points[edge.end]);
      });
      edgeAverage.multiplyScalar(1 / Math.max(1, incidentEdges[index].length * 2));
      return point.clone().multiplyScalar(n - 3)
        .addScaledVector(edgeAverage, 2)
        .add(faceAverage)
        .multiplyScalar(1 / n);
    });
    const nextPoints = [...vertexPoints];
    const edgePointIndices = new Map();
    edges.forEach((edge) => {
      const edgePoint = points[edge.start].clone().add(points[edge.end]);
      if (edge.faces.length === 2) {
        edgePoint.add(facePoints[edge.faces[0]]).add(facePoints[edge.faces[1]]).multiplyScalar(0.25);
      } else {
        edgePoint.multiplyScalar(0.5);
      }
      const key = `${edge.start}:${edge.end}`;
      edgePointIndices.set(key, nextPoints.length);
      nextPoints.push(edgePoint);
    });
    if (trackedEdges) {
      const nextTrackedEdges = new Set();
      trackedEdges.forEach((key) => {
        const edge = edgeMap.get(key);
        const edgePointIndex = edgePointIndices.get(key);
        if (!edge || edgePointIndex === undefined) return;
        const firstKey = edge.start < edgePointIndex
          ? `${edge.start}:${edgePointIndex}`
          : `${edgePointIndex}:${edge.start}`;
        const secondKey = edge.end < edgePointIndex
          ? `${edge.end}:${edgePointIndex}`
          : `${edgePointIndex}:${edge.end}`;
        nextTrackedEdges.add(firstKey);
        nextTrackedEdges.add(secondKey);
      });
      trackedEdges = nextTrackedEdges;
    }
    const facePointIndices = facePoints.map((point) => {
      const index = nextPoints.length;
      nextPoints.push(point);
      return index;
    });
    const nextFaces = [];
    faces.forEach((face, faceIndex) => {
      face.indices.forEach((vertexIndex, corner) => {
        const nextIndex = face.indices[(corner + 1) % face.indices.length];
        const previousIndex = face.indices[(corner + face.indices.length - 1) % face.indices.length];
        const nextKey = vertexIndex < nextIndex ? `${vertexIndex}:${nextIndex}` : `${nextIndex}:${vertexIndex}`;
        const previousKey = previousIndex < vertexIndex ? `${previousIndex}:${vertexIndex}` : `${vertexIndex}:${previousIndex}`;
        nextFaces.push({
          indices: [vertexIndex, edgePointIndices.get(nextKey), facePointIndices[faceIndex], edgePointIndices.get(previousKey)],
          region: face.region
        });
      });
    });
    points = nextPoints;
    faces = nextFaces;
  }
  return { points, faces, trackedEdges: trackedEdges ? [...trackedEdges] : null };
}

function scalpBuilderSurfaceGeometry(points, faces, materialIndices) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points.flatMap((point) => [point.x, point.y, point.z]), 3));
  const indices = [];
  const facesByRegion = new Map();
  faces.forEach((face) => {
    const region = materialIndices.has(face.region) ? face.region : "unassigned";
    if (!facesByRegion.has(region)) facesByRegion.set(region, []);
    facesByRegion.get(region).push(face);
  });
  materialIndices.forEach((materialIndex, region) => {
    const regionFaces = facesByRegion.get(region) || [];
    if (!regionFaces.length) return;
    const indexOffset = indices.length;
    regionFaces.forEach((face) => {
      indices.push(face.indices[0], face.indices[1], face.indices[2], face.indices[0], face.indices[2], face.indices[3]);
    });
    geometry.addGroup(indexOffset, regionFaces.length * 6, materialIndex);
  });
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function writeEditedScalpRegionColors() {
  if (!deps.scalpState.editedScalpSurfaceMesh) return;
  const colorAttribute = deps.scalpState.editedScalpSurfaceMesh.geometry.getAttribute("color");
  if (!colorAttribute) return;
  const color = new THREE.Color();
  deps.scalpState.editedScalpRegions.forEach((region, triangleIndex) => {
    color.set(SCALP_REGIONS[region]?.color || SCALP_REGIONS.unassigned.color);
    for (let corner = 0; corner < 3; corner += 1) {
      colorAttribute.setXYZ(triangleIndex * 3 + corner, color.r, color.g, color.b);
    }
  });
  colorAttribute.needsUpdate = true;
  deps.scalpState.editedScalpSurfaceMesh.geometry.userData.triangleRegions = deps.scalpState.editedScalpRegions;
}

function syncEditedScalpSurface(subdivided) {
  if (!subdivided?.points?.length || !subdivided?.faces?.length) return;
  deps.scalpBuilderGroup.updateMatrixWorld(true);
  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  const inverseScalpMatrix = deps.scalpSurfaceGroup.matrixWorld.clone().invert();
  const points = subdivided.points.map((point) => point.clone()
    .applyMatrix4(deps.scalpBuilderGroup.matrixWorld)
    .applyMatrix4(inverseScalpMatrix));
  const sourceGeometry = new THREE.BufferGeometry();
  sourceGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points.flatMap((point) => [point.x, point.y, point.z]), 3)
  );
  sourceGeometry.setIndex(subdivided.faces.flatMap((face) => [
    face.indices[0], face.indices[1], face.indices[2],
    face.indices[0], face.indices[2], face.indices[3]
  ]));
  sourceGeometry.computeVertexNormals();
  const geometry = sourceGeometry.toNonIndexed();
  sourceGeometry.dispose();
  const defaultRegions = subdivided.faces.flatMap((face) => [face.region, face.region]);
  if (deps.scalpState.editedScalpRegions.length !== defaultRegions.length) deps.scalpState.editedScalpRegions = defaultRegions;
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(geometry.getAttribute("position").count * 3), 3));
  geometry.userData.triangleRegions = deps.scalpState.editedScalpRegions;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  if (!deps.scalpState.editedScalpSurfaceMesh) {
    deps.scalpState.editedScalpSurfaceMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x111116,
        roughness: 0.72,
        vertexColors: true,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        side: THREE.FrontSide
      })
    );
    deps.scalpState.editedScalpSurfaceMesh.renderOrder = 1;
    deps.scalpState.editedScalpSurfaceWire = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x62f3ff, transparent: true, opacity: 0.14, depthWrite: false })
    );
    deps.scalpState.editedScalpSurfaceWire.renderOrder = 2;
    deps.scalpState.editedScalpSelectionOutline = createScalpSelectionOutline(geometry);
    deps.scalpSurfaceGroup.add(deps.scalpState.editedScalpSurfaceMesh, deps.scalpState.editedScalpSurfaceWire, deps.scalpState.editedScalpSelectionOutline);
  } else {
    const previousGeometry = deps.scalpState.editedScalpSurfaceMesh.geometry;
    deps.scalpState.editedScalpSurfaceMesh.geometry = geometry;
    deps.scalpState.editedScalpSelectionOutline.geometry = geometry;
    previousGeometry.dispose();
  }

  const wirePositions = [];
  scalpBuilderCurveLatticeEdges(subdivided.faces).forEach((edge) => {
    const start = points[edge.start];
    const end = points[edge.end];
    wirePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
  });
  const previousWireGeometry = deps.scalpState.editedScalpSurfaceWire.geometry;
  deps.scalpState.editedScalpSurfaceWire.geometry = new THREE.BufferGeometry();
  deps.scalpState.editedScalpSurfaceWire.geometry.setAttribute("position", new THREE.Float32BufferAttribute(wirePositions, 3));
  deps.scalpState.editedScalpSurfaceWire.geometry.computeBoundingSphere();
  previousWireGeometry.dispose();
  writeEditedScalpRegionColors();
  updateScalpEditingVisibility();
}

async function ensureEditedScalpSurface() {
  if (!deps.guideState.guideModel) return;
  const template = await loadScalpBuilderCurveLatticeTemplate();
  const defaultPoints = scalpBuilderCurveLatticeWorldPoints(template);
  const points = deps.scalpState.scalpBuilderEditedPoints?.length === defaultPoints.length
    ? deps.scalpState.scalpBuilderEditedPoints.map((point) => point.clone())
    : defaultPoints;
  // Keep the resolved cage as project state even when Edit Scalp has not been opened.
  // Saved root attachments and the visible scalp must always refer to the same surface.
  deps.scalpState.scalpBuilderEditedPoints = points.map((point) => point.clone());
  const bounds = new THREE.Box3().setFromPoints(points);
  bounds.getCenter(deps.scalpRoughScalePivot);
  const size = bounds.getSize(new THREE.Vector3());
  const displayCenter = bounds.getCenter(new THREE.Vector3());
  const displayOffset = Math.max(size.x, size.y, size.z) * 0.008;
  const subdivided = subdivideScalpBuilderCage(points, template.faces, 2);
  subdivided.points.forEach((point) => {
    const direction = point.clone().sub(displayCenter);
    if (direction.lengthSq() > 0.000001) point.addScaledVector(direction.normalize(), displayOffset);
  });
  const { x, y, z } = deps.scalpRoughScale;
  deps.scalpBuilderGroup.scale.set(x, y, z);
  deps.scalpBuilderGroup.position.set(
    deps.scalpRoughScalePivot.x * (1 - x),
    deps.scalpRoughScalePivot.y * (1 - y),
    deps.scalpRoughScalePivot.z * (1 - z)
  );
  syncEditedScalpSurface(subdivided);
}

function updateScalpBuilderCurveLatticeGeometry() {
  if (!deps.scalpState.scalpBuilderCurveLattice) return;
  const subdivided = subdivideScalpBuilderCage(
    deps.scalpState.scalpBuilderCurveLattice.points,
    deps.scalpState.scalpBuilderCurveLattice.template.faces,
    2
  );
  subdivided.points.forEach((point) => {
    const direction = point.clone().sub(deps.scalpState.scalpBuilderCurveLattice.displayCenter);
    if (direction.lengthSq() > 0.000001) point.addScaledVector(direction.normalize(), deps.scalpState.scalpBuilderCurveLattice.displayOffset);
  });
  deps.scalpState.scalpBuilderCurveLattice.lastSubdivided = subdivided;
  syncEditedScalpSurface(subdivided);
  const smoothEdges = scalpBuilderCurveLatticeEdges(subdivided.faces);
  const positions = [];
  const colors = [];
  const color = new THREE.Color();
  smoothEdges.forEach((edge) => {
    const start = subdivided.points[edge.start];
    const end = subdivided.points[edge.end];
    color.set(SCALP_REGIONS[edge.region]?.color || SCALP_REGIONS.unassigned.color);
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  });
  const geometry = deps.scalpState.scalpBuilderCurveLattice.line.geometry;
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  const surface = deps.scalpState.scalpBuilderCurveLattice.surface;
  const previousSurfaceGeometry = surface.geometry;
  surface.geometry = scalpBuilderSurfaceGeometry(
    subdivided.points,
    subdivided.faces,
    deps.scalpState.scalpBuilderCurveLattice.materialIndices
  );
  deps.scalpState.scalpBuilderCurveLattice.outline.geometry = surface.geometry;
  const symmetryPositions = [];
  const symmetryX = deps.scalpState.scalpBuilderCurveLattice.displayCenter.x;
  subdivided.faces.forEach((face) => {
    for (let corner = 1; corner < face.indices.length - 1; corner += 1) {
      const intersections = deps.trianglePlaneIntersections(
        subdivided.points[face.indices[0]],
        subdivided.points[face.indices[corner]],
        subdivided.points[face.indices[corner + 1]],
        "x",
        symmetryX
      );
      if (intersections.length === 2) {
        symmetryPositions.push(
          intersections[0].x, intersections[0].y, intersections[0].z,
          intersections[1].x, intersections[1].y, intersections[1].z
        );
      }
    }
  });
  deps.scalpState.scalpBuilderCurveLattice.symmetryLine.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(symmetryPositions, 3)
  );
  deps.scalpState.scalpBuilderCurveLattice.symmetryLine.geometry.computeBoundingSphere();
  deps.scalpState.scalpBuilderCurveLattice.symmetryLine.visible = (
    deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.scalpState.scalpBuilderEditing && deps.sculptState.mirrorXEditing
  );
  deps.scalpBuilderGroup.updateMatrixWorld(true);
  const symmetryWorldX = deps.scalpBuilderGroup.localToWorld(
    new THREE.Vector3(symmetryX, deps.scalpState.scalpBuilderCurveLattice.displayCenter.y, deps.scalpState.scalpBuilderCurveLattice.displayCenter.z)
  ).x;
  const headSymmetryPositions = [];
  deps.headPlaneIntersectionSegments("x", symmetryWorldX).forEach((segment) => {
    segment.forEach((point) => {
      const local = deps.scalpBuilderGroup.worldToLocal(point.clone());
      headSymmetryPositions.push(local.x, local.y, local.z);
    });
  });
  deps.scalpState.scalpBuilderCurveLattice.headSymmetryLine.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(headSymmetryPositions, 3)
  );
  deps.scalpState.scalpBuilderCurveLattice.headSymmetryLine.geometry.computeBoundingSphere();
  deps.scalpState.scalpBuilderCurveLattice.headSymmetryLine.visible = (
    deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.scalpState.scalpBuilderEditing && deps.sculptState.mirrorXEditing
  );
  previousSurfaceGeometry.dispose();
}

function scalpBuilderLatticeNeighbors() {
  if (!deps.scalpState.scalpBuilderCurveLattice) return [];
  const neighbors = Array.from({ length: deps.scalpState.scalpBuilderCurveLattice.points.length }, () => new Set());
  deps.scalpState.scalpBuilderCurveLattice.template.faces.forEach((face) => {
    face.indices.forEach((index, corner) => {
      const next = face.indices[(corner + 1) % face.indices.length];
      neighbors[index].add(next);
      neighbors[next].add(index);
    });
  });
  return neighbors;
}

function scalpBuilderLatticeDistances(originIndex) {
  const neighbors = scalpBuilderLatticeNeighbors();
  const distances = new Array(neighbors.length).fill(Infinity);
  distances[originIndex] = 0;
  const queue = [originIndex];
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    neighbors[index].forEach((neighbor) => {
      if (distances[neighbor] !== Infinity) return;
      distances[neighbor] = distances[index] + 1;
      queue.push(neighbor);
    });
  }
  return distances;
}

function scalpBuilderProportionalWeight(distance) {
  const radius = Number(deps.proportionalRadiusInput?.value || 2.5);
  if (!deps.sculptState.proportionalEditing) return distance === 0 ? 1 : 0;
  if (distance > radius) return 0;
  if (distance === 0) return 1;
  const linear = THREE.MathUtils.clamp(1 - distance / Math.max(0.001, radius), 0, 1);
  const smooth = linear * linear * (3 - 2 * linear);
  return THREE.MathUtils.lerp(1, smooth, Number(deps.proportionalFalloffInput?.value || 0.65));
}

function scalpBuilderMirrorMap(points) {
  const bounds = new THREE.Box3().setFromPoints(points);
  const centerX = bounds.getCenter(new THREE.Vector3()).x;
  return points.map((point, index) => {
    const target = new THREE.Vector3(2 * centerX - point.x, point.y, point.z);
    let closestIndex = index;
    let closestDistance = Infinity;
    points.forEach((candidate, candidateIndex) => {
      const distance = candidate.distanceToSquared(target);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = candidateIndex;
      }
    });
    return closestIndex;
  });
}

function beginScalpBuilderCurveLatticeEdit(handle) {
  if (!deps.scalpState.scalpBuilderCurveLattice) return;
  const selectedIndex = handle.userData.scalpBuilderLatticeIndex;
  const startPoints = deps.scalpState.scalpBuilderCurveLattice.points.map((point) => point.clone());
  deps.scalpState.activeScalpBuilderCurveLatticeEdit = {
    selectedIndex,
    startPoints,
    distances: scalpBuilderLatticeDistances(selectedIndex),
    mirrorMap: scalpBuilderMirrorMap(startPoints),
    centerX: new THREE.Box3().setFromPoints(startPoints).getCenter(new THREE.Vector3()).x
  };
}

function commitScalpBuilderCurveLatticeEdit() {
  if (deps.scalpState.scalpBuilderCurveLattice) {
    deps.scalpState.scalpBuilderEditedPoints = deps.scalpState.scalpBuilderCurveLattice.points.map((point) => point.clone());
  }
  deps.scalpState.activeScalpBuilderCurveLatticeEdit = null;
}

function updateScalpBuilderHandleColors() {
  if (!deps.scalpState.scalpBuilderCurveLattice) return;
  const selectedIndex = deps.scalpState.scalpBuilderCurveLattice.selectedIndex;
  const distances = selectedIndex == null ? [] : scalpBuilderLatticeDistances(selectedIndex);
  const mirrorMap = selectedIndex == null ? [] : scalpBuilderMirrorMap(deps.scalpState.scalpBuilderCurveLattice.points);
  const mirroredIndex = selectedIndex == null ? null : mirrorMap[selectedIndex];
  deps.scalpState.scalpBuilderCurveLattice.handles.forEach((handle, index) => {
    if (index === selectedIndex) {
      handle.material.color.set(deps.CONTROL_POINT_SELECTED_COLOR);
      handle.material.opacity = 1;
      return;
    }
    const weight = selectedIndex == null ? 0 : scalpBuilderProportionalWeight(distances[index]);
    const mirrored = deps.sculptState.mirrorXEditing && index === mirroredIndex;
    handle.material.color.set(mirrored || weight > 0 ? 0xffd65a : 0x58f6ff);
    handle.material.opacity = mirrored ? 0.9 : weight > 0 ? THREE.MathUtils.lerp(0.42, 0.82, weight) : 0.42;
  });
}

function selectScalpBuilderCurveLatticePoint(index) {
  if (!deps.scalpState.scalpBuilderCurveLattice) return;
  deps.scalpState.scalpBuilderCurveLattice.selectedIndex = index;
  updateScalpBuilderHandleColors();
  const handle = deps.scalpState.scalpBuilderCurveLattice.handles[index];
  if (!handle) return;
  deps.transformControls.attach(handle);
  deps.transformControls.setMode("translate");
  deps.transformControls.setSpace("world");
  deps.transformControls.showX = true;
  deps.transformControls.showY = true;
  deps.transformControls.showZ = true;
}

function updateScalpBuilderCurveLatticeFromHandle(handle) {
  if (!deps.scalpState.scalpBuilderCurveLattice) return;
  const index = handle.userData.scalpBuilderLatticeIndex;
  if (!deps.scalpState.scalpBuilderCurveLattice.points[index]) return;
  if (!deps.scalpState.activeScalpBuilderCurveLatticeEdit || deps.scalpState.activeScalpBuilderCurveLatticeEdit.selectedIndex !== index) {
    deps.scalpState.scalpBuilderCurveLattice.points[index].copy(handle.position);
    deps.scalpState.scalpBuilderEditedPoints = deps.scalpState.scalpBuilderCurveLattice.points.map((point) => point.clone());
    updateScalpBuilderCurveLatticeGeometry();
    return;
  }
  const edit = deps.scalpState.activeScalpBuilderCurveLatticeEdit;
  const delta = handle.position.clone().sub(edit.startPoints[index]);
  const selectedSide = Math.sign(edit.startPoints[index].x - edit.centerX);
  edit.startPoints.forEach((startPoint, pointIndex) => {
    const pointSide = Math.sign(startPoint.x - edit.centerX);
    if (deps.sculptState.mirrorXEditing && selectedSide !== 0 && pointSide !== selectedSide) return;
    const weight = scalpBuilderProportionalWeight(edit.distances[pointIndex]);
    deps.scalpState.scalpBuilderCurveLattice.points[pointIndex].copy(startPoint).addScaledVector(delta, weight);
  });
  if (deps.sculptState.mirrorXEditing) {
    edit.startPoints.forEach((startPoint, pointIndex) => {
      const pointSide = Math.sign(startPoint.x - edit.centerX);
      if (selectedSide !== 0 && pointSide !== selectedSide) return;
      const mirrorIndex = edit.mirrorMap[pointIndex];
      if (mirrorIndex === pointIndex) {
        deps.scalpState.scalpBuilderCurveLattice.points[pointIndex].x = edit.centerX;
        return;
      }
      const sourceDelta = deps.scalpState.scalpBuilderCurveLattice.points[pointIndex].clone().sub(startPoint);
      deps.scalpState.scalpBuilderCurveLattice.points[mirrorIndex].copy(edit.startPoints[mirrorIndex]);
      deps.scalpState.scalpBuilderCurveLattice.points[mirrorIndex].add(new THREE.Vector3(-sourceDelta.x, sourceDelta.y, sourceDelta.z));
    });
  }
  deps.scalpState.scalpBuilderCurveLattice.points.forEach((point, pointIndex) => {
    deps.scalpState.scalpBuilderCurveLattice.handles[pointIndex].position.copy(point);
  });
  deps.scalpState.scalpBuilderEditedPoints = deps.scalpState.scalpBuilderCurveLattice.points.map((point) => point.clone());
  updateScalpBuilderHandleColors();
  updateScalpBuilderCurveLatticeGeometry();
}

function scalpBuilderCurveLatticePointHit() {
  if (!deps.scalpState.scalpBuilderEditing || !deps.scalpState.scalpBuilderCurveLattice) return null;
  const selectThroughHead = deps.scalpState.scalpBuilderEditing && deps.scalpBuilderTransparentHeadInput.checked;
  const headHit = !selectThroughHead && deps.guideState.guideModel ? deps.raycaster.intersectObject(deps.guideState.guideModel, true)[0] : null;
  return deps.raycaster.intersectObjects(deps.scalpState.scalpBuilderCurveLattice.handles, false)
    .find((candidate) => !headHit || candidate.distance <= headHit.distance
      + deps.scalpState.scalpBuilderCurveLattice.handleRadius * 0.75) || null;
}

function beginScalpBuilderCurveLatticeSelection() {
  if (!deps.scalpState.scalpBuilderCurveLattice) return false;
  const hit = scalpBuilderCurveLatticePointHit();
  if (!hit) {
    if (deps.transformControls.object?.userData.scalpBuilderLatticeIndex !== undefined) deps.transformControls.detach();
    deps.scalpState.scalpBuilderCurveLattice.selectedIndex = null;
    updateScalpBuilderHandleColors();
    return false;
  }
  selectScalpBuilderCurveLatticePoint(hit.object.userData.scalpBuilderLatticeIndex);
  return true;
}

function prioritizeScalpBuilderPointSelection(event) {
  if (
    !deps.scalpState.scalpBuilderEditing
    || event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
    || deps.sculptState.proportionalSizeEdit
    || deps.sculptState.proportionalHotkeyPress
  ) return;
  deps.rayFromViewportEvent(event);
  const hit = scalpBuilderCurveLatticePointHit();
  if (!hit) return;
  const pointIndex = hit.object.userData.scalpBuilderLatticeIndex;
  if (pointIndex === deps.scalpState.scalpBuilderCurveLattice.selectedIndex) return;
  selectScalpBuilderCurveLatticePoint(pointIndex);
  event.preventDefault();
  event.stopImmediatePropagation();
}

async function createScalpBuilderCurveLattice() {
  disposeScalpBuilderVisuals();
  if (!deps.guideState.guideModel || !(deps.scalpState.scalpBuilderEditing || deps.sculptState.headSetupEditing)) return;
  const loadToken = deps.scalpState.scalpBuilderCurveLatticeLoadToken;
  deps.scalpBuilderStepLabel.textContent = "Curve Lattice";
  deps.scalpBuilderStepName.textContent = "Loading Scalp Guide";
  deps.scalpBuilderAxisLabel.textContent = "Move";
  deps.scalpBuilderInstruction.textContent = "Loading the authored scalp curve lattice...";
  deps.confirmScalpBuilderButton.classList.add("hidden");
  deps.generateScalpBuilderButton.classList.add("hidden");
  try {
    const template = await loadScalpBuilderCurveLatticeTemplate();
    if (!(deps.scalpState.scalpBuilderEditing || deps.sculptState.headSetupEditing) || loadToken !== deps.scalpState.scalpBuilderCurveLatticeLoadToken) return;
    const defaultPoints = scalpBuilderCurveLatticeWorldPoints(template);
    const points = deps.scalpState.scalpBuilderEditedPoints?.length === defaultPoints.length
      ? deps.scalpState.scalpBuilderEditedPoints.map((point) => point.clone())
      : defaultPoints;
    const edges = scalpBuilderCurveLatticeEdges(template.faces);
    const line = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        depthTest: true,
        depthWrite: false
      })
    );
    line.renderOrder = 15;
    line.visible = deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;
    const materialRegions = ["bangs", "side-bangs-left", "side-bangs-right", "side-left", "side-right", "back", "unassigned"];
    const materialIndices = new Map(materialRegions.map((region, index) => [region, index]));
    const surfaceMaterials = materialRegions.map((region) => new THREE.MeshStandardMaterial({
      color: SCALP_REGIONS[region]?.color || SCALP_REGIONS.unassigned.color,
      transparent: true,
      opacity: 0.28,
      roughness: 0.88,
      metalness: 0,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    }));
    const surface = new THREE.Mesh(new THREE.BufferGeometry(), surfaceMaterials);
    surface.renderOrder = 14;
    surface.visible = deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;
    const latticeBounds = new THREE.Box3().setFromPoints(points);
    latticeBounds.getCenter(deps.scalpRoughScalePivot);
    const latticeSize = latticeBounds.getSize(new THREE.Vector3());
    const latticeSpan = Math.max(latticeSize.x, latticeSize.y, latticeSize.z);
    const handleRadius = latticeSpan * 0.008;
    const handleGeometry = new THREE.SphereGeometry(handleRadius, 10, 8);
    const handles = points.map((point, index) => {
      const handle = new THREE.Mesh(
        handleGeometry,
        new THREE.MeshBasicMaterial({
          color: 0x58f6ff,
          transparent: true,
          opacity: 0.42,
          depthTest: true,
          depthWrite: false
        })
      );
      handle.position.copy(point);
      handle.renderOrder = 16;
      handle.userData.scalpBuilderLatticeIndex = index;
      handle.visible = deps.scalpState.scalpBuilderEditing;
      deps.scalpBuilderGroup.add(handle);
      return handle;
    });
    const outline = createScalpSelectionOutline(new THREE.BufferGeometry());
    outline.visible = deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.sculptState.headSetupEditing;
    const symmetryLine = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0xff4fd8,
        transparent: true,
        opacity: 0.9,
        depthTest: true,
        depthWrite: false
      })
    );
    symmetryLine.renderOrder = 20;
    symmetryLine.visible = (
      deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.scalpState.scalpBuilderEditing && deps.sculptState.mirrorXEditing
    );
    const headSymmetryLine = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0xff4fd8,
        transparent: true,
        opacity: 0.9,
        depthTest: true,
        depthWrite: false
      })
    );
    headSymmetryLine.renderOrder = 21;
    headSymmetryLine.visible = (
      deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.scalpState.scalpBuilderEditing && deps.sculptState.mirrorXEditing
    );
    deps.scalpState.scalpBuilderCurveLattice = {
      template,
      points,
      edges,
      line,
      surface,
      outline,
      symmetryLine,
      headSymmetryLine,
      materialIndices,
      handles,
      selectedIndex: null,
      handleRadius,
      displayCenter: latticeBounds.getCenter(new THREE.Vector3()),
      displayOffset: latticeSpan * 0.008
    };
    deps.scalpBuilderGroup.add(surface);
    deps.scalpBuilderGroup.add(line);
    deps.scalpBuilderGroup.add(outline);
    deps.scalpBuilderGroup.add(symmetryLine);
    deps.scalpBuilderGroup.add(headSymmetryLine);
    applyScalpRoughScale();
    updateScalpBuilderCurveLatticeGeometry();
    deps.scalpBuilderStepLabel.textContent = "Curve Lattice";
    deps.scalpBuilderStepName.textContent = "Scalp Curve Guide";
    deps.scalpBuilderAxisLabel.textContent = "Move";
    deps.scalpBuilderInstruction.textContent = "Select a cyan control point and use the gizmo to fine tune the scalp guide. Hold Alt and drag to orbit.";
    deps.updatePlacementStatus();
  } catch (error) {
    console.error("Could not create scalp builder curve lattice", error);
    deps.scalpBuilderStepName.textContent = "Curve Lattice Unavailable";
    deps.scalpBuilderInstruction.textContent = "The authored scalp curve guide could not be loaded.";
  }
}

function clearScalpBuilderTemplateOverlay() {
  while (deps.scalpBuilderTemplateOverlay.children.length) {
    const child = deps.scalpBuilderTemplateOverlay.children.pop();
    child.geometry?.dispose();
    child.material?.dispose();
  }
}

function scalpTemplateNeighbors(vertexCount, faces) {
  const neighbors = Array.from({ length: vertexCount }, () => new Set());
  faces.forEach((face) => {
    face.indices.forEach((index, corner) => {
      const next = face.indices[(corner + 1) % face.indices.length];
      neighbors[index].add(next);
      neighbors[next].add(index);
    });
  });
  return neighbors;
}

function smoothScalpVectorField(values, neighbors, iterations = 2, strength = 0.42) {
  let current = values.map((value) => value.clone());
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    current = current.map((value, index) => {
      if (!neighbors[index].size) return value.clone();
      const average = new THREE.Vector3();
      neighbors[index].forEach((neighbor) => average.add(current[neighbor]));
      average.multiplyScalar(1 / neighbors[index].size);
      return value.clone().lerp(average, strength);
    });
  }
  return current;
}

function displayScalpBuilderConstructionCurves() {
  if (!deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED) {
    disposeScalpBuilderVisuals();
    deps.scalpBuilderGroup.visible = false;
    deps.scalpBuilderTemplateOverlay.visible = false;
    return;
  }
  if (!deps.guideState.guideModel || deps.scalpBuilderPlanePositions.some((value) => !Number.isFinite(value))) return;
  const bounds = deps.guideHeadBounds(deps.guideState.guideModel);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const clearance = Math.max(size.x, size.y, size.z) * 0.015;
  const orderedRange = (a, b) => [Math.min(a, b), Math.max(a, b)];
  const curveRanges = [
    { axis: "z", min: deps.scalpBuilderPlanePositions[5], max: bounds.max.z },
    { axis: "z", ...(() => {
      const [min, max] = orderedRange(deps.scalpBuilderPlanePositions[8], deps.scalpBuilderPlanePositions[6]);
      return { min, max };
    })() },
    { axis: "z", ...(() => {
      const [min, max] = orderedRange(deps.scalpBuilderPlanePositions[9], deps.scalpBuilderPlanePositions[7]);
      return { min, max };
    })() },
    { axis: "z", ...(() => {
      const [min, max] = orderedRange(deps.scalpBuilderPlanePositions[9], deps.scalpBuilderPlanePositions[7]);
      return { min, max };
    })() },
    { axis: "z", min: bounds.min.z, max: deps.scalpBuilderPlanePositions[10] },
    { axis: "y", min: deps.scalpBuilderPlanePositions[0], max: bounds.max.y },
    { axis: "y", min: deps.scalpBuilderPlanePositions[1], max: bounds.max.y },
    { axis: "y", min: deps.scalpBuilderPlanePositions[1], max: bounds.max.y },
    { axis: "y", min: deps.scalpBuilderPlanePositions[1], max: bounds.max.y },
    { axis: "y", min: deps.scalpBuilderPlanePositions[3], max: bounds.max.y },
    { axis: "y", min: deps.scalpBuilderPlanePositions[4], max: bounds.max.y }
  ];
  const clipSegment = (segment, range) => {
    const start = segment[0];
    const end = segment[1];
    const delta = end[range.axis] - start[range.axis];
    let startT = 0;
    let endT = 1;
    if (Math.abs(delta) < 0.000001) {
      return start[range.axis] >= range.min && start[range.axis] <= range.max ? segment : null;
    }
    const minT = (range.min - start[range.axis]) / delta;
    const maxT = (range.max - start[range.axis]) / delta;
    startT = Math.max(startT, Math.min(minT, maxT));
    endT = Math.min(endT, Math.max(minT, maxT));
    if (startT > endT) return null;
    return [start.clone().lerp(end, startT), start.clone().lerp(end, endT)];
  };
  const clippedCurves = deps.SCALP_BUILDER_STEPS.map((step, index) => {
    const sourceSegments = deps.scalpBuilderContours[index]
      || deps.headPlaneIntersectionSegments(step.axis, deps.scalpBuilderPlanePositions[index]);
    return sourceSegments
      .map((segment) => clipSegment(segment, curveRanges[index]))
      .filter(Boolean);
  });
  const liftedPoint = (point, normal = null) => {
    const direction = normal?.clone() || point.clone().sub(center);
    if (direction.lengthSq() < 0.000001) return point.clone();
    return point.clone().addScaledVector(direction.normalize(), clearance);
  };
  const boundaryCorner = (segments, axis, boundary, sideSign) => {
    const candidates = segments.flat().filter((point) => (
      (sideSign < 0 ? point.x <= center.x : point.x >= center.x)
    ));
    return candidates.sort((a, b) => (
      Math.abs(a[axis] - boundary) - Math.abs(b[axis] - boundary)
      || Math.abs(b.x - center.x) - Math.abs(a.x - center.x)
    ))[0]?.clone() || null;
  };
  const surfaceCurveBetween = (start, end) => {
    const meshes = scalpBuilderHeadMeshes();
    const surfaceRaycaster = new THREE.Raycaster();
    const points = [];
    const sampleCount = 28;
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const t = sampleIndex / (sampleCount - 1);
      const target = start.clone().lerp(end, t);
      const direction = target.clone().sub(center);
      if (direction.lengthSq() < 0.000001) continue;
      direction.normalize();
      surfaceRaycaster.set(center, direction);
      const hit = surfaceRaycaster.intersectObjects(meshes, false)[0];
      if (!hit) {
        points.push(liftedPoint(target));
        continue;
      }
      const normal = hit.face?.normal?.clone();
      if (normal && hit.object) normal.transformDirection(hit.object.matrixWorld);
      points.push(liftedPoint(hit.point, normal));
    }
    return points;
  };
  const addSurfaceConnector = (start, end, color) => {
    if (!start || !end) return;
    const points = surfaceCurveBetween(start, end);
    if (points.length < 2) return;
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.98,
      depthTest: true,
      depthWrite: false
    }));
    line.userData.scalpBuilderConstructionCurve = true;
    line.renderOrder = 23;
    deps.scalpBuilderGroup.add(line);
  };
  disposeScalpBuilderVisuals();
  deps.scalpBuilderTemplateOverlay.visible = false;
  deps.SCALP_BUILDER_STEPS.forEach((step, index) => {
    const segments = clippedCurves[index];
    const positions = [];
    segments.forEach((segment) => segment.forEach((point) => {
      const lifted = liftedPoint(point);
      positions.push(lifted.x, lifted.y, lifted.z);
    }));
    if (positions.length < 6) return;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
      color: step.color,
      transparent: true,
      opacity: 0.95,
      depthTest: true,
      depthWrite: false
    }));
    line.userData.scalpBuilderConstructionCurve = true;
    line.renderOrder = 22;
    deps.scalpBuilderGroup.add(line);
  });
  [-1, 1].forEach((sideSign) => {
    const foreheadCorner = boundaryCorner(
      clippedCurves[0],
      "z",
      deps.scalpBuilderPlanePositions[5],
      sideSign
    );
    const sideburnCorner = boundaryCorner(
      clippedCurves[1],
      "z",
      deps.scalpBuilderPlanePositions[6],
      sideSign
    );
    addSurfaceConnector(foreheadCorner, sideburnCorner, SCALP_REGIONS["side-bangs-right"].color);

    const sideHairTopCorner = boundaryCorner(
      clippedCurves[2],
      "z",
      deps.scalpBuilderPlanePositions[7],
      sideSign
    );
    const sideHairBottomCorner = boundaryCorner(
      clippedCurves[3],
      "z",
      deps.scalpBuilderPlanePositions[7],
      sideSign
    );
    addSurfaceConnector(sideHairTopCorner, sideHairBottomCorner, SCALP_REGIONS["side-right"].color);
  });
  const sideContourAtDepth = (depth, bottom, sideSign, sampleCount = 18) => {
    const segments = deps.headPlaneIntersectionSegments("z", depth);
    const endpoints = segments.flat();
    if (!endpoints.length) return [];
    const top = Math.max(...endpoints.map((point) => point.y));
    const floor = Math.min(top - 0.0001, bottom);
    const span = Math.max(0.0001, top - floor);
    const points = [];
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const amount = sampleIndex / (sampleCount - 1);
      const y = THREE.MathUtils.lerp(top, floor, amount);
      const candidates = [];
      segments.forEach(([start, end]) => {
        const minimum = Math.min(start.y, end.y) - span * 0.0001;
        const maximum = Math.max(start.y, end.y) + span * 0.0001;
        if (y < minimum || y > maximum) return;
        const delta = end.y - start.y;
        if (Math.abs(delta) < 0.00001) {
          candidates.push(start.x, end.x);
          return;
        }
        const segmentAmount = THREE.MathUtils.clamp((y - start.y) / delta, 0, 1);
        candidates.push(THREE.MathUtils.lerp(start.x, end.x, segmentAmount));
      });
      const sideCandidates = candidates.filter((x) => sideSign < 0 ? x <= center.x : x >= center.x);
      const x = sampleIndex === 0
        ? center.x - sideSign * size.x * 0.025
        : sideCandidates.length
          ? (sideSign < 0 ? Math.min(...sideCandidates) : Math.max(...sideCandidates))
          : center.x;
      points.push(liftedPoint(new THREE.Vector3(x, y, depth)));
    }
    return points;
  };
  const addSurfacePatch = ({ startDepth, endDepth, startBottom, endBottom, region, sideSign }) => {
    const depthSamples = 14;
    const sideSamples = 18;
    const points = [];
    for (let depthIndex = 0; depthIndex < depthSamples; depthIndex += 1) {
      const amount = depthIndex / (depthSamples - 1);
      const depth = THREE.MathUtils.lerp(startDepth, endDepth, amount);
      const bottom = THREE.MathUtils.lerp(startBottom, endBottom, amount);
      const contour = sideContourAtDepth(depth, bottom, sideSign, sideSamples);
      if (contour.length !== sideSamples) return;
      points.push(...contour);
    }
    const positions = points.flatMap((point) => [point.x, point.y, point.z]);
    const indices = [];
    const wirePositions = [];
    for (let depthIndex = 0; depthIndex < depthSamples - 1; depthIndex += 1) {
      for (let sideIndex = 0; sideIndex < sideSamples - 1; sideIndex += 1) {
        const a = depthIndex * sideSamples + sideIndex;
        const b = a + 1;
        const c = (depthIndex + 1) * sideSamples + sideIndex + 1;
        const d = c - 1;
        indices.push(a, b, c, a, c, d);
      }
    }
    for (let depthIndex = 0; depthIndex < depthSamples; depthIndex += 1) {
      for (let sideIndex = 0; sideIndex < sideSamples - 1; sideIndex += 1) {
        const start = points[depthIndex * sideSamples + sideIndex];
        const end = points[depthIndex * sideSamples + sideIndex + 1];
        wirePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
      }
    }
    for (let sideIndex = 0; sideIndex < sideSamples; sideIndex += 1) {
      for (let depthIndex = 0; depthIndex < depthSamples - 1; depthIndex += 1) {
        const start = points[depthIndex * sideSamples + sideIndex];
        const end = points[(depthIndex + 1) * sideSamples + sideIndex];
        wirePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
      }
    }
    const color = SCALP_REGIONS[region]?.color || SCALP_REGIONS.unassigned.color;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const surface = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.16,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide
    }));
    surface.userData.scalpBuilderConstructionSurface = true;
    surface.renderOrder = 18;
    const wireGeometry = new THREE.BufferGeometry();
    wireGeometry.setAttribute("position", new THREE.Float32BufferAttribute(wirePositions, 3));
    const wire = new THREE.LineSegments(wireGeometry, new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.24,
      depthTest: true,
      depthWrite: false
    }));
    wire.userData.scalpBuilderConstructionSurface = true;
    wire.renderOrder = 19;
    deps.scalpBuilderGroup.add(surface, wire);
  };
  const depthInset = size.z * 0.002;
  const frontHairlinePoints = clippedCurves[0].flat();
  const backHairlinePoints = clippedCurves[4].flat();
  const frontDepth = Math.max(...frontHairlinePoints.map((point) => point.z)) - depthInset;
  const backDepth = Math.min(...backHairlinePoints.map((point) => point.z)) + depthInset;
  const surfaceBands = [
    { startDepth: frontDepth, endDepth: deps.scalpBuilderPlanePositions[5], startBottom: deps.scalpBuilderPlanePositions[0], endBottom: deps.scalpBuilderPlanePositions[0], region: "bangs" },
    { startDepth: deps.scalpBuilderPlanePositions[5], endDepth: deps.scalpBuilderPlanePositions[6], startBottom: deps.scalpBuilderPlanePositions[0], endBottom: deps.scalpBuilderPlanePositions[1], region: "side-bangs" },
    { startDepth: deps.scalpBuilderPlanePositions[6], endDepth: deps.scalpBuilderPlanePositions[7], startBottom: deps.scalpBuilderPlanePositions[1], endBottom: deps.scalpBuilderPlanePositions[1], region: "side-bangs" },
    { startDepth: deps.scalpBuilderPlanePositions[7], endDepth: deps.scalpBuilderPlanePositions[8], startBottom: deps.scalpBuilderPlanePositions[1], endBottom: deps.scalpBuilderPlanePositions[1], region: "side-bangs" },
    { startDepth: deps.scalpBuilderPlanePositions[8], endDepth: deps.scalpBuilderPlanePositions[9], startBottom: deps.scalpBuilderPlanePositions[3], endBottom: deps.scalpBuilderPlanePositions[3], region: "side" },
    { startDepth: deps.scalpBuilderPlanePositions[9], endDepth: deps.scalpBuilderPlanePositions[10], startBottom: deps.scalpBuilderPlanePositions[3], endBottom: deps.scalpBuilderPlanePositions[4], region: "side" },
    { startDepth: deps.scalpBuilderPlanePositions[10], endDepth: backDepth, startBottom: deps.scalpBuilderPlanePositions[4], endBottom: deps.scalpBuilderPlanePositions[4], region: "back" }
  ];
  const addCenterBridgePatch = (band) => {
    const depthSamples = 14;
    const widthSamples = 5;
    const bridgeContourIndex = 10;
    const bridgeMeshes = scalpBuilderHeadMeshes();
    const bridgeRaycaster = new THREE.Raycaster();
    const bridgeRayDistance = Math.max(size.x, size.y, size.z) * 1.8;
    const bridgeRows = [];
    for (let depthIndex = 0; depthIndex < depthSamples; depthIndex += 1) {
      const amount = depthIndex / (depthSamples - 1);
      const depth = THREE.MathUtils.lerp(band.startDepth, band.endDepth, amount);
      const bottom = THREE.MathUtils.lerp(band.startBottom, band.endBottom, amount);
      const left = sideContourAtDepth(depth, bottom, -1, 18);
      const right = sideContourAtDepth(depth, bottom, 1, 18);
      if (left.length <= bridgeContourIndex || right.length <= bridgeContourIndex) continue;
      const row = [];
      for (let widthIndex = 0; widthIndex < widthSamples; widthIndex += 1) {
        const target = left[bridgeContourIndex].clone().lerp(
          right[bridgeContourIndex],
          widthIndex / (widthSamples - 1)
        );
        const direction = target.clone().sub(center);
        if (direction.lengthSq() < 0.000001) {
          row.push(target);
          continue;
        }
        direction.normalize();
        bridgeRaycaster.set(
          center.clone().addScaledVector(direction, bridgeRayDistance),
          direction.clone().negate()
        );
        const hit = bridgeRaycaster.intersectObjects(bridgeMeshes, false)[0];
        if (!hit) {
          row.push(target);
          continue;
        }
        const normal = hit.face?.normal?.clone();
        if (normal && hit.object) normal.transformDirection(hit.object.matrixWorld);
        row.push(liftedPoint(hit.point, normal));
      }
      bridgeRows.push(row);
    }
    if (bridgeRows.length < 2) return;
    const points = bridgeRows.flat();
    const rowCount = bridgeRows.length;
    const indices = [];
    const wirePositions = [];
    for (let depthIndex = 0; depthIndex < rowCount - 1; depthIndex += 1) {
      for (let widthIndex = 0; widthIndex < widthSamples - 1; widthIndex += 1) {
        const a = depthIndex * widthSamples + widthIndex;
        const b = a + 1;
        const c = (depthIndex + 1) * widthSamples + widthIndex + 1;
        const d = c - 1;
        indices.push(a, b, c, a, c, d);
        const horizontalStart = points[a];
        const horizontalEnd = points[b];
        const verticalEnd = points[d];
        wirePositions.push(
          horizontalStart.x, horizontalStart.y, horizontalStart.z,
          horizontalEnd.x, horizontalEnd.y, horizontalEnd.z,
          horizontalStart.x, horizontalStart.y, horizontalStart.z,
          verticalEnd.x, verticalEnd.y, verticalEnd.z
        );
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points.flatMap((point) => [point.x, point.y, point.z]), 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const color = SCALP_REGIONS.bangs.color;
    const surface = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.16,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide
    }));
    const wireGeometry = new THREE.BufferGeometry();
    wireGeometry.setAttribute("position", new THREE.Float32BufferAttribute(wirePositions, 3));
    const wire = new THREE.LineSegments(wireGeometry, new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.24,
      depthTest: false,
      depthWrite: false
    }));
    surface.userData.scalpBuilderConstructionSurface = true;
    wire.userData.scalpBuilderConstructionSurface = true;
    surface.renderOrder = 18;
    wire.renderOrder = 19;
    deps.scalpBuilderGroup.add(surface, wire);
  };
  surfaceBands.forEach((band) => [-1, 1].forEach((sideSign) => {
    let region = band.region;
    if (region === "side-bangs") region = sideSign < 0 ? "side-bangs-left" : "side-bangs-right";
    if (region === "side") region = sideSign < 0 ? "side-left" : "side-right";
    addSurfacePatch({ ...band, region, sideSign });
  }));
  addCenterBridgePatch(surfaceBands[0]);
  deps.scalpBuilderGroup.visible = true;
  deps.scalpBuilderInstruction.textContent = "Construction surfaces generated from the curve network. Orbit around the head and inspect the patch flow before building final topology.";
  deps.scalpBuilderStepLabel.textContent = "Curve Preview";
  deps.scalpBuilderStepName.textContent = "Curve Surface Preview";
  deps.generateScalpBuilderButton.textContent = "Regenerate Preview";
  deps.updatePlacementStatus();
}

function keepScalpShellOutsideHead(points, faces, shellCenter, headSize, clearance) {
  const meshes = deps.headMeshes().filter((mesh) => !deps.GUIDE_BOUNDS_EXCLUDED_GROUPS.has(mesh.name));
  if (!meshes.length) return points.map((point) => point.clone());
  const raycaster = new THREE.Raycaster();
  const rayDistance = Math.max(headSize.x, headSize.y, headSize.z) * 1.8;
  const directions = [];
  const requiredOffsets = points.map((point) => {
    const direction = point.clone().sub(shellCenter);
    if (direction.lengthSq() < 0.000001) direction.set(0, 1, 0);
    direction.normalize();
    directions.push(direction);
    raycaster.set(
      shellCenter.clone().addScaledVector(direction, rayDistance),
      direction.clone().negate()
    );
    const hit = raycaster.intersectObjects(meshes, false)[0];
    if (!hit) return 0;
    const surfaceDistance = hit.point.distanceTo(shellCenter);
    const pointDistance = point.distanceTo(shellCenter);
    return Math.max(0, surfaceDistance + clearance - pointDistance);
  });
  const neighbors = scalpTemplateNeighbors(points.length, faces);
  let smoothedOffsets = requiredOffsets.slice();
  for (let iteration = 0; iteration < 4; iteration += 1) {
    smoothedOffsets = smoothedOffsets.map((offset, index) => {
      if (!neighbors[index].size) return offset;
      let average = 0;
      neighbors[index].forEach((neighbor) => { average += smoothedOffsets[neighbor]; });
      average /= neighbors[index].size;
      return Math.max(requiredOffsets[index], THREE.MathUtils.lerp(offset, average, 0.48));
    });
  }
  return points.map((point, index) => point.clone().addScaledVector(directions[index], smoothedOffsets[index]));
}

async function rebuildScalpBuilderTemplateOverlay() {
  clearScalpBuilderTemplateOverlay();
  if (
    !deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED
    || !deps.guideState.guideModel
    || !deps.scalpState.scalpBuilderEditing
    || !deps.scalpBuilderShowTemplateInput.checked
  ) {
    deps.scalpBuilderTemplateOverlay.visible = false;
    return;
  }
  try {
    const template = await loadScalpTopologyTemplate();
    if (!deps.scalpState.scalpBuilderEditing || !deps.scalpBuilderShowTemplateInput.checked) return;
    deps.guideState.guideModel.updateMatrixWorld(true);
    const templateBounds = new THREE.Box3().setFromPoints(template.vertices);
    const templateCenter = templateBounds.getCenter(new THREE.Vector3());
    const templateSize = templateBounds.getSize(new THREE.Vector3());
    const headBounds = deps.guideHeadBounds(deps.guideState.guideModel);
    const headCenter = headBounds.getCenter(new THREE.Vector3());
    const headSize = headBounds.getSize(new THREE.Vector3());
    const useAuthoredCoordinates = !deps.head.state.importedHeadAsset;
    const mappedPoints = template.vertices.map((vertex) => {
      if (useAuthoredCoordinates) return vertex.clone().applyMatrix4(deps.guideState.guideModel.matrixWorld);
      return new THREE.Vector3(
        headCenter.x + ((vertex.x - templateCenter.x) / Math.max(0.0001, templateSize.x * 0.5)) * headSize.x * 0.51,
        THREE.MathUtils.lerp(
          headBounds.min.y + headSize.y * 0.38,
          headBounds.max.y,
          (vertex.y - templateBounds.min.y) / Math.max(0.0001, templateSize.y)
        ),
        headCenter.z + ((vertex.z - templateCenter.z) / Math.max(0.0001, templateSize.z * 0.5)) * headSize.z * 0.51
      );
    });
    const shellClearance = Math.max(headSize.x, headSize.y, headSize.z) * 0.003;
    const worldPoints = keepScalpShellOutsideHead(
      mappedPoints,
      template.faces,
      headCenter,
      headSize,
      shellClearance
    );
    const positions = [];
    const colors = [];
    const wirePositions = [];
    const color = new THREE.Color();
    template.faces.forEach((face) => {
      color.set(SCALP_REGIONS[face.region]?.color || SCALP_REGIONS.unassigned.color);
      [[0, 1, 2], [0, 2, 3]].forEach((corners) => corners.forEach((corner) => {
        const point = worldPoints[face.indices[corner]];
        positions.push(point.x, point.y, point.z);
        colors.push(color.r, color.g, color.b);
      }));
      for (let edge = 0; edge < 4; edge += 1) {
        const start = worldPoints[face.indices[edge]];
        const end = worldPoints[face.indices[(edge + 1) % 4]];
        wirePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
      }
    });
    const surfaceGeometry = new THREE.BufferGeometry();
    surfaceGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    surfaceGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    surfaceGeometry.computeVertexNormals();
    const surface = new THREE.Mesh(surfaceGeometry, new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.24,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide
    }));
    surface.renderOrder = 12;
    const wireGeometry = new THREE.BufferGeometry();
    wireGeometry.setAttribute("position", new THREE.Float32BufferAttribute(wirePositions, 3));
    const wire = new THREE.LineSegments(wireGeometry, new THREE.LineBasicMaterial({
      color: 0x78f3f7,
      transparent: true,
      opacity: 0.58,
      depthTest: true,
      depthWrite: false
    }));
    wire.renderOrder = 13;
    deps.scalpBuilderTemplateOverlay.add(surface, wire);
    deps.scalpBuilderTemplateOverlay.visible = true;
  } catch (error) {
    console.error("Could not display scalp topology reference", error);
    deps.scalpBuilderTemplateOverlay.visible = false;
  }
}

function generatedScalpObjContent(points, faces) {
  const lines = ["# Anime Hair Studio generated scalp guide"];
  points.forEach((point) => lines.push(`v ${point.x} ${point.y} ${point.z}`));
  let activeRegion = "";
  faces.forEach((face) => {
    if (face.region !== activeRegion) {
      activeRegion = face.region;
      lines.push(`usemtl ${activeRegion}`);
    }
    lines.push(`f ${face.indices.map((index) => index + 1).join(" ")}`);
  });
  return `${lines.join("\n")}\n`;
}

async function generateScalpFromBuilder() {
  if (!deps.guideState.guideModel || deps.scalpBuilderPlanePositions.some((value) => !Number.isFinite(value))) return;
  deps.generateScalpBuilderButton.disabled = true;
  deps.generateScalpBuilderButton.textContent = "Generating...";
  try {
    const template = await loadScalpTopologyTemplate();
    deps.pushUndoState();
    const bounds = deps.guideHeadBounds(deps.guideState.guideModel);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const templateBounds = new THREE.Box3().setFromPoints(template.vertices);
    const templateCenter = templateBounds.getCenter(new THREE.Vector3());
    const templateSize = templateBounds.getSize(new THREE.Vector3());
    const bottomByRegion = {
      bangs: deps.scalpBuilderPlanePositions[0],
      "side-bangs-left": deps.scalpBuilderPlanePositions[1],
      "side-bangs-right": deps.scalpBuilderPlanePositions[1],
      "side-left": deps.scalpBuilderPlanePositions[3],
      "side-right": deps.scalpBuilderPlanePositions[3],
      back: deps.scalpBuilderPlanePositions[4],
      unassigned: Math.min(...deps.scalpBuilderPlanePositions.slice(0, 5))
    };
    const incidentRegions = Array.from({ length: template.vertices.length }, () => new Set());
    const sourceBottomByRegion = {};
    const sourceDepthByRegion = {};
    template.faces.forEach((face) => face.indices.forEach((index) => {
      incidentRegions[index].add(face.region);
      sourceBottomByRegion[face.region] = Math.min(
        sourceBottomByRegion[face.region] ?? Infinity,
        template.vertices[index].y
      );
      const depth = sourceDepthByRegion[face.region] || { min: Infinity, max: -Infinity };
      depth.min = Math.min(depth.min, template.vertices[index].z);
      depth.max = Math.max(depth.max, template.vertices[index].z);
      sourceDepthByRegion[face.region] = depth;
    }));
    const orderedDepthRange = (a, b) => ({ min: Math.min(a, b), max: Math.max(a, b) });
    const targetDepthByRegion = {
      bangs: orderedDepthRange(deps.scalpBuilderPlanePositions[5], bounds.max.z),
      "side-bangs-left": orderedDepthRange(deps.scalpBuilderPlanePositions[8], deps.scalpBuilderPlanePositions[6]),
      "side-bangs-right": orderedDepthRange(deps.scalpBuilderPlanePositions[8], deps.scalpBuilderPlanePositions[6]),
      "side-left": orderedDepthRange(deps.scalpBuilderPlanePositions[9], deps.scalpBuilderPlanePositions[7]),
      "side-right": orderedDepthRange(deps.scalpBuilderPlanePositions[9], deps.scalpBuilderPlanePositions[7]),
      back: orderedDepthRange(bounds.min.z, deps.scalpBuilderPlanePositions[10]),
      unassigned: orderedDepthRange(bounds.min.z, bounds.max.z)
    };
    const shellClearance = Math.max(size.x, size.y, size.z) * 0.003;
    deps.guideState.guideModel.updateMatrixWorld(true);
    deps.scalpSurfaceGroup.updateMatrixWorld(true);
    const inset = size.z * 0.018;
    const targetStations = [
      { position: bounds.min.z + inset, segments: deps.headPlaneIntersectionSegments("z", bounds.min.z + inset) },
      ...deps.scalpBuilderPlanePositions.slice(5).map((position, index) => ({
        position,
        segments: deps.scalpBuilderContours[index + 5] || deps.headPlaneIntersectionSegments("z", position)
      })),
      { position: bounds.max.z - inset, segments: deps.headPlaneIntersectionSegments("z", bounds.max.z - inset) }
    ].sort((a, b) => a.position - b.position)
      .filter((station, index, stations) => index === 0 || Math.abs(station.position - stations[index - 1].position) > 0.0001);
    const targetCurves = targetStations
      .map((station) => deps.upperContourCurve(station.segments, "z", station.position))
      .filter(Boolean);
    if (targetCurves.length < 3) throw new Error("Not enough valid intersection curves to loft the scalp.");
    const sourceCurves = targetCurves.map((curve) => {
      const normalizedDepth = THREE.MathUtils.clamp(
        (curve.position - bounds.min.z) / Math.max(0.0001, size.z),
        0,
        1
      );
      const sourcePosition = THREE.MathUtils.lerp(templateBounds.min.z, templateBounds.max.z, normalizedDepth);
      return deps.upperContourCurve(
        deps.templatePlaneIntersectionSegments(template, "z", sourcePosition),
        "z",
        sourcePosition
      );
    }).filter(Boolean);
    if (sourceCurves.length !== targetCurves.length) {
      throw new Error("The scalp topology template could not be matched to the intersection curves.");
    }
    const curveFittedWorld = template.vertices.map((vertex, index) => {
      const regions = [...incidentRegions[index]];
      const fittedZ = regions.reduce((sum, region) => {
        const sourceDepth = sourceDepthByRegion[region] || { min: templateBounds.min.z, max: templateBounds.max.z };
        const targetDepth = targetDepthByRegion[region] || targetDepthByRegion.unassigned;
        const amount = THREE.MathUtils.clamp(
          (vertex.z - sourceDepth.min) / Math.max(0.0001, sourceDepth.max - sourceDepth.min),
          0,
          1
        );
        return sum + THREE.MathUtils.lerp(targetDepth.min, targetDepth.max, amount);
      }, 0) / Math.max(1, regions.length);
      const sourceSection = deps.curveNetworkSection(sourceCurves, vertex.z);
      const sourceAmount = THREE.MathUtils.clamp(
        (vertex.x - sourceSection[0].x) / Math.max(0.0001, sourceSection.at(-1).x - sourceSection[0].x),
        0,
        1
      );
      const sourceSurfacePoint = deps.pointAlongSection(sourceSection, sourceAmount);
      const targetSection = deps.curveNetworkSection(targetCurves, fittedZ);
      const targetSurfacePoint = deps.pointAlongSection(targetSection, sourceAmount);
      let surfaceWeight = 0;
      const fittedY = regions.reduce((sum, region) => {
        const sourceBottom = sourceBottomByRegion[region] ?? templateBounds.min.y;
        const amount = THREE.MathUtils.clamp(
          (vertex.y - sourceBottom) / Math.max(0.0001, sourceSurfacePoint.y - sourceBottom),
          0,
          1
        );
        surfaceWeight += amount;
        return sum + THREE.MathUtils.lerp(
          bottomByRegion[region] ?? bottomByRegion.unassigned,
          targetSurfacePoint.y,
          amount
        );
      }, 0) / Math.max(1, regions.length);
      surfaceWeight /= Math.max(1, regions.length);
      const point = new THREE.Vector3(targetSurfacePoint.x, fittedY, fittedZ);
      const outward = targetSurfacePoint.clone().sub(center);
      if (outward.lengthSq() > 0.000001) {
        point.addScaledVector(outward.normalize(), shellClearance * surfaceWeight);
      }
      return point;
    });
    const projectedWorld = curveFittedWorld;
    const projectedLocal = projectedWorld.map((point) => deps.scalpSurfaceGroup.worldToLocal(point.clone()));
    const positions = [];
    const regions = [];
    const quadWirePositions = [];
    template.faces.forEach((face) => {
      [[0, 1, 2], [0, 2, 3]].forEach((corners) => {
        corners.forEach((corner) => {
          const point = projectedLocal[face.indices[corner]];
          positions.push(point.x, point.y, point.z);
        });
        regions.push(face.region);
      });
      for (let edge = 0; edge < 4; edge += 1) {
        const start = projectedLocal[face.indices[edge]];
        const end = projectedLocal[face.indices[(edge + 1) % 4]];
        quadWirePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.userData.quadWirePositions = quadWirePositions;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const content = generatedScalpObjContent(projectedLocal, template.faces);
    installCustomScalpGeometry(geometry, regions, { name: "generated-scalp.obj", content });
    deps.scalpState.importedScalpGuideAsset.preserveCoordinates = true;
    deps.scalpState.importedScalpGuideAsset.quadWirePositions = [...quadWirePositions];
    setScalpBuilderEditing(false);
    setScalpShapeEditing(true);
    setScalpGuideVisibility(true);
    deps.updatePlacementStatus();
  } catch (error) {
    console.error("Could not generate scalp guide", error);
    window.alert("The fitted scalp guide could not be generated. Please check the scalp topology template.");
  } finally {
    deps.generateScalpBuilderButton.disabled = false;
    deps.generateScalpBuilderButton.textContent = "Generate Scalp Guide";
  }
}

function resetScalpBuilder() {
  if (deps.scalpState.scalpBuilderEditing && (deps.scalpState.scalpBuilderCurveLattice || deps.scalpState.scalpBuilderEditedPoints)) deps.pushUndoState();
  deps.scalpState.scalpBuilderEditedPoints = null;
  deps.scalpState.activeScalpBuilderCurveLatticeEdit = null;
  deps.scalpState.scalpBuilderStep = 0;
  deps.scalpState.scalpBuilderStroke = null;
  deps.scalpBuilderPlanePositions.fill(null);
  deps.scalpBuilderContours.fill(null);
  deps.generateScalpBuilderButton.textContent = "Generate Surface Preview";
  if (deps.scalpState.scalpBuilderEditing) createScalpBuilderCurveLattice();
  else updateScalpBuilderStepUi();
  deps.updatePlacementStatus();
  deps.updateInteractionLocks();
}

function confirmScalpBuilderPlane() {
  if (!deps.scalpState.scalpBuilderEditing || !deps.scalpState.scalpBuilderPlane) return;
  const step = deps.SCALP_BUILDER_STEPS[deps.scalpState.scalpBuilderStep];
  deps.scalpBuilderPlanePositions[deps.scalpState.scalpBuilderStep] = deps.scalpState.scalpBuilderPlane.position[step.axis];
  deps.scalpBuilderContours[deps.scalpState.scalpBuilderStep] = deps.headPlaneIntersectionSegments(
    step.axis,
    deps.scalpState.scalpBuilderPlane.position[step.axis]
  );
  deps.transformControls.detach();
  deps.scalpState.scalpBuilderStep += 1;
  createScalpBuilderPlanes();
  deps.updatePlacementStatus();
}

function beginScalpBuilderInput() { return beginScalpBuilderCurveLatticeSelection(); }

function updateScalpBuilderStroke() {}

function finishScalpBuilderStroke() {}

function setScalpBuilderEditing(enabled) {
  if (enabled && deps.sculptState.viewportEditMode !== "guide") deps.setViewportEditMode("guide");
  if (enabled) deps.deselectStrandsForGuideEditor();
  if (enabled && deps.scalpState.scalpShapeEditing) setScalpShapeEditing(false);
  if (enabled && deps.scalpState.scalpPaintEditing) setScalpPaintEditing(false);
  if (enabled && deps.sculptState.headSetupEditing) deps.sculptState.headSetupEditing = false;
  deps.scalpState.scalpBuilderEditing = Boolean(enabled);
  deps.scalpBuilderGroup.visible = deps.scalpState.scalpBuilderEditing;
  if (enabled) {
    if (["rotate", "scale"].includes(deps.sel.activeTool)) deps.setActiveTool("select");
    deps.setMirrorXEditing(true);
    setScalpGuideVisibility(true);
    createScalpBuilderCurveLattice();
    deps.scalpBuilderTemplateOverlay.visible = false;
  } else {
    if (
      deps.transformControls.object?.userData.scalpBuilderPlane
      || deps.transformControls.object?.userData.scalpBuilderLatticeIndex !== undefined
    ) deps.transformControls.detach();
    disposeScalpBuilderVisuals();
    deps.scalpBuilderGroup.visible = false;
    deps.scalpBuilderTemplateOverlay.visible = false;
    deps.configureTransformControls(deps.sel.activeTool);
  }
  deps.setHeadReferenceTransparency(
    deps.scalpState.scalpBuilderEditing && deps.scalpBuilderTransparentHeadInput.checked,
    0.18
  );
  updateScalpEditingVisibility();
  deps.updateAttributeEditorMode();
  deps.updatePlacementStatus();
  if (deps.sel.activeOutlinerTab === "guides") deps.renderGuideOutliner();
}

function updateScalpEditingVisibility() {
  const isolateHeadAndScalpEditors = deps.scalpState.scalpBuilderEditing || deps.sculptState.headSetupEditing;
  deps.hairGroup.visible = !isolateHeadAndScalpEditors;
  deps.curveGroup.visible = !isolateHeadAndScalpEditors;
  deps.guideSurfaceGroup.visible = !isolateHeadAndScalpEditors;
  deps.scalpSurfaceGroup.visible = deps.scalpState.scalpGuideVisible;
  const usingCustomGuide = deps.scalpState.scalpGuideSource === "custom" && Boolean(deps.scalpState.customScalpSurfaceMesh);
  const usingEditedGuide = !usingCustomGuide && Boolean(deps.scalpState.editedScalpSurfaceMesh);
  deps.scalpSurfaceMesh.visible = !usingCustomGuide && !usingEditedGuide;
  deps.scalpSurfaceWire.visible = !usingCustomGuide && !usingEditedGuide;
  deps.scalpSelectionOutline.visible = !usingCustomGuide && !usingEditedGuide && deps.sculptState.headSetupEditing;
  if (deps.scalpState.editedScalpSurfaceMesh) deps.scalpState.editedScalpSurfaceMesh.visible = usingEditedGuide;
  if (deps.scalpState.editedScalpSurfaceWire) deps.scalpState.editedScalpSurfaceWire.visible = usingEditedGuide;
  if (deps.scalpState.editedScalpSelectionOutline) deps.scalpState.editedScalpSelectionOutline.visible = usingEditedGuide && deps.sculptState.headSetupEditing;
  if (deps.scalpState.customScalpSurfaceMesh) deps.scalpState.customScalpSurfaceMesh.visible = usingCustomGuide;
  if (deps.scalpState.customScalpSurfaceWire) deps.scalpState.customScalpSurfaceWire.visible = usingCustomGuide;
  if (deps.scalpState.customScalpSelectionOutline) deps.scalpState.customScalpSelectionOutline.visible = usingCustomGuide && deps.sculptState.headSetupEditing;
  deps.scalpPanel.classList.toggle("hidden", !deps.scalpState.scalpShapeEditing || deps.scalpState.scalpPaintEditing);
  deps.scalpPaintPanel.classList.toggle("hidden", !deps.scalpState.scalpPaintEditing);
  deps.headPanel.classList.toggle("hidden", !deps.sculptState.headSetupEditing);
  deps.scalpBuilderPanel.classList.toggle("hidden", !deps.scalpState.scalpBuilderEditing);
  const setupActive = deps.scalpState.scalpShapeEditing || deps.scalpState.scalpPaintEditing || deps.sculptState.headSetupEditing || deps.scalpState.scalpBuilderEditing || deps.sculptState.capsuleGuideEditing;
  const setupEditorName = deps.scalpState.scalpPaintEditing
    ? "Scalp Painting"
    : deps.sculptState.headSetupEditing
      ? "Edit Head"
      : deps.scalpState.scalpBuilderEditing
        ? "Edit Scalp"
        : deps.sculptState.capsuleGuideEditing
          ? "Capsule Guide"
        : deps.scalpState.scalpShapeEditing
          ? "Scalp Guide"
          : "Editor";
  deps.exitSetupEditor.classList.toggle("hidden", !setupActive);
  deps.exitSetupEditorLabel.textContent = `Exit ${setupEditorName}`;
  deps.modeToolButtons.forEach((button) => {
    const tool = button.dataset.tool;
    const usefulInScalpEditor = deps.scalpState.scalpBuilderEditing
      ? ["select", "move"].includes(tool)
      : deps.sculptState.capsuleGuideEditing && ["select", "move", "rotate", "scale"].includes(tool);
    button.classList.toggle("setup-tool-hidden", setupActive && !usefulInScalpEditor);
  });
  deps.updateViewportToolVisibility();
  const scalpTransformEditing = deps.scalpState.scalpBuilderEditing || deps.sculptState.capsuleGuideEditing;
  deps.mirrorXToggle.classList.toggle("setup-mode-hidden", setupActive && !deps.scalpState.scalpBuilderEditing);
  deps.proportionalToggle.classList.toggle("setup-mode-hidden", setupActive && !scalpTransformEditing);
  deps.spaceToggle.classList.toggle("setup-mode-hidden", setupActive);
  deps.hierarchyToggle.classList.toggle("setup-mode-hidden", setupActive);
  deps.scalpSetupToggle.classList.toggle("active", setupActive);
  deps.scalpPaintToggle.classList.toggle("active", deps.scalpState.scalpPaintEditing);
  deps.headSetupMode.classList.toggle("active", deps.sculptState.headSetupEditing);
  deps.scalpBuilderMode.classList.toggle("active", deps.scalpState.scalpBuilderEditing);
  deps.drawCapsuleGuideMode.classList.toggle("active", deps.sculptState.viewportEditMode === "guide" && deps.sel.activeTool === "draw-capsule-guide");
  deps.capsuleGuideMode.classList.toggle("active", deps.sculptState.capsuleGuideEditing);
  deps.scalpBuilderGroup.visible = deps.scalpState.scalpBuilderEditing;
  if (deps.scalpState.scalpBuilderCurveLattice) {
    deps.scalpState.scalpBuilderCurveLattice.surface.visible = deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;
    deps.scalpState.scalpBuilderCurveLattice.line.visible = deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;
    deps.scalpState.scalpBuilderCurveLattice.outline.visible = (
      deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.sculptState.headSetupEditing
    );
    deps.scalpState.scalpBuilderCurveLattice.symmetryLine.visible = (
      deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.scalpState.scalpBuilderEditing && deps.sculptState.mirrorXEditing
    );
    deps.scalpState.scalpBuilderCurveLattice.headSymmetryLine.visible = (
      deps.SCALP_REGION_CURVE_VISUALIZATION_ENABLED && deps.scalpState.scalpBuilderEditing && deps.sculptState.mirrorXEditing
    );
    deps.scalpState.scalpBuilderCurveLattice.handles.forEach((handle) => {
      handle.visible = deps.scalpState.scalpBuilderEditing;
    });
  }
  deps.scalpLatticeGroup.visible = deps.scalpState.scalpShapeEditing && deps.scalpState.scalpLatticeEditing;
  const surfaceOpacity = deps.scalpState.scalpPaintEditing
      ? 0.46
      : ["place", "draw", "procedural-draw", "braid", "panel"].includes(deps.sel.activeTool)
        ? 0.28
        : 0.12;
  const activeMesh = activeScalpSurfaceMesh();
  const activeWire = activeScalpSurfaceWire();
  const activeOutline = activeScalpSelectionOutline();
  const showScalp = deps.scalpState.scalpGuideVisible || deps.sculptState.headSetupEditing;
  activeMesh.material.opacity = showScalp ? surfaceOpacity : 0;
  activeWire.material.opacity = showScalp ? (deps.scalpState.scalpPaintEditing ? 0.12 : 0.14) : 0;
  activeOutline.material.uniforms.outlineOpacity.value = deps.sculptState.headSetupEditing ? 0.96 : 0;
  activeMesh.material.depthTest = true;
  activeWire.material.depthTest = true;
  activeMesh.renderOrder = deps.sculptState.headSetupEditing ? 19 : deps.scalpSurfaceMesh.renderOrder;
  activeMesh.material.needsUpdate = true;
  activeWire.material.needsUpdate = true;
  activeOutline.material.needsUpdate = true;
  deps.syncViewportDrawSettings();
  deps.pinActiveToolSettingsPanel();
}

function setScalpSetupMenuOpen(open) {
  deps.setAppMenuOpen(deps.scalpSetupToggle, deps.scalpSetupMenu, open);
}

function createScalpGuideOutlinerRow() {
  const row = document.createElement("div");
  row.className = "guide-outliner-row";
  const visibility = deps.createOutlinerVisibilityToggle({
    visible: deps.scalpState.scalpGuideVisible,
    label: "Scalp Guide",
    onToggle: () => setScalpGuideVisibility(!deps.scalpState.scalpGuideVisible)
  });
  const item = document.createElement("button");
  item.className = `guide-outliner-item${deps.scalpState.scalpBuilderEditing ? " active" : ""}`;
  item.type = "button";
  item.title = "Scalp Guide";
  item.setAttribute("aria-pressed", String(deps.scalpState.scalpBuilderEditing));
  const icon = document.createElement("span");
  icon.className = "guide-outliner-icon scalp-guide";
  const name = document.createElement("span");
  name.className = "guide-outliner-name";
  name.textContent = "Scalp Guide";
  const kind = document.createElement("span");
  kind.className = "guide-outliner-kind";
  kind.textContent = "Surface";
  item.append(icon, name, kind);
  item.addEventListener("click", () => {
    deps.setViewportEditMode("guide");
    deps.deselectStrands();
    setScalpGuideVisibility(true);
    deps.updateAttributeEditorMode();
  });
  item.addEventListener("contextmenu", (event) => deps.showOutlinerContextMenu(event, {
    type: "scalp-guide"
  }));
  row.append(visibility, item);
  return row;
}

function activeToolUsesScalpGuide(tool = deps.sel.activeTool) {
  if (tool === "place") return true;
  if (tool === "draw-capsule-guide") return deps.activeStrokeSurfaceValue() !== "contextual-plane";
  if (tool === "curve-surface") return deps.activeStrokeSurfaceValue() !== "contextual-plane";
  if (["draw", "procedural-draw", "braid", "panel", "surface-loft"].includes(tool)) return deps.activeStrokeSurfaceValue() !== "contextual-plane";
  if (tool === "poly") return deps.activeStrokeSurfaceValue() !== "contextual-plane";
  return deps.scalpState.scalpShapeEditing || deps.scalpState.scalpPaintEditing;
}

function toolAutoShowsScalpGuide(tool = deps.sel.activeTool) {
  if (tool === "place") return deps.placeAutoShowScalpInput.checked;
  if (tool === "draw-capsule-guide") return deps.drawAutoShowScalpInput.checked;
  if (["draw", "procedural-draw", "poly", "curve-surface"].includes(tool)) return deps.drawAutoShowScalpInput.checked;
  if (tool === "braid") return deps.braidAutoShowScalpInput.checked;
  if (tool === "panel") return deps.panelAutoShowScalpInput.checked;
  if (["surface-loft", "curve-surface"].includes(tool)) return deps.drawAutoShowScalpInput.checked;
  return deps.scalpState.scalpShapeEditing || deps.scalpState.scalpPaintEditing;
}

function autoShowScalpGuideForActiveTool() {
  if (activeToolUsesScalpGuide() && toolAutoShowsScalpGuide()) {
    setScalpGuideVisibility(true);
  }
}

function setScalpGuideVisibility(visible) {
  deps.scalpState.scalpGuideVisible = Boolean(visible);
  deps.updateGuideViewToggle();
  deps.syncDisplayVisibilityInputs();
  updateScalpEditingVisibility();
  if (deps.sel.activeOutlinerTab === "guides") deps.renderGuideOutliner();
}

function setScalpLatticeEditing(enabled) {
  if (enabled && !deps.scalpState.scalpShapeEditing) setScalpShapeEditing(true);
  deps.scalpState.scalpLatticeEditing = enabled && deps.scalpState.scalpShapeEditing;
  deps.advancedLatticeButton.classList.toggle("active", deps.scalpState.scalpLatticeEditing);
  deps.advancedLatticeButton.setAttribute("aria-pressed", String(deps.scalpState.scalpLatticeEditing));
  deps.advancedLatticeButton.textContent = deps.scalpState.scalpLatticeEditing ? "Close advanced lattice" : "Advanced lattice";
  if (!enabled && deps.transformControls.object?.userData.scalpLatticeIndex !== undefined) {
    deps.transformControls.detach();
    deps.scalpState.selectedScalpLatticeIndex = null;
  }
  if (!enabled) endScalpLatticeDrag();
  updateScalpEditingVisibility();
  deps.updatePlacementStatus();
}

function setScalpShapeEditing(enabled) {
  if (enabled) deps.deselectStrandsForGuideEditor();
  if (enabled && deps.scalpState.scalpBuilderEditing) setScalpBuilderEditing(false);
  if (enabled && deps.scalpState.scalpPaintEditing) setScalpPaintEditing(false);
  if (enabled && deps.sculptState.headSetupEditing) deps.sculptState.headSetupEditing = false;
  if (enabled && deps.sel.selectedStrandGroup) {
    deps.sel.selectedStrandGroup = null;
    deps.updateAttributeEditorMode();
    deps.renderLockList();
  }
  deps.scalpState.scalpShapeEditing = enabled;
  if (enabled) setScalpGuideVisibility(true);
  if (!enabled) setScalpLatticeEditing(false);
  deps.setHeadReferenceTransparency(enabled);
  updateScalpEditingVisibility();
  deps.updatePlacementStatus();
}

function setScalpPaintEditing(enabled) {
  if (enabled) deps.deselectStrandsForGuideEditor();
  if (enabled && deps.scalpState.scalpBuilderEditing) setScalpBuilderEditing(false);
  if (enabled && deps.scalpState.scalpShapeEditing) setScalpShapeEditing(false);
  if (enabled && deps.sculptState.headSetupEditing) deps.sculptState.headSetupEditing = false;
  if (enabled && deps.sel.selectedStrandGroup) {
    deps.sel.selectedStrandGroup = null;
    deps.updateAttributeEditorMode();
    deps.renderLockList();
  }
  deps.scalpState.scalpPaintEditing = enabled;
  if (enabled) setScalpGuideVisibility(true);
  deps.scalpPaintToggle.classList.toggle("active", enabled);
  deps.scalpPaintToggle.setAttribute("aria-pressed", String(enabled));
  deps.scalpPaintToggle.title = enabled ? "Close scalp region paint" : "Paint scalp regions";
  if (!enabled) {
    endScalpPaint();
    deps.scalpBrushCursor.visible = false;
  }
  deps.setHeadReferenceTransparency(deps.scalpState.scalpShapeEditing);
  updateScalpEditingVisibility();
  deps.updatePlacementStatus();
}

function scalpRegionSurfaceSamples(region) {
  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  const position = deps.scalpSurfaceGeometry.getAttribute("position");
  const normal = deps.scalpSurfaceGeometry.getAttribute("normal");
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(deps.scalpSurfaceGroup.matrixWorld);
  return deps.scalpState.scalpVisibleQuads
    .filter((quad) => deps.scalpState.scalpRegionAssignments[quad.id] === region)
    .map((quad) => {
      const point = new THREE.Vector3();
      const surfaceNormal = new THREE.Vector3();
      quad.vertices.forEach((vertexIndex) => {
        point.x += position.getX(vertexIndex);
        point.y += position.getY(vertexIndex);
        point.z += position.getZ(vertexIndex);
        surfaceNormal.x += normal.getX(vertexIndex);
        surfaceNormal.y += normal.getY(vertexIndex);
        surfaceNormal.z += normal.getZ(vertexIndex);
      });
      point.multiplyScalar(0.25).applyMatrix4(deps.scalpSurfaceGroup.matrixWorld);
      surfaceNormal.multiplyScalar(0.25).applyMatrix3(normalMatrix).normalize();
      return { point, normal: surfaceNormal, face: quad.face };
    });
}

function curveLatticePointsForScalpRegion(region, columns = 3, rows = 3) {
  const samples = scalpRegionSurfaceSamples(region);
  if (!samples.length) return deps.defaultCurveLatticePoints(columns, rows);
  const sideRegion = region.includes("side-");
  const topFaceSamples = sideRegion ? samples.filter((sample) => sample.face === "top") : [];
  const horizontalValue = (sample) => sideRegion ? sample.point.z : sample.point.x;
  const horizontalValues = samples.map(horizontalValue);
  const verticalValues = samples.map((sample) => sample.point.y);
  const horizontalMin = Math.min(...horizontalValues);
  const horizontalMax = Math.max(...horizontalValues);
  const verticalMin = Math.min(...verticalValues);
  const verticalMax = Math.max(...verticalValues);
  const horizontalRange = Math.max(0.001, horizontalMax - horizontalMin);
  const verticalRange = Math.max(0.001, verticalMax - verticalMin);
  const points = [];

  const blendedSample = (candidates, targetHorizontal, targetY) => {
    const nearest = candidates.map((sample) => {
      const du = (horizontalValue(sample) - targetHorizontal) / horizontalRange;
      const dv = (sample.point.y - targetY) / verticalRange;
      return { sample, distance: du * du + dv * dv };
    }).sort((a, b) => a.distance - b.distance).slice(0, Math.min(6, candidates.length));
    const point = new THREE.Vector3();
    const normal = new THREE.Vector3();
    let totalWeight = 0;
    nearest.forEach(({ sample, distance }) => {
      const weight = 1 / Math.pow(distance + 0.025, 2);
      point.addScaledVector(sample.point, weight);
      normal.addScaledVector(sample.normal, weight);
      totalWeight += weight;
    });
    point.divideScalar(Math.max(1e-6, totalWeight));
    normal.normalize();
    return point.addScaledVector(normal, 0.075);
  };

  for (let row = 0; row < rows; row += 1) {
    const v = rows === 1 ? 0.5 : row / (rows - 1);
    const targetY = THREE.MathUtils.lerp(verticalMax, verticalMin, v);
    for (let column = 0; column < columns; column += 1) {
      const u = columns === 1 ? 0.5 : THREE.MathUtils.lerp(0.04, 0.96, column / (columns - 1));
      const targetHorizontal = THREE.MathUtils.lerp(horizontalMin, horizontalMax, u);
      const candidates = row === 0 && topFaceSamples.length ? topFaceSamples : samples;
      points.push(blendedSample(candidates, targetHorizontal, targetY));
    }
  }
  return points;
}

function scalpFittedCapsuleSpec() {
  const scalp = activeScalpSurfaceMesh();
  scalp.updateWorldMatrix(true, false);
  const bounds = new THREE.Box3().setFromObject(scalp);
  if (bounds.isEmpty()) return null;
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const radialClearance = 1.14;
  const lengthClearance = 1.16;
  center.y -= size.y * 0.04;
  const radius = Math.max(0.04, Math.max(size.x, size.z) * 0.5 * radialClearance);
  const length = Math.max(radius * 2, size.y * lengthClearance);
  return {
    start: center.clone().add(new THREE.Vector3(0, length * 0.5, 0)),
    end: center.clone().add(new THREE.Vector3(0, -length * 0.5, 0)),
    radius,
    length
  };
}

function createScalpFittedCapsuleGuide() {
  const fit = scalpFittedCapsuleSpec();
  if (!fit) return null;
  deps.pushUndoState();
  const guide = deps.addCapsuleGuide({ ...deps.surfaceGuideDefaults, ...fit });
  deps.surfaceGuideDefaults.radius = fit.radius;
  deps.surfaceGuideDefaults.length = fit.length;
  deps.syncGuideInputs(guide);
  return guide;
}

function mirroredScalpRegion(region) {
  return ({
    "side-bangs-left": "side-bangs-right",
    "side-bangs-right": "side-bangs-left",
    "side-left": "side-right",
    "side-right": "side-left"
  })[region] || region || "unassigned";
}

function scalpTriangleRegion(mesh, triangleIndex) {
  if (mesh === deps.scalpState.customScalpSurfaceMesh) {
    return deps.scalpState.customScalpRegions[triangleIndex] || "unassigned";
  }
  if (mesh === deps.scalpState.editedScalpSurfaceMesh) {
    return deps.scalpState.editedScalpRegions[triangleIndex]
      || mesh.geometry.userData.triangleRegions?.[triangleIndex]
      || "unassigned";
  }
  const quadId = mesh.geometry.userData.triangleQuadIds?.[triangleIndex];
  return deps.scalpState.scalpRegionAssignments[quadId] || "unassigned";
}

function closestPointOnActiveScalp(worldPoint, preferredRegion = null) {
  const mesh = activeScalpSurfaceMesh();
  const geometry = mesh?.geometry;
  const position = geometry?.getAttribute("position");
  if (!mesh || !position) return null;

  mesh.updateMatrixWorld(true);
  geometry.computeBoundingBox();
  const inverseMatrix = mesh.matrixWorld.clone().invert();
  const localPoint = worldPoint.clone().applyMatrix4(inverseMatrix);
  const index = geometry.getIndex();
  const triangle = new THREE.Triangle();
  const closest = new THREE.Vector3();
  const bestPoint = new THREE.Vector3();
  const bestNormal = new THREE.Vector3();
  const bestBarycentric = new THREE.Vector3();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  let bestDistanceSq = Infinity;
  let bestTriangleIndex = -1;
  let bestTriangleVertices = null;
  const triangleCount = index ? index.count / 3 : position.count / 3;

  for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
    if (preferredRegion && scalpTriangleRegion(mesh, triangleIndex) !== preferredRegion) continue;
    const offset = triangleIndex * 3;
    const ia = index ? index.getX(offset) : offset;
    const ib = index ? index.getX(offset + 1) : offset + 1;
    const ic = index ? index.getX(offset + 2) : offset + 2;
    a.fromBufferAttribute(position, ia);
    b.fromBufferAttribute(position, ib);
    c.fromBufferAttribute(position, ic);
    triangle.set(a, b, c);
    triangle.closestPointToPoint(localPoint, closest);
    const distanceSq = closest.distanceToSquared(localPoint);
    if (distanceSq >= bestDistanceSq) continue;
    bestDistanceSq = distanceSq;
    bestPoint.copy(closest);
    triangle.getNormal(bestNormal);
    triangle.getBarycoord(closest, bestBarycentric);
    bestTriangleIndex = triangleIndex;
    bestTriangleVertices = [ia, ib, ic];
  }

  if (!Number.isFinite(bestDistanceSq) && preferredRegion) {
    return closestPointOnActiveScalp(worldPoint);
  }
  if (!Number.isFinite(bestDistanceSq)) return null;
  const point = bestPoint.applyMatrix4(mesh.matrixWorld);
  const normal = bestNormal.applyMatrix3(new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)).normalize();
  const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
  if (normal.dot(point.clone().sub(center)) < 0) normal.negate();
  const uv = geometry.getAttribute("uv");
  let regionPosition = null;
  if (uv && bestTriangleVertices) {
    const [ia, ib, ic] = bestTriangleVertices;
    regionPosition = {
      u: uv.getX(ia) * bestBarycentric.x + uv.getX(ib) * bestBarycentric.y + uv.getX(ic) * bestBarycentric.z,
      v: uv.getY(ia) * bestBarycentric.x + uv.getY(ib) * bestBarycentric.y + uv.getY(ic) * bestBarycentric.z
    };
  }
  return {
    point,
    normal,
    center,
    triangleIndex: bestTriangleIndex,
    barycentric: bestBarycentric.clone(),
    regionPosition
  };
}

function refreshLoadedRootAttachmentsOnAuthoredScalp() {
  deps.locks.forEach((lock) => {
    if (lock.rootAttachmentEnabled === false || !lock.points?.length) return;
    const sourcePoint = lock.rootSurfacePoint?.clone() || lock.points[0].clone();
    lock.rootAttachment = deps.createRootAttachment(lock, sourcePoint);
    if (!lock.rootAttachment) return;
    lock.rootSurfacePoint = lock.rootAttachment.surfacePoint.clone();
    lock.rootSurfaceNormal = lock.rootAttachment.normal.clone();
    deps.syncRootAttachmentMetadata(lock);
  });
}

function remapLegacyPresetToActiveScalp() {
  if (!deps.locks.length) return;
  const scalpCenter = new THREE.Box3().setFromObject(activeScalpSurfaceMesh()).getCenter(new THREE.Vector3());

  deps.locks.forEach((lock) => {
    if (lock.rootAttachmentEnabled === false) return;
    const oldSurfacePoint = lock.rootSurfacePoint?.clone() || lock.points?.[0]?.clone();
    if (!oldSurfacePoint || !lock.points?.length) return;
    const attachment = closestPointOnActiveScalp(oldSurfacePoint, lock.scalpRegion || null);
    if (!attachment) return;

    const oldNormal = lock.rootSurfaceNormal?.clone()?.normalize()
      || oldSurfacePoint.clone().sub(scalpCenter).normalize();
    if (oldNormal.dot(oldSurfacePoint.clone().sub(scalpCenter)) < 0) oldNormal.negate();
    const rotation = new THREE.Quaternion().setFromUnitVectors(oldNormal, attachment.normal);
    const remapPoint = (point) => point.sub(oldSurfacePoint).applyQuaternion(rotation).add(attachment.point);
    const remapVector = (vector) => vector.applyQuaternion(rotation).normalize();

    lock.points.forEach(remapPoint);
    lock.clumpRestPoints?.forEach(remapPoint);
    lock.clumpGuideRestPoints?.forEach(remapPoint);
    lock.groupLatticeBasePoints?.forEach(remapPoint);
    lock.pointSurfaceNormals?.forEach((normal) => {
      if (normal) remapVector(normal);
    });
    if (lock.placementFrame) {
      if (lock.placementFrame.root) remapPoint(lock.placementFrame.root);
      if (lock.placementFrame.normal) remapVector(lock.placementFrame.normal);
      if (lock.placementFrame.flow) remapVector(lock.placementFrame.flow);
      if (lock.placementFrame.side) remapVector(lock.placementFrame.side);
    }
    lock.rootSurfacePoint = attachment.point.clone();
    lock.rootSurfaceNormal = attachment.normal.clone();
    lock.rootAttachment = deps.createRootAttachment(lock);
    lock.x = lock.points[0].x;
    lock.y = lock.points[0].y;
    lock.z = lock.points[0].z;
    deps.updateLockGeometry(lock);
    deps.updateCurveObjects(lock, { visible: lock.id === deps.sel.selectedId });
  });
  deps.renderLockList();
  deps.updateCount();
}

async function importScalpGuideMeshFile(file) {
  try {
    const content = await file.text();
    const model = new OBJLoader().parse(content);
    installCustomScalpGuide(model, {
      name: file.name || "custom-scalp.obj",
      content
    });
  } catch (error) {
    console.error("Could not import scalp guide OBJ", error);
    window.alert("That OBJ could not be imported as a scalp guide. Please check that it contains valid polygon geometry.");
    setScalpGuideSource("default");
  } finally {
    deps.scalpGuideMeshFileInput.value = "";
  }
}

function restoreAuthoredScalpForStateRestore(state, { preservePlacement = false } = {}) {
  if (!preservePlacement) {
    deps.scalpState.scalpBuilderEditedPoints = state.scalpBuilderEditedPoints?.map(deps.dataToVector) || null;
    if (deps.scalpState.scalpBuilderCurveLattice && deps.scalpState.scalpBuilderEditedPoints?.length === deps.scalpState.scalpBuilderCurveLattice.points.length) {
      deps.scalpState.scalpBuilderEditedPoints.forEach((point, index) => {
        deps.scalpState.scalpBuilderCurveLattice.points[index].copy(point);
        deps.scalpState.scalpBuilderCurveLattice.handles[index].position.copy(point);
      });
      updateScalpBuilderCurveLatticeGeometry();
      updateScalpBuilderHandleColors();
    }
  }
  if (!preservePlacement) {
    Object.assign(deps.headTransform, {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      uniformScale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1
    }, state.headTransform || {});
    deps.syncHeadTransformInputs();
    deps.applyHeadTransform();
    Object.assign(deps.scalpRoughScale, { x: 1, y: 1, z: 1 }, state.scalpRoughScale || {});
    syncScalpRoughScaleInputs();
    applyScalpRoughScale();
    ensureEditedScalpSurface().then(() => {
      if (state.editedScalpRegions?.length === deps.scalpState.editedScalpRegions.length) {
        deps.scalpState.editedScalpRegions = [...state.editedScalpRegions];
        writeEditedScalpRegionColors();
      }
      // Project points are already authored world-space data. Refresh attachment
      // metadata on the rebuilt scalp without reconstructing or moving the curves.
      refreshLoadedRootAttachmentsOnAuthoredScalp();
    }).catch((error) => console.error("Could not restore the authored scalp surface", error));
    if (state.scalpSurface) Object.assign(deps.scalpSurface, state.scalpSurface);
    // Scalp Conform 拟合椭球（全局，第五版）：与 scalpSurface 同一条路径——旧存档没有这个字段
    // 时 Object.assign 的第二个参数缺失，不覆盖当前值（等价于回退到 PANEL_SCALP_CONFORM_DEFAULTS，
    // 因为 deps.scalpConformFit 在 app.js 里就是拿那份默认值初始化的）。
    if (state.scalpConformFit) Object.assign(deps.scalpConformFit, state.scalpConformFit);
    if (state.scalpArtistShape) Object.assign(deps.scalpArtistShape, state.scalpArtistShape);
  }
  if (state.strandGroupDefaults) {
    Object.entries(state.strandGroupDefaults).forEach(([region, defaults]) => {
      if (!deps.strandGroupDefaults[region]) return;
      Object.assign(deps.strandGroupDefaults[region], defaults, {
        layerOffsets: { ...DEFAULT_LAYER_OFFSETS, ...defaults.layerOffsets },
        taperCurve: normalizeTaperCurve(defaults.taperCurve, defaults),
        depthCurve: normalizeTaperCurve(defaults.depthCurve, defaults),
        taperCurveSecondary: normalizeTaperCurve(defaults.taperCurveSecondary || defaults.taperCurve, defaults),
        depthCurveSecondary: normalizeTaperCurve(defaults.depthCurveSecondary || defaults.depthCurve, defaults),
        asymmetricWidthCurve: Boolean(defaults.asymmetricWidthCurve),
        asymmetricDepthCurve: Boolean(defaults.asymmetricDepthCurve),
        centerAsymmetricProfile: Boolean(defaults.centerAsymmetricProfile),
        sweepProfile: (defaults.sweepProfile || DEFAULT_SWEEP_PROFILE).map((point) => ({ ...point }))
      });
    });
  }
  if (!preservePlacement) {
    if (state.scalpLatticePoints?.length === deps.scalpLatticePoints.length) {
      state.scalpLatticePoints.forEach((point, index) => deps.scalpLatticePoints[index].copy(deps.dataToVector(point)));
    }
    if (state.scalpRegionAssignments?.length === deps.scalpState.scalpRegionAssignments.length) {
      deps.scalpState.scalpRegionAssignments = [...state.scalpRegionAssignments];
      deps.scalpState.scalpManualRegionQuads = new Set(state.scalpManualRegionQuads || []);
    }
    syncScalpInputs();
    syncScalpConformFitInputs();
    syncScalpArtistInputs();
    updateScalpTopology();
    if (state.customScalpRegions?.length === deps.scalpState.customScalpRegions.length) {
      deps.scalpState.customScalpRegions = [...state.customScalpRegions];
      writeCustomScalpRegionColors();
    }
    setScalpGuideSource(state.scalpGuideSource || "default");
    updateScalpSurface();
    applyScalpLatticeDeformation();
    updateScalpLatticeObjects();
  }
}

function sampleScalpQuad(face, columnRatio, rowRatio) {
  const candidates = deps.scalpState.scalpVisibleQuads.filter((quad) => quad.face === face);
  if (!candidates.length) return null;
  const targetColumn = THREE.MathUtils.clamp(columnRatio, 0, 1) * (deps.SCALP_SEGMENTS - 1);
  const targetRow = THREE.MathUtils.clamp(rowRatio, 0, 1) * (deps.SCALP_SEGMENTS - 1);
  const quad = candidates.reduce((best, candidate) => {
    const distance = Math.hypot(candidate.column - targetColumn, candidate.row - targetRow);
    return !best || distance < best.distance ? { quad: candidate, distance } : best;
  }, null).quad;

  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  const position = deps.scalpSurfaceGeometry.getAttribute("position");
  const corners = quad.vertices.map((index) => new THREE.Vector3().fromBufferAttribute(position, index));
  const localPoint = corners.reduce((sum, corner) => sum.add(corner), new THREE.Vector3()).multiplyScalar(0.25);
  const localNormal = corners[1].clone().sub(corners[0]).cross(corners[2].clone().sub(corners[0])).normalize();
  if (localNormal.dot(localPoint) < 0) localNormal.negate();
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(deps.scalpSurfaceGroup.matrixWorld);
  return {
    point: deps.scalpSurfaceGroup.localToWorld(localPoint),
    normal: localNormal.applyMatrix3(normalMatrix).normalize(),
    region: deps.scalpState.scalpRegionAssignments[quad.id] || "unassigned"
  };
}

function scalpRegionAtHit(hit) {
  if (hit?.faceIndex === undefined) return "unassigned";
  if (hit.object === deps.scalpState.customScalpSurfaceMesh) {
    return deps.scalpState.customScalpRegions[hit.faceIndex] || "unassigned";
  }
  if (hit.object === deps.scalpState.editedScalpSurfaceMesh) {
    return deps.scalpState.editedScalpRegions[hit.faceIndex] || "unassigned";
  }
  const quadId = hit.object.geometry.userData.triangleQuadIds?.[hit.faceIndex];
  return deps.scalpState.scalpRegionAssignments[quadId] || "unassigned";
}

function scalpRegionNearestWorldPoint(worldPoint) {
  if (!worldPoint) return "unassigned";
  const sample = closestPointOnActiveScalp(worldPoint);
  if (!sample || sample.triangleIndex < 0) return "unassigned";
  return scalpTriangleRegion(activeScalpSurfaceMesh(), sample.triangleIndex);
}

function activeStrokeScalpOffset() {
  if (deps.braidStrokeActive()) return Number(deps.braidScalpOffsetInput.value);
  if (deps.panelStrokeActive()) return Number(deps.panelScalpOffsetInput.value);
  return Number(deps.drawStrandScalpOffsetInput.value);
}

function drawScalpRegionAtEvent(event, surfaceHit) {
  if (deps.activeStrokeSurfaceValue() === "contextual-plane") return "unassigned";
  const strandSurface = deps.liveSurfaceStrand();
  if (strandSurface && surfaceHit?.object === strandSurface.mesh) {
    return strandSurface.scalpRegion || "unassigned";
  }
  const surfaceGuide = deps.liveSurfaceGuide();
  if (
    surfaceGuide
    && [surfaceGuide.mesh, surfaceGuide.rootMesh].includes(surfaceHit?.object)
  ) {
    return scalpRegionNearestWorldPoint(surfaceHit.point);
  }
  if (surfaceHit?.object === activeScalpSurfaceMesh()) return scalpRegionAtHit(surfaceHit);
  const curveLatticeId = surfaceHit?.object?.userData?.curveLatticeGuideId;
  if (curveLatticeId) {
    return scalpRegionNearestWorldPoint(surfaceHit.point);
  }
  deps.rayFromViewportEvent(event);
  const scalpHit = deps.raycaster.intersectObject(activeScalpSurfaceMesh(), false)[0];
  return scalpHit ? scalpRegionAtHit(scalpHit) : "unassigned";
}

  return {
    createAuthoredScalpGeometry,
    buildDefaultScalpRegionAssignments,
    updateScalpRenderGeometry,
    writeScalpRegionColors,
    applyDefaultScalpRegionAssignments,
    createScalpSelectionOutline,
    activeScalpSurfaceMesh,
    activeScalpSurfaceWire,
    activeScalpSelectionOutline,
    inferredCustomScalpRegion,
    writeCustomScalpRegionColors,
    customScalpGeometryFromObject,
    customScalpWireGeometry,
    installCustomScalpGeometry,
    installCustomScalpGuide,
    setScalpGuideSource,
    updateScalpQuadWire,
    updateScalpTopology,
    fullBodyScalpFocusBounds,
    syncScalpRoughScaleInputs,
    applyScalpRoughScale,
    realignFullBodyGuideToScalpTop,
    syncScalpInputs,
    syncScalpConformFitInputs,
    syncScalpArtistInputs,
    rootScalpOffsetDistance,
    applyLockRootScalpOffset,
    scalpArtistWeight,
    scalpArtistScalesAt,
    applyScalpArtistShape,
    inverseScalpArtistShape,
    updateScalpSurface,
    setActiveScalpRegion,
    clearScalpRegions,
    scalpHitFromEvent,
    updateScalpBrushCursor,
    paintScalpAt,
    beginScalpPaint,
    updateScalpPaint,
    endScalpPaint,
    createScalpLattice,
    resetScalpLattice,
    updateScalpLatticeObjects,
    applyScalpLatticeDeformation,
    updateScalpLatticeFromHandle,
    selectScalpLatticePoint,
    beginScalpLatticeDrag,
    updateScalpLatticeDrag,
    endScalpLatticeDrag,
    disposeScalpBuilderVisuals,
    updateScalpBuilderPositionReadout,
    scalpBuilderHeadMeshes,
    scalpBuilderIntersectionPositions,
    rebuildScalpBuilderIntersection,
    createScalpBuilderPlaneVisual,
    createScalpBuilderPlanes,
    updateScalpBuilderStepUi,
    parseScalpTopologyTemplate,
    loadScalpTopologyTemplate,
    loadScalpBuilderCurveLatticeTemplate,
    scalpBuilderCurveLatticeWorldPoints,
    scalpBuilderCurveLatticeEdges,
    subdivideScalpBuilderCage,
    scalpBuilderSurfaceGeometry,
    writeEditedScalpRegionColors,
    syncEditedScalpSurface,
    ensureEditedScalpSurface,
    updateScalpBuilderCurveLatticeGeometry,
    scalpBuilderLatticeNeighbors,
    scalpBuilderLatticeDistances,
    scalpBuilderProportionalWeight,
    scalpBuilderMirrorMap,
    beginScalpBuilderCurveLatticeEdit,
    commitScalpBuilderCurveLatticeEdit,
    updateScalpBuilderHandleColors,
    selectScalpBuilderCurveLatticePoint,
    updateScalpBuilderCurveLatticeFromHandle,
    scalpBuilderCurveLatticePointHit,
    beginScalpBuilderCurveLatticeSelection,
    prioritizeScalpBuilderPointSelection,
    createScalpBuilderCurveLattice,
    clearScalpBuilderTemplateOverlay,
    scalpTemplateNeighbors,
    smoothScalpVectorField,
    displayScalpBuilderConstructionCurves,
    keepScalpShellOutsideHead,
    rebuildScalpBuilderTemplateOverlay,
    generatedScalpObjContent,
    generateScalpFromBuilder,
    resetScalpBuilder,
    confirmScalpBuilderPlane,
    beginScalpBuilderInput,
    updateScalpBuilderStroke,
    finishScalpBuilderStroke,
    setScalpBuilderEditing,
    updateScalpEditingVisibility,
    setScalpSetupMenuOpen,
    createScalpGuideOutlinerRow,
    activeToolUsesScalpGuide,
    toolAutoShowsScalpGuide,
    autoShowScalpGuideForActiveTool,
    setScalpGuideVisibility,
    setScalpLatticeEditing,
    setScalpShapeEditing,
    setScalpPaintEditing,
    scalpRegionSurfaceSamples,
    curveLatticePointsForScalpRegion,
    scalpFittedCapsuleSpec,
    createScalpFittedCapsuleGuide,
    mirroredScalpRegion,
    scalpTriangleRegion,
    closestPointOnActiveScalp,
    refreshLoadedRootAttachmentsOnAuthoredScalp,
    remapLegacyPresetToActiveScalp,
    importScalpGuideMeshFile,
    restoreAuthoredScalpForStateRestore,
    sampleScalpQuad,
    scalpRegionAtHit,
    scalpRegionNearestWorldPoint,
    activeStrokeScalpOffset,
    drawScalpRegionAtEvent,
  };
}