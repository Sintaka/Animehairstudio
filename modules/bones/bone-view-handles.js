// bone-view-handles.js - Viewport bone/segment/split handle create/update/dispose (refactor bones B3).
// Extracted from app.js; coupling injected via createBoneViewHandlesApi(deps).
import * as THREE from "three";
import {
  defaultStrandTipClump,
  segmentBoneHost,
  splitBonesFor,
  strandSplitBonesFor,
  strandSplitsFor,
  strandTipFor,
  PANEL_SEGMENT_HOST,
  SPREAD_MAX,
  STRAND_SEGMENT_HOST
} from "./bone-model.js?v=20260901-1";
import { createTipSubBoneHostApi } from "./tip-sub-bone-host.js?v=20260901-1";
import { TIP_WIDTH_CONTROL_POINTS } from "../geometry/panel-tip-strand.js?v=20260901-1";
import {
  strandTipClumpAxis,
  strandTipWidthControlPlacement,
  strandTipWidthEdgePoints
} from "../geometry/strand-tip-width.js?v=20260901-1";
import {
  firstExposedTipChainIndex,
  materializeTipChain,
  sampleTipPosition,
  TIP_CLUMP_HANDLE_TANGENT_OFFSET
} from "../geometry/tip-sub-bone.js?v=20260830-1";

// deps: store .state proxies (sculptState/sel) + module instances (panelTipStrand) + shared
//   objects (transformControls) + app.js helper functions (clonePanelSplits/isPanelGeometry/
//   panelSplitControlPoint/strandSplitControlPoint/strandSplitProfileData/strandGeometryCurve/
//   strandGeometryFrameAt/currentStrandSplitTipChains).
// ctx passed by the spine updateCurveObjects: { brushDebugVisible, sculptBrushHelpersSuppressed,
//   tipUiActive, brushBonesOnly } (computed in the spine, not recomputed here).
// Batch-fill point in app.js: after the strandGeometryDeps batch (all deps defined).
export function createBoneViewHandlesApi(deps) {
// 发尖子骨骼宿主适配器：panel 段 / 发丝管的单一几何分派（见 tip-sub-bone-host.js）。
// 同规则同步点：bone-interaction.js 用同样的五项 deps 构造同一个 API —— 把手放置（这边）
// 与编辑基准（那边）必须来自同一条变换链，否则一按下就跳。
// **五项都必须惰性求值**：本 API 在 app.js 顶部即被构造，而 deps 要到后面的 Object.assign
// 批次才填满（见文件头 "Batch-fill point in app.js"）。写成 `panelTipStrand: deps.panelTipStrand`
// 会把 undefined 快照下来，之后每次 chainFrameAt 都 TypeError —— 实测由 verify-tip-select.mjs
// 在真实浏览器里抓到（node 测试不执行视口代码，抓不到这类时序 bug）。函数用箭头包一层、
// 对象用 getter，目的都是「调用时才读 deps」。
const { resolveTipHost } = createTipSubBoneHostApi({
  get panelTipStrand() { return deps.panelTipStrand; },
  clonePanelSplits: (...args) => deps.clonePanelSplits(...args),
  currentStrandSplitTipChains: (lock) => deps.currentStrandSplitTipChains(lock),
  strandGeometryCurve: (lock) => deps.strandGeometryCurve(lock),
  strandGeometryFrameAt: (...args) => deps.strandGeometryFrameAt(...args)
});

// 发丝发尖 WidthCurve placement 需要的几何 dep 组：从本模块的 deps 转发，让
// strand-tip-width.js 保持「无 deps 注入的纯函数」形态（node 测试可直接构造这五项）。
// 同规则同步点：bone-interaction.js 有一份同名同形的转发（拖拽读值/写入共用同一放置
// 函数），两处必须转发**同样的五项**，否则把手位置与拖拽基准会来自不同变换链。
// strandSplitTipChains 是第五项（0.2.127）：把手要跟着被拖动的发尖子骨骼链走，链只能取
// currentStrandSplitTipChains（0.2.120 物化空间真源）。
function strandTipWidthGeoDeps() {
  return {
    strandGeometryCurve: deps.strandGeometryCurve,
    strandGeometryFrameAt: deps.strandGeometryFrameAt,
    strandProfileTopologyAt: deps.strandProfileTopologyAt,
    strandSplitProfileData: deps.strandSplitProfileData,
    strandSplitTipChains: (lock) => deps.currentStrandSplitTipChains(lock)
  };
}

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

// Tip width control handles + guide lines for ONE segment/tube: a fixed array of
// TIP_WIDTH_CONTROL_POINTS + 1 handles per side, indexing the FULL SHARED grid
// (tipWidthGridFromHeights): 5 midpoints of the common (deepest-zipper) fork span + the
// tip end (t=1). userData.tipWidthIndex indexes THAT grid, never a per-side filtered
// subset — the placement functions return null for grid positions this side does not
// expose and the update pass hides those handles, so the two sides share spacing while
// exposing different COUNTS (按各自 zipper 高度动态暴露).
// panel（每 panel 段）与 split strand（每管）共用这一份分配：结构完全相同（段 × 侧 ×
// 完整网格索引）且 userData 键相同（tipWidthSegment / tipWidthSide / tipWidthIndex），
// 所以 bone-interaction.js 的拖拽只需要**分派读写函数**、不需要第二套命中/状态字段。
// 几何区分刻意**不**引入平行键（例如 strandTipWidthSegment）：拖拽侧一律从 lock 解析
// 几何（segmentBoneHost / geometryType），少一组键就少一处可漂移的同步点。
//
// 发尖子骨骼**链**把手 + 每点法线箭头 + 每段引导线：panel 段与 split strand 管同样共用
// 一份分配（0.2.126 起；此前发丝只有「每管一个、钉在链末点」的退化把手，无法选中/编辑
// 中间链点）。结构 = 段 × 链点，与上面的 tipWidth 分配（段 × 侧 × 网格索引）并列。
// userData 键 tipSegmentIndex / tipChainPoint 同样**不按几何分叉**（不写平行的
// strandTipSegmentIndex）：命中侧一律从 lock 经 resolveTipHost 解析几何。
// segmentCount / pointCount 一律由调用方从 segmentBoneHost 描述子取（segmentCount /
// tipChainPointCount），本函数不自己推导，避免第二个段数/链长定义点。
function allocateTipChainHandles(lock, group, segmentCount, pointCount, tipChainHandles, tipChainLines, tipNormalArrows) {
  for (let segment = 0; segment < segmentCount; segment += 1) {
    for (let point = 0; point < pointCount; point += 1) {
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
      handle.userData.tipSegmentIndex = segment;
      handle.userData.tipChainPoint = point;
      group.add(handle);
      tipChainHandles.push(handle);
      // 旋转模式下选中发尖子骨骼时，每个暴露链点显示一个法线箭头（子骨骼自身法线）。
      const tipNormalArrow = createCurveNormalIndicator();
      tipNormalArrow.visible = false;
      tipNormalArrow.userData.lockId = lock.id;
      tipNormalArrow.userData.tipSegmentIndex = segment;
      tipNormalArrow.userData.tipChainPoint = point;
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
    tipChainLines.push(line);
  }
}

// 绿色 Tip Clump 手柄（每段/每管一个）：视口里直接拖它就写该段的 bone.tipClump，
// 等价于右侧面板的 #panelSegmentSpread / #strandSegmentSpread 滑杆（控件 id 未随字段改名）。
// panel 段与 split strand 管**共用这一份分配**（0.2.130 起；此前只有 panel 有），与
// allocateTipChainHandles / allocateTipWidthHandles 同样的理由：结构相同（每段一个球）、
// userData 键相同（tipClumpSegment），所以命中侧只需把发丝的门控并进来，拖拽侧只需分派
// 「读/写 spread 的几何函数」，不需要第二套命中字段。
// userData 键刻意**不**按几何分叉（不写 strandTipClumpSegment）：命中侧一律从 lock 经
// segmentBoneHost 解析几何，少一组键就少一处可漂移的同步点。
function allocateTipClumpHandles(lock, group, segmentCount, tipClumpHandles) {
  for (let segment = 0; segment < segmentCount; segment += 1) {
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
    handle.userData.tipClumpSegment = segment;
    group.add(handle);
    tipClumpHandles.push(handle);
  }
}

function allocateTipWidthHandles(lock, group, segmentCount, tipWidthHandles, tipWidthLines) {
  for (let segment = 0; segment < segmentCount; segment += 1) {
    const sideHandles = { left: [], right: [] };
    const sideLines = { left: null, right: null };
    for (const side of [-1, 1]) {
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

function createBoneViewHandles(lock, group) {
  const panelSplitHandles = [];
  const panelSplitLines = [];
  // 绿色 Tip Clump 手柄：panel 段与 split strand 管共用同一个数组（0.2.130 起）。数组名
  // 去掉 panel 前缀，与 tipChainHandles / tipWidthHandles 同规则。
  const tipClumpHandles = [];
  // 发尖链把手/引导线/法线箭头：panel 与 split strand 共用同一对数组（一个 lock 只可能是
  // 其中一种几何，两个分支不会互相覆盖）。数组名去掉 panel 前缀正是为了标明这一点。
  const tipChainHandles = [];
  const tipChainLines = [];
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
    // 绿色 Tip Clump 手柄：每段一个，选中任一发尖时显示，拖拽直接写 bone.tipClump（0..0.99）。
    // 段数从 PANEL_SEGMENT_HOST 取（唯一定义点）：此前就地写 `lock.panelSplits.length + 1`，
    // 与发丝侧构成两处平行推导；现在两种几何走同一个 allocateTipClumpHandles。
    allocateTipClumpHandles(lock, group, PANEL_SEGMENT_HOST.segmentCount(lock), tipClumpHandles);
    // Tip sub-bone handles: one per sub-bone chain point (full chain like the main
    // bone, laterally offset to the segment center). Only points below the segment's
    // fork (zipper) are exposed in updateCurveObjects.
    // 段数与链长都从 PANEL_SEGMENT_HOST 描述子取（唯一定义点，见 bone-model.js）：
    // 此前这里就地写 `lock.panelSplits.length + 1` 与 `lock.points.length`，与发丝侧的
    // 同类表达式构成两处平行推导；现在两种几何走同一个 allocateTipChainHandles。
    allocateTipChainHandles(
      lock,
      group,
      PANEL_SEGMENT_HOST.segmentCount(lock),
      PANEL_SEGMENT_HOST.tipChainPointCount(lock),
      tipChainHandles,
      tipChainLines,
      tipNormalArrows
    );
    // Tip width control (pink curve + control points, per side along the exposed
    // below-zipper chain). Only the selected tip segment's points/curve show.
    allocateTipWidthHandles(lock, group, PANEL_SEGMENT_HOST.segmentCount(lock), tipWidthHandles, tipWidthLines);
  }
  const strandSplitHandles = [];
  const strandSplitLines = [];
  let strandTipHandle = null;
  let strandTipLine = null;
  if (lock.geometryType === "strand") {
    // 每个 strandSplits 条目一个手柄 + 引导线（mirror panelSplitHandles 的按条目构建）。
    lock.strandSplits = deps.cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight);
    lock.strandSplits.forEach((split, index) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xff42cf, transparent: true, opacity: 0.9, depthTest: false })
      );
      line.renderOrder = 6;
      group.add(line);
      strandSplitLines.push(line);
      const handle = createSplitControlHandle();
      handle.userData.lockId = lock.id;
      handle.userData.strandSplitHandle = true;
      handle.userData.strandSplitIndex = index;
      group.add(handle);
      strandSplitHandles.push(handle);
    });
    // Split-strand per-tube tip sub-bone handles + guide lines (Route 2).
    // **0.2.126 起改为「每管 × 每链点」**，与 panel 段共用 allocateTipChainHandles：此前
    // 是「每管一个、钉在链末点（t=1）」的退化分配，导致普通发丝的发尖子骨骼既不能选中、
    // 也无法编辑除末点以外的任何链点（用户报告的「选不到 zipper 分裂出来的子发尖」）。
    // 管数派生（standards「一条推导规则只准有一个定义点」）：拉链数 N → N+1 管，与
    // strandSplitBonesFor 完全同源——它同样是 strandSplitsFor(lock).length + 1，而
    // lock.strandSplits 刚在上面被 cloneStrandSplits 归一化过（排序 + 钳制 + STRAND_SPLIT_MAX
    // 截断），所以这里读它得到的 N 与骨骼/几何三方恒等，不会出现手柄比骨骼多或少。
    // 刻意不写 strandSplitBonesFor(lock)?.length：它对未启用 split 的发丝返回 null，而
    // 手柄必须**预先**按管数分配（创建只在 rebuildCurveObjects 时跑一次，启用 split 后
    // 不会重新分配），非 split 时可见性由更新阶段整体关掉。
    // 这条理由对 STRAND_SEGMENT_HOST.segmentCount 同样成立：它走 strandSplitsFor(lock)，
    // 与刚归一化的 lock.strandSplits 逐值相同，且对未启用 split 的发丝也返回 N+1（不是
    // null），正是「预先分配」需要的语义 —— 所以这里用描述子而不是骨骼数组长度。
    const strandSplitTipTubeCount = STRAND_SEGMENT_HOST.segmentCount(lock);
    allocateTipChainHandles(
      lock,
      group,
      strandSplitTipTubeCount,
      STRAND_SEGMENT_HOST.tipChainPointCount(lock),
      tipChainHandles,
      tipChainLines,
      tipNormalArrows
    );
    // 每管发尖 WidthCurve 把手 + 引导线（与 panel 段共用 allocateTipWidthHandles，
    // 因此结构与 userData 键完全一致）。管数与上面的发尖链把手**同源**
    // （strandSplitTipTubeCount，理由见该处注释）：两次分配必须给同样多的管，否则某根管
    // 会有发尖把手却没有宽度把手。
    // 与 panel 分支互斥：一个 lock 只可能是 panel 或 strand，所以两边共用同一对
    // tipWidthHandles / tipWidthLines（以及 tipChainHandles / tipChainLines）不会互相覆盖。
    allocateTipWidthHandles(lock, group, strandSplitTipTubeCount, tipWidthHandles, tipWidthLines);
    // 每管一个绿色 Tip Clump 手柄（0.2.130 移植自 panel）。管数与上面两次分配**同源**
    // （strandSplitTipTubeCount）：三者必须给同样多的管，否则某根管会缺一种手柄。
    allocateTipClumpHandles(lock, group, strandSplitTipTubeCount, tipClumpHandles);
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
    tipClumpHandles,
    tipChainHandles,
    tipChainLines,
    tipNormalArrows,
    tipWidthHandles,
    tipWidthLines,
    strandSplitHandles,
    strandSplitLines,
    strandTipHandle,
    strandTipLine,
    branchSweepStartHandle
  };
}

// panel 段的绿色 Tip Clump 手柄世界位置。**逐字保留 0.2.61–0.2.65 的既有表达式**（本轮把
// panel/发丝的公共外壳抽成 tipClumpCtx 时原样搬进这个具名函数，位置与偏移一字未动）：
//   handleU = boundaries[seg] + (tipClump / SPREAD_MAX) * span
// 手柄 = trim/curve 适配的 rest 尖端表面点（tipSurfaceFrameAt 内部已应用 panelTipCurve +
// edge trim 的 tipOffsetSampleT）沿切线 y 外推 TIP_CLUMP_HANDLE_TANGENT_OFFSET，再叠加链
// 最后一点（t=1 尖端）的 authored delta（points − restPoints），从而跟随用户拖过的发尖。
// 发丝侧的对应实现是 strandTipClumpAxis（geometry 层，绘制与拖拽共用），刻意不合并：panel
// 的横向参数是**面板 u**、发丝是**管内边缘插值**，共用一个函数会得到一个带 if(几何) 的壳。
function panelTipClumpHandlePoint(lock, segment, tipSplits, tipSplitBones, segmentBoundaries, tipChains) {
  const bone = tipSplitBones[segment] || null;
  const span = Math.max(0.0001, segmentBoundaries[segment + 1] - segmentBoundaries[segment]);
  const tipClump = bone?.tipClump ?? 0;
  const handleU = segmentBoundaries[segment] + (tipClump / SPREAD_MAX) * span;
  const surfaceFrame = deps.panelTipStrand.tipSurfaceFrameAt(lock, 1, handleU, segment, tipSplits);
  const point = surfaceFrame.point.clone().addScaledVector(surfaceFrame.y, TIP_CLUMP_HANDLE_TANGENT_OFFSET);
  const chain = tipChains[segment];
  if (chain && Array.isArray(chain.points) && Array.isArray(chain.restPoints)
    && chain.points.length >= 2 && chain.restPoints.length >= 2) {
    const last = chain.points.length - 1;
    point.add(new THREE.Vector3().subVectors(chain.points[last], chain.restPoints[last]));
  }
  return point;
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
    const dragging = deps.sculptState.panelSplitDrag?.lockId === lock.id && deps.sculptState.panelSplitDrag.splitIndex === index;
    // 被选中的 zipper（按 order 匹配）放大并提亮，便于识别 Del 目标。
    const selected = deps.sculptState.panelSplitSelection?.lockId === lock.id
      && Number(deps.sculptState.panelSplitSelection.order) === Number(split.order);
    handle.material.opacity = selected ? 1 : dragging ? 0.9 : 0.68;
    handle.scale.setScalar(selected ? 1.3 : 1);
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
  // ── 发尖子骨骼链把手/法线箭头/引导线的几何分派（0.2.126） ──────────────────────────
  // 与下方 tipWidth 的 tipWidthCtx 同款结构：一个 ctx 提供「本几何的段数 / 每段链 / 每段
  // fork / 参考帧 / 基础可见性」，两个 forEach 只消费 ctx、不再自己 if(几何)。
  // panel 分支**刻意复用**上面已算好的 tipChains / tipForkTs（同一批值、同一批调用），
  // 所以 panel 的可见性、位置、朝向、透明度逐字不变；发丝分支从 host 现取。
  // 基础门控与 panel 原条件同构：brush 抑制时若有发尖被选中仍显示（tipUiActive），
  // 发丝额外要求 strandSplitEnabled（非 split 发丝走 Route 1 的单发尖把手，见文件末尾）。
  const tipChainCtx = (() => {
    const host = resolveTipHost(lock);
    if (!host) return null;
    const base = (!sculptBrushHelpersSuppressed || tipUiActive) && !brushDebugVisible;
    if (host.kind === "panel") {
      return { host, base: base && tipSplits.length > 0, chains: tipChains, forkTs: tipForkTs };
    }
    return {
      host,
      base: base && Boolean(lock.strandSplitEnabled),
      chains: Array.from({ length: host.segmentCount }, (_, segment) => host.tipChainFor(segment)),
      forkTs: Array.from({ length: host.segmentCount }, (_, segment) => host.forkTFor(segment))
    };
  })();
  // ── 绿色 Tip Clump 手柄的几何分派（0.2.130） ──────────────────────────────────────
  // 与 tipChainCtx / tipWidthCtx 同款结构：ctx 提供「基础可见性 + 该段手柄世界位置」，
  // forEach 只消费 ctx，不再自己 if(几何)。panel 分支**逐字复用**原来的表达式（同一批
  // tipSplitBones / tipSplits / segmentBoundaries、同一个 tipSurfaceFrameAt + 链 delta），
  // 所以 panel 的位置与可见性一字不变；发丝分支走共享的 strandTipClumpAxis（绘制与拖拽
  // 扫描共用同一条线段，见 strand-tip-width.js 的说明）。
  const tipClumpCtx = (() => {
    const host = segmentBoneHost(lock);
    if (!host) return null;
    // 有意设计（请勿改动）：只要任一子发尖被选中，**所有**段的绿色手柄都会显示，视口里可以
    // 同时拖任意段的手柄来调该段 spread；拖非选中段的手柄不会切换 tipSelection
    // （保持当前选中的发尖段不变），与子发尖的选中/编辑互不干扰。
    const base = tipUiActive && !sculptBrushHelpersSuppressed && !brushDebugVisible;
    if (host === PANEL_SEGMENT_HOST) {
      return {
        base: base && deps.isPanelGeometry(lock) && lock.panelSplitEnabled !== false,
        pointFor: (segment) => panelTipClumpHandlePoint(lock, segment, tipSplits, tipSplitBones, segmentBoundaries, tipChains)
      };
    }
    const strandBones = strandSplitBonesFor(lock);
    if (!strandBones) return null;
    const strandSplits = strandSplitsFor(lock);
    const geo = strandTipWidthGeoDeps();
    return {
      // 门控与该管的 WidthCurve 手柄同构（见下方 tipWidthCtx 的 strand 分支）：非 hairCard、
      // 已开启 split、且是当前选中对象。
      base: base && !lock.hairCard && Boolean(lock.strandSplitEnabled) && lock.id === deps.sel.selectedId,
      pointFor: (segment) => {
        const axis = strandTipClumpAxis(geo, lock, strandSplits, segment, strandBones[segment] || null);
        if (!axis) return null;
        return axis.pointAt(strandBones[segment]?.tipClump ?? defaultStrandTipClump(lock));
      }
    };
  })();
  lock.curveObjects.tipClumpHandles?.forEach((handle, segment) => {
    const visible = Boolean(tipClumpCtx) && tipClumpCtx.base;
    handle.visible = visible;
    if (!visible) return;
    const point = tipClumpCtx.pointFor(segment);
    if (!point) {
      handle.visible = false;
      return;
    }
    handle.position.copy(point);
    // 选中段高亮与 WidthCurve 一致（选中 0.9、拖拽中 1、未选中 0.68）。
    const selected = deps.sculptState.tipSelection?.lockId === lock.id
      && deps.sculptState.tipSelection.segmentIndex === segment;
    const dragging = deps.sculptState.panelSplitDrag?.lockId === lock.id
      && deps.sculptState.panelSplitDrag.kind === "segment"
      && deps.sculptState.panelSplitDrag.splitIndex === segment;
    handle.material.opacity = dragging ? 1 : (selected ? 0.9 : 0.68);
  });
  lock.curveObjects.tipChainHandles?.forEach((handle, handleIndex) => {
    const segment = handle.userData.tipSegmentIndex;
    const point = handle.userData.tipChainPoint;
    const arrow = lock.curveObjects.tipNormalArrows?.[handleIndex];
    const tip = tipChainCtx?.chains?.[segment] || null;
    // 旋转模式下选中发尖子骨骼时，给每个暴露链点显示自身法线箭头。
    const syncTipNormalArrow = () => {
      if (!arrow) return;
      const tipSelected = deps.sculptState.tipSelection?.lockId === lock.id
        && deps.sculptState.tipSelection.segmentIndex === segment;
      arrow.visible = handle.visible && tipSelected && deps.sel.activeTool === "rotate";
      if (!arrow.visible) return;
      const chainT = point / Math.max(1, tip.points.length - 1);
      arrow.position.copy(tip.points[point]);
      // 参考帧按几何分派（panel = 段表面帧 z / 发丝 = 该管发丝几何帧 z），两侧都落到
      // tip-sub-bone.js 的同一个 tipChainFrameAt 原语上。
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipChainCtx.host.chainFrameAt(segment, tip, chainT).z);
      arrow.scale.setScalar(0.14);
    };
    const visible = Boolean(tipChainCtx) && tipChainCtx.base;
    handle.visible = visible;
    if (!visible) {
      syncTipNormalArrow();
      return;
    }
    if (!tip || !Array.isArray(tip.points) || point >= tip.points.length) {
      handle.visible = false;
      syncTipNormalArrow();
      return;
    }
    const forkT = tipChainCtx.forkTs[segment] ?? 1;
    const t = point / Math.max(1, tip.points.length - 1);
    // 暴露判据走 firstExposedTipChainIndex（tip-sub-bone.js 的唯一定义点）：fork 行本身
    // 暴露、下限钳 1。此前这里内联同一条 floor 表达式，与引导线/笔刷/gizmo 三处并列副本。
    if (point < firstExposedTipChainIndex(forkT, tip.points.length)) {
      handle.visible = false;
      syncTipNormalArrow();
      return;
    }
    handle.position.copy(new THREE.Vector3(tip.points[point].x, tip.points[point].y, tip.points[point].z));
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
      const chainFrame = tipChainCtx.host.chainFrameAt(segment, tip, t);
      handle.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(chainFrame.x, chainFrame.y, chainFrame.z));
    }
    const isSelected = deps.sculptState.tipSelection?.lockId === lock.id
      && deps.sculptState.tipSelection.segmentIndex === segment;
    const isDragged = deps.sculptState.panelSplitDrag?.lockId === lock.id
      && deps.sculptState.panelSplitDrag.kind === "tip"
      && deps.sculptState.panelSplitDrag.splitIndex === segment
      && deps.sculptState.panelSplitDrag.tipPoint === point;
    handle.material.opacity = isDragged ? 0.95 : (isSelected ? 0.95 : 0.4);
    syncTipNormalArrow();
  });
  // Guide lines connecting each sub-bone's exposed (below-fork) chain portion.
  lock.curveObjects.tipChainLines?.forEach((line, segment) => {
    const visible = Boolean(tipChainCtx) && tipChainCtx.base;
    line.visible = visible;
    if (!visible) return;
    const tip = tipChainCtx.chains?.[segment];
    if (!tip || !Array.isArray(tip.points) || tip.points.length < 2) {
      line.visible = false;
      return;
    }
    const forkT = tipChainCtx.forkTs[segment] ?? 1;
    // 暴露区间与把手**同源**（firstExposedTipChainIndex）：引导线画的必须正好是可抓的那
    // 一段，否则用户会看到线上有一截没有手柄（或反之）。
    const exposed = tip.points
      .slice(firstExposedTipChainIndex(forkT, tip.points.length))
      .map((p) => new THREE.Vector3(p.x, p.y, p.z));
    if (exposed.length < 2) {
      line.visible = false;
      return;
    }
    line.geometry.dispose();
    line.geometry = new THREE.BufferGeometry().setFromPoints(exposed);
    line.material.opacity = deps.sculptState.tipSelection?.lockId === lock.id
      && deps.sculptState.tipSelection.segmentIndex === segment
      ? 0.95 : 0.45;
  });
  // ── 发尖 WidthCurve 把手/引导线的几何分派 ────────────────────────────────────────
  // 门控从「panel only」扩为「panel 或 split strand」，panel 分支逐字不变（同一批条件、
  // 同一个 tipWidthControlPlacement），发丝分支额外要求 strandSplitEnabled 且跳过 hairCard。
  // **选中语义（0.2.126 起两侧同源，勿据旧注释回改）**：两侧都读 tipSelection。
  // 0.2.125 的 Phase D 曾在发丝侧改读 strandSegmentIndex，理由是「发丝没有等价的发尖选择
  // 状态」——该前提已不成立（本轮就是补上它），且用 strandSegmentIndex 会让宽度把手在**没
  // 选中任何发尖**时也一直显示（它恒非 null），与 panel 手感不一致。现在发丝也走
  // 「选中某管发尖 ⇒ 只显示该管的宽度把手」。
  // 悬空选择由 selectLock 的统一清理路径处理（切 lock 即清），删管后残留的段号仍由
  // resolveSegmentSelection 钳位负责——两者职责不同，都要留。
  // 分派点用 segmentBoneHost（bone-model 的单一分派），与 bone-interaction.js 的
  // tipWidth 分支同规则：把手放置与拖拽必须落在同一侧。
  const tipWidthCtx = (() => {
    if (segmentBoneHost(lock) !== STRAND_SEGMENT_HOST) {
      if (!deps.isPanelGeometry(lock)) return null;
      const selection = deps.sculptState.tipSelection;
      return {
        base: (!sculptBrushHelpersSuppressed || tipUiActive)
          && !brushDebugVisible
          && lock.panelSplitEnabled !== false
          && tipSplits.length > 0,
        selectedSegment: selection && selection.lockId === lock.id ? selection.segmentIndex : null,
        placement: (segment, side, index) => deps.panelTipStrand.tipWidthControlPlacement(
          lock, segment, tipSplits, tipSplitBones[segment] || null, side, index
        ),
        edgePoints: (segment, side) => deps.panelTipStrand.tipWidthEdgePoints(
          lock, segment, tipSplits, tipSplitBones[segment] || null, side
        )
      };
    }
    const strandBones = strandSplitBonesFor(lock);
    if (!strandBones) return null;
    // splits 取 strandSplitsFor（排序 + 钳制 + legacy 单标量回退）：与几何的段划分、
    // strandSplitForkTForSegment 的 fork 推导同真源，勿改成读原始 lock.strandSplits。
    const strandSplits = strandSplitsFor(lock);
    const geo = strandTipWidthGeoDeps();
    const strandSelection = deps.sculptState.tipSelection;
    return {
      // base 与 panel 分支同构：brush 抑制时若有发尖被选中仍显示（tipUiActive）。
      base: (!sculptBrushHelpersSuppressed || tipUiActive)
        && !brushDebugVisible
        && !lock.hairCard
        && Boolean(lock.strandSplitEnabled)
        && lock.id === deps.sel.selectedId,
      selectedSegment: strandSelection && strandSelection.lockId === lock.id ? strandSelection.segmentIndex : null,
      placement: (segment, side, index) => strandTipWidthControlPlacement(
        geo, lock, strandSplits, segment, strandBones[segment] || null, side, index
      ),
      edgePoints: (segment, side) => strandTipWidthEdgePoints(
        geo, lock, strandSplits, segment, strandBones[segment] || null, side
      )
    };
  })();
  lock.curveObjects.tipWidthHandles?.forEach((sideHandles, segment) => {
    const baseVisible = Boolean(tipWidthCtx)
      && tipWidthCtx.base
      && tipWidthCtx.selectedSegment === segment;
    for (const side of [-1, 1]) {
      const list = side < 0 ? sideHandles.left : sideHandles.right;
      list.forEach((handle, index) => {
        if (!baseVisible) {
          handle.visible = false;
          return;
        }
        const placement = tipWidthCtx.placement(segment, side, index);
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
    const lineBase = Boolean(tipWidthCtx)
      && tipWidthCtx.base
      && tipWidthCtx.selectedSegment === segment;
    for (const side of [-1, 1]) {
      const line = side < 0 ? sideLines.left : sideLines.right;
      if (!line) continue;
      if (!lineBase) {
        line.visible = false;
        continue;
      }
      const edgePoints = tipWidthCtx.edgePoints(segment, side);
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
  // !tipUiActive 与 panel 的 zipper 手柄同规则（见上方 panelSplitHandles 块）：选中某管
  // 发尖后，该管的绿色宽度控制点与黄色链末点手柄都落在管边缘/fork 附近，而 zipper 球体
  // 更大、renderOrder 相同，会抢走拖拽。取消发尖选中即可继续拖 zipper。这条 0.2.126 才对
  // 发丝生效，因为在此之前发丝根本无法选中发尖（tipUiActive 恒为 false）。
  // 注：手柄与引导线**一起**隐藏（下方 `if (!visible)` 分支），与 panel 块的实际行为一致
  // ——panel 那里的注释写「LINES stay visible」与代码不符，勿据那句话把这里改成只藏球体。
  const strandSplitVisible = !tipUiActive
    && !sculptBrushHelpersSuppressed
    && !brushDebugVisible
    && lock.geometryType === "strand"
    && !lock.hairCard
    && Boolean(lock.strandSplitEnabled);
  const strandSplitHandles = lock.curveObjects.strandSplitHandles || [];
  const strandSplitLines = lock.curveObjects.strandSplitLines || [];
  const strandSplits = strandSplitVisible
    ? deps.cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight)
    : [];
  const strandProfileData = strandSplitVisible ? deps.strandSplitProfileData(lock) : null;
  strandSplitHandles.forEach((handle, index) => {
    const split = strandSplits[index];
    const line = strandSplitLines[index];
    const visible = strandSplitVisible && Boolean(split);
    handle.visible = visible;
    if (!visible) {
      if (line) line.visible = false;
      return;
    }
    handle.position.copy(deps.strandSplitControlPoint(lock, split, null, null, strandProfileData));
    const dragging = deps.sculptState.panelSplitDrag?.lockId === lock.id
      && deps.sculptState.panelSplitDrag.kind === "strand"
      && deps.sculptState.panelSplitDrag.splitIndex === index;
    // 被选中的 strand zipper（按 order 匹配）放大并提亮，便于识别 Del 目标。
    const selected = deps.sculptState.strandSplitSelection?.lockId === lock.id
      && Number(deps.sculptState.strandSplitSelection.order) === Number(split.order);
    handle.material.opacity = selected ? 1 : dragging ? 0.9 : 0.68;
    handle.scale.setScalar(selected ? 1.3 : 1);
    if (!line) return;
    line.visible = true;
    line.geometry.dispose();
    const points = [];
    const startT = 1 - Number(split.height ?? 0.3);
    for (let step = 0; step <= 12; step += 1) {
      points.push(deps.strandSplitControlPoint(
        lock,
        split,
        THREE.MathUtils.lerp(startT, 1, step / 12),
        null,
        strandProfileData
      ));
    }
    line.geometry = new THREE.BufferGeometry().setFromPoints(points);
  });
  // 刻意不改（0.2.126）：split 发丝的「每管一个、钉在链末点」把手块**已删除**，改由上方与
  // panel 共用的 tipChainHandles / tipChainLines 承担（每管 × 每链点，只暴露 fork 以下）。
  // 保留这条注释是为了让下一个人知道那块不是漏了：末点手柄现在就是该管链的最后一个链点
  // 手柄，位置逐值相同；引导线则从「整条链」收窄为「暴露段」，与 panel 一致、也与可抓范围
  // 一致（此前线画到 fork 以上却抓不到，属误导）。Route 1（非 split 单发尖）仍独立保留。
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
  curveObjects.tipClumpHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  curveObjects.tipChainHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  curveObjects.tipChainLines?.forEach((line) => {
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
  curveObjects.strandSplitHandles?.forEach((handle) => {
    handle.geometry.dispose();
    handle.material.dispose();
  });
  if (curveObjects.branchSweepStartHandle) {
    curveObjects.branchSweepStartHandle.geometry.dispose();
    curveObjects.branchSweepStartHandle.material.dispose();
  }
  curveObjects.strandSplitLines?.forEach((line) => {
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
