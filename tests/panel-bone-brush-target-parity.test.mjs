// panel-bone-brush-target-parity.test.mjs
//
// 钉住一条**跨模块同源**约束：Width Brush 紫色分支的「候选点来源」与「写入目标」
// 必须是同一条曲线数组。
//
// 起因（用户真机实测报的 bug，本轮才找到真因）：阶段 4 已把写入目标按选中分组路由
// （sculpt-geometry.js 的 deps.widthBrushCurveArray），但 taper-editor.js 的
// taperCurveBrushCandidates 一直**硬取 lock.taperCurve**。后果：候选点与
// nearestScreenCandidate 返回的 pointIndex 全来自主发片曲线，写入却落在分组节点数组上。
// 用户看到的就是「选中 L2.Segments 2-3，笔刷还是刷到主发片」。
//
// **为什么 548 条既有测试全绿却抓不到**：两侧各自都「对」—— 写入侧路由正确、候选侧也
// 确实枚举了一条合法曲线；错的是**两侧不同源**。这种缺陷只有跨模块断言拦得住。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const TE = new URL("../modules/geometry/taper-editor.js", import.meta.url);
const SG = new URL("../modules/geometry/sculpt-geometry.js", import.meta.url);
const APP = new URL("../app.js", import.meta.url);

const read = (u) => readFileSync(u, "utf8");

test("候选点必须经 deps.widthBrushCurveArray 解析，不得硬取 lock.taperCurve", () => {
  const src = read(TE);
  const start = src.indexOf("function taperCurveBrushCandidates(");
  assert.ok(start > 0, "找不到 taperCurveBrushCandidates");
  const body = src.slice(start, start + 1800);
  // ★ 判据必须是「curvePoints 的值确实来自解析结果」，不能只查 deps.widthBrushCurveArray
  // 在函数体里出现过。第一版就是后者，结果**变异验证没咬**：把
  // `primaryPoints = resolveSide("primary")` 改回 `= lock.taperCurve` 之后，
  // resolveSide 这个 helper 仍在函数体里、正则照样命中 ⇒ 10 pass / 0 fail 假绿。
  // 所以这里钉住两件具体的事：解析出的变量被喂进 curveSides，且 curvePoints 不直接取
  // lock.taperCurve。
  assert.match(body, /deps\.widthBrushCurveArray/,
    "候选点枚举没有经 deps.widthBrushCurveArray —— 会退回主发片曲线（原 bug）");
  assert.match(body, /const primaryPoints = resolveSide\(/,
    "primaryPoints 必须来自 resolveSide（解析当前选中层），不能硬取 lock.taperCurve");
  assert.doesNotMatch(body, /curvePoints:\s*lock\.taperCurve/,
    "curveSides 里仍在硬取 lock.taperCurve —— 候选点会来自主发片（原 bug）");
});

test("写入侧同样经 deps.widthBrushCurveArray（两侧同源）", () => {
  const src = read(SG);
  assert.match(src, /deps\.widthBrushCurveArray/,
    "sculpt-geometry 写入侧缺 widthBrushCurveArray");
});

test("app.js 必须把同一个 widthBrushCurveArray 同时接给两个模块", () => {
  const src = read(APP);
  const grab = (needle) => {
    const i = src.indexOf(needle);
    assert.ok(i > 0, `找不到 ${needle}`);
    return src.slice(i, i + 2500);
  };
  assert.match(grab("Object.assign(taperEditorDeps"), /widthBrushCurveArray/,
    "taperEditorDeps 批次缺 widthBrushCurveArray");
  assert.match(grab("Object.assign(sculptGeomDeps"), /widthBrushCurveArray/,
    "sculptGeomDeps 批次缺 widthBrushCurveArray");
});

test("仅显当前层：app.js 提供 panelBoneGroupTierDisplay 且接进 bone-view-handles", () => {
  const src = read(APP);
  assert.match(src, /function panelBoneGroupTierDisplay\(/, "app.js 缺 panelBoneGroupTierDisplay 定义");
  const i = src.indexOf("Object.assign(boneViewHandlesDeps");
  assert.ok(i > 0, "找不到 boneViewHandlesDeps 批次");
  assert.match(src.slice(i, i + 2500), /panelBoneGroupTierDisplay/,
    "boneViewHandlesDeps 批次缺 panelBoneGroupTierDisplay");
});
