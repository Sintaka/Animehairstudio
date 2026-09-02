// panel-bone-tip-clump-delta.test.mjs — 中间层 Tip Clump 的 delta 继承（本轮新增字段）。
//
// 背景：用户拍板 —— 叶子的最终 tipClump = clamp(叶子自己的 tipClump + 该叶子所有祖先中间层
// 的 tipClumpDelta 之和, 0, SPREAD_MAX)。delta 与本仓已有的 tip（发尖链）机制同构：都不进
// AUTHORABLE_KEYS 白名单（那是「沿链回落、第一个非 null 赢」的语义，delta 是「逐层累加」），
// 都用三个专用导出管理。
//
// ★ 本文件范围：只测 panel-bone-groups.js 的数据层（存储/归一化/累加读取/迁移保全）与
// panel-tip-strand.js 的 tierEffectiveTipClump（UI 用的「有效值」聚合）。tipWidthSpreadGap
// 的网格接线（任务 B 的一行核心编辑）因 blocking pre-check 未通过而**未实现**——4 个调用点
// 里 tipWidthEdgeRenderPoint / tipWidthEdgePosition（经中间层绿色把手渲染路径）会在中间层
// 被选中时拿到 vIdx（合成虚拟叶子号）而非真实叶子下标，若在那里接 delta 会重复计算祖先层
// 自己的贡献，已停下报告主脑，不在本文件覆盖那部分行为。
import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  MAX_PANEL_BONE_DEPTH,
  canPromotePanelBoneLevel,
  derivePanelBoneGroups,
  forEachPanelBoneGroup,
  materializePanelBoneGroups,
  panelBoneGroupAtPath,
  panelBoneGroupClumpDeltaForLeaf,
  panelBoneGroupClumpDeltaForPath,
  panelBoneGroupsFor,
  panelBoneGroupTipClumpDelta,
  promotePanelBoneLevel,
  rebuildPanelBoneGroupsFromLevels,
  remapPanelBoneGroupsForSplitChange,
  setPanelBoneGroupTipClumpDelta,
  setPanelBoneGroupValue
} from "../modules/bones/panel-bone-groups.js";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";

// ── fixture：真实档 Scalp Conform Test 4.ahs 的 Front Bangs 1（2 zipper，heights [0.3,0.4]）──
// 派生树：L1[0..2] -> L2[0..0](叶) + L2[1..2] -> L3[1..1](叶) + L3[2..2](叶)。
// 用于两层嵌套断言（[1] 覆盖 1..2，[1,x] 是它的叶子）。
const TEST4_SPLITS = () => [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// ── fixture：真实档 Scalp Conform Test 3.ahs 的 Front Bangs 1（5 zipper，heights 各不同）──
// 派生 maxDepth 恰好 5（不触发 clampedFlat），6 个叶子 tipClump 各不相同：
// [0.433125, 0.144375, 0.144375, 0.474375, 0.144375, 0.350625]（来自 splitBones，已在
// panel-bone-levels.test.mjs 的注释与主脑记录中复用过这批真实数字）。
// 树形（用 derivePanelBoneGroups 现场验证过，见本轮报告）：
//   [] 0..5 d1
//     [0]   0..1 d2
//       [0,0] 0..0 d3 叶
//       [0,1] 1..1 d3 叶
//     [1]   2..5 d2
//       [1,0]     2..2 d3 叶
//       [1,1]     3..5 d3
//         [1,1,0]     3..3 d4 叶
//         [1,1,1]     4..5 d4
//           [1,1,1,0]     4..4 d5 叶
//           [1,1,1,1]     5..5 d5 叶
const TEST3_SPLITS = () => [
  { position: -0.32999999999999996, height: 0.53125, order: 0 },
  { position: -0.27999999999999997, height: 0.21875, order: 1 },
  { position: -0.1466666666666666, height: 0.3125, order: 2 },
  { position: 0.18333333333333324, height: 0.4375, order: 3 },
  { position: 0.2933333333333333, height: 0.5, order: 4 }
];
const TEST3_LEAF_TIPCLUMP = [0.433125, 0.144375, 0.144375, 0.474375, 0.144375, 0.350625];

// ── fixture：真实档 Sussurro_v1_0060.ahs 的 Front Bangs 1（4 zipper，5 叶子）──
// tipClump 含 0（下界）与 0.928125（接近 SPREAD_MAX 上界），是钳位边界测试的好素材。
const SUSSURRO_LEAF_TIPCLUMP = [0.928125, 0.7837500000000001, 0.8456250000000001, 0.6, 0];

function makeLock(splits) {
  return { id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: splits.map((s) => ({ ...s })) };
}

// ---------------------------------------------------------------------------
// 1. 存储/读写基础：panelBoneGroupTipClumpDelta / setPanelBoneGroupTipClumpDelta。
// ---------------------------------------------------------------------------
test("写入/读取自己这一层的 delta，null 清除，非数字视为未创作", () => {
  const lock = makeLock(TEST4_SPLITS());
  materializePanelBoneGroups(lock);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), null, "未创作时应为 null");

  setPanelBoneGroupTipClumpDelta(lock, [1], 0.2);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), 0.2);

  setPanelBoneGroupTipClumpDelta(lock, [1], null);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), null, "null 必须清除");

  setPanelBoneGroupTipClumpDelta(lock, [1], "not-a-number");
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), null, "非数字局部降级为 null，不抛异常");

  assert.equal(setPanelBoneGroupTipClumpDelta(lock, [99], 0.1), null, "非法路径返回 null");
  assert.equal(setPanelBoneGroupTipClumpDelta(null, [1], 0.1), null, "lock 为 null 返回 null");
});

// ---------------------------------------------------------------------------
// 2. ★ 硬约束：tipClumpDelta 绝不能被当成 AUTHORABLE_KEYS 的一员——
//    setPanelBoneGroupValue/panelBoneGroupHasOwnValue 必须拒绝它。
// ---------------------------------------------------------------------------
test("硬约束：tipClumpDelta 不在 AUTHORABLE_KEYS 白名单里，setPanelBoneGroupValue 必须拒绝", () => {
  const lock = makeLock(TEST4_SPLITS());
  materializePanelBoneGroups(lock);
  assert.equal(setPanelBoneGroupValue(lock, [1], "tipClumpDelta", 0.5), null,
    "白名单函数必须拒绝这个 key（返回 null，不是把它当成普通字段写进去）");
  // 反向确认：真正的专用写入函数确实生效，证明上面的 null 不是「写入功能本身坏了」
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.5);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), 0.5, "专用导出必须能正常写入");
});

// ---------------------------------------------------------------------------
// 3. ★ 钳位口径：存储端不预先钳死组合值，只钳 delta 自身的合法范围
//    ([-SPREAD_MAX, SPREAD_MAX])；写入 -0.9 后读回必须仍是 -0.9（不是被和某个叶子值
//    组合后截断的数）。
// ---------------------------------------------------------------------------
test("存储端不预先钳位组合值：写入 -0.9 读回仍是 -0.9", () => {
  const lock = makeLock(TEST4_SPLITS());
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], -0.9);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), -0.9,
    "delta 本身在合法范围 [-0.99,0.99] 内，存储端不得改写它");
});

test("delta 越出 [-SPREAD_MAX, SPREAD_MAX] 视为非法，局部降级为 null", () => {
  const lock = makeLock(TEST4_SPLITS());
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 1.5);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), null, "超过 0.99 越界");
  setPanelBoneGroupTipClumpDelta(lock, [1], -1.5);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), null, "低于 -0.99 越界");
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.99);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), 0.99, "恰好等于上界应合法（闭区间）");
  setPanelBoneGroupTipClumpDelta(lock, [1], -0.99);
  assert.equal(panelBoneGroupTipClumpDelta(lock, [1]), -0.99, "恰好等于下界应合法（闭区间）");
});

// ---------------------------------------------------------------------------
// 4. ★ 累加真的发生：单层祖先 + 两层嵌套（L3 挂 L2），两个 delta 都要算进去。
//    用 Test 3 的真实 5-zipper 树（maxDepth=5，有真正的两层嵌套 [1,1] 挂在 [1] 下）。
//    数值互不相同（0.11 / -0.07 / 0.05），避免用常量掩盖「用错层/用错下标」的错误。
// ---------------------------------------------------------------------------
test("累加：单层祖先——叶 2（path [1,0]）只有一个祖先 [1]", () => {
  const lock = makeLock(TEST3_SPLITS());
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.11); // span 2..5
  assert.equal(panelBoneGroupClumpDeltaForLeaf(lock, 2), 0.11);
});

test("累加：两层嵌套——叶 3（path [1,1,0]）祖先是 [1] 与 [1,1]，两个 delta 都要计入", () => {
  const lock = makeLock(TEST3_SPLITS());
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.11);     // span 2..5，叶 3 的浅祖先
  setPanelBoneGroupTipClumpDelta(lock, [1, 1], -0.07); // span 3..5，叶 3 的深祖先
  const sum = panelBoneGroupClumpDeltaForLeaf(lock, 3);
  assert.ok(Math.abs(sum - 0.04) < 1e-9, `期望 0.11 + (-0.07) = 0.04，实测 ${sum}`);
  // 分辨力：只加一层（漏加任何一层）都不会得到 0.04
  assert.notEqual(sum, 0.11, "不能只算浅祖先");
  assert.notEqual(sum, -0.07, "不能只算深祖先");
});

test("累加：三层嵌套——叶 4（path [1,1,1,0]）三个祖先全部计入", () => {
  const lock = makeLock(TEST3_SPLITS());
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.11);        // span 2..5
  setPanelBoneGroupTipClumpDelta(lock, [1, 1], -0.07);    // span 3..5
  setPanelBoneGroupTipClumpDelta(lock, [1, 1, 1], 0.05);  // span 4..5
  const sum = panelBoneGroupClumpDeltaForLeaf(lock, 4);
  assert.ok(Math.abs(sum - 0.09) < 1e-9, `期望 0.11-0.07+0.05=0.09，实测 ${sum}`);
});

test("panelBoneGroupClumpDeltaForPath：中间层自己也嵌在更浅中间层下（L3 挂 L2）时的严格祖先求和", () => {
  const lock = makeLock(TEST3_SPLITS());
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.11);     // [1] 自己的 delta（不含在"祖先"里）
  setPanelBoneGroupTipClumpDelta(lock, [1, 1], -0.07); // 待查询节点 [1,1] 自己的 delta（同样不含）
  // path [1,1] 的严格祖先只有 [1]（不含 [1,1] 自己，不含根）
  assert.equal(panelBoneGroupClumpDeltaForPath(lock, [1, 1]), 0.11);
  // path [1,1,1] 的严格祖先是 [1] 与 [1,1]
  setPanelBoneGroupTipClumpDelta(lock, [1, 1, 1], 0.05);
  const sum = panelBoneGroupClumpDeltaForPath(lock, [1, 1, 1]);
  assert.ok(Math.abs(sum - 0.04) < 1e-9, `期望 0.11-0.07=0.04（不含 [1,1,1] 自己），实测 ${sum}`);
});

test("根与叶子自己都不算祖先：panelBoneGroupClumpDeltaForLeaf 对无祖先的叶子返回 0", () => {
  const lock = makeLock(TEST3_SPLITS());
  materializePanelBoneGroups(lock);
  // 叶 0（path [0,0]）的唯一祖先候选是根本身与 [0]。给根/叶子自己创作 delta 不应影响它。
  // 根节点没有 path，跳过；[0] 本身作为叶 0/1 的祖先，如果它没创作，应恒为 0。
  assert.equal(panelBoneGroupClumpDeltaForLeaf(lock, 0), 0);
});

test("panelBoneGroupClumpDeltaForPath 对空/单元素 path 返回 0（没有严格祖先）", () => {
  const lock = makeLock(TEST3_SPLITS());
  materializePanelBoneGroups(lock);
  assert.equal(panelBoneGroupClumpDeltaForPath(lock, []), 0, "根没有严格祖先");
  assert.equal(panelBoneGroupClumpDeltaForPath(lock, [0]), 0, "深度 1 的节点唯一祖先是根，被排除");
  assert.equal(panelBoneGroupClumpDeltaForPath(lock, "not-an-array"), 0, "非法 path 安全回落");
});

// ---------------------------------------------------------------------------
// 5. ★ 遍历型断言先确认循环真的跑过（本仓有过循环体一次未执行、变异照绿的事故）。
// ---------------------------------------------------------------------------
test("锚点命中检查：TEST3 树确实存在两层嵌套的中间层（否则上面的累加测试无分辨力）", () => {
  const root = derivePanelBoneGroups(TEST3_SPLITS());
  const nestedTiers = [];
  forEachPanelBoneGroup(root, (node, path) => {
    if (path.length >= 2 && Array.isArray(node.children) && node.leafStart < node.leafEnd) {
      nestedTiers.push(`${node.leafStart}:${node.leafEnd}`);
    }
  });
  // 实测（本轮 derivePanelBoneGroups 现场验证）恰好命中 2 个：[1,1]=span 3..5 与
  // [1,1,1]=span 4..5，正是上面累加测试用到的那两层。命中数不等于 2 说明树形已经变了，
  // 上面的累加断言的期望数字也要跟着重算，此处显式钉住这个前提。
  assert.deepEqual(nestedTiers, ["3:5", "4:5"],
    `锚点命中 ${JSON.stringify(nestedTiers)}，必须恰好是这两层，否则上面的累加测试期望值需要重算`);
});

// ---------------------------------------------------------------------------
// 6. 保全：改 zipper 层级后重建分组树（rebuildPanelBoneGroupsFromLevels），delta 必须
//    跟着搬——对齐 tests/panel-bone-level-rebuild.test.mjs 里 tip 的既有断言写法。
// ---------------------------------------------------------------------------
test("保全：改层级重建后，存活 span 上的 delta 必须原样保留", () => {
  // 4 条 zipper、height 严格递增（与 panel-bone-level-rebuild.test.mjs 同一份 fixture）。
  const SPLITS = () => [
    { position: -0.6, height: 0.2, order: 0 },
    { position: -0.2, height: 0.3, order: 1 },
    { position: 0.2, height: 0.4, order: 2 },
    { position: 0.6, height: 0.5, order: 3 }
  ];
  const makeLevelLock = () => ({ id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: SPLITS() });

  const lock = makeLevelLock();
  materializePanelBoneGroups(lock);
  const idx = SPLITS().findIndex((_, i) => canPromotePanelBoneLevel(SPLITS(), i));
  assert.ok(idx >= 0, "fixture 必须有可升级的 zipper");

  // 先算出改完之后仍存活的 span 集合（同 panel-bone-level-rebuild.test.mjs 的取法：
  // 挑一个改层级后不会被摧毁的非叶中间层，否则移植路径根本不会被执行）。
  const probe = makeLevelLock();
  probe.panelSplits = promotePanelBoneLevel(probe.panelSplits, idx);
  const future = new Set();
  forEachPanelBoneGroup(panelBoneGroupsFor(probe), (n) => future.add(`${n.leafStart}:${n.leafEnd}`));

  let path = null;
  let span = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n, p) => {
    if (path || !Array.isArray(n.children) || p.length === 0) return;
    const key = `${n.leafStart}:${n.leafEnd}`;
    if (future.has(key)) { path = p; span = key; }
  });
  assert.ok(path, "fixture 必须有一个改层级后仍存活的非叶中间层");

  setPanelBoneGroupTipClumpDelta(lock, path, 0.33);
  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  const result = rebuildPanelBoneGroupsFromLevels(lock);
  assert.ok(result.movedValues >= 1, `必须至少移植一个创作值，实测 ${result.movedValues}`);

  let found = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n) => {
    if (`${n.leafStart}:${n.leafEnd}` === span) found = n;
  });
  assert.ok(found, `span ${span} 应仍存在于新树`);
  assert.equal(found.tipClumpDelta, 0.33, "delta 必须原样保留（它不在 AUTHORABLE_KEYS 里，走独立分支移植）");
});

// ---------------------------------------------------------------------------
// 7. 保全：增删 zipper 后重映射（remapPanelBoneGroupsForSplitChange），delta 不丢——
//    对齐 tests/panel-bone-split-count-remap.test.mjs 的既有 fixture 与断言写法。
// ---------------------------------------------------------------------------
test("保全：插入 zipper 后重映射，中间层的 delta 必须跟着 span 搬过去", () => {
  const mk = () => ({
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplitHeight: 0.28,
    panelSplits: [
      { position: -0.5, height: 0.2, order: 0 },
      { position: 0, height: 0.3, order: 1 },
      { position: 0.5, height: 0.4, order: 2 }
    ]
  });
  const lock = mk();
  materializePanelBoneGroups(lock);

  let path = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n, p) => {
    if (!path && p.length && Array.isArray(n.children)) path = p;
  });
  assert.ok(path, "fixture 必须有一个非叶中间层");
  setPanelBoneGroupTipClumpDelta(lock, path, 0.22);

  // 复刻 changePanelSplitCount 的插入：新 zipper 落在末尾。
  const s = lock.panelSplits.map((x) => ({ ...x }));
  const insertIndex = s.length;
  s.push({ position: 0.75, height: 0.28, order: 3 });
  s.sort((a, b) => a.position - b.position);
  const prevLeafCount = lock.panelSplits.length + 1;
  lock.panelSplits = s;

  const result = remapPanelBoneGroupsForSplitChange(lock, "insert", insertIndex, prevLeafCount);
  assert.ok(result, "重映射必须成功");
  assert.ok(result.movedValues >= 1, `必须至少移植一个创作值，实测 ${result.movedValues}`);

  let survivedDelta = null;
  forEachPanelBoneGroup(result.root, (n) => {
    if (n.tipClumpDelta != null) survivedDelta = n.tipClumpDelta;
  });
  assert.equal(survivedDelta, 0.22, "插入 zipper 后 delta 不应丢失（与 tip 同一条保全通路）");
});

test("负向对照：不调用重映射/重建时，原缺陷复现——delta 会跟着整棵树一起消失", () => {
  // 对照组：证明上面两条保全测试真的在测「修复」，不是碰巧总能读到值。
  const mk = () => ({
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplitHeight: 0.28,
    panelSplits: [
      { position: -0.5, height: 0.2, order: 0 },
      { position: 0, height: 0.3, order: 1 },
      { position: 0.5, height: 0.4, order: 2 }
    ]
  });
  const lock = mk();
  materializePanelBoneGroups(lock);
  let path = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n, p) => {
    if (!path && p.length && Array.isArray(n.children)) path = p;
  });
  setPanelBoneGroupTipClumpDelta(lock, path, 0.22);

  // 直接改 panelSplits，不调 remapPanelBoneGroupsForSplitChange：leafCount 不再匹配
  // lock.panelBoneGroups ⇒ normalizePanelBoneGroups 整棵拒绝 ⇒ 回落现场派生（0.2.173
  // 修复前的原缺陷行为）。
  const s = lock.panelSplits.map((x) => ({ ...x }));
  s.push({ position: 0.75, height: 0.28, order: 3 });
  s.sort((a, b) => a.position - b.position);
  lock.panelSplits = s;

  let survivedDelta = null;
  forEachPanelBoneGroup(panelBoneGroupsFor(lock), (n) => {
    if (n.tipClumpDelta != null) survivedDelta = n.tipClumpDelta;
  });
  assert.equal(survivedDelta, null, "对照：不修复时 delta 应随整棵树一起蒸发（复现原缺陷）");
});

// ---------------------------------------------------------------------------
// 8. tierEffectiveTipClump：均值 + 累加 + 钳位（panel-tip-strand.js 新增导出）。
// ---------------------------------------------------------------------------
function makePanelHarness(splits, splitBones, points) {
  const panel = createPanelTipStrandApi({
    clonePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    normalizePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((p) => new THREE.Vector3(p.x, p.y, p.z))),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1)
    }),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    isPanelGeometry: () => true,
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    sculptState: { tipSelection: null, tipHover: null }
  });
  const lock = {
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: splits,
    width: 0.62, panelThickness: 0.08, panelCurvature: 0.18,
    panelLengthLoops: 10, panelWidthLoops: 6,
    taperCurve: [{ position: 0, value: 1, interpolation: "linear" }],
    taperCurveSecondary: [{ position: 0, value: 1, interpolation: "linear" }],
    points,
    splitBones
  };
  return { panel, lock };
}

test("tierEffectiveTipClump：均值——两叶 tipClump 不同（0.4/0.6），均值 0.5，非分辨力不足的常量", () => {
  const SPLITS = [
    { position: -0.3333333333333333, height: 0.3, order: 0 },
    { position: 0.36666666666666675, height: 0.4, order: 1 }
  ];
  const { panel, lock } = makePanelHarness(
    SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  // path [1] 覆盖叶 1..2，tipClump 分别 0.4 / 0.6 —— 特意选不同的两个值，均值 0.5 才有
  // 分辨力（若代码不小心只取了叶 1 或叶 2 而不是真的求两者平均，会分别得到 0.4/0.6）。
  const value = panel.tierEffectiveTipClump(lock, [1]);
  assert.ok(Math.abs(value - 0.5) < 1e-9, `期望均值 0.5，实测 ${value}`);
  assert.notEqual(value, 0.4, "不能只取叶 1 自己的值");
  assert.notEqual(value, 0.6, "不能只取叶 2 自己的值");
});

test("tierEffectiveTipClump：均值 + 自身 delta 累加", () => {
  const SPLITS = [
    { position: -0.3333333333333333, height: 0.3, order: 0 },
    { position: 0.36666666666666675, height: 0.4, order: 1 }
  ];
  const { panel, lock } = makePanelHarness(
    SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.2);
  const value = panel.tierEffectiveTipClump(lock, [1]);
  assert.ok(Math.abs(value - 0.7) < 1e-9, `期望 0.5+0.2=0.7，实测 ${value}`);
});

test("tierEffectiveTipClump：钳位在消费端——均值+delta 超过 SPREAD_MAX 时钳到 0.99", () => {
  const SPLITS = [
    { position: -0.3333333333333333, height: 0.3, order: 0 },
    { position: 0.36666666666666675, height: 0.4, order: 1 }
  ];
  const { panel, lock } = makePanelHarness(
    SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.9); // 0.5 + 0.9 = 1.4，超界
  const value = panel.tierEffectiveTipClump(lock, [1]);
  assert.equal(value, 0.99, `期望钳到 0.99（不是 1.4），实测 ${value}`);
});

test("tierEffectiveTipClump：叶节点/空路径/非法路径返回 null（不是「合并多叶」这回事）", () => {
  const SPLITS = [
    { position: -0.3333333333333333, height: 0.3, order: 0 },
    { position: 0.36666666666666675, height: 0.4, order: 1 }
  ];
  const { panel, lock } = makePanelHarness(
    SPLITS,
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  assert.equal(panel.tierEffectiveTipClump(lock, [0]), null, "叶节点（leafStart===leafEnd）不该走这个函数");
  assert.equal(panel.tierEffectiveTipClump(lock, []), null, "空路径（根）同样不是真中间层");
  assert.equal(panel.tierEffectiveTipClump(lock, "not-an-array"), null, "非法 path 安全回落，不抛");
});

// ---------------------------------------------------------------------------
// 9. Sussurro 真实档数值：0（下界）与 0.928125（接近上界）参与均值时，仍能正确钳位。
// ---------------------------------------------------------------------------
test("tierEffectiveTipClump：真实档边界值（0 与 0.928125）参与均值 + 正 delta 时钳到上界", () => {
  // Sussurro Front Bangs 1 的真实 5 叶 tipClump：[0.928125, 0.78375, 0.845625, 0.6, 0]。
  // heights 递减（浅→深与叶子下标反向排列），让 derivePanelBoneGroups 派生出一个
  // 覆盖叶 0..1（含 tipClump=0.928125 那个接近上界的叶子）的最深中间层 [0,0,0]——
  // 已现场用 derivePanelBoneGroups 验证过这份 heights 给出的树形（见本轮报告）。
  const SPLITS = [
    { position: -0.5, height: 0.6, order: 0 },
    { position: 0, height: 0.5, order: 1 },
    { position: 0.3, height: 0.4, order: 2 },
    { position: 0.6, height: 0.3, order: 3 }
  ];
  const { panel, lock } = makePanelHarness(
    SPLITS,
    SUSSURRO_LEAF_TIPCLUMP.map((v) => ({ tipClump: v })),
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  const root = panelBoneGroupsFor(lock);
  // 找一个覆盖至少两个叶子、且包含叶 0（tipClump=0.928125，接近上界）的中间层。
  let path = null;
  forEachPanelBoneGroup(root, (n, p) => {
    if (path || !Array.isArray(n.children) || p.length === 0) return;
    if (n.leafStart === 0 && n.leafEnd > n.leafStart) { path = p; }
  });
  assert.ok(path, "fixture 必须有一个覆盖叶 0 的中间层，否则本测试无法验证上界钳位");
  const baseline = panel.tierEffectiveTipClump(lock, path);
  assert.ok(baseline > 0.4, `含 0.928125 的均值应该偏高，实测 ${baseline}（用于确认 fixture 真的含了这个大值）`);
  setPanelBoneGroupTipClumpDelta(lock, path, 0.99); // 无论均值多大，加满 0.99 后必然越界
  const clamped = panel.tierEffectiveTipClump(lock, path);
  assert.equal(clamped, 0.99, `叠加满量 delta 后必须钳到 0.99，实测 ${clamped}`);
});

// ---------------------------------------------------------------------------
// 10. tipWidthSpreadGap 的 delta 接线（0.2.177 已落地，取代本条原先「钉住未接线现状」的
//     写法）。判据选**幅度比值**而不是「变了没有」：存在性判据对「first non-null wins」
//     这类错误没有分辨力（那种实现也会让数字变化）。
//     手工推导（与实测逐位吻合）：side=1 ⇒ zipper=splits[1]，height 0.4 ⇒ start=0.6，
//     t=0.8 ⇒ ramp=(0.8-0.6)/0.4=0.5；span=0.36667-(-0.33333)=0.7。
//       叶子 0.4 单独        ⇒ frac=0.4*0.5=0.20 ⇒ gap=0.5*0.7*0.20=0.07
//       叶子 0.4 + delta 0.5 ⇒ clamp(0.9)      ⇒ frac=0.45 ⇒ gap=0.1575
//     比值 0.1575/0.07 = 2.25 = 0.9/0.4，即「有效 clump 真的是叶子值加上祖先 delta」。
//     对照：若实现错成「沿链回落第一个非 null 赢」，有效值会是 0.5、比值 1.25；
//     若符号反了，比值 < 1。两种错误都会被这条比值断言咬中。
// ---------------------------------------------------------------------------
test("tipWidthSpreadGap：叶子值 + 祖先 tipClumpDelta，比值必须等于有效 clump 之比（非存在性判据）", () => {
  const { panel, lock } = makePanelHarness(
    [
      { position: -0.3333333333333333, height: 0.3, order: 0 },
      { position: 0.36666666666666675, height: 0.4, order: 1 }
    ],
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  const splits = lock.panelSplits;
  const bone = { tipClump: 0.4 };
  const before = panel.tipWidthSpreadGap(lock, 1, splits, bone, 0.8, 1);

  // 无 delta 时必须等于「只有叶子自己的值」那条基线（退化等价：存量档逐字节不变）。
  assert.ok(Math.abs(before - 0.07) < 1e-12,
    `无 delta 时 gap 必须是纯叶子值算出的 0.07，实测 ${before}`);

  // 在覆盖叶 1 的中间层（path [1]）上写 delta。[1] 是叶 1 的**严格祖先**，
  // 所以 panelBoneGroupClumpDeltaForLeaf(lock, 1) 应当取到它。
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.5);
  const after = panel.tipWidthSpreadGap(lock, 1, splits, bone, 0.8, 1);

  // ★ 判据是比值而非「变了没有」：比值必须精确等于有效 clump 之比 0.9/0.4 = 2.25。
  assert.ok(Math.abs(after / before - 0.9 / 0.4) < 1e-9,
    `gap 比值必须等于有效 clump 之比 0.9/0.4=2.25（叶子 0.4 + 祖先 delta 0.5）。` +
    `实测 before=${before} after=${after} 比值=${after / before}。` +
    `比值 1.25 ⇒ 实现错成「沿链回落第一个非 null 赢」（有效值取成 0.5）；` +
    `比值 < 1 ⇒ delta 符号反了；比值 1 ⇒ 根本没接线。`);

  // ⏳ 待补的负向对照（主脑刻意不在此写死）：「给更深的后代层写 delta 不该影响本叶子」。
  // 没写是因为它取决于一个**尚未实测**的语义——panelBoneGroupAncestorsForLeaf 是否把
  // 分组树里那个「叶节点」本身也算进祖先。若算，则该叶节点的 delta 应当参与求和，
  // 断言「不变」就是把错的契约钉死。等实测清语义后再补，不要凭猜补。
});

test("负向对照：panelBoneGroupClumpDeltaForLeaf 本身确实能读到刚写的 delta（排除「写入失败导致上一条比值判据空转」）", () => {
  const { lock } = makePanelHarness(
    [
      { position: -0.3333333333333333, height: 0.3, order: 0 },
      { position: 0.36666666666666675, height: 0.4, order: 1 }
    ],
    [{ tipClump: 0.2 }, { tipClump: 0.4 }, { tipClump: 0.6 }],
    Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  );
  materializePanelBoneGroups(lock);
  setPanelBoneGroupTipClumpDelta(lock, [1], 0.5);
  assert.equal(panelBoneGroupClumpDeltaForLeaf(lock, 1), 0.5,
    "delta 确实写入成功且可被独立读到——上一条测试的「不变」是因为 tipWidthSpreadGap 没读它，不是写入本身出了问题");
});
