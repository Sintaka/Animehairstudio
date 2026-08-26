// panel-bone-tier-display.test.mjs —— 钉住「分组树层级显示」对发尖链把手/引导线的接线。
//
// 为什么是源码级断言：panelBoneGroupTierAllowsSegment 只是收敛 tipChainHandles/tipChainLines
// 两处 visible 判断的一个本地 helper，不是导出的纯函数，node 测试也不跑 three.js 视口代码
// （bone-view-handles.js 建 THREE.Mesh/Line 需要真实 WebGL 上下文）。所以这里像
// panel-bone-brush-wiring.test.mjs 一样，直接对源码文本断言：helper 存在、被两处引用、
// 回落语义正确、且没有波及 tipClumpCtx。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8");

test("panelBoneGroupTierAllowsSegment helper 存在", () => {
  assert.match(source, /const panelBoneGroupTierAllowsSegment = \(lock, segment\) => \{/,
    "helper 未定义或签名变了");
});

test("回落语义：缺少 deps.panelBoneGroupTierDisplay 时视为显示（true）", () => {
  assert.match(source, /typeof deps\.panelBoneGroupTierDisplay !== "function"\) return true/,
    "缺失守卫必须在 typeof !== function 时直接 return true —— 漏接线不得改变现状可见性");
});

test("tipChainHandles 的 visible 判断引用了该 helper", () => {
  const idx = source.indexOf("lock.curveObjects.tipChainHandles?.forEach((handle, handleIndex) => {");
  assert.ok(idx >= 0, "定位 tipChainHandles forEach 失败");
  const block = source.slice(idx, idx + 1200);
  assert.match(block, /panelBoneGroupTierAllowsSegment\(lock, segment\)/,
    "tipChainHandles 的 visible 判断没有接 panelBoneGroupTierAllowsSegment");
});

test("tipChainLines 的 visible 判断引用了该 helper", () => {
  const idx = source.indexOf("lock.curveObjects.tipChainLines?.forEach((line, segment) => {");
  assert.ok(idx >= 0, "定位 tipChainLines forEach 失败");
  const block = source.slice(idx, idx + 400);
  assert.match(block, /panelBoneGroupTierAllowsSegment\(lock, segment\)/,
    "tipChainLines 的 visible 判断没有接 panelBoneGroupTierAllowsSegment");
});

test("tipNormalArrows 未被单独改动（经 syncTipNormalArrow 读 handle.visible 自动跟随）", () => {
  const idx = source.indexOf("const syncTipNormalArrow = () => {");
  assert.ok(idx >= 0, "定位 syncTipNormalArrow 失败");
  const block = source.slice(idx, idx + 500);
  assert.doesNotMatch(block, /panelBoneGroupTierAllowsSegment/,
    "syncTipNormalArrow 不应直接引用新 helper —— 它应经 handle.visible 自动跟随");
  assert.match(block, /arrow\.visible = handle\.visible && tipSelected/,
    "syncTipNormalArrow 的可见性基准变了，需重新确认 tipNormalArrows 的跟随关系仍成立");
});

test("tipClumpCtx 未被本轮改动波及", () => {
  const start = source.indexOf("const tipClumpCtx = (() => {");
  assert.ok(start >= 0, "定位 tipClumpCtx 失败");
  const end = source.indexOf("lock.curveObjects.tipChainHandles?.forEach");
  assert.ok(end > start, "定位 tipClumpCtx 结束边界失败");
  const block = source.slice(start, end);
  assert.doesNotMatch(block, /panelBoneGroupTierAllowsSegment/,
    "tipClumpCtx 及其 tipClumpHandles forEach 不应引用新 helper —— 本轮明确不碰它");
});
