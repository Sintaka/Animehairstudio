// panel-bone-level-wiring.test.mjs —— 钉住「层级按钮真的会改变分组树」这条接线。
//
// 为什么单独一个文件：阶段 3 有过一个**只有端到端才能发现**的接线漏洞 ——
// panelBoneGroupsFor() 当时只有「已创作树 → 按 height 派生」两级回落，**漏了「按 boneLevel
// 建树」这一级**。症状极具欺骗性：outliner 里 zipper 的层级标签会从 L2 变成 L3（因为标签读的
// 是 normalizePanelBoneLevels 的结果），但下面的段分组一动不动 —— 按钮看起来生效了，实际
// 只改了个数字。纯函数单测全绿也抓不到，因为每个函数各自都对。
// 这里断言的是**跨函数的因果**：改了层级 ⇒ panelBoneGroupsFor 返回的树必须跟着变。
import test from "node:test";
import assert from "node:assert/strict";
import {
  panelBoneGroupsFor, panelBoneGroupsLeafPartition,
  materializePanelBoneLevels, normalizePanelBoneLevels,
  promotePanelBoneLevel, demotePanelBoneLevel, canDemotePanelBoneLevel
} from "../modules/bones/panel-bone-groups.js";

// Scalp Conform Test 1.ahs 的真实形状：两条 zipper 同 height ⇒ 派生成根下三个平级 L2。
const flatSplits = () => [
  { position: -1 / 3, height: 0.3, order: 0 },
  { position: 1 / 3, height: 0.3, order: 1 }
];

const shape = (node, indent = "") =>
  `${indent}L${node.depth}[${node.leafStart}..${node.leafEnd}]\n` +
  (node.children ? node.children.map((c) => shape(c, indent + "  ")).join("") : "");

const maxDepth = (node) => (node.children ? Math.max(...node.children.map(maxDepth)) : node.depth);

test("panelBoneGroupsFor 必须认 boneLevel —— 否则层级按钮只改数字不改树", () => {
  const splits = flatSplits();
  const before = panelBoneGroupsFor({ panelSplits: splits });
  assert.equal(maxDepth(before), 2, "初始应是根下三个平级 L2");

  const demoted = demotePanelBoneLevel(splits, 0);
  const after = panelBoneGroupsFor({ panelSplits: demoted });
  // 这一条就是当年漏掉那一级回落时会红的断言
  assert.equal(maxDepth(after), 3, "降级后必须真的多出一层 L3");
  assert.notEqual(shape(after), shape(before), "树形必须变化");
});

test("降级→升级 往返回到完全相同的树", () => {
  const splits = flatSplits();
  const original = shape(panelBoneGroupsFor({ panelSplits: splits }));
  const roundTrip = promotePanelBoneLevel(demotePanelBoneLevel(splits, 0), 0);
  assert.equal(shape(panelBoneGroupsFor({ panelSplits: roundTrip })), original);
});

test("改层级不动几何：position/height/order 与叶子划分全部不变", () => {
  const splits = flatSplits();
  const geom = (ps) => ps.map((z) => `${z.position}|${z.height}|${z.order}`).join(",");
  const partition = (ps) => JSON.stringify(panelBoneGroupsLeafPartition(panelBoneGroupsFor({ panelSplits: ps })));
  const before = { geom: geom(splits), part: partition(splits) };
  const demoted = demotePanelBoneLevel(splits, 0);
  assert.equal(geom(demoted), before.geom, "几何字段被改了");
  assert.equal(partition(demoted), before.part, "叶子划分被改了 —— 会导致段数变化");
  assert.equal(partition(demoted), JSON.stringify([[0, 0], [1, 1], [2, 2]]));
});

test("boneLevel 非法/缺失时回落按 height 派生（不抛异常）", () => {
  const bad = [
    { position: -1 / 3, height: 0.3, order: 0, boneLevel: 99 },
    { position: 1 / 3, height: 0.3, order: 1, boneLevel: "x" }
  ];
  const tree = panelBoneGroupsFor({ panelSplits: bad });
  assert.equal(maxDepth(tree), 2, "非法 level 必须整体回落到 height 派生");
});

test("已创作的 panelBoneGroups 优先于 boneLevel", () => {
  // 手写一棵合法的两层树（3 叶子），同时给 splits 一个会产生三层的 boneLevel 组合。
  const authored = {
    leafStart: 0, leafEnd: 2, depth: 1,
    taperCurve: null, taperCurveSecondary: null,
    depthCurve: null, depthCurveSecondary: null,
    children: [
      { leafStart: 0, leafEnd: 0, depth: 2, taperCurve: null, taperCurveSecondary: null, depthCurve: null, depthCurveSecondary: null, children: null },
      { leafStart: 1, leafEnd: 2, depth: 2, taperCurve: null, taperCurveSecondary: null, depthCurve: null, depthCurveSecondary: null, children: null }
    ]
  };
  const splits = [
    { position: -1 / 3, height: 0.3, order: 0, boneLevel: 3 },
    { position: 1 / 3, height: 0.3, order: 1, boneLevel: 2 }
  ];
  const tree = panelBoneGroupsFor({ panelSplits: splits, panelBoneGroups: authored });
  assert.equal(tree.children.length, 2, "应采用已创作的两分支树，而不是 boneLevel 建出的树");
  assert.equal(maxDepth(tree), 2);
});

test("canDemote 为 false 时 demote 是 no-op（树不变）", () => {
  // 三条同 height ⇒ 全在 L2；把其中两条降下去后，剩下那条会成为「唯一最浅切点」
  const splits = normalizePanelBoneLevels(materializePanelBoneLevels([
    { position: -0.4, height: 0.3, order: 0 },
    { position: 0, height: 0.3, order: 1 },
    { position: 0.4, height: 0.3, order: 2 }
  ]));
  let cur = splits;
  for (let i = 0; i < 3; i += 1) {
    if (!canDemotePanelBoneLevel(cur, i)) {
      const before = shape(panelBoneGroupsFor({ panelSplits: cur }));
      const after = shape(panelBoneGroupsFor({ panelSplits: demotePanelBoneLevel(cur, i) }));
      assert.equal(after, before, "canDemote=false 却改变了树");
      return;
    }
    cur = demotePanelBoneLevel(cur, i);
  }
  // 三条都能降完也可以接受，但那说明这条用例没覆盖到 no-op 路径，显式失败以免假绿
  assert.fail("没有构造出 canDemote=false 的情形，本用例未覆盖 no-op 路径");
});
