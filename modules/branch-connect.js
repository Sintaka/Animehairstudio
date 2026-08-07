// Branch-connect framework: bridge a parent hair surface hole (quad-grid boundary)
// to a child skeleton ring. Pure functions, no THREE dependency.
//
// Child ring (fixed for now): square cross-section, 4 sides x 2 segments = 8 segments / 8 points.
// Parent hole boundary: 10 segments (2x3-face hole on a quad grid). The connection module
// bridges the two, collapsing extra boundary edges per side so only quads are emitted.

const clamp01 = (v) => Math.min(1, Math.max(0, Number(v) || 0));

// 6-point ring for the 2x1 cross-section (width : height), CCW from right-top.
// Top/bottom (width) sides have 2 segments, left/right (height) sides 1 segment.
// Returns { points: [{x,z}x6], sides: [{ name, start, count }] } with count = edges per side.
export function squareChildRing(halfWidth, halfDepth) {
  const hw = Math.max(0.0001, Number(halfWidth) || 0.08);
  const hd = Math.max(0.0001, Number(halfDepth) || 0.08);
  const points = [
    { x: hw, z: hd },     // 0 right-top corner
    { x: 0, z: hd },      // 1 top mid
    { x: -hw, z: hd },    // 2 left-top corner
    { x: -hw, z: -hd },   // 3 left-bottom corner
    { x: 0, z: -hd },     // 4 bottom mid
    { x: hw, z: -hd }     // 5 right-bottom corner
  ];
  const sides = [
    { name: "top", start: 0, count: 2 },
    { name: "left", start: 2, count: 1 },
    { name: "bottom", start: 3, count: 2 },
    { name: "right", start: 5, count: 1 }
  ];
  return { points, sides };
}

// Boundary of a rectangular hole (rows x cols of faces) on a quad grid.
// region: { rowMin, rowMax, colMin, colMax } (face rows/cols inside the hole).
// positions: flat number array (x,y,z triplets), gridRows x gridCols, vertex = r*cols + c.
// Returns { vertices: [{x,y,z}xN], sides: [{ name, start, count }] } with N = perimeter edges,
// sides named top/right/bottom/left (each with `count` edges; vertices[start..start+count]).
export function holeBoundary(region, positions, gridRows, gridCols) {
  const rowMin = Math.round(Number(region?.rowMin) || 0);
  const rowMax = Math.round(Number(region?.rowMax) || 0);
  const colMin = Math.round(Number(region?.colMin) || 0);
  const colMax = Math.round(Number(region?.colMax) || 0);
  if (rowMax < rowMin || colMax < colMin) return null;
  const indexOf = (r, c) => {
    const ri = Math.min(Math.max(r, 0), Math.max(0, gridRows - 1));
    const ci = Math.min(Math.max(c, 0), Math.max(0, gridCols - 1));
    const base = (ri * gridCols + ci) * 3;
    return { x: positions[base] || 0, y: positions[base + 1] || 0, z: positions[base + 2] || 0, index: ri * gridCols + ci };
  };
  // Walk the hole perimeter CCW: top (rowMin), right (colMax+1), bottom (rowMax+1), left (colMin).
  const order = [];
  for (let c = colMin; c <= colMax + 1; c += 1) order.push(indexOf(rowMin, c));       // top:  W+1 verts
  for (let r = rowMin + 1; r <= rowMax + 1; r += 1) order.push(indexOf(r, colMax + 1)); // right: H verts
  for (let c = colMax; c >= colMin; c -= 1) order.push(indexOf(rowMax + 1, c));        // bottom: W+1 verts (minus shared)
  for (let r = rowMax; r >= rowMin + 1; r -= 1) order.push(indexOf(r, colMin));         // left: H verts (minus shared)
  // Dedupe shared corner vertices by grid index. A strand cross-section can
  // legitimately contain coincident columns (creased-profile seams), so deduping
  // by position would collapse the perimeter and corrupt the side layout.
  const vertices = [];
  const seen = new Set();
  order.forEach((p) => {
    if (!seen.has(p.index)) { seen.add(p.index); vertices.push(p); }
  });
  const W = colMax - colMin + 1;
  const H = rowMax - rowMin + 1;
  const sides = [
    { name: "top", start: 0, count: W },
    { name: "right", start: W, count: H },
    { name: "bottom", start: W + H, count: W },
    { name: "left", start: W + H + W, count: H }
  ];
  return { vertices, sides };
}

// March one boundary side (bn vertices) to one ring side (rn vertices).
// Equal counts -> pure quads. Mismatched counts -> quads + a few seam triangles
export function connectSide(boundary, ring, boundaryBase, ringBase) {
  const quads = [];
  const triangles = [];
  const bn = boundary.length;
  const rn = ring.length;
  const realEdge = (verts, i) => {
    const a = verts[i];
    const b = verts[i + 1];
    return Math.abs(a.x - b.x) > 1e-6 || Math.abs(a.y - b.y) > 1e-6 || Math.abs(a.z - b.z) > 1e-6;
  };
  if (bn === rn) {
    for (let i = 0; i < bn - 1; i += 1) {
      const bReal = realEdge(boundary, i);
      const rReal = realEdge(ring, i);
      if (bReal && rReal) {
        quads.push([boundaryBase + i, boundaryBase + i + 1, ringBase + i + 1, ringBase + i]);
      } else if (bReal) {
        // ring edge collapsed to a point -> triangle.
        triangles.push([boundaryBase + i, boundaryBase + i + 1, ringBase + i]);
      } else {
        // boundary edge collapsed to a point -> triangle.
        triangles.push([boundaryBase + i, ringBase + i + 1, ringBase + i]);
      }
    }
    return { quads, triangles };
  }
  const progress = (verts) => {
    const out = [0];
    for (let i = 1; i < verts.length; i += 1) {
      out.push(out[i - 1] + Math.hypot(
        verts[i].x - verts[i - 1].x,
        verts[i].y - verts[i - 1].y,
        verts[i].z - verts[i - 1].z
      ));
    }
    const total = out[out.length - 1] || 1;
    return out.map((v) => v / total);
  };
  const bProg = progress(boundary);
  const rProg = progress(ring);
  let b = 0;
  let r = 0;
  let guard = 0;
  while ((b < bn - 1 || r < rn - 1) && guard < 64) {
    guard += 1;
    const bNext = Math.min(b + 1, bn - 1);
    const rNext = Math.min(r + 1, rn - 1);
    const bFrac = bNext >= bn - 1 ? Infinity : bProg[bNext];
    const rFrac = rNext >= rn - 1 ? Infinity : rProg[rNext];
    const advanceB = bFrac === rFrac ? b < bn - 1 : bFrac < rFrac;
    if (advanceB) {
      if (!realEdge(boundary, b)) triangles.push([boundaryBase + b, ringBase + rNext, ringBase + r]);
      else if (rNext === r) triangles.push([boundaryBase + b, boundaryBase + bNext, ringBase + r]);
      else quads.push([boundaryBase + b, boundaryBase + bNext, ringBase + rNext, ringBase + r]);
      b = bNext;
    } else {
      if (!realEdge(ring, r)) triangles.push([boundaryBase + b, boundaryBase + bNext, ringBase + r]);
      else if (bNext === b) triangles.push([boundaryBase + b, ringBase + rNext, ringBase + r]);
      else quads.push([boundaryBase + b, boundaryBase + bNext, ringBase + rNext, ringBase + r]);
      r = rNext;
    }
  }
  return { quads, triangles };
}

// Full connection: parent hole boundary to child ring, per side (keeps square corners aligned).
// Returns { positions, quads, triangles }.
export function connectBoundaryToRing(boundary, ring) {
  const positions = [];
  const quads = [];
  const triangles = [];
  ring.sides.forEach((ringSide, sideIndex) => {
    const bSide = boundary.sides.find((s) => s.name === ringSide.name) || boundary.sides[sideIndex];
    const bVerts = [];
    for (let i = 0; i <= bSide.count; i += 1) bVerts.push(boundary.vertices[(bSide.start + i) % boundary.vertices.length]);
    const rVerts = [];
    for (let i = 0; i <= ringSide.count; i += 1) rVerts.push(ring.points[(ringSide.start + i) % ring.points.length]);
    const boundaryBase = positions.length / 3;
    bVerts.forEach((p) => positions.push(p.x, p.y, p.z));
    const ringBase = positions.length / 3;
    rVerts.forEach((p) => positions.push(p.x, p.y, p.z));
    const result = connectSide(bVerts, rVerts, boundaryBase, ringBase);
    result.quads.forEach((q) => quads.push(q));
    result.triangles.forEach((tr) => triangles.push(tr));
  });
  return { positions, quads, triangles };
}
