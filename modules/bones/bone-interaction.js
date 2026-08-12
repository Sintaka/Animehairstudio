// bone-interaction.js - Bone gizmo / handle drag / brush interaction (refactor bones B2).
// Extracted from app.js; coupling injected via createXxxApi(deps).
import * as THREE from "three";
import { splitBonesFor, materializeSplitBones } from "./bone-model.js?v=20260813-1";
import { materializeStrandSplitBones } from "./bone-model.js?v=20260813-1";
import { leafIndexAt, leafWeightsValid } from "../geometry/leaf-weights.js?v=20260813-1";
import { smoothSculptPointDeltas } from "../sculpt/sculpt-brush.js?v=20260806-1";

// deps: store .state proxies (sculptState/sel/guideState/scalpState) + module instances
//   (taperEditor/panelTipStrand/sculptGeom + segmentApi.syncPanelSegmentControls for B2->B1) +
//   shared objects (locks/renderer/camera/raycaster/pointer/transformControls) + DOM elements
//   (taperCurveEditor/sculptBrushRadiusInput/sculptBrushFalloffInput/sculptBrushStrengthInput/
//   sculptBrushStrengthByTool) + app.js helper functions (getSelectedLock/isPanelGeometry/
//   pushUndoState/updateLockGeometry/updateCurveObjects/updateInteractionLocks/updateTopologyStats/
//   syncActiveMirror/configureTransformControls/effectiveSculptBrushTool/guidedNormalAt/strandFrameAt/
//   signedAngleAroundAxis/pointerOverTaperEditor/componentEditModeActive/selectLock/
//   strandControlPointHitFromEvent/pointerHitsTransformGizmo/addStrandControlPointSelection/
//   activateStrandControlPoint/closestStrandCurveParameter/clonePanelSplits/snapPanelSplitHeight/
//   strandGeometryCurve/strandSplitProfileData/strandSplitControlPoint/panelSplitControlPoint).
// Batch-fill point in app.js: after the taperEditorDeps batch (all deps defined).
export function createBoneInteractionApi(deps) {
function beginTipSubBoneRotate(handle) {
  const lock = deps.locks.find((item) => item.id === handle?.userData?.lockId);
  const segment = handle?.userData?.panelTipIndex;
  const point = handle?.userData?.panelTipPoint;
  if (!lock || segment == null || point == null) return;
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  const bones = materializeSplitBones(lock);
  const bone = bones[segment];
  if (!bone) return;
  const tip = deps.panelTipStrand.splitTipForSegment(lock, segment, splits, bone);
  if (!tip || point >= tip.points.length) return;
  // 确保有 authored tip 状态（与视平面拖拽相同：points/restPoints 快照）。
  if (!bone.tip || !Array.isArray(bone.tip.points) || bone.tip.points.length !== tip.points.length) {
    bone.tip = {
      points: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      restPoints: tip.restPoints.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      active: true
    };
  }
  deps.sculptState.tipSubBoneRotateDrag = {
    lockId: lock.id,
    segmentIndex: segment,
    tipPoint: point,
    startQuaternion: handle.quaternion.clone(),
    startPoints: bone.tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z }))
  };
}

function applyTipSubBoneTransform(lock, handle) {
  const mode = deps.transformControls.mode;
  if (mode === "scale") {
    // scale 暂不应用：把手缩放恢复创建时的基准值，避免 gizmo 视觉累积。
    handle.scale.setScalar(0.42);
    return;
  }
  if (mode !== "rotate") return;
  const drag = deps.sculptState.tipSubBoneRotateDrag;
  if (!drag || drag.lockId !== lock.id) return;
  const segment = handle.userData.panelTipIndex;
  const point = handle.userData.panelTipPoint;
  if (drag.segmentIndex !== segment || drag.tipPoint !== point) return;
  const dq = drag.startQuaternion.clone().invert().multiply(handle.quaternion);
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  const bones = materializeSplitBones(lock);
  const bone = bones[segment];
  if (!bone || !bone.tip || !Array.isArray(bone.tip.points) || bone.tip.points.length < 2) return;
  const pivot = drag.startPoints[point];
  if (!pivot) return;
  const pivotVec = new THREE.Vector3(pivot.x, pivot.y, pivot.z);
  for (let i = point; i < bone.tip.points.length; i += 1) {
    const src = drag.startPoints[i] || { x: 0, y: 0, z: 0 };
    const rotated = new THREE.Vector3(src.x, src.y, src.z).sub(pivotVec).applyQuaternion(dq).add(pivotVec);
    bone.tip.points[i] = { x: rotated.x, y: rotated.y, z: rotated.z };
  }
  bone.tip.active = true;
  deps.updateLockGeometry(lock, { immediate: true });
  deps.updateCurveObjects(lock, { visible: true });
  deps.syncActiveMirror(lock, { deferGeometry: false });
}

function beginPanelSplitHandleDrag(event) {
  if (event.button !== 0 || event.shiftKey || event.altKey || event.metaKey) return false;
  const lock = deps.getSelectedLock();
  const panelHandles = deps.isPanelGeometry(lock) && lock.curveObjects?.group.visible
    ? lock.curveObjects.panelSplitHandles || []
    : [];
  const segmentHandles = deps.isPanelGeometry(lock) && lock.curveObjects?.group.visible
    ? lock.curveObjects.panelSegmentHandles || []
    : [];
  const tipHandles = deps.isPanelGeometry(lock) && lock.curveObjects?.group.visible
    ? lock.curveObjects.panelTipHandles || []
    : [];
  const tipWidthHandles = deps.isPanelGeometry(lock) && lock.curveObjects?.group.visible
    ? (lock.curveObjects.tipWidthHandles || []).flatMap((seg) => [...seg.left, ...seg.right])
    : [];
  const strandHandle = lock?.geometryType === "strand"
    && lock.strandSplitEnabled
    && lock.curveObjects?.group.visible
    && lock.curveObjects.strandSplitHandle?.visible
    ? [lock.curveObjects.strandSplitHandle]
    : [];
  const strandSplitTipHandles = lock?.geometryType === "strand" && lock.strandSplitEnabled && lock.curveObjects?.group.visible
    ? (lock.curveObjects.strandSplitTipHandles || [])
    : [];
  const handles = [...tipWidthHandles, ...panelHandles, ...segmentHandles, ...tipHandles, ...strandHandle, ...strandSplitTipHandles];
  if (!handles.length) return false;
  const hit = deps.raycaster.intersectObjects(handles.filter((handle) => handle.visible), false)[0];
  if (!hit) return false;
  // Ctrl+drag is the tip width asymmetric edit; it must not grab zipper/segment/tip handles.
  if (event.ctrlKey && hit.object.userData.tipWidthIndex == null) return false;
  const gizmoTipIndex = hit.object.userData.panelTipIndex != null ? hit.object.userData.panelTipIndex : null;
  if (gizmoTipIndex != null && ["rotate", "scale"].includes(deps.sel.activeTool)) {
    // 旋转/缩放工具：tip 手柄挂到 transform gizmo（与 strand 控制点一致），不做视平面
    // 拖拽；旋转增量在 objectChange 的 applyTipSubBoneTransform 里应用。
    deps.sculptState.panelTipSelection = { lockId: lock.id, segmentIndex: gizmoTipIndex };
    deps.sculptState.panelSegmentIndex = gizmoTipIndex;
    deps.syncPanelSegmentControls(lock);
    deps.transformControls.detach();
    deps.configureTransformControls(deps.sel.activeTool);
    deps.transformControls.attach(hit.object);
    hit.object.userData.tipSubBoneHandle = true;
    deps.updateCurveObjects(lock, { visible: true });
    deps.updateInteractionLocks();
    event.preventDefault();
    return true;
  }
  deps.pushUndoState();
  deps.transformControls.detach();
  const tipIndex = hit.object.userData.panelTipIndex != null ? hit.object.userData.panelTipIndex : null;
  const tipPoint = hit.object.userData.panelTipPoint != null ? hit.object.userData.panelTipPoint : null;
  const tipWidthIndex = hit.object.userData.tipWidthIndex != null ? hit.object.userData.tipWidthIndex : null;
  const tipWidthSegment = hit.object.userData.tipWidthSegment != null ? hit.object.userData.tipWidthSegment : null;
  const tipWidthSide = hit.object.userData.tipWidthSide != null ? hit.object.userData.tipWidthSide : null;
  let tipStartWorld = null;
  let tipWidthT = null;
  let tipWidthStartWorld = null;
  let tipWidthStartLatOffset = null;
  let tipWidthStartMult = null;
  let tipWidthStartClientX = null;
  let tipWidthStartClientY = null;
  let tipWidthStartEdgeScreenDist = null;
  let tipWidthBones = null;
  let splitTipTube = null;
  let splitTipStartWorld = null;
  let splitTipPoint = null;
  if (tipIndex != null && tipPoint != null) {
    // Selecting a tip sub-bone: remember it and point the segment controls at it.
    deps.sculptState.panelTipSelection = { lockId: lock.id, segmentIndex: tipIndex };
    deps.sculptState.panelSegmentIndex = tipIndex;
    deps.syncPanelSegmentControls(lock);
    const tipSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const tip = deps.panelTipStrand.splitTipForSegment(lock, tipIndex, tipSplits, splitBonesFor(lock)[tipIndex] || null);
    if (tip && tip.points[tipPoint]) tipStartWorld = new THREE.Vector3(tip.points[tipPoint].x, tip.points[tipPoint].y, tip.points[tipPoint].z);
  } else if (tipWidthSegment != null && tipWidthSide != null && tipWidthIndex != null) {
    // Selecting a tip width control point also selects that tip sub-bone.
    deps.sculptState.panelTipSelection = { lockId: lock.id, segmentIndex: tipWidthSegment };
    deps.sculptState.panelSegmentIndex = tipWidthSegment;
    deps.syncPanelSegmentControls(lock);
    const tipSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    // 拖拽开始时只 materialize 一次（深克隆 + 双写 lock.splitBones/lock.bones），
    // 拖拽期间复用同一数组，避免每个 pointermove 都重复深克隆全部骨骼。
    tipWidthBones = materializeSplitBones(lock);
    const tipBone = tipWidthBones[tipWidthSegment] || null;
    const placement = deps.panelTipStrand.tipWidthControlPlacement(lock, tipWidthSegment, tipSplits, tipBone, tipWidthSide, tipWidthIndex);
    if (placement) {
      tipWidthT = placement.t;
      tipWidthStartWorld = placement.point.clone();
      // Stable drag basis: the edge's signed lateral distance and the current width
      // multiplier, so dragging scales width by a ratio (no feedback collapse).
      tipWidthStartLatOffset = placement.point.clone().sub(placement.center).dot(placement.lateral);
      const boundaries = [-1, ...tipSplits.map((split) => split.position), 1];
      const edgeU = boundaries[tipWidthSide < 0 ? tipWidthSegment : tipWidthSegment + 1];
      const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
      tipWidthStartMult = deps.panelTipStrand.tipPanelWidthAt(lock, placement.t, edgeU, tipBone, tipWidthSegment, tipSplits) / fullWidth;
      tipWidthStartClientX = event.clientX;
      tipWidthStartClientY = event.clientY;
      const rect = deps.renderer.domElement.getBoundingClientRect();
      tipWidthStartEdgeScreenDist = Math.max(0.0001, deps.sculptGeom.viewportPixelPoint(placement.center, rect).distanceTo(deps.sculptGeom.viewportPixelPoint(placement.point, rect)));
    }
  }
  if (hit.object.userData.strandSplitTipTube != null) {
    // Split-strand per-tube tip handle: anchor the drag on the tube tip chain's last
    // point (view-plane move, same mapping as the panel tip branch).
    const tube = hit.object.userData.strandSplitTipTube;
    const chains = deps.currentStrandSplitTipChains(lock);
    const chain = chains?.[tube];
    if (chain && chain.points.length > 0) {
      splitTipTube = tube;
      const last = chain.points[chain.points.length - 1];
      splitTipStartWorld = new THREE.Vector3(last.x, last.y, last.z);
      splitTipPoint = chain.points.length - 1;
    }
  }
  deps.sculptState.panelSplitDrag = {
    pointerId: event.pointerId,
    lockId: lock.id,
    kind: tipWidthIndex != null ? "tipWidth" : tipIndex != null ? "tip" : splitTipTube != null
      ? "strandTip"
      : hit.object.userData.strandSplitHandle
        ? "strand"
        : hit.object.userData.panelSegmentIndex != null
          ? "segment"
          : "panel",
    splitIndex: tipWidthSegment != null ? tipWidthSegment : tipIndex != null ? tipIndex : splitTipTube != null
      ? splitTipTube
      : hit.object.userData.panelSegmentIndex != null
        ? hit.object.userData.panelSegmentIndex
        : hit.object.userData.panelSplitIndex,
    tipPoint: splitTipPoint != null ? splitTipPoint : tipPoint,
    tipStartWorld: splitTipStartWorld != null ? splitTipStartWorld : tipStartWorld,
    tipWidthSide,
    tipWidthIndex,
    tipWidthT,
    tipWidthStartWorld,
    tipWidthStartLatOffset,
    tipWidthStartMult,
    tipWidthStartClientX,
    tipWidthStartClientY,
    tipWidthStartEdgeScreenDist,
    tipWidthBones
  };
  deps.renderer.domElement.setPointerCapture?.(event.pointerId);
  deps.renderer.domElement.style.cursor = "grabbing";
  deps.updateCurveObjects(lock, { visible: true });
  deps.updateInteractionLocks();
  return true;
}

function updatePanelSplitHandleDrag(event) {
  if (!deps.sculptState.panelSplitDrag || event.pointerId !== deps.sculptState.panelSplitDrag.pointerId) return;
  const lock = deps.locks.find((item) => item.id === deps.sculptState.panelSplitDrag.lockId);
  if (!lock) {
    endPanelSplitHandleDrag(event);
    return;
  }
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const targetX = event.clientX - rect.left;
  const targetY = event.clientY - rect.top;
  const curve = deps.strandGeometryCurve(lock);
  let best = null;
  if (deps.sculptState.panelSplitDrag.kind === "strand") {
    const profileData = deps.strandSplitProfileData(lock);
    for (let tStep = 0; tStep <= 48; tStep += 1) {
      const t = THREE.MathUtils.lerp(0.2, 0.98, tStep / 48);
      for (let uStep = 0; uStep <= 40; uStep += 1) {
        const u = THREE.MathUtils.lerp(-0.8, 0.8, uStep / 40);
        const projected = deps.strandSplitControlPoint(
          lock,
          { position: u, height: 1 - t },
          t,
          curve,
          profileData
        ).project(deps.camera);
        if (projected.z < -1 || projected.z > 1) continue;
        const x = (projected.x * 0.5 + 0.5) * rect.width;
        const y = (-projected.y * 0.5 + 0.5) * rect.height;
        const distanceSq = (x - targetX) ** 2 + (y - targetY) ** 2;
        if (!best || distanceSq < best.distanceSq) best = { distanceSq, position: u, height: 1 - t };
      }
    }
    if (!best) return;
    lock.strandSplitPosition = THREE.MathUtils.clamp(best.position, -0.8, 0.8);
    lock.strandSplitHeight = THREE.MathUtils.clamp(best.height, 0.02, 0.8);
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    event.preventDefault();
    return;
  }
  if (deps.sculptState.panelSplitDrag.kind === "tip") {
    // View-plane move of the segment's tip sub-bone control point: the pointer's NDC
    // position at the tip's depth becomes the new tip point (length + direction).
    const startWorld = deps.sculptState.panelSplitDrag.tipStartWorld;
    if (!startWorld) return;
    const startProj = startWorld.clone().project(deps.camera);
    const ndcX = (2 * targetX) / rect.width - 1;
    const ndcY = -((2 * targetY) / rect.height - 1);
    const newWorld = new THREE.Vector3(ndcX, ndcY, startProj.z).unproject(deps.camera);
    const segment = deps.sculptState.panelSplitDrag.splitIndex;
    const point = deps.sculptState.panelSplitDrag.tipPoint;
    const bones = materializeSplitBones(lock);
    const bone = bones[segment];
    if (!bone) return;
    const splitsForTip = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const tip = deps.panelTipStrand.splitTipForSegment(lock, segment, splitsForTip, bone);
    if (!tip || tip.restPoints.length < 1 || point == null || point >= tip.restPoints.length) return;
    const rest = tip.restPoints;
    // Preserve deltas on other chain points; only the dragged point moves.
    const authored = (Array.isArray(bone.tip?.points) && bone.tip.points.length === rest.length)
      ? bone.tip
      : {
        points: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
        restPoints: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
        active: true
      };
    const delta = newWorld.clone().sub(rest[point]);
    authored.points[point] = {
      x: rest[point].x + delta.x,
      y: rest[point].y + delta.y,
      z: rest[point].z + delta.z
    };
    authored.restPoints = rest.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    authored.active = true;
    bone.tip = authored;
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    event.preventDefault();
    return;
  }
  if (deps.sculptState.panelSplitDrag.kind === "strandTip") {
    // Split-strand per-tube tip handle: view-plane move of the tube tip chain's last
    // point (same NDC-at-depth mapping as the panel tip branch), written to
    // bone.tip authored points.
    const startWorld = deps.sculptState.panelSplitDrag.tipStartWorld;
    if (!startWorld) return;
    const startProj = startWorld.clone().project(deps.camera);
    const ndcX = (2 * targetX) / rect.width - 1;
    const ndcY = -((2 * targetY) / rect.height - 1);
    const newWorld = new THREE.Vector3(ndcX, ndcY, startProj.z).unproject(deps.camera);
    const tube = deps.sculptState.panelSplitDrag.splitIndex;
    const point = deps.sculptState.panelSplitDrag.tipPoint;
    const bones = materializeStrandSplitBones(lock);
    const bone = bones?.[tube];
    if (!bone) return;
    const chains = deps.currentStrandSplitTipChains(lock);
    const tip = chains?.[tube];
    if (!tip || !tip.restPoints || point == null || point >= tip.restPoints.length) return;
    const rest = tip.restPoints;
    const authored = (Array.isArray(bone.tip?.points) && bone.tip.points.length === rest.length)
      ? bone.tip
      : {
        points: rest.map((p) => ({ ...p })),
        restPoints: rest.map((p) => ({ ...p })),
        active: true
      };
    const delta = newWorld.clone().sub(new THREE.Vector3(rest[point].x, rest[point].y, rest[point].z));
    authored.points[point] = {
      x: rest[point].x + delta.x,
      y: rest[point].y + delta.y,
      z: rest[point].z + delta.z
    };
    authored.restPoints = rest.map((p) => ({ ...p }));
    authored.active = true;
    bone.tip = authored;
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    event.preventDefault();
    return;
  }
  if (deps.sculptState.panelSplitDrag.kind === "tipWidth") {
    const drag = deps.sculptState.panelSplitDrag;
    const segment = drag.splitIndex;
    const side = drag.tipWidthSide;
    const t = drag.tipWidthT;
    if (segment == null || side == null || t == null) return;
    const splitsForWidth = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    // 复用拖拽开始时 materialize 的骨骼数组（它就是 lock.splitBones，编辑持续生效）；
    // 缺失或数量不对时回退重新 materialize，避免每个 pointermove 都深克隆全部骨骼。
    const bones = Array.isArray(drag.tipWidthBones) && drag.tipWidthBones.length === splitsForWidth.length + 1
      ? drag.tipWidthBones
      : materializeSplitBones(lock);
    const bone = bones[segment];
    if (!bone) return;
    const tip = deps.panelTipStrand.splitTipForSegment(lock, segment, splitsForWidth, bone);
    if (!tip || tip.points.length < 2) return;
    const edge = deps.panelTipStrand.tipWidthEdgePosition(lock, segment, splitsForWidth, bone, side, t);
    if (!edge) return;
    const center = edge.center;
    const lateral = edge.lateral;
    const startWorld = drag.tipWidthStartWorld || center;
    const startProj = startWorld.clone().project(deps.camera);
    const ndcX = (2 * targetX) / rect.width - 1;
    const ndcY = -((2 * targetY) / rect.height - 1);
    const cursorWorld = new THREE.Vector3(ndcX, ndcY, startProj.z).unproject(deps.camera);
    // World-space relative mapping (no screen foreshortening amplification): the width
    // multiplier follows the cursor's WORLD lateral distance from the chain center,
    // scaled by the start edge distance. At drag start latOffset == startLatOffset so
    // nothing jumps; the response is proportional to the real lateral movement, not the
    // on-screen edge size (which made tiny drags jump a whole "layer" when foreshortened).
    const latOffset = cursorWorld.clone().sub(center).dot(lateral);
    const startLatOffset = Math.max(0.0001, drag.tipWidthStartLatOffset || 0.0001);
    // Half sensitivity: a full edge-length drag changes the width by ~50% instead of
    // 100%, so tiny drags don't jump the whole side (the "dent" on drag start).
    const ratio = latOffset / startLatOffset;
    const rawMult = (drag.tipWidthStartMult ?? 1) * (1 + (ratio - 1) * 0.5);
    // Floor at 30% of the drag's start width (absolute min 0.08): a single inward drag
    // can thin the tip but not collapse it into a needle (repeated drags thin further).
    const floorMult = Math.max(0.08, (drag.tipWidthStartMult ?? 1) * 0.3);
    const newWidthMult = THREE.MathUtils.clamp(rawMult, floorMult, 2);
    if (event.ctrlKey) {
      // 按住 Ctrl = 非对称：只调被拖的一侧。
      deps.panelTipStrand.setTipWidthCurveValue(lock, segment, splitsForWidth, bone, side, t, newWidthMult);
    } else {
      // 默认 = 对称：两侧同一 t 设为同一个 multiplier（真正对称，不按起始比例）。
      deps.panelTipStrand.setTipWidthCurveValue(lock, segment, splitsForWidth, bone, side, t, newWidthMult);
      deps.panelTipStrand.setTipWidthCurveValue(lock, segment, splitsForWidth, bone, -side, t, newWidthMult);
    }
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    // 视口拖拽改的是同一段骨宽曲线：浮动面板开着且目标一致时同步重绘。
    if (deps.taperCurveEditor.open
      && deps.sculptState.taperCurveEdit?.type === "segment"
      && deps.sculptState.taperCurveEdit.id === lock.id
      && deps.sculptState.taperCurveEdit.segmentIndex === segment) {
      deps.taperEditor.renderTaperCurveEditor();
    }
    // 右侧属性面板预览同步：该 lock 是当前选中/面板尖端选中时热更新。
    if (deps.sculptState.panelTipSelection?.lockId === lock.id || deps.getSelectedLock()?.id === lock.id) {
      deps.syncPanelSegmentControls(lock);
    }
    event.preventDefault();
    return;
  }
  if (deps.sculptState.panelSplitDrag.kind === "segment") {
    const segmentSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const segment = deps.sculptState.panelSplitDrag.splitIndex;
    const segBoundaries = [-1, ...segmentSplits.map((split) => split.position), 1];
    if (segment < 0 || segment >= segBoundaries.length - 1) {
      endPanelSplitHandleDrag(event);
      return;
    }
    const span = Math.max(0.0001, segBoundaries[segment + 1] - segBoundaries[segment]);
    let segmentBest = null;
    for (let uStep = 0; uStep <= 48; uStep += 1) {
      const u = THREE.MathUtils.lerp(segBoundaries[segment], segBoundaries[segment + 1], uStep / 48);
      const projected = deps.panelSplitControlPoint(lock, { position: u, height: 0 }, 1, curve, segment).project(deps.camera);
      if (projected.z < -1 || projected.z > 1) continue;
      const x = (projected.x * 0.5 + 0.5) * rect.width;
      const y = (-projected.y * 0.5 + 0.5) * rect.height;
      const distanceSq = (x - targetX) ** 2 + (y - targetY) ** 2;
      if (!segmentBest || distanceSq < segmentBest.distanceSq) segmentBest = { distanceSq, u };
    }
    if (!segmentBest) return;
    const bones = materializeSplitBones(lock);
    const bone = bones[segment];
    if (bone) {
      bone.spread = THREE.MathUtils.clamp(((segmentBest.u - segBoundaries[segment]) / span) * 0.99, 0, 0.99);
    }
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    event.preventDefault();
    return;
  }
  for (let tStep = 0; tStep <= 42; tStep += 1) {
    const t = THREE.MathUtils.lerp(0.22, 1, tStep / 42);
    for (let uStep = 0; uStep <= 48; uStep += 1) {
      const u = THREE.MathUtils.lerp(-0.88, 0.88, uStep / 48);
      const projected = deps.panelSplitControlPoint(
        lock,
        { position: u, height: 1 - t },
        t,
        curve,
        deps.sculptState.panelSplitDrag.splitIndex
      ).project(deps.camera);
      if (projected.z < -1 || projected.z > 1) continue;
      const x = (projected.x * 0.5 + 0.5) * rect.width;
      const y = (-projected.y * 0.5 + 0.5) * rect.height;
      const distanceSq = (x - targetX) ** 2 + (y - targetY) ** 2;
      if (!best || distanceSq < best.distanceSq) best = { distanceSq, position: u, height: 1 - t };
    }
  }
  if (!best) return;
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight, Math.max(0, Number(lock.panelWidthLoops ?? 6) - 1));
  const index = deps.sculptState.panelSplitDrag.splitIndex;
  if (!splits[index]) return;
  const minimumSeparation = Math.min(0.12, 0.8 / Math.max(3, Number(lock.panelWidthLoops ?? 6)));
  const minPosition = index > 0 ? splits[index - 1].position + minimumSeparation : -0.88;
  const maxPosition = index < splits.length - 1 ? splits[index + 1].position - minimumSeparation : 0.88;
  splits[index].position = THREE.MathUtils.clamp(best.position, minPosition, maxPosition);
  let nextHeight = best.height < 0.018 ? 0 : THREE.MathUtils.clamp(best.height, 0, 0.78);
  if (lock.panelSplitSnapToLoops !== false) {
    nextHeight = deps.snapPanelSplitHeight(nextHeight, lock.panelLengthLoops);
  }
  splits[index].height = nextHeight;
  lock.panelSplits = splits;
  deps.updateLockGeometry(lock, { immediate: true });
  deps.updateCurveObjects(lock, { visible: true });
  deps.syncActiveMirror(lock, { deferGeometry: false });
  deps.updateTopologyStats();
  event.preventDefault();
}

function endPanelSplitHandleDrag(event) {
  if (!deps.sculptState.panelSplitDrag || (event?.pointerId !== undefined && event.pointerId !== deps.sculptState.panelSplitDrag.pointerId)) return;
  const { pointerId, lockId } = deps.sculptState.panelSplitDrag;
  deps.sculptState.panelSplitDrag = null;
  if (deps.renderer.domElement.hasPointerCapture?.(pointerId)) deps.renderer.domElement.releasePointerCapture(pointerId);
  deps.renderer.domElement.style.cursor = "";
  const lock = deps.locks.find((item) => item.id === lockId);
  if (lock) deps.updateCurveObjects(lock, { visible: lock.id === deps.sel.selectedId });
  deps.updateInteractionLocks();
}

function applySubBoneBrushSample(stroke, clientX, clientY, deltaX, deltaY) {
  // When a split tip sub-bone is selected, the brush edits ONLY that sub-bone's chain
  // points (masked by screen distance) - never other sub-bones or the main chain.
  // The brush is consumed even when no chain point is under the cursor, so a selected
  // sub-bone blocks main-bone edits until it is deselected. Scale/orient center on the
  // sub-bone's exposed root (first below-fork chain point).
  const selection = deps.sculptState.panelTipSelection;
  if (!selection) return false;
  const lock = deps.locks.find((item) => item.id === selection.lockId);
  if (!lock || !deps.isPanelGeometry(lock) || lock.panelSplitEnabled === false) return false;
  const segmentIndex = selection.segmentIndex;
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  if (segmentIndex == null || segmentIndex < 0 || segmentIndex >= splits.length + 1) return true;
  if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
  const bones = materializeSplitBones(lock);
  const bone = bones[segmentIndex];
  if (!bone) return true;
  const tip = deps.panelTipStrand.splitTipForSegment(lock, segmentIndex, splits, bone);
  if (!tip || tip.restPoints.length < 2) return true;
  const rest = tip.restPoints;
  const authored = (Array.isArray(bone.tip?.points) && bone.tip.points.length === rest.length)
    ? bone.tip
    : {
      points: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      restPoints: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      active: true
    };
  const current = authored.points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  const points = current.map((p) => p.clone());
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const cursor = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
  const radius = Number(deps.sculptBrushRadiusInput.value);
  const falloff = Number(deps.sculptBrushFalloffInput.value);
  const strength = Number(deps.sculptBrushStrengthByTool[deps.effectiveSculptBrushTool()] ?? deps.sculptBrushStrengthInput.value);
  const reverse = Boolean(stroke.reverse);
  const tool = deps.effectiveSculptBrushTool();
  const forkT = deps.panelTipStrand.splitForkT(lock, segmentIndex, splits);
  const firstBelow = Math.min(rest.length - 1, Math.max(1, Math.ceil(forkT * (rest.length - 1))));
  const scaleCenter = current[firstBelow] || current[0];
  const weights = new Array(current.length).fill(0);
  for (let index = firstBelow; index < current.length; index += 1) {
    weights[index] = deps.sculptGeom.sculptBrushPointWeight(current[index], cursor, rect, radius, falloff);
  }
  let changed = false;
  if (tool === "sculpt-scale") {
    // Uniform scale of the whole exposed chain around the exposed root (ZBrush-like
    // sub-tool transform). Cursor falloff is intentionally not applied so the result
    // reads as a scale, not a cursor-masked nudge that looks like a move.
    const amount = (reverse ? -1 : 1) * strength * (deltaX + deltaY) * 0.004;
    for (let index = firstBelow; index < current.length; index += 1) {
      const dir = current[index].clone().sub(scaleCenter);
      points[index].addScaledVector(dir, amount);
      changed = true;
    }
  } else if (tool === "sculpt-slide") {
    const curve = new THREE.CatmullRomCurve3(current);
    for (let index = firstBelow; index < current.length; index += 1) {
      if (weights[index] <= 0) continue;
      const t = index / Math.max(1, current.length - 1);
      const tangent = curve.getTangent(t).normalize();
      const dragWorld = deps.sculptGeom.sculptBrushWorldDelta(current[index], deltaX, deltaY, rect);
      const amount = (reverse ? -1 : 1) * weights[index] * strength * dragWorld.dot(tangent);
      points[index].addScaledVector(tangent, amount);
      changed = true;
    }
  } else if (tool === "sculpt-push") {
    const curve = new THREE.CatmullRomCurve3(current);
    for (let index = firstBelow; index < current.length; index += 1) {
      if (weights[index] <= 0) continue;
      const t = index / Math.max(1, current.length - 1);
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      // Same push direction as the main hair brush: the strand's guided normal
      // (radial outward / authored surface normal) + twist. No tip special case.
      const twist = Array.isArray(authored.twists) ? Number(authored.twists[index]) || 0 : 0;
      const up = deps.guidedNormalAt(lock, point, tangent, t)
        .applyAxisAngle(tangent, twist)
        .normalize();
      const dragWorld = deps.sculptGeom.sculptBrushWorldDelta(current[index], deltaX, deltaY, rect);
      const amount = (reverse ? -1 : 1) * weights[index] * strength * dragWorld.dot(up);
      points[index].addScaledVector(up, amount);
      changed = true;
    }
  } else if (tool === "sculpt-smooth") {
    const smoothDeltas = smoothSculptPointDeltas(points, weights, strength, 0.04);
    for (let index = firstBelow; index < current.length; index += 1) {
      const d = smoothDeltas[index];
      points[index].x += d.x;
      points[index].y += d.y;
      points[index].z += d.z;
      changed = true;
    }
  } else if (tool === "sculpt-orient") {
    // Roll the tip section around its chain tangent so the tip's NORMAL faces the
    // viewport (same semantics as the main hair's orient brush). Only the section
    // orientation changes; the chain (bone position) does NOT move.
    const curve = new THREE.CatmullRomCurve3(current);
    const restCurve = new THREE.CatmullRomCurve3(rest.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
    const twistArr = (Array.isArray(authored.twists) && authored.twists.length === current.length)
      ? authored.twists.map((v) => Number(v) || 0)
      : current.map(() => 0);
    for (let index = firstBelow; index < current.length; index += 1) {
      if (weights[index] <= 0) continue;
      const t = index / Math.max(1, current.length - 1);
      const tangent = curve.getTangent(t).normalize();
      const point = curve.getPoint(t);
      const restTangent = restCurve.getTangent(t).normalize();
      const dq = restTangent.dot(tangent) < -0.9999
        ? (new THREE.Quaternion()).setFromAxisAngle(
          Math.abs(restTangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0),
          Math.PI
        )
        : (new THREE.Quaternion()).setFromUnitVectors(restTangent, tangent);
      const mainFrame = deps.strandFrameAt(lock, t);
      const currentNormal = mainFrame.z.clone().applyQuaternion(dq).applyAxisAngle(tangent, twistArr[index]).normalize();
      let targetUp = deps.camera.position.clone().sub(point).projectOnPlane(tangent);
      if (targetUp.lengthSq() < 0.0001) targetUp.copy(currentNormal);
      targetUp.normalize();
      const angle = deps.signedAngleAroundAxis(currentNormal, targetUp, tangent);
      twistArr[index] = twistArr[index] + angle * weights[index] * strength * 0.2;
      changed = true;
    }
    if (changed) authored.twists = twistArr.map((v) => Number(v) || 0);
  } else {
    // move (and any fallback): masked view-plane translation
    for (let index = firstBelow; index < current.length; index += 1) {
      if (weights[index] <= 0) continue;
      const dragWorld = deps.sculptGeom.sculptBrushWorldDelta(current[index], deltaX, deltaY, rect);
      points[index].addScaledVector(dragWorld, (reverse ? -1 : 1) * weights[index] * strength);
      changed = true;
    }
  }
  if (changed) {
    authored.points = points.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    authored.restPoints = rest.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    authored.active = true;
    bone.tip = authored;
    stroke.editedLockIds.add(lock.id);
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.updateTopologyStats();
  }
  return true;
}

function updatePanelTipHover(event) {
  if (deps.pointerOverTaperEditor(event)) {
    if (deps.sculptState.panelTipHover) {
      deps.sculptState.panelTipHover = { lockId: null, segmentIndex: null };
      deps.panelTipStrand.updateTipHighlight(deps.getSelectedLock());
    }
    return;
  }
  const lock = deps.getSelectedLock();
  let hover = { lockId: null, segmentIndex: null };
  if (lock && deps.isPanelGeometry(lock) && lock.panelSplitEnabled !== false && Array.isArray(lock.panelSplits) && lock.panelSplits.length) {
    const rect = deps.renderer.domElement.getBoundingClientRect();
    const pointerNDC = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    deps.raycaster.setFromCamera(pointerNDC, deps.camera);
    const hit = deps.raycaster.intersectObject(lock.mesh, false)[0];
    const leafWeights = lock.mesh.geometry?.userData?.leafWeights || lock.mesh.geometry?.userData?.panelWeights;
    if (hit && hit.face && leafWeightsValid(leafWeights, lock.mesh.geometry?.getAttribute?.("position")?.count || 0)) {
      const segment = leafIndexAt(leafWeights, hit.face.a);
      if (segment >= 0) hover = { lockId: lock.id, segmentIndex: segment };
    }
  }
  const changed = deps.sculptState.panelTipHover?.lockId !== hover.lockId
    || deps.sculptState.panelTipHover?.segmentIndex !== hover.segmentIndex;
  deps.sculptState.panelTipHover = hover;
  if (changed) deps.panelTipStrand.updateTipHighlight(lock);
}

function prepareCurvePointSelection(event) {
  if (event.button !== 0) return;
  if (!deps.componentEditModeActive()) {
    // Object mode: a highlighted (hovered) control point still selects its strand, so
    // clicking a bone never falls through to the parent hair that sits underneath it.
    const hovered = deps.guideState.hoveredControlPoint;
    if (hovered?.userData?.lockId && hovered.userData.pointIndex !== undefined) {
      deps.selectLock(hovered.userData.lockId, {
        individualClumpMember: hovered.userData.lockId === deps.sel.selectedId && !deps.sel.clumpViewportSelection
      });
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }
  const removingCurvePoint = event.shiftKey && event.ctrlKey && !event.altKey && !event.metaKey;
  const insertingCurvePoint = event.shiftKey && event.altKey && !event.ctrlKey && !event.metaKey;
  const addingSelection = event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey;
  const removingSelection = event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
  if (deps.sel.activeTool === "curve-surface") return;
  if (deps.sculptState.viewportEditMode !== "strand" || event.metaKey || deps.sculptState.proportionalSizeEdit || deps.sculptState.proportionalHotkeyPress || deps.scalpState.scalpShapeEditing || deps.scalpState.scalpPaintEditing || deps.scalpState.scalpBuilderEditing || deps.sculptState.capsuleGuideEditing || ["place", "draw", "procedural-draw", "braid", "panel", "surface-loft", "surface-guide"].includes(deps.sel.activeTool)) return;
  const polySelectionModifier = deps.sel.activeTool === "poly"
    && (
      event.ctrlKey && !event.shiftKey && !event.altKey
      || event.altKey && !event.shiftKey && !event.ctrlKey
    );
  if (
    (event.shiftKey || event.ctrlKey || event.altKey)
    && !addingSelection
    && !removingSelection
    && !removingCurvePoint
    && !insertingCurvePoint
    && !polySelectionModifier
  ) return;
  const selectedLock = deps.getSelectedLock();
  const handles = selectedLock?.curveObjects?.group.visible ? selectedLock.curveObjects.handles : [];
  if (!handles.length) return;
  const rect = deps.renderer.domElement.getBoundingClientRect();
  deps.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  deps.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  deps.raycaster.setFromCamera(deps.pointer, deps.camera);
  const hit = deps.strandControlPointHitFromEvent(event, selectedLock);
  // If the click is on the move/rotate/scale gizmo, let the gizmo win: once a bone
  // is already selected (gizmo attached), clicking it again - or a nearby point that
  // the gizmo picker overlaps - must not re-select / steal the point, otherwise the
  // gizmo center becomes unclickable. Only the remove/insert curve-point modes keep
  // point priority over the gizmo.
  if (
    !removingCurvePoint
    && !insertingCurvePoint
    && deps.pointerHitsTransformGizmo(event)
  ) return;
  if (deps.sel.activeTool === "poly") {
    if (!hit || hit.object === deps.transformControls.object) return;
    if (event.altKey) {
      deps.sculptState.pointRemovalCandidate = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lockId: hit.object.userData.lockId,
        pointIndex: hit.object.userData.pointIndex,
        selectionOnly: true
      };
      return;
    }
    if (event.ctrlKey) {
      deps.addStrandControlPointSelection(hit.object);
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (deps.activateStrandControlPoint(hit.object, event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }
  if (insertingCurvePoint) {
    if (hit || ["poly", "surface", "curve-surface"].includes(selectedLock.geometryType)) return;
    const curveHit = deps.raycaster.intersectObject(selectedLock.curveObjects.line, false)[0];
    if (!curveHit) return;
    deps.sculptState.curvePointInsertionCandidate = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lockId: selectedLock.id,
      parameter: deps.closestStrandCurveParameter(selectedLock, curveHit.point)
    };
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (!hit || hit.object === deps.transformControls.object) return;
  if (removingCurvePoint) {
    deps.sculptState.pointRemovalCandidate = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lockId: hit.object.userData.lockId,
      pointIndex: hit.object.userData.pointIndex
    };
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (deps.activateStrandControlPoint(hit.object, event)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

  return {
    beginTipSubBoneRotate,
    applyTipSubBoneTransform,
    beginPanelSplitHandleDrag,
    updatePanelSplitHandleDrag,
    endPanelSplitHandleDrag,
    applySubBoneBrushSample,
    updatePanelTipHover,
    prepareCurvePointSelection,
  };
}
