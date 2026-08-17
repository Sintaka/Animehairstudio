/**
 * wind-preview.test.mjs — 吹风预览纯数学核心的单元测试。
 * node --test tests/wind-preview.test.mjs 全绿;零依赖(不 import three)。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createNoise4D,
  mulberry32,
  perStrandWind,
  fbm4,
  windAngleAt,
  windAxis,
  windRowQuats,
  slerpQuat,
  rotateVec3,
  deformVertexData
} from "../modules/geometry/wind-preview.js";

const EPS = 1e-6;

function near(a, b, eps = EPS) {
  return Math.abs(a - b) <= eps;
}

function vecNear(actual, expected, eps = EPS) {
  assert.equal(actual.length, expected.length, "vector length mismatch");
  for (let i = 0; i < expected.length; i++) {
    assert.ok(near(actual[i], expected[i], eps), `component ${i}: ${actual[i]} !≈ ${expected[i]} (eps ${eps})`);
  }
}

function vecLen(v) {
  return Math.hypot(v[0], v[1], v[2]);
}

function quatFromAxisAngle(axis, angle) {
  const ha = angle * 0.5;
  const s = Math.sin(ha);
  return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(ha)];
}

// 基线参数(所有 8 个契约字段齐全)
const baseParams = {
  windDirectionDeg: 0,
  windStrength: 1,
  windFrequency: 1,
  windTurbulence: 0,
  windTurbulenceScale: 1,
  windGustStrength: 1,
  windGustFreq: 0.5,
  windRootExponent: 1
};

// ---------------------------------------------------------------- 1. mulberry32

test("mulberry32: 确定性 — 同 seed 同序列,不同 seed 不同序列", () => {
  const seq = (seed, n) => {
    const rng = mulberry32(seed);
    return Array.from({ length: n }, () => rng());
  };
  assert.deepEqual(seq(123, 8), seq(123, 8), "same seed must give identical sequence");
  assert.notDeepEqual(seq(123, 8), seq(124, 8), "different seeds must diverge");
  for (const v of seq(42, 200)) {
    assert.ok(v >= 0 && v < 1, `value ${v} must be in [0,1)`);
  }
});

// ------------------------------------------------------------ 2. perStrandWind

test("perStrandWind: 确定性 + 同 seed 不同 strandId 不同", () => {
  assert.deepEqual(perStrandWind(7, 3), perStrandWind(7, 3), "same seed+strandId must be identical");
  const a = perStrandWind(7, 3);
  const b = perStrandWind(7, 4);
  assert.notDeepEqual(a, b, "different strandId must differ");
  // 值域契约:phase ∈ [0,2π),amp ∈ [0.8,1.2),offset ∈ [−0.3,0.3)
  assert.ok(a.phase >= 0 && a.phase < Math.PI * 2);
  assert.ok(a.amp >= 0.8 && a.amp < 1.2);
  for (const off of [a.offsetX, a.offsetY, a.offsetZ]) {
    assert.ok(off >= -0.3 && off < 0.3);
  }
});

test("perStrandWind: intensity 缩放 — 0 时全发丝一致,1 时全强度(向后兼容)", () => {
  // intensity=0 → phase/offset 全 0、amp 恒 1(所有 strandId 完全相同;用数值比较避免 −0/0 差异)
  const zeroA = perStrandWind(7, 3, 0);
  const zeroB = perStrandWind(7, 4, 0);
  assert.ok(Math.abs(zeroA.phase - zeroB.phase) < 1e-12 && Math.abs(zeroA.amp - zeroB.amp) < 1e-12, "intensity=0 must be strand-independent");
  assert.ok(Math.abs(zeroA.phase) < 1e-12);
  assert.ok(Math.abs(zeroA.amp - 1) < 1e-12);
  for (const off of [zeroA.offsetX, zeroA.offsetY, zeroA.offsetZ]) assert.ok(Math.abs(off) < 1e-12);
  // intensity=1 → 与旧签名(默认)逐位一致
  assert.deepEqual(perStrandWind(7, 3, 1), perStrandWind(7, 3), "intensity=1 must equal default");
  // 中间强度:随机化量按比例缩小(非严格线性,但不应超过全强度)
  const half = perStrandWind(7, 3, 0.5);
  const full = perStrandWind(7, 3, 1);
  assert.ok(Math.abs(half.phase) <= Math.abs(full.phase) + 1e-9);
  assert.ok(Math.abs(half.amp - 1) <= Math.abs(full.amp - 1) + 1e-9);
  for (const key of ["offsetX", "offsetY", "offsetZ"]) {
    assert.ok(Math.abs(half[key]) <= Math.abs(full[key]) + 1e-9);
  }
});

// ------------------------------------------------------------------- 3. fbm4

test("fbm4: 值域约 [−1,1] + 确定性", () => {
  const noise = createNoise4D(mulberry32(99));
  assert.equal(fbm4(noise, 0.5, 0.2, 0.9, 0.1, 3, 2, 0.5), fbm4(noise, 0.5, 0.2, 0.9, 0.1, 3, 2, 0.5),
    "deterministic for identical inputs");
  const rng = mulberry32(5);
  for (let k = 0; k < 200; k++) {
    const v = fbm4(noise, rng() * 4 - 2, rng() * 4 - 2, rng() * 4 - 2, rng() * 4 - 2);
    assert.ok(v >= -1 - 1e-9 && v <= 1 + 1e-9, `fbm4 out of range: ${v}`);
  }
  // octaves=1 → 退化为单次噪声
  assert.ok(near(fbm4(noise, 0.3, 0.7, 0.1, 0.9, 1), noise(0.3, 0.7, 0.1, 0.9)));
});

// ------------------------------------------------------------- 4. windAngleAt

test("windAngleAt: t=0 → 0;strength=0 → 0;t=1 且 strength>0 → >0", () => {
  const noise = createNoise4D(mulberry32(3));
  const ps = perStrandWind(7, 0);
  const world = [0, 0, 0];
  assert.equal(windAngleAt(0, world, baseParams, ps, noise, 1.23), 0, "t=0 must be 0 (root hard lock)");
  assert.equal(windAngleAt(0.019, world, baseParams, ps, noise, 1.23), 0, "t<0.02 must be 0");
  const zeroStrength = { ...baseParams, windStrength: 0 };
  assert.equal(windAngleAt(1, world, zeroStrength, ps, noise, 1.23), 0, "strength=0 must be 0");
  // windGustStrength=0 → gust=0.5 恒定 → θ = 5·amp·0.5 > 0
  const strong = { ...baseParams, windStrength: 5, windGustStrength: 0 };
  assert.ok(windAngleAt(1, world, strong, ps, noise, 1.23) > 0, "t=1 with strength>0 must be positive");
});

test("windAngleAt: 单调性 — 其余参数固定时 t 增大角度不减小", () => {
  const noise = createNoise4D(mulberry32(3));
  const ps = perStrandWind(7, 0);
  const world = [0, 0, 0]; // 采样点恒定 → fbm 项对 t 恒定
  const params = { ...baseParams, windStrength: 2, windGustStrength: 0 };
  let prev = windAngleAt(0, world, params, ps, noise, 0.5);
  for (let t = 0.01; t <= 1.0001; t += 0.01) {
    const cur = windAngleAt(t, world, params, ps, noise, 0.5);
    assert.ok(cur >= prev - 1e-9, `angle decreased at t=${t}: ${prev} → ${cur}`);
    prev = cur;
  }
});

// ---------------------------------------------------------------- 5. windAxis

test("windAxis: 垂直 up、单位长;方向角 0 → 绕 y 的旋转轴正确", () => {
  vecNear(windAxis(0), [-1, 0, 0], 1e-9); // cross([0,0,1],[0,1,0])
  vecNear(windAxis(90), [0, 0, 1], 1e-9); // cross([1,0,0],[0,1,0])
  for (const deg of [0, 17, 45, 90, 200, 330]) {
    const ax = windAxis(deg);
    assert.ok(near(vecLen(ax), 1, 1e-9), `|axis| = 1 at ${deg}°`);
    // dot(axis, up)=0 → 与 up 垂直
    assert.ok(near(ax[0] * 0 + ax[1] * 1 + ax[2] * 0, 0, 1e-9), `axis·up = 0 at ${deg}°`);
  }
  // 自定义 up
  vecNear(windAxis(0, [0, 1, 0]), [-1, 0, 0], 1e-9);
});

// ------------------------------------------------------------- 6. windRowQuats

test("windRowQuats: rows=1 → 单位;rows=4 且 strength=0 → 全单位;根行恒单位", () => {
  const noise = createNoise4D(mulberry32(3));
  const ps = perStrandWind(7, 0);
  const sample = (i) => [0, i * 0.25, 0];

  const single = windRowQuats(1, sample, baseParams, ps, noise, 0.5);
  assert.equal(single.length, 4);
  vecNear([...single], [0, 0, 0, 1], 1e-12);

  const calm = windRowQuats(4, sample, { ...baseParams, windStrength: 0 }, ps, noise, 0.5);
  assert.equal(calm.length, 16);
  for (let r = 0; r < 4; r++) {
    vecNear([...calm.subarray(r * 4, r * 4 + 4)], [0, 0, 0, 1], 1e-12, `row ${r}`);
  }

  const windy = windRowQuats(4, sample, { ...baseParams, windStrength: 2, windGustStrength: 0 }, ps, noise, 0.5);
  vecNear([...windy.subarray(0, 4)], [0, 0, 0, 1], 1e-12, "root row is always identity");
});

test("windRowQuats: 确定性 + 从根到尖累积旋转(总角 = Σ θ)", () => {
  const noise = createNoise4D(mulberry32(3));
  const ps = perStrandWind(7, 0);
  const params = { ...baseParams, windStrength: 2, windGustStrength: 0 };
  const sample = (i) => [0, i * 0.25, 0];
  const time = 0.5;

  const a = windRowQuats(4, sample, params, ps, noise, time);
  const b = windRowQuats(4, sample, params, ps, noise, time);
  for (let r = 0; r < 4; r++) {
    vecNear([...a.subarray(r * 4, r * 4 + 4)], [...b.subarray(r * 4, r * 4 + 4)], 1e-12, `row ${r} deterministic`);
  }

  // 累积语义:同轴旋转下,第 2 行的总角 = θ(t=0.5) + θ(t=1),而非仅 θ(t=1)
  const rows3 = windRowQuats(3, sample, params, ps, noise, time);
  const axis = windAxis(params.windDirectionDeg);
  const th1 = windAngleAt(0.5, sample(1), params, ps, noise, time);
  const th2 = windAngleAt(1, sample(2), params, ps, noise, time);
  const expectedRow1 = quatFromAxisAngle(axis, th1);
  const expectedRow2 = quatFromAxisAngle(axis, th1 + th2);
  vecNear([...rows3.subarray(4, 8)], expectedRow1, EPS, "row1 = rotation by θ(t=0.5)");
  vecNear([...rows3.subarray(8, 12)], expectedRow2, EPS, "row2 = rotation by θ(t=0.5)+θ(t=1) (cumulative)");
  for (let r = 0; r < 3; r++) {
    assert.ok(near(Math.hypot(...rows3.subarray(r * 4, r * 4 + 4)), 1, EPS), `row ${r} is unit quaternion`);
  }
});

// --------------------------------------------------- 7. slerpQuat / rotateVec3

test("slerpQuat: 端点、中点、负 w 处理", () => {
  const q90z = [0, 0, Math.SQRT1_2, Math.SQRT1_2]; // 绕 z 转 90°
  const id = [0, 0, 0, 1];

  vecNear(slerpQuat(id, q90z, 0), id, EPS, "t=0 → a");
  vecNear(slerpQuat(id, q90z, 1), q90z, EPS, "t=1 → b");
  vecNear(slerpQuat(q90z, q90z, 0.5), q90z, EPS, "slerp(a,a,t)=a");

  // 中点 = 绕 z 转 45°
  const mid = slerpQuat(id, q90z, 0.5);
  vecNear(mid, [0, 0, Math.sin(Math.PI / 8), Math.cos(Math.PI / 8)], EPS, "midpoint = 45° about z");

  // 负 w:−b 与 b 表示同一旋转 → slerp 结果一致(取最短路径)
  const negB = q90z.map((v) => -v);
  vecNear(slerpQuat(id, negB, 0.5), mid, EPS, "negated b handled (shortest path)");
});

test("rotateVec3: 长度不变 + 90° 旋转正确", () => {
  const q90z = [0, 0, Math.SQRT1_2, Math.SQRT1_2];
  vecNear(rotateVec3(q90z, [1, 0, 0]), [0, 1, 0], EPS, "R_z(90°)·(1,0,0) = (0,1,0)");
  vecNear(rotateVec3(q90z, [0, 0, 5]), [0, 0, 5], EPS, "axis vector invariant");

  const rng = mulberry32(11);
  for (let k = 0; k < 50; k++) {
    // 随机单位四元数
    const ha = [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI];
    const q = quatFromAxisAngle([Math.sin(ha[1]) * Math.cos(ha[2]), Math.sin(ha[1]) * Math.sin(ha[2]), Math.cos(ha[1])], ha[0]);
    const v = [rng() * 3 - 1.5, rng() * 3 - 1.5, rng() * 3 - 1.5];
    const r = rotateVec3(q, v);
    assert.ok(near(vecLen(r), vecLen(v), EPS), `length preserved for random q/v (k=${k})`);
  }
});

// -------------------------------------------------------- 8. deformVertexData

function makeDeformInputs({ sentinelAt = null } = {}) {
  const rows = 5;
  const positions = new Float32Array(rows * 3);
  const normals = new Float32Array(rows * 3);
  const tangents = new Float32Array(rows * 3);
  const gridRows = new Float32Array(rows);
  for (let r = 0; r < rows; r++) {
    positions[r * 3] = 0;            // 相对链锚点沿 z 偏移 0.1(z 垂直于风轴 [−1,0,0],旋转才会动)
    positions[r * 3 + 1] = r * 0.25; // 沿 y 排布
    positions[r * 3 + 2] = 0.1;
    normals[r * 3 + 1] = 1;          // 发向(沿链)
    tangents[r * 3 + 2] = 1;         // 横向
    gridRows[r] = r;
  }
  if (sentinelAt !== null) gridRows[sentinelAt] = -1;

  const params = { ...baseParams, windStrength: 2, windGustStrength: 0 };
  const noise = createNoise4D(mulberry32(3));
  const ps = perStrandWind(7, 0);
  const time = 0.5;
  const chainPoints = new Float64Array(rows * 3);
  for (let r = 0; r < rows; r++) {
    chainPoints[r * 3 + 1] = r * 0.25; // 与 rest 顶点同 y 的直链
  }
  const rowQuats = windRowQuats(rows, (i) => [0, i * 0.25, 0], params, ps, noise, time);
  return { positions, normals, tangents, gridRows, chainPoints, rowQuats };
}

test("deformVertexData: gridRows=−1 顶点不动;根行位移 < 尖部位移;确定性", () => {
  // —— −1 哨兵不动
  const sent = makeDeformInputs({ sentinelAt: 2 });
  const sentPos = sent.positions.slice();
  deformVertexData(sent);
  vecNear(
    [sent.positions[6], sent.positions[7], sent.positions[8]],
    [sentPos[6], sentPos[7], sentPos[8]],
    0,
    "vertex with gridRows=−1 stays untouched"
  );

  // —— 非有限 row 不动
  const nanIn = makeDeformInputs();
  nanIn.gridRows[3] = NaN;
  const nanBefore = [nanIn.positions[9], nanIn.positions[10], nanIn.positions[11]];
  deformVertexData(nanIn);
  vecNear(
    [nanIn.positions[9], nanIn.positions[10], nanIn.positions[11]],
    nanBefore,
    0,
    "vertex with NaN row stays untouched"
  );

  // —— 根少动、尖多动
  const inp = makeDeformInputs();
  const rest = inp.positions.slice();
  deformVertexData(inp);
  const displ = [];
  for (let r = 0; r < 5; r++) {
    displ.push(Math.hypot(
      inp.positions[r * 3] - rest[r * 3],
      inp.positions[r * 3 + 1] - rest[r * 3 + 1],
      inp.positions[r * 3 + 2] - rest[r * 3 + 2]
    ));
  }
  assert.ok(displ[0] < 1e-9, `root displacement ≈ 0, got ${displ[0]}`);
  assert.ok(displ[4] > displ[0], `tip moves more than root: ${displ[4]} > ${displ[0]}`);
  assert.ok(displ[4] > displ[1], `tip moves more than near-root: ${displ[4]} > ${displ[1]}`);
  assert.ok(displ[4] > 0, "tip actually moved");

  // —— 法线/切线只旋转(长度不变)
  for (let r = 0; r < 5; r++) {
    assert.ok(near(
      Math.hypot(inp.normals[r * 3], inp.normals[r * 3 + 1], inp.normals[r * 3 + 2]), 1, EPS),
      `normal length preserved at row ${r}`);
    assert.ok(near(
      Math.hypot(inp.tangents[r * 3], inp.tangents[r * 3 + 1], inp.tangents[r * 3 + 2]), 1, EPS),
      `tangent length preserved at row ${r}`);
  }

  // —— 同输入两次调用结果一致(确定性)
  const again = makeDeformInputs();
  deformVertexData(again);
  for (let i = 0; i < inp.positions.length; i++) {
    assert.ok(near(inp.positions[i], again.positions[i], 0), `positions[${i}] deterministic`);
    assert.ok(near(inp.normals[i], again.normals[i], 0), `normals[${i}] deterministic`);
    assert.ok(near(inp.tangents[i], again.tangents[i], 0), `tangents[${i}] deterministic`);
  }
});

console.log("wind-preview tests complete");
