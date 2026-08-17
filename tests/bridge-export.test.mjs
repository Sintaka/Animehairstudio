import assert from "node:assert/strict";
import {
  applyBridgeBoneCapture,
  mergeBranchFamilyMeshes,
  normalizedCapture
} from "../modules/io/bridge-export.js";
import { exportAnimeHairUsda } from "../modules/io/usda-export.js";

const EPS = 1e-9;

function assertCapture(actual, indices, weights, message) {
  assert.deepEqual(actual.indices, indices, `${message}: indices`);
  assert.equal(actual.weights.length, 4, `${message}: fixed arity`);
  weights.forEach((weight, index) => {
    assert.ok(Math.abs(actual.weights[index] - weight) < EPS, `${message}: weight ${index}`);
  });
  assert.ok(Math.abs(actual.weights.reduce((sum, weight) => sum + weight, 0) - 1) < EPS, `${message}: normalized`);
}

const mixed = normalizedCapture([
  { indices: [10, 11], weights: [0.6, 0.4], scale: 0.5 },
  { indices: [20, 21], weights: [0.75, 0.25], scale: 0.5 }
], 0);
assertCapture(mixed, [20, 10, 11, 21], [0.375, 0.3, 0.2, 0.125], "four-way bridge capture");

const parent = {
  id: "parent",
  parentId: null,
  mesh: {
    name: "Parent",
    group: "hair",
    layer: "mid",
    points: [[0, 0, 0], [0, 0, 0], [1, 0, 0]],
    normals: [[0, 1, 0], [0, 1, 0], [0, 1, 0]],
    uvs: [[0, 0], [1, 0], [0, 1]],
    uvIndices: [2, 0, 1],
    faces: [[0, 2, 1]],
    sourceIndices: [0, 0, 1],
    skelIndices: [[10, 11, 10, 10], [10, 11, 10, 10], [12, 13, 12, 12]],
    skelWeights: [[0.6, 0.4, 0, 0], [0.6, 0.4, 0, 0], [0.7, 0.3, 0, 0]]
  }
};

const child = {
  id: "child",
  parentId: "parent",
  childMainIndex: 20,
  childRootCapture: { indices: [20, 21], weights: [0.75, 0.25] },
  bridgeBoundaryParentIndices: [2, 0],
  bridgeUvAnchors: [
    { t: 0, ring: 0, hole: -1, band: "top" },
    { t: 0.5, ring: 1, hole: 0, band: "top" },
    { t: 1, ring: -1, hole: 0, band: "top" }
  ],
  mesh: {
    name: "Child",
    group: "hair",
    layer: "mid",
    points: [[0, 1, 0], [0, 0.5, 0], [0, 0, 0], [0, 0, 0]],
    normals: [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
    uvs: [[0, 0], [0.25, 0], [0.5, 0], [0.75, 0]],
    uvIndices: [3, 1, 0, 2, 0, 1],
    faces: [[0, 1, 2], [3, 2, 1]],
    sourceIndices: [0, 1, 2, 2],
    skelIndices: Array.from({ length: 4 }, () => [20, 21, 20, 20]),
    skelWeights: Array.from({ length: 4 }, () => [0.75, 0.25, 0, 0])
  }
};

const grandchild = {
  id: "grandchild",
  parentId: "child",
  childMainIndex: 30,
  childRootCapture: { indices: [30, 31], weights: [0.9, 0.1] },
  bridgeBoundaryParentIndices: [1, 2],
  bridgeUvAnchors: [
    { t: 0, ring: 0, hole: -1, band: "top" },
    { t: 1, ring: -1, hole: 2, band: "top" }
  ],
  mesh: {
    name: "Grandchild",
    group: "hair",
    layer: "mid",
    points: [[0, 2, 0], [0, 0, 0], [0, 0, 0]],
    normals: [[0, 1, 0], [0, 1, 0], [0, 1, 0]],
    uvs: [[0, 1], [0.5, 1], [1, 1]],
    uvIndices: [1, 2, 0],
    faces: [[0, 1, 2]],
    sourceIndices: [0, 1, 1],
    skelIndices: Array.from({ length: 3 }, () => [30, 31, 30, 30]),
    skelWeights: Array.from({ length: 3 }, () => [0.9, 0.1, 0, 0])
  }
};

// Deliberately reverse the input order: parent capture must be ready before child and grandchild.
applyBridgeBoneCapture([grandchild, child, parent]);
assertCapture(
  { indices: child.mesh.skelIndices[0], weights: child.mesh.skelWeights[0] },
  [20, 21, 20, 20],
  [0.75, 0.25, 0, 0],
  "child root endpoint"
);
assertCapture(
  { indices: child.mesh.skelIndices[1], weights: child.mesh.skelWeights[1] },
  [20, 10, 11, 21],
  [0.375, 0.3, 0.2, 0.125],
  "child bridge interior"
);
for (const output of [2, 3]) {
  assertCapture(
    { indices: child.mesh.skelIndices[output], weights: child.mesh.skelWeights[output] },
    [10, 11, 10, 10],
    [0.6, 0.4, 0, 0],
    "child boundary inherits each parent influence"
  );
}
for (const output of [1, 2]) {
  assertCapture(
    { indices: grandchild.mesh.skelIndices[output], weights: grandchild.mesh.skelWeights[output] },
    [10, 11, 10, 10],
    [0.6, 0.4, 0, 0],
    "hierarchy boundary inherits resolved parent capture"
  );
}

const [merged] = mergeBranchFamilyMeshes([parent, child, grandchild]);
assert.equal(merged.points.length, 5, "all seam copies and bridge boundary copies fuse to one position point");
assert.equal(merged.faces.length, 4, "all family faces survive the merge");
assert.equal(merged.uvs.length, 10, "UV vertices stay separate from fused position vertices");
assert.equal(merged.uvIndices.length, 12, "one faceVarying UV index per face vertex");
assert.deepEqual(merged.uvIndices.slice(0, 3), [2, 0, 1], "parent custom UV indices are preserved");
assert.deepEqual(merged.uvIndices.slice(3, 9), [6, 4, 3, 5, 3, 4], "child UV island indices are offset, not welded");
assert.deepEqual(merged.uvIndices.slice(9), [8, 9, 7], "grandchild UV island indices are offset, not welded");
assert.ok(merged.faces.flat().every((index) => index >= 0 && index < merged.points.length), "fused face indices are valid");
assert.ok(merged.uvIndices.every((index) => index >= 0 && index < merged.uvs.length), "faceVarying UV indices are valid");
assertCapture(
  { indices: merged.skelIndices[0], weights: merged.skelWeights[0] },
  [10, 11, 10, 10],
  [0.6, 0.4, 0, 0],
  "fused boundary point keeps parent capture"
);

const skeleton = {
  name: "Hair_Skel",
  joints: Array.from({ length: 32 }, (_, index) => ({
    name: `Joint_${index}`,
    parent: null,
    p: [0, 0, 0],
    orient: [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }))
};
merged.skelRootName = "Hair_Skel";
const usda = exportAnimeHairUsda({ meshes: [merged], skeletons: [skeleton], rootName: "Bridge" });
assert.ok(usda.includes("elementSize = 4"), "bridge mesh writes fixed four capture influences");
assert.ok(usda.includes("int[] primvars:st:indices = [2, 0, 1, 6, 4, 3, 5, 3, 4, 8, 9, 7]"), "USDA keeps faceVarying UV indices");
assert.ok(!usda.includes("elementSize = 2"), "bridge mesh does not truncate capture to two influences");

console.log("bridge-export.test.mjs: all assertions passed");
