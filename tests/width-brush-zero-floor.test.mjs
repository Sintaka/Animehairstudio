import assert from "node:assert/strict";
import test from "node:test";

import { sculptWidthBrushMultiplier, SCULPT_WIDTH_BRUSH_VALUE_FLOOR } from "../modules/sculpt/width-brush.js";
import { TAPER_VALUE_MAX } from "../modules/core/app-config.js";

// Width Brush「刷普通发丝末端时突然爆开」回归测试。根因：DEFAULT_TAPER_CURVE 末端点是
// { position: 1, value: 0 }（合法的收尖值），乘法模型 current × (1 + amount) 里
// `current > 0 ? current : 1` 把这个合法的 0 误判成「曲线缺失」退化成中性宽度 1，
// 于是第一笔刷到末端就从 0 跳到约 1（=「爆开」）。修法：给乘法模型一个非零下限
// SCULPT_WIDTH_BRUSH_VALUE_FLOOR，退化目标从 1 改成这个下限，且紫色调用点
// （sculpt-geometry.js applyWidthCurveBrushSample）的 options.min 也从 0 抬到这个下限，
// 两处必须同时改——只抬 min 不改退化目标，current=0 仍会先退化成 1 再被钳回 min，
// 但那一步"退化成 1"已经把用户看到的中间态搞错了（且如果调用点漏传 min，退化到 1 会
// 直接超过任何 <2 的 max 被钳死在错误的高值）。

const PURPLE_OPTIONS = { min: SCULPT_WIDTH_BRUSH_VALUE_FLOOR, max: TAPER_VALUE_MAX };

test("核心回归：current=0 + 紫色 options 不再爆到约 1", () => {
  const result = sculptWidthBrushMultiplier(0, 5, 1, 1, PURPLE_OPTIONS);
  // 幅度判据：远离 1，而不是"存在性"判断。
  assert.ok(result < 0.1, `expected result < 0.1, got ${result}`);
  // 显式排除旧行为的特征值区间：base=1 退化时 next = 1 × (1 - 0.05) = 0.95，落在
  // [0.9, 1.1] 内。旧 bug 复现的话这条会先炸。
  assert.ok(!(result >= 0.9 && result <= 1.1), `result ${result} falls in the old-bug band [0.9, 1.1]`);
});

test("吸收态不复发：current=0 + reverse（Ctrl 加宽）能被拉回，严格大于 floor", () => {
  const result = sculptWidthBrushMultiplier(0, 5, 1, 1, { ...PURPLE_OPTIONS, reverse: true });
  // 若仍是旧的乘法吸收态（0 × 任何倍数 = 0），这里会等于 floor 而不会大于它。
  assert.ok(result > SCULPT_WIDTH_BRUSH_VALUE_FLOOR, `expected result > floor(${SCULPT_WIDTH_BRUSH_VALUE_FLOOR}), got ${result}`);
});

test("正常值不受影响：current=0.8 中段对照，数值与改动前一致", () => {
  // current=0.8 > 0，走 base=current 分支，floor 改动不影响这条路径。
  // 手算改动前期望值：amount = WIDTH_DIRECTION(-1) * (reverse?-1:1)(1) * |5| * 1 * 1 * 0.01 = -0.05
  // next = 0.8 × (1 - 0.05) = 0.76，落在默认绿色区间 [0.08, 2] 内，不被钳位改变。
  const result = sculptWidthBrushMultiplier(0.8, 5, 1, 1, {});
  assert.equal(result, 0.76);
});

test("NaN/undefined 仍被兜底为有限值，不产出 NaN", () => {
  const fromNaN = sculptWidthBrushMultiplier(NaN, 5, 1, 1, PURPLE_OPTIONS);
  const fromUndefined = sculptWidthBrushMultiplier(undefined, 5, 1, 1, PURPLE_OPTIONS);
  assert.ok(Number.isFinite(fromNaN), `expected finite, got ${fromNaN}`);
  assert.ok(Number.isFinite(fromUndefined), `expected finite, got ${fromUndefined}`);
});

test("绿色默认区间不变：不传 min/max 仍钳到 2 / 0.08（复刻 width-brush-purple.test.mjs）", () => {
  const greenDefaultUpper = sculptWidthBrushMultiplier(1.4, 500, 1, 1, { reverse: true });
  assert.equal(greenDefaultUpper, 2);
  const greenDefaultLower = sculptWidthBrushMultiplier(0.05, 500, 1, 1, {});
  assert.equal(greenDefaultLower, 0.08);
});
