/**
 * wind-preview.js — AnimeHairStudio 吹风预览纯数学核心(视口程序化预览,非物理)。
 *
 * 契约(主进程定稿,并行 agent 按此消费):
 *   θ(t) = windStrength · amp · gust · (1 + turbulence·fbm) · t^rootExponent
 *   gust = 0.5 + 0.5·sin(2π·gustFreq·time + phase·0.5)          // 低频阵风
 *   fbm  = fBm4(noise, p·scale, w = time·freq + phase, octaves=3, lacunarity=2.0, gain=0.5)
 * amp / phase / offset 为每束随机化:mulberry32(hash(seed, strandId)) 派生。
 *
 * 每行(t=0 根 .. 1 尖)一个绕「风轴」的旋转角,windRowQuats 从根到尖累积,
 * deformVertexData 把网格顶点原地变形(根少动、发尖多动)。
 *
 * 纯函数、零依赖(仅 import vendored createNoise4D),Node 可直接测。
 */

import { createNoise4D } from "../../js/vendor/simplex-noise.js";

// 顺带转发,便于调用方用 mulberry32 种子构造确定性噪声:createNoise4D(mulberry32(seed))
export { createNoise4D };

const TAU = Math.PI * 2;

/** 逐分量读取:接受 [x,y,z] 数组(契约主形态)或 {x,y,z} 对象。 */
function axis(v, i) {
  if (Array.isArray(v)) return v[i];
  return i === 0 ? v.x : i === 1 ? v.y : v.z;
}

/** 有限数则取之,否则取 fallback(undefined/NaN/Infinity 防御)。 */
function num(v, fallback) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

/**
 * mulberry32 — 确定性 32 位 PRNG。
 * 同 seed → 同序列;seed 经 >>>0 归一为 uint32;返回 [0,1) 均匀值。
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * perStrandWind — 每束随机化参数。
 * seed 与 strandId 混合:hash = (seed ^ (strandId * 2654435761)) >>> 0
 *   —— 2654435761 为黄金分割常数(0x9E3779B9),把相邻 strandId 的序列散开;
 *      ^ 把全局 seed 混入;>>>0 归一为 uint32。strandId=0 时退化为 mulberry32(seed)。
 *   phase = rng·2π ∈ [0,2π);amp = 0.8+0.4·rng ∈ [0.8,1.2);offset = (rng−0.5)·0.6 ∈ [−0.3,0.3)。
 * intensity(0..1,默认 1)= 随机化强度(windStrandRandom 滑杆):
 *   phase 缩放到 [0, 2π·intensity)、amp 向 1 插值(1+(amp−1)·intensity)、offset 等比缩放
 *   —— intensity=0 时所有发丝完全一致(phase=0/amp=1/offset=0),=1 时全强度。
 */
export function perStrandWind(seed, strandId, intensity = 1) {
  const hash = (seed ^ (strandId * 2654435761)) >>> 0;
  const rng = mulberry32(hash);
  const rawPhase = rng() * TAU;
  const rawAmp = 0.8 + 0.4 * rng();
  const rawOffsetX = (rng() - 0.5) * 0.6;
  const rawOffsetY = (rng() - 0.5) * 0.6;
  const rawOffsetZ = (rng() - 0.5) * 0.6;
  const k = Math.min(1, Math.max(0, Number(intensity) || 0));
  return {
    phase: rawPhase * k,
    amp: 1 + (rawAmp - 1) * k,
    offsetX: rawOffsetX * k,
    offsetY: rawOffsetY * k,
    offsetZ: rawOffsetZ * k
  };
}

/**
 * fbm4 — 4D 分形布朗运动,归一化到约 [−1,1]。
 * 每 octave 值为 noise 的 [−1,1] 输出,加权平均后仍在 [−1,1]。
 */
export function fbm4(noise, x, y, z, w, octaves = 3, lacunarity = 2, gain = 0.5) {
  let sum = 0;
  let norm = 0;
  let amp = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x, y, z, w);
    norm += amp;
    amp *= gain;
    x *= lacunarity;
    y *= lacunarity;
    z *= lacunarity;
    w *= lacunarity;
  }
  return norm > 0 ? sum / norm : 0;
}

/**
 * windAngleAt — 行参数 t∈[0,1](0=根,1=尖)处的旋转角(弧度)。
 * params 字段:windDirectionDeg, windStrength, windFrequency, windTurbulence,
 *   windTurbulenceScale, windGustStrength, windGustFreq, windRootExponent。
 * 采样点 = worldPos + perStrand.offset(每束空间偏移 → 束间差异)。
 * windGustStrength 缩放阵风振荡幅度,默认 1 时精确复现定稿公式 gust = 0.5+0.5·sin(...)。
 * t<0.02(根行硬锁)或 windStrength=0 → 0。
 */
export function windAngleAt(t, worldPos, params, perStrand, noise, time) {
  const tt = Math.min(1, Math.max(0, num(t, 0)));
  if (tt < 0.02) return 0;

  const strength = num(params.windStrength, 0);
  if (strength === 0) return 0;

  const rootExp = num(params.windRootExponent, 1);
  const freq = num(params.windFrequency, 1);
  const gustFreq = num(params.windGustFreq, 0.5);
  const gustStrength = num(params.windGustStrength, 1);
  const turb = num(params.windTurbulence, 0);
  const scale = num(params.windTurbulenceScale, 0);

  const phase = perStrand.phase;
  const amp = perStrand.amp;

  // 低频阵风:值域 [0,1](gustStrength=1 时 = 定稿公式)
  const gust = 0.5 + 0.5 * gustStrength * Math.sin(TAU * gustFreq * time + phase * 0.5);

  // 采样点 = 世界坐标 + 每束偏移;时间维度 w = time·windFrequency + phase
  const sx = axis(worldPos, 0) + perStrand.offsetX;
  const sy = axis(worldPos, 1) + perStrand.offsetY;
  const sz = axis(worldPos, 2) + perStrand.offsetZ;
  const w = time * freq + phase;

  // (1 + turbulence·fbm);turbulence=0 时数学等价为 1,跳过噪声求值
  let fbm = 1;
  if (turb !== 0 && noise) {
    fbm = 1 + turb * fbm4(noise, sx * scale, sy * scale, sz * scale, w, 3, 2.0, 0.5);
  }

  return strength * amp * gust * fbm * Math.pow(tt, rootExp);
}

/**
 * windAxis — 风轴(旋转轴)单位向量 = normalize(cross(windDir, up))。
 * windDir 由方位角构造:dir = [sin(a), 0, cos(a)],a = windDirectionDeg 弧度。
 * 例:windDirectionDeg=0 → dir=[0,0,1],axis = cross([0,0,1],[0,1,0]) = [−1,0,0]。
 */
export function windAxis(windDirectionDeg, up = [0, 1, 0]) {
  const a = (num(windDirectionDeg, 0) * Math.PI) / 180;
  const ux = axis(up, 0);
  const uy = axis(up, 1);
  const uz = axis(up, 2);
  const dir = [Math.sin(a), 0, Math.cos(a)];
  const cx = dir[1] * uz - dir[2] * uy;
  const cy = dir[2] * ux - dir[0] * uz;
  const cz = dir[0] * uy - dir[1] * ux;
  const len = Math.hypot(cx, cy, cz);
  if (len < 1e-9) return [0, 0, 1]; // 退化保护(风与 up 平行)
  return [cx / len, cy / len, cz / len];
}

/**
 * windRowQuats — 每行一个累积「世界旋转」四元数 [x,y,z,w],返回 Float64Array(rows·4)。
 * 根行(0)= 单位四元数;第 i 行 = 前 i 行旋转的复合:
 *   q_acc = q_acc × q_i —— 先转根再转尖(较早/更靠根的行的旋转先作用于向量),
 *   等价于从根到尖逐行把旋转叠加上去。同轴旋转下第 i 行的总角 = Σ_{j≤i} θ_j。
 * 旋转轴 = windAxis(params.windDirectionDeg);旋转角 = windAngleAt(i/(rows−1), sampleWorldAt(i), ...)。
 */
export function windRowQuats(rows, sampleWorldAt, params, perStrand, noise, time) {
  const n = Math.max(0, Math.floor(rows));
  const out = new Float64Array(n * 4);
  if (n === 0) return out;
  out[3] = 1; // 根行 = 单位四元数
  if (n === 1) return out;

  const ax = windAxis(params.windDirectionDeg);
  const denom = n - 1;
  let qx = 0, qy = 0, qz = 0, qw = 1; // 累积四元数(根 = identity)

  for (let i = 1; i < n; i++) {
    const ang = windAngleAt(i / denom, sampleWorldAt(i), params, perStrand, noise, time);
    const ha = ang * 0.5;
    const s = Math.sin(ha);
    const c = Math.cos(ha);
    const ix = ax[0] * s, iy = ax[1] * s, iz = ax[2] * s, iw = c;
    // q_acc = q_acc × q_i(先转根再转尖)
    const nx = qw * ix + qx * iw + qy * iz - qz * iy;
    const ny = qw * iy - qx * iz + qy * iw + qz * ix;
    const nz = qw * iz + qx * iy - qy * ix + qz * iw;
    const nw = qw * iw - qx * ix - qy * iy - qz * iz;
    qx = nx; qy = ny; qz = nz; qw = nw;
    const o = i * 4;
    out[o] = qx;
    out[o + 1] = qy;
    out[o + 2] = qz;
    out[o + 3] = qw;
  }
  return out;
}

/**
 * slerpQuat — 标准四元数球面插值,处理负 w(取最短路径,翻转 b 的符号)。
 * t=0 → a,t=1 → b;接近平行的四元数走归一化线性插值避免除零。
 */
export function slerpQuat(a, b, t) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  let dot = ax * bx + ay * by + az * bz + aw * bw;
  if (dot < 0) {
    dot = -dot;
    bx = -bx; by = -by; bz = -bz; bw = -bw;
  }
  const DOT_THRESHOLD = 0.9995;
  if (dot > DOT_THRESHOLD) {
    const x = ax + (bx - ax) * t;
    const y = ay + (by - ay) * t;
    const z = az + (bz - az) * t;
    const w = aw + (bw - aw) * t;
    const inv = 1 / Math.hypot(x, y, z, w);
    return [x * inv, y * inv, z * inv, w * inv];
  }
  const theta0 = Math.acos(dot);
  const theta = theta0 * t;
  const sinTheta0 = Math.sin(theta0);
  const s0 = Math.cos(theta) - dot * Math.sin(theta) / sinTheta0;
  const s1 = Math.sin(theta) / sinTheta0;
  return [ax * s0 + bx * s1, ay * s0 + by * s1, az * s0 + bz * s1, aw * s0 + bw * s1];
}

/**
 * rotateVec3 — 四元数旋转向量(手写,避免依赖 THREE)。
 * v' = v + 2w(q×v) + 2q×(q×v)
 */
export function rotateVec3(q, v) {
  const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  const vx = v[0], vy = v[1], vz = v[2];
  const tx = 2 * (qy * vz - qz * vy);
  const ty = 2 * (qz * vx - qx * vz);
  const tz = 2 * (qx * vy - qy * vx);
  return [
    vx + qw * tx + (qy * tz - qz * ty),
    vy + qw * ty + (qz * tx - qx * tz),
    vz + qw * tz + (qx * ty - qy * tx)
  ];
}

/**
 * deformVertexData — 用烘好的行旋转四元数把网格顶点原地变形。
 * 输入为普通数组 / typed array(调用方给 Float32Array);positions/normals/tangents 原地修改。
 *
 * 每顶点:row = gridRows[i](float,可为 −1;−1 或非有限 → 该顶点跳过不动);
 *   t = row/(rows−1);r0 = floor(row);frac = row−r0;
 *   q = slerp(rowQuats[r0], rowQuats[r0+1], frac)(r0+1 越界用 r0);
 *   chainPoint(r) = chainPoints 的第 r 行 [x,y,z](在相邻两行间按 frac 线性插值,
 *     整数行处精确等于该行,保证发丝沿链连续);
 *   pos' = chainPoint + rotate(q, restPos − chainPoint);
 *   normal' = rotate(q, restNormal);tangent' = rotate(q, restTangent)。
 * chainFrames 参数 v1 不用(预留签名)。
 */
export function deformVertexData({ positions, normals, tangents, gridRows, rowQuats, chainPoints, chainFrames }) {
  if (!positions || !gridRows || !rowQuats || !chainPoints) return;

  const rows = rowQuats.length >> 2; // 行数 = 四元数个数
  if (rows < 1) return;

  const verts = positions.length / 3;

  for (let i = 0; i < verts; i++) {
    const row = gridRows[i];
    if (typeof row !== "number" || !Number.isFinite(row) || row < 0) continue; // −1/非有限 → 不动

    const t = rows > 1 ? row / (rows - 1) : 0; // 契约定义的行参数(角度已烘入 rowQuats)

    let r0 = Math.floor(row);
    if (r0 < 0) r0 = 0;
    if (r0 > rows - 1) r0 = rows - 1;
    let r1 = r0 + 1;
    if (r1 > rows - 1) r1 = r0; // r0+1 越界 → 用 r0
    const frac = row - r0;

    const o0 = r0 * 4;
    const o1 = r1 * 4;
    const q = slerpQuat(
      [rowQuats[o0], rowQuats[o0 + 1], rowQuats[o0 + 2], rowQuats[o0 + 3]],
      [rowQuats[o1], rowQuats[o1 + 1], rowQuats[o1 + 2], rowQuats[o1 + 3]],
      frac
    );

    const c0 = r0 * 3;
    const c1 = r1 * 3;
    if (c0 + 2 >= chainPoints.length) continue; // chainPoints 不足 → 不动
    let px = chainPoints[c0];
    let py = chainPoints[c0 + 1];
    let pz = chainPoints[c0 + 2];
    if (c1 + 2 < chainPoints.length) {
      px += (chainPoints[c1] - px) * frac;
      py += (chainPoints[c1 + 1] - py) * frac;
      pz += (chainPoints[c1 + 2] - pz) * frac;
    }

    const i3 = i * 3;
    const rx = positions[i3] - px;
    const ry = positions[i3 + 1] - py;
    const rz = positions[i3 + 2] - pz;
    const moved = rotateVec3(q, [rx, ry, rz]);
    positions[i3] = px + moved[0];
    positions[i3 + 1] = py + moved[1];
    positions[i3 + 2] = pz + moved[2];

    if (normals && i3 + 2 < normals.length) {
      const nr = rotateVec3(q, [normals[i3], normals[i3 + 1], normals[i3 + 2]]);
      normals[i3] = nr[0];
      normals[i3 + 1] = nr[1];
      normals[i3 + 2] = nr[2];
    }
    if (tangents && i3 + 2 < tangents.length) {
      const tr = rotateVec3(q, [tangents[i3], tangents[i3 + 1], tangents[i3 + 2]]);
      tangents[i3] = tr[0];
      tangents[i3 + 1] = tr[1];
      tangents[i3 + 2] = tr[2];
    }
  }
}
