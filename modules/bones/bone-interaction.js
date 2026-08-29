// bone-interaction.js - Bone gizmo / handle drag / brush interaction (refactor bones B2).
// Extracted from app.js; coupling injected via createXxxApi(deps).
import * as THREE from "three";
import { materializeSplitBones } from "./bone-model.js?v=20260901-1";
import {
  materializeStrandSplitBones,
  segmentBoneHost,
  strandSplitsFor,
  SPREAD_MAX,
  STRAND_SEGMENT_HOST
} from "./bone-model.js?v=20260901-1";
import { createTipSubBoneHostApi } from "./tip-sub-bone-host.js?v=20260901-8";
import { firstExposedTipChainIndex } from "../geometry/tip-sub-bone.js?v=20260830-1";
import {
  setStrandTipWidthCurveValue,
  strandTipClumpAxis,
  strandTipWidthControlPlacement,
  strandTipWidthEdgePosition,
  strandTipWidthMultiplierAt
} from "../geometry/strand-tip-width.js?v=20260901-1";
import { leafIndexAt, leafWeightsValid } from "../geometry/leaf-weights.js?v=20260813-1";
import { sculptBrushWeight, sculptTwistBrushDeltas, smoothSculptPointDeltas, smoothSculptTwistDeltas, resolveFrozenTwistStrokeWeights } from "../sculpt/sculpt-brush.js?v=20260814-12";
// Width Brush 内核单独成文件的理由（dom-contract 冻结了 app.js 的 sculpt-brush 版本串）见
// width-brush.js 文件头。smoothLinearScalarDeltas 是本轮新增的线性（无角度 wrap）标量平滑，
// 同一理由落在这个文件而不是 sculpt-brush.js。
import { nearestScreenCandidate, sculptWidthBrushMultiplier, smoothLinearScalarDeltas } from "../sculpt/width-brush.js?v=20260910-10";
// 控制点总数：与 bone-view-handles.js 的把手分配同一个常量（每侧 TIP_WIDTH_CONTROL_POINTS + 1
// 个，索引完整共享网格）。笔刷枚举候选点必须用同一个上界，否则会漏掉最后一个（发尖端点）。
import { TIP_WIDTH_CONTROL_POINTS } from "../geometry/panel-tip-strand.js?v=20260910-16";
import { solvePulledStrand } from "../geometry/strand-constraints.js?v=20260814-12";

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
// 发丝发尖 WidthCurve placement 的几何 dep 组。同规则同步点：
// bone-view-handles.js 有一份同名同形的转发 —— 把手位置（那边）与拖拽基准/读值（这边）
// 必须来自**同一条变换链**，否则一按下就会跳。改一处必须改两处。
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

// 发尖子骨骼宿主适配器（见 tip-sub-bone-host.js）。同规则同步点：bone-view-handles.js 用
// **同样的五项** deps 构造同一个 API —— 把手放置（那边）与编辑基准（这边）必须来自同一条
// 变换链，否则一按下就跳。改一处必须改两处。
// **五项都必须惰性求值**（getter / 箭头包一层）：本 API 在 app.js 顶部即被构造
// （createBoneInteractionApi），deps 要到后面的 Object.assign 批次才填满，直接快照
// `deps.panelTipStrand` 会存下 undefined，之后每次取 panel 发尖链都 TypeError。
const { resolveTipHost } = createTipSubBoneHostApi({
  get panelTipStrand() { return deps.panelTipStrand; },
  clonePanelSplits: (...args) => deps.clonePanelSplits(...args),
  currentStrandSplitTipChains: (lock) => deps.currentStrandSplitTipChains(lock),
  strandGeometryCurve: (lock) => deps.strandGeometryCurve(lock),
  strandGeometryFrameAt: (...args) => deps.strandGeometryFrameAt(...args),
  // 第六项（中间层接线）：让 resolveTipHost 自己取当前选中的分组路径。
  // **本项与 bone-view-handles.js 的同名注入必须逐字一致** —— 这是文件头那条「两个消费方
  // 必须注入同样的项」的约束在本轮的延伸：拖拽基准（这边）与把手位置（那边）若只有一边
  // 认得中间层，就会出现「把手画在中间层、拖拽写回叶子」。
  selectedPanelBoneGroupPath: () => deps.selectedPanelBoneGroupPath?.()
});

// 发尖子骨骼编辑的公共前置（0.2.126）：解析宿主 → 取**活**骨骼 → 取**物化**发尖链。
// 五条编辑路径共用（rotate 起始 / translate 起始 / gizmo 应用 / 视平面拖拽 / 笔刷），
// 替代此前每条各写一遍的 panel 专用三连（clonePanelSplits + materializeSplitBones +
// panelTipStrand.splitTipForSegment）—— 那三连对发丝是错的：clonePanelSplits 会凭空造出
// 与真实 zipper 无关的假 panelSplits，materializeSplitBones 写的是 lock.splitBones（发丝
// 的段骨骼在 lock.strandSplitBones）。
// materialize: true 是必需的 —— 只读的 bonesFor 返回派生副本，写进去的 bone.tip 会被丢弃。
function tipEditContext(handle) {
  const lock = deps.locks.find((item) => item.id === handle?.userData?.lockId);
  const segment = handle?.userData?.tipSegmentIndex;
  const point = handle?.userData?.tipChainPoint;
  if (!lock || segment == null || point == null) return null;
  const host = resolveTipHost(lock, { materialize: true });
  if (!host) return null;
  const bone = host.bones?.[segment];
  if (!bone) return null;
  const tip = host.tipChainFor(segment);
  if (!tip || !Array.isArray(tip.points) || !Array.isArray(tip.restPoints) || point >= tip.points.length) return null;
  return { lock, host, segment, point, bone, tip };
}

// 拖拽起始快照的**唯一**取值口径（0.2.120 物化空间规则）：
//   startPoints ← 物化链 tip.points（视口所画、也是 handle.position 所在的空间）
//   restPoints  ← 物化链 tip.restPoints（同一次物化的 rest 基准）
// 两者成对取自**同一次** materialize，所以「编辑后写回 authored.points=结果 /
// authored.restPoints=这份 rest」是自洽的（delta 重叠加为恒等）。
// **刻意不再读 bone.tip.points 当种子**（此前 panel 的 rotate/translate 都读它）：那是
// **旧** rest 基准下的陈旧绝对坐标，而 handle.position / gizmo 增量都在物化空间 —— 两者混
// 用时，只要 rest 自上次创作后动过（主链编辑、zipper 位置/高度、spread、面板宽度、发丝
// Split Spacing 都会动 rest），一按下就会跳，跳回量恰等于 rest 位移（bug-fixes #16 同类）。
// rest 未变时物化值与 authored 逐值相同，故对既有 panel 工程行为不变。
function tipDragSnapshot(tip) {
  return {
    startPoints: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    restPoints: tip.restPoints.map((p) => ({ x: p.x, y: p.y, z: p.z }))
  };
}

// 编辑结果写回 authored：points = 物化空间的编辑结果，restPoints = 同批 rest。
// 这两行必须成对出现（单独改 points 会让 delta 相对旧 rest 被重新解释）。
function writeTipEdit(bone, points, restPoints) {
  bone.tip = {
    ...(bone.tip || {}),
    points: points.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    restPoints: restPoints.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    active: true
  };
}

// 选中某段/管的发尖子骨骼，并把「当前段」指过去（0.2.126，两种几何共用一条路径）。
// tipSelection 与 segmentIndexKey 的关系见 sculpt-edit-store.js 的注释：前者是视口选中
// （可为 null），后者是右侧面板当前段（恒非 null）。段号写的是 host.segmentIndexKey
// （panel → panelSegmentIndex / 发丝 → strandSegmentIndex），刻意不共用一个段号：两套段号
// 必须能各自停在不同下标（0.2.125 结论）。
// syncSegmentControlsForLock 由 segment-control.js 按 segmentBoneHost 再分派一次到对应
// 的那组 DOM 控件，所以这里不需要 if(几何) 选 sync 函数。
function selectTipSubBone(lock, segmentIndex) {
  const host = segmentBoneHost(lock);
  if (!host) return;
  deps.sculptState.tipSelection = { lockId: lock.id, segmentIndex };
  deps.sculptState[host.segmentIndexKey] = segmentIndex;
  deps.syncSegmentControlsForLock(lock);
}

function beginTipSubBoneRotate(handle) {
  const ctx = tipEditContext(handle);
  if (!ctx) return;
  const snapshot = tipDragSnapshot(ctx.tip);
  deps.sculptState.tipSubBoneRotateDrag = {
    lockId: ctx.lock.id,
    segmentIndex: ctx.segment,
    tipPoint: ctx.point,
    startQuaternion: handle.quaternion.clone(),
    ...snapshot
  };
}

function beginTipSubBoneTranslate(handle) {
  const ctx = tipEditContext(handle);
  if (!ctx) return;
  const snapshot = tipDragSnapshot(ctx.tip);
  deps.sculptState.tipSubBoneTranslateDrag = {
    lockId: ctx.lock.id,
    segmentIndex: ctx.segment,
    tipPoint: ctx.point,
    startPosition: handle.position.clone(),
    ...snapshot
  };
}

function applyTipSubBoneTransform(lock, handle) {
  const mode = deps.transformControls.mode;
  if (mode === "scale") {
    // scale 暂不应用：把手缩放恢复创建时的基准值，避免 gizmo 视觉累积。
    handle.scale.setScalar(0.42);
    return;
  }
  // 起始快照里的 startPoints/restPoints 已是**物化空间**（tipDragSnapshot），所以下面全程
  // 只在该空间里算，最后成对写回 points/restPoints（writeTipEdit）。
  // 几何分派全部经 tipEditContext → resolveTipHost：panel 段与发丝管走同一段代码。
  const ctx = tipEditContext(handle);
  if (!ctx) return;
  const { segment, point, bone } = ctx;
  if (mode === "translate") {
    const drag = deps.sculptState.tipSubBoneTranslateDrag;
    if (!drag || drag.lockId !== lock.id) return;
    if (drag.segmentIndex !== segment || drag.tipPoint !== point) return;
    if (drag.startPoints.length < 2) return;
    // fork 以下第一个暴露点：把暴露子链当整体做 Pull Strand 求解，根点钉在 fork 处。
    // 暴露判据走 firstExposedTipChainIndex（tip-sub-bone.js 唯一定义点，floor + 下限 1）。
    const firstBelow = firstExposedTipChainIndex(ctx.host.forkTFor(segment), drag.restPoints.length);
    if (point < firstBelow) return;
    const exposedVecs = [];
    for (let i = firstBelow; i < drag.startPoints.length; i += 1) {
      const src = drag.startPoints[i] || { x: 0, y: 0, z: 0 };
      exposedVecs.push(new THREE.Vector3(src.x, src.y, src.z));
    }
    const solved = solvePulledStrand(exposedVecs, point - firstBelow, handle.position, 0, deps.sculptState.pullRigidity);
    const next = drag.startPoints.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    for (let i = firstBelow; i < next.length; i += 1) {
      const v = solved[i - firstBelow];
      next[i] = { x: v.x, y: v.y, z: v.z };
    }
    writeTipEdit(bone, next, drag.restPoints);
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    return;
  }
  if (mode !== "rotate") return;
  const drag = deps.sculptState.tipSubBoneRotateDrag;
  if (!drag || drag.lockId !== lock.id) return;
  if (drag.segmentIndex !== segment || drag.tipPoint !== point) return;
  if (drag.startPoints.length < 2) return;
  const dq = drag.startQuaternion.clone().invert().multiply(handle.quaternion);
  const pivot = drag.startPoints[point];
  if (!pivot) return;
  const pivotVec = new THREE.Vector3(pivot.x, pivot.y, pivot.z);
  const next = drag.startPoints.map((p) => ({ x: p.x, y: p.y, z: p.z }));
  for (let i = point; i < next.length; i += 1) {
    const src = drag.startPoints[i] || { x: 0, y: 0, z: 0 };
    const rotated = new THREE.Vector3(src.x, src.y, src.z).sub(pivotVec).applyQuaternion(dq).add(pivotVec);
    next[i] = { x: rotated.x, y: rotated.y, z: rotated.z };
  }
  writeTipEdit(bone, next, drag.restPoints);
  deps.updateLockGeometry(lock, { immediate: true });
  deps.updateCurveObjects(lock, { visible: true });
  deps.syncActiveMirror(lock, { deferGeometry: false });
}

// 当前可抓的绿色 Tip Clump 手柄（可见 + 本几何有段骨骼宿主）。**唯一定义点**：
// beginPanelSplitHandleDrag 的命中列表与 prepareCurvePointSelection 的让位判据都读它，
// 两处必须认同同一组对象，否则会出现「让位了但抓不到」或「抓得到却被抢走」。
function visibleTipClumpHandles(lock) {
  if (!lock || !Boolean(segmentBoneHost(lock)) || !lock.curveObjects?.group.visible) return [];
  return (lock.curveObjects.tipClumpHandles || []).filter((handle) => handle.visible);
}

// 指针是否正落在某个绿色 Tip Clump 手柄上（射线命中球体本身，非屏幕半径）。
// 用途见 prepareCurvePointSelection 里的让位注释。调用方需已设好 deps.raycaster。
function pointerHitsTipClumpHandle(lock) {
  const handles = visibleTipClumpHandles(lock);
  if (!handles.length) return false;
  return Boolean(deps.raycaster.intersectObjects(handles, false)[0]);
}

function beginPanelSplitHandleDrag(event) {
  if (event.button !== 0 || event.shiftKey || event.altKey || event.metaKey) return false;
  const lock = deps.getSelectedLock();
  const panelHandles = deps.isPanelGeometry(lock) && lock.curveObjects?.group.visible
    ? lock.curveObjects.panelSplitHandles || []
    : [];
  // 绿色 Tip Clump 手柄：0.2.130 起 panel 段与 split strand 管**共用同一个数组与同一个
  // userData 键**（tipClumpSegment），门控走 visibleTipClumpHandles（segmentBoneHost 非 null
  // ⇔ panel/surface 或已分裂普通发丝），不再手写 isPanelGeometry。
  const segmentHandles = visibleTipClumpHandles(lock);
  // 发尖链把手与发尖 WidthCurve 把手：panel 段与 split strand 管**共用同一个数组与同一批
  // userData 键**（bone-view-handles.js 的 allocateTipChainHandles / allocateTipWidthHandles），
  // 所以命中列表只需要把发丝的门控并进来，而不是加一条平行分支。可见性本身已由更新阶段按
  // 选中段/管过滤（下面还会 filter(handle.visible)）。
  // 门控条件两处**必须同规则**：段发尖子骨骼存在 <=> segmentBoneHost(lock) 非 null，即
  // panel/surface 或「strand 且 strandSplitEnabled」。用 segmentBoneHost 而不是手写
  // geometryType 判断，就是为了不再新增第四处平行条件。
  const tipHostGate = Boolean(segmentBoneHost(lock)) && lock.curveObjects?.group.visible;
  const tipHandles = tipHostGate ? lock.curveObjects.tipChainHandles || [] : [];
  const tipWidthHandles = tipHostGate
    ? (lock.curveObjects.tipWidthHandles || []).flatMap((seg) => [...seg.left, ...seg.right])
    : [];
  const strandHandle = lock?.geometryType === "strand"
    && lock.strandSplitEnabled
    && lock.curveObjects?.group.visible
    ? (lock.curveObjects.strandSplitHandles || []).filter((handle) => handle.visible)
    : [];
  // 刻意不改（0.2.126）：原先并入的 strandSplitTipHandles（每管一个末点把手）已删除 ——
  // 它的职责被 tipHandles 里该管链的最后一个链点手柄接走（位置逐值相同）。
  const handles = [...tipWidthHandles, ...panelHandles, ...segmentHandles, ...tipHandles, ...strandHandle];
  if (!handles.length) return false;
  const hit = deps.raycaster.intersectObjects(handles.filter((handle) => handle.visible), false)[0];
  if (!hit) return false;
  // Ctrl+drag is the tip width asymmetric edit; it must not grab zipper/segment/tip handles.
  if (event.ctrlKey && hit.object.userData.tipWidthIndex == null) return false;
  const gizmoTipIndex = hit.object.userData.tipSegmentIndex != null ? hit.object.userData.tipSegmentIndex : null;
  if (gizmoTipIndex != null && ["move", "rotate", "scale"].includes(deps.sel.activeTool)) {
    // 移动/旋转/缩放工具：tip 手柄挂到 transform gizmo（与 strand 控制点一致），不做视平面
    // 拖拽；增量在 objectChange 的 applyTipSubBoneTransform 里应用。
    // 0.2.126 起 panel 与发丝走同一条路径（selectTipSubBone 内部按 host 写段号）。
    selectTipSubBone(lock, gizmoTipIndex);
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
  const tipIndex = hit.object.userData.tipSegmentIndex != null ? hit.object.userData.tipSegmentIndex : null;
  const tipPoint = hit.object.userData.tipChainPoint != null ? hit.object.userData.tipChainPoint : null;
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
  if (tipIndex != null && tipPoint != null) {
    // Selecting a tip sub-bone: remember it and point the segment controls at it.
    selectTipSubBone(lock, tipIndex);
    // 起始世界位置取**物化**链（视口所画）：拖拽把它当基准反投影，读 authored.points 会
    // 让基准落在旧 rest 空间、一按下就跳（0.2.120 规则）。
    const tipHost = resolveTipHost(lock);
    const tip = tipHost?.tipChainFor(tipIndex);
    if (tip && tip.points[tipPoint]) tipStartWorld = new THREE.Vector3(tip.points[tipPoint].x, tip.points[tipPoint].y, tip.points[tipPoint].z);
  } else if (
    tipWidthSegment != null && tipWidthSide != null && tipWidthIndex != null
    // 门 2/2（Width Brush 模式互斥，要求 a）：笔刷激活时**真的禁止**直接拖绿色 WidthCurve
    // 控制点 —— 该走笔刷。另一道门在 taper-editor.js 的 beginTaperMeshPointDrag（紫色）。
    // 两处必须同时存在：只关一道，用户在笔刷模式下仍能从另一条路径拖到曲线。
    // 放在这个 else-if 的**条件**里而不是函数开头：其余把手（tip 链点、zipper、Tip Clump）
    // 在笔刷模式下仍应可拖，只有「宽度控制点」这一种被笔刷接管。
    && deps.sel.activeTool !== "sculpt-width"
  ) {
    // 发尖 WidthCurve 把手：起始状态按几何分派。两条分支产出**同一组** drag 字段
    // （tipWidthT / StartWorld / StartLatOffset / StartMult / StartClientX/Y /
    // StartEdgeScreenDist / Bones），因此 updatePanelSplitHandleDrag 的拖拽数学（世界
    // 横向比、0.5 灵敏度、floorMult、上限 2、默认对称 / Ctrl 单侧）一行都不变。
    let placement = null;
    let tipBone = null;
    let strandSplitsForWidth = null;
    // 同规则同步点：下方 updatePanelSplitHandleDrag 的 tipWidth 分支用同一条
    // segmentBoneHost 分派 —— 起始状态与移动写入必须落在同一侧，否则会用 panel 的
    // 起始倍率去写发丝曲线。
    if (segmentBoneHost(lock) !== STRAND_SEGMENT_HOST) {
      // Selecting a tip width control point also selects that tip sub-bone.
      selectTipSubBone(lock, tipWidthSegment);
      const tipSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      // 拖拽开始时只 materialize 一次（深克隆 + 双写 lock.splitBones/lock.bones），
      // 拖拽期间复用同一数组，避免每个 pointermove 都重复深克隆全部骨骼。
      tipWidthBones = materializeSplitBones(lock);
      tipBone = tipWidthBones[tipWidthSegment] || null;
      placement = deps.panelTipStrand.tipWidthControlPlacement(lock, tipWidthSegment, tipSplits, tipBone, tipWidthSide, tipWidthIndex);
      if (placement) {
        const boundaries = [-1, ...tipSplits.map((split) => split.position), 1];
        const edgeU = boundaries[tipWidthSide < 0 ? tipWidthSegment : tipWidthSegment + 1];
        const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
        tipWidthStartMult = deps.panelTipStrand.tipPanelWidthAt(lock, placement.t, edgeU, tipBone, tipWidthSegment, tipSplits) / fullWidth;
      }
    } else {
      // 0.2.126 起与 panel 同源：抓宽度控制点同样选中该管的发尖子骨骼（selectTipSubBone
      // 内部按 host 写 strandSegmentIndex 并刷新 #strandSegmentControls）。
      // 旧注释写「发丝没有 tipSelection 的等价物、改用 strandSegmentIndex」已作废 —— 那会让
      // 宽度把手在未选中任何发尖时也常显（strandSegmentIndex 恒非 null），与 panel 不一致。
      selectTipSubBone(lock, tipWidthSegment);
      strandSplitsForWidth = strandSplitsFor(lock);
      tipWidthBones = materializeStrandSplitBones(lock);
      tipBone = tipWidthBones?.[tipWidthSegment] || null;
      placement = strandTipWidthControlPlacement(
        strandTipWidthGeoDeps(),
        lock,
        strandSplitsForWidth,
        tipWidthSegment,
        tipBone,
        tipWidthSide,
        tipWidthIndex
      );
      if (placement) {
        // 起始倍率用**管内相对坐标**读：被拖那侧的极值点恒为 ±1（strandTubeSignedCoordinate
        // 的定义），所以直接传 side 的符号即可 —— 不得传 raw profile.x（边缘管单符号 →
        // 一侧永远读不到自己的曲线，0.2.80 死区同类）。panel 侧对应的是 edgeU。
        tipWidthStartMult = strandTipWidthMultiplierAt(
          lock,
          placement.t,
          tipWidthSide < 0 ? -1 : 1,
          tipBone,
          tipWidthSegment,
          strandSplitsForWidth
        );
      }
    }
    if (placement) {
      tipWidthT = placement.t;
      tipWidthStartWorld = placement.point.clone();
      // Stable drag basis: the edge's signed lateral distance and the current width
      // multiplier, so dragging scales width by a ratio (no feedback collapse).
      tipWidthStartLatOffset = placement.point.clone().sub(placement.center).dot(placement.lateral);
      tipWidthStartClientX = event.clientX;
      tipWidthStartClientY = event.clientY;
      const rect = deps.renderer.domElement.getBoundingClientRect();
      tipWidthStartEdgeScreenDist = Math.max(0.0001, deps.sculptGeom.viewportPixelPoint(placement.center, rect).distanceTo(deps.sculptGeom.viewportPixelPoint(placement.point, rect)));
    }
  }
  // 刻意不改（0.2.126）：原先此处有一个 strandSplitTipTube 分支（每管末点把手 → kind
  // "strandTip"）。它连同那个把手一起删除了 —— 发丝现在与 panel 共用 kind "tip"：同一个
  // tipSegmentIndex/tipChainPoint 命中、同一条视平面拖拽数学、同一条物化空间取值口径。
  deps.sculptState.panelSplitDrag = {
    pointerId: event.pointerId,
    lockId: lock.id,
    kind: tipWidthIndex != null ? "tipWidth" : tipIndex != null ? "tip"
      : hit.object.userData.strandSplitHandle
        ? "strand"
        : hit.object.userData.tipClumpSegment != null
          ? "segment"
          : "panel",
    splitIndex: tipWidthSegment != null ? tipWidthSegment : tipIndex != null ? tipIndex
      : hit.object.userData.strandSplitHandle
        ? hit.object.userData.strandSplitIndex
        : hit.object.userData.tipClumpSegment != null
          ? hit.object.userData.tipClumpSegment
          : hit.object.userData.panelSplitIndex,
    tipPoint,
    tipStartWorld,
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
  // 点击普通 zipper 手柄（kind==="panel"）时同时选中它；拖拽本身不删除。
  if (deps.sculptState.panelSplitDrag.kind === "panel" && hit.object.userData.panelSplitIndex != null) {
    const selectSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const selected = selectSplits[hit.object.userData.panelSplitIndex];
    if (selected) {
      deps.sculptState.panelSplitSelection = { lockId: lock.id, order: Number(selected.order) };
      // bug3（0.2.147）：拖拽身份也记 order，不再只靠 pointerdown 时的排序下标。跨越邻居后
      // 排序会变，下标会指向**别的** zipper；order 是稳定键，updatePanelSplitHandleDrag 每帧
      // 用它反查当前下标。**刻意不复用 panelSplitSelection**：选中态可被 Del/其它交互清空，
      // 而拖拽身份必须活到 pointerup。
      deps.sculptState.panelSplitDrag.panelSplitOrder = Number(selected.order);
    }
  }
  // 点击 strand zipper 手柄（kind==="strand"）时同时选中它，供 Del 删除。
  if (deps.sculptState.panelSplitDrag.kind === "strand" && hit.object.userData.strandSplitIndex != null) {
    const selectSplits = deps.cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight);
    const selected = selectSplits[hit.object.userData.strandSplitIndex];
    if (selected) {
      deps.sculptState.strandSplitSelection = { lockId: lock.id, order: Number(selected.order) };
      // bug3（0.2.147）：与 panel 的 panelSplitOrder 同规则，拖拽身份记 order 而非排序下标。
      deps.sculptState.panelSplitDrag.strandSplitOrder = Number(selected.order);
    }
  }
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
    // 写回 strandSplits[index]（N 拉链）；随后 syncStrandSplitLegacyFields 把 splits[0]
    // 回写 legacy 标量（N=1 与旧行为一致）。
    // bug3（0.2.147）：与 panel 分支**同一处修复**（详见本文件下方 panel 分支的长注释）。
    // 发丝拉链此前有一份逐字同构的邻居间距钳位（minimumSeparation = 0.12 + 紧邻两侧），
    // 症状与 panel 完全一样：拉链之间互相挡路，跨不过去。cloneStrandSplits 走
    // normalizeStrandSplits，同样「按 position 升序 + order 唯一」，故同一套 order 反查
    // 直接适用；strandSplitBones 也同样是 index-keyed、在跨越点同样连续，故同样不做 remap。
    // 边界仍是 ±0.8（normalizeStrandSplits 对 position 的钳制区间），不是 panel 的 ±0.88。
    const splits = deps.cloneStrandSplits(lock.strandSplits, lock.strandSplitPosition, lock.strandSplitHeight);
    const strandDragOrder = Number(deps.sculptState.panelSplitDrag.strandSplitOrder);
    const index = Number.isFinite(strandDragOrder)
      ? splits.findIndex((split) => Number(split.order) === strandDragOrder)
      : deps.sculptState.panelSplitDrag.splitIndex;
    if (!(index >= 0) || !splits[index]) return;
    splits[index].position = THREE.MathUtils.clamp(best.position, -0.8, 0.8);
    splits[index].height = THREE.MathUtils.clamp(best.height, 0.02, 0.8);
    // 与 panel 分支同规则：改完值必须重新排序再写回，否则这一帧的几何/把手看到乱序数组。
    splits.sort((a, b) => a.position - b.position);
    lock.strandSplits = splits;
    deps.syncStrandSplitLegacyFields(lock);
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    event.preventDefault();
    return;
  }
  if (deps.sculptState.panelSplitDrag.kind === "tip") {
    // View-plane move of the segment's / tube's tip sub-bone control point: the pointer's
    // NDC position at the tip's depth becomes the new tip point (length + direction).
    // 0.2.126 起 panel 段与发丝管走这**一条**分支（此前发丝另有一条 kind "strandTip"，
    // 逐行重复了同样的 NDC 映射与写回，只是骨骼/链取值函数不同）。
    const startWorld = deps.sculptState.panelSplitDrag.tipStartWorld;
    if (!startWorld) return;
    const startProj = startWorld.clone().project(deps.camera);
    const ndcX = (2 * targetX) / rect.width - 1;
    const ndcY = -((2 * targetY) / rect.height - 1);
    const newWorld = new THREE.Vector3(ndcX, ndcY, startProj.z).unproject(deps.camera);
    const segment = deps.sculptState.panelSplitDrag.splitIndex;
    const point = deps.sculptState.panelSplitDrag.tipPoint;
    const host = resolveTipHost(lock, { materialize: true });
    const bone = host?.bones?.[segment];
    if (!bone) return;
    const tip = host.tipChainFor(segment);
    if (!tip || !Array.isArray(tip.restPoints) || point == null || point >= tip.restPoints.length) return;
    // 物化链的 points 是视口所画的位置、restPoints 是同一次物化的 rest 基准；被拖点写
    // 「新世界位置」，其余点保留物化位置（= 保留各自 delta），最后两者成对写回。
    const next = tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    next[point] = { x: newWorld.x, y: newWorld.y, z: newWorld.z };
    writeTipEdit(bone, next, tip.restPoints);
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
    // 读（边缘位置）与写（曲线）按几何分派，其余数学逐字共用。
    // 分派点用 segmentBoneHost（bone-model 的单一分派：panel/surface → panel 段，
    // strand + strandSplitEnabled → 管段），不写 `!isPanelGeometry` —— 后者把「既非
    // panel 也非分裂发丝」的 lock 也算成发丝。
    const strandWidth = segmentBoneHost(lock) === STRAND_SEGMENT_HOST;
    const splitsForWidth = strandWidth
      ? strandSplitsFor(lock)
      : deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    // 复用拖拽开始时 materialize 的骨骼数组（它就是 lock.splitBones / lock.strandSplitBones，
    // 编辑持续生效）；缺失或数量不对时回退重新 materialize，避免每个 pointermove 都深克隆
    // 全部骨骼。两种几何的段数都是「拉链数 + 1」，故长度判据一致。
    const materializeBones = () => (strandWidth ? materializeStrandSplitBones(lock) : materializeSplitBones(lock));
    const bones = Array.isArray(drag.tipWidthBones) && drag.tipWidthBones.length === splitsForWidth.length + 1
      ? drag.tipWidthBones
      : materializeBones();
    const bone = bones?.[segment];
    if (!bone) return;
    let edge = null;
    if (strandWidth) {
      edge = strandTipWidthEdgePosition(strandTipWidthGeoDeps(), lock, splitsForWidth, segment, bone, side, t);
    } else {
      const tip = deps.panelTipStrand.splitTipForSegment(lock, segment, splitsForWidth, bone);
      if (!tip || tip.points.length < 2) return;
      edge = deps.panelTipStrand.tipWidthEdgePosition(lock, segment, splitsForWidth, bone, side, t);
    }
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
    // 写入函数按几何分派；两者都建立在共享的 setTipWidthCurveValueFrom /
    // buildTipWidthCurveFrom 之上（发丝版在 strand-tip-width.js），所以吸附规则、
    // asymmetric 打开时机、「无处可写就跳过」的语义只有一份。
    const writeWidth = (writeSide) => (strandWidth
      ? setStrandTipWidthCurveValue(lock, splitsForWidth, segment, bone, writeSide, t, newWidthMult)
      : deps.panelTipStrand.setTipWidthCurveValue(lock, segment, splitsForWidth, bone, writeSide, t, newWidthMult));
    if (event.ctrlKey) {
      // 按住 Ctrl = 非对称：只调被拖的一侧。
      writeWidth(side);
    } else {
      // 默认 = 对称：两侧同一 t 设为同一个 multiplier（真正对称，不按起始比例）。
      writeWidth(side);
      writeWidth(-side);
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
    // 右侧属性面板预览同步：该 lock 是当前选中/面板尖端选中时热更新。按几何分派到
    // 对应的段控件（发丝那组是 Phase C 的 #strandSegmentControls）。
    if (deps.sculptState.tipSelection?.lockId === lock.id || deps.getSelectedLock()?.id === lock.id) {
      if (strandWidth) deps.syncStrandSegmentControls(lock);
      else deps.syncPanelSegmentControls(lock);
    }
    event.preventDefault();
    return;
  }
  // ── 绿色 Tip Clump 手柄拖拽（kind === "segment"，UI 名 Tip Clump）─────────────────────
  // 0.2.130 起 panel 与 split strand **共用这一个 kind**：命中字段（tipClumpSegment）、
  // drag 记录（kind/splitIndex）、结束路径完全相同，只有「屏幕位置 → spread」的求解按几何
  // 分派。刻意不新增 kind "strandSegment"：那会让 begin/end/可见性/高亮四处各长一条平行分支。
  if (deps.sculptState.panelSplitDrag.kind === "segment") {
    const segment = deps.sculptState.panelSplitDrag.splitIndex;
    const strandClump = segmentBoneHost(lock) === STRAND_SEGMENT_HOST;
    // 屏幕最近点求解：两条分支都是「沿一条参数线取 49 个探针、投影到屏幕、取最近」，
    // 只有探针的世界位置来源不同（panel = 段顶边的 u 采样；发丝 = 共享的 Tip Clump 线段）。
    let clumpBest = null;
    const considerProbe = (worldPoint, tipClump) => {
      const projected = worldPoint.clone().project(deps.camera);
      if (projected.z < -1 || projected.z > 1) return;
      const x = (projected.x * 0.5 + 0.5) * rect.width;
      const y = (-projected.y * 0.5 + 0.5) * rect.height;
      const distanceSq = (x - targetX) ** 2 + (y - targetY) ** 2;
      if (!clumpBest || distanceSq < clumpBest.distanceSq) clumpBest = { distanceSq, tipClump };
    };
    if (strandClump) {
      // 发丝：探针位置来自 strandTipClumpAxis（**与绘制手柄同一条线段**，见该函数的说明），
      // 所以指针落点与球心一致，不像 panel 那样有 tangentOffset 造成的固定偏差。
      const strandSplits = strandSplitsFor(lock);
      const axisBones = materializeStrandSplitBones(lock);
      if (!axisBones || segment < 0 || segment >= axisBones.length) {
        endPanelSplitHandleDrag(event);
        return;
      }
      const axis = strandTipClumpAxis(strandTipWidthGeoDeps(), lock, strandSplits, segment, axisBones[segment] || null);
      if (!axis) return;
      for (let step = 0; step <= 48; step += 1) {
        const tipClump = THREE.MathUtils.lerp(0, SPREAD_MAX, step / 48);
        considerProbe(axis.pointAt(tipClump), tipClump);
      }
      if (!clumpBest) return;
      const bone = axisBones[segment];
      if (bone) bone.tipClump = THREE.MathUtils.clamp(clumpBest.tipClump, 0, SPREAD_MAX);
    } else {
      // panel：**逐字保留**既有的段顶边 u 扫描（探针 = panelSplitControlPoint(u, height 0, t 1)）
      // 与 u → tipClump 的线性反演。刻意不改成走绘制用的 tipSurfaceFrameAt：那会同时改变
      // panel 已验收的拖拽手感（扫描基线不含 tangentOffset 是既有取舍）。
      const segmentSplits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      const segBoundaries = [-1, ...segmentSplits.map((split) => split.position), 1];
      if (segment < 0 || segment >= segBoundaries.length - 1) {
        endPanelSplitHandleDrag(event);
        return;
      }
      const span = Math.max(0.0001, segBoundaries[segment + 1] - segBoundaries[segment]);
      for (let uStep = 0; uStep <= 48; uStep += 1) {
        const u = THREE.MathUtils.lerp(segBoundaries[segment], segBoundaries[segment + 1], uStep / 48);
        considerProbe(
          deps.panelSplitControlPoint(lock, { position: u, height: 0 }, 1, curve, segment),
          ((u - segBoundaries[segment]) / span) * SPREAD_MAX
        );
      }
      if (!clumpBest) return;
      const bones = materializeSplitBones(lock);
      const bone = bones[segment];
      if (bone) bone.tipClump = THREE.MathUtils.clamp(clumpBest.tipClump, 0, SPREAD_MAX);
    }
    deps.updateLockGeometry(lock, { immediate: true });
    // updateCurveObjects（不是 rebuildCurveObjects）：拖拽中手柄数量不变，重建会销毁正在被
    // 拖的那个球、当场中断拖拽。applyStrandSegmentSpread（滑杆路径）用 rebuild 是因为它不在
    // 拖拽中，两处差异是有意的。
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    // 右侧属性面板热同步：该 lock 是当前选中/发尖选中时刷新对应几何的那组段控件
    // （与上方 tipWidth 分支同规则的按几何分派）。
    if (deps.sculptState.tipSelection?.lockId === lock.id || deps.getSelectedLock()?.id === lock.id) {
      if (strandClump) deps.syncStrandSegmentControls(lock);
      else deps.syncPanelSegmentControls(lock);
    }
    event.preventDefault();
    return;
  }
  // ── bug3（0.2.147）：zipper 拖拽身份按 order 匹配，允许跨越邻居 ────────────────────────
  // 此前这里在扫描之后才取 splitIndex（pointerdown 时的**排序下标**），并把位置硬钳在
  // 「紧邻两侧 ± minimumSeparation」之间 —— 那道钳位正是「zipper 无法跨 zipper 移动」的
  // 直接原因（用户报告：必须先选中前一个 zipper 才能新增）。
  // 改法：先用 order（0.2.115 起每个 zipper 都带的稳定创建序号，clonePanelSplits 会保留并
  // 保证唯一）在**当前排序结果**里反查下标，再扫描。于是排序一变，下标随之更新，被拖的始终
  // 是同一个 zipper。钳位只剩画布边界。
  //
  // minimumSeparation 已整条删除，不再在拖拽路径使用。理由：它唯一的作用就是「别碰到邻居」，
  // 而这正是本 bug；退化（零宽段）风险本就由别处兜住 —— `+` 按钮有 MINIMUM_PANEL_SEGMENT_SPAN
  // 守卫（segment-control.js:392,395）不会**创建**退化段；拖拽扫描的 u 量化步长是 1.76/48
  // ≈ 0.0367，只有两个 zipper 落到同一格才会完全重合；段拖拽分支的 span 有
  // `Math.max(0.0001, …)`（本文件 :644）兜底。零宽段是瞬时、可逆、不崩的，用户拖开即恢复。
  //
  // splitBones **刻意不做任何 remap**（这是本次最关键的判断，探针实证见
  // tests/split-tip-geometry.test.mjs 的 bug3 用例）：splitBones[k] 按「排序后段 k」索引，
  // 而段 k = 边界 k..k+1。设被拖的 A 越过右邻 N：跨越前段为 …[s,A][A,N][N,s']…，跨越后为
  // …[s,N][N,A][A,s']…。在 A == N 的**跨越瞬间**两侧逐段完全相等（[s,A]=[s,N]、中间段零宽、
  // [A,s']=[N,s']）⇒ index-keyed 映射本身就是连续的，taperCurve/depthCurve 不会错配。
  // 会变的只是「该段右边界属于哪个 zipper 对象」（rightOrder），而 zipper 球体彼此无外观差异，
  // 用户不可见。一次帧内跨 N 个邻居 = N 次单跨越的复合，同样连续（探针实测 3 连跨 taper 表不变）。
  // 若在此处补 remap（例如交换相邻两段 bones），反而会把段姿态从**连续**变成跳变。
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight, Math.max(0, Number(lock.panelWidthLoops ?? 6) - 1));
  const dragOrder = Number(deps.sculptState.panelSplitDrag.panelSplitOrder);
  // order 缺失（旧 drag 状态/非 panel 入口）时回退到 pointerdown 时的下标，行为与修复前一致。
  const index = Number.isFinite(dragOrder)
    ? splits.findIndex((split) => Number(split.order) === dragOrder)
    : deps.sculptState.panelSplitDrag.splitIndex;
  if (!(index >= 0) || !splits[index]) return;
  for (let tStep = 0; tStep <= 42; tStep += 1) {
    const t = THREE.MathUtils.lerp(0.22, 1, tStep / 42);
    for (let uStep = 0; uStep <= 48; uStep += 1) {
      const u = THREE.MathUtils.lerp(-0.88, 0.88, uStep / 48);
      const projected = deps.panelSplitControlPoint(
        lock,
        { position: u, height: 1 - t },
        t,
        curve,
        index
      ).project(deps.camera);
      if (projected.z < -1 || projected.z > 1) continue;
      const x = (projected.x * 0.5 + 0.5) * rect.width;
      const y = (-projected.y * 0.5 + 0.5) * rect.height;
      const distanceSq = (x - targetX) ** 2 + (y - targetY) ** 2;
      if (!best || distanceSq < best.distanceSq) best = { distanceSq, position: u, height: 1 - t };
    }
  }
  if (!best) return;
  // 只钳画布边界（见上方 bug3 说明：邻居间距钳位已删除）。
  splits[index].position = THREE.MathUtils.clamp(best.position, -0.88, 0.88);
  let nextHeight = best.height < 0.018 ? 0 : THREE.MathUtils.clamp(best.height, 0, 0.78);
  if (lock.panelSplitSnapToLoops !== false) {
    nextHeight = deps.snapPanelSplitHeight(nextHeight, lock.panelLengthLoops);
  }
  splits[index].height = nextHeight;
  // **必须重新排序后再写回**：跨越后 splits 已不是位置升序，而 lock.panelSplits「始终按
  // position 升序」是全仓库的既有不变量（clonePanelSplits/normalizePanelSplits 都以排序结尾，
  // 几何的段边界、bone-view-handles 的把手下标、segment-control 的 +/- remap 全按它推导）。
  // 下一帧的 clonePanelSplits 固然会排，但本函数紧接着就同步调用 updateLockGeometry /
  // updateCurveObjects —— 若不在此处排序，这一帧的几何与把手会看到乱序数组。
  // 排序在赋值 position/height **之后**：先改值再排，被拖对象的新位置才参与排序。
  splits.sort((a, b) => a.position - b.position);
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

// ── Width Brush 的写入适配层 ───────────────────────────────────────────────────────────
// 两个写入函数的**参数顺序不一致**（历史遗留，两侧各自与自己的几何模块同构）：
//   panel  : setTipWidthCurveValue(lock, segmentIndex, splits, bone, side, t, value)
//   发丝   : setStrandTipWidthCurveValue(lock, splits, tubeIndex, bone, side, t, value)
//                                              ^^^^^^^^^^^^^^^^^^ splits 与索引对调
// 笔刷不该知道这件事，所以在这里收一次口。按 resolveTipHost 的 kind 分派（**不是**
// isPanelGeometry —— 见 AGENT_QUICKSTART §2.4b 的定论）。
//
// 返回值语义：**原样透传** setTipWidthCurveValueFrom 的 null（低于本侧 fork 的锁定区、或本
// 侧暴露子集为空 ⇒ 无处可写）。调用方据此保持「无处可写就跳过」，而不是把 undefined 当成
// 写入成功后去重建几何。
function writeTipWidthValueForHost({ lock, host, segmentIndex, side, t, value }) {
  if (!lock || !host) return null;
  const bone = host.bones?.[segmentIndex];
  if (!bone) return null;
  if (host.kind === "strand") {
    return setStrandTipWidthCurveValue(lock, host.splits, segmentIndex, bone, side, t, value);
  }
  return deps.panelTipStrand.setTipWidthCurveValue(lock, segmentIndex, host.splits, bone, side, t, value);
}

// 读回某侧在 t 处**当前**的宽度倍率（笔刷的相对增量需要它当基数）。
// 坐标空间（standards 第三类注释）：第三个入参是「本侧的横向坐标」，两侧含义不同 ——
// panel 传 edgeU（段边界的 u），发丝传**管内相对坐标**的符号（被拖侧极值恒为 ±1，见
// strandTubeSignedCoordinate）。**不得给发丝传 raw profile.x**：裁剪后边缘管只有单一符号，
// 一侧会永远读不到自己的曲线（0.2.80 死区同类）。
function readTipWidthMultiplierForHost({ lock, host, segmentIndex, side, t }) {
  if (!lock || !host) return 1;
  const bone = host.bones?.[segmentIndex];
  if (host.kind === "strand") {
    return strandTipWidthMultiplierAt(lock, t, side < 0 ? -1 : 1, bone, segmentIndex, host.splits);
  }
  // panel：tipPanelWidthAt 返回**绝对宽度**，除以 lock.width 才是倍率（与
  // beginPanelSplitHandleDrag 的 tipWidthStartMult 逐字同式，勿改成别的基准）。
  const boundaries = [-1, ...(Array.isArray(host.splits) ? host.splits : []).map((split) => split.position), 1];
  const edgeU = boundaries[side < 0 ? segmentIndex : segmentIndex + 1];
  const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
  return deps.panelTipStrand.tipPanelWidthAt(lock, t, edgeU, bone, segmentIndex, host.splits) / fullWidth;
}

// 枚举本段**两侧全部已暴露**的宽度控制点，并投影到屏幕像素。
// ★ 方案 C 的核心：候选点一律来自 tipWidthControlPlacement —— 与绿色手柄**同一个函数**。
// 因此笔刷刷得到的位置集合 ≡ 手柄抓得到的位置集合（按构造，不是靠守卫），且**没有任何**
// chain-t → 曲线 position 的换算参与（无 getUtoTmapping、无 panelTipCurveParameter）。
// 未暴露的网格位置由 placement 自己返回 null（浅 zipper 侧只暴露靠发尖的几个），在这里被
// 跳过 —— 越界与锁定区因此都不需要额外守卫。
// pointIndex 索引**完整共享网格**（TIP_WIDTH_CONTROL_POINTS + 1），与 bone-view-handles.js
// 的把手分配逐个对应；勿改成索引过滤后的子集（同一 index 的含义会随 zipper 高度漂移）。
function tipWidthBrushCandidates(lock, host, segmentIndex, rect) {
  const bone = host.bones?.[segmentIndex] || null;
  const candidates = [];
  [-1, 1].forEach((side) => {
    for (let pointIndex = 0; pointIndex < TIP_WIDTH_CONTROL_POINTS + 1; pointIndex += 1) {
      const placement = host.kind === "strand"
        ? strandTipWidthControlPlacement(
          strandTipWidthGeoDeps(), lock, host.splits, segmentIndex, bone, side, pointIndex
        )
        : deps.panelTipStrand.tipWidthControlPlacement(
          lock, segmentIndex, host.splits, bone, side, pointIndex
        );
      if (!placement?.point) continue;
      const pixel = deps.sculptGeom.viewportPixelPoint(placement.point, rect);
      candidates.push({ x: pixel.x, y: pixel.y, side, pointIndex, t: placement.t });
    }
  });
  return candidates;
}

function applySubBoneBrushSample(stroke, clientX, clientY, deltaX, deltaY) {
  // When a split tip sub-bone is selected, the brush edits ONLY that sub-bone's chain
  // points (masked by screen distance) - never other sub-bones or the main chain.
  // The brush is consumed even when no chain point is under the cursor, so a selected
  // sub-bone blocks main-bone edits until it is deselected. Scale/orient center on the
  // sub-bone's exposed root (first below-fork chain point).
  const selection = deps.sculptState.tipSelection;
  if (!selection) return false;
  const lock = deps.locks.find((item) => item.id === selection.lockId);
  // 门控从「panel only」扩为「任何有段发尖子骨骼的几何」（0.2.126）：判据一律走
  // resolveTipHost（内部 segmentBoneHost），**绝不**在这里对发丝调 clonePanelSplits ——
  // 它会凭空造出与真实 zipper 无关的假 panelSplits，段数/fork 全错（本轮两次踩过）。
  // 发丝的段划分只能来自 strandSplitsFor（resolveTipHost 已代为处理）。
  const host = lock ? resolveTipHost(lock, { materialize: true }) : null;
  if (!host) return false;
  const segmentIndex = selection.segmentIndex;
  if (segmentIndex == null || segmentIndex < 0 || segmentIndex >= host.segmentCount) return true;
  if (!stroke.undoCaptured) { deps.pushUndoState(); stroke.undoCaptured = true; }
  const bone = host.bones[segmentIndex];
  if (!bone) return true;
  const tip = host.tipChainFor(segmentIndex);
  if (!tip || !Array.isArray(tip.restPoints) || tip.restPoints.length < 2) return true;
  const rest = tip.restPoints;
  const authored = (Array.isArray(bone.tip?.points) && bone.tip.points.length === rest.length)
    ? bone.tip
    : {
      points: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      restPoints: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      active: true
    };
  // Seed from the MATERIALIZED chain (what the viewport draws), not authored.points.
  // materializeTipChain renders points[i] = rest[i] + (authored.points[i] - authored.restPoints[i]),
  // so authored.points is stale whenever the rest chain moved after the last edit (zipper
  // add/remove inherits the SOURCE segment's rest baseline, main-chain / zipper height /
  // spread / panel width edits all reshape rest too). Seeding authored.points and then
  // re-baselining restPoints to the new rest below would drop that inherited delta and
  // snap the tip back to its pre-change position. tip.points is in the same space as
  // `rest`, so the write-back at the end of this function is self-consistent.
  const displayed = (Array.isArray(tip.points) && tip.points.length === rest.length)
    ? tip.points
    : authored.points;
  const current = displayed.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  const points = current.map((p) => p.clone());
  // Twists are absolute (no rest baseline); take the materialized array because it is
  // always rest.length long and already normalized from the authored values.
  const currentTwists = (Array.isArray(tip.twists) && tip.twists.length === rest.length)
    ? tip.twists
    : authored.twists;
  const rect = deps.renderer.domElement.getBoundingClientRect();
  const cursor = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
  const radius = Number(deps.sculptBrushRadiusInput.value);
  const falloff = Number(deps.sculptBrushFalloffInput.value);
  const strength = Number(deps.sculptBrushStrengthByTool[deps.effectiveSculptBrushTool()] ?? deps.sculptBrushStrengthInput.value);
  const reverse = Boolean(stroke.reverse);
  const tool = deps.effectiveSculptBrushTool();
  // Shift 临时平滑的自由度分派（用户拍板的加法特化，同步点：app.js 的
  // sculptBrushShiftSmoothFreedomByTool 定义处与 sculpt-geometry.js 的同名变量）。只有
  // 「Shift 临时切到 smooth」且「底层选中的是登记过的特化笔刷」时才非 undefined。用户主动
  // 选中 sculpt-smooth 作为工具时 deps.sel.activeTool 恒为 "sculpt-smooth"，从未登记在表里，
  // 查表恒 undefined ⇒ 下面 `tool === "sculpt-smooth" && shiftSmoothFreedom === ...` 三个特化
  // 分支全部不命中，落回原有的纯位置平滑分支（一个字节不变，加法约束）。
  const shiftSmoothFreedom = deps.sculptState.sculptBrushShiftSmoothHeld
    ? deps.sculptBrushShiftSmoothFreedomByTool[deps.sel.activeTool]
    : undefined;
  // fork 与暴露区间都按几何分派后走**唯一定义点** firstExposedTipChainIndex：笔刷能动的
  // 区间必须与视口有把手的区间逐点相同（否则用户会看到"能刷动但抓不到"或反之）。
  const forkT = host.forkTFor(segmentIndex);
  const firstBelow = firstExposedTipChainIndex(forkT, rest.length);
  const scaleCenter = current[firstBelow] || current[0];
  // ── Width Brush（sculpt-width）：刷发尖 WidthCurve 的**既有**控制点 ────────────────────
  // 位置**必须**在下方 `if (changed)` 之前 return：那一段写 authored.points / restPoints，而
  // 宽度笔刷根本不动链点（它只改曲线数据）。落到那里会把「没被编辑的链」原样重写一遍，把
  // 物化 delta 烘进 authored（0.2.120 规则的反面），发尖会跳。
  // 方案 C：候选点来自与绿色手柄同一个 placement，按**屏幕距离**取最近的一个 —— 与笔刷的
  // 圆形选区语义一致，也是「笔刷与手柄按构造一致」的落点。
  if (tool === "sculpt-width") {
    const candidates = tipWidthBrushCandidates(lock, host, segmentIndex, rect);
    // 半径当选区：光标离所有已暴露控制点都超过一个笔刷半径时什么都不做（但仍 return true
    // ——「选中了发尖子骨骼就独占笔刷」的既有语义不变，见本函数开头的注释）。
    const nearest = nearestScreenCandidate(candidates, cursor.x, cursor.y, radius);
    if (!nearest) return true;
    const target = nearest.candidate;
    // 权重按**屏幕距离**衰减，用的是其它笔刷同一个 falloff 内核 sculptBrushWeight ——
    // 这里直接调它而不是 sculptGeom.sculptBrushPointWeight，因为后者的职责是「世界点 →
    // 投影 → 距离 → 权重」，而 tipWidthBrushCandidates 已经投影过了（placement 的 point
    // 经 viewportPixelPoint），再投一次等于把同一条投影写两遍。
    const weight = sculptBrushWeight(nearest.distance, radius, falloff);
    if (!(weight > 0)) return true;
    // ── 双侧等比缩放（回归修复）──────────────────────────────────────────────────────
    // 同步点：手动拖拽绿色手柄默认就是双侧写，见本文件 ~L606-609 的
    // writeWidth(side) + writeWidth(-side)。笔刷这里此前只对 target.side 一侧
    // 读写，没跟上那个既有约定，刷发尖时会变成只有一侧动的非对称编辑。
    // 为什么是「等比缩放」而不是「设成同一绝对值」：手动拖拽把两侧设为同一个绝对
    // multiplier（会抹平已有的非对称形状），笔刷不能照抄——sculptWidthBrushMultiplier
    // 算出的 amount 只依赖笔刷输入（strokeDistance/weight/strength/reverse），与
    // currentMultiplier 无关，返回的是 current × (1 + amount) 这个相对增量。对两侧
    // 各自的 current 套用同一个 amount，天然就是等比缩放：保留已有的非对称形状，只把
    // 整体宽度同步缩放——这正是用户要的效果（紫色 panel/发丝路径
    // applyWidthCurveBrushSample 早就是这个语义，这里只是把发尖分支补齐）。
    // 为什么同一个 t 能直接用于对侧：发尖曲线是固定网格共享索引
    // （TIP_WIDTH_CONTROL_POINTS，见 tip-width-curve.js:30），网格由两侧共用的最深
    // zipper 高度算出 ⇒ 同一个 pointIndex 在两侧对应同一个 t，tipWidthBrushCandidates
    // 报告的 target.t 可以原样喂给 -target.side，不需要任何换算。
    const strokeDistance = Math.hypot(deltaX, deltaY);
    let written = null;
    [target.side, -target.side].forEach((side) => {
      const currentMultiplier = readTipWidthMultiplierForHost({
        lock, host, segmentIndex, side, t: target.t
      });
      // 钳位逐侧独立：sculptWidthBrushMultiplier 内部把结果钳到
      // [TIP_WIDTH_VALUE_MIN, TIP_WIDTH_VALUE_MAX]（width-brush.js 内的常量）。两侧各自
      // 调用 ⇒ 一侧撞界饱和时另一侧不受影响继续变化，这正是等比缩放该有的样子，
      // 刻意不加「一侧撞界就锁住另一侧」的跨侧联动。
      const nextMultiplier = sculptWidthBrushMultiplier(
        currentMultiplier,
        strokeDistance,
        weight,
        strength,
        { reverse }
      );
      // 写入位置 = placement 自己报告的 t（**原样**，无换算）。吸附由
      // setTipWidthCurveValueFrom 完成，且它吸附的目标集合与 placement 的暴露判据是同一个
      // 定义点（tipWidthSideExposesTAt）⇒ 点数前后不变、不会新增关键点。
      const sideWritten = writeTipWidthValueForHost({
        lock, host, segmentIndex, side, t: target.t, value: nextMultiplier
      });
      // null = 该侧无处可写（锁定区 / 暴露子集为空）：只跳过这一侧，不影响另一侧。
      // 只要有一侧写成功就记下来（不用 sideWritten 覆盖已记录的成功结果）。
      if (sideWritten !== null) written = sideWritten;
    });
    // 两侧都 null 才整体跳过、不重建几何；任一侧非 null 就要重建（只重建一次）。
    if (written === null) return true;
    stroke.editedLockIds.add(lock.id);
    deps.updateLockGeometry(lock, { immediate: true });
    deps.updateCurveObjects(lock, { visible: true });
    deps.syncActiveMirror(lock, { deferGeometry: false });
    deps.updateTopologyStats();
    return true;
  }
  const computeCursorWeights = () => {
    const computed = new Array(current.length).fill(0);
    for (let index = firstBelow; index < current.length; index += 1) {
      computed[index] = deps.sculptGeom.sculptBrushPointWeight(current[index], cursor, rect, radius, falloff);
    }
    return computed;
  };
  // Twist alone freezes its affected point set at mousedown (see
  // resolveFrozenTwistStrokeWeights); every other tool keeps its live per-sample weights.
  const weights = tool === "sculpt-twist"
    ? resolveFrozenTwistStrokeWeights(
      stroke,
      `${lock.id}:${segmentIndex}`,
      current.length,
      computeCursorWeights
    )
    : computeCursorWeights();
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
      const twist = Array.isArray(currentTwists) ? Number(currentTwists[index]) || 0 : 0;
      const up = deps.guidedNormalAt(lock, point, tangent, t)
        .applyAxisAngle(tangent, twist)
        .normalize();
      const dragWorld = deps.sculptGeom.sculptBrushWorldDelta(current[index], deltaX, deltaY, rect);
      const amount = (reverse ? -1 : 1) * weights[index] * strength * dragWorld.dot(up);
      points[index].addScaledVector(up, amount);
      changed = true;
    }
  } else if (tool === "sculpt-smooth" && shiftSmoothFreedom === "twist") {
    // Shift 临时平滑 + 底层选中 twist/orient：只平滑发尖 twist 标量，链点不动（用户拍板
    // 决定 2）。currentTwists 是本函数已有的局部变量（见函数头 :900），写回 authored.twists
    // 的方式照抄下方 sculpt-twist/sculpt-orient 分支的既有写法。
    const twistArr = (Array.isArray(currentTwists) && currentTwists.length === current.length)
      ? currentTwists.map((v) => Number(v) || 0)
      : current.map(() => 0);
    const smoothTwistDeltas = smoothSculptTwistDeltas(twistArr, weights, strength);
    smoothTwistDeltas.forEach((delta, index) => {
      if (!delta) return;
      twistArr[index] += delta;
      changed = true;
    });
    if (changed) authored.twists = twistArr.map((v) => Number(v) || 0);
  } else if (tool === "sculpt-smooth" && shiftSmoothFreedom === "width") {
    // Shift 临时平滑 + 底层选中 sculpt-width：只平滑绿色 WidthCurve 的 value 序列，链点与
    // twist 都不动（用户拍板决定 1 的姊妹条款）。必须双侧（[1, -1]）——与 bug 1 的双侧宽度
    // 修复同一约定（本文件 :951 `[target.side, -target.side].forEach`），否则会重新引入
    // "刷一侧、另一侧不动" 的非对称回归。候选点/权重取法与 sculpt-width 分支
    // （tool === "sculpt-width"，:921 附近）完全一致：候选点来自 tipWidthBrushCandidates
    // （与绿色手柄同一个 placement），权重按屏幕距离过 sculptBrushWeight——WidthCurve 的
    // 关键点是共享网格 pointIndex，不是链点，不能复用逐链点的 weights 数组（同步点：
    // sculpt-geometry.js 的 widthCurveKeypointWeights 同一条理由）。
    const candidates = tipWidthBrushCandidates(lock, host, segmentIndex, rect);
    [1, -1].forEach((side) => {
      const sideCandidates = candidates.filter((candidate) => candidate.side === side);
      if (!sideCandidates.length) return;
      const keypointWeights = sideCandidates.map((candidate) => {
        const distance = Math.hypot(candidate.x - cursor.x, candidate.y - cursor.y);
        return sculptBrushWeight(distance, radius, falloff);
      });
      const currentValues = sideCandidates.map((candidate) => readTipWidthMultiplierForHost({
        lock, host, segmentIndex, side, t: candidate.t
      }));
      const widthDeltas = smoothLinearScalarDeltas(currentValues, keypointWeights, strength);
      widthDeltas.forEach((delta, index) => {
        if (!delta) return;
        writeTipWidthValueForHost({
          lock, host, segmentIndex, side, t: sideCandidates[index].t, value: currentValues[index] + delta
        });
        changed = true;
      });
    });
    if (changed) {
      deps.updateLockGeometry(lock, { immediate: true });
      deps.updateCurveObjects(lock, { visible: true });
      deps.syncActiveMirror(lock, { deferGeometry: false });
      deps.updateTopologyStats();
      stroke.editedLockIds.add(lock.id);
      return true;
    }
  } else if (tool === "sculpt-smooth" && shiftSmoothFreedom === "axis") {
    // Shift 临时平滑 + 底层选中 push/slide：位置平滑的 delta 投影到该笔刷自己的方向轴上，
    // 只施加投影分量（用户拍板决定 1）。axis 取法照抄下方 sculpt-slide/sculpt-push 分支的
    // 现成算法（:1023-1051），不重新实现 guidedNormalAt 的调用方式。
    const curve = new THREE.CatmullRomCurve3(current);
    const smoothDeltas = smoothSculptPointDeltas(points, weights, strength, 0.04);
    for (let index = firstBelow; index < current.length; index += 1) {
      const d = smoothDeltas[index];
      if (d.x === 0 && d.y === 0 && d.z === 0) continue;
      const t = index / Math.max(1, current.length - 1);
      const tangent = curve.getTangent(t).normalize();
      let axis;
      if (deps.sel.activeTool === "sculpt-slide") {
        axis = tangent;
      } else {
        // sculpt-push：与下方 sculpt-push 分支（:1044-1046）同一条公式取 up 轴。
        const point = curve.getPoint(t);
        const twist = Array.isArray(currentTwists) ? Number(currentTwists[index]) || 0 : 0;
        axis = deps.guidedNormalAt(lock, point, tangent, t).applyAxisAngle(tangent, twist).normalize();
      }
      const deltaVec = new THREE.Vector3(d.x, d.y, d.z);
      const projected = axis.clone().multiplyScalar(deltaVec.dot(axis));
      if (projected.x === 0 && projected.y === 0 && projected.z === 0) continue;
      points[index].addScaledVector(axis, deltaVec.dot(axis));
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
    const twistArr = (Array.isArray(currentTwists) && currentTwists.length === current.length)
      ? currentTwists.map((v) => Number(v) || 0)
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
  } else if (tool === "sculpt-twist") {
    // Manual axial roll of the tip section around its chain tangent, driven by the drag
    // alone (NO camera term — that is the difference from sculpt-orient above). Like
    // orient, only the section orientation changes; the chain (bone position) does NOT move,
    // so `points` is left untouched and only the twist scalars are written.
    const twistArr = (Array.isArray(currentTwists) && currentTwists.length === current.length)
      ? currentTwists.map((v) => Number(v) || 0)
      : current.map(() => 0);
    // H mode: the "children" are the downstream chain points of this same tip chain. The
    // scalar delta accumulates into them so the sub-chain rolls rigidly without re-chaining.
    const deltas = sculptTwistBrushDeltas(current.length, weights, {
      deltaX,
      strength,
      reverse,
      hierarchy: Boolean(deps.sculptState.hierarchyEditing),
      rangeStart: firstBelow,
      rangeEnd: current.length,
      firstIndex: firstBelow
    });
    deltas.forEach((delta, index) => {
      if (!delta) return;
      twistArr[index] += delta;
      changed = true;
    });
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
    if (deps.sculptState.tipHover) {
      deps.sculptState.tipHover = { lockId: null, segmentIndex: null };
      deps.panelTipStrand.updateTipHighlight(deps.getSelectedLock());
    }
    return;
  }
  const lock = deps.getSelectedLock();
  let hover = { lockId: null, segmentIndex: null };
  // 门控扩到「任何有段发尖子骨骼的几何」（0.2.126）。命中测试本身**完全没变**：
  // createSplitStrandGeometry 早就以与 panel 逐字段相同的 [mainJoint, leafIndex, weight]
  // stride-3 格式写出 geometry.userData.leafWeights（strandSplitWeights 是同一数组的别名），
  // 所以 leafWeightsValid + leafIndexAt 对发丝原样可用，segmentIndex 即命中的**管号**。
  if (lock && resolveTipHost(lock)) {
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
  const changed = deps.sculptState.tipHover?.lockId !== hover.lockId
    || deps.sculptState.tipHover?.segmentIndex !== hover.segmentIndex;
  deps.sculptState.tipHover = hover;
  if (changed) deps.panelTipStrand.updateTipHighlight(lock);
}

function prepareCurvePointSelection(event) {
  if (event.button !== 0) return;
  // ── 绿色 Tip Clump 手柄优先于曲线控制点（0.2.130）────────────────────────────────────
  // 为什么必须有这条让位：控制点的拾取是**屏幕半径 12px**
  // （STRAND_CONTROL_POINT_MIN_PICK_PIXELS，见 app.js strandControlPointHitFromEvent），而本
  // 函数挂在 capture 阶段并在命中后 stopImmediatePropagation —— 主 pointerdown（
  // beginPanelSplitHandleDrag 所在那个）于是根本不执行。普通发丝的**发尖控制点就落在管尖**，
  // 与绿色 Tip Clump 手柄的实测屏幕距离只有 9.7–10px（真实工程 layered-side-bun 的
  // Front Bangs 1，浏览器实测），因此绿手柄在真实使用中会完全抓不到 —— 移植到发丝时暴露的
  // 真实缺陷，不是脚本假象。panel 侧此前没有暴露它，只因 panel 的控制点沿面板中心线走、
  // 离段尖表面点较远（**不是**因为 panel 有豁免；同一相机角度下 panel 也可能重合）。
  // 让位判据用**射线命中球体本身**（比 12px 屏幕半径窄，且与实际可拖对象逐一对应），
  // 与既有的「gizmo 优先」让位（见下方 pointerHitsTransformGizmo）同一形状。
  // 顺序：放在最前面，两种编辑模式（对象/组件）都让位 —— 绿手柄在两种模式下都可见可拖。
  const clumpLock = deps.getSelectedLock();
  if (visibleTipClumpHandles(clumpLock).length) {
    const rect = deps.renderer.domElement.getBoundingClientRect();
    deps.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    deps.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    deps.raycaster.setFromCamera(deps.pointer, deps.camera);
    if (pointerHitsTipClumpHandle(clumpLock)) return;
  }
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
    beginTipSubBoneTranslate,
    applyTipSubBoneTransform,
    beginPanelSplitHandleDrag,
    updatePanelSplitHandleDrag,
    endPanelSplitHandleDrag,
    applySubBoneBrushSample,
    updatePanelTipHover,
    prepareCurvePointSelection,
  };
}
