// branch-bridge.js — child-strand bridge geometry + parent-hole carving (refactor 3d-3b).
// Extracted from app.js; coupling injected via createBranchBridgeApi(deps).
import * as THREE from "three";
import { clampRegionParam } from "./branch-region-panel.js";
import { squareChildRing, holeBoundary, connectSide, connectBoundaryToRing } from "./branch-connect.js";

export function createBranchBridgeApi(deps) {
  // deps: strandCurveParameters, strandGeometryFrameAt, strandProfileTopologyAt,
  //   strandControlPointFrame, curveFrameAt, guidedNormalAt, controlPointRotationAt,
  //   toGridCol, fusedIndexAt, strandGeometryCurve, strandInfluenceColor,
  //   branchChildrenFor, updateBranchChildren, locks, branchState (store proxy)

function buildBranchBridgeGeometry(lock, parent, surface, ringWorld, parentGeom) {
  const positionAttr = parentGeom?.getAttribute?.("position");
  const normalAttr = parentGeom?.getAttribute?.("normal");
  const tangentAttr = parentGeom?.getAttribute?.("tangent");
  if (!positionAttr) return null;
  const rows = Number(parentGeom.userData?.gridRows || 0);
  const cols = Number(parentGeom.userData?.gridColumns || 0);
  if (rows < 2 || cols < 2) return null;
  const boundary = holeBoundary(surface, positionAttr.array, rows, cols, surface.gridIndexAt || ((r, c) => r * cols + c));
  if (!boundary) return null;
  // Child ring surface normal: the band must depart tangent to the child's surface at
  // the root ring (B-spline-like smooth transition on both ends), not only arrive flat
  // at the parent hole. The ring is the sweep's row-0 ring at branchSweepStartT.
  let childRingNormal = new THREE.Vector3(0, 1, 0);
  try {
    const childCurve = deps.strandGeometryCurve(lock);
    const sweepStartT = THREE.MathUtils.clamp(Number(lock.branchSweepStartT ?? 0.1), 0.02, 0.6);
    childRingNormal = deps.strandGeometryFrameAt(lock, childCurve, sweepStartT).z.clone().normalize();
  } catch (e) { /* keep default */ }
  const vertices = [];
  const normals = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const rootColor = deps.strandInfluenceColor(lock, 0);
  // Bridge vertices sitting exactly on the parent hole boundary: keep child vertex
  // index -> parent grid index so createBranchChildGeometry can restore the parent's
  // authored normals after computeVertexNormals (smooths the seam shading).
  const boundaryParentIndices = [];
  const pushBoundary = (v) => {
    const childIndex = vertices.length / 3;
    vertices.push(v.x, v.y, v.z);
    let nx = 0; let ny = 1; let nz = 0;
    if (normalAttr && v.index != null) {
      nx = normalAttr.getX(v.index); ny = normalAttr.getY(v.index); nz = normalAttr.getZ(v.index);
      boundaryParentIndices.push(childIndex, v.index);
    }
    normals.push(nx, ny, nz);
    let tx = 1; let ty = 0; let tz = 0;
    if (tangentAttr && v.index != null) {
      tx = tangentAttr.getX(v.index); ty = tangentAttr.getY(v.index); tz = tangentAttr.getZ(v.index);
    }
    tangents.push(tx, ty, tz, 1);
    uvs.push(0.5, 0);
    colors.push(rootColor.r, rootColor.g, rootColor.b);
  };
  const indexAt = surface.gridIndexAt || ((r, c) => r * cols + c);
  const boundaryAt = (r, c) => boundary.vertices.find((v) => v.index === indexAt(r, c));
  const quads = [];
  const triangles = [];
  const indices = [];
  // Hole height in faces (number of hole side edges per side). The top band gets one
  // segment per side edge so its corner column always matches the hole side topology.
  const holeHeight = Math.max(1, Math.round(surface.rowMax - surface.rowMin + 1));
  // Child root row and the Hermite basis are shared by the top and bottom bands.
  // Child root row follows the region CENTER ANCHOR (orange marker / region.center):
  // moving the whole region or the root bone translates it, while editing a single
  // edge (e.g. only the bottom) keeps the anchor and the bridge in place. It is
  // clamped inside the hole so the side bridges never fall off the boundary.
  const centerU = THREE.MathUtils.clamp(
    Number(lock.branchRootRegion?.center?.u ?? (surface.rowMin + surface.rowMax) / 2 / Math.max(1, rows - 1)),
    0,
    1
  );
  const rootRow = THREE.MathUtils.clamp(
    Math.round(centerU * Math.max(1, rows - 1)),
    surface.rowMin,
    surface.rowMax
  );
  const hermite = (t, p0, p1, m0, m1) => {
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return new THREE.Vector3()
      .addScaledVector(p0, h00)
      .addScaledVector(m0, h10)
      .addScaledVector(p1, h01)
      .addScaledVector(m1, h11);
  };

  // Ring lateral width (the W in Wx1): derived from the ring vertex count.
  const ringWidth = (ringWorld.length - 2) / 2;
  // Bottom bridge: ring bottom <-> hole bottom, banded like the top with
  // root-relative segments. The parent-end tangent keeps a sharp crease: half the
  // surface tangent plus half the reversed parent normal (not full tangent influence).
  const bottomSide = boundary.sides.find((s) => s.name === "bottom");
  const bottomVerts = [];
  for (let i = 0; i <= bottomSide.count; i += 1) {
    bottomVerts.push(boundary.vertices[(bottomSide.start + i) % boundary.vertices.length]);
  }
  const collapsed = [];
  bottomVerts.forEach((v) => {
    const prev = collapsed[collapsed.length - 1];
    if (!prev || Math.abs(v.x - prev.x) > 1e-6 || Math.abs(v.y - prev.y) > 1e-6 || Math.abs(v.z - prev.z) > 1e-6) collapsed.push(v);
  });
  let bottomBoundaryBase = collapsed.length >= 2 ? vertices.length / 3 : -1;
  if (collapsed.length >= 2) collapsed.forEach(pushBoundary);
  const bottomInfo = { holeBase: -1, midBase: -1, midCount: 0, width: 0 };
  if (collapsed.length >= 2) {
    const ringBottom = ringWorld.slice(ringWidth + 1);
    const bottomSegments = rootRow <= surface.rowMax
      ? Math.max(1, surface.rowMax - rootRow)
      : holeHeight;
    const bottomMidCount = bottomSegments - 1;
    let bottomNormal = new THREE.Vector3(0, 0, 1);
    try {
      bottomNormal = deps.curveFrameAt(parent, THREE.MathUtils.clamp(surface.rowMax / Math.max(1, rows - 1), 0, 1)).z.clone();
    } catch (e) { /* keep default */ }
    bottomInfo.holeBase = vertices.length / 3;
    collapsed.forEach(pushBoundary);
    bottomInfo.midBase = vertices.length / 3;
    const emitBottomMidRow = (f) => {
      ringBottom.forEach((p, i) => {
        if (i >= collapsed.length) return;
        const h = collapsed[i];
        const p0 = new THREE.Vector3(p.x, p.y, p.z);
        const p1 = new THREE.Vector3(h.x, h.y, h.z);
        const span = p0.distanceTo(p1);
        const m0 = new THREE.Vector3().subVectors(p1, p0);
        const dir = m0.clone().normalize();
        // Depart the ring tangent to the child surface (remove the child normal
        // component) so the root-ring side connects smoothly like the top band.
        const childTangent = m0.clone().addScaledVector(childRingNormal, -m0.dot(childRingNormal));
        const m0Out = childTangent.lengthSq() > 1e-8 ? childTangent : m0;
        const tangent = m0.clone().addScaledVector(bottomNormal, -m0.dot(bottomNormal));
        const tangentDir = tangent.lengthSq() > 1e-8 ? tangent.normalize() : dir;
        // Sharp crease at the parent: half surface tangent + half reversed parent normal.
        const creaseDir = new THREE.Vector3()
          .addScaledVector(tangentDir, 0.5)
          .addScaledVector(bottomNormal.clone().negate(), 0.5)
          .normalize();
        const m1 = creaseDir.multiplyScalar(span);
        const mid = hermite(f, p0, p1, m0Out, m1);
        pushBoundary({ x: mid.x, y: mid.y, z: mid.z });
      });
    };
    for (let j = 1; j <= bottomMidCount; j += 1) emitBottomMidRow(j / bottomSegments);
    if (rootRow !== surface.rowMax) {
      // Endpoint special op (mirrors top band): subdivide the last segment at 0.3 from
      // the parent so the side fill has an extra loop. Fires whenever the root is not
      // pinned to the region's bottom edge - i.e. any side gap (>=1 edge) below the
      // direct bridge, including a 1-segment indirect band. Direct bridge (root at the
      // bottom edge) is closed on its own and needs no extra loop.
      emitBottomMidRow(1 - 0.3 / bottomSegments);
      bottomInfo.midCount = bottomMidCount + 1;
    } else {
      // Direct bridge: band touches the root-level side fill directly, no extra loop.
      bottomInfo.midCount = 0;
    }
    bottomInfo.width = collapsed.length;
  }

  // Side direct bridges: ring left/right (1 edge each) <-> hole side bottom edge.
  // The strand grid columns are inverted vs the ring's left/right in world space
  // (ring-left is the more-negative-x side, matching parent colMax+1).
  const sideSpecs = [
    { name: "left", col: surface.colMax + 1, ringTop: ringWidth, ringBottom: ringWidth + 1 },
    { name: "right", col: surface.colMin, ringTop: 0, ringBottom: 2 * ringWidth + 1, flip: true }
  ];
  const sideBases = {};
  sideSpecs.forEach((spec) => {
    // The ring's 2x1 side (the "1") is the direct bridge: connect to the parent hole
    // side edge at the child root level (the middle deleted face), not the bottom.
    const vTop = boundaryAt(rootRow, spec.col);
    const vBottom = boundaryAt(rootRow + 1, spec.col);
    if (!vTop || !vBottom) return;
    sideBases[spec.name] = vertices.length / 3;
    pushBoundary(vTop);
    pushBoundary(vBottom);
  });

  // Top band: ring top (0,1,2) <-> hole top, holeHeight segments per column. Middle
  // rows use smoothstep interpolation plus a tapered bridge-round (0 at both ends,
  // max mid-band) so the band stays anchored at ring and hole and follows rebuilds.
  const topSide = boundary.sides.find((s) => s.name === "top");
  const topVerts = [];
  for (let i = 0; i <= topSide.count; i += 1) {
    topVerts.push(boundary.vertices[(topSide.start + i) % boundary.vertices.length]);
  }
  const holeTop = [];
  topVerts.forEach((v) => {
    const prev = holeTop[holeTop.length - 1];
    if (!prev || Math.abs(v.x - prev.x) > 1e-6 || Math.abs(v.y - prev.y) > 1e-6 || Math.abs(v.z - prev.z) > 1e-6) holeTop.push(v);
  });
  const topInfo = { holeBase: -1, midBase: -1, midCount: 0, width: 0, outward: null };
  if (holeTop.length >= 2) {
    const ringTop = ringWorld.slice(0, ringWidth + 1);
    // Segments are measured from the child root row to the hole top, not the full hole
    // height: extending the hole's bottom must not add top-band segments.
    const topSegments = rootRow >= surface.rowMin
      ? Math.max(1, rootRow - surface.rowMin)
      : holeHeight;
    const midCount = topSegments - 1;
    const across = new THREE.Vector3().subVectors(ringTop[ringWidth], ringTop[0]);
    const up = new THREE.Vector3()
      .addVectors(
        new THREE.Vector3().subVectors(holeTop[0], ringTop[0]),
        new THREE.Vector3().subVectors(holeTop[holeTop.length - 1], ringTop[ringWidth])
      )
      .multiplyScalar(0.5);
    const outward = new THREE.Vector3().crossVectors(across, up);
    if (outward.lengthSq() < 1e-8) outward.set(0, 1, 0);
    outward.normalize();
    let parentNormal = new THREE.Vector3(0, 0, 1);
    try {
      parentNormal = deps.curveFrameAt(parent, THREE.MathUtils.clamp(surface.rowMin / Math.max(1, rows - 1), 0, 1)).z.clone();
    } catch (e) { /* keep default */ }
    topInfo.holeBase = vertices.length / 3;
    holeTop.forEach(pushBoundary);
    topInfo.midBase = vertices.length / 3;
    const emitTopMidRow = (f) => {
      ringTop.forEach((p, i) => {
        if (i >= holeTop.length) return;
        const h = holeTop[i];
        const p0 = new THREE.Vector3(p.x, p.y, p.z);
        const p1 = new THREE.Vector3(h.x, h.y, h.z);
        // Depart the ring tangent to the child surface and arrive at the hole tangent
        // to the parent surface (chord projected onto each side's tangent plane), so
        // the band blends flatly at both ends like a B-spline rather than only at the
        // parent end.
        const m0 = new THREE.Vector3().subVectors(p1, p0);
        const ringTangent = m0.clone().addScaledVector(childRingNormal, -m0.dot(childRingNormal));
        if (ringTangent.lengthSq() < 1e-8) ringTangent.copy(m0);
        const m1 = m0.clone().addScaledVector(parentNormal, -m0.dot(parentNormal));
        if (m1.lengthSq() < 1e-8) m1.copy(m0);
        const mid = hermite(f, p0, p1, ringTangent, m1);
        pushBoundary({ x: mid.x, y: mid.y, z: mid.z });
      });
    };
    for (let j = 1; j <= midCount; j += 1) emitTopMidRow(j / topSegments);
    if (rootRow !== surface.rowMin) {
      // Special op: subdivide the last segment at 0.3 of its height from the parent so
      // the side fill always has an extra loop to attach quads (never ends in a triangle).
      // Fires whenever the root is not pinned to the region's top edge - i.e. any side
      // gap (>=1 edge) above the direct bridge, including a 1-segment indirect band.
      // Direct bridge (root at the top edge) is closed on its own and needs no extra loop.
      emitTopMidRow(1 - 0.3 / topSegments);
      topInfo.midCount = midCount + 1;
    } else {
      // Direct bridge: band touches the root-level side fill directly, no extra loop.
      topInfo.midCount = 0;
    }
    topInfo.width = holeTop.length;
    topInfo.outward = outward;
  }


  // Side-fill hole-side vertex cache. Intermediate hole-side rows are PRE-PUSHED
  // here, before ringBase is fixed: pushing them later (in the fill pass) would grow
  // the bridge vertex array and shift every ring index already referenced by the band
  // faces, corrupting the whole bridge (seen as the top band breaking for M>1).
  const sideHoleCache = new Map();
  const sideHoleVertex = (r, c) => {
    const key = r + "," + c;
    if (sideHoleCache.has(key)) return sideHoleCache.get(key);
    const v = boundaryAt(r, c);
    if (!v) return -1;
    const idx = vertices.length / 3;
    pushBoundary(v);
    sideHoleCache.set(key, idx);
    return idx;
  };
  // Pre-seed corners and direct-bridge rows (already pushed by the bands / direct
  // bridge) so the fill never duplicates vertices (watertight with the bands).
  if (topInfo.holeBase >= 0 && topInfo.width === ringWidth + 1) {
    sideHoleCache.set(surface.rowMin + "," + (surface.colMax + 1), topInfo.holeBase + topInfo.width - 1);
    sideHoleCache.set(surface.rowMin + "," + surface.colMin, topInfo.holeBase + 0);
  }
  if (bottomInfo.holeBase >= 0 && bottomInfo.width === ringWidth + 1) {
    sideHoleCache.set((surface.rowMax + 1) + "," + (surface.colMax + 1), bottomInfo.holeBase + 0);
    sideHoleCache.set((surface.rowMax + 1) + "," + surface.colMin, bottomInfo.holeBase + bottomInfo.width - 1);
  }
  if (sideBases.left != null) {
    sideHoleCache.set(rootRow + "," + (surface.colMax + 1), sideBases.left);
    sideHoleCache.set((rootRow + 1) + "," + (surface.colMax + 1), sideBases.left + 1);
  }
  if (sideBases.right != null) {
    sideHoleCache.set(rootRow + "," + surface.colMin, sideBases.right);
    sideHoleCache.set((rootRow + 1) + "," + surface.colMin, sideBases.right + 1);
  }
  if (deps.BRANCH_SIDE_FILL_ENABLED) {
    const topOk = topInfo.holeBase >= 0 && topInfo.width === ringWidth + 1
      && rootRow > surface.rowMin && topInfo.midCount === rootRow - surface.rowMin;
    const bottomOk = bottomInfo.holeBase >= 0 && bottomInfo.width === ringWidth + 1
      && rootRow < surface.rowMax && bottomInfo.midCount === surface.rowMax - rootRow;
    if (topOk) {
      const M = rootRow - surface.rowMin;
      for (let k = 1; k <= M - 1; k += 1) {
        sideHoleVertex(surface.rowMin + k, surface.colMax + 1);
        sideHoleVertex(surface.rowMin + k, surface.colMin);
      }
    }
    if (bottomOk) {
      const N = surface.rowMax - rootRow;
      for (let k = 1; k <= N - 1; k += 1) {
        sideHoleVertex(surface.rowMax + 1 - k, surface.colMax + 1);
        sideHoleVertex(surface.rowMax + 1 - k, surface.colMin);
      }
    }
  }
  // Read-only hole-side lookup used by the fill pass (all needed rows are cached).
  const cachedSideHoleVertex = (r, c) => {
    const key = r + "," + c;
    return sideHoleCache.has(key) ? sideHoleCache.get(key) : -1;
  };

  // Ring-side vertices are the sweep's row-0 ring (reused by index, no copies).
  const ringBase = vertices.length / 3;

  // Bottom band faces (ring bottom -> mid rows -> hole bottom).
  if (bottomInfo.holeBase >= 0) {
    const W = bottomInfo.width;
    for (let i = 0; i < W - 1; i += 1) {
      const column = [ringBase + ringWidth + 1 + i];
      for (let j = 1; j <= bottomInfo.midCount; j += 1) column.push(bottomInfo.midBase + (j - 1) * W + i);
      column.push(bottomInfo.holeBase + i);
      for (let k = 0; k < column.length - 1; k += 1) {
        const q = [column[k + 1], column[k], column[k] + 1, column[k + 1] + 1];
        quads.push(q);
        indices.push(q[0], q[1], q[3], q[3], q[1], q[2]);
      }
    }
  }

  // Side direct bridge faces.
  sideSpecs.forEach((spec) => {
    if (sideBases[spec.name] == null) return;
    const base = sideBases[spec.name];
    const quad = spec.flip
      ? [base + 1, ringBase + spec.ringBottom, ringBase + spec.ringTop, base]
      : [base, ringBase + spec.ringTop, ringBase + spec.ringBottom, base + 1];
    quads.push(quad);
    indices.push(quad[0], quad[1], quad[3], quad[3], quad[1], quad[2]);
  });

  // Top band faces (ring -> middle rows -> hole).
  if (topInfo.holeBase >= 0) {
    const W = topInfo.width;
    for (let i = 0; i < W - 1 && i < ringWidth; i += 1) {
      const column = [ringBase + i];
      for (let j = 1; j <= topInfo.midCount; j += 1) column.push(topInfo.midBase + (j - 1) * W + i);
      column.push(topInfo.holeBase + i);
      for (let k = 0; k < column.length - 1; k += 1) {
        // column[k] is the child-side row, column[k+1] the parent-side row; emit as
        // [parentRow, childRow, childRow+1, parentRow+1] to keep outward winding (same
        // as the accepted 2.4s band) so the FrontSide wireframe overlay does not cull it.
        const q = [column[k + 1], column[k], column[k] + 1, column[k + 1] + 1];
        quads.push(q);
        indices.push(q[0], q[1], q[3], q[3], q[1], q[2]);
      }
    }
  }

  // Side fill: close the 4-sided gaps between the side direct bridges (at the child
  // root level) and the hole's top/bottom edges with quads. Top and bottom are
  // handled independently and each side (left/right) runs once: a fill fires when
  // that band is indirect (rootRow !== rowMin for the top, rootRow !== rowMax for the
  // bottom - at least one side edge left empty). Starting from the side's direct-fill
  // region (the direct bridge), one parent-hole edge pairs 1:1 with one top-band
  // edge until the hole corner; the one remaining band edge is simply used as a side
  // of the closing quad, so every fill face is a quad (no triangles). The reserved 0.3
  // extra loop in the bands (midCount === segments) guarantees the 1:1 counts.
  // Interior vertices of the side fill (band mid rows) - collected by the fill
  // pass, used by the bridge uniform smooth below.
  const sideFillVerts = new Set();
  if (deps.BRANCH_SIDE_FILL_ENABLED) {
    // Quad strip between the band's outer mid column (bandEdge: ringCorner ->
    // mids -> holeCorner) and the hole side (holePath: ringCorner -> direct bridge
    // row -> ... -> holeCorner). Both share ringCorner/holeCorner; pair interior rows
    // 1:1 (one hole edge per band edge) and let the remaining band edge close the
    // last quad, so all faces are quads.
    const fillQuadStart = quads.length;
    const emitFillStrip = (bandEdge, holePath) => {
      const count = bandEdge.length - 2;
      if (count < 1 || holePath.length !== bandEdge.length) return;
      for (let i = 0; i < count; i += 1) {
        const q = [bandEdge[i], bandEdge[i + 1], holePath[i + 2], holePath[i + 1]];
        quads.push(q);
        indices.push(q[0], q[1], q[3], q[3], q[1], q[2]);
        // The band mid row is the fill's interior vertex (ring/hole stay anchors).
        sideFillVerts.add(bandEdge[i + 1]);
      }
    };
    const fillSide = (side) => {
      const col = side.col;
      const isLeft = side.name === "left";
      if (sideBases[side.name] == null) return;
      // ---- Top gap (only when the top band is indirect) ----
      if (topInfo.holeBase >= 0 && topInfo.width === ringWidth + 1
        && rootRow > surface.rowMin && topInfo.midCount === rootRow - surface.rowMin) {
        const M = rootRow - surface.rowMin;
        const midCol = isLeft ? topInfo.width - 1 : 0;
        const ringCorner = isLeft ? ringBase + ringWidth : ringBase + 0;
        const holeCorner = topInfo.holeBase + midCol;
        const bandEdge = [ringCorner];
        for (let j = 1; j <= M; j += 1) bandEdge.push(topInfo.midBase + (j - 1) * topInfo.width + midCol);
        bandEdge.push(holeCorner);
        const holePath = [ringCorner];
        for (let k = M; k >= 1; k -= 1) holePath.push(cachedSideHoleVertex(surface.rowMin + k, col));
        holePath.push(holeCorner);
        if (holePath.some((v) => v < 0)) return;
        emitFillStrip(bandEdge, holePath);
      }
      // ---- Bottom gap (only when the bottom band is indirect) ----
      if (bottomInfo.holeBase >= 0 && bottomInfo.width === ringWidth + 1
        && rootRow < surface.rowMax && bottomInfo.midCount === surface.rowMax - rootRow) {
        const N = surface.rowMax - rootRow;
        const midCol = isLeft ? 0 : bottomInfo.width - 1;
        const ringCorner = isLeft ? ringBase + ringWidth + 1 : ringBase + (2 * ringWidth + 1);
        const holeCorner = bottomInfo.holeBase + midCol;
        const bandEdge = [ringCorner];
        for (let j = 1; j <= N; j += 1) bandEdge.push(bottomInfo.midBase + (j - 1) * bottomInfo.width + midCol);
        bandEdge.push(holeCorner);
        const holePath = [ringCorner];
        for (let k = N; k >= 1; k -= 1) holePath.push(cachedSideHoleVertex(surface.rowMax + 1 - k, col));
        holePath.push(holeCorner);
        if (holePath.some((v) => v < 0)) return;
        emitFillStrip(bandEdge, holePath);
      }
    };
    [{ name: "left", col: surface.colMax + 1 }, { name: "right", col: surface.colMin }].forEach(fillSide);
    // Orient the fill faces consistently with the rest of the bridge: the direct
    // bridge quads are the established correct reference, so propagate winding from
    // them across shared edges (adjacent faces must traverse a shared edge in opposite
    // directions). This handles multi-row strips whose inner quads do not touch the
    // ring corner directly.
    if (quads.length > fillQuadStart) {
      const directBridgeQuadIndex = (base, ringTopIdx, ringBottomIdx) => {
        if (base == null) return -1;
        const want = new Set([base, base + 1, ringTopIdx, ringBottomIdx]);
        for (let qi = 0; qi < fillQuadStart; qi += 1) {
          const q = quads[qi];
          if (q.length === 4 && q.every((v) => want.has(v)) && want.size === 4) return qi;
        }
        return -1;
      };
      const roots = [
        directBridgeQuadIndex(sideBases.left, ringBase + ringWidth, ringBase + ringWidth + 1),
        directBridgeQuadIndex(sideBases.right, ringBase + 0, ringBase + (2 * ringWidth + 1))
      ].filter((qi) => qi >= 0);
      if (roots.length) {
        const edgeToQuads = new Map();
        quads.forEach((q, qi) => {
          for (let e = 0; e < 4; e += 1) {
            const a = q[e];
            const b = q[(e + 1) % 4];
            const key = a < b ? a + "," + b : b + "," + a;
            if (!edgeToQuads.has(key)) edgeToQuads.set(key, []);
            edgeToQuads.get(key).push(qi);
          }
        });
        const edgeDirection = (q, a, b) => {
          for (let e = 0; e < 4; e += 1) {
            if (q[e] === a && q[(e + 1) % 4] === b) return 1;
            if (q[e] === b && q[(e + 1) % 4] === a) return -1;
          }
          return 0;
        };
        const sign = new Map();
        roots.forEach((qi) => sign.set(qi, 1));
        const queue = [...roots];
        while (queue.length) {
          const qi = queue.shift();
          const q = quads[qi];
          const si = sign.get(qi);
          for (let e = 0; e < 4; e += 1) {
            const a = q[e];
            const b = q[(e + 1) % 4];
            const key = a < b ? a + "," + b : b + "," + a;
            (edgeToQuads.get(key) || []).forEach((nj) => {
              if (nj === qi || sign.has(nj)) return;
              const da = edgeDirection(quads[nj], a, b);
              // If the neighbour traverses the edge the same way, it must be reversed.
              sign.set(nj, si * (da === 1 ? -1 : 1));
              queue.push(nj);
            });
          }
        }
        for (let qi = fillQuadStart; qi < quads.length; qi += 1) {
          if (sign.get(qi) !== 1) {
            const q = quads[qi];
            quads[qi] = [q[3], q[2], q[1], q[0]];
          }
        }
        // Rebuild indices for the fill quads (they are the last ones pushed).
        for (let qi = fillQuadStart; qi < quads.length; qi += 1) {
          const q = quads[qi];
          const base = qi * 6;
          indices[base] = q[0]; indices[base + 1] = q[1]; indices[base + 2] = q[3];
          indices[base + 3] = q[3]; indices[base + 4] = q[1]; indices[base + 5] = q[2];
        }
      }
    }
  }








  // Uniform Smooth on the bridge interior vertices (the fill / connection band mid
  // rows). "detail" = number of Laplacian passes, "strength" = per-pass amount.
  // The sweep ring and the parent-hole boundary stay fixed as anchors, so the bridge
  // relaxes smoothly without moving the ring or pulling the seam away from the hole.
  const smoothStrength = THREE.MathUtils.clamp(Number(lock.branchBridgeSmoothStrength ?? deps.branchState.branchBridgeSmoothStrength ?? 0), 0, 1);
  const smoothDetail = THREE.MathUtils.clamp(Math.round(Number(lock.branchBridgeSmoothDetail ?? deps.branchState.branchBridgeSmoothDetail ?? 0)), 0, 8);
  if (smoothStrength > 0.0001 && smoothDetail >= 1 && sideFillVerts.size) {
    const bridgeVertexCount = vertices.length / 3;
    const positionAt = (idx) => {
      if (idx < bridgeVertexCount) return [vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]];
      const s = idx - ringBase;
      if (s >= 0 && s < ringWorld.length) return [ringWorld[s].x, ringWorld[s].y, ringWorld[s].z];
      return null;
    };
    const adjacency = new Map();
    quads.forEach((q) => {
      for (let e = 0; e < 4; e += 1) {
        const a = q[e];
        const b = q[(e + 1) % 4];
        if (!adjacency.has(a)) adjacency.set(a, []);
        if (!adjacency.get(a).includes(b)) adjacency.get(a).push(b);
        if (!adjacency.has(b)) adjacency.set(b, []);
        if (!adjacency.get(b).includes(a)) adjacency.get(b).push(a);
      }
    });
    for (let iter = 0; iter < smoothDetail; iter += 1) {
      const targets = new Map();
      sideFillVerts.forEach((vi) => {
        const neighbors = adjacency.get(vi) || [];
        if (neighbors.length < 2) return;
        let ax = 0; let ay = 0; let az = 0; let count = 0;
        neighbors.forEach((ni) => {
          const p = positionAt(ni);
          if (!p) return;
          ax += p[0]; ay += p[1]; az += p[2];
          count += 1;
        });
        if (count < 2) return;
        const ox = vertices[vi * 3];
        const oy = vertices[vi * 3 + 1];
        const oz = vertices[vi * 3 + 2];
        targets.set(vi, [
          ox + (ax / count - ox) * smoothStrength,
          oy + (ay / count - oy) * smoothStrength,
          oz + (az / count - oz) * smoothStrength
        ]);
      });
      targets.forEach((t, vi) => {
        vertices[vi * 3] = t[0];
        vertices[vi * 3 + 1] = t[1];
        vertices[vi * 3 + 2] = t[2];
      });
    }
  }
  return { vertices, normals, tangents, uvs, colors, indices, quads, triangles, ringBase, boundaryParentIndices };
}

function createBranchChildGeometry(lock) {
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  const surface = branchRootRegionSurface(lock);
  if (!parent || !surface) return null;
  // The child's width follows its own Width attribute (so the Width slider works);
  // only the lateral SEGMENT count follows the parent selection's topology.
  const halfWidth = Math.max(0.001, Number(lock.width ?? lock.baseWidth ?? 0.16) * 0.5);
  // 2:1 cross-section (width : height) per the normalized convention. The ring's
  // lateral (width) topology follows the parent hole's top edge count, so the top/bottom
  // bridge bands match 1:1 (dragging the region wider updates the child's lateral).
  const halfDepth = Math.max(0.001, halfWidth * 0.5);
  const ringWidthSegments = branchRegionTopEdgeCount(lock);
  const ring = squareChildRing(halfWidth, halfDepth, ringWidthSegments);
  lock.branchRingWidthSegments = ringWidthSegments;
  const curve = deps.strandGeometryCurve(lock);
  const lengthSegments = THREE.MathUtils.clamp(Math.max(Math.round(lock.lengthSegments || 26), 4), 4, 256);
  const ringCount = ring.points.length;
  // Sweep starts at branchSweepStartT of the child guide (default 0.1), normalized back
  // to [0,1]; the [0, start] root portion is filled by the bridge (hole -> row-0 ring).
  const SWEEP_START_T = THREE.MathUtils.clamp(Number(lock.branchSweepStartT ?? 0.1), 0.02, 0.6);
  // Seed the sweep frames with a stable "up" (the parent surface tangent at the
  // root, pointing toward the parent root). The child grows along the parent's
  // normal, so its own surface normals are near-parallel to its tangent and
  // deps.guidedNormalAt degenerates (the sweep up flips when the root is dragged to an
  // edge). Transporting from this seed keeps the sweep ring orientation stable.
  let seedFrame = null;
  const branchParentForSweep = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (branchParentForSweep) {
    try {
      const seedTangent = curve.getTangent(SWEEP_START_T).normalize();
      // Seed the sweep chain from the root gizmo frame (hot-updated, correct):
      // the child bone's frame provides the up, re-based onto the sweep-start
      // tangent. The authored twist is applied per sweep frame on top.
      const gizmoFrame = deps.strandControlPointFrame(lock, 0);
      const up = gizmoFrame.z.clone().projectOnPlane(seedTangent);
      if (up.lengthSq() >= 0.0001) {
        up.normalize();
        // Release the root bone's rotation to follow the user's authored root twist
        // (rotate tool / pointTwists[0]) while keeping the constraint base (root stays
        // on the parent surface, up seeded from the parent tangent). Without this the
        // root ring stays pinned to the untwisted tube baseline and never rotates with
        // the gizmo/offset the user adjusts.
        const rootTwist = deps.controlPointRotationAt(lock, 0);
        if (rootTwist) up.applyAxisAngle(seedTangent, rootTwist).normalize();
        const x = new THREE.Vector3().crossVectors(seedTangent, up).normalize();
        const matrix = new THREE.Matrix4().makeBasis(x, seedTangent, up);
        seedFrame = {
          x,
          y: seedTangent.clone(),
          z: up,
          untwistedZ: up.clone(),
          quaternion: new THREE.Quaternion().setFromRotationMatrix(matrix),
          point: curve.getPoint(SWEEP_START_T),
          scale: { x: 1, z: 1 }
        };
      }
    } catch (e) { /* keep null seed */ }
  }
  // Shared sweep kernel: child = default sweep + bridge + root movement. The sweep
  // starts at SWEEP_START_T with the seeded root frame and root-relative taper scaling
  // (the root ring stays matched to the carved parent hole).
  const sweep = deps.strandSweep.sweepSide({
    lock,
    curve,
    profilePoints: ring.points,
    startT: SWEEP_START_T,
    seedFrame,
    rootRelative: true
  });
  const sweepVertices = sweep.vertices;
  const sweepNormals = sweep.normals;
  const sweepTangents = sweep.tangents;
  const sweepUvs = sweep.uvs;
  const sweepColors = sweep.colors;
  const actualLengthSegments = sweep.actualLengthSegments;
  // The bridge attaches to the sweep's row-0 ring (guideT = SWEEP_START_T), i.e.
  // the swept ring, not the raw root which sits buried inside the parent.
  const ringWorld = [];
  for (let s = 0; s < ringCount; s += 1) {
    const base = s * 3;
    ringWorld.push({ x: sweepVertices[base], y: sweepVertices[base + 1], z: sweepVertices[base + 2] });
  }
  const bridge = deps.BRANCH_CONNECTION_ENABLED
    ? buildBranchBridgeGeometry(lock, parent, surface, ringWorld, parent.mesh.geometry)
    : null;
  const bridgeVertexCount = bridge ? bridge.vertices.length / 3 : 0;
  const vertices = bridge ? [...bridge.vertices] : [];
  const normals = bridge ? [...bridge.normals] : [];
  const tangents = bridge ? [...bridge.tangents] : [];
  const uvs = bridge ? [...bridge.uvs] : [];
  const colors = bridge ? [...bridge.colors] : [];
  const indices = [];
  const quadFaces = [];
  const triangleEdgeMasks = [];
  vertices.push(...sweepVertices);
  normals.push(...sweepNormals);
  tangents.push(...sweepTangents);
  uvs.push(...sweepUvs);
  colors.push(...sweepColors);
  // End cap at the tip.
  const endPoint = curve.getPoint(1);
  const endCenter = bridgeVertexCount + sweepVertices.length / 3;
  vertices.push(endPoint.x, endPoint.y, endPoint.z);
  normals.push(0, -1, 0);
  const endFrame = deps.strandGeometryFrameAt(lock, curve, 1);
  tangents.push(endFrame.x.x, endFrame.x.y, endFrame.x.z, 1);
  uvs.push(0.5, 1);
  const endColor = deps.strandInfluenceColor(lock, 1);
  colors.push(endColor.r, endColor.g, endColor.b);
  for (let row = 0; row < actualLengthSegments; row += 1) {
    for (let s = 0; s < ringCount; s += 1) {
      const a = bridgeVertexCount + row * ringCount + s;
      const b = bridgeVertexCount + row * ringCount + ((s + 1) % ringCount);
      const c = bridgeVertexCount + (row + 1) * ringCount + s;
      const d = bridgeVertexCount + (row + 1) * ringCount + ((s + 1) % ringCount);
      indices.push(a, c, b, b, c, d);
      quadFaces.push([a, c, d, b]);
      triangleEdgeMasks.push([0, 1, 1], [1, 1, 0]);
    }
  }
  ring.points.forEach((p, s) => {
    const a = bridgeVertexCount + actualLengthSegments * ringCount + s;
    const b = bridgeVertexCount + actualLengthSegments * ringCount + ((s + 1) % ringCount);
    indices.push(a, b, endCenter, b, a, endCenter);
    triangleEdgeMasks.push([1, 1, 1], [1, 1, 1]);
  });
  if (bridge) {
    indices.push(...bridge.indices);
    bridge.quads.forEach((q) => quadFaces.push(q));
    bridge.triangles.forEach((tr) => quadFaces.push(tr));
    bridge.quads.forEach((q) => {
      if (q.length === 3) triangleEdgeMasks.push([1, 1, 1]);
      else triangleEdgeMasks.push([0, 1, 1], [1, 1, 0]);
    });
    bridge.triangles.forEach(() => triangleEdgeMasks.push([1, 1, 1]));
  } else {
    // Root cap only when there is no bridge.
    const startPoint = curve.getPoint(0);
    const startCenter = bridgeVertexCount + vertices.length / 3;
    vertices.push(startPoint.x, startPoint.y, startPoint.z);
    normals.push(0, 1, 0);
    const startFrame = deps.strandGeometryFrameAt(lock, curve, 0);
    tangents.push(startFrame.x.x, startFrame.x.y, startFrame.x.z, 1);
    uvs.push(0.5, 0);
    const startColor = deps.strandInfluenceColor(lock, 0);
    colors.push(startColor.r, startColor.g, startColor.b);
    ring.points.forEach((p, s) => {
      const a = bridgeVertexCount + s;
      const b = bridgeVertexCount + ((s + 1) % ringCount);
      indices.push(a, b, startCenter, b, a, startCenter);
    });
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.bridgeVertexCount = bridgeVertexCount;
  geometry.userData.ringWidthSegments = ringWidthSegments;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.sideTriangleCount = actualLengthSegments * ringCount * 2;
  geometry.userData.triangleEdgeMasks = triangleEdgeMasks;
  geometry.userData.openSurface = false;
  geometry.computeVertexNormals();
  // Restore the parent's authored normals on bridge vertices that sit on the parent
  // hole boundary so the child blends into the parent's shading at the seam instead
  // of keeping the child-only averaged normal (visible as a color band).
  if (bridge?.boundaryParentIndices?.length) {
    const parentNormalAttr = parent.mesh?.geometry?.getAttribute?.("normal");
    if (parentNormalAttr) {
      const childNormalAttr = geometry.getAttribute("normal");
      const pairs = bridge.boundaryParentIndices;
      for (let k = 0; k < pairs.length; k += 2) {
        const childIdx = pairs[k];
        const parentIdx = pairs[k + 1];
        childNormalAttr.setXYZ(
          childIdx,
          parentNormalAttr.getX(parentIdx),
          parentNormalAttr.getY(parentIdx),
          parentNormalAttr.getZ(parentIdx)
        );
      }
      childNormalAttr.needsUpdate = true;
    }
  }
  geometry.computeBoundingSphere();
  return geometry;
}

function applyBranchRootRegionCarving(lock, geometry) {
  const children = deps.branchChildrenFor(lock);
  const faces = geometry?.userData?.quadFaces;
  const index = geometry?.index;
  const rows = Number(geometry?.userData?.gridRows || 0);
  if (!children.length || !Array.isArray(faces) || !faces.length || !index || rows < 2) return;
  const splitFused = geometry?.userData?.splitFusedGrid || null;
  const removed = new Set();
  children.forEach((child) => {
    const surface = branchRootRegionSurface(child);
    if (!surface) return;
    if (splitFused && Array.isArray(splitFused.faceToRendered)) {
      // Fused grid: walk fused faces inside the region and remove their rendered
      // counterparts. Seam glue faces (faceToRendered === -1) have no rendered face.
      const fusedCols = Math.max(1, Math.round(Number(splitFused.cols) || surface.colCount || surface.cols));
      for (let row = Math.max(0, surface.rowMin); row <= Math.min(surface.rowMax, rows - 2); row += 1) {
        for (let c = 0; c < fusedCols; c += 1) {
          const gridCol = typeof surface.toGridCol === "function" ? surface.toGridCol(c) : c;
          if (gridCol < surface.colMin || gridCol > surface.colMax) continue;
          const rendered = splitFused.faceToRendered[row * fusedCols + c];
          if (rendered >= 0) removed.add(rendered);
        }
      }
      return;
    }
    // Use the build-time per-row face count (gridFacesPerRow): the region's row/col
    // mapping in branchRootRegionSurface is based on it, and the flat quadFaces array
    // can legitimately contain extra faces beyond the grid (e.g. procedural merges or
    // already-carved holes), which would otherwise drift the row/col stride.
    const facesPerRow = Number(geometry?.userData?.gridFacesPerRow)
      || Math.round(faces.length / Math.max(1, rows - 1));
    if (facesPerRow < 2) return;
    faces.forEach((face, faceIndex) => {
      if (removed.has(faceIndex)) return;
      const row = Math.floor(faceIndex / facesPerRow);
      const col = faceIndex % facesPerRow;
      const gridCol = typeof surface.toGridCol === "function" ? surface.toGridCol(col) : col;
      if (row >= surface.rowMin && row <= surface.rowMax && gridCol >= surface.colMin && gridCol <= surface.colMax) {
        removed.add(faceIndex);
      }
    });
  });
  if (!removed.size) return;
  // Keep the original index, dropping only the 6 indices per removed face.
  // Faces occupy the first faces.length * 6 indices (hair card / strand sweep);
  // anything after (end caps etc.) is preserved. Authored normals are kept.
  const source = index.array;
  const rebuilt = [];
  for (let faceIndex = 0; faceIndex < faces.length; faceIndex += 1) {
    if (removed.has(faceIndex)) continue;
    const base = faceIndex * 6;
    rebuilt.push(source[base], source[base + 1], source[base + 2], source[base + 3], source[base + 4], source[base + 5]);
  }
  for (let offset = faces.length * 6; offset < source.length; offset += 1) {
    rebuilt.push(source[offset]);
  }
  geometry.setIndex(rebuilt);
  geometry.userData.quadFaces = faces.filter((_, faceIndex) => !removed.has(faceIndex));
  geometry.userData.sideTriangleCount = Math.max(0, faces.length - removed.size) * 2;
  // Keep authored edge masks in sync with the removed side faces: masks are emitted
  // in quadFaces order (2 per side quad), end-cap masks trail after all side masks.
  // Stale masks make the wireframe/topology overlay draw quad diagonals (bangs look
  // like triangles) even though the geometry/export stay quads.
  if (Array.isArray(geometry.userData.triangleEdgeMasks)) {
    const oldMasks = geometry.userData.triangleEdgeMasks;
    const keptMasks = [];
    for (let faceIndex = 0; faceIndex < faces.length; faceIndex += 1) {
      if (removed.has(faceIndex)) continue;
      keptMasks.push(oldMasks[faceIndex * 2], oldMasks[faceIndex * 2 + 1]);
    }
    for (let i = faces.length * 2; i < oldMasks.length; i += 1) keptMasks.push(oldMasks[i]);
    geometry.userData.triangleEdgeMasks = keptMasks;
  }
  geometry.computeBoundingSphere?.();
}

function branchRootRegionSurface(lock) {
  const region = lock?.branchRootRegion;
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (!region || !parent) return null;
  const geometry = parent.mesh?.geometry;
  const rows = Number(geometry?.userData?.gridRows || 0);
  const cols = Number(geometry?.userData?.gridColumns || 0);
  if (rows < 2 || cols < 2) return null;
  const faces = geometry?.userData?.quadFaces;
  // facesPerRow / skipCol are grid properties fixed at build time (the carved
  // quadFaces shrink, so deriving them from the carved list would drift).
  const facesPerRow = Number(geometry?.userData?.gridFacesPerRow)
    || (Array.isArray(faces) && faces.length ? Math.round(faces.length / Math.max(1, rows - 1)) : 0);
  const colCount = facesPerRow > 1 ? facesPerRow : cols - 1;
  const skipCol = Number(geometry?.userData?.gridSkipCol ?? -1);
  const splitFused = geometry?.userData?.splitFusedGrid || null;
  // Split parents expose a fused single grid (rows x fusedCols) through a mapping;
  // every parent-position read goes through gridIndexAt for them.
  const gridIndexAt = splitFused && typeof splitFused.fusedIndexAt === "function"
    ? splitFused.fusedIndexAt
    : (r, c) => r * cols + c;
  const faceStartCols = [];
  if (colCount >= 1 && colCount <= cols) {
    for (let f = 0; f < colCount; f += 1) faceStartCols.push(skipCol >= 0 && f >= skipCol ? f + 1 : f);
  }
  const toGridCol = (vc) => {
    const g = skipCol >= 0 && vc >= skipCol ? vc + 1 : vc;
    return THREE.MathUtils.clamp(g, 0, cols - 1);
  };
  const toRow = (u) => THREE.MathUtils.clamp(Math.round(clampRegionParam(u) * (rows - 1)), 0, rows - 1);
  const rowA = toRow(region.cross.up.u);
  const rowB = toRow(region.cross.down.u);
  // v follows the parent's lateral width (projection onto the guide's frame.x at the
  // region's middle row), so v=0.5 lands on the hair's lateral center. A cross-section
  // ring wraps around, so the ring-index middle column is the far side, not the center.
  let toCol = (v) => THREE.MathUtils.clamp(Math.round(clampRegionParam(v) * (colCount - 1)), 0, colCount - 1);
  const positionAttr = geometry?.getAttribute?.("position");
  if (positionAttr && colCount >= 2 && faceStartCols.length === colCount) {
    const probeRow = Math.round((Math.min(rowA, rowB) + Math.max(rowA, rowB)) / 2);
    try {
      // v maps to the ring arc centered on the column facing the guide's outward
      // normal (frame.z): v=0.5 lands on the hair's lateral center from the up-vector
      // view. A cross-section ring collapses under a width projection (front/back
      // faces share the same width), so the arc avoids picking the wrong side.
      const frame = deps.curveFrameAt(parent, probeRow / Math.max(1, rows - 1));
      const axis = frame.z;
      let front = 0;
      let bestD = -Infinity;
      faceStartCols.forEach((gc, f) => {
        const vi = gridIndexAt(probeRow, gc) * 3;
        const d = positionAttr.array[vi] * axis.x + positionAttr.array[vi + 1] * axis.y + positionAttr.array[vi + 2] * axis.z;
        if (d > bestD) { bestD = d; front = f; }
      });
      const arcScale = colCount * 0.6;
      toCol = (v) => {
        const offset = Math.round((clampRegionParam(v) - 0.5) * arcScale);
        return ((front + offset) % colCount + colCount) % colCount;
      };
    } catch (e) {
      // fall back to the linear column mapping
    }
  }
  const colA = toGridCol(toCol(region.cross.left.v));
  const colB = toGridCol(toCol(region.cross.right.v));
  return {
    rows,
    cols,
    facesPerRow,
    colCount,
    skipCol,
    toGridCol,
    toCol,
    gridIndexAt,
    splitFused,
    rowMin: Math.min(rowA, rowB),
    rowMax: Math.max(rowA, rowB),
    colMin: Math.min(colA, colB),
    colMax: Math.max(colA, colB)
  };
}

function branchRegionTopEdgeCount(lock) {
  const surface = branchRootRegionSurface(lock);
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  const pos = parent?.mesh?.geometry?.getAttribute?.("position");
  if (!surface || !pos) return 2;
  const cols = surface.cols;
  const row = surface.rowMin;
  const indexAt = surface.gridIndexAt || ((r, c) => r * cols + c);
  const distinct = [];
  for (let c = surface.colMin; c <= Math.min(surface.colMax + 1, cols - 1); c += 1) {
    const vi = indexAt(row, c);
    const x = pos.getX(vi);
    const y = pos.getY(vi);
    const z = pos.getZ(vi);
    const prev = distinct[distinct.length - 1];
    if (!prev || Math.hypot(x - prev.x, y - prev.y, z - prev.z) > 1e-6) distinct.push({ x, y, z });
  }
  return Math.max(1, Math.min(distinct.length - 1, 8));
}

function branchRootRegionWorldPoints(lock) {
  const surface = branchRootRegionSurface(lock);
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  const pos = parent?.mesh?.geometry?.getAttribute?.("position");
  if (!surface || !pos) return null;
  const indexAt = surface.gridIndexAt || ((r, c) => r * surface.cols + c);
  const pointAt = (r, c) => { const vi = indexAt(r, c); return new THREE.Vector3(pos.getX(vi), pos.getY(vi), pos.getZ(vi)); };
  const rowC = Math.round((surface.rowMin + surface.rowMax) / 2);
  const colC = Math.round((surface.colMin + surface.colMax) / 2);
  const bottomRow = Math.min(surface.rowMax + 1, surface.rows - 1);
  const leftCol = Math.min(surface.colMax + 1, surface.cols - 1);
  // 3D center marker follows the stable anchor (region.center), clamped into the hole.
  const anchor = lock?.branchRootRegion?.center;
  const anchorRow = THREE.MathUtils.clamp(
    Math.round(clampRegionParam(anchor?.u ?? rowC / Math.max(1, surface.rows - 1)) * (surface.rows - 1)),
    surface.rowMin,
    surface.rowMax
  );
  let anchorCol = colC;
  if (anchor && typeof surface.toCol === "function" && typeof surface.toGridCol === "function") {
    anchorCol = surface.toGridCol(surface.toCol(clampRegionParam(anchor.v)));
  }
  return {
    up: pointAt(surface.rowMin, colC),
    down: pointAt(bottomRow, colC),
    left: pointAt(rowC, leftCol),
    right: pointAt(rowC, surface.colMin),
    center: pointAt(anchorRow, anchorCol)
  };
}

function applyBranchRootOffset(lock) {
  // Root offset disabled: the child root stays on the parent guide line (middle).
  return;
  const region = lock?.branchRootRegion;
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (!region || !parent?.points?.length) return;
  const surface = branchRootRegionSurface(lock);
  if (!surface) return;
  const u = (surface.rowMin + surface.rowMax) / 2 / Math.max(1, surface.rows - 1);
  const v = (surface.colMin + surface.colMax) / 2 / Math.max(1, surface.cols - 1);
  const curve = new THREE.CatmullRomCurve3(parent.points);
  const point = curve.getPoint(u);
  const frame = deps.curveFrameAt(parent, u);
  const width = Math.max(0.001, Number(parent.baseWidth ?? parent.width ?? 0.16));
  const target = point.clone().addScaledVector(frame.x, (v - 0.5) * width);
  if (lock.points?.[0]) lock.points[0].copy(target);
  if (lock.groupLatticeBasePoints?.[0]) lock.groupLatticeBasePoints[0].copy(target);
}
  return {
    buildBranchBridgeGeometry, createBranchChildGeometry, applyBranchRootRegionCarving,
    branchRootRegionSurface, branchRegionTopEdgeCount, branchRootRegionWorldPoints,
    applyBranchRootOffset
  };
}
