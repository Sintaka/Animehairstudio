// scripts/bench-uv-pack.mjs — 测量 packFamilies（alpaca occupancy + SEEDS 择优）耗时，
// 用于评估「UV 排列多线程化」的收益。合成数据模拟真实发型项目（闭合管状发丝 + panel）。
// 运行：node scripts/bench-uv-pack.mjs
//
// 追加：packFamiliesAsync（Worker 池并行版，见 modules/io/uv-pack-async.js）对照。
// node 里没有浏览器 Worker → 用 worker_threads 注入 createWorker（必须显式 createPackAsync，
// 不能依赖默认单例：node 下无 Worker 会走同步回退）。池大小 workers = min(可用核, 16)。

import { packFamilies, findMaxKAlpaca } from "../modules/io/uv-pack.js";
import { createPackAsync } from "../modules/io/uv-pack-async.js";
import { Worker as NodeWorker } from "node:worker_threads";
import os from "node:os";

// 确定性 LCG（与 uv-pack.js 同公式）
function makeLCG(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

// w×h 世界矩形 mesh（3D 表面积 = w*h），UV 归一化 0-1
function rectQuad(w, h) {
  return {
    positions: [0, 0, 0, w, 0, 0, w, 0, h, 0, 0, h],
    uvs: [0, 0, 1, 0, 1, 1, 0, 1],
    faces: [[0, 1, 2, 3]]
  };
}

// 生成 n 个 family：约 70% 闭合发丝（细长），30% panel（宽扁）
function makeFamilies(n, rand) {
  const families = [];
  for (let i = 0; i < n; i += 1) {
    const isPanel = rand() < 0.3;
    const length = isPanel
      ? 0.15 + rand() * 0.25           // panel: 0.15–0.4
      : 0.25 + rand() * 0.95;          // strand: 0.25–1.2
    const width = isPanel
      ? 0.10 + rand() * 0.20           // panel: 0.10–0.30
      : 0.02 + rand() * 0.13;          // strand: 0.02–0.15
    families.push({
      id: `s${i}`,
      meshes: [rectQuad(width, length)],
      length,
      width
    });
  }
  return families;
}

// 复刻 packFamilies 前 4 步：valid list + totalArea + boxUnit（不跑打包）
function buildBoxUnit(families) {
  const valid = [];
  let totalArea = 0;
  for (const family of families) {
    const length = Number(family.length);
    if (!(Number.isFinite(length) && length > 0)) continue;
    const area = (family.meshes || []).reduce((sum, mesh) => {
      // meshSurfaceArea 对单 quad = 宽×高（w*h）；这里直接算
      const w = Number(family.width);
      return sum + (Number.isFinite(w) && w > 0 ? w * length : 0);
    }, 0);
    if (!(area > 0)) continue;
    valid.push({ family, area, width: family.width, length, island: valid.length });
    totalArea += area;
  }
  const boxUnit = valid.map(({ family, island }) => {
    let minU = Infinity;
    let minV = Infinity;
    let maxU = -Infinity;
    let maxV = -Infinity;
    for (const mesh of family.meshes || []) {
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        const u = Number(uvs[i]);
        const v = Number(uvs[i + 1]);
        if (u < minU) minU = u;
        if (v < minV) minV = v;
        if (u > maxU) maxU = u;
        if (v > maxV) maxV = v;
      }
    }
    return { family, island, minU, minV, maxU, maxV, width: maxU - minU, height: maxV - minV };
  });
  return { boxUnit, totalArea, valid };
}

function bench(families, label) {
  const t0 = performance.now();
  const result = packFamilies(families, { fill: 0.8 });
  const ms = performance.now() - t0;
  console.log(`  ${label}: ${ms.toFixed(1)} ms  (k=${result.k ? result.k.toFixed(4) : "null"}, fillUsed=${result.fillUsed ? result.fillUsed.toFixed(3) : 0})`);
  return ms;
}

// 单个 seed 的 findMaxKAlpaca 耗时（= 一个 worker 任务单位的成本）
function benchOneSeed(families, label) {
  const { boxUnit, totalArea } = buildBoxUnit(families);
  const maxSideOrder = boxUnit
    .map((box, index) => ({ index, key: Math.max(box.width, box.height) }))
    .sort((a, b) => b.key - a.key)
    .map((entry) => entry.index);
  const t0 = performance.now();
  const k = findMaxKAlpaca(boxUnit, totalArea, 0.8, 10 / 4096, 256, "maxSide", maxSideOrder);
  const ms = performance.now() - t0;
  console.log(`  ${label}: ${ms.toFixed(1)} ms  (k=${k.toFixed(4)})`);
  return ms;
}

// Worker 池异步版耗时（packFamilies 会原地改 uvs → 每次测量用 structuredClone 隔离）
async function benchAsync(packer, families, label) {
  const t0 = performance.now();
  const result = await packer.packFamiliesAsync(structuredClone(families), { fill: 0.8 });
  const ms = performance.now() - t0;
  console.log(`  ${label}: ${ms.toFixed(1)} ms  (k=${result.k ? result.k.toFixed(4) : "null"}, fillUsed=${result.fillUsed ? result.fillUsed.toFixed(3) : 0})`);
  return ms;
}

async function main() {
  console.log("nIslands | packFamilies(SEEDS=8) | 单 seed findMaxKAlpaca | 8×单seed 理论合计");
  for (const n of [10, 23, 50, 100, 200]) {
    const families = makeFamilies(n, makeLCG(20260817));
    const full = bench(families, `packFamilies n=${n}`);
    const one = benchOneSeed(families, `单 seed n=${n}`);
    console.log(`  → n=${n}: 8 单 seed 合计 ${(8 * one).toFixed(1)} ms vs 实际 ${full.toFixed(1)} ms（择优取整可省 ${(full - 8 * one).toFixed(1)}）`);
  }

  // ---- 同步 vs 异步（Worker 池）对照 ----
  const hw = typeof os.availableParallelism === "function" ? os.availableParallelism() : os.cpus().length;
  const workers = Math.min(hw, 16);
  const asyncPacker = createPackAsync({
    createWorker: (url) => new NodeWorker(url instanceof URL ? url : String(url), { type: "module" }),
    workers
  });
  console.log(`\npackFamilies(同步) vs packFamiliesAsync(Worker 池) 对照（workers=${workers}，可用核 ${hw}）`);
  console.log("nIslands | sync ms | async ms | speedup");
  for (const n of [23, 50, 100]) {
    const families = makeFamilies(n, makeLCG(20260817));
    const t0 = performance.now();
    const syncRes = packFamilies(structuredClone(families), { fill: 0.8 });
    const syncMs = performance.now() - t0;
    const t1 = performance.now();
    const asyncRes = await asyncPacker.packFamiliesAsync(structuredClone(families), { fill: 0.8 });
    const asyncMs = performance.now() - t1;
    const speedup = syncMs / Math.max(asyncMs, 1e-9);
    const bitExact = asyncRes.k === syncRes.k && asyncRes.fillUsed === syncRes.fillUsed
      && asyncRes.packed.length === syncRes.packed.length;
    console.log(`  ${n} | ${syncMs.toFixed(1)} | ${asyncMs.toFixed(1)} | ${speedup.toFixed(2)}×${bitExact ? "" : "  ⚠ 与同步不一致"}`);
  }
  await asyncPacker.dispose();
}

await main();
console.log("\n说明：worker 并行上限 ≈ (单 seed 成本×8) / min(核数,8)；每任务粒度可再切到 k 采样点。");
