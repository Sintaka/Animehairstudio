// panel-bone-split-count-remap.test.mjs — 增删 zipper 时保全分组树（0.2.173）。
//
// 背景：增删 zipper 改变 leafCount，而分组树的归一化校验对 leafCount 不匹配的树**整棵拒绝**
// ⇒ 回落现场派生 ⇒ 全部中间层创作值一起蒸发（实测：2 个带值的中间层，增加一条 zipper 后
// 有效树里的创作值总数 0）。旧值其实还留在 lock 上、只是读不到，所以在改动那一刻还能抢救。
//
// 比改层级（0.2.171）更严重：那里存活的 span 还能保住值，这里整棵树连同一切被丢弃。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  panelBoneGroupsFor,
  materializePanelBoneGroups,
  setPanelBoneGroupValue,
  remapPanelBoneGroupsForSplitChange,
  normalizePanelBoneGroups,
  forEachPanelBoneGroup
} from "../modules/bones/panel-bone-groups.js";

const mk = () => ({
  id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplitHeight: 0.28,
  taperCurve: [{ position: 0, value: 1, interpolation: "linear" }],
  panelSplits: [
    { position: -0.5, height: 0.2, order: 0 },
    { position: 0, height: 0.3, order: 1 },
    { position: 0.5, height: 0.4, order: 2 }
  ]
});
const flat = (v) => [{ position: 0, value: v, interpolation: "linear" }];

const countValues = (root) => {
  let c = 0;
  forEachPanelBoneGroup(root, (n, p) => {
    if (!p.length) return;
    if (n.taperCurve != null) c += 1;
    if (n.tip != null) c += 1;
  });
  return c;
};
const spansOf = (root) => {
  const s = [];
  forEachPanelBoneGroup(root, (n, p) => { if (p.length) s.push(`${n.leafStart}:${n.leafEnd}`); });
  return s;
};

// 在所有真中间层上写创作值，返回写了几个
function seedTiers(lock) {
  let n = 0;
  forEachPanelBoneGroup(lock.panelBoneGroups, (node, path) => {
    if (!path.length || !Array.isArray(node.children)) return;
    if (node.leafStart >= node.leafEnd) return;
    setPanelBoneGroupValue(lock, path, "taperCurve", flat(0.3 + n * 0.2));
    n += 1;
  });
  return n;
}

// 复刻 changePanelSplitCount 的插入：新 zipper 落在末尾 ⇒ 被一分为二的是最后一段
function addZipperAtEnd(lock) {
  const s = lock.panelSplits.map((x) => ({ ...x }));
  const insertIndex = s.length;            // 段下标 = 新 zipper 排序后左侧的段数
  s.push({ position: 0.75, height: 0.28, order: 3 });
  s.sort((a, b) => a.position - b.position);
  lock.panelSplits = s;
  return insertIndex;
}

// ---------------------------------------------------------------------------
// 1. ★ 核心：增加 zipper 后创作值不再整棵蒸发。含负向对照（不调重映射就是原缺陷）。
// ---------------------------------------------------------------------------
test("核心：增加 zipper 后中间层创作值不再全部蒸发（不调重映射则蒸发）", () => {
  // 负向对照 = 原缺陷
  const bad = mk();
  materializePanelBoneGroups(bad);
  const seeded = seedTiers(bad);
  assert.ok(seeded >= 2, `fixture 至少要有 2 个真中间层，实测 ${seeded}`);
  addZipperAtEnd(bad);
  assert.equal(normalizePanelBoneGroups(bad.panelBoneGroups, bad.panelSplits.length + 1), null,
    "对照：leafCount 变了之后存储树必须被归一化校验拒绝（这正是缺陷的机制）");
  assert.equal(countValues(panelBoneGroupsFor(bad)), 0,
    "对照：不调重映射时有效树里的创作值必须全部消失（若它非 0 说明机制变了，本测试需重写）");

  // 修法
  const good = mk();
  materializePanelBoneGroups(good);
  seedTiers(good);
  const prevLeafCount = good.panelSplits.length + 1;
  const insertIndex = addZipperAtEnd(good);
  const r = remapPanelBoneGroupsForSplitChange(good, "insert", insertIndex, prevLeafCount);
  assert.ok(r, "已物化的 lock 必须返回重映射结果");
  const survived = countValues(panelBoneGroupsFor(good));
  const writtenBack = r.orphanedTiers.length;
  assert.ok(survived + writtenBack >= seeded,
    `每个创作值要么被保住要么被交出去写回，不能静默丢失：`
    + `原 ${seeded}，保住 ${survived}，待写回 ${writtenBack}`);
  assert.ok(survived >= 1, `至少要有一个中间层的值被原地保住，实测 ${survived}`);
});

// ---------------------------------------------------------------------------
// 2. 删除 zipper 同样保全。
// ---------------------------------------------------------------------------
test("删除 zipper 后同样保全（不静默丢值）", () => {
  const lock = mk();
  materializePanelBoneGroups(lock);
  const seeded = seedTiers(lock);
  const prevLeafCount = lock.panelSplits.length + 1;
  const deleteIndex = 2;                  // 删最后一条 zipper ⇒ 段 2 与段 3 合并
  lock.panelSplits = lock.panelSplits.filter((_, i) => i !== deleteIndex);
  const r = remapPanelBoneGroupsForSplitChange(lock, "delete", deleteIndex, prevLeafCount);
  assert.ok(r, "必须返回结果");
  const survived = countValues(panelBoneGroupsFor(lock));
  assert.ok(survived + r.orphanedTiers.length >= 1,
    `删除后创作值不能凭空消失：原 ${seeded}，保住 ${survived}，待写回 ${r.orphanedTiers.length}`);
});

// ---------------------------------------------------------------------------
// 3. ★ span 重映射公式：逐个下标核对，不靠端到端间接验证。
// ---------------------------------------------------------------------------
// ★ 必须通过**真实函数**观察映射结果，不能在测试里重新实现一遍公式。
// 第一版就是那么写的（本地 `const ins = (a,b,i) => ...` 再断言算术），于是变异
// 「把插入的 mapEnd 从 `b < at` 改成 `b <= at`」照绿 —— 测试验证的是我自己的算术符合我自己的
// 心智模型，**完全没咬到模块**。这正是本仓记过的那类假绿（「变异验证对着自建参考实现跑」）。
// 现在的做法：构造一个已知 span 的中间层、给它写一个可识别的值，改动后去新树里找那个值
// 落在哪个 span 上 —— 值的落点就是真实映射结果。
function spanOfValue(lock, marker) {
  let hit = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n, p) => {
    if (!p.length || hit) return;
    if (n.taperCurve?.[0]?.value === marker) hit = `${n.leafStart}:${n.leafEnd}`;
  });
  return hit;
}

test("重映射公式：用真实函数观察 span 落点（不在测试里重算公式）", () => {
  // 插入落在 span 内 ⇒ 该层多管一片叶子：[1..3] + 在段 3 插入 ⇒ [1..4]
  const a = mk();
  materializePanelBoneGroups(a);
  let path13 = null;
  forEachPanelBoneGroup(a.panelBoneGroups, (n, p) => {
    if (p.length && n.leafStart === 1 && n.leafEnd === 3) path13 = p;
  });
  assert.ok(path13, "fixture 需要一个覆盖 [1..3] 的中间层");
  setPanelBoneGroupValue(a, path13, "taperCurve", flat(0.77));
  const prevA = a.panelSplits.length + 1;
  const insertIndex = addZipperAtEnd(a);     // 段 3 一分为二
  assert.equal(insertIndex, 3, "本 fixture 下新 zipper 应细分段 3");
  remapPanelBoneGroupsForSplitChange(a, "insert", insertIndex, prevA);
  assert.equal(spanOfValue(a, 0.77), "1:4",
    "插入点落在 span 内 ⇒ 该层应多管一片叶子（[1..3] → [1..4]）");

  // 删除：两片被合并的叶子都在层内 ⇒ 少管一片。[1..3] + 删段 2 ⇒ [1..2]
  const b = mk();
  materializePanelBoneGroups(b);
  let p13b = null;
  forEachPanelBoneGroup(b.panelBoneGroups, (n, p) => {
    if (p.length && n.leafStart === 1 && n.leafEnd === 3) p13b = p;
  });
  setPanelBoneGroupValue(b, p13b, "taperCurve", flat(0.55));
  const prevB = b.panelSplits.length + 1;
  b.panelSplits = b.panelSplits.filter((_, i) => i !== 2);
  const rb = remapPanelBoneGroupsForSplitChange(b, "delete", 2, prevB);
  const landedB = spanOfValue(b, 0.55);
  const orphanB = rb.orphanedTiers.find((t) => t.values?.taperCurve?.[0]?.value === 0.55);
  assert.ok(landedB === "1:2" || (orphanB && orphanB.leafStart === 1 && orphanB.leafEnd === 2),
    `删除后该层应映射到 [1..2]（原地保住或交出去写回都算），`
    + `实测落点=${landedB} orphan=${orphanB ? `${orphanB.leafStart}:${orphanB.leafEnd}` : "无"}`);
});

// ---------------------------------------------------------------------------
// 4. 退化成单叶的层进 orphanedTiers（等 app.js 侧写回那片叶子）。
// ---------------------------------------------------------------------------
test("退化：删除后只剩一片叶子的层要交出去写回", () => {
  const lock = mk();
  materializePanelBoneGroups(lock);
  // 找一个恰好覆盖两片叶子的层，删掉它们之间那条 zipper ⇒ 它退化成单叶
  let target = null;
  forEachPanelBoneGroup(lock.panelBoneGroups, (n, p) => {
    if (target || !p.length || !Array.isArray(n.children)) return;
    if (n.leafEnd - n.leafStart === 1) target = { path: p, node: n };
  });
  assert.ok(target, "fixture 需要一个覆盖恰好两片叶子的中间层");
  setPanelBoneGroupValue(lock, target.path, "taperCurve", flat(0.66));
  const prevLeafCount = lock.panelSplits.length + 1;
  const deleteIndex = target.node.leafStart;   // 合并 leafStart 与 leafStart+1
  lock.panelSplits = lock.panelSplits.filter((_, i) => i !== deleteIndex);
  const r = remapPanelBoneGroupsForSplitChange(lock, "delete", deleteIndex, prevLeafCount);
  const hit = r.orphanedTiers.find((t) => t.leafStart === t.leafEnd);
  assert.ok(hit, `退化成单叶的层必须进 orphanedTiers，实测 ${JSON.stringify(r.orphanedTiers)}`);
  assert.equal(hit.values.taperCurve[0].value, 0.66, "必须带着创作值一起交出去");
});

// ---------------------------------------------------------------------------
// 5. ★ 映射后仍是多叶、但新树里没有这个 span 的层，也要交出去写回。
//    第一版实现漏了这条：它既不满足「退化成单叶」、又找不到落点 ⇒ 静默丢失。
// ---------------------------------------------------------------------------
test("孤立：映射后 span 在新树里不存在的层，也必须交出去写回", () => {
  const lock = mk();
  materializePanelBoneGroups(lock);
  const seeded = seedTiers(lock);
  const prevLeafCount = lock.panelSplits.length + 1;
  const insertIndex = addZipperAtEnd(lock);
  const r = remapPanelBoneGroupsForSplitChange(lock, "insert", insertIndex, prevLeafCount);
  const newSpans = new Set(spansOf(panelBoneGroupsFor(lock)));
  // 交出去的那些，其 span 确实不在新树里（否则应该被原地保住而不是写回）
  for (const t of r.orphanedTiers) {
    assert.ok(!newSpans.has(`${t.leafStart}:${t.leafEnd}`),
      `orphaned 的 span ${t.leafStart}:${t.leafEnd} 不该同时存在于新树（那样就该原地保住）`);
  }
  assert.equal(countValues(panelBoneGroupsFor(lock)) + r.orphanedTiers.length, seeded,
    "保住的 + 交出去的 必须恰好等于原有的（不多不少，无静默丢失也无重复计数）");
});

// ---------------------------------------------------------------------------
// 6. 未物化 ⇒ no-op，不把树写进存档。
// ---------------------------------------------------------------------------
test("未物化的 lock：重映射是 no-op，不写 panelBoneGroups", () => {
  const lock = mk();
  assert.equal(lock.panelBoneGroups, undefined, "前提：未物化");
  const prevLeafCount = lock.panelSplits.length + 1;
  const insertIndex = addZipperAtEnd(lock);
  assert.equal(remapPanelBoneGroupsForSplitChange(lock, "insert", insertIndex, prevLeafCount), null,
    "未物化时应返回 null");
  assert.equal(lock.panelBoneGroups, undefined, "不得把树写进 lock");
});

// ---------------------------------------------------------------------------
// ★ 接线断言（源码级）：两个 segment-control 调用点 + app.js 的 dep 接线。
// 变异验证时删掉任一处，上面 6 条纯函数测试**全部照绿**。
// 本仓这类漏接线已复发多次（0.2.154 / 0.2.160 / 0.2.171 / 0.2.172）。
// ---------------------------------------------------------------------------
test("接线：segment-control 的增删两条路径都要通知，app.js 要接上 dep", () => {
  const seg = readFileSync(new URL("../modules/bones/segment-control.js", import.meta.url), "utf8");
  const hits = [...seg.matchAll(/deps\.onPanelSplitCountChanged\?\.\(/g)];
  assert.equal(hits.length, 2,
    `增删两条路径（changePanelSplitCount / deleteSelectedPanelSplit）都要通知，实测 ${hits.length} 处`);
  // 必须在 panelSplits 已经是新值之后调（重建按新 splits 派生）
  for (const fn of ["function changePanelSplitCount(", "function deleteSelectedPanelSplit("]) {
    const at = seg.indexOf(fn);
    assert.notEqual(at, -1, `找不到 ${fn}`);
    const body = seg.slice(at, seg.indexOf("\n}", at));
    const assignAt = body.indexOf("target.panelSplits = splits;");
    const notifyAt = body.indexOf("deps.onPanelSplitCountChanged?.(");
    assert.ok(assignAt >= 0 && notifyAt > assignAt,
      `${fn} 里通知必须发生在 target.panelSplits 赋新值之后`);
  }
  const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /onPanelSplitCountChanged:\s*handlePanelSplitCountChanged/,
    "app.js 必须把 handlePanelSplitCountChanged 接给 segmentControlDeps");
  const at = app.indexOf("function handlePanelSplitCountChanged(");
  assert.notEqual(at, -1, "找不到 handlePanelSplitCountChanged");
  const body = app.slice(at, app.indexOf("\n}", at));
  assert.match(body, /remapPanelBoneGroupsForSplitChange\(/, "必须调重映射");
  assert.match(body, /writeBackTierCurvesToLeaves\(/, "必须把孤立层的曲线写回叶子");
});
