// tier-width-curve-wiring.test.mjs — 中间层 WidthCurve 所有权转移的接线（0.2.172）。
//
// tests/tier-width-curve-transfer.test.mjs 测的是 tip-width-curve.js 里两个**纯函数**的数学；
// 本文件测的是它们**接到真实 lock 上**之后的行为，以及 app.js 侧是否真的调用了 bake。
// 分两个文件是刻意的：纯函数全绿也不代表接线正确（本仓这类漏接线已复发多次）。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import {
  materializePanelBoneGroups,
  setPanelBoneGroupValue,
  panelBoneGroupEffectiveValue,
  panelBoneGroupPathForLeaf,
  panelBoneGroupsFor
} from "../modules/bones/panel-bone-groups.js";

// 3 叶（2 zipper，height 不同 ⇒ 派生出 L2[0..0] / L2[1..2]{L3,L3}），与真实档 Test 4 同构。
const SPLITS = () => [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];
const MAIN_COUNT = 6;
const flat = (v) => [{ position: 0, value: v, interpolation: "linear" },
  { position: 1, value: v, interpolation: "linear" }];

function harness() {
  const panel = createPanelTipStrandApi({
    clonePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    normalizePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((p) => new THREE.Vector3(p.x, p.y, p.z))),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1) }),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    isPanelGeometry: () => true,
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    sculptState: { tipSelection: null, tipHover: null }
  });
  const lock = {
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: SPLITS(),
    width: 0.62, panelThickness: 0.08, panelCurvature: 0.18,
    panelLengthLoops: 10, panelWidthLoops: 6,
    taperCurve: flat(1), taperCurveSecondary: flat(1),
    points: Array.from({ length: MAIN_COUNT }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  };
  return { panel, lock };
}

// 找覆盖 leafStart..leafEnd 的那个中间层路径
function tierPathFor(lock, leafStart, leafEnd) {
  const root = panelBoneGroupsFor(lock);
  let found = null;
  const walk = (n, path = []) => {
    if (!n || found) return;
    if (n.leafStart === leafStart && n.leafEnd === leafEnd && Array.isArray(n.children)) { found = path; return; }
    (n.children || []).forEach((c, i) => walk(c, [...path, i]));
  };
  walk(root);
  return found;
}

// ---------------------------------------------------------------------------
// 1. ★ 核心：叶子各有不同曲线时，bake 给出的是**叶子平均**，而播种给出的是 lock 层值。
//    两者必须不同 —— 这就是换掉播种的全部理由，也是本判据的分辨力来源。
// ---------------------------------------------------------------------------
test("核心：bake 取叶子平均，与播种（回落 lock 层）给出不同结果", () => {
  const { panel, lock } = harness();
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  assert.ok(tier, "fixture 必须有覆盖叶 1..2 的中间层");

  // 两个叶子各自创作不同曲线
  const leaf1 = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 1);
  const leaf2 = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 2);
  setPanelBoneGroupValue(lock, leaf1, "taperCurve", flat(0.5));
  setPanelBoneGroupValue(lock, leaf2, "taperCurve", flat(1.9));

  const baked = panel.bakeTierWidthCurve(lock, tier, "taperCurve");
  assert.ok(Array.isArray(baked) && baked.length, "bake 必须返回曲线");

  // 播种口径（沿链向上取第一个非 null，两个叶子都被跳过 ⇒ 落到 lock 层 = 1）
  const seeded = panelBoneGroupEffectiveValue(lock, tier, "taperCurve", lock.taperCurve);
  const seedVal = seeded[0].value;
  const bakeVal = baked[0].value;

  assert.equal(seedVal, 1, "对照：播种应给出 lock 层的 1（它不看子孙）");
  assert.ok(Math.abs(bakeVal - 1.2) < 0.05,
    `bake 应给出两叶平均 ≈1.2（(0.5+1.9)/2），实测 ${bakeVal}`);
  assert.ok(Math.abs(bakeVal - seedVal) > 0.1,
    `bake 与播种必须显著不同（否则换它没有意义），实测 bake=${bakeVal} seed=${seedVal}`);
});

// ---------------------------------------------------------------------------
// 2. 退化等价：叶子都未创作时，bake 与播种给出相同结果（都回落 lock 层）。
//    这保证「只在该改变行为的场景改变行为」。
// ---------------------------------------------------------------------------
test("退化：叶子都未创作时 bake 与播种同值（都回落 lock 层）", () => {
  const { panel, lock } = harness();
  lock.taperCurve = flat(0.8);
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  const baked = panel.bakeTierWidthCurve(lock, tier, "taperCurve");
  const seeded = panelBoneGroupEffectiveValue(lock, tier, "taperCurve", lock.taperCurve);
  assert.ok(Math.abs(baked[0].value - seeded[0].value) < 1e-9,
    `未创作时两者应同值，实测 bake=${baked[0].value} seed=${seeded[0].value}`);
});

// ---------------------------------------------------------------------------
// 3. 叶节点不走 bake（leafStart === leafEnd 就是某个叶子段本身，没有「合并多叶」这回事）。
// ---------------------------------------------------------------------------
test("叶节点：bake 返回 null，调用方回落原播种", () => {
  const { panel, lock } = harness();
  materializePanelBoneGroups(lock);
  const leafPath = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 0);
  assert.ok(leafPath, "需要一个叶子路径");
  assert.equal(panel.bakeTierWidthCurve(lock, leafPath, "taperCurve"), null,
    "叶节点不该走 bake（与 resolvePanelTierSpan 的退化判据同口径）");
  assert.equal(panel.bakeTierWidthCurve(lock, [], "taperCurve"), null, "空路径应返回 null");
  assert.equal(panel.bakeTierWidthCurve(lock, null, "taperCurve"), null, "非法路径应返回 null");
});

// ---------------------------------------------------------------------------
// 4. ★ 跨网格：中间层的 grid 与叶子的 grid 确实不同 —— 这是「必须重采样」的实测依据。
//    若哪天它们变成相同，bake 里的重采样就成了无意义的恒等操作，本条会提醒。
// ---------------------------------------------------------------------------
test("跨网格：bake 必须在 span 级网格上取值，不能用叶子网格", () => {
  const { panel, lock } = harness();
  const splits = SPLITS();
  // ① 先证明两级 grid 确实不同（重采样的必要性依据）
  const leafGrid = panel.tipWidthGridTs(lock, 1, splits);
  const tierGrid = panel.tipWidthGridTs(lock, 1, [splits[0]]); // 去掉内部 zipper = span 级
  assert.notDeepEqual(leafGrid, tierGrid, "两级控制点位置必须不同，否则不需要重采样");

  // ② ★ 判据必须用**有梯度**的曲线：常量曲线在任何网格上采样都得同一个值，
  // 「用错网格」在常量曲线上完全看不出来（第一版 fixture 用 flat 常量，变异
  // 「tierGridTs 换成 leafGridTs」照绿 —— 判据当时没有分辨力）。
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  const ramp = [
    { position: 0, value: 0.2, interpolation: "linear" },
    { position: 1, value: 1.8, interpolation: "linear" }
  ];
  const leaf1 = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 1);
  const leaf2 = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 2);
  setPanelBoneGroupValue(lock, leaf1, "taperCurve", ramp.map((p) => ({ ...p })));
  setPanelBoneGroupValue(lock, leaf2, "taperCurve", ramp.map((p) => ({ ...p })));

  const baked = panel.bakeTierWidthCurve(lock, tier, "taperCurve");
  // bake 的 position 必须落在 span 级网格上（那是这条曲线将来被采样的位置）
  const positions = baked.map((p) => Number(p.position.toFixed(6)));
  const tierPositions = tierGrid.map((t) => Number(Number(t).toFixed(6)));
  assert.deepEqual(positions, tierPositions,
    `bake 的控制点必须落在 span 级网格上；实测 ${JSON.stringify(positions)} vs span 级 ${JSON.stringify(tierPositions)}`);
  // 负向对照：若落在叶子网格上，就会等于 leafGrid —— 两者必须不等，否则本判据无分辨力
  const leafPositions = leafGrid.map((t) => Number(Number(t).toFixed(6)));
  assert.notDeepEqual(tierPositions, leafPositions,
    "对照：span 级与叶级网格必须不等，否则上面那条断言无法区分对错");
});

// ---------------------------------------------------------------------------
// 5. 往返：bake 后再 resample 回叶子，值应回到接近原叶子平均（不是原叶子各自的值 ——
//    合并有信息损失，这是用户已接受的前提）。
// ---------------------------------------------------------------------------
test("往返：bake 再 resample 回叶子，值稳定在平均值附近", () => {
  const { panel, lock } = harness();
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  const leaf1 = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 1);
  const leaf2 = panelBoneGroupPathForLeaf(panelBoneGroupsFor(lock), 2);
  setPanelBoneGroupValue(lock, leaf1, "taperCurve", flat(0.5));
  setPanelBoneGroupValue(lock, leaf2, "taperCurve", flat(1.9));
  const baked = panel.bakeTierWidthCurve(lock, tier, "taperCurve");
  const back1 = panel.resampleTierCurveToLeaf(lock, baked, 1);
  const back2 = panel.resampleTierCurveToLeaf(lock, baked, 2);
  assert.ok(Array.isArray(back1) && Array.isArray(back2), "写回必须返回曲线");
  for (const [name, c] of [["leaf1", back1], ["leaf2", back2]]) {
    assert.ok(Math.abs(c[0].value - 1.2) < 0.1,
      `${name} 写回值应在平均值 1.2 附近，实测 ${c[0].value}`);
  }
});

// ---------------------------------------------------------------------------
// 6. 消失的中间层要被上报成 droppedTiers（带 span + 创作值），供调用方写回叶子。
//    这是「销毁时写回」的数据通路 —— 纯拓扑模块拿不到 grid，只能把消失的层交出去。
// ---------------------------------------------------------------------------
test("droppedTiers：消失的中间层带着 span 与创作值被上报", async () => {
  const { rebuildPanelBoneGroupsFromLevels, promotePanelBoneLevel, canPromotePanelBoneLevel,
    forEachPanelBoneGroup } = await import("../modules/bones/panel-bone-groups.js");
  const { lock } = harness();
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  setPanelBoneGroupValue(lock, tier, "taperCurve", flat(0.42));

  const idx = lock.panelSplits.findIndex((_, i) => canPromotePanelBoneLevel(lock.panelSplits, i));
  assert.ok(idx >= 0, "需要一个可升级的 zipper");
  lock.panelSplits = promotePanelBoneLevel(lock.panelSplits, idx);
  const r = rebuildPanelBoneGroupsFromLevels(lock);

  // 该 span 是否真的消失了？消失才该被上报
  let survived = false;
  forEachPanelBoneGroup(lock.panelBoneGroups, (n) => {
    if (n.leafStart === 1 && n.leafEnd === 2) survived = true;
  });
  if (survived) {
    assert.deepEqual(r.droppedTiers, [], "span 仍存在时不该上报为 dropped");
    return;
  }
  assert.ok(r.droppedTiers.length >= 1, "消失的中间层必须被上报");
  const t = r.droppedTiers.find((x) => x.leafStart === 1 && x.leafEnd === 2);
  assert.ok(t, "上报里应包含 span 1..2");
  assert.equal(t.values.taperCurve[0].value, 0.42, "必须带着创作值一起交出去");
});

// ---------------------------------------------------------------------------
// 7. droppedTiers 里的 `leafStart < leafEnd` 守卫**结构上不可达** —— 钉住让它不可达的
//    那条不变量，而不是写一条空转的测试。
//
// ★ 为什么这么写：第一版写的是「遍历 droppedTiers 断言每项 leafEnd > leafStart」，
// 变异「让守卫收下叶节点」照绿 —— 因为该 fixture 下根本没有叶节点被 drop，循环体一次都
// 没执行。真因是**叶子划分恒为 [[0,0],…,[N,N]]**（panel-bone-levels.test.mjs 已钉住），
// 于是每个叶子 span 在新旧树里永远同时存在 ⇒ 叶节点永远进不了「消失」集合。
// 主脑实测：3 条 zipper × boneLevel 2..5 共 64 种组合，叶子划分无一例外。
// 那个守卫因此是防御性代码而非可达分支。诚实的做法是钉住不变量本身：一旦哪天叶子划分
// 不再恒定（例如增删 zipper 的路径接进来），本条会红，提醒那个守卫从此变成可达分支、
// 需要为它补真正的行为测试。
// ---------------------------------------------------------------------------
test("不变量：叶子划分恒定 ⇒ 叶节点永不进 droppedTiers（该守卫不可达）", async () => {
  const { panelBoneGroupsLeafPartition, panelBoneGroupsFromLevels } =
    await import("../modules/bones/panel-bone-groups.js");
  const base = [
    { position: -0.5, height: 0.2, order: 0 },
    { position: 0, height: 0.3, order: 1 },
    { position: 0.5, height: 0.4, order: 2 }
  ];
  const expected = [[0, 0], [1, 1], [2, 2], [3, 3]];
  let combos = 0;
  for (let a = 2; a <= 5; a += 1) {
    for (let b = 2; b <= 5; b += 1) {
      for (let c = 2; c <= 5; c += 1) {
        const splits = base.map((s, i) => ({ ...s, boneLevel: [a, b, c][i] }));
        const part = panelBoneGroupsLeafPartition(panelBoneGroupsFromLevels(splits));
        assert.deepEqual(part, expected, `levels [${a},${b},${c}] 下叶子划分应恒定`);
        combos += 1;
      }
    }
  }
  assert.equal(combos, 64, "应枚举 64 种 level 组合（若这个数变了说明枚举范围被改动）");
});

// ---------------------------------------------------------------------------
// ★ 接线断言（源码级）：app.js 的 widthBrushCurveArray 必须真的调 bake。
// 变异验证时删掉那一行，上面 5 条**全部照绿** —— 它们只测函数本身。
// 本仓这类漏接线已复发多次（0.2.154 层级、0.2.160 笔刷候选点、0.2.171 重建）。
// ---------------------------------------------------------------------------
test("接线：app.js 的 widthBrushCurveArray 必须调用 bakeTierWidthCurve", () => {
  const src = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const at = src.indexOf("function widthBrushCurveArray(");
  assert.notEqual(at, -1, "找不到 widthBrushCurveArray");
  const body = src.slice(at, src.indexOf("\n}", at));
  assert.match(body, /bakeTierWidthCurve\?\.\(lock, path, key\)/,
    "首次写入中间层时必须先试 bake，否则又回到播种的跳变行为");
  // bake 必须在 setPanelBoneGroupValue **之前**（它算的是要写进去的种子值）
  const bakeAt = body.search(/bakeTierWidthCurve/);
  const setAt = body.search(/setPanelBoneGroupValue/);
  assert.ok(bakeAt >= 0 && setAt > bakeAt, "bake 必须发生在写入之前");
  // 必须保留播种作回落（bake 返回 null 时叶节点/异常数据的行为要一字不变）
  assert.match(body, /panelBoneGroupEffectiveValue/,
    "必须保留播种作为 bake 返回 null 时的回落");
});

// ---------------------------------------------------------------------------
// ★ 接线断言（源码级）：写回必须两处都写。
// 只写一处的话另一处的旧值会在读取时优先命中、把写回的值盖掉 ⇒「视觉不变」不成立。
// 采样侧读的是 `bone?.taperCurve || panelTierCurveFallback(...)`（bone 自己的值优先）。
// ---------------------------------------------------------------------------
test("接线：写回必须同时落到 splitBones 与分组树叶节点两处", () => {
  const src = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const at = src.indexOf("function writeBackDroppedTierCurves(");
  assert.notEqual(at, -1, "找不到 writeBackDroppedTierCurves");
  const body = src.slice(at, src.indexOf("\n}", src.indexOf("for (const tier of tiers)", at)));
  assert.match(body, /bones\[leaf\]\[key\]\s*=/, "必须写 splitBones[leaf][key]（旧路径，读取时优先命中）");
  assert.match(body, /setPanelBoneGroupValue\(lock, leafPath, key/, "必须写分组树叶节点");
  assert.match(body, /resampleTierCurveToLeaf/, "必须按叶子自己的网格重采样，不能直接复制数组");
  // 两条曲线都要处理
  assert.match(body, /taperCurveSecondary/, "taperCurveSecondary 也要写回");
  // changeBoneLevel 必须调它
  const cbAt = src.indexOf("function changeBoneLevel(");
  const cbBody = src.slice(cbAt, src.indexOf("\n}", cbAt));
  assert.match(cbBody, /writeBackDroppedTierCurves\(lock, rebuilt\)/,
    "changeBoneLevel 必须在重建后写回消失层的曲线");
});
