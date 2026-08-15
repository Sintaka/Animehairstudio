// tests/uv-pack.test.mjs — 纯 node 测试（不 import three）：
// 验证 modules/io/uv-pack.js 的 packFamilies（面积归一缩放 + alpaca 占位栅格打包 +
// fit-to-tile 整包均匀缩放居中）。运行：node tests/uv-pack.test.mjs

import assert from "node:assert/strict";
import { packFamilies, PACK_GAP, findMaxKAlpaca, ALPACA_RESOLUTION } from "../modules/io/uv-pack.js";

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
// 单位缩放 uScale=1、vScale=2 → bbox 1×2；kMax=sqrt(1/1)=1，但高 2 > 1，alpaca 栅格量化
// （ceil(2k/cell)*cell ≤ 1）把 k 降到 ≈0.5（最大无兜底 k）。uScale=kFinal*width、vScale=kFinal*length。
// 单岛打包后 fit-to-tile：整包 bbox = 该岛 bbox（spanU=k、spanV=2k，较长轴 V 填满 [0,1]）
{
  const mesh = quad1x1();
  const result = packFamilies(
    [{ id: "s", meshes: [mesh], length: 2, width: 1 }],
    { fill: 1 }
  );
  const k = result.k;
  assert.ok(Number.isFinite(k) && k > 0 && k < 1, `自适应 k ∈ (0,1) (got ${k})`);
  assert.ok(k * 2 <= 1 + EPS, `高度 2k 放得下 (alpaca 栅格量化后 2k≈0.998, got ${k * 2})`);
  assert.equal(result.packed.length, 1, "one packed entry");
  const entry = result.packed[0];
  // fit 是均匀缩放（相似变换）：宽高比 1:2 保持；较长轴（v，span=2k）填满 [0,1] → height=1
  assert.ok(Math.abs(entry.height - 2 * entry.width) < EPS, `宽高比 1:2 (w=${entry.width}, h=${entry.height})`);
  assert.ok(Math.abs(entry.height - 1) < 1e-6, `较长轴填满 (h=${entry.height})`);
  assert.ok(Math.abs(entry.x + entry.width / 2 - 0.5) < 1e-6, `U 居中 (${entry.x + entry.width / 2})`);
  assert.ok(Math.abs(entry.y + entry.height / 2 - 0.5) < 1e-6, `V 居中 (${entry.y + entry.height / 2})`);
  // uv 范围 = packed entry bbox（fit 后 uv 与 entry 同步变换）
  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (let i = 0; i + 1 < mesh.uvs.length; i += 2) {
    minU = Math.min(minU, mesh.uvs[i]);
    maxU = Math.max(maxU, mesh.uvs[i]);
    minV = Math.min(minV, mesh.uvs[i + 1]);
    maxV = Math.max(maxV, mesh.uvs[i + 1]);
  }
  assert.ok(Math.abs(minU - entry.x) < EPS && Math.abs(minV - entry.y) < EPS, "uv bbox 与 packed 对齐");
  assert.ok(Math.abs((maxU - minU) - entry.width) < EPS, "uv u 跨度 = packed width");
  assert.ok(Math.abs((maxV - minV) - entry.height) < EPS, "uv v 跨度 = packed height");
  assert.ok(Math.abs(result.fillUsed - k * k) < EPS, `fillUsed = k² (got ${result.fillUsed})`);
  assert.ok(result.fillUsed <= 1 + EPS, "fillUsed <= fill");
}

// ---- 2b) panel 推导宽度：1×2 世界矩形（面积 2、长度 2）、width 不传 → width = area/length = 1 ----
// 推导 width = area/length = 1 → 单位 bbox 1×2（与显式 width=1 同尺度）→ 与用例 2 相同
// 的 fit-to-tile 结果（较长轴 V 填满、居中、宽高比 1:2）
{
  const mesh = rect1x2();
  const result = packFamilies(
    [{ id: "p", meshes: [mesh], length: 2, width: undefined }],
    { fill: 1 }
  );
  const k = result.k;
  assert.ok(Number.isFinite(k) && k > 0, `panel 自适应 k > 0 (got ${k})`);
  assert.equal(mesh.uvisland, 0, "panel mesh.uvisland = 0");
  const entry = result.packed[0];
  assert.ok(Math.abs(entry.height - 2 * entry.width) < EPS, `panel 宽高比 1:2 (w=${entry.width}, h=${entry.height})`);
  assert.ok(Math.abs(entry.height - 1) < 1e-6, `panel 较长轴填满 (h=${entry.height})`);
  assert.ok(Math.abs(entry.x + entry.width / 2 - 0.5) < 1e-6, "panel U 居中");
  assert.ok(Math.abs(entry.y + entry.height / 2 - 0.5) < 1e-6, "panel V 居中");
}

// ---- 3) 布局：只平移/不重叠/在 [0,1] 内（3 个 1×1 quad，fill=0.2 → 项较小可全放一行）----
// alpaca 栅格（128）下 kMax = sqrt(0.2/3) 本身放得下（3 格 × 34 = 102 ≤ 128）→
// kFinal = kMax*0.999999（只比 kMax 小 ~1e-6；fit-to-tile 只整体等比缩放 + 居中，不改 k）
{
  const families = ["p1", "p2", "p3"].map((id) => ({
    id,
    meshes: [quad1x1()],
    length: 1,
    width: 1
  }));
  const result = packFamilies(families, { fill: 0.2 });
  const kMax = Math.sqrt(0.2 / 3);
  assert.ok(Math.abs(result.k - kMax) / kMax < 1e-3, `k ≈ sqrt(0.2/3) (got ${result.k})`);
  assert.equal(result.packed.length, 3, "three packed entries");

  // (a) fit 是均匀缩放（相似变换）：3 个 1×1 quad 的 entry 仍是正方形（宽高相等）且不缩小
  // （s = min(1/spanU, 1/spanV) >= 1）
  for (const entry of result.packed) {
    assert.ok(entry.width > 0 && Math.abs(entry.width - entry.height) < EPS,
      `${entry.id} 正方形保持 (w=${entry.width}, h=${entry.height})`);
    assert.ok(entry.width >= result.k - EPS,
      `${entry.id} fit 不缩小 (w=${entry.width} >= k=${result.k})`);
  }

  // (b) 两两 bbox 不重叠：x 或 y 方向间距 ≥ gap（fit 等比放大间距，仍 >= PACK_GAP）
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
  // （alpaca 排序后放置顺序 ≠ island 输入顺序，故按 id 找 entry，不依赖 packed 序号）
  const islands = result.packed.map((entry) => entry.island).sort((a, b) => a - b);
  assert.deepEqual(islands, [0, 1, 2], "island 编号 0/1/2 各一次");
  for (const family of families) {
    const entry = result.packed.find((e) => e.id === family.id);
    assert.ok(entry, `${family.id} 在 packed 中`);
    for (const mesh of family.meshes) {
      assert.equal(mesh.uvisland, entry.island, `${family.id} mesh.uvisland = ${entry.island}`);
    }
  }

  // (e) fillUsed ≤ fill（kFinal ≤ kMax = sqrt(fill/totalArea)；fit 不改 k）
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
  // （good 用面积=1 的非正方形 0.5×2 矩形：fit 后 uv 不会巧合还原成 [0,1]²，可验证确被处理）
  const zeroLen = quad1x1();
  const good = rectQuad(0.5, 2);
  const zeroLenBefore = zeroLen.uvs.slice();
  const res2 = packFamilies([
    { id: "z", meshes: [zeroLen], length: 0, width: 1 },
    { id: "g", meshes: [good], length: 2, width: 0.5 }
  ], { fill: 1 });
  assert.notEqual(res2.k, null, "跳过: k 正常计算");
  assert.deepEqual(zeroLen.uvs, zeroLenBefore, "跳过: length=0 的 family 原样不动");
  assert.notDeepEqual(good.uvs, [0, 0, 1, 0, 1, 1, 0, 1], "跳过: 其它 family 仍被缩放+平移");
  assert.ok(Math.abs(res2.totalArea - 1) < EPS, "跳过: totalArea 只含有效 family (1)");
  assert.equal(zeroLen.uvisland, undefined, "跳过: length=0 的 family 无 uvisland");
  assert.equal(good.uvisland, 0, "跳过: 有效 family island = 0（跳过项不占编号）");
}

// ---- 5) 压力回归：固定种子 LCG 随机矩形，自适应填充无兜底、不重叠、fillUsed ≤ fill ----
// alpaca 二分在 PACK_FILL 上限内找最大无兜底 k → 40 个随机混合宽高比矩形（含 ~15:1
// 极端长条）在 fill=0.9 下也全部放得下（实测 fillUsed≈0.845，占位栅格分辨率 256 浪费较少）。
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

  // 无兜底：自适应二分保证 alpacaPack 无 overflow → 全部落在 [0,1] 内
  for (const entry of result.packed) {
    assert.ok(entry.x >= -EPS && entry.y >= -EPS
      && entry.x + entry.width <= 1 + EPS && entry.y + entry.height <= 1 + EPS,
      `${entry.id} 在 [0,1] 内 (x=${entry.x}, y=${entry.y}, w=${entry.width}, h=${entry.height})`);
  }

  // 两两 bbox 不相交：x 或 y 方向间距 ≥ gap（fit 等比放大间距，仍 >= PACK_GAP）
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

  // fillUsed 不超过 fill，且确实尽量铺满（alpaca Smart 择优填充率接近 fill，sanity 卡 > 0.65）
  assert.ok(result.fillUsed <= 0.9 + 1e-9, `fillUsed <= 0.9 (got ${result.fillUsed})`);
  assert.ok(result.fillUsed > 0.65, `fillUsed 尽量铺满 (got ${result.fillUsed})`);
}

// ---- 6) alpaca Smart ≥ 单套 sanity：同一组随机矩形，packFamilies（4 套「排序 × 扫描」
// Smart 择优）的 fillUsed 不低于「只 (maxSide, scanline)」单套的结果（复用 findMaxKAlpaca
// 对同单位尺度 boxUnit 求单套 k；fit-to-tile 不改 k/fillUsed，只整包等比缩放居中）----
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
  const singleK = findMaxKAlpaca(boxUnit, totalArea, 0.9, PACK_GAP, ALPACA_RESOLUTION, "maxSide", "scanline");
  const singleFill = singleK * singleK * totalArea;
  assert.ok(result.fillUsed >= singleFill - 1e-6,
    `alpaca Smart fillUsed ${result.fillUsed} >= 单套 (maxSide,scanline) fillUsed ${singleFill}`);
}

// ---- 7) fit-to-tile：打包后整包均匀缩放 + 居中，较长轴填满 [0,1] ----
// 混合宽高比矩形（含 0.045×0.56 高瘦条 / 0.56×0.045 宽扁条），验证 fit 后：
// ① 全部 uv 在 [0,1] 内；② 整包 bbox 较长轴 ≈ 1；③ 整包 bbox 居中 ≈ 0.5；
// ④ 岛间两两不重叠（间距 ≥ PACK_GAP，fit 后 bbox 已缩放，用缩放后的 entry 宽高算）
{
  const sizes = [
    [0.3, 0.2], [0.2, 0.3], [0.25, 0.25], [0.15, 0.35], [0.35, 0.15],
    [0.045, 0.56], [0.56, 0.045], [0.1, 0.4], [0.4, 0.1], [0.18, 0.22], [0.22, 0.18]
  ];
  const families = sizes.map(([w, h], i) => ({
    id: `f${i}`,
    meshes: [rectQuad(w, h)],
    length: h,
    width: w
  }));
  const result = packFamilies(families, { fill: 0.8 });
  assert.equal(result.packed.length, sizes.length, "packed 数量");
  assert.equal(result.gap, PACK_GAP, "gap 恒为传入 PACK_GAP");

  // ① 全部 uv 仍在 [0,1] 内（fit 后较长轴恰填满边界）
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

  // ② 整包 bbox 较长轴填满 ≈ 1；③ 整包 bbox 居中 ≈ 0.5（用 fit 后的 entry 宽高）
  let bMinU = Infinity, bMinV = Infinity, bMaxU = -Infinity, bMaxV = -Infinity;
  for (const e of result.packed) {
    bMinU = Math.min(bMinU, e.x);
    bMinV = Math.min(bMinV, e.y);
    bMaxU = Math.max(bMaxU, e.x + e.width);
    bMaxV = Math.max(bMaxV, e.y + e.height);
  }
  const spanU = bMaxU - bMinU;
  const spanV = bMaxV - bMinV;
  assert.ok(Math.abs(Math.max(spanU, spanV) - 1) < 1e-6,
    `较长轴填满 (spanU=${spanU}, spanV=${spanV})`);
  assert.ok(Math.abs((bMinU + bMaxU) / 2 - 0.5) < 1e-6, `U 居中 (${(bMinU + bMaxU) / 2})`);
  assert.ok(Math.abs((bMinV + bMaxV) / 2 - 0.5) < 1e-6, `V 居中 (${(bMinV + bMaxV) / 2})`);

  // ④ 岛间两两不重叠：间距 ≥ PACK_GAP（fit 等比放大间距，仍 >= PACK_GAP）
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
}

console.log("uv-pack tests passed");
