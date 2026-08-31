// outliner-selection-sync-wiring.test.mjs —— 钉住 0.2.176 修的两个症状的接线。
//
// 症状 A：outliner 里分组行与 zipper 行两套选中态不互斥（先选分组再选 zipper，
// 分组行不会取消选择）。症状 B：视口三条选择路径（Alt+点击回落分支、body-click
// toggle 汇合点、beginPanelSplitHandleDrag 调用点）原先都不触发 renderLockList()，
// 导致 outliner 的 .selected 不跟视口同步。
//
// 为什么走源码文本断言：app.js 是 21000+ 行 ESM 编排层，本仓 660+ 条测试从不
// import 它（体量与副作用都不适合当模块加载）。跨模块/跨分支接线是否真的调用了
// 某个函数，纯函数单测测不到——本仓已有教训（0.2.154 层级按钮只改数字不改树，
// 13 条纯函数单测全绿也没抓到）。所以这里像 panel-bone-level-wiring.test.mjs /
// panel-bone-brush-wiring.test.mjs 一样，直接对 app.js 与
// modules/bones/bone-interaction.js 的源码文本做锚点定位 + 切片断言。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const boneInteractionSource = readFileSync(
  new URL("../modules/bones/bone-interaction.js", import.meta.url),
  "utf8"
);

// ── 工具：按起止锚点切出一段源码，并要求两个锚点在全文件都恰好命中一次 ──────────
function sliceBetween(src, startAnchor, endAnchor, label) {
  const startMatches = src.split(startAnchor).length - 1;
  assert.equal(startMatches, 1, `锚点起点不唯一（命中 ${startMatches} 次）：${label} / ${startAnchor}`);
  const endMatches = src.split(endAnchor).length - 1;
  assert.equal(endMatches, 1, `锚点终点不唯一（命中 ${endMatches} 次）：${label} / ${endAnchor}`);
  const s = src.indexOf(startAnchor);
  const e = src.indexOf(endAnchor);
  assert.ok(e > s, `终点锚点出现在起点锚点之前：${label}`);
  return src.slice(s, e);
}

// ── 症状 A：分组行 handler 必须清空 zipper 选中态 ─────────────────────────────
test("分组行 handler：清空 panelSplitSelection 与写 selectedPanelBoneGroup 在同一个 handler 内", () => {
  // createPanelBoneGroupRow 到下一个函数 createOutlinerPanelBoneGroups 之间，就是
  // 分组行 click handler 的完整源码（先用 get_node_card 式的思路，实测两个锚点各命中 1 次）。
  const handlerSlice = sliceBetween(
    appSource,
    "function createPanelBoneGroupRow(lock, node, path, levels) {",
    "function createOutlinerPanelBoneGroups(lock) {",
    "createPanelBoneGroupRow"
  );
  assert.match(
    handlerSlice,
    /sculptState\.state\.panelSplitSelection = null;/,
    "分组行 handler 内缺少清空 panelSplitSelection —— 先选分组再选 zipper 时分组行不会取消选择（症状 A）"
  );
  assert.match(
    handlerSlice,
    /selectedPanelBoneGroup = selected \?/,
    "分组行 handler 内没找到写 selectedPanelBoneGroup 的赋值 —— 锚点或修法可能变了"
  );
  // 顺序也要对：先 selectLock 门禁，再清 zipper 选中态，再写 selectedPanelBoneGroup。
  const idxSelectLock = handlerSlice.indexOf(
    "if (sel.state.selectedId !== lock.id) selectLock(lock.id);"
  );
  const idxClearZipper = handlerSlice.indexOf("sculptState.state.panelSplitSelection = null;");
  const idxWriteGroup = handlerSlice.indexOf("selectedPanelBoneGroup = selected ?");
  assert.ok(idxSelectLock >= 0, "selectLock 门禁锚点在切片内没找到");
  assert.ok(
    idxSelectLock < idxClearZipper && idxClearZipper < idxWriteGroup,
    "三行的相对顺序不对：应为 selectLock 门禁 → 清空 panelSplitSelection → 写 selectedPanelBoneGroup"
  );
});

// ── 症状 B 路径 1：applyAltClickCandidate 的 else 回落分支要调 renderLockList ──
test("applyAltClickCandidate：else 回落分支与 drilled 分支都要调 renderLockList", () => {
  const fnSlice = sliceBetween(
    appSource,
    "function applyAltClickCandidate(candidate) {",
    "function finishBrushAltClick(event) {",
    "applyAltClickCandidate"
  );
  // drilled 分支（分组树可用）本来就调了 renderLockList，先确认没被误删。
  const idxIfDrilled = fnSlice.indexOf("if (drilled) {");
  assert.ok(idxIfDrilled >= 0, "if (drilled) 分支锚点没找到 —— 函数结构可能变了");
  const idxElse = fnSlice.indexOf("} else {", idxIfDrilled);
  assert.ok(idxElse > idxIfDrilled, "else 回落分支锚点没找到");
  const drilledBranch = fnSlice.slice(idxIfDrilled, idxElse);
  assert.match(
    drilledBranch,
    /renderLockList\(\);/,
    "drilled 分支的 renderLockList() 丢了 —— 分组树可用时的路径本该早就调它"
  );
  // else 分支：从 "} else {" 到该分支自己的收尾 "}"（下一行是 updateCurveObjects 调用，
  // 那是两条分支的汇合点，不属于 else 分支内部）。
  const idxJoin = fnSlice.indexOf("updateCurveObjects(lock, { visible: true });", idxElse);
  assert.ok(idxJoin > idxElse, "两条分支的汇合点锚点没找到");
  const elseBranch = fnSlice.slice(idxElse, idxJoin);
  assert.match(
    elseBranch,
    /renderLockList\(\);/,
    "else 回落分支内缺 renderLockList() —— 普通发丝/单段 panel 场景下 Alt+点击选中发尖后 outliner 不会同步（症状 B 路径 1）"
  );
});

// ── 症状 B 路径 2：body-click toggle 的汇合点要调 renderLockList ────────────
test("body-click toggle：syncSegmentControlsForLock 与 retargetOpenSegmentTaperEditor 之间有 renderLockList", () => {
  const retargetAnchor = "taperEditor.retargetOpenSegmentTaperEditor?.(selectedLockNow, hoverSeg);";
  const syncAnchor = "segmentApi.syncSegmentControlsForLock(selectedLockNow);";
  // syncAnchor 在文件里出现两次（if/else 分支各一次），retargetAnchor 只出现一次，
  // 紧跟在 if 分支那次 syncAnchor 之后 —— 用 lastIndexOf 从 retargetAnchor 往前找。
  assert.equal(
    (appSource.match(/taperEditor\.retargetOpenSegmentTaperEditor\?\.\(selectedLockNow, hoverSeg\);/g) || []).length,
    1,
    "retargetOpenSegmentTaperEditor 调用点锚点不唯一"
  );
  const retargetIdx = appSource.indexOf(retargetAnchor);
  assert.ok(retargetIdx >= 0, "retargetOpenSegmentTaperEditor 调用点没找到");
  const syncIdx = appSource.lastIndexOf(syncAnchor, retargetIdx);
  assert.ok(syncIdx >= 0 && syncIdx < retargetIdx, "syncSegmentControlsForLock 锚点没找到在 retarget 之前");
  const between = appSource.slice(syncIdx + syncAnchor.length, retargetIdx);
  assert.match(
    between,
    /renderLockList\(\);/,
    "syncSegmentControlsForLock 与 retargetOpenSegmentTaperEditor 之间缺 renderLockList() —— " +
      "视口点发片本体选段后 outliner 不会同步（症状 B 路径 2）"
  );
});

// ── 症状 B 路径 3：beginPanelSplitHandleDrag 调用点要调 renderLockList ──────
test("bonesApi.beginPanelSplitHandleDrag(event) 的 true 分支内有 renderLockList", () => {
  const callAnchor = "if (bonesApi.beginPanelSplitHandleDrag(event)) {";
  assert.equal(
    (appSource.match(/if \(bonesApi\.beginPanelSplitHandleDrag\(event\)\) \{/g) || []).length,
    1,
    "beginPanelSplitHandleDrag 调用点锚点不唯一"
  );
  const callIdx = appSource.indexOf(callAnchor);
  assert.ok(callIdx >= 0, "beginPanelSplitHandleDrag 调用点没找到");
  const pdIdx = appSource.indexOf("event.preventDefault();", callIdx);
  assert.ok(pdIdx > callIdx, "调用点之后没找到 event.preventDefault()");
  const branch = appSource.slice(callIdx, pdIdx);
  assert.match(
    branch,
    /renderLockList\(\);/,
    "beginPanelSplitHandleDrag 的 true 分支内缺 renderLockList() —— " +
      "视口拖 zipper 手柄或发尖子骨骼后 outliner 不会同步（症状 B 路径 3）"
  );
});

// ── 钉住「刻意不给 bone-interaction.js 加 dep」这个决定 ─────────────────────
test("bone-interaction.js 仍不持有 renderLockList（接线刻意留在 app.js 调用点）", () => {
  assert.equal(
    (boneInteractionSource.match(/renderLockList/g) || []).length,
    0,
    "bone-interaction.js 出现了 renderLockList —— 如果是有意加的 dep，别忘了 bump 它自己的 " +
      "?v= 与全部 importer 的传递闭包；如果是误加，删掉，接线应仍在 app.js 的调用点"
  );
  // 对照：证明上面的搜索本身是有效的（不是文件路径写错导致命中 0）。
  assert.ok(
    (boneInteractionSource.match(/panelSplitSelection/g) || []).length > 0,
    "对照断言失败：bone-interaction.js 对 panelSplitSelection 也命中 0，说明文件路径可能读错了"
  );
});

