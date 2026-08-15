// tests/uv-pack.test.mjs — 纯 node 测试（不 import three）：
// 验证 modules/io/uv-pack.js 的 packFamilies（面积归一缩放 + shelf-pack 布局）。
// 运行：node tests/uv-pack.test.mjs

import assert from "node:assert/strict";
import { packFamilies, PACK_GAP } from "../modules/io/uv-pack.js";

const EPS = 1e-9;

// 假展开 mesh：positions(x,y,z 平铺) + uvs(u,v 平铺) + faces(顶点索引数组)
function makeMesh(positions, uvs, faces) {
  return { positions, uvs, faces };
}

// 1×1 世界 quad（面积 1），UV 已归一化 0-1
function quad1x1() {
  return makeMesh(
    [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 1, 1, 0, 1],
    [[0, 1, 2, 3]]
  );
}

// 1×2 世界矩形（面积 2）
function rect1x2() {
  return makeMesh(
    [0, 0, 0, 2, 0, 0, 2, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 1, 1, 0, 1],
    [[0, 1, 2, 3]]
  );
}

// ---- 1) 面积：1×1 quad（1）+ 1×2 矩形（2）→ totalArea=3，k=sqrt(fill/3) ----
{
  const result = packFamilies([
    { id: "a", meshes: [quad1x1()], length: 2, circumference: 1 },
    { id: "b", meshes: [rect1x2()], length: 2, circumference: 1 }
  ], { fill: 1 });
  assert.ok(Math.abs(result.totalArea - 3) < EPS, `totalArea = 3 (got ${result.totalArea})`);
  assert.ok(Math.abs(result.k - Math.sqrt(1 / 3)) < EPS, `k = sqrt(1/3) (got ${result.k})`);
  assert.equal(result.packed.length, 2, "two packed entries");
}

// ---- 2) 缩放：length=2、circumference=1、fill=1 → k=1（单 1×1 quad 面积 1）----
// uScale = k*1 = 1、vScale = k*2 = 2；采样 uv (1,1) → (1,2)，再平移 (gap,gap)
{
  const mesh = quad1x1();
  const result = packFamilies(
    [{ id: "s", meshes: [mesh], length: 2, circumference: 1 }],
    { fill: 1 }
  );
  assert.ok(Math.abs(result.k - 1) < EPS, "k = 1");
  // uvs 平铺 [(0,0),(1,0),(1,1),(0,1)] → 缩放 [(0,0),(1,0),(1,2),(0,2)] → 平移 (gap,gap)
  assert.ok(Math.abs(mesh.uvs[0] - PACK_GAP) < EPS, `uv0.u = gap (got ${mesh.uvs[0]})`);
  assert.ok(Math.abs(mesh.uvs[1] - PACK_GAP) < EPS, `uv0.v = gap (got ${mesh.uvs[1]})`);
  assert.ok(Math.abs(mesh.uvs[4] - (1 + PACK_GAP)) < EPS, `uv2.u = 1*uScale + gap (got ${mesh.uvs[4]})`);
  assert.ok(Math.abs(mesh.uvs[5] - (2 + PACK_GAP)) < EPS, `uv2.v = 2*vScale + gap (got ${mesh.uvs[5]})`);
  assert.equal(result.packed.length, 1, "one packed entry");
  assert.ok(Math.abs(result.packed[0].width - 1) < EPS, "packed width = 1 (缩放后不旋转)");
  assert.ok(Math.abs(result.packed[0].height - 2) < EPS, "packed height = 2");
}

// ---- 3) 布局：只平移/不重叠/在 [0,1] 内（3 个 1×1 quad，fill=0.2 → 项较小可全放一行）----
{
  const families = ["p1", "p2", "p3"].map((id) => ({
    id,
    meshes: [quad1x1()],
    length: 1,
    circumference: 1
  }));
  const result = packFamilies(families, { fill: 0.2 });
  const k = Math.sqrt(0.2 / 3);
  assert.ok(Math.abs(result.k - k) < EPS, `k = sqrt(0.2/3) (got ${result.k})`);
  assert.equal(result.packed.length, 3, "three packed entries");

  // (a) 平移不变：packed 宽高 = 缩放后包围盒（u/v 范围只缩放不平移、不旋转）
  for (const entry of result.packed) {
    assert.ok(Math.abs(entry.width - k) < EPS, `${entry.id} width = k*1 (got ${entry.width})`);
    assert.ok(Math.abs(entry.height - k) < EPS, `${entry.id} height = k*1 (got ${entry.height})`);
  }

  // (b) 两两 bbox 不重叠：x 或 y 方向间距 ≥ gap
  for (let i = 0; i < result.packed.length; i += 1) {
    for (let j = i + 1; j < result.packed.length; j += 1) {
      const a = result.packed[i];
      const b = result.packed[j];
      const sepX = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
      const sepY = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height));
      assert.ok(Math.max(sepX, sepY) >= PACK_GAP - EPS,
        `${a.id}/${b.id} 间距 >= gap (sepX=${sepX}, sepY=${sepY})`);
    }
  }

  // (c) 所有 uv 在 [0,1] 内
  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (const family of families) {
    for (const mesh of family.meshes) {
      for (let i = 0; i < mesh.uvs.length; i += 2) {
        minU = Math.min(minU, mesh.uvs[i]);
        maxU = Math.max(maxU, mesh.uvs[i]);
        minV = Math.min(minV, mesh.uvs[i + 1]);
        maxV = Math.max(maxV, mesh.uvs[i + 1]);
      }
    }
  }
  assert.ok(minU >= -EPS && maxU <= 1 + EPS && minV >= -EPS && maxV <= 1 + EPS,
    `所有 uv 在 [0,1] 内 (u:${minU}..${maxU}, v:${minV}..${maxV})`);

  // (d) uvisland：packed 每条有 island（0/1/2 各一次）；mesh.uvisland 与对应 island 一致
  const islands = result.packed.map((entry) => entry.island).sort((a, b) => a - b);
  assert.deepEqual(islands, [0, 1, 2], "island 编号 0/1/2 各一次");
  for (const family of families) {
    const entry = result.packed.find((e) => e.id === family.id);
    assert.equal(entry.island, result.packed.indexOf(entry), `${family.id} island 与 packed 序号一致`);
    for (const mesh of family.meshes) {
      assert.equal(mesh.uvisland, entry.island, `${family.id} mesh.uvisland = ${entry.island}`);
    }
  }
}

// ---- 4) 退化守卫 ----
{
  // totalArea=0 → 无操作（k 为 null、uvs 不变）
  const degenerate = makeMesh(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 全部同点 → 面积 0
    [0, 0, 1, 0, 1, 1, 0, 1],
    [[0, 1, 2, 3]]
  );
  const before = degenerate.uvs.slice();
  const guard = packFamilies([{ id: "d", meshes: [degenerate], length: 2, circumference: 1 }]);
  assert.equal(guard.k, null, "守卫: k 为 null");
  assert.equal(guard.packed.length, 0, "守卫: packed 为空");
  assert.ok(Math.abs(guard.totalArea - 0) < EPS, "守卫: totalArea = 0");
  assert.deepEqual(degenerate.uvs, before, "守卫: uvs 未被修改");

  // length=0 的 family 跳过（uvs 不变），其它 family 仍被打包
  const zeroLen = quad1x1();
  const good = quad1x1();
  const zeroLenBefore = zeroLen.uvs.slice();
  const res2 = packFamilies([
    { id: "z", meshes: [zeroLen], length: 0, circumference: 1 },
    { id: "g", meshes: [good], length: 1, circumference: 1 }
  ], { fill: 1 });
  assert.notEqual(res2.k, null, "跳过: k 正常计算");
  assert.deepEqual(zeroLen.uvs, zeroLenBefore, "跳过: length=0 的 family 原样不动");
  assert.notDeepEqual(good.uvs, [0, 0, 1, 0, 1, 1, 0, 1], "跳过: 其它 family 仍被缩放+平移");
  assert.ok(Math.abs(res2.totalArea - 1) < EPS, "跳过: totalArea 只含有效 family (1)");
  assert.equal(zeroLen.uvisland, undefined, "跳过: length=0 的 family 无 uvisland");
  assert.equal(good.uvisland, 0, "跳过: 有效 family island = 0（跳过项不占编号）");
}

console.log("uv-pack tests passed");
