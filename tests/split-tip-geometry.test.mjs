import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import { createStrandGeometryApi } from "../modules/geometry/strand-geometry.js";
import {
  materializeTipChain,
  sampleCenterlinePoint,
  sweepRingCentroids,
  tipCaptureWeightAt,
  tipWeightAt
} from "../modules/geometry/tip-sub-bone.js";
import { strandSplitBonesFor, strandSplitForkT } from "../modules/bones/bone-model.js";

function assertCentersClose(actual, expected, epsilon = 0.000001) {
  assert.equal(actual.length, expected.length);
  actual.forEach((tube, tubeIndex) => {
    assert.equal(tube.length, expected[tubeIndex].length);
    tube.forEach((center, row) => {
      const other = expected[tubeIndex][row];
      assert.ok(Math.abs(center.x - other.x) <= epsilon, `tube ${tubeIndex}, row ${row}, x`);
      assert.ok(Math.abs(center.y - other.y) <= epsilon, `tube ${tubeIndex}, row ${row}, y`);
      assert.ok(Math.abs(center.z - other.z) <= epsilon, `tube ${tubeIndex}, row ${row}, z`);
    });
  });
}

test("tip capture ownership is binary while geometry blend remains continuous", () => {
  assert.equal(tipCaptureWeightAt(0.7, 0.7), 0, "the exact fork row stays on the main chain");
  assert.equal(tipCaptureWeightAt(0.70001, 0.7), 1, "every exposed row is fully owned by the tip");
  assert.equal(tipCaptureWeightAt(1, 0.7), 1);
  assert.ok(tipWeightAt(0.85, 0.7) > 0 && tipWeightAt(0.85, 0.7) < 1, "geometry may still blend");

  const panel = createPanelTipStrandApi({});
  const splits = [{ position: 0, height: 0.4 }];
  assert.equal(panel.tipSegmentWeightAt({}, 0, splits, 0.6, -0.5), 0);
  assert.equal(panel.tipSegmentWeightAt({}, 0, splits, 0.61, -0.5), 1);
  assert.equal(panel.tipSegmentWeightAt({}, 1, splits, 0.61, 0.5), 1);
  assert.ok(
    panel.tipSegmentBlendAt({}, 0, splits, 0.85, -0.5, 10) > 0,
    "panel deformation retains a continuous fork transition"
  );
});

test("split strands store full leaf capture below the fork and derive tube-center rest chains", () => {
  const frameAt = () => ({
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
  });
  const geometryApi = createStrandGeometryApi({
    branchSweep: {
      createSmoothSweepProfileCurve: () => null,
      sampleSweepProfile: (points, t) => points[Math.floor(t * points.length) % points.length].clone(),
      trimmedSweepProfile: (points) => points,
      createSweepProfileTopology: () => null
    },
    strandCurveParameters: (lock, curve, segments) => (
      Array.from({ length: segments + 1 }, (_, index) => index / segments)
    ),
    strandGeometryFrameAt: frameAt,
    strandProfileTopologyAt: (lock, t, points, scaleX, scaleZ) => (
      points.map((point) => ({ x: point.x * scaleX, z: point.z * scaleZ }))
    ),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    gridProfileSkipCol: () => -1
  });
  const lock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplitHeight: 0.4,
    strandSplitGap: 0.12,
    baseWidth: 0.2,
    widthScale: 1,
    radialSegments: 6,
    lengthSegments: 4,
    points: Array.from({ length: 3 }, (_, index) => ({ x: 0, y: index * 0.5, z: 0 })),
    pointScales: Array.from({ length: 3 }, () => ({ x: 1, z: 1 }))
  };
  const curve = new THREE.CatmullRomCurve3(lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z)));
  const profile = [
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 0.7),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, -0.7)
  ];
  const geometry = geometryApi.createSplitStrandGeometry(lock, curve, profile);
  assert.ok(geometry);

  const fork = strandSplitForkT(lock);
  const weights = geometry.userData.strandSplitWeights;
  const rows = geometry.userData.actualLengthSegments + 1;
  const sections = geometry.userData.splitSections;
  for (let tube = 0; tube < sections.length; tube += 1) {
    const { base, ringSize } = sections[tube];
    for (let row = 0; row < rows; row += 1) {
      const vertex = base + row * ringSize;
      const capture = weights[vertex * 3 + 2];
      const t = row / (rows - 1);
      assert.equal(capture, t > fork ? 1 : 0, `tube ${tube}, row ${row} has no residual main weight below fork`);
    }
  }

  const positions = Array.from(geometry.getAttribute("position").array);
  const measuredCenters = sweepRingCentroids(positions, sections, rows);
  const restCenters = geometry.userData.strandSplitRestCenters;
  assertCentersClose(restCenters, measuredCenters);
  const parameters = Array.from({ length: rows }, (_, row) => row / (rows - 1));
  const mid = sampleCenterlinePoint(restCenters[0], parameters, 0.5);
  assert.deepEqual(mid, restCenters[0][Math.floor((rows - 1) * 0.5)], "centerline sampling stays on the tube center");

  const bones = strandSplitBonesFor(lock);
  assert.equal(bones.length, 2);
  assert.equal(bones[0].parentParam, fork, "split child roots at the corresponding main-chain fork");
  assert.equal(bones[1].parentParam, fork);
});

test("tube-center rest poses preserve stored tip deltas and drive the viewport chain path", async () => {
  const centers = [[
    { x: -0.3, y: 0, z: 0 },
    { x: -0.4, y: 0.5, z: 0.1 },
    { x: -0.5, y: 1, z: 0.2 }
  ], [
    { x: 0.3, y: 0, z: 0 },
    { x: 0.4, y: 0.5, z: -0.1 },
    { x: 0.5, y: 1, z: -0.2 }
  ]];
  const oldRest = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0.5, z: 0 },
    { x: 0, y: 1, z: 0 }
  ];
  const authored = {
    restPoints: oldRest,
    points: oldRest.map((point, index) => ({
      x: point.x + (index === 2 ? 0.2 : 0),
      y: point.y,
      z: point.z + (index === 1 ? 0.15 : 0)
    }))
  };
  const parameters = [0, 0.5, 1];
  const chain = materializeTipChain(
    authored,
    (t) => sampleCenterlinePoint(centers[0], parameters, t),
    3
  );
  assert.deepEqual(chain.restPoints, centers[0], "new rest pose is the actual left tube center");
  assert.deepEqual(chain.points, [
    centers[0][0],
    { x: -0.4, y: 0.5, z: 0.25 },
    { x: -0.3, y: 1, z: 0.2 }
  ], "stored deltas remap from the old rest pose onto the new tube center");

  const [appSource, handleSource] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8")
  ]);
  assert.match(
    appSource,
    /const storedRestCenters = lock\.mesh\?\.geometry\?\.userData\?\.strandSplitRestCenters[\s\S]*sampleCenterlinePoint\(tubeRestCenters\[tubeIndex\], parameters, t\)/,
    "split-tip editing must prefer geometry-authored tube centers"
  );
  assert.match(
    appSource,
    /\? storedRestCenters\s*:\s*null[\s\S]*if \(tubeRestCenters\)[\s\S]*const opening = t <= splitStart/,
    "missing or mismatched rest centers must retain the legacy main-curve fallback"
  );
  assert.match(
    handleSource,
    /const strandSplitTipChains = typeof deps\.currentStrandSplitTipChains === "function"[\s\S]*strandSplitTipChains\?\.\[tubeIndex\]/,
    "viewport handles must consume the same split-tip chains as editing controls"
  );
});
