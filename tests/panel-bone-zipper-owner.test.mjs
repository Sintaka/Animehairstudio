// panel-bone-zipper-owner.test.mjs — panelBoneGroupPathForZipper（modules/bones/panel-bone-groups.js）。
//
// 背景：用户要求点 outliner 里的 zipper 行时，选中「拥有这条切缝」的那个父层。zipper i
// 分隔叶子 i 与 i+1（文件头规则 1），outliner 用 child.leafEnd（左子节点右边界）作为该行
// 下标（见 app.js 两处调用点）。本文件只测数据层的归属查找，不碰渲染/接线。
//
// 真实档：.tmp-bone-tree/archives/Scalp Conform Test 4.ahs 的 `Front Bangs 1`（已 gitignore，
// 只读）。2 条 zipper，position 升序，height [0.3, 0.4]，与 tests/panel-bone-tip-carrier.test.mjs
// 的 TEST4_SPLITS 是同一份数据。派生树实测结构（本文件运行时用 derivePanelBoneGroups 现场
// 打印过一遍确认，见下方 fixture 注释）：
//   L1[0..2]
//     L2[0..0]                       <- 叶子 0 单独一层
//     L2[1..2]                       <- zipper 0（下标0）正是这两个 L2 兄弟之间的边界，
//       L3[1..1]                        故 zipper 0 归属根 [] （根拥有它）
//       L3[2..2]                     <- zipper 1（下标1）是 L2[1..2] 内部 L3 兄弟之间的边界，
//                                        故 zipper 1 归属 [1]（即 L2·Segments 2-3）
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import {
  derivePanelBoneGroups,
  panelBoneGroupPathForLeaf,
  panelBoneGroupPathForZipper
} from "../modules/bones/panel-bone-groups.js";

// 与 tests/panel-bone-tip-carrier.test.mjs 的 TEST4_SPLITS 完全一致：Test 4「Front Bangs 1」
// 的真实 panelSplits。
const TEST4_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// ---------------------------------------------------------------------------
// 1. 真实档验证（Test 4 / Front Bangs 1）
// ---------------------------------------------------------------------------

test("真实档 Test 4：先打印派生树结构，确认与 fixture 注释描述一致", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  // 打印真实结构，供人工核对（本测试文件的期望值就是照着这份打印结果写的，不是凭猜测）。
  // eslint-disable-next-line no-console
  console.log("Test4 derived tree:", JSON.stringify(root, null, 1));
  assert.equal(root.leafStart, 0);
  assert.equal(root.leafEnd, 2);
  assert.equal(root.children.length, 2, "根应恰好两个子节点：L2[0..0] 与 L2[1..2]");
  const [c0, c1] = root.children;
  assert.equal(c0.leafStart, 0);
  assert.equal(c0.leafEnd, 0);
  assert.equal(c0.children, null, "L2[0..0] 是叶节点");
  assert.equal(c1.leafStart, 1);
  assert.equal(c1.leafEnd, 2);
  assert.notEqual(c1.children, null, "L2[1..2] 应有 L3 子节点");
  assert.equal(c1.children.length, 2, "L2[1..2] 下应恰好两个 L3 叶子");
});

test("真实档 Test 4：zipper 0（根两个 L2 兄弟之间）归属根 []", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const path = panelBoneGroupPathForZipper(root, 0);
  assert.deepStrictEqual(path, [], "zipper 0 应归属根节点，返回空数组而不是 null");
});

test("真实档 Test 4：zipper 1（L2[1..2] 内部两个 L3 兄弟之间）归属 [1]，即 L2·Segments 2-3", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  const path = panelBoneGroupPathForZipper(root, 1);
  assert.deepStrictEqual(path, [1], "zipper 1 应归属 L2[1..2]（根的第 1 个子节点）");
});

// ---------------------------------------------------------------------------
// 2. 根拥有的切缝返回 []（与「找不到」的 null 严格区分）
// ---------------------------------------------------------------------------

test("根拥有的切缝必须返回 []（deepStrictEqual，不是真值判断——[] 是 truthy 无法用 assert.ok 区分）", () => {
  // 三个平级 L2 兄弟（heights 相同），两条 zipper 都直接卡在根的子节点之间。
  const splits = [
    { position: -0.3333333333333333, height: 0.3, order: 0 },
    { position: 0.3333333333333333, height: 0.3, order: 1 }
  ];
  const root = derivePanelBoneGroups(splits);
  assert.equal(root.children.length, 3, "两条等高 zipper 应派生出根下三个平级 L2 兄弟");
  const p0 = panelBoneGroupPathForZipper(root, 0);
  const p1 = panelBoneGroupPathForZipper(root, 1);
  assert.deepStrictEqual(p0, [], "zipper 0 归属根");
  assert.deepStrictEqual(p1, [], "zipper 1 归属根");
  // 显式确认不是把 null 误判成 []：两者必须是真正的空数组。
  assert.equal(Array.isArray(p0), true);
  assert.equal(p0.length, 0);
});

// ---------------------------------------------------------------------------
// 3. 越界 / null root / 单叶树 ⇒ null
// ---------------------------------------------------------------------------

test("越界 zipperIndex ⇒ null，不抛异常", () => {
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  assert.doesNotThrow(() => panelBoneGroupPathForZipper(root, 99));
  assert.equal(panelBoneGroupPathForZipper(root, 99), null);
  assert.doesNotThrow(() => panelBoneGroupPathForZipper(root, -1));
  assert.equal(panelBoneGroupPathForZipper(root, -1), null);
});

test("root 为 null/undefined ⇒ null，不抛异常", () => {
  assert.doesNotThrow(() => panelBoneGroupPathForZipper(null, 0));
  assert.equal(panelBoneGroupPathForZipper(null, 0), null);
  assert.equal(panelBoneGroupPathForZipper(undefined, 0), null);
});

test("单叶树（无 children）：任何 zipperIndex 都没有切缝可归属 ⇒ null", () => {
  const singleLeaf = derivePanelBoneGroups([]); // 无 zipper ⇒ 1 个叶子，root.children === null
  assert.equal(singleLeaf.children, null, "0 条 zipper 应派生出单叶树");
  assert.equal(panelBoneGroupPathForZipper(singleLeaf, 0), null);
});

test("非整数 zipperIndex（字符串/小数/NaN/undefined）⇒ null，不抛异常", () => {
  // 注意：不测 null——Number(null) === 0，与本模块既有的 panelBoneGroupPathForLeaf 同一套
  // 强制转换约定一致，0 是合法下标（会走进正常查找逻辑），不属于"非整数"这一类。
  const root = derivePanelBoneGroups(TEST4_SPLITS);
  for (const bad of ["x", 0.5, NaN, undefined]) {
    assert.doesNotThrow(() => panelBoneGroupPathForZipper(root, bad), `bad=${bad} 不应抛异常`);
    assert.equal(panelBoneGroupPathForZipper(root, bad), null, `bad=${bad} 应返回 null`);
  }
});

// ---------------------------------------------------------------------------
// 4. 深层嵌套：合成一棵至少 3 层的树，断言深层切缝返回正确的深层 path
// ---------------------------------------------------------------------------

// 4 个可创作字段统一置 null，与既有测试文件（panel-bone-groups-tree.test.mjs）同一套写法。
const BLANK_FIELDS = {
  taperCurve: null,
  taperCurveSecondary: null,
  depthCurve: null,
  depthCurveSecondary: null,
  tip: null
};

function structNode(leafStart, leafEnd, depth, children = null) {
  return { leafStart, leafEnd, depth, ...BLANK_FIELDS, children };
}

// 手写 4 层树，6 个叶子（0..5）：
//   root [0..5] depth1
//     A [0..4] depth2
//       A1 [0..2] depth3
//         A1a [0..1] depth4 leaf
//         A1b [2..2] depth4 leaf   <- zipper 1 是 A1a/A1b 之间的边界，归属 A1 = path [0,0]
//       A2 [3..4] depth3 leaf     <- zipper 2 是 A1/A2 之间的边界，归属 A = path [0]
//     B [5..5] depth2 leaf         <- zipper 4 是 A/B 之间的边界，归属根 = path []
// zipper 0（A1a 内部叶子 0/1 之间，A1a 是叶节点没有子节点）与 zipper 3（A1/A2 之间的缝与
// A2/B 之间的缝中间那个下标，A1[0..2] 与 A2[3..4] 之间已经是 zipper2，A2[3..4] 与 B[5..5]
// 之间是 zipper4，中间没有 zipper3 对应的兄弟边界）均不存在归属节点 ⇒ null。
function buildDeepFixture() {
  const a1a = structNode(0, 1, 4, null);
  const a1b = structNode(2, 2, 4, null);
  const a1 = structNode(0, 2, 3, [a1a, a1b]);
  const a2 = structNode(3, 4, 3, null);
  const a = structNode(0, 4, 2, [a1, a2]);
  const b = structNode(5, 5, 2, null);
  const root = structNode(0, 5, 1, [a, b]);
  return { root, a, a1, a1a, a1b, a2, b };
}

test("深层嵌套：4 层合成树里，深层切缝（zipper 1）归属最深的中间节点 [0,0]", () => {
  const { root } = buildDeepFixture();
  const path = panelBoneGroupPathForZipper(root, 1);
  assert.deepStrictEqual(path, [0, 0], "zipper 1 应归属 A1（root 第0子的第0子）");
});

test("深层嵌套：次深切缝（zipper 2）归属中间层节点 [0]", () => {
  const { root } = buildDeepFixture();
  const path = panelBoneGroupPathForZipper(root, 2);
  assert.deepStrictEqual(path, [0], "zipper 2 应归属 A（root 的第0个子节点）");
});

test("深层嵌套：最外层切缝（zipper 4）归属根 []", () => {
  const { root } = buildDeepFixture();
  const path = panelBoneGroupPathForZipper(root, 4);
  assert.deepStrictEqual(path, [], "zipper 4 应归属根节点");
});

test("深层嵌套：没有对应兄弟边界的下标（zipper 0 / zipper 3）⇒ null", () => {
  const { root } = buildDeepFixture();
  assert.equal(panelBoneGroupPathForZipper(root, 0), null, "zipper 0 落在 A1a 叶节点内部，没有兄弟边界");
  assert.equal(panelBoneGroupPathForZipper(root, 3), null, "zipper 3 不对应任何相邻子节点边界");
});

// ---------------------------------------------------------------------------
// 5. 负向对照：与 panelBoneGroupPathForLeaf 在同一 zipperIndex 上必须给出不同结果
// ---------------------------------------------------------------------------

test("负向对照：panelBoneGroupPathForZipper 与 panelBoneGroupPathForLeaf 在同一下标上语义不同，" +
  "结果必须有分辨力（防止将来被误合并成一个函数）", () => {
  const { root } = buildDeepFixture();
  let comparedCount = 0;
  let sawDifference = false;
  // 遍历所有「至少一个函数能给出非 null 结果」的下标，确认两者不会恒等。
  for (let zipperIndex = 0; zipperIndex <= 5; zipperIndex += 1) {
    const zipperPath = panelBoneGroupPathForZipper(root, zipperIndex);
    const leafPath = panelBoneGroupPathForLeaf(root, zipperIndex);
    if (zipperPath === null && leafPath === null) continue; // 两者都查不到，跳过，不计入比对
    comparedCount += 1;
    const same =
      Array.isArray(zipperPath) &&
      Array.isArray(leafPath) &&
      zipperPath.length === leafPath.length &&
      zipperPath.every((v, i) => v === leafPath[i]);
    if (!same) sawDifference = true;
  }
  // 遍历型断言要先确认循环真的跑过：至少要有若干下标进入了比对，否则下面的
  // sawDifference 断言即使写反也会因为循环体从未执行而"照绿"（本项目 0.2.173 的教训）。
  assert.ok(comparedCount >= 3, `循环至少应比对 3 个下标，实际只比对了 ${comparedCount} 次`);
  assert.equal(sawDifference, true, "两个函数在遍历的下标里必须至少出现一次不同结果，证明语义确实不同");

  // 再用 Test 4 真实档单独钉死一次具体差异：zipper 1 上两者分别是 [1]（拥有切缝的父层）
  // 与 [1,0]（叶子 1 所在的最深叶节点），路径长度都不同，绝不可能被误认成同一个函数。
  const test4Root = derivePanelBoneGroups(TEST4_SPLITS);
  const zipperOwnerPath = panelBoneGroupPathForZipper(test4Root, 1);
  const leafDeepPath = panelBoneGroupPathForLeaf(test4Root, 1);
  assert.deepStrictEqual(zipperOwnerPath, [1]);
  assert.deepStrictEqual(leafDeepPath, [1, 0]);
  assert.notDeepStrictEqual(zipperOwnerPath, leafDeepPath, "同一下标 1 上两个函数的结果必须不同");
});

