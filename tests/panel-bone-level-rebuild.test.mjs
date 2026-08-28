// panel-bone-level-rebuild.test.mjs — 改 zipper 层级后重建分组树（0.2.171）回归测试。
//
// 背景（用户报「现在还不能改变 zipper 的层级」）：panelBoneGroupsFor 的回落链是
// 「stored → 按 boneLevel 建树 → 按 height 派生」，stored 优先。而 changeBoneLevel 只写
// panelSplits[i].boneLevel，不碰 lock.panelBoneGroups ⇒ 一旦该 lock 被物化过，改层级
// **只变数字不变树**。物化不需要用户刻意做什么：resolveTipHost 显示中间层把手时就会物化。
// 四个真实档全部复现。
//
// 本文件钉住 rebuildPanelBoneGroupsFromLevels 的三条语义：
//   ① 已物化 ⇒ 重建，树真的变
//   ② 未物化 ⇒ 不写任何字段（不因改层级而把树写进存档）
//   ③ span 相同的节点，创作值必须跟着搬过去；span 消失的层，值丢失是固有代价
import assert from "node:assert/strict";
import test from "node:test";
import {
  panelBoneGroupsFor,
  materializePanelBoneGroups,
  promotePanelBoneLevel,
  canPromotePanelBoneLevel,
  rebuildPanelBoneGroupsFromLevels,
  setPanelBoneGroupValue,
  forEachPanelBoneGroup
} from "../modules/bones/panel-bone-groups.js";

// 4 条 zipper、height 严格递增 ⇒ 派生成有多层的树（每层恰一个切点的二叉链）。
const SPLITS = () => [
  { position: -0.6, height: 0.2, order: 0 },
  { position: -0.2, height: 0.3, order: 1 },
  { position: 0.2, height: 0.4, order: 2 },
  { position: 0.6, height: 0.5, order: 3 }
];
const makeLock = () => ({ id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: SPLITS() });

const sig = (root) => {
  const out = [];
  forEachPanelBoneGroup(root, (n, path) => out.push(`${path.length}[${n.leafStart}..${n.leafEnd}]`));
  return out.join(" ");
};
const spansOf = (root) => {
  const s = new Set();
  forEachPanelBoneGroup(root, (n) => s.add(`${n.leafStart}:${n.leafEnd}`));
  return s;
};
const firstPromotable = (splits) => splits.findIndex((_, i) => canPromotePanelBoneLevel(splits, i));

// ---------------------------------------------------------------------------
// 1. ★ 核心：已物化的 lock 改层级后，有效树必须真的变。
//    含负向对照：不调重建时树不变（证明这条判据有分辨力，也复现了原缺陷）。
// ---------------------------------------------------------------------------
test("核心：已物化后改层级，重建过的树会变；不重建则不变（原缺陷）", () => {
  const idx = firstPromotable(SPLITS());
  assert.ok(idx >= 0, "fixture 必须有可升级的 zipper，否则本测试无意义");

  // 负向对照 = 原缺陷行为
  const bad = makeLock();
  materializePanelBoneGroups(bad);
  const beforeBad = sig(panelBoneGroupsFor(bad));
  bad.panelSplits = promotePanelBoneLevel(bad.panelSplits, idx);
  assert.equal(sig(panelBoneGroupsFor(bad)), beforeBad,
    "对照：只写 panelSplits 时树必须不变（这正是被修的缺陷；若它变了说明回落链改了，本测试需重写）");

  // 修法
  const good = makeLock();
  materializePanelBoneGroups(good);
  const beforeGood = sig(panelBoneGroupsFor(good));
  good.panelSplits = promotePanelBoneLevel(good.panelSplits, idx);
  const result = rebuildPanelBoneGroupsFromLevels(good);
  assert.ok(result, "已物化的 lock 必须返回重建结果");
  assert.notEqual(sig(panelBoneGroupsFor(good)), beforeGood, "重建后树必须变");
});

// ---------------------------------------------------------------------------
// 2. 未物化 ⇒ 不写任何字段。改层级不该把树写进存档（会凭空增大 .ahs 且让后续派生失效）。
// ---------------------------------------------------------------------------
test("未物化的 lock：重建是 no-op，不写 panelBoneGroups", () => {
  const lock = makeLock();
  assert.equal(lock.panelBoneGroups, undefined, "前提：fixture 未物化");
  const idx = firstPromotable(lock.panelSplits);
  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  const result = rebuildPanelBoneGroupsFromLevels(lock);
  assert.equal(result, null, "未物化时应返回 null");
  assert.equal(lock.panelBoneGroups, undefined, "不得把树写进 lock（现场派生本来就正确）");
  // 而现场派生确实反映了新层级
  assert.ok(sig(panelBoneGroupsFor(lock)).length > 0, "现场派生仍可用");
});

// ---------------------------------------------------------------------------
// 3. ★ 创作值移植：span 相同的中间层，值必须跟着搬过去。
// ---------------------------------------------------------------------------
test("移植：改层级后仍存在的 span，其创作值必须保留", () => {
  const lock = makeLock();
  materializePanelBoneGroups(lock);
  const idx = firstPromotable(lock.panelSplits);

  // 先算出「改完之后会有哪些 span」，挑一个存活的非叶层来写创作值 ——
  // 否则可能挑到恰好被这次升级摧毁的那一层，移植路径根本不会被执行（探针上踩过）。
  const probe = makeLock();
  probe.panelSplits = promotePanelBoneLevel(probe.panelSplits, idx);
  const future = spansOf(panelBoneGroupsFor(probe));

  let path = null;
  let span = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n, p) => {
    if (path || !Array.isArray(n.children) || p.length === 0) return;
    const key = `${n.leafStart}:${n.leafEnd}`;
    if (future.has(key)) { path = p; span = key; }
  });
  assert.ok(path, "fixture 必须有一个改层级后仍存活的非叶中间层，否则本测试无分辨力");

  setPanelBoneGroupValue(lock, path, "taperCurve",
    [{ position: 0, value: 0.77, interpolation: "linear" }]);

  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  const result = rebuildPanelBoneGroupsFromLevels(lock);
  assert.ok(result.movedValues >= 1, `必须至少移植一个创作值，实测 ${result.movedValues}`);

  let found = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n) => {
    if (`${n.leafStart}:${n.leafEnd}` === span) found = n;
  });
  assert.ok(found, `span ${span} 应仍存在于新树`);
  assert.equal(found.taperCurve?.[0]?.value, 0.77, "创作值必须原样保留");
});

// ---------------------------------------------------------------------------
// 4. tip（发尖链）同样要移植。它不在 AUTHORABLE_KEYS 里（刻意的：tip 是「这一层有没有
//    自己的骨骼」，不沿链回落），所以走的是独立分支，需要单独覆盖。
// ---------------------------------------------------------------------------
test("移植：中间层的 tip 发尖链也必须跟着搬", () => {
  const lock = makeLock();
  materializePanelBoneGroups(lock);
  const idx = firstPromotable(lock.panelSplits);
  const probe = makeLock();
  probe.panelSplits = promotePanelBoneLevel(probe.panelSplits, idx);
  const future = spansOf(panelBoneGroupsFor(probe));

  // ★ 必须遍历 lock.panelBoneGroups（活引用）而不是 panelBoneGroupsFor 的返回值 ——
  // 后者每次调用都返回**新的归一化副本**（实测两次调用引用不等、且都不等于
  // lock.panelBoneGroups），往它上面写字段会写进临时对象、被静默丢弃。
  let target = null;
  let span = null;
  forEachPanelBoneGroup(lock.panelBoneGroups, (n, p) => {
    if (target || !Array.isArray(n.children) || p.length === 0) return;
    const key = `${n.leafStart}:${n.leafEnd}`;
    if (future.has(key)) { target = n; span = key; }
  });
  assert.ok(target, "需要一个存活的非叶层");
  target.tip = { points: [{ x: 1, y: 2, z: 3 }], restPoints: [{ x: 0, y: 0, z: 0 }], twists: null, active: true };

  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  rebuildPanelBoneGroupsFromLevels(lock);

  let found = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n) => {
    if (`${n.leafStart}:${n.leafEnd}` === span) found = n;
  });
  assert.equal(found?.tip?.points?.[0]?.x, 1, "tip 必须被移植（它不在 AUTHORABLE_KEYS 里，走独立分支）");
});

// ---------------------------------------------------------------------------
// 5. span 消失的层，创作值丢失是固有代价 —— 但必须被计数上报，不能静默。
// ---------------------------------------------------------------------------
test("span 消失的层：值丢失被计入 droppedNodes（不静默）", () => {
  const lock = makeLock();
  materializePanelBoneGroups(lock);
  const idx = firstPromotable(lock.panelSplits);
  const probe = makeLock();
  probe.panelSplits = promotePanelBoneLevel(probe.panelSplits, idx);
  const future = spansOf(panelBoneGroupsFor(probe));

  // 这次刻意挑一个**会消失**的非叶层。同上：走活引用 lock.panelBoneGroups。
  let target = null;
  forEachPanelBoneGroup(lock.panelBoneGroups, (n, p) => {
    if (target || !Array.isArray(n.children) || p.length === 0) return;
    if (!future.has(`${n.leafStart}:${n.leafEnd}`)) target = n;
  });
  if (!target) return; // 该 fixture 下没有会消失的层，跳过（不是失败）
  target.taperCurve = [{ position: 0, value: 0.5, interpolation: "linear" }];

  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  const result = rebuildPanelBoneGroupsFromLevels(lock);
  assert.ok(result.droppedNodes >= 1,
    `消失的层带着创作值时必须计入 droppedNodes，实测 ${result.droppedNodes}`);
});

// ---------------------------------------------------------------------------
// ★ 接线断言（源码级）：changeBoneLevel 必须真的调用重建。
//
// 为什么非要这一条：变异验证时把 app.js 里那行 rebuildPanelBoneGroupsFromLevels(lock)
// 删掉，上面 5 条纯函数测试**全部照绿** —— 它们只证明函数本身对，不证明调用方用了它。
// 漏接线的后果就是用户报的原症状（改层级只变数字不变树），而且是静默的。
// 本仓已有同类先例：panel-bone-level-wiring.test.mjs 就是为「层级按钮只改数字不改树」
// 那次漏接线补的。纯函数测试的密度不能替代端到端接线检查。
// ---------------------------------------------------------------------------
test("接线：app.js 的 changeBoneLevel 必须调用 rebuildPanelBoneGroupsFromLevels", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const at = src.indexOf("function changeBoneLevel(");
  assert.notEqual(at, -1, "找不到 changeBoneLevel");
  const body = src.slice(at, src.indexOf("\n}", at));
  assert.match(body, /rebuildPanelBoneGroupsFromLevels\(lock\)/,
    "changeBoneLevel 必须重建分组树，否则已物化的 lock 改层级会静默失效");
  // 顺序也要对：必须在写完 panelSplits **之后**重建（重建读的是新的 boneLevel）。
  const assignAt = body.search(/lock\.panelSplits\s*=/);
  const rebuildAt = body.search(/rebuildPanelBoneGroupsFromLevels\(lock\)/);
  assert.ok(assignAt >= 0 && rebuildAt > assignAt,
    "重建必须发生在 lock.panelSplits 赋值之后（它读的是新写入的 boneLevel）");
  // 标识符必须在 import 列表里（本仓踩过「用了但忘了 import」，node --check 与纯函数测试都抓不到）
  const importLine = src.split("\n").find((l) => l.includes("panel-bone-groups.js?v="));
  assert.ok(importLine && importLine.includes("rebuildPanelBoneGroupsFromLevels"),
    "rebuildPanelBoneGroupsFromLevels 必须出现在 panel-bone-groups.js 的 import 列表里");
});

// ---------------------------------------------------------------------------
// 6. 幂等：连续重建两次，树不再变。
// ---------------------------------------------------------------------------
test("幂等：重复重建不再改变树", () => {
  const lock = makeLock();
  materializePanelBoneGroups(lock);
  const idx = firstPromotable(lock.panelSplits);
  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  rebuildPanelBoneGroupsFromLevels(lock);
  const once = sig(panelBoneGroupsFor(lock));
  rebuildPanelBoneGroupsFromLevels(lock);
  assert.equal(sig(panelBoneGroupsFor(lock)), once, "第二次重建不该再改变树");
});
