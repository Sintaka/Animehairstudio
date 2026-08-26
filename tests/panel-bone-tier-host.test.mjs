// panel-bone-tier-host.test.mjs — resolveTipHost 中间层接线（tip-sub-bone-host.js 本轮新增
// 的 groupPath / tierSpan 分支）的回归测试。
//
// 背景（用户原话）：「现在只能落在最尖端或者主发丝, 不能落在中间层并修改中间层走向,
// 这一轮完成中间层接线」。resolveTipHost 是发尖子骨骼「选择/把手/gizmo/笔刷」四条路径
// 唯一的分派点（bone-view-handles.js 与 bone-interaction.js 各自 import 后构造）。本文件
// 只测新增的 groupPath 分支本身（不依赖 three.js 视口代码），两个消费方的接线留给
// 端到端场景（本轮不改它们，只改 tip-sub-bone-host.js）。
//
// 真实数字取自「Scalp Conform Test 4.ahs」的 Front Bangs 1（与 tests/panel-tip-span-chain
// .test.mjs、tests/panel-bone-tip-carrier.test.mjs 同一份，已在阶段 1.5/0.2.157/0.2.159 验证
// 过树形状与几何推导）：2 条 zipper，height [0.3, 0.4] ⇒ 3 个叶子，派生树
// L1[0..2] -> L2[0..0] + L2[1..2] -> L3[1..1] + L3[2..2]。groupPath [1] 命中
// L2[1..2]（覆盖 2 个叶子的真中间层，就是用户原话里的 "L2.Segments 2-3"）；
// groupPath [0] 命中 L2[0..0]（单叶子，必须退化等价）。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createTipSubBoneHostApi } from "../modules/bones/tip-sub-bone-host.js";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import * as THREE from "three";

const REAL_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

function cloneSplits(value) {
  return Array.isArray(value) ? value.map((split) => ({ ...split })) : [];
}

function makeHostApi() {
  const panelTipStrand = createPanelTipStrandApi({
    clonePanelSplits: cloneSplits,
    normalizePanelSplits: cloneSplits,
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
  return createTipSubBoneHostApi({
    panelTipStrand,
    clonePanelSplits: cloneSplits,
    currentStrandSplitTipChains: () => null,
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
    ),
    strandGeometryFrameAt: () => ({ z: new THREE.Vector3(0, 0, 1) })
  });
}

function makePanelLock() {
  return {
    id: "L",
    geometryType: "panel",
    panelSplitEnabled: true,
    panelSplits: cloneSplits(REAL_SPLITS),
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
}

// ── 1) 不传 groupPath：既有行为逐字节不变 ────────────────────────────────────────────
test("不传 groupPath：resolveTipHost 返回值与本轮之前逐字节相同（无 tierSpan 分支介入）", () => {
  const { resolveTipHost } = makeHostApi();
  const lock = makePanelLock();
  const host = resolveTipHost(lock, { materialize: false });
  assert.ok(host, "panel lock 必须解析出宿主");
  assert.equal(host.segmentCount, 3, "3 个叶子段");
  assert.equal(host.bones.length, 3);
  // 三个段各自独立：不应有任何两个 bone 引用相同（既有叶子段各管各的）。
  assert.notEqual(host.bones[0], host.bones[1]);
  assert.notEqual(host.bones[1], host.bones[2]);
  assert.equal(host.tierSpan, undefined, "未命中中间层时不应带 tierSpan 字段");
});

// ── 2) 退化路径（叶子节点）：与不传 groupPath 逐字节等价 ──────────────────────────────
test("groupPath 指向单叶子节点（退化）：tipChainFor/forkTFor/bones 与不传 groupPath 逐字节相同", () => {
  const { resolveTipHost } = makeHostApi();
  const lockA = makePanelLock();
  const lockB = makePanelLock();
  const hostNoPath = resolveTipHost(lockA, { materialize: false });
  const hostLeafPath = resolveTipHost(lockB, { materialize: false, groupPath: [0] }); // L2[0..0]

  assert.equal(hostLeafPath.tierSpan, undefined, "叶子节点退化：resolvePanelTierSpan 必须返回 null，不产生 tierSpan");
  for (let segment = 0; segment < 3; segment += 1) {
    assert.deepEqual(
      hostLeafPath.tipChainFor(segment), hostNoPath.tipChainFor(segment),
      `段 ${segment} 的发尖链必须与不传 groupPath 时逐字节相同`
    );
    assert.equal(
      hostLeafPath.forkTFor(segment), hostNoPath.forkTFor(segment),
      `段 ${segment} 的 forkT 必须与不传 groupPath 时相同`
    );
  }
});

// ── 3) 真中间层命中：把手显示（tipChainFor）与拖拽写回（bones 引用）同源 ────────────────
test("groupPath 命中真中间层 L2[1..2]：覆盖的两个叶子段共享同一个 bone 引用与同一条发尖链", () => {
  const { resolveTipHost } = makeHostApi();
  const lock = makePanelLock();
  const host = resolveTipHost(lock, { materialize: true, groupPath: [1] }); // L2[1..2]

  assert.deepEqual(host.tierSpan, { leafStart: 1, leafEnd: 2 });
  // 「同一个引用」是把手显示与拖拽写回自动同源的根本原因（见 tip-sub-bone-host.js
  // panelTierHost 的函数头注释）：覆盖段 1、2 的 bone 必须是同一个对象，segment 0
  // 不受影响、保留自己独立的 bone。
  assert.equal(host.bones[1], host.bones[2], "覆盖段 1、2 必须共享同一个 tierBone 引用");
  assert.notEqual(host.bones[0], host.bones[1], "未覆盖的段 0 不应被 tierBone 顶替");

  // tipChainFor 对两个覆盖段返回的链必须逐字节相同（同一次 splitTipForLeafSpan 调用的
  // 结果，不是分别调用两次凑巧相等）。
  const chainAt1 = host.tipChainFor(1);
  const chainAt2 = host.tipChainFor(2);
  assert.ok(chainAt1, "覆盖段必须产出发尖链");
  assert.deepEqual(chainAt1, chainAt2, "同一 tierSpan 内的两个段必须拿到同一条链");

  // forkTFor 同样对两个覆盖段返回相同值（合成 splits + 虚拟 vIdx 的边界，而不是各自叶子
  // 自己的边界）。
  assert.equal(host.forkTFor(1), host.forkTFor(2), "同一 tierSpan 内的两个段 forkT 必须相同");
});

// ── 4) 写回验证：往 bones[segment] 写 tip，任意覆盖段都能读到同一份写入 ─────────────────
test("写回同源：对 bones[1] 写 tip 后，tipChainFor(1) 与 tipChainFor(2) 都反映这次写入", () => {
  const { resolveTipHost } = makeHostApi();
  const lock = makePanelLock();
  const host = resolveTipHost(lock, { materialize: true, groupPath: [1] });

  const rest = host.tipChainFor(1).restPoints;
  const mainCount = rest.length;
  // 模拟 bone-interaction.js 的 writeTipEdit：把尖端点往 +x 移 0.3。
  const authoredPoints = rest.map((p, index) => (
    index === mainCount - 1 ? { x: p.x + 0.3, y: p.y, z: p.z } : { x: p.x, y: p.y, z: p.z }
  ));
  host.bones[1].tip = {
    points: authoredPoints,
    restPoints: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    active: true
  };

  const chainAt1 = host.tipChainFor(1);
  const chainAt2 = host.tipChainFor(2);
  assert.deepEqual(chainAt1, chainAt2, "写入 bones[1] 后，两个覆盖段读到的链仍必须逐字节相同");
  const tipDeltaX = chainAt2.points[mainCount - 1].x - chainAt2.restPoints[mainCount - 1].x;
  assert.ok(Math.abs(tipDeltaX - 0.3) < 1e-9, "段 2（未直接写入的那个覆盖段）必须也读到 0.3 的偏移");

  // 未覆盖的段 0 不受影响：仍是未创作状态（points === restPoints）。
  const chainAt0 = host.tipChainFor(0);
  chainAt0.points.forEach((p, index) => {
    const r = chainAt0.restPoints[index];
    assert.equal(p.x, r.x, "段 0 不应被段 1 的写入波及");
  });
});

// ── 5) 只读路径（materialize: false）：不脏 lock，仍能读到已创作的分组 tip ──────────────
test("只读放置路径：materialize=false 时不物化 lock，但仍读到已创作的中间层 tip", () => {
  const { resolveTipHost } = makeHostApi();
  const lock = makePanelLock();
  // 先用编辑路径写一次，再用只读路径验证能读到。
  const editHost = resolveTipHost(lock, { materialize: true, groupPath: [1] });
  const rest = editHost.tipChainFor(1).restPoints;
  editHost.bones[1].tip = {
    points: rest.map((p, index) => (index === 0 ? { x: p.x + 0.1, y: p.y, z: p.z } : { x: p.x, y: p.y, z: p.z })),
    restPoints: rest.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    active: true
  };
  const beforeReadOnly = JSON.stringify(lock);

  const readHost = resolveTipHost(lock, { materialize: false, groupPath: [1] });
  const chain = readHost.tipChainFor(1);
  assert.ok(Math.abs(chain.points[0].x - chain.restPoints[0].x - 0.1) < 1e-9, "只读路径必须读到已创作的偏移");
  assert.equal(JSON.stringify(lock), beforeReadOnly, "materialize=false 不得修改 lock");
});

// ── 6) groupPath=[]（根路径）：不产生 tierSpan，视为"没有选中中间层" ───────────────────
test("groupPath=[]（根路径）：视为没有选中中间层，行为与不传 groupPath 相同", () => {
  const { resolveTipHost } = makeHostApi();
  const lock = makePanelLock();
  const host = resolveTipHost(lock, { materialize: false, groupPath: [] });
  assert.equal(host.tierSpan, undefined, "空路径不应产生 tierSpan（根节点是主骨骼本身，不是分组）");
});

// ── 7) 发丝几何：groupPath 被忽略，行为不受影响 ──────────────────────────────────────
test("发丝几何：groupPath 对发丝分支无效（发丝没有分组树，传了也不受影响）", () => {
  const { resolveTipHost } = makeHostApi();
  const lock = {
    id: "S",
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [{ position: 0, height: 0.3 }],
    strandSplitBones: null,
    points: Array.from({ length: 6 }, (_, index) => ({ x: 0, y: 1.7 - index * 0.25, z: 0 }))
  };
  const hostNoPath = resolveTipHost(lock, { materialize: false });
  const hostWithPath = resolveTipHost(lock, { materialize: false, groupPath: [1] });
  assert.ok(hostNoPath, "发丝 lock 必须解析出宿主");
  assert.equal(hostWithPath.kind, "strand");
  assert.equal(hostWithPath.tierSpan, undefined, "发丝分支不应产生 tierSpan");
  assert.equal(hostWithPath.segmentCount, hostNoPath.segmentCount);
});

// ── 8) 源码级契约：中文注释里承诺的两个关键点确实存在，防止后续重构悄悄丢掉 ─────────────
const source = readFileSync(new URL("../modules/bones/tip-sub-bone-host.js", import.meta.url), "utf8");

test("源码契约：resolvePanelTierSpan 对退化（leafStart===leafEnd）显式返回 null", () => {
  assert.match(
    source, /if \(!span \|\| span\.leafStart === span\.leafEnd\) return null;/,
    "退化判据必须存在，否则叶子节点会被误判成中间层"
  );
});

test("源码契约：panelTierHost 的 bones 数组对覆盖段写入同一个 tierBone 引用（不是深拷贝）", () => {
  assert.match(
    source, /bones: bones\.map\(\(bone, segment\) => \(coversSegment\(segment\) \? tierBone : bone\)\)/,
    "覆盖段必须指向同一个 tierBone 引用，这是把手显示与拖拽写回自动同源的根本原因"
  );
});
