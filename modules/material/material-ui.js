// material-ui.js - hair material rendering/editor helpers + lock material application
// (refactor batch A6). Extracted from app.js; all app.js coupling injected via
// createMaterialUiApi(deps).
import * as THREE from "three";
import {
  ANIME_ANISOTROPIC_FRAGMENT_SHADER,
  ANIME_ANISOTROPIC_NUMERIC_FIELDS,
  ANIME_ANISOTROPIC_SHADER,
  ANIME_ANISOTROPIC_VERTEX_SHADER,
  LAMBERT_SHADER,
  normalizeHairShader,
  STANDARD_ANISOTROPIC_SHADER
} from "../geometry/anime-hair-shaders.js";
import {
  hairMaterialPresetValue,
  hairMaterialUsageCounts,
  MAX_HAIR_GRADIENT_STOPS,
  normalizeHairMaterialDefinition,
  normalizeHairGradientStops,
  normalizeHairMaterialPresetLibrary,
  removeHairMaterialPreset,
  resolveHairMaterialDefinition
} from "./material-state.js";
import {
  DEFAULT_HAIR_MATERIAL_ID,
  HAIR_LAYERS,
  LAYER_HUE_SHIFTS,
  MATERIAL_LAYER_COLOR_FACTORS,
  SCALP_REGIONS
} from "../core/app-config.js";

const HAIR_MATERIAL_PRESET_STORAGE_KEY = "anime-hair-studio-material-presets-v1";

export function createMaterialUiApi(deps) {
  // deps: shared hairMaterialDefinitions array + animeAnisotropicLightDirection +
  // STRAND_SELECTION_OUTLINE_COLOR (kept in app.js; injected here so the module stays one-way),
  // store .state proxies (hairState/sel/sculptState; use deps.X.y, never deps.X.state.y),
  // app.js spine helpers (pushUndoState/getSelectedLock/editSelectedLocks/renderLockList/
  //   syncActiveMirror/updateStrandSelectionHighlight/updateStrandSelectionHighlightForLock/
  //   ensureUvCheckerForLock/strandViewportBaseColor/normalizeHairLayer/drawFlowApi),
  // material UI DOM element refs (hairMaterialSelect/hairMaterialOutliner/deleteProjectHairMaterialButton/
  //   hairMaterialNameInput/hairMaterialShaderInput/hairMaterialColorInput/hairMaterialRoughnessInput/
  //   hairMaterialRoughnessValue/hairMaterialStandardControls/hairMaterialRoughnessControl/
  //   hairMaterialAnimeControls/hairMaterialAnimeColorInputs/hairMaterialAnimeNumericControls).
  // Batch-fill point in app.js: after the renderLockList definition (last deps); UI listener
  // registrations + boot-time syncHairMaterialEditor() run after the batch.
  // Base Color Gradient + Material Preset state (material-ui internal). The custom preset
  // library array is stored on deps.projectState.state.customHairMaterialPresets so the
  // preferences backup export/import flows can read/write it.
  let activeHairMaterialPresetId = "";
  let pendingHairMaterialPresetSave = null;
  let pendingHairMaterialPresetRemoval = null;
  let activeHairGradientStopIndex = 0;
  let hairGradientStopDrag = null;
  let gradientInputUndoCaptured = false;
  const hairGradientTextures = new Map();

  function hairMaterialPresetLibrary() {
    if (!Array.isArray(deps.projectState?.state?.customHairMaterialPresets)) {
      deps.projectState.state.customHairMaterialPresets = [];
    }
    return deps.projectState.state.customHairMaterialPresets;
  }

function hairMaterialDefinition(materialId) {
  return resolveHairMaterialDefinition(deps.hairMaterialDefinitions, materialId);
}

function materialForLock(lock) {
  return hairMaterialDefinition(lock.materialId || DEFAULT_HAIR_MATERIAL_ID);
}

function activeHairMaterialDefinition() {
  const definition = hairMaterialDefinition(deps.hairState.activeHairMaterialId);
  deps.hairState.activeHairMaterialId = definition.id;
  return definition;
}

function strandDisplayColor(lock) {
  const layer = HAIR_LAYERS.find((item) => item.id === deps.normalizeHairLayer(lock.hairLayer)) || HAIR_LAYERS[1];
  const region = SCALP_REGIONS[lock.scalpRegion || "unassigned"] || SCALP_REGIONS.unassigned;
  const definition = materialForLock(lock);
  const materialColor = definition.shader === ANIME_ANISOTROPIC_SHADER
    ? definition.animeBaseColor
    : definition.color;
  const color = new THREE.Color(deps.hairState.showGroupColors ? region.color : materialColor);
  const adjustedFactor = deps.hairState.showGroupColors
    ? layer.colorFactor
    : deps.sel.layerColorShiftsEnabled ? Number(MATERIAL_LAYER_COLOR_FACTORS[layer.id] ?? 1) : 1;
  if (deps.hairState.showGroupColors || deps.sel.layerColorShiftsEnabled) {
    color.offsetHSL(Number(LAYER_HUE_SHIFTS[layer.id] ?? 0), 0, 0);
  }
  color.multiplyScalar(adjustedFactor);
  return `#${color.getHexString()}`;
}

function strandGradientTintColor(lock) {
  const white = new THREE.Color(0xffffff);
  if (lock.locked) return `#${white.lerp(new THREE.Color(0x747780), 0.18).getHexString()}`;
  if (deps.sculptBrushSelectionMaskActive() && !deps.sculptBrushSelectionAllows(lock)) return 0x474747;
  if (deps.proportionalStrandVisualsActive(lock)) return 0xffffff;
  const selectedLock = deps.getSelectedLock();
  const selectedClumpId = deps.sel.clumpViewportSelection ? selectedLock?.clumpId : null;
  if (selectedClumpId && lock.clumpId === selectedClumpId) {
    return `#${white.lerp(new THREE.Color(lock.id === deps.sel.selectedId ? 0x76d4d9 : 0x5bbec4), 0.18).getHexString()}`;
  }
  if (lock.id === deps.sel.selectedId) return `#${white.lerp(new THREE.Color(deps.STRAND_SELECTION_OUTLINE_COLOR), 0.12).getHexString()}`;
  if (deps.sel.selectedStrandIds.has(lock.id)) return `#${white.lerp(new THREE.Color(deps.STRAND_SELECTION_OUTLINE_COLOR), 0.08).getHexString()}`;
  if (deps.strandMirrorPartnerHighlighted(lock)) return `#${white.lerp(new THREE.Color(0x5ef2ff), 0.12).getHexString()}`;
  return 0xffffff;
}

function hairGradientCss(stops) {
  return `linear-gradient(90deg, ${normalizeHairGradientStops(stops)
    .map((stop) => `${stop.color} ${Math.round(stop.position * 100)}%`)
    .join(", ")})`;
}

function sampleHairGradientColor(stops, position, target = new THREE.Color()) {
  const normalized = normalizeHairGradientStops(stops);
  const t = THREE.MathUtils.clamp(Number(position) || 0, 0, 1);
  let right = normalized.findIndex((stop) => stop.position >= t);
  if (right <= 0) return target.set(normalized[Math.max(0, right)]?.color || normalized[0].color);
  if (right < 0) return target.set(normalized.at(-1).color);
  const left = normalized[right - 1];
  const next = normalized[right];
  const span = Math.max(0.000001, next.position - left.position);
  return target.set(left.color).lerp(new THREE.Color(next.color), (t - left.position) / span);
}

function syncHairGradientTexture(definition) {
  let texture = hairGradientTextures.get(definition.id);
  if (!texture) {
    texture = new THREE.DataTexture(new Uint8Array(256 * 4), 1, 256, THREE.RGBAFormat);
    texture.name = `HairBaseGradient:${definition.id}`;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    hairGradientTextures.set(definition.id, texture);
  }
  const data = texture.image.data;
  const color = new THREE.Color();
  for (let index = 0; index < 256; index += 1) {
    sampleHairGradientColor(definition.baseColorGradientStops, index / 255, color);
    const offset = index * 4;
    data[offset] = Math.round(THREE.MathUtils.clamp(color.r, 0, 1) * 255);
    data[offset + 1] = Math.round(THREE.MathUtils.clamp(color.g, 0, 1) * 255);
    data[offset + 2] = Math.round(THREE.MathUtils.clamp(color.b, 0, 1) * 255);
    data[offset + 3] = 255;
  }
  texture.needsUpdate = true;
  return texture;
}

function hairMaterialGradientActive(lock) {
  return Boolean(materialForLock(lock)?.baseColorGradientEnabled && !deps.hairState.showGroupColors);
}

function applyHairBaseGradient(material, lock) {
  const definition = materialForLock(lock);
  const enabled = hairMaterialGradientActive(lock);
  const texture = enabled ? syncHairGradientTexture(definition) : null;
  if (material.userData.hairShader === ANIME_ANISOTROPIC_SHADER) {
    material.uniforms.uBaseGradient.value = texture || material.uniforms.uBaseGradient.value;
    material.uniforms.uUseBaseGradient.value = enabled ? 1 : 0;
    return;
  }
  const hadMap = Boolean(material.map);
  material.map = texture;
  if (hadMap !== Boolean(texture)) material.needsUpdate = true;
}

function setAnimeHairBaseColor(material, color) {
  if (material.userData.hairShader === ANIME_ANISOTROPIC_SHADER) {
    const definition = material.userData.definition;
    material.uniforms.uBaseColor.value.set(color);
    material.uniforms.uShadowColor.value.set(definition.animeShadowColor);
    material.uniforms.uSoftShadowColor.value.set(definition.animeSoftShadowColor);
    material.uniforms.uHighlightColor.value.set(definition.animeHighlightColor);
    material.uniforms.uRimColor.value.set(definition.animeRimColor);
    return;
  }
  material.color.set(color);
}

function createAnimeAnisotropicMaterial(lock) {
  const definition = materialForLock(lock);
  const material = new THREE.ShaderMaterial({
    name: "HairAnimeAnisotropicMaterial",
    uniforms: {
      uBaseColor: { value: new THREE.Color(hairMaterialGradientActive(lock) ? strandGradientTintColor(lock) : strandDisplayColor(lock)) },
      uBaseGradient: { value: syncHairGradientTexture(definition) },
      uUseBaseGradient: { value: definition.baseColorGradientEnabled && !deps.hairState.showGroupColors ? 1 : 0 },
      uShadowColor: { value: new THREE.Color(definition.animeShadowColor) },
      uSoftShadowColor: { value: new THREE.Color(definition.animeSoftShadowColor) },
      uHighlightColor: { value: new THREE.Color(definition.animeHighlightColor) },
      uRimColor: { value: new THREE.Color(definition.animeRimColor) },
      uLightDirection: { value: deps.animeAnisotropicLightDirection },
      uShadowThreshold: { value: definition.animeShadowThreshold },
      uShadowSoftness: { value: definition.animeShadowSoftness },
      uSoftShadowStrength: { value: definition.animeSoftShadowStrength },
      uSoftShadowSpread: { value: definition.animeSoftShadowSpread },
      uRimStrength: { value: definition.animeRimStrength },
      uRimWidth: { value: definition.animeRimWidth },
      uHighlightStrength: { value: definition.animeHighlightStrength },
      uHighlightWidth: { value: definition.animeHighlightWidth },
      uAnisotropy: { value: definition.animeAnisotropy },
      uHighlightJaggedness: { value: definition.animeHighlightJaggedness },
      uHighlightNoiseScale: { value: definition.animeHighlightNoiseScale },
      uHighlightNoiseBlur: { value: definition.animeHighlightNoiseBlur },
      uHighlightTopFade: { value: definition.animeHighlightTopFade },
      uHighlightTopBlur: { value: definition.animeHighlightTopBlur },
      uHighlightEdgeSuppression: { value: definition.animeHighlightEdgeSuppression },
      uOpacity: { value: 1 }
    },
    vertexShader: ANIME_ANISOTROPIC_VERTEX_SHADER,
    fragmentShader: ANIME_ANISOTROPIC_FRAGMENT_SHADER,
    side: THREE.FrontSide,
    transparent: false,
    depthWrite: true,
    depthTest: true,
    extensions: { derivatives: true }
  });
  material.userData.hairShader = ANIME_ANISOTROPIC_SHADER;
  return material;
}

function createHairMaterial(lock) {
  const definition = materialForLock(lock);
  if (definition.shader === ANIME_ANISOTROPIC_SHADER) {
    const material = createAnimeAnisotropicMaterial(lock);
    material.userData.definition = definition;
    return material;
  }
  if (definition.shader === LAMBERT_SHADER) {
    const material = new THREE.MeshLambertMaterial({
      name: "HairLambertMaterial",
      color: hairMaterialGradientActive(lock) ? strandGradientTintColor(lock) : strandDisplayColor(lock),
      map: hairMaterialGradientActive(lock) ? syncHairGradientTexture(definition) : null,
      vertexColors: true,
      side: THREE.FrontSide,
      transparent: false,
      depthWrite: true,
      depthTest: true
    });
    material.userData.hairShader = LAMBERT_SHADER;
    material.userData.definition = definition;
    return material;
  }
  const material = new THREE.MeshPhysicalMaterial({
    name: "HairAnisotropicMaterial",
    color: hairMaterialGradientActive(lock) ? strandGradientTintColor(lock) : strandDisplayColor(lock),
    map: hairMaterialGradientActive(lock) ? syncHairGradientTexture(definition) : null,
    roughness: definition.roughness,
    metalness: 0,
    anisotropy: 1,
    anisotropyRotation: Math.PI / 2,
    vertexColors: true,
    side: THREE.FrontSide,
    transparent: false,
    depthWrite: true,
    depthTest: true
  });
  material.userData.hairShader = STANDARD_ANISOTROPIC_SHADER;
  material.userData.definition = definition;
  return material;
}


function createStrandSelectionOutline(geometry, options = {}) {
  const material = new THREE.ShaderMaterial({
    name: "StrandSelectionOutlineMaterial",
    uniforms: {
      uColor: { value: new THREE.Color(options.color ?? deps.STRAND_SELECTION_OUTLINE_COLOR) },
      uOutlineWidth: { value: options.width ?? 0.007 }
    },
    vertexShader: `
      uniform float uOutlineWidth;
      void main() {
        vec3 expandedPosition = position + normal * uOutlineWidth;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(expandedPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `,
    side: THREE.BackSide,
    transparent: options.opacity != null && options.opacity < 1,
    opacity: options.opacity ?? 1,
    depthTest: true,
    depthWrite: false,
    toneMapped: false
  });
  const outline = new THREE.Mesh(geometry, material);
  outline.name = "StrandSelectionOutline";
  outline.visible = false;
  outline.renderOrder = options.renderOrder ?? 2;
  outline.raycast = () => {};
  return outline;
}

function strandUsesDoubleSidedMaterial(lock) {
  return ["braid", "poly"].includes(lock?.geometryType)
    || Boolean(lock?.hairCard)
    || (
      lock?.geometryType === "curve-surface"
      && Boolean(lock?.curveSurfaceCompoundProfile)
    );
}

function applyMaterialDefinitionToLock(lock) {
  if (lock.mesh.material === lock.uvCheckerMaterial && lock.uvCheckerOriginalMaterial) {
    lock.mesh.material = lock.uvCheckerOriginalMaterial;
  }
  const definition = materialForLock(lock);
  if (lock.mesh.material.userData.hairShader !== definition.shader) {
    const previousMaterial = lock.mesh.material;
    lock.mesh.material = createHairMaterial(lock);
  lock.mesh.material.side = lock.branchRootRegion || strandUsesDoubleSidedMaterial(lock)
      ? THREE.DoubleSide
      : THREE.FrontSide;
    previousMaterial.dispose();
  }
  lock.mesh.material.userData.definition = definition;
  setAnimeHairBaseColor(
    lock.mesh.material,
    hairMaterialGradientActive(lock) ? strandGradientTintColor(lock) : deps.strandViewportBaseColor(lock)
  );
  applyHairBaseGradient(lock.mesh.material, lock);
  if (lock.mesh.material.userData.hairShader === STANDARD_ANISOTROPIC_SHADER) {
    lock.mesh.material.roughness = definition.roughness;
  } else if (lock.mesh.material.userData.hairShader === ANIME_ANISOTROPIC_SHADER) {
    Object.keys(ANIME_ANISOTROPIC_NUMERIC_FIELDS).forEach((key) => {
      const uniformName = `u${key.slice("anime".length)}`;
      lock.mesh.material.uniforms[uniformName].value = definition[key];
    });
  }
  deps.updateStrandSelectionHighlightForLock(lock);
  if (deps.hairState.uvCheckerEnabled) deps.ensureUvCheckerForLock(lock);
}

function refreshMaterialUsers(materialId) {
  deps.locks.forEach((lock) => {
    if ((lock.materialId || DEFAULT_HAIR_MATERIAL_ID) === materialId) applyMaterialDefinitionToLock(lock);
  });
  deps.updateStrandSelectionHighlight();
  if (deps.sculptState.drawStrandStroke) deps.drawFlowApi.updateDrawStrandPreview();
  deps.renderLockList();
}

function renderHairMaterialOutliner() {
  const usageCounts = hairMaterialUsageCounts(deps.locks, deps.hairMaterialDefinitions, DEFAULT_HAIR_MATERIAL_ID);
  const activeDefinition = activeHairMaterialDefinition();
  deps.hairMaterialOutliner.replaceChildren(...deps.hairMaterialDefinitions.map((material) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "material-outliner-item";
    button.dataset.hairMaterialId = material.id;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(material.id === activeDefinition.id));
    button.classList.toggle("active", material.id === activeDefinition.id);

    const swatch = document.createElement("span");
    swatch.className = "material-outliner-swatch";
    if (material.baseColorGradientEnabled) {
      swatch.style.background = hairGradientCss(material.baseColorGradientStops);
    } else {
      swatch.style.backgroundColor = normalizeHairShader(material.shader) === ANIME_ANISOTROPIC_SHADER
        ? material.animeBaseColor
        : material.color;
    }
    const name = document.createElement("span");
    name.className = "material-outliner-name";
    name.textContent = material.name;
    const count = document.createElement("span");
    count.className = "material-outliner-count";
    const users = usageCounts.get(material.id) || 0;
    count.textContent = `${users}`;
    count.title = `${users} strand${users === 1 ? "" : "s"}`;
    button.append(swatch, name, count);
    return button;
  }));
}

function renderHairMaterialOptions(selectedMaterialId = DEFAULT_HAIR_MATERIAL_ID) {
  deps.hairMaterialSelect.replaceChildren(...deps.hairMaterialDefinitions.map((material) => {
    const option = document.createElement("option");
    option.value = material.id;
    option.textContent = material.name;
    return option;
  }));
  deps.hairMaterialSelect.value = hairMaterialDefinition(selectedMaterialId).id;
}

function syncHairMaterialEditor(lock = null) {
  if (lock) {
    deps.hairState.activeHairMaterialId = materialForLock(lock).id;
    markHairMaterialPresetCustom();
  }
  const definition = activeHairMaterialDefinition();
  deps.deleteProjectHairMaterialButton.disabled = definition.id === DEFAULT_HAIR_MATERIAL_ID;
  const assignedMaterialId = deps.getSelectedLock()?.materialId || DEFAULT_HAIR_MATERIAL_ID;
  renderHairMaterialOptions(assignedMaterialId);
  renderHairMaterialOutliner();
  deps.hairMaterialNameInput.value = definition.name;
  deps.hairMaterialShaderInput.value = definition.shader;
  deps.hairMaterialColorInput.value = definition.color;
  deps.hairMaterialRoughnessInput.value = String(definition.roughness);
  deps.hairMaterialRoughnessValue.textContent = definition.roughness.toFixed(2);
  syncHairMaterialGradientEditor();
  const animeShader = definition.shader === ANIME_ANISOTROPIC_SHADER;
  deps.hairMaterialStandardControls.classList.toggle("hidden", animeShader);
  deps.hairMaterialRoughnessControl.classList.toggle("hidden", definition.shader !== STANDARD_ANISOTROPIC_SHADER);
  deps.hairMaterialAnimeControls.classList.toggle("hidden", !animeShader);
  Object.entries(deps.hairMaterialAnimeColorInputs).forEach(([key, input]) => {
    input.value = definition[key];
  });
  Object.entries(deps.hairMaterialAnimeNumericControls).forEach(([key, control]) => {
    const field = ANIME_ANISOTROPIC_NUMERIC_FIELDS[key];
    control.input.value = String(definition[key]);
    control.output.textContent = Number(definition[key]).toFixed(field.digits);
  });
}

function createProjectHairMaterial({ assignToSelected = false } = {}) {
  const lock = deps.getSelectedLock();
  deps.pushUndoState();
  const source = assignToSelected && lock ? materialForLock(lock) : activeHairMaterialDefinition();
  deps.hairState.hairMaterialIndex += 1;
  const material = normalizeHairMaterialDefinition({ ...source });
  material.id = `hair-material-${crypto.randomUUID()}`;
  material.name = `Hair Material ${deps.hairState.hairMaterialIndex}`;
  deps.hairMaterialDefinitions.push(material);
  deps.hairState.activeHairMaterialId = material.id;
  markHairMaterialPresetCustom();
  if (assignToSelected && lock) {
    deps.editSelectedLocks((item) => {
      item.materialId = material.id;
      applyMaterialDefinitionToLock(item);
    }, { renderList: false });
  }
  syncHairMaterialEditor();
  deps.renderLockList();
}

function deleteActiveHairMaterial() {
  const material = activeHairMaterialDefinition();
  if (material.id === DEFAULT_HAIR_MATERIAL_ID) return;
  deps.pushUndoState();
  deps.hairMaterialDefinitions.splice(deps.hairMaterialDefinitions.indexOf(material), 1);
  deps.locks.forEach((lock) => {
    if ((lock.materialId || DEFAULT_HAIR_MATERIAL_ID) === material.id) {
      lock.materialId = DEFAULT_HAIR_MATERIAL_ID;
      applyMaterialDefinitionToLock(lock);
      deps.syncActiveMirror(lock, { refreshUi: true });
    }
  });
  deps.hairState.activeHairMaterialId = DEFAULT_HAIR_MATERIAL_ID;
  markHairMaterialPresetCustom();
  syncHairMaterialEditor();
  deps.renderLockList();
  deps.hairMaterialOutliner.querySelector(`[data-hair-material-id="${CSS.escape(DEFAULT_HAIR_MATERIAL_ID)}"]`)?.focus();
}

function captureGradientInputUndo() {
  if (gradientInputUndoCaptured) return;
  deps.pushUndoState();
  gradientInputUndoCaptured = true;
}

function updateHairMaterialGradientDefinition({ interactive = false } = {}) {
  const definition = activeHairMaterialDefinition();
  definition.baseColorGradientStops = normalizeHairGradientStops(
    definition.baseColorGradientStops,
    definition.shader === ANIME_ANISOTROPIC_SHADER ? definition.animeBaseColor : definition.color
  );
  syncHairGradientTexture(definition);
  if (!interactive) renderHairMaterialOutliner();
  syncHairMaterialGradientEditor();
}

function syncHairMaterialGradientEditor() {
  const definition = activeHairMaterialDefinition();
  const stops = normalizeHairGradientStops(
    definition.baseColorGradientStops,
    definition.shader === ANIME_ANISOTROPIC_SHADER ? definition.animeBaseColor : definition.color
  );
  definition.baseColorGradientStops = stops;
  activeHairGradientStopIndex = THREE.MathUtils.clamp(activeHairGradientStopIndex, 0, stops.length - 1);
  const background = hairGradientCss(stops);
  deps.hairMaterialGradientPreview.style.background = background;
  deps.hairMaterialGradientTrack.style.background = background;
  deps.hairMaterialGradientEnabledInput.checked = definition.baseColorGradientEnabled;
  deps.editHairMaterialGradientButton.disabled = !definition.baseColorGradientEnabled;
  const selected = stops[activeHairGradientStopIndex];
  deps.hairMaterialGradientStopColorInput.value = selected.color;
  deps.hairMaterialGradientStopPositionInput.value = String(selected.position);
  deps.hairMaterialGradientStopPositionValue.textContent = `${Math.round(selected.position * 100)}%`;
  deps.deleteHairMaterialGradientStopButton.disabled = stops.length <= 2;
  deps.addHairMaterialGradientStopButton.disabled = stops.length >= MAX_HAIR_GRADIENT_STOPS;
  deps.hairMaterialGradientTrack.replaceChildren(...stops.map((stop, index) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "material-gradient-stop";
    marker.classList.toggle("active", index === activeHairGradientStopIndex);
    marker.dataset.gradientStopIndex = String(index);
    marker.style.left = `${stop.position * 100}%`;
    marker.style.background = stop.color;
    marker.title = `${Math.round(stop.position * 100)}%`;
    marker.setAttribute("aria-label", `Gradient stop ${index + 1}`);
    return marker;
  }));
}

function openHairMaterialGradientEditor() {
  activeHairGradientStopIndex = 0;
  syncHairMaterialGradientEditor();
  deps.hairMaterialGradientDialog.showModal();
}

function setActiveHairGradientStopPosition(value, { interactive = false } = {}) {
  const definition = activeHairMaterialDefinition();
  const stops = normalizeHairGradientStops(definition.baseColorGradientStops);
  const selected = stops[activeHairGradientStopIndex];
  if (!selected) return;
  selected.position = THREE.MathUtils.clamp(Number(value) || 0, 0, 1);
  const selectedReference = selected;
  stops.sort((first, second) => first.position - second.position);
  activeHairGradientStopIndex = stops.indexOf(selectedReference);
  definition.baseColorGradientStops = stops;
  updateHairMaterialGradientDefinition({ interactive });
}

function finishHairGradientStopDrag(event) {
  if (!hairGradientStopDrag || event.pointerId !== hairGradientStopDrag.pointerId) return;
  hairGradientStopDrag = null;
  if (deps.hairMaterialGradientTrack.hasPointerCapture(event.pointerId)) {
    deps.hairMaterialGradientTrack.releasePointerCapture(event.pointerId);
  }
  renderHairMaterialOutliner();
}

function setupHairMaterialGradientUi() {
  deps.hairMaterialGradientEnabledInput.addEventListener("change", () => {
    markHairMaterialPresetCustom();
    deps.pushUndoState();
    const material = activeHairMaterialDefinition();
    material.baseColorGradientEnabled = deps.hairMaterialGradientEnabledInput.checked;
    refreshMaterialUsers(material.id);
    syncHairMaterialEditor();
  });
  deps.editHairMaterialGradientButton.addEventListener("click", openHairMaterialGradientEditor);
  [deps.closeHairMaterialGradientDialogButton, deps.doneHairMaterialGradientButton].forEach((button) => {
    button.addEventListener("click", () => deps.hairMaterialGradientDialog.close());
  });
  deps.hairMaterialGradientDialog.addEventListener("click", (event) => {
    if (event.target === deps.hairMaterialGradientDialog) deps.hairMaterialGradientDialog.close();
  });
  deps.hairMaterialGradientTrack.addEventListener("pointerdown", (event) => {
    const marker = event.target.closest("[data-gradient-stop-index]");
    if (!marker) return;
    markHairMaterialPresetCustom();
    activeHairGradientStopIndex = Number(marker.dataset.gradientStopIndex);
    deps.pushUndoState();
    hairGradientStopDrag = { pointerId: event.pointerId };
    deps.hairMaterialGradientTrack.setPointerCapture(event.pointerId);
    setActiveHairGradientStopPosition(
      (event.clientX - deps.hairMaterialGradientTrack.getBoundingClientRect().left)
        / Math.max(1, deps.hairMaterialGradientTrack.clientWidth),
      { interactive: true }
    );
    event.preventDefault();
  });
  deps.hairMaterialGradientTrack.addEventListener("pointermove", (event) => {
    if (!hairGradientStopDrag || event.pointerId !== hairGradientStopDrag.pointerId) return;
    const bounds = deps.hairMaterialGradientTrack.getBoundingClientRect();
    setActiveHairGradientStopPosition((event.clientX - bounds.left) / Math.max(1, bounds.width), {
      interactive: true
    });
  });
  deps.hairMaterialGradientTrack.addEventListener("pointerup", finishHairGradientStopDrag);
  deps.hairMaterialGradientTrack.addEventListener("pointercancel", finishHairGradientStopDrag);
  deps.hairMaterialGradientStopColorInput.addEventListener("input", () => {
    markHairMaterialPresetCustom();
    captureGradientInputUndo();
    const material = activeHairMaterialDefinition();
    const stop = material.baseColorGradientStops[activeHairGradientStopIndex];
    if (!stop) return;
    stop.color = deps.hairMaterialGradientStopColorInput.value;
    updateHairMaterialGradientDefinition({ interactive: true });
  });
  deps.hairMaterialGradientStopColorInput.addEventListener("change", () => {
    gradientInputUndoCaptured = false;
    renderHairMaterialOutliner();
  });
  deps.hairMaterialGradientStopPositionInput.addEventListener("input", () => {
    markHairMaterialPresetCustom();
    captureGradientInputUndo();
    setActiveHairGradientStopPosition(deps.hairMaterialGradientStopPositionInput.value, { interactive: true });
  });
  deps.hairMaterialGradientStopPositionInput.addEventListener("change", () => {
    gradientInputUndoCaptured = false;
    renderHairMaterialOutliner();
  });
  deps.addHairMaterialGradientStopButton.addEventListener("click", () => {
    const material = activeHairMaterialDefinition();
    if (material.baseColorGradientStops.length >= MAX_HAIR_GRADIENT_STOPS) return;
    markHairMaterialPresetCustom();
    deps.pushUndoState();
    const position = 0.5;
    const color = `#${sampleHairGradientColor(material.baseColorGradientStops, position).getHexString()}`;
    material.baseColorGradientStops.push({ position, color });
    material.baseColorGradientStops.sort((first, second) => first.position - second.position);
    activeHairGradientStopIndex = material.baseColorGradientStops.findIndex((stop) => stop.position === position && stop.color === color);
    updateHairMaterialGradientDefinition();
  });
  deps.deleteHairMaterialGradientStopButton.addEventListener("click", () => {
    const material = activeHairMaterialDefinition();
    if (material.baseColorGradientStops.length <= 2) return;
    markHairMaterialPresetCustom();
    deps.pushUndoState();
    material.baseColorGradientStops.splice(activeHairGradientStopIndex, 1);
    activeHairGradientStopIndex = Math.min(activeHairGradientStopIndex, material.baseColorGradientStops.length - 1);
    updateHairMaterialGradientDefinition();
  });
  deps.resetHairMaterialGradientButton.addEventListener("click", () => {
    markHairMaterialPresetCustom();
    const material = activeHairMaterialDefinition();
    const color = material.shader === ANIME_ANISOTROPIC_SHADER ? material.animeBaseColor : material.color;
    deps.pushUndoState();
    material.baseColorGradientStops = [{ position: 0, color }, { position: 1, color }];
    activeHairGradientStopIndex = 0;
    updateHairMaterialGradientDefinition();
  });
}

function loadCustomHairMaterialPresets() {
  try {
    deps.projectState.state.customHairMaterialPresets = normalizeHairMaterialPresetLibrary(
      JSON.parse(localStorage.getItem(HAIR_MATERIAL_PRESET_STORAGE_KEY) || "null")
    );
  } catch (error) {
    console.warn("Could not load material presets", error);
    deps.projectState.state.customHairMaterialPresets = [];
  }
}

function saveCustomHairMaterialPresets() {
  try {
    localStorage.setItem(HAIR_MATERIAL_PRESET_STORAGE_KEY, JSON.stringify(hairMaterialPresetLibrary()));
  } catch (error) {
    console.warn("Could not save material presets", error);
  }
}

function populateHairMaterialPresetSelect(selectedId = activeHairMaterialPresetId) {
  const currentOption = document.createElement("option");
  currentOption.value = "";
  currentOption.textContent = "Current Material";
  deps.hairMaterialPresetInput.replaceChildren(currentOption, ...hairMaterialPresetLibrary().map((preset) => {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.name;
    return option;
  }));
  activeHairMaterialPresetId = hairMaterialPresetLibrary().some((preset) => preset.id === selectedId)
    ? selectedId
    : "";
  deps.hairMaterialPresetInput.value = activeHairMaterialPresetId;
  deps.removeHairMaterialPresetButton.disabled = !activeHairMaterialPresetId;
}

function markHairMaterialPresetCustom() {
  if (!activeHairMaterialPresetId && !deps.hairMaterialPresetInput.value) return;
  activeHairMaterialPresetId = "";
  deps.hairMaterialPresetInput.value = "";
  deps.removeHairMaterialPresetButton.disabled = true;
}

function openSaveHairMaterialPreset() {
  deps.projectState.state.pendingShapePresetSave = null;
  deps.projectState.state.pendingCreationPresetType = null;
  pendingHairMaterialPresetSave = hairMaterialPresetValue(activeHairMaterialDefinition());
  deps.creationPresetDialogTitle.textContent = "Create Material Preset";
  deps.creationPresetDescription.textContent = "Save the current material settings in this browser.";
  deps.creationPresetNameInput.value = activeHairMaterialDefinition().name || "New Material Preset";
  deps.creationPresetDialog.showModal();
  requestAnimationFrame(() => {
    deps.creationPresetNameInput.focus();
    deps.creationPresetNameInput.select();
  });
}

function commitHairMaterialPreset() {
  const name = deps.creationPresetNameInput.value.trim();
  if (!pendingHairMaterialPresetSave || !name) return false;
  const preset = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    value: hairMaterialPresetValue(pendingHairMaterialPresetSave)
  };
  hairMaterialPresetLibrary().push(preset);
  saveCustomHairMaterialPresets();
  activeHairMaterialPresetId = preset.id;
  populateHairMaterialPresetSelect(preset.id);
  pendingHairMaterialPresetSave = null;
  deps.creationPresetDialog.close();
  return true;
}

function applyHairMaterialPreset(presetId) {
  const preset = hairMaterialPresetLibrary().find((item) => item.id === presetId);
  if (!preset) {
    markHairMaterialPresetCustom();
    return;
  }
  deps.pushUndoState();
  const definition = activeHairMaterialDefinition();
  const applied = normalizeHairMaterialDefinition({
    id: definition.id,
    name: preset.name,
    ...hairMaterialPresetValue(preset.value)
  });
  Object.keys(definition).forEach((key) => delete definition[key]);
  Object.assign(definition, applied);
  activeHairMaterialPresetId = preset.id;
  refreshMaterialUsers(definition.id);
  syncHairMaterialEditor();
  populateHairMaterialPresetSelect(preset.id);
}

function openRemoveHairMaterialPreset() {
  const preset = hairMaterialPresetLibrary().find((item) => item.id === deps.hairMaterialPresetInput.value);
  if (!preset) return;
  deps.projectState.state.pendingShapePresetRemoval = null;
  deps.projectState.state.pendingCreationPresetRemoval = null;
  pendingHairMaterialPresetRemoval = preset.id;
  deps.removeCreationPresetDialogTitle.textContent = "Remove Material Preset";
  deps.removeCreationPresetMessage.textContent = `Remove "${preset.name}"? This only removes it from this browser.`;
  deps.removeCreationPresetDialog.showModal();
}

function commitRemoveHairMaterialPreset() {
  if (!pendingHairMaterialPresetRemoval) return false;
  deps.projectState.state.customHairMaterialPresets = removeHairMaterialPreset(
    hairMaterialPresetLibrary(),
    pendingHairMaterialPresetRemoval
  );
  saveCustomHairMaterialPresets();
  pendingHairMaterialPresetRemoval = null;
  activeHairMaterialPresetId = "";
  populateHairMaterialPresetSelect();
  deps.removeCreationPresetDialog.close();
  return true;
}

function clearHairMaterialPresetPending() {
  pendingHairMaterialPresetSave = null;
  pendingHairMaterialPresetRemoval = null;
}

function setupHairMaterialPresetUi() {
  loadCustomHairMaterialPresets();
  populateHairMaterialPresetSelect();
  deps.hairMaterialPresetInput.addEventListener("change", () => applyHairMaterialPreset(deps.hairMaterialPresetInput.value));
  deps.saveHairMaterialPresetButton.addEventListener("click", openSaveHairMaterialPreset);
  deps.removeHairMaterialPresetButton.addEventListener("click", openRemoveHairMaterialPreset);
  deps.creationPresetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    commitHairMaterialPreset();
  });
  deps.creationPresetDialog.addEventListener("close", clearHairMaterialPresetPending);
  deps.confirmRemoveCreationPresetButton.addEventListener("click", () => {
    commitRemoveHairMaterialPreset();
  });
  deps.removeCreationPresetDialog.addEventListener("close", clearHairMaterialPresetPending);
}

  return {
    hairMaterialDefinition,
    materialForLock,
    activeHairMaterialDefinition,
    strandDisplayColor,
    strandGradientTintColor,
    setAnimeHairBaseColor,
    createAnimeAnisotropicMaterial,
    createHairMaterial,
    createStrandSelectionOutline,
    strandUsesDoubleSidedMaterial,
    applyMaterialDefinitionToLock,
    applyHairBaseGradient,
    refreshMaterialUsers,
    renderHairMaterialOutliner,
    renderHairMaterialOptions,
    syncHairMaterialEditor,
    createProjectHairMaterial,
    deleteActiveHairMaterial,
    hairGradientCss,
    sampleHairGradientColor,
    syncHairGradientTexture,
    hairMaterialGradientActive,
    updateHairMaterialGradientDefinition,
    syncHairMaterialGradientEditor,
    openHairMaterialGradientEditor,
    setActiveHairGradientStopPosition,
    setupHairMaterialGradientUi,
    loadCustomHairMaterialPresets,
    saveCustomHairMaterialPresets,
    populateHairMaterialPresetSelect,
    markHairMaterialPresetCustom,
    openSaveHairMaterialPreset,
    commitHairMaterialPreset,
    applyHairMaterialPreset,
    openRemoveHairMaterialPreset,
    commitRemoveHairMaterialPreset,
    clearHairMaterialPresetPending,
    setupHairMaterialPresetUi
  };
}
