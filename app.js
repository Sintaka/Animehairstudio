import { createScalpBuilderApi } from "./modules/scalp/scalp-builder.js?v=20260814-12";
import { createGuideSystemApi } from "./modules/geometry/guide-system.js?v=20260814-12";
import { createCurveSurfaceCreateApi } from "./modules/geometry/curve-surface-create.js?v=20260814-12";
import { createTaperEditorApi } from "./modules/geometry/taper-editor.js?v=20260901-1";
import { createPolyToolsApi } from "./modules/geometry/poly-tools.js?v=20260830-1";
import { createPanelTipStrandApi } from "./modules/geometry/panel-tip-strand.js?v=20260910-8";
import { createStrandGeometryApi } from "./modules/geometry/strand-geometry.js?v=20260901-1";
import { createSculptGeometryApi } from "./modules/geometry/sculpt-geometry.js?v=20260814-12";
import { createSegmentControlApi, canFitAnotherStrandSplit } from "./modules/bones/segment-control.js?v=20260901-1";
import { createBoneInteractionApi } from "./modules/bones/bone-interaction.js?v=20260901-1";
import { createBranchSweepApi } from "./modules/geometry/branch-sweep.js?v=20260814-1";
import { createBranchHierarchyApi } from "./modules/geometry/branch-hierarchy.js?v=20260814-12";
import { createBranchRootBoneApi } from "./modules/geometry/branch-root-bone.js?v=20260814-12";
import { createBranchBridgeApi } from "./modules/geometry/branch-bridge.js?v=20260814-8";
import { createBranchRegionApi } from "./modules/geometry/branch-region-panel.js?v=20260814-12";
import { bonesFor, splitBonesFor, cloneSplitBones, materializeSplitBones, splitBonesToData, splitBonesFromData, mirrorSplitBones, bonesToData, bonesFromData, mirrorBones, registryForSave, strandTipToData, strandTipFromData, mirrorStrandTip, strandSplitBonesFor, materializeStrandSplitBones, strandSplitBonesToData, strandSplitBonesFromData, mirrorStrandSplitBones, strandSplitsFor, segmentBoneHost, SPREAD_MAX, STRAND_SEGMENT_HOST } from "./modules/bones/bone-model.js?v=20260901-1";
// 发丝段宽度曲线 Reset 的几何分派（见 #resetTaperCurve 处的注释）。
import { strandTipWidthResetCurve } from "./modules/geometry/strand-tip-width.js?v=20260901-1";
import { materializeTipChain, sampleCenterlinePoint } from "./modules/geometry/tip-sub-bone.js?v=20260830-1";
import { createBoneViewHandlesApi } from "./modules/bones/bone-view-handles.js?v=20260901-1";
import { createStrandSweepApi, SWEEP_OVERLAP_DEFAULTS } from "./modules/geometry/strand-sweep.js?v=20260813-3";
import { createShapePresetsApi } from "./modules/io/shape-presets.js?v=20260829-1";
import { createCreationPresetsApi } from "./modules/io/creation-presets.js?v=20260901-1";
import { createPresetLibraryApi } from "./modules/io/preset-library.js?v=20260812-1";
import { createDrawFlowApi } from "./modules/geometry/draw-flow.js?v=20260901-1";
import { createRadialMenuApi } from "./modules/geometry/radial-menu.js?v=20260814-12";
import { createPlacementApi } from "./modules/geometry/placement.js?v=20260814-12";
import { createProceduralDuplicateApi } from "./modules/geometry/procedural-duplicate.js?v=20260814-12";
import { createClumpProceduralApi } from "./modules/geometry/clump-procedural.js?v=20260814-12";
import { createReferenceHeadApi } from "./modules/scene/reference-head.js?v=20260814-12";
import { createMiscStore } from "./modules/core/misc-store.js?v=20260814-12";
import { createSculptEditStore } from "./modules/edit/sculpt-edit-store.js?v=20260830-1";
import { createScalpStore } from "./modules/scalp/scalp-store.js?v=20260809-10";
import { createProjectStore } from "./modules/io/project-store.js?v=20260909-2";
import { createHairStore } from "./modules/core/hair-store.js?v=20260816-7";
import { createGuideStore } from "./modules/core/guide-store.js?v=20260809-8";
import { createCameraStore } from "./modules/core/camera-store.js?v=20260809-8";
import { createTransformStore } from "./modules/core/transform-store.js?v=20260809-7";
import { createUndoStore } from "./modules/core/undo-store.js?v=20260809-7";
import { createHeadStore } from "./modules/core/head-store.js?v=20260809-7";
import { createUiStore } from "./modules/core/ui-store.js?v=20260814-12";
import { createMultiCameraStore } from "./modules/core/multi-camera-store.js?v=20260814-12";
import { createReferenceStore } from "./modules/edit/reference-store.js?v=20260809-5";
import { createDrawStore } from "./modules/edit/draw-store.js?v=20260814-12";
import { createBranchStore } from "./modules/branch/branch-store.js?v=20260814-12";
import { createSelectionStore } from "./modules/edit/selection-store.js?v=20260809-2";
import { createProjectSaveApi } from "./modules/io/project-files.js?v=20260901-1";
// Wind preview wiring: store + pure wind math (both modules are built in parallel; until
// they land these imports 404 — expected, coordinated at merge).
import { createWindStore } from "./modules/core/wind-store.js?v=20260817-2";
import * as windPreview from "./modules/geometry/wind-preview.js?v=20260817-2";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { solvePulledStrand } from "./modules/geometry/strand-constraints.js?v=20260814-12";
import {
  proceduralAccessoryTaperScale,
  proceduralAccessoryTemplateData,
  proceduralBranchTemplateData
} from "./modules/geometry/procedural-draw.js?v=20260814-12";
import {
  compoundBridgeArchWeight,
  compoundBridgeParameters,
  compoundConnectedSegmentCount,
  compoundProfileBridgePlan
} from "./modules/geometry/compound-strand.js?v=20260814-12";
import {
  adaptiveCurveParameters,
  blendDirectionPointData,
  blendCylindricalPolylinePointData,
  blendEnvelopeCurves,
  blendSurfaceOrientedPolylinePointData,
  blendSampleArrays,
  blendTaperCurves,
  clumpMemberGuideParameter,
  eightWayScreenDelta,
  curvePointInsertionPlan,
  curveRebuildParameters,
  curvePointRemovalPlan,
  curvedRelaxPositionTarget,
  evenlySpacedInteriorAmounts,
  legacyTaperCurve,
  horizontalCirclePointData,
  horizontalCircleThroughPointData,
  lowestSharedHorizontalPolylinePointData,
  normalizeEnvelopeCurve,
  normalizeTaperCurve,
  profileTopologyCenterWeight,
  proximityCurveBlendAmount,
  relaxAngleValue,
  remapEnvelopeCurveRange,
  rootCorrectionFalloff,
  sampleArray,
  sampleAsymmetricTaperCurve,
  sampleIntegratedEnvelopeCurve,
  sampleScale,
  sampleTaperCurve,
  surfaceArcBlendAmount,
  surfaceArcPolylinePointData,
  symmetricClosedCurveParameters,
  twistCurveDensityDetail,
  twistCurveDisplayRange,
  twistCurveHandleDistancePerDegree,
  twistRateDegreesFromUnits,
  twistRateUnitsFromDegrees,
  upperProfileArcIndices,
  uniformCurveParameters,
  // Scalp Conform 的默认值：**唯一定义点在 curve-math.js**。import 而不是抄写 —— 抄写会让
  // 默认值变成多个定义点（0.2.137 初版在此硬写过三处上限，已改为 import）。
  PANEL_SCALP_CONFORM_DEFAULTS
} from "./modules/geometry/curve-math.js?v=20260910-5";
import {
  curveLatticeLoopPointIndices,
  DEFAULT_CURVE_LATTICE_PLANE,
  flatCurveLatticePointData,
  resampleCurveLatticeLineData,
  resampleCurveLatticePointData
} from "./modules/geometry/curve-lattice.js?v=20260814-12";
import {
  createLoftSurfaceLatticePointData,
  createSurfaceLatticePointData,
  DEFAULT_SURFACE_LATTICE_COLUMNS,
  DEFAULT_SURFACE_LATTICE_ROWS,
  mirroredSurfaceLatticePointIndex,
  normalizeSurfaceLatticeCount,
  resampleSurfaceLatticePointData,
  sampleSurfaceLattice,
  surfaceLatticePointIndex,
  surfaceLatticeWireSegments
} from "./modules/geometry/surface-lattice.js?v=20260814-12";
import {
  buildConnectedCurveCardGrid,
  buildCurveSurfaceGrid,
  curveSurfaceControlPointCount,
  curveSurfaceControllerSideDirections,
  curveSurfaceLineLength,
  DEFAULT_CURVE_SURFACE_ROWS,
  DEFAULT_CURVE_SURFACE_STRIP_WIDTH,
  resampleCurveSurfaceLine
} from "./modules/geometry/curve-surface.js?v=20260814-12";
import {
  curveDeformedCapsulePoints,
  polylineLength,
  sampleCapsuleRadialProfile,
  scaleCapsuleRadialLoops
} from "./modules/geometry/capsule-curve.js?v=20260814-12";
import { exportCurvePolyline, exportHairFaces, hairFaceIndices } from "./modules/io/obj-export.js?v=20260814-12";
import { exportAnimeHairUsda } from "./modules/io/usda-export.js?v=20260901-1";
import {
  fileActionFormat,
  fileNameForAction,
  normalizeExportContents
} from "./modules/io/file-actions.js?v=20260816-13";
import { applicationDropFileKind } from "./modules/io/file-drop.js?v=20260814-12";
import { mirrorSelectionTargets } from "./modules/edit/mirror-selection.js?v=20260814-12";
import { uvCoordinateBounds, uvViewTransform } from "./modules/geometry/uv-inspector.js?v=20260814-12";
import {
  cameraFacingPlaneNormal,
  inflateSculptPointScale,
  pointInCameraFacingHalfSpace,
  proportionalSculptWeights,
  sculptBrushWeight,
  smoothSculptPointDeltas,
  smoothSculptTwistDeltas
} from "./modules/sculpt/sculpt-brush.js?v=20260814-12";
import { squareChildRing, holeBoundary, connectSide, connectBoundaryToRing } from "./modules/geometry/branch-connect.js?v=20260814-12";
import {
  createHairProject,
  validateHairProject
} from "./modules/io/project-schema.js?v=20260814-12";
import {
  clearRecoverySnapshot,
  createRecoveryRecord,
  DEFAULT_AUTOSAVE_INTERVAL_SECONDS,
  normalizeAutosaveInterval,
  readRecoverySnapshot,
  writeRecoverySnapshot
} from "./modules/io/recovery-storage.js?v=20260813-1";
import { createRecoveryStore } from "./modules/io/recovery-store.js?v=20260813-1";
import {
  createProjectRestorePlan,
  createProjectSelectionSnapshot,
  projectSnapshotLocks
} from "./modules/io/project-state.js?v=20260814-12";
import {
  createSelectionSetRecord,
  normalizeSelectionSets,
  updateSelectionSetMembers
} from "./modules/edit/selection-sets.js?v=20260814-12";
import {
  layoutRadialOptions,
  partitionRadialOptions,
  radialButtonEntryDistance,
  radialListCorridorContains,
  radialButtonRayExtent,
  radialMenuDimensions
} from "./modules/geometry/radial-layout.js?v=20260814-12";
import {
  APP_VERSION,
  CURVE_LATTICE_FEATURE_ENABLED,
  DEFAULT_BRAID_DEPTH_CURVE,
  DEFAULT_BRAID_MESH_PRESET,
  DEFAULT_BRAID_WIDTH_CURVE,
  DEFAULT_DEPTH_CURVE,
  DEFAULT_TWIST_CURVE,
  DEFAULT_HAIR_COLOR,
  DEFAULT_HAIR_LAYER,
  DEFAULT_HAIR_MATERIAL_ID,
  DEFAULT_HAIR_MATERIAL_SETTINGS,
  DEFAULT_LAYER_OFFSETS,
  DEFAULT_SWEEP_PROFILE,
  DEFAULT_TAPER_CURVE,
  GROUP_CURVE_FEATURE_ENABLED,
  HAIR_LAYERS,
  LAYER_HUE_SHIFTS,
  LAYER_ROOT_OFFSET_FACTORS,
  MATERIAL_LAYER_COLOR_FACTORS,
  ROOT_SCALP_OFFSET_DISTANCE,
  ROUND_SWEEP_PROFILE,
  SCALP_REGIONS,
  STRAND_GROUPS,
  TAPER_VALUE_MAX,
  TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
  TWIST_CURVE_VALUE_MAX
} from "./modules/core/app-config.js?v=20260815-4";
import { BoundedHistory, RestoreRefreshRegistry } from "./modules/core/history.js?v=20260814-12";
import {
  focusedControlShouldYieldToShortcut,
  shortcutToolForKey,
  workspaceForShortcutKey
} from "./modules/core/shortcut-registry.js?v=20260814-12";
import {
  activateStrandSelection,
  emptyStrandSelection,
  resolveStrandSelection,
  restoreStrandSelection,
  screenBoundsOverlap,
  triangleIntersectsScreenBounds
} from "./modules/edit/selection-state.js?v=20260814-12";
import { relativeEditValue } from "./modules/edit/multi-edit.js?v=20260814-12";
import { fanTriangleEdgeMasks, parseObjFaceVertexCounts } from "./modules/geometry/topology.js?v=20260814-12";
import {
  ANIME_ANISOTROPIC_FRAGMENT_SHADER,
  ANIME_ANISOTROPIC_NUMERIC_FIELDS,
  ANIME_ANISOTROPIC_SHADER,
  ANIME_ANISOTROPIC_VERTEX_SHADER,
  LAMBERT_SHADER,
  normalizeHairShader,
  STANDARD_ANISOTROPIC_SHADER
} from "./modules/geometry/anime-hair-shaders.js?v=20260814-12";
import {
  hairMaterialUsageCounts,
  normalizeHairMaterialDefinition,
  resolveHairMaterialDefinition
} from "./modules/material/material-state.js?v=20260814-12";
import {
  createDocumentLocalizer,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage
} from "./modules/data/localization.js?v=20260901-1";
import {
  emptyToolPresetLibrary,
  normalizeToolPresetLibrary,
  removeToolPreset
} from "./modules/data/tool-presets.js?v=20260814-12";
import {
  emptyShapePresetLibrary,
  normalizeShapePresetLibrary,
  removeShapePreset
} from "./modules/data/shape-presets.js?v=20260814-12";
import {
  readStoredBooleanPreference,
  readStoredPreference,
  writeStoredPreference
} from "./modules/core/preference-storage.js?v=20260814-12";
import {
  appendPolyQuad,
  deletePolyEdge,
  deletePolyFaceAndOrphans,
  deletePolyVertex,
  normalizePolyFaces,
  polyFillCandidate,
  polyMeshBuffers,
  relaxPolyPoints
} from "./modules/geometry/poly-topology.js?v=20260814-12";
import {
  createClumpBrushTemplate,
  normalizeClumpBrushTemplate
} from "./modules/data/clump-brush-presets.js?v=20260901-1";
import { createMaterialUiApi } from "./modules/material/material-ui.js?v=20260813-1";
import { createIoTailApi } from "./modules/io/io-tail.js?v=20260813-2";

// Material UI api (refactor batch A6): deps filled in one batch after the renderLockList
// definition; created early so the drawFlowDeps batch can reference materialApi.* without a
// TDZ issue.
const materialDeps = {};
const materialApi = createMaterialUiApi(materialDeps);
// IO tail api (refactor batch C1): deps filled in one batch after dataToVector; created early
// so scalpBuilderDeps/proceduralDuplicateDeps/fileApi wiring can reference ioApi.* without a
// TDZ issue.
const ioDeps = {};
const ioApi = createIoTailApi(ioDeps);
function saveLanguage(language) {
  writeStoredPreference(window, LANGUAGE_STORAGE_KEY, language);
}

const RADIAL_MENUS_PREFERENCE_KEY = "anime-hair-studio-radial-menus";
const PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY = "anime-hair-studio-experimental-procedural-draw";
const MULTI_CAMERA_EXPERIMENTAL_PREFERENCE_KEY = "anime-hair-studio-experimental-multi-camera";
const NAVIGATION_TIPS_PREFERENCE_KEY = "anime-hair-studio-navigation-tips";
const NAVIGATION_STYLE_PREFERENCE_KEY = "anime-hair-studio-navigation-style";
const CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY = "anime-hair-studio-camera-smoothing-enabled";
const CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY = "anime-hair-studio-camera-smoothing-strength";
const TOOL_TIPS_PREFERENCE_KEY = "anime-hair-studio-tool-tips";
const COMPACT_TOOL_BUTTONS_PREFERENCE_KEY = "anime-hair-studio-compact-tool-buttons";
const VIEWPORT_STATISTICS_PREFERENCE_KEY = "anime-hair-studio-viewport-statistics";
const TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY = "anime-hair-studio-twist-curve-all-strands-preview";
const LAYER_COLOR_SHIFTS_PREFERENCE_KEY = "anime-hair-studio-layer-color-shifts";
const OUTLINER_FOLDER_COLORS_PREFERENCE_KEY = "anime-hair-studio-outliner-folder-colors";
const SIDE_PANEL_STYLE_PREFERENCE_KEY = "anime-hair-studio-side-panel-style";
const GLASS_PANEL_COLOR_PREFERENCE_KEY = "anime-hair-studio-glass-panel-color";
const LEGACY_DEFAULT_GLASS_PANEL_COLOR = "#0b0a0e";
const DEFAULT_GLASS_PANEL_COLOR = "#19181d";
const OUTLINER_FOLDER_COLOR_OPACITY_PREFERENCE_KEY = "anime-hair-studio-outliner-folder-color-opacity";
const CONTROL_POINT_DISPLAY_SIZE_PREFERENCE_KEY = "anime-hair-studio-control-point-display-size";
const VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY = "anime-hair-studio-viewport-background-color";
const DEFAULT_VIEWPORT_BACKGROUND_COLOR = "#2b2730";
const SIDE_NAMING_PERSPECTIVE_PREFERENCE_KEY = "anime-hair-studio-side-naming-perspective";
const DEFAULT_HAIR_SHADER_PREFERENCE_KEY = "anime-hair-studio-default-hair-shader";
const TRANSFORM_SPACE_PREFERENCE_KEY = "anime-hair-studio-transform-space";
const BRANCH_RIGID_CURVATURE_BLEND_PREFERENCE_KEY = "anime-hair-studio-branch-rigid-curvature-blend";
const BRANCH_BRIDGE_SMOOTH_STRENGTH_PREFERENCE_KEY = "anime-hair-studio-branch-bridge-smooth-strength";
const BRANCH_BRIDGE_SMOOTH_DETAIL_PREFERENCE_KEY = "anime-hair-studio-branch-bridge-smooth-detail";
const BRANCH_REGION_SYNC_LATERAL_PREFERENCE_KEY = "anime-hair-studio-branch-region-sync-lateral";
const BRANCH_REGION_SYNC_VERTICAL_PREFERENCE_KEY = "anime-hair-studio-branch-region-sync-vertical";
const AUTOSAVE_ENABLED_PREFERENCE_KEY = "anime-hair-studio-autosave-enabled";
const AUTOSAVE_INTERVAL_PREFERENCE_KEY = "anime-hair-studio-autosave-interval";
const AUTOSAVE_QUIET_PERIOD_MS = 5000;

function saveBooleanPreference(key, enabled) {
  writeStoredPreference(window, key, Boolean(enabled));
}

function normalizeControlPointDisplaySize(value) {
  const size = Number(value);
  return Number.isFinite(size) ? Math.min(1.5, Math.max(0.5, size)) : 1;
}

function normalizeCameraSmoothingStrength(value) {
  const strength = Number(value);
  return Number.isFinite(strength) ? Math.min(1, Math.max(0, strength)) : 0.5;
}

function normalizeScaleSensitivity(value) {
  const sensitivity = Number(value);
  return Number.isFinite(sensitivity) ? Math.min(1, Math.max(0.05, sensitivity)) : 0.3;
}

function normalizeViewportBackgroundColor(value) {
  const color = String(value || "").trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(color) ? color : DEFAULT_VIEWPORT_BACKGROUND_COLOR;
}


function normalizeOutlinerFolderColorOpacity(value) {
  const opacity = Number(value);
  return Number.isFinite(opacity) ? Math.min(100, Math.max(0, opacity)) : 100;
}

function normalizeGlassPanelColor(value) {
  const color = String(value || "").trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(color) ? color : DEFAULT_GLASS_PANEL_COLOR;
}

function normalizeSidePanelStyle(value) {
  if (value === "glass" || value === "none") return value;
  if (value === "transparent") return "none";
  return value === true || value === "true" ? "none" : "default";
}

function normalizeSideNamingPerspective(value) {
  return value === "character" ? "character" : "viewport";
}

function normalizeNavigationStyle(value) {
  return value === "blender" ? "blender" : value === "houdini" ? "houdini" : "anime-hair-studio";
}

const hairState = createHairStore();
hairState.state.defaultHairShader = readStoredPreference(window, DEFAULT_HAIR_SHADER_PREFERENCE_KEY, {
  fallback: STANDARD_ANISOTROPIC_SHADER,
  normalize: normalizeHairShader
});
const savedLanguage = readStoredPreference(window, LANGUAGE_STORAGE_KEY, {
  fallback: DEFAULT_LANGUAGE,
  normalize: normalizeLanguage
});
const documentLocalizer = createDocumentLocalizer(document, savedLanguage);

function setupEditableSliderControls() {
  document.querySelectorAll('input[type="range"]').forEach((range) => {
    const label = range.closest("label");
    const existingPair = range.closest(".slider-number-pair");
    const container = existingPair || label;
    if (!container || container.classList.contains("slider-control-ready")) return;

    container.classList.add("slider-control-ready");
    label?.classList.add("editable-slider-control");

    const resetValue = range.getAttribute("value") ?? range.value;
    let numberInput = existingPair?.querySelector('input[type="number"]');
    let row = existingPair;

    if (!row) {
      row = document.createElement("span");
      row.className = "slider-input-row";
      range.parentNode.insertBefore(row, range);

      numberInput = document.createElement("input");
      numberInput.type = "number";
      numberInput.className = "slider-number-input";
      numberInput.setAttribute("aria-label", "Slider value");
      if (range.min !== "") numberInput.min = range.min;
      if (range.max !== "") numberInput.max = range.max;
      if (range.step !== "") numberInput.step = range.step;
      numberInput.value = range.value;
      row.append(numberInput, range);
    } else {
      row.classList.add("slider-input-row");
      if (numberInput) {
        numberInput.classList.add("slider-number-input");
        row.insertBefore(numberInput, range);
      }
    }

    const existingReset = label?.querySelector(":scope > button[data-reset-head-transform], :scope > button[data-reset-scalp-rough-scale]");
    const resetButton = existingReset || document.createElement("button");
    resetButton.type = "button";
    resetButton.classList.add("slider-reset-button");
    if (!existingReset) {
      resetButton.textContent = "⟲";
      resetButton.title = "Reset to default";
      resetButton.setAttribute("aria-label", "Reset slider to default");
      resetButton.addEventListener("click", () => {
        range.value = resetValue;
        range.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    row.append(resetButton);

    const syncNumberFromRange = () => {
      if (numberInput && document.activeElement !== numberInput) numberInput.value = range.value;
    };
    range.addEventListener("input", syncNumberFromRange);
    range.addEventListener("change", syncNumberFromRange);

    if (!existingPair && numberInput) {
      const applyNumberValue = () => {
        if (numberInput.value === "" || !Number.isFinite(numberInput.valueAsNumber)) return;
        range.value = String(numberInput.valueAsNumber);
        numberInput.value = range.value;
        range.dispatchEvent(new Event("input", { bubbles: true }));
      };
      numberInput.addEventListener("input", applyNumberValue);
      numberInput.addEventListener("change", applyNumberValue);
    }

    const output = label?.querySelector("output");
    if (output) {
      output.classList.add("slider-generated-readout-hidden");
      new MutationObserver(syncNumberFromRange).observe(output, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  });
}

setupEditableSliderControls();

const viewport = document.querySelector("#viewport");
const viewportPanel = viewport.closest(".viewport-panel");
const viewportTopControls = document.querySelector(".viewport-top-controls");
const viewportDisplayActions = document.querySelector(".viewport-display-actions");
const viewportModes = document.querySelector(".viewport-modes");
const outlinerPanel = document.querySelector(".outliner-panel");
const cameraViewCubeModel = document.querySelector("#cameraViewCubeModel");
const cameraViewCubeFaces = [...document.querySelectorAll("[data-camera-view]")];
const strandObjectTransformPanel = document.querySelector("#strandObjectTransformPanel");
const strandObjectTransformInputs = [...document.querySelectorAll("[data-object-transform][data-axis]")];
const strandObjectTransformResetButtons = [...document.querySelectorAll("[data-reset-object-transform]")];
const multiCameraViews = document.querySelector("#multiCameraViews");
const multiCameraPreviewContainers = {
  perspective: document.querySelector("#multiCameraPerspective"),
  front: document.querySelector("#multiCameraFront"),
  right: document.querySelector("#multiCameraRight"),
  top: document.querySelector("#multiCameraTop")
};
const multiCameraState = createMultiCameraStore();
const referenceImageDropTarget = document.querySelector("#referenceImageDropTarget");
const referenceOverlayDropMarker = document.querySelector("#referenceOverlayDropMarker");
const selectionMarquee = document.querySelector("#selectionMarquee");
const sculptBrushDock = document.querySelector("#sculptBrushDock");
const sculptBrushCursor = document.querySelector("#sculptBrushCursor");
const sculptBrushFalloffRing = sculptBrushCursor.querySelector(".sculpt-brush-falloff");
const sculptBrushStrengthInput = document.querySelector("#sculptBrushStrength");
const sculptBrushStrengthValue = document.querySelector("#sculptBrushStrengthValue");
const sculptBrushRadiusInput = document.querySelector("#sculptBrushRadius");
const sculptBrushRadiusValue = document.querySelector("#sculptBrushRadiusValue");
const sculptBrushFalloffInput = document.querySelector("#sculptBrushFalloff");
const sculptBrushFalloffValue = document.querySelector("#sculptBrushFalloffValue");
const sculptPreserveTipsSetting = document.querySelector("#sculptPreserveTipsSetting");
const sculptPreserveTipsInput = document.querySelector("#sculptPreserveTips");
const sculptBrushShowClippingPlaneInput = document.querySelector("#sculptBrushShowClippingPlane");
const sculptBrushShowCurvesInput = document.querySelector("#sculptBrushShowCurves");
const sculptBrushPlanePositionInput = document.querySelector("#sculptBrushPlanePosition");
const sculptBrushPlanePositionValue = document.querySelector("#sculptBrushPlanePositionValue");
const sculptBrushStrengthByTool = {
  "sculpt-move": 0.2,
  "sculpt-smooth": 0.5,
  "sculpt-inflate": 0.5,
  "sculpt-slide": 0.6,
  "sculpt-scale": 0.5,
  "sculpt-push": 1,
  "sculpt-orient": 0.5,
  "sculpt-twist": 0.5
};
const sculptBrushPreserveTipsByTool = {
  "sculpt-move": false,
  "sculpt-smooth": true
};
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.localClippingEnabled = true;
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const sculptBrushViabilityPlane = new THREE.GridHelper(4.2, 12, 0xff4fd8, 0xff4fd8);
sculptBrushViabilityPlane.material.depthTest = true;
sculptBrushViabilityPlane.material.depthWrite = false;
sculptBrushViabilityPlane.material.opacity = 0.42;
sculptBrushViabilityPlane.material.transparent = true;
sculptBrushViabilityPlane.name = "Sculpt Brush Viability Plane (Debug)";
sculptBrushViabilityPlane.renderOrder = 9998;
sculptBrushViabilityPlane.visible = false;
const sculptBrushViabilityPlaneFill = new THREE.Mesh(
  new THREE.PlaneGeometry(4.2, 4.2),
  new THREE.MeshBasicMaterial({
    color: 0xff4fd8,
    depthTest: true,
    depthWrite: false,
    opacity: 0.1,
    side: THREE.DoubleSide,
    transparent: true
  })
);
sculptBrushViabilityPlaneFill.rotation.x = -Math.PI / 2;
sculptBrushViabilityPlaneFill.renderOrder = 9997;
sculptBrushViabilityPlane.add(sculptBrushViabilityPlaneFill);
scene.add(sculptBrushViabilityPlane);

const perspectiveCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
const orthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
const multiCameraPreviewCameras = {
  front: new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 200),
  right: new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 200),
  top: new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 200)
};
let camera = perspectiveCamera;
const turntableAxis = new THREE.Vector3(0, 1, 0);
const TURNTABLE_RADIANS_PER_SECOND = THREE.MathUtils.degToRad(24);
camera.position.set(0, 1.15, 5.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enableRotate = false;
controls.target.set(0, 0.75, 0);
const multiCameraViewTargets = {
  perspective: controls.target.clone(),
  front: controls.target.clone(),
  right: controls.target.clone(),
  top: controls.target.clone()
};
const MULTI_CAMERA_VIEW_AXES = Object.freeze({
  front: new THREE.Vector3(0, 0, 1),
  right: new THREE.Vector3(1, 0, 0),
  top: new THREE.Vector3(0, 1, 0.0001).normalize()
});

const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode("translate");
transformControls.setSize(0.72);
scene.add(transformControls);

function copyCameraPose(source, target) {
  target.position.copy(source.position);
  target.quaternion.copy(source.quaternion);
  target.up.copy(source.up);
}

function updateCameraProjectionForViewport() {
  const paneMetrics = multiCameraPaneMetrics();
  const width = multiCameraState.state.enabled
    ? multiCameraViewPaneWidth("perspective", paneMetrics)
    : Math.max(1, viewport.clientWidth);
  const height = multiCameraState.state.enabled ? paneMetrics.height : Math.max(1, viewport.clientHeight);
  const aspect = width / height;
  perspectiveCamera.aspect = aspect;
  perspectiveCamera.updateProjectionMatrix();
  orthographicCamera.left = -viewportState.state.orthographicHalfHeight * aspect;
  orthographicCamera.right = viewportState.state.orthographicHalfHeight * aspect;
  orthographicCamera.top = viewportState.state.orthographicHalfHeight;
  orthographicCamera.bottom = -viewportState.state.orthographicHalfHeight;
  orthographicCamera.updateProjectionMatrix();
}

function syncOrthographicFramingFromDistance() {
  const distance = Math.max(0.01, camera.position.distanceTo(controls.target));
  viewportState.state.orthographicHalfHeight = distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov * 0.5));
  orthographicCamera.zoom = 1;
}

function setOrthographicView(enabled) {
  const nextOrthographic = Boolean(enabled);
  if (nextOrthographic === viewportState.state.orthographicView) return;
  const previousCamera = camera;
  if (nextOrthographic) {
    syncOrthographicFramingFromDistance();
    copyCameraPose(previousCamera, orthographicCamera);
    camera = orthographicCamera;
  } else {
    const visibleHalfHeight = viewportState.state.orthographicHalfHeight / Math.max(0.0001, orthographicCamera.zoom);
    const distance = visibleHalfHeight / Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov * 0.5));
    copyCameraPose(previousCamera, perspectiveCamera);
    const direction = new THREE.Vector3();
    previousCamera.getWorldDirection(direction);
    perspectiveCamera.position.copy(controls.target).addScaledVector(direction, -distance);
    camera = perspectiveCamera;
  }
  viewportState.state.orthographicView = nextOrthographic;
  controls.object = camera;
  transformControls.camera = camera;
  updateCameraProjectionForViewport();
  orthographicViewToggle.classList.toggle("active", viewportState.state.orthographicView);
  orthographicViewToggle.setAttribute("aria-pressed", String(viewportState.state.orthographicView));
  orthographicViewToggle.title = viewportState.state.orthographicView
    ? "Switch to perspective view"
    : "Switch to orthographic view";
  controls.update();
  referenceHeadApi.updateReferencePlaneVisibility();
}

function ensureMultiCameraPreviewRenderers() {
  if (multiCameraState.state.previewRenderers) return multiCameraState.state.previewRenderers;
  multiCameraState.state.previewRenderers = Object.fromEntries(Object.entries(multiCameraPreviewContainers).map(([view, container]) => {
    const previewRenderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    previewRenderer.shadowMap.enabled = false;
    previewRenderer.domElement.setAttribute("aria-label", `${view} camera preview`);
    container.prepend(previewRenderer.domElement);
    return [view, previewRenderer];
  }));
  return multiCameraState.state.previewRenderers;
}

function multiCameraForView(view) {
  return view === "perspective" ? perspectiveCamera : multiCameraPreviewCameras[view];
}

function multiCameraViewUsesLeftPane(view) {
  return view === "perspective" || view === "right";
}

function multiCameraViewPaneWidth(view, paneMetrics) {
  return multiCameraViewUsesLeftPane(view) ? paneMetrics.leftWidth : paneMetrics.rightWidth;
}

function multiCameraViewProjectionOffsetX(view, paneMetrics) {
  return multiCameraViewUsesLeftPane(view)
    ? paneMetrics.leftProjectionOffsetX
    : paneMetrics.rightProjectionOffsetX;
}

function initializeMultiCameraOrthographicViews() {
  const target = controls.target.clone();
  const distance = Math.max(0.1, perspectiveCamera.position.distanceTo(target));
  const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov * 0.5));
  multiCameraViewTargets.perspective.copy(target);
  Object.entries(multiCameraPreviewCameras).forEach(([view, previewCamera]) => {
    multiCameraViewTargets[view].copy(target);
    previewCamera.userData.multiCameraHalfHeight = halfHeight;
    previewCamera.zoom = 1;
    previewCamera.position.copy(target).addScaledVector(MULTI_CAMERA_VIEW_AXES[view], distance);
    previewCamera.up.set(0, 1, 0);
    previewCamera.lookAt(target);
  });
}

function syncMultiCameraPreviewCameras() {
  const paneMetrics = multiCameraPaneMetrics();
  Object.entries(multiCameraPreviewCameras).forEach(([view, previewCamera]) => {
    const halfHeight = Math.max(0.0001, Number(previewCamera.userData.multiCameraHalfHeight) || 1);
    const paneWidth = multiCameraViewPaneWidth(view, paneMetrics);
    const projectionOffsetX = multiCameraViewProjectionOffsetX(view, paneMetrics);
    const aspect = Math.max(0.01, paneWidth / paneMetrics.height);
    previewCamera.left = -halfHeight * aspect;
    previewCamera.right = halfHeight * aspect;
    previewCamera.top = halfHeight;
    previewCamera.bottom = -halfHeight;
    applyViewportProjectionOffset(previewCamera, paneWidth, paneMetrics.height, projectionOffsetX);
  });
}

function multiCameraOrthographicViewActive() {
  return multiCameraState.state.enabled && multiCameraState.state.activeView !== "perspective";
}

function prioritizeActiveMultiCameraViewport(frameCount = 1) {
  multiCameraState.state.previewRenderPauseFrames = Math.max(
    multiCameraState.state.previewRenderPauseFrames,
    Math.max(0, Math.round(Number(frameCount) || 0))
  );
}

function renderNextInactiveMultiCameraPreview() {
  if (!multiCameraState.state.enabled || !multiCameraState.state.previewRenderers) return;
  if (multiCameraState.state.previewRenderPauseFrames > 0) {
    multiCameraState.state.previewRenderPauseFrames -= 1;
    return;
  }
  const inactivePreviews = Object.entries(multiCameraState.state.previewRenderers)
    .filter(([view]) => view !== multiCameraState.state.activeView);
  if (!inactivePreviews.length) return;
  const [view, previewRenderer] = inactivePreviews[
    multiCameraState.state.previewRenderCursor % inactivePreviews.length
  ];
  multiCameraState.state.previewRenderCursor = (multiCameraState.state.previewRenderCursor + 1) % inactivePreviews.length;
  previewRenderer.render(scene, multiCameraForView(view));
}

function setMultiCameraActiveView(view, { resizeViewport = true } = {}) {
  if (!Object.hasOwn(multiCameraPreviewContainers, view)) return;
  if (multiCameraViewTargets[multiCameraState.state.activeView]) {
    multiCameraViewTargets[multiCameraState.state.activeView].copy(controls.target);
  }
  multiCameraState.state.activeView = view;
  camera = multiCameraForView(view);
  controls.object = camera;
  controls.target.copy(multiCameraViewTargets[view]);
  controls.enableRotate = false;
  transformControls.camera = camera;
  Object.entries(multiCameraPreviewContainers).forEach(([candidate, container]) => {
    container.classList.toggle("active", candidate === view);
    container.setAttribute("aria-pressed", String(candidate === view));
  });
  ["perspective", "front", "right", "top"].forEach((candidate) => {
    viewportPanel.classList.toggle(`multi-camera-active-${candidate}`, candidate === view);
  });
  controls.update();
  referenceHeadApi.updateReferencePlaneVisibility();
  if (resizeViewport) resize();
}

function setMultiCameraEnabled(enabled) {
  const nextEnabled = Boolean(enabled);
  if (nextEnabled && !multiCameraState.state.experimentalEnabled) return;
  if (nextEnabled && viewportState.state.orthographicView) setOrthographicView(false);
  multiCameraState.state.enabled = nextEnabled;
  viewportPanel.classList.toggle("multi-camera-view", multiCameraState.state.enabled);
  multiCameraViews.setAttribute("aria-hidden", String(!multiCameraState.state.enabled));
  multiCameraViewToggle.classList.toggle("active", multiCameraState.state.enabled);
  multiCameraViewToggle.setAttribute("aria-pressed", String(multiCameraState.state.enabled));
  orthographicViewToggle.disabled = multiCameraState.state.enabled;
  if (multiCameraState.state.enabled) {
    ensureMultiCameraPreviewRenderers();
    initializeMultiCameraOrthographicViews();
  }
  setMultiCameraActiveView("perspective", { resizeViewport: false });
  resize();
}

function setMultiCameraExperimentalEnabled(enabled, { persist = true } = {}) {
  multiCameraState.state.experimentalEnabled = Boolean(enabled);
  multiCameraExperimentalPreferenceInput.checked = multiCameraState.state.experimentalEnabled;
  multiCameraViewToggle.hidden = !multiCameraState.state.experimentalEnabled;
  multiCameraViewToggle.setAttribute("aria-hidden", String(!multiCameraState.state.experimentalEnabled));
  multiCameraViewToggle.tabIndex = multiCameraState.state.experimentalEnabled ? 0 : -1;
  if (!multiCameraState.state.experimentalEnabled && multiCameraState.state.enabled) setMultiCameraEnabled(false);
  if (persist) {
    saveBooleanPreference(MULTI_CAMERA_EXPERIMENTAL_PREFERENCE_KEY, multiCameraState.state.experimentalEnabled);
  }
  syncViewportTopControlRows();
}

function multiCameraPaneMetrics() {
  const fullWidth = Math.max(2, viewport.clientWidth);
  const height = Math.max(1, viewport.clientHeight * 0.5);
  const leftWidth = THREE.MathUtils.clamp(fullWidth * 0.5, 1, fullWidth - 1);
  return {
    leftWidth,
    rightWidth: fullWidth - leftWidth,
    height,
    leftProjectionOffsetX: 0,
    rightProjectionOffsetX: 0
  };
}

function applyViewportProjectionOffset(targetCamera, width, height, offsetX = 0) {
  targetCamera.clearViewOffset();
  if (Math.abs(offsetX) < 0.5) return;
  targetCamera.setViewOffset(width, height, offsetX, 0, width, height);
}

const TRANSFORM_GIZMO_PICKER_DEFLATION = 0.5;
const TRANSFORM_GIZMO_AXIS_PICKER_DEFLATION = 0.35;
const STRAND_CONTROL_POINT_RADIUS_SCALE = 0.85;
const STRAND_CONTROL_POINT_DRAW_TOOL_SCALE = 0.5;
const CONTROL_POINT_SELECTED_COLOR = 0xffd84d;
const TRANSFORM_GIZMO_DARK_AXIS_COLORS = Object.freeze({
  X: 0x6b2525,
  Y: 0x245c32,
  Z: 0x273d70
});

function addNegativeTransformGizmoRods() {
  const gizmoGroups = transformControls._gizmo?.gizmo;
  if (!gizmoGroups) return;
  ["translate", "scale"].forEach((mode) => {
    const gizmoGroup = gizmoGroups[mode];
    ["X", "Y", "Z"].forEach((axis) => {
      const positiveRod = gizmoGroup.children.find((handle) => {
        const parameters = handle.geometry?.parameters;
        return handle.name === axis
          && handle.geometry?.type === "CylinderGeometry"
          && Math.abs((parameters?.radiusTop ?? 0) - (parameters?.radiusBottom ?? 0)) < 1e-6;
      });
      if (!positiveRod) return;
      const negativeRod = positiveRod.clone();
      negativeRod.geometry = positiveRod.geometry.clone();
      negativeRod.material = positiveRod.material.clone();
      negativeRod.material.color.setHex(TRANSFORM_GIZMO_DARK_AXIS_COLORS[axis]);
      const rotation = axis === "Y"
        ? new THREE.Matrix4().makeRotationX(Math.PI)
        : new THREE.Matrix4().makeRotationY(Math.PI);
      negativeRod.geometry.applyMatrix4(rotation);
      negativeRod.userData.negativeAxisRod = true;
      gizmoGroup.add(negativeRod);
    });
  });
}

addNegativeTransformGizmoRods();

function addFullRotateGizmoAxisCircles() {
  const rotateGizmo = transformControls._gizmo?.gizmo?.rotate;
  if (!rotateGizmo) return;
  ["X", "Y", "Z"].forEach((axis) => {
    const geometry = new THREE.TorusGeometry(0.5, 0.0055, 3, 64);
    if (axis === "X") geometry.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    if (axis === "Y") geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const material = new THREE.MeshBasicMaterial({
      color: TRANSFORM_GIZMO_DARK_AXIS_COLORS[axis],
      depthTest: false,
      depthWrite: false,
      fog: false,
      toneMapped: false,
      transparent: true,
      opacity: 0.72
    });
    const circle = new THREE.Mesh(geometry, material);
    circle.name = axis;
    circle.renderOrder = 9999;
    circle.userData.fullRotateAxisCircle = true;
    rotateGizmo.add(circle);
  });
}

addFullRotateGizmoAxisCircles();

function removeRotateFreeAxisRing() {
  const transformGizmo = transformControls._gizmo;
  if (!transformGizmo) return;
  [transformGizmo.gizmo.rotate, transformGizmo.picker.rotate].forEach((group) => {
    group.children
      .filter((handle) => handle.name === "XYZE")
      .forEach((handle) => group.remove(handle));
  });
}

removeRotateFreeAxisRing();

function deflateTransformGizmoPickers(factor) {
  const pickerGroups = transformControls._gizmo?.picker;
  if (!pickerGroups) return;
  const adjustedGeometries = new Set();
  Object.values(pickerGroups).forEach((pickerGroup) => {
    pickerGroup.traverse((pickerHandle) => {
      const geometry = pickerHandle.geometry;
      if (!geometry || adjustedGeometries.has(geometry)) return;
      adjustedGeometries.add(geometry);
      if (geometry.type === "CylinderGeometry") {
        const axisFactor = TRANSFORM_GIZMO_AXIS_PICKER_DEFLATION;
        const axisScale = {
          X: [1, axisFactor, axisFactor],
          Y: [axisFactor, 1, axisFactor],
          Z: [axisFactor, axisFactor, 1]
        }[pickerHandle.name] ?? [axisFactor, axisFactor, axisFactor];
        geometry.scale(...axisScale);
      } else if (geometry.type === "TorusGeometry") {
        const position = geometry.getAttribute("position");
        const ringRadius = geometry.parameters.radius;
        for (let index = 0; index < position.count; index += 1) {
          const x = position.getX(index);
          const y = position.getY(index);
          const z = position.getZ(index);
          const ringAxis = pickerHandle.name;
          const radialDistance = ringAxis === "X"
            ? Math.hypot(y, z)
            : ringAxis === "Y"
              ? Math.hypot(x, z)
              : Math.hypot(x, y);
          const deflatedRadius = ringRadius + (radialDistance - ringRadius) * factor;
          const radialScale = radialDistance > 1e-6 ? deflatedRadius / radialDistance : 1;
          if (ringAxis === "X") position.setXYZ(index, x * factor, y * radialScale, z * radialScale);
          else if (ringAxis === "Y") position.setXYZ(index, x * radialScale, y * factor, z * radialScale);
          else position.setXYZ(index, x * radialScale, y * radialScale, z * factor);
        }
        position.needsUpdate = true;
      } else if (pickerHandle.name === "XYZ") {
        // Keep the free-move center picker at full size (matching the visible gizmo)
        // so the center / universal move stays easy to grab even for large strands;
        // only the axis pickers are deflated for precise grabbing.
      } else {
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);
        geometry.scale(factor, factor, factor);
        geometry.translate(center.x, center.y, center.z);
      }
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    });
  });
}

deflateTransformGizmoPickers(TRANSFORM_GIZMO_PICKER_DEFLATION);

const pullTarget = new THREE.Object3D();
const strandObjectTransformHandle = new THREE.Object3D();
strandObjectTransformHandle.userData.strandObjectTransform = true;
const guideObjectTransformHandle = new THREE.Object3D();
guideObjectTransformHandle.userData.guideObjectTransform = true;
const capsuleGuideLoopHandle = new THREE.Object3D();
capsuleGuideLoopHandle.userData.capsuleGuideLoopHandle = true;
const transform = createTransformStore();
const viewportState = createCameraStore();
const sculptState = createSculptEditStore();
const TRANSFORM_PRECISION_MULTIPLIER = 0.2;
const MIN_UNIFORM_SCALE_RATIO = 0.05;
const MAX_UNIFORM_SCALE_RATIO = 4;
const pullGuide = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
  new THREE.LineBasicMaterial({ color: 0xf2b35f, transparent: true, opacity: 0.82, depthTest: false })
);
pullGuide.visible = false;
pullGuide.frustumCulled = false;
pullGuide.renderOrder = 90;
scene.add(pullTarget, pullGuide, capsuleGuideLoopHandle, strandObjectTransformHandle, guideObjectTransformHandle);
transformControls.addEventListener("dragging-changed", (event) => {
  sculptState.state.transformDragging = event.value;
  if (event.value && ["translate", "rotate"].includes(transformControls.mode)) {
    const object = transformControls.object;
    sculptState.state.transformPrecisionDrag = object
      ? {
          mode: transformControls.mode,
          lastRawPosition: object.position.clone(),
          appliedPosition: object.position.clone(),
          lastRawQuaternion: object.quaternion.clone(),
          appliedQuaternion: object.quaternion.clone()
        }
      : null;
  } else if (!event.value) {
    sculptState.state.transformPrecisionDrag = null;
  }
  if (event.value && transformControls.mode === "scale") {
    const pointerX = viewportState.state.activeViewportPointer?.x ?? lastPointer.x;
    const pointerY = viewportState.state.activeViewportPointer?.y ?? lastPointer.y;
    sculptState.state.transformScaleDrag = {
      axis: transformControls.axis,
      startScale: transformControls.object?.scale.clone() || null,
      pointerId: viewportState.state.activeViewportPointer?.pointerId ?? null,
      startPointerX: pointerX,
      startPointerY: pointerY,
      pointerX,
      pointerY,
      lastPointerX: pointerX,
      lastPointerY: pointerY,
      lastRawScale: transformControls.object?.scale.clone() || null,
      appliedScale: transformControls.object?.scale.clone() || null
    };
  } else if (!event.value) {
    sculptState.state.transformScaleDrag = null;
  }
  const reference = referenceImages.find((item) => item.id === transformControls.object?.userData.referenceImageId);
  if (reference) {
    if (event.value) {
      pushUndoState();
      sculptState.state.referenceScaleDrag = transformControls.mode === "scale"
        ? { startScale: transformControls.object.scale.clone(), axis: transformControls.axis }
        : null;
    } else {
      referenceHeadApi.syncReferenceImageFromMesh(reference);
      sculptState.state.referenceScaleDrag = null;
      referenceHeadApi.renderReferenceImagePanel();
    }
    updateInteractionLocks();
    return;
  }
  if (event.value && transformControls.mode === "scale") {
    const axis = transformControls.axis;
    sculptState.state.uniformScaleDrag = ["XY", "XZ", "YZ", "XYZ"].includes(axis)
      ? {
          axis,
          startScale: transformControls.object?.scale.clone()
        }
      : null;
  } else if (!event.value) {
    sculptState.state.uniformScaleDrag = null;
  }
  updateInteractionLocks();
  if (transformControls.object?.userData.strandObjectTransform) {
    if (event.value) {
      pushUndoState();
      beginStrandObjectTransform(transformControls.object);
    } else {
      finishStrandObjectTransform();
    }
    return;
  }
  if (transformControls.object?.userData.guideObjectTransform) {
    if (event.value) {
      pushUndoState();
      beginGuideObjectTransform(transformControls.object);
    } else {
      finishGuideObjectTransform();
    }
    return;
  }
  // Tip 子骨骼手柄：rotate 拖拽开始时记录 startQuaternion/startPoints（objectChange
  // 里按总旋转增量应用，避免累积），translate 记录 startPosition/startPoints，结束时
  // 清理；scale 工具只附着、不应用。
  if (transformControls.object?.userData.tipSegmentIndex != null) {
    if (event.value && transformControls.mode === "rotate") {
      pushUndoState();
      bonesApi.beginTipSubBoneRotate(transformControls.object);
    } else if (event.value && transformControls.mode === "translate") {
      pushUndoState();
      bonesApi.beginTipSubBoneTranslate(transformControls.object);
    } else if (!event.value) {
      sculptState.state.tipSubBoneRotateDrag = null;
      sculptState.state.tipSubBoneTranslateDrag = null;
    }
    return;
  }
  if (transformControls.object?.userData.surfaceObjectAnchor) {
    if (event.value) {
      pushUndoState();
      beginSurfaceObjectTransform(transformControls.object);
    } else {
      finishSurfaceObjectTransform();
    }
    return;
  }
  if (transformControls.object?.userData.capsuleGuideLoopHandle) {
    if (event.value) {
      pushUndoState();
      guideApi.beginCapsuleGuideLoopTransform();
    } else {
      guideState.state.activeCapsuleGuideLoopTransform = null;
      capsuleGuideLoopHandle.scale.set(1, 1, 1);
    }
    return;
  }
  if (transformControls.object?.userData.capsuleGuidePointIndex !== undefined) {
    if (event.value) {
      pushUndoState();
      guideApi.beginCapsuleGuideHandleEdit(transformControls.object);
    } else {
      sculptState.state.activeCapsuleGuideEdit = null;
    }
    return;
  }
  if (transformControls.object?.userData.scalpBuilderLatticeIndex !== undefined) {
    if (event.value) {
      pushUndoState();
      scalpBuilder.beginScalpBuilderCurveLatticeEdit(transformControls.object);
    } else {
      scalpBuilder.commitScalpBuilderCurveLatticeEdit();
    }
    return;
  }
  if (transformControls.object?.userData.scalpBuilderPlane) return;
  if (sculptState.state.proportionalSizeEdit) return;
  if (event.value) {
    pushUndoState();
    if (transformControls.object?.userData.curveLatticeGuideId !== undefined) {
      guideApi.beginCurveLatticeMultiEdit(transformControls.object);
    } else if (transformControls.object?.userData.scalpLatticeIndex === undefined) {
      beginHandleEdit();
    }
  }
  if (!event.value) {
    const editedLock = locks.find((item) => item.id === sculptState.state.activeHandleEdit?.lockId);
    clumpProceduralApi.commitClumpMemberRestState(editedLock);
    clumpProceduralApi.commitClumpMemberRestState(mirrorPartnerFor(editedLock));
    flushPendingLockGeometryUpdates();
    sculptState.state.activeHandleEdit = null;
    sculptState.state.activeLatticeMultiEdit = null;
  }
});
transformControls.addEventListener("objectChange", () => {
  if (sculptState.state.proportionalSizeEdit) return;
  const handle = transformControls.object;
  if (!handle) return;
  applyTransformPrecision(handle);
  applyReducedTransformScale(handle);
  const reference = referenceImages.find((item) => item.id === handle.userData.referenceImageId);
  if (reference) {
    if (sculptState.state.referenceScaleDrag && transformControls.mode === "scale") {
      const axis = String(sculptState.state.referenceScaleDrag.axis || "X")[0].toLowerCase();
      const start = sculptState.state.referenceScaleDrag.startScale;
      const factor = start[axis] ? handle.scale[axis] / start[axis] : 1;
      handle.scale.copy(start).multiplyScalar(Math.max(0.05, factor));
    }
    referenceHeadApi.syncReferenceImageFromMesh(reference);
    referenceHeadApi.renderReferenceImagePanel();
    return;
  }
  applyUniformTransformScale(handle);
  if (handle.userData.strandObjectTransform) {
    updateStrandObjectTransform(handle);
    syncStrandObjectTransformPanel({ preview: true });
    return;
  }
  if (handle.userData.guideObjectTransform) {
    updateGuideObjectTransform(handle);
    return;
  }
  if (handle.userData.surfaceObjectAnchor) {
    updateSurfaceObjectTransform(handle);
    return;
  }
  if (handle.userData.scalpBuilderLatticeIndex !== undefined) {
    scalpBuilder.updateScalpBuilderCurveLatticeFromHandle(handle);
    return;
  }
  if (handle.userData.scalpBuilderPlane) {
    const step = SCALP_BUILDER_STEPS[scalpState.state.scalpBuilderStep];
    scalpBuilderPlanePositions[scalpState.state.scalpBuilderStep] = handle.position[step.axis];
    scalpBuilder.rebuildScalpBuilderIntersection(handle, step);
    scalpBuilder.updateScalpBuilderPositionReadout();
    return;
  }
  if (handle.userData.scalpLatticeIndex !== undefined) {
    scalpBuilder.updateScalpLatticeFromHandle(handle);
    return;
  }
  if (handle.userData.capsuleGuideLoopHandle) {
    guideApi.updateCapsuleGuideLoopTransform();
    return;
  }
  if (handle.userData.capsuleGuidePointIndex !== undefined) {
    guideApi.updateCapsuleGuideFromHandle(handle);
    return;
  }
  if (handle.userData.curveLatticeGuideId !== undefined) {
    if (sculptState.state.activeLatticeMultiEdit) guideApi.applyCurveLatticeMultiTransform(handle);
    else guideApi.updateCurveLatticeFromHandle(handle);
    return;
  }
  const lock = locks.find((item) => item.id === handle.userData.lockId);
  if (!lock) return;
  if (handle.userData.tipSegmentIndex != null) {
    // Tip 子骨骼手柄：旋转增量应用到 tip 链（scale 暂不应用）。
    bonesApi.applyTipSubBoneTransform(lock, handle);
    return;
  }
  const pointIndex = handle.userData.pointIndex;
  if (!sculptState.state.activeHandleEdit || sculptState.state.activeHandleEdit.lockId !== lock.id || sculptState.state.activeHandleEdit.pointIndex !== pointIndex) {
    beginHandleEdit();
  }
  if (sel.state.activeTool === "move") {
    if (lock.geometryType === "surface") {
      if (multiPointHandleEditActive()) applyMultiMove(lock, handle);
      else applySingleMove(lock, pointIndex, handle);
      applySurfaceLatticeMirror(lock, pointIndex);
    } else if (pullMoveActive()) applyPullMove(lock, pointIndex, handle);
    else if (multiPointHandleEditActive()) applyMultiMove(lock, handle);
    else if (sculptState.state.hierarchyEditing) applyHierarchicalMove(lock, pointIndex, handle);
    else if (sculptState.state.proportionalEditing) applyProportionalMove(lock, pointIndex, handle);
    else applySingleMove(lock, pointIndex, handle);
    syncLockFromCurve(lock);
  } else if (sel.state.activeTool === "rotate") {
    if (multiPointHandleEditActive()) applyMultiRotate(lock, pointIndex, handle);
    else if (sculptState.state.hierarchyEditing) applyHierarchicalRotate(lock, pointIndex, handle);
    else if (sculptState.state.proportionalEditing) applyProportionalRotate(lock, pointIndex, handle);
    else applySingleRotate(lock, pointIndex, handle);
  } else if (sel.state.activeTool === "scale") {
    if (multiPointHandleEditActive()) applyMultiScale(lock, handle);
    else if (sculptState.state.hierarchyEditing) applyHierarchicalScale(lock, pointIndex, handle);
    else if (sculptState.state.proportionalEditing) applyProportionalScale(lock, pointIndex, handle);
    else applySingleScale(lock, pointIndex, handle);
    lock.width = Math.max(0.04, lock.baseWidth * average(lock.pointWidths));
  }
  branchRootBone.enforceBranchRootPosition(lock);
  if (sel.state.activeTool === "move" && sculptState.state.hierarchyEditing && pointIndex === 0 && lock.branchParentId) {
    branchRootBone.applyBranchRigidRootMove(lock);
    branchRootBone.syncBranchRootHandleFrame(lock);
  }
  syncUnifiedCurveSurfaceMirror(lock, pointIndex, sel.state.activeTool);
  if (["move", "rotate"].includes(sel.state.activeTool)) updateGroupLatticeBaseFromHandleEdit(lock);
  updateLockGeometry(lock);
  updatePullGuideVisual();
  syncActiveMirror(lock);
  syncInputs(lock);
});

const keyLight = new THREE.DirectionalLight(0xffead6, 2.5);
keyLight.position.set(3, 4, 4);
const keyLightDistance = keyLight.position.length();
const animeAnisotropicLightDirection = keyLight.position.clone().normalize();
keyLight.castShadow = true;
scene.add(keyLight);
scene.add(new THREE.HemisphereLight(0xdde9ff, 0x271c17, 1.8));

const hairGroup = new THREE.Group();
scene.add(hairGroup);
const curveGroup = new THREE.Group();
scene.add(curveGroup);
const VIEW_PLANE_SIZE = 160;
const viewPlaneFill = new THREE.Mesh(
  new THREE.PlaneGeometry(VIEW_PLANE_SIZE, VIEW_PLANE_SIZE),
  new THREE.MeshBasicMaterial({
    color: 0x2edce8,
    transparent: true,
    opacity: 0.025,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  })
);
viewPlaneFill.geometry.rotateX(-Math.PI / 2);
viewPlaneFill.renderOrder = 0;
viewPlaneFill.visible = false;
scene.add(viewPlaneFill);

const viewPlaneGrid = new THREE.GridHelper(VIEW_PLANE_SIZE, 640, 0x58f6ff, 0x58f6ff);
[viewPlaneGrid.material].flat().forEach((material, index) => {
  material.transparent = true;
  material.opacity = index === 0 ? 0.085 : 0.045;
  material.depthTest = true;
  material.depthWrite = false;
});
viewPlaneGrid.renderOrder = 1;
viewPlaneGrid.visible = false;
scene.add(viewPlaneGrid);
const viewPlaneNormalGuide = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
    depthWrite: false
  })
);
viewPlaneNormalGuide.renderOrder = 14;
viewPlaneNormalGuide.visible = false;
scene.add(viewPlaneNormalGuide);
const guideSurfaceGroup = new THREE.Group();
scene.add(guideSurfaceGroup);
const referenceImageGroup = new THREE.Group();
scene.add(referenceImageGroup);
const hairMaterialDefinitions = [{
  id: DEFAULT_HAIR_MATERIAL_ID,
  name: "Default Purple",
  ...DEFAULT_HAIR_MATERIAL_SETTINGS,
  shader: hairState.state.defaultHairShader
}];
function nextStrandName(region = "unassigned") {
  const group = STRAND_GROUPS.find((item) => item.id === region) || STRAND_GROUPS.at(-1);
  const usedNumbers = new Set(
    locks
      .filter((lock) => (lock.scalpRegion || "unassigned") === group.id)
      .map((lock) => {
        const match = lock.name.match(new RegExp(`^${group.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} (\\d+)$`));
        return match ? Number(match[1]) : null;
      })
      .filter(Number.isFinite)
  );
  let number = 1;
  while (usedNumbers.has(number)) number += 1;
  return `${group.label} ${number}`;
}

const DRAW_CLUMP_TEMPLATE = {
  baseWidth: 0.16,
  strands: [
    {
      width: 0.16,
      points: [
        [-0.0059968, 1.1055072, 0.8644583], [0.0046603, 0.8400218, 1.0761476],
        [0.0021184, 0.5085847, 1.1661279], [-0.0060136, 0.1663752, 1.1675754],
        [-0.0027709, -0.1783919, 1.1683911]
      ]
    },
    {
      width: 0.11,
      points: [
        [0.0570277, 1.0950850, 0.8716710], [0.1521222, 0.7779978, 1.0928572],
        [0.1577654, 0.3969150, 1.1301010], [0.1166098, 0.0842272, 1.1460944],
        [0.0878968, -0.1030747, 1.1484194]
      ]
    },
    {
      width: 0.11,
      points: [
        [-0.0581465, 1.0934739, 0.8730643], [-0.1365748, 0.8361366, 1.0668734],
        [-0.1913321, 0.5173142, 1.1480565], [-0.1772792, 0.1955351, 1.1458786],
        [-0.0859821, -0.1121232, 1.1459633]
      ]
    }
  ]
};
const PONYTAIL_CLUMP_TEMPLATE = {
  baseWidth: 0.37,
  sweepProfile: ROUND_SWEEP_PROFILE,
  strands: [
    { width: 0.37, depth: 0.63, points: [[-1.99175,1.50455,0],[-1.9448,1.1279,0],[-1.88621,0.7505,0],[-1.84689,0.36988,0],[-1.84853,-0.01287,0],[-1.88766,-0.3946,0],[-1.94533,-0.77502,0],[-2.00204,-1.15557,0],[-2.04201,-1.5375,0],[-2.05438,-1.92069,0],[-2.04068,-2.30405,0]], pointTwists: [0,0,0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-2.01613,1.36886,0.15163],[-1.98091,1.03725,0.30053],[-1.95689,0.68885,0.39752],[-1.9715,0.32609,0.38762],[-1.99396,-0.03738,0.3549],[-2.01093,-0.40272,0.32708],[-2.04768,-0.76734,0.32546],[-2.12411,-1.12205,0.32508],[-2.2506,-1.46056,0.32504],[-2.39859,-1.78997,0.32504]], pointTwists: [0,0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-1.84435,1.33002,0.11383],[-1.71882,0.97542,0.22071],[-1.62432,0.5971,0.26637],[-1.58016,0.20746,0.267],[-1.59823,-0.18267,0.25005],[-1.66846,-0.56538,0.24602],[-1.78865,-0.93788,0.24562],[-1.9285,-1.30543,0.24562],[-2.04745,-1.67765,0.24562],[-2.11442,-2.05703,0.24562],[-2.12564,-2.43986,0.24562]], pointTwists: [0,0,0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-2.13244,1.28114,0.01023],[-2.16719,0.92929,0.04112],[-2.18165,0.5769,0.00143],[-2.17376,0.22592,-0.08855],[-2.1739,-0.12536,-0.16789],[-2.14502,-0.4685,-0.22951],[-2.09771,-0.80234,-0.27013],[-2.07725,-1.1521,-0.31504],[-2.07437,-1.5133,-0.36182],[-2.07437,-1.87309,-0.39531],[-2.07437,-2.2128,-0.35768],[-2.07437,-2.51604,-0.20662]], pointTwists: [0,0,0,0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-1.90611,1.1698,-0.23365],[-1.84674,0.83754,-0.37034],[-1.73308,0.48334,-0.39132],[-1.69504,0.11499,-0.36198],[-1.72229,-0.26188,-0.33824],[-1.75816,-0.64422,-0.33427],[-1.79765,-1.02698,-0.33409],[-1.84476,-1.40793,-0.33409],[-1.86509,-1.78536,-0.33409],[-1.8016,-2.13693,-0.33409],[-1.6274,-2.44096,-0.33409]], pointTwists: [0,0,0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-2.04416,1.2839,-0.16124],[-2.06988,0.94267,-0.25938],[-2.03612,0.59491,-0.33309],[-1.96916,0.24528,-0.38299],[-1.90665,-0.10679,-0.39301],[-1.89154,-0.46223,-0.39588],[-1.93536,-0.81525,-0.39621],[-2.02149,-1.16221,-0.39621],[-2.09759,-1.50679,-0.39621],[-2.12247,-1.85365,-0.39621]], pointTwists: [0,0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-1.79678,1.30424,-0.01811],[-1.6668,0.95652,-0.087],[-1.57745,0.59344,-0.13338],[-1.52487,0.21948,-0.13445],[-1.5323,-0.15917,-0.10932],[-1.56632,-0.53702,-0.09915],[-1.62831,-0.91215,-0.09783],[-1.67653,-1.28803,-0.09783],[-1.6913,-1.66008,-0.09783],[-1.66927,-1.9994,-0.09783],[-1.5654,-2.28346,-0.09783]], pointTwists: [0,0,0,0,0,0,0,0,0,0,0] },
    { width: 0.1, depth: 0.07, points: [[-2.09905,0.62482,0.13261],[-2.1226,0.24201,0.21698],[-2.12984,-0.14754,0.1898],[-2.17178,-0.54156,0.14291],[-2.21536,-0.93721,0.09333],[-2.23726,-1.33364,0.0467],[-2.24746,-1.73153,0.04013],[-2.24889,-2.12821,0.07435],[-2.24892,-2.52382,0.125]], pointTwists: [0,0,0,0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-1.65793,-0.80677,0.0821],[-1.78627,-1.17084,0.0821],[-1.91775,-1.53524,0.0821],[-1.99534,-1.91184,0.0821],[-1.99096,-2.29777,0.0821],[-1.94043,-2.68428,0.0821]], pointTwists: [0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-1.98536,1.39806,0.14304],[-1.86478,1.08165,0.262],[-1.76729,0.70268,0.40457],[-1.73102,0.38614,0.54706],[-1.71714,0.09238,0.76279],[-1.69992,-0.15615,1.01915]], pointTwists: [0,-2.65601,-2.63184,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-2.10323,1.27659,0.10918],[-2.17363,0.943,0.19556],[-2.218,0.601,0.14519],[-2.30906,0.28624,0.04089],[-2.55369,0.03296,-0.0095],[-2.83084,-0.19123,-0.03129]], pointTwists: [0,0,0,0,0,0] },
    { width: 0.16, depth: 0.16, points: [[-1.91578,1.2702,-0.19383],[-1.90989,0.97292,-0.37237],[-1.86446,0.6268,-0.53259],[-1.76459,0.29509,-0.62104],[-1.60836,-0.02171,-0.63937],[-1.39474,-0.30746,-0.68418],[-1.16412,-0.57291,-0.74777]], pointTwists: [0,0,0,0,2.61824,0,0] }
  ]
};
const DRAW_CLUMP_TEMPLATES = {
  clump: DRAW_CLUMP_TEMPLATE,
  "ponytail-clump": PONYTAIL_CLUMP_TEMPLATE
};

const PROCEDURAL_DRAW_DEFAULTS = Object.freeze({
  accessoryCount: 0,
  accessoryRadius: 0.7,
  parentVisible: true,
  branchCount: 4,
  branchLength: 0.6,
  branchTipOffset: 0.35
});
const DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE = Object.freeze([
  Object.freeze({ position: 0, value: 1, interpolation: "linear" }),
  Object.freeze({ position: 1, value: 1, interpolation: "linear" })
]);
const DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE = Object.freeze([
  Object.freeze({ position: 0, value: 0, interpolation: "linear" }),
  Object.freeze({ position: 1, value: 1, interpolation: "linear" })
]);

const STRAIGHT_CUT_PANEL_CURVE = [
  { position: 0, value: 0.3, interpolation: "smooth" },
  { position: 0.11, value: 0.6, interpolation: "smooth" },
  { position: 0.412177485867707, value: 0.96009768675739, interpolation: "smooth" },
  { position: 0.767972228455824, value: 0.868693329977256, interpolation: "smooth" },
  { position: 1, value: 0.576204074482149, interpolation: "smooth" }
];
const SHAPE_PRESETS = {
  sweepProfile: [
    { id: "anime-wedge-creased", name: "Anime Wedge Creased", value: DEFAULT_SWEEP_PROFILE },
    { id: "anime-wedge", name: "Anime Wedge", value: DEFAULT_SWEEP_PROFILE.map((point) => ({ ...point, interpolation: "smooth" })) },
    { id: "flat-ribbon", name: "Flat Ribbon", value: [
      { x: 1, z: -0.10 }, { x: 0.72, z: 0.04 }, { x: 0, z: 0.16 },
      { x: -0.72, z: 0.04 }, { x: -1, z: -0.10 }, { x: -0.72, z: -0.16 }, { x: 0.72, z: -0.16 }
    ] },
    { id: "rounded", name: "Rounded", value: [
      ...ROUND_SWEEP_PROFILE
    ] }
  ],
  taperCurve: [
    { id: "anime-taper", name: "Anime Taper", value: DEFAULT_TAPER_CURVE },
    { id: "straight-cut", name: "Straight Cut", value: STRAIGHT_CUT_PANEL_CURVE },
    { id: "braid-placeholder", name: "Braid Placeholder", value: DEFAULT_BRAID_WIDTH_CURVE },
    { id: "uniform", name: "Uniform", value: [
      { position: 0, value: 1, interpolation: "linear" }, { position: 1, value: 1, interpolation: "linear" }
    ] },
    { id: "late-taper", name: "Late Taper", value: [
      { position: 0, value: 0.65, interpolation: "smooth" }, { position: 0.15, value: 1, interpolation: "smooth" },
      { position: 0.78, value: 0.95, interpolation: "smooth" }, { position: 1, value: 0, interpolation: "smooth" }
    ] },
    { id: "root-bulb", name: "Root Bulb", value: [
      { position: 0, value: 0.45, interpolation: "smooth" }, { position: 0.2, value: 1.15, interpolation: "smooth" },
      { position: 0.72, value: 0.8, interpolation: "smooth" }, { position: 1, value: 0, interpolation: "smooth" }
    ] }
  ],
  depthCurve: [
    { id: "soft-depth", name: "Soft Depth", value: DEFAULT_DEPTH_CURVE },
    { id: "braid-placeholder", name: "Braid Placeholder", value: DEFAULT_BRAID_DEPTH_CURVE },
    { id: "uniform", name: "Uniform", value: [
      { position: 0, value: 0.55, interpolation: "linear" }, { position: 1, value: 0.55, interpolation: "linear" }
    ] },
    { id: "flat", name: "Flat", value: [
      { position: 0, value: 0.12, interpolation: "linear" }, { position: 1, value: 0.05, interpolation: "linear" }
    ] },
    { id: "rounded", name: "Rounded", value: [
      { position: 0, value: 0.25, interpolation: "smooth" }, { position: 0.35, value: 0.8, interpolation: "smooth" },
      { position: 0.72, value: 0.55, interpolation: "smooth" }, { position: 1, value: 0, interpolation: "smooth" }
    ] }
  ]
};
const strandGroupDefaults = Object.fromEntries(STRAND_GROUPS.map((group) => [group.id, {
  taperCurve: DEFAULT_TAPER_CURVE.map((point) => ({ ...point })),
  taperCurveSecondary: DEFAULT_TAPER_CURVE.map((point) => ({ ...point })),
  depthCurve: DEFAULT_DEPTH_CURVE.map((point) => ({ ...point })),
  depthCurveSecondary: DEFAULT_DEPTH_CURVE.map((point) => ({ ...point })),
  asymmetricWidthCurve: false,
  asymmetricDepthCurve: false,
  centerAsymmetricProfile: false,
  lengthScale: 1,
  widthScale: 1,
  depthScale: 1,
  profileTrimLeft: 0,
  profileTrimRight: 0,
  profileTrimRoundness: 1,
  profileOffset: 0,
  rootScalpOffset: 0,
  radialSegments: 10,
  lengthSegments: 26,
  dynamicDensity: false,
  densityAggression: 0.5,
  twistDensity: 0.5,
  layerOffsets: { ...DEFAULT_LAYER_OFFSETS },
  sweepProfile: DEFAULT_SWEEP_PROFILE.map((point) => ({ ...point }))
}]));
const strandCreationDefaults = {
  width: 0.16,
  depth: 0.24,
  hairCard: false,
  profileTrimLeft: 0,
  profileTrimRight: 0,
  profileTrimRoundness: 1,
  strandSplitEnabled: false,
  strandSplitPosition: 0,
  strandSplitHeight: 0.3,
  strandTipStart: 0.75,
  curlCount: 4,
  curlDisplacement: 0.18,
  taperCurve: DEFAULT_TAPER_CURVE.map((point) => ({ ...point })),
  taperCurveSecondary: DEFAULT_TAPER_CURVE.map((point) => ({ ...point })),
  depthCurve: DEFAULT_DEPTH_CURVE.map((point) => ({ ...point })),
  depthCurveSecondary: DEFAULT_DEPTH_CURVE.map((point) => ({ ...point })),
  asymmetricWidthCurve: false,
  asymmetricDepthCurve: false,
  centerAsymmetricProfile: false,
  widthScale: 1,
  depthScale: 1,
  profileOffset: 0,
  rootScalpOffset: 0,
  strandRotation: 0,
  twist: 0,
  twistCurve: DEFAULT_TWIST_CURVE.map((point) => ({ ...point })),
  dynamicDensity: false,
  densityAggression: 0.5,
  twistDensity: 0.5,
  hairLayer: DEFAULT_HAIR_LAYER,
  sweepProfile: DEFAULT_SWEEP_PROFILE.map((point) => ({ ...point }))
};
const braidCreationDefaults = {
  ...strandCreationDefaults,
  braidMeshPreset: DEFAULT_BRAID_MESH_PRESET,
  braidWidth: 0.34,
  braidDepth: 0.44,
  braidSegmentLength: 0.28,
  braidRotation: 0,
  taperCurve: DEFAULT_BRAID_WIDTH_CURVE.map((point) => ({ ...point })),
  taperCurveSecondary: DEFAULT_BRAID_WIDTH_CURVE.map((point) => ({ ...point })),
  depthCurve: DEFAULT_BRAID_DEPTH_CURVE.map((point) => ({ ...point })),
  depthCurveSecondary: DEFAULT_BRAID_DEPTH_CURVE.map((point) => ({ ...point })),
  sweepProfile: DEFAULT_SWEEP_PROFILE.map((point) => ({ ...point }))
};
const panelCreationDefaults = {
  ...strandCreationDefaults,
  width: 0.62,
  taperCurve: STRAIGHT_CUT_PANEL_CURVE.map((point) => ({ ...point })),
  taperCurveSecondary: STRAIGHT_CUT_PANEL_CURVE.map((point) => ({ ...point })),
  panelThickness: 0.08,
  panelLengthLoops: 10,
  panelWidthLoops: 6,
  panelCurvature: 0.18,
  panelLeftEdgeTrim: 0,
  panelRightEdgeTrim: 0,
  panelTipCurve: 0,
  panelTipLoops: 0,
  // Scalp Conform（0.2.138 绕竖直轴的 Bend，保弧长）：两个默认值**直接取自** curve-math.js
  // 的 PANEL_SCALP_CONFORM_DEFAULTS（唯一定义点），不抄写字面量。index.html 的 value= 是
  // 必须人工同步的第三处，有测试钉住三者一致。amount 0 ⇒ 输出与引入前逐位相同。
  // 0.2.138 删掉了 Range/Cylinder：Bend 下曲率插值处处光滑（不需要根部释放带），
  // 竖直弯曲轴又天然让长发直垂（不需要 Capsule 圆柱段）。
  panelScalpConformAmount: PANEL_SCALP_CONFORM_DEFAULTS.amount,
  panelScalpConformGap: PANEL_SCALP_CONFORM_DEFAULTS.gap,
  panelSplitEnabled: true,
  panelSplitSnapToLoops: true,
  panelSplitHeight: 0.3,
  panelSplits: [
    { position: -1 / 3, height: 0.3, order: 0 },
    { position: 1 / 3, height: 0.3, order: 1 }
  ],
  panelSplitGap: 0.07
};

function isPanelGeometry(target) {
  return ["panel", "surface"].includes(target?.geometryType);
}

function normalizePanelSplits(value, fallbackHeight = panelCreationDefaults?.panelSplitHeight ?? 0.28, maxCount = 23) {
  const fallback = [
    { position: -1 / 3, height: fallbackHeight },
    { position: 1 / 3, height: fallbackHeight }
  ];
  const source = Array.isArray(value) ? value : fallback;
  // 先按原始数组顺序建立条目，缺失的 order 用数组索引作为确定性回退，保证旧存档也能得到稳定 order
  const entries = source.slice(0, THREE.MathUtils.clamp(Math.round(maxCount), 0, 23)).map((split, index) => {
    const rawOrder = Number(split?.order);
    return {
      position: THREE.MathUtils.clamp(Number(split?.position ?? fallback[index % fallback.length].position), -0.88, 0.88),
      height: THREE.MathUtils.clamp(Number(split?.height ?? fallback[index % fallback.length].height), 0, 0.78),
      order: Number.isFinite(rawOrder) ? Math.round(rawOrder) : index,
      _index: index
    };
  });
  // order 必须唯一：若重复或缺失，按 (order, 原始索引) 排序后重新编号
  const orderValues = entries.map((entry) => entry.order);
  const hasDuplicate = new Set(orderValues).size !== orderValues.length;
  if (hasDuplicate) {
    entries
      .slice()
      .sort((a, b) => (a.order - b.order) || (a._index - b._index))
      .forEach((entry, reindex) => { entry.order = reindex; });
  }
  return entries
    .map((entry) => ({ position: entry.position, height: entry.height, order: entry.order }))
    .sort((a, b) => a.position - b.position);
}

function clonePanelSplits(value, fallbackHeight, maxCount = 23) {
  return normalizePanelSplits(value, fallbackHeight, maxCount).map((split) => ({ ...split }));
}

// 普通发丝多拉链上限：N 个拉链 → N+1 根管。UI/几何/骨骼共用同一上限。
const STRAND_SPLIT_MAX = 8;
// 普通发丝多拉链数据模型（Phase E：解除单条上限，默认到 STRAND_SPLIT_MAX）。
// value 为数组时归一化；否则以 legacy 标量回退成单条，保证旧存档迁移。
function normalizeStrandSplits(value, legacyPosition, legacyHeight, maxCount = STRAND_SPLIT_MAX) {
  const cap = THREE.MathUtils.clamp(Math.round(Number(maxCount ?? STRAND_SPLIT_MAX)), 0, 23);
  if (Array.isArray(value) && value.length) {
    // 先按原始顺序建立条目，缺失 order 用数组索引作为确定性回退
    const entries = value.map((split, index) => {
      const rawOrder = Number(split?.order);
      return {
        position: THREE.MathUtils.clamp(Number(split?.position ?? 0), -0.8, 0.8),
        height: THREE.MathUtils.clamp(Number(split?.height ?? 0.3), 0.02, 0.8),
        order: Number.isFinite(rawOrder) ? Math.round(rawOrder) : index,
        _index: index
      };
    });
    // order 必须唯一：重复或缺失时按 (order, 原始索引) 重新编号
    const orderValues = entries.map((entry) => entry.order);
    const hasDuplicate = new Set(orderValues).size !== orderValues.length;
    if (hasDuplicate) {
      entries
        .slice()
        .sort((a, b) => (a.order - b.order) || (a._index - b._index))
        .forEach((entry, reindex) => { entry.order = reindex; });
    }
    return entries
      .map((entry) => ({ position: entry.position, height: entry.height, order: entry.order }))
      .sort((a, b) => a.position - b.position)
      .slice(0, cap);
  }
  // 数组缺失：以 legacy 标量回退成单条（Phase A 单拉链）
  return [{
    position: THREE.MathUtils.clamp(Number(legacyPosition ?? 0), -0.8, 0.8),
    height: THREE.MathUtils.clamp(Number(legacyHeight ?? 0.3), 0.02, 0.8),
    order: 0
  }].slice(0, cap);
}

function cloneStrandSplits(value, legacyPosition, legacyHeight, maxCount = STRAND_SPLIT_MAX) {
  return normalizeStrandSplits(value, legacyPosition, legacyHeight, maxCount).map((split) => ({ ...split }));
}

// 将 strandSplits[0] 回写到 legacy 标量，保持标量作为单一真源
function syncStrandSplitLegacyFields(lock) {
  if (Array.isArray(lock.strandSplits) && lock.strandSplits.length) {
    lock.strandSplitPosition = lock.strandSplits[0].position;
    lock.strandSplitHeight = lock.strandSplits[0].height;
  }
}

function snapPanelSplitHeight(height, lengthLoops) {
  const loops = THREE.MathUtils.clamp(Math.round(Number(lengthLoops ?? 10)), 3, 32);
  const maximumLoop = Math.floor(0.78 * loops);
  return THREE.MathUtils.clamp(Math.round(Number(height ?? 0) * loops), 0, maximumLoop) / loops;
}
const CREATION_PRESET_STORAGE_KEY = "anime-hair-studio-creation-presets-v1";
const SHAPE_PRESET_STORAGE_KEY = "anime-hair-studio-shape-presets-v1";
const LEGACY_CLUMP_PRESET_STORAGE_KEY = "anime-hair-studio-clump-presets-v1";
const BRAID_TOOL_PRESETS = {
  classic: {
    braidMeshPreset: DEFAULT_BRAID_MESH_PRESET,
    braidWidth: 0.34,
    braidDepth: 0.44,
    braidSegmentLength: 0.28,
    braidRotation: 0,
    taperCurve: DEFAULT_BRAID_WIDTH_CURVE,
    depthCurve: DEFAULT_BRAID_DEPTH_CURVE,
    sweepProfile: DEFAULT_SWEEP_PROFILE
  },
  "chain-links": {
    braidMeshPreset: "chain-links",
    braidWidth: 0.12,
    braidDepth: 0.65,
    braidSegmentLength: 0.28,
    braidRotation: 0,
    taperCurve: SHAPE_PRESETS.taperCurve.find((preset) => preset.id === "uniform").value,
    depthCurve: [
      { position: 0, value: 1, interpolation: "linear" },
      { position: 1, value: 1, interpolation: "linear" }
    ],
    sweepProfile: SHAPE_PRESETS.sweepProfile.find((preset) => preset.id === "flat-ribbon").value
  }
};
const SCALP_SEGMENTS = 18;

function createQuadSphereGeometry(segments = 18) {
  const positions = [];
  const indices = [];
  const quads = [];
  const vertexMap = new Map();
  const edgeMap = new Map();
  const faces = [
    { name: "right", normal: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
    { name: "left", normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
    { name: "top", normal: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
    { name: "front", normal: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
    { name: "back", normal: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] }
  ];

  function vertexIndex(face, column, row) {
    const s = -segments + column * 2;
    const t = -segments + row * 2;
    const cube = face.normal.map((value, axis) => value * segments + face.u[axis] * s + face.v[axis] * t);
    const key = cube.join(",");
    if (vertexMap.has(key)) return vertexMap.get(key);
    const x = cube[0] / segments;
    const y = cube[1] / segments;
    const z = cube[2] / segments;
    const sphereX = x * Math.sqrt(Math.max(0, 1 - y * y * 0.5 - z * z * 0.5 + y * y * z * z / 3));
    const sphereY = y * Math.sqrt(Math.max(0, 1 - z * z * 0.5 - x * x * 0.5 + z * z * x * x / 3));
    const sphereZ = z * Math.sqrt(Math.max(0, 1 - x * x * 0.5 - y * y * 0.5 + x * x * y * y / 3));
    const index = positions.length / 3;
    positions.push(sphereX, sphereY, sphereZ);
    vertexMap.set(key, index);
    return index;
  }

  function addEdge(a, b) {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (!edgeMap.has(key)) edgeMap.set(key, [a, b]);
  }

  faces.forEach((face) => {
    for (let row = 0; row < segments; row += 1) {
      for (let column = 0; column < segments; column += 1) {
        const a = vertexIndex(face, column, row);
        const b = vertexIndex(face, column + 1, row);
        const c = vertexIndex(face, column + 1, row + 1);
        const d = vertexIndex(face, column, row + 1);
        indices.push(a, b, c, a, c, d);
        quads.push({ id: quads.length, face: face.name, row, column, vertices: [a, b, c, d] });
        addEdge(a, b);
        addEdge(b, c);
        addEdge(c, d);
        addEdge(d, a);
      }
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const baseColor = new THREE.Color(0x38d9e6);
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(Array.from({ length: subdivided.points.length }, () => baseColor.toArray()).flat(), 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return { geometry, quadEdges: [...edgeMap.values()], quads };
}


const scalpState = createScalpStore();
const scalpBuilderDeps = {
  // Early deps available before the first module-eval scalp call (L1467):
  CONTROL_POINT_SELECTED_COLOR, SCALP_SEGMENTS, camera, curveGroup, guideSurfaceGroup, hairGroup,
  renderer, scalpState: scalpState.state, sculptState: sculptState.state, strandGroupDefaults,
  transformControls
};
// Remaining deps are filled in-place before the early module-eval calls and in one batch
// after the last dep is defined (advancedLatticeButton).
const scalpBuilder = createScalpBuilderApi(scalpBuilderDeps);
try {
  scalpState.state.defaultScalpGeometryData = await scalpBuilder.createAuthoredScalpGeometry();
} catch (error) {
  console.error("Could not initialize the authored scalp guide; using the legacy guide", error);
  scalpState.state.defaultScalpGeometryData = createQuadSphereGeometry(SCALP_SEGMENTS);
}

const scalpSurfaceGroup = new THREE.Group();
const {
  geometry: scalpSurfaceGeometry,
  quadEdges: initialScalpQuadEdges,
  quads: scalpQuads
} = scalpState.state.defaultScalpGeometryData;
scalpState.state.scalpQuadEdges = initialScalpQuadEdges;
scalpState.state.scalpActiveVertexIndices = [...Array(scalpSurfaceGeometry.getAttribute("position").count).keys()];


scalpBuilderDeps.scalpQuads = scalpQuads;
scalpBuilderDeps.scalpSurfaceGeometry = scalpSurfaceGeometry;
scalpState.state.scalpRegionAssignments = scalpBuilder.buildDefaultScalpRegionAssignments(5);
scalpState.state.scalpVisibleQuads = [...scalpQuads];
const scalpRenderGeometry = new THREE.BufferGeometry();



scalpBuilderDeps.scalpRenderGeometry = scalpRenderGeometry;
scalpBuilder.updateScalpRenderGeometry();
const scalpSurfaceMesh = new THREE.Mesh(
  scalpRenderGeometry,
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
const scalpSurfaceWire = new THREE.LineSegments(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0x62f3ff,
    transparent: true,
    opacity: 0.14,
    depthWrite: false
  })
);
const scalpSelectionOutline = scalpBuilder.createScalpSelectionOutline(scalpRenderGeometry);













scalpBuilderDeps.scalpSurfaceWire = scalpSurfaceWire;
scalpBuilder.updateScalpQuadWire();
scalpSurfaceMesh.renderOrder = 1;
scalpSurfaceWire.renderOrder = 2;
scalpSurfaceGroup.add(scalpSurfaceMesh, scalpSurfaceWire, scalpSelectionOutline);
scalpSurfaceGroup.visible = false;
scene.add(scalpSurfaceGroup);
const scalpBrushCursor = new THREE.Mesh(
  new THREE.RingGeometry(0.91, 1, 48),
  new THREE.MeshBasicMaterial({ color: SCALP_REGIONS.bangs.color, transparent: true, opacity: 0.9, depthTest: false, side: THREE.DoubleSide })
);
scalpBrushCursor.visible = false;
scalpBrushCursor.renderOrder = 9;
scene.add(scalpBrushCursor);
const scalpBuilderGroup = new THREE.Group();
scalpBuilderGroup.visible = false;
scalpBuilderGroup.renderOrder = 14;
scene.add(scalpBuilderGroup);

// Guide / curve system api (refactor 3d batch 5): deps filled in-place before boot-time guide calls
// and in one batch after the last dep is defined.
const guideDeps = {};
const guideApi = createGuideSystemApi(guideDeps);

// Curve Surface / Surface Lattice create api (refactor 3d batch G4): deps filled in-place before boot-time
// calls and in one batch after the last dep is defined.
const curveSurfaceCreateDeps = {};
const curveSurfaceCreate = createCurveSurfaceCreateApi(curveSurfaceCreateDeps);

// Draw / creation flow api (refactor batch B2-1): deps filled in one batch after the
// boneInteractionDeps block (all const/let deps defined) and before the preset-library boot;
// no boot-time draw-flow calls before the batch.
const drawFlowDeps = {};
const drawFlowApi = createDrawFlowApi(drawFlowDeps);
// Placement flow api (refactor batch B2-2): deps filled in one batch after the drawFlowDeps
// block (all const/let deps defined) and before the preset-library boot; no boot-time
// placement calls before the batch.
const placementDeps = {};
const placementApi = createPlacementApi(placementDeps);

// Procedural duplicate api (refactor batch B6b / plan A3): deps filled in one batch after the
// placementDeps block (all const/let deps defined); no boot-time calls before the batch.
const proceduralDuplicateDeps = {};
const proceduralDuplicateApi = createProceduralDuplicateApi(proceduralDuplicateDeps);

// Clump / procedural api (refactor batch B6a / plan B6): deps filled in one batch after the
// proceduralDuplicateDeps block (all const/let deps defined); no boot-time calls before the
// batch.
const clumpProceduralDeps = {};
const clumpProceduralApi = createClumpProceduralApi(clumpProceduralDeps);

// Radial menu api (refactor batch A2): deps filled in one batch after the
// referenceHeadApi block (all const/let deps defined); no boot-time calls before
// the batch.
const radialMenuDeps = {};
const radialMenuApi = createRadialMenuApi(radialMenuDeps);

// Poly topology editing api (refactor 3d batch G7): deps filled in one batch after the last dep is
// defined; no boot-time calls before the batch.
const polyToolsDeps = {};

// Taper curve editor api (refactor 3d batch G5): deps filled in one batch after the last dep is
// defined (after createShapePresetsApi); no boot-time calls before the batch.
const taperEditorDeps = {};
const taperEditor = createTaperEditorApi(taperEditorDeps);
const polyToolsApi = createPolyToolsApi(polyToolsDeps);
// Panel/tip strand geometry api (refactor 3d batch G1): deps filled in one batch after the last
// dep (outwardNormalAtPoint) is defined; no boot-time calls before the batch.
const panelTipStrandDeps = {};
const panelTipStrand = createPanelTipStrandApi(panelTipStrandDeps);
// Strand geometry api (refactor 3d batches G2+G3): deps filled in one batch after the last
// dep (outwardNormalAtPoint) is defined; created early so the G4 curveSurfaceCreateDeps wiring
// (createHairGeometry) below can reference strandGeometryApi without a TDZ issue.
const strandGeometryDeps = {};
const strandGeometryApi = createStrandGeometryApi(strandGeometryDeps);
// Sculpt brush geometry api (refactor 3d batch G6): deps filled in one batch after the G4
// curveSurfaceCreateDeps batch (all deps defined); created early so boot-time wiring
// (restoreRefreshes/guideDeps) can reference sculptGeom without a TDZ issue.
const sculptGeomDeps = {};
const sculptGeom = createSculptGeometryApi(sculptGeomDeps);
// Preset library api (refactor batch B3): deps filled in one batch before creationPresets
// assembly; shapePresets/taperEditor/creationPresets deps are filled in-place (mutable deps
// object) to break the preset-library <-> shape/creation-presets assembly cycle.
const presetLibraryDeps = {};
const presetLibraryApi = createPresetLibraryApi(presetLibraryDeps);

// Segment control / bone interaction api (refactor bones B1+B2): deps filled in one batch after
// the taperEditorDeps batch (all deps incl. shapePresets defined); no boot-time calls before the
// batch.
const segmentControlDeps = {};
const segmentApi = createSegmentControlApi(segmentControlDeps);
const boneInteractionDeps = {};
const bonesApi = createBoneInteractionApi(boneInteractionDeps);
// Bone view handle api (refactor bones B3): deps filled in one batch after the
// strandGeometryDeps batch (all deps defined); no boot-time calls before the batch.
const boneViewHandlesDeps = {};
const boneViewHandles = createBoneViewHandlesApi(boneViewHandlesDeps);
const scalpBuilderTemplateOverlay = new THREE.Group();
scalpBuilderTemplateOverlay.visible = false;
scene.add(scalpBuilderTemplateOverlay);
const drawStrandBrushCursor = new THREE.Mesh(
  new THREE.RingGeometry(0.91, 1, 48),
  new THREE.MeshBasicMaterial({
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.72,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  })
);
drawStrandBrushCursor.visible = false;
drawStrandBrushCursor.renderOrder = 12;
scene.add(drawStrandBrushCursor);

function setDrawStrandBrushCursorScale(scale) {
  const cursorScale = Math.max(0.04, Number(scale) || 0.04);
  const ringThickness = THREE.MathUtils.clamp(0.09 / Math.sqrt(cursorScale), 0.05, 0.24);
  if (Math.abs((drawStrandBrushCursor.userData.ringThickness ?? 0.09) - ringThickness) > 0.0001) {
    const previousGeometry = drawStrandBrushCursor.geometry;
    drawStrandBrushCursor.geometry = new THREE.RingGeometry(1 - ringThickness, 1, 48);
    drawStrandBrushCursor.userData.ringThickness = ringThickness;
    previousGeometry.dispose();
  }
  drawStrandBrushCursor.scale.setScalar(cursorScale);
}

const drawStrandPreview = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
    depthWrite: false
  })
);
drawStrandPreview.visible = false;
drawStrandPreview.renderOrder = 12;
scene.add(drawStrandPreview);
const drawStrandMirrorPreview = drawStrandPreview.clone();
drawStrandMirrorPreview.geometry = new THREE.BufferGeometry();
drawStrandMirrorPreview.material = drawStrandPreview.material.clone();
drawStrandMirrorPreview.visible = false;
scene.add(drawStrandMirrorPreview);
const proceduralDuplicateArcPreview = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false
  })
);
proceduralDuplicateArcPreview.visible = false;
proceduralDuplicateArcPreview.renderOrder = 40;
const proceduralDuplicateCirclePreview = new THREE.LineLoop(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0xff5bca,
    transparent: true,
    opacity: 0.48,
    depthTest: false,
    depthWrite: false
  })
);
proceduralDuplicateCirclePreview.visible = false;
proceduralDuplicateCirclePreview.renderOrder = 39;
const proceduralDuplicateArcMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.035, 16, 12),
  new THREE.MeshBasicMaterial({
    color: 0xffa24f,
    transparent: true,
    opacity: 0.98,
    depthTest: false,
    depthWrite: false
  })
);
proceduralDuplicateArcMarker.visible = false;
proceduralDuplicateArcMarker.renderOrder = 41;
scene.add(proceduralDuplicateCirclePreview, proceduralDuplicateArcPreview, proceduralDuplicateArcMarker);
const loftHorizontalPreview = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0xff5bca,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false
  })
);
loftHorizontalPreview.visible = false;
loftHorizontalPreview.renderOrder = 13;
scene.add(loftHorizontalPreview);
const loftVerticalPreview = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false
  })
);
loftVerticalPreview.visible = false;
loftVerticalPreview.renderOrder = 13;
scene.add(loftVerticalPreview);
const loftSurfaceGridPreview = new THREE.LineSegments(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0xf7a5df,
    transparent: true,
    opacity: 0.74,
    depthTest: false,
    depthWrite: false
  })
);
loftSurfaceGridPreview.visible = false;
loftSurfaceGridPreview.renderOrder = 12;
scene.add(loftSurfaceGridPreview);
const capsuleGuideDrawPreview = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false
  })
);
capsuleGuideDrawPreview.visible = false;
capsuleGuideDrawPreview.renderOrder = 14;
scene.add(capsuleGuideDrawPreview);
const curveSurfaceDraftGroup = new THREE.Group();
curveSurfaceDraftGroup.visible = false;
curveSurfaceDraftGroup.renderOrder = 14;
scene.add(curveSurfaceDraftGroup);
const curveSurfaceDraftMesh = new THREE.Mesh(
  new THREE.BufferGeometry(),
  new THREE.MeshPhysicalMaterial({
    color: DEFAULT_HAIR_COLOR,
    roughness: DEFAULT_HAIR_MATERIAL_SETTINGS.roughness,
    metalness: 0,
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    side: THREE.DoubleSide,
    depthWrite: false
  })
);
curveSurfaceDraftMesh.visible = false;
curveSurfaceDraftMesh.renderOrder = 11;
scene.add(curveSurfaceDraftMesh);
const drawStrandVolumePreview = new THREE.Mesh(
  new THREE.BufferGeometry(),
  new THREE.MeshPhysicalMaterial({
    color: DEFAULT_HAIR_COLOR,
    roughness: DEFAULT_HAIR_MATERIAL_SETTINGS.roughness,
    metalness: 0,
    anisotropy: 1,
    anisotropyRotation: Math.PI / 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    depthTest: true,
    depthWrite: false,
    side: THREE.FrontSide
  })
);
drawStrandVolumePreview.visible = false;
drawStrandVolumePreview.renderOrder = 11;
scene.add(drawStrandVolumePreview);
const drawStrandMirrorVolumePreview = drawStrandVolumePreview.clone();
drawStrandMirrorVolumePreview.geometry = new THREE.BufferGeometry();
drawStrandMirrorVolumePreview.material = drawStrandVolumePreview.material.clone();
drawStrandMirrorVolumePreview.visible = false;
scene.add(drawStrandMirrorVolumePreview);
const maxDrawClumpAccessoryCount = Math.max(...Object.values(DRAW_CLUMP_TEMPLATES).map((template) => template.strands.length - 1));
const drawStrandClumpVolumePreviews = Array.from({ length: maxDrawClumpAccessoryCount }, () => {
  const mesh = drawStrandVolumePreview.clone();
  mesh.geometry = new THREE.BufferGeometry();
  mesh.material = drawStrandVolumePreview.material.clone();
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
});
const drawStrandClumpMirrorPreviews = Array.from({ length: maxDrawClumpAccessoryCount }, () => {
  const mesh = drawStrandVolumePreview.clone();
  mesh.geometry = new THREE.BufferGeometry();
  mesh.material = drawStrandVolumePreview.material.clone();
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
});
function ensureDrawClumpPreviewCount(count) {
  while (drawStrandClumpVolumePreviews.length < count) {
    const preview = drawStrandVolumePreview.clone();
    preview.geometry = new THREE.BufferGeometry();
    preview.material = drawStrandVolumePreview.material.clone();
    preview.visible = false;
    scene.add(preview);
    drawStrandClumpVolumePreviews.push(preview);

    const mirrorPreview = drawStrandVolumePreview.clone();
    mirrorPreview.geometry = new THREE.BufferGeometry();
    mirrorPreview.material = drawStrandVolumePreview.material.clone();
    mirrorPreview.visible = false;
    scene.add(mirrorPreview);
    drawStrandClumpMirrorPreviews.push(mirrorPreview);
  }
}
const scalpLatticeGroup = new THREE.Group();
const scalpLatticeLine = new THREE.LineSegments(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({ color: 0x53f1ff, transparent: true, opacity: 0.48, depthTest: false })
);
scalpLatticeLine.renderOrder = 7;
scalpLatticeGroup.add(scalpLatticeLine);
scalpLatticeGroup.visible = false;
scene.add(scalpLatticeGroup);
const scalpBasePositions = Float32Array.from(scalpSurfaceGeometry.getAttribute("position").array);
const scalpLatticePoints = [];
const scalpLatticeHandles = [];
const scalpLatticeConnections = [];
const raycaster = new THREE.Raycaster();
const polyRelaxProjectionRaycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.045;
const pointer = new THREE.Vector2();

const guideState = createGuideStore();
const headTransform = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  uniformScale: 1,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1
};
const scalpRoughScale = { x: 1, y: 1, z: 1 };
const scalpRoughScalePivot = new THREE.Vector3();
const braidMeshPresets = new Map();
const uvInspectorRecordCache = new WeakMap();
const visibleStrandRegions = new Set(STRAND_GROUPS.map((group) => group.id));
const visibleStrandLayers = new Set(HAIR_LAYERS.map((layer) => layer.id));
const GUIDE_VIEW_MODES = [
  { id: "all", label: "All Guides", scalp: true, capsules: true, lattices: true },
  { id: "hide-scalp", label: "Scalp Hidden", scalp: false, capsules: true, lattices: true },
  { id: "hide-capsules", label: "Capsules Hidden", scalp: true, capsules: false, lattices: true },
  { id: "hide-lattices", label: "Lattices Hidden", scalp: true, capsules: true, lattices: false },
  { id: "none", label: "All Hidden", scalp: false, capsules: false, lattices: false }
];
const miscState = createMiscStore();
const sel = createSelectionStore();
const windStore = createWindStore();


function currentStrandSelectionState() {
  return { activeId: sel.state.selectedId, selectedIds: [...sel.state.selectedStrandIds] };
}

function applyStrandSelectionState(selection) {
  sel.state.selectedId = selection?.activeId;
  sel.state.selectedStrandIds = new Set(selection?.selectedIds || []);
}

function clearStrandSelectionState() {
  applyStrandSelectionState(emptyStrandSelection());
}



const ref = createReferenceStore();

const pendingLockGeometryUpdates = new Set();
sculptState.state.objectSpaceEditing = readStoredBooleanPreference(window, TRANSFORM_SPACE_PREFERENCE_KEY, true);
const SCALP_REGION_CURVE_VISUALIZATION_ENABLED = false;
const SCALP_BUILDER_STEPS = [
  { phase: "Horizontal", phaseIndex: 1, phaseCount: 5, name: "Forehead Hairline", instruction: "Place the plane where it intersects the lowest point of the hairline on the forehead.", axis: "y", color: SCALP_REGIONS.bangs.color, ratio: 0.69 },
  { phase: "Horizontal", phaseIndex: 2, phaseCount: 5, name: "Bottom of Sideburns", instruction: "Place the plane where it intersects the bottom of the sideburns, typically around the middle of the ear.", axis: "y", color: SCALP_REGIONS["side-bangs-right"].color, ratio: 0.43 },
  { phase: "Horizontal", phaseIndex: 3, phaseCount: 5, name: "Top of Ear", instruction: "Place the plane where it intersects the highest point of the ear.", axis: "y", color: SCALP_REGIONS["side-right"].color, ratio: 0.53 },
  { phase: "Horizontal", phaseIndex: 4, phaseCount: 5, name: "Bottom of Side Hair", instruction: "Place the plane where it intersects the lowest point that the side-hair root area should reach, typically just below the ear.", axis: "y", color: SCALP_REGIONS["side-right"].color, ratio: 0.36 },
  { phase: "Horizontal", phaseIndex: 5, phaseCount: 5, name: "Back Hairline", instruction: "Place the plane where it intersects the lowest point of the hairline at the back of the head.", axis: "y", color: SCALP_REGIONS.back.color, ratio: 0.41 },
  { phase: "Vertical", phaseIndex: 1, phaseCount: 6, name: "Back of Front Bangs", instruction: "From the side, place the plane where the root area for the front bangs should end.", axis: "z", color: SCALP_REGIONS.bangs.color, ratio: 0.68 },
  { phase: "Vertical", phaseIndex: 2, phaseCount: 6, name: "Front of Sideburns", instruction: "Place the plane where the sideburn and side-bang root area should begin.", axis: "z", color: SCALP_REGIONS["side-bangs-right"].color, ratio: 0.59 },
  { phase: "Vertical", phaseIndex: 3, phaseCount: 6, name: "Middle of Ear", instruction: "Place the plane so it passes through the middle of the ear.", axis: "z", color: SCALP_REGIONS["side-bangs-right"].color, ratio: 0.51 },
  { phase: "Vertical", phaseIndex: 4, phaseCount: 6, name: "Back of Sideburns", instruction: "Place the plane where the sideburn and side-bang root area should end behind the ear.", axis: "z", color: SCALP_REGIONS["side-right"].color, ratio: 0.43 },
  { phase: "Vertical", phaseIndex: 5, phaseCount: 6, name: "Back of Ear", instruction: "Place the plane where it intersects the back edge of the ear to define the rear of the side-hair region.", axis: "z", color: SCALP_REGIONS["side-right"].color, ratio: 0.34 },
  { phase: "Vertical", phaseIndex: 6, phaseCount: 6, name: "Start of Back Hair", instruction: "Place the plane where the back hair region should begin behind the ear.", axis: "z", color: SCALP_REGIONS.back.color, ratio: 0.25 }
];
const scalpBuilderPlanePositions = new Array(SCALP_BUILDER_STEPS.length).fill(null);
const scalpBuilderContours = new Array(SCALP_BUILDER_STEPS.length).fill(null);





const draw = createDrawStore();
const branch = createBranchStore();
const ui = createUiStore();
const recovery = createRecoveryStore();
recovery.state.autosaveEnabled = readStoredBooleanPreference(window, AUTOSAVE_ENABLED_PREFERENCE_KEY, true);
recovery.state.autosaveIntervalSeconds = readStoredPreference(window, AUTOSAVE_INTERVAL_PREFERENCE_KEY, {
  fallback: DEFAULT_AUTOSAVE_INTERVAL_SECONDS,
  normalize: normalizeAutosaveInterval
});
viewportState.state.navigationTipsEnabled = readStoredBooleanPreference(window, NAVIGATION_TIPS_PREFERENCE_KEY, true);
viewportState.state.navigationStyle = readStoredPreference(window, NAVIGATION_STYLE_PREFERENCE_KEY, {
  fallback: "anime-hair-studio",
  normalize: normalizeNavigationStyle
});
viewportState.state.cameraSmoothingEnabled = readStoredBooleanPreference(window, CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY, false);
viewportState.state.cameraSmoothingStrength = readStoredPreference(window, CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY, {
  fallback: 0.5,
  normalize: normalizeCameraSmoothingStrength
});
miscState.state.toolTipsEnabled = readStoredBooleanPreference(window, TOOL_TIPS_PREFERENCE_KEY, true);
miscState.state.compactToolButtonsEnabled = readStoredBooleanPreference(window, COMPACT_TOOL_BUTTONS_PREFERENCE_KEY, false);
viewportState.state.viewportStatisticsEnabled = readStoredBooleanPreference(window, VIEWPORT_STATISTICS_PREFERENCE_KEY, true);
hairState.state.twistCurveAllStrandsPreviewEnabled = readStoredBooleanPreference(
  window,
  TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY,
  true
);
sel.state.layerColorShiftsEnabled = readStoredBooleanPreference(window, LAYER_COLOR_SHIFTS_PREFERENCE_KEY, true);
sel.state.outlinerFolderColorsEnabled = readStoredBooleanPreference(window, OUTLINER_FOLDER_COLORS_PREFERENCE_KEY, true);
miscState.state.sidePanelStyle = readStoredPreference(window, SIDE_PANEL_STYLE_PREFERENCE_KEY, {
  fallback: "default",
  normalize: normalizeSidePanelStyle
});
miscState.state.glassPanelColor = readStoredPreference(window, GLASS_PANEL_COLOR_PREFERENCE_KEY, {
  fallback: DEFAULT_GLASS_PANEL_COLOR,
  normalize: normalizeGlassPanelColor
});
if (miscState.state.glassPanelColor === LEGACY_DEFAULT_GLASS_PANEL_COLOR) {
  miscState.state.glassPanelColor = DEFAULT_GLASS_PANEL_COLOR;
}
miscState.state.outlinerFolderColorOpacity = readStoredPreference(window, OUTLINER_FOLDER_COLOR_OPACITY_PREFERENCE_KEY, {
  fallback: 100,
  normalize: normalizeOutlinerFolderColorOpacity
});
guideState.state.controlPointDisplaySize = readStoredPreference(window, CONTROL_POINT_DISPLAY_SIZE_PREFERENCE_KEY, {
  fallback: 1,
  normalize: normalizeControlPointDisplaySize
});
viewportState.state.viewportBackgroundColor = readStoredPreference(window, VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY, {
  fallback: DEFAULT_VIEWPORT_BACKGROUND_COLOR,
  normalize: normalizeViewportBackgroundColor
});
if (viewportState.state.viewportBackgroundColor === "#17151c") {
  viewportState.state.viewportBackgroundColor = DEFAULT_VIEWPORT_BACKGROUND_COLOR;
  writeStoredPreference(window, VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY, viewportState.state.viewportBackgroundColor);
}
miscState.state.sideNamingPerspective = readStoredPreference(window, SIDE_NAMING_PERSPECTIVE_PREFERENCE_KEY, {
  fallback: "viewport",
  normalize: normalizeSideNamingPerspective
});
// Branch root curvature compensation when dragging the root bone: 0 = rigid (no
// swing), 1 = fully follow the parent surface curve, default 0.5. The rigid swing
// is additionally capped at BRANCH_RIGID_SWING_LIMIT_DEG so the child never flips
// or wildly swings (the lateral surface normal can tilt ~90 deg at the edge).
const BRANCH_RIGID_SWING_LIMIT_DEG = 60;
// How fast the region follows the root bone while dragging it in Hierarchy mode:
// lateral (left-right / v) defaults to 0.45x, along-length (up-down / u) to 1.0x.
miscState.state.lastHorizontalViewAxis = new THREE.Vector3(0, 0, 1);
const CARDINAL_VIEW_DRAG_STEP = 72;
const CARDINAL_VIEW_DRAG_GRACE = 48;
const taperMeshPointGeometry = new THREE.SphereGeometry(0.016, 12, 8);
const taperMeshPointMaterial = new THREE.MeshBasicMaterial({
  color: 0xe62bea,
  depthTest: false,
  depthWrite: false
});
const taperMeshPointSelectedMaterial = new THREE.MeshBasicMaterial({
  color: 0xe62bea,
  depthTest: false,
  depthWrite: false
});
const taperMeshPointCenterMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  depthTest: false,
  depthWrite: false
});
const twistMeshCurvePositiveMaterial = new THREE.LineBasicMaterial({
  color: 0x58f6ff,
  transparent: true,
  opacity: 0.9,
  depthTest: false,
  depthWrite: false
});
const twistMeshCurveNegativeMaterial = new THREE.LineBasicMaterial({
  color: 0xe62bea,
  transparent: true,
  opacity: 0.9,
  depthTest: false,
  depthWrite: false
});
const twistMeshCurvePositiveFillMaterial = new THREE.MeshBasicMaterial({
  color: 0x176873,
  transparent: true,
  opacity: 0.48,
  side: THREE.DoubleSide,
  depthTest: false,
  depthWrite: false
});
const twistMeshCurveNegativeFillMaterial = new THREE.MeshBasicMaterial({
  color: 0x701d62,
  transparent: true,
  opacity: 0.48,
  side: THREE.DoubleSide,
  depthTest: false,
  depthWrite: false
});
const taperMeshPointsGroup = new THREE.Group();
taperMeshPointsGroup.name = "Shape curve mesh points";
taperMeshPointsGroup.visible = false;
scene.add(taperMeshPointsGroup);
// Show points on mesh in the 3D viewport (branch region editor toggle, default ON).
const branchRegionMeshPointGeometry = new THREE.SphereGeometry(0.014, 10, 8);
const branchRegionMeshPointMaterial = new THREE.MeshBasicMaterial({
  color: 0x8fd8ff,
  depthTest: false,
  depthWrite: false
});
const branchRegionCenterMeshPointMaterial = new THREE.MeshBasicMaterial({
  color: 0xff9a3c,
  depthTest: false,
  depthWrite: false
});
const branchRegionMeshPointsGroup = new THREE.Group();
branchRegionMeshPointsGroup.name = "Branch root region mesh points";
branchRegionMeshPointsGroup.visible = false;
scene.add(branchRegionMeshPointsGroup);
const lastPointer = { x: 0, y: 0 };

const locks = [];
const selectionSets = [];
const guides = [];
const referenceImages = [];
const DEFAULT_CAPSULE_GUIDE_COLOR = "#70b6bd";
const surfaceGuideDefaults = {
  radius: 0.34,
  length: 1.7,
  radialLoops: 8,
  lengthLoops: 8,
  subdivisionSteps: 2,
  opacity: 0.24,
  fresnel: true,
  centerVisibility: 0.5
};
const capsuleGuideDrawDefaults = {
  curveStep: 0.18,
  profile: [
    { t: 0, value: 1 },
    { t: 0.5, value: 0.75 },
    { t: 1, value: 0.12 }
  ]
};
const undoHistory = new BoundedHistory(60);
const redoHistory = new BoundedHistory(60);
const restoreRefreshes = new RestoreRefreshRegistry()
  .register("counts", updateCount)
  .register("placement-status", placementApi.updatePlacementStatus)
  .register("display-visibility", applyDisplayVisibilityFilters)
  .register("sculpt-brush-debug", sculptGeom.refreshSculptBrushDebugAfterStateRestore)
  .register("curve-editors", taperEditor.refreshTaperCurveEditorAfterStateRestore);
const strandGroupOpen = new Map(STRAND_GROUPS.map((group) => [group.id, true]));
const strandLayerOpen = new Map();
const referenceGroupOpen = new Map(["overlay", "front", "back", "left", "right"].map((id) => [id, true]));
const clumpOpen = new Map();
const curveSurfaceOpen = new Map();
const undo = createUndoStore();
const inputs = {
  name: document.querySelector("#lockName"),
  widthScale: document.querySelector("#widthScale"),
  depthScale: document.querySelector("#depthScale"),
  profileOffset: document.querySelector("#profileOffset"),
  rootScalpOffset: document.querySelector("#rootScalpOffset"),
  strandRotation: document.querySelector("#strandRotation"),
  twist: document.querySelector("#twist"),
  compoundBridgeLoops: document.querySelector("#compoundBridgeLoops"),
  compoundBridgeSmoothing: document.querySelector("#compoundBridgeSmoothing"),
  radialSegments: document.querySelector("#strandRadialSegments"),
  lengthSegments: document.querySelector("#strandLengthSegments"),
  densityAggression: document.querySelector("#strandDensityAggression"),
  twistDensity: document.querySelector("#strandTwistDensity")
};
const strandLayerInput = document.querySelector("#strandLayer");
const strandLayerControl = document.querySelector("#strandLayerControl");
const strandDynamicDensityInput = document.querySelector("#strandDynamicDensity");
const hairCardInput = document.querySelector("#hairCard");
const hairCardControl = document.querySelector("#hairCardControl");
const hairCardIncompatibleControls = [
  "#strandSplitControls"
].map((selector) => document.querySelector(selector));
const mirrorXToggle = document.querySelector("#mirrorXToggle");
const twistNumberInput = document.querySelector("#twistNumber");
const strandRotationValue = document.querySelector("#strandRotationValue");
const hairMaterialSelect = document.querySelector("#hairMaterialSelect");
const newHairMaterialButton = document.querySelector("#newHairMaterial");
const addProjectHairMaterialButton = document.querySelector("#addProjectHairMaterial");
const hairMaterialOutliner = document.querySelector("#hairMaterialOutliner");
const deleteProjectHairMaterialButton = document.querySelector("#deleteProjectHairMaterial");
const hairMaterialNameInput = document.querySelector("#hairMaterialName");
const hairMaterialShaderInput = document.querySelector("#hairMaterialShader");
const hairMaterialStandardControls = document.querySelector("#hairMaterialStandardControls");
const hairMaterialAnimeControls = document.querySelector("#hairMaterialAnimeControls");
const hairMaterialColorInput = document.querySelector("#hairMaterialColor");
const hairMaterialRoughnessControl = document.querySelector("#hairMaterialRoughnessControl");
const hairMaterialRoughnessInput = document.querySelector("#hairMaterialRoughness");
const hairMaterialRoughnessValue = document.querySelector("#hairMaterialRoughnessValue");
const hairMaterialAnimeColorInputs = {
  animeBaseColor: document.querySelector("#hairMaterialAnimeBaseColor"),
  animeShadowColor: document.querySelector("#hairMaterialAnimeShadowColor"),
  animeSoftShadowColor: document.querySelector("#hairMaterialAnimeSoftShadowColor"),
  animeHighlightColor: document.querySelector("#hairMaterialAnimeHighlightColor"),
  animeRimColor: document.querySelector("#hairMaterialAnimeRimColor")
};
const hairMaterialAnimeNumericControls = Object.fromEntries(
  Object.keys(ANIME_ANISOTROPIC_NUMERIC_FIELDS).map((key) => {
    const suffix = key.slice("anime".length);
    return [key, {
      input: document.querySelector(`#hairMaterialAnime${suffix}`),
      output: document.querySelector(`#hairMaterialAnime${suffix}Value`)
    }];
  })
);
const hairMaterialPresetInput = document.querySelector("#hairMaterialPreset");
const saveHairMaterialPresetButton = document.querySelector("#saveHairMaterialPreset");
const removeHairMaterialPresetButton = document.querySelector("#removeHairMaterialPreset");
const hairMaterialGradientEnabledInput = document.querySelector("#hairMaterialGradientEnabled");
const editHairMaterialGradientButton = document.querySelector("#editHairMaterialGradient");
const hairMaterialGradientPreview = document.querySelector("#hairMaterialGradientPreview");
const hairMaterialGradientDialog = document.querySelector("#hairMaterialGradientDialog");
const closeHairMaterialGradientDialogButton = document.querySelector("#closeHairMaterialGradientDialog");
const doneHairMaterialGradientButton = document.querySelector("#doneHairMaterialGradient");
const hairMaterialGradientTrack = document.querySelector("#hairMaterialGradientTrack");
const hairMaterialGradientStopColorInput = document.querySelector("#hairMaterialGradientStopColor");
const hairMaterialGradientStopPositionInput = document.querySelector("#hairMaterialGradientStopPosition");
const hairMaterialGradientStopPositionValue = document.querySelector("#hairMaterialGradientStopPositionValue");
const addHairMaterialGradientStopButton = document.querySelector("#addHairMaterialGradientStop");
const deleteHairMaterialGradientStopButton = document.querySelector("#deleteHairMaterialGradientStop");
const resetHairMaterialGradientButton = document.querySelector("#resetHairMaterialGradient");
const guideInputs = {
  x: document.querySelector("#guideX"),
  y: document.querySelector("#guideY"),
  z: document.querySelector("#guideZ"),
  width: document.querySelector("#guideWidth"),
  height: document.querySelector("#guideHeight"),
  depth: document.querySelector("#guideDepth"),
  bend: document.querySelector("#guideBend"),
  verticalBend: document.querySelector("#guideVerticalBend"),
  topCurve: document.querySelector("#guideTopCurve"),
  bottomCurve: document.querySelector("#guideBottomCurve"),
  density: document.querySelector("#guideDensity"),
  opacity: document.querySelector("#guideOpacity")
};
const guideControls = [...document.querySelectorAll(".guide-controls")];
const toolButtons = [...document.querySelectorAll(".tool-button")];
const spaceToggle = document.querySelector("#spaceToggle");
const hierarchyToggle = document.querySelector("#hierarchyToggle");
const proportionalToggle = document.querySelector("#proportionalToggle");
const appMenuTriggers = [...document.querySelectorAll(".app-menu-trigger")];
const appMenuDropdowns = [...document.querySelectorAll(".app-menu-dropdown")];
const toggleTurntableButton = document.querySelector("#toggleTurntable");
const turntableMenuState = document.querySelector("#turntableMenuState");
const turntablePanel = document.querySelector("#turntablePanel");
const turntableSpeedInput = document.querySelector("#turntableSpeed");
const turntableSpeedValue = document.querySelector("#turntableSpeedValue");
// Wind preview DOM (built by the parallel index.html work; queried defensively — every
// element may be null until merge). #toggleWindPreview is a plain menu button that opens
// the floating #windPreviewWindow dialog; the enable toggle lives inside the window.
const toggleWindPreviewButton = document.querySelector("#toggleWindPreview");
const windPreviewWindow = document.querySelector("#windPreviewWindow");
const windPreviewEnableButton = document.querySelector("#windPreviewEnableButton");
const windPreviewEnableState = document.querySelector("#windPreviewEnableState");
const windPreviewDragHandle = document.querySelector("#windPreviewDragHandle");
const windPlayPauseButton = document.querySelector("#windPlayPauseButton");
const windPreviewCloseButton = document.querySelector("#windPreviewCloseButton");
const windSliderDefs = [
  { key: "windDirection", id: "windDirection" },
  { key: "windStrength", id: "windStrength" },
  { key: "windFrequency", id: "windFrequency" },
  { key: "windTurbulence", id: "windTurbulence" },
  { key: "windTurbulenceScale", id: "windTurbulenceScale" },
  { key: "windGustStrength", id: "windGustStrength" },
  { key: "windGustFreq", id: "windGustFreq" },
  { key: "windRootExponent", id: "windRootExponent" },
  { key: "windStrandRandom", id: "windStrandRandom" },
  { key: "windSeed", id: "windSeed" }
];
const windSliders = windSliderDefs.map(({ key, id }) => ({
  key,
  input: document.querySelector(`#${id}Input`),
  value: document.querySelector(`#${id}InputValue`)
}));
const toggleUvCheckerButton = document.querySelector("#toggleUvChecker");
const uvCheckerMenuState = document.querySelector("#uvCheckerMenuState");
const uvInspectorWindow = document.querySelector("#uvInspectorWindow");
const uvInspectorCanvas = document.querySelector("#uvInspectorCanvas");
const uvInspectorStatus = document.querySelector("#uvInspectorStatus");
const uvInspectorDragHandle = document.querySelector("#uvInspectorDragHandle");
const closeUvInspectorButton = document.querySelector("#closeUvInspector");
const refreshUvCheckerButton = document.querySelector("#refreshUvChecker");
const viewportNavigationTips = document.querySelector("#viewportNavigationTips");
const navigationStyleTipRows = [...document.querySelectorAll("[data-navigation-style-tip]")];
const navigationStyleShortcutRows = [...document.querySelectorAll("[data-navigation-style-shortcut]")];
const languageSelect = document.querySelector("#languageSelect");
const appVersionLabel = document.querySelector("#appVersionLabel");
const openPreferencesButton = document.querySelector("#openPreferences");
const preferencesDialog = document.querySelector("#preferencesDialog");
const closePreferencesButton = document.querySelector("#closePreferences");
const cancelPreferencesButton = document.querySelector("#cancelPreferences");
const savePreferencesButton = document.querySelector("#savePreferences");
const preferencePageTitle = document.querySelector("#preferencePageTitle");
const preferenceCategoryButtons = [...document.querySelectorAll("[data-preference-category]")];
const preferenceCategoryGroups = [...document.querySelectorAll("[data-preference-category-group]")];
const preferenceAnchorButtons = [...document.querySelectorAll("[data-preference-anchor]")];
const preferencePanels = [...document.querySelectorAll("[data-preference-panel]")];
const radialMenusPreferenceInput = document.querySelector("#radialMenusPreference");
const proceduralDrawExperimentalPreferenceInput = document.querySelector("#proceduralDrawExperimentalPreference");
const multiCameraExperimentalPreferenceInput = document.querySelector("#multiCameraExperimentalPreference");
const navigationTipsPreferenceInput = document.querySelector("#navigationTipsPreference");
const navigationStylePreferenceInput = document.querySelector("#navigationStylePreference");
const cameraSmoothingPreferenceInput = document.querySelector("#cameraSmoothingPreference");
const cameraSmoothingStrengthPreferenceInput = document.querySelector("#cameraSmoothingStrengthPreference");
const toolTipsPreferenceInput = document.querySelector("#toolTipsPreference");
const compactToolButtonsPreferenceInput = document.querySelector("#compactToolButtonsPreference");
const viewportStatisticsPreferenceInput = document.querySelector("#viewportStatisticsPreference");
const twistCurvePreviewPreferenceButtons = [...document.querySelectorAll("[data-twist-curve-preview]")];
const layerColorShiftsPreferenceInput = document.querySelector("#layerColorShiftsPreference");
const outlinerFolderColorsPreferenceInput = document.querySelector("#outlinerFolderColorsPreference");
const sidePanelStylePreferenceInput = document.querySelector("#sidePanelStylePreference");
const glassPanelColorPreferenceInput = document.querySelector("#glassPanelColorPreference");
const glassPanelColorPreferenceValue = document.querySelector("#glassPanelColorPreferenceValue");
const resetGlassPanelColorButton = document.querySelector("#resetGlassPanelColor");
const outlinerFolderColorOpacityPreferenceInput = document.querySelector("#outlinerFolderColorOpacityPreference");
const outlinerFolderColorOpacityPreferenceNumberInput = outlinerFolderColorOpacityPreferenceInput
  .closest(".slider-input-row")
  ?.querySelector('input[type="number"]');
const sideNamingPerspectivePreferenceInput = document.querySelector("#sideNamingPerspectivePreference");
const controlPointDisplaySizePreferenceInput = document.querySelector("#controlPointDisplaySizePreference");
const controlPointDisplaySizePreferenceNumberInput = controlPointDisplaySizePreferenceInput
  .closest(".slider-input-row")
  ?.querySelector('input[type="number"]');
const viewportBackgroundColorPreferenceInput = document.querySelector("#viewportBackgroundColorPreference");
const viewportBackgroundColorPreferenceValue = document.querySelector("#viewportBackgroundColorPreferenceValue");
const resetViewportBackgroundColorButton = document.querySelector("#resetViewportBackgroundColor");
const defaultHairShaderPreferenceInput = document.querySelector("#defaultHairShaderPreference");
const loadPreferencesAndPresetsButton = document.querySelector("#loadPreferencesAndPresets");
const downloadPreferencesAndPresetsButton = document.querySelector("#downloadPreferencesAndPresets");
const preferencesAndPresetsFile = document.querySelector("#preferencesAndPresetsFile");
const preferencesBackupStatus = document.querySelector("#preferencesBackupStatus");
const autosavePreferenceInput = document.querySelector("#autosavePreference");
const autosaveIntervalPreferenceInput = document.querySelector("#autosaveIntervalPreference");
const recoveryDialog = document.querySelector("#recoveryDialog");
const recoveryProjectName = document.querySelector("#recoveryProjectName");
const recoveryProjectTime = document.querySelector("#recoveryProjectTime");
const recoveryStatus = document.querySelector("#recoveryStatus");
const discardRecoveryButton = document.querySelector("#discardRecovery");
const downloadRecoveryButton = document.querySelector("#downloadRecovery");
const recoverProjectButton = document.querySelector("#recoverProject");

// ---- Autosave / crash recovery scheduling (port of main 0.1.5) ----
// All autosave state lives in the recovery store; scheduling and recovery UI are wired here.
function cancelRecoverySchedule() {
  window.clearTimeout(recovery.state.recoveryQuietTimer);
  window.clearTimeout(recovery.state.recoveryMaximumTimer);
  recovery.state.recoveryQuietTimer = null;
  recovery.state.recoveryMaximumTimer = null;
  if (recovery.state.recoveryIdleHandle != null) {
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(recovery.state.recoveryIdleHandle);
    else window.clearTimeout(recovery.state.recoveryIdleHandle);
    recovery.state.recoveryIdleHandle = null;
  }
}

function recoveryWriteMustWait() {
  return undo.state.restoringHistory
    || projectState.state.projectSaveInProgress
    || !controls.enabled
    || Boolean(document.querySelector("dialog[open]"));
}

function scheduleRecoveryAutosave() {
  if (!recovery.state.autosaveEnabled || !recovery.state.recoveryDirty) return;
  window.clearTimeout(recovery.state.recoveryQuietTimer);
  recovery.state.recoveryQuietTimer = window.setTimeout(queueRecoveryAutosave, AUTOSAVE_QUIET_PERIOD_MS);
  if (recovery.state.recoveryMaximumTimer == null) {
    recovery.state.recoveryMaximumTimer = window.setTimeout(
      queueRecoveryAutosave,
      recovery.state.autosaveIntervalSeconds * 1000
    );
  }
}

function markProjectChangedForRecovery() {
  recovery.state.recoveryChangeVersion += 1;
  recovery.state.recoveryDirty = true;
  scheduleRecoveryAutosave();
}

function queueRecoveryAutosave() {
  window.clearTimeout(recovery.state.recoveryQuietTimer);
  window.clearTimeout(recovery.state.recoveryMaximumTimer);
  recovery.state.recoveryQuietTimer = null;
  recovery.state.recoveryMaximumTimer = null;
  if (!recovery.state.autosaveEnabled || !recovery.state.recoveryDirty) return;
  if (recoveryWriteMustWait()) {
    recovery.state.recoveryQuietTimer = window.setTimeout(queueRecoveryAutosave, 1000);
    return;
  }
  if (recovery.state.recoveryWriteInProgress) {
    recovery.state.recoveryWriteQueued = true;
    return;
  }
  const run = () => {
    recovery.state.recoveryIdleHandle = null;
    const writePromise = flushRecoveryAutosave();
    recovery.state.recoveryWritePromise = writePromise;
    writePromise.finally(() => {
      if (recovery.state.recoveryWritePromise === writePromise) recovery.state.recoveryWritePromise = null;
    });
  };
  recovery.state.recoveryIdleHandle = typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(run, { timeout: 2000 })
    : window.setTimeout(run, 0);
}

function buildRecoveryProjectContent() {
  return createHairProject({
    name: projectState.state.currentProjectName,
    state: snapshotState(),
    strandGroups: STRAND_GROUPS,
    headAsset: head.state.importedHeadAsset,
    headAssetOmitted: false,
    scalpGuideAsset: scalpState.state.importedScalpGuideAsset
  });
}

async function flushRecoveryAutosave() {
  if (!recovery.state.autosaveEnabled || !recovery.state.recoveryDirty) return;
  if (recoveryWriteMustWait()) {
    scheduleRecoveryAutosave();
    return;
  }
  const savedVersion = recovery.state.recoveryChangeVersion;
  recovery.state.recoveryWriteInProgress = true;
  recovery.state.recoveryWriteQueued = false;
  try {
    const content = `${JSON.stringify(buildRecoveryProjectContent())}\n`;
    await writeRecoverySnapshot(createRecoveryRecord({
      name: projectState.state.currentProjectName,
      content,
      appVersion: APP_VERSION
    }));
    if (savedVersion === recovery.state.recoveryChangeVersion) recovery.state.recoveryDirty = false;
  } catch (error) {
    console.warn("Could not save project recovery data", error);
  } finally {
    recovery.state.recoveryWriteInProgress = false;
    if (recovery.state.recoveryWriteQueued || recovery.state.recoveryDirty) scheduleRecoveryAutosave();
  }
}

async function clearAcknowledgedRecovery(savedVersion = recovery.state.recoveryChangeVersion) {
  if (savedVersion !== recovery.state.recoveryChangeVersion) return;
  cancelRecoverySchedule();
  if (recovery.state.recoveryWritePromise) await recovery.state.recoveryWritePromise;
  if (savedVersion !== recovery.state.recoveryChangeVersion) {
    scheduleRecoveryAutosave();
    return;
  }
  recovery.state.recoveryDirty = false;
  try {
    await clearRecoverySnapshot();
  } catch (error) {
    console.warn("Could not clear project recovery data", error);
  }
}

function setAutosaveEnabled(enabled, { persist = true } = {}) {
  recovery.state.autosaveEnabled = Boolean(enabled);
  autosavePreferenceInput.checked = recovery.state.autosaveEnabled;
  autosaveIntervalPreferenceInput.disabled = !recovery.state.autosaveEnabled;
  if (recovery.state.autosaveEnabled) scheduleRecoveryAutosave();
  else cancelRecoverySchedule();
  if (persist) saveBooleanPreference(AUTOSAVE_ENABLED_PREFERENCE_KEY, recovery.state.autosaveEnabled);
}

function setAutosaveInterval(value, { persist = true } = {}) {
  recovery.state.autosaveIntervalSeconds = normalizeAutosaveInterval(value);
  autosaveIntervalPreferenceInput.value = String(recovery.state.autosaveIntervalSeconds);
  if (recovery.state.autosaveEnabled && recovery.state.recoveryDirty) {
    cancelRecoverySchedule();
    scheduleRecoveryAutosave();
  }
  if (persist) writeStoredPreference(window, AUTOSAVE_INTERVAL_PREFERENCE_KEY, recovery.state.autosaveIntervalSeconds);
}

async function offerRecoverySnapshot() {
  try {
    const record = await readRecoverySnapshot();
    if (!record) return;
    recovery.state.pendingRecoveryRecord = record;
    recoveryProjectName.textContent = record.name;
    const timeLabel = document.createElement("span");
    timeLabel.textContent = "Last recovery: ";
    const timeValue = document.createElement("span");
    timeValue.textContent = new Date(record.updatedAt).toLocaleString();
    recoveryProjectTime.replaceChildren(timeLabel, timeValue);
    recoveryStatus.textContent = "";
    recoverProjectButton.disabled = false;
    try {
      validateHairProject(JSON.parse(record.content));
    } catch (error) {
      recoverProjectButton.disabled = true;
      recoveryStatus.textContent = "This recovery snapshot cannot be opened, but you can still download or discard it.";
    }
    recoveryDialog.showModal();
  } catch (error) {
    console.warn("Could not check project recovery data", error);
  }
}

async function recoverPendingProject() {
  const record = recovery.state.pendingRecoveryRecord;
  if (!record) return;
  recoveryStatus.textContent = "Recovering project...";
  [discardRecoveryButton, downloadRecoveryButton, recoverProjectButton].forEach((button) => {
    button.disabled = true;
  });
  const recovered = await ioApi.openHairProjectFile({
    name: `${record.name}.ahs`,
    text: async () => record.content
  });
  if (recovered) {
    cancelRecoverySchedule();
    recovery.state.recoveryDirty = false;
    recovery.state.pendingRecoveryRecord = null;
    recoveryDialog.close();
    return;
  }
  recoveryStatus.textContent = "The recovery snapshot could not be opened. You can download it or discard it.";
  [discardRecoveryButton, downloadRecoveryButton].forEach((button) => {
    button.disabled = false;
  });
}

async function discardPendingRecovery() {
  recoveryStatus.textContent = "Discarding recovery...";
  try {
    await clearRecoverySnapshot();
    recovery.state.pendingRecoveryRecord = null;
    recoveryDialog.close();
  } catch (error) {
    console.warn("Could not discard project recovery data", error);
    recoveryStatus.textContent = "The recovery snapshot could not be discarded.";
  }
}

function downloadPendingRecovery() {
  const record = recovery.state.pendingRecoveryRecord;
  if (!record) return;
  fileApi.downloadProjectFile(
    record.content,
    fileNameForAction(record.name, "project", "Recovered Hair Project")
  );
  recoveryStatus.textContent = "Recovery copy downloaded. You can still recover or discard the stored snapshot.";
}

const radialShortcutRows = [...document.querySelectorAll(".radial-shortcut-row")];
const openShortcutsButton = document.querySelector("#openShortcuts");
const shortcutsDialog = document.querySelector("#shortcutsDialog");
const closeShortcutsButton = document.querySelector("#closeShortcuts");
const dismissShortcutsButton = document.querySelector("#dismissShortcuts");
const openPatchNotesButton = document.querySelector("#openPatchNotes");
const patchNotesDialog = document.querySelector("#patchNotesDialog");
const patchNotesDialogTitle = document.querySelector("#patchNotesDialogTitle");
const patchNotesDialogSummary = document.querySelector("#patchNotesDialogSummary");
const patchNotesVersionButtons = [...document.querySelectorAll("[data-patch-notes-version]")];
const patchNotesPanels = [...document.querySelectorAll("[data-patch-notes-panel]")];
const closePatchNotesButton = document.querySelector("#closePatchNotes");
const dismissPatchNotesButton = document.querySelector("#dismissPatchNotes");
const joinDiscordButton = document.querySelector("#joinDiscord");
const scalpSetupToggle = document.querySelector("#scalpSetupToggle");
const scalpSetupMenu = document.querySelector("#scalpSetupMenu");
const scalpPaintToggle = document.querySelector("#scalpPaintToggle");
const headSetupMode = document.querySelector("#headSetupMode");
const scalpBuilderMode = document.querySelector("#scalpBuilderMode");
const drawCapsuleGuideMode = document.querySelector("#drawCapsuleGuideMode");
const capsuleGuideMode = document.querySelector("#capsuleGuideMode");
const curveLatticeGuideMode = document.querySelector("#curveLatticeGuideMode");
const viewportCapsuleGuideTool = document.querySelector("#viewportCapsuleGuideTool");
const viewportDrawCapsuleGuideTool = document.querySelector("#viewportDrawCapsuleGuideTool");
const viewportCurveLatticeGuideTool = document.querySelector("#viewportCurveLatticeGuideTool");
const createViewportReferenceMenu = document.querySelector("#createViewportReferenceMenu");
const createPlaneReferenceMenu = document.querySelector("#createPlaneReferenceMenu");
const strandOutlinerTab = document.querySelector("#strandOutlinerTab");
const guideOutlinerTab = document.querySelector("#guideOutlinerTab");
const referenceOutlinerTab = document.querySelector("#referenceOutlinerTab");
const lockList = document.querySelector("#lockList");
const guideOutliner = document.querySelector("#guideOutliner");
const referenceOutliner = document.querySelector("#referenceOutliner");
const referenceImageFile = document.querySelector("#referenceImageFile");
const viewportReferenceImages = document.querySelector("#viewportReferenceImages");
const referenceCropHandles = document.querySelector("#referenceCropHandles");
const referenceCropHandleElements = [...referenceCropHandles.querySelectorAll("[data-crop-anchor]")];
const referenceImagePanel = document.querySelector("#referenceImagePanel");
const viewportEditModeControl = document.querySelector("#viewportEditModeControl");
const viewportEditModeInput = document.querySelector("#viewportEditMode");
const viewportSelectionModeControl = document.querySelector("#viewportSelectionModeControl");
const viewportSelectionModeButtons = [...document.querySelectorAll("[data-selection-mode]")];
const closeReferenceImagePanel = document.querySelector("#closeReferenceImagePanel");
const addViewportReference = document.querySelector("#addViewportReference");
const addPlaneReference = document.querySelector("#addPlaneReference");
const referenceImageList = document.querySelector("#referenceImageList");
const referenceImageEmpty = document.querySelector("#referenceImageEmpty");
const referenceImageControls = document.querySelector("#referenceImageControls");
const referenceImageType = document.querySelector("#referenceImageType");
const referenceImageVisible = document.querySelector("#referenceImageVisible");
const referenceImageOpacity = document.querySelector("#referenceImageOpacity");
const referenceImageOpacityValue = document.querySelector("#referenceImageOpacityValue");
const referenceImageFlipX = document.querySelector("#referenceImageFlipX");
const resetReferenceImageCrop = document.querySelector("#resetReferenceImageCrop");
const referenceImageViewRow = document.querySelector("#referenceImageViewRow");
const referenceImageView = document.querySelector("#referenceImageView");
const referencePlaneInFrontRow = document.querySelector("#referencePlaneInFrontRow");
const referencePlaneInFront = document.querySelector("#referencePlaneInFront");
const referenceImageSnappedViewOnlyRow = document.querySelector("#referenceImageSnappedViewOnlyRow");
const referenceImageSnappedViewOnlyLabel = document.querySelector("#referenceImageSnappedViewOnlyLabel");
const referenceImageSnappedViewOnly = document.querySelector("#referenceImageSnappedViewOnly");
const referencePlaneHint = document.querySelector("#referencePlaneHint");
const deleteReferenceImage = document.querySelector("#deleteReferenceImage");
const exitSetupEditor = document.querySelector("#exitSetupEditor");
const exitSetupEditorLabel = document.querySelector("#exitSetupEditorLabel");
const scalpGuideVisibilityToggle = document.querySelector("#scalpGuideVisibilityToggle");
const guideViewContextMenu = document.querySelector("#guideViewContextMenu");
const guideViewModeActions = [...guideViewContextMenu.querySelectorAll("[data-guide-view-mode]")];
const orthographicViewToggle = document.querySelector("#orthographicViewToggle");
const multiCameraViewToggle = document.querySelector("#multiCameraViewToggle");
const groupColorToggle = document.querySelector("#groupColorToggle");
const lightAzimuthInput = document.querySelector("#lightAzimuth");
const lightElevationInput = document.querySelector("#lightElevation");
const lightAzimuthValue = document.querySelector("#lightAzimuthValue");
const lightElevationValue = document.querySelector("#lightElevationValue");
const allRegionsVisibilityInput = document.querySelector("#allRegionsVisibility");
const regionVisibilityInputs = [...document.querySelectorAll("[data-region-visibility]")];
const allLayersVisibilityInput = document.querySelector("#allLayersVisibility");
const layerVisibilityInputs = [...document.querySelectorAll("[data-layer-visibility]")];
const allGuidesVisibilityInput = document.querySelector("#allGuidesVisibility");
const scalpDisplayVisibilityInput = document.querySelector("#scalpDisplayVisibility");
const capsuleDisplayVisibilityInput = document.querySelector("#capsuleDisplayVisibility");
const curveLatticeDisplayVisibilityInput = document.querySelector("#curveLatticeDisplayVisibility");
const headMeshDisplayVisibilityInput = document.querySelector("#headMeshDisplayVisibility");
const bodyMeshDisplayVisibilityInput = document.querySelector("#bodyMeshDisplayVisibility");
const headTransformInputs = {
  positionY: document.querySelector("#headPositionY"),
  positionZ: document.querySelector("#headPositionZ"),
  uniformScale: document.querySelector("#headUniformScale")
};
const headTransformValues = Object.fromEntries(Object.entries(headTransformInputs).map(([key, input]) => [
  key,
  document.querySelector(`#${input.id}Value`)
]));
const headTransformResetButtons = [...document.querySelectorAll("button[data-reset-head-transform]")];
const scalpRoughScaleInputs = [...document.querySelectorAll("input[data-scalp-rough-scale-axis]")];
const scalpRoughScaleValues = [...document.querySelectorAll("output[data-scalp-rough-scale-value]")];
const scalpRoughScaleResetButtons = [...document.querySelectorAll("button[data-reset-scalp-rough-scale]")];
languageSelect.value = savedLanguage;
appVersionLabel.textContent = APP_VERSION;
const preferencesVersionLabel = document.querySelector("#preferencesVersionLabel");
if (preferencesVersionLabel) preferencesVersionLabel.textContent = APP_VERSION;
const presetLibraryToggle = document.querySelector("#presetLibraryToggle");
const presetLibrary = document.querySelector("#presetLibrary");
const presetLibraryGrid = document.querySelector("#presetLibraryGrid");
const presetLibraryStatus = document.querySelector("#presetLibraryStatus");
const presetFilterButtons = [...document.querySelectorAll("[data-preset-filter]")];
const hairProjectFileInput = document.querySelector("#hairProjectFile");
const recentProjectsMenu = document.querySelector("#recentProjectsMenu");
const recentProjectsSubmenu = document.querySelector("#recentProjectsSubmenu");
const headMeshFileInput = document.querySelector("#headMeshFile");
const fullBodyMeshFileInput = document.querySelector("#fullBodyMeshFile");
const dropImportDialog = document.querySelector("#dropImportDialog");
const dropImportForm = document.querySelector("#dropImportForm");
const dropImportDialogTitle = document.querySelector("#dropImportDialogTitle");
const dropImportDescription = document.querySelector("#dropImportDescription");
const dropImportFileName = document.querySelector("#dropImportFileName");
const dropImportWarning = document.querySelector("#dropImportWarning");
const dropObjTargetChoices = document.querySelector("#dropObjTargetChoices");
const closeDropImportDialog = document.querySelector("#closeDropImportDialog");
const cancelDropImport = document.querySelector("#cancelDropImport");
const confirmDropImport = document.querySelector("#confirmDropImport");
const projectState = createProjectStore();
const importHeadMeshMenu = document.querySelector("#importHeadMeshMenu");
const importFullBodyMeshMenu = document.querySelector("#importFullBodyMeshMenu");
const undoButton = document.querySelector("#undoAction");
const redoButton = document.querySelector("#redoAction");
const deleteSelectionAction = document.querySelector("#deleteSelectionAction");
const openRebuildCurveButton = document.querySelector("#openRebuildCurve");
const createCompoundStrandButton = document.querySelector("#createCompoundStrand");
const rebuildCurveDialog = document.querySelector("#rebuildCurveDialog");
const rebuildCurveForm = document.querySelector("#rebuildCurveForm");
const rebuildCurvePointCountInput = document.querySelector("#rebuildCurvePointCount");
const rebuildCurveEvenSpacingInput = document.querySelector("#rebuildCurveEvenSpacing");
const rebuildCurveSelectionNote = document.querySelector("#rebuildCurveSelectionNote");
const closeRebuildCurveButton = document.querySelector("#closeRebuildCurve");
const cancelRebuildCurveButton = document.querySelector("#cancelRebuildCurve");
const confirmRebuildCurveButton = document.querySelector("#confirmRebuildCurve");
const selectionSetMembershipDialog = document.querySelector("#selectionSetMembershipDialog");
const selectionSetMembershipForm = document.querySelector("#selectionSetMembershipForm");
const selectionSetMembershipDialogTitle = document.querySelector("#selectionSetMembershipDialogTitle");
const selectionSetMembershipDialogDescription = document.querySelector("#selectionSetMembershipDialogDescription");
const selectionSetMembershipList = document.querySelector("#selectionSetMembershipList");
const cancelSelectionSetMembershipButton = document.querySelector("#cancelSelectionSetMembership");
const confirmSelectionSetMembershipButton = document.querySelector("#confirmSelectionSetMembership");
const proceduralDuplicateDialog = document.querySelector("#proceduralDuplicateDialog");
const proceduralDuplicateForm = document.querySelector("#proceduralDuplicateForm");
const proceduralDuplicateCountInput = document.querySelector("#proceduralDuplicateCount");
const proceduralDuplicateRootSinkInput = document.querySelector("#proceduralDuplicateRootSink");
const proceduralDuplicateSecondPointOutwardInput = document.querySelector("#proceduralDuplicateSecondPointOutward");
const proceduralDuplicateSecondPointTowardRootInput = document.querySelector("#proceduralDuplicateSecondPointTowardRoot");
const proceduralDuplicateSpacingNote = document.querySelector("#proceduralDuplicateSpacingNote");
const proceduralDuplicateStatus = document.querySelector("#proceduralDuplicateStatus");
const closeProceduralDuplicateButton = document.querySelector("#closeProceduralDuplicate");
const cancelProceduralDuplicateButton = document.querySelector("#cancelProceduralDuplicate");
const placementStatus = document.querySelector("#placementStatus");
const selectedPointLabel = document.querySelector("#selectedPointLabel");
const proportionalRadiusInput = document.querySelector("#proportionalRadius");
const proportionalFalloffInput = document.querySelector("#proportionalFalloff");
const proportionalLockRootInput = document.querySelector("#proportionalLockRoot");
const scalpPanel = document.querySelector("#scalpPanel");
const scalpPaintPanel = document.querySelector("#scalpPaintPanel");
const headPanel = document.querySelector("#headPanel");
const scalpBuilderPanel = document.querySelector("#scalpBuilderPanel");
const resetScalpBuilderButton = document.querySelector("#resetScalpBuilder");
const confirmScalpBuilderButton = document.querySelector("#confirmScalpBuilder");
const generateScalpBuilderButton = document.querySelector("#generateScalpBuilder");
const scalpBuilderShowTemplateInput = document.querySelector("#scalpBuilderShowTemplate");
const scalpBuilderTransparentHeadInput = document.querySelector("#scalpBuilderTransparentHead");
const scalpBuilderPositionOutput = document.querySelector("#scalpBuilderPosition");
const scalpBuilderStepLabel = document.querySelector("#scalpBuilderStepLabel");
const scalpBuilderStepName = document.querySelector("#scalpBuilderStepName");
const scalpBuilderAxisLabel = document.querySelector("#scalpBuilderAxisLabel");
const scalpBuilderInstruction = document.querySelector("#scalpBuilderInstruction");
const scalpGuideSourceInput = document.querySelector("#scalpGuideSource");
const scalpGuideMeshFileInput = document.querySelector("#scalpGuideMeshFile");
const scalpBrushSizeInput = document.querySelector("#scalpBrushSize");
const scalpRegionButtons = [...document.querySelectorAll("[data-scalp-region]")];
const guidePanel = document.querySelector("#guidePanel");
const guidePanelTitle = document.querySelector("#guidePanelTitle");
const curveLatticeToggle = document.querySelector("#curveLatticeToggle") || document.createElement("button");
const curveLatticeControls = document.querySelector("#curveLatticeControls");
const curveLatticeOpacityInput = document.querySelector("#curveLatticeOpacity");
const curveLatticeHorizontalLoopsInput = document.querySelector("#curveLatticeHorizontalLoops");
const curveLatticeHorizontalLoopsValue = document.querySelector("#curveLatticeHorizontalLoopsValue");
const curveLatticeVerticalLoopsInput = document.querySelector("#curveLatticeVerticalLoops");
const curveLatticeVerticalLoopsValue = document.querySelector("#curveLatticeVerticalLoopsValue");
const groupSettingsPanel = document.querySelector("#groupSettingsPanel");
const groupSettingsTitle = document.querySelector("#groupSettingsTitle");
const selectedStrandPanel = document.querySelector("#selectedStrandPanel");
const selectedStrandTitle = document.querySelector("#selectedStrandTitle");
const selectedStrandSelectionSummary = document.querySelector("#selectedStrandSelectionSummary");
const clumpGuidePanel = document.querySelector("#clumpGuidePanel");
const clumpGuideStatus = document.querySelector("#clumpGuideStatus");
const clumpInfluenceControl = document.querySelector("#clumpInfluenceControl");
const clumpInfluenceInput = document.querySelector("#clumpInfluence");
const clumpInfluenceValue = document.querySelector("#clumpInfluenceValue");
const clumpShapeControls = document.querySelector("#clumpShapeControls");
const clumpShapeInputs = {
  spread: document.querySelector("#clumpSpread"),
  depthSpread: document.querySelector("#clumpDepthSpread"),
  tipFan: document.querySelector("#clumpTipFan"),
  roll: document.querySelector("#clumpRoll"),
  strandWidth: document.querySelector("#clumpStrandWidth"),
  strandDepth: document.querySelector("#clumpStrandDepth"),
  variation: document.querySelector("#clumpVariation")
};
const clumpShapeValues = {
  spread: document.querySelector("#clumpSpreadValue"),
  depthSpread: document.querySelector("#clumpDepthSpreadValue"),
  tipFan: document.querySelector("#clumpTipFanValue"),
  roll: document.querySelector("#clumpRollValue"),
  strandWidth: document.querySelector("#clumpStrandWidthValue"),
  strandDepth: document.querySelector("#clumpStrandDepthValue"),
  variation: document.querySelector("#clumpVariationValue")
};
const clumpContextMenu = document.querySelector("#clumpContextMenu");
const editScalpOutlinerAction = document.querySelector("#editScalpOutlinerAction");
const createClumpFromSelectionAction = document.querySelector("#createClumpFromSelectionAction");
const createSelectionSetFromSelectedAction = document.querySelector("#createSelectionSetFromSelectedAction");
const addSelectedToSelectionSetAction = document.querySelector("#addSelectedToSelectionSetAction");
const removeSelectedFromSelectionSetAction = document.querySelector("#removeSelectedFromSelectionSetAction");
const lockOutlinerAction = document.querySelector("#lockOutlinerAction");
const promoteLiveSurfaceGuideAction = document.querySelector("#promoteLiveSurfaceGuideAction");
const createClumpPresetAction = document.querySelector("#createClumpPresetAction");
const dissolveClumpAction = document.querySelector("#dissolveClumpAction");
const mirrorInstanceAction = document.querySelector("#mirrorInstanceAction");
const deleteOutlinerAction = document.querySelector("#deleteOutlinerAction");
const strandRadialMenu = document.querySelector("#strandRadialMenu");
hairState.state.strandRadialActions = [...strandRadialMenu.querySelectorAll("[data-strand-radial-action]")];
const strandRadialActionList = document.querySelector("#strandRadialActionList");
const strandRadialLine = document.querySelector("#strandRadialLine");
const strandRadialCenter = document.querySelector("#strandRadialCenter");
const toolRadialMenu = document.querySelector("#toolRadialMenu");
miscState.state.toolRadialActions = [...toolRadialMenu.querySelectorAll("[data-tool-radial-index]")];
const toolRadialActionList = document.querySelector("#toolRadialActionList");
const toolRadialLine = document.querySelector("#toolRadialLine");
const toolRadialCenter = document.querySelector("#toolRadialCenter");
const toolPanel = document.querySelector(".tool-panel");
const attributeEditorTabs = [...document.querySelectorAll("[data-attribute-tab]")];
const attributeEditorPanels = [...document.querySelectorAll(".tool-panel > .panel-section")];
const toggleAttributeEditorPanelButton = document.querySelector("#toggleAttributeEditorPanel");
const toggleOutlinerPanelButton = document.querySelector("#toggleOutlinerPanel");
const hairMaterialPanel = document.querySelector("#hairMaterialPanel");
const proportionalPanel = document.querySelector("#proportionalPanel");
const proportionalLockRootRow = document.querySelector("#proportionalLockRootRow");
const hierarchyPanel = document.querySelector("#hierarchyPanel");
const hierarchyRecursiveTransformInput = document.querySelector("#hierarchyRecursiveTransform");
const branchRigidCurvatureBlendInput = document.querySelector("#branchRigidCurvatureBlendInput");
const branchBridgeSmoothStrengthInput = document.querySelector("#branchBridgeSmoothStrengthInput");
const branchBridgeSmoothDetailInput = document.querySelector("#branchBridgeSmoothDetailInput");
const branchRegionSyncLateralInput = document.querySelector("#branchRegionSyncLateralInput");
const branchRegionSyncVerticalInput = document.querySelector("#branchRegionSyncVerticalInput");
const branchBridgePanel = document.querySelector("#branchBridgePanel");
const sweepOverlapStrengthInput = document.querySelector("#sweepOverlapStrengthInput");
const sweepOverlapThresholdInput = document.querySelector("#sweepOverlapThresholdInput");
const sweepEdgeSmoothInput = document.querySelector("#sweepEdgeSmoothInput");
const sweepOverlapFalloffInput = document.querySelector("#sweepOverlapFalloffInput");
const sweepTangentSmoothInput = document.querySelector("#sweepTangentSmoothInput");
const sweepOverlapPanel = document.querySelector("#sweepOverlapPanel");
const transformToolPanel = document.querySelector("#transformToolPanel");
const transformToolTitle = document.querySelector("#transformToolTitle");
const relaxToolPanel = document.querySelector("#relaxToolPanel");
const relaxPositionInput = document.querySelector("#relaxPosition");
const relaxRotationInput = document.querySelector("#relaxRotation");
const viewPlaneMoveSetting = document.querySelector("#viewPlaneMoveSetting");
const viewPlaneMoveInput = document.querySelector("#viewPlaneMove");
const viewPlaneMoveSnappedSetting = document.querySelector("#viewPlaneMoveSnappedSetting");
const viewPlaneMoveSnappedOnlyInput = document.querySelector("#viewPlaneMoveSnappedOnly");
const pullMoveSetting = document.querySelector("#pullMoveSetting");
const pullMoveInput = document.querySelector("#pullMove");
const pullRigiditySetting = document.querySelector("#pullRigiditySetting");
const pullRigidityInput = document.querySelector("#pullRigidity");
const pullRigidityValue = document.querySelector("#pullRigidityValue");
const pullCollisionSetting = document.querySelector("#pullCollisionSetting");
const pullCollisionInput = document.querySelector("#pullCollision");
const scaleSensitivitySetting = document.querySelector("#scaleSensitivitySetting");
const scaleSensitivityInput = document.querySelector("#scaleSensitivity");
const scaleSensitivityValue = document.querySelector("#scaleSensitivityValue");
const moveGrabHandlesSetting = document.querySelector("#moveGrabHandlesSetting");
const moveWidthGrabHandlesInput = document.querySelector("#moveWidthGrabHandles");
const moveDepthGrabHandlesInput = document.querySelector("#moveDepthGrabHandles");
const moveUniformGrabHandlesInput = document.querySelector("#moveUniformGrabHandles");
const moveCurveControlsSetting = document.querySelector("#moveCurveControlsSetting");
const moveWidthCurveControlsInput = document.querySelector("#moveWidthCurveControls");
const moveDepthCurveControlsInput = document.querySelector("#moveDepthCurveControls");
const moveTwistCurveControlsInput = document.querySelector("#moveTwistCurveControls");
const moveAsymmetricWidthInput = document.querySelector("#moveAsymmetricWidth");
const moveAsymmetricDepthInput = document.querySelector("#moveAsymmetricDepth");
const moveAsymmetricWidthLabel = document.querySelector("#moveAsymmetricWidthLabel");
const moveAsymmetricDepthLabel = document.querySelector("#moveAsymmetricDepthLabel");
const moveCenterAsymmetricProfileInput = document.querySelector("#moveCenterAsymmetricProfile");
const placeStrandToolPanel = document.querySelector("#placeStrandToolPanel");
const placeStrandScalpOffsetInput = document.querySelector("#placeStrandScalpOffset");
const placeStrandScalpOffsetValue = document.querySelector("#placeStrandScalpOffsetValue");
const placeAutoShowScalpInput = document.querySelector("#placeAutoShowScalp");
const drawStrandToolPanel = document.querySelector("#drawStrandToolPanel");
const drawStrandToolTitle = document.querySelector("#drawStrandToolTitle");
const proceduralAccessoryEditPanel = document.querySelector("#proceduralAccessoryEditPanel");
const proceduralAccessoryEditCountInput = document.querySelector("#proceduralAccessoryEditCount");
const proceduralAccessoryEditCountValue = document.querySelector("#proceduralAccessoryEditCountValue");
const proceduralAccessoryEditRadiusInput = document.querySelector("#proceduralAccessoryEditRadius");
const proceduralAccessoryEditRadiusValue = document.querySelector("#proceduralAccessoryEditRadiusValue");
const proceduralAccessoryEditParentVisibleInput = document.querySelector("#proceduralAccessoryEditParentVisible");
const proceduralBranchEditCountInput = document.querySelector("#proceduralBranchEditCount");
const proceduralBranchEditCountValue = document.querySelector("#proceduralBranchEditCountValue");
const proceduralBranchEditLengthInput = document.querySelector("#proceduralBranchEditLength");
const proceduralBranchEditLengthValue = document.querySelector("#proceduralBranchEditLengthValue");
const proceduralBranchLengthCurvePreview = document.querySelector("#proceduralBranchLengthCurvePreview");
const proceduralBranchShapeCurvePreview = document.querySelector("#proceduralBranchShapeCurvePreview");
const proceduralBranchEditTipOffsetInput = document.querySelector("#proceduralBranchEditTipOffset");
const proceduralBranchEditTipOffsetValue = document.querySelector("#proceduralBranchEditTipOffsetValue");
const sculptMoveToolPanel = document.querySelector("#sculptMoveToolPanel");
const polyBrushToolPanel = document.querySelector("#polyBrushToolPanel");
const polyBrushSurfaceOffsetInput = document.querySelector("#polyBrushSurfaceOffset");
const polyBrushSurfaceOffsetValue = document.querySelector("#polyBrushSurfaceOffsetValue");
const polyBrushWidthInput = document.querySelector("#polyBrushWidth");
const polyBrushWidthValue = document.querySelector("#polyBrushWidthValue");
const polyBrushSpacingInput = document.querySelector("#polyBrushSpacing");
const polyBrushSpacingValue = document.querySelector("#polyBrushSpacingValue");
const loftSurfaceToolPanel = document.querySelector("#loftSurfaceToolPanel");
const curveSurfaceToolPanel = document.querySelector("#curveSurfaceToolPanel");
const curveSurfaceStripWidthInput = document.querySelector("#curveSurfaceStripWidth");
const curveSurfaceStripWidthValue = document.querySelector("#curveSurfaceStripWidthValue");
const curveSurfaceDraftStatus = document.querySelector("#curveSurfaceDraftStatus");
const confirmCurveSurfaceDraftButton = document.querySelector("#confirmCurveSurfaceDraft");
const resetCurveSurfaceDraftButton = document.querySelector("#resetCurveSurfaceDraft");
const loftHorizontalStep = document.querySelector("#loftHorizontalStep");
const loftVerticalStep = document.querySelector("#loftVerticalStep");
const resetLoftSurfaceDraftButton = document.querySelector("#resetLoftSurfaceDraft");
// Curve Surface create api deps batch (refactor 3d batch G4): all deps are defined by this point (last dep:
// resetLoftSurfaceDraftButton); the batch takes effect here, before the first boot-time draft/outliner calls.
Object.assign(curveSurfaceCreateDeps, {
  activeStrokeDynamicEnabled: drawFlowApi.activeStrokeDynamicEnabled,
  activeStrokeSurfaceValue: drawFlowApi.activeStrokeSurfaceValue,
  addLock,
  confirmCurveSurfaceDraftButton,
  contextualPlaneAtOrigin: drawFlowApi.contextualPlaneAtOrigin,
  createHairGeometry: strandGeometryApi.createHairGeometry,
  curveSurfaceDraftGroup,
  curveSurfaceDraftMesh,
  curveSurfaceDraftStatus,
  curveSurfaceStripWidthInput,
  drawClumpSampleNormal: drawFlowApi.drawClumpSampleNormal,
  drawSurfaceHitFromEvent: drawFlowApi.drawSurfaceHitFromEvent,
  exitSetupEditors,
  finishDrawStrandStroke: drawFlowApi.finishDrawStrandStroke,
  finishPlacementFlow: placementApi.finishPlacementFlow,
  getSelectedLock,
  loftHorizontalPreview,
  loftHorizontalStep,
  loftSurfaceGridPreview,
  loftVerticalPreview,
  loftVerticalStep,
  miscState: miscState.state,
  outwardNormalAtPoint,
  panelCreationDefaults,
  processedDrawStroke: drawFlowApi.processedDrawStroke,
  pushUndoState,
  raycaster,
  rayFromViewportEvent,
  rebuildCurveObjects,
  renderer,
  renderLockList,
  resetCurveSurfaceDraftButton,
  resetLoftSurfaceDraftButton,
  scalpBuilder,
  sculptState: sculptState.state,
  sel: sel.state,
  selectLock,
  setActiveTool,
  setViewportEditMode,
  STRAIGHT_CUT_PANEL_CURVE,
  strandGeometryFrameAt,
  strokeLength: drawFlowApi.strokeLength,
  strokeSurfaceIsContextual: drawFlowApi.strokeSurfaceIsContextual,
  strokeSurfaceNormals: drawFlowApi.strokeSurfaceNormals,
  syncActiveMirror,
  updateAttributeEditorMode,
  updateCount,
  updateCurveObjects,
  updateInteractionLocks,
  updateLockGeometry,
  updatePlacementStatus: placementApi.updatePlacementStatus,
  updateTopologyStats,
  vectorToData,
  viewPlaneNormal,
  worldNormalAtHit: drawFlowApi.worldNormalAtHit
});
// Sculpt brush geometry api deps batch (refactor 3d batch G6): all deps are defined by this
// point (last dep: proportionalFalloffInput); the batch takes effect here, before the first
// sculpt-brush DOM listener/boot calls (sculptBrushStrengthInput input listener etc.).
Object.assign(sculptGeomDeps, {
  applySubBoneBrushSample: bonesApi.applySubBoneBrushSample,
  average,
  camera,
  commitClumpMemberRestState: clumpProceduralApi.commitClumpMemberRestState,
  curveFrameAt,
  curveSurfaceControllerPointRange: curveSurfaceCreate.curveSurfaceControllerPointRange,
  effectiveSculptBrushTool,
  flushPendingLockGeometryUpdates,
  getSelectedLock,
  guidedNormalAt,
  isPanelGeometry,
  locks,
  mirrorPartnerFor,
  mirroredVector,
  proportionalFalloffInput,
  proportionalRadiusInput,
  pushUndoState,
  rebuildLockGeometry,
  renderer,
  sculptBrushCursor,
  sculptBrushFalloffInput,
  sculptBrushFalloffRing,
  sculptBrushFalloffValue,
  sculptBrushPlanePositionInput,
  sculptBrushPlanePositionValue,
  sculptBrushPreserveTipsByTool,
  sculptBrushRadiusInput,
  sculptBrushRadiusValue,
  sculptBrushSelectionAllows,
  sculptBrushShowClippingPlaneInput,
  sculptBrushShowCurvesInput,
  sculptBrushStrengthByTool,
  sculptBrushStrengthInput,
  sculptBrushStrengthValue,
  sculptBrushToolActive,
  sculptBrushViabilityPlane,
  sculptPreserveTipsInput,
  sculptState: sculptState.state,
  sel: sel.state,
  setPointScale,
  signedAngleAroundAxis,
  strandVisibleForDisplay,
  syncInputs,
  syncLockFromCurve,
  undoHistory,
  updateCurveObjects,
  updateHistoryButtons,
  updateInteractionLocks,
  updateTopologyStats
});
const drawBrushPresetInput = document.querySelector("#drawBrushPreset");
const saveStrandToolPresetButton = document.querySelector("#saveStrandToolPreset");
const removeStrandToolPresetButton = document.querySelector("#removeStrandToolPreset");
const drawStrandCurlCountInput = document.querySelector("#drawStrandCurlCount");
const drawStrandCurlCountValue = document.querySelector("#drawStrandCurlCountValue");
const drawStrandCurlDisplacementInput = document.querySelector("#drawStrandCurlDisplacement");
const drawStrandCurlDisplacementValue = document.querySelector("#drawStrandCurlDisplacementValue");
const drawToolSizeInput = document.querySelector("#drawToolSize");
const drawToolSizeValue = document.querySelector("#drawToolSizeValue");
const drawStrandBrushSizeInput = document.querySelector("#drawStrandBrushSize");
const drawStrandBrushSizeValue = document.querySelector("#drawStrandBrushSizeValue");
const drawStrandSmoothingInput = document.querySelector("#drawStrandSmoothing");
const drawStrandSmoothingValue = document.querySelector("#drawStrandSmoothingValue");
const drawStrandCurveStepInput = document.querySelector("#drawStrandCurveStep");
const drawStrandCurveStepValue = document.querySelector("#drawStrandCurveStepValue");
const drawStrandScalpOffsetInput = document.querySelector("#drawStrandScalpOffset");
const drawStrandScalpOffsetValue = document.querySelector("#drawStrandScalpOffsetValue");
const drawSurfaceNormalInfluenceInput = document.querySelector("#drawSurfaceNormalInfluence");
const drawSurfaceNormalInfluenceValue = document.querySelector("#drawSurfaceNormalInfluenceValue");
const viewportDrawSettings = document.querySelector("#viewportDrawSettings");
const viewportDrawLayerInput = document.querySelector("#viewportDrawLayer");
const drawStrandSurfaceInput = document.querySelector("#drawStrandSurface");
const drawSurfaceDynamicButton = document.querySelector("#drawSurfaceDynamic");
const drawAutoShowScalpInput = document.querySelector("#drawAutoShowScalp");
const drawContinueFromTipInput = document.querySelector("#drawContinueFromTip");
const braidToolPanel = document.querySelector("#braidToolPanel");
const braidToolPresetInput = document.querySelector("#braidToolPreset");
const saveBraidToolPresetButton = document.querySelector("#saveBraidToolPreset");
const removeBraidToolPresetButton = document.querySelector("#removeBraidToolPreset");
const creationPresetDialog = document.querySelector("#creationPresetDialog");
const creationPresetForm = document.querySelector("#creationPresetForm");
const creationPresetDialogTitle = document.querySelector("#creationPresetDialogTitle");
const creationPresetDescription = document.querySelector("#creationPresetDescription");
const creationPresetNameInput = document.querySelector("#creationPresetName");
const closeCreationPresetDialogButton = document.querySelector("#closeCreationPresetDialog");
const cancelCreationPresetButton = document.querySelector("#cancelCreationPreset");
const removeCreationPresetDialog = document.querySelector("#removeCreationPresetDialog");
const removeCreationPresetDialogTitle = document.querySelector("#removeCreationPresetDialogTitle");
const removeCreationPresetMessage = document.querySelector("#removeCreationPresetMessage");
const cancelRemoveCreationPresetButton = document.querySelector("#cancelRemoveCreationPreset");
const confirmRemoveCreationPresetButton = document.querySelector("#confirmRemoveCreationPreset");
const fileActionDialog = document.querySelector("#fileActionDialog");
const fileActionForm = document.querySelector("#fileActionForm");
const fileActionDialogTitle = document.querySelector("#fileActionDialogTitle");
const fileActionDescription = document.querySelector("#fileActionDescription");
const fileActionNameInput = document.querySelector("#fileActionName");
const fileActionExtension = document.querySelector("#fileActionExtension");
const fileExportContents = document.querySelector("#fileExportContents");
const projectSaveContents = document.querySelector("#projectSaveContents");
const projectIncludeHeadAssetInput = document.querySelector("#projectIncludeHeadAsset");
const projectIncludeReferencesInput = document.querySelector("#projectIncludeReferences");
const fileActionStatus = document.querySelector("#fileActionStatus");
const closeFileActionDialogButton = document.querySelector("#closeFileActionDialog");
const cancelFileActionButton = document.querySelector("#cancelFileAction");
const confirmFileActionButton = document.querySelector("#confirmFileAction");
const exportContentInputs = {
  mesh: document.querySelector("#exportIncludeMesh"),
  curves: document.querySelector("#exportIncludeCurves"),
  bones: document.querySelector("#exportIncludeBones")
};
const braidMeshPresetInput = document.querySelector("#braidMeshPreset");
const braidToolSizeInput = document.querySelector("#braidToolSize");
const braidToolSizeValue = document.querySelector("#braidToolSizeValue");
const braidWidthInput = document.querySelector("#braidWidth");
const braidWidthValue = document.querySelector("#braidWidthValue");
const braidDepthInput = document.querySelector("#braidDepth");
const braidDepthValue = document.querySelector("#braidDepthValue");
const widthScaleLabel = document.querySelector("#widthScaleLabel");
const depthScaleLabel = document.querySelector("#depthScaleLabel");
const braidSegmentLengthInput = document.querySelector("#braidSegmentLength");
const braidSegmentLengthValue = document.querySelector("#braidSegmentLengthValue");
const braidRotationInput = document.querySelector("#braidRotation");
const braidRotationValue = document.querySelector("#braidRotationValue");
const braidSmoothingInput = document.querySelector("#braidSmoothing");
const braidSmoothingValue = document.querySelector("#braidSmoothingValue");
const braidCurveStepInput = document.querySelector("#braidCurveStep");
const braidCurveStepValue = document.querySelector("#braidCurveStepValue");
const braidScalpOffsetInput = document.querySelector("#braidScalpOffset");
const braidScalpOffsetValue = document.querySelector("#braidScalpOffsetValue");
const braidAutoShowScalpInput = document.querySelector("#braidAutoShowScalp");
const braidContinueFromTipInput = document.querySelector("#braidContinueFromTip");
const panelStrandToolPanel = document.querySelector("#panelStrandToolPanel");
const panelToolTitle = document.querySelector("#panelToolTitle");
const panelToolSizeInput = document.querySelector("#panelToolSize");
const panelToolSizeValue = document.querySelector("#panelToolSizeValue");
const panelSmoothingInput = document.querySelector("#panelSmoothing");
const panelSmoothingValue = document.querySelector("#panelSmoothingValue");
const panelCurveStepInput = document.querySelector("#panelCurveStep");
const panelCurveStepValue = document.querySelector("#panelCurveStepValue");
const panelScalpOffsetInput = document.querySelector("#panelScalpOffset");
const panelScalpOffsetValue = document.querySelector("#panelScalpOffsetValue");
const panelSurfaceNormalInfluenceInput = document.querySelector("#panelSurfaceNormalInfluence");
const panelSurfaceNormalInfluenceValue = document.querySelector("#panelSurfaceNormalInfluenceValue");
const panelAutoShowScalpInput = document.querySelector("#panelAutoShowScalp");
const surfaceGuideToolPanel = document.querySelector("#surfaceGuideToolPanel");
const capsuleGuideDrawSettings = document.querySelector("#capsuleGuideDrawSettings");
const capsuleGuideCurveStepInput = document.querySelector("#capsuleGuideCurveStep");
const capsuleGuideCurveStepValue = document.querySelector("#capsuleGuideCurveStepValue");
const capsuleGuideProfilePath = document.querySelector("#capsuleGuideProfilePath");
const capsuleGuideProfileInputs = {
  root: document.querySelector("#capsuleGuideProfileRoot"),
  middle: document.querySelector("#capsuleGuideProfileMiddle"),
  tip: document.querySelector("#capsuleGuideProfileTip")
};
const capsuleGuideProfileValues = {
  root: document.querySelector("#capsuleGuideProfileRootValue"),
  middle: document.querySelector("#capsuleGuideProfileMiddleValue"),
  tip: document.querySelector("#capsuleGuideProfileTipValue")
};
const surfaceGuideNameInput = document.querySelector("#surfaceGuideName");
const surfaceGuideColorInput = document.querySelector("#surfaceGuideColor");
const surfaceGuideInputs = {
  radius: document.querySelector("#surfaceGuideRadius"),
  length: document.querySelector("#surfaceGuideLength"),
  radialLoops: document.querySelector("#surfaceGuideRadialLoops"),
  lengthLoops: document.querySelector("#surfaceGuideLengthLoops"),
  subdivisionSteps: document.querySelector("#surfaceGuideSubdivisionSteps"),
  opacity: document.querySelector("#surfaceGuideOpacity"),
  centerVisibility: document.querySelector("#surfaceGuideCenterVisibility")
};
const surfaceGuideValues = {
  radius: document.querySelector("#surfaceGuideRadiusValue"),
  length: document.querySelector("#surfaceGuideLengthValue"),
  radialLoops: document.querySelector("#surfaceGuideRadialLoopsValue"),
  lengthLoops: document.querySelector("#surfaceGuideLengthLoopsValue"),
  subdivisionSteps: document.querySelector("#surfaceGuideSubdivisionStepsValue"),
  opacity: document.querySelector("#surfaceGuideOpacityValue"),
  centerVisibility: document.querySelector("#surfaceGuideCenterVisibilityValue")
};
const surfaceGuideFresnelInput = document.querySelector("#surfaceGuideFresnel");
const surfaceGuideFitScalpButton = document.querySelector("#surfaceGuideFitScalp");
const transformSpaceButtons = [...document.querySelectorAll("[data-transform-space]")];
const strandShapePanel = document.querySelector("#strandShapePanel");
const strandShapeTitle = document.querySelector("#strandShapeTitle");
const compoundBridgeLoopsControl = document.querySelector("#compoundBridgeLoopsControl");
const compoundBridgeLoopsValue = document.querySelector("#compoundBridgeLoopsValue");
const compoundBridgeSmoothingControl = document.querySelector("#compoundBridgeSmoothingControl");
const compoundBridgeSmoothingValue = document.querySelector("#compoundBridgeSmoothingValue");
const surfaceLatticeControls = document.querySelector("#surfaceLatticeControls");
const surfaceLatticeColumnsInput = document.querySelector("#surfaceLatticeColumns");
const surfaceLatticeColumnsValue = document.querySelector("#surfaceLatticeColumnsValue");
const surfaceLatticeRowsInput = document.querySelector("#surfaceLatticeRows");
const surfaceLatticeRowsValue = document.querySelector("#surfaceLatticeRowsValue");
const panelCurvatureControl = document.querySelector("#panelCurvatureControl");
const panelTipCurveControl = document.querySelector("#panelTipCurveControl");
const panelScalpConformControls = document.querySelector("#panelScalpConformControls");
// Scalp Conform 的四个滑杆走**已有**的 panelShapeInputs 通用接线（bindUndoCapture + input
// 监听 + setMixedControl 多选同步各只有一份实现），因此这里只需把键补进字典。
// 但通用接线对元素做 `input.addEventListener` 时**不判空**，而本文件被 index.html
// 加载时该 markup 可能尚未存在 —— 所以先滤掉缺失项：缺失时这四个键根本不进字典，
// 通用循环遍历不到，启动不会抛（其余既有键沿用原样，行为逐字节不变）。
const panelScalpConformInputEntries = Object.entries({
  panelScalpConformAmount: document.querySelector("#panelScalpConformAmount"),
  panelScalpConformGap: document.querySelector("#panelScalpConformGap")
}).filter(([, element]) => Boolean(element));
const panelScalpConformValueEntries = Object.entries({
  panelScalpConformAmount: document.querySelector("#panelScalpConformAmountValue"),
  panelScalpConformGap: document.querySelector("#panelScalpConformGapValue")
}).filter(([, element]) => Boolean(element));
const panelShapeInputs = {
  width: document.querySelector("#panelWidth"),
  panelThickness: document.querySelector("#panelThickness"),
  panelLengthLoops: document.querySelector("#panelLengthLoops"),
  panelWidthLoops: document.querySelector("#panelWidthLoops"),
  panelCurvature: document.querySelector("#panelCurvature"),
  panelLeftEdgeTrim: document.querySelector("#panelLeftEdgeTrim"),
  panelRightEdgeTrim: document.querySelector("#panelRightEdgeTrim"),
  panelTipCurve: document.querySelector("#panelTipCurve"),
  panelTipLoops: document.querySelector("#panelTipLoops"),
  panelSplitEnabled: document.querySelector("#panelSplitEnabled"),
  panelSplitSnapToLoops: document.querySelector("#panelSplitSnapToLoops"),
  ...Object.fromEntries(panelScalpConformInputEntries)
};
const panelShapeValues = {
  width: document.querySelector("#panelWidthValue"),
  panelThickness: document.querySelector("#panelThicknessValue"),
  panelLengthLoops: document.querySelector("#panelLengthLoopsValue"),
  panelWidthLoops: document.querySelector("#panelWidthLoopsValue"),
  panelCurvature: document.querySelector("#panelCurvatureValue"),
  panelLeftEdgeTrim: document.querySelector("#panelLeftEdgeTrimValue"),
  panelRightEdgeTrim: document.querySelector("#panelRightEdgeTrimValue"),
  panelTipCurve: document.querySelector("#panelTipCurveValue"),
  panelTipLoops: document.querySelector("#panelTipLoopsValue"),
  ...Object.fromEntries(panelScalpConformValueEntries)
};
// 0.2.132：全局 Split Spacing 滑杆（#strandSplitGap）已删除 —— 它承载的「segment separate
// / 整管横向平移」语义被整体移除，发尖聚合改由每管 Tip Clump（#strandSegmentSpread）表达。
// 两个字典**刻意保留**（不塌缩成单个 checkbox 常量）：下方的 setMixedControl 多选同步与
// input 处理器都按 Object.entries 遍历它们，将来再加 split 级标量控件时无需重接线。
// strandSplitValues 现为空：strandSplitEnabled 是复选框、没有读数 output。
const strandSplitInputs = {
  strandSplitEnabled: document.querySelector("#strandSplitEnabled")
};
const strandSplitValues = {};
const strandTipInputs = {
  strandTipEnabled: document.querySelector("#strandTipEnabled"),
  strandTipStart: document.querySelector("#strandTipStart")
};
const strandTipValues = {
  strandTipStart: document.querySelector("#strandTipStartValue")
};
const strandTipLengthInput = document.querySelector("#strandTipLength");
const strandTipLengthValue = document.querySelector("#strandTipLengthValue");
const resetStrandTipButton = document.querySelector("#resetStrandTip");
const strandSplitTipLengthInput = document.querySelector("#strandSplitTipLength");
const strandSplitTipLengthValue = document.querySelector("#strandSplitTipLengthValue");
const resetStrandSplitTipsButton = document.querySelector("#resetStrandSplitTips");
const panelSplitCountValue = document.querySelector("#panelSplitCount");
const addPanelSplitButton = document.querySelector("#addPanelSplit");
const removePanelSplitButton = document.querySelector("#removePanelSplit");
const strandSplitCountValue = document.querySelector("#strandSplitCount");
const addStrandSplitButton = document.querySelector("#addStrandSplit");
const removeStrandSplitButton = document.querySelector("#removeStrandSplit");
const panelSegmentLabel = document.querySelector("#panelSegmentLabel");
const previousPanelSegmentButton = document.querySelector("#previousPanelSegment");
const nextPanelSegmentButton = document.querySelector("#nextPanelSegment");
const panelSegmentSpread = document.querySelector("#panelSegmentSpread");
const panelSegmentSpreadValue = document.querySelector("#panelSegmentSpreadValue");
const segmentTaperPreview = document.querySelector("#segmentTaperPreview");
const segmentDepthPreview = document.querySelector("#segmentDepthPreview");
const strandSegmentControls = document.querySelector("#strandSegmentControls");
const strandSegmentLabel = document.querySelector("#strandSegmentLabel");
const previousStrandSegmentButton = document.querySelector("#previousStrandSegment");
const nextStrandSegmentButton = document.querySelector("#nextStrandSegment");
const strandSegmentSpread = document.querySelector("#strandSegmentSpread");
const strandSegmentSpreadValue = document.querySelector("#strandSegmentSpreadValue");
const strandSegmentTaperPreview = document.querySelector("#strandSegmentTaperPreview");
const strandSegmentDepthPreview = document.querySelector("#strandSegmentDepthPreview");
const groupInputs = {
  lengthScale: document.querySelector("#groupLengthScale"),
  widthScale: document.querySelector("#groupWidthScale"),
  depthScale: document.querySelector("#groupDepthScale"),
  profileOffset: document.querySelector("#groupProfileOffset"),
  rootScalpOffset: document.querySelector("#groupRootScalpOffset"),
  radialSegments: document.querySelector("#groupRadialSegments"),
  lengthSegments: document.querySelector("#groupLengthSegments"),
  densityAggression: document.querySelector("#groupDensityAggression"),
  twistDensity: document.querySelector("#groupTwistDensity")
};
const groupLayerInputs = Object.fromEntries(HAIR_LAYERS.map((layer) => [
  layer.id,
  document.querySelector(`#groupLayer${layer.id[0].toUpperCase()}${layer.id.slice(1)}`)
]));
const groupDynamicDensityInput = document.querySelector("#groupDynamicDensity");
const groupTopologyStats = document.querySelector("#groupTopologyStats");
const strandTopologyPanel = document.querySelector("#strandTopologyPanel");
const strandTopologyStats = document.querySelector("#strandTopologyStats");
const viewportStats = document.querySelector("#viewportStats");
const viewportSelectedStats = document.querySelector("#viewportSelectedStats");
const viewportTotalStats = document.querySelector("#viewportTotalStats");
const viewportFps = document.querySelector("#viewportFps");
const topologyValues = {
  groupRadialSegments: document.querySelector("#groupRadialSegmentsValue"),
  groupLengthSegments: document.querySelector("#groupLengthSegmentsValue"),
  groupDensityAggression: document.querySelector("#groupDensityAggressionValue"),
  groupTwistDensity: document.querySelector("#groupTwistDensityValue"),
  strandRadialSegments: document.querySelector("#strandRadialSegmentsValue"),
  strandLengthSegments: document.querySelector("#strandLengthSegmentsValue"),
  strandDensityAggression: document.querySelector("#strandDensityAggressionValue"),
  strandTwistDensity: document.querySelector("#strandTwistDensityValue")
};
const profilePreviewPaths = {
  group: document.querySelector("#groupProfilePreview"),
  strand: document.querySelector("#strandProfilePreview")
};
const strandHairCardCoveragePreview = document.querySelector("#strandHairCardCoveragePreview");
const sweepProfileEditor = document.querySelector("#sweepProfileEditor");
const sweepProfileTarget = document.querySelector("#sweepProfileTarget");
const sweepProfileCanvas = document.querySelector("#sweepProfileCanvas");
const sweepProfileOriginalPath = document.querySelector("#sweepProfileOriginalPath");
const sweepProfileTrimInputs = {
  profileTrimLeft: document.querySelector("#sweepProfileTrimLeft"),
  profileTrimRight: document.querySelector("#sweepProfileTrimRight")
};
const sweepProfileTrimValues = {
  profileTrimLeft: document.querySelector("#sweepProfileTrimLeftValue"),
  profileTrimRight: document.querySelector("#sweepProfileTrimRightValue")
};
const sweepProfileTrimRoundness = document.querySelector("#sweepProfileTrimRoundness");
const sweepProfileTrimRoundnessValue = document.querySelector("#sweepProfileTrimRoundnessValue");
const sweepProfilePath = document.querySelector("#sweepProfilePath");
const sweepProfileHairCardCoveragePath = document.querySelector("#sweepProfileHairCardCoveragePath");
const sweepProfilePoints = document.querySelector("#sweepProfilePoints");
const sweepPointInterpolation = document.querySelector("#sweepPointInterpolation");
const sweepProfileMirrorX = document.querySelector("#sweepProfileMirrorX");
const editSweepProfileButtons = [...document.querySelectorAll(".edit-sweep-profile")];
const taperPreviewPaths = {
  group: document.querySelector("#groupTaperPreview"),
  strand: document.querySelector("#strandTaperPreview"),
  groupDepth: document.querySelector("#groupDepthPreview"),
  strandDepth: document.querySelector("#strandDepthPreview")
};
const strandTwistCurvePreview = document.querySelector("#strandTwistCurvePreview");
const taperCurveEditor = document.querySelector("#taperCurveEditor");
const taperCurveTarget = document.querySelector("#taperCurveTarget");
const taperCurveCanvas = document.querySelector("#taperCurveCanvas");
const taperCurvePath = document.querySelector("#taperCurvePath");
const taperCurveSecondaryPath = document.querySelector("#taperCurveSecondaryPath");
const taperCurveBaseAxis = document.querySelector("#taperCurveBaseAxis");
const taperCurveValueAxis = document.querySelector("#taperCurveValueAxis");
const taperCurveCenterLine = document.querySelector("#taperCurveCenterLine");
const taperCurvePoints = document.querySelector("#taperCurvePoints");
const taperAsymmetryToggleRow = document.querySelector("#taperAsymmetryToggleRow");
const taperAsymmetryToggle = document.querySelector("#taperAsymmetryToggle");
const centerAsymmetricProfileRow = document.querySelector("#centerAsymmetricProfileRow");
const centerAsymmetricProfileToggle = document.querySelector("#centerAsymmetricProfile");
const taperMeshPointsToggleRow = document.querySelector("#taperMeshPointsToggleRow");
const taperMeshPointsToggle = document.querySelector("#taperMeshPointsToggle");
const taperCurveOptions = document.querySelector("#taperCurveOptions");
const taperPointValue = document.querySelector("#taperPointValue");
const taperPointPosition = document.querySelector("#taperPointPosition");
const taperPointInterpolation = document.querySelector("#taperPointInterpolation");
const editTaperCurveButtons = [...document.querySelectorAll(".edit-shape-curve")];
const shapePresetSelects = [...document.querySelectorAll(".shape-preset-select")];
const groupDefaultsWarning = document.querySelector("#groupDefaultsWarning");
const hideGroupDefaultsWarning = document.querySelector("#hideGroupDefaultsWarning");
const confirmGroupDefaultsChange = document.querySelector("#confirmGroupDefaultsChange");
const cancelGroupDefaultsChange = document.querySelector("#cancelGroupDefaultsChange");
miscState.state.groupDefaultsWarningAcknowledged = localStorage.getItem("anime-hair-hide-group-defaults-warning") === "true";
const panelSplitSnapWarning = document.querySelector("#panelSplitSnapWarning");
const confirmPanelSplitSnapDisable = document.querySelector("#confirmPanelSplitSnapDisable");
const cancelPanelSplitSnapDisable = document.querySelector("#cancelPanelSplitSnapDisable");
const newProjectWarning = document.querySelector("#newProjectWarning");
const confirmNewProjectButton = document.querySelector("#confirmNewProject");
const cancelNewProjectButton = document.querySelector("#cancelNewProject");
const scalpInputs = {
  x: document.querySelector("#scalpX"),
  y: document.querySelector("#scalpY"),
  z: document.querySelector("#scalpZ"),
  radius: document.querySelector("#scalpRadius"),
  scaleX: document.querySelector("#scalpScaleX"),
  scaleY: document.querySelector("#scalpScaleY"),
  scaleZ: document.querySelector("#scalpScaleZ")
};
const scalpSurface = { x: 0, y: 0.9, z: 0, radius: 1, scaleX: 1, scaleY: 1, scaleZ: 1 };
// Scalp Conform 拟合椭球（第五版，纬线 + 椭球密切圆心）：**全局**，头只有一个，不进 lock
// （与逐 lock 的 panelScalpConformAmount/Gap 是两套不同粒度的参数，互不影响）。
// 中心复用 scalpSurface 的 x/y/z（不新增中心字段），半轴只暴露水平两个方向的比例——
// 竖直半轴与整体半径被 curve-math.js 的 PANEL_SCALP_CONFORM_DEFAULTS 写死为 1（球构型下
// 对结果的影响代数为 0，理由见该文件 PANEL_SCALP_CONFORM_DEFAULTS 上方注释）。
// 默认值**唯一定义点**是 PANEL_SCALP_CONFORM_DEFAULTS，这里 import 而不抄字面量。
const scalpConformFit = {
  fitScaleX: PANEL_SCALP_CONFORM_DEFAULTS.fitScaleX,
  fitScaleZ: PANEL_SCALP_CONFORM_DEFAULTS.fitScaleZ
};
// 两个滑杆的 DOM 引用字典，照 scalpInputs 的样子做（全局对象、不进 panelShapeInputs——
// 那套走 editSelectedLocks 逐 lock，本参数是全局，见下方事件绑定处的说明）。
const scalpConformFitInputs = {
  fitScaleX: document.querySelector("#scalpConformFitScaleX"),
  fitScaleZ: document.querySelector("#scalpConformFitScaleZ")
};
const scalpConformFitValueOutputs = {
  fitScaleX: document.querySelector("#scalpConformFitScaleXValue"),
  fitScaleZ: document.querySelector("#scalpConformFitScaleZValue")
};
const scalpArtistInputs = {
  mirrorX: document.querySelector("#scalpMirrorX"),
  sideFlatten: document.querySelector("#scalpSideFlatten"),
  topHeight: document.querySelector("#scalpTopHeight"),
  bottomHeight: document.querySelector("#scalpBottomHeight"),
  hairlineRows: document.querySelector("#scalpHairlineRows"),
  sideBangRows: document.querySelector("#scalpSideBangRows"),
  rootScalpOffset: document.querySelector("#scalpRootOffset"),
  topWidth: document.querySelector("#scalpTopWidth"),
  topDepth: document.querySelector("#scalpTopDepth"),
  middleWidth: document.querySelector("#scalpMiddleWidth"),
  middleDepth: document.querySelector("#scalpMiddleDepth"),
  bottomWidth: document.querySelector("#scalpBottomWidth"),
  bottomDepth: document.querySelector("#scalpBottomDepth")
};
const scalpArtistShape = {
  mirrorX: true,
  sideFlatten: 0.28,
  topHeight: 0.92,
  bottomHeight: 1.32,
  hairlineRows: 9,
  sideBangRows: 5,
  rootScalpOffset: 0,
  topWidth: 0.94,
  topDepth: 1.02,
  middleWidth: 1.05,
  middleDepth: 1.08,
  bottomWidth: 1.1,
  bottomDepth: 1.02
};
const advancedLatticeButton = document.querySelector("#toggleAdvancedLattice");
scalpBuilderDeps.scalpLatticeGroup = scalpLatticeGroup;
scalpBuilderDeps.scalpLatticeLine = scalpLatticeLine;
scalpBuilderDeps.scalpBasePositions = scalpBasePositions;
scalpBuilderDeps.scalpLatticePoints = scalpLatticePoints;
scalpBuilderDeps.scalpLatticeHandles = scalpLatticeHandles;
scalpBuilderDeps.scalpLatticeConnections = scalpLatticeConnections;
scalpBuilderDeps.scalpSurfaceGroup = scalpSurfaceGroup;
scalpBuilderDeps.scalpArtistShape = scalpArtistShape;
scalpBuilder.createScalpLattice();
const modeToolButtons = toolButtons.filter((button) => button.dataset.tool);
const proceduralDrawToolButton = document.querySelector('[data-tool="procedural-draw"]');
const RETIRED_CURVE_LATTICE_SURFACE_TOOLS = new Set(["surface", "surface-loft"]);
const toolModes = {
  select: "translate",
  move: "translate",
  rotate: "rotate",
  scale: "scale",
  relax: "translate",
  "sculpt-move": "translate",
  "sculpt-smooth": "translate",
  place: "translate",
  draw: "translate",
  "procedural-draw": "translate",
  panel: "translate",
  "curve-surface": "translate",
  braid: "translate",
  "surface-loft": "translate",
  "surface-guide": "translate"
};
const presets = {
  front: { x: 0, y: 1.56, z: 0.9, length: 1.25, curve: -0.42, width: 0.24, taper: 0.48, twist: 0, color: "#2c223a", scalpRegion: "bangs" },
  side: { x: 0.48, y: 1.42, z: 0.72, length: 1.65, curve: 0.55, width: 0.2, taper: 0.42, twist: 0.45, color: "#2c223a", scalpRegion: "side-right" },
  back: { x: 0.2, y: 1.42, z: -0.62, length: 2.2, curve: 0.18, width: 0.28, taper: 0.5, twist: -0.2, color: "#2c223a", scalpRegion: "back" },
  twin: { x: 1.12, y: 0.88, z: -0.22, length: 2.6, curve: 0.68, width: 0.32, taper: 0.38, twist: 0.85, color: "#2c223a", scalpRegion: "back" },
  ahoge: { x: 0.06, y: 1.95, z: 0.1, length: 0.92, curve: 1.05, width: 0.08, taper: 0.35, twist: 1.2, color: "#2c223a", scalpRegion: "unassigned" }
};

const authoredPresetProjects = new Map([
  ["layered-side-bun", "./assets/presets/layered-side-bun.ahs?v=20260730-1"]
]);
const presetCatalog = [
  {
    id: "layered-side-bun",
    title: "Layered Side Bun",
    category: "full",
    previewImage: "./assets/presets/layered-side-bun-preview.png?v=20260730-1",
    omitAuthoringAids: true
  }
];
const head = createHeadStore();

// Reference + head/body api (refactor batch A4): deps filled in one batch after the
// scalpBuilderDeps block (all const/let deps defined) and before the default-guide boot
// callback (OBJLoader async, fires after full script evaluation) runs.
const referenceHeadDeps = {};
const referenceHeadApi = createReferenceHeadApi(referenceHeadDeps);

// Radial menu api deps batch (refactor batch A2): all deps are defined by this point
// (last const/let deps: referenceHeadApi / drawSurfaceDynamicButton); the batch takes
// effect here, before the bootstrap init (setRadialMenusEnabled) and before all radial
// pointer/UI listener registrations.
Object.assign(radialMenuDeps, {
  hairState: hairState.state,
  miscState: miscState.state,
  sculptState: sculptState.state,
  sel: sel.state,
  ui: ui.state,
  strandRadialMenu,
  strandRadialActionList,
  strandRadialLine,
  strandRadialCenter,
  toolRadialMenu,
  toolRadialActionList,
  toolRadialLine,
  toolRadialCenter,
  radialMenusPreferenceInput,
  radialShortcutRows,
  drawSurfaceDynamicButton,
  locks,
  selectionSets,
  lastPointer,
  drawFlowApi,
  presetLibraryApi,
  guideApi,
  referenceHeadApi,
  hideOutlinerContextMenu,
  updateInteractionLocks,
  setViewportEditMode,
  setViewportSelectionMode,
  setActiveTool,
  selectionSetCanEditFromSelection,
  selectedLocksInOrder,
  mirrorPartnerFor,
  hiddenStrandsExist,
  mirroredClumpPartners: clumpProceduralApi.mirroredClumpPartners,
  lockedStrandsExist,
  clumpGuideForLock: clumpProceduralApi.clumpGuideForLock,
  getSelectedLock,
  strandIsolationActive,
  selectionCanBecomeClump: clumpProceduralApi.selectionCanBecomeClump,
  selectedProceduralDuplicateSources: proceduralDuplicateApi.selectedProceduralDuplicateSources,
  createClumpFromSelection: clumpProceduralApi.createClumpFromSelection,
  lockSelectedStrands,
  unlockAllStrands,
  hideSelectedStrands,
  unhideHiddenStrands,
  createSelectionSetFromSelection,
  editSelectionSetFromSelection,
  openProceduralDuplicateDialog: proceduralDuplicateApi.openProceduralDuplicateDialog,
  toggleSelectedStrandIsolation,
  deleteSelectedStrands,
  pushUndoState,
  createMirrorPartner,
  updateCount,
  selectLock,
  decoupleMirrorPartner,
  renderLockList,
  createMirroredClump: clumpProceduralApi.createMirroredClump,
  decoupleMirroredClump: clumpProceduralApi.decoupleMirroredClump,
  dissolveClump: clumpProceduralApi.dissolveClump,
  outlinerClumpLocks: clumpProceduralApi.outlinerClumpLocks,
  deleteLocks,
  beginDuplicatePlacement: proceduralDuplicateApi.beginDuplicatePlacement,
  setObjectSpaceEditing,
  setViewPlaneMove,
  setPullMoveEnabled,
  saveBooleanPreference,
  RADIAL_MENUS_PREFERENCE_KEY
});


const GUIDE_HEAD_REFERENCE_SIZE = 26.760177;
const GUIDE_HEAD_TARGET_HEIGHT = 2.8;
const FULL_BODY_HEAD_COUNT = 7;
const FULL_BODY_TARGET_HEIGHT = GUIDE_HEAD_TARGET_HEIGHT * FULL_BODY_HEAD_COUNT;
const FULL_BODY_FRAME_BOTTOM_MARGIN = GUIDE_HEAD_TARGET_HEIGHT * 0.9;
const GUIDE_BOUNDS_EXCLUDED_GROUPS = new Set(["body_clean_nosupport"]);












referenceHeadApi.loadDefaultGuideModel().catch((error) => {
  console.error("Could not load base head OBJ", error);
});






function normalizeHairLayer(layerId) {
  return HAIR_LAYERS.some((layer) => layer.id === layerId) ? layerId : DEFAULT_HAIR_LAYER;
}

function layerOffsetForLock(lock) {
  const layerId = normalizeHairLayer(lock?.hairLayer);
  return Number(groupDefaultsFor(lock?.scalpRegion || "unassigned").layerOffsets?.[layerId] ?? 0);
}

function layerRootOffsetFactor(layerId) {
  return Number(LAYER_ROOT_OFFSET_FACTORS[normalizeHairLayer(layerId)] ?? 0.42);
}

function layerOffsetWeight(pointIndex, pointCount, rootFactor) {
  if (pointCount <= 1) return rootFactor;
  const t = pointIndex / (pointCount - 1);
  return THREE.MathUtils.lerp(rootFactor, 1, THREE.MathUtils.smoothstep(t, 0, 0.38));
}

function applyLayerOffsetDeltaToPoints(points, direction, currentOffset, currentRootFactor, nextOffset, nextRootFactor) {
  if (!points?.length) return;
  points.forEach((point, index) => {
    const current = currentOffset * layerOffsetWeight(index, points.length, currentRootFactor);
    const next = nextOffset * layerOffsetWeight(index, points.length, nextRootFactor);
    point.addScaledVector(direction, next - current);
  });
}

function pointsWithLayerOffset(points, direction, offset, layerId) {
  const rootFactor = layerRootOffsetFactor(layerId);
  return points.map((point, index) => point.clone().addScaledVector(
    direction,
    offset * layerOffsetWeight(index, points.length, rootFactor)
  ));
}

function layerDirectionForLock(lock) {
  if (lock?.rootSurfaceNormal?.lengthSq()) return lock.rootSurfaceNormal.clone().normalize();
  const root = lock?.points?.[0];
  if (root) {
    const center = scalpSurfaceGroup.getWorldPosition(new THREE.Vector3());
    const radial = root.clone().sub(center);
    if (radial.lengthSq() > 0.0001) return radial.normalize();
  }
  return new THREE.Vector3(0, 0, 1);
}

function applyLayerOffset(lock, targetOffset = layerOffsetForLock(lock)) {
  if (!lock?.points?.length) return;
  const currentOffset = Number(lock.layerOffsetApplied ?? 0);
  const nextOffset = Number(targetOffset || 0);
  const currentRootFactor = Number(lock.layerOffsetRootFactorApplied ?? 1);
  const nextRootFactor = layerRootOffsetFactor(lock.hairLayer);
  if (Math.abs(nextOffset - currentOffset) > 0.000001 || Math.abs(nextRootFactor - currentRootFactor) > 0.000001) {
    const direction = layerDirectionForLock(lock);
    applyLayerOffsetDeltaToPoints(lock.points, direction, currentOffset, currentRootFactor, nextOffset, nextRootFactor);
    applyLayerOffsetDeltaToPoints(lock.groupLatticeBasePoints, direction, currentOffset, currentRootFactor, nextOffset, nextRootFactor);
    applyLayerOffsetDeltaToPoints(lock.clumpRestPoints, direction, currentOffset, currentRootFactor, nextOffset, nextRootFactor);
    applyLayerOffsetDeltaToPoints(lock.clumpGuideRestPoints, direction, currentOffset, currentRootFactor, nextOffset, nextRootFactor);
    if (lock.placementFrame) {
      lock.placementFrame.root.addScaledVector(
        direction,
        nextOffset * nextRootFactor - currentOffset * currentRootFactor
      );
    }
  }
  lock.layerOffsetApplied = nextOffset;
  lock.layerOffsetRootFactorApplied = nextRootFactor;
  syncLockFromCurve(lock);
}

function setLockHairLayer(lock, layerId) {
  if (!lock) return;
  const targets = lock.clumpId ? locks.filter((item) => item.clumpId === lock.clumpId) : [lock];
  miscState.state.clumpUpdateInProgress = true;
  targets.forEach((item) => {
    item.hairLayer = normalizeHairLayer(layerId);
    applyLayerOffset(item);
    scalpBuilder.applyLockRootScalpOffset(item);
    updateLockGeometry(item);
  });
  miscState.state.clumpUpdateInProgress = false;
  const guide = clumpProceduralApi.clumpGuideForLock(lock);
  if (guide) clumpProceduralApi.updateClumpMembers(guide);
}

function setGroupLayerOffset(region, layerId, offset) {
  const defaults = groupDefaultsFor(region);
  defaults.layerOffsets = { ...DEFAULT_LAYER_OFFSETS, ...defaults.layerOffsets, [layerId]: Number(offset) };
  locks.forEach((lock) => {
    if ((lock.scalpRegion || "unassigned") !== region || normalizeHairLayer(lock.hairLayer) !== layerId) return;
    applyLayerOffset(lock, defaults.layerOffsets[layerId]);
    scalpBuilder.applyLockRootScalpOffset(lock);
    updateLockGeometry(lock);
  });
  renderLockList();
}

















function quadraticWeights(t) {
  const inverse = 1 - t;
  return [inverse * inverse, 2 * inverse * t, t * t];
}


















const SCALP_TEMPLATE_MATERIAL_REGIONS = {
  lambert2SG: "bangs",
  lambert6SG: "side-bangs-left",
  lambert3SG: "side-bangs-right",
  lambert7SG: "side-left",
  lambert4SG: "side-right",
  lambert5SG: "back",
  bangs: "bangs",
  "front-bangs": "bangs",
  "side-bangs-left": "side-bangs-left",
  "side-bangs-right": "side-bangs-right",
  "side-left": "side-left",
  "side-right": "side-right",
  back: "back"
};
// Fill the remaining scalpBuilder deps (all late consts/lets + app.js helper functions).
// Store state proxies use the .state accessor; plain values are passed by reference.
Object.assign(scalpBuilderDeps, {
  FULL_BODY_FRAME_BOTTOM_MARGIN,
  GUIDE_BOUNDS_EXCLUDED_GROUPS,
  SCALP_BUILDER_STEPS,
  SCALP_REGION_CURVE_VISUALIZATION_ENABLED,
  SCALP_TEMPLATE_MATERIAL_REGIONS,
  activeStrokeSurfaceValue: drawFlowApi.activeStrokeSurfaceValue,
  addCapsuleGuide: guideApi.addCapsuleGuide,
  advancedLatticeButton,
  applyHeadTransform: referenceHeadApi.applyHeadTransform,
  braidAutoShowScalpInput,
  braidScalpOffsetInput,
  braidStrokeActive: drawFlowApi.braidStrokeActive,
  capsuleGuideMode,
  configureTransformControls,
  confirmScalpBuilderButton,
  createOutlinerVisibilityToggle,
  createRootAttachment: ioApi.createRootAttachment,
  curveNetworkSection,
  dataToVector,
  defaultCurveLatticePoints: guideApi.defaultCurveLatticePoints,
  deselectStrands,
  deselectStrandsForGuideEditor,
  drawAutoShowScalpInput,
  drawCapsuleGuideMode,
  drawStrandScalpOffsetInput,
  exitSetupEditor,
  exitSetupEditorLabel,
  generateScalpBuilderButton,
  guideHeadBounds: guideApi.guideHeadBounds,
  guideState: guideState.state,
  head,
  headMeshes: referenceHeadApi.headMeshes,
  headPanel,
  headPlaneIntersectionSegments: referenceHeadApi.headPlaneIntersectionSegments,
  headSetupMode,
  headTransform,
  hierarchyToggle,
  layerOffsetForLock,
  layerRootOffsetFactor,
  liveSurfaceGuide: drawFlowApi.liveSurfaceGuide,
  liveSurfaceStrand: drawFlowApi.liveSurfaceStrand,
  locks,
  mirrorXToggle,
  modeToolButtons,
  panelAutoShowScalpInput,
  panelScalpOffsetInput,
  panelStrokeActive: drawFlowApi.panelStrokeActive,
  pinActiveToolSettingsPanel,
  placeAutoShowScalpInput,
  pointAlongSection,
  pointer,
  proportionalFalloffInput,
  proportionalRadiusInput,
  proportionalToggle,
  pushUndoState,
  quadraticWeights,
  rayFromViewportEvent,
  raycaster,
  renderGuideOutliner: guideApi.renderGuideOutliner,
  renderLockList,
  scalpArtistInputs,
  scalpArtistShape,
  scalpBasePositions,
  scalpBrushCursor,
  scalpBrushSizeInput,
  scalpBuilderAxisLabel,
  scalpBuilderContours,
  scalpBuilderGroup,
  scalpBuilderInstruction,
  scalpBuilderMode,
  scalpBuilderPanel,
  scalpBuilderPlanePositions,
  scalpBuilderPositionOutput,
  scalpBuilderShowTemplateInput,
  scalpBuilderStepLabel,
  scalpBuilderStepName,
  scalpBuilderTemplateOverlay,
  scalpBuilderTransparentHeadInput,
  scalpGuideMeshFileInput,
  scalpGuideSourceInput,
  scalpInputs,
  scalpLatticeConnections,
  scalpLatticeGroup,
  scalpLatticeHandles,
  scalpLatticeLine,
  scalpLatticePoints,
  scalpPaintPanel,
  scalpPaintToggle,
  scalpPanel,
  scalpQuads,
  scalpRegionButtons,
  scalpRenderGeometry,
  scalpRoughScale,
  scalpRoughScaleInputs,
  scalpRoughScalePivot,
  scalpRoughScaleValues,
  scalpSelectionOutline,
  scalpSetupMenu,
  scalpSetupToggle,
  scalpSurface,
  // Scalp Conform 拟合椭球（全局，第五版）：scalp-builder.js 的 syncScalpConformFitInputs /
  // restoreAuthoredScalpForStateRestore 要读这三个。纯数据对象本体注入，同 scalpSurface。
  scalpConformFit,
  scalpConformFitInputs,
  scalpConformFitValueOutputs,
  scalpSurfaceGeometry,
  scalpSurfaceGroup,
  scalpSurfaceMesh,
  scalpSurfaceWire,
  sel: sel.state,
  setActiveTool,
  setAppMenuOpen,
  setHeadReferenceTransparency: referenceHeadApi.setHeadReferenceTransparency,
  setMirrorXEditing,
  setViewportEditMode,
  showOutlinerContextMenu,
  spaceToggle,
  surfaceGuideDefaults,
  syncDisplayVisibilityInputs,
  syncGuideInputs: guideApi.syncGuideInputs,
  syncHeadTransformInputs: referenceHeadApi.syncHeadTransformInputs,
  syncLockFromCurve,
  syncRootAttachmentMetadata: ioApi.syncRootAttachmentMetadata,
  syncViewportDrawSettings,
  templatePlaneIntersectionSegments,
  trianglePlaneIntersections: referenceHeadApi.trianglePlaneIntersections,
  updateAttributeEditorMode,
  updateCount,
  updateCurveObjects,
  updateGuideViewToggle: guideApi.updateGuideViewToggle,
  updateInteractionLocks,
  updateLockGeometry,
  updatePlacementStatus: placementApi.updatePlacementStatus,
  updateViewportToolVisibility: guideApi.updateViewportToolVisibility,
  upperContourCurve,
});






























function templatePlaneIntersectionSegments(template, axis, planePosition) {
  const segments = [];
  template.faces.forEach((face) => {
    [[0, 1, 2], [0, 2, 3]].forEach((corners) => {
      const intersections = referenceHeadApi.trianglePlaneIntersections(
        template.vertices[face.indices[corners[0]]],
        template.vertices[face.indices[corners[1]]],
        template.vertices[face.indices[corners[2]]],
        axis,
        planePosition
      );
      if (intersections.length === 2) segments.push(intersections);
    });
  });
  return segments;
}

function upperContourCurve(segments, axis, planePosition, sampleCount = 17) {
  const endpoints = segments.flat();
  if (!endpoints.length) return null;
  const minX = Math.min(...endpoints.map((point) => point.x));
  const maxX = Math.max(...endpoints.map((point) => point.x));
  const span = Math.max(0.0001, maxX - minX);
  const points = [];
  for (let sample = 0; sample < sampleCount; sample += 1) {
    const x = THREE.MathUtils.lerp(minX, maxX, sample / (sampleCount - 1));
    const candidates = [];
    segments.forEach(([start, end]) => {
      const minimum = Math.min(start.x, end.x) - span * 0.0001;
      const maximum = Math.max(start.x, end.x) + span * 0.0001;
      if (x < minimum || x > maximum) return;
      const delta = end.x - start.x;
      if (Math.abs(delta) < 0.00001) {
        candidates.push(start.y, end.y);
        return;
      }
      const amount = THREE.MathUtils.clamp((x - start.x) / delta, 0, 1);
      candidates.push(THREE.MathUtils.lerp(start.y, end.y, amount));
    });
    if (!candidates.length) {
      const nearest = endpoints.reduce((best, point) => (
        Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best
      ), endpoints[0]);
      candidates.push(nearest.y);
    }
    const point = new THREE.Vector3(x, Math.max(...candidates), 0);
    point[axis] = planePosition;
    points.push(point);
  }
  return { position: planePosition, points };
}

function hermitePoint(start, end, previous, next, amount, segmentSpan, previousSpan, nextSpan) {
  const startTangent = end.clone().sub(previous).multiplyScalar(segmentSpan / Math.max(0.0001, previousSpan));
  const endTangent = next.clone().sub(start).multiplyScalar(segmentSpan / Math.max(0.0001, nextSpan));
  const t2 = amount * amount;
  const t3 = t2 * amount;
  return start.clone().multiplyScalar(2 * t3 - 3 * t2 + 1)
    .add(startTangent.multiplyScalar(t3 - 2 * t2 + amount))
    .add(end.clone().multiplyScalar(-2 * t3 + 3 * t2))
    .add(endTangent.multiplyScalar(t3 - t2));
}

function curveNetworkSection(curves, position) {
  const ordered = curves.slice().sort((a, b) => a.position - b.position);
  if (position <= ordered[0].position) return ordered[0].points.map((point) => point.clone());
  if (position >= ordered.at(-1).position) return ordered.at(-1).points.map((point) => point.clone());
  let upperIndex = ordered.findIndex((curve) => curve.position >= position);
  upperIndex = Math.max(1, upperIndex);
  const lowerIndex = upperIndex - 1;
  const lower = ordered[lowerIndex];
  const upper = ordered[upperIndex];
  const previous = ordered[Math.max(0, lowerIndex - 1)];
  const next = ordered[Math.min(ordered.length - 1, upperIndex + 1)];
  const span = Math.max(0.0001, upper.position - lower.position);
  const amount = THREE.MathUtils.clamp((position - lower.position) / span, 0, 1);
  return lower.points.map((point, index) => {
    const result = hermitePoint(
      point,
      upper.points[index],
      previous.points[index],
      next.points[index],
      amount,
      span,
      Math.max(0.0001, upper.position - previous.position),
      Math.max(0.0001, next.position - lower.position)
    );
    result.z = position;
    return result;
  });
}

function pointAlongSection(section, amount) {
  const scaled = THREE.MathUtils.clamp(amount, 0, 1) * (section.length - 1);
  const index = Math.min(section.length - 2, Math.floor(scaled));
  return section[index].clone().lerp(section[index + 1], scaled - index);
}

function longestStitchedContour(segments) {
  if (!segments.length) return [];
  const endpoints = segments.flat();
  const bounds = new THREE.Box3().setFromPoints(endpoints);
  const size = bounds.getSize(new THREE.Vector3());
  const tolerance = Math.max(size.x, size.y, size.z) * 0.00025 || 0.0001;
  const nodes = new Map();
  const edges = [];
  const nodeForPoint = (point) => {
    const key = `${Math.round(point.x / tolerance)},${Math.round(point.y / tolerance)},${Math.round(point.z / tolerance)}`;
    if (!nodes.has(key)) nodes.set(key, { point: point.clone(), neighbors: new Set() });
    return key;
  };
  segments.forEach(([start, end]) => {
    const startKey = nodeForPoint(start);
    const endKey = nodeForPoint(end);
    if (startKey === endKey) return;
    nodes.get(startKey).neighbors.add(endKey);
    nodes.get(endKey).neighbors.add(startKey);
    edges.push([startKey, endKey]);
  });
  const visitedNodes = new Set();
  const components = [];
  nodes.forEach((node, key) => {
    if (visitedNodes.has(key)) return;
    const stack = [key];
    const component = [];
    visitedNodes.add(key);
    while (stack.length) {
      const current = stack.pop();
      component.push(current);
      nodes.get(current).neighbors.forEach((neighbor) => {
        if (visitedNodes.has(neighbor)) return;
        visitedNodes.add(neighbor);
        stack.push(neighbor);
      });
    }
    components.push(component);
  });
  const component = components.sort((a, b) => b.length - a.length)[0] || [];
  const componentSet = new Set(component);
  const start = component.find((key) => [...nodes.get(key).neighbors].filter((item) => componentSet.has(item)).length === 1)
    || component[0];
  const ordered = [];
  const usedEdges = new Set();
  let previous = null;
  let current = start;
  while (current) {
    ordered.push(nodes.get(current).point.clone());
    const candidates = [...nodes.get(current).neighbors].filter((neighbor) => {
      if (!componentSet.has(neighbor) || neighbor === previous) return false;
      const edgeKey = [current, neighbor].sort().join("|");
      return !usedEdges.has(edgeKey);
    });
    if (!candidates.length) break;
    const next = candidates[0];
    usedEdges.add([current, next].sort().join("|"));
    previous = current;
    current = next;
    if (current === start) break;
    if (ordered.length > edges.length + 2) break;
  }
  return ordered;
}

function constructionCurveFromSegments(segments, step, planePosition) {
  if (step.axis === "z") {
    return upperContourCurve(segments, "z", planePosition, 33)?.points || [];
  }
  const contour = longestStitchedContour(segments);
  if (contour.length < 3) return contour;
  const curve = new THREE.CatmullRomCurve3(contour, true, "centripetal");
  return curve.getSpacedPoints(95).slice(0, -1);
}











function exitSetupEditors() {
  scalpBuilder.setScalpSetupMenuOpen(false);
  if (scalpState.state.scalpBuilderEditing) scalpBuilder.setScalpBuilderEditing(false);
  if (scalpState.state.scalpPaintEditing) scalpBuilder.setScalpPaintEditing(false);
  if (sculptState.state.headSetupEditing) referenceHeadApi.setHeadSetupEditing(false);
  if (scalpState.state.scalpShapeEditing) scalpBuilder.setScalpShapeEditing(false);
  if (sculptState.state.capsuleGuideEditing) guideApi.setCapsuleGuideEditing(false);
}


function syncAppMenuVisibility() {
  const menuOpen = appMenuDropdowns.some((menu) => !menu.classList.contains("hidden"));
  document.body.classList.toggle("app-menu-open", menuOpen);
  placementStatus.style.visibility = menuOpen ? "hidden" : "";
}

function closeAppMenus(exceptMenu = null) {
  appMenuDropdowns.forEach((menu) => {
    if (menu === exceptMenu) return;
    menu.classList.add("hidden");
    menu.closest(".app-menu-shell")?.querySelector(".app-menu-trigger")?.setAttribute("aria-expanded", "false");
  });
  recentProjectsSubmenu.classList.add("hidden");
  recentProjectsMenu.setAttribute("aria-expanded", "false");
  syncAppMenuVisibility();
}

function setAppMenuOpen(trigger, menu, open) {
  closeAppMenus(open ? menu : null);
  menu.classList.toggle("hidden", !open);
  trigger.setAttribute("aria-expanded", String(open));
  syncAppMenuVisibility();
}

function setTurntableActive(enabled) {
  viewportState.state.turntableActive = Boolean(enabled);
  toggleTurntableButton.classList.toggle("active", viewportState.state.turntableActive);
  toggleTurntableButton.setAttribute("aria-pressed", String(viewportState.state.turntableActive));
  turntableMenuState.textContent = viewportState.state.turntableActive ? "On" : "Off";
  turntablePanel.classList.toggle("hidden", !viewportState.state.turntableActive);
  if (viewportState.state.turntableActive) setAttributeEditorTab("main");
}

// ===== Wind preview (procedural viewport preview, non-destructive) =====
// Per-lock caches live in a module-level WeakMap keyed by the lock OBJECT — never on the
// lock itself, so no new field can leak into the .ahs snapshot/serialize format (hard
// requirement: the file format must not change). Geometry is deformed in place per frame
// and bitwise-restored from the rest snapshots when the preview is turned off.
const windPreviewCache = new WeakMap();
// Noise is rebuilt lazily whenever windSeed changes (noise is stable per seed).
const windNoiseCache = { seed: null, noise: null };

const WIND_VALUE_FORMATS = {
  windDirection: (value) => `${Math.round(Number(value))}°`,
  windStrength: (value) => Number(value).toFixed(1),
  windFrequency: (value) => Number(value).toFixed(2),
  windTurbulence: (value) => Number(value).toFixed(2),
  windTurbulenceScale: (value) => Number(value).toFixed(1),
  windGustStrength: (value) => Number(value).toFixed(1),
  windGustFreq: (value) => Number(value).toFixed(2),
  windRootExponent: (value) => Number(value).toFixed(2),
  windStrandRandom: (value) => Number(value).toFixed(2),
  windSeed: (value) => String(Math.round(Number(value)))
};

// Deterministic 32-bit FNV-1a hash of lock.id → a lock's per-strand wind values are stable
// across sessions regardless of locks[] order (strandIndex falls back to the array index;
// both documented per contract).
function windStrandSeedFor(lock) {
  let hash = 0x811c9dc5;
  const text = String(lock.id || "");
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
function windStrandIndexFor(lock) {
  return locks.indexOf(lock);
}

// Rest chain points (rows * 3): sampled from the same CatmullRomCurve3(lock.points) that
// curveFrameAt uses internally (curveFrameAt itself does not expose its point), with
// t = i / (rows - 1) per contract.
function windChainPointsFor(lock, rows) {
  const curve = new THREE.CatmullRomCurve3(lock.points);
  const chain = new Float32Array(rows * 3);
  for (let index = 0; index < rows; index += 1) {
    const t = rows <= 1 ? 0 : index / (rows - 1);
    const point = curve.getPoint(THREE.MathUtils.clamp(t, 0, 1));
    chain[index * 3] = point.x;
    chain[index * 3 + 1] = point.y;
    chain[index * 3 + 2] = point.z;
  }
  return chain;
}

function windChainPointAt(chain, index) {
  const offset = index * 3;
  return { x: chain[offset], y: chain[offset + 1], z: chain[offset + 2] };
}

// Live params assembled from the store every tick (field names per the windAngleAt
// contract); windSeed feeds the noise, windStrandRandom is consumed inside wind-preview.
function windParamsFromState(state) {
  return {
    windDirectionDeg: state.windDirection,
    windStrength: state.windStrength,
    windFrequency: state.windFrequency,
    windTurbulence: state.windTurbulence,
    windTurbulenceScale: state.windTurbulenceScale,
    windGustStrength: state.windGustStrength,
    windGustFreq: state.windGustFreq,
    windRootExponent: state.windRootExponent
  };
}

function windNoiseForSeed(seed) {
  if (!windNoiseCache.noise || windNoiseCache.seed !== seed) {
    // createNoise4D is re-exported by wind-preview for callers (vendored simplex noise).
    windNoiseCache.seed = seed;
    windNoiseCache.noise = windPreview.createNoise4D(windPreview.mulberry32(seed));
  }
  return windNoiseCache.noise;
}

// Build the per-lock cache: rest attribute snapshots (Float32Array copies) + chain points
// + per-strand wind values. Skipped when the mesh has no per-vertex row data.
function buildWindPreviewCache(lock) {
  if (windPreviewCache.has(lock)) return windPreviewCache.get(lock);
  const geometry = lock?.mesh?.geometry;
  if (!geometry) return null;
  const gridRows = geometry.userData?.gridRowIndices; // per-vertex row (float); absent → skip
  if (!gridRows) return null;
  let rows = Number(geometry.userData?.gridRows) || 0;
  if (rows < 2) rows = Math.round(Number(lock.lengthSegments || 26)) + 1;
  if (rows < 2) return null;
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const tangents = geometry.getAttribute("tangent");
  if (!positions) return null;
  const cache = {
    geometry, // identity guard: drop the cache if the geometry is replaced behind our back
    rows,
    gridRows,
    restPos: positions.array.slice(),
    restNormal: normals ? normals.array.slice() : null,
    restTangent: tangents ? tangents.array.slice() : null,
    chainPoints: windChainPointsFor(lock, rows),
    perStrand: windPreview.perStrandWind(windStrandSeedFor(lock), windStrandIndexFor(lock), windStore.state.windStrandRandom)
  };
  windPreviewCache.set(lock, cache);
  return cache;
}

// Write the rest snapshot back into the live attributes (bitwise restore). Length guards
// make stale caches (geometry replaced without rebuildLockGeometry) a safe no-op.
function windRestoreLockGeometry(lock, cache) {
  const geometry = lock?.mesh?.geometry;
  if (!geometry) return;
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const tangents = geometry.getAttribute("tangent");
  if (positions && cache.restPos && positions.array.length === cache.restPos.length) {
    positions.array.set(cache.restPos);
    positions.needsUpdate = true;
  }
  if (normals && cache.restNormal && normals.array.length === cache.restNormal.length) {
    normals.array.set(cache.restNormal);
    normals.needsUpdate = true;
  }
  if (tangents && cache.restTangent && tangents.array.length === cache.restTangent.length) {
    tangents.array.set(cache.restTangent);
    tangents.needsUpdate = true;
  }
  geometry.computeBoundingSphere();
}

// One deformation pass: advance windTime while playing, then deform every cached lock in
// place (positions/normals/tangents mutated directly; rest data stays untouched).
function windPreviewTick(deltaSeconds) {
  const state = windStore.state;
  if (!state.windPreviewActive) return;
  if (state.windPlaying) state.windTime += deltaSeconds;
  const noise = windNoiseForSeed(state.windSeed);
  const params = windParamsFromState(state);
  locks.forEach((lock) => {
    const cache = windPreviewCache.get(lock);
    if (!cache || !lock?.mesh?.geometry) return;
    if (cache.geometry !== lock.mesh.geometry) {
      windPreviewCache.delete(lock); // stale cache → drop (new geometry is not deformed)
      return;
    }
    const geometry = lock.mesh.geometry;
    const positions = geometry.getAttribute("position");
    const normals = geometry.getAttribute("normal");
    const tangents = geometry.getAttribute("tangent");
    if (!positions) return;
    // deformVertexData computes pos' = chainPoint + rotate(q, restPos − chainPoint): it
    // treats the input arrays AS the rest pose. Reset to rest first, or the rotation
    // would compound on last frame's already-deformed buffer every tick.
    positions.array.set(cache.restPos);
    if (normals && cache.restNormal) normals.array.set(cache.restNormal);
    if (tangents && cache.restTangent) tangents.array.set(cache.restTangent);
    const rowQuats = windPreview.windRowQuats(
      cache.rows,
      (index) => windChainPointAt(cache.chainPoints, index),
      params,
      cache.perStrand,
      noise,
      state.windTime
    );
    windPreview.deformVertexData({
      positions: positions.array,
      normals: normals ? normals.array : null,
      tangents: tangents ? tangents.array : null,
      gridRows: cache.gridRows,
      rowQuats,
      chainPoints: cache.chainPoints
    });
    positions.needsUpdate = true;
    if (normals) normals.needsUpdate = true;
    if (tangents) tangents.needsUpdate = true;
    geometry.computeBoundingSphere();
  });
}

// Toggle the wind preview. On: build caches for every meshed lock and tick once so a
// static pose appears immediately. Off: bitwise-restore every cached lock and drop the
// caches. All DOM access is defensive (elements land with the parallel index.html).
function setWindPreviewActive(active) {
  const state = windStore.state;
  active = Boolean(active);
  state.windPreviewActive = active;
  if (active) {
    locks.forEach((lock) => {
      if (lock?.mesh?.geometry) buildWindPreviewCache(lock);
    });
  } else {
    locks.forEach((lock) => {
      const cache = windPreviewCache.get(lock);
      if (!cache) return;
      windRestoreLockGeometry(lock, cache);
      windPreviewCache.delete(lock);
    });
    // windPlaying is intentionally NOT reset: like the Turntable (active = moving), the
    // preview resumes the last play state on reactivation (store default is playing).
  }
  if (windPreviewEnableButton) {
    windPreviewEnableButton.classList.toggle("active", active);
    windPreviewEnableButton.setAttribute("aria-pressed", String(active));
  }
  if (windPreviewEnableState) windPreviewEnableState.textContent = active ? "On" : "Off";
  if (windPlayPauseButton) windPlayPauseButton.textContent = state.windPlaying ? "Pause" : "Play";
  if (active && windPreviewWindow && !windPreviewWindow.open) windPreviewWindow.show();
  if (active) windPreviewTick(0);
}































function setOutlinerTab(tab) {
  sel.state.activeOutlinerTab = ["strands", "guides", "references"].includes(tab) ? tab : "strands";
  const guidesActive = sel.state.activeOutlinerTab === "guides";
  const referencesActive = sel.state.activeOutlinerTab === "references";
  const strandsActive = sel.state.activeOutlinerTab === "strands";
  strandOutlinerTab.classList.toggle("active", strandsActive);
  strandOutlinerTab.setAttribute("aria-selected", String(strandsActive));
  guideOutlinerTab.classList.toggle("active", guidesActive);
  guideOutlinerTab.setAttribute("aria-selected", String(guidesActive));
  referenceOutlinerTab.classList.toggle("active", referencesActive);
  referenceOutlinerTab.setAttribute("aria-selected", String(referencesActive));
  lockList.classList.toggle("hidden", !strandsActive);
  guideOutliner.classList.toggle("hidden", !guidesActive);
  referenceOutliner.classList.toggle("hidden", !referencesActive);
  if (guidesActive) guideApi.renderGuideOutliner();
  if (referencesActive) referenceHeadApi.renderReferenceOutliner();
}

function effectiveViewportSelectionMode() {
  return sculptState.state.viewportEditMode === "reference" ? "object" : sel.state.viewportSelectionMode;
}

function componentEditModeActive() {
  return effectiveViewportSelectionMode() === "component";
}

function selectionToolSupportsPicking(tool = sel.state.activeTool) {
  return ["select", "move", "rotate", "scale"].includes(tool)
    || (tool === "relax" && sculptState.state.viewportEditMode === "strand");
}

function syncViewportSelectionModeControl() {
  const effectiveMode = effectiveViewportSelectionMode();
  const referenceWorkspace = sculptState.state.viewportEditMode === "reference";
  viewportSelectionModeControl?.classList.toggle("object-only", referenceWorkspace);
  viewportSelectionModeButtons.forEach((button) => {
    const mode = button.dataset.selectionMode;
    const active = mode === effectiveMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.disabled = referenceWorkspace && mode === "component";
    button.title = referenceWorkspace && mode === "component"
      ? "References only support Object edit mode"
      : `${mode === "object" ? "Object" : "Component"} edit mode`;
  });
}

function refreshSelectionModeVisuals() {
  const componentMode = componentEditModeActive();
  transformControls.detach();
  sculptState.state.activeHandleEdit = null;
  hairState.state.activeStrandObjectTransform = null;
  guideState.state.activeGuideObjectTransform = null;
  guideApi.clearMultiPointSelection();
  sel.state.selectedPoint = null;
  sel.state.selectedCurveLatticePoint = null;
  sel.state.selectedSurfaceObjectAnchorId = null;
  locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
  guides.forEach((guide) => {
    const selected = guide.id === sel.state.selectedGuideId;
    if (guide.handlesGroup) {
      guide.handlesGroup.visible = componentMode
        && selected
        && (guide.type !== "capsule" || sculptState.state.capsuleGuideEditing);
    }
    if (guide.loopLinesGroup) {
      guide.loopLinesGroup.visible = componentMode && selected && sculptState.state.capsuleGuideEditing;
    }
  });
  if (!componentMode && sculptState.state.viewportEditMode === "strand") attachStrandObjectTransform();
  if (!componentMode && sculptState.state.viewportEditMode === "guide") attachGuideObjectTransform();
  updateSelectedPointLabel();
  updateViewPlaneGrid();
  guideApi.updateViewportToolVisibility();
  placementApi.updatePlacementStatus();
  syncStrandObjectTransformPanel();
}

function setViewportSelectionMode(mode) {
  const nextMode = mode === "object" ? "object" : "component";
  if (sculptState.state.viewportEditMode === "reference" && nextMode === "component") return;
  if (sel.state.viewportSelectionMode === nextMode) {
    syncViewportSelectionModeControl();
    return;
  }
  sel.state.viewportSelectionMode = nextMode;
  syncViewportSelectionModeControl();
  refreshSelectionModeVisuals();
}

function setViewportEditMode(mode, options = {}) {
  clearCurvePointTopologyCursor();
  const nextMode = ["strand", "guide", "reference"].includes(mode) ? mode : "strand";
  const switchingMode = nextMode !== sculptState.state.viewportEditMode;
  const clearSelection = options.clearSelection !== false;
  const activateSelect = options.activateSelect !== false;
  if (switchingMode && options.exitSetupEditors !== false) exitSetupEditors();
  sculptState.state.viewportEditMode = nextMode;
  viewportEditModeInput.value = nextMode;
  syncViewportSelectionModeControl();
  if (nextMode !== "reference") {
    referenceHeadApi.finishReferenceOverlayDrag(null, { cancel: true });
    referenceHeadApi.finishReferenceCrop(null, { cancel: true });
    renderer.domElement.style.cursor = "";
  }

  if (clearSelection) {
    const selectionMatchesMode = (
      (nextMode === "strand" && Boolean(sel.state.selectedId || sel.state.selectedStrandGroup))
      || (nextMode === "guide" && Boolean(sel.state.selectedGuideId))
      || (nextMode === "reference" && Boolean(sel.state.selectedReferenceImageId))
    );
    if (!selectionMatchesMode) {
      deselectStrands();
      sel.state.selectedReferenceImageId = null;
      referenceHeadApi.updateReferenceSelectionVisuals();
      referenceHeadApi.renderReferenceImagePanel();
    }
  }

  setOutlinerTab(nextMode === "strand" ? "strands" : nextMode === "guide" ? "guides" : "references");
  referenceHeadApi.setReferenceImagePanelOpen(nextMode === "reference");
  if (nextMode === "guide") {
    if (switchingMode) setMirrorXEditing(true);
    setAttributeEditorTab("main");
  }
  if (activateSelect && sel.state.activeTool !== "select") setActiveTool("select");
  guideApi.updateGuideControlsVisibility();
  updateAttributeEditorMode();
  syncMoveCurveControls();
  placementApi.updatePlacementStatus();
}

function createOutlinerVisibilityToggle({ visible, partial = false, label, onToggle }) {
  const toggle = document.createElement("button");
  toggle.className = `outliner-visibility-toggle${visible ? " visible" : ""}${partial ? " partial" : ""}`;
  toggle.type = "button";
  toggle.title = `${visible ? "Hide" : "Show"} ${label}`;
  toggle.setAttribute("aria-label", toggle.title);
  toggle.setAttribute("aria-pressed", String(visible));
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    onToggle();
  });
  return toggle;
}

function setLocksOutlinerVisibility(targets, visible) {
  targets.forEach((lock) => {
    lock.outlinerVisible = Boolean(visible);
    if (visible) {
      visibleStrandRegions.add(lock.scalpRegion || "unassigned");
      visibleStrandLayers.add(normalizeHairLayer(lock.hairLayer));
    }
  });
  applyDisplayVisibilityFilters();
  renderLockList();
}



function normalizeOutlinerName(value, fallback) {
  const name = typeof value === "string" ? value.trim().slice(0, 60) : "";
  return name || fallback;
}

function beginOutlinerRename(label, { value, onCommit, rerender }) {
  if (!label?.parentElement) return;
  const originalValue = normalizeOutlinerName(value, "Untitled");
  const input = document.createElement("input");
  input.className = "outliner-rename-input";
  input.type = "text";
  input.maxLength = 60;
  input.value = originalValue;
  input.setAttribute("aria-label", "Rename");
  label.replaceWith(input);
  let finished = false;
  const finish = (commit) => {
    if (finished) return;
    finished = true;
    const nextValue = normalizeOutlinerName(input.value, originalValue);
    if (commit && nextValue !== originalValue) {
      pushUndoState();
      onCommit(nextValue);
    }
    rerender();
  };
  ["pointerdown", "click", "dblclick"].forEach((type) => {
    input.addEventListener(type, (event) => event.stopPropagation());
  });
  input.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
    }
  });
  input.addEventListener("blur", () => finish(true));
  queueMicrotask(() => {
    input.focus();
    input.select();
  });
}

function handleOutlinerRenameClick(event, options) {
  if (event.detail >= 2) {
    event.preventDefault();
    event.stopPropagation();
    beginOutlinerRename(options.label, options);
    return;
  }
  options.onSelect?.(event);
}







const SUPPORTED_REFERENCE_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif"
]);

// Reference + head/body api deps batch (refactor batch A4): all deps are defined by this point
// (last const/let deps: scalpBuilder batch + reference/head DOM); the batch takes effect here,
// before the default-guide boot callback (OBJLoader async) and all runtime calls.
Object.assign(referenceHeadDeps, {
  FULL_BODY_TARGET_HEIGHT,
  GUIDE_HEAD_REFERENCE_SIZE,
  GUIDE_HEAD_TARGET_HEIGHT,
  SUPPORTED_REFERENCE_IMAGE_TYPES,
  applyCharacterMeshDisplayVisibility,
  camera,
  cardinalAxisKey,
  clearStrandSelectionState,
  configureTransformControls,
  controls,
  createOutlinerVisibilityToggle,
  deselectStrandsForGuideEditor,
  frameViewportBounds,
  fullBodyMeshFileInput,
  guideApi,
  guideState: guideState.state,
  guides,
  handleOutlinerRenameClick,
  head: head.state,
  headMeshFileInput,
  headTransform,
  headTransformInputs,
  headTransformValues,
  isCameraInSnappedView,
  locks,
  placementApi,
  pushUndoState,
  raycaster,
  ref: ref.state,
  referenceCropHandleElements,
  referenceCropHandles,
  referenceGroupOpen,
  referenceImageControls,
  referenceImageDropTarget,
  referenceImageEmpty,
  referenceImageFile,
  referenceImageFlipX,
  referenceImageGroup,
  referenceImageList,
  referenceImageOpacity,
  referenceImageOpacityValue,
  referenceImagePanel,
  referenceImageSnappedViewOnly,
  referenceImageSnappedViewOnlyLabel,
  referenceImageSnappedViewOnlyRow,
  referenceImageType,
  referenceImageView,
  referenceImageViewRow,
  referenceImageVisible,
  referenceImages,
  referenceOutliner,
  referenceOverlayDropMarker,
  referencePlaneHint,
  referencePlaneInFront,
  referencePlaneInFrontRow,
  refreshRebuildCurveDialog,
  renderLockList,
  renderer,
  resetReferenceImageCrop,
  scalpBuilder,
  scalpState: scalpState.state,
  scalpSurfaceGroup,
  scene,
  sculptState: sculptState.state,
  sel: sel.state,
  setOrthographicView,
  setOutlinerTab,
  setStrandSelectionVisual,
  setViewportEditMode,
  showOutlinerContextMenu,
  sideNamingDisplayId,
  strandVisibleForDisplay,
  syncDisplayVisibilityInputs,
  syncOrthographicFramingFromDistance,
  transformControls,
  ui: ui.state,
  updateAttributeEditorMode,
  updateCameraProjectionForViewport,
  updateCurveObjects,
  updateInteractionLocks,
  viewPlaneNormal,
  viewport,
  viewportPanel,
  viewportReferenceImages,
  viewportState: viewportState.state,
});





































function strandPassesDisplayFilters(lock) {
  if (!lock) return false;
  const region = lock.scalpRegion || "unassigned";
  const layer = normalizeHairLayer(lock.hairLayer);
  return lock.outlinerVisible !== false
    && visibleStrandRegions.has(region)
    && visibleStrandLayers.has(layer);
}

function strandVisibleForDisplay(lock) {
  return strandPassesDisplayFilters(lock)
    && (!sel.state.isolatedStrandIds || sel.state.isolatedStrandIds.has(lock.id));
}

function strandAvailableForViewportInteraction(lock) {
  return strandVisibleForDisplay(lock) && !lock.locked;
}

function lockedStrandsExist() {
  return locks.some((lock) => lock.locked);
}

function hiddenStrandsExist() {
  return locks.some((lock) => lock.outlinerVisible === false);
}

function hideSelectedStrands() {
  const targets = selectedLocksInOrder().filter((lock) => lock.outlinerVisible !== false);
  if (!targets.length) return false;
  pushUndoState();
  setLocksOutlinerVisibility(targets, false);
  deselectStrands();
  placementApi.updatePlacementStatus();
  return true;
}

function unhideHiddenStrands() {
  const targets = locks.filter((lock) => lock.outlinerVisible === false);
  if (!targets.length) return false;
  pushUndoState();
  setLocksOutlinerVisibility(targets, true);
  placementApi.updatePlacementStatus();
  return true;
}

function strandIsolationActive() {
  return sel.state.isolatedStrandIds instanceof Set && sel.state.isolatedStrandIds.size > 0;
}

function setStrandIsolation(lockIds = null) {
  const validIds = new Set(locks.map((lock) => lock.id));
  const nextIds = Array.isArray(lockIds)
    ? lockIds.filter((id) => validIds.has(id))
    : [];
  sel.state.isolatedStrandIds = nextIds.length ? new Set(nextIds) : null;
  applyStrandDisplayVisibility();
  renderLockList();
  placementApi.updatePlacementStatus();
  return strandIsolationActive();
}

function toggleSelectedStrandIsolation() {
  if (strandIsolationActive()) {
    setStrandIsolation();
    return true;
  }
  const selectedIds = selectedLocksInOrder().map((lock) => lock.id);
  if (!selectedIds.length) return false;
  setStrandIsolation(selectedIds);
  return true;
}

function syncVisibilityParent(parent, children) {
  if (!parent || !children.length) return;
  const checkedCount = children.filter((input) => input.checked).length;
  parent.checked = checkedCount === children.length;
  parent.indeterminate = checkedCount > 0 && checkedCount < children.length;
}

function syncDisplayVisibilityInputs() {
  regionVisibilityInputs.forEach((input) => {
    input.checked = visibleStrandRegions.has(input.dataset.regionVisibility);
  });
  layerVisibilityInputs.forEach((input) => {
    input.checked = visibleStrandLayers.has(input.dataset.layerVisibility);
  });
  if (scalpDisplayVisibilityInput) scalpDisplayVisibilityInput.checked = scalpState.state.scalpGuideVisible;
  if (capsuleDisplayVisibilityInput) capsuleDisplayVisibilityInput.checked = guideState.state.capsuleGuidesVisible;
  if (curveLatticeDisplayVisibilityInput) curveLatticeDisplayVisibilityInput.checked = guideState.state.curveLatticeGuidesVisible;
  const hasCharacterMesh = Boolean(guideState.state.guideModel);
  const hasBodyMesh = Boolean(guideState.state.guideModel?.userData?.fullBodyReference);
  if (headMeshDisplayVisibilityInput) {
    headMeshDisplayVisibilityInput.checked = hairState.state.headMeshVisible;
    headMeshDisplayVisibilityInput.disabled = !hasCharacterMesh || hasBodyMesh;
  }
  if (bodyMeshDisplayVisibilityInput) {
    bodyMeshDisplayVisibilityInput.checked = hairState.state.bodyMeshVisible;
    bodyMeshDisplayVisibilityInput.disabled = !hasCharacterMesh || !hasBodyMesh;
  }
  syncVisibilityParent(allRegionsVisibilityInput, regionVisibilityInputs);
  syncVisibilityParent(allLayersVisibilityInput, layerVisibilityInputs);
  syncVisibilityParent(
    allGuidesVisibilityInput,
    [scalpDisplayVisibilityInput, capsuleDisplayVisibilityInput, curveLatticeDisplayVisibilityInput].filter(Boolean)
  );
  guideApi.updateGuideViewToggle();
}

function applyCharacterMeshDisplayVisibility() {
  if (!guideState.state.guideModel) return;
  guideState.state.guideModel.visible = guideState.state.guideModel.userData.fullBodyReference
    ? bodyMeshVisible
    : hairState.state.headMeshVisible;
}

function applyStrandDisplayVisibility() {
  locks.forEach((lock) => {
    const visible = strandVisibleForDisplay(lock);
    lock.mesh.visible = visible;
    if (!visible && lock.curveObjects) lock.curveObjects.group.visible = false;
    if (!strandPassesDisplayFilters(lock)) sel.state.selectedStrandIds.delete(lock.id);
  });
  const selectedLock = getSelectedLock();
  if (
    selectedLock
    && !strandPassesDisplayFilters(selectedLock)
  ) {
    const fallback = locks.find((lock) => sel.state.selectedStrandIds.has(lock.id));
    selectLock(fallback?.id, {
      individualClumpMember: true,
      selectedIds: fallback ? [...sel.state.selectedStrandIds] : undefined
    });
  }
}




function applyDisplayVisibilityFilters() {
  applyCharacterMeshDisplayVisibility();
  applyStrandDisplayVisibility();
  guideApi.applyCapsuleGuideDisplayVisibility();
  guideApi.applyCurveLatticeGuideDisplayVisibility();
  guideApi.applyOtherGuideDisplayVisibility();
  syncDisplayVisibilityInputs();
  renderLockList();
  guideApi.renderGuideOutliner();
}






















































const REGION_CURVE_VISUALIZATION_ENABLED = false;
// Fill guide/curve deps after the last dep is defined (stores use the .state accessor;
// scalpBuilder couplings route through the scalp api; plain values pass by reference).
Object.assign(guideDeps, {
  CONTROL_POINT_SELECTED_COLOR,
  DEFAULT_CAPSULE_GUIDE_COLOR,
  GUIDE_BOUNDS_EXCLUDED_GROUPS,
  GUIDE_VIEW_MODES,
  REGION_CURVE_VISUALIZATION_ENABLED,
  activeScalpSurfaceMesh: scalpBuilder.activeScalpSurfaceMesh,
  activeStrokeDynamicEnabled: drawFlowApi.activeStrokeDynamicEnabled,
  activeStrokeSurfaceValue: drawFlowApi.activeStrokeSurfaceValue,
  applyDisplayVisibilityFilters,
  attachGuideObjectTransform,
  camera,
  capsuleGuideDrawDefaults,
  capsuleGuideDrawPreview,
  capsuleGuideLoopHandle,
  capsuleGuideProfilePath,
  clearStrandSelectionState,
  componentEditModeActive,
  configureTransformControls,
  contextualPlaneAtOrigin: drawFlowApi.contextualPlaneAtOrigin,
  createOutlinerVisibilityToggle,
  createScalpGuideOutlinerRow: scalpBuilder.createScalpGuideOutlinerRow,
  curveLatticeControls,
  curveLatticeHorizontalLoopsInput,
  curveLatticeHorizontalLoopsValue,
  curveLatticeOpacityInput,
  curveLatticePointsForScalpRegion: scalpBuilder.curveLatticePointsForScalpRegion,
  curveLatticeToggle,
  curveLatticeVerticalLoopsInput,
  curveLatticeVerticalLoopsValue,
  dataToVector,
  deselectStrandsForGuideEditor,
  drawSurfaceHitFromEvent: drawFlowApi.drawSurfaceHitFromEvent,
  filterCurveLatticesToGroup,
  getSelectedLock,
  guideControls,
  guideInputs,
  guideOutliner,
  guidePanelTitle,
  guideState: guideState.state,
  guideSurfaceGroup,
  guideViewContextMenu,
  guideViewModeActions,
  guides,
  handleOutlinerRenameClick,
  locks,
  loftSurfaceProfilePoints: curveSurfaceCreate.loftSurfaceProfilePoints,
  loftSurfaceSampleFromHit: curveSurfaceCreate.loftSurfaceSampleFromHit,
  mirroredScalpRegion: scalpBuilder.mirroredScalpRegion,
  modeToolButtons,
  normalizeOutlinerName,
  pointer,
  pointerHitsTransformGizmo,
  pushUndoState,
  rayFromViewportEvent,
  raycaster,
  refreshLiveSurfaceOptions: drawFlowApi.refreshLiveSurfaceOptions,
  refreshRebuildCurveDialog,
  renderLockList,
  renderer,
  scalpBuilderProportionalWeight: scalpBuilder.scalpBuilderProportionalWeight,
  scalpGuideVisibilityToggle,
  scalpState: scalpState.state,
  scalpSurfaceGroup,
  sculptBrushDock,
  sculptState: sculptState.state,
  sel: sel.state,
  selectedCurveLatticeGuide: drawFlowApi.selectedCurveLatticeGuide,
  setActiveTool,
  setOutlinerTab,
  setScalpGuideVisibility: scalpBuilder.setScalpGuideVisibility,
  setSculptBrushCursorVisible: sculptGeom.setSculptBrushCursorVisible,
  setStrandSelectionVisual,
  setViewportEditMode,
  showOutlinerContextMenu,
  strandRegionDisplayLabel,
  strokeSurfaceIsContextual: drawFlowApi.strokeSurfaceIsContextual,
  subdivideScalpBuilderCage: scalpBuilder.subdivideScalpBuilderCage,
  surfaceGuideColorInput,
  surfaceGuideDefaults,
  surfaceGuideFresnelInput,
  surfaceGuideInputs,
  surfaceGuideNameInput,
  surfaceGuideValues,
  syncDisplayVisibilityInputs,
  transformControls,
  updateAttributeEditorMode,
  updateBoundCurveLatticeStrands,
  updateCount,
  updateCurveObjects,
  updateInteractionLocks,
  updatePlacementStatus: placementApi.updatePlacementStatus,
  updateScalpEditingVisibility: scalpBuilder.updateScalpEditingVisibility,
  updateSelectedPointLabel,
  vectorToData,
  viewPlaneMoveActiveForView,
  viewPlaneNormal,
  viewportCapsuleGuideTool,
  viewportCurveLatticeGuideTool,
  viewportDrawCapsuleGuideTool,
});

// Poly topology api deps batch (refactor 3d batch G7): all deps defined by this point (last dep:
// guideApi); the batch takes effect here, before the first runtime poly tool calls.
Object.assign(polyToolsDeps, {
  activeStrokeSurfaceValue: drawFlowApi.activeStrokeSurfaceValue,
  addLock,
  contextualPlaneAtOrigin: drawFlowApi.contextualPlaneAtOrigin,
  curveGroup,
  draw: draw.state,
  drawSurfaceHitFromEvent: drawFlowApi.drawSurfaceHitFromEvent,
  fitPointAttributes,
  getSelectedLock,
  guideApi,
  hairState: hairState.state,
  headMeshes: referenceHeadApi.headMeshes,
  lastPointer,
  liveSurfaceGuide: drawFlowApi.liveSurfaceGuide,
  liveSurfaceStrand: drawFlowApi.liveSurfaceStrand,
  locks,
  normalizeHairLayer,
  polyBrushSpacingInput,
  polyBrushSurfaceOffsetInput,
  polyBrushWidthInput,
  polyRelaxProjectionRaycaster,
  pushUndoState,
  raycaster,
  rayFromViewportEvent,
  renderer,
  renderLockList,
  selectLock,
  selectedCurveLatticeGuide: drawFlowApi.selectedCurveLatticeGuide,
  sel: sel.state,
  sculptState: sculptState.state,
  strandVisibleForDisplay,
  undoHistory,
  updateCount,
  updateCurveObjects,
  updateHistoryButtons,
  updateInteractionLocks,
  updateLockGeometry,
  updatePlacementStatus: placementApi.updatePlacementStatus,
  updateTopologyStats,
  viewportDrawLayerInput,
  worldNormalAtHit: drawFlowApi.worldNormalAtHit,
});





function updateGroupCurveLatticeStrands(guide) {
  if (!guideApi.editingCurveLatticeDeformation(guide)) return;
  const deformationPairs = GROUP_CURVE_FEATURE_ENABLED
    ? guideApi.groupCurveDeformationPairs(guide)
    : guideApi.curveLatticeDeformationPairs(guide);
  if (!deformationPairs.length) return;
  locks
    .filter((lock) => (lock.scalpRegion || "unassigned") === guide.scalpRegion)
    .forEach((lock) => {
      if (!lock.groupLatticeBasePoints || lock.groupLatticeBasePoints.length !== lock.points.length) {
        lock.groupLatticeBasePoints = lock.points.map((point) => point.clone());
      }
      lock.points.forEach((point, index) => {
        const basePoint = lock.groupLatticeBasePoints[index];
        point.copy(basePoint).add(guideApi.groupLatticeOffsetAtPoint(basePoint, deformationPairs));
      });
      syncLockFromCurve(lock);
      updateLockGeometry(lock);
    });
}

function updateBoundCurveLatticeStrands(guide) {
  locks.filter((lock) => (
    CURVE_LATTICE_FEATURE_ENABLED
    && guideApi.editingCurveLatticeDeformation(guide)
    && lock.curveLatticeBinding?.guideId === guide.id
  )).forEach((lock) => {
    const column = THREE.MathUtils.clamp(lock.curveLatticeBinding.column, 0, guide.columns - 1);
    const pointCount = Math.max(4, guide.rows);
    lock.points = guideApi.curveLatticeColumnPoints(guide, column, pointCount);
    fitPointAttributes(lock, lock.points.length);
    if (lock.curveObjects.handles.length !== lock.points.length) rebuildCurveObjects(lock);
    syncLockFromCurve(lock);
    updateLockGeometry(lock);
    syncActiveMirror(lock);
  });
  updateGroupCurveLatticeStrands(guide);
  updateTopologyStats();
}

function createStrandsFromCurveLattice(guide) {
  if (!guide || guide.type !== "curve-lattice") return;
  pushUndoState();
  const created = [];
  for (let column = 0; column < guide.columns; column += 1) {
    const existing = locks.find((lock) => lock.curveLatticeBinding?.guideId === guide.id && lock.curveLatticeBinding.column === column);
    if (existing) {
      created.push(existing);
      continue;
    }
    const pointCount = Math.max(4, guide.rows);
    const points = guideApi.curveLatticeColumnPoints(guide, column, pointCount);
    const root = points[0];
    const lock = addLock("front", {
      x: root.x,
      y: root.y,
      z: root.z,
      length: new THREE.CatmullRomCurve3(points).getLength(),
      curve: points.at(-1).x - root.x,
      width: Number(drawStrandBrushSizeInput.value),
      scalpRegion: scalpBuilder.scalpRegionNearestWorldPoint(root),
      color: DEFAULT_HAIR_COLOR,
      points,
      curveLatticeBinding: { guideId: guide.id, column }
    }, { deferUi: true });
    placementApi.applyPlacedStrandScaleProfile(lock);
    updateLockGeometry(lock);
    created.push(lock);
  }
  renderLockList();
  updateCount();
  if (created.length) selectLock(created[Math.floor(created.length / 2)].id);
}

































































function selectedViewportFocusBounds() {
  const lock = getSelectedLock();
  const guide = guideApi.getSelectedGuide();
  const objects = lock?.mesh
    ? [lock.mesh]
    : guide
      ? [guide.mesh, guide.rootMesh].filter(Boolean)
      : [];
  if (!objects.length) return null;
  const bounds = new THREE.Box3();
  objects.forEach((object) => bounds.expandByObject(object, true));
  return bounds.isEmpty() ? null : bounds;
}

function frameViewportBounds(bounds) {
  if (!bounds) return false;
  const sphere = bounds.getBoundingSphere(new THREE.Sphere());
  const center = sphere.center;
  const radius = Math.max(0.08, sphere.radius);
  const viewDirection = camera.position.clone().sub(controls.target);
  const currentDistance = Math.max(0.1, viewDirection.length());
  if (viewDirection.lengthSq() < 0.000001) {
    camera.getWorldDirection(viewDirection);
    viewDirection.negate();
  }
  viewDirection.normalize();
  ui.state.shiftSnappedViewActive = false;
  controls.target.copy(center);
  if (camera.isOrthographicCamera) {
    if (camera === orthographicCamera) viewportState.state.orthographicHalfHeight = radius * 1.16;
    else camera.userData.multiCameraHalfHeight = radius * 1.16;
    camera.zoom = 1;
    camera.position.copy(center).addScaledVector(viewDirection, currentDistance);
    updateCameraProjectionForViewport();
  } else {
    const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov * 0.5) * Math.max(0.01, perspectiveCamera.aspect));
    const limitingFov = Math.min(verticalFov, horizontalFov);
    const distance = radius / Math.max(0.01, Math.sin(limitingFov * 0.5)) * 1.16;
    camera.position.copy(center).addScaledVector(viewDirection, distance);
  }
  controls.update();
  return true;
}

function centerViewportOnSelectedItem() {
  return frameViewportBounds(selectedViewportFocusBounds());
}

function fullSceneFocusBounds() {
  if (guideState.state.guideModel?.userData?.fullBodyReference) return scalpBuilder.fullBodyScalpFocusBounds();
  const objects = [
    ...locks.map((lock) => lock.mesh),
    ...guides.flatMap((guide) => [guide.mesh, guide.rootMesh]),
    scalpBuilder.activeScalpSurfaceMesh(),
    ...referenceHeadApi.headMeshes()
  ].filter(Boolean);
  if (!objects.length) return null;
  const bounds = new THREE.Box3();
  objects.forEach((object) => bounds.expandByObject(object, true));
  return bounds.isEmpty() ? null : bounds;
}


function currentViewportFrameSelectionKey() {
  return [
    sel.state.selectedId || "",
    sel.state.selectedGuideId || "",
    sel.state.selectedReferenceImageId || "",
    [...sel.state.selectedStrandIds].sort().join(",")
  ].join("|");
}

function cycleViewportFraming() {
  if (guideState.state.guideModel?.userData?.fullBodyReference) {
    viewportState.state.viewportFrameCycleStep = 0;
    sel.state.viewportFrameSelectionKey = currentViewportFrameSelectionKey();
    return frameViewportBounds(scalpBuilder.fullBodyScalpFocusBounds());
  }
  const selectionKey = currentViewportFrameSelectionKey();
  if (selectionKey !== sel.state.viewportFrameSelectionKey) {
    sel.state.viewportFrameSelectionKey = selectionKey;
    viewportState.state.viewportFrameCycleStep = 0;
  }
  const framed = viewportState.state.viewportFrameCycleStep === 0
    ? centerViewportOnSelectedItem()
    : frameViewportBounds(fullSceneFocusBounds());
  viewportState.state.viewportFrameCycleStep = (viewportState.state.viewportFrameCycleStep + 1) % 2;
  return framed;
}



function sculptBrushToolActive(tool = sel.state.activeTool) {
  return ["sculpt-move", "sculpt-smooth", "sculpt-inflate", "sculpt-slide", "sculpt-scale", "sculpt-push", "sculpt-orient", "sculpt-twist"].includes(tool);
}

function sculptBrushSelectionMaskActive() {
  return sculptBrushToolActive() && sel.state.selectedStrandIds.size > 0;
}

function sculptBrushSelectionAllows(lock) {
  return !sculptBrushSelectionMaskActive() || sel.state.selectedStrandIds.has(lock?.id);
}

function effectiveSculptBrushTool() {
  return sculptBrushToolActive() && sculptState.state.sculptBrushShiftSmoothHeld
    ? "sculpt-smooth"
    : sel.state.activeTool;
}

function updateSculptScaleModeRow() {
  const scaleModeRow = document.querySelector("#sculptScaleModeRow");
  scaleModeRow?.classList.toggle("hidden", effectiveSculptBrushTool() !== "sculpt-scale");
}

function syncSculptBrushToolButtons() {

  const effectiveTool = effectiveSculptBrushTool();
  modeToolButtons.filter((button) => sculptBrushToolActive(button.dataset.tool)).forEach((button) => {
    const effective = button.dataset.tool === effectiveTool;
    const temporarySource = sculptState.state.sculptBrushShiftSmoothHeld
      && button.dataset.tool === sel.state.activeTool
      && sel.state.activeTool !== "sculpt-smooth";
    button.classList.toggle("active", effective);
    button.classList.toggle("temporary-source", temporarySource);
    button.setAttribute("aria-pressed", String(effective));
  });
  sculptBrushCursor.classList.toggle("smooth", effectiveTool === "sculpt-smooth");
  sculptBrushCursor.classList.toggle("inflate", effectiveTool === "sculpt-inflate");
  const preserveTipsAvailable = sculptBrushPreserveTipsByTool[sel.state.activeTool] !== undefined;
  sculptPreserveTipsSetting.classList.toggle("hidden", !preserveTipsAvailable);
  if (preserveTipsAvailable) {
    sculptPreserveTipsInput.checked = sculptBrushPreserveTipsByTool[sel.state.activeTool];
  }
  updateSculptScaleModeRow();
}

function setSculptBrushShiftSmoothHeld(held) {
  const nextHeld = Boolean(held) && sculptBrushToolActive();
  if (sculptState.state.sculptBrushShiftSmoothHeld === nextHeld) return;
  sculptState.state.sculptBrushShiftSmoothHeld = nextHeld;
  syncSculptBrushToolButtons();
  sculptGeom.syncSculptBrushStrengthForActiveTool();
  placementApi.updatePlacementStatus();
}

function setActiveTool(tool) {
  clearCurvePointTopologyCursor();
  undo.state.historyShortcutHeld = false;
  const previousTool = sel.state.activeTool;
  if (sculptBrushToolActive(previousTool) && tool !== previousTool) {
    sculptGeom.finishSculptMoveStroke(null, { cancel: true });
    sculptGeom.setSculptBrushCursorVisible(false);
  }
  if (sculptState.state.referenceCropDrag) referenceHeadApi.finishReferenceCrop(null, { cancel: true });
  if (RETIRED_CURVE_LATTICE_SURFACE_TOOLS.has(tool)) tool = "select";
  if (tool === "procedural-draw" && !draw.state.proceduralDrawExperimentalEnabled) tool = "draw";
  const leavingLoftSurface = sel.state.activeTool === "surface-loft" && tool !== "surface-loft";
  const enteringLoftSurface = sel.state.activeTool !== "surface-loft" && tool === "surface-loft";
  const leavingCurveSurface = sel.state.activeTool === "curve-surface" && tool !== "curve-surface";
  const enteringCurveSurface = sel.state.activeTool !== "curve-surface" && tool === "curve-surface";
  if (leavingLoftSurface) curveSurfaceCreate.cancelLoftSurfaceDraft();
  if (leavingCurveSurface) curveSurfaceCreate.cancelCurveSurfaceDraft();
  if (sel.state.activeTool === "draw-capsule-guide" && tool !== "draw-capsule-guide") {
    guideApi.finishCapsuleGuideDrawStroke(null, { cancel: true });
  }
  if (tool === "surface-guide") {
    exitSetupEditors();
    guideApi.setCapsuleGuideEditing(true);
    return;
  }
  if (
    ["rotate", "scale"].includes(tool)
    && sculptState.state.viewportEditMode === "guide"
    && componentEditModeActive()
    && guideApi.getSelectedGuide()?.type === "curve-lattice"
  ) tool = "move";
  if (sculptState.state.viewportEditMode === "strand") {
    const selectedGeometryType = getSelectedLock()?.geometryType;
    const unsupportedCurveSurfaceTool = selectedGeometryType === "curve-surface"
      && ["scale", "relax"].includes(tool);
    const unsupportedSurfaceTool = selectedGeometryType === "surface"
      && ["rotate", "scale", "relax"].includes(tool)
      && (tool === "relax" || sel.state.selectedSurfaceObjectAnchorId !== getSelectedLock()?.id);
    if (unsupportedCurveSurfaceTool || unsupportedSurfaceTool) tool = "move";
  }
  if (
    sculptState.state.viewportEditMode === "guide"
    && ["relax", "draw", "procedural-draw", "poly", "panel", "braid", "curve-surface"].includes(tool)
  ) tool = "select";
  const setupTransformTool = ["select", "move", "rotate", "scale"].includes(tool);
  const scalpBuilderTool = ["select", "move"].includes(tool);
  if (sculptState.state.capsuleGuideEditing && !setupTransformTool) return;
  if (scalpState.state.scalpBuilderEditing && setupTransformTool && !scalpBuilderTool) return;
  // Place Strand is retained internally for legacy project compatibility only.
  if (tool === "place") tool = "select";
  if ((scalpState.state.scalpBuilderEditing && !setupTransformTool) || scalpState.state.scalpPaintEditing || sculptState.state.headSetupEditing || scalpState.state.scalpShapeEditing) {
    exitSetupEditors();
  }
  if (tool !== "place") placementApi.finishPlacementFlow();
  if (!["draw", "procedural-draw", "braid", "panel"].includes(tool)) drawFlowApi.finishDrawStrandStroke(null, { cancel: true });
  if (!["draw", "procedural-draw", "braid", "panel"].includes(tool)) drawStrandBrushCursor.visible = false;
  if (previousTool === "poly" && tool !== "poly") {
    polyToolsApi.finishPolyBrushStroke(null, { cancel: true });
    polyToolsApi.clearPolyFillPreview();
  }
  if (["place", "draw", "procedural-draw", "poly", "braid", "panel", "curve-surface"].includes(tool) && scalpState.state.scalpShapeEditing) scalpBuilder.setScalpShapeEditing(false);
  if (tool !== "move") endViewPlaneMove();
  sel.state.activeTool = tool;
  if (sculptBrushToolActive()) sculptGeom.syncSculptBrushStrengthForActiveTool();
  updateStrandSelectionHighlight();
  referenceHeadApi.updateReferenceSelectionVisuals();
  referenceHeadApi.updateReferenceCropHandles();
  if (
    ["draw", "procedural-draw", "braid", "panel", "curve-surface"].includes(sel.state.activeTool)
    || sel.state.activeTool === "draw-capsule-guide"
    || sculptBrushToolActive()
  ) setHoveredControlPoint(null);
  const proportionalVisualStateChanged = sculptState.state.proportionalEditing
    && ["move", "rotate", "scale", "relax"].includes(previousTool)
      !== ["move", "rotate", "scale", "relax"].includes(sel.state.activeTool);
  if (proportionalVisualStateChanged) {
    const proportionalLock = locks.find((lock) => lock.id === sel.state.selectedPoint?.lockId);
    if (proportionalLock) updateLockGeometry(proportionalLock, { immediate: true });
  }
  if (enteringLoftSurface) curveSurfaceCreate.resetLoftSurfaceDraft();
  if (enteringCurveSurface) curveSurfaceCreate.resetCurveSurfaceDraft();
  scalpBuilder.autoShowScalpGuideForActiveTool();
  if (tool !== "select") sculptState.state.selectPointerCapture = null;
  updateInteractionLocks();
  scalpBuilder.updateScalpEditingVisibility();
  modeToolButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
  syncSculptBrushToolButtons();
  transformControls.detach();
  guides.filter((guide) => guide.type === "capsule" && guide.handlesGroup).forEach((guide) => {
    const visible = componentEditModeActive() && sculptState.state.capsuleGuideEditing && guide.id === sel.state.selectedGuideId;
    guide.handlesGroup.visible = visible;
    if (guide.loopLinesGroup) guide.loopLinesGroup.visible = visible;
    if (!sculptState.state.capsuleGuideEditing) guideApi.updateCapsuleGuideHandleColors(guide);
  });
  if (!["relax", "place", "draw", "procedural-draw", "poly", "braid", "panel", "surface-loft", "curve-surface", "draw-capsule-guide"].includes(tool) && !sculptBrushToolActive(tool)) configureTransformControls(tool);
  if (["move", "scale"].includes(tool) && referenceHeadApi.selectedReferenceImage()?.type === "plane") {
    referenceHeadApi.attachReferenceImageTransform();
  }
  if (scalpState.state.scalpBuilderEditing && tool === "move") {
    const handle = scalpState.state.scalpBuilderCurveLattice?.handles[scalpState.state.scalpBuilderCurveLattice.selectedIndex];
    if (handle) transformControls.attach(handle);
  }
  if (sculptState.state.capsuleGuideEditing && sculptState.state.capsuleGuideLoopSelection) guideApi.attachCapsuleGuideLoopTransform();
  locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
  if (!componentEditModeActive() && sculptState.state.viewportEditMode === "strand") {
    attachStrandObjectTransform();
  }
  if (!componentEditModeActive() && sculptState.state.viewportEditMode === "guide") {
    attachGuideObjectTransform();
  }
  const selectedSurfaceAnchorLock = locks.find((lock) => lock.id === sel.state.selectedSurfaceObjectAnchorId);
  if (componentEditModeActive() && ["move", "rotate", "scale"].includes(tool) && selectedSurfaceAnchorLock) {
    attachSurfaceObjectAnchorTransform(selectedSurfaceAnchorLock);
  }
  if (componentEditModeActive() && ["move", "rotate", "scale"].includes(tool) && sel.state.selectedControlPoints.length) {
    const strandSelection = sel.state.selectedControlPoints.find((point) => point.type === "strand");
    const latticeSelection = sel.state.selectedControlPoints.find((point) => point.type === "lattice");
    if (strandSelection) {
      sel.state.selectedPoint = { lockId: strandSelection.lockId, pointIndex: strandSelection.pointIndex };
      const lock = locks.find((item) => item.id === strandSelection.lockId);
      const handle = lock?.curveObjects?.handles[strandSelection.pointIndex];
      if (handle && !(tool === "move" && viewPlaneMoveActiveForView())) {
        attachTransformForCurvePoint(lock, strandSelection.pointIndex, handle);
      }
    } else if (latticeSelection && tool === "move") {
      sel.state.selectedCurveLatticePoint = { guideId: latticeSelection.guideId, pointIndex: latticeSelection.pointIndex };
      const guide = guides.find((item) => item.id === latticeSelection.guideId);
      const handle = guide?.handlesGroup?.children[latticeSelection.pointIndex];
      if (handle && !(tool === "move" && viewPlaneMoveActiveForView())) transformControls.attach(handle);
    }
  }
  updateAttributeEditorMode();
  updateViewPlaneGrid();
  placementApi.updatePlacementStatus();
}

function setDrawStrandMode(mode) {
  if (!["standard", "clump", "ponytail-clump", "coil"].includes(mode)) return;
  drawFlowApi.finishDrawStrandStroke(null, { cancel: true });
  hairState.state.drawStrandMode = mode;
  draw.state.activeCustomDrawClumpTemplate = null;
  drawBrushPresetInput.value = mode;
  syncDrawCurlControls();
  placementApi.updatePlacementStatus();
}

function setObjectSpaceEditing(enabled) {
  sculptState.state.objectSpaceEditing = enabled;
  writeStoredPreference(window, TRANSFORM_SPACE_PREFERENCE_KEY, enabled);
  spaceToggle.classList.toggle("active", sculptState.state.objectSpaceEditing);
  spaceToggle.title = sculptState.state.objectSpaceEditing ? "Transform space: Object (O)" : "Transform space: World (O)";
  transformSpaceButtons.forEach((button) => {
    const active = button.dataset.transformSpace === (sculptState.state.objectSpaceEditing ? "object" : "world");
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  configureTransformControls(sel.state.activeTool);
  if (!componentEditModeActive() && sculptState.state.viewportEditMode === "strand") attachStrandObjectTransform();
  if (!componentEditModeActive() && sculptState.state.viewportEditMode === "guide") attachGuideObjectTransform();
  placementApi.updatePlacementStatus();
}

function setHierarchyEditing(enabled) {
  sculptState.state.hierarchyEditing = enabled;
  if (sculptState.state.hierarchyEditing) sculptState.state.proportionalEditing = false;
  if (!sculptState.state.proportionalEditing) endProportionalSizeEdit();
  hierarchyToggle.classList.toggle("active", sculptState.state.hierarchyEditing);
  proportionalToggle.classList.toggle("active", sculptState.state.proportionalEditing);
  locks.forEach((lock) => updateLockGeometry(lock));
  locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
  updateAttributeEditorMode();
  placementApi.updatePlacementStatus();
}

function setProportionalEditing(enabled) {
  sculptState.state.proportionalEditing = enabled;
  if (sculptState.state.proportionalEditing) sculptState.state.hierarchyEditing = false;
  proportionalToggle.classList.toggle("active", sculptState.state.proportionalEditing);
  hierarchyToggle.classList.toggle("active", sculptState.state.hierarchyEditing);
  if (!sculptBrushToolActive()) {
    locks.forEach((lock) => updateLockGeometry(lock));
    locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
  }
  scalpBuilder.updateScalpBuilderHandleColors();
  const capsule = guideApi.getSelectedGuide();
  if (capsule?.type === "capsule") guideApi.updateCapsuleGuideHandleColors(capsule, capsule.selectedPointIndex ?? -1);
  guideApi.refreshCapsuleGuideLoopInfluence();
  if (!sculptState.state.proportionalEditing) endProportionalSizeEdit();
  updateInteractionLocks();
  updateAttributeEditorMode();
  placementApi.updatePlacementStatus();
}

function beginProportionalSizeEdit(event) {
  if (!sculptState.state.proportionalEditing || sculptState.state.proportionalSizeEdit) return;
  sculptState.state.proportionalSizeEdit = {
    startX: event.clientX ?? lastPointer.x,
    startY: event.clientY ?? lastPointer.y,
    startRadius: Number(proportionalRadiusInput.value),
    didDrag: false
  };
  updateInteractionLocks();
  placementApi.updatePlacementStatus();
}

function updateProportionalSizeEdit(event) {
  if (!sculptState.state.proportionalSizeEdit) return;
  const drag = (event.clientX - sculptState.state.proportionalSizeEdit.startX) - (event.clientY - sculptState.state.proportionalSizeEdit.startY);
  if (Math.abs(drag) >= 3) sculptState.state.proportionalSizeEdit.didDrag = true;
  const nextRadius = THREE.MathUtils.clamp(sculptState.state.proportionalSizeEdit.startRadius + drag / 70, Number(proportionalRadiusInput.min), Number(proportionalRadiusInput.max));
  proportionalRadiusInput.value = nextRadius.toFixed(1);
  refreshProportionalPreview();
  placementApi.updatePlacementStatus();
  event.preventDefault();
}

function endProportionalSizeEdit() {
  if (!sculptState.state.proportionalSizeEdit) return;
  sculptState.state.proportionalSizeEdit = null;
  updateInteractionLocks();
  placementApi.updatePlacementStatus();
}

function activateProportionalHotkeyHold() {
  const press = sculptState.state.proportionalHotkeyPress;
  if (!press || press.wasEnabled || press.activatedByHold) return;
  press.activatedByHold = true;
  setProportionalEditing(true);
  beginProportionalSizeEdit({ clientX: press.startX, clientY: press.startY });
}

function refreshProportionalPreview() {
  if (sculptBrushToolActive()) return;
  locks.forEach((lock) => updateLockGeometry(lock));
  locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
  scalpBuilder.updateScalpBuilderHandleColors();
  const capsule = guideApi.getSelectedGuide();
  if (capsule?.type === "capsule") guideApi.updateCapsuleGuideHandleColors(capsule, capsule.selectedPointIndex ?? -1);
  guideApi.refreshCapsuleGuideLoopInfluence();
}

function activeBrushSizeInput() {
  if (scalpState.state.scalpPaintEditing) return scalpBrushSizeInput;
  if (sculptBrushToolActive()) return sculptBrushRadiusInput;
  if (["draw", "procedural-draw"].includes(sel.state.activeTool)) return drawToolSizeInput;
  if (sel.state.activeTool === "braid") return braidToolSizeInput;
  if (sel.state.activeTool === "panel") return panelToolSizeInput;
  return null;
}

function refreshActiveBrushSizeCursor(event) {
  if (scalpState.state.scalpPaintEditing) {
    scalpBuilder.updateScalpBrushCursor(scalpBuilder.scalpHitFromEvent(event));
    return;
  }
  if (sculptBrushToolActive()) {
    sculptGeom.updateSculptBrushCursor(event);
    return;
  }
  drawFlowApi.updateDrawStrandBrushCursor(event);
}

function refreshActiveBrushSizeScale() {
  if (scalpState.state.scalpPaintEditing) {
    const averageScale = (
      scalpSurfaceGroup.scale.x
      + scalpSurfaceGroup.scale.y
      + scalpSurfaceGroup.scale.z
    ) / 3;
    scalpBrushCursor.scale.setScalar(Number(scalpBrushSizeInput.value) * averageScale);
    return;
  }
  if (sculptBrushToolActive()) {
    sculptGeom.syncSculptBrushControls();
    return;
  }
  const cursorScale = drawFlowApi.activeStrokeBrushSize() * (drawFlowApi.braidStrokeActive() ? 1 / 3 : 1);
  setDrawStrandBrushCursorScale(cursorScale);
}

function beginBrushSizeDrag(event) {
  if (
    !sculptState.state.brushSizeHotkeyHeld
    || event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
  ) return false;
  const input = activeBrushSizeInput();
  if (!input) return false;
  sculptState.state.brushSizeDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startValue: Number(input.value),
    input
  };
  renderer.domElement.setPointerCapture?.(event.pointerId);
  refreshActiveBrushSizeCursor(event);
  renderer.domElement.style.cursor = "none";
  updateInteractionLocks();
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function updateBrushSizeDrag(event) {
  if (!sculptState.state.brushSizeDrag || event.pointerId !== sculptState.state.brushSizeDrag.pointerId) return;
  const { input, startValue, startX, startY } = sculptState.state.brushSizeDrag;
  const exponent = ((event.clientX - startX) - (event.clientY - startY)) / 180;
  const minimum = Number(input.min);
  const maximum = Number(input.max);
  const step = Math.max(Number(input.step) || 0.01, 0.0001);
  const unclamped = startValue * Math.exp(exponent);
  const nextValue = THREE.MathUtils.clamp(
    Math.round(unclamped / step) * step,
    minimum,
    maximum
  );
  input.value = String(nextValue);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  refreshActiveBrushSizeScale();
  refreshActiveBrushSizeCursor({ clientX: startX, clientY: startY });
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishBrushSizeDrag(event) {
  if (
    !sculptState.state.brushSizeDrag
    || (event?.pointerId !== undefined && event.pointerId !== sculptState.state.brushSizeDrag.pointerId)
  ) return;
  const { pointerId, input } = sculptState.state.brushSizeDrag;
  sculptState.state.brushSizeDrag = null;
  renderer.domElement.releasePointerCapture?.(pointerId);
  renderer.domElement.style.cursor = "";
  updateInteractionLocks();
  if (input === sculptBrushRadiusInput && event?.clientX !== undefined) {
    sculptGeom.updateSculptBrushCursor(event);
  }
  event?.preventDefault();
  event?.stopImmediatePropagation();
}

function updateInteractionLocks() {
  const loftStrokeActive = Boolean(miscState.state.loftSurfaceDraft?.activeStroke);
  const curveSurfaceStrokeActive = Boolean(sculptState.state.curveSurfaceDraft?.activeStroke);
  controls.enabled = Boolean(sculptState.state.altOrbitDrag) || (!miscState.state.toolRadialGesture && !hairState.state.strandRadialGesture && !sculptState.state.duplicatePlacement && !sculptState.state.referenceOverlayDrag && !sculptState.state.referenceCropDrag && !sculptState.state.selectPointerCapture && !sculptState.state.transformDragging && !sculptState.state.relaxEdit && !sculptState.state.sculptMoveStroke && !sculptState.state.proportionalSizeEdit && !sculptState.state.proportionalHotkeyPress && !sculptState.state.brushSizeDrag && !sculptState.state.strandWidthEdgeDrag && !scalpState.state.scalpLatticeDrag && !scalpState.state.scalpPaintDrag && !scalpState.state.scalpBuilderStroke && !sculptState.state.viewSnapDrag && !sculptState.state.viewPlaneMoveDrag && !sculptState.state.drawStrandStroke && !sculptState.state.capsuleGuideDrawStroke && !sculptState.state.polyBrushStroke && !loftStrokeActive && !curveSurfaceStrokeActive && !sculptState.state.selectionMarqueeDrag && !sculptState.state.panelSplitDrag && !sculptState.state.capsuleGuideLoopDrag && !sculptState.state.taperMeshPointDrag && !sculptState.state.branchSweepStartDrag && !sculptState.state.houdiniZoomDrag);
  const branchMoveDisabled = branchRootBone.branchMoveGizmoDisabled();
  transformControls.enabled = !miscState.state.toolRadialGesture && !hairState.state.strandRadialGesture && !sculptState.state.duplicatePlacement && !sculptState.state.referenceOverlayDrag && !sculptState.state.referenceCropDrag && !sculptState.state.altOrbitDrag && !sculptState.state.sculptMoveStroke && !sculptState.state.proportionalSizeEdit && !sculptState.state.proportionalHotkeyPress && !sculptState.state.brushSizeDrag && !sculptState.state.strandWidthEdgeDrag && !scalpState.state.scalpBuilderStroke && !sculptState.state.viewSnapDrag && !sculptState.state.viewPlaneMoveDrag && !sculptState.state.drawStrandStroke && !sculptState.state.capsuleGuideDrawStroke && !sculptState.state.polyBrushStroke && !loftStrokeActive && !curveSurfaceStrokeActive && !sculptState.state.panelSplitDrag && !sculptState.state.capsuleGuideLoopDrag && !sculptState.state.taperMeshPointDrag && !branchMoveDisabled && !sculptState.state.branchSweepStartDrag && !sculptState.state.houdiniZoomDrag;
  branchRootBone.setBranchMoveGizmoVisual(branchMoveDisabled);
}



function configureTransformControls(tool) {
  transformControls.setMode(toolModes[tool]);
  transformControls.setSpace(sculptState.state.objectSpaceEditing ? "local" : "world");
  transformControls.showX = true;
  transformControls.showY = tool !== "scale" || !componentEditModeActive();
  transformControls.showZ = true;
}

function pullMoveActive() {
  return sel.state.activeTool === "move" && sculptState.state.pullMoveEnabled && getSelectedLock()?.geometryType !== "surface";
}

function updatePullGuideVisual() {
  const lockId = pullTarget.userData.lockId;
  const pointIndex = pullTarget.userData.pointIndex;
  const lock = locks.find((item) => item.id === lockId);
  const point = lock?.points?.[pointIndex];
  const usingPullTarget = transformControls.object === pullTarget || sculptState.state.viewPlaneMoveDrag?.handle === pullTarget;
  const visible = pullMoveActive() && usingPullTarget && Boolean(point);
  pullGuide.visible = visible;
  if (!visible) return;
  const position = pullGuide.geometry.getAttribute("position");
  position.setXYZ(0, point.x, point.y, point.z);
  position.setXYZ(1, pullTarget.position.x, pullTarget.position.y, pullTarget.position.z);
  position.needsUpdate = true;
  pullGuide.geometry.computeBoundingSphere();
}

function attachTransformForCurvePoint(lock, pointIndex, handle) {
  if (!lock || !handle) return;
  if (!pullMoveActive()) {
    pullGuide.visible = false;
    transformControls.attach(handle);
    updateInteractionLocks();
    return;
  }
  pullTarget.position.copy(lock.points[pointIndex]);
  pullTarget.quaternion.identity();
  pullTarget.scale.set(1, 1, 1);
  pullTarget.userData.lockId = lock.id;
  pullTarget.userData.pointIndex = pointIndex;
  pullTarget.userData.pullTarget = true;
  transformControls.setMode("translate");
  transformControls.setSpace("world");
  transformControls.showX = true;
  transformControls.showY = true;
  transformControls.showZ = true;
  transformControls.attach(pullTarget);
  updatePullGuideVisual();
  updateInteractionLocks();
}

function pointerHitsTransformGizmo(event) {
  if (!transformControls.enabled || !transformControls.object || !transformControls.visible) return false;
  if (transformControls.dragging) return true;
  const picker = transformControls._gizmo?.picker?.[transformControls.mode];
  if (!picker) return Boolean(transformControls.axis);
  rayFromViewportEvent(event);
  return raycaster.intersectObject(picker, true).some((hit) => {
    let pickerHandle = hit.object;
    while (pickerHandle && pickerHandle !== picker) {
      if (pickerHandle.visible === false) return false;
      pickerHandle = pickerHandle.parent;
    }
    return true;
  });
}

function strandObjectRootIndex(lock) {
  if (lock?.geometryType !== "curve-surface") return 0;
  return THREE.MathUtils.clamp(
    Math.round(Number(lock.curveSurfaceCenterCurve) || 0),
    0,
    Math.max(0, Number(lock.curveSurfaceColumns || 1) - 1)
  ) * Number(lock.curveSurfaceRows || 1);
}

function strandObjectRoot(lock) {
  return lock?.points?.[strandObjectRootIndex(lock)] || lock?.points?.[0] || null;
}

const EMPTY_STRAND_OBJECT_TRANSFORM = Object.freeze({
  location: Object.freeze({ x: 0, y: 0, z: 0 }),
  rotation: Object.freeze({ x: 0, y: 0, z: 0 }),
  scale: Object.freeze({ x: 0, y: 0, z: 0 })
});

function normalizeStrandObjectTransform(value) {
  const normalized = {};
  ["location", "rotation", "scale"].forEach((group) => {
    normalized[group] = {};
    ["x", "y", "z"].forEach((axis) => {
      const number = Number(value?.[group]?.[axis]);
      normalized[group][axis] = Number.isFinite(number) ? number : EMPTY_STRAND_OBJECT_TRANSFORM[group][axis];
    });
  });
  ["x", "y", "z"].forEach((axis) => {
    normalized.scale[axis] = Math.max(-0.95, normalized.scale[axis]);
  });
  return normalized;
}

function strandObjectTransformQuaternionFromValues(values) {
  const rotation = normalizeStrandObjectTransform(values).rotation;
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(
    THREE.MathUtils.degToRad(rotation.x),
    THREE.MathUtils.degToRad(rotation.y),
    THREE.MathUtils.degToRad(rotation.z),
    "XYZ"
  ));
}

function strandObjectTransformValuesAfterHandle(baseValue, edit, handle) {
  const base = normalizeStrandObjectTransform(baseValue);
  const translation = handle.position.clone().sub(edit.position);
  const deltaRotation = handle.quaternion.clone().multiply(edit.quaternion.clone().invert());
  const nextQuaternion = deltaRotation.multiply(strandObjectTransformQuaternionFromValues(base));
  const nextEuler = new THREE.Euler().setFromQuaternion(nextQuaternion, "XYZ");
  const next = {
    location: {
      x: base.location.x + translation.x,
      y: base.location.y + translation.y,
      z: base.location.z + translation.z
    },
    rotation: {
      x: THREE.MathUtils.radToDeg(nextEuler.x),
      y: THREE.MathUtils.radToDeg(nextEuler.y),
      z: THREE.MathUtils.radToDeg(nextEuler.z)
    },
    scale: {}
  };
  ["x", "y", "z"].forEach((axis) => {
    const ratio = handle.scale[axis] / Math.max(0.0001, edit.scale[axis]);
    next.scale[axis] = Math.max(-0.95, (1 + base.scale[axis]) * ratio - 1);
  });
  return normalizeStrandObjectTransform(next);
}

function mirroredStrandObjectTransform(value) {
  const source = normalizeStrandObjectTransform(value);
  return {
    location: { x: -source.location.x, y: source.location.y, z: source.location.z },
    rotation: { x: source.rotation.x, y: -source.rotation.y, z: -source.rotation.z },
    scale: { ...source.scale }
  };
}

function objectTransformPanelLock() {
  if (sculptState.state.viewportEditMode !== "strand" || componentEditModeActive()) return null;
  const selected = selectedLocksInOrder();
  if (selected.length !== 1 || selected[0].locked) return null;
  return selected[0];
}

function formatStrandObjectTransformValue(value) {
  const rounded = Math.abs(Number(value)) < 0.00005 ? 0 : Number(Number(value).toFixed(4));
  return String(rounded);
}

function syncStrandObjectTransformPanel({ preview = false } = {}) {
  const lock = objectTransformPanelLock();
  strandObjectTransformPanel?.classList.toggle("hidden", !lock);
  if (!lock) return;
  let values = normalizeStrandObjectTransform(lock.objectTransform);
  const editTarget = preview
    ? hairState.state.activeStrandObjectTransform?.targets?.find((target) => target.lockId === lock.id)
    : null;
  if (editTarget) {
    values = strandObjectTransformValuesAfterHandle(
      editTarget.objectTransform,
      hairState.state.activeStrandObjectTransform,
      strandObjectTransformHandle
    );
  }
  strandObjectTransformInputs.forEach((input) => {
    const group = input.dataset.objectTransform;
    const axis = input.dataset.axis;
    input.disabled = group === "location" && Boolean(lock.branchParentId);
    if (document.activeElement !== input) input.value = formatStrandObjectTransformValue(values[group][axis]);
  });
  strandObjectTransformResetButtons.forEach((button) => {
    button.disabled = button.dataset.resetObjectTransform === "location" && Boolean(lock.branchParentId);
  });
}

function applyStrandObjectTransformPanelValues() {
  const lock = objectTransformPanelLock();
  const root = strandObjectRoot(lock);
  if (!lock || !root) return;
  const previous = normalizeStrandObjectTransform(lock.objectTransform);
  const next = normalizeStrandObjectTransform(previous);
  strandObjectTransformInputs.forEach((input) => {
    const group = input.dataset.objectTransform;
    const axis = input.dataset.axis;
    if (group === "location" && lock.branchParentId) return;
    const value = Number(input.value);
    if (Number.isFinite(value)) next[group][axis] = value;
  });
  if (JSON.stringify(previous) === JSON.stringify(next)) {
    syncStrandObjectTransformPanel();
    return;
  }

  pushUndoState();
  strandObjectTransformHandle.position.copy(root);
  strandObjectTransformHandle.quaternion.copy(
    sculptState.state.objectSpaceEditing ? strandObjectTransformQuaternion(lock) : new THREE.Quaternion()
  );
  strandObjectTransformHandle.scale.set(1, 1, 1);
  strandObjectTransformHandle.userData.lockId = lock.id;
  beginStrandObjectTransform(strandObjectTransformHandle);
  const edit = hairState.state.activeStrandObjectTransform;
  if (!edit) return;
  edit.authoredTransformOverrides = new Map([[lock.id, next]]);
  strandObjectTransformHandle.position.add(new THREE.Vector3(
    next.location.x - previous.location.x,
    next.location.y - previous.location.y,
    next.location.z - previous.location.z
  ));
  const rotationDelta = strandObjectTransformQuaternionFromValues(next)
    .multiply(strandObjectTransformQuaternionFromValues(previous).invert());
  strandObjectTransformHandle.quaternion.premultiply(rotationDelta);
  ["x", "y", "z"].forEach((axis) => {
    strandObjectTransformHandle.scale[axis] *= (1 + next.scale[axis]) / Math.max(0.05, 1 + previous.scale[axis]);
  });
  finishStrandObjectTransform();
  syncStrandObjectTransformPanel();
}

strandObjectTransformInputs.forEach((input) => {
  input.addEventListener("change", applyStrandObjectTransformPanelValues);
});

strandObjectTransformResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.resetObjectTransform;
    const axis = button.dataset.axis;
    const input = strandObjectTransformInputs.find((candidate) => (
      candidate.dataset.objectTransform === group && candidate.dataset.axis === axis
    ));
    if (!input) return;
    input.value = "0";
    applyStrandObjectTransformPanelValues();
  });
});

function strandObjectTransformQuaternion(lock) {
  const index = strandObjectRootIndex(lock);
  return curveFrameAtPoint(lock, index)?.quaternion?.clone() || new THREE.Quaternion();
}

function attachStrandObjectTransform() {
  const lock = sculptState.state.viewportEditMode === "strand" ? getSelectedLock() : null;
  if (
    componentEditModeActive()
    || !lock
    || lock.locked
    || !["move", "rotate", "scale"].includes(sel.state.activeTool)
    || sculptState.state.transformDragging
  ) return false;
  const root = strandObjectRoot(lock);
  if (!root) return false;
  strandObjectTransformHandle.position.copy(root);
  strandObjectTransformHandle.quaternion.copy(
    sculptState.state.objectSpaceEditing ? strandObjectTransformQuaternion(lock) : new THREE.Quaternion()
  );
  strandObjectTransformHandle.scale.set(1, 1, 1);
  strandObjectTransformHandle.userData.lockId = lock.id;
  configureTransformControls(sel.state.activeTool);
  transformControls.attach(strandObjectTransformHandle);
  updateInteractionLocks();
  return true;
}

function guideObjectPivot(guide) {
  if (!guide) return null;
  if (guide.type === "capsule") return guide.mesh?.position?.clone() || null;
  if (guide.type === "curve-lattice") {
    const points = [...(guide.points || []), ...(guide.rootPoints || [])];
    if (!points.length) return null;
    return new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
  }
  return guide.mesh?.getWorldPosition(new THREE.Vector3()) || null;
}

function guideObjectTransformQuaternion(guide) {
  if (!sculptState.state.objectSpaceEditing || !guide?.mesh) return new THREE.Quaternion();
  return guide.mesh.getWorldQuaternion(new THREE.Quaternion());
}

function attachGuideObjectTransform() {
  const guide = sculptState.state.viewportEditMode === "guide" ? guideApi.getSelectedGuide() : null;
  if (
    componentEditModeActive()
    || !guide
    || !["move", "rotate", "scale"].includes(sel.state.activeTool)
    || sculptState.state.transformDragging
  ) return false;
  const pivot = guideObjectPivot(guide);
  if (!pivot) return false;
  guideObjectTransformHandle.position.copy(pivot);
  guideObjectTransformHandle.quaternion.copy(guideObjectTransformQuaternion(guide));
  guideObjectTransformHandle.scale.set(1, 1, 1);
  guideObjectTransformHandle.userData.guideId = guide.id;
  configureTransformControls(sel.state.activeTool);
  transformControls.attach(guideObjectTransformHandle);
  return true;
}

function guideObjectTransformSnapshot(guide, handle) {
  const snapshot = {
    guide,
    guideId: guide.id,
    pivot: guideObjectPivot(guide),
    position: handle.position.clone(),
    quaternion: handle.quaternion.clone(),
    scale: handle.scale.clone()
  };
  if (guide.type === "curve-lattice") {
    snapshot.points = cloneOptionalVectors(guide.points);
    snapshot.rootPoints = cloneOptionalVectors(guide.rootPoints);
    snapshot.deformRestPoints = cloneOptionalVectors(guide.deformRestPoints);
    snapshot.deformRestRootPoints = cloneOptionalVectors(guide.deformRestRootPoints);
  } else if (guide.type === "capsule") {
    guide.mesh.updateMatrixWorld(true);
    snapshot.start = guide.start.clone();
    snapshot.end = guide.end.clone();
    snapshot.controlWorldPoints = guide.controlPoints.map((point) => (
      point.clone().applyMatrix4(guide.mesh.matrixWorld)
    ));
  } else if (guide.mesh) {
    guide.mesh.updateMatrixWorld(true);
    snapshot.meshWorldMatrix = guide.mesh.matrixWorld.clone();
  }
  return snapshot;
}

function beginGuideObjectTransform(handle) {
  if (handle !== guideObjectTransformHandle || componentEditModeActive()) return;
  const guide = guideApi.getSelectedGuide();
  if (!guide || handle.userData.guideId !== guide.id) return;
  guideState.state.activeGuideObjectTransform = guideObjectTransformSnapshot(guide, handle);
}

function updateLegacyGuideObjectTransform(snapshot, worldDelta) {
  const guide = snapshot.guide;
  if (!guide?.mesh || !snapshot.meshWorldMatrix) return;
  guide.mesh.parent?.updateWorldMatrix(true, false);
  const parentInverse = (guide.mesh.parent?.matrixWorld || new THREE.Matrix4()).clone().invert();
  const localMatrix = parentInverse.multiply(worldDelta).multiply(snapshot.meshWorldMatrix);
  localMatrix.decompose(guide.mesh.position, guide.mesh.quaternion, guide.mesh.scale);
  guide.wire?.position.copy(guide.mesh.position);
  guide.wire?.quaternion.copy(guide.mesh.quaternion);
  guide.wire?.scale.copy(guide.mesh.scale);
  guide.x = guide.mesh.position.x;
  guide.y = guide.mesh.position.y;
  guide.z = guide.mesh.position.z;
  guide.objectQuaternion = {
    x: guide.mesh.quaternion.x,
    y: guide.mesh.quaternion.y,
    z: guide.mesh.quaternion.z,
    w: guide.mesh.quaternion.w
  };
  guide.objectScale = vectorToData(guide.mesh.scale);
}

function updateGuideObjectTransform(handle) {
  const snapshot = guideState.state.activeGuideObjectTransform;
  const guide = snapshot?.guide;
  if (!snapshot || !guide || handle !== guideObjectTransformHandle) return;
  const { transformPoint, worldMatrixForPivot } = strandObjectTransformOperators(snapshot, handle);
  if (guide.type === "curve-lattice") {
    guide.points = snapshot.points.map((point) => transformPoint(point, snapshot.pivot));
    guide.rootPoints = snapshot.rootPoints?.map((point) => transformPoint(point, snapshot.pivot)) || [];
    guide.deformRestPoints = snapshot.deformRestPoints?.map((point) => transformPoint(point, snapshot.pivot)) || [];
    guide.deformRestRootPoints = snapshot.deformRestRootPoints?.map((point) => transformPoint(point, snapshot.pivot)) || [];
    guideApi.updateCurveLatticeGeometry(guide);
    return;
  }
  if (guide.type === "capsule") {
    guide.start.copy(transformPoint(snapshot.start, snapshot.pivot));
    guide.end.copy(transformPoint(snapshot.end, snapshot.pivot));
    const midpoint = guide.start.clone().add(guide.end).multiplyScalar(0.5);
    const direction = guide.end.clone().sub(guide.start);
    if (direction.lengthSq() < 1e-8) direction.set(0, -1, 0);
    const orientation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      direction.clone().normalize()
    );
    const inverseOrientation = orientation.clone().invert();
    guide.controlPoints = snapshot.controlWorldPoints.map((point) => (
      transformPoint(point, snapshot.pivot).sub(midpoint).applyQuaternion(inverseOrientation)
    ));
    guideApi.updateCapsuleGuideGeometry(guide, { preserveControlPoints: true });
    return;
  }
  updateLegacyGuideObjectTransform(snapshot, worldMatrixForPivot(snapshot.pivot));
}

function finishGuideObjectTransform() {
  const snapshot = guideState.state.activeGuideObjectTransform;
  guideState.state.activeGuideObjectTransform = null;
  if (!snapshot?.guide) return;
  guideApi.syncGuideInputs(snapshot.guide);
  drawFlowApi.refreshLiveSurfaceOptions();
  attachGuideObjectTransform();
}

function clonePlacementFrame(frame) {
  if (!frame) return null;
  return {
    ...frame,
    root: frame.root?.clone() || null,
    normal: frame.normal?.clone() || null,
    flow: frame.flow?.clone() || null,
    side: frame.side?.clone() || null,
    gravity: frame.gravity?.clone() || null
  };
}

function cloneOptionalVectors(points) {
  return points?.map((point) => point?.clone() || null) || null;
}

function strandObjectTransformSnapshot(lock, sharedPivot = null) {
  return {
    lock,
    lockId: lock.id,
    pivot: (sharedPivot || strandObjectRoot(lock))?.clone() || new THREE.Vector3(),
    points: cloneOptionalVectors(lock.points),
    pointSurfaceNormals: cloneOptionalVectors(lock.pointSurfaceNormals),
    curveSurfaceSide: lock.curveSurfaceSide?.clone() || null,
    groupLatticeBasePoints: cloneOptionalVectors(lock.groupLatticeBasePoints),
    clumpRestPoints: cloneOptionalVectors(lock.clumpRestPoints),
    clumpGuideRestPoints: cloneOptionalVectors(lock.clumpGuideRestPoints),
    rootSurfacePoint: lock.rootSurfacePoint?.clone() || null,
    rootSurfaceNormal: lock.rootSurfaceNormal?.clone() || null,
    placementFrame: clonePlacementFrame(lock.placementFrame),
    objectTransform: normalizeStrandObjectTransform(lock.objectTransform)
  };
}

function strandObjectPreviewMeshSnapshot(lock) {
  const mesh = lock?.mesh;
  if (!mesh) return null;
  if (mesh.matrixAutoUpdate) mesh.updateMatrix();
  return {
    mesh,
    lockId: lock.id,
    matrixAutoUpdate: mesh.matrixAutoUpdate,
    matrix: mesh.matrix.clone(),
    position: mesh.position.clone(),
    quaternion: mesh.quaternion.clone(),
    scale: mesh.scale.clone()
  };
}

function restoreStrandObjectPreviewMeshes(edit) {
  [
    ...(edit?.previewMeshes || []),
    edit?.taperMeshPointsPreview
  ].filter(Boolean).forEach((snapshot) => {
    const mesh = snapshot.mesh;
    if (!mesh) return;
    mesh.position.copy(snapshot.position);
    mesh.quaternion.copy(snapshot.quaternion);
    mesh.scale.copy(snapshot.scale);
    mesh.matrix.copy(snapshot.matrix);
    mesh.matrixAutoUpdate = snapshot.matrixAutoUpdate;
    mesh.matrixWorldNeedsUpdate = true;
  });
}

function strandObjectTransformOperators(edit, handle) {
  const inverseStartQuaternion = edit.quaternion.clone().invert();
  const scale = new THREE.Vector3(
    Math.max(0.02, handle.scale.x / Math.max(0.0001, edit.scale.x)),
    Math.max(0.02, handle.scale.y / Math.max(0.0001, edit.scale.y)),
    Math.max(0.02, handle.scale.z / Math.max(0.0001, edit.scale.z))
  );
  const translation = handle.position.clone().sub(edit.position);
  const transformPoint = (point, pivot) => point?.clone()
    .sub(pivot)
    .applyQuaternion(inverseStartQuaternion)
    .multiply(scale)
    .applyQuaternion(handle.quaternion)
    .add(pivot)
    .add(translation) || null;
  const transformPointAroundFixedPivot = (point, pivot) => point?.clone()
    .sub(pivot)
    .applyQuaternion(inverseStartQuaternion)
    .multiply(scale)
    .applyQuaternion(handle.quaternion)
    .add(pivot) || null;
  const transformNormal = (normal) => {
    if (!normal) return null;
    const transformed = normal.clone().applyQuaternion(inverseStartQuaternion);
    transformed.set(
      transformed.x / scale.x,
      transformed.y / scale.y,
      transformed.z / scale.z
    );
    return transformed.applyQuaternion(handle.quaternion).normalize();
  };
  const transformDirection = (direction) => {
    if (!direction) return null;
    return direction.clone()
      .applyQuaternion(inverseStartQuaternion)
      .multiply(scale)
      .applyQuaternion(handle.quaternion)
      .normalize();
  };
  const linearMatrix = new THREE.Matrix4()
    .multiply(new THREE.Matrix4().makeRotationFromQuaternion(handle.quaternion))
    .multiply(new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z))
    .multiply(new THREE.Matrix4().makeRotationFromQuaternion(inverseStartQuaternion));
  const worldMatrixForPivot = (pivot) => {
    const transformedPivot = pivot.clone().applyMatrix4(linearMatrix);
    const matrix = linearMatrix.clone();
    matrix.setPosition(pivot.clone().add(translation).sub(transformedPivot));
    return matrix;
  };
  const worldMatrixForFixedPivot = (pivot) => {
    const transformedPivot = pivot.clone().applyMatrix4(linearMatrix);
    const matrix = linearMatrix.clone();
    matrix.setPosition(pivot.clone().sub(transformedPivot));
    return matrix;
  };
  return {
    transformPoint,
    transformPointAroundFixedPivot,
    transformNormal,
    transformDirection,
    worldMatrixForPivot,
    worldMatrixForFixedPivot
  };
}

function applyStrandObjectPreviewMatrix(lock, worldDelta, snapshot) {
  const mesh = lock?.mesh;
  if (!mesh || !snapshot) return;
  mesh.parent?.updateWorldMatrix(true, false);
  const parentWorld = mesh.parent?.matrixWorld || new THREE.Matrix4();
  const localMatrix = parentWorld.clone().invert()
    .multiply(worldDelta)
    .multiply(parentWorld)
    .multiply(snapshot.matrix);
  mesh.matrixAutoUpdate = false;
  mesh.matrix.copy(localMatrix);
  mesh.matrixWorldNeedsUpdate = true;
}

const branchHierarchy = createBranchHierarchyApi({
  curveFrameAtPoint, getSelectedLock, strandControlPointHitFromEvent, syncLockFromCurve, updateLockGeometry, locks,
  branchState: branch.state, selState: sel.state,
  branchRootRegionFromParam: (...a) => branchRegion.branchRootRegionFromParam(...a),
  applyBranchRootOffset: (...a) => branchBridge.applyBranchRootOffset(...a),
  captureBranchLocalState: (...a) => branchRootBone.captureBranchLocalState(...a),
  ensureBranchParentNormalField: (...a) => branchRootBone.ensureBranchParentNormalField(...a),
  branchParentFrame: (...a) => branchRootBone.branchParentFrame(...a),
  branchWorldVector: (...a) => branchRootBone.branchWorldVector(...a)
});


function beginStrandObjectTransform(handle) {
  if (handle !== strandObjectTransformHandle || componentEditModeActive()) return;
  const activeLock = getSelectedLock();
  if (!activeLock) return;
  const selectedTargets = selectedLocksInOrder();
  const selectedTargetIds = new Set(selectedTargets.map((lock) => lock.id));
  const targets = selectedTargets.filter((lock) => (
    !lock.branchParentId || !selectedTargetIds.has(lock.branchParentId)
  ));
  const sharedClumpPivot = sel.state.clumpViewportSelection ? strandObjectRoot(activeLock)?.clone() : null;
  const previewLocks = new Set(targets);
  targets.forEach((lock) => {
    branchHierarchy.branchChildrenFor(lock).forEach((child) => previewLocks.add(child));
    const partner = mirrorPartnerFor(lock);
    if (partner) {
      previewLocks.add(partner);
      branchHierarchy.branchChildrenFor(partner).forEach((child) => previewLocks.add(child));
    }
  });
  const targetSnapshots = targets.map((lock) => strandObjectTransformSnapshot(lock, sharedClumpPivot));
  const taperPreviewLockId = hairState.state.taperMeshPointsVisible && sculptState.state.taperCurveEdit?.type === "strand"
    ? sculptState.state.taperCurveEdit.id
    : null;
  hairState.state.activeStrandObjectTransform = {
    position: handle.position.clone(),
    quaternion: handle.quaternion.clone(),
    scale: handle.scale.clone(),
    targets: targetSnapshots,
    previewMeshes: [...previewLocks].map(strandObjectPreviewMeshSnapshot).filter(Boolean),
    taperMeshPointsPreview: targetSnapshots.some(({ lockId }) => lockId === taperPreviewLockId)
      ? strandObjectPreviewMeshSnapshot({ id: taperPreviewLockId, mesh: taperMeshPointsGroup })
      : null
  };
  hairState.state.activeStrandObjectTransform.previewMeshByLockId = new Map(
    hairState.state.activeStrandObjectTransform.previewMeshes.map((snapshot) => [snapshot.lockId, snapshot])
  );
}

function updateStrandObjectTransform(handle) {
  const edit = hairState.state.activeStrandObjectTransform;
  if (!edit || handle !== strandObjectTransformHandle) return;
  const { worldMatrixForPivot, worldMatrixForFixedPivot } = strandObjectTransformOperators(edit, handle);
  const targetIds = new Set(edit.targets.map((target) => target.lockId));
  edit.targets.forEach((target) => {
    const lock = target.lock;
    if (!lock) return;
    const previewSnapshot = edit.previewMeshByLockId.get(lock.id);
    const worldDelta = lock.branchParentId
      ? worldMatrixForFixedPivot(target.pivot)
      : worldMatrixForPivot(target.pivot);
    applyStrandObjectPreviewMatrix(lock, worldDelta, previewSnapshot);
    branchHierarchy.branchChildrenFor(lock).forEach((child) => {
      if (targetIds.has(child.id)) return;
      applyStrandObjectPreviewMatrix(
        child,
        worldDelta,
        edit.previewMeshByLockId.get(child.id)
      );
    });
    if (edit.taperMeshPointsPreview?.lockId === lock.id) {
      applyStrandObjectPreviewMatrix(
        { mesh: taperMeshPointsGroup },
        worldDelta,
        edit.taperMeshPointsPreview
      );
    }
    const partner = mirrorPartnerFor(lock);
    if (partner && !targetIds.has(partner.id)) {
      const reflection = new THREE.Matrix4().makeScale(-1, 1, 1);
      const mirroredDelta = reflection.clone().multiply(worldDelta).multiply(reflection);
      applyStrandObjectPreviewMatrix(
        partner,
        mirroredDelta,
        edit.previewMeshByLockId.get(partner.id)
      );
      branchHierarchy.branchChildrenFor(partner).forEach((child) => {
        if (targetIds.has(child.id)) return;
        applyStrandObjectPreviewMatrix(
          child,
          mirroredDelta,
          edit.previewMeshByLockId.get(child.id)
        );
      });
    }
  });
}

const branchRootBone = createBranchRootBoneApi({
  commitClumpMemberRestState: clumpProceduralApi.commitClumpMemberRestState, componentEditModeActive, controlPointRotationAt,
  curveFrameAt, curveFrameAtPoint, getSelectedLock, strandControlPointFrame,
  transportedStrandFrameAt, updateBranchChildren: branchHierarchy.updateBranchChildren, locks, transformControls,
  updateBranchRootRegionCenter: (lock, u, v) => branchRegion.updateBranchRootRegionCenter(lock, u, v),
  branchState: branch.state, selState: sel.state, sculptState: sculptState.state
});


function commitStrandObjectTransform(edit, handle) {
  if (!edit || handle !== strandObjectTransformHandle) return;
  const {
    transformPoint,
    transformPointAroundFixedPivot,
    transformNormal,
    transformDirection
  } = strandObjectTransformOperators(edit, handle);
  const targetIds = new Set(edit.targets.map((target) => target.lockId));
  edit.targets.forEach((target) => {
    const lock = target.lock;
    if (!lock) return;
    lock.objectTransform = edit.authoredTransformOverrides?.get(lock.id)
      || strandObjectTransformValuesAfterHandle(target.objectTransform, edit, handle);
    const pointTransform = lock.branchParentId ? transformPointAroundFixedPivot : transformPoint;
    const mapPoints = (points) => points?.map((point) => pointTransform(point, target.pivot)) || null;
    lock.points = mapPoints(target.points) || lock.points;
    if (target.groupLatticeBasePoints) lock.groupLatticeBasePoints = mapPoints(target.groupLatticeBasePoints);
    if (target.clumpRestPoints) lock.clumpRestPoints = mapPoints(target.clumpRestPoints);
    if (target.clumpGuideRestPoints) lock.clumpGuideRestPoints = mapPoints(target.clumpGuideRestPoints);
    lock.pointSurfaceNormals = target.pointSurfaceNormals?.map(transformNormal) || [];
    if (target.curveSurfaceSide) {
      lock.curveSurfaceSide = transformDirection(target.curveSurfaceSide);
    }
    lock.rootSurfacePoint = transformPoint(target.rootSurfacePoint, target.pivot);
    lock.rootSurfaceNormal = transformNormal(target.rootSurfaceNormal);
    if (target.placementFrame) {
      lock.placementFrame = {
        ...target.placementFrame,
        root: transformPoint(target.placementFrame.root, target.pivot),
        normal: transformNormal(target.placementFrame.normal),
        flow: transformNormal(target.placementFrame.flow),
        side: transformNormal(target.placementFrame.side),
        gravity: transformNormal(target.placementFrame.gravity)
      };
    }
    if (lock.branchParentId) {
      branchRootBone.enforceBranchRootPosition(lock);
      branchRootBone.captureBranchLocalState(lock);
    }
    syncLockFromCurve(lock);
    updateLockGeometry(lock, { immediate: true });
    const partner = mirrorPartnerFor(lock);
    if (!partner || !targetIds.has(partner.id)) syncActiveMirror(lock);
  });
  const activeLock = getSelectedLock();
  if (activeLock) syncInputs(activeLock);
}

function finishStrandObjectTransform() {
  const edit = hairState.state.activeStrandObjectTransform;
  const editedIds = edit?.targets?.map((target) => target.lockId) || [];
  restoreStrandObjectPreviewMeshes(edit);
  commitStrandObjectTransform(edit, strandObjectTransformHandle);
  hairState.state.activeStrandObjectTransform = null;
  flushPendingLockGeometryUpdates();
  editedIds.forEach((id) => {
    const lock = locks.find((item) => item.id === id);
    if (lock) updateCurveObjects(lock, { visible: false });
  });
  attachStrandObjectTransform();
  syncStrandObjectTransformPanel();
}

function surfaceObjectAnchorPose(lock) {
  if (lock?.geometryType !== "surface" || !lock.points?.length) return null;
  const sample = panelTipStrand.surfaceLatticeSampleVectors(lock, 0.5, 0);
  const x = sample.tangentU.clone();
  const y = sample.tangentV.clone();
  if (x.lengthSq() < 0.000001) x.set(1, 0, 0);
  if (y.lengthSq() < 0.000001) y.set(0, -1, 0);
  x.normalize();
  y.addScaledVector(x, -y.dot(x));
  if (y.lengthSq() < 0.000001) y.set(0, -1, 0).addScaledVector(x, x.y);
  y.normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  if (z.lengthSq() < 0.000001) z.set(0, 0, 1);
  z.normalize();
  y.crossVectors(z, x).normalize();
  return {
    position: sample.point,
    quaternion: new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(x, y, z)
    )
  };
}

function attachSurfaceObjectAnchorTransform(lock) {
  const anchor = lock?.geometryType === "surface" ? lock.curveObjects?.surfaceObjectAnchor : null;
  if (!anchor || sel.state.selectedSurfaceObjectAnchorId !== lock.id || !["move", "rotate", "scale"].includes(sel.state.activeTool)) return false;
  configureTransformControls(sel.state.activeTool);
  if (sel.state.activeTool === "scale") {
    transformControls.showX = true;
    transformControls.showY = true;
    transformControls.showZ = true;
  }
  transformControls.attach(anchor);
  return true;
}

function selectSurfaceObjectAnchor(lock, attachTransform = ["move", "rotate", "scale"].includes(sel.state.activeTool)) {
  if (lock?.geometryType !== "surface" || !lock.curveObjects?.surfaceObjectAnchor) return false;
  sel.state.selectedSurfaceObjectAnchorId = lock.id;
  sel.state.selectedPoint = null;
  sel.state.selectedCurveLatticePoint = null;
  guideApi.clearMultiPointSelection();
  updateSelectedPointLabel();
  guideApi.updateViewportToolVisibility();
  updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId });
  transformControls.detach();
  if (attachTransform) attachSurfaceObjectAnchorTransform(lock);
  placementApi.updatePlacementStatus();
  return true;
}

function beginSurfaceObjectTransform(anchor) {
  const lock = locks.find((item) => item.id === anchor?.userData?.lockId);
  if (lock?.geometryType !== "surface") return;
  const hadMirrorPartner = Boolean(mirrorPartnerFor(lock));
  syncActiveMirror(lock, { refreshUi: !hadMirrorPartner });
  transform.state.activeSurfaceObjectTransform = {
    lockId: lock.id,
    points: lock.points.map((point) => point.clone()),
    pointSurfaceNormals: lock.pointSurfaceNormals?.map((normal) => normal?.clone() || null) || [],
    groupLatticeBasePoints: lock.groupLatticeBasePoints?.map((point) => point.clone()) || null,
    rootSurfacePoint: lock.rootSurfacePoint?.clone() || null,
    rootSurfaceNormal: lock.rootSurfaceNormal?.clone() || null,
    placementFrame: lock.placementFrame ? {
      ...lock.placementFrame,
      root: lock.placementFrame.root?.clone() || null,
      normal: lock.placementFrame.normal?.clone() || null,
      flow: lock.placementFrame.flow?.clone() || null,
      side: lock.placementFrame.side?.clone() || null,
      gravity: lock.placementFrame.gravity?.clone() || null
    } : null,
    position: anchor.position.clone(),
    quaternion: anchor.quaternion.clone(),
    scale: anchor.scale.clone()
  };
}

function updateSurfaceObjectTransform(anchor) {
  const edit = transform.state.activeSurfaceObjectTransform;
  const lock = locks.find((item) => item.id === edit?.lockId);
  if (!edit || !lock || anchor?.userData?.lockId !== lock.id) return;
  const inverseStartQuaternion = edit.quaternion.clone().invert();
  const scale = new THREE.Vector3(
    Math.max(0.02, anchor.scale.x / Math.max(0.0001, edit.scale.x)),
    Math.max(0.02, anchor.scale.y / Math.max(0.0001, edit.scale.y)),
    Math.max(0.02, anchor.scale.z / Math.max(0.0001, edit.scale.z))
  );
  const transformPoint = (point) => point.clone()
    .sub(edit.position)
    .applyQuaternion(inverseStartQuaternion)
    .multiply(scale)
    .applyQuaternion(anchor.quaternion)
    .add(anchor.position);
  const transformNormal = (normal) => {
    if (!normal) return null;
    const transformed = normal.clone().applyQuaternion(inverseStartQuaternion);
    transformed.set(
      transformed.x / scale.x,
      transformed.y / scale.y,
      transformed.z / scale.z
    );
    return transformed.applyQuaternion(anchor.quaternion).normalize();
  };
  edit.points.forEach((point, index) => lock.points[index].copy(transformPoint(point)));
  if (edit.groupLatticeBasePoints) {
    lock.groupLatticeBasePoints = edit.groupLatticeBasePoints.map(transformPoint);
  }
  lock.pointSurfaceNormals = edit.pointSurfaceNormals.map(transformNormal);
  lock.rootSurfacePoint = edit.rootSurfacePoint ? transformPoint(edit.rootSurfacePoint) : null;
  lock.rootSurfaceNormal = edit.rootSurfaceNormal ? transformNormal(edit.rootSurfaceNormal) : null;
  if (edit.placementFrame) {
    lock.placementFrame = {
      ...edit.placementFrame,
      root: edit.placementFrame.root ? transformPoint(edit.placementFrame.root) : null,
      normal: transformNormal(edit.placementFrame.normal),
      flow: transformNormal(edit.placementFrame.flow),
      side: transformNormal(edit.placementFrame.side),
      gravity: transformNormal(edit.placementFrame.gravity)
    };
  }
  syncLockFromCurve(lock);
  updateLockGeometry(lock);
  syncActiveMirror(lock);
  syncInputs(lock);
}

function finishSurfaceObjectTransform() {
  const lock = locks.find((item) => item.id === transform.state.activeSurfaceObjectTransform?.lockId);
  transform.state.activeSurfaceObjectTransform = null;
  if (!lock) return;
  updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId });
  attachSurfaceObjectAnchorTransform(lock);
  flushPendingLockGeometryUpdates();
}

function beginHandleEdit(handle = transformControls.object) {
  // Wind preview mutual exclusion: a strand edit stroke start (pointerdown) closes the
  // preview so edits operate on, and rebuild from, the authored rest geometry.
  if (windStore.state.windPreviewActive) setWindPreviewActive(false);
  if (!handle?.userData?.lockId) return;
  const lock = locks.find((item) => item.id === handle.userData.lockId);
  if (!lock) return;
  const hadMirrorPartner = Boolean(mirrorPartnerFor(lock));
  syncActiveMirror(lock, { refreshUi: !hadMirrorPartner });
  const selectedIndices = sel.state.selectedControlPoints
    .filter((point) => point.type === "strand" && point.lockId === lock.id)
    .map((point) => point.pointIndex);
  if (!selectedIndices.includes(handle.userData.pointIndex)) selectedIndices.splice(0, selectedIndices.length, handle.userData.pointIndex);
  sculptState.state.activeHandleEdit = {
    lockId: lock.id,
    pointIndex: handle.userData.pointIndex,
    tool: sel.state.activeTool,
    points: lock.points.map((point) => point.clone()),
    groupLatticeBasePoints: lock.groupLatticeBasePoints?.map((point) => point.clone()) || null,
    pointSurfaceNormals: lock.pointSurfaceNormals?.map((normal) => normal?.clone?.() || null) || null,
    pointTwists: [...lock.pointTwists],
    pointScales: lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z })),
    handlePosition: handle.position.clone(),
    handleQuaternion: handle.quaternion.clone(),
    handleScale: handle.scale.clone(),
    selectedIndices
  };
  // Record the child skeleton's orientation/shape before a root-bone drag so the
  // rigid root move (Hierarchy editing) keeps the child's shape and only rotates it
  // halfway toward the parent surface frame at the new root (curvature tip swing).
  if (lock.branchParentId && handle.userData.pointIndex === 0) {
    const branchParent = locks.find((item) => item.id === lock.branchParentId);
    if (branchParent) {
      const rootFrame = branchRootBone.branchParentFrame(branchParent, lock.branchParentParameter);
      const across = new THREE.Vector3().subVectors(lock.points[0], rootFrame.point).dot(rootFrame.x);
      sculptState.state.activeHandleEdit.branchRigid = {
        frameQuat: branchRootBone.branchSurfaceFrameQuat(branchParent, lock.branchParentParameter, across),
        across,
        deltas: lock.points.map((point) => point.clone().sub(lock.points[0]))
      };
    }
  }
}

// Treat the child skeleton as a rigid body when its root bone is dragged with
// Hierarchy editing on: place it at the new root and rotate the recorded world
// shape by the parent frame's rotation change, blended 0.5 with fully straight,
// so the tip swings slightly with the parent surface curvature but never bends.
// Parent-surface frame at (parameter, across): the continuous guide frame plus the
// lateral normal tilt from a temporary elliptical cross-section (width x depth), so
// both up/down (guide curvature) and left/right (cross-section curvature) root drags
// rotate the child's tip.
// Keep the root handle (TransformControls gizmo) oriented with the stable bone
// frame during a Hierarchy-mode root drag, so the gizmo follows the sweep instead
// of staying frozen at the drag-start orientation (hot axis update).

function updateGroupLatticeBaseFromHandleEdit(lock) {
  const edit = sculptState.state.activeHandleEdit;
  if (!lock.groupLatticeBasePoints || !edit?.groupLatticeBasePoints) return;
  if (lock.groupLatticeBasePoints.length !== lock.points.length || edit.points.length !== lock.points.length) return;
  lock.points.forEach((point, index) => {
    lock.groupLatticeBasePoints[index]
      .copy(edit.groupLatticeBasePoints[index])
      .add(point.clone().sub(edit.points[index]));
  });
}

function multiPointHandleEditActive() {
  return (sculptState.state.activeHandleEdit?.selectedIndices?.length || 0) > 1;
}

function applyMultiMove(lock, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const delta = handle.position.clone().sub(edit.handlePosition);
  edit.selectedIndices.forEach((index) => lock.points[index].copy(edit.points[index]).add(delta));
}

function applyMultiRotate(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const activeTwist = twistFromHandle(lock, pointIndex, handle);
  const deltaTwist = activeTwist - edit.pointTwists[pointIndex];
  edit.selectedIndices.forEach((index) => {
    lock.pointTwists[index] = edit.pointTwists[index] + deltaTwist;
  });
}

function applyMultiScale(lock, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const ratioX = Math.max(0.18, handle.scale.x) / Math.max(0.18, edit.handleScale.x);
  const ratioZ = Math.max(0.18, handle.scale.z) / Math.max(0.18, edit.handleScale.z);
  edit.selectedIndices.forEach((index) => {
    setPointScale(lock, index, edit.pointScales[index].x * ratioX, edit.pointScales[index].z * ratioZ);
  });
}

function applyHierarchicalMove(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const delta = handle.position.clone().sub(edit.handlePosition);
  const curveEnd = lock.geometryType === "curve-surface"
    ? (Math.floor(pointIndex / lock.curveSurfaceRows) + 1) * lock.curveSurfaceRows
    : lock.points.length;
  for (let i = pointIndex; i < curveEnd; i += 1) {
    const depth = transform.state.recursiveHierarchyTransforms ? i - pointIndex + 1 : 1;
    lock.points[i].copy(edit.points[i]).addScaledVector(delta, depth);
  }
}

function applySingleMove(lock, pointIndex, handle) {
  lock.points[pointIndex].copy(handle.position);
}

function applySurfaceLatticeMirror(lock, pointIndex) {
  if (!sculptState.state.mirrorXEditing || lock?.geometryType !== "surface") return;
  const mirroredIndex = mirroredSurfaceLatticePointIndex(
    pointIndex,
    lock.surfaceColumns,
    lock.surfaceRows
  );
  const point = lock.points[pointIndex];
  const mirroredPoint = lock.points[mirroredIndex];
  if (!point || !mirroredPoint) return;
  if (mirroredIndex === pointIndex) {
    point.x = 0;
    return;
  }
  mirroredPoint.set(-point.x, point.y, point.z);
}

function curveSurfaceMirroredPointIndex(lock, pointIndex) {
  const rows = Math.max(2, Math.round(Number(lock?.curveSurfaceRows) || 0));
  const columns = Math.max(1, Math.round(Number(lock?.curveSurfaceColumns) || 0));
  const column = Math.floor(pointIndex / rows);
  const row = pointIndex % rows;
  if (column < 0 || column >= columns || row < 0 || row >= rows) return null;
  return (columns - 1 - column) * rows + row;
}

function syncUnifiedCurveSurfaceMirror(lock, sourcePointIndex, tool = sel.state.activeTool) {
  const edit = sculptState.state.activeHandleEdit;
  if (
    !sculptState.state.mirrorXEditing
    || !lock?.curveSurfaceSymmetric
    || lock.geometryType !== "curve-surface"
    || !edit?.points?.length
  ) return;
  const sourceStartX = Number(edit.points[sourcePointIndex]?.x || 0);
  const sourceSide = Math.sign(sourceStartX);
  const changed = (index) => {
    if (tool === "rotate") {
      return lock.points[index].distanceToSquared(edit.points[index]) > 0.000000001
        || Math.abs(Number(lock.pointTwists[index] || 0) - Number(edit.pointTwists[index] || 0)) > 0.000001;
    }
    if (tool === "scale") {
      const current = lock.pointScales[index] || { x: 1, z: 1 };
      const initial = edit.pointScales[index] || { x: 1, z: 1 };
      return Math.abs(current.x - initial.x) > 0.000001 || Math.abs(current.z - initial.z) > 0.000001;
    }
    return lock.points[index].distanceToSquared(edit.points[index]) > 0.000000001;
  };
  lock.points.forEach((point, index) => {
    const initialSide = Math.sign(Number(edit.points[index]?.x || 0));
    if (!changed(index) || (sourceSide === 0 ? initialSide !== 0 : initialSide !== sourceSide)) return;
    const mirroredIndex = curveSurfaceMirroredPointIndex(lock, index);
    if (mirroredIndex == null) return;
    const controllerRows = Math.max(2, Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
    const controllerRoot = index % controllerRows === 0;
    if (mirroredIndex === index) {
      point.x = 0;
      if (tool === "rotate" && !controllerRoot) lock.pointTwists[index] = 0;
      const centerNormal = lock.pointSurfaceNormals?.[index];
      if (centerNormal) {
        centerNormal.x = 0;
        centerNormal.normalize?.();
      }
      return;
    }
    lock.points[mirroredIndex].set(-point.x, point.y, point.z);
    if (lock.pointSurfaceNormals?.[index]) {
      const normal = lock.pointSurfaceNormals[index];
      lock.pointSurfaceNormals[mirroredIndex] = new THREE.Vector3(-normal.x, normal.y, normal.z).normalize();
    }
    lock.pointScales[mirroredIndex] = { ...lock.pointScales[index] };
    lock.pointWidths[mirroredIndex] = lock.pointWidths[index];
    if (!(tool === "rotate" && controllerRoot)) {
      lock.pointTwists[mirroredIndex] = -Number(lock.pointTwists[index] || 0);
    }
  });
}

function applyPullMove(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  if (!edit?.points?.length || pointIndex < 0 || pointIndex >= edit.points.length) return;
  const solved = solvePulledStrand(edit.points, pointIndex, handle.position, 0, sculptState.state.pullRigidity);
  const constrained = sculptState.state.pullCollisionEnabled ? constrainPullPointsOutsideHead(solved, lock) : solved;
  constrained.forEach((point, index) => lock.points[index].copy(point));
}

function pullHeadCollisionContext() {
  const edit = sculptState.state.activeHandleEdit;
  if (edit?.pullHeadCollisionContext) return edit.pullHeadCollisionContext;
  const meshes = scalpBuilder.scalpBuilderHeadMeshes();
  if (!meshes.length) return null;
  const bounds = new THREE.Box3();
  meshes.forEach((mesh) => bounds.expandByObject(mesh));
  if (bounds.isEmpty()) return null;
  const size = bounds.getSize(new THREE.Vector3());
  const context = {
    meshes,
    center: bounds.getCenter(new THREE.Vector3()),
    rayDistance: Math.max(size.x, size.y, size.z) * 1.6,
    raycaster: new THREE.Raycaster()
  };
  if (edit) edit.pullHeadCollisionContext = context;
  return context;
}

function constrainPullPointsOutsideHead(points, lock) {
  const context = pullHeadCollisionContext();
  if (!context) return points;
  const margin = Math.max(0.018, Number(lock.width ?? lock.baseWidth ?? 0.16) * 0.24);
  return points.map((point, index) => {
    if (index === 0) return point;
    const direction = point.clone().sub(context.center);
    if (direction.lengthSq() < 0.000001) direction.set(0, 1, 0);
    direction.normalize();
    context.raycaster.set(
      context.center.clone().addScaledVector(direction, context.rayDistance),
      direction.clone().negate()
    );
    context.raycaster.near = 0;
    context.raycaster.far = context.rayDistance * 2;
    const hit = context.raycaster.intersectObjects(context.meshes, false)[0];
    if (!hit) return point;
    const requiredDistance = hit.point.distanceTo(context.center) + margin;
    if (point.distanceTo(context.center) >= requiredDistance) return point;
    return context.center.clone().addScaledVector(direction, requiredDistance);
  });
}

function applyProportionalMove(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const delta = handle.position.clone().sub(edit.handlePosition);
  const range = curveSurfaceCreate.curveSurfaceControllerPointRange(lock);
  for (let i = range.start; i < range.end; i += 1) {
    const weight = proportionalWeight(i, pointIndex);
    if (weight <= 0) continue;
    lock.points[i].copy(edit.points[i]).add(delta.clone().multiplyScalar(weight));
  }
}

function viewPlaneNormal() {
  return nearestCardinalAxis(camera.position.clone().sub(controls.target));
}

function isCameraInSnappedView() {
  if (!ui.state.shiftSnappedViewActive) return false;
  const direction = camera.position.clone().sub(controls.target).normalize();
  const stillSnapped = direction.dot(nearestCardinalAxis(direction)) >= 0.9995;
  if (!stillSnapped) ui.state.shiftSnappedViewActive = false;
  return stillSnapped;
}

function viewPlaneMoveActiveForView() {
  return sculptState.state.viewPlaneMoveEnabled && (!ui.state.viewPlaneMoveSnappedOnly || isCameraInSnappedView());
}

function updateViewPlaneGrid() {
  const lock = sel.state.selectedPoint
    ? locks.find((item) => item.id === sel.state.selectedPoint.lockId)
    : null;
  const point = lock?.points[sel.state.selectedPoint?.pointIndex];
  const latticeGuide = sel.state.selectedCurveLatticePoint
    ? guides.find((item) => item.id === sel.state.selectedCurveLatticePoint.guideId)
    : null;
  const latticePoint = latticeGuide && sel.state.selectedCurveLatticePoint
    ? guideApi.curveLatticeEditablePoint(latticeGuide, sel.state.selectedCurveLatticePoint.pointIndex)
    : null;
  const selectedMovePoint = latticePoint || point;
  const selectedMoveHandle = latticePoint
    ? latticeGuide?.handlesGroup?.children[sel.state.selectedCurveLatticePoint.pointIndex]
    : lock?.curveObjects?.handles[sel.state.selectedPoint?.pointIndex];
  const directMoveActive = viewPlaneMoveActiveForView() && sel.state.activeTool === "move";
  const strokeToolActive = ["draw", "procedural-draw", "braid", "panel", "surface-loft", "curve-surface"].includes(sel.state.activeTool);
  const activeFreePlane = sel.state.activeTool === "surface-loft"
    ? miscState.state.loftSurfaceDraft?.activeStroke?.freePlane
    : sel.state.activeTool === "curve-surface"
      ? sculptState.state.curveSurfaceDraft?.activeStroke?.freePlane
      : sculptState.state.drawStrandStroke?.freePlane;
  const freeDrawActive = strokeToolActive && Boolean(activeFreePlane);
  const originPlaneActive = strokeToolActive && drawFlowApi.activeStrokeSurfaceValue() === "contextual-plane";
  const strandPointActive = Boolean(point) && lock.id === sel.state.selectedId;
  const latticePointActive = Boolean(latticePoint) && latticeGuide.id === sel.state.activeCurveLatticeGuideId;
  const expectedMoveHandle = strandPointActive && pullMoveActive() ? pullTarget : selectedMoveHandle;
  const visible = originPlaneActive || freeDrawActive || (directMoveActive && (strandPointActive || latticePointActive));
  viewPlaneFill.visible = visible;
  viewPlaneGrid.visible = visible;
  if (!visible) {
    if (
      sel.state.activeTool === "move" &&
      selectedMovePoint &&
      (strandPointActive || latticePointActive) &&
      !sculptState.state.viewPlaneMoveDrag &&
      transformControls.object !== expectedMoveHandle
    ) {
      if (selectedMoveHandle) {
        configureTransformControls("move");
        if (strandPointActive) attachTransformForCurvePoint(lock, sel.state.selectedPoint.pointIndex, selectedMoveHandle);
        else transformControls.attach(selectedMoveHandle);
      }
    }
    return;
  }
  if (!sculptState.state.viewPlaneMoveDrag && transformControls.object) transformControls.detach();
  const normal = activeFreePlane?.normal || sculptState.state.viewPlaneMoveDrag?.planeNormal || viewPlaneNormal();
  const origin = originPlaneActive
    ? new THREE.Vector3(0, 0, 0)
    : activeFreePlane?.origin || sculptState.state.viewPlaneMoveDrag?.planeOrigin || selectedMovePoint;
  viewPlaneGrid.position.copy(origin);
  viewPlaneGrid.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  viewPlaneFill.position.copy(origin);
  viewPlaneFill.quaternion.copy(viewPlaneGrid.quaternion);
}

function setViewPlaneMove(enabled) {
  endViewPlaneMove();
  sculptState.state.viewPlaneMoveEnabled = Boolean(enabled);
  viewPlaneMoveInput.checked = sculptState.state.viewPlaneMoveEnabled;
  viewPlaneMoveSnappedOnlyInput.disabled = !sculptState.state.viewPlaneMoveEnabled;
  viewPlaneMoveSnappedSetting.classList.toggle("disabled", !sculptState.state.viewPlaneMoveEnabled);
  if (sculptState.state.viewPlaneMoveEnabled) transformControls.detach();
  updateViewPlaneGrid();
  updateInteractionLocks();
}

function setViewPlaneMoveSnappedOnly(enabled) {
  endViewPlaneMove();
  ui.state.viewPlaneMoveSnappedOnly = Boolean(enabled);
  viewPlaneMoveSnappedOnlyInput.checked = ui.state.viewPlaneMoveSnappedOnly;
  updateViewPlaneGrid();
  updateInteractionLocks();
}

function rayFromViewportEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.ray;
}

function worldUnitsPerViewportPixel(point) {
  const viewportHeight = Math.max(1, renderer.domElement.getBoundingClientRect().height);
  if (camera.isOrthographicCamera) {
    return Math.abs(camera.top - camera.bottom) / Math.max(0.0001, camera.zoom) / viewportHeight;
  }
  const distance = Math.max(0.0001, camera.position.distanceTo(point));
  const verticalFov = THREE.MathUtils.degToRad(camera.fov || 50);
  return 2 * Math.tan(verticalFov * 0.5) * distance / viewportHeight;
}

function viewPlaneMovePointNormal(lock, latticeGuide, pointIndex) {
  let normal = null;
  if (lock && lock.geometryType !== "surface") {
    normal = pointUpDirection(lock, pointIndex)?.clone?.() || null;
  } else if (latticeGuide) {
    normal = latticeGuide.pointNormals?.[pointIndex]?.clone?.() || null;
  }
  if (!normal || normal.lengthSq() < 0.0001) normal = viewPlaneNormal();
  return normal.normalize();
}

function updateViewPlaneNormalGuide() {
  const drag = sculptState.state.viewPlaneMoveDrag;
  const visible = Boolean(drag?.normalMoveActive);
  viewPlaneNormalGuide.visible = visible;
  if (!visible) return;
  const center = drag.handle.position;
  const extent = Math.max(0.8, worldUnitsPerViewportPixel(center) * 120);
  viewPlaneNormalGuide.geometry.setFromPoints([
    center.clone().addScaledVector(drag.normal, -extent),
    center.clone().addScaledVector(drag.normal, extent)
  ]);
}

function rebaseViewPlaneMoveDrag(normalMoveActive = sculptState.state.viewPlaneNormalMoveHeld) {
  const drag = sculptState.state.viewPlaneMoveDrag;
  if (!drag) return;
  drag.normalMoveActive = Boolean(normalMoveActive);
  drag.handlePosition.copy(drag.handle.position);
  drag.planeOrigin.copy(drag.handle.position);
  drag.plane.setFromNormalAndCoplanarPoint(drag.planeNormal, drag.planeOrigin);
  drag.startPointerY = drag.lastPointerY;
  drag.normalUnitsPerPixel = worldUnitsPerViewportPixel(drag.handle.position);
  const intersection = rayFromViewportEvent({
    clientX: drag.lastPointerX,
    clientY: drag.lastPointerY
  }).intersectPlane(drag.plane, new THREE.Vector3());
  if (intersection) drag.startIntersection.copy(intersection);
  renderer.domElement.style.cursor = drag.normalMoveActive ? "ns-resize" : "move";
  updateViewPlaneNormalGuide();
  updateViewPlaneGrid();
}

function setViewPlaneNormalMoveHeld(held) {
  const next = Boolean(held);
  if (sculptState.state.viewPlaneNormalMoveHeld === next) return;
  sculptState.state.viewPlaneNormalMoveHeld = next;
  rebaseViewPlaneMoveDrag(next);
}

function beginViewPlaneMove(lock, handle, event) {
  if (!viewPlaneMoveActiveForView() || sel.state.activeTool !== "move" || event.button !== 0) return false;
  if (lock?.locked) return false;
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return false;
  const latticeGuideId = handle.userData.curveLatticeGuideId;
  const latticePointIndex = handle.userData.curveLatticePointIndex;
  const isLatticePoint = latticeGuideId !== undefined && latticePointIndex !== undefined;
  if (!isLatticePoint && !lock) return false;
  const latticeGuide = isLatticePoint
    ? guides.find((item) => item.id === latticeGuideId)
    : null;
  const planeNormal = viewPlaneNormal();
  const normal = viewPlaneMovePointNormal(
    lock,
    latticeGuide,
    isLatticePoint ? latticePointIndex : handle.userData.pointIndex
  );
  const planeOrigin = handle.position.clone();
  const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, planeOrigin);
  const startIntersection = rayFromViewportEvent(event).intersectPlane(plane, new THREE.Vector3());
  if (!startIntersection) return false;

  pushUndoState();
  transformControls.detach();
  if (isLatticePoint) guideApi.beginCurveLatticeMultiEdit(handle);
  else beginHandleEdit(handle);
  const dragHandle = !isLatticePoint && pullMoveActive() ? pullTarget : handle;
  if (dragHandle === pullTarget) {
    pullTarget.position.copy(handle.position);
    pullTarget.quaternion.identity();
    pullTarget.scale.set(1, 1, 1);
    pullTarget.userData.lockId = lock.id;
    pullTarget.userData.pointIndex = handle.userData.pointIndex;
    pullTarget.userData.pullTarget = true;
  }
  sculptState.state.viewPlaneMoveDrag = {
    pointerId: event.pointerId,
    kind: isLatticePoint ? "curve-lattice" : "strand",
    lockId: lock?.id,
    guideId: latticeGuideId,
    pointIndex: isLatticePoint ? latticePointIndex : handle.userData.pointIndex,
    handle: dragHandle,
    handlePosition: dragHandle.position.clone(),
    normal,
    planeNormal,
    planeOrigin,
    plane,
    startIntersection,
    lastPointerX: event.clientX,
    lastPointerY: event.clientY,
    startPointerY: event.clientY,
    normalUnitsPerPixel: worldUnitsPerViewportPixel(dragHandle.position),
    normalMoveActive: sculptState.state.viewPlaneNormalMoveHeld
  };
  renderer.domElement.setPointerCapture?.(event.pointerId);
  renderer.domElement.style.cursor = sculptState.state.viewPlaneNormalMoveHeld ? "ns-resize" : "move";
  updateViewPlaneNormalGuide();
  updateViewPlaneGrid();
  updateInteractionLocks();
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}

function updateViewPlaneMove(event) {
  if (!sculptState.state.viewPlaneMoveDrag || event.pointerId !== sculptState.state.viewPlaneMoveDrag.pointerId) return;
  sculptState.state.viewPlaneMoveDrag.lastPointerX = event.clientX;
  sculptState.state.viewPlaneMoveDrag.lastPointerY = event.clientY;
  if (sculptState.state.viewPlaneMoveDrag.normalMoveActive !== sculptState.state.viewPlaneNormalMoveHeld) {
    rebaseViewPlaneMoveDrag(sculptState.state.viewPlaneNormalMoveHeld);
  }
  if (sculptState.state.viewPlaneMoveDrag.normalMoveActive) {
    const normalDistance = (sculptState.state.viewPlaneMoveDrag.startPointerY - event.clientY)
      * sculptState.state.viewPlaneMoveDrag.normalUnitsPerPixel;
    sculptState.state.viewPlaneMoveDrag.handle.position
      .copy(sculptState.state.viewPlaneMoveDrag.handlePosition)
      .addScaledVector(sculptState.state.viewPlaneMoveDrag.normal, normalDistance);
  } else {
    const intersection = rayFromViewportEvent(event).intersectPlane(sculptState.state.viewPlaneMoveDrag.plane, new THREE.Vector3());
    if (!intersection) return;
    sculptState.state.viewPlaneMoveDrag.handle.position
      .copy(sculptState.state.viewPlaneMoveDrag.handlePosition)
      .add(intersection.sub(sculptState.state.viewPlaneMoveDrag.startIntersection));
  }
  updateViewPlaneNormalGuide();

  if (sculptState.state.viewPlaneMoveDrag.kind === "curve-lattice") {
    const guide = guides.find((item) => item.id === sculptState.state.viewPlaneMoveDrag.guideId);
    if (!guide) {
      endViewPlaneMove(event);
      return;
    }
    if (sculptState.state.activeLatticeMultiEdit) guideApi.applyCurveLatticeMultiTransform(sculptState.state.viewPlaneMoveDrag.handle);
    else guideApi.updateCurveLatticeFromHandle(sculptState.state.viewPlaneMoveDrag.handle);
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  const lock = locks.find((item) => item.id === sculptState.state.viewPlaneMoveDrag.lockId);
  if (!lock || !sculptState.state.activeHandleEdit) {
    endViewPlaneMove(event);
    return;
  }

  if (lock.geometryType === "surface") {
    if (multiPointHandleEditActive()) applyMultiMove(lock, sculptState.state.viewPlaneMoveDrag.handle);
    else applySingleMove(lock, sculptState.state.viewPlaneMoveDrag.pointIndex, sculptState.state.viewPlaneMoveDrag.handle);
    applySurfaceLatticeMirror(lock, sculptState.state.viewPlaneMoveDrag.pointIndex);
  } else if (pullMoveActive()) applyPullMove(lock, sculptState.state.viewPlaneMoveDrag.pointIndex, sculptState.state.viewPlaneMoveDrag.handle);
  else if (multiPointHandleEditActive()) applyMultiMove(lock, sculptState.state.viewPlaneMoveDrag.handle);
  else if (sculptState.state.hierarchyEditing) applyHierarchicalMove(lock, sculptState.state.viewPlaneMoveDrag.pointIndex, sculptState.state.viewPlaneMoveDrag.handle);
  else if (sculptState.state.proportionalEditing) applyProportionalMove(lock, sculptState.state.viewPlaneMoveDrag.pointIndex, sculptState.state.viewPlaneMoveDrag.handle);
  else applySingleMove(lock, sculptState.state.viewPlaneMoveDrag.pointIndex, sculptState.state.viewPlaneMoveDrag.handle);
  branchRootBone.enforceBranchRootPosition(lock);
  if (sculptState.state.hierarchyEditing && sculptState.state.viewPlaneMoveDrag.pointIndex === 0 && lock.branchParentId) {
    branchRootBone.applyBranchRigidRootMove(lock);
    branchRootBone.syncBranchRootHandleFrame(lock);
  }
  syncUnifiedCurveSurfaceMirror(lock, sculptState.state.viewPlaneMoveDrag.pointIndex, "move");
  updateGroupLatticeBaseFromHandleEdit(lock);
  syncLockFromCurve(lock);
  updateLockGeometry(lock);
  syncActiveMirror(lock);
  syncInputs(lock);
  event.preventDefault();
  event.stopImmediatePropagation();
}

function endViewPlaneMove(event) {
  if (!sculptState.state.viewPlaneMoveDrag || (event?.pointerId !== undefined && event.pointerId !== sculptState.state.viewPlaneMoveDrag.pointerId)) return;
  const pointerId = sculptState.state.viewPlaneMoveDrag.pointerId;
  const editedLock = locks.find((item) => item.id === sculptState.state.activeHandleEdit?.lockId);
  clumpProceduralApi.commitClumpMemberRestState(editedLock);
  clumpProceduralApi.commitClumpMemberRestState(mirrorPartnerFor(editedLock));
  sculptState.state.viewPlaneMoveDrag = null;
  updateViewPlaneNormalGuide();
  flushPendingLockGeometryUpdates();
  sculptState.state.activeHandleEdit = null;
  sculptState.state.activeLatticeMultiEdit = null;
  if (renderer.domElement.hasPointerCapture?.(pointerId)) renderer.domElement.releasePointerCapture(pointerId);
  renderer.domElement.style.cursor = "";
  updateViewPlaneGrid();
  updateInteractionLocks();
  event?.preventDefault();
  event?.stopImmediatePropagation();
}

function applyHierarchicalRotate(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const pivot = edit.points[pointIndex];
  const deltaQ = handle.quaternion.clone().multiply(edit.handleQuaternion.clone().invert());
  const range = curveSurfaceCreate.curveSurfaceControllerPointRange(lock, lock.geometryType === "curve-surface"
    ? Math.floor(pointIndex / lock.curveSurfaceRows)
    : null);
  const rotateGuideNormal = (index, rotation) => {
    const original = edit.pointSurfaceNormals?.[index];
    if (!original) return;
    if (!lock.pointSurfaceNormals) lock.pointSurfaceNormals = [];
    if (!lock.pointSurfaceNormals[index]) lock.pointSurfaceNormals[index] = original.clone();
    lock.pointSurfaceNormals[index].copy(original).applyQuaternion(rotation).normalize();
  };
  lock.points[pointIndex].copy(edit.points[pointIndex]);
  if (transform.state.recursiveHierarchyTransforms) {
    const accumulatedQ = new THREE.Quaternion();
    rotateGuideNormal(pointIndex, deltaQ);
    for (let i = pointIndex + 1; i < range.end; i += 1) {
      accumulatedQ.multiply(deltaQ);
      const segment = edit.points[i].clone().sub(edit.points[i - 1]).applyQuaternion(accumulatedQ);
      lock.points[i].copy(lock.points[i - 1]).add(segment);
      rotateGuideNormal(i, accumulatedQ);
    }
  } else {
    rotateGuideNormal(pointIndex, deltaQ);
    for (let i = pointIndex + 1; i < range.end; i += 1) {
      lock.points[i].copy(edit.points[i]).sub(pivot).applyQuaternion(deltaQ).add(pivot);
      rotateGuideNormal(i, deltaQ);
    }
  }
  if (pointIndex === range.start) {
    for (let i = range.start; i < range.end; i += 1) lock.pointTwists[i] = edit.pointTwists[i];
    return;
  }
  const originalFrame = curveFrameAtSnapshot(lock, edit.points, edit.pointTwists, pointIndex, 0);
  const originalHandleZ = new THREE.Vector3(0, 0, 1).applyQuaternion(edit.handleQuaternion).normalize();
  const handleZ = new THREE.Vector3(0, 0, 1).applyQuaternion(handle.quaternion).normalize();
  const deltaTwist = signedAngleAroundAxis(originalHandleZ, handleZ, originalFrame.y);
  for (let i = pointIndex; i < range.end; i += 1) {
    const depth = transform.state.recursiveHierarchyTransforms ? i - pointIndex + 1 : 1;
    lock.pointTwists[i] = edit.pointTwists[i] + deltaTwist * depth;
  }
}

function applySingleRotate(lock, pointIndex, handle) {
  lock.pointTwists[pointIndex] = twistFromHandle(lock, pointIndex, handle);
}

function applyProportionalRotate(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const pivot = edit.points[pointIndex];
  const deltaQ = handle.quaternion.clone().multiply(edit.handleQuaternion.clone().invert());
  const originalFrame = curveFrameAtSnapshot(lock, edit.points, edit.pointTwists, pointIndex, 0);
  const originalHandleZ = new THREE.Vector3(0, 0, 1).applyQuaternion(edit.handleQuaternion).normalize();
  const handleZ = new THREE.Vector3(0, 0, 1).applyQuaternion(handle.quaternion).normalize();
  const deltaTwist = signedAngleAroundAxis(originalHandleZ, handleZ, originalFrame.y);
  const identity = new THREE.Quaternion();

  const range = curveSurfaceCreate.curveSurfaceControllerPointRange(lock);
  for (let i = range.start; i < range.end; i += 1) {
    const weight = proportionalWeight(i, pointIndex);
    if (weight <= 0) continue;
    const weightedQ = identity.clone().slerp(deltaQ, weight);
    lock.points[i].copy(edit.points[i]).sub(pivot).applyQuaternion(weightedQ).add(pivot);
    lock.pointTwists[i] = edit.pointTwists[i] + deltaTwist * weight;
  }
}

function applyHierarchicalScale(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const ratioX = Math.max(0.18, handle.scale.x) / Math.max(0.18, edit.handleScale.x);
  const ratioZ = Math.max(0.18, handle.scale.z) / Math.max(0.18, edit.handleScale.z);
  for (let i = pointIndex; i < lock.pointScales.length; i += 1) {
    const depth = transform.state.recursiveHierarchyTransforms ? i - pointIndex + 1 : 1;
    setPointScale(lock, i, edit.pointScales[i].x * Math.pow(ratioX, depth), edit.pointScales[i].z * Math.pow(ratioZ, depth));
  }
}

function applySingleScale(lock, pointIndex, handle) {
  setPointScale(lock, pointIndex, handle.scale.x, handle.scale.z);
}

function applyProportionalScale(lock, pointIndex, handle) {
  const edit = sculptState.state.activeHandleEdit;
  const ratioX = Math.max(0.18, handle.scale.x) / Math.max(0.18, edit.handleScale.x);
  const ratioZ = Math.max(0.18, handle.scale.z) / Math.max(0.18, edit.handleScale.z);
  for (let i = 0; i < lock.pointScales.length; i += 1) {
    const weight = proportionalWeight(i, pointIndex);
    if (weight <= 0) continue;
    setPointScale(
      lock,
      i,
      edit.pointScales[i].x * (1 + (ratioX - 1) * weight),
      edit.pointScales[i].z * (1 + (ratioZ - 1) * weight)
    );
  }
}

function setPointScale(lock, pointIndex, x, z) {
  const nextScale = {
    x: Math.max(0.18, x),
    z: Math.max(0.18, z)
  };
  lock.pointScales[pointIndex] = nextScale;
  lock.pointWidths[pointIndex] = (nextScale.x + nextScale.z) / 2;
}

function proportionalWeight(index, originIndex) {
  if (sculptState.state.proportionalRootLocked && Math.abs(index) < 0.0001) return 0;
  const radius = Number(proportionalRadiusInput?.value || 2.5);
  const falloff = Number(proportionalFalloffInput?.value || 0.65);
  const distance = Math.abs(index - originIndex);
  if (distance > radius) return 0;
  if (distance === 0) return 1;
  const linear = THREE.MathUtils.clamp(1 - distance / Math.max(0.001, radius), 0, 1);
  const smooth = linear * linear * (3 - 2 * linear);
  return THREE.MathUtils.lerp(1, smooth, falloff);
}

function proportionalStrandVisualsActive(lock) {
  return sculptState.state.proportionalEditing
    && ["move", "rotate", "scale", "relax"].includes(sel.state.activeTool)
    && sel.state.selectedPoint?.lockId === lock.id;
}

function strandInfluenceColor(lock, t) {
  if (!proportionalStrandVisualsActive(lock)) {
    return new THREE.Color(1, 1, 1);
  }
  const scaledIndex = t * (lock.points.length - 1);
  const weight = proportionalWeight(scaledIndex, sel.state.selectedPoint.pointIndex);
  const stops = [
    { weight: 0, color: new THREE.Color(0x77777d) },
    { weight: 0.16, color: new THREE.Color(0x4d84ff) },
    { weight: 0.38, color: new THREE.Color(0x36d87c) },
    { weight: 0.6, color: new THREE.Color(0xffe35a) },
    { weight: 0.8, color: new THREE.Color(0xff8b2f) },
    { weight: 1, color: new THREE.Color(0xff3030) }
  ];
  for (let i = 0; i < stops.length - 1; i += 1) {
    const start = stops[i];
    const end = stops[i + 1];
    if (weight <= end.weight) {
      const blend = THREE.MathUtils.clamp((weight - start.weight) / (end.weight - start.weight), 0, 1);
      return start.color.clone().lerp(end.color, blend);
    }
  }
  return stops.at(-1).color.clone();
}

function beginRelaxEdit(lock, pointIndex, event) {
  if (lock?.locked) return false;
  if (event.button !== 0 || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return false;
  if (pointIndex <= 0 || pointIndex >= lock.points.length - 1) return false;
  const relaxPosition = relaxPositionInput.checked;
  const relaxRotation = relaxRotationInput.checked;
  if (!relaxPosition && !relaxRotation) return false;
  pushUndoState();
  const hadMirrorPartner = Boolean(mirrorPartnerFor(lock));
  syncActiveMirror(lock, { refreshUi: !hadMirrorPartner });
  const originalPoints = lock.points.map((point) => point.clone());
  const originalScales = lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
  const originalTwists = [...lock.pointTwists];
  sculptState.state.relaxEdit = {
    lockId: lock.id,
    pointIndex,
    startX: event.clientX,
    startY: event.clientY,
    originalPoints,
    originalGroupLatticeBasePoints: lock.groupLatticeBasePoints?.map((point) => point.clone()) || null,
    originalScales,
    originalTwists,
    relaxPosition,
    relaxRotation
  };
  updateInteractionLocks();
  return true;
}

function updateRelaxEdit(event) {
  if (!sculptState.state.relaxEdit || sculptState.state.proportionalSizeEdit) return;
  const lock = locks.find((item) => item.id === sculptState.state.relaxEdit.lockId);
  if (!lock) return;
  const drag = (event.clientX - sculptState.state.relaxEdit.startX) - (event.clientY - sculptState.state.relaxEdit.startY);
  const amount = THREE.MathUtils.clamp(drag / 180, 0, 1);
  let relaxedPoints = sculptState.state.relaxEdit.originalPoints.map((point) => point.clone());
  let relaxedScales = sculptState.state.relaxEdit.originalScales.map((scale) => ({ ...scale }));
  let relaxedTwists = [...sculptState.state.relaxEdit.originalTwists];
  const passStrength = amount * 0.35;
  for (let pass = 0; pass < 6; pass += 1) {
    const sourcePoints = relaxedPoints.map((point) => point.clone());
    const sourceScales = relaxedScales.map((scale) => ({ ...scale }));
    const sourceTwists = [...relaxedTwists];
    for (let index = 1; index < relaxedPoints.length - 1; index += 1) {
      const weight = sculptState.state.proportionalEditing ? proportionalWeight(index, sculptState.state.relaxEdit.pointIndex) : index === sculptState.state.relaxEdit.pointIndex ? 1 : 0;
      const strength = passStrength * weight;
      if (strength <= 0) continue;
      if (sculptState.state.relaxEdit.relaxPosition) {
        const target = curvedRelaxPositionTarget(sourcePoints, index);
        relaxedPoints[index].lerp(
          new THREE.Vector3(target.x, target.y, target.z),
          strength
        );
        relaxedScales[index] = {
          x: THREE.MathUtils.lerp(sourceScales[index].x, (sourceScales[index - 1].x + sourceScales[index + 1].x) * 0.5, strength),
          z: THREE.MathUtils.lerp(sourceScales[index].z, (sourceScales[index - 1].z + sourceScales[index + 1].z) * 0.5, strength)
        };
      }
      if (sculptState.state.relaxEdit.relaxRotation) {
        relaxedTwists[index] = relaxAngleValue(
          sourceTwists[index],
          sourceTwists[index - 1],
          sourceTwists[index + 1],
          strength
        );
      }
    }
  }
  for (let index = 0; index < lock.points.length; index += 1) {
    if (sculptState.state.relaxEdit.relaxPosition) {
      lock.points[index].copy(relaxedPoints[index]);
      if (lock.groupLatticeBasePoints && sculptState.state.relaxEdit.originalGroupLatticeBasePoints) {
        lock.groupLatticeBasePoints[index]
          .copy(sculptState.state.relaxEdit.originalGroupLatticeBasePoints[index])
          .add(relaxedPoints[index].clone().sub(sculptState.state.relaxEdit.originalPoints[index]));
      }
      setPointScale(lock, index, relaxedScales[index].x, relaxedScales[index].z);
    }
    if (sculptState.state.relaxEdit.relaxRotation) lock.pointTwists[index] = relaxedTwists[index];
  }
  if (sculptState.state.relaxEdit.relaxPosition) {
    lock.width = Math.max(0.04, lock.baseWidth * average(lock.pointWidths));
  }
  syncLockFromCurve(lock);
  updateLockGeometry(lock);
  syncActiveMirror(lock);
  syncInputs(lock);
}

function endRelaxEdit() {
  if (!sculptState.state.relaxEdit) return;
  const editedLock = locks.find((item) => item.id === sculptState.state.relaxEdit.lockId);
  clumpProceduralApi.commitClumpMemberRestState(editedLock);
  clumpProceduralApi.commitClumpMemberRestState(mirrorPartnerFor(editedLock));
  sculptState.state.relaxEdit = null;
  flushPendingLockGeometryUpdates();
  updateInteractionLocks();
}

function disposeGuide(guide) {
  guide.controlGeometry?.dispose();
  guide.controlWire?.geometry.dispose();
  guide.controlWire?.material.dispose();
  guide.mesh.geometry.dispose();
  guide.mesh.material.dispose();
  guide.wire.geometry.dispose();
  guide.wire.material.dispose();
  guide.rootMesh?.geometry.dispose();
  guide.rootMesh?.material.dispose();
  guide.rootWire?.geometry.dispose();
  guide.rootWire?.material.dispose();
  guide.groupCurveLine?.geometry.dispose();
  guide.groupCurveLine?.material.dispose();
  guide.handlesGroup?.children.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  guide.loopLinesGroup?.children.forEach((line) => {
    line.geometry.dispose();
    line.material.dispose();
  });
  guide.loopPickersGroup?.children.forEach((line) => {
    line.geometry.dispose();
    line.material.dispose();
  });
}

function removeGuideObjects(guide) {
  guideSurfaceGroup.remove(
    guide.mesh,
    guide.wire,
    guide.controlWire,
    guide.rootMesh,
    guide.rootWire,
    guide.groupCurveLine
  );
  if (guide.handlesGroup) guideSurfaceGroup.remove(guide.handlesGroup);
  if (guide.loopLinesGroup) guideSurfaceGroup.remove(guide.loopLinesGroup);
  if (guide.loopPickersGroup) guideSurfaceGroup.remove(guide.loopPickersGroup);
}

// curveOverride（可选，默认 null ⇒ 行为逐字节不变）：把「曲线来源 + 采样用的带符号
// 横向坐标 + 混合带宽」整体替换掉，供分裂发丝的**每管发尖 WidthCurve** 使用。
// 形状：{ curve, secondary, asymmetric, signedCoordinate, blendZone }。
// 为什么连 signedCoordinate 一起换：管的 profile 被 clipStrandProfileBand 裁过，**每根管
// 的 raw x 只有一个符号**（边缘管全负 / 全正），拿 raw x 当左右判据会让边缘管整管只采到
// 一侧曲线、另一侧永不生效 —— 与 panel 在 0.2.80 修掉的「不跨 0 段曲线动了发丝不动」
// 是同一类死区。所以调用方必须传**管内相对坐标**（单一定义点见
// modules/geometry/strand-tip-width.js 的 strandTubeSignedCoordinate）。
// blendZone 同理随之而来：panel 的发尖采样用 0.25（tipWidthMultiplierAt 末参），发丝要
// 与之同构就必须能覆盖默认的 1。
function strandRadiusAt(lock, t, axis, radiusScale = 1, signedCoordinate = 1, curveOverride = null) {
  const shapeCurve = curveOverride?.curve ?? (axis === "z" ? lock.depthCurve : lock.taperCurve);
  const secondaryCurve = curveOverride?.secondary ?? (axis === "z" ? lock.depthCurveSecondary : lock.taperCurveSecondary);
  const asymmetric = curveOverride ? curveOverride.asymmetric : (axis === "z" ? lock.asymmetricDepthCurve : lock.asymmetricWidthCurve);
  const coordinate = curveOverride ? curveOverride.signedCoordinate : signedCoordinate;
  const blendZone = curveOverride?.blendZone ?? 1;
  const axisScale = axis === "z" ? Number(lock.depthScale ?? 1) : Number(lock.widthScale ?? 1);
  const baseDimension = axis === "z"
    ? Number(lock.depth ?? 0.16)
    : Number(lock.baseWidth ?? lock.width ?? 0.16);
  return Math.max(
    0,
    baseDimension
      * sampleAsymmetricTaperCurve(shapeCurve, secondaryCurve, asymmetric, coordinate, t, blendZone)
      * axisScale
      * radiusScale
  );
}

// widthOverride（可选，默认 null ⇒ 行为逐字节不变）：每个 profile 点的 x 半径改用该
// override 采样（见 strandRadiusAt 的 curveOverride）。签名为 (profile, index) => override
// | null，因为管内相对坐标逐点不同。z（depth）本轮刻意不接：发尖曲线只做宽度。
//
// **override 的缩放中心 = override.centerX（管中心），不是 profile 原点 x = 0**（0.2.128 修）：
// 默认路径 `x_out = x · R` 是绕**全局** x = 0 的缩放，位移 `x · (m − 1)` 正比于 |raw x|。
// 管的 band 一般不以 0 为中心，于是同一个**对称** multiplier 在一根管的两侧产生完全不同的
// 位移；N = 1（默认拉链，真实工程的形态）时缝侧恰在 x = 0 ⇒ 位移**恒为 0**，即用户报告的
// 「一侧位移很小」的极端形式（曲线面板两侧正常 ⇒ 写入没问题，错在消费）。
// 这与 panel 在 0.2.80 之后修掉的是**同一条**规则：段宽度必须以**段中心**为参考，而不是
// 主骨骼中心 u = 0（历史依据：panel 侧 0.2.59 修过同一 bug —— 旧实现按绝对 u 分界，宽度编辑时手柄沿错误方向偏转，实测最大 113°）。
// 公式（pivot = 管中心在**基础**曲线下的像，与 multiplier 无关 ⇒ 缩放不掺平移）：
//   x_out = (x · R_override(x) + pivotX · (R0(pivotX) − R_override(x))) · scaleX
//         ≡ (pivotX · R0(pivotX) + (x − pivotX) · R_override(x)) · scaleX   （代数等价）
// **刻意写成第一式**：R_override === R0 时 `R0 − R_override` 恰为 0、`pivotX · 0` 恰为 0，
// 于是逐位化简回老式 `x · R0`（第二式在浮点下只是近似相等，会让 m = 1 的 byte-identity
// 断言必须放宽到容差）。改写此式前先想清楚这条恒等式还成不成立。
// 两条性质（由此构造性成立）：
//   ① m = 1 恒等：R_override === R0 ⇒ **逐位**等于改动前的 x · R0 · scaleX。
//   ② 对称性：位移 = (x − pivotX) · (R_override − R0(pivotX))，(x − pivotX) 在管的两侧等值
//     反号 ⇒ 同一 multiplier 下两侧位移大小恒等、方向相反。
// centerX 缺省（非有限值，例如 strandTipWidthMultiplierAt 那条不带 band 的读值路径）时
// pivot 退化回 0 = 老公式，保持向后兼容。
function strandProfileTopologyAt(
  lock,
  t,
  profilePoints,
  scaleX = 1,
  scaleZ = 1,
  boundsProfilePoints = profilePoints,
  widthOverride = null
) {
  if (!profilePoints?.length) return [];
  const overrideAt = (profile, index) => (widthOverride ? widthOverride(profile, index) : null);
  // pivot 半径按 pivotX 记忆化：一次调用里同一根管的所有点共享同一个 centerX，逐点重采
  // 全局曲线只是白跑。单槽缓存足够（band 在一次调用内不变），且 null 初值 !== 0 所以
  // 「管中心恰在 0」也会被正确求值一次。
  let pivotCacheX = null;
  let pivotCacheRadius = 0;
  const pivotRadiusAt = (pivotX) => {
    if (pivotCacheX !== pivotX) {
      pivotCacheX = pivotX;
      pivotCacheRadius = strandRadiusAt(lock, t, "x", 1, pivotX);
    }
    return pivotCacheRadius;
  };
  const warpedX = (profile, index) => {
    const override = overrideAt(profile, index);
    const radius = strandRadiusAt(lock, t, "x", 1, profile.x, override);
    const pivotX = Number(override?.centerX);
    if (!override || !Number.isFinite(pivotX)) return profile.x * radius * scaleX;
    return (profile.x * radius + pivotX * (pivotRadiusAt(pivotX) - radius)) * scaleX;
  };
  const transformed = profilePoints.map((profile, index) => ({
    x: warpedX(profile, index),
    z: profile.z * strandRadiusAt(lock, t, "z", 1, profile.z) * scaleZ
  }));
  // 发尖宽度必须只做**缩放**、绝不平移（张开是 opening/direction 的职责）。
  // centerAsymmetricProfile 分支按变换后 x 极值把 profile 重新居中 = 整管平移，override
  // 生效时若让它参与，改宽度就会把管推开、缝跟着错位。故 override 路径直接返回缩放结果。
  if (!lock.centerAsymmetricProfile || widthOverride) return transformed;
  const boundsTransformed = boundsProfilePoints.map((profile) => ({
    x: profile.x * strandRadiusAt(lock, t, "x", 1, profile.x) * scaleX,
    z: profile.z * strandRadiusAt(lock, t, "z", 1, profile.z) * scaleZ
  }));
  const profileMinX = Math.min(...boundsProfilePoints.map((point) => point.x));
  const profileMaxX = Math.max(...boundsProfilePoints.map((point) => point.x));
  const profileMinZ = Math.min(...boundsProfilePoints.map((point) => point.z));
  const profileMaxZ = Math.max(...boundsProfilePoints.map((point) => point.z));
  const centerX = lock.asymmetricWidthCurve
    ? (Math.min(...boundsTransformed.map((point) => point.x)) + Math.max(...boundsTransformed.map((point) => point.x))) * 0.5
    : 0;
  const centerZ = lock.asymmetricDepthCurve
    ? (Math.min(...boundsTransformed.map((point) => point.z)) + Math.max(...boundsTransformed.map((point) => point.z))) * 0.5
    : 0;
  return transformed.map((point, index) => ({
    x: point.x + centerX * profileTopologyCenterWeight(
      profilePoints[index].x,
      profileMinX,
      profileMaxX
    ),
    z: point.z + centerZ * profileTopologyCenterWeight(
      profilePoints[index].z,
      profileMinZ,
      profileMaxZ
    )
  }));
}

function strandCurveParameters(lock, curve, segmentLimit, start = 0, end = 1, minimumSegments = 4) {
  const useSymmetricArcDistribution = !lock.strandSplitEnabled
    && typeof curve.getUtoTmapping === "function"
    && typeof curve.getTangentAt === "function";
  const curveParameterAt = useSymmetricArcDistribution
    ? (arcFraction) => curve.getUtoTmapping(arcFraction)
    : (parameter) => parameter;
  if (!lock.dynamicDensity) {
    return uniformCurveParameters(segmentLimit, start, end).map(curveParameterAt);
  }
  const widthProfileAt = (t) => {
    const primary = sampleAsymmetricTaperCurve(
      lock.taperCurve,
      lock.taperCurveSecondary,
      lock.asymmetricWidthCurve,
      1,
      t
    );
    const secondary = sampleAsymmetricTaperCurve(
      lock.taperCurve,
      lock.taperCurveSecondary,
      lock.asymmetricWidthCurve,
      -1,
      t
    );
    return Math.max(0, (primary + secondary) * 0.5);
  };
  const densityParameters = adaptiveCurveParameters(
    useSymmetricArcDistribution ? { getTangent: (u) => curve.getTangentAt(u) } : curve,
    segmentLimit,
    lock.densityAggression,
    start,
    end,
    minimumSegments,
    (parameter) => widthProfileAt(curveParameterAt(parameter)),
    useSymmetricArcDistribution,
    (before, middle, after) => twistCurveDensityDetail(
      lock.twistCurve || DEFAULT_TWIST_CURVE,
      curveParameterAt(before),
      curveParameterAt(middle),
      curveParameterAt(after),
      lock.twistDensity,
      segmentLimit
    )
  );
  return densityParameters.map(curveParameterAt);
}

function braidFrameAt(lock, curve, t) {
  const point = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t).normalize();
  const normal = outwardNormalAtPoint(point, tangent);
  const twist = strandTwistAt(lock, t) + THREE.MathUtils.degToRad(Number(lock.braidRotation ?? 0));
  const z = normal.applyAxisAngle(tangent, twist).normalize();
  const x = new THREE.Vector3().crossVectors(tangent, z).normalize();
  return { point, x, y: tangent, z };
}

function braidFrameAtExtended(lock, curve, t, curveLength = curve.getLength()) {
  const clampedT = THREE.MathUtils.clamp(t, 0, 1);
  const frame = braidFrameAt(lock, curve, clampedT);
  if (t !== clampedT) {
    frame.point.addScaledVector(frame.y, curveLength * (t - clampedT));
  }
  return frame;
}

function createBraidProfileProjector(lock) {
  const profile = lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE;
  const offset = Number(lock.profileOffset || 0);
  const bounds = profile.reduce((result, point) => ({
    minX: Math.min(result.minX, point.x),
    maxX: Math.max(result.maxX, point.x),
    minZ: Math.min(result.minZ, point.z + offset),
    maxZ: Math.max(result.maxZ, point.z + offset)
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  const halfWidth = Math.max(0.0001, (bounds.maxX - bounds.minX) * 0.5);
  const halfDepth = Math.max(0.0001, (bounds.maxZ - bounds.minZ) * 0.5);
  const centerX = (bounds.minX + bounds.maxX) * 0.25;
  const centerZ = (bounds.minZ + bounds.maxZ) * 0.25;

  // Preserve the authored braid topology. Radially projecting it into a sharp
  // strand profile folds isolated seam vertices around profile corners.
  const project = (normalizedX, normalizedZ) => new THREE.Vector2(
    normalizedX * halfWidth + centerX,
    normalizedZ * halfDepth + centerZ
  );
  project.scaleX = halfWidth;
  project.scaleZ = halfDepth;
  const minimum = project(-0.5, -0.5);
  const maximum = project(0.5, 0.5);
  project.minX = Math.min(minimum.x, maximum.x);
  project.maxX = Math.max(minimum.x, maximum.x);
  project.minZ = Math.min(minimum.y, maximum.y);
  project.maxZ = Math.max(minimum.y, maximum.y);
  return project;
}

function createBraidGeometry(lock) {
  const presetId = lock.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET;
  const preset = braidMeshPresets.get(presetId) || braidMeshPresets.get(DEFAULT_BRAID_MESH_PRESET);
  if (!preset?.body?.geometry || lock.points.length < 2) return null;
  const {
    sourcePosition,
    sourceNormal,
    sourceUv,
    sourcePart,
    sourceSize,
    sourceCenter,
    sourceMinY,
    sourceLength,
    sourceFaceVertexCounts,
    sourceUvBounds,
    uvHeight,
    seamData
  } = preset.body.cache;
  const curve = new THREE.CatmullRomCurve3(lock.points);
  const curveLength = Math.max(0.01, curve.getLength());
  const requestedSegmentLength = THREE.MathUtils.clamp(Number(lock.braidSegmentLength || 0.28), 0.08, 1.2);
  const repeatCount = THREE.MathUtils.clamp(Math.round(curveLength / requestedSegmentLength), 1, 96);
  const projectThroughProfile = createBraidProfileProjector(lock);
  const vertices = [];
  const normals = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const authoredFaces = [];
  const triangleEdgeMasks = [];
  const vertexMap = new Map();
  const boundaryVertices = { start: new Map(), end: new Map() };
  const quantize = (value, precision = 10000) => Math.round(value * precision);
  const deformationRows = new Map();
  function deformationAt(t, extended = false, widthSide = 1, depthSide = 1) {
    const sampleT = THREE.MathUtils.clamp(t, 0, 1);
    const key = `${extended ? "e" : "b"}|${quantize(t, 1000000)}|${widthSide < 0 ? "n" : "p"}|${depthSide < 0 ? "n" : "p"}`;
    if (deformationRows.has(key)) return deformationRows.get(key);
    const frame = extended
      ? braidFrameAtExtended(lock, curve, t, curveLength)
      : braidFrameAt(lock, curve, t);
    const pointScaleX = sampleScale(lock.pointScales, sampleT, "x");
    const pointScaleZ = sampleScale(lock.pointScales, sampleT, "z");
    const widthFor = (side, asymmetric = lock.asymmetricWidthCurve) => Number(lock.braidWidth || 0.34)
      * sampleAsymmetricTaperCurve(lock.taperCurve, lock.taperCurveSecondary, asymmetric, side, sampleT)
      * Number(lock.widthScale ?? 1)
      * pointScaleX;
    const depthFor = (side, asymmetric = lock.asymmetricDepthCurve) => Number(lock.braidDepth || 0.44)
      * sampleAsymmetricTaperCurve(lock.depthCurve, lock.depthCurveSecondary, asymmetric, side, sampleT)
      * Number(lock.depthScale ?? 1)
      * pointScaleZ;
    const width = widthFor(widthSide);
    const depth = depthFor(depthSide);
    let centerX = 0;
    let centerZ = 0;
    if (lock.centerAsymmetricProfile && lock.asymmetricWidthCurve) {
      centerX = (
        projectThroughProfile.minX * widthFor(-1)
        + projectThroughProfile.maxX * widthFor(1)
      ) * 0.5;
    }
    if (lock.centerAsymmetricProfile && lock.asymmetricDepthCurve) {
      centerZ = (
        projectThroughProfile.minZ * depthFor(-1)
        + projectThroughProfile.maxZ * depthFor(1)
      ) * 0.5;
    }
    const deformation = {
      frame,
      sampleT,
      width,
      depth,
      centerX,
      centerZ
    };
    deformationRows.set(key, deformation);
    return deformation;
  }

  function outputVertex(segmentIndex, sourceIndex) {
    const boundaryData = seamData.get(sourceIndex);
    const sourceX = boundaryData?.x ?? sourcePosition.getX(sourceIndex);
    const sourceY = sourcePosition.getY(sourceIndex);
    const sourceZ = boundaryData?.z ?? sourcePosition.getZ(sourceIndex);
    const partIndex = sourcePart ? Math.round(sourcePart.getX(sourceIndex)) : 0;
    const localT = THREE.MathUtils.clamp((sourceY - sourceMinY) / sourceLength, 0, 1);
    const t = (segmentIndex + localT) / repeatCount;
    const normalizedX = (sourceX - sourceCenter.x) / Math.max(0.0001, sourceSize.x);
    const normalizedZ = (sourceZ - sourceCenter.z) / Math.max(0.0001, sourceSize.z);
    const profilePosition = projectThroughProfile(normalizedX, normalizedZ);
    const { frame, width, depth, centerX, centerZ } = deformationAt(t, false, profilePosition.x, profilePosition.y);
    const position = frame.point.clone()
      .addScaledVector(
        frame.x,
        profilePosition.x * width + centerX * profileTopologyCenterWeight(
          profilePosition.x,
          projectThroughProfile.minX,
          projectThroughProfile.maxX
        )
      )
      .addScaledVector(
        frame.z,
        profilePosition.y * depth + centerZ * profileTopologyCenterWeight(
          profilePosition.y,
          projectThroughProfile.minZ,
          projectThroughProfile.maxZ
        )
      );
    const authoredNormal = boundaryData?.normal;
    const sourceNormalX = authoredNormal?.x ?? (sourceNormal ? sourceNormal.getX(sourceIndex) : normalizedX);
    const sourceNormalY = authoredNormal?.y ?? (sourceNormal ? sourceNormal.getY(sourceIndex) : 0);
    const sourceNormalZ = authoredNormal?.z ?? (sourceNormal ? sourceNormal.getZ(sourceIndex) : normalizedZ);
    const longitudinalScale = curveLength / repeatCount / sourceLength;
    const profileWidthScale = Math.max(0.0001, projectThroughProfile.scaleX || 1);
    const profileDepthScale = Math.max(0.0001, projectThroughProfile.scaleZ || 1);
    const worldNormal = new THREE.Vector3()
      .addScaledVector(frame.x, sourceNormalX / Math.max(0.0001, width * profileWidthScale / sourceSize.x))
      .addScaledVector(frame.y, sourceNormalY / Math.max(0.0001, longitudinalScale))
      .addScaledVector(frame.z, sourceNormalZ / Math.max(0.0001, depth * profileDepthScale / sourceSize.z))
      .normalize();
    const uvX = sourceUv ? sourceUv.getX(sourceIndex) : normalizedX + 0.5;
    const sourceV = sourceUv ? (sourceUv.getY(sourceIndex) - sourceUvBounds.min.y) / uvHeight : localT;
    const uvY = segmentIndex + sourceV;
    const seamCoordinate = segmentIndex + localT;
    const key = [
      quantize(seamCoordinate, 100000),
      partIndex,
      quantize(normalizedX),
      quantize(normalizedZ),
      quantize(sourceNormalX),
      quantize(sourceNormalY),
      quantize(sourceNormalZ),
      quantize(uvX, 100000),
      quantize(uvY, 100000)
    ].join("|");
    let outputIndex = vertexMap.get(key);
    if (outputIndex === undefined) {
      outputIndex = vertices.length / 3;
      vertexMap.set(key, outputIndex);
      vertices.push(position.x, position.y, position.z);
      normals.push(worldNormal.x, worldNormal.y, worldNormal.z);
      tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
      uvs.push(uvX, uvY);
      const color = strandInfluenceColor(lock, t);
      colors.push(color.r, color.g, color.b);
      if (seamCoordinate < 0.0001 || Math.abs(seamCoordinate - repeatCount) < 0.0001) {
        const boundary = seamCoordinate < 0.0001 ? boundaryVertices.start : boundaryVertices.end;
        if (!boundary.has(partIndex)) boundary.set(partIndex, new Map());
        boundary.get(partIndex).set(`${quantize(normalizedX)}|${quantize(normalizedZ)}`, outputIndex);
      }
    }
    return outputIndex;
  }

  for (let segmentIndex = 0; segmentIndex < repeatCount; segmentIndex += 1) {
    let sourceCursor = 0;
    sourceFaceVertexCounts.forEach((faceVertexCount) => {
      const face = [];
      const masks = fanTriangleEdgeMasks(faceVertexCount);
      masks.forEach((mask) => {
        const triangle = [
          outputVertex(segmentIndex, sourceCursor),
          outputVertex(segmentIndex, sourceCursor + 1),
          outputVertex(segmentIndex, sourceCursor + 2)
        ];
        indices.push(...triangle);
        triangleEdgeMasks.push(mask);
        triangle.forEach((vertexIndex) => {
          if (!face.includes(vertexIndex)) face.push(vertexIndex);
        });
        sourceCursor += 3;
      });
      if (face.length >= 3) authoredFaces.push(face);
    });
    while (sourceCursor + 2 < sourcePosition.count) {
      const triangle = [
        outputVertex(segmentIndex, sourceCursor),
        outputVertex(segmentIndex, sourceCursor + 1),
        outputVertex(segmentIndex, sourceCursor + 2)
      ];
      indices.push(...triangle);
      triangleEdgeMasks.push([1, 1, 1]);
      authoredFaces.push(triangle);
      sourceCursor += 3;
    }
  }

  function appendAuthoredCap(template, atStart) {
    if (!template?.geometry) return;
    const capPosition = template.geometry.getAttribute("position");
    const capNormal = template.geometry.getAttribute("normal");
    const capUv = template.geometry.getAttribute("uv");
    const seamY = atStart ? template.bounds.max.y : template.bounds.min.y;
    const capVertexMap = new Map();
    const outputCapVertex = (sourceIndex) => {
      const sourceX = capPosition.getX(sourceIndex);
      const sourceY = capPosition.getY(sourceIndex);
      const sourceZ = capPosition.getZ(sourceIndex);
      const normalX = capNormal ? capNormal.getX(sourceIndex) : 0;
      const normalY = capNormal ? capNormal.getY(sourceIndex) : 0;
      const normalZ = capNormal ? capNormal.getZ(sourceIndex) : 1;
      const uvX = capUv ? capUv.getX(sourceIndex) : 0.5;
      const uvY = capUv ? capUv.getY(sourceIndex) : 0.5;
      const key = [
        quantize(sourceX), quantize(sourceY), quantize(sourceZ),
        quantize(normalX), quantize(normalY), quantize(normalZ),
        quantize(uvX, 100000), quantize(uvY, 100000)
      ].join("|");
      const existing = capVertexMap.get(key);
      if (existing !== undefined) return existing;
      const moduleOffset = (sourceY - seamY) / sourceLength;
      const t = atStart ? moduleOffset / repeatCount : 1 + moduleOffset / repeatCount;
      const normalizedX = (sourceX - sourceCenter.x) / Math.max(0.0001, sourceSize.x);
      const normalizedZ = (sourceZ - sourceCenter.z) / Math.max(0.0001, sourceSize.z);
      const profilePosition = projectThroughProfile(normalizedX, normalizedZ);
      const { frame, width, depth, centerX, centerZ, sampleT } = deformationAt(t, true, profilePosition.x, profilePosition.y);
      const position = frame.point.clone()
        .addScaledVector(
          frame.x,
          profilePosition.x * width + centerX * profileTopologyCenterWeight(
            profilePosition.x,
            projectThroughProfile.minX,
            projectThroughProfile.maxX
          )
        )
        .addScaledVector(
          frame.z,
          profilePosition.y * depth + centerZ * profileTopologyCenterWeight(
            profilePosition.y,
            projectThroughProfile.minZ,
            projectThroughProfile.maxZ
          )
        );
      const longitudinalScale = curveLength / repeatCount / sourceLength;
      const worldNormal = new THREE.Vector3()
        .addScaledVector(frame.x, normalX / Math.max(0.0001, width * projectThroughProfile.scaleX / sourceSize.x))
        .addScaledVector(frame.y, normalY / Math.max(0.0001, longitudinalScale))
        .addScaledVector(frame.z, normalZ / Math.max(0.0001, depth * projectThroughProfile.scaleZ / sourceSize.z))
        .normalize();
      const outputIndex = vertices.length / 3;
      capVertexMap.set(key, outputIndex);
      vertices.push(position.x, position.y, position.z);
      normals.push(worldNormal.x, worldNormal.y, worldNormal.z);
      tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
      uvs.push(capUv ? uvX : normalizedX + 0.5, capUv ? uvY : sampleT);
      const color = strandInfluenceColor(lock, sampleT);
      colors.push(color.r, color.g, color.b);
      return outputIndex;
    };
    let sourceCursor = 0;
    (template.faceVertexCounts || []).forEach((faceVertexCount) => {
      const face = [];
      fanTriangleEdgeMasks(faceVertexCount).forEach((mask) => {
        const triangle = [
          outputCapVertex(sourceCursor),
          outputCapVertex(sourceCursor + 1),
          outputCapVertex(sourceCursor + 2)
        ];
        indices.push(...triangle);
        triangleEdgeMasks.push(mask);
        triangle.forEach((vertexIndex) => {
          if (!face.includes(vertexIndex)) face.push(vertexIndex);
        });
        sourceCursor += 3;
      });
      if (face.length >= 3) authoredFaces.push(face);
    });
    while (sourceCursor + 2 < capPosition.count) {
      const triangle = [
        outputCapVertex(sourceCursor),
        outputCapVertex(sourceCursor + 1),
        outputCapVertex(sourceCursor + 2)
      ];
      indices.push(...triangle);
      triangleEdgeMasks.push([1, 1, 1]);
      authoredFaces.push(triangle);
      sourceCursor += 3;
    }
  }

  if (preset.authoredCaps) {
    appendAuthoredCap(preset.start, true);
    appendAuthoredCap(preset.end, false);
  }

  function capBoundary(boundary, t, reverse) {
    const frame = braidFrameAt(lock, curve, t);
    boundary.forEach((partBoundary) => {
      const ring = [...partBoundary.values()];
      if (ring.length < 3) return;
      ring.sort((a, b) => {
        const aPosition = new THREE.Vector3(vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2]).sub(frame.point);
        const bPosition = new THREE.Vector3(vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]).sub(frame.point);
        return Math.atan2(aPosition.dot(frame.z), aPosition.dot(frame.x))
          - Math.atan2(bPosition.dot(frame.z), bPosition.dot(frame.x));
      });
      const center = ring.reduce((sum, vertexIndex) => sum.add(
        new THREE.Vector3(vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1], vertices[vertexIndex * 3 + 2])
      ), new THREE.Vector3()).multiplyScalar(1 / ring.length);
      const capNormal = frame.y.clone().multiplyScalar(reverse ? -1 : 1);
      const capRing = ring.map((vertexIndex) => {
        const capVertexIndex = vertices.length / 3;
        vertices.push(vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1], vertices[vertexIndex * 3 + 2]);
        normals.push(capNormal.x, capNormal.y, capNormal.z);
        tangents.push(frame.x.x, frame.x.y, frame.x.z, 1);
        uvs.push(uvs[vertexIndex * 2], uvs[vertexIndex * 2 + 1]);
        colors.push(colors[vertexIndex * 3], colors[vertexIndex * 3 + 1], colors[vertexIndex * 3 + 2]);
        return capVertexIndex;
      });
      const centerIndex = vertices.length / 3;
      vertices.push(center.x, center.y, center.z);
      normals.push(capNormal.x, capNormal.y, capNormal.z);
      tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
      uvs.push(0.5, t * repeatCount);
      const color = strandInfluenceColor(lock, t);
      colors.push(color.r, color.g, color.b);
      authoredFaces.push(reverse ? [...capRing].reverse() : [...capRing]);
      for (let index = 0; index < capRing.length; index += 1) {
        const current = capRing[index];
        const next = capRing[(index + 1) % capRing.length];
        if (reverse) indices.push(centerIndex, next, current);
        else indices.push(centerIndex, current, next);
        triangleEdgeMasks.push([1, 0, 0]);
      }
    });
  }

  if (!preset.authoredCaps) {
    capBoundary(boundaryVertices.start, 0, true);
    capBoundary(boundaryVertices.end, 1, false);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.braidRepeatCount = repeatCount;
  geometry.userData.braidMeshPreset = preset.id;
  geometry.userData.quadFaces = authoredFaces;
  geometry.userData.triangleEdgeMasks = triangleEdgeMasks;
  geometry.userData.sideTriangleCount = 0;
  geometry.userData.topology = "authored-polygons";
  return geometry;
}

function strandGeometryCurve(lock) {
  const baseCurve = new THREE.CatmullRomCurve3(lock.points);
  if (!lock.curlEnabled || lock.geometryType === "braid") return baseCurve;
  const curlCount = THREE.MathUtils.clamp(Number(lock.curlCount ?? 4), 0.25, 24);
  const displacement = THREE.MathUtils.clamp(Number(lock.curlDisplacement ?? 0.18), 0, 1.2);
  if (displacement <= 0.0001) return baseCurve;

  const sampleCount = THREE.MathUtils.clamp(Math.ceil(Math.max(48, curlCount * 18)), 48, 384);
  const points = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    const t = index / sampleCount;
    const point = baseCurve.getPoint(t);
    const tangent = baseCurve.getTangent(t).normalize();
    const normal = guidedNormalAt(lock, point, tangent, t)
      .applyAxisAngle(tangent, strandTwistAt(lock, t))
      .normalize();
    const side = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    const angle = Math.PI * 2 * curlCount * t;
    const rootBlend = THREE.MathUtils.smoothstep(t, 0, Math.min(0.12, 0.45 / curlCount));
    point.addScaledVector(side, Math.cos(angle) * displacement * rootBlend);
    point.addScaledVector(normal, Math.sin(angle) * displacement * rootBlend);
    points.push(point);
  }
  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
}

function strandGeometryFrameAt(
  lock,
  curve,
  t,
  previousFrame = null,
  twistOffset = 0,
  twistOverride = null
) {
  const point = curve.getPoint(t);
  const tangent = curve.getTangent(t).normalize();
  const twist = twistOverride ?? (strandTwistAt(lock, t) + twistOffset);
  const baseFrame = curveFrameAt(lock, t, twist);
  let desiredZ = baseFrame.z.clone().projectOnPlane(tangent);
  if (desiredZ.lengthSq() < 0.0001) desiredZ.copy(outwardNormalAtPoint(point, tangent));
  desiredZ.normalize();

  let z = desiredZ;
  let untwistedZ = null;
  if (previousFrame) {
    // Transport the complete frame around the bend. Projection alone can
    // suddenly roll the profile when a curve passes through an inflection.
    const transport = new THREE.Quaternion().setFromUnitVectors(previousFrame.y, tangent);
    const transportedZ = previousFrame.z.clone().applyQuaternion(transport).projectOnPlane(tangent);
    if (transportedZ.lengthSq() >= 0.0001) {
      transportedZ.normalize();
      if (lock.branchParentId) {
        // Branch child: chain the profile from the root gizmo frame. Transport
        // the UNTWISTED up (which carries the child's rotation), then apply the
        // child's authored twist fully around the tangent - the sweep follows the
        // child bone and preserves its twist completely. The child's own surface
        // normals are degenerate (near-parallel to its tangent), so they are never
        // used.
        const ref = (previousFrame.untwistedZ || previousFrame.z)
          .clone().applyQuaternion(transport).projectOnPlane(tangent);
        if (ref.lengthSq() >= 0.0001) {
          ref.normalize();
          untwistedZ = ref;
          z = ref.clone().applyAxisAngle(tangent, twist).normalize();
        }
      } else {
        if (desiredZ.dot(transportedZ) < 0) desiredZ.negate();
        const cross = new THREE.Vector3().crossVectors(transportedZ, desiredZ);
        const roll = Math.atan2(cross.dot(tangent), THREE.MathUtils.clamp(transportedZ.dot(desiredZ), -1, 1));
        const maxRollPerRing = THREE.MathUtils.degToRad(24);
        z = transportedZ.applyAxisAngle(tangent, THREE.MathUtils.clamp(roll, -maxRollPerRing, maxRollPerRing));
      }
    }
  }
  z.normalize();
  const x = new THREE.Vector3().crossVectors(tangent, z).normalize();
  z = new THREE.Vector3().crossVectors(x, tangent).normalize();
  const matrix = new THREE.Matrix4().makeBasis(x, tangent, z);
  return {
    point,
    x,
    y: tangent,
    z,
    untwistedZ: untwistedZ || z.clone(),
    quaternion: new THREE.Quaternion().setFromRotationMatrix(matrix),
    scale: { x: sampleScale(lock.pointScales, t, "x"), z: sampleScale(lock.pointScales, t, "z") }
  };
}

function transportedStrandFrameAt(lock, curve, t, options = {}) {
  const clampedT = THREE.MathUtils.clamp(t, 0, 1);
  const twistAt = typeof options.twistAt === "function" ? options.twistAt : null;
  const twistOverrideAt = (parameter) => (
    options.twistOverride ?? (twistAt ? twistAt(parameter) : null)
  );
  const stepCount = Math.max(
    1,
    Math.ceil(clampedT * Math.max(36, (lock.points.length - 1) * 10))
  );
  let frame = strandGeometryFrameAt(
    lock,
    curve,
    0,
    null,
    Number(options.twistOffset || 0),
    twistOverrideAt(0)
  );
  for (let step = 1; step <= stepCount; step += 1) {
    frame = strandGeometryFrameAt(
      lock,
      curve,
      clampedT * step / stepCount,
      frame,
      Number(options.twistOffset || 0),
      twistOverrideAt(clampedT * step / stepCount)
    );
  }
  return frame;
}

const branchSweep = createBranchSweepApi({
  activeCreationShapeDefaults, activeProfileOffset, applyGroupDefaultsToExistingStrands,
  closeTaperCurveEditor: taperEditor.closeTaperCurveEditor, compatibleSelectedLocks, creationToolActive, editSelectedLocks,
  getSelectedLock, profileToCanvas, renderHairCardCoveragePath, renderProfilePreview,
  strandRegionDisplayLabel, syncShapePresetSelects: presetLibraryApi.syncShapePresetSelects, taperMeshPointExtentPerValue: taperEditor.taperMeshPointExtentPerValue,
  taperMeshPointFrame: taperEditor.taperMeshPointFrame, taperSamples: taperEditor.taperSamples, updateDrawStrandPreview: drawFlowApi.updateDrawStrandPreview, updateViewportStatsVisibility, locks,
  strandGroupDefaults, taperMeshPointsGroup, twistMeshCurvePositiveFillMaterial, twistMeshCurveNegativeFillMaterial,
  twistMeshCurvePositiveMaterial, twistMeshCurveNegativeMaterial, profilePreviewPaths,
  sweepProfileTarget, sweepProfileCanvas, sweepProfileOriginalPath, sweepProfileTrimInputs, sweepProfileTrimValues,
  sweepProfileTrimRoundness, sweepProfileTrimRoundnessValue, sweepProfilePath, sweepProfileHairCardCoveragePath,
  sweepProfilePoints, sweepPointInterpolation, sweepProfileMirrorX, sweepProfileEditor, taperCurveEditor, groupDefaultsWarning,
  TWIST_CURVE_DISPLAY_RANGE_DEFAULT, TWIST_CURVE_VALUE_MAX, STRAND_GROUPS,
  sculptState: sculptState.state, projectState: projectState.state, selState: sel.state, miscState: miscState.state
});

// Branch-child geometry: bridge the parent hole boundary (10 segs) to the child
// square ring (8 pts) via the connection module, then sweep the square ring
// along the child curve. Framework version — topology focus, not final visuals.
// Branch-child geometry — mirrors the original strand sweep construction (radial
// normals + tangent + end caps) with the 8-point square ring instead of the profile,
// so the anime shader sees the same attribute layout as the original hair.
// Build the parent-hole -> child-ring bridge: bottom (2 quads, 1:1 real-edge mapping)
// + side direct bridges (left/right, one quad each). Parent-side vertices reuse the
// parent's authored normal/tangent by grid index; ring-side vertices reuse the sweep's
// row-0 ring by index (no copies), so the bridge is watertight with the sweep.
// Full bridge: bottom + top bands (banded, root-relative segments) + side direct
// bridges + quad side fill that closes the side gaps above/below the direct bridge.
const BRANCH_BRIDGE_DIAGNOSTIC = false;
const BRANCH_SIDE_FILL_ENABLED = true;

const BRANCH_CONNECTION_ENABLED = true;


const strandSweep = createStrandSweepApi({
  strandCurveParameters, strandGeometryFrameAt, strandProfileTopologyAt,
  strandInfluenceColor, sampleScale
});
const branchBridge = createBranchBridgeApi({
  strandCurveParameters, strandGeometryFrameAt, strandProfileTopologyAt,
  strandControlPointFrame, curveFrameAt, guidedNormalAt, controlPointRotationAt,
  strandGeometryCurve, strandInfluenceColor,
  strandSweep,
  branchChildrenFor: branchHierarchy.branchChildrenFor, updateBranchChildren: branchHierarchy.updateBranchChildren, locks,
  BRANCH_CONNECTION_ENABLED, BRANCH_SIDE_FILL_ENABLED,
  branchState: branch.state
});

const STRAND_SELECTION_OUTLINE_COLOR = 0xffd45e;
const STRAND_MIRROR_OUTLINE_COLOR = 0x5ef2ff;

function createHairTopologyGeometry(sourceGeometry) {
  const geometry = sourceGeometry.toNonIndexed();
  const vertexCount = geometry.getAttribute("position").count;
  const barycentric = new Float32Array(vertexCount * 3);
  const edgeMask = new Float32Array(vertexCount * 3);
  const sideTriangleCount = sourceGeometry.userData.sideTriangleCount || 0;
  const authoredEdgeMasks = sourceGeometry.userData.triangleEdgeMasks;
  for (let index = 0; index < vertexCount; index += 3) {
    barycentric.set([1, 0, 0, 0, 1, 0, 0, 0, 1], index * 3);
    const triangleIndex = index / 3;
    const mask = authoredEdgeMasks?.[triangleIndex]
      || (triangleIndex < sideTriangleCount
        ? triangleIndex % 2 === 0 ? [0, 1, 1] : [1, 1, 0]
        : [1, 1, 1]);
    edgeMask.set([...mask, ...mask, ...mask], index * 3);
  }
  geometry.setAttribute("barycentric", new THREE.BufferAttribute(barycentric, 3));
  geometry.setAttribute("edgeMask", new THREE.BufferAttribute(edgeMask, 3));
  return geometry;
}

function createHairTopologyOverlay(sourceGeometry) {
  const overlay = new THREE.Mesh(
    createHairTopologyGeometry(sourceGeometry),
    new THREE.ShaderMaterial({
      uniforms: {
        lineColor: { value: new THREE.Color(0x66f5ff) },
        opacity: { value: 0.72 }
      },
      vertexShader: `
        attribute vec3 barycentric;
        attribute vec3 edgeMask;
        varying vec3 vBarycentric;
        varying vec3 vEdgeMask;
        void main() {
          vBarycentric = barycentric;
          vEdgeMask = edgeMask;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 lineColor;
        uniform float opacity;
        varying vec3 vBarycentric;
        varying vec3 vEdgeMask;
        void main() {
          vec3 edgeWidth = max(fwidth(vBarycentric) * 1.25, vec3(0.0001));
          vec3 edge = (vec3(1.0) - smoothstep(vec3(0.0), edgeWidth, vBarycentric)) * vEdgeMask;
          float edgeAlpha = max(max(edge.x, edge.y), edge.z);
          if (edgeAlpha < 0.04) discard;
          gl_FragColor = vec4(lineColor, edgeAlpha * opacity);
        }
      `,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      extensions: { derivatives: true }
    })
  );
  overlay.visible = hairState.state.hairTopologyVisible;
  overlay.renderOrder = 3;
  return overlay;
}

function groupDefaultsFor(region) {
  const defaults = strandGroupDefaults[region] || strandGroupDefaults.unassigned;
  defaults.lengthScale = Number(defaults.lengthScale ?? 1);
  defaults.layerOffsets = { ...DEFAULT_LAYER_OFFSETS, ...defaults.layerOffsets };
  return defaults;
}

function creationToolActive() {
  return ["place", "draw", "braid", "panel"].includes(sel.state.activeTool);
}

function activeCreationShapeDefaults() {
  if (sel.state.activeTool === "braid") return braidCreationDefaults;
  if (sel.state.activeTool === "panel") return panelCreationDefaults;
  return strandCreationDefaults;
}


function curvePolylineLength(points) {
  let length = 0;
  for (let index = 1; index < (points?.length || 0); index += 1) {
    length += points[index - 1].distanceTo(points[index]);
  }
  return length;
}

function curvePolylineLengths(points) {
  const lengths = [0];
  for (let index = 1; index < points.length; index += 1) {
    lengths.push(lengths[index - 1] + points[index - 1].distanceTo(points[index]));
  }
  return lengths;
}

function samplePolylineDistance(points, lengths, distance) {
  const target = THREE.MathUtils.clamp(distance, 0, lengths.at(-1));
  let right = 1;
  while (right < lengths.length && lengths[right] < target) right += 1;
  if (right >= lengths.length) return points.at(-1).clone();
  const left = right - 1;
  const segmentLength = Math.max(0.000001, lengths[right] - lengths[left]);
  return points[left].clone().lerp(points[right], (target - lengths[left]) / segmentLength);
}

function applyProjectedCurveLength(points, source, scale) {
  if (points?.length < 2 || source?.length !== points.length) return;
  const sourceLengths = curvePolylineLengths(source);
  const sourceLength = sourceLengths.at(-1);
  if (sourceLength < 0.000001) return;

  const targetLength = Math.max(sourceLength * 0.05, sourceLength * Math.max(0.05, scale));
  const anchorDistance = Math.min(sourceLength * 0.32, targetLength * 0.8);
  const sourceTailLength = Math.max(0.000001, sourceLength - anchorDistance);
  const targetTailLength = Math.max(0.000001, targetLength - anchorDistance);
  const tailScale = targetTailLength / sourceTailLength;
  const path = source.map((point) => point.clone());
  if (targetLength > sourceLength) {
    const directionStart = Math.max(0, source.length - 4);
    const tipDirection = source.at(-1).clone().sub(source[directionStart]);
    if (tipDirection.lengthSq() < 0.000001) tipDirection.set(0, -1, 0);
    tipDirection.normalize();
    path.push(source.at(-1).clone().addScaledVector(tipDirection, targetLength - sourceLength));
  }
  const pathLengths = curvePolylineLengths(path);
  points.forEach((point, index) => {
    const sourceDistance = sourceLengths[index];
    if (sourceDistance <= anchorDistance) {
      point.copy(source[index]);
      return;
    }
    const targetDistance = anchorDistance + (sourceDistance - anchorDistance) * tailScale;
    point.copy(samplePolylineDistance(path, pathLengths, targetDistance));
  });
}

function clearRegionLengthBaseline(lock) {
  delete lock.regionLengthBasePoints;
  delete lock.regionLengthBaseGroupPoints;
  delete lock.regionLengthBaseClumpGuidePoints;
  delete lock.regionLengthBaselineScale;
}

function ensureRegionLengthBaseline(lock, currentScale) {
  if (lock.regionLengthBasePoints?.length === lock.points?.length) return;
  lock.regionLengthBasePoints = lock.points.map((point) => point.clone());
  lock.regionLengthBaseGroupPoints = lock.groupLatticeBasePoints?.map((point) => point.clone()) || null;
  lock.regionLengthBaseClumpGuidePoints = lock.clumpGuideRestPoints?.map((point) => point.clone()) || null;
  lock.regionLengthBaselineScale = Math.max(0.001, Number(lock.regionLengthApplied ?? currentScale ?? 1));
}

function setGroupLengthScale(region, value) {
  const defaults = groupDefaultsFor(region);
  const previousScale = Math.max(0.001, Number(defaults.lengthScale ?? 1));
  const nextScale = Math.max(0.001, Number(value));
  const scaleDelta = nextScale - previousScale;
  defaults.lengthScale = nextScale;
  if (Math.abs(scaleDelta) < 0.000001) return;

  const targets = locks.filter((lock) => (lock.scalpRegion || "unassigned") === region);
  branch.state.regionLengthUpdateInProgress = true;
  miscState.state.clumpUpdateInProgress = true;
  try {
    targets.forEach((lock) => {
      ensureRegionLengthBaseline(lock, previousScale);
      const baselineScale = Math.max(0.001, Number(lock.regionLengthBaselineScale || 1));
      const relativeScale = nextScale / baselineScale;
      applyProjectedCurveLength(lock.points, lock.regionLengthBasePoints, relativeScale);
      if (lock.groupLatticeBasePoints && lock.regionLengthBaseGroupPoints) {
        applyProjectedCurveLength(lock.groupLatticeBasePoints, lock.regionLengthBaseGroupPoints, relativeScale);
      }
      if (lock.clumpGuide && lock.clumpGuideRestPoints && lock.regionLengthBaseClumpGuidePoints) {
        applyProjectedCurveLength(lock.clumpGuideRestPoints, lock.regionLengthBaseClumpGuidePoints, relativeScale);
      }
      lock.regionLengthReference = curvePolylineLength(lock.regionLengthBasePoints);
      lock.regionLengthApplied = nextScale;
      if (lock.branchParentId || (lock.clumpId && !lock.clumpGuide)) clumpProceduralApi.commitClumpMemberRestState(lock);
      syncLockFromCurve(lock);
    });
    targets.forEach((lock) => updateLockGeometry(lock, { immediate: true }));
  } finally {
    miscState.state.clumpUpdateInProgress = false;
    branch.state.regionLengthUpdateInProgress = false;
  }
  const selectedLock = getSelectedLock();
  if (selectedLock) syncInputs(selectedLock);
  updateTopologyStats();
}

function applyGroupDefaultsToExistingStrands(region) {
  const defaults = groupDefaultsFor(region);
  locks.forEach((lock) => {
    if ((lock.scalpRegion || "unassigned") !== region) return;
    lock.taperCurve = defaults.taperCurve.map((point) => ({ ...point }));
    lock.depthCurve = defaults.depthCurve.map((point) => ({ ...point }));
    lock.taperCurveSecondary = (defaults.taperCurveSecondary || defaults.taperCurve).map((point) => ({ ...point }));
    lock.depthCurveSecondary = (defaults.depthCurveSecondary || defaults.depthCurve).map((point) => ({ ...point }));
    lock.asymmetricWidthCurve = Boolean(defaults.asymmetricWidthCurve);
    lock.asymmetricDepthCurve = Boolean(defaults.asymmetricDepthCurve);
    lock.centerAsymmetricProfile = Boolean(defaults.centerAsymmetricProfile);
    lock.widthScale = Number(defaults.widthScale ?? 1);
    lock.depthScale = Number(defaults.depthScale ?? 1);
    lock.profileTrimLeft = THREE.MathUtils.clamp(Number(defaults.profileTrimLeft ?? 0), 0, 1);
    lock.profileTrimRight = THREE.MathUtils.clamp(Number(defaults.profileTrimRight ?? 0), 0, 1);
    lock.profileTrimRoundness = THREE.MathUtils.clamp(Number(defaults.profileTrimRoundness ?? 1), 0, 1);
    lock.profileOffset = Number(defaults.profileOffset ?? 0);
    lock.rootScalpOffset = defaults.rootScalpOffset;
    lock.radialSegments = Math.round(defaults.radialSegments);
    lock.lengthSegments = Math.round(defaults.lengthSegments);
    lock.dynamicDensity = Boolean(defaults.dynamicDensity);
    lock.densityAggression = Number(defaults.densityAggression ?? 0.5);
    lock.twistDensity = Number(defaults.twistDensity ?? 0.5);
    lock.sweepProfile = defaults.sweepProfile.map((point) => ({ ...point }));
    scalpBuilder.applyLockRootScalpOffset(lock);
    updateLockGeometry(lock);
  });
  const selectedLock = getSelectedLock();
  if (selectedLock) syncInputs(selectedLock);
  updateTopologyStats();
}

function requestGroupDefaultsWarning(event) {
  if (miscState.state.groupDefaultsWarningAcknowledged || !sel.state.selectedStrandGroup) return;
  const hasExistingStrands = locks.some((lock) => (lock.scalpRegion || "unassigned") === sel.state.selectedStrandGroup);
  if (!hasExistingStrands) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!groupDefaultsWarning.open) groupDefaultsWarning.showModal();
}




function activeProfileOffset() {
  if (!sculptState.state.sweepProfileEdit) return 0;
  if (sculptState.state.sweepProfileEdit.type === "group") return Number(strandGroupDefaults[sculptState.state.sweepProfileEdit.id]?.profileOffset || 0);
  if (sculptState.state.sweepProfileEdit.type === "creation") return Number(activeCreationShapeDefaults().profileOffset || 0);
  return Number(locks.find((lock) => lock.id === sculptState.state.sweepProfileEdit.id)?.profileOffset || 0);
}


function profileToCanvas(point, offset = activeProfileOffset()) {
  return { x: 220 + point.x * 156, y: 220 - (point.z + offset) * 156 };
}




function renderProfilePreview(path, profile, offset = 0, target = null) {
  if (!path || !profile?.length) return;
  const visibleProfile = branchSweep.trimmedSweepProfile(profile, target);
  const smoothCurve = branchSweep.createSmoothSweepProfileCurve(visibleProfile);
  const sampled = Array.from({ length: 49 }, (_, index) => branchSweep.sampleSweepProfile(visibleProfile, index / 48, smoothCurve)).map((point) => ({
    x: 43 + point.x * 30,
    y: 43 - (point.z + offset) * 30
  }));
  path.setAttribute("d", `${sampled.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")} Z`);
  if (path === profilePreviewPaths.strand) {
    renderHairCardCoveragePath(
      strandHairCardCoveragePreview,
      visibleProfile,
      Boolean(target?.hairCard),
      (point) => ({ x: 43 + point.x * 30, y: 43 - (point.z + offset) * 30 })
    );
  }
}

function renderHairCardCoveragePath(path, profile, visible, mapPoint) {
  if (!path) return;
  if (!visible || !profile?.length) {
    path.setAttribute("d", "");
    return;
  }
  const topology = branchSweep.createSweepProfileTopology(profile, 96);
  const arc = upperProfileArcIndices(topology.samples.map((sample) => sample.point))
    .map((index) => mapPoint(topology.samples[index].point));
  path.setAttribute(
    "d",
    arc.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
  );
}








const shapePresets = createShapePresetsApi({
  sculptState: sculptState.state,
  projectState,
  selState: sel.state,
  normalizeShapePresetLibrary,
  emptyShapePresetLibrary,
  SHAPE_PRESET_STORAGE_KEY,
  pushUndoState,
  applyGroupDefaultsToExistingStrands,
  syncGroupInputs,
  syncCreationShapeInputs,
  editSelectedLocks,
  syncInputs,
  shapeTargetForSelect: taperEditor.shapeTargetForSelect,
  syncShapePresetSelects: presetLibraryApi.syncShapePresetSelects,
  getSelectedLock,
  segmentCurveTargetForWrite: taperEditor.segmentCurveTargetForWrite,
  selectedSegmentIndex: taperEditor.selectedSegmentIndex,
  updateLockGeometry,
  syncActiveMirror,
  syncSegmentControlsForLock: segmentApi.syncSegmentControlsForLock,
  renderTaperCurveEditor: taperEditor.renderTaperCurveEditor,
  SHAPE_PRESETS,
  strandCreationDefaults,
  braidCreationDefaults,
  panelCreationDefaults
});

// Taper curve editor api (refactor 3d batch G5): batch fill after createShapePresetsApi - the last
// cross-module api dep (shapePresets; branchSweep is earlier) is now defined; all other deps
// (stores/locks/DOM consts/helper functions) are defined earlier. First runtime call is the taper
// wiring block below; module-internal cross-calls only run on user interaction.
Object.assign(taperEditorDeps, {
  sculptState: sculptState.state,
  sel: sel.state,
  hairState: hairState.state,
  miscState: miscState.state,
  branchSweep,
  shapePresets,
  locks,
  strandGroupDefaults,
  camera,
  renderer,
  raycaster,
  taperMeshPointsGroup,
  taperMeshPointGeometry,
  taperMeshPointMaterial,
  taperMeshPointSelectedMaterial,
  taperMeshPointCenterMaterial,
  DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE,
  DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE,
  taperCurveEditor,
  taperCurveTarget,
  taperCurveCanvas,
  taperCurvePath,
  taperCurveSecondaryPath,
  taperCurveBaseAxis,
  taperCurveValueAxis,
  taperCurveCenterLine,
  taperCurvePoints,
  taperCurveOptions,
  taperAsymmetryToggleRow,
  taperAsymmetryToggle,
  centerAsymmetricProfileRow,
  centerAsymmetricProfileToggle,
  taperMeshPointsToggleRow,
  taperMeshPointsToggle,
  taperPointValue,
  taperPointPosition,
  taperPointInterpolation,
  taperPreviewPaths,
  segmentTaperPreview,
  segmentDepthPreview,
  strandSegmentTaperPreview,
  strandSegmentDepthPreview,
  strandTwistCurvePreview,
  proceduralBranchLengthCurvePreview,
  proceduralBranchShapeCurvePreview,
  sweepProfileEditor,
  sweepProfileTarget,
  groupDefaultsWarning,
  getSelectedLock,
  visibleTaperMeshCurveEdits,
  pushUndoState,
  editSelectedLocks,
  updateLockGeometry,
  rebuildLockGeometry,
  updateCurveObjects,
  updateDrawStrandPreview: drawFlowApi.updateDrawStrandPreview,
  syncActiveMirror,
  mirrorPartnerFor,
  updateInteractionLocks,
  setActiveTool,
  setHoveredStrandWidthEdge,
  rayFromViewportEvent,
  applyGroupDefaultsToExistingStrands,
  activeCreationShapeDefaults,
  creationToolActive,
  syncShapePresetSelects: presetLibraryApi.syncShapePresetSelects,
  updateViewportStatsVisibility,
  compatibleSelectedLocks,
  strandRegionDisplayLabel,
  clonePanelSplits,
  isPanelGeometry,
  tipWidthSideForkT: panelTipStrand.tipWidthSideForkT,
  tipWidthCommonForkT: panelTipStrand.tipWidthCommonForkT,
  tipWidthSideControlTs: panelTipStrand.tipWidthSideControlTs,
  proceduralGuideForLock: clumpProceduralApi.proceduralGuideForLock,
  strandGeometryFrameAt,
  strandGeometryCurve,
  transportedStrandFrameAt,
  braidFrameAt,
  controlPointRotationAt
});

// Segment control api deps batch (refactor bones B1): all deps are defined by this point (last
// dep: shapePresets / taperEditorDeps block); the batch takes effect here, before the first boot
// call (updateAttributeEditorMode -> segmentApi.syncPanelShapeInputs) and before the init-block
// listeners that reference segmentApi.
Object.assign(segmentControlDeps, {
  sculptState: sculptState.state,
  sel: sel.state,
  taperEditor,
  shapePresets,
  syncShapePresetSelects: presetLibraryApi.syncShapePresetSelects,
  branchSweep,
  panelCreationDefaults,
  panelSegmentLabel,
  previousPanelSegmentButton,
  nextPanelSegmentButton,
  panelSegmentSpread,
  panelSegmentSpreadValue,
  segmentTaperPreview,
  segmentDepthPreview,
  strandSegmentControls,
  strandSegmentLabel,
  previousStrandSegmentButton,
  nextStrandSegmentButton,
  strandSegmentSpread,
  strandSegmentSpreadValue,
  strandSegmentTaperPreview,
  strandSegmentDepthPreview,
  panelShapeInputs,
  panelShapeValues,
  panelSplitCountValue,
  addPanelSplitButton,
  removePanelSplitButton,
  sweepProfileEditor,
  taperMeshPointsToggleRow,
  taperCurveEditor,
  getSelectedLock,
  isPanelGeometry,
  pushUndoState,
  updateDrawStrandPreview: drawFlowApi.updateDrawStrandPreview,
  updateLockGeometry,
  rebuildCurveObjects,
  syncActiveMirror,
  updateTopologyStats,
  updateViewportStatsVisibility,
  clonePanelSplits,
  snapPanelSplitHeight,
  cloneStrandSplits,
  syncStrandSplitLegacyFields,
  syncStrandSplitInputs,
  strandCreationDefaults,
  STRAND_SPLIT_MAX
});
// Bone interaction api deps batch (refactor bones B2): all deps are defined by this point (last
// dep: shapePresets / taperEditorDeps block); the batch takes effect here, before the init-block
// pointer/gizmo listener registrations that reference bonesApi.
Object.assign(boneInteractionDeps, {
  sculptState: sculptState.state,
  sel: sel.state,
  guideState: guideState.state,
  scalpState: scalpState.state,
  taperEditor,
  panelTipStrand,
  sculptGeom,
  syncPanelSegmentControls: segmentApi.syncPanelSegmentControls,
  // 发丝管的发尖 WidthCurve 拖拽同步的是 Phase C 的 #strandSegmentControls（每管
  // spread + 曲线预览），不是 panel 那组。
  syncStrandSegmentControls: segmentApi.syncStrandSegmentControls,
  // 选中发尖子骨骼后刷新「当前段」控件：按 segmentBoneHost 自动分派到上面两组之一，
  // 所以发尖选择路径不需要自己 if(几何) 选 sync 函数（0.2.126）。
  syncSegmentControlsForLock: segmentApi.syncSegmentControlsForLock,
  locks,
  renderer,
  camera,
  raycaster,
  pointer,
  transformControls,
  taperCurveEditor,
  sculptBrushRadiusInput,
  sculptBrushFalloffInput,
  sculptBrushStrengthInput,
  sculptBrushStrengthByTool,
  getSelectedLock,
  isPanelGeometry,
  pushUndoState,
  updateLockGeometry,
  updateCurveObjects,
  updateInteractionLocks,
  updateTopologyStats,
  syncActiveMirror,
  configureTransformControls,
  effectiveSculptBrushTool,
  guidedNormalAt,
  strandFrameAt,
  signedAngleAroundAxis,
  pointerOverTaperEditor,
  componentEditModeActive,
  selectLock,
  strandControlPointHitFromEvent,
  pointerHitsTransformGizmo,
  addStrandControlPointSelection,
  activateStrandControlPoint,
  closestStrandCurveParameter,
  clonePanelSplits,
  cloneStrandSplits,
  syncStrandSplitLegacyFields,
  snapPanelSplitHeight,
  strandGeometryCurve,
  // 发丝发尖 WidthCurve 的拖拽基准（strandTipWidthEdgePosition）与 bone-view-handles 的
  // 把手放置共用同一条变换链，两处必须转发同样的五项：strandGeometryCurve /
  // strandGeometryFrameAt / strandProfileTopologyAt / strandSplitProfileData /
  // currentStrandSplitTipChains（把手跟随被拖动的发尖链，0.2.127）。
  strandGeometryFrameAt,
  strandProfileTopologyAt,
  strandSplitProfileData,
  strandSplitControlPoint,
  currentStrandSplitTipChains,
  panelSplitControlPoint
});
// Draw / creation flow api deps batch (refactor batch B2-1): all deps are defined by this point
// (last const/let deps: shapePresets / branchHierarchy / draw DOM inputs); the batch takes effect
// here, before the preset-library boot (loadBraidMeshPreset -> updatePlacementStatus ->
// drawFlowApi.selectedCurveLatticeGuide) and before all draw-flow pointer/UI listener registrations.
Object.assign(drawFlowDeps, {
  sel: sel.state,
  sculptState: sculptState.state,
  hairState: hairState.state,
  draw: draw.state,
  camera,
  renderer,
  raycaster,
  locks,
  guides,
  viewPlaneFill,
  viewPlaneGrid,
  DRAW_CLUMP_TEMPLATE,
  DRAW_CLUMP_TEMPLATES,
  PROCEDURAL_DRAW_DEFAULTS,
  DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE,
  DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE,
  braidMeshPresets,
  braidCreationDefaults,
  strandCreationDefaults,
  panelCreationDefaults,
  drawStrandSurfaceInput,
  drawSurfaceDynamicButton,
  drawStrandSmoothingInput,
  drawStrandCurveStepInput,
  braidSmoothingInput,
  braidCurveStepInput,
  panelSmoothingInput,
  panelCurveStepInput,
  drawToolSizeInput,
  braidToolSizeInput,
  panelToolSizeInput,
  drawContinueFromTipInput,
  braidContinueFromTipInput,
  drawSurfaceNormalInfluenceInput,
  panelSurfaceNormalInfluenceInput,
  drawStrandPreview,
  drawStrandMirrorPreview,
  drawStrandVolumePreview,
  drawStrandMirrorVolumePreview,
  drawStrandClumpVolumePreviews,
  drawStrandClumpMirrorPreviews,
  drawStrandBrushCursor,
  scalpBuilder,
  branchHierarchy,
  strandGeometryApi,
  shapePresets,
  addLock,
  updateLockGeometry,
  rebuildCurveObjects,
  updateCurveObjects,
  selectLock,
  getSelectedLock,
  renderLockList,
  updateCount,
  pushUndoState,
  updateInteractionLocks,
  updateAttributeEditorMode,
  createMirrorPartnerForNewLock,
  mirrorPartnerFor,
  syncMirrorPartnerFromLock,
  syncActiveMirror,
  syncLockFromCurve,
  setDrawStrandBrushCursorScale,
  ensureDrawClumpPreviewCount,
  groupDefaultsFor,
  pointsWithLayerOffset,
  normalizeHairLayer,
  strandDisplayColor: materialApi.strandDisplayColor,
  strandUsesDoubleSidedMaterial: materialApi.strandUsesDoubleSidedMaterial,
  createHairMaterial: materialApi.createHairMaterial,
  materialForLock: materialApi.materialForLock,
  setAnimeHairBaseColor: materialApi.setAnimeHairBaseColor,
  clonePanelSplits,
  mirroredVector,
  viewPlaneNormal,
  updateViewPlaneGrid,
  rayFromViewportEvent,
  headMeshes: referenceHeadApi.headMeshes,
  outwardNormalAtPoint,
  activeCreationShapeDefaults,
  updatePlacementStatus: placementApi.updatePlacementStatus,
  applyPlacedStrandScaleProfile: placementApi.applyPlacedStrandScaleProfile,
  nextClumpName: clumpProceduralApi.nextClumpName,
  createClumpFromLocks: clumpProceduralApi.createClumpFromLocks,
  updateClumpMembers: clumpProceduralApi.updateClumpMembers,
  applyProceduralBranchSettings: clumpProceduralApi.applyProceduralBranchSettings
});
// Placement flow api deps batch (refactor batch B2-2): all deps are defined by this point
// (last const/let deps: shapePresets / draw DOM inputs); the batch takes effect here, before
// the preset-library boot (loadBraidMeshPreset -> registerBraidMeshPreset -> updatePlacementStatus)
// and before all placement pointer/UI listener registrations.
Object.assign(placementDeps, {
  sel: sel.state,
  sculptState: sculptState.state,
  scalpState: scalpState.state,
  hairState: hairState.state,
  miscState: miscState.state,
  camera,
  renderer,
  locks,
  guides,
  scalpSurfaceGroup,
  scalpSurfaceMesh,
  scalpBuilder,
  shapePresets,
  strandCreationDefaults,
  braidMeshPresets,
  placementStatus,
  placeStrandScalpOffsetInput,
  proportionalRadiusInput,
  braidMeshPresetInput,
  drawFlow: drawFlowApi,
  addLock,
  updateLockGeometry,
  rebuildCurveObjects,
  updateCount,
  renderLockList,
  selectLock,
  getSelectedLock,
  selectCurvePoint,
  pushUndoState,
  updateInteractionLocks,
  createMirrorPartnerForNewLock,
  syncLockFromCurve,
  syncActiveMirror,
  syncInputs,
  fitPointAttributes,
  deselectStrands,
  pullMoveActive,
  componentEditModeActive,
  sculptBrushToolActive,
  effectiveSculptBrushTool,
  strandRegionDisplayLabel
});

// Procedural duplicate api deps batch (refactor batch B6b / plan A3): all deps are defined by
// this point (last const/let deps: placementStatus / proceduralDuplicate* DOM + THREE preview
// objects); the batch takes effect here, before the bootstrap init and before all procedural
// duplicate pointer/UI listener registrations.
Object.assign(proceduralDuplicateDeps, {
  sculptState: sculptState.state,
  undoHistory,
  redoHistory,
  locks,
  raycaster,
  placementStatus,
  proceduralDuplicateDialog,
  proceduralDuplicateCountInput,
  proceduralDuplicateRootSinkInput,
  proceduralDuplicateSecondPointOutwardInput,
  proceduralDuplicateSecondPointTowardRootInput,
  proceduralDuplicateSpacingNote,
  proceduralDuplicateStatus,
  proceduralDuplicateArcPreview,
  proceduralDuplicateCirclePreview,
  proceduralDuplicateArcMarker,
  drawFlowApi,
  placementApi,
  scalpBuilder,
  rayFromViewportEvent,
  viewPlaneNormal,
  layerOffsetForLock,
  layerRootOffsetFactor,
  selectedLocksInOrder,
  deleteLocks,
  restoreLock,
  snapshotState,
  createMirrorPartnerForNewLock,
  syncLockFromCurve,
  updateLockGeometry,
  flushPendingLockGeometryUpdates,
  createRootAttachment: ioApi.createRootAttachment,
  renderLockList,
  updateCount,
  selectLock,
  updateHistoryButtons,
  markProjectChangedForRecovery,
  updateInteractionLocks,
  syncActiveMirror
});

// Clump / procedural api deps batch (refactor batch B6a / plan B6): all deps are defined by
// this point (last const/let deps: clumpOpen / procedural* DOM + outliner helpers); the batch
// takes effect here, before the bootstrap init and before all clump UI listener registrations.
Object.assign(clumpProceduralDeps, {
  sel: sel.state,
  sculptState: sculptState.state,
  draw: draw.state,
  miscState: miscState.state,
  locks,
  renderer,
  clumpOpen,
  DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE,
  DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE,
  PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY,
  clumpGuidePanel,
  clumpGuideStatus,
  clumpInfluenceControl,
  clumpInfluenceInput,
  clumpInfluenceValue,
  clumpShapeControls,
  clumpShapeInputs,
  clumpShapeValues,
  proceduralAccessoryEditPanel,
  proceduralAccessoryEditCountInput,
  proceduralAccessoryEditCountValue,
  proceduralAccessoryEditRadiusInput,
  proceduralAccessoryEditRadiusValue,
  proceduralAccessoryEditParentVisibleInput,
  proceduralBranchEditCountInput,
  proceduralBranchEditCountValue,
  proceduralBranchEditLengthInput,
  proceduralBranchEditLengthValue,
  proceduralBranchEditTipOffsetInput,
  proceduralBranchEditTipOffsetValue,
  proceduralBranchLengthCurvePreview,
  proceduralBranchShapeCurvePreview,
  proceduralDrawExperimentalPreferenceInput,
  proceduralDrawToolButton,
  drawFlowApi,
  branchRootBone,
  taperEditor,
  pushUndoState,
  updateLockGeometry,
  rebuildCurveObjects,
  renderLockList,
  updateCount,
  selectLock,
  getSelectedLock,
  deleteLocks,
  syncActiveMirror,
  syncLockFromCurve,
  mirrorPartnerFor,
  createMirrorPartner,
  syncMirrorPartnerFromLock,
  decoupleMirrorPartner,
  fitPointAttributes,
  setPointScale,
  outwardNormalAtPoint,
  transportedStrandFrameAt,
  saveBooleanPreference,
  setActiveTool,
  strandVisibleForDisplay,
  syncLockedStrandWireVisual,
  selectedLocksInOrder,
  setLocksOutlinerVisibility,
  createOutlinerStrandButton,
  createOutlinerVisibilityToggle,
  handleOutlinerRenameClick,
  showOutlinerContextMenu
});










const shapePresetButtons = new Map();



























function updateViewportStatsVisibility() {
  const curveEditorOpen = taperCurveEditor.open;
  const hidden = !viewportState.state.viewportStatisticsEnabled
    || sweepProfileEditor.open
    || !presetLibrary.classList.contains("hidden");
  viewportStats.classList.toggle("hidden", hidden);
  viewportStats.classList.toggle("above-curve-editor", curveEditorOpen && !hidden);
  if (curveEditorOpen && !hidden) {
    const viewportRect = viewportStats.offsetParent?.getBoundingClientRect();
    const editorRect = taperCurveEditor.getBoundingClientRect();
    const bottom = viewportRect
      ? Math.max(18, viewportRect.bottom - editorRect.top + 10)
      : Math.max(18, window.innerHeight - editorRect.top + 10);
    viewportStats.style.bottom = `${Math.round(bottom)}px`;
  } else {
    viewportStats.style.removeProperty("bottom");
  }
}

function canvasToProfile(event) {
  const rect = sweepProfileCanvas.getBoundingClientRect();
  const canvasX = (event.clientX - rect.left) * (440 / rect.width);
  const canvasY = (event.clientY - rect.top) * (440 / rect.height);
  return {
    x: THREE.MathUtils.clamp((canvasX - 220) / 156, -1.25, 1.25),
    z: THREE.MathUtils.clamp((220 - canvasY) / 156 - activeProfileOffset(), -1.25, 1.25)
  };
}






function addLock(presetName, overrides = {}, options = {}) {
  const base = { ...presets[presetName], ...overrides };
  const scalpRegion = base.scalpRegion || "unassigned";
  const lock = {
    id: crypto.randomUUID(),
    ...base,
    scalpRegion,
    materialId: base.materialId || DEFAULT_HAIR_MATERIAL_ID,
    outlinerVisible: base.outlinerVisible !== false,
    locked: Boolean(base.locked),
    objectTransform: normalizeStrandObjectTransform(base.objectTransform),
    proceduralParentHidden: Boolean(base.proceduralParentHidden),
    proceduralDrawGuide: Boolean(base.proceduralDrawGuide),
    proceduralAccessory: Boolean(base.proceduralAccessory),
    proceduralAccessoryIndex: base.proceduralAccessoryIndex != null && Number.isFinite(Number(base.proceduralAccessoryIndex))
      ? Math.max(0, Math.round(Number(base.proceduralAccessoryIndex)))
      : null,
    proceduralAccessoryCount: base.proceduralAccessoryCount != null && Number.isFinite(Number(base.proceduralAccessoryCount))
      ? THREE.MathUtils.clamp(Math.round(Number(base.proceduralAccessoryCount)), 0, 16)
      : null,
    proceduralAccessoryRadius: base.proceduralAccessoryRadius != null && Number.isFinite(Number(base.proceduralAccessoryRadius))
      ? THREE.MathUtils.clamp(Number(base.proceduralAccessoryRadius), 0, 2)
      : null,
    proceduralBranch: Boolean(base.proceduralBranch),
    proceduralBranchIndex: base.proceduralBranchIndex != null && Number.isFinite(Number(base.proceduralBranchIndex))
      ? Math.max(0, Math.round(Number(base.proceduralBranchIndex)))
      : null,
    proceduralBranchCount: base.proceduralBranchCount != null && Number.isFinite(Number(base.proceduralBranchCount))
      ? THREE.MathUtils.clamp(Math.round(Number(base.proceduralBranchCount)), 0, 64)
      : null,
    proceduralBranchLength: base.proceduralBranchLength != null && Number.isFinite(Number(base.proceduralBranchLength))
      ? THREE.MathUtils.clamp(Number(base.proceduralBranchLength), 0.1, 3)
      : null,
    proceduralBranchLengthCurve: normalizeTaperCurve(
      base.proceduralBranchLengthCurve || DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
    ),
    proceduralBranchShapeCurve: normalizeTaperCurve(
      base.proceduralBranchShapeCurve || DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
    ),
    proceduralBranchTipOffset: base.proceduralBranchTipOffset != null && Number.isFinite(Number(base.proceduralBranchTipOffset))
      ? THREE.MathUtils.clamp(Number(base.proceduralBranchTipOffset), 0, 2)
      : null,
    liveSurfaceGuide: Boolean(base.liveSurfaceGuide),
    name: nextStrandName(scalpRegion)
  };
  sel.state.lockIndex += 1;
  const topologyDefaults = groupDefaultsFor(lock.scalpRegion);
  lock.radialSegments = Math.round(base.radialSegments ?? topologyDefaults.radialSegments);
  lock.lengthSegments = Math.round(base.lengthSegments ?? topologyDefaults.lengthSegments);
  lock.dynamicDensity = Boolean(base.dynamicDensity ?? topologyDefaults.dynamicDensity);
  lock.densityAggression = THREE.MathUtils.clamp(Number(base.densityAggression ?? topologyDefaults.densityAggression ?? 0.5), 0, 1);
  lock.twistDensity = THREE.MathUtils.clamp(Number(base.twistDensity ?? 0), 0, 1);
  lock.taperCurve = normalizeTaperCurve(base.taperCurve || topologyDefaults.taperCurve, base);
  lock.depthCurve = normalizeTaperCurve(base.depthCurve || topologyDefaults.depthCurve, base);
  lock.taperCurveSecondary = normalizeTaperCurve(
    base.taperCurveSecondary || topologyDefaults.taperCurveSecondary || lock.taperCurve,
    base
  );
  lock.depthCurveSecondary = normalizeTaperCurve(
    base.depthCurveSecondary || topologyDefaults.depthCurveSecondary || lock.depthCurve,
    base
  );
  lock.asymmetricWidthCurve = Boolean(base.asymmetricWidthCurve ?? topologyDefaults.asymmetricWidthCurve);
  lock.asymmetricDepthCurve = Boolean(base.asymmetricDepthCurve ?? topologyDefaults.asymmetricDepthCurve);
  lock.centerAsymmetricProfile = Boolean(base.centerAsymmetricProfile ?? topologyDefaults.centerAsymmetricProfile);
  lock.widthScale = Number(base.widthScale ?? topologyDefaults.widthScale ?? 1);
  lock.depthScale = Number(base.depthScale ?? topologyDefaults.depthScale ?? 1);
  lock.depth = Number(base.depth ?? 0.16);
  lock.profileTrimLeft = THREE.MathUtils.clamp(Number(base.profileTrimLeft ?? 0), 0, 1);
  lock.profileTrimRight = THREE.MathUtils.clamp(Number(base.profileTrimRight ?? 0), 0, 1);
  lock.profileTrimRoundness = THREE.MathUtils.clamp(Number(base.profileTrimRoundness ?? 1), 0, 1);
  lock.hairCard = Boolean(base.hairCard);
  lock.strandSplitEnabled = Boolean(base.strandSplitEnabled);
  lock.strandSplitPosition = THREE.MathUtils.clamp(Number(base.strandSplitPosition ?? 0), -0.8, 0.8);
  lock.strandSplitHeight = THREE.MathUtils.clamp(Number(base.strandSplitHeight ?? 0.3), 0.02, 0.8);
  // 0.2.132：strandSplitGap 已删除（全局 Split Spacing 滑杆 + segment separate 语义一并移除）。
  // 旧档里的该字段**刻意不迁移**到每管 Tip Clump：它记的是横向平移量，与收窄比例不同义，
  // 迁过去只会把旧数值当成新语义用。旧档加载后每管取 DEFAULT_STRAND_TIP_CLUMP。
  lock.strandTipStart = THREE.MathUtils.clamp(Number(base.strandTipStart ?? strandCreationDefaults.strandTipStart ?? 0.75), 0.2, 0.95);
  lock.strandTip = Array.isArray(base.strandTip?.points) ? strandTipFromData(base.strandTip, lock) : null;
  lock.strandSplitBones = Array.isArray(base.strandSplitBones) ? strandSplitBonesFromData(base.strandSplitBones, lock) : null;
  // 多拉链数组（Phase A：单条上限）——legacy 文件无 base.strandSplits 时由标量迁移
  lock.strandSplits = cloneStrandSplits(base.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight, STRAND_SPLIT_MAX);
  syncStrandSplitLegacyFields(lock);
  lock.profileOffset = Number(base.profileOffset ?? topologyDefaults.profileOffset ?? 0);
  const surfaceColumns = normalizeSurfaceLatticeCount(base.surfaceColumns, DEFAULT_SURFACE_LATTICE_COLUMNS);
  const surfaceRows = normalizeSurfaceLatticeCount(base.surfaceRows, DEFAULT_SURFACE_LATTICE_ROWS);
  const curveSurfaceColumns = Math.max(1, Math.round(Number(base.curveSurfaceColumns) || 1));
  const curveSurfaceRows = Math.max(2, Math.round(Number(base.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  lock.geometryType = base.geometryType === "surface" && base.points?.length !== surfaceColumns * surfaceRows
    ? "panel"
    : base.geometryType === "curve-surface" && base.points?.length !== curveSurfaceColumns * curveSurfaceRows
      ? "strand"
      : ["braid", "panel", "surface", "curve-surface", "poly"].includes(base.geometryType) ? base.geometryType : "strand";
  lock.surfaceColumns = lock.geometryType === "surface" ? surfaceColumns : null;
  lock.surfaceRows = lock.geometryType === "surface" ? surfaceRows : null;
  lock.curveSurfaceColumns = lock.geometryType === "curve-surface" ? curveSurfaceColumns : null;
  lock.curveSurfaceRows = lock.geometryType === "curve-surface" ? curveSurfaceRows : null;
  lock.curveSurfaceSymmetric = lock.geometryType === "curve-surface" && Boolean(base.curveSurfaceSymmetric);
  lock.curveSurfaceCompoundProfile = lock.geometryType === "curve-surface"
    && Boolean(base.curveSurfaceCompoundProfile);
  lock.compoundBridgeLoops = lock.curveSurfaceCompoundProfile
    ? THREE.MathUtils.clamp(Math.round(Number(base.compoundBridgeLoops) || 0), 0, 8)
    : null;
  lock.compoundBridgeSmoothing = lock.curveSurfaceCompoundProfile
    ? THREE.MathUtils.clamp(Number(base.compoundBridgeSmoothing) || 0, 0, 1)
    : null;
  lock.curveSurfaceCenterCurve = lock.geometryType === "curve-surface"
    ? THREE.MathUtils.clamp(Math.round(Number(base.curveSurfaceCenterCurve) || 0), 0, curveSurfaceColumns - 1)
    : null;
  lock.curveSurfaceStripWidth = lock.geometryType === "curve-surface"
    ? Math.max(0.001, Number(base.curveSurfaceStripWidth) || DEFAULT_CURVE_SURFACE_STRIP_WIDTH)
    : null;
  lock.curveSurfaceSide = lock.geometryType === "curve-surface"
    ? base.curveSurfaceSide?.clone?.() || new THREE.Vector3(
      Number(base.curveSurfaceSide?.x || 0),
      Number(base.curveSurfaceSide?.y || 0),
      Number(base.curveSurfaceSide?.z || 0)
    )
    : null;
  lock.curveSurfaceSource = curveSurfaceCreate.cloneCurveSurfaceSource(base.curveSurfaceSource);
  lock.braidMeshPreset = base.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET;
  lock.braidWidth = Number(base.braidWidth ?? base.width ?? 0.34);
  lock.braidDepth = Number(base.braidDepth ?? 0.44);
  lock.braidSegmentLength = Number(base.braidSegmentLength ?? 0.28);
  lock.braidRotation = Number(base.braidRotation ?? 0);
  lock.panelThickness = Number(base.panelThickness ?? panelCreationDefaults.panelThickness);
  lock.panelLengthLoops = Math.round(Number(base.panelLengthLoops ?? panelCreationDefaults.panelLengthLoops));
  lock.panelWidthLoops = Math.round(Number(base.panelWidthLoops ?? panelCreationDefaults.panelWidthLoops));
  lock.panelCurvature = lock.geometryType === "surface"
    ? 0
    : Number(base.panelCurvature ?? panelCreationDefaults.panelCurvature);
  lock.panelLeftEdgeTrim = Number(base.panelLeftEdgeTrim ?? panelCreationDefaults.panelLeftEdgeTrim);
  lock.panelRightEdgeTrim = Number(base.panelRightEdgeTrim ?? panelCreationDefaults.panelRightEdgeTrim);
  lock.panelTipCurve = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Number(base.panelTipCurve ?? panelCreationDefaults.panelTipCurve), -1, 1);
  lock.panelTipLoops = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Math.round(Number(base.panelTipLoops ?? panelCreationDefaults.panelTipLoops)), 0, 16);
  // Scalp Conform：amount 在 surface（lattice 控制）上恒 0，与上面 panelTipCurve /
  // panelTipLoops 同规则；gap 即使被忽略也无害，照常规范化以便 UI 显示稳定。
  lock.panelScalpConformAmount = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Number(base.panelScalpConformAmount ?? panelCreationDefaults.panelScalpConformAmount), -1, 1);
  // Gap 上限 0.5：世界单位的"弯曲半径相对头皮的外扩量"，头皮球半径为 1，半个半径已远超
  // 任何合理发厚。同步点：panel-tip-strand.js 的 panelScalpConformParams 同名钳位。
  lock.panelScalpConformGap = THREE.MathUtils.clamp(
    Number(base.panelScalpConformGap ?? panelCreationDefaults.panelScalpConformGap),
    0,
    0.5
  );
  lock.panelSplitEnabled = base.panelSplitEnabled !== false;
  lock.panelSplitSnapToLoops = base.panelSplitSnapToLoops !== false;
  lock.panelSplitHeight = Number(base.panelSplitHeight ?? panelCreationDefaults.panelSplitHeight);
  lock.panelSplits = clonePanelSplits(base.panelSplits, lock.panelSplitHeight);
  const minimumPanelWidthLoops = lock.geometryType === "surface" ? 2 : 3;
  lock.panelWidthLoops = THREE.MathUtils.clamp(
    Math.max(lock.panelWidthLoops, lock.panelSplits.length + 1),
    minimumPanelWidthLoops,
    24
  );
  lock.panelSplits = clonePanelSplits(lock.panelSplits, lock.panelSplitHeight, lock.panelWidthLoops - 1);
  if (lock.panelSplitSnapToLoops) {
    lock.panelSplits.forEach((split) => { split.height = snapPanelSplitHeight(split.height, lock.panelLengthLoops); });
  }
  lock.panelSplitGap = Number(base.panelSplitGap ?? panelCreationDefaults.panelSplitGap);
  lock.splitBones = Array.isArray(base.splitBones) ? splitBonesFromData(base.splitBones, lock.panelSplits, lock) : null;
  lock.bones = Array.isArray(base.bones) ? bonesFromData(base.bones, lock) : null;
  lock.curlEnabled = Boolean(base.curlEnabled);
  lock.curlCount = THREE.MathUtils.clamp(Number(base.curlCount ?? 4), 0.25, 24);
  lock.curlDisplacement = THREE.MathUtils.clamp(Number(base.curlDisplacement ?? 0.18), 0, 1.2);
  lock.surfaceNormalInfluence = THREE.MathUtils.clamp(Number(base.surfaceNormalInfluence ?? 0), 0, 1);
  lock.pointSurfaceNormals = base.pointSurfaceNormals?.map((normal) => normal?.clone()?.normalize() || null) || [];
  lock.rootScalpOffset = Number(base.rootScalpOffset ?? topologyDefaults.rootScalpOffset ?? 0);
  lock.strandRotation = THREE.MathUtils.clamp(Number(base.strandRotation ?? 0), -180, 180);
  lock.twistCurve = normalizeEnvelopeCurve(
    base.twistCurve,
    DEFAULT_TWIST_CURVE,
    -TWIST_CURVE_VALUE_MAX,
    TWIST_CURVE_VALUE_MAX
  );
  lock.hairLayer = normalizeHairLayer(base.hairLayer ?? strandCreationDefaults.hairLayer);
  lock.layerOffsetApplied = Number(base.layerOffsetApplied ?? 0);
  lock.layerOffsetRootFactorApplied = Number(base.layerOffsetRootFactorApplied ?? 1);
  lock.rootSurfacePoint = base.rootSurfacePoint?.clone() || null;
  lock.rootSurfaceNormal = base.rootSurfaceNormal?.clone()?.normalize() || null;
  lock.sweepProfile = (base.sweepProfile || topologyDefaults.sweepProfile).map((point) => ({ ...point }));
  lock.points = base.points ? base.points.map((point) => point.clone()) : createCurvePoints(lock);
  lock.polyFaces = lock.geometryType === "poly" ? normalizePolyFaces(lock.points, base.polyFaces) : [];
  lock.rootAttachmentEnabled = lock.geometryType !== "poly" && base.rootAttachmentEnabled !== false;
  lock.rootAttachment = lock.rootAttachmentEnabled
    ? ioApi.rootAttachmentFromData(base.rootAttachment || null, lock)
    : null;
  if (lock.rootAttachment) {
    lock.rootSurfacePoint = lock.rootAttachment.surfacePoint.clone();
    lock.rootSurfaceNormal = lock.rootAttachment.normal.clone();
  }
  lock.groupLatticeBasePoints = base.groupLatticeBasePoints?.map((point) => point.clone()) || null;
  lock.pointScales = lock.points.map(() => ({ x: 1, z: 1 }));
  lock.pointWidths = lock.points.map(() => 1);
  lock.baseWidth = lock.width;
  fitPointAttributes(lock, lock.points.length);
  if (base.layerOffsetApplied == null && lock.geometryType !== "poly") applyLayerOffset(lock);
  lock.mesh = new THREE.Mesh(
    strandGeometryApi.createHairGeometry(lock),
    materialApi.createHairMaterial(lock)
  );
  lock.mesh.material.side = lock.branchRootRegion || materialApi.strandUsesDoubleSidedMaterial(lock)
    ? THREE.DoubleSide
    : THREE.FrontSide;
  lock.selectionOutline = materialApi.createStrandSelectionOutline(lock.mesh.geometry);
  lock.mesh.add(lock.selectionOutline);
  lock.hoverOutline = materialApi.createStrandSelectionOutline(lock.mesh.geometry, {
    color: 0xffb45e,
    opacity: 0.72,
    renderOrder: 2
  });
  lock.mesh.add(lock.hoverOutline);
  lock.wireOverlay = createHairTopologyOverlay(lock.mesh.geometry);
  lock.mesh.add(lock.wireOverlay);
  lock.mesh.castShadow = true;
  lock.mesh.userData.lockId = lock.id;
  lock.curveObjects = createCurveObjects(lock);
  locks.push(lock);
  ensureUvCheckerForLock(lock);
  hairGroup.add(lock.mesh);
  lock.mesh.visible = strandVisibleForDisplay(lock);
  clumpProceduralApi.syncProceduralParentVisibility(lock);
  curveGroup.add(lock.curveObjects.group);
  if (!options.deferUi) {
    selectLock(lock.mesh.visible ? lock.id : undefined);
    renderLockList();
    updateCount();
  }
  return lock;
}


function mirroredVector(vector) {
  return vector ? new THREE.Vector3(-vector.x, vector.y, vector.z) : null;
}

function mirroredPlacementFrame(frame) {
  if (!frame) return null;
  return {
    root: mirroredVector(frame.root),
    normal: mirroredVector(frame.normal).normalize(),
    flow: mirroredVector(frame.flow).normalize(),
    side: mirroredVector(frame.side).normalize(),
    sideSign: -Number(frame.sideSign || 1),
    gravity: mirroredVector(frame.gravity || new THREE.Vector3(0, -1, 0)).normalize(),
    orientationStrength: Number(frame.orientationStrength || 0)
  };
}

function mirrorPartnerFor(lock) {
  return lock?.mirrorPartnerId ? locks.find((item) => item.id === lock.mirrorPartnerId) : null;
}

function decoupleMirrorPartner(lock) {
  if (!lock) return null;
  const partner = mirrorPartnerFor(lock);
  lock.mirrorPartnerId = null;
  if (partner?.mirrorPartnerId === lock.id) partner.mirrorPartnerId = null;
  return partner;
}

function createMirrorPartner(lock, options = {}) {
  if (!lock) return null;
  const existing = mirrorPartnerFor(lock);
  if (existing) return existing;
  const mirrored = addLock("front", {
    materialId: lock.materialId || DEFAULT_HAIR_MATERIAL_ID,
    scalpRegion: scalpBuilder.mirroredScalpRegion(lock.scalpRegion),
    hairLayer: normalizeHairLayer(lock.hairLayer),
    layerOffsetApplied: Number(lock.layerOffsetApplied ?? 0),
    layerOffsetRootFactorApplied: Number(lock.layerOffsetRootFactorApplied ?? layerRootOffsetFactor(lock.hairLayer)),
    x: -lock.x,
    y: lock.y,
    z: lock.z,
    length: lock.length,
    curve: -lock.curve,
    width: lock.width,
    geometryType: lock.geometryType,
    surfaceColumns: lock.surfaceColumns,
    surfaceRows: lock.surfaceRows,
    curveSurfaceColumns: lock.curveSurfaceColumns,
    curveSurfaceRows: lock.curveSurfaceRows,
    curveSurfaceSymmetric: Boolean(lock.curveSurfaceSymmetric),
    curveSurfaceCompoundProfile: Boolean(lock.curveSurfaceCompoundProfile),
    compoundBridgeLoops: Number(lock.compoundBridgeLoops || 0),
    compoundBridgeSmoothing: Number(lock.compoundBridgeSmoothing || 0),
    curveSurfaceCenterCurve: lock.curveSurfaceCenterCurve,
    curveSurfaceStripWidth: lock.curveSurfaceStripWidth,
    curveSurfaceSide: mirroredVector(lock.curveSurfaceSide),
    curveSurfaceSource: curveSurfaceCreate.mirroredCurveSurfaceSource(lock.curveSurfaceSource),
    braidMeshPreset: lock.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET,
    braidWidth: lock.braidWidth,
    braidDepth: lock.braidDepth,
    braidSegmentLength: lock.braidSegmentLength,
    braidRotation: -Number(lock.braidRotation ?? 0),
    panelThickness: lock.panelThickness,
    panelLengthLoops: lock.panelLengthLoops,
    panelWidthLoops: lock.panelWidthLoops,
    panelCurvature: lock.panelCurvature,
    // 注意：本对象字面量里的 panel 字段大多是**死值** —— 本函数在 return 前的
    // `syncMirrorPartnerFromLock(lock, mirrored)`（见下方，无条件调用）会把它们全部重写，
    // 那里才是镜像语义的真源。左右 EdgeTrim 在那里是**互换**的（本处看起来"没互换"因此
    // 不是 bug，已用真实浏览器实测确认：源 0.5/0 ⇒ partner 0/0.5）。
    // 勿据本处字面量判断镜像行为，也勿"顺手把这里改成互换"——那会变成互换两次。
    panelLeftEdgeTrim: lock.panelLeftEdgeTrim,
    panelRightEdgeTrim: lock.panelRightEdgeTrim,
    panelTipCurve: lock.panelTipCurve,
    panelTipLoops: lock.panelTipLoops,
    // Scalp Conform：两个值镜像时**原样拷贝，不取反、不交换**。0.2.138 Bend 模型下的理由
    // （与被替换的投影模型不同，但结论相同）：弯曲是 `along(s)·T − inward(s)·N`，其中
    // `along = sin(ks)/k` 在 s 上是**奇函数**、`inward = (1−cos ks)/k` 是**偶函数**。X 镜像
    // 同时翻转横向坐标 s 与基向量 T 的符号 ⇒ 奇×奇 = 不变、偶项本就不受影响 ⇒ 形状严格镜像。
    // gap 是标量半径外扩量，与左右无关。
    // 对比：panelTipCurve 要取负（它的 bowWeight 随 strength 符号在"边缘/中心"间切换），
    // panelLeftEdgeTrim/panelRightEdgeTrim 要左右互换（它们本身就是按侧定义的）。
    panelScalpConformAmount: lock.panelScalpConformAmount,
    panelScalpConformGap: lock.panelScalpConformGap,
    profileTrimLeft: lock.profileTrimRight,
    profileTrimRight: lock.profileTrimLeft,
    profileTrimRoundness: lock.profileTrimRoundness,
    hairCard: Boolean(lock.hairCard),
    strandSplitEnabled: Boolean(lock.strandSplitEnabled),
    strandSplitPosition: -Number(lock.strandSplitPosition ?? 0),
    strandSplitHeight: Number(lock.strandSplitHeight ?? 0.3),
    // 与 syncMirrorPartnerFromLock 的镜像写入同规则（clone → negate → sort）：取负翻转左右
    // 次序，不排序则 addLock 内的 syncStrandSplitLegacyFields 会把错误那条的 height 写进标量。
    strandSplits: cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight, STRAND_SPLIT_MAX)
      .map((split) => ({ ...split, position: -split.position }))
      .sort((a, b) => a.position - b.position),
    strandTipStart: Number(lock.strandTipStart ?? 0.75),
    strandTip: mirrorStrandTip(lock.strandTip),
    strandSplitBones: mirrorStrandSplitBones(lock.strandSplitBones),
    panelSplitEnabled: lock.panelSplitEnabled,
    panelSplitSnapToLoops: lock.panelSplitSnapToLoops !== false,
    panelSplitHeight: lock.panelSplitHeight,
    panelSplits: clonePanelSplits(lock.panelSplits, lock.panelSplitHeight)
      .map((split) => ({ ...split, position: -split.position })),
    panelSplitGap: lock.panelSplitGap,
    curlEnabled: Boolean(lock.curlEnabled),
    curlCount: Number(lock.curlCount ?? 4),
    curlDisplacement: Number(lock.curlDisplacement ?? 0.18),
    surfaceNormalInfluence: Number(lock.surfaceNormalInfluence ?? 0),
    pointSurfaceNormals: lock.pointSurfaceNormals?.map(mirroredVector) || null,
    widthScale: lock.widthScale,
    depthScale: lock.depthScale,
    depth: lock.depth,
    taperCurve: lock.taperCurve.map((point) => ({ ...point })),
    depthCurve: lock.depthCurve.map((point) => ({ ...point })),
    taperCurveSecondary: lock.taperCurveSecondary.map((point) => ({ ...point })),
    depthCurveSecondary: lock.depthCurveSecondary.map((point) => ({ ...point })),
    asymmetricWidthCurve: Boolean(lock.asymmetricWidthCurve),
    asymmetricDepthCurve: Boolean(lock.asymmetricDepthCurve),
    centerAsymmetricProfile: Boolean(lock.centerAsymmetricProfile),
    rootScalpOffset: lock.rootScalpOffset,
    rootAttachmentEnabled: lock.rootAttachmentEnabled !== false,
    rootSurfacePoint: mirroredVector(lock.rootSurfacePoint),
    rootSurfaceNormal: mirroredVector(lock.rootSurfaceNormal),
    strandRotation: -Number(lock.strandRotation ?? 0),
    twist: -lock.twist,
    twistCurve: lock.twistCurve.map((point) => ({ ...point, value: -Number(point.value || 0) })),
    radialSegments: lock.radialSegments,
    lengthSegments: lock.lengthSegments,
    dynamicDensity: lock.dynamicDensity,
    densityAggression: lock.densityAggression,
    twistDensity: lock.twistDensity,
    profileOffset: lock.profileOffset,
    sweepProfile: lock.sweepProfile.map((point) => ({ ...point })),
    sweepOverlapStrength: lock.sweepOverlapStrength,
    sweepOverlapThreshold: lock.sweepOverlapThreshold,
    sweepEdgeSmooth: lock.sweepEdgeSmooth,
    sweepOverlapFalloff: lock.sweepOverlapFalloff,
    sweepTangentSmooth: lock.sweepTangentSmooth,
    points: lock.points.map(mirroredVector),
    groupLatticeBasePoints: lock.groupLatticeBasePoints?.map(mirroredVector) || null
  }, { deferUi: true });
  lock.mirrorPartnerId = mirrored.id;
  mirrored.mirrorPartnerId = lock.id;
  syncMirrorPartnerFromLock(lock, mirrored);
  if (!options.deferUi) {
    renderLockList();
    updateCount();
  }
  return mirrored;
}

function createMirrorPartnerForNewLock(lock) {
  if (!sculptState.state.mirrorXEditing || !lock || mirrorPartnerFor(lock)) return null;
  return createMirrorPartner(lock, { deferUi: true });
}




const branchRegion = createBranchRegionApi({
  locks, rebuildLockGeometry, updateCurveObjects, getSelectedLock, pushUndoState,
  resize, pointerToNdc: clumpProceduralApi.pointerToNdc, closeSweepProfileEditor: branchSweep.closeSweepProfileEditor, closeTaperCurveEditor: taperEditor.closeTaperCurveEditor,
  branchRootRegionWorldPoints: branchBridge.branchRootRegionWorldPoints, strandGeometryCurve, raycaster, camera, renderer,
  branchState: branch.state, sculptState: sculptState.state, viewportState: viewportState.state,
  selState: sel.state, hairState: hairState.state,
  branchRegionMeshPointsGroup, branchRegionMeshPointGeometry, branchRegionMeshPointMaterial, branchRegionCenterMeshPointMaterial,
  sweepProfileEditor, taperCurveEditor
});


function syncMirrorPartnerFromLock(lock, partner = mirrorPartnerFor(lock), options = {}) {
  if (!lock || !partner || partner === lock) return null;
  partner.outlinerVisible = lock.outlinerVisible !== false;
  partner.proceduralParentHidden = Boolean(lock.proceduralParentHidden);
  partner.proceduralDrawGuide = Boolean(lock.proceduralDrawGuide);
  partner.proceduralAccessory = Boolean(lock.proceduralAccessory);
  partner.proceduralAccessoryIndex = lock.proceduralAccessoryIndex == null
    ? null
    : Math.max(0, Math.round(Number(lock.proceduralAccessoryIndex)));
  partner.proceduralAccessoryCount = lock.proceduralAccessoryCount == null
    ? null
    : THREE.MathUtils.clamp(Math.round(Number(lock.proceduralAccessoryCount)), 0, 16);
  partner.proceduralAccessoryRadius = lock.proceduralAccessoryRadius == null
    ? null
    : THREE.MathUtils.clamp(Number(lock.proceduralAccessoryRadius), 0, 2);
  partner.proceduralBranch = Boolean(lock.proceduralBranch);
  partner.proceduralBranchIndex = lock.proceduralBranchIndex == null
    ? null
    : Math.max(0, Math.round(Number(lock.proceduralBranchIndex)));
  partner.proceduralBranchCount = lock.proceduralBranchCount == null
    ? null
    : THREE.MathUtils.clamp(Math.round(Number(lock.proceduralBranchCount)), 0, 64);
  partner.proceduralBranchLength = lock.proceduralBranchLength == null
    ? null
    : THREE.MathUtils.clamp(Number(lock.proceduralBranchLength), 0.1, 3);
  partner.proceduralBranchLengthCurve = normalizeTaperCurve(
    lock.proceduralBranchLengthCurve || DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
  );
  partner.proceduralBranchShapeCurve = normalizeTaperCurve(
    lock.proceduralBranchShapeCurve || DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
  );
  partner.proceduralBranchTipOffset = lock.proceduralBranchTipOffset == null
    ? null
    : THREE.MathUtils.clamp(Number(lock.proceduralBranchTipOffset), 0, 2);
  partner.materialId = lock.materialId || DEFAULT_HAIR_MATERIAL_ID;
  partner.scalpRegion = scalpBuilder.mirroredScalpRegion(lock.scalpRegion);
  partner.hairLayer = normalizeHairLayer(lock.hairLayer);
  partner.layerOffsetApplied = Number(lock.layerOffsetApplied ?? 0);
  partner.layerOffsetRootFactorApplied = Number(lock.layerOffsetRootFactorApplied ?? layerRootOffsetFactor(lock.hairLayer));
  if (lock.clumpGuide && partner.clumpGuide) {
    partner.clumpInfluence = Number(lock.clumpInfluence ?? 1);
    partner.clumpSpread = Number(lock.clumpSpread ?? 1);
    partner.clumpDepthSpread = Number(lock.clumpDepthSpread ?? 1);
    partner.clumpTipFan = Number(lock.clumpTipFan ?? 0);
    partner.clumpRoll = -Number(lock.clumpRoll ?? 0);
    partner.clumpStrandWidth = Number(lock.clumpStrandWidth ?? 1);
    partner.clumpStrandDepth = Number(lock.clumpStrandDepth ?? 1);
    partner.clumpVariation = Number(lock.clumpVariation ?? 0);
  }
  partner.width = lock.width;
  partner.baseWidth = lock.baseWidth;
  partner.geometryType = lock.geometryType;
  partner.surfaceColumns = lock.surfaceColumns;
  partner.surfaceRows = lock.surfaceRows;
  partner.curveSurfaceColumns = lock.curveSurfaceColumns;
  partner.curveSurfaceRows = lock.curveSurfaceRows;
  partner.curveSurfaceSymmetric = Boolean(lock.curveSurfaceSymmetric);
  partner.curveSurfaceCompoundProfile = Boolean(lock.curveSurfaceCompoundProfile);
  partner.compoundBridgeLoops = lock.curveSurfaceCompoundProfile
    ? THREE.MathUtils.clamp(Math.round(Number(lock.compoundBridgeLoops) || 0), 0, 8)
    : null;
  partner.compoundBridgeSmoothing = lock.curveSurfaceCompoundProfile
    ? THREE.MathUtils.clamp(Number(lock.compoundBridgeSmoothing) || 0, 0, 1)
    : null;
  partner.curveSurfaceCenterCurve = lock.curveSurfaceCenterCurve;
  partner.curveSurfaceStripWidth = lock.curveSurfaceStripWidth;
  partner.curveSurfaceSide = mirroredVector(lock.curveSurfaceSide);
  partner.curveSurfaceSource = curveSurfaceCreate.mirroredCurveSurfaceSource(lock.curveSurfaceSource);
  partner.braidMeshPreset = lock.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET;
  partner.braidWidth = lock.braidWidth;
  partner.braidDepth = lock.braidDepth;
  partner.braidSegmentLength = lock.braidSegmentLength;
  partner.braidRotation = -Number(lock.braidRotation ?? 0);
  partner.panelThickness = Number(lock.panelThickness ?? panelCreationDefaults.panelThickness);
  partner.panelLengthLoops = Number(lock.panelLengthLoops ?? panelCreationDefaults.panelLengthLoops);
  partner.panelWidthLoops = Number(lock.panelWidthLoops ?? panelCreationDefaults.panelWidthLoops);
  partner.panelCurvature = lock.geometryType === "surface"
    ? 0
    : Number(lock.panelCurvature ?? panelCreationDefaults.panelCurvature);
  partner.panelLeftEdgeTrim = Number(lock.panelRightEdgeTrim ?? panelCreationDefaults.panelRightEdgeTrim);
  partner.panelRightEdgeTrim = Number(lock.panelLeftEdgeTrim ?? panelCreationDefaults.panelLeftEdgeTrim);
  partner.panelTipCurve = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(-Number(lock.panelTipCurve ?? panelCreationDefaults.panelTipCurve), -1, 1);
  partner.panelTipLoops = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Math.round(Number(lock.panelTipLoops ?? panelCreationDefaults.panelTipLoops)), 0, 16);
  // Scalp Conform：两个值**原样拷贝，不取反、不交换**（与 createMirrorPartner 同规则，
  // 同步点：那里的同名注释，推导写在那里 —— along 在 s 上是奇函数、inward 是偶函数，
  // X 镜像同时翻转 s 与 T 的符号 ⇒ 形状严格镜像）。
  // 对比上面两条：panelTipCurve 取负、左右 EdgeTrim 互换 —— 弯曲两者都不需要。
  partner.panelScalpConformAmount = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Number(lock.panelScalpConformAmount ?? panelCreationDefaults.panelScalpConformAmount), -1, 1);
  partner.panelScalpConformGap = THREE.MathUtils.clamp(
    Number(lock.panelScalpConformGap ?? panelCreationDefaults.panelScalpConformGap),
    0,
    0.5
  );
  partner.profileTrimLeft = Number(lock.profileTrimRight ?? 0);
  partner.profileTrimRight = Number(lock.profileTrimLeft ?? 0);
  partner.profileTrimRoundness = Number(lock.profileTrimRoundness ?? 1);
  partner.hairCard = Boolean(lock.hairCard);
  partner.strandSplitEnabled = Boolean(lock.strandSplitEnabled);
  partner.strandSplitPosition = -Number(lock.strandSplitPosition ?? 0);
  partner.strandSplitHeight = Number(lock.strandSplitHeight ?? 0.3);
  // 取负后必须重新排序：X 镜像把左右次序整个翻转，而 syncStrandSplitLegacyFields 读的是
  // strandSplits[0]（最左侧拉链）作为 legacy 标量真源。不排序就会把「原最左」的 height 写成
  // 「镜像后最左」的 height —— 该标量参与 save/load，且是新增拉链高度的种子，不会自愈。
  // 走 cloneStrandSplits 而不是裸 .map：顺带拿到 position/height 钳位、order 去重与
  // 「数组为空时按 legacy 标量回退成 1 条」的保证。与下方 panelSplits 的 clone→negate→sort 同形。
  partner.strandSplits = cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight, STRAND_SPLIT_MAX)
    .map((split) => ({ ...split, position: -split.position }))
    .sort((a, b) => a.position - b.position);
  syncStrandSplitLegacyFields(partner);
  partner.strandTipStart = Number(lock.strandTipStart ?? 0.75);
  partner.strandTip = mirrorStrandTip(lock.strandTip);
  partner.strandSplitBones = mirrorStrandSplitBones(lock.strandSplitBones);
  partner.panelSplitEnabled = lock.panelSplitEnabled !== false;
  partner.panelSplitSnapToLoops = lock.panelSplitSnapToLoops !== false;
  partner.panelSplitHeight = Number(lock.panelSplitHeight ?? panelCreationDefaults.panelSplitHeight);
  partner.panelSplits = clonePanelSplits(lock.panelSplits, lock.panelSplitHeight)
    .map((split) => ({ ...split, position: -split.position }))
    .sort((a, b) => a.position - b.position);
  partner.panelSplitGap = Number(lock.panelSplitGap ?? panelCreationDefaults.panelSplitGap);
  partner.objectTransform = mirroredStrandObjectTransform(lock.objectTransform);
  partner.splitBones = mirrorSplitBones(lock.splitBones);
  partner.bones = mirrorBones(lock.bones);
  partner.curlEnabled = Boolean(lock.curlEnabled);
  partner.curlCount = Number(lock.curlCount ?? 4);
  partner.curlDisplacement = Number(lock.curlDisplacement ?? 0.18);
  partner.surfaceNormalInfluence = Number(lock.surfaceNormalInfluence ?? 0);
  partner.pointSurfaceNormals = lock.pointSurfaceNormals?.map(mirroredVector) || [];
  partner.widthScale = Number(lock.widthScale ?? 1);
  partner.depthScale = Number(lock.depthScale ?? 1);
  partner.depth = Number(lock.depth ?? 0.16);
  partner.strandRotation = -Number(lock.strandRotation ?? 0);
  partner.twist = -Number(lock.twist || 0);
  partner.twistCurve = lock.twistCurve.map((point) => ({ ...point, value: -Number(point.value || 0) }));
  partner.taperCurve = lock.taperCurve.map((point) => ({ ...point }));
  partner.depthCurve = lock.depthCurve.map((point) => ({ ...point }));
  partner.taperCurveSecondary = lock.taperCurveSecondary.map((point) => ({ ...point }));
  partner.depthCurveSecondary = lock.depthCurveSecondary.map((point) => ({ ...point }));
  partner.asymmetricWidthCurve = Boolean(lock.asymmetricWidthCurve);
  partner.asymmetricDepthCurve = Boolean(lock.asymmetricDepthCurve);
  partner.centerAsymmetricProfile = Boolean(lock.centerAsymmetricProfile);
  partner.sweepProfile = lock.sweepProfile.map((point) => ({ ...point }));
  partner.sweepOverlapStrength = THREE.MathUtils.clamp(Number(lock.sweepOverlapStrength ?? SWEEP_OVERLAP_DEFAULTS.strength ?? 0.7), 0, 1);
  partner.sweepOverlapThreshold = THREE.MathUtils.clamp(Number(lock.sweepOverlapThreshold ?? SWEEP_OVERLAP_DEFAULTS.threshold ?? 0.6), 0.1, 2);
  partner.sweepEdgeSmooth = THREE.MathUtils.clamp(Number(lock.sweepEdgeSmooth ?? SWEEP_OVERLAP_DEFAULTS.edgeSmooth ?? 0.3), 0, 1);
  partner.sweepOverlapFalloff = THREE.MathUtils.clamp(Math.round(Number(lock.sweepOverlapFalloff ?? SWEEP_OVERLAP_DEFAULTS.falloff ?? 3) || 0), 0, 8);
  partner.sweepTangentSmooth = THREE.MathUtils.clamp(Number(lock.sweepTangentSmooth ?? SWEEP_OVERLAP_DEFAULTS.tangentSmooth ?? 0.3), 0, 1);
  partner.profileOffset = Number(lock.profileOffset || 0);
  partner.rootScalpOffset = Number(lock.rootScalpOffset || 0);
  partner.rootAttachmentEnabled = lock.rootAttachmentEnabled !== false;
  partner.rootSurfacePoint = mirroredVector(lock.rootSurfacePoint);
  partner.rootSurfaceNormal = mirroredVector(lock.rootSurfaceNormal)?.normalize() || null;
  partner.rootAttachment = partner.rootAttachmentEnabled ? ioApi.createRootAttachment(partner) : null;
  partner.radialSegments = lock.radialSegments;
  partner.lengthSegments = lock.lengthSegments;
  partner.dynamicDensity = Boolean(lock.dynamicDensity);
  partner.densityAggression = Number(lock.densityAggression ?? 0.5);
  partner.twistDensity = Number(lock.twistDensity ?? 0);
  partner.points = lock.points.map(mirroredVector);
  partner.groupLatticeBasePoints = lock.groupLatticeBasePoints?.map(mirroredVector) || null;
  partner.clumpRestPoints = lock.clumpRestPoints?.map(mirroredVector) || null;
  partner.clumpGuideRestPoints = lock.clumpGuideRestPoints?.map(mirroredVector) || null;
  partner.clumpRestTwists = lock.clumpRestTwists?.map((twist) => -Number(twist || 0)) || null;
  partner.clumpGuideRestTwists = lock.clumpGuideRestTwists?.map((twist) => -Number(twist || 0)) || null;
  partner.clumpRestScales = lock.clumpRestScales?.map((scale) => ({ x: scale.x, z: scale.z })) || null;
  partner.clumpGuideRestScales = lock.clumpGuideRestScales?.map((scale) => ({ x: scale.x, z: scale.z })) || null;
  partner.clumpParameterStart = THREE.MathUtils.clamp(Number(lock.clumpParameterStart ?? 0), 0, 1);
  partner.clumpParameterEnd = THREE.MathUtils.clamp(Number(lock.clumpParameterEnd ?? 1), partner.clumpParameterStart, 1);
  partner.clumpShapeCurveInheritance = Boolean(lock.clumpShapeCurveInheritance);
  const branchParent = locks.find((item) => item.id === lock.branchParentId);
  partner.branchParentId = branchParent ? (mirrorPartnerFor(branchParent)?.id || null) : null;
  partner.branchParentParameter = THREE.MathUtils.clamp(Number(lock.branchParentParameter ?? 0), 0, 1);
  partner.branchLocalPoints = lock.branchLocalPoints?.map((point) => new THREE.Vector3(-point.x, point.y, point.z)) || null;
  partner.branchLocalSurfaceNormals = lock.branchLocalSurfaceNormals?.map((normal) => (
    normal ? new THREE.Vector3(-normal.x, normal.y, normal.z) : null
  )) || null;
  partner.branchRootRegion = branchRegion.cloneBranchRootRegion(lock.branchRootRegion, { mirror: true });
  partner.pointScales = lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
  partner.pointWidths = [...lock.pointWidths];
  partner.pointTwists = lock.pointTwists.map((twist) => -twist);
  partner.placementFrame = mirroredPlacementFrame(lock.placementFrame);
  fitPointAttributes(partner, partner.points.length);
  if (
    partner.curveObjects.handles.length !== partner.points.length
    || (partner.curveObjects.panelSplitHandles?.length || 0) !== (partner.panelSplits?.length || 0)
    || (partner.curveObjects.strandSplitHandles?.length || 0) !== (partner.strandSplits?.length || 0)
  ) rebuildCurveObjects(partner);
  syncLockFromCurve(partner);
  materialApi.applyMaterialDefinitionToLock(partner);
  updateLockGeometry(partner, {
    defer: Boolean(options.deferGeometry),
    immediate: options.immediate,
    updateCurveObjects: options.updateCurveObjects,
    updateClump: options.updateClump
  });
  return partner;
}

function syncActiveMirror(lock, options = {}) {
  if (!lock) return null;
  const partner = mirrorPartnerFor(lock);
  if (!partner) return null;
  const result = syncMirrorPartnerFromLock(lock, partner, options);
  if (result && options.refreshUi) {
    renderLockList();
    updateCount();
  }
  return result;
}

function setMirrorXEditing(enabled) {
  sculptState.state.mirrorXEditing = Boolean(enabled);
  mirrorXToggle.classList.toggle("active", sculptState.state.mirrorXEditing);
  mirrorXToggle.setAttribute("aria-pressed", String(sculptState.state.mirrorXEditing));
  mirrorXToggle.title = sculptState.state.mirrorXEditing
    ? "X axis mirror is active. New strands create linked mirror instances"
    : "Enable X axis mirror. New strands will create linked mirror instances";
  if (sculptState.state.drawStrandStroke) drawFlowApi.updateDrawStrandPreview();
  if (sel.state.activeTool === "curve-surface") curveSurfaceCreate.updateCurveSurfacePreview();
  guides.filter((guide) => guide.type === "curve-lattice").forEach(guideApi.updateCurveLatticeHandleColors);
  guides.filter((guide) => guide.type === "capsule").forEach((guide) => {
    guideApi.updateCapsuleGuideHandleColors(guide, guide.selectedPointIndex ?? -1);
  });
  scalpBuilder.updateScalpBuilderHandleColors();
  if (scalpState.state.scalpBuilderCurveLattice) {
    scalpState.state.scalpBuilderCurveLattice.symmetryLine.visible = (
      SCALP_REGION_CURVE_VISUALIZATION_ENABLED && scalpState.state.scalpBuilderEditing && sculptState.state.mirrorXEditing
    );
    scalpState.state.scalpBuilderCurveLattice.headSymmetryLine.visible = (
      SCALP_REGION_CURVE_VISUALIZATION_ENABLED && scalpState.state.scalpBuilderEditing && sculptState.state.mirrorXEditing
    );
  }
}

function snapshotState() {
  return {
    scalpAttachmentVersion: 4,
    visibleStrandRegions: [...visibleStrandRegions],
    visibleStrandLayers: [...visibleStrandLayers],
    capsuleGuidesVisible: guideState.state.capsuleGuidesVisible,
    curveLatticeGuidesVisible: guideState.state.curveLatticeGuidesVisible,
    headMeshVisible: hairState.state.headMeshVisible,
    bodyMeshVisible: hairState.state.bodyMeshVisible,
    lockIndex: sel.state.lockIndex,
    referenceImageIndex: ref.state.referenceImageIndex,
    hairMaterialIndex: hairState.state.hairMaterialIndex,
    hairMaterials: hairMaterialDefinitions.map((material) => ({ ...material })),
        ...createProjectSelectionSnapshot(sel.selectionSnapshot()),
    mirrorXEditing: sculptState.state.mirrorXEditing,
    headTransform: { ...headTransform },
    scalpRoughScale: { ...scalpRoughScale },
    scalpBuilderEditedPoints: (scalpState.state.scalpBuilderCurveLattice?.points || scalpState.state.scalpBuilderEditedPoints || []).map(vectorToData),
    editedScalpRegions: [...scalpState.state.editedScalpRegions],
    scalpGuideSource: scalpState.state.scalpGuideSource,
    customScalpRegions: [...scalpState.state.customScalpRegions],
    scalpSurface: { ...scalpSurface },
    scalpConformFit: { ...scalpConformFit },
    scalpArtistShape: { ...scalpArtistShape },
    scalpLatticePoints: scalpLatticePoints.map(vectorToData),
    scalpRegionAssignments: [...scalpState.state.scalpRegionAssignments],
    scalpManualRegionQuads: [...scalpState.state.scalpManualRegionQuads],
    strandGroupDefaults: Object.fromEntries(Object.entries(strandGroupDefaults).map(([region, defaults]) => [region, {
      ...defaults,
      layerOffsets: { ...DEFAULT_LAYER_OFFSETS, ...defaults.layerOffsets },
      taperCurve: defaults.taperCurve.map((point) => ({ ...point })),
      depthCurve: defaults.depthCurve.map((point) => ({ ...point })),
      taperCurveSecondary: (defaults.taperCurveSecondary || defaults.taperCurve).map((point) => ({ ...point })),
      depthCurveSecondary: (defaults.depthCurveSecondary || defaults.depthCurve).map((point) => ({ ...point })),
      asymmetricWidthCurve: Boolean(defaults.asymmetricWidthCurve),
      asymmetricDepthCurve: Boolean(defaults.asymmetricDepthCurve),
      centerAsymmetricProfile: Boolean(defaults.centerAsymmetricProfile),
      sweepProfile: defaults.sweepProfile.map((point) => ({ ...point }))
    }])),
    selectionSets: selectionSets.map((set) => ({
      ...set,
      strandIds: [...set.strandIds]
    })),
    locks: projectSnapshotLocks(locks, sculptState.state.duplicatePlacement)
      .map((lock) => ({
      id: lock.id,
      mirrorPartnerId: lock.mirrorPartnerId || null,
      name: lock.name,
      outlinerVisible: lock.outlinerVisible !== false,
      locked: Boolean(lock.locked),
      objectTransform: normalizeStrandObjectTransform(lock.objectTransform),
      liveSurfaceGuide: Boolean(lock.liveSurfaceGuide),
      materialId: lock.materialId || DEFAULT_HAIR_MATERIAL_ID,
      x: lock.x,
      y: lock.y,
      z: lock.z,
      length: lock.length,
      curve: lock.curve,
      width: lock.width,
      baseWidth: lock.baseWidth,
      geometryType: lock.geometryType || "strand",
      polyFaces: lock.geometryType === "poly" ? lock.polyFaces.map((face) => [...face]) : null,
      surfaceColumns: lock.geometryType === "surface"
        ? normalizeSurfaceLatticeCount(lock.surfaceColumns, DEFAULT_SURFACE_LATTICE_COLUMNS)
        : null,
      surfaceRows: lock.geometryType === "surface"
        ? normalizeSurfaceLatticeCount(lock.surfaceRows, DEFAULT_SURFACE_LATTICE_ROWS)
        : null,
      curveSurfaceColumns: lock.geometryType === "curve-surface" ? lock.curveSurfaceColumns : null,
      curveSurfaceRows: lock.geometryType === "curve-surface" ? lock.curveSurfaceRows : null,
      curveSurfaceSymmetric: lock.geometryType === "curve-surface" && Boolean(lock.curveSurfaceSymmetric),
      curveSurfaceCompoundProfile: lock.geometryType === "curve-surface"
        && Boolean(lock.curveSurfaceCompoundProfile),
      compoundBridgeLoops: lock.geometryType === "curve-surface" && lock.curveSurfaceCompoundProfile
        ? THREE.MathUtils.clamp(Math.round(Number(lock.compoundBridgeLoops) || 0), 0, 8)
        : null,
      compoundBridgeSmoothing: lock.geometryType === "curve-surface" && lock.curveSurfaceCompoundProfile
        ? THREE.MathUtils.clamp(Number(lock.compoundBridgeSmoothing) || 0, 0, 1)
        : null,
      curveSurfaceCenterCurve: lock.geometryType === "curve-surface" ? lock.curveSurfaceCenterCurve : null,
      curveSurfaceStripWidth: lock.geometryType === "curve-surface" ? lock.curveSurfaceStripWidth : null,
      curveSurfaceSide: lock.geometryType === "curve-surface" && lock.curveSurfaceSide
        ? vectorToData(lock.curveSurfaceSide)
        : null,
      curveSurfaceSource: curveSurfaceCreate.curveSurfaceSourceForSnapshot(lock),
      braidMeshPreset: lock.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET,
      braidWidth: Number(lock.braidWidth ?? 0.34),
      braidDepth: Number(lock.braidDepth ?? 0.44),
      braidSegmentLength: Number(lock.braidSegmentLength ?? 0.28),
      braidRotation: Number(lock.braidRotation ?? 0),
      panelThickness: Number(lock.panelThickness ?? panelCreationDefaults.panelThickness),
      panelLengthLoops: Number(lock.panelLengthLoops ?? panelCreationDefaults.panelLengthLoops),
      panelWidthLoops: Number(lock.panelWidthLoops ?? panelCreationDefaults.panelWidthLoops),
      panelCurvature: Number(lock.panelCurvature ?? panelCreationDefaults.panelCurvature),
      panelLeftEdgeTrim: Number(lock.panelLeftEdgeTrim ?? panelCreationDefaults.panelLeftEdgeTrim),
      panelRightEdgeTrim: Number(lock.panelRightEdgeTrim ?? panelCreationDefaults.panelRightEdgeTrim),
      panelTipCurve: Number(lock.panelTipCurve ?? panelCreationDefaults.panelTipCurve),
      panelTipLoops: Number(lock.panelTipLoops ?? panelCreationDefaults.panelTipLoops),
      panelScalpConformAmount: Number(lock.panelScalpConformAmount ?? panelCreationDefaults.panelScalpConformAmount),
      panelScalpConformGap: Number(lock.panelScalpConformGap ?? panelCreationDefaults.panelScalpConformGap),
      profileTrimLeft: Number(lock.profileTrimLeft ?? 0),
      profileTrimRight: Number(lock.profileTrimRight ?? 0),
      profileTrimRoundness: Number(lock.profileTrimRoundness ?? 1),
      hairCard: Boolean(lock.hairCard),
      strandSplitEnabled: Boolean(lock.strandSplitEnabled),
      strandSplitPosition: Number(lock.strandSplitPosition ?? 0),
      strandSplitHeight: Number(lock.strandSplitHeight ?? 0.3),
      strandSplits: cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight, STRAND_SPLIT_MAX),
      strandTipStart: Number(lock.strandTipStart ?? 0.75),
      strandTip: lock.strandTip ? strandTipToData(lock.strandTip) : null,
      strandSplitBones: lock.strandSplitBones ? strandSplitBonesToData(lock.strandSplitBones) : null,
      panelSplitEnabled: lock.panelSplitEnabled !== false,
      panelSplitSnapToLoops: lock.panelSplitSnapToLoops !== false,
      panelSplitHeight: Number(lock.panelSplitHeight ?? panelCreationDefaults.panelSplitHeight),
      panelSplits: clonePanelSplits(lock.panelSplits, lock.panelSplitHeight),
      panelSplitGap: Number(lock.panelSplitGap ?? panelCreationDefaults.panelSplitGap),
      splitBones: lock.splitBones ? splitBonesToData(lock.splitBones) : null,
      bones: registryForSave(lock),
      curlEnabled: Boolean(lock.curlEnabled),
      curlCount: Number(lock.curlCount ?? 4),
      curlDisplacement: Number(lock.curlDisplacement ?? 0.18),
      surfaceNormalInfluence: Number(lock.surfaceNormalInfluence ?? 0),
      pointSurfaceNormals: lock.pointSurfaceNormals?.map((normal) => normal ? vectorToData(normal) : null) || null,
      widthScale: Number(lock.widthScale ?? 1),
      depthScale: Number(lock.depthScale ?? 1),
      depth: Number(lock.depth ?? 0.16),
      taperCurve: lock.taperCurve.map((point) => ({ ...point })),
      depthCurve: lock.depthCurve.map((point) => ({ ...point })),
      taperCurveSecondary: lock.taperCurveSecondary.map((point) => ({ ...point })),
      depthCurveSecondary: lock.depthCurveSecondary.map((point) => ({ ...point })),
      asymmetricWidthCurve: Boolean(lock.asymmetricWidthCurve),
      asymmetricDepthCurve: Boolean(lock.asymmetricDepthCurve),
      centerAsymmetricProfile: Boolean(lock.centerAsymmetricProfile),
      profileOffset: Number(lock.profileOffset ?? 0),
      rootScalpOffset: lock.rootScalpOffset,
      hairLayer: normalizeHairLayer(lock.hairLayer),
      layerOffsetApplied: Number(lock.layerOffsetApplied ?? 0),
      layerOffsetRootFactorApplied: Number(lock.layerOffsetRootFactorApplied ?? layerRootOffsetFactor(lock.hairLayer)),
      regionLengthReference: Number(lock.regionLengthReference ?? 0),
      regionLengthApplied: Number(lock.regionLengthApplied ?? 1),
      clumpId: lock.clumpId || null,
      clumpName: lock.clumpName || null,
      clumpGuide: Boolean(lock.clumpGuide),
      clumpGuideId: lock.clumpGuideId || null,
      clumpInfluence: Number(lock.clumpInfluence ?? 1),
      clumpSpread: Number(lock.clumpSpread ?? 1),
      clumpDepthSpread: Number(lock.clumpDepthSpread ?? 1),
      clumpTipFan: Number(lock.clumpTipFan ?? 0),
      clumpRoll: Number(lock.clumpRoll ?? 0),
      clumpStrandWidth: Number(lock.clumpStrandWidth ?? 1),
      clumpStrandDepth: Number(lock.clumpStrandDepth ?? 1),
      clumpVariation: Number(lock.clumpVariation ?? 0),
      proceduralParentHidden: Boolean(lock.proceduralParentHidden),
      proceduralDrawGuide: Boolean(lock.proceduralDrawGuide),
      proceduralAccessory: Boolean(lock.proceduralAccessory),
      proceduralAccessoryIndex: lock.proceduralAccessoryIndex == null ? null : Number(lock.proceduralAccessoryIndex),
      proceduralAccessoryCount: lock.proceduralAccessoryCount == null ? null : Number(lock.proceduralAccessoryCount),
      proceduralAccessoryRadius: lock.proceduralAccessoryRadius == null ? null : Number(lock.proceduralAccessoryRadius),
      proceduralBranch: Boolean(lock.proceduralBranch),
      proceduralBranchIndex: lock.proceduralBranchIndex == null ? null : Number(lock.proceduralBranchIndex),
      proceduralBranchCount: lock.proceduralBranchCount == null ? null : Number(lock.proceduralBranchCount),
      proceduralBranchLength: lock.proceduralBranchLength == null ? null : Number(lock.proceduralBranchLength),
      proceduralBranchLengthCurve: shapePresets.cloneShapePresetValue(
        lock.proceduralBranchLengthCurve || DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
      ),
      proceduralBranchShapeCurve: shapePresets.cloneShapePresetValue(
        lock.proceduralBranchShapeCurve || DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
      ),
      proceduralBranchTipOffset: lock.proceduralBranchTipOffset == null ? null : Number(lock.proceduralBranchTipOffset),
      clumpRestPoints: lock.clumpRestPoints?.map(vectorToData) || null,
      clumpGuideRestPoints: lock.clumpGuideRestPoints?.map(vectorToData) || null,
      clumpRestTwists: lock.clumpRestTwists ? [...lock.clumpRestTwists] : null,
      clumpGuideRestTwists: lock.clumpGuideRestTwists ? [...lock.clumpGuideRestTwists] : null,
      clumpRestScales: lock.clumpRestScales?.map((scale) => ({ x: scale.x, z: scale.z })) || null,
      clumpGuideRestScales: lock.clumpGuideRestScales?.map((scale) => ({ x: scale.x, z: scale.z })) || null,
      clumpParameterStart: THREE.MathUtils.clamp(Number(lock.clumpParameterStart ?? 0), 0, 1),
      clumpParameterEnd: THREE.MathUtils.clamp(
        Number(lock.clumpParameterEnd ?? 1),
        THREE.MathUtils.clamp(Number(lock.clumpParameterStart ?? 0), 0, 1),
        1
      ),
      clumpShapeCurveInheritance: Boolean(lock.clumpShapeCurveInheritance),
      branchParentId: lock.branchParentId || null,
      branchParentParameter: THREE.MathUtils.clamp(Number(lock.branchParentParameter ?? 0), 0, 1),
      branchLocalPoints: lock.branchLocalPoints?.map(vectorToData) || null,
      branchLocalSurfaceNormals: lock.branchLocalSurfaceNormals?.map((normal) => normal ? vectorToData(normal) : null) || null,
      branchRootRegion: branchRegion.cloneBranchRootRegion(lock.branchRootRegion),
      branchCurvesAuthored: Boolean(lock.branchCurvesAuthored),
      branchSweepStartT: THREE.MathUtils.clamp(Number(lock.branchSweepStartT ?? 0.1), 0.02, 0.6),
      rootSurfacePoint: lock.rootSurfacePoint ? vectorToData(lock.rootSurfacePoint) : null,
      rootSurfaceNormal: lock.rootSurfaceNormal ? vectorToData(lock.rootSurfaceNormal) : null,
      rootAttachmentEnabled: lock.rootAttachmentEnabled !== false,
      rootAttachment: lock.geometryType === "poly"
        ? null
        : ioApi.rootAttachmentToData(ioApi.syncRootAttachmentMetadata(lock)),
      strandRotation: Number(lock.strandRotation ?? 0),
      twist: lock.twist,
      twistCurve: lock.twistCurve.map((point) => ({ ...point })),
      radialSegments: lock.radialSegments,
      lengthSegments: lock.lengthSegments,
      dynamicDensity: Boolean(lock.dynamicDensity),
      densityAggression: Number(lock.densityAggression ?? 0.5),
      twistDensity: Number(lock.twistDensity ?? 0),
      sweepProfile: lock.sweepProfile.map((point) => ({ ...point })),
      scalpRegion: lock.scalpRegion || "unassigned",
      points: lock.points.map(vectorToData),
      pointWidths: [...lock.pointWidths],
      pointScales: lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z })),
      pointTwists: [...lock.pointTwists],
      curveLatticeBinding: lock.curveLatticeBinding ? { ...lock.curveLatticeBinding } : null,
      groupLatticeBasePoints: lock.groupLatticeBasePoints?.map(vectorToData) || null,
      placementFrame: lock.placementFrame ? frameToData(lock.placementFrame) : null
    })),
    referenceImages: referenceImages.map(referenceHeadApi.serializeReferenceImage),
    guides: guides.map((guide) => guide.type === "capsule" ? {
      id: guide.id,
      type: guide.type,
      name: guide.name,
      color: guideApi.normalizeCapsuleGuideColor(guide.color),
      outlinerVisible: guide.outlinerVisible !== false,
      start: vectorToData(guide.start),
      end: vectorToData(guide.end),
      radius: guide.radius,
      radialLoops: guide.radialLoops,
      lengthLoops: guide.lengthLoops,
      subdivisionSteps: guide.subdivisionSteps,
      opacity: guide.opacity,
      fresnel: guide.fresnel,
      centerVisibility: guide.centerVisibility,
      controlPoints: guide.controlPoints?.map(vectorToData) || null,
      controlFaces: guide.controlFaces?.map((face) => [...face]) || null
    } : guide.type === "curve-lattice" ? {
      id: guide.id,
      type: guide.type,
      standalone: Boolean(guide.standalone),
      name: guide.name,
      outlinerVisible: guide.outlinerVisible !== false,
      columns: guide.columns,
      rows: guide.rows,
      opacity: guide.opacity,
      scalpRegion: guide.scalpRegion || "bangs",
      color: guide.color,
      points: guide.points.map(vectorToData),
      rootPoints: (guide.rootPoints || []).map(vectorToData),
      deformRestPoints: (guide.deformRestPoints || guide.points).map(vectorToData),
      deformRestRootPoints: (guide.deformRestRootPoints || guide.rootPoints || []).map(vectorToData)
    } : ({
      id: guide.id,
      name: guide.name,
      outlinerVisible: guide.outlinerVisible !== false,
      x: guide.x,
      y: guide.y,
      z: guide.z,
      width: guide.width,
      height: guide.height,
      depth: guide.depth,
      bend: guide.bend,
      verticalBend: guide.verticalBend,
      topCurve: guide.topCurve,
      bottomCurve: guide.bottomCurve,
      density: guide.density,
      opacity: guide.opacity,
      objectQuaternion: guide.objectQuaternion || null,
      objectScale: guide.objectScale || null
    }))
  };
}


// Preset library deps batch (refactor batch B3): all deps are defined by this point (last
// dep: shapePresets / taperEditorDeps block); creationPresets is filled in-place right after
// its creation below. The braid mesh preset loads + shape preset UI boot run here so the
// presetLibraryApi deps are available before registerBraidMeshPreset callbacks fire.
Object.assign(presetLibraryDeps, {
  presetCatalog, authoredPresetProjects, braidMeshPresets,
  SHAPE_PRESETS, BRAID_TOOL_PRESETS, braidCreationDefaults, strandCreationDefaults,
  projectState, sculptState: sculptState.state, hairState: hairState.state,
  guideState: guideState.state, drawState: draw.state, miscState: miscState.state,
  undoHistory, redoHistory, locks,
  shapePresets, scalpBuilder, taperEditor,
  updateLockGeometry, getSelectedLock, updatePlacementStatus: placementApi.updatePlacementStatus, restoreState, snapshotState,
  updateHistoryButtons, pushUndoState, updateDrawStrandPreview: drawFlowApi.updateDrawStrandPreview, syncCreationShapeInputs,
  setDrawStrandMode, setDrawStrandBrushCursorScale, activeStrokeBrushSize: drawFlowApi.activeStrokeBrushSize,
  normalizedLiveSurfaceSelection: drawFlowApi.normalizedLiveSurfaceSelection, drawSurfaceDynamicEnabled: drawFlowApi.drawSurfaceDynamicEnabled, setDrawSurfaceDynamicEnabled: drawFlowApi.setDrawSurfaceDynamicEnabled,
  pushPointOutsideHead: placementApi.pushPointOutsideHead, updateViewportStatsVisibility,
  presetLibrary, presetLibraryToggle, presetLibraryGrid, presetLibraryStatus, presetFilterButtons,
  shapePresetSelects, shapePresetButtons,
  drawBrushPresetInput, braidToolPresetInput,
  saveStrandToolPresetButton, saveBraidToolPresetButton, removeStrandToolPresetButton, removeBraidToolPresetButton,
  creationPresetDialog, creationPresetForm, creationPresetDialogTitle, creationPresetDescription, creationPresetNameInput,
  closeCreationPresetDialogButton, cancelCreationPresetButton,
  removeCreationPresetDialog, removeCreationPresetDialogTitle, removeCreationPresetMessage,
  cancelRemoveCreationPresetButton, confirmRemoveCreationPresetButton,
  braidToolSizeInput, braidSmoothingInput, braidCurveStepInput, braidScalpOffsetInput,
  braidAutoShowScalpInput, braidContinueFromTipInput,
  drawToolSizeInput, drawStrandSmoothingInput, drawStrandCurveStepInput, drawStrandScalpOffsetInput,
  drawSurfaceNormalInfluenceInput, drawStrandSurfaceInput, drawSurfaceDynamicButton,
  drawAutoShowScalpInput, drawContinueFromTipInput, scalpSurfaceGroup
});
presetLibraryApi.loadBraidMeshPreset(DEFAULT_BRAID_MESH_PRESET, "./assets/braid-segment.obj?v=20260720-1");
presetLibraryApi.loadBraidMeshPreset("chain-links", "./assets/chainlinks.obj?v=20260720-1", { authoredCaps: true });
presetLibraryApi.setupShapePresetUi();
const creationPresets = createCreationPresetsApi({
  normalizeHairLayer, normalizeClumpBrushTemplate,
  normalizeToolPresetLibrary, emptyToolPresetLibrary, activeStrokeSurfaceValue: drawFlowApi.activeStrokeSurfaceValue,
  drawSurfaceDynamicEnabled: drawFlowApi.drawSurfaceDynamicEnabled, createClumpBrushTemplate, normalizeBraidDimensions: presetLibraryApi.normalizeBraidDimensions,
  getSelectedLock, syncCreationShapeInputs, updatePlacementStatus: placementApi.updatePlacementStatus, applyCreationToolSettings: presetLibraryApi.applyCreationToolSettings,
  braidCreationDefaults, strandCreationDefaults, DEFAULT_BRAID_MESH_PRESET,
  CREATION_PRESET_STORAGE_KEY, LEGACY_CLUMP_PRESET_STORAGE_KEY,
  projectState, drawState: draw.state, hairState: hairState.state, selState: sel.state, guideState: guideState.state
});
presetLibraryDeps.creationPresets = creationPresets;


const fileApi = createProjectSaveApi({
  get currentProjectName() { return projectState.state.currentProjectName; },
  set currentProjectName(value) { projectState.state.currentProjectName = value; },
  get quickSaveFileHandle() { return projectState.state.quickSaveFileHandle; },
  set quickSaveFileHandle(value) { projectState.state.quickSaveFileHandle = value; },
  get quickSaveFileName() { return projectState.state.quickSaveFileName; },
  set quickSaveFileName(value) { projectState.state.quickSaveFileName = value; },
  get projectSaveInProgress() { return projectState.state.projectSaveInProgress; },
  set projectSaveInProgress(value) { projectState.state.projectSaveInProgress = value; },
  get lastExport() { return projectState.state.lastExport; },
  set lastExport(value) { projectState.state.lastExport = value; },
  get quickExportFileHandle() { return projectState.state.quickExportFileHandle; },
  set quickExportFileHandle(value) { projectState.state.quickExportFileHandle = value; },
  get quickExportInProgress() { return projectState.state.quickExportInProgress; },
  set quickExportInProgress(value) { projectState.state.quickExportInProgress = value; },
  get pendingFileAction() { return projectState.state.pendingFileAction; },
  set pendingFileAction(value) { projectState.state.pendingFileAction = value; },
  get importedHeadAsset() { return head.state.importedHeadAsset; },
  get importedScalpGuideAsset() { return scalpState.state.importedScalpGuideAsset; },
  get referenceImages() { return referenceImages; },
  get locks() { return locks; },
  get STRAND_GROUPS() { return STRAND_GROUPS; },
  snapshotState,
  strandCurveParameters,
  curveSurfaceControllerCurves: curveSurfaceCreate.curveSurfaceControllerCurves,
  bonesFor,
  strandGeometryFrameAt,
  splitTipForSegment: panelTipStrand.splitTipForSegment,
  tipChainFrameAt: panelTipStrand.tipChainFrameAt,
  safelyRememberRecentProject: ioApi.safelyRememberRecentProject,
  clearAcknowledgedRecovery
});








function pushUndoState() {
  if (undo.state.restoringHistory) return;
  undoHistory.push(snapshotState());
  redoHistory.clear();
  updateHistoryButtons();
  markProjectChangedForRecovery();
}

function undoLastAction() {
  if (proceduralDuplicateDialog.open) proceduralDuplicateApi.closeProceduralDuplicateDialog();
  const state = undoHistory.pop();
  if (!state) return;
  redoHistory.push(snapshotState());
  try {
    restoreState(state, { preserveMirrorMode: true });
  } catch (error) {
    console.error("Undo failed to restore state", error);
    presetLibraryStatus.textContent = "Undo failed to restore the previous state";
  } finally {
    undo.state.restoringHistory = false;
    updateHistoryButtons();
    markProjectChangedForRecovery();
    prioritizeActiveMultiCameraViewport(1);
  }
  if (taperCurveEditor.open) taperEditor.renderTaperCurveEditor();
}

function redoLastAction() {
  if (proceduralDuplicateDialog.open) proceduralDuplicateApi.closeProceduralDuplicateDialog();
  const state = redoHistory.pop();
  if (!state) return;
  undoHistory.push(snapshotState());
  try {
    restoreState(state, { preserveMirrorMode: true });
  } catch (error) {
    console.error("Redo failed to restore state", error);
    presetLibraryStatus.textContent = "Redo failed to restore the previous state";
  } finally {
    undo.state.restoringHistory = false;
    updateHistoryButtons();
    markProjectChangedForRecovery();
    prioritizeActiveMultiCameraViewport(1);
  }
  if (taperCurveEditor.open) taperEditor.renderTaperCurveEditor();
}

function updateHistoryButtons() {
  if (undoButton) undoButton.disabled = undoHistory.length === 0;
  if (redoButton) redoButton.disabled = redoHistory.length === 0;
}

function resetTransientInteractionsForStateRestore() {
  sel.state.isolatedStrandIds = null;
  sculptState.state.proceduralDuplicatePreview = null;
  sculptState.state.proceduralDuplicateWindowSourceIds = [];
  if (proceduralDuplicateDialog.open) proceduralDuplicateDialog.close();
  if (dropImportDialog.open) dropImportDialog.close();
  transformControls.detach();
  sculptState.state.duplicatePlacement = null;
  sculptState.state.proceduralDuplicateModeActive = false;
  proceduralDuplicateApi.hideProceduralDuplicateArcPreview();
  radialMenuApi.hideStrandRadialMenu();
  radialMenuApi.hideToolRadialMenu();
  sculptState.state.placeEdit = null;
  sculptState.state.branchRegionEdit = null;
  branchRegionMeshPointsGroup.clear();
  branchRegionMeshPointsGroup.visible = false;
  sculptState.state.transformDragging = false;
  updateInteractionLocks();
}

function resetEditableSceneForStateRestore() {
  // Wind preview mutual exclusion: full scene teardown/reload (project open, new project,
  // undo/redo restore) closes the preview and drops caches before lock objects are replaced.
  if (windStore.state.windPreviewActive) setWindPreviewActive(false);
  disposeAllEditableObjects();
  locks.length = 0;
  selectionSets.length = 0;
  guides.length = 0;
}

function restoreSharedStateForStateRestore(state, restorePlan, { preserveMirrorMode = false } = {}) {
  sel.state.lockIndex = restorePlan.counters.lockIndex;
  ref.state.referenceImageIndex = restorePlan.counters.referenceImageIndex;
  visibleStrandRegions.clear();
  restorePlan.visibility.strandRegions.forEach((region) => visibleStrandRegions.add(region));
  visibleStrandLayers.clear();
  restorePlan.visibility.strandLayers.forEach((layer) => visibleStrandLayers.add(layer));
  guideState.state.capsuleGuidesVisible = restorePlan.visibility.capsuleGuides;
  guideState.state.curveLatticeGuidesVisible = restorePlan.visibility.curveLatticeGuides;
  hairState.state.headMeshVisible = restorePlan.visibility.headMesh;
  hairState.state.bodyMeshVisible = restorePlan.visibility.bodyMesh;
  hairState.state.hairMaterialIndex = restorePlan.counters.hairMaterialIndex;
  hairMaterialDefinitions.splice(
    0,
    hairMaterialDefinitions.length,
    ...(restorePlan.resources.hairMaterials || [{
      id: DEFAULT_HAIR_MATERIAL_ID,
      name: "Default Purple",
      ...DEFAULT_HAIR_MATERIAL_SETTINGS,
      shader: hairState.state.defaultHairShader
    }]).map((material) => normalizeHairMaterialDefinition({ ...material }))
  );
  hairState.state.activeHairMaterialId = hairMaterialDefinitions.some((material) => material.id === hairState.state.activeHairMaterialId)
    ? hairState.state.activeHairMaterialId
    : hairMaterialDefinitions[0].id;
  materialApi.markHairMaterialPresetCustom();
  applyStrandSelectionState(restoreStrandSelection(restorePlan.strandSelection));
  sel.state.clumpViewportSelection = restorePlan.selection.clumpViewport;
  sel.state.selectedGuideId = restorePlan.selection.guideId;
  sel.state.selectedReferenceImageId = restorePlan.selection.referenceImageId;
  sel.state.activeCurveLatticeGuideId = restorePlan.selection.activeCurveLatticeGuideId;
  sel.state.selectedStrandGroup = restorePlan.selection.strandGroup;
  sel.state.selectedPoint = restorePlan.selection.point;
  sel.state.selectedCurveSurfaceController = restorePlan.selection.curveSurfaceController;
  sel.state.selectedCurveLatticePoint = restorePlan.selection.curveLatticePoint;
  sel.state.pendingPlacedLockId = restorePlan.selection.pendingPlacedLockId;
  setMirrorXEditing(preserveMirrorMode ? sculptState.state.mirrorXEditing : Boolean(state.mirrorXEditing));
}


function restoreSceneCollectionsForStateRestore(restorePlan, {
  deferRootAttachments = false,
  preservePlacement = false
} = {}) {
  restorePlan.scene.locks.forEach((snapshot) => restoreLock(snapshot, {
    deferRootAttachment: deferRootAttachments,
    remapRootAttachment: preservePlacement
  }));
  // Deep-reset pass: carve parent regions for branch children and offset their roots.
  locks.filter((lock) => branchHierarchy.branchChildrenFor(lock).length).forEach((parent) => {
    branchBridge.applyBranchRootRegionCarving(parent, parent.mesh.geometry);
  });
  locks.filter((lock) => lock.branchParentId).forEach((child) => branchBridge.applyBranchRootOffset(child));
  // Re-capture branch local state from the restored guide points so branchLocalPoints
  // matches the current parent frame. Stored branchLocalPoints can be stale relative
  // to a changed frame (e.g. the continuous branchRootBone.branchParentFrame), which made the first
  // rebuild (e.g. toggling Hierarchy editing) re-derive/snap the child elsewhere.
  locks.filter((lock) => lock.branchParentId).forEach((child) => branchRootBone.captureBranchLocalState(child));
  selectionSets.push(...normalizeSelectionSets(
    restorePlan.scene.selectionSets,
    locks.map((lock) => lock.id)
  ));
  restorePlan.scene.guides.forEach((snapshot) => restoreGuide(snapshot));
  restorePlan.scene.referenceImages.forEach((snapshot) => referenceHeadApi.addReferenceImage(snapshot, { select: false }));
}

function validateSelectionAfterStateRestore() {
  if (!locks.some((lock) => lock.id === sel.state.selectedId)) {
    clearStrandSelectionState();
    sel.state.clumpViewportSelection = false;
  }
  const unlockedIds = new Set(locks.filter((lock) => !lock.locked).map((lock) => lock.id));
  if (sel.state.selectedId && !unlockedIds.has(sel.state.selectedId)) {
    clearStrandSelectionState();
    sel.state.clumpViewportSelection = false;
  } else {
    sel.state.selectedStrandIds = new Set([...sel.state.selectedStrandIds].filter((id) => unlockedIds.has(id)));
  }
  if (!guides.some((guide) => guide.id === sel.state.selectedGuideId)) sel.state.selectedGuideId = undefined;
  if (!referenceImages.some((reference) => reference.id === sel.state.selectedReferenceImageId)) sel.state.selectedReferenceImageId = null;
  if (!guides.some((guide) => guide.id === sel.state.activeCurveLatticeGuideId && guide.type === "curve-lattice")) sel.state.activeCurveLatticeGuideId = null;
  if (!CURVE_LATTICE_FEATURE_ENABLED) {
    if (guides.some((guide) => guide.id === sel.state.selectedGuideId && guide.type === "curve-lattice")) {
      sel.state.selectedGuideId = undefined;
    }
    sel.state.activeCurveLatticeGuideId = null;
    sel.state.selectedCurveLatticePoint = null;
  }
  if (!locks.some((lock) => lock.id === sel.state.selectedPoint?.lockId && !lock.locked)) sel.state.selectedPoint = null;
  if (!locks.some((lock) => (
    lock.id === sel.state.selectedCurveSurfaceController?.lockId
    && lock.geometryType === "curve-surface"
    && sel.state.selectedCurveSurfaceController.index >= 0
    && sel.state.selectedCurveSurfaceController.index < lock.curveSurfaceColumns
  ))) sel.state.selectedCurveSurfaceController = null;
  if (!locks.some((lock) => lock.id === sel.state.pendingPlacedLockId)) sel.state.pendingPlacedLockId = null;
}

function reapplySelectionAfterStateRestore(restorePlan) {
  const pointToRestore = sel.state.selectedPoint ? { ...sel.state.selectedPoint } : null;
  const latticePointToRestore = sel.state.selectedCurveLatticePoint ? { ...sel.state.selectedCurveLatticePoint } : null;
  const controlsToRestore = restorePlan.selection.controlPoints;
  if (sel.state.selectedReferenceImageId) referenceHeadApi.selectReferenceImage(sel.state.selectedReferenceImageId);
  else if (sel.state.selectedId) selectLock(sel.state.selectedId, {
    individualClumpMember: !sel.state.clumpViewportSelection,
    selectedIds: [...sel.state.selectedStrandIds],
    curveSurfaceControllerIndex: sel.state.selectedCurveSurfaceController?.lockId === sel.state.selectedId
      ? sel.state.selectedCurveSurfaceController.index
      : undefined
  });
  else if (sel.state.selectedStrandGroup) {
    const groupToRestore = sel.state.selectedStrandGroup;
    sel.state.selectedStrandGroup = null;
    selectStrandGroup(groupToRestore);
  } else if (sel.state.selectedGuideId) guideApi.selectGuide(sel.state.selectedGuideId);
  else {
    guideApi.updateGuideControlsVisibility();
    renderLockList();
    updateAttributeEditorMode();
    updateSelectedPointLabel();
    materialApi.syncHairMaterialEditor();
  }
  if (pointToRestore) selectCurvePoint(pointToRestore.lockId, pointToRestore.pointIndex);
  else if (latticePointToRestore) {
    const guide = guides.find((item) => item.id === latticePointToRestore.guideId);
    if (guide) guideApi.selectCurveLatticePoint(guide, latticePointToRestore.pointIndex, false);
  }
  if (controlsToRestore.length > 1) {
    sel.state.selectedControlPoints = controlsToRestore.filter((point) => (
      point.type === "strand"
        ? locks.some((lock) => lock.id === point.lockId && !lock.locked && point.pointIndex < lock.points.length)
        : guides.some((guide) => guide.id === point.guideId && guideApi.curveLatticeEditablePoint(guide, point.pointIndex))
    ));
    locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
    guides.filter((guide) => guide.type === "curve-lattice").forEach(guideApi.updateCurveLatticeHandleColors);
    updateSelectedPointLabel();
  }
}

function finalizeStateRestore(state) {
  const editingCurveLattice = guideApi.getSelectedGuide()?.type === "curve-lattice";
  curveLatticeToggle.classList.toggle("active", editingCurveLattice);
  curveLatticeToggle.setAttribute("aria-pressed", String(editingCurveLattice));
  restoreRefreshes.run({ state });
}

function restoreState(state, {
  preservePlacement = false,
  deferRootAttachments = false,
  preserveMirrorMode = false
} = {}) {
  const restorePlan = createProjectRestorePlan(state, {
    regionIds: STRAND_GROUPS.map((group) => group.id),
    layerIds: HAIR_LAYERS.map((layer) => layer.id)
  });
  undo.state.restoringHistory = true;
  try {
    resetTransientInteractionsForStateRestore();
    resetEditableSceneForStateRestore();
    restoreSharedStateForStateRestore(state, restorePlan, { preserveMirrorMode });
    scalpBuilder.restoreAuthoredScalpForStateRestore(state, { preservePlacement });
    restoreSceneCollectionsForStateRestore(restorePlan, { deferRootAttachments, preservePlacement });
    validateSelectionAfterStateRestore();
    reapplySelectionAfterStateRestore(restorePlan);
    finalizeStateRestore(state);
  } finally {
    undo.state.restoringHistory = false;
  }
}

// File > New：把场景重置回**应用自己的初始状态**。
// 做法是复用 restoreState 而不是另写一条清空路径：restoreState 已经是「整场景换掉」的
// 唯一入口（打开项目 / undo / redo 都走它），它内部的 resetEditableSceneForStateRestore
// 已处理吹风预览互斥 + disposeAllEditableObjects + 清 locks/selectionSets/guides
// （见那里的注释，其中已把 "new project" 列为该路径的既定用例之一）。
// 基准取自 boot 时抓的 pristineProjectSnapshot（存的是 JSON 字符串，每次 New 重新
// parse 出全新对象，避免上一次 New 的还原过程污染基准）。
function startNewProject() {
  const pristine = projectState.state.pristineProjectSnapshot;
  if (!pristine) return false;
  try {
    restoreState(JSON.parse(pristine));
  } catch (error) {
    console.error("New project could not reset the scene", error);
    presetLibraryStatus.textContent = "Could not start a new project";
    return false;
  }
  // 头模 / 头皮引导资产**不在** snapshotState 里（它们随 .ahs 的 headAsset /
  // scalpGuideAsset 单独走），所以必须显式复位 —— 否则 New 之后仍留着上一个项目导入
  // 的自定义头模。这两段与 openHairProjectFile 处理「项目未带资产」时同规则（同步点：
  // modules/io/io-tail.js 的 headAssetOmitted / hasOwnProperty("scalpGuideAsset") 分支）。
  if (head.state.importedHeadAsset) {
    head.state.importedHeadAsset = null;
    referenceHeadApi.loadDefaultGuideModel().catch((error) => {
      console.warn("Could not restore the default head mesh", error);
    });
    document.querySelector("#importHeadMesh").title = "Import head mesh from an OBJ file";
    document.querySelector("#importFullBodyMesh").title = "Import a full body OBJ, scale it to seven head heights, and align its top to the scalp guide";
  }
  if (scalpState.state.importedScalpGuideAsset) {
    scalpState.state.importedScalpGuideAsset = null;
    scalpBuilder.setScalpGuideSource("default");
  }
  // New 是一条**新的 undo 基准**，不是一个可撤销的步骤（与 openHairProjectFile 的
  // 同名处理逐条一致）：否则 Ctrl+Z 会把用户拖回一个已被 dispose 的半场景。
  undoHistory.clear();
  redoHistory.clear();
  updateHistoryButtons();
  // 快速保存/快速导出的文件句柄必须**忘掉**：留着会让 New 之后的 Ctrl+S 静默覆盖
  // 上一个项目的文件（本功能最高风险项）。名字一并回到默认，避免另存对话框预填旧名。
  projectState.state.currentProjectName = "Untitled Hair Project";
  projectState.state.quickSaveFileHandle = null;
  projectState.state.quickSaveFileName = null;
  projectState.state.lastExport = null;
  projectState.state.quickExportFileHandle = null;
  presetLibraryStatus.textContent = "New project started";
  // 崩溃恢复快照：New 之后场景已与快照无关，清掉以免下次启动提示恢复一个用户刚丢弃的项目。
  clearAcknowledgedRecovery().catch((error) => {
    console.warn("Could not clear project recovery data", error);
  });
  return true;
}

function disposeAllEditableObjects() {
  restoreUvCheckerPreview();
  referenceHeadApi.clearReferenceImages();
  polyToolsApi.clearPolyFillPreview();
  setHoveredStrandWidthEdge(null);
  locks.forEach((lock) => {
    hairGroup.remove(lock.mesh);
    curveGroup.remove(lock.curveObjects.group);
    lock.mesh.geometry.dispose();
    removeUvCheckerFromLock(lock);
    lock.mesh.material.dispose();
    lock.selectionOutline?.material.dispose();
    lock.wireOverlay?.geometry.dispose();
    lock.wireOverlay?.material.dispose();
    disposeCurveObjects(lock);
  });
  guides.forEach((guide) => {
    removeGuideObjects(guide);
    disposeGuide(guide);
  });
}

function restoreLock(snapshot, { deferRootAttachment = false, remapRootAttachment = false } = {}) {
  const legacyUniformLayerOffset = snapshot.layerOffsetRootFactorApplied == null;
  const surfaceColumns = normalizeSurfaceLatticeCount(snapshot.surfaceColumns, DEFAULT_SURFACE_LATTICE_COLUMNS);
  const surfaceRows = normalizeSurfaceLatticeCount(snapshot.surfaceRows, DEFAULT_SURFACE_LATTICE_ROWS);
  const curveSurfaceColumns = Math.max(1, Math.round(Number(snapshot.curveSurfaceColumns) || 1));
  const curveSurfaceRows = Math.max(2, Math.round(Number(snapshot.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  const lock = {
    ...snapshot,
    materialId: snapshot.materialId || DEFAULT_HAIR_MATERIAL_ID,
    locked: Boolean(snapshot.locked),
    objectTransform: normalizeStrandObjectTransform(snapshot.objectTransform),
    liveSurfaceGuide: Boolean(snapshot.liveSurfaceGuide),
    points: (snapshot.points || []).map(dataToVector),
    polyFaces: normalizePolyFaces(snapshot.points || [], snapshot.polyFaces),
    pointWidths: [...(snapshot.pointWidths || (snapshot.points || []).map(() => 1))],
    pointScales: (snapshot.pointScales || (snapshot.points || []).map(() => ({ x: 1, z: 1 })))
      .map((scale) => ({ x: scale.x, z: scale.z })),
    pointTwists: [...(snapshot.pointTwists || (snapshot.points || []).map(() => 0))],
    sweepProfile: (snapshot.sweepProfile || DEFAULT_SWEEP_PROFILE).map((point) => ({ ...point })),
    taperCurve: normalizeTaperCurve(snapshot.taperCurve, snapshot),
    depthCurve: normalizeTaperCurve(snapshot.depthCurve, snapshot),
    taperCurveSecondary: normalizeTaperCurve(snapshot.taperCurveSecondary || snapshot.taperCurve, snapshot),
    depthCurveSecondary: normalizeTaperCurve(snapshot.depthCurveSecondary || snapshot.depthCurve, snapshot),
    asymmetricWidthCurve: Boolean(snapshot.asymmetricWidthCurve),
    asymmetricDepthCurve: Boolean(snapshot.asymmetricDepthCurve),
    centerAsymmetricProfile: Boolean(snapshot.centerAsymmetricProfile),
    widthScale: Number(snapshot.widthScale ?? 1),
    depthScale: Number(snapshot.depthScale ?? 1),
    depth: Number(snapshot.depth ?? 0.16),
    profileTrimLeft: THREE.MathUtils.clamp(Number(snapshot.profileTrimLeft ?? 0), 0, 1),
    profileTrimRight: THREE.MathUtils.clamp(Number(snapshot.profileTrimRight ?? 0), 0, 1),
    profileTrimRoundness: THREE.MathUtils.clamp(Number(snapshot.profileTrimRoundness ?? 1), 0, 1),
    hairCard: Boolean(snapshot.hairCard),
    strandSplitEnabled: Boolean(snapshot.strandSplitEnabled),
    strandSplitPosition: THREE.MathUtils.clamp(Number(snapshot.strandSplitPosition ?? 0), -0.8, 0.8),
    strandSplitHeight: THREE.MathUtils.clamp(Number(snapshot.strandSplitHeight ?? 0.3), 0.02, 0.8),
    strandSplits: cloneStrandSplits(
      snapshot.strandSplits,
      THREE.MathUtils.clamp(Number(snapshot.strandSplitPosition ?? 0), -0.8, 0.8),
      THREE.MathUtils.clamp(Number(snapshot.strandSplitHeight ?? 0.3), 0.02, 0.8),
      STRAND_SPLIT_MAX
    ),
    strandTipStart: THREE.MathUtils.clamp(Number(snapshot.strandTipStart ?? 0.75), 0.2, 0.95),
    strandTip: strandTipFromData(snapshot.strandTip, snapshot),
    strandSplitBones: strandSplitBonesFromData(snapshot.strandSplitBones, snapshot),
    profileOffset: Number(snapshot.profileOffset ?? 0),
    geometryType: snapshot.geometryType === "surface" && snapshot.points?.length !== surfaceColumns * surfaceRows
      ? "panel"
      : snapshot.geometryType === "curve-surface" && snapshot.points?.length !== curveSurfaceColumns * curveSurfaceRows
        ? "strand"
        : ["braid", "panel", "surface", "curve-surface", "poly"].includes(snapshot.geometryType) ? snapshot.geometryType : "strand",
    surfaceColumns: snapshot.geometryType === "surface" ? surfaceColumns : null,
    surfaceRows: snapshot.geometryType === "surface" ? surfaceRows : null,
    curveSurfaceColumns: snapshot.geometryType === "curve-surface" ? curveSurfaceColumns : null,
    curveSurfaceRows: snapshot.geometryType === "curve-surface" ? curveSurfaceRows : null,
    curveSurfaceSymmetric: snapshot.geometryType === "curve-surface" && Boolean(snapshot.curveSurfaceSymmetric),
    curveSurfaceCompoundProfile: snapshot.geometryType === "curve-surface"
      && Boolean(snapshot.curveSurfaceCompoundProfile),
    compoundBridgeLoops: snapshot.geometryType === "curve-surface" && snapshot.curveSurfaceCompoundProfile
      ? THREE.MathUtils.clamp(Math.round(Number(snapshot.compoundBridgeLoops) || 0), 0, 8)
      : null,
    compoundBridgeSmoothing: snapshot.geometryType === "curve-surface" && snapshot.curveSurfaceCompoundProfile
      ? THREE.MathUtils.clamp(Number(snapshot.compoundBridgeSmoothing) || 0, 0, 1)
      : null,
    curveSurfaceCenterCurve: snapshot.geometryType === "curve-surface"
      ? THREE.MathUtils.clamp(Math.round(Number(snapshot.curveSurfaceCenterCurve) || 0), 0, curveSurfaceColumns - 1)
      : null,
    curveSurfaceStripWidth: snapshot.geometryType === "curve-surface"
      ? Math.max(0.001, Number(snapshot.curveSurfaceStripWidth) || DEFAULT_CURVE_SURFACE_STRIP_WIDTH)
      : null,
    curveSurfaceSide: snapshot.geometryType === "curve-surface" && snapshot.curveSurfaceSide
      ? dataToVector(snapshot.curveSurfaceSide).normalize()
      : null,
    curveSurfaceSource: curveSurfaceCreate.cloneCurveSurfaceSource(snapshot.curveSurfaceSource),
    braidMeshPreset: snapshot.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET,
    braidWidth: Number(snapshot.braidWidth ?? snapshot.width ?? 0.34),
    braidDepth: Number(snapshot.braidDepth ?? 0.44),
    braidSegmentLength: Number(snapshot.braidSegmentLength ?? 0.28),
    braidRotation: Number(snapshot.braidRotation ?? 0),
    panelThickness: Number(snapshot.panelThickness ?? panelCreationDefaults.panelThickness),
    panelLengthLoops: Number(snapshot.panelLengthLoops ?? panelCreationDefaults.panelLengthLoops),
    panelWidthLoops: THREE.MathUtils.clamp(Math.max(
      Number(snapshot.panelWidthLoops ?? panelCreationDefaults.panelWidthLoops),
      clonePanelSplits(snapshot.panelSplits, snapshot.panelSplitHeight).length + 1
    ), snapshot.geometryType === "surface" ? 2 : 3, 24),
    panelCurvature: snapshot.geometryType === "surface"
      ? 0
      : Number(snapshot.panelCurvature ?? panelCreationDefaults.panelCurvature),
    panelLeftEdgeTrim: Number(snapshot.panelLeftEdgeTrim ?? panelCreationDefaults.panelLeftEdgeTrim),
    panelRightEdgeTrim: Number(snapshot.panelRightEdgeTrim ?? panelCreationDefaults.panelRightEdgeTrim),
    panelTipCurve: snapshot.geometryType === "surface"
      ? 0
      : THREE.MathUtils.clamp(Number(snapshot.panelTipCurve ?? panelCreationDefaults.panelTipCurve), -1, 1),
    panelTipLoops: snapshot.geometryType === "surface"
      ? 0
      : THREE.MathUtils.clamp(Math.round(Number(snapshot.panelTipLoops ?? panelCreationDefaults.panelTipLoops)), 0, 16),
    // Scalp Conform：amount 在 surface 上恒 0（与上面 panelTipCurve/panelTipLoops 同规则）；
    // gap 照常钳位反序列化，旧档缺字段时回落到中性默认值。
    // **旧档兼容**：0.2.135 及更早的 `panelHemisphere*`、以及 0.2.136/137 的
    // `panelScalpConformRange` / `panelScalpConformCylinder` 都**刻意不迁移** —— 三代模型
    // （法线球冠 / 世界空间投影 / 绕竖直轴 Bend）语义互不相通，把旧数值灌进新字段只会得到
    // 与作者当年意图无关的形状。amount 与 gap 同名同义，照常读取；被删的两个字段直接忽略。
    panelScalpConformAmount: snapshot.geometryType === "surface"
      ? 0
      : THREE.MathUtils.clamp(Number(snapshot.panelScalpConformAmount ?? panelCreationDefaults.panelScalpConformAmount), -1, 1),
    panelScalpConformGap: THREE.MathUtils.clamp(
      Number(snapshot.panelScalpConformGap ?? panelCreationDefaults.panelScalpConformGap),
      0,
      0.5
    ),
    panelSplitEnabled: snapshot.panelSplitEnabled !== false,
    panelSplitSnapToLoops: snapshot.panelSplitSnapToLoops !== false,
    panelSplitHeight: Number(snapshot.panelSplitHeight ?? panelCreationDefaults.panelSplitHeight),
    panelSplits: clonePanelSplits(snapshot.panelSplits, snapshot.panelSplitHeight).map((split) => ({
      ...split,
      height: snapshot.panelSplitSnapToLoops !== false
        ? snapPanelSplitHeight(split.height, snapshot.panelLengthLoops)
        : split.height
    })),
    panelSplitGap: Number(snapshot.panelSplitGap ?? panelCreationDefaults.panelSplitGap),
    splitBones: Array.isArray(snapshot.splitBones) ? splitBonesFromData(snapshot.splitBones, snapshot.panelSplits, snapshot) : null,
    bones: Array.isArray(snapshot.bones) ? bonesFromData(snapshot.bones, snapshot) : null,
    curlEnabled: Boolean(snapshot.curlEnabled),
    curlCount: THREE.MathUtils.clamp(Number(snapshot.curlCount ?? 4), 0.25, 24),
    curlDisplacement: THREE.MathUtils.clamp(Number(snapshot.curlDisplacement ?? 0.18), 0, 1.2),
    surfaceNormalInfluence: THREE.MathUtils.clamp(Number(snapshot.surfaceNormalInfluence ?? 0), 0, 1),
    pointSurfaceNormals: snapshot.pointSurfaceNormals?.map((normal) => normal ? dataToVector(normal).normalize() : null) || [],
    dynamicDensity: Boolean(snapshot.dynamicDensity),
    densityAggression: THREE.MathUtils.clamp(Number(snapshot.densityAggression ?? 0.5), 0, 1),
    twistDensity: THREE.MathUtils.clamp(Number(snapshot.twistDensity ?? 0), 0, 1),
    rootScalpOffset: Number(snapshot.rootScalpOffset ?? 0),
    strandRotation: THREE.MathUtils.clamp(Number(snapshot.strandRotation ?? 0), -180, 180),
    twistCurve: normalizeEnvelopeCurve(
      snapshot.twistCurve,
      DEFAULT_TWIST_CURVE,
      -TWIST_CURVE_VALUE_MAX,
      TWIST_CURVE_VALUE_MAX
    ),
    rootAttachmentEnabled: snapshot.geometryType !== "poly" && snapshot.rootAttachmentEnabled !== false,
    hairLayer: normalizeHairLayer(snapshot.hairLayer),
    layerOffsetApplied: Number(snapshot.layerOffsetApplied ?? 0),
    layerOffsetRootFactorApplied: Number(snapshot.layerOffsetRootFactorApplied ?? 1),
    clumpId: snapshot.clumpId || null,
    clumpName: snapshot.clumpName || null,
    clumpGuide: Boolean(snapshot.clumpGuide),
    clumpGuideId: snapshot.clumpGuideId || null,
    clumpInfluence: Number(snapshot.clumpInfluence ?? 1),
    clumpSpread: Number(snapshot.clumpSpread ?? 1),
    clumpDepthSpread: Number(snapshot.clumpDepthSpread ?? 1),
    clumpTipFan: Number(snapshot.clumpTipFan ?? 0),
    clumpRoll: Number(snapshot.clumpRoll ?? 0),
    clumpStrandWidth: Number(snapshot.clumpStrandWidth ?? 1),
    clumpStrandDepth: Number(snapshot.clumpStrandDepth ?? 1),
    clumpVariation: Number(snapshot.clumpVariation ?? 0),
    proceduralParentHidden: Boolean(snapshot.proceduralParentHidden),
    proceduralDrawGuide: Boolean(snapshot.proceduralDrawGuide),
    proceduralAccessory: Boolean(snapshot.proceduralAccessory),
    proceduralAccessoryIndex: snapshot.proceduralAccessoryIndex == null
      ? null
      : Math.max(0, Math.round(Number(snapshot.proceduralAccessoryIndex))),
    proceduralAccessoryCount: snapshot.proceduralAccessoryCount == null
      ? null
      : THREE.MathUtils.clamp(Math.round(Number(snapshot.proceduralAccessoryCount)), 0, 16),
    proceduralAccessoryRadius: snapshot.proceduralAccessoryRadius == null
      ? null
      : THREE.MathUtils.clamp(Number(snapshot.proceduralAccessoryRadius), 0, 2),
    proceduralBranch: Boolean(snapshot.proceduralBranch),
    proceduralBranchIndex: snapshot.proceduralBranchIndex == null
      ? null
      : Math.max(0, Math.round(Number(snapshot.proceduralBranchIndex))),
    proceduralBranchCount: snapshot.proceduralBranchCount == null
      ? null
      : THREE.MathUtils.clamp(Math.round(Number(snapshot.proceduralBranchCount)), 0, 64),
    proceduralBranchLength: snapshot.proceduralBranchLength == null
      ? null
      : THREE.MathUtils.clamp(Number(snapshot.proceduralBranchLength), 0.1, 3),
    proceduralBranchLengthCurve: normalizeTaperCurve(
      snapshot.proceduralBranchLengthCurve || DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
    ),
    proceduralBranchShapeCurve: normalizeTaperCurve(
      snapshot.proceduralBranchShapeCurve || DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
    ),
    proceduralBranchTipOffset: snapshot.proceduralBranchTipOffset == null
      ? null
      : THREE.MathUtils.clamp(Number(snapshot.proceduralBranchTipOffset), 0, 2),
    clumpRestPoints: snapshot.clumpRestPoints?.map(dataToVector) || null,
    clumpGuideRestPoints: snapshot.clumpGuideRestPoints?.map(dataToVector) || null,
    clumpRestTwists: snapshot.clumpRestTwists ? [...snapshot.clumpRestTwists] : null,
    clumpGuideRestTwists: snapshot.clumpGuideRestTwists ? [...snapshot.clumpGuideRestTwists] : null,
    clumpRestScales: snapshot.clumpRestScales?.map((scale) => ({ x: scale.x, z: scale.z })) || null,
    clumpGuideRestScales: snapshot.clumpGuideRestScales?.map((scale) => ({ x: scale.x, z: scale.z })) || null,
    clumpParameterStart: THREE.MathUtils.clamp(Number(snapshot.clumpParameterStart ?? 0), 0, 1),
    clumpParameterEnd: THREE.MathUtils.clamp(
      Number(snapshot.clumpParameterEnd ?? 1),
      THREE.MathUtils.clamp(Number(snapshot.clumpParameterStart ?? 0), 0, 1),
      1
    ),
    clumpShapeCurveInheritance: Boolean(snapshot.clumpShapeCurveInheritance),
    branchParentId: snapshot.branchParentId || null,
    branchParentParameter: THREE.MathUtils.clamp(Number(snapshot.branchParentParameter ?? 0), 0, 1),
    branchLocalPoints: snapshot.branchLocalPoints?.map(dataToVector) || null,
    branchLocalSurfaceNormals: snapshot.branchLocalSurfaceNormals?.map((normal) => normal ? dataToVector(normal) : null) || null,
    branchRootRegion: branchRegion.cloneBranchRootRegion(snapshot.branchRootRegion) || (snapshot.branchParentId ? branchRegion.branchRootRegionFromParam(snapshot.branchParentParameter ?? 0) : null),
    branchCurvesAuthored: Boolean(snapshot.branchCurvesAuthored),
    branchSweepStartT: THREE.MathUtils.clamp(Number(snapshot.branchSweepStartT ?? 0.1), 0.02, 0.6),
    rootSurfacePoint: snapshot.rootSurfacePoint ? dataToVector(snapshot.rootSurfacePoint) : null,
    rootSurfaceNormal: snapshot.rootSurfaceNormal ? dataToVector(snapshot.rootSurfaceNormal).normalize() : null,
    groupLatticeBasePoints: snapshot.groupLatticeBasePoints?.map(dataToVector) || null,
    placementFrame: snapshot.placementFrame ? frameFromData(snapshot.placementFrame) : null
  };
  if (lock.branchRootRegion) {
    branchRegion.normalizeBranchRootRegion(lock);
    branchRegion.syncBranchRootRegionOffsets(lock);
  }
  lock.rootAttachment = lock.rootAttachmentEnabled && !deferRootAttachment
    ? ioApi.rootAttachmentFromData(snapshot.rootAttachment || null, lock, {
      resolveSurface: remapRootAttachment
    })
    : null;
  lock.rootSurfacePoint = lock.rootAttachment?.surfacePoint?.clone() || lock.rootSurfacePoint;
  lock.rootSurfaceNormal = lock.rootAttachment?.normal?.clone() || lock.rootSurfaceNormal;
  if (remapRootAttachment) ioApi.applyRootAttachmentLocalCurves(lock);
  lock.radialSegments = lock.radialSegments || 10;
  lock.lengthSegments = lock.lengthSegments || 26;
  if (legacyUniformLayerOffset && lock.geometryType !== "poly") applyLayerOffset(lock, lock.layerOffsetApplied);
  lock.mesh = new THREE.Mesh(
    strandGeometryApi.createHairGeometry(lock),
    materialApi.createHairMaterial(lock)
  );
  lock.mesh.material.side = lock.branchRootRegion || materialApi.strandUsesDoubleSidedMaterial(lock)
    ? THREE.DoubleSide
    : THREE.FrontSide;
  lock.selectionOutline = materialApi.createStrandSelectionOutline(lock.mesh.geometry);
  lock.mesh.add(lock.selectionOutline);
  lock.hoverOutline = materialApi.createStrandSelectionOutline(lock.mesh.geometry, {
    color: 0xffb45e,
    opacity: 0.72,
    renderOrder: 2
  });
  lock.mesh.add(lock.hoverOutline);
  lock.wireOverlay = createHairTopologyOverlay(lock.mesh.geometry);
  lock.mesh.add(lock.wireOverlay);
  lock.mesh.castShadow = true;
  lock.mesh.userData.lockId = lock.id;
  lock.curveObjects = createCurveObjects(lock);
  locks.push(lock);
  ensureUvCheckerForLock(lock);
  hairGroup.add(lock.mesh);
  lock.mesh.visible = strandVisibleForDisplay(lock);
  clumpProceduralApi.syncProceduralParentVisibility(lock);
  curveGroup.add(lock.curveObjects.group);
}

function restoreGuide(snapshot) {
  if (snapshot.type === "capsule") {
    guideApi.addCapsuleGuide({
      ...snapshot,
      start: dataToVector(snapshot.start),
      end: dataToVector(snapshot.end)
    }, { deferUi: true });
    return;
  }
  if (snapshot.type === "curve-lattice") {
    guideApi.addCurveLattice({
      ...snapshot,
      points: snapshot.points.map(dataToVector),
      rootPoints: snapshot.rootPoints?.map(dataToVector),
      deformRestPoints: snapshot.deformRestPoints?.map(dataToVector),
      deformRestRootPoints: snapshot.deformRestRootPoints?.map(dataToVector)
    }, { deferUi: true });
    return;
  }
  const guide = { ...snapshot };
  guide.mesh = new THREE.Mesh(
    guideApi.createGuideGeometry(guide),
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
  guides.push(guide);
  guideSurfaceGroup.add(guide.mesh, guide.wire);
}

function vectorToData(vector) {
  return { x: vector.x, y: vector.y, z: vector.z };
}

function dataToVector(data) {
  return new THREE.Vector3(data.x, data.y, data.z);
}
// IO tail api deps batch (refactor batch C1): all deps are defined by this point (last dep:
// dataToVector; ioApi.openHairProjectFile also needs fileApi + restoreState defined earlier); the
// batch takes effect here, before the bootstrap init and all runtime open/import/remember calls.
Object.assign(ioDeps, {
  scalpBuilder, layerOffsetForLock, layerRootOffsetFactor, normalizeHairLayer,
  vectorToData, dataToVector,
  fileApi, documentLocalizer, saveLanguage, languageSelect,
  braidCreationDefaults, braidToolPresetInput, creationPresets, shapePresets,
  projectState, hairState: hairState.state, sel: sel.state, ui: ui.state,
  draw: draw.state, miscState: miscState.state, guideState: guideState.state,
  viewportState: viewportState.state, scalpState, head,
  radialMenuApi, clumpProceduralApi, presetLibraryApi, referenceHeadApi, materialApi,
  restoreState, undoHistory, redoHistory, updateHistoryButtons,
  frameViewportBounds, closeAppMenus, SUPPORTED_REFERENCE_IMAGE_TYPES,
  setNavigationTipsEnabled, setNavigationStyle, setCameraSmoothingEnabled, setCameraSmoothingStrength,
  setToolTipsEnabled, setCompactToolButtonsEnabled, setViewportStatisticsEnabled,
  setTwistCurveAllStrandsPreviewEnabled, setLayerColorShiftsEnabled, setOutlinerFolderColorsEnabled,
  setSidePanelStyle, setGlassPanelColor, setOutlinerFolderColorOpacity,
  setSideNamingPerspective, setControlPointDisplaySize, setViewportBackgroundColor, setDefaultHairShader,
  setAutosaveEnabled, setAutosaveInterval, recovery: recovery.state,
  clearAcknowledgedRecovery,
  presetLibraryStatus, hairProjectFileInput, recentProjectsSubmenu,
  preferencesAndPresetsFile, preferencesBackupStatus,
  dropImportDialog, dropImportForm, dropImportDialogTitle, dropImportDescription,
  dropImportFileName, dropImportWarning, dropObjTargetChoices, confirmDropImport
});

function frameToData(frame) {
  return {
    root: vectorToData(frame.root),
    normal: vectorToData(frame.normal),
    flow: vectorToData(frame.flow),
    side: vectorToData(frame.side),
    sideSign: frame.sideSign,
    gravity: vectorToData(frame.gravity),
    orientationStrength: frame.orientationStrength || 0
  };
}

function frameFromData(data) {
  return {
    root: dataToVector(data.root),
    normal: dataToVector(data.normal),
    flow: dataToVector(data.flow),
    side: dataToVector(data.side),
    sideSign: data.sideSign,
    gravity: dataToVector(data.gravity),
    orientationStrength: data.orientationStrength || 0
  };
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function fitPointAttributes(lock, count) {
  const oldWidths = lock.pointWidths || [1];
  const oldScales = lock.pointScales || [{ x: 1, z: 1 }];
  const oldTwists = lock.pointTwists || [0, 0];
  const oldSurfaceNormals = lock.pointSurfaceNormals || [];
  lock.pointWidths = [];
  lock.pointScales = [];
  lock.pointTwists = [];
  lock.pointSurfaceNormals = [];
  for (let i = 0; i < count; i += 1) {
    const t = count <= 1 ? 0 : i / (count - 1);
    const scale = {
      x: sampleScale(oldScales, t, "x"),
      z: sampleScale(oldScales, t, "z")
    };
    lock.pointScales.push(scale);
    lock.pointWidths.push(sampleArray(oldWidths, t) || (scale.x + scale.z) * 0.5);
    lock.pointTwists.push(sampleArray(oldTwists, t));
    if (oldSurfaceNormals.length) {
      const scaled = t * Math.max(0, oldSurfaceNormals.length - 1);
      const lower = Math.floor(scaled);
      const upper = Math.min(oldSurfaceNormals.length - 1, lower + 1);
      const before = oldSurfaceNormals[lower] || oldSurfaceNormals[upper];
      const after = oldSurfaceNormals[upper] || before;
      lock.pointSurfaceNormals.push(before?.clone().lerp(after, scaled - lower).normalize() || null);
    }
  }
}

function rebuildCurveObjects(lock) {
  if (lock.curveObjects) {
    curveGroup.remove(lock.curveObjects.group);
    disposeCurveObjects(lock);
    lock.curveObjects = null;
  }
  lock.curveObjects = createCurveObjects(lock);
  curveGroup.add(lock.curveObjects.group);
  updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId });
  if (sel.state.selectedSurfaceObjectAnchorId === lock.id) attachSurfaceObjectAnchorTransform(lock);
}

function createCurvePoints(lock) {
  return [
    new THREE.Vector3(lock.x, lock.y, lock.z),
    new THREE.Vector3(lock.x + lock.curve * 0.18, lock.y - lock.length * 0.34, lock.z + 0.1),
    new THREE.Vector3(lock.x + lock.curve * 0.34, lock.y - lock.length * 0.72, lock.z),
    new THREE.Vector3(lock.x + lock.curve * 0.52, lock.y - lock.length, lock.z - 0.08)
  ];
}














// Keep the region's intended center and edge offsets in sync with the cross points.
// The offsets are what recenter (root slide / rect move) preserves, so clamping at
// the [0,1] boundary during a drag cannot permanently collapse the region into a
// thin line that needs to be re-dragged back open.

// Shift the branch region's center to follow the child root (u and v), so the
// selection panel's relative position and the direct-bridge region stay in sync.



// 4 edge control points (up/down/left/right) define the rectangular carve region on the
// parent surface (u = along length, v = across width). The center RootCtrl point was
// dropped in 2.4u - only the 4 light-blue boundary points select the rectangular region.




// Update one region control point from parent-surface params, then rebuild the child
// geometry and re-carve the parent.
// Keep the region rectangle ordered so drag clamps never snap a point to the
// opposite side: up must be smaller u than down, left larger v than right. Old
// files (and boundary clamps) can leave inverted or collapsed pairs.


// ---- 2D branch region editor (u/v plane, like the width/depth curve panel) ----
// ---- Branch region panel view navigation: pan/zoom follow the active navigation
// style (Houdini Alt+MMB pan + Alt+RMB zoom; Blender Shift/Ctrl+MMB; Anime Hair
// Studio Alt+RMB pan); wheel always zooms; Reset Zoom restores. ----
// Map the viewport navigation style onto the 2D region panel instead of always
// copying Houdini's Alt+RMB zoom. Alt+MMB pan stays available in every style.


// Sweep-start control: drag the yellow handle along the child guide to set where
// the sweep (and therefore the bridge) starts.

// 3D markers for the 4 region points on the parent surface (show points on mesh).

// Cache of the parent-surface grid region for a child's branchRootRegion.
// Recomputed only when the control points change; parent moves never touch it.
// Grid metadata for creased profiles: the column that no face edge starts at.


// World positions of the 4 region edge control points on the parent surface grid.
// Number of real top edges of the carved region (dedupes crease columns). The
// child ring's lateral topology follows this so the top/bottom bands match 1:1.


// Remove the parent-surface quads covered by child branchRootRegions (procedural,
// re-applied on every rebuild so it survives .ahs load which stores only guide params).

// Offset the child root to the center of its carved parent region (half-cell nudge).



























// Placement flow (cluster E, refactor batch B2-2) extracted to modules/geometry/placement.js
// (createPlacementApi); all app.js call sites below rewired to placementApi.*.
// 提取记录（历史参考，非活契约）：scalpActiveVertexIndices 迁出前在 app.js 是裸引用，迁移时
// 改为 deps.scalpState 实时读取，属顺带修复而非本批目标。

function deselectStrands() {
  guideApi.clearMultiPointSelection();
  clearStrandSelectionState();
  sculptState.state.panelSplitSelection = null;
  sculptState.state.strandSplitSelection = null;
  sel.state.selectedCurveSurfaceController = null;
  sel.state.clumpViewportSelection = false;
  sel.state.selectedStrandGroup = null;
  sel.state.selectedGuideId = undefined;
  sel.state.selectedPoint = null;
  sel.state.selectedCurveLatticePoint = null;
  curveLatticeToggle.classList.remove("active");
  curveLatticeToggle.setAttribute("aria-pressed", "false");
  filterCurveLatticesToGroup(null);
  refreshStrandSelectionConsumers({ updateTopology: true });
}

function beginSelectionMarquee(event, surface = null, selectionMode = "replace") {
  const validModifier = selectionMode === "add"
    ? event.shiftKey && !event.ctrlKey
    : selectionMode === "remove"
      ? event.ctrlKey && !event.shiftKey
      : !event.shiftKey && !event.ctrlKey;
  if (event.button !== 0 || !validModifier || event.altKey || event.metaKey) return false;
  sculptState.state.selectionMarqueeDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    currentX: event.clientX,
    currentY: event.clientY,
    surface,
    selectionMode,
    active: false
  };
  sculptState.state.emptySelectionPointer = null;
  selectionMarquee.classList.add("hidden");
  updateCurvePointTopologyCursor(event);
  updateInteractionLocks();
  return true;
}

function beginAltOrbit(event) {
  if (!["anime-hair-studio", "houdini"].includes(viewportState.state.navigationStyle) || event.button !== 0 || !event.altKey) return;
  if (multiCameraOrthographicViewActive()) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  sculptState.state.altOrbitDrag = { pointerId: event.pointerId };
  controls.enableRotate = true;
  if (sculptState.state.selectionMarqueeDrag) {
    sculptState.state.selectionMarqueeDrag = null;
    selectionMarquee.classList.add("hidden");
  }
  updateInteractionLocks();
  event.preventDefault();
}

function beginBlenderNavigation(event) {
  if (viewportState.state.navigationStyle !== "blender" || event.button !== 1 || event.metaKey) return;
  const modifierCount = Number(event.shiftKey) + Number(event.ctrlKey) + Number(event.altKey);
  if (modifierCount > 1) return;
  const action = event.altKey
    ? "snap"
    : event.shiftKey
      ? "pan"
      : event.ctrlKey
        ? "zoom"
        : "orbit";
  if (multiCameraOrthographicViewActive() && (action === "orbit" || action === "snap")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  sculptState.state.blenderNavigationDrag = { pointerId: event.pointerId, action };
  viewportState.state.activeViewportPointer = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    buttons: event.buttons,
    buttonMask: 4
  };
  if (action === "pan") {
    setSculptBrushShiftSmoothHeld(false);
    draw.state.polyShiftPreviewHeld = false;
    polyToolsApi.clearPolyFillPreview();
  }
  if (action === "snap") {
    sculptState.state.altOrbitDrag = { pointerId: event.pointerId, navigationStyle: "blender" };
    controls.enableRotate = false;
    startViewSnap(event.pointerId, event.clientX, event.clientY);
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  // OrbitControls converts a modified ROTATE binding into PAN internally.
  // Assigning PAN here would make Shift reverse it back to ROTATE.
  controls.mouseButtons.MIDDLE = action === "zoom"
    ? THREE.MOUSE.DOLLY
    : THREE.MOUSE.ROTATE;
  controls.enableRotate = action === "orbit";
  if (action === "orbit") {
    sculptState.state.altOrbitDrag = { pointerId: event.pointerId, navigationStyle: "blender" };
  }
  updateInteractionLocks();
  event.preventDefault();
}

function endBlenderNavigation(event) {
  if (!sculptState.state.blenderNavigationDrag || event.pointerId !== sculptState.state.blenderNavigationDrag.pointerId) return;
  sculptState.state.blenderNavigationDrag = null;
  configureNavigationMouseButtons();
  if (!sculptState.state.altOrbitDrag) controls.enableRotate = false;
  updateInteractionLocks();
}

function prepareSelectPointerCapture(event) {
  if (sel.state.activeTool !== "select" || event.button !== 0 || event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;
  sculptState.state.selectPointerCapture = { pointerId: event.pointerId };
  updateInteractionLocks();
}

function endSelectPointerCapture(event) {
  if (!sculptState.state.selectPointerCapture || event.pointerId !== sculptState.state.selectPointerCapture.pointerId) return;
  sculptState.state.selectPointerCapture = null;
  updateInteractionLocks();
}

function applyAltClickCandidate(candidate) {
  if (!candidate) return false;
  if (candidate.kind === "tip") {
    const lock = locks.find((item) => item.id === candidate.lockId);
    // 几何门控走 segmentBoneHost（0.2.126）：panel/surface 与开启 split 的普通发丝都可以
    // Alt+点击快速切换到悬停的发尖子骨骼。段号写 host.segmentIndexKey，刷新交给
    // syncSegmentControlsForLock 再分派 —— 与 bone-interaction.js 的 selectTipSubBone 同规则
    // （两处都是「写 tipSelection + 写对应段号 + 刷新对应控件」，改一处要看另一处）。
    const host = lock ? segmentBoneHost(lock) : null;
    if (!host) return false;
    const altCur = sculptState.state.tipSelection;
    if (altCur && altCur.lockId === lock.id && altCur.segmentIndex === candidate.segmentIndex) {
      sculptState.state.tipSelection = null;
    } else {
      sculptState.state.tipSelection = { lockId: lock.id, segmentIndex: candidate.segmentIndex };
      sculptState.state[host.segmentIndexKey] = candidate.segmentIndex;
    }
    updateCurveObjects(lock, { visible: true });
    segmentApi.syncSegmentControlsForLock(lock);
    return true;
  }
  if (candidate.kind === "strand") {
    const target = locks.find((item) => item.id === candidate.lockId);
    if (target && target.id !== getSelectedLock()?.id) {
      selectLock(target.id, {});
      return true;
    }
  }
  return false;
}

function finishBrushAltClick(event) {
  const candidate = sculptState.state.altClickCandidate;
  sculptState.state.altClickCandidate = null;
  if (!candidate || candidate.pointerId !== event.pointerId) return;
  // Only a real click (no drag) switches; alt+drag stays navigation.
  if (Math.hypot(event.clientX - candidate.startX, event.clientY - candidate.startY) >= 6) return;
  if (applyAltClickCandidate(candidate)) {
    event.preventDefault();
    // Do NOT stopImmediatePropagation: endAltOrbit (registered right after) must still
    // run to clear altOrbitDrag, otherwise the next pointermove would orbit the camera.
  }
}

function endAltOrbit(event) {
  if (!sculptState.state.altOrbitDrag || event.pointerId !== sculptState.state.altOrbitDrag.pointerId) return;
  sculptState.state.altOrbitDrag = null;
  controls.enableRotate = false;
  updateInteractionLocks();
}

function dollyCameraByDrag(delta) {
  const cam = controls.object;
  const zoomScale = Math.pow(0.95, controls.zoomSpeed * Math.abs(delta) * 0.01);
  if (cam.isPerspectiveCamera) {
    const offset = cam.position.clone().sub(controls.target);
    const distance = offset.length() || 1;
    const nextDistance = THREE.MathUtils.clamp(
      delta >= 0 ? distance / zoomScale : distance * zoomScale,
      controls.minDistance,
      controls.maxDistance
    );
    offset.setLength(nextDistance);
    cam.position.copy(controls.target).add(offset);
  } else if (cam.isOrthographicCamera) {
    cam.zoom = THREE.MathUtils.clamp(
      delta >= 0 ? cam.zoom * zoomScale : cam.zoom / zoomScale,
      controls.minZoom,
      controls.maxZoom
    );
    cam.updateProjectionMatrix();
  }
}

function fastDragMagnitude(dx, dy) {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  return ax > ay ? ax + ay * 0.4142 : ay + ax * 0.4142;
}

function beginHoudiniZoomDrag(event) {
  if (viewportState.state.navigationStyle !== "houdini" || event.button !== 2 || !event.altKey) return;
  sculptState.state.houdiniZoomDrag = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY };
  renderer.domElement.setPointerCapture?.(event.pointerId);
  updateInteractionLocks();
  event.preventDefault();
}

function updateHoudiniZoomDrag(event) {
  if (!sculptState.state.houdiniZoomDrag || event.pointerId !== sculptState.state.houdiniZoomDrag.pointerId) return;
  const dx = event.clientX - sculptState.state.houdiniZoomDrag.lastX;
  const dy = event.clientY - sculptState.state.houdiniZoomDrag.lastY;
  sculptState.state.houdiniZoomDrag.lastX = event.clientX;
  sculptState.state.houdiniZoomDrag.lastY = event.clientY;
  if (dx === 0 && dy === 0) return;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  const magnitude = fastDragMagnitude(dx, dy);
  const sign = ay >= ax ? (dy < 0 ? -1 : 1) : (dx > 0 ? -1 : 1);
  const delta = sign * magnitude;
  dollyCameraByDrag(delta);
  controls.update();
  event.preventDefault();
}

function endHoudiniZoomDrag(event) {
  if (!sculptState.state.houdiniZoomDrag || (event?.pointerId !== undefined && event.pointerId !== sculptState.state.houdiniZoomDrag.pointerId)) return;
  const pointerId = sculptState.state.houdiniZoomDrag.pointerId;
  sculptState.state.houdiniZoomDrag = null;
  if (renderer.domElement.hasPointerCapture?.(pointerId)) renderer.domElement.releasePointerCapture(pointerId);
  updateInteractionLocks();
}

function updateSelectionMarquee(event) {
  if (!sculptState.state.selectionMarqueeDrag || event.pointerId !== sculptState.state.selectionMarqueeDrag.pointerId) return;
  sculptState.state.selectionMarqueeDrag.currentX = event.clientX;
  sculptState.state.selectionMarqueeDrag.currentY = event.clientY;
  const width = Math.abs(event.clientX - sculptState.state.selectionMarqueeDrag.startX);
  const height = Math.abs(event.clientY - sculptState.state.selectionMarqueeDrag.startY);
  if (!sculptState.state.selectionMarqueeDrag.active && Math.hypot(width, height) < 6) return;
  sculptState.state.selectionMarqueeDrag.active = true;
  const viewportRect = renderer.domElement.getBoundingClientRect();
  selectionMarquee.style.left = `${Math.min(event.clientX, sculptState.state.selectionMarqueeDrag.startX) - viewportRect.left}px`;
  selectionMarquee.style.top = `${Math.min(event.clientY, sculptState.state.selectionMarqueeDrag.startY) - viewportRect.top}px`;
  selectionMarquee.style.width = `${width}px`;
  selectionMarquee.style.height = `${height}px`;
  selectionMarquee.classList.remove("hidden");
  event.preventDefault();
}

function pointInsideSelectionMarquee(position, bounds, viewportRect) {
  const projected = position.clone().project(camera);
  if (projected.z < -1 || projected.z > 1) return false;
  const x = viewportRect.left + ((projected.x + 1) * 0.5 * viewportRect.width);
  const y = viewportRect.top + ((1 - projected.y) * 0.5 * viewportRect.height);
  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}

function selectPointsInMarquee(drag) {
  const bounds = {
    left: Math.min(drag.startX, drag.currentX),
    right: Math.max(drag.startX, drag.currentX),
    top: Math.min(drag.startY, drag.currentY),
    bottom: Math.max(drag.startY, drag.currentY)
  };
  const viewportRect = renderer.domElement.getBoundingClientRect();
  const matches = [];
  const lattice = drawFlowApi.selectedCurveLatticeGuide();
  if (lattice?.handlesGroup.visible) {
    lattice.handlesGroup.children.forEach((handle, pointIndex) => {
      if (handle.visible && pointInsideSelectionMarquee(handle.getWorldPosition(new THREE.Vector3()), bounds, viewportRect)) {
        matches.push({ type: "lattice", guideId: lattice.id, pointIndex });
      }
    });
  } else {
    const lock = getSelectedLock();
    if (lock?.curveObjects?.group.visible) {
      lock.curveObjects.handles.forEach((handle, pointIndex) => {
        if (handle.visible && pointInsideSelectionMarquee(handle.getWorldPosition(new THREE.Vector3()), bounds, viewportRect)) {
          matches.push({ type: "strand", lockId: lock.id, pointIndex });
        }
      });
    }
  }
  const pointKey = (point) => `${point.type}:${point.lockId || point.guideId}:${point.pointIndex}`;
  const matchKeys = new Set(matches.map(pointKey));
  if (drag.selectionMode === "add") {
    const existingKeys = new Set(sel.state.selectedControlPoints.map(pointKey));
    sel.state.selectedControlPoints = [
      ...sel.state.selectedControlPoints,
      ...matches.filter((point) => !existingKeys.has(pointKey(point)))
    ];
  } else if (drag.selectionMode === "remove") {
    sel.state.selectedControlPoints = sel.state.selectedControlPoints.filter((point) => !matchKeys.has(pointKey(point)));
  } else {
    sel.state.selectedControlPoints = matches;
  }
  const primary = sel.state.selectedControlPoints[0];
  transformControls.detach();
  if (primary?.type === "lattice") {
    sel.state.selectedCurveLatticePoint = { guideId: primary.guideId, pointIndex: primary.pointIndex };
    sel.state.selectedPoint = null;
  } else if (primary?.type === "strand") {
    sel.state.selectedPoint = { lockId: primary.lockId, pointIndex: primary.pointIndex };
    sel.state.selectedCurveLatticePoint = null;
  } else {
    sel.state.selectedPoint = null;
    sel.state.selectedCurveLatticePoint = null;
  }
  guides.filter((guide) => guide.type === "curve-lattice").forEach(guideApi.updateCurveLatticeHandleColors);
  locks.forEach((lock) => updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId }));
  updateSelectedPointLabel();
  updateViewPlaneGrid();
}

function objectSelectionScreenBounds(object, viewportRect) {
  if (!object?.visible) return false;
  const bounds3d = new THREE.Box3().setFromObject(object);
  if (bounds3d.isEmpty()) return null;
  const { min, max } = bounds3d;
  const samples = [
    new THREE.Vector3(min.x, min.y, min.z),
    new THREE.Vector3(min.x, min.y, max.z),
    new THREE.Vector3(min.x, max.y, min.z),
    new THREE.Vector3(min.x, max.y, max.z),
    new THREE.Vector3(max.x, min.y, min.z),
    new THREE.Vector3(max.x, min.y, max.z),
    new THREE.Vector3(max.x, max.y, min.z),
    new THREE.Vector3(max.x, max.y, max.z),
    bounds3d.getCenter(new THREE.Vector3())
  ];
  const screenBounds = {
    left: Infinity,
    right: -Infinity,
    top: Infinity,
    bottom: -Infinity
  };
  let visibleSamples = 0;
  samples.forEach((position) => {
    const projected = position.project(camera);
    if (projected.z < -1 || projected.z > 1) return;
    const x = viewportRect.left + ((projected.x + 1) * 0.5 * viewportRect.width);
    const y = viewportRect.top + ((1 - projected.y) * 0.5 * viewportRect.height);
    screenBounds.left = Math.min(screenBounds.left, x);
    screenBounds.right = Math.max(screenBounds.right, x);
    screenBounds.top = Math.min(screenBounds.top, y);
    screenBounds.bottom = Math.max(screenBounds.bottom, y);
    visibleSamples += 1;
  });
  return visibleSamples ? screenBounds : null;
}

function objectInsideSelectionMarquee(object, bounds, viewportRect) {
  if (!screenBoundsOverlap(bounds, objectSelectionScreenBounds(object, viewportRect))) return false;
  object.updateWorldMatrix(true, true);
  let hasTriangleGeometry = false;
  let triangleHit = false;
  object.traverseVisible((child) => {
    if (triangleHit || !child.isMesh) return;
    const position = child.geometry?.getAttribute?.("position");
    if (!position || position.count < 3) return;
    hasTriangleGeometry = true;
    const index = child.geometry.getIndex();
    const total = index ? index.count : position.count;
    const start = Math.max(0, Math.floor(Number(child.geometry.drawRange?.start) || 0));
    const requestedCount = Number(child.geometry.drawRange?.count);
    const count = Number.isFinite(requestedCount) ? Math.min(total - start, requestedCount) : total - start;
    const end = Math.max(start, start + count);
    const projectedPoints = new Array(position.count);
    const projectedPoint = (pointIndex) => {
      if (projectedPoints[pointIndex] !== undefined) return projectedPoints[pointIndex];
      const projected = new THREE.Vector3().fromBufferAttribute(position, pointIndex)
        .applyMatrix4(child.matrixWorld)
        .project(camera);
      if (projected.z < -1 || projected.z > 1) {
        projectedPoints[pointIndex] = null;
        return null;
      }
      const point = {
        x: viewportRect.left + ((projected.x + 1) * 0.5 * viewportRect.width),
        y: viewportRect.top + ((1 - projected.y) * 0.5 * viewportRect.height)
      };
      projectedPoints[pointIndex] = point;
      return point;
    };
    for (let offset = start; offset + 2 < end; offset += 3) {
      const triangle = [0, 1, 2].map((corner) => projectedPoint(
        index ? index.getX(offset + corner) : offset + corner
      ));
      if (triangle.every(Boolean) && triangleIntersectsScreenBounds(triangle, bounds)) {
        triangleHit = true;
        break;
      }
    }
  });
  return hasTriangleGeometry ? triangleHit : true;
}

function selectObjectsInMarquee(drag) {
  const bounds = {
    left: Math.min(drag.startX, drag.currentX),
    right: Math.max(drag.startX, drag.currentX),
    top: Math.min(drag.startY, drag.currentY),
    bottom: Math.max(drag.startY, drag.currentY)
  };
  const viewportRect = renderer.domElement.getBoundingClientRect();
  if (sculptState.state.viewportEditMode === "strand") {
    const matches = locks.filter((lock) => (
      strandAvailableForViewportInteraction(lock)
      && objectInsideSelectionMarquee(lock.mesh, bounds, viewportRect)
    ));
    if (!matches.length && drag.selectionMode === "replace") {
      deselectStrands();
      return;
    }
    if (!matches.length) return;
    const nextSelection = resolveStrandSelection({
      ...currentStrandSelectionState(),
      requestedId: matches[0].id,
      requestedIds: matches.map((lock) => lock.id),
      selectionMode: drag.selectionMode,
      validIds: locks.map((lock) => lock.id)
    });
    if (!nextSelection.activeId) {
      deselectStrands();
      return;
    }
    selectLock(nextSelection.activeId, {
      individualClumpMember: true,
      selectedIds: nextSelection.selectedIds
    });
    return;
  }
  if (sculptState.state.viewportEditMode === "guide") {
    const match = guides.find((guide) => (
      [guide.mesh, guide.rootMesh]
        .filter((object) => object?.visible !== false)
        .some((object) => objectInsideSelectionMarquee(object, bounds, viewportRect))
    ));
    guideApi.selectGuide(match?.id);
  }
}

function finishSelectionMarquee(event, options = {}) {
  if (!sculptState.state.selectionMarqueeDrag || event.pointerId !== sculptState.state.selectionMarqueeDrag.pointerId) return;
  const drag = sculptState.state.selectionMarqueeDrag;
  sculptState.state.selectionMarqueeDrag = null;
  selectionMarquee.classList.add("hidden");
  updateCurvePointTopologyCursor(event);
  updateInteractionLocks();
  if (options.cancel) return;
  if (drag.active) {
    if (componentEditModeActive()) selectPointsInMarquee(drag);
    else selectObjectsInMarquee(drag);
  } else if (drag.surface?.type === "guide") {
    guideApi.selectGuide(drag.surface.hit.object.userData.guideId);
  } else if (drag.surface?.type === "strand") {
    selectLock(drag.surface.hit.object.userData.lockId, {
      individualClumpMember: true,
      selectionMode: drag.selectionMode === "replace" ? undefined : drag.selectionMode
    });
  } else if (drag.selectionMode === "replace") {
    deselectStrands();
  }
}


function strandSplitProfileData(lock) {
  const baseProfilePoints = (lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE)
    .map((point) => ({ ...point, z: point.z + Number(lock.profileOffset || 0) }));
  const profilePoints = branchSweep.trimmedSweepProfile(baseProfilePoints, lock);
  const profileCurve = branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const samples = Array.from({ length: 65 }, (_, index) => branchSweep.sampleSweepProfile(profilePoints, index / 64, profileCurve));
  return {
    samples,
    minX: Math.min(...samples.map((point) => point.x)),
    maxX: Math.max(...samples.map((point) => point.x))
  };
}

function strandSplitControlPoint(lock, split, tOverride = null, curveOverride = null, profileDataOverride = null) {
  const t = THREE.MathUtils.clamp(tOverride ?? (1 - Number(split.height ?? 0.3)), 0, 1);
  const position = THREE.MathUtils.clamp(Number(split.position ?? 0), -0.8, 0.8);
  const curve = curveOverride || strandGeometryCurve(lock);
  const frame = strandGeometryFrameAt(lock, curve, t, null);
  const { samples, minX, maxX } = profileDataOverride || strandSplitProfileData(lock);
  const profileX = THREE.MathUtils.lerp(minX, maxX, position * 0.5 + 0.5);
  let profileZ = -Infinity;
  samples.forEach((current, index) => {
    const next = samples[(index + 1) % samples.length];
    if ((profileX < current.x && profileX < next.x) || (profileX > current.x && profileX > next.x)) return;
    const denominator = next.x - current.x;
    const amount = Math.abs(denominator) < 0.000001 ? 0 : (profileX - current.x) / denominator;
    profileZ = Math.max(profileZ, THREE.MathUtils.lerp(current.z, next.z, amount));
  });
  if (!Number.isFinite(profileZ)) {
    profileZ = samples.reduce((best, point) => (
      Math.abs(point.x - profileX) < Math.abs(best.x - profileX) ? point : best
    ), samples[0]).z;
  }
  const point = curve.getPoint(t);
  const scaleX = sampleScale(lock.pointScales, t, "x");
  const scaleZ = sampleScale(lock.pointScales, t, "z");
  const warped = strandProfileTopologyAt(
    lock,
    t,
    [{ x: profileX, z: profileZ }],
    scaleX,
    scaleZ,
    samples
  )[0];
  const offset = frame.x.clone().multiplyScalar(warped.x)
    .addScaledVector(frame.z, warped.z);
  return point.add(offset).addScaledVector(frame.z, 0.012);
}

function panelSplitControlPoint(lock, split, tOverride = null, curveOverride = null, splitIndex = null, boneOverride = null) {
  const t = THREE.MathUtils.clamp(tOverride ?? (1 - Number(split.height || 0)), 0, 1);
  const u = THREE.MathUtils.clamp(Number(split.position || 0), -1, 1);
  const sampleT = t;
  if (lock.geometryType === "surface") return panelTipStrand.surfacePanelPoint(lock, sampleT, u, 1);
  const curve = curveOverride || strandGeometryCurve(lock);
  const point = curve.getPoint(sampleT);
  const tangent = curve.getTangent(sampleT).normalize();
  let z = guidedNormalAt(lock, point, tangent, sampleT).applyAxisAngle(tangent, strandTwistAt(lock, sampleT));
  z = z.projectOnPlane(tangent);
  if (z.lengthSq() < 0.0001) z.copy(outwardNormalAtPoint(point, tangent));
  z.normalize();
  const x = new THREE.Vector3().crossVectors(tangent, z).normalize();
  // Width follows the split sub-bone of the segment to the left of this zipper so the
  // handle stays on the surface when per-segment curves are authored.
  const bone = boneOverride
    || (splitIndex == null ? null : splitBonesFor(lock)[splitIndex] || null);
  const panelWidthAt = (side) => Math.max(0.0001, Number(lock.width ?? 0.62) * sampleAsymmetricTaperCurve(
    bone?.taperCurve || lock.taperCurve,
    bone?.taperCurveSecondary || lock.taperCurveSecondary,
    bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve,
    side,
    sampleT
  ));
  const panelThicknessAt = (side) => Math.max(0.0001, Number(lock.panelThickness ?? 0.08) * sampleAsymmetricTaperCurve(
    bone?.depthCurve || lock.depthCurve,
    bone?.depthCurveSecondary || lock.depthCurveSecondary,
    bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve,
    side,
    sampleT
  ));
  const width = panelWidthAt(u);
  const thickness = panelThicknessAt(1);
  const centerX = lock.centerAsymmetricProfile && (bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve)
    ? (panelWidthAt(1) - panelWidthAt(-1)) * 0.25
    : 0;
  const centerZ = lock.centerAsymmetricProfile && (bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve)
    ? (panelThicknessAt(1) - panelThicknessAt(-1)) * 0.25
    : 0;
  const camber = Number(lock.panelCurvature ?? 0.18) * width * 0.5 * (1 - u * u);
  const offset = x.multiplyScalar(
    u * width * 0.5 + centerX * profileTopologyCenterWeight(u, -1, 1)
  ).addScaledVector(
    z,
    camber + thickness * 0.58 + centerZ * profileTopologyCenterWeight(1, -1, 1)
  );
  return point.add(offset);
}

const strandControlPointPickCenter = new THREE.Vector3();
const strandControlPointPickScale = new THREE.Vector3();
const strandControlPointPickSphere = new THREE.Sphere();
const strandControlPointScreenPosition = new THREE.Vector3();
const strandControlPointWorldPosition = new THREE.Vector3();
const STRAND_CONTROL_POINT_MIN_PICK_RADIUS = 0.065;
const STRAND_CONTROL_POINT_MIN_PICK_PIXELS = 12;

function strandControlPointRaycast(raycaster, intersections) {
  this.getWorldPosition(strandControlPointPickCenter);
  this.getWorldScale(strandControlPointPickScale);
  strandControlPointPickSphere.center.copy(strandControlPointPickCenter);
  strandControlPointPickSphere.radius = Math.max(
    STRAND_CONTROL_POINT_MIN_PICK_RADIUS,
    0.052 * STRAND_CONTROL_POINT_RADIUS_SCALE * Math.max(
      strandControlPointPickScale.x,
      strandControlPointPickScale.y,
      strandControlPointPickScale.z
    )
  );
  const point = raycaster.ray.intersectSphere(
    strandControlPointPickSphere,
    new THREE.Vector3()
  );
  if (!point) return;
  const distance = raycaster.ray.origin.distanceTo(point);
  if (distance < raycaster.near || distance > raycaster.far) return;
  intersections.push({
    distance,
    point,
    object: this,
    face: null,
    faceIndex: null,
    uv: null
  });
}

// Stable frame for a strand control point. For a branch child's root the child's
// own surface normals are near-parallel to its tangent (it grows along the parent
// normal), so curveFrameAtPoint's X/Z axes flip and the gizmo (green tangent axis)
// appears to spin wildly when the root is dragged in Hierarchy mode. Use a stable
// frame: tangent = child curve tangent, up (z) = parent root tangent (toward the
// parent root) projected on the tangent plane - the same reference as the sweep seed.
function strandControlPointFrame(lock, index) {
  if (lock?.branchParentId && index === 0) {
    try {
      const curve = strandGeometryCurve(lock);
      const tangent = curve.getTangent(0).normalize();
      const parent = locks.find((item) => item.id === lock.branchParentId);
      const parentFrame = branchRootBone.branchParentFrame(parent, lock.branchParentParameter);
      const up = parentFrame.y.clone().negate().projectOnPlane(tangent);
      if (up.lengthSq() >= 0.0001) {
        up.normalize();
        const x = new THREE.Vector3().crossVectors(tangent, up).normalize();
        return {
          x,
          y: tangent,
          z: up,
          quaternion: new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().makeBasis(x, tangent, up)
          ),
          point: curve.getPoint(0),
          scale: lock.pointScales?.[0] || { x: 1, z: 1 }
        };
      }
    } catch (e) { /* fall through to curveFrameAtPoint */ }
  }
  return curveFrameAtPoint(lock, index);
}

// Root gizmo frame for a branch child: the tube-model baseline plus the child's
// authored root point twist (rotate tool writes pointTwists[0]), so the gizmo
// reflects the user's hand rotation instead of always showing the untwisted
// baseline. This is also the orientation applied to the root bone.

function strandControlPointHitFromEvent(event, lock = getSelectedLock()) {
  if (lock?.locked || !lock?.curveObjects?.group.visible) return null;
  const rect = renderer.domElement.getBoundingClientRect();
  let nearest = null;
  lock.curveObjects.handles.forEach((handle) => {
    if (!handle.visible) return;
    handle.getWorldPosition(strandControlPointWorldPosition);
    strandControlPointScreenPosition
      .copy(strandControlPointWorldPosition)
      .project(camera);
    if (
      strandControlPointScreenPosition.z < -1
      || strandControlPointScreenPosition.z > 1
    ) return;
    const screenX = rect.left + (strandControlPointScreenPosition.x + 1) * rect.width * 0.5;
    const screenY = rect.top + (1 - strandControlPointScreenPosition.y) * rect.height * 0.5;
    const screenDistance = Math.hypot(event.clientX - screenX, event.clientY - screenY);
    if (
      screenDistance > STRAND_CONTROL_POINT_MIN_PICK_PIXELS
      || screenDistance >= (nearest?.screenDistance ?? Infinity)
    ) return;
    nearest = {
      distance: camera.position.distanceTo(strandControlPointWorldPosition),
      screenDistance,
      point: strandControlPointWorldPosition.clone(),
      object: handle
    };
  });
  // A highlighted (hovered) control point is "in range" by definition: accept a click
  // on the highlight even when its projected center is past the fixed screen-pixel
  // radius (small handles / close camera), so it never falls through to a width-edge
  // drag or the parent hair underneath.
  const hovered = guideState.state.hoveredControlPoint;
  if (hovered?.userData?.lockId === lock.id && hovered.visible) {
    hovered.getWorldPosition(strandControlPointWorldPosition);
    strandControlPointScreenPosition
      .copy(strandControlPointWorldPosition)
      .project(camera);
    if (strandControlPointScreenPosition.z >= -1 && strandControlPointScreenPosition.z <= 1) {
      const screenX = rect.left + (strandControlPointScreenPosition.x + 1) * rect.width * 0.5;
      const screenY = rect.top + (1 - strandControlPointScreenPosition.y) * rect.height * 0.5;
      const screenDistance = Math.hypot(event.clientX - screenX, event.clientY - screenY);
      if (
        screenDistance <= STRAND_CONTROL_POINT_MIN_PICK_PIXELS * 2
        && screenDistance < (nearest?.screenDistance ?? Infinity)
      ) {
        nearest = {
          distance: camera.position.distanceTo(strandControlPointWorldPosition),
          screenDistance,
          point: strandControlPointWorldPosition.clone(),
          object: hovered
        };
      }
    }
  }
  return nearest;
}

function createCurveObjects(lock) {
  if (lock.geometryType === "poly") return polyToolsApi.createPolyEditObjects(lock);
  const group = new THREE.Group();
  group.userData.lockId = lock.id;
  const line = new (["surface", "curve-surface"].includes(lock.geometryType) ? THREE.LineSegments : THREE.Line)(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0xe7a95d, transparent: true, opacity: 0.78, depthTest: false })
  );
  line.renderOrder = 3;
  group.add(line);

  const widthEdgeLines = [-1, 1].map((side) => {
    const edge = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0xe7a95d,
        transparent: true,
        opacity: 0.22,
        depthTest: false,
        depthWrite: false
      })
    );
    edge.renderOrder = 6;
    edge.userData.lockId = lock.id;
    edge.userData.strandWidthEdge = true;
    edge.userData.side = side;
    group.add(edge);
    return edge;
  });
  const createDimensionEdgeLines = (dimension) => [-1, 1].map((side) => {
    const edge = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0xe7a95d,
        transparent: true,
        opacity: 0.22,
        depthTest: false,
        depthWrite: false
      })
    );
    edge.renderOrder = 6;
    edge.userData.lockId = lock.id;
    edge.userData.strandWidthEdge = true;
    edge.userData.dimension = dimension;
    edge.userData.side = side;
    group.add(edge);
    return edge;
  });
  widthEdgeLines.forEach((edge) => { edge.userData.dimension = "width"; });
  const depthEdgeLines = createDimensionEdgeLines("depth");
  const uniformEdgeLines = createDimensionEdgeLines("uniform");

  let surfaceObjectAnchor = null;
  let surfaceObjectAnchorHandle = null;
  let surfaceObjectAnchorStem = null;
  if (lock.geometryType === "surface") {
    surfaceObjectAnchor = new THREE.Object3D();
    surfaceObjectAnchor.userData.lockId = lock.id;
    surfaceObjectAnchor.userData.surfaceObjectAnchor = true;
    surfaceObjectAnchorStem = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(0, -0.18, 0)
      ]),
      new THREE.LineBasicMaterial({
        color: 0xf6b75d,
        transparent: true,
        opacity: 0.9,
        depthTest: false
      })
    );
    surfaceObjectAnchorStem.renderOrder = 7;
    surfaceObjectAnchorHandle = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.072, 0),
      new THREE.MeshBasicMaterial({
        color: 0xf6b75d,
        depthTest: false,
        transparent: true,
        opacity: 0.96
      })
    );
    surfaceObjectAnchorHandle.position.set(0, -0.18, 0);
    surfaceObjectAnchorHandle.renderOrder = 8;
    surfaceObjectAnchorHandle.userData.lockId = lock.id;
    surfaceObjectAnchorHandle.userData.surfaceObjectAnchorHandle = true;
    surfaceObjectAnchor.add(surfaceObjectAnchorStem, surfaceObjectAnchorHandle);
    group.add(surfaceObjectAnchor);
  }

  const handles = lock.points.map((point, index) => {
    const pointScale = lock.pointScales?.[index] || { x: 1, z: 1 };
    const frame = lock.geometryType === "surface" ? null
      : (lock.branchParentId && index === 0 ? branchRootBone.branchRootGizmoFrame(lock) : strandControlPointFrame(lock, index));
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.052 * STRAND_CONTROL_POINT_RADIUS_SCALE,
        18,
        12
      ),
      new THREE.MeshBasicMaterial({ color: 0x58f6ff, depthTest: false, transparent: true, opacity: 0.78 })
    );
    handle.position.copy(point);
    if (frame) handle.quaternion.copy(frame.quaternion);
    // Apply the gizmo orientation to the root bone's up so it follows the
    // user-adjustable gizmo (move, rotate, and rebuilds all go through here).
    if (lock.branchParentId && index === 0 && frame && lock.pointSurfaceNormals) {
      lock.pointSurfaceNormals[0] = frame.z.clone();
    }
    handle.scale.set(
      ["surface", "curve-surface"].includes(lock.geometryType) ? 1 : pointScale.x || 1,
      1,
      ["surface", "curve-surface"].includes(lock.geometryType) ? 1 : pointScale.z || 1
    );
    handle.renderOrder = 4;
    handle.userData.lockId = lock.id;
    handle.userData.pointIndex = index;
    handle.raycast = strandControlPointRaycast;
    group.add(handle);
    return handle;
  });
  const arrows = lock.points.map((point, index) => {
    const arrow = boneViewHandles.createCurveNormalIndicator();
    arrow.position.copy(point);
    arrow.userData.lockId = lock.id;
    arrow.userData.pointIndex = index;
    group.add(arrow);
    return arrow;
  });
  const boneHandles = boneViewHandles.createBoneViewHandles(lock, group);
  group.visible = false;
  return {
    group,
    line,
    handles,
    arrows,
    ...boneHandles,
    surfaceObjectAnchor,
    surfaceObjectAnchorHandle,
    surfaceObjectAnchorStem,
    widthEdgeLines,
    depthEdgeLines,
    uniformEdgeLines
  };
}

function strandWidthEdgeFrameAt(lock, curve, t, previousFrame = null) {
  const braidRotation = lock.geometryType === "braid"
    ? THREE.MathUtils.degToRad(Number(lock.braidRotation ?? 0))
    : 0;
  return strandGeometryFrameAt(lock, curve, t, previousFrame, braidRotation);
}

function transportedStrandWidthEdgeFrame(lock, curve, t) {
  const stepCount = Math.max(1, Math.ceil(THREE.MathUtils.clamp(t, 0, 1) * 36));
  let frame = strandWidthEdgeFrameAt(lock, curve, 0);
  for (let step = 1; step <= stepCount; step += 1) {
    frame = strandWidthEdgeFrameAt(lock, curve, t * step / stepCount, frame);
  }
  return frame;
}

function strandWidthEdgeSample(lock, t, side, frameOverride = null, curveOverride = null, dimension = "width") {
  if (!lock?.points?.length) return null;
  if (isPanelGeometry(lock) && dimension === "width") {
    const center = panelSplitControlPoint(lock, { position: 0, height: 1 - t }, t);
    const edge = panelSplitControlPoint(lock, { position: side, height: 1 - t }, t);
    return { center, edge };
  }
  if (isPanelGeometry(lock)) return null;
  const curve = curveOverride || strandGeometryCurve(lock);
  const frame = frameOverride || transportedStrandWidthEdgeFrame(lock, curve, t);
  const widthValue = sampleAsymmetricTaperCurve(
    lock.taperCurve,
    lock.taperCurveSecondary,
    lock.asymmetricWidthCurve,
    side,
    t
  );
  const depthValue = sampleAsymmetricTaperCurve(
    lock.depthCurve,
    lock.depthCurveSecondary,
    lock.asymmetricDepthCurve,
    side,
    t
  );
  const widthExtent = taperEditor.taperMeshPointExtentPerValue(lock, t, side, "x") * widthValue;
  const depthExtent = taperEditor.taperMeshPointExtentPerValue(lock, t, side, "z") * depthValue;
  const offset = new THREE.Vector3();
  if (dimension !== "depth") offset.addScaledVector(frame.x, side * widthExtent);
  if (dimension !== "width") offset.addScaledVector(frame.z, side * depthExtent);
  return {
    center: frame.point.clone(),
    edge: frame.point.clone().add(offset)
  };
}

function strandWidthEdgePoints(lock, side, dimension = "width") {
  const points = [];
  const curve = isPanelGeometry(lock) ? null : strandGeometryCurve(lock);
  let previousFrame = curve ? strandWidthEdgeFrameAt(lock, curve, 0) : null;
  for (let index = 0; index <= 36; index += 1) {
    const t = THREE.MathUtils.lerp(0.04, 0.96, index / 36);
    const frame = curve ? strandWidthEdgeFrameAt(lock, curve, t, previousFrame) : null;
    const sample = strandWidthEdgeSample(lock, t, side, frame, curve, dimension);
    if (sample) points.push(sample.edge);
    if (frame) previousFrame = frame;
  }
  return points;
}

function moveCurveControlsApplicable(lock = getSelectedLock()) {
  return Boolean(
    sel.state.activeTool === "move"
    && sculptState.state.viewportEditMode === "strand"
    && componentEditModeActive()
    && lock?.points?.length >= 2
    && !["poly", "surface", "hair-shell"].includes(lock.geometryType)
  );
}

function moveGrabHandlesApplicable(lock = getSelectedLock()) {
  return Boolean(
    sel.state.activeTool === "move"
    && sculptState.state.viewportEditMode === "strand"
    && componentEditModeActive()
    && lock?.geometryType === "strand"
    && lock.points?.length >= 2
  );
}

function moveGrabHandleVisible(dimension) {
  if (hairState.state.moveGrabHandleVisibility.uniform) return dimension === "uniform";
  return dimension !== "uniform" && Boolean(hairState.state.moveGrabHandleVisibility[dimension]);
}

function visibleTaperMeshCurveEdits() {
  const edits = [];
  const selectedLock = getSelectedLock();
  if (moveCurveControlsApplicable(selectedLock)) {
    Object.entries(hairState.state.moveCurveControlVisibility).forEach(([curveKey, visible]) => {
      if (visible) edits.push({ lock: selectedLock, curveKey });
    });
  }
  if (
    hairState.state.taperMeshPointsVisible
    && sculptState.state.taperCurveEdit?.type === "strand"
    && ["taperCurve", "depthCurve", "twistCurve"].includes(sculptState.state.taperCurveEdit.curveKey)
  ) {
    const lock = locks.find((item) => item.id === sculptState.state.taperCurveEdit.id);
    if (lock && !edits.some((edit) => edit.lock === lock && edit.curveKey === sculptState.state.taperCurveEdit.curveKey)) {
      edits.push({ lock, curveKey: sculptState.state.taperCurveEdit.curveKey });
    }
  }
  return edits;
}

function syncMoveCurveControls(primary = getSelectedLock()) {
  const grabHandlesApplicable = moveGrabHandlesApplicable(primary);
  moveGrabHandlesSetting.classList.toggle("hidden", !grabHandlesApplicable);
  moveWidthGrabHandlesInput.checked = hairState.state.moveGrabHandleVisibility.width;
  moveDepthGrabHandlesInput.checked = hairState.state.moveGrabHandleVisibility.depth;
  moveUniformGrabHandlesInput.checked = hairState.state.moveGrabHandleVisibility.uniform;
  moveWidthGrabHandlesInput.disabled = hairState.state.moveGrabHandleVisibility.uniform;
  moveDepthGrabHandlesInput.disabled = hairState.state.moveGrabHandleVisibility.uniform;
  const applicable = moveCurveControlsApplicable(primary);
  moveCurveControlsSetting.classList.toggle("hidden", !applicable);
  moveWidthCurveControlsInput.checked = hairState.state.moveCurveControlVisibility.taperCurve;
  moveDepthCurveControlsInput.checked = hairState.state.moveCurveControlVisibility.depthCurve;
  moveTwistCurveControlsInput.checked = hairState.state.moveCurveControlVisibility.twistCurve;
  if (!applicable) return;
  const selection = compatibleSelectedLocks(primary);
  const syncAuthoredCheckbox = (control, read, stateLabel = null) => {
    const values = selection.map(read);
    control.checked = Boolean(values[0]);
    control.disabled = false;
    const mixed = setMixedControl(control, null, values, Boolean);
    if (stateLabel) stateLabel.textContent = mixed ? "Mixed" : control.checked ? "Asym" : "Sym";
  };
  syncAuthoredCheckbox(
    moveAsymmetricWidthInput,
    (lock) => lock.asymmetricWidthCurve,
    moveAsymmetricWidthLabel
  );
  syncAuthoredCheckbox(
    moveAsymmetricDepthInput,
    (lock) => lock.asymmetricDepthCurve,
    moveAsymmetricDepthLabel
  );
  syncAuthoredCheckbox(moveCenterAsymmetricProfileInput, (lock) => lock.centerAsymmetricProfile);
}

function setMoveGrabHandleVisibility(dimension, visible) {
  if (!(dimension in hairState.state.moveGrabHandleVisibility)) return;
  hairState.state.moveGrabHandleVisibility[dimension] = Boolean(visible);
  syncMoveCurveControls();
  const lock = getSelectedLock();
  if (lock) updateCurveObjects(lock, { visible: true });
}

function setMoveCurveControlVisibility(curveKey, visible) {
  if (!(curveKey in hairState.state.moveCurveControlVisibility)) return;
  hairState.state.moveCurveControlVisibility[curveKey] = Boolean(visible);
  syncMoveCurveControls();
  taperEditor.updateTaperMeshPoints();
  const lock = getSelectedLock();
  if (lock) updateCurveObjects(lock, { visible: true });
}

function setSelectedMoveCurveShapeFlag(key, enabled, curveKey = null) {
  const primary = getSelectedLock();
  if (!moveCurveControlsApplicable(primary)) return;
  pushUndoState();
  editSelectedLocks((lock) => {
    if (curveKey && enabled) taperEditor.ensureSecondaryTaperCurve(lock, curveKey);
    lock[key] = Boolean(enabled);
  }, { renderList: false });
  syncMoveCurveControls(primary);
  taperEditor.renderTaperPreview(taperPreviewPaths.strand, primary, "taperCurve");
  taperEditor.renderTaperPreview(taperPreviewPaths.strandDepth, primary, "depthCurve");
  taperEditor.updateTaperMeshPoints();
}

const sculptBrushDebugRaycast = () => {};

function updateCurveObjects(lock, options = {}) {
  if (!lock.curveObjects) return;
  if (lock.geometryType === "poly") {
    polyToolsApi.rebuildPolyEditObjects(lock, options);
    if (lock.wireOverlay) syncLockedStrandWireVisual(lock);
    return;
  }
  const brushDebugVisible = sculptGeom.sculptBrushDebugCurveVisible(lock);
  const sculptBrushHelpersSuppressed = sculptBrushToolActive()
    && sculptState.state.viewportEditMode === "strand";
  // Keep the tip sub-bone UI (highlight + handles + guide lines) visible while a brush
  // tool is active when a tip sub-bone is selected, so the user can see what they edit.
  // 门控用 segmentBoneHost（bone-model 单一分派）而不是 isPanelGeometry：0.2.126 起普通
  // 发丝的管也能选中发尖子骨骼，tipUiActive 必须同样为真，否则发丝在笔刷激活时会把刚选中
  // 的发尖 UI 整组藏掉。segmentBoneHost 对未开启 split 的发丝返回 null，所以非 split 发丝
  // 与此前逐字节同为 false。
  const tipUiActive = Boolean(segmentBoneHost(lock))
    && sculptState.state.tipSelection?.lockId === lock.id;
  // During a brush, show only the selected strand's bone (guide line); the control
  // handles, width edges and split/segment helpers stay hidden (bones-only view).
  const brushBonesOnly = sculptBrushHelpersSuppressed && lock.id === sel.state.selectedId;
  lock.curveObjects.line.material.color.set(
    brushDebugVisible && lock.id !== sel.state.selectedId
      ? 0x58f6ff
      : lock.clumpGuide ? 0x58f6ff : 0xe7a95d
  );
  lock.curveObjects.line.material.opacity = brushDebugVisible && lock.id !== sel.state.selectedId ? 0.42 : 0.78;
  lock.curveObjects.line.material.depthTest = false;
  lock.curveObjects.line.material.depthWrite = !brushDebugVisible;
  lock.curveObjects.line.material.stencilWrite = brushDebugVisible;
  lock.curveObjects.line.material.stencilRef = 1;
  lock.curveObjects.line.material.stencilFunc = THREE.NotEqualStencilFunc;
  lock.curveObjects.line.material.stencilFail = THREE.KeepStencilOp;
  lock.curveObjects.line.material.stencilZFail = THREE.KeepStencilOp;
  lock.curveObjects.line.material.stencilZPass = THREE.KeepStencilOp;
  sculptGeom.setSculptBrushMaterialClipping(lock.curveObjects.line.material, brushDebugVisible);
  lock.curveObjects.line.renderOrder = brushDebugVisible ? 50 : 3;
  if (brushDebugVisible) lock.curveObjects.line.raycast = sculptBrushDebugRaycast;
  else if (lock.curveObjects.line.raycast === sculptBrushDebugRaycast) delete lock.curveObjects.line.raycast;
  lock.curveObjects.line.geometry.dispose();
  lock.curveObjects.line.geometry = lock.geometryType === "surface"
    ? new THREE.BufferGeometry().setFromPoints(surfaceLatticeWireSegments(
      lock.points,
      lock.surfaceColumns,
      lock.surfaceRows
    ))
    : lock.geometryType === "curve-surface"
      ? new THREE.BufferGeometry().setFromPoints(curveSurfaceCreate.curveSurfaceControllerSegments(
        lock
      ))
    : new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(lock.points).getPoints(40));
  const surfaceObjectAnchor = lock.curveObjects.surfaceObjectAnchor;
  if (surfaceObjectAnchor) {
    const transformingAnchor = transform.state.activeSurfaceObjectTransform?.lockId === lock.id
      && transformControls.object === surfaceObjectAnchor;
    if (!transformingAnchor) {
      const pose = surfaceObjectAnchorPose(lock);
      if (pose) {
        surfaceObjectAnchor.position.copy(pose.position);
        surfaceObjectAnchor.quaternion.copy(pose.quaternion);
        surfaceObjectAnchor.scale.set(1, 1, 1);
      }
    }
    lock.curveObjects.surfaceObjectAnchorHandle.material.color.set(
      sel.state.selectedSurfaceObjectAnchorId === lock.id ? 0xff4fd8 : 0xf6b75d
    );
  }
  [
    ...(lock.curveObjects.widthEdgeLines || []),
    ...(lock.curveObjects.depthEdgeLines || []),
    ...(lock.curveObjects.uniformEdgeLines || [])
  ].forEach((edge) => {
    const dimension = edge.userData.dimension || "width";
    edge.geometry.dispose();
    edge.geometry = new THREE.BufferGeometry().setFromPoints(
      strandWidthEdgePoints(lock, edge.userData.side, dimension)
    );
    const active = sculptState.state.strandWidthEdgeDrag?.lockId === lock.id
      && sculptState.state.strandWidthEdgeDrag.side === edge.userData.side
      && (sculptState.state.strandWidthEdgeDrag.dimension || "width") === dimension;
    const hovered = hairState.state.hoveredStrandWidthEdge === edge;
    edge.material.color.set(active || hovered ? 0xff42cf : 0xe7a95d);
    edge.material.opacity = active ? 0.95 : hovered ? 0.82 : 0.22;
    edge.visible = lock.id === sel.state.selectedId
      && !tipUiActive
      && !sculptBrushHelpersSuppressed
      && !sel.state.clumpViewportSelection
      && lock.geometryType === "strand"
      && sculptState.state.viewportEditMode === "strand"
      && componentEditModeActive()
      && moveGrabHandleVisible(dimension)
      && !(
        (hairState.state.taperMeshPointsVisible && branchSweep.twistCurveEditing())
        || (moveCurveControlsApplicable(lock) && hairState.state.moveCurveControlVisibility.twistCurve)
      )
      && ["select", "move"].includes(sel.state.activeTool);
  });
  const deEmphasizeControlPoints = ["draw", "procedural-draw", "braid", "panel"].includes(sel.state.activeTool);
  const controlPointDisplayScale = guideState.state.controlPointDisplaySize * (
    deEmphasizeControlPoints
      ? STRAND_CONTROL_POINT_DRAW_TOOL_SCALE
      : brushDebugVisible ? 0.65 : 1
  );
  lock.curveObjects.handles.forEach((handle, index) => {
    if (!lock.points[index]) {
      handle.visible = false;
      return;
    }
    const controllerIndex = curveSurfaceCreate.activeCurveSurfaceControllerIndex(lock);
    handle.visible = !brushBonesOnly && (lock.geometryType !== "curve-surface"
      || (controllerIndex !== null && Math.floor(index / lock.curveSurfaceRows) === controllerIndex));
    const frame = lock.geometryType === "surface" ? null
      : (lock.branchParentId && index === 0 ? branchRootBone.branchRootGizmoFrame(lock) : strandControlPointFrame(lock, index));
    const pointScale = lock.pointScales?.[index] || { x: lock.pointWidths[index] || 1, z: lock.pointWidths[index] || 1 };
    const preserveDraggedObjectRotation = Boolean(
      sculptState.state.transformDragging
      && sculptState.state.objectSpaceEditing
      && sel.state.activeTool === "rotate"
      && sculptState.state.activeHandleEdit?.lockId === lock.id
      && sculptState.state.activeHandleEdit.pointIndex === index
      && transformControls.object === handle
    );
    handle.position.copy(lock.points[index]);
    if (frame) {
      if (!preserveDraggedObjectRotation) handle.quaternion.copy(frame.quaternion);
      // Keep the root bone's up following the (user-adjustable) gizmo.
      if (lock.branchParentId && index === 0 && lock.pointSurfaceNormals) {
        lock.pointSurfaceNormals[0] = frame.z.clone();
      }
    } else {
      handle.quaternion.identity();
    }
    const selectedHandle = (sel.state.selectedPoint?.lockId === lock.id && sel.state.selectedPoint.pointIndex === index)
      || guideApi.controlPointIsSelected("strand", lock.id, index);
    handle.scale.set(
      (["surface", "curve-surface"].includes(lock.geometryType) ? 1 : pointScale.x || 1) * controlPointDisplayScale,
      controlPointDisplayScale,
      (["surface", "curve-surface"].includes(lock.geometryType) ? 1 : pointScale.z || 1) * controlPointDisplayScale
    );
    handle.material.color.set(handleColor(lock, index));
    handle.material.depthTest = false;
    handle.material.depthWrite = !brushDebugVisible;
    handle.material.stencilWrite = brushDebugVisible;
    handle.material.stencilRef = 1;
    handle.material.stencilFunc = THREE.NotEqualStencilFunc;
    handle.material.stencilFail = THREE.KeepStencilOp;
    handle.material.stencilZFail = THREE.KeepStencilOp;
    handle.material.stencilZPass = THREE.KeepStencilOp;
    sculptGeom.setSculptBrushMaterialClipping(handle.material, brushDebugVisible);
    handle.renderOrder = brushDebugVisible ? 51 : 4;
    handle.raycast = brushDebugVisible
      ? sculptBrushDebugRaycast
      : strandControlPointRaycast;
    if (deEmphasizeControlPoints) {
      const hsl = {};
      handle.material.color.getHSL(hsl);
      handle.material.color.setHSL(hsl.h, hsl.s * 0.28, hsl.l);
    }
    const affectedHandle = isAffectedCurvePoint(lock, index);
    handle.material.opacity = brushDebugVisible
      ? 0.5
      : deEmphasizeControlPoints
      ? 0.18
      : selectedHandle ? 1 : affectedHandle ? 0.72 : 0.28;
  });
  lock.curveObjects.arrows.forEach((arrow, index) => {
    if (!lock.points[index]) {
      arrow.visible = false;
      return;
    }
    const frame = lock.geometryType === "surface" ? null
      : (lock.branchParentId && index === 0 ? branchRootBone.branchRootGizmoFrame(lock) : strandControlPointFrame(lock, index));
    if (!frame) {
      arrow.visible = false;
      return;
    }
    const scale = Math.max(frame.scale.x, frame.scale.z);
    const length = 0.13 + scale * 0.06;
    arrow.scale.setScalar(length);
    arrow.position.copy(lock.points[index]);
    arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), frame.z);
    const controllerIndex = curveSurfaceCreate.activeCurveSurfaceControllerIndex(lock);
    const controllerVisible = lock.geometryType !== "curve-surface"
      || (controllerIndex !== null && Math.floor(index / lock.curveSurfaceRows) === controllerIndex);
    arrow.visible = componentEditModeActive()
      && !sculptBrushHelpersSuppressed
      && controllerVisible
      && lock.id === sel.state.selectedId
      && ["rotate", "relax"].includes(sel.state.activeTool);
  });
  boneViewHandles.updateBoneViewHandles(lock, {
    brushDebugVisible,
    sculptBrushHelpersSuppressed,
    tipUiActive,
    brushBonesOnly
  });

  if ("visible" in options) {
    const brushCurveVisibilityAllowed = !sculptBrushToolActive() || sculptBrushShowCurvesInput.checked;
    lock.curveObjects.group.visible = (brushCurveVisibilityAllowed || tipUiActive || brushBonesOnly)
      && ((options.visible && componentEditModeActive()) || brushDebugVisible || tipUiActive || brushBonesOnly)
      && !lock.locked
      && strandVisibleForDisplay(lock);
  }
  if (lock.wireOverlay) {
    syncLockedStrandWireVisual(lock);
  }
}

function pointUpDirection(lock, pointIndex) {
  return curveFrameAtPoint(lock, pointIndex).z;
}

function curveFrameAtPoint(lock, pointIndex) {
  const controllerIndex = lock.geometryType === "curve-surface"
    ? Math.floor(pointIndex / lock.curveSurfaceRows)
    : null;
  const frameLock = controllerIndex === null
    ? lock
    : curveSurfaceCreate.curveSurfaceControllerFrameLock(lock, controllerIndex);
  const localPointIndex = controllerIndex === null
    ? pointIndex
    : pointIndex - controllerIndex * lock.curveSurfaceRows;
  const t = frameLock.points.length <= 1 ? 0 : localPointIndex / (frameLock.points.length - 1);
  const frame = transportedStrandFrameAt(
    frameLock,
    new THREE.CatmullRomCurve3(frameLock.points),
    t,
    { twistAt: (position) => controlPointRotationAt(frameLock, position) }
  );
  frame.scale = lock.pointScales?.[pointIndex] || { x: lock.pointWidths?.[pointIndex] || 1, z: lock.pointWidths?.[pointIndex] || 1 };
  return frame;
}

function curveFrameAt(lock, t, twistOverride) {
  const curve = new THREE.CatmullRomCurve3(lock.points);
  const clampedT = THREE.MathUtils.clamp(t, 0, 1);
  const point = curve.getPoint(clampedT);
  const tangent = curve.getTangent(clampedT).normalize();
  const normal = guidedNormalAt(lock, point, tangent, clampedT);
  const twist = twistOverride ?? sampleArray(lock.pointTwists, t);
  const z = normal.applyAxisAngle(tangent, twist).normalize();
  const x = new THREE.Vector3().crossVectors(tangent, z).normalize();
  const y = tangent;
  const matrix = new THREE.Matrix4().makeBasis(x, y, z);
  return {
    x,
    y,
    z,
    quaternion: new THREE.Quaternion().setFromRotationMatrix(matrix),
    scale: { x: sampleScale(lock.pointScales, t, "x"), z: sampleScale(lock.pointScales, t, "z") }
  };
}

function strandTwistAt(lock, t) {
  return controlPointRotationAt(lock, t)
    + strandProfileTwistAt(lock, t);
}

function controlPointRotationAt(lock, t) {
  return sampleArray(lock.pointTwists, t);
}

function strandProfileTwistAt(lock, t) {
  return THREE.MathUtils.degToRad(Number(lock.strandRotation ?? 0))
    + THREE.MathUtils.degToRad(sampleIntegratedEnvelopeCurve(lock.twistCurve || DEFAULT_TWIST_CURVE, t))
    + Number(lock.twist || 0) * THREE.MathUtils.clamp(t, 0, 1);
}

function strandFrameAt(lock, t) {
  const frame = curveFrameAt(lock, t, strandTwistAt(lock, t));
  frame.scale = { x: sampleScale(lock.pointScales, t, "x"), z: sampleScale(lock.pointScales, t, "z") };
  return frame;
}

function curveFrameAtSnapshot(lock, points, pointTwists, pointIndex, twistOverride) {
  const controllerIndex = lock.geometryType === "curve-surface"
    ? Math.floor(pointIndex / lock.curveSurfaceRows)
    : null;
  const frameLock = controllerIndex === null
    ? { ...lock, points, pointTwists }
    : curveSurfaceCreate.curveSurfaceControllerFrameLock(lock, controllerIndex, { points, pointTwists });
  const localPointIndex = controllerIndex === null
    ? pointIndex
    : pointIndex - controllerIndex * lock.curveSurfaceRows;
  const t = frameLock.points.length <= 1 ? 0 : localPointIndex / (frameLock.points.length - 1);
  return transportedStrandFrameAt(
    frameLock,
    new THREE.CatmullRomCurve3(frameLock.points),
    t,
    { twistOverride }
  );
}

function outwardNormalAtPoint(point, tangent) {
  const radial = point.clone();
  if (radial.lengthSq() < 0.0001) radial.set(0, 0, 1);
  radial.normalize();
  const normal = radial.projectOnPlane(tangent).normalize();
  if (normal.lengthSq() >= 0.01) return normal;

  const fallback = new THREE.Vector3(0, 0, 1).projectOnPlane(tangent).normalize();
  if (fallback.lengthSq() >= 0.01) return fallback;
  return new THREE.Vector3(1, 0, 0).projectOnPlane(tangent).normalize();
}
// Panel/tip strand geometry api deps batch (refactor 3d batch G1): all deps are defined by this
// point (last dep: outwardNormalAtPoint); the batch takes effect here, before the first runtime
// calls (updateCurveObjects/createCurveObjects in the curve-objects spine).
Object.assign(panelTipStrandDeps, {
  clonePanelSplits,
  normalizePanelSplits,
  strandGeometryCurve,
  strandGeometryFrameAt,
  strandInfluenceColor,
  isPanelGeometry,
  outwardNormalAtPoint,
  // Scalp Conform（0.2.136）的头部代理源：**注入纯数据对象本体**（不是快照拷贝），
  // 这样用户调整头皮尺寸/位置后，下一次几何重建自动读到新值。刻意不传 scalpSurfaceGroup
  // （Object3D）—— 几何重建时机比渲染早，它的 matrixWorld 可能是脏的；从这份纯数据推
  // 椭球变换永远是当前值。同步点：modules/geometry/panel-tip-strand.js 的
  // panelScalpConformParams 与 scalp-builder.js 的 updateScalpSurface 用同一套
  // `radius * scaleXYZ` 规则。
  scalpSurface,
  // Scalp Conform 拟合椭球（第五版）：**独立注入**的纯数据对象本体，与 scalpSurface
  // 同一条理由——不是快照拷贝，用户调滑杆后下次几何重建自动读到新值。缺失时
  // panelScalpConformParams 回退到 PANEL_SCALP_CONFORM_DEFAULTS（curve-math.js），见该文件。
  scalpConformFit,
  sculptState: sculptState.state
});
// Strand geometry api deps batch (refactor 3d batches G2+G3): all deps are defined by this
// point (last dep: outwardNormalAtPoint); the batch takes effect here, before the first
// runtime calls (updateCurveObjects/createCurveObjects in the curve-objects spine).
Object.assign(strandGeometryDeps, {
  branchBridge,
  branchRootBone,
  branchSweep,
  createBraidGeometry,
  curveSurfaceCreate,
  gridProfileSkipCol: clumpProceduralApi.gridProfileSkipCol,
  locks,
  outwardNormalAtPoint,
  panelTipStrand,
  proceduralBranchTemplatesForGuide: clumpProceduralApi.proceduralBranchTemplatesForGuide,
  proceduralBranchWorldPoints: clumpProceduralApi.proceduralBranchWorldPoints,
  strandCurveParameters,
  strandGeometryCurve,
  strandGeometryFrameAt,
  strandInfluenceColor,
  strandProfileTopologyAt,
  strandSweep
});
// Bone view handle api deps batch (refactor bones B3): all deps are defined by this
// point (last dep: strandGeometryFrameAt); the batch takes effect here, before the
// first runtime calls (createCurveObjects/updateCurveObjects in the curve-objects spine).
Object.assign(boneViewHandlesDeps, {
  panelTipStrand,
  sculptState: sculptState.state,
  sel: sel.state,
  transformControls,
  clonePanelSplits,
  cloneStrandSplits,
  isPanelGeometry,
  panelSplitControlPoint,
  strandSplitControlPoint,
  strandSplitProfileData,
  strandGeometryCurve,
  strandGeometryFrameAt,
  // 发丝发尖 WidthCurve 把手的 placement 变换链需要它（与几何 sweep 同一函数）；
  // 同规则同步点：boneInteractionDeps 也必须转发同一项，拖拽读值才与把手同源。
  strandProfileTopologyAt,
  currentStrandSplitTipChains
});

function sampledSurfaceNormal(lock, t) {
  const normals = lock?.pointSurfaceNormals;
  if (!normals?.length) return null;
  if (normals.length === 1) return normals[0]?.clone()?.normalize() || null;
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * (normals.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(normals.length - 1, lower + 1);
  const before = normals[lower];
  const after = normals[upper];
  if (!before && !after) return null;
  if (!before) return after.clone().normalize();
  if (!after) return before.clone().normalize();
  const result = before.clone().lerp(after, scaled - lower);
  return result.lengthSq() > 0.0001 ? result.normalize() : before.clone().normalize();
}

function guidedNormalAt(lock, point, tangent, t) {
  const fallback = outwardNormalAtPoint(point, tangent);
  const influence = THREE.MathUtils.clamp(Number(lock?.surfaceNormalInfluence ?? 0), 0, 1);
  if (influence <= 0.0001) return fallback;
  const sampled = sampledSurfaceNormal(lock, t);
  if (!sampled) return fallback;
  sampled.projectOnPlane(tangent);
  if (sampled.lengthSq() < 0.0001) return fallback;
  sampled.normalize();
  // Authored surface normals already form a coherent root-to-tip field.
  // Keep that orientation authoritative and bring only the radial fallback
  // into the same hemisphere. Flipping the authored normal against the point's
  // world-origin radial direction causes a 180-degree jump when a point crosses
  // behind the origin.
  if (fallback.dot(sampled) < 0) fallback.negate();
  const blended = fallback.clone().lerp(sampled, influence).projectOnPlane(tangent);
  return blended.lengthSq() > 0.0001 ? blended.normalize() : sampled;
}

function twistFromHandle(lock, pointIndex, handle) {
  const controllerIndex = lock.geometryType === "curve-surface"
    ? Math.floor(pointIndex / lock.curveSurfaceRows)
    : null;
  const frameLock = controllerIndex === null
    ? lock
    : curveSurfaceCreate.curveSurfaceControllerFrameLock(lock, controllerIndex);
  const localPointIndex = controllerIndex === null
    ? pointIndex
    : pointIndex - controllerIndex * lock.curveSurfaceRows;
  const t = frameLock.points.length <= 1 ? 0 : localPointIndex / (frameLock.points.length - 1);
  const baseFrame = transportedStrandFrameAt(
    frameLock,
    new THREE.CatmullRomCurve3(frameLock.points),
    t,
    { twistOverride: 0 }
  );
  const handleZ = new THREE.Vector3(0, 0, 1).applyQuaternion(handle.quaternion).normalize();
  return signedAngleAroundAxis(baseFrame.z, handleZ, baseFrame.y);
}

function signedAngleAroundAxis(from, to, axis) {
  const a = from.clone().projectOnPlane(axis).normalize();
  const b = to.clone().projectOnPlane(axis).normalize();
  const cross = new THREE.Vector3().crossVectors(a, b);
  return Math.atan2(cross.dot(axis), a.dot(b));
}

function handleColor(lock, index) {
  const selectedLock = lock.id === sel.state.selectedId;
  if (!selectedLock) return 0x476472;
  const selectedHandle = (sel.state.selectedPoint?.lockId === lock.id && sel.state.selectedPoint.pointIndex === index)
    || guideApi.controlPointIsSelected("strand", lock.id, index);
  const sameCurve = lock.geometryType !== "curve-surface"
    || Math.floor(index / lock.curveSurfaceRows) === Math.floor(sel.state.selectedPoint?.pointIndex / lock.curveSurfaceRows);
  const hierarchyAffected = sculptState.state.hierarchyEditing && sel.state.selectedPoint?.lockId === lock.id && sameCurve && index > sel.state.selectedPoint.pointIndex;
  const proportionalAffected = proportionalStrandVisualsActive(lock) && proportionalWeight(index, sel.state.selectedPoint.pointIndex) > 0;
  const endpointIndex = lock.geometryType === "curve-surface" ? index % lock.curveSurfaceRows : index;
  const endpointCount = lock.geometryType === "curve-surface" ? lock.curveSurfaceRows : lock.points.length;
  const endpointColor = endpointIndex === 0
    ? 0x8298ff
    : endpointIndex === endpointCount - 1
      ? 0x62edb0
      : 0x58f6ff;
  if (selectedHandle) return CONTROL_POINT_SELECTED_COLOR;
  if (hierarchyAffected) return 0xf0d95d;
  if (proportionalAffected) return 0x8affcf;
  if (sel.state.activeTool === "relax") return 0x80ffcf;
  return endpointColor;
}

function isAffectedCurvePoint(lock, index) {
  if (sel.state.selectedPoint?.lockId !== lock.id) return false;
  if (sculptState.state.hierarchyEditing && index > sel.state.selectedPoint.pointIndex) return true;
  return proportionalStrandVisualsActive(lock) && proportionalWeight(index, sel.state.selectedPoint.pointIndex) > 0;
}

function syncLockFromCurve(lock) {
  if (!branch.state.regionLengthUpdateInProgress) clearRegionLengthBaseline(lock);
  const centerCurveOffset = lock.geometryType === "curve-surface"
    ? THREE.MathUtils.clamp(Number(lock.curveSurfaceCenterCurve) || 0, 0, lock.curveSurfaceColumns - 1) * lock.curveSurfaceRows
    : 0;
  const first = lock.points[centerCurveOffset];
  const last = lock.geometryType === "curve-surface"
    ? lock.points[centerCurveOffset + lock.curveSurfaceRows - 1]
    : lock.points.at(-1);
  if (lock.rootSurfacePoint && lock.rootSurfaceNormal) {
    const expectedRoot = lock.rootSurfacePoint.clone().addScaledVector(
      lock.rootSurfaceNormal,
      scalpBuilder.rootScalpOffsetDistance(lock.rootScalpOffset) + layerOffsetForLock(lock) * layerRootOffsetFactor(lock.hairLayer)
    );
    if (first.distanceToSquared(expectedRoot) > 0.000004) {
      lock.rootAttachment = ioApi.createRootAttachment(lock, first);
      if (lock.rootAttachment) {
        lock.rootSurfacePoint = lock.rootAttachment.surfacePoint.clone();
        lock.rootSurfaceNormal = lock.rootAttachment.normal.clone();
      }
    }
  }
  ioApi.syncRootAttachmentMetadata(lock);
  lock.x = first.x;
  lock.y = first.y;
  lock.z = first.z;
  lock.length = Math.max(0.35, first.distanceTo(last));
  lock.curve = (last.x - first.x) / 0.52;
}

function rebuildLockGeometry(lock, options = {}) {
  // Wind preview mutual exclusion: the geometry is about to be replaced, so the per-vertex
  // rest cache would go stale — close the preview first (bitwise restores + drops caches).
  if (windStore.state.windPreviewActive) setWindPreviewActive(false);
  restoreUvCheckerPreview(); // 几何重建前先恢复导出 UV 预览几何，构建走原几何
  const previousGeometry = lock.mesh.geometry;
  lock.mesh.geometry = strandGeometryApi.createHairGeometry(lock);
  branchBridge.applyBranchRootRegionCarving(lock, lock.mesh.geometry);
  // 两条轮廓**都**要重指向新几何。它们由 createStrandSelectionOutline 用同一份 geometry
  // 引用创建（modules/material/material-ui.js），而下一行就 dispose 掉旧几何 —— 漏掉任何
  // 一条，它就攥着已 dispose 的旧几何。`dispose()` 只释放 GPU buffer、JS 侧属性数据仍在，
  // 下次渲染会重新上传，于是**画出旧形状**（不是消失，所以很容易被当成"缓存没刷新"）。
  // 症状：改 width 或任何影响几何的滑杆后，悬停高亮仍是旧轮廓，选中后才对
  // —— 0.2.138 由用户在 Scalp Conform 上报告（位移量大才显眼），但**任何**几何重建都中招。
  if (lock.selectionOutline) lock.selectionOutline.geometry = lock.mesh.geometry;
  if (lock.hoverOutline) lock.hoverOutline.geometry = lock.mesh.geometry;
  previousGeometry.dispose();
  if ((hairState.state.hairTopologyVisible || lock.proceduralParentHidden || lock.locked) && lock.wireOverlay) {
    lock.wireOverlay.geometry.dispose();
    lock.wireOverlay.geometry = createHairTopologyGeometry(lock.mesh.geometry);
  }
  setStrandSelectionVisual(lock);
  lock.mesh.material.side = lock.branchRootRegion || materialApi.strandUsesDoubleSidedMaterial(lock)
    ? THREE.DoubleSide
    : THREE.FrontSide;
  lock.mesh.material.needsUpdate = true;
  clumpProceduralApi.syncProceduralParentVisibility(lock);
  if (options.updateCurveObjects !== false) updateCurveObjects(lock);
  if (taperMeshPointsGroup.visible && lock.id === sel.state.selectedId) taperEditor.updateTaperMeshPoints();
  if (options.updateClump !== false && !miscState.state.clumpUpdateInProgress && lock.clumpGuide) clumpProceduralApi.updateClumpMembers(lock);
  if (options.updateBranches !== false && !branch.state.branchUpdateInProgress) branchHierarchy.updateBranchChildren(lock);
  invalidateUvInspector();
}


function flushPendingLockGeometryUpdates() {
  if (hairState.state.pendingLockGeometryFrame !== null) {
    cancelAnimationFrame(hairState.state.pendingLockGeometryFrame);
    hairState.state.pendingLockGeometryFrame = null;
  }
  const queuedLocks = [...pendingLockGeometryUpdates];
  pendingLockGeometryUpdates.clear();
  queuedLocks.forEach((lock) => {
    if (lock?.mesh && locks.includes(lock)) rebuildLockGeometry(lock);
  });
  if (queuedLocks.length) updateTopologyStats();
}

function updateLockGeometry(lock, options = {}) {
  if (!lock?.mesh) return;
  const deferUpdate = options.defer || sculptState.state.transformDragging || sculptState.state.viewPlaneMoveDrag || sculptState.state.relaxEdit;
  if (deferUpdate && !options.immediate) {
    pendingLockGeometryUpdates.add(lock);
    if (hairState.state.pendingLockGeometryFrame === null) {
      hairState.state.pendingLockGeometryFrame = requestAnimationFrame(() => {
        hairState.state.pendingLockGeometryFrame = null;
        const queuedLocks = [...pendingLockGeometryUpdates];
        pendingLockGeometryUpdates.clear();
        queuedLocks.forEach((queuedLock) => {
          if (queuedLock?.mesh && locks.includes(queuedLock)) rebuildLockGeometry(queuedLock);
        });
        if (queuedLocks.length) updateTopologyStats();
      });
    }
    return;
  }
  rebuildLockGeometry(lock, options);
}

function setGroupColorView(enabled) {
  hairState.state.showGroupColors = Boolean(enabled);
  groupColorToggle.classList.toggle("active", hairState.state.showGroupColors);
  groupColorToggle.setAttribute("aria-pressed", String(hairState.state.showGroupColors));
  groupColorToggle.title = hairState.state.showGroupColors ? "Show default hair color" : "Show strand group colors";
  groupColorToggle.setAttribute("aria-label", groupColorToggle.title);
  locks.forEach(setStrandSelectionVisual);
  renderLockList();
}

function createUvCheckerTexture() {
  const size = 512;
  const cells = 8;
  const cellSize = size / cells;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  for (let row = 0; row < cells; row += 1) {
    for (let column = 0; column < cells; column += 1) {
      const hue = (column * 37 + row * 53) % 360;
      const lightness = (row + column) % 2 ? 43 : 68;
      const x = column * cellSize;
      const y = row * cellSize;
      context.fillStyle = `hsl(${hue} 72% ${lightness}%)`;
      context.fillRect(x, y, cellSize, cellSize);
      context.strokeStyle = "rgba(10, 8, 12, 0.72)";
      context.lineWidth = 3;
      context.strokeRect(x, y, cellSize, cellSize);
      context.fillStyle = lightness > 55 ? "#17131a" : "#fff9ff";
      context.font = "bold 15px system-ui, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(`${column},${cells - row - 1}`, x + cellSize / 2, y + cellSize / 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "Anime Hair Studio UV Checker";
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;
  return texture;
}

function ensureUvCheckerForLock(lock) {
  if (!hairState.state.uvCheckerEnabled || !lock?.mesh) return;
  const currentMaterial = lock.mesh.material;
  let checkerMaterial = lock.uvCheckerMaterial;
  if (currentMaterial !== checkerMaterial && currentMaterial?.userData?.uvChecker !== true) {
    lock.uvCheckerOriginalMaterial = currentMaterial;
  }
  if (!checkerMaterial || checkerMaterial.userData.disposed) {
    checkerMaterial = new THREE.MeshBasicMaterial({
      map: hairState.state.uvCheckerTexture || (hairState.state.uvCheckerTexture = createUvCheckerTexture()),
      color: 0xffffff,
      side: currentMaterial?.side ?? THREE.FrontSide,
      toneMapped: false
    });
    checkerMaterial.name = `${lock.name || "Hair"} UV Checker`;
    checkerMaterial.userData.uvChecker = true;
    checkerMaterial.addEventListener("dispose", () => {
      checkerMaterial.userData.disposed = true;
    });
    lock.uvCheckerMaterial = checkerMaterial;
  }
  const desiredSide = materialApi.strandUsesDoubleSidedMaterial(lock)
    ? THREE.DoubleSide
    : THREE.FrontSide;
  checkerMaterial.color.set(0xffffff);
  checkerMaterial.side = desiredSide;
  checkerMaterial.opacity = 1;
  checkerMaterial.transparent = false;
  if (lock.uvCheckerOriginalMaterial) lock.uvCheckerOriginalMaterial.side = desiredSide;
  if (lock.mesh.material !== checkerMaterial) lock.mesh.material = checkerMaterial;
  invalidateUvInspector();
}

function removeUvCheckerFromLock(lock) {
  if (!lock?.mesh) return;
  const checkerMaterial = lock.uvCheckerMaterial;
  if (!checkerMaterial) return;
  if (lock.mesh.material === checkerMaterial && lock.uvCheckerOriginalMaterial) {
    lock.mesh.material = lock.uvCheckerOriginalMaterial;
  } else if (lock.mesh.material !== checkerMaterial) {
    lock.uvCheckerOriginalMaterial = lock.mesh.material;
  }
  if (!checkerMaterial.userData.disposed) checkerMaterial.dispose();
  lock.uvCheckerMaterial = null;
  lock.uvCheckerOriginalMaterial = null;
  invalidateUvInspector();
}

function invalidateUvInspector() {
  hairState.state.uvInspectorDirty = true;
}

function uvInspectorRecord(lock) {
  const geometry = lock.mesh?.geometry;
  const uv = geometry?.getAttribute("uv");
  if (!geometry || !uv) return null;
  const index = geometry.getIndex();
  const quadFaces = geometry.userData.quadFaces;
  const cached = uvInspectorRecordCache.get(geometry);
  if (
    cached
    && cached.uv === uv
    && cached.uvVersion === uv.version
    && cached.index === index
    && cached.indexVersion === index?.version
    && cached.quadFaces === quadFaces
  ) return { lock, points: cached.points, faces: cached.faces };
  const points = Array.from({ length: uv.count }, (_, pointIndex) => [
    uv.getX(pointIndex),
    uv.getY(pointIndex)
  ]);
  const indexedFaces = hairFaceIndices(geometry);
  const faces = indexedFaces.length
    ? indexedFaces
    : Array.from({ length: Math.floor(uv.count / 3) }, (_, faceIndex) => [
        faceIndex * 3,
        faceIndex * 3 + 1,
        faceIndex * 3 + 2
      ]);
  uvInspectorRecordCache.set(geometry, {
    uv,
    uvVersion: uv.version,
    index,
    indexVersion: index?.version,
    quadFaces,
    points,
    faces
  });
  return { lock, points, faces };
}

function uvInspectorRecords() {
  return locks.map(uvInspectorRecord).filter(Boolean);
}

function drawUvInspectorGrid(context, bounds, transform, width, height) {
  context.save();
  context.font = "11px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "top";
  for (let u = Math.floor(bounds.minU); u <= Math.ceil(bounds.maxU); u += 1) {
    const [x] = transform.project(u, bounds.minV);
    if (x < 0 || x > width) continue;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.strokeStyle = u === 0 || u === 1 ? "#7c7482" : "#3b3640";
    context.lineWidth = u === 0 || u === 1 ? 1.2 : 1;
    context.stroke();
    context.fillStyle = "#928a99";
    context.fillText(String(u), x, 7);
  }
  context.textAlign = "left";
  context.textBaseline = "middle";
  for (let v = Math.floor(bounds.minV); v <= Math.ceil(bounds.maxV); v += 1) {
    const [, y] = transform.project(bounds.minU, v);
    if (y < 0 || y > height) continue;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.strokeStyle = v === 0 || v === 1 ? "#7c7482" : "#3b3640";
    context.lineWidth = v === 0 || v === 1 ? 1.2 : 1;
    context.stroke();
    context.fillStyle = "#928a99";
    context.fillText(String(v), 8, y);
  }
  context.restore();
}

function renderUvInspector(timestamp = performance.now(), force = false) {
  if (!hairState.state.uvCheckerEnabled || !uvInspectorWindow.open) return;
  if (!force && !hairState.state.uvInspectorDirty) return;
  hairState.state.uvInspectorDirty = false;
  const width = Math.max(240, Math.round(uvInspectorCanvas.clientWidth));
  const height = Math.max(220, Math.round(uvInspectorCanvas.clientHeight));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvasWidth = Math.round(width * pixelRatio);
  const canvasHeight = Math.round(height * pixelRatio);
  if (uvInspectorCanvas.width !== canvasWidth || uvInspectorCanvas.height !== canvasHeight) {
    uvInspectorCanvas.width = canvasWidth;
    uvInspectorCanvas.height = canvasHeight;
  }
  const context = uvInspectorCanvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#151218";
  context.fillRect(0, 0, width, height);

  const records = uvInspectorRecords();
  const allPoints = records.flatMap((record) => record.points);
  if (!allPoints.length) {
    context.fillStyle = "#928a99";
    context.font = "14px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("No mesh UV data", width / 2, height / 2);
    uvInspectorStatus.textContent = "No UV data";
    return;
  }

  const bounds = uvCoordinateBounds(allPoints);
  const transform = uvViewTransform(bounds, width, height, 32);
  drawUvInspectorGrid(context, bounds, transform, width, height);
  const orderedRecords = [...records].sort((a, b) => (
    Number(a.lock.id === sel.state.selectedId) - Number(b.lock.id === sel.state.selectedId)
  ));
  orderedRecords.forEach(({ lock, points, faces }) => {
    const selected = lock.id === sel.state.selectedId || sel.state.selectedStrandIds.has(lock.id);
    context.fillStyle = selected ? "rgba(255, 79, 216, 0.12)" : "rgba(221, 215, 226, 0.025)";
    context.strokeStyle = selected ? "#ff4fd8" : "rgba(221, 215, 226, 0.46)";
    context.lineWidth = selected ? 1.5 : 0.75;
    faces.forEach((face) => {
      if (face.length < 3 || face.some((index) => !points[index])) return;
      context.beginPath();
      face.forEach((index, faceIndex) => {
        const [x, y] = transform.project(points[index][0], points[index][1]);
        if (faceIndex === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fill();
      context.stroke();
    });
  });
  const faceCount = records.reduce((sum, record) => sum + record.faces.length, 0);
  uvInspectorStatus.textContent = `${records.length} meshes \u2022 ${faceCount} UV faces \u2022 U ${bounds.minU.toFixed(2)}\u2013${bounds.maxU.toFixed(2)} \u2022 V ${bounds.minV.toFixed(2)}\u2013${bounds.maxV.toFixed(2)}${hairState.state.uvCheckerPreview ? " \u2022 export layout" : ""}`;
}

function setUvCheckerEnabled(enabled) {
  hairState.state.uvCheckerEnabled = Boolean(enabled);
  invalidateUvInspector();
  if (hairState.state.uvCheckerEnabled) {
    if (!hairState.state.uvCheckerTexture) hairState.state.uvCheckerTexture = createUvCheckerTexture();
    locks.forEach(ensureUvCheckerForLock);
    if (!uvInspectorWindow.open) uvInspectorWindow.show();
    renderUvInspector(performance.now(), true);
  } else {
    restoreUvCheckerPreview();
    locks.forEach(removeUvCheckerFromLock);
    if (uvInspectorWindow.open) uvInspectorWindow.close();
  }
  toggleUvCheckerButton.classList.toggle("active", hairState.state.uvCheckerEnabled);
  toggleUvCheckerButton.setAttribute("aria-pressed", String(hairState.state.uvCheckerEnabled));
  uvCheckerMenuState.textContent = hairState.state.uvCheckerEnabled ? "On" : "Off";
}

// 导出 UV 预览：按刷新按钮时走完整导出展开流程（buildUnfoldedMeshes，与 exportHairObj/
// exportHairUsda 同一条管线，UV 已打包进 [0,1]²），把每个 lock 视口 mesh 的几何临时替换成
// 平铺预览几何（position + 打包 uv + quad→三角），让棋盘格按导出布局显示；2D UV Inspector
// 因读的是 mesh.geometry 的 uv，自动画出打包后的拓扑。关闭 checker / 几何重建 / 删除时恢复
// 原几何（lock.uvCheckerOriginalGeometry），构建流程不受预览影响。
function buildUvCheckerPreviewGeometry(unfoldedMesh) {
  const positions = unfoldedMesh?.positions;
  const uvs = unfoldedMesh?.uvs;
  const faces = unfoldedMesh?.faces;
  if (!positions?.length || !uvs?.length || !Array.isArray(faces)) return null;
  const triangles = [];
  faces.forEach((face) => {
    if (face.length === 4) triangles.push(face[0], face[1], face[2], face[0], face[2], face[3]);
    else if (face.length === 3) triangles.push(face[0], face[1], face[2]);
  });
  if (!triangles.length) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(triangles);
  geometry.computeVertexNormals();
  return geometry;
}

function restoreUvCheckerPreview() {
  if (!hairState.state.uvCheckerPreview) return;
  locks.forEach((lock) => {
    const original = lock.uvCheckerOriginalGeometry;
    if (!original || !lock?.mesh) return;
    const preview = lock.mesh.geometry;
    if (preview !== original) {
      lock.mesh.geometry = original;
      if (preview) preview.dispose();
    }
    lock.uvCheckerOriginalGeometry = null;
  });
  hairState.state.uvCheckerPreview = false;
  invalidateUvInspector();
}

function applyUvCheckerPreview(unfolded) {
  if (!unfolded || !unfolded.size) return;
  locks.forEach((lock) => {
    const mesh = lock?.mesh;
    if (!mesh?.geometry) return;
    const unfoldedMesh = unfolded.get(lock.id);
    if (!unfoldedMesh) return;
    const previewGeometry = buildUvCheckerPreviewGeometry(unfoldedMesh);
    if (!previewGeometry) return;
    lock.uvCheckerOriginalGeometry = mesh.geometry;
    mesh.geometry = previewGeometry;
  });
  hairState.state.uvCheckerPreview = true;
}

async function refreshUvCheckerPreview() {
  if (!hairState.state.uvCheckerEnabled) return;
  const originalButtonText = refreshUvCheckerButton.textContent;
  const originalButtonTitle = refreshUvCheckerButton.getAttribute("title");
  const originalStatusText = uvInspectorStatus.textContent;
  refreshUvCheckerButton.disabled = true;
  refreshUvCheckerButton.textContent = "Packing…";
  uvInspectorStatus.textContent = "Packing export UV layout…";
  let rendered = false;
  try {
    restoreUvCheckerPreview();
    const unfolded = await fileApi.buildUnfoldedMeshes();
    if (!unfolded || !unfolded.size) return; // 无展开结果时静默跳过（保持原几何 + 原 UV）
    applyUvCheckerPreview(unfolded);
    locks.forEach(ensureUvCheckerForLock);
    invalidateUvInspector();
    renderUvInspector(performance.now(), true);
    rendered = true;
  } finally {
    refreshUvCheckerButton.disabled = false;
    refreshUvCheckerButton.textContent = originalButtonText;
    if (originalButtonTitle !== null) refreshUvCheckerButton.setAttribute("title", originalButtonTitle);
    else refreshUvCheckerButton.removeAttribute("title");
    // 异常或空结果路径未走到 renderUvInspector，恢复原状态文本。
    if (!rendered) uvInspectorStatus.textContent = originalStatusText;
  }
}

function strandViewportBaseColor(lock) {
  if (lock.locked) {
    const mutedColor = new THREE.Color(materialApi.strandDisplayColor(lock));
    mutedColor.lerp(new THREE.Color(0x747780), 0.18);
    return `#${mutedColor.getHexString()}`;
  }
  if (sculptBrushSelectionMaskActive()) {
    if (sculptBrushSelectionAllows(lock)) return materialApi.strandDisplayColor(lock);
    const maskedColor = new THREE.Color(materialApi.strandDisplayColor(lock));
    maskedColor.multiplyScalar(0.28);
    return `#${maskedColor.getHexString()}`;
  }
  if (proportionalStrandVisualsActive(lock)) return 0xffffff;
  const selectedLock = getSelectedLock();
  const selectedClumpId = sel.state.clumpViewportSelection ? selectedLock?.clumpId : null;
  const inSelectedClump = selectedClumpId && lock.clumpId === selectedClumpId;
  if (inSelectedClump) return lock.id === sel.state.selectedId ? 0x76d4d9 : 0x5bbec4;
  if (lock.id === sel.state.selectedId) {
    const selectedColor = new THREE.Color(materialApi.strandDisplayColor(lock));
    selectedColor.lerp(new THREE.Color(STRAND_SELECTION_OUTLINE_COLOR), 0.12);
    return `#${selectedColor.getHexString()}`;
  }
  if (sel.state.selectedStrandIds.has(lock.id)) {
    const selectedColor = new THREE.Color(materialApi.strandDisplayColor(lock));
    selectedColor.lerp(new THREE.Color(STRAND_SELECTION_OUTLINE_COLOR), 0.08);
    return `#${selectedColor.getHexString()}`;
  }
  if (strandMirrorPartnerHighlighted(lock)) {
    const mirrorColor = new THREE.Color(materialApi.strandDisplayColor(lock));
    mirrorColor.lerp(new THREE.Color(STRAND_MIRROR_OUTLINE_COLOR), 0.12);
    return `#${mirrorColor.getHexString()}`;
  }
  return materialApi.strandDisplayColor(lock);
}

function strandMirrorPartnerHighlighted(lock) {
  if (!lock || sel.state.selectedStrandIds.has(lock.id)) return false;
  const partner = mirrorPartnerFor(lock);
  return Boolean(partner && sel.state.selectedStrandIds.has(partner.id));
}

function syncStrandSelectionOutline(lock) {
  const outline = lock?.selectionOutline;
  if (!outline?.material?.uniforms?.uColor) return;
  const selected = sel.state.selectedStrandIds.has(lock.id);
  const mirrorPartnerHighlighted = strandMirrorPartnerHighlighted(lock);
  outline.visible = Boolean(selected || mirrorPartnerHighlighted);
  outline.material.uniforms.uColor.value.set(
    mirrorPartnerHighlighted ? STRAND_MIRROR_OUTLINE_COLOR : STRAND_SELECTION_OUTLINE_COLOR
  );
}

function applyLockedStrandPalette(material) {
  if (material?.userData?.hairShader !== ANIME_ANISOTROPIC_SHADER) return;
  const definition = material.userData.definition;
  material.uniforms.uShadowColor.value.set(definition.animeShadowColor).lerp(new THREE.Color(0x35373d), 0.2);
  material.uniforms.uSoftShadowColor.value.set(definition.animeSoftShadowColor).lerp(new THREE.Color(0x4d5057), 0.2);
  material.uniforms.uHighlightColor.value.set(definition.animeHighlightColor).lerp(new THREE.Color(0x858993), 0.2);
  material.uniforms.uRimColor.value.set(definition.animeRimColor).lerp(new THREE.Color(0x767983), 0.2);
}

function syncLockedStrandWireVisual(lock) {
  const overlay = lock?.wireOverlay;
  const uniforms = overlay?.material?.uniforms;
  if (!uniforms) return;
  uniforms.lineColor.value.set(lock.locked ? 0xff4fd8 : 0x66f5ff);
  uniforms.opacity.value = lock.locked ? 0.25 : 0.72;
  overlay.visible = Boolean(lock.locked || hairState.state.hairTopologyVisible || clumpProceduralApi.proceduralParentOutlineVisible(lock));
}

function setStrandSelectionVisual(lock) {
  const material = lock?.mesh?.material;
  if (!material) return;
  if (material.userData.uvChecker === true) {
    material.color.set(0xffffff);
  } else {
    materialApi.setAnimeHairBaseColor(material, strandViewportBaseColor(lock));
    if (lock.locked) applyLockedStrandPalette(material);
  }
  material.emissive?.set(0x000000);
  if (material.emissiveIntensity !== undefined) material.emissiveIntensity = 1;
  syncStrandSelectionOutline(lock);
  clumpProceduralApi.syncProceduralParentVisibility(lock);
  syncLockedStrandWireVisual(lock);
}



function updateStrandSelectionHighlightForLock(item) {
  setStrandSelectionVisual(item);
}

function updateStrandSelectionHighlight() {
  locks.forEach(updateStrandSelectionHighlightForLock);
}

function refreshStrandCurveSelectionVisuals() {
  const lightweightObjectSelection = sculptState.state.viewportEditMode === "strand"
    && !componentEditModeActive()
    && !sculptBrushToolActive();
  if (lightweightObjectSelection) {
    locks.forEach((lock) => {
      if (lock.curveObjects?.group) lock.curveObjects.group.visible = false;
    });
    return;
  }
  locks.forEach((item) => updateCurveObjects(item, { visible: item.id === sel.state.selectedId }));
}

function resetGuideSelectionVisuals() {
  guides.forEach((guide) => {
    if (guide.type === "capsule") guideApi.updateCapsuleGuideDisplayColor(guide);
    else {
      guide.mesh.material.color.set(guide.color);
      guide.wire.material.color.set(guide.color);
    }
    if (guide.rootMesh) guide.rootMesh.material.color.set(guide.color);
    if (guide.rootWire) guide.rootWire.material.color.set(guide.color);
    guide.mesh.material.opacity = Math.min(guide.opacity, 0.16);
    if (guide.rootMesh) guide.rootMesh.material.opacity = guide.mesh.material.opacity;
    guide.wire.material.opacity = 0.25;
    if (guide.type === "capsule") guideApi.updateCapsuleGuideWireOpacity(guide, false);
    else if (guide.controlWire) guide.controlWire.material.opacity = 0.25;
    if (guide.rootWire) guide.rootWire.material.opacity = 0.25;
    if (guide.handlesGroup) guide.handlesGroup.visible = false;
    if (guide.loopLinesGroup) guide.loopLinesGroup.visible = false;
  });
}

function refreshStrandSelectionConsumers({
  updateGeometry = false,
  updateTopology = false,
  syncActiveInputs = false
} = {}) {
  const lock = getSelectedLock();
  taperEditor.retargetOpenTaperCurveEditor(lock);
  resetGuideSelectionVisuals();
  updateStrandSelectionHighlight();
  refreshStrandCurveSelectionVisuals();
  invalidateUvInspector();
  const validStrandObjectTransform = Boolean(lock)
    && !componentEditModeActive()
    && transformControls.object === strandObjectTransformHandle;
  if (!lock?.curveObjects?.handles.includes(transformControls.object) && !validStrandObjectTransform) {
    transformControls.detach();
    sel.state.selectedPoint = null;
  }
  if (updateGeometry) locks.forEach((item) => updateLockGeometry(item));
  renderLockList();
  updateAttributeEditorMode();
  guideApi.updateGuideControlsVisibility();
  updateSelectedPointLabel();
  if (updateTopology) updateTopologyStats();
  refreshRebuildCurveDialog();
  if (proceduralDuplicateDialog.open && !sculptState.state.rebuildingProceduralDuplicatePreview) {
    proceduralDuplicateApi.rebuildProceduralDuplicatePreview({ updateSources: true });
  }
  if (syncActiveInputs && lock) syncInputs(lock);
  if (!componentEditModeActive() && sculptState.state.viewportEditMode === "strand") attachStrandObjectTransform();
  syncStrandObjectTransformPanel();
  syncMoveCurveControls();
  return lock;
}

function selectLock(id, options = {}) {
  setViewportEditMode("strand", { clearSelection: false, activateSelect: false });
  setOutlinerTab("strands");
  const requestedLock = locks.find((lock) => lock.id === id);
  const requestedGuide = clumpProceduralApi.clumpGuideForLock(requestedLock);
  const selectWholeClump = Boolean(requestedLock?.clumpId && requestedGuide && !options.individualClumpMember);
  if (selectWholeClump) id = requestedGuide.id;
  const requestedIds = selectWholeClump
    ? locks.filter((lock) => lock.clumpId === requestedGuide.clumpId).map((lock) => lock.id)
    : id ? [id] : [];
  const selectionMode = options.selectionMode;
  const nextSelection = resolveStrandSelection({
    ...currentStrandSelectionState(),
    requestedId: id,
    requestedIds,
    explicitSelectedIds: options.selectedIds,
    selectionMode,
    validIds: locks.map((lock) => lock.id)
  });
  applyStrandSelectionState(nextSelection);
  id = nextSelection.activeId;
  // Switching the main selection invalidates any tip sub-bone selection/hover that
  // belonged to the previously selected lock (e.g. alt+click switching to another
  // panel or strand), so its emphasis highlight does not linger.
  // 0.2.126 起这一条同时覆盖 panel 段与普通发丝管（tipSelection 已是几何无关键），因此
  // **只有这一处**清理路径 —— 不要为发丝再加第二处。
  // 注意与 resolveSegmentSelection 的分工：这里清的是「换 lock 后指向旧 lock 的悬空选择」；
  // 「同一 lock 内删段/删管后残留的越界段号」由 resolveSegmentSelection 的钳位负责。
  if (sculptState.state.tipSelection && sculptState.state.tipSelection.lockId !== id) {
    sculptState.state.tipSelection = null;
  }
  if (sculptState.state.tipHover && sculptState.state.tipHover.lockId !== id) {
    sculptState.state.tipHover = null;
  }
  if (sculptState.state.panelSplitSelection && sculptState.state.panelSplitSelection.lockId !== id) {
    sculptState.state.panelSplitSelection = null;
  }
  if (sculptState.state.strandSplitSelection && sculptState.state.strandSplitSelection.lockId !== id) {
    sculptState.state.strandSplitSelection = null;
  }
  guideApi.clearMultiPointSelection();
  const selectedCurveSurfaceLock = locks.find((item) => item.id === sel.state.selectedId && item.geometryType === "curve-surface");
  const requestedControllerIndex = Math.round(Number(options.curveSurfaceControllerIndex));
  sel.state.selectedCurveSurfaceController = selectedCurveSurfaceLock
    && Number.isInteger(requestedControllerIndex)
    && requestedControllerIndex >= 0
    && requestedControllerIndex < selectedCurveSurfaceLock.curveSurfaceColumns
      ? { lockId: selectedCurveSurfaceLock.id, index: requestedControllerIndex }
      : null;
  sel.state.clumpViewportSelection = selectWholeClump && !selectionMode;
  sel.state.selectedStrandGroup = null;
  sel.state.selectedGuideId = undefined;
  sel.state.selectedReferenceImageId = null;
  sel.state.selectedSurfaceObjectAnchorId = null;
  sel.state.selectedCurveLatticePoint = null;
  curveLatticeToggle.classList.remove("active");
  curveLatticeToggle.setAttribute("aria-pressed", "false");
  filterCurveLatticesToGroup(null);
  const lock = getSelectedLock();
  if (
    (lock?.geometryType === "surface" && ["rotate", "scale", "relax"].includes(sel.state.activeTool))
    || (lock?.geometryType === "curve-surface" && ["scale", "relax"].includes(sel.state.activeTool))
  ) {
    setActiveTool("move");
  }
  refreshStrandSelectionConsumers({
    syncActiveInputs: true
  });
  taperEditor.retargetFloatingStrandEditors();
  branchRegion.retargetBranchRegionEditor();
}

function deselectStrandsForGuideEditor() {
  const hasStrandSelection = Boolean(
    sel.state.selectedId
    || sel.state.selectedStrandGroup
    || sel.state.selectedPoint
    || sel.state.selectedControlPoints.some((point) => point.type === "strand")
  );
  if (!hasStrandSelection) return;
  selectLock(undefined);
}

function syncGroupInputs() {
  if (!sel.state.selectedStrandGroup) return;
  const defaults = groupDefaultsFor(sel.state.selectedStrandGroup);
  Object.entries(groupInputs).forEach(([key, input]) => {
    input.value = defaults[key];
  });
  topologyValues.groupRadialSegments.textContent = groupInputs.radialSegments.value;
  topologyValues.groupLengthSegments.textContent = groupInputs.lengthSegments.value;
  topologyValues.groupDensityAggression.textContent = Number(defaults.densityAggression ?? 0.5).toFixed(2);
  topologyValues.groupTwistDensity.textContent = Number(defaults.twistDensity ?? 0.5).toFixed(2);
  groupDynamicDensityInput.checked = Boolean(defaults.dynamicDensity);
  groupInputs.densityAggression.disabled = !defaults.dynamicDensity;
  groupInputs.twistDensity.disabled = !defaults.dynamicDensity;
  HAIR_LAYERS.forEach((layer) => {
    const input = groupLayerInputs[layer.id];
    const value = Number(defaults.layerOffsets?.[layer.id] ?? layer.defaultOffset);
    input.value = value;
    document.querySelector(`#${input.id}Value`).textContent = value.toFixed(2);
  });
  document.querySelector("#groupLengthScaleValue").textContent = Number(defaults.lengthScale ?? 1).toFixed(2);
  document.querySelector("#groupWidthScaleValue").textContent = Number(defaults.widthScale ?? 1).toFixed(2);
  document.querySelector("#groupDepthScaleValue").textContent = Number(defaults.depthScale ?? 1).toFixed(2);
  document.querySelector("#groupRootScalpOffsetValue").textContent = Number(groupInputs.rootScalpOffset.value).toFixed(2);
  document.querySelector("#groupProfileOffsetValue").textContent = Number(defaults.profileOffset || 0).toFixed(2);
  renderProfilePreview(profilePreviewPaths.group, defaults.sweepProfile, defaults.profileOffset, defaults);
  taperEditor.renderTaperPreview(taperPreviewPaths.group, defaults, "taperCurve");
  taperEditor.renderTaperPreview(taperPreviewPaths.groupDepth, defaults, "depthCurve");
  const group = STRAND_GROUPS.find((item) => item.id === sel.state.selectedStrandGroup);
  groupSettingsTitle.textContent = group ? strandRegionDisplayLabel(group.id) : "Group Settings";
  updateTopologyStats();
  presetLibraryApi.syncShapePresetSelects();
}

function topologyStatsForLock(lock) {
  const geometry = lock?.mesh?.geometry;
  return {
    vertices: geometry?.getAttribute("position")?.count || 0,
    triangles: geometry?.getIndex() ? geometry.getIndex().count / 3 : (geometry?.getAttribute("position")?.count || 0) / 3
  };
}

function formatTopologyStats(vertices, triangles) {
  return `${Math.round(vertices).toLocaleString()} verts / ${Math.round(triangles).toLocaleString()} tris`;
}

function updateTopologyStats() {
  const selectedLock = getSelectedLock();
  const selectedLocks = selectedLocksInOrder();
  const strandStats = (selectedLocks.length ? selectedLocks : selectedLock ? [selectedLock] : [])
    .reduce((totals, lock) => {
      const stats = topologyStatsForLock(lock);
      totals.vertices += stats.vertices;
      totals.triangles += stats.triangles;
      return totals;
    }, { vertices: 0, triangles: 0 });
  strandTopologyStats.textContent = formatTopologyStats(strandStats.vertices, strandStats.triangles);
  viewportSelectedStats.textContent = selectedLock || selectedLocks.length
    ? formatTopologyStats(strandStats.vertices, strandStats.triangles)
    : "-- verts / -- tris";

  const totalStats = locks.reduce((totals, lock) => {
    const stats = topologyStatsForLock(lock);
    totals.vertices += stats.vertices;
    totals.triangles += stats.triangles;
    return totals;
  }, { vertices: 0, triangles: 0 });
  viewportTotalStats.textContent = formatTopologyStats(totalStats.vertices, totalStats.triangles);

  const groupStats = locks
    .filter((lock) => (lock.scalpRegion || "unassigned") === sel.state.selectedStrandGroup)
    .reduce((totals, lock) => {
      const stats = topologyStatsForLock(lock);
      totals.vertices += stats.vertices;
      totals.triangles += stats.triangles;
      return totals;
    }, { vertices: 0, triangles: 0 });
  groupTopologyStats.textContent = formatTopologyStats(groupStats.vertices, groupStats.triangles);
}

function normalizeStrandDimensions(target) {
  if (!target || target === braidCreationDefaults || ["braid", "panel", "surface", "curve-surface"].includes(target.geometryType)) return target;
  const widthScale = Number(target.widthScale ?? 1);
  const depthScale = Number(target.depthScale ?? 1);
  if (Math.abs(widthScale - 1) < 1e-6 && Math.abs(depthScale - 1) < 1e-6) return target;
  const width = Number(target.width ?? 0.16);
  target.width = width * widthScale;
  target.baseWidth = Number(target.baseWidth ?? width) * widthScale;
  target.depth = Number(target.depth ?? 0.16) * depthScale;
  target.widthScale = 1;
  target.depthScale = 1;
  return target;
}

function strandBaseWidth(target) {
  return Math.max(0.0001, Number(target?.baseWidth ?? target?.width ?? 0.16));
}

function strandWidthDimension(target) {
  if (isPanelGeometry(target)) return Math.max(0.0001, Number(target?.width ?? 0.62));
  if (target?.geometryType === "braid") {
    return Math.max(0.0001, Number(target.braidWidth ?? 0.34) * Number(target.widthScale ?? 1));
  }
  return strandBaseWidth(target) * Number(target?.widthScale ?? 1);
}

function strandDepthDimension(target) {
  if (isPanelGeometry(target)) return Math.max(0.0001, Number(target?.panelThickness ?? 0.08));
  if (target?.geometryType === "braid") {
    return Math.max(0.0001, Number(target.braidDepth ?? 0.44) * Number(target.depthScale ?? 1));
  }
  return Number(target?.depth ?? 0.16) * Number(target?.depthScale ?? 1);
}

function setStrandWidthDimension(target, width) {
  if (!target) return;
  const previousWidth = strandWidthDimension(target);
  const minimum = isPanelGeometry(target) ? 0.08 : target.geometryType === "braid" ? 0.05 : 0.01;
  const maximum = isPanelGeometry(target) || target.geometryType === "braid" ? 2.5 : 3;
  const nextWidth = THREE.MathUtils.clamp(Number(width), minimum, maximum);
  if (target.geometryType === "surface") curveSurfaceCreate.scaleSurfaceLatticeWidth(target, previousWidth, nextWidth);
  if (isPanelGeometry(target)) {
    target.width = nextWidth;
    target.baseWidth = nextWidth;
  } else if (target.geometryType === "braid") {
    target.braidWidth = nextWidth;
    target.width = nextWidth;
    target.baseWidth = nextWidth;
    target.widthScale = 1;
  } else {
    target.width = nextWidth;
    target.baseWidth = nextWidth;
    target.widthScale = 1;
  }
}

function setStrandDepthDimension(target, depth) {
  if (!target) return;
  const minimum = isPanelGeometry(target) ? 0.01 : target.geometryType === "braid" ? 0.05 : 0.01;
  const maximum = isPanelGeometry(target) || target.geometryType === "braid" ? 2.5 : 3;
  const nextDepth = THREE.MathUtils.clamp(Number(depth), minimum, maximum);
  if (isPanelGeometry(target)) {
    target.panelThickness = nextDepth;
  } else if (target.geometryType === "braid") {
    target.braidDepth = nextDepth;
    target.depthScale = 1;
  } else {
    target.depth = nextDepth;
    target.depthScale = 1;
  }
}

function syncShapeDimensionInputs(target) {
  if (target === panelCreationDefaults || isPanelGeometry(target)) return;
  const braidTarget = target === braidCreationDefaults || target?.geometryType === "braid";
  if (braidTarget) {
    presetLibraryApi.normalizeBraidDimensions(target);
    if (target?.geometryType === "braid") presetLibraryApi.normalizeBraidDimensions(mirrorPartnerFor(target));
    widthScaleLabel.textContent = "Width";
    depthScaleLabel.textContent = "Depth";
    inputs.widthScale.min = braidWidthInput.min;
    inputs.widthScale.max = braidWidthInput.max;
    inputs.depthScale.min = braidDepthInput.min;
    inputs.depthScale.max = braidDepthInput.max;
    inputs.widthScale.value = target.braidWidth;
    inputs.depthScale.value = target.braidDepth;
    document.querySelector("#widthScaleValue").textContent = Number(target.braidWidth).toFixed(2);
    document.querySelector("#depthScaleValue").textContent = Number(target.braidDepth).toFixed(2);
    braidWidthInput.value = target.braidWidth;
    braidDepthInput.value = target.braidDepth;
    braidWidthValue.textContent = Number(target.braidWidth).toFixed(2);
    braidDepthValue.textContent = Number(target.braidDepth).toFixed(2);
    return;
  }
  normalizeStrandDimensions(target);
  if (target?.geometryType !== "braid") normalizeStrandDimensions(mirrorPartnerFor(target));
  widthScaleLabel.textContent = "Width";
  depthScaleLabel.textContent = "Depth";
  inputs.widthScale.min = "0.01";
  inputs.widthScale.max = "3";
  inputs.depthScale.min = "0.01";
  inputs.depthScale.max = "3";
  inputs.widthScale.value = strandBaseWidth(target);
  inputs.depthScale.value = strandDepthDimension(target);
  document.querySelector("#widthScaleValue").textContent = strandBaseWidth(target).toFixed(2);
  document.querySelector("#depthScaleValue").textContent = strandDepthDimension(target).toFixed(2);
}

function syncCreationShapeInputs() {
  const defaults = activeCreationShapeDefaults();
  strandLayerInput.value = normalizeHairLayer(defaults.hairLayer);
  taperEditor.renderTaperPreview(taperPreviewPaths.strand, defaults, "taperCurve");
  taperEditor.renderTaperPreview(taperPreviewPaths.strandDepth, defaults, "depthCurve");
  branchSweep.renderTwistCurvePreview(strandTwistCurvePreview, defaults);
  renderProfilePreview(profilePreviewPaths.strand, defaults.sweepProfile, defaults.profileOffset, defaults);
  syncShapeDimensionInputs(defaults);
  inputs.profileOffset.value = defaults.profileOffset;
  document.querySelector("#profileOffsetValue").textContent = Number(defaults.profileOffset).toFixed(2);
  inputs.rootScalpOffset.value = defaults.rootScalpOffset;
  document.querySelector("#rootScalpOffsetValue").textContent = Number(defaults.rootScalpOffset).toFixed(2);
  inputs.strandRotation.value = defaults.strandRotation;
  strandRotationValue.textContent = `${Math.round(Number(defaults.strandRotation ?? 0))}°`;
  inputs.twist.value = THREE.MathUtils.clamp(defaults.twist, Number(inputs.twist.min), Number(inputs.twist.max));
  twistNumberInput.value = Number(defaults.twist).toFixed(2);
  if (defaults === strandCreationDefaults) {
    drawStrandBrushSizeInput.value = defaults.width;
    drawStrandBrushSizeValue.textContent = Number(defaults.width).toFixed(2);
    drawStrandCurlCountInput.value = defaults.curlCount;
    drawStrandCurlDisplacementInput.value = defaults.curlDisplacement;
    drawStrandCurlCountValue.textContent = Number(defaults.curlCount).toFixed(2);
    drawStrandCurlDisplacementValue.textContent = Number(defaults.curlDisplacement).toFixed(2);
    syncStrandSplitInputs(defaults);
    syncStrandTipInputs(defaults);
  }
  syncHairCardControls(defaults);
  if (defaults === braidCreationDefaults) {
    braidMeshPresetInput.value = defaults.braidMeshPreset;
    braidSegmentLengthInput.value = defaults.braidSegmentLength;
    braidRotationInput.value = defaults.braidRotation;
    braidSegmentLengthValue.textContent = Number(defaults.braidSegmentLength).toFixed(2);
    braidRotationValue.textContent = `${Math.round(Number(defaults.braidRotation))} deg`;
  }
  if (defaults === panelCreationDefaults) segmentApi.syncPanelShapeInputs(defaults);
  presetLibraryApi.syncShapePresetSelects();
  syncViewportDrawSettings();
}

function syncViewportDrawSettings() {
  const drawSettingsVisible = !scalpState.state.scalpBuilderEditing
    && !scalpState.state.scalpPaintEditing
    && !scalpState.state.scalpShapeEditing
    && !sculptState.state.headSetupEditing
    && !sculptState.state.capsuleGuideEditing;
  viewportEditModeControl.classList.remove("hidden");
  viewportEditModeControl.setAttribute("aria-hidden", "false");
  viewportDrawSettings.classList.toggle("hidden", !drawSettingsVisible);
  viewportDrawSettings.setAttribute("aria-hidden", String(!drawSettingsVisible));
  drawSurfaceDynamicButton.disabled = drawFlowApi.activeStrokeSurfaceValue() === "contextual-plane";
  viewportDrawLayerInput.value = normalizeHairLayer(strandCreationDefaults.hairLayer);
  syncViewportTopControlRows();
}

function syncViewportTopControlRows() {
  if (!viewportTopControls || !viewportEditModeControl || !viewportPanel) return;
  const groups = [viewportDisplayActions, viewportDrawSettings, viewportModes]
    .filter((group) => group && !group.classList.contains("hidden"));
  const workspaceBounds = viewportEditModeControl.getBoundingClientRect();
  viewportTopControls.style.setProperty("--viewport-top-controls-overlap-shift", "0px");
  viewportTopControls.classList.remove("two-row");
  const oneRowLeft = Math.min(...groups.map((group) => group.getBoundingClientRect().left));
  const useTwoRows = oneRowLeft - workspaceBounds.right <= 4;
  viewportTopControls.classList.toggle("two-row", useTwoRows);
  const liveSurfaceLeft = viewportDrawSettings.classList.contains("hidden")
    ? Infinity
    : viewportDrawSettings.getBoundingClientRect().left;
  const overlapShift = useTwoRows
    ? Math.max(0, workspaceBounds.right + 4 - liveSurfaceLeft)
    : 0;
  viewportTopControls.style.setProperty("--viewport-top-controls-overlap-shift", `${overlapShift}px`);
  syncResponsiveSidebarDock();
}

function syncResponsiveSidebarDock() {
  const viewportWidth = document.documentElement.clientWidth;
  const docked = document.body.classList.contains("compact-sidebar-docked");
  if (viewportWidth <= 860) {
    document.body.classList.remove("compact-sidebar-docked");
    miscState.state.compactSidebarDockActivationWidth = null;
    return;
  }
  if (docked) {
    if (miscState.state.compactSidebarDockActivationWidth !== null && viewportWidth > miscState.state.compactSidebarDockActivationWidth) {
      document.body.classList.remove("compact-sidebar-docked");
      window.requestAnimationFrame(syncViewportTopControlRows);
    }
    return;
  }
  const layerControl = viewportDrawLayerInput.closest("label");
  if (!layerControl || viewportDrawSettings.classList.contains("hidden")) return;
  const viewportBounds = viewportPanel.getBoundingClientRect();
  const workspaceBounds = viewportEditModeControl.getBoundingClientRect();
  const layerBounds = layerControl.getBoundingClientRect();
  const floatingPanels = document.body.classList.contains("floating-side-panels");
  const effectiveViewportLeft = viewportBounds.left + (floatingPanels ? outlinerPanel.getBoundingClientRect().width : 0);
  const effectiveViewportRight = viewportBounds.right - (floatingPanels ? toolPanel.getBoundingClientRect().width : 0);
  const workspaceLeftMargin = workspaceBounds.left - effectiveViewportLeft;
  const layerRightMargin = effectiveViewportRight - layerBounds.right;
  if (layerRightMargin > workspaceLeftMargin) return;
  miscState.state.compactSidebarDockActivationWidth = viewportWidth + Math.max(0, workspaceLeftMargin - layerRightMargin);
  document.body.classList.add("compact-sidebar-docked");
}




function syncStrandSplitInputs(target = taperEditor.activeStrandShapeTarget()) {
  if (!target || target.geometryType && target.geometryType !== "strand") return;
  strandSplitInputs.strandSplitEnabled.checked = Boolean(target.strandSplitEnabled);
  syncStrandSplitControls(target);
  syncStrandSplitTipInputs(target);
  // 与 syncPanelShapeInputs 末尾调用 syncPanelSegmentControls 同构：段数随 zipper 增删
  // 变化，段控件必须跟着同一入口刷新（否则段号会停在已不存在的段上）。
  segmentApi.syncStrandSegmentControls(target);
}

// 同步 strand Zipper Controls 计数 + 边界禁用（mirror syncPanelShapeInputs 的 zipper 部分）。
function syncStrandSplitControls(target = taperEditor.activeStrandShapeTarget()) {
  if (!target || (target.geometryType && target.geometryType !== "strand")) return;
  const splits = cloneStrandSplits(target.strandSplits, target.strandSplitPosition, target.strandSplitHeight, STRAND_SPLIT_MAX);
  const enabled = Boolean(target.strandSplitEnabled);
  if (strandSplitCountValue) strandSplitCountValue.textContent = String(splits.length);
  // 分裂发丝至少保留 1 个拉链：<=1 时禁用移除（用 Split Geometry 开关归零）。
  if (removeStrandSplitButton) removeStrandSplitButton.disabled = !enabled || splits.length <= 1;
  // 除了条数上限，还要门控「最宽段是否放得下新拉链」——判据由 segment-control 的
  // canFitAnotherStrandSplit 单点定义（changeStrandSplitCount 的插入守卫消费同一个函数），
  // 这里刻意不复制边界/跨度算术：两边各算一遍时 N=7 会出现「按钮 enabled 但点击是静默 no-op」。
  if (addStrandSplitButton) {
    addStrandSplitButton.disabled = !enabled
      || splits.length >= STRAND_SPLIT_MAX
      || !canFitAnotherStrandSplit(splits);
  }
}

function currentStrandTipChain(target) {
  if (!target || target.geometryType !== "strand") return null;
  const curve = strandGeometryCurve(target);
  const count = Math.max(2, Array.isArray(target.points) ? target.points.length : 2);
  return materializeTipChain(target.strandTip, (t) => curve.getPoint(t), count);
}

function currentStrandTipLength(target, chain = currentStrandTipChain(target)) {
  if (!chain || !chain.points.length || !chain.restPoints.length) return 0;
  const rest = new THREE.CatmullRomCurve3(chain.restPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
  const restTangent = rest.getTangent(1).normalize();
  const last = chain.points[chain.points.length - 1];
  const restLast = chain.restPoints[chain.restPoints.length - 1];
  return new THREE.Vector3(last.x, last.y, last.z).sub(new THREE.Vector3(restLast.x, restLast.y, restLast.z)).dot(restTangent);
}

function syncStrandTipInputs(target = taperEditor.activeStrandShapeTarget()) {
  const strandTarget = Boolean(target && target.geometryType === "strand");
  const enabled = strandTarget && Boolean(target.strandTip && Array.isArray(target.strandTip.points) && target.strandTip.active !== false);
  strandTipInputs.strandTipEnabled.checked = enabled;
  const tipStart = strandTarget
    ? THREE.MathUtils.clamp(Number(target.strandTipStart ?? strandCreationDefaults.strandTipStart ?? 0.75), 0.2, 0.95)
    : Number(strandCreationDefaults.strandTipStart ?? 0.75);
  strandTipInputs.strandTipStart.value = String(tipStart);
  strandTipValues.strandTipStart.textContent = tipStart.toFixed(2);
  strandTipLengthInput.disabled = !enabled;
  const length = enabled ? currentStrandTipLength(target) : 0;
  strandTipLengthInput.value = String(length.toFixed(2));
  strandTipLengthValue.textContent = length.toFixed(2);
}

function currentStrandSplitTipChains(lock) {
  const bones = strandSplitBonesFor(lock);
  if (!bones) return null;
  const curve = strandGeometryCurve(lock);
  const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
  const lengthSegments = THREE.MathUtils.clamp(Math.max(Math.round(lock.lengthSegments || 26), curlSegments), 4, 256);
  const parameters = strandCurveParameters(lock, curve, lengthSegments);
  // 0.2.132：这里原本还要预算逐行 frame，只为给已删除的 opening 提供 frame.x（横向平移方向）。
  // rest 现在只需要曲线点或环心，两者都不用帧，故整趟 frame 预算随之删除。
  const storedRestCenters = lock.mesh?.geometry?.userData?.strandSplitRestCenters;
  const tubeRestCenters = Array.isArray(storedRestCenters)
    && storedRestCenters.length === bones.length
    && storedRestCenters.every((centers) => (
      Array.isArray(centers)
      && centers.length === parameters.length
      && centers.every((point) => (
        Number.isFinite(Number(point?.x))
        && Number.isFinite(Number(point?.y))
        && Number.isFinite(Number(point?.z))
      ))
    ))
    ? storedRestCenters
    : null;
  return bones.map((bone, tubeIndex) => {
    const restPointAt = (t) => {
      // 真源：几何写出的每管扫掠环心（strandSplitRestCenters）。0.2.120 物化空间要求视口
      // 与几何用**同一条** rest，所以只要环心可用就一律走它。
      if (tubeRestCenters) {
        const center = sampleCenterlinePoint(tubeRestCenters[tubeIndex], parameters, t);
        if (center) return new THREE.Vector3(center.x, center.y, center.z);
      }
      // 回退（环心尚未写出：刚加完 zipper、长度还不匹配的那一帧）= 主脊柱本身。
      // 0.2.132 前这里加的是 opening（baseWidth·spread·smoothstep·direction，即已删除的
      // 「整管横向平移」）；该语义移除后脊柱就是最接近管心的可得近似 —— 真正的管心还差一个
      // band 中心的横向偏移，但那需要 profile 多边形，这条回退路径拿不到。偏差无害：
      // materializeTipChain 会把 authored delta 重新叠加到新 rest 上（rest 变动本就是常态）。
      return curve.getPoint(t);
    };
    const count = Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2);
    return materializeTipChain(bone.tip || null, restPointAt, count);
  });
}

function currentStrandSplitTipLength(lock, chains = currentStrandSplitTipChains(lock)) {
  if (!chains || !chains.length) return 0;
  const chain = chains[0];
  if (!chain || !chain.points.length || !chain.restPoints.length) return 0;
  const rest = new THREE.CatmullRomCurve3(chain.restPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
  const restTangent = rest.getTangent(1).normalize();
  const last = chain.points[chain.points.length - 1];
  const restLast = chain.restPoints[chain.restPoints.length - 1];
  return new THREE.Vector3(last.x, last.y, last.z).sub(new THREE.Vector3(restLast.x, restLast.y, restLast.z)).dot(restTangent);
}

function syncStrandSplitTipInputs(target = taperEditor.activeStrandShapeTarget()) {
  const strandTarget = Boolean(target && target.geometryType === "strand" && target.strandSplitEnabled);
  const bones = strandTarget ? strandSplitBonesFor(target) : null;
  const enabled = Boolean(bones);
  strandSplitTipLengthInput.disabled = !enabled;
  resetStrandSplitTipsButton.disabled = !enabled;
  const length = enabled ? currentStrandSplitTipLength(target) : 0;
  strandSplitTipLengthInput.value = String(length.toFixed(2));
  strandSplitTipLengthValue.textContent = length.toFixed(2);
}

function syncHairCardControls(target = taperEditor.activeStrandShapeTarget()) {
  const strandTarget = target === strandCreationDefaults || target?.geometryType === "strand";
  const enabled = strandTarget && Boolean(target.hairCard);
  hairCardControl.classList.toggle("hair-card-hidden", !strandTarget);
  hairCardInput.checked = enabled;
  hairCardIncompatibleControls.forEach((control) => control.classList.toggle("hair-card-hidden", enabled));
}


function updateAttributeEditorMode() {
  const editingGroup = Boolean(sel.state.selectedStrandGroup);
  const editingStrand = Boolean(getSelectedLock());
  const selectedGuide = guideApi.getSelectedGuide();
  const editingGuide = sculptState.state.viewportEditMode === "guide" && Boolean(selectedGuide);
  const editingCapsuleGuide = editingGuide && selectedGuide.type === "capsule";
  const editingLegacyGuide = editingGuide && !editingCapsuleGuide;
  const canCreateCapsuleGuide = sculptState.state.viewportEditMode === "guide"
    && !selectedGuide
    && !scalpState.state.scalpBuilderEditing
    && !scalpState.state.scalpPaintEditing
    && !sculptState.state.headSetupEditing
    && !scalpState.state.scalpShapeEditing;
  const editingSelection = editingGroup || editingStrand;
  const editingCreationShape = creationToolActive() && !editingStrand;
  const selectedPoly = getSelectedLock()?.geometryType === "poly" ? getSelectedLock() : null;
  const selectedBraid = getSelectedLock()?.geometryType === "braid" ? getSelectedLock() : null;
  const selectedPanel = isPanelGeometry(getSelectedLock()) ? getSelectedLock() : null;
  const selectedSurface = getSelectedLock()?.geometryType === "surface" ? getSelectedLock() : null;
  const selectedCompound = getSelectedLock()?.geometryType === "curve-surface"
    && getSelectedLock()?.curveSurfaceCompoundProfile
    ? getSelectedLock()
    : null;
  const selectedCoil = getSelectedLock()?.geometryType === "strand" && getSelectedLock()?.curlEnabled
    ? getSelectedLock()
    : null;
  const transformToolActive = ["move", "rotate", "scale"].includes(sel.state.activeTool);
  const hierarchyToolActive = ["move", "rotate", "scale"].includes(sel.state.activeTool) && !pullMoveActive();
  const proportionalToolActive = hierarchyToolActive || sel.state.activeTool === "relax";
  const sculptProportionalToolActive = ["sculpt-move", "sculpt-smooth"].includes(sel.state.activeTool);
  groupSettingsPanel.classList.toggle("hidden", !editingGroup);
  guidePanel.classList.toggle("hidden", !editingLegacyGuide);
  guidePanel.hidden = !editingLegacyGuide;
  guidePanel.setAttribute("aria-hidden", String(!editingLegacyGuide));
  selectedStrandPanel.classList.toggle("hidden", !editingStrand || Boolean(selectedPoly));
  if (!editingStrand) clumpGuidePanel.classList.add("hidden");
  hairMaterialPanel.classList.remove("hidden");
  strandTopologyPanel.classList.toggle("hidden", !editingStrand || Boolean(selectedPanel) || Boolean(selectedPoly));
  transformToolPanel.classList.toggle("hidden", !transformToolActive);
  relaxToolPanel.classList.toggle("hidden", sel.state.activeTool !== "relax");
  const drawToolSettingsVisible = ["draw", "procedural-draw"].includes(sel.state.activeTool);
  drawStrandToolPanel.classList.toggle("hidden", !drawToolSettingsVisible);
  drawStrandToolTitle.textContent = sel.state.activeTool === "procedural-draw" ? "Procedural Draw Tool" : "Draw Strand Tool";
  clumpProceduralApi.syncProceduralAccessoryEditControls();
  drawBrushPresetInput.closest(".creation-preset-row")?.classList.toggle("hidden", sel.state.activeTool === "procedural-draw");
  drawContinueFromTipInput.closest(".toggle-row")?.classList.toggle("hidden", sel.state.activeTool === "procedural-draw");
  sculptMoveToolPanel.classList.toggle("hidden", !sculptBrushToolActive());
  updateSculptScaleModeRow();
  polyBrushToolPanel.classList.toggle("hidden", sel.state.activeTool !== "poly");
  loftSurfaceToolPanel.classList.toggle("hidden", sel.state.activeTool !== "surface-loft");
  curveSurfaceToolPanel.classList.toggle("hidden", sel.state.activeTool !== "curve-surface");
  braidToolPanel.classList.toggle("hidden", sel.state.activeTool !== "braid");
  panelStrandToolPanel.classList.toggle("hidden", sel.state.activeTool !== "panel");
  panelToolTitle.textContent = "Split Panel Tool";
  surfaceGuideToolPanel.classList.toggle(
    "hidden",
    sel.state.activeTool !== "draw-capsule-guide" && !sculptState.state.capsuleGuideEditing && !editingCapsuleGuide && !canCreateCapsuleGuide
  );
  capsuleGuideDrawSettings.classList.toggle("hidden", sel.state.activeTool !== "draw-capsule-guide");
  strandShapePanel.classList.toggle(
    "braid-context",
    Boolean(selectedBraid) || (!editingStrand && sel.state.activeTool === "braid")
  );
  strandShapePanel.classList.toggle(
    "panel-context",
    Boolean(selectedPanel) || (!editingStrand && sel.state.activeTool === "panel")
  );
  surfaceLatticeControls.classList.toggle("hidden", !selectedSurface);
  panelCurvatureControl.classList.toggle("hidden", Boolean(selectedSurface));
  panelTipCurveControl.classList.toggle("hidden", Boolean(selectedSurface));
  surfaceLatticeControls.hidden = !selectedSurface;
  panelCurvatureControl.hidden = Boolean(selectedSurface);
  panelTipCurveControl.hidden = Boolean(selectedSurface);
  // Scalp Conform 容器与 panelTipCurveControl 同规则隐藏（lattice 面板不适用程序化形变）。
  // 可选链：本文件加载时该 markup 可能尚未存在，缺失不得在启动路径上抛。
  panelScalpConformControls?.classList.toggle("hidden", Boolean(selectedSurface));
  if (panelScalpConformControls) panelScalpConformControls.hidden = Boolean(selectedSurface);
  compoundBridgeLoopsControl.classList.toggle("hidden", !selectedCompound);
  compoundBridgeSmoothingControl.classList.toggle("hidden", !selectedCompound);
  if (selectedSurface) {
    selectedSurface.panelCurvature = 0;
    selectedSurface.surfaceColumns = normalizeSurfaceLatticeCount(
      selectedSurface.surfaceColumns,
      DEFAULT_SURFACE_LATTICE_COLUMNS
    );
    selectedSurface.surfaceRows = normalizeSurfaceLatticeCount(
      selectedSurface.surfaceRows,
      DEFAULT_SURFACE_LATTICE_ROWS
    );
    surfaceLatticeColumnsInput.value = String(selectedSurface.surfaceColumns);
    surfaceLatticeColumnsValue.textContent = String(selectedSurface.surfaceColumns);
    surfaceLatticeRowsInput.value = String(selectedSurface.surfaceRows);
    surfaceLatticeRowsValue.textContent = String(selectedSurface.surfaceRows);
  }
  strandShapePanel.classList.remove("draw-context");
  if (selectedCoil) {
    drawStrandCurlCountInput.value = Number(selectedCoil.curlCount ?? 4);
    drawStrandCurlDisplacementInput.value = Number(selectedCoil.curlDisplacement ?? 0.18);
    drawStrandCurlCountValue.textContent = Number(selectedCoil.curlCount ?? 4).toFixed(2);
    drawStrandCurlDisplacementValue.textContent = Number(selectedCoil.curlDisplacement ?? 0.18).toFixed(2);
    drawStrandCurlCountInput.disabled = false;
    drawStrandCurlDisplacementInput.disabled = false;
  }
  if (selectedBraid) {
    const braid = selectedBraid;
    braidMeshPresetInput.value = braid.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET;
    braidWidthInput.value = braid.braidWidth;
    braidDepthInput.value = braid.braidDepth;
    braidSegmentLengthInput.value = braid.braidSegmentLength;
    braidRotationInput.value = braid.braidRotation;
    braidWidthValue.textContent = Number(braid.braidWidth).toFixed(2);
    braidDepthValue.textContent = Number(braid.braidDepth).toFixed(2);
    braidSegmentLengthValue.textContent = Number(braid.braidSegmentLength).toFixed(2);
    braidRotationValue.textContent = `${Math.round(Number(braid.braidRotation))} deg`;
  } else if (selectedPanel) {
    segmentApi.syncPanelShapeInputs(selectedPanel);
  } else if (editingStrand && !selectedPoly) {
    const strand = getSelectedLock();
    const width = Number(strand?.width ?? strand?.baseWidth ?? 0.16);
    drawStrandBrushSizeInput.value = width;
    drawStrandBrushSizeValue.textContent = width.toFixed(2);
  }
  transformToolTitle.textContent = `${sel.state.activeTool[0].toUpperCase()}${sel.state.activeTool.slice(1)} Tool`;
  pullMoveSetting.classList.toggle("hidden", sel.state.activeTool !== "move");
  pullRigiditySetting.classList.toggle("hidden", sel.state.activeTool !== "move" || !sculptState.state.pullMoveEnabled);
  pullCollisionSetting.classList.toggle("hidden", sel.state.activeTool !== "move" || !sculptState.state.pullMoveEnabled);
  scaleSensitivitySetting.classList.toggle("hidden", sel.state.activeTool !== "scale");
  viewPlaneMoveSetting.classList.toggle("hidden", sel.state.activeTool !== "move");
  viewPlaneMoveSnappedSetting.classList.toggle("hidden", sel.state.activeTool !== "move");
  syncMoveCurveControls();
  placeStrandToolPanel.classList.toggle("hidden", sel.state.activeTool !== "place");
  proportionalPanel.classList.toggle(
    "hidden",
    !(
      sculptProportionalToolActive
      || (editingStrand && proportionalToolActive)
      || ((scalpState.state.scalpBuilderEditing || sculptState.state.capsuleGuideEditing) && sculptState.state.proportionalEditing)
    )
  );
  proportionalLockRootRow.classList.toggle(
    "hidden",
    scalpState.state.scalpBuilderEditing || sculptState.state.capsuleGuideEditing || sculptProportionalToolActive
  );
  hierarchyPanel.classList.toggle("hidden", !editingStrand || !hierarchyToolActive || !sculptState.state.hierarchyEditing);
  branchBridgePanel.classList.toggle("hidden", !editingStrand || !getSelectedLock()?.branchParentId);
  updateBranchBridgeSliderInputs();
  sweepOverlapPanel.classList.toggle("hidden", !editingStrand || Boolean(selectedPoly || selectedBraid || selectedSurface || selectedPanel));
  updateSweepOverlapSliderInputs();
  strandLayerControl.classList.toggle("hidden", editingCreationShape && sel.state.activeTool === "draw");
  strandShapePanel.classList.toggle("hidden", Boolean(selectedPoly) || (!editingStrand && !editingCreationShape));
  strandShapeTitle.textContent = editingCreationShape
    ? (sel.state.activeTool === "braid" ? "Braid Shape" : sel.state.activeTool === "panel" ? "Panel Shape" : "Strand Shape")
    : (selectedBraid ? "Braid Shape" : selectedSurface ? "Surface Shape" : selectedPanel ? "Panel Shape" : "Strand Shape");
  if (editingCreationShape) syncCreationShapeInputs();
  else syncHairCardControls(getSelectedLock());
  syncViewportDrawSettings();
  pinActiveToolSettingsPanel();
}

function pinActiveToolSettingsPanel() {
  document.querySelectorAll(".tool-panel > .active-tool-settings").forEach((item) => {
    item.classList.remove("active-tool-settings");
  });
  let panel = null;
  if (scalpState.state.scalpPaintEditing) panel = scalpPaintPanel;
  else if (sculptState.state.headSetupEditing) panel = headPanel;
  else if (scalpState.state.scalpBuilderEditing) panel = scalpBuilderPanel;
  else if (scalpState.state.scalpShapeEditing) panel = scalpPanel;
  else if (["draw", "procedural-draw"].includes(sel.state.activeTool)) panel = drawStrandToolPanel;
  else if (sculptBrushToolActive()) panel = sculptMoveToolPanel;
  else if (sel.state.activeTool === "poly") panel = polyBrushToolPanel;
  else if (sel.state.activeTool === "braid") panel = braidToolPanel;
  else if (sel.state.activeTool === "panel") panel = panelStrandToolPanel;
  else if (sel.state.activeTool === "draw-capsule-guide" || sculptState.state.capsuleGuideEditing || (sculptState.state.viewportEditMode === "guide" && guideApi.getSelectedGuide()?.type === "capsule")) panel = surfaceGuideToolPanel;
  else if (sel.state.activeTool === "relax") panel = relaxToolPanel;
  else if (["move", "rotate", "scale"].includes(sel.state.activeTool)) panel = transformToolPanel;
  if (panel && !panel.classList.contains("hidden")) {
    panel.classList.add("active-tool-settings");
    panel.parentElement?.prepend(panel);
  }
}

function curveLatticeForGroup(region, createIfMissing = false) {
  if (!CURVE_LATTICE_FEATURE_ENABLED && !GROUP_CURVE_FEATURE_ENABLED) return null;
  let guide = guides.find((item) => item.type === "curve-lattice" && item.scalpRegion === region);
  if (!guide && createIfMissing && region !== "unassigned") {
    const columns = 3;
    const rows = region === "bangs" ? 3 : 4;
    guide = guideApi.addCurveLattice({
      columns,
      rows,
      scalpRegion: region,
      color: SCALP_REGIONS[region]?.color ?? SCALP_REGIONS.bangs.color,
      points: scalpBuilder.curveLatticePointsForScalpRegion(region, columns, rows)
    }, { deferUi: true });
    updateCount();
  }
  return guide || null;
}

function filterCurveLatticesToGroup(selectedGuideId = null) {
  const filtering = Boolean(selectedGuideId);
  guides.filter((guide) => guide.type === "curve-lattice").forEach((guide) => {
    if (guide.standalone) {
      const visible = guideState.state.curveLatticeGuidesVisible && guide.outlinerVisible !== false;
      guide.viewportGroupVisible = visible;
      guide.mesh.visible = visible;
      guide.wire.visible = visible;
      if (guide.rootMesh) guide.rootMesh.visible = visible;
      if (guide.rootWire) guide.rootWire.visible = visible;
      if (guide.groupCurveLine) guide.groupCurveLine.visible = false;
      if (guide.handlesGroup) guide.handlesGroup.visible = visible && guide.id === selectedGuideId;
      return;
    }
    const latticeVisible = REGION_CURVE_VISUALIZATION_ENABLED
      && CURVE_LATTICE_FEATURE_ENABLED
      && guideState.state.curveLatticeGuidesVisible
      && (!filtering || guide.id === selectedGuideId);
    const groupCurveVisible = REGION_CURVE_VISUALIZATION_ENABLED
      && GROUP_CURVE_FEATURE_ENABLED
      && Boolean(sel.state.selectedStrandGroup)
      && guide.id === selectedGuideId;
    guide.viewportGroupVisible = latticeVisible;
    guide.mesh.visible = latticeVisible;
    guide.wire.visible = latticeVisible;
    if (guide.rootMesh) guide.rootMesh.visible = latticeVisible;
    if (guide.rootWire) guide.rootWire.visible = latticeVisible;
    if (guide.loopPickersGroup) guide.loopPickersGroup.visible = latticeVisible;
    if (REGION_CURVE_VISUALIZATION_ENABLED) {
      guideApi.ensureGroupCurveDisplay(guide).visible = groupCurveVisible;
    } else if (guide.groupCurveLine) {
      guide.groupCurveLine.visible = false;
    }
    if (guide.handlesGroup) {
      guide.handlesGroup.visible = groupCurveVisible || (latticeVisible && guide.id === selectedGuideId);
      if (groupCurveVisible) {
        const visibleIndices = new Set(guideApi.groupCurveControlIndices(guide));
        guide.handlesGroup.children.forEach((handle, index) => {
          handle.visible = visibleIndices.has(index);
        });
      }
    }
  });
}

function createStandaloneCurveLatticeGuide() {
  if (!CURVE_LATTICE_FEATURE_ENABLED) return null;
  const columns = DEFAULT_CURVE_LATTICE_PLANE.columns;
  const rows = DEFAULT_CURVE_LATTICE_PLANE.rows;
  const index = guides.filter((guide) => guide.type === "curve-lattice" && guide.standalone).length + 1;
  pushUndoState();
  const guide = guideApi.addCurveLattice({
    standalone: true,
    name: `Curve Lattice Guide ${index}`,
    columns,
    rows,
    points: guideApi.flatCurveLatticePoints(columns, rows)
  });
  drawFlowApi.refreshLiveSurfaceOptions();
  return guide;
}

function showCurveLatticeForGroup(region) {
  const guide = curveLatticeForGroup(region, true);
  sel.state.selectedGuideId = guide?.id;
  sel.state.activeCurveLatticeGuideId = guide?.id || sel.state.activeCurveLatticeGuideId;
  sel.state.selectedCurveLatticePoint = null;
  curveLatticeToggle.classList.toggle("active", Boolean(guide));
  curveLatticeToggle.setAttribute("aria-pressed", String(Boolean(guide)));
  filterCurveLatticesToGroup(guide?.id || null);
  guides.forEach((item) => {
    const selected = item.id === guide?.id;
    if (item.type === "curve-lattice") {
      const displayColor = new THREE.Color(item.color);
      if (selected) displayColor.lerp(new THREE.Color(0xffffff), 0.18);
      item.mesh.material.color.copy(displayColor);
      item.wire.material.color.copy(displayColor);
      item.rootMesh?.material.color.copy(displayColor);
      item.rootWire?.material.color.copy(displayColor);
    }
    item.mesh.material.opacity = selected ? item.opacity : Math.min(item.opacity, 0.16);
    if (item.rootMesh) item.rootMesh.material.opacity = item.mesh.material.opacity;
    item.wire.material.opacity = selected ? 0.7 : 0.25;
    if (item.rootWire) item.rootWire.material.opacity = item.wire.material.opacity;
    if (item.handlesGroup) {
      item.handlesGroup.visible = selected && (
        item.standalone
          ? item.viewportGroupVisible !== false
          : REGION_CURVE_VISUALIZATION_ENABLED
            && (item.viewportGroupVisible !== false || (GROUP_CURVE_FEATURE_ENABLED && Boolean(sel.state.selectedStrandGroup)))
      );
    }
    if (item.loopLinesGroup) item.loopLinesGroup.visible = false;
  });
  if (guide) guideApi.syncGuideInputs(guide);
  guideApi.updateGuideControlsVisibility();
  placementApi.updatePlacementStatus();
}

function selectStrandGroup(region) {
  if (!strandGroupDefaults[region]) return;
  setOutlinerTab("strands");
  if (sel.state.selectedStrandGroup === region) {
    sel.state.selectedStrandGroup = null;
    sel.state.selectedGuideId = undefined;
    sel.state.selectedCurveLatticePoint = null;
    transformControls.detach();
    guides.forEach((guide) => {
      if (guide.handlesGroup) guide.handlesGroup.visible = false;
      if (guide.loopLinesGroup) guide.loopLinesGroup.visible = false;
    });
    filterCurveLatticesToGroup(null);
    curveLatticeToggle.classList.remove("active");
    curveLatticeToggle.setAttribute("aria-pressed", "false");
    updateAttributeEditorMode();
    guideApi.updateGuideControlsVisibility();
    placementApi.updatePlacementStatus();
    renderLockList();
    refreshRebuildCurveDialog();
    return;
  }
  sel.state.selectedStrandGroup = region;
  guideApi.clearMultiPointSelection();
  clearStrandSelectionState();
  sel.state.selectedCurveSurfaceController = null;
  sel.state.clumpViewportSelection = false;
  sel.state.selectedPoint = null;
  transformControls.detach();
  locks.forEach((lock) => {
    setStrandSelectionVisual(lock);
    updateCurveObjects(lock, { visible: false });
  });
  showCurveLatticeForGroup(region);
  syncGroupInputs();
  updateAttributeEditorMode();
  guideApi.updateGuideControlsVisibility();
  updateSelectedPointLabel();
  renderLockList();
  refreshRebuildCurveDialog();
}

function selectCurvePoint(lockId, pointIndex, preserveMulti = false) {
  sel.state.selectedPoint = { lockId, pointIndex };
  sel.state.selectedSurfaceObjectAnchorId = null;
  sel.state.selectedCurveLatticePoint = null;
  if (!preserveMulti) sel.state.selectedControlPoints = [{ type: "strand", lockId, pointIndex }];
  updateSelectedPointLabel();
  locks.forEach((lock) => {
    if (sculptState.state.proportionalEditing) updateLockGeometry(lock);
    updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId });
  });
  updateViewPlaneGrid();
  guideApi.updateViewportToolVisibility();
}

function updateSelectedPointLabel() {
  if (!selectedPointLabel) return;
  selectedPointLabel.textContent = sel.state.selectedControlPoints.length > 1
    ? `${sel.state.selectedControlPoints.length} selected`
    : sel.state.selectedSurfaceObjectAnchorId
      ? "Object"
    : sel.state.selectedPoint
      ? String(sel.state.selectedPoint.pointIndex + 1)
      : sel.state.selectedCurveLatticePoint
        ? String(sel.state.selectedCurveLatticePoint.pointIndex + 1)
        : "None";
}

function syncInputs(lock) {
  inputs.name.value = lock.name;
  strandLayerInput.value = normalizeHairLayer(lock.hairLayer);
  materialApi.syncHairMaterialEditor(lock);
  taperEditor.renderTaperPreview(taperPreviewPaths.strand, lock, "taperCurve");
  taperEditor.renderTaperPreview(taperPreviewPaths.strandDepth, lock, "depthCurve");
  branchSweep.renderTwistCurvePreview(strandTwistCurvePreview, lock);
  if (!isPanelGeometry(lock)) syncShapeDimensionInputs(lock);
  inputs.rootScalpOffset.value = lock.rootScalpOffset ?? 0;
  document.querySelector("#rootScalpOffsetValue").textContent = Number(lock.rootScalpOffset ?? 0).toFixed(2);
  inputs.profileOffset.value = lock.profileOffset ?? 0;
  document.querySelector("#profileOffsetValue").textContent = Number(lock.profileOffset ?? 0).toFixed(2);
  inputs.strandRotation.value = lock.strandRotation ?? 0;
  strandRotationValue.textContent = `${Math.round(Number(lock.strandRotation ?? 0))}°`;
  inputs.twist.value = lock.twist;
  inputs.compoundBridgeLoops.value = String(lock.compoundBridgeLoops ?? 0);
  compoundBridgeLoopsValue.textContent = String(Math.round(Number(lock.compoundBridgeLoops) || 0));
  inputs.compoundBridgeSmoothing.value = String(lock.compoundBridgeSmoothing ?? 0);
  compoundBridgeSmoothingValue.textContent = Number(lock.compoundBridgeSmoothing || 0).toFixed(2);
  twistNumberInput.value = Number(lock.twist || 0).toFixed(2);
  inputs.radialSegments.value = lock.radialSegments;
  inputs.lengthSegments.value = lock.lengthSegments;
  inputs.densityAggression.value = lock.densityAggression ?? 0.5;
  inputs.twistDensity.value = lock.twistDensity ?? 0;
  strandDynamicDensityInput.checked = Boolean(lock.dynamicDensity);
  inputs.densityAggression.disabled = !lock.dynamicDensity;
  inputs.twistDensity.disabled = !lock.dynamicDensity;
  topologyValues.strandRadialSegments.textContent = inputs.radialSegments.value;
  topologyValues.strandLengthSegments.textContent = inputs.lengthSegments.value;
  topologyValues.strandDensityAggression.textContent = Number(lock.densityAggression ?? 0.5).toFixed(2);
  topologyValues.strandTwistDensity.textContent = Number(lock.twistDensity ?? 0).toFixed(2);
  renderProfilePreview(profilePreviewPaths.strand, lock.sweepProfile, lock.profileOffset, lock);
  updateTopologyStats();
  presetLibraryApi.syncShapePresetSelects();
  clumpProceduralApi.syncClumpGuidePanel(lock);
  if (isPanelGeometry(lock)) segmentApi.syncPanelShapeInputs(lock);
  if (lock.geometryType === "strand") {
    syncStrandSplitInputs(lock);
    syncStrandTipInputs(lock);
    syncHairCardControls(lock);
  } else {
    syncHairCardControls(lock);
  }
  if (["move", "rotate", "scale"].includes(sel.state.activeTool)) configureTransformControls(sel.state.activeTool);
  syncMultiStrandInputs(lock);
}


function getSelectedLock() {
  return locks.find((lock) => lock.id === sel.state.selectedId);
}

function selectedLocksInOrder() {
  return [...sel.state.selectedStrandIds]
    .map((id) => locks.find((lock) => lock.id === id))
    .filter(Boolean);
}

function lockStrands(targets) {
  const uniqueTargets = [...new Map((targets || [])
    .filter((lock) => lock && !lock.locked && !lock.proceduralDuplicatePreview)
    .map((lock) => [lock.id, lock])).values()];
  const targetIds = new Set(uniqueTargets.map((lock) => lock.id));
  const remainingSelectedIds = [...sel.state.selectedStrandIds].filter((id) => !targetIds.has(id));
  if (!uniqueTargets.length) return false;
  pushUndoState();
  uniqueTargets.forEach((lock) => {
    lock.locked = true;
  });
  if (targetIds.has(sel.state.selectedId)) {
    if (remainingSelectedIds.length) {
      selectLock(remainingSelectedIds[0], {
        individualClumpMember: true,
        selectedIds: remainingSelectedIds
      });
    } else {
      deselectStrands();
    }
  } else if (remainingSelectedIds.length !== sel.state.selectedStrandIds.size) {
    selectLock(sel.state.selectedId, {
      individualClumpMember: true,
      selectedIds: remainingSelectedIds
    });
  } else {
    updateStrandSelectionHighlight();
    renderLockList();
  }
  placementApi.updatePlacementStatus();
  return true;
}

function lockSelectedStrands() {
  const targets = selectedLocksInOrder();
  if (!targets.length) return false;
  return lockStrands(targets);
}

function unlockStrands(targets) {
  const uniqueTargets = [...new Map((targets || [])
    .filter((lock) => lock?.locked && !lock.proceduralDuplicatePreview)
    .map((lock) => [lock.id, lock])).values()];
  if (!uniqueTargets.length) return false;
  pushUndoState();
  uniqueTargets.forEach((lock) => {
    lock.locked = false;
  });
  updateStrandSelectionHighlight();
  renderLockList();
  placementApi.updatePlacementStatus();
  return true;
}

function unlockAllStrands() {
  return unlockStrands(locks);
}

function strandEditFamily(lock) {
  if (!lock) return null;
  return lock.geometryType || "strand";
}

function compatibleSelectedLocks(primary = getSelectedLock()) {
  if (!primary) return [];
  const family = strandEditFamily(primary);
  const selected = selectedLocksInOrder().filter((lock) => strandEditFamily(lock) === family);
  return [primary, ...selected.filter((lock) => lock !== primary)];
}

function selectedEditRoots(primary = getSelectedLock()) {
  const selected = compatibleSelectedLocks(primary);
  const selectedIds = new Set(selected.map((lock) => lock.id));
  const handled = new Set();
  return selected.filter((lock) => {
    if (handled.has(lock.id)) return false;
    handled.add(lock.id);
    const partner = mirrorPartnerFor(lock);
    if (partner && selectedIds.has(partner.id)) handled.add(partner.id);
    return true;
  });
}

function editSelectedLocks(mutator, options = {}) {
  const primary = getSelectedLock();
  const targets = Array.isArray(options.targets) ? options.targets.filter(Boolean) : selectedEditRoots(primary);
  const targetIds = new Set(targets.map((lock) => lock.id));
  targets.forEach((lock) => mutator(lock));
  targets.forEach((lock) => {
    if (options.rootOffset) scalpBuilder.applyLockRootScalpOffset(lock);
    updateLockGeometry(lock, {
      immediate: options.immediate,
      defer: options.defer,
      updateCurveObjects: options.updateCurveObjects,
      updateClump: options.updateClump
    });
    if (options.updateCurveObjects !== false) {
      updateCurveObjects(lock, { visible: lock.id === sel.state.selectedId });
    }
    const partner = mirrorPartnerFor(lock);
    if (!partner || !targetIds.has(partner.id)) {
      syncActiveMirror(lock, {
        deferGeometry: options.defer,
        immediate: options.immediate,
        updateCurveObjects: options.updateCurveObjects,
        updateClump: options.updateClump
      });
    }
  });
  if (targets.length) {
    if (options.updateTopology !== false) updateTopologyStats();
    if (options.renderList !== false) renderLockList();
  }
  return targets;
}

function multiEditValuesEqual(left, right) {
  if (typeof left === "number" || typeof right === "number") {
    return Number.isFinite(Number(left))
      && Number.isFinite(Number(right))
      && Math.abs(Number(left) - Number(right)) < 0.0001;
  }
  return left === right;
}

function setMixedControl(control, output, values, formatter = String) {
  if (!control || !values.length) return false;
  const mixed = values.slice(1).some((value) => !multiEditValuesEqual(values[0], value));
  if (control.dataset.unmixedTitle === undefined) control.dataset.unmixedTitle = control.title || "";
  control.classList.toggle("mixed-value", mixed);
  control.toggleAttribute("data-mixed", mixed);
  control.title = mixed
    ? "Selected strands have different values. Change this control to set them all."
    : control.dataset.unmixedTitle;
  if (control.type === "checkbox") control.indeterminate = mixed;
  if (output) {
    output.classList.toggle("mixed-value", mixed);
    output.textContent = mixed ? "Mixed" : formatter(values[0]);
  }
  return mixed;
}

function syncMultiStrandInputs(primary = getSelectedLock()) {
  const selection = compatibleSelectedLocks(primary);
  const selectedCount = selectedLocksInOrder().length;
  const compatibleCount = selection.length;
  const multiple = selectedCount > 1;
  selectedStrandTitle.textContent = multiple ? "Selected Strands" : "Selected Strand";
  selectedStrandSelectionSummary.classList.toggle("hidden", !multiple);
  selectedStrandSelectionSummary.textContent = multiple
    ? compatibleCount === selectedCount
      ? `Editing ${selectedCount} selected strands. Changes apply to all of them.`
      : `Editing ${compatibleCount} compatible ${strandEditFamily(primary)} items out of ${selectedCount} selected.`
    : "";
  inputs.name.disabled = multiple;
  inputs.name.placeholder = multiple ? "Multiple strands selected" : "";
  if (!selection.length) return;

  const values = (read) => selection.map(read);
  setMixedControl(strandLayerInput, null, values((lock) => normalizeHairLayer(lock.hairLayer)));
  setMixedControl(hairMaterialSelect, null, values((lock) => lock.materialId || DEFAULT_HAIR_MATERIAL_ID));
  setMixedControl(inputs.widthScale, document.querySelector("#widthScaleValue"), values((lock) => (
    lock.geometryType === "braid" ? Number(lock.braidWidth) : strandWidthDimension(lock)
  )), (value) => Number(value).toFixed(2));
  setMixedControl(inputs.depthScale, document.querySelector("#depthScaleValue"), values((lock) => (
    lock.geometryType === "braid" ? Number(lock.braidDepth) : strandDepthDimension(lock)
  )), (value) => Number(value).toFixed(2));
  setMixedControl(inputs.rootScalpOffset, document.querySelector("#rootScalpOffsetValue"), values((lock) => Number(lock.rootScalpOffset ?? 0)), (value) => Number(value).toFixed(2));
  setMixedControl(inputs.profileOffset, document.querySelector("#profileOffsetValue"), values((lock) => Number(lock.profileOffset ?? 0)), (value) => Number(value).toFixed(2));
  setMixedControl(inputs.strandRotation, strandRotationValue, values((lock) => Number(lock.strandRotation ?? 0)), (value) => `${Math.round(Number(value))}°`);
  setMixedControl(inputs.twist, null, values((lock) => Number(lock.twist ?? 0)));
  if (primary?.curveSurfaceCompoundProfile) {
    setMixedControl(
      inputs.compoundBridgeLoops,
      compoundBridgeLoopsValue,
      values((lock) => Number(lock.compoundBridgeLoops ?? 0)),
      (value) => String(Math.round(value))
    );
    setMixedControl(
      inputs.compoundBridgeSmoothing,
      compoundBridgeSmoothingValue,
      values((lock) => Number(lock.compoundBridgeSmoothing ?? 0)),
      (value) => Number(value).toFixed(2)
    );
  }
  setMixedControl(twistNumberInput, null, values((lock) => Number(lock.twist ?? 0)));
  setMixedControl(inputs.radialSegments, topologyValues.strandRadialSegments, values((lock) => Number(lock.radialSegments)), (value) => String(Math.round(value)));
  setMixedControl(inputs.lengthSegments, topologyValues.strandLengthSegments, values((lock) => Number(lock.lengthSegments)), (value) => String(Math.round(value)));
  setMixedControl(strandDynamicDensityInput, null, values((lock) => Boolean(lock.dynamicDensity)));
  setMixedControl(inputs.densityAggression, topologyValues.strandDensityAggression, values((lock) => Number(lock.densityAggression ?? 0.5)), (value) => Number(value).toFixed(2));
  setMixedControl(inputs.twistDensity, topologyValues.strandTwistDensity, values((lock) => Number(lock.twistDensity ?? 0)), (value) => Number(value).toFixed(2));
  syncMoveCurveControls(primary);
  if (strandEditFamily(primary) === "strand") {
    setMixedControl(
      drawStrandBrushSizeInput,
      drawStrandBrushSizeValue,
      values((lock) => sculptGeom.editableStrandWidth(lock)),
      (value) => Number(value).toFixed(2)
    );
    setMixedControl(hairCardInput, null, values((lock) => Boolean(lock.hairCard)));
    Object.entries(strandSplitInputs).forEach(([key, input]) => {
      setMixedControl(
        input,
        strandSplitValues[key] || null,
        values((lock) => input.type === "checkbox" ? Boolean(lock[key]) : Number(lock[key])),
        (value) => Number(value).toFixed(2)
      );
    });
    if (primary.curlEnabled) {
      setMixedControl(drawStrandCurlCountInput, drawStrandCurlCountValue, values((lock) => Number(lock.curlCount ?? 4)), (value) => Number(value).toFixed(2));
      setMixedControl(drawStrandCurlDisplacementInput, drawStrandCurlDisplacementValue, values((lock) => Number(lock.curlDisplacement ?? 0.18)), (value) => Number(value).toFixed(2));
    }
  } else if (strandEditFamily(primary) === "braid") {
    setMixedControl(braidMeshPresetInput, null, values((lock) => lock.braidMeshPreset || DEFAULT_BRAID_MESH_PRESET));
    setMixedControl(braidWidthInput, braidWidthValue, values((lock) => Number(lock.braidWidth)), (value) => Number(value).toFixed(2));
    setMixedControl(braidDepthInput, braidDepthValue, values((lock) => Number(lock.braidDepth)), (value) => Number(value).toFixed(2));
    setMixedControl(braidSegmentLengthInput, braidSegmentLengthValue, values((lock) => Number(lock.braidSegmentLength)), (value) => Number(value).toFixed(2));
    setMixedControl(braidRotationInput, braidRotationValue, values((lock) => Number(lock.braidRotation)), (value) => `${Math.round(value)} deg`);
  } else if (["panel", "surface"].includes(strandEditFamily(primary))) {
    Object.entries(panelShapeInputs).forEach(([key, input]) => {
      setMixedControl(
        input,
        panelShapeValues[key] || null,
        values((lock) => input.type === "checkbox" ? Boolean(lock[key]) : Number(lock[key])),
        (value) => ["panelLengthLoops", "panelWidthLoops", "panelTipLoops"].includes(key) ? String(Math.round(value)) : Number(value).toFixed(2)
      );
    });
  }
  shapePresetSelects
    .filter((select) => select.closest("#strandShapePanel"))
    .forEach((select) => {
      const key = select.dataset.shapePreset;
      const mixed = selection.slice(1).some((lock) => !shapePresets.shapeValuesMatch(selection[0]?.[key], lock[key]));
      select.classList.toggle("mixed-value", mixed);
      select.toggleAttribute("data-mixed", mixed);
      select.title = mixed ? "Selected strands use different shapes. Choose a preset to set them all." : "";
    });
}

function selectedRebuildableCurves() {
  return selectedLocksInOrder().filter((lock) => (
    lock.points?.length >= 2
    && !["poly", "surface", "curve-surface"].includes(lock.geometryType)
  ));
}

function createCompoundStrand() {
  const rows = 7;
  const side = new THREE.Vector3(1, 0, 0);
  const uniformWidthCurve = [
    { position: 0, value: 1, interpolation: "linear" },
    { position: 1, value: 1, interpolation: "linear" }
  ];
  const uniformDepthCurve = [
    { position: 0, value: 0.55, interpolation: "linear" },
    { position: 1, value: 0.55, interpolation: "linear" }
  ];
  const centerCurve = Array.from({ length: rows }, (_, row) => (
    new THREE.Vector3(0, 1.55 - row * 0.5, 1.45)
  ));
  const controllerSpacing = Math.max(0.08, Number(strandCreationDefaults.width) * 2);
  const controllerCurves = [-1, 0, 1].map((columnOffset) => centerCurve.map((point) => (
    point.clone().addScaledVector(side, controllerSpacing * columnOffset)
  )));
  const controllerPoints = controllerCurves.flat();
  pushUndoState();
  const compound = addLock("front", {
    hairLayer: strandCreationDefaults.hairLayer,
    geometryType: "curve-surface",
    curveSurfaceColumns: 3,
    curveSurfaceRows: rows,
    curveSurfaceCenterCurve: 1,
    curveSurfaceCompoundProfile: true,
    compoundBridgeLoops: 0,
    compoundBridgeSmoothing: 0.5,
    curveSurfaceStripWidth: DEFAULT_CURVE_SURFACE_STRIP_WIDTH,
    curveSurfaceSide: side,
    curveSurfaceSymmetric: false,
    rootAttachmentEnabled: false,
    pointSurfaceNormals: controllerPoints.map(() => null),
    points: controllerPoints,
    ...strandCreationDefaults,
    taperCurve: uniformWidthCurve,
    taperCurveSecondary: uniformWidthCurve,
    depthCurve: uniformDepthCurve,
    depthCurveSecondary: uniformDepthCurve,
    surfaceNormalInfluence: 0
  }, { deferUi: true });
  compound.name = `Compound Strand ${sel.state.lockIndex}`;
  compound.baseWidth = compound.width;
  compound.curveSurfaceSource = {
    rows,
    stripWidth: DEFAULT_CURVE_SURFACE_STRIP_WIDTH,
    side: vectorToData(side),
    curves: controllerCurves.map((curve, index) => ({
      attachment: index < 1 ? "left" : index > 1 ? "right" : "center",
      column: index,
      points: curve.map(vectorToData)
    }))
  };
  fitPointAttributes(compound, compound.points.length);
  updateLockGeometry(compound, { immediate: true });
  selectLock(compound.id, { individualClumpMember: true });
  setActiveTool("move");
  return true;
}

function refreshRebuildCurveDialog() {
  if (!rebuildCurveDialog.open) return;
  const selection = selectedRebuildableCurves();
  const multipleSelected = selectedLocksInOrder().length > 1;
  rebuildCurveSelectionNote.classList.toggle("hidden", !multipleSelected);
  rebuildCurvePointCountInput.value = selection.length === 1 && !multipleSelected
    ? String(selection[0].points.length)
    : "";
  rebuildCurvePointCountInput.disabled = !selection.length;
  confirmRebuildCurveButton.disabled = !selection.length;
  rebuildCurvePointCountInput.setCustomValidity("");
}

function openRebuildCurveDialog() {
  const selection = selectedRebuildableCurves();
  if (!selection.length) return false;
  const opening = !rebuildCurveDialog.open;
  if (opening) {
    rebuildCurveEvenSpacingInput.checked = true;
    rebuildCurveDialog.show();
  }
  refreshRebuildCurveDialog();
  rebuildCurvePointCountInput.focus();
  if (selection.length === 1) rebuildCurvePointCountInput.select();
  return true;
}

function rebuildSelectedCurves() {
  const selection = selectedRebuildableCurves();
  if (!selection.length) return false;
  const rawCount = rebuildCurvePointCountInput.value.trim();
  const requestedCount = rawCount === "" ? null : Number(rawCount);
  if (
    requestedCount !== null
    && (!Number.isInteger(requestedCount) || requestedCount < 2 || requestedCount > 256)
  ) {
    rebuildCurvePointCountInput.setCustomValidity("Enter a whole number of control points from 2 to 256.");
    rebuildCurvePointCountInput.reportValidity();
    return false;
  }
  rebuildCurvePointCountInput.setCustomValidity("");
  const evenlySpaced = rebuildCurveEvenSpacingInput.checked;
  const changesCurve = evenlySpaced
    || selection.some((lock) => requestedCount !== null && requestedCount !== lock.points.length);
  if (!changesCurve) {
    refreshRebuildCurveDialog();
    return false;
  }

  pushUndoState();
  guideApi.clearMultiPointSelection();
  selection.forEach((lock) => {
    const pointCount = requestedCount ?? lock.points.length;
    const curve = new THREE.CatmullRomCurve3(lock.points.map((point) => point.clone()));
    const cumulativeLengths = curve.getLengths(Math.max(100, pointCount * 20));
    const parameters = curveRebuildParameters(pointCount, evenlySpaced, cumulativeLengths);
    resampleStrandCurveData(lock, parameters);
    finishStrandCurveTopologyChange(lock);
  });
  const primary = getSelectedLock();
  if (primary) syncInputs(primary);
  renderLockList();
  refreshRebuildCurveDialog();
  return true;
}



function cleanSelectionSets() {
  const normalized = normalizeSelectionSets(selectionSets, locks.map((lock) => lock.id));
  selectionSets.splice(0, selectionSets.length, ...normalized);
}

function createSelectionSetFromSelection() {
  const memberIds = selectedLocksInOrder().map((lock) => lock.id);
  const selectionSet = createSelectionSetRecord(selectionSets, memberIds, crypto.randomUUID());
  if (!selectionSet) return null;
  pushUndoState();
  selectionSets.push(selectionSet);
  sel.state.selectionSetsOpen = true;
  renderLockList();
  return selectionSet;
}

function selectionSetById(selectionSetId) {
  return selectionSets.find((selectionSet) => selectionSet.id === selectionSetId) || null;
}

function selectionSetCanEditFromSelection(selectionSet, mode) {
  const selectedIds = selectedLocksInOrder().map((lock) => lock.id);
  if (!selectionSet || !selectedIds.length) return false;
  const memberIds = new Set(selectionSet.strandIds);
  return mode === "remove"
    ? selectedIds.some((id) => memberIds.has(id))
    : selectedIds.some((id) => !memberIds.has(id));
}

function editSelectionSetFromSelection(selectionSetId, mode) {
  const selectionSet = selectionSetById(selectionSetId);
  if (!selectionSetCanEditFromSelection(selectionSet, mode)) return false;
  const nextSelectionSet = updateSelectionSetMembers(
    selectionSet,
    selectedLocksInOrder().map((lock) => lock.id),
    mode,
    locks.map((lock) => lock.id)
  );
  if (!nextSelectionSet) return false;
  pushUndoState();
  if (nextSelectionSet.strandIds.length) {
    Object.assign(selectionSet, nextSelectionSet);
  } else {
    selectionSets.splice(selectionSets.indexOf(selectionSet), 1);
  }
  renderLockList();
  return true;
}

function closeSelectionSetMembershipDialog() {
  sel.state.selectionSetMembershipMode = null;
  selectionSetMembershipList.replaceChildren();
  if (selectionSetMembershipDialog.open) selectionSetMembershipDialog.close();
}

function openSelectionSetMembershipDialog(mode) {
  const normalizedMode = mode === "remove" ? "remove" : "add";
  const viableSets = selectionSets.filter((selectionSet) => (
    selectionSetCanEditFromSelection(selectionSet, normalizedMode)
  ));
  if (!viableSets.length) return false;
  sel.state.selectionSetMembershipMode = normalizedMode;
  selectionSetMembershipDialogTitle.textContent = normalizedMode === "remove"
    ? "Remove from Selection Set"
    : "Add to Selection Set";
  selectionSetMembershipDialogDescription.textContent = normalizedMode === "remove"
    ? "Choose the selection set to remove the selected strands from."
    : "Choose the selection set to add the selected strands to.";
  selectionSetMembershipList.replaceChildren();
  viableSets.forEach((selectionSet, index) => {
    const label = document.createElement("label");
    label.className = "selection-set-membership-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "selectionSetMembershipTarget";
    input.value = selectionSet.id;
    input.checked = index === 0;
    const name = document.createElement("span");
    name.textContent = selectionSet.name;
    label.append(input, name);
    selectionSetMembershipList.append(label);
  });
  confirmSelectionSetMembershipButton.disabled = false;
  selectionSetMembershipDialog.showModal();
  return true;
}

function deleteSelectionSet(selectionSetId) {
  const selectionSet = selectionSetById(selectionSetId);
  if (!selectionSet) return false;
  pushUndoState();
  selectionSets.splice(selectionSets.indexOf(selectionSet), 1);
  renderLockList();
  return true;
}

function selectSelectionSet(selectionSet) {
  const memberIds = selectionSet.strandIds.filter((id) => locks.some((lock) => lock.id === id));
  if (!memberIds.length) return false;
  selectLock(memberIds[0], {
    individualClumpMember: true,
    selectedIds: memberIds
  });
  return true;
}

function deleteSelectedStrands() {
  const selection = selectedLocksInOrder();
  if (!selection.length) return false;
  pushUndoState();
  deleteLocks(selection);
  return true;
}

function deleteGuide(guide) {
  if (!guide) return false;
  pushUndoState();
  if (
    transformControls.object?.userData.curveLatticeGuideId === guide.id
    || transformControls.object?.userData.capsuleGuideId === guide.id
  ) transformControls.detach();
  locks.forEach((lock) => {
    if (lock.curveLatticeBinding?.guideId === guide.id) lock.curveLatticeBinding = null;
  });
  if (sel.state.activeCurveLatticeGuideId === guide.id) {
    sel.state.activeCurveLatticeGuideId = null;
    curveLatticeToggle.classList.remove("active");
  }
  removeGuideObjects(guide);
  disposeGuide(guide);
  guides.splice(guides.indexOf(guide), 1);
  drawFlowApi.refreshLiveSurfaceOptions();
  guideApi.selectGuide(guides.at(-1)?.id);
  updateCount();
  return true;
}

function deleteSelectedGuide() {
  return deleteGuide(guideApi.getSelectedGuide());
}


function hasDeletableSelection() {
  return Boolean(
    referenceHeadApi.selectedReferenceImage()
    || selectedLocksInOrder().length
    || guideApi.getSelectedGuide()
  );
}

function deleteCurrentSelection() {
  if (referenceHeadApi.selectedReferenceImage()) return referenceHeadApi.deleteSelectedReferenceImage();
  if (selectedLocksInOrder().length) return deleteSelectedStrands();
  if (guideApi.getSelectedGuide()) return deleteSelectedGuide();
  // The permanent scalp guide is intentionally not represented as a deletable guide.
  return false;
}

function hideOutlinerContextMenu() {
  sel.state.outlinerContextTarget = null;
  clumpContextMenu.classList.add("hidden");
}

function outlinerLockTargets(target = sel.state.outlinerContextTarget) {
  if (target?.type === "strand") {
    const lock = locks.find((item) => item.id === target.lockId);
    return lock && !lock.proceduralDuplicatePreview ? [lock] : [];
  }
  if (target?.type === "selection-set") {
    const selectionSet = selectionSetById(target.selectionSetId);
    if (!selectionSet) return [];
    const memberIds = new Set(selectionSet.strandIds);
    return locks.filter((lock) => memberIds.has(lock.id) && !lock.proceduralDuplicatePreview);
  }
  if (target?.type === "strand-region") {
    return locks.filter((lock) => (
      !lock.proceduralDuplicatePreview
      && (lock.scalpRegion || "unassigned") === target.regionId
    ));
  }
  if (target?.type === "strand-layer") {
    return locks.filter((lock) => (
      !lock.proceduralDuplicatePreview
      && (lock.scalpRegion || "unassigned") === target.regionId
      && normalizeHairLayer(lock.hairLayer) === target.layerId
    ));
  }
  return [];
}

function showOutlinerContextMenu(event, target) {
  event.preventDefault();
  event.stopPropagation();
  sel.state.outlinerContextTarget = target;
  const isClump = target.type === "clump";
  const isScalpGuide = target.type === "scalp-guide";
  const isGuide = target.type === "guide";
  const isReference = target.type === "reference";
  const isSelectionSet = target.type === "selection-set";
  const isStrandRegion = target.type === "strand-region";
  const isStrandLayer = target.type === "strand-layer";
  const selectionSet = isSelectionSet ? selectionSetById(target.selectionSetId) : null;
  const strand = target.type === "strand" ? locks.find((lock) => lock.id === target.lockId) : null;
  const clumpGuide = isClump ? locks.find((lock) => lock.id === target.guideId) : null;
  const hasMirrorPartner = Boolean(mirrorPartnerFor(strand));
  const clumpHasMirrorPartners = clumpProceduralApi.mirroredClumpPartners(clumpGuide).length > 0;
  const canCreateSelectionClump = Boolean(
    strand
    && sel.state.selectedStrandIds.has(strand.id)
    && clumpProceduralApi.selectionCanBecomeClump()
  );
  const canCreateSelectionSet = Boolean(
    strand
    && sel.state.selectedStrandIds.has(strand.id)
    && selectedLocksInOrder().length >= 2
  );
  editScalpOutlinerAction.classList.toggle("hidden", !isScalpGuide);
  createClumpFromSelectionAction.classList.toggle("hidden", !canCreateSelectionClump);
  createSelectionSetFromSelectedAction.classList.toggle("hidden", !canCreateSelectionSet);
  const selectedStrandCount = selectedLocksInOrder().length;
  const anyAddableSelectionSet = selectionSets.some((selectionSet) => selectionSetCanEditFromSelection(selectionSet, "add"));
  const anyRemovableSelectionSet = selectionSets.some((selectionSet) => selectionSetCanEditFromSelection(selectionSet, "remove"));
  addSelectedToSelectionSetAction.classList.toggle(
    "hidden",
    !(selectedStrandCount > 0 && (isSelectionSet || anyAddableSelectionSet))
  );
  addSelectedToSelectionSetAction.disabled = !(
    isSelectionSet
      ? selectionSetCanEditFromSelection(selectionSet, "add")
      : anyAddableSelectionSet
  );
  removeSelectedFromSelectionSetAction.classList.toggle(
    "hidden",
    !(selectedStrandCount > 0 && (isSelectionSet || anyRemovableSelectionSet))
  );
  removeSelectedFromSelectionSetAction.disabled = !(
    isSelectionSet
      ? selectionSetCanEditFromSelection(selectionSet, "remove")
      : anyRemovableSelectionSet
  );
  const lockTargets = outlinerLockTargets(target);
  const unlockTargets = lockTargets.length > 0 && lockTargets.every((lock) => lock.locked);
  lockOutlinerAction.classList.toggle("hidden", !strand && !isSelectionSet && !isStrandRegion && !isStrandLayer);
  lockOutlinerAction.disabled = !lockTargets.length;
  const lockActionVerb = unlockTargets ? "Unlock" : "Lock";
  lockOutlinerAction.textContent = strand
    ? `${lockActionVerb} Strand`
    : isSelectionSet
      ? `${lockActionVerb} Strands`
      : isStrandLayer ? `${lockActionVerb} Layer` : `${lockActionVerb} Region`;
  promoteLiveSurfaceGuideAction.classList.toggle("hidden", !strand);
  promoteLiveSurfaceGuideAction.textContent = strand?.liveSurfaceGuide
    ? "Remove from Live Surface Guides"
    : "Promote to Live Surface Guide";
  createClumpPresetAction.classList.toggle("hidden", !isClump);
  dissolveClumpAction.classList.toggle("hidden", !isClump);
  mirrorInstanceAction.classList.toggle("hidden", !strand && !isClump);
  mirrorInstanceAction.textContent = isClump
    ? clumpHasMirrorPartners ? "Decouple Mirrored Clump" : "Mirror Clump"
    : hasMirrorPartner ? "Decouple Mirrored Instance Strand" : "Mirror Strand";
  deleteOutlinerAction.textContent = isReference
    ? "Delete reference"
    : isGuide ? "Delete guide"
      : isClump ? "Delete clump"
        : isSelectionSet ? "Delete Selection Set" : "Delete strand";
  deleteOutlinerAction.classList.toggle("hidden", isScalpGuide || isStrandRegion || isStrandLayer);
  clumpContextMenu.setAttribute(
    "aria-label",
    isScalpGuide
      ? "Scalp guide actions"
      : isReference ? "Reference actions"
        : isGuide ? "Guide actions"
          : isClump ? "Clump actions"
            : isSelectionSet ? "Selection set actions"
              : isStrandLayer ? "Strand layer actions"
                : isStrandRegion ? "Strand region actions"
              : "Strand actions"
  );
  clumpContextMenu.classList.remove("hidden");
  const margin = 8;
  const left = Math.min(event.clientX, window.innerWidth - clumpContextMenu.offsetWidth - margin);
  const top = Math.min(event.clientY, window.innerHeight - clumpContextMenu.offsetHeight - margin);
  clumpContextMenu.style.left = `${Math.max(margin, left)}px`;
  clumpContextMenu.style.top = `${Math.max(margin, top)}px`;
  clumpContextMenu.querySelector("button:not(.hidden)")?.focus();
}

function setPullMoveEnabled(enabled) {
  sculptState.state.pullMoveEnabled = Boolean(enabled);
  pullMoveInput.checked = sculptState.state.pullMoveEnabled;
  sculptState.state.activeHandleEdit = null;
  transformControls.detach();
  setActiveTool("move");
}


function setNavigationTipsEnabled(enabled, { persist = true } = {}) {
  viewportState.state.navigationTipsEnabled = Boolean(enabled);
  navigationTipsPreferenceInput.checked = viewportState.state.navigationTipsEnabled;
  viewportNavigationTips.classList.toggle("hidden", !viewportState.state.navigationTipsEnabled);
  if (persist) saveBooleanPreference(NAVIGATION_TIPS_PREFERENCE_KEY, viewportState.state.navigationTipsEnabled);
}

function configureNavigationMouseButtons() {
  controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.MIDDLE = viewportState.state.navigationStyle === "blender"
    ? THREE.MOUSE.ROTATE
    : viewportState.state.navigationStyle === "houdini"
      ? THREE.MOUSE.PAN
      : THREE.MOUSE.DOLLY;
  controls.mouseButtons.RIGHT = viewportState.state.navigationStyle === "blender" || viewportState.state.navigationStyle === "houdini"
    ? null
    : THREE.MOUSE.PAN;
  syncNavigationModifierLocks();
}

function syncNavigationModifierLocks() {
  controls.enablePan = viewportState.state.navigationStyle !== "anime-hair-studio"
    || (!transform.state.transformPrecisionHeld && !sculptState.state.selectionRemoveHeld);
}

function setNavigationStyle(value, { persist = true } = {}) {
  viewportState.state.navigationStyle = normalizeNavigationStyle(value);
  navigationStylePreferenceInput.value = viewportState.state.navigationStyle;
  document.body.dataset.navigationStyle = viewportState.state.navigationStyle;
  navigationStyleTipRows.forEach((row) => {
    row.classList.toggle("hidden", row.dataset.navigationStyleTip !== viewportState.state.navigationStyle);
  });
  navigationStyleShortcutRows.forEach((row) => {
    row.classList.toggle("hidden", row.dataset.navigationStyleShortcut !== viewportState.state.navigationStyle);
  });
  configureNavigationMouseButtons();
  if (persist) {
    writeStoredPreference(window, NAVIGATION_STYLE_PREFERENCE_KEY, viewportState.state.navigationStyle);
  }
}

function applyCameraSmoothingPreference() {
  controls.enableDamping = viewportState.state.cameraSmoothingEnabled;
  controls.dampingFactor = THREE.MathUtils.lerp(0.12, 0.01, viewportState.state.cameraSmoothingStrength);
  cameraSmoothingPreferenceInput.checked = viewportState.state.cameraSmoothingEnabled;
  cameraSmoothingStrengthPreferenceInput.value = String(viewportState.state.cameraSmoothingStrength);
  const sliderRow = cameraSmoothingStrengthPreferenceInput.closest(".slider-input-row");
  const numberInput = sliderRow?.querySelector('input[type="number"]');
  if (numberInput) numberInput.value = String(viewportState.state.cameraSmoothingStrength);
  sliderRow?.querySelectorAll("input, button").forEach((control) => {
    control.disabled = !viewportState.state.cameraSmoothingEnabled;
  });
  cameraSmoothingStrengthPreferenceInput.closest("label")
    ?.setAttribute("aria-disabled", String(!viewportState.state.cameraSmoothingEnabled));
}

function setCameraSmoothingEnabled(enabled, { persist = true } = {}) {
  viewportState.state.cameraSmoothingEnabled = Boolean(enabled);
  applyCameraSmoothingPreference();
  if (persist) saveBooleanPreference(CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY, viewportState.state.cameraSmoothingEnabled);
}

function setCameraSmoothingStrength(value, { persist = true } = {}) {
  viewportState.state.cameraSmoothingStrength = normalizeCameraSmoothingStrength(value);
  applyCameraSmoothingPreference();
  if (persist) {
    writeStoredPreference(window, CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY, viewportState.state.cameraSmoothingStrength);
  }
}

function setScaleSensitivity(value) {
  miscState.state.scaleSensitivity = normalizeScaleSensitivity(value);
  scaleSensitivityInput.value = String(miscState.state.scaleSensitivity);
  scaleSensitivityValue.textContent = miscState.state.scaleSensitivity.toFixed(2);
  const numberInput = scaleSensitivityInput.closest("label")?.querySelector(".slider-number-input");
  if (numberInput) numberInput.value = String(miscState.state.scaleSensitivity);
}

function setToolTipsEnabled(enabled, { persist = true } = {}) {
  miscState.state.toolTipsEnabled = Boolean(enabled);
  toolTipsPreferenceInput.checked = miscState.state.toolTipsEnabled;
  placementApi.updatePlacementStatus();
  if (persist) saveBooleanPreference(TOOL_TIPS_PREFERENCE_KEY, miscState.state.toolTipsEnabled);
}

function setCompactToolButtonsEnabled(enabled, { persist = true } = {}) {
  miscState.state.compactToolButtonsEnabled = Boolean(enabled);
  compactToolButtonsPreferenceInput.checked = miscState.state.compactToolButtonsEnabled;
  document.body.classList.toggle("compact-tool-buttons", miscState.state.compactToolButtonsEnabled);
  if (persist) {
    saveBooleanPreference(COMPACT_TOOL_BUTTONS_PREFERENCE_KEY, miscState.state.compactToolButtonsEnabled);
  }
}

function setViewportStatisticsEnabled(enabled, { persist = true } = {}) {
  viewportState.state.viewportStatisticsEnabled = Boolean(enabled);
  viewportStatisticsPreferenceInput.checked = viewportState.state.viewportStatisticsEnabled;
  viewportStats.classList.toggle("hidden", !viewportState.state.viewportStatisticsEnabled);
  viewportStats.setAttribute("aria-hidden", String(!viewportState.state.viewportStatisticsEnabled));
  if (persist) saveBooleanPreference(VIEWPORT_STATISTICS_PREFERENCE_KEY, viewportState.state.viewportStatisticsEnabled);
}

function setTwistCurveAllStrandsPreviewEnabled(enabled, { persist = true } = {}) {
  hairState.state.twistCurveAllStrandsPreviewEnabled = Boolean(enabled);
  twistCurvePreviewPreferenceButtons.forEach((button) => {
    const active = (button.dataset.twistCurvePreview === "all") === hairState.state.twistCurveAllStrandsPreviewEnabled;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (persist) {
    saveBooleanPreference(
      TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY,
      hairState.state.twistCurveAllStrandsPreviewEnabled
    );
  }
}

function setLayerColorShiftsEnabled(enabled, { persist = true } = {}) {
  sel.state.layerColorShiftsEnabled = Boolean(enabled);
  layerColorShiftsPreferenceInput.checked = sel.state.layerColorShiftsEnabled;
  locks.forEach(materialApi.applyMaterialDefinitionToLock);
  if (sculptState.state.drawStrandStroke) drawFlowApi.updateDrawStrandPreview();
  renderLockList();
  if (persist) saveBooleanPreference(LAYER_COLOR_SHIFTS_PREFERENCE_KEY, sel.state.layerColorShiftsEnabled);
}

function setOutlinerFolderColorsEnabled(enabled, { persist = true } = {}) {
  sel.state.outlinerFolderColorsEnabled = Boolean(enabled);
  outlinerFolderColorsPreferenceInput.checked = sel.state.outlinerFolderColorsEnabled;
  outlinerFolderColorOpacityPreferenceInput.disabled = !sel.state.outlinerFolderColorsEnabled;
  document.body.classList.toggle("outliner-folder-colors-disabled", !sel.state.outlinerFolderColorsEnabled);
  if (persist) {
    saveBooleanPreference(OUTLINER_FOLDER_COLORS_PREFERENCE_KEY, sel.state.outlinerFolderColorsEnabled);
  }
}

function setSidePanelStyle(value, { persist = true } = {}) {
  miscState.state.sidePanelStyle = normalizeSidePanelStyle(value);
  sidePanelStylePreferenceInput.value = miscState.state.sidePanelStyle;
  document.body.classList.toggle("glass-side-panels", miscState.state.sidePanelStyle === "glass");
  document.body.classList.toggle("no-panels", miscState.state.sidePanelStyle === "none");
  if (miscState.state.sidePanelStyle !== "default") {
    document.body.classList.remove("compact-sidebar-docked");
    miscState.state.compactSidebarDockActivationWidth = null;
  }
  window.requestAnimationFrame(() => {
    syncViewportTopControlRows();
    resize();
  });
  if (persist) {
    writeStoredPreference(window, SIDE_PANEL_STYLE_PREFERENCE_KEY, miscState.state.sidePanelStyle);
  }
}

function setGlassPanelColor(value, { persist = true } = {}) {
  miscState.state.glassPanelColor = normalizeGlassPanelColor(value);
  glassPanelColorPreferenceInput.value = miscState.state.glassPanelColor;
  glassPanelColorPreferenceValue.textContent = miscState.state.glassPanelColor.toUpperCase();
  document.documentElement.style.setProperty("--glass-panel-color", miscState.state.glassPanelColor);
  if (persist) {
    writeStoredPreference(window, GLASS_PANEL_COLOR_PREFERENCE_KEY, miscState.state.glassPanelColor);
  }
}

function setOutlinerFolderColorOpacity(value, { persist = true } = {}) {
  miscState.state.outlinerFolderColorOpacity = normalizeOutlinerFolderColorOpacity(value);
  outlinerFolderColorOpacityPreferenceInput.value = String(miscState.state.outlinerFolderColorOpacity);
  if (outlinerFolderColorOpacityPreferenceNumberInput) {
    outlinerFolderColorOpacityPreferenceNumberInput.value = String(miscState.state.outlinerFolderColorOpacity);
  }
  const factor = miscState.state.outlinerFolderColorOpacity / 100;
  document.documentElement.style.setProperty("--outliner-folder-border-mix", `${58 * factor}%`);
  document.documentElement.style.setProperty("--outliner-folder-background-mix", `${11 * factor}%`);
  document.documentElement.style.setProperty("--outliner-folder-group-line-mix", `${24 * factor}%`);
  document.documentElement.style.setProperty("--outliner-folder-layer-line-mix", `${18 * factor}%`);
  if (persist) {
    writeStoredPreference(window, OUTLINER_FOLDER_COLOR_OPACITY_PREFERENCE_KEY, miscState.state.outlinerFolderColorOpacity);
  }
}


function sideNamingDisplayId(id) {
  if (miscState.state.sideNamingPerspective !== "character") return id;
  return ({
    left: "right",
    right: "left",
    "side-bangs-left": "side-bangs-right",
    "side-bangs-right": "side-bangs-left",
    "side-left": "side-right",
    "side-right": "side-left"
  })[id] || id;
}


function strandRegionDisplayLabel(region, { short = false } = {}) {
  const displayRegion = sideNamingDisplayId(region);
  if (short) {
    return ({
      bangs: "Bangs Root",
      "side-bangs-left": "Side Bangs L",
      "side-bangs-right": "Side Bangs R",
      "side-left": "Side L",
      "side-right": "Side R",
      back: "Back",
      unassigned: "Erase"
    })[displayRegion] || displayRegion;
  }
  return STRAND_GROUPS.find((group) => group.id === displayRegion)?.label
    || SCALP_REGIONS[displayRegion]?.label
    || displayRegion;
}

function updateSideNamingLabels() {
  document.querySelectorAll("[data-reference-drop-target]").forEach((target) => {
    const label = target.querySelector("b");
    if (label && ["front", "back", "left", "right"].includes(target.dataset.referenceDropTarget)) {
      label.textContent = referenceHeadApi.referenceViewDisplayLabel(target.dataset.referenceDropTarget);
    }
  });
  referenceImageView.querySelectorAll("option").forEach((option) => {
    option.textContent = referenceHeadApi.referenceViewDisplayLabel(option.value);
  });
  scalpRegionButtons.forEach((button) => {
    const label = button.querySelector("span:last-child");
    if (label) label.textContent = strandRegionDisplayLabel(button.dataset.scalpRegion, { short: true });
  });
  regionVisibilityInputs.forEach((input) => {
    const label = input.closest("label")?.querySelector("span");
    if (label) label.textContent = strandRegionDisplayLabel(input.dataset.regionVisibility);
  });
  referenceHeadApi.renderReferenceImagePanel();
  renderLockList();
  const selectedGroup = STRAND_GROUPS.find((group) => group.id === sel.state.selectedStrandGroup);
  groupSettingsTitle.textContent = selectedGroup
    ? strandRegionDisplayLabel(selectedGroup.id)
    : "Group Settings";
  placementApi.updatePlacementStatus();
}

function setSideNamingPerspective(value, { persist = true } = {}) {
  miscState.state.sideNamingPerspective = normalizeSideNamingPerspective(value);
  sideNamingPerspectivePreferenceInput.value = miscState.state.sideNamingPerspective;
  updateSideNamingLabels();
  if (persist) {
    writeStoredPreference(window, SIDE_NAMING_PERSPECTIVE_PREFERENCE_KEY, miscState.state.sideNamingPerspective);
  }
}

function setControlPointDisplaySize(value, { persist = true } = {}) {
  guideState.state.controlPointDisplaySize = normalizeControlPointDisplaySize(value);
  controlPointDisplaySizePreferenceInput.value = String(guideState.state.controlPointDisplaySize);
  if (controlPointDisplaySizePreferenceNumberInput) {
    controlPointDisplaySizePreferenceNumberInput.value = String(guideState.state.controlPointDisplaySize);
  }
  locks.forEach((lock) => updateCurveObjects(lock));
  if (persist) {
    writeStoredPreference(window, CONTROL_POINT_DISPLAY_SIZE_PREFERENCE_KEY, guideState.state.controlPointDisplaySize);
  }
}

function scaleHexColor(hex, factor) {
  const channels = [1, 3, 5].map((offset) => Math.round(Number.parseInt(hex.slice(offset, offset + 2), 16) * factor));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function setViewportBackgroundColor(value, { persist = true } = {}) {
  viewportState.state.viewportBackgroundColor = normalizeViewportBackgroundColor(value);
  viewportBackgroundColorPreferenceInput.value = viewportState.state.viewportBackgroundColor;
  viewportBackgroundColorPreferenceValue.textContent = viewportState.state.viewportBackgroundColor.toUpperCase();
  viewportPanel.style.setProperty("--viewport-background-center", viewportState.state.viewportBackgroundColor);
  viewportPanel.style.setProperty(
    "--viewport-background-middle",
    viewportState.state.viewportBackgroundColor === DEFAULT_VIEWPORT_BACKGROUND_COLOR
      ? "#16151a"
      : scaleHexColor(viewportState.state.viewportBackgroundColor, 0.52)
  );
  viewportPanel.style.setProperty(
    "--viewport-background-edge",
    viewportState.state.viewportBackgroundColor === DEFAULT_VIEWPORT_BACKGROUND_COLOR
      ? "#0c0b0f"
      : scaleHexColor(viewportState.state.viewportBackgroundColor, 0.28)
  );
  if (persist) {
    writeStoredPreference(window, VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY, viewportState.state.viewportBackgroundColor);
  }
}

function setDefaultHairShader(shader, { persist = true } = {}) {
  hairState.state.defaultHairShader = normalizeHairShader(shader);
  defaultHairShaderPreferenceInput.value = hairState.state.defaultHairShader;
  if (persist) writeStoredPreference(window, DEFAULT_HAIR_SHADER_PREFERENCE_KEY, hairState.state.defaultHairShader);
}

function setPreferenceCategory(category) {
  const nextCategory = ["viewport", "materials", "experimental", "backup"].includes(category)
    ? category
    : "viewport";
  preferenceCategoryButtons.forEach((button) => {
    const active = button.dataset.preferenceCategory === nextCategory;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    if (button.dataset.preferenceCategory === "viewport") {
      button.setAttribute("aria-expanded", String(nextCategory === "viewport"));
    }
  });
  preferenceCategoryGroups.forEach((group) => {
    group.classList.toggle("expanded", group.dataset.preferenceCategoryGroup === nextCategory);
  });
  preferencePanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.preferencePanel !== nextCategory);
  });
  preferencePageTitle.textContent = nextCategory === "materials"
      ? "Materials"
    : nextCategory === "experimental"
      ? "Experimental Features"
    : nextCategory === "backup"
      ? "Backup"
      : "Viewport";
}

function openPreferencesDialog() {
  ui.state.preferencesOpenSnapshot = {
    radialMenusEnabled: ui.state.radialMenusEnabled,
    multiCameraExperimentalEnabled: multiCameraState.state.experimentalEnabled,
    proceduralDrawExperimentalEnabled: draw.state.proceduralDrawExperimentalEnabled,
    navigationTipsEnabled: viewportState.state.navigationTipsEnabled,
    navigationStyle: viewportState.state.navigationStyle,
    cameraSmoothingEnabled: viewportState.state.cameraSmoothingEnabled,
    cameraSmoothingStrength: viewportState.state.cameraSmoothingStrength,
    toolTipsEnabled: miscState.state.toolTipsEnabled,
    compactToolButtonsEnabled: miscState.state.compactToolButtonsEnabled,
    viewportStatisticsEnabled: viewportState.state.viewportStatisticsEnabled,
    twistCurveAllStrandsPreviewEnabled: hairState.state.twistCurveAllStrandsPreviewEnabled,
    layerColorShiftsEnabled: sel.state.layerColorShiftsEnabled,
    outlinerFolderColorsEnabled: sel.state.outlinerFolderColorsEnabled,
    sidePanelStyle: miscState.state.sidePanelStyle,
    glassPanelColor: miscState.state.glassPanelColor,
    outlinerFolderColorOpacity: miscState.state.outlinerFolderColorOpacity,
    sideNamingPerspective: miscState.state.sideNamingPerspective,
    controlPointDisplaySize: guideState.state.controlPointDisplaySize,
    viewportBackgroundColor: viewportState.state.viewportBackgroundColor,
    defaultHairShader: hairState.state.defaultHairShader,
    autosaveEnabled: recovery.state.autosaveEnabled,
    autosaveIntervalSeconds: recovery.state.autosaveIntervalSeconds
  };
  defaultHairShaderPreferenceInput.value = hairState.state.defaultHairShader;
  applyCameraSmoothingPreference();
  setControlPointDisplaySize(guideState.state.controlPointDisplaySize, { persist: false });
  setViewportBackgroundColor(viewportState.state.viewportBackgroundColor, { persist: false });
  setSidePanelStyle(miscState.state.sidePanelStyle, { persist: false });
  setGlassPanelColor(miscState.state.glassPanelColor, { persist: false });
  setOutlinerFolderColorOpacity(miscState.state.outlinerFolderColorOpacity, { persist: false });
  setAutosaveInterval(recovery.state.autosaveIntervalSeconds, { persist: false });
  setAutosaveEnabled(recovery.state.autosaveEnabled, { persist: false });
  preferencesBackupStatus.textContent = "";
  setPreferenceCategory("viewport");
  preferencesDialog.showModal();
}

function savePreferencesDialog() {
  saveBooleanPreference(RADIAL_MENUS_PREFERENCE_KEY, ui.state.radialMenusEnabled);
  saveBooleanPreference(MULTI_CAMERA_EXPERIMENTAL_PREFERENCE_KEY, multiCameraState.state.experimentalEnabled);
  saveBooleanPreference(PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY, draw.state.proceduralDrawExperimentalEnabled);
  saveBooleanPreference(NAVIGATION_TIPS_PREFERENCE_KEY, viewportState.state.navigationTipsEnabled);
  writeStoredPreference(window, NAVIGATION_STYLE_PREFERENCE_KEY, viewportState.state.navigationStyle);
  saveBooleanPreference(CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY, viewportState.state.cameraSmoothingEnabled);
  writeStoredPreference(window, CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY, viewportState.state.cameraSmoothingStrength);
  saveBooleanPreference(TOOL_TIPS_PREFERENCE_KEY, miscState.state.toolTipsEnabled);
  saveBooleanPreference(COMPACT_TOOL_BUTTONS_PREFERENCE_KEY, miscState.state.compactToolButtonsEnabled);
  saveBooleanPreference(VIEWPORT_STATISTICS_PREFERENCE_KEY, viewportState.state.viewportStatisticsEnabled);
  saveBooleanPreference(
    TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY,
    hairState.state.twistCurveAllStrandsPreviewEnabled
  );
  saveBooleanPreference(LAYER_COLOR_SHIFTS_PREFERENCE_KEY, sel.state.layerColorShiftsEnabled);
  saveBooleanPreference(OUTLINER_FOLDER_COLORS_PREFERENCE_KEY, sel.state.outlinerFolderColorsEnabled);
  writeStoredPreference(window, SIDE_PANEL_STYLE_PREFERENCE_KEY, miscState.state.sidePanelStyle);
  writeStoredPreference(window, GLASS_PANEL_COLOR_PREFERENCE_KEY, miscState.state.glassPanelColor);
  writeStoredPreference(window, OUTLINER_FOLDER_COLOR_OPACITY_PREFERENCE_KEY, miscState.state.outlinerFolderColorOpacity);
  writeStoredPreference(window, SIDE_NAMING_PERSPECTIVE_PREFERENCE_KEY, miscState.state.sideNamingPerspective);
  writeStoredPreference(window, CONTROL_POINT_DISPLAY_SIZE_PREFERENCE_KEY, guideState.state.controlPointDisplaySize);
  writeStoredPreference(window, VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY, viewportState.state.viewportBackgroundColor);
  writeStoredPreference(window, DEFAULT_HAIR_SHADER_PREFERENCE_KEY, hairState.state.defaultHairShader);
  saveBooleanPreference(AUTOSAVE_ENABLED_PREFERENCE_KEY, recovery.state.autosaveEnabled);
  writeStoredPreference(window, AUTOSAVE_INTERVAL_PREFERENCE_KEY, recovery.state.autosaveIntervalSeconds);
  ui.state.preferencesOpenSnapshot = null;
  preferencesDialog.close();
}

function cancelPreferencesDialog() {
  if (ui.state.preferencesOpenSnapshot) {
    radialMenuApi.setRadialMenusEnabled(ui.state.preferencesOpenSnapshot.radialMenusEnabled, { persist: false });
    clumpProceduralApi.setProceduralDrawExperimentalEnabled(
      ui.state.preferencesOpenSnapshot.proceduralDrawExperimentalEnabled,
      { persist: false }
    );
    setMultiCameraExperimentalEnabled(
      ui.state.preferencesOpenSnapshot.multiCameraExperimentalEnabled,
      { persist: false }
    );
    setNavigationTipsEnabled(ui.state.preferencesOpenSnapshot.navigationTipsEnabled, { persist: false });
    setNavigationStyle(ui.state.preferencesOpenSnapshot.navigationStyle, { persist: false });
    setCameraSmoothingEnabled(ui.state.preferencesOpenSnapshot.cameraSmoothingEnabled, { persist: false });
    setCameraSmoothingStrength(ui.state.preferencesOpenSnapshot.cameraSmoothingStrength, { persist: false });
    setToolTipsEnabled(ui.state.preferencesOpenSnapshot.toolTipsEnabled, { persist: false });
    setCompactToolButtonsEnabled(ui.state.preferencesOpenSnapshot.compactToolButtonsEnabled, { persist: false });
    setViewportStatisticsEnabled(ui.state.preferencesOpenSnapshot.viewportStatisticsEnabled, { persist: false });
    setTwistCurveAllStrandsPreviewEnabled(
      ui.state.preferencesOpenSnapshot.twistCurveAllStrandsPreviewEnabled,
      { persist: false }
    );
    setLayerColorShiftsEnabled(ui.state.preferencesOpenSnapshot.layerColorShiftsEnabled, { persist: false });
    setOutlinerFolderColorsEnabled(ui.state.preferencesOpenSnapshot.outlinerFolderColorsEnabled, { persist: false });
    setSidePanelStyle(ui.state.preferencesOpenSnapshot.sidePanelStyle, { persist: false });
    setGlassPanelColor(ui.state.preferencesOpenSnapshot.glassPanelColor, { persist: false });
    setOutlinerFolderColorOpacity(ui.state.preferencesOpenSnapshot.outlinerFolderColorOpacity, { persist: false });
    setSideNamingPerspective(ui.state.preferencesOpenSnapshot.sideNamingPerspective, { persist: false });
    setControlPointDisplaySize(ui.state.preferencesOpenSnapshot.controlPointDisplaySize, { persist: false });
    setViewportBackgroundColor(ui.state.preferencesOpenSnapshot.viewportBackgroundColor, { persist: false });
    setDefaultHairShader(ui.state.preferencesOpenSnapshot.defaultHairShader, { persist: false });
    setAutosaveEnabled(ui.state.preferencesOpenSnapshot.autosaveEnabled, { persist: false });
    setAutosaveInterval(ui.state.preferencesOpenSnapshot.autosaveIntervalSeconds, { persist: false });
  }
  ui.state.preferencesOpenSnapshot = null;
  preferencesDialog.close();
}



function createOutlinerStrandButton(lock, options = {}) {
  const shell = document.createElement("div");
  shell.className = `lock-item-shell${options.nested ? " clump-child" : ""}`;
  const visible = strandVisibleForDisplay(lock);
  const visibility = createOutlinerVisibilityToggle({
    visible,
    label: lock.name,
    onToggle: () => {
      pushUndoState();
      setLocksOutlinerVisibility([lock], !visible);
    }
  });
  const button = document.createElement("button");
  const selectedLock = getSelectedLock();
  const clumpHighlighted = sel.state.clumpViewportSelection
    && selectedLock?.clumpId
    && lock.clumpId === selectedLock.clumpId;
  button.className = `lock-item${sel.state.selectedStrandIds.has(lock.id) || clumpHighlighted ? " active" : ""}`;
  button.type = "button";
  button.draggable = !lock.clumpGuide;
  const mirrorPartner = mirrorPartnerFor(lock);
  button.title = mirrorPartner
    ? `Mirror instance linked to ${mirrorPartner.name}. Right-click to decouple`
    : lock.clumpGuide ? "Clump parent strand" : "Drag onto another strand or clump to group";
  if (lock.liveSurfaceGuide) {
    button.classList.add("live-surface-guide-item");
    button.title = `Live surface guide. ${button.title}`;
    button.setAttribute("aria-label", `${lock.name}, live surface guide`);
  }
  const swatch = document.createElement("span");
  swatch.className = "swatch";
  swatch.style.background = new THREE.Color(materialApi.strandDisplayColor(lock)).getStyle();
  const name = document.createElement("span");
  name.className = "outliner-rename-label";
  name.textContent = lock.name;
  button.append(swatch, name);
  if (lock.clumpGuide) {
    button.classList.add("clump-guide-item");
    const badge = document.createElement("span");
    badge.className = "clump-guide-badge";
    badge.textContent = "Parent";
    button.appendChild(badge);
  }
  button.addEventListener("click", (event) => handleOutlinerRenameClick(event, {
    label: name,
    value: lock.name,
    onSelect: () => selectLock(lock.id, {
      individualClumpMember: Boolean(lock.clumpId && (!lock.clumpGuide || event.shiftKey || event.ctrlKey)),
      selectionMode: event.shiftKey && !event.ctrlKey && !event.altKey
        ? "add"
        : event.ctrlKey && !event.shiftKey && !event.altKey
          ? "remove"
          : undefined
    }),
    onCommit: (nextName) => {
      lock.name = nextName;
      if (lock.id === sel.state.selectedId) inputs.name.value = nextName;
      drawFlowApi.refreshLiveSurfaceOptions();
    },
    rerender: renderLockList
  }));
  button.addEventListener("contextmenu", (event) => showOutlinerContextMenu(event, {
    type: "strand",
    lockId: lock.id
  }));
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", lock.id);
    event.dataTransfer.effectAllowed = "move";
    button.classList.add("dragging");
  });
  button.addEventListener("dragend", () => button.classList.remove("dragging"));
  button.addEventListener("dragover", (event) => {
    if (!event.dataTransfer.types.includes("text/plain")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    button.classList.add("drop-target");
  });
  button.addEventListener("dragleave", () => button.classList.remove("drop-target"));
  button.addEventListener("drop", (event) => {
    button.classList.remove("drop-target");
    clumpProceduralApi.handleOutlinerClumpDrop(event, lock);
  });
  shell.append(visibility, button);
  return shell;
}

function createOutlinerCurveSurface(lock) {
  const controllerCount = Math.max(1, Math.round(Number(lock.curveSurfaceColumns) || 1));
  const compound = Boolean(lock.curveSurfaceCompoundProfile);
  const entityLabel = compound ? "Compound Strand" : "Curve Surface";
  const isOpen = curveSurfaceOpen.get(lock.id) !== false;
  const containsSelection = sel.state.selectedId === lock.id;
  const activeController = curveSurfaceCreate.activeCurveSurfaceControllerIndex(lock);
  const container = document.createElement("div");
  container.className = `outliner-clump outliner-curve-surface${isOpen ? " open" : ""}${containsSelection ? " selected" : ""}`;

  const header = document.createElement("div");
  header.className = "outliner-clump-head";
  header.title = `${entityLabel} container`;
  const disclosure = document.createElement("button");
  disclosure.type = "button";
  disclosure.className = "outliner-clump-disclosure";
  disclosure.textContent = ">";
  disclosure.title = `${isOpen ? "Collapse" : "Expand"} ${lock.name}`;
  disclosure.setAttribute("aria-label", disclosure.title);
  disclosure.setAttribute("aria-expanded", String(isOpen));
  disclosure.addEventListener("click", () => {
    curveSurfaceOpen.set(lock.id, !isOpen);
    renderLockList();
  });
  const visible = strandVisibleForDisplay(lock);
  const visibility = createOutlinerVisibilityToggle({
    visible,
    label: lock.name,
    onToggle: () => {
      pushUndoState();
      setLocksOutlinerVisibility([lock], !visible);
    }
  });
  const select = document.createElement("button");
  select.type = "button";
  select.className = "outliner-clump-select";
  select.setAttribute("aria-label", `${lock.name}, ${entityLabel}`);
  const folderIcon = document.createElement("span");
  folderIcon.className = "outliner-folder-icon";
  folderIcon.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "outliner-rename-label";
  label.textContent = lock.name;
  const count = document.createElement("span");
  count.className = "outliner-clump-count";
  count.textContent = controllerCount;
  select.append(folderIcon, label, count);
  select.addEventListener("click", (event) => handleOutlinerRenameClick(event, {
    label,
    value: lock.name,
    onSelect: () => selectLock(lock.id),
    onCommit: (nextName) => {
      lock.name = nextName;
      if (lock.id === sel.state.selectedId) inputs.name.value = nextName;
      drawFlowApi.refreshLiveSurfaceOptions();
    },
    rerender: renderLockList
  }));
  header.append(disclosure, visibility, select);
  header.addEventListener("contextmenu", (event) => showOutlinerContextMenu(event, {
    type: "strand",
    lockId: lock.id
  }));

  const children = document.createElement("div");
  children.className = "outliner-clump-children";
  for (let controllerIndex = 0; controllerIndex < controllerCount; controllerIndex += 1) {
    const shell = document.createElement("div");
    shell.className = "lock-item-shell clump-child curve-surface-child";
    const spacer = document.createElement("span");
    spacer.className = "curve-surface-child-spacer";
    spacer.setAttribute("aria-hidden", "true");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lock-item${activeController === controllerIndex ? " active" : ""}`;
    const controllerName = compound
      ? `Section ${controllerIndex + 1}`
      : `Curve ${controllerIndex + 1}`;
    button.setAttribute("aria-label", `${lock.name} ${controllerName}`);
    const curveIcon = document.createElement("span");
    curveIcon.className = "curve-surface-controller-icon";
    curveIcon.setAttribute("aria-hidden", "true");
    const curveLabel = document.createElement("span");
    curveLabel.textContent = controllerName;
    button.append(curveIcon, curveLabel);
    button.addEventListener("click", () => selectLock(lock.id, {
      individualClumpMember: true,
      curveSurfaceControllerIndex: controllerIndex
    }));
    shell.append(spacer, button);
    children.appendChild(shell);
  }
  container.append(header, children);
  return container;
}


function selectionSetMatchesCurrentSelection(selectionSet) {
  const memberIds = selectionSet.strandIds.filter((id) => locks.some((lock) => lock.id === id));
  return memberIds.length > 0
    && memberIds.length === sel.state.selectedStrandIds.size
    && memberIds.every((id) => sel.state.selectedStrandIds.has(id));
}

function createSelectionSetsOutlinerFolder() {
  const group = document.createElement("div");
  group.className = `outliner-group selection-sets-group${sel.state.selectionSetsOpen ? " open" : ""}`;
  group.style.setProperty("--outliner-region-color", "#53d9e6");

  const header = document.createElement("div");
  header.className = "outliner-group-head";
  const disclosure = document.createElement("button");
  disclosure.className = "outliner-disclosure";
  disclosure.type = "button";
  disclosure.textContent = ">";
  disclosure.title = sel.state.selectionSetsOpen ? "Collapse Selection Sets" : "Expand Selection Sets";
  disclosure.setAttribute("aria-label", disclosure.title);
  disclosure.setAttribute("aria-expanded", String(sel.state.selectionSetsOpen));
  disclosure.addEventListener("click", () => {
    sel.state.selectionSetsOpen = !sel.state.selectionSetsOpen;
    renderLockList();
  });
  const spacer = document.createElement("span");
  spacer.className = "selection-set-header-spacer";
  const folderButton = document.createElement("button");
  folderButton.className = "outliner-group-select";
  folderButton.type = "button";
  const icon = document.createElement("span");
  icon.className = "selection-set-folder-icon";
  const label = document.createElement("span");
  label.className = "outliner-group-label";
  label.textContent = "Selection Sets";
  const count = document.createElement("span");
  count.className = "outliner-group-count";
  count.textContent = selectionSets.length;
  folderButton.append(icon, label, count);
  folderButton.addEventListener("click", () => {
    sel.state.selectionSetsOpen = !sel.state.selectionSetsOpen;
    renderLockList();
  });
  header.append(disclosure, spacer, folderButton);

  const items = document.createElement("div");
  items.className = "outliner-group-items selection-set-items";
  if (!selectionSets.length) {
    const empty = document.createElement("span");
    empty.className = "outliner-empty";
    empty.textContent = "No selection sets";
    items.appendChild(empty);
  } else {
    selectionSets.forEach((selectionSet) => {
      const item = document.createElement("button");
      item.className = `selection-set-item${selectionSetMatchesCurrentSelection(selectionSet) ? " active" : ""}`;
      item.type = "button";
      const itemIcon = document.createElement("span");
      itemIcon.className = "selection-set-item-icon";
      const itemLabel = document.createElement("span");
      itemLabel.className = "outliner-rename-label";
      itemLabel.textContent = selectionSet.name;
      const itemCount = document.createElement("span");
      itemCount.className = "selection-set-member-count";
      itemCount.textContent = selectionSet.strandIds.length;
      item.append(itemIcon, itemLabel, itemCount);
      item.addEventListener("click", (event) => handleOutlinerRenameClick(event, {
        label: itemLabel,
        value: selectionSet.name,
        onSelect: () => selectSelectionSet(selectionSet),
        onCommit: (nextName) => {
          selectionSet.name = nextName;
        },
        rerender: renderLockList
      }));
      item.addEventListener("contextmenu", (event) => showOutlinerContextMenu(event, {
        type: "selection-set",
        selectionSetId: selectionSet.id
      }));
      items.appendChild(item);
    });
  }
  group.append(header, items);
  return group;
}

function renderLockList() {
  const list = document.querySelector("#lockList");
  list.innerHTML = "";
  STRAND_GROUPS.forEach((group) => {
    const groupLabel = strandRegionDisplayLabel(group.id);
    const groupRoots = locks.filter((lock) => {
      if (lock.proceduralDuplicatePreview) return false;
      if (lock.clumpId && !lock.clumpGuide) return false;
      return (lock.scalpRegion || "unassigned") === group.id;
    });
    const groupLocks = groupRoots.flatMap((lock) => lock.clumpGuide ? clumpProceduralApi.outlinerClumpLocks(lock) : [lock]);
    const groupElement = document.createElement("div");
    const isOpen = strandGroupOpen.get(group.id) || groupLocks.some((lock) => sel.state.selectedStrandIds.has(lock.id));
    groupElement.className = `outliner-group${isOpen ? " open" : ""}`;
    groupElement.dataset.strandGroup = group.id;
    const groupColor = `#${new THREE.Color(SCALP_REGIONS[group.id].color).getHexString()}`;
    groupElement.style.setProperty("--outliner-region-color", groupColor);

    const header = document.createElement("div");
    header.className = `outliner-group-head${sel.state.selectedStrandGroup === group.id ? " selected" : ""}`;
    const disclosure = document.createElement("button");
    disclosure.className = "outliner-disclosure";
    disclosure.type = "button";
    disclosure.title = isOpen ? `Collapse ${groupLabel}` : `Expand ${groupLabel}`;
    disclosure.setAttribute("aria-label", disclosure.title);
    disclosure.setAttribute("aria-expanded", String(isOpen));
    disclosure.textContent = ">";
    disclosure.addEventListener("click", () => {
      strandGroupOpen.set(group.id, !isOpen);
      renderLockList();
    });
    const groupVisibleCount = groupLocks.filter(strandVisibleForDisplay).length;
    const groupVisibility = createOutlinerVisibilityToggle({
      visible: groupLocks.length > 0 && groupVisibleCount === groupLocks.length,
      partial: groupVisibleCount > 0 && groupVisibleCount < groupLocks.length,
      label: groupLabel,
      onToggle: () => {
        pushUndoState();
        if (!groupLocks.length) {
          if (visibleStrandRegions.has(group.id)) visibleStrandRegions.delete(group.id);
          else visibleStrandRegions.add(group.id);
          applyDisplayVisibilityFilters();
          renderLockList();
          return;
        }
        setLocksOutlinerVisibility(groupLocks, groupVisibleCount !== groupLocks.length);
      }
    });
    const selectGroup = document.createElement("button");
    selectGroup.className = "outliner-group-select";
    selectGroup.type = "button";
    selectGroup.setAttribute("aria-pressed", String(sel.state.selectedStrandGroup === group.id));
    selectGroup.addEventListener("click", () => selectStrandGroup(group.id));
    const groupSwatch = document.createElement("span");
    groupSwatch.className = "outliner-group-swatch";
    groupSwatch.style.background = groupColor;
    const label = document.createElement("span");
    label.className = "outliner-group-label";
    label.textContent = groupLabel;
    const count = document.createElement("span");
    count.className = "outliner-group-count";
    count.textContent = groupLocks.length;
    selectGroup.append(groupSwatch, label, count);
    header.append(disclosure, groupVisibility, selectGroup);
    header.addEventListener("contextmenu", (event) => showOutlinerContextMenu(event, {
      type: "strand-region",
      regionId: group.id
    }));
    groupElement.appendChild(header);

    const items = document.createElement("div");
    items.className = "outliner-group-items";
    if (!groupLocks.length) {
      const empty = document.createElement("span");
      empty.className = "outliner-empty";
      empty.textContent = "No strands";
      items.appendChild(empty);
    }
    HAIR_LAYERS.forEach((layer) => {
      const layerRoots = groupRoots.filter((lock) => normalizeHairLayer(lock.hairLayer) === layer.id);
      if (!layerRoots.length) return;
      const layerLockCount = layerRoots.reduce((total, lock) => total + (lock.clumpGuide ? clumpProceduralApi.outlinerClumpLocks(lock).length : 1), 0);
      const layerKey = `${group.id}:${layer.id}`;
      const layerOpen = strandLayerOpen.get(layerKey) !== false || layerRoots.some((lock) => (
        sel.state.selectedStrandIds.has(lock.id)
        || (lock.clumpId && clumpProceduralApi.outlinerClumpLocks(lock).some((item) => sel.state.selectedStrandIds.has(item.id)))
      ));
      const layerElement = document.createElement("div");
      layerElement.className = `outliner-layer${layerOpen ? " open" : ""}`;
      const layerHeader = document.createElement("div");
      layerHeader.className = "outliner-layer-head";
      const layerDisclosure = document.createElement("button");
      layerDisclosure.className = "outliner-layer-disclosure";
      layerDisclosure.type = "button";
      layerDisclosure.textContent = ">";
      layerDisclosure.title = `${layerOpen ? "Collapse" : "Expand"} ${layer.label} layer`;
      layerDisclosure.setAttribute("aria-label", layerDisclosure.title);
      layerDisclosure.setAttribute("aria-expanded", String(layerOpen));
      layerDisclosure.addEventListener("click", () => {
        strandLayerOpen.set(layerKey, !layerOpen);
        renderLockList();
      });
      const layerLocks = layerRoots.flatMap((lock) => lock.clumpGuide ? clumpProceduralApi.outlinerClumpLocks(lock) : [lock]);
      const layerVisibleCount = layerLocks.filter(strandVisibleForDisplay).length;
      const layerVisibility = createOutlinerVisibilityToggle({
        visible: layerLocks.length > 0 && layerVisibleCount === layerLocks.length,
        partial: layerVisibleCount > 0 && layerVisibleCount < layerLocks.length,
        label: `${groupLabel} ${layer.label}`,
        onToggle: () => {
          pushUndoState();
          setLocksOutlinerVisibility(layerLocks, layerVisibleCount !== layerLocks.length);
        }
      });
      const layerSelect = document.createElement("button");
      layerSelect.className = "outliner-layer-select";
      layerSelect.type = "button";
      const layerSwatch = document.createElement("span");
      layerSwatch.className = "outliner-layer-swatch";
      layerSwatch.style.background = materialApi.strandDisplayColor(layerRoots[0]);
      const layerLabel = document.createElement("span");
      layerLabel.textContent = layer.label;
      const layerCount = document.createElement("span");
      layerCount.className = "outliner-layer-count";
      layerCount.textContent = layerLockCount;
      layerSelect.append(layerSwatch, layerLabel, layerCount);
      layerSelect.addEventListener("click", () => {
        strandLayerOpen.set(layerKey, !layerOpen);
        renderLockList();
      });
      layerHeader.append(layerDisclosure, layerVisibility, layerSelect);
      layerHeader.addEventListener("contextmenu", (event) => showOutlinerContextMenu(event, {
        type: "strand-layer",
        regionId: group.id,
        layerId: layer.id
      }));
      const layerItems = document.createElement("div");
      layerItems.className = "outliner-layer-items";
      layerRoots.forEach((lock) => {
        layerItems.appendChild(
          lock.geometryType === "curve-surface"
            ? createOutlinerCurveSurface(lock)
            : lock.clumpGuide ? clumpProceduralApi.createOutlinerClump(lock) : createOutlinerStrandButton(lock)
        );
      });
      layerElement.append(layerHeader, layerItems);
      items.appendChild(layerElement);
    });
    groupElement.appendChild(items);
    list.appendChild(groupElement);
  });
  list.appendChild(createSelectionSetsOutlinerFolder());
  drawFlowApi.refreshLiveSurfaceOptions();
}
// Material UI api deps batch (refactor batch A6): all deps are defined by this point (last dep:
// renderLockList); the batch takes effect here, before the material UI listener registrations
// and the boot-time materialApi.syncHairMaterialEditor() call.
Object.assign(materialDeps, {
  hairMaterialDefinitions, animeAnisotropicLightDirection,
  hairState: hairState.state, sel: sel.state, sculptState: sculptState.state, projectState,
  STRAND_SELECTION_OUTLINE_COLOR,
  pushUndoState, getSelectedLock, editSelectedLocks, renderLockList,
  syncActiveMirror, updateStrandSelectionHighlight, updateStrandSelectionHighlightForLock,
  ensureUvCheckerForLock, strandViewportBaseColor, normalizeHairLayer, drawFlowApi,
  sculptBrushSelectionMaskActive, sculptBrushSelectionAllows, proportionalStrandVisualsActive,
  strandMirrorPartnerHighlighted,
  hairMaterialSelect, hairMaterialOutliner, deleteProjectHairMaterialButton,
  hairMaterialNameInput, hairMaterialShaderInput, hairMaterialColorInput,
  hairMaterialRoughnessInput, hairMaterialRoughnessValue, hairMaterialStandardControls,
  hairMaterialRoughnessControl, hairMaterialAnimeControls, hairMaterialAnimeColorInputs,
  hairMaterialAnimeNumericControls,
  hairMaterialPresetInput, saveHairMaterialPresetButton, removeHairMaterialPresetButton,
  hairMaterialGradientEnabledInput, editHairMaterialGradientButton, hairMaterialGradientPreview,
  hairMaterialGradientDialog, closeHairMaterialGradientDialogButton, doneHairMaterialGradientButton,
  hairMaterialGradientTrack, hairMaterialGradientStopColorInput, hairMaterialGradientStopPositionInput,
  hairMaterialGradientStopPositionValue, addHairMaterialGradientStopButton,
  deleteHairMaterialGradientStopButton, resetHairMaterialGradientButton,
  creationPresetDialog, creationPresetForm, creationPresetDialogTitle, creationPresetDescription,
  creationPresetNameInput, removeCreationPresetDialog, removeCreationPresetDialogTitle,
  removeCreationPresetMessage, confirmRemoveCreationPresetButton
});

function updateCount() {
  const lockText = `${locks.length} ${locks.length === 1 ? "strand" : "strands"}`;
  const accessibleGuideCount = guideApi.outlinerGuides().length;
  const guideText = `${accessibleGuideCount} ${accessibleGuideCount === 1 ? "guide" : "guides"}`;
  document.querySelector("#strandCount").textContent = `${guideText}, ${lockText}`;
  guideApi.renderGuideOutliner();
  updateTopologyStats();
}

function captureInputUndo() {
  if (ui.state.inputUndoCaptured) return;
  pushUndoState();
  ui.state.inputUndoCaptured = true;
}

function bindUndoCapture(input) {
  input.addEventListener("pointerdown", captureInputUndo);
  input.addEventListener("keydown", captureInputUndo);
  input.addEventListener("change", () => {
    ui.state.inputUndoCaptured = false;
  });
  input.addEventListener("blur", () => {
    ui.state.inputUndoCaptured = false;
  });
}

function bindLockInput(key, parser = Number) {
  bindUndoCapture(inputs[key]);
  inputs[key].addEventListener("input", () => {
    const lock = getSelectedLock();
    const target = lock || (creationToolActive() ? activeCreationShapeDefaults() : null);
    if (!target) return;
    const value = parser(inputs[key].value);
    const relativeDimension = Boolean(lock && ["widthScale", "depthScale"].includes(key));
    const relativeRotation = Boolean(lock && key === "strandRotation");
    const primaryDimension = key === "widthScale"
      ? strandWidthDimension(target)
      : key === "depthScale"
        ? strandDepthDimension(target)
        : value;
    const primaryRotation = Number(target.strandRotation ?? 0);
    const dimensionMinimum = Number(inputs[key].min);
    const dimensionMaximum = Number(inputs[key].max);
    const applyValue = (item) => {
      const braidDimension = (key === "widthScale" || key === "depthScale")
        && (item === braidCreationDefaults || item.geometryType === "braid");
      const currentDimension = key === "widthScale"
        ? strandWidthDimension(item)
        : key === "depthScale"
          ? strandDepthDimension(item)
          : value;
      const currentRotation = Number(item.strandRotation ?? 0);
      const nextValue = relativeDimension
        ? relativeEditValue(currentDimension, primaryDimension, value, {
          min: dimensionMinimum,
          max: dimensionMaximum
        })
        : relativeRotation
          ? THREE.MathUtils.clamp(currentRotation + value - primaryRotation, dimensionMinimum, dimensionMaximum)
          : value;
      if (relativeDimension && key === "widthScale") {
        setStrandWidthDimension(item, nextValue);
      } else if (relativeDimension && key === "depthScale") {
        setStrandDepthDimension(item, nextValue);
      } else if (braidDimension) {
        const braidKey = key === "widthScale" ? "braidWidth" : "braidDepth";
        item[braidKey] = nextValue;
        item[key] = 1;
        if (key === "widthScale" && item.geometryType === "braid") {
          item.width = nextValue;
          item.baseWidth = nextValue;
        }
      } else if (key === "widthScale" && lock) {
        item.width = Math.max(0.0001, nextValue);
        item.baseWidth = item.width;
        item.widthScale = 1;
      } else if (key === "depthScale") {
        setStrandDepthDimension(item, nextValue);
      } else {
        item[key] = nextValue;
      }
    };
    const dimensionTargets = relativeDimension
      ? selectedLocksInOrder().filter((item) => item.geometryType !== "poly")
      : null;
    if (lock) editSelectedLocks(applyValue, {
      rootOffset: key === "rootScalpOffset",
      targets: dimensionTargets
    });
    else applyValue(target);
    const braidDimension = (key === "widthScale" || key === "depthScale")
      && (target === braidCreationDefaults || target.geometryType === "braid");
    if (braidDimension) syncShapeDimensionInputs(target);
    if (key === "twist") twistNumberInput.value = Number(target.twist).toFixed(2);
    if (key === "strandRotation") strandRotationValue.textContent = `${Math.round(Number(target.strandRotation ?? 0))}°`;
    if (key === "roughness") roughnessValue.textContent = Number(target[key]).toFixed(2);
    if (key === "radialSegments") topologyValues.strandRadialSegments.textContent = inputs[key].value;
    if (key === "lengthSegments") topologyValues.strandLengthSegments.textContent = inputs[key].value;
    if (key === "densityAggression") topologyValues.strandDensityAggression.textContent = Number(inputs[key].value).toFixed(2);
    if (key === "twistDensity") topologyValues.strandTwistDensity.textContent = Number(inputs[key].value).toFixed(2);
    if (key === "profileOffset") {
      document.querySelector("#profileOffsetValue").textContent = Number(target[key]).toFixed(2);
      renderProfilePreview(profilePreviewPaths.strand, target.sweepProfile, target.profileOffset, target);
      if (sweepProfileEditor.open) branchSweep.renderSweepProfileEditor();
    }
    if (key === "rootScalpOffset") {
      document.querySelector("#rootScalpOffsetValue").textContent = Number(target[key]).toFixed(2);
    }
    if (key === "widthScale" && !braidDimension) document.querySelector("#widthScaleValue").textContent = strandBaseWidth(target).toFixed(2);
    if (key === "depthScale" && !braidDimension) document.querySelector("#depthScaleValue").textContent = strandDepthDimension(target).toFixed(2);
    if (lock) syncMultiStrandInputs(lock);
  });
}

["widthScale", "depthScale", "profileOffset", "rootScalpOffset", "strandRotation", "twist", "radialSegments", "lengthSegments", "densityAggression", "twistDensity"].forEach((key) => bindLockInput(key));

bindUndoCapture(inputs.compoundBridgeLoops);
inputs.compoundBridgeLoops.addEventListener("input", () => {
  const primary = getSelectedLock();
  if (!primary?.curveSurfaceCompoundProfile) return;
  const value = THREE.MathUtils.clamp(
    Math.round(Number(inputs.compoundBridgeLoops.value) || 0),
    0,
    8
  );
  const targets = selectedLocksInOrder().filter((lock) => (
    lock.geometryType === "curve-surface" && lock.curveSurfaceCompoundProfile
  ));
  editSelectedLocks((lock) => {
    lock.compoundBridgeLoops = value;
  }, { targets });
  compoundBridgeLoopsValue.textContent = String(value);
  syncMultiStrandInputs(primary);
});

bindUndoCapture(inputs.compoundBridgeSmoothing);
inputs.compoundBridgeSmoothing.addEventListener("input", () => {
  const primary = getSelectedLock();
  if (!primary?.curveSurfaceCompoundProfile) return;
  const value = THREE.MathUtils.clamp(
    Number(inputs.compoundBridgeSmoothing.value) || 0,
    0,
    1
  );
  const targets = selectedLocksInOrder().filter((lock) => (
    lock.geometryType === "curve-surface" && lock.curveSurfaceCompoundProfile
  ));
  editSelectedLocks((lock) => {
    lock.compoundBridgeSmoothing = value;
  }, { targets });
  compoundBridgeSmoothingValue.textContent = value.toFixed(2);
  syncMultiStrandInputs(primary);
});

strandLayerInput.addEventListener("change", () => {
  const layerId = normalizeHairLayer(strandLayerInput.value);
  const lock = getSelectedLock();
  if (!lock && creationToolActive()) {
    activeCreationShapeDefaults().hairLayer = layerId;
    syncViewportDrawSettings();
    if (sculptState.state.drawStrandStroke) drawFlowApi.updateDrawStrandPreview();
    return;
  }
  if (!lock) return;
  pushUndoState();
  editSelectedLocks((item) => setLockHairLayer(item, layerId));
  syncMultiStrandInputs(lock);
});

viewportDrawLayerInput.addEventListener("change", () => {
  const layerId = normalizeHairLayer(viewportDrawLayerInput.value);
  strandCreationDefaults.hairLayer = layerId;
  if (sel.state.activeTool === "draw" && !getSelectedLock()) strandLayerInput.value = layerId;
  if (sculptState.state.drawStrandStroke?.outputType === "strand") drawFlowApi.updateDrawStrandPreview();
  placementApi.updatePlacementStatus();
});

bindUndoCapture(clumpInfluenceInput);
clumpInfluenceInput.addEventListener("input", () => {
  const lock = getSelectedLock();
  const guide = clumpProceduralApi.clumpGuideForLock(lock);
  if (!guide) return;
  guide.clumpInfluence = THREE.MathUtils.clamp(Number(clumpInfluenceInput.value), 0, 1);
  clumpInfluenceValue.textContent = guide.clumpInfluence.toFixed(2);
  clumpProceduralApi.updateClumpMembers(guide);
  const mirroredGuide = syncActiveMirror(guide);
  if (mirroredGuide?.clumpGuide) clumpProceduralApi.updateClumpMembers(mirroredGuide);
});

const clumpShapeProperties = {
  spread: "clumpSpread",
  depthSpread: "clumpDepthSpread",
  tipFan: "clumpTipFan",
  roll: "clumpRoll",
  strandWidth: "clumpStrandWidth",
  strandDepth: "clumpStrandDepth",
  variation: "clumpVariation"
};

Object.entries(clumpShapeInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    const guide = clumpProceduralApi.clumpGuideForLock(getSelectedLock());
    if (!guide?.clumpGuide) return;
    guide[clumpShapeProperties[key]] = Number(input.value);
    clumpShapeValues[key].textContent = key === "roll"
      ? `${Math.round(guide.clumpRoll)}°`
      : Number(input.value).toFixed(2);
    clumpProceduralApi.updateClumpMembers(guide);
    const mirroredGuide = syncActiveMirror(guide);
    if (mirroredGuide?.clumpGuide) clumpProceduralApi.updateClumpMembers(mirroredGuide);
  });
});

editScalpOutlinerAction.addEventListener("click", () => {
  hideOutlinerContextMenu();
  setViewportEditMode("guide");
  scalpBuilder.setScalpBuilderEditing(true);
  scalpBuilder.setScalpSetupMenuOpen(false);
});

createClumpFromSelectionAction.addEventListener("click", () => {
  hideOutlinerContextMenu();
  clumpProceduralApi.createClumpFromSelection();
});

createSelectionSetFromSelectedAction.addEventListener("click", () => {
  hideOutlinerContextMenu();
  createSelectionSetFromSelection();
});

addSelectedToSelectionSetAction.addEventListener("click", () => {
  const selectionSetId = sel.state.outlinerContextTarget?.type === "selection-set"
    ? sel.state.outlinerContextTarget.selectionSetId
    : null;
  hideOutlinerContextMenu();
  if (selectionSetId && editSelectionSetFromSelection(selectionSetId, "add")) return;
  openSelectionSetMembershipDialog("add");
});

cancelSelectionSetMembershipButton.addEventListener("click", closeSelectionSetMembershipDialog);
selectionSetMembershipDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSelectionSetMembershipDialog();
});
selectionSetMembershipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectionSetId = new FormData(selectionSetMembershipForm).get("selectionSetMembershipTarget");
  if (!selectionSetId || !sel.state.selectionSetMembershipMode) return;
  if (editSelectionSetFromSelection(String(selectionSetId), sel.state.selectionSetMembershipMode)) {
    closeSelectionSetMembershipDialog();
  }
});

removeSelectedFromSelectionSetAction.addEventListener("click", () => {
  const selectionSetId = sel.state.outlinerContextTarget?.type === "selection-set"
    ? sel.state.outlinerContextTarget.selectionSetId
    : null;
  hideOutlinerContextMenu();
  if (selectionSetId && editSelectionSetFromSelection(selectionSetId, "remove")) return;
  openSelectionSetMembershipDialog("remove");
});

lockOutlinerAction.addEventListener("click", () => {
  const targets = outlinerLockTargets();
  const unlockTargets = targets.length > 0 && targets.every((lock) => lock.locked);
  hideOutlinerContextMenu();
  if (unlockTargets) unlockStrands(targets);
  else lockStrands(targets);
});

promoteLiveSurfaceGuideAction.addEventListener("click", () => {
  const target = sel.state.outlinerContextTarget;
  const lock = target?.type === "strand" ? locks.find((item) => item.id === target.lockId) : null;
  if (!lock) return;
  pushUndoState();
  lock.liveSurfaceGuide = !lock.liveSurfaceGuide;
  const promoted = lock.liveSurfaceGuide;
  hideOutlinerContextMenu();
  renderLockList();
  if (promoted) drawFlowApi.setActiveStrokeSurfaceValue(`strand:${lock.id}`);
  placementApi.updatePlacementStatus();
});

dissolveClumpAction.addEventListener("click", () => {
  const target = sel.state.outlinerContextTarget;
  const guide = target?.type === "clump" ? locks.find((lock) => lock.id === target.guideId) : null;
  if (!guide?.clumpId) return;
  pushUndoState();
  clumpProceduralApi.dissolveClump(guide.clumpId);
  sel.state.clumpViewportSelection = false;
  hideOutlinerContextMenu();
  selectLock(guide.id);
});

createClumpPresetAction.addEventListener("click", () => {
  const target = sel.state.outlinerContextTarget;
  const guide = target?.type === "clump" ? locks.find((lock) => lock.id === target.guideId) : null;
  hideOutlinerContextMenu();
  presetLibraryApi.createCustomClumpPreset(guide);
});

mirrorInstanceAction.addEventListener("click", () => {
  const target = sel.state.outlinerContextTarget;
  const guide = target?.type === "clump" ? locks.find((item) => item.id === target.guideId) : null;
  const lock = target?.type === "strand" ? locks.find((item) => item.id === target.lockId) : null;
  if (!lock && !guide) return;
  pushUndoState();
  hideOutlinerContextMenu();
  if (guide) {
    if (clumpProceduralApi.mirroredClumpPartners(guide).length) {
      clumpProceduralApi.decoupleMirroredClump(guide);
      return;
    }
    const mirroredGuide = clumpProceduralApi.createMirroredClump(guide);
    if (mirroredGuide) selectLock(mirroredGuide.id);
    return;
  }
  const partner = mirrorPartnerFor(lock);
  if (partner) {
    decoupleMirrorPartner(lock);
    renderLockList();
    return;
  }
  const mirrored = createMirrorPartner(lock);
  if (mirrored) selectLock(mirrored.id, {
    individualClumpMember: Boolean(mirrored.clumpId && !mirrored.clumpGuide)
  });
});

deleteOutlinerAction.addEventListener("click", () => {
  const target = sel.state.outlinerContextTarget;
  hideOutlinerContextMenu();
  if (target?.type === "selection-set") {
    deleteSelectionSet(target.selectionSetId);
    return;
  }
  if (target?.type === "reference") {
    const reference = referenceImages.find((reference) => reference.id === target.referenceId);
    if (!reference) return;
    referenceHeadApi.selectReferenceImage(reference.id);
    referenceHeadApi.deleteSelectedReferenceImage();
    return;
  }
  if (target?.type === "guide") {
    deleteGuide(guides.find((guide) => guide.id === target.guideId));
    return;
  }
  if (target?.type === "clump") {
    const guide = locks.find((lock) => lock.id === target.guideId);
    const targets = clumpProceduralApi.outlinerClumpLocks(guide);
    if (!targets.length) return;
    pushUndoState();
    deleteLocks(targets);
    return;
  }
  const lock = target?.type === "strand" ? locks.find((item) => item.id === target.lockId) : null;
  if (!lock) return;
  pushUndoState();
  const mirrorPartner = sculptState.state.mirrorXEditing ? mirrorPartnerFor(lock) : null;
  deleteLocks(mirrorPartner ? [lock, mirrorPartner] : [lock]);
});

document.addEventListener("pointerdown", (event) => {
  if (!clumpContextMenu.classList.contains("hidden") && !clumpContextMenu.contains(event.target)) {
    hideOutlinerContextMenu();
  }
  if (!guideViewContextMenu.classList.contains("hidden") && !guideViewContextMenu.contains(event.target)) {
    guideApi.hideGuideViewContextMenu();
  }
  if (!strandRadialMenu.classList.contains("hidden") && !strandRadialMenu.contains(event.target)) {
    radialMenuApi.cancelStrandRadialGesture();
  }
  if (!toolRadialMenu.classList.contains("hidden") && !toolRadialMenu.contains(event.target)) {
    radialMenuApi.cancelToolRadialGesture();
  }
});

function applyUniformTransformScale(handle) {
  const drag = sculptState.state.uniformScaleDrag;
  if (!drag?.startScale || transformControls.mode !== "scale") return;
  const axes = drag.axis === "XYZ" ? ["x", "y", "z"] : drag.axis.toLowerCase().split("");
  const ratios = axes.map((axis) => {
    const start = drag.startScale[axis];
    return Math.abs(start) > 1e-6 ? handle.scale[axis] / start : 1;
  });
  const factor = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  if (!Number.isFinite(factor)) return;
  handle.scale.copy(drag.startScale);
  axes.forEach((axis) => {
    handle.scale[axis] = drag.startScale[axis] * factor;
  });
  if (sculptState.state.transformScaleDrag?.appliedScale) sculptState.state.transformScaleDrag.appliedScale.copy(handle.scale);
}

function applyReducedTransformScale(handle) {
  const drag = sculptState.state.transformScaleDrag;
  const startScale = drag?.startScale;
  if (!startScale || transformControls.mode !== "scale") return;
  const precision = transform.state.transformPrecisionHeld ? TRANSFORM_PRECISION_MULTIPLIER : 1;
  if (drag.axis === "XYZ") {
    const horizontalDrag = drag.pointerX - drag.lastPointerX;
    const upwardDrag = drag.lastPointerY - drag.pointerY;
    const screenDrag = Math.abs(horizontalDrag) >= Math.abs(upwardDrag)
      ? horizontalDrag
      : upwardDrag;
    const factor = THREE.MathUtils.clamp(
      Math.exp(screenDrag * 0.01 * miscState.state.scaleSensitivity * precision),
      MIN_UNIFORM_SCALE_RATIO,
      MAX_UNIFORM_SCALE_RATIO
    );
    drag.appliedScale.multiplyScalar(factor);
    drag.appliedScale.set(
      THREE.MathUtils.clamp(drag.appliedScale.x, startScale.x * MIN_UNIFORM_SCALE_RATIO, startScale.x * MAX_UNIFORM_SCALE_RATIO),
      THREE.MathUtils.clamp(drag.appliedScale.y, startScale.y * MIN_UNIFORM_SCALE_RATIO, startScale.y * MAX_UNIFORM_SCALE_RATIO),
      THREE.MathUtils.clamp(drag.appliedScale.z, startScale.z * MIN_UNIFORM_SCALE_RATIO, startScale.z * MAX_UNIFORM_SCALE_RATIO)
    );
    handle.scale.copy(drag.appliedScale);
    drag.lastPointerX = drag.pointerX;
    drag.lastPointerY = drag.pointerY;
    return;
  }
  const rawScale = handle.scale.clone();
  ["x", "y", "z"].forEach((axis) => {
    const previousRaw = drag.lastRawScale?.[axis];
    if (Math.abs(previousRaw) <= 1e-6) return;
    const rawRatio = rawScale[axis] / previousRaw;
    const adjustedRatio = 1 + (rawRatio - 1) * miscState.state.scaleSensitivity * precision;
    drag.appliedScale[axis] *= adjustedRatio;
  });
  drag.lastRawScale.copy(rawScale);
  handle.scale.copy(drag.appliedScale);
}

function applyTransformPrecision(handle) {
  const drag = sculptState.state.transformPrecisionDrag;
  if (!drag || drag.mode !== transformControls.mode) return;
  const precision = transform.state.transformPrecisionHeld ? TRANSFORM_PRECISION_MULTIPLIER : 1;
  if (drag.mode === "translate") {
    const rawPosition = handle.position.clone();
    drag.appliedPosition.addScaledVector(
      rawPosition.clone().sub(drag.lastRawPosition),
      precision
    );
    drag.lastRawPosition.copy(rawPosition);
    handle.position.copy(drag.appliedPosition);
    return;
  }
  if (drag.mode !== "rotate") return;
  const rawQuaternion = handle.quaternion.clone();
  const localRotation = transformControls.space === "local"
    && !["E", "XYZE"].includes(transformControls.axis);
  const delta = localRotation
    ? drag.lastRawQuaternion.clone().invert().multiply(rawQuaternion)
    : rawQuaternion.clone().multiply(drag.lastRawQuaternion.clone().invert());
  const appliedDelta = new THREE.Quaternion().slerp(delta, precision);
  if (localRotation) drag.appliedQuaternion.multiply(appliedDelta);
  else drag.appliedQuaternion.premultiply(appliedDelta);
  drag.appliedQuaternion.normalize();
  drag.lastRawQuaternion.copy(rawQuaternion);
  handle.quaternion.copy(drag.appliedQuaternion);
}

function updateTransformScalePointer(event) {
  if (!sculptState.state.transformScaleDrag || sculptState.state.transformScaleDrag.axis !== "XYZ") return;
  if (sculptState.state.transformScaleDrag.pointerId !== null && event.pointerId !== sculptState.state.transformScaleDrag.pointerId) return;
  sculptState.state.transformScaleDrag.pointerX = event.clientX;
  sculptState.state.transformScaleDrag.pointerY = event.clientY;
}
window.addEventListener("blur", () => {
  hideOutlinerContextMenu();
  guideApi.hideGuideViewContextMenu();
});
window.addEventListener("resize", () => {
  hideOutlinerContextMenu();
  guideApi.hideGuideViewContextMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideOutlinerContextMenu();
    guideApi.hideGuideViewContextMenu();
  }
});

strandDynamicDensityInput.addEventListener("change", () => {
  const lock = getSelectedLock();
  if (!lock) return;
  pushUndoState();
  editSelectedLocks((item) => { item.dynamicDensity = strandDynamicDensityInput.checked; });
  inputs.densityAggression.disabled = !strandDynamicDensityInput.checked;
  inputs.twistDensity.disabled = !strandDynamicDensityInput.checked;
  syncMultiStrandInputs(lock);
});

bindUndoCapture(twistNumberInput);
twistNumberInput.addEventListener("input", () => {
  const lock = getSelectedLock();
  const target = lock || (creationToolActive() ? activeCreationShapeDefaults() : null);
  const value = Number(twistNumberInput.value);
  if (!target || !Number.isFinite(value)) return;
  if (lock) editSelectedLocks((item) => { item.twist = value; });
  else target.twist = value;
  inputs.twist.value = THREE.MathUtils.clamp(value, Number(inputs.twist.min), Number(inputs.twist.max));
  if (lock) syncMultiStrandInputs(lock);
});

hairMaterialSelect.addEventListener("change", () => {
  const lock = getSelectedLock();
  if (!lock) return;
  pushUndoState();
  editSelectedLocks((item) => {
    item.materialId = hairMaterialSelect.value;
    materialApi.applyMaterialDefinitionToLock(item);
  }, { renderList: false });
  materialApi.syncHairMaterialEditor(lock);
  renderLockList();
  syncMultiStrandInputs(lock);
});

newHairMaterialButton.addEventListener("click", () => {
  materialApi.createProjectHairMaterial({ assignToSelected: true });
});

addProjectHairMaterialButton.addEventListener("click", () => materialApi.createProjectHairMaterial());
deleteProjectHairMaterialButton.addEventListener("click", materialApi.deleteActiveHairMaterial);
hairMaterialOutliner.addEventListener("click", (event) => {
  const item = event.target.closest("[data-hair-material-id]");
  if (!item) return;
  hairState.state.activeHairMaterialId = item.dataset.hairMaterialId;
  materialApi.markHairMaterialPresetCustom();
  materialApi.syncHairMaterialEditor();
  hairMaterialOutliner.querySelector(`[data-hair-material-id="${CSS.escape(item.dataset.hairMaterialId)}"]`)?.focus();
});

[
  hairMaterialNameInput,
  hairMaterialShaderInput,
  hairMaterialColorInput,
  hairMaterialRoughnessInput,
  ...Object.values(hairMaterialAnimeColorInputs),
  ...Object.values(hairMaterialAnimeNumericControls).map((control) => control.input)
].forEach(bindUndoCapture);
hairMaterialNameInput.addEventListener("input", () => {
  materialApi.markHairMaterialPresetCustom();
  const material = materialApi.activeHairMaterialDefinition();
  material.name = hairMaterialNameInput.value || "Untitled Material";
  materialApi.renderHairMaterialOptions(getSelectedLock()?.materialId || DEFAULT_HAIR_MATERIAL_ID);
  materialApi.renderHairMaterialOutliner();
});
hairMaterialShaderInput.addEventListener("change", () => {
  materialApi.markHairMaterialPresetCustom();
  const material = materialApi.activeHairMaterialDefinition();
  material.shader = normalizeHairShader(hairMaterialShaderInput.value);
  materialApi.refreshMaterialUsers(material.id);
  materialApi.syncHairMaterialEditor();
});
hairMaterialColorInput.addEventListener("input", () => {
  materialApi.markHairMaterialPresetCustom();
  const material = materialApi.activeHairMaterialDefinition();
  material.color = hairMaterialColorInput.value;
  materialApi.refreshMaterialUsers(material.id);
  materialApi.renderHairMaterialOutliner();
});
hairMaterialRoughnessInput.addEventListener("input", () => {
  materialApi.markHairMaterialPresetCustom();
  const material = materialApi.activeHairMaterialDefinition();
  material.roughness = Number(hairMaterialRoughnessInput.value);
  hairMaterialRoughnessValue.textContent = material.roughness.toFixed(2);
  materialApi.refreshMaterialUsers(material.id);
});
Object.entries(hairMaterialAnimeColorInputs).forEach(([key, input]) => {
  input.addEventListener("input", () => {
    materialApi.markHairMaterialPresetCustom();
    const material = materialApi.activeHairMaterialDefinition();
    material[key] = input.value;
    materialApi.refreshMaterialUsers(material.id);
    materialApi.renderHairMaterialOutliner();
  });
});
Object.entries(hairMaterialAnimeNumericControls).forEach(([key, control]) => {
  control.input.addEventListener("input", () => {
    materialApi.markHairMaterialPresetCustom();
    const material = materialApi.activeHairMaterialDefinition();
    const field = ANIME_ANISOTROPIC_NUMERIC_FIELDS[key];
    material[key] = THREE.MathUtils.clamp(Number(control.input.value), field.min, field.max);
    control.output.textContent = material[key].toFixed(field.digits);
    materialApi.refreshMaterialUsers(material.id);
  });
});

// Material Presets + Base Color Gradient UI (port from main 0.1.5). Registered here after the
// materialDeps batch and before presetLibraryApi.setupCreationPresetUi() so the shared creation
// preset dialog submit/confirm listeners added by material-ui run first.
materialApi.setupHairMaterialGradientUi();
materialApi.setupHairMaterialPresetUi();
Object.entries(groupInputs).forEach(([key, input]) => {
  input.addEventListener("pointerdown", requestGroupDefaultsWarning, { capture: true });
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    if (!sel.state.selectedStrandGroup) return;
    if (key === "lengthScale") {
      setGroupLengthScale(sel.state.selectedStrandGroup, Number(input.value));
      document.querySelector("#groupLengthScaleValue").textContent = Number(input.value).toFixed(2);
      return;
    }
    strandGroupDefaults[sel.state.selectedStrandGroup][key] = Number(input.value);
    if (key === "radialSegments") topologyValues.groupRadialSegments.textContent = input.value;
    if (key === "lengthSegments") topologyValues.groupLengthSegments.textContent = input.value;
    if (key === "densityAggression") topologyValues.groupDensityAggression.textContent = Number(input.value).toFixed(2);
    if (key === "twistDensity") topologyValues.groupTwistDensity.textContent = Number(input.value).toFixed(2);
    if (key === "profileOffset") {
      document.querySelector("#groupProfileOffsetValue").textContent = Number(input.value).toFixed(2);
      renderProfilePreview(profilePreviewPaths.group, strandGroupDefaults[sel.state.selectedStrandGroup].sweepProfile, Number(input.value), strandGroupDefaults[sel.state.selectedStrandGroup]);
      if (sweepProfileEditor.open) branchSweep.renderSweepProfileEditor();
    }
    if (key === "rootScalpOffset") document.querySelector("#groupRootScalpOffsetValue").textContent = Number(input.value).toFixed(2);
    if (key === "widthScale") document.querySelector("#groupWidthScaleValue").textContent = Number(input.value).toFixed(2);
    if (key === "depthScale") document.querySelector("#groupDepthScaleValue").textContent = Number(input.value).toFixed(2);
    applyGroupDefaultsToExistingStrands(sel.state.selectedStrandGroup);
  });
});
Object.entries(groupLayerInputs).forEach(([layerId, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    if (!sel.state.selectedStrandGroup) return;
    const value = Number(input.value);
    document.querySelector(`#${input.id}Value`).textContent = value.toFixed(2);
    setGroupLayerOffset(sel.state.selectedStrandGroup, layerId, value);
    updateTopologyStats();
  });
});
groupDynamicDensityInput.addEventListener("pointerdown", requestGroupDefaultsWarning, { capture: true });
groupDynamicDensityInput.addEventListener("change", () => {
  if (!sel.state.selectedStrandGroup) return;
  pushUndoState();
  const defaults = strandGroupDefaults[sel.state.selectedStrandGroup];
  defaults.dynamicDensity = groupDynamicDensityInput.checked;
  groupInputs.densityAggression.disabled = !defaults.dynamicDensity;
  groupInputs.twistDensity.disabled = !defaults.dynamicDensity;
  applyGroupDefaultsToExistingStrands(sel.state.selectedStrandGroup);
});
confirmGroupDefaultsChange.addEventListener("click", () => {
  miscState.state.groupDefaultsWarningAcknowledged = true;
  if (hideGroupDefaultsWarning.checked) {
    localStorage.setItem("anime-hair-hide-group-defaults-warning", "true");
  }
  groupDefaultsWarning.close();
  const continuation = miscState.state.groupDefaultsWarningContinuation;
  miscState.state.groupDefaultsWarningContinuation = null;
  continuation?.();
});
cancelGroupDefaultsChange.addEventListener("click", () => {
  miscState.state.groupDefaultsWarningContinuation = null;
  groupDefaultsWarning.close();
});
confirmPanelSplitSnapDisable.addEventListener("click", () => {
  ui.state.panelSplitSnapWarningAcknowledged = true;
  localStorage.setItem("anime-hair-panel-split-snap-warning", "true");
  panelSplitSnapWarning.close();
  const continuation = ui.state.panelSplitSnapWarningContinuation;
  ui.state.panelSplitSnapWarningContinuation = null;
  continuation?.();
});
cancelPanelSplitSnapDisable.addEventListener("click", () => {
  ui.state.panelSplitSnapWarningContinuation = null;
  panelSplitSnapWarning.close();
});
panelSplitSnapWarning.addEventListener("cancel", () => {
  ui.state.panelSplitSnapWarningContinuation = null;
});
// File > New：先确认再清场景。刻意**不做**「不再提示」勾选（对比 groupDefaultsWarning）：
// 这一步会丢弃未保存的全部工作且不可撤销（New 会清 undo 栈），不给静默跳过的开关。
document.querySelector("#newHairProject").addEventListener("click", () => {
  if (!newProjectWarning.open) newProjectWarning.showModal();
});
confirmNewProjectButton.addEventListener("click", () => {
  newProjectWarning.close();
  startNewProject();
});
cancelNewProjectButton.addEventListener("click", () => {
  newProjectWarning.close();
});
editSweepProfileButtons.forEach((button) => button.addEventListener("click", branchSweep.openSweepProfileEditor));
document.querySelector("#closeSweepProfile").addEventListener("click", branchSweep.closeSweepProfileEditor);
sweepProfileEditor.addEventListener("cancel", () => {
  sculptState.state.sweepProfileEdit = null;
});
sweepProfileEditor.addEventListener("close", updateViewportStatsVisibility);
sweepProfileCanvas.addEventListener("pointerdown", (event) => {
  const pointIndex = Number(event.target?.dataset?.profilePoint);
  if (!Number.isInteger(pointIndex) || !sculptState.state.sweepProfileEdit) return;
  pushUndoState();
  sculptState.state.sweepProfileEdit.selectedIndex = pointIndex;
  sculptState.state.sweepProfileEdit.mirrorIndex = projectState.state.sweepProfileMirrorEnabled
    ? branchSweep.mirroredSweepProfileIndex(branchSweep.activeSweepProfile(), pointIndex)
    : null;
  sculptState.state.sweepProfileEdit.dragPointerId = event.pointerId;
  sweepProfileCanvas.setPointerCapture?.(event.pointerId);
  branchSweep.renderSweepProfileEditor();
  event.preventDefault();
});
sweepProfileCanvas.addEventListener("pointermove", (event) => {
  if (!sculptState.state.sweepProfileEdit || sculptState.state.sweepProfileEdit.dragPointerId !== event.pointerId) return;
  const profile = branchSweep.activeSweepProfile();
  const selected = profile?.[sculptState.state.sweepProfileEdit.selectedIndex];
  if (!selected) return;
  const nextPoint = canvasToProfile(event);
  if (projectState.state.sweepProfileMirrorEnabled && sculptState.state.sweepProfileEdit.mirrorIndex === sculptState.state.sweepProfileEdit.selectedIndex) {
    nextPoint.x = 0;
  }
  Object.assign(selected, nextPoint);
  const mirrored = profile[sculptState.state.sweepProfileEdit.mirrorIndex];
  if (projectState.state.sweepProfileMirrorEnabled && mirrored && mirrored !== selected) {
    mirrored.x = -nextPoint.x;
    mirrored.z = nextPoint.z;
  }
  branchSweep.applySweepProfileEdit();
  event.preventDefault();
});
sweepProfileCanvas.addEventListener("pointerup", branchSweep.finishSweepProfileDrag);
sweepProfileCanvas.addEventListener("pointercancel", branchSweep.finishSweepProfileDrag);
bindUndoCapture(sweepPointInterpolation);
sweepPointInterpolation.addEventListener("change", () => {
  const profile = branchSweep.activeSweepProfile();
  const selected = profile?.[sculptState.state.sweepProfileEdit?.selectedIndex];
  if (!selected) return;
  selected.interpolation = sweepPointInterpolation.value;
  const mirrorIndex = projectState.state.sweepProfileMirrorEnabled
    ? branchSweep.mirroredSweepProfileIndex(profile, sculptState.state.sweepProfileEdit.selectedIndex)
    : null;
  const mirrored = profile[mirrorIndex];
  if (mirrored && mirrored !== selected) mirrored.interpolation = sweepPointInterpolation.value;
  branchSweep.applySweepProfileEdit();
});
sweepProfileMirrorX.addEventListener("click", () => {
  projectState.state.sweepProfileMirrorEnabled = !projectState.state.sweepProfileMirrorEnabled;
  sweepProfileMirrorX.setAttribute("aria-pressed", String(projectState.state.sweepProfileMirrorEnabled));
});
Object.entries(sweepProfileTrimInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    const target = branchSweep.activeSweepProfileTarget();
    if (!target) return;
    const value = THREE.MathUtils.clamp(Number(input.value), 0, 1);
    target[key] = value;
    if (projectState.state.sweepProfileMirrorEnabled) {
      const mirroredKey = key === "profileTrimLeft" ? "profileTrimRight" : "profileTrimLeft";
      target[mirroredKey] = value;
    }
    branchSweep.applySweepProfileEdit();
  });
});
bindUndoCapture(sweepProfileTrimRoundness);
sweepProfileTrimRoundness.addEventListener("input", () => {
  const target = branchSweep.activeSweepProfileTarget();
  if (!target) return;
  target.profileTrimRoundness = THREE.MathUtils.clamp(Number(sweepProfileTrimRoundness.value), 0, 1);
  branchSweep.applySweepProfileEdit();
});
document.querySelector("#addSweepPoint").addEventListener("click", () => {
  const profile = branchSweep.activeSweepProfile();
  if (!profile?.length || !sculptState.state.sweepProfileEdit) return;
  pushUndoState();
  const index = THREE.MathUtils.clamp(sculptState.state.sweepProfileEdit.selectedIndex, 0, profile.length - 1);
  const next = profile[(index + 1) % profile.length];
  const current = profile[index];
  profile.splice(index + 1, 0, {
    x: (current.x + next.x) * 0.5,
    z: (current.z + next.z) * 0.5,
    interpolation: current.interpolation || "smooth"
  });
  sculptState.state.sweepProfileEdit.selectedIndex = index + 1;
  branchSweep.applySweepProfileEdit();
});
document.querySelector("#deleteSweepPoint").addEventListener("click", () => {
  const profile = branchSweep.activeSweepProfile();
  if (!profile || profile.length <= 4 || !sculptState.state.sweepProfileEdit) return;
  pushUndoState();
  profile.splice(sculptState.state.sweepProfileEdit.selectedIndex, 1);
  sculptState.state.sweepProfileEdit.selectedIndex = Math.min(sculptState.state.sweepProfileEdit.selectedIndex, profile.length - 1);
  branchSweep.applySweepProfileEdit();
});
document.querySelector("#resetSweepProfile").addEventListener("click", () => {
  const profile = branchSweep.activeSweepProfile();
  const target = branchSweep.activeSweepProfileTarget();
  if (!profile || !sculptState.state.sweepProfileEdit) return;
  pushUndoState();
  profile.splice(0, profile.length, ...DEFAULT_SWEEP_PROFILE.map((point) => ({ ...point })));
  if (target) {
    target.profileTrimLeft = 0;
    target.profileTrimRight = 0;
    target.profileTrimRoundness = 1;
  }
  sculptState.state.sweepProfileEdit.selectedIndex = 0;
  branchSweep.applySweepProfileEdit();
});
editTaperCurveButtons.forEach((button) => button.addEventListener("click", () => {
  // 段曲线容器（panel 段 / 发丝管段两块共用 data-segment-curve）：目标由几何分派，
  // 两块互斥可见，故无需按容器 id 分流。
  if (button.closest("[data-segment-curve]")) segmentApi.openSegmentCurveEditor(button.dataset.curveKey);
  else taperEditor.openTaperCurveEditor(button.dataset.curveKey);
}));
document.querySelector("#closeTaperCurve").addEventListener("click", taperEditor.closeTaperCurveEditor);
taperCurveEditor.addEventListener("cancel", () => {
  taperEditor.flushScheduledTaperCurveEdit();
  taperEditor.finishTaperMeshPointDrag(null);
  taperEditor.setTaperMeshPointsVisible(false);
  taperMeshPointsToggleRow.classList.add("hidden");
  sculptState.state.taperCurveEdit = null;
});
taperCurveEditor.addEventListener("close", updateViewportStatsVisibility);
taperMeshPointsToggle.addEventListener("change", () => {
  taperEditor.setTaperMeshPointsVisible(taperMeshPointsToggle.checked);
});
taperAsymmetryToggle.addEventListener("change", () => {
  const target = taperEditor.activeTaperTarget();
  if (!target || !sculptState.state.taperCurveEdit || branchSweep.twistCurveEditing() || branchSweep.proceduralBranchCurveEditing()) return;
  pushUndoState();
  if (taperAsymmetryToggle.checked) {
    target[shapePresets.taperSecondaryKey()] = shapePresets.cloneShapePresetValue(target[sculptState.state.taperCurveEdit.curveKey]);
  } else {
    taperEditor.ensureSecondaryTaperCurve(target);
  }
  target[shapePresets.taperAsymmetryKey()] = taperAsymmetryToggle.checked;
  if (!taperAsymmetryToggle.checked) sculptState.state.taperCurveEdit.side = "primary";
  sculptState.state.taperCurveEdit.selectedIndex = 0;
  taperEditor.applyTaperCurveEdit();
});
centerAsymmetricProfileToggle.addEventListener("change", () => {
  const target = taperEditor.activeTaperTarget();
  if (!target || !sculptState.state.taperCurveEdit || branchSweep.twistCurveEditing() || branchSweep.proceduralBranchCurveEditing()) return;
  pushUndoState();
  target.centerAsymmetricProfile = centerAsymmetricProfileToggle.checked;
  taperEditor.applyTaperCurveEdit();
});
taperCurveCanvas.addEventListener("pointerdown", (event) => {
  const pointIndex = Number(event.target?.dataset?.taperPoint);
  if (!Number.isInteger(pointIndex) || !sculptState.state.taperCurveEdit) return;
  // 隐藏/记录点（segment 曲线里 t < 本侧 fork）不可拖。
  if (event.target.dataset.tipHidden === "1") return;
  taperEditor.releaseTaperCurveEditorFieldFocus();
  pushUndoState();
  sculptState.state.taperCurveEdit.side = event.target.dataset.curveSide === "secondary" ? "secondary" : "primary";
  sculptState.state.taperCurveEdit.selectedIndex = pointIndex;
  sculptState.state.taperCurveEdit.dragDisplayRange = branchSweep.twistCurveEditing()
    ? twistCurveDisplayRange(
        taperEditor.activeTaperCurve(),
        TWIST_CURVE_DISPLAY_RANGE_DEFAULT,
        TWIST_CURVE_VALUE_MAX
      )
    : null;
  sculptState.state.taperCurveEdit.dragPointerId = event.pointerId;
  taperCurveCanvas.setPointerCapture?.(event.pointerId);
  taperEditor.renderTaperCurveEditor();
  event.preventDefault();
});
taperCurveCanvas.addEventListener("pointermove", (event) => {
  if (!sculptState.state.taperCurveEdit || sculptState.state.taperCurveEdit.dragPointerId !== event.pointerId) return;
  const curve = taperEditor.activeTaperCurve();
  const selected = curve?.[sculptState.state.taperCurveEdit.selectedIndex];
  if (!selected) return;
  Object.assign(selected, taperEditor.canvasToTaperPoint(event, sculptState.state.taperCurveEdit.selectedIndex));
  curve.sort((a, b) => a.position - b.position);
  sculptState.state.taperCurveEdit.selectedIndex = curve.indexOf(selected);
  taperEditor.scheduleTaperCurveEdit();
  event.preventDefault();
});
taperCurveCanvas.addEventListener("pointerup", taperEditor.finishTaperCurveDrag);
taperCurveCanvas.addEventListener("pointercancel", taperEditor.finishTaperCurveDrag);
// Branch root region editor (2D u/v rectangle).
const branchRegionCanvas = document.querySelector("#branchRegionCanvas");
const branchRegionDialog = document.querySelector("#branchRegionEditor");
document.querySelector("#closeBranchRegion").addEventListener("click", branchRegion.closeBranchRegionEditor);
document.querySelector("#resetBranchRegion").addEventListener("click", () => {
  if (!sculptState.state.branchRegionEdit) return;
  const lock = locks.find((item) => item.id === sculptState.state.branchRegionEdit);
  if (!lock) return;
  pushUndoState();
  lock.branchRootRegion = branchRegion.branchRootRegionFromParam(lock.branchParentParameter ?? 0.4);
  branchRegion.setBranchRootRegionPoint(lock, "up", lock.branchRootRegion.cross.up);
  branchRegion.renderBranchRegionEditor();
});
branchRegionDialog.addEventListener("cancel", branchRegion.closeBranchRegionEditor);
const branchRegionMeshPointsToggle = document.querySelector("#branchRegionMeshPointsToggle");
if (branchRegionMeshPointsToggle) {
  branchRegionMeshPointsToggle.checked = hairState.state.branchRegionMeshPointsVisible;
  branchRegionMeshPointsToggle.addEventListener("change", () => {
    hairState.state.branchRegionMeshPointsVisible = branchRegionMeshPointsToggle.checked;
    if (hairState.state.branchRegionMeshPointsVisible) branchRegion.updateBranchRegionMeshPoints();
    else branchRegionMeshPointsGroup.visible = false;
  });
}
branchRegionCanvas.addEventListener("pointerdown", branchRegion.beginBranchRegionCanvasNav, true);
branchRegionCanvas.addEventListener("pointermove", branchRegion.updateBranchRegionCanvasNav);
branchRegionCanvas.addEventListener("pointerup", branchRegion.endBranchRegionCanvasNav);
branchRegionCanvas.addEventListener("pointercancel", branchRegion.endBranchRegionCanvasNav);
branchRegionCanvas.addEventListener("wheel", branchRegion.onBranchRegionCanvasWheel, { passive: false });
branchRegionCanvas.addEventListener("pointerdown", branchRegion.beginBranchRegionCanvasDrag);
branchRegionCanvas.addEventListener("pointermove", branchRegion.updateBranchRegionCanvasDrag);
branchRegionCanvas.addEventListener("pointerup", branchRegion.endBranchRegionCanvasDrag);
branchRegionCanvas.addEventListener("pointercancel", branchRegion.endBranchRegionCanvasDrag);
document.querySelector("#resetBranchRegionZoom").addEventListener("click", branchRegion.resetBranchRegionZoom);




[taperPointValue, taperPointPosition, taperPointInterpolation].forEach(bindUndoCapture);
taperPointValue.addEventListener("input", () => taperEditor.updateSelectedTaperPoint(
  "value",
  THREE.MathUtils.clamp(
    branchSweep.twistCurveEditing()
      ? twistRateDegreesFromUnits(taperPointValue.value)
      : Number(taperPointValue.value),
    branchSweep.twistCurveEditing() ? -TWIST_CURVE_VALUE_MAX : 0,
    branchSweep.twistCurveEditing() ? TWIST_CURVE_VALUE_MAX : TAPER_VALUE_MAX
  )
));
taperPointPosition.addEventListener("input", () => taperEditor.updateSelectedTaperPoint("position", Number(taperPointPosition.value)));
taperPointInterpolation.addEventListener("change", () => taperEditor.updateSelectedTaperPoint("interpolation", taperPointInterpolation.value));
document.querySelector("#addTaperPoint").addEventListener("click", () => {
  const curve = taperEditor.activeTaperCurve();
  if (!curve?.length || !sculptState.state.taperCurveEdit) return;
  pushUndoState();
  const index = Math.min(sculptState.state.taperCurveEdit.selectedIndex, curve.length - 2);
  const left = curve[index];
  const right = curve[index + 1];
  curve.splice(index + 1, 0, {
    position: (left.position + right.position) * 0.5,
    value: (left.value + right.value) * 0.5,
    interpolation: left.interpolation
  });
  sculptState.state.taperCurveEdit.selectedIndex = index + 1;
  taperEditor.applyTaperCurveEdit();
});
document.querySelector("#deleteTaperPoint").addEventListener("click", () => {
  const curve = taperEditor.activeTaperCurve();
  if (!curve || curve.length <= 2 || !sculptState.state.taperCurveEdit) return;
  const index = sculptState.state.taperCurveEdit.selectedIndex;
  if (index === 0 || index === curve.length - 1) return;
  pushUndoState();
  curve.splice(index, 1);
  sculptState.state.taperCurveEdit.selectedIndex = Math.min(index, curve.length - 1);
  taperEditor.applyTaperCurveEdit();
});
document.querySelector("#resetTaperCurve").addEventListener("click", () => {
  const curve = taperEditor.activeTaperCurve();
  if (!curve || !sculptState.state.taperCurveEdit) return;
  pushUndoState();
  const braidCreationCurve = sculptState.state.taperCurveEdit.type === "creation" && sel.state.activeTool === "braid";
  const editedLock = (sculptState.state.taperCurveEdit.type === "strand" || sculptState.state.taperCurveEdit.type === "segment")
    ? locks.find((lock) => lock.id === sculptState.state.taperCurveEdit.id)
    : null;
  const panelWidthCurve = sculptState.state.taperCurveEdit.curveKey === "taperCurve"
    && ((sculptState.state.taperCurveEdit.type === "creation" && sel.state.activeTool === "panel") || isPanelGeometry(editedLock));
  const segmentWidthReset = sculptState.state.taperCurveEdit.type === "segment"
    && (sculptState.state.taperCurveEdit.curveKey === "taperCurve"
      || sculptState.state.taperCurveEdit.curveKey === "taperCurveSecondary")
    && editedLock;
  // 段宽度曲线的 Reset 必须按几何取 splits：发丝管走 strandTipWidthResetCurve（真实
  // strandSplits），panel 段走 panelTipStrand.tipWidthResetCurve。**不得**对发丝调
  // clonePanelSplits —— 它回退出假 panelSplits，Reset 会按错误的网格写点，于是曲线里
  // 出现没有把手的点（破「曲线里有 ⇔ 有把手」不变式）。同规则同步点：
  // taper-editor.js renderTaperCurveEditor 的 segmentSplits 分派。
  const segmentWidthResetCurveFor = (side) => (
    segmentBoneHost(editedLock) === STRAND_SEGMENT_HOST
      ? strandTipWidthResetCurve(
          strandSplitsFor(editedLock),
          sculptState.state.taperCurveEdit.segmentIndex,
          side
        )
      : panelTipStrand.tipWidthResetCurve(
          editedLock,
          sculptState.state.taperCurveEdit.segmentIndex,
          clonePanelSplits(editedLock.panelSplits, editedLock.panelSplitHeight),
          side
        )
  );
  const defaultCurve = segmentWidthReset
    ? segmentWidthResetCurveFor(sculptState.state.taperCurveEdit.side === "secondary" ? -1 : 1)
    : sculptState.state.taperCurveEdit.curveKey === "twistCurve"
    ? DEFAULT_TWIST_CURVE
    : sculptState.state.taperCurveEdit.curveKey === "proceduralBranchShapeCurve"
    ? DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
    : sculptState.state.taperCurveEdit.curveKey === "proceduralBranchLengthCurve"
    ? DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
    : sculptState.state.taperCurveEdit.curveKey === "depthCurve"
    ? (braidCreationCurve ? DEFAULT_BRAID_DEPTH_CURVE : DEFAULT_DEPTH_CURVE)
    : (braidCreationCurve ? DEFAULT_BRAID_WIDTH_CURVE : (panelWidthCurve ? STRAIGHT_CUT_PANEL_CURVE : DEFAULT_TAPER_CURVE));
  curve.splice(0, curve.length, ...defaultCurve.map((point) => ({ ...point })));
  if (segmentWidthReset) {
    // Reset 同时重置另一侧曲线：两侧都恢复为整段全 1。
    const bone = taperEditor.activeTaperTarget();
    const otherSide = sculptState.state.taperCurveEdit.side === "secondary" ? 1 : -1;
    const otherKey = sculptState.state.taperCurveEdit.side === "secondary" ? "taperCurve" : "taperCurveSecondary";
    if (bone) {
      if (!bone[otherKey]) bone[otherKey] = [];
      bone[otherKey].splice(0, bone[otherKey].length, ...segmentWidthResetCurveFor(otherSide));
      bone[otherKey] = normalizeTaperCurve(bone[otherKey]);
    }
  }
  sculptState.state.taperCurveEdit.selectedIndex = 0;
  taperEditor.applyTaperCurveEdit();
});
bindUndoCapture(inputs.name);
inputs.name.addEventListener("input", () => {
  const lock = getSelectedLock();
  if (!lock) return;
  lock.name = inputs.name.value || "Untitled lock";
  renderLockList();
});

presetLibraryApi.setupPresetLibraryEvents();
document.querySelector("#openHairProject").addEventListener("click", async () => {
  if (window.showOpenFilePicker) {
    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: "Anime Hair Studio Project",
          accept: { "application/json": [".ahs", ".animehair.json", ".json"] }
        }]
      });
      const file = await handle.getFile();
      await ioApi.openHairProjectFile(file, { handle });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.error("Open could not read the chosen file, falling back to the file picker.", error);
    }
  }
  hairProjectFileInput.click();
});
hairProjectFileInput.addEventListener("change", () => {
  const [file] = hairProjectFileInput.files;
  if (file) ioApi.openHairProjectFile(file);
});




























dropImportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await ioApi.confirmDroppedApplicationFile();
});
[closeDropImportDialog, cancelDropImport].forEach((button) => {
  button.addEventListener("click", ioApi.closeDroppedApplicationFilePrompt);
});
dropImportDialog.addEventListener("close", () => {
  projectState.state.pendingDroppedApplicationFile = null;
  miscState.state.pendingDroppedApplicationKind = null;
  miscState.state.pendingDroppedApplicationHandle = null;
});
document.querySelector("#importHeadMesh").addEventListener("click", () => {
  head.state.enterHeadSetupAfterHeadImport = false;
  headMeshFileInput.click();
});
importHeadMeshMenu.addEventListener("click", () => {
  head.state.enterHeadSetupAfterHeadImport = true;
  headMeshFileInput.click();
});
headMeshFileInput.addEventListener("change", async () => {
  const [file] = headMeshFileInput.files;
  if (!file) return;
  const enterHeadSetup = head.state.enterHeadSetupAfterHeadImport;
  head.state.enterHeadSetupAfterHeadImport = false;
  const imported = await referenceHeadApi.importHeadMeshFile(file);
  if (imported && enterHeadSetup) referenceHeadApi.setHeadSetupEditing(true);
});
document.querySelector("#importFullBodyMesh").addEventListener("click", () => {
  head.state.enterHeadSetupAfterFullBodyImport = false;
  fullBodyMeshFileInput.click();
});
importFullBodyMeshMenu.addEventListener("click", () => {
  head.state.enterHeadSetupAfterFullBodyImport = true;
  fullBodyMeshFileInput.click();
});
fullBodyMeshFileInput.addEventListener("change", async () => {
  const [file] = fullBodyMeshFileInput.files;
  if (!file) return;
  const enterHeadSetup = head.state.enterHeadSetupAfterFullBodyImport;
  head.state.enterHeadSetupAfterFullBodyImport = false;
  const imported = await referenceHeadApi.importFullBodyMeshFile(file);
  if (imported && enterHeadSetup) referenceHeadApi.setHeadSetupEditing(true);
});
scalpGuideSourceInput.addEventListener("change", () => {
  if (scalpGuideSourceInput.value === "default") {
    scalpBuilder.setScalpGuideSource("default");
    return;
  }
  if (scalpState.state.customScalpSurfaceMesh) {
    scalpBuilder.setScalpGuideSource("custom");
    return;
  }
  scalpGuideSourceInput.value = scalpState.state.scalpGuideSource;
  scalpGuideMeshFileInput.click();
});
scalpGuideMeshFileInput.addEventListener("change", () => {
  const [file] = scalpGuideMeshFileInput.files;
  if (file) scalpBuilder.importScalpGuideMeshFile(file);
});
document.querySelector("#saveCurrentPreset").addEventListener("click", fileApi.saveHairProjectFile);
document.querySelector("#quickSaveProject").addEventListener("click", fileApi.saveHairProjectQuickly);
presetLibrary.addEventListener("pointerdown", (event) => event.stopPropagation());
presetLibrary.addEventListener("wheel", (event) => event.stopPropagation());
document.querySelector("#centerGuide").addEventListener("click", () => {
  const guide = guideApi.getSelectedGuide();
  if (!guide) return;
  pushUndoState();
  if (guide.type === "capsule") {
    const direction = guide.end.clone().sub(guide.start);
    guide.start.copy(direction).multiplyScalar(-0.5);
    guide.end.copy(direction).multiplyScalar(0.5);
    guideApi.updateCapsuleGuideGeometry(guide);
    return;
  }
  if (guide.type === "curve-lattice") {
    guide.points = guide.standalone
      ? guideApi.flatCurveLatticePoints(guide.columns, guide.rows)
      : scalpBuilder.curveLatticePointsForScalpRegion(guide.scalpRegion, guide.columns, guide.rows);
    guide.rootPoints = guideApi.defaultCurveLatticeRootPoints(guide);
    guide.deformRestPoints = guide.points.map((point) => point.clone());
    guide.deformRestRootPoints = guide.rootPoints.map((point) => point.clone());
    if (guide.handlesGroup.children.includes(transformControls.object)) transformControls.detach();
    guideSurfaceGroup.remove(guide.handlesGroup);
    guide.handlesGroup.children.forEach((handle) => {
      handle.geometry.dispose();
      handle.material.dispose();
    });
    guide.handlesGroup = guideApi.createCurveLatticeHandles(guide);
    guide.handlesGroup.visible = true;
    guideSurfaceGroup.add(guide.handlesGroup);
    guideApi.updateCurveLatticeGeometry(guide);
    guideApi.selectGuide(guide.id);
    return;
  }
  guide.x = 0;
  guide.y = 0.72;
  guide.z = 0.42;
  guideApi.updateGuideGeometry(guide);
});
document.querySelector("#deleteGuide").addEventListener("click", () => {
  deleteSelectedGuide();
});
curveLatticeToggle.addEventListener("click", (event) => {
  if (!CURVE_LATTICE_FEATURE_ENABLED) return;
  if (!event.shiftKey && guideApi.getSelectedGuide()?.type === "curve-lattice") {
    deselectStrands();
    placementApi.updatePlacementStatus();
    updateViewPlaneGrid();
    return;
  }
  const existing = drawFlowApi.selectedCurveLatticeGuide() || guides.find((guide) => guide.type === "curve-lattice");
  if (existing && !event.shiftKey) {
    guideApi.selectGuide(existing.id);
    return;
  }
  pushUndoState();
  if (event.shiftKey) {
    guideApi.addCurveLattice({ scalpRegion: scalpState.state.activeScalpRegion, color: SCALP_REGIONS[scalpState.state.activeScalpRegion].color });
    return;
  }
  const created = guideApi.createCurveLatticeGuideSet();
  const frontBangs = created.find((guide) => guide.scalpRegion === "bangs") || created[0];
  if (frontBangs) guideApi.selectGuide(frontBangs.id);
  updateCount();
});
bindUndoCapture(curveLatticeOpacityInput);
curveLatticeOpacityInput.addEventListener("input", () => {
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "curve-lattice") return;
  guide.opacity = Number(curveLatticeOpacityInput.value);
  guide.mesh.material.opacity = guide.opacity;
  if (guide.rootMesh) guide.rootMesh.material.opacity = guide.opacity;
});
bindUndoCapture(curveLatticeHorizontalLoopsInput);
curveLatticeHorizontalLoopsInput.addEventListener("input", () => {
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "curve-lattice") return;
  guideApi.resampleCurveLatticeGuide(guide, guide.columns, curveLatticeHorizontalLoopsInput.value);
  curveLatticeHorizontalLoopsValue.value = String(guide.rows);
});
bindUndoCapture(curveLatticeVerticalLoopsInput);
curveLatticeVerticalLoopsInput.addEventListener("input", () => {
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "curve-lattice") return;
  guideApi.resampleCurveLatticeGuide(guide, curveLatticeVerticalLoopsInput.value, guide.rows);
  curveLatticeVerticalLoopsValue.value = String(guide.columns);
});
document.querySelector("#createLatticeStrands").addEventListener("click", () => {
  createStrandsFromCurveLattice(guideApi.getSelectedGuide());
});
Object.entries(guideInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    const guide = guideApi.getSelectedGuide();
    if (!guide) return;
    guide[key] = Number(input.value);
    guideApi.updateGuideGeometry(guide);
  });
});

Object.entries(surfaceGuideInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    const integer = ["radialLoops", "lengthLoops", "subdivisionSteps"].includes(key);
    const value = integer ? Math.round(Number(input.value)) : Number(input.value);
    surfaceGuideDefaults[key] = value;
    surfaceGuideValues[key].textContent = integer ? String(value) : value.toFixed(2);
    const guide = guideApi.getSelectedGuide();
    if (guide?.type !== "capsule") return;
    if (key === "opacity") {
      guide.opacity = value;
      guide.mesh.material.opacity = value;
      return;
    }
    if (key === "centerVisibility") {
      guide.centerVisibility = value;
      guideApi.updateCapsuleGuideFresnelMaterial(guide);
      guide.mesh.material.opacity = Math.min(guide.opacity, 0.16);
      guideApi.updateCapsuleGuideWireOpacity(guide, false);
      return;
    }
    if (key === "radius") {
      const previousRadius = Math.max(0.0001, guide.radius);
      const radiusScale = value / previousRadius;
      guide.radius = value;
      const scaledPoints = scaleCapsuleRadialLoops(
        guide.controlPoints.map(vectorToData),
        guide.controlLoops,
        radiusScale
      );
      guide.controlPoints.forEach((point, index) => point.copy(dataToVector(scaledPoints[index])));
      guideApi.updateCapsuleGuideGeometry(guide, { preserveControlPoints: true });
    } else if (key === "length") {
      const nextLength = Math.max(value, guide.radius * 2);
      guideApi.resizeCapsuleGuideCylinder(guide, nextLength);
      guideApi.updateCapsuleGuideGeometry(guide, { preserveControlPoints: true });
    } else if (key === "subdivisionSteps") {
      guide.subdivisionSteps = value;
      guideApi.updateCapsuleGuideGeometry(guide, { preserveControlPoints: true });
      guideApi.refreshCapsuleGuideLoopInfluence();
    } else if (integer) {
      const radialLoops = key === "radialLoops" ? value : guide.radialLoops;
      const lengthLoops = key === "lengthLoops" ? value : guide.lengthLoops;
      guideApi.retopologizeCapsuleGuide(guide, radialLoops, lengthLoops);
    } else {
      guide[key] = value;
      guideApi.updateCapsuleGuideGeometry(guide, { preserveControlPoints: true });
    }
    drawFlowApi.refreshLiveSurfaceOptions();
  });
});
bindUndoCapture(surfaceGuideNameInput);
surfaceGuideNameInput.addEventListener("change", () => {
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "capsule") return;
  guide.name = guideApi.normalizeCapsuleGuideName(surfaceGuideNameInput.value, guide.name);
  surfaceGuideNameInput.value = guide.name;
  guideApi.renderGuideOutliner();
  drawFlowApi.refreshLiveSurfaceOptions();
  placementApi.updatePlacementStatus();
});
bindUndoCapture(surfaceGuideColorInput);
surfaceGuideColorInput.addEventListener("input", () => {
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "capsule") return;
  guide.color = guideApi.normalizeCapsuleGuideColor(surfaceGuideColorInput.value);
  guideApi.updateCapsuleGuideDisplayColor(guide);
  guideApi.renderGuideOutliner();
});
surfaceGuideInputs.centerVisibility.addEventListener("change", () => {
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "capsule") return;
  guide.mesh.material.opacity = guide.opacity;
  guideApi.updateCapsuleGuideWireOpacity(guide, true);
});
surfaceGuideFresnelInput.addEventListener("change", () => {
  pushUndoState();
  surfaceGuideDefaults.fresnel = surfaceGuideFresnelInput.checked;
  const guide = guideApi.getSelectedGuide();
  if (guide?.type !== "capsule") return;
  guide.fresnel = surfaceGuideFresnelInput.checked;
  guideApi.updateCapsuleGuideFresnelMaterial(guide);
});
surfaceGuideFitScalpButton.addEventListener("click", () => {
  scalpBuilder.createScalpFittedCapsuleGuide();
  placementApi.updatePlacementStatus();
});

Object.entries(scalpInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    scalpSurface[key] = Number(input.value);
    scalpBuilder.updateScalpSurface();
  });
});

// Scalp Conform 拟合椭球（全局，见 scalpConformFit 定义处注释）：两个滑杆改动必须让**所有**
// panel 发片重建几何（不只是选中的那一片）——它不进 lock，不能走 panelShapeInputs 的
// editSelectedLocks 通用接线（那套只改选中项）。照 sweepOverlapStrengthInput 等「无选中 lock
// 时的全局回退」分支的既有做法：直接对 `locks` 全量调用 rebuildLockGeometry，用 isPanelGeometry
// 过滤（非 panel/surface 几何不读 scalpConformFit，重建它们没有意义）。撤销：scalpSurface 的
// 滑杆没有接 bindUndoCapture 之外的任何 undo 捕获（bindUndoCapture 本身就是这套滑杆唯一的
// undo 接入点），这里同样只挂 bindUndoCapture，不额外接。
Object.entries(scalpConformFitInputs).forEach(([key, input]) => {
  if (!input) return;
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    const value = Number(input.value);
    scalpConformFit[key] = value;
    const output = scalpConformFitValueOutputs[key];
    if (output) output.textContent = value.toFixed(2);
    locks.forEach((lock) => { if (isPanelGeometry(lock)) rebuildLockGeometry(lock); });
  });
});

["sideFlatten", "topHeight", "bottomHeight", "topWidth", "topDepth", "middleWidth", "middleDepth", "bottomWidth", "bottomDepth"].forEach((key) => {
  const input = scalpArtistInputs[key];
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    scalpArtistShape[key] = Number(input.value);
    scalpBuilder.applyScalpLatticeDeformation();
    scalpBuilder.updateScalpLatticeObjects();
  });
});

bindUndoCapture(scalpArtistInputs.hairlineRows);
scalpArtistInputs.hairlineRows.addEventListener("input", () => {
  scalpArtistShape.hairlineRows = Number(scalpArtistInputs.hairlineRows.value);
  scalpBuilder.updateScalpTopology();
});

bindUndoCapture(scalpArtistInputs.sideBangRows);
scalpArtistInputs.sideBangRows.addEventListener("input", () => {
  scalpArtistShape.sideBangRows = Number(scalpArtistInputs.sideBangRows.value);
  scalpBuilder.applyDefaultScalpRegionAssignments(scalpArtistShape.sideBangRows);
});

bindUndoCapture(scalpArtistInputs.rootScalpOffset);
scalpArtistInputs.rootScalpOffset.addEventListener("input", () => {
  scalpArtistShape.rootScalpOffset = Number(scalpArtistInputs.rootScalpOffset.value);
  document.querySelector("#scalpRootOffsetValue").textContent = scalpArtistShape.rootScalpOffset.toFixed(2);
});

scalpArtistInputs.mirrorX.addEventListener("change", () => {
  pushUndoState();
  scalpArtistShape.mirrorX = scalpArtistInputs.mirrorX.checked;
});

modeToolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (RETIRED_CURVE_LATTICE_SURFACE_TOOLS.has(button.dataset.tool)) return;
    if (button.dataset.tool === "surface") curveSurfaceCreate.createViewportSurface();
    else setActiveTool(button.dataset.tool);
  });
});
sculptBrushStrengthInput.addEventListener("input", sculptGeom.updateActiveSculptBrushStrength);
sculptBrushRadiusInput.addEventListener("input", sculptGeom.syncSculptBrushControls);
sculptPreserveTipsInput.addEventListener("change", sculptGeom.updateActiveSculptBrushPreserveTips);
sculptBrushFalloffInput.addEventListener("input", sculptGeom.syncSculptBrushControls);
sculptBrushShowClippingPlaneInput.addEventListener("change", sculptGeom.updateSculptBrushViabilityPlane);
sculptBrushShowCurvesInput.addEventListener("change", () => {
  sculptState.state.sculptBrushViableLockIds = new Set();
  sculptGeom.refreshSculptBrushDebugView();
});
sculptBrushPlanePositionInput.addEventListener("input", () => {
  sculptGeom.syncSculptBrushControls();
  sculptGeom.updateSculptBrushViabilityPlane();
});
resetLoftSurfaceDraftButton.addEventListener("click", curveSurfaceCreate.resetLoftSurfaceDraft);
confirmCurveSurfaceDraftButton.addEventListener("click", (event) => {
  if (curveSurfaceCreate.commitCurveSurfaceDraft(event)) event.preventDefault();
});
resetCurveSurfaceDraftButton.addEventListener("click", curveSurfaceCreate.resetCurveSurfaceDraft);
curveSurfaceStripWidthInput.addEventListener("input", () => {
  curveSurfaceStripWidthValue.textContent = Number(curveSurfaceStripWidthInput.value).toFixed(2);
  if (sel.state.activeTool === "curve-surface") curveSurfaceCreate.updateCurveSurfacePreview();
});
capsuleGuideCurveStepInput.addEventListener("input", () => {
  capsuleGuideDrawDefaults.curveStep = Number(capsuleGuideCurveStepInput.value);
  capsuleGuideCurveStepValue.textContent = capsuleGuideDrawDefaults.curveStep.toFixed(2);
});
Object.entries(capsuleGuideProfileInputs).forEach(([key, input]) => {
  const index = key === "root" ? 0 : key === "middle" ? 1 : 2;
  input.addEventListener("input", () => {
    const value = Number(input.value);
    capsuleGuideDrawDefaults.profile[index].value = value;
    capsuleGuideProfileValues[key].textContent = value.toFixed(2);
    guideApi.updateCapsuleGuideProfilePreview();
  });
});
exitSetupEditor.addEventListener("click", exitSetupEditors);

spaceToggle.addEventListener("click", () => setObjectSpaceEditing(!sculptState.state.objectSpaceEditing));
mirrorXToggle.addEventListener("click", () => setMirrorXEditing(!sculptState.state.mirrorXEditing));
transformSpaceButtons.forEach((button) => {
  button.addEventListener("click", () => setObjectSpaceEditing(button.dataset.transformSpace === "object"));
});
viewPlaneMoveInput.addEventListener("change", () => setViewPlaneMove(viewPlaneMoveInput.checked));
viewPlaneMoveSnappedOnlyInput.addEventListener("change", () => setViewPlaneMoveSnappedOnly(viewPlaneMoveSnappedOnlyInput.checked));
moveWidthGrabHandlesInput.addEventListener("change", () => {
  setMoveGrabHandleVisibility("width", moveWidthGrabHandlesInput.checked);
});
moveDepthGrabHandlesInput.addEventListener("change", () => {
  setMoveGrabHandleVisibility("depth", moveDepthGrabHandlesInput.checked);
});
moveUniformGrabHandlesInput.addEventListener("change", () => {
  setMoveGrabHandleVisibility("uniform", moveUniformGrabHandlesInput.checked);
});
moveWidthCurveControlsInput.addEventListener("change", () => {
  setMoveCurveControlVisibility("taperCurve", moveWidthCurveControlsInput.checked);
});
moveDepthCurveControlsInput.addEventListener("change", () => {
  setMoveCurveControlVisibility("depthCurve", moveDepthCurveControlsInput.checked);
});
moveTwistCurveControlsInput.addEventListener("change", () => {
  setMoveCurveControlVisibility("twistCurve", moveTwistCurveControlsInput.checked);
});
moveAsymmetricWidthInput.addEventListener("change", () => {
  setSelectedMoveCurveShapeFlag("asymmetricWidthCurve", moveAsymmetricWidthInput.checked, "taperCurve");
});
moveAsymmetricDepthInput.addEventListener("change", () => {
  setSelectedMoveCurveShapeFlag("asymmetricDepthCurve", moveAsymmetricDepthInput.checked, "depthCurve");
});
moveCenterAsymmetricProfileInput.addEventListener("change", () => {
  setSelectedMoveCurveShapeFlag("centerAsymmetricProfile", moveCenterAsymmetricProfileInput.checked);
});
pullMoveInput.addEventListener("change", () => {
  setPullMoveEnabled(pullMoveInput.checked);
});
pullRigidityInput.addEventListener("input", () => {
  sculptState.state.pullRigidity = Number(pullRigidityInput.value);
  pullRigidityValue.textContent = sculptState.state.pullRigidity.toFixed(2);
});
pullCollisionInput.addEventListener("change", () => {
  sculptState.state.pullCollisionEnabled = pullCollisionInput.checked;
});
scaleSensitivityInput.addEventListener("input", () => {
  setScaleSensitivity(scaleSensitivityInput.value);
});
placeStrandScalpOffsetInput.addEventListener("input", () => {
  placeStrandScalpOffsetValue.textContent = Number(placeStrandScalpOffsetInput.value).toFixed(2);
});
bindUndoCapture(drawStrandBrushSizeInput);
const drawStrandBrushSizeNumberInput = drawStrandBrushSizeInput
  .closest("label")
  ?.querySelector(".slider-number-input");
if (drawStrandBrushSizeNumberInput) bindUndoCapture(drawStrandBrushSizeNumberInput);
drawStrandBrushSizeInput.addEventListener("input", () => {
  const nextWidth = Number(drawStrandBrushSizeInput.value);
  drawStrandBrushSizeValue.textContent = nextWidth.toFixed(2);
  setDrawStrandBrushCursorScale(drawFlowApi.activeStrokeBrushSize());
  if (sculptState.state.drawStrandStroke?.outputType === "strand") {
    sculptState.state.drawStrandStroke.brushSize = drawFlowApi.activeStrokeBrushSize();
    drawFlowApi.updateDrawStrandPreview();
    return;
  }
  const selectedLock = getSelectedLock();
  if (selectedLock?.geometryType === "strand") {
    const primaryWidth = sculptGeom.editableStrandWidth(selectedLock);
    const targets = compatibleSelectedLocks(selectedLock)
      .filter((lock) => lock.geometryType === "strand");
    editSelectedLocks((lock) => {
      const width = relativeEditValue(sculptGeom.editableStrandWidth(lock), primaryWidth, nextWidth, {
        min: Number(drawStrandBrushSizeInput.min),
        max: Number(drawStrandBrushSizeInput.max)
      });
      sculptGeom.applyEditableStrandWidth(lock, width, null);
    }, { immediate: true, targets });
    syncMultiStrandInputs(selectedLock);
  } else if (!selectedLock) {
    const depth = strandDepthDimension(strandCreationDefaults);
    strandCreationDefaults.width = nextWidth;
    setStrandDepthDimension(strandCreationDefaults, depth);
  }
});
polyBrushSurfaceOffsetInput.addEventListener("input", () => {
  polyBrushSurfaceOffsetValue.textContent = Number(polyBrushSurfaceOffsetInput.value).toFixed(3);
  polyToolsApi.refreshPolyFillPreviewFromLastPointer();
});
polyBrushWidthInput.addEventListener("input", () => {
  polyBrushWidthValue.textContent = Number(polyBrushWidthInput.value).toFixed(2);
  polyToolsApi.refreshPolyFillPreviewFromLastPointer();
});
polyBrushSpacingInput.addEventListener("input", () => {
  polyBrushSpacingValue.textContent = Number(polyBrushSpacingInput.value).toFixed(2);
  polyToolsApi.refreshPolyFillPreviewFromLastPointer();
});
drawToolSizeInput.addEventListener("input", () => {
  drawToolSizeValue.textContent = Number(drawToolSizeInput.value).toFixed(2);
  setDrawStrandBrushCursorScale(drawFlowApi.activeStrokeBrushSize());
  if (sculptState.state.drawStrandStroke && sculptState.state.drawStrandStroke.outputType !== "braid") {
    sculptState.state.drawStrandStroke.brushSize = drawFlowApi.activeStrokeBrushSize();
    sculptState.state.drawStrandStroke.brushDepth = drawFlowApi.activeStrokeBrushDepth();
    if (sculptState.state.drawStrandStroke.outputType === "panel") {
      sculptState.state.drawStrandStroke.panelThickness = drawFlowApi.activeStrokeBrushDepth();
    }
    drawFlowApi.updateDrawStrandPreview();
  }
});
braidToolSizeInput.addEventListener("input", () => {
  const scale = Number(braidToolSizeInput.value);
  braidToolSizeValue.textContent = scale.toFixed(2);
  if (sculptState.state.drawStrandStroke?.outputType === "braid") {
    sculptState.state.drawStrandStroke.brushSize = Number(braidCreationDefaults.braidWidth) * scale;
    sculptState.state.drawStrandStroke.braidWidth = Number(braidCreationDefaults.braidWidth) * scale;
    sculptState.state.drawStrandStroke.braidDepth = Number(braidCreationDefaults.braidDepth) * scale;
    sculptState.state.drawStrandStroke.braidSegmentLength = Number(braidCreationDefaults.braidSegmentLength) * scale;
    drawFlowApi.updateDrawStrandPreview();
  }
});
drawStrandSmoothingInput.addEventListener("input", () => {
  drawStrandSmoothingValue.textContent = Number(drawStrandSmoothingInput.value).toFixed(2);
});
drawStrandCurveStepInput.addEventListener("input", () => {
  drawStrandCurveStepValue.textContent = Number(drawStrandCurveStepInput.value).toFixed(2);
});
[
  proceduralAccessoryEditCountInput,
  proceduralAccessoryEditRadiusInput,
  proceduralBranchEditCountInput,
  proceduralBranchEditLengthInput,
  proceduralBranchEditTipOffsetInput
].forEach((input) => {
  input.addEventListener("pointerdown", () => {
    sculptState.state.proceduralAccessoryEditPointerActive = true;
    clumpProceduralApi.beginProceduralAccessoryEdit();
  });
  input.addEventListener("input", () => {
    clumpProceduralApi.beginProceduralAccessoryEdit();
    clumpProceduralApi.updateSelectedProceduralAccessories();
    if (!sculptState.state.proceduralAccessoryEditPointerActive) sculptState.state.proceduralAccessoryEditHistoryOpen = false;
  });
  input.addEventListener("change", () => {
    clumpProceduralApi.beginProceduralAccessoryEdit();
    clumpProceduralApi.updateSelectedProceduralAccessories();
    sculptState.state.proceduralAccessoryEditHistoryOpen = false;
  });
  input.addEventListener("pointerup", () => {
    sculptState.state.proceduralAccessoryEditPointerActive = false;
    sculptState.state.proceduralAccessoryEditHistoryOpen = false;
  });
  input.addEventListener("pointercancel", () => {
    sculptState.state.proceduralAccessoryEditPointerActive = false;
    sculptState.state.proceduralAccessoryEditHistoryOpen = false;
  });
});
proceduralAccessoryEditParentVisibleInput.addEventListener("change", () => {
  pushUndoState();
  clumpProceduralApi.updateSelectedProceduralAccessories();
  sculptState.state.proceduralAccessoryEditHistoryOpen = false;
});
function syncDrawCurlControls() {
  const selectedLock = getSelectedLock();
  const selectedCoil = selectedLock?.geometryType === "strand" && selectedLock?.curlEnabled;
  const enabled = hairState.state.drawStrandMode === "coil" || Boolean(selectedCoil);
  const curlCount = Number(drawStrandCurlCountInput.value);
  const curlDisplacement = Number(drawStrandCurlDisplacementInput.value);
  drawStrandCurlCountInput.disabled = !enabled;
  drawStrandCurlDisplacementInput.disabled = !enabled;
  if (!selectedLock) {
    strandCreationDefaults.curlCount = curlCount;
    strandCreationDefaults.curlDisplacement = curlDisplacement;
  }
  if (sculptState.state.drawStrandStroke?.outputType === "strand") {
    sculptState.state.drawStrandStroke.curlEnabled = enabled;
    sculptState.state.drawStrandStroke.curlCount = curlCount;
    sculptState.state.drawStrandStroke.curlDisplacement = curlDisplacement;
    drawFlowApi.updateDrawStrandPreview();
    return;
  }
  if (enabled && selectedCoil) {
    editSelectedLocks((item) => {
      if (!item.curlEnabled) return;
      item.curlCount = curlCount;
      item.curlDisplacement = curlDisplacement;
    }, { immediate: true, renderList: false });
    syncMultiStrandInputs(selectedLock);
  }
}
drawStrandCurlCountInput.addEventListener("input", () => {
  drawStrandCurlCountValue.textContent = Number(drawStrandCurlCountInput.value).toFixed(2);
  syncDrawCurlControls();
});
drawStrandCurlDisplacementInput.addEventListener("input", () => {
  drawStrandCurlDisplacementValue.textContent = Number(drawStrandCurlDisplacementInput.value).toFixed(2);
  syncDrawCurlControls();
});
syncDrawCurlControls();
drawStrandScalpOffsetInput.addEventListener("input", () => {
  drawStrandScalpOffsetValue.textContent = Number(drawStrandScalpOffsetInput.value).toFixed(2);
});
drawSurfaceNormalInfluenceInput.addEventListener("input", () => {
  const influence = Number(drawSurfaceNormalInfluenceInput.value);
  drawSurfaceNormalInfluenceValue.textContent = influence.toFixed(2);
  if (sculptState.state.drawStrandStroke?.outputType === "strand") {
    sculptState.state.drawStrandStroke.surfaceNormalInfluence = influence;
    drawFlowApi.updateDrawStrandPreview();
  }
});
function handleLiveSurfaceChange() {
  drawFlowApi.finishDrawStrandStroke(null, { cancel: true });
  if (sel.state.activeTool === "curve-surface") curveSurfaceCreate.resetCurveSurfaceDraft();
  if (sel.state.activeTool === "surface-loft") curveSurfaceCreate.resetLoftSurfaceDraft();
  drawStrandBrushCursor.visible = false;
  drawSurfaceDynamicButton.disabled = drawFlowApi.activeStrokeSurfaceValue() === "contextual-plane";
  scalpBuilder.autoShowScalpGuideForActiveTool();
  scalpBuilder.updateScalpEditingVisibility();
  placementApi.updatePlacementStatus();
}

drawStrandSurfaceInput.addEventListener("change", handleLiveSurfaceChange);
drawSurfaceDynamicButton.addEventListener("click", () => {
  drawFlowApi.setDrawSurfaceDynamicEnabled(!drawFlowApi.drawSurfaceDynamicEnabled());
  drawSurfaceDynamicButton.dispatchEvent(new Event("change", { bubbles: true }));
});
drawSurfaceDynamicButton.addEventListener("change", handleLiveSurfaceChange);
[
  [panelToolSizeInput, panelToolSizeValue, 2],
  [panelSmoothingInput, panelSmoothingValue, 2],
  [panelCurveStepInput, panelCurveStepValue, 2],
  [panelScalpOffsetInput, panelScalpOffsetValue, 2],
  [panelSurfaceNormalInfluenceInput, panelSurfaceNormalInfluenceValue, 2]
].forEach(([input, output, digits]) => {
  input.addEventListener("input", () => {
    output.textContent = Number(input.value).toFixed(digits);
    if (!sculptState.state.drawStrandStroke || sculptState.state.drawStrandStroke.outputType !== "panel") return;
    sculptState.state.drawStrandStroke.brushSize = Number(panelCreationDefaults.width) * Number(panelToolSizeInput.value);
    sculptState.state.drawStrandStroke.brushDepth = Number(panelCreationDefaults.panelThickness) * Number(panelToolSizeInput.value);
    sculptState.state.drawStrandStroke.panelThickness = sculptState.state.drawStrandStroke.brushDepth;
    sculptState.state.drawStrandStroke.smoothing = Number(panelSmoothingInput.value);
    sculptState.state.drawStrandStroke.curveStep = Number(panelCurveStepInput.value);
    sculptState.state.drawStrandStroke.scalpOffset = Number(panelScalpOffsetInput.value);
    sculptState.state.drawStrandStroke.surfaceNormalInfluence = Number(panelSurfaceNormalInfluenceInput.value);
    drawFlowApi.updateDrawStrandPreview();
  });
});
Object.entries(strandSplitInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener(input.type === "checkbox" ? "change" : "input", () => {
    const selected = getSelectedLock();
    const target = selected?.geometryType === "strand"
      ? selected
      : sel.state.activeTool === "draw" ? strandCreationDefaults : null;
    if (!target) return;
    const value = input.type === "checkbox" ? input.checked : Number(input.value);
    // 0.2.132：这里原本有「strandSplitGap 写标量后再刷进每根管」的全局刷分支
    // （applyStrandSplitGapToTubes）。该滑杆与其「segment separate」语义已整体删除，
    // 剩下的键（strandSplitEnabled）只有纯标量语义，所以 mutator 回到单行写入。
    const writeTo = (item) => { item[key] = value; };
    if (selected?.geometryType === "strand") {
      editSelectedLocks(writeTo, { immediate: true });
    } else {
      writeTo(target);
    }
    syncStrandSplitInputs(target);
    if (sculptState.state.drawStrandStroke?.outputType === "strand" && target === strandCreationDefaults) {
      sculptState.state.drawStrandStroke[key] = target[key];
      drawFlowApi.updateDrawStrandPreview();
    }
    if (selected?.geometryType === "strand") syncMultiStrandInputs(selected);
  });
});

function applyStrandTipToTarget(target, updater) {
  const selected = getSelectedLock();
  if (selected?.geometryType === "strand") {
    editSelectedLocks((item) => { updater(item); }, { immediate: true });
    syncMultiStrandInputs(selected);
  } else {
    updater(target);
  }
  syncStrandTipInputs(target);
}

function strandTipTarget() {
  const selected = getSelectedLock();
  return selected?.geometryType === "strand" ? selected : null;
}

bindUndoCapture(strandTipInputs.strandTipEnabled);
strandTipInputs.strandTipEnabled.addEventListener("change", () => {
  const target = strandTipTarget();
  if (!target) return;
  applyStrandTipToTarget(target, (item) => {
    if (strandTipInputs.strandTipEnabled.checked) {
      const chain = currentStrandTipChain(item);
      if (!chain) return;
      item.strandTip = {
        points: chain.points.map((p) => ({ ...p })),
        restPoints: chain.restPoints.map((p) => ({ ...p })),
        twists: chain.twists.map((v) => Number(v) || 0),
        active: true
      };
      if (item.strandTipStart == null) item.strandTipStart = 0.75;
    } else {
      item.strandTip = null;
    }
  });
});

bindUndoCapture(strandTipInputs.strandTipStart);
strandTipInputs.strandTipStart.addEventListener("input", () => {
  const target = strandTipTarget();
  if (!target) return;
  const value = THREE.MathUtils.clamp(Number(strandTipInputs.strandTipStart.value || 0.75), 0.2, 0.95);
  strandTipValues.strandTipStart.textContent = value.toFixed(2);
  applyStrandTipToTarget(target, (item) => { item.strandTipStart = value; });
});

bindUndoCapture(strandTipLengthInput);
strandTipLengthInput.addEventListener("input", () => {
  const target = strandTipTarget();
  if (!target) return;
  const value = THREE.MathUtils.clamp(Number(strandTipLengthInput.value || 0), -0.5, 1.5);
  strandTipLengthValue.textContent = value.toFixed(2);
  applyStrandTipToTarget(target, (item) => {
    const chain = currentStrandTipChain(item);
    if (!chain || !chain.points.length || !chain.restPoints.length) return;
    const rest = new THREE.CatmullRomCurve3(chain.restPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
    const restTangent = rest.getTangent(1).normalize();
    const restLast = chain.restPoints[chain.restPoints.length - 1];
    const last = new THREE.Vector3(restLast.x, restLast.y, restLast.z).addScaledVector(restTangent, value);
    chain.points[chain.points.length - 1] = { x: last.x, y: last.y, z: last.z };
    item.strandTip = {
      points: chain.points.map((p) => ({ ...p })),
      restPoints: chain.restPoints.map((p) => ({ ...p })),
      twists: chain.twists.map((v) => Number(v) || 0),
      active: true
    };
  });
});

resetStrandTipButton?.addEventListener("click", () => {
  const target = strandTipTarget();
  if (!target) return;
  applyStrandTipToTarget(target, (item) => {
    const chain = currentStrandTipChain(item);
    if (!chain || !chain.points.length || !chain.restPoints.length) return;
    item.strandTip = {
      points: chain.restPoints.map((p) => ({ ...p })),
      restPoints: chain.restPoints.map((p) => ({ ...p })),
      twists: chain.restPoints.map(() => 0),
      active: true
    };
  });
});

function strandSplitTipTarget() {
  const selected = getSelectedLock();
  return selected?.geometryType === "strand" && selected.strandSplitEnabled ? selected : null;
}

function applyStrandSplitTipToTarget(target, updater) {
  const selected = getSelectedLock();
  if (selected?.geometryType === "strand" && selected.strandSplitEnabled) {
    editSelectedLocks((item) => {
      if (item.geometryType === "strand" && item.strandSplitEnabled) updater(item);
    }, { immediate: true });
    syncMultiStrandInputs(selected);
  } else {
    updater(target);
  }
  syncStrandSplitTipInputs(target);
}

bindUndoCapture(strandSplitTipLengthInput);
strandSplitTipLengthInput.addEventListener("input", () => {
  const target = strandSplitTipTarget();
  if (!target) return;
  const value = THREE.MathUtils.clamp(Number(strandSplitTipLengthInput.value || 0), -0.5, 1.5);
  strandSplitTipLengthValue.textContent = value.toFixed(2);
  applyStrandSplitTipToTarget(target, (item) => {
    const chains = currentStrandSplitTipChains(item);
    if (!chains) return;
    const bones = materializeStrandSplitBones(item);
    if (!bones) return;
    chains.forEach((chain, tubeIndex) => {
      if (!chain || !chain.points.length || !chain.restPoints.length) return;
      const rest = new THREE.CatmullRomCurve3(chain.restPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
      const restTangent = rest.getTangent(1).normalize();
      const restLast = chain.restPoints[chain.restPoints.length - 1];
      const last = new THREE.Vector3(restLast.x, restLast.y, restLast.z).addScaledVector(restTangent, value);
      chain.points[chain.points.length - 1] = { x: last.x, y: last.y, z: last.z };
      bones[tubeIndex].tip = {
        points: chain.points.map((p) => ({ ...p })),
        restPoints: chain.restPoints.map((p) => ({ ...p })),
        twists: chain.twists.map((v) => Number(v) || 0),
        active: true
      };
    });
  });
});

resetStrandSplitTipsButton?.addEventListener("click", () => {
  const target = strandSplitTipTarget();
  if (!target) return;
  applyStrandSplitTipToTarget(target, (item) => {
    const bones = materializeStrandSplitBones(item);
    if (!bones) return;
    const chains = currentStrandSplitTipChains(item);
    if (!chains) return;
    chains.forEach((chain, tubeIndex) => {
      if (!chain || !chain.restPoints.length) return;
      bones[tubeIndex].tip = {
        points: chain.restPoints.map((p) => ({ ...p })),
        restPoints: chain.restPoints.map((p) => ({ ...p })),
        twists: chain.restPoints.map(() => 0),
        active: true
      };
    });
  });
});

bindUndoCapture(hairCardInput);
hairCardInput.addEventListener("change", () => {
  const selected = getSelectedLock();
  const target = selected?.geometryType === "strand"
    ? selected
    : sel.state.activeTool === "draw" ? strandCreationDefaults : null;
  if (!target) return;
  if (selected?.geometryType === "strand") {
    editSelectedLocks((item) => { item.hairCard = hairCardInput.checked; }, { immediate: true });
  } else {
    target.hairCard = hairCardInput.checked;
  }
  syncHairCardControls(target);
  renderProfilePreview(profilePreviewPaths.strand, target.sweepProfile, target.profileOffset, target);
  if (selected && ["move", "rotate", "scale"].includes(sel.state.activeTool)) configureTransformControls(sel.state.activeTool);
  if (sculptState.state.drawStrandStroke?.outputType === "strand" && target === strandCreationDefaults) {
    sculptState.state.drawStrandStroke.hairCard = target.hairCard;
    drawFlowApi.updateDrawStrandPreview();
  }
  if (selected?.geometryType === "strand") syncMultiStrandInputs(selected);
});

[surfaceLatticeColumnsInput, surfaceLatticeRowsInput].forEach((input) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    const lock = getSelectedLock();
    if (lock?.geometryType !== "surface") return;
    const nextColumns = input === surfaceLatticeColumnsInput ? input.value : lock.surfaceColumns;
    const nextRows = input === surfaceLatticeRowsInput ? input.value : lock.surfaceRows;
    curveSurfaceCreate.resampleSurfaceLock(lock, nextColumns, nextRows);
    surfaceLatticeColumnsInput.value = String(lock.surfaceColumns);
    surfaceLatticeColumnsValue.textContent = String(lock.surfaceColumns);
    surfaceLatticeRowsInput.value = String(lock.surfaceRows);
    surfaceLatticeRowsValue.textContent = String(lock.surfaceRows);
  });
});

Object.entries(panelShapeInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener(input.type === "checkbox" ? "change" : "input", () => {
    const selected = getSelectedLock();
    const target = isPanelGeometry(selected)
      ? getSelectedLock()
      : sel.state.activeTool === "panel" ? panelCreationDefaults : null;
    if (!target) return;
    if (key === "panelSplitSnapToLoops" && !input.checked && !ui.state.panelSplitSnapWarningAcknowledged) {
      input.checked = true;
      ui.state.panelSplitSnapWarningContinuation = () => {
        input.checked = false;
        input.dispatchEvent(new Event("change"));
      };
      if (!panelSplitSnapWarning.open) panelSplitSnapWarning.showModal();
      return;
    }
    const value = input.type === "checkbox"
      ? input.checked
      : ["panelLengthLoops", "panelWidthLoops", "panelTipLoops"].includes(key)
        ? Math.round(Number(input.value))
        : Number(input.value);
    const relativeDimension = Boolean(isPanelGeometry(selected) && ["width", "panelThickness"].includes(key));
    const primaryDimension = relativeDimension ? Number(target[key]) : value;
    const applyValue = (item) => {
      const previousValue = item[key];
      item[key] = relativeDimension
        ? relativeEditValue(item[key], primaryDimension, value, {
          min: Number(input.min),
          max: Number(input.max)
        })
        : value;
      if (key === "panelWidthLoops") {
        item.panelWidthLoops = Math.max(item.panelWidthLoops, clonePanelSplits(item.panelSplits, item.panelSplitHeight).length + 1);
      }
      if (key === "width" && isPanelGeometry(item)) {
        if (item.geometryType === "surface") curveSurfaceCreate.scaleSurfaceLatticeWidth(item, previousValue, item.width);
        item.baseWidth = item.width;
      }
    };
    if (isPanelGeometry(selected)) editSelectedLocks(applyValue, { immediate: true });
    else applyValue(target);
    segmentApi.syncPanelShapeInputs(target);
    if (sculptState.state.drawStrandStroke?.outputType === "panel" && target === panelCreationDefaults) {
      sculptState.state.drawStrandStroke.brushSize = Number(target.width) * Number(panelToolSizeInput.value);
      sculptState.state.drawStrandStroke[key] = target[key];
      drawFlowApi.updateDrawStrandPreview();
    }
    if (isPanelGeometry(selected)) syncMultiStrandInputs(selected);
  });
});


addPanelSplitButton?.addEventListener("click", () => segmentApi.changePanelSplitCount(1));
removePanelSplitButton?.addEventListener("click", () => segmentApi.changePanelSplitCount(-1));
addStrandSplitButton?.addEventListener("click", () => segmentApi.changeStrandSplitCount(1));
removeStrandSplitButton?.addEventListener("click", () => segmentApi.changeStrandSplitCount(-1));
previousPanelSegmentButton?.addEventListener("click", () => segmentApi.stepPanelSegment(-1));
nextPanelSegmentButton?.addEventListener("click", () => segmentApi.stepPanelSegment(1));
previousStrandSegmentButton?.addEventListener("click", () => segmentApi.stepStrandSegment(-1));
nextStrandSegmentButton?.addEventListener("click", () => segmentApi.stepStrandSegment(1));
if (strandSegmentSpread) {
  bindUndoCapture(strandSegmentSpread);
  strandSegmentSpread.addEventListener("input", () => segmentApi.applyStrandSegmentSpread(strandSegmentSpread.value));
}
if (panelSegmentSpread) {
  bindUndoCapture(panelSegmentSpread);
  panelSegmentSpread.addEventListener("input", () => {
    const selected = getSelectedLock();
    const target = isPanelGeometry(selected)
      ? selected
      : sel.state.activeTool === "panel" ? panelCreationDefaults : null;
    if (!target) return;
    const bones = materializeSplitBones(target);
    const { index } = segmentApi.selectedPanelSegment(target);
    const value = THREE.MathUtils.clamp(Number(panelSegmentSpread.value || 0), 0, SPREAD_MAX);
    if (bones[index]) bones[index].tipClump = value;
    if (panelSegmentSpreadValue) panelSegmentSpreadValue.textContent = value.toFixed(2);
    if (isPanelGeometry(selected)) {
      updateLockGeometry(selected, { immediate: true });
      syncActiveMirror(selected, { deferGeometry: false });
      updateTopologyStats();
    }
    if (sculptState.state.drawStrandStroke?.outputType === "panel" && target === panelCreationDefaults) {
      sculptState.state.drawStrandStroke.splitBones = splitBonesToData(bones);
      drawFlowApi.updateDrawStrandPreview();
    }
  });
}
[
  [braidWidthInput, braidWidthValue],
  [braidDepthInput, braidDepthValue],
  [braidSegmentLengthInput, braidSegmentLengthValue],
  [braidRotationInput, braidRotationValue],
  [braidSmoothingInput, braidSmoothingValue],
  [braidCurveStepInput, braidCurveStepValue],
  [braidScalpOffsetInput, braidScalpOffsetValue]
].forEach(([input, output]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    output.textContent = input === braidRotationInput
      ? `${Math.round(Number(input.value))} deg`
      : Number(input.value).toFixed(2);
    if (sculptState.state.drawStrandStroke?.outputType === "braid") {
      const toolScale = Number(braidToolSizeInput.value);
      sculptState.state.drawStrandStroke.braidWidth = Number(braidWidthInput.value) * toolScale;
      sculptState.state.drawStrandStroke.brushSize = sculptState.state.drawStrandStroke.braidWidth;
      sculptState.state.drawStrandStroke.braidDepth = Number(braidDepthInput.value) * toolScale;
      sculptState.state.drawStrandStroke.braidSegmentLength = Number(braidSegmentLengthInput.value) * toolScale;
      sculptState.state.drawStrandStroke.braidRotation = Number(braidRotationInput.value);
      sculptState.state.drawStrandStroke.smoothing = Number(braidSmoothingInput.value);
      sculptState.state.drawStrandStroke.curveStep = Number(braidCurveStepInput.value);
      sculptState.state.drawStrandStroke.scalpOffset = Number(braidScalpOffsetInput.value);
      drawFlowApi.updateDrawStrandPreview();
      return;
    }
    const braid = getSelectedLock();
    const target = braid?.geometryType === "braid" ? braid : braidCreationDefaults;
    const relativeDimension = Boolean(braid && [braidWidthInput, braidDepthInput].includes(input));
    const primaryDimension = input === braidWidthInput
      ? Number(target.braidWidth)
      : input === braidDepthInput ? Number(target.braidDepth) : Number(input.value);
    const applyValue = (item) => {
      const currentDimension = input === braidWidthInput
        ? Number(item.braidWidth)
        : input === braidDepthInput ? Number(item.braidDepth) : Number(input.value);
      const nextValue = relativeDimension
        ? relativeEditValue(currentDimension, primaryDimension, Number(input.value), {
          min: Number(input.min),
          max: Number(input.max)
        })
        : Number(input.value);
      if (input === braidWidthInput) {
        item.braidWidth = nextValue;
        item.widthScale = 1;
        item.width = item.braidWidth;
        item.baseWidth = item.braidWidth;
      } else if (input === braidDepthInput) {
        item.braidDepth = nextValue;
        item.depthScale = 1;
      } else if (input === braidSegmentLengthInput) {
        item.braidSegmentLength = nextValue;
      } else if (input === braidRotationInput) {
        item.braidRotation = nextValue;
      }
    };
    if (![braidWidthInput, braidDepthInput, braidSegmentLengthInput, braidRotationInput].includes(input)) return;
    if (!braid || braid.geometryType !== "braid") return;
    editSelectedLocks(applyValue, { defer: true, renderList: false });
    syncMultiStrandInputs(braid);
  });
});




presetLibraryApi.setupCreationPresetUi();

braidMeshPresetInput.addEventListener("change", () => {
  pushUndoState();
  const presetId = braidMeshPresetInput.value;
  if (sculptState.state.drawStrandStroke?.outputType === "braid") {
    sculptState.state.drawStrandStroke.braidMeshPreset = presetId;
    drawFlowApi.updateDrawStrandPreview();
    placementApi.updatePlacementStatus();
    return;
  }
  const braid = getSelectedLock();
  if (braid?.geometryType === "braid") {
    editSelectedLocks((item) => { item.braidMeshPreset = presetId; });
    syncMultiStrandInputs(braid);
  } else {
    braidCreationDefaults.braidMeshPreset = presetId;
  }
  placementApi.updatePlacementStatus();
});
hierarchyToggle.addEventListener("click", () => setHierarchyEditing(!sculptState.state.hierarchyEditing));
hierarchyRecursiveTransformInput.addEventListener("change", () => {
  transform.state.recursiveHierarchyTransforms = hierarchyRecursiveTransformInput.checked;
});
branchRigidCurvatureBlendInput.value = branch.state.branchRigidCurvatureBlend;
branchRigidCurvatureBlendInput.addEventListener("change", () => {
  branch.state.branchRigidCurvatureBlend = THREE.MathUtils.clamp(Number(branchRigidCurvatureBlendInput.value) || 0.5, 0, 1);
  branchRigidCurvatureBlendInput.value = branch.state.branchRigidCurvatureBlend;
  writeStoredPreference(window, BRANCH_RIGID_CURVATURE_BLEND_PREFERENCE_KEY, branch.state.branchRigidCurvatureBlend);
});
function selectedBranchChildLock() {
  const lock = getSelectedLock();
  return lock && lock.branchParentId ? lock : null;
}
function updateBranchBridgeSliderInputs() {
  const lock = selectedBranchChildLock();
  const strength = lock?.branchBridgeSmoothStrength ?? branch.state.branchBridgeSmoothStrength;
  const detail = lock?.branchBridgeSmoothDetail ?? branch.state.branchBridgeSmoothDetail;
  branchBridgeSmoothStrengthInput.value = strength;
  branchBridgeSmoothDetailInput.value = detail;
  const n1 = branchBridgeSmoothStrengthInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n1) n1.value = strength;
  const n2 = branchBridgeSmoothDetailInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n2) n2.value = detail;
}
branchBridgeSmoothStrengthInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Number(branchBridgeSmoothStrengthInput.value) || 0, 0, 1);
  const lock = selectedBranchChildLock();
  if (lock) {
    lock.branchBridgeSmoothStrength = value;
    rebuildLockGeometry(lock);
  } else {
    branch.state.branchBridgeSmoothStrength = value;
    writeStoredPreference(window, BRANCH_BRIDGE_SMOOTH_STRENGTH_PREFERENCE_KEY, value);
    locks.forEach((l) => { if (l?.branchRootRegion) rebuildLockGeometry(l); });
  }
  branchBridgeSmoothStrengthInput.value = value;
  const n = branchBridgeSmoothStrengthInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
branchBridgeSmoothDetailInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Math.round(Number(branchBridgeSmoothDetailInput.value) || 1), 0, 8);
  const lock = selectedBranchChildLock();
  if (lock) {
    lock.branchBridgeSmoothDetail = value;
    rebuildLockGeometry(lock);
  } else {
    branch.state.branchBridgeSmoothDetail = value;
    writeStoredPreference(window, BRANCH_BRIDGE_SMOOTH_DETAIL_PREFERENCE_KEY, value);
    locks.forEach((l) => { if (l?.branchRootRegion) rebuildLockGeometry(l); });
  }
  branchBridgeSmoothDetailInput.value = value;
  const n = branchBridgeSmoothDetailInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
function updateSweepOverlapSliderInputs() {
  const lock = getSelectedLock();
  const strength = lock?.sweepOverlapStrength ?? hairState.state.sweepOverlapStrength;
  const threshold = lock?.sweepOverlapThreshold ?? hairState.state.sweepOverlapThreshold;
  const edgeSmooth = lock?.sweepEdgeSmooth ?? hairState.state.sweepEdgeSmooth;
  const falloff = lock?.sweepOverlapFalloff ?? hairState.state.sweepOverlapFalloff;
  const tangentSmooth = lock?.sweepTangentSmooth ?? hairState.state.sweepTangentSmooth;
  sweepOverlapStrengthInput.value = strength;
  sweepOverlapThresholdInput.value = threshold;
  sweepEdgeSmoothInput.value = edgeSmooth;
  sweepOverlapFalloffInput.value = falloff;
  sweepTangentSmoothInput.value = tangentSmooth;
  const n1 = sweepOverlapStrengthInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n1) n1.value = strength;
  const n2 = sweepOverlapThresholdInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n2) n2.value = threshold;
  const n3 = sweepEdgeSmoothInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n3) n3.value = edgeSmooth;
  const n4 = sweepOverlapFalloffInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n4) n4.value = falloff;
  const n5 = sweepTangentSmoothInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n5) n5.value = tangentSmooth;
}
sweepOverlapStrengthInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Number(sweepOverlapStrengthInput.value) || 0, 0, 1);
  const lock = getSelectedLock();
  if (lock) {
    lock.sweepOverlapStrength = value;
    rebuildLockGeometry(lock);
    syncActiveMirror(lock, { deferGeometry: false });
  } else {
    hairState.state.sweepOverlapStrength = value;
    locks.forEach((l) => { if (l) rebuildLockGeometry(l); });
  }
  sweepOverlapStrengthInput.value = value;
  const n = sweepOverlapStrengthInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
sweepOverlapThresholdInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Number(sweepOverlapThresholdInput.value) || 0.6, 0.1, 2);
  const lock = getSelectedLock();
  if (lock) {
    lock.sweepOverlapThreshold = value;
    rebuildLockGeometry(lock);
    syncActiveMirror(lock, { deferGeometry: false });
  } else {
    hairState.state.sweepOverlapThreshold = value;
    locks.forEach((l) => { if (l) rebuildLockGeometry(l); });
  }
  sweepOverlapThresholdInput.value = value;
  const n = sweepOverlapThresholdInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
sweepEdgeSmoothInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Number(sweepEdgeSmoothInput.value) || 0.3, 0, 1);
  const lock = getSelectedLock();
  if (lock) {
    lock.sweepEdgeSmooth = value;
    rebuildLockGeometry(lock);
    syncActiveMirror(lock, { deferGeometry: false });
  } else {
    hairState.state.sweepEdgeSmooth = value;
    locks.forEach((l) => { if (l) rebuildLockGeometry(l); });
  }
  sweepEdgeSmoothInput.value = value;
  const n = sweepEdgeSmoothInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
sweepOverlapFalloffInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Math.round(Number(sweepOverlapFalloffInput.value) || 3), 0, 8);
  const lock = getSelectedLock();
  if (lock) {
    lock.sweepOverlapFalloff = value;
    rebuildLockGeometry(lock);
    syncActiveMirror(lock, { deferGeometry: false });
  } else {
    hairState.state.sweepOverlapFalloff = value;
    locks.forEach((l) => { if (l) rebuildLockGeometry(l); });
  }
  sweepOverlapFalloffInput.value = value;
  const n = sweepOverlapFalloffInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
sweepTangentSmoothInput.addEventListener("input", () => {
  const value = THREE.MathUtils.clamp(Number(sweepTangentSmoothInput.value) || 0.3, 0, 1);
  const lock = getSelectedLock();
  if (lock) {
    lock.sweepTangentSmooth = value;
    rebuildLockGeometry(lock);
    syncActiveMirror(lock, { deferGeometry: false });
  } else {
    hairState.state.sweepTangentSmooth = value;
    locks.forEach((l) => { if (l) rebuildLockGeometry(l); });
  }
  sweepTangentSmoothInput.value = value;
  const n = sweepTangentSmoothInput.closest(".slider-input-row")?.querySelector(".slider-number-input");
  if (n) n.value = value;
});
branchRegionSyncLateralInput.value = branch.state.branchRegionSyncLateral;
branchRegionSyncLateralInput.addEventListener("input", () => {
  branch.state.branchRegionSyncLateral = THREE.MathUtils.clamp(Number(branchRegionSyncLateralInput.value) || 0.45, 0.1, 2);
  branchRegionSyncLateralInput.value = branch.state.branchRegionSyncLateral;
  writeStoredPreference(window, BRANCH_REGION_SYNC_LATERAL_PREFERENCE_KEY, branch.state.branchRegionSyncLateral);
});
branchRegionSyncVerticalInput.value = branch.state.branchRegionSyncVertical;
branchRegionSyncVerticalInput.addEventListener("input", () => {
  branch.state.branchRegionSyncVertical = THREE.MathUtils.clamp(Number(branchRegionSyncVerticalInput.value) || 1, 0.1, 2);
  branchRegionSyncVerticalInput.value = branch.state.branchRegionSyncVertical;
  writeStoredPreference(window, BRANCH_REGION_SYNC_VERTICAL_PREFERENCE_KEY, branch.state.branchRegionSyncVertical);
});
proportionalToggle.addEventListener("click", () => setProportionalEditing(!sculptState.state.proportionalEditing));
appMenuTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const menu = trigger.closest(".app-menu-shell")?.querySelector(".app-menu-dropdown");
    if (!menu) return;
    if (menu.id === "editMenu") {
      deleteSelectionAction.disabled = !hasDeletableSelection();
    }
    if (menu.id === "curvesMenu") {
      openRebuildCurveButton.disabled = !selectedRebuildableCurves().length;
      createCompoundStrandButton.disabled = false;
      createCompoundStrandButton.title = "Create a new editable three-curve compound strand";
    }
    if (menu.id === "fileMenu") ioApi.renderRecentProjectsMenu();
    setAppMenuOpen(trigger, menu, menu.classList.contains("hidden"));
  });
});
recentProjectsMenu.addEventListener("click", async (event) => {
  event.stopPropagation();
  const open = recentProjectsSubmenu.classList.contains("hidden");
  recentProjectsSubmenu.classList.toggle("hidden", !open);
  recentProjectsMenu.setAttribute("aria-expanded", String(open));
  if (open) await ioApi.renderRecentProjectsMenu();
});
appMenuDropdowns.forEach((menu) => {
  menu.addEventListener("click", (event) => {
    if (event.target.closest("button") && !event.target.closest("#toggleTurntable")) closeAppMenus();
  });
});
toggleTurntableButton.addEventListener("click", () => setTurntableActive(!viewportState.state.turntableActive));
turntableSpeedInput.addEventListener("input", () => {
  viewportState.state.turntableSpeed = THREE.MathUtils.clamp(Number(turntableSpeedInput.value) || 1, 0.1, 3);
  turntableSpeedValue.textContent = `${viewportState.state.turntableSpeed.toFixed(1)}x`;
});
setTurntableActive(false);
// --- Wind preview wiring (floating window; enabling is a separate toggle inside it) ---
if (toggleWindPreviewButton) {
  toggleWindPreviewButton.addEventListener("click", () => {
    if (windPreviewWindow && windPreviewWindow.open) {
      setWindPreviewActive(false);
      windPreviewWindow.close();
    } else if (windPreviewWindow) {
      windPreviewWindow.show();
    }
  });
}
if (windPreviewEnableButton) {
  windPreviewEnableButton.addEventListener("click", () => setWindPreviewActive(!windStore.state.windPreviewActive));
}
if (windPreviewCloseButton) {
  windPreviewCloseButton.addEventListener("click", () => {
    setWindPreviewActive(false);
    if (windPreviewWindow) windPreviewWindow.close();
  });
}
if (windPlayPauseButton) {
  windPlayPauseButton.addEventListener("click", () => {
    windStore.state.windPlaying = !windStore.state.windPlaying;
    windPlayPauseButton.textContent = windStore.state.windPlaying ? "Pause" : "Play";
  });
}
windSliders.forEach(({ key, input, value }) => {
  if (!input) return;
  input.addEventListener("input", () => {
    windStore.state[key] = Number(input.value);
    if (value) value.textContent = (WIND_VALUE_FORMATS[key] || ((v) => String(Math.round(Number(v) * 100) / 100)))(windStore.state[key]);
    if (key === "windSeed") { windNoiseCache.seed = null; windNoiseCache.noise = null; } // seed change → rebuild noise lazily
    if (key === "windSeed" || key === "windStrandRandom") {
      // Restore → delete → rebuild → tick. The cache bakes in windSeed/windStrandRandom,
      // so a bare delete froze the preview and left the mesh deformed (the next enable
      // then re-snapshotted rest from the deformed pose, compounding the bend). Restoring
      // first guarantees the rebuilt rest snapshot is the true rest, not last frame's
      // deformed buffer.
      if (windStore.state.windPreviewActive) {
        locks.forEach((lock) => {
          const cache = windPreviewCache.get(lock);
          if (cache) windRestoreLockGeometry(lock, cache);
        });
        locks.forEach((lock) => windPreviewCache.delete(lock));
        locks.forEach((lock) => {
          if (lock?.mesh?.geometry) buildWindPreviewCache(lock);
        });
        windPreviewTick(0); // deform one frame with the new parameters
      }
    }
  });
});
setWindPreviewActive(false); // normalize window/enable state at startup (no-op restore)
radialMenuApi.setRadialMenusEnabled(ui.state.radialMenusEnabled, { persist: false });
clumpProceduralApi.setProceduralDrawExperimentalEnabled(draw.state.proceduralDrawExperimentalEnabled, { persist: false });
setMultiCameraExperimentalEnabled(multiCameraState.state.experimentalEnabled, { persist: false });
setNavigationTipsEnabled(viewportState.state.navigationTipsEnabled, { persist: false });
setNavigationStyle(viewportState.state.navigationStyle, { persist: false });
setCameraSmoothingEnabled(viewportState.state.cameraSmoothingEnabled, { persist: false });
setCameraSmoothingStrength(viewportState.state.cameraSmoothingStrength, { persist: false });
setScaleSensitivity(miscState.state.scaleSensitivity);
setToolTipsEnabled(miscState.state.toolTipsEnabled, { persist: false });
setCompactToolButtonsEnabled(miscState.state.compactToolButtonsEnabled, { persist: false });
setViewportStatisticsEnabled(viewportState.state.viewportStatisticsEnabled, { persist: false });
setTwistCurveAllStrandsPreviewEnabled(hairState.state.twistCurveAllStrandsPreviewEnabled, { persist: false });
setLayerColorShiftsEnabled(sel.state.layerColorShiftsEnabled, { persist: false });
setOutlinerFolderColorsEnabled(sel.state.outlinerFolderColorsEnabled, { persist: false });
setSidePanelStyle(miscState.state.sidePanelStyle, { persist: false });
setGlassPanelColor(miscState.state.glassPanelColor, { persist: false });
setOutlinerFolderColorOpacity(miscState.state.outlinerFolderColorOpacity, { persist: false });
setControlPointDisplaySize(guideState.state.controlPointDisplaySize, { persist: false });
setViewportBackgroundColor(viewportState.state.viewportBackgroundColor, { persist: false });
setDefaultHairShader(hairState.state.defaultHairShader, { persist: false });
updateSculptScaleModeRow();

function initPanelResizeHandles() {
  const studioShell = document.querySelector(".studio-shell");
  const outlinerHandle = document.querySelector("#outlinerResizeHandle");
  const attributeHandle = document.querySelector("#attributeResizeHandle");
  if (!studioShell || !outlinerHandle || !attributeHandle) return;

  const applyWidth = (variable, storageKey, value, min, max) => {
    const next = Math.max(min, Math.min(max, Math.round(value)));
    studioShell.style.setProperty(variable, `${next}px`);
    writeStoredPreference(window, storageKey, next);
    resize();
    updateSnappedFloatingPanels();
  };
  const restoreWidth = (variable, storageKey, fallback, min, max) => {
    const saved = Number(readStoredPreference(window, storageKey, { fallback }));
    applyWidth(variable, storageKey, Number.isFinite(saved) && saved > 0 ? saved : fallback, min, max);
  };

  restoreWidth("--outliner-width", "anime-hair-studio-outliner-width", 252, 160, 480);
  restoreWidth("--attribute-width", "anime-hair-studio-attribute-width", 360, 280, 640);

  const bindResize = (handle, variable, storageKey, min, max, invert) => {
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (appMenuDropdowns.some((menu) => !menu.classList.contains("hidden"))) return; // open menus take priority
      event.preventDefault();
      handle.classList.add("dragging");
      handle.setPointerCapture?.(event.pointerId);
      const startX = event.clientX;
      const startWidth = parseFloat(getComputedStyle(studioShell).getPropertyValue(variable)) || (variable === "--outliner-width" ? 252 : 360);
      const onMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        applyWidth(variable, storageKey, startWidth + (invert ? -delta : delta), min, max);
      };
      const onUp = () => {
        handle.classList.remove("dragging");
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    });
  };

  bindResize(outlinerHandle, "--outliner-width", "anime-hair-studio-outliner-width", 160, 480, false);
  bindResize(attributeHandle, "--attribute-width", "anime-hair-studio-attribute-width", 280, 640, true);
}
initPanelResizeHandles();

function updateSnappedFloatingPanels() {
  const snapTarget = document.querySelector(".tool-panel");
  if (!snapTarget) return;
  const targetLeft = snapTarget.getBoundingClientRect().left;
  document.querySelectorAll(".profile-dialog.floating-snapped").forEach((dialog) => {
    dialog.style.left = `${targetLeft - dialog.offsetWidth}px`;
  });
}

function initFloatingPanelControls() {
  const snapTarget = document.querySelector(".tool-panel");
  const snapThreshold = 2;

  document.querySelectorAll(".profile-dialog").forEach((dialog) => {
    dialog.style.margin = "0";
    const head = dialog.querySelector(".profile-dialog-head");
    if (!head) return;

    const detach = () => {
      const rect = dialog.getBoundingClientRect();
      dialog.style.right = "auto";
      dialog.style.bottom = "auto";
      dialog.style.left = `${rect.left}px`;
      dialog.style.top = `${rect.top}px`;
    };

    // Drag to move (head as handle, excluding buttons), with right-edge snap to the attribute panel
    let drag = null;
    head.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button")) return;
      const rect = dialog.getBoundingClientRect();
      detach();
      drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
      head.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    head.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const maxLeft = Math.max(8, window.innerWidth - dialog.offsetWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - dialog.offsetHeight - 8);
      let left = THREE.MathUtils.clamp(drag.left + event.clientX - drag.x, 8, maxLeft);
      const top = THREE.MathUtils.clamp(drag.top + event.clientY - drag.y, 8, maxTop);
      if (snapTarget) {
        const targetLeft = snapTarget.getBoundingClientRect().left;
        if (Math.abs(left + dialog.offsetWidth - targetLeft) <= snapThreshold) {
          left = targetLeft - dialog.offsetWidth;
          dialog.classList.add("floating-snapped");
        } else {
          dialog.classList.remove("floating-snapped");
        }
      } else {
        dialog.classList.remove("floating-snapped");
      }
      dialog.style.left = `${left}px`;
      dialog.style.top = `${top}px`;
    });
    const endDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      head.releasePointerCapture?.(event.pointerId);
      drag = null;
    };
    head.addEventListener("pointerup", endDrag);
    head.addEventListener("pointercancel", endDrag);

    // Resize via a bottom-right handle
    let handle = dialog.querySelector(".dialog-resize-handle");
    if (!handle) {
      handle = document.createElement("div");
      handle.className = "dialog-resize-handle";
      dialog.appendChild(handle);
    }
    let resize = null;
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const rect = dialog.getBoundingClientRect();
      detach();
      resize = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    });
    handle.addEventListener("pointermove", (event) => {
      if (!resize || resize.pointerId !== event.pointerId) return;
      const width = THREE.MathUtils.clamp(resize.width + event.clientX - resize.x, 300, 720);
      const height = THREE.MathUtils.clamp(resize.height + event.clientY - resize.y, 240, window.innerHeight - 16);
      dialog.style.width = `${width}px`;
      dialog.style.height = `${height}px`;
    });
    const endResize = (event) => {
      if (!resize || resize.pointerId !== event.pointerId) return;
      handle.releasePointerCapture?.(event.pointerId);
      resize = null;
    };
    handle.addEventListener("pointerup", endResize);
    handle.addEventListener("pointercancel", endResize);
  });
}
initFloatingPanelControls();

function updateSculptBrushDockCompact() {
  const dock = document.querySelector("#sculptBrushDock");
  if (!dock || !viewportPanel || dock.classList.contains("hidden")) return;
  if (!dock.querySelector(".sculpt-brush-button")) return;

  // Measure the dock's natural content width in each state (scrollWidth = max-content).
  dock.classList.remove("dock-compact", "dock-icons");
  const fullWidth = dock.scrollWidth;
  dock.classList.add("dock-compact");
  const compactWidth = dock.scrollWidth;
  dock.classList.remove("dock-compact");
  dock.classList.add("dock-icons");
  const iconWidth = dock.scrollWidth;

  const available = Math.max(0, viewportPanel.clientWidth - 16);
  dock.classList.remove("dock-compact", "dock-icons");
  if (available < compactWidth) dock.classList.add("dock-icons");
  else if (available < fullWidth) dock.classList.add("dock-compact");
}
updateSculptBrushDockCompact();
openPreferencesButton.addEventListener("click", openPreferencesDialog);
preferenceCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => setPreferenceCategory(button.dataset.preferenceCategory));
});
preferenceAnchorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPreferenceCategory("viewport");
    document.getElementById(button.dataset.preferenceAnchor)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
[closePreferencesButton, cancelPreferencesButton].forEach((button) => {
  button.addEventListener("click", cancelPreferencesDialog);
});
savePreferencesButton.addEventListener("click", savePreferencesDialog);
loadPreferencesAndPresetsButton.addEventListener("click", () => {
  preferencesAndPresetsFile.value = "";
  preferencesAndPresetsFile.click();
});
preferencesAndPresetsFile.addEventListener("change", ioApi.handlePreferencesAndPresetsFile);
downloadPreferencesAndPresetsButton.addEventListener("click", ioApi.downloadPreferencesAndPresets);
autosavePreferenceInput.addEventListener("change", () => {
  setAutosaveEnabled(autosavePreferenceInput.checked, { persist: false });
});
autosaveIntervalPreferenceInput.addEventListener("change", () => {
  setAutosaveInterval(autosaveIntervalPreferenceInput.value, { persist: false });
});
recoverProjectButton.addEventListener("click", recoverPendingProject);
discardRecoveryButton.addEventListener("click", discardPendingRecovery);
downloadRecoveryButton.addEventListener("click", downloadPendingRecovery);
recoveryDialog.addEventListener("cancel", (event) => event.preventDefault());
preferencesDialog.addEventListener("click", (event) => {
  if (event.target === preferencesDialog) cancelPreferencesDialog();
});
preferencesDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  cancelPreferencesDialog();
});
radialMenusPreferenceInput.addEventListener("change", () => {
  radialMenuApi.setRadialMenusEnabled(radialMenusPreferenceInput.checked, { persist: false });
});
proceduralDrawExperimentalPreferenceInput.addEventListener("change", () => {
  clumpProceduralApi.setProceduralDrawExperimentalEnabled(proceduralDrawExperimentalPreferenceInput.checked, { persist: false });
});
multiCameraExperimentalPreferenceInput.addEventListener("change", () => {
  setMultiCameraExperimentalEnabled(multiCameraExperimentalPreferenceInput.checked, { persist: false });
});
navigationTipsPreferenceInput.addEventListener("change", () => {
  setNavigationTipsEnabled(navigationTipsPreferenceInput.checked, { persist: false });
});
navigationStylePreferenceInput.addEventListener("change", () => {
  setNavigationStyle(navigationStylePreferenceInput.value, { persist: false });
});
cameraSmoothingPreferenceInput.addEventListener("change", () => {
  setCameraSmoothingEnabled(cameraSmoothingPreferenceInput.checked, { persist: false });
});
cameraSmoothingStrengthPreferenceInput.addEventListener("input", () => {
  setCameraSmoothingStrength(cameraSmoothingStrengthPreferenceInput.value, { persist: false });
});
toolTipsPreferenceInput.addEventListener("change", () => {
  setToolTipsEnabled(toolTipsPreferenceInput.checked, { persist: false });
});
compactToolButtonsPreferenceInput.addEventListener("change", () => {
  setCompactToolButtonsEnabled(compactToolButtonsPreferenceInput.checked, { persist: false });
});
viewportStatisticsPreferenceInput.addEventListener("change", () => {
  setViewportStatisticsEnabled(viewportStatisticsPreferenceInput.checked, { persist: false });
});
twistCurvePreviewPreferenceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTwistCurveAllStrandsPreviewEnabled(
      button.dataset.twistCurvePreview === "all",
      { persist: false }
    );
  });
});
layerColorShiftsPreferenceInput.addEventListener("change", () => {
  setLayerColorShiftsEnabled(layerColorShiftsPreferenceInput.checked, { persist: false });
});
outlinerFolderColorsPreferenceInput.addEventListener("change", () => {
  setOutlinerFolderColorsEnabled(outlinerFolderColorsPreferenceInput.checked, { persist: false });
});
sidePanelStylePreferenceInput.addEventListener("change", () => {
  setSidePanelStyle(sidePanelStylePreferenceInput.value, { persist: false });
});
glassPanelColorPreferenceInput.addEventListener("input", () => {
  setGlassPanelColor(glassPanelColorPreferenceInput.value, { persist: false });
});
resetGlassPanelColorButton.addEventListener("click", () => {
  setGlassPanelColor(DEFAULT_GLASS_PANEL_COLOR, { persist: false });
});
outlinerFolderColorOpacityPreferenceInput.addEventListener("input", () => {
  setOutlinerFolderColorOpacity(outlinerFolderColorOpacityPreferenceInput.value, { persist: false });
});
sideNamingPerspectivePreferenceInput.addEventListener("change", () => {
  setSideNamingPerspective(sideNamingPerspectivePreferenceInput.value, { persist: false });
});
controlPointDisplaySizePreferenceInput.addEventListener("input", () => {
  setControlPointDisplaySize(controlPointDisplaySizePreferenceInput.value, { persist: false });
});
viewportBackgroundColorPreferenceInput.addEventListener("input", () => {
  setViewportBackgroundColor(viewportBackgroundColorPreferenceInput.value, { persist: false });
});
resetViewportBackgroundColorButton.addEventListener("click", () => {
  setViewportBackgroundColor(DEFAULT_VIEWPORT_BACKGROUND_COLOR, { persist: false });
});
defaultHairShaderPreferenceInput.addEventListener("change", () => {
  setDefaultHairShader(defaultHairShaderPreferenceInput.value, { persist: false });
});
languageSelect.addEventListener("change", () => {
  const language = documentLocalizer.setLanguage(languageSelect.value);
  languageSelect.value = language;
  saveLanguage(language);
});
viewportEditModeInput.addEventListener("change", () => setViewportEditMode(viewportEditModeInput.value));
viewportSelectionModeButtons.forEach((button) => {
  button.addEventListener("click", () => setViewportSelectionMode(button.dataset.selectionMode));
});
strandOutlinerTab.addEventListener("click", () => {
  setOutlinerPanelCollapsed(false);
  setOutlinerTab("strands");
});
guideOutlinerTab.addEventListener("click", () => {
  setOutlinerPanelCollapsed(false);
  setOutlinerTab("guides");
});
referenceOutlinerTab.addEventListener("click", () => {
  setOutlinerPanelCollapsed(false);
  setOutlinerTab("references");
});
openShortcutsButton.addEventListener("click", () => shortcutsDialog.showModal());
[closeShortcutsButton, dismissShortcutsButton].forEach((button) => {
  button.addEventListener("click", () => shortcutsDialog.close());
});
shortcutsDialog.addEventListener("click", (event) => {
  if (event.target === shortcutsDialog) shortcutsDialog.close();
});
function selectPatchNotesVersion(version) {
  const selectedPanel = patchNotesPanels.find((panel) => panel.dataset.patchNotesPanel === version) || patchNotesPanels[0];
  if (!selectedPanel) return;
  const selectedVersion = selectedPanel.dataset.patchNotesPanel;
  patchNotesVersionButtons.forEach((button) => {
    const active = button.dataset.patchNotesVersion === selectedVersion;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  patchNotesPanels.forEach((panel) => {
    panel.hidden = panel !== selectedPanel;
  });
  patchNotesDialogTitle.textContent = selectedPanel.dataset.patchNotesTitle || "Anime Hair Studio Patch Notes";
  patchNotesDialogSummary.textContent = selectedPanel.dataset.patchNotesSummary || "";
  selectedPanel.scrollTop = 0;
}

patchNotesVersionButtons.forEach((button) => {
  button.addEventListener("click", () => selectPatchNotesVersion(button.dataset.patchNotesVersion));
});
openPatchNotesButton.addEventListener("click", () => {
  selectPatchNotesVersion(patchNotesVersionButtons[0]?.dataset.patchNotesVersion);
  patchNotesDialog.showModal();
});
[closePatchNotesButton, dismissPatchNotesButton].forEach((button) => {
  button.addEventListener("click", () => patchNotesDialog.close());
});
patchNotesDialog.addEventListener("click", (event) => {
  if (event.target === patchNotesDialog) patchNotesDialog.close();
});
joinDiscordButton.addEventListener("click", () => {
  window.open("https://discord.gg/U4JBykv4yk", "_blank", "noopener,noreferrer");
});

createViewportReferenceMenu.addEventListener("click", () => referenceHeadApi.requestReferenceImage("overlay"));
createPlaneReferenceMenu.addEventListener("click", () => referenceHeadApi.requestReferenceImage("plane"));
closeReferenceImagePanel.addEventListener("click", () => referenceHeadApi.setReferenceImagePanelOpen(false));
addViewportReference.addEventListener("click", () => referenceHeadApi.requestReferenceImage("overlay"));
addPlaneReference.addEventListener("click", () => referenceHeadApi.requestReferenceImage("plane"));
referenceImageFile.addEventListener("change", async () => {
  const file = referenceImageFile.files?.[0];
  const type = ref.state.pendingReferenceImageType;
  ref.state.pendingReferenceImageType = null;
  if (!file || !type) return;
  try {
    await referenceHeadApi.addReferenceImagesFromFiles([file], type);
  } catch (error) {
    console.error("Could not add reference image", error);
  }
});
window.addEventListener("dragenter", (event) => {
  if (ioApi.dragContainsApplicationFile(event)) {
    event.preventDefault();
    referenceHeadApi.setReferenceImageDragActive(false);
    return;
  }
  if (!referenceHeadApi.dragContainsReferenceImage(event)) return;
  event.preventDefault();
  referenceHeadApi.setReferenceImageDragActive(true);
  referenceHeadApi.setReferenceDropHover(event);
});
window.addEventListener("dragover", (event) => {
  if (ioApi.dragContainsApplicationFile(event)) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    referenceHeadApi.setReferenceImageDragActive(false);
    return;
  }
  if (!referenceHeadApi.dragContainsReferenceImage(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  referenceHeadApi.setReferenceImageDragActive(true);
  referenceHeadApi.setReferenceDropHover(event);
});
window.addEventListener("dragleave", (event) => {
  if (event.relatedTarget == null) referenceHeadApi.setReferenceImageDragActive(false);
});
window.addEventListener("dragend", () => referenceHeadApi.setReferenceImageDragActive(false));
window.addEventListener("drop", async (event) => {
  const transferredFiles = [...(event.dataTransfer?.files || [])];
  const applicationFiles = transferredFiles.filter((file) => applicationDropFileKind(file));
  if (applicationFiles.length) {
    event.preventDefault();
    referenceHeadApi.setReferenceImageDragActive(false);
    if (applicationFiles.length !== 1 || transferredFiles.length !== 1) {
      window.alert("Drop one .ahs or .obj file at a time.");
      return;
    }
    let handle = null;
    const item = [...(event.dataTransfer?.items || [])].find(
      (entry) => entry.kind === "file" && applicationDropFileKind(entry.getAsFile?.())
    );
    if (item?.getAsFileSystemHandle) {
      try { handle = await item.getAsFileSystemHandle(); } catch { handle = null; }
    }
    ioApi.openDroppedApplicationFilePrompt(applicationFiles[0], { handle });
    return;
  }
  const files = transferredFiles.filter(referenceHeadApi.isSupportedReferenceImageFile);
  const destination = referenceHeadApi.referenceDropDestination(event);
  const overlayPosition = destination === "overlay" ? referenceHeadApi.viewportOverlayDropPosition(event) : null;
  referenceHeadApi.setReferenceImageDragActive(false);
  if (!files.length) return;
  event.preventDefault();

  if (!destination) return;
  try {
    const type = destination === "overlay" ? "overlay" : "plane";
    await referenceHeadApi.addReferenceImagesFromFiles(files, type, {
      view: type === "plane" ? destination : "front",
      overlayPosition
    });
  } catch (error) {
    console.error("Could not add dropped reference images", error);
  }
});

bindUndoCapture(referenceImageType);
referenceImageType.addEventListener("change", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (!reference) return;
  referenceHeadApi.setReferenceImageType(reference, referenceImageType.value);
});
[referenceImageVisible, referenceImageSnappedViewOnly, referenceImageOpacity]
  .forEach(bindUndoCapture);
referenceImageVisible.addEventListener("change", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (!reference) return;
  reference.visible = referenceImageVisible.checked;
  referenceHeadApi.applyReferenceImageRuntime(reference);
  referenceHeadApi.renderReferenceImagePanel();
});
referenceImageSnappedViewOnly.addEventListener("change", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (reference?.type !== "plane") return;
  reference.snappedViewOnly = referenceImageSnappedViewOnly.checked;
  referenceHeadApi.updateReferencePlaneVisibility();
  referenceHeadApi.renderReferenceImagePanel();
});
referenceImageOpacity.addEventListener("input", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (!reference) return;
  reference.opacity = Number(referenceImageOpacity.value);
  referenceHeadApi.applyReferenceImageRuntime(reference);
  referenceImageOpacityValue.textContent = reference.opacity.toFixed(2);
});
referenceImageFlipX.addEventListener("click", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (!reference) return;
  pushUndoState();
  reference.flipX = !reference.flipX;
  referenceHeadApi.applyReferenceImageRuntime(reference);
  referenceHeadApi.renderReferenceImagePanel();
});
resetReferenceImageCrop.addEventListener("click", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (reference?.type !== "overlay" || referenceHeadApi.referenceCropIsFull(reference)) return;
  pushUndoState();
  reference.crop = { left: 0, top: 0, right: 1, bottom: 1 };
  referenceHeadApi.applyReferenceImageRuntime(reference);
  referenceHeadApi.renderReferenceImagePanel();
});
referenceImageView.addEventListener("change", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (reference?.type !== "plane") return;
  pushUndoState();
  referenceHeadApi.placeReferencePlane(reference, referenceImageView.value);
  referenceHeadApi.renderReferenceImagePanel();
});
bindUndoCapture(referencePlaneInFront);
referencePlaneInFront.addEventListener("change", () => {
  const reference = referenceHeadApi.selectedReferenceImage();
  if (reference?.type !== "plane") return;
  referenceHeadApi.setReferencePlaneInFront(reference, referencePlaneInFront.checked);
  referenceHeadApi.renderReferenceImagePanel();
});
deleteReferenceImage.addEventListener("click", () => {
  referenceHeadApi.deleteSelectedReferenceImage();
});
deleteSelectionAction.addEventListener("click", () => {
  deleteCurrentSelection();
});
openRebuildCurveButton.addEventListener("click", openRebuildCurveDialog);
createCompoundStrandButton.addEventListener("click", createCompoundStrand);
rebuildCurveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  rebuildSelectedCurves();
});
[closeRebuildCurveButton, cancelRebuildCurveButton].forEach((button) => {
  button.addEventListener("click", () => rebuildCurveDialog.close());
});
rebuildCurveDialog.addEventListener("click", (event) => {
  if (event.target === rebuildCurveDialog) rebuildCurveDialog.close();
});
proceduralDuplicateCountInput.addEventListener("input", () => {
  proceduralDuplicateApi.updateProceduralDuplicateSpacingNote();
  proceduralDuplicateApi.rebuildProceduralDuplicatePreview();
});
[
  proceduralDuplicateRootSinkInput,
  proceduralDuplicateSecondPointOutwardInput,
  proceduralDuplicateSecondPointTowardRootInput
].forEach((input) => {
  input.addEventListener("input", () => proceduralDuplicateApi.rebuildProceduralDuplicatePreview());
});
proceduralDuplicateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  proceduralDuplicateApi.confirmProceduralDuplicatePreview();
});
[closeProceduralDuplicateButton, cancelProceduralDuplicateButton].forEach((button) => {
  button.addEventListener("click", proceduralDuplicateApi.closeProceduralDuplicateDialog);
});
proceduralDuplicateDialog.addEventListener("click", (event) => {
  if (event.target === proceduralDuplicateDialog) proceduralDuplicateApi.closeProceduralDuplicateDialog();
});
proceduralDuplicateDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  proceduralDuplicateApi.closeProceduralDuplicateDialog();
});
scalpPaintToggle.addEventListener("click", () => {
  scalpBuilder.setScalpPaintEditing(!scalpState.state.scalpPaintEditing);
  scalpBuilder.setScalpSetupMenuOpen(false);
});
scalpBuilderMode.addEventListener("click", () => {
  scalpBuilder.setScalpBuilderEditing(!scalpState.state.scalpBuilderEditing);
  scalpBuilder.setScalpSetupMenuOpen(false);
});
headSetupMode.addEventListener("click", () => {
  referenceHeadApi.setHeadSetupEditing(!sculptState.state.headSetupEditing);
  scalpBuilder.setScalpSetupMenuOpen(false);
});
function toggleCapsuleGuideTool() {
  if (sculptState.state.capsuleGuideEditing) guideApi.setCapsuleGuideEditing(false);
  else setActiveTool("surface-guide");
  scalpBuilder.setScalpSetupMenuOpen(false);
}

function activateCapsuleGuideDrawTool() {
  exitSetupEditors();
  setViewportEditMode("guide", { activateSelect: false });
  setActiveTool("draw-capsule-guide");
  scalpBuilder.setScalpSetupMenuOpen(false);
}

function createCurveLatticeGuideFromUi() {
  if (!CURVE_LATTICE_FEATURE_ENABLED) return;
  exitSetupEditors();
  setViewportEditMode("guide");
  createStandaloneCurveLatticeGuide();
  scalpBuilder.setScalpSetupMenuOpen(false);
  placementApi.updatePlacementStatus();
}

capsuleGuideMode.addEventListener("click", toggleCapsuleGuideTool);
drawCapsuleGuideMode.addEventListener("click", activateCapsuleGuideDrawTool);
viewportCapsuleGuideTool.addEventListener("click", toggleCapsuleGuideTool);
curveLatticeGuideMode.addEventListener("click", createCurveLatticeGuideFromUi);
viewportCurveLatticeGuideTool.addEventListener("click", createCurveLatticeGuideFromUi);
document.querySelector("#fineTuneScalpGuide").addEventListener("click", () => {
  referenceHeadApi.setHeadSetupEditing(false);
  scalpBuilder.setScalpBuilderEditing(true);
});
resetScalpBuilderButton.addEventListener("click", scalpBuilder.resetScalpBuilder);
confirmScalpBuilderButton.addEventListener("click", scalpBuilder.confirmScalpBuilderPlane);
generateScalpBuilderButton.addEventListener("click", scalpBuilder.displayScalpBuilderConstructionCurves);
scalpBuilderShowTemplateInput.addEventListener("change", scalpBuilder.rebuildScalpBuilderTemplateOverlay);
scalpBuilderTransparentHeadInput.addEventListener("change", () => {
  if (!scalpState.state.scalpBuilderEditing) return;
  referenceHeadApi.setHeadReferenceTransparency(scalpBuilderTransparentHeadInput.checked, 0.18);
});
document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest(".app-menu-shell")) closeAppMenus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAppMenus();
});
scalpGuideVisibilityToggle.addEventListener("click", guideApi.cycleGuideViewMode);
scalpGuideVisibilityToggle.addEventListener("contextmenu", guideApi.showGuideViewContextMenu);
guideViewModeActions.forEach((button) => {
  button.addEventListener("click", () => {
    guideApi.setGuideViewMode(button.dataset.guideViewMode);
    guideApi.hideGuideViewContextMenu();
  });
});
allRegionsVisibilityInput.addEventListener("change", () => {
  regionVisibilityInputs.forEach((input) => {
    input.checked = allRegionsVisibilityInput.checked;
  });
  visibleStrandRegions.clear();
  regionVisibilityInputs.forEach((input) => {
    if (input.checked) visibleStrandRegions.add(input.dataset.regionVisibility);
  });
  applyDisplayVisibilityFilters();
});
regionVisibilityInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) visibleStrandRegions.add(input.dataset.regionVisibility);
    else visibleStrandRegions.delete(input.dataset.regionVisibility);
    applyDisplayVisibilityFilters();
  });
});
allLayersVisibilityInput.addEventListener("change", () => {
  layerVisibilityInputs.forEach((input) => {
    input.checked = allLayersVisibilityInput.checked;
  });
  visibleStrandLayers.clear();
  layerVisibilityInputs.forEach((input) => {
    if (input.checked) visibleStrandLayers.add(input.dataset.layerVisibility);
  });
  applyDisplayVisibilityFilters();
});
layerVisibilityInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) visibleStrandLayers.add(input.dataset.layerVisibility);
    else visibleStrandLayers.delete(input.dataset.layerVisibility);
    applyDisplayVisibilityFilters();
  });
});
allGuidesVisibilityInput.addEventListener("change", () => {
  const visible = allGuidesVisibilityInput.checked;
  guideState.state.capsuleGuidesVisible = visible;
  guideState.state.curveLatticeGuidesVisible = visible;
  scalpBuilder.setScalpGuideVisibility(visible);
  guideApi.applyCapsuleGuideDisplayVisibility();
  guideApi.applyCurveLatticeGuideDisplayVisibility();
  syncDisplayVisibilityInputs();
});
scalpDisplayVisibilityInput.addEventListener("change", () => {
  scalpBuilder.setScalpGuideVisibility(scalpDisplayVisibilityInput.checked);
});
capsuleDisplayVisibilityInput.addEventListener("change", () => {
  guideState.state.capsuleGuidesVisible = capsuleDisplayVisibilityInput.checked;
  guideApi.applyCapsuleGuideDisplayVisibility();
  syncDisplayVisibilityInputs();
});
curveLatticeDisplayVisibilityInput.addEventListener("change", () => {
  guideState.state.curveLatticeGuidesVisible = curveLatticeDisplayVisibilityInput.checked;
  guideApi.applyCurveLatticeGuideDisplayVisibility();
  syncDisplayVisibilityInputs();
});
headMeshDisplayVisibilityInput.addEventListener("change", () => {
  hairState.state.headMeshVisible = headMeshDisplayVisibilityInput.checked;
  applyCharacterMeshDisplayVisibility();
  syncDisplayVisibilityInputs();
});
bodyMeshDisplayVisibilityInput.addEventListener("change", () => {
  hairState.state.bodyMeshVisible = bodyMeshDisplayVisibilityInput.checked;
  applyCharacterMeshDisplayVisibility();
  syncDisplayVisibilityInputs();
});
[placeAutoShowScalpInput, drawAutoShowScalpInput, braidAutoShowScalpInput, panelAutoShowScalpInput].forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) scalpBuilder.autoShowScalpGuideForActiveTool();
  });
});
groupColorToggle.addEventListener("click", () => setGroupColorView(!hairState.state.showGroupColors));
toggleUvCheckerButton.addEventListener("click", () => setUvCheckerEnabled(!hairState.state.uvCheckerEnabled));
refreshUvCheckerButton.addEventListener("click", refreshUvCheckerPreview);
closeUvInspectorButton.addEventListener("click", () => setUvCheckerEnabled(false));
uvInspectorDragHandle.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  const bounds = uvInspectorWindow.getBoundingClientRect();
  sculptState.state.uvInspectorDrag = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    left: bounds.left,
    top: bounds.top
  };
  uvInspectorDragHandle.setPointerCapture(event.pointerId);
});
uvInspectorDragHandle.addEventListener("pointermove", (event) => {
  if (!sculptState.state.uvInspectorDrag || sculptState.state.uvInspectorDrag.pointerId !== event.pointerId) return;
  const maxLeft = Math.max(8, window.innerWidth - uvInspectorWindow.offsetWidth - 8);
  const maxTop = Math.max(8, window.innerHeight - uvInspectorWindow.offsetHeight - 8);
  const left = THREE.MathUtils.clamp(sculptState.state.uvInspectorDrag.left + event.clientX - sculptState.state.uvInspectorDrag.x, 8, maxLeft);
  const top = THREE.MathUtils.clamp(sculptState.state.uvInspectorDrag.top + event.clientY - sculptState.state.uvInspectorDrag.y, 8, maxTop);
  uvInspectorWindow.style.left = `${left}px`;
  uvInspectorWindow.style.top = `${top}px`;
});
uvInspectorDragHandle.addEventListener("pointerup", (event) => {
  if (sculptState.state.uvInspectorDrag?.pointerId !== event.pointerId) return;
  uvInspectorDragHandle.releasePointerCapture(event.pointerId);
  sculptState.state.uvInspectorDrag = null;
});
uvInspectorDragHandle.addEventListener("pointercancel", () => {
  sculptState.state.uvInspectorDrag = null;
});
// Wind preview window drag — same pattern as the UV inspector above; drag state lives in
// sculptState (runtime field, never serialized) so app.js gains no new global `let`.
if (windPreviewDragHandle && windPreviewWindow) {
  windPreviewDragHandle.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const bounds = windPreviewWindow.getBoundingClientRect();
    sculptState.state.windPreviewDrag = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: bounds.left,
      top: bounds.top
    };
    windPreviewDragHandle.setPointerCapture(event.pointerId);
  });
  windPreviewDragHandle.addEventListener("pointermove", (event) => {
    const drag = sculptState.state.windPreviewDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const maxLeft = Math.max(8, window.innerWidth - windPreviewWindow.offsetWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - windPreviewWindow.offsetHeight - 8);
    const left = THREE.MathUtils.clamp(drag.left + event.clientX - drag.x, 8, maxLeft);
    const top = THREE.MathUtils.clamp(drag.top + event.clientY - drag.y, 8, maxTop);
    windPreviewWindow.style.left = `${left}px`;
    windPreviewWindow.style.top = `${top}px`;
  });
  windPreviewDragHandle.addEventListener("pointerup", (event) => {
    if (sculptState.state.windPreviewDrag?.pointerId !== event.pointerId) return;
    windPreviewDragHandle.releasePointerCapture(event.pointerId);
    sculptState.state.windPreviewDrag = null;
  });
  windPreviewDragHandle.addEventListener("pointercancel", () => {
    sculptState.state.windPreviewDrag = null;
  });
}
[lightAzimuthInput, lightElevationInput].forEach((input) => {
  input.addEventListener("input", updateLightAngleFromInputs);
});
Object.entries(headTransformInputs).forEach(([key, input]) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    headTransform[key] = Number(input.value);
    headTransformValues[key].textContent = headTransform[key].toFixed(2);
    referenceHeadApi.applyHeadTransform();
  });
});
headTransformResetButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const key = button.dataset.resetHeadTransform;
    const resetValue = key === "uniformScale" ? 1 : 0;
    if (headTransform[key] === resetValue) return;
    pushUndoState();
    headTransform[key] = resetValue;
    referenceHeadApi.syncHeadTransformInputs();
    referenceHeadApi.applyHeadTransform();
  });
});
scalpRoughScaleInputs.forEach((input) => {
  bindUndoCapture(input);
  input.addEventListener("input", () => {
    scalpRoughScale[input.dataset.scalpRoughScaleAxis] = Number(input.value);
    scalpBuilder.syncScalpRoughScaleInputs();
    scalpBuilder.applyScalpRoughScale();
  });
});
scalpRoughScaleResetButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const axis = button.dataset.resetScalpRoughScale;
    if (scalpRoughScale[axis] === 1) return;
    pushUndoState();
    scalpRoughScale[axis] = 1;
    scalpBuilder.syncScalpRoughScaleInputs();
    scalpBuilder.applyScalpRoughScale();
  });
});
advancedLatticeButton.addEventListener("click", () => scalpBuilder.setScalpLatticeEditing(!scalpState.state.scalpLatticeEditing));
undoButton.addEventListener("click", undoLastAction);
redoButton.addEventListener("click", redoLastAction);

scalpRegionButtons.forEach((button) => {
  button.addEventListener("click", () => scalpBuilder.setActiveScalpRegion(button.dataset.scalpRegion));
});
document.querySelector("#clearScalpRegions").addEventListener("click", () => scalpBuilder.clearScalpRegions());
scalpBrushSizeInput.addEventListener("input", () => placementApi.updatePlacementStatus());

[proportionalRadiusInput, proportionalFalloffInput].forEach((input) => {
  input.addEventListener("input", () => {
    refreshProportionalPreview();
    placementApi.updatePlacementStatus();
  });
});
proportionalLockRootInput.addEventListener("change", () => {
  sculptState.state.proportionalRootLocked = proportionalLockRootInput.checked;
  refreshProportionalPreview();
  placementApi.updatePlacementStatus();
});

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.altKey && !event.shiftKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    if (event.repeat) return;
    fileApi.exportHairProjectQuickly();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    if (event.repeat) return;
    if (event.shiftKey) fileApi.saveHairProjectFile();
    else fileApi.saveHairProjectQuickly();
    return;
  }
  const tag = document.activeElement?.tagName?.toLowerCase();
  let editingField = tag === "input"
    || tag === "textarea"
    || tag === "select"
    || document.activeElement?.isContentEditable;
  if (focusedControlShouldYieldToShortcut(document.activeElement, event)) {
    document.activeElement.blur();
    editingField = false;
  }
  if (event.key === "Shift" && !event.repeat) {
    transform.state.transformPrecisionHeld = true;
    syncNavigationModifierLocks();
  }
  if (event.key === "Control" && !event.repeat) {
    sculptState.state.selectionRemoveHeld = true;
    syncNavigationModifierLocks();
  }
  if (event.key === "Escape" && referenceHeadApi.finishReferenceOverlayDrag(event, { cancel: true })) {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && proceduralDuplicateDialog.open) {
    proceduralDuplicateApi.closeProceduralDuplicateDialog();
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && proceduralDuplicateApi.cancelDuplicatePlacement()) {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && radialMenuApi.cancelStrandRadialGesture()) {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && radialMenuApi.cancelToolShortcutPress()) {
    event.preventDefault();
    return;
  }
  if (
    event.key === "Escape"
    && sel.state.activeTool === "poly"
    && sculptState.state.polyBrushStroke
  ) {
    polyToolsApi.finishPolyBrushStroke(event, { cancel: true });
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && sel.state.activeTool === "draw-capsule-guide" && sculptState.state.capsuleGuideDrawStroke) {
    guideApi.finishCapsuleGuideDrawStroke(event, { cancel: true });
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && sel.state.activeTool === "surface-loft" && curveSurfaceCreate.cancelLoftSurfaceDraft()) {
    event.preventDefault();
    curveSurfaceCreate.resetLoftSurfaceDraft();
    return;
  }
  if (event.key === "Escape" && sel.state.activeTool === "curve-surface" && sculptState.state.curveSurfaceDraft) {
    if (sculptState.state.curveSurfaceDraft.activeStroke) curveSurfaceCreate.finishCurveSurfaceStroke(event, { cancel: true });
    else curveSurfaceCreate.cancelCurveSurfaceDraft();
    event.preventDefault();
    return;
  }
  if (!editingField && event.key === "Enter" && sel.state.activeTool === "curve-surface" && curveSurfaceCreate.commitCurveSurfaceDraft(event)) {
    event.preventDefault();
    return;
  }
  const requestedShortcutTool = !editingField && !event.ctrlKey && !event.metaKey && !event.altKey
    ? shortcutToolForKey(event.key)
    : null;
  if (requestedShortcutTool && !event.repeat) {
    radialMenuApi.cancelStrandRadialGesture();
    radialMenuApi.cancelToolShortcutPress();
    radialMenuApi.cancelToolRadialGesture();
  }
  if (sculptState.state.duplicatePlacement) {
    event.preventDefault();
    return;
  }
  if (miscState.state.toolRadialGesture) {
    event.preventDefault();
    return;
  }
  if (
    !editingField
    && event.ctrlKey
    && !event.metaKey
    && !event.shiftKey
    && !event.altKey
    && event.key === "1"
    && (strandIsolationActive() || selectedLocksInOrder().length)
  ) {
    event.preventDefault();
    if (!event.repeat) toggleSelectedStrandIsolation();
    return;
  }
  if (
    !editingField
    && event.ctrlKey
    && !event.metaKey
    && !event.shiftKey
    && !event.altKey
    && event.key.toLowerCase() === "d"
  ) {
    event.preventDefault();
    if (!event.repeat) proceduralDuplicateApi.beginDuplicatePlacement(selectedLocksInOrder());
    return;
  }
  if (
    event.key === "Shift"
    && !event.repeat
    && sculptState.state.transformDragging
    && ["translate", "rotate", "scale"].includes(transformControls.mode)
  ) {
    event.preventDefault();
    return;
  }
  if (
    viewportState.state.navigationStyle === "anime-hair-studio"
    && event.key === "Shift"
    && !event.repeat
    && beginViewSnapFromActiveOrbit()
  ) {
    event.preventDefault();
    return;
  }
  if (
    viewportState.state.navigationStyle === "blender"
    && event.key === "Alt"
    && !event.repeat
    && beginViewSnapFromActiveOrbit()
  ) {
    event.preventDefault();
    return;
  }
  if (
    viewportState.state.navigationStyle === "blender"
    && event.key === "Shift"
    && viewportState.state.activeViewportPointer?.buttonMask === 4
    && (viewportState.state.activeViewportPointer.buttons & 4)
  ) {
    event.preventDefault();
    return;
  }
  if (event.key === "Shift" && !event.repeat && !editingField && sculptBrushToolActive()) {
    setSculptBrushShiftSmoothHeld(true);
  }
  if (event.key === "Shift" && !event.repeat && !editingField && sel.state.activeTool === "poly") {
    draw.state.polyShiftPreviewHeld = true;
    polyToolsApi.refreshPolyFillPreviewFromLastPointer();
  }
  if (event.key === "Escape" && !presetLibrary.classList.contains("hidden")) {
    event.preventDefault();
    presetLibraryApi.setPresetLibraryOpen(false);
    presetLibraryToggle.focus();
    return;
  }
  if (!editingField && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !event.shiftKey) {
    event.preventDefault();
    if (event.repeat || undo.state.historyShortcutHeld) return;
    undo.state.historyShortcutHeld = true;
    undoLastAction();
    return;
  }
  if (
    !editingField
    && (event.ctrlKey || event.metaKey)
    && (event.key.toLowerCase() === "y" || (event.shiftKey && event.key.toLowerCase() === "z"))
  ) {
    event.preventDefault();
    if (event.repeat || undo.state.historyShortcutHeld) return;
    undo.state.historyShortcutHeld = true;
    redoLastAction();
    return;
  }
  if (
    !editingField
    && !event.ctrlKey
    && !event.metaKey
    && !event.altKey
    && event.key.toLowerCase() === "z"
    && sel.state.activeTool === "move"
    && viewPlaneMoveActiveForView()
  ) {
    event.preventDefault();
    if (!event.repeat) setViewPlaneNormalMoveHeld(true);
    return;
  }
  if (editingField || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key.toLowerCase() === "l") {
    event.preventDefault();
    if (!event.repeat) {
      if (selectedLocksInOrder().length) lockSelectedStrands();
      else unlockAllStrands();
    }
    return;
  }
  if (event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();
    if (!event.repeat) {
      setViewportSelectionMode(effectiveViewportSelectionMode() === "component" ? "object" : "component");
    }
    return;
  }
  const shortcutWorkspace = workspaceForShortcutKey(event.key);
  if (shortcutWorkspace) {
    event.preventDefault();
    if (!event.repeat) setViewportEditMode(shortcutWorkspace);
    return;
  }
  if (event.key === "Delete") {
    event.preventDefault();
    if (event.repeat) return;
    if (hairMaterialPanel.contains(document.activeElement)) {
      materialApi.deleteActiveHairMaterial();
      return;
    }
    // 选中了 zipper 时，Del 只删除该 zipper，不删除整个 lock。
    if (segmentApi.deleteSelectedPanelSplit()) return;
    if (segmentApi.deleteSelectedStrandSplit()) return;
    deleteCurrentSelection();
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    if (!event.repeat) radialMenuApi.beginStrandRadialGesture();
    return;
  }
  if (event.key.toLowerCase() === "s") {
    event.preventDefault();
    if (!event.repeat) sculptState.state.brushSizeHotkeyHeld = true;
    return;
  }
  if (event.key.toLowerCase() === "b") {
    event.preventDefault();
    if (event.repeat || sculptState.state.proportionalHotkeyPress) return;
    sculptState.state.proportionalHotkeyPress = {
      wasEnabled: sculptState.state.proportionalEditing,
      activatedByHold: false,
      startX: lastPointer.x,
      startY: lastPointer.y,
      holdTimer: null
    };
    if (sculptState.state.proportionalEditing) beginProportionalSizeEdit(event);
    else sculptState.state.proportionalHotkeyPress.holdTimer = window.setTimeout(activateProportionalHotkeyHold, 180);
    updateInteractionLocks();
    return;
  }
  if (event.key.toLowerCase() === "o") {
    event.preventDefault();
    setObjectSpaceEditing(!sculptState.state.objectSpaceEditing);
    return;
  }
  if (event.key.toLowerCase() === "h") {
    event.preventDefault();
    setHierarchyEditing(!sculptState.state.hierarchyEditing);
    return;
  }
  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    if (!event.repeat) cycleViewportFraming();
    return;
  }
  if (event.key.toLowerCase() === "x") {
    event.preventDefault();
    if (!event.repeat) setMirrorXEditing(!sculptState.state.mirrorXEditing);
    return;
  }
  const tool = shortcutToolForKey(event.key);
  if (!tool) return;
  event.preventDefault();
  if (event.repeat) return;
  if (["select", "move", "rotate", "scale"].includes(tool)) {
    radialMenuApi.beginToolShortcutPress(event.key.toLowerCase(), tool);
  } else {
    setActiveTool(tool);
  }
}, true);

window.addEventListener("keyup", (event) => {
  if (event.key.toLowerCase() === "z") {
    setViewPlaneNormalMoveHeld(false);
  }
  if (event.key === "Shift") {
    transform.state.transformPrecisionHeld = false;
    syncNavigationModifierLocks();
    setSculptBrushShiftSmoothHeld(false);
    draw.state.polyShiftPreviewHeld = false;
    polyToolsApi.clearPolyFillPreview();
    if (viewportState.state.navigationStyle === "anime-hair-studio") endViewSnap();
  }
  if (event.key === "Control") {
    sculptState.state.selectionRemoveHeld = false;
    syncNavigationModifierLocks();
  }
  if (event.key === "Alt" && viewportState.state.navigationStyle === "blender") {
    endViewSnap();
  }
  if (radialMenuApi.finishToolShortcutPress(event.key.toLowerCase())) {
    event.preventDefault();
  }
  if (event.code === "Space") {
    event.preventDefault();
    radialMenuApi.finishStrandRadialGesture();
  }
  if (event.key.toLowerCase() === "s") {
    sculptState.state.brushSizeHotkeyHeld = false;
  }
  if (event.key.toLowerCase() === "b" && sculptState.state.proportionalHotkeyPress) {
    const press = sculptState.state.proportionalHotkeyPress;
    window.clearTimeout(press.holdTimer);
    const resizedInfluence = Boolean(sculptState.state.proportionalSizeEdit?.didDrag);
    sculptState.state.proportionalHotkeyPress = null;
    endProportionalSizeEdit();
    if (!resizedInfluence && !press.activatedByHold) setProportionalEditing(!press.wasEnabled);
    else updateInteractionLocks();
  }
});
window.addEventListener("blur", () => {
  transform.state.transformPrecisionHeld = false;
  sculptState.state.selectionRemoveHeld = false;
  setViewPlaneNormalMoveHeld(false);
  syncNavigationModifierLocks();
  viewportState.state.activeViewportPointer = null;
  sculptState.state.pointRemovalCandidate = null;
  draw.state.polyShiftPreviewHeld = false;
  polyToolsApi.clearPolyFillPreview();
  referenceHeadApi.finishReferenceOverlayDrag(null, { cancel: true });
  radialMenuApi.cancelStrandRadialGesture();
  radialMenuApi.cancelToolShortcutPress();
  proceduralDuplicateApi.cancelDuplicatePlacement();
  sculptState.state.brushSizeHotkeyHeld = false;
  setSculptBrushShiftSmoothHeld(false);
  finishBrushSizeDrag();
  window.clearTimeout(sculptState.state.proportionalHotkeyPress?.holdTimer);
  sculptState.state.proportionalHotkeyPress = null;
  endProportionalSizeEdit();
  endViewSnap();
  endViewPlaneMove();
  drawFlowApi.finishDrawStrandStroke(null, { cancel: true });
  sculptState.state.proceduralAccessoryEditPointerActive = false;
  sculptState.state.proceduralAccessoryEditHistoryOpen = false;
  polyToolsApi.finishPolyBrushStroke(null, { cancel: true });
  draw.state.polyAltDeleteCandidate = null;
  updateInteractionLocks();
});

function deleteLocks(targetLocks) {
  const targets = [...new Set(targetLocks)].filter((lock) => locks.includes(lock));
  if (!targets.length) return;
  const targetIds = new Set(targets.map((lock) => lock.id));
  targetIds.forEach((id) => sel.state.selectedStrandIds.delete(id));
  targets.forEach((lock) => {
    const partner = mirrorPartnerFor(lock);
    if (partner && !targetIds.has(partner.id) && partner.mirrorPartnerId === lock.id) {
      partner.mirrorPartnerId = null;
    }
  });
  targets.forEach((item) => {
    if (item.clumpGuide) clumpProceduralApi.dissolveClump(item.clumpId);
    else if (item.clumpId) clumpProceduralApi.detachLockFromClump(item);
  });
  targets.forEach((parent) => {
    branchHierarchy.branchChildrenFor(parent).forEach((child) => {
      if (!targetIds.has(child.id)) branchHierarchy.detachBranch(child);
    });
  });
  if (targets.some((item) => item.curveObjects?.handles.includes(transformControls.object))) transformControls.detach();
  if (targets.some((item) => item.curveObjects?.surfaceObjectAnchor === transformControls.object)) transformControls.detach();
  if (targets.some((item) => sel.state.selectedPoint?.lockId === item.id)) {
    sel.state.selectedPoint = null;
    updateSelectedPointLabel();
  }
  if (targets.some((item) => sel.state.selectedSurfaceObjectAnchorId === item.id)) {
    sel.state.selectedSurfaceObjectAnchorId = null;
    transform.state.activeSurfaceObjectTransform = null;
    updateSelectedPointLabel();
  }
  // Deleting a branch child must refill the parent's carved hole: the parent's
  // mesh is carved procedurally from its live children (branchBridge.applyBranchRootRegionCarving),
  // so rebuild every surviving parent after the children are removed.
  const branchParentsToRebuild = new Set();
  targets.forEach((item) => {
    if (item.branchParentId) branchParentsToRebuild.add(item.branchParentId);
  });
  targets.forEach((item) => {
    restoreUvCheckerPreview(); // 删除前先换回原几何，避免泄漏预览/原几何
    curveSurfaceOpen.delete(item.id);
    hairGroup.remove(item.mesh);
    curveGroup.remove(item.curveObjects.group);
    item.mesh.geometry.dispose();
    removeUvCheckerFromLock(item);
    item.mesh.material.dispose();
    item.selectionOutline?.material.dispose();
    item.wireOverlay?.geometry.dispose();
    item.wireOverlay?.material.dispose();
    disposeCurveObjects(item);
    locks.splice(locks.indexOf(item), 1);
  });
  branchParentsToRebuild.forEach((parentId) => {
    const parent = locks.find((lock) => lock.id === parentId);
    if (parent) updateLockGeometry(parent, { immediate: true });
  });
  cleanSelectionSets();
  if (sel.state.isolatedStrandIds) {
    targetIds.forEach((id) => sel.state.isolatedStrandIds.delete(id));
    if (!sel.state.isolatedStrandIds.size) sel.state.isolatedStrandIds = null;
  }
  if (targets.some((item) => item.id === sel.state.selectedId)) {
    sel.state.selectedCurveSurfaceController = null;
    const fallback = locks.find((lock) => sel.state.selectedStrandIds.has(lock.id)) || locks.at(-1);
    if (fallback) selectLock(fallback.id, {
      individualClumpMember: true,
      selectedIds: sel.state.selectedStrandIds.size ? [...sel.state.selectedStrandIds] : undefined
    });
    else deselectStrands();
  }
  applyStrandDisplayVisibility();
  renderLockList();
  updateCount();
}

document.querySelector("#deleteLock").addEventListener("click", () => {
  deleteSelectedStrands();
});

function disposeCurveObjects(lock) {
  if (!lock.curveObjects) return;
  lock.curveObjects.line.geometry.dispose();
  lock.curveObjects.line.material.dispose();
  lock.curveObjects.handles.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  lock.curveObjects.arrows.forEach((arrow) => {
    arrow.children.forEach((part) => {
      part.geometry?.dispose();
      part.material?.dispose();
    });
  });
  boneViewHandles.disposeBoneViewHandles(lock.curveObjects);
  if (lock.curveObjects.surfaceObjectAnchorHandle) {
    lock.curveObjects.surfaceObjectAnchorHandle.geometry.dispose();
    lock.curveObjects.surfaceObjectAnchorHandle.material.dispose();
  }
  if (lock.curveObjects.surfaceObjectAnchorStem) {
    lock.curveObjects.surfaceObjectAnchorStem.geometry.dispose();
    lock.curveObjects.surfaceObjectAnchorStem.material.dispose();
  }
  [
    ...(lock.curveObjects.widthEdgeLines || []),
    ...(lock.curveObjects.depthEdgeLines || []),
    ...(lock.curveObjects.uniformEdgeLines || [])
  ].forEach((edge) => {
    edge.geometry.dispose();
    edge.material.dispose();
  });
  lock.curveObjects.edgePickers?.forEach((edge) => {
    edge.geometry.dispose();
    edge.material.dispose();
  });
}


// 把 gizmo 的旋转增量应用到 tip 子骨骼链：从被选中链点到链尾绕该点旋转
// （dq = startQuaternion⁻¹ × handle.quaternion，每次用总增量避免累积）。




orthographicViewToggle.addEventListener("click", () => setOrthographicView(!viewportState.state.orthographicView));
multiCameraViewToggle.addEventListener("click", () => setMultiCameraEnabled(!multiCameraState.state.enabled));
Object.entries(multiCameraPreviewContainers).forEach(([view, container]) => {
  const activateMultiCameraView = (event) => {
    if (!multiCameraState.state.enabled || view === multiCameraState.state.activeView) return;
    event.preventDefault();
    event.stopPropagation();
    setMultiCameraActiveView(view);
  };
  container.addEventListener("pointerdown", activateMultiCameraView);
  container.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") activateMultiCameraView(event);
  });
});

document.querySelector("#toggleWire").addEventListener("click", () => {
  hairState.state.hairTopologyVisible = !hairState.state.hairTopologyVisible;
  locks.forEach((lock) => {
    if (!lock.wireOverlay) return;
    if (hairState.state.hairTopologyVisible) {
      lock.wireOverlay.geometry.dispose();
      lock.wireOverlay.geometry = createHairTopologyGeometry(lock.mesh.geometry);
    }
    syncLockedStrandWireVisual(lock);
  });
  const button = document.querySelector("#toggleWire");
  button.classList.toggle("active", hairState.state.hairTopologyVisible);
  button.setAttribute("aria-pressed", String(hairState.state.hairTopologyVisible));
});

document.querySelector("#exportObj").addEventListener("click", fileApi.exportHairObj);
document.querySelector("#exportUsda").addEventListener("click", fileApi.exportHairUsda);
document.querySelector("#quickExportProject").addEventListener("click", fileApi.exportHairProjectQuickly);


function resize() {
  const { clientWidth, clientHeight } = viewport;
  updateCameraProjectionForViewport();
  const paneMetrics = multiCameraPaneMetrics();
  const mainWidth = multiCameraState.state.enabled
    ? multiCameraViewPaneWidth(multiCameraState.state.activeView, paneMetrics)
    : clientWidth;
  const mainHeight = multiCameraState.state.enabled ? paneMetrics.height : clientHeight;
  renderer.setSize(Math.max(1, Math.round(mainWidth)), Math.max(1, Math.round(mainHeight)), false);
  if (multiCameraState.state.enabled) {
    viewportPanel.style.setProperty("--multi-camera-split-x", `${paneMetrics.leftWidth}px`);
    const previewRenderers = ensureMultiCameraPreviewRenderers();
    Object.entries(previewRenderers).forEach(([view, previewRenderer]) => {
      const paneWidth = multiCameraViewPaneWidth(view, paneMetrics);
      previewRenderer.setSize(Math.max(1, Math.round(paneWidth)), Math.max(1, Math.round(paneMetrics.height)), false);
    });
    syncMultiCameraPreviewCameras();
  }
  updateSculptBrushDockCompact();
  referenceImages
    .filter((reference) => reference.type === "overlay")
    .forEach(referenceHeadApi.applyReferenceImageRuntime);
  syncViewportTopControlRows();
  invalidateUvInspector();
}

function handleViewportPointerMove(event) {
  if (sculptState.state.proportionalHotkeyPress && !sculptState.state.proportionalHotkeyPress.wasEnabled && !sculptState.state.proportionalHotkeyPress.activatedByHold) {
    const dx = event.clientX - sculptState.state.proportionalHotkeyPress.startX;
    const dy = event.clientY - sculptState.state.proportionalHotkeyPress.startY;
    if (Math.hypot(dx, dy) >= 3) activateProportionalHotkeyHold();
  }
  lastPointer.x = event.clientX;
  lastPointer.y = event.clientY;
  updateProportionalSizeEdit(event);
}

function blockProportionalSizingEvent(event) {
  if (!sculptState.state.proportionalSizeEdit && !sculptState.state.proportionalHotkeyPress) return;
  event.preventDefault();
  event.stopPropagation();
}

function updateLightAngleFromInputs() {
  const azimuth = THREE.MathUtils.degToRad(Number(lightAzimuthInput.value));
  const elevation = THREE.MathUtils.degToRad(Number(lightElevationInput.value));
  const horizontalDistance = keyLightDistance * Math.cos(elevation);
  keyLight.position.set(
    horizontalDistance * Math.sin(azimuth),
    keyLightDistance * Math.sin(elevation),
    horizontalDistance * Math.cos(azimuth)
  );
  animeAnisotropicLightDirection.copy(keyLight.position).normalize();
  lightAzimuthValue.textContent = String(Math.round(Number(lightAzimuthInput.value)));
  lightElevationValue.textContent = String(Math.round(Number(lightElevationInput.value)));
}

function startViewSnap(pointerId, startX, startY) {
  if (sculptState.state.viewSnapDrag) return false;
  const dampingEnabled = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = dampingEnabled;
  const offset = camera.position.clone().sub(controls.target);
  const startAxis = nearestCardinalAxis(offset);
  const baseHorizontalAxis = Math.abs(startAxis.y) > 0.5
    ? miscState.state.lastHorizontalViewAxis.clone()
    : startAxis.clone();
  sculptState.state.viewSnapDrag = {
    pointerId,
    startX,
    startY,
    distance: offset.length(),
    startAxis,
    baseHorizontalAxis,
    currentAxisKey: cardinalAxisKey(startAxis),
    didDrag: true
  };
  ui.state.shiftSnappedViewActive = true;
  snapCameraToCardinalAxis(startAxis, sculptState.state.viewSnapDrag.distance);
  renderer.domElement.setPointerCapture?.(pointerId);
  renderer.domElement.style.cursor = "grabbing";
  sculptState.state.emptySelectionPointer = null;
  updateInteractionLocks();
  return true;
}

function beginViewSnapFromActiveOrbit() {
  const pointer = viewportState.state.activeViewportPointer;
  const activeButtonMask = viewportState.state.navigationStyle === "blender" ? 4 : 1;
  if (
    !sculptState.state.altOrbitDrag
    || !pointer
    || sculptState.state.altOrbitDrag.pointerId !== pointer.pointerId
    || !(pointer.buttons & activeButtonMask)
    || sculptState.state.viewSnapDrag
  ) return false;
  if (
    sculptState.state.transformDragging || sculptState.state.relaxEdit || sculptState.state.proportionalSizeEdit || sculptState.state.proportionalHotkeyPress ||
    scalpState.state.scalpLatticeDrag || scalpState.state.scalpPaintDrag || sculptState.state.viewPlaneMoveDrag || sculptState.state.placeEdit || sculptState.state.drawStrandStroke
  ) return false;
  return startViewSnap(pointer.pointerId, pointer.x, pointer.y);
}

function trackViewportPointerDown(event) {
  const buttonMask = event.button === 0
    ? 1
    : viewportState.state.navigationStyle === "blender" && event.button === 1
      ? 4
      : 0;
  if (!buttonMask) return;
  viewportState.state.activeViewportPointer = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    buttons: event.buttons,
    buttonMask
  };
}

function trackViewportPointerMove(event) {
  if (!viewportState.state.activeViewportPointer || viewportState.state.activeViewportPointer.pointerId !== event.pointerId) return;
  viewportState.state.activeViewportPointer.x = event.clientX;
  viewportState.state.activeViewportPointer.y = event.clientY;
  viewportState.state.activeViewportPointer.buttons = event.buttons;
  if (!(event.buttons & viewportState.state.activeViewportPointer.buttonMask)) viewportState.state.activeViewportPointer = null;
}

function clearViewportPointer(event) {
  if (!viewportState.state.activeViewportPointer || viewportState.state.activeViewportPointer.pointerId !== event.pointerId) return;
  viewportState.state.activeViewportPointer = null;
}

function updateViewSnap(event) {
  if (!sculptState.state.viewSnapDrag || event.pointerId !== sculptState.state.viewSnapDrag.pointerId) return;
  const dx = event.clientX - sculptState.state.viewSnapDrag.startX;
  const dy = event.clientY - sculptState.state.viewSnapDrag.startY;
  if (!sculptState.state.viewSnapDrag.didDrag && Math.hypot(dx, dy) < 3) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (!sculptState.state.viewSnapDrag.didDrag) {
    sculptState.state.viewSnapDrag.didDrag = true;
    ui.state.shiftSnappedViewActive = true;
    snapCameraToCardinalAxis(sculptState.state.viewSnapDrag.startAxis, sculptState.state.viewSnapDrag.distance);
    sculptState.state.viewSnapDrag.currentAxisKey = cardinalAxisKey(sculptState.state.viewSnapDrag.startAxis);
  }

  const horizontalStep = steppedDragAmount(dx);
  const verticalStep = steppedDragAmount(dy);
  let axis = sculptState.state.viewSnapDrag.startAxis;
  if (Math.abs(dy) > Math.abs(dx) && verticalStep !== 0) {
    axis = new THREE.Vector3(0, verticalStep > 0 ? 1 : -1, 0);
  } else if (horizontalStep !== 0) {
    axis = sculptState.state.viewSnapDrag.baseHorizontalAxis.clone().applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -horizontalStep * Math.PI * 0.5
    );
  }

  const axisKey = cardinalAxisKey(axis);
  ui.state.shiftSnappedViewActive = true;
  snapCameraToCardinalAxis(axis, sculptState.state.viewSnapDrag.distance);
  sculptState.state.viewSnapDrag.currentAxisKey = axisKey;
  event.preventDefault();
  event.stopImmediatePropagation();
}

function nearestCardinalAxis(direction) {
  direction = direction.clone().normalize();
  const absolute = new THREE.Vector3(Math.abs(direction.x), Math.abs(direction.y), Math.abs(direction.z));
  const axis = new THREE.Vector3();
  if (absolute.y >= absolute.x && absolute.y >= absolute.z) {
    axis.set(0, Math.sign(direction.y) || 1, 0);
  } else if (absolute.x >= absolute.z) {
    axis.set(Math.sign(direction.x) || 1, 0, 0);
  } else {
    axis.set(0, 0, Math.sign(direction.z) || 1);
  }
  return axis;
}

function cardinalAxisKey(axis) {
  return `${Math.round(axis.x)},${Math.round(axis.y)},${Math.round(axis.z)}`;
}

function steppedDragAmount(delta) {
  const distance = Math.abs(delta);
  if (distance < CARDINAL_VIEW_DRAG_GRACE) return 0;
  return Math.sign(delta) * (1 + Math.floor((distance - CARDINAL_VIEW_DRAG_GRACE) / CARDINAL_VIEW_DRAG_STEP));
}

function snapCameraToCardinalAxis(axis, distance) {
  axis = nearestCardinalAxis(axis);
  if (Math.abs(axis.y) > 0.5) {
    camera.up.set(0, 0, axis.y > 0 ? -1 : 1);
  } else {
    camera.up.set(0, 1, 0);
    miscState.state.lastHorizontalViewAxis.copy(axis);
  }
  camera.position.copy(controls.target).addScaledVector(axis, distance);
  camera.lookAt(controls.target);
  const dampingEnabled = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = dampingEnabled;
}

function endViewSnap(event) {
  if (!sculptState.state.viewSnapDrag || (event?.pointerId !== undefined && event.pointerId !== sculptState.state.viewSnapDrag.pointerId)) return;
  const { pointerId } = sculptState.state.viewSnapDrag;
  sculptState.state.viewSnapDrag = null;
  if (renderer.domElement.hasPointerCapture?.(pointerId)) renderer.domElement.releasePointerCapture(pointerId);
  renderer.domElement.style.cursor = "";
  updateInteractionLocks();
  event?.preventDefault();
}

const CAMERA_VIEW_AXES = Object.freeze({
  front: new THREE.Vector3(0, 0, 1),
  back: new THREE.Vector3(0, 0, -1),
  left: new THREE.Vector3(-1, 0, 0),
  right: new THREE.Vector3(1, 0, 0),
  top: new THREE.Vector3(0, 1, 0),
  bottom: new THREE.Vector3(0, -1, 0)
});

function updateCameraViewCube() {
  const offset = camera.position.clone().sub(controls.target);
  if (offset.lengthSq() < 0.000001) return;
  offset.normalize();
  const yaw = Math.atan2(offset.x, offset.z);
  const pitch = Math.atan2(offset.y, Math.hypot(offset.x, offset.z));
  cameraViewCubeModel.style.transform = `rotateX(${-pitch}rad) rotateY(${-yaw}rad)`;

  const activeAxisKey = cardinalAxisKey(nearestCardinalAxis(offset));
  cameraViewCubeFaces.forEach((face) => {
    const axis = CAMERA_VIEW_AXES[face.dataset.cameraView];
    const active = Boolean(axis && cardinalAxisKey(axis) === activeAxisKey);
    face.classList.toggle("active", active);
    if (active) face.setAttribute("aria-current", "true");
    else face.removeAttribute("aria-current");
  });
}

function activateView(event) {
  if (multiCameraOrthographicViewActive()) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const face = event.currentTarget;
  const axis = CAMERA_VIEW_AXES[face?.dataset?.cameraView];
  if (!axis) return;
  const distance = Math.max(0.01, camera.position.distanceTo(controls.target));
  ui.state.shiftSnappedViewActive = true;
  snapCameraToCardinalAxis(axis, distance);
  updateCameraViewCube();
  event.preventDefault();
  event.stopPropagation();
}

cameraViewCubeFaces.forEach((face) => {
  face.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  face.addEventListener("click", activateView);
});

function activateStrandControlPoint(handle, event) {
  if (!componentEditModeActive()) return false;
  if (!handle?.userData?.lockId) return false;
  if (locks.find((lock) => lock.id === handle.userData.lockId)?.locked) return false;
  if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
    addStrandControlPointSelection(handle);
    return true;
  }
  if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
    removeStrandControlPointSelection(handle.userData.lockId, handle.userData.pointIndex);
    return true;
  }
  const preserveMulti = sel.state.selectedControlPoints.length > 1
    && guideApi.controlPointIsSelected("strand", handle.userData.lockId, handle.userData.pointIndex);
  transformControls.detach();
  sculptState.state.activeHandleEdit = null;
  sculptState.state.transformDragging = false;
  updateInteractionLocks();
  if (!preserveMulti) {
    const keepIndividualMember = handle.userData.lockId === sel.state.selectedId && !sel.state.clumpViewportSelection;
    selectLock(handle.userData.lockId, { individualClumpMember: keepIndividualMember });
  } else {
    applyStrandSelectionState(activateStrandSelection(
      currentStrandSelectionState(),
      handle.userData.lockId
    ));
  }
  selectCurvePoint(handle.userData.lockId, handle.userData.pointIndex, preserveMulti);
  if (getSelectedLock()?.geometryType === "surface" && ["rotate", "scale"].includes(sel.state.activeTool)) {
    setActiveTool("move");
  }
  if (sel.state.activeTool === "select") {
    transformControls.detach();
    return true;
  }
  if (sel.state.activeTool === "relax") {
    const lock = getSelectedLock();
    if (lock && beginRelaxEdit(lock, handle.userData.pointIndex, event)) event.preventDefault();
    return true;
  }
  if (sel.state.activeTool === "move" && viewPlaneMoveActiveForView()) {
    beginViewPlaneMove(getSelectedLock(), handle, event);
    return true;
  }
  configureTransformControls(sel.state.activeTool);
  attachTransformForCurvePoint(getSelectedLock(), handle.userData.pointIndex, handle);
  beginHandleEdit();
  return true;
}

function refreshStrandControlPointSelection(lock) {
  const primary = sel.state.selectedControlPoints.find((point) => (
    point.type === "strand" && point.lockId === lock.id
  )) || null;
  sel.state.selectedPoint = primary ? { lockId: primary.lockId, pointIndex: primary.pointIndex } : null;
  sel.state.selectedSurfaceObjectAnchorId = null;
  sel.state.selectedCurveLatticePoint = null;
  transformControls.detach();
  sculptState.state.activeHandleEdit = null;
  sculptState.state.transformDragging = false;
  if (sculptState.state.proportionalEditing) updateLockGeometry(lock);
  locks.forEach((item) => updateCurveObjects(item, { visible: item.id === sel.state.selectedId }));

  if (primary && ["move", "rotate", "scale"].includes(sel.state.activeTool)) {
    const primaryHandle = lock.curveObjects?.handles[primary.pointIndex];
    if (primaryHandle && !(sel.state.activeTool === "move" && viewPlaneMoveActiveForView())) {
      configureTransformControls(sel.state.activeTool);
      attachTransformForCurvePoint(lock, primary.pointIndex, primaryHandle);
    }
  }
  updateSelectedPointLabel();
  updateViewPlaneGrid();
  guideApi.updateViewportToolVisibility();
  updateInteractionLocks();
  placementApi.updatePlacementStatus();
}

function addStrandControlPointSelection(handle) {
  const lockId = handle?.userData?.lockId;
  const pointIndex = handle?.userData?.pointIndex;
  const lock = locks.find((item) => item.id === lockId);
  if (!lock || pointIndex === undefined || lock.id !== sel.state.selectedId) return false;

  const selectionIndex = sel.state.selectedControlPoints.findIndex((point) => (
    point.type === "strand"
    && point.lockId === lockId
    && point.pointIndex === pointIndex
  ));
  if (selectionIndex >= 0) return true;
  sel.state.selectedControlPoints.push({ type: "strand", lockId, pointIndex });
  refreshStrandControlPointSelection(lock);
  return true;
}

function removeStrandControlPointSelection(lockId, pointIndex) {
  const lock = locks.find((item) => item.id === lockId);
  if (!lock || lock.id !== sel.state.selectedId) return false;
  const selectionIndex = sel.state.selectedControlPoints.findIndex((point) => (
    point.type === "strand"
    && point.lockId === lockId
    && point.pointIndex === pointIndex
  ));
  if (selectionIndex < 0) return false;
  sel.state.selectedControlPoints.splice(selectionIndex, 1);
  refreshStrandControlPointSelection(lock);
  return true;
}

function sampleStrandPointNormal(normals, t) {
  if (!normals?.length) return null;
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * Math.max(0, normals.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(normals.length - 1, lower + 1);
  const before = normals[lower] || normals[upper];
  const after = normals[upper] || before;
  return before?.clone().lerp(after, scaled - lower).normalize() || null;
}

function sampleStrandPointVectors(points, parameters) {
  if (!points?.length || !parameters?.length) return [];
  const curve = new THREE.CatmullRomCurve3(points.map((point) => point.clone()));
  return parameters.map((t) => curve.getPoint(t));
}

function remapStrandPointSelectionAfterRemoval(lockId, removedIndex) {
  sel.state.selectedControlPoints = sel.state.selectedControlPoints.flatMap((point) => {
    if (point.type !== "strand" || point.lockId !== lockId) return [point];
    if (point.pointIndex === removedIndex) return [];
    return [{
      ...point,
      pointIndex: point.pointIndex > removedIndex ? point.pointIndex - 1 : point.pointIndex
    }];
  });
}

function resampleStrandCurveData(lock, parameters) {
  const originalPoints = lock.points.map((point) => point.clone());
  const originalWidths = [...lock.pointWidths];
  const originalScales = lock.pointScales.map((scale) => ({ ...scale }));
  const originalTwists = [...lock.pointTwists];
  const originalNormals = lock.pointSurfaceNormals?.map((normal) => normal?.clone() || null) || [];
  const resampleMatchingVectors = (points) => (
    points?.length === originalPoints.length
      ? sampleStrandPointVectors(points, parameters)
      : points
  );

  lock.points = sampleStrandPointVectors(originalPoints, parameters);
  lock.pointWidths = parameters.map((t) => sampleArray(originalWidths, t, 1));
  lock.pointScales = parameters.map((t) => ({
    x: sampleScale(originalScales, t, "x"),
    z: sampleScale(originalScales, t, "z")
  }));
  lock.pointTwists = parameters.map((t) => sampleArray(originalTwists, t));
  lock.pointSurfaceNormals = originalNormals.length
    ? parameters.map((t) => sampleStrandPointNormal(originalNormals, t))
    : [];
  lock.groupLatticeBasePoints = resampleMatchingVectors(lock.groupLatticeBasePoints);
  lock.clumpRestPoints = resampleMatchingVectors(lock.clumpRestPoints);
  lock.clumpGuideRestPoints = resampleMatchingVectors(lock.clumpGuideRestPoints);
  if (lock.clumpRestTwists?.length === originalPoints.length) {
    lock.clumpRestTwists = parameters.map((t) => sampleArray(lock.clumpRestTwists, t));
  }
  if (lock.clumpGuideRestTwists?.length === originalPoints.length) {
    lock.clumpGuideRestTwists = parameters.map((t) => sampleArray(lock.clumpGuideRestTwists, t));
  }
  if (lock.clumpRestScales?.length === originalPoints.length) {
    lock.clumpRestScales = parameters.map((t) => ({
      x: sampleScale(lock.clumpRestScales, t, "x"),
      z: sampleScale(lock.clumpRestScales, t, "z")
    }));
  }
  if (lock.clumpGuideRestScales?.length === originalPoints.length) {
    lock.clumpGuideRestScales = parameters.map((t) => ({
      x: sampleScale(lock.clumpGuideRestScales, t, "x"),
      z: sampleScale(lock.clumpGuideRestScales, t, "z")
    }));
  }
}

function finishStrandCurveTopologyChange(lock) {
  clumpProceduralApi.commitClumpMemberRestState(lock);
  syncLockFromCurve(lock);
  rebuildCurveObjects(lock);
  updateLockGeometry(lock, { immediate: true });
  syncActiveMirror(lock, { refreshUi: true });
  refreshStrandControlPointSelection(lock);
  syncInputs(lock);
  updateCount();
}

function removeStrandCurvePoint(lockId, pointIndex) {
  const lock = locks.find((item) => item.id === lockId);
  if (!lock || ["poly", "surface", "curve-surface"].includes(lock.geometryType)) return false;
  const plan = curvePointRemovalPlan(lock.points.length, pointIndex);
  if (!plan) return false;

  pushUndoState();
  resampleStrandCurveData(lock, plan.parameters);
  remapStrandPointSelectionAfterRemoval(lock.id, pointIndex);
  finishStrandCurveTopologyChange(lock);
  return true;
}

function closestStrandCurveParameter(lock, point) {
  const curve = new THREE.CatmullRomCurve3(lock.points);
  let bestT = 0;
  let bestDistance = Infinity;
  const sampleCount = Math.max(80, lock.points.length * 20);
  for (let index = 0; index <= sampleCount; index += 1) {
    const t = index / sampleCount;
    const distance = curve.getPoint(t).distanceToSquared(point);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestT = t;
    }
  }
  let radius = 1 / sampleCount;
  for (let pass = 0; pass < 4; pass += 1) {
    const candidates = [bestT - radius, bestT - radius * 0.5, bestT, bestT + radius * 0.5, bestT + radius];
    candidates.forEach((candidate) => {
      const t = THREE.MathUtils.clamp(candidate, 0, 1);
      const distance = curve.getPoint(t).distanceToSquared(point);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestT = t;
      }
    });
    radius *= 0.35;
  }
  return bestT;
}

function insertStrandCurvePoint(lockId, parameter) {
  const lock = locks.find((item) => item.id === lockId);
  if (!lock || ["poly", "surface", "curve-surface"].includes(lock.geometryType)) return false;
  const plan = curvePointInsertionPlan(lock.points.length, parameter);
  if (!plan) return false;

  pushUndoState();
  resampleStrandCurveData(lock, plan.parameters);
  sel.state.selectedControlPoints = [{
    type: "strand",
    lockId: lock.id,
    pointIndex: plan.insertionIndex
  }];
  finishStrandCurveTopologyChange(lock);
  return true;
}

function curvePointTopologyCursorAvailable() {
  const lock = sculptState.state.viewportEditMode === "strand" && componentEditModeActive() ? getSelectedLock() : null;
  return Boolean(
    lock
    && lock.curveObjects?.group.visible
    && !["poly", "surface", "curve-surface"].includes(lock.geometryType)
    && selectionModifierCursorAvailable()
  );
}

function selectionModifierCursorAvailable() {
  return Boolean(
    sculptState.state.viewportEditMode === "strand"
    && ["select", "move", "rotate", "scale", "relax", "poly"].includes(sel.state.activeTool)
    && !sculptState.state.duplicatePlacement
    && !sculptState.state.transformDragging
    && !sculptState.state.altOrbitDrag
    && !sculptState.state.proportionalSizeEdit
    && !sculptState.state.proportionalHotkeyPress
    && !scalpState.state.scalpShapeEditing
    && !scalpState.state.scalpPaintEditing
    && !scalpState.state.scalpBuilderEditing
    && !sculptState.state.capsuleGuideEditing
  );
}

function clearCurvePointTopologyCursor() {
  renderer.domElement.classList.remove(
    "curve-point-insert-cursor",
    "curve-point-remove-cursor"
  );
}

function updateCurvePointTopologyCursor(event) {
  const selectionAvailable = selectionModifierCursorAvailable();
  const topologyAvailable = curvePointTopologyCursorAvailable();
  const polyModifiers = sel.state.activeTool === "poly";
  const marqueeAdding = sculptState.state.selectionMarqueeDrag?.selectionMode === "add";
  const marqueeRemoving = sculptState.state.selectionMarqueeDrag?.selectionMode === "remove";
  const inserting = marqueeAdding || (!event.metaKey && (polyModifiers
    ? event.ctrlKey && !event.shiftKey && !event.altKey && selectionAvailable
    : (
      event.shiftKey && !event.ctrlKey && !event.altKey && selectionAvailable
      || event.shiftKey && !event.ctrlKey && event.altKey && topologyAvailable
    )));
  const removing = marqueeRemoving || (!event.metaKey && (polyModifiers
    ? event.altKey && !event.shiftKey && !event.ctrlKey && selectionAvailable
    : (
      event.ctrlKey && !event.shiftKey && !event.altKey && selectionAvailable
      || event.shiftKey && event.ctrlKey && !event.altKey && topologyAvailable
    )));
  renderer.domElement.classList.toggle("curve-point-insert-cursor", inserting);
  renderer.domElement.classList.toggle("curve-point-remove-cursor", removing);
}


function finishCurvePointInsertion(event) {
  const candidate = sculptState.state.curvePointInsertionCandidate;
  if (!candidate || event.pointerId !== candidate.pointerId) return;
  sculptState.state.curvePointInsertionCandidate = null;
  if (
    !event.shiftKey
    || !event.altKey
    || event.ctrlKey
    || Math.hypot(event.clientX - candidate.startX, event.clientY - candidate.startY) >= 4
  ) return;
  if (insertStrandCurvePoint(candidate.lockId, candidate.parameter)) {
    event.preventDefault();
  }
}

function finishPointRemoval(event) {
  const candidate = sculptState.state.pointRemovalCandidate;
  if (!candidate || event.pointerId !== candidate.pointerId) return;
  sculptState.state.pointRemovalCandidate = null;
  if (
    (candidate.selectionOnly
      ? !event.altKey || event.shiftKey || event.ctrlKey
      : !event.shiftKey || !event.ctrlKey || event.altKey)
    || Math.hypot(event.clientX - candidate.startX, event.clientY - candidate.startY) >= 4
  ) return;
  const changed = candidate.selectionOnly
    ? removeStrandControlPointSelection(candidate.lockId, candidate.pointIndex)
    : removeStrandCurvePoint(candidate.lockId, candidate.pointIndex);
  if (changed) {
    event.preventDefault();
  }
}


function isHairCreateTool(tool = sel.state.activeTool) {
  return ["draw", "procedural-draw", "braid", "panel", "curve-surface", "surface-loft", "place", "draw-capsule-guide"].includes(tool);
}

function syncStrandHoverOutline(lock) {
  if (!lock?.hoverOutline) return;
  lock.hoverOutline.visible = Boolean(
    hairState.state.hoveredStrandId === lock.id
    && !isHairCreateTool()
    && sculptState.state.viewportEditMode === "strand"
    && lock.id !== sel.state.selectedId
    && strandVisibleForDisplay(lock)
    && !lock.locked
  );
}

// 鼠标在浮动面板（taperCurveEditor）上时不触发后面头发/发尖的高亮。
function pointerOverTaperEditor(event) {
  if (!taperCurveEditor.open) return false;
  const rect = taperCurveEditor.getBoundingClientRect();
  return event.clientX >= rect.left && event.clientX <= rect.right
    && event.clientY >= rect.top && event.clientY <= rect.bottom;
}

function updateStrandBrushHover(event) {
  if (pointerOverTaperEditor(event) || isHairCreateTool() || sculptState.state.viewportEditMode !== "strand") {
    if (hairState.state.hoveredStrandId) {
      hairState.state.hoveredStrandId = null;
      locks.forEach(syncStrandHoverOutline);
    }
    return;
  }
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const targets = locks.filter((lock) => strandAvailableForViewportInteraction(lock) && lock.mesh);
  const hit = raycaster.intersectObjects(targets.map((lock) => lock.mesh), false)[0];
  const id = hit?.object?.userData?.lockId || null;
  if (hairState.state.hoveredStrandId !== id) {
    hairState.state.hoveredStrandId = id;
    locks.forEach(syncStrandHoverOutline);
  }
}




function strandControlPointHit(event, lock = getSelectedLock()) {
  return strandControlPointHitFromEvent(event, lock);
}

function beginStrandWidthEdgeDrag(event) {
  if (
    event.button !== 0
    || event.shiftKey
    || event.ctrlKey
    || event.altKey
    || event.metaKey
    || sculptState.state.viewportEditMode !== "strand"
    || !["select", "move"].includes(sel.state.activeTool)
    || sculptState.state.transformDragging
    || pointerHitsTransformGizmo(event)
  ) return;
  const lock = getSelectedLock();
  if (strandControlPointHit(event, lock)) return;
  const edges = lock?.curveObjects?.widthEdgeLines?.filter((edge) => (
    edge.visible && (edge.geometry?.getAttribute("position")?.count || 0) >= 2
  )) || [];
  if (!edges.length) return;
  rayFromViewportEvent(event);
  const hit = raycaster.intersectObjects(edges, false)[0];
  if (!hit) return;
  const side = Number(hit.object.userData.side) < 0 ? -1 : 1;
  const sample = strandWidthEdgeSample(lock, 0.5, side);
  if (!sample) return;
  const sideAxis = sample.edge.clone().sub(sample.center);
  const halfExtent = sideAxis.length();
  if (halfExtent < 0.0001) return;
  sideAxis.normalize();
  const rect = renderer.domElement.getBoundingClientRect();
  const centerPixel = sculptGeom.viewportPixelPoint(sample.center, rect);
  const axisPixel = sculptGeom.viewportPixelPoint(sample.center.clone().add(sideAxis), rect).sub(centerPixel);
  const pixelsPerWorld = axisPixel.length();
  if (pixelsPerWorld < 0.001) return;
  const startWidth = sculptGeom.editableStrandWidth(lock);
  const widthTargets = selectedLocksInOrder().filter((item) => item.geometryType !== "poly");
  if (!widthTargets.includes(lock)) widthTargets.unshift(lock);
  pushUndoState();
  sculptState.state.strandWidthEdgeDrag = {
    pointerId: event.pointerId,
    lockId: lock.id,
    side,
    startX: event.clientX,
    startY: event.clientY,
    startWidth,
    startWidthState: {
      width: lock.width,
      baseWidth: lock.baseWidth,
      widthScale: lock.widthScale,
      braidWidth: lock.braidWidth
    },
    startPoints: lock.geometryType === "surface"
      ? lock.points.map((point) => point.clone())
      : null,
    targetSnapshots: widthTargets.map((item) => ({
      lockId: item.id,
      startWidth: sculptGeom.editableStrandWidth(item),
      startWidthState: {
        width: item.width,
        baseWidth: item.baseWidth,
        widthScale: item.widthScale,
        braidWidth: item.braidWidth
      },
      startPoints: item.geometryType === "surface"
        ? item.points.map((point) => point.clone())
        : null
    })),
    screenAxis: axisPixel.normalize(),
    pixelsPerWorld,
    edgeScale: halfExtent / Math.max(0.0001, startWidth * 0.5)
  };
  renderer.domElement.setPointerCapture?.(event.pointerId);
  renderer.domElement.style.cursor = "ew-resize";
  updateCurveObjects(lock, { visible: true });
  updateInteractionLocks();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function updateStrandWidthEdgeDrag(event) {
  const drag = sculptState.state.strandWidthEdgeDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const lock = locks.find((item) => item.id === drag.lockId);
  if (!lock) return;
  const pointerDelta = new THREE.Vector2(
    event.clientX - drag.startX,
    event.clientY - drag.startY
  );
  const worldDelta = pointerDelta.dot(drag.screenAxis) / drag.pixelsPerWorld;
  const nextWidth = drag.startWidth + worldDelta * 2 / Math.max(0.0001, drag.edgeScale);
  const widthDelta = nextWidth - drag.startWidth;
  const targetSnapshots = drag.targetSnapshots?.length ? drag.targetSnapshots : [{
    lockId: lock.id,
    startWidth: drag.startWidth,
    startPoints: drag.startPoints
  }];
  const targetIds = new Set(targetSnapshots.map((snapshot) => snapshot.lockId));
  targetSnapshots.forEach((snapshot) => {
    const target = locks.find((item) => item.id === snapshot.lockId);
    if (!target) return;
    sculptGeom.applyEditableStrandWidth(target, snapshot.startWidth + widthDelta, snapshot);
    syncLockFromCurve(target);
    updateLockGeometry(target, { immediate: true });
    updateCurveObjects(target, { visible: target.id === sel.state.selectedId });
    const partner = mirrorPartnerFor(target);
    if (!partner || !targetIds.has(partner.id)) syncActiveMirror(target);
  });
  syncInputs(lock);
  updateTopologyStats();
  event.preventDefault();
  event.stopImmediatePropagation();
}

function finishStrandWidthEdgeDrag(event, { cancel = false } = {}) {
  const drag = sculptState.state.strandWidthEdgeDrag;
  if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
  const lock = locks.find((item) => item.id === drag.lockId);
  sculptState.state.strandWidthEdgeDrag = null;
  const targetSnapshots = drag.targetSnapshots?.length ? drag.targetSnapshots : [{
    lockId: drag.lockId,
    startWidthState: drag.startWidthState,
    startPoints: drag.startPoints
  }];
  if (cancel) targetSnapshots.forEach((snapshot) => {
    const target = locks.find((item) => item.id === snapshot.lockId);
    if (!target) return;
    Object.assign(target, snapshot.startWidthState);
    if (snapshot.startPoints) snapshot.startPoints.forEach((point, index) => target.points[index].copy(point));
  });
  if (renderer.domElement.hasPointerCapture?.(drag.pointerId)) {
    renderer.domElement.releasePointerCapture(drag.pointerId);
  }
  renderer.domElement.style.cursor = "";
  const targetIds = new Set(targetSnapshots.map((snapshot) => snapshot.lockId));
  targetSnapshots.forEach((snapshot) => {
    const target = locks.find((item) => item.id === snapshot.lockId);
    if (!target) return;
    syncLockFromCurve(target);
    updateLockGeometry(target, { immediate: true });
    updateCurveObjects(target, { visible: target.id === sel.state.selectedId });
    const partner = mirrorPartnerFor(target);
    if (!partner || !targetIds.has(partner.id)) syncActiveMirror(target, { refreshUi: true });
  });
  if (lock) {
    syncInputs(lock);
    updateTopologyStats();
    renderLockList();
  }
  updateInteractionLocks();
  event?.preventDefault();
  event?.stopImmediatePropagation();
}

function setHoveredStrandWidthEdge(edge = null) {
  if (hairState.state.hoveredStrandWidthEdge === edge) return;
  const previous = hairState.state.hoveredStrandWidthEdge;
  hairState.state.hoveredStrandWidthEdge = edge;
  [previous, hairState.state.hoveredStrandWidthEdge].filter(Boolean).forEach((item) => {
    const active = sculptState.state.strandWidthEdgeDrag?.lockId === item.userData.lockId
      && sculptState.state.strandWidthEdgeDrag.side === item.userData.side;
    const hovered = hairState.state.hoveredStrandWidthEdge === item;
    item.material.color.set(active || hovered ? 0xff42cf : 0xe7a95d);
    item.material.opacity = active ? 0.95 : hovered ? 0.82 : 0.22;
  });
}

function updateStrandWidthEdgeHover(event) {
  if (sculptState.state.strandWidthEdgeDrag || pointerHitsTransformGizmo(event)) {
    setHoveredStrandWidthEdge(null);
    return;
  }
  const lock = sculptState.state.viewportEditMode === "strand" ? getSelectedLock() : null;
  if (strandControlPointHit(event, lock)) {
    setHoveredStrandWidthEdge(null);
    if (renderer.domElement.style.cursor === "ew-resize") renderer.domElement.style.cursor = "";
    return;
  }
  const edges = lock?.curveObjects?.widthEdgeLines?.filter((edge) => (
    edge.visible && (edge.geometry?.getAttribute("position")?.count || 0) >= 2
  )) || [];
  if (!edges.length) {
    setHoveredStrandWidthEdge(null);
    if (renderer.domElement.style.cursor === "ew-resize") renderer.domElement.style.cursor = "";
    return;
  }
  rayFromViewportEvent(event);
  const edge = raycaster.intersectObjects(edges, false)[0]?.object || null;
  setHoveredStrandWidthEdge(edge);
  if (edge) renderer.domElement.style.cursor = "ew-resize";
  else if (renderer.domElement.style.cursor === "ew-resize") renderer.domElement.style.cursor = "";
}

const controlPointHoverOverlay = new THREE.Mesh(
  new THREE.BufferGeometry(),
  new THREE.MeshBasicMaterial({
    color: 0x58f6ff,
    transparent: false,
    opacity: 1,
    depthTest: false,
    depthWrite: false
  })
);
controlPointHoverOverlay.renderOrder = 30;
controlPointHoverOverlay.raycast = () => {};

function setHoveredControlPoint(handle) {
  if (handle === guideState.state.hoveredControlPoint) return;
  controlPointHoverOverlay.parent?.remove(controlPointHoverOverlay);
  guideState.state.hoveredControlPoint = handle || null;
  if (!guideState.state.hoveredControlPoint) return;
  controlPointHoverOverlay.geometry = guideState.state.hoveredControlPoint.geometry;
  controlPointHoverOverlay.material.color.copy(guideState.state.hoveredControlPoint.material.color);
  controlPointHoverOverlay.position.set(0, 0, 0);
  controlPointHoverOverlay.quaternion.identity();
  controlPointHoverOverlay.scale.setScalar(1.06);
  guideState.state.hoveredControlPoint.add(controlPointHoverOverlay);
}

function visibleControlPointHoverTargets() {
  if (
    sculptBrushToolActive()
    ||
    sculptState.state.duplicatePlacement
    || sculptState.state.transformDragging
    || scalpState.state.scalpLatticeDrag
    || scalpState.state.scalpPaintDrag
    || scalpState.state.scalpBuilderStroke
    || sculptState.state.viewPlaneMoveDrag
    || sculptState.state.drawStrandStroke
    || sculptState.state.capsuleGuideDrawStroke
    || miscState.state.loftSurfaceDraft?.activeStroke
    || sculptState.state.panelSplitDrag
    || sculptState.state.capsuleGuideLoopDrag
  ) return [];
  if (taperMeshPointsGroup.visible) return taperMeshPointsGroup.children;
  if (scalpState.state.scalpBuilderEditing) return scalpState.state.scalpBuilderCurveLattice?.handles || [];
  if (scalpState.state.scalpLatticeEditing) return scalpLatticeHandles;
  if (sculptState.state.capsuleGuideEditing) {
    const guide = guideApi.getSelectedGuide();
    return guide?.type === "capsule" && guide.handlesGroup?.visible
      ? guide.handlesGroup.children
      : [];
  }
  const targets = [];
  const lattice = sculptState.state.viewportEditMode === "guide" ? drawFlowApi.selectedCurveLatticeGuide() : null;
  if (lattice?.handlesGroup?.visible) targets.push(...lattice.handlesGroup.children);
  const lock = sculptState.state.viewportEditMode === "strand" ? getSelectedLock() : null;
  if (
    lock?.curveObjects?.group.visible
    && (sel.state.activeTool === "draw" || !["procedural-draw", "braid", "panel"].includes(sel.state.activeTool))
  ) targets.push(...lock.curveObjects.handles);
  return targets;
}

function updateControlPointHover(event) {
  const targets = visibleControlPointHoverTargets().filter((handle) => handle.visible && handle.parent?.visible !== false);
  if (!targets.length) {
    setHoveredControlPoint(null);
    return;
  }
  rayFromViewportEvent(event);
  const hoveredTarget = raycaster.intersectObjects(targets, false)[0]?.object || null;
  const hoveringSelectedScalpPoint = scalpState.state.scalpBuilderEditing
    && hoveredTarget?.userData.scalpBuilderLatticeIndex === scalpState.state.scalpBuilderCurveLattice?.selectedIndex;
  const unselectedScalpPointHasPriority = scalpState.state.scalpBuilderEditing
    && hoveredTarget
    && !hoveringSelectedScalpPoint;
  const strandPointPriorityActive = componentEditModeActive() && sculptState.state.viewportEditMode === "strand";
  const hoveringAttachedStrandPoint = strandPointPriorityActive
    && hoveredTarget === transformControls.object;
  const unselectedStrandPointHasPriority = strandPointPriorityActive
    && hoveredTarget?.userData.lockId
    && !hoveringAttachedStrandPoint;
  if (unselectedScalpPointHasPriority || unselectedStrandPointHasPriority) transformControls.axis = null;
  const pointPriorityActive = scalpState.state.scalpBuilderEditing || strandPointPriorityActive;
  const hoveringAttachedPoint = hoveringSelectedScalpPoint || hoveringAttachedStrandPoint;
  if ((!pointPriorityActive || !hoveredTarget || hoveringAttachedPoint) && pointerHitsTransformGizmo(event)) {
    setHoveredControlPoint(null);
    return;
  }
  setHoveredControlPoint(hoveredTarget);
}

window.addEventListener("resize", resize);
new ResizeObserver(syncViewportTopControlRows).observe(viewportPanel);
new ResizeObserver(invalidateUvInspector).observe(uvInspectorWindow);
syncViewportTopControlRows();
guideApi.updateGuideControlsVisibility();
updateHistoryButtons();
setObjectSpaceEditing(sculptState.state.objectSpaceEditing);
setViewPlaneMove(false);
setHierarchyEditing(false);
setProportionalEditing(false);
scalpBuilder.setScalpShapeEditing(false);
scalpBuilder.setScalpPaintEditing(false);
scalpBuilder.setScalpBuilderEditing(false);
guideApi.setCapsuleGuideEditing(false);
guideApi.updateCapsuleGuideProfilePreview();
sculptGeom.syncSculptBrushControls();
updateLightAngleFromInputs();
applyDisplayVisibilityFilters();
updateInteractionLocks();
window.addEventListener("pointermove", taperEditor.updateTaperMeshPointDrag, true);
window.addEventListener("pointermove", updateTransformScalePointer, true);
window.addEventListener("pointermove", trackViewportPointerMove);
window.addEventListener("pointermove", radialMenuApi.updateStrandRadialGesture, true);
window.addEventListener("pointermove", radialMenuApi.updateToolRadialGesture, true);
window.addEventListener("pointermove", proceduralDuplicateApi.updateDuplicatePlacement, true);
window.addEventListener("pointermove", referenceHeadApi.updateReferenceCrop, true);
window.addEventListener("pointermove", referenceHeadApi.updateReferenceOverlayDrag, true);
window.addEventListener("pointermove", sculptGeom.updateSculptMoveStroke, true);
window.addEventListener("pointermove", bonesApi.updatePanelTipHover);
window.addEventListener("pointermove", updateStrandBrushHover);
window.addEventListener("pointermove", updateBrushSizeDrag, true);
window.addEventListener("pointermove", updateStrandWidthEdgeDrag, true);
window.addEventListener("pointermove", updateViewSnap, true);
window.addEventListener("pointermove", updateViewPlaneMove);
window.addEventListener("pointermove", updateRelaxEdit);
window.addEventListener("pointermove", placementApi.updatePlaceEdit);
window.addEventListener("pointermove", drawFlowApi.updateDrawStrandStroke);
window.addEventListener("pointermove", guideApi.updateCapsuleGuideDrawStroke);
window.addEventListener("pointermove", curveSurfaceCreate.updateCurveSurfaceStroke);
window.addEventListener("pointermove", polyToolsApi.updatePolyFillPreview);
window.addEventListener("pointermove", polyToolsApi.updatePolyBrushStroke, true);
window.addEventListener("pointermove", curveSurfaceCreate.updateLoftSurfaceStroke);
window.addEventListener("pointermove", updateSelectionMarquee);
window.addEventListener("pointermove", handleViewportPointerMove);
window.addEventListener("pointermove", scalpBuilder.updateScalpLatticeDrag);
window.addEventListener("pointermove", scalpBuilder.updateScalpPaint);
window.addEventListener("pointermove", scalpBuilder.updateScalpBuilderStroke);
window.addEventListener("pointermove", bonesApi.updatePanelSplitHandleDrag);
window.addEventListener("pointermove", guideApi.updateCapsuleGuideLoopHover);
window.addEventListener("pointermove", guideApi.updateCapsuleGuideLoopDrag);
window.addEventListener("pointermove", updateHoudiniZoomDrag, true);
window.addEventListener("pointerup", endViewSnap);
window.addEventListener("pointerup", taperEditor.finishTaperMeshPointDrag, true);
window.addEventListener("pointerup", referenceHeadApi.finishReferenceCrop, true);
window.addEventListener("pointerup", referenceHeadApi.finishReferenceOverlayDrag, true);
window.addEventListener("pointerup", sculptGeom.finishSculptMoveStroke, true);
window.addEventListener("pointerup", finishBrushSizeDrag, true);
window.addEventListener("pointerup", finishStrandWidthEdgeDrag, true);
window.addEventListener("pointerup", endViewPlaneMove);
window.addEventListener("pointerup", endRelaxEdit);
window.addEventListener("pointerup", placementApi.endPlaceEdit);
window.addEventListener("pointerup", drawFlowApi.finishDrawStrandStroke);
window.addEventListener("pointerup", guideApi.finishCapsuleGuideDrawStroke);
window.addEventListener("pointerup", polyToolsApi.finishPolyBrushStroke, true);
window.addEventListener("pointerup", curveSurfaceCreate.finishLoftSurfaceStroke);
window.addEventListener("pointerup", curveSurfaceCreate.finishCurveSurfaceStroke);
// Finish Curve Surface strokes before other viewport pointer-up handlers can
// consume a captured canvas release.
renderer.domElement.addEventListener("pointerup", curveSurfaceCreate.finishCurveSurfaceStroke, true);
window.addEventListener("pointerup", scalpBuilder.endScalpLatticeDrag);
window.addEventListener("pointerup", scalpBuilder.endScalpPaint);
window.addEventListener("pointerup", scalpBuilder.finishScalpBuilderStroke);
window.addEventListener("pointerup", bonesApi.endPanelSplitHandleDrag);
window.addEventListener("pointerup", guideApi.endCapsuleGuideLoopDrag);
window.addEventListener("pointerup", finishSelectionMarquee);
window.addEventListener("pointerup", polyToolsApi.finishPolyAltDelete, true);
window.addEventListener("pointerup", finishCurvePointInsertion, true);
window.addEventListener("pointerup", finishPointRemoval, true);
window.addEventListener("pointerup", endBlenderNavigation);
window.addEventListener("pointerup", finishBrushAltClick);
window.addEventListener("pointerup", endAltOrbit);
window.addEventListener("pointerup", endHoudiniZoomDrag);
window.addEventListener("pointerup", endSelectPointerCapture);
window.addEventListener("pointercancel", endViewSnap);
window.addEventListener("pointercancel", (event) => taperEditor.finishTaperMeshPointDrag(event, { cancel: true }), true);
window.addEventListener("pointercancel", (event) => referenceHeadApi.finishReferenceCrop(event, { cancel: true }), true);
window.addEventListener("pointercancel", (event) => referenceHeadApi.finishReferenceOverlayDrag(event, { cancel: true }), true);
window.addEventListener("pointercancel", (event) => sculptGeom.finishSculptMoveStroke(event, { cancel: true }), true);
window.addEventListener("pointercancel", finishBrushSizeDrag, true);
window.addEventListener("pointercancel", (event) => finishStrandWidthEdgeDrag(event, { cancel: true }), true);
window.addEventListener("pointercancel", polyToolsApi.finishPolyBrushStroke, true);
window.addEventListener("pointercancel", () => { draw.state.polyAltDeleteCandidate = null; }, true);
window.addEventListener("pointercancel", () => { sculptState.state.curvePointInsertionCandidate = null; }, true);
window.addEventListener("pointercancel", () => { sculptState.state.pointRemovalCandidate = null; }, true);
window.addEventListener("pointercancel", endBlenderNavigation);
window.addEventListener("pointercancel", endViewPlaneMove);
window.addEventListener("pointercancel", endRelaxEdit);
window.addEventListener("pointercancel", placementApi.endPlaceEdit);
window.addEventListener("pointercancel", (event) => drawFlowApi.finishDrawStrandStroke(event, { cancel: true }));
window.addEventListener("pointercancel", (event) => guideApi.finishCapsuleGuideDrawStroke(event, { cancel: true }));
window.addEventListener("pointercancel", (event) => curveSurfaceCreate.finishLoftSurfaceStroke(event, { cancel: true }));
window.addEventListener("pointercancel", (event) => curveSurfaceCreate.finishCurveSurfaceStroke(event, { cancel: true }));
renderer.domElement.addEventListener("pointercancel", (event) => curveSurfaceCreate.finishCurveSurfaceStroke(event, { cancel: true }), true);
window.addEventListener("pointercancel", scalpBuilder.endScalpLatticeDrag);
window.addEventListener("pointercancel", scalpBuilder.endScalpPaint);
window.addEventListener("pointercancel", (event) => scalpBuilder.finishScalpBuilderStroke(event, { cancel: true }));
window.addEventListener("pointercancel", bonesApi.endPanelSplitHandleDrag);
window.addEventListener("pointercancel", guideApi.endCapsuleGuideLoopDrag);
window.addEventListener("pointercancel", () => {
  sculptState.state.emptySelectionPointer = null;
});
window.addEventListener("pointercancel", (event) => finishSelectionMarquee(event, { cancel: true }));
window.addEventListener("pointercancel", endAltOrbit);
window.addEventListener("pointercancel", endHoudiniZoomDrag);
window.addEventListener("pointercancel", endSelectPointerCapture);
window.addEventListener("pointerup", (event) => {
  if (sel.state.activeTool === "place" && placementApi.finishPlacementPointer(event)) {
    event.preventDefault();
  }
});
window.addEventListener("pointercancel", () => {
  sculptState.state.placementPointer = null;
});
window.addEventListener("pointerup", clearViewportPointer);
window.addEventListener("pointercancel", clearViewportPointer);
renderer.domElement.addEventListener("pointerdown", branchRegion.beginBranchSweepStartDrag, true);
renderer.domElement.addEventListener("pointermove", branchRegion.updateBranchSweepStartDrag);
renderer.domElement.addEventListener("pointerup", branchRegion.endBranchSweepStartDrag);
renderer.domElement.addEventListener("pointercancel", branchRegion.endBranchSweepStartDrag);
["pointerdown", "click", "dblclick"].forEach((eventName) => {
  renderer.domElement.addEventListener(eventName, blockProportionalSizingEvent, true);
});
renderer.domElement.addEventListener("pointerdown", taperEditor.beginTaperMeshPointDrag, true);
renderer.domElement.addEventListener("pointerdown", radialMenuApi.blockPointerDuringStrandRadialGesture, true);
renderer.domElement.addEventListener("pointerdown", proceduralDuplicateApi.confirmDuplicatePlacement, true);
renderer.domElement.addEventListener("pointerdown", referenceHeadApi.beginReferenceCrop, true);
referenceCropHandles.addEventListener("pointerdown", referenceHeadApi.beginReferenceCrop, true);
renderer.domElement.addEventListener("pointerdown", beginBrushSizeDrag, true);
renderer.domElement.addEventListener("pointerdown", sculptGeom.beginSculptMoveStroke, true);
renderer.domElement.addEventListener("pointerdown", beginStrandWidthEdgeDrag, true);
renderer.domElement.addEventListener("pointerdown", polyToolsApi.beginPolyBrushPointer, true);
renderer.domElement.addEventListener("pointerdown", beginBlenderNavigation, true);
renderer.domElement.addEventListener("pointerdown", trackViewportPointerDown, true);
renderer.domElement.addEventListener("pointerdown", prepareSelectPointerCapture, true);
renderer.domElement.addEventListener("pointerdown", beginHoudiniZoomDrag, true);
renderer.domElement.addEventListener("pointerdown", bonesApi.prepareCurvePointSelection, true);
renderer.domElement.addEventListener("pointerdown", beginAltOrbit, true);
renderer.domElement.addEventListener("pointerdown", scalpBuilder.prioritizeScalpBuilderPointSelection, true);
renderer.domElement.addEventListener("pointermove", updateControlPointHover);
renderer.domElement.addEventListener("pointermove", guideApi.updateCurveLatticeLoopHover);
renderer.domElement.addEventListener("pointermove", referenceHeadApi.updateReferenceOverlayCursor);
referenceCropHandles.addEventListener("pointerover", () => referenceHeadApi.setReferenceOverlayScaleHandleHover(null));
renderer.domElement.addEventListener("pointermove", updateStrandWidthEdgeHover);
renderer.domElement.addEventListener("pointermove", updateCurvePointTopologyCursor);
renderer.domElement.addEventListener("pointerleave", () => {
  if (!sculptState.state.sculptMoveStroke) sculptGeom.setSculptBrushCursorVisible(false);
  polyToolsApi.clearPolyFillPreview();
  clearCurvePointTopologyCursor();
  setHoveredControlPoint(null);
  guideApi.setCurveLatticeLoopHover(null);
  setHoveredStrandWidthEdge(null);
  referenceHeadApi.setReferenceOverlayScaleHandleHover(null);
  renderer.domElement.style.cursor = "";
});
window.addEventListener("pointercancel", () => {
  polyToolsApi.clearPolyFillPreview();
  clearCurvePointTopologyCursor();
  setHoveredControlPoint(null);
  guideApi.setCurveLatticeLoopHover(null);
  setHoveredStrandWidthEdge(null);
});
window.addEventListener("keydown", updateCurvePointTopologyCursor, true);
window.addEventListener("keyup", (event) => {
  updateCurvePointTopologyCursor(event);
  if (["z", "y", "control", "meta"].includes(event.key.toLowerCase())) undo.state.historyShortcutHeld = false;
}, true);
window.addEventListener("blur", () => {
  undo.state.historyShortcutHeld = false;
  clearCurvePointTopologyCursor();
});
renderer.domElement.addEventListener("pointerdown", (event) => {
  if (sculptState.state.proportionalSizeEdit || sculptState.state.proportionalHotkeyPress) return;
  lastPointer.x = event.clientX;
  lastPointer.y = event.clientY;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (pointerHitsTransformGizmo(event)) return;
  const referenceSelectionActive = selectionToolSupportsPicking() && sculptState.state.viewportEditMode === "reference";
  const referenceTransformActive = !referenceImagePanel.classList.contains("hidden")
    && ["move", "scale"].includes(sel.state.activeTool);
  if (
    (referenceSelectionActive || referenceTransformActive)
    && event.button === 0
    && !event.shiftKey
    && !event.ctrlKey
    && !event.altKey
    && !event.metaKey
  ) {
    const overlayReference = sculptState.state.viewportEditMode === "reference" ? referenceHeadApi.referenceOverlayAtPointer(event) : null;
    if (overlayReference) {
      referenceHeadApi.selectReferenceImage(overlayReference.id);
      if (["select", "move", "scale"].includes(sel.state.activeTool)) {
        referenceHeadApi.beginReferenceOverlayDrag(event, overlayReference);
      }
      event.preventDefault();
      return;
    }
    const referenceHit = referenceHeadApi.referencePlaneHitFromPointer({
      ignoreOcclusion: sculptState.state.viewportEditMode === "reference"
    });
    if (referenceHit?.object?.userData.referenceImageId) {
      referenceHeadApi.selectReferenceImage(referenceHit.object.userData.referenceImageId);
      event.preventDefault();
      return;
    }
    if (referenceSelectionActive) {
      referenceHeadApi.selectReferenceImage(null);
      event.preventDefault();
      return;
    }
  }
  if (scalpState.state.scalpBuilderEditing) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    if (scalpBuilder.beginScalpBuilderInput(event)) event.preventDefault();
    return;
  }
  if (scalpState.state.scalpPaintEditing) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    const scalpHit = raycaster.intersectObject(scalpBuilder.activeScalpSurfaceMesh(), false)[0];
    if (scalpHit) {
      scalpBuilder.beginScalpPaint(event, scalpHit);
      event.preventDefault();
    }
    return;
  }
  if (scalpState.state.scalpLatticeEditing) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || transformControls.axis) return;
    const latticeHit = raycaster.intersectObjects(scalpLatticeHandles, false)[0];
    if (latticeHit) {
      scalpBuilder.selectScalpLatticePoint(latticeHit.object.userData.scalpLatticeIndex);
      scalpBuilder.beginScalpLatticeDrag(latticeHit.object, event);
      event.preventDefault();
    } else if (transformControls.object?.userData.scalpLatticeIndex !== undefined) {
      transformControls.detach();
      scalpState.state.selectedScalpLatticeIndex = null;
      scalpLatticeHandles.forEach((handle) => {
        handle.material.color.set(0x58f6ff);
        handle.material.opacity = 0.64;
      });
    }
    return;
  }
  if (scalpState.state.scalpShapeEditing) return;
  if (event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
    // Alt+click (not alt+drag) switches the hovered tip sub-bone / strand, like ZBrush
    // sub-tool switching. Record the candidate on pointerdown; a pointerup without
    // significant movement applies it, so alt+drag navigation never triggers it.
    const altLock = getSelectedLock();
    let altCandidate = null;
    // 与 applyAltClickCandidate 的门控同规则（segmentBoneHost）：候选记录与实际应用必须
    // 认同同一组几何，否则会记下一个永远被拒绝的候选、Alt+点击看起来"没反应"。
    if (altLock && segmentBoneHost(altLock)) {
      const altHover = sculptState.state.tipHover;
      if (altHover && altHover.lockId === altLock.id && altHover.segmentIndex != null) {
        altCandidate = { kind: "tip", lockId: altLock.id, segmentIndex: altHover.segmentIndex };
      }
    }
    if (!altCandidate && !isHairCreateTool()) {
      const hoveredId = hairState.state.hoveredStrandId;
      const selectedId = getSelectedLock()?.id;
      if (hoveredId && hoveredId !== selectedId) altCandidate = { kind: "strand", lockId: hoveredId };
    }
    if (altCandidate) {
      sculptState.state.altClickCandidate = { ...altCandidate, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    } else if (sculptState.state.altClickCandidate) {
      sculptState.state.altClickCandidate = null;
    }
  }
  if (bonesApi.beginPanelSplitHandleDrag(event)) {
    event.preventDefault();
    return;
  }
  if (
    event.button === 0
    && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
    && !sculptBrushToolActive()
    && !["draw", "procedural-draw", "braid", "panel", "curve-surface", "surface-loft", "place"].includes(sel.state.activeTool)
  ) {
    // Clicking a split panel's body selects the hovered sub-bone (toggle: click the same
    // region again to return to the main-hair selection). Only split panels while the
    // main hair is selected.
    const selectedLockNow = getSelectedLock();
    // 门控走 segmentBoneHost（0.2.126）：panel 段与开启 split 的普通发丝管都支持「点本体
    // 选中悬停的发尖子骨骼、再点同一处取消」。此前是 panel 专属，所以普通发丝的分裂子发尖
    // 完全无法选中（用户报告的主症状）。
    // segmentBoneHost 已含「panel 且 panelSplitEnabled 未关」的等价语义？——**不含**，
    // 它只看 geometryType；panel 的 panelSplitEnabled 与发丝的 strandSplitEnabled 分别由
    // 下面这两条补齐（strand 那条已在 segmentBoneHost 内部）。
    const tipHost = selectedLockNow && selectedLockNow.panelSplitEnabled !== false
      ? segmentBoneHost(selectedLockNow)
      : null;
    // 还要求真的已经分裂出多段：未分裂时整根头发只有一段，"选中某段"没有意义（panel 原
    // 判据是 panelSplits.length > 0，发丝的等价物是段数 > 1，由 host.segmentCount 给出）。
    const hasSegments = Boolean(tipHost) && tipHost.segmentCount(selectedLockNow) > 1;
    const hover = sculptState.state.tipHover;
    const hoverSeg = hasSegments && hover && hover.lockId === selectedLockNow.id ? hover.segmentIndex : null;
    const selected = sculptState.state.tipSelection;
    if (hasSegments && hoverSeg != null) {
      if (selected && selected.lockId === selectedLockNow.id && selected.segmentIndex === hoverSeg) {
        sculptState.state.tipSelection = null; // click again -> back to main selection
      } else {
        sculptState.state.tipSelection = { lockId: selectedLockNow.id, segmentIndex: hoverSeg };
        sculptState.state[tipHost.segmentIndexKey] = hoverSeg;
      }
      updateCurveObjects(selectedLockNow, { visible: true });
      segmentApi.syncSegmentControlsForLock(selectedLockNow);
      // 子发尖段切换：浮动面板开着且正在编辑该 lock 时热刷新到新段。
      taperEditor.retargetOpenSegmentTaperEditor?.(selectedLockNow, hoverSeg);
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    } else if (selected && selected.lockId === selectedLockNow?.id) {
      sculptState.state.tipSelection = null;
      updateCurveObjects(selectedLockNow, { visible: true });
      segmentApi.syncSegmentControlsForLock(selectedLockNow);
    }
  }
  if (sel.state.activeTool === "draw-capsule-guide") {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    guideApi.beginCapsuleGuideDrawStroke(event, drawFlowApi.drawSurfaceHitFromEvent(event, { root: true }));
    return;
  }
  if (sculptState.state.capsuleGuideEditing) {
    if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const guide = guideApi.getSelectedGuide();
      const pointHit = guide?.type === "capsule" && guide.handlesGroup?.visible
        ? raycaster.intersectObjects(guide.handlesGroup.children.filter((handle) => handle.visible), false)[0]
        : null;
      const surfaceHit = guide?.type === "capsule" ? raycaster.intersectObject(guide.mesh, false)[0] : null;
      if (pointHit && (!surfaceHit || pointHit.distance <= surfaceHit.distance + 0.05)) {
        guideApi.selectCapsuleGuidePoint(guide, pointHit.object.userData.capsuleGuidePointIndex);
        event.preventDefault();
        return;
      }
      if (guideApi.beginCapsuleGuideLoopDrag(event)) {
        event.preventDefault();
        return;
      }
      const capsuleHit = raycaster.intersectObjects(
        guides
          .filter((item) => item.type === "capsule" && item.mesh.visible !== false)
          .map((item) => item.mesh),
        false
      )[0] || null;
      const capsuleGuideId = capsuleHit?.object?.userData?.guideId;
      if (capsuleGuideId && capsuleGuideId !== sel.state.selectedGuideId) {
        guideApi.selectGuide(capsuleGuideId);
        event.preventDefault();
        return;
      }
    }
    return;
  }
  if (["draw", "procedural-draw", "braid", "panel"].includes(sel.state.activeTool)) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const extensionLock = drawFlowApi.selectedTipContinuationLock(event);
    const branchStart = extensionLock ? null : branchHierarchy.selectedDrawBranchPoint(event);
    const surfaceHit = extensionLock || branchStart ? null : drawFlowApi.drawSurfaceHitFromEvent(event, { root: true });
    drawFlowApi.beginDrawStrandStroke(event, surfaceHit, extensionLock, branchStart);
    return;
  }
  if (sel.state.activeTool === "curve-surface") {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const surfaceMode = drawFlowApi.activeStrokeSurfaceValue();
    const dynamicContextual = drawFlowApi.activeStrokeDynamicEnabled(surfaceMode);
    const hit = drawFlowApi.drawSurfaceHitFromEvent(event, { root: true })
      || (sculptState.state.curveSurfaceDraft?.curves?.length
        ? curveSurfaceCreate.curveSurfaceFallbackHit(event, surfaceMode, dynamicContextual)
        : null);
    curveSurfaceCreate.beginCurveSurfaceStroke(event, hit);
    return;
  }
  if (sel.state.activeTool === "surface-loft") {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    curveSurfaceCreate.beginLoftSurfaceStroke(event, drawFlowApi.drawSurfaceHitFromEvent(event, { root: true }));
    return;
  }
  if (sel.state.activeTool === "place") {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    if (sculptState.state.placeEdit) {
      placementApi.beginPlacementPointer(event);
      return;
    }
    const pendingLock = placementApi.pendingPlacedLock();
    if (sel.state.pendingPlacedLockId && !pendingLock) {
      placementApi.finishPlacementFlow();
    } else if (pendingLock) {
      placementApi.finishPlacementFlow({ keepSelected: true });
      return;
    }
    const curveLattice = drawFlowApi.selectedCurveLatticeGuide();
    const surfaceHit = curveLattice
      ? raycaster.intersectObjects([curveLattice.mesh, curveLattice.rootMesh].filter((object) => object && object.visible !== false), false)[0]
      : raycaster.intersectObject(scalpBuilder.activeScalpSurfaceMesh(), false)[0];
    placementApi.beginPlacementPointer(event, surfaceHit);
    return;
  }
  if (selectionToolSupportsPicking()) {
    const addingSelection = event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey;
    const removingSelection = event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
    if (event.button === 0 && (addingSelection || removingSelection) && sculptState.state.viewportEditMode === "strand") {
      const lockHit = raycaster.intersectObjects(
        locks.filter(strandAvailableForViewportInteraction).map((lock) => lock.mesh),
        false
      )[0] || null;
      const lockId = lockHit?.object?.userData.lockId;
      const selectedSurface = lockHit ? { type: "strand", hit: lockHit } : null;
      beginSelectionMarquee(event, selectedSurface, addingSelection ? "add" : "remove");
      event.preventDefault();
      return;
    }
    if (event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;
    const selectingStrands = sculptState.state.viewportEditMode === "strand";
    const selectingGuides = sculptState.state.viewportEditMode === "guide";
    const curveSurfaceControllerHit = selectingStrands && componentEditModeActive()
      ? curveSurfaceCreate.curveSurfaceControllerHitFromEvent(event)
      : null;
    if (curveSurfaceControllerHit) {
      sculptState.state.selectionMarqueeDrag = null;
      selectLock(curveSurfaceControllerHit.lock.id, {
        individualClumpMember: true,
        curveSurfaceControllerIndex: curveSurfaceControllerHit.controllerIndex
      });
      event.preventDefault();
      return;
    }
    const selectedSurfaceLock = selectingStrands
      && componentEditModeActive()
      && getSelectedLock()?.geometryType === "surface"
      ? getSelectedLock()
      : null;
    const surfaceAnchorHandle = selectedSurfaceLock?.curveObjects?.surfaceObjectAnchorHandle;
    const surfaceAnchorHit = surfaceAnchorHandle && surfaceAnchorHandle.visible !== false
      ? raycaster.intersectObject(surfaceAnchorHandle, false)[0]
      : null;
    if (surfaceAnchorHit) {
      sculptState.state.selectionMarqueeDrag = null;
      selectSurfaceObjectAnchor(selectedSurfaceLock, sel.state.activeTool !== "select");
      event.preventDefault();
      return;
    }
    const selectedLattice = selectingGuides && componentEditModeActive()
      ? drawFlowApi.selectedCurveLatticeGuide()
      : null;
    const latticePointHit = selectedLattice?.handlesGroup.visible
      ? raycaster.intersectObjects(selectedLattice.handlesGroup.children, false)[0]
      : null;
    if (latticePointHit) {
      sculptState.state.selectionMarqueeDrag = null;
      guideApi.selectCurveLatticePoint(selectedLattice, latticePointHit.object.userData.curveLatticePointIndex, false);
      return;
    }
    const latticeLoopHit = guideApi.curveLatticeLoopHitFromEvent(event, selectedLattice);
    if (latticeLoopHit && guideApi.selectCurveLatticeLoop(
      selectedLattice,
      latticeLoopHit.axis,
      latticeLoopHit.loopIndex
    )) {
      sculptState.state.selectionMarqueeDrag = null;
      event.preventDefault();
      return;
    }
    const lockHit = selectingStrands
      ? raycaster.intersectObjects(
        locks.filter(strandAvailableForViewportInteraction).map((lock) => lock.mesh),
        false
      )[0] || null
      : null;
    const guideHit = selectingGuides
      ? raycaster.intersectObjects(
        guides.flatMap((guide) => [guide.mesh, guide.rootMesh]
          .filter((object) => object && object.visible !== false)),
        false
      )[0] || null
      : null;
    const selectedSurface = guideHit
      ? { type: "guide", hit: guideHit }
      : lockHit
        ? { type: "strand", hit: lockHit }
        : null;
    if (beginSelectionMarquee(event, selectedSurface)) event.preventDefault();
    return;
  }

  const modelingClick = event.button === 0 && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey;
  const selectedLattice = sculptState.state.viewportEditMode === "guide" ? drawFlowApi.selectedCurveLatticeGuide() : null;
  if (modelingClick && sel.state.activeTool === "move" && selectedLattice?.handlesGroup.visible) {
    const latticePointHit = raycaster.intersectObjects(selectedLattice.handlesGroup.children, false)[0];
    if (latticePointHit) {
      const directMove = sel.state.activeTool === "move" && viewPlaneMoveActiveForView();
      const pointIndex = latticePointHit.object.userData.curveLatticePointIndex;
      const preserveMulti = sel.state.selectedControlPoints.length > 1
        && guideApi.controlPointIsSelected("lattice", selectedLattice.id, pointIndex);
      guideApi.selectCurveLatticePoint(
        selectedLattice,
        pointIndex,
        !directMove,
        preserveMulti
      );
      if (directMove) beginViewPlaneMove(null, latticePointHit.object, event);
      event.preventDefault();
      return;
    }
    const latticeLoopHit = guideApi.curveLatticeLoopHitFromEvent(event, selectedLattice);
    if (latticeLoopHit && guideApi.selectCurveLatticeLoop(
      selectedLattice,
      latticeLoopHit.axis,
      latticeLoopHit.loopIndex
    )) {
      event.preventDefault();
      return;
    }
  }
  const selectedLock = sculptState.state.viewportEditMode === "strand" ? getSelectedLock() : null;
  const curveSurfaceControllerHit = modelingClick
    ? curveSurfaceCreate.curveSurfaceControllerHitFromEvent(event, selectedLock)
    : null;
  if (curveSurfaceControllerHit) {
    selectLock(curveSurfaceControllerHit.lock.id, {
      individualClumpMember: true,
      curveSurfaceControllerIndex: curveSurfaceControllerHit.controllerIndex
    });
    event.preventDefault();
    return;
  }
  const surfaceAnchorHandle = selectedLock?.geometryType === "surface"
    ? selectedLock.curveObjects?.surfaceObjectAnchorHandle
    : null;
  const surfaceAnchorHit = modelingClick && surfaceAnchorHandle && surfaceAnchorHandle.visible !== false
    ? raycaster.intersectObject(surfaceAnchorHandle, false)[0]
    : null;
  if (surfaceAnchorHit) {
    selectSurfaceObjectAnchor(selectedLock);
    event.preventDefault();
    return;
  }
  const handles = selectedLock?.curveObjects?.group.visible ? selectedLock.curveObjects.handles : [];
  const hit = modelingClick ? strandControlPointHitFromEvent(event, selectedLock) : null;

  if (!hit && modelingClick && ["move", "rotate", "scale"].includes(sel.state.activeTool)) {
    const lockHit = sculptState.state.viewportEditMode === "strand"
      ? raycaster.intersectObjects(
        locks.filter(strandAvailableForViewportInteraction).map((lock) => lock.mesh),
        false
      )[0] || null
      : null;
    const guideHit = sculptState.state.viewportEditMode === "guide"
      ? raycaster.intersectObjects(
        guides.flatMap((guide) => [guide.mesh, guide.rootMesh]
          .filter((object) => object && object.visible !== false)),
        false
      )[0] || null
      : null;
    const selectedSurface = guideHit
      ? { type: "guide", hit: guideHit }
      : lockHit
        ? { type: "strand", hit: lockHit }
        : null;

    if (selectedSurface?.type === "guide") {
      const guideId = selectedSurface.hit.object.userData.guideId;
      if (guideId && guideId !== sel.state.selectedGuideId) {
        guideApi.selectGuide(guideId);
        event.preventDefault();
        return;
      }
    } else if (selectedSurface?.type === "strand") {
      const lockId = selectedSurface.hit.object.userData.lockId;
      if (lockId && lockId !== sel.state.selectedId) {
        selectLock(lockId);
        event.preventDefault();
        return;
      }
    }
  }

  if (!hit) {
    if (modelingClick && sel.state.activeTool === "relax" && selectedLock && sel.state.selectedPoint?.lockId === selectedLock.id) {
      if (beginRelaxEdit(selectedLock, sel.state.selectedPoint.pointIndex, event)) {
        event.preventDefault();
      }
    }
    return;
  }
  activateStrandControlPoint(hit.object, event);
});

miscState.state.fpsSampleStart = performance.now();
miscState.state.previousAnimationTimestamp = performance.now();

function animate(timestamp = performance.now()) {
  const deltaSeconds = Math.min(0.1, Math.max(0, (timestamp - miscState.state.previousAnimationTimestamp) / 1000));
  miscState.state.previousAnimationTimestamp = timestamp;
  miscState.state.fpsFrameCount += 1;
  const fpsElapsed = timestamp - miscState.state.fpsSampleStart;
  if (fpsElapsed >= 500) {
    viewportFps.textContent = `${Math.round((miscState.state.fpsFrameCount * 1000) / fpsElapsed)} FPS`;
    miscState.state.fpsFrameCount = 0;
    miscState.state.fpsSampleStart = timestamp;
  }
  if (viewportState.state.turntableActive && !sculptState.state.altOrbitDrag && !sculptState.state.viewSnapDrag) {
    const cameraOffset = camera.position.clone().sub(controls.target);
    cameraOffset.applyAxisAngle(
      turntableAxis,
      TURNTABLE_RADIANS_PER_SECOND * viewportState.state.turntableSpeed * deltaSeconds
    );
    camera.position.copy(controls.target).add(cameraOffset);
    camera.lookAt(controls.target);
  }
  controls.update();
  updateCameraViewCube();
  sculptGeom.updateSculptBrushViabilityPlane();
  referenceHeadApi.updateReferencePlaneVisibility();
  referenceHeadApi.updateReferenceCropHandles();
  updateViewPlaneGrid();
  updatePullGuideVisual();
  if (windStore.state.windPreviewActive) windPreviewTick(deltaSeconds);
  renderUvInspector(timestamp);
  renderer.render(scene, camera);
  if (multiCameraState.state.enabled && multiCameraState.state.previewRenderers) {
    syncMultiCameraPreviewCameras();
    renderNextInactiveMultiCameraPreview();
  }
  requestAnimationFrame(animate);
}


function syncCompactSidebarLayout() {
  document.body.classList.toggle("compact-outliner-collapsed", sel.state.compactOutlinerCollapsed);
  document.body.classList.toggle("compact-attribute-collapsed", sculptState.state.compactAttributeEditorCollapsed);

  toggleOutlinerPanelButton.setAttribute("aria-expanded", String(!sel.state.compactOutlinerCollapsed));
  toggleOutlinerPanelButton.title = sel.state.compactOutlinerCollapsed ? "Expand outliner" : "Collapse outliner";
  toggleOutlinerPanelButton.setAttribute("aria-label", toggleOutlinerPanelButton.title);
  toggleOutlinerPanelButton.querySelector("span").textContent = sel.state.compactOutlinerCollapsed ? "\u2304" : "\u2303";

  toggleAttributeEditorPanelButton.setAttribute("aria-expanded", String(!sculptState.state.compactAttributeEditorCollapsed));
  toggleAttributeEditorPanelButton.title = sculptState.state.compactAttributeEditorCollapsed
    ? "Expand attribute editor"
    : "Collapse attribute editor";
  toggleAttributeEditorPanelButton.setAttribute("aria-label", toggleAttributeEditorPanelButton.title);
  toggleAttributeEditorPanelButton.querySelector("span").textContent = sculptState.state.compactAttributeEditorCollapsed ? "\u2304" : "\u2303";

  window.requestAnimationFrame(resize);
}

function setOutlinerPanelCollapsed(collapsed) {
  sel.state.compactOutlinerCollapsed = Boolean(collapsed);
  if (sel.state.compactOutlinerCollapsed) sculptState.state.compactAttributeEditorCollapsed = false;
  syncCompactSidebarLayout();
}

function setAttributeEditorPanelCollapsed(collapsed) {
  sculptState.state.compactAttributeEditorCollapsed = Boolean(collapsed);
  if (sculptState.state.compactAttributeEditorCollapsed) sel.state.compactOutlinerCollapsed = false;
  syncCompactSidebarLayout();
}

function setAttributeEditorTab(tabName) {
  const activeTab = ["main", "display", "materials"].includes(tabName) ? tabName : "main";
  toolPanel.dataset.activeAttributeTab = activeTab;
  attributeEditorTabs.forEach((button) => {
    const selected = button.dataset.attributeTab === activeTab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  attributeEditorPanels.forEach((panel) => {
    const assignedTab = panel.dataset.attributePanel || "main";
    const panelTab = ["tools", "strands"].includes(assignedTab) ? "main" : assignedTab;
    panel.classList.toggle("attribute-tab-hidden", panelTab !== activeTab);
  });
  updateStrandSelectionHighlight();
}

attributeEditorTabs.forEach((button, index) => {
  button.addEventListener("click", () => {
    setAttributeEditorPanelCollapsed(false);
    setAttributeEditorTab(button.dataset.attributeTab);
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + attributeEditorTabs.length) % attributeEditorTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % attributeEditorTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = attributeEditorTabs.length - 1;
    const nextTab = attributeEditorTabs[nextIndex];
    setAttributeEditorTab(nextTab.dataset.attributeTab);
    nextTab.focus();
  });
});

toggleOutlinerPanelButton.addEventListener("click", () => {
  setOutlinerPanelCollapsed(!sel.state.compactOutlinerCollapsed);
});
toggleAttributeEditorPanelButton.addEventListener("click", () => {
  setAttributeEditorPanelCollapsed(!sculptState.state.compactAttributeEditorCollapsed);
});

setAttributeEditorTab("main");
syncCompactSidebarLayout();
materialApi.syncHairMaterialEditor();
renderLockList();
updateAttributeEditorMode();
setSideNamingPerspective(miscState.state.sideNamingPerspective, { persist: false });
setAutosaveInterval(recovery.state.autosaveIntervalSeconds, { persist: false });
setAutosaveEnabled(recovery.state.autosaveEnabled, { persist: false });
// File > New 的空场景基准：必须在 offerRecoverySnapshot() **之前**抓 —— 恢复流程会把
// 上一次崩溃的场景灌进来，抓晚了基准就变成"上次的项目"而不是空项目。
// 存 JSON 字符串（不是对象）：restoreState 会就地消费还原出的集合，留对象引用会让
// 第二次 New 拿到被污染的基准。字段说明见 modules/io/project-store.js。
projectState.state.pristineProjectSnapshot = JSON.stringify(snapshotState());
offerRecoverySnapshot();
resize();
animate();

// __AHS_TEST_SEAM__ — test-only hooks for scripts/verify-tip-select.mjs (inert unless ?ahstest=1)
if (new URLSearchParams(location.search).has("ahstest")) {
  window.__ahsTest = {
    sculptState,
    fileApi,
    THREE,
    locks,
    scene,
    camera: () => camera,
    renderer,
    raycaster,
    getSelectedLock,
    selectLock,
    sel,
    hairState,
    undoHistory,
    windPreviewApi: {
      setWindPreviewActive,
      tickOnce: () => windPreviewTick(0.016),
      getWindTime: () => windStore.state.windTime
    },
    windState: windStore.state,
    updateCurveObjects,
    transformControls,
    // guideState：验证脚本需要能清掉 hoveredControlPoint。合成 pointerdown 时若它有残留，
    // capture 阶段的 prepareCurvePointSelection 会 stopImmediatePropagation，主 pointerdown
    // 根本不执行（真实用户走 pointermove 不会有这个残留）。见 scripts/verify-tip-clump.mjs。
    guideState,
    // projectState：File > New 的验收要断言「快速保存/快速导出句柄被忘掉」。这些值只存在
    // 于 projectState store —— fileApi **只导出函数**（那些 currentProjectName /
    // quickSaveFileHandle getter 在传进 createProjectSaveApi 的 deps 对象上，不在返回值上），
    // 从 fileApi 读会拿到 undefined、写会凭空造出一个同名属性，断言因此会假绿/假红
    // （scripts/verify-new-project.mjs 初版实测踩过）。见该脚本。
    projectState,
    // scalpSurface：Scalp Conform 的验收要独立判断「顶点是否真的落在头皮表面 + gap 上」，
    // 而那需要**真实头部代理参数**（中心/半径/三轴缩放）。若验收脚本自己写死 {y:0.9, r:1}，
    // 它就只是在复述实现的假设、用户改过头模后会假绿。见 scripts/verify-scalp-conform.mjs。
    scalpSurface,
    beginTipSubBoneRotate: bonesApi.beginTipSubBoneRotate,
    beginTipSubBoneTranslate: bonesApi.beginTipSubBoneTranslate,
    updateTipHighlight: panelTipStrand.updateTipHighlight,
    updateStrandBrushHover,
    syncStrandHoverOutline,
    splitTipForSegment: panelTipStrand.splitTipForSegment,
    applySubBoneBrushSample: bonesApi.applySubBoneBrushSample,
    tipWidthSideForkT: panelTipStrand.tipWidthSideForkT,
    tipSegmentWeightAt: panelTipStrand.tipSegmentWeightAt,
    tipWidthCommonForkT: panelTipStrand.tipWidthCommonForkT,
    tipWidthControlTs: panelTipStrand.tipWidthControlTs,
    tipWidthGridTs: panelTipStrand.tipWidthGridTs,
    tipWidthSideExposesT: panelTipStrand.tipWidthSideExposesT,
    tipWidthSideControlTs: panelTipStrand.tipWidthSideControlTs,
    tipWidthSpreadGap: panelTipStrand.tipWidthSpreadGap,
    tipWidthControlPlacement: panelTipStrand.tipWidthControlPlacement,
    tipWidthEdgePosition: panelTipStrand.tipWidthEdgePosition,
    tipPanelFrameAt: panelTipStrand.tipPanelFrameAt,
    tipSurfaceFrameAt: panelTipStrand.tipSurfaceFrameAt,
    tipChainFrameAt: panelTipStrand.tipChainFrameAt,
    tipPanelWidthAt: panelTipStrand.tipPanelWidthAt,
    tipWidthMultiplierAt: panelTipStrand.tipWidthMultiplierAt,
    tipMainSectionPoint: panelTipStrand.tipMainSectionPoint,
    setTipWidthCurveValue: panelTipStrand.setTipWidthCurveValue,
    buildTipWidthCurve: panelTipStrand.buildTipWidthCurve,
    tipWidthResetCurve: panelTipStrand.tipWidthResetCurve,
    renderTaperCurveEditor: taperEditor.renderTaperCurveEditor,
    syncPanelSegmentControls: segmentApi.syncPanelSegmentControls,
    sampleTaperCurve,
    sampleAsymmetricTaperCurve,
    strandFrameAt,
    splitForkT: panelTipStrand.splitForkT,
    clonePanelSplits,
    materializeSplitBones,
    // 发丝段骨骼的物化入口：验证脚本要在与拖拽写入**同一空间**里取基线（派生视图未固化时
    // lock.strandSplitBones 是空的）。见 scripts/verify-tip-clump.mjs。
    materializeStrandSplitBones,
    strandVisibleForDisplay,
    isPanelGeometry,
    projectToClient(world) {
      const v = world.clone().project(camera);
      const rect = renderer.domElement.getBoundingClientRect();
      return { x: (v.x * 0.5 + 0.5) * rect.width + rect.left, y: (-v.y * 0.5 + 0.5) * rect.height + rect.top };
    }
  };
}

