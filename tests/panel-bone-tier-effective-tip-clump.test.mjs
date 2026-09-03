// panel-bone-tier-effective-tip-clump.test.mjs — panel-tip-strand.js 的
// tierEffectiveTipClump（UI 用的中间层「有效 Tip Clump」聚合）。
//
// 背景：用户拍板 D1 —— tipClump 不做数据继承/层级共享，每个骨骼独立控制。此前的
// tipClumpDelta 逐层累加机制已整套删除（原覆盖此函数的
// tests/panel-bone-tip-clump-delta.test.mjs 已随之删除），tierEffectiveTipClump 收窄成
// 纯粹的「该层覆盖的各叶子自己 tipClump 的均值，clamp 到 [0, SPREAD_MAX]」。本文件只
// 覆盖这个收窄后的定义本身：均值计算、钳位、以及叶节点/空路径/非法路径返回 null 的边界。
import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { materializePanelBoneGroups, panelBoneGroupsFor, forEachPanelBoneGroup } from "../modules/bones/panel-bone-groups.js";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";

function makePanelHarness(splits, splitBones, points) {
  const panel = createPanelTipStrandApi({
    clonePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    normalizePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((p) => new THREE.Vector3(p.x, p.y, p.z))),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1)
    }),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    isPanelGeometry: () => true,
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    sculptState: { tipSelection: null, tipHover: null }
  });
  const lock = {
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: splits,
    width: 0.62, panelThickness: 0.08, panelCurvature: 0.18,
    panelLengthLoops: 10, panelWidthLoops: 6,
    taperCurve: [{ position: 0, value: 1, interpolation: "linear" }],
    taperCurveSecondary: [{ position: 0, value: 1, interpolation: "linear" }],
    points,
    splitBones
  };
  return { panel, lock };
}

const TWO_ZIPPER_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

test("tierEffectiveTipClump：均值——两叶 tipClump 不同（0.4/0.6），均值 0.5，非分辨力不足的常量", () => {
  const { panel, lock } = makePanelHarness(
    TWO_ZIPPER_SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  // path [1] 覆盖叶 1..2，tipClump 分别 0.4 / 0.6 —— 特意选不同的两个值，均值 0.5 才有
  // 分辨力（若代码不小心只取了叶 1 或叶 2 而不是真的求两者平均，会分别得到 0.4/0.6）。
  const value = panel.tierEffectiveTipClump(lock, [1]);
  assert.ok(Math.abs(value - 0.5) < 1e-9, `期望均值 0.5，实测 ${value}`);
  assert.notEqual(value, 0.4, "不能只取叶 1 自己的值");
  assert.notEqual(value, 0.6, "不能只取叶 2 自己的值");
});

test("tierEffectiveTipClump：钳位——叶子均值本身超过 SPREAD_MAX 时钳到 0.99", () => {
  const { panel, lock } = makePanelHarness(
    TWO_ZIPPER_SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 1.3 }, { tipClump: 1.5 }], // 均值 1.4，超界
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  const value = panel.tierEffectiveTipClump(lock, [1]);
  assert.equal(value, 0.99, `期望钳到 0.99（不是 1.4），实测 ${value}`);
});

test("tierEffectiveTipClump：叶节点/空路径/非法路径返回 null（不是「合并多叶」这回事）", () => {
  const { panel, lock } = makePanelHarness(
    TWO_ZIPPER_SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  assert.equal(panel.tierEffectiveTipClump(lock, [0]), null, "叶节点（leafStart===leafEnd）不该走这个函数");
  assert.equal(panel.tierEffectiveTipClump(lock, []), null, "空路径（根）同样不是真中间层");
  assert.equal(panel.tierEffectiveTipClump(lock, "not-an-array"), null, "非法 path 安全回落，不抛");
});

test("tierEffectiveTipClump：真实档边界值（0 与 0.928125）参与均值不越界", () => {
  // Sussurro Front Bangs 1 的真实 5 叶 tipClump：[0.928125, 0.78375, 0.845625, 0.6, 0]。
  const SUSSURRO_LEAF_TIPCLUMP = [0.928125, 0.7837500000000001, 0.8456250000000001, 0.6, 0];
  const splits = [
    { position: -0.5, height: 0.6, order: 0 },
    { position: 0, height: 0.5, order: 1 },
    { position: 0.3, height: 0.4, order: 2 },
    { position: 0.6, height: 0.3, order: 3 }
  ];
  const { panel, lock } = makePanelHarness(
    splits,
    SUSSURRO_LEAF_TIPCLUMP.map((v) => ({ tipClump: v })),
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  const root = panelBoneGroupsFor(lock);
  let path = null;
  forEachPanelBoneGroup(root, (n, p) => {
    if (path || !Array.isArray(n.children) || p.length === 0) return;
    if (n.leafStart === 0 && n.leafEnd > n.leafStart) { path = p; }
  });
  assert.ok(path, "fixture 必须有一个覆盖叶 0 的中间层，否则本测试无法验证");
  const value = panel.tierEffectiveTipClump(lock, path);
  assert.ok(value >= 0 && value <= 0.99, `均值必须落在 [0, 0.99] 内，实测 ${value}`);
  assert.ok(value > 0.4, `含 0.928125 的均值应该偏高，实测 ${value}`);
});
