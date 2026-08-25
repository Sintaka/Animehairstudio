// panel-bone-levels.test.mjs — zipper 层级显式存储 + 按钮升/降（modules/bones/panel-bone-groups.js 阶段 3）。
//
// 背景：现有 derivePanelBoneGroups 只能从 height 派生层级（只读展示用）。本阶段要让用户能用
// 按钮显式指定/调整某条 zipper 的层级，于是层级从「height 派生量」变成「可显式存储的量」
// （panelSplits[i].boneLevel）。核心风险是「意图」（存储的 boneLevel）与「实际嵌套深度」
// （建树后该 zipper 真正落在第几层）会漂移——normalizePanelBoneLevels 就是为了让两者恒等
// 而存在，否则 UI 按钮会出现「数字变了、树没变」的假象。
//
// 三组真实档数据（.tmp-bone-tree/archives/，已 gitignore，来自主脑给定的坐标）：
//   Scalp Conform Test 1.ahs  / Side Bangs Left 1 → heights [0.3, 0.3]（3 叶子，派生 L2）
//   Scalp Conform Test 3.ahs  / Front Bangs 1     → heights [0.53125,0.21875,0.3125,0.4375,0.5]
//                                                    （6 叶子，派生恰好 L5，不触发钳位）
//   Sussurro_v1_0060.ahs      / Front Bangs 3     → heights [0.3125,0.1875,0.25,0.125]
//                                                    （5 叶子，派生 L4）
// 已用 node --check 单独跑过 derivePanelBoneGroups 确认这三组 maxDepth 分别是 2/5/4，
// 与主脑给出的预期一致（见本轮报告）。
import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PANEL_BONE_DEPTH,
  derivePanelBoneGroups,
  panelBoneGroupsLeafPartition,
  forEachPanelBoneGroup,
  materializePanelBoneLevels,
  panelBoneGroupsFromLevels,
  normalizePanelBoneLevels,
  promotePanelBoneLevel,
  demotePanelBoneLevel,
  canPromotePanelBoneLevel,
  canDemotePanelBoneLevel
} from "../modules/bones/panel-bone-groups.js";

// heights 数组 -> zipper 数组，position 严格升序（与既有 derive 测试同一套构造方式）。
function zippersFromHeights(heights) {
  return heights.map((height, index) => ({ position: index, height, order: index }));
}

function maxDepthOf(node) {
  if (!node.children) return node.depth;
  return Math.max(...node.children.map(maxDepthOf));
}

// 树的「叶子深度分布」签名：按叶子顺序拼接 depth，用于比较两棵树是否结构等价
// （比逐字段深比较更直接地回答「promote/demote 是否真的改变了树」）。
function leafDepthSignature(root) {
  const sig = [];
  forEachPanelBoneGroup(root, (node) => {
    if (!Array.isArray(node.children)) sig.push(node.depth);
  });
  return sig.join(",");
}

// 三组真实档用例：[heights, 期望的派生 maxDepth]。
const REAL_CASES = [
  { label: "ScalpConformTest1 SideBangsLeft1", heights: [0.3, 0.3], expectedMaxDepth: 2 },
  {
    label: "ScalpConformTest3 FrontBangs1",
    heights: [0.53125, 0.21875, 0.3125, 0.4375, 0.5],
    expectedMaxDepth: 5
  },
  { label: "Sussurro FrontBangs3", heights: [0.3125, 0.1875, 0.25, 0.125], expectedMaxDepth: 4 }
];

test("三组真实档：派生 maxDepth 与预期一致（作为后续物化/规范化用例的地基）", () => {
  for (const { label, heights, expectedMaxDepth } of REAL_CASES) {
    const root = derivePanelBoneGroups(zippersFromHeights(heights));
    assert.equal(maxDepthOf(root), expectedMaxDepth, `${label}: 派生 maxDepth 应为 ${expectedMaxDepth}`);
  }
});

// === 必测 1：物化不改变形状（整套设计的地基） ===
// materializePanelBoneLevels 只是把「实际深度」写成显式 boneLevel，不改变叶子划分/结构；
// 用物化结果重新建树（panelBoneGroupsFromLevels），必须与 derivePanelBoneGroups 的树逐字段
// 深相等——这保证了「从派生迁移到显式存储」这一步是零风险的。
test("materializePanelBoneLevels 后每条都有合法 boneLevel，且重建树与派生树逐字段深相等", () => {
  for (const { label, heights } of REAL_CASES) {
    const splits = zippersFromHeights(heights);
    const derived = derivePanelBoneGroups(splits);
    const materialized = materializePanelBoneLevels(splits);
    assert.equal(materialized.length, splits.length, `${label}: 物化后长度不变`);
    for (const split of materialized) {
      assert.ok(
        Number.isInteger(split.boneLevel) && split.boneLevel >= 2 && split.boneLevel <= MAX_PANEL_BONE_DEPTH,
        `${label}: boneLevel 必须是 [2, MAX_PANEL_BONE_DEPTH] 内的整数，实际 ${split.boneLevel}`
      );
    }
    const rebuilt = panelBoneGroupsFromLevels(materialized);
    assert.deepEqual(rebuilt, derived, `${label}: 用物化后的显式 level 重建的树必须与派生树逐字段深相等`);
  }
});

// 已有合法 boneLevel 的条目：物化不覆盖原值。
test("materializePanelBoneLevels 保留已有的合法 boneLevel，不覆盖", () => {
  const splits = zippersFromHeights([0.3, 0.3]).map((s, i) => (i === 0 ? { ...s, boneLevel: 4 } : s));
  const materialized = materializePanelBoneLevels(splits);
  assert.equal(materialized[0].boneLevel, 4, "已有合法 boneLevel 必须原样保留");
});

// materializePanelBoneLevels 不原地修改入参（返回新数组、每条浅拷贝）。
test("materializePanelBoneLevels 不原地修改入参", () => {
  const splits = zippersFromHeights([0.3, 0.3]);
  const before = JSON.stringify(splits);
  materializePanelBoneLevels(splits);
  assert.equal(JSON.stringify(splits), before, "入参必须原样未变");
});

// === 必测 2：规范化幂等，且规范化后「boneLevel === 实际深度」 ===
test("normalizePanelBoneLevels 幂等，且规范化后每条 boneLevel 等于它在树里的实际深度", () => {
  for (const { label, heights } of REAL_CASES) {
    const splits = zippersFromHeights(heights);
    const once = normalizePanelBoneLevels(materializePanelBoneLevels(splits));
    const twice = normalizePanelBoneLevels(once);
    assert.deepEqual(twice, once, `${label}: normalize(normalize(x)) 必须与 normalize(x) 深相等`);

    // 显示值 === 实际深度：用规范化后的 level 重建树，查每条 zipper 分隔处的真实深度。
    const root = panelBoneGroupsFromLevels(once);
    const depths = [];
    forEachPanelBoneGroup(root, (node) => {
      if (Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length - 1; i += 1) {
          depths[node.children[i].leafEnd] = node.children[i].depth;
        }
      }
    });
    once.forEach((split, index) => {
      assert.equal(split.boneLevel, depths[index], `${label}: zipper[${index}] 的 boneLevel 必须等于实际嵌套深度`);
    });
  }
});

// === 必测 3：漂移专例 —— 三条全部 boneLevel=5，规范化后必须变成实际深度（不再是 5） ===
// 这是主脑在需求里点名的反例：根（depth=1）内部最小 level 是 5 ⇒ 在这里切 ⇒ 子节点实际
// 深度是 2，不是存储的意图值 5。若规范化没生效，这条测试必须失败在「level 仍是 5」上。
test("三条 zipper 全部 boneLevel=5 的漂移例子：规范化后 level 变成实际深度 2，不再是 5", () => {
  const drifted = zippersFromHeights([0.1, 0.1, 0.1]).map((s) => ({ ...s, boneLevel: 5 }));
  const normalized = normalizePanelBoneLevels(drifted);
  for (const split of normalized) {
    assert.equal(split.boneLevel, 2, "根内部最小 level 处切分 ⇒ 子节点实际深度是 2，不是漂移前存储的 5");
  }
  // 交叉验证：用规范化后的 level 建树，最大深度也确实是 2（三个平级兄弟，与 derive 版
  // 「同 height 留同层」的形状一致）。
  const root = panelBoneGroupsFromLevels(normalized);
  assert.equal(maxDepthOf(root), 2);
  // 3 条 zipper 同时在根这一层切分 ⇒ 4 个叶子全部变成根的平级子节点（3 条切分产生 4 段）。
  assert.equal(root.children.length, 4, "三条全部同层切分，根下应有四个平级叶子兄弟（4 段）");
});

// === 必测 4：demote 使某处比兄弟更深，promote 回来后与原始深相等（往返可逆） ===
// 用「3 条同层兄弟（全 level=2）」这个干净构造：demote 中间一条会让它单独多出一层，
// promote 回来后必须与规范化后的原始数组逐字段深相等。
test("demote 一条使其比兄弟更深，promote 回来后与规范化的原始树深相等（往返可逆）", () => {
  const base = zippersFromHeights([0.1, 0.1, 0.1]).map((s) => ({ ...s, boneLevel: 2 }));
  const normBase = normalizePanelBoneLevels(base);
  const baseRoot = panelBoneGroupsFromLevels(normBase);

  const demoted = demotePanelBoneLevel(base, 1);
  const demotedRoot = panelBoneGroupsFromLevels(demoted);
  assert.notEqual(leafDepthSignature(demotedRoot), leafDepthSignature(baseRoot), "demote 后树必须真的变化");
  assert.equal(demoted[1].boneLevel, 3, "被 demote 的那条 level 应加深一层");

  const promotedBack = promotePanelBoneLevel(demoted, 1);
  assert.deepEqual(promotedBack, normBase, "promote 回来后必须与规范化的原始数组逐字段深相等（往返可逆）");
});

// === 必测 5：边界 no-op —— level=2 再 promote、level=MAX 再 demote ===
test("边界 no-op：level=2 再 promote 结果与入参深相等，canPromote 为 false", () => {
  const atMin = zippersFromHeights([0.1, 0.1, 0.1]).map((s) => ({ ...s, boneLevel: 2 }));
  const normAtMin = normalizePanelBoneLevels(atMin);
  const promoted = promotePanelBoneLevel(normAtMin, 0);
  assert.deepEqual(promoted, normAtMin, "已到 level=2 下界，promote 必须是 no-op（返回与入参深相等的新数组）");
  assert.equal(canPromotePanelBoneLevel(normAtMin, 0), false, "level=2 时 canPromote 必须为 false");
});

test("边界 no-op：level=MAX 再 demote 结果与入参深相等，canDemote 为 false", () => {
  // 用 Test3 FrontBangs1（恰好 L5、不触发钳位）的真实档：物化后最后一条 zipper 的实际深度
  // 就是 MAX_PANEL_BONE_DEPTH（5）。不能用「三条同层全设 MAX」构造——那样规范化会把它们
  // 拉回到根这一层的实际深度 2（与漂移测试同理），根本到不了 MAX 边界。
  const splits = zippersFromHeights([0.53125, 0.21875, 0.3125, 0.4375, 0.5]);
  const materialized = materializePanelBoneLevels(splits);
  const lastIndex = materialized.length - 1;
  assert.equal(materialized[lastIndex].boneLevel, MAX_PANEL_BONE_DEPTH, "该真实档最后一条 zipper 的实际深度必须恰好是 MAX");

  const demoted = demotePanelBoneLevel(materialized, lastIndex);
  assert.deepEqual(demoted, materialized, "已到 level=MAX 上界，demote 必须是 no-op（返回与入参深相等的新数组）");
  assert.equal(canDemotePanelBoneLevel(materialized, lastIndex), false, "level=MAX 时 canDemote 必须为 false");
});

// === 必测 6：canPromote/canDemote 与实际效果一致 ===
// 对三组真实档的每条 zipper，逐一验证判据与「跑一遍是否真的改变树」完全吻合。
test("canPromote/canDemote 与实际效果一致：对每条 zipper 逐一核对", () => {
  for (const { label, heights } of REAL_CASES) {
    const splits = zippersFromHeights(heights);
    const materialized = materializePanelBoneLevels(splits);
    const baseRoot = panelBoneGroupsFromLevels(materialized);
    const baseSig = leafDepthSignature(baseRoot);

    materialized.forEach((_, index) => {
      const canP = canPromotePanelBoneLevel(materialized, index);
      const promotedSig = leafDepthSignature(panelBoneGroupsFromLevels(promotePanelBoneLevel(materialized, index)));
      assert.equal(canP, promotedSig !== baseSig, `${label}: zipper[${index}] canPromote 与实际是否改变树不一致`);

      const canD = canDemotePanelBoneLevel(materialized, index);
      const demotedSig = leafDepthSignature(panelBoneGroupsFromLevels(demotePanelBoneLevel(materialized, index)));
      assert.equal(canD, demotedSig !== baseSig, `${label}: zipper[${index}] canDemote 与实际是否改变树不一致`);
    });
  }
});

// === 必测 7：叶子划分不变量 + position/height/order 未被修改（贯穿全部新函数） ===
test("全部新函数后叶子划分恒为 [[0,0],...,[N,N]]，且 position/height/order 未被修改", () => {
  for (const { label, heights } of REAL_CASES) {
    const splits = zippersFromHeights(heights);
    const leafCount = splits.length + 1;
    const expectedPartition = Array.from({ length: leafCount }, (_, i) => [i, i]);

    const materialized = materializePanelBoneLevels(splits);
    const fromLevelsRoot = panelBoneGroupsFromLevels(materialized);
    assert.deepEqual(panelBoneGroupsLeafPartition(fromLevelsRoot), expectedPartition, `${label}: fromLevels 叶子划分`);

    const normalized = normalizePanelBoneLevels(materialized);
    const normRoot = panelBoneGroupsFromLevels(normalized);
    assert.deepEqual(panelBoneGroupsLeafPartition(normRoot), expectedPartition, `${label}: normalize 后叶子划分`);

    const promoted = promotePanelBoneLevel(materialized, 0);
    const promotedRoot = panelBoneGroupsFromLevels(promoted);
    assert.deepEqual(panelBoneGroupsLeafPartition(promotedRoot), expectedPartition, `${label}: promote 后叶子划分`);

    const demoted = demotePanelBoneLevel(materialized, 0);
    const demotedRoot = panelBoneGroupsFromLevels(demoted);
    assert.deepEqual(panelBoneGroupsLeafPartition(demotedRoot), expectedPartition, `${label}: demote 后叶子划分`);

    // position / height / order 必须原样不变（改层级不改几何）。
    for (const result of [materialized, normalized, promoted, demoted]) {
      result.forEach((split, index) => {
        assert.equal(split.position, splits[index].position, `${label}: position 不得被修改`);
        assert.equal(split.height, splits[index].height, `${label}: height 不得被修改`);
        assert.equal(split.order, splits[index].order, `${label}: order 不得被修改`);
      });
    }
  }
});

// === 必测 8：入参未被原地修改（深拷贝对照） ===
test("panelBoneGroupsFromLevels / normalizePanelBoneLevels / promote / demote 均不原地修改入参", () => {
  const splits = zippersFromHeights([0.3125, 0.1875, 0.25, 0.125]).map((s, i) => ({ ...s, boneLevel: 3 + (i % 2) }));
  const before = JSON.stringify(splits);

  panelBoneGroupsFromLevels(splits);
  assert.equal(JSON.stringify(splits), before, "panelBoneGroupsFromLevels 后入参必须原样未变");

  normalizePanelBoneLevels(splits);
  assert.equal(JSON.stringify(splits), before, "normalizePanelBoneLevels 后入参必须原样未变");

  promotePanelBoneLevel(splits, 0);
  assert.equal(JSON.stringify(splits), before, "promotePanelBoneLevel 后入参必须原样未变");

  demotePanelBoneLevel(splits, 0);
  assert.equal(JSON.stringify(splits), before, "demotePanelBoneLevel 后入参必须原样未变");

  canPromotePanelBoneLevel(splits, 0);
  canDemotePanelBoneLevel(splits, 0);
  assert.equal(JSON.stringify(splits), before, "canPromote/canDemote 后入参必须原样未变");
});

// === 补充：panelBoneGroupsFromLevels 缺失/非法 boneLevel 时回落 derivePanelBoneGroups ===
test("panelBoneGroupsFromLevels：boneLevel 缺失或非法时回落 derivePanelBoneGroups", () => {
  const heights = [0.3, 0.3];
  const splits = zippersFromHeights(heights); // 完全没有 boneLevel 字段
  const derived = derivePanelBoneGroups(splits);
  assert.deepEqual(panelBoneGroupsFromLevels(splits), derived, "全部缺失 boneLevel 时必须回落派生结果");

  const partiallyInvalid = zippersFromHeights(heights).map((s, i) => (i === 0 ? { ...s, boneLevel: 99 } : s));
  assert.deepEqual(
    panelBoneGroupsFromLevels(partiallyInvalid),
    derived,
    "任何一条 boneLevel 非法（越界/非整数）时也必须整体回落派生结果"
  );

  const nonInteger = zippersFromHeights(heights).map((s, i) => (i === 0 ? { ...s, boneLevel: 2.5 } : { ...s, boneLevel: 3 }));
  assert.deepEqual(panelBoneGroupsFromLevels(nonInteger), derived, "非整数 boneLevel 也必须回落");
});

