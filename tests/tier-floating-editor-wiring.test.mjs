// 浮动曲线编辑器的中间层接线（0.2.180）。
//
// 修的缺陷：选中真中间层（如 L2·Segments 2-3）后，浮动编辑器这条链（套曲线预设 /
// 加删点 / Reset / 铅笔按钮）全部只认叶子整数下标（resolveSegmentSelection），
// 于是**静默写到锚点叶子**，用户看到「只有一部分变了」。视口侧（笔刷/拖拽）早已经过
// resolveTipHost 覆盖中间层 ⇒ 两侧读写不同源。
//
// ★ 判据取向：核心分辨点是「写入落到哪个宿主对象」——中间层节点变、叶子不变。
// 修复前的行为恰好相反，所以这条断言对旧代码必然变红（已做变异验证）。
import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { readFileSync } from "node:fs";
import { createTaperEditorApi } from "../modules/geometry/taper-editor.js";
import {
  materializePanelBoneGroups,
  panelBoneGroupsFor,
  panelBoneGroupAtPath
} from "../modules/bones/panel-bone-groups.js";

const SPLITS = () => [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];
const ramp = (a, b) => [
  { position: 0, value: a, interpolation: "linear" },
  { position: 1, value: b, interpolation: "linear" }
];

function makePanelLock() {
  return {
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: SPLITS(),
    width: 0.62, panelThickness: 0.08, panelCurvature: 0.18,
    panelLengthLoops: 10, panelWidthLoops: 6,
    taperCurve: ramp(0.9, 0.5), taperCurveSecondary: ramp(0.8, 0.4),
    depthCurve: ramp(0.85, 0.45), depthCurveSecondary: ramp(0.75, 0.35),
    points: Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  };
}

// 找覆盖 [leafStart, leafEnd] 的真中间层路径（覆盖 >= 2 个叶子）
function tierPathFor(lock, leafStart, leafEnd) {
  const root = panelBoneGroupsFor(lock);
  let found = null;
  const walk = (n, path = []) => {
    if (!n || found) return;
    if (n.leafStart === leafStart && n.leafEnd === leafEnd) { found = path; return; }
    (n.children || []).forEach((c, i) => walk(c, [...path, i]));
  };
  walk(root);
  return found;
}

function harness({ selectedTierPath = null } = {}) {
  const lock = makePanelLock();
  // 复刻 app.js 注入的 panelTierNodeForSegment。★ 这是复刻品，不监视 app.js ——
  // app.js 侧那个 dep 是否真的注入了，由本文件末尾的源码断言守。
  const panelTierNodeForSegment = (l, segmentIndex, { materialize = false } = {}) => {
    if (!Array.isArray(selectedTierPath) || !selectedTierPath.length) return null;
    if (l.panelSplitEnabled === false) return null;
    const r = materialize ? materializePanelBoneGroups(l) : panelBoneGroupsFor(l);
    const node = r ? panelBoneGroupAtPath(r, selectedTierPath) : null;
    if (!node || !(node.leafStart < node.leafEnd)) return null;
    if (!(segmentIndex >= node.leafStart && segmentIndex <= node.leafEnd)) return null;
    return node;
  };
  const sculptState = { panelSegmentIndex: 1, taperCurveEdit: null };
  const taperEditor = createTaperEditorApi({
    sculptState,
    locks: [lock],
    getSelectedLock: () => lock,
    branchSweep: {
      twistCurveEditing: (k) => k === "twistCurve",
      proceduralBranchCurveEditing: () => false,
      trimmedSweepProfile: (p) => p
    },
    shapePresets: {
      taperSecondaryKey: (k) => (k === "depthCurve" ? "depthCurveSecondary" : "taperCurveSecondary"),
      cloneShapePresetValue: (v) => JSON.parse(JSON.stringify(v ?? null))
    },
    strandGeometryCurve: () => ({}),
    strandGeometryFrameAt: (l, c, position) => ({
      point: new THREE.Vector3(0, position, 0),
      x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1)
    }),
    isPanelGeometry: () => true,
    viewportPixelPoint: (w) => ({ x: w.x, y: w.y }),
    panelTierNodeForSegment
  });
  return { lock, taperEditor, sculptState };
}

test("缺陷①：选中真中间层时写入目标是分组树节点，不是锚点叶子", () => {
  const probe = harness();
  materializePanelBoneGroups(probe.lock);
  const tierPath = tierPathFor(probe.lock, 1, 2);
  assert.ok(Array.isArray(tierPath) && tierPath.length, "前提：找得到覆盖叶 1..2 的真中间层");

  const tiered = harness({ selectedTierPath: tierPath });
  materializePanelBoneGroups(tiered.lock);
  const target = tiered.taperEditor.segmentCurveTargetForWrite();
  assert.ok(target, "选中中间层时写入目标不该为 null");

  // ★ 必须拿**活树**（lock.panelBoneGroups）比对，不能用 panelBoneGroupsFor()：
  // 后者会归一化出一份**副本**，与 materializePanelBoneGroups 返回的活引用不是同一个对象。
  // 写入路径必须命中活树，否则改动落在临时副本上、静默丢失（与 0.2.178 快照那次同类陷阱）。
  const tierNode = panelBoneGroupAtPath(tiered.lock.panelBoneGroups, tierPath);
  assert.ok(tierNode, "前提：取得到分组树节点（活树）");
  assert.equal(target, tierNode, "写入目标必须是活分组树节点本身（同一引用）");
  // 判据的分辨点：它**不能**是叶子 bone
  assert.equal(target.leafStart, 1, "节点应覆盖叶 1..2");
  assert.equal(target.leafEnd, 2, "节点应覆盖叶 1..2");
});

test("缺陷④：只读展示侧与写入侧同源（都取中间层，不能一边叶子一边中间层）", () => {
  const probe = harness();
  materializePanelBoneGroups(probe.lock);
  const tierPath = tierPathFor(probe.lock, 1, 2);
  const tiered = harness({ selectedTierPath: tierPath });
  materializePanelBoneGroups(tiered.lock);

  const shown = tiered.taperEditor.segmentCurveTarget();
  const written = tiered.taperEditor.segmentCurveTargetForWrite();
  assert.ok(shown && written, "两侧都该有值");
  assert.equal(shown.leafStart, written.leafStart, "展示侧与写入侧必须指向同一层（leafStart）");
  assert.equal(shown.leafEnd, written.leafEnd, "展示侧与写入侧必须指向同一层（leafEnd）");
  assert.equal(written.leafEnd, 2, "应当是覆盖多叶的中间层，而不是单个叶子");
});

test("退化对照：没有选中中间层时，写入目标仍是叶子（旧行为逐字不变）", () => {
  const plain = harness({ selectedTierPath: null });
  const target = plain.taperEditor.segmentCurveTargetForWrite();
  assert.ok(target, "没选中中间层时也该有写入目标");
  assert.equal(target.leafStart, undefined,
    "叶子 bone 不该有 leafStart 字段 —— 有就说明退化路径错误地走进了中间层分支");
});

test("源码断言：app.js 必须真的把 panelTierNodeForSegment 注入 taperEditorDeps", () => {
  // 上面几条用的是复刻的 dep，**不监视 app.js**：漏注入时它们照绿。
  // 这条读源文本，是唯一守着「生产代码真的接上了」的检查（本仓有过纯函数全绿、
  // 接线却漏掉的先例）。
  const src = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const at = src.indexOf("Object.assign(taperEditorDeps");
  assert.notEqual(at, -1, "找不到 taperEditorDeps 注入块");
  const block = src.slice(at, src.indexOf("});", at));
  assert.match(block, /panelTierNodeForSegment/,
    "taperEditorDeps 未注入 panelTierNodeForSegment ⇒ 浮动编辑器会退回只认叶子、套预设写错层");
  // 负向对照：假键必须不在，证明上面不是恒真
  assert.doesNotMatch(block, /ZZZnotARealDep/, "负向对照失败：断言恒真");
  // 两个 materialize 分支必须分开（活树写 / 副本读）——合并会让写入落在副本上静默丢失
  const defAt = src.indexOf("panelTierNodeForSegment:");
  const body = src.slice(defAt, defAt + 900);
  assert.match(body, /materializePanelBoneGroups\(lock\)/, "写入路径必须走活树");
  assert.match(body, /panelBoneGroupsFor\(lock\)/, "展示路径必须走归一化副本，不脏 lock");
});

test("退化对照：选中的是叶子节点路径（leafStart===leafEnd）时不走中间层分支", () => {
  const probe = harness();
  materializePanelBoneGroups(probe.lock);
  const leafPath = tierPathFor(probe.lock, 0, 0);
  assert.ok(Array.isArray(leafPath), "前提：找得到覆盖单个叶子的节点路径");

  const leafSel = harness({ selectedTierPath: leafPath });
  materializePanelBoneGroups(leafSel.lock);
  leafSel.sculptState.panelSegmentIndex = 0;
  const target = leafSel.taperEditor.segmentCurveTargetForWrite();
  assert.ok(target, "该有写入目标");
  assert.equal(target.leafStart, undefined,
    "单叶节点必须退化成叶子 bone（resolvePanelTierSpan 对 leafStart===leafEnd 返回 null）");
});
