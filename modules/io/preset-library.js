// preset-library.js — preset library + hair generator logic layer (refactor batch B3).
// Extracted from app.js; all app.js coupling injected via createPresetLibraryApi(deps).
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { parseObjFaceVertexCounts } from "../geometry/topology.js";
import { createClumpBrushTemplate, normalizeClumpBrushTemplate } from "../data/clump-brush-presets.js";
import { removeToolPreset } from "../data/tool-presets.js";
import { removeShapePreset } from "../data/shape-presets.js";
import { DEFAULT_BRAID_MESH_PRESET } from "../core/app-config.js";
export function createPresetLibraryApi(deps) {
  // deps: { presetCatalog, authoredPresetProjects, braidMeshPresets (Map), SHAPE_PRESETS,
  //   BRAID_TOOL_PRESETS, braidCreationDefaults, strandCreationDefaults,
  //   projectState (store; use deps.projectState.state.*),
  //   sculptState/hairState/guideState/drawState/miscState (.state proxies; use deps.X.y),
  //   undoHistory, redoHistory, locks,
  //   shapePresets, creationPresets, scalpBuilder, taperEditor,
  //   updateLockGeometry, getSelectedLock, updatePlacementStatus, restoreState, snapshotState,
  //   updateHistoryButtons, pushUndoState, updateDrawStrandPreview, syncCreationShapeInputs,
  //   setDrawStrandMode, setDrawStrandBrushCursorScale, activeStrokeBrushSize,
  //   normalizedLiveSurfaceSelection, drawSurfaceDynamicEnabled, setDrawSurfaceDynamicEnabled,
  //   pushPointOutsideHead, updateViewportStatsVisibility,
  //   + preset library / shape preset / creation preset DOM element refs }
function braidTemplateFromEntries(entries) {
  const faceVertexCounts = [];
  const geometries = entries.map((entry, partIndex) => {
    const geometry = entry.mesh.geometry.clone();
    geometry.applyMatrix4(entry.mesh.matrixWorld);
    const part = geometry.index ? geometry.toNonIndexed() : geometry;
    const triangleCount = part.getAttribute("position").count / 3;
    const authoredCounts = entry.mesh.userData.braidFaceVertexCounts || [];
    const authoredTriangleCount = authoredCounts.reduce((total, count) => total + count - 2, 0);
    faceVertexCounts.push(...(
      authoredTriangleCount === triangleCount
        ? authoredCounts
        : new Array(triangleCount).fill(3)
    ));
    part.setAttribute(
      "braidPart",
      new THREE.Float32BufferAttribute(new Array(part.getAttribute("position").count).fill(partIndex), 1)
    );
    return part;
  });
  if (!geometries.length) return null;
  const geometry = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries, false);
  geometries.forEach((item) => {
    if (item !== geometry) item.dispose();
  });
  return {
    geometry,
    faceVertexCounts,
    bounds: new THREE.Box3().setFromBufferAttribute(geometry.getAttribute("position"))
  };
}

function braidMeshEntries(obj) {
  const entries = [];
  obj.updateMatrixWorld(true);
  obj.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const box = new THREE.Box3().setFromBufferAttribute(mesh.geometry.getAttribute("position"));
    box.applyMatrix4(mesh.matrixWorld);
    entries.push({ mesh, box });
  });
  return entries.sort((a, b) => a.box.min.y - b.box.min.y);
}

function prepareBraidBodyCache(template) {
  const sourcePosition = template.geometry.getAttribute("position");
  const sourceNormal = template.geometry.getAttribute("normal");
  const sourceUv = template.geometry.getAttribute("uv");
  const sourcePart = template.geometry.getAttribute("braidPart");
  const sourceSize = template.bounds.getSize(new THREE.Vector3());
  const sourceCenter = template.bounds.getCenter(new THREE.Vector3());
  const sourceMinY = template.bounds.min.y;
  const sourceLength = Math.max(0.0001, sourceSize.y);
  const quantize = (value, precision = 10000) => Math.round(value * precision);
  const seamData = new Map();
  const sourceUvBounds = { min: new THREE.Vector2(Infinity, Infinity), max: new THREE.Vector2(-Infinity, -Infinity) };
  if (sourceUv) {
    for (let index = 0; index < sourceUv.count; index += 1) {
      sourceUvBounds.min.x = Math.min(sourceUvBounds.min.x, sourceUv.getX(index));
      sourceUvBounds.min.y = Math.min(sourceUvBounds.min.y, sourceUv.getY(index));
      sourceUvBounds.max.x = Math.max(sourceUvBounds.max.x, sourceUv.getX(index));
      sourceUvBounds.max.y = Math.max(sourceUvBounds.max.y, sourceUv.getY(index));
    }
  }
  if (sourceNormal) {
    const sourceNormalAt = (sourceIndex) => new THREE.Vector3(
      sourceNormal.getX(sourceIndex), sourceNormal.getY(sourceIndex), sourceNormal.getZ(sourceIndex)
    ).normalize();
    const clusterBoundary = (boundaryY) => {
      const clusters = new Map();
      for (let sourceIndex = 0; sourceIndex < sourcePosition.count; sourceIndex += 1) {
        if (Math.abs(sourcePosition.getY(sourceIndex) - boundaryY) > 0.0001) continue;
        const partIndex = sourcePart ? Math.round(sourcePart.getX(sourceIndex)) : 0;
        const key = [partIndex, quantize(sourcePosition.getX(sourceIndex), 100000), quantize(sourcePosition.getZ(sourceIndex), 100000)].join("|");
        if (!clusters.has(key)) {
          clusters.set(key, {
            partIndex,
            position: new THREE.Vector2(sourcePosition.getX(sourceIndex), sourcePosition.getZ(sourceIndex)),
            indices: []
          });
        }
        clusters.get(key).indices.push(sourceIndex);
      }
      return [...clusters.values()];
    };
    const normalBuckets = (indices) => {
      const buckets = [];
      indices.forEach((sourceIndex) => {
        const normal = sourceNormalAt(sourceIndex);
        let bucket = buckets.find((candidate) => candidate.normal.dot(normal) > 0.9999);
        if (!bucket) {
          bucket = { normal, indices: [] };
          buckets.push(bucket);
        }
        bucket.indices.push(sourceIndex);
      });
      return buckets;
    };
    const startClusters = clusterBoundary(sourceMinY);
    const endClusters = clusterBoundary(template.bounds.max.y);
    const unusedEndClusters = new Set(endClusters);
    startClusters.forEach((startCluster) => {
      let endCluster = null;
      let nearestDistance = Infinity;
      unusedEndClusters.forEach((candidate) => {
        if (candidate.partIndex !== startCluster.partIndex) return;
        const distance = startCluster.position.distanceToSquared(candidate.position);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          endCluster = candidate;
        }
      });
      if (!endCluster || nearestDistance > 0.001 * 0.001) return;
      unusedEndClusters.delete(endCluster);
      const canonicalPosition = startCluster.position.clone().add(endCluster.position).multiplyScalar(0.5);
      const startBuckets = normalBuckets(startCluster.indices);
      const endBuckets = normalBuckets(endCluster.indices);
      const applyBucketPair = (bucket, candidates) => {
        const counterpart = candidates.reduce((best, candidate) => (
          !best || bucket.normal.dot(candidate.normal) > bucket.normal.dot(best.normal) ? candidate : best
        ), null);
        const normal = counterpart ? bucket.normal.clone().add(counterpart.normal).normalize() : bucket.normal.clone();
        bucket.indices.forEach((sourceIndex) => seamData.set(sourceIndex, {
          x: canonicalPosition.x,
          z: canonicalPosition.y,
          normal
        }));
      };
      startBuckets.forEach((bucket) => applyBucketPair(bucket, endBuckets));
      endBuckets.forEach((bucket) => applyBucketPair(bucket, startBuckets));
    });
  }
  return {
    sourcePosition,
    sourceNormal,
    sourceUv,
    sourcePart,
    sourceSize,
    sourceCenter,
    sourceMinY,
    sourceLength,
    sourceFaceVertexCounts: template.faceVertexCounts,
    sourceUvBounds,
    uvHeight: Math.max(0.0001, sourceUvBounds.max.y - sourceUvBounds.min.y),
    seamData
  };
}

function registerBraidMeshPreset(id, obj, { authoredCaps = false } = {}) {
  const entries = braidMeshEntries(obj);
  if (!entries.length) throw new Error(`${id} braid preset contains no mesh geometry`);
  const startEntries = authoredCaps ? entries.slice(0, 1) : [];
  const endEntries = authoredCaps ? entries.slice(-1) : [];
  const bodyEntries = authoredCaps ? entries.slice(1, -1) : entries;
  if (!bodyEntries.length) throw new Error(`${id} braid preset contains no repeatable body geometry`);
  const body = braidTemplateFromEntries(bodyEntries);
  const start = braidTemplateFromEntries(startEntries);
  const end = braidTemplateFromEntries(endEntries);
  body.cache = prepareBraidBodyCache(body);
  deps.braidMeshPresets.set(id, { id, body, start, end, authoredCaps });
  if (id === DEFAULT_BRAID_MESH_PRESET) {
    deps.miscState.braidSegmentTemplate = body.geometry;
    deps.miscState.braidSegmentBounds = body.bounds;
  }
  deps.locks.filter((lock) => lock.geometryType === "braid" && (lock.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET) === id)
    .forEach(deps.updateLockGeometry);
  deps.updatePlacementStatus();
}

function annotateBraidObjTopology(obj, faceVertexCounts) {
  let faceCursor = 0;
  obj.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const targetTriangleCount = (mesh.geometry.index
      ? mesh.geometry.getIndex().count
      : mesh.geometry.getAttribute("position").count) / 3;
    const counts = [];
    let triangleCount = 0;
    while (faceCursor < faceVertexCounts.length && triangleCount < targetTriangleCount) {
      const count = faceVertexCounts[faceCursor++];
      counts.push(count);
      triangleCount += count - 2;
    }
    mesh.userData.braidFaceVertexCounts = triangleCount === targetTriangleCount
      ? counts
      : new Array(targetTriangleCount).fill(3);
  });
}

function loadBraidMeshPreset(id, path, options) {
  new THREE.FileLoader().load(path, (content) => {
    try {
      const obj = new OBJLoader().parse(content);
      annotateBraidObjTopology(obj, parseObjFaceVertexCounts(content));
      registerBraidMeshPreset(id, obj, options);
    } catch (error) {
      console.error(`Could not prepare ${id} braid mesh preset`, error);
    }
  }, undefined, (error) => {
    console.error(`Could not load ${id} braid mesh preset`, error);
  });
}

function setupShapePresetControls() {
  deps.shapePresetSelects.forEach((select) => {
    const picker = document.createElement("span");
    picker.className = "shape-preset-picker";
    select.before(picker);
    picker.append(select);
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "shape-preset-action";
    saveButton.textContent = "+";
    saveButton.title = `Save custom ${deps.shapePresets.shapePresetLabel(select.dataset.shapePreset).toLowerCase()} preset`;
    saveButton.setAttribute("aria-label", saveButton.title);
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "shape-preset-action";
    removeButton.textContent = "−";
    removeButton.title = "Remove selected custom preset";
    removeButton.setAttribute("aria-label", removeButton.title);
    picker.append(saveButton, removeButton);
    deps.shapePresetButtons.set(select, { saveButton, removeButton });
    saveButton.addEventListener("click", () => openSaveShapePreset(select));
    removeButton.addEventListener("click", () => openRemoveShapePreset(select));
  });
}

function syncShapePresetRemoveButtons() {
  deps.shapePresetButtons.forEach(({ removeButton }, select) => {
    removeButton.disabled = !select.value.startsWith("custom:");
  });
}

function syncShapePresetSelects() {
  deps.shapePresetSelects.forEach((select) => {
    const key = select.dataset.shapePreset;
    const target = deps.taperEditor.shapeTargetForSelect(select);
    const value = target?.[key];
    const builtInMatch = deps.SHAPE_PRESETS[key].find((preset) => deps.shapePresets.shapeValuesMatch(value, preset.value));
    const customMatch = deps.projectState.state.customShapePresets[key].find((preset) => (
      deps.shapePresets.shapeValuesMatch(value, preset.value)
      && (
        key === "sweepProfile"
        || (
          deps.shapePresets.shapeValuesMatch(target?.[deps.shapePresets.taperSecondaryKey(key)], preset.secondaryValue)
          && Boolean(target?.[deps.shapePresets.taperAsymmetryKey(key)]) === preset.asymmetric
        )
      )
    ));
    select.value = builtInMatch?.id || (customMatch ? `custom:${customMatch.id}` : "custom");
  });
  syncShapePresetRemoveButtons();
}

function populateShapePresetSelects() {
  deps.shapePresetSelects.forEach((select) => {
    const key = select.dataset.shapePreset;
    const presetsForShape = deps.SHAPE_PRESETS[key];
    const options = presetsForShape.map((preset) => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.name;
      return option;
    });
    const customGroup = document.createElement("optgroup");
    customGroup.label = "Custom Presets";
    deps.projectState.state.customShapePresets[key].forEach((preset) => {
      const option = document.createElement("option");
      option.value = `custom:${preset.id}`;
      option.textContent = preset.name;
      customGroup.append(option);
    });
    const custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = "Custom";
    custom.disabled = true;
    select.replaceChildren(...options, ...(customGroup.children.length ? [customGroup] : []), custom);
  });
  syncShapePresetSelects();
}

function openSaveShapePreset(select) {
  const key = select.dataset.shapePreset;
  const target = deps.taperEditor.shapeTargetForSelect(select);
  if (!target?.[key]?.length) return;
  deps.projectState.state.pendingCreationPresetType = null;
  deps.projectState.state.pendingShapePresetSave = {
    select,
    key,
    value: deps.shapePresets.cloneShapePresetValue(target[key]),
    secondaryValue: key === "sweepProfile"
      ? null
      : deps.shapePresets.cloneShapePresetValue(target[deps.shapePresets.taperSecondaryKey(key)] || target[key]),
    asymmetric: key === "sweepProfile" ? false : Boolean(target[deps.shapePresets.taperAsymmetryKey(key)])
  };
  const label = deps.shapePresets.shapePresetLabel(key);
  deps.creationPresetDialogTitle.textContent = `Create ${label} Preset`;
  deps.creationPresetDescription.textContent = `Save the current ${label.toLowerCase()} in this browser.`;
  deps.creationPresetNameInput.value = `New ${label} Preset`;
  deps.creationPresetDialog.showModal();
  requestAnimationFrame(() => {
    deps.creationPresetNameInput.focus();
    deps.creationPresetNameInput.select();
  });
}

function commitCustomShapePreset() {
  const pending = deps.projectState.state.pendingShapePresetSave;
  const name = deps.creationPresetNameInput.value.trim();
  if (!pending || !name) return false;
  const preset = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    value: deps.shapePresets.cloneShapePresetValue(pending.value),
    ...(pending.key === "sweepProfile" ? {} : {
      secondaryValue: deps.shapePresets.cloneShapePresetValue(pending.secondaryValue),
      asymmetric: pending.asymmetric
    })
  };
  deps.projectState.state.customShapePresets[pending.key].push(preset);
  deps.shapePresets.saveCustomShapePresets();
  populateShapePresetSelects();
  pending.select.value = `custom:${preset.id}`;
  syncShapePresetRemoveButtons();
  deps.projectState.state.pendingShapePresetSave = null;
  deps.creationPresetDialog.close();
  return true;
}

function openRemoveShapePreset(select) {
  if (!select.value.startsWith("custom:")) return;
  const key = select.dataset.shapePreset;
  const id = select.value.replace(/^custom:/, "");
  const preset = deps.projectState.state.customShapePresets[key].find((item) => item.id === id);
  if (!preset) return;
  deps.projectState.state.pendingShapePresetRemoval = { key, id };
  deps.projectState.state.pendingCreationPresetRemoval = null;
  deps.removeCreationPresetDialogTitle.textContent = `Remove ${deps.shapePresets.shapePresetLabel(key)} Preset`;
  deps.removeCreationPresetMessage.textContent = `Remove "${preset.name}"? This only removes it from this browser.`;
  deps.removeCreationPresetDialog.showModal();
}

function commitRemoveShapePreset() {
  if (!deps.projectState.state.pendingShapePresetRemoval) return false;
  const { key, id } = deps.projectState.state.pendingShapePresetRemoval;
  deps.projectState.state.customShapePresets = removeShapePreset(deps.projectState.state.customShapePresets, key, id);
  deps.shapePresets.saveCustomShapePresets();
  populateShapePresetSelects();
  deps.projectState.state.pendingShapePresetRemoval = null;
  deps.removeCreationPresetDialog.close();
  return true;
}

async function applyPresetSelection(presetName) {
  const projectUrl = deps.authoredPresetProjects.get(presetName);
  if (!projectUrl) {
    throw new Error(`Unknown authored preset: ${presetName}`);
  }
  const response = await fetch(projectUrl, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Could not load preset project (${response.status})`);
  const project = await response.json();
  if (project?.format !== "anime-hair-studio-project" || Number(project.version) !== 1) {
    throw new Error("Unsupported Anime Hair Studio preset format");
  }
  if (!project.state || !Array.isArray(project.state.locks) || !Array.isArray(project.state.guides)) {
    throw new Error("Preset scene data is incomplete");
  }
  const attachmentVersion = Number(project.state.scalpAttachmentVersion || 1);
  const needsLegacyRootRemap = attachmentVersion < 2;
  const catalogPreset = deps.presetCatalog.find((preset) => preset.id === presetName);
  const presetState = catalogPreset?.omitAuthoringAids
    ? { ...project.state, referenceImages: [], guides: [] }
    : project.state;
  deps.restoreState(presetState, {
    preservePlacement: true,
    deferRootAttachments: needsLegacyRootRemap
  });
  if (needsLegacyRootRemap) {
    deps.scalpBuilder.remapLegacyPresetToActiveScalp();
  }
  deps.projectState.state.currentProjectName = catalogPreset?.title || project.metadata?.name || deps.projectState.state.currentProjectName;
  deps.undoHistory.clear(); deps.redoHistory.clear(); deps.updateHistoryButtons(); // preset load is a fresh undo base
}

function renderPresetLibrary() {
  const catalog = deps.projectState.state.activePresetFilter === "custom" ? [] : deps.presetCatalog.filter((preset) => preset.category === deps.projectState.state.activePresetFilter);
  document.querySelector("#fullPresetCount").textContent = deps.presetCatalog.filter((preset) => preset.category === "full").length;
  document.querySelector("#elementPresetCount").textContent = deps.presetCatalog.filter((preset) => preset.category === "elements").length;
  document.querySelector("#customPresetCount").textContent = "0";
  deps.presetFilterButtons.forEach((button) => {
    const active = button.dataset.presetFilter === deps.projectState.state.activePresetFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const headings = { full: "Full Hair Presets", elements: "Hair Elements", custom: "Custom Presets" };
  deps.presetLibraryStatus.textContent = headings[deps.projectState.state.activePresetFilter];
  deps.presetLibraryGrid.replaceChildren();
  if (!catalog.length) {
    const empty = document.createElement("div");
    empty.className = "preset-library-empty";
    empty.textContent = "No custom presets yet.";
    deps.presetLibraryGrid.append(empty);
    return;
  }
  catalog.forEach((preset) => {
    const button = document.createElement("button");
    button.className = "preset-card";
    button.type = "button";
    button.setAttribute("aria-label", `Add ${preset.title} preset`);
    const preview = document.createElement("img");
    preview.setAttribute("aria-hidden", "true");
    preview.className = "preset-card-image";
    preview.src = preset.previewImage;
    preview.alt = "";
    const previewShell = document.createElement("span");
    previewShell.className = "preset-card-preview";
    previewShell.append(preview);
    const label = document.createElement("span");
    label.className = "preset-card-label";
    const title = document.createElement("span");
    title.textContent = preset.title;
    const category = document.createElement("small");
    category.textContent = preset.category === "full" ? "Full Hair" : preset.category === "custom" ? "Custom" : "Element";
    label.append(title, category);
    button.append(previewShell, label);
    button.addEventListener("click", async () => {
      button.disabled = true;
      deps.presetLibraryStatus.textContent = `Loading ${preset.title}`;
      try {
        await applyPresetSelection(preset.id);
        deps.presetLibraryStatus.textContent = `${preset.title} added`;
        if (deps.authoredPresetProjects.has(preset.id)) setPresetLibraryOpen(false);
      } catch (error) {
        console.error(error);
        deps.presetLibraryStatus.textContent = `Could not load ${preset.title}`;
      } finally {
        button.disabled = false;
      }
    });
    deps.presetLibraryGrid.append(button);
  });
}

function setPresetLibraryOpen(open) {
  deps.presetLibrary.classList.toggle("hidden", !open);
  deps.presetLibraryToggle.classList.toggle("active", open);
  deps.presetLibraryToggle.setAttribute("aria-pressed", String(open));
  deps.presetLibraryToggle.setAttribute("aria-label", open ? "Close preset library" : "Open preset library");
  deps.presetLibraryToggle.title = open ? "Close preset library" : "Open preset library";
  if (open) {
    renderPresetLibrary();
    document.querySelector("#closePresetLibrary").focus();
  }
  deps.updateViewportStatsVisibility();
}

function createLongLayeredCurlPoints(sample, {
  length = 3.2,
  shell = 0.32,
  lateral = 0,
  wave = 0,
  tipOut = 0,
  tipCurl = 0,
  tipLift = 0,
  startAngle = 0,
  flowX = null,
  flowZ = null,
  layerOffset = 0,
  surfaceClearance = 0.12,
  rootScalpOffset = 0.12,
  fallPower = 1,
  count = 10
} = {}) {
  const root = sample.point.clone().addScaledVector(sample.normal, deps.scalpBuilder.rootScalpOffsetDistance(rootScalpOffset));
  const surfaceCenter = deps.scalpSurfaceGroup.getWorldPosition(new THREE.Vector3());
  const naturalOutward = root.clone().sub(surfaceCenter).setY(0);
  if (naturalOutward.lengthSq() < 0.001) naturalOutward.copy(sample.normal).setY(0);
  if (naturalOutward.lengthSq() < 0.001) naturalOutward.set(0, 0, 1);
  naturalOutward.normalize();
  const outward = naturalOutward.clone();
  if (Number.isFinite(flowX) && Number.isFinite(flowZ)) outward.set(flowX, 0, flowZ).normalize();
  outward.applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle);
  const across = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), outward).normalize();
  const down = new THREE.Vector3(0, -1, 0);
  const points = [];

  for (let index = 0; index < count; index += 1) {
    const t = index / Math.max(1, count - 1);
    const bodyT = Math.sin(Math.PI * Math.min(1, t * 0.92));
    const tipT = THREE.MathUtils.smoothstep(t, 0.68, 1);
    const flowT = THREE.MathUtils.smoothstep(t, 0.12, 0.56);
    const shellDirection = naturalOutward.clone().lerp(outward, flowT).normalize();
    const layerT = THREE.MathUtils.smoothstep(t, 0.02, 0.2) * (1 - THREE.MathUtils.smoothstep(t, 0.72, 1));
    const point = root.clone()
      .addScaledVector(down, length * Math.pow(t, fallPower))
      .addScaledVector(shellDirection, shell * bodyT + tipOut * tipT * tipT)
      .addScaledVector(sample.normal, layerOffset * layerT)
      .addScaledVector(across, lateral * t + wave * Math.sin(Math.PI * t) + tipCurl * tipT * tipT)
      .addScaledVector(new THREE.Vector3(0, 1, 0), tipLift * tipT * tipT);
    const clearance = surfaceClearance + (1 - Math.min(1, t / 0.62)) * 0.055;
    points.push(index === 0 ? point : deps.pushPointOutsideHead(point, sample.normal, clearance));
  }
  return points;
}

function createBraidedBobShellPoints(sample, {
  length = 1.55,
  shell = 0.34,
  flowX = null,
  flowZ = null,
  sweep = 0,
  tipOut = 0.05,
  tipLift = 0,
  rootScalpOffset = 0.2,
  surfaceClearance = 0.1,
  count = 8
} = {}) {
  const root = sample.point.clone().addScaledVector(sample.normal, deps.scalpBuilder.rootScalpOffsetDistance(rootScalpOffset));
  const surfaceCenter = deps.scalpSurfaceGroup.getWorldPosition(new THREE.Vector3());
  const naturalOutward = root.clone().sub(surfaceCenter).setY(0);
  if (naturalOutward.lengthSq() < 0.001) naturalOutward.copy(sample.normal).setY(0);
  if (naturalOutward.lengthSq() < 0.001) naturalOutward.set(0, 0, 1);
  naturalOutward.normalize();
  const flow = naturalOutward.clone();
  if (Number.isFinite(flowX) && Number.isFinite(flowZ)) flow.set(flowX, 0, flowZ).normalize();
  const across = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), flow).normalize();
  const points = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / Math.max(1, count - 1);
    const settle = THREE.MathUtils.smoothstep(t, 0.05, 0.42);
    const tipT = THREE.MathUtils.smoothstep(t, 0.72, 1);
    const point = root.clone()
      .addScaledVector(new THREE.Vector3(0, -1, 0), length * Math.pow(t, 1.08))
      .addScaledVector(flow, shell * Math.sin(t * Math.PI * 0.5) + tipOut * tipT * tipT)
      .addScaledVector(across, sweep * Math.sin(Math.PI * t) * settle)
      .addScaledVector(new THREE.Vector3(0, 1, 0), tipLift * tipT * tipT);
    points.push(index === 0 ? point : deps.pushPointOutsideHead(point, sample.normal, surfaceClearance + 0.025 * (1 - t)));
  }
  return points;
}

function createBowlCutPoints(sample, {
  length,
  spread,
  curl = 0,
  startAngle = 0,
  tipCurl = 0,
  tipOut = 0,
  tipLift = 0,
  layerOffset = 0,
  rootScalpOffset = 0,
  fallPower = 1.1,
  count = 6
}) {
  const root = sample.point.clone().addScaledVector(sample.normal, deps.scalpBuilder.rootScalpOffsetDistance(rootScalpOffset));
  const surfaceCenter = deps.scalpSurfaceGroup.getWorldPosition(new THREE.Vector3());
  const outward = root.clone().sub(surfaceCenter).setY(0);
  if (outward.lengthSq() < 0.001) outward.copy(sample.normal).setY(0);
  if (outward.lengthSq() < 0.001) outward.set(0, 0, 1);
  outward.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle);
  const around = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), outward).normalize();
  const points = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / Math.max(1, count - 1);
    const tipT = THREE.MathUtils.smoothstep(t, 0.62, 1);
    const layerT = THREE.MathUtils.smoothstep(t, 0.02, 0.32);
    const point = root.clone()
      .addScaledVector(outward, layerOffset * layerT)
      .addScaledVector(outward, spread * Math.sin(t * Math.PI * 0.5))
      .addScaledVector(around, curl * Math.sin(t * Math.PI))
      .addScaledVector(around, tipCurl * t * t)
      .addScaledVector(outward, tipOut * tipT * tipT)
      .addScaledVector(new THREE.Vector3(0, 1, 0), tipLift * tipT * tipT)
      .addScaledVector(new THREE.Vector3(0, -1, 0), length * Math.pow(t, fallPower));
    points.push(index === 0 ? point : deps.pushPointOutsideHead(point, sample.normal, 0.05 + t * 0.04));
  }
  return points;
}

function normalizeBraidDimensions(target) {
  if (!target || (target !== deps.braidCreationDefaults && target.geometryType !== "braid")) return target;
  target.braidWidth = Number(target.braidWidth ?? target.width ?? 0.34) * Number(target.widthScale ?? 1);
  target.braidDepth = Number(target.braidDepth ?? 0.44) * Number(target.depthScale ?? 1);
  target.widthScale = 1;
  target.depthScale = 1;
  if (target.geometryType === "braid") {
    target.width = target.braidWidth;
    target.baseWidth = target.braidWidth;
  }
  return target;
}

function applyPresetControl(input, value) {
  if (value === undefined || value === null) return;
  if (input.dataset.booleanControl === "true") {
    deps.setDrawSurfaceDynamicEnabled(Boolean(value));
  } else if (input.type === "checkbox") {
    input.checked = Boolean(value);
  } else if (input.tagName === "SELECT") {
    const optionExists = [...input.options].some((option) => option.value === String(value));
    if (!optionExists) return;
    input.value = String(value);
  } else {
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    const minimum = input.min === "" ? -Infinity : Number(input.min);
    const maximum = input.max === "" ? Infinity : Number(input.max);
    input.value = String(THREE.MathUtils.clamp(number, minimum, maximum));
  }
  const changeControl = input.dataset.booleanControl === "true" || input.type === "checkbox" || input.tagName === "SELECT";
  input.dispatchEvent(new Event(changeControl ? "change" : "input", { bubbles: true }));
}

function applyCreationToolSettings(type, settings, options = {}) {
  if (!settings) return;
  const normalizedSurface = deps.normalizedLiveSurfaceSelection(settings.surface);
  const effectiveSettings = {
    ...settings,
    surface: normalizedSurface.surface,
    dynamicSurface: settings.dynamicSurface ?? normalizedSurface.dynamic ?? deps.drawSurfaceDynamicEnabled()
  };
  const preservedBrushPreset = type === "strand" && options.preserveBrushPresetSelection
    ? deps.drawBrushPresetInput.value
    : null;
  const controls = type === "braid"
    ? {
      toolSize: deps.braidToolSizeInput,
      smoothing: deps.braidSmoothingInput,
      curveStep: deps.braidCurveStepInput,
      scalpOffset: deps.braidScalpOffsetInput,
      surface: deps.drawStrandSurfaceInput,
      dynamicSurface: deps.drawSurfaceDynamicButton,
      autoShowScalp: deps.braidAutoShowScalpInput,
      continueFromTip: deps.braidContinueFromTipInput
    }
    : {
      brushPreset: deps.drawBrushPresetInput,
      toolSize: deps.drawToolSizeInput,
      smoothing: deps.drawStrandSmoothingInput,
      curveStep: deps.drawStrandCurveStepInput,
      scalpOffset: deps.drawStrandScalpOffsetInput,
      surfaceNormalInfluence: deps.drawSurfaceNormalInfluenceInput,
      surface: deps.drawStrandSurfaceInput,
      dynamicSurface: deps.drawSurfaceDynamicButton,
      autoShowScalp: deps.drawAutoShowScalpInput,
      continueFromTip: deps.drawContinueFromTipInput
    };
  Object.entries(controls).forEach(([key, input]) => applyPresetControl(input, effectiveSettings[key]));
  if (preservedBrushPreset) deps.drawBrushPresetInput.value = preservedBrushPreset;
}

function populateCreationPresetSelect(select, type, selectedValue = select.value) {
  const builtIns = [{ value: "classic", label: "Classic Braid" }, { value: "chain-links", label: "Chain Links" }];
  select.replaceChildren();
  builtIns.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
  if (deps.projectState.state.customCreationPresets[type].length) {
    const group = document.createElement("optgroup");
    group.label = "Custom Presets";
    deps.projectState.state.customCreationPresets[type].forEach((preset) => {
      const option = document.createElement("option");
      option.value = `custom:${preset.id}`;
      option.textContent = preset.name;
      group.append(option);
    });
    select.append(group);
  }
  if ([...select.options].some((option) => option.value === selectedValue)) select.value = selectedValue;
  syncCreationPresetRemoveButtons();
}

function populateDrawBrushPresetSelect(selectedValue = deps.drawBrushPresetInput.value) {
  const builtIns = [
    { value: "standard", label: "Standard" },
    { value: "clump", label: "3 Strand Clump" },
    { value: "ponytail-clump", label: "Ponytail Clump" },
    { value: "coil", label: "Coil" }
  ];
  deps.drawBrushPresetInput.replaceChildren();
  builtIns.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    deps.drawBrushPresetInput.append(option);
  });
  if (deps.projectState.state.customCreationPresets.strand.length) {
    const group = document.createElement("optgroup");
    group.label = "Custom Presets";
    deps.projectState.state.customCreationPresets.strand.forEach((preset) => {
      const option = document.createElement("option");
      option.value = `custom:${preset.id}`;
      option.textContent = preset.name;
      group.append(option);
    });
    deps.drawBrushPresetInput.append(group);
  }
  if ([...deps.drawBrushPresetInput.options].some((option) => option.value === selectedValue)) {
    deps.drawBrushPresetInput.value = selectedValue;
  } else {
    deps.drawBrushPresetInput.value = deps.hairState.drawStrandMode;
  }
  syncCreationPresetRemoveButtons();
}

function syncCreationPresetRemoveButtons() {
  deps.removeStrandToolPresetButton.disabled = !deps.drawBrushPresetInput.value.startsWith("custom:");
  deps.removeBraidToolPresetButton.disabled = !deps.braidToolPresetInput.value.startsWith("custom:");
}

function createCustomCreationPreset(type) {
  deps.projectState.state.pendingShapePresetSave = null;
  deps.projectState.state.pendingCreationPresetType = type;
  deps.guideState.pendingClumpPresetGuideId = null;
  const label = type === "braid" ? "Braid" : "Brush";
  deps.creationPresetDialogTitle.textContent = `Create ${label} Preset`;
  deps.creationPresetDescription.textContent = "Save the current brush, curve, and profile settings in this browser.";
  deps.creationPresetNameInput.value = `New ${label} Preset`;
  deps.creationPresetDialog.showModal();
  requestAnimationFrame(() => {
    deps.creationPresetNameInput.focus();
    deps.creationPresetNameInput.select();
  });
}

function createCustomClumpPreset(guide) {
  if (!guide?.clumpGuide || !guide.clumpId) return;
  deps.projectState.state.pendingShapePresetSave = null;
  deps.projectState.state.pendingCreationPresetType = "clump";
  deps.guideState.pendingClumpPresetGuideId = guide.id;
  deps.creationPresetDialogTitle.textContent = "Create Brush Preset";
  deps.creationPresetDescription.textContent = "Save this clump as a reusable Draw Strand brush in this browser.";
  deps.creationPresetNameInput.value = `${guide.clumpName || "Clump"} Brush`;
  deps.creationPresetDialog.showModal();
  requestAnimationFrame(() => {
    deps.creationPresetNameInput.focus();
    deps.creationPresetNameInput.select();
  });
}

function commitCustomCreationPreset() {
  if (commitCustomShapePreset()) return;
  const type = deps.projectState.state.pendingCreationPresetType;
  const name = deps.creationPresetNameInput.value.trim();
  if (!type || !name) return;
  if (type === "clump") {
    const guide = deps.locks.find((lock) => lock.id === deps.guideState.pendingClumpPresetGuideId);
    if (!guide?.clumpGuide || !guide.clumpId) return;
    const state = deps.snapshotState();
    const clumpLocks = state.locks.filter((lock) => lock.clumpId === guide.clumpId);
    const guideSnapshot = clumpLocks.find((lock) => lock.clumpGuide);
    const clumpTemplate = createClumpBrushTemplate(clumpLocks, guideSnapshot?.id);
    if (!guideSnapshot || !clumpTemplate) return;
    const preset = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      value: {
        ...deps.creationPresets.creationPresetSnapshot(guideSnapshot, "strand"),
        clumpTemplate
      },
      toolSettings: {
        ...deps.creationPresets.creationToolSettingsSnapshot("strand"),
        brushPreset: "clump"
      }
    };
    deps.projectState.state.customCreationPresets.strand.push(preset);
    deps.creationPresets.saveCustomCreationPresets();
    deps.drawState.activeCustomDrawClumpTemplate = clumpTemplate;
    deps.hairState.drawStrandMode = "clump";
    populateDrawBrushPresetSelect(`custom:${preset.id}`);
    deps.projectState.state.pendingCreationPresetType = null;
    deps.guideState.pendingClumpPresetGuideId = null;
    deps.creationPresetDialog.close();
    return;
  }
  const selected = deps.getSelectedLock();
  const source = type === "braid"
    ? (selected?.geometryType === "braid" ? selected : deps.braidCreationDefaults)
    : (selected?.geometryType === "strand" ? selected : deps.strandCreationDefaults);
  const preset = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    value: {
      ...deps.creationPresets.creationPresetSnapshot(source, type),
      ...(type === "strand" && deps.drawState.activeCustomDrawClumpTemplate
        ? { clumpTemplate: normalizeClumpBrushTemplate(deps.drawState.activeCustomDrawClumpTemplate) }
        : {})
    },
    toolSettings: deps.creationPresets.creationToolSettingsSnapshot(type)
  };
  deps.projectState.state.customCreationPresets[type].push(preset);
  deps.creationPresets.saveCustomCreationPresets();
  if (type === "braid") {
    populateCreationPresetSelect(deps.braidToolPresetInput, type, `custom:${preset.id}`);
  } else {
    populateDrawBrushPresetSelect(`custom:${preset.id}`);
  }
  deps.projectState.state.pendingCreationPresetType = null;
  deps.creationPresetDialog.close();
}

function openRemoveCreationPreset(type) {
  const select = type === "braid" ? deps.braidToolPresetInput : deps.drawBrushPresetInput;
  if (!select.value.startsWith("custom:")) return;
  const id = select.value.replace(/^custom:/, "");
  const preset = deps.projectState.state.customCreationPresets[type].find((item) => item.id === id);
  if (!preset) return;
  deps.projectState.state.pendingShapePresetRemoval = null;
  deps.projectState.state.pendingCreationPresetRemoval = { type, id };
  deps.removeCreationPresetDialogTitle.textContent = `Remove ${type === "braid" ? "Braid" : "Brush"} Preset`;
  deps.removeCreationPresetMessage.textContent = `Remove "${preset.name}"? This only removes it from this browser.`;
  deps.removeCreationPresetDialog.showModal();
}

function commitRemoveCreationPreset() {
  if (commitRemoveShapePreset()) return;
  if (!deps.projectState.state.pendingCreationPresetRemoval) return;
  const { type, id } = deps.projectState.state.pendingCreationPresetRemoval;
  deps.projectState.state.customCreationPresets = removeToolPreset(deps.projectState.state.customCreationPresets, type, id);
  deps.creationPresets.saveCustomCreationPresets();
  if (type === "braid") {
    const fallback = deps.braidCreationDefaults.braidMeshPreset === "chain-links" ? "chain-links" : "classic";
    populateCreationPresetSelect(deps.braidToolPresetInput, "braid", fallback);
  } else {
    deps.drawState.activeCustomDrawClumpTemplate = null;
    populateDrawBrushPresetSelect(deps.hairState.drawStrandMode);
  }
  deps.projectState.state.pendingCreationPresetRemoval = null;
  deps.removeCreationPresetDialog.close();
}

function applyBraidToolPreset(presetId) {
  const preset = deps.BRAID_TOOL_PRESETS[presetId];
  if (!preset) return;
  deps.braidCreationDefaults.braidMeshPreset = preset.braidMeshPreset;
  deps.braidCreationDefaults.braidWidth = preset.braidWidth;
  deps.braidCreationDefaults.braidDepth = preset.braidDepth;
  deps.braidCreationDefaults.braidSegmentLength = preset.braidSegmentLength;
  deps.braidCreationDefaults.braidRotation = preset.braidRotation;
  deps.braidCreationDefaults.widthScale = 1;
  deps.braidCreationDefaults.depthScale = 1;
  deps.braidCreationDefaults.profileOffset = 0;
  deps.braidCreationDefaults.taperCurve = preset.taperCurve.map((point) => ({ ...point }));
  deps.braidCreationDefaults.depthCurve = preset.depthCurve.map((point) => ({ ...point }));
  deps.braidCreationDefaults.taperCurveSecondary = preset.taperCurve.map((point) => ({ ...point }));
  deps.braidCreationDefaults.depthCurveSecondary = preset.depthCurve.map((point) => ({ ...point }));
  deps.braidCreationDefaults.asymmetricWidthCurve = false;
  deps.braidCreationDefaults.asymmetricDepthCurve = false;
  deps.braidCreationDefaults.centerAsymmetricProfile = false;
  deps.braidCreationDefaults.sweepProfile = preset.sweepProfile.map((point) => ({ ...point }));
  applyCreationToolSettings("braid", deps.creationPresets.creationToolSettingsSnapshot("braid"));

  if (deps.sculptState.drawStrandStroke?.outputType === "braid") {
    const toolScale = Number(deps.braidToolSizeInput.value);
    deps.sculptState.drawStrandStroke.braidMeshPreset = preset.braidMeshPreset;
    deps.sculptState.drawStrandStroke.braidWidth = preset.braidWidth * toolScale;
    deps.sculptState.drawStrandStroke.brushSize = deps.sculptState.drawStrandStroke.braidWidth;
    deps.sculptState.drawStrandStroke.braidDepth = preset.braidDepth * toolScale;
    deps.sculptState.drawStrandStroke.braidSegmentLength = preset.braidSegmentLength * toolScale;
    deps.sculptState.drawStrandStroke.braidRotation = preset.braidRotation;
    deps.updateDrawStrandPreview();
  }

  if (!deps.getSelectedLock()) deps.syncCreationShapeInputs();
  deps.updatePlacementStatus();
}
  function setupShapePresetUi() {
    deps.shapePresets.loadCustomShapePresets();
    setupShapePresetControls();
    populateShapePresetSelects();
    deps.shapePresetSelects.forEach((select) => select.addEventListener("change", () => deps.shapePresets.applyShapePreset(select)));
  }

  function setupCreationPresetUi() {
    deps.creationPresets.loadCustomCreationPresets();
    deps.creationPresets.migrateLegacyClumpPresets();
    populateDrawBrushPresetSelect("standard");
    populateCreationPresetSelect(deps.braidToolPresetInput, "braid", "classic");

    deps.drawBrushPresetInput.addEventListener("change", () => {
      if (deps.drawBrushPresetInput.value.startsWith("custom:")) {
        deps.creationPresets.applyCustomCreationPreset("strand", deps.drawBrushPresetInput.value);
      } else {
        deps.setDrawStrandMode(deps.drawBrushPresetInput.value);
      }
      deps.setDrawStrandBrushCursorScale(deps.activeStrokeBrushSize());
      syncCreationPresetRemoveButtons();
    });

    deps.braidToolPresetInput.addEventListener("change", () => {
      deps.pushUndoState();
      if (deps.braidToolPresetInput.value.startsWith("custom:")) {
        deps.creationPresets.applyCustomCreationPreset("braid", deps.braidToolPresetInput.value);
      } else {
        applyBraidToolPreset(deps.braidToolPresetInput.value);
      }
      syncCreationPresetRemoveButtons();
    });

    deps.saveStrandToolPresetButton.addEventListener("click", () => createCustomCreationPreset("strand"));
    deps.saveBraidToolPresetButton.addEventListener("click", () => createCustomCreationPreset("braid"));
    deps.removeStrandToolPresetButton.addEventListener("click", () => openRemoveCreationPreset("strand"));
    deps.removeBraidToolPresetButton.addEventListener("click", () => openRemoveCreationPreset("braid"));
    deps.creationPresetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      commitCustomCreationPreset();
    });
    [deps.closeCreationPresetDialogButton, deps.cancelCreationPresetButton].forEach((button) => {
      button.addEventListener("click", () => deps.creationPresetDialog.close());
    });
    deps.creationPresetDialog.addEventListener("close", () => {
      deps.projectState.state.pendingCreationPresetType = null;
      deps.guideState.pendingClumpPresetGuideId = null;
      deps.projectState.state.pendingShapePresetSave = null;
    });
    deps.cancelRemoveCreationPresetButton.addEventListener("click", () => deps.removeCreationPresetDialog.close());
    deps.confirmRemoveCreationPresetButton.addEventListener("click", commitRemoveCreationPreset);
    deps.removeCreationPresetDialog.addEventListener("close", () => {
      deps.projectState.state.pendingCreationPresetRemoval = null;
      deps.projectState.state.pendingShapePresetRemoval = null;
    });
  }

  function setupPresetLibraryEvents() {
    deps.presetLibraryToggle.addEventListener("click", () => setPresetLibraryOpen(deps.presetLibrary.classList.contains("hidden")));
    document.querySelector("#closePresetLibrary").addEventListener("click", () => setPresetLibraryOpen(false));
    deps.presetFilterButtons.forEach((button) => button.addEventListener("click", () => {
      deps.projectState.state.activePresetFilter = button.dataset.presetFilter;
      renderPresetLibrary();
    }));
  }
  return {
    loadBraidMeshPreset,
    setupShapePresetUi,
    setupCreationPresetUi,
    setupPresetLibraryEvents,
    populateShapePresetSelects,
    populateDrawBrushPresetSelect,
    populateCreationPresetSelect,
    setPresetLibraryOpen,
    normalizeBraidDimensions,
    syncShapePresetSelects,
    applyCreationToolSettings,
    createCustomClumpPreset,
    commitCustomCreationPreset,
    commitCustomShapePreset,
    commitRemoveShapePreset,
    commitRemoveCreationPreset,
    renderPresetLibrary,
    applyPresetSelection,
    applyBraidToolPreset
  };
}