// width-brush-tip-symmetry.test.mjs - Width Brush 刷发尖（segment/tube 段级 WidthCurve）时
// 必须双侧等比缩放，不能只写被刷的一侧（否则发尖被刷成非对称，这是本文件要钉住的回归）。
//
// 背景：手动拖拽绿色 WidthCurve 手柄默认就是双侧写同一个绝对 multiplier
// （bone-interaction.js updatePanelSplitHandleDrag 的 tipWidth 分支，writeWidth(side) +
// writeWidth(-side)）。笔刷分支（applySubBoneBrushSample 的 sculpt-width 段）此前漏了这
// 个既有约定，只对 target.side 一侧读写，刷发尖会变成只有一侧动的非对称编辑。
//
// 修复点不是"设成同一绝对值"（那会抹平已有的非对称形状），而是"等比缩放"：
// sculptWidthBrushMultiplier 算出的 amount 只依赖笔刷输入（strokeDistance/weight/
// strength/reverse），与 currentMultiplier 无关，返回 current × (1 + amount)。对两侧各自
// 的 current 套用同一个 amount，天然就是等比：保留已有的非对称形状，只整体缩放。
//
// 本文件不构造 DOM/相机：直接用发丝发尖 WidthCurve 的真实纯函数
// （strandTipWidthMultiplierAt 读值 / setStrandTipWidthCurveValue 写值 /
// sculptWidthBrushMultiplier 笔刷内核）复刻 bone-interaction.js 里那段双侧循环的**同一套
// 调用序列**，这样断言的是真实生产代码路径会产生的数值，而不是一个独立重新实现的模型。
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { sculptWidthBrushMultiplier } from "../modules/sculpt/width-brush.js";
import {
  setStrandTipWidthCurveValue,
  strandTipWidthMultiplierAt
} from "../modules/geometry/strand-tip-width.js";
import { strandSplitsFor } from "../modules/bones/bone-model.js";
import { TIP_WIDTH_VALUE_MAX } from "../modules/geometry/tip-width-curve.js";

// 最小的单拉链发丝 lock：2 根管（tube 0 / tube 1），全局曲线平直（FLAT），任何宽度差异
// 只来自段级 bone 曲线——与 split-tip-geometry.test.mjs 的 tipWidthLock 同一构型（不重复
// import 那个测试文件的 helper，直接内联一份等价的最小 fixture）。
function makeLock() {
  const flat = [
    { position: 0, value: 1, interpolation: "linear" },
    { position: 1, value: 1, interpolation: "linear" }
  ];
  return {
    geometryType: "strand",
    strandSplitEnabled: true,
    baseWidth: 0.2,
    widthScale: 1,
    taperCurve: flat.map((p) => ({ ...p })),
    strandSplits: [{ position: 0, height: 0.3, order: 0 }]
  };
}

function makeBone() {
  return {
    name: "split.0",
    parent: "main",
    tipClump: 0.12,
    taperCurve: null,
    taperCurveSecondary: null,
    asymmetricWidthCurve: null
  };
}

// 复刻 bone-interaction.js readTipWidthMultiplierForHost 的 strand 分支：side 传符号即可
// （strandTipWidthMultiplierAt 的 signedCoordinate 入参对发丝管内坐标只看符号）。
function readSide(lock, splits, tube, bone, side, t) {
  return strandTipWidthMultiplierAt(lock, t, side < 0 ? -1 : 1, bone, tube, splits);
}

// 复刻 writeTipWidthValueForHost 的 strand 分支。
function writeSide(lock, splits, tube, bone, side, t, value) {
  return setStrandTipWidthCurveValue(lock, splits, tube, bone, side, t, value);
}

// 复刻 bone-interaction.js 修复后 applySubBoneBrushSample 的 sculpt-width 双侧循环：对
// [targetSide, -targetSide] 各自读当前值、各自套同一个 amount（四个笔刷输入相同）、各自写回。
function brushBothSides(lock, splits, tube, bone, targetSide, t, strokeDistance, weight, strength, options = {}) {
  let written = null;
  [targetSide, -targetSide].forEach((side) => {
    const current = readSide(lock, splits, tube, bone, side, t);
    const next = sculptWidthBrushMultiplier(current, strokeDistance, weight, strength, options);
    const result = writeSide(lock, splits, tube, bone, side, t, next);
    if (result !== null) written = result;
  });
  return written;
}

test("Width Brush 刷发尖：默认单侧写会漏掉另一侧（回归判据本身要能测出旧 bug）", () => {
  // 这条测试不断言修复后的行为，而是证明"只写一侧"是可观测的、有判别力的坏行为——
  // 用来防止下面的等比断言巧合地在单侧写下也能通过。
  const lock = makeLock();
  const splits = strandSplitsFor(lock);
  const tube = 0;
  const bone = makeBone();
  const t = 1;
  writeSide(lock, splits, tube, bone, 1, t, 1.0);
  writeSide(lock, splits, tube, bone, -1, t, 1.0);
  const before = { right: readSide(lock, splits, tube, bone, 1, t), left: readSide(lock, splits, tube, bone, -1, t) };
  // 单侧写（旧 bug 的行为）：只对 side=1 读写一次。
  const current = readSide(lock, splits, tube, bone, 1, t);
  const next = sculptWidthBrushMultiplier(current, 500, 1, 1, { reverse: true });
  writeSide(lock, splits, tube, bone, 1, t, next);
  const after = { right: readSide(lock, splits, tube, bone, 1, t), left: readSide(lock, splits, tube, bone, -1, t) };
  assert.notEqual(after.right, before.right, "sanity: the brushed side actually changed");
  assert.equal(after.left, before.left, "single-side write leaves the other side untouched (this IS the bug)");
});

test("Width Brush 刷发尖：双侧等比缩放——起始值不同，刷一笔后比值不变", () => {
  const lock = makeLock();
  const splits = strandSplitsFor(lock);
  const tube = 0;
  const bone = makeBone();
  const t = 1;
  // 起始非对称：右 1.0，左 0.5（模拟用户此前已经手动调出的不对称形状）。
  writeSide(lock, splits, tube, bone, 1, t, 1.0);
  writeSide(lock, splits, tube, bone, -1, t, 0.5);
  const beforeRight = readSide(lock, splits, tube, bone, 1, t);
  const beforeLeft = readSide(lock, splits, tube, bone, -1, t);
  assert.equal(beforeRight, 1.0);
  assert.equal(beforeLeft, 0.5);
  const beforeRatio = beforeRight / beforeLeft;

  // 刷一笔：四个笔刷输入对两侧完全相同，只有 current 不同（brushBothSides 内部逐侧各读）。
  // 幅度刻意选得离两侧钳位边界都远（右 1.0→0.75、左 0.5→0.375，都在 [0.08, 2] 内部），
  // 这样比值判据测的是"等比缩放"本身，不会被下一条测试专门覆盖的"逐侧独立钳位"混进来。
  const written = brushBothSides(lock, splits, tube, bone, 1, t, 50, 0.5, 1, {});
  assert.notEqual(written, null, "at least one side must have written successfully");

  const afterRight = readSide(lock, splits, tube, bone, 1, t);
  const afterLeft = readSide(lock, splits, tube, bone, -1, t);
  // 幅度判据（不是"存在性"）：两侧都必须真的变了。
  assert.notEqual(afterRight, beforeRight, "the brushed side must change");
  assert.notEqual(afterLeft, beforeLeft, "the OTHER side must also change (this is the fix)");
  // 等比性核心判据：比值不变（允许浮点误差）。
  const afterRatio = afterRight / afterLeft;
  assert.ok(
    Math.abs(afterRatio - beforeRatio) < 1e-9,
    `ratio must be preserved: before=${beforeRatio}, after=${afterRatio}`
  );
  // 对照：证明不是"设成同一绝对值"——刷完两侧值仍不相等。
  assert.notEqual(afterRight, afterLeft, "must NOT collapse to the same absolute value (that would erase asymmetry)");
});

test("Width Brush 刷发尖：一侧撞钳位上界(2)时另一侧继续独立变化", () => {
  const lock = makeLock();
  const splits = strandSplitsFor(lock);
  const tube = 0;
  const bone = makeBone();
  const t = 1;
  // 右侧起点已经很接近上界（1.9），左侧起点较低（0.5）。同一个 amount 是相对倍率
  // （current × (1 + amount)），所以刻意选一个恰好让 1.9 撞界（需要 amount >= 1/19 ≈
  // 0.0526）但远不足以让 0.5 撞界（需要 amount >= 3）的幅度：这里 distance=6 算出
  // amount=0.06（WIDTH_DIRECTION=-1 与 reverse:true 相乘抵消为正，scale 取模块默认
  // SCULPT_WIDTH_BRUSH_SCALE=0.01，见 width-brush.js）。
  writeSide(lock, splits, tube, bone, 1, t, 1.9);
  writeSide(lock, splits, tube, bone, -1, t, 0.5);

  brushBothSides(lock, splits, tube, bone, 1, t, 6, 1, 1, { reverse: true });

  const afterRight = readSide(lock, splits, tube, bone, 1, t);
  const afterLeft = readSide(lock, splits, tube, bone, -1, t);
  assert.equal(afterRight, TIP_WIDTH_VALUE_MAX, "the near-ceiling side must clamp to TIP_WIDTH_VALUE_MAX");
  // 左侧起点 0.5 距上界 2 还很远，同一个 amount 下不会撞界，必须继续变化（且不能也被钳成
  // 同一个 2，否则说明发生了"一侧撞界联动锁住/拉平另一侧"的错误实现）。
  assert.notEqual(afterLeft, 0.5, "the far-from-ceiling side must still move");
  assert.notEqual(afterLeft, TIP_WIDTH_VALUE_MAX, "the far-from-ceiling side must NOT also hit the ceiling");
  assert.ok(afterLeft < TIP_WIDTH_VALUE_MAX, "clamping is per-side independent, not linked across sides");
});

test("bone-interaction.js sculpt-width 分支：源码层面钉住双侧循环（防止有人改回单侧）", async () => {
  const source = await readFile(
    new URL("../modules/bones/bone-interaction.js", import.meta.url),
    "utf8"
  );
  // ① 必须真的对 [side, -side] 两侧循环，而不是只碰 target.side 一次。
  assert.match(
    source,
    /\[target\.side, -target\.side\]\.forEach/,
    "the sculpt-width branch must iterate both sides, not just target.side"
  );
  // ② 循环体内 read/write 必须各出现恰好一次调用点（在这条 forEach 内部）——用来防止
  // 有人把双侧循环留在源码里但内部又退化成只读写其中一侧。
  const loopMatch = source.match(/\[target\.side, -target\.side\]\.forEach\(\(side\) => \{[\s\S]*?\n    \}\);/);
  assert.ok(loopMatch, "the both-sides forEach block must be found intact");
  const loopBody = loopMatch[0];
  const readCalls = loopBody.match(/readTipWidthMultiplierForHost\(\{/g) || [];
  const writeCalls = loopBody.match(/writeTipWidthValueForHost\(\{/g) || [];
  assert.equal(readCalls.length, 1, "read must happen exactly once per side, inside the loop");
  assert.equal(writeCalls.length, 1, "write must happen exactly once per side, inside the loop");
  // ③ 两侧调用共享同一个 amount 落点：sculptWidthBrushMultiplier 的四个笔刷输入
  // （strokeDistance/weight/strength/reverse via options）在循环体内不依赖 side，只有
  // currentMultiplier 依赖 side——用负向对照堵"每侧各自算一份 amount"的变体实现。
  assert.match(loopBody, /sculptWidthBrushMultiplier\(\s*\n\s*currentMultiplier,\s*\n\s*strokeDistance,/,
    "both sides must feed the SAME strokeDistance/weight/strength/reverse into sculptWidthBrushMultiplier"
  );
});
