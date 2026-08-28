// panel-tip-strand.js - Panel/tip strand geometry & tip sub-bone edit helpers (refactor 3d batch G1).
// Extracted from app.js; coupling injected via createPanelTipStrandApi(deps).
import * as THREE from "three";
import {
  PANEL_SCALP_CONFORM_DEFAULTS,
  panelBendCrossSection,
  panelTipCurveParameter,
  panelTipLoopParameters,
  profileTopologyCenterWeight,
  sampleArray,
  sampleAsymmetricTaperCurve
} from "./curve-math.js?v=20260910-5";

// 头部代理的兜底参数：与 app.js 的 `scalpSurface = { x:0, y:0.9, z:0, radius:1, scaleXYZ:1 }`
// 同值。**优先用注入的 deps.scalpSurface（真实运行时状态，跟随用户调整头模）**，
// 这里只是它缺失时的兜底（node 测试、或 deps 尚未装配完）。0.2.136 起不再像 0.2.135 那样
// 刻意"不跟随"—— 收缩包裹的落点必须是**真实头皮位置**，跟随才是对的。
const PANEL_SCALP_PROXY_FALLBACK = Object.freeze({
  x: 0, y: 0.9, z: 0, radius: 1, scaleX: 1, scaleY: 1, scaleZ: 1
});

// 给 bone 对象一个**稳定 id**，用于 Bend 截面 memo 的 key。为什么需要它：截面依赖 bone 的
// width/depth 曲线，不同 bone 必须命中不同缓存项；而 bone 是对象，无法直接进字符串 key。
// 用 WeakMap 而不是给 bone 挂属性：不污染被缓存对象、bone 被回收时 token 一起消失。
// null bone（主发片路径）返回 "-" 而不进 WeakMap —— WeakMap 不接受 null 键。
const panelBoneTokens = new WeakMap();
let panelBoneTokenNext = 0;
function boneToken(bone) {
  if (!bone) return "-";
  let token = panelBoneTokens.get(bone);
  if (token === undefined) {
    token = String(panelBoneTokenNext += 1);
    panelBoneTokens.set(bone, token);
  }
  return token;
}
import { sampleSurfaceLattice } from "./surface-lattice.js?v=20260814-12";
import { cloneSplitBones, segmentBoneHost } from "../bones/bone-model.js?v=20260901-1";
import { materializeTipChain, tipChainFrameAt as tipSubBoneTipChainFrameAt } from "./tip-sub-bone.js?v=20260830-1";
import { leafWeightAt, leafWeightsValid } from "./leaf-weights.js?v=20260813-1";
// 直接 import 而不是注入：panel-bone-groups.js 是**零 import 的纯函数模块**，不存在环。
// 对比 sculpt-geometry.js:606 刻意用注入 —— 那里分组树是它「本不需要知道」的东西；这里不同，
// 叶子链的 rest 必须由祖先层的 delta 顶起来，层级继承是发尖几何的**固有语义**，不是外部关切。
import {
  panelBoneGroupAncestorsForLeaf,
  panelBoneGroupLeafSpan,
  panelBoneGroupPathForLeaf,
  panelBoneGroupsFor,
  resolvePanelBoneGroupValue
} from "../bones/panel-bone-groups.js?v=20260925-9";
import {
  TIP_WIDTH_CONTROL_POINTS as SHARED_TIP_WIDTH_CONTROL_POINTS,
  buildTipWidthCurveFrom,
  segmentZipperHeights,
  setTipWidthCurveValueFrom,
  tipClumpNarrowFraction,
  tipWidthCommonForkFromHeights,
  tipWidthCommonForkFromPresentHeights,
  tipWidthControlTs as sharedTipWidthControlTs,
  tipWidthGridFromHeights,
  tipWidthRecordsOppositeForkFrom,
  tipWidthResetCurveFrom,
  tipWidthSideControlTsFrom,
  tipWidthSideExposesTAt,
  tipWidthSideForkFromHeights,
  bakeTierWidthCurveFromLeaves,
  resampleTierWidthCurveToLeaf
} from "./tip-width-curve.js?v=20260910-10";

// Shared tip width control point count: 5 midpoints (common fork) + the tip end (t=1).
// app.js createCurveObjects reuses this constant for the viewport tip width handles.
// 单一定义点在 tip-width-curve.js（普通发丝侧共用同一常量），此处仅再导出：
// bone-view-handles.js L5 从本模块 import 这个名字，勿改成本地字面量。
export const TIP_WIDTH_CONTROL_POINTS = SHARED_TIP_WIDTH_CONTROL_POINTS;

// splitTipForSegment returns plain {x,y,z} chain points from the tip-sub-bone
// primitives; consumers that need real THREE.Vector3 (CatmullRomCurve3) convert here.
function tipChainPointsAsVectors(points) {
  return points.map((point) => new THREE.Vector3(point.x, point.y, point.z));
}

// 跨叶区间（中间层分组）的「合成 splits」：让 tipMainSectionPoint / tipSurfaceFrameAt /
// tipWidthMultiplierAt 这批**按叶子逐个**重算 centerU 的既有函数，不用改一行就能正确处理
// 「一个分组节点覆盖多个连续叶子」的情形。
//
// 推导（已用真实档 Scalp Conform Test 4.ahs 的 Front Bangs 1，N=2 zipper，
// positions=[-0.3333333333333333, 0.36666666666666675] 逐区间验证，6/6 通过，
// 含退化情形与对照组，见 .tmp-bone-tree/verify-synthetic-splits.mjs 的历史记录）：
//   合成 splits = 原数组去掉下标 leafStart..leafEnd-1 的 zipper（区间内部的那些，即分组
//   自己覆盖的叶子之间的分隔线——它们不该再让内部函数重新切开这个区间）；
//   该区间在合成数组里的「虚拟 segmentIndex」= leafStart（区间左端叶子在原数组的下标，
//   因为去掉的都是它右边的内部 zipper，它自己的下标不变）；
//   于是合成 boundaries[vIdx] / boundaries[vIdx+1] 恰好落在区间两端，内部任何函数重新算出
//   的 centerU 恰好等于区间中心，lateralU = v - centerU 不再被残留的内部叶子中心污染。
// 退化情形（leafStart === leafEnd，单叶子）：没有内部 zipper 可去掉，合成数组与原数组
// 逐元素同源（同一份引用）、长度相同、vIdx === leafStart ⇒ 与「每叶一条」的既有路径逐字
// 等价，不是这条新逻辑的特例分支，而是它的自然退化。
//
// 不改变、不校验 leafStart/leafEnd 是否落在 splits 的合法范围内——那是调用方
// （panelBoneGroupLeafSpan）的职责，本函数只做纯粹的数组切分。放在模块顶层（而不是
// createPanelTipStrandApi 闭包内）：它是纯函数、不依赖 deps，测试需要不经过 API 工厂直接
// import 它。
export function syntheticSplitsForLeafSpan(splits, leafStart, leafEnd) {
  const list = Array.isArray(splits) ? splits : [];
  if (leafStart === leafEnd) return { splits: list, vIdx: leafStart };
  const kept = list.filter((_, index) => index < leafStart || index > leafEnd - 1);
  return { splits: kept, vIdx: leafStart };
}

export function createPanelTipStrandApi(deps) {
  // deps: store proxy (sculptState.state) + app.js helper functions (clonePanelSplits/
  // normalizePanelSplits/strandGeometryCurve/strandGeometryFrameAt/strandInfluenceColor/
  // isPanelGeometry/outwardNormalAtPoint).
  // Batch-fill point in app.js: after outwardNormalAtPoint (all deps defined).

function smoothCoincidentPanelNormals(geometry, tolerance = 0.0001) {
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  if (!positions || !normals) return;
  const buckets = new Map();
  const inverseTolerance = 1 / tolerance;
  for (let index = 0; index < positions.count; index += 1) {
    const key = `${Math.round(positions.getX(index) * inverseTolerance)}|${Math.round(positions.getY(index) * inverseTolerance)}|${Math.round(positions.getZ(index) * inverseTolerance)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(index);
  }
  const normal = new THREE.Vector3();
  buckets.forEach((vertexIndices) => {
    if (vertexIndices.length < 2) return;
    const clusters = [];
    vertexIndices.forEach((vertexIndex) => {
      normal.fromBufferAttribute(normals, vertexIndex).normalize();
      let cluster = clusters.find((candidate) => candidate.reference.dot(normal) > 0.25);
      if (!cluster) {
        cluster = { reference: normal.clone(), sum: new THREE.Vector3(), vertices: [] };
        clusters.push(cluster);
      }
      cluster.sum.add(normal);
      cluster.vertices.push(vertexIndex);
    });
    clusters.forEach((cluster) => {
      if (cluster.sum.lengthSq() < 0.000001) return;
      cluster.sum.normalize();
      cluster.vertices.forEach((vertexIndex) => {
        normals.setXYZ(vertexIndex, cluster.sum.x, cluster.sum.y, cluster.sum.z);
      });
    });
  });
  normals.needsUpdate = true;
}

function weldPanelGeometryData(positions, uvs, colors, indices, quadFaces, tolerance = 0.00001, weights = null, gridRows = null, gridCols = null) {
  const inverseTolerance = 1 / tolerance;
  const vertexMap = new Map();
  const remap = new Array(positions.length / 3);
  const weldedPositions = [];
  const weldedUvs = [];
  const weldedColors = [];
  const weldedWeights = weights ? [] : null;
  const weldedGridRows = gridRows ? [] : null;
  const weldedGridCols = gridCols ? [] : null;
  for (let vertex = 0; vertex < remap.length; vertex += 1) {
    const positionOffset = vertex * 3;
    const uvOffset = vertex * 2;
    const key = [
      positions[positionOffset], positions[positionOffset + 1], positions[positionOffset + 2]
    ].map((value) => Math.round(value * inverseTolerance)).join("|")
      + (gridRows && gridCols ? `|${gridRows[vertex]}|${gridCols[vertex]}` : "");
    let weldedVertex = vertexMap.get(key);
    if (weldedVertex == null) {
      weldedVertex = weldedPositions.length / 3;
      vertexMap.set(key, weldedVertex);
      weldedPositions.push(
        positions[positionOffset],
        positions[positionOffset + 1],
        positions[positionOffset + 2]
      );
      weldedUvs.push(uvs[uvOffset], uvs[uvOffset + 1]);
      weldedColors.push(
        colors[positionOffset],
        colors[positionOffset + 1],
        colors[positionOffset + 2]
      );
      if (weldedWeights) {
        const weightOffset = vertex * 3;
        weldedWeights.push(weights[weightOffset], weights[weightOffset + 1], weights[weightOffset + 2]);
      }
      if (weldedGridRows) {
        weldedGridRows.push(gridRows[vertex]);
        weldedGridCols.push(gridCols[vertex]);
      }
    }
    remap[vertex] = weldedVertex;
  }
  return {
    positions: weldedPositions,
    uvs: weldedUvs,
    colors: weldedColors,
    weights: weldedWeights,
    gridRows: weldedGridRows,
    gridCols: weldedGridCols,
    indices: indices.map((index) => remap[index]),
    quadFaces: quadFaces.map((face) => face.map((index) => remap[index]))
  };
}

function surfaceLatticeSampleVectors(lock, u, v) {
  const sample = sampleSurfaceLattice(
    lock.points,
    u,
    v,
    lock.surfaceColumns,
    lock.surfaceRows
  );
  return {
    point: new THREE.Vector3(sample.point.x, sample.point.y, sample.point.z),
    tangentU: new THREE.Vector3(sample.tangentU.x, sample.tangentU.y, sample.tangentU.z),
    tangentV: new THREE.Vector3(sample.tangentV.x, sample.tangentV.y, sample.tangentV.z)
  };
}

function surfacePanelPoint(lock, t, u, shell = 0) {
  const normalizedU = THREE.MathUtils.clamp((u + 1) * 0.5, 0, 1);
  const normalizedV = THREE.MathUtils.clamp(t, 0, 1);
  const sample = surfaceLatticeSampleVectors(lock, normalizedU, normalizedV);
  let normal = new THREE.Vector3().crossVectors(sample.tangentU, sample.tangentV);
  if (normal.lengthSq() < 0.000001) {
    normal.copy(lock.rootSurfaceNormal || new THREE.Vector3(0, 0, 1));
  }
  normal.normalize();
  if (lock.rootSurfaceNormal && normal.dot(lock.rootSurfaceNormal) < 0) normal.negate();
  const thickness = Math.max(0.0001, Number(lock.panelThickness ?? 0.08) * sampleAsymmetricTaperCurve(
    lock.depthCurve,
    lock.depthCurveSecondary,
    lock.asymmetricDepthCurve,
    shell,
    normalizedV
  ));
  return sample.point.addScaledVector(
    normal,
    shell * thickness * 0.5
  );
}

// 段 segmentIndex 的 fork-T：**委托** tip-width-curve 的 guard 形式唯一定义点。
// 本函数只负责把 panel 的 (splits, segmentIndex) 翻译成相邻 zipper 高度，推导本身不在此处。
// 注意保留 `|| null`（而非 `?.height`）：splits 条目可能是 falsy 占位，与 guard 形式的
// 「在场判定」共同决定缺侧语义。
function splitForkT(lock, segmentIndex, splits) {
  const leftSplit = splits[segmentIndex - 1] || null;
  const rightSplit = splits[segmentIndex] || null;
  return tipWidthCommonForkFromPresentHeights(leftSplit?.height, rightSplit?.height);
}


// 以下 tipWidth* 函数全部是 tip-width-curve.js 的**薄适配器**：本模块只负责把 panel 的
// (lock, segmentIndex, splits) 翻译成相邻 zipper 高度，推导本身在共享模块里单点定义
// （普通发丝侧 lock.strandSplits 复用同一批推导，勿在此处复制公式）。
function tipWidthSideForkT(lock, segmentIndex, splits, side) {
  const { left, right } = segmentZipperHeights(splits, segmentIndex);
  return tipWidthSideForkFromHeights(left, right, side);
}

function tipSegmentForkAt(segmentIndex, splits, u) {
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return null;
  const leftSplit = splits[segmentIndex - 1] || null;
  const rightSplit = splits[segmentIndex] || null;
  const fallback = leftSplit || rightSplit;
  if (!fallback) return null;
  const leftFork = leftSplit ? 1 - Number(leftSplit.height ?? 0) : 1 - Number(fallback.height ?? 0);
  const rightFork = rightSplit ? 1 - Number(rightSplit.height ?? 0) : 1 - Number(fallback.height ?? 0);
  const b0 = boundaries[segmentIndex];
  const b1 = boundaries[segmentIndex + 1];
  const localU = THREE.MathUtils.clamp((u - b0) / Math.max(0.0001, b1 - b0), 0, 1);
  return THREE.MathUtils.lerp(leftFork, rightFork, localU);
}

// Capture ownership is intentionally binary. Each exposed panel-tip vertex belongs
// entirely to its segment chain, while the exact fork row remains on the main chain.
function tipSegmentWeightAt(lock, segmentIndex, splits, t, u) {
  const forkT = tipSegmentForkAt(segmentIndex, splits, u);
  return forkT != null && t > forkT + 0.000001 ? 1 : 0;
}

// Viewport deformation keeps a short continuous blend at the same slanted fork. This
// prevents the render mesh from popping while keeping capture weights export-correct.
function tipSegmentBlendAt(lock, segmentIndex, splits, t, u, lengthLoops) {
  const forkT = tipSegmentForkAt(segmentIndex, splits, u);
  if (forkT == null) return 0;
  const start = forkT + Math.max(1 / Math.max(1, lengthLoops || 10), 0.02);
  if (forkT >= 1 || t <= start) return 0;
  return THREE.MathUtils.clamp((t - start) / Math.max(0.0001, 1 - start), 0, 1);
}

// The raw control grid for a fork: 5 midpoints plus the tip end (t=1). Callers pass the
// COMMON (deepest-zipper) fork so both sides share one grid — see tipWidthGridTs.
const tipWidthControlTs = sharedTipWidthControlTs;

function tipWidthCommonForkT(lock, segmentIndex, splits) {
  const { left, right } = segmentZipperHeights(splits, segmentIndex);
  return tipWidthCommonForkFromHeights(left, right);
}

// THE one shared control grid for a segment: TIP_WIDTH_CONTROL_POINTS midpoints of the
// COMMON (deepest-zipper) fork span plus the tip end (t=1). 两侧共用同一批 chain 参数
// → 间距永远一致；「暴露多少个」才是按各自 zipper 高度动态决定的（见
// tipWidthSideExposesT / tipWidthSideControlTs）。Index into this array is the stable
// handle index used by bone-view-handles.js / bone-interaction.js.
function tipWidthGridTs(lock, segmentIndex, splits) {
  const { left, right } = segmentZipperHeights(splits, segmentIndex);
  return tipWidthGridFromHeights(left, right);
}

// Does THIS side expose the shared-grid parameter t? Only the part of the grid inside
// this side's own exposed region (t >= 本侧 fork) is exposed; the sampler
// (tipWidthMultiplierAt) falls back to the GLOBAL curve below that fork, so anything
// below it must be neither authored into nor grabbable on this side.
// 单一定义点：placement / build / reset / write 全部走这里，避免各自复制判据。
// 判据本体在 tip-width-curve.js 的 tipWidthSideExposesTAt（与普通发丝侧共用）。
function tipWidthSideExposesT(lock, segmentIndex, splits, side, t) {
  return tipWidthSideExposesTAt(tipWidthSideForkT(lock, segmentIndex, splits, side), t);
}

// The tip width control positions THIS side exposes: the subset of the SHARED
// (deepest-fork) grid that lies inside this side's own exposed region. 参数共享（两侧
// 间距一致），数量按本侧 zipper 高度动态变化 —— 深 zipper 侧暴露得多，浅 zipper 侧
// 只暴露靠发尖的几个。
// 不变式（0.2.118 起）：某个参数出现在本侧曲线数据里（因而影响本侧采样宽度）当且
// 仅当本侧为它提供了可抓把手。共享网格不会破坏它，因为低于本侧 fork 的网格位置
// 既不写入本侧曲线（buildTipWidthCurve/tipWidthResetCurve 只遍历本函数的返回值），
// 也不返回视口放置（tipWidthControlPlacement 用同一判据返回 null）。
function tipWidthSideControlTs(lock, segmentIndex, splits, side) {
  return tipWidthSideControlTsFrom(
    tipWidthGridTs(lock, segmentIndex, splits),
    tipWidthSideForkT(lock, segmentIndex, splits, side)
  );
}

// 对侧 fork 记录点是否该写进本侧曲线：只有落在本侧 fork 之下（采样器在该区间回退
// 全局曲线，点不参与本侧宽度）时才写。若对侧 zipper 更浅（对侧 fork 更靠发尖），
// 它会落在本侧暴露区内部 → 成为没有把手却参与采样的「活点」（凹陷来源），必须不写。
// 共享网格（0.2.123）不解除这个危险：对侧 fork 是 zipper 高度的连续值，通常**不在**
// 共享网格上，所以它落进本侧暴露区时依然是一个不可抓的活点 → 守卫必须保留。
function tipWidthRecordsOppositeFork(lock, segmentIndex, splits, side) {
  return tipWidthRecordsOppositeForkFrom(
    tipWidthSideForkT(lock, segmentIndex, splits, side),
    tipWidthSideForkT(lock, segmentIndex, splits, -side)
  );
}

// Reset curve for a tip (segment) width curve: Reset 后整条曲线全 1 (full width value 1)
// across the entire exposed region, including both fork boundary points, so no global
// curve sampling happens after Reset.
function tipWidthResetCurve(lock, segmentIndex, splits, side) {
  return tipWidthResetCurveFrom({
    gridTs: tipWidthGridTs(lock, segmentIndex, splits),
    sideForkT: tipWidthSideForkT(lock, segmentIndex, splits, side),
    oppositeForkT: tipWidthSideForkT(lock, segmentIndex, splits, -side)
  });
}

// The segment's tip-narrowing gap at chain parameter t on one side: 0 at the side's
// zipper (fork), ramping linearly to 0.5*spread*span at the tip (aggregation). Edge
// segment outer sides without a zipper mirror the opposite side's zipper (same
// bone.tipClump, same ramp start): 边缘段外侧镜像对侧 zipper 参数，两侧一致收窄（自动
// 补全，不展示 UI）。Only when a side has no zipper on either side (no splits at all)
// does it never gap.
function tipWidthSpreadGap(lock, segmentIndex, splits, bone, t, side) {
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return 0;
  let zipper = side < 0 ? splits[segmentIndex - 1] : splits[segmentIndex];
  if (!zipper) zipper = side < 0 ? splits[segmentIndex] : splits[segmentIndex - 1];
  if (!zipper) return 0;
  // 收窄比例（斜坡 + spread 钳位）走共享单点定义 tipClumpNarrowFraction；本函数只负责
  // 把「比例」翻译成 panel 的 u 空间位移（× 段自身半跨度）。发丝侧消费同一个比例，只是
  // 乘的是管内半跨度 —— 那正是「两侧 Tip Clump 数值同义」的构造性保证。
  const span = boundaries[segmentIndex + 1] - boundaries[segmentIndex];
  return 0.5 * span * tipClumpNarrowFraction(zipper.height ?? 0, bone?.tipClump ?? 0, t);
}

// §3.3 中间层曲线回落：leaf(bone 自己的值) → 祖先中间层（沿分组链） → lock 的全局曲线。
// 只用于 taperCurve/taperCurveSecondary —— 这两个字段在 panel-bone-groups.js 的
// AUTHORABLE_KEYS 白名单里，可以被中间层创作、也可以沿链回落（resolvePanelBoneGroupValue
// 本来就是干这件事的现成纯函数，直接复用，不新写一份回落公式）。
// asymmetricWidthCurve **刻意不在这里**：AUTHORABLE_KEYS 没有这个字段，分组树节点上根本
// 不存在这个属性（只有 tip/AUTHORABLE_KEYS 两类字段），中间层从未有机会创作它 ⇒ 给它加
// 三级回落等于凭空发明一层新的可创作状态，是设计变更，不是本轮该做的 bug 修复；那个参数
// 维持原来的 `bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve` 两级回落。
// segmentIndex < 0（主发片路径，无段）或分组树取不到 ⇒ 直接回落 lock[key]，与改前的
// 「两级回落」逐字节等价（真中间层没有创作过时，resolvePanelBoneGroupValue 沿链一路查到根
// 全是 null，最终落到 fallback 参数——我们传的正是 lock[key]，退化输出与改前相同）。
function panelTierCurveFallback(lock, segmentIndex, key) {
  if (segmentIndex < 0) return lock[key];
  const root = panelBoneGroupsFor(lock);
  if (!root) return lock[key];
  const path = panelBoneGroupPathForLeaf(root, segmentIndex);
  if (!path) return lock[key];
  return resolvePanelBoneGroupValue(root, path, key, lock[key]);
}

// ── 中间层 WidthCurve 所有权转移的接线（0.2.172）─────────────────────────────────
//
// 这两个函数把 tip-width-curve.js 里的纯数学（bakeTierWidthCurveFromLeaves /
// resampleTierWidthCurveToLeaf）接到真实的 lock 上。
//
// ★ 为什么接线点放在本文件而不是 app.js：bake 需要三个入参 leafCurves / leafGridTs /
// tierGridTs，其中 grid 由 `tipWidthControlTs(forkT)` 决定、forkT 又要从 splits 推导 ——
// 这条推导链（segmentZipperHeights → tipWidthGridFromHeights）整条都在本文件里，且
// `syntheticSplitsForLeafSpan`（算 span 级 forkT 用的合成 splits）也在本文件。放 app.js 要
// 新拉三个跨模块 import 并把 grid 推导抄一份出去 —— 那就是「同一推导两个定义点」。
// 本文件已经 import 了 tip-width-curve 与 panel-bone-groups，接在这里零新增依赖。
//
// ★ 跨网格重采样为什么必要（实测数字）：真实档 Test 4 的 Front Bangs 1（2 zipper,
// heights [0.3, 0.4]）上，叶 1/叶 2 的 forkT 都是 0.6、grid 是 [0.64 … 1]，而覆盖它们的
// 中间层走 span 级 forkT = 0.7、grid 是 [0.73 … 1]。控制点位置根本不在同一批 t 上，
// 直接复制曲线数组会让形状整体错位，必须用 sampleTaperCurve 在对方的网格上重取值。

// 取某个叶子段在「沿分组链回落」口径下的有效曲线。
// fallback 传 lock[key]，与 panelTierCurveFallback 同一口径。
function leafEffectiveCurve(lock, root, leafIndex, key) {
  const path = panelBoneGroupPathForLeaf(root, leafIndex);
  if (!path) return lock[key];
  return resolvePanelBoneGroupValue(root, path, key, lock[key]);
}

// 把一个中间层覆盖的各叶子曲线烘成该层自己的一条曲线。
//
// ★ 这取代了 0.2.155 的「首笔播种」（app.js 的 widthBrushCurveArray）。播种沿分组链**向上**
// 取第一个非 null 值，**完全不看子孙**：叶子各自创作过 0.5 / 1.9 时，播种给中间层的是
// lock 层的 1 —— 既不是任一叶子的值也不是它们的平均。而播种自己的设计意图注释写的是
// 「第一笔从所见形状继续、不跳变」，在这种情形下它违反了自己的意图。bake 取叶子平均才是
// 「从所见形状继续」的正确实现（用户拍板选 bake）。
// 两者在叶子都未创作时给出相同结果（都回落到 lock 层），所以这次替换只在「叶子已各自
// 创作过」时改变行为 —— 那恰好是 bake 被设计出来要解决的场景。
//
// 返回 null ⇒ 调用方应保持原行为（不是错误，是「这个 path 不是真中间层」或数据不足）。
function bakeTierWidthCurve(lock, groupPath, key) {
  if (!Array.isArray(groupPath) || !groupPath.length) return null;
  const span = panelBoneGroupLeafSpan(lock, groupPath);
  // leafStart === leafEnd 的节点就是某个叶子段本身，没有「把多个叶子合并」这回事 ⇒
  // 不该走 bake（与 resolvePanelTierSpan 的退化判据同一口径）。
  if (!span || span.leafStart === span.leafEnd) return null;
  const root = panelBoneGroupsFor(lock);
  if (!root) return null;
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  const leafCurves = [];
  const leafGridTs = [];
  for (let leaf = span.leafStart; leaf <= span.leafEnd; leaf += 1) {
    leafCurves.push(leafEffectiveCurve(lock, root, leaf, key));
    leafGridTs.push(tipWidthGridTs(lock, leaf, splits));
  }
  const { splits: synthSplits, vIdx } = syntheticSplitsForLeafSpan(splits, span.leafStart, span.leafEnd);
  const tierGridTs = tipWidthGridTs(lock, vIdx, synthSplits);
  const baked = bakeTierWidthCurveFromLeaves({
    leafCurves, leafGridTs, tierGridTs, fallbackCurve: lock[key]
  });
  return Array.isArray(baked) && baked.length ? baked : null;
}

// 把一个中间层的曲线按某个叶子自己的网格重采样，供「该层消失时写回叶子」用。
// 调用方对该层覆盖的每个叶子各调一次。
function resampleTierCurveToLeaf(lock, tierCurve, leafIndex) {
  if (!Array.isArray(tierCurve) || !tierCurve.length) return null;
  const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  const leafGridTs = tipWidthGridTs(lock, leafIndex, splits);
  const out = resampleTierWidthCurveToLeaf({ tierCurve, leafGridTs });
  return Array.isArray(out) && out.length ? out : null;
}

// Shared tip width sampler: above the segment's fork (locked) or without a segment the
// global panel curve applies with the main-panel split (u sign); below the fork the tip's
// OWN WidthCurve applies, split/blended across the segment (centerU +/- half span) so the
// tip width belongs to the tip sub-bone, not the main bone.
//
// ★ 性能提示（未解决，见函数尾部同名注释与本轮报告 §2）：below-fork 分支每次调用都会走
// panelTierCurveFallback → panelBoneGroupsFor（现场派生/归一化整棵分组树），本函数是热路径
// （网格逐顶点、把手逐点都调），已实测有可观测的重复开销，但**没有**在此加缓存——按约定
// 「判断有性能风险时停下来报告主脑，不要自己引入缓存机制」，把决定权留给主脑。
function tipWidthMultiplierAt(lock, t, u, bone, segmentIndex = -1, splits = null) {
  const segSplits = splits || deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
  const boundaries = [-1, ...(Array.isArray(segSplits) ? segSplits : []).map((split) => split.position), 1];
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) {
    return sampleAsymmetricTaperCurve(
      lock.taperCurve,
      lock.taperCurveSecondary,
      lock.asymmetricWidthCurve,
      u,
      t
    );
  }
  const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
  const halfSpan = Math.max(0.0001, (boundaries[segmentIndex + 1] - boundaries[segmentIndex]) * 0.5);
  // fork 按段内相对侧判定（u 相对段中心 centerU 的符号），与下方曲线采样
  // ((u - centerU) / halfSpan：左半段采 secondary、右半段采 primary) 语义一致；
  // 避免「单侧半轴段」用绝对 u 符号取到另一侧 zipper 的 fork 而产生死区。
  const side = (u - centerU) < 0 ? -1 : 1;
  const forkT = tipWidthSideForkT(lock, segmentIndex, segSplits, side);
  // 锁定区（t < 本侧 fork，未暴露控制区）始终回退全局曲线：发尖 WidthCurve 只控制
  // 暴露区，Zipper 上半部分直接跟随主骨骼，Reset 后不会开裂。
  if (forkT >= 1 || t < forkT - 1e-4) {
    return sampleAsymmetricTaperCurve(
      lock.taperCurve,
      lock.taperCurveSecondary,
      lock.asymmetricWidthCurve,
      u,
      t
    );
  }
  return sampleAsymmetricTaperCurve(
    bone?.taperCurve || panelTierCurveFallback(lock, segmentIndex, "taperCurve"),
    bone?.taperCurveSecondary || panelTierCurveFallback(lock, segmentIndex, "taperCurveSecondary"),
    bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve,
    (u - centerU) / halfSpan,
    t,
    0.25
  );
}

// Replicates the panel geometry's width sampling so viewport width handles can read
// and write the same multiplier the geometry consumes (bone.taperCurve/secondary).
function tipPanelWidthAt(lock, t, side, bone, segmentIndex = -1, splits = null) {
  const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
  const multiplier = tipWidthMultiplierAt(lock, t, side, bone, segmentIndex, splits);
  return Math.max(0.0001, fullWidth * multiplier);
}

function buildTipWidthCurve(lock, segmentIndex, splits, bone, side) {
  // The curve this side was EFFECTIVELY using before any tip-width edit. Using the
  // panel secondary unconditionally here made the un-dragged LEFT side jump from the
  // primary to the secondary the moment a right drag turned on asymmetric width.
  const globalCurve = side < 0
    ? ((lock.asymmetricWidthCurve && lock.taperCurveSecondary) ? lock.taperCurveSecondary : lock.taperCurve)
    : lock.taperCurve;
  const current = side < 0 ? bone.taperCurveSecondary : bone.taperCurve;
  return buildTipWidthCurveFrom({
    gridTs: tipWidthGridTs(lock, segmentIndex, splits),
    sideForkT: tipWidthSideForkT(lock, segmentIndex, splits, side),
    oppositeForkT: tipWidthSideForkT(lock, segmentIndex, splits, -side),
    globalCurve,
    current
  });
}

// Set the width multiplier at chain parameter t for one side, then rebuild only the
// edited side's curve so the above-zipper (locked) region tracks the global default
// and left/right stay independent (asymmetric width profile).
function setTipWidthCurveValue(lock, segmentIndex, splits, bone, side, t, value) {
  if (!bone.taperCurve) bone.taperCurve = buildTipWidthCurve(lock, segmentIndex, splits, bone, 1);
  if (!bone.taperCurveSecondary) bone.taperCurveSecondary = buildTipWidthCurve(lock, segmentIndex, splits, bone, -1);
  bone.asymmetricWidthCurve = true;
  const curve = side < 0 ? bone.taperCurveSecondary : bone.taperCurve;
  // 吸附与写入在共享模块里（同一判据/同一吸附规则供普通发丝复用）；返回 null = 本侧
  // 无处可写（低于本侧 fork 或暴露子集为空）→ 不重建，保持「跳过写入」语义。
  const written = setTipWidthCurveValueFrom({
    curve,
    gridTs: tipWidthGridTs(lock, segmentIndex, splits),
    sideForkT: tipWidthSideForkT(lock, segmentIndex, splits, side),
    t,
    value
  });
  if (!written) return null;
  if (side < 0) bone.taperCurveSecondary = buildTipWidthCurve(lock, segmentIndex, splits, bone, -1);
  else bone.taperCurve = buildTipWidthCurve(lock, segmentIndex, splits, bone, 1);
  // 返回**重建后**的本侧曲线（非 null = 确实写进去了）。Width Brush 的写入适配层靠这个
  // 真假值把 setTipWidthCurveValueFrom 的「无处可写」语义一路透传给笔刷，笔刷据此跳过该
  // 控制点而不是把 undefined 当成成功。视口拖拽路径不读返回值，行为不变。
  return side < 0 ? bone.taperCurveSecondary : bone.taperCurve;
}

// Replicates the panel geometry's frame (panelFrameAt: parallel-transported frames
// interpolated per row). Using strandFrameAt here left the width UI floating off the
// mesh surface (like a different hair layer) because the two frames differ.
function tipPanelFrameAt(lock, t) {
  const lengthLoops = THREE.MathUtils.clamp(Math.round(lock.panelLengthLoops ?? 10), 3, 32);
  const curve = deps.strandGeometryCurve(lock);
  let frames = lock._tipWidthFrames;
  if (!Array.isArray(frames) || frames.length !== lengthLoops + 1) {
    frames = [];
    let previousFrame = null;
    for (let row = 0; row <= lengthLoops; row += 1) {
      previousFrame = deps.strandGeometryFrameAt(lock, curve, row / lengthLoops, previousFrame);
      frames.push(previousFrame);
    }
    lock._tipWidthFrames = frames;
  }
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * lengthLoops;
  const lowerIndex = Math.min(lengthLoops, Math.floor(scaled));
  const upperIndex = Math.min(lengthLoops, lowerIndex + 1);
  const lower = frames[lowerIndex];
  const upper = frames[upperIndex];
  const alpha = scaled - lowerIndex;
  const point = curve.getPoint(t);
  const y = curve.getTangent(t).normalize();
  const upperZ = upper.z.clone();
  if (lower.z.dot(upperZ) < 0) upperZ.negate();
  let z = lower.z.clone().lerp(upperZ, alpha).projectOnPlane(y);
  if (z.lengthSq() < 0.0001) z.copy(deps.outwardNormalAtPoint(point, y));
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  z = new THREE.Vector3().crossVectors(x, y).normalize();
  return { point, x, y, z };
}

// Scalp Conform 的 lock/deps 读取：**本文件内唯一定义点**，rawPanelPoint（几何）与
// tipMainSectionPoint（宽度把手的截面复刻）都必须经它取参数，否则网格弯了而把手
// 留在原处（该 bug 类见 devlog/bug-fixes.md #25）。
// **第四版删掉了那个全局弯曲半径标量**（根因 B）：它曾是
// `(radius·scaleX + radius·scaleZ)/2 + gap` 这个**单一值**、对所有行通用，而各行到头心的
// 真实距离实测是 1.021..1.440 ⇒ 外侧行按过小的半径过度卷绕、直接扎进头皮
// （amount=0.87 最深穿透 +0.235）。半径现在改为**逐行**在 panelScalpConformOffsets 里取
// 「该行到（拟合椭球纬线密切圆）圆心的真实距离」，所以本函数只需交出 `center` 与拟合椭球的半轴。
// **第五版新增：`deps.scalpConformFit` 的 `fitScaleX`/`fitScaleZ` 现在确实参与 conform**——
// 但那是**另一份独立注入的参数**，不是下面这段仍然成立的 `deps.scalpSurface`：
// **⚠️ 实测口径：`scalpSurface` 代理自身的缩放与半径对 conform 结果的影响是「零」，不是「间接」**
// （勿写成间接 —— 本轮逐位实测：scaleX=1.4 / scaleZ=1.6 / scaleY=0.5 / 三轴=2.0 / radius=2.0 /
// radius=0.3 **全部逐位相同**，maxDiff = 0；同一探针里只把 center.y 从 0.9 挪到 0.2 就变了 5.729e-1）。
// 成因：卷绕半径 R 来自**拟合椭球**（`deps.scalpConformFit`，见下），而**行的位置来自授权数据
// `lock.points`**，两者都不来自 `scalpSurface` 的缩放/半径 ⇒ 那组字段既不移动面板也不移动
// center，也就不改变任何东西。**两套参数刻意不合并**：`scalpSurface` 是头部代理**渲染网格**的
// 形状，`scalpConformFit` 是 conform 用的拟合椭球——合并会让"调渲染网格外观"意外改变已调好的
// 贴合手感。
// **这是相对 0.2.138–142 的用户可见变化**（那版 scaleX/scaleZ 直接进弯曲半径，放大头会让卷绕变松），
// 属本模型的固有语义：conform 卷的是「过面板自身的同心面」（amount=1 ⇒ 弧半径恰为 R+gap），
// 而不是「贴到头皮表面上」。所以放大 `scalpSurface` 渲染代理不会让面板跟着让开 —— 若想让卷绕
// 跟头模大小走，要调的是 `deps.scalpConformFit`（这正是它存在的理由），不是在这里补一个缩放系数。
// geometryType === "surface"（lattice 控制）恒 0：与 panelTipCurve / panelLeftEdgeTrim
// 的既有先例一致（tipOffsetSampleT 与 createPanelStrandGeometry 都在 latticeControlled
// 时把这些强制为 0）—— lattice 面板的形状由控制网格直接决定，程序化形变不适用。
function panelScalpConformParams(lock) {
  const amount = lock?.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Number(lock?.panelScalpConformAmount ?? 0), -1, 1);
  const proxySource = deps.scalpSurface || PANEL_SCALP_PROXY_FALLBACK;
  // 拟合椭球的半轴来源：**独立注入**的 `deps.scalpConformFit`（Phase 2 负责接线与 UI，本函数
  // 只负责读取 + 钳位 + 回退）。缺失时回退到 PANEL_SCALP_CONFORM_DEFAULTS 里的全 1 默认值 ——
  // 这条回退让本次改动在 Phase 2 落地前也能独立跑通，且全 1 ⇒ 椭球退化为单位球，
  // 与本版之前（球构型）逐位等价。
  const fitSource = deps.scalpConformFit || PANEL_SCALP_CONFORM_DEFAULTS;
  const fitScaleX = THREE.MathUtils.clamp(
    Number(fitSource.fitScaleX ?? PANEL_SCALP_CONFORM_DEFAULTS.fitScaleX),
    0.5,
    1.5
  );
  const fitScaleZ = THREE.MathUtils.clamp(
    Number(fitSource.fitScaleZ ?? PANEL_SCALP_CONFORM_DEFAULTS.fitScaleZ),
    0.5,
    1.5
  );
  return {
    amount,
    gap: THREE.MathUtils.clamp(
      Number(lock?.panelScalpConformGap ?? PANEL_SCALP_CONFORM_DEFAULTS.gap),
      0,
      0.5
    ),
    // 头部代理中心（**世界空间**），拟合椭球以它为中心。刻意**不读 Object3D 的 matrixWorld**：
    // 几何重建时机比渲染早，那个矩阵可能是脏的；从纯数据推变换永远是当前值。
    center: new THREE.Vector3(
      Number(proxySource.x ?? 0),
      Number(proxySource.y ?? 0.9),
      Number(proxySource.z ?? 0)
    ),
    // 拟合椭球三半轴（世界单位）：`ax`/`az` = fitScale{X,Z}，`ay` **写死为 1**（不是回退值，
    // 是刻意的固定取值——理由见 curve-math.js 里 PANEL_SCALP_CONFORM_DEFAULTS 上方注释的
    // 「三难」与代数退化证明：球构型下整体半径/竖直半轴对结果的影响精确为 0，非球构型下
    // 才重新变得有效，所以把它们从可调参数里去掉、固定在"默认头模尺寸"这一族上，
    // 只留水平两半轴的比例（各向异性）给用户调）。中心复用上面的 `center`，
    // **不额外读取中心参数** —— 椭球与头部代理中心同源是设计选择，不是遗漏。
    ax: fitScaleX,
    ay: 1,
    az: fitScaleZ
  };
}

// 逐行绕**头部拟合椭球纬线的密切圆**同心 wrap：**唯一定义点**，弯曲平面与曲率都在这里从
// 头部代理现场推出。返回值是**世界空间的 `THREE.Vector3` 偏移，起点为 `frame.point`**（调用方用法：
// `point = frame.point.clone().add(offsets)`）。为什么不能再返回 `{lateral, normal}`：那对
// 系数隐含基 = `(frame.x, frame.z)`，而弯曲平面已不再是那张平面 —— 这是一次**受控 API 变更**，
// 影响**恰好 2 个消费点**（几何 `rawPanelPoint`、宽度把手复刻 `tipMainSectionPoint`），两处
// 必须同步改，否则绿色宽度把手会浮在面板外（bug-fixes.md #25 那一类），有跨消费方一致性测试咬住。
//
// 逐行推导（`frame` = 该行的完整 frame，`params.center`/`ax`/`ay`/`az` = 头部拟合椭球）：
//   纬线椭圆半轴 A = ax·c、B = az·c（c = √(1−h²)，h = (P.y−C.y)/ay 钳位到 ±(1−1e-3)）；
//   Pe = 该纬线椭圆上与 P 同方位角的点、ρ = 该处曲率半径、O_osc = Pe + ρ·n̂ₑ（n̂ₑ 指向椭圆内侧）；
//   Reff = |P − O_osc|（恒水平）、径向 r̂ = (P − O_osc)/Reff；
//   弯曲平面 = (x̂_t, n̂)、弯曲轴 â = x̂_t × n̂ —— **完全由头部几何决定，与曲线切线无关**。
// `camber` 已折进 `sample(v)` 返回的**中面**截面（0.2.139，含 camber、不含 shell 厚度），
// 本函数把它弯到 `k = amount / (Reff + gap)` 上并**严格保弧长**（离散逐段保长，见 curve-math）。
// `shellOffset` 是"中面之外"的部分（shell·thickness/2 + centerZ 权重），沿**弯后法向**
// 放上去，因此厚度不被剪切。
//
// **两道早退门都是契约，不是优化**：`amount === 0` ⇒ 逐位等于平板（调用方走原表达式）；
// `u === 0` ⇒ **中线逐位不动**，这是主发片控制点（落在授权曲线上）天然对齐的**结构性**依据。
// 没有 `u===0` 那道门，「换基再还原」（世界 → (x̂_t, n̂, â) → 世界）的浮点往返会在中线上留下
// 噪声、把该契约破在末位。
// `cache`/`cacheKey` 可选：**弯后截面与 shell 无关**（shellOffset 在结果之外才加上），而
// rawPanelPoint 按 front/back 各调一次 ⇒ 同一 (sampleT, u) 的积分本会跑两遍。实测重复倍数
// 恰好 **2.00×**（198 顶点 / 99 个去重 (row,u) 组合），故传一个 per-build 的 Map 即可无条件
// 砍掉一半积分。**key 必须含 sampleT 本身** —— `sampleT` 在 tipCurve≠0 或左右 EdgeTrim 不等时
// 是 u 的函数，用 (row, u) 之类的索引做 key 会把不同截面混成一份、静默给出错误几何。
// **第四版起缓存的是「加 shell 之前」的世界向量**（步骤 1–12），与旧版同构：`shellOffset` 仍在
// 缓存之外才加。**既有 key 无需扩充**：新引入的 `frame`（进而 O_osc / Reff / x̂_t / â / k）是
// `sampleT` 的**确定性函数**（`panelFrameAt(sampleT)` 纯由 frames 链插值得出），已被 key 里的
// sampleT 覆盖。
// `frame` = 该行的完整 frame（`{point, x, y, z}`，世界空间）。**必须传整个 frame 而不是 frame.x**：
// 弯曲平面要由 `frame.point` 相对头心的位置推出，只给宽度轴推不出半径与径向。
// **0.2.142 的 `k·cos²α` 已删除**：那是对**错误轴**（= 曲线切线）的症状补偿 —— 它让倾斜处少弯，
// 代价是该贴合的地方也不贴。删除的正当理由是**轴已经对了、不需要补偿**：`x̂_t` 的职责是把弯曲
// **平面**定到同心面的切平面上，它不是一个幅度衰减项。
//
// ── 第五版：为什么把「胶囊轴」换成「纬线 + 椭球密切圆心」──────────────────────
// **第四版的病根是 `min`**：`axisPoint = (C.x, min(C.y, P.y), C.z)`。当 `P.y > C.y`（行落在
// 头心高度以上）时，`min` 把轴塌成 `center` 这一个点 ⇒ 弯曲退化成一个**过头顶的大圆**，轴本身
// 因此是**倾斜**的（不垂直于任何一条纬线）。真实档发根实测：该轴方向 ≈ `(0, −0.407, 0.913)`，
// 边缘到中线的 `Δy = −1.578` —— 一条本该近似水平的"纬线包裹"被拉成了斜穿头顶的弧，行序也因此
// 逆序（4/6 行的推进顺序被打乱）。**本版不再用胶囊轴，而是逐行在头部拟合椭球的纬线上取密切圆**：
//   c    = √(1 − h²)，h = (P.y − C.y)/ay 钳位到 ±(1 − 1e-3)（钳位是防 NaN，见下，不是软化）
//   A = ax·c、B = az·c            —— 该纬度处纬线椭圆的两个半轴
//   t    = atan2(dz/B, dx/A)      —— P 的方位角在该纬线椭圆上的参数（dx = P.x−C.x, dz = P.z−C.z）
//   Pe   = (C.x + A·cos t, P.y, C.z + B·sin t)     —— 纬线椭圆上同方位的点
//   ρ    = (A²sin²t + B²cos²t)^{3/2} / (A·B)        —— 该处曲率半径
//   O_osc = Pe + ρ·n̂ₑ（n̂ₑ 指向椭圆内侧，y = P.y）   —— 密切圆心，恒水平
//   Reff = |P − O_osc|、r̂ = (P − O_osc)/Reff（恒水平）
// 这条纬线本身处处水平，密切圆心也恒在 `y = P.y` 上，弯曲轴因此不再随行的高度倾斜。
//
// **`h` 钳位是防 NaN，不是软化，本轮新修的真实缺陷**：`h = ±1` ⇒ `c = 0` ⇒ `A = B = 0` ⇒
// `ρ = 0/0 = NaN`。而 `panelBendCrossSection` 首行 `Number(curvature) || 0` 把 `NaN` 当 falsy
// 静默变成 `0` ⇒ 该行悄悄摊平成直线、不报错、不被现有 `radius < 1e-6` 守卫抓到（`NaN < 1e-6`
// 为 `false`）。`ay` 现已写死为 1，椭球顶恒为 `y = C.y + 1`；发根 `y` 高于此值（真实档案曾
// 实测到 `1.8326 > C.y + 1`）就会撞上 `h > 1` 触发的这个 NaN。两道措施因此都要上：(a) 上面的
// `h` 钳位；(b) 下面把退化守卫从 `radius < 1e-6` 扩成 `!Number.isFinite(Reff) || Reff < 1e-6`。
//
// **球退化自检**：`ax === ay === az` 时，纬线圆退化为水平大圆（`Pe` 在圆上任意一点，曲率恒为
// `ax`），`O_osc` 必须精确等于纬线圆心 `(C.x, P.y, C.z)`，`Reff` 必须精确等于水平距离
// `hypot(dx, dz)` —— 实测该等价的浮点误差量级为 1.11e-16（用临时脚本核对到 <1e-9，验完已删）。
//
// **⚠️ 已知限制一（非球构型下"不穿透"不再由构造保证）**：椭球横截面是椭圆而不是圆，同一纬线
// 上不同方位角的水平半径可以大于 `Reff`（`Reff` 只是"密切圆"半径，不是该纬线到轴的最大距离）。
// 实测 `fitScale = (1, 0.9, 1.6)` 时边缘椭球归一化深度 P5 达 **−0.668**、P4 **−0.605**（负值即
// 已穿透代理表面）；球构型（三轴相等）不受此影响。**这是已知限制，不是待修 bug**——用户已按
// 「椭球只是近似，不追求处处不穿透」的口径接受。
//
// **⚠️ 已知限制二（椭球下包裹松紧随方位角不对称）**：同一纬线上，正面（沿 z 轴方向）与侧面
// （沿 x 轴方向）的曲率半径不同 ⇒ 同一 amount 下卷起的角度不同。实测 `fitScale = (1.4, 1, 1)`
// 时 `y = 1.4` 处正面 wrap 69.33° vs 侧面 173.42°（2.5×）；`fitScale = (1.4, 0.9, 1.6)` 时方向
// 甚至**翻转**为正面 111.41° > 侧面 76.90°。这是椭球曲率随方位变化的固有几何行为，不是 bug。
//
// **不加"极区软化"、不加向三维半径的混合**：用户已拍板这条模型（代号 L1）就是纯纬线 + 椭球
// 密切圆心，任何"满足条件 C 就切到别的公式"的补偿都不在本版范围内（会掩盖上面两条已知限制，
// 而已知限制是被接受的，不是要被掩盖的）。
//
// **⚠️ 计划 §5.3「若宽度方向直指头心则 x̂_t → 0、弯曲自行消失」是错的（本轮实测证伪，勿据此
// 以为有内建衰减）**：`x̂_t` 在**归一化之前**确实趋于 0，但它**被归一化**，所以弯曲平面始终良定义。
// 实测把宽度轴从切向转到径向（α: 0→89.999°），位移量恒为 1.75144（β=0）/1.74259（β=25°）/
// 1.71994（β=55°）—— **全程不衰减**，到 α=90° 才由下面的 `1e-12` 守卫落到 flat 分支。
// 那个恒定值本身是**对的**：截面落在 `span{frame.x, frame.z}` 内，在该平面内滚动 frame 只是给
// 同一条几何曲线换坐标标签，与「弯曲取自头、不取自 frame」的不变式一致。
// **一处补充（主进程复核时实测，S1 的表只覆盖了直截面）**：这个「恒定」**只对直截面成立**。
// 含 camber 的截面实测随 α 变化（β=0 时 1.68364 → 1.19638 → 1.12581，α=0/60/89）。
// 成因不矛盾、反而印证上面那句：`sample(v)` 是在 `frame.x`/`frame.z` 上表达的，滚动 frame 会
// 换掉**被弯的那条几何曲线**；而直截面恰好例外 —— `sample2` 退化成弯曲平面内长度恒为 `2.5v`、
// 倾角 α 的直线，**弧长与 α 无关**，内核按弧长工作，故结果不变。⇒ 引用「恒定」时必须说明是直截面。
// **已知限制**：α 恰为 90°（宽度轴与径向平行）时守卫返回 null ⇒ 位移从 ~1.75 跳到 0。该构型是
// 零测集（守卫只在距 90° 约 1e-6 rad 内触发），浮点上基本不可达，故本轮不处理；要处理属设计
// 决策（「edge-on 面板该弯成什么样」），不是实现细节。
function panelScalpConformOffsets(params, sample, u, shellOffset, cache = null, cacheKey = null, frame = null) {
  if (!params || params.amount === 0) return null;
  const target = Number(u) || 0;
  if (target === 0) return null;
  if (!frame) return null;
  let cached = cache && cacheKey !== null ? cache.get(cacheKey) : null;
  if (!cached) {
    const { center: C, ax, ay, az } = params;
    const P = frame.point;
    // h 钳位是**防 NaN，不是软化**：h=±1 ⇒ A=B=0 ⇒ rho=0/0=NaN（见函数头注释「第五版」小节）。
    const h = THREE.MathUtils.clamp((P.y - C.y) / ay, -(1 - 1e-3), 1 - 1e-3);
    const c = Math.sqrt(1 - h * h);
    const A = ax * c;
    const B = az * c;
    const dx = P.x - C.x;
    const dz = P.z - C.z;
    const t = Math.atan2(dz / B, dx / A);
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    const Pe = new THREE.Vector3(C.x + A * cosT, P.y, C.z + B * sinT);
    const rho = Math.pow(A * A * sinT * sinT + B * B * cosT * cosT, 1.5) / (A * B);
    // n̂ₑ：椭圆在 Pe 处的外法向 ∝ (cos t/A, sin t/B)，取反得内法向（凹侧，密切圆心所在方向）。
    const outwardLength = Math.hypot(cosT / A, sinT / B);
    const nEx = -(cosT / A) / outwardLength;
    const nEz = -(sinT / B) / outwardLength;
    const oOsc = new THREE.Vector3(Pe.x + rho * nEx, P.y, Pe.z + rho * nEz);
    const radial = P.clone().sub(oOsc);
    const reff = radial.length();
    // 退化守卫**扩成 isFinite 检查**：`NaN < 1e-6` 为 false，旧守卫抓不住上面 h=±1 触发的 NaN。
    if (!Number.isFinite(reff) || reff < 1e-6) return null;
    const radialHat = radial.divideScalar(reff);
    // 让径向与面板自己的法向同侧：正的 amount 因此**恒朝头部方向**弯，与面板被翻到哪一面无关。
    const normalHat = frame.z.dot(radialHat) < 0 ? radialHat.clone().negate() : radialHat.clone();
    // 宽度方向投影到该同心球/圆柱的切平面。**投影的作用是把弯曲平面定住，不是衰减幅度**
    // （见上方 ⚠️：归一化之后没有内建衰减）。下面的 `1e-12` 守卫处理的是**退化**
    // ——宽度轴与径向平行时切平面内没有方向可取，此时退回 flat 分支而不是除零。
    const lateralHat = frame.x.clone().addScaledVector(normalHat, -frame.x.dot(normalHat));
    if (lateralHat.lengthSq() < 1e-12) return null;
    lateralHat.normalize();
    const k = params.amount / (reff + params.gap);
    const axisHat = new THREE.Vector3().crossVectors(lateralHat, normalHat);
    // 适配层：把平截面从 (frame.x, frame.z) 换到 (x̂_t, n̂) 这张平面里，再交给**未改动的**内核。
    const sample2 = (v) => {
      const flat = sample(v);
      const displacement = frame.x.clone().multiplyScalar(flat.lateral).addScaledVector(frame.z, flat.normal);
      return { lateral: displacement.dot(lateralHat), normal: displacement.dot(normalHat) };
    };
    const bent = panelBendCrossSection(sample2, target, k);
    // 沿弯曲轴的分量**原样携带** —— 这就是 bend 的定义（点只在垂直于轴的平面内移动）。
    // 保长后果：内核逐段保**面内**长度，而 residual(v) 弯前弯后逐位相同 ⇒ 每段的完整 3D 长度
    // `sqrt(面内² + Δresidual²)` 在**内核自己的分段**上守恒。
    // **但这不等于「UV 的 U 不变」，勿据此以为 U 是安全的**：同一条错误在 0.2.138 的注释里已经
    // 犯过一次（那处已自我更正，见 curve-math「我曾在此断言…那是**错的**」）。uv-unfold 的 U 由
    // **row 0 在网格顶点之间**的弦长累加得出，而网格顶点间距是内核分段的**再一次**离散化：本轮
    // 实测 row-0 弦长和比值 amount=0.5 ⇒ 0.9994、0.87 ⇒ 0.9947、**1 ⇒ 0.9925**，不是 1.000000。
    // U 尺度确实会漂；解法（给 gridUvTable 传**未弯曲**的 referenceCircumference，该参数已在
    // 签名里）属 devlog 已知未解项，本轮不做。
    const flatTarget = sample(target);
    const displacementTarget = frame.x.clone().multiplyScalar(flatTarget.lateral)
      .addScaledVector(frame.z, flatTarget.normal);
    const residual = displacementTarget.dot(axisHat);
    cached = {
      offset: lateralHat.clone().multiplyScalar(bent.lateral)
        .addScaledVector(normalHat, bent.normal)
        .addScaledVector(axisHat, residual),
      // 弯后法向（`angle` = 弯后切向角），厚度沿它放置。
      shellDirection: normalHat.clone().multiplyScalar(Math.cos(bent.angle))
        .addScaledVector(lateralHat, -Math.sin(bent.angle))
    };
    if (cache && cacheKey !== null) cache.set(cacheKey, cached);
  }
  // `shellDirection` 是单位向量（n̂ ⟂ x̂_t 且 cos² + sin² = 1）⇒ front/back 两壳间距恒为
  // thickness，厚度不被剪切成斜的。
  return cached.offset.clone().addScaledVector(cached.shellDirection, shellOffset);
}


// Replicates the panel geometry's section point (rawPanelPoint) on the main panel
// frame, so width controls land on the geometry's real edges (width + depth curves,
// camber and asymmetric centers included).
function tipMainSectionPoint(lock, t, u, shell, bone, segmentIndex = -1, splits = null) {
  const frame = tipPanelFrameAt(lock, t);
  const origin = frame.point.clone();
  const width = tipPanelWidthAt(lock, t, u, bone, segmentIndex, splits);
  const halfWidth = width * 0.5;
  const thickness = Math.max(0.0001, Number(lock.panelThickness ?? 0.08) * sampleAsymmetricTaperCurve(
    bone?.depthCurve || lock.depthCurve,
    bone?.depthCurveSecondary || lock.depthCurveSecondary,
    bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve,
    shell,
    t
  ));
  const centerX = lock.centerAsymmetricProfile && (bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve)
    ? (tipPanelWidthAt(lock, t, 1, bone, segmentIndex, splits) - tipPanelWidthAt(lock, t, -1, bone, segmentIndex, splits)) * 0.25
    : 0;
  const centerZ = lock.centerAsymmetricProfile && (bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve)
    ? (tipPanelWidthAt(lock, t, 1, bone, segmentIndex, splits) - tipPanelWidthAt(lock, t, -1, bone, segmentIndex, splits)) * 0.25
    : 0;
  // 中面截面曲线（含 camber、**不含** shell 厚度），按 v 参数化 —— Scalp Conform 的弧长
  // 参数化需要在 [0, u] 上采样它，所以这段逻辑必须是个函数而不是一次性表达式。
  // A segment's width is measured from ITS OWN center (the tip sub-bone): the lateral
  // extent is (u - centerU) plus a constant alignment so the segment center sits where
  // the main panel puts it (zipper walls stay flush). The camber stays on the GLOBAL
  // profile, so the tip WidthCurve only changes the width (lateral), and dragging the
  // control moves it along the tip sub-bone's width axis - not the main bone's line.
  const midAt = (v) => {
    const halfWidthAtV = tipPanelWidthAt(lock, t, v, bone, segmentIndex, splits) * 0.5;
    let camber = Number(lock.panelCurvature ?? 0.18) * halfWidthAtV * (1 - v * v);
    let lateralU = v;
    let lateralCenter = 0;
    if (segmentIndex >= 0 && splits && splits.length) {
      const boundaries = [-1, ...splits.map((split) => split.position), 1];
      if (segmentIndex < boundaries.length - 1) {
        const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
        const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
        lateralU = v - centerU;
        lateralCenter = centerU * fullWidth * tipWidthMultiplierAt(lock, t, centerU, null, -1, splits) * 0.5;
        camber = Number(lock.panelCurvature ?? 0.18) * fullWidth * tipWidthMultiplierAt(lock, t, v, null, -1, splits) * 0.5 * (1 - v * v);
      }
    }
    return {
      lateral: lateralU * halfWidthAtV + lateralCenter + centerX * profileTopologyCenterWeight(v, -1, 1),
      normal: camber
    };
  };
  const mid = midAt(u);
  const shellOffset = shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1);
  // Scalp Conform（0.2.139 弧长参数化 Bend）：camber 已折进 midAt 的截面曲线，弯曲**严格
  // 保弧长**（离散逐段保长）。amount == 0 时 offsets 为 null ⇒ 走下面的原表达式。
  // **那条原表达式刻意写成 `mid.normal + shell*… + centerZ*…` 而不复用 shellOffset**：
  // 左结合顺序必须与 0.2.138 前逐字节一致，否则 `amount==0` 的逐位守恒契约会在末位破掉。
  const conform = panelScalpConformParams(lock);
  // 传**整个 frame**（不是 frame.x）：弯曲平面与半径要由 frame.point 相对头心的位置推出。
  // 把手侧无 per-build memo（ad-hoc 调用），故 cache/cacheKey 传 null。
  const offsets = panelScalpConformOffsets(conform, midAt, u, shellOffset, null, null, frame);
  if (offsets) return origin.clone().add(offsets);
  return origin.clone()
    .addScaledVector(frame.x, mid.lateral)
    .addScaledVector(
      frame.z,
      mid.normal + shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1)
    );
}

// 发尖子骨骼表面帧：在段中心 u=centerU 处用面板几何（含 camber/曲率）计算真正
// 垂直于面板表面的法线（z）与位于表面切平面内的横向（x），而不是沿用主骨骼
// 法线。rest 链与 tipChainFrameAt 共用，让发尖子骨骼跟随主发片构建曲线的表面
// 曲率（弯曲刘海侧面与主面板法线出现明显夹角，宽度拖拽也沿表面切平面）。
function tipOffsetSampleT(lock, t, u) {
  const tipCurve = lock.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Number(lock.panelTipCurve ?? 0), -1, 1);
  const edgeTrim = THREE.MathUtils.lerp(
    THREE.MathUtils.clamp(Number(lock.panelLeftEdgeTrim ?? 0), 0, 0.75),
    THREE.MathUtils.clamp(Number(lock.panelRightEdgeTrim ?? 0), 0, 0.75),
    (THREE.MathUtils.clamp(u, -1, 1) + 1) * 0.5
  );
  return panelTipCurveParameter(THREE.MathUtils.clamp(t, 0, 1), THREE.MathUtils.clamp(u, -1, 1), tipCurve, edgeTrim);
}

// `bone` 是**可选**形参（默认 null），这不是疏忽而是契约：三个调用点里只有一个该传它。
//   ① bone-view-handles 的 panelTipClumpHandlePoint（Tip Clump 绿球）**必须传** —— 它取的
//      是该段真实边缘，须与网格同吃该段自己的 taperCurve/depthCurve；不传则
//      tipMainSectionPoint 内部的 `bone?.taperCurve || lock.taperCurve` 回退到**全局**曲线，
//      用户拖过该段曲线后绿球与网格出现残余偏差（0.2.146 bug② 的成因）。
//   ② tipChainFrameAt（本文件）**刻意不传**：它只取 frame 的 z 作参考法线，段曲线只会
//      让参考法线随该段宽度轻微倾斜，而该 frame 同时服务 rest 与 authored 两个空间 ——
//      传 bone 会让 rest 侧的参考法线依赖 authored 数据，把 ③ 的循环依赖引到这里。
//   ③ splitTipForSegment 的 restPointAt（本文件 L1017）**绝不能传**：它**定义** rest 链，
//      而 bone 的曲线是 authored 数据。让 rest 依赖 authored ⇒ rest 随用户拖曲线而漂移 ⇒
//      materializeTipChain 的 delta（points − restPoints）基准跟着动 = 循环依赖，症状是
//      「拖完曲线发尖自己跑掉」（与 0.2.120 修掉的「一动就跳回原位」同类）。
function tipSurfaceFrameAt(lock, t, centerU = null, segmentIndex = -1, splits = null, bone = null) {
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  const center = centerU == null
    ? (segmentIndex >= 0 && segmentIndex < boundaries.length - 1
      ? (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5
      : 0)
    : centerU;
  const sampleT = tipOffsetSampleT(lock, t, center);
  const panel = tipPanelFrameAt(lock, sampleT);
  const y = panel.y;
  // 沿 u 差分采样面板表面点（front face）得到截面切线 dP/du；camber 会让截面
  // 切线偏离 frame.x，从而法线也相应倾斜，贴合实际面板曲面。
  // 半球隆起**刻意不在此处显式处理**：两个差分点都走 tipMainSectionPoint，隆起已
  // 含在其中 ⇒ 球冠沿 u 的变化自动进入 dP/du，法线随隆起倾斜（这正是想要的：
  // 拱起后的表面法线应垂直于拱面）。在此另加一项等于把隆起算两次。
  const step = THREE.MathUtils.clamp((boundaries[1] - boundaries[0]) * 0.2, 0.01, 0.04);
  const lower = tipMainSectionPoint(lock, sampleT, THREE.MathUtils.clamp(center - step, -1, 1), 1, bone, segmentIndex, splits);
  const upper = tipMainSectionPoint(lock, sampleT, THREE.MathUtils.clamp(center + step, -1, 1), 1, bone, segmentIndex, splits);
  const sectionTangent = new THREE.Vector3().subVectors(upper, lower);
  if (!Number.isFinite(sectionTangent.x) || sectionTangent.lengthSq() < 1e-8) sectionTangent.copy(panel.x);
  else sectionTangent.normalize();
  let z = new THREE.Vector3().crossVectors(y, sectionTangent).negate();
  z.addScaledVector(y, -z.dot(y));
  if (z.lengthSq() < 0.0001) z.copy(panel.z);
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  const point = tipMainSectionPoint(lock, sampleT, center, 1, bone, segmentIndex, splits);
  return { point, x, y, z };
}

// 发尖子骨骼链在 t 处的自身 frame：y = 链切线（authored），z = 面板表面法线经
// rest→authored 弯曲旋转后对 y 做 Gram-Schmidt 正交化的链自身法线，x = 链横向
// （副法线）。宽度控制点的移动方向应垂直于发尖子骨骼自身法线（x 横向），而不是
// 被主骨骼法线限制。segment 段中心使用 tipSurfaceFrameAt（垂直于面板表面、含
// camber/曲率），非 segment 回退 tipPanelFrameAt。
function tipChainFrameAt(lock, tip, restTip, t, segmentIndex = -1, splits = null) {
  const panel = tipPanelFrameAt(lock, t);
  // 段中心处用面板表面帧（垂直于面板表面、含 camber/曲率）作为参考法线，而不是
  // 直接沿用主面板法线：发尖子骨骼的横向/法线跟随主发片构建曲线的表面曲率。
  const referenceZ = (segmentIndex >= 0 && Array.isArray(splits) && splits.length)
    ? tipSurfaceFrameAt(lock, t, null, segmentIndex, splits).z
    : panel.z;
  // Delegate to the strand-agnostic tip-sub-bone primitive: y = authored chain
  // tangent, z = reference normal rotated by the rest->authored bend (Gram-Schmidt
  // against y), x = lateral (binormal). Accepts plain {x,y,z} chain points.
  return tipSubBoneTipChainFrameAt(restTip, tip, t, referenceZ);
}

// ── 发尖链再锚定（0.2.146 bug①）：把手渲染坐标必须跟随 bone.tip ─────────────────────
// 与发丝侧 strand-tip-width.js 的 strandTipChainTransformAt / applyStrandTipChainTransform
// （0.2.127 的同一个 bug）成对同构，**刻意分两个函数**：一次取变换、多个点（point /
// center / 引导线采样）复用同一份，避免每点重算 CatmullRom 与四元数。
//
// 这条变换是 createPanelStrandGeometry → addPatch 的**逐字同构副本**（同步点，改一处必须
// 改两处）：
//   dq          = setFromUnitVectors(restTangent, authoredTangent)（反向退化时绕轴 π）
//   dqRoll      = twist 非零时再绕 authoredTangent 滚转（tip.twists）
//   transformed = (point − reference)·dq + authoredCenter
//   final       = lerp(point, transformed, blend)
// reference 取该段中心点（addPatch 的 sectionCenter），authoredCenter/restCenter 取物化链
// 的 CatmullRom 采样（addPatch 的 tipCurve/tipRestCurve.getPoint(t)）。
//
// **坐标空间**：本函数消费的 worldPoint 必须是「已 conform 的主帧世界点」——即
// tipMainSectionPoint 的输出（网格侧对应 addPatch 里 panelPoint 的输出）。reference 必须与
// worldPoint 走**同一个采样器**，否则 (point − reference) 不再是纯截面内偏移。
//
// 返回 null ⇒ 无 authored 发尖链 ⇒ 调用方必须走与 6d4e9b0 逐字节相同的老路径（保住那一版
// 的 conform 贴合成果）。门控与 addPatch 的 `tip && tip.points.length >= 2` 逐字对应，外加
// materializeTipChain 对「无 authored tip」也会返回等于 rest 的链，故必须另查 active。
function tipChainReanchorAt(lock, segmentIndex, splits, bone, t) {
  const tip = splitTipForSegment(lock, segmentIndex, splits, bone);
  if (!tip || !Array.isArray(tip.points) || tip.points.length < 2) return null;
  if (tip.active === false) return null;
  if (!bone?.tip || bone.tip.active === false) return null;
  const authoredCurve = new THREE.CatmullRomCurve3(tipChainPointsAsVectors(tip.points));
  const restCurve = (Array.isArray(tip.restPoints) && tip.restPoints.length >= 2)
    ? new THREE.CatmullRomCurve3(tipChainPointsAsVectors(tip.restPoints))
    : authoredCurve;
  const authoredCenter = authoredCurve.getPoint(t);
  const authoredTangent = authoredCurve.getTangent(t).normalize();
  const restTangent = restCurve.getTangent(t).normalize();
  // 反向退化（切线几乎正相反）时 setFromUnitVectors 的轴不确定 ⇒ 显式绕一条与 restTangent
  // 不平行的轴转 π。判据 −0.9999 与轴的选择逐字取自 addPatch，勿改成别的阈值。
  const dq = restTangent.dot(authoredTangent) < -0.9999
    ? (new THREE.Quaternion()).setFromAxisAngle(
      Math.abs(restTangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0),
      Math.PI
    )
    : (new THREE.Quaternion()).setFromUnitVectors(restTangent, authoredTangent);
  const twist = Array.isArray(tip.twists) ? sampleArray(tip.twists, t) : 0;
  const dqRoll = Math.abs(twist) > 1e-6
    ? (new THREE.Quaternion()).setFromAxisAngle(authoredTangent, twist).multiply(dq)
    : dq;
  return { authoredCenter, restCenter: restCurve.getPoint(t), dq: dqRoll };
}

// 把一个「已 conform 的主帧世界点」按上面的链变换搬过去。reference 为 null 时回退
// restCenter（与 addPatch 的 `sectionCenter || tipTransform.restCenter` 逐字对应）。
function applyTipChainReanchor(transform, reference, worldPoint, blend) {
  if (!transform || !(blend > 0)) return worldPoint.clone();
  const base = reference || transform.restCenter;
  const transformed = worldPoint.clone().sub(base).applyQuaternion(transform.dq).add(transform.authoredCenter);
  return worldPoint.clone().lerp(transformed, blend);
}

// 面板的行参数表（沿曲线的 t 序列）。**唯一定义点**：createPanelStrandGeometry 的
// rowParameters 与把手侧的 blend 分母都从这里取，两处不同源会让把手与网格用不同的 blend
// 起点、在 fork 附近错位。钳位区间 [3,32] / [0,16] 是既有值，逐字保留。
function panelRowParameters(lock) {
  const baseLengthLoops = THREE.MathUtils.clamp(Math.round(lock.panelLengthLoops ?? 10), 3, 32);
  const tipLoops = THREE.MathUtils.clamp(Math.round(lock.panelTipLoops ?? 0), 0, 16);
  return panelTipLoopParameters(baseLengthLoops, tipLoops);
}

// 网格的行细分数（addPatch 的 blend 分母）。
function panelLengthLoopCount(lock) {
  return panelRowParameters(lock).length - 1;
}

// 绿色 WidthCurve 手柄 / 引导线的**渲染坐标**（0.2.146 起唯一定义点，原先内联在
// bone-view-handles.js 的 panelWidthEdgeRenderPoint）。两步，缺一个就是一个已修过的 bug：
//   ① conform：走 tipMainSectionPoint —— 与网格 rawPanelPoint 同一条已 conform 坐标
//      （6d4e9b0 修的就是这一步；tipWidthEdgePosition 的线性外推不吃 conform）；
//   ② 再锚定：rest→authored 的链变换 —— 与 addPatch 同款公式（本轮 bug① 修的这一步；
//      6d4e9b0 换公式时把它丢了，导致「网格跟着 bone.tip 动、绿点不动」）。
// edgeU 的推导（zipper 收窄 spreadGap）逐字取自 tipWidthEdgePosition：拖拽数学读的仍是
// tipWidthControlPlacement 的原始点，两者必须用同一个 u。
// **拖拽（bone-interaction.js）刻意不改**：宽度拖拽是比值运算（ratio =
// latOffset/startLatOffset，起点 ratio==1 不跳变），故渲染先修不会导致起手瞬间跳变。
function tipWidthEdgeRenderPoint(lock, segmentIndex, splits, bone, side, t) {
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  const spreadGap = tipWidthSpreadGap(lock, segmentIndex, splits, bone, t, side);
  const edgeU = side < 0
    ? boundaries[segmentIndex] + spreadGap
    : boundaries[segmentIndex + 1] - spreadGap;
  const point = tipMainSectionPoint(lock, t, edgeU, 1, bone, segmentIndex, splits);
  // 段号越界时**刻意不提前 return null**：0.2.146 前这里是内联表达式，越界只会产出 NaN 点、
  // 由上游（tipWidthControlPlacement 的 sideForkT 守卫）拦住。改成返回 null 会让调用方的
  // `{...placement, point: null}` 把一个本来可见的手柄变成崩溃点，属于夹带的行为变更。
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return point;
  const transform = tipChainReanchorAt(lock, segmentIndex, splits, bone, t);
  if (!transform) return point;
  // blend 与 reference 都必须与网格同源：blend 用 edgeU（网格逐顶点也用该顶点自己的 u），
  // reference 用段中心点且**与 point 同一个采样器**（tipMainSectionPoint）。
  const blend = tipSegmentBlendAt(lock, segmentIndex, splits, t, edgeU, panelLengthLoopCount(lock));
  if (!(blend > 0)) return point;
  const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
  const reference = tipMainSectionPoint(lock, t, centerU, 1, bone, segmentIndex, splits);
  return applyTipChainReanchor(transform, reference, point, blend);
}

// Edge position of a tip side at chain parameter t, matching the geometry's own tip
// transform (rest identity preserved). The width is measured from the TIP sub-bone
// chain (the segment center), so the handle sits on the mesh edge AND moves along the
// tip's own lateral when the width changes - not along the main-bone line.
// 半球隆起**刻意不在本函数（及 tipWidthControlPlacement）里显式处理**：把手位置的基准
// 是 splitTipForSegment 的链点，而该链的 rest 已由 tipSurfaceFrameAt → tipMainSectionPoint
// 含入隆起 ⇒ 绿色宽度把手自动落在拱起后的真实边缘上。在此另加一项会把隆起算两次、
// 让把手浮到面板表面之外（该 bug 类见 devlog/bug-fixes.md #25）。
function tipWidthEdgePosition(lock, segmentIndex, splits, bone, side, t) {
  const tip = splitTipForSegment(lock, segmentIndex, splits, bone);
  if (!tip || tip.points.length < 2 || !tip.restPoints || tip.restPoints.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(tipChainPointsAsVectors(tip.points));
  const authoredCenter = curve.getPoint(t);
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return null;
  // The segment's tip-narrowing gap moves the edge inward as spread grows; the handle
  // and its width sample follow the same u the geometry's uStart/uEnd use (centerU
  // stays symmetric because the gap is equal on both sides).
  const spreadGap = tipWidthSpreadGap(lock, segmentIndex, splits, bone, t, side);
  const edgeU = side < 0
    ? boundaries[segmentIndex] + spreadGap
    : boundaries[segmentIndex + 1] - spreadGap;
  const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
  // 把手位置沿发尖链自身横向（tipChainFrameAt.x）：发尖链中心 + 链横向 × 半宽，
  // 使宽度拖拽的运动轨迹垂直于发尖子骨骼自身法线（不再被主骨骼法线限制）。
  const chainFrame = tipChainFrameAt(lock, tip, tip, t, segmentIndex, splits);
  const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
  const multiplier = tipWidthMultiplierAt(lock, t, edgeU, bone, segmentIndex, splits);
  const point = authoredCenter.clone()
    .addScaledVector(chainFrame.x, (edgeU - centerU) * fullWidth * multiplier * 0.5);
  // Drag axis: the tip chain's lateral oriented toward this side's edge, so the handle
  // tracks the cursor along the tip's own width line.
  let lateral = chainFrame.x.clone();
  if ((edgeU - centerU) < 0) lateral.negate();
  return { point, center: authoredCenter.clone(), lateral, t };
}

// Width-curve edge points for a tip side: the exposed (below-zipper) segment edge from
// the side's fork to the tip, following the tip sub-bone's frame.
function tipWidthEdgePoints(lock, segmentIndex, splits, bone, side) {
  const forkT = tipWidthSideForkT(lock, segmentIndex, splits, side);
  if (forkT >= 1) return [];
  const points = [];
  const count = 24;
  for (let i = 0; i <= count; i += 1) {
    const t = THREE.MathUtils.lerp(forkT, 1, i / count);
    const edge = tipWidthEdgePosition(lock, segmentIndex, splits, bone, side, t);
    if (edge) points.push(edge.point);
  }
  return points;
}

// Viewport placement of a tip width control point: on the exposed chain edge at t,
// following the tip sub-bone's frame (midpoints so the fork point clears the zipper).
function tipWidthControlPlacement(lock, segmentIndex, splits, bone, side, pointIndex) {
  const sideForkT = tipWidthSideForkT(lock, segmentIndex, splits, side);
  if (sideForkT >= 1) return null;
  // INDEX SEMANTICS (scheme a): pointIndex indexes the FULL SHARED GRID
  // (tipWidthGridTs), never the per-side filtered subset. The viewport allocates a fixed
  // array of TIP_WIDTH_CONTROL_POINTS + 1 handles per side (bone-view-handles.js) and
  // looks them up by that same index, so a stable index ↔ chain-parameter mapping is what
  // keeps the handle, its drag (bone-interaction.js) and the curve data addressing the
  // same position on both sides.
  // 数量的非对称性由「暴露判定」表达，而不是由数组长度表达：本侧未暴露的网格位置
  // 返回 null → 视口把对应把手隐藏。因此这条守卫不是安全网，而是实现「按 zipper 高度
  // 动态暴露」的真正机制，并且与 buildTipWidthCurve/tipWidthResetCurve/
  // setTipWidthCurveValue 使用的 tipWidthSideExposesT 是同一个判据（同一定义点）→
  // 「曲线里有 ⇔ 有把手」的不变式成立。
  const positions = tipWidthGridTs(lock, segmentIndex, splits);
  if (pointIndex < 0 || pointIndex >= positions.length) return null;
  const t = positions[pointIndex];
  if (!tipWidthSideExposesT(lock, segmentIndex, splits, side, t)) return null;
  const edge = tipWidthEdgePosition(lock, segmentIndex, splits, bone, side, t);
  if (!edge) return null;
  return { point: edge.point, t: edge.t, center: edge.center, lateral: edge.lateral };
}

function tipHighlightMaterial() {
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = 'attribute float aFade;\nvarying float vFade;\n' + shader.vertexShader.replace(
      '#include <color_vertex>',
      '#include <color_vertex>\n\tvFade = aFade;'
    );
    shader.fragmentShader = 'varying float vFade;\n' + shader.fragmentShader.replace(
      '#include <color_fragment>',
      '#include <color_fragment>\n\tdiffuseColor.a *= vFade;'
    );
  };
  return material;
}

function updateTipHighlight(lock) {
  // lock 可以是 undefined：两个调用点都传 deps.getSelectedLock() 的返回值，而它在
  // 「当前没有选中任何发片」时返回 undefined（bone-interaction.js 的 updatePanelTipHover
  // 有 1225 与 1253 两处，后者在 changed 为真时**无条件**调用，绕过了上面 `if (lock && …)`
  // 那道门）。没有 lock 就没有可高亮的对象 ⇒ 直接返回是正确语义，不是错误。
  // 实测症状：启动时（未选中任何发片）鼠标掠过视口即抛
  // `TypeError: Cannot read properties of undefined (reading 'id')`（用户 0.2.165 真机报的）。
  if (!lock) return;
  const selection = deps.sculptState.tipSelection;
  const hover = deps.sculptState.tipHover;
  const selectedSeg = selection && selection.lockId === lock.id ? selection.segmentIndex : null;
  const hoveredSeg = hover && hover.lockId === lock.id ? hover.segmentIndex : null;
  // ★ 0.2.168：选中中间层时，高亮必须覆盖该层的**整个叶子区间**，不能只亮 tipSelection
  // 指向的那一段。tipSelection.segmentIndex 存的是锚点（leafStart），下面原来的
  // `segment === selectedSeg` 精确比较因此只给 leafStart 那一段的顶点着色 ——
  // 用户报「高亮显示只有一半，选中 L2·Segments 2-3 仅高亮 L3·Segment 2」，实测
  // litVertsByLeafSegment 只有 {1: 22}、段 2 为 0。
  // 判据经 deps 注入（app.js 的 panelBoneGroupSelectionCoversSegment，与 bone-view-handles
  // 的把手高亮**同一个函数**），所以网格高亮与把手高亮不可能再各走一套而分叉。
  // 缺注入时回落到精确比较 ⇒ 与 0.2.167 行为逐字节相同。
  const coversSelected = (segment) => {
    if (selectedSeg == null) return false;
    if (segment === selectedSeg) return true;
    return Boolean(deps.panelBoneGroupSelectionCoversSegment?.(lock, segment));
  };
  // 几何门控从 isPanelGeometry 扩为 segmentBoneHost（0.2.126）：本函数主体**本来就与几何
  // 无关** —— 它只读 geometry.userData.leafWeights（panelWeights 是 panel 侧的旧别名），而
  // createSplitStrandGeometry 早就以逐字段相同的 [mainJoint, leafIndex, weight] stride-3
  // 格式写出同一个 leafWeights（strandSplitWeights 是它的别名）。所以普通发丝的表面高亮
  // 不需要任何新代码，只需要放开这道门。segmentBoneHost 对未开启 split 的发丝返回 null，
  // 故非 split 发丝与此前行为逐字节相同（不高亮）。
  if ((selectedSeg == null && hoveredSeg == null) || !segmentBoneHost(lock) || lock.panelSplitEnabled === false || !lock.curveObjects) {
    if (lock.curveObjects?.tipHighlightMesh) lock.curveObjects.tipHighlightMesh.visible = false;
    return;
  }
  const geometry = lock.mesh?.geometry;
  const position = geometry?.getAttribute?.("position");
  const leafWeights = geometry?.userData?.leafWeights || geometry?.userData?.panelWeights;
  if (!position || !geometry?.index || !leafWeightsValid(leafWeights, position.count)) {
    if (lock.curveObjects?.tipHighlightMesh) lock.curveObjects.tipHighlightMesh.visible = false;
    return;
  }
  let overlay = lock.curveObjects.tipHighlightMesh;
  if (!overlay) {
    overlay = new THREE.Mesh(new THREE.BufferGeometry(), tipHighlightMaterial());
    overlay.renderOrder = 7;
    overlay.frustumCulled = false;
    lock.curveObjects.tipHighlightMesh = overlay;
    lock.curveObjects.group.add(overlay);
  }
  const overlayGeometry = overlay.geometry;
  overlayGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(position.array.slice()), 3));
  const srcIndex = geometry.index.array;
  const indexArray = (srcIndex instanceof Uint8Array || srcIndex instanceof Uint16Array || srcIndex instanceof Uint32Array)
    ? srcIndex.slice()
    : new Uint32Array(srcIndex);
  overlayGeometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
  const selectedOpacity = 0.62;
  const hoverOpacity = 0.34;
  const hoverFadeScale = selectedSeg != null ? hoverOpacity / selectedOpacity : 1;
  const colors = new Float32Array(position.count * 3);
  const fades = new Float32Array(position.count);
  for (let vertex = 0; vertex < position.count; vertex += 1) {
    const w = leafWeightAt(leafWeights, vertex);
    const segment = w.leafIndex;
    const weight = w.weight;
    if (coversSelected(segment) && weight > 0.001) {
      colors[vertex * 3] = 1.0;
      colors[vertex * 3 + 1] = 0.55;
      colors[vertex * 3 + 2] = 0.1;
      fades[vertex] = weight;
    } else if (hoveredSeg != null && segment === hoveredSeg && weight > 0.001) {
      colors[vertex * 3] = 1.0;
      colors[vertex * 3 + 1] = 0.55;
      colors[vertex * 3 + 2] = 0.1;
      fades[vertex] = weight * hoverFadeScale;
    }
  }
  overlayGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  overlayGeometry.setAttribute("aFade", new THREE.BufferAttribute(fades, 1));
  overlay.material.opacity = selectedSeg != null ? selectedOpacity : hoverOpacity;
  overlay.visible = true;
}

// options.ancestorTips（0.2.168）：显式给定「祖先中间层的 tip 数组」，用于中间层自己的链
// —— 那条路径经 splitTipForLeafSpan 传进来的是**合成 splits + 虚拟 vIdx**，vIdx 不是真实叶子
// 下标，内部再按叶子去查祖先会查错层。省略时按 `segmentIndex 是真实叶子下标`自行推导，
// 这对其余**全部**既有调用点（addPatch / bone-view-handles / bone-interaction / 宿主叶子分支）
// 都成立，故它们一行都不用改。
function splitTipForSegment(lock, segmentIndex, splits, splitBone, options = {}) {
  // Tip sub-bone chain mirrors the MAIN BONE topology (same point count), laterally
  // offset to the segment's center (u = segment center). Rest pose = the segment's
  // center line on the base panel; authored edits are stored as absolute points + their
  // rest, so the chain follows the main bone while preserving the user's delta.
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  if (segmentIndex == null || segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return null;
  const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
  const mainCount = Array.isArray(lock.points) ? lock.points.length : 0;
  if (mainCount < 2) return null;
  // 发尖子骨骼 rest 链沿主发片构建曲线在段中心的表面曲率生成（法线垂直于面板
  // 表面、含 camber/曲率），不再沿用主骨骼法线。rest 基准变化后，旧数据的
  // authored delta 会在新 rest 上重新叠加，无需改动 .ahs 文件。
  // Scalp Conform（panelScalpConformParams）**刻意不在此处再加一次**：restPointAt 取的是
  // tipSurfaceFrameAt 的点，而它内部经 tipMainSectionPoint 已经含了收缩位移 ⇒ 这里再加
  // 就会叠加两次。rest 链因此自动跟随收缩（与 camber 的处理方式逐条相同），发尖
  // 的 authored delta 会在新 rest 上重新叠加，存量 .ahs 无需迁移。
  const baseRestPointAt = (t) => tipSurfaceFrameAt(lock, t, centerU, segmentIndex, splits).point;
  // ★ 0.2.168 层级继承：先把祖先中间层的 delta 顶进 rest，再叠加本层自己的 delta。
  //
  // 用户原话：「L3.Segments 2/3 应该是挂在这个中间骨骼下的, 而不是挂在主骨骼下」。
  // 改之前叶子与中间层各自独立从基础面板算 rest，两者只共享主骨骼，所以刷中间层时叶子链
  // 与网格（addPatch 也走本函数）**一动不动**（实测 leaf1/leaf2/meshSumX 三项全部逐字节相同）。
  //
  // 为什么能直接相加：materializeTipChain 的物化式是
  //   points[i] = rest[i] + (authored.points[i] - authored.restPoints[i])
  // 所有链（叶子/中间层/主骨骼）点数恒等于 mainCount，delta 因此**逐下标对齐**、可直接求和。
  // 多层嵌套时由浅到深依次累加，等价于骨骼链上的逐级父子变换。
  // 祖先没有创作过（tip 为 null）⇒ 贡献 0，rest 与改前逐字节相同 ⇒ 存量 .ahs 不迁移。
  const ancestorTips = Array.isArray(options.ancestorTips)
    ? options.ancestorTips
    : ancestorTipsForLeaf(lock, segmentIndex);
  // ★ 0.2.170：继承从「逐点平移」升级为「逐点刚体变换」。
  //
  // 用户原话：「应该表现为作为尖端的整体控制, 就是说我如果orient中间层, 尖端应该按照
  // 中间层的中心骨骼去旋转, 而不是按照自己的尖端骨骼中心旋转」。
  //
  // 为什么旧的纯平移不够：中间层链的 rest 走**span 中心 u**（syntheticSplitsForLeafSpan
  // 折出的合成 boundaries 的中点），叶子链走**自己那片叶子的中心 u**，两者天生有横向
  // 偏移（实测区间 [1,2] 的 lateralU 差 0.316667）。把「中心线那一点的位移」原样加给一个
  // 偏离中心线的叶子，叶子只会被平行搬走 —— 中间层转 90° 时叶子仍保持原朝向、且离轴心
  // 越远错得越多。这就是用户说的「直接应用绝对值」。
  //
  // 刚体式（逐下标 i，由浅到深复合）：
  //   p ← tip.points[i] + dq_i · (p − tip.restPoints[i])
  // 括号内是子点在该层 rest 帧下的**力臂**，dq_i 是该层 rest→authored 的朝向变化。
  //
  // ★ 退化条件是「该层没旋转」而不是「力臂为 0」：dq 为恒等时上式化简成
  //   p + (tip.points[i] − tip.restPoints[i])
  // 对**任意**力臂都精确等于旧公式 ⇒ 只拖动过中间层（未旋转）的存量档逐字节不变。
  // tipRigidStepsFor 正是靠这条在无旋转时返回 null，让该层走原平移分支。
  // 这是恒等式，不是近似，所以不需要为存量档写迁移代码。
  //
  // 为什么能对每个祖先独立取 pivot：ancestorTipsForLeaf 返回的是各节点的**原始创作值**
  // （node.tip，不是物化链），每层的 points/restPoints 都是「该层自己相对自己 rest」的
  // 一对，因此由浅到深依次复合等价于骨骼链的逐级父子变换，不会把更浅祖先的位移算两次。
  const ancestorSteps = ancestorTips.length
    ? ancestorTips.map((tip) => ({ tip, steps: tipRigidStepsFor(tip, mainCount) }))
    : null;
  // 刻意声明在函数内而非模块级：模块级可变状态在本仓有清单在追踪（GLOBAL_LET_INVENTORY），
  // 且同一 lock 的多条链会并发物化，共享一个模块级临时向量会串味。
  const rigidArm = new THREE.Vector3();
  const restPointAt = ancestorTips.length
    ? (t) => {
      const point = baseRestPointAt(t);
      const index = Math.round(t * Math.max(1, mainCount - 1));
      for (const { tip, steps } of ancestorSteps) {
        if (steps) {
          const step = steps[index];
          if (!step) continue;
          // 力臂在该层 rest 帧下取，转过 dq 后落到 authored 点上。复用一个临时向量避免
          // 在热路径上逐点 new（本函数每个 t 都会被调用）。
          const armX = point.x - step.pivot.x;
          const armY = point.y - step.pivot.y;
          const armZ = point.z - step.pivot.z;
          rigidArm.set(armX, armY, armZ).applyQuaternion(step.dq);
          point.x = step.translate.x + rigidArm.x;
          point.y = step.translate.y + rigidArm.y;
          point.z = step.translate.z + rigidArm.z;
          continue;
        }
        // 该层未旋转 ⇒ 纯平移，与 0.2.168 逐字节相同。
        const a = tip.points[index];
        const r = tip.restPoints[index];
        if (!a || !r) continue;
        point.x += a.x - r.x;
        point.y += a.y - r.y;
        point.z += a.z - r.z;
      }
      return point;
    }
    : baseRestPointAt;
  const chain = materializeTipChain(splitBone?.tip || null, restPointAt, mainCount);
  // ★ 0.2.169 twist 层级继承：动机与上面 points 的 delta 累加相同（中间层刷 twist 也要带动
  // 叶子），但**不是同一套算法**——materializeTipChain 里 twists 是**绝对值数组**
  // （`Number(authored.twists[i]) || 0`，见 tip-sub-bone.js materializeTipChain），隐含的
  // rest 基线恒为 0，不是 points 那种 `authored.points - authored.restPoints` 的 delta 形式。
  // points 之所以要「先减 rest 再加到新 rest 上」，是因为 authored 点的绝对坐标依赖 rest
  // 基准（换了 rest 基准后必须重新叠加）；twist 从来不依赖任何坐标基准，叶子自己的 twist
  // 与各祖先的 twist 都已经是「绕切线转了多少」这同一个量纲的绝对值，因此层级叠加只需
  // **直接相加**——套用 points 那套减法反而是错的（祖先没有与 twist 对应的 rest 字段可减）。
  // 退化（ancestorTips 为空）直接返回 chain.twists 本身、不包一层恒等映射，与上面
  // restPointAt 的 `: baseRestPointAt` 同一退化写法，保证无祖先时逐字节不变。
  const twists = ancestorTips.length
    ? chain.twists.map((leafTwist, i) => {
      let sum = leafTwist;
      for (const tip of ancestorTips) {
        const ancestorTwists = tip.twists;
        if (!Array.isArray(ancestorTwists) || ancestorTwists.length !== mainCount) continue;
        sum += Number(ancestorTwists[i]) || 0;
      }
      return sum;
    })
    : chain.twists;
  return { restPoints: chain.restPoints, points: chain.points, twists, active: chain.active };
}

// 该叶子的祖先中间层里「已创作过发尖链」的那些，按由浅到深顺序返回其 tip。
// 形状不合法（点数与 restPoints 不匹配）的一律丢弃：与 materializeTipChain 的 authoredValid
// 同一条口径，避免半个链造成错位位移。
// 把一个祖先中间层的链预折成「逐下标的刚体变换」：pivot（该层 rest 上的点）、
// translate（该层 authored 上的同下标点）、dq（rest→authored 的朝向变化，含 twist 滚转）。
//
// ★ 为什么必须预计算而不是在 restPointAt 里现算：restPointAt 是热路径（网格逐顶点、
// 把手逐点、USD 导出都会调），而 dq 只依赖祖先链本身、与被变换的子点无关 ⇒ 每个祖先
// 每个下标只需算一次。现算会在每个 t 上重建两条 CatmullRomCurve3。
//
// ★ 切线估计器刻意与 tipChainReanchorAt 同源（都用 CatmullRomCurve3 的 getTangent）：
// 同一根中间层链会同时被两处消费 —— 这里决定「子链 rest 落在哪」，tipChainReanchorAt
// 决定「网格点重锚到哪」。两处若用不同的切线估计（如这里用有限差分），同一次旋转会
// 得出两个略微不同的朝向，表现为网格与骨骼把手错位。反向退化的阈值 −0.9999 与备用轴
// 的选法也逐字取自那里，勿改成别的值。
function tipRigidStepsFor(tip, mainCount) {
  const pts = tip.points;
  const rest = tip.restPoints;
  if (!Array.isArray(pts) || !Array.isArray(rest)) return null;
  if (pts.length !== mainCount || rest.length !== mainCount) return null;
  const authoredCurve = new THREE.CatmullRomCurve3(tipChainPointsAsVectors(pts));
  const restCurve = new THREE.CatmullRomCurve3(tipChainPointsAsVectors(rest));
  const twists = Array.isArray(tip.twists) && tip.twists.length === mainCount ? tip.twists : null;
  const denom = Math.max(1, mainCount - 1);
  const steps = [];
  let anyRotation = false;
  for (let i = 0; i < mainCount; i += 1) {
    const a = pts[i];
    const r = rest[i];
    if (!a || !r) return null;
    const t = i / denom;
    const authoredTangent = authoredCurve.getTangent(t).normalize();
    const restTangent = restCurve.getTangent(t).normalize();
    const dq = restTangent.dot(authoredTangent) < -0.9999
      ? (new THREE.Quaternion()).setFromAxisAngle(
        Math.abs(restTangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0),
        Math.PI
      )
      : (new THREE.Quaternion()).setFromUnitVectors(restTangent, authoredTangent);
    // twist 也参与刚体变换（用户拍板）。与 chain.twists 的相加**不重复**、是两件互补的事：
    // 相加让叶子**自己的截面**跟着祖先滚（叶子链上每点的朝向），这里的滚转让**偏离
    // 中间层中心线的叶子整体**绕中间层切线划圆（叶子链的位置）。少了后者，中间层
    // 扭转时偏心的叶子只会自转不会公转。构造方式与 tipChainReanchorAt 的 dqRoll 同构。
    const twist = twists ? (Number(twists[i]) || 0) : 0;
    const dqRoll = Math.abs(twist) > 1e-6
      ? (new THREE.Quaternion()).setFromAxisAngle(authoredTangent, twist).multiply(dq)
      : dq;
    // 判「这一层到底有没有转」：w≈±1 的四元数是恒等旋转（含 −1 的双覆盖表示）。
    if (Math.abs(Math.abs(dqRoll.w) - 1) > 1e-9) anyRotation = true;
    steps.push({ pivot: r, translate: a, dq: dqRoll });
  }
  // 该层只平移未旋转 ⇒ 返回 null 让调用方走纯平移路径。这不只是优化：纯平移路径与
  // 0.2.168 逐字节相同，于是「只拖动过中间层、没旋转过」的存量档输出完全不变。
  return anyRotation ? steps : null;
}

function ancestorTipsForLeaf(lock, leafIndex) {
  const root = panelBoneGroupsFor(lock);
  if (!root) return [];
  const ancestors = panelBoneGroupAncestorsForLeaf(root, leafIndex);
  if (!ancestors.length) return [];
  const out = [];
  for (const node of ancestors) {
    const tip = node?.tip;
    if (!tip || !Array.isArray(tip.points) || !Array.isArray(tip.restPoints)) continue;
    if (tip.points.length !== tip.restPoints.length) continue;
    out.push(tip);
  }
  return out;
}

// splitTipForLeafSpan：中间层分组节点（覆盖闭区间 leafStart..leafEnd 的连续叶子）的发尖链。
// 不重新推导几何——把「这一整段区间」交给 syntheticSplitsForLeafSpan 折成一份合成
// splits + 虚拟 segmentIndex（vIdx），再原样喂给上面的 splitTipForSegment：区间内部的
// zipper 被去掉后，splitTipForSegment 自己重算的 centerU 恰好落在区间中心（该推导与真实
// 数字已在 syntheticSplitsForLeafSpan 的模块头注释 + panel-tip-synthetic-splits.test.mjs
// 验证过），rest 链因此天然贴住区间中心线，不是「叶子 leafStart 自己的中心」。
// 退化（leafStart===leafEnd，单叶子）：syntheticSplitsForLeafSpan 在此情形返回同一份
// splits 引用、vIdx===leafStart，本函数因此与既有 splitTipForSegment(lock, leafStart,
// splits, groupBone) 逐字节等价——不是本函数的特例分支，是它的自然退化，不必另写 if。
// groupBone 的 tip 字段形状与 splitBone.tip 一致（{points, restPoints, twists, active}，
// 见 panel-bone-groups.js 的 panelBoneGroupTip / normalizeGroupTip），materializeTipChain
// 只看形状、不关心它挂在叶子 bone 还是分组节点上。
function splitTipForLeafSpan(lock, leafStart, leafEnd, splits, groupBone, groupPath) {
  const { splits: synthSplits, vIdx } = syntheticSplitsForLeafSpan(splits, leafStart, leafEnd);
  // 中间层自己也可能嵌在更浅的中间层下（L3 挂在 L2 下），所以它同样要继承祖先 delta。
  // 但**不能**让内部按 vIdx 去查：vIdx 是合成 splits 里的虚拟下标，不是真实叶子。
  // 这里按该层自己的 groupPath 取严格祖先（不含自己），与叶子那侧同一个语义。
  // groupPath 缺省（既有调用点未传）⇒ 传空数组显式关掉推导，行为与 0.2.167 逐字节相同。
  const ancestorTips = Array.isArray(groupPath) && groupPath.length > 1
    ? ancestorTipsForGroupPath(lock, groupPath)
    : [];
  return splitTipForSegment(lock, vIdx, synthSplits, groupBone, { ancestorTips });
}

// 与 ancestorTipsForLeaf 同构，但入口是分组路径而不是叶子下标：取 path 的**严格前缀**所指
// 的各级节点（不含 path 自己、不含根），过滤出创作过且形状合法的 tip。
function ancestorTipsForGroupPath(lock, groupPath) {
  const root = panelBoneGroupsFor(lock);
  if (!root) return [];
  const out = [];
  let node = root;
  for (let i = 0; i < groupPath.length - 1; i += 1) {
    node = node.children?.[groupPath[i]];
    if (!node) break;
    const tip = node.tip;
    if (!tip || !Array.isArray(tip.points) || !Array.isArray(tip.restPoints)) continue;
    if (tip.points.length !== tip.restPoints.length) continue;
    out.push(tip);
  }
  return out;
}

function createPanelStrandGeometry(lock) {
  lock._tipWidthFrames = null; // the width-UI frame cache depends on the rebuilt points
  const latticeControlled = lock.geometryType === "surface";
  const curve = latticeControlled ? null : deps.strandGeometryCurve(lock);
  // 行参数表走 panelRowParameters（唯一定义点）：把手侧的 blend 分母取自同一个函数，
  // 否则把手与网格会在 fork 上方的渐变带里错位。原先这三行内联在此处。
  const rowParameters = panelRowParameters(lock);
  const lengthLoops = rowParameters.length - 1;
  const widthLoops = THREE.MathUtils.clamp(
    Math.round(lock.panelWidthLoops ?? 6),
    latticeControlled ? 2 : 3,
    24
  );
  const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
  const baseThickness = Math.max(0.001, Number(lock.panelThickness ?? 0.08));
  const curvature = Number(lock.panelCurvature ?? 0.18);
  const leftEdgeTrim = THREE.MathUtils.clamp(Number(lock.panelLeftEdgeTrim ?? 0), 0, 0.75);
  const rightEdgeTrim = THREE.MathUtils.clamp(Number(lock.panelRightEdgeTrim ?? 0), 0, 0.75);
  const tipCurve = latticeControlled ? 0 : THREE.MathUtils.clamp(Number(lock.panelTipCurve ?? 0), -1, 1);
  // 收缩参数一次读好（panelScalpConformParams 是本文件的唯一定义点，surface 恒 0）。
  const conform = panelScalpConformParams(lock);
  // 弯后截面的 per-build memo。**必须每次重建新建一个**：截面依赖 lock 的当前参数，跨重建
  // 复用会拿到上一版几何。生命周期到本函数返回即止（局部变量，随之被 GC）。
  const bendSectionCache = conform.amount === 0 ? null : new Map();
  const splitEnabled = lock.panelSplitEnabled !== false;
  const splits = splitEnabled
    ? deps.normalizePanelSplits(lock.panelSplits, lock.panelSplitHeight, widthLoops - 1).filter((split) => split.height > 0.005)
    : [];
  // One split sub-bone per segment (segments = splits + 1). Derived defaults when not
  // authored; each bone carries per-segment width/depth curves + a relative tip gap
  // (spread) that replaces the old absolute panelSplitGap displacement.
  const splitBones = splits.length ? cloneSplitBones(lock.splitBones, splits, lock) : [];
  const boundaries = [-1, ...splits.map((split) => split.position), 1];
  // Per-vertex leaf weights are strict capture ownership, not a viewport blend:
  // [mainJointIndex, segmentIndex, 0|1]. Render deformation uses segmentBlendAt.
  const panelWeights = [];
  const mainPointCount = latticeControlled ? 0 : lock.points.length;
  const segmentWeightAt = (segment, t, u) => tipSegmentWeightAt(lock, segment, splits, t, u);
  const segmentBlendAt = (segment, t, u) => tipSegmentBlendAt(lock, segment, splits, t, u, lengthLoops);
  const frames = [];
  let previousFrame = null;
  if (!latticeControlled) {
    for (let row = 0; row <= lengthLoops; row += 1) {
      previousFrame = deps.strandGeometryFrameAt(lock, curve, rowParameters[row], previousFrame);
      frames.push(previousFrame);
    }
  }

  const positions = [];
  const uvs = [];
  const colors = [];
  const gridRowsArr = [];
  const gridColsArr = [];
  const indices = [];
  const quadFaces = [];
  const triangleEdgeMasks = [];
  const addQuad = (a, b, c, d, reverse = false) => {
    // Skip degenerate (collapsed) quads: coincident corners produce zero-area faces
    // whose two triangles get opposite normals - visible as a triangle/crease artifact
    // (the split-opening wall/cap quads that taper to a point at the panel tip).
    const near = (i, j) => {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      return dx * dx + dy * dy + dz * dz < 1e-10;
    };
    if (near(a, b) || near(a, c) || near(a, d) || near(b, c) || near(b, d) || near(c, d)) return;
    // Reflex-folded quads (the two triangles end up nearly coplanar but on opposite
    // sides of the shared diagonal) read as a broken triangle in the shading. They are
    // degenerate flaps at the split-opening walls where the panel tapers to a sliver,
    // so skip them like collapsed quads.
    if (a !== b && b !== c && c !== d && a !== c && b !== d) {
      const pa = new THREE.Vector3(positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2]);
      const pb = new THREE.Vector3(positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]);
      const pc = new THREE.Vector3(positions[c * 3], positions[c * 3 + 1], positions[c * 3 + 2]);
      const pd = new THREE.Vector3(positions[d * 3], positions[d * 3 + 1], positions[d * 3 + 2]);
      const n1 = new THREE.Vector3().subVectors(pb, pa).cross(new THREE.Vector3().subVectors(pc, pa)).normalize();
      const n2 = new THREE.Vector3().subVectors(pc, pa).cross(new THREE.Vector3().subVectors(pd, pa)).normalize();
      if (n1.dot(n2) < -0.999) return;
    }
    if (reverse) {
      indices.push(a, c, b, a, d, c);
      quadFaces.push([a, b, c, d]);
      triangleEdgeMasks.push([1, 1, 0], [1, 0, 1]);
    } else {
      indices.push(a, b, c, a, c, d);
      quadFaces.push([a, d, c, b]);
      triangleEdgeMasks.push([1, 0, 1], [1, 1, 0]);
    }
  };
  const panelWidthAt = (t, side, bone, segment = -1) => {
    // Tip width is sampled from the TIP sub-bone frame (segment center) below the fork;
    // above the fork the global panel curve applies. Shared with the viewport handles.
    return Math.max(0.0001, fullWidth * tipWidthMultiplierAt(lock, t, side, bone, segment, splits));
  };
  const panelThicknessAt = (t, side, bone) => {
    return Math.max(0.0001, baseThickness * sampleAsymmetricTaperCurve(
      bone?.depthCurve || lock.depthCurve,
      bone?.depthCurveSecondary || lock.depthCurveSecondary,
      bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve,
      side,
      t
    ));
  };
  const panelFrameAt = (t) => {
    const parameter = THREE.MathUtils.clamp(t, 0, 1);
    let upperIndex = rowParameters.findIndex((rowParameter) => rowParameter >= parameter);
    if (upperIndex < 0) upperIndex = lengthLoops;
    const lowerIndex = Math.max(0, upperIndex - 1);
    const interval = Math.max(0.000001, rowParameters[upperIndex] - rowParameters[lowerIndex]);
    const alpha = upperIndex === lowerIndex ? 0 : (parameter - rowParameters[lowerIndex]) / interval;
    const lower = frames[lowerIndex];
    const upper = frames[upperIndex];
    const point = curve.getPoint(t);
    const y = curve.getTangent(t).normalize();
    const upperZ = upper.z.clone();
    if (lower.z.dot(upperZ) < 0) upperZ.negate();
    let z = lower.z.clone().lerp(upperZ, alpha).projectOnPlane(y);
    if (z.lengthSq() < 0.0001) z.copy(deps.outwardNormalAtPoint(point, y));
    z.normalize();
    const x = new THREE.Vector3().crossVectors(y, z).normalize();
    z = new THREE.Vector3().crossVectors(x, y).normalize();
    return { point, x, y, z };
  };
  const rawPanelPoint = (sampleT, u, shell, bone = null, segment = -1) => {
    if (latticeControlled) return surfacePanelPoint(lock, sampleT, u, shell);
    const frame = panelFrameAt(sampleT);
    const width = panelWidthAt(sampleT, u, bone, segment);
    const thickness = panelThicknessAt(sampleT, shell, bone);
    const centerX = lock.centerAsymmetricProfile && (bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve)
      ? (panelWidthAt(sampleT, 1, bone, segment) - panelWidthAt(sampleT, -1, bone, segment)) * 0.25
      : 0;
    const centerZ = lock.centerAsymmetricProfile && (bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve)
      ? (panelThicknessAt(sampleT, 1, bone) - panelThicknessAt(sampleT, -1, bone)) * 0.25
      : 0;
    // 中面截面曲线（含 camber、**不含** shell 厚度），按 v 参数化 —— 弧长参数化的 Bend 需要
    // 在 [0, u] 上采样它。同步点：tipMainSectionPoint 的 midAt（宽度把手的截面复刻，同规则）。
    // A segment's width is measured from ITS OWN center (the tip sub-bone): the lateral
    // extent is (u - centerU) plus a constant alignment, and the camber stays on the
    // GLOBAL profile, so width edits move the mesh edge along the tip's own width axis
    // (not the main bone's line) without kinking at the zipper walls.
    const midAt = (v) => {
      const halfWidthAtV = panelWidthAt(sampleT, v, bone, segment) * 0.5;
      let camber = curvature * halfWidthAtV * (1 - v * v);
      let lateralU = v;
      let lateralCenter = 0;
      if (segment >= 0 && segment < boundaries.length - 1) {
        const centerU = (boundaries[segment] + boundaries[segment + 1]) * 0.5;
        lateralU = v - centerU;
        lateralCenter = centerU * fullWidth * tipWidthMultiplierAt(lock, sampleT, centerU, null, -1, splits) * 0.5;
        camber = curvature * fullWidth * tipWidthMultiplierAt(lock, sampleT, v, null, -1, splits) * 0.5 * (1 - v * v);
      }
      return {
        lateral: lateralU * halfWidthAtV + lateralCenter + centerX * profileTopologyCenterWeight(v, -1, 1),
        normal: camber
      };
    };
    const mid = midAt(u);
    const shellOffset = shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1);
    // Scalp Conform（0.2.139 弧长参数化 Bend）：camber 已折进 midAt 的截面曲线，弯曲**严格
    // 保弧长**。amount == 0 ⇒ offsets 为 null ⇒ 走原表达式（conform 在函数外一次算好，不分配）。
    // **原表达式刻意不复用 shellOffset**：左结合顺序必须与 0.2.138 前逐字节一致，否则
    // `amount==0` 的逐位守恒契约会在末位破掉。
    // 弯后（加 shell 之前的）世界偏移与 shell 无关，而本函数按 front/back 各调一次 ⇒ 传
    // per-build 的 memo 砍掉一半积分（实测重复恰好 2.00×）。key 含 sampleT 本身而非 row 索引：
    // sampleT 在 tipCurve≠0 或左右 EdgeTrim 不等时是 u 的函数，用索引会把不同截面混成一份、
    // 静默给出错误几何。新引入的 frame 不必进 key —— 它是 panelFrameAt(sampleT) 的确定性函数。
    // 传**整个 frame**（不是 frame.x）：弯曲平面与半径由 frame.point 相对头心的位置推出。
    const offsets = panelScalpConformOffsets(
      conform,
      midAt,
      u,
      shellOffset,
      bendSectionCache,
      `${sampleT}:${u}:${segment}:${boneToken(bone)}`,
      frame
    );
    if (offsets) return frame.point.clone().add(offsets);
    return frame.point.clone()
      .addScaledVector(frame.x, mid.lateral)
      .addScaledVector(
        frame.z,
        mid.normal + shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1)
      );
  };
  const panelPoint = (row, u, shell, bone = null, segment = -1) => {
    const t = rowParameters[row];
    const edgeTrim = THREE.MathUtils.lerp(leftEdgeTrim, rightEdgeTrim, (u + 1) * 0.5);
    const sampleT = panelTipCurveParameter(t, u, tipCurve, edgeTrim);
    return rawPanelPoint(sampleT, u, shell, bone, segment);
  };
  // Tip sub-bone deformation: the segment follows its guide chain CENTER. At each row t
  // below the fork, the below-zipper region translates by (authored chain point - rest
  // chain point) blended by weight; at rest the delta is exactly zero (no regression).
  // Length and direction come from editing the chain's points.
  const addPatch = (rowStart, rowEnd, uStart, uEnd, columns, options = {}, bone = null, segment = -1) => {
    const rows = rowEnd - rowStart;
    const colBase = Number(options.colBase || 0);
    const hasZipper = Boolean(splits[segment - 1] || splits[segment]);
    const tip = (!latticeControlled && segment >= 0 && hasZipper)
      ? splitTipForSegment(lock, segment, splits, bone)
      : null;
    const tipCurve = tip && tip.points.length >= 2 ? new THREE.CatmullRomCurve3(tipChainPointsAsVectors(tip.points)) : null;
    const tipRestCurve = tip && tip.restPoints && tip.restPoints.length >= 2
      ? new THREE.CatmullRomCurve3(tipChainPointsAsVectors(tip.restPoints))
      : tipCurve;
    const front = [];
    const back = [];
    for (let localRow = 0; localRow <= rows; localRow += 1) {
      const row = rowStart + localRow;
      const t = rowParameters[row];
      const color = deps.strandInfluenceColor(lock, t);
      const mainJoint = mainPointCount ? Math.round(t * (mainPointCount - 1)) : -1;
      const segmentIndex = latticeControlled ? -1 : segment;
      // Sub-bone frame follow: below the fork, the section is translated to the
      // authored chain center AND rotated by the chain's tangent delta (rest ->
      // authored), so orient edits rotate the tip cross-section instead of only
      // sweeping it. Computed once per row; at rest authored==rest => identity.
      let tipTransform = null;
      if (tipCurve) {
        const authoredCenter = tipCurve.getPoint(t);
        const authoredTangent = tipCurve.getTangent(t).normalize();
        const restCenter = tipRestCurve.getPoint(t);
        const restTangent = tipRestCurve.getTangent(t).normalize();
        const dq = restTangent.dot(authoredTangent) < -0.9999
          ? (new THREE.Quaternion()).setFromAxisAngle(
            Math.abs(restTangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0),
            Math.PI
          )
          : (new THREE.Quaternion()).setFromUnitVectors(restTangent, authoredTangent);
        // Orient roll around the authored tangent (tip.twists), so the section's
        // normal can be turned to face the viewport without moving the chain.
        const twist = Array.isArray(tip.twists) ? sampleArray(tip.twists, t) : 0;
        const dqRoll = Math.abs(twist) > 1e-6
          ? (new THREE.Quaternion()).setFromAxisAngle(authoredTangent, twist).multiply(dq)
          : dq;
        tipTransform = { authoredCenter, restCenter, dq: dqRoll };
      }
      // Section reference for the tip transform: the segment-center point (tip sub-bone)
      // in the same tip-relative frame as the section itself. At rest the transform is
      // identity, and once the tip WidthCurve is edited the section scales relative to
      // the TIP sub-bone (segment center), not to the absolute panel center.
      let sectionCenter = null;
      if (tipTransform && segment >= 0) {
        const centerU = (boundaries[segment] + boundaries[segment + 1]) * 0.5;
        sectionCenter = panelPoint(row, centerU, 1, bone, segment);
      }
      const frontRow = [];
      const backRow = [];
      for (let column = 0; column <= columns; column += 1) {
        const u = THREE.MathUtils.lerp(uStart(row), uEnd(row), column / columns);
        // 平直 uv：发尖只切缝不位移——几何位置仍用含 tip 收窄的 u，uv 用 boundaries 平直 u（u 与 row 无关）
        const uFlat = THREE.MathUtils.lerp(boundaries[segment], boundaries[segment + 1], column / columns);
        const weight = segmentWeightAt(segment, t, u);
        const blend = segmentBlendAt(segment, t, u);
        const frontPoint = panelPoint(row, u, 1, bone, segment);
        const backPoint = panelPoint(row, u, -1, bone, segment);
        if (tipTransform && blend > 0) {
          const reference = sectionCenter || tipTransform.restCenter;
          const transformedFront = frontPoint.clone().sub(reference).applyQuaternion(tipTransform.dq).add(tipTransform.authoredCenter);
          frontPoint.lerp(transformedFront, blend);
          const transformedBack = backPoint.clone().sub(reference).applyQuaternion(tipTransform.dq).add(tipTransform.authoredCenter);
          backPoint.lerp(transformedBack, blend);
        }
        frontRow.push(positions.length / 3);
        positions.push(frontPoint.x, frontPoint.y, frontPoint.z);
        gridRowsArr.push(row);
        gridColsArr.push((colBase + column) * 2 + 1);
        uvs.push((uFlat + 1) * 0.5, t);
        colors.push(color.r, color.g, color.b);
        panelWeights.push(mainJoint, segmentIndex, weight);
        backRow.push(positions.length / 3);
        positions.push(backPoint.x, backPoint.y, backPoint.z);
        gridRowsArr.push(row);
        gridColsArr.push((colBase + column) * 2);
        uvs.push((uFlat + 1) * 0.5, t);
        colors.push(color.r, color.g, color.b);
        panelWeights.push(mainJoint, segmentIndex, weight);
      }
      front.push(frontRow);
      back.push(backRow);
    }
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        addQuad(front[row][column], front[row + 1][column], front[row + 1][column + 1], front[row][column + 1]);
        addQuad(back[row][column], back[row][column + 1], back[row + 1][column + 1], back[row + 1][column]);
      }
      const globalRow = rowStart + row;
      if (globalRow >= Number(options.leftWallStartRow ?? rowStart)) {
        addQuad(front[row][0], back[row][0], back[row + 1][0], front[row + 1][0]);
      }
      if (globalRow >= Number(options.rightWallStartRow ?? rowStart)) {
        addQuad(front[row][columns], front[row + 1][columns], back[row + 1][columns], back[row][columns]);
      }
    }
    if (options.capStart) {
      for (let column = 0; column < columns; column += 1) {
        addQuad(front[0][column], front[0][column + 1], back[0][column + 1], back[0][column]);
      }
    }
    if (options.capEnd) {
      const last = rows;
      for (let column = 0; column < columns; column += 1) {
        addQuad(front[last][column], back[last][column], back[last][column + 1], front[last][column + 1]);
      }
    }
  };

  const segmentSpans = boundaries.slice(0, -1).map((boundary, index) => boundaries[index + 1] - boundary);
  const segmentColumns = segmentSpans.map(() => 1);
  const remainingColumns = Math.max(0, widthLoops - segmentColumns.length);
  const fractionalAllocations = segmentSpans.map((span, index) => {
    const exact = remainingColumns * span * 0.5;
    const whole = Math.floor(exact);
    segmentColumns[index] += whole;
    return { index, fraction: exact - whole };
  }).sort((a, b) => b.fraction - a.fraction);
  let unassignedColumns = widthLoops - segmentColumns.reduce((sum, count) => sum + count, 0);
  for (let index = 0; index < unassignedColumns; index += 1) {
    segmentColumns[fractionalAllocations[index % fractionalAllocations.length].index] += 1;
  }
  for (let segment = 0; segment < boundaries.length - 1; segment += 1) {
    const leftSplit = splits[segment - 1] || null;
    const rightSplit = splits[segment] || null;
    const columns = segmentColumns[segment];
    const bone = splitBones[segment] || null;
    const span = segmentSpans[segment];
    // Relative per-segment tip gap: each side opens by at most half the segment's own
    // span times the bone spread (0..1), ramping linearly from the side's zipper to
    // 0.5*spread*span at the tip (shared with the viewport width controls so the
    // green handles sit exactly on the geometry edge). Edge segment outer sides without
    // a zipper mirror the opposite side's zipper so both sides narrow consistently
    // (auto-completion, no UI); only when a segment has no zipper on either side does it
    // stay at the full -1/1 boundary.
    const uStart = (row) => (leftSplit || rightSplit)
      ? boundaries[segment] + tipWidthSpreadGap(lock, segment, splits, bone, rowParameters[row], -1)
      : -1;
    const uEnd = (row) => (leftSplit || rightSplit)
      ? boundaries[segment + 1] - tipWidthSpreadGap(lock, segment, splits, bone, rowParameters[row], 1)
      : 1;
    addPatch(0, lengthLoops, uStart, uEnd, columns, {
      colBase: segmentColumns.slice(0, segment).reduce((sum, count) => sum + count + 1, 0),
      capStart: true,
      capEnd: true,
      leftWallStartRow: leftSplit ? rowParameters.findIndex((parameter) => parameter >= 1 - leftSplit.height) : 0,
      rightWallStartRow: rightSplit ? rowParameters.findIndex((parameter) => parameter >= 1 - rightSplit.height) : 0
    }, bone, segment);
  }

  // Curve-driven panels use X = tangent x outward, which reverses the patch
  // convention. Lattice surfaces already use outward-facing parameter order.
  if (!latticeControlled) {
    for (let index = 0; index < indices.length; index += 3) {
      [indices[index + 1], indices[index + 2]] = [indices[index + 2], indices[index + 1]];
    }
    // Swapping v1/v2 changes which triangle edge each mask entry controls
    // (the diagonal of a quad pair). Keep the masks in sync so the wireframe /
    // topology overlay hides the quad diagonal (otherwise panels read as triangles).
    triangleEdgeMasks.forEach((mask) => { [mask[1], mask[2]] = [mask[2], mask[1]]; });
  }

  const welded = weldPanelGeometryData(positions, uvs, colors, indices, quadFaces, 0.00001, panelWeights, gridRowsArr, gridColsArr);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(welded.positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(welded.uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(welded.colors, 3));
  geometry.setIndex(welded.indices);
  geometry.userData.quadFaces = welded.quadFaces;
  geometry.userData.triangleEdgeMasks = triangleEdgeMasks;
  geometry.userData.panelWeights = welded.weights;
  geometry.userData.leafWeights = welded.weights;
  if (welded.gridRows && welded.gridCols) {
    // Simulated sweep grid indices (AHS_gridRow / AHS_gridCol primvars): row =
    // along-curve row, col = global column across segments (front/back adjacent).
    geometry.userData.gridRowIndices = new Float32Array(welded.gridRows);
    geometry.userData.gridColIndices = new Float32Array(welded.gridCols);
  }
  geometry.computeVertexNormals();
  smoothCoincidentPanelNormals(geometry);
  geometry.computeBoundingSphere();
  return geometry;
}
  return {
    smoothCoincidentPanelNormals,
    weldPanelGeometryData,
    surfaceLatticeSampleVectors,
    surfacePanelPoint,
    splitForkT,
    tipWidthSideForkT,
    tipSegmentWeightAt,
    tipSegmentBlendAt,
    tipWidthCommonForkT,
    tipWidthControlTs,
    tipWidthGridTs,
    tipWidthSideExposesT,
    tipWidthSideControlTs,
    tipWidthSpreadGap,
    tipWidthResetCurve,
    tipWidthMultiplierAt,
    tipPanelWidthAt,
    buildTipWidthCurve,
    setTipWidthCurveValue,
    tipPanelFrameAt,
    // 半球参数/世界尺度的唯一定义点：导出供回归测试按**同一规则**推导期望值
    // （规范禁止把现场数值写死进测试，见 development-standards.md「验收脚本与真实存档解耦」）。
    panelScalpConformParams,
    panelScalpConformOffsets,
    tipMainSectionPoint,
    tipSurfaceFrameAt,
    tipChainFrameAt,
    tipWidthEdgePosition,
    tipWidthEdgePoints,
    tipWidthControlPlacement,
    // 0.2.146 bug①：绿色手柄渲染坐标的唯一定义点（conform + 发尖链再锚定），
    // 与 addPatch 的网格变换同步。视口侧 bone-view-handles.js 只调用、不复制公式。
    tipWidthEdgeRenderPoint,
    tipChainReanchorAt,
    applyTipChainReanchor,
    // 行细分数的唯一定义点（addPatch 的 blend 分母）：导出供回归测试按**同一规则**推导
    // 期望值，而不是把 1/12 之类的现场数字写死进测试。
    panelLengthLoopCount,
    tipHighlightMaterial,
    updateTipHighlight,
    splitTipForSegment,
    splitTipForLeafSpan,
    bakeTierWidthCurve,
    resampleTierCurveToLeaf,
    createPanelStrandGeometry
  };
}
