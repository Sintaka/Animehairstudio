// panel-tip-strand.js - Panel/tip strand geometry & tip sub-bone edit helpers (refactor 3d batch G1).
// Extracted from app.js; coupling injected via createPanelTipStrandApi(deps).
import * as THREE from "three";
import {
  PANEL_SCALP_CONFORM_DEFAULTS,
  PANEL_SCALP_CONFORM_MAX_RANGE,
  capsuleEndNearestSurface,
  panelScalpConformWeight,
  panelTipCurveParameter,
  panelTipLoopParameters,
  profileTopologyCenterWeight,
  sampleArray,
  sampleAsymmetricTaperCurve
} from "./curve-math.js?v=20260910-2";

// 头部代理的兜底参数：与 app.js 的 `scalpSurface = { x:0, y:0.9, z:0, radius:1, scaleXYZ:1 }`
// 同值。**优先用注入的 deps.scalpSurface（真实运行时状态，跟随用户调整头模）**，
// 这里只是它缺失时的兜底（node 测试、或 deps 尚未装配完）。0.2.136 起不再像 0.2.135 那样
// 刻意"不跟随"—— 收缩包裹的落点必须是**真实头皮位置**，跟随才是对的。
const PANEL_SCALP_PROXY_FALLBACK = Object.freeze({
  x: 0, y: 0.9, z: 0, radius: 1, scaleX: 1, scaleY: 1, scaleZ: 1
});
import { sampleSurfaceLattice } from "./surface-lattice.js?v=20260814-12";
import { cloneSplitBones, segmentBoneHost } from "../bones/bone-model.js?v=20260901-1";
import { materializeTipChain, tipChainFrameAt as tipSubBoneTipChainFrameAt } from "./tip-sub-bone.js?v=20260830-1";
import { leafWeightAt, leafWeightsValid } from "./leaf-weights.js?v=20260813-1";
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
  tipWidthSideForkFromHeights
} from "./tip-width-curve.js?v=20260901-1";

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

export function createPanelTipStrandApi(deps) {
  // deps: store proxy (sculptState.state) + app.js helper functions (clonePanelSplits/
  // normalizePanelSplits/strandGeometryCurve/strandGeometryFrameAt/strandInfluenceColor/
  // isPanelGeometry/outwardNormalAtPoint); full list:
  // devlog/in-progress/g1-strand-geometry-refactor-map.md section 4.3.
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

// Shared tip width sampler: above the segment's fork (locked) or without a segment the
// global panel curve applies with the main-panel split (u sign); below the fork the tip's
// OWN WidthCurve applies, split/blended across the segment (centerU +/- half span) so the
// tip width belongs to the tip sub-bone, not the main bone.
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
    bone?.taperCurve || lock.taperCurve,
    bone?.taperCurveSecondary || lock.taperCurveSecondary,
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
  if (!written) return;
  if (side < 0) bone.taperCurveSecondary = buildTipWidthCurve(lock, segmentIndex, splits, bone, -1);
  else bone.taperCurve = buildTipWidthCurve(lock, segmentIndex, splits, bone, 1);
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

// 半球隆起的 lock 读取 + 世界尺度：**本文件内唯一定义点**，rawPanelPoint（几何）与
// tipMainSectionPoint（宽度把手的截面复刻）都必须经它取参数，否则网格鼓起来而把手
// 留在原处（该 bug 类见 devlog/bug-fixes.md #25）。
// 世界尺度取 fullWidth * 0.5（面板半宽）：amount 因此是「相对面板自身尺寸」的比例，
// 同一个滑杆值在大小不同的面板上给出同样的观感；用绝对世界单位会让宽面板隆起不足、
// 窄面板炸开。fullWidth 的下限 0.01 与 createPanelStrandGeometry / tipMainSectionPoint
// 现有的 `Math.max(0.01, Number(lock.width ?? 0.62))` 同规则（同步点：本函数是那条
// 规则在半球尺度上的唯一消费点）。
// geometryType === "surface"（lattice 控制）恒 0：与 panelTipCurve / panelLeftEdgeTrim
// 的既有先例一致（tipOffsetSampleT 与 createPanelStrandGeometry 都在 latticeControlled
// 时把这些强制为 0）—— lattice 面板的形状由控制网格直接决定，程序化形变不适用。
function panelScalpConformParams(lock) {
  const amount = lock?.geometryType === "surface"
    ? 0
    : THREE.MathUtils.clamp(Number(lock?.panelScalpConformAmount ?? 0), -1, 1);
  const proxySource = deps.scalpSurface || PANEL_SCALP_PROXY_FALLBACK;
  // 椭球 → 单位球的三个轴缩放，与 scalp-builder 的 updateScalpSurface 同规则
  // （`scalpSurfaceGroup.scale = radius * scaleXYZ`）。刻意**不读 Object3D 的 matrixWorld**：
  // 几何重建时机比渲染早，那个矩阵可能是脏的；从纯数据推变换永远是当前值。
  const radius = Math.max(0.001, Number(proxySource.radius ?? 1));
  return {
    amount,
    // range 上限走 PANEL_SCALP_CONFORM_MAX_RANGE（唯一定义点在 curve-math.js）：长 ramp 会让
    // 半张面板停在"部分贴合"的中间态、鼓出一个包，是用户报告的挤压根因。旧档的大值在此被
    // 钳回安全区（形状会变，但变的方向是"不再鼓包"）。
    range: THREE.MathUtils.clamp(
      Number(lock?.panelScalpConformRange ?? PANEL_SCALP_CONFORM_DEFAULTS.range),
      0.05,
      PANEL_SCALP_CONFORM_MAX_RANGE
    ),
    gap: THREE.MathUtils.clamp(
      Number(lock?.panelScalpConformGap ?? PANEL_SCALP_CONFORM_DEFAULTS.gap),
      0,
      0.5
    ),
    cylinder: THREE.MathUtils.clamp(
      Number(lock?.panelScalpConformCylinder ?? PANEL_SCALP_CONFORM_DEFAULTS.cylinder),
      0,
      3
    ),
    proxy: {
      cx: Number(proxySource.x ?? 0),
      cy: Number(proxySource.y ?? 0.9),
      cz: Number(proxySource.z ?? 0),
      sx: radius * Math.max(0.001, Number(proxySource.scaleX ?? 1)),
      sy: radius * Math.max(0.001, Number(proxySource.scaleY ?? 1)),
      sz: radius * Math.max(0.001, Number(proxySource.scaleZ ?? 1))
    }
  };
}

// 世界空间收缩位移：给一个**中面**世界点（shell = 0），返回该点朝头部代理收敛的 delta。
// 调用方把同一个 delta 加到 front/back 两个 shell 上 —— **必须如此**，否则两壳各自收到
// 同一张表面上、面板厚度被压成 0（这是本模型最容易踩的坑）。
// 返回 null 表示无位移（amount==0 或权重为 0），让调用方走零分配路径。
function panelScalpConformDelta(params, worldPoint, t) {
  if (!params || params.amount === 0) return null;
  const weight = panelScalpConformWeight(t, params.range);
  if (weight <= 0) return null;
  const { proxy } = params;
  // 世界 → 单位球空间（椭球归一）
  const lx = (worldPoint.x - proxy.cx) / proxy.sx;
  const ly = (worldPoint.y - proxy.cy) / proxy.sy;
  const lz = (worldPoint.z - proxy.cz) / proxy.sz;
  const near = capsuleEndNearestSurface(lx, ly, lz, params.cylinder);
  // 单位球空间 → 世界
  const surfaceX = near.surface.x * proxy.sx + proxy.cx;
  const surfaceY = near.surface.y * proxy.sy + proxy.cy;
  const surfaceZ = near.surface.z * proxy.sz + proxy.cz;
  const axisX = near.axis.x * proxy.sx + proxy.cx;
  const axisY = near.axis.y * proxy.sy + proxy.cy;
  const axisZ = near.axis.z * proxy.sz + proxy.cz;
  // gap 沿**世界空间**的径向（轴上最近点 → 表面点）外推。在世界空间加 gap 而不是在单位球
  // 空间加，是因为 gap 是「离头皮多远」的物理距离；非均匀 scaleXYZ 下单位球空间的等距
  // 并不对应世界等距。
  let gx = surfaceX - axisX;
  let gy = surfaceY - axisY;
  let gz = surfaceZ - axisZ;
  const glen = Math.hypot(gx, gy, gz);
  if (glen > 0.000001) { gx /= glen; gy /= glen; gz /= glen; }
  else { gx = 0; gy = 0; gz = 1; }
  const targetX = surfaceX + gx * params.gap;
  const targetY = surfaceY + gy * params.gap;
  const targetZ = surfaceZ + gz * params.gap;
  // amount = 1 ⇒ 精确落到 target（可测恒等式）；amount < 0 ⇒ 朝反方向推离头皮。
  const k = params.amount * weight;
  return {
    x: (targetX - worldPoint.x) * k,
    y: (targetY - worldPoint.y) * k,
    z: (targetZ - worldPoint.z) * k
  };
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
  let camber = Number(lock.panelCurvature ?? 0.18) * halfWidth * (1 - u * u);
  // A segment's width is measured from ITS OWN center (the tip sub-bone): the lateral
  // extent is (u - centerU) plus a constant alignment so the segment center sits where
  // the main panel puts it (zipper walls stay flush). The camber stays on the GLOBAL
  // profile, so the tip WidthCurve only changes the width (lateral), and dragging the
  // control moves it along the tip sub-bone's width axis - not the main bone's line.
  let lateralU = u;
  let lateralCenter = 0;
  if (segmentIndex >= 0 && splits && splits.length) {
    const boundaries = [-1, ...splits.map((split) => split.position), 1];
    if (segmentIndex < boundaries.length - 1) {
      const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
      const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
      lateralU = u - centerU;
      lateralCenter = centerU * fullWidth * tipWidthMultiplierAt(lock, t, centerU, null, -1, splits) * 0.5;
      camber = Number(lock.panelCurvature ?? 0.18) * fullWidth * tipWidthMultiplierAt(lock, t, u, null, -1, splits) * 0.5 * (1 - u * u);
    }
  }
  const centerX = lock.centerAsymmetricProfile && (bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve)
    ? (tipPanelWidthAt(lock, t, 1, bone, segmentIndex, splits) - tipPanelWidthAt(lock, t, -1, bone, segmentIndex, splits)) * 0.25
    : 0;
  const centerZ = lock.centerAsymmetricProfile && (bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve)
    ? (tipPanelWidthAt(lock, t, 1, bone, segmentIndex, splits) - tipPanelWidthAt(lock, t, -1, bone, segmentIndex, splits)) * 0.25
    : 0;
  const lateralTerm = lateralU * halfWidth + lateralCenter + centerX * profileTopologyCenterWeight(u, -1, 1);
  const normalTerm = camber + shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1);
  const point = origin.clone()
    .addScaledVector(frame.x, lateralTerm)
    .addScaledVector(frame.z, normalTerm);
  // Scalp Conform（0.2.136）：位移在**世界空间**朝头部代理收敛，不再是沿 frame.z 的标量偏移。
  // **delta 必须从「中面点」算**（shell 项归零），再原样加到本 shell 上 —— 若两壳各自朝代理
  // 表面收，它们会收到同一张表面上、面板厚度被压成 0。这是本模型最容易踩的坑。
  // amount == 0 时整段不执行 ⇒ 与引入前逐位相同（零分配路径）。
  const conform = panelScalpConformParams(lock);
  if (conform.amount !== 0) {
    const midPoint = origin.clone()
      .addScaledVector(frame.x, lateralTerm)
      .addScaledVector(frame.z, camber);
    const delta = panelScalpConformDelta(conform, midPoint, t);
    if (delta) point.set(point.x + delta.x, point.y + delta.y, point.z + delta.z);
  }
  return point;
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

function tipSurfaceFrameAt(lock, t, centerU = null, segmentIndex = -1, splits = null) {
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
  const lower = tipMainSectionPoint(lock, sampleT, THREE.MathUtils.clamp(center - step, -1, 1), 1, null, segmentIndex, splits);
  const upper = tipMainSectionPoint(lock, sampleT, THREE.MathUtils.clamp(center + step, -1, 1), 1, null, segmentIndex, splits);
  const sectionTangent = new THREE.Vector3().subVectors(upper, lower);
  if (!Number.isFinite(sectionTangent.x) || sectionTangent.lengthSq() < 1e-8) sectionTangent.copy(panel.x);
  else sectionTangent.normalize();
  let z = new THREE.Vector3().crossVectors(y, sectionTangent).negate();
  z.addScaledVector(y, -z.dot(y));
  if (z.lengthSq() < 0.0001) z.copy(panel.z);
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  const point = tipMainSectionPoint(lock, sampleT, center, 1, null, segmentIndex, splits);
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
  const selection = deps.sculptState.tipSelection;
  const hover = deps.sculptState.tipHover;
  const selectedSeg = selection && selection.lockId === lock.id ? selection.segmentIndex : null;
  const hoveredSeg = hover && hover.lockId === lock.id ? hover.segmentIndex : null;
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
    if (selectedSeg != null && segment === selectedSeg && weight > 0.001) {
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

function splitTipForSegment(lock, segmentIndex, splits, splitBone) {
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
  const restPointAt = (t) => tipSurfaceFrameAt(lock, t, centerU, segmentIndex, splits).point;
  const chain = materializeTipChain(splitBone?.tip || null, restPointAt, mainCount);
  return { restPoints: chain.restPoints, points: chain.points, twists: chain.twists, active: chain.active };
}

function createPanelStrandGeometry(lock) {
  lock._tipWidthFrames = null; // the width-UI frame cache depends on the rebuilt points
  const latticeControlled = lock.geometryType === "surface";
  const curve = latticeControlled ? null : deps.strandGeometryCurve(lock);
  const baseLengthLoops = THREE.MathUtils.clamp(Math.round(lock.panelLengthLoops ?? 10), 3, 32);
  const tipLoops = THREE.MathUtils.clamp(Math.round(lock.panelTipLoops ?? 0), 0, 16);
  const rowParameters = panelTipLoopParameters(baseLengthLoops, tipLoops);
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
    const halfWidth = width * 0.5;
    let camber = curvature * halfWidth * (1 - u * u);
    // A segment's width is measured from ITS OWN center (the tip sub-bone): the lateral
    // extent is (u - centerU) plus a constant alignment, and the camber stays on the
    // GLOBAL profile, so width edits move the mesh edge along the tip's own width axis
    // (not the main bone's line) without kinking at the zipper walls.
    let lateralU = u;
    let lateralCenter = 0;
    if (segment >= 0 && segment < boundaries.length - 1) {
      const centerU = (boundaries[segment] + boundaries[segment + 1]) * 0.5;
      lateralU = u - centerU;
      lateralCenter = centerU * fullWidth * tipWidthMultiplierAt(lock, sampleT, centerU, null, -1, splits) * 0.5;
      // The camber stays on the GLOBAL profile: width edits change only the lateral
      // extent (tip sub-bone), so the edge moves along the tip's width axis.
      camber = curvature * fullWidth * tipWidthMultiplierAt(lock, sampleT, u, null, -1, splits) * 0.5 * (1 - u * u);
    }
    const centerX = lock.centerAsymmetricProfile && (bone?.asymmetricWidthCurve ?? lock.asymmetricWidthCurve)
      ? (panelWidthAt(sampleT, 1, bone, segment) - panelWidthAt(sampleT, -1, bone, segment)) * 0.25
      : 0;
    const centerZ = lock.centerAsymmetricProfile && (bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve)
      ? (panelThicknessAt(sampleT, 1, bone) - panelThicknessAt(sampleT, -1, bone)) * 0.25
      : 0;
    const lateralTerm = lateralU * halfWidth + lateralCenter + centerX * profileTopologyCenterWeight(u, -1, 1);
    const normalTerm = camber + shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1);
    const point = frame.point.clone()
      .addScaledVector(frame.x, lateralTerm)
      .addScaledVector(frame.z, normalTerm);
    // Scalp Conform（0.2.136）：世界空间朝头部代理收敛。**delta 从中面点算**（shell 项归零）
    // 再原样加到本 shell —— 两壳各自收会把厚度压成 0（同步点：tipMainSectionPoint 同名注释）。
    // amount == 0 时整段不执行 ⇒ 与引入前逐位相同（conform 在函数外一次算好，不分配）。
    // sampleT 已含四个 Trim 的切向重参数化，收缩因此活在与扫掠面同一参数空间里
    // （t == 0 处 sampleT 也是 0，根部守卫依然成立）。
    if (conform.amount !== 0) {
      const midPoint = frame.point.clone()
        .addScaledVector(frame.x, lateralTerm)
        .addScaledVector(frame.z, camber);
      const delta = panelScalpConformDelta(conform, midPoint, sampleT);
      if (delta) point.set(point.x + delta.x, point.y + delta.y, point.z + delta.z);
    }
    return point;
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
    panelScalpConformDelta,
    tipMainSectionPoint,
    tipSurfaceFrameAt,
    tipChainFrameAt,
    tipWidthEdgePosition,
    tipWidthEdgePoints,
    tipWidthControlPlacement,
    tipHighlightMaterial,
    updateTipHighlight,
    splitTipForSegment,
    createPanelStrandGeometry
  };
}
