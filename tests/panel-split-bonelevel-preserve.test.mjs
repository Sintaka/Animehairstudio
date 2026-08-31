// panel-split-bonelevel-preserve.test.mjs — 钳住 0.2.176 的修法：normalizePanelSplits 必须
// 透传 panelSplits[i].boneLevel，且只在合法时写这个键。
//
// 【bug 背景】用户报「选中 zipper 调层级，outliner 刷新正常，但点空位退出选择后层级又退回，
// 没触发可以多试几次」。根因链（主脑已用字节级读取逐条证实）：
//   1. app.js 的 normalizePanelSplits 结尾原本是硬白名单
//      `return entries.map((entry) => ({ position, height, order }))` ⇒ boneLevel 被静默丢弃。
//   2. clonePanelSplits 只是 normalizePanelSplits 的浅包装。
//   3. bone-view-handles.js 的 createBoneViewHandles 对 panel 几何**无条件**执行
//      `lock.panelSplits = deps.clonePanelSplits(...)`。
//   4. panel-bone-groups.js 的 rebuildPanelBoneGroupsFromLevels 对**未物化**的 lock 刻意返回
//      null、不写任何字段（物化会把树写进存档、凭空增大 .ahs，不该由改层级触发）。
//   ⇒ 未物化的 lock 改完层级，新层级只活在 panelSplits[i].boneLevel 这一个地方；下一次重建
//   把手（点空位退出选择就会触发）把它抹掉 ⇒ panelBoneGroupsFor 回落到按 height 派生 ⇒ 层级
//   回退。已物化的 lock 走「已物化树」那级回落，不受影响 ⇒ 表现为时有时无。
//
// 【修法】normalizePanelSplits 现在透传 boneLevel，但只在合法时写这个键（整数、落在
// [2, MAX_PANEL_BONE_DEPTH]，与 panel-bone-groups.js 的 isValidBoneLevel 同口径）；非法或
// 缺失时**根本不写这个键**（不是写 undefined、不是补默认值）。理由见 app.js 现场注释：
// ① 从未用过层级功能的旧档输出形状与从前逐字节相同；
// ② panelBoneGroupsFromLevels 要求「所有条目都合法」才生效，否则整体回落按 height 派生，
//    在这里编造一个层级会把那条回落悄悄变成「用假数据建树」。
//
// 【路线选择：A + B 都做】
// - normalizePanelSplits 是 app.js 内部函数，没有 export，本仓 650 条测试从不 import
//   app.js（21000 行 ESM 编排层）。路线 A（本仓既有惯例，见 tests/strand-segment-ui.test.mjs
//   的 appSource 用法）：① 用正则钉住 app.js 源码里确实有「透传」与「只在合法时写键」这两处
//   代码；② 把白名单逻辑复刻成本地纯函数，对复刻函数做行为断言。这只能证明「代码写对了」，
//   不能证明「丢字段真的会导致层级回退」这个因果。
// - panel-bone-groups.js 是可 import 的真模块，用它的真实导出（panelBoneGroupsFor /
//   forEachPanelBoneGroup / MAX_PANEL_BONE_DEPTH）在真实 Test 4 fixture 上验证「boneLevel
//   在则按 level 建树、boneLevel 被抹掉则回落 height 派生、两棵树的具体哪些叶子深度不同」——
//   这是路线 B，直接证明因果，且咬的是真实模块。
// 两条都做：B 证明因果，A 证明修复真的落在 app.js 里。
//
// 【真实 fixture】.tmp-bone-tree/archives/Scalp Conform Test 4.ahs（已 gitignore，只读，
// 用 python 读取 json.state.locks 确认过）的 `Front Bangs 1`（geometryType: "panel"）：
// 2 条 zipper，position 升序，height [0.3, 0.4]。与 tests/panel-bone-zipper-owner.test.mjs /
// tests/panel-bone-tip-carrier.test.mjs 的 TEST4_SPLITS 是同一份数据，派生树
// L1[0..2] -> L2[0..0] + L2[1..2] -> L3[1..1] + L3[2..2]（叶子深度签名 2,3,3）。
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  MAX_PANEL_BONE_DEPTH,
  panelBoneGroupsFor,
  forEachPanelBoneGroup
} from "../modules/bones/panel-bone-groups.js";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");

// Test 4「Front Bangs 1」的真实 panelSplits：2 条 zipper，position 升序，height [0.3, 0.4]。
// 与 panel-bone-zipper-owner.test.mjs / panel-bone-tip-carrier.test.mjs 的 TEST4_SPLITS 完全
// 一致（同一份数据，本文件不重新去读 .ahs，直接照抄已验证过的常量，避免多处解析同一份档）。
const TEST4_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// 叶子深度签名：按叶子顺序拼接 depth，用于比较两棵树的具体差异（不是只判「相不相等」）。
function leafDepthSignature(root) {
  const sig = [];
  forEachPanelBoneGroup(root, (node) => {
    if (!Array.isArray(node.children)) sig.push(node.depth);
  });
  return sig.join(",");
}

// ---------------------------------------------------------------------------
// 路线 A：app.js 源码里两处代码确实存在（正向 + 会咬中「删了就不通过」的负向对照）
// ---------------------------------------------------------------------------

test("app.js 源码：normalizePanelSplits 透传 boneLevel（不是硬白名单丢弃）", () => {
  // 透传点：构造 entries 时原样带上 split?.boneLevel（合法性校验推迟到输出映射处）。
  assert.match(
    appSource,
    /boneLevel:\s*split\?\.boneLevel,/,
    "app.js 应在 normalizePanelSplits 的 entries 构造里透传 split?.boneLevel"
  );
});

test("app.js 源码：只在合法时写 boneLevel 键（与 isValidBoneLevel 同口径的整数 2..MAX 判断）", () => {
  // 只写键点：Number.isInteger(level) && level >= 2 && level <= MAX_PANEL_BONE_DEPTH 才赋值。
  assert.match(
    appSource,
    /if\s*\(\s*Number\.isInteger\(level\)\s*&&\s*level\s*>=\s*2\s*&&\s*level\s*<=\s*MAX_PANEL_BONE_DEPTH\s*\)\s*split\.boneLevel\s*=\s*level;/,
    "app.js 应只在整数且落在 [2, MAX_PANEL_BONE_DEPTH] 时才写 split.boneLevel"
  );
});

test("负向对照：旧的硬白名单写法（写死 return { position, height, order }）已经不在源码里", () => {
  // 这条钉住「没有退回旧行为」：如果有人把上面两处代码删掉、退回逐字段硬编码的旧白名单，
  // 这条会先亮红灯（比只看新代码存在更能防止「新旧代码同时存在」这种半吊子状态）。
  assert.doesNotMatch(
    appSource,
    /return entries\.map\(\(entry\) => \(\{ position, height, order \}\)\);/,
    "normalizePanelSplits 不应再是硬编码 { position, height, order } 的白名单（那正是丢 boneLevel 的旧行为）"
  );
});

// 把 app.js 里的白名单逻辑复刻成本地纯函数，对复刻函数做行为断言（本仓惯例，见
// tests/strand-segment-ui.test.mjs）。复刻仅覆盖「取值 + 只在合法时写键」这一段，不复刻
// 整个 normalizePanelSplits（clamp/order 去重等与本 bug 无关，复刻会引入不必要的维护面）。
function whitelistBoneLevel(split, maxDepth = MAX_PANEL_BONE_DEPTH) {
  const out = { position: split.position, height: split.height, order: split.order };
  const level = split.boneLevel;
  if (Number.isInteger(level) && level >= 2 && level <= maxDepth) out.boneLevel = level;
  return out;
}

// 与「删掉 if、直接透传」的旧硬白名单对照：模拟 bug 发生前的行为，证明负向对照确实会红。
function legacyHardWhitelist(split) {
  return { position: split.position, height: split.height, order: split.order };
}

test("合法 boneLevel（2 和 MAX_PANEL_BONE_DEPTH）被保留、值不变", () => {
  const legal = [
    { position: 0, height: 0.3, order: 0, boneLevel: 2 },
    { position: 1, height: 0.4, order: 1, boneLevel: MAX_PANEL_BONE_DEPTH }
  ];
  for (const split of legal) {
    const out = whitelistBoneLevel(split);
    assert.equal(
      Object.prototype.hasOwnProperty.call(out, "boneLevel"),
      true,
      `boneLevel=${split.boneLevel} 应保留这个键`
    );
    assert.equal(out.boneLevel, split.boneLevel, "保留的值必须与入参一致");
  }
});

test("非法 boneLevel（1/0/null/undefined/2.5/字符串/超上限）一律不写这个键", () => {
  const illegalValues = [1, 0, null, undefined, 2.5, "3", MAX_PANEL_BONE_DEPTH + 1, -2, NaN, Infinity];
  for (const boneLevel of illegalValues) {
    const split = { position: 0, height: 0.3, order: 0, boneLevel };
    const out = whitelistBoneLevel(split);
    assert.equal(
      Object.prototype.hasOwnProperty.call(out, "boneLevel"),
      false,
      `boneLevel=${JSON.stringify(boneLevel)} 不应写出这个键（不是 undefined 值，是没有这个 key）`
    );
  }
});

test("MAX_PANEL_BONE_DEPTH 边界：等于上限保留，上限+1 不写键", () => {
  const atLimit = whitelistBoneLevel({ position: 0, height: 0.3, order: 0, boneLevel: MAX_PANEL_BONE_DEPTH });
  assert.equal(Object.prototype.hasOwnProperty.call(atLimit, "boneLevel"), true, "等于上限应保留");
  assert.equal(atLimit.boneLevel, MAX_PANEL_BONE_DEPTH);

  const overLimit = whitelistBoneLevel({ position: 0, height: 0.3, order: 0, boneLevel: MAX_PANEL_BONE_DEPTH + 1 });
  assert.equal(Object.prototype.hasOwnProperty.call(overLimit, "boneLevel"), false, "上限+1 不应写键");
});

test("旧档形状不变：不带 boneLevel 的 splits，输出键集合恰好是 [position, height, order]", () => {
  const legacy = { position: -0.3333333333333333, height: 0.3, order: 0 };
  const out = whitelistBoneLevel(legacy);
  assert.deepStrictEqual(
    Object.keys(out).sort(),
    ["height", "order", "position"],
    "旧档（从未用过层级功能）经白名单后不应凭空多出任何字段"
  );
});

// ---------------------------------------------------------------------------
// 负向对照：证明「没修好」时会怎样红（旧硬白名单会丢字段，键集合完全一样、区分不出合法值）
// ---------------------------------------------------------------------------

test("负向对照：旧硬白名单对合法 boneLevel 也会丢字段（证明这条判据真的有分辨力）", () => {
  const legal = { position: 0, height: 0.3, order: 0, boneLevel: 3 };
  const fixed = whitelistBoneLevel(legal);
  const legacy = legacyHardWhitelist(legal);
  assert.equal(Object.prototype.hasOwnProperty.call(fixed, "boneLevel"), true, "修复后的白名单应保留合法值");
  assert.equal(Object.prototype.hasOwnProperty.call(legacy, "boneLevel"), false, "旧硬白名单应丢掉这个键（这就是 bug 本身）");
});

// ---------------------------------------------------------------------------
// 路线 B：用真实 Test 4 fixture 证明因果——丢字段真的会让分组树回退到按 height 派生。
// panelBoneGroupsFor 的回落链：① lock.panelBoneGroups（已物化）→ ② panelSplits[i].boneLevel
// （阶段 3 显式层级）→ ③ 按 height 派生。这里模拟「未物化的 lock」（panelBoneGroups 为空），
// 只对比 ② 与 ③ 的差异，这正是本 bug 的落点。
// ---------------------------------------------------------------------------

// 先确认造的 boneLevel 组合合法、且真的能建出与 height 派生不同的树（否则这条判据空转）：
// height 派生（[0.3, 0.4]）给出 2,3,3（根下 L2[0..0] 单叶 + L2[1..2] 再分两个 L3）。
// 人为把两条 zipper 都设成合法层级 boneLevel=2（意图「两条都在根这一层切」），建出的树是
// 三个平级 L2（2,2,2）——与派生树在「第二、第三个叶子的深度」上明确不同（3 变 2），不是
// 只判「不相等」，而是钉住具体哪个叶子、深度从几变成几。
test("因果：真实 Test 4 splits 带合法 boneLevel 建树 vs 抹掉 boneLevel 回落 height 派生，两棵树不同", () => {
  const withLevels = TEST4_SPLITS.map((split) => ({ ...split, boneLevel: 2 }));
  // 先证明这个组合合法且真的会改变树形，不是空转判据。
  for (const split of withLevels) {
    assert.ok(
      Number.isInteger(split.boneLevel) && split.boneLevel >= 2 && split.boneLevel <= MAX_PANEL_BONE_DEPTH,
      "人为设的 boneLevel 必须先通过合法性校验，否则下面的因果对照没有意义"
    );
  }

  const lockWithLevels = { geometryType: "panel", panelBoneGroups: null, panelSplits: withLevels };
  const treeWithLevels = panelBoneGroupsFor(lockWithLevels);
  const sigWithLevels = leafDepthSignature(treeWithLevels);

  // 模拟「重建把手时 clonePanelSplits 丢字段」：抹掉 boneLevel，只剩 position/height/order。
  const stripped = withLevels.map(({ boneLevel, ...rest }) => rest);
  const lockStripped = { geometryType: "panel", panelBoneGroups: null, panelSplits: stripped };
  const treeStripped = panelBoneGroupsFor(lockStripped);
  const sigStripped = leafDepthSignature(treeStripped);

  // 幅度断言：不只判「不相等」，钉住具体差异——叶子 0 的深度不变（2），叶子 1/2 的深度从
  // 显式层级下的 2 回退到按 height 派生的 3（这正是用户报的「层级回退」在数据层的样子）。
  assert.equal(sigWithLevels, "2,2,2", "带合法 boneLevel=2,2 时应建出三个平级 L2（根下三个叶子同深度）");
  assert.equal(sigStripped, "2,3,3", "抹掉 boneLevel 后应回落 height 派生（叶子 0 单独 L2，叶子 1/2 落到 L3）");
  assert.notEqual(sigWithLevels, sigStripped, "两棵树必须不同——这就是丢字段导致层级回退的直接证据");
  // 逐叶子钉住：叶子 0 深度不受影响（两种路径都是根下第一个直接分支），叶子 1/2 的深度
  // 从 2 回退到 3，差值恰好 1（多退回一层嵌套），不是任意方向的不同。
  const depthsWithLevels = sigWithLevels.split(",").map(Number);
  const depthsStripped = sigStripped.split(",").map(Number);
  assert.equal(depthsWithLevels[0], depthsStripped[0], "叶子 0 的深度两种路径应一致");
  assert.equal(depthsStripped[1] - depthsWithLevels[1], 1, "叶子 1 的深度应恰好回退一层");
  assert.equal(depthsStripped[2] - depthsWithLevels[2], 1, "叶子 2 的深度应恰好回退一层");
});

test("因果对照的另一半：只抹掉其中一条 zipper 的 boneLevel（部分非法）同样整体回落 height 派生", () => {
  // panelBoneGroupsFromLevels 要求「所有条目都合法」才生效，否则整体回落——这是 app.js
  // 注释里点名的关键行为：修复者若在这里编造一个层级，会把这条回落悄悄改成「用假数据建树」。
  // 这条用例证明真实模块确实是「一条不合法就整体回落」，不是「逐条各自回落」。
  const withLevels = TEST4_SPLITS.map((split) => ({ ...split, boneLevel: 2 }));
  const partial = [{ ...withLevels[0] }, (() => { const { boneLevel, ...rest } = withLevels[1]; return rest; })()];
  const lockPartial = { geometryType: "panel", panelBoneGroups: null, panelSplits: partial };
  const treePartial = panelBoneGroupsFor(lockPartial);
  assert.equal(
    leafDepthSignature(treePartial),
    "2,3,3",
    "只要有一条 boneLevel 不合法，整体就应回落 height 派生（与全部抹掉时的树完全相同）"
  );
});


