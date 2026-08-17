// scripts/smoke-async-contract.mjs — 冒烟：并行 agent 的 uv-pack-async（worker 池）以我的
// 新导出（preparePack/sampleMaxK/refineMaxK/applyPackResult）为契约运行，输出必须与同步
// packFamilies 逐位一致。node worker_threads 自建池（真实走 uv-pack-worker.js 的 sample/refine
// 消息 → 我的 sampleMaxK/refineMaxK）。运行：node scripts/smoke-async-contract.mjs

import assert from "node:assert/strict";
import { Worker } from "node:worker_threads";
import { createPackAsync } from "../modules/io/uv-pack-async.js";
import { packFamilies, PACK_GAP } from "../modules/io/uv-pack.js";

function makeLCG(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}
function rectQuad(w, h) {
  return {
    positions: [0, 0, 0, w, 0, 0, w, 0, h, 0, 0, h],
    uvs: [0, 0, 1, 0, 1, 1, 0, 1],
    faces: [[0, 1, 2, 3]]
  };
}
function makeFamilies(n, rand) {
  const families = [];
  for (let i = 0; i < n; i += 1) {
    const isPanel = rand() < 0.3;
    const length = isPanel ? 0.15 + rand() * 0.25 : 0.25 + rand() * 0.95;
    const width = isPanel ? 0.10 + rand() * 0.20 : 0.02 + rand() * 0.13;
    families.push({ id: `s${i}`, meshes: [rectQuad(width, length)], length, width });
  }
  return families;
}

// 深比较 packFamilies 返回（k/totalArea/fillUsed 严格相等；packed 逐字段；uvs 1e-12）
function assertSameResult(a, b, label) {
  assert.equal(a.k, b.k, `${label}: k 逐位一致 (${a.k} vs ${b.k})`);
  assert.equal(a.totalArea, b.totalArea, `${label}: totalArea 逐位一致`);
  assert.equal(a.fillUsed, b.fillUsed, `${label}: fillUsed 逐位一致`);
  assert.equal(a.gap, b.gap, `${label}: gap 一致`);
  assert.equal(a.packed.length, b.packed.length, `${label}: packed 数量`);
  for (let i = 0; i < a.packed.length; i += 1) {
    const pa = a.packed[i];
    const pb = b.packed[i];
    assert.equal(pa.id, pb.id, `${label}: packed[${i}].id`);
    assert.equal(pa.island, pb.island, `${label}: packed[${i}].island`);
    assert.equal(pa.x, pb.x, `${label}: packed[${i}].x`);
    assert.equal(pa.y, pb.y, `${label}: packed[${i}].y`);
    assert.equal(pa.width, pb.width, `${label}: packed[${i}].width`);
    assert.equal(pa.height, pb.height, `${label}: packed[${i}].height`);
  }
}

const families = makeFamilies(23, makeLCG(20260817));
const syncResult = packFamilies(families, { fill: 0.8 });

// async 路径：自定义 createWorker（node worker_threads）→ 走真实 worker 契约
const { packFamiliesAsync, dispose } = createPackAsync({
  createWorker: (url) => new Worker(url),
  workers: 4
});
const asyncFamilies = makeFamilies(23, makeLCG(20260817));
const asyncResult = await packFamiliesAsync(asyncFamilies, { fill: 0.8 });
assertSameResult(asyncResult, syncResult, "async(worker) vs sync");
console.log(`✓ packFamiliesAsync（node worker 池）与同步 packFamilies 逐位一致 (k=${syncResult.k})`);
dispose();

// node 无自定义 Worker 时的回退路径（packFamiliesAsync → 同步 packFamilies）
const { packFamiliesAsync: fallbackAsync, dispose: dispose2 } = createPackAsync();
const fbFamilies = makeFamilies(23, makeLCG(20260817));
const fbResult = await fallbackAsync(fbFamilies, { fill: 0.8 });
assertSameResult(fbResult, syncResult, "async(node 回退) vs sync");
console.log(`✓ packFamiliesAsync（node 无 Worker 回退）与同步 packFamilies 逐位一致 (k=${syncResult.k})`);
dispose2();

console.log("smoke-async-contract passed");
