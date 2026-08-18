import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import { createPanelTipStrandApi, TIP_WIDTH_CONTROL_POINTS } from "../modules/geometry/panel-tip-strand.js";
import { createStrandGeometryApi } from "../modules/geometry/strand-geometry.js";
import {
  materializeTipChain,
  sampleCenterlinePoint,
  sweepRingCentroids,
  tipCaptureWeightAt,
  tipWeightAt
} from "../modules/geometry/tip-sub-bone.js";
import {
  strandSplitBonesFor,
  strandSplitForkT,
  strandSplitForkTForSegment,
  strandSplitBonesFromData,
  strandSplitBonesToData,
  remapSegmentBonesOnInsert,
  remapSegmentBonesOnDelete
} from "../modules/bones/bone-model.js";

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

function makeMultiSplitGeometryApi() {
  const frameAt = () => ({
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
  });
  return createStrandGeometryApi({
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
}

function baseSplitLock(overrides = {}) {
  return {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplitHeight: 0.4,
    strandSplitGap: 0.12,
    baseWidth: 0.2,
    widthScale: 1,
    radialSegments: 6,
    lengthSegments: 4,
    points: Array.from({ length: 3 }, (_, index) => ({ x: 0, y: index * 0.5, z: 0 })),
    pointScales: Array.from({ length: 3 }, () => ({ x: 1, z: 1 })),
    ...overrides
  };
}

function splitProfile() {
  return [
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 0.7),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, -0.7)
  ];
}

test("multi-zipper strand geometry builds N+1 watertight sections", () => {
  const geometryApi = makeMultiSplitGeometryApi();
  // Two zippers (bypass the Phase A cap by setting the array directly) -> 3 sections.
  const lock = baseSplitLock({
    strandSplits: [
      { position: -0.3, height: 0.4, order: 0 },
      { position: 0.3, height: 0.3, order: 1 }
    ]
  });
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  const geometry = geometryApi.createSplitStrandGeometry(lock, curve, splitProfile());
  assert.ok(geometry, "N=2 zippers should produce geometry");

  const sections = geometry.userData.splitSections;
  assert.equal(sections.length, 3, "two zippers yield three sections");
  sections.forEach((section, index) => {
    assert.ok(section.ringSize >= 3, `section ${index} ringSize >= 3`);
  });

  const positions = Array.from(geometry.getAttribute("position").array);
  assert.ok(positions.length > 0, "geometry has vertices");
  assert.ok(positions.every((value) => Number.isFinite(value)), "no NaN/Inf in positions");

  assert.ok(geometry.userData.quadFaces.length > 0, "quadFaces non-empty");

  const gridColIndices = geometry.userData.gridColIndices;
  const maxCol = gridColIndices.reduce((max, value) => Math.max(max, value), -Infinity);
  const ringSum = sections.reduce((sum, section) => sum + section.ringSize, 0);
  assert.equal(maxCol, ringSum - 1, "max grid col == sum of ringSizes - 1");

  // strandSplitWeights leaf index (stride 3, slot 1) must reach the last tube (2).
  const weights = geometry.userData.strandSplitWeights;
  let maxLeaf = -1;
  for (let i = 1; i < weights.length; i += 3) maxLeaf = Math.max(maxLeaf, weights[i]);
  assert.equal(maxLeaf, 2, "leaf index reaches section 2");
});

test("single-zipper strandSplits array is byte-identical to legacy scalars", () => {
  const geometryApi = makeMultiSplitGeometryApi();
  const profileArray = () => splitProfile();
  const curveFor = (lock) => new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );

  // Array form (length 1) with the same position/height as the legacy scalars.
  const arrayLock = baseSplitLock({
    strandSplitPosition: 0,
    strandSplitHeight: 0.4,
    strandSplits: [{ position: 0, height: 0.4, order: 0 }]
  });
  // Legacy form: scalars only, no strandSplits array.
  const legacyLock = baseSplitLock({
    strandSplitPosition: 0,
    strandSplitHeight: 0.4
  });

  const arrayGeometry = geometryApi.createSplitStrandGeometry(arrayLock, curveFor(arrayLock), profileArray());
  const legacyGeometry = geometryApi.createSplitStrandGeometry(legacyLock, curveFor(legacyLock), profileArray());
  assert.ok(arrayGeometry && legacyGeometry);

  assert.equal(
    arrayGeometry.userData.splitSections.length,
    2,
    "single zipper produces two sections"
  );
  assert.equal(
    legacyGeometry.userData.splitSections.length,
    arrayGeometry.userData.splitSections.length,
    "identical section count"
  );

  const arrayPositions = Array.from(arrayGeometry.getAttribute("position").array);
  const legacyPositions = Array.from(legacyGeometry.getAttribute("position").array);
  assert.equal(arrayPositions.length, legacyPositions.length, "identical vertex count");
  assert.deepEqual(arrayPositions, legacyPositions, "identical vertex positions");

  assert.deepEqual(
    Array.from(arrayGeometry.getIndex().array),
    Array.from(legacyGeometry.getIndex().array),
    "identical index array"
  );

  assert.equal(
    arrayGeometry.userData.splitFusedGrid.splitStartRow,
    legacyGeometry.userData.splitFusedGrid.splitStartRow,
    "identical splitStartRow"
  );
});

test("strandSplitBonesFor generalizes to N+1 tubes with per-segment fork depth", () => {
  // N=2 zippers -> 3 tubes. Per-segment fork = 1 - max(adjacent split heights):
  //   split.0 = 1-0.4 = 0.6, split.1 (between both) = 1-max(0.4,0.2) = 0.6,
  //   split.2 = 1-0.2 = 0.8. Splits are sorted by position first.
  const lock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [
      { position: 0.3, height: 0.2, order: 1 },
      { position: -0.3, height: 0.4, order: 0 }
    ]
  };
  assert.equal(strandSplitForkTForSegment(lock, 0), 0.6, "segment 0 fork = 1 - 0.4");
  assert.equal(strandSplitForkTForSegment(lock, 1), 0.6, "segment 1 fork = 1 - max(0.4,0.2)");
  assert.equal(strandSplitForkTForSegment(lock, 2), 0.8, "segment 2 fork = 1 - 0.2");

  const bones = strandSplitBonesFor(lock);
  assert.equal(bones.length, 3, "N=2 zippers -> 3 split bones");
  assert.deepEqual(bones.map((b) => b.name), ["split.0", "split.1", "split.2"], "bones named split.0/1/2");
  assert.equal(bones[0].parentParam, 0.6, "split.0 parentParam = 0.6");
  assert.equal(bones[1].parentParam, 0.6, "split.1 parentParam = 0.6");
  assert.equal(bones[2].parentParam, 0.8, "split.2 parentParam = 0.8");
});

test("N=1 strand split bones stay identical to the legacy single-scalar value", () => {
  // Legacy single-scalar lock (no strandSplits array): 2 tubes, both fork = 1 - height,
  // matching the pre-generalization strandSplitForkT exactly.
  const lock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplitPosition: 0.1,
    strandSplitHeight: 0.36125
  };
  const legacyFork = strandSplitForkT(lock);
  const bones = strandSplitBonesFor(lock);
  assert.equal(bones.length, 2, "N=1 stays 2 tubes");
  assert.equal(strandSplitForkTForSegment(lock, 0), legacyFork, "segment 0 fork == legacy 1-height");
  assert.equal(strandSplitForkTForSegment(lock, 1), legacyFork, "segment 1 fork == legacy 1-height");
  assert.equal(bones[0].parentParam, legacyFork, "split.0 parentParam unchanged");
  assert.equal(bones[1].parentParam, legacyFork, "split.1 parentParam unchanged");
});

test("strandSplitBonesFromData round-trips a 3-length (N=2) array", () => {
  const lock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [
      { position: -0.3, height: 0.4, order: 0 },
      { position: 0.3, height: 0.2, order: 1 }
    ]
  };
  const bones = strandSplitBonesFor(lock);
  const data = strandSplitBonesToData(bones);
  assert.equal(data.length, 3, "serialized data keeps 3 entries");
  const restored = strandSplitBonesFromData(data, lock);
  assert.ok(restored, "3-length array restores (not null)");
  assert.equal(restored.length, 3, "round-trip preserves 3 tubes");
  assert.deepEqual(restored.map((b) => b.name), ["split.0", "split.1", "split.2"], "names preserved");
  assert.deepEqual(
    restored.map((b) => b.parentParam),
    bones.map((b) => b.parentParam),
    "parentParam preserved through round-trip"
  );
  // Empty / invalid still yields null.
  assert.equal(strandSplitBonesFromData([], lock), null, "empty array -> null");
  assert.equal(strandSplitBonesFromData(null, lock), null, "null -> null");
});

// ---- 发尖宽度控制点：共享参数网格 + 按 zipper 高度动态暴露 + 无「活但抓不到」的点 ----
// 设计（0.2.123）：两侧共用**同一批**控制参数（共享网格 = 最深 zipper 的 fork 等分），
// 所以左右间距永远一致；每侧只**动态暴露**落在自己暴露区（t >= 本侧 fork）的那部分
// → 数量非对称（深 zipper 侧多、浅 zipper 侧少），而不是两侧各自等分不同长度的区间
// （0.2.118 的错误设计：两侧都是 6 个点，间距不同）。
// 同时必须保住 0.2.118 修掉的那类 bug：某参数出现在本侧曲线数据里（参与本侧采样）
// 当且仅当本侧为它提供可抓把手（tipWidthControlPlacement 非 null）。
function tipWidthHarness() {
  const panel = createPanelTipStrandApi({
    clonePanelSplits: (value) => (Array.isArray(value) ? value.map((split) => ({ ...split })) : []),
    normalizePanelSplits: (value) => (Array.isArray(value) ? value.map((split) => ({ ...split })) : []),
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
    ),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    isPanelGeometry: () => true,
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    sculptState: { panelTipSelection: null, panelTipHover: null }
  });
  // 左侧 zipper 深（0.5 → fork 0.5）、右侧 zipper 浅（0.2 → fork 0.8）：非对称，
  // 正是复现凹陷的配置。段 1 两侧各有一条 zipper。
  const splits = [
    { position: -0.4, height: 0.5, order: 0 },
    { position: 0.4, height: 0.2, order: 1 }
  ];
  const lock = {
    id: "L",
    geometryType: "panel",
    panelSplitEnabled: true,
    panelSplits: splits,
    width: 0.62,
    panelThickness: 0.08,
    panelCurvature: 0.18,
    panelLengthLoops: 10,
    panelWidthLoops: 6,
    // 全局宽度曲线故意非平直：任何误回退到全局曲线的采样都会偏离 1 而被断言抓到。
    taperCurve: [
      { position: 0, value: 1, interpolation: "linear" },
      { position: 1, value: 0.4, interpolation: "linear" }
    ],
    points: Array.from({ length: 6 }, (_, index) => ({ x: 0, y: 1.7 - index * 0.25, z: 0 }))
  };
  return { panel, splits, lock, segment: 1 };
}

test("tip width控制参数两侧共享（同间距），暴露数量按 zipper 高度动态非对称", () => {
  const { panel, splits, lock, segment } = tipWidthHarness();
  const leftFork = panel.tipWidthSideForkT(lock, segment, splits, -1);
  const rightFork = panel.tipWidthSideForkT(lock, segment, splits, 1);
  const commonFork = panel.tipWidthCommonForkT(lock, segment, splits);
  assert.ok(Math.abs(leftFork - 0.5) < 1e-9, "左侧 fork = 1 - 0.5");
  assert.ok(Math.abs(rightFork - 0.8) < 1e-9, "右侧 fork = 1 - 0.2");
  assert.ok(Math.abs(commonFork - leftFork) < 1e-9, "公共 fork = 最深 zipper = 左侧 fork");
  assert.ok(rightFork > commonFork + 1e-6, "右侧是浅 zipper 侧：本侧 fork 严格深于公共 fork");

  // ① 共享网格：唯一一套参数，基于最深 zipper 等分（间距 = (1-commonFork)/N）。
  const grid = panel.tipWidthGridTs(lock, segment, splits);
  assert.equal(grid.length, TIP_WIDTH_CONTROL_POINTS + 1, "共享网格 = N 中点 + 发尖端");
  assert.ok(Math.abs(grid.at(-1) - 1) < 1e-9, "共享网格最后一个位置是发尖端 t=1");
  const leftPositions = panel.tipWidthSideControlTs(lock, segment, splits, -1);
  const rightPositions = panel.tipWidthSideControlTs(lock, segment, splits, 1);
  for (const [side, positions] of [[-1, leftPositions], [1, rightPositions]]) {
    positions.forEach((position) => {
      assert.ok(
        grid.some((candidate) => Math.abs(candidate - position) < 1e-12),
        `side ${side} 暴露位置 ${position} 必须取自共享网格（不得是本侧独立等分）`
      );
    });
  }
  // 两侧共有的位置数值完全一致 = 间距一致（0.2.118 各自等分不同长度 → 间距不同）。
  const shared = leftPositions.filter((position) => rightPositions
    .some((candidate) => Math.abs(candidate - position) < 1e-12));
  assert.deepEqual(shared, rightPositions, "浅 zipper 侧暴露的位置是深侧位置的子集（同参数同间距）");
  const spacings = grid.slice(1, TIP_WIDTH_CONTROL_POINTS).map((position, index) => position - grid[index]);
  spacings.forEach((spacing) => {
    assert.ok(Math.abs(spacing - spacings[0]) < 1e-12, "共享网格中点间距均匀");
  });

  // ② 动态非对称数量：深 zipper 侧暴露更多。左 fork 0.5 → 6 个；右 fork 0.8 → 3 个。
  assert.ok(
    leftPositions.length > rightPositions.length,
    `深 zipper 侧应暴露更多控制点（左 ${leftPositions.length} vs 右 ${rightPositions.length}）`
  );
  assert.equal(leftPositions.length, TIP_WIDTH_CONTROL_POINTS + 1, "左（深）侧暴露整套共享网格");
  assert.equal(
    rightPositions.length,
    grid.filter((position) => position >= rightFork - 1e-4).length,
    "右（浅）侧暴露数 = 共享网格中 >= 本侧 fork 的位置数"
  );
  assert.equal(rightPositions.length, 3, "实测：右 fork 0.8 时共享网格只有 0.85/0.95/1 落在暴露区");

  // ③ 视口放置：pointIndex 索引**共享网格**（bone-view-handles.js 固定手柄数组）。
  // 暴露的位置必须有放置且参数与网格一致；未暴露的位置必须返回 null（手柄隐藏）。
  const bone = { spread: 0, taperCurve: null, taperCurveSecondary: null, asymmetricWidthCurve: false };
  for (const [side, positions] of [[-1, leftPositions], [1, rightPositions]]) {
    let visible = 0;
    grid.forEach((gridT, index) => {
      const placement = panel.tipWidthControlPlacement(lock, segment, splits, bone, side, index);
      const exposed = positions.some((position) => Math.abs(position - gridT) < 1e-12);
      if (exposed) {
        assert.ok(placement, `side ${side} 网格位置 ${gridT} 已暴露 → 必须有把手`);
        assert.ok(
          Math.abs(placement.t - gridT) < 1e-9,
          `side ${side} 手柄 ${index} 的参数必须正是共享网格位置 ${gridT}（索引不得错位）`
        );
        assert.ok(Number.isFinite(placement.point.x), `side ${side} 控制点 ${index} 位置应有限`);
        visible += 1;
      } else {
        assert.equal(placement, null, `side ${side} 网格位置 ${gridT} 未暴露 → 必须隐藏（null）`);
      }
    });
    assert.equal(visible, positions.length, `side ${side} 可见把手数 = 本侧暴露位置数`);
    // 越界索引安全（手柄数组长度恒为 N+1）。
    assert.equal(panel.tipWidthControlPlacement(lock, segment, splits, bone, side, grid.length), null);
    assert.equal(panel.tipWidthControlPlacement(lock, segment, splits, bone, side, -1), null);
  }

  // ④ 0.2.118 不变式（共享网格不得让它失效）：本侧 fork 之上（严格）的每个曲线点都
  // 必须是本侧暴露的位置 **且** tipWidthControlPlacement 返回非 null；本侧 fork 之下
  // 不得出现任何共享网格位置（那段采样回退全局曲线，写进去就是抓不到的活点）。
  // 本侧 fork 锚点本身是派生的连续性锚（恒 = 全局曲线在 fork 处的采样，用于与 zipper
  // 以上的锁定区接续），不是创作点；对侧 fork 锚点只在它落在本侧 fork 之下（不参与
  // 本侧采样）时才记录 —— 两者都不是网格位置，故与上面的判据不冲突。
  for (const side of [-1, 1]) {
    const fork = panel.tipWidthSideForkT(lock, segment, splits, side);
    const positions = panel.tipWidthSideControlTs(lock, segment, splits, side);
    const curve = panel.buildTipWidthCurve(lock, segment, splits, bone, side);
    const placementTs = grid
      .map((_, index) => panel.tipWidthControlPlacement(lock, segment, splits, bone, side, index))
      .filter(Boolean)
      .map((placement) => placement.t);
    curve.forEach((point) => {
      if (point.position <= fork + 1e-4) {
        // 锁定区记录点 / 本侧 fork 锚点：不得是共享网格位置。
        assert.ok(
          !grid.some((gridT) => Math.abs(gridT - point.position) < 1e-3),
          `side ${side} 本侧 fork ${fork} 之下的曲线点 ${point.position} 不得是共享网格控制位置（活但抓不到）`
        );
        return;
      }
      assert.ok(
        positions.some((position) => Math.abs(position - point.position) < 1e-3),
        `side ${side} 曲线点 ${point.position} 高于本侧 fork ${fork} 却不是本侧暴露位置（活但抓不到）`
      );
      assert.ok(
        placementTs.some((t) => Math.abs(t - point.position) < 1e-3),
        `side ${side} 曲线点 ${point.position} 必须有视口把手（placement 非 null）`
      );
    });
    // 反向：每个暴露位置都在曲线里（可抓的点确实影响采样）。
    positions.forEach((position) => {
      assert.ok(
        curve.some((point) => Math.abs(point.position - position) < 1e-3),
        `side ${side} 暴露位置 ${position} 应存在于曲线数据中`
      );
    });
  }
});

// 对称高度是常见情形：两侧必须暴露同一套完整共享网格（共享网格改动不得扰动它）。
test("symmetric zipper heights expose the same full shared grid on both sides", () => {
  const { panel, lock } = tipWidthHarness();
  const bone = { spread: 0, taperCurve: null, taperCurveSecondary: null, asymmetricWidthCurve: false };
  for (const height of [0.4375, 0.2, 0.5, 0.78]) {
    const splits = [
      { position: -0.4, height, order: 0 },
      { position: 0.4, height, order: 1 }
    ];
    const segment = 1;
    const grid = panel.tipWidthGridTs(lock, segment, splits);
    const left = panel.tipWidthSideControlTs(lock, segment, splits, -1);
    const right = panel.tipWidthSideControlTs(lock, segment, splits, 1);
    assert.equal(left.length, TIP_WIDTH_CONTROL_POINTS + 1, `height ${height}: 左侧暴露整套网格`);
    assert.equal(right.length, TIP_WIDTH_CONTROL_POINTS + 1, `height ${height}: 右侧暴露整套网格`);
    assert.deepEqual(left, grid, `height ${height}: 左侧 = 共享网格`);
    assert.deepEqual(right, grid, `height ${height}: 右侧 = 共享网格`);
    for (const side of [-1, 1]) {
      grid.forEach((_, index) => {
        assert.ok(
          panel.tipWidthControlPlacement(lock, segment, splits, bone, side, index),
          `height ${height} side ${side} 手柄 ${index} 应可抓（对称情形全部暴露）`
        );
      });
    }
  }
});

test("tip width Reset is flat (no dent) for very different zipper heights", () => {
  const { panel, lock } = tipWidthHarness();
  const boundariesFor = (splits) => [-1, ...splits.map((split) => split.position), 1];
  // 多组高度组合（含极端差异 0.78/0.05）：Reset 后两侧暴露区整段宽度乘子恒为 1。
  const heightPairs = [[0.5, 0.2], [0.2, 0.5], [0.4375, 0.4375], [0.78, 0.05], [0.05, 0.78], [0.3, 0.28]];
  for (const [leftHeight, rightHeight] of heightPairs) {
    const splits = [
      { position: -0.4, height: leftHeight, order: 0 },
      { position: 0.4, height: rightHeight, order: 1 }
    ];
    const segment = 1;
    const bone = {
      spread: 0,
      taperCurve: panel.tipWidthResetCurve(lock, segment, splits, 1),
      taperCurveSecondary: panel.tipWidthResetCurve(lock, segment, splits, -1),
      asymmetricWidthCurve: true
    };
    // Reset 曲线本身整段全 1（含本侧 fork 锚点、允许的记录点与所有暴露的共享网格位置）。
    for (const curve of [bone.taperCurve, bone.taperCurveSecondary]) {
      curve.forEach((point) => {
        assert.ok(Math.abs(point.value - 1) < 1e-9, `Reset 曲线点 ${point.position} 应为 1`);
      });
    }
    const boundaries = boundariesFor(splits);
    for (const side of [-1, 1]) {
      const fork = panel.tipWidthSideForkT(lock, segment, splits, side);
      // 段边缘 u：归一化后为 ±1，落在 asymmetric 混合带（0.25）之外 → 纯本侧曲线。
      const edgeU = side < 0 ? boundaries[segment] : boundaries[segment + 1];
      for (let step = 0; step <= 40; step += 1) {
        const t = fork + (1 - fork) * (step / 40);
        const multiplier = panel.tipWidthMultiplierAt(lock, t, edgeU, bone, segment, splits);
        assert.ok(
          Math.abs(multiplier - 1) < 1e-6,
          `heights ${leftHeight}/${rightHeight} side ${side} t=${t.toFixed(4)}：宽度乘子 ${multiplier} 应为 1（凹陷回归）`
        );
      }
    }
  }
});

test("symmetric tip width writes land on the shared grid, and skip a side that hides it", () => {
  const { panel, splits, lock, segment } = tipWidthHarness();
  const bone = {
    spread: 0,
    taperCurve: panel.tipWidthResetCurve(lock, segment, splits, 1),
    taperCurveSecondary: panel.tipWidthResetCurve(lock, segment, splits, -1),
    asymmetricWidthCurve: true
  };
  const rightPositions = panel.tipWidthSideControlTs(lock, segment, splits, 1);
  const leftPositions = panel.tipWidthSideControlTs(lock, segment, splits, -1);
  // 对称拖拽：bone-interaction.js 用同一个 t 写两侧。参数共享后，浅侧暴露的位置在深侧
  // 一定也存在 → 同一个 t 直接落在两侧的同一个共享位置上（不再被吸到不同参数上）。
  const draggedT = rightPositions[0];
  panel.setTipWidthCurveValue(lock, segment, splits, bone, 1, draggedT, 1.5);
  panel.setTipWidthCurveValue(lock, segment, splits, bone, -1, draggedT, 1.5);
  const rightEdited = bone.taperCurve.find((point) => Math.abs(point.position - draggedT) < 1e-3);
  assert.ok(rightEdited && Math.abs(rightEdited.value - 1.5) < 1e-9, "被拖侧应在该位置写入 1.5");
  const leftEdited = bone.taperCurveSecondary.find((point) => Math.abs(point.position - draggedT) < 1e-3);
  assert.ok(leftEdited && Math.abs(leftEdited.value - 1.5) < 1e-9, "对侧在同一个共享位置写入同值（间距一致）");

  // 反向：拖深侧一个浅侧**没有暴露**的位置（0.65 < 右 fork 0.8）→ 浅侧必须跳过写入，
  // 不得吸到 0.85（那会在用户没碰的地方改宽度），也不得写出无把手的活点。
  const hiddenForRight = leftPositions.find((position) => !rightPositions
    .some((candidate) => Math.abs(candidate - position) < 1e-12));
  assert.ok(hiddenForRight != null, "非对称高度下深侧必有浅侧未暴露的位置");
  const rightBefore = bone.taperCurve.map((point) => ({ ...point }));
  panel.setTipWidthCurveValue(lock, segment, splits, bone, -1, hiddenForRight, 1.8);
  panel.setTipWidthCurveValue(lock, segment, splits, bone, 1, hiddenForRight, 1.8);
  const leftHidden = bone.taperCurveSecondary.find((point) => Math.abs(point.position - hiddenForRight) < 1e-3);
  assert.ok(leftHidden && Math.abs(leftHidden.value - 1.8) < 1e-9, "深侧应在该位置写入 1.8");
  assert.deepEqual(
    bone.taperCurve.map((point) => ({ position: point.position, value: point.value })),
    rightBefore.map((point) => ({ position: point.position, value: point.value })),
    "浅侧曲线不得因对称写入而改变（该参数在浅侧未暴露）"
  );
  // 重建后不变式仍成立：两侧曲线里高于本侧 fork 的点全是本侧暴露位置且都有把手。
  const grid = panel.tipWidthGridTs(lock, segment, splits);
  for (const side of [-1, 1]) {
    const fork = panel.tipWidthSideForkT(lock, segment, splits, side);
    const positions = panel.tipWidthSideControlTs(lock, segment, splits, side);
    const curve = side < 0 ? bone.taperCurveSecondary : bone.taperCurve;
    curve.forEach((point) => {
      if (point.position <= fork + 1e-4) return;
      assert.ok(
        positions.some((position) => Math.abs(position - point.position) < 1e-3),
        `编辑后 side ${side} 曲线点 ${point.position} 应仍是本侧暴露位置`
      );
      const index = grid.findIndex((gridT) => Math.abs(gridT - point.position) < 1e-3);
      assert.ok(index >= 0, `编辑后 side ${side} 曲线点 ${point.position} 应在共享网格上`);
      assert.ok(
        panel.tipWidthControlPlacement(lock, segment, splits, bone, side, index),
        `编辑后 side ${side} 曲线点 ${point.position} 必须有把手`
      );
    });
  }
});

test("stored tip width curves degrade gracefully onto the per-side control grid", () => {
  const { panel, splits, lock, segment } = tipWidthHarness();
  // 0.2.118 存档：右（浅）侧按**本侧** fork 0.8 独立等分（0.82/0.86/0.90/0.94/0.98/1，
  // 间距 0.04），这些参数在共享网格（0.85/0.95/1）上不存在 → 必须重采样迁移形状，
  // 而不是丢回全局默认。
  const legacyCurve = [
    { position: 0, value: 1, interpolation: "linear" },
    { position: 0.8, value: 1.45, interpolation: "linear" },
    { position: 0.82, value: 1.5, interpolation: "linear" },
    { position: 0.86, value: 1.55, interpolation: "linear" },
    { position: 0.9, value: 1.6, interpolation: "linear" },
    { position: 0.94, value: 1.62, interpolation: "linear" },
    { position: 0.98, value: 1.66, interpolation: "linear" },
    { position: 1, value: 1.7, interpolation: "linear" }
  ];
  const bone = {
    spread: 0,
    taperCurve: legacyCurve.map((point) => ({ ...point })),
    taperCurveSecondary: legacyCurve.map((point) => ({ ...point })),
    asymmetricWidthCurve: true
  };
  // 加载即用（不重建）：采样仍是旧曲线，值不跳变。
  const boundaries = [-1, ...splits.map((split) => split.position), 1];
  const before = panel.tipWidthMultiplierAt(lock, 0.9, boundaries[segment + 1], bone, segment, splits);
  assert.ok(Number.isFinite(before), "旧曲线采样应有限（无 NaN）");
  // 重建（下一次编辑触发）：旧形状按新位置重采样迁移，而不是丢回全局默认。
  const rebuilt = panel.buildTipWidthCurve(lock, segment, splits, bone, 1);
  const fork = panel.tipWidthSideForkT(lock, segment, splits, 1);
  const positions = panel.tipWidthSideControlTs(lock, segment, splits, 1);
  positions.forEach((position) => {
    const point = rebuilt.find((item) => Math.abs(item.position - position) < 1e-3);
    assert.ok(point, `重建曲线应含控制位置 ${position}`);
    const migrated = Math.abs(point.value - sampleLegacy(legacyCurve, position));
    assert.ok(migrated < 1e-6, `位置 ${position} 应迁移旧曲线采样值（实测差 ${migrated}）`);
  });
  // 重建后不再有活但抓不到的点（旧的 0.82/0.86/0.90/0.94/0.98 被规整到共享网格）。
  rebuilt.forEach((point) => {
    if (point.position <= fork + 1e-4) return;
    assert.ok(
      positions.some((position) => Math.abs(position - point.position) < 1e-3),
      `重建后曲线点 ${point.position} 应是本侧暴露位置`
    );
  });
  rebuilt.forEach((point) => {
    assert.ok(Number.isFinite(point.value), `重建后值应有限：${point.position}`);
  });
});

// 线性曲线采样（与 curve-math sampleTaperCurve 的 linear 分支一致），用于验证迁移值。
function sampleLegacy(curve, position) {
  const clamped = Math.min(1, Math.max(0, position));
  const rightIndex = curve.findIndex((point) => point.position >= clamped);
  if (rightIndex <= 0) return curve[0].value;
  const left = curve[rightIndex - 1];
  const right = curve[rightIndex];
  const span = Math.max(0.0001, right.position - left.position);
  const amount = Math.min(1, Math.max(0, (clamped - left.position) / span));
  return left.value + (right.value - left.value) * amount;
}

// ---- zipper 增删的段骨骼重映射（BUG 1 错位 + BUG 2 姿态继承回归）----
// 用可区分的 tip 位移标记每段骨骼：tip.points[i].x - restPoints[i].x = 该段的 id。
function segmentBoneWithTipDelta(id) {
  return {
    name: `split.${id}`,
    parent: "main",
    parentParam: 0.5,
    spread: 0.1 * (id + 1),
    tip: {
      points: [{ x: id, y: 0, z: 0 }, { x: id, y: 1, z: 0 }],
      restPoints: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }],
      twists: [0, 0],
      active: true
    }
  };
}

const tipDeltaOf = (bone) => (bone?.tip ? bone.tip.points[0].x - bone.tip.restPoints[0].x : null);

test("inserting a zipper subdivides its segment and shifts later segments (no bone misplacement)", () => {
  const bones = [0, 1, 2].map(segmentBoneWithTipDelta);
  // 在段 1 插入：段 1 一分为二，两半都继承段 1，原段 2 后移到下标 3。
  const out = remapSegmentBonesOnInsert(bones, 1);
  assert.equal(out.length, 4, "N+1 segments after insert");
  assert.deepEqual(
    out.map(tipDeltaOf),
    [0, 1, 1, 2],
    "两半继承被细分段(1)、其后段(2)整体后移；旧实现会得到 [0,1,2,null] 即错位+末段默认"
  );
  // spread 同样跟随来源段（BUG 2：新段基于原段而非默认）。
  assert.ok(Math.abs(out[2].spread - bones[1].spread) < 1e-9, "new half inherits source spread");
  // name/parentParam 置空以便按新段边界重新派生（不继承旧叉口深度）。
  assert.equal(out[2].name, null, "name re-derives");
  assert.equal(out[2].parentParam, null, "parentParam re-derives for the new boundaries");

  // 边界：插入首段 / 末段。
  assert.deepEqual(remapSegmentBonesOnInsert(bones, 0).map(tipDeltaOf), [0, 0, 1, 2]);
  assert.deepEqual(remapSegmentBonesOnInsert(bones, 2).map(tipDeltaOf), [0, 1, 2, 2]);
});

test("segment bone remap deep-clones so the source is never aliased", () => {
  const bones = [0, 1, 2].map(segmentBoneWithTipDelta);
  const out = remapSegmentBonesOnInsert(bones, 1);
  out[1].tip.points[0].x = 99;
  assert.equal(bones[1].tip.points[0].x, 1, "input bone untouched");
  assert.equal(out[2].tip.points[0].x, 1, "sibling half not aliased to the same tip object");
  const del = remapSegmentBonesOnDelete(bones, 0, {});
  del[0].tip.points[0].x = 77;
  assert.equal(bones[0].tip.points[0].x, 0, "delete path also deep-clones");
});

test("deleting a zipper merges two segments and keeps the wider segment's pose", () => {
  const bones = [0, 1, 2].map(segmentBoneWithTipDelta);
  // 删除下标 1 的拉链 → 段 1 与段 2 合并。spans 表明段 2 更宽 → 保留段 2 的姿态。
  const widerRight = remapSegmentBonesOnDelete(bones, 1, { spans: [0.5, 0.2, 0.9] });
  assert.equal(widerRight.length, 2, "N-1 segments after delete");
  assert.deepEqual(widerRight.map(tipDeltaOf), [0, 2], "merged slot keeps the wider (right) segment pose");
  // 段 1 更宽 → 保留段 1。
  const widerLeft = remapSegmentBonesOnDelete(bones, 1, { spans: [0.5, 0.9, 0.2] });
  assert.deepEqual(widerLeft.map(tipDeltaOf), [0, 1], "merged slot keeps the wider (left) segment pose");
  // 无 spans → 回退取左段；显式 survivorIndex 优先。
  assert.deepEqual(remapSegmentBonesOnDelete(bones, 1, {}).map(tipDeltaOf), [0, 1], "no spans -> left survivor");
  assert.deepEqual(
    remapSegmentBonesOnDelete(bones, 1, { spans: [0.5, 0.9, 0.2], survivorIndex: 2 }).map(tipDeltaOf),
    [0, 2],
    "explicit survivorIndex wins over spans"
  );
  // 删除首段的拉链：段 0/1 合并，原段 2 前移。
  assert.deepEqual(remapSegmentBonesOnDelete(bones, 0, { spans: [0.2, 0.8, 0.5] }).map(tipDeltaOf), [1, 2]);
});

// 悬空 zipper 选择必须被清除：否则 - 删掉被选中的 zipper 后，下次按 Del 会因
// order 找不到而穿透到 deleteCurrentSelection() 误删整根头发。
test("zipper count changes clear a dangling split selection", async () => {
  const source = await readFile(new URL("../modules/bones/segment-control.js", import.meta.url), "utf8");
  assert.match(
    source,
    /function dropDanglingPanelSplitSelection[\s\S]*hasOrder\(splits, selection\.order\)[\s\S]*panelSplitSelection = null/,
    "panel: dangling selection is dropped when its order no longer exists"
  );
  assert.match(
    source,
    /function dropDanglingStrandSplitSelection[\s\S]*hasOrder\(splits, selection\.order\)[\s\S]*strandSplitSelection = null/,
    "strand: dangling selection is dropped when its order no longer exists"
  );
  // 两条增删路径都必须调用（否则 - 之后仍会留下悬空选择）。
  assert.match(source, /materializeSplitBones\(target\);\s*\n[\s\S]{0,200}dropDanglingPanelSplitSelection\(target, splits\)/);
  assert.match(source, /materializeStrandSplitBones\(target\);\s*\n\s*dropDanglingStrandSplitSelection\(target, splits\)/);
});

// 发尖子骨骼笔刷必须在 materialize 后的空间里工作：authored.points 存的是"旧 rest +
// delta"的绝对值，rest 链一变（加/删 zipper 继承来源段 rest、主链编辑、zipper 高度/
// spread、面板宽度…）它就是过期空间。笔刷若从 authored.points 播种、写回时又把
// restPoints 重设为新 rest，就会抹掉 delta，发尖跳回改动前的位置。
const COUNT = 4;

// authored: 相对 OLD rest(x=0) 有 +5 的 delta。
function authoredTipWithDelta(oldRestX, pointX) {
  return {
    points: Array.from({ length: COUNT }, (_, i) => ({ x: pointX, y: i, z: 0 })),
    restPoints: Array.from({ length: COUNT }, (_, i) => ({ x: oldRestX, y: i, z: 0 })),
    twists: Array.from({ length: COUNT }, () => 0),
    active: true
  };
}

// 新 rest 链：x = newRestX（与 authored.restPoints 不同，模拟 rest 已被改动）。
function restChainAt(newRestX) {
  return (t) => ({ x: newRestX, y: t * (COUNT - 1), z: 0 });
}

test("tip sub-bone brush must seed from the materialized chain, not authored points", () => {
  const authored = authoredTipWithDelta(0, 5);
  const restPointAt = restChainAt(20);

  // ① 继承语义：显示位置 = 新 rest + delta = 20 + 5 = 25。
  const shown = materializeTipChain(authored, restPointAt, COUNT);
  assert.equal(shown.restPoints.length, COUNT);
  shown.points.forEach((p, i) => {
    assert.ok(Math.abs(p.x - 25) < 1e-9, `materialized point ${i} re-applies the inherited delta`);
  });

  // ② 修复后的笔刷往返：从 materialize 后的点播种 → +1 → 写回 points/restPoints=当前 rest。
  const edited = shown.points.map((p) => ({ x: p.x + 1, y: p.y, z: p.z }));
  const fixedAuthored = {
    points: edited.map((p) => ({ ...p })),
    restPoints: shown.restPoints.map((p) => ({ ...p })),
    twists: authored.twists.slice(),
    active: true
  };
  // 同一 rest 链上重新 materialize 必须精确复现被编辑的位置（delta 重叠成恒等）。
  const afterFix = materializeTipChain(fixedAuthored, restPointAt, COUNT);
  afterFix.points.forEach((p, i) => {
    assert.ok(Math.abs(p.x - 26) < 1e-9, `fixed brush keeps the edited position at ${i} (no jump)`);
  });

  // ③ 负向对照（旧的 bug 行为）：从 authored.points 播种（过期空间）+ 同样的写回。
  const staleEdited = authored.points.map((p) => ({ x: p.x + 1, y: p.y, z: p.z }));
  const buggyAuthored = {
    points: staleEdited.map((p) => ({ ...p })),
    restPoints: shown.restPoints.map((p) => ({ ...p })),
    twists: authored.twists.slice(),
    active: true
  };
  const afterBug = materializeTipChain(buggyAuthored, restPointAt, COUNT);
  afterBug.points.forEach((p, i) => {
    // 6 而不是 26：正好跳回 rest 链的位移量（-20），即"发尖跳回加 zipper 前的位置"。
    assert.ok(Math.abs(p.x - 6) < 1e-9, `stale seeding jumps back by the rest shift at ${i}`);
  });
  assert.ok(Math.abs(afterBug.points[0].x - afterFix.points[0].x + 20) < 1e-9, "the jump equals the rest-chain shift");
});

