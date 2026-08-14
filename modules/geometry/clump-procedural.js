// clump-procedural.js - clump core/member geometry + procedural accessory/branch settings,
// clump UI/outliner, procedural UI and clump mirror glue (refactor batch B6a / plan B6).
// Extracted from app.js; all app.js coupling injected via createClumpProceduralApi(deps).
import * as THREE from "three";
import {
  clumpMemberGuideParameter,
  normalizeTaperCurve,
  remapEnvelopeCurveRange
} from "./curve-math.js?v=20260813-3";
import { proceduralBranchTemplateData } from "./procedural-draw.js?v=20260814-12";

export function createClumpProceduralApi(deps) {
  // deps: store .state proxies (sel/sculptState/draw/miscState; use deps.X.y, never deps.X.state.y),
  // shared objects (locks/renderer/clumpOpen),
  // clump + procedural DOM elements (clumpGuidePanel/clumpGuideStatus/clumpInfluenceControl/
  //   clumpInfluenceInput/clumpInfluenceValue/clumpShapeControls/clumpShapeInputs/clumpShapeValues/
  //   proceduralAccessoryEditPanel/proceduralAccessoryEditCountInput/proceduralAccessoryEditCountValue/
  //   proceduralAccessoryEditRadiusInput/proceduralAccessoryEditRadiusValue/
  //   proceduralAccessoryEditParentVisibleInput/proceduralBranchEditCountInput/
  //   proceduralBranchEditCountValue/proceduralBranchEditLengthInput/proceduralBranchEditLengthValue/
  //   proceduralBranchEditTipOffsetInput/proceduralBranchEditTipOffsetValue/
  //   proceduralBranchLengthCurvePreview/proceduralBranchShapeCurvePreview/
  //   proceduralDrawExperimentalPreferenceInput/proceduralDrawToolButton),
  // const deps (DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE/
  //   PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY),
  // cross-module apis (drawFlowApi: proceduralDrawClumpTemplate/drawClumpStrandMaps/createDrawnLock;
  //   branchRootBone: branchWorldVector/captureBranchLocalState;
  //   taperEditor: renderTaperPreview),
  // app.js spine helpers (29: pushUndoState/updateLockGeometry/rebuildCurveObjects/renderLockList/
  //   updateCount/selectLock/getSelectedLock/deleteLocks/syncActiveMirror/syncLockFromCurve/
  //   mirrorPartnerFor/createMirrorPartner/syncMirrorPartnerFromLock/decoupleMirrorPartner/
  //   fitPointAttributes/setPointScale/outwardNormalAtPoint/transportedStrandFrameAt/
  //   saveBooleanPreference/setActiveTool/strandVisibleForDisplay/syncLockedStrandWireVisual/
  //   selectedLocksInOrder/setLocksOutlinerVisibility/createOutlinerStrandButton/
  //   createOutlinerVisibilityToggle/handleOutlinerRenameClick/showOutlinerContextMenu).
  // Batch-fill point in app.js: after the proceduralDuplicateDeps batch (all const/let deps defined)
  // and before the bootstrap init; see devlog/in-progress/clump-procedural-refactor-map.md.

function nextClumpName() {
  const used = new Set(deps.locks.map((lock) => lock.clumpName).filter(Boolean));
  let index = 1;
  while (used.has(`Clump ${index}`)) index += 1;
  return `Clump ${index}`;
}

function initializeClumpShape(guide) {
  if (!guide) return;
  guide.clumpSpread = Number(guide.clumpSpread ?? 1);
  guide.clumpDepthSpread = Number(guide.clumpDepthSpread ?? 1);
  guide.clumpTipFan = Number(guide.clumpTipFan ?? 0);
  guide.clumpRoll = Number(guide.clumpRoll ?? 0);
  guide.clumpStrandWidth = Number(guide.clumpStrandWidth ?? 1);
  guide.clumpStrandDepth = Number(guide.clumpStrandDepth ?? 1);
  guide.clumpVariation = Number(guide.clumpVariation ?? 0);
}

function stableClumpVariation(id = "") {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const first = ((hash >>> 0) % 2001) / 1000 - 1;
  hash = Math.imul(hash ^ 0x9e3779b9, 16777619);
  const second = ((hash >>> 0) % 2001) / 1000 - 1;
  return { first, second };
}

function createClumpFromLocks(clumpLocks, options = {}) {
  const members = clumpLocks.filter(Boolean);
  if (members.length < (options.allowSingle ? 1 : 2)) return null;
  const clumpId = crypto.randomUUID();
  const guide = members[0];
  const name = options.name || nextClumpName();
  members.forEach((lock, index) => {
    lock.clumpId = clumpId;
    lock.clumpName = name;
    lock.clumpGuide = index === 0;
    lock.clumpGuideId = guide.id;
    lock.clumpInfluence = 1;
    lock.clumpRestPoints = lock.points.map((point) => point.clone());
    lock.clumpRestTwists = [...lock.pointTwists];
    lock.clumpRestScales = lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
    if (index === 0) {
      initializeClumpShape(lock);
      lock.clumpGuideRestPoints = lock.points.map((point) => point.clone());
      lock.clumpGuideRestTwists = [...lock.pointTwists];
      lock.clumpGuideRestScales = lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
    }
  });
  return guide;
}

function addLockToClump(lock, guide, options = {}) {
  if (!lock || !guide?.clumpGuide || !guide.clumpId || lock.id === guide.id) return false;
  if (lock.clumpGuide || lock.clumpId === guide.clumpId) return false;
  if (lock.clumpId) detachLockFromClump(lock);
  lock.clumpId = guide.clumpId;
  lock.clumpName = guide.clumpName;
  lock.clumpGuide = false;
  lock.clumpGuideId = guide.id;
  lock.clumpInfluence = 1;
  lock.clumpRestPoints = lock.points.map((point) => point.clone());
  lock.clumpRestTwists = [...lock.pointTwists];
  lock.clumpRestScales = lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
  lock.clumpParameterStart = THREE.MathUtils.clamp(Number(options.parameterStart ?? 0), 0, 1);
  lock.clumpParameterEnd = THREE.MathUtils.clamp(Number(options.parameterEnd ?? 1), lock.clumpParameterStart, 1);
  if (options.update !== false) updateClumpMembers(guide);
  return true;
}

function pointerToNdc(event) {
  const rect = deps.renderer.domElement.getBoundingClientRect();
  return new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
}

function gridProfileSkipCol(edges, vertexCount) {
  const starts = new Set();
  edges.forEach((edge) => starts.add(edge.start % vertexCount));
  for (let c = 0; c < vertexCount; c += 1) {
    if (!starts.has(c)) return c;
  }
  return -1;
}

function clumpDirectMembers(guide) {
  if (!guide?.clumpGuide || !guide.clumpId) return [];
  return deps.locks.filter((lock) => lock.clumpId === guide.clumpId && lock.id !== guide.id);
}

function clumpMembersForGuide(guide) {
  return clumpDirectMembers(guide);
}

function clumpGuideForLock(lock) {
  if (!lock?.clumpId) return null;
  return deps.locks.find((item) => item.clumpId === lock.clumpId && item.clumpGuide) || null;
}

function proceduralGuideForLock(lock) {
  const guide = lock?.proceduralDrawGuide
    ? lock
    : (lock?.clumpGuide ? lock : clumpGuideForLock(lock));
  return guide?.proceduralDrawGuide ? guide : null;
}

function proceduralAccessoryMembersForGuide(guide) {
  if (!guide?.proceduralDrawGuide) return [];
  return clumpMembersForGuide(guide)
    .filter((lock) => lock.proceduralAccessory)
    .sort((a, b) => Number(a.proceduralAccessoryIndex ?? 0) - Number(b.proceduralAccessoryIndex ?? 0));
}

function proceduralBranchMembersForGuide(guide) {
  if (!guide?.proceduralDrawGuide) return [];
  return deps.locks
    .filter((lock) => lock.branchParentId === guide.id && lock.proceduralBranch)
    .sort((a, b) => Number(a.proceduralBranchIndex ?? 0) - Number(b.proceduralBranchIndex ?? 0));
}

function proceduralBranchTemplatesForGuide(guide, count, length, tipOffset) {
  return proceduralBranchTemplateData({
    count,
    pointCount: guide?.points?.length || 0,
    length,
    tipOffset,
    lengthCurve: guide?.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE,
    shapeCurve: guide?.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE,
    sampleCount: 5
  });
}

function proceduralBranchWorldPoints(guide, template) {
  const frame = deps.transportedStrandFrameAt(
    guide,
    new THREE.CatmullRomCurve3(guide.points),
    template.parameter,
    { twistOverride: 0 }
  );
  return template.localPoints.map(([x, y, z]) => frame.point.clone().add(deps.branchRootBone.branchWorldVector(
    new THREE.Vector3(x, y, z),
    frame
  )));
}

function applyProceduralBranchSettings(guide, { count, length, tipOffset }) {
  if (!guide?.proceduralDrawGuide) return;
  const normalizedLength = THREE.MathUtils.clamp(Number(length), 0.1, 3);
  const normalizedTipOffset = THREE.MathUtils.clamp(Number(tipOffset), 0, 2);
  const templates = proceduralBranchTemplatesForGuide(
    guide,
    THREE.MathUtils.clamp(Math.round(Number(count)), 0, 64),
    normalizedLength,
    normalizedTipOffset
  );
  const normalizedCount = templates.length;
  const legacyMembers = proceduralBranchMembersForGuide(guide);
  if (legacyMembers.length) {
    deps.deleteLocks([...legacyMembers, ...legacyMembers.map(deps.mirrorPartnerFor).filter(Boolean)]);
  }

  guide.proceduralBranchCount = normalizedCount;
  guide.proceduralBranchLength = normalizedLength;
  guide.proceduralBranchTipOffset = normalizedTipOffset;
  deps.updateLockGeometry(guide, { updateBranches: false });

  const mirroredGuide = proceduralGuideForLock(deps.mirrorPartnerFor(guide));
  if (mirroredGuide) {
    mirroredGuide.proceduralDrawGuide = true;
    mirroredGuide.proceduralBranchCount = normalizedCount;
    mirroredGuide.proceduralBranchLength = normalizedLength;
    mirroredGuide.proceduralBranchLengthCurve = normalizeTaperCurve(
      guide.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
    );
    mirroredGuide.proceduralBranchShapeCurve = normalizeTaperCurve(
      guide.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
    );
    mirroredGuide.proceduralBranchTipOffset = normalizedTipOffset;
    deps.updateLockGeometry(mirroredGuide, { updateBranches: false });
  }
  deps.renderLockList();
  deps.updateCount();
}

function proceduralAccessoryMapsForGuide(guide, count, radius) {
  const samples = guide.points.map((point, index) => ({
    point: point.clone(),
    normal: guide.pointSurfaceNormals?.[index]?.clone?.() || null
  }));
  const template = deps.drawFlowApi.proceduralDrawClumpTemplate({
    proceduralAccessoryCount: count,
    proceduralAccessoryRadius: radius,
    proceduralParentShape: guide
  });
  return {
    template,
    maps: deps.drawFlowApi.drawClumpStrandMaps(samples, Number(guide.baseWidth ?? guide.width), template).slice(1)
  };
}

function setProceduralAccessoryGeometry(lock, strandMap, index) {
  lock.proceduralAccessory = true;
  lock.proceduralAccessoryIndex = index;
  lock.points = strandMap.points.map((point) => point.clone());
  lock.pointSurfaceNormals = strandMap.pointSurfaceNormals.map((normal) => normal?.clone?.() || null);
  deps.fitPointAttributes(lock, lock.points.length);
  lock.clumpRestPoints = lock.points.map((point) => point.clone());
  lock.clumpRestTwists = [...lock.pointTwists];
  lock.clumpRestScales = lock.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
  if (lock.curveObjects.handles.length !== lock.points.length) deps.rebuildCurveObjects(lock);
  deps.syncLockFromCurve(lock);
  deps.updateLockGeometry(lock);
}

function createProceduralAccessoryLock(guide, source, strandMap, shapeTemplate, clumpTemplate, index) {
  const template = {
    ...shapeTemplate,
    settings: {
      strandRotation: source.strandRotation,
      twist: source.twist,
      twistCurve: source.twistCurve,
      taperCurve: source.taperCurve,
      depthCurve: source.depthCurve,
      taperCurveSecondary: source.taperCurveSecondary,
      depthCurveSecondary: source.depthCurveSecondary,
      asymmetricWidthCurve: source.asymmetricWidthCurve,
      asymmetricDepthCurve: source.asymmetricDepthCurve,
      centerAsymmetricProfile: source.centerAsymmetricProfile,
      widthScale: source.widthScale,
      depthScale: source.depthScale,
      sweepProfile: source.sweepProfile,
      profileOffset: source.profileOffset,
      radialSegments: source.radialSegments,
      lengthSegments: source.lengthSegments,
      dynamicDensity: source.dynamicDensity,
      densityAggression: source.densityAggression,
      twistDensity: source.twistDensity,
      hairLayer: source.hairLayer,
      rootScalpOffset: source.rootScalpOffset
    }
  };
  const stroke = {
    brushSize: Number(guide.baseWidth ?? guide.width),
    brushDepth: Number(guide.depth ?? guide.width),
    scalpRegion: guide.scalpRegion,
    scalpOffset: 0,
    rootAttachmentEnabled: false,
    surfaceNormalInfluence: Number(guide.surfaceNormalInfluence ?? 0),
    proceduralDraw: true,
    proceduralParentVisible: !guide.proceduralParentHidden
  };
  const lock = deps.drawFlowApi.createDrawnLock(
    stroke,
    strandMap.points,
    strandMap.pointSurfaceNormals,
    Number(guide.baseWidth ?? guide.width) * (shapeTemplate.width / clumpTemplate.baseWidth),
    false,
    template,
    clumpTemplate
  );
  addLockToClump(lock, guide);
  lock.proceduralAccessory = true;
  lock.proceduralAccessoryIndex = index;
  return lock;
}

function applyProceduralAccessorySettings(guide, { count, radius, parentVisible }) {
  if (!guide?.proceduralDrawGuide) return;
  const normalizedCount = THREE.MathUtils.clamp(Math.round(Number(count)), 0, 16);
  const normalizedRadius = THREE.MathUtils.clamp(Number(radius), 0, 2);
  const { template, maps } = proceduralAccessoryMapsForGuide(guide, normalizedCount, normalizedRadius);
  let members = proceduralAccessoryMembersForGuide(guide);
  const source = members[0] || guide;

  if (members.length > normalizedCount) {
    const removed = members.slice(normalizedCount);
    const removedWithMirrors = [...removed, ...removed.map(deps.mirrorPartnerFor).filter(Boolean)];
    deps.deleteLocks(removedWithMirrors);
    members = proceduralAccessoryMembersForGuide(guide);
  }
  while (members.length < normalizedCount) {
    const index = members.length;
    const lock = createProceduralAccessoryLock(guide, source, maps[index], template.strands[index + 1], template, index);
    const mirroredGuide = proceduralGuideForLock(deps.mirrorPartnerFor(guide));
    if (mirroredGuide) {
      const partner = deps.createMirrorPartner(lock, { deferUi: true });
      addLockToClump(partner, mirroredGuide);
      partner.proceduralAccessory = true;
      partner.proceduralAccessoryIndex = index;
    }
    members.push(lock);
  }

  guide.proceduralAccessoryCount = normalizedCount;
  guide.proceduralAccessoryRadius = normalizedRadius;
  guide.proceduralParentHidden = !parentVisible;
  guide.clumpGuideRestPoints = guide.points.map((point) => point.clone());
  guide.clumpGuideRestTwists = [...guide.pointTwists];
  guide.clumpGuideRestScales = guide.pointScales.map((scale) => ({ x: scale.x, z: scale.z }));
  members.forEach((lock, index) => {
    setProceduralAccessoryGeometry(lock, maps[index], index);
    deps.syncActiveMirror(lock, { deferGeometry: false });
  });
  syncProceduralParentVisibility(guide);
  const mirroredGuide = proceduralGuideForLock(deps.mirrorPartnerFor(guide));
  if (mirroredGuide) {
    deps.syncMirrorPartnerFromLock(guide, mirroredGuide);
    mirroredGuide.proceduralDrawGuide = true;
    mirroredGuide.proceduralAccessoryCount = normalizedCount;
    mirroredGuide.proceduralAccessoryRadius = normalizedRadius;
    mirroredGuide.proceduralParentHidden = !parentVisible;
    syncProceduralParentVisibility(mirroredGuide);
  }
  deps.renderLockList();
  deps.updateCount();
}

function clumpFrameAt(curve, t) {
  const point = curve.getPoint(t);
  const y = curve.getTangent(t).normalize();
  const z = deps.outwardNormalAtPoint(point, y);
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return { point, x, y, z };
}

function commitClumpMemberRestState(lock) {
  if (lock?.branchParentId) {
    deps.branchRootBone.captureBranchLocalState(lock);
    return;
  }
  if (!lock?.clumpId || lock.clumpGuide || !lock.points?.length) return;
  const guide = clumpGuideForLock(lock);
  if (!guide?.clumpGuideRestPoints?.length || guide.points.length < 2) return;
  const restGuideCurve = new THREE.CatmullRomCurve3(guide.clumpGuideRestPoints);
  const currentGuideCurve = new THREE.CatmullRomCurve3(guide.points);
  const influence = THREE.MathUtils.clamp(Number(guide.clumpInfluence ?? 1), 0, 1);
  initializeClumpShape(guide);
  const spread = THREE.MathUtils.clamp(guide.clumpSpread, 0, 2.5);
  const depthSpread = THREE.MathUtils.clamp(guide.clumpDepthSpread, 0, 2.5);
  const tipFan = THREE.MathUtils.clamp(guide.clumpTipFan, -1, 1.5);
  const roll = THREE.MathUtils.degToRad(guide.clumpRoll);
  const rollCos = Math.cos(roll);
  const rollSin = Math.sin(roll);
  const strandWidth = THREE.MathUtils.clamp(guide.clumpStrandWidth, 0.1, 2.5);
  const strandDepth = THREE.MathUtils.clamp(guide.clumpStrandDepth, 0.1, 2.5);
  const variation = THREE.MathUtils.clamp(guide.clumpVariation, 0, 1);
  const memberVariation = stableClumpVariation(lock.id);
  const restPoints = [];
  const restTwists = [];
  const restScales = [];

  lock.points.forEach((point, index) => {
    const t = index / Math.max(1, lock.points.length - 1);
    const guideT = clumpMemberGuideParameter(t, lock.clumpParameterStart, lock.clumpParameterEnd);
    const guideIndex = Math.round(guideT * Math.max(0, guide.points.length - 1));
    const restFrame = clumpFrameAt(restGuideCurve, guideT);
    const currentFrame = clumpFrameAt(currentGuideCurve, guideT);
    const fanScale = Math.max(0.04, 1 + tipFan * t);
    const variationScale = 1 + memberVariation.first * variation * 0.16 * t;
    const widthFactor = spread * fanScale * variationScale;
    const depthFactor = depthSpread * fanScale * variationScale;
    const variationBow = Math.sin(Math.PI * t) * memberVariation.second * variation * 0.08;
    const inverseInfluence = 1 - influence;
    const columnX = restFrame.x.clone().multiplyScalar(inverseInfluence)
      .addScaledVector(currentFrame.x, influence * widthFactor * rollCos)
      .addScaledVector(currentFrame.z, influence * widthFactor * rollSin);
    const columnY = restFrame.y.clone().multiplyScalar(inverseInfluence)
      .addScaledVector(currentFrame.y, influence);
    const columnZ = restFrame.z.clone().multiplyScalar(inverseInfluence)
      .addScaledVector(currentFrame.x, -influence * depthFactor * rollSin)
      .addScaledVector(currentFrame.z, influence * depthFactor * rollCos);
    const basis = new THREE.Matrix3().set(
      columnX.x, columnY.x, columnZ.x,
      columnX.y, columnY.y, columnZ.y,
      columnX.z, columnY.z, columnZ.z
    );
    const constant = restFrame.point.clone().multiplyScalar(inverseInfluence)
      .addScaledVector(currentFrame.point, influence)
      .addScaledVector(currentFrame.x, influence * variationBow);
    const coordinates = point.clone().sub(constant);
    if (Math.abs(basis.determinant()) > 1e-8) coordinates.applyMatrix3(basis.invert());
    restPoints.push(restFrame.point.clone()
      .addScaledVector(restFrame.x, coordinates.x)
      .addScaledVector(restFrame.y, coordinates.y)
      .addScaledVector(restFrame.z, coordinates.z));

    const guideTwistDelta = Number(guide.pointTwists[guideIndex] || 0)
      - Number(guide.clumpGuideRestTwists?.[guideIndex] || 0);
    restTwists.push(Number(lock.pointTwists[index] || 0) - guideTwistDelta * influence);

    const guideRestScale = guide.clumpGuideRestScales?.[guideIndex] || { x: 1, z: 1 };
    const guideScale = guide.pointScales[guideIndex] || guideRestScale;
    const widthVariation = 1 + memberVariation.second * variation * 0.12;
    const depthVariation = 1 - memberVariation.second * variation * 0.08;
    const widthScaleFactor = guideScale.x / Math.max(0.18, guideRestScale.x) * strandWidth * widthVariation;
    const depthScaleFactor = guideScale.z / Math.max(0.18, guideRestScale.z) * strandDepth * depthVariation;
    const currentScale = lock.pointScales[index] || { x: 1, z: 1 };
    restScales.push({
      x: currentScale.x / Math.max(1e-6, inverseInfluence + influence * widthScaleFactor),
      z: currentScale.z / Math.max(1e-6, inverseInfluence + influence * depthScaleFactor)
    });
  });

  lock.clumpRestPoints = restPoints;
  lock.clumpRestTwists = restTwists;
  lock.clumpRestScales = restScales;
}

function updateClumpMembers(guide) {
  let members = clumpMembersForGuide(guide);
  if (guide?.proceduralDrawGuide) {
    const proceduralMembers = proceduralAccessoryMembersForGuide(guide);
    if (proceduralMembers.length && guide.points.length >= 2) {
      const count = THREE.MathUtils.clamp(
        Math.round(Number(guide.proceduralAccessoryCount ?? proceduralMembers.length)),
        1,
        16
      );
      const radius = THREE.MathUtils.clamp(Number(guide.proceduralAccessoryRadius ?? 0.7), 0, 2);
      const { maps } = proceduralAccessoryMapsForGuide(guide, count, radius);
      proceduralMembers.forEach((member, index) => {
        if (maps[index]) setProceduralAccessoryGeometry(member, maps[index], index);
      });
    }
    members = members.filter((member) => !member.proceduralAccessory);
  }
  if (!members.length || guide.clumpGuideRestPoints?.length < 2 || guide.points.length < 2) return;
  const restGuideCurve = new THREE.CatmullRomCurve3(guide.clumpGuideRestPoints);
  const currentGuideCurve = new THREE.CatmullRomCurve3(guide.points);
  const influence = THREE.MathUtils.clamp(Number(guide.clumpInfluence ?? 1), 0, 1);
  initializeClumpShape(guide);
  const spread = THREE.MathUtils.clamp(guide.clumpSpread, 0, 2.5);
  const depthSpread = THREE.MathUtils.clamp(guide.clumpDepthSpread, 0, 2.5);
  const tipFan = THREE.MathUtils.clamp(guide.clumpTipFan, -1, 1.5);
  const roll = THREE.MathUtils.degToRad(guide.clumpRoll);
  const strandWidth = THREE.MathUtils.clamp(guide.clumpStrandWidth, 0.1, 2.5);
  const strandDepth = THREE.MathUtils.clamp(guide.clumpStrandDepth, 0.1, 2.5);
  const variation = THREE.MathUtils.clamp(guide.clumpVariation, 0, 1);
  deps.miscState.clumpUpdateInProgress = true;
  try {
    members.forEach((member) => {
      if (member.clumpShapeCurveInheritance) {
        const start = THREE.MathUtils.clamp(Number(member.clumpParameterStart ?? 0), 0, 1);
        const end = THREE.MathUtils.clamp(Number(member.clumpParameterEnd ?? 1), start, 1);
        member.taperCurve = remapEnvelopeCurveRange(guide.taperCurve, start, end);
        member.depthCurve = remapEnvelopeCurveRange(guide.depthCurve, start, end);
        member.taperCurveSecondary = remapEnvelopeCurveRange(
          guide.taperCurveSecondary || guide.taperCurve,
          start,
          end
        );
        member.depthCurveSecondary = remapEnvelopeCurveRange(
          guide.depthCurveSecondary || guide.depthCurve,
          start,
          end
        );
        member.asymmetricWidthCurve = Boolean(guide.asymmetricWidthCurve);
        member.asymmetricDepthCurve = Boolean(guide.asymmetricDepthCurve);
        member.centerAsymmetricProfile = Boolean(guide.centerAsymmetricProfile);
      }
      const memberVariation = stableClumpVariation(member.id);
      if (!member.clumpRestPoints?.length) member.clumpRestPoints = member.points.map((point) => point.clone());
      member.points.forEach((point, index) => {
        const t = index / Math.max(1, member.points.length - 1);
        const guideT = clumpMemberGuideParameter(t, member.clumpParameterStart, member.clumpParameterEnd);
        const guideIndex = Math.round(guideT * Math.max(0, guide.points.length - 1));
        const basePoint = member.clumpRestPoints[index] || member.clumpRestPoints.at(-1);
        const restFrame = clumpFrameAt(restGuideCurve, guideT);
        const currentFrame = clumpFrameAt(currentGuideCurve, guideT);
        const offset = basePoint.clone().sub(restFrame.point);
        const fanScale = Math.max(0.04, 1 + tipFan * t);
        const variationScale = 1 + memberVariation.first * variation * 0.16 * t;
        const offsetX = offset.dot(restFrame.x) * spread * fanScale * variationScale;
        const offsetZ = offset.dot(restFrame.z) * depthSpread * fanScale * variationScale;
        const rollCos = Math.cos(roll);
        const rollSin = Math.sin(roll);
        const rolledX = offsetX * rollCos - offsetZ * rollSin;
        const rolledZ = offsetX * rollSin + offsetZ * rollCos;
        const variationBow = Math.sin(Math.PI * t) * memberVariation.second * variation * 0.08;
        const target = currentFrame.point.clone()
          .addScaledVector(currentFrame.x, rolledX + variationBow)
          .addScaledVector(currentFrame.y, offset.dot(restFrame.y))
          .addScaledVector(currentFrame.z, rolledZ);
        if (member.clumpShapeCurveInheritance && index === 0) {
          point.copy(guide.points[guideIndex]);
        } else {
          point.copy(basePoint).lerp(target, influence);
        }
        const restTwist = Number(member.clumpRestTwists?.[index] ?? member.pointTwists[index] ?? 0);
        const guideTwistDelta = Number(guide.pointTwists[guideIndex] || 0)
          - Number(guide.clumpGuideRestTwists?.[guideIndex] || 0);
        member.pointTwists[index] = restTwist + guideTwistDelta * influence;
        const restScale = member.clumpRestScales?.[index] || member.pointScales[index] || { x: 1, z: 1 };
        const guideRestScale = guide.clumpGuideRestScales?.[guideIndex] || { x: 1, z: 1 };
        const guideScale = guide.pointScales[guideIndex] || guideRestScale;
        const widthVariation = 1 + memberVariation.second * variation * 0.12;
        const depthVariation = 1 - memberVariation.second * variation * 0.08;
        deps.setPointScale(
          member,
          index,
          THREE.MathUtils.lerp(restScale.x, restScale.x * guideScale.x / Math.max(0.18, guideRestScale.x) * strandWidth * widthVariation, influence),
          THREE.MathUtils.lerp(restScale.z, restScale.z * guideScale.z / Math.max(0.18, guideRestScale.z) * strandDepth * depthVariation, influence)
        );
      });
      deps.syncLockFromCurve(member);
      deps.updateLockGeometry(member);
    });
  } finally {
    deps.miscState.clumpUpdateInProgress = false;
  }
}

function dissolveClump(clumpId) {
  if (!clumpId) return;
  deps.clumpOpen.delete(clumpId);
  deps.locks.filter((lock) => lock.clumpId === clumpId).forEach((lock) => {
    delete lock.clumpId;
    delete lock.clumpName;
    delete lock.clumpGuide;
    delete lock.clumpGuideId;
    delete lock.clumpInfluence;
    delete lock.clumpSpread;
    delete lock.clumpDepthSpread;
    delete lock.clumpTipFan;
    delete lock.clumpRoll;
    delete lock.clumpStrandWidth;
    delete lock.clumpStrandDepth;
    delete lock.clumpVariation;
    delete lock.proceduralDrawGuide;
    delete lock.proceduralAccessory;
    delete lock.proceduralAccessoryIndex;
    delete lock.proceduralAccessoryCount;
    delete lock.proceduralAccessoryRadius;
    delete lock.proceduralParentHidden;
    delete lock.proceduralBranchCount;
    delete lock.proceduralBranchLength;
    delete lock.proceduralBranchTipOffset;
    delete lock.clumpRestPoints;
    delete lock.clumpGuideRestPoints;
    delete lock.clumpRestTwists;
    delete lock.clumpGuideRestTwists;
    delete lock.clumpRestScales;
    delete lock.clumpGuideRestScales;
    delete lock.clumpParameterStart;
    delete lock.clumpParameterEnd;
    delete lock.clumpShapeCurveInheritance;
  });
}

function detachLockFromClump(lock) {
  if (!lock?.clumpId) return;
  const guide = clumpGuideForLock(lock);
  if (lock.clumpGuide) {
    dissolveClump(lock.clumpId);
    return;
  }
  delete lock.clumpId;
  delete lock.clumpName;
  delete lock.clumpGuide;
  delete lock.clumpGuideId;
  delete lock.clumpInfluence;
  delete lock.proceduralAccessory;
  delete lock.proceduralAccessoryIndex;
  delete lock.proceduralBranch;
  delete lock.proceduralBranchIndex;
  delete lock.clumpRestPoints;
  delete lock.clumpRestTwists;
  delete lock.clumpRestScales;
  delete lock.clumpParameterStart;
  delete lock.clumpParameterEnd;
  delete lock.clumpShapeCurveInheritance;
  const remaining = guide ? clumpMembersForGuide(guide) : [];
  if (guide && remaining.length < 1) dissolveClump(guide.clumpId);
}

function mirroredClumpPartners(guide) {
  return outlinerClumpLocks(guide)
    .map((lock) => deps.mirrorPartnerFor(lock))
    .filter(Boolean);
}

function createMirroredClump(guide, options = {}) {
  const sourceLocks = outlinerClumpLocks(guide);
  if (!guide?.clumpGuide || sourceLocks.length < 2) return null;
  if (sourceLocks.some((lock) => deps.mirrorPartnerFor(lock))) return null;
  const mirroredLocks = sourceLocks
    .map((lock) => deps.createMirrorPartner(lock, { deferUi: true }))
    .filter(Boolean);
  if (mirroredLocks.length !== sourceLocks.length) return null;
  const mirroredGuide = createClumpFromLocks(mirroredLocks, {
    name: guide.clumpName || nextClumpName()
  });
  if (!mirroredGuide) return null;
  deps.syncMirrorPartnerFromLock(guide, mirroredGuide, { updateClump: false });
  updateClumpMembers(mirroredGuide);
  deps.clumpOpen.set(mirroredGuide.clumpId, false);
  if (!options.deferUi) {
    deps.renderLockList();
    deps.updateCount();
  }
  return mirroredGuide;
}

function decoupleMirroredClump(guide) {
  const sourceLocks = outlinerClumpLocks(guide);
  const linkedLocks = sourceLocks.filter((lock) => deps.mirrorPartnerFor(lock));
  if (!linkedLocks.length) return false;
  linkedLocks.forEach(deps.decoupleMirrorPartner);
  deps.renderLockList();
  return true;
}

function syncClumpGuidePanel(lock = deps.getSelectedLock()) {
  const guide = clumpGuideForLock(lock);
  const inClump = Boolean(lock?.clumpId && guide);
  deps.clumpGuidePanel.classList.toggle("hidden", !inClump);
  if (!inClump) return;
  const memberCount = clumpMembersForGuide(guide).length;
  const influence = THREE.MathUtils.clamp(Number(guide.clumpInfluence ?? 1), 0, 1);
  initializeClumpShape(guide);
  deps.clumpGuideStatus.textContent = lock.clumpGuide
    ? `${lock.clumpName || "Clump"} guide - ${memberCount} bound ${memberCount === 1 ? "strand" : "strands"}`
    : `${lock.clumpName || "Clump"} member - driven by ${guide.name}`;
  deps.clumpInfluenceControl.classList.toggle("hidden", !lock.clumpGuide);
  deps.clumpShapeControls.classList.toggle("hidden", !lock.clumpGuide);
  deps.clumpInfluenceInput.value = influence;
  deps.clumpInfluenceValue.textContent = influence.toFixed(2);
  Object.entries(deps.clumpShapeInputs).forEach(([key, input]) => {
    input.value = guide[`clump${key[0].toUpperCase()}${key.slice(1)}`];
  });
  deps.clumpShapeValues.spread.textContent = guide.clumpSpread.toFixed(2);
  deps.clumpShapeValues.depthSpread.textContent = guide.clumpDepthSpread.toFixed(2);
  deps.clumpShapeValues.tipFan.textContent = guide.clumpTipFan.toFixed(2);
  deps.clumpShapeValues.roll.textContent = `${Math.round(guide.clumpRoll)}°`;
  deps.clumpShapeValues.strandWidth.textContent = guide.clumpStrandWidth.toFixed(2);
  deps.clumpShapeValues.strandDepth.textContent = guide.clumpStrandDepth.toFixed(2);
  deps.clumpShapeValues.variation.textContent = guide.clumpVariation.toFixed(2);
}

function selectionCanBecomeClump(selection = deps.selectedLocksInOrder()) {
  return selection.length >= 2
    && selection.every((lock) => lock.geometryType === "strand" && !lock.clumpId);
}

function createClumpFromSelection() {
  const selection = deps.selectedLocksInOrder();
  if (!selectionCanBecomeClump(selection)) return null;
  deps.pushUndoState();
  const guide = createClumpFromLocks(selection);
  if (!guide) return null;
  deps.clumpOpen.set(guide.clumpId, false);
  deps.selectLock(guide.id);
  deps.renderLockList();
  return guide;
}

function outlinerClumpLocks(guide) {
  return guide?.clumpGuide ? [guide, ...clumpMembersForGuide(guide)] : [];
}

function handleOutlinerClumpDrop(event, targetLock) {
  event.preventDefault();
  event.stopPropagation();
  const sourceId = event.dataTransfer?.getData("text/plain");
  const source = deps.locks.find((lock) => lock.id === sourceId);
  const targetGuide = clumpGuideForLock(targetLock);
  if (!source || !targetLock || source.id === targetLock.id) return;
  if (source.clumpGuide) return;
  if (targetGuide && source.clumpId === targetGuide.clumpId) return;
  deps.pushUndoState();
  let guide = targetGuide;
  if (guide) {
    if (!addLockToClump(source, guide)) return;
  } else {
    if (source.clumpId) detachLockFromClump(source);
    guide = createClumpFromLocks([targetLock, source]);
  }
  if (!guide) return;
  deps.clumpOpen.set(guide.clumpId, false);
  deps.selectLock(guide.id);
  deps.renderLockList();
}

function createOutlinerClump(guide) {
  const clumpLocks = outlinerClumpLocks(guide);
  const isOpen = deps.clumpOpen.get(guide.clumpId) === true;
  const selectedLock = deps.getSelectedLock();
  const containsSelection = clumpLocks.some((lock) => deps.sel.selectedStrandIds.has(lock.id));
  const container = document.createElement("div");
  container.className = `outliner-clump${isOpen ? " open" : ""}${containsSelection ? " selected" : ""}`;
  const header = document.createElement("div");
  header.className = "outliner-clump-head";
  header.title = "Clump container";
  const disclosure = document.createElement("button");
  disclosure.type = "button";
  disclosure.className = "outliner-clump-disclosure";
  disclosure.textContent = ">";
  disclosure.title = `${isOpen ? "Collapse" : "Expand"} ${guide.clumpName || "clump"}`;
  disclosure.setAttribute("aria-expanded", String(isOpen));
  disclosure.addEventListener("click", () => {
    deps.clumpOpen.set(guide.clumpId, !isOpen);
    deps.renderLockList();
  });
  const clumpVisibleCount = clumpLocks.filter(deps.strandVisibleForDisplay).length;
  const visibility = deps.createOutlinerVisibilityToggle({
    visible: clumpLocks.length > 0 && clumpVisibleCount === clumpLocks.length,
    partial: clumpVisibleCount > 0 && clumpVisibleCount < clumpLocks.length,
    label: guide.clumpName || "Clump",
    onToggle: () => {
      deps.pushUndoState();
      deps.setLocksOutlinerVisibility(clumpLocks, clumpVisibleCount !== clumpLocks.length);
    }
  });
  const select = document.createElement("button");
  select.type = "button";
  select.className = "outliner-clump-select";
  const folderIcon = document.createElement("span");
  folderIcon.className = "outliner-folder-icon";
  folderIcon.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "outliner-rename-label";
  label.textContent = guide.clumpName || "Clump";
  const count = document.createElement("span");
  count.className = "outliner-clump-count";
  count.textContent = clumpLocks.length;
  select.append(folderIcon, label, count);
  select.addEventListener("click", (event) => deps.handleOutlinerRenameClick(event, {
    label,
    value: guide.clumpName || "Clump",
    onSelect: () => deps.selectLock(guide.id),
    onCommit: (nextName) => {
      clumpLocks.forEach((lock) => {
        lock.clumpName = nextName;
      });
      syncClumpGuidePanel();
    },
    rerender: deps.renderLockList
  }));
  [header, select].forEach((target) => {
    target.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("text/plain")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      header.classList.add("drop-target");
    });
    target.addEventListener("dragleave", () => header.classList.remove("drop-target"));
    target.addEventListener("drop", (event) => {
      header.classList.remove("drop-target");
      handleOutlinerClumpDrop(event, guide);
    });
  });
  header.append(disclosure, visibility, select);
  header.addEventListener("contextmenu", (event) => deps.showOutlinerContextMenu(event, {
    type: "clump",
    clumpId: guide.clumpId,
    guideId: guide.id
  }));
  const children = document.createElement("div");
  children.className = "outliner-clump-children";
  children.appendChild(deps.createOutlinerStrandButton(guide, { nested: true }));
  clumpDirectMembers(guide).forEach((lock) => children.appendChild(deps.createOutlinerStrandButton(lock, { nested: true })));
  container.append(header, children);
  return container;
}

function proceduralParentOutlineVisible(lock) {
  return Boolean(
    lock?.proceduralParentHidden
    && (lock.id === deps.sel.selectedId || deps.sel.selectedStrandIds.has(lock.id))
  );
}

function syncProceduralParentVisibility(lock) {
  if (!lock?.mesh?.material) return;
  lock.mesh.material.visible = !lock.proceduralParentHidden;
  lock.mesh.castShadow = !lock.proceduralParentHidden;
  if (lock.wireOverlay) {
    deps.syncLockedStrandWireVisual(lock);
  }
}

function syncProceduralAccessoryEditControls(guide = proceduralGuideForLock(deps.getSelectedLock())) {
  const visible = Boolean(guide);
  deps.proceduralAccessoryEditPanel.classList.toggle("hidden", !visible);
  if (!guide) return;
  const members = proceduralAccessoryMembersForGuide(guide);
  const count = THREE.MathUtils.clamp(
    Math.round(Number(guide.proceduralAccessoryCount ?? members.length)),
    0,
    16
  );
  const radius = THREE.MathUtils.clamp(Number(guide.proceduralAccessoryRadius ?? 0.7), 0, 2);
  const branchCount = THREE.MathUtils.clamp(
    Math.round(Number(guide.proceduralBranchCount ?? proceduralBranchMembersForGuide(guide).length)),
    0,
    64
  );
  const branchLength = THREE.MathUtils.clamp(Number(guide.proceduralBranchLength ?? 0.6), 0.1, 3);
  const branchTipOffset = THREE.MathUtils.clamp(Number(guide.proceduralBranchTipOffset ?? 0.35), 0, 2);
  guide.proceduralBranchLengthCurve = normalizeTaperCurve(
    guide.proceduralBranchLengthCurve || deps.DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE
  );
  guide.proceduralBranchShapeCurve = normalizeTaperCurve(
    guide.proceduralBranchShapeCurve || deps.DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE
  );
  deps.proceduralAccessoryEditCountInput.value = String(count);
  deps.proceduralAccessoryEditCountValue.textContent = String(count);
  deps.proceduralAccessoryEditRadiusInput.value = String(radius);
  deps.proceduralAccessoryEditRadiusValue.textContent = radius.toFixed(2);
  deps.proceduralAccessoryEditParentVisibleInput.checked = !guide.proceduralParentHidden;
  deps.proceduralBranchEditCountInput.value = String(branchCount);
  deps.proceduralBranchEditCountValue.textContent = String(branchCount);
  deps.proceduralBranchEditLengthInput.value = String(branchLength);
  deps.proceduralBranchEditLengthValue.textContent = branchLength.toFixed(2);
  deps.taperEditor.renderTaperPreview(deps.proceduralBranchLengthCurvePreview, guide, "proceduralBranchLengthCurve");
  deps.taperEditor.renderTaperPreview(deps.proceduralBranchShapeCurvePreview, guide, "proceduralBranchShapeCurve");
  deps.proceduralBranchEditTipOffsetInput.value = String(branchTipOffset);
  deps.proceduralBranchEditTipOffsetValue.textContent = branchTipOffset.toFixed(2);
}

function setProceduralDrawExperimentalEnabled(enabled, { persist = true } = {}) {
  deps.draw.proceduralDrawExperimentalEnabled = Boolean(enabled);
  deps.proceduralDrawExperimentalPreferenceInput.checked = deps.draw.proceduralDrawExperimentalEnabled;
  deps.proceduralDrawToolButton.classList.toggle("experimental-tool-hidden", !deps.draw.proceduralDrawExperimentalEnabled);
  deps.proceduralDrawToolButton.hidden = !deps.draw.proceduralDrawExperimentalEnabled;
  deps.proceduralDrawToolButton.setAttribute("aria-hidden", String(!deps.draw.proceduralDrawExperimentalEnabled));
  deps.proceduralDrawToolButton.tabIndex = deps.draw.proceduralDrawExperimentalEnabled ? 0 : -1;
  if (!deps.draw.proceduralDrawExperimentalEnabled && deps.sel.activeTool === "procedural-draw") {
    deps.setActiveTool("draw");
  }
  if (persist) {
    deps.saveBooleanPreference(deps.PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY, deps.draw.proceduralDrawExperimentalEnabled);
  }
}

function beginProceduralAccessoryEdit() {
  if (deps.sculptState.proceduralAccessoryEditHistoryOpen) return;
  deps.pushUndoState();
  deps.sculptState.proceduralAccessoryEditHistoryOpen = true;
}

function updateSelectedProceduralAccessories() {
  const guide = proceduralGuideForLock(deps.getSelectedLock());
  if (!guide) return;
  deps.proceduralAccessoryEditCountValue.textContent = String(Math.round(Number(deps.proceduralAccessoryEditCountInput.value)));
  deps.proceduralAccessoryEditRadiusValue.textContent = Number(deps.proceduralAccessoryEditRadiusInput.value).toFixed(2);
  deps.proceduralBranchEditCountValue.textContent = String(Math.round(Number(deps.proceduralBranchEditCountInput.value)));
  deps.proceduralBranchEditLengthValue.textContent = Number(deps.proceduralBranchEditLengthInput.value).toFixed(2);
  deps.proceduralBranchEditTipOffsetValue.textContent = Number(deps.proceduralBranchEditTipOffsetInput.value).toFixed(2);
  applyProceduralAccessorySettings(guide, {
    count: deps.proceduralAccessoryEditCountInput.value,
    radius: deps.proceduralAccessoryEditRadiusInput.value,
    parentVisible: deps.proceduralAccessoryEditParentVisibleInput.checked
  });
  applyProceduralBranchSettings(guide, {
    count: deps.proceduralBranchEditCountInput.value,
    length: deps.proceduralBranchEditLengthInput.value,
    tipOffset: deps.proceduralBranchEditTipOffsetInput.value
  });
  syncProceduralAccessoryEditControls(guide);
}

  return {
    nextClumpName,
    initializeClumpShape,
    stableClumpVariation,
    createClumpFromLocks,
    addLockToClump,
    pointerToNdc,
    gridProfileSkipCol,
    clumpDirectMembers,
    clumpMembersForGuide,
    clumpGuideForLock,
    proceduralGuideForLock,
    proceduralAccessoryMembersForGuide,
    proceduralBranchMembersForGuide,
    proceduralBranchTemplatesForGuide,
    proceduralBranchWorldPoints,
    applyProceduralBranchSettings,
    proceduralAccessoryMapsForGuide,
    setProceduralAccessoryGeometry,
    createProceduralAccessoryLock,
    applyProceduralAccessorySettings,
    clumpFrameAt,
    commitClumpMemberRestState,
    updateClumpMembers,
    dissolveClump,
    detachLockFromClump,
    mirroredClumpPartners,
    createMirroredClump,
    decoupleMirroredClump,
    syncClumpGuidePanel,
    selectionCanBecomeClump,
    createClumpFromSelection,
    outlinerClumpLocks,
    handleOutlinerClumpDrop,
    createOutlinerClump,
    proceduralParentOutlineVisible,
    syncProceduralParentVisibility,
    syncProceduralAccessoryEditControls,
    setProceduralDrawExperimentalEnabled,
    beginProceduralAccessoryEdit,
    updateSelectedProceduralAccessories,
  };
}
