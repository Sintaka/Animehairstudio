// bone-view-handles.js - Viewport bone/segment/split handle create/update/dispose (refactor bones B3).
// Extracted from app.js; coupling injected via createBoneViewHandlesApi(deps).
import * as THREE from "three";
import { splitBonesFor, strandSplitBonesFor, strandTipFor } from "./bone-model.js?v=20260813-1";
import { TIP_WIDTH_CONTROL_POINTS } from "../geometry/panel-tip-strand.js?v=20260815-4";
import { materializeTipChain, sampleTipPosition } from "../geometry/tip-sub-bone.js?v=20260813-1";
// 绿色发段手柄沿尖端切线方向的外推距离（世界单位）：让手柄落在 trim/curve 适配后的
// 最尖端稍前方，避免与粉色/黄色发尖子骨骼手柄重合而难以拖拽。
const TIP_SEGMENT_HANDLE_TANGENT_OFFSET = 0.08;

// deps: store .state proxies (sculptState/sel) + module instances (panelTipStrand) + shared
//   objects (transformControls) + app.js helper functions (clonePanelSplits/isPanelGeometry/
//   panelSplitControlPoint/strandSplitControlPoint/strandSplitProfileData/strandGeometryCurve/
//   strandGeometryFrameAt/currentStrandSplitTipChains).
// ctx passed by the spine updateCurveObjects: { brushDebugVisible, sculptBrushHelpersSuppressed,
//   tipUiActive, brushBonesOnly } (computed in the spine, not recomputed here).
// Batch-fill point in app.js: after the strandGeometryDeps batch (all deps defined).
export function createBoneViewHandlesApi(deps) {
function createSplitControlHandle() {
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.052, 18, 12),
    new THREE.MeshBasicMaterial({
      color: 0xff42cf,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.68
    })
  );
  handle.renderOrder = 7;
  return handle;
}

function createCurveNormalIndicator() {
  const indicator = new THREE.Group();
  const materialOptions = {
    color: 0x58f6ff,
    transparent: true,
    opacity: 0.88,
    depthTest: false
  };
  const shaft = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.76, 0)
    ]),
    new THREE.LineBasicMaterial(materialOptions)
  );
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.075, 0.24, 10),
    new THREE.MeshBasicMaterial(materialOptions)
  );
  cone.position.y = 0.88;
  shaft.renderOrder = 5;
  cone.renderOrder = 5;
  indicator.add(shaft, cone);
  return indicator;
}

function createBoneViewHandles(lock, group) {
  const panelSplitHandles = [];
  const panelSplitLines = [];
  const panelSegmentHandles = [];
  const panelTipHandles = [];
  const panelTipLines = [];
  const tipWidthHandles = [];
  const tipWidthLines = [];
  const tipNormalArrows = [];
  if (deps.isPanelGeometry(lock)) {
    lock.panelSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    lock.panelSplits.forEach((split, index) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xff42cf, transparent: true, opacity: 0.9, depthTest: false })
      );
      line.renderOrder = 6;
      group.add(line);
      panelSplitLines.push(line);
      const handle = createSplitControlHandle();
      handle.userData.lockId = lock.id;
      handle.userData.panelSplitIndex = index;
      group.add(handle);
      panelSplitHandles.push(handle);
    });
    // Green segment spread handles: one per segment (0..splits.length), shown while a
    // tip sub-bone is selected and dragged to write bone.spread directly (0..0.99).
    for (let segment = 0; segment < lock.panelSplits.length + 1; segment += 1) {
      const handle = createSplitControlHandle();
      handle.scale.setScalar(0.42);
      handle.material = new THREE.MeshBasicMaterial({
        color: 0x5df0a8,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.95
      });
      handle.userData.lockId = lock.id;
      handle.userData.panelSegmentIndex = segment;
      group.add(handle);
      panelSegmentHandles.push(handle);
    }
    // Tip sub-bone handles: one per sub-bone chain point (full chain like the main
    // bone, laterally offset to the segment center). Only points below the segment's
    // fork (zipper) are exposed in updateCurveObjects.
    const tipMainPointCount = Array.isArray(lock.points) ? lock.points.length : 0;
    for (let segment = 0; segment < lock.panelSplits.length + 1; segment += 1) {
      for (let point = 0; point < tipMainPointCount; point += 1) {
        const handle = createSplitControlHandle();
        handle.scale.setScalar(0.42);
        handle.material = new THREE.MeshBasicMaterial({
          color: 0xffd84d,
          depthTest: false,
          depthWrite: false,
          transparent: true,
          opacity: 0.9
        });
        handle.userData.lockId = lock.id;
        handle.userData.panelTipIndex = segment;
        handle.userData.panelTipPoint = point;
        group.add(handle);
        panelTipHandles.push(handle);
        // 旋转模式下选中发尖子骨骼时，每个暴露链点显示一个法线箭头（子骨骼自身法线）。
        const tipNormalArrow = createCurveNormalIndicator();
        tipNormalArrow.visible = false;
        tipNormalArrow.userData.lockId = lock.id;
        tipNormalArrow.userData.panelTipIndex = segment;
        tipNormalArrow.userData.panelTipPoint = point;
        group.add(tipNormalArrow);
        tipNormalArrows.push(tipNormalArrow);
      }
      // Guide line connecting the sub-bone chain points (like a strand guide).
      const line = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xffd84d, transparent: true, opacity: 0.7, depthTest: false })
      );
      line.renderOrder = 6;
      group.add(line);
      panelTipLines.push(line);
    }
    // Tip width control (pink curve + control points, per side along the exposed
    // below-zipper chain). Only the selected tip segment's points/curve show.
    for (let segment = 0; segment < lock.panelSplits.length + 1; segment += 1) {
      const sideHandles = { left: [], right: [] };
      const sideLines = { left: null, right: null };
      for (const side of [-1, 1]) {
        // 5 midpoints (common fork) + the tip end (t=1) = tipWidthControlTs positions.
        for (let point = 0; point < TIP_WIDTH_CONTROL_POINTS + 1; point += 1) {
          const handle = createSplitControlHandle();
          handle.scale.setScalar(0.26);
          handle.material = new THREE.MeshBasicMaterial({
            color: 0x5df0a8,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            opacity: 0.95
          });
          handle.userData.lockId = lock.id;
          handle.userData.tipWidthSegment = segment;
          handle.userData.tipWidthSide = side;
          handle.userData.tipWidthIndex = point;
          group.add(handle);
          sideHandles[side < 0 ? "left" : "right"].push(handle);
        }
        const line = new THREE.Line(
          new THREE.BufferGeometry(),
          new THREE.LineBasicMaterial({ color: 0x5df0a8, transparent: true, opacity: 0.85, depthTest: false })
        );
        line.renderOrder = 6;
        line.userData.lockId = lock.id;
        line.userData.tipWidthLineSegment = segment;
        line.userData.tipWidthLineSide = side;
        group.add(line);
        sideLines[side < 0 ? "left" : "right"] = line;
      }
      tipWidthHandles.push(sideHandles);
      tipWidthLines.push(sideLines);
    }
  }
  let strandSplitHandle = null;
  let strandSplitLine = null;
  let strandSplitTipHandles = [];
  let strandSplitTipLines = [];
  let strandTipHandle = null;
  let strandTipLine = null;
  if (lock.geometryType === "strand") {
    strandSplitLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xff42cf, transparent: true, opacity: 0.9, depthTest: false })
    );
    strandSplitLine.renderOrder = 6;
    group.add(strandSplitLine);
    strandSplitHandle = createSplitControlHandle();
    strandSplitHandle.userData.lockId = lock.id;
    strandSplitHandle.userData.strandSplitHandle = true;
    group.add(strandSplitHandle);
    // Split-strand per-tube tip sub-bone handles + guide lines (Route 2): one per
    // tube (0/1), shown only while the lock is a split strand with strandSplitBones.
    for (let tubeIndex = 0; tubeIndex < 2; tubeIndex += 1) {
      const strandSplitTipHandle = createSplitControlHandle();
      strandSplitTipHandle.scale.setScalar(0.5);
      strandSplitTipHandle.material = new THREE.MeshBasicMaterial({
        color: 0xffd84d,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.9
      });
      strandSplitTipHandle.userData.lockId = lock.id;
      strandSplitTipHandle.userData.strandSplitTipTube = tubeIndex;
      group.add(strandSplitTipHandle);
      strandSplitTipHandles.push(strandSplitTipHandle);
      const strandSplitTipLine = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xffd84d, transparent: true, opacity: 0.7, depthTest: false })
      );
      strandSplitTipLine.renderOrder = 6;
      strandSplitTipLine.userData.lockId = lock.id;
      strandSplitTipLine.userData.strandSplitTipLineTube = tubeIndex;
      group.add(strandSplitTipLine);
      strandSplitTipLines.push(strandSplitTipLine);
    }
    // Ordinary-strand single tip sub-bone handle + guide line (Route 1); shown only
    // when the lock is a non-split, non-hair-card strand with a materialized strandTip.
    strandTipLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffd84d, transparent: true, opacity: 0.7, depthTest: false })
    );
    strandTipLine.renderOrder = 6;
    strandTipLine.userData.lockId = lock.id;
    strandTipLine.userData.strandTipLine = true;
    group.add(strandTipLine);
    strandTipHandle = createSplitControlHandle();
    strandTipHandle.scale.setScalar(0.5);
    strandTipHandle.material = new THREE.MeshBasicMaterial({
      color: 0xffd84d,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.9
    });
    strandTipHandle.userData.lockId = lock.id;
    strandTipHandle.userData.strandTipHandle = true;
    group.add(strandTipHandle);
  }
  let branchSweepStartHandle = null;
  if (lock.branchRootRegion) {
    branchSweepStartHandle = createSplitControlHandle();
    branchSweepStartHandle.scale.setScalar(0.6);
    branchSweepStartHandle.renderOrder = 40;
    branchSweepStartHandle.material = new THREE.MeshBasicMaterial({
      color: 0xffd84d,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.95
    });
    branchSweepStartHandle.userData.lockId = lock.id;
    branchSweepStartHandle.userData.branchSweepStartHandle = true;
    group.add(branchSweepStartHandle);
  }
  return {
    panelSplitHandles,
    panelSplitLines,
    panelSegmentHandles,
    panelTipHandles,
    panelTipLines,
    tipNormalArrows,
    tipWidthHandles,
    tipWidthLines,
    strandSplitHandle,
    strandSplitLine,
    strandSplitTipHandles,
    strandSplitTipLines,
    strandTipHandle,
    strandTipLine,
    branchSweepStartHandle
  };
}

function updateBoneViewHandles(lock, ctx) {
  const { brushDebugVisible, sculptBrushHelpersSuppressed, tipUiActive } = ctx;
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  lock.curveObjects.panelSplitHandles?.forEach((handle, index) => {
    const split = splits[index];
    const line = lock.curveObjects.panelSplitLines?.[index];
    // Hide the zipper handles while a tip sub-bone is selected: the tip width control
    // points sit on the segment edges (zipper u), so the bigger zipper sphere would
    // steal the drag. The zipper LINES stay visible; deselect the tip to drag zippers.
    const visible = !tipUiActive
      && !sculptBrushHelpersSuppressed
      && !brushDebugVisible
      && deps.isPanelGeometry(lock)
      && lock.panelSplitEnabled !== false
      && Boolean(split);
    handle.visible = visible;
    if (!visible) {
      if (line) line.visible = false;
      return;
    }
    handle.position.copy(deps.panelSplitControlPoint(lock, split, null, null, index));
    handle.material.opacity = deps.sculptState.panelSplitDrag?.lockId === lock.id && deps.sculptState.panelSplitDrag.splitIndex === index ? 0.9 : 0.68;
    if (!line) return;
    line.visible = true;
    line.geometry.dispose();
    const points = [];
    const startT = 1 - split.height;
    for (let step = 0; step <= 12; step += 1) {
      points.push(deps.panelSplitControlPoint(lock, split, THREE.MathUtils.lerp(startT, 1, step / 12), null, index));
    }
    line.geometry = new THREE.BufferGeometry().setFromPoints(points);
  });
  const segmentBoundaries = [-1, ...splits.map((split) => split.position), 1];
  // 发尖段绿色手柄需要跟随 tip trim/curve，提前算出真实 splits（与 tipChains 共用同一份）。
  const tipSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  // 提前算出发尖子骨骼链：绿色手柄 = trim/curve 适配的 rest 尖端表面点 + 发尖子骨骼
  // authored 位移（跟随用户修改的发尖位置）；后面的 pink tip 手柄/链线/tipWidth 继续
  // 复用同一份 tipChains/tipForkTs，避免重复计算。
  const tipSplitBones = splitBonesFor(lock);
  // Cache each segment's sub-bone chain once (handles + guide lines share it).
  // One sub-bone chain per SEGMENT (splits.length + 1); mapping over the splits
  // themselves would drop the last (boundary) segment's chain.
  const tipChains = tipSplits.length
    ? Array.from({ length: tipSplits.length + 1 }, (_, segment) => deps.panelTipStrand.splitTipForSegment(lock, segment, tipSplits, tipSplitBones[segment] || null))
    : [];
  const tipForkTs = tipSplits.length
    ? Array.from({ length: tipSplits.length + 1 }, (_, segment) => deps.panelTipStrand.splitForkT(lock, segment, tipSplits))
    : [];
  lock.curveObjects.panelSegmentHandles?.forEach((handle, segment) => {
    // 有意设计（请勿改动）：只要任一子发尖被选中，所有段的绿色手柄都会显示，视口里可以
    // 同时拖任意段的手柄来调该段 spread；拖非选中段的手柄不会切换 panelTipSelection
    // （保持当前选中的发尖段不变），与子发尖的选中/编辑互不干扰。
    const visible = tipUiActive
      && !sculptBrushHelpersSuppressed
      && !brushDebugVisible
      && deps.isPanelGeometry(lock)
      && lock.panelSplitEnabled !== false;
    handle.visible = visible;
    if (!visible) return;
    const bone = tipSplitBones[segment] || null;
    const span = Math.max(0.0001, segmentBoundaries[segment + 1] - segmentBoundaries[segment]);
    const spread = bone?.spread ?? 0;
    const handleU = segmentBoundaries[segment] + (spread / 0.99) * span;
    // 绿色手柄 = trim/curve 适配的 rest 尖端表面点 + 发尖子骨骼 authored 位移（跟随
    // 用户修改的发尖位置）：tipSurfaceFrameAt 内部已应用 panelTipCurve + edge trim
    // （tipOffsetSampleT），在适配后的尖端沿切线（y）再外推一点避免与发尖子骨骼手柄
    // 重合；随后叠加链最后一点（t=1 尖端）的 authored delta（points − restPoints）。
    // spread→handleU 的横向映射保持不变。
    const surfaceFrame = deps.panelTipStrand.tipSurfaceFrameAt(lock, 1, handleU, segment, tipSplits);
    handle.position.copy(surfaceFrame.point).addScaledVector(surfaceFrame.y, TIP_SEGMENT_HANDLE_TANGENT_OFFSET);
    const chain = tipChains[segment];
    let delta = null;
    if (chain && Array.isArray(chain.points) && Array.isArray(chain.restPoints)
      && chain.points.length >= 2 && chain.restPoints.length >= 2) {
      const last = chain.points.length - 1;
      delta = new THREE.Vector3().subVectors(chain.points[last], chain.restPoints[last]);
    }
    if (delta) handle.position.add(delta);
    // 选中段高亮与 WidthCurve 一致（选中 0.9、拖拽中 1、未选中 0.68）。
    const selected = deps.sculptState.panelTipSelection?.lockId === lock.id
      && deps.sculptState.panelTipSelection.segmentIndex === segment;
    const dragging = deps.sculptState.panelSplitDrag?.lockId === lock.id
      && deps.sculptState.panelSplitDrag.kind === "segment"
      && deps.sculptState.panelSplitDrag.splitIndex === segment;
    handle.material.opacity = dragging ? 1 : (selected ? 0.9 : 0.68);
  });
  lock.curveObjects.panelTipHandles?.forEach((handle, handleIndex) => {
    const segment = handle.userData.panelTipIndex;
    const point = handle.userData.panelTipPoint;
    const arrow = lock.curveObjects.tipNormalArrows?.[handleIndex];
    // 旋转模式下选中发尖子骨骼时，给每个暴露链点显示自身法线箭头。
    const syncTipNormalArrow = () => {
      if (!arrow) return;
      const tipSelected = deps.sculptState.panelTipSelection?.lockId === lock.id
        && deps.sculptState.panelTipSelection.segmentIndex === segment;
      arrow.visible = handle.visible && tipSelected && deps.sel.activeTool === "rotate";
      if (!arrow.visible) return;
      const tip = tipChains[segment];
      const chainT = point / Math.max(1, tip.points.length - 1);
      arrow.position.copy(tip.points[point]);
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), deps.panelTipStrand.tipChainFrameAt(lock, tip, tip, chainT, segment, tipSplits).z);
      arrow.scale.setScalar(0.14);
    };
    const visible = (!sculptBrushHelpersSuppressed || tipUiActive)
      && !brushDebugVisible
      && deps.isPanelGeometry(lock)
      && lock.panelSplitEnabled !== false
      && tipSplits.length > 0;
    handle.visible = visible;
    if (!visible) {
      syncTipNormalArrow();
      return;
    }
    const tip = tipChains[segment];
    if (!tip || point >= tip.points.length) {
      handle.visible = false;
      syncTipNormalArrow();
      return;
    }
    const forkT = tipForkTs[segment] ?? 1;
    const t = point / Math.max(1, tip.points.length - 1);
    // Only expose sub-bone points below the segment's fork (zipper); above stays current.
    if (t <= forkT) {
      handle.visible = false;
      syncTipNormalArrow();
      return;
    }
    handle.position.copy(tip.points[point]);
    // 旋转/缩放模式下把 tip 手柄 quaternion 对齐到发尖链自身 frame（y=切线），使
    // gizmo 起始朝向=发尖真实朝向，避免 startQuaternion=identity 导致一拖就跳到
    // 主骨骼朝向；拖拽中保留 gizmo 已施加的旋转（否则每次重建把手会清零增量）。
    // t 与 syncTipNormalArrow 里的 chainT 相同（point / max(1, length-1)），直接复用。
    const preserveDragRotation = Boolean(
      deps.sculptState.tipSubBoneRotateDrag
      && deps.sculptState.tipSubBoneRotateDrag.lockId === lock.id
      && deps.sculptState.tipSubBoneRotateDrag.segmentIndex === segment
      && deps.sculptState.tipSubBoneRotateDrag.tipPoint === point
      && deps.transformControls.object === handle
    );
    if (!preserveDragRotation && ["rotate", "scale"].includes(deps.sel.activeTool)) {
      const chainFrame = deps.panelTipStrand.tipChainFrameAt(lock, tip, tip, t, segment, tipSplits);
      handle.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(chainFrame.x, chainFrame.y, chainFrame.z));
    }
    const isSelected = deps.sculptState.panelTipSelection?.lockId === lock.id
      && deps.sculptState.panelTipSelection.segmentIndex === segment;
    const isDragged = deps.sculptState.panelSplitDrag?.lockId === lock.id
      && deps.sculptState.panelSplitDrag.kind === "tip"
      && deps.sculptState.panelSplitDrag.splitIndex === segment
      && deps.sculptState.panelSplitDrag.tipPoint === point;
    handle.material.opacity = isDragged ? 0.95 : (isSelected ? 0.95 : 0.4);
    syncTipNormalArrow();
  });
  // Guide lines connecting each sub-bone's exposed (below-fork) chain portion.
  lock.curveObjects.panelTipLines?.forEach((line, segment) => {
    const visible = (!sculptBrushHelpersSuppressed || tipUiActive)
      && !brushDebugVisible
      && deps.isPanelGeometry(lock)
      && lock.panelSplitEnabled !== false
      && tipSplits.length > 0;
    line.visible = visible;
    if (!visible) return;
    const tip = tipChains[segment];
    if (!tip || tip.points.length < 2) {
      line.visible = false;
      return;
    }
    const forkT = tipForkTs[segment] ?? 1;
    const firstBelow = Math.min(tip.points.length - 1, Math.max(1, Math.ceil(forkT * (tip.points.length - 1))));
    const exposed = tip.points.slice(firstBelow);
    if (exposed.length < 2) {
      line.visible = false;
      return;
    }
    line.geometry.dispose();
    line.geometry = new THREE.BufferGeometry().setFromPoints(exposed);
    line.material.opacity = deps.sculptState.panelTipSelection?.lockId === lock.id
      && deps.sculptState.panelTipSelection.segmentIndex === segment
      ? 0.95 : 0.45;
  });
  const tipWidthSelection = deps.sculptState.panelTipSelection;
  lock.curveObjects.tipWidthHandles?.forEach((sideHandles, segment) => {
    const selected = tipWidthSelection
      && tipWidthSelection.lockId === lock.id
      && tipWidthSelection.segmentIndex === segment;
    const baseVisible = Boolean(selected)
      && (!sculptBrushHelpersSuppressed || tipUiActive)
      && !brushDebugVisible
      && deps.isPanelGeometry(lock)
      && lock.panelSplitEnabled !== false
      && tipSplits.length > 0;
    for (const side of [-1, 1]) {
      const list = side < 0 ? sideHandles.left : sideHandles.right;
      list.forEach((handle, index) => {
        if (!baseVisible) {
          handle.visible = false;
          return;
        }
        const placement = deps.panelTipStrand.tipWidthControlPlacement(lock, segment, tipSplits, tipSplitBones[segment] || null, side, index);
        if (!placement) {
          handle.visible = false;
          return;
        }
        handle.visible = true;
        handle.position.copy(placement.point);
        const dragging = deps.sculptState.panelSplitDrag?.lockId === lock.id
          && deps.sculptState.panelSplitDrag.kind === "tipWidth"
          && deps.sculptState.panelSplitDrag.splitIndex === segment
          && deps.sculptState.panelSplitDrag.tipWidthSide === side
          && deps.sculptState.panelSplitDrag.tipWidthIndex === index;
        handle.material.opacity = dragging ? 1 : 0.9;
      });
    }
  });
  lock.curveObjects.tipWidthLines?.forEach((sideLines, segment) => {
    const selected = tipWidthSelection
      && tipWidthSelection.lockId === lock.id
      && tipWidthSelection.segmentIndex === segment;
    const lineBase = Boolean(selected)
      && (!sculptBrushHelpersSuppressed || tipUiActive)
      && !brushDebugVisible
      && deps.isPanelGeometry(lock)
      && lock.panelSplitEnabled !== false
      && tipSplits.length > 0;
    for (const side of [-1, 1]) {
      const line = side < 0 ? sideLines.left : sideLines.right;
      if (!line) continue;
      if (!lineBase) {
        line.visible = false;
        continue;
      }
      const edgePoints = deps.panelTipStrand.tipWidthEdgePoints(lock, segment, tipSplits, tipSplitBones[segment] || null, side);
      if (edgePoints.length < 2) {
        line.visible = false;
        continue;
      }
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(edgePoints);
      line.visible = true;
    }
  });
  deps.panelTipStrand.updateTipHighlight(lock);
  const strandSplitVisible = !sculptBrushHelpersSuppressed
    && !brushDebugVisible
    && lock.geometryType === "strand"
    && !lock.hairCard
    && Boolean(lock.strandSplitEnabled);
  const strandSplitHandle = lock.curveObjects.strandSplitHandle;
  const strandSplitLine = lock.curveObjects.strandSplitLine;
  if (strandSplitHandle) {
    strandSplitHandle.visible = strandSplitVisible;
    strandSplitHandle.material.opacity = deps.sculptState.panelSplitDrag?.lockId === lock.id && deps.sculptState.panelSplitDrag.kind === "strand" ? 0.9 : 0.68;
    if (strandSplitVisible) {
      const split = {
        position: lock.strandSplitPosition,
        height: lock.strandSplitHeight
      };
      const profileData = deps.strandSplitProfileData(lock);
      strandSplitHandle.position.copy(deps.strandSplitControlPoint(lock, split, null, null, profileData));
      if (strandSplitLine) {
        strandSplitLine.visible = true;
        strandSplitLine.geometry.dispose();
        const points = [];
        const startT = 1 - Number(lock.strandSplitHeight ?? 0.3);
        for (let step = 0; step <= 12; step += 1) {
          points.push(deps.strandSplitControlPoint(
            lock,
            split,
            THREE.MathUtils.lerp(startT, 1, step / 12),
            null,
            profileData
          ));
        }
        strandSplitLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
      }
    }
  }
  if (strandSplitLine && !strandSplitVisible) strandSplitLine.visible = false;
  // Split-strand per-tube tip handles + guide lines (Route 2). Mutually exclusive
  // with the Route 1 single strandTip block below (that block requires
  // !lock.strandSplitEnabled, and strandSplitBones is null for non-split strands).
  const strandSplitBones = strandSplitBonesFor(lock);
  const splitTipVisible = !sculptBrushHelpersSuppressed
    && !brushDebugVisible
    && lock.geometryType === "strand"
    && !lock.hairCard
    && Boolean(strandSplitBones);
  const strandSplitTipHandles = lock.curveObjects.strandSplitTipHandles;
  const strandSplitTipLines = lock.curveObjects.strandSplitTipLines;
  const strandSplitTipChains = typeof deps.currentStrandSplitTipChains === "function"
    ? deps.currentStrandSplitTipChains(lock)
    : null;
  if (Array.isArray(strandSplitTipHandles)) {
    for (let tubeIndex = 0; tubeIndex < 2; tubeIndex += 1) {
      const handle = strandSplitTipHandles[tubeIndex];
      const line = Array.isArray(strandSplitTipLines) ? strandSplitTipLines[tubeIndex] : null;
      if (!handle) continue;
      handle.visible = splitTipVisible;
      if (line) line.visible = splitTipVisible;
      if (!splitTipVisible) continue;
      const bone = strandSplitBones[tubeIndex] || null;
      const tipChain = strandSplitTipChains?.[tubeIndex] || materializeTipChain(
        bone?.tip || null,
        (t) => deps.strandGeometryCurve(lock).getPoint(t),
        Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2)
      );
      const tipEnd = sampleTipPosition(tipChain, 1);
      handle.position.set(tipEnd.x, tipEnd.y, tipEnd.z);
      if (line) {
        line.geometry.dispose();
        const points = tipChain.points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
        line.geometry = new THREE.BufferGeometry().setFromPoints(points);
        line.visible = true;
      }
    }
  }
  const strandTip = strandTipFor(lock);
  const strandTipHandle = lock.curveObjects.strandTipHandle;
  const strandTipLine = lock.curveObjects.strandTipLine;
  if (strandTipHandle) {
    const strandTipVisible = !sculptBrushHelpersSuppressed
      && !brushDebugVisible
      && lock.geometryType === "strand"
      && !lock.hairCard
      && !lock.strandSplitEnabled
      && Boolean(strandTip);
    strandTipHandle.visible = strandTipVisible;
    if (strandTipLine) strandTipLine.visible = strandTipVisible;
    if (strandTipVisible) {
      const tipChain = materializeTipChain(
        strandTip,
        (t) => deps.strandGeometryCurve(lock).getPoint(t),
        Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2)
      );
      const tipEnd = sampleTipPosition(tipChain, 1);
      strandTipHandle.position.set(tipEnd.x, tipEnd.y, tipEnd.z);
      if (strandTipLine) {
        strandTipLine.geometry.dispose();
        const points = tipChain.points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
        strandTipLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
        strandTipLine.visible = true;
      }
    }
  }
  const branchSweepStartHandle = lock.curveObjects.branchSweepStartHandle;
  if (branchSweepStartHandle) {
    const sweepStartVisible = !sculptBrushHelpersSuppressed && !lock.locked && lock.id === deps.sel.selectedId && lock.branchRootRegion;
    branchSweepStartHandle.visible = sweepStartVisible;
    branchSweepStartHandle.material.opacity = deps.sculptState.branchSweepStartDrag?.lockId === lock.id ? 0.9 : 0.68;
    if (sweepStartVisible) {
      // Sit the handle just off the guide (along the child's outward normal) so it is
      // visible next to the hair instead of buried inside the root cross-section.
      const sweepCurve = deps.strandGeometryCurve(lock);
      const sweepT = THREE.MathUtils.clamp(Number(lock.branchSweepStartT ?? 0.1), 0.02, 0.6);
      const sweepFrame = deps.strandGeometryFrameAt(lock, sweepCurve, sweepT);
      branchSweepStartHandle.position.copy(sweepCurve.getPoint(sweepT)).addScaledVector(sweepFrame.z, 0.06);
    }
  }
}

function disposeBoneViewHandles(curveObjects) {
  curveObjects.panelSplitHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  curveObjects.panelSplitLines?.forEach((line) => {
    line.geometry.dispose();
    line.material.dispose();
  });
  curveObjects.panelSegmentHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  curveObjects.panelTipHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  curveObjects.panelTipLines?.forEach((line) => {
    line.geometry.dispose();
    line.material.dispose();
  });
  curveObjects.tipNormalArrows?.forEach((arrow) => {
    arrow.children.forEach((part) => {
      part.geometry?.dispose();
      part.material?.dispose();
    });
  });
  curveObjects.tipWidthHandles?.forEach((seg) => {
    [...seg.left, ...seg.right].forEach((handle) => {
      handle.geometry.dispose();
      handle.material.dispose();
    });
  });
  curveObjects.tipWidthLines?.forEach((seg) => {
    [seg.left, seg.right].filter(Boolean).forEach((line) => {
      line.geometry.dispose();
      line.material.dispose();
    });
  });
  if (curveObjects.tipHighlightMesh) {
    curveObjects.tipHighlightMesh.geometry.dispose();
    curveObjects.tipHighlightMesh.material.dispose();
  }
  if (curveObjects.strandSplitHandle) {
    curveObjects.strandSplitHandle.geometry.dispose();
    curveObjects.strandSplitHandle.material.dispose();
  }
  if (curveObjects.branchSweepStartHandle) {
    curveObjects.branchSweepStartHandle.geometry.dispose();
    curveObjects.branchSweepStartHandle.material.dispose();
  }
  if (curveObjects.strandSplitLine) {
    curveObjects.strandSplitLine.geometry.dispose();
    curveObjects.strandSplitLine.material.dispose();
  }
  curveObjects.strandSplitTipHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  curveObjects.strandSplitTipLines?.forEach((line) => {
    line.geometry.dispose();
    line.material.dispose();
  });
  if (curveObjects.strandTipHandle) {
    curveObjects.strandTipHandle.geometry.dispose();
    curveObjects.strandTipHandle.material.dispose();
  }
  if (curveObjects.strandTipLine) {
    curveObjects.strandTipLine.geometry.dispose();
    curveObjects.strandTipLine.material.dispose();
  }
}

  return {
    createBoneViewHandles,
    updateBoneViewHandles,
    disposeBoneViewHandles,
    createCurveNormalIndicator,
    createSplitControlHandle,
  };
}
