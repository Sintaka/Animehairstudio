// 层级继承（0.2.168）：叶子链的 rest 必须先被祖先中间层的 delta 顶起来。
//
// 用户原话：「我现在用笔刷去刷这个中间骨骼不会带着它的叶层级一起动, 现在 L3.Segments 2/3
// 应该是挂在这个中间骨骼下的, 而不是挂在主骨骼下」。
// 改之前叶子与中间层各自独立从基础面板算 rest，实测刷中间层后 leaf1/leaf2/网格顶点
// 三项全部逐字节不变（scripts/probe-tier-inherit.mjs）。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  derivePanelBoneGroups,
  panelBoneGroupAncestorsForLeaf,
  panelBoneGroupPathForLeaf
} from "../modules/bones/panel-bone-groups.js";

// 与用户的 Scalp Conform Test 1/4 同构：两条 zipper，浅的先切 ⇒
// L2·Segment 1 / L2·Segments 2-3，后者下面再分 L3·Segment 2 / L3·Segment 3。
const SPLITS = [
  { position: -0.333, height: 0.3 },
  { position: 0.367, height: 0.4 }
];

test("三层树：叶子 0 在浅层直接命中，没有中间层祖先", () => {
  const root = derivePanelBoneGroups(SPLITS);
  assert.deepEqual(panelBoneGroupPathForLeaf(root, 0), [0]);
  // path 长度 1 ⇒ 父就是根（主骨骼），不存在"中间层祖先"
  assert.deepEqual(panelBoneGroupAncestorsForLeaf(root, 0), []);
});

test("叶子 1 / 2 的祖先恰好是那个跨段中间层（不含根、不含自己）", () => {
  const root = derivePanelBoneGroups(SPLITS);
  for (const leaf of [1, 2]) {
    const ancestors = panelBoneGroupAncestorsForLeaf(root, leaf);
    assert.equal(ancestors.length, 1, `叶子 ${leaf} 应恰有 1 个中间层祖先`);
    const node = ancestors[0];
    assert.equal(node.leafStart, 1, "祖先应覆盖 leaf 1..2");
    assert.equal(node.leafEnd, 2);
    // 不含自己：祖先的区间必须**严格宽于**单个叶子
    assert.ok(node.leafStart < node.leafEnd, "返回的不能是叶子自己");
  }
});

test("根被刻意排除：根就是主骨骼，算进去会把主骨骼位移叠两次", () => {
  const root = derivePanelBoneGroups(SPLITS);
  const all = [0, 1, 2].flatMap((leaf) => panelBoneGroupAncestorsForLeaf(root, leaf));
  assert.ok(all.every((n) => n !== root), "根不得出现在祖先列表里");
});

test("非法输入安全回落成空数组，不抛", () => {
  const root = derivePanelBoneGroups(SPLITS);
  assert.deepEqual(panelBoneGroupAncestorsForLeaf(null, 0), []);
  assert.deepEqual(panelBoneGroupAncestorsForLeaf(root, 99), []);
  assert.deepEqual(panelBoneGroupAncestorsForLeaf(root, "x"), []);
});

test("panel-tip-strand 真的把祖先 delta 累加进 rest，且未创作时回落到原函数引用", () => {
  const src = readFileSync(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");
  const i = src.indexOf("const baseRestPointAt =");
  assert.notEqual(i, -1, "找不到 baseRestPointAt");
  // 窗口取到 restPointAt 赋值结束（`: baseRestPointAt;` 那一行），不用固定字符数。
  // ★ 原本是 `src.slice(i, i + 1400)`，0.2.170 加解释注释后三条断言全被挤出窗口、
  // 测试变红，而代码其实是对的 —— 固定字符窗口会把「注释变长」误报成「实现变错」，
  // 这类假红比漏报更消耗排查时间（本仓已有多次「假绿/假红」教训）。改成锚到结构边界。
  const end = src.indexOf(": baseRestPointAt;", i);
  assert.notEqual(end, -1, "找不到 restPointAt 的回落分支");
  const body = src.slice(i, end + ": baseRestPointAt;".length);
  assert.match(body, /ancestorTips\.length/, "必须按有无祖先分流");
  assert.match(body, /point\.x \+= a\.x - r\.x/, "必须累加祖先 delta");
  // 未创作时**必须**回落到同一个函数引用，而不是包一层恒等映射：
  // 这是"存量 .ahs 逐字节不变"的结构性依据（实测 leaf1 链 8 个值完全相同）。
  assert.match(body, /:\s*baseRestPointAt;/, "无祖先时应直接复用 baseRestPointAt");
});

test("网格高亮接了覆盖判据，中间层整层一起亮", () => {
  const src = readFileSync(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");
  const i = src.indexOf("function updateTipHighlight(");
  assert.notEqual(i, -1);
  const body = src.slice(i, src.indexOf("\n}", i));
  assert.match(body, /deps\.panelBoneGroupSelectionCoversSegment\?\./,
    "高亮必须走注入的覆盖判据（与把手高亮同一个函数）");
  assert.match(body, /coversSelected\(segment\) && weight > 0\.001/,
    "着色分支应改用 coversSelected");
  assert.doesNotMatch(body, /segment === selectedSeg && weight/,
    "不得再用精确比较（那只会亮 leafStart 一段）");
});
