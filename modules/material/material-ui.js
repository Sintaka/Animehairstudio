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
  hairMaterialUsageCounts,
  normalizeHairMaterialDefinition,
  resolveHairMaterialDefinition
} from "./material-state.js";
import {
  DEFAULT_HAIR_MATERIAL_ID,
  HAIR_LAYERS,
  LAYER_HUE_SHIFTS,
  MATERIAL_LAYER_COLOR_FACTORS,
  SCALP_REGIONS
} from "../core/app-config.js";
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
      uBaseColor: { value: new THREE.Color(strandDisplayColor(lock)) },
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
      color: strandDisplayColor(lock),
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
    color: strandDisplayColor(lock),
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
  setAnimeHairBaseColor(lock.mesh.material, deps.strandViewportBaseColor(lock));
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
    swatch.style.backgroundColor = normalizeHairShader(material.shader) === ANIME_ANISOTROPIC_SHADER
      ? material.animeBaseColor
      : material.color;
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
  if (lock) deps.hairState.activeHairMaterialId = materialForLock(lock).id;
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
  syncHairMaterialEditor();
  deps.renderLockList();
  deps.hairMaterialOutliner.querySelector(`[data-hair-material-id="${CSS.escape(DEFAULT_HAIR_MATERIAL_ID)}"]`)?.focus();
}

  return {
    hairMaterialDefinition,
    materialForLock,
    activeHairMaterialDefinition,
    strandDisplayColor,
    setAnimeHairBaseColor,
    createAnimeAnisotropicMaterial,
    createHairMaterial,
    createStrandSelectionOutline,
    strandUsesDoubleSidedMaterial,
    applyMaterialDefinitionToLock,
    refreshMaterialUsers,
    renderHairMaterialOutliner,
    renderHairMaterialOptions,
    syncHairMaterialEditor,
    createProjectHairMaterial,
    deleteActiveHairMaterial
  };
}
