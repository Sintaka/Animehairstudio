// Branch-connect framework: bridge a parent hair surface hole (quad-grid boundary)
// to a child skeleton ring. Pure functions, no THREE dependency.
//
// Child ring (fixed for now): square cross-section, 4 sides x 2 segments = 8 segments / 8 points.
// Parent hole boundary: 10 segments (2x3-face hole on a quad grid). The connection module
// bridges the two, collapsing extra boundary edges per side so only quads are emitted.

const clamp01 = (v) => Math.min(1, Math.max(0, Number(v) || 0));

// 8-point square ring in cross-section local space (x = across, z = up/out).
// Order: start at +x mid, CCW around the cross-section.
// Returns { points: [{x,z}x8], sides: [{ name, start, count }] } with count = edges per side.
export function squareChildRing(halfWidth, halfDepth) {
  const hw = Math.max(0.0001, Number(halfWidth) || 0.08);
  const hd = Math.max(0.0001, Number(halfDepth) || 0.08);
  const points = [
    { x: hw, z: 0 },      // 0 right mid
    { x: hw, z: hd },     // 1 right-top corner
    { x: 0, z: hd },      // 2 top mid
    { x: -hw, z: hd },    // 3 left-top corner
    { x: -hw, z: 0 },     // 4 left mid
    { x: -hw, z: -hd },   // 5 left-bottom corner
    { x: 0, z: -hd },     // 6 bottom mid
    { x: hw, z: -hd }     // 7 right-bottom corner
  ];
  const sides = [
    { name: "right", start: 0, count: 2 },
    { name: "top", start: 1, count: 2 },
    { name: "left", start: 3, count: 2 },
    { name: "bottom", start: 5, count: 2 }
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
    return { x: positions[base] || 0, y: positions[base + 1] || 0, z: positions[base + 2] || 0 };
  };
  // Walk the hole perimeter CCW: top (rowMin), right (colMax+1), bottom (rowMax+1), left (colMin).
  const order = [];
  for (let c = colMin; c <= colMax + 1; c += 1) order.push(indexOf(rowMin, c));       // top:  W+1 verts
  for (let r = rowMin + 1; r <= rowMax + 1; r += 1) order.push(indexOf(r, colMax + 1)); // right: H verts
  for (let c = colMax; c >= colMin; c -= 1) order.push(indexOf(rowMax + 1, c));        // bottom: W+1 verts (minus shared)
  for (let r = rowMax; r >= rowMin + 1; r -= 1) order.push(indexOf(r, colMin));         // left: H verts (minus shared)
  // Dedupe shared corner vertices (last of one side == first of next).
  const vertices = [];
  const seen = new Set();
  order.forEach((p) => {
    const key = `${p.x.toFixed(4)}|${p.y.toFixed(4)}|${p.z.toFixed(4)}`;
    if (!seen.has(key)) { seen.add(key); vertices.push(p); }
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

// Connect one boundary side (bn edges) to one ring side (rn edges) as quads.
// boundary: array of {x,y,z}; ring: array of {x,y,z} (already in same space).
// Collapses (bn - rn) boundary edges (midpoint merge) so only quads are emitted.
// Returns array of [b0, b1, r1, r0] vertex-index quads into a combined vertex list.
export function connectSide(boundary, ring, boundaryBase, ringBase) {
  const bn = boundary.length - 1;
  const rn = ring.length - 1;
  const quads = [];
  if (bn === rn) {
    for (let i = 0; i < rn; i += 1) {
      quads.push([boundaryBase + i, boundaryBase + i + 1, ringBase + i + 1, ringBase + i]);
    }
    return quads;
  }
  if (bn < rn) {
    // Ring has more edges than the boundary side; split boundary edges (quad per boundary edge,
    // using one ring edge for the first and distributing the remainder).
    // Keep it simple: one boundary edge per ring edge except the last absorbs the rest.
    // (Not used by the current 10->8 case, provided for completeness.)
    const extra = rn - bn;
    let b = 0;
    for (let i = 0; i < rn; i += 1) {
      const consume = i === rn - 1 ? Math.max(1, extra + 1) : 1;
      const bNext = Math.min(b + consume, bn);
      const r0 = ringBase + i;
      const r1 = ringBase + i + 1;
      quads.push([boundaryBase + b, boundaryBase + bNext, r1, r0]);
      b = bNext;
    }
    return quads;
  }
  // bn > rn: collapse (bn - rn) boundary edges. Distribute collapses evenly across the side.
  const collapses = bn - rn;
  const boundaryVerts = [];
  for (let i = 0; i <= bn; i += 1) boundaryVerts.push(boundary[i]);
  // collapse: merge edge (collapseAt) by replacing its two endpoints with the midpoint
  for (let k = 0; k < collapses; k += 1) {
    const target = Math.round(((k + 0.5) / collapses) * (boundaryVerts.length - 2));
    const a = boundaryVerts[target];
    const b = boundaryVerts[target + 1];
    boundaryVerts.splice(target, 2, {
      x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2
    });
  }
  for (let i = 0; i < rn; i += 1) {
    quads.push([boundaryBase + i, boundaryBase + i + 1, ringBase + i + 1, ringBase + i]);
  }
  return { quads, collapsedBoundary: boundaryVerts };
}

// Full connection: parent hole boundary (10 segs) to child ring (8 pts), per side.
// boundary: { vertices, sides }; ring: { points, sides }.
// Returns { positions: combined world-space vertex list, quads }.
export function connectBoundaryToRing(boundary, ring) {
  const positions = [];
  const quads = [];
  ring.sides.forEach((ringSide, sideIndex) => {
    const bSide = boundary.sides.find((s) => s.name === ringSide.name) || boundary.sides[sideIndex];
    const bStart = bSide.start;
    const bCount = bSide.count;
    const bVerts = [];
    for (let i = 0; i <= bCount; i += 1) bVerts.push(boundary.vertices[(bStart + i) % boundary.vertices.length]);
    const rStart = ringSide.start;
    const rCount = ringSide.count;
    const rVerts = [];
    for (let i = 0; i <= rCount; i += 1) rVerts.push(ring.points[(rStart + i) % ring.points.length]);
    const boundaryBase = positions.length / 3;
    bVerts.forEach((p) => positions.push(p.x, p.y, p.z));
    const ringBase = positions.length / 3;
    rVerts.forEach((p) => positions.push(p.x, p.y, p.z));
    const result = connectSide(bVerts, rVerts, boundaryBase, ringBase);
    if (Array.isArray(result)) {
      result.forEach((q) => quads.push(q));
    } else {
      result.quads.forEach((q) => quads.push(q));
    }
  });
  return { positions, quads };
}
