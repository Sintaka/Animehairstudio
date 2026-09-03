// strand-geometry.js - Split strand + base strand/card/compound geometry (refactor 3d batches G2+G3).
// Extracted from app.js; coupling injected via createStrandGeometryApi(deps).
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  remapEnvelopeCurveRange,
  sampleScale,
  smoothSweepChains,
  smoothSweepFrames,
  sweepCurvatureResponse,
  upperProfileArcIndices
} from "./curve-math.js?v=20260910-5";
import { buildConnectedCurveCardGrid, DEFAULT_CURVE_SURFACE_ROWS } from "./curve-surface.js?v=20260814-12";
import { polyMeshBuffers } from "./poly-topology.js?v=20260814-12";
import {
  compoundBridgeArchWeight,
  compoundBridgeParameters,
  compoundConnectedSegmentCount,
  compoundProfileBridgePlan
} from "./compound-strand.js?v=20260814-12";
import { DEFAULT_SWEEP_PROFILE, ROUND_SWEEP_PROFILE } from "../core/app-config.js?v=20260815-4";
import { defaultStrandTipClump, strandSplitBonesFor, strandTipFor } from "../bones/bone-model.js?v=20260901-1";
import {
  strandTipClumpNarrowedProfile,
  strandTipWidthProfileOverride,
  strandTubeBandExtents
} from "./strand-tip-width.js?v=20260901-1";
import {
  materializeTipChain,
  sampleCenterlinePoint,
  sampleTipPosition,
  sweepRingCentroids,
  tipCaptureWeightAt,
  tipChainFrameAt,
  tipWeightAt
} from "./tip-sub-bone.js?v=20260830-2";
import { SWEEP_OVERLAP_DEFAULTS } from "./strand-sweep.js?v=20260813-3";
// fork-T（`1 − max(相邻 zipper 高)`）的唯一定义点。本文件此前自写一份 sectionSplitStart，
// 0.2.133 折叠。无新依赖边：strand-tip-width.js 已 import 同一模块。
import { tipWidthCommonForkFromHeights } from "./tip-width-curve.js?v=20260910-10";

export function createStrandGeometryApi(deps) {
  // deps: api objects (branchSweep/strandSweep/branchBridge/curveSurfaceCreate/panelTipStrand/
  // branchRootBone) + locks data + app.js helper functions (strandCurveParameters/
  // strandProfileTopologyAt/strandGeometryFrameAt/strandInfluenceColor/strandGeometryCurve/
  // gridProfileSkipCol/outwardNormalAtPoint/proceduralBranchWorldPoints/
  // proceduralBranchTemplatesForGuide/createBraidGeometry).
  // Batch-fill point in app.js: after outwardNormalAtPoint (next to the G1 deps batch).

function clipStrandProfilePolygon(points, splitX, keepLeft) {
  const inside = (point) => keepLeft ? point.x <= splitX + 0.000001 : point.x >= splitX - 0.000001;
  const output = [];
  points.forEach((current, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const currentInside = inside(current);
    const previousInside = inside(previous);
    if (currentInside !== previousInside) {
      const denominator = current.x - previous.x;
      const amount = Math.abs(denominator) < 0.000001 ? 0 : (splitX - previous.x) / denominator;
      output.push(new THREE.Vector3(
        splitX,
        0,
        THREE.MathUtils.lerp(previous.z, current.z, amount)
      ));
    }
    if (currentInside) output.push(current.clone());
  });
  return output.filter((point, index, values) => (
    index === 0 || point.distanceToSquared(values[index - 1]) > 0.00000001
  ));
}

// Interval-band clip: keep the sub-polygon with lowX <= x <= highX by chaining the
// proven half-plane clip twice (no new clip math). A ±Infinity bound is skipped so an
// outer section reduces EXACTLY to a single half-plane clip (byte-identical to the
// legacy two-section path at N=1).
function clipStrandProfileBand(points, lowX, highX) {
  let band = points;
  if (Number.isFinite(highX)) band = clipStrandProfilePolygon(band, highX, true);
  if (Number.isFinite(lowX)) band = clipStrandProfilePolygon(band, lowX, false);
  return band;
}

function pushOrientedTriangle(indices, vertices, a, b, c, outward) {
  const pointA = new THREE.Vector3(vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2]);
  const pointB = new THREE.Vector3(vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]);
  const pointC = new THREE.Vector3(vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]);
  const normal = pointB.sub(pointA).cross(pointC.sub(pointA));
  if (normal.dot(outward) < 0) indices.push(a, c, b);
  else indices.push(a, b, c);
}

function orientedQuadFace(vertices, a, b, c, d, outward) {
  const pointA = new THREE.Vector3(vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2]);
  const pointB = new THREE.Vector3(vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]);
  const pointC = new THREE.Vector3(vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]);
  const normal = pointB.sub(pointA).cross(pointC.sub(pointA));
  return normal.dot(outward) < 0 ? [a, d, c, b] : [a, b, c, d];
}

function createSplitStrandGeometry(lock, curve, profilePoints) {
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 6, 32);
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const sampleParameters = [
    ...Array.from({ length: radialSegments }, (_, index) => index / radialSegments),
    ...profilePoints.map((_, index) => index / profilePoints.length)
  ].sort((a, b) => a - b).filter((value, index, values) => (
    index === 0 || Math.abs(value - values[index - 1]) > 0.00001
  ));
  const polygon = sampleParameters.map((t) => deps.branchSweep.sampleSweepProfile(profilePoints, t, profileCurve));
  const minX = Math.min(...polygon.map((point) => point.x));
  const maxX = Math.max(...polygon.map((point) => point.x));
  if (!Number.isFinite(minX) || maxX - minX < 0.0001) return null;
  // Drive sections from the split array (N zippers -> N+1 tubes). Fall back to the
  // legacy single-scalar split so old files reduce to the exact 2-section result.
  const rawSplits = Array.isArray(lock.strandSplits) && lock.strandSplits.length
    ? lock.strandSplits
    : [{ position: Number(lock.strandSplitPosition ?? 0), height: Number(lock.strandSplitHeight ?? 0.3) }];
  const splits = rawSplits
    .map((split) => ({
      position: THREE.MathUtils.clamp(Number(split?.position ?? 0), -0.8, 0.8),
      height: THREE.MathUtils.clamp(Number(split?.height ?? 0.3), 0.02, 0.8)
    }))
    .sort((a, b) => a.position - b.position);
  const splitCount = splits.length;
  const splitXs = splits.map((split) => THREE.MathUtils.lerp(minX, maxX, split.position * 0.5 + 0.5));
  // N+2 boundaries -> N+1 sections. Outer bounds are ±Infinity so the first section
  // keeps everything left of splitX[0] and the last keeps everything right of the last
  // splitX EXACTLY like the legacy single half-plane clips.
  const boundaryXs = [-Infinity, ...splitXs, Infinity];
  const sections = [];
  for (let i = 0; i < splitCount + 1; i += 1) {
    const lowX = boundaryXs[i];
    const highX = boundaryXs[i + 1];
    const points = clipStrandProfileBand(polygon, lowX, highX);
    if (points.length < 3) continue;
    // Each section narrows where its adjacent split(s) are deepest (shallowest clump
    // start row). Edge sections use their single adjacent split.
    const leftSplit = splits[i - 1];
    const rightSplit = splits[i];
    // Tip Clump 的**每侧**斜坡起点：本侧 zipper 高度（无 zipper 的外侧镜像对侧，与 panel
    // 的 tipWidthSpreadGap 邻居规则逐字同构 —— 边缘段外侧自动补全、不展示 UI）。两侧高度
    // 不同时收窄斜坡起点不同，这正是 panel 既有行为。
    const leftClumpHeight = leftSplit?.height ?? rightSplit?.height ?? null;
    const rightClumpHeight = rightSplit?.height ?? leftSplit?.height ?? null;
    // band = 该管裁剪后的实际 x 跨度（profile 局部空间），发尖 WidthCurve 的**管内相对
    // 坐标**由它归一化。这里一次算好挂在 section 上，避免 sweep 循环里逐行重算；
    // splitXs 直接传入，保证 band 边界与上面的裁剪用**同一批**数值（同一条 lerp 公式）。
    const band = strandTubeBandExtents(polygon, splits, i, splitXs);
    sections.push({
      points,
      // fork-T 走 tip-width-curve 的唯一定义点（此前这里是 `1 - Math.max(...)` 的第 4 份
      // 副本）。splits 已在上方归一化（height 钳到 [0.02, 0.8]），缺侧为 undefined ⇒ 与
      // 共享层的 `?? 0` 缺侧语义一致，逐值不变。
      sectionSplitStart: tipWidthCommonForkFromHeights(leftSplit?.height, rightSplit?.height),
      band,
      leftClumpHeight,
      rightClumpHeight
    });
  }
  // A degenerate (<3 pt) section would cascade into a broken mesh / null UV table;
  // bail out like the legacy guard rather than emit it.
  if (sections.length !== splitCount + 1) return null;

  const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
  const lengthSegments = THREE.MathUtils.clamp(Math.max(Math.round(lock.lengthSegments || 26), curlSegments), 4, 256);
  const curveParameters = deps.strandCurveParameters(lock, curve, lengthSegments);
  const actualLengthSegments = curveParameters.length - 1;
  const strength = THREE.MathUtils.clamp(Number(lock.sweepOverlapStrength ?? SWEEP_OVERLAP_DEFAULTS.strength), 0, 1);
  const safety = Math.max(0.01, Number(lock.sweepOverlapThreshold ?? SWEEP_OVERLAP_DEFAULTS.threshold));
  const overlapFalloff = Math.max(0, Math.min(8, Math.floor(Number(lock.sweepOverlapFalloff ?? SWEEP_OVERLAP_DEFAULTS.falloff) || 0)));
  const edgeSmooth = THREE.MathUtils.clamp(Number(lock.sweepEdgeSmooth ?? SWEEP_OVERLAP_DEFAULTS.edgeSmooth), 0, 1);
  const tangentSmooth = THREE.MathUtils.clamp(Number(lock.sweepTangentSmooth ?? SWEEP_OVERLAP_DEFAULTS.tangentSmooth), 0, 1);
  const frames = [];
  let previousFrame = null;
  curveParameters.forEach((t) => {
    const frame = deps.strandGeometryFrameAt(lock, curve, t, previousFrame);
    frames.push(frame);
    previousFrame = frame;
  });

  const vertices = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const triangleEdgeMasks = [];
  // Shallowest opening start across all sections (single conservative value for the
  // capture/tip weighting and the fused-grid splitStartRow). At N=1 both sections share
  // the same start, so this equals the legacy 1 - strandSplitHeight.
  const splitStart = Math.min(...sections.map((section) => section.sectionSplitStart));
  // Route 2: per-tube Tip Clump comes from each split bone (bone.tipClump). 语义**只有**
  // 「该管发尖相对自身宽度收窄多少」——相对缩放，绕本管 band 中心。0.2.132 前这里还有一份
  // 「整管沿 frame.x 平移」的 opening（继承自 main 的 segment separate / Split Spacing），
  // 已按用户决定**整体删除**：管的横向分离由 zipper 决定，收窄本身就会让相邻管尖张开。
  const splitBones = strandSplitBonesFor(lock);
  // 未创作过的管的兜底（strandSplitBonesFor 已把 authored 骨骼归一化过，这里只覆盖
  // 「splitBones 为 null」与「该管 tipClump 缺失」两种边角；单点定义在 bone-model）。
  const tubeClumpDefault = defaultStrandTipClump(lock);
  const strandSplitWeights = splitBones ? [] : null;
  // Per-vertex leaf weights use the unified [mainJoint, leafIndex, weight] format;
  // mainJoint indexes the main strand bone point nearest to the vertex row (leaf = tube).
  const mainPointCount = Math.max(0, Array.isArray(lock.points) ? lock.points.length : 0);
  let sideTriangleCount = 0;

  // Per-section vertex/face bases so the child-strand bridge can address each tube.
  const sectionBases = [];
  let sectionVertexBase = 0;
  let sectionFaceBase = 0;
  sections.forEach((section) => {
    sectionBases.push({
      base: sectionVertexBase,
      ringSize: section.points.length,
      faceBase: sectionFaceBase
    });
    sectionVertexBase += (actualLengthSegments + 1) * section.points.length;
    sectionFaceBase += actualLengthSegments * section.points.length;
  });

  // Curvature-aware narrowing: per-row spine center + max profile radius feed the
  // shared overlap response; factors narrow the warped offsets in the sweep below.
  const centers = [];
  const radii = [];
  curveParameters.forEach((t) => {
    centers.push(curve.getPoint(t));
    const scaleX = sampleScale(lock.pointScales, t, "x");
    const scaleZ = sampleScale(lock.pointScales, t, "z");
    let rowRadius = 0;
    sections.forEach((section) => {
      // 刻意**不**在这一趟传发尖 WidthCurve override（与下方 sweep 的同名调用差且仅差这
      // 一个参数，属已知的、必须保留的不对称，勿「顺手统一」）。三条理由：
      // ① 本趟产出的是**全行共享**的曲率收窄响应（radii → sweepCurvatureResponse →
      //    factors[row] 乘到该行**所有管**的顶点上）。把某一管的创作宽度喂进去，会让该管
      //    的曲线改动跨管污染其他管的位置。
      // ② factors 经 falloff 在行间扩散，发尖处 radii 变小可传播到 row 0 → row 0 顶点位移
      //    → uv-unfold 的 U（只由 row 0 弧长决定）改变 = 破 UV 契约（红线）。
      //    UV 契约已实测：uv-unfold.js 的 U 只累计每根管 row 0 的顶点弧长、V 只看行号索引；
      //    本函数位移只发生在 t>fork（fork 恒 >0），天然不碰 row 0，故不改变任何现有 UV 值。
      // ③ 语义上曲率收窄响应的是发丝**基础包络有多粗**（防自穿插），发尖 WidthCurve 是
      //    其后的美术缩放；喂回去会形成「收窄→更细→少收窄→更粗」的非线性反馈，创作值
      //    与最终宽度不再成正比。
      const warpedSection = deps.strandProfileTopologyAt(lock, t, section.points, scaleX, scaleZ, polygon);
      for (let column = 0; column < section.points.length; column += 1) {
        const warped = warpedSection[column];
        rowRadius = Math.max(rowRadius, Math.abs(warped.x), Math.abs(warped.z));
      }
    });
    radii.push(rowRadius);
  });
  const { factors, heat } = sweepCurvatureResponse(centers, radii, { strength, safety, falloff: overlapFalloff });
  // 切线按曲率后处理平滑：弯折处环朝向渐变，脊柱不动（根/尖端行 pin 住）。
  smoothSweepFrames(frames, heat, {
    strength: tangentSmooth,
    iterations: 2,
    pinRows: new Set([0, actualLengthSegments])
  });

  // Sweep the two tubes (unchanged rendering), but emit ALL side faces before the
  // end caps so quadFaces occupy the front of the index stream (carve-friendly).
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    curveParameters.forEach((t, row) => {
      const point = curve.getPoint(t);
      const frame = frames[row];
      const scaleX = sampleScale(lock.pointScales, t, "x");
      const scaleZ = sampleScale(lock.pointScales, t, "z");
      const sectionSplitStart = section.sectionSplitStart;
      // 每管发尖 WidthCurve：仅在「有段骨骼 + 该段创作过 taperCurve + t 已过本段 fork」
      // 时才是非 null（判据本体在 strand-tip-width.js，勿在此复制）。今天所有真实工程
      // 都没有创作过的 strandSplitBones 曲线 → 恒 null → 与改动前逐字节一致、零分配。
      const tipWidthOverride = splitBones
        ? strandTipWidthProfileOverride({
          lock,
          bone: splitBones[sectionIndex] || null,
          splits,
          tubeIndex: sectionIndex,
          t,
          sectionSplitStart,
          band: section.band
        })
        : null;
      // Tip Clump 收窄：**先**把 profile x 绕本管 band 中心收进来，**再**送去 warp ——
      // 与 panel「先把列的 u 收进 [uStart,uEnd]、再用该 u 采样宽度曲线」同序（理由与
      // 坐标空间见 strandTipClumpNarrowedProfile）。Tip Clump = 0 时返回原数组本身、零分配。
      const clumpedPoints = strandTipClumpNarrowedProfile(
        section.points,
        section.band,
        splitBones ? (splitBones[sectionIndex]?.tipClump ?? tubeClumpDefault) : tubeClumpDefault,
        t,
        section.leftClumpHeight,
        section.rightClumpHeight
      );
      const warpedSection = deps.strandProfileTopologyAt(
        lock,
        t,
        clumpedPoints,
        scaleX,
        scaleZ,
        polygon,
        tipWidthOverride
      );
      const color = deps.strandInfluenceColor(lock, t);
      section.points.forEach((profile, column) => {
        const warped = warpedSection[column];
        const ringPoint = frame.x.clone().multiplyScalar(warped.x * factors[row]);
        ringPoint.add(frame.z.clone().multiplyScalar(warped.z * factors[row]));
        vertices.push(point.x + ringPoint.x, point.y + ringPoint.y, point.z + ringPoint.z);
        tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
        uvs.push(column / ringSize, t);
        colors.push(color.r, color.g, color.b);
        const mainJoint = mainPointCount ? Math.round(t * (mainPointCount - 1)) : -1;
        if (strandSplitWeights) {
          strandSplitWeights.push(mainJoint, sectionIndex, tipCaptureWeightAt(t, splitStart));
        }
      });
    });

    for (let row = 0; row < actualLengthSegments; row += 1) {
      for (let column = 0; column < ringSize; column += 1) {
        const next = (column + 1) % ringSize;
        const a = sectionStart + row * ringSize + column;
        const b = sectionStart + row * ringSize + next;
        const c = sectionStart + (row + 1) * ringSize + column;
        const d = sectionStart + (row + 1) * ringSize + next;
        indices.push(a, c, b, b, c, d);
        sideTriangleCount += 2;
        triangleEdgeMasks.push([0, 1, 1], [1, 1, 0]);
      }
    }
  });

  const sweepRows = actualLengthSegments + 1;
  const smoothTubeVertices = (targetVertices) => {
    sections.forEach((section, sectionIndex) => {
      const ringSize = section.points.length;
      const sectionStart = sectionBases[sectionIndex].base;
      const sectionVertexStart = sectionStart * 3;
      const sectionVertexEnd = (sectionStart + sweepRows * ringSize) * 3;
      const weights = new Array(sweepRows * ringSize);
      for (let row = 0; row < sweepRows; row += 1) {
        for (let column = 0; column < ringSize; column += 1) {
          weights[row * ringSize + column] = heat[row];
        }
      }
      const sectionVertices = targetVertices.slice(sectionVertexStart, sectionVertexEnd);
      smoothSweepChains(sectionVertices, sweepRows, ringSize, {
        strength: edgeSmooth,
        iterations: 2,
        weights,
        pinRows: new Set([0])
      });
      for (let i = 0; i < sectionVertices.length; i += 1) {
        targetVertices[sectionVertexStart + i] = sectionVertices[i];
      }
    });
  };

  // Establish the rest pose after all base sweep smoothing. The tube centroid is the
  // only stable source of truth for both geometry and future viewport controls.
  smoothTubeVertices(vertices);
  const splitRestCenters = sweepRingCentroids(vertices, sectionBases, sweepRows);

  // Route 2: per-tube tip sub-bones (strand split). Each rest chain now samples the
  // actual smoothed tube centerline. Geometry keeps its smooth visual transition via
  // tipWeightAt, while strandSplitWeights above records strict capture ownership.
  let tipChains = null;
  if (splitBones) {
    tipChains = sections.map((section, sectionIndex) => {
      const bone = splitBones[sectionIndex] || null;
      if (!bone?.tip || bone.tip.active === false) return null;
      const restPointAt = (t) => sampleCenterlinePoint(splitRestCenters[sectionIndex], curveParameters, t);
      const tipCount = Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2);
      return materializeTipChain(bone?.tip || null, restPointAt, tipCount);
    });
    sections.forEach((section, sectionIndex) => {
      const tipChain = tipChains[sectionIndex];
      if (!tipChain) return;
      const ringSize = section.points.length;
      const sectionStart = sectionBases[sectionIndex].base;
      for (let row = 0; row <= actualLengthSegments; row += 1) {
        const t = curveParameters[row];
        const w = tipWeightAt(t, splitStart);
        if (w <= 0) continue;
        const referenceZ = frames[row].z.clone();
        const tipFrame = tipChainFrameAt(tipChain, tipChain, t, referenceZ);
        const tipCenter = sampleTipPosition(tipChain, t);
        const restCenter = sampleCenterlinePoint(splitRestCenters[sectionIndex], curveParameters, t);
        for (let column = 0; column < ringSize; column += 1) {
          const idx = sectionStart + row * ringSize + column;
          const original = new THREE.Vector3(
            vertices[idx * 3],
            vertices[idx * 3 + 1],
            vertices[idx * 3 + 2]
          );
          const offset = original.clone().sub(new THREE.Vector3(restCenter.x, restCenter.y, restCenter.z));
          const lateral = offset.dot(frames[row].x);
          const depth = offset.dot(frames[row].z);
          const target = new THREE.Vector3(tipCenter.x, tipCenter.y, tipCenter.z)
            .addScaledVector(tipFrame.x, lateral)
            .addScaledVector(tipFrame.z, depth);
          const final = original.clone().lerp(target, w);
          vertices[idx * 3] = final.x;
          vertices[idx * 3 + 1] = final.y;
          vertices[idx * 3 + 2] = final.z;
        }
      }
    });
  }
  const sideFaceCount = sectionFaceBase;
  const quadFaces = [];
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    for (let row = 0; row < actualLengthSegments; row += 1) {
      for (let column = 0; column < ringSize; column += 1) {
        const next = (column + 1) % ringSize;
        const a = sectionStart + row * ringSize + column;
        const b = sectionStart + row * ringSize + next;
        const c = sectionStart + (row + 1) * ringSize + column;
        const d = sectionStart + (row + 1) * ringSize + next;
        quadFaces.push([a, c, d, b]);
      }
    }
  });
  // End caps (triangles) come AFTER every side face so the carve's "faces first" rule holds.
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    const capTriangles = THREE.ShapeUtils.triangulateShape(
      section.points.map((point) => new THREE.Vector2(point.x, point.z)),
      []
    );
    const endOffset = sectionStart + actualLengthSegments * ringSize;
    const startOutward = frames[0].y.clone().negate();
    const tipChain = tipChains ? tipChains[sectionIndex] : null;
    const endOutward = tipChain
      ? tipChainFrameAt(tipChain, tipChain, 1, frames[actualLengthSegments].z.clone()).y
      : frames[actualLengthSegments].y;
    capTriangles.forEach(([a, b, c]) => {
      pushOrientedTriangle(indices, vertices, sectionStart + a, sectionStart + b, sectionStart + c, startOutward);
      pushOrientedTriangle(indices, vertices, endOffset + a, endOffset + b, endOffset + c, endOutward);
      triangleEdgeMasks.push([1, 1, 1], [1, 1, 1]);
    });
  });

  // Fused grid metadata (index-side splice for the child-strand bridge): expose the
  // two tubes as ONE connected quad grid (rows x fusedCols) without touching the
  // rendered two-tube geometry. Each fused column maps to the section that owns that
  // profile point (left -> section0, right -> section1); fused faces crossing from one
  // section to the next are the glued seam quads (faceToRendered = -1).
  const fusedCols = polygon.length;
  const colToSection = [];
  for (let c = 0; c < fusedCols; c += 1) {
    const point = polygon[c];
    // Section = the boundary interval containing point.x = count of splitXs strictly
    // below it (clamped to [0, N]). At N=1 this reduces to point.x <= splitX ? 0 : 1.
    let section = 0;
    for (let s = 0; s < splitXs.length; s += 1) {
      if (point.x > splitXs[s]) section += 1;
    }
    section = Math.max(0, Math.min(splitCount, section));
    const ring = sections[section].points;
    let col = -1;
    for (let k = 0; k < ring.length; k += 1) {
      if (Math.abs(ring[k].x - point.x) < 1e-4 && Math.abs(ring[k].z - point.z) < 1e-4) { col = k; break; }
    }
    colToSection.push({ section, col: col < 0 ? 0 : col });
  }
  const fusedIndexAt = (r, c) => {
    const entry = colToSection[c];
    const base = sectionBases[entry.section].base;
    const ringSize = sectionBases[entry.section].ringSize;
    return base + r * ringSize + entry.col;
  };
  const faceToRendered = [];
  for (let row = 0; row < actualLengthSegments; row += 1) {
    for (let c = 0; c < fusedCols; c += 1) {
      const c2 = (c + 1) % fusedCols;
      const same = colToSection[c].section === colToSection[c2].section;
      if (same) {
        const section = colToSection[c].section;
        const localCol = colToSection[c].col;
        faceToRendered.push(sectionBases[section].faceBase + row * sectionBases[section].ringSize + localCol);
      } else {
        faceToRendered.push(-1);
      }
    }
  }
  const splitStartRow = Math.max(0, Math.min(actualLengthSegments, Math.round(splitStart * actualLengthSegments)));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  if (strandSplitWeights) {
    // Unified per-vertex leaf weight format [mainJoint, leafIndex, weight] (stride 3);
    // strandSplitWeights stays as a backward-compatible alias of the same array.
    geometry.userData.leafWeights = new Float32Array(strandSplitWeights);
    geometry.userData.strandSplitWeights = geometry.userData.leafWeights;
  }
  geometry.userData.sideTriangleCount = sideTriangleCount;
  geometry.userData.triangleEdgeMasks = triangleEdgeMasks;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.gridRows = actualLengthSegments + 1;
  geometry.userData.gridColumns = fusedCols;
  geometry.userData.gridFacesPerRow = fusedCols;
  geometry.userData.gridSkipCol = -1;
  geometry.userData.splitSections = sectionBases;
  geometry.userData.strandSplitRestCenters = splitRestCenters.map((centers) => (
    centers.map((center) => ({ ...center }))
  ));
  geometry.userData.splitFusedGrid = {
    cols: fusedCols,
    colToSection,
    faceToRendered,
    fusedIndexAt,
    splitStartRow
  };
  // Per-vertex sweep grid indices（AHS_gridRow / AHS_gridCol primvars）：row=行主序；
  // col = 管局部列 + 全局偏移（管 g 的 local col l → colBase+l，local col 0 = clip seam 点
  // 即管首列，展开时作单边切缝）。不再用 colToSection.findIndex（x=0 共享点会产出
  // 多余 -1 使 split 弧长表整体失效）。
  const totalVertices = vertices.length / 3;
  const gridRowIndices = new Float32Array(totalVertices).fill(-1);
  const gridColIndices = new Float32Array(totalVertices).fill(-1);
  let gridColBase = 0;
  for (let sectionIndex = 0; sectionIndex < sectionBases.length; sectionIndex += 1) {
    const { base, ringSize } = sectionBases[sectionIndex];
    const sectionVertexCount = (actualLengthSegments + 1) * ringSize;
    for (let offset = 0; offset < sectionVertexCount; offset += 1) {
      const vertexIndex = base + offset;
      gridRowIndices[vertexIndex] = Math.floor(offset / ringSize);
      gridColIndices[vertexIndex] = gridColBase + (offset % ringSize);
    }
    gridColBase += ringSize;
  }
  geometry.userData.gridRowIndices = gridRowIndices;
  geometry.userData.gridColIndices = gridColIndices;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createHairCardGeometry(lock, curve, profilePoints) {
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 4, 24);
  const closedTopology = deps.branchSweep.createSweepProfileTopology(profilePoints, radialSegments, profileCurve);
  const arcIndices = upperProfileArcIndices(closedTopology.samples.map((sample) => sample.point));
  const arcSamples = arcIndices.map((index) => closedTopology.samples[index]);
  const arcDistances = [0];
  for (let index = 1; index < arcSamples.length; index += 1) {
    arcDistances.push(arcDistances.at(-1) + arcSamples[index - 1].point.distanceTo(arcSamples[index].point));
  }
  const arcLength = Math.max(0.0001, arcDistances.at(-1));
  let profileVertexCount = 0;
  const profileSamples = arcSamples.map((sample, index) => {
    const interiorHardPoint = sample.hard && index > 0 && index < arcSamples.length - 1;
    const incomingSlot = profileVertexCount++;
    const outgoingSlot = interiorHardPoint ? profileVertexCount++ : incomingSlot;
    return {
      ...sample,
      u: arcDistances[index] / arcLength,
      incomingSlot,
      outgoingSlot
    };
  });
  const profileSlots = Array(profileVertexCount);
  profileSamples.forEach((sample) => {
    profileSlots[sample.incomingSlot] = sample;
    profileSlots[sample.outgoingSlot] = sample;
  });
  const profileEdges = profileSamples.slice(0, -1).map((sample, index) => ({
    start: sample.outgoingSlot,
    end: profileSamples[index + 1].incomingSlot
  }));
  const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
  const lengthSegments = THREE.MathUtils.clamp(
    Math.max(Math.round(lock.lengthSegments || 26), curlSegments),
    4,
    256
  );
  const curveParameters = deps.strandCurveParameters(lock, curve, lengthSegments);
  const actualLengthSegments = curveParameters.length - 1;
  const strength = THREE.MathUtils.clamp(Number(lock.sweepOverlapStrength ?? SWEEP_OVERLAP_DEFAULTS.strength), 0, 1);
  const safety = Math.max(0.01, Number(lock.sweepOverlapThreshold ?? SWEEP_OVERLAP_DEFAULTS.threshold));
  const overlapFalloff = Math.max(0, Math.min(8, Math.floor(Number(lock.sweepOverlapFalloff ?? SWEEP_OVERLAP_DEFAULTS.falloff) || 0)));
  const edgeSmooth = THREE.MathUtils.clamp(Number(lock.sweepEdgeSmooth ?? SWEEP_OVERLAP_DEFAULTS.edgeSmooth), 0, 1);
  const tangentSmooth = THREE.MathUtils.clamp(Number(lock.sweepTangentSmooth ?? SWEEP_OVERLAP_DEFAULTS.tangentSmooth), 0, 1);
  const vertices = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const quadFaces = [];
  const profileSlotPoints = profileSlots.map((profileSample) => profileSample.point);
  // Pre-collect per-row frames (same previousFrame chain as the vertex sweep) so the
  // curvature heat can drive the tangent orientation post-process before vertices emit.
  const frames = [];
  let previousFrame = null;
  curveParameters.forEach((t) => {
    const frame = deps.strandGeometryFrameAt(lock, curve, t, previousFrame);
    frames.push(frame);
    previousFrame = frame;
  });

  // Curvature-aware narrowing: per-row spine center + max profile radius feed the
  // shared overlap response; factors narrow the warped offsets in the sweep below.
  const centers = [];
  const radii = [];
  curveParameters.forEach((t) => {
    centers.push(curve.getPoint(t));
    const scaleX = sampleScale(lock.pointScales, t, "x");
    const scaleZ = sampleScale(lock.pointScales, t, "z");
    const warpedProfile = deps.strandProfileTopologyAt(lock, t, profileSlotPoints, scaleX, scaleZ);
    let rowRadius = 0;
    for (let index = 0; index < profileSlots.length; index += 1) {
      const warped = warpedProfile[index];
      rowRadius = Math.max(rowRadius, Math.abs(warped.x), Math.abs(warped.z));
    }
    radii.push(rowRadius);
  });
  const { factors, heat } = sweepCurvatureResponse(centers, radii, { strength, safety, falloff: overlapFalloff });
  // 切线按曲率后处理平滑：弯折处环朝向渐变，脊柱不动（根/尖端行 pin 住）。
  smoothSweepFrames(frames, heat, {
    strength: tangentSmooth,
    iterations: 2,
    pinRows: new Set([0, actualLengthSegments])
  });

  curveParameters.forEach((t, row) => {
    const point = curve.getPoint(t);
    const frame = frames[row];
    const scaleX = sampleScale(lock.pointScales, t, "x");
    const scaleZ = sampleScale(lock.pointScales, t, "z");
    const warpedProfile = deps.strandProfileTopologyAt(lock, t, profileSlotPoints, scaleX, scaleZ);
    const color = deps.strandInfluenceColor(lock, t);
    profileSlots.forEach((profileSample, index) => {
      const warped = warpedProfile[index];
      const vertex = point.clone()
        .addScaledVector(frame.x, warped.x * factors[row])
        .addScaledVector(frame.z, warped.z * factors[row]);
      vertices.push(vertex.x, vertex.y, vertex.z);
      tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
      uvs.push(profileSample.u, t);
      colors.push(color.r, color.g, color.b);
    });
  });

  // Edge smoothing: longitudinal Laplacian over the emitted rings, using curvature
  // heat as per-vertex weights; the root row stays pinned.
  const sweepRows = actualLengthSegments + 1;
  const weights = new Array(sweepRows * profileVertexCount);
  for (let row = 0; row < sweepRows; row += 1) {
    for (let column = 0; column < profileVertexCount; column += 1) {
      weights[row * profileVertexCount + column] = heat[row];
    }
  }
  smoothSweepChains(vertices, sweepRows, profileVertexCount, {
    strength: edgeSmooth,
    iterations: 2,
    weights,
    pinRows: new Set([0])
  });

  for (let row = 0; row < actualLengthSegments; row += 1) {
    profileEdges.forEach((edge) => {
      const a = row * profileVertexCount + edge.start;
      const b = row * profileVertexCount + edge.end;
      const c = (row + 1) * profileVertexCount + edge.start;
      const d = (row + 1) * profileVertexCount + edge.end;
      indices.push(a, c, b, b, c, d);
      quadFaces.push([a, c, d, b]);
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.sideTriangleCount = actualLengthSegments * profileEdges.length * 2;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.gridRows = actualLengthSegments + 1;
  geometry.userData.gridColumns = profileVertexCount;
  geometry.userData.gridFacesPerRow = profileEdges.length;
  geometry.userData.gridSkipCol = deps.gridProfileSkipCol(profileEdges, profileVertexCount);
  geometry.userData.openSurface = true;
  // Per-vertex sweep grid indices (AHS_gridRow / AHS_gridCol primvars): the swept
  // card is row-major (actualLengthSegments+1 rows x profileVertexCount cols), no
  // end caps, so every vertex belongs to the grid.
  const totalVertices = vertices.length / 3;
  const gridRowIndices = new Float32Array(totalVertices).fill(-1);
  const gridColIndices = new Float32Array(totalVertices).fill(-1);
  for (let i = 0; i < totalVertices; i += 1) {
    gridRowIndices[i] = Math.floor(i / profileVertexCount);
    gridColIndices[i] = i % profileVertexCount;
  }
  geometry.userData.gridRowIndices = gridRowIndices;
  geometry.userData.gridColIndices = gridColIndices;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createPolyGeometry(lock) {
  const buffers = polyMeshBuffers(lock.points, lock.polyFaces);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(buffers.positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(buffers.uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(
    Array.from({ length: lock.points.length }, () => [1, 1, 1]).flat(),
    3
  ));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(
    Array.from({ length: lock.points.length }, () => [1, 0, 0, 1]).flat(),
    4
  ));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(
    Array.from({ length: lock.points.length }, () => [0, 1, 0]).flat(),
    3
  ));
  geometry.setIndex(buffers.indices);
  geometry.userData.quadFaces = buffers.quadFaces;
  geometry.userData.triangleQuadIds = buffers.triangleQuadIds;
  geometry.userData.openSurface = true;
  if (buffers.indices.length) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createConnectedCurveCardGeometry(lock) {
  const renderRows = THREE.MathUtils.clamp(
    Math.max(
      Math.round(Number(lock.lengthSegments) || 26) + 1,
      Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS)
    ),
    5,
    257
  );
  const controllers = deps.curveSurfaceCreate.sampledCurveSurfaceControllerCurves(lock, renderRows);
  const controllerSides = deps.curveSurfaceCreate.sampledCurveSurfaceControllerSides(lock, renderRows);
  const grid = buildConnectedCurveCardGrid(controllers, {
    rows: renderRows,
    stripWidth: lock.curveSurfaceStripWidth,
    side: lock.curveSurfaceSide || { x: 1, y: 0, z: 0 },
    controllerSides
  });
  const positions = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const quadFaces = [];
  grid.points.forEach((point, index) => {
    const row = Math.floor(index / Math.max(1, grid.columns));
    const column = index % Math.max(1, grid.columns);
    const previousRow = Math.max(0, row - 1);
    const nextRow = Math.min(grid.rows - 1, row + 1);
    const previous = grid.points[previousRow * grid.columns + column] || point;
    const next = grid.points[nextRow * grid.columns + column] || point;
    const tangent = new THREE.Vector3(next.x - previous.x, next.y - previous.y, next.z - previous.z);
    if (tangent.lengthSq() < 0.000001) tangent.set(0, 1, 0);
    tangent.normalize();
    const color = deps.strandInfluenceColor(lock, row / Math.max(1, grid.rows - 1));
    positions.push(point.x, point.y, point.z);
    tangents.push(tangent.x, tangent.y, tangent.z, 1);
    uvs.push(column / Math.max(1, grid.columns - 1), row / Math.max(1, grid.rows - 1));
    colors.push(color.r, color.g, color.b);
  });
  for (let row = 0; row < grid.rows - 1; row += 1) {
    for (let column = 0; column < grid.columns - 1; column += 1) {
      const a = row * grid.columns + column;
      const b = (row + 1) * grid.columns + column;
      const c = (row + 1) * grid.columns + column + 1;
      const d = row * grid.columns + column + 1;
      indices.push(a, b, c, a, c, d);
      quadFaces.push([a, b, c, d]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.openSurface = true;
  geometry.userData.curveSurfaceControllerCount = grid.controllerCurves.length;
  geometry.userData.actualLengthSegments = Math.max(0, grid.rows - 1);
  // Per-vertex sweep grid indices (AHS_gridRow / AHS_gridCol primvars): the card
  // grid is row-major (grid.rows x grid.columns), no end caps.
  const totalVertices = positions.length / 3;
  const gridRowIndices = new Float32Array(totalVertices).fill(-1);
  const gridColIndices = new Float32Array(totalVertices).fill(-1);
  for (let i = 0; i < totalVertices; i += 1) {
    gridRowIndices[i] = Math.floor(i / grid.columns);
    gridColIndices[i] = i % grid.columns;
  }
  geometry.userData.gridRowIndices = gridRowIndices;
  geometry.userData.gridColIndices = gridColIndices;
  if (indices.length) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createCompoundStrandGeometry(lock) {
  const controllerCount = Math.max(1, Math.round(Number(lock.curveSurfaceColumns) || 1));
  const controlRows = Math.max(2, Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  const compoundSide = lock.curveSurfaceSide?.clone?.() || new THREE.Vector3(
    Number(lock.curveSurfaceSide?.x || 1),
    Number(lock.curveSurfaceSide?.y || 0),
    Number(lock.curveSurfaceSide?.z || 0)
  );
  if (compoundSide.lengthSq() < 0.0001) compoundSide.set(1, 0, 0);
  compoundSide.normalize();
  const controllerLocks = Array.from({ length: controllerCount }, (_, index) => (
    deps.curveSurfaceCreate.curveSurfaceControllerFrameLock(lock, index)
  ));
  controllerLocks.forEach((controller, controllerIndex) => {
    const authoredStart = controllerIndex * controlRows;
    controller.pointSurfaceNormals = controller.points.map((point, pointIndex) => {
      const authored = lock.pointSurfaceNormals?.[authoredStart + pointIndex];
      if (authored?.lengthSq?.() > 0.0001) return authored.clone().normalize();
      const previous = controller.points[Math.max(0, pointIndex - 1)] || point;
      const next = controller.points[Math.min(controller.points.length - 1, pointIndex + 1)] || point;
      const tangent = next.clone().sub(previous).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, compoundSide).normalize();
      return normal.lengthSq() > 0.0001 ? normal : deps.outwardNormalAtPoint(point, tangent);
    });
  });
  const controllerCurves = controllerLocks.map((controller) => new THREE.CatmullRomCurve3(
    controller.points,
    false,
    "centripetal",
    0.5
  ));
  if (controllerCurves.length !== 3) return createConnectedCurveCardGeometry(lock);

  const profilePoints = deps.branchSweep.trimmedSweepProfile(
    (lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE)
      .map((point) => ({ ...point, z: point.z + Number(lock.profileOffset || 0) })),
    lock
  );
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 4, 24);
  const profileTopology = deps.branchSweep.createSweepProfileTopology(profilePoints, radialSegments, profileCurve);
  const profileSamples = profileTopology.samples.map((sample) => sample.point);

  const renderRows = THREE.MathUtils.clamp(
    Math.max(
      Math.round(Number(lock.lengthSegments) || 26) + 1,
      Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS)
    ),
    5,
    257
  );
  const vertices = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const quadFaces = [];
  const controllerFrames = controllerCurves.map(() => []);
  const previousControllerFrames = controllerCurves.map(() => null);
  for (let row = 0; row < renderRows; row += 1) {
    const t = row / Math.max(1, renderRows - 1);
    controllerCurves.forEach((curve, controllerIndex) => {
      const controllerFrame = deps.strandGeometryFrameAt(
        controllerLocks[controllerIndex],
        curve,
        t,
        previousControllerFrames[controllerIndex]
      );
      controllerFrames[controllerIndex].push(controllerFrame);
      previousControllerFrames[controllerIndex] = controllerFrame;
    });
  }

  const controllerSpanInFrame = controllerFrames[controllerCount - 1][0].point
    .clone()
    .sub(controllerFrames[0][0].point)
    .dot(controllerFrames[0][0].x);
  const bridgeProfileSamples = controllerSpanInFrame >= 0
    ? profileSamples
    : profileSamples.map((point) => ({ x: -point.x, z: point.z }));
  const bridgePlan = compoundProfileBridgePlan(bridgeProfileSamples, controllerCount);
  if (!bridgePlan) return createConnectedCurveCardGeometry(lock);

  const profileCount = profileSamples.length;
  const connectedSegmentCount = compoundConnectedSegmentCount(renderRows - 1);
  const vertexIndex = (row, controllerIndex, profileIndex) => (
    (row * controllerCount + controllerIndex) * profileCount + profileIndex
  );
  for (let row = 0; row < renderRows; row += 1) {
    const t = row / Math.max(1, renderRows - 1);
    const warpedProfiles = controllerLocks.map((controller) => deps.strandProfileTopologyAt(
      controller,
      t,
      profileSamples,
      sampleScale(controller.pointScales, t, "x"),
      sampleScale(controller.pointScales, t, "z")
    ));
    const color = deps.strandInfluenceColor(lock, t);
    warpedProfiles.forEach((profile, controllerIndex) => {
      const frame = controllerFrames[controllerIndex][row];
      const center = frame.point;
      profile.forEach((point, profileIndex) => {
        const vertex = center.clone()
          .addScaledVector(frame.x, point.x)
          .addScaledVector(frame.z, point.z);
        vertices.push(vertex.x, vertex.y, vertex.z);
        tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
        uvs.push((controllerIndex + profileIndex / profileCount) / controllerCount, t);
        colors.push(color.r, color.g, color.b);
      });
    });
  }

  const bridgeSmoothing = THREE.MathUtils.clamp(Number(lock.compoundBridgeSmoothing) || 0, 0, 1);
  const authoredBridgeLoops = THREE.MathUtils.clamp(
    Math.round(Number(lock.compoundBridgeLoops) || 0),
    0,
    8
  );
  const bridgeParameters = compoundBridgeParameters(
    Math.max(authoredBridgeLoops, bridgeSmoothing > 0 ? 1 : 0)
  );
  const bridgeSegmentCount = bridgeParameters.length - 1;
  const bridgeVertexIndices = bridgePlan.bridges.map((bridge) => (
    Array.from({ length: connectedSegmentCount + 1 }, (_, row) => {
      const leftIndex = vertexIndex(row, bridge.leftController, bridge.leftProfileIndex);
      const rightIndex = vertexIndex(row, bridge.rightController, bridge.rightProfileIndex);
      return bridgeParameters.map((parameter, parameterIndex) => {
        if (parameterIndex === 0) return leftIndex;
        if (parameterIndex === bridgeParameters.length - 1) return rightIndex;
        const leftPosition = new THREE.Vector3(
          vertices[leftIndex * 3],
          vertices[leftIndex * 3 + 1],
          vertices[leftIndex * 3 + 2]
        );
        const rightPosition = new THREE.Vector3(
          vertices[rightIndex * 3],
          vertices[rightIndex * 3 + 1],
          vertices[rightIndex * 3 + 2]
        );
        const tangent = controllerFrames[bridge.leftController][row].y.clone()
          .lerp(controllerFrames[bridge.rightController][row].y, parameter)
          .normalize();
        const bridgeSpan = leftPosition.distanceTo(rightPosition);
        const position = leftPosition.clone().lerp(rightPosition, parameter);
        const archWeight = compoundBridgeArchWeight(
          parameter,
          row / Math.max(1, connectedSegmentCount),
          bridgeSmoothing
        );
        position.addScaledVector(tangent, -bridgeSpan * 0.5 * archWeight);
        const t = row / Math.max(1, renderRows - 1);
        const color = deps.strandInfluenceColor(lock, t);
        const leftU = (bridge.leftController + bridge.leftProfileIndex / profileCount) / controllerCount;
        const rightU = (bridge.rightController + bridge.rightProfileIndex / profileCount) / controllerCount;
        const index = vertices.length / 3;
        vertices.push(position.x, position.y, position.z);
        tangents.push(tangent.x, tangent.y, tangent.z, 1);
        uvs.push(THREE.MathUtils.lerp(leftU, rightU, parameter), t);
        colors.push(color.r, color.g, color.b);
        return index;
      });
    })
  ));

  for (let row = 0; row < renderRows - 1; row += 1) {
    const connectedSection = row < connectedSegmentCount;
    for (let controllerIndex = 0; controllerIndex < controllerCount; controllerIndex += 1) {
      for (let profileIndex = 0; profileIndex < profileCount; profileIndex += 1) {
        if (connectedSection && bridgePlan.removedEdges[controllerIndex].includes(profileIndex)) continue;
        const nextProfile = (profileIndex + 1) % profileCount;
        const a = vertexIndex(row, controllerIndex, profileIndex);
        const b = vertexIndex(row, controllerIndex, nextProfile);
        const c = vertexIndex(row + 1, controllerIndex, profileIndex);
        const d = vertexIndex(row + 1, controllerIndex, nextProfile);
        indices.push(a, c, b, b, c, d);
        quadFaces.push([a, c, d, b]);
      }
    }
    if (connectedSection) {
      bridgePlan.bridges.forEach((bridge, bridgeIndex) => {
        const outward = controllerFrames[bridge.leftController][row].z.clone()
          .add(controllerFrames[bridge.rightController][row].z);
        if (outward.lengthSq() < 0.0001) {
          outward.copy(controllerFrames[bridge.leftController][row].z);
        }
        outward.normalize().multiplyScalar(bridge.surface === "upper" ? 1 : -1);
        for (let segment = 0; segment < bridgeSegmentCount; segment += 1) {
          const a = bridgeVertexIndices[bridgeIndex][row][segment];
          const b = bridgeVertexIndices[bridgeIndex][row][segment + 1];
          const c = bridgeVertexIndices[bridgeIndex][row + 1][segment];
          const d = bridgeVertexIndices[bridgeIndex][row + 1][segment + 1];
          pushOrientedTriangle(indices, vertices, a, c, b, outward);
          pushOrientedTriangle(indices, vertices, b, c, d, outward);
          quadFaces.push([a, c, d, b]);
        }
      });
    }
  }

  for (let seam = 0; seam < controllerCount - 1; seam += 1) {
    const upperBridgeIndex = seam * 2;
    const lowerBridgeIndex = upperBridgeIndex + 1;
    const capOutward = controllerFrames[seam][connectedSegmentCount].y.clone()
      .add(controllerFrames[seam + 1][connectedSegmentCount].y);
    if (capOutward.lengthSq() < 0.0001) {
      capOutward.copy(controllerFrames[seam][connectedSegmentCount].y);
    }
    capOutward.normalize();
    for (let segment = 0; segment < bridgeSegmentCount; segment += 1) {
      const upperLeft = bridgeVertexIndices[upperBridgeIndex][connectedSegmentCount][segment];
      const upperRight = bridgeVertexIndices[upperBridgeIndex][connectedSegmentCount][segment + 1];
      const lowerRight = bridgeVertexIndices[lowerBridgeIndex][connectedSegmentCount][segment + 1];
      const lowerLeft = bridgeVertexIndices[lowerBridgeIndex][connectedSegmentCount][segment];
      const face = orientedQuadFace(
        vertices,
        upperLeft,
        upperRight,
        lowerRight,
        lowerLeft,
        capOutward
      );
      indices.push(face[0], face[1], face[2], face[0], face[2], face[3]);
      quadFaces.push(face);
    }
  }
  const sideTriangleCount = indices.length / 3;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.sideTriangleCount = sideTriangleCount;
  geometry.userData.curveSurfaceControllerCount = controllerCount;
  geometry.userData.actualLengthSegments = renderRows - 1;
  geometry.userData.compoundStrand = true;
  geometry.userData.compoundConnectedSegmentCount = connectedSegmentCount;
  geometry.userData.compoundIndependentControllerFrames = true;
  geometry.userData.compoundBridgeLoops = authoredBridgeLoops;
  geometry.userData.compoundBridgeSmoothing = bridgeSmoothing;
  geometry.userData.compoundBridgeEndCapped = true;
  geometry.userData.openSurface = true;
  // Per-vertex sweep grid indices (AHS_gridRow / AHS_gridCol primvars): the base
  // controller grid is row-major (row, controller, profile) flattened to a single
  // column; appended compound-bridge vertices stay -1 (no grid meaning).
  const totalVertices = vertices.length / 3;
  const gridRowIndices = new Float32Array(totalVertices).fill(-1);
  const gridColIndices = new Float32Array(totalVertices).fill(-1);
  const baseGridCount = renderRows * controllerCount * profileCount;
  const columnsPerRow = controllerCount * profileCount;
  for (let i = 0; i < baseGridCount; i += 1) {
    gridRowIndices[i] = Math.floor(i / columnsPerRow);
    gridColIndices[i] = i % columnsPerRow;
  }
  geometry.userData.gridRowIndices = gridRowIndices;
  geometry.userData.gridColIndices = gridColIndices;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function proceduralBranchGeometryLock(parent, template, index) {
  const points = deps.proceduralBranchWorldPoints(parent, template);
  const start = THREE.MathUtils.clamp(Number(template.parameter), 0, 1);
  const width = Math.max(0.02, Number(parent.baseWidth ?? parent.width) * 0.28);
  const branch = {
    ...parent,
    id: `${parent.id || "procedural"}-generated-branch-${index}`,
    proceduralDrawGuide: false,
    proceduralBranchCount: 0,
    points,
    pointSurfaceNormals: [],
    pointScales: points.map(() => ({ x: 1, z: 1 })),
    pointWidths: points.map(() => 1),
    pointTwists: points.map(() => 0),
    baseWidth: width,
    width,
    depth: Math.max(0.02, Number(parent.depth ?? parent.width) * 0.28),
    length: new THREE.CatmullRomCurve3(points).getLength(),
    sweepProfile: ROUND_SWEEP_PROFILE,
    hairCard: false,
    strandSplitEnabled: false,
    surfaceNormalInfluence: 1,
    taperCurve: remapEnvelopeCurveRange(parent.taperCurve, start, 1),
    depthCurve: remapEnvelopeCurveRange(parent.depthCurve, start, 1),
    taperCurveSecondary: remapEnvelopeCurveRange(parent.taperCurveSecondary || parent.taperCurve, start, 1),
    depthCurveSecondary: remapEnvelopeCurveRange(parent.depthCurveSecondary || parent.depthCurve, start, 1)
  };
  branch.pointSurfaceNormals = deps.branchRootBone.stableBranchBaseNormals(branch);
  return branch;
}

function createHairGeometry(lock) {
  if (lock.branchRootRegion) {
    const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
    const parentGeometry = parent?.mesh?.geometry;
    // Topology connect needs a carveable parent grid (normal strand sweep exposing
    // quadFaces/gridRows). Split geometry / hair-card parents have no grid to carve,
    // so the child falls back to direct generation: sweep straight from its root.
    const parentSupportsTopologyConnect = Boolean(
      parentGeometry
      && Number(parentGeometry.userData?.gridRows || 0) >= 2
      && Array.isArray(parentGeometry.userData?.quadFaces)
      && parentGeometry.userData.quadFaces.length > 0
    );
    if (parentSupportsTopologyConnect) {
      const branchChildGeometry = deps.branchBridge.createBranchChildGeometry(lock);
      if (branchChildGeometry) return branchChildGeometry;
    }
  }
  const baseGeometry = createBaseHairGeometry(lock);
  if (!lock?.proceduralDrawGuide || Number(lock.proceduralBranchCount || 0) <= 0 || lock.points?.length < 3) {
    return baseGeometry;
  }
  const templates = deps.proceduralBranchTemplatesForGuide(
    lock,
    lock.proceduralBranchCount,
    lock.proceduralBranchLength,
    lock.proceduralBranchTipOffset
  );
  if (!templates.length) return baseGeometry;
  const geometries = [
    baseGeometry,
    ...templates.map((template, index) => createBaseHairGeometry(
      proceduralBranchGeometryLock(lock, template, index)
    ))
  ];
  const geometry = mergeGeometries(geometries, false);
  if (!geometry) {
    geometries.slice(1).forEach((item) => item.dispose());
    return baseGeometry;
  }
  const sideTriangleCount = geometries.reduce(
    (total, item) => total + Number(item.userData.sideTriangleCount || 0),
    0
  );
  geometries.forEach((item) => item.dispose());
  geometry.userData.sideTriangleCount = sideTriangleCount;
  geometry.userData.proceduralBranchCount = templates.length;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createBaseHairGeometry(lock) {

  if (lock.geometryType === "poly") return createPolyGeometry(lock);
  if (lock.geometryType === "curve-surface") {
    return lock.curveSurfaceCompoundProfile
      ? createCompoundStrandGeometry(lock)
      : createConnectedCurveCardGeometry(lock);
  }
  if (["panel", "surface"].includes(lock.geometryType)) return deps.panelTipStrand.createPanelStrandGeometry(lock);
  if (lock.geometryType === "braid") {
    const braidGeometry = deps.createBraidGeometry(lock);
      if (braidGeometry) return braidGeometry;
  }
  const curve = deps.strandGeometryCurve(lock);
  const baseProfilePoints = (lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE)
    .map((point) => ({ ...point, z: point.z + Number(lock.profileOffset || 0) }));
  const profilePoints = deps.branchSweep.trimmedSweepProfile(baseProfilePoints, lock);
  if (lock.geometryType === "strand" && lock.hairCard) return createHairCardGeometry(lock, curve, profilePoints);
  if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    const splitGeometry = createSplitStrandGeometry(lock, curve, profilePoints);
    if (splitGeometry) return splitGeometry;
  }
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 4, 24);
  const profileTopology = deps.branchSweep.createSweepProfileTopology(profilePoints, radialSegments, profileCurve);
  const profileVertexCount = profileTopology.slots.length;
  const profileSlotPoints = profileTopology.slots.map((profileSample) => profileSample.point);
  // Shared sweep kernel: default strand path uses absolute taper scaling from t=0.
  const sweep = deps.strandSweep.sweepSide({
    lock,
    curve,
    profilePoints: profileSlotPoints,
    profileEdges: profileTopology.edges,
    startT: 0,
    seedFrame: null,
    rootRelative: false
  });
  const { vertices, normals, tangents, uvs, colors, indices, quadFaces, actualLengthSegments } = sweep;

  // Route 1: regular-strand single tip sub-bone (strandTip). When strandTip is null
  // (or a row's tip weight is <= 0) the whole path stays identical to the base sweep.
  const authoredStrandTip = (lock.geometryType === "strand" && !lock.strandSplitEnabled) ? strandTipFor(lock) : null;
  const strandTip = authoredStrandTip && authoredStrandTip.active !== false ? authoredStrandTip : null;
  const tipStart = strandTip ? THREE.MathUtils.clamp(Number(lock.strandTipStart ?? 0.75), 0.2, 0.95) : null;
  let tipChain = null;
  let tipFrames = null;
  if (strandTip) {
    // Same lengthSegments derivation as the shared sweep kernel, so the re-projection
    // rows align 1:1 with the swept vertices (tipCurveParameters.length ===
    // actualLengthSegments + 1; both call deps.strandCurveParameters on the same curve).
    const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
    const tipLengthSegments = THREE.MathUtils.clamp(Math.max(Math.round(lock.lengthSegments || 26), curlSegments), 4, 256);
    const tipCurveParameters = deps.strandCurveParameters(lock, curve, tipLengthSegments);
    tipFrames = [];
    let tipPrevFrame = null;
    for (let row = 0; row <= actualLengthSegments; row += 1) {
      tipPrevFrame = deps.strandGeometryFrameAt(lock, curve, tipCurveParameters[row], tipPrevFrame);
      tipFrames.push(tipPrevFrame);
    }
    // Tip chain: rest runs along the strand's own center line (curve.getPoint); the
    // authored lock.strandTip deltas are re-applied over that rest by materializeTipChain.
    const tipCount = Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2);
    tipChain = materializeTipChain(strandTip, (t) => curve.getPoint(t), tipCount);
    // Re-project tip rows: blend each swept ring toward the tip chain's own frame by
    // the t-only tip weight (0 before tipStart, 1 at the strand end). Vertex
    // indices/faces are unchanged.
    for (let row = 0; row <= actualLengthSegments; row += 1) {
      const t = tipCurveParameters[row];
      const w = tipWeightAt(t, tipStart);
      if (w <= 0) continue;
      const frame = tipFrames[row];
      const referenceZ = frame.z.clone();
      const tipFrame = tipChainFrameAt(tipChain, tipChain, t, referenceZ);
      const tipCenter = sampleTipPosition(tipChain, t);
      const scaleX = sampleScale(lock.pointScales, t, "x");
      const scaleZ = sampleScale(lock.pointScales, t, "z");
      const warped = deps.strandProfileTopologyAt(lock, t, profileSlotPoints, scaleX, scaleZ);
      for (let column = 0; column < profileVertexCount; column += 1) {
        const idx = row * profileVertexCount + column;
        const original = new THREE.Vector3(vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]);
        const target = new THREE.Vector3(tipCenter.x, tipCenter.y, tipCenter.z)
          .addScaledVector(tipFrame.x, warped[column].x)
          .addScaledVector(tipFrame.z, warped[column].z);
        const final = original.clone().lerp(target, w);
        vertices[idx * 3] = final.x;
        vertices[idx * 3 + 1] = final.y;
        vertices[idx * 3 + 2] = final.z;
      }
    }
  }

  const startPoint = curve.getPoint(0);
  let endPoint = curve.getPoint(1);
  const startCenter = vertices.length / 3;
  vertices.push(startPoint.x, startPoint.y, startPoint.z);
  normals.push(0, 1, 0);
  const startFrame = deps.strandGeometryFrameAt(lock, curve, 0);
  tangents.push(startFrame.x.x, startFrame.x.y, startFrame.x.z, 1);
  uvs.push(0.5, 0);
  const startColor = deps.strandInfluenceColor(lock, 0);
  colors.push(startColor.r, startColor.g, startColor.b);
  const endCenter = vertices.length / 3;
  let endFrame = deps.strandGeometryFrameAt(lock, curve, 1);
  // Tip end cap: the cap center and outward follow the tip chain end (length edits
  // may extend past the rest curve end). startPoint/startFrame stay on the rest curve.
  if (strandTip && tipFrames && tipChain) {
    const tipEndReferenceZ = tipFrames[actualLengthSegments].z.clone();
    const tipEndFrame = tipChainFrameAt(tipChain, tipChain, 1, tipEndReferenceZ);
    const tipEndPoint = sampleTipPosition(tipChain, 1);
    endPoint = new THREE.Vector3(tipEndPoint.x, tipEndPoint.y, tipEndPoint.z);
    endFrame = tipEndFrame;
  }
  vertices.push(endPoint.x, endPoint.y, endPoint.z);
  normals.push(0, -1, 0);
  tangents.push(endFrame.x.x, endFrame.x.y, endFrame.x.z, 1);
  uvs.push(0.5, 1);
  const endColor = deps.strandInfluenceColor(lock, 1);
  colors.push(endColor.r, endColor.g, endColor.b);

  profileTopology.edges.forEach((edge) => {
    const a = edge.start;
    const b = edge.end;
    const c = actualLengthSegments * profileVertexCount + edge.start;
    const d = actualLengthSegments * profileVertexCount + edge.end;
    pushOrientedTriangle(indices, vertices, startCenter, a, b, startFrame.y.clone().negate());
    pushOrientedTriangle(indices, vertices, endCenter, c, d, endFrame.y);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.sideTriangleCount = actualLengthSegments * profileTopology.edges.length * 2;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.gridRows = actualLengthSegments + 1;
  geometry.userData.gridColumns = profileTopology.slots.length;
  geometry.userData.gridFacesPerRow = profileTopology.edges.length;
  geometry.userData.gridSkipCol = deps.gridProfileSkipCol(profileTopology.edges, profileTopology.slots.length);
  geometry.userData.quadFaces = quadFaces;
  // Per-vertex sweep grid indices (rows x cols, row-major); the two end-cap
  // center vertices stay -1 so downstream exporters can rebuild the sweep
  // topology from these (AHS_gridRow / AHS_gridCol primvars).
  const sweptCount = (actualLengthSegments + 1) * profileVertexCount;
  const gridRowIndices = new Float32Array(sweptCount + 2).fill(-1);
  const gridColIndices = new Float32Array(sweptCount + 2).fill(-1);
  for (let i = 0; i < sweptCount; i += 1) {
    gridRowIndices[i] = Math.floor(i / profileVertexCount);
    gridColIndices[i] = i % profileVertexCount;
  }
  geometry.userData.gridRowIndices = gridRowIndices;
  geometry.userData.gridColIndices = gridColIndices;
  geometry.computeVertexNormals();
  return geometry;
}

  return {
    clipStrandProfilePolygon,
    pushOrientedTriangle,
    orientedQuadFace,
    createSplitStrandGeometry,
    createHairCardGeometry,
    createPolyGeometry,
    createConnectedCurveCardGeometry,
    createCompoundStrandGeometry,
    proceduralBranchGeometryLock,
    createHairGeometry,
    createBaseHairGeometry
  };
}
