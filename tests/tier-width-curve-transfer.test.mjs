// tier-width-curve-transfer.test.mjs - 中间层 WidthCurve 所有权转移的纯函数
// （modules/geometry/tip-width-curve.js 的 bakeTierWidthCurveFromLeaves /
// resampleTierWidthCurveToLeaf）。只测曲线数组层面的数学，不碰分组树/bone 字段——
// 那部分由调用方（分组树那一侧）负责，见 project_panel_bone_tree 备忘。
import assert from "node:assert/strict";
import test from "node:test";
import {
  TIP_WIDTH_VALUE_MAX,
  TIP_WIDTH_VALUE_MIN,
  bakeTierWidthCurveFromLeaves,
  resampleTierWidthCurveToLeaf
} from "../modules/geometry/tip-width-curve.js";
import { sampleTaperCurve } from "../modules/geometry/curve-math.js";
import { tipWidthControlTs } from "../modules/geometry/tip-width-curve.js";

// 构造一条常值曲线：唯一两个点（t=0 与 t=1），采样任何 t 都得到同一个 value。
function constCurve(value) {
  return [
    { position: 0, value, interpolation: "linear" },
    { position: 1, value, interpolation: "linear" }
  ];
}

// 构造一条线性斜坡曲线：value(t) = base + slope * t。
function rampCurve(base, slope) {
  return [
    { position: 0, value: base, interpolation: "linear" },
    { position: 1, value: base + slope, interpolation: "linear" }
  ];
}

// ---------------------------------------------------------------------------
// 3. 平均规则：两个叶子曲线一个恒 0.5、一个恒 1.5 ⇒ 烘出来恒 1.0
// ---------------------------------------------------------------------------
test("bakeTierWidthCurveFromLeaves：两叶子常值 0.5 与 1.5 的算术平均恒为 1.0", () => {
  const tierGridTs = tipWidthControlTs(0.3);
  const baked = bakeTierWidthCurveFromLeaves({
    leafCurves: [constCurve(0.5), constCurve(1.5)],
    leafGridTs: [tipWidthControlTs(0.2), tipWidthControlTs(0.5)],
    tierGridTs,
    fallbackCurve: null
  });
  assert.equal(baked.length, tierGridTs.length, "每个 tier 网格位置都应产出一个点");
  for (const point of baked) {
    assert.ok(Math.abs(point.value - 1.0) < 1e-9, `平均值应恒为 1.0，实际 ${point.value}`);
  }
});

// ---------------------------------------------------------------------------
// 4. 单叶子退化：逐点等于原曲线采样
// ---------------------------------------------------------------------------
test("bakeTierWidthCurveFromLeaves：只有一个叶子且网格相同时，逐点等于该叶子曲线的采样值", () => {
  const gridTs = tipWidthControlTs(0.4);
  const leaf = rampCurve(0.6, 0.8); // 0.6 → 1.4，落在合法区间内
  const baked = bakeTierWidthCurveFromLeaves({
    leafCurves: [leaf],
    leafGridTs: [gridTs],
    tierGridTs: gridTs,
    fallbackCurve: null
  });
  assert.equal(baked.length, gridTs.length);
  for (let i = 0; i < gridTs.length; i += 1) {
    const expected = sampleTaperCurve(leaf, gridTs[i]);
    assert.ok(
      Math.abs(baked[i].value - expected) < 1e-9,
      `位置 ${gridTs[i]} 处应逐点等于原曲线采样值 ${expected}，实际 ${baked[i].value}`
    );
  }
});

// ---------------------------------------------------------------------------
// 2. 网格不同才是重点：tier forkT 与 leaf forkT 不同（0.2 vs 0.5）时，
//    重采样结果不应等于简单复制原数组（幅度判据，而非仅「不相等」）。
// ---------------------------------------------------------------------------
test("resampleTierWidthCurveToLeaf：tier 与 leaf 网格不同（0.2 vs 0.5）时，结果按幅度真的偏离原数组", () => {
  const tierGridTs = tipWidthControlTs(0.2);
  const leafGridTs = tipWidthControlTs(0.5);
  // 用一条有明显斜率的曲线，这样「网格错位」会产生可观测的数值差异（而不是恰好持平）。
  const tierCurve = tierGridTs.map((position, index) => ({
    position,
    value: 0.5 + 1.0 * (index / Math.max(1, tierGridTs.length - 1)),
    interpolation: "linear"
  }));
  const resampled = resampleTierWidthCurveToLeaf({ tierCurve, leafGridTs });
  assert.equal(resampled.length, leafGridTs.length);

  // 「简单复制」= 直接把 tierCurve 的 value 数组原样搬过来（position 换成 leaf 的）。
  // 真重采样必须在至少一个位置上明显偏离（阈值取 1e-3，远大于浮点误差量级）。
  let maxDiff = 0;
  for (let i = 0; i < resampled.length; i += 1) {
    const copiedValue = tierCurve[Math.min(i, tierCurve.length - 1)].value;
    maxDiff = Math.max(maxDiff, Math.abs(resampled[i].value - copiedValue));
  }
  assert.ok(
    maxDiff > 1e-3,
    `网格错位应产生可观测差异（>1e-3），实际最大差异 ${maxDiff}——说明没有真的按位置重采样`
  );

  // 同时校验其确实等于「在 leafGridTs 每个位置上对 tierCurve 采样」的直接定义。
  for (let i = 0; i < leafGridTs.length; i += 1) {
    const expected = sampleTaperCurve(tierCurve, leafGridTs[i]);
    assert.ok(Math.abs(resampled[i].value - expected) < 1e-9);
  }
});

// ---------------------------------------------------------------------------
// 1. 往返保形：中间层曲线 → 写回单叶子（网格相同）→ 再烘回中间层，
//    误差应 < 1e-9。注意：往返保形只在「单叶子且网格相同」时可严格成立——
//    多叶子平均本身就有信息损失，往返不可能严格相等，这里如实用单叶子场景钉住
//    「至少在无损场景下管线本身不引入额外误差」，避免用宽松阈值掩盖真实损失。
// ---------------------------------------------------------------------------
test("往返保形（单叶子、网格相同）：tier → 写回叶子 → 再烘回 tier，误差 < 1e-9", () => {
  const gridTs = tipWidthControlTs(0.35);
  const tierCurve = gridTs.map((position, index) => ({
    position,
    value: 0.7 + 0.6 * Math.sin(index), // 非单调、非常值，避免退化巧合
    interpolation: "linear"
  })).map((point) => ({
    ...point,
    value: Math.min(TIP_WIDTH_VALUE_MAX, Math.max(TIP_WIDTH_VALUE_MIN, point.value))
  }));

  const leafCurve = resampleTierWidthCurveToLeaf({ tierCurve, leafGridTs: gridTs });
  const rebaked = bakeTierWidthCurveFromLeaves({
    leafCurves: [leafCurve],
    leafGridTs: [gridTs],
    tierGridTs: gridTs,
    fallbackCurve: null
  });

  assert.equal(rebaked.length, tierCurve.length);
  let maxError = 0;
  for (let i = 0; i < tierCurve.length; i += 1) {
    maxError = Math.max(maxError, Math.abs(rebaked[i].value - tierCurve[i].value));
  }
  assert.ok(maxError < 1e-9, `往返误差应 < 1e-9，实际最大误差 ${maxError}`);
});

// ---------------------------------------------------------------------------
// 5. 钳位：喂一个超出合法区间 [TIP_WIDTH_VALUE_MIN, TIP_WIDTH_VALUE_MAX] 的值，
//    确认被钳住。
// ---------------------------------------------------------------------------
test("钳位：超出 [TIP_WIDTH_VALUE_MIN, TIP_WIDTH_VALUE_MAX] 的值必须被钳住", () => {
  const gridTs = tipWidthControlTs(0.3);
  const wildCurve = [
    { position: 0, value: -50, interpolation: "linear" },
    { position: 1, value: 999, interpolation: "linear" }
  ];

  const baked = bakeTierWidthCurveFromLeaves({
    leafCurves: [wildCurve],
    leafGridTs: [gridTs],
    tierGridTs: gridTs,
    fallbackCurve: null
  });
  for (const point of baked) {
    assert.ok(point.value >= TIP_WIDTH_VALUE_MIN && point.value <= TIP_WIDTH_VALUE_MAX,
      `bake 结果必须钳位在区间内，实际 ${point.value}`);
  }

  const resampled = resampleTierWidthCurveToLeaf({ tierCurve: wildCurve, leafGridTs: gridTs });
  for (const point of resampled) {
    assert.ok(point.value >= TIP_WIDTH_VALUE_MIN && point.value <= TIP_WIDTH_VALUE_MAX,
      `resample 结果必须钳位在区间内，实际 ${point.value}`);
  }
});

// ---------------------------------------------------------------------------
// 6. 容错：null / 空数组 / 畸形点不抛错
// ---------------------------------------------------------------------------
test("bakeTierWidthCurveFromLeaves：leafCurves 全 null 时回落到 fallbackCurve，不抛错", () => {
  const gridTs = tipWidthControlTs(0.3);
  assert.doesNotThrow(() => {
    const baked = bakeTierWidthCurveFromLeaves({
      leafCurves: [null, null],
      leafGridTs: [gridTs, gridTs],
      tierGridTs: gridTs,
      fallbackCurve: constCurve(1.2)
    });
    assert.equal(baked.length, gridTs.length);
    for (const point of baked) {
      assert.ok(Math.abs(point.value - 1.2) < 1e-9);
    }
  });
});

test("bakeTierWidthCurveFromLeaves：leafCurves/leafGridTs/tierGridTs 为空数组时返回空数组，不抛错", () => {
  assert.doesNotThrow(() => {
    const baked = bakeTierWidthCurveFromLeaves({
      leafCurves: [],
      leafGridTs: [],
      tierGridTs: [],
      fallbackCurve: null
    });
    assert.deepEqual(baked, []);
  });
});

test("bakeTierWidthCurveFromLeaves：非数组/畸形入参（undefined、字符串、含非法 position 的点）不抛错并给出可用回落", () => {
  const gridTs = tipWidthControlTs(0.3);
  assert.doesNotThrow(() => {
    const baked = bakeTierWidthCurveFromLeaves({
      leafCurves: undefined,
      leafGridTs: "not-an-array",
      tierGridTs: gridTs,
      fallbackCurve: null
    });
    assert.equal(baked.length, gridTs.length);
    for (const point of baked) {
      assert.ok(Number.isFinite(point.value));
      assert.ok(point.value >= TIP_WIDTH_VALUE_MIN && point.value <= TIP_WIDTH_VALUE_MAX);
    }
  });

  assert.doesNotThrow(() => {
    const malformedCurve = [
      { position: "not-a-number", value: 5 },
      { position: null, value: -3 },
      { position: 0.5, value: 1 }
    ];
    const baked2 = bakeTierWidthCurveFromLeaves({
      leafCurves: [malformedCurve],
      leafGridTs: [gridTs],
      tierGridTs: gridTs,
      fallbackCurve: null
    });
    assert.equal(baked2.length, gridTs.length);
    for (const point of baked2) {
      assert.ok(Number.isFinite(point.value));
    }
  });

  // tierGridTs 里混入非数字/NaN 位置：应被过滤，不抛错，也不产出 NaN 点。
  assert.doesNotThrow(() => {
    const baked3 = bakeTierWidthCurveFromLeaves({
      leafCurves: [constCurve(1.0)],
      leafGridTs: [gridTs],
      tierGridTs: [0.1, "bad", NaN, undefined, 0.9],
      fallbackCurve: null
    });
    assert.equal(baked3.length, 2, "非数字位置应被过滤掉，只剩 0.1 与 0.9");
    for (const point of baked3) {
      assert.ok(Number.isFinite(point.value));
    }
  });
});

test("resampleTierWidthCurveToLeaf：tierCurve 为 null / 空数组时不抛错，给出安全回落（1.0，钳位内）", () => {
  const gridTs = tipWidthControlTs(0.3);
  assert.doesNotThrow(() => {
    const resampledNull = resampleTierWidthCurveToLeaf({ tierCurve: null, leafGridTs: gridTs });
    assert.equal(resampledNull.length, gridTs.length);
    for (const point of resampledNull) {
      assert.ok(Math.abs(point.value - 1.0) < 1e-9);
    }

    const resampledEmpty = resampleTierWidthCurveToLeaf({ tierCurve: [], leafGridTs: gridTs });
    assert.equal(resampledEmpty.length, gridTs.length);
  });
});

test("resampleTierWidthCurveToLeaf：leafGridTs 为空/畸形时返回空数组，不抛错", () => {
  assert.doesNotThrow(() => {
    const result1 = resampleTierWidthCurveToLeaf({ tierCurve: constCurve(1.0), leafGridTs: [] });
    assert.deepEqual(result1, []);

    const result2 = resampleTierWidthCurveToLeaf({ tierCurve: constCurve(1.0), leafGridTs: undefined });
    assert.deepEqual(result2, []);

    const result3 = resampleTierWidthCurveToLeaf({ tierCurve: constCurve(1.0), leafGridTs: ["bad", NaN] });
    assert.deepEqual(result3, []);
  });
});

