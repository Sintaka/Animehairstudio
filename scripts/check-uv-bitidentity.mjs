// scripts/check-uv-bitidentity.mjs — 重构后 packFamilies 位一致性自检：
// 对 5 组不同 seed/岛数（10/23/50/100）合成输入断言：
//   ① capture 逻辑自洽：fillUsed === k²·totalArea（严格相等）、k>0、fillUsed ≤ fill、
//      packed 数量 = 岛数、全部 uv 在 [0,1]、两两不重叠（间距 ≥ PACK_GAP）；
//   ② 每 order：sampleMaxK(1,128)+refineMaxK === findMaxKAlpaca（严格相等）；
//   ③ 其中 (seed 20260817, n=23) 组与 fixtures/uv-pack-reference.json 逐位一致
//      （k/fillUsed/packed 严格相等，每 family uvs 1e-12 容差内）。
// 运行：node scripts/check-uv-bitidentity.mjs

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  packFamilies, PACK_GAP, findMaxKAlpaca,
  preparePack, sampleMaxK, refineMaxK
} from "../modules/io/uv-pack.js";

const EPS = 1e-9;

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

// 与 scripts/bench-uv-pack.mjs 的 makeFamilies 逐行一致
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
    families.push({
      id: `s${i}`,
      meshes: [rectQuad(width, length)],
      length,
      width
    });
  }
  return families;
}

function assertSelfConsistent(result, families, label) {
  assert.ok(Number.isFinite(result.k) && result.k > 0, `${label}: k > 0 (got ${result.k})`);
  // ① fillUsed === k²·totalArea（同一公式同一运算序 → 严格相等）
  assert.equal(result.fillUsed, result.k * result.k * result.totalArea,
    `${label}: fillUsed === k²·totalArea`);
  assert.ok(result.fillUsed <= 0.8 + 1e-9, `${label}: fillUsed ≤ fill (got ${result.fillUsed})`);
  // packed 数量 = 有效岛数（makeFamilies 全部有效）
  assert.equal(result.packed.length, families.length, `${label}: packed 数量 = 岛数`);
  // 全部 uv 在 [0,1]
  for (const family of families) {
    for (const mesh of family.meshes) {
      for (let i = 0; i + 1 < mesh.uvs.length; i += 2) {
        assert.ok(mesh.uvs[i] >= -EPS && mesh.uvs[i] <= 1 + EPS
          && mesh.uvs[i + 1] >= -EPS && mesh.uvs[i + 1] <= 1 + EPS,
          `${label}: uv 在 [0,1] (${mesh.uvs[i]}, ${mesh.uvs[i + 1]})`);
      }
    }
  }
  // packed 项在 [0,1] 且两两不重叠（间距 ≥ gap）
  for (const entry of result.packed) {
    assert.ok(entry.x >= -EPS && entry.y >= -EPS
      && entry.x + entry.width <= 1 + EPS && entry.y + entry.height <= 1 + EPS,
      `${label}: packed ${entry.id} 在 [0,1]`);
  }
  for (let i = 0; i < result.packed.length; i += 1) {
    for (let j = i + 1; j < result.packed.length; j += 1) {
      const a = result.packed[i];
      const b = result.packed[j];
      const sepX = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
      const sepY = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height));
      assert.ok(Math.max(sepX, sepY) >= PACK_GAP - EPS,
        `${label}: ${a.id}/${b.id} 间距 ≥ gap (sepX=${sepX}, sepY=${sepY})`);
    }
  }
}

// ② 每 order：sampleMaxK+refineMaxK === findMaxKAlpaca
function assertSplitEqualsFull(prepared, label) {
  for (let s = 0; s < prepared.orders.length; s += 1) {
    const viaSplit = refineMaxK(prepared.boxUnit, prepared.totalArea, 0.8, PACK_GAP, 256, prepared.orders[s],
      sampleMaxK(prepared.boxUnit, prepared.totalArea, 0.8, PACK_GAP, 256, prepared.orders[s], 1, 128));
    const viaFull = findMaxKAlpaca(prepared.boxUnit, prepared.totalArea, 0.8, PACK_GAP, 256, "maxSide", prepared.orders[s]);
    assert.equal(viaSplit, viaFull,
      `${label}: seed ${s} sampleMaxK+refineMaxK === findMaxKAlpaca (${viaSplit} vs ${viaFull})`);
  }
  const viaSplit = refineMaxK(prepared.boxUnit, prepared.totalArea, 0.8, PACK_GAP, 256, null,
    sampleMaxK(prepared.boxUnit, prepared.totalArea, 0.8, PACK_GAP, 256, null, 1, 128));
  const viaFull = findMaxKAlpaca(prepared.boxUnit, prepared.totalArea, 0.8, PACK_GAP, 256, "maxSide");
  assert.equal(viaSplit, viaFull, `${label}: 无 order sampleMaxK+refineMaxK === findMaxKAlpaca`);
}

// ③ (20260817, 23) 组与冻结 fixture 逐位一致
async function assertMatchesFixture(result, families) {
  const fixture = JSON.parse(
    await readFile(new URL("../tests/fixtures/uv-pack-reference.json", import.meta.url), "utf8")
  );
  assert.equal(result.k, fixture.k, `fixture: k 逐位一致 (got ${result.k})`);
  assert.equal(result.totalArea, fixture.totalArea, "fixture: totalArea 逐位一致");
  assert.equal(result.fillUsed, fixture.fillUsed, "fixture: fillUsed 逐位一致");
  assert.equal(result.packed.length, fixture.packed.length, "fixture: packed 数量一致");
  for (const ref of fixture.packed) {
    const entry = result.packed.find((e) => e.id === ref.id);
    assert.ok(entry, `fixture: ${ref.id} 在 packed 中`);
    assert.equal(entry.island, ref.island, `fixture: ${ref.id} island`);
    assert.equal(entry.x, ref.x, `fixture: ${ref.id} x`);
    assert.equal(entry.y, ref.y, `fixture: ${ref.id} y`);
    assert.equal(entry.width, ref.width, `fixture: ${ref.id} width`);
    assert.equal(entry.height, ref.height, `fixture: ${ref.id} height`);
  }
  for (const ref of fixture.uvs) {
    const family = families.find((f) => f.id === ref.id);
    const uvs = family.meshes[0].uvs;
    assert.equal(uvs.length, ref.uvs.length, `fixture: ${ref.id} uvs 长度`);
    for (let i = 0; i < uvs.length; i += 1) {
      assert.ok(Math.abs(uvs[i] - ref.uvs[i]) <= 1e-12,
        `fixture: ${ref.id} uvs[${i}] (got ${uvs[i]}, ref ${ref.uvs[i]})`);
    }
  }
}

const groups = [
  { seed: 20260817, n: 10 },
  { seed: 20260817, n: 23 }, // 与 fixture 逐位一致
  { seed: 20260817, n: 50 },
  { seed: 20260817, n: 100 },
  { seed: 7, n: 23 }          // 不同 seed
];

for (const { seed, n } of groups) {
  const families = makeFamilies(n, makeLCG(seed));
  const label = `seed=${seed}, n=${n}`;
  const result = packFamilies(families, { fill: 0.8 });
  assertSelfConsistent(result, families, label);
  // ② 用独立 fresh 输入做 prepare（不重复使用已打包的 families）
  const fresh = makeFamilies(n, makeLCG(seed));
  assertSplitEqualsFull(preparePack(fresh, { fill: 0.8 }), label);
  console.log(`  ✓ ${label}: k=${result.k}, fillUsed=${result.fillUsed.toFixed(4)}, packed=${result.packed.length}`);
  if (seed === 20260817 && n === 23) {
    await assertMatchesFixture(result, families);
    console.log(`  ✓ ${label}: 与 fixtures/uv-pack-reference.json 逐位一致`);
  }
}

console.log("check-uv-bitidentity passed");
