// panel-bone-tier-wiring.test.mjs —— 钉住中间层接线的**同源性**。
//
// 中间层能被编辑的机制：resolveTipHost 认出「当前选中的是某个中间层」后，把该层覆盖的
// 所有叶子段的 bones[segment] 指向**同一个分组节点**，于是
//   ① 把手显示（bone-view-handles 读 host.tipChainFor / bones）
//   ② 拖拽写回（bone-interaction 的 writeTipEdit 写 bone.tip）
// 天然读写同一个对象，不需要额外同步代码。
//
// 这条接线有一个**静默失效**模式：resolveTipHost 的 groupPath 由 deps.selectedPanelBoneGroupPath
// 提供，缺这个 dep 时回落成「没选中」⇒ 中间层又变回不可编辑，而且不报错、测试也不红。
// 更坏的是只有**一边**接上：把手画在中间层、拖拽却写回叶子（本轮已经栽过同类 ——
// 候选点取 lock 层、写入取分组层，表现为「选中中间层却刷到主发片」，548 条测试全绿没抓到）。
// 所以这里断言两个构造点**都**转发了这个 dep，且 app.js 两个批次**都**提供了它。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rd = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const BVH = rd("../modules/bones/bone-view-handles.js");
const BI = rd("../modules/bones/bone-interaction.js");
const HOST = rd("../modules/bones/tip-sub-bone-host.js");
const APP = rd("../app.js");

test("两个 createTipSubBoneHostApi 构造点都转发 selectedPanelBoneGroupPath", () => {
  for (const [name, src] of [["bone-view-handles", BVH], ["bone-interaction", BI]]) {
    const i = src.indexOf("createTipSubBoneHostApi({");
    assert.ok(i > 0, `${name} 找不到 createTipSubBoneHostApi`);
    const block = src.slice(i, src.indexOf("});", i));
    assert.match(block, /selectedPanelBoneGroupPath/,
      `${name} 的构造块缺 selectedPanelBoneGroupPath —— 只接一边会「把手在中间层、拖拽写回叶子」`);
  }
});

test("host 侧自动取 groupPath，且 tierSpan 用 effectiveGroupPath 而非形参", () => {
  assert.match(HOST, /deps\.selectedPanelBoneGroupPath/, "host 没有读 deps.selectedPanelBoneGroupPath");
  assert.match(HOST, /resolvePanelTierSpan\(lock, effectiveGroupPath\)/,
    "tierSpan 必须用 effectiveGroupPath —— 用形参 groupPath 会让自动取值静默失效");
  // 必须排除**函数定义**那一行：`function resolvePanelTierSpan(lock, groupPath) {` 的形参表
  // 长得跟错误的调用一模一样。第一版没排除，于是断言咬到了定义本身、报了假红
  // （代码其实是对的）。判据加 `const tierSpan =` 前缀，只看调用点。
  assert.doesNotMatch(HOST, /const tierSpan = resolvePanelTierSpan\(lock, groupPath\)/,
    "仍在用形参 groupPath 解析 tierSpan（自动取值失效）");
});

test("app.js 定义 selectedPanelBoneGroupPath 并接给两个批次", () => {
  assert.match(APP, /function selectedPanelBoneGroupPath\(/, "app.js 缺定义");
  for (const batch of ["boneViewHandlesDeps", "boneInteractionDeps"]) {
    const i = APP.indexOf(`Object.assign(${batch}`);
    assert.ok(i > 0, `找不到 ${batch} 批次`);
    assert.match(APP.slice(i, i + 2800), /selectedPanelBoneGroupPath/,
      `${batch} 批次缺 selectedPanelBoneGroupPath`);
  }
});

test("覆盖段共享同一 bone 引用（读写同源的机制）—— 源码级断言", () => {
  // 数值级验收在 .tmp-bone-tree/verify-tier-endtoend.mjs（真实档 Test 4，bones[1]===bones[2]）。
  // 这里钉住实现手法：tierSpan 覆盖的段必须填入同一个 tierBone，而不是逐段各建一个对象。
  assert.match(HOST, /tierBone/, "host 里没有 tierBone —— 覆盖段可能各自建了对象");
  assert.doesNotMatch(HOST, /bones\[segment\]\s*=\s*\{\s*\.\.\.tierBone/,
    "覆盖段在浅拷贝 tierBone ⇒ 写回会落在副本上，中间层仍不可编辑");
});
