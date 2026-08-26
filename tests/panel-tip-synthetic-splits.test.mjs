// panel-tip-synthetic-splits.test.mjs — syntheticSplitsForLeafSpan（panel-tip-strand.js）
// 的回归测试。这是方案 A 的核心推导：中间层分组（覆盖多个连续叶子）要让
// tipMainSectionPoint / tipSurfaceFrameAt / tipWidthMultiplierAt 这批按叶子逐个重算
// centerU 的既有函数，在「合成 splits」（去掉区间内部 zipper）之后自动算出正确的区间
// 中心，而不必改动那批函数本身。
//
// 真实数字来自 Scalp Conform Test 4.ahs 的 Front Bangs 1（panel-bone-tree-tip-carrier
// 交接文档同一份真档）：panelSplits 按 position 升序，N=2 zipper，
// positions = [-0.3333333333333333, 0.36666666666666675]。
import assert from "node:assert/strict";
import test from "node:test";

import { syntheticSplitsForLeafSpan } from "../modules/geometry/panel-tip-strand.js";

const REAL_SPLITS = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];

// 重算 centerU 的方式与 panel-tip-strand.js 内的七处 `(boundaries[i] + boundaries[i+1]) * 0.5`
// 完全一致：本测试不重新发明公式，直接复刻同一条式子，避免测试自己的假设和被测代码的假设
// 各写一套、两边都错却互相印证。
function boundariesOf(splits) {
  return [-1, ...splits.map((s) => s.position), 1];
}
function centerOf(boundaries, index) {
  return (boundaries[index] + boundaries[index + 1]) * 0.5;
}

test("退化情形 leafStart === leafEnd：合成数组与原数组同源、长度不变、vIdx 恒等", () => {
  for (let leaf = 0; leaf <= REAL_SPLITS.length; leaf += 1) {
    const { splits, vIdx } = syntheticSplitsForLeafSpan(REAL_SPLITS, leaf, leaf);
    assert.equal(splits, REAL_SPLITS, `叶子 ${leaf}：退化情形必须返回同一份引用，不拷贝`);
    assert.equal(vIdx, leaf);
  }
});

test("跨叶区间 [0,1]：合成 boundaries 恰好落在区间两端，重算 centerU 精确等于区间中心（lateralU=0）", () => {
  const origB = boundariesOf(REAL_SPLITS);
  const spanLo = origB[0];
  const spanHi = origB[2];
  const spanCenter = (spanLo + spanHi) * 0.5;

  const { splits, vIdx } = syntheticSplitsForLeafSpan(REAL_SPLITS, 0, 1);
  assert.equal(splits.length, 1, "去掉区间内部唯一的一条 zipper");
  assert.equal(vIdx, 0);

  const synthB = boundariesOf(splits);
  assert.equal(synthB[vIdx], spanLo);
  assert.equal(synthB[vIdx + 1], spanHi);

  const recomputed = centerOf(synthB, vIdx);
  assert.equal(recomputed, spanCenter);
  assert.equal(spanCenter - recomputed, 0, "lateralU = v - centerU 在 v=spanCenter 处必须精确为 0");
});

test("跨叶区间 [1,2]：同上，且与方案 B（原数组 + leafStart 直接当 segmentIndex）的错误结果对照", () => {
  const origB = boundariesOf(REAL_SPLITS);
  const spanLo = origB[1];
  const spanHi = origB[3];
  const spanCenter = (spanLo + spanHi) * 0.5;

  const { splits, vIdx } = syntheticSplitsForLeafSpan(REAL_SPLITS, 1, 2);
  assert.equal(splits.length, 1);
  assert.equal(vIdx, 1);

  const synthB = boundariesOf(splits);
  const recomputed = centerOf(synthB, vIdx);
  assert.equal(recomputed, spanCenter, "方案 A：合成数组重算的中心必须精确等于区间中心");

  // 对照组（方案 B，已被否决）：直接用原数组 + leafStart 当 segmentIndex，会重算出叶子 1
  // 自己的中心而不是区间 [1,2] 的中心——这就是用户实测到的 bug。这里断言它确实非零，
  // 证明本测试不是在验证一个总是成立的平凡等式。
  const leafCenterWrongWay = centerOf(origB, 1);
  assert.notEqual(
    spanCenter - leafCenterWrongWay,
    0,
    "方案 B 的重算中心必须偏离区间中心（否则这条对照组没有区分力）"
  );
});

test("跨越全部叶子的区间 [0,2]：合成 splits 为空数组，boundaries 退化为 [-1,1]", () => {
  const { splits, vIdx } = syntheticSplitsForLeafSpan(REAL_SPLITS, 0, 2);
  assert.deepEqual(splits, []);
  assert.equal(vIdx, 0);
  const synthB = boundariesOf(splits);
  assert.deepEqual(synthB, [-1, 1]);
  assert.equal(centerOf(synthB, 0), 0);
});

test("非法/空 splits 输入不抛异常：null 与非数组都当空数组处理", () => {
  assert.deepEqual(syntheticSplitsForLeafSpan(null, 0, 0), { splits: [], vIdx: 0 });
  const { splits, vIdx } = syntheticSplitsForLeafSpan(undefined, 0, 1);
  assert.deepEqual(splits, []);
  assert.equal(vIdx, 0);
});
