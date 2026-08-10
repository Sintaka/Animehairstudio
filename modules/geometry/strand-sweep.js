// strand-sweep.js — shared strand sweep kernel (0.2.59, P2).
// Unifies the default strand sweep (createBaseHairGeometry strand path) and the
// child-strand sweep (createBranchChildGeometry): both are "sweep a profile along a
// curve with transported frames". Callers add caps/bridge + geometry metadata.
import * as THREE from "three";

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
      profilePoints.forEach((profilePoint, index) => {
        const w = warped[index];
        const ring = frame.x.clone().multiplyScalar(w.x).addScaledVector(frame.z, w.z);
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