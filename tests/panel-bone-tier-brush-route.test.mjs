// panel-bone-tier-brush-route.test.mjs
//
// 复现用户 0.2.161 实测报的两个症状，并钉住它们的**单一根因**：
//   ① 选中 L2.Segments 2-3（非叶中间层）后没有高亮显示
//   ② 直接刷仍然更改主骨骼
//
// 根因：阶段 5 对**非叶**分组把 sculptState.tipSelection 置为 null，理由是
// 「tipSelection 只能存单个 segmentIndex、表达不了跨段区间」。这个理由在 0.2.161
// 中间层接线之后**已经失效**（该层覆盖的每个 segment 的 host.bones[segment] 都指向
// 同一个分组节点），但置空的代码留着，于是同时打掉了两条通路：
//   - app.js 的 tipUiActive = Boolean(segmentBoneHost(lock)) && tipSelection?.lockId === lock.id
//     ⇒ null 时整组发尖 UI 在笔刷激活时被隐藏（症状 ①）
//   - bone-interaction.js 的 applySubBoneBrushSample 首行 `if (!selection) return false`
//     ⇒ 返回 false 让笔刷落到主体去改 source.points（症状 ②）
//
// **为什么 565 条测试全绿却抓不到**：这两条通路都在运行时读 sculptState，纯函数测试碰不到；
// 接线类测试只断言「dep 有没有接上」，不断言「选中非叶层时 tipSelection 是否非空」。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rd = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const APP = rd("../app.js");
const BI = rd("../modules/bones/bone-interaction.js");

test("非叶中间层也必须写 tipSelection（不得置空）", () => {
  const i = APP.indexOf("function syncTipSelectionFromBoneGroup(");
  assert.ok(i > 0, "找不到 syncTipSelectionFromBoneGroup");
  const body = APP.slice(i, APP.indexOf("\nfunction ", i + 10));
  assert.doesNotMatch(body, /isLeaf\s*\?\s*\{[^}]*\}\s*:\s*null/,
    "非叶分组仍被置空 tipSelection，高亮与笔刷路由会同时失效");
  assert.match(body, /anchorSegment/,
    "应以 anchorSegment（node.leafStart）为锚点，叶与非叶统一处理");
});

test("笔刷路由仍以 tipSelection 为唯一门禁（记录这条耦合）", () => {
  const i = BI.indexOf("function applySubBoneBrushSample(");
  assert.ok(i > 0, "找不到 applySubBoneBrushSample");
  const body = BI.slice(i, i + 900);
  assert.match(body, /if \(!selection\) return false;/,
    "门禁形态变了，请同步更新 app.js 侧对 tipSelection 的写入语义");
});

test("tipUiActive 依赖 tipSelection（记录这条耦合）", () => {
  assert.match(APP, /const tipUiActive = Boolean\(segmentBoneHost\(lock\)\)/,
    "tipUiActive 形态变了，请复查非叶层高亮是否仍成立");
  assert.match(APP, /sculptState\.state\.tipSelection\?\.lockId === lock\.id/,
    "tipUiActive 不再读 tipSelection.lockId，请复查高亮通路");
});

test("outliner 分组行必须先 selectLock，否则 groupPath 门禁静默失效", () => {
  const i = APP.indexOf("label.addEventListener(\"click\"");
  assert.ok(i > 0, "找不到分组行 click");
  const body = APP.slice(i, i + 900);
  assert.match(body, /selectLock\(lock\.id\)/,
    "click 里没有 selectLock，selectedPanelBoneGroupPath 的门禁会返回 null");
  // 顺序：selectLock 内部会清掉 lockId 不同的旧分组选择，反序会把刚设的值擦掉。
  assert.ok(
    body.indexOf("selectLock(lock.id)") < body.indexOf("selectedPanelBoneGroup ="),
    "必须先 selectLock 再赋 selectedPanelBoneGroup"
  );
});
