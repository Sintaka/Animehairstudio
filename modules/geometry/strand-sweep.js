// strand-sweep.js — shared strand sweep kernel (0.2.59, P2).
// Unifies the default strand sweep (createBaseHairGeometry strand path) and the
// child-strand sweep (createBranchChildGeometry): both are "sweep a profile along a
// curve with transported frames". Callers add caps/bridge + geometry metadata.
import * as THREE from "three";
import { sweepCurvatureResponse, smoothSweepChains, smoothSweepFrames } from "./curve-math.js?v=20260910-5";

export const SWEEP_OVERLAP_DEFAULTS = Object.freeze({ strength: 0.7, threshold: 0.6, edgeSmooth: 0.3, falloff: 3, tangentSmooth: 0.3 });

export function createStrandSweepApi(deps) {
  // deps: strandCurveParameters, strandGeometryFrameAt, strandProfileTopologyAt,
  //       strandInfluenceColor, sampleScale
  function sweepSide(options) {
    const {
      lock,
      curve,
      profilePoints,          // array of {x, z(, t?)} profile points (closed ring)
      profileEdges = null,    // quad edges (start/end slot indices); default = consecutive ring
      startT = 0,
      seedFrame = null,       // first-row frame override (child root bone)
      rootRelative = false    // child: normalize per-ring warp to the root ring
    } = options;
    const profileCount = profilePoints.length;
    const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
    const lengthSegments = THREE.MathUtils.clamp(
      Math.max(Math.round(lock.lengthSegments || 26), curlSegments),
      4,
      256
    );
    const curveParameters = deps.strandCurveParameters(lock, curve, lengthSegments);
    const actualLengthSegments = curveParameters.length - 1;
    const vertices = [];
    const normals = [];
    const tangents = [];
    const uvs = [];
    const colors = [];
    const rootWarp = rootRelative
      ? deps.strandProfileTopologyAt(lock, startT, profilePoints, 1, 1)
      : null;
    const overlapStrength = THREE.MathUtils.clamp(
      Number(lock.sweepOverlapStrength ?? SWEEP_OVERLAP_DEFAULTS.strength),
      0,
      1
    );
    const overlapThreshold = Math.max(0.01, Number(lock.sweepOverlapThreshold ?? SWEEP_OVERLAP_DEFAULTS.threshold));
    const overlapFalloff = Math.max(0, Math.min(8, Math.floor(Number(lock.sweepOverlapFalloff ?? SWEEP_OVERLAP_DEFAULTS.falloff) || 0)));
    const edgeSmooth = THREE.MathUtils.clamp(
      Number(lock.sweepEdgeSmooth ?? SWEEP_OVERLAP_DEFAULTS.edgeSmooth),
      0,
      1
    );
    const tangentSmooth = THREE.MathUtils.clamp(
      Number(lock.sweepTangentSmooth ?? SWEEP_OVERLAP_DEFAULTS.tangentSmooth),
      0,
      1
    );
    // Pass 1: per-row guide/point/frame/color/warped plus curvature inputs (centers, radii).
    const rowsData = [];
    const centers = [];
    const radii = [];
    let previousFrame = null;
    curveParameters.forEach((t, row) => {
      const guideT = startT + (1 - startT) * t;
      const point = curve.getPoint(guideT);
      const frame = row === 0 && seedFrame
        ? seedFrame
        : deps.strandGeometryFrameAt(lock, curve, guideT, previousFrame);
      previousFrame = frame;
      const color = deps.strandInfluenceColor(lock, guideT);
      let warped;
      if (rootRelative) {
        const w = deps.strandProfileTopologyAt(lock, guideT, profilePoints, 1, 1);
        warped = profilePoints.map((p, index) => ({
          x: p.x * (rootWarp[index]?.x ? w[index].x / rootWarp[index].x : 1),
          z: p.z * (rootWarp[index]?.z ? w[index].z / rootWarp[index].z : 1)
        }));
      } else {
        const scaleX = deps.sampleScale(lock.pointScales, guideT, "x");
        const scaleZ = deps.sampleScale(lock.pointScales, guideT, "z");
        warped = deps.strandProfileTopologyAt(lock, guideT, profilePoints, scaleX, scaleZ);
      }
      rowsData.push({ guideT, point, frame, color, warped });
      centers.push({ x: point.x, y: point.y, z: point.z });
      radii.push(warped.reduce((largest, w) => Math.max(largest, Math.abs(w.x), Math.abs(w.z)), 0));
    });
    // Curvature-aware narrowing: bend rings shrink so neighboring rings stop intersecting.
    const { factors, heat } = sweepCurvatureResponse(centers, radii, {
      strength: overlapStrength,
      safety: overlapThreshold,
      falloff: overlapFalloff
    });
    // 切线按曲率后处理平滑：弯折处环朝向渐变，脊柱不动（根/尖端行 pin 住）。
    smoothSweepFrames(rowsData.map((row) => row.frame), heat, {
      strength: tangentSmooth,
      iterations: 2,
      pinRows: new Set([0, actualLengthSegments])
    });
    // Pass 2: emit geometry with the per-row narrowing factor applied to the warped ring.
    rowsData.forEach(({ guideT, point, frame, color, warped }, row) => {
      const factor = factors[row] ?? 1;
      profilePoints.forEach((profilePoint, index) => {
        const w = warped[index];
        const ring = frame.x.clone().multiplyScalar(w.x * factor).addScaledVector(frame.z, w.z * factor);
        const v = point.clone().add(ring);
        vertices.push(v.x, v.y, v.z);
        normals.push(ring.x, ring.y, ring.z);
        tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
        uvs.push(
          rootRelative ? index / Math.max(1, profileCount) : (profilePoint.t ?? index / Math.max(1, profileCount - 1)),
          guideT
        );
        colors.push(color.r, color.g, color.b);
      });
    });
    // Edge smoothing along longitudinal chains (heat-weighted); root ring stays pinned.
    const smoothWeights = [];
    for (let row = 0; row <= actualLengthSegments; row += 1) {
      const rowHeat = heat[row] ?? 0;
      for (let column = 0; column < profileCount; column += 1) {
        smoothWeights[row * profileCount + column] = rowHeat;
      }
    }
    smoothSweepChains(vertices, actualLengthSegments + 1, profileCount, {
      strength: edgeSmooth,
      iterations: 2,
      weights: smoothWeights,
      pinRows: new Set([0])
    });
    const edges = Array.isArray(profileEdges) && profileEdges.length
      ? profileEdges
      : profilePoints.map((_, index) => ({ start: index, end: (index + 1) % profileCount }));
    const indices = [];
    const quadFaces = [];
    for (let row = 0; row < actualLengthSegments; row += 1) {
      edges.forEach((edge) => {
        const a = row * profileCount + edge.start;
        const b = row * profileCount + edge.end;
        const c = (row + 1) * profileCount + edge.start;
        const d = (row + 1) * profileCount + edge.end;
        indices.push(a, c, b, b, c, d);
        quadFaces.push([a, c, d, b]);
      });
    }
    return {
      vertices,
      normals,
      tangents,
      uvs,
      colors,
      indices,
      quadFaces,
      actualLengthSegments,
      profileCount
    };
  }
  return { sweepSide };
}