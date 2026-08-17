// tests/uv-pack-async.test.mjs — packFamiliesAsync（Worker 池并行版）测试。
// node 无浏览器 Worker → 用 worker_threads 包装 createWorker 注入（new Worker(url, {type:'module'})，
// worker_threads 与浏览器构造签名相近；URL 对象转 href 传字符串）。
// 用例：
//   1) 与同步 packFamilies 逐位一致（23 岛 reference 输入：LCG seed 20260817, fill=0.8；
//      makeFamilies 逻辑与 scripts/bench-uv-pack.mjs 相同）—— k/fillUsed/packed/每 family uvs；
//   2) 回退路径：node 默认单例（无 Worker）/ createWorker 抛错 → 仍 resolve 且结果 === packFamilies；
//   3) 多岛 50/100：无异常 + 与同步一致；
//   4) dispose 后再调不崩（池懒重建）。
// 运行：node --test tests/uv-pack-async.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Worker as NodeWorker } from "node:worker_threads";
import { packFamilies } from "../modules/io/uv-pack.js";
import { createPackAsync, packFamiliesAsync as defaultPackFamiliesAsync } from "../modules/io/uv-pack-async.js";

// ---- 合成输入（与 scripts/bench-uv-pack.mjs 完全一致）----
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
    const length = isPanel
      ? 0.15 + rand() * 0.25
      : 0.25 + rand() * 0.95;
    const width = isPanel
      ? 0.10 + rand() * 0.20
      : 0.02 + rand() * 0.13;
    families.push({ id: `s${i}`, meshes: [rectQuad(width, length)], length, width });
  }
  return families;
}

// node 的 worker_threads.Worker 接受 URL 对象（file:// 字符串会抛 ERR_WORKER_PATH）→ 直接传 URL
const nodeCreateWorker = (url) => new NodeWorker(url instanceof URL ? url : String(url), { type: "module" });

// ---- 断言辅助 ----
function approx(actual, expected, tol, msg) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `${msg || "approx"}: expected ${expected} ± ${tol}, got ${actual}`
  );
}
// 收集各 family 的 mesh uvs/uvisland（用于对比两个独立运行的输入副本）
function collectUvs(families) {
  return families.map((family) => family.meshes.map((mesh) => ({
    uvisland: mesh.uvisland,
    uvs: mesh.uvs ? mesh.uvs.slice() : null
  })));
}
function assertUvsConsistent(a, b, tol, msg) {
  assert.equal(a.length, b.length, `${msg}: family count`);
  for (let i = 0; i < a.length; i += 1) {
    assert.equal(a[i].length, b[i].length, `${msg}: family[${i}] mesh count`);
    for (let j = 0; j < a[i].length; j += 1) {
      assert.equal(a[i][j].uvisland, b[i][j].uvisland, `${msg}: family[${i}] mesh[${j}] uvisland`);
      if (a[i][j].uvs === null || b[i][j].uvs === null) {
        assert.equal(a[i][j].uvs, b[i][j].uvs, `${msg}: family[${i}] mesh[${j}] uvs null-ness`);
        continue;
      }
      assert.equal(a[i][j].uvs.length, b[i][j].uvs.length, `${msg}: family[${i}] mesh[${j}] uvs length`);
      for (let k = 0; k < a[i][j].uvs.length; k += 1) {
        approx(a[i][j].uvs[k], b[i][j].uvs[k], tol, `${msg}: family[${i}] mesh[${j}] uvs[${k}]`);
      }
    }
  }
}
function assertResultsConsistent(syncRes, asyncRes, msg) {
  assert.strictEqual(asyncRes.k, syncRes.k, `${msg}: k（期望逐位一致）`);
  assert.strictEqual(asyncRes.fillUsed, syncRes.fillUsed, `${msg}: fillUsed`);
  assert.strictEqual(asyncRes.totalArea, syncRes.totalArea, `${msg}: totalArea`);
  assert.equal(asyncRes.gap, syncRes.gap, `${msg}: gap`);
  assert.equal(asyncRes.packed.length, syncRes.packed.length, `${msg}: packed length`);
  for (let i = 0; i < syncRes.packed.length; i += 1) {
    const s = syncRes.packed[i];
    const a = asyncRes.packed[i];
    assert.equal(a.id, s.id, `${msg}: packed[${i}].id`);
    assert.equal(a.island, s.island, `${msg}: packed[${i}].island`);
    approx(a.x, s.x, 1e-9, `${msg}: packed[${i}].x`);
    approx(a.y, s.y, 1e-9, `${msg}: packed[${i}].y`);
    approx(a.width, s.width, 1e-9, `${msg}: packed[${i}].width`);
    approx(a.height, s.height, 1e-9, `${msg}: packed[${i}].height`);
  }
}

// ---- 用例 ----
test("与同步 packFamilies 逐位一致（23 岛 reference 输入）", async () => {
  const families = makeFamilies(23, makeLCG(20260817));
  // 重建 fixtures/uv-pack-reference.json 同款输入：同步结果必须命中 reference
  const ref = JSON.parse(readFileSync(new URL("./fixtures/uv-pack-reference.json", import.meta.url), "utf8"));
  const syncClone = structuredClone(families);
  const syncRes = packFamilies(syncClone, { fill: 0.8 });
  assert.strictEqual(syncRes.k, ref.k, "同步结果应命中 reference k（验证 makeFamilies 复刻）");
  assert.strictEqual(syncRes.fillUsed, ref.fillUsed, "同步结果应命中 reference fillUsed");

  const packer = createPackAsync({ createWorker: nodeCreateWorker, workers: 4 });
  const asyncClone = structuredClone(families);
  const asyncRes = await packer.packFamiliesAsync(asyncClone, { fill: 0.8 });
  await packer.dispose();

  assertResultsConsistent(syncRes, asyncRes, "23 岛");
  assertUvsConsistent(collectUvs(syncClone), collectUvs(asyncClone), 1e-9, "23 岛 uvs");
});

test("worker 池真实使用（64 sample + 8 refine 任务经 worker 往返，非回退）", async () => {
  let createdCount = 0;
  let messageCount = 0;
  const packer = createPackAsync({
    workers: 4,
    createWorker: (url) => {
      createdCount += 1;
      const w = new NodeWorker(url instanceof URL ? url : String(url), { type: "module" });
      return {
        postMessage: (msg) => { messageCount += 1; w.postMessage(msg); },
        on: (ev, fn) => w.on(ev, fn),
        terminate: () => w.terminate()
      };
    }
  });
  const families = makeFamilies(23, makeLCG(20260817));
  const syncRes = packFamilies(structuredClone(families), { fill: 0.8 });
  const res = await packer.packFamiliesAsync(structuredClone(families), { fill: 0.8 });
  await packer.dispose();
  assert.strictEqual(res.k, syncRes.k, "结果与同步一致（且确实经过 worker）");
  assert.equal(createdCount, 4, "应创建 4 个 worker（非回退）");
  assert.ok(messageCount >= 72, `应经 worker 往返 ≥ 72 条消息（64 sample + 8 refine），实际 ${messageCount}`);
});

test("回退：node 默认单例（无 Worker）resolve 同步结果", async () => {
  const families = makeFamilies(23, makeLCG(20260817));
  const syncRes = packFamilies(structuredClone(families), { fill: 0.8 });
  const res = await defaultPackFamiliesAsync(structuredClone(families), { fill: 0.8 });
  assert.deepStrictEqual(res, syncRes, "默认单例在 node 下应逐字段等于同步结果");
});

test("回退：createWorker 抛错（池创建失败）仍 resolve 同步结果", async () => {
  const packer = createPackAsync({ createWorker: () => { throw new Error("no worker"); } });
  const families = makeFamilies(23, makeLCG(20260817));
  const syncClone = structuredClone(families);
  const asyncClone = structuredClone(families);
  const syncRes = packFamilies(syncClone, { fill: 0.8 });
  const res = await packer.packFamiliesAsync(asyncClone, { fill: 0.8 });
  await packer.dispose();
  assert.deepStrictEqual(res, syncRes, "池创建失败应回退同步结果");
  assertUvsConsistent(collectUvs(syncClone), collectUvs(asyncClone), 1e-9, "回退 uvs");
});

for (const n of [50, 100]) {
  test(`多岛 n=${n}：无异常且与同步一致`, async () => {
    const families = makeFamilies(n, makeLCG(20260817));
    const packer = createPackAsync({ createWorker: nodeCreateWorker, workers: 4 });
    const syncClone = structuredClone(families);
    const asyncClone = structuredClone(families);
    const syncRes = packFamilies(syncClone, { fill: 0.8 });
    const asyncRes = await packer.packFamiliesAsync(asyncClone, { fill: 0.8 });
    await packer.dispose();
    assertResultsConsistent(syncRes, asyncRes, `n=${n}`);
    assertUvsConsistent(collectUvs(syncClone), collectUvs(asyncClone), 1e-9, `n=${n} uvs`);
  });
}

test("dispose 后再调不崩（池懒重建）", async () => {
  const packer = createPackAsync({ createWorker: nodeCreateWorker, workers: 2 });
  const families = makeFamilies(23, makeLCG(20260817));
  const syncRes = packFamilies(structuredClone(families), { fill: 0.8 });
  const first = await packer.packFamiliesAsync(structuredClone(families), { fill: 0.8 });
  assert.strictEqual(first.k, syncRes.k, "首次调用 k");
  await packer.dispose();
  const second = await packer.packFamiliesAsync(structuredClone(families), { fill: 0.8 });
  assert.strictEqual(second.k, syncRes.k, "dispose 后重建池的 k");
  await packer.dispose();
});

test("守卫：无有效 family → 空结果且不动 uvs", async () => {
  const packer = createPackAsync({ createWorker: nodeCreateWorker, workers: 2 });
  const families = [{ id: "x", meshes: [rectQuad(1, 1)], length: 0, width: 1 }];
  const clone = structuredClone(families);
  const res = await packer.packFamiliesAsync(clone, { fill: 0.8 });
  await packer.dispose();
  assert.deepStrictEqual(res, { k: null, totalArea: 0, fillUsed: 0, packed: [] });
  assert.deepStrictEqual(clone[0].meshes[0].uvs, [0, 0, 1, 0, 1, 1, 0, 1], "uvs 未被修改");
  assert.equal("uvisland" in clone[0].meshes[0], false, "uvisland 未被写入");
});
