// panel-bone-brush-wiring.test.mjs —— 钉住「紫色 width brush 能写到选中的分组层」这条接线。
//
// 为什么需要源码级断言：sculpt-geometry.js 的 applyWidthCurveBrushSample 对
// deps.widthBrushCurveArray 带**回落**（缺这个 dep 就退回 lock 层数组）。这个回落是刻意的
// ——漏接线不会崩、不会红——但代价是「分组选择静默失效」：用户选了某一层去刷，笔迹却全部
// 写到 lock 层。纯函数测试碰不到 deps.X，接线漏了要到运行时才发现（本仓既有教训：
// 「测试全绿不等于 deps 引用正确」）。所以这里直接对源码文本断言接线存在。
//
// 另一半（语义）用真实的分组树函数验：首笔播种 + 只写选中层不递归后代。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  materializePanelBoneGroups, setPanelBoneGroupValue, panelBoneGroupAtPath,
  panelBoneGroupEffectiveValue, panelBoneGroupsFor
} from "../modules/bones/panel-bone-groups.js";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const sculptSource = readFileSync(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8");

test("sculpt-geometry 通过 deps.widthBrushCurveArray 解析写入目标", () => {
  assert.match(sculptSource, /deps\.widthBrushCurveArray/,
    "applyWidthCurveBrushSample 必须经 deps.widthBrushCurveArray 取数组");
  // 回落必须保留：缺 dep 时退回 lock 层，不能崩
  assert.match(sculptSource, /target\.lock\.taperCurveSecondary/,
    "缺 dep 时的 lock 层回落被删了 —— 漏接线会从静默失效变成崩溃");
});

test("app.js 定义了 widthBrushCurveArray 并把它接进 sculptGeomDeps", () => {
  assert.match(appSource, /function widthBrushCurveArray\(/, "app.js 必须定义 widthBrushCurveArray");
  // 接线块里必须出现这个键（Object.assign(sculptGeomDeps, { ... widthBrushCurveArray ... })）
  const assignBlock = appSource.slice(appSource.indexOf("Object.assign(sculptGeomDeps, {"));
  assert.ok(assignBlock.slice(0, 4000).includes("widthBrushCurveArray"),
    "widthBrushCurveArray 没有被接进 sculptGeomDeps —— 分组选择会静默失效");
});

test("app.js 换 lock 时清空分组选择（悬空路径防护）", () => {
  assert.match(appSource, /selectedPanelBoneGroup && selectedPanelBoneGroup\.lockId !== id/,
    "缺这条清理，换发片后会拿旧路径去索引新发片的树");
});

// ── 语义：首笔播种 + 只写选中层 ──────────────────────────────────────────────
const makeLock = () => ({
  id: "L1",
  geometryType: "panel",
  panelSplits: [
    { position: -1 / 3, height: 0.3, order: 0 },
    { position: 1 / 3, height: 0.3, order: 1 }
  ],
  taperCurve: [
    { position: 0, value: 0.3 },
    { position: 0.5, value: 0.9 },
    { position: 1, value: 0 }
  ]
});

test("首笔播种：分组节点曲线为 null 时，用当前有效值深拷贝作为起点", () => {
  const lock = makeLock();
  materializePanelBoneGroups(lock);
  const path = [0];
  assert.equal(panelBoneGroupAtPath(lock.panelBoneGroups, path).taperCurve, null, "初值应为 null");
  // 模拟 widthBrushCurveArray 的播种逻辑
  const seed = panelBoneGroupEffectiveValue(lock, path, "taperCurve", lock.taperCurve);
  setPanelBoneGroupValue(lock, path, "taperCurve", seed.map((p) => ({ ...p })));
  const own = panelBoneGroupAtPath(lock.panelBoneGroups, path).taperCurve;
  assert.deepEqual(own, lock.taperCurve, "播种后形状应等于当前有效值（第一笔从所见处继续）");
  assert.notEqual(own, lock.taperCurve, "必须是深拷贝，不能与 lock 层共享引用");
  own[1].value = 0.5;
  assert.equal(lock.taperCurve[1].value, 0.9, "改分组层不得反向污染 lock 层");
});

test("只写选中层：后代自有值保留，后代 null 值经读取期回落跟随", () => {
  const lock = makeLock();
  materializePanelBoneGroups(lock);
  const root = panelBoneGroupsFor(lock);
  // Test1 形状：根下三个平级叶子 ⇒ 选根本身没有子组可验，改用 tipClump 在根与叶之间验证
  const childCount = root.children.length;
  assert.ok(childCount >= 2, "前提：根应有多个子节点");
  setPanelBoneGroupValue(lock, [0], "tipClump", 0.11);
  setPanelBoneGroupValue(lock, [], "tipClump", 0.77);
  assert.equal(panelBoneGroupAtPath(lock.panelBoneGroups, [0]).tipClump, 0.11,
    "有自有值的后代必须保持不变");
  assert.equal(panelBoneGroupAtPath(lock.panelBoneGroups, [1]).tipClump, null,
    "null 的后代不得被递归写入");
  assert.equal(panelBoneGroupEffectiveValue(lock, [1], "tipClump", "FB"), 0.77,
    "null 的后代应在读取期回落到新值");
});
