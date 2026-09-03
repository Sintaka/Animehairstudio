// panel-bone-groups-derive.test.mjs — panel 分叉分组树派生（modules/bones/panel-bone-groups.js）。
//
// 背景：panel（刘海发片）的叶子划分本身是扁平一层——N 条 zipper（lock.panelSplits）
// 切出 N+1 个平级叶子段，zipper i 分隔叶子 i 与 i+1，这一点完全不变。本文件测试的是
// 叠加在叶子划分之上的**分组树**：记录「哪条 zipper 在哪一层分隔」，供骨骼层级消费。
//
// 分组算法（由本轮真实档反推确认，见下方三条非钳位用例的逐层验证）：
// 对一个叶子区间，在其跨越的 zipper 中找**最小 height**；若最小值被多条 zipper 并列
// 达到，这些 zipper 全部在同一层生效，切成对应多个平级子区间（而不是二叉再递归）。
// 单一最小值则二叉切分、递归子区间。深度触顶（MAX_PANEL_BONE_DEPTH）时，剩余未切的
// zippers 不再增加 depth 字段，而是把区间内全部剩余叶子在触顶那一层拍平成兄弟，
// 触顶节点自身标 clampedFlat: true（其拍平出的子节点 depth 字段与它相同，但在树结构
// 里仍是它的 children——序列化时的缩进按结构嵌套走，不按 depth 字段走）。
//
// 四组真实档数据（来自 Scalp Conform Test 1/2/3.ahs、Sussurro_v1_0060.ahs 的 Front
// Bangs 3）覆盖「同层三兄弟」「嵌套位置≠height 全局排名」「恰好 L5 不触顶」三个易错
// 点；钳位路径四份真实档都没触发，第 4 组用严格递增高度合成覆盖。
import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PANEL_BONE_DEPTH,
  derivePanelBoneGroups,
  panelBoneGroupsLeafPartition
} from "../modules/bones/panel-bone-groups.js";

// heights 数组 -> zipper 数组。position 只需严格升序（供排序契约），取索引即可；
// 分组算法只看 height 与相对顺序，不看 position 的具体数值。
function zippersFromHeights(heights) {
  return heights.map((height, index) => ({ position: index, height, order: index }));
}

// 把分组树序列化成缩进字符串，一眼看出层级结构错在哪。
// 关键点：缩进按*结构嵌套*（parent -> children 的实际层数）走，depth 字段只用来打印
// 标签——这样 clampedFlat 拍平出的子节点（结构上更深一级、depth 字段却与父节点相同）
// 才能在快照里如实呈现「同一层拍平」而不是被误画成正常递归深了一层。
function serializeTree(node, level = 0, lines = []) {
  const indent = "  ".repeat(level);
  const flag = node.clampedFlat ? " <clampedFlat: true>" : "";
  lines.push(`${indent}L${node.depth} [${node.leafStart}..${node.leafEnd}]${flag}`);
  if (node.children) {
    for (const child of node.children) serializeTree(child, level + 1, lines);
  }
  return lines;
}

function treeString(root) {
  return serializeTree(root).join("\n");
}

function maxDepthOf(node) {
  if (!node.children) return node.depth;
  return Math.max(...node.children.map(maxDepthOf));
}

function anyClampedFlat(node) {
  if (node.clampedFlat) return true;
  if (!node.children) return false;
  return node.children.some(anyClampedFlat);
}

const CREATIVE_FIELDS = [
  "taperCurve",
  "taperCurveSecondary",
  "depthCurve",
  "depthCurveSecondary"
];

function assertCreativeFieldsNull(node, path = "root") {
  for (const field of CREATIVE_FIELDS) {
    assert.equal(node[field], null, `${path}.${field} 应为 null（分组节点不携带可创作字段）`);
  }
  if (node.children) {
    node.children.forEach((child, index) => assertCreativeFieldsNull(child, `${path}.children[${index}]`));
  }
}

function assertLeafPartitionInvariant(root, leafCount) {
  const expected = Array.from({ length: leafCount }, (_, index) => [index, index]);
  assert.deepEqual(panelBoneGroupsLeafPartition(root), expected, "叶子划分必须连续、无缝、恰好覆盖全部叶子");
}

test("MAX_PANEL_BONE_DEPTH 常量为 5", () => {
  assert.equal(MAX_PANEL_BONE_DEPTH, 5);
});

// === 用例 1：height 相同必须留同层（Scalp Conform Test 1/2.ahs 真实数据） ===
// 2 条 zipper、height 并列 0.3 → 最小值同时被两条 zipper 达到 → 根下三个平级叶子，
// 不能被误判成二叉再递归出的两层嵌套。
test("height 相同（2 条并列 0.3）→ 根下三个平级叶子，最大深度 L2", () => {
  const root = derivePanelBoneGroups(zippersFromHeights([0.3, 0.3]));
  const expected = ["L1 [0..2]", "  L2 [0..0]", "  L2 [1..1]", "  L2 [2..2]"].join("\n");
  assert.equal(treeString(root), expected);
  assert.equal(maxDepthOf(root), 2, "并列同层不得多算出一层嵌套深度");
  assert.equal(root.children.length, 3, "三个叶子必须是同一父节点下的三个平级兄弟");
  assert.equal(anyClampedFlat(root), false);
  assertLeafPartitionInvariant(root, 3);
  assertCreativeFieldsNull(root);
});

// === 用例 2：层级 = 嵌套位置，不是 height 全局排名（Sussurro_v1_0060.ahs Front Bangs 3） ===
// 4 条 zipper 的 height 全局排名是 [3, 0, 1, 2]（从小到大：0.125<0.1875<0.25<0.3125），
// 若实现误用「全局排名决定 depth」，会给出与真实档不同的错误结构。这条专门钳死
// 「深度由嵌套位置决定、每层只在其局部区间内比较 height」这一点。
test("层级由嵌套位置决定，不是 height 全局排名（4 条零高、5 叶子）", () => {
  const heights = [0.3125, 0.1875, 0.25, 0.125];
  const root = derivePanelBoneGroups(zippersFromHeights(heights));
  const expected = [
    "L1 [0..4]",
    "  L2 [0..3]",
    "    L3 [0..1]",
    "      L4 [0..0]",
    "      L4 [1..1]",
    "    L3 [2..3]",
    "      L4 [2..2]",
    "      L4 [3..3]",
    "  L2 [4..4]"
  ].join("\n");
  assert.equal(treeString(root), expected);
  assert.equal(maxDepthOf(root), 4, "最大深度必须恰好 L4（全局排名误算会给出不同深度或不同结构）");
  assert.equal(anyClampedFlat(root), false);
  assertLeafPartitionInvariant(root, 5);
  assertCreativeFieldsNull(root);
});

// === 用例 3：恰好 L5、不触发钳位（Scalp Conform Test 3.ahs 真实数据） ===
// 5 条 zipper、6 叶子，名义递归深度恰好落在 MAX_PANEL_BONE_DEPTH 上边界，验证「刚好
// 够用」时不会误触发钳位（钳位应只在超出 5 层才发生，见用例 4）。
test("5 条 zipper 递归恰好到 L5，不触发钳位", () => {
  const heights = [0.53125, 0.21875, 0.3125, 0.4375, 0.5];
  const root = derivePanelBoneGroups(zippersFromHeights(heights));
  const expected = [
    "L1 [0..5]",
    "  L2 [0..1]",
    "    L3 [0..0]",
    "    L3 [1..1]",
    "  L2 [2..5]",
    "    L3 [2..2]",
    "    L3 [3..5]",
    "      L4 [3..3]",
    "      L4 [4..5]",
    "        L5 [4..4]",
    "        L5 [5..5]"
  ].join("\n");
  assert.equal(treeString(root), expected);
  assert.equal(maxDepthOf(root), 5, "恰好触顶 L5，不多不少");
  assert.equal(anyClampedFlat(root), false, "恰好够用时不得误触发钳位");
  assertLeafPartitionInvariant(root, 6);
  assertCreativeFieldsNull(root);
});

// === 用例 4：钳位（合成——四份真实档都不触发这条路径） ===
// 6 条严格递增高度、7 叶子，名义递归深度是 7，超出 MAX_PANEL_BONE_DEPTH。触顶时
// 尾部三个叶子在 L5 拍平成兄弟，触顶节点自身带 clampedFlat: true。
test("严格递增高度超出 5 层 → 钳位触发，尾部在 L5 拍平三兄弟", () => {
  const heights = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  const root = derivePanelBoneGroups(zippersFromHeights(heights));
  const expected = [
    "L1 [0..6]",
    "  L2 [0..0]",
    "  L2 [1..6]",
    "    L3 [1..1]",
    "    L3 [2..6]",
    "      L4 [2..2]",
    "      L4 [3..6]",
    "        L5 [3..3]",
    "        L5 [4..6] <clampedFlat: true>",
    "          L5 [4..4]",
    "          L5 [5..5]",
    "          L5 [6..6]"
  ].join("\n");
  assert.equal(treeString(root), expected);
  assert.equal(maxDepthOf(root), 5, "钳位后最大深度不得超过 MAX_PANEL_BONE_DEPTH");
  assert.equal(anyClampedFlat(root), true, "名义 7 层必须触发钳位标记");
  // 钳位节点必须恰好命中 [4..6] 这一个区间，不是随便哪个节点。
  const clampedNode = (function find(node) {
    if (node.clampedFlat) return node;
    if (!node.children) return null;
    for (const child of node.children) {
      const found = find(child);
      if (found) return found;
    }
    return null;
  })(root);
  assert.ok(clampedNode, "必须能在树中找到带 clampedFlat 的节点");
  assert.deepEqual([clampedNode.leafStart, clampedNode.leafEnd], [4, 6]);
  assert.equal(clampedNode.children.length, 3, "钳位拍平出恰好 3 个叶子兄弟（不是二叉再分）");
  assertLeafPartitionInvariant(root, 7);
  assertCreativeFieldsNull(root);
});

// === 用例 5：边界——0 条 zipper（1 叶子） ===
test("0 条 zipper（1 叶子）→ 根即叶节点，children === null，深度 L1", () => {
  const root = derivePanelBoneGroups([]);
  assert.equal(root.depth, 1);
  assert.equal(root.leafStart, 0);
  assert.equal(root.leafEnd, 0);
  assert.equal(root.children, null, "唯一叶子时根节点本身就是叶节点");
  assert.equal(root.clampedFlat, undefined);
  assertLeafPartitionInvariant(root, 1);
  assertCreativeFieldsNull(root);
});

// === 用例 6：边界——1 条 zipper（2 叶子） ===
test("1 条 zipper（2 叶子）→ L2 两个平级兄弟", () => {
  const root = derivePanelBoneGroups(zippersFromHeights([0.4]));
  const expected = ["L1 [0..1]", "  L2 [0..0]", "  L2 [1..1]"].join("\n");
  assert.equal(treeString(root), expected);
  assert.equal(maxDepthOf(root), 2);
  assert.equal(root.children.length, 2);
  assertLeafPartitionInvariant(root, 2);
  assertCreativeFieldsNull(root);
});
