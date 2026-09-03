// twist-curve-migration.test.mjs —— 钉住旧档 twistCurve → pointTwists 的 bake 等价性。
//
// 判据来自计划文档第 5 步：「旧档 bake 前后 strandTwistAt 在同一批 t 上数值一致」。
// 这里复刻的是**运行时的读取侧**（sampleArray / 旧版积分表达式），而 bake 侧
// 一律调生产函数 —— 否则两边都是复制品，生产代码漂移测试也不会红。
//
// ★ fixture 陷阱：仓库里 5 个真实 .ahs 存档的 twistCurve **全是默认平零曲线**
// （2 点、value 全 0）⇒ 在它们上面「bake 与不 bake」同真，判据零分辨力。
// 所以这里必须用**有梯度**的构造曲线，并配负向对照。
import test from "node:test";
import assert from "node:assert/strict";
import {
  bakeTwistCurveIntoPointTwists,
  bakedTwistDeltas,
  twistCurveHasContribution
} from "../modules/io/twist-curve-migration.js";
import { sampleIntegratedEnvelopeCurve, sampleArray } from "../modules/geometry/curve-math.js";

const DEG_TO_RAD = Math.PI / 180;
const FLAT = [{ position: 0, value: 0 }, { position: 1, value: 0 }];

// 有梯度的曲线（平零曲线无分辨力）
const CURVES = {
  linear: [{ position: 0, value: 0 }, { position: 1, value: 180 }],
  pulse: [{ position: 0, value: 0 }, { position: 0.5, value: 240 }, { position: 1, value: 0 }],
  signChange: [{ position: 0, value: -180 }, { position: 0.5, value: 0 }, { position: 1, value: 180 }]
};

/** 旧运行时读取侧：曲线经积分再转弧度（app.js 0.2.183 及之前的 strandProfileTwistAt 那一项）。 */
const legacyCurveTwistAt = (curve, t) => sampleIntegratedEnvelopeCurve(curve, t) * DEG_TO_RAD;
/** 新运行时读取侧：只走 pointTwists。 */
const bakedTwistAt = (pointTwists, t) => sampleArray(pointTwists, t);

test("twistCurveHasContribution：平零曲线与空值判为无贡献，有非零 value 判为有贡献", () => {
  assert.equal(twistCurveHasContribution(FLAT), false);
  assert.equal(twistCurveHasContribution([]), false);
  assert.equal(twistCurveHasContribution(null), false);
  assert.equal(twistCurveHasContribution(CURVES.linear), true);
  // 负号也算贡献（不能用 truthy 判）
  assert.equal(twistCurveHasContribution([{ position: 0, value: -5 }]), true);
});

test("bake 后逐控制点数值 = 旧运行时在同一 t 的取值（单位从度换成弧度）", () => {
  for (const [name, curve] of Object.entries(CURVES)) {
    const count = 9;
    const deltas = bakedTwistDeltas(curve, count);
    assert.equal(deltas.length, count, `${name}: 长度应与控制点数一致`);
    for (let index = 0; index < count; index += 1) {
      const t = index / (count - 1);
      assert.ok(
        Math.abs(deltas[index] - legacyCurveTwistAt(curve, t)) < 1e-12,
        `${name} @t=${t}: bake 值 ${deltas[index]} 应等于旧运行时 ${legacyCurveTwistAt(curve, t)}`
      );
    }
  }
});

test("★ 负向对照：直接搬 value 数组（不做积分）必须与真值明显不同", () => {
  // 若 bake 误写成「直接搬数组」，这条会失败 —— 证明积分那步真的在起作用。
  for (const [name, curve] of Object.entries(CURVES)) {
    const count = 6;
    const baked = bakedTwistDeltas(curve, count);
    const naive = Array.from({ length: count }, (_, index) => (
      sampleArray(curve.map((point) => Number(point.value || 0)), index / (count - 1)) * DEG_TO_RAD
    ));
    const maxGap = Math.max(...baked.map((value, index) => Math.abs(value - naive[index])));
    assert.ok(
      maxGap * (180 / Math.PI) > 30,
      `${name}: 积分与直接搬数组的最大差仅 ${(maxGap * 180 / Math.PI).toFixed(2)}° —— 判据失去分辨力`
    );
  }
});

test("bake 是累加而非覆盖：已有的 pointTwists（笔刷成果）必须保留", () => {
  const brushed = [0.3, -0.7, 1.1, 0.0, 0.5];
  const lock = { pointTwists: [...brushed], twistCurve: CURVES.linear };
  assert.equal(bakeTwistCurveIntoPointTwists(lock, FLAT), true);
  const deltas = bakedTwistDeltas(CURVES.linear, brushed.length);
  for (let index = 0; index < brushed.length; index += 1) {
    assert.ok(
      Math.abs(lock.pointTwists[index] - (brushed[index] + deltas[index])) < 1e-12,
      `下标 ${index}: 应为 笔刷值 + bake 增量`
    );
  }
});

test("★ 幂等：bake 后曲线归零，二次 bake 不再改动（防存盘再打开时 twist 翻倍）", () => {
  const lock = { pointTwists: [0, 0, 0, 0, 0, 0], twistCurve: CURVES.pulse };
  assert.equal(bakeTwistCurveIntoPointTwists(lock, FLAT), true);
  assert.equal(twistCurveHasContribution(lock.twistCurve), false, "bake 后曲线必须已归零");
  const afterFirst = [...lock.pointTwists];
  assert.equal(bakeTwistCurveIntoPointTwists(lock, FLAT), false, "二次 bake 应判为无贡献并跳过");
  assert.deepEqual(lock.pointTwists, afterFirst, "二次 bake 不得再累加");
});

test("归零写入的是副本，不与传入的默认曲线共享引用", () => {
  const flat = [{ position: 0, value: 0 }, { position: 1, value: 0 }];
  const lock = { pointTwists: [0, 0], twistCurve: CURVES.linear };
  bakeTwistCurveIntoPointTwists(lock, flat);
  assert.notEqual(lock.twistCurve, flat, "不能按引用挂上去");
  assert.notEqual(lock.twistCurve[0], flat[0], "元素也要是副本");
  lock.twistCurve[0].value = 99;
  assert.equal(flat[0].value, 0, "改 lock 不得污染默认曲线");
});

test("无贡献时是恒等操作：平零曲线不动 pointTwists、不动曲线", () => {
  const lock = { pointTwists: [0.5, -0.25], twistCurve: FLAT };
  assert.equal(bakeTwistCurveIntoPointTwists(lock, FLAT), false);
  assert.deepEqual(lock.pointTwists, [0.5, -0.25]);
  assert.equal(lock.twistCurve, FLAT, "无贡献时连曲线对象都不该被替换");
});

test("退化输入不抛：pointTwists 缺失/为空/单点", () => {
  assert.equal(bakeTwistCurveIntoPointTwists({ twistCurve: CURVES.linear }, FLAT), false);
  assert.equal(bakeTwistCurveIntoPointTwists({ pointTwists: [], twistCurve: CURVES.linear }, FLAT), false);
  assert.equal(bakeTwistCurveIntoPointTwists(null, FLAT), false);
  const single = { pointTwists: [0], twistCurve: CURVES.linear };
  assert.equal(bakeTwistCurveIntoPointTwists(single, FLAT), true);
  // 单点时 t 恒为 0 ⇒ 积分值为 0
  assert.equal(single.pointTwists[0], 0);
  assert.equal(bakedTwistDeltas(CURVES.linear, 0).length, 0);
});

test("重建保真度：控制点数 ≥5 时，用 pointTwists 重建的曲线与真积分误差在容差内", () => {
  // 记录已实测的量级，防止将来有人把 bake 改成更粗的采样而无人察觉。
  // n=3 最差可到真值的 25%（变号曲线），n≥5 时降到 6.3% 以内。
  for (const [name, curve] of Object.entries(CURVES)) {
    const count = 9;
    const lock = { pointTwists: new Array(count).fill(0), twistCurve: curve };
    bakeTwistCurveIntoPointTwists(lock, FLAT);
    const truthMax = Math.max(...Array.from({ length: 101 }, (_, k) => (
      Math.abs(legacyCurveTwistAt(curve, k / 100))
    )));
    let maxError = 0;
    for (let k = 0; k <= 100; k += 1) {
      const t = k / 100;
      maxError = Math.max(maxError, Math.abs(bakedTwistAt(lock.pointTwists, t) - legacyCurveTwistAt(curve, t)));
    }
    assert.ok(
      maxError / truthMax < 0.03,
      `${name}: n=${count} 时相对误差 ${(maxError / truthMax * 100).toFixed(2)}% 超过 3%`
    );
  }
});
