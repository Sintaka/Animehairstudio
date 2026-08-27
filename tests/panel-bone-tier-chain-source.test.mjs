// 中间层「显示与编辑同源」的契约（0.2.167）。
//
// 缺陷原貌：bone-view-handles.js 的 tipChainCtx 在 panel 分支里写 `chains: tipChains`，
// 而 tipChains 是同文件上方用 splitTipForSegment **逐叶**算出来的。中间层的合成链只存在于
// host.tipChainFor（panelTierHost 对覆盖段返回 splitTipForLeafSpan）。于是把手画在叶子链上、
// 笔刷（bone-interaction.js 走 resolveTipHost().tipChainFor）写在中间层链上 —— 用户看到
// 「中间层没有骨骼给我刷」。570 条测试全绿也没抓到，因为没有一条断言过「显示侧的链从哪来」。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const handles = readFileSync(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");

// 负向断言必须在**去注释**的正文上跑：本文件与被测文件的注释里都逐字引用了缺陷原文
// （`chains: tipChains`），不去注释的话断言会命中解释性注释而恒红 —— 第一版就是这样自伤的。
function stripComments(src) {
  return src.split("\n").filter((line) => !/^\s*\/\//.test(line)).join("\n");
}

function tipChainCtxBody() {
  const i = handles.indexOf("const tipChainCtx = (() => {");
  assert.notEqual(i, -1, "找不到 tipChainCtx");
  return stripComments(handles.slice(i, i + 2600));
}

test("tipChainCtx 的 chains/forkTs 必须经 host 取值，不得复用逐叶算的 tipChains", () => {
  const body = tipChainCtxBody();
  assert.match(body, /chains:\s*Array\.from\(/, "chains 应由 Array.from + host 现取");
  assert.match(body, /host\.tipChainFor\(segment\)/, "chains 必须调 host.tipChainFor");
  assert.match(body, /host\.forkTFor\(segment\)/, "forkTs 必须调 host.forkTFor");
  // 这两条是缺陷的**原文**：一旦有人改回复用，立刻红。
  assert.doesNotMatch(body, /chains:\s*tipChains\b/, "panel 分支又复用了逐叶的 tipChains");
  assert.doesNotMatch(body, /forkTs:\s*tipForkTs\b/, "panel 分支又复用了逐叶的 tipForkTs");
});

test("绘制判据收窄到锚点段：中间层只画一套把手", () => {
  const i = app.indexOf("function panelBoneGroupTierDisplay(");
  assert.notEqual(i, -1, "找不到 panelBoneGroupTierDisplay");
  const body = stripComments(app.slice(i, app.indexOf("\n}", i)));
  assert.match(body, /segment === node\.leafStart/, "绘制判据必须只在 leafStart 为真");
  // 覆盖判据（高亮）**不能**跟着收窄：整层一起亮是用户要的手感。
  assert.doesNotMatch(body, /panelBoneGroupSelectionCoversSegment/,
    "绘制判据不应再委托给覆盖判据（那会让中间层每段都画）");
});

test("覆盖判据（高亮）仍是整层为真，未被收窄成锚点段", () => {
  const i = app.indexOf("function panelBoneGroupSelectionCoversSegment(");
  assert.notEqual(i, -1, "找不到 panelBoneGroupSelectionCoversSegment");
  const body = stripComments(app.slice(i, app.indexOf("\n}", i)));
  assert.match(body, /segment >= node\.leafStart && segment <= node\.leafEnd/,
    "覆盖判据必须是区间判断（整层高亮）");
});
