// panel-tier-twist-inherit.test.mjs - 中间层 twist 层级继承（0.2.169）回归测试。
//
// 背景：0.2.168 只给 points 补了祖先 delta 累加（splitTipForSegment 的 ancestorTips），
// twists 没有同一条通路 —— materializeTipChain 里 twists 是**绝对值数组**（隐含 rest 基线
// 恒为 0，不是 points 的 delta 形式），所以刷中间层的 Twist/Orient 笔刷对叶子链毫无效果。
// 本文件断言：叶子链的最终 twists = 叶子自己的 twists + Σ(各祖先中间层 tip.twists)。
//
// 与 tests/panel-tip-span-chain.test.mjs 共享同一套 harness 构造方式（createPanelTipStrandApi
// + 最小可用 deps），只是本文件额外在 lock.panelBoneGroups 上手写分组树（不走
// derivePanelBoneGroups，直接构造能通过 normalizePanelBoneGroups 校验的形状）。
import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";

// 3 叶子（2 条 zipper）：与 panel-tip-span-chain.test.mjs 的 REAL_SPLITS 同一份真实数字。
const SPLITS_3LEAF = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// 4 叶子（3 条 zipper）：给多层嵌套测试用，位置任意取等距即可（本文件只关心 twist 数值
// 累加，不关心几何位置的具体数字）。
const SPLITS_4LEAF = [
  { position: -0.5, height: 0.3, order: 0 },
  { position: 0, height: 0.4, order: 1 },
  { position: 0.5, height: 0.3, order: 2 }
];

const MAIN_COUNT = 6; // lock.points.length

function harness(splits) {
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
    points: Array.from({ length: MAIN_COUNT }, (_, index) => ({ x: 0, y: 1.7 - index * 0.25, z: 0 }))
  };
  return { panel, lock };
}
function zeros(count) {
  return Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 }));
}

// 叶子自己的 splitBone：只关心 tip.twists，points/restPoints 用零填充（几何位置不是本文件
// 的断言对象）。
function leafBone(twists) {
  return { tip: { points: zeros(MAIN_COUNT), restPoints: zeros(MAIN_COUNT), twists, active: true } };
}

// 中间层分组节点的 tip：points/restPoints 长度可以与 mainCount 不同（ancestorTipsForLeaf
// 只校验 points.length === restPoints.length，不要求等于 mainCount）——用短数组更清楚地
// 表达「这不是几何测试」。twists 传 null 或错长数组时用于容错测试。
function groupTip(twists, pointCount = 2) {
  return { points: zeros(pointCount), restPoints: zeros(pointCount), twists, active: true };
}

function leafNode(leafStart, leafEnd, tip = null) {
  return { leafStart, leafEnd, children: null, tip };
}

function groupNode(leafStart, leafEnd, children, tip = null) {
  return { leafStart, leafEnd, children, tip };
}

// ---------------------------------------------------------------------------
// 1. 正向：中间层 L2[1..2] 写了 tip.twists，叶子 1、2 的链 twists 都必须包含它。
// ---------------------------------------------------------------------------
test("正向：中间层 twists 累加进它覆盖的两个叶子", () => {
  const { panel, lock } = harness(SPLITS_3LEAF);
  const leaf1Twists = zeros(MAIN_COUNT).map((_, i) => 0.1 * (i + 1));
  const leaf2Twists = zeros(MAIN_COUNT).map((_, i) => 0.2 * (i + 1));
  const tierTwists = zeros(MAIN_COUNT).map((_, i) => 1.0 + i);
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], groupTip(tierTwists, MAIN_COUNT))
  ]);
  const bone1 = leafBone(leaf1Twists);
  const bone2 = leafBone(leaf2Twists);
  const chain1 = panel.splitTipForSegment(lock, 1, SPLITS_3LEAF, bone1);
  const chain2 = panel.splitTipForSegment(lock, 2, SPLITS_3LEAF, bone2);
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    assert.equal(chain1.twists[i], leaf1Twists[i] + tierTwists[i], `叶子1第${i}点必须是自身+中间层`);
    assert.equal(chain2.twists[i], leaf2Twists[i] + tierTwists[i], `叶子2第${i}点必须是自身+中间层`);
  }
});

// ---------------------------------------------------------------------------
// 2. 负向对照：同层但不被覆盖的叶子 0 不受影响。
// ---------------------------------------------------------------------------
test("负向对照：中间层只影响自己的子树，叶子0（同层但不在区间内）的 twists 不变", () => {
  const { panel, lock } = harness(SPLITS_3LEAF);
  const leaf0Twists = zeros(MAIN_COUNT).map((_, i) => 0.05 * (i + 1));
  const tierTwists = zeros(MAIN_COUNT).map((_, i) => 1.0 + i);
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], groupTip(tierTwists, MAIN_COUNT))
  ]);
  const bone0 = leafBone(leaf0Twists);
  const chain0 = panel.splitTipForSegment(lock, 0, SPLITS_3LEAF, bone0);
  assert.deepEqual(chain0.twists, leaf0Twists, "叶子0不在中间层区间内，twists 必须原样不变");
});

// ---------------------------------------------------------------------------
// 3. 退化等价：无 panelBoneGroups 的旧档，改前改后逐字节相同。
// ---------------------------------------------------------------------------
test("退化等价：无 panelBoneGroups 时 twists 等于叶子自身链（未经任何祖先加成）", () => {
  const { panel, lock } = harness(SPLITS_3LEAF);
  // 不设置 lock.panelBoneGroups：panelBoneGroupsFor 回落到 derivePanelBoneGroups（无 tip）。
  const leafTwists = [0.3, -0.2, 0, 1.5, -1.5, 0.7];
  const bone = leafBone(leafTwists);
  const chain = panel.splitTipForSegment(lock, 1, SPLITS_3LEAF, bone);
  assert.deepEqual(chain.twists, leafTwists, "无分组树时 twists 必须与叶子自身 authored 值逐字节相同");
});

// ---------------------------------------------------------------------------
// 4. 多层嵌套：L3 挂在 L2 下，L3 覆盖的叶子拿到 L2+L3 之和；只被 L2 覆盖的叶子只拿 L2。
// ---------------------------------------------------------------------------
test("多层嵌套：L3 覆盖的叶子 twists = 自身 + L2 + L3；只被 L2 覆盖的叶子只加 L2", () => {
  const { panel, lock } = harness(SPLITS_4LEAF);
  const l2Twists = zeros(MAIN_COUNT).map((_, i) => 10 + i);
  const l3Twists = zeros(MAIN_COUNT).map((_, i) => 100 + i);
  // root[0..3] -> leaf0[0..0] , L2[1..3](tip=l2Twists) -> leaf1[1..1], L3[2..3](tip=l3Twists) -> leaf2[2..2], leaf3[3..3]
  lock.panelBoneGroups = groupNode(0, 3, [
    leafNode(0, 0),
    groupNode(1, 3, [
      leafNode(1, 1),
      groupNode(2, 3, [leafNode(2, 2), leafNode(3, 3)], groupTip(l3Twists, MAIN_COUNT))
    ], groupTip(l2Twists, MAIN_COUNT))
  ]);
  const leaf1Own = zeros(MAIN_COUNT).map((_, i) => 1 * (i + 1));
  const leaf2Own = zeros(MAIN_COUNT).map((_, i) => 2 * (i + 1));
  const leaf3Own = zeros(MAIN_COUNT).map((_, i) => 3 * (i + 1));
  const chain1 = panel.splitTipForSegment(lock, 1, SPLITS_4LEAF, leafBone(leaf1Own));
  const chain2 = panel.splitTipForSegment(lock, 2, SPLITS_4LEAF, leafBone(leaf2Own));
  const chain3 = panel.splitTipForSegment(lock, 3, SPLITS_4LEAF, leafBone(leaf3Own));
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    assert.equal(chain1.twists[i], leaf1Own[i] + l2Twists[i], `叶子1第${i}点只应加 L2`);
    assert.equal(chain2.twists[i], leaf2Own[i] + l2Twists[i] + l3Twists[i], `叶子2第${i}点应加 L2+L3`);
    assert.equal(chain3.twists[i], leaf3Own[i] + l2Twists[i] + l3Twists[i], `叶子3第${i}点应加 L2+L3`);
  }
});

// ---------------------------------------------------------------------------
// 5. 容错：祖先 tip.twists 缺失/长度不符时贡献 0，不抛错。
// ---------------------------------------------------------------------------
test("容错：祖先 tip.twists 为 null 时贡献 0，不抛异常", () => {
  const { panel, lock } = harness(SPLITS_3LEAF);
  const leaf1Own = [1, 2, 3, 4, 5, 6];
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], groupTip(null, 2)) // twists 缺失
  ]);
  assert.doesNotThrow(() => panel.splitTipForSegment(lock, 1, SPLITS_3LEAF, leafBone(leaf1Own)));
  const chain = panel.splitTipForSegment(lock, 1, SPLITS_3LEAF, leafBone(leaf1Own));
  assert.deepEqual(chain.twists, leaf1Own, "祖先 twists 缺失时应贡献 0，等于叶子自身");
});

test("容错：祖先 tip.twists 长度与 mainCount 不符时贡献 0，不抛异常", () => {
  const { panel, lock } = harness(SPLITS_3LEAF);
  const leaf2Own = [10, 20, 30, 40, 50, 60];
  // 祖先 twists 长度为 3，mainCount 为 6 —— 长度不符。
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], groupTip([9, 9, 9], 2))
  ]);
  assert.doesNotThrow(() => panel.splitTipForSegment(lock, 2, SPLITS_3LEAF, leafBone(leaf2Own)));
  const chain = panel.splitTipForSegment(lock, 2, SPLITS_3LEAF, leafBone(leaf2Own));
  assert.deepEqual(chain.twists, leaf2Own, "祖先 twists 长度不符时应贡献 0，等于叶子自身");
});

