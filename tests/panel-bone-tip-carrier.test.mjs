// panel-bone-tip-carrier.test.mjs — 中间层骨骼载体（tip / leafSpan / tierNodes）测试。
//
// 用户实测场景：outliner 选中 `L2.Segments 2-3`（覆盖 2 个叶子的中间层分组）时笔刷刷到了
// 主发片上，因为中间层在几何上不存在。这一批新导出让分组节点能承载「自己的发尖链」，
// 本文件只测数据层（panel-bone-groups.js），几何生成由另一个子智能体负责。
//
// 真实数字来自 .tmp-bone-tree/archives/ 的两份真档（已 gitignore，只读，用 python 读取过）：
// - 「Scalp Conform Test 4.ahs」的 `Front Bangs 1`：2 条 zipper，heights 按 position 序
//   [0.3, 0.4] ⇒ 派生树 L1[0..2] -> L2[0..0] + L2[1..2] -> L3[1..1] + L3[2..2]。
//   这正是用户场景里的那棵树，作为本文件的主要用例。
// - 「Scalp Conform Test 1.ahs」的 `Side Bangs Left 1`：heights [0.3, 0.3] ⇒ 根下三个平级 L2。
import assert from "node:assert/strict";
import test from "node:test";

import {
  clearPanelBoneGroupTip,
  materializePanelBoneGroups,
  normalizePanelBoneGroups,
  panelBoneGroupAtPath,
  panelBoneGroupLeafSpan,
  panelBoneGroupsFor,
  panelBoneGroupsLeafPartition,
  panelBoneGroupTierNodes,
  panelBoneGroupTip,
  setPanelBoneGroupTip
} from "../modules/bones/panel-bone-groups.js";

// Test 4「Front Bangs 1」的真实 panelSplits：2 条 zipper，position 升序，height [0.3, 0.4]。
const TEST4_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// Test 1「Side Bangs Left 1」的真实 panelSplits：height 相同 ⇒ 三个平级 L2。
const TEST1_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.3333333333333333, height: 0.3, order: 1 }
];

function makeLock(splits) {
  return { panelSplits: splits.map((s) => ({ ...s })) };
}

// 一条形状合法的示例发尖链（3 个主链点），供往返 / 幂等 / 局部降级测试复用。
function sampleTip() {
  return {
    points: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0.1, y: 2, z: 0 }],
    restPoints: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 2, z: 0 }],
    twists: [0, 0, 0],
    active: true
  };
}

// ── 1) panelBoneGroupLeafSpan ───────────────────────────────────────────────────────
test("panelBoneGroupLeafSpan：Test4 树的四个路径，含非法路径返回 null", () => {
  const lock = makeLock(TEST4_SPLITS);
  assert.deepEqual(panelBoneGroupLeafSpan(lock, []), { leafStart: 0, leafEnd: 2 });
  assert.deepEqual(panelBoneGroupLeafSpan(lock, [1]), { leafStart: 1, leafEnd: 2 });
  assert.deepEqual(panelBoneGroupLeafSpan(lock, [1, 0]), { leafStart: 1, leafEnd: 1 });
  assert.equal(panelBoneGroupLeafSpan(lock, [9]), null, "非法路径必须返回 null，不能抛异常");
});

// ── 2) panelBoneGroupTierNodes ──────────────────────────────────────────────────────
test("panelBoneGroupTierNodes：Test4 树上 [1] 与 [1,0] 两个例子，长度+区间+depth 逐个断言", () => {
  const lock = makeLock(TEST4_SPLITS);
  const spanOf = (n) => ({ leafStart: n.leafStart, leafEnd: n.leafEnd, depth: n.depth });

  // path=[1] -> L2 这一层的两个兄弟：L2[0..0] 与 L2[1..2]。
  const tierAtL2 = panelBoneGroupTierNodes(lock, [1]);
  assert.equal(tierAtL2.length, 2);
  assert.deepEqual(tierAtL2.map(spanOf), [
    { leafStart: 0, leafEnd: 0, depth: 2 },
    { leafStart: 1, leafEnd: 2, depth: 2 }
  ]);

  // path=[1,0] -> L3 这一层的两个兄弟：L3[1..1] 与 L3[2..2]。
  const tierAtL3 = panelBoneGroupTierNodes(lock, [1, 0]);
  assert.equal(tierAtL3.length, 2);
  assert.deepEqual(tierAtL3.map(spanOf), [
    { leafStart: 1, leafEnd: 1, depth: 3 },
    { leafStart: 2, leafEnd: 2, depth: 3 }
  ]);
});

test("panelBoneGroupTierNodes：Test1 树上根下三个平级 L2 兄弟", () => {
  const lock = makeLock(TEST1_SPLITS);
  const tier = panelBoneGroupTierNodes(lock, [0]);
  assert.equal(tier.length, 3);
  assert.deepEqual(tier.map((n) => [n.leafStart, n.leafEnd, n.depth]), [
    [0, 0, 2],
    [1, 1, 2],
    [2, 2, 2]
  ]);
});

test("panelBoneGroupTierNodes：path=[] （根）返回 null，含义是「显示主骨骼」", () => {
  const lock = makeLock(TEST4_SPLITS);
  assert.equal(panelBoneGroupTierNodes(lock, []), null);
  assert.equal(panelBoneGroupTierNodes(lock, null), null);
});

// ── 3) setPanelBoneGroupTip / panelBoneGroupTip 往返 ────────────────────────────────
test("setPanelBoneGroupTip / panelBoneGroupTip：写进去再读出来内容相同（深比较）", () => {
  const lock = makeLock(TEST4_SPLITS);
  const tip = sampleTip();
  const root = setPanelBoneGroupTip(lock, [1], tip);
  assert.notEqual(root, null);
  const readBack = panelBoneGroupTip(lock, [1]);
  assert.deepEqual(readBack, tip, "写入与读出的 tip 内容必须深相等");
});

// ── 4) 只写这一层：tip 不回落、不递归 ────────────────────────────────────────────────
test("setPanelBoneGroupTip 只写目标层，子孙节点的 tip 仍为 null（不回落、不递归）", () => {
  const lock = makeLock(TEST4_SPLITS);
  setPanelBoneGroupTip(lock, [1], sampleTip());
  assert.equal(panelBoneGroupTip(lock, [1, 0]), null, "子孙 [1,0] 不应继承祖先 [1] 写入的 tip");
  assert.equal(panelBoneGroupTip(lock, [1, 1]), null, "子孙 [1,1] 不应继承祖先 [1] 写入的 tip");
});

// ── 5) clearPanelBoneGroupTip：只清这一层，其它层不受影响 ───────────────────────────
test("clearPanelBoneGroupTip：清除该层 tip，其它层的 tip 不受影响", () => {
  const lock = makeLock(TEST4_SPLITS);
  const tipAtRoot = sampleTip();
  const tipAtL2 = { ...sampleTip(), twists: [1, 1, 1] };
  setPanelBoneGroupTip(lock, [], tipAtRoot);
  setPanelBoneGroupTip(lock, [1], tipAtL2);

  clearPanelBoneGroupTip(lock, [1]);

  assert.equal(panelBoneGroupTip(lock, [1]), null, "目标层 [1] 的 tip 必须被清空");
  assert.deepEqual(panelBoneGroupTip(lock, []), tipAtRoot, "根层 [] 的 tip 不应受影响");
});

// ── 6) 归一化局部降级 ────────────────────────────────────────────────────────────────
test("normalizePanelBoneGroups：points/restPoints 长度不等 ⇒ 该节点 tip 降级为 null，其余部分完好", () => {
  const leafCount = TEST4_SPLITS.length + 1; // 3
  const derived = panelBoneGroupsFor(makeLock(TEST4_SPLITS));
  // 手工构造：给根节点塞一条形状非法的 tip（points 3 个点，restPoints 只有 2 个）。
  const raw = JSON.parse(JSON.stringify(derived));
  raw.tip = { points: sampleTip().points, restPoints: sampleTip().restPoints.slice(0, 2), twists: [0, 0, 0], active: true };

  const normalized = normalizePanelBoneGroups(raw, leafCount);
  assert.notEqual(normalized, null, "整棵树不应因为一层的 tip 非法而被判非法");
  assert.equal(normalized.tip, null, "形状非法的 tip 必须被降级为 null");
  assert.deepEqual(
    panelBoneGroupsLeafPartition(normalized),
    panelBoneGroupsLeafPartition(derived),
    "叶子划分必须完好，不受 tip 非法的影响"
  );
});

// ── 7) 物化幂等 ──────────────────────────────────────────────────────────────────────
test("materializePanelBoneGroups 幂等：写 tip 后再物化一次，tip 仍在且内容不变", () => {
  const lock = makeLock(TEST4_SPLITS);
  const tip = sampleTip();
  setPanelBoneGroupTip(lock, [1], tip);

  const before = panelBoneGroupTip(lock, [1]);
  materializePanelBoneGroups(lock);
  const after = panelBoneGroupTip(lock, [1]);

  assert.deepEqual(after, before, "再次物化不应改变已经写入的 tip 内容");
  assert.deepEqual(after, tip, "内容必须仍与最初写入的一致");
});

// ── 8) 叶子划分不变量 ────────────────────────────────────────────────────────────────
test("以上任何 tip 操作后，叶子划分恒为 [[0,0],[1,1],[2,2]]，panelSplits 一个字段都没变", () => {
  const lock = makeLock(TEST4_SPLITS);
  const splitsBefore = JSON.stringify(lock.panelSplits);

  setPanelBoneGroupTip(lock, [1], sampleTip());
  setPanelBoneGroupTip(lock, [1, 0], sampleTip());
  clearPanelBoneGroupTip(lock, [1, 0]);
  materializePanelBoneGroups(lock);

  const root = panelBoneGroupsFor(lock);
  assert.deepEqual(panelBoneGroupsLeafPartition(root), [[0, 0], [1, 1], [2, 2]]);
  assert.equal(JSON.stringify(lock.panelSplits), splitsBefore, "panelSplits 的 position/height/order 一个都不应变");
});

// ── 9) 只读函数不修改入参 ────────────────────────────────────────────────────────────
test("panelBoneGroupTip / panelBoneGroupLeafSpan / panelBoneGroupTierNodes 不原地修改 lock", () => {
  const lock = makeLock(TEST4_SPLITS);
  setPanelBoneGroupTip(lock, [1], sampleTip()); // 先物化一份带 tip 的真实数据，让只读调用有东西可读
  const before = JSON.stringify(lock);

  panelBoneGroupTip(lock, [1]);
  panelBoneGroupTip(lock, [1, 0]);
  panelBoneGroupLeafSpan(lock, [1]);
  panelBoneGroupLeafSpan(lock, []);
  panelBoneGroupTierNodes(lock, [1]);
  panelBoneGroupTierNodes(lock, [1, 0]);

  assert.equal(JSON.stringify(lock), before, "三个只读函数调用前后 lock 的序列化结果必须完全相同");
});
