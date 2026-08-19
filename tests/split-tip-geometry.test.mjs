import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import { createPanelTipStrandApi, TIP_WIDTH_CONTROL_POINTS } from "../modules/geometry/panel-tip-strand.js";
import { createStrandGeometryApi } from "../modules/geometry/strand-geometry.js";
import {
  materializeTipChain,
  sampleCenterlinePoint,
  sampleTipPosition,
  sweepRingCentroids,
  tipCaptureWeightAt,
  tipChainFrameAt,
  tipWeightAt
} from "../modules/geometry/tip-sub-bone.js";
import {
  strandSplitBonesFor,
  strandSplitTubeCenter,
  strandSplitTubeCenterForSegment,
  strandSplitsFor,
  strandSplitForkT,
  strandSplitForkTForSegment,
  strandSplitBonesFromData,
  strandSplitBonesToData,
  splitBonesFromData,
  splitBonesToData,
  bonesFromData,
  bonesToData,
  mirrorSplitBones,
  mirrorStrandSplitBones,
  remapSegmentBonesOnInsert,
  remapSegmentBonesOnDelete,
  PANEL_SEGMENT_HOST,
  SPREAD_MAX,
  STRAND_SEGMENT_HOST
} from "../modules/bones/bone-model.js";
import { strandTubeCenterForTube } from "../modules/io/usda-export.js";
import { sampleAsymmetricTaperCurve } from "../modules/geometry/curve-math.js";
import { unfoldHairMesh } from "../modules/io/uv-unfold.js";
import {
  setStrandTipWidthCurveValue,
  strandTipBlendStartT,
  strandTipClumpAxis,
  strandTipWidthControlPlacement,
  strandTipWidthEdgePoints,
  strandTipWidthEdgePosition,
  strandTipWidthMultiplierAt,
  strandTipWidthResetCurve,
  strandTubeBandExtents,
  strandTubeForkT,
  strandTubeGridTs,
  strandTubeSideControlTs,
  strandTubeSideForkT,
  strandTubeSignedCoordinate
} from "../modules/geometry/strand-tip-width.js";
import { tipWidthSideExposesTAt } from "../modules/geometry/tip-width-curve.js";
import { firstExposedTipChainIndex } from "../modules/geometry/tip-sub-bone.js";
import { leafIndexAt, leafWeightsValid } from "../modules/geometry/leaf-weights.js";

// Phase B 的 source-text 断言用源码（同 L173/L183 的既有模式：DOM/跨文件耦合只能靠读源码守）。
const [appSourceForTipWidth, strandGeometrySource, strandTipWidthSource] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../modules/geometry/strand-geometry.js", import.meta.url), "utf8"),
  readFile(new URL("../modules/geometry/strand-tip-width.js", import.meta.url), "utf8")
]);

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
  // 0.2.132：回退分支原为「主曲线点 + frame.x · opening」，opening 已随 segment separate 语义
  // 删除，回退现在就是主曲线点本身。断言的**意图不变**（环心不可用时必须仍有一条有限的 rest，
  // 否则 materializeTipChain 会拿到 undefined），只是回退表达式变简单了。
  assert.match(
    appSource,
    /\? storedRestCenters\s*:\s*null[\s\S]*if \(tubeRestCenters\)[\s\S]{0,900}?return curve\.getPoint\(t\);/,
    "missing or mismatched rest centers must fall back to the main curve point"
  );
  // 负向对照：已删除的横向平移不得回到 rest 回退里。判据按**语义**而不是变量名写
  // （app.js 另有一个无关的 `const opening = !rebuildCurveDialog.open`，那是对话框状态）：
  // 平移必然要沿 frame.x 推一个含 spread 的量，所以扫这个组合。
  assert.doesNotMatch(
    appSource,
    /addScaledVector\(frame\.x, opening\)/,
    "the deleted lateral opening must not come back into the rest fallback"
  );
  // 0.2.126：视口把手不再自己取链，改由 tip-sub-bone-host 的适配器统一取 —— 断言的**意图
  // 不变**（视口与编辑控件必须消费同一份物化链），只是同源点搬到了适配器里。
  const hostSource = await readFile(
    new URL("../modules/bones/tip-sub-bone-host.js", import.meta.url),
    "utf8"
  );
  assert.match(
    hostSource,
    /const chains = deps\.currentStrandSplitTipChains\(lock\);[\s\S]{0,400}?tipChainFor: \(segment\) => chains\?\.\[segment\] \|\| null/,
    "the strand tip host must serve chains from currentStrandSplitTipChains (same materialized space as editing controls)"
  );
  // 负向对照：适配器**不得**自己 materializeTipChain 出一条近似 rest（主曲线 + 侧向偏移），
  // 那正是 0.2.120 要根除的「编辑基准与视口不一致」。
  assert.doesNotMatch(
    hostSource,
    /materializeTipChain/,
    "the host must never build its own strand rest chain (that would desync from the viewport)"
  );
  assert.match(
    handleSource,
    /currentStrandSplitTipChains: \(lock\) => deps\.currentStrandSplitTipChains\(lock\)/,
    "viewport handles must forward the same chain source into the host adapter"
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

// ── 0.2.132 字段改名 spread → tipClump：旧档必须**逐值**升级，不得丢值 ──────────────────
// 改名的理由见 devlog/APPJS_SPLIT_GUIDE.md §7.2b（main 的 `spread` 是发丝聚簇参数，与发尖
// 收窄同名不同物）。兼容契约有两条，缺一条就会让用户的旧工程静默变形：
//   ① 读：只有 spread 的旧档必须被当成 tipClump（回退只在 normalize 层做一次）。
//   ② 写：落盘只写 tipClump（双写会让两个字段各自漂移，下次谁赢取决于读取顺序）。
test("0.2.132: an old file's bone.spread loads as tipClump, and only tipClump is written back", () => {
  const lock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [
      { position: -0.3, height: 0.4, order: 0 },
      { position: 0.3, height: 0.2, order: 1 }
    ]
  };
  // 旧档形状：**只有** spread，没有 tipClump。三管取三个不同值，防止「碰巧等于默认值」蒙对。
  const legacyData = [0.31, 0.62, 0.93].map((spread, k) => ({
    name: `split.${k}`,
    parent: "main",
    spread,
    tip: null
  }));
  const restored = strandSplitBonesFromData(legacyData, lock);
  assert.ok(restored, "the legacy array restores");
  assert.deepEqual(
    restored.map((bone) => bone.tipClump),
    [0.31, 0.62, 0.93],
    "each tube's legacy spread must arrive as its tipClump (no value lost, no default substituted)"
  );
  // 落盘只写新名。
  const written = strandSplitBonesToData(restored);
  assert.deepEqual(
    written.map((bone) => bone.tipClump),
    [0.31, 0.62, 0.93],
    "serialization carries tipClump"
  );
  assert.ok(
    written.every((bone) => !("spread" in bone)),
    "serialization must NOT keep writing the legacy spread key (dual-write drifts)"
  );
  // 新名优先：同时存在时 tipClump 赢（旧档升级后若仍残留 spread，不得让它盖回去）。
  const bothData = [{ name: "split.0", parent: "main", spread: 0.11, tipClump: 0.88, tip: null }];
  const bothLock = { geometryType: "strand", strandSplitEnabled: true, strandSplits: [] };
  assert.equal(
    strandSplitBonesFromData(bothData, bothLock)[0].tipClump,
    0.88,
    "tipClump wins over a stale spread on the same bone"
  );
});

// **三条持久化路径**都必须同样地升级旧档：发丝管（上一条）、panel 段、统一 registry。
// 为什么必须逐条钉：它们是三个独立的 normalize/serialize 对（`strandSplitBones*` /
// `splitBones*` / `bones*`），漏掉任何一条就会出现「同一个工程里 panel 段丢了 Tip Clump、
// 发丝管没丢」这种只在特定几何上复现的数据损坏。
test("0.2.132: the panel and unified-registry paths upgrade legacy spread identically", () => {
  const panelSplits = [{ position: 0, height: 0.4 }];
  const panelLock = { geometryType: "panel", panelSplits, panelSplitGap: 0.07 };
  // panel 段：旧档只有 spread，两段取不同值。
  const panelLegacy = [
    { name: "split.0", parent: "main", spread: 0.44, tip: null },
    { name: "split.1", parent: "main", spread: 0.77, tip: null }
  ];
  const panelRestored = splitBonesFromData(panelLegacy, panelSplits, panelLock);
  assert.deepEqual(
    panelRestored.map((bone) => bone.tipClump),
    [0.44, 0.77],
    "panel: legacy spread arrives as tipClump"
  );
  const panelWritten = splitBonesToData(panelRestored);
  assert.deepEqual(panelWritten.map((bone) => bone.tipClump), [0.44, 0.77], "panel: writes tipClump");
  assert.ok(
    panelWritten.every((bone) => !("spread" in bone)),
    "panel: must not keep writing the legacy key"
  );

  // 统一 registry（lock.bones）：同一条回退必须成立，否则 project-files 的导出侧
  // （消费 bonesFor → normalizeBone）会拿到默认值而不是作者的值。
  const registryRestored = bonesFromData(
    [{ name: "split.0", kind: "split", spread: 0.55 }],
    panelLock
  );
  assert.equal(registryRestored[0].tipClump, 0.55, "registry: legacy spread arrives as tipClump");
  const registryWritten = bonesToData(registryRestored);
  assert.equal(registryWritten[0].tipClump, 0.55, "registry: writes tipClump");
  assert.ok(
    registryWritten.every((bone) => !("spread" in bone)),
    "registry: must not keep writing the legacy key"
  );

  // 镜像两条路径：tipClump 必须随管/段序 reverse 一起走（值不能留在原下标上）。
  const clumps = [0.1, 0.5, 0.9].map((tipClump, k) => ({ name: `split.${k}`, parent: "main", tipClump, tip: null }));
  assert.deepEqual(
    mirrorStrandSplitBones(clumps).map((bone) => bone.tipClump),
    [0.9, 0.5, 0.1],
    "strand mirror reverses tipClump with the tube order"
  );
  assert.deepEqual(
    mirrorSplitBones(clumps).map((bone) => bone.tipClump),
    [0.9, 0.5, 0.1],
    "panel mirror reverses tipClump with the segment order"
  );
});

// 负向对照：几何**真的**读 tipClump，而不是碰巧因为默认值相同才看起来对。
// 做法是把同一根管的两种字段写成**不同**的值，然后断言网格跟着 tipClump 走。
test("0.2.132: geometry reads tipClump, NOT the legacy spread (differing values prove it)", () => {
  const tubeCount = 3;
  const bonesWith = (fields) => Array.from({ length: tubeCount }, (_, k) => ({
    name: `split.${k}`,
    parent: "main",
    taperCurve: null,
    taperCurveSecondary: null,
    asymmetricWidthCurve: null,
    ...fields
  }));
  const tipSpanOf = (fields) => {
    const lock = tipWidthLock({
      strandSplits: [
        { position: -0.4, height: 0.35, order: 0 },
        { position: 0.4, height: 0.35, order: 1 }
      ],
      strandSplitBones: bonesWith(fields)
    });
    const geometry = tipWidthGeometryFor(lock);
    assert.ok(geometry, "fixture must build");
    const xs = tubeRowXs(geometry, positionsOf(geometry), 1, geometry.userData.actualLengthSegments);
    return Math.max(...xs) - Math.min(...xs);
  };
  // 基准：无收窄。
  const wide = tipSpanOf({ tipClump: 0 });
  // tipClump 收窄、spread 故意写成 0 —— 若消费端读的是 spread，这里会等于 wide。
  const clumped = tipSpanOf({ tipClump: 0.8, spread: 0 });
  assert.ok(
    clumped < wide - 1e-6,
    `tipClump must drive the mesh even when a stale spread says 0 (${wide} -> ${clumped})`
  );
  // 反向：只有 spread（旧档形状）时，normalize 的回退让它照旧生效。
  const legacyOnly = tipSpanOf({ spread: 0.8 });
  assert.ok(
    Math.abs(legacyOnly - clumped) < 1e-9,
    `a legacy-only bone must narrow identically (${legacyOnly} vs ${clumped})`
  );
  // 且 spread 单独存在时**不得**被当成 0：那会让旧档静默失去收窄。
  assert.ok(legacyOnly < wide - 1e-6, "a legacy-only spread must not be ignored");
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
    sculptState: { tipSelection: null, tipHover: null }
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
  const bone = { tipClump: 0, taperCurve: null, taperCurveSecondary: null, asymmetricWidthCurve: false };
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
  const bone = { tipClump: 0, taperCurve: null, taperCurveSecondary: null, asymmetricWidthCurve: false };
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
      tipClump: 0,
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
    tipClump: 0,
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
    tipClump: 0,
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
    tipClump: 0.1 * (id + 1),
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
  assert.ok(Math.abs(out[2].tipClump - bones[1].tipClump) < 1e-9, "new half inherits source spread");
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

// ---- 管的横向中心（strandSplitTubeCenter 唯一定义点） ----
// 0.2.132：本块原先钉的是 `strandSplitDirection(k,N) = (2k−N)/N`「横向推开方向」，即 0.2.124
// 修「加了多个 zipper 只有一条缝张开」时引入的规则。那条规则**只服务于 opening 平移**，而
// opening 已随 segment separate 语义整体删除。现在需要钉的量变成「管自身的中心」——它才是
// 骨骼/发尖链该挂在哪的答案，也是镜像必须 reverse 的依据（下标 = 从左到右的横向次序）。
// 缝张开与否现在由**收窄**决定，由下方的真实几何测试（seam gap，root vs tip）钉死。
function centersFor(positions) {
  const splits = positions.map((position, order) => ({ position, height: 0.3, order }));
  return Array.from({ length: splits.length + 1 }, (_, k) => strandSplitTubeCenter(k, splits));
}

test("N=1 centred zipper gives tube centres at -0.5 / +0.5", () => {
  assert.deepEqual(centersFor([0]), [-0.5, 0.5], "one centred zipper halves the [-1,1] span");
});

test("tube centres are strictly increasing (index == left-to-right order)", () => {
  // 单调性是镜像 reverse 的**依据**（mirrorStrandSplitBones 的注释绑在这一条上）：
  // 下标 k 必须恒等于从左到右的横向次序，否则 X 镜像把创作数据贴到错误的管上。
  for (const positions of [[-0.4, 0.4], [-0.5, 0, 0.5], [-0.6, -0.2, 0.2, 0.6], [-0.7, 0.1, 0.2, 0.5, 0.6]]) {
    const centers = centersFor(positions);
    assert.equal(centers.length, positions.length + 1, `N=${positions.length} -> N+1 tubes`);
    for (let k = 0; k < positions.length; k += 1) {
      assert.ok(
        centers[k + 1] > centers[k],
        `centres must increase along the index: tube ${k} (${centers[k]}) < tube ${k + 1} (${centers[k + 1]})`
      );
    }
  }
});

test("tube centres follow the ACTUAL zipper division, not an even split", () => {
  // 与被取代的 direction 规则的关键差别：direction 是等距的 (2k−N)/N，与 zipper 实际位置
  // 无关。中心必须跟随真实划分 —— 不然「管心」会落在管外，骨骼/发尖锚点随之错位。
  // zipper 挤在最右侧：管 0 极宽（中心靠左），管 1/2 极窄（中心贴近 +0.7 / +0.8）。
  const centers = centersFor([0.6, 0.8]);
  assert.ok(Math.abs(centers[0] - (-1 + 0.6) / 2) < 1e-12, `tube 0 centre = midpoint(-1, 0.6), got ${centers[0]}`);
  assert.ok(Math.abs(centers[1] - 0.7) < 1e-12, `tube 1 centre = midpoint(0.6, 0.8), got ${centers[1]}`);
  assert.ok(Math.abs(centers[2] - 0.9) < 1e-12, `tube 2 centre = midpoint(0.8, 1), got ${centers[2]}`);
  // 等距 direction 规则会给出 [-1, 0, 1]（与真实划分无关）—— 负向对照。
  assert.ok(Math.abs(centers[1] - 0) > 0.5, "an even-split rule would have put tube 1 at 0");
});

test("symmetric zippers give centres symmetric about 0, and centres stay inside the profile", () => {
  for (const positions of [[0], [-0.4, 0.4], [-0.6, 0, 0.6], [-0.6, -0.2, 0.2, 0.6]]) {
    const centers = centersFor(positions);
    const last = centers.length - 1;
    centers.forEach((value, k) => {
      // 用加法而不是 strictEqual(-x)：正中间管恰好是 0，而 -0 !== 0 在 assert.equal 下会假失败。
      assert.ok(
        Math.abs(value + centers[last - k]) < 1e-12,
        `N=${positions.length}: centre[${k}] === -centre[${last - k}] (got ${value} / ${centers[last - k]})`
      );
      // 中心必须落在 profile 内：它会被乘上 baseWidth 当世界偏移用（usda-export 的派生锚点）。
      assert.ok(Math.abs(value) < 1, `centre[${k}] must lie strictly inside the profile, got ${value}`);
    });
  }
  // 0 拉链（单管，split 发丝上不可达，仅防御）：整段就是 [-1,1]，中心 = 0。
  assert.equal(strandSplitTubeCenter(0, []), 0, "no zippers -> the single band is centred at 0");
  // 越界下标钳进界内，不返回 NaN/undefined（骨骼数组与 splits 短暂不同步的那一帧会走到）。
  assert.equal(strandSplitTubeCenter(99, [{ position: 0 }]), 0.5, "an out-of-range index clamps to the last tube");
  assert.equal(strandSplitTubeCenter(-3, [{ position: 0 }]), -0.5, "a negative index clamps to the first tube");
});

test("bone and USDA consumers agree on the tube centre for the same tube index", () => {
  // 两处消费方必须逐值一致，否则导出的骨骼/视口发尖链会落在与渲染管不同的横向位置。
  const locks = [
    // legacy 单标量（无 strandSplits 数组）
    { geometryType: "strand", strandSplitEnabled: true, strandSplitPosition: 0.1, strandSplitHeight: 0.36 },
    // N=2，故意乱序 + 越界 position（考验两处归一化：排序 + 钳制到 ±0.8）
    {
      geometryType: "strand",
      strandSplitEnabled: true,
      strandSplits: [
        { position: 0.95, height: 0.2, order: 1 },
        { position: -0.4, height: 0.4, order: 0 }
      ]
    },
    // N=4
    {
      geometryType: "strand",
      strandSplitEnabled: true,
      strandSplits: [-0.6, -0.2, 0.2, 0.6].map((position, order) => ({ position, height: 0.3, order }))
    }
  ];
  locks.forEach((lock, lockIndex) => {
    const splits = strandSplitsFor(lock);
    const splitCount = splits.length;
    for (let k = 0; k <= splitCount; k += 1) {
      const boneCenter = strandSplitTubeCenterForSegment(lock, k);
      // usda-export 走自己的 strandSplitsForExport 归一化；喂同一个 lock 派生的 splits
      // 列表长度必须一致，中心也必须一致。
      const usdaCenter = strandTubeCenterForTube(splits, k);
      const sharedCenter = strandSplitTubeCenter(k, splits);
      assert.equal(boneCenter, sharedCenter, `lock ${lockIndex} tube ${k}: bone == shared rule`);
      assert.equal(usdaCenter, sharedCenter, `lock ${lockIndex} tube ${k}: USDA == shared rule`);
    }
  });
});

test("multi-zipper tubes are ALL separated at the tip (EVERY seam opens)", () => {
  const geometryApi = makeMultiSplitGeometryApi();
  // N=2 zippers -> 3 tubes. frame.x = world +x in this harness, so x IS the lateral axis.
  // 0.2.132：分离的**来源变了**（这才是本轮的核心行为断言）。旧实现靠 opening 整管平移，
  // 所以只要断言「管心次序 + 心距变大」就够；现在管**不平移**，分离完全来自每管发尖朝
  // 自身中心**收窄**（Tip Clump）。因此本测试改为量真正的缝——相邻管的**相邻边缘之间**的
  // 间隙——并断言它在 root 处闭合、在 tip 处张开。心距（下方）现在恒定，量它已无判别力。
  const lock = baseSplitLock({
    strandSplits: [
      { position: -0.4, height: 0.4, order: 0 },
      { position: 0.4, height: 0.4, order: 1 }
    ]
  });
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  const geometry = geometryApi.createSplitStrandGeometry(lock, curve, splitProfile());
  assert.ok(geometry, "N=2 zippers should produce geometry");
  const sections = geometry.userData.splitSections;
  assert.equal(sections.length, 3, "two zippers yield three tubes");

  const positions = Array.from(geometry.getAttribute("position").array);
  const rows = geometry.userData.actualLengthSegments + 1;
  const centers = sweepRingCentroids(positions, sections, rows);
  // 管心次序：镜像 reverse 与骨骼锚点都依赖「下标 = 从左到右」，两端行都必须成立。
  for (const row of [0, rows - 1]) {
    const xs = centers.map((tube) => tube[row].x);
    for (let k = 0; k + 1 < xs.length; k += 1) {
      assert.ok(xs[k + 1] > xs[k], `row ${row}: tube ${k} (${xs[k]}) must sit left of tube ${k + 1} (${xs[k + 1]})`);
    }
  }
  // 缝 k|k+1 的间隙 = 管 k+1 的最小 x − 管 k 的最大 x（相邻边缘之间）。
  const seamGaps = (row) => {
    const xs = sections.map((_, tube) => tubeRowXs(geometry, positions, tube, row));
    return xs.slice(0, -1).map((left, k) => Math.min(...xs[k + 1]) - Math.max(...left));
  };
  const rootGaps = seamGaps(0);
  const tipGaps = seamGaps(rows - 1);
  assert.equal(tipGaps.length, 2, "N=2 zippers have two seams");
  for (let k = 0; k < tipGaps.length; k += 1) {
    // root（t=0，收窄比例恒 0）：两管共享裁剪边界 ⇒ 间隙恰为 0（浮点容差）。
    assert.ok(
      Math.abs(rootGaps[k]) < 1e-6,
      `seam ${k}|${k + 1} must be CLOSED at the root, got ${rootGaps[k]}`
    );
    // tip：每管各自朝自身中心收窄 ⇒ 每条缝都必须真的张开。这是「用户可以靠 zipper +
    // Tip Clump 得到简单分叉」的构造性证据。
    assert.ok(
      tipGaps[k] > 1e-4,
      `seam ${k}|${k + 1} must OPEN at the tip (Tip Clump narrowing), got ${tipGaps[k]}`
    );
  }
});

test("Tip Clump = 0 leaves EVERY seam shut (narrowing is the only separation source)", () => {
  // 负向对照，与上一条配对：把每管 Tip Clump 归零后发尖处的缝必须重新闭合。0.2.132 前
  // 分离来自 opening 平移，spread=0 同样闭合 —— 但那时它还会**平移**管心；现在管心恒定，
  // 所以这条同时钉住「收窄是唯一分离来源」。
  const geometryApi = makeMultiSplitGeometryApi();
  const lock = baseSplitLock({
    strandSplits: [
      { position: -0.4, height: 0.4, order: 0 },
      { position: 0.4, height: 0.4, order: 1 }
    ],
    strandSplitBones: Array.from({ length: 3 }, (_, k) => ({
      name: `split.${k}`,
      parent: "main",
      tipClump: 0,
      taperCurve: null,
      taperCurveSecondary: null,
      asymmetricWidthCurve: null
    }))
  });
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  const geometry = geometryApi.createSplitStrandGeometry(lock, curve, splitProfile());
  assert.ok(geometry, "zero Tip Clump must still produce geometry");
  const positions = Array.from(geometry.getAttribute("position").array);
  const sections = geometry.userData.splitSections;
  const tipRow = geometry.userData.actualLengthSegments;
  const xs = sections.map((_, tube) => tubeRowXs(geometry, positions, tube, tipRow));
  for (let k = 0; k + 1 < xs.length; k += 1) {
    const gap = Math.min(...xs[k + 1]) - Math.max(...xs[k]);
    assert.ok(Math.abs(gap) < 1e-6, `seam ${k}|${k + 1} must stay shut at Tip Clump 0, got ${gap}`);
  }
});

// ---- 每管发尖手柄必须按管数分配（0.2.116 N-泛化遗留，管 2..N 曾无手柄） ----
// bone-view-handles.js 里两处循环原本写死 `< 2`：无论多少拉链只造/只摆 2 个黄色手柄，
// 而数据层（Tip Length 滑杆、Reset Split Tips、currentStrandSplitTipChains）早已按
// N+1 管全量写入 —— 结果 N≥2 时管 2..N 会被滑杆移动却既看不见也拖不动。
// 该模块耦合 THREE 场景图与 deps 注入、无法在 node 里直接执行，故沿用本文件既有的
// 源码文本回归手法（同 L173/L183），行为侧则断言真实导出函数给出的管数。
test("per-tube split tip handles are allocated from the tube count, not a literal 2", async () => {
  const handleSource = await readFile(
    new URL("../modules/bones/bone-view-handles.js", import.meta.url),
    "utf8"
  );
  // 0.2.126：per-tube 末点把手已被「每管 × 每链点」的共享分配取代（allocateTipChainHandles）。
  // 本断言的**意图不变**：管数必须从 strandSplits 派生（N+1），不得是字面量 —— 只是现在
  // 派生点是 STRAND_SEGMENT_HOST.segmentCount（bone-model 的唯一定义点）。
  assert.match(
    handleSource,
    /const strandSplitTipTubeCount = STRAND_SEGMENT_HOST\.segmentCount\(lock\);[\s\S]{0,400}?allocateTipChainHandles\(\s*lock,\s*group,\s*strandSplitTipTubeCount,/,
    "creation must size the strand tip-chain handles by the host tube count (N+1)"
  );
  // 宽度把手与发尖链把手必须用**同一个**管数变量（否则某管有发尖把手却没宽度把手）。
  assert.match(
    handleSource,
    /allocateTipWidthHandles\(lock, group, strandSplitTipTubeCount/,
    "strand width handles reuse the SAME tube count variable as the tip-chain handles"
  );
  // 负向对照：整个文件内不得再出现 `tubeIndex < 2` 字面量（0.2.125 修掉的写死 2 管）。
  assert.equal(
    (handleSource.match(/tubeIndex < 2\b/g) || []).length,
    0,
    "no `tubeIndex < 2` literal may remain"
  );
  // 负向对照：管数不得回退成读原始 lock.strandSplits 长度的就地表达式。
  assert.doesNotMatch(
    handleSource,
    /allocateTipChainHandles\(\s*lock,\s*group,\s*lock\.strandSplits\.length/,
    "tube count must come from the host descriptor, not an inline lock.strandSplits expression"
  );

  // 行为侧：N=2 拉链 → 3 管，手柄分配式与骨骼数、几何段数三方一致。
  const lock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [
      { position: -0.3, height: 0.4, order: 0 },
      { position: 0.3, height: 0.2, order: 1 }
    ]
  };
  const tubeCount = strandSplitsFor(lock).length + 1;
  assert.equal(tubeCount, 3, "N=2 zippers -> 3 tubes");
  assert.equal(
    strandSplitBonesFor(lock).length,
    tubeCount,
    "bones per tube == the handle allocation expression"
  );
  assert.equal(
    lock.strandSplits.length + 1,
    strandSplitBonesFor(lock).length,
    "the expression the creation loop uses agrees with strandSplitBonesFor"
  );
  // legacy N=1（无 strandSplits 数组）仍是 2 管：修复不得改变旧档的手柄数。
  const legacyLock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplitPosition: 0.1,
    strandSplitHeight: 0.3
  };
  assert.equal(strandSplitBonesFor(legacyLock).length, 2, "legacy N=1 still allocates 2 tubes");
});

// ---- X 镜像必须反转管序（0.2.116 N-泛化遗留，镜像伴生体每管数据都错位） ----
// 依据 strandSplitTubeCenter(k, splits) 沿下标**单调递增**（0.2.132 前这条依据写作
// strandSplitDirection(k,N)=(2k−N)/N，那个函数已随 opening 删除，单调性结论不变）：
// 下标 = 从左到右的横向次序，绕 X 镜像把最左管映到最右管，所以源管 k 的创作数据在镜像体里
// 属于下标 N−k。
function authoredTubeBone(index, x) {
  return {
    name: `split.${index}`,
    parent: "main",
    parentParam: 0.5 + index * 0.1,
    p: { x, y: 1, z: 0 },
    orient: null,
    tipClump: 0.12,
    kind: "split",
    tip: {
      points: [{ x, y: 1, z: 0 }, { x: x + 0.05, y: 1.2, z: 0 }],
      restPoints: [{ x, y: 1, z: 0 }, { x, y: 1.2, z: 0 }],
      twists: [0, 0.25 + index * 0.1],
      active: true
    }
  };
}

test("mirrorStrandSplitBones reverses tube order so authored data lands on the mirrored tube", () => {
  // N=2 拉链 → 3 管，每管一个可区分的横向 tip x（−0.3 / 0 / +0.3）。
  const N = 2;
  const bones = [authoredTubeBone(0, -0.3), authoredTubeBone(1, 0), authoredTubeBone(2, 0.3)];
  const mirrored = mirrorStrandSplitBones(bones);
  assert.equal(mirrored.length, 3, "mirroring preserves the tube count");

  for (let k = 0; k <= N; k += 1) {
    const source = bones[N - k];
    // ① 身份：下标 k 必须携带源管 N−k 的创作数据（负向对照见下）。
    assert.equal(
      mirrored[k].tip.twists[1],
      -source.tip.twists[1],
      `mirrored tube ${k} carries source tube ${N - k}'s twist (negated)`
    );
    // ② 横向翻转：所有 x（p / tip.points / tip.restPoints）取反。
    assert.equal(mirrored[k].p.x, -source.p.x, `tube ${k} p.x negated`);
    assert.equal(mirrored[k].tip.points[1].x, -source.tip.points[1].x, `tube ${k} tip x negated`);
    assert.equal(
      mirrored[k].tip.restPoints[1].x,
      -source.tip.restPoints[1].x,
      `tube ${k} tip restPoints x negated`
    );
    // ③ 非横向分量不动。
    assert.equal(mirrored[k].tip.points[1].y, source.tip.points[1].y, `tube ${k} tip y untouched`);
    assert.equal(mirrored[k].tip.points[1].z, source.tip.points[1].z, `tube ${k} tip z untouched`);
  }

  // 负向对照：删掉 .reverse() 会让下标 k 拿到源管 k 的数据 —— 下面两条必须失败。
  // 外侧两管的 twist 幅值不同（0.25 / 0.45），所以「按 k 取」与「按 N−k 取」可区分。
  assert.notEqual(
    mirrored[0].tip.twists[1],
    -bones[0].tip.twists[1],
    "un-reversed behaviour (tube 0 keeping tube 0's twist) must NOT hold"
  );
  assert.notEqual(
    mirrored[0].tip.points[1].x,
    -bones[0].tip.points[1].x,
    "un-reversed behaviour (tube 0 keeping tube 0's tip x) must NOT hold"
  );
  // 派生字段：name 必须置 null 交给 normalize 按新下标重派生，否则下标 k 会叫 split.N−k。
  assert.deepEqual(
    mirrored.map((bone) => bone.name),
    [null, null, null],
    "name is dropped so normalizeStrandSplitBone re-derives split.${index} for the NEW index"
  );
  // parentParam 刻意保留：reverse 下它恒等于镜像体该下标应有的叉口深度（详见函数注释）。
  assert.deepEqual(
    mirrored.map((bone) => bone.parentParam),
    [bones[2].parentParam, bones[1].parentParam, bones[0].parentParam],
    "parentParam travels with the bone (reversal-invariant), it is not nulled"
  );
});

test("mirrorStrandSplitBones N=1 (2 tubes) swaps left/right, the legacy case", () => {
  // 真实工程里 split 发丝全是 N=1，这是必须保住的旧行为：两管互换 + x 取反。
  const bones = [authoredTubeBone(0, -0.4), authoredTubeBone(1, 0.4)];
  const mirrored = mirrorStrandSplitBones(bones);
  assert.equal(mirrored.length, 2, "N=1 stays 2 tubes");
  assert.equal(mirrored[0].p.x, -bones[1].p.x, "mirrored left tube = negated right tube");
  assert.equal(mirrored[1].p.x, -bones[0].p.x, "mirrored right tube = negated left tube");
  assert.equal(
    mirrored[0].tip.twists[1],
    -bones[1].tip.twists[1],
    "left tube receives the right tube's negated twist"
  );
  // 负向对照（N=1 也要成立）：不 reverse 时 mirrored[0] 会拿源管 0 的 twist。
  assert.notEqual(
    mirrored[0].tip.twists[1],
    -bones[0].tip.twists[1],
    "un-reversed behaviour must NOT hold at N=1 either"
  );
  // 空 / 非数组仍返回 null（既有契约不变）。
  assert.equal(mirrorStrandSplitBones([]), null, "empty -> null");
  assert.equal(mirrorStrandSplitBones(null), null, "null -> null");
});

// ===== Phase B：普通发丝每管发尖 WidthCurve（几何读段级曲线） =====
// 测试用 strandProfileTopologyAt：**忠实复刻** app.js 同名函数的 x 轴 override 路径
// （app.js 不是可 import 模块，故此处重实现；下方有 source-text 断言把两边钉在一起）。
// 只走 x 轴 override + 「override 生效时不重新居中」这两条契约，depth 与 centering 分支
// 本轮用不到：centerAsymmetricProfile 为真且无 override 时直接抛错，防止测试悄悄跑进
// 未复刻的分支还自称通过。
function realisticStrandProfileTopologyAt(
  lock,
  t,
  profilePoints,
  scaleX = 1,
  scaleZ = 1,
  boundsProfilePoints = profilePoints,
  widthOverride = null
) {
  if (!profilePoints?.length) return [];
  if (lock.centerAsymmetricProfile && !widthOverride) {
    throw new Error("test harness does not replicate the centerAsymmetricProfile branch");
  }
  const radiusAt = (axis, signedCoordinate, override) => {
    const shapeCurve = override?.curve ?? (axis === "z" ? lock.depthCurve : lock.taperCurve);
    const secondaryCurve = override?.secondary ?? (axis === "z" ? lock.depthCurveSecondary : lock.taperCurveSecondary);
    const asymmetric = override ? override.asymmetric : (axis === "z" ? lock.asymmetricDepthCurve : lock.asymmetricWidthCurve);
    const coordinate = override ? override.signedCoordinate : signedCoordinate;
    const blendZone = override?.blendZone ?? 1;
    const axisScale = axis === "z" ? Number(lock.depthScale ?? 1) : Number(lock.widthScale ?? 1);
    const baseDimension = axis === "z"
      ? Number(lock.depth ?? 0.16)
      : Number(lock.baseWidth ?? lock.width ?? 0.16);
    return Math.max(
      0,
      baseDimension
        * sampleAsymmetricTaperCurve(shapeCurve, secondaryCurve, asymmetric, coordinate, t, blendZone)
        * axisScale
    );
  };
  // override 生效时绕**管中心**（override.centerX）缩放，不绕全局 x = 0（0.2.128）。
  // 与 app.js 同式：x_out = (pivotX·R0(pivotX) + (x − pivotX)·R_override(x)) · scaleX。
  const warpedX = (profile, index) => {
    const override = widthOverride ? widthOverride(profile, index) : null;
    const radius = radiusAt("x", profile.x, override);
    const pivotX = Number(override?.centerX);
    if (!override || !Number.isFinite(pivotX)) return profile.x * radius * scaleX;
    return (profile.x * radius + pivotX * (radiusAt("x", pivotX, null) - radius)) * scaleX;
  };
  return profilePoints.map((profile, index) => ({
    x: warpedX(profile, index),
    z: profile.z * radiusAt("z", profile.z, null) * scaleZ
  }));
}

// 与上面的 harness 配套的 deps：其余项与 makeMultiSplitGeometryApi 相同，只把
// strandProfileTopologyAt 换成会真正消费第 7 参的实现。
function tipWidthDeps() {
  return {
    branchSweep: {
      createSmoothSweepProfileCurve: () => null,
      // 圆形 profile 的连续采样：t ∈ [0,1) → 环上角度，保证裁剪后每管都有足够点数
      // （degenerate 的 4 点菱形 profile 在 |position|=0.4 处只剩 3 点，测不出侧向分布）。
      sampleSweepProfile: (points, t) => {
        const angle = t * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle) * 0.7);
      },
      trimmedSweepProfile: (points) => points,
      createSweepProfileTopology: () => null
    },
    strandCurveParameters: (lock, curve, segments) => (
      Array.from({ length: segments + 1 }, (_, index) => index / segments)
    ),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    strandProfileTopologyAt: realisticStrandProfileTopologyAt,
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    gridProfileSkipCol: () => -1
  };
}

function makeTipWidthGeometryApi() {
  return createStrandGeometryApi(tipWidthDeps());
}

// 平直全宽曲线（全局默认），与「未创作」在数值上等价，用来隔离 bone 曲线的效果。
const FLAT_CURVE = [
  { position: 0, value: 1, interpolation: "linear" },
  { position: 1, value: 1, interpolation: "linear" }
];
// 发尖明显收窄的曲线。**刻意在整条参数域上都 ≠ 1**（包含 fork 以下）：若曲线在 fork 以下
// 与全局曲线同值，fork 守卫被删掉测试也照样绿（守卫没被真正考察过）。0.5 → 0.4 的斜坡让
// 「fork 以下未被覆盖」成为一条有判别力的断言。
const TIP_BUMP_CURVE = [
  { position: 0, value: 0.5, interpolation: "linear" },
  { position: 1, value: 0.4, interpolation: "linear" }
];

function tipWidthLock(overrides = {}) {
  return {
    geometryType: "strand",
    strandSplitEnabled: true,
    baseWidth: 0.2,
    widthScale: 1,
    depth: 0.16,
    depthScale: 1,
    radialSegments: 16,
    lengthSegments: 8,
    // 全局曲线保持平直：任何宽度差异只可能来自段级 bone 曲线。
    taperCurve: FLAT_CURVE.map((point) => ({ ...point })),
    depthCurve: FLAT_CURVE.map((point) => ({ ...point })),
    points: Array.from({ length: 3 }, (_, index) => ({ x: 0, y: index * 0.5, z: 0 })),
    pointScales: Array.from({ length: 3 }, () => ({ x: 1, z: 1 })),
    strandSplits: [
      { position: -0.4, height: 0.4, order: 0 },
      { position: 0.4, height: 0.3, order: 1 }
    ],
    ...overrides
  };
}

// 未创作曲线的段骨骼（真实工程今天的状态）：曲线字段全 null。
function blankTubeBones(count) {
  return Array.from({ length: count }, (_, k) => ({
    name: `split.${k}`,
    parent: "main",
    tipClump: 0.12,
    taperCurve: null,
    taperCurveSecondary: null,
    asymmetricWidthCurve: null
  }));
}

// 「改动前」的几何 api：strandProfileTopologyAt **丢弃**第 7 参，因此 override 无论传什么都
// 不可能生效 —— 这才是 byte-identity 断言的合法参照物（拿两个都会吃 override 的构型互相比
// 是没有判别力的）。
function makeLegacyGeometryApi() {
  return createStrandGeometryApi({
    ...tipWidthDeps(),
    strandProfileTopologyAt: (lock, t, points, scaleX, scaleZ, bounds) => (
      realisticStrandProfileTopologyAt(lock, t, points, scaleX, scaleZ, bounds, null)
    )
  });
}

function tipWidthGeometryFor(lock, api = makeTipWidthGeometryApi()) {
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  return api.createSplitStrandGeometry(lock, curve, splitProfile());
}

function legacyGeometryFor(lock) {
  return tipWidthGeometryFor(lock, makeLegacyGeometryApi());
}

function positionsOf(geometry) {
  return Array.from(geometry.getAttribute("position").array);
}

test("per-tube tip WidthCurve: unauthored curves keep positions byte-identical", () => {
  // 参照物一律是 legacyGeometryFor（丢弃第 7 参 = 改动前行为）。
  // ① 没有 strandSplitBones（派生默认，曲线恒 null）。
  const plainLock = tipWidthLock();
  const plain = tipWidthGeometryFor(plainLock);
  assert.ok(plain);
  assert.deepEqual(
    positionsOf(plain),
    positionsOf(legacyGeometryFor(plainLock)),
    "no split bones at all -> pre-change output"
  );
  // ② 有段骨骼但 taperCurve 为 null —— 真实工程（Sussurro）的状态。
  const blankLock = tipWidthLock({ strandSplitBones: blankTubeBones(3) });
  const withBlankBones = tipWidthGeometryFor(blankLock);
  assert.deepEqual(
    positionsOf(withBlankBones),
    positionsOf(legacyGeometryFor(blankLock)),
    "a bone whose taperCurve is null must not perturb a single vertex"
  );
  // ③ 只创作了 secondary（primary 仍 null）也必须是无覆盖路径：primary 缺失即「本段从未
  //    创作」，几何不得凭 secondary 单独进入 override 分支（否则 asymmetric 关闭时会静默
  //    把整段宽度换成 lock 的 secondary）。
  const secondaryOnly = blankTubeBones(3);
  secondaryOnly[0].taperCurveSecondary = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  const secondaryOnlyLock = tipWidthLock({ strandSplitBones: secondaryOnly });
  assert.deepEqual(
    positionsOf(tipWidthGeometryFor(secondaryOnlyLock)),
    positionsOf(legacyGeometryFor(secondaryOnlyLock)),
    "secondary alone (no authored primary) stays on the global-curve path"
  );

  // ④ lock 级非对称已打开时，未创作的 bone 仍**不得**进入 override 路径。这条是有判别力的：
  //    override 会把采样坐标从 raw profile.x 换成管内相对坐标、blendZone 从 1 换成 0.25，
  //    所以哪怕曲线来源逐字段回退到 lock，几何也会移动 —— 「未创作即完全不介入」必须靠
  //    创作判据（taperCurve >= 2 点）保证，而不是靠回退恰好等价。
  const asymmetricLock = (bones) => tipWidthLock({
    asymmetricWidthCurve: true,
    taperCurveSecondary: TIP_BUMP_CURVE.map((point) => ({ ...point })),
    strandSplitBones: bones
  });
  const asymmetricBlankLock = asymmetricLock(blankTubeBones(3));
  assert.deepEqual(
    positionsOf(tipWidthGeometryFor(asymmetricBlankLock)),
    positionsOf(legacyGeometryFor(asymmetricBlankLock)),
    "an unauthored bone stays inert even when the lock-level asymmetric width curve is on"
  );
});

test("per-tube tip WidthCurve: only rows above the tube fork move, row 0 stays bit-identical", () => {
  const baseLock = tipWidthLock({ strandSplitBones: blankTubeBones(3) });
  const authoredBones = blankTubeBones(3);
  authoredBones[1].taperCurve = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  const authoredLock = tipWidthLock({ strandSplitBones: authoredBones });

  const base = tipWidthGeometryFor(baseLock);
  const authored = tipWidthGeometryFor(authoredLock);
  assert.ok(base && authored);
  const basePositions = positionsOf(base);
  const authoredPositions = positionsOf(authored);
  assert.equal(authoredPositions.length, basePositions.length, "topology is unchanged");

  const sections = authored.userData.splitSections;
  const rows = authored.userData.actualLengthSegments + 1;
  // 管 1 的 fork = 1 - max(0.4, 0.3) = 0.6（与 strandSplitForkTForSegment 同规则）。
  const fork = strandSplitForkTForSegment(authoredLock, 1);
  assert.equal(fork, 0.6, "tube 1 fork = 1 - deepest adjacent zipper height");

  let movedAboveFork = 0;
  sections.forEach((section, tube) => {
    for (let row = 0; row < rows; row += 1) {
      const t = row / (rows - 1);
      for (let column = 0; column < section.ringSize; column += 1) {
        const index = section.base + row * section.ringSize + column;
        const same = [0, 1, 2].every((axis) => (
          authoredPositions[index * 3 + axis] === basePositions[index * 3 + axis]
        ));
        if (tube === 1 && t > fork) {
          if (!same) movedAboveFork += 1;
          continue;
        }
        // fork 以下（含整条未创作的管 0 / 管 2）逐位不动：曲线覆盖只在本段 fork 之上生效，
        // 且曲率收窄预趟刻意不吃 override（见 strand-geometry.js 注释），所以不会跨行/跨管扩散。
        assert.ok(
          same,
          `tube ${tube} row ${row} (t=${t}) must be untouched at or below the fork`
        );
      }
    }
    // row 0 是 UV 的 U 轴唯一来源（uv-unfold 按 row 0 环上弧长累计），单独再断一次。
    for (let column = 0; column < section.ringSize; column += 1) {
      const index = section.base + column;
      assert.equal(authoredPositions[index * 3], basePositions[index * 3], `tube ${tube} row 0 x frozen`);
      assert.equal(authoredPositions[index * 3 + 1], basePositions[index * 3 + 1], `tube ${tube} row 0 y frozen`);
      assert.equal(authoredPositions[index * 3 + 2], basePositions[index * 3 + 2], `tube ${tube} row 0 z frozen`);
    }
  });
  assert.ok(movedAboveFork > 0, "the authored tube must actually change above its fork");
});

test("per-tube tip WidthCurve: unfoldHairMesh uvs are value-for-value identical", () => {
  // §3 的 UV 契约钉死断言：U 只由 row 0 弧长决定、V 只由行号决定，发尖宽度只动 fork 以上
  // 的顶点 → 展开 uv 必须逐值相等。
  const authoredBones = blankTubeBones(3);
  authoredBones[0].taperCurve = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  authoredBones[2].taperCurve = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  const base = tipWidthGeometryFor(tipWidthLock({ strandSplitBones: blankTubeBones(3) }));
  const authored = tipWidthGeometryFor(tipWidthLock({ strandSplitBones: authoredBones }));

  const baseUnfold = unfoldHairMesh(base, { kind: "split" });
  const authoredUnfold = unfoldHairMesh(authored, { kind: "split" });
  assert.ok(baseUnfold && authoredUnfold, "split unfold must succeed in both states");
  assert.notDeepEqual(
    positionsOf(authored),
    positionsOf(base),
    "sanity: the authored curve really did change the geometry"
  );
  assert.deepEqual(authoredUnfold.uvs, baseUnfold.uvs, "authored tip width must not shift a single uv");
  assert.deepEqual(authoredUnfold.faces, baseUnfold.faces, "face stream is unchanged too");
});

test("per-tube tip WidthCurve: BOTH sides are reachable on an EDGE tube (0.2.80 dead-zone class)", () => {
  // 这是本阶段的核心回归。管 0 裁剪后的 raw x **全为负**（实测 [-1, -0.4]），所以若把
  // raw profile.x 当作 signedCoordinate 传给 sampleAsymmetricTaperCurve，blendZone=0.25 下
  // alpha = clamp((x + 0.25) / 0.5) 恒为 0 → 整管只采 secondary、primary 永不生效。
  // 那正是 panel 在 0.2.80 修掉的「不跨 0 段曲线动了发丝不动」死区同类 bug。
  // 用管内相对坐标 (x - centerX)/halfSpan ∈ [-1, 1] 后两侧都能采到。
  const extents = strandTubeBandExtents(
    Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      return { x: Math.cos(angle), z: Math.sin(angle) * 0.7 };
    }),
    tipWidthLock().strandSplits,
    0
  );
  assert.ok(extents.highX < 0, "tube 0's band lies entirely on the negative side of x");
  assert.ok(
    strandTubeSignedCoordinate(extents.lowX, extents.centerX, extents.halfSpan) <= -1 + 1e-9
      && strandTubeSignedCoordinate(extents.highX, extents.centerX, extents.halfSpan) >= 1 - 1e-9,
    "the tube-relative coordinate still spans [-1, 1] on an edge tube"
  );

  const baseline = tipWidthGeometryFor(tipWidthLock({ strandSplitBones: blankTubeBones(3) }));

  // primary（右侧）创作：raw-x 设计下 alpha=0 ⇒ 整管采 secondary=lock 平直曲线 ⇒ 与 baseline
  // 逐位相同 ⇒ 下面第一条断言会失败。这就是「用 raw profile.x 会 FAIL」的具体机制。
  const primaryBones = blankTubeBones(3);
  primaryBones[0].taperCurve = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  primaryBones[0].taperCurveSecondary = FLAT_CURVE.map((point) => ({ ...point }));
  primaryBones[0].asymmetricWidthCurve = true;
  const primaryOnly = tipWidthGeometryFor(tipWidthLock({ strandSplitBones: primaryBones }));

  // secondary（左侧）创作：primary 保持平直（但必须存在，否则视为「未创作」走全局路径）。
  const secondaryBones = blankTubeBones(3);
  secondaryBones[0].taperCurve = FLAT_CURVE.map((point) => ({ ...point }));
  secondaryBones[0].taperCurveSecondary = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  secondaryBones[0].asymmetricWidthCurve = true;
  const secondaryOnly = tipWidthGeometryFor(tipWidthLock({ strandSplitBones: secondaryBones }));

  assert.notDeepEqual(
    positionsOf(primaryOnly),
    positionsOf(baseline),
    "authoring the RIGHT-side curve must move an edge tube (raw profile.x would leave it identical)"
  );
  assert.notDeepEqual(
    positionsOf(secondaryOnly),
    positionsOf(baseline),
    "authoring the LEFT-side curve must move an edge tube too"
  );
  assert.notDeepEqual(
    positionsOf(primaryOnly),
    positionsOf(secondaryOnly),
    "the two sides must be distinguishable: one shared curve source would collapse them"
  );
});

// ===== 0.2.128 回归：对称的发尖宽度编辑必须产生对称的位移 =====
// 用户报告：「普通发丝的发尖 WidthCurve 绿色控制点调整宽度时两侧不对称，一侧位移很小，
// 但右边曲线面板里是正常的」。面板正常 ⇒ 写入没问题，错在**消费**（几何）。
// 病因：老式 `x_out = x · R` 是绕**全局** profile 原点 x = 0 的缩放，位移 `x · (m − 1)`
// 正比于 |raw x|；管的 band 一般不以 0 为中心，于是同一个对称 multiplier 在一根管的两侧
// 产生完全不同的位移。修法与 panel 在 §8.20 做的同构：绕**管中心**缩放。
//
// 下面两条测试各自钉住一个数值化的病态点，**都**在改动前会红：
//   ① 两侧都有拉链的偏心管：老式下两侧位移比 = lowX / highX ≠ −1（本构型 = −0.6/0 → 高侧恒 0）
//   ② N = 1（默认拉链，真实工程的形态）的缝侧顶点：raw x 恰为 0 ⇒ 老式位移**恒为 0**
//      = 用户说的「一侧位移很小」的极端形式。

// 偏心管构型：拉链在 -0.6 / 0.0（等高 0.4）⇒ 管 1 的 band = [-0.6, 0]、中心 -0.3。
// 刻意**不**用对称的 ±0.4（那会让中间管恰好跨 0、老式碰巧也对称 = 没有判别力）。
function offCentreTubeLock(bones = null) {
  return tipWidthLock({
    strandSplits: [
      { position: -0.6, height: 0.4, order: 0 },
      { position: 0, height: 0.4, order: 1 }
    ],
    ...(bones ? { strandSplitBones: bones } : {})
  });
}

// 某管某行的世界 x 列表（按列序），配合 row 0 的 x 序找两侧极值列。
function tubeRowXs(geometry, positions, tube, row) {
  const section = geometry.userData.splitSections[tube];
  return Array.from({ length: section.ringSize }, (_, column) => (
    positions[(section.base + row * section.ringSize + column) * 3]
  ));
}

test("0.2.128: a SYMMETRIC tip width edit displaces BOTH sides of an off-centre tube equally", () => {
  const authoredBones = blankTubeBones(3);
  // 对称编辑 = 只写 primary、asymmetric 关闭 ⇒ sampleAsymmetricTaperCurve 对**每个** signed
  // coordinate 都返回 primary（曲线面板显示的正是这条），两侧 multiplier 逐值相同。
  authoredBones[1].taperCurve = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  const base = tipWidthGeometryFor(offCentreTubeLock(blankTubeBones(3)));
  const authored = tipWidthGeometryFor(offCentreTubeLock(authoredBones));
  assert.ok(base && authored);
  const basePositions = positionsOf(base);
  const authoredPositions = positionsOf(authored);

  const tube = 1;
  const rows = authored.userData.actualLengthSegments + 1;
  const tipRow = rows - 1;
  // row 0 的世界 x 与 profile.x 成正比（t = 0 ⇒ opening = 0、宽度是同一个常量半径），
  // 所以 argmin / argmax 就是 band 的低侧 / 高侧列。
  const row0 = tubeRowXs(base, basePositions, tube, 0);
  const lowColumn = row0.indexOf(Math.min(...row0));
  const highColumn = row0.indexOf(Math.max(...row0));
  assert.notEqual(lowColumn, highColumn, "sanity: the tube spans a real x range");

  const displacementAt = (column) => (
    authoredPositions[(authored.userData.splitSections[tube].base + tipRow * authored.userData.splitSections[tube].ringSize + column) * 3]
      - basePositions[(base.userData.splitSections[tube].base + tipRow * base.userData.splitSections[tube].ringSize + column) * 3]
  );
  const lowDisplacement = displacementAt(lowColumn);
  const highDisplacement = displacementAt(highColumn);

  // 核心断言 ①：两侧都真的动了。老式下高侧 rawX = 0 ⇒ 位移恒为 0，这条直接红。
  assert.ok(Math.abs(lowDisplacement) > 1e-9, "the low side of the tube must move");
  assert.ok(
    Math.abs(highDisplacement) > 1e-9,
    "the high side must move too (scaling about x = 0 leaves the seam side at exactly 0)"
  );
  // 核心断言 ②：等值反号（缩放，不是平移）。老式比值 = lowX/highX = -0.6/0，这条也红。
  // 容差按 **float32** 定：position 属性是 Float32BufferAttribute，两个数各自舍入一次，
  // 相对误差可达 ~1.2e-7。用 1e-12 会变成对存储精度的断言而不是对公式的断言。
  const FLOAT32_RELATIVE = 1e-6;
  assert.ok(
    Math.abs(lowDisplacement + highDisplacement) <= FLOAT32_RELATIVE * Math.abs(lowDisplacement),
    `symmetric edit must give equal-and-opposite displacement, got ${lowDisplacement} / ${highDisplacement}`
  );
  // 缩放绝不掺平移：两侧中点（= 管中心）逐位不动。
  const lowCentre = (basePositions[(base.userData.splitSections[tube].base + tipRow * base.userData.splitSections[tube].ringSize + lowColumn) * 3]
    + basePositions[(base.userData.splitSections[tube].base + tipRow * base.userData.splitSections[tube].ringSize + highColumn) * 3]) * 0.5;
  const authoredCentre = (authoredPositions[(authored.userData.splitSections[tube].base + tipRow * authored.userData.splitSections[tube].ringSize + lowColumn) * 3]
    + authoredPositions[(authored.userData.splitSections[tube].base + tipRow * authored.userData.splitSections[tube].ringSize + highColumn) * 3]) * 0.5;
  assert.ok(
    Math.abs(authoredCentre - lowCentre) <= FLOAT32_RELATIVE * Math.abs(lowDisplacement),
    `the tube centre must not translate, moved by ${authoredCentre - lowCentre}`
  );
  // 收窄方向：m = 0.4 < 1 ⇒ 两侧都朝管中心收，低侧位移为正、高侧为负。
  assert.ok(lowDisplacement > 0 && highDisplacement < 0, "a narrowing curve pulls both sides inward");

  // 本修**只改分布、不改总量**：管在发尖行的总宽度仍恰好按 multiplier 缩放。
  // span 之比里 factors[row] 与 opening 都消掉（两者对同一行两列相同），所以这是一条
  // 无量纲、与 pivot 选择无关的断言 —— 老式公式同样满足它。它排除的是「为了对称把
  // 宽度改动量也一起改了」这种错误修法。
  const spanOf = (positions, geometry) => {
    const xs = tubeRowXs(geometry, positions, tube, tipRow);
    return Math.max(...xs) - Math.min(...xs);
  };
  const multiplierAtTip = TIP_BUMP_CURVE[1].value; // 0.4
  assert.ok(
    Math.abs(spanOf(authoredPositions, authored) / spanOf(basePositions, base) - multiplierAtTip) < 1e-6,
    `tip-row width must still scale by exactly the multiplier, got ${spanOf(authoredPositions, authored) / spanOf(basePositions, base)}`
  );
});

test("0.2.128: at N = 1 the seam-side vertex moves (raw-x scaling left it at EXACTLY zero)", () => {
  // N = 1 是默认拉链、也是真实工程的形态：管 0 的 band = [-1, 0]，缝侧顶点 rawX = 0。
  // 老式 `x · (m − 1)` 在那里恒为 0 —— 拖那个绿把手，网格一动不动。
  const n1Lock = (bones) => tipWidthLock({
    strandSplits: [{ position: 0, height: 0.4, order: 0 }],
    ...(bones ? { strandSplitBones: bones } : {})
  });
  // Tip Clump 置 0（0.2.132）：本测试的数值锚是「宽度 override 的位移 = (x − centreX)·(R − R0)」，
  // 而 Tip Clump 的收窄同样绕 centreX 缩放该管、会把锚从 0.06 缩成 0.06·(1 − 收窄比例)。
  // 两个效应叠在一起就分不清测的是哪一个，故此处显式关掉 Tip Clump 只测 override 本身。
  // 对称性/缝侧响应等结构性断言与 Tip Clump 取值无关（收窄对两侧同比例）。
  const clumpFree = (bones) => bones.map((bone) => ({ ...bone, tipClump: 0 }));
  const authoredBones = clumpFree(blankTubeBones(2));
  authoredBones[0].taperCurve = TIP_BUMP_CURVE.map((point) => ({ ...point }));
  const base = tipWidthGeometryFor(n1Lock(clumpFree(blankTubeBones(2))));
  const authored = tipWidthGeometryFor(n1Lock(authoredBones));
  assert.ok(base && authored);
  const basePositions = positionsOf(base);
  const authoredPositions = positionsOf(authored);

  const tube = 0;
  const section = authored.userData.splitSections[tube];
  const tipRow = authored.userData.actualLengthSegments;
  const row0 = tubeRowXs(base, basePositions, tube, 0);
  // 管 0 的 band 全在负半轴：最大 x 就是缝（rawX = 0），最小 x 是外缘（rawX = -1）。
  const seamColumn = row0.indexOf(Math.max(...row0));
  const outerColumn = row0.indexOf(Math.min(...row0));
  assert.ok(
    Math.abs(row0[seamColumn]) < Math.abs(row0[outerColumn]) * 1e-6,
    "sanity: the seam column really sits at raw x = 0 (that is why old code froze it)"
  );
  const displacementAt = (column) => (
    authoredPositions[(section.base + tipRow * section.ringSize + column) * 3]
      - basePositions[(section.base + tipRow * section.ringSize + column) * 3]
  );
  // 这一条就是用户报告的 bug：改动前**恒为 0**（rawX = 0 ⇒ x·(m−1) = 0）。
  assert.ok(
    Math.abs(displacementAt(seamColumn)) > 1e-9,
    `the seam-side vertex must respond to the tip width edit, got ${displacementAt(seamColumn)}`
  );
  // 管 0 的外缘侧没有拉链，但 tipWidthSideForkFromHeights 让无拉链的边界侧回退到**段**
  // fork（不是锁死 >= 1），所以 N = 1 时两侧都在暴露区内 ⇒ 必须等值反号。
  // 容差按 float32 定（position 是 Float32BufferAttribute，见上一条测试的说明）。
  assert.ok(
    Math.abs(displacementAt(seamColumn) + displacementAt(outerColumn))
      <= 1e-6 * Math.abs(displacementAt(outerColumn)),
    `N = 1 must be symmetric too, got seam ${displacementAt(seamColumn)} / outer ${displacementAt(outerColumn)}`
  );
  // 数值锚（baseWidth 0.2、m(t=1) = 0.4、band [-1, 0] ⇒ 半跨 0.5、factors = 1 于直发丝）：
  //   位移 = (x − centreX) · (R_override − R0) = (x + 0.5) · (0.08 − 0.2)
  // ⇒ 外缘 +0.06、缝 −0.06。改动前是 外缘 +0.12、缝 0.00（同样的总收窄量，但全压在一侧）。
  assert.ok(
    Math.abs(displacementAt(outerColumn) - 0.06) < 1e-6,
    `outer displacement should be +0.06, got ${displacementAt(outerColumn)}`
  );
  assert.ok(
    Math.abs(displacementAt(seamColumn) + 0.06) < 1e-6,
    `seam displacement should be -0.06, got ${displacementAt(seamColumn)}`
  );
});

test("0.2.128: a multiplier of exactly 1 stays BYTE-identical (the pivot term must vanish)", () => {
  // 恒等式守卫：override 已生效（taperCurve 有 2 点）但值恒为 1 ⇒ R_override === R0 ⇒
  // app.js 的 `pivotX * (R0 - R_override)` 项必须恰为 0。写成另一个代数等价式
  // （pivotX·R0 + (x − pivotX)·R_override）在浮点下只是近似相等，这条会红。
  const flatBones = blankTubeBones(3);
  flatBones[1].taperCurve = FLAT_CURVE.map((point) => ({ ...point }));
  const base = tipWidthGeometryFor(offCentreTubeLock(blankTubeBones(3)));
  const flat = tipWidthGeometryFor(offCentreTubeLock(flatBones));
  assert.deepEqual(
    positionsOf(flat),
    positionsOf(base),
    "an authored-but-unity curve must not move a single vertex by a single bit"
  );
});

test("per-tube tip WidthCurve: the tube-relative coordinate has a single definition point", () => {
  // standards「一条推导规则只准有一个定义点」：几何必须调用 strandTubeSignedCoordinate，
  // 不得内联 (x - centerX)/halfSpan —— 后续视口把手 placement 与拖拽读值会共用同一函数。
  const [geometrySource, tipWidthSource] = [strandGeometrySource, strandTipWidthSource];
  assert.match(
    tipWidthSource,
    /export function strandTubeSignedCoordinate\(x, centerX, halfSpan\)/,
    "the definition point lives in strand-tip-width.js"
  );
  assert.match(
    geometrySource,
    /strandTipWidthProfileOverride|strandTubeBandExtents/,
    "strand-geometry.js consumes the shared module rather than rolling its own"
  );
  assert.doesNotMatch(
    geometrySource,
    /halfSpan|centerX/,
    "strand-geometry.js must not inline the tube-relative arithmetic"
  );
  // 每侧 fork 也必须来自共享模块（tipWidthSideForkFromHeights），不得在发丝侧新写一条。
  assert.match(
    tipWidthSource,
    /import \{[\s\S]*tipWidthSideForkFromHeights[\s\S]*\} from "\.\/tip-width-curve\.js/,
    "per-side fork comes from the shared tip-width-curve module"
  );
  assert.doesNotMatch(
    tipWidthSource,
    /1 - Math\.max\(/,
    "no second fork formula: the shared tipWidthCommonForkFromHeights owns it"
  );
  // app.js 侧的两个可选参数契约（override 只作用于 x 轴、override 生效时不重新居中）：
  // 测试 harness 复刻了这两条，这里把它们钉在真实实现上，避免 harness 与 app.js 漂移。
  // x 轴走 warpedX（override 生效时绕管中心缩放），z 轴**始终**是老式绕 0 缩放且不接
  // override —— 「override 只作用于 x 轴」这条契约靠 z 行的形状来钉。
  assert.match(
    appSourceForTipWidth,
    /const radius = strandRadiusAt\(lock, t, "x", 1, profile\.x, override\);/,
    "app.js samples the x radius through the width override"
  );
  assert.match(
    appSourceForTipWidth,
    /z: profile\.z \* strandRadiusAt\(lock, t, "z", 1, profile\.z\) \* scaleZ/,
    "app.js applies the width override to the x axis only (z stays override-free)"
  );
  // 缩放中心必须是 override.centerX（管中心），不得回到绕全局 x = 0 缩放（0.2.128）。
  assert.match(
    appSourceForTipWidth,
    /const pivotX = Number\(override\?\.centerX\);[\s\S]*?\(profile\.x \* radius \+ pivotX \* \(pivotRadiusAt\(pivotX\) - radius\)\) \* scaleX/,
    "app.js scales the override path about the TUBE centre, not the global profile origin"
  );
  assert.match(
    appSourceForTipWidth,
    /if \(!lock\.centerAsymmetricProfile \|\| widthOverride\) return transformed;/,
    "app.js skips the re-centering branch whenever a width override is active"
  );
});

test("strandTipWidthMultiplierAt mirrors what the geometry samples", () => {
  const lock = tipWidthLock();
  const splits = lock.strandSplits;
  const bone = {
    taperCurve: TIP_BUMP_CURVE.map((point) => ({ ...point })),
    taperCurveSecondary: null,
    asymmetricWidthCurve: null
  };
  // fork 以下回退全局平直曲线（值 1）；fork 以上取 bone 曲线（t=1 → 0.4）。
  const fork = strandSplitForkTForSegment(lock, 1);
  assert.equal(strandTipWidthMultiplierAt(lock, fork, 0, bone, 1, splits), 1, "at the fork the global curve still applies");
  assert.equal(strandTipWidthMultiplierAt(lock, 1, 0, bone, 1, splits), 0.4, "above the fork the tube curve applies");
  // 无 bone / 未创作 → 全局曲线（1）。
  assert.equal(strandTipWidthMultiplierAt(lock, 1, 0, null, 1, splits), 1, "no bone -> global curve");
  assert.equal(
    strandTipWidthMultiplierAt(lock, 1, 0, { taperCurve: null }, 1, splits),
    1,
    "unauthored bone -> global curve"
  );
});

// ===== Phase D：视口把手 + 拖拽 + 浮动曲线编辑器 =====
// 放置函数是纯函数 + 注入的四项几何 dep，因此可以在 node 里直接跑（不需要 DOM/视口）。
// 这里的 geo 复刻的是 app.js 侧的真实实现语义：
//   strandGeometryCurve   → 主链 CatmullRom（与 createSplitStrandGeometry 用的同一条）
//   strandGeometryFrameAt → 固定正交 frame（与本文件其它 harness 一致；把手放置只需要
//                           frame.x/frame.z 的方向，弯曲发丝的 frame 差异不影响判据）
//   strandProfileTopologyAt → realisticStrandProfileTopologyAt（复刻 app.js 的 override 路径）
//   strandSplitProfileData  → 圆形 profile 的 65 点采样（与 app.js 同点数）
function tipWidthGeoDeps(lock) {
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  const samples = Array.from({ length: 65 }, (_, index) => {
    const angle = (index / 64) * Math.PI * 2;
    return { x: Math.cos(angle), z: Math.sin(angle) * 0.7 };
  });
  return {
    strandGeometryCurve: () => curve,
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    strandProfileTopologyAt: realisticStrandProfileTopologyAt,
    strandSplitProfileData: () => ({
      samples,
      minX: Math.min(...samples.map((point) => point.x)),
      maxX: Math.max(...samples.map((point) => point.x))
    })
  };
}

// 管 1 是内部管：左界拉链 height 0.4（fork 0.6）、右界 height 0.3（fork 0.7）。
// 左侧更深 ⇒ 左侧暴露更多。共享网格基于 max(0.4, 0.3) ⇒ common fork 0.6。
const TIP_WIDTH_ASYMMETRIC_TUBE = 1;

test("Phase D: asymmetric exposure — deeper side exposes MORE handles on ONE shared grid", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const tube = TIP_WIDTH_ASYMMETRIC_TUBE;
  const grid = strandTubeGridTs(splits, tube);
  assert.equal(grid.length, TIP_WIDTH_CONTROL_POINTS + 1, "the shared grid is 5 midpoints + the tip end");
  const left = strandTubeSideControlTs(splits, tube, -1);
  const right = strandTubeSideControlTs(splits, tube, 1);
  assert.ok(
    strandTubeSideForkT(splits, tube, -1) < strandTubeSideForkT(splits, tube, 1),
    "sanity: the left zipper of tube 1 is the deeper one"
  );
  assert.ok(left.length > right.length, "the deeper side must expose MORE control points");
  // 0.2.123 的不变式：两侧位置都是**同一个共享网格**的子集，因此间距逐值相等。
  // 0.2.118 曾让每侧各自等分自己的 span → 两侧数量恒等、间距不同。下面两条断言把那条
  // 回归钉死：① 子集关系；② 相邻间距在两侧完全相同。
  for (const side of [left, right]) {
    side.forEach((position) => {
      assert.ok(
        grid.some((candidate) => Math.abs(candidate - position) < 1e-12),
        `exposed position ${position} must come from the shared grid`
      );
    });
  }
  const spacing = (list) => list.slice(1).map((value, index) => value - list[index]);
  const gridSpacing = spacing(grid);
  const uniform = gridSpacing.slice(0, -1);
  uniform.forEach((step) => {
    assert.ok(Math.abs(step - uniform[0]) < 1e-12, "the shared grid's midpoints are evenly spaced");
  });
  spacing(left).forEach((step) => {
    assert.ok(
      gridSpacing.some((candidate) => Math.abs(candidate - step) < 1e-12),
      "left spacing values all come from the shared grid's spacing set"
    );
  });
  spacing(right).forEach((step) => {
    assert.ok(
      gridSpacing.some((candidate) => Math.abs(candidate - step) < 1e-12),
      "right spacing values all come from the shared grid's spacing set"
    );
  });
});

test("Phase D: bijection — non-null placement ⇔ tipWidthSideExposesTAt", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const geo = tipWidthGeoDeps(lock);
  const bones = blankTubeBones(splits.length + 1);
  for (let tube = 0; tube < splits.length + 1; tube += 1) {
    const grid = strandTubeGridTs(splits, tube);
    for (const side of [-1, 1]) {
      const sideForkT = strandTubeSideForkT(splits, tube, side);
      let placed = 0;
      grid.forEach((t, index) => {
        const placement = strandTipWidthControlPlacement(geo, lock, splits, tube, bones[tube], side, index);
        const exposed = tipWidthSideExposesTAt(sideForkT, t);
        assert.equal(
          Boolean(placement),
          exposed,
          `tube ${tube} side ${side} index ${index}: placement and exposure must agree`
        );
        if (placement) {
          placed += 1;
          assert.equal(placement.t, t, "placement reports the SHARED-grid parameter for its index");
        }
      });
      assert.equal(
        placed,
        strandTubeSideControlTs(splits, tube, side).length,
        `tube ${tube} side ${side}: grabbable count equals the exposed subset size`
      );
    }
  }
  // 越界索引一律 null（把手数组长度固定，网格可能更短的情况必须安全）。
  assert.equal(strandTipWidthControlPlacement(geo, lock, splits, 0, bones[0], 1, 99), null);
  assert.equal(strandTipWidthControlPlacement(geo, lock, splits, 0, bones[0], 1, -1), null);
});

test("Phase D: reset flatness — the whole exposed region is 1 on both sides", () => {
  // 两侧 zipper 高度差得很大（0.75 vs 0.05）：深侧暴露几乎整条链、浅侧只暴露发尖附近。
  const lock = tipWidthLock({
    strandSplits: [
      { position: -0.4, height: 0.75, order: 0 },
      { position: 0.4, height: 0.05, order: 1 }
    ]
  });
  const splits = strandSplitsFor(lock);
  const tube = TIP_WIDTH_ASYMMETRIC_TUBE;
  for (const side of [-1, 1]) {
    const curve = strandTipWidthResetCurve(splits, tube, side);
    curve.forEach((point) => {
      assert.equal(point.value, 1, `reset curve point at ${point.position} must be full width`);
    });
    // 采样也必须恒 1：只断言存点会漏掉「暴露区里有一段没有点、插值出非 1」的凹陷。
    const forkT = strandTubeSideForkT(splits, tube, side);
    for (let i = 0; i <= 32; i += 1) {
      const t = THREE.MathUtils.lerp(forkT, 1, i / 32);
      assert.equal(
        sampleAsymmetricTaperCurve(curve, null, false, side, t),
        1,
        `reset must be flat across the exposed region (side ${side}, t=${t})`
      );
    }
    // 每个暴露的网格位置都在曲线里（「曲线里有 ⇔ 有把手」的另一半）。
    strandTubeSideControlTs(splits, tube, side).forEach((position) => {
      assert.ok(
        curve.some((point) => Math.abs(point.position - position) < 1e-3),
        `reset curve carries a point at every grabbable position (${position})`
      );
    });
  }
});

test("Phase D: drag semantics — default writes BOTH sides, Ctrl only the dragged side", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const tube = TIP_WIDTH_ASYMMETRIC_TUBE;
  // 两侧都暴露的位置（发尖端 t=1）：对称写入才可能同时命中两侧。
  const t = 1;
  // ── 默认（无 Ctrl）：bone-interaction 会对 side 与 -side 各写一次同一个值 ──
  const symmetric = blankTubeBones(splits.length + 1)[tube];
  setStrandTipWidthCurveValue(lock, splits, tube, symmetric, 1, t, 0.5);
  setStrandTipWidthCurveValue(lock, splits, tube, symmetric, -1, t, 0.5);
  const valueAt = (curve, position) => curve.find((point) => Math.abs(point.position - position) < 1e-3)?.value;
  assert.equal(valueAt(symmetric.taperCurve, t), 0.5, "default drag writes the right side");
  assert.equal(valueAt(symmetric.taperCurveSecondary, t), 0.5, "default drag writes the left side too");

  // ── Ctrl：只写被拖的那一侧 ──
  const asymmetric = blankTubeBones(splits.length + 1)[tube];
  // 先把两侧曲线物化出来（setStrandTipWidthCurveValue 首次调用会 build 两侧），这样
  // 「未被拖的一侧逐字节不变」比较的是**创作后**的稳定状态，而不是 null → 数组的物化。
  setStrandTipWidthCurveValue(lock, splits, tube, asymmetric, 1, t, 1);
  setStrandTipWidthCurveValue(lock, splits, tube, asymmetric, -1, t, 1);
  const untouchedBefore = JSON.stringify(asymmetric.taperCurveSecondary);
  setStrandTipWidthCurveValue(lock, splits, tube, asymmetric, 1, t, 0.42);
  assert.equal(valueAt(asymmetric.taperCurve, t), 0.42, "Ctrl drag writes the dragged side");
  assert.equal(
    JSON.stringify(asymmetric.taperCurveSecondary),
    untouchedBefore,
    "Ctrl drag must leave the un-dragged side byte-unchanged"
  );
  // 写入必定打开 asymmetric 路由（几何才会分别采样两侧），与 panel 的
  // setTipWidthCurveValue 同语义。
  assert.equal(asymmetric.asymmetricWidthCurve, true);
  // 低于本侧 fork 的 t 无处可写 ⇒ 跳过（不吸附成一个可见编辑）。右侧 fork 是 0.7。
  const belowFork = JSON.stringify(asymmetric.taperCurve);
  setStrandTipWidthCurveValue(lock, splits, tube, asymmetric, 1, 0.1, 0.2);
  assert.equal(JSON.stringify(asymmetric.taperCurve), belowFork, "a t below this side's fork writes nothing");
});

test("Phase D: EDGE tube — the two sides' handles are genuinely distinct (raw profile.x would fail)", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const geo = tipWidthGeoDeps(lock);
  const bones = blankTubeBones(splits.length + 1);
  const tube = 0; // 边缘管：裁剪后的 band 整段落在负 x 上（raw x 单符号）。
  const band = strandTubeBandExtents(geo.strandSplitProfileData(lock).samples, splits, tube);
  assert.ok(band.highX < 0, "sanity: the edge tube's band is entirely on the negative side of x");
  // 若 placement 用 raw profile.x 的符号选边（左 = x<0 的极值、右 = x>0 的极值），这根管
  // **没有** x>0 的点：两侧只能落到同一个极值上（或右侧直接失败）。下面三条断言里
  // 「两点不同 + lateral 反向 + 各自朝外」在那种实现下必定有一条失败。
  const grid = strandTubeGridTs(splits, tube);
  const tipIndex = grid.length - 1;
  const leftPlacement = strandTipWidthControlPlacement(geo, lock, splits, tube, bones[tube], -1, tipIndex);
  const rightPlacement = strandTipWidthControlPlacement(geo, lock, splits, tube, bones[tube], 1, tipIndex);
  assert.ok(leftPlacement && rightPlacement, "both sides of an edge tube must be placeable");
  assert.ok(
    leftPlacement.point.distanceTo(rightPlacement.point) > 1e-6,
    "the two sides must land on DIFFERENT points (raw profile.x collapses them onto one extreme)"
  );
  assert.ok(
    leftPlacement.lateral.dot(rightPlacement.lateral) < 0,
    "the two drag axes must point in opposite directions"
  );
  // 每侧的把手都在自己那侧的外侧：沿本侧 lateral 的投影必须为正。
  [leftPlacement, rightPlacement].forEach((placement, index) => {
    const offset = placement.point.clone().sub(placement.center).dot(placement.lateral);
    assert.ok(offset > 0, `side ${index ? "right" : "left"} handle sits OUTWARD from the tube center`);
  });
  // 读值同理：被拖那侧的极值坐标恒为 ±1，所以两侧能读到不同的曲线。
  const asymmetricBone = {
    taperCurve: TIP_BUMP_CURVE.map((point) => ({ ...point })),
    taperCurveSecondary: FLAT_CURVE.map((point) => ({ ...point })),
    asymmetricWidthCurve: true
  };
  assert.notEqual(
    strandTipWidthMultiplierAt(lock, 1, 1, asymmetricBone, tube, splits),
    strandTipWidthMultiplierAt(lock, 1, -1, asymmetricBone, tube, splits),
    "an edge tube must read DIFFERENT widths on its two sides"
  );
});

test("Phase D: the handle sits ON the authored width (placement consumes the geometry's override)", () => {
  // 把手必须与几何看到的宽度同源：placement 走的是同一个 strandTipWidthProfileOverride +
  // 同一个 strandProfileTopologyAt。若 placement 忘了传 override（或传了不同的坐标/
  // blendZone），把手就会停在旧宽度上 —— 拖拽时手感是「曲线变了、把手不动」。
  // 断言横向偏移与创作倍率**成正比**（1.5× 曲线 → 1.5× 偏移），且三根管都成立
  // （含两根边缘管：raw-x 实现在那两根上会读到错的一侧）。
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const geo = tipWidthGeoDeps(lock);
  const tubeCount = splits.length + 1;
  for (let tube = 0; tube < tubeCount; tube += 1) {
    const bone = blankTubeBones(tubeCount)[tube];
    const grid = strandTubeGridTs(splits, tube);
    const tipIndex = grid.length - 1;
    const before = strandTipWidthControlPlacement(geo, lock, splits, tube, bone, 1, tipIndex);
    assert.ok(before, `tube ${tube} tip handle must be placeable`);
    const latBefore = before.point.clone().sub(before.center).dot(before.lateral);
    assert.ok(latBefore > 0, `tube ${tube}: the handle starts outward`);
    setStrandTipWidthCurveValue(lock, splits, tube, bone, 1, before.t, 1.5);
    setStrandTipWidthCurveValue(lock, splits, tube, bone, -1, before.t, 1.5);
    const after = strandTipWidthEdgePosition(geo, lock, splits, tube, bone, 1, before.t);
    const latAfter = after.point.clone().sub(after.center).dot(after.lateral);
    assert.ok(
      Math.abs(latAfter / latBefore - 1.5) < 1e-9,
      `tube ${tube}: the handle must follow the authored 1.5x width (got ${latAfter / latBefore})`
    );
  }
});

test("Phase D: floating editor's draggable set equals the non-null placement set", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const geo = tipWidthGeoDeps(lock);
  const bones = blankTubeBones(splits.length + 1);
  for (let tube = 0; tube < splits.length + 1; tube += 1) {
    const grid = strandTubeGridTs(splits, tube);
    for (const side of [-1, 1]) {
      // 编辑器侧（taper-editor.js tipDraggablePositions 的 strand 分支）用的就是这个函数。
      const editorDraggable = strandTubeSideControlTs(splits, tube, side);
      const viewportPlaceable = grid.filter((t, index) => (
        strandTipWidthControlPlacement(geo, lock, splits, tube, bones[tube], side, index) != null
      ));
      assert.deepEqual(
        editorDraggable,
        viewportPlaceable,
        `tube ${tube} side ${side}: editor draggable set must equal the viewport placeable set`
      );
    }
  }
});

// ── 0.2.127：绿色 WidthCurve 把手必须跟随被拖动的发尖子骨骼链 ──────────────────────────
// 用户报告：拖黄色发尖子骨骼把手时管的网格跟着动，绿色 WidthCurve 控制点原地不动
// （把手不再贴在它所控制的表面上）。根因是 strandTipWidthEdgePosition 只锚在**主脊柱**
// （curve.getPoint(t)）上，而几何在 createSplitStrandGeometry 的 Route 2 趟里已经按发尖链
// 把 fork 以上的顶点整体搬走了。下面五个测试把这条变换钉死。
//
// 这个 geo 组比 tipWidthGeoDeps 多第五项 strandSplitTipChains（= app.js 的
// currentStrandSplitTipChains）。chains 由调用方传入，所以同一个 lock 可以分别跑
// 「中性链」与「被拖动的链」两次。
function tipWidthGeoDepsWithChains(lock, chains) {
  return { ...tipWidthGeoDeps(lock), strandSplitTipChains: () => chains };
}

// 复刻 app.js currentStrandSplitTipChains 的 rest 推导（无 mesh.userData 时的回退分支）：
// 0.2.132 起该回退就是**主曲线点本身** —— 原先加的 frame.x · opening（smoothstep × spread ×
// direction）随「segment separate」语义一并删除。这些测试钉的是「把手跟随被拖动的发尖链」，
// 与 rest 基准取哪条线无关（displace 回调制造的 delta 才是被测量）。
function strandTubeRestChain(lock, splits, tubeIndex, count = 3) {
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  return Array.from({ length: count }, (_, i) => {
    const point = curve.getPoint(i / (count - 1));
    return { x: point.x, y: point.y, z: point.z };
  });
}

// 物化链（0.2.120 形状）：中性 = points 逐值等于 restPoints；displace 回调可搬任意点。
function strandTubeTipChain(lock, splits, tubeIndex, displace = null) {
  const restPoints = strandTubeRestChain(lock, splits, tubeIndex);
  const points = restPoints.map((rest, i) => (displace ? displace({ ...rest }, i) : { ...rest }));
  return { restPoints, points, twists: restPoints.map(() => 0), active: true };
}

// **几何自己的公式**（strand-geometry.js Route 2，L360-385 逐项对应），在测试里重跑一遍：
// 断言因此钉的是「把手与几何一致」，不是某个魔法数字。
// splitStart 刻意用**另一个定义点** strandSplitForkTForSegment 取全部管的 min（= 几何的
// `Math.min(...sections.map((s) => s.sectionSplitStart))`），而不是被测模块的
// strandTipBlendStartT —— 否则断言会与实现同源、失去判别力。
function geometryTipReanchor(lock, splits, chain, t, mainFrame, worldPoint) {
  const tubeCount = splits.length + 1;
  const splitStart = Math.min(
    ...Array.from({ length: tubeCount }, (_, tube) => strandSplitForkTForSegment(lock, tube))
  );
  const w = tipWeightAt(t, splitStart);
  if (w <= 0) return worldPoint.clone();
  const tipFrame = tipChainFrameAt(chain, chain, t, mainFrame.z.clone());
  const tipCenter = sampleTipPosition(chain, t);
  const restCenter = sampleTipPosition({ points: chain.restPoints }, t);
  const offset = worldPoint.clone().sub(new THREE.Vector3(restCenter.x, restCenter.y, restCenter.z));
  const target = new THREE.Vector3(tipCenter.x, tipCenter.y, tipCenter.z)
    .addScaledVector(tipFrame.x, offset.dot(mainFrame.x))
    .addScaledVector(tipFrame.z, offset.dot(mainFrame.z));
  return worldPoint.clone().lerp(target, w);
}

// 被拖动的发尖：末两点沿 +x 位移（与 supervisor 探针一致的 +0.30 / +0.60）。
const TIP_DRAG_DISPLACEMENT = [0, 0.3, 0.6];
// **刻意选管 2**（不是管 1）：tipWidthLock 的拉链高度是 [0.4, 0.3]，所以
//   管 0 fork = 1-0.4 = 0.6、管 1 fork = 1-max(0.4,0.3) = 0.6、管 2 fork = 1-0.3 = 0.7
//   几何的 splitStart = min(...) = 0.6
// 管 1 自己的 fork 恰好**等于**全局 splitStart，用它做主测试管的话「拿本管 fork 当
// splitStart」这个错误实现会一路绿灯（实测过：5/5 pass）。管 2 的 0.7 ≠ 0.6，权重因此
// 不同、位置不同，那条错误才会被抓住。
const TIP_REANCHOR_TUBE = 2;

test("0.2.127 regression: the tip WidthCurve handle FOLLOWS the dragged tip sub-bone", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const bones = blankTubeBones(splits.length + 1);
  const tube = TIP_REANCHOR_TUBE;
  // 几何只在 bone.tip 存在且 active 时才做再锚定 —— 把手的门控必须逐字相同。
  bones[tube].tip = { points: [], restPoints: [], twists: null, active: true };
  const neutralChain = strandTubeTipChain(lock, splits, tube);
  const draggedChain = strandTubeTipChain(lock, splits, tube, (point, i) => ({
    ...point,
    x: point.x + TIP_DRAG_DISPLACEMENT[i]
  }));
  const neutralGeo = tipWidthGeoDepsWithChains(lock, [neutralChain, neutralChain, neutralChain]);
  const draggedGeo = tipWidthGeoDepsWithChains(lock, [draggedChain, draggedChain, draggedChain]);
  const mainFrame = neutralGeo.strandGeometryFrameAt();
  const grid = strandTubeGridTs(splits, tube);
  const tipIndex = grid.length - 1;
  const neutral = strandTipWidthControlPlacement(neutralGeo, lock, splits, tube, bones[tube], 1, tipIndex);
  const dragged = strandTipWidthControlPlacement(draggedGeo, lock, splits, tube, bones[tube], 1, tipIndex);
  assert.ok(neutral && dragged, "the tip handle must be placeable in both states");
  // ① 把手真的动了，而且量级不是数值噪声（拖了 0.6，把手至少要跟上 0.3）。
  const moved = dragged.point.distanceTo(neutral.point);
  assert.ok(moved > 0.3, `the handle must follow the dragged tip (moved only ${moved})`);
  // ② 而且落在**几何自己算出的**那个点上（decompose → re-anchor → lerp）。
  // 变换的输入（几何术语里的 original 顶点）是**改动前的主帧世界点**，用不注入第五项 dep
  // 的 geo 组取得 —— 刻意不用 neutral.point：中性链的变换**不是**恒等（tipFrame.y 是该管
  // rest 链的切线，管 2 有 opening 平移 ⇒ 链被斜过去、与主帧差一个旋转）。几何对
  // 「bone.tip 存在」的每一管都做同一条变换，所以这不是 bug；但拿 neutral.point 当
  // original 会把那个旋转算两遍（实测偏 2.3e-4）。
  // 逐个网格点都比（不只发尖端 t=1）：t=1 处两种 splitStart 的权重都饱和到 1，只测发尖端
  // 会漏掉「用本管 fork 当 splitStart」那条错误实现（实测它在 t=1 与正确实现同值）。
  const plainGeo = tipWidthGeoDeps(lock);
  grid.forEach((t, index) => {
    const placement = strandTipWidthControlPlacement(draggedGeo, lock, splits, tube, bones[tube], 1, index);
    if (!placement) return;
    const original = strandTipWidthEdgePosition(plainGeo, lock, splits, tube, bones[tube], 1, t);
    const expected = geometryTipReanchor(lock, splits, draggedChain, t, mainFrame, original.point);
    assert.ok(
      placement.point.distanceTo(expected) < 1e-9,
      `index ${index} (t=${t}): the handle must land on the geometry's own transform (off by ${placement.point.distanceTo(expected)})`
    );
    // ③ center 也走同一条变换（下面还有一条独立的平行性断言）。
    const expectedCenter = geometryTipReanchor(lock, splits, draggedChain, t, mainFrame, original.center);
    assert.ok(
      placement.center.distanceTo(expectedCenter) < 1e-9,
      `index ${index} (t=${t}): center goes through the SAME transform as point`
    );
  });
  // ④ 引导线同样跟随（否则绿线会留在旧表面上）。
  const neutralLine = strandTipWidthEdgePoints(neutralGeo, lock, splits, tube, bones[tube], 1);
  const draggedLine = strandTipWidthEdgePoints(draggedGeo, lock, splits, tube, bones[tube], 1);
  assert.equal(neutralLine.length, draggedLine.length, "the guide line keeps its sample count");
  assert.ok(
    draggedLine[draggedLine.length - 1].distanceTo(neutralLine[neutralLine.length - 1]) > 0.3,
    "the guide line's tip end follows the dragged tip too"
  );
});

test("0.2.127 negative control: the OLD spine-anchored formula does NOT move", () => {
  // 这条是「改回去就会红」的对照：老公式 point = spine + frame.x·(warped.x + opening)
  // + frame.z·warped.z 完全不含发尖链，因此中性链与被拖链下逐位相同。
  // 断言方式：**先**用 tipChain 门控关掉的 geo 拿到老公式的值（bone.tip == null ⇒ 实现
  // 保证逐字节等于改动前），**再**要求被拖状态与它明显不同。若把再锚定删掉，dragged
  // 会退回老值 → 第二条断言失败。
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const tube = TIP_REANCHOR_TUBE;
  const grid = strandTubeGridTs(splits, tube);
  const tipIndex = grid.length - 1;
  const draggedChain = strandTubeTipChain(lock, splits, tube, (point, i) => ({
    ...point,
    x: point.x + TIP_DRAG_DISPLACEMENT[i]
  }));
  const chains = [draggedChain, draggedChain, draggedChain];
  const geo = tipWidthGeoDepsWithChains(lock, chains);
  // 老公式的值（bone.tip 缺失 ⇒ 无再锚定），链**已被拖动**却完全不影响它。
  const boneWithoutTip = blankTubeBones(splits.length + 1)[tube];
  const legacy = strandTipWidthControlPlacement(geo, lock, splits, tube, boneWithoutTip, 1, tipIndex);
  // 同一个 bone 换一条中性链：老公式的值一模一样（证明它与链无关 = 就是 bug 的形状）。
  const neutralChain = strandTubeTipChain(lock, splits, tube);
  const legacyNeutral = strandTipWidthControlPlacement(
    tipWidthGeoDepsWithChains(lock, [neutralChain, neutralChain, neutralChain]),
    lock,
    splits,
    tube,
    boneWithoutTip,
    1,
    tipIndex
  );
  assert.ok(
    legacy.point.distanceTo(legacyNeutral.point) < 1e-12,
    "sanity: the spine-anchored formula is chain-independent (that IS the reported bug)"
  );
  // 打开门控（bone.tip 存在且 active）后必须离开老位置。
  const boneWithTip = blankTubeBones(splits.length + 1)[tube];
  boneWithTip.tip = { points: [], restPoints: [], twists: null, active: true };
  const fixed = strandTipWidthControlPlacement(geo, lock, splits, tube, boneWithTip, 1, tipIndex);
  assert.ok(
    fixed.point.distanceTo(legacy.point) > 0.3,
    `reverting the fix would put the handle back at the spine-anchored point (delta ${fixed.point.distanceTo(legacy.point)})`
  );
});

test("0.2.127 inert: no tip chain / inactive chain ⇒ byte-identical to the pre-fix formula", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const tube = TIP_REANCHOR_TUBE;
  const grid = strandTubeGridTs(splits, tube);
  const tipIndex = grid.length - 1;
  const draggedChain = strandTubeTipChain(lock, splits, tube, (point, i) => ({
    ...point,
    x: point.x + TIP_DRAG_DISPLACEMENT[i]
  }));
  const geo = tipWidthGeoDepsWithChains(lock, [draggedChain, draggedChain, draggedChain]);
  // 基准 = 完全不注入第五项 dep（= 改动前的 geo 组，四项）。真实工程今天的常见状态。
  const baseline = strandTipWidthControlPlacement(
    tipWidthGeoDeps(lock),
    lock,
    splits,
    tube,
    blankTubeBones(splits.length + 1)[tube],
    1,
    tipIndex
  );
  const cases = [
    ["bone.tip == null", null],
    ["tip.active === false", { points: [], restPoints: [], twists: null, active: false }]
  ];
  for (const [label, tip] of cases) {
    const bone = blankTubeBones(splits.length + 1)[tube];
    bone.tip = tip;
    const placement = strandTipWidthControlPlacement(geo, lock, splits, tube, bone, 1, tipIndex);
    assert.deepEqual(
      [placement.point.toArray(), placement.center.toArray(), placement.lateral.toArray(), placement.t],
      [baseline.point.toArray(), baseline.center.toArray(), baseline.lateral.toArray(), baseline.t],
      `${label}: must be byte-identical to the pre-fix result`
    );
  }
  // 链自身 active === false（app.js 物化链会保留 authored 的 active）同样必须惰性。
  const inactiveChain = { ...draggedChain, active: false };
  const boneActive = blankTubeBones(splits.length + 1)[tube];
  boneActive.tip = { points: [], restPoints: [], twists: null, active: true };
  const inactivePlacement = strandTipWidthControlPlacement(
    tipWidthGeoDepsWithChains(lock, [inactiveChain, inactiveChain, inactiveChain]),
    lock,
    splits,
    tube,
    boneActive,
    1,
    tipIndex
  );
  assert.deepEqual(
    inactivePlacement.point.toArray(),
    baseline.point.toArray(),
    "an inactive materialized chain must not move the handle either"
  );
});

test("0.2.127: point/center/lateral share ONE transform (drag basis stays pure lateral)", () => {
  // bone-interaction 用 (point − center)·lateral 当拖拽基准。只搬 point 不搬 center，或
  // 忘了把 lateral 旋进发尖帧，都会让这个基准掺进非横向分量 → 拖拽灵敏度错。
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const tube = TIP_REANCHOR_TUBE;
  const bones = blankTubeBones(splits.length + 1);
  bones[tube].tip = { points: [], restPoints: [], twists: null, active: true };
  const draggedChain = strandTubeTipChain(lock, splits, tube, (point, i) => ({
    ...point,
    x: point.x + TIP_DRAG_DISPLACEMENT[i]
  }));
  const geo = tipWidthGeoDepsWithChains(lock, [draggedChain, draggedChain, draggedChain]);
  const grid = strandTubeGridTs(splits, tube);
  for (const side of [-1, 1]) {
    grid.forEach((t, index) => {
      const placement = strandTipWidthControlPlacement(geo, lock, splits, tube, bones[tube], side, index);
      if (!placement) return;
      const offset = placement.point.clone().sub(placement.center);
      assert.ok(
        Math.abs(placement.lateral.length() - 1) < 1e-12,
        `side ${side} index ${index}: lateral stays a unit vector`
      );
      // 平行性：dot 等于全长、cross 约 0。
      assert.ok(
        Math.abs(offset.dot(placement.lateral) - offset.length()) < 1e-9,
        `side ${side} index ${index}: (point − center)·lateral must equal the full length`
      );
      assert.ok(
        offset.clone().cross(placement.lateral).length() < 1e-9,
        `side ${side} index ${index}: (point − center) × lateral must vanish`
      );
      assert.ok(offset.dot(placement.lateral) > 0, `side ${side} index ${index}: handle sits outward`);
    });
  }
});

test("0.2.127: splitStart is the SHALLOWEST fork across ALL tubes, and t <= it contributes nothing", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const tubeCount = splits.length + 1;
  // ① 与几何的 `Math.min(...sections.map((s) => s.sectionSplitStart))` 同值 —— 断言用的是
  // 另一个定义点（bone-model 的 strandSplitForkTForSegment），所以这条真的在比两条推导。
  const geometrySplitStart = Math.min(
    ...Array.from({ length: tubeCount }, (_, tube) => strandSplitForkTForSegment(lock, tube))
  );
  assert.equal(strandTipBlendStartT(splits), geometrySplitStart, "splitStart matches the geometry's min");
  // ② 而且它确实比某一管自己的 fork 更浅（否则「用本管 fork」的错误实现也会通过）。
  assert.ok(
    Array.from({ length: tubeCount }, (_, tube) => strandTubeForkT(splits, tube))
      .some((forkT) => forkT > geometrySplitStart + 1e-9),
    "at least one tube's own fork is DEEPER than the shared splitStart (per-tube would misweight)"
  );
  // ③ 混合边界：t <= splitStart 时权重为 0 ⇒ 结果逐位等于改动前（无再锚定）。
  const tube = TIP_REANCHOR_TUBE;
  const bones = blankTubeBones(tubeCount);
  bones[tube].tip = { points: [], restPoints: [], twists: null, active: true };
  const draggedChain = strandTubeTipChain(lock, splits, tube, (point, i) => ({
    ...point,
    x: point.x + TIP_DRAG_DISPLACEMENT[i]
  }));
  const geo = tipWidthGeoDepsWithChains(lock, [draggedChain, draggedChain, draggedChain]);
  const plainGeo = tipWidthGeoDeps(lock);
  for (const t of [0, 0.3, geometrySplitStart]) {
    const withChain = strandTipWidthEdgePosition(geo, lock, splits, tube, bones[tube], 1, t);
    const preFix = strandTipWidthEdgePosition(plainGeo, lock, splits, tube, bones[tube], 1, t);
    assert.deepEqual(
      [withChain.point.toArray(), withChain.center.toArray(), withChain.lateral.toArray()],
      [preFix.point.toArray(), preFix.center.toArray(), preFix.lateral.toArray()],
      `t=${t} is at/below splitStart: the tip transform must contribute nothing`
    );
  }
  // ④ 反面：splitStart 之上必须有位移（否则上面三条会因为「永远不动」而空转）。
  const above = (geometrySplitStart + 1) / 2;
  assert.ok(
    strandTipWidthEdgePosition(geo, lock, splits, tube, bones[tube], 1, above).point
      .distanceTo(strandTipWidthEdgePosition(plainGeo, lock, splits, tube, bones[tube], 1, above).point) > 1e-6,
    "above splitStart the transform DOES move the handle"
  );
  // ⑤ 「用本管自己的 fork 当 splitStart」的错误实现专用对照：取 t 严格落在
  // (全局 splitStart, 本管 fork) 之间。正确实现在这里权重 > 0（必须动），错误实现权重
  // 恰为 0（不动）。管 2 的 fork 0.7 > 全局 0.6，所以这个区间非空。
  const ownForkT = strandTubeForkT(splits, tube);
  assert.ok(ownForkT > geometrySplitStart + 1e-9, "sanity: this tube's own fork is deeper than splitStart");
  const between = (geometrySplitStart + ownForkT) / 2;
  assert.ok(
    strandTipWidthEdgePosition(geo, lock, splits, tube, bones[tube], 1, between).point
      .distanceTo(strandTipWidthEdgePosition(plainGeo, lock, splits, tube, bones[tube], 1, between).point) > 1e-6,
    "between splitStart and this tube's own fork the handle STILL moves (per-tube fork would freeze it)"
  );
});

test("Phase D: dispatch has no second grid/exposure/fork rule (source contract)", async () => {
  // 视口/DOM 耦合的分派只能靠 source-text 守（同 L182/L196 的既有模式）。
  const [handleSource, interactionSource, editorSource, tipWidthSource] = await Promise.all([
    readFile(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/taper-editor.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/strand-tip-width.js", import.meta.url), "utf8")
  ]);
  // ① 把手分配是**一份**代码，panel 与 strand 共用（userData 键因此不可能漂移）。
  assert.match(
    handleSource,
    /function allocateTipWidthHandles\(lock, group, segmentCount, tipWidthHandles, tipWidthLines\)/,
    "one allocation helper for both geometries"
  );
  // 0.2.126：段数改从 PANEL_SEGMENT_HOST.segmentCount 取（bone-model 的唯一定义点），
  // 不再就地写 `lock.panelSplits.length + 1`。断言意图不变：panel 按 panel 段数分配。
  assert.match(
    handleSource,
    /allocateTipWidthHandles\(lock, group, PANEL_SEGMENT_HOST\.segmentCount\(lock\)/,
    "panel allocates per panel segment, from the host descriptor"
  );
  assert.equal(
    PANEL_SEGMENT_HOST.segmentCount({ panelSplits: [{}, {}] }),
    3,
    "the host descriptor's panel segment count is still zippers + 1"
  );
  assert.match(
    handleSource,
    /allocateTipWidthHandles\(lock, group, strandSplitTipTubeCount/,
    "strand allocates per tube, from the SAME tube count as the per-tube tip handles"
  );
  // ② 发丝可见性额外要求 strandSplitEnabled 且跳过 hairCard（与发尖把手块同规则）。
  assert.match(
    handleSource,
    /!lock\.hairCard[\s\S]{0,120}Boolean\(lock\.strandSplitEnabled\)/,
    "strand tip-width visibility requires strandSplitEnabled and skips hair cards"
  );
  // ③ 拖拽命中列表把发丝并进同一条门控（不是平行分支）。
  // 0.2.126：命中门控改用 segmentBoneHost（bone-model 的单一几何分派），语义等价于
  // 「panel/surface 或 strand+strandSplitEnabled」，且发尖链把手与宽度把手共用同一道门。
  assert.match(
    interactionSource,
    /const tipHostGate = Boolean\(segmentBoneHost\(lock\)\)[\s\S]{0,200}?const tipWidthHandles = tipHostGate/,
    "the hit-test list is widened via the single segmentBoneHost dispatch, shared with the tip-chain handles"
  );
  assert.match(
    interactionSource,
    /const tipHandles = tipHostGate \? lock\.curveObjects\.tipChainHandles \|\| \[\] : \[\]/,
    "tip-chain handles use the SAME gate (no parallel geometry condition)"
  );
  // ③b 起始状态与拖拽写入必须用**同一条**分派（segmentBoneHost）：两处不同会让发丝拿
  // panel 的起始倍率。把手放置侧（bone-view-handles）也走同一条。
  for (const [name, source] of [["bone-interaction", interactionSource], ["bone-view-handles", handleSource]]) {
    assert.ok(
      (source.match(/segmentBoneHost\(lock\) (?:!==|===) STRAND_SEGMENT_HOST/g) || []).length >= 1,
      `${name} dispatches tip-width geometry via segmentBoneHost`
    );
  }
  // 0.2.130：本断言原是「全文件恰好 2 处 segmentBoneHost 分派」，用总数来守「tipWidth 没有
  // 第三条规则」。绿色 Tip Clump 手柄移植到发丝后，拖拽分支多了一处**属于另一个子系统**的
  // 分派（strandClump），总数变 3。因此改为**按子系统**计数，守卫的牙齿不变：tipWidth 仍只
  // 准有「起始 + 移动」两处，Tip Clump 只准有一处，任何第四处分派都会让本断言失败。
  const allDispatches = interactionSource.match(/(?:const \w+ = )?segmentBoneHost\(lock\) (?:!==|===) STRAND_SEGMENT_HOST/g) || [];
  assert.equal(allDispatches.length, 3, "no fourth segmentBoneHost dispatch appears in the drag paths");
  assert.equal(
    allDispatches.filter((line) => /strandClump/.test(line)).length,
    1,
    "the Tip Clump drag dispatches exactly once (its own subsystem, not a third tipWidth rule)"
  );
  assert.equal(
    allDispatches.filter((line) => !/strandClump/.test(line)).length,
    2,
    "tipWidth drag start and drag move each dispatch once, with no third rule"
  );
  // ④ 发丝写入走共享核心的适配器，不是第二套曲线数学。
  assert.match(
    interactionSource,
    /setStrandTipWidthCurveValue\(lock, splitsForWidth, segment, bone, writeSide, t, newWidthMult\)/,
    "strand writes dispatch to the shared-core adapter"
  );
  assert.match(
    tipWidthSource,
    /import \{[\s\S]*buildTipWidthCurveFrom[\s\S]*setTipWidthCurveValueFrom[\s\S]*tipWidthGridFromHeights[\s\S]*tipWidthSideControlTsFrom[\s\S]*tipWidthSideExposesTAt[\s\S]*\} from "\.\/tip-width-curve\.js/,
    "grid / exposure / build / write all come from the shared module"
  );
  // 发丝侧不得出现第二条网格或暴露判据（那两条表达式只准在 tip-width-curve.js 里）。
  assert.doesNotMatch(
    tipWidthSource,
    /\(i \+ 0\.5\) \/ TIP_WIDTH_CONTROL_POINTS/,
    "no second control-grid formula on the strand side"
  );
  assert.doesNotMatch(
    tipWidthSource,
    /t >= sideForkT - 1e-4/,
    "no second exposure predicate on the strand side"
  );
  // ⑤ 编辑器按几何取 splits：发丝走 strandSplitsFor，**绝不**对发丝用 clonePanelSplits。
  assert.match(
    editorSource,
    /strandSegment\s*\?\s*strandSplitsFor\(segmentLock\)[\s\S]{0,200}deps\.clonePanelSplits\(segmentLock\.panelSplits/,
    "the editor dispatches splits per geometry (strand first, panel fallback)"
  );
  assert.match(
    editorSource,
    /if \(strandSegment\) \{\s*return strandTubeSideControlTs\(/,
    "the editor's draggable set uses the strand exposure adapter"
  );
  // ⑥ app.js 的段宽度 Reset 也按几何分派（否则发丝 Reset 会按假 panelSplits 写点）。
  assert.match(
    appSourceForTipWidth,
    /segmentBoneHost\(editedLock\) === STRAND_SEGMENT_HOST\s*\?\s*strandTipWidthResetCurve\(/,
    "Reset dispatches to the strand reset curve for split strands"
  );
  // ⑦ 两个 deps 批都必须转发 placement 需要的同一条变换链。缺一项不是「功能缺失」而是
  // 运行时 throw（strandProfileTopologyAt is not a function），且只在拖发丝宽度把手时才
  // 暴露 —— node 测试无法执行视口代码，所以这里用 source-text 钉住转发本身。
  const handlesBatch = appSourceForTipWidth.match(/Object\.assign\(boneViewHandlesDeps, \{[\s\S]*?\n\}\);/)?.[0] ?? "";
  const interactionBatch = appSourceForTipWidth.match(/Object\.assign\(boneInteractionDeps, \{[\s\S]*?\n\}\);/)?.[0] ?? "";
  for (const [name, batch] of [["boneViewHandlesDeps", handlesBatch], ["boneInteractionDeps", interactionBatch]]) {
    assert.ok(batch, `${name} batch must be found`);
    // currentStrandSplitTipChains 是第五项（0.2.127）：把手/拖拽基准要跟随被拖动的发尖链。
    for (const dep of [
      "strandGeometryCurve",
      "strandGeometryFrameAt",
      "strandProfileTopologyAt",
      "strandSplitProfileData",
      "currentStrandSplitTipChains"
    ]) {
      // `,|\n` 结尾：批次的最后一项没有尾逗号（currentStrandSplitTipChains 就是其中一批的
      // 末项），只认逗号会把「转发了但排在最后」误判成缺失。
      assert.match(batch, new RegExp(`\\n\\s*${dep}(,|\\r?\\n)`), `${name} forwards ${dep} for strand tip-width placement`);
    }
  }
  assert.match(
    interactionBatch,
    /syncStrandSegmentControls: segmentApi\.syncStrandSegmentControls/,
    "the drag path can sync the strand segment controls (Phase C's UI block)"
  );
  // 两处转发的 geo dep 组必须逐字相同（把手位置与拖拽基准同源，否则一按下就跳）。
  const geoDepsBlocks = [handleSource, interactionSource].map((source) => (
    source.match(/function strandTipWidthGeoDeps\(\) \{[\s\S]*?\n\}/)?.[0]
  ));
  assert.ok(geoDepsBlocks[0] && geoDepsBlocks[1], "both modules forward a geo dep group");
  assert.equal(geoDepsBlocks[0], geoDepsBlocks[1], "the two geo dep groups must be identical");
  // 0.2.127：第五项必须在两处都出现，而且必须取 currentStrandSplitTipChains（0.2.120 物化
  // 空间真源）。等值断言只保证「两处一样」，不保证「两处都有」——这条补上后者。
  assert.match(
    geoDepsBlocks[0],
    /strandSplitTipChains: \(lock\) => deps\.currentStrandSplitTipChains\(lock\)/,
    "the geo dep group forwards the materialized tip chains (handles follow the dragged tip)"
  );
  // 负向对照：strand-tip-width.js 不得自己物化发尖链（会用近似 rest ⇒ 一按下就跳）。
  // 只钉**调用**与 import，不钉注释 —— 模块注释里刻意写着这条禁令本身。
  assert.doesNotMatch(
    tipWidthSource.replace(/^\s*\/\/.*$/gm, ""),
    /materializeTipChain/,
    "strand-tip-width.js must consume the materialized chain, never materialize its own"
  );
});

// ── 0.2.126：发尖子骨骼链把手（每段/每管 × 每链点）与暴露判据 ────────────────────────
test("exposed tip-chain index is one definition point: floor, fork row included, root never editable", () => {
  // 该函数替代了此前散在四处的同一条 floor 表达式（把手 / 引导线 / gizmo translate / 笔刷）。
  // floor 而非 round：0.2.119 结论 —— fork 行本身属于暴露链，round 在 frac>0.5 时会让骨骼根
  // 落到自己第一个暴露子节点之上。
  assert.equal(firstExposedTipChainIndex(0.5, 11), 5, "floor(0.5 * 10) = 5");
  assert.equal(firstExposedTipChainIndex(0.58, 11), 5, "frac 0.8 still floors down (round would give 6)");
  assert.notEqual(firstExposedTipChainIndex(0.58, 11), Math.round(0.58 * 10), "round would differ here — that is the point");
  // 下限 1：index 0 是链根、钉在主链上，任何 fork 都不能让它变成可编辑点。
  assert.equal(firstExposedTipChainIndex(0, 11), 1, "fork at the root still keeps index 0 pinned");
  assert.equal(firstExposedTipChainIndex(-5, 11), 1, "garbage fork clamps to the lower bound");
  // 上限 count-1：本侧完全锁死（fork >= 1）时暴露区只剩末点，不得越界。
  assert.equal(firstExposedTipChainIndex(1, 11), 10);
  assert.equal(firstExposedTipChainIndex(3, 11), 10, "fork beyond 1 clamps to the last index");
  // 深/浅 zipper 的非对称：fork 越浅（值越大）暴露越少 —— 与 WidthCurve 测试同款判据。
  const deep = firstExposedTipChainIndex(1 - 0.5, 11); // 深 zipper（高 0.5）→ fork 0.5
  const shallow = firstExposedTipChainIndex(1 - 0.2, 11); // 浅 zipper（高 0.2）→ fork 0.8
  assert.ok(deep < shallow, "the deeper zipper exposes more chain points than the shallower one");
  assert.equal(11 - deep, 6, "deep side exposes 6 points");
  assert.equal(11 - shallow, 3, "shallow side exposes 3 points");
});

test("per-chain-point tip handles: count and exposure derive from the host, for BOTH geometries", async () => {
  const handleSource = await readFile(
    new URL("../modules/bones/bone-view-handles.js", import.meta.url),
    "utf8"
  );
  // ① 一份分配代码服务两种几何（userData 键因此不可能漂移）。
  assert.match(
    handleSource,
    /function allocateTipChainHandles\(lock, group, segmentCount, pointCount, tipChainHandles, tipChainLines, tipNormalArrows\)/,
    "one tip-chain allocation helper for both geometries"
  );
  // ② 每链点一个把手 + 一个法线箭头（panel 早有，发丝 0.2.126 才有）。
  assert.match(
    handleSource,
    /for \(let point = 0; point < pointCount; point \+= 1\)[\s\S]{0,900}?tipNormalArrows\.push\(tipNormalArrow\)/,
    "every chain point gets a handle AND a normal arrow"
  );
  // ③ 两种几何都从描述子取链长，不再就地写 lock.points.length / Math.max(2, ...)。
  assert.match(handleSource, /PANEL_SEGMENT_HOST\.tipChainPointCount\(lock\)/, "panel chain length from the host");
  assert.match(handleSource, /STRAND_SEGMENT_HOST\.tipChainPointCount\(lock\)/, "strand chain length from the host");
  // 负向对照：分配调用里不得再出现就地链长表达式。
  assert.doesNotMatch(
    handleSource,
    /allocateTipChainHandles\([\s\S]{0,120}?Array\.isArray\(lock\.points\)/,
    "chain length must not be re-derived inline at the allocation site"
  );
  // ④ 暴露判据（把手可见性）与引导线切片必须调用**同一个**函数。
  assert.equal(
    (handleSource.match(/firstExposedTipChainIndex\(forkT, tip\.points\.length\)/g) || []).length,
    2,
    "handle visibility and the guide line slice both call the single exposure function"
  );
  // 负向对照：文件里不得再残留内联的 floor 暴露表达式。
  assert.doesNotMatch(
    handleSource,
    /Math\.max\(1, Math\.floor\(forkT \*/,
    "no inline copy of the exposure rule may remain"
  );

  // 行为侧：两种几何的链长与段数三方一致（把手数 = 段数 × 链长）。
  const panelLock = {
    geometryType: "panel",
    panelSplits: [{ position: -0.3 }, { position: 0.3 }],
    points: Array.from({ length: 7 }, () => ({ x: 0, y: 0, z: 0 }))
  };
  assert.equal(PANEL_SEGMENT_HOST.segmentCount(panelLock), 3);
  assert.equal(PANEL_SEGMENT_HOST.tipChainPointCount(panelLock), 7);
  const strandLock = {
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [
      { position: -0.3, height: 0.5, order: 0 },
      { position: 0.3, height: 0.2, order: 1 }
    ],
    points: Array.from({ length: 7 }, () => ({ x: 0, y: 0, z: 0 }))
  };
  assert.equal(STRAND_SEGMENT_HOST.segmentCount(strandLock), 3, "2 zippers -> 3 tubes");
  assert.equal(STRAND_SEGMENT_HOST.tipChainPointCount(strandLock), 7, "the tube chain mirrors the main chain length");
  // 发丝侧下限 2（materializeTipChain 内部恒 Math.max(2, count)）：传 0 会造出与视口不一致的链。
  assert.equal(STRAND_SEGMENT_HOST.tipChainPointCount({ points: [] }), 2);
  assert.equal(PANEL_SEGMENT_HOST.tipChainPointCount({ points: [] }), 0, "panel deliberately allows 0 (no editable tip at all)");

  // 每管的 fork 各自不同 → 暴露数按管非对称（本仓库 fork 真源 strandSplitForkTForSegment）。
  const forks = [0, 1, 2].map((tube) => strandSplitForkTForSegment(strandLock, tube));
  assert.deepEqual(forks.map((f) => Number(f.toFixed(4))), [0.5, 0.5, 0.8], "tube fork = 1 - max(adjacent zipper heights)");
  const exposedCounts = forks.map((forkT) => 7 - firstExposedTipChainIndex(forkT, 7));
  assert.deepEqual(exposedCounts, [4, 4, 3], "the tube next to the shallow zipper exposes fewer chain points");
  assert.ok(
    exposedCounts[0] > exposedCounts[2],
    "deep/shallow asymmetry: the deep-zipper tube exposes strictly more than the shallow-zipper tube"
  );
});

test("tip sub-bone brush edits ONLY the selected segment's chain, on both geometries", async () => {
  const interactionSource = await readFile(
    new URL("../modules/bones/bone-interaction.js", import.meta.url),
    "utf8"
  );
  // ① 门控走 resolveTipHost（segmentBoneHost），不再是 panel 专属。
  assert.match(
    interactionSource,
    /const host = lock \? resolveTipHost\(lock, \{ materialize: true \}\) : null;\s*\n\s*if \(!host\) return false;/,
    "the brush gate dispatches through the tip host, so split strands are included"
  );
  // ② 只碰选中那一段的骨骼与链（单一下标，无循环）。
  assert.match(
    interactionSource,
    /const bone = host\.bones\[segmentIndex\];[\s\S]{0,200}?const tip = host\.tipChainFor\(segmentIndex\);/,
    "the brush resolves exactly one segment's bone and chain"
  );
  // ③ **负向对照（本轮明令禁止的陷阱）**：笔刷路径绝不能对发丝调 clonePanelSplits ——
  // 它会凭空造出与真实 zipper 无关的假 panelSplits，段数/fork 全错。
  // 注意行尾（本轮实测踩过）：仓库 core.autocrlf=true ⇒ 工作树是 CRLF。前导 `\n\}` 是安全的
  // （`\r` 被 `[\s\S]*?` 吃掉），但**结尾**再跟一个 `\n` 就必须写 `\r?\n` —— 否则 `\r\n}\r\n`
  // 里 `}` 后面是 `\r` 不是 `\n`，整条 match 返回 null，`?? ""` 把负向对照悄悄变成空断言
  // （对空串做 doesNotMatch 恒过）。下面用行数断言兜住"抓到的是整个函数"。
  const brushBlock = interactionSource.match(
    /function applySubBoneBrushSample\([\s\S]*?\r?\n\}\r?\n/
  )?.[0] ?? "";
  assert.ok(brushBlock, "the brush function must be found");
  assert.ok(brushBlock.split(/\r?\n/).length > 150, "the extracted block must be the whole function, not a truncated head");
  // 只看**代码行**：注释里会点名这些禁用函数以说明理由，不能连注释一起禁。
  const brushCode = brushBlock
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  assert.doesNotMatch(brushCode, /clonePanelSplits/, "the brush must never fabricate panelSplits (fatal for strands)");
  assert.doesNotMatch(brushCode, /materializeSplitBones|materializeStrandSplitBones/, "bone materialization goes through the host, not a geometry branch");
  assert.doesNotMatch(brushCode, /isPanelGeometry/, "the brush no longer has a panel-only gate");
  // ④ 影响区间用暴露判据的唯一定义点，与视口把手同源。
  assert.match(
    brushBlock,
    /const forkT = host\.forkTFor\(segmentIndex\);\s*\n\s*const firstBelow = firstExposedTipChainIndex\(forkT, rest\.length\);/,
    "the brush's editable range equals the grabbable range"
  );
  // ⑤ 笔刷写回仍是「authored.points = 结果 / authored.restPoints = 当次 rest」成对写。
  assert.match(
    brushBlock,
    /authored\.points = points\.map[\s\S]{0,160}?authored\.restPoints = rest\.map/,
    "the write-back pairs points with the rest baseline it was computed against"
  );

  // 行为侧：三管发丝，只有被选中的管的链发生位移，其余管与主链逐点不变。
  const COUNT_LOCAL = 6;
  const restAt = (offset) => (t) => ({ x: offset, y: t * 2, z: 0 });
  const tubes = [0, 1, 2].map((tube) => materializeTipChain(null, restAt(tube - 1), COUNT_LOCAL));
  const mainChain = Array.from({ length: COUNT_LOCAL }, (_, i) => ({ x: 0, y: i, z: 0 }));
  const mainBefore = mainChain.map((p) => ({ ...p }));
  const selected = 1;
  const firstBelow = firstExposedTipChainIndex(0.5, COUNT_LOCAL);
  // 复刻笔刷的写入语义：只在选中管的暴露区间叠加位移。
  const edited = tubes.map((chain, tube) => {
    if (tube !== selected) return chain;
    const points = chain.points.map((p, i) => (i >= firstBelow ? { x: p.x + 0.3, y: p.y, z: p.z } : { ...p }));
    return materializeTipChain(
      { points, restPoints: chain.restPoints.map((p) => ({ ...p })), active: true },
      restAt(tube - 1),
      COUNT_LOCAL
    );
  });
  edited.forEach((chain, tube) => {
    chain.points.forEach((p, i) => {
      const expected = tube === selected && i >= firstBelow ? (tube - 1) + 0.3 : (tube - 1);
      assert.ok(Math.abs(p.x - expected) < 1e-9, `tube ${tube} point ${i}: only the selected tube's exposed range moves`);
    });
  });
  assert.deepEqual(mainChain, mainBefore, "the main chain is never touched by a tip sub-bone brush stroke");
  // 未选中管逐点与编辑前恒等（对象身份也未换 → 完全没进写入路径）。
  assert.equal(edited[0], tubes[0], "unselected tube 0 is not even re-materialized");
  assert.equal(edited[2], tubes[2], "unselected tube 2 is not even re-materialized");
});

test("strand tip edit paths must seed from the materialized chain (negative control)", async () => {
  // 0.2.120 硬约束的**发丝版**负向对照，与本文件既有的 panel 版同构（"tip sub-bone brush
  // must seed from the materialized chain, not authored points"）。
  // 场景：用户在旧 rest（x=0）上把发尖推到 x=5（delta=+5），随后改了 Split Spacing /
  // zipper 高度 / 主链 —— 该管的 rest 整体移到 x=20。
  const authored = {
    points: Array.from({ length: COUNT }, () => ({ x: 5, y: 0, z: 0 })),
    restPoints: Array.from({ length: COUNT }, () => ({ x: 0, y: 0, z: 0 })),
    twists: Array.from({ length: COUNT }, () => 0),
    active: true
  };
  const restPointAt = (offset) => () => ({ x: offset, y: 0, z: 0 });
  const shown = materializeTipChain(authored, restPointAt(20), COUNT);
  shown.points.forEach((p, i) => {
    assert.ok(Math.abs(p.x - 25) < 1e-9, `viewport shows new rest + delta at ${i}`);
  });

  // ① 正确路径（本轮实现）：从物化链取种子 + 成对写回同批 restPoints ⇒ 往返恒等。
  const fixed = {
    points: shown.points.map((p) => ({ ...p })),
    restPoints: shown.restPoints.map((p) => ({ ...p })),
    twists: authored.twists.slice(),
    active: true
  };
  materializeTipChain(fixed, restPointAt(20), COUNT).points.forEach((p, i) => {
    assert.ok(Math.abs(p.x - 25) < 1e-9, `materialized seeding round-trips as identity at ${i}`);
  });

  // ② 负向对照（旧的发丝路径行为）：从 authored.points 取种子（陈旧空间）+ 同样的写回。
  const stale = {
    points: authored.points.map((p) => ({ ...p })),
    restPoints: shown.restPoints.map((p) => ({ ...p })),
    twists: authored.twists.slice(),
    active: true
  };
  const afterBug = materializeTipChain(stale, restPointAt(20), COUNT);
  afterBug.points.forEach((p, i) => {
    // 5 而不是 25：正好跳回 rest 链的位移量（-20）。
    assert.ok(Math.abs(p.x - 5) < 1e-9, `stale seeding jumps back by the rest shift at ${i}`);
  });
  assert.ok(
    Math.abs((afterBug.points[0].x - 25) + 20) < 1e-9,
    "the offset equals exactly the rest displacement — the documented symptom"
  );

  // ③ source-text：发丝的三条编辑路径都必须从 host.tipChainFor（物化链）取值，
  // 且拖拽快照的 startPoints/restPoints 成对来自同一次物化。
  const interactionSource = await readFile(
    new URL("../modules/bones/bone-interaction.js", import.meta.url),
    "utf8"
  );
  assert.match(
    interactionSource,
    /function tipDragSnapshot\(tip\) \{\s*return \{\s*startPoints: tip\.points\.map[\s\S]{0,160}?restPoints: tip\.restPoints\.map/,
    "the drag snapshot takes points AND rest from the same materialization"
  );
  // 负向对照：快照/写回路径不得读 bone.tip.points 当绝对位置来源。
  const snapshotBlock = interactionSource.match(/function tipDragSnapshot[\s\S]*?\r?\n\}/)?.[0] ?? "";
  assert.ok(snapshotBlock);
  assert.doesNotMatch(snapshotBlock, /bone\.tip/, "the snapshot must not read authored points as absolute positions");
  assert.match(
    interactionSource,
    /const next = tip\.points\.map\(\(p\) => \(\{ x: p\.x, y: p\.y, z: p\.z \}\)\);[\s\S]{0,200}?writeTipEdit\(bone, next, tip\.restPoints\)/,
    "the view-plane drag seeds from the materialized chain and writes the paired rest"
  );
});

test("hover resolves the correct tube from leafWeights on a split strand", () => {
  // createSplitStrandGeometry 早就以与 panel 逐字段相同的 [mainJoint, leafIndex, weight]
  // stride-3 写出 geometry.userData.leafWeights，所以 hover 命中测试对发丝原样可用。
  // 这里直接用真实的 leafIndexAt / leafWeightsValid 验证「顶点 → 管号」。
  const weights = new Float32Array([
    3, 0, 1,    // vertex 0 -> tube 0
    3, 0, 0,    // vertex 1 -> tube 0, weight 0 (fork 以下，capture 归主链)
    4, 2, 1,    // vertex 2 -> tube 2
    4, 1, 0.5   // vertex 3 -> tube 1
  ]);
  assert.equal(leafWeightsValid(weights, 4), true, "stride-3 weights validate against the vertex count");
  assert.equal(leafWeightsValid(weights, 5), false, "a mismatched vertex count is rejected (no partial reads)");
  assert.equal(leafIndexAt(weights, 0), 0);
  assert.equal(leafIndexAt(weights, 2), 2, "hovering a vertex of tube 2 resolves tube 2, not tube 0");
  assert.equal(leafIndexAt(weights, 3), 1);

  // 真实几何：3 管分裂发丝必须写出 leafWeights，且其管号覆盖 0..2、与段数一致。
  // 深/浅非对称（0.5 / 0.2）沿用 WidthCurve 测试同款配置：任何"只对某一侧生效"的退化都
  // 会让下面的管号集合缺项。
  const api = makeMultiSplitGeometryApi();
  const lock = baseSplitLock({
    strandSplits: [
      { position: -0.3, height: 0.5, order: 0 },
      { position: 0.3, height: 0.2, order: 1 }
    ]
  });
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  const geometry = api.createSplitStrandGeometry(lock, curve, splitProfile());
  const leafWeights = geometry.userData.leafWeights;
  assert.ok(leafWeights, "split strand geometry emits leafWeights");
  assert.equal(
    geometry.userData.strandSplitWeights,
    leafWeights,
    "strandSplitWeights is the same array (backward-compatible alias), so hover and skinning cannot diverge"
  );
  const positionCount = geometry.getAttribute("position").count;
  assert.equal(leafWeightsValid(leafWeights, positionCount), true, "the emitted weights validate against the real vertex count");
  const tubes = new Set();
  for (let vertex = 0; vertex < positionCount; vertex += 1) {
    const tube = leafIndexAt(leafWeights, vertex);
    if (tube >= 0) tubes.add(tube);
  }
  assert.deepEqual(
    [...tubes].sort((a, b) => a - b),
    [0, 1, 2],
    "every tube of a 2-zipper strand is reachable by hover (this is what made the port a gate-widening job)"
  );
  assert.equal(tubes.size, STRAND_SEGMENT_HOST.segmentCount(lock), "hover tube count matches the host's segment count");
});

test("tip highlight and hover gates dispatch on segmentBoneHost, not isPanelGeometry", async () => {
  const [panelTipSource, interactionSource] = await Promise.all([
    readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8")
  ]);
  // 表面高亮：门控放开即可（函数主体本就只读 leafWeights，几何无关）。
  assert.match(
    panelTipSource,
    /if \(\(selectedSeg == null && hoveredSeg == null\) \|\| !segmentBoneHost\(lock\)/,
    "updateTipHighlight gates on segmentBoneHost so split strands highlight too"
  );
  assert.match(
    panelTipSource,
    /const leafWeights = geometry\?\.userData\?\.leafWeights \|\| geometry\?\.userData\?\.panelWeights/,
    "the highlight still reads the generic leafWeights (with the legacy panelWeights alias)"
  );
  // hover 命中：同样只放开门控，命中测试代码一行未改。
  assert.match(
    interactionSource,
    /if \(lock && resolveTipHost\(lock\)\) \{/,
    "updatePanelTipHover gates on the tip host, so split strands can be hovered"
  );
  assert.match(
    interactionSource,
    /const segment = leafIndexAt\(leafWeights, hit\.face\.a\);/,
    "the hit test itself is unchanged (leafIndexAt on the hit face)"
  );
});

// ═══ 0.2.130 绿色 Tip Clump 手柄移植到普通发丝 ═══════════════════════════════════════
// panel 的绿色手柄语义 = 「spread 是把手在**本段自身横向跨度**里的归一化位置」
// （handleU = boundaries[seg] + (spread / SPREAD_MAX) * span）。发丝的正确类比是同一句话，
// 只是横向跨度换成「该管在发尖处的两侧边缘之间」。下面的测试把这条类比 + 拖拽反演钉死。

test("Tip Clump axis: spread is the normalized position across the tube's OWN tip width", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const bones = blankTubeBones(splits.length + 1);
  const tube = TIP_WIDTH_ASYMMETRIC_TUBE;
  const geo = tipWidthGeoDepsWithChains(lock, null);
  const axis = strandTipClumpAxis(geo, lock, splits, tube, bones[tube]);
  assert.ok(axis, "a split tube must expose a Tip Clump axis");
  // spread = 0 ⇒ 落在该管**左**边缘；spread = SPREAD_MAX ⇒ 落在**右**边缘。判据用被测模块
  // 之外的独立求值（strandTipWidthEdgePosition 直接调用），所以断言钉的是「两端确实是两侧
  // 边缘」，不是复述实现。
  // **两个探针都用 spread = 0**（0.2.132）：跨度基准是管的**未收窄**宽度，与 panel 用未收窄
  // 的段 boundaries 同构。若按各自 spread 求边缘，边缘会随 spread 内收 ⇒ 轨迹变二次曲线，
  // 下一条 AFFINE 测试会红。
  for (const [spread, side] of [[0, -1], [SPREAD_MAX, 1]]) {
    const probeBone = { ...bones[tube], tipClump: 0 };
    const edge = strandTipWidthEdgePosition(geo, lock, splits, tube, probeBone, side, 1);
    assert.ok(edge, `edge must exist for side ${side}`);
    // 手柄比边缘多一个沿切线的外推（避免与发尖链末点手柄重合），所以比较横向分量。
    const handle = axis.pointAt(spread);
    assert.ok(
      Math.abs(handle.x - edge.point.x) < 1e-9,
      `spread ${spread} must land on the ${side < 0 ? "left" : "right"} edge laterally`
    );
  }
  // 跨度非零：手柄真的能沿一段可见距离移动（否则视口里拖不动）。
  assert.ok(
    axis.start.distanceTo(axis.end) > 0.01,
    "the axis must span a draggable distance across the tube's own width"
  );
});

test("Tip Clump axis stays draggable when the taper curve ends at 0 (the real-project shape)", () => {
  // **实测踩过的回归**（0.2.132，scripts/verify-tip-clump.mjs 抓到、node 侧当时漏掉）：
  // DEFAULT_TAPER_CURVE 的末点 value 恰为 **0**（真实工程 layered-side-bun 的 Front Bangs 亦然），
  // 于是 t = 1 处每根管的真实网格宽度都是 0、所有边缘塌到脊柱同一点。若 Tip Clump 轴改用
  // 「t = 1 的真实边缘」当端点，轴长恒为 0 ⇒ 手柄拖不动、且 N+1 个手柄重叠成一个。
  // 本文件其余 fixture 用的是恒 1 的 FLAT_CURVE，**掩盖**了这种形状 —— 所以这条测试专门
  // 用「末点为 0」的曲线，并同时断言「可拖」与「每根管的手柄互不重合」。
  const taperToZero = [
    { position: 0, value: 0.3, interpolation: "smooth" },
    { position: 0.89, value: 0.4, interpolation: "smooth" },
    { position: 1, value: 0, interpolation: "smooth" }
  ];
  const lock = tipWidthLock({
    taperCurve: taperToZero.map((point) => ({ ...point })),
    taperCurveSecondary: taperToZero.map((point) => ({ ...point }))
  });
  const splits = strandSplitsFor(lock);
  const tubeCount = splits.length + 1;
  const bones = blankTubeBones(tubeCount);
  const geo = tipWidthGeoDepsWithChains(lock, null);
  // 前提确认：真实边缘在 t = 1 的**横向**分量真的退化（否则这条测试没在考察它声称的东西）。
  // 量 point−center：两点共用同一个 edgeZ，故其差是**纯横向**量（edgePosition 的既有性质，
  // 也是拖拽基准）。taper(1)=0 ⇒ 该横向量为 0。**刻意不量 point 之间的距离**：本文件的
  // fixture 用恒 1 的 depthCurve，两侧 z 不同会让距离非零、掩盖横向退化。
  for (const side of [-1, 1]) {
    const edge = strandTipWidthEdgePosition(geo, lock, splits, 0, { ...bones[0], tipClump: 0 }, side, 1);
    assert.ok(edge, `edge must still resolve for side ${side}`);
    const lateral = edge.point.clone().sub(edge.center).dot(edge.lateral);
    assert.ok(
      Math.abs(lateral) < 1e-9,
      `sanity: taper(1)=0 must collapse the real tip edge laterally (side ${side} got ${lateral})`
    );
  }
  // 轴仍必须可拖，且每根管各自一条。
  const axes = Array.from({ length: tubeCount }, (_, tube) => (
    strandTipClumpAxis(geo, lock, splits, tube, bones[tube])
  ));
  axes.forEach((axis, tube) => {
    assert.ok(axis, `tube ${tube} must expose an axis`);
    assert.ok(
      axis.start.distanceTo(axis.end) > 0.01,
      `tube ${tube}: the axis must stay draggable at taper(1)=0, got ${axis.start.distanceTo(axis.end)}`
    );
  });
  // 手柄互不重合：取每根管当前 spread 处的点，两两距离必须可分辨（否则拖不清是哪根管）。
  const points = axes.map((axis, tube) => axis.pointAt(bones[tube].tipClump ?? 0));
  for (let k = 0; k + 1 < points.length; k += 1) {
    assert.ok(
      points[k].distanceTo(points[k + 1]) > 0.01,
      `tubes ${k}/${k + 1} handles must stay distinguishable, got ${points[k].distanceTo(points[k + 1])}`
    );
  }
});

test("Tip Clump axis is AFFINE in spread, so a 49-probe scan inverts it exactly", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const bones = blankTubeBones(splits.length + 1);
  const tube = TIP_WIDTH_ASYMMETRIC_TUBE;
  const axis = strandTipClumpAxis(tipWidthGeoDepsWithChains(lock, null), lock, splits, tube, bones[tube]);
  // 仿射 ⇒ 中点性质：pointAt(m) 恰是两端的中点。这正是拖拽端只需两次几何求值、其余用廉价
  // 插值扫描的依据；若哪天 opening 不再是纯平移（非仿射），本断言会先失败。
  const mid = axis.pointAt(SPREAD_MAX / 2);
  const expected = axis.start.clone().lerp(axis.end, 0.5);
  assert.ok(mid.distanceTo(expected) < 1e-9, "the midpoint spread maps to the geometric midpoint");
  // 反演往返：把 pointAt(s) 当「指针落点」，用与 bone-interaction 同构的 49 探针最近点扫描
  // 反解回 spread，必须回到出发值（容差 = 探针间距的一半）。
  const step = SPREAD_MAX / 48;
  for (const spread of [0, 0.2, 0.5, 0.9, SPREAD_MAX]) {
    const target = axis.pointAt(spread);
    let best = null;
    for (let i = 0; i <= 48; i += 1) {
      const probe = THREE.MathUtils.lerp(0, SPREAD_MAX, i / 48);
      const distance = axis.pointAt(probe).distanceTo(target);
      if (!best || distance < best.distance) best = { distance, probe };
    }
    assert.ok(
      Math.abs(best.probe - spread) <= step / 2 + 1e-9,
      `scan must recover spread ${spread} (got ${best.probe})`
    );
  }
});

test("Tip Clump axis FOLLOWS a dragged tip sub-bone (same transform chain as the width handles)", () => {
  const lock = tipWidthLock();
  const splits = strandSplitsFor(lock);
  const bones = blankTubeBones(splits.length + 1);
  const tube = TIP_REANCHOR_TUBE;
  // 链数组必须是 **N+1 管**（不是 splits.length）：少一条会让被测管取到 undefined，
  // 于是「跟随」断言在完全没有链的情况下也绿灯（实测过：漏掉 +1 时本测试假通过）。
  const tubeCount = splits.length + 1;
  const neutralChains = Array.from({ length: tubeCount }, (_, i) => strandTubeTipChain(lock, splits, i));
  const neutral = strandTipClumpAxis(
    tipWidthGeoDepsWithChains(lock, neutralChains),
    lock,
    splits,
    tube,
    { ...bones[tube], tip: { active: true } }
  );
  // ① 完全无链（app.js 尚未物化时的守卫路径）：仍必须产出一条可用的轴，不得抛异常。
  // 切线此时回退主几何帧 y —— 与有链时的管心切线有微小夹角，所以下面 ② 只钉「不跳走」，
  // **刻意不**钉 byte-identity：管心含 opening 横向偏移，它自己的切线才是正确的外推方向，
  // 有链就该用链的（这不是缺陷，是取值优先级）。
  const noChainAtAll = strandTipClumpAxis(tipWidthGeoDepsWithChains(lock, null), lock, splits, tube, bones[tube]);
  assert.ok(noChainAtAll, "the no-chain guard path still yields an axis");
  // ② 中性链（points === restPoints，无 authored 位移）不得让手柄跳走：平移项恒等消掉，
  // 只剩上面那点切线夹角。
  assert.ok(
    neutral.pointAt(0.4).distanceTo(noChainAtAll.pointAt(0.4)) < 0.02,
    "a neutral (undragged) chain must not teleport the handle"
  );
  // 被拖动的链（末两点 +x）：手柄必须跟着走。这是 0.2.127 为宽度把手修过的同一类 bug，
  // 本轮的新手柄从一开始就落在同一条链变换上（它复用 strandTipWidthEdgePosition）。
  const draggedChains = Array.from({ length: tubeCount }, (_, i) => strandTubeTipChain(
    lock,
    splits,
    i,
    (point, index) => (i === tube ? { ...point, x: point.x + TIP_DRAG_DISPLACEMENT[index] } : point)
  ));
  const dragged = strandTipClumpAxis(
    tipWidthGeoDepsWithChains(lock, draggedChains),
    lock,
    splits,
    tube,
    { ...bones[tube], tip: { active: true } }
  );
  assert.ok(
    dragged.pointAt(0.4).distanceTo(neutral.pointAt(0.4)) > 0.05,
    "dragging the tip sub-bone must move the Tip Clump handle with it"
  );
});

test("Tip Clump handles: ONE allocation, ONE userData key, ONE hit gate for both geometries", async () => {
  const [handleSource, interactionSource] = await Promise.all([
    readFile(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8")
  ]);
  // ① 分配：两种几何调**同一个** allocateTipClumpHandles，段数各自从描述子取。
  assert.match(
    handleSource,
    /allocateTipClumpHandles\(lock, group, PANEL_SEGMENT_HOST\.segmentCount\(lock\), tipClumpHandles\)/,
    "panel allocates via the shared allocator, sized by the host descriptor"
  );
  assert.match(
    handleSource,
    /allocateTipClumpHandles\(lock, group, strandSplitTipTubeCount, tipClumpHandles\)/,
    "strand allocates via the SAME allocator, reusing the tube count of the other tip handles"
  );
  assert.equal(
    (handleSource.match(/function allocateTipClumpHandles\(/g) || []).length,
    1,
    "there is exactly one Tip Clump allocator (no per-geometry copy)"
  );
  // ② userData 键不按几何分叉：只有 tipClumpSegment，绝不出现 strandTipClumpSegment。
  // 匹配**属性访问/赋值**而不是裸标识符：两个文件的注释里都写着「不写
  // strandTipClumpSegment」，裸匹配会被自己的说明文字绊倒。
  for (const [name, source] of [["bone-view-handles", handleSource], ["bone-interaction", interactionSource]]) {
    assert.doesNotMatch(
      source,
      /userData\.strandTipClumpSegment/,
      `${name} must not introduce a parallel strand-only userData key`
    );
  }
  // 旧的 userData 键/数组名必须彻底消失（否则命中侧会静默读到 undefined、绿手柄不可拖）。
  // 只匹配 `userData.panelSegmentIndex` / `curveObjects.panelSegmentHandles`：**store 键**
  // sculptState.panelSegmentIndex 是另一个命名空间（右侧面板停在哪一段），它必须保留 ——
  // 裸匹配会把 bone-interaction 里解释这个 store 键的注释当成违规。
  for (const [name, source] of [["bone-view-handles", handleSource], ["bone-interaction", interactionSource]]) {
    assert.doesNotMatch(source, /userData\.panelSegmentIndex/, `${name} no longer uses the old userData key`);
    assert.doesNotMatch(source, /curveObjects[.?]*\.?panelSegmentHandles/, `${name} no longer uses the old array name`);
  }
  // ③ 命中门控走 segmentBoneHost（与发尖链/宽度把手同一道门），不是手写 isPanelGeometry。
  // 门控本体在 visibleTipClumpHandles 里（0.2.130 起它同时供「让位判据」复用，见 ④e）。
  assert.match(
    interactionSource,
    /function visibleTipClumpHandles\(lock\) \{[\s\S]{0,300}?Boolean\(segmentBoneHost\(lock\)\)[\s\S]{0,200}?lock\.curveObjects\.tipClumpHandles/,
    "the Tip Clump hit list is gated by the single segmentBoneHost dispatch"
  );
  // ④ 拖拽仍复用既有 kind "segment"（不新增第二个 kind：begin/end/可见性/高亮都靠它匹配）。
  assert.match(
    interactionSource,
    /hit\.object\.userData\.tipClumpSegment != null\s*\?\s*"segment"/,
    "the Tip Clump drag reuses the existing kind \"segment\""
  );
  // 同样匹配**代码**而不是裸字符串（实现里的注释写着「刻意不新增 kind "strandSegment"」）：
  // 只有当它真的出现在 kind 比较/赋值里才算违规。
  assert.doesNotMatch(
    interactionSource,
    /kind (?:===|!==|:) "strandSegment"/,
    "no second drag kind was introduced"
  );
  // ④b 发丝写入必须落在**物化**骨骼上（standards「物化后再创作」，与滑杆路径
  // applyStrandSegmentSpread 同规则）：读派生视图 strandSplitBonesFor 写进去会被丢弃。
  assert.match(
    interactionSource,
    /const axisBones = materializeStrandSplitBones\(lock\);[\s\S]{0,700}?bone\.tipClump = THREE\.MathUtils\.clamp\(clumpBest\.tipClump, 0, SPREAD_MAX\)/,
    "the strand Tip Clump drag materializes before authoring bone.tipClump"
  );
  // ④c 拖拽后热同步按几何分派到对应的那组段控件（发丝 → #strandSegmentControls）。
  assert.match(
    interactionSource,
    /if \(strandClump\) deps\.syncStrandSegmentControls\(lock\);\s*\n\s*else deps\.syncPanelSegmentControls\(lock\);/,
    "the drag refreshes the right geometry's segment panel"
  );
  // ④d 拖拽中必须用 updateCurveObjects（不是 rebuild）：重建会销毁正被拖的球、中断拖拽。
  assert.doesNotMatch(
    interactionSource,
    /kind === "segment"[\s\S]{0,2000}?deps\.rebuildCurveObjects/,
    "the Tip Clump drag must not rebuild curve objects mid-drag"
  );
  // ④e 绿手柄必须优先于**曲线控制点**（0.2.130 浏览器实测暴露的真实缺陷）：控制点用 12px
  // 屏幕半径拾取、且在 capture 阶段 stopImmediatePropagation，而普通发丝的发尖控制点就落在
  // 管尖（真实工程 layered-side-bun / Front Bangs 1 实测相距 9.7–10px）⇒ 不让位就完全抓不到
  // 绿手柄。让位判据必须是**射线命中球体**（比屏幕半径窄），且与拖拽命中列表同一定义点。
  assert.match(
    interactionSource,
    /function visibleTipClumpHandles\(lock\)/,
    "there is a single definition point for the grabbable Tip Clump handles"
  );
  assert.match(
    interactionSource,
    /function prepareCurvePointSelection\(event\)[\s\S]{0,1800}?if \(pointerHitsTipClumpHandle\(clumpLock\)\) return;/,
    "curve-point selection yields to a pointer that is on a Tip Clump handle"
  );
  // 让位必须在**两种编辑模式之前**：绿手柄在对象模式与组件模式下都可见可拖，只放进
  // componentEditModeActive 分支会让对象模式继续被抢走（实测那条路径就是抢走者）。
  assert.match(
    interactionSource,
    /if \(pointerHitsTipClumpHandle\(clumpLock\)\) return;\s*\}\s*if \(!deps\.componentEditModeActive\(\)\)/,
    "the carve-out precedes BOTH edit-mode branches"
  );
  // 拖拽命中列表与让位判据读同一个函数（否则会「让位了却抓不到」）。
  assert.match(
    interactionSource,
    /const segmentHandles = visibleTipClumpHandles\(lock\);/,
    "the drag hit list reuses the same visible-handle definition"
  );
  // ⑤ SPREAD_MAX 单一定义点：写入路径不得再内联 0.99 字面量。
  // 字段 0.2.132 改名 spread → tipClump，两个名字都扫：只扫新名会让「有人写回旧字段并内联
  // 0.99」这种回归静默通过。
  for (const [name, source] of [["bone-interaction", interactionSource], ["bone-view-handles", handleSource]]) {
    assert.doesNotMatch(
      source,
      /(?:spread|tipClump) = THREE\.MathUtils\.clamp\([^)]*0\.99/,
      `${name} clamps via SPREAD_MAX`
    );
  }
  const segmentControlSource = await readFile(new URL("../modules/bones/segment-control.js", import.meta.url), "utf8");
  assert.doesNotMatch(
    segmentControlSource,
    /^const SPREAD_MAX = /m,
    "segment-control imports SPREAD_MAX instead of keeping its own copy"
  );
  assert.match(segmentControlSource, /SPREAD_MAX,/, "segment-control imports SPREAD_MAX from bone-model");
});

test("0.2.132: the middle tube's Tip Clump now MOVES THE MESH (old direction===0 dead zone)", () => {
  // 这是本轮**修掉的一个真实死区**，原先记在 strandTipClumpAxis 的 DEGENERATE 注释里作为
  // 「已知几何行为」：spread 当年只经 opening 生效，而 opening ∝ (2k−N)/N —— 偶数拉链数的
  // 正中间管（N=2 的 k=1）系数恰为 0 ⇒ 拖它的绿手柄、拉它的滑杆，网格**一动不动**。
  // Tip Clump 改为「绕本管中心收窄」后不再依赖任何方向系数，每一根管都必然响应。
  const lock = (tipClump) => tipWidthLock({
    strandSplits: [
      { position: -0.4, height: 0.35, order: 0 },
      { position: 0.4, height: 0.35, order: 1 }
    ],
    strandSplitBones: blankTubeBones(3).map((bone) => ({ ...bone, tipClump }))
  });
  const middle = 1;
  const tipRowXs = (clumpValue) => {
    const geometry = tipWidthGeometryFor(lock(clumpValue));
    assert.ok(geometry, "the N=2 fixture must produce geometry");
    return tubeRowXs(geometry, positionsOf(geometry), middle, geometry.userData.actualLengthSegments);
  };
  const spanOf = (xs) => Math.max(...xs) - Math.min(...xs);
  const loose = tipRowXs(0);
  const clumped = tipRowXs(0.8);
  // 中间管的发尖宽度必须真的收窄（旧实现这两个 span 逐位相同 —— 那正是死区）。
  assert.ok(
    spanOf(clumped) < spanOf(loose) - 1e-6,
    `the middle tube must narrow with Tip Clump: ${spanOf(loose)} -> ${spanOf(clumped)}`
  );
  // 收窄是绕管心的**缩放**，不是平移：两侧极值的中点逐值不动。
  const midOf = (xs) => (Math.max(...xs) + Math.min(...xs)) * 0.5;
  assert.ok(
    Math.abs(midOf(clumped) - midOf(loose)) < 1e-6 * Math.max(1, spanOf(loose)),
    `the middle tube must not translate, moved by ${midOf(clumped) - midOf(loose)}`
  );
  // 手柄仍必须可拖（跨度来自管自身未收窄的宽度）。
  const splits = strandSplitsFor(lock(0));
  const bones = blankTubeBones(splits.length + 1);
  const axis = strandTipClumpAxis(tipWidthGeoDepsWithChains(lock(0), null), lock(0), splits, middle, bones[middle]);
  assert.ok(axis, "the middle tube still exposes an axis");
  assert.ok(axis.start.distanceTo(axis.end) > 0.01, "the middle tube's handle spans a draggable distance");
});

