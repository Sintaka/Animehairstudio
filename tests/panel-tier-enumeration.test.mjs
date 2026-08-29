// panel-tier-enumeration.test.mjs — panelTierEnumeration（modules/bones/panel-bone-groups.js）。
//
// 背景：Segment 步进器（segment-control.js 的 stepSegment）改走「分组树枚举表」而不是
// 叶子数组下标，这样才能停在中间层（如 L2·Segments 2-3）而不是只在叶子之间跳。
// resolveSegmentSelection 的 {index, count} 语义**刻意保持叶子口径不变**（前一版方案想改
// 成枚举表行号已被否决，见 modules/bones/segment-control.js stepSegment 处的注释）。
//
// 顺序必须与 outliner 渲染顺序一致：outliner 走 createOutlinerPanelBoneGroups →
// createPanelBoneGroupRow 的递归前序（父先于子，同父按 leafStart 升序），跳过根
// （L1 = 发片行自己，用户拍板不单独出行）。本文件用真实档 Test 4 的数据验证顺序，
// 期望值先用脚本打印实际结果核对过（见下方 fixture 注释），不是凭猜测写的断言。
//
// 真实档：.tmp-bone-tree/archives/Scalp Conform Test 4.ahs 的 `Front Bangs 1`（已 gitignore，
// 只读）。与 tests/panel-bone-zipper-owner.test.mjs 的 TEST4_SPLITS 是同一份数据，派生树结构：
//   L1[0..2]
//     L2[0..0]                 <- 叶子 0 单独一层，path [0]
//     L2[1..2]                 <- path [1]
//       L3[1..1]                  path [1,0]
//       L3[2..2]                  path [1,1]
// 实测打印（node /tmp/check_enum.mjs，本文件断言就是照这份打印结果写的）：
//   [0]     -> "L2 · Segment 1"
//   [1]     -> "L2 · Segments 2-3"
//   [1,0]   -> "L3 · Segment 2"
//   [1,1]   -> "L3 · Segment 3"
import assert from "node:assert/strict";
import test from "node:test";

import {
  derivePanelBoneGroups,
  panelTierEnumeration,
  panelBoneGroupNodeLabel
} from "../modules/bones/panel-bone-groups.js";

const TEST4_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// ---------------------------------------------------------------------------
// 1. Test 4 上的枚举快照（真实数据，先打印核对过）
// ---------------------------------------------------------------------------

test("Test 4：枚举表恰好 4 行，path/label 与实测打印结果逐位一致", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const rows = panelTierEnumeration(root);
  assert.equal(rows.length, 4, "根有 2 个子节点、其中一个再展开 2 个 L3 叶子 ⇒ 恰好 4 行（跳过根本身）");
  const snapshot = rows.map((row) => ({ path: row.path, label: panelBoneGroupNodeLabel(row.node) }));
  assert.deepStrictEqual(snapshot, [
    { path: [0], label: "L2 · Segment 1" },
    { path: [1], label: "L2 · Segments 2-3" },
    { path: [1, 0], label: "L3 · Segment 2" },
    { path: [1, 1], label: "L3 · Segment 3" }
  ]);
});

test("Test 4：枚举表含中间层节点（leafStart < leafEnd），而不是只有叶子", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const rows = panelTierEnumeration(root);
  const tierRows = rows.filter((row) => row.node.leafStart < row.node.leafEnd);
  assert.equal(tierRows.length, 1, "应恰好一行是真中间层（L2·Segments 2-3，覆盖叶子 1..2）");
  assert.deepStrictEqual(tierRows[0].path, [1]);
  // 负向对照：若枚举表只收叶子（leafStart === leafEnd 的节点），这条断言会变红——
  // 用来防止未来有人把本函数误改成「只遍历叶节点」（那样步进器又会退化回逐叶跳转，
  // 与本轮要修的问题完全一样）。
  const leafOnlyCount = rows.filter((row) => row.node.leafStart === row.node.leafEnd).length;
  assert.ok(leafOnlyCount < rows.length, "枚举表不能只含叶子，必须也含中间层节点");
});

// ---------------------------------------------------------------------------
// 2. 前序顺序断言：父必须先于子出现，同父内按 leafStart 升序
// ---------------------------------------------------------------------------

test("前序顺序：每一行的父路径必须已经出现在它之前的某一行里（父先于子）", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const rows = panelTierEnumeration(root);
  const seenPaths = new Set();
  for (const row of rows) {
    if (row.path.length > 1) {
      const parentPath = row.path.slice(0, -1).join(".");
      assert.ok(seenPaths.has(parentPath), `path ${row.path.join(".")} 的父路径 ${parentPath} 必须已经出现过`);
    }
    seenPaths.add(row.path.join("."));
  }
});

test("同父内按 leafStart 升序：Test 4 的两个根子节点 [0] 与 [1] 顺序不能颠倒", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const rows = panelTierEnumeration(root);
  const topLevel = rows.filter((row) => row.path.length === 1);
  assert.deepStrictEqual(topLevel.map((row) => row.path), [[0], [1]]);
  assert.ok(topLevel[0].node.leafStart < topLevel[1].node.leafStart);
});

// ---------------------------------------------------------------------------
// 3. 根被跳过（L1 = 发片行自己，不单独出行）
// ---------------------------------------------------------------------------

test("根节点本身不出现在枚举表里（path 长度恒 >= 1）", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const rows = panelTierEnumeration(root);
  assert.ok(rows.every((row) => row.path.length >= 1), "枚举表不应包含 path=[] 的根行");
});

// ---------------------------------------------------------------------------
// 4. 边界：单叶树（无 zipper）与 null root
// ---------------------------------------------------------------------------

test("单叶树（0 条 zipper，无 children）：枚举表为空数组", () => {
  const singleLeaf = derivePanelBoneGroups([]);
  assert.equal(singleLeaf.children, null);
  assert.deepStrictEqual(panelTierEnumeration(singleLeaf), []);
});

test("root 为 null/undefined ⇒ 空数组，不抛异常", () => {
  assert.doesNotThrow(() => panelTierEnumeration(null));
  assert.deepStrictEqual(panelTierEnumeration(null), []);
  assert.deepStrictEqual(panelTierEnumeration(undefined), []);
});

// ---------------------------------------------------------------------------
// 5. 三个平级 L2 兄弟（无嵌套）：枚举表应恰好 3 行，全部 path 长度为 1
// ---------------------------------------------------------------------------

test("三个平级 L2 兄弟（heights 相同，无嵌套）：枚举表恰好 3 行，均为顶层路径", () => {
  const splits = [
    { position: -0.3333333333333333, height: 0.3, order: 0 },
    { position: 0.3333333333333333, height: 0.3, order: 1 }
  ];
  const root = derivePanelBoneGroups(splits);
  assert.equal(root.children.length, 3, "两条等高 zipper 应派生出根下三个平级 L2 兄弟");
  const rows = panelTierEnumeration(root);
  assert.equal(rows.length, 3);
  assert.deepStrictEqual(rows.map((row) => row.path), [[0], [1], [2]]);
});
