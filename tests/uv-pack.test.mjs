// tests/uv-pack.test.mjs — 纯 node 测试（不 import three）：
// 验证 modules/io/uv-pack.js 的 packFamilies（面积归一缩放 + 自适应填充 MaxRects 布局）。
// 运行：node tests/uv-pack.test.mjs

import assert from "node:assert/strict";
import { packFamilies, PACK_GAP, findMaxK, SPREAD_KEEP } from "../modules/io/uv-pack.js";

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
// spread 默认开启：3 岛走 spread 增 gap（gap 可涨到 SPREAD_GAP_MAX），k 由 gapFinal 重算；
// 断言间距 >= 实际 gap（= result.gap）、所有 uv 在 [0,1] 内、fillUsed ≤ fill
{
  const families = ["p1", "p2", "p3"].map((id) => ({
    id,
    meshes: [quad1x1()],
    length: 1,
    width: 1
  }));
  const result = packFamilies(families, { fill: 0.2 });
  assert.ok(Number.isFinite(result.k) && result.k > 0, `spread 后 k > 0 (got ${result.k})`);
  assert.ok(result.gap >= PACK_GAP, `spread gap >= PACK_GAP (got ${result.gap})`);
  assert.equal(result.packed.length, 3, "three packed entries");

  // (a) 平移不变：packed 宽高 = 缩放后包围盒（u/v 范围只缩放不平移、不旋转），用 kFinal
  for (const entry of result.packed) {
    assert.ok(Math.abs(entry.width - result.k) < EPS, `${entry.id} width = kFinal*1 (got ${entry.width})`);
    assert.ok(Math.abs(entry.height - result.k) < EPS, `${entry.id} height = kFinal*1 (got ${entry.height})`);
  }

  // (b) 两两 bbox 不重叠：x 或 y 方向间距 ≥ 实际 gap（= result.gap，spread 后 > PACK_GAP）
  for (let i = 0; i < result.packed.length; i += 1) {
    for (let j = i + 1; j < result.packed.length; j += 1) {
      const a = result.packed[i];
      const b = result.packed[j];
      const sepX = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
      const sepY = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height));
      assert.ok(Math.max(sepX, sepY) >= result.gap - EPS,
        `${a.id}/${b.id} 间距 >= gapFinal (sepX=${sepX}, sepY=${sepY})`);
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

  // (e) fillUsed ≤ fill（kFinal ≤ kMax = sqrt(fill/totalArea)）
  assert.ok(result.fillUsed <= 0.2 + EPS, `fillUsed <= fill (got ${result.fillUsed})`);
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

  // 两两 bbox 不相交：x 或 y 方向间距 ≥ 实际 gap（= result.gap，spread 后 > PACK_GAP）
  for (let i = 0; i < result.packed.length; i += 1) {
    for (let j = i + 1; j < result.packed.length; j += 1) {
      const a = result.packed[i];
      const b = result.packed[j];
      const sepX = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
      const sepY = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height));
      assert.ok(Math.max(sepX, sepY) >= result.gap - EPS,
        `${a.id}/${b.id} 间距 >= gapFinal (sepX=${sepX}, sepY=${sepY})`);
    }
  }

  // fillUsed 不超过 fill；spread 会把 k 降到 ≥ best.k*SPREAD_KEEP（fill ≈ bestFill*SPREAD_KEEP²
  // ≈ 0.81*0.9），不再要求铺满 0.65，只卡「确实有大量岛放进去」的下限
  assert.ok(result.fillUsed <= 0.9 + 1e-9, `fillUsed <= 0.9 (got ${result.fillUsed})`);
  assert.ok(result.fillUsed > 0.5, `fillUsed 不至于过小 (got ${result.fillUsed})`);
}

// ---- 6) Smart ≥ 单 CP sanity：同一组随机矩形，packFamilies（Smart 多策略择优）的 fillUsed
// 不低于「只 CP + maxSide」策略结果的 SPREAD_KEEP² 倍（复用 findMaxK 对同单位尺度 boxUnit
// 求单策略 k；singleFill 未 spread，result 是 spread 后的）----
{
  const COUNT = 40;
  let seed = 98765;
  const next = () => { // LCG：seed = (seed*1103515245+12345) % 2147483648，返回 [0,1)
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const families = [];
  const boxUnit = [];
  let totalArea = 0;
  for (let i = 0; i < COUNT; i += 1) {
    const w = 0.02 + next() * 0.48; // 0.02 ~ 0.5（与压力回归同分布）
    const h = 0.02 + next() * 0.48;
    families.push({ id: `s${i}`, meshes: [rectQuad(w, h)], length: h, width: w });
    boxUnit.push({ id: `s${i}`, island: i, width: w, height: h }); // 单位尺度 bbox = w×h
    totalArea += w * h;
  }
  const result = packFamilies(families, { fill: 0.9 });
  const singleK = findMaxK(boxUnit, totalArea, 0.9, PACK_GAP, "contactPoint", "maxSide");
  const singleFill = singleK * singleK * totalArea;
  // result 是 spread 后的（gap 增大、k 降到 ≥ best.k*SPREAD_KEEP）：fill 不低于单策略的
  // SPREAD_KEEP² 倍。步骤 6 兜底缩 k 重试（贪心失败带）可能让最终 k 略低于 kFloor，
  // findMaxK 也有采样粒度，故在 SPREAD_KEEP² 上留 2% 松弛（实测多种子 ratio ∈ [0.807, 0.830]）
  assert.ok(result.fillUsed >= singleFill * SPREAD_KEEP * SPREAD_KEEP * 0.98 - 1e-6,
    `Smart spread fillUsed ${result.fillUsed} >= 单 CP+maxSide fillUsed*SPREAD_KEEP²*0.98 ${singleFill * SPREAD_KEEP * SPREAD_KEEP * 0.98}`);
}

// ---- 7) spread：Spread Islands to All Available Space ----
// 多岛时 spread=true 增大岛间 gap（把右上角空档均摊成间隙），spread=false 保持 PACK_GAP；
// 单岛时 spread 走回退，gap 不变。各用独立 mesh 副本避免原地修改串扰。
{
  // (a) 多岛散布性：6 个混合宽高比矩形，spread=false 与 spread=true 各跑一次
  const sizes = [[0.3, 0.2], [0.2, 0.3], [0.25, 0.25], [0.15, 0.35], [0.35, 0.15], [0.2, 0.2]];
  const makeFams = () => sizes.map(([w, h], i) => ({
    id: `sp${i}`,
    meshes: [rectQuad(w, h)],
    length: h,
    width: w
  }));
  const tight = packFamilies(makeFams(), { fill: 0.5, spread: false });
  const spreadRes = packFamilies(makeFams(), { fill: 0.5, spread: true });
  assert.equal(tight.gap, PACK_GAP, "spread=false 保持 PACK_GAP");
  assert.ok(spreadRes.gap >= PACK_GAP, `spread=true gap >= PACK_GAP (got ${spreadRes.gap})`);
  assert.ok(spreadRes.gap > tight.gap, `spread 后 gap 严格增大 (${spreadRes.gap} > ${tight.gap})`);

  // 覆盖不弱于紧排：packed 并集包围盒面积（覆盖的 tile 面积）不缩小。注意单轴跨度可能因
  // 重分布变小（紧排的窄簇被摊平成更均衡的布局），故按面积比较；spec 亦允许以 gap 增大
  // 作为散布性判据
  const unionSpan = (res) => {
    let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity;
    for (const e of res.packed) {
      minU = Math.min(minU, e.x);
      minV = Math.min(minV, e.y);
      maxU = Math.max(maxU, e.x + e.width);
      maxV = Math.max(maxV, e.y + e.height);
    }
    return { su: maxU - minU, sv: maxV - minV };
  };
  const sT = unionSpan(tight);
  const sS = unionSpan(spreadRes);
  assert.ok(sS.su * sS.sv >= sT.su * sT.sv - 1e-6,
    `spread 覆盖面积不弱于紧排 (${(sS.su * sS.sv).toFixed(4)} vs ${(sT.su * sT.sv).toFixed(4)})`);

  // 两个结果都满足基本保证：数量一致、全在 [0,1] 内、间距 >= 各自 gap
  assert.equal(tight.packed.length, sizes.length, "紧排 packed 数量");
  assert.equal(spreadRes.packed.length, sizes.length, "spread packed 数量");
  for (const res of [tight, spreadRes]) {
    for (const e of res.packed) {
      assert.ok(e.x >= -EPS && e.y >= -EPS && e.x + e.width <= 1 + EPS && e.y + e.height <= 1 + EPS,
        `${e.id} 在 [0,1] 内 (x=${e.x}, y=${e.y}, w=${e.width}, h=${e.height})`);
    }
    for (let i = 0; i < res.packed.length; i += 1) {
      for (let j = i + 1; j < res.packed.length; j += 1) {
        const a = res.packed[i];
        const b = res.packed[j];
        const sepX = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
        const sepY = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height));
        assert.ok(Math.max(sepX, sepY) >= res.gap - EPS,
          `${a.id}/${b.id} 间距 >= 各自 gap (sepX=${sepX}, sepY=${sepY})`);
      }
    }
  }

  // (b) 单岛不 spread：单 family 走回退，gap === PACK_GAP（不增 gap）
  const single = packFamilies(
    [{ id: "one", meshes: [rectQuad(0.4, 0.3)], length: 0.3, width: 0.4 }],
    { fill: 0.5, spread: true }
  );
  assert.equal(single.gap, PACK_GAP, "单岛 spread 走回退，gap === PACK_GAP");
}

console.log("uv-pack tests passed");
