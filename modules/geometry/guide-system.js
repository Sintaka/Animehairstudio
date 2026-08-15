// guide-system.js - curve / guide subsystem (refactor 3d batch 5).
// Extracted from app.js; coupling injected via createGuideSystemApi(deps).
import * as THREE from "three";
import { CURVE_LATTICE_FEATURE_ENABLED, GROUP_CURVE_FEATURE_ENABLED, SCALP_REGIONS, STRAND_GROUPS } from "../core/app-config.js?v=20260815-3";
import { curveLatticeLoopPointIndices, DEFAULT_CURVE_LATTICE_PLANE, flatCurveLatticePointData, resampleCurveLatticeLineData, resampleCurveLatticePointData } from "./curve-lattice.js?v=20260814-12";
import { curveDeformedCapsulePoints, polylineLength, sampleCapsuleRadialProfile } from "./capsule-curve.js?v=20260814-12";


export function createGuideSystemApi(deps) {
  // deps: store state proxies (guideState/sel/sculptState/scalpState) + shared objects (guides/locks/
  // guideSurfaceGroup/scalpSurfaceGroup/transformControls/camera/pointer/raycaster/capsuleGuideLoopHandle/
  // renderer) + DOM elements + app.js helper functions; full list: devlog/in-progress/curve-guide-refactor-map.md section 5.

function guideHeadBounds(model) {
  const box = new THREE.Box3();
  model.updateMatrixWorld(true);
  model.traverse((child) => {
    if (!child.isMesh || deps.GUIDE_BOUNDS_EXCLUDED_GROUPS.has(child.name)) return;
    box.expandByObject(child);
  });
  return box.isEmpty() ? new THREE.Box3().setFromObject(model) : box;
}

function setCapsuleGuideEditing(enabled) {
  if (enabled && deps.sculptState.viewportEditMode !== "guide") deps.setViewportEditMode("guide");
  if (enabled) deps.deselectStrandsForGuideEditor();
  deps.sculptState.capsuleGuideEditing = Boolean(enabled);
  if (deps.sculptState.capsuleGuideEditing) {
    deps.setActiveTool("select");
  } else {
    deps.sculptState.capsuleGuideLoopDrag = null;
    deps.sculptState.capsuleGuideLoopSelection = null;
    deps.guideState.activeCapsuleGuideLoopTransform = null;
    setCapsuleGuideLoopHover(null);
    deps.renderer.domElement.style.cursor = "";
    if (
      deps.transformControls.object?.userData.capsuleGuidePointIndex !== undefined
      || deps.transformControls.object?.userData.capsuleGuideLoopHandle
    ) deps.transformControls.detach();
  }
  deps.guides.filter((guide) => guide.type === "capsule").forEach((guide) => {
    const visible = deps.sculptState.capsuleGuideEditing && guide.id === deps.sel.selectedGuideId;
    if (guide.handlesGroup) guide.handlesGroup.visible = visible;
    if (guide.loopLinesGroup) guide.loopLinesGroup.visible = visible;
  });
  deps.updateScalpEditingVisibility();
  deps.updateAttributeEditorMode();
  deps.updatePlacementStatus();
  applyCapsuleGuideDisplayVisibility();
}

function outlinerGuides() {
  return deps.guides.filter((guide) => (
    guide.type !== "curve-lattice"
    || (CURVE_LATTICE_FEATURE_ENABLED && guide.standalone)
  ));
}

function guideOutlinerLabel(guide, index) {
  if (guide.name) return guide.name;
  if (guide.type === "capsule") return `Capsule Guide ${index + 1}`;
  if (guide.type === "curve-lattice") {
    const region = deps.strandRegionDisplayLabel(guide.scalpRegion) || guide.scalpRegion || "Group";
    return guide.standalone ? "Curve Lattice Guide" : `${region} Curve Lattice`;
  }
  return guide.name || `Curve Guide ${index + 1}`;
}

function renderGuideOutliner() {
  deps.guideOutliner.replaceChildren();
  deps.guideOutliner.appendChild(deps.createScalpGuideOutlinerRow());
  const visibleGuides = outlinerGuides();
  visibleGuides.forEach((guide, index) => {
    const label = guideOutlinerLabel(guide, index);
    const row = document.createElement("div");
    row.className = "guide-outliner-row";
    const visible = guide.outlinerVisible !== false
      && (guide.type !== "capsule" || deps.guideState.capsuleGuidesVisible);
    const visibility = deps.createOutlinerVisibilityToggle({
      visible,
      label,
      onToggle: () => {
        deps.pushUndoState();
        guide.outlinerVisible = !visible;
        if (guide.outlinerVisible && guide.type === "capsule") deps.guideState.capsuleGuidesVisible = true;
        deps.applyDisplayVisibilityFilters();
        renderGuideOutliner();
      }
    });
    const item = document.createElement("button");
    item.className = `guide-outliner-item${guide.id === deps.sel.selectedGuideId ? " active" : ""}`;
    item.type = "button";
    item.title = label;
    item.setAttribute("aria-pressed", String(guide.id === deps.sel.selectedGuideId));
    const icon = document.createElement("span");
    icon.className = `guide-outliner-icon${guide.type === "capsule" ? "" : guide.type === "curve-lattice" ? " lattice-guide" : " curve-guide"}`;
    if (guide.type === "capsule") icon.style.background = normalizeCapsuleGuideColor(guide.color);
    const name = document.createElement("span");
    name.className = "guide-outliner-name";
    name.textContent = label;
    const kind = document.createElement("span");
    kind.className = "guide-outliner-kind";
    kind.textContent = guide.type === "capsule" ? "Surface" : guide.type === "curve-lattice" ? "Lattice" : "Curve";
    item.append(icon, name, kind);
    item.addEventListener("click", (event) => deps.handleOutlinerRenameClick(event, {
      label: name,
      value: label,
      onSelect: () => selectGuide(guide.id),
      onCommit: (nextName) => {
        guide.name = nextName;
        if (guide.type === "capsule" && guide.id === deps.sel.selectedGuideId) {
          deps.surfaceGuideNameInput.value = nextName;
        }
        deps.refreshLiveSurfaceOptions();
      },
      rerender: renderGuideOutliner
    }));
    item.addEventListener("contextmenu", (event) => deps.showOutlinerContextMenu(event, {
      type: "guide",
      guideId: guide.id
    }));
    row.append(visibility, item);
    deps.guideOutliner.appendChild(row);
  });
}

function currentGuideViewMode() {
  return deps.GUIDE_VIEW_MODES.find((mode) => (
    mode.scalp === deps.scalpState.scalpGuideVisible
    && mode.capsules === deps.guideState.capsuleGuidesVisible
    && mode.lattices === deps.guideState.curveLatticeGuidesVisible
  )) || null;
}

function updateGuideViewToggle() {
  const mode = currentGuideViewMode();
  const label = mode?.label || "Custom Guide View";
  const anyVisible = deps.scalpState.scalpGuideVisible || deps.guideState.capsuleGuidesVisible || deps.guideState.curveLatticeGuidesVisible;
  deps.scalpGuideVisibilityToggle.classList.toggle("active", anyVisible);
  deps.scalpGuideVisibilityToggle.setAttribute("aria-pressed", String(anyVisible));
  deps.scalpGuideVisibilityToggle.dataset.guideViewMode = mode?.id || "custom";
  deps.scalpGuideVisibilityToggle.title = `Guide view: ${label}. Click to cycle; right-click to choose`;
  deps.scalpGuideVisibilityToggle.setAttribute("aria-label", deps.scalpGuideVisibilityToggle.title);
  deps.guideViewModeActions.forEach((button) => {
    const active = button.dataset.guideViewMode === mode?.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-checked", String(active));
  });
}

function setGuideViewMode(modeId) {
  const mode = deps.GUIDE_VIEW_MODES.find((item) => item.id === modeId) || deps.GUIDE_VIEW_MODES[0];
  deps.guideState.capsuleGuidesVisible = mode.capsules;
  deps.guideState.curveLatticeGuidesVisible = mode.lattices;
  deps.setScalpGuideVisibility(mode.scalp);
  applyCapsuleGuideDisplayVisibility();
  applyCurveLatticeGuideDisplayVisibility();
  deps.syncDisplayVisibilityInputs();
  updateGuideViewToggle();
}

function cycleGuideViewMode() {
  const currentIndex = deps.GUIDE_VIEW_MODES.findIndex((mode) => mode.id === currentGuideViewMode()?.id);
  setGuideViewMode(deps.GUIDE_VIEW_MODES[(currentIndex + 1) % deps.GUIDE_VIEW_MODES.length].id);
}

function hideGuideViewContextMenu() {
  deps.guideViewContextMenu.classList.add("hidden");
}

function showGuideViewContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  updateGuideViewToggle();
  deps.guideViewContextMenu.classList.remove("hidden");
  const margin = 8;
  const left = Math.min(event.clientX, window.innerWidth - deps.guideViewContextMenu.offsetWidth - margin);
  const top = Math.min(event.clientY, window.innerHeight - deps.guideViewContextMenu.offsetHeight - margin);
  deps.guideViewContextMenu.style.left = `${Math.max(margin, left)}px`;
  deps.guideViewContextMenu.style.top = `${Math.max(margin, top)}px`;
  deps.guideViewContextMenu.querySelector("button.active")?.focus();
}

function applyCapsuleGuideDisplayVisibility() {
  deps.guides.filter((guide) => guide.type === "capsule").forEach((guide) => {
    const visible = deps.guideState.capsuleGuidesVisible && guide.outlinerVisible !== false;
    guide.mesh.visible = visible;
    if (guide.wire) guide.wire.visible = visible;
    if (guide.controlWire) guide.controlWire.visible = visible;
    if (guide.handlesGroup) {
      guide.handlesGroup.visible = visible
        && guide.id === deps.sel.selectedGuideId
        && deps.sculptState.capsuleGuideEditing;
    }
    if (guide.loopLinesGroup) {
      guide.loopLinesGroup.visible = visible
        && guide.id === deps.sel.selectedGuideId
        && deps.sculptState.capsuleGuideEditing;
    }
  });
  const selected = getSelectedGuide();
  if (selected?.type === "capsule" && (!deps.guideState.capsuleGuidesVisible || selected.outlinerVisible === false)) {
    deps.transformControls.detach();
  }
}

function applyOtherGuideDisplayVisibility() {
  deps.guides.filter((guide) => guide.type !== "capsule" && guide.type !== "curve-lattice").forEach((guide) => {
    const visible = guide.outlinerVisible !== false;
    guide.mesh.visible = visible;
    if (guide.wire) guide.wire.visible = visible;
  });
}

function applyCurveLatticeGuideDisplayVisibility() {
  deps.filterCurveLatticesToGroup(deps.sel.selectedGuideId);
  if (!deps.guideState.curveLatticeGuidesVisible && getSelectedGuide()?.type === "curve-lattice") {
    deps.transformControls.detach();
  }
}

function defaultCurveLatticePoints(columns = 3, rows = 3) {
  const points = [];
  deps.scalpSurfaceGroup.updateMatrixWorld(true);
  const probe = new THREE.Raycaster();
  for (let row = 0; row < rows; row += 1) {
    const v = row / Math.max(1, rows - 1);
    const y = THREE.MathUtils.lerp(1.35, 0.08, v);
    for (let column = 0; column < columns; column += 1) {
      const u = column / Math.max(1, columns - 1);
      const x = THREE.MathUtils.lerp(-0.78, 0.78, u);
      probe.set(new THREE.Vector3(x, y, 4), new THREE.Vector3(0, 0, -1));
      const hit = probe.intersectObject(deps.activeScalpSurfaceMesh(), false)[0];
      if (hit) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
        const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
        if (normal.z < 0) normal.negate();
        points.push(hit.point.clone().addScaledVector(normal, 0.035));
      } else {
        const normalizedX = x / 0.9;
        points.push(new THREE.Vector3(x, y, 0.62 + Math.sqrt(Math.max(0, 1 - normalizedX * normalizedX)) * 0.28));
      }
    }
  }
  return points;
}

function flatCurveLatticePoints(
  columns = DEFAULT_CURVE_LATTICE_PLANE.columns,
  rows = DEFAULT_CURVE_LATTICE_PLANE.rows
) {
  return flatCurveLatticePointData({ columns, rows }).map(
    (point) => new THREE.Vector3(point.x, point.y, point.z)
  );
}

function createCurveLatticeGuideSet() {
  const regions = STRAND_GROUPS.map((group) => group.id).filter((region) => region !== "unassigned");
  return regions.map((region) => {
    const columns = 3;
    const rows = region === "bangs" ? 3 : 4;
    return addCurveLattice({
      columns,
      rows,
      scalpRegion: region,
      color: SCALP_REGIONS[region].color,
      points: deps.curveLatticePointsForScalpRegion(region, columns, rows)
    }, { deferUi: true });
  });
}

function curveLatticeControlPoint(guide, column, row) {
  return guide.points[row * guide.columns + column];
}

function circularArcTangent(rowPoints, column) {
  if (rowPoints.length < 3) return null;
  const first = THREE.MathUtils.clamp(column - 1, 0, rowPoints.length - 3);
  const a = rowPoints[first];
  const b = rowPoints[first + 1];
  const c = rowPoints[first + 2];
  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);
  const planeNormal = new THREE.Vector3().crossVectors(ab, ac);
  const bendStrength = planeNormal.length() / Math.max(1e-8, ab.length() * ac.length());
  if (bendStrength < 0.035) return null;
  const denominator = 2 * planeNormal.lengthSq();
  if (denominator < 1e-8) return null;

  const center = a.clone().add(
    new THREE.Vector3().crossVectors(ac, planeNormal).multiplyScalar(ab.lengthSq())
      .add(new THREE.Vector3().crossVectors(planeNormal, ab).multiplyScalar(ac.lengthSq()))
      .divideScalar(denominator)
  );
  const point = rowPoints[column];
  const radiusVector = point.clone().sub(center);
  const radius = radiusVector.length();
  const localSpan = Math.max(ab.length(), b.distanceTo(c));
  if (radius < 1e-5 || radius > localSpan * 8 || !Number.isFinite(radius)) return null;

  const direction = new THREE.Vector3().crossVectors(planeNormal, radiusVector).normalize();
  const previous = rowPoints[Math.max(0, column - 1)];
  const next = rowPoints[Math.min(rowPoints.length - 1, column + 1)];
  const travelDirection = next.clone().sub(previous);
  if (direction.dot(travelDirection) < 0) direction.negate();

  const arcLengthTo = (neighbor) => {
    const chord = point.distanceTo(neighbor);
    const angle = 2 * Math.asin(THREE.MathUtils.clamp(chord / (2 * radius), 0, 1));
    return radius * angle;
  };
  const lengths = [];
  if (column > 0) lengths.push(arcLengthTo(previous));
  if (column < rowPoints.length - 1) lengths.push(arcLengthTo(next));
  const tangentLength = lengths.reduce((sum, length) => sum + length, 0) / Math.max(1, lengths.length);
  return direction.multiplyScalar(tangentLength);
}

function defaultCurveLatticeFrames(points, columns, rows) {
  const tangents = [];
  const verticalTangents = [];
  const normals = [];
  for (let row = 0; row < rows; row += 1) {
    const rowPoints = Array.from({ length: columns }, (_, column) => points[row * columns + column]);
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const left = points[row * columns + Math.max(0, column - 1)];
      const right = points[row * columns + Math.min(columns - 1, column + 1)];
      const circularTangent = circularArcTangent(rowPoints, column);
      const tangent = circularTangent || right.clone().sub(left);
      if (!circularTangent && column > 0 && column < columns - 1) tangent.multiplyScalar(0.5);

      const above = points[Math.max(0, row - 1) * columns + column];
      const below = points[Math.min(rows - 1, row + 1) * columns + column];
      const normal = above.clone().sub(below);
      const tangentDirection = tangent.clone().normalize();
      normal.addScaledVector(tangentDirection, -normal.dot(tangentDirection));
      if (normal.lengthSq() < 1e-6) normal.set(0, 1, 0);
      normals[index] = normal.normalize();
      tangents[index] = tangent;
    }
  }
  for (let column = 0; column < columns; column += 1) {
    const columnPoints = Array.from({ length: rows }, (_, row) => points[row * columns + column]);
    for (let row = 0; row < rows; row += 1) {
      const index = row * columns + column;
      const above = columnPoints[Math.max(0, row - 1)];
      const below = columnPoints[Math.min(rows - 1, row + 1)];
      const circularTangent = circularArcTangent(columnPoints, row);
      const tangent = circularTangent || below.clone().sub(above);
      if (!circularTangent && row > 0 && row < rows - 1) tangent.multiplyScalar(0.5);
      verticalTangents[index] = tangent;
    }
  }
  return { tangents, verticalTangents, normals };
}

function sampleHermiteCurve(points, tangents, t) {
  if (points.length === 1) return points[0].clone();
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * (points.length - 1);
  const segment = Math.min(points.length - 2, Math.floor(scaled));
  const u = scaled - segment;
  const u2 = u * u;
  const u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;
  return points[segment].clone().multiplyScalar(h00)
    .addScaledVector(tangents[segment], h10)
    .addScaledVector(points[segment + 1], h01)
    .addScaledVector(tangents[segment + 1], h11);
}

function sampleCurveLattice(guide, u, v) {
  const across = [];
  const acrossTangents = [];
  for (let column = 0; column < guide.columns; column += 1) {
    const columnPoints = Array.from({ length: guide.rows }, (_, row) => curveLatticeControlPoint(guide, column, row));
    const columnCurveTangents = Array.from(
      { length: guide.rows },
      (_, row) => guide.verticalTangents[row * guide.columns + column]
    );
    across.push(sampleHermiteCurve(columnPoints, columnCurveTangents, v));
    const columnTangents = Array.from(
      { length: guide.rows },
      (_, row) => guide.acrossTangents[row * guide.columns + column]
    );
    acrossTangents.push(new THREE.CatmullRomCurve3(columnTangents, false, "centripetal", 0.5).getPoint(v));
  }
  return sampleHermiteCurve(across, acrossTangents, u);
}

function curveLatticeNormal(guide, u, v) {
  const step = 0.002;
  const left = sampleCurveLattice(guide, Math.max(0, u - step), v);
  const right = sampleCurveLattice(guide, Math.min(1, u + step), v);
  const top = sampleCurveLattice(guide, u, Math.max(0, v - step));
  const bottom = sampleCurveLattice(guide, u, Math.min(1, v + step));
  const normal = right.sub(left).cross(bottom.sub(top)).normalize();
  if (normal.z < 0) normal.negate();
  return normal;
}

function createCurveLatticeGeometry(guide) {
  const uSegments = Math.max(12, (guide.columns - 1) * 10);
  const vSegments = Math.max(18, (guide.rows - 1) * 10);
  const vertices = [];
  const indices = [];
  for (let row = 0; row <= vSegments; row += 1) {
    const v = row / vSegments;
    for (let column = 0; column <= uSegments; column += 1) {
      const point = sampleCurveLattice(guide, column / uSegments, v);
      vertices.push(point.x, point.y, point.z);
    }
  }
  const stride = uSegments + 1;
  for (let row = 0; row < vSegments; row += 1) {
    for (let column = 0; column < uSegments; column += 1) {
      const a = row * stride + column;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createCurveLatticeLineGeometry(guide) {
  const vertices = [];
  const appendCurve = (points, segments, tangents = null) => {
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
    const sample = (t) => tangents ? sampleHermiteCurve(points, tangents, t) : curve.getPoint(t);
    let previous = sample(0);
    for (let index = 1; index <= segments; index += 1) {
      const next = sample(index / segments);
      vertices.push(previous.x, previous.y, previous.z, next.x, next.y, next.z);
      previous = next;
    }
  };
  for (let column = 0; column < guide.columns; column += 1) {
    appendCurve(
      Array.from({ length: guide.rows }, (_, row) => curveLatticeControlPoint(guide, column, row)),
      36,
      Array.from({ length: guide.rows }, (_, row) => guide.verticalTangents[row * guide.columns + column])
    );
  }
  for (let row = 0; row < guide.rows; row += 1) {
    appendCurve(
      Array.from({ length: guide.columns }, (_, column) => curveLatticeControlPoint(guide, column, row)),
      28,
      Array.from({ length: guide.columns }, (_, column) => guide.acrossTangents[row * guide.columns + column])
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geometry;
}

function curveLatticeLoopPickerGeometry(points, tangents, segments) {
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
  const sample = (t) => tangents ? sampleHermiteCurve(points, tangents, t) : curve.getPoint(t);
  const vertices = [];
  let previous = sample(0);
  for (let index = 1; index <= segments; index += 1) {
    const next = sample(index / segments);
    vertices.push(previous.x, previous.y, previous.z, next.x, next.y, next.z);
    previous = next;
  }
  return new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
}

function createCurveLatticeLoopPickers(guide) {
  const group = new THREE.Group();
  const addPicker = (axis, loopIndex, points, tangents, segments) => {
    const picker = new THREE.LineSegments(
      curveLatticeLoopPickerGeometry(points, tangents, segments),
      new THREE.LineBasicMaterial({
        color: 0xff5bd1,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      })
    );
    picker.renderOrder = 12;
    picker.userData.guideId = guide.id;
    picker.userData.curveLatticeGuideId = guide.id;
    picker.userData.curveLatticeLoopAxis = axis;
    picker.userData.curveLatticeLoopIndex = loopIndex;
    group.add(picker);
  };
  for (let column = 0; column < guide.columns; column += 1) {
    addPicker(
      "vertical",
      column,
      Array.from({ length: guide.rows }, (_, row) => curveLatticeControlPoint(guide, column, row)),
      Array.from({ length: guide.rows }, (_, row) => guide.verticalTangents[row * guide.columns + column]),
      36
    );
  }
  for (let row = 0; row < guide.rows; row += 1) {
    addPicker(
      "horizontal",
      row,
      Array.from({ length: guide.columns }, (_, column) => curveLatticeControlPoint(guide, column, row)),
      Array.from({ length: guide.columns }, (_, column) => guide.acrossTangents[row * guide.columns + column]),
      28
    );
  }
  return group;
}

function rebuildCurveLatticeLoopPickers(guide) {
  if (guide.loopPickersGroup) {
    deps.guideSurfaceGroup.remove(guide.loopPickersGroup);
    guide.loopPickersGroup.children.forEach((picker) => {
      picker.geometry.dispose();
      picker.material.dispose();
    });
  }
  guide.loopPickersGroup = createCurveLatticeLoopPickers(guide);
  deps.guideSurfaceGroup.add(guide.loopPickersGroup);
  refreshCurveLatticeLoopHover();
}

function curveLatticeHasRootExtension(guide) {
  return ["side-bangs-left", "side-bangs-right", "side-left", "side-right"].includes(guide.scalpRegion);
}

function defaultCurveLatticeRootPoints(guide) {
  if (!curveLatticeHasRootExtension(guide)) return [];
  const probe = new THREE.Raycaster();
  return Array.from({ length: guide.columns }, (_, column) => {
    const boundary = curveLatticeControlPoint(guide, column, 0);
    probe.set(new THREE.Vector3(0, 4, boundary.z), new THREE.Vector3(0, -1, 0));
    let hit = probe.intersectObject(deps.activeScalpSurfaceMesh(), false)[0];
    if (!hit) {
      probe.set(new THREE.Vector3(0, boundary.y, 4), new THREE.Vector3(0, 0, -1));
      hit = probe.intersectObject(deps.activeScalpSurfaceMesh(), false)[0];
    }
    if (!hit) return boundary.clone().setX(0);
    const point = hit.point.clone();
    point.x = 0;
    return point;
  });
}

function curveLatticeEditablePoint(guide, pointIndex) {
  if (pointIndex < guide.points.length) return guide.points[pointIndex];
  const rootIndex = pointIndex - guide.points.length;
  if (rootIndex < (guide.rootPoints?.length || 0)) return guide.rootPoints[rootIndex];
  return undefined;
}

function curveLatticePointSection(guide, pointIndex) {
  if (pointIndex < guide.points.length) {
    return { type: "lattice", localIndex: pointIndex };
  }
  const afterLattice = pointIndex - guide.points.length;
  if (afterLattice < (guide.rootPoints?.length || 0)) {
    return { type: "root", localIndex: afterLattice };
  }
  return { type: "unknown", localIndex: -1 };
}

function curveLatticeRestPoint(guide, pointIndex) {
  const section = curveLatticePointSection(guide, pointIndex);
  if (section.type === "root") return guide.deformRestRootPoints?.[section.localIndex] || null;
  return guide.deformRestPoints?.[section.localIndex] || null;
}

function editingCurveLatticeDeformation(guide) {
  if ((!CURVE_LATTICE_FEATURE_ENABLED && !GROUP_CURVE_FEATURE_ENABLED) || !deps.sel.selectedStrandGroup || !guide) return false;
  return guide.scalpRegion === deps.sel.selectedStrandGroup
    || (deps.sculptState.mirrorXEditing && guide.scalpRegion === deps.mirroredScalpRegion(deps.sel.selectedStrandGroup));
}

function curveLatticeRootColumns(guide) {
  return Array.from({ length: guide.columns }, (_, column) => {
    const boundary = curveLatticeControlPoint(guide, column, 0).clone();
    return { boundary, root: guide.rootPoints[column].clone() };
  });
}

function curveTangentsForPoints(points) {
  return points.map((point, index) => {
    const circularTangent = circularArcTangent(points, index);
    if (circularTangent) return circularTangent;
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const tangent = next.clone().sub(previous);
    if (index > 0 && index < points.length - 1) tangent.multiplyScalar(0.5);
    return tangent;
  });
}

function createCurveLatticeRootGeometry(guide) {
  const columns = curveLatticeRootColumns(guide);
  const boundaryPoints = columns.map((column) => column.boundary);
  const rootPoints = columns.map((column) => column.root);
  const boundaryTangents = curveTangentsForPoints(boundaryPoints);
  const rootTangents = curveTangentsForPoints(rootPoints);
  const uSegments = Math.max(16, (guide.columns - 1) * 10);
  const vSegments = 6;
  const vertices = [];
  const indices = [];
  for (let row = 0; row <= vSegments; row += 1) {
    const v = row / vSegments;
    for (let column = 0; column <= uSegments; column += 1) {
      const u = column / uSegments;
      const boundary = sampleHermiteCurve(boundaryPoints, boundaryTangents, u);
      const root = sampleHermiteCurve(rootPoints, rootTangents, u);
      const point = boundary.lerp(root, v);
      vertices.push(point.x, point.y, point.z);
    }
  }
  const stride = uSegments + 1;
  for (let row = 0; row < vSegments; row += 1) {
    for (let column = 0; column < uSegments; column += 1) {
      const a = row * stride + column;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createCurveLatticeRootLineGeometry(guide) {
  const columns = curveLatticeRootColumns(guide);
  const boundaryPoints = columns.map((column) => column.boundary);
  const rootPoints = columns.map((column) => column.root);
  const boundaryTangents = curveTangentsForPoints(boundaryPoints);
  const rootTangents = curveTangentsForPoints(rootPoints);
  const vertices = [];
  const appendCurve = (points, tangents) => {
    let previous = sampleHermiteCurve(points, tangents, 0);
    for (let index = 1; index <= 30; index += 1) {
      const next = sampleHermiteCurve(points, tangents, index / 30);
      vertices.push(previous.x, previous.y, previous.z, next.x, next.y, next.z);
      previous = next;
    }
  };
  appendCurve(boundaryPoints, boundaryTangents);
  appendCurve(rootPoints, rootTangents);
  columns.forEach(({ boundary, root }) => {
    vertices.push(boundary.x, boundary.y, boundary.z, root.x, root.y, root.z);
  });
  return new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
}

function rebuildCurveLatticeHandles(guide) {
  const wasVisible = guide.handlesGroup?.visible ?? false;
  if (guide.handlesGroup?.children.includes(deps.transformControls.object)) deps.transformControls.detach();
  if (guide.handlesGroup) {
    deps.guideSurfaceGroup.remove(guide.handlesGroup);
    guide.handlesGroup.children.forEach((handle) => {
      handle.geometry.dispose();
      handle.material.dispose();
    });
  }
  deps.sel.selectedCurveLatticePoint = null;
  deps.sel.selectedControlPoints = deps.sel.selectedControlPoints.filter((point) => point.type !== "lattice" || point.guideId !== guide.id);
  guide.handlesGroup = createCurveLatticeHandles(guide);
  guide.handlesGroup.visible = wasVisible;
  deps.guideSurfaceGroup.add(guide.handlesGroup);
}

function resampleCurveLatticeGuide(guide, nextColumns, nextRows) {
  const columns = THREE.MathUtils.clamp(Math.round(Number(nextColumns)), 2, 12);
  const rows = THREE.MathUtils.clamp(Math.round(Number(nextRows)), 2, 12);
  if (columns === guide.columns && rows === guide.rows) return;
  const previousColumns = guide.columns;
  const previousRows = guide.rows;
  const sourcePoints = guide.points;
  const sourceRestPoints = guide.deformRestPoints || sourcePoints;
  const sourceRootPoints = guide.rootPoints || [];
  const sourceRestRootPoints = guide.deformRestRootPoints || sourceRootPoints;
  const resampleGrid = (points) => resampleCurveLatticePointData(
    points,
    previousColumns,
    previousRows,
    columns,
    rows
  ).map(deps.dataToVector);

  guide.points = resampleGrid(sourcePoints);
  guide.deformRestPoints = resampleGrid(sourceRestPoints);
  if (sourceRootPoints.length) {
    guide.rootPoints = resampleCurveLatticeLineData(sourceRootPoints, columns).map(deps.dataToVector);
    guide.deformRestRootPoints = resampleCurveLatticeLineData(
      sourceRestRootPoints,
      columns
    ).map(deps.dataToVector);
  }
  deps.locks.filter((lock) => lock.curveLatticeBinding?.guideId === guide.id).forEach((lock) => {
    const normalizedColumn = lock.curveLatticeBinding.column / Math.max(1, previousColumns - 1);
    lock.curveLatticeBinding.column = Math.round(normalizedColumn * (columns - 1));
  });
  guide.columns = columns;
  guide.rows = rows;
  rebuildCurveLatticeHandles(guide);
  updateCurveLatticeGeometry(guide);
}

function controlPointIsSelected(type, ownerId, pointIndex) {
  return deps.sel.selectedControlPoints.some((point) => (
    point.type === type
    && (type === "lattice" ? point.guideId === ownerId : point.lockId === ownerId)
    && point.pointIndex === pointIndex
  ));
}

function clearMultiPointSelection() {
  deps.sel.selectedControlPoints = [];
}

function createCurveLatticeHandles(guide) {
  const group = new THREE.Group();
  const editablePoints = [...guide.points, ...(guide.rootPoints || [])];
  editablePoints.forEach((point, index) => {
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x58f6ff, transparent: true, opacity: 0.72, depthTest: false })
    );
    handle.position.copy(point);
    handle.renderOrder = 10;
    handle.userData.guideId = guide.id;
    handle.userData.curveLatticeGuideId = guide.id;
    handle.userData.curveLatticePointIndex = index;
    handle.userData.curveLatticeRootPointIndex = index >= guide.points.length
      && index < guide.points.length + (guide.rootPoints?.length || 0)
      ? index - guide.points.length
      : undefined;
    group.add(handle);
  });
  return group;
}

function addCurveLattice(overrides = {}, options = {}) {
  const columns = Number(overrides.columns || 3);
  const rows = Number(overrides.rows || 3);
  const standalone = Boolean(overrides.standalone);
  const points = overrides.points?.map((point) => point.clone?.() || deps.dataToVector(point))
    || (standalone ? flatCurveLatticePoints(columns, rows) : defaultCurveLatticePoints(columns, rows));
  const frames = defaultCurveLatticeFrames(points, columns, rows);
  const scalpRegion = standalone ? "unassigned" : overrides.scalpRegion || "bangs";
  const color = new THREE.Color(
    overrides.color ?? SCALP_REGIONS[scalpRegion]?.color ?? 0x75c9ff
  ).getHex();
  const guide = {
    id: overrides.id || crypto.randomUUID(),
    type: "curve-lattice",
    standalone,
    name: deps.normalizeOutlinerName(
      overrides.name,
      overrides.standalone
        ? "Curve Lattice Guide"
        : `${SCALP_REGIONS[scalpRegion]?.label || scalpRegion || "Group"} Curve Lattice`
    ),
    outlinerVisible: overrides.outlinerVisible !== false,
    columns,
    rows,
    opacity: Number(overrides.opacity ?? 0.12),
    scalpRegion,
    color,
    points,
    acrossTangents: frames.tangents,
    verticalTangents: frames.verticalTangents,
    pointNormals: frames.normals
  };
  guide.rootPoints = curveLatticeHasRootExtension(guide)
    ? overrides.rootPoints?.length === columns
      ? overrides.rootPoints.map((point) => point.clone?.() || deps.dataToVector(point))
      : defaultCurveLatticeRootPoints(guide)
    : [];
  guide.deformRestPoints = overrides.deformRestPoints?.length === guide.points.length
    ? overrides.deformRestPoints.map((point) => point.clone?.() || deps.dataToVector(point))
    : guide.points.map((point) => point.clone());
  guide.deformRestRootPoints = overrides.deformRestRootPoints?.length === guide.rootPoints.length
    ? overrides.deformRestRootPoints.map((point) => point.clone?.() || deps.dataToVector(point))
    : guide.rootPoints.map((point) => point.clone());
  guide.mesh = new THREE.Mesh(
    createCurveLatticeGeometry(guide),
    new THREE.MeshLambertMaterial({
      color,
      transparent: true,
      opacity: guide.opacity,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  guide.mesh.userData.guideId = guide.id;
  guide.mesh.userData.curveLatticeGuideId = guide.id;
  guide.wire = new THREE.LineSegments(
    createCurveLatticeLineGeometry(guide),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.78, depthWrite: false })
  );
  guide.wire.userData.guideId = guide.id;
  guide.wire.userData.curveLatticeGuideId = guide.id;
  if (curveLatticeHasRootExtension(guide)) {
    guide.rootMesh = new THREE.Mesh(
      createCurveLatticeRootGeometry(guide),
      new THREE.MeshLambertMaterial({
        color,
        transparent: true,
        opacity: guide.opacity,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    guide.rootWire = new THREE.LineSegments(
      createCurveLatticeRootLineGeometry(guide),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.78, depthWrite: false })
    );
    [guide.rootMesh, guide.rootWire].forEach((object) => {
      object.userData.guideId = guide.id;
      object.userData.curveLatticeGuideId = guide.id;
    });
  }
  guide.loopPickersGroup = createCurveLatticeLoopPickers(guide);
  guide.handlesGroup = createCurveLatticeHandles(guide);
  guide.handlesGroup.visible = false;
  deps.guideSurfaceGroup.add(
    guide.mesh,
    guide.wire,
    ...(guide.rootMesh ? [guide.rootMesh, guide.rootWire] : []),
    guide.loopPickersGroup,
    guide.handlesGroup
  );
  if (
    (!CURVE_LATTICE_FEATURE_ENABLED || !deps.REGION_CURVE_VISUALIZATION_ENABLED)
    && !guide.standalone
  ) {
    [guide.mesh, guide.wire, guide.rootMesh, guide.rootWire]
      .filter(Boolean)
      .forEach((object) => { object.visible = false; });
    guide.loopPickersGroup.visible = false;
    guide.handlesGroup.visible = false;
  }
  deps.guides.push(guide);
  if (!options.deferUi) {
    selectGuide(guide.id);
    deps.updateCount();
  }
  return guide;
}

function updateCurveLatticeGeometry(guide, options = {}) {
  const frames = defaultCurveLatticeFrames(guide.points, guide.columns, guide.rows);
  guide.acrossTangents = frames.tangents;
  guide.verticalTangents = frames.verticalTangents;
  guide.pointNormals = frames.normals;
  guide.mesh.geometry.dispose();
  guide.wire.geometry.dispose();
  guide.mesh.geometry = createCurveLatticeGeometry(guide);
  guide.wire.geometry = createCurveLatticeLineGeometry(guide);
  guide.mesh.material.opacity = guide.opacity;
  rebuildCurveLatticeLoopPickers(guide);
  if (guide.rootMesh) {
    guide.rootMesh.geometry.dispose();
    guide.rootWire.geometry.dispose();
    guide.rootMesh.geometry = createCurveLatticeRootGeometry(guide);
    guide.rootWire.geometry = createCurveLatticeRootLineGeometry(guide);
    guide.rootMesh.material.opacity = guide.opacity;
  }
  if (options.syncHandles !== false) {
    guide.handlesGroup.children.forEach((handle, index) => {
      const point = curveLatticeEditablePoint(guide, index);
      if (point) handle.position.copy(point);
    });
  }
  updateGroupCurveDisplay(guide);
  if (GROUP_CURVE_FEATURE_ENABLED && deps.sel.selectedStrandGroup) {
    deps.filterCurveLatticesToGroup(deps.sel.activeCurveLatticeGuideId);
  }
  deps.updateBoundCurveLatticeStrands(guide);
}

function mirroredCurveLatticePointIndex(guide, pointIndex) {
  const row = Math.floor(pointIndex / guide.columns);
  const column = pointIndex % guide.columns;
  return row * guide.columns + (guide.columns - 1 - column);
}

function mirroredCurveLatticeTarget(guide, pointIndex) {
  const mirroredRegion = deps.mirroredScalpRegion(guide.scalpRegion);
  const section = curveLatticePointSection(guide, pointIndex);
  if (mirroredRegion === guide.scalpRegion) {
    if (section.type === "root") {
      return {
        guide,
        pointIndex: guide.points.length + (guide.columns - 1 - section.localIndex)
      };
    }
    return { guide, pointIndex: mirroredCurveLatticePointIndex(guide, pointIndex) };
  }
  const targetGuide = deps.guides.find((item) => (
    item.type === "curve-lattice" && item.scalpRegion === mirroredRegion
  ));
  if (!targetGuide) return null;
  if (section.type === "root") {
    const targetRootIndex = Math.round(
      (section.localIndex / Math.max(1, guide.columns - 1)) * Math.max(0, targetGuide.columns - 1)
    );
    return {
      guide: targetGuide,
      pointIndex: targetGuide.points.length + targetRootIndex
    };
  }
  const sourceRow = Math.floor(section.localIndex / guide.columns);
  const sourceColumn = section.localIndex % guide.columns;
  const targetRow = Math.round(
    (sourceRow / Math.max(1, guide.rows - 1)) * Math.max(0, targetGuide.rows - 1)
  );
  const targetColumn = Math.round(
    (sourceColumn / Math.max(1, guide.columns - 1)) * Math.max(0, targetGuide.columns - 1)
  );
  return {
    guide: targetGuide,
    pointIndex: targetRow * targetGuide.columns + targetColumn
  };
}

function updateCurveLatticeHandleColors(guide) {
  if (!guide?.handlesGroup) return;
  const selectedIndex = deps.sel.selectedCurveLatticePoint?.guideId === guide.id
    ? deps.sel.selectedCurveLatticePoint.pointIndex
    : -1;
  const selectedGuide = deps.sel.selectedCurveLatticePoint
    ? deps.guides.find((item) => item.id === deps.sel.selectedCurveLatticePoint.guideId)
    : null;
  const mirroredTarget = deps.sculptState.mirrorXEditing && selectedGuide
    ? mirroredCurveLatticeTarget(selectedGuide, deps.sel.selectedCurveLatticePoint.pointIndex)
    : null;
  const mirroredIndex = mirroredTarget?.guide.id === guide.id ? mirroredTarget.pointIndex : -1;

  guide.handlesGroup.children.forEach((handle, index) => {
    const isSelected = index === selectedIndex || controlPointIsSelected("lattice", guide.id, index);
    const isMirrored = index === mirroredIndex && mirroredIndex !== selectedIndex;
    handle.material.color.set(isSelected ? deps.CONTROL_POINT_SELECTED_COLOR : isMirrored ? 0xf0d95d : 0x58f6ff);
    handle.material.opacity = isSelected ? 1 : isMirrored ? 0.9 : 0.58;
  });
}

function curveLatticeLoopHitFromEvent(event, guide = deps.selectedCurveLatticeGuide()) {
  if (!guide?.loopPickersGroup || !guide.handlesGroup?.visible) return null;
  deps.rayFromViewportEvent(event);
  const previousThreshold = deps.raycaster.params.Line.threshold;
  deps.raycaster.params.Line.threshold = 0.055;
  const hit = deps.raycaster.intersectObjects(guide.loopPickersGroup.children, false)[0] || null;
  deps.raycaster.params.Line.threshold = previousThreshold;
  if (!hit) return null;
  const surfaceHit = deps.raycaster.intersectObject(guide.mesh, false)[0] || null;
  if (surfaceHit && hit.distance > surfaceHit.distance + 0.09) return null;
  return {
    guide,
    axis: hit.object.userData.curveLatticeLoopAxis,
    loopIndex: hit.object.userData.curveLatticeLoopIndex
  };
}

function refreshCurveLatticeLoopHover() {
  deps.guides.forEach((guide) => guide.loopPickersGroup?.children.forEach((picker) => {
    const hovered = deps.guideState.curveLatticeLoopHover?.guideId === guide.id
      && deps.guideState.curveLatticeLoopHover.axis === picker.userData.curveLatticeLoopAxis
      && deps.guideState.curveLatticeLoopHover.loopIndex === picker.userData.curveLatticeLoopIndex;
    picker.material.opacity = hovered ? 0.96 : 0;
  }));
}

function setCurveLatticeLoopHover(result = null) {
  deps.guideState.curveLatticeLoopHover = result
    ? { guideId: result.guide.id, axis: result.axis, loopIndex: result.loopIndex }
    : null;
  refreshCurveLatticeLoopHover();
}

function updateCurveLatticeLoopHover(event) {
  const applicableTool = ["select", "move"].includes(deps.sel.activeTool);
  const blocked = !applicableTool
    || deps.sculptState.viewportEditMode !== "guide"
    || !deps.componentEditModeActive()
    || deps.sculptState.transformDragging
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
    || deps.guideState.hoveredControlPoint
    || deps.pointerHitsTransformGizmo(event);
  const result = blocked ? null : curveLatticeLoopHitFromEvent(event);
  setCurveLatticeLoopHover(result);
  if (deps.renderer.domElement.contains(event.target)) {
    deps.renderer.domElement.style.cursor = result ? "pointer" : "";
  }
}

function selectCurveLatticeLoop(guide, axis, loopIndex) {
  const indices = curveLatticeLoopPointIndices(
    guide?.columns,
    guide?.rows,
    axis,
    loopIndex
  );
  if (!guide || indices.length < 2) return false;
  deps.sel.selectedControlPoints = indices.map((pointIndex) => ({
    type: "lattice",
    guideId: guide.id,
    pointIndex
  }));
  deps.sel.selectedCurveLatticePoint = { guideId: guide.id, pointIndex: indices[0] };
  deps.sel.selectedPoint = null;
  deps.guides.filter((item) => item.type === "curve-lattice").forEach(updateCurveLatticeHandleColors);
  deps.transformControls.detach();
  if (
    deps.sel.activeTool === "move"
    && !(deps.sel.activeTool === "move" && deps.viewPlaneMoveActiveForView())
  ) {
    deps.configureTransformControls(deps.sel.activeTool);
    deps.transformControls.attach(guide.handlesGroup.children[indices[0]]);
  }
  deps.updateSelectedPointLabel();
  deps.updatePlacementStatus();
  return true;
}

function selectCurveLatticePoint(guide, pointIndex, attachTransform = deps.sel.activeTool === "move", preserveMulti = false) {
  if (!guide?.handlesGroup?.children[pointIndex]) return;
  deps.sel.selectedCurveLatticePoint = { guideId: guide.id, pointIndex };
  deps.sel.selectedPoint = null;
  if (!preserveMulti) deps.sel.selectedControlPoints = [{ type: "lattice", guideId: guide.id, pointIndex }];
  deps.guides.filter((item) => item.type === "curve-lattice").forEach(updateCurveLatticeHandleColors);
  if (attachTransform) {
    deps.transformControls.setMode("translate");
    deps.transformControls.setSpace("world");
    deps.transformControls.attach(guide.handlesGroup.children[pointIndex]);
  } else {
    deps.transformControls.detach();
  }
}

function updateCurveLatticeFromHandle(handle) {
  const guide = deps.guides.find((item) => item.id === handle.userData.curveLatticeGuideId);
  const pointIndex = handle.userData.curveLatticePointIndex;
  if (!guide || pointIndex === undefined) return;
  const editedPoint = curveLatticeEditablePoint(guide, pointIndex);
  if (!editedPoint) return;
  const previousPoint = editedPoint.clone();
  editedPoint.copy(handle.position);
  const guideOnlyEdit = !editingCurveLatticeDeformation(guide);
  const editDelta = editedPoint.clone().sub(previousPoint);
  if (guideOnlyEdit) curveLatticeRestPoint(guide, pointIndex)?.add(editDelta);

  if (deps.sculptState.mirrorXEditing) {
    const mirroredTarget = mirroredCurveLatticeTarget(guide, pointIndex);
    if (mirroredTarget?.guide.id === guide.id && mirroredTarget.pointIndex === pointIndex) {
      editedPoint.x = 0;
      handle.position.x = 0;
      if (guideOnlyEdit) {
        const restPoint = curveLatticeRestPoint(guide, pointIndex);
        if (restPoint) restPoint.x = 0;
      }
    } else if (mirroredTarget) {
      const mirroredPoint = curveLatticeEditablePoint(mirroredTarget.guide, mirroredTarget.pointIndex);
      if (!mirroredPoint) return;
      const previousMirroredPoint = mirroredPoint.clone();
      mirroredPoint.set(-handle.position.x, handle.position.y, handle.position.z);
      const mirroredGuideOnlyEdit = !editingCurveLatticeDeformation(mirroredTarget.guide);
      const mirroredDelta = mirroredPoint.clone().sub(previousMirroredPoint);
      if (mirroredGuideOnlyEdit) {
        curveLatticeRestPoint(mirroredTarget.guide, mirroredTarget.pointIndex)?.add(mirroredDelta);
      }
      mirroredTarget.guide.handlesGroup.children[mirroredTarget.pointIndex]?.position.copy(mirroredPoint);
      if (mirroredTarget.guide.id !== guide.id) {
        updateCurveLatticeGeometry(mirroredTarget.guide);
      }
    }
  }

  updateCurveLatticeGeometry(guide);
  deps.guides.filter((item) => item.type === "curve-lattice").forEach(updateCurveLatticeHandleColors);
}

function beginCurveLatticeMultiEdit(handle) {
  const guide = deps.guides.find((item) => item.id === handle?.userData.curveLatticeGuideId);
  if (!guide) return;
  const selectedIndices = deps.sel.selectedControlPoints
    .filter((point) => point.type === "lattice" && point.guideId === guide.id)
    .map((point) => point.pointIndex);
  if (selectedIndices.length < 2 || !selectedIndices.includes(handle.userData.curveLatticePointIndex)) {
    deps.sculptState.activeLatticeMultiEdit = null;
    return;
  }
  deps.sculptState.activeLatticeMultiEdit = {
    guideId: guide.id,
    pointIndex: handle.userData.curveLatticePointIndex,
    selectedIndices,
    points: selectedIndices.map((index) => ({ index, point: curveLatticeEditablePoint(guide, index).clone() })),
    handlePosition: handle.position.clone(),
    handleQuaternion: handle.quaternion.clone(),
    handleScale: handle.scale.clone()
  };
}

function applyCurveLatticeMultiTransform(handle) {
  const edit = deps.sculptState.activeLatticeMultiEdit;
  const guide = deps.guides.find((item) => item.id === edit?.guideId);
  if (!guide || deps.sel.activeTool !== "move" || deps.transformControls.mode !== "translate") return;
  const selectedSet = new Set(edit.selectedIndices);
  const delta = handle.position.clone().sub(edit.handlePosition);

  edit.points.forEach(({ index, point }) => {
    const target = curveLatticeEditablePoint(guide, index);
    target.copy(point).add(delta);
  });

  const guideOnlyEdit = !editingCurveLatticeDeformation(guide);
  if (guideOnlyEdit) {
    edit.points.forEach(({ index, point }) => {
      const target = curveLatticeEditablePoint(guide, index);
      curveLatticeRestPoint(guide, index)?.add(target.clone().sub(point));
    });
  }

  const mirroredGuides = new Set();
  if (deps.sculptState.mirrorXEditing) {
    edit.selectedIndices.forEach((index) => {
      const mirrored = mirroredCurveLatticeTarget(guide, index);
      if (!mirrored || (mirrored.guide.id === guide.id && selectedSet.has(mirrored.pointIndex))) return;
      const source = curveLatticeEditablePoint(guide, index);
      const target = curveLatticeEditablePoint(mirrored.guide, mirrored.pointIndex);
      if (!source || !target) return;
      const previousTarget = target.clone();
      target.set(-source.x, source.y, source.z);
      if (!editingCurveLatticeDeformation(mirrored.guide)) {
        curveLatticeRestPoint(mirrored.guide, mirrored.pointIndex)?.add(target.clone().sub(previousTarget));
      }
      mirroredGuides.add(mirrored.guide);
    });
  }
  updateCurveLatticeGeometry(guide);
  mirroredGuides.forEach((mirroredGuide) => {
    updateCurveLatticeGeometry(mirroredGuide);
  });
  deps.guides.filter((item) => item.type === "curve-lattice").forEach(updateCurveLatticeHandleColors);
}

function curveLatticeColumnPoints(guide, column, count = guide.rows) {
  const controlPoints = Array.from({ length: guide.rows }, (_, row) => curveLatticeControlPoint(guide, column, row));
  const tangents = curveTangentsForPoints(controlPoints);
  return Array.from(
    { length: count },
    (_, index) => sampleHermiteCurve(controlPoints, tangents, index / Math.max(1, count - 1))
  );
}

function groupCurveControlIndices(guide) {
  const column = Math.floor(guide.columns / 2);
  const indices = Array.from({ length: guide.rows }, (_, row) => row * guide.columns + column);
  return indices;
}

function groupCurveControlPoints(guide) {
  return groupCurveControlIndices(guide)
    .map((index) => curveLatticeEditablePoint(guide, index))
    .filter(Boolean);
}

function updateGroupCurveDisplay(guide) {
  if (!guide.groupCurveLine) return;
  const points = groupCurveControlPoints(guide);
  const displayPoints = points.length > 1
    ? new THREE.CatmullRomCurve3(points).getPoints(48)
    : points;
  guide.groupCurveLine.geometry.dispose();
  guide.groupCurveLine.geometry = new THREE.BufferGeometry().setFromPoints(displayPoints);
}

function ensureGroupCurveDisplay(guide) {
  if (!guide.groupCurveLine) {
    guide.groupCurveLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: guide.color,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        depthWrite: false
      })
    );
    guide.groupCurveLine.renderOrder = 9;
    guide.groupCurveLine.visible = false;
    deps.guideSurfaceGroup.add(guide.groupCurveLine);
  }
  updateGroupCurveDisplay(guide);
  return guide.groupCurveLine;
}

function groupCurveDeformationPairs(guide) {
  return groupCurveControlIndices(guide).map((index) => ({
    rest: curveLatticeRestPoint(guide, index),
    current: curveLatticeEditablePoint(guide, index)
  })).filter((pair) => pair.rest && pair.current);
}

function curveLatticeDeformationPairs(guide) {
  const pairs = [];
  const appendPairs = (restPoints, currentPoints) => {
    const count = Math.min(restPoints?.length || 0, currentPoints?.length || 0);
    for (let index = 0; index < count; index += 1) {
      pairs.push({ rest: restPoints[index], current: currentPoints[index] });
    }
  };
  appendPairs(guide.deformRestPoints, guide.points);
  appendPairs(guide.deformRestRootPoints, guide.rootPoints);
  return pairs;
}

function groupLatticeOffsetAtPoint(point, deformationPairs) {
  const nearest = deformationPairs
    .map((pair) => ({ pair, distanceSq: point.distanceToSquared(pair.rest) }))
    .sort((a, b) => a.distanceSq - b.distanceSq)
    .slice(0, Math.min(6, deformationPairs.length));
  if (!nearest.length) return new THREE.Vector3();
  if (nearest[0].distanceSq < 1e-8) {
    return nearest[0].pair.current.clone().sub(nearest[0].pair.rest);
  }
  const offset = new THREE.Vector3();
  let totalWeight = 0;
  nearest.forEach(({ pair, distanceSq }) => {
    const weight = 1 / Math.pow(distanceSq + 0.0125, 1.5);
    offset.addScaledVector(pair.current.clone().sub(pair.rest), weight);
    totalWeight += weight;
  });
  return offset.divideScalar(Math.max(1e-8, totalWeight));
}

function capsuleGuideCapHeight(radius) {
  return Math.max(0.02, Number(radius)) * 0.72;
}

function hideCapsuleGuideDrawPreview() {
  deps.capsuleGuideDrawPreview.visible = false;
  deps.capsuleGuideDrawPreview.geometry.setFromPoints([]);
}

function currentCapsuleGuideDrawProfile() {
  return deps.capsuleGuideDrawDefaults.profile.map((point) => ({ ...point }));
}

function updateCapsuleGuideProfilePreview() {
  const profile = currentCapsuleGuideDrawProfile();
  const samples = Array.from({ length: 33 }, (_, index) => {
    const t = index / 32;
    const value = sampleCapsuleRadialProfile(profile, t);
    return { x: 8 + t * 204, y: 28 - Math.min(2, value) / 2 * 22 };
  });
  const upper = samples.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" L ");
  const lower = [...samples].reverse().map((point) => `${point.x.toFixed(2)},${(56 - point.y).toFixed(2)}`).join(" L ");
  deps.capsuleGuideProfilePath.setAttribute("d", `M ${upper} L ${lower} Z`);
}

function capsuleGuideDrawPoints(samples = deps.sculptState.capsuleGuideDrawStroke?.samples, surfaceOffset = 0) {
  const sourceSamples = samples || [];
  const adjustedSamples = sourceSamples.map((sample, index) => ({
    ...sample,
    point: sample.onSurface && sample.normal && surfaceOffset
      ? sample.point.clone().addScaledVector(
          sample.normal,
          typeof surfaceOffset === "function"
            ? surfaceOffset(sourceSamples.length > 1 ? index / (sourceSamples.length - 1) : 0)
            : surfaceOffset
        )
      : sample.point.clone()
  }));
  return deps.loftSurfaceProfilePoints(adjustedSamples);
}

function updateCapsuleGuideDrawPreview() {
  const points = capsuleGuideDrawPoints();
  deps.capsuleGuideDrawPreview.geometry.setFromPoints(points);
  deps.capsuleGuideDrawPreview.visible = points.length > 1;
}

function beginCapsuleGuideDrawStroke(event, hit) {
  if (event.button !== 0 || !hit || event.ctrlKey || event.altKey || event.metaKey) return false;
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur?.();
  const surfaceMode = deps.activeStrokeSurfaceValue();
  const dynamicContextual = deps.activeStrokeDynamicEnabled(surfaceMode);
  const sample = hit.contextualPlaneNormal
    ? { point: hit.point.clone(), normal: hit.contextualPlaneNormal.clone(), onSurface: false }
    : deps.loftSurfaceSampleFromHit(hit);
  deps.sculptState.capsuleGuideDrawStroke = {
    pointerId: event.pointerId,
    surfaceMode,
    dynamicContextual,
    samples: [sample],
    lastX: event.clientX,
    lastY: event.clientY,
    freePlane: surfaceMode === "contextual-plane" ? deps.contextualPlaneAtOrigin() : null
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = "crosshair";
  updateCapsuleGuideDrawPreview();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event.preventDefault();
  return true;
}

function updateCapsuleGuideDrawStroke(event) {
  const stroke = deps.sculptState.capsuleGuideDrawStroke;
  if (!stroke || event.pointerId !== stroke.pointerId) return;
  if (Math.hypot(event.clientX - stroke.lastX, event.clientY - stroke.lastY) < 4) return;
  let nextSample = null;
  if (!stroke.freePlane) {
    const hit = deps.drawSurfaceHitFromEvent(event);
    if (hit) nextSample = deps.loftSurfaceSampleFromHit(hit);
    else if (deps.strokeSurfaceIsContextual(stroke.surfaceMode, stroke.dynamicContextual)) {
      const normal = deps.viewPlaneNormal();
      const origin = stroke.samples.at(-1).point.clone();
      stroke.freePlane = {
        origin,
        normal,
        plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, origin)
      };
    }
  }
  if (stroke.freePlane && !nextSample) {
    const point = deps.rayFromViewportEvent(event).intersectPlane(stroke.freePlane.plane, new THREE.Vector3());
    if (point) nextSample = { point, normal: stroke.freePlane.normal.clone(), onSurface: false };
  }
  if (!nextSample || nextSample.point.distanceTo(stroke.samples.at(-1).point) < 0.008) return;
  stroke.samples.push(nextSample);
  stroke.lastX = event.clientX;
  stroke.lastY = event.clientY;
  updateCapsuleGuideDrawPreview();
  event.preventDefault();
}

function createCapsuleGuideAlongCurve(samples) {
  const radius = Math.max(0.02, Number(deps.surfaceGuideInputs.radius.value || deps.surfaceGuideDefaults.radius));
  const radialProfile = currentCapsuleGuideDrawProfile();
  const centerline = capsuleGuideDrawPoints(
    samples,
    (amount) => radius * sampleCapsuleRadialProfile(radialProfile, amount)
  );
  const centerlineData = centerline.map(deps.vectorToData);
  const authoredLength = polylineLength(centerlineData);
  if (centerline.length < 2 || authoredLength < 0.12) return null;
  const cageLength = Math.max(radius * 2, authoredLength);
  const radialLoops = Math.max(6, Math.round(Number(deps.surfaceGuideInputs.radialLoops.value || deps.surfaceGuideDefaults.radialLoops) / 2) * 2);
  const curveStep = THREE.MathUtils.clamp(Number(deps.capsuleGuideDrawDefaults.curveStep), 0.05, 0.5);
  const lengthLoops = THREE.MathUtils.clamp(Math.ceil(authoredLength / curveStep), 4, 32);
  const baseGeometry = createCapsuleGuideGeometry(radius, cageLength, radialLoops, lengthLoops);
  const baseData = capsuleControlDataFromGeometry(baseGeometry);
  const preferredNormal = samples.find((sample) => sample.normal)?.normal || null;
  const worldControlData = curveDeformedCapsulePoints({
    centerline: centerlineData,
    cagePoints: baseData.points.map(deps.vectorToData),
    guideLength: cageLength,
    preferredNormal: preferredNormal ? deps.vectorToData(preferredNormal) : null,
    radialProfile,
    capAtEnd: true,
    frameSamples: Math.max(65, lengthLoops * 8 + 1)
  });
  const start = centerline[0].clone();
  let direction = centerline.at(-1).clone().sub(start);
  if (direction.lengthSq() < 1e-8) direction = centerline[1].clone().sub(start);
  if (direction.lengthSq() < 1e-8) direction.set(0, -1, 0);
  direction.normalize();
  const end = start.clone().addScaledVector(direction, cageLength);
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), direction);
  const inverseOrientation = orientation.clone().invert();
  const controlPoints = worldControlData.map((point) => (
    deps.dataToVector(point).sub(midpoint).applyQuaternion(inverseOrientation)
  ));
  baseGeometry.dispose();
  return addCapsuleGuide({
    start,
    end,
    radius,
    radialLoops,
    lengthLoops,
    subdivisionSteps: Number(deps.surfaceGuideInputs.subdivisionSteps.value || deps.surfaceGuideDefaults.subdivisionSteps),
    opacity: Number(deps.surfaceGuideInputs.opacity.value || deps.surfaceGuideDefaults.opacity),
    fresnel: deps.surfaceGuideFresnelInput.checked,
    centerVisibility: Number(deps.surfaceGuideInputs.centerVisibility.value || deps.surfaceGuideDefaults.centerVisibility),
    controlPoints,
    controlFaces: baseData.faces
  });
}

function finishCapsuleGuideDrawStroke(event, { cancel = false } = {}) {
  const stroke = deps.sculptState.capsuleGuideDrawStroke;
  if (!stroke) return false;
  if (event?.pointerId !== undefined && event.pointerId !== stroke.pointerId) return false;
  if (!cancel && event?.clientX !== undefined) updateCapsuleGuideDrawStroke(event);
  deps.sculptState.capsuleGuideDrawStroke = null;
  if (deps.renderer.domElement.hasPointerCapture?.(stroke.pointerId)) {
    deps.renderer.domElement.releasePointerCapture(stroke.pointerId);
  }
  deps.renderer.domElement.style.cursor = "";
  hideCapsuleGuideDrawPreview();
  if (!cancel && polylineLength(capsuleGuideDrawPoints(stroke.samples).map(deps.vectorToData)) >= 0.12) {
    deps.pushUndoState();
    createCapsuleGuideAlongCurve(stroke.samples);
  }
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event?.preventDefault();
  return true;
}

function createCapsuleGuideGeometry(radius, length, radialLoops = 12, lengthLoops = 8) {
  const r = Math.max(0.02, Number(radius));
  const totalLength = Math.max(r * 2, Number(length));
  const around = Math.max(6, Math.round(radialLoops / 2) * 2);
  const along = Math.max(4, Math.round(lengthLoops));
  const capHeight = capsuleGuideCapHeight(r);
  const topPoleY = totalLength * 0.5;
  const topCylinderY = topPoleY - capHeight;
  const bottomY = -totalLength * 0.5;
  const positions = [];
  const indices = [];
  const faces = [];
  const horizontalLoops = [];

  function vertex(point) {
    const index = positions.length / 3;
    positions.push(point.x, point.y, point.z);
    return index;
  }

  function addFace(face) {
    const points = face.map((pointIndex) => new THREE.Vector3().fromArray(positions, pointIndex * 3));
    const centroid = points.reduce((sum, point) => sum.add(point), new THREE.Vector3())
      .multiplyScalar(1 / points.length);
    const centerline = new THREE.Vector3(
      0,
      THREE.MathUtils.clamp(centroid.y, bottomY, topCylinderY),
      0
    );
    const outward = centroid.clone().sub(centerline);
    const normal = points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0]));
    const oriented = normal.dot(outward) < 0 ? [...face].reverse() : face;
    faces.push(oriented);
    for (let corner = 1; corner < oriented.length - 1; corner += 1) {
      indices.push(oriented[0], oriented[corner], oriented[corner + 1]);
    }
  }

  function addRing(y, ringRadius) {
    const ring = Array.from({ length: around }, (_, aroundIndex) => {
      const angle = aroundIndex / around * Math.PI * 2;
      return vertex(new THREE.Vector3(
        Math.cos(angle) * ringRadius,
        y,
        Math.sin(angle) * ringRadius
      ));
    });
    horizontalLoops.push(ring);
    return ring;
  }

  const capSegments = Math.max(1, Math.min(Math.floor(along / 4), along - 1));
  const cylinderSegments = Math.max(1, along - capSegments);
  for (let capIndex = 1; capIndex <= capSegments; capIndex += 1) {
    const angle = capIndex / capSegments * Math.PI * 0.5;
    addRing(topCylinderY + Math.cos(angle) * capHeight, Math.sin(angle) * r);
  }
  for (let cylinderIndex = 1; cylinderIndex <= cylinderSegments; cylinderIndex += 1) {
    addRing(
      THREE.MathUtils.lerp(topCylinderY, bottomY, cylinderIndex / cylinderSegments),
      r
    );
  }

  const topPole = vertex(new THREE.Vector3(0, topPoleY, 0));
  const firstRing = horizontalLoops[0];
  for (let aroundIndex = 0; aroundIndex < around; aroundIndex += 1) {
    const next = (aroundIndex + 1) % around;
    addFace([topPole, firstRing[aroundIndex], firstRing[next]]);
    for (let ringIndex = 0; ringIndex < horizontalLoops.length - 1; ringIndex += 1) {
      const currentRing = horizontalLoops[ringIndex];
      const nextRing = horizontalLoops[ringIndex + 1];
      addFace([
        currentRing[aroundIndex],
        currentRing[next],
        nextRing[next],
        nextRing[aroundIndex]
      ]);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.userData.quadFaces = faces;
  geometry.userData.horizontalLoops = horizontalLoops;
  geometry.userData.topology = "quad-rings-with-top-pole-open-bottom";
  geometry.userData.controlVertexCount = positions.length / 3;
  return geometry;
}

function capsuleGuideTopologyFeature(point, radius, length) {
  const safeRadius = Math.max(0.0001, radius);
  const safeHalfLength = Math.max(safeRadius, length * 0.5);
  return new THREE.Vector3(
    point.x / safeRadius,
    point.y / safeHalfLength,
    point.z / safeRadius
  );
}

function retopologizeCapsuleGuide(guide, radialLoops, lengthLoops) {
  const oldBaseGeometry = createCapsuleGuideGeometry(
    guide.radius,
    guide.length,
    guide.radialLoops,
    guide.lengthLoops
  );
  const oldBaseData = capsuleControlDataFromGeometry(oldBaseGeometry);
  const oldPoints = guide.controlPoints.map((point) => point.clone());
  const canTransfer = oldBaseData.points.length === oldPoints.length;
  const oldSamples = canTransfer ? oldBaseData.points.map((basePoint, pointIndex) => ({
    feature: capsuleGuideTopologyFeature(basePoint, guide.radius, guide.length),
    displacement: oldPoints[pointIndex].clone().sub(basePoint)
  })) : [];

  const newBaseGeometry = createCapsuleGuideGeometry(
    guide.radius,
    guide.length,
    radialLoops,
    lengthLoops
  );
  const newData = capsuleControlDataFromGeometry(newBaseGeometry);
  if (canTransfer) {
    newData.points.forEach((point) => {
      const feature = capsuleGuideTopologyFeature(point, guide.radius, guide.length);
      const nearest = oldSamples
        .map((sample) => ({
          sample,
          distance: feature.distanceToSquared(sample.feature)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 8);
      if (nearest[0]?.distance < 1e-10) {
        point.add(nearest[0].sample.displacement);
        return;
      }
      const displacement = new THREE.Vector3();
      let weightTotal = 0;
      nearest.forEach(({ sample, distance }) => {
        const weight = 1 / Math.max(1e-6, distance);
        displacement.addScaledVector(sample.displacement, weight);
        weightTotal += weight;
      });
      if (weightTotal > 0) point.addScaledVector(displacement, 1 / weightTotal);
    });
  }

  oldBaseGeometry.dispose();
  newBaseGeometry.dispose();
  guide.radialLoops = radialLoops;
  guide.lengthLoops = lengthLoops;
  guide.controlPoints = newData.points;
  guide.controlFaces = newData.faces;
  guide.controlLoops = capsuleGuideHorizontalLoopsFromTopology(
    newData.points,
    newData.faces,
    newData.loops
  );
  guide.selectedPointIndex = -1;
  deps.sculptState.capsuleGuideLoopSelection = null;
  deps.guideState.activeCapsuleGuideLoopTransform = null;
  updateCapsuleGuideGeometry(guide, { preserveControlPoints: true });
  refreshCapsuleGuideLoopInfluence();
}

function resizeCapsuleGuideCylinder(guide, nextLength) {
  const previousLength = Math.max(guide.radius * 2, guide.length);
  const clampedLength = Math.max(guide.radius * 2, nextLength);
  const capHeight = capsuleGuideCapHeight(guide.radius);
  const previousTopCylinder = previousLength * 0.5 - capHeight;
  const nextTopCylinder = clampedLength * 0.5 - capHeight;
  const previousBottom = -previousLength * 0.5;
  const nextBottom = -clampedLength * 0.5;
  const baseGeometry = createCapsuleGuideGeometry(
    guide.radius,
    previousLength,
    guide.radialLoops,
    guide.lengthLoops
  );
  const basePoints = capsuleControlDataFromGeometry(baseGeometry).points;
  const canMapCage = basePoints.length === guide.controlPoints.length;

  if (canMapCage) {
    guide.controlPoints.forEach((point, pointIndex) => {
      const baseY = basePoints[pointIndex].y;
      let targetBaseY = baseY;
      if (baseY >= previousTopCylinder) {
        targetBaseY += (clampedLength - previousLength) * 0.5;
      } else {
        const cylinderT = THREE.MathUtils.inverseLerp(
          previousBottom,
          previousTopCylinder,
          baseY
        );
        targetBaseY = THREE.MathUtils.lerp(nextBottom, nextTopCylinder, cylinderT);
      }
      point.y += targetBaseY - baseY;
    });
  } else {
    const fallbackScale = clampedLength / previousLength;
    guide.controlPoints.forEach((point) => {
      point.y *= fallbackScale;
    });
  }
  baseGeometry.dispose();

  const direction = guide.end.clone().sub(guide.start);
  if (direction.lengthSq() < 1e-8) direction.set(0, -1, 0);
  guide.end.copy(guide.start).addScaledVector(direction.normalize(), clampedLength);
}

function capsuleControlDataFromGeometry(geometry) {
  const position = geometry.getAttribute("position");
  return {
    points: Array.from({ length: position.count }, (_, index) => new THREE.Vector3(
      position.getX(index),
      position.getY(index),
      position.getZ(index)
    )),
    faces: (geometry.userData.quadFaces || []).map((face) => [...face]),
    loops: (geometry.userData.horizontalLoops || []).map((loop) => [...loop])
  };
}

function capsuleControlGeometryFromData(points, faces) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(
    points.flatMap((point) => [point.x, point.y, point.z]),
    3
  ));
  geometry.setIndex(faces.flatMap((face) => {
    const triangles = [];
    for (let corner = 1; corner < face.length - 1; corner += 1) {
      triangles.push(face[0], face[corner], face[corner + 1]);
    }
    return triangles;
  }));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.userData.quadFaces = faces.map((face) => [...face]);
  geometry.userData.topology = "quads";
  geometry.userData.controlVertexCount = points.length;
  return geometry;
}

function capsuleGuidePointWorldPosition(guide, pointIndex) {
  guide.mesh.updateMatrixWorld(true);
  return guide.controlPoints[pointIndex].clone().applyMatrix4(guide.mesh.matrixWorld);
}

function capsuleGuidePointDistances(guide, originIndex) {
  const adjacency = Array.from({ length: guide.controlPoints.length }, () => new Set());
  guide.controlFaces.forEach((face) => face.forEach((pointIndex, corner) => {
    const nextIndex = face[(corner + 1) % face.length];
    adjacency[pointIndex]?.add(nextIndex);
    adjacency[nextIndex]?.add(pointIndex);
  }));
  const distances = new Array(guide.controlPoints.length).fill(Infinity);
  distances[originIndex] = 0;
  const queue = [originIndex];
  while (queue.length) {
    const pointIndex = queue.shift();
    adjacency[pointIndex].forEach((neighbor) => {
      if (distances[neighbor] <= distances[pointIndex] + 1) return;
      distances[neighbor] = distances[pointIndex] + 1;
      queue.push(neighbor);
    });
  }
  return distances;
}

function capsuleGuideHorizontalLoopsFromTopology(points, faces, preferredLoops = []) {
  const edgeKeys = new Set();
  faces.forEach((face) => face.forEach((pointIndex, corner) => {
    const nextIndex = face[(corner + 1) % face.length];
    edgeKeys.add(pointIndex < nextIndex ? `${pointIndex}:${nextIndex}` : `${nextIndex}:${pointIndex}`);
  }));
  const loops = preferredLoops
    .map((loop) => [...new Set(loop)].filter((pointIndex) => pointIndex >= 0 && pointIndex < points.length))
    .filter((loop) => loop.length >= 4)
    .filter((loop) => loop.every((pointIndex, index) => {
      const nextIndex = loop[(index + 1) % loop.length];
      const key = pointIndex < nextIndex ? `${pointIndex}:${nextIndex}` : `${nextIndex}:${pointIndex}`;
      return edgeKeys.has(key);
    }));
  if (loops.length !== preferredLoops.length) {
    console.warn("Capsule guide contains an incomplete horizontal control loop.");
  }
  return loops;
}

function capsuleGuideLoopCenter(points, indices) {
  return indices.reduce((sum, pointIndex) => sum.add(points[pointIndex]), new THREE.Vector3())
    .multiplyScalar(1 / indices.length);
}

function normalizeCapsuleGuideColor(value) {
  if (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (Number.isFinite(value)) return `#${new THREE.Color(value).getHexString()}`;
  return deps.DEFAULT_CAPSULE_GUIDE_COLOR;
}

function normalizeCapsuleGuideName(value, fallback) {
  const name = typeof value === "string" ? value.trim().slice(0, 60) : "";
  return name || fallback;
}

function capsuleGuideAccentColor(guide, mix = 0) {
  return new THREE.Color(normalizeCapsuleGuideColor(guide?.color))
    .lerp(new THREE.Color(0xffffff), mix);
}

function updateCapsuleGuideDisplayColor(guide) {
  if (!guide || guide.type !== "capsule") return;
  guide.color = normalizeCapsuleGuideColor(guide.color);
  guide.mesh?.material.color.set(0xffffff);
  guide.wire?.material.color.copy(capsuleGuideAccentColor(guide));
  guide.controlWire?.material.color.copy(capsuleGuideAccentColor(guide, 0.3));
  updateCapsuleGuideHandleColors(guide, guide.selectedPointIndex ?? -1);
  const active = deps.sculptState.capsuleGuideLoopDrag || deps.sculptState.capsuleGuideLoopSelection || deps.guideState.capsuleGuideLoopHover;
  refreshCapsuleGuideFillInfluence(guide, active);
}

function updateCapsuleGuideLoopLines(guide) {
  if (!guide.loopLinesGroup) return;
  guide.loopLinesGroup.position.copy(guide.mesh.position);
  guide.loopLinesGroup.quaternion.copy(guide.mesh.quaternion);
  guide.controlLoops.forEach((indices, loopIndex) => {
    const line = guide.loopLinesGroup.children[loopIndex];
    if (!line) return;
    line.geometry.setFromPoints(indices.map((pointIndex) => guide.controlPoints[pointIndex]));
    line.geometry.computeBoundingSphere();
  });
}

function rebuildCapsuleGuideLoopLines(guide) {
  if (guide.loopLinesGroup) {
    deps.guideSurfaceGroup.remove(guide.loopLinesGroup);
    guide.loopLinesGroup.children.forEach((line) => {
      line.geometry.dispose();
      line.material.dispose();
    });
  }
  const group = new THREE.Group();
  group.userData.capsuleGuideId = guide.id;
  guide.controlLoops.forEach((indices, loopIndex) => {
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(indices.map((pointIndex) => guide.controlPoints[pointIndex])),
      new THREE.LineBasicMaterial({
        color: 0xff5bd1,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: false
      })
    );
    line.userData.capsuleGuideId = guide.id;
    line.userData.capsuleGuideLoopIndex = loopIndex;
    line.renderOrder = 28;
    group.add(line);
  });
  guide.loopLinesGroup = group;
  deps.guideSurfaceGroup.add(group);
  updateCapsuleGuideLoopLines(guide);
  group.visible = deps.sculptState.capsuleGuideEditing && deps.sel.selectedGuideId === guide.id;
}

function createCapsuleGuideHandles(guide) {
  const group = new THREE.Group();
  group.userData.capsuleGuideId = guide.id;
  guide.controlPoints.forEach((point, pointIndex) => {
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 8),
      new THREE.MeshBasicMaterial({
        color: capsuleGuideAccentColor(guide, 0.18),
        transparent: true,
        opacity: 0.68,
        depthTest: true,
        depthWrite: false
      })
    );
    handle.position.copy(capsuleGuidePointWorldPosition(guide, pointIndex));
    handle.userData.capsuleGuideId = guide.id;
    handle.userData.capsuleGuidePointIndex = pointIndex;
    group.add(handle);
  });
  group.visible = deps.sculptState.capsuleGuideEditing && deps.sel.selectedGuideId === guide.id;
  return group;
}

function rebuildCapsuleGuideHandles(guide) {
  const wasAttached = deps.transformControls.object?.userData.capsuleGuideId === guide.id;
  if (wasAttached) deps.transformControls.detach();
  if (guide.handlesGroup) {
    deps.guideSurfaceGroup.remove(guide.handlesGroup);
    guide.handlesGroup.children.forEach((handle) => {
      handle.geometry.dispose();
      handle.material.dispose();
    });
  }
  guide.handlesGroup = createCapsuleGuideHandles(guide);
  guide.handlesGroup.visible = deps.componentEditModeActive()
    && deps.sculptState.capsuleGuideEditing
    && guide.id === deps.sel.selectedGuideId;
  deps.guideSurfaceGroup.add(guide.handlesGroup);
  rebuildCapsuleGuideLoopLines(guide);
  if (guide.loopLinesGroup) guide.loopLinesGroup.visible = guide.handlesGroup.visible;
}

function syncCapsuleGuideHandles(guide) {
  guide.handlesGroup?.children.forEach((handle, pointIndex) => {
    handle.position.copy(capsuleGuidePointWorldPosition(guide, pointIndex));
  });
  updateCapsuleGuideLoopLines(guide);
}

function capsuleGuideMirrorMap(points) {
  return points.map((point, pointIndex) => {
    const reflected = new THREE.Vector3(-point.x, point.y, point.z);
    let closestIndex = pointIndex;
    let closestDistance = Infinity;
    points.forEach((candidate, candidateIndex) => {
      const distance = candidate.distanceToSquared(reflected);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = candidateIndex;
      }
    });
    return closestIndex;
  });
}

function mirrorCapsuleGuidePointEdits(points, startPoints, mirrorMap, sourceSide) {
  if (!deps.sculptState.mirrorXEditing) return;
  if (sourceSide === 0) {
    points.forEach((point, pointIndex) => {
      const mirrorIndex = mirrorMap[pointIndex];
      if (mirrorIndex === pointIndex) point.x = 0;
    });
    return;
  }
  startPoints.forEach((startPoint, pointIndex) => {
    if (Math.sign(startPoint.x) !== sourceSide) return;
    const mirrorIndex = mirrorMap[pointIndex];
    if (mirrorIndex === pointIndex || mirrorMap[mirrorIndex] !== pointIndex) return;
    points[mirrorIndex].set(-points[pointIndex].x, points[pointIndex].y, points[pointIndex].z);
  });
}

function updateCapsuleGuideHandleColors(guide, selectedIndex = -1) {
  const distances = selectedIndex >= 0 ? capsuleGuidePointDistances(guide, selectedIndex) : null;
  const mirrorMap = deps.sculptState.mirrorXEditing && selectedIndex >= 0 ? capsuleGuideMirrorMap(guide.controlPoints) : null;
  const mirroredIndex = mirrorMap?.[selectedIndex] ?? -1;
  guide.handlesGroup?.children.forEach((handle, pointIndex) => {
    const selected = pointIndex === selectedIndex;
    const mirrored = pointIndex === mirroredIndex && mirroredIndex !== selectedIndex;
    const influenced = distances && deps.scalpBuilderProportionalWeight(distances[pointIndex]) > 0;
    if (selected) handle.material.color.set(deps.CONTROL_POINT_SELECTED_COLOR);
    else if (mirrored || influenced) handle.material.color.set(0xf2b35f);
    else handle.material.color.copy(capsuleGuideAccentColor(guide, 0.18));
    handle.material.opacity = selected ? 1 : mirrored || influenced ? 0.88 : 0.68;
  });
}

function updateCapsuleGuideFromHandle(handle) {
  const guide = deps.guides.find((item) => item.id === handle.userData.capsuleGuideId && item.type === "capsule");
  const pointIndex = handle.userData.capsuleGuidePointIndex;
  if (!guide || pointIndex === undefined || !guide.controlPoints[pointIndex]) return;
  guide.mesh.updateMatrixWorld(true);
  const localPosition = handle.position.clone().applyMatrix4(guide.mesh.matrixWorld.clone().invert());
  const edit = deps.sculptState.activeCapsuleGuideEdit?.guideId === guide.id && deps.sculptState.activeCapsuleGuideEdit.pointIndex === pointIndex
    ? activeCapsuleGuideEdit
    : null;
  if (edit) {
    const delta = localPosition.sub(edit.startPoints[pointIndex]);
    const selectedX = edit.startPoints[pointIndex].x;
    const sourceSide = Math.abs(selectedX) < 1e-5 ? 0 : Math.sign(selectedX);
    if (deps.sculptState.mirrorXEditing && sourceSide === 0) delta.x = 0;
    guide.controlPoints.forEach((point, index) => {
      if (deps.sculptState.mirrorXEditing && sourceSide !== 0 && Math.sign(edit.startPoints[index].x) !== sourceSide) {
        point.copy(edit.startPoints[index]);
        return;
      }
      const weight = deps.scalpBuilderProportionalWeight(edit.distances[index]);
      point.copy(edit.startPoints[index]).addScaledVector(delta, weight);
    });
    mirrorCapsuleGuidePointEdits(guide.controlPoints, edit.startPoints, edit.mirrorMap, sourceSide);
  } else {
    const startPoints = guide.controlPoints.map((point) => point.clone());
    const mirrorMap = capsuleGuideMirrorMap(startPoints);
    guide.controlPoints[pointIndex].copy(localPosition);
    if (deps.sculptState.mirrorXEditing) {
      const sourceSide = Math.abs(localPosition.x) < 1e-5 ? 0 : Math.sign(localPosition.x);
      mirrorCapsuleGuidePointEdits(guide.controlPoints, startPoints, mirrorMap, sourceSide);
    }
  }
  updateCapsuleGuideGeometry(guide, { preserveControlPoints: true, rebuildHandles: false });
  syncCapsuleGuideHandles(guide);
  updateCapsuleGuideHandleColors(guide, pointIndex);
}

function beginCapsuleGuideHandleEdit(handle) {
  const guide = deps.guides.find((item) => item.id === handle?.userData.capsuleGuideId && item.type === "capsule");
  if (!guide) return;
  const startPoints = guide.controlPoints.map((point) => point.clone());
  if (handle.userData.capsuleGuidePointIndex !== undefined) {
    const pointIndex = handle.userData.capsuleGuidePointIndex;
    deps.sculptState.activeCapsuleGuideEdit = {
      guideId: guide.id,
      pointIndex,
      startPoints,
      distances: capsuleGuidePointDistances(guide, pointIndex),
      mirrorMap: capsuleGuideMirrorMap(startPoints)
    };
  }
}

function selectCapsuleGuidePoint(guide, pointIndex) {
  const handle = guide?.handlesGroup?.children[pointIndex];
  if (!handle) return;
  deps.sculptState.capsuleGuideLoopSelection = null;
  deps.guideState.activeCapsuleGuideLoopTransform = null;
  deps.sel.selectedCurveLatticePoint = null;
  deps.sel.selectedControlPoints = [];
  guide.selectedPointIndex = pointIndex;
  updateCapsuleGuideHandleColors(guide, pointIndex);
  if (deps.sel.activeTool === "select") {
    deps.transformControls.detach();
    return;
  }
  deps.configureTransformControls(deps.sel.activeTool);
  deps.transformControls.attach(handle);
}

function capsuleGuideLoopTransformGuide() {
  return deps.sculptState.capsuleGuideLoopSelection
    ? deps.guides.find((guide) => guide.id === deps.sculptState.capsuleGuideLoopSelection.guideId && guide.type === "capsule")
    : null;
}

function attachCapsuleGuideLoopTransform() {
  const guide = capsuleGuideLoopTransformGuide();
  const loopIndex = deps.sculptState.capsuleGuideLoopSelection?.loopIndex;
  const loop = guide?.controlLoops?.[loopIndex];
  if (!guide || !loop?.length || !["move", "rotate", "scale"].includes(deps.sel.activeTool)) {
    if (deps.transformControls.object?.userData.capsuleGuideLoopHandle) deps.transformControls.detach();
    return;
  }
  guide.mesh.updateMatrixWorld(true);
  deps.capsuleGuideLoopHandle.position.copy(capsuleGuideLoopCenter(guide.controlPoints, loop)).applyMatrix4(guide.mesh.matrixWorld);
  guide.mesh.getWorldQuaternion(deps.capsuleGuideLoopHandle.quaternion);
  deps.capsuleGuideLoopHandle.scale.set(1, 1, 1);
  deps.capsuleGuideLoopHandle.userData.capsuleGuideId = guide.id;
  deps.capsuleGuideLoopHandle.userData.capsuleGuideLoopIndex = loopIndex;
  deps.configureTransformControls(deps.sel.activeTool);
  if (deps.sel.activeTool === "scale") {
    // Plane scaling must stay in the loop's fixed local basis. Showing a
    // world-space gizmo while TransformControls applies local object scale can
    // make the active plane appear to jump or change axes during the drag.
    deps.transformControls.setSpace("local");
    deps.transformControls.showX = true;
    deps.transformControls.showY = true;
    deps.transformControls.showZ = true;
  }
  deps.transformControls.attach(deps.capsuleGuideLoopHandle);
}

function selectCapsuleGuideLoop(guide, loopIndex) {
  if (!guide?.controlLoops?.[loopIndex]?.length) return;
  guide.selectedPointIndex = -1;
  deps.sel.selectedCurveLatticePoint = null;
  deps.sel.selectedControlPoints = [];
  deps.sculptState.capsuleGuideLoopSelection = { guideId: guide.id, loopIndex };
  deps.guideState.activeCapsuleGuideLoopTransform = null;
  updateCapsuleGuideHandleColors(guide);
  setCapsuleGuideLoopHover(guide, loopIndex);
  attachCapsuleGuideLoopTransform();
}

function beginCapsuleGuideLoopTransform() {
  const guide = capsuleGuideLoopTransformGuide();
  const loopIndex = deps.sculptState.capsuleGuideLoopSelection?.loopIndex;
  if (!guide?.controlLoops?.[loopIndex]?.length || !["move", "rotate", "scale"].includes(deps.sel.activeTool)) return;
  guide.mesh.updateMatrixWorld(true);
  deps.guideState.activeCapsuleGuideLoopTransform = {
    guideId: guide.id,
    loopIndex,
    mode: deps.sel.activeTool,
    startPoints: guide.controlPoints.map((point) => point.clone()),
    loopCenters: guide.controlLoops.map((indices) => capsuleGuideLoopCenter(guide.controlPoints, indices)),
    worldMatrix: guide.mesh.matrixWorld.clone(),
    inverseWorldMatrix: guide.mesh.matrixWorld.clone().invert(),
    startPosition: deps.capsuleGuideLoopHandle.position.clone(),
    startQuaternion: deps.capsuleGuideLoopHandle.quaternion.clone(),
    startScale: deps.capsuleGuideLoopHandle.scale.clone()
  };
}

function updateCapsuleGuideLoopTransform() {
  const edit = deps.guideState.activeCapsuleGuideLoopTransform;
  if (!edit) return;
  const guide = deps.guides.find((item) => item.id === edit.guideId && item.type === "capsule");
  if (!guide) return;
  const worldDelta = deps.capsuleGuideLoopHandle.position.clone().sub(edit.startPosition);
  const rotationDelta = deps.capsuleGuideLoopHandle.quaternion.clone().multiply(edit.startQuaternion.clone().invert());
  const scaleDelta = deps.capsuleGuideLoopHandle.scale.clone().divide(edit.startScale);
  const identity = new THREE.Quaternion();
  const scalePivot = edit.loopCenters[edit.loopIndex];
  guide.controlLoops.forEach((indices, loopIndex) => {
    const distance = Math.abs(loopIndex - edit.loopIndex);
    const weight = loopIndex === edit.loopIndex
      ? 1
      : deps.sculptState.proportionalEditing ? deps.scalpBuilderProportionalWeight(distance) : 0;
    if (weight <= 0) return;
    const centerWorld = edit.loopCenters[loopIndex].clone().applyMatrix4(edit.worldMatrix);
    const weightedRotation = identity.clone().slerp(rotationDelta, weight);
    indices.forEach((pointIndex) => {
      const worldPoint = edit.startPoints[pointIndex].clone().applyMatrix4(edit.worldMatrix);
      if (edit.mode === "move") {
        worldPoint.addScaledVector(worldDelta, weight);
        guide.controlPoints[pointIndex].copy(worldPoint.applyMatrix4(edit.inverseWorldMatrix));
      } else if (edit.mode === "rotate") {
        worldPoint.sub(centerWorld).applyQuaternion(weightedRotation).add(centerWorld);
        guide.controlPoints[pointIndex].copy(worldPoint.applyMatrix4(edit.inverseWorldMatrix));
      } else {
        const weightedScale = new THREE.Vector3(
          THREE.MathUtils.lerp(1, scaleDelta.x, weight),
          THREE.MathUtils.lerp(1, scaleDelta.y, weight),
          THREE.MathUtils.lerp(1, scaleDelta.z, weight)
        );
        const point = edit.startPoints[pointIndex];
        guide.controlPoints[pointIndex].copy(point)
          .sub(scalePivot)
          .multiply(weightedScale)
          .add(scalePivot);
      }
    });
  });
  updateCapsuleGuideGeometry(guide, { preserveControlPoints: true, rebuildHandles: false });
  syncCapsuleGuideHandles(guide);
  refreshCapsuleGuideLoopInfluence();
}

function refreshCapsuleGuideFillInfluence(guide, active) {
  const position = guide.mesh?.geometry?.getAttribute("position");
  if (!position) return;
  let color = guide.mesh.geometry.getAttribute("color");
  if (!color || color.count !== position.count) {
    color = new THREE.Float32BufferAttribute(new Float32Array(position.count * 3), 3);
    guide.mesh.geometry.setAttribute("color", color);
  }
  const base = capsuleGuideAccentColor(guide);
  const selectedColor = new THREE.Color(0xff77dc);
  const influencedColor = new THREE.Color(0xffc56c);
  const matchesGuide = active && active.guideId === guide.id;
  const loopY = guide.controlLoops.map((indices) => capsuleGuideLoopCenter(guide.controlPoints, indices).y);
  for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
    let nearestLoop = -1;
    let nearestDistance = Infinity;
    if (matchesGuide) {
      loopY.forEach((y, loopIndex) => {
        const distance = Math.abs(position.getY(vertexIndex) - y);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestLoop = loopIndex;
        }
      });
    }
    const loopDistance = nearestLoop >= 0 ? Math.abs(nearestLoop - active.loopIndex) : Infinity;
    const weight = nearestLoop >= 0 ? deps.scalpBuilderProportionalWeight(loopDistance) : 0;
    const next = base.clone();
    if (nearestLoop === active?.loopIndex) next.lerp(selectedColor, 0.98);
    else if (weight > 0) next.lerp(influencedColor, 0.92 * Math.sqrt(weight));
    color.setXYZ(vertexIndex, next.r, next.g, next.b);
  }
  color.needsUpdate = true;
}

function refreshCapsuleGuideLoopInfluence() {
  const active = deps.sculptState.capsuleGuideLoopDrag || deps.sculptState.capsuleGuideLoopSelection || deps.guideState.capsuleGuideLoopHover;
  deps.guides.forEach((guide) => guide.loopLinesGroup?.children.forEach((line) => {
    const loopIndex = line.userData.capsuleGuideLoopIndex;
    const matchesGuide = active && guide.id === active.guideId;
    const distance = matchesGuide ? Math.abs(loopIndex - active.loopIndex) : Infinity;
    const weight = matchesGuide ? deps.scalpBuilderProportionalWeight(distance) : 0;
    const selected = matchesGuide && distance === 0;
    line.material.color.setHex(selected ? 0xff5bd1 : 0xf2b35f);
    line.material.opacity = selected ? 0.96 : weight > 0 ? 0.12 + weight * 0.68 : 0;
  }));
  deps.guides.filter((guide) => guide.type === "capsule").forEach((guide) => refreshCapsuleGuideFillInfluence(guide, active));
}

function setCapsuleGuideLoopHover(guide, loopIndex = -1) {
  const next = guide && loopIndex >= 0 ? { guideId: guide.id, loopIndex } : null;
  deps.guideState.capsuleGuideLoopHover = next;
  refreshCapsuleGuideLoopInfluence();
}

function capsuleGuideLoopHitFromEvent(event) {
  const guide = getSelectedGuide();
  if (!deps.sculptState.capsuleGuideEditing || guide?.type !== "capsule" || !guide.loopLinesGroup?.visible) return null;
  const rect = deps.renderer.domElement.getBoundingClientRect();
  deps.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  deps.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  deps.raycaster.setFromCamera(deps.pointer, deps.camera);
  const previousThreshold = deps.raycaster.params.Line.threshold;
  deps.raycaster.params.Line.threshold = 0.055;
  const hit = deps.raycaster.intersectObjects(guide.loopLinesGroup.children, false)[0] || null;
  deps.raycaster.params.Line.threshold = previousThreshold;
  if (!hit) return null;
  const surfaceHit = deps.raycaster.intersectObject(guide.mesh, false)[0] || null;
  if (surfaceHit && hit.distance > surfaceHit.distance + 0.09) return null;
  return { guide, hit, loopIndex: hit.object.userData.capsuleGuideLoopIndex };
}

function updateCapsuleGuideLoopHover(event) {
  if (!deps.sculptState.capsuleGuideEditing || deps.sculptState.capsuleGuideLoopDrag || deps.sculptState.transformDragging) return;
  if (!deps.renderer.domElement.contains(event.target) || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    setCapsuleGuideLoopHover(null);
    return;
  }
  const result = capsuleGuideLoopHitFromEvent(event);
  setCapsuleGuideLoopHover(result?.guide, result?.loopIndex ?? -1);
  deps.renderer.domElement.style.cursor = result ? "pointer" : "";
}

function beginCapsuleGuideLoopDrag(event) {
  if (!deps.sculptState.capsuleGuideEditing || !["select", "move", "rotate", "scale"].includes(deps.sel.activeTool)) return false;
  const result = capsuleGuideLoopHitFromEvent(event);
  if (!result) return false;
  const { guide, loopIndex } = result;
  const loop = guide.controlLoops[loopIndex];
  if (!loop?.length) return false;
  selectCapsuleGuideLoop(guide, loopIndex);
  return true;
}

function updateCapsuleGuideLoopDrag(event) {
  const drag = deps.sculptState.capsuleGuideLoopDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const guide = deps.guides.find((item) => item.id === drag.guideId && item.type === "capsule");
  if (!guide) return;
  const pointerDelta = new THREE.Vector2(event.clientX - drag.startX, event.clientY - drag.startY);
  const radialPixels = pointerDelta.dot(drag.radialScreen);
  const targetScale = THREE.MathUtils.clamp(Math.exp(radialPixels / 150), 0.08, 12);
  guide.controlLoops.forEach((indices, loopIndex) => {
    const distance = Math.abs(loopIndex - drag.loopIndex);
    const weight = loopIndex === drag.loopIndex
      ? 1
      : deps.sculptState.proportionalEditing ? deps.scalpBuilderProportionalWeight(distance) : 0;
    if (weight <= 0) return;
    const scale = 1 + (targetScale - 1) * weight;
    const center = drag.loopCenters[loopIndex];
    indices.forEach((pointIndex) => {
      const source = drag.startPoints[pointIndex];
      guide.controlPoints[pointIndex].set(
        center.x + (source.x - center.x) * scale,
        source.y,
        center.z + (source.z - center.z) * scale
      );
    });
  });
  updateCapsuleGuideGeometry(guide, { preserveControlPoints: true, rebuildHandles: false });
  syncCapsuleGuideHandles(guide);
  event.preventDefault();
}

function endCapsuleGuideLoopDrag(event) {
  const drag = deps.sculptState.capsuleGuideLoopDrag;
  if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
  deps.sculptState.capsuleGuideLoopDrag = null;
  if (deps.renderer.domElement.hasPointerCapture?.(drag.pointerId)) deps.renderer.domElement.releasePointerCapture(drag.pointerId);
  deps.renderer.domElement.style.cursor = "";
  deps.updateInteractionLocks();
  updateCapsuleGuideLoopHover(event || { target: null });
}

function createSubdividedQuadGeometry(controlGeometry, iterations = 2) {
  const position = controlGeometry.getAttribute("position");
  const controlPoints = Array.from({ length: position.count }, (_, index) => new THREE.Vector3(
    position.getX(index),
    position.getY(index),
    position.getZ(index)
  ));
  const controlFaces = (controlGeometry.userData.quadFaces || []).map((indices) => ({
    indices: [...indices],
    region: "surface-guide"
  }));
  const controlEdgeKeys = new Set();
  controlFaces.forEach((face) => {
    face.indices.forEach((start, corner) => {
      const end = face.indices[(corner + 1) % face.indices.length];
      controlEdgeKeys.add(start < end ? `${start}:${end}` : `${end}:${start}`);
    });
  });
  const subdivided = deps.subdivideScalpBuilderCage(controlPoints, controlFaces, iterations, controlEdgeKeys);
  const positions = subdivided.points.flatMap((point) => [point.x, point.y, point.z]);
  const quads = subdivided.faces.map((face) => face.indices);
  const indices = quads.flatMap((face) => {
    const triangles = [];
    for (let corner = 1; corner < face.length - 1; corner += 1) {
      triangles.push(face[0], face[corner], face[corner + 1]);
    }
    return triangles;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.userData.quadFaces = quads;
  geometry.userData.topology = "subdivided-quads";
  geometry.userData.subdivisionLevel = iterations;
  geometry.userData.controlVertexCount = position.count;
  geometry.userData.emphasizedEdges = subdivided.trackedEdges;
  return geometry;
}

function createEmphasizedSubdivisionEdges(geometry) {
  const position = geometry.getAttribute("position");
  const edgePositions = [];
  (geometry.userData.emphasizedEdges || []).forEach((key) => {
    const [a, b] = key.split(":").map(Number);
    edgePositions.push(
      position.getX(a), position.getY(a), position.getZ(a),
      position.getX(b), position.getY(b), position.getZ(b)
    );
  });
  const emphasized = new THREE.BufferGeometry();
  emphasized.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  emphasized.userData.topology = "subdivided-control-edges";
  return emphasized;
}

function createQuadCageGeometry(geometry) {
  const position = geometry.getAttribute("position");
  const quads = geometry.userData.quadFaces || [];
  const edgeKeys = new Set();
  const edgePositions = [];
  quads.forEach((quad) => {
    for (let index = 0; index < quad.length; index += 1) {
      const a = quad[index];
      const b = quad[(index + 1) % quad.length];
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edgePositions.push(
        position.getX(a), position.getY(a), position.getZ(a),
        position.getX(b), position.getY(b), position.getZ(b)
      );
    }
  });
  const cage = new THREE.BufferGeometry();
  cage.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  cage.userData.topology = "quad-cage";
  return cage;
}

function updateCapsuleGuideGeometry(guide, { preserveControlPoints = false, rebuildHandles = true } = {}) {
  const start = guide.start.clone();
  const end = guide.end.clone();
  const direction = end.clone().sub(start);
  const minimumLength = 0.04;
  if (direction.lengthSq() < 1e-8) direction.set(0, -1, 0);
  direction.setLength(Math.max(minimumLength, direction.length()));
  guide.end.copy(start).add(direction);
  guide.length = direction.length();
  guide.x = (guide.start.x + guide.end.x) * 0.5;
  guide.y = (guide.start.y + guide.end.y) * 0.5;
  guide.z = (guide.start.z + guide.end.z) * 0.5;
  guide.width = guide.radius * 2;
  guide.height = guide.length;
  guide.depth = guide.radius * 2;
  let controlGeometry;
  if (preserveControlPoints && guide.controlPoints?.length && guide.controlFaces?.length) {
    controlGeometry = capsuleControlGeometryFromData(guide.controlPoints, guide.controlFaces);
  } else {
    controlGeometry = createCapsuleGuideGeometry(guide.radius, guide.length, guide.radialLoops, guide.lengthLoops);
    const controlData = capsuleControlDataFromGeometry(controlGeometry);
    guide.controlPoints = controlData.points;
    guide.controlFaces = controlData.faces;
    guide.controlLoops = capsuleGuideHorizontalLoopsFromTopology(
      controlData.points,
      controlData.faces,
      controlData.loops
    );
  }
  const geometry = createSubdividedQuadGeometry(controlGeometry, guide.subdivisionSteps);
  guide.controlGeometry?.dispose();
  guide.mesh.geometry.dispose();
  guide.wire.geometry.dispose();
  guide.controlWire.geometry.dispose();
  guide.controlGeometry = controlGeometry;
  guide.mesh.geometry = geometry;
  guide.wire.geometry = createQuadCageGeometry(geometry);
  guide.controlWire.geometry = createEmphasizedSubdivisionEdges(geometry);
  guide.mesh.position.set(guide.x, guide.y, guide.z);
  guide.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), direction.normalize());
  guide.wire.position.copy(guide.mesh.position);
  guide.wire.quaternion.copy(guide.mesh.quaternion);
  guide.controlWire.position.copy(guide.mesh.position);
  guide.controlWire.quaternion.copy(guide.mesh.quaternion);
  guide.mesh.material.opacity = guide.opacity;
  updateCapsuleGuideFresnelMaterial(guide);
  refreshCapsuleGuideFillInfluence(
    guide,
    deps.sculptState.capsuleGuideLoopDrag || deps.sculptState.capsuleGuideLoopSelection || deps.guideState.capsuleGuideLoopHover
  );
  if (rebuildHandles) rebuildCapsuleGuideHandles(guide);
}

function createCapsuleGuideMaterial(guide) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.58,
    metalness: 0,
    vertexColors: true,
    transparent: true,
    opacity: guide.opacity,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const uniforms = {
    enabled: { value: guide.fresnel ? 1 : 0 },
    centerVisibility: { value: guide.centerVisibility }
  };
  material.userData.capsuleFresnelUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.capsuleFresnelEnabled = uniforms.enabled;
    shader.uniforms.capsuleCenterVisibility = uniforms.centerVisibility;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "void main() {",
        "uniform float capsuleFresnelEnabled;\nuniform float capsuleCenterVisibility;\nvoid main() {"
      )
      .replace(
        "#include <opaque_fragment>",
        `float capsuleFacing = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
         float capsuleRim = pow(1.0 - capsuleFacing, 4.0);
         float capsuleCenterAlpha = capsuleCenterVisibility * capsuleCenterVisibility;
         float capsuleAlpha = mix(capsuleCenterAlpha, 1.0, capsuleRim);
         diffuseColor.a *= mix(1.0, capsuleAlpha, capsuleFresnelEnabled);
         #include <opaque_fragment>`
      );
  };
  material.customProgramCacheKey = () => "capsule-fresnel-v2";
  return material;
}

function updateCapsuleGuideWireOpacity(guide, selected = guide?.id === deps.sel.selectedGuideId) {
  if (!guide || guide.type !== "capsule") return;
  const centerVisibility = THREE.MathUtils.clamp(Number(guide.centerVisibility ?? 0.5), 0, 1);
  const fade = guide.fresnel && !selected
    ? 0.02 + centerVisibility * centerVisibility * 0.98
    : 1;
  if (guide.wire) guide.wire.material.opacity = (selected ? 0.16 : 0.06) * fade;
  if (guide.controlWire) guide.controlWire.material.opacity = (selected ? 0.7 : 0.25) * fade;
}

function updateCapsuleGuideFresnelMaterial(guide) {
  const uniforms = guide?.mesh?.material?.userData?.capsuleFresnelUniforms;
  if (!uniforms) return;
  uniforms.enabled.value = guide.fresnel ? 1 : 0;
  uniforms.centerVisibility.value = THREE.MathUtils.clamp(Number(guide.centerVisibility ?? 0.5), 0, 1);
  updateCapsuleGuideWireOpacity(guide);
}

function addCapsuleGuide(overrides = {}, { deferUi = false } = {}) {
  const start = overrides.start?.isVector3 ? overrides.start.clone() : deps.dataToVector(overrides.start || { x: 0, y: 1.4, z: 0 });
  const fallbackEnd = start.clone().add(new THREE.Vector3(0, -Number(overrides.length ?? deps.surfaceGuideDefaults.length), 0));
  const fallbackName = `Capsule Guide ${deps.guides.filter((item) => item.type === "capsule").length + 1}`;
  const guide = {
    id: overrides.id || crypto.randomUUID(),
    type: "capsule",
    name: normalizeCapsuleGuideName(overrides.name, fallbackName),
    color: normalizeCapsuleGuideColor(overrides.color),
    start,
    end: overrides.end?.isVector3 ? overrides.end.clone() : overrides.end ? deps.dataToVector(overrides.end) : fallbackEnd,
    radius: Math.max(0.02, Number(overrides.radius ?? deps.surfaceGuideDefaults.radius)),
    radialLoops: Math.max(6, Math.round(Number(overrides.radialLoops ?? deps.surfaceGuideDefaults.radialLoops) / 2) * 2),
    lengthLoops: Math.max(4, Math.round(Number(overrides.lengthLoops ?? deps.surfaceGuideDefaults.lengthLoops))),
    subdivisionSteps: THREE.MathUtils.clamp(Math.round(Number(overrides.subdivisionSteps ?? deps.surfaceGuideDefaults.subdivisionSteps)), 0, 2),
    opacity: Number(overrides.opacity ?? deps.surfaceGuideDefaults.opacity),
    fresnel: overrides.fresnel ?? deps.surfaceGuideDefaults.fresnel,
    centerVisibility: THREE.MathUtils.clamp(Number(overrides.centerVisibility ?? deps.surfaceGuideDefaults.centerVisibility), 0, 1),
    outlinerVisible: overrides.outlinerVisible !== false,
    bend: 0,
    verticalBend: 0,
    topCurve: 0,
    bottomCurve: 0,
    density: 8
  };
  guide.length = Math.max(guide.radius * 2, guide.start.distanceTo(guide.end));
  guide.controlGeometry = createCapsuleGuideGeometry(guide.radius, guide.length, guide.radialLoops, guide.lengthLoops);
  const initialControlData = capsuleControlDataFromGeometry(guide.controlGeometry);
  guide.controlPoints = overrides.controlPoints?.length
    ? overrides.controlPoints.map((point) => point.isVector3 ? point.clone() : deps.dataToVector(point))
    : initialControlData.points;
  guide.controlFaces = overrides.controlFaces?.length
    ? overrides.controlFaces.map((face) => [...face])
    : initialControlData.faces;
  guide.controlLoops = capsuleGuideHorizontalLoopsFromTopology(
    guide.controlPoints,
    guide.controlFaces,
    initialControlData.loops
  );
  guide.mesh = new THREE.Mesh(
    createSubdividedQuadGeometry(guide.controlGeometry, guide.subdivisionSteps),
    createCapsuleGuideMaterial(guide)
  );
  guide.wire = new THREE.LineSegments(
    createQuadCageGeometry(guide.mesh.geometry),
    new THREE.LineBasicMaterial({ color: capsuleGuideAccentColor(guide), transparent: true, opacity: 0.16, depthWrite: false })
  );
  guide.controlWire = new THREE.LineSegments(
    createEmphasizedSubdivisionEdges(guide.mesh.geometry),
    new THREE.LineBasicMaterial({ color: capsuleGuideAccentColor(guide, 0.3), transparent: true, opacity: 0.7, depthWrite: false })
  );
  guide.mesh.userData.guideId = guide.id;
  guide.wire.userData.guideId = guide.id;
  guide.controlWire.userData.guideId = guide.id;
  deps.guides.push(guide);
  deps.guideSurfaceGroup.add(guide.mesh, guide.wire, guide.controlWire);
  updateCapsuleGuideGeometry(guide, {
    preserveControlPoints: Boolean(overrides.controlPoints?.length && overrides.controlFaces?.length)
  });
  updateCapsuleGuideDisplayColor(guide);
  deps.refreshLiveSurfaceOptions();
  if (!deferUi) {
    selectGuide(guide.id);
    deps.updateCount();
  }
  applyCapsuleGuideDisplayVisibility();
  return guide;
}

function addGuide(overrides = {}) {
  const guide = {
    id: crypto.randomUUID(),
    x: 0,
    y: 0.72,
    z: 0.42,
    width: 1.7,
    height: 1.5,
    depth: 1,
    bend: 95,
    verticalBend: 0,
    topCurve: 0,
    bottomCurve: 0,
    density: 12,
    opacity: 0.28,
    outlinerVisible: overrides.outlinerVisible !== false,
    ...overrides
  };
  guide.mesh = new THREE.Mesh(
    createGuideGeometry(guide),
    new THREE.MeshStandardMaterial({
      color: 0x75c9ff,
      roughness: 0.54,
      metalness: 0,
      transparent: true,
      opacity: guide.opacity,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  guide.mesh.position.set(guide.x, guide.y, guide.z);
  if (guide.objectQuaternion) {
    guide.mesh.quaternion.set(
      Number(guide.objectQuaternion.x || 0),
      Number(guide.objectQuaternion.y || 0),
      Number(guide.objectQuaternion.z || 0),
      Number(guide.objectQuaternion.w ?? 1)
    ).normalize();
  }
  if (guide.objectScale) {
    guide.mesh.scale.set(
      Number(guide.objectScale.x ?? 1),
      Number(guide.objectScale.y ?? 1),
      Number(guide.objectScale.z ?? 1)
    );
  }
  guide.mesh.userData.guideId = guide.id;
  guide.wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(guide.mesh.geometry),
    new THREE.LineBasicMaterial({ color: 0xb8e7ff, transparent: true, opacity: 0.62, depthWrite: false })
  );
  guide.wire.position.copy(guide.mesh.position);
  guide.wire.quaternion.copy(guide.mesh.quaternion);
  guide.wire.scale.copy(guide.mesh.scale);
  guide.wire.userData.guideId = guide.id;
  deps.guideSurfaceGroup.add(guide.mesh, guide.wire);
  deps.guides.push(guide);
  selectGuide(guide.id);
  deps.updateCount();
}

function createGuideGeometry(guide) {
  const bendRadians = THREE.MathUtils.degToRad(guide.bend);
  const verticalRadians = THREE.MathUtils.degToRad(guide.verticalBend);
  const xSegments = Math.max(2, Math.ceil(guide.width * guide.density));
  const ySegments = Math.max(2, Math.ceil(guide.height * guide.density));
  const vertices = [];
  const indices = [];

  for (let iy = 0; iy <= ySegments; iy += 1) {
    const v = iy / ySegments;
    const flatY = (v - 0.5) * guide.height;
    for (let ix = 0; ix <= xSegments; ix += 1) {
      const u = ix / xSegments;
      const flatX = (u - 0.5) * guide.width;
      let x = flatX;
      let y = flatY;
      let z = 0;
      if (Math.abs(bendRadians) > 0.001) {
        const radius = guide.width / bendRadians;
        const phi = (u - 0.5) * bendRadians;
        x = Math.sin(phi) * radius;
        z = (Math.cos(phi) - 1) * radius * guide.depth;
      }
      if (Math.abs(verticalRadians) > 0.001) {
        const edgeCurve = THREE.MathUtils.lerp(guide.bottomCurve, guide.topCurve, v);
        const phiY = (v - 0.5) * verticalRadians;
        const radiusY = guide.height / Math.max(Math.abs(verticalRadians), 0.001);
        const influence = Math.min(1, Math.abs(edgeCurve));
        const curvedY = Math.sin(phiY) * radiusY;
        const curvedZ = (Math.cos(phiY) - 1) * radiusY * guide.depth * Math.sign(verticalRadians);
        y = THREE.MathUtils.lerp(flatY, curvedY, influence);
        z += curvedZ * edgeCurve;
      }
      vertices.push(x, y, z);
    }
  }

  const row = xSegments + 1;
  for (let iy = 0; iy < ySegments; iy += 1) {
    for (let ix = 0; ix < xSegments; ix += 1) {
      const a = iy * row + ix;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function selectGuide(id) {
  deps.setViewportEditMode("guide", { clearSelection: false, activateSelect: false });
  setCurveLatticeLoopHover(null);
  deps.sculptState.capsuleGuideLoopSelection = null;
  deps.guideState.activeCapsuleGuideLoopTransform = null;
  clearMultiPointSelection();
  deps.clearStrandSelectionState();
  deps.sel.selectedCurveSurfaceController = null;
  deps.sel.clumpViewportSelection = false;
  deps.sel.selectedStrandGroup = null;
  deps.sel.selectedGuideId = id;
  deps.sel.selectedReferenceImageId = null;
  deps.sel.selectedPoint = null;
  deps.sel.selectedSurfaceObjectAnchorId = null;
  deps.sel.selectedCurveLatticePoint = null;
  deps.setOutlinerTab("guides");
  deps.updateSelectedPointLabel();
  const guide = getSelectedGuide();
  if (guide?.type === "curve-lattice") deps.sel.activeCurveLatticeGuideId = guide.id;
  const editingCurveLattice = guide?.type === "curve-lattice";
  if (deps.componentEditModeActive() && editingCurveLattice && ["rotate", "scale"].includes(deps.sel.activeTool)) deps.setActiveTool("move");
  deps.curveLatticeToggle.classList.toggle("active", editingCurveLattice);
  deps.curveLatticeToggle.setAttribute("aria-pressed", String(editingCurveLattice));
  deps.filterCurveLatticesToGroup(editingCurveLattice ? guide.id : null);
  updateGuideControlsVisibility();
  deps.transformControls.detach();
  deps.locks.forEach((lock) => {
    deps.setStrandSelectionVisual(lock);
    deps.updateCurveObjects(lock, { visible: false });
  });
  deps.renderLockList();
  renderGuideOutliner();
  deps.updateAttributeEditorMode();
  deps.guides.forEach((item) => {
    const selected = item.id === id;
    if (item.type === "curve-lattice") {
      const displayColor = new THREE.Color(item.color);
      if (selected) displayColor.lerp(new THREE.Color(0xffffff), 0.18);
      item.mesh.material.color.copy(displayColor);
      item.wire.material.color.copy(displayColor);
      item.rootMesh?.material.color.copy(displayColor);
      item.rootWire?.material.color.copy(displayColor);
    } else {
      updateCapsuleGuideDisplayColor(item);
    }
    item.mesh.material.opacity = selected ? item.opacity : Math.min(item.opacity, 0.16);
    if (item.rootMesh) item.rootMesh.material.opacity = item.mesh.material.opacity;
    item.wire.material.opacity = selected ? 0.7 : 0.25;
    if (item.type === "capsule") updateCapsuleGuideWireOpacity(item, selected);
    else if (item.controlWire) item.controlWire.material.opacity = selected ? 0.7 : 0.25;
    if (item.rootWire) item.rootWire.material.opacity = item.wire.material.opacity;
    if (item.handlesGroup) {
      item.handlesGroup.visible = deps.componentEditModeActive()
        && selected
        && (item.type !== "capsule" || deps.sculptState.capsuleGuideEditing);
    }
    if (item.loopLinesGroup) {
      item.loopLinesGroup.visible = deps.componentEditModeActive() && selected && deps.sculptState.capsuleGuideEditing;
    }
  });
  applyCapsuleGuideDisplayVisibility();
  deps.refreshRebuildCurveDialog();
  if (!guide) return;
  syncGuideInputs(guide);
  deps.updatePlacementStatus();
  if (!deps.componentEditModeActive()) deps.attachGuideObjectTransform();
}

function updateGuideControlsVisibility() {
  const guide = getSelectedGuide();
  const hasSelectedGuide = Boolean(guide);
  deps.guideControls.forEach((element) => {
    element.classList.toggle("hidden", !hasSelectedGuide);
  });
  document.querySelector("#guideControls").classList.toggle("hidden", !hasSelectedGuide || ["curve-lattice", "capsule"].includes(guide?.type));
  const showCurveLatticeControls = CURVE_LATTICE_FEATURE_ENABLED
    && guide?.type === "curve-lattice"
    && guide.standalone;
  deps.curveLatticeControls.classList.toggle("hidden", !showCurveLatticeControls);
  deps.curveLatticeControls.hidden = !showCurveLatticeControls;
  deps.curveLatticeControls.setAttribute("aria-hidden", String(!showCurveLatticeControls));
  deps.guidePanelTitle.textContent = guide?.type === "curve-lattice" ? "Curve Lattice Guide" : guide?.type === "capsule" ? "Capsule Guide" : "Curve Guides";
  updateViewportToolVisibility();
}

function updateViewportToolVisibility() {
  const guideMode = deps.sculptState.viewportEditMode === "guide";
  const referenceMode = deps.sculptState.viewportEditMode === "reference";
  const setupEditorActive = deps.scalpState.scalpShapeEditing
    || deps.scalpState.scalpPaintEditing
    || deps.sculptState.headSetupEditing
    || deps.scalpState.scalpBuilderEditing
    || deps.sculptState.capsuleGuideEditing;
  const selectedGuide = getSelectedGuide();
  const latticeSelected = selectedGuide?.type === "curve-lattice";
  const surfaceSelected = deps.sculptState.viewportEditMode === "strand" && deps.getSelectedLock()?.geometryType === "surface";
  const surfaceAnchorSelected = surfaceSelected && deps.sel.selectedSurfaceObjectAnchorId === deps.getSelectedLock()?.id;
  deps.modeToolButtons.forEach((button) => {
    const tool = button.dataset.tool;
    const guideToolAllowed = ["select", "move", "rotate", "scale", "draw-capsule-guide"].includes(tool)
      && !(deps.componentEditModeActive() && latticeSelected && ["rotate", "scale"].includes(tool));
    const surfaceToolBlocked = surfaceSelected
      && (tool === "relax" || (!surfaceAnchorSelected && ["rotate", "scale"].includes(tool)));
    const referenceToolAllowed = ["select", "move", "scale"].includes(tool);
    button.classList.toggle(
      "edit-mode-tool-hidden",
      (guideMode && !guideToolAllowed)
        || (referenceMode && !referenceToolAllowed)
        || surfaceToolBlocked
    );
  });
  deps.viewportCapsuleGuideTool.classList.toggle("hidden", !guideMode);
  deps.viewportCapsuleGuideTool.classList.toggle("active", guideMode && deps.sculptState.capsuleGuideEditing);
  deps.viewportCapsuleGuideTool.setAttribute("aria-pressed", String(guideMode && deps.sculptState.capsuleGuideEditing));
  deps.viewportDrawCapsuleGuideTool.classList.toggle("hidden", !guideMode);
  deps.viewportDrawCapsuleGuideTool.classList.toggle("active", guideMode && deps.sel.activeTool === "draw-capsule-guide");
  deps.viewportDrawCapsuleGuideTool.setAttribute("aria-pressed", String(guideMode && deps.sel.activeTool === "draw-capsule-guide"));
  deps.viewportCurveLatticeGuideTool.classList.toggle("hidden", !guideMode || !CURVE_LATTICE_FEATURE_ENABLED);
  deps.viewportCurveLatticeGuideTool.classList.toggle("active", guideMode && latticeSelected);
  deps.viewportCurveLatticeGuideTool.setAttribute("aria-pressed", String(guideMode && latticeSelected));
  deps.sculptBrushDock.classList.toggle("hidden", deps.sculptState.viewportEditMode !== "strand" || setupEditorActive);
  if (deps.sculptState.viewportEditMode !== "strand" || setupEditorActive) deps.setSculptBrushCursorVisible(false);
}

function getSelectedGuide() {
  return deps.guides.find((guide) => guide.id === deps.sel.selectedGuideId);
}

function syncGuideInputs(guide) {
  if (guide.type === "capsule") {
    deps.surfaceGuideNameInput.value = guide.name;
    deps.surfaceGuideColorInput.value = normalizeCapsuleGuideColor(guide.color);
    deps.surfaceGuideInputs.radius.value = guide.radius;
    deps.surfaceGuideInputs.length.value = guide.length;
    deps.surfaceGuideInputs.radialLoops.value = guide.radialLoops;
    deps.surfaceGuideInputs.lengthLoops.value = guide.lengthLoops;
    deps.surfaceGuideInputs.subdivisionSteps.value = guide.subdivisionSteps;
    deps.surfaceGuideInputs.opacity.value = guide.opacity;
    deps.surfaceGuideInputs.centerVisibility.value = guide.centerVisibility;
    deps.surfaceGuideFresnelInput.checked = guide.fresnel;
    deps.surfaceGuideValues.radius.textContent = guide.radius.toFixed(2);
    deps.surfaceGuideValues.length.textContent = guide.length.toFixed(2);
    deps.surfaceGuideValues.radialLoops.textContent = String(guide.radialLoops);
    deps.surfaceGuideValues.lengthLoops.textContent = String(guide.lengthLoops);
    deps.surfaceGuideValues.subdivisionSteps.textContent = String(guide.subdivisionSteps);
    deps.surfaceGuideValues.opacity.textContent = guide.opacity.toFixed(2);
    deps.surfaceGuideValues.centerVisibility.textContent = guide.centerVisibility.toFixed(2);
    return;
  }
  if (guide.type === "curve-lattice") {
    deps.curveLatticeOpacityInput.value = guide.opacity;
    deps.curveLatticeHorizontalLoopsInput.value = guide.rows;
    deps.curveLatticeHorizontalLoopsValue.value = String(guide.rows);
    deps.curveLatticeVerticalLoopsInput.value = guide.columns;
    deps.curveLatticeVerticalLoopsValue.value = String(guide.columns);
    return;
  }
  deps.guideInputs.x.value = guide.x;
  deps.guideInputs.y.value = guide.y;
  deps.guideInputs.z.value = guide.z;
  deps.guideInputs.width.value = guide.width;
  deps.guideInputs.height.value = guide.height;
  deps.guideInputs.depth.value = guide.depth;
  deps.guideInputs.bend.value = guide.bend;
  deps.guideInputs.verticalBend.value = guide.verticalBend;
  deps.guideInputs.topCurve.value = guide.topCurve;
  deps.guideInputs.bottomCurve.value = guide.bottomCurve;
  deps.guideInputs.density.value = guide.density;
  deps.guideInputs.opacity.value = guide.opacity;
}

function updateGuideGeometry(guide) {
  if (guide.type === "capsule") {
    updateCapsuleGuideGeometry(guide);
    selectGuide(guide.id);
    return;
  }
  if (guide.type === "curve-lattice") {
    updateCurveLatticeGeometry(guide);
    selectGuide(guide.id);
    return;
  }
  guide.mesh.geometry.dispose();
  guide.wire.geometry.dispose();
  guide.mesh.geometry = createGuideGeometry(guide);
  guide.wire.geometry = new THREE.WireframeGeometry(guide.mesh.geometry);
  guide.mesh.position.set(guide.x, guide.y, guide.z);
  guide.wire.position.copy(guide.mesh.position);
  guide.mesh.material.opacity = guide.opacity;
  selectGuide(guide.id);
}

  return {
    guideHeadBounds,
    setCapsuleGuideEditing,
    outlinerGuides,
    guideOutlinerLabel,
    renderGuideOutliner,
    currentGuideViewMode,
    updateGuideViewToggle,
    setGuideViewMode,
    cycleGuideViewMode,
    hideGuideViewContextMenu,
    showGuideViewContextMenu,
    applyCapsuleGuideDisplayVisibility,
    applyOtherGuideDisplayVisibility,
    applyCurveLatticeGuideDisplayVisibility,
    defaultCurveLatticePoints,
    flatCurveLatticePoints,
    createCurveLatticeGuideSet,
    curveLatticeControlPoint,
    circularArcTangent,
    defaultCurveLatticeFrames,
    sampleHermiteCurve,
    sampleCurveLattice,
    curveLatticeNormal,
    createCurveLatticeGeometry,
    createCurveLatticeLineGeometry,
    curveLatticeLoopPickerGeometry,
    createCurveLatticeLoopPickers,
    rebuildCurveLatticeLoopPickers,
    curveLatticeHasRootExtension,
    defaultCurveLatticeRootPoints,
    curveLatticeEditablePoint,
    curveLatticePointSection,
    curveLatticeRestPoint,
    editingCurveLatticeDeformation,
    curveLatticeRootColumns,
    curveTangentsForPoints,
    createCurveLatticeRootGeometry,
    createCurveLatticeRootLineGeometry,
    rebuildCurveLatticeHandles,
    resampleCurveLatticeGuide,
    controlPointIsSelected,
    clearMultiPointSelection,
    createCurveLatticeHandles,
    addCurveLattice,
    updateCurveLatticeGeometry,
    mirroredCurveLatticePointIndex,
    mirroredCurveLatticeTarget,
    updateCurveLatticeHandleColors,
    curveLatticeLoopHitFromEvent,
    refreshCurveLatticeLoopHover,
    setCurveLatticeLoopHover,
    updateCurveLatticeLoopHover,
    selectCurveLatticeLoop,
    selectCurveLatticePoint,
    updateCurveLatticeFromHandle,
    beginCurveLatticeMultiEdit,
    applyCurveLatticeMultiTransform,
    curveLatticeColumnPoints,
    groupCurveControlIndices,
    groupCurveControlPoints,
    updateGroupCurveDisplay,
    ensureGroupCurveDisplay,
    groupCurveDeformationPairs,
    curveLatticeDeformationPairs,
    groupLatticeOffsetAtPoint,
    capsuleGuideCapHeight,
    hideCapsuleGuideDrawPreview,
    currentCapsuleGuideDrawProfile,
    updateCapsuleGuideProfilePreview,
    capsuleGuideDrawPoints,
    updateCapsuleGuideDrawPreview,
    beginCapsuleGuideDrawStroke,
    updateCapsuleGuideDrawStroke,
    createCapsuleGuideAlongCurve,
    finishCapsuleGuideDrawStroke,
    createCapsuleGuideGeometry,
    capsuleGuideTopologyFeature,
    retopologizeCapsuleGuide,
    resizeCapsuleGuideCylinder,
    capsuleControlDataFromGeometry,
    capsuleControlGeometryFromData,
    capsuleGuidePointWorldPosition,
    capsuleGuidePointDistances,
    capsuleGuideHorizontalLoopsFromTopology,
    capsuleGuideLoopCenter,
    normalizeCapsuleGuideColor,
    normalizeCapsuleGuideName,
    capsuleGuideAccentColor,
    updateCapsuleGuideDisplayColor,
    updateCapsuleGuideLoopLines,
    rebuildCapsuleGuideLoopLines,
    createCapsuleGuideHandles,
    rebuildCapsuleGuideHandles,
    syncCapsuleGuideHandles,
    capsuleGuideMirrorMap,
    mirrorCapsuleGuidePointEdits,
    updateCapsuleGuideHandleColors,
    updateCapsuleGuideFromHandle,
    beginCapsuleGuideHandleEdit,
    selectCapsuleGuidePoint,
    capsuleGuideLoopTransformGuide,
    attachCapsuleGuideLoopTransform,
    selectCapsuleGuideLoop,
    beginCapsuleGuideLoopTransform,
    updateCapsuleGuideLoopTransform,
    refreshCapsuleGuideFillInfluence,
    refreshCapsuleGuideLoopInfluence,
    setCapsuleGuideLoopHover,
    capsuleGuideLoopHitFromEvent,
    updateCapsuleGuideLoopHover,
    beginCapsuleGuideLoopDrag,
    updateCapsuleGuideLoopDrag,
    endCapsuleGuideLoopDrag,
    createSubdividedQuadGeometry,
    createEmphasizedSubdivisionEdges,
    createQuadCageGeometry,
    updateCapsuleGuideGeometry,
    createCapsuleGuideMaterial,
    updateCapsuleGuideWireOpacity,
    updateCapsuleGuideFresnelMaterial,
    addCapsuleGuide,
    addGuide,
    createGuideGeometry,
    selectGuide,
    updateGuideControlsVisibility,
    updateViewportToolVisibility,
    getSelectedGuide,
    syncGuideInputs,
    updateGuideGeometry,
  };
}
