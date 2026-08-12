// panel-tip-strand.js - Panel/tip strand geometry & tip sub-bone edit helpers (refactor 3d batch G1).
// Extracted from app.js; coupling injected via createPanelTipStrandApi(deps).
import * as THREE from "three";
import {
  profileTopologyCenterWeight,
  sampleArray,
  sampleAsymmetricTaperCurve,
  sampleTaperCurve
} from "./curve-math.js?v=20260811-1";
import { sampleSurfaceLattice } from "./surface-lattice.js?v=20260727-5";
import { cloneSplitBones } from "./bone-model.js?v=20260810-1";

// Shared tip width control point count: 5 midpoints (common fork) + the tip end (t=1).
// app.js createCurveObjects reuses this constant for the viewport tip width handles.
export const TIP_WIDTH_CONTROL_POINTS = 5;

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

function weldPanelGeometryData(positions, uvs, colors, indices, quadFaces, tolerance = 0.00001, weights = null) {
  const inverseTolerance = 1 / tolerance;
  const vertexMap = new Map();
  const remap = new Array(positions.length / 3);
  const weldedPositions = [];
  const weldedUvs = [];
  const weldedColors = [];
  const weldedWeights = weights ? [] : null;
  for (let vertex = 0; vertex < remap.length; vertex += 1) {
    const positionOffset = vertex * 3;
    const uvOffset = vertex * 2;
    const key = [
      positions[positionOffset], positions[positionOffset + 1], positions[positionOffset + 2]
    ].map((value) => Math.round(value * inverseTolerance)).join("|");
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
    }
    remap[vertex] = weldedVertex;
  }
  return {
    positions: weldedPositions,
    uvs: weldedUvs,
    colors: weldedColors,
    weights: weldedWeights,
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

function splitForkT(lock, segmentIndex, splits) {
  const leftSplit = splits[segmentIndex - 1] || null;
  const rightSplit = splits[segmentIndex] || null;
  const heights = [leftSplit?.height, rightSplit?.height].filter((height) => height != null);
  return heights.length ? 1 - Math.max(...heights) : 1;
}


// Per-side fork for the tip width control: the left edge is exposed below the LEFT
// zipper (splits[segment-1]), the right edge below the RIGHT zipper (splits[segment]).
// Boundary sides without a zipper fall back to the segment fork (bounded by the other
// side's zipper), so left/right control regions can differ.
function tipWidthSideForkT(lock, segmentIndex, splits, side) {
  const leftZipper = splits[segmentIndex - 1]?.height;
  const rightZipper = splits[segmentIndex]?.height;
  const segmentForkT = 1 - Math.max(leftZipper ?? 0, rightZipper ?? 0);
  if (side < 0) return leftZipper != null ? 1 - leftZipper : segmentForkT;
  return rightZipper != null ? 1 - rightZipper : segmentForkT;
}

// 发尖子骨骼蒙皮权重：每侧以自己 zipper 顶（1-height）为 0 边界，段内按 u 线性
// 插值成斜线，斜线上方（靠根）权重 0（主骨骼 100%），下方线性爬到 1。边缘段
// 只一侧有 zipper 时另一侧镜像同一 fork。
function tipSegmentWeightAt(lock, segmentIndex, splits, t, u, lengthLoops) {
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return 0;
  const leftSplit = splits[segmentIndex - 1] || null;
  const rightSplit = splits[segmentIndex] || null;
  const fallback = leftSplit || rightSplit;
  if (!fallback) return 0;
  const leftFork = leftSplit ? 1 - Number(leftSplit.height ?? 0) : 1 - Number(fallback.height ?? 0);
  const rightFork = rightSplit ? 1 - Number(rightSplit.height ?? 0) : 1 - Number(fallback.height ?? 0);
  const b0 = boundaries[segmentIndex];
  const b1 = boundaries[segmentIndex + 1];
  const localU = THREE.MathUtils.clamp((u - b0) / Math.max(0.0001, b1 - b0), 0, 1);
  const forkT = THREE.MathUtils.lerp(leftFork, rightFork, localU);
  const start = forkT + Math.max(1 / Math.max(1, lengthLoops || 10), 0.02);
  if (forkT >= 1 || t <= start) return 0;
  return THREE.MathUtils.clamp((t - start) / Math.max(0.0001, 1 - start), 0, 1);
}

// All tip width control positions for one side: the 5 midpoints plus the tip end (t=1).
function tipWidthControlTs(forkT) {
  const positions = [];
  for (let i = 0; i < TIP_WIDTH_CONTROL_POINTS; i += 1) {
    positions.push(THREE.MathUtils.lerp(forkT, 1, (i + 0.5) / TIP_WIDTH_CONTROL_POINTS));
  }
  positions.push(1);
  return positions;
}

// The COMMON control fork for a segment: based on the DEEPEST of the two zippers, so
// both sides distribute their width controls at the same chain parameters.
function tipWidthCommonForkT(lock, segmentIndex, splits) {
  const leftZipper = splits[segmentIndex - 1]?.height;
  const rightZipper = splits[segmentIndex]?.height;
  return 1 - Math.max(leftZipper ?? 0, rightZipper ?? 0);
}

// Reset curve for a tip (segment) width curve: full width (value 1) across the exposed
// region - the side's own fork boundary plus the common-fork control positions.
function tipWidthResetCurve(lock, segmentIndex, splits, side) {
  const sideForkT = tipWidthSideForkT(lock, segmentIndex, splits, side);
  const commonForkT = tipWidthCommonForkT(lock, segmentIndex, splits);
  const points = [{ position: 0, value: 1, interpolation: "linear" }];
  points.push({ position: sideForkT, value: 1, interpolation: "linear" });
  for (const position of tipWidthControlTs(commonForkT)) {
    points.push({ position, value: 1, interpolation: "linear" });
  }
  points.sort((a, b) => a.position - b.position);
  return points;
}

// The segment's tip-narrowing gap at chain parameter t on one side: 0 at the side's
// zipper (fork), ramping linearly to 0.5*spread*span at the tip (aggregation). Edge
// segment outer sides without a zipper mirror the opposite side's zipper (same
// bone.spread, same ramp start): 边缘段外侧镜像对侧 zipper 参数，两侧一致收窄（自动
// 补全，不展示 UI）。Only when a side has no zipper on either side (no splits at all)
// does it never gap.
function tipWidthSpreadGap(lock, segmentIndex, splits, bone, t, side) {
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  if (segmentIndex < 0 || segmentIndex >= boundaries.length - 1) return 0;
  let zipper = side < 0 ? splits[segmentIndex - 1] : splits[segmentIndex];
  if (!zipper) zipper = side < 0 ? splits[segmentIndex] : splits[segmentIndex - 1];
  if (!zipper) return 0;
  const start = 1 - Number(zipper.height ?? 0);
  if (t <= start) return 0;
  const ramp = (t - start) / Math.max(0.0001, 1 - start);
  const span = boundaries[segmentIndex + 1] - boundaries[segmentIndex];
  return 0.5 * THREE.MathUtils.clamp(bone?.spread ?? 0, 0, 0.99) * span * ramp;
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
  const side = u < 0 ? -1 : 1;
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
  const centerU = (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5;
  const halfSpan = Math.max(0.0001, (boundaries[segmentIndex + 1] - boundaries[segmentIndex]) * 0.5);
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
  const sideForkT = tipWidthSideForkT(lock, segmentIndex, splits, side);
  const points = [];
  const addPoint = (position, value) => {
    const clampedPosition = THREE.MathUtils.clamp(Number(position) || 0, 0, 1);
    if (points.some((point) => Math.abs(point.position - clampedPosition) < 1e-4)) return;
    points.push({
      position: clampedPosition,
      value: THREE.MathUtils.clamp(Number(value) ?? 0.5, 0.08, 2),
      interpolation: "linear"
    });
  };
  // The locked (above-zipper) region is no longer baked into the curve: sampling falls
  // back to the global curve below the fork. The boundary is THIS side's own fork so
  // the curve stays continuous at the zipper; the control positions use the COMMON
  // fork (deepest zipper) so both sides share chain parameters, and the tip end (t=1)
  // is part of the control array (addPoint dedupes). Points below this side's fork
  // stay in the curve data but the sampler ignores them.
  // 保留当前曲线已有的 0 点：Reset 的整段覆盖在后续编辑中持续。
  const zeroPoint = current && current.find((point) => Math.abs(Number(point.position) || 0) < 1e-4);
  if (zeroPoint) addPoint(0, zeroPoint.value);
  addPoint(sideForkT, sampleTaperCurve(globalCurve, sideForkT));
  const controlTs = tipWidthControlTs(tipWidthCommonForkT(lock, segmentIndex, splits));
  for (const position of controlTs) {
    const edited = current && current.find((point) => Math.abs(point.position - position) < 1e-3);
    addPoint(position, edited ? edited.value : sampleTaperCurve(globalCurve, position));
  }
  points.sort((a, b) => a.position - b.position);
  return points;
}

// Set the width multiplier at chain parameter t for one side, then rebuild only the
// edited side's curve so the above-zipper (locked) region tracks the global default
// and left/right stay independent (asymmetric width profile).
function setTipWidthCurveValue(lock, segmentIndex, splits, bone, side, t, value) {
  if (!bone.taperCurve) bone.taperCurve = buildTipWidthCurve(lock, segmentIndex, splits, bone, 1);
  if (!bone.taperCurveSecondary) bone.taperCurveSecondary = buildTipWidthCurve(lock, segmentIndex, splits, bone, -1);
  bone.asymmetricWidthCurve = true;
  const curve = side < 0 ? bone.taperCurveSecondary : bone.taperCurve;
  const clamped = THREE.MathUtils.clamp(Number(value) || 0.5, 0.08, 2);
  // Update the curve point at the handle's parameter t in place (the fixed control
  // positions are always present in the lean curve, so no points accumulate).
  const existing = curve.find((point) => Math.abs(point.position - t) < 1e-3);
  if (existing) existing.value = clamped;
  else curve.push({ position: THREE.MathUtils.clamp(t, 0, 1), value: clamped, interpolation: "linear" });
  curve.sort((a, b) => a.position - b.position);
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
  return origin.clone()
    .addScaledVector(frame.x, lateralU * halfWidth + lateralCenter + centerX * profileTopologyCenterWeight(u, -1, 1))
    .addScaledVector(
      frame.z,
      camber + shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1)
    );
}

// 发尖子骨骼表面帧：在段中心 u=centerU 处用面板几何（含 camber/曲率）计算真正
// 垂直于面板表面的法线（z）与位于表面切平面内的横向（x），而不是沿用主骨骼
// 法线。rest 链与 tipChainFrameAt 共用，让发尖子骨骼跟随主发片构建曲线的表面
// 曲率（弯曲刘海侧面与主面板法线出现明显夹角，宽度拖拽也沿表面切平面）。
function tipSurfaceFrameAt(lock, t, centerU = null, segmentIndex = -1, splits = null) {
  const panel = tipPanelFrameAt(lock, t);
  const y = panel.y;
  const boundaries = [-1, ...(Array.isArray(splits) ? splits : []).map((split) => split.position), 1];
  const center = centerU == null
    ? (segmentIndex >= 0 && segmentIndex < boundaries.length - 1
      ? (boundaries[segmentIndex] + boundaries[segmentIndex + 1]) * 0.5
      : 0)
    : centerU;
  // 沿 u 差分采样面板表面点（front face）得到截面切线 dP/du；camber 会让截面
  // 切线偏离 frame.x，从而法线也相应倾斜，贴合实际面板曲面。
  const step = THREE.MathUtils.clamp((boundaries[1] - boundaries[0]) * 0.2, 0.01, 0.04);
  const lower = tipMainSectionPoint(lock, t, THREE.MathUtils.clamp(center - step, -1, 1), 1, null, segmentIndex, splits);
  const upper = tipMainSectionPoint(lock, t, THREE.MathUtils.clamp(center + step, -1, 1), 1, null, segmentIndex, splits);
  const sectionTangent = new THREE.Vector3().subVectors(upper, lower);
  if (!Number.isFinite(sectionTangent.x) || sectionTangent.lengthSq() < 1e-8) sectionTangent.copy(panel.x);
  else sectionTangent.normalize();
  let z = new THREE.Vector3().crossVectors(y, sectionTangent).negate();
  z.addScaledVector(y, -z.dot(y));
  if (z.lengthSq() < 0.0001) z.copy(panel.z);
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  const point = tipMainSectionPoint(lock, t, center, 1, null, segmentIndex, splits);
  return { point, x, y, z };
}

// 发尖子骨骼链在 t 处的自身 frame：y = 链切线（authored），z = 面板表面法线经
// rest→authored 弯曲旋转后对 y 做 Gram-Schmidt 正交化的链自身法线，x = 链横向
// （副法线）。宽度控制点的移动方向应垂直于发尖子骨骼自身法线（x 横向），而不是
// 被主骨骼法线限制。segment 段中心使用 tipSurfaceFrameAt（垂直于面板表面、含
// camber/曲率），非 segment 回退 tipPanelFrameAt。
function tipChainFrameAt(lock, tip, restTip, t, segmentIndex = -1, splits = null) {
  const curve = new THREE.CatmullRomCurve3(tip.points);
  const rest = restTip && Array.isArray(restTip.restPoints) ? restTip : tip;
  const restCurve = new THREE.CatmullRomCurve3(rest.restPoints);
  const authoredTangent = curve.getTangent(t).normalize();
  const restTangent = restCurve.getTangent(t).normalize();
  const dq = restTangent.dot(authoredTangent) < -0.9999
    ? (new THREE.Quaternion()).setFromAxisAngle(
      Math.abs(restTangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0),
      Math.PI
    )
    : (new THREE.Quaternion()).setFromUnitVectors(restTangent, authoredTangent);
  const y = authoredTangent;
  const panel = tipPanelFrameAt(lock, t);
  // 段中心处用面板表面帧（垂直于面板表面、含 camber/曲率）作为参考法线，而不是
  // 直接沿用主面板法线：发尖子骨骼的横向/法线跟随主发片构建曲线的表面曲率。
  const referenceZ = (segmentIndex >= 0 && Array.isArray(splits) && splits.length)
    ? tipSurfaceFrameAt(lock, t, null, segmentIndex, splits).z
    : panel.z;
  const z = referenceZ.clone().applyQuaternion(dq);
  z.addScaledVector(y, -z.dot(y));
  if (z.lengthSq() < 1e-8) z.copy(panel.z);
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return { x, y, z };
}

// Edge position of a tip side at chain parameter t, matching the geometry's own tip
// transform (rest identity preserved). The width is measured from the TIP sub-bone
// chain (the segment center), so the handle sits on the mesh edge AND moves along the
// tip's own lateral when the width changes - not along the main-bone line.
function tipWidthEdgePosition(lock, segmentIndex, splits, bone, side, t) {
  const tip = splitTipForSegment(lock, segmentIndex, splits, bone);
  if (!tip || tip.points.length < 2 || !tip.restPoints || tip.restPoints.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(tip.points);
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
  const commonForkT = tipWidthCommonForkT(lock, segmentIndex, splits);
  const sideForkT = tipWidthSideForkT(lock, segmentIndex, splits, side);
  if (commonForkT >= 1 || sideForkT >= 1) return null;
  // Both sides share the same control positions (common fork, deepest zipper). A point
  // below THIS side's own fork is hidden (but stays in the curve data), so only the
  // exposed region shows handles while both sides keep matching chain parameters.
  const positions = tipWidthControlTs(commonForkT);
  if (pointIndex < 0 || pointIndex >= positions.length) return null;
  const t = positions[pointIndex];
  if (t < sideForkT - 1e-4) return null;
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
  const selection = deps.sculptState.panelTipSelection;
  const hover = deps.sculptState.panelTipHover;
  const selectedSeg = selection && selection.lockId === lock.id ? selection.segmentIndex : null;
  const hoveredSeg = hover && hover.lockId === lock.id ? hover.segmentIndex : null;
  if ((selectedSeg == null && hoveredSeg == null) || !deps.isPanelGeometry(lock) || lock.panelSplitEnabled === false || !lock.curveObjects) {
    if (lock.curveObjects?.tipHighlightMesh) lock.curveObjects.tipHighlightMesh.visible = false;
    return;
  }
  const geometry = lock.mesh?.geometry;
  const position = geometry?.getAttribute?.("position");
  const panelWeights = geometry?.userData?.panelWeights;
  if (!position || !geometry?.index || !panelWeights || panelWeights.length !== position.count * 3) {
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
    const segment = panelWeights[vertex * 3 + 1];
    const weight = panelWeights[vertex * 3 + 2];
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
  const restPoints = [];
  for (let index = 0; index < mainCount; index += 1) {
    const t = index / Math.max(1, mainCount - 1);
    // 发尖子骨骼 rest 链沿主发片构建曲线在段中心的表面曲率生成（法线垂直于面板
    // 表面、含 camber/曲率），不再沿用主骨骼法线。rest 基准变化后，旧数据的
    // authored delta 会在新 rest 上重新叠加，无需改动 .ahs 文件。
    restPoints.push(tipSurfaceFrameAt(lock, t, centerU, segmentIndex, splits).point);
  }
  const authored = splitBone?.tip;
  const twists = (authored && Array.isArray(authored.twists))
    ? restPoints.map((_, index) => Number(authored.twists[index]) || 0)
    : restPoints.map(() => 0);
  if (
    authored
    && Array.isArray(authored.points)
    && Array.isArray(authored.restPoints)
    && authored.points.length === restPoints.length
    && authored.restPoints.length === restPoints.length
  ) {
    const delta = authored.points.map((point, index) => {
      const rest = authored.restPoints[index] || { x: 0, y: 0, z: 0 };
      return new THREE.Vector3(point.x - rest.x, point.y - rest.y, point.z - rest.z);
    });
    return {
      restPoints,
      points: restPoints.map((point, index) => point.clone().add(delta[index])),
      twists,
      active: authored.active !== false
    };
  }
  return { restPoints, points: restPoints.map((point) => point.clone()), twists, active: true };
}

function createPanelStrandGeometry(lock) {
  lock._tipWidthFrames = null; // the width-UI frame cache depends on the rebuilt points
  const latticeControlled = lock.geometryType === "surface";
  const curve = latticeControlled ? null : deps.strandGeometryCurve(lock);
  const lengthLoops = THREE.MathUtils.clamp(Math.round(lock.panelLengthLoops ?? 10), 3, 32);
  const widthLoops = THREE.MathUtils.clamp(
    Math.round(lock.panelWidthLoops ?? 6),
    latticeControlled ? 2 : 3,
    24
  );
  const fullWidth = Math.max(0.01, Number(lock.width ?? 0.62));
  const baseThickness = Math.max(0.001, Number(lock.panelThickness ?? 0.08));
  const curvature = Number(lock.panelCurvature ?? 0.18);
  const splitEnabled = lock.panelSplitEnabled !== false;
  const splits = splitEnabled
    ? deps.normalizePanelSplits(lock.panelSplits, lock.panelSplitHeight, widthLoops - 1).filter((split) => split.height > 0.005)
    : [];
  // One split sub-bone per segment (segments = splits + 1). Derived defaults when not
  // authored; each bone carries per-segment width/depth curves + a relative tip gap
  // (spread) that replaces the old absolute panelSplitGap displacement.
  const splitBones = splits.length ? cloneSplitBones(lock.splitBones, splits, lock) : [];
  const boundaries = [-1, ...splits.map((split) => split.position), 1];
  // Procedural per-vertex weight framework (S1): each vertex carries
  // [mainJointIndex, segmentIndex, weight]. The zipper boundaries decide the control
  // region (segment assignment = hard by u); weight ramps smoothly from 0 at the
  // segment's fork (deeper bounding zipper) to 1 at the tip. One tip = one sub-bone.
  // 发尖子骨骼蒙皮权重：每侧以自己 zipper 顶（1-height）为 0 边界，段内按 u 线性
  // 插值成斜线，斜线上方（靠根）权重 0（主骨骼 100%），下方线性爬到 1。边缘段
  // 只一侧有 zipper 时另一侧镜像同一 fork。
  const panelWeights = [];
  const mainPointCount = latticeControlled ? 0 : lock.points.length;
  const segmentWeightAt = (segment, t, u) => tipSegmentWeightAt(lock, segment, splits, t, u, lengthLoops);
  const frames = [];
  let previousFrame = null;
  if (!latticeControlled) {
    for (let row = 0; row <= lengthLoops; row += 1) {
      previousFrame = deps.strandGeometryFrameAt(lock, curve, row / lengthLoops, previousFrame);
      frames.push(previousFrame);
    }
  }

  const positions = [];
  const uvs = [];
  const colors = [];
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
    const scaled = THREE.MathUtils.clamp(t, 0, 1) * lengthLoops;
    const lowerIndex = Math.min(lengthLoops, Math.floor(scaled));
    const upperIndex = Math.min(lengthLoops, lowerIndex + 1);
    const alpha = scaled - lowerIndex;
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
    return frame.point.clone()
      .addScaledVector(frame.x, lateralU * halfWidth + lateralCenter + centerX * profileTopologyCenterWeight(u, -1, 1))
      .addScaledVector(
        frame.z,
        camber + shell * thickness * 0.5 + centerZ * profileTopologyCenterWeight(shell, -1, 1)
      );
  };
  const panelPoint = (row, u, shell, bone = null, segment = -1) => {
    const t = row / lengthLoops;
    return rawPanelPoint(t, u, shell, bone, segment);
  };
  // Tip sub-bone deformation: the segment follows its guide chain CENTER. At each row t
  // below the fork, the below-zipper region translates by (authored chain point - rest
  // chain point) blended by weight; at rest the delta is exactly zero (no regression).
  // Length and direction come from editing the chain's points.
  const addPatch = (rowStart, rowEnd, uStart, uEnd, columns, options = {}, bone = null, segment = -1) => {
    const rows = rowEnd - rowStart;
    const hasZipper = Boolean(splits[segment - 1] || splits[segment]);
    const tip = (!latticeControlled && segment >= 0 && hasZipper)
      ? splitTipForSegment(lock, segment, splits, bone)
      : null;
    const tipCurve = tip && tip.points.length >= 2 ? new THREE.CatmullRomCurve3(tip.points) : null;
    const tipRestCurve = tip && tip.restPoints && tip.restPoints.length >= 2
      ? new THREE.CatmullRomCurve3(tip.restPoints)
      : tipCurve;
    const front = [];
    const back = [];
    for (let localRow = 0; localRow <= rows; localRow += 1) {
      const row = rowStart + localRow;
      const t = row / lengthLoops;
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
        const weight = segmentWeightAt(segment, t, u);
        const frontPoint = panelPoint(row, u, 1, bone, segment);
        const backPoint = panelPoint(row, u, -1, bone, segment);
        if (tipTransform && weight > 0) {
          const reference = sectionCenter || tipTransform.restCenter;
          const transformedFront = frontPoint.clone().sub(reference).applyQuaternion(tipTransform.dq).add(tipTransform.authoredCenter);
          frontPoint.lerp(transformedFront, weight);
          const transformedBack = backPoint.clone().sub(reference).applyQuaternion(tipTransform.dq).add(tipTransform.authoredCenter);
          backPoint.lerp(transformedBack, weight);
        }
        frontRow.push(positions.length / 3);
        positions.push(frontPoint.x, frontPoint.y, frontPoint.z);
        uvs.push((u + 1) * 0.5, t);
        colors.push(color.r, color.g, color.b);
        panelWeights.push(mainJoint, segmentIndex, weight);
        backRow.push(positions.length / 3);
        positions.push(backPoint.x, backPoint.y, backPoint.z);
        uvs.push((u + 1) * 0.5, t);
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
      ? boundaries[segment] + tipWidthSpreadGap(lock, segment, splits, bone, row / lengthLoops, -1)
      : -1;
    const uEnd = (row) => (leftSplit || rightSplit)
      ? boundaries[segment + 1] - tipWidthSpreadGap(lock, segment, splits, bone, row / lengthLoops, 1)
      : 1;
    addPatch(0, lengthLoops, uStart, uEnd, columns, {
      capStart: true,
      capEnd: true,
      leftWallStartRow: leftSplit ? Math.ceil((1 - leftSplit.height) * lengthLoops) : 0,
      rightWallStartRow: rightSplit ? Math.ceil((1 - rightSplit.height) * lengthLoops) : 0
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

  const welded = weldPanelGeometryData(positions, uvs, colors, indices, quadFaces, 0.00001, panelWeights);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(welded.positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(welded.uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(welded.colors, 3));
  geometry.setIndex(welded.indices);
  geometry.userData.quadFaces = welded.quadFaces;
  geometry.userData.triangleEdgeMasks = triangleEdgeMasks;
  geometry.userData.panelWeights = welded.weights;
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
    tipWidthCommonForkT,
    tipWidthControlTs,
    tipWidthSpreadGap,
    tipWidthResetCurve,
    tipWidthMultiplierAt,
    tipPanelWidthAt,
    buildTipWidthCurve,
    setTipWidthCurveValue,
    tipPanelFrameAt,
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
