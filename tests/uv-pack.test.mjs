// tests/uv-pack.test.mjs — 纯 node 测试（不 import three）：
// 验证 modules/io/uv-pack.js 的 packFamilies（面积归一缩放 + 自适应填充 MaxRects 布局）。
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

// w×h 世界矩形（3D 表面积 = w*h），UV 已归一化 0-1
function rectQuad(w, h) {
  return makeMesh(
    [0, 0, 0, w, 0, 0, w, 0, h, 0, 0, h],
    [0, 0, 1, 0, 1, 1, 0, 1],
    [[0, 1, 2, 3]]
  );
}

// ---- 1) 面积：1×1 quad（1）+ 1×2 矩形（2）→ totalArea=3；fillUsed = k²*totalArea ≤ fill ----
// k 现在是自适应值（最大无兜底 k），不直接等于 sqrt(fill/totalArea)，只断言 totalArea/fillUsed
{
  const result = packFamilies([
    { id: "a", meshes: [quad1x1()], length: 2, width: 1 },
    { id: "b", meshes: [rect1x2()], length: 2, width: 1 }
  ], { fill: 1 });
  assert.ok(Math.abs(result.totalArea - 3) < EPS, `totalArea = 3 (got ${result.totalArea})`);
  assert.ok(Number.isFinite(result.k) && result.k > 0, `自适应 k > 0 (got ${result.k})`);
  assert.ok(Math.abs(result.fillUsed - result.k * result.k * 3) < EPS, "fillUsed = k²*totalArea");
  assert.ok(result.fillUsed <= 1 + EPS, `fillUsed <= fill (got ${result.fillUsed})`);
  assert.equal(result.packed.length, 2, "two packed entries");
}

// ---- 2) 缩放：length=2、width=1、fill=1 单 1×1 quad（面积 1）→ 自适应 k ----
// 单位缩放 uScale=1、vScale=2 → bbox 1×2；kMax=sqrt(1/1)=1，但高 2 > 1-2gap，二分把 k 降到
// ≈(1-3gap)/2≈0.5（最大无兜底 k）。uScale=kFinal*width、vScale=kFinal*length
{
  const mesh = quad1x1();
  const result = packFamilies(
    [{ id: "s", meshes: [mesh], length: 2, width: 1 }],
    { fill: 1 }
  );
  const k = result.k;
  assert.ok(Number.isFinite(k) && k > 0 && k < 1, `自适应 k ∈ (0,1) (got ${k})`);
  assert.ok(k * 2 + PACK_GAP <= 1 - 2 * PACK_GAP + EPS, `高度 2k+gap 放得下 (got ${k * 2 + PACK_GAP})`);
  // uvs 平铺 [(0,0),(1,0),(1,1),(0,1)] → 单位缩放 (1,2) → [(0,0),(1,0),(1,2),(0,2)]
  // → 缩放 k → [(0,0),(k,0),(k,2k),(0,2k)] → 平移 (gap,gap)
  assert.ok(Math.abs(mesh.uvs[0] - PACK_GAP) < EPS, `uv0.u = gap (got ${mesh.uvs[0]})`);
  assert.ok(Math.abs(mesh.uvs[1] - PACK_GAP) < EPS, `uv0.v = gap (got ${mesh.uvs[1]})`);
  assert.ok(Math.abs(mesh.uvs[4] - (k + PACK_GAP)) < EPS, `uv2.u = k*uScale + gap (got ${mesh.uvs[4]})`);
  assert.ok(Math.abs(mesh.uvs[5] - (2 * k + PACK_GAP)) < EPS, `uv2.v = 2k*vScale + gap (got ${mesh.uvs[5]})`);
  assert.equal(result.packed.length, 1, "one packed entry");
  assert.ok(Math.abs(result.packed[0].width - k) < EPS, "packed width = k (缩放后不旋转)");
  assert.ok(Math.abs(result.packed[0].height - 2 * k) < EPS, "packed height = 2k");
  assert.ok(Math.abs(result.fillUsed - k * k) < EPS, `fillUsed = k² (got ${result.fillUsed})`);
  assert.ok(result.fillUsed <= 1 + EPS, "fillUsed <= fill");
}

// ---- 2b) panel 推导宽度：1×2 世界矩形（面积 2、长度 2）、width 不传 → width = area/length = 1 ----
{
  const mesh = rect1x2();
  const result = packFamilies(
    [{ id: "p", meshes: [mesh], length: 2, width: undefined }],
    { fill: 1 }
  );
  const k = result.k;
  assert.ok(Number.isFinite(k) && k > 0, `panel 自适应 k > 0 (got ${k})`);
  // 推导 width = area/length = 1 → 单位 bbox 1×2（与显式 width=1 同尺度）：
  // uScale = k*1、vScale = k*2；uvs [(0,0),(1,0),(1,1),(0,1)] → [(0,0),(k,0),(k,2k),(0,2k)] → 平移 (gap,gap)
  assert.ok(Math.abs(mesh.uvs[0] - PACK_GAP) < EPS, `panel uv0.u = gap (got ${mesh.uvs[0]})`);
  assert.ok(Math.abs(mesh.uvs[1] - PACK_GAP) < EPS, `panel uv0.v = gap (got ${mesh.uvs[1]})`);
  assert.ok(Math.abs(mesh.uvs[4] - (k + PACK_GAP)) < EPS, `panel uv2.u = k*uScale + gap (got ${mesh.uvs[4]})`);
  assert.ok(Math.abs(mesh.uvs[5] - (2 * k + PACK_GAP)) < EPS, `panel uv2.v = 2k*vScale + gap (got ${mesh.uvs[5]})`);
  assert.equal(mesh.uvisland, 0, "panel mesh.uvisland = 0");
  assert.ok(Math.abs(result.packed[0].width - k) < EPS, "panel packed width = k*1 (推导 width=1)");
  assert.ok(Math.abs(result.packed[0].height - 2 * k) < EPS, "panel packed height = k*2");
}

// ---- 3) 布局：只平移/不重叠/在 [0,1] 内（3 个 1×1 quad，fill=0.2 → 项较小可全放一行）----
{
  const families = ["p1", "p2", "p3"].map((id) => ({
    id,
    meshes: [quad1x1()],
    length: 1,
    width: 1
  }));
  const result = packFamilies(families, { fill: 0.2 });
  // 自适应：kMax = sqrt(0.2/3) 本身放得下 → kFinal = kMax*0.999999（只比 kMax 小 ~1e-6）
  const kMax = Math.sqrt(0.2 / 3);
  assert.ok(Math.abs(result.k - kMax) / kMax < 1e-3, `k ≈ sqrt(0.2/3) (got ${result.k})`);
  assert.equal(result.packed.length, 3, "three packed entries");

  // (a) 平移不变：packed 宽高 = 缩放后包围盒（u/v 范围只缩放不平移、不旋转），用 kFinal
  for (const entry of result.packed) {
    assert.ok(Math.abs(entry.width - result.k) < EPS, `${entry.id} width = kFinal*1 (got ${entry.width})`);
    assert.ok(Math.abs(entry.height - result.k) < EPS, `${entry.id} height = kFinal*1 (got ${entry.height})`);
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
  // （MaxRects 排序后放置顺序 ≠ island 输入顺序，故按 id 找 entry，不依赖 packed 序号）
  const islands = result.packed.map((entry) => entry.island).sort((a, b) => a - b);
  assert.deepEqual(islands, [0, 1, 2], "island 编号 0/1/2 各一次");
  for (const family of families) {
    const entry = result.packed.find((e) => e.id === family.id);
    assert.ok(entry, `${family.id} 在 packed 中`);
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
  const guard = packFamilies([{ id: "d", meshes: [degenerate], length: 2, width: 1 }]);
  assert.equal(guard.k, null, "守卫: k 为 null");
  assert.equal(guard.packed.length, 0, "守卫: packed 为空");
  assert.ok(Math.abs(guard.totalArea - 0) < EPS, "守卫: totalArea = 0");
  assert.deepEqual(degenerate.uvs, before, "守卫: uvs 未被修改");

  // length=0 的 family 跳过（uvs 不变），其它 family 仍被打包
  const zeroLen = quad1x1();
  const good = quad1x1();
  const zeroLenBefore = zeroLen.uvs.slice();
  const res2 = packFamilies([
    { id: "z", meshes: [zeroLen], length: 0, width: 1 },
    { id: "g", meshes: [good], length: 1, width: 1 }
  ], { fill: 1 });
  assert.notEqual(res2.k, null, "跳过: k 正常计算");
  assert.deepEqual(zeroLen.uvs, zeroLenBefore, "跳过: length=0 的 family 原样不动");
  assert.notDeepEqual(good.uvs, [0, 0, 1, 0, 1, 1, 0, 1], "跳过: 其它 family 仍被缩放+平移");
  assert.ok(Math.abs(res2.totalArea - 1) < EPS, "跳过: totalArea 只含有效 family (1)");
  assert.equal(zeroLen.uvisland, undefined, "跳过: length=0 的 family 无 uvisland");
  assert.equal(good.uvisland, 0, "跳过: 有效 family island = 0（跳过项不占编号）");
}

// ---- 5) 压力回归：固定种子 LCG 随机矩形，自适应填充无兜底、不重叠、fillUsed ≤ fill ----
// 自适应二分在 PACK_FILL 上限内找最大无兜底 k → 40 个随机混合宽高比矩形（含 ~15:1
// 极端长条）在 fill=0.9 下也全部放得下（固定 k=sqrt(0.9/totalArea) 时该种子会兜底重叠）。
{
  const COUNT = 40;
  let seed = 12345;
  const next = () => { // LCG：seed = (seed*1103515245+12345) % 2147483648，返回 [0,1)
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const families = [];
  for (let i = 0; i < COUNT; i += 1) {
    const w = 0.02 + next() * 0.48; // 0.02 ~ 0.5
    const h = 0.02 + next() * 0.48;
    families.push({ id: `r${i}`, meshes: [rectQuad(w, h)], length: h, width: w });
  }
  const result = packFamilies(families, { fill: 0.9 });
  assert.equal(result.packed.length, COUNT, `packed.length === ${COUNT} (got ${result.packed.length})`);

  // 无兜底：自适应二分保证 maxRectsPack 无 overflow → 全部落在 [0,1] 内
  for (const entry of result.packed) {
    assert.ok(entry.x >= -EPS && entry.y >= -EPS
      && entry.x + entry.width <= 1 + EPS && entry.y + entry.height <= 1 + EPS,
      `${entry.id} 在 [0,1] 内 (x=${entry.x}, y=${entry.y}, w=${entry.width}, h=${entry.height})`);
  }

  // 两两 bbox 不相交：x 或 y 方向间距 ≥ gap
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

  // fillUsed 不超过 fill，且确实尽量铺满（CP 填充显著高于 BSSF，sanity 卡 > 0.6）
  assert.ok(result.fillUsed <= 0.9 + 1e-9, `fillUsed <= 0.9 (got ${result.fillUsed})`);
  assert.ok(result.fillUsed > 0.6, `fillUsed 尽量铺满 (got ${result.fillUsed})`);
}

console.log("uv-pack tests passed");
