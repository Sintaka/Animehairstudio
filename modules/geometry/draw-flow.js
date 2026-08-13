// draw-flow.js - draw strand / braid / panel brush stroke flow + live-surface interaction +
// creation entry points (addLock-front) business layer (refactor batch B2-1).
// Extracted from app.js; all app.js coupling injected via createDrawFlowApi(deps).
// Cluster E (placement flow, updatePlacementStatus) stays in app.js; B6 clump/procedural
// functions stay in app.js and are injected as deps (nextClumpName/createClumpFromLocks/
// updateClumpMembers/applyProceduralBranchSettings) until the B6 batch migrates them.
import * as THREE from "three";
import {
  eightWayScreenDelta,
  normalizeTaperCurve,
  sampleArray
} from "./curve-math.js?v=20260813-2";
import {
  proceduralAccessoryTaperScale,
  proceduralAccessoryTemplateData
} from "./procedural-draw.js?v=20260805-1";
import { STANDARD_ANISOTROPIC_SHADER } from "./anime-hair-shaders.js?v=20260730-8";
import {
  bonesFromData,
  bonesToData,
  splitBonesFromData,
  splitBonesToData
} from "../bones/bone-model.js?v=20260813-1";
import {
  CURVE_LATTICE_FEATURE_ENABLED,
  DEFAULT_BRAID_MESH_PRESET,
  DEFAULT_HAIR_COLOR,
  DEFAULT_HAIR_MATERIAL_ID,
  GROUP_CURVE_FEATURE_ENABLED,
  ROOT_SCALP_OFFSET_DISTANCE,
  ROUND_SWEEP_PROFILE
} from "../core/app-config.js?v=20260809-2";

export function createDrawFlowApi(deps) {
  // deps: store .state proxies (sel/sculptState/hairState/draw; use deps.X.y, never deps.X.state.y),
  // shared scene objects (camera/renderer/raycaster/locks/guides/viewPlaneFill/viewPlaneGrid),
  // creation defaults (strandCreationDefaults/braidCreationDefaults/panelCreationDefaults/braidMeshPresets/
  //   DRAW_CLUMP_TEMPLATE/DRAW_CLUMP_TEMPLATES/PROCEDURAL_DRAW_DEFAULTS/
  //   DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE),
  // draw DOM elements (drawStrandSurfaceInput/drawSurfaceDynamicButton/brush size + smoothing + curveStep
  //   inputs/drawStrandPreview family/drawStrandClumpPreviews/drawStrandBrushCursor),
  // module apis (scalpBuilder/branchHierarchy/strandGeometryApi/shapePresets), app.js helper functions
  // (addLock/updateLockGeometry/rebuildCurveObjects/updateCurveObjects/selectLock/getSelectedLock/
  //   renderLockList/updateCount/pushUndoState/updateInteractionLocks/updateAttributeEditorMode/
  //   createMirrorPartnerForNewLock/mirrorPartnerFor/syncMirrorPartnerFromLock/syncActiveMirror/
  //   syncLockFromCurve/setDrawStrandBrushCursorScale/ensureDrawClumpPreviewCount/groupDefaultsFor/
  //   pointsWithLayerOffset/normalizeHairLayer/strandDisplayColor/strandUsesDoubleSidedMaterial/
  //   createHairMaterial/materialForLock/setAnimeHairBaseColor/clonePanelSplits/mirroredVector/
  //   viewPlaneNormal/updateViewPlaneGrid/rayFromViewportEvent/headMeshes/outwardNormalAtPoint/
  //   activeCreationShapeDefaults/updatePlacementStatus/applyPlacedStrandScaleProfile) + B6 app.js
  //   bodies (nextClumpName/createClumpFromLocks/updateClumpMembers/applyProceduralBranchSettings).
  // Batch-fill point in app.js: after the bonesInteractionDeps batch (all const/let deps incl.
  // shapePresets/branchHierarchy defined) and before the preset-library boot (loadBraidMeshPreset
  // -> updatePlacementStatus -> drawFlowApi.selectedCurveLatticeGuide).

function activeDrawClumpTemplate(stroke = null) {
  if (deps.sel.activeTool === "procedural-draw") return proceduralDrawClumpTemplate(stroke);
  return deps.draw.activeCustomDrawClumpTemplate || deps.DRAW_CLUMP_TEMPLATES[deps.hairState.drawStrandMode] || null;
}

function proceduralDrawClumpTemplate(stroke = null) {
  const template = proceduralAccessoryTemplateData({
    count: stroke?.proceduralAccessoryCount ?? deps.PROCEDURAL_DRAW_DEFAULTS.accessoryCount,
    radius: stroke?.proceduralAccessoryRadius ?? deps.PROCEDURAL_DRAW_DEFAULTS.accessoryRadius,
    parentWidth: 1,
    accessoryWidth: 0.32
  });
  template.strands.forEach((strand) => {
    strand.settings = {
      sweepProfile: ROUND_SWEEP_PROFILE.map((point) => ({ ...point })),
      radialSegments: Math.max(8, Number(deps.strandCreationDefaults.radialSegments) || 10),
      hairCard: false
    };
  });
  const parentShape = stroke?.proceduralParentShape || deps.strandCreationDefaults;
  template.parentShape = {
    taperCurve: deps.shapePresets.cloneShapePresetValue(parentShape.taperCurve),
    depthCurve: deps.shapePresets.cloneShapePresetValue(parentShape.depthCurve),
    taperCurveSecondary: deps.shapePresets.cloneShapePresetValue(parentShape.taperCurveSecondary || parentShape.taperCurve),
    depthCurveSecondary: deps.shapePresets.cloneShapePresetValue(parentShape.depthCurveSecondary || parentShape.depthCurve),
    asymmetricWidthCurve: Boolean(parentShape.asymmetricWidthCurve),
    asymmetricDepthCurve: Boolean(parentShape.asymmetricDepthCurve),
    pointScales: parentShape.pointScales?.map((scale) => ({ x: scale.x, z: scale.z })) || [{ x: 1, z: 1 }]
  };
  return template;
}

function drawModeCreatesClump() {
  return Boolean(activeDrawClumpTemplate());
}

function selectedCurveLatticeGuide() {
  const guide = deps.guides.find((item) => item.id === deps.sel.activeCurveLatticeGuideId && item.type === "curve-lattice") || null;
  if (guide?.standalone) return guide;
  if (!CURVE_LATTICE_FEATURE_ENABLED && !(GROUP_CURVE_FEATURE_ENABLED && deps.sel.selectedStrandGroup)) return null;
  return guide;
}

function braidStrokeActive() {
  return deps.sel.activeTool === "braid";
}

function proceduralDrawActive() {
  return deps.sel.activeTool === "procedural-draw";
}

function panelStrokeActive() {
  return deps.sel.activeTool === "panel";
}

function activeStrokeSurfaceInput() {
  return deps.drawStrandSurfaceInput;
}

function activeStrokeSurfaceValue() {
  return activeStrokeSurfaceInput().value;
}

function normalizedLiveSurfaceSelection(value) {
  if (value === "head-contextual") return { surface: "head", dynamic: true };
  if (value === "head-conform") return { surface: "head", dynamic: false };
  return { surface: String(value || "head"), dynamic: null };
}

function activeStrokeDynamicEnabled(surfaceMode = activeStrokeSurfaceValue()) {
  return surfaceMode !== "contextual-plane" && drawSurfaceDynamicEnabled();
}

function drawSurfaceDynamicEnabled() {
  return deps.drawSurfaceDynamicButton.getAttribute("aria-pressed") === "true";
}

function setDrawSurfaceDynamicEnabled(enabled) {
  deps.drawSurfaceDynamicButton.setAttribute("aria-pressed", String(Boolean(enabled)));
}

function setActiveStrokeSurfaceValue(value) {
  const input = activeStrokeSurfaceInput();
  const normalized = normalizedLiveSurfaceSelection(value);
  if (![...input.options].some((option) => option.value === normalized.surface)) return false;
  input.value = normalized.surface;
  if (normalized.dynamic !== null) setDrawSurfaceDynamicEnabled(normalized.dynamic);
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function liveSurfaceStrandId(surfaceMode = activeStrokeSurfaceValue()) {
  return surfaceMode.startsWith("strand:") ? surfaceMode.slice("strand:".length) : null;
}

function liveSurfaceStrand(surfaceMode = activeStrokeSurfaceValue()) {
  const strandId = liveSurfaceStrandId(surfaceMode);
  return strandId ? deps.locks.find((lock) => lock.id === strandId) || null : null;
}

function liveSurfaceGuideId(surfaceMode = activeStrokeSurfaceValue()) {
  return surfaceMode.startsWith("guide:") ? surfaceMode.slice("guide:".length) : null;
}

function guideSupportsLiveSurface(guide) {
  return Boolean(
    guide?.type === "capsule"
    || (guide?.type === "curve-lattice" && guide.standalone)
  );
}

function liveSurfaceGuide(surfaceMode = activeStrokeSurfaceValue()) {
  const guideId = liveSurfaceGuideId(surfaceMode);
  return guideId
    ? deps.guides.find((guide) => guide.id === guideId && guideSupportsLiveSurface(guide)) || null
    : null;
}

function refreshLiveSurfaceOptions() {
  const normalized = normalizedLiveSurfaceSelection(activeStrokeSurfaceValue());
  const previousValue = normalized.surface;
  if (normalized.dynamic !== null) setDrawSurfaceDynamicEnabled(normalized.dynamic);
  const select = deps.drawStrandSurfaceInput;
  select.querySelector('optgroup[data-live-surface-guides]')?.remove();
  select.querySelector('optgroup[data-live-surface-strands]')?.remove();
  const surfaceGuides = deps.guides.filter(guideSupportsLiveSurface);
  if (surfaceGuides.length) {
    const group = document.createElement("optgroup");
    group.label = "Guides";
    group.dataset.liveSurfaceGuides = "true";
    surfaceGuides.forEach((guide) => {
      const option = document.createElement("option");
      option.value = `guide:${guide.id}`;
      option.textContent = guide.name;
      option.dataset.userCreatedLiveSurface = "true";
      group.appendChild(option);
    });
    select.appendChild(group);
  }
  const strandGuides = deps.locks.filter((lock) => lock.liveSurfaceGuide);
  if (strandGuides.length) {
    const group = document.createElement("optgroup");
    group.label = "Strand Guides";
    group.dataset.liveSurfaceStrands = "true";
    strandGuides.forEach((lock) => {
      const option = document.createElement("option");
      option.value = `strand:${lock.id}`;
      option.textContent = lock.name;
      option.dataset.userCreatedLiveSurface = "true";
      group.appendChild(option);
    });
    select.appendChild(group);
  }
  deps.drawStrandSurfaceInput.value = [...deps.drawStrandSurfaceInput.options].some((option) => option.value === previousValue)
    ? previousValue
    : "head";
}

function activeStrokeBrushSize() {
  if (braidStrokeActive()) return Number(deps.braidCreationDefaults.braidWidth) * Number(deps.braidToolSizeInput.value);
  if (panelStrokeActive()) return Number(deps.panelCreationDefaults.width) * Number(deps.panelToolSizeInput.value);
  return Number(deps.strandCreationDefaults.width) * Number(deps.drawToolSizeInput.value);
}

function activeStrokeBrushDepth() {
  if (braidStrokeActive()) return Number(deps.braidCreationDefaults.braidDepth) * Number(deps.braidToolSizeInput.value);
  if (panelStrokeActive()) return Number(deps.panelCreationDefaults.panelThickness) * Number(deps.panelToolSizeInput.value);
  return Number(deps.strandCreationDefaults.depth) * Number(deps.drawToolSizeInput.value);
}

function strokeSurfaceIsContextual(
  surfaceMode = activeStrokeSurfaceValue(),
  dynamic = activeStrokeDynamicEnabled(surfaceMode)
) {
  if (typeof surfaceMode !== "string") return false;
  return surfaceMode === "contextual-plane" || Boolean(dynamic);
}

function contextualPlaneAtOrigin() {
  const normal = deps.viewPlaneNormal();
  const origin = new THREE.Vector3(0, 0, 0);
  return {
    origin,
    normal,
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, origin)
  };
}

function drawSurfaceHitFromEvent(event, { root = false, excludeLockId = null } = {}) {
  deps.rayFromViewportEvent(event);
  const surfaceMode = activeStrokeSurfaceValue();
  const strandSurface = liveSurfaceStrand(surfaceMode);
  const guideSurface = liveSurfaceGuide(surfaceMode);
  if (liveSurfaceGuideId(surfaceMode)) {
    if (!guideSurface || guideSurface.mesh.visible === false) return null;
    return deps.raycaster.intersectObjects(
      [guideSurface.mesh, guideSurface.rootMesh]
        .filter((object) => object && object.visible !== false),
      false
    )[0] || null;
  }
  if (liveSurfaceStrandId(surfaceMode)) {
    if (!strandSurface || strandSurface.id === excludeLockId || strandSurface.mesh.visible === false) return null;
    return deps.raycaster.intersectObject(strandSurface.mesh, false)[0] || null;
  }
  if (surfaceMode === "contextual-plane") {
    const contextualPlane = contextualPlaneAtOrigin();
    const point = deps.raycaster.ray.intersectPlane(contextualPlane.plane, new THREE.Vector3());
    return point ? { point, contextualPlaneNormal: contextualPlane.normal } : null;
  }
  if (root) {
    return deps.raycaster.intersectObject(deps.scalpBuilder.activeScalpSurfaceMesh(), false)[0]
      || deps.raycaster.intersectObjects(deps.headMeshes(), false)[0]
      || null;
  }
  if (surfaceMode === "head") {
    return deps.raycaster.intersectObjects(deps.headMeshes(), false)[0] || null;
  }
  if (surfaceMode === "lattice") {
    const lattice = selectedCurveLatticeGuide();
    return lattice
      ? deps.raycaster.intersectObjects([lattice.mesh, lattice.rootMesh].filter((object) => object && object.visible !== false), false)[0] || null
      : null;
  }
  return deps.raycaster.intersectObjects(deps.headMeshes(), false)[0] || null;
}

function worldNormalAtHit(hit) {
  if (hit.contextualPlaneNormal) return hit.contextualPlaneNormal.clone();
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
  const normal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
  if (normal.dot(deps.raycaster.ray.direction) > 0) normal.negate();
  return normal;
}

function drawSampleFromHit(hit, root = false, scalpRegion = "unassigned", scalpOffset = deps.scalpBuilder.activeStrokeScalpOffset()) {
  const normal = worldNormalAtHit(hit);
  const drawOffsetDistance = scalpOffset * ROOT_SCALP_OFFSET_DISTANCE;
  const offset = root
    ? deps.scalpBuilder.rootScalpOffsetDistance(THREE.MathUtils.clamp(deps.activeCreationShapeDefaults().rootScalpOffset + scalpOffset, -1, 1))
    : Math.max(0.018, activeStrokeBrushSize() * 0.12) + drawOffsetDistance;
  return {
    point: hit.point.clone().addScaledVector(normal, offset),
    surfacePoint: hit.point.clone(),
    normal,
    onSurface: true
  };
}

function updateDrawStrandBrushCursor(event) {
  if (!["draw", "procedural-draw", "braid", "panel"].includes(deps.sel.activeTool) || deps.sculptState.drawStrandStroke?.freePlane) {
    deps.drawStrandBrushCursor.visible = false;
    return;
  }
  const extensionLock = selectedTipContinuationLock(event);
  const cursorScale = activeStrokeBrushSize() * (braidStrokeActive() ? 1 / 3 : 1);
  if (extensionLock) {
    deps.drawStrandBrushCursor.visible = true;
    deps.drawStrandBrushCursor.position.copy(extensionLock.points.at(-1));
    deps.drawStrandBrushCursor.quaternion.copy(deps.camera.quaternion);
    deps.setDrawStrandBrushCursorScale(cursorScale);
    return;
  }
  const branchStart = deps.branchHierarchy.selectedDrawBranchPoint(event);
  if (branchStart) {
    deps.drawStrandBrushCursor.visible = true;
    deps.drawStrandBrushCursor.position.copy(branchStart.point);
    deps.drawStrandBrushCursor.quaternion.copy(deps.camera.quaternion);
    deps.setDrawStrandBrushCursorScale(cursorScale);
    return;
  }
  const hit = drawSurfaceHitFromEvent(event, { root: true });
  if (!hit) {
    deps.drawStrandBrushCursor.visible = false;
    return;
  }
  const normal = worldNormalAtHit(hit);
  deps.drawStrandBrushCursor.visible = true;
  deps.drawStrandBrushCursor.position.copy(hit.point).addScaledVector(
    normal,
    0.006 + deps.scalpBuilder.activeStrokeScalpOffset() * ROOT_SCALP_OFFSET_DISTANCE
  );
  deps.drawStrandBrushCursor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  deps.setDrawStrandBrushCursorScale(cursorScale);
}

function strokeLength(samples) {
  let length = 0;
  for (let i = 1; i < samples.length; i += 1) length += samples[i - 1].point.distanceTo(samples[i].point);
  return length;
}

function resampleDrawStroke(samples, count) {
  if (samples.length < 2) return samples.map((sample) => ({ ...sample, point: sample.point.clone() }));
  const distances = [0];
  for (let i = 1; i < samples.length; i += 1) {
    distances.push(distances[i - 1] + samples[i - 1].point.distanceTo(samples[i].point));
  }
  const total = distances.at(-1);
  if (total < 0.0001) return samples.slice(0, 1).map((sample) => ({ ...sample, point: sample.point.clone() }));
  const result = [];
  let segment = 1;
  for (let i = 0; i < count; i += 1) {
    const target = total * (i / Math.max(1, count - 1));
    while (segment < distances.length - 1 && distances[segment] < target) segment += 1;
    const before = samples[segment - 1];
    const after = samples[segment];
    const span = Math.max(0.0001, distances[segment] - distances[segment - 1]);
    const alpha = THREE.MathUtils.clamp((target - distances[segment - 1]) / span, 0, 1);
    const normal = before.normal && after.normal
      ? before.normal.clone().lerp(after.normal, alpha).normalize()
      : before.normal?.clone() || after.normal?.clone() || null;
    result.push({
      point: before.point.clone().lerp(after.point, alpha),
      surfacePoint: before.surfacePoint && after.surfacePoint
        ? before.surfacePoint.clone().lerp(after.surfacePoint, alpha)
        : null,
      normal,
      onSurface: before.onSurface && after.onSurface
    });
  }
  return result;
}

function processedDrawStroke(
  samples,
  smoothing = Number(deps.drawStrandSmoothingInput.value),
  curveStep = Number(deps.drawStrandCurveStepInput.value)
) {
  const length = strokeLength(samples);
  const spacing = THREE.MathUtils.clamp(Number(curveStep), 0.12, 0.6);
  const count = THREE.MathUtils.clamp(Math.round(length / spacing) + 1, 3, 18);
  const result = resampleDrawStroke(samples, count);
  if (result.length < 3 && result.length === 2) {
    result.splice(1, 0, {
      ...result[0],
      point: result[0].point.clone().lerp(result[1].point, 0.5)
    });
  }
  const passes = Math.round(smoothing * 4);
  const strength = THREE.MathUtils.lerp(0.18, 0.62, smoothing);
  for (let pass = 0; pass < passes; pass += 1) {
    const previous = result.map((sample) => sample.point.clone());
    for (let i = 1; i < result.length - 1; i += 1) {
      const target = previous[i - 1].clone().add(previous[i + 1]).multiplyScalar(0.5);
      const delta = target.sub(previous[i]).multiplyScalar(strength);
      if (result[i].onSurface && result[i].normal) delta.projectOnPlane(result[i].normal);
      result[i].point.copy(previous[i]).add(delta);
    }
  }
  return result;
}

function strokeSurfaceNormals(samples, fallback = null) {
  const firstKnown = samples.find((sample) => sample.normal)?.normal || fallback;
  let previous = firstKnown?.clone()?.normalize() || null;
  return samples.map((sample) => {
    const normal = sample.normal?.clone()?.normalize() || previous?.clone() || null;
    if (normal && previous && normal.dot(previous) < 0) normal.negate();
    if (normal) previous = normal.clone();
    return normal;
  });
}

function drawClumpFrame(curve, t, normal = null) {
  const point = curve.getPoint(t);
  const y = curve.getTangent(t).normalize();
  const z = (normal?.clone() || deps.outwardNormalAtPoint(point, y)).projectOnPlane(y).normalize();
  if (z.lengthSq() < 0.0001) z.copy(deps.outwardNormalAtPoint(point, y));
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return { point, x, y, z };
}

function nearestCurveParameter(curve, point, divisions = 96) {
  let nearestT = 0;
  let nearestDistance = Infinity;
  for (let index = 0; index <= divisions; index += 1) {
    const t = index / divisions;
    const distance = curve.getPoint(t).distanceToSquared(point);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestT = t;
    }
  }
  return nearestT;
}

function drawClumpSampleNormal(normals, t) {
  if (!normals.length) return null;
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * Math.max(0, normals.length - 1);
  const before = normals[Math.floor(scaled)];
  const after = normals[Math.min(normals.length - 1, Math.ceil(scaled))];
  if (before && after) return before.clone().lerp(after, scaled - Math.floor(scaled)).normalize();
  return before?.clone() || after?.clone() || null;
}

function drawClumpTemplateVector(point) {
  return Array.isArray(point)
    ? new THREE.Vector3(Number(point[0]), Number(point[1]), Number(point[2]))
    : new THREE.Vector3(Number(point.x), Number(point.y), Number(point.z));
}

function applyDrawClumpTemplateSettings(target, template) {
  const settings = template?.settings || {};
  [
    "strandRotation", "twist", "widthScale", "depthScale", "profileTrimLeft", "profileTrimRight", "profileTrimRoundness",
    "hairCard", "strandSplitEnabled", "strandSplitPosition", "strandSplitHeight", "strandSplitGap",
    "profileOffset", "radialSegments", "lengthSegments", "dynamicDensity", "densityAggression", "twistDensity",
    "asymmetricWidthCurve", "asymmetricDepthCurve", "centerAsymmetricProfile"
  ].forEach((key) => {
    if (settings[key] !== undefined) target[key] = settings[key];
  });
  ["taperCurve", "depthCurve", "taperCurveSecondary", "depthCurveSecondary", "twistCurve", "sweepProfile"].forEach((key) => {
    if (settings[key]) target[key] = deps.shapePresets.cloneShapePresetValue(settings[key]);
  });
  return target;
}

function drawClumpStrandMaps(samples, brushSize, template = activeDrawClumpTemplate() || deps.DRAW_CLUMP_TEMPLATE) {
  const centerPoints = samples.map((sample) => sample.point.clone());
  if (centerPoints.length < 2) return [{ points: centerPoints, pointSurfaceNormals: [] }];
  const coherentNormals = strokeSurfaceNormals(samples);

  const sourceCurves = template.strands.map((strand) => (
    new THREE.CatmullRomCurve3(strand.points.map(drawClumpTemplateVector), false, "centripetal", 0.5)
  ));
  const sourceCenter = sourceCurves[0];
  const targetCurve = new THREE.CatmullRomCurve3(centerPoints, false, "centripetal", 0.5);
  const lateralScale = brushSize / template.baseWidth;
  const lengthScale = targetCurve.getLength() / Math.max(0.001, sourceCenter.getLength());

  return [
    {
      points: centerPoints,
      pointSurfaceNormals: coherentNormals
    },
    ...template.strands.slice(1).map((strand) => {
      if (Array.isArray(strand.radialOffset)) {
        const offsetX = Number(strand.radialOffset[0] || 0) * lateralScale;
        const offsetZ = Number(strand.radialOffset[1] || 0) * lateralScale;
        const parameters = centerPoints.map((_, index) => index / Math.max(1, centerPoints.length - 1));
        return {
          points: parameters.map((t) => {
            const targetNormal = drawClumpSampleNormal(coherentNormals, t);
            const targetFrame = drawClumpFrame(targetCurve, t, targetNormal);
            const taperScale = proceduralAccessoryTaperScale(template.parentShape, t, offsetX, offsetZ);
            return targetFrame.point.clone()
              .addScaledVector(targetFrame.x, offsetX * taperScale.x)
              .addScaledVector(targetFrame.z, offsetZ * taperScale.z);
          }),
          pointSurfaceNormals: parameters.map((t) => drawClumpSampleNormal(coherentNormals, t))
        };
      }
      const sourcePoints = strand.points.map(drawClumpTemplateVector);
      const parameters = sourcePoints.map((point) => nearestCurveParameter(sourceCenter, point));
      return {
        points: sourcePoints.map((sourcePoint, index) => {
          const t = parameters[index];
          const sourceFrame = drawClumpFrame(sourceCenter, t, new THREE.Vector3(0, 0, 1));
          const targetNormal = drawClumpSampleNormal(coherentNormals, t);
          const targetFrame = drawClumpFrame(targetCurve, t, targetNormal);
          const delta = sourcePoint.clone().sub(sourceFrame.point);
          return targetFrame.point.clone()
        .addScaledVector(targetFrame.x, delta.dot(sourceFrame.x) * lateralScale)
        .addScaledVector(targetFrame.y, delta.dot(sourceFrame.y) * lengthScale)
        .addScaledVector(targetFrame.z, delta.dot(sourceFrame.z) * lateralScale);
        }),
        pointSurfaceNormals: parameters.map((t) => drawClumpSampleNormal(coherentNormals, t))
      };
    })
  ];
}

function updateDrawVolumePreview(mesh, previewLock, color) {
  const previousGeometry = mesh.geometry;
  mesh.geometry = deps.strandGeometryApi.createHairGeometry(previewLock);
  previousGeometry.dispose();
  const definition = deps.materialForLock(previewLock);
  if (mesh.material.userData.hairShader !== definition.shader) {
    const previousMaterial = mesh.material;
    mesh.material = deps.createHairMaterial(previewLock);
    mesh.material.transparent = true;
    mesh.material.opacity = 0.82;
    if (mesh.material.uniforms?.uOpacity) mesh.material.uniforms.uOpacity.value = 0.82;
    mesh.material.depthWrite = false;
    previousMaterial.dispose();
  }
  deps.setAnimeHairBaseColor(mesh.material, color);
  if (mesh.material.userData.hairShader === STANDARD_ANISOTROPIC_SHADER) {
    mesh.material.roughness = definition.roughness;
  }
  mesh.material.side = deps.strandUsesDoubleSidedMaterial(previewLock)
    ? THREE.DoubleSide
    : THREE.FrontSide;
  mesh.visible = true;
}

function hideDrawClumpPreviews() {
  [...deps.drawStrandClumpVolumePreviews, ...deps.drawStrandClumpMirrorPreviews].forEach((mesh) => {
    mesh.visible = false;
  });
}

function resetDrawVolumePreview(mesh) {
  mesh.visible = false;
  mesh.geometry.dispose();
  mesh.geometry = new THREE.BufferGeometry();
}

function updateDrawStrandPreview() {
  if (!deps.sculptState.drawStrandStroke?.samples.length) {
    deps.drawStrandPreview.visible = false;
    deps.drawStrandMirrorPreview.visible = false;
    deps.drawStrandVolumePreview.visible = false;
    deps.drawStrandMirrorVolumePreview.visible = false;
    hideDrawClumpPreviews();
    return;
  }
  const samples = processedDrawStroke(
    deps.sculptState.drawStrandStroke.samples,
    deps.sculptState.drawStrandStroke.smoothing,
    deps.sculptState.drawStrandStroke.curveStep
  );
  const groupDefaults = deps.groupDefaultsFor(deps.sculptState.drawStrandStroke.scalpRegion);
  const defaults = deps.sculptState.drawStrandStroke.outputType === "braid"
    ? deps.braidCreationDefaults
    : deps.sculptState.drawStrandStroke.outputType === "panel" ? deps.panelCreationDefaults : deps.strandCreationDefaults;
  const extensionLock = deps.sculptState.drawStrandStroke.extensionLockId
    ? deps.locks.find((lock) => lock.id === deps.sculptState.drawStrandStroke.extensionLockId)
    : null;
  const showMirrorPreview = Boolean(deps.mirrorPartnerFor(extensionLock))
    || Boolean(!extensionLock && deps.sculptState.mirrorXEditing);
  const layerId = deps.normalizeHairLayer(defaults.hairLayer);
  const layerOffset = Number(groupDefaults.layerOffsets?.[layerId] ?? 0);
  const layerDirection = deps.sculptState.drawStrandStroke.rootSurfaceNormal?.clone().normalize() || new THREE.Vector3(0, 0, 1);
  const sampledNormals = strokeSurfaceNormals(samples, deps.sculptState.drawStrandStroke.rootSurfaceNormal);
  const previewPoints = extensionLock
    ? [...extensionLock.points.map((point) => point.clone()), ...samples.slice(1).map((sample) => sample.point.clone())]
    : deps.pointsWithLayerOffset(
        samples.map((sample) => sample.point),
        layerDirection,
        layerOffset,
        layerId
      );
  deps.drawStrandPreview.geometry.setFromPoints(previewPoints);
  deps.drawStrandPreview.visible = true;
  deps.drawStrandMirrorPreview.geometry.setFromPoints(previewPoints.map(deps.mirroredVector));
  deps.drawStrandMirrorPreview.visible = showMirrorPreview;
  if (samples.length < 2) {
    deps.drawStrandVolumePreview.visible = false;
    deps.drawStrandMirrorVolumePreview.visible = false;
    hideDrawClumpPreviews();
    return;
  }
  const previewLock = {
    id: "draw-strand-preview",
    proceduralDrawGuide: Boolean(deps.sculptState.drawStrandStroke.proceduralDraw),
    proceduralBranchCount: Number(deps.sculptState.drawStrandStroke.proceduralBranchCount || 0),
    proceduralBranchLength: Number(deps.sculptState.drawStrandStroke.proceduralBranchLength ?? 0.6),
    proceduralBranchLengthCurve: deps.shapePresets.cloneShapePresetValue(
      deps.sculptState.drawStrandStroke.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
    ),
    proceduralBranchShapeCurve: deps.shapePresets.cloneShapePresetValue(
      deps.sculptState.drawStrandStroke.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
    ),
    proceduralBranchTipOffset: Number(deps.sculptState.drawStrandStroke.proceduralBranchTipOffset ?? 0.35),
    geometryType: extensionLock?.geometryType || deps.sculptState.drawStrandStroke.outputType,
    materialId: extensionLock?.materialId || DEFAULT_HAIR_MATERIAL_ID,
    scalpRegion: extensionLock?.scalpRegion || deps.sculptState.drawStrandStroke.scalpRegion,
    hairLayer: extensionLock?.hairLayer || layerId,
    points: previewPoints,
    pointTwists: extensionLock
      ? [...extensionLock.pointTwists, ...samples.slice(1).map(() => extensionLock.pointTwists.at(-1) || 0)]
      : samples.map(() => 0),
    pointScales: extensionLock
      ? [...extensionLock.pointScales.map((scale) => ({ ...scale })), ...samples.slice(1).map(() => ({ ...(extensionLock.pointScales.at(-1) || { x: 1, z: 1 }) }))]
      : samples.map(() => ({ x: 1, z: 1 })),
    pointWidths: extensionLock
      ? [...extensionLock.pointWidths, ...samples.slice(1).map(() => extensionLock.pointWidths.at(-1) ?? 1)]
      : samples.map(() => 1),
    surfaceNormalInfluence: deps.sculptState.drawStrandStroke.outputType !== "braid"
      ? Number(deps.sculptState.drawStrandStroke.surfaceNormalInfluence ?? 0)
      : 0,
    pointSurfaceNormals: extensionLock
      ? [
          ...extensionLock.points.map((_, index) => extensionLock.pointSurfaceNormals?.[index] || null),
          ...sampledNormals.slice(1)
        ]
      : sampledNormals,
    baseWidth: extensionLock?.baseWidth || deps.sculptState.drawStrandStroke.brushSize,
    width: extensionLock?.width || deps.sculptState.drawStrandStroke.brushSize,
    depth: extensionLock?.depth ?? deps.sculptState.drawStrandStroke.brushDepth,
    braidMeshPreset: extensionLock?.braidMeshPreset || deps.sculptState.drawStrandStroke.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET,
    braidWidth: extensionLock?.braidWidth || deps.sculptState.drawStrandStroke.braidWidth,
    braidDepth: extensionLock?.braidDepth || deps.sculptState.drawStrandStroke.braidDepth,
    braidSegmentLength: extensionLock?.braidSegmentLength || deps.sculptState.drawStrandStroke.braidSegmentLength,
    braidRotation: extensionLock?.braidRotation ?? deps.sculptState.drawStrandStroke.braidRotation,
    panelThickness: extensionLock?.panelThickness ?? deps.sculptState.drawStrandStroke.panelThickness,
    panelLengthLoops: extensionLock?.panelLengthLoops ?? deps.sculptState.drawStrandStroke.panelLengthLoops,
    panelWidthLoops: extensionLock?.panelWidthLoops ?? deps.sculptState.drawStrandStroke.panelWidthLoops,
    panelCurvature: extensionLock?.panelCurvature ?? deps.sculptState.drawStrandStroke.panelCurvature,
    panelLeftEdgeTrim: extensionLock?.panelLeftEdgeTrim ?? deps.sculptState.drawStrandStroke.panelLeftEdgeTrim,
    panelRightEdgeTrim: extensionLock?.panelRightEdgeTrim ?? deps.sculptState.drawStrandStroke.panelRightEdgeTrim,
    profileTrimLeft: extensionLock?.profileTrimLeft ?? deps.sculptState.drawStrandStroke.profileTrimLeft,
    profileTrimRight: extensionLock?.profileTrimRight ?? deps.sculptState.drawStrandStroke.profileTrimRight,
    profileTrimRoundness: extensionLock?.profileTrimRoundness ?? deps.sculptState.drawStrandStroke.profileTrimRoundness,
    hairCard: extensionLock?.hairCard ?? deps.sculptState.drawStrandStroke.hairCard,
    strandSplitEnabled: extensionLock?.strandSplitEnabled ?? deps.sculptState.drawStrandStroke.strandSplitEnabled,
    strandSplitPosition: extensionLock?.strandSplitPosition ?? deps.sculptState.drawStrandStroke.strandSplitPosition,
    strandSplitHeight: extensionLock?.strandSplitHeight ?? deps.sculptState.drawStrandStroke.strandSplitHeight,
    strandSplitGap: extensionLock?.strandSplitGap ?? deps.sculptState.drawStrandStroke.strandSplitGap,
    panelSplitEnabled: extensionLock?.panelSplitEnabled ?? deps.sculptState.drawStrandStroke.panelSplitEnabled,
    panelSplitSnapToLoops: extensionLock?.panelSplitSnapToLoops ?? deps.sculptState.drawStrandStroke.panelSplitSnapToLoops,
    panelSplitHeight: extensionLock?.panelSplitHeight ?? deps.sculptState.drawStrandStroke.panelSplitHeight,
    panelSplits: deps.clonePanelSplits(
      extensionLock?.panelSplits ?? deps.sculptState.drawStrandStroke.panelSplits,
      extensionLock?.panelSplitHeight ?? deps.sculptState.drawStrandStroke.panelSplitHeight
    ),
    panelSplitGap: extensionLock?.panelSplitGap ?? deps.sculptState.drawStrandStroke.panelSplitGap,
    splitBones: extensionLock?.splitBones ? splitBonesToData(extensionLock.splitBones) : null,
    bones: extensionLock?.bones ? bonesToData(extensionLock.bones) : null,
    curlEnabled: deps.sculptState.drawStrandStroke.outputType === "strand"
      ? Boolean(deps.sculptState.drawStrandStroke.curlEnabled)
      : Boolean(extensionLock?.curlEnabled),
    curlCount: Number(deps.sculptState.drawStrandStroke.outputType === "strand"
      ? deps.sculptState.drawStrandStroke.curlCount ?? 4
      : extensionLock?.curlCount ?? 4),
    curlDisplacement: Number(deps.sculptState.drawStrandStroke.outputType === "strand"
      ? deps.sculptState.drawStrandStroke.curlDisplacement ?? 0.18
      : extensionLock?.curlDisplacement ?? 0.18),
    length: strokeLength(samples),
    strandRotation: extensionLock?.strandRotation ?? defaults.strandRotation,
    twist: extensionLock?.twist ?? defaults.twist,
    twistCurve: extensionLock?.twistCurve || defaults.twistCurve,
    radialSegments: Math.min(12, Math.round(extensionLock?.radialSegments || groupDefaults.radialSegments || 10)),
    lengthSegments: Math.min(32, Math.max(8, extensionLock?.lengthSegments || samples.length * 3)),
    dynamicDensity: extensionLock ? Boolean(extensionLock.dynamicDensity) : Boolean(groupDefaults.dynamicDensity),
    densityAggression: Number(extensionLock?.densityAggression ?? groupDefaults.densityAggression ?? 0.5),
    twistDensity: Number(extensionLock?.twistDensity ?? groupDefaults.twistDensity ?? 0.5),
    taperCurve: extensionLock?.taperCurve || defaults.taperCurve,
    depthCurve: extensionLock?.depthCurve || defaults.depthCurve,
    taperCurveSecondary: extensionLock?.taperCurveSecondary || defaults.taperCurveSecondary || defaults.taperCurve,
    depthCurveSecondary: extensionLock?.depthCurveSecondary || defaults.depthCurveSecondary || defaults.depthCurve,
    asymmetricWidthCurve: Boolean(extensionLock?.asymmetricWidthCurve ?? defaults.asymmetricWidthCurve),
    asymmetricDepthCurve: Boolean(extensionLock?.asymmetricDepthCurve ?? defaults.asymmetricDepthCurve),
    centerAsymmetricProfile: Boolean(extensionLock?.centerAsymmetricProfile ?? defaults.centerAsymmetricProfile),
    widthScale: extensionLock?.widthScale ?? defaults.widthScale,
    depthScale: extensionLock?.depthScale ?? defaults.depthScale,
    sweepProfile: extensionLock?.sweepProfile || defaults.sweepProfile,
    profileOffset: Number(extensionLock?.profileOffset ?? defaults.profileOffset ?? 0)
  };
  const clumpTemplate = deps.sculptState.drawStrandStroke.outputType === "strand" ? activeDrawClumpTemplate(deps.sculptState.drawStrandStroke) : null;
  if (!extensionLock && deps.sculptState.drawStrandStroke.outputType !== "braid" && clumpTemplate) {
    const parentTemplate = clumpTemplate.strands[0];
    applyDrawClumpTemplateSettings(previewLock, parentTemplate);
    previewLock.depth = deps.sculptState.drawStrandStroke.brushSize * ((parentTemplate.depth ?? parentTemplate.width) / clumpTemplate.baseWidth);
    previewLock.pointTwists = previewLock.points.map((_, index) => (
      sampleArray(parentTemplate.pointTwists || [0], index / Math.max(1, previewLock.points.length - 1))
    ));
  }
  const previewColor = deps.strandDisplayColor(previewLock);
  updateDrawVolumePreview(deps.drawStrandVolumePreview, previewLock, previewColor);
  if (deps.sculptState.drawStrandStroke.proceduralDraw && !deps.sculptState.drawStrandStroke.proceduralParentVisible) {
    deps.drawStrandVolumePreview.visible = false;
  }
  if (showMirrorPreview) {
    const mirroredPreviewLock = {
      ...previewLock,
      points: previewLock.points.map(deps.mirroredVector),
      pointSurfaceNormals: previewLock.pointSurfaceNormals?.map(deps.mirroredVector) || [],
      pointTwists: previewLock.pointTwists.map((twist) => -twist),
      strandRotation: -Number(previewLock.strandRotation ?? 0),
      twistCurve: previewLock.twistCurve.map((point) => ({ ...point, value: -Number(point.value || 0) })),
      twist: -previewLock.twist
    };
    updateDrawVolumePreview(deps.drawStrandMirrorVolumePreview, mirroredPreviewLock, previewColor);
    if (deps.sculptState.drawStrandStroke.proceduralDraw && !deps.sculptState.drawStrandStroke.proceduralParentVisible) {
      deps.drawStrandMirrorVolumePreview.visible = false;
    }
  } else {
    deps.drawStrandMirrorVolumePreview.visible = false;
  }

  if (!extensionLock && deps.sculptState.drawStrandStroke.outputType !== "braid" && clumpTemplate) {
    hideDrawClumpPreviews();
    const accessoryCount = clumpTemplate.strands.length - 1;
    deps.ensureDrawClumpPreviewCount(accessoryCount);
    const strandMaps = drawClumpStrandMaps(samples, deps.sculptState.drawStrandStroke.brushSize, clumpTemplate);
    clumpTemplate.strands.slice(1).forEach((template, index) => {
      const strandMap = strandMaps[index + 1];
      const points = deps.pointsWithLayerOffset(strandMap.points, layerDirection, layerOffset, layerId);
      const width = deps.sculptState.drawStrandStroke.brushSize * (template.width / clumpTemplate.baseWidth);
      const clumpPreviewLock = applyDrawClumpTemplateSettings({
        ...previewLock,
        id: `draw-clump-preview-${index}`,
        proceduralDrawGuide: false,
        proceduralBranchCount: 0,
        points,
        pointSurfaceNormals: strandMap.pointSurfaceNormals,
        pointScales: points.map(() => ({ x: 1, z: 1 })),
        baseWidth: width,
        width,
        depth: deps.sculptState.drawStrandStroke.brushSize * ((template.depth ?? template.width) / clumpTemplate.baseWidth),
        pointTwists: points.map((_, pointIndex) => sampleArray(template.pointTwists || [0], pointIndex / Math.max(1, points.length - 1)))
      }, template);
      updateDrawVolumePreview(deps.drawStrandClumpVolumePreviews[index], clumpPreviewLock, previewColor);
      if (showMirrorPreview) {
        const mirroredClumpPreviewLock = {
          ...clumpPreviewLock,
          points: clumpPreviewLock.points.map(deps.mirroredVector),
          pointSurfaceNormals: clumpPreviewLock.pointSurfaceNormals?.map(deps.mirroredVector) || [],
          pointTwists: clumpPreviewLock.pointTwists.map((twist) => -twist),
          strandRotation: -Number(clumpPreviewLock.strandRotation ?? 0),
          twistCurve: clumpPreviewLock.twistCurve.map((point) => ({ ...point, value: -Number(point.value || 0) })),
          twist: -clumpPreviewLock.twist
        };
        updateDrawVolumePreview(
          deps.drawStrandClumpMirrorPreviews[index],
          mirroredClumpPreviewLock,
          previewColor
        );
      } else {
        deps.drawStrandClumpMirrorPreviews[index].visible = false;
      }
    });
  } else {
    hideDrawClumpPreviews();
  }
}

function continueFromTipEnabled() {
  if (panelStrokeActive()) return false;
  if (proceduralDrawActive()) return false;
  return braidStrokeActive() ? deps.braidContinueFromTipInput.checked : deps.drawContinueFromTipInput.checked;
}

function selectedTipContinuationLock(event) {
  if (!continueFromTipEnabled()) return null;
  const lock = deps.getSelectedLock();
  const expectedGeometry = braidStrokeActive() ? "braid" : "strand";
  if (!lock || lock.geometryType !== expectedGeometry || lock.points.length < 2) return null;
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const tip = lock.points.at(-1).clone().project(deps.camera);
  if (tip.z < -1 || tip.z > 1) return null;
  const tipX = rect.left + (tip.x + 1) * rect.width * 0.5;
  const tipY = rect.top + (1 - tip.y) * rect.height * 0.5;
  return Math.hypot(event.clientX - tipX, event.clientY - tipY) <= 20 ? lock : null;
}

function beginDrawStrandStroke(event, hit, extensionLock = null, branchStart = null) {
  if (event.button !== 0 || (!hit && !extensionLock && !branchStart) || event.ctrlKey || event.altKey || event.metaKey) return false;
  const surfaceMode = activeStrokeSurfaceValue();
  const dynamicContextual = activeStrokeDynamicEnabled(surfaceMode);
  const scalpRegion = extensionLock?.scalpRegion || branchStart?.lock.scalpRegion || deps.scalpBuilder.drawScalpRegionAtEvent(event, hit);
  const drawingBraid = braidStrokeActive();
  const drawingPanel = panelStrokeActive();
  const drawingProcedural = proceduralDrawActive();
  const scalpOffset = deps.scalpBuilder.activeStrokeScalpOffset();
  const contextualPlane = surfaceMode === "contextual-plane" ? contextualPlaneAtOrigin() : null;
  const extensionTip = extensionLock?.points.at(-1)?.clone();
  const extensionTangent = extensionLock
    ? extensionTip.clone().sub(extensionLock.points.at(-2)).normalize()
    : null;
  const extensionNormal = extensionLock?.rootSurfaceNormal?.clone()?.normalize()
    || (extensionTangent ? deps.viewPlaneNormal().cross(extensionTangent).cross(extensionTangent).normalize() : null);
  const sample = extensionLock
    ? {
        point: extensionTip,
        surfacePoint: null,
        normal: extensionNormal || new THREE.Vector3(0, 0, 1),
        onSurface: false
      }
    : branchStart
    ? {
        point: branchStart.point.clone(),
        surfacePoint: null,
        normal: branchStart.normal.clone(),
        onSurface: false
      }
    : contextualPlane
    ? {
        point: hit.point.clone(),
        surfacePoint: null,
        normal: contextualPlane.normal.clone(),
        onSurface: false
      }
    : drawSampleFromHit(hit, true, scalpRegion, scalpOffset);
  const anchoredStart = extensionTip || branchStart?.point;
  const initialFreePlane = anchoredStart && surfaceMode === "contextual-plane"
    ? {
        origin: anchoredStart.clone(),
        normal: deps.viewPlaneNormal(),
        plane: new THREE.Plane().setFromNormalAndCoplanarPoint(deps.viewPlaneNormal(), anchoredStart)
      }
    : contextualPlane;
  deps.sculptState.drawStrandStroke = {
    pointerId: event.pointerId,
    outputType: drawingBraid ? "braid" : drawingPanel ? "panel" : "strand",
    surfaceMode,
    dynamicContextual,
    scalpRegion,
    brushSize: activeStrokeBrushSize(),
    brushDepth: activeStrokeBrushDepth(),
    braidMeshPreset: deps.braidCreationDefaults.braidMeshPreset,
    braidWidth: Number(deps.braidCreationDefaults.braidWidth) * Number(deps.braidToolSizeInput.value),
    braidDepth: Number(deps.braidCreationDefaults.braidDepth) * Number(deps.braidToolSizeInput.value),
    braidSegmentLength: Number(deps.braidCreationDefaults.braidSegmentLength) * Number(deps.braidToolSizeInput.value),
    braidRotation: Number(deps.braidCreationDefaults.braidRotation),
    panelThickness: activeStrokeBrushDepth(),
    panelLengthLoops: Number(deps.panelCreationDefaults.panelLengthLoops),
    panelWidthLoops: Number(deps.panelCreationDefaults.panelWidthLoops),
    panelCurvature: Number(deps.panelCreationDefaults.panelCurvature),
    panelLeftEdgeTrim: Number(deps.panelCreationDefaults.panelLeftEdgeTrim),
    panelRightEdgeTrim: Number(deps.panelCreationDefaults.panelRightEdgeTrim),
    profileTrimLeft: Number(deps.strandCreationDefaults.profileTrimLeft),
    profileTrimRight: Number(deps.strandCreationDefaults.profileTrimRight),
    profileTrimRoundness: Number(deps.strandCreationDefaults.profileTrimRoundness),
    hairCard: extensionLock?.hairCard ?? Boolean(deps.strandCreationDefaults.hairCard),
    strandSplitEnabled: Boolean(deps.strandCreationDefaults.strandSplitEnabled),
    strandSplitPosition: Number(deps.strandCreationDefaults.strandSplitPosition),
    strandSplitHeight: Number(deps.strandCreationDefaults.strandSplitHeight),
    strandSplitGap: Number(deps.strandCreationDefaults.strandSplitGap),
    panelSplitEnabled: deps.panelCreationDefaults.panelSplitEnabled !== false,
    panelSplitSnapToLoops: deps.panelCreationDefaults.panelSplitSnapToLoops !== false,
    panelSplitHeight: Number(deps.panelCreationDefaults.panelSplitHeight),
    panelSplits: deps.clonePanelSplits(deps.panelCreationDefaults.panelSplits, deps.panelCreationDefaults.panelSplitHeight),
    panelSplitGap: Number(deps.panelCreationDefaults.panelSplitGap),
    splitBones: deps.panelCreationDefaults.splitBones
      ? splitBonesFromData(deps.panelCreationDefaults.splitBones, deps.panelCreationDefaults.panelSplits, deps.panelCreationDefaults)
      : null,
    bones: deps.panelCreationDefaults.bones ? bonesFromData(deps.panelCreationDefaults.bones, deps.panelCreationDefaults) : null,
    curlEnabled: !drawingBraid && !drawingProcedural && deps.hairState.drawStrandMode === "coil",
    curlCount: Number(deps.strandCreationDefaults.curlCount),
    curlDisplacement: Number(deps.strandCreationDefaults.curlDisplacement),
    smoothing: Number(drawingBraid ? deps.braidSmoothingInput.value : drawingPanel ? deps.panelSmoothingInput.value : deps.drawStrandSmoothingInput.value),
    curveStep: Number(drawingBraid ? deps.braidCurveStepInput.value : drawingPanel ? deps.panelCurveStepInput.value : deps.drawStrandCurveStepInput.value),
    surfaceNormalInfluence: drawingBraid ? 0 : Number(drawingPanel ? deps.panelSurfaceNormalInfluenceInput.value : deps.drawSurfaceNormalInfluenceInput.value),
    rootAttachmentEnabled: branchStart
      ? false
      : extensionLock
      ? extensionLock.rootAttachmentEnabled !== false
      : surfaceMode !== "contextual-plane" && !liveSurfaceStrandId(surfaceMode),
    scalpOffset,
    rootSurfacePoint: extensionLock?.rootSurfacePoint?.clone() || anchoredStart?.clone() || hit.point.clone(),
    rootSurfaceNormal: extensionLock?.rootSurfaceNormal?.clone() || branchStart?.normal.clone() || sample.normal.clone(),
    proceduralDraw: drawingProcedural,
    proceduralAccessoryCount: drawingProcedural ? deps.PROCEDURAL_DRAW_DEFAULTS.accessoryCount : 0,
    proceduralAccessoryRadius: drawingProcedural ? deps.PROCEDURAL_DRAW_DEFAULTS.accessoryRadius : 0,
    proceduralParentVisible: !drawingProcedural || deps.PROCEDURAL_DRAW_DEFAULTS.parentVisible,
    proceduralBranchCount: drawingProcedural ? deps.PROCEDURAL_DRAW_DEFAULTS.branchCount : 0,
    proceduralBranchLength: deps.PROCEDURAL_DRAW_DEFAULTS.branchLength,
    proceduralBranchLengthCurve: deps.shapePresets.cloneShapePresetValue(deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE),
    proceduralBranchShapeCurve: deps.shapePresets.cloneShapePresetValue(deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE),
    proceduralBranchTipOffset: deps.PROCEDURAL_DRAW_DEFAULTS.branchTipOffset,
    extensionLockId: extensionLock?.id || null,
    branchSourceLockId: branchStart?.lock.id || null,
    branchSourcePointIndex: branchStart?.pointIndex ?? null,
    samples: [sample],
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    cardinalConstrained: false,
    cardinalDirectionKey: "",
    initialFreePlane,
    freePlane: initialFreePlane
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = "crosshair";
  deps.drawStrandBrushCursor.visible = false;
  updateDrawStrandPreview();
  deps.updateInteractionLocks();
  deps.updatePlacementStatus();
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function beginDrawFreePlane(stroke) {
  if (stroke.freePlane) return;
  const origin = stroke.surfaceMode === "contextual-plane"
    ? new THREE.Vector3(0, 0, 0)
    : stroke.samples.at(-1).point.clone();
  const normal = deps.viewPlaneNormal();
  stroke.freePlane = {
    origin,
    normal,
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, origin)
  };
  deps.updateViewPlaneGrid();
}

function drawStrokeSampleAtEvent(stroke, event) {
  let nextSample = null;
  if (!stroke.freePlane) {
    const hit = drawSurfaceHitFromEvent(event, { excludeLockId: stroke.extensionLockId });
    if (hit) {
      const surfaceSample = drawSampleFromHit(hit, false, stroke.scalpRegion, stroke.scalpOffset);
      if (strokeSurfaceIsContextual(stroke.surfaceMode, stroke.dynamicContextual)) {
        const previous = stroke.samples.at(-1);
        const movingDown = surfaceSample.point.y < previous.point.y - 0.004;
        if (movingDown && surfaceSample.normal.y < -0.08) beginDrawFreePlane(stroke);
        else nextSample = surfaceSample;
      } else {
        nextSample = surfaceSample;
      }
    } else if (strokeSurfaceIsContextual(stroke.surfaceMode, stroke.dynamicContextual)) {
      beginDrawFreePlane(stroke);
    }
  }
  if (stroke.freePlane && !nextSample) {
    const point = deps.rayFromViewportEvent(event).intersectPlane(stroke.freePlane.plane, new THREE.Vector3());
    if (point) nextSample = { point, surfacePoint: null, normal: null, onSurface: false };
  }
  return nextSample;
}

function updateDrawStrandStroke(event) {
  updateDrawStrandBrushCursor(event);
  const stroke = deps.sculptState.drawStrandStroke;
  if (!stroke || event.pointerId !== stroke.pointerId) return;
  if (!event.shiftKey && stroke.cardinalConstrained) {
    stroke.samples = [stroke.samples[0]];
    stroke.cardinalConstrained = false;
    stroke.cardinalDirectionKey = "";
    stroke.freePlane = stroke.initialFreePlane;
    stroke.lastX = stroke.startX;
    stroke.lastY = stroke.startY;
  }
  let sampleEvent = event;
  if (event.shiftKey) {
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
    sampleEvent = {
      clientX: stroke.startX + delta.x,
      clientY: stroke.startY + delta.y
    };
  }
  const screenDistance = Math.hypot(sampleEvent.clientX - stroke.lastX, sampleEvent.clientY - stroke.lastY);
  const sampleSpacing = THREE.MathUtils.lerp(2.5, 9, stroke.smoothing);
  if (screenDistance < sampleSpacing) return;

  const nextSample = drawStrokeSampleAtEvent(stroke, sampleEvent);
  if (!nextSample || nextSample.point.distanceTo(stroke.samples.at(-1).point) < 0.008) return;
  stroke.samples.push(nextSample);
  stroke.lastX = sampleEvent.clientX;
  stroke.lastY = sampleEvent.clientY;
  updateDrawStrandPreview();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function createDrawnLock(stroke, points, pointSurfaceNormals, width, isCenter, shapeTemplate = null, clumpTemplate = null) {
  const root = points[0];
  const length = new THREE.CatmullRomCurve3(points).getLength();
  const templateSettings = shapeTemplate?.settings || {};
  const setting = (key, fallback) => templateSettings[key] ?? fallback;
  const lock = deps.addLock("front", {
    x: root.x,
    y: root.y,
    z: root.z,
    length,
    curve: points.at(-1).x - root.x,
    width,
    strandRotation: Number(setting("strandRotation", deps.strandCreationDefaults.strandRotation)),
    twist: Number(setting("twist", deps.strandCreationDefaults.twist)),
    twistCurve: deps.shapePresets.cloneShapePresetValue(setting("twistCurve", deps.strandCreationDefaults.twistCurve)),
    taperCurve: deps.shapePresets.cloneShapePresetValue(setting("taperCurve", deps.strandCreationDefaults.taperCurve)),
    depthCurve: deps.shapePresets.cloneShapePresetValue(setting("depthCurve", deps.strandCreationDefaults.depthCurve)),
    taperCurveSecondary: deps.shapePresets.cloneShapePresetValue(setting("taperCurveSecondary", deps.strandCreationDefaults.taperCurveSecondary)),
    depthCurveSecondary: deps.shapePresets.cloneShapePresetValue(setting("depthCurveSecondary", deps.strandCreationDefaults.depthCurveSecondary)),
    asymmetricWidthCurve: Boolean(setting("asymmetricWidthCurve", deps.strandCreationDefaults.asymmetricWidthCurve)),
    asymmetricDepthCurve: Boolean(setting("asymmetricDepthCurve", deps.strandCreationDefaults.asymmetricDepthCurve)),
    centerAsymmetricProfile: Boolean(setting("centerAsymmetricProfile", deps.strandCreationDefaults.centerAsymmetricProfile)),
    widthScale: Number(setting("widthScale", deps.strandCreationDefaults.widthScale)),
    depthScale: Number(setting("depthScale", deps.strandCreationDefaults.depthScale)),
    profileTrimLeft: Number(setting("profileTrimLeft", stroke.profileTrimLeft ?? deps.strandCreationDefaults.profileTrimLeft)),
    profileTrimRight: Number(setting("profileTrimRight", stroke.profileTrimRight ?? deps.strandCreationDefaults.profileTrimRight)),
    profileTrimRoundness: Number(setting("profileTrimRoundness", stroke.profileTrimRoundness ?? deps.strandCreationDefaults.profileTrimRoundness)),
    hairCard: Boolean(setting("hairCard", stroke.hairCard ?? deps.strandCreationDefaults.hairCard)),
    strandSplitEnabled: Boolean(setting("strandSplitEnabled", stroke.strandSplitEnabled ?? deps.strandCreationDefaults.strandSplitEnabled)),
    strandSplitPosition: Number(setting("strandSplitPosition", stroke.strandSplitPosition ?? deps.strandCreationDefaults.strandSplitPosition)),
    strandSplitHeight: Number(setting("strandSplitHeight", stroke.strandSplitHeight ?? deps.strandCreationDefaults.strandSplitHeight)),
    strandSplitGap: Number(setting("strandSplitGap", stroke.strandSplitGap ?? deps.strandCreationDefaults.strandSplitGap)),
    depth: shapeTemplate && clumpTemplate
      ? stroke.brushSize * ((shapeTemplate.depth ?? shapeTemplate.width) / clumpTemplate.baseWidth)
      : stroke.brushDepth,
    sweepProfile: deps.shapePresets.cloneShapePresetValue(setting("sweepProfile", deps.strandCreationDefaults.sweepProfile)),
    profileOffset: Number(setting("profileOffset", deps.strandCreationDefaults.profileOffset)),
    radialSegments: Number(setting("radialSegments", deps.strandCreationDefaults.radialSegments)),
    lengthSegments: Number(setting("lengthSegments", deps.strandCreationDefaults.lengthSegments)),
    dynamicDensity: Boolean(setting("dynamicDensity", deps.strandCreationDefaults.dynamicDensity)),
    densityAggression: Number(setting("densityAggression", deps.strandCreationDefaults.densityAggression)),
    twistDensity: Number(setting("twistDensity", deps.strandCreationDefaults.twistDensity)),
    curlEnabled: Boolean(stroke.curlEnabled),
    curlCount: Number(stroke.curlCount ?? 4),
    curlDisplacement: Number(stroke.curlDisplacement ?? 0.18),
    surfaceNormalInfluence: Number(stroke.surfaceNormalInfluence ?? 0),
    pointSurfaceNormals,
    color: DEFAULT_HAIR_COLOR,
    scalpRegion: stroke.scalpRegion,
    hairLayer: setting("hairLayer", deps.strandCreationDefaults.hairLayer),
    rootAttachmentEnabled: stroke.rootAttachmentEnabled,
    rootScalpOffset: THREE.MathUtils.clamp(
      Number(setting("rootScalpOffset", deps.strandCreationDefaults.rootScalpOffset)) + stroke.scalpOffset,
      -1,
      1
    ),
    rootSurfacePoint: isCenter ? stroke.rootSurfacePoint : null,
    rootSurfaceNormal: isCenter ? stroke.rootSurfaceNormal : null,
    proceduralParentHidden: Boolean(stroke.proceduralDraw && isCenter && !stroke.proceduralParentVisible),
    points
  }, { deferUi: true });
  deps.applyPlacedStrandScaleProfile(lock);
  if (shapeTemplate?.pointTwists?.length) {
    lock.pointTwists = lock.points.map((_, index) => (
      sampleArray(shapeTemplate.pointTwists, index / Math.max(1, lock.points.length - 1))
    ));
  }
  deps.updateLockGeometry(lock);
  lock.curveObjects.group.visible = false;
  return lock;
}

function finalizeDrawnLockSelection(lock) {
  if (!lock) return null;
  deps.selectLock(lock.id, { individualClumpMember: true });
  deps.rebuildCurveObjects(lock);
  deps.updateCurveObjects(lock, { visible: true });
  return lock;
}

function createDrawnBraid(stroke) {
  if (!deps.braidMeshPresets.has(stroke.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET)
    && !deps.braidMeshPresets.has(DEFAULT_BRAID_MESH_PRESET)) return null;
  const processed = processedDrawStroke(stroke.samples, stroke.smoothing, stroke.curveStep);
  if (processed.length < 3 || strokeLength(processed) < 0.12) return null;
  const points = processed.map((sample) => sample.point.clone());
  const root = points[0];
  const length = new THREE.CatmullRomCurve3(points).getLength();
  const defaults = deps.braidCreationDefaults;
  const lock = deps.addLock("front", {
    geometryType: "braid",
    braidMeshPreset: stroke.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET,
    x: root.x,
    y: root.y,
    z: root.z,
    length,
    curve: points.at(-1).x - root.x,
    width: stroke.braidWidth,
    braidWidth: stroke.braidWidth,
    braidDepth: stroke.braidDepth,
    braidSegmentLength: stroke.braidSegmentLength,
    braidRotation: stroke.braidRotation,
    strandRotation: defaults.strandRotation,
    twist: defaults.twist,
    twistCurve: deps.shapePresets.cloneShapePresetValue(defaults.twistCurve),
    taperCurve: deps.shapePresets.cloneShapePresetValue(defaults.taperCurve),
    depthCurve: deps.shapePresets.cloneShapePresetValue(defaults.depthCurve),
    taperCurveSecondary: deps.shapePresets.cloneShapePresetValue(defaults.taperCurveSecondary),
    depthCurveSecondary: deps.shapePresets.cloneShapePresetValue(defaults.depthCurveSecondary),
    asymmetricWidthCurve: Boolean(defaults.asymmetricWidthCurve),
    asymmetricDepthCurve: Boolean(defaults.asymmetricDepthCurve),
    centerAsymmetricProfile: Boolean(defaults.centerAsymmetricProfile),
    sweepProfile: deps.shapePresets.cloneShapePresetValue(defaults.sweepProfile),
    profileOffset: defaults.profileOffset,
    widthScale: defaults.widthScale,
    depthScale: defaults.depthScale,
    hairLayer: defaults.hairLayer,
    color: DEFAULT_HAIR_COLOR,
    scalpRegion: stroke.scalpRegion,
    rootAttachmentEnabled: stroke.rootAttachmentEnabled,
    rootScalpOffset: THREE.MathUtils.clamp(
      defaults.rootScalpOffset + stroke.scalpOffset,
      -1,
      1
    ),
    rootSurfacePoint: stroke.rootSurfacePoint,
    rootSurfaceNormal: stroke.rootSurfaceNormal,
    points
  }, { deferUi: true });
  deps.updateLockGeometry(lock);
  lock.curveObjects.group.visible = false;
  deps.createMirrorPartnerForNewLock(lock);
  deps.renderLockList();
  deps.updateCount();
  return finalizeDrawnLockSelection(lock);
}

function createDrawnStrand(stroke) {
  if (stroke.outputType === "braid") return createDrawnBraid(stroke);
  if (stroke.outputType === "panel") return createDrawnPanel(stroke);
  const processed = processedDrawStroke(stroke.samples, stroke.smoothing, stroke.curveStep);
  if (processed.length < 3 || strokeLength(processed) < 0.12) return null;
  const pointSurfaceNormals = strokeSurfaceNormals(processed, stroke.rootSurfaceNormal);
  const clumpTemplate = activeDrawClumpTemplate(stroke);
  const strandMaps = clumpTemplate
    ? drawClumpStrandMaps(processed, stroke.brushSize, clumpTemplate)
    : [{
      points: processed.map((sample) => sample.point.clone()),
      pointSurfaceNormals
    }];
  const templates = clumpTemplate
    ? clumpTemplate.strands
    : [{ width: deps.DRAW_CLUMP_TEMPLATE.baseWidth }];
  const created = strandMaps.map((strandMap, index) => createDrawnLock(
    stroke,
    strandMap.points,
    strandMap.pointSurfaceNormals,
    stroke.brushSize * (templates[index].width / (clumpTemplate?.baseWidth || deps.DRAW_CLUMP_TEMPLATE.baseWidth)),
    index === 0,
    templates[index],
    clumpTemplate
  ));
  let proceduralGuide = null;
  if (clumpTemplate && !stroke.branchSourceLockId) {
    const clumpName = deps.nextClumpName();
    const guide = deps.createClumpFromLocks(created, {
      name: clumpName,
      allowSingle: Boolean(stroke.proceduralDraw)
    });
    if (guide && stroke.proceduralDraw) {
      proceduralGuide = guide;
      guide.proceduralDrawGuide = true;
      guide.proceduralAccessoryCount = Math.max(0, created.length - 1);
      guide.proceduralAccessoryRadius = THREE.MathUtils.clamp(Number(stroke.proceduralAccessoryRadius ?? 0.7), 0, 2);
      guide.proceduralBranchCount = THREE.MathUtils.clamp(Math.round(Number(stroke.proceduralBranchCount ?? 0)), 0, 64);
      guide.proceduralBranchLength = THREE.MathUtils.clamp(Number(stroke.proceduralBranchLength ?? 0.6), 0.1, 3);
      guide.proceduralBranchLengthCurve = normalizeTaperCurve(
        stroke.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
      );
      guide.proceduralBranchShapeCurve = normalizeTaperCurve(
        stroke.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
      );
      guide.proceduralBranchTipOffset = THREE.MathUtils.clamp(Number(stroke.proceduralBranchTipOffset ?? 0.35), 0, 2);
      created.slice(1).forEach((lock, index) => {
        lock.proceduralAccessory = true;
        lock.proceduralAccessoryIndex = index;
      });
    }
    if (guide && clumpTemplate.clumpSettings) {
      Object.entries(clumpTemplate.clumpSettings).forEach(([key, value]) => {
        if (Number.isFinite(Number(value))) guide[key] = Number(value);
      });
      deps.updateClumpMembers(guide);
    }
  }
  const mirroredCreated = created.map(deps.createMirrorPartnerForNewLock).filter(Boolean);
  let mirroredProceduralGuide = null;
  if (!stroke.branchSourceLockId && mirroredCreated.length === created.length && mirroredCreated.length > 1) {
    const mirroredGuide = deps.createClumpFromLocks(mirroredCreated, {
      name: created[0].clumpName || deps.nextClumpName()
    });
    if (mirroredGuide && stroke.proceduralDraw) {
      mirroredProceduralGuide = mirroredGuide;
      mirroredGuide.proceduralDrawGuide = true;
      mirroredGuide.proceduralAccessoryCount = Math.max(0, mirroredCreated.length - 1);
      mirroredGuide.proceduralAccessoryRadius = THREE.MathUtils.clamp(Number(stroke.proceduralAccessoryRadius ?? 0.7), 0, 2);
      mirroredGuide.proceduralBranchCount = THREE.MathUtils.clamp(Math.round(Number(stroke.proceduralBranchCount ?? 0)), 0, 64);
      mirroredGuide.proceduralBranchLength = THREE.MathUtils.clamp(Number(stroke.proceduralBranchLength ?? 0.6), 0.1, 3);
      mirroredGuide.proceduralBranchLengthCurve = normalizeTaperCurve(
        stroke.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
      );
      mirroredGuide.proceduralBranchShapeCurve = normalizeTaperCurve(
        stroke.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
      );
      mirroredGuide.proceduralBranchTipOffset = THREE.MathUtils.clamp(Number(stroke.proceduralBranchTipOffset ?? 0.35), 0, 2);
      mirroredCreated.slice(1).forEach((lock, index) => {
        lock.proceduralAccessory = true;
        lock.proceduralAccessoryIndex = index;
      });
    }
  } else if (!stroke.branchSourceLockId && mirroredCreated.length === 1 && stroke.proceduralDraw) {
    mirroredProceduralGuide = deps.createClumpFromLocks(mirroredCreated, {
      name: created[0].clumpName || deps.nextClumpName(),
      allowSingle: true
    });
    if (mirroredProceduralGuide) {
      mirroredProceduralGuide.proceduralDrawGuide = true;
      mirroredProceduralGuide.proceduralAccessoryCount = 0;
      mirroredProceduralGuide.proceduralAccessoryRadius = THREE.MathUtils.clamp(Number(stroke.proceduralAccessoryRadius ?? 0.7), 0, 2);
      mirroredProceduralGuide.proceduralBranchCount = THREE.MathUtils.clamp(Math.round(Number(stroke.proceduralBranchCount ?? 0)), 0, 64);
      mirroredProceduralGuide.proceduralBranchLength = THREE.MathUtils.clamp(Number(stroke.proceduralBranchLength ?? 0.6), 0.1, 3);
      mirroredProceduralGuide.proceduralBranchLengthCurve = normalizeTaperCurve(
        stroke.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
      );
      mirroredProceduralGuide.proceduralBranchShapeCurve = normalizeTaperCurve(
        stroke.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
      );
      mirroredProceduralGuide.proceduralBranchTipOffset = THREE.MathUtils.clamp(Number(stroke.proceduralBranchTipOffset ?? 0.35), 0, 2);
    }
  }
  if (proceduralGuide) {
    deps.applyProceduralBranchSettings(proceduralGuide, {
      count: stroke.proceduralBranchCount,
      length: stroke.proceduralBranchLength,
      tipOffset: stroke.proceduralBranchTipOffset
    });
    if (mirroredProceduralGuide) deps.syncMirrorPartnerFromLock(proceduralGuide, mirroredProceduralGuide);
  }
  if (stroke.branchSourceLockId) {
    const source = deps.locks.find((lock) => lock.id === stroke.branchSourceLockId);
    deps.branchHierarchy.attachDrawnLocksAsBranches(stroke, created);
    const mirroredSource = deps.mirrorPartnerFor(source);
    if (mirroredSource && mirroredCreated.length === created.length) {
      deps.branchHierarchy.attachDrawnLocksAsBranches({
        ...stroke,
        branchSourceLockId: mirroredSource.id
      }, mirroredCreated);
    }
  }
  deps.renderLockList();
  deps.updateCount();
  return finalizeDrawnLockSelection(created[0]);
}

function createDrawnPanel(stroke) {
  const processed = processedDrawStroke(stroke.samples, stroke.smoothing, stroke.curveStep);
  if (processed.length < 3 || strokeLength(processed) < 0.12) return null;
  const points = processed.map((sample) => sample.point.clone());
  const root = points[0];
  const lock = deps.addLock("front", {
    geometryType: "panel",
    x: root.x,
    y: root.y,
    z: root.z,
    length: new THREE.CatmullRomCurve3(points).getLength(),
    curve: points.at(-1).x - root.x,
    width: stroke.brushSize,
    panelThickness: stroke.panelThickness,
    panelLengthLoops: stroke.panelLengthLoops,
    panelWidthLoops: stroke.panelWidthLoops,
    panelCurvature: stroke.panelCurvature,
    panelLeftEdgeTrim: stroke.panelLeftEdgeTrim,
    panelRightEdgeTrim: stroke.panelRightEdgeTrim,
    panelSplitEnabled: stroke.panelSplitEnabled,
    panelSplitSnapToLoops: stroke.panelSplitSnapToLoops !== false,
    panelSplitHeight: stroke.panelSplitHeight,
    panelSplits: deps.clonePanelSplits(stroke.panelSplits, stroke.panelSplitHeight),
    panelSplitGap: stroke.panelSplitGap,
    splitBones: stroke.splitBones ? splitBonesFromData(stroke.splitBones, stroke.panelSplits, stroke) : null,
    bones: stroke.bones ? bonesFromData(stroke.bones, stroke) : null,
    taperCurve: deps.panelCreationDefaults.taperCurve.map((point) => ({ ...point })),
    depthCurve: deps.panelCreationDefaults.depthCurve.map((point) => ({ ...point })),
    taperCurveSecondary: deps.panelCreationDefaults.taperCurveSecondary.map((point) => ({ ...point })),
    depthCurveSecondary: deps.panelCreationDefaults.depthCurveSecondary.map((point) => ({ ...point })),
    asymmetricWidthCurve: Boolean(deps.panelCreationDefaults.asymmetricWidthCurve),
    asymmetricDepthCurve: Boolean(deps.panelCreationDefaults.asymmetricDepthCurve),
    centerAsymmetricProfile: Boolean(deps.panelCreationDefaults.centerAsymmetricProfile),
    surfaceNormalInfluence: Number(stroke.surfaceNormalInfluence ?? 1),
    pointSurfaceNormals: strokeSurfaceNormals(processed, stroke.rootSurfaceNormal),
    color: DEFAULT_HAIR_COLOR,
    scalpRegion: stroke.scalpRegion,
    hairLayer: deps.panelCreationDefaults.hairLayer,
    rootAttachmentEnabled: stroke.rootAttachmentEnabled,
    rootScalpOffset: THREE.MathUtils.clamp(deps.panelCreationDefaults.rootScalpOffset + stroke.scalpOffset, -1, 1),
    rootSurfacePoint: stroke.rootSurfacePoint,
    rootSurfaceNormal: stroke.rootSurfaceNormal,
    points
  }, { deferUi: true });
  deps.updateLockGeometry(lock);
  lock.curveObjects.group.visible = false;
  deps.createMirrorPartnerForNewLock(lock);
  deps.renderLockList();
  deps.updateCount();
  return finalizeDrawnLockSelection(lock);
}

function extendDrawnStrand(stroke) {
  const lock = deps.locks.find((item) => item.id === stroke.extensionLockId);
  if (!lock) return null;
  const processed = processedDrawStroke(stroke.samples, stroke.smoothing, stroke.curveStep);
  if (processed.length < 2 || strokeLength(processed) < 0.04) return null;
  const addedPoints = processed.slice(1).map((sample) => sample.point.clone());
  const addedSurfaceNormals = strokeSurfaceNormals(processed, lock.pointSurfaceNormals?.at(-1) || stroke.rootSurfaceNormal).slice(1);
  if (!addedPoints.length) return null;
  const existingSurfaceNormals = lock.points.map((_, index) => lock.pointSurfaceNormals?.[index] || null);
  const lastScale = lock.pointScales.at(-1) || { x: 1, z: 1 };
  const lastWidth = lock.pointWidths.at(-1) ?? 1;
  const lastTwist = lock.pointTwists.at(-1) ?? 0;
  lock.points.push(...addedPoints);
  lock.pointScales.push(...addedPoints.map(() => ({ ...lastScale })));
  lock.pointWidths.push(...addedPoints.map(() => lastWidth));
  lock.pointTwists.push(...addedPoints.map(() => lastTwist));
  lock.pointSurfaceNormals = [...existingSurfaceNormals, ...addedSurfaceNormals];
  if (lock.geometryType !== "braid") lock.surfaceNormalInfluence = Number(stroke.surfaceNormalInfluence ?? lock.surfaceNormalInfluence ?? 0);
  if (lock.geometryType !== "braid" && stroke.curlEnabled) {
    lock.curlEnabled = true;
    lock.curlCount = Number(stroke.curlCount ?? lock.curlCount ?? 4);
    lock.curlDisplacement = Number(stroke.curlDisplacement ?? lock.curlDisplacement ?? 0.18);
  }
  deps.syncLockFromCurve(lock);
  if (lock.curveObjects.handles.length !== lock.points.length) deps.rebuildCurveObjects(lock);
  deps.updateLockGeometry(lock);
  deps.syncActiveMirror(lock, { refreshUi: true });
  deps.selectLock(lock.id, { individualClumpMember: Boolean(lock.clumpId && !lock.clumpGuide) });
  deps.renderLockList();
  deps.updateCount();
  return lock;
}

function finishDrawStrandStroke(event, options = {}) {
  const stroke = deps.sculptState.drawStrandStroke;
  if (!stroke || (event?.pointerId !== undefined && event.pointerId !== stroke.pointerId)) return;
  deps.sculptState.drawStrandStroke = null;
  if (deps.renderer.domElement.hasPointerCapture?.(stroke.pointerId)) deps.renderer.domElement.releasePointerCapture(stroke.pointerId);
  deps.renderer.domElement.style.cursor = "";
  deps.drawStrandPreview.visible = false;
  deps.drawStrandPreview.geometry.setFromPoints([]);
  deps.drawStrandMirrorPreview.visible = false;
  deps.drawStrandMirrorPreview.geometry.setFromPoints([]);
  resetDrawVolumePreview(deps.drawStrandVolumePreview);
  resetDrawVolumePreview(deps.drawStrandMirrorVolumePreview);
  [...deps.drawStrandClumpVolumePreviews, ...deps.drawStrandClumpMirrorPreviews].forEach(resetDrawVolumePreview);
  deps.viewPlaneFill.visible = false;
  deps.viewPlaneGrid.visible = false;
  const minimumStrokeLength = stroke.extensionLockId ? 0.04 : 0.12;
  if (!options.cancel && stroke.samples.length >= 2 && strokeLength(stroke.samples) >= minimumStrokeLength) {
    deps.pushUndoState();
    if (stroke.extensionLockId) extendDrawnStrand(stroke);
    else createDrawnStrand(stroke);
  }
  deps.updateInteractionLocks();
  deps.updateAttributeEditorMode();
  deps.updatePlacementStatus();
  event?.preventDefault();
}

  return {
    activeDrawClumpTemplate,
    proceduralDrawClumpTemplate,
    drawModeCreatesClump,
    selectedCurveLatticeGuide,
    braidStrokeActive,
    proceduralDrawActive,
    panelStrokeActive,
    activeStrokeSurfaceInput,
    activeStrokeSurfaceValue,
    normalizedLiveSurfaceSelection,
    activeStrokeDynamicEnabled,
    drawSurfaceDynamicEnabled,
    setDrawSurfaceDynamicEnabled,
    setActiveStrokeSurfaceValue,
    liveSurfaceStrandId,
    liveSurfaceStrand,
    liveSurfaceGuideId,
    guideSupportsLiveSurface,
    liveSurfaceGuide,
    refreshLiveSurfaceOptions,
    activeStrokeBrushSize,
    activeStrokeBrushDepth,
    strokeSurfaceIsContextual,
    contextualPlaneAtOrigin,
    drawSurfaceHitFromEvent,
    worldNormalAtHit,
    drawSampleFromHit,
    updateDrawStrandBrushCursor,
    strokeLength,
    resampleDrawStroke,
    processedDrawStroke,
    strokeSurfaceNormals,
    drawClumpFrame,
    nearestCurveParameter,
    drawClumpSampleNormal,
    drawClumpTemplateVector,
    applyDrawClumpTemplateSettings,
    drawClumpStrandMaps,
    updateDrawVolumePreview,
    hideDrawClumpPreviews,
    resetDrawVolumePreview,
    updateDrawStrandPreview,
    continueFromTipEnabled,
    selectedTipContinuationLock,
    beginDrawStrandStroke,
    beginDrawFreePlane,
    drawStrokeSampleAtEvent,
    updateDrawStrandStroke,
    createDrawnLock,
    finalizeDrawnLockSelection,
    createDrawnBraid,
    createDrawnStrand,
    createDrawnPanel,
    extendDrawnStrand,
    finishDrawStrandStroke,
  };
}
