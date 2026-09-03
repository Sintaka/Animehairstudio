// panel-bone-materialize.test.mjs — 覆盖 panel-bone-groups.js 的物化 / 按路径创作
// 三件套：materializePanelBoneGroups / setPanelBoneGroupValue /
// panelBoneGroupEffectiveValue / panelBoneGroupHasOwnValue。
//
// 真实数字来自 .tmp-bone-tree/archives/ 的两份真档（已 gitignore，只读）：
// - Test 1「Side Bangs Left 1」：2 条 zipper，height [0.3, 0.3] ⇒ 根下三个平级 L2。
// - Test 3「Front Bangs 1」：5 条 zipper，height 按 position 序
//   [0.53125, 0.21875, 0.3125, 0.4375, 0.5] ⇒ maxDepth 恰好 5。
import assert from "node:assert/strict";
import test from "node:test";

import {
  derivePanelBoneGroups,
  forEachPanelBoneGroup,
  materializePanelBoneGroups,
  panelBoneGroupAtPath,
  panelBoneGroupEffectiveValue,
  panelBoneGroupHasOwnValue,
  panelBoneGroupsFor,
  panelBoneGroupsLeafPartition,
  setPanelBoneGroupValue
} from "../modules/bones/panel-bone-groups.js";

// Test 1 的真实 panelSplits（height 相同 ⇒ 三个平级 L2 兄弟）。
const TEST1_SPLITS = [
  { height: 0.3, position: -0.3333333333333333 },
  { height: 0.3, position: 0.3333333333333333 }
];

// Test 3 的真实 panelSplits（按 position 升序排列，height 依次对应）。
const TEST3_SPLITS = [
  { height: 0.53125, position: -0.33 },
  { height: 0.21875, position: -0.28 },
  { height: 0.3125, position: -0.1466666666666666 },
  { height: 0.4375, position: 0.18333333333333324 },
  { height: 0.5, position: 0.2933333333333333 }
];

function makeLock(splits) {
  return { panelSplits: splits.map((s) => ({ ...s })) };
}

function maxDepthOf(root) {
  let max = 0;
  forEachPanelBoneGroup(root, (node) => {
    if (node.depth > max) max = node.depth;
  });
  return max;
}

// 先用真实数字锚定派生形状本身没变——这是后面所有断言的地基，如果这里就错了，
// 后面测的就不是本任务要测的东西。
test("真实档基线：Test1 派生成三个平级 L2，Test3 maxDepth 恰好 5", () => {
  const root1 = derivePanelBoneGroups(TEST1_SPLITS);
  assert.equal(root1.children.length, 3);
  assert.ok(root1.children.every((child) => child.depth === 2));
  assert.deepEqual(panelBoneGroupsLeafPartition(root1), [[0, 0], [1, 1], [2, 2]]);

  const root3 = derivePanelBoneGroups(TEST3_SPLITS);
  assert.equal(maxDepthOf(root3), 5);
  assert.deepEqual(panelBoneGroupsLeafPartition(root3), [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]);
});

test("物化前 panelBoneGroups 是 undefined，物化后写入且树形与派生结果深相等", () => {
  const lock = makeLock(TEST3_SPLITS);
  const before = panelBoneGroupsFor(lock); // 物化前的「有效树」（临时对象，不写回）
  assert.equal(lock.panelBoneGroups, undefined);

  const materialized = materializePanelBoneGroups(lock);

  assert.notEqual(lock.panelBoneGroups, undefined);
  assert.deepEqual(materialized, before); // 物化不改变形状
  assert.equal(materialized, lock.panelBoneGroups); // 返回值就是写进 lock 的那棵树
});

test("lock 为 null 或无 panelSplits ⇒ materializePanelBoneGroups 返回 null 且不写字段", () => {
  assert.equal(materializePanelBoneGroups(null), null);

  const noPanel = { name: "not a panel lock" };
  assert.equal(materializePanelBoneGroups(noPanel), null);
  assert.equal("panelBoneGroups" in noPanel, false);
});

test("物化幂等：已创作的字段在第二次物化后仍在", () => {
  const lock = makeLock(TEST1_SPLITS);
  materializePanelBoneGroups(lock);
  setPanelBoneGroupValue(lock, [0], "taperCurve", "authored-curve-A");

  materializePanelBoneGroups(lock); // 第二次物化：不得覆盖上面写的创作值

  const node0 = panelBoneGroupAtPath(lock.panelBoneGroups, [0]);
  assert.equal(node0.taperCurve, "authored-curve-A");
});

test("setPanelBoneGroupValue 只改目标节点自己，绝不递归写子孙（本任务最重要的断言）", () => {
  const lock = makeLock(TEST3_SPLITS);
  materializePanelBoneGroups(lock);

  // 根的第 0 个子节点（L2）内部还有更深的子孙——先在其中一个子孙上放一个「自己的」创作值。
  const root = lock.panelBoneGroups;
  const targetPath = [0]; // 要编辑的分组节点
  const parentNode = panelBoneGroupAtPath(root, targetPath);
  assert.ok(Array.isArray(parentNode.children), "Test3 的 [0] 节点必须有子孙才能验证不递归");

  const grandchildWithOwnValuePath = [0, 0];
  const grandchildNullPath = [0, 1];
  const grandchildWithOwn = panelBoneGroupAtPath(root, grandchildWithOwnValuePath);
  const grandchildNull = panelBoneGroupAtPath(root, grandchildNullPath);
  assert.ok(grandchildWithOwn, "路径 [0,0] 必须存在");
  assert.ok(grandchildNull, "路径 [0,1] 必须存在");

  // 子孙 A 自己已经创作过 —— 父节点被编辑后，这个值必须原样保留。
  setPanelBoneGroupValue(lock, grandchildWithOwnValuePath, "taperCurve", "own-value-untouched");
  // 子孙 B 保持 null —— 父节点被编辑后，读取期应经 resolve 回落到父节点的新值。
  assert.equal(grandchildNull.taperCurve, null);

  setPanelBoneGroupValue(lock, targetPath, "taperCurve", "parent-authored-value");

  // 断言 1：子孙 A 自己的值完全没变（没有被父节点的写入递归覆盖）。
  const grandchildWithOwnAfter = panelBoneGroupAtPath(lock.panelBoneGroups, grandchildWithOwnValuePath);
  assert.equal(grandchildWithOwnAfter.taperCurve, "own-value-untouched");

  // 断言 2：父节点自己的字段确实被写了。
  const parentAfter = panelBoneGroupAtPath(lock.panelBoneGroups, targetPath);
  assert.equal(parentAfter.taperCurve, "parent-authored-value");

  // 断言 3：子孙 B（自己是 null）在树上原始字段仍是 null —— 写入期没有 touch 它。
  const grandchildNullAfter = panelBoneGroupAtPath(lock.panelBoneGroups, grandchildNullPath);
  assert.equal(grandchildNullAfter.taperCurve, null);

  // 断言 4：但读取期通过 effective value 会看到父节点的新值（沿链回落是读取期的事）。
  const effective = panelBoneGroupEffectiveValue(lock, grandchildNullPath, "taperCurve", "fallback");
  assert.equal(effective, "parent-authored-value");
});

test("写 null 清除创作：hasOwnValue 变 false，有效值回落到祖先/fallback", () => {
  const lock = makeLock(TEST1_SPLITS);
  materializePanelBoneGroups(lock);

  setPanelBoneGroupValue(lock, [], "depthCurve", 0.75); // 根节点上先创作一个值
  setPanelBoneGroupValue(lock, [0], "depthCurve", 0.2); // 目标节点自己也创作一个值
  assert.equal(panelBoneGroupHasOwnValue(lock, [0], "depthCurve"), true);
  assert.equal(panelBoneGroupEffectiveValue(lock, [0], "depthCurve", "fallback"), 0.2);

  setPanelBoneGroupValue(lock, [0], "depthCurve", null); // 清除

  assert.equal(panelBoneGroupHasOwnValue(lock, [0], "depthCurve"), false);
  // 回落到根节点的 0.75（不是 fallback，因为根节点仍有创作值）。
  assert.equal(panelBoneGroupEffectiveValue(lock, [0], "depthCurve", "fallback"), 0.75);
});

test("0 是合法创作值：hasOwnValue 为 true，effective value 拿到 0 本身", () => {
  const lock = makeLock(TEST1_SPLITS);
  materializePanelBoneGroups(lock);

  setPanelBoneGroupValue(lock, [], "depthCurve", 5); // 祖先先给个非零值，防止「找不到就返回 undefined」这种假阳性
  setPanelBoneGroupValue(lock, [1], "depthCurve", 0);

  assert.equal(panelBoneGroupHasOwnValue(lock, [1], "depthCurve"), true);
  assert.equal(panelBoneGroupEffectiveValue(lock, [1], "depthCurve", "fallback"), 0);
});

test("非法输入：白名单外的 key / 越界 path / null lock 均返回 null，不抛异常、不留垃圾字段", () => {
  const lock = makeLock(TEST1_SPLITS);

  assert.doesNotThrow(() => {
    assert.equal(setPanelBoneGroupValue(lock, [0], "notARealKey", 1), null);
    assert.equal(setPanelBoneGroupValue(lock, [99], "depthCurve", 1), null);
    assert.equal(setPanelBoneGroupValue(null, [0], "depthCurve", 1), null);
    assert.equal(setPanelBoneGroupValue(lock, "not-an-array", "depthCurve", 1), null);
  });

  // 非法 key 的调用不应该在真实存在的节点上留下垃圾字段。
  const root = materializePanelBoneGroups(lock);
  const node0 = panelBoneGroupAtPath(root, [0]);
  assert.equal("notARealKey" in node0, false);

  assert.equal(panelBoneGroupHasOwnValue(lock, [0], "notARealKey"), false);
  assert.equal(panelBoneGroupHasOwnValue(null, [0], "depthCurve"), false);
});

test("叶子划分不变量：物化 + 写值 + 清除后，叶子划分与 panelSplits 数值都没变", () => {
  const lock = makeLock(TEST3_SPLITS);
  const splitsSnapshot = lock.panelSplits.map((s) => ({ ...s }));
  const partitionBefore = panelBoneGroupsLeafPartition(panelBoneGroupsFor(lock));

  materializePanelBoneGroups(lock);
  setPanelBoneGroupValue(lock, [0], "taperCurve", "x");
  setPanelBoneGroupValue(lock, [0, 0], "depthCurve", 0);
  setPanelBoneGroupValue(lock, [0], "taperCurve", null);

  const partitionAfter = panelBoneGroupsLeafPartition(lock.panelBoneGroups);
  assert.deepEqual(partitionAfter, partitionBefore);
  assert.deepEqual(partitionAfter, [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]);
  assert.deepEqual(lock.panelSplits, splitsSnapshot); // position/height/order 一个都没变
});
