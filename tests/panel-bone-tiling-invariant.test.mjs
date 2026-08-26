// panel-bone-tiling-invariant.test.mjs —— 两条一直被假设、但从未被断言的分组树不变量。
//
// 起因（用户 2026-08-26 实测报的 bug 2）：主面板与视口都显示 **2** 条 zipper，
// 但 outliner 里出现 **3** 行 zipper，且 Zipper 1 / Zipper 2 **重复出现**。
// 512 条既有测试全绿却抓不到它 —— 因为「children 恰好铺满 parent 的叶子区间」和
// 「每条 zipper 在 outliner 里只出现一次」这两条从来没有被写成断言。
//
// 【不变量 1：铺满】任何非叶节点的 children，其叶子区间必须**无缝、无重叠**地覆盖父节点：
//   children[0].leafStart === parent.leafStart
//   children[k].leafStart === children[k-1].leafEnd + 1
//   children[last].leafEnd === parent.leafEnd
// 这条是分组树「几何零风险」的根基：叶子划分不变量（见 panel-bone-groups.js 文件头【1】）
// 依赖它。一旦出现空隙或重叠，就会多出/少掉一条边界。
//
// 【不变量 2：zipper 行数】outliner 按「相邻子节点之间的边界」枚举 zipper 行，
// 边界标识是左子节点的 leafEnd（= zipper 下标）。因为每条 zipper 是**一条物理切缝**，
// 所以整棵树走完一遍，渲染出的 zipper 行数必须 === panelSplits.length，
// 且**没有任何 zipperIndex 出现两次**。重复即 bug（正是用户看到的现象）。
import test from "node:test";
import assert from "node:assert/strict";
import {
  derivePanelBoneGroups, panelBoneGroupsFor, panelBoneGroupsFromLevels,
  materializePanelBoneLevels, normalizePanelBoneLevels, MAX_PANEL_BONE_DEPTH
} from "../modules/bones/panel-bone-groups.js";

// 收集铺满违规。返回违规描述数组（空 = 合法）。
function tilingViolations(root) {
  const bad = [];
  const walk = (node, path) => {
    if (!node?.children?.length) return;
    let cursor = node.leafStart;
    node.children.forEach((child, i) => {
      if (child.leafStart !== cursor) {
        bad.push(`path=${JSON.stringify(path)} 第 ${i} 个子节点起点 ${child.leafStart} != 期望 ${cursor}`);
      }
      cursor = child.leafEnd + 1;
    });
    if (cursor - 1 !== node.leafEnd) {
      bad.push(`path=${JSON.stringify(path)} 子节点终点 ${cursor - 1} != parent.leafEnd ${node.leafEnd}`);
    }
    node.children.forEach((child, i) => walk(child, [...path, i]));
  };
  walk(root, []);
  return bad;
}

// 复刻 outliner 的 zipper 行枚举（app.js 的 createOutlinerPanelBoneGroups /
// createPanelBoneGroupRow 用的是同一规则：每个节点为「相邻子节点之间」各出一行）。
function enumerateZipperRows(root) {
  const rows = [];
  const walk = (node, label) => {
    if (!node?.children?.length) return;
    node.children.forEach((child, i) => {
      if (i < node.children.length - 1) rows.push({ zipperIndex: child.leafEnd, from: label });
    });
    node.children.forEach((child, i) => walk(child, `${label}/${i}`));
  };
  walk(root, "root");
  return rows;
}

const mkSplits = (specs) => specs.map(([position, height], i) => ({ position, height, order: i }));

// 覆盖面：单叶、两条同高、两条不同高（用户 Test 4 的真实形状）、多条递增、撞深度上限
const CASES = [
  { name: "0 条 zipper（单叶）", splits: mkSplits([]) },
  { name: "1 条 zipper", splits: mkSplits([[0, 0.3]]) },
  { name: "2 条同高（Test 1 形状）", splits: mkSplits([[-1 / 3, 0.3], [1 / 3, 0.3]]) },
  { name: "2 条不同高（Test 4 真实形状）", splits: mkSplits([[-0.3333333333333333, 0.3], [0.36666666666666675, 0.4]]) },
  { name: "5 条各不同高（Test 3 形状，恰好到 L5）", splits: mkSplits([[-0.8, 0.53125], [-0.4, 0.21875], [0, 0.3125], [0.4, 0.4375], [0.8, 0.5]]) },
  { name: "6 条严格递增（撞深度上限，触发 clampedFlat）", splits: mkSplits([[-0.75, 0.1], [-0.5, 0.2], [-0.25, 0.3], [0, 0.4], [0.25, 0.5], [0.5, 0.6]]) }
];

for (const c of CASES) {
  test(`铺满不变量：${c.name}（派生树）`, () => {
    const root = derivePanelBoneGroups(c.splits);
    assert.deepEqual(tilingViolations(root), [], `派生树出现空隙/重叠：${c.name}`);
    assert.equal(root.leafStart, 0, "根必须从叶子 0 开始");
    assert.equal(root.leafEnd, c.splits.length, `根必须覆盖到叶子 ${c.splits.length}`);
  });

  test(`zipper 行数不变量：${c.name}（每条 zipper 恰好一行、无重复）`, () => {
    const root = derivePanelBoneGroups(c.splits);
    const rows = enumerateZipperRows(root);
    assert.equal(
      rows.length,
      c.splits.length,
      `渲染出 ${rows.length} 行 zipper，但 panelSplits 只有 ${c.splits.length} 条`
        + `（用户报的 bug 2 就是这个：显示 2 条却渲染 3 行）`
    );
    const counts = new Map();
    for (const r of rows) counts.set(r.zipperIndex, (counts.get(r.zipperIndex) || 0) + 1);
    const dup = [...counts.entries()].filter(([, n]) => n > 1);
    assert.deepEqual(dup, [], `有 zipperIndex 重复出现：${JSON.stringify(dup)}`);
    // 每条 zipper 都必须被渲染到（不能漏）
    const seen = [...counts.keys()].sort((a, b) => a - b);
    assert.deepEqual(seen, c.splits.map((_, i) => i), "渲染出的 zipperIndex 集合与 panelSplits 下标不一致");
  });

  test(`铺满不变量：${c.name}（按 boneLevel 建树的那条路径）`, () => {
    // panelBoneGroupsFor 的三级回落里，②「按 boneLevel 建树」是独立代码路径，
    // 必须与派生路径一样满足铺满 —— 阶段 3 曾因为漏了这一级导致层级按钮只改数字不改树。
    const leveled = normalizePanelBoneLevels(materializePanelBoneLevels(c.splits));
    const root = panelBoneGroupsFromLevels(leveled);
    assert.deepEqual(tilingViolations(root), [], `按 level 建树出现空隙/重叠：${c.name}`);
    const rows = enumerateZipperRows(root);
    assert.equal(rows.length, c.splits.length, "按 level 建树的 zipper 行数不对");
  });

  test(`铺满不变量：${c.name}（panelBoneGroupsFor 实际返回的树）`, () => {
    // outliner 真正渲染的是 panelBoneGroupsFor 的返回值，所以这条最贴近用户看到的东西。
    const root = panelBoneGroupsFor({ id: "probe", panelSplits: c.splits });
    assert.deepEqual(tilingViolations(root), [], `有效树出现空隙/重叠：${c.name}`);
    assert.equal(enumerateZipperRows(root).length, c.splits.length, "有效树的 zipper 行数不对");
  });
}

test("深度永不超过 MAX_PANEL_BONE_DEPTH（钳位生效）", () => {
  const splits = mkSplits([[-0.75, 0.1], [-0.5, 0.2], [-0.25, 0.3], [0, 0.4], [0.25, 0.5], [0.5, 0.6]]);
  const root = derivePanelBoneGroups(splits);
  const maxDepth = (n) => (n.children ? Math.max(...n.children.map(maxDepth)) : n.depth);
  assert.ok(
    maxDepth(root) <= MAX_PANEL_BONE_DEPTH,
    `最大深度 ${maxDepth(root)} 超过上限 ${MAX_PANEL_BONE_DEPTH}`
  );
});
