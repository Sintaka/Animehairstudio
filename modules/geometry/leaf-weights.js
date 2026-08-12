// leaf-weights.js - Unified per-vertex leaf weight accessors (Phase B).
// Pure helpers, no dependencies. Leaf weights are stored as a flat stride-3 array
// [mainJoint, leafIndex, weight] shared by panel (segment index) and strand split
// (tube index) geometries; consumers read via leafWeightAt instead of indexing the
// raw array directly so both formats stay interchangeable.
export const LEAF_WEIGHT_STRIDE = 3;

// Read one vertex's leaf weight entry; tolerant of plain arrays and Float32Array,
// and of truncated/missing entries (missing mainJoint -> 0, missing leafIndex -> -1).
export function leafWeightAt(weights, vertexIndex) {
  const offset = vertexIndex * LEAF_WEIGHT_STRIDE;
  return {
    mainJoint: Number(weights[offset] ?? 0),
    leafIndex: Number(weights[offset + 1] ?? -1),
    weight: Number(weights[offset + 2] ?? 0)
  };
}

// Convenience accessor: the leaf index (segment/tube) of a vertex.
export function leafIndexAt(weights, vertexIndex) {
  return leafWeightAt(weights, vertexIndex).leafIndex;
}

// Convenience accessor: the tip weight value of a vertex.
export function leafWeightValueAt(weights, vertexIndex) {
  return leafWeightAt(weights, vertexIndex).weight;
}

// Shape check: array-like (Array or Float32Array) with exactly one entry per vertex.
export function leafWeightsValid(weights, positionCount) {
  return (Array.isArray(weights) || weights instanceof Float32Array)
    && weights.length === positionCount * LEAF_WEIGHT_STRIDE;
}