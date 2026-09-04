// panel-tip-span-chain.test.mjs — splitTipForLeafSpan（modules/geometry/panel-tip-strand.js
// 新增，本次是唯一新增函数，未改动任何既有函数体）的回归测试。
//
// 背景（devlog/archive/panel-bone-tree-handoff.md §4 方案 A）：中间层分组节点（覆盖
// 闭区间 leafStart..leafEnd 的连续叶子，如「L2.Segments 2-3」）需要一条属于自己的发尖链，
// 而不是任何单个叶子自己的发尖链。splitTipForLeafSpan 把这段区间通过
// syntheticSplitsForLeafSpan（已有 0.2.157 落地、5 条测试）折成合成 splits + 虚拟
// segmentIndex，原样喂给既有 splitTipForSegment——不重新发明几何公式。
//
// 本文件断言三件事：
//   1. 退化等价：leafStart===leafEnd 时与既有 splitTipForSegment(lock, leafStart, splits,
//      bone) 逐字节相同（deepEqual），证明这不是新的特例分支而是自然退化。
//   2. 跨叶 lateralU ≈ 0（严格为 0，非近似）：span 的 rest 链精确落在区间中心线上，
//      而不是「leafStart 自己的叶子中心」——用真实数字对照两者的差异，证明选错
//      segmentIndex（方案 B，已否决）会产生非零横向偏移。
//   3. authored delta 在跨叶场景下同样保留（rest 链不受 authored 影响、只有被编辑的点
//      产生 delta），与 splitTipForSegment 现有契约一致。
import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";

// 与 tests/panel-tip-synthetic-splits.test.mjs 同一份真实数字（Scalp Conform Test 4.ahs
// 的 Front Bangs 1，panelSplits 按 position 升序，N=2 zipper）：3 个叶子（0,1,2）。
const REAL_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

function harness(splits = REAL_SPLITS) {
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
    taperCurve: [
      { position: 0, value: 1, interpolation: "linear" },
      { position: 1, value: 0.4, interpolation: "linear" }
    ],
    points: Array.from({ length: 6 }, (_, index) => ({ x: 0, y: 1.7 - index * 0.25, z: 0 }))
  };
  return { panel, splits, lock };
}

test("退化等价：leafStart===leafEnd 时 splitTipForLeafSpan 与既有 splitTipForSegment 逐字节相同", () => {
  const { panel, splits, lock } = harness();
  for (let leaf = 0; leaf <= splits.length; leaf += 1) {
    const viaSpan = panel.splitTipForLeafSpan(lock, leaf, leaf, splits, null);
    const viaSegment = panel.splitTipForSegment(lock, leaf, splits, null);
    assert.deepEqual(viaSpan, viaSegment, `叶子 ${leaf}：退化情形必须逐字节相同`);
  }
});

test("跨叶 lateralU ≈ 0：span 的发尖链中点精确落在合成区间中心，而非 leafStart 自己的叶子中心", () => {
  const { panel, splits, lock } = harness();
  // 区间 [0,1]（跨叶子 0、1，内部去掉 zipper 0）：合成边界 = [-1, 0.36666666666666675]，
  // 区间中心 = (-1 + 0.36666666666666675) / 2 = -0.31666666666666665。
  const spanChain = panel.splitTipForLeafSpan(lock, 0, 1, splits, null);
  assert.ok(spanChain, "跨叶区间必须产出发尖链");
  const boundaries = [-1, ...splits.map((s) => s.position), 1];
  const spanCenterU = (boundaries[0] + boundaries[2]) * 0.5;

  // 对照：如果错误地直接用 leafStart(=0) 当 segmentIndex（方案 B，已否决），会取到
  // 叶子 0 自己的中心，而不是区间 [0,1] 的中心——两者必须不同，否则这条对照没有区分力。
  const wrongCenterU = (boundaries[0] + boundaries[1]) * 0.5;
  assert.notEqual(
    spanCenterU, wrongCenterU,
    "区间中心与叶子 0 自己的中心必须不同，否则本测试不能证明选对了 segmentIndex"
  );

  // splitTipForSegment 用同一份合成 splits + vIdx 重新算出的中心，必须精确等于 spanCenterU
  // （lateralU = v - centerU 在 v = spanCenterU 处必须精确为 0，与
  // panel-tip-synthetic-splits.test.mjs 的既有断言同一推导）。用 tipSurfaceFrameAt 在
  // spanCenterU 处采样，与 rest 链的中点（chain 长度为奇数时的正中点，或直接用 t=0.5 附近
  // 两点平均）比较，验证 rest 链确实贴住 spanCenterU 而非 wrongCenterU。
  const restAtSpanCenter = panel.tipSurfaceFrameAt(lock, 0.5, spanCenterU, 0, [], null).point;
  const restAtWrongCenter = panel.tipSurfaceFrameAt(lock, 0.5, wrongCenterU, 0, [], null).point;
  const lateralAxis = panel.tipSurfaceFrameAt(lock, 0.5, spanCenterU, 0, [], null).x;
  const diff = new THREE.Vector3().subVectors(restAtWrongCenter, restAtSpanCenter);
  assert.ok(
    Math.abs(diff.dot(lateralAxis)) > 1e-6,
    "spanCenterU 与 wrongCenterU 处的表面点必须在横向轴上有可测差异（否则对照组无区分力）"
  );

  // spanChain 的 rest 链中点应与「在 spanCenterU 处直接采样」一致（同一条 restPointAt 公式，
  // 只是走了合成 splits）。取链首/中/尾三点分别核对（mainCount=6，索引 0/2/5 覆盖 t=0/0.4/1）。
  const mainCount = lock.points.length;
  [0, 2, mainCount - 1].forEach((index) => {
    const t = index / (mainCount - 1);
    const expected = panel.tipSurfaceFrameAt(lock, t, spanCenterU, 0, [], null).point;
    const actual = spanChain.restPoints[index];
    assert.ok(Math.abs(actual.x - expected.x) < 1e-9, `restPoints[${index}].x 必须贴住 spanCenterU`);
    assert.ok(Math.abs(actual.y - expected.y) < 1e-9, `restPoints[${index}].y 必须贴住 spanCenterU`);
    assert.ok(Math.abs(actual.z - expected.z) < 1e-9, `restPoints[${index}].z 必须贴住 spanCenterU`);
  });
});

test("跨叶区间的 authored delta 保留：未编辑时 points===restPoints，编辑后 delta 精确叠加", () => {
  const { panel, splits, lock } = harness();
  const noAuthored = panel.splitTipForLeafSpan(lock, 1, 2, splits, null);
  assert.ok(noAuthored, "跨叶区间 [1,2] 必须产出发尖链");
  noAuthored.points.forEach((point, index) => {
    const rest = noAuthored.restPoints[index];
    assert.equal(point.x, rest.x);
    assert.equal(point.y, rest.y);
    assert.equal(point.z, rest.z);
  });

  // authored：把最后一点（尖端）往 +x 方向移 0.2（组节点的 tip 字段形状与 splitBone.tip
  // 一致：{points, restPoints, twists, active}，与 panel-bone-groups.js 的
  // normalizeGroupTip 契约一致）。
  const mainCount = lock.points.length;
  const restCopy = noAuthored.restPoints.map((p) => ({ ...p }));
  const authoredPoints = restCopy.map((p, index) => (
    index === mainCount - 1 ? { x: p.x + 0.2, y: p.y, z: p.z } : { ...p }
  ));
  const groupBone = { tip: { points: authoredPoints, restPoints: restCopy, active: true } };
  const withAuthored = panel.splitTipForLeafSpan(lock, 1, 2, splits, groupBone);
  assert.ok(withAuthored, "authored 版本必须产出发尖链");
  withAuthored.points.forEach((point, index) => {
    const rest = withAuthored.restPoints[index];
    const expectedDeltaX = index === mainCount - 1 ? 0.2 : 0;
    assert.ok(
      Math.abs((point.x - rest.x) - expectedDeltaX) < 1e-9,
      `点 ${index} 的 delta.x 必须精确等于 authored 差值`
    );
    assert.equal(point.y, rest.y, `点 ${index} 的 y 分量不该被这次编辑改变`);
    assert.equal(point.z, rest.z, `点 ${index} 的 z 分量不该被这次编辑改变`);
  });
});

test("跨越全部叶子的区间 [0, N-1]：合成 splits 为空，等价于无 zipper 的单段发尖链", () => {
  const { panel, splits, lock } = harness();
  const lastLeaf = splits.length; // 3 个叶子（0,1,2），最后一个下标 = splits.length
  const fullSpan = panel.splitTipForLeafSpan(lock, 0, lastLeaf, splits, null);
  const viaSegmentZero = panel.splitTipForSegment(lock, 0, [], null);
  assert.deepEqual(fullSpan, viaSegmentZero, "跨越全部叶子必须与「无 zipper 时的段 0」逐字节相同");
});

test("非法/退化输入不抛异常：越界 segmentIndex 组合仍走既有 splitTipForSegment 的 null 契约", () => {
  const { panel, splits, lock } = harness();
  // leafStart/leafEnd 越界（超过实际叶子数）：syntheticSplitsForLeafSpan 不做范围校验
  // （职责在调用方），但派生出的 vIdx 会落在既有 splitTipForSegment 的越界分支上，
  // 该分支已有契约（segmentIndex >= boundaries.length - 1 时返回 null）。
  const outOfRange = panel.splitTipForLeafSpan(lock, 5, 5, splits, null);
  assert.equal(outOfRange, null, "越界单叶子退化情形必须回落既有 null 契约");
});

