// scripts/diff-occupancy.mjs — 差分验证：行区间表占位（重构后）与旧「Uint8Array 栅格 + 积分图」
// 占位逐格等价。两部分：
//   A) 直接对行区间表工具（rowOverlaps / insertRowInterval，模块内内联复制）做随机 mark/query
//      与朴素 bool 栅格对照；
//   B) 导出 alpacaPackOccupancy（重构后行区间表版）与内联旧栅格+积分图版对同一组 items/order
//      跑完整 L 形打包，断言 placements/overflow/extent 逐位相等。
// 运行：node scripts/diff-occupancy.mjs

import assert from "node:assert/strict";
import { alpacaPackOccupancy } from "../modules/io/uv-pack.js";

// ---- 行区间表工具（与 modules/io/uv-pack.js 内实现逐行复制，作被检对象）----
function makeRows(resolution) {
  const rows = new Array(resolution);
  for (let r = 0; r < resolution; r += 1) rows[r] = [];
  return rows;
}
function rowOverlaps(row, cx, cw) {
  const limit = cx + cw;
  let lo = 0;
  let hi = row.length >> 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (row[mid << 1] < limit) lo = mid + 1;
    else hi = mid;
  }
  return lo > 0 && row[(lo << 1) - 1] > cx;
}
function insertRowInterval(row, s, e) {
  let lo = 0;
  let hi = row.length >> 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (row[mid << 1] < s) lo = mid + 1;
    else hi = mid;
  }
  let from = lo;
  if (from > 0 && row[(from << 1) - 1] >= s) {
    from -= 1;
    s = row[from << 1];
    if (row[(from << 1) + 1] > e) e = row[(from << 1) + 1];
  }
  let count = 0;
  let idx = from << 1;
  const n = row.length >> 1;
  while (from + count < n && row[idx] <= e) {
    if (row[idx + 1] > e) e = row[idx + 1];
    count += 1;
    idx += 2;
  }
  row.splice(from << 1, count << 1, s, e);
}

// 朴素参考：Uint8Array 栅格（与旧实现一致）
function naiveRows(resolution) {
  return new Uint8Array(resolution * resolution);
}
function naiveRegionEmpty(grid, resolution, cx, cy, cw, ch) {
  for (let y = cy; y < cy + ch; y += 1) {
    const gy = y * resolution;
    for (let x = cx; x < cx + cw; x += 1) {
      if (grid[gy + x]) return false;
    }
  }
  return true;
}
function naiveMark(grid, resolution, cx, cy, cw, ch) {
  for (let y = cy; y < cy + ch; y += 1) grid.fill(1, y * resolution + cx, y * resolution + cx + cw);
}

// ---- A) 工具级随机对照：随机 mark 随机矩形 + 随机 query，行区间表 ≡ 朴素栅格 ----
{
  const R = 64;
  let seed = 20260817;
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const rows = makeRows(R);
  const grid = naiveRows(R);
  const randRect = () => {
    const cx = Math.floor(next() * R);
    const cy = Math.floor(next() * R);
    const cw = 1 + Math.floor(next() * (R - cx - 1));
    const ch = 1 + Math.floor(next() * (R - cy - 1));
    return [cx, cy, cw, ch];
  };
  let ops = 0;
  for (let it = 0; it < 20000; it += 1) {
    if (next() < 0.5) {
      const [cx, cy, cw, ch] = randRect();
      for (let y = cy; y < cy + ch; y += 1) insertRowInterval(rows[y], cx, cx + cw);
      naiveMark(grid, R, cx, cy, cw, ch);
    } else {
      const [cx, cy, cw, ch] = randRect();
      let a = true;
      for (let y = cy; y < cy + ch; y += 1) {
        if (rowOverlaps(rows[y], cx, cw)) { a = false; break; }
      }
      const b = naiveRegionEmpty(grid, R, cx, cy, cw, ch);
      assert.equal(a, b, `query mismatch at op ${ops}: [${cx},${cy},${cw},${ch}]`);
    }
    ops += 1;
  }
  console.log(`A) 行区间表 vs 朴素栅格：${ops} 次随机 mark/query 全部一致 ✓`);
}

// ---- B) 完整打包差分：导出 alpacaPackOccupancy（行区间表）≡ 内联旧栅格+积分图版 ----
// 旧版 = 重构前 modules/io/uv-pack.js 的 alpacaPackOccupancy（grid + integral + rebuildIntegral）
function alpacaPackOccupancyOld(items, { gap = 10 / 4096, resolution = 256, sort = "maxSide", order } = {}) {
  const cell = 1 / resolution;
  const grid = new Uint8Array(resolution * resolution);
  const iw = resolution + 1;
  const integral = new Int32Array(iw * iw);
  const rebuildIntegral = () => {
    for (let y = 0; y < resolution; y += 1) {
      let row = 0;
      const gy = y * resolution;
      const iy = y * iw;
      const iy1 = (y + 1) * iw;
      for (let x = 0; x < resolution; x += 1) {
        row += grid[gy + x];
        integral[iy1 + x + 1] = integral[iy + x + 1] + row;
      }
    }
  };
  const regionEmpty = (cx, cy, cw, ch) => {
    const x1 = cx; const y1 = cy; const x2 = cx + cw; const y2 = cy + ch;
    return integral[y2 * iw + x2] - integral[y1 * iw + x2] - integral[y2 * iw + x1] + integral[y1 * iw + x1] === 0;
  };
  const markOccupied = (cx, cy, cw, ch) => {
    for (let y = cy; y < cy + ch; y += 1) grid.fill(1, y * resolution + cx, y * resolution + cx + cw);
    rebuildIntegral();
  };
  const nodes = items.map((item) => ({
    id: item.id, island: item.island,
    width: item.width, height: item.height,
    cw: Math.max(1, Math.ceil((item.width + gap) / cell)),
    ch: Math.max(1, Math.ceil((item.height + gap) / cell))
  }));
  const sortKey = (node) => {
    if (sort === "area") return node.width * node.height;
    if (sort === "height") return node.height;
    if (sort === "width") return node.width;
    return Math.max(node.width, node.height);
  };
  const finalOrder = order !== undefined && order !== null
    ? order
    : nodes
      .map((node, index) => ({ index, key: sortKey(node) }))
      .sort((a, b) => b.key - a.key)
      .map((entry) => entry.index);
  let scanLine = 0;
  let overflow = false;
  for (const index of finalOrder) {
    const node = nodes[index];
    const minSL = Math.max(node.cw, node.ch);
    if (minSL > resolution) {
      overflow = true;
      node.x = 0;
      node.y = 0;
      continue;
    }
    let px = 0;
    let py = 0;
    const tryTop = (sl) => {
      const topY = sl - node.ch;
      const maxX = Math.min(sl - node.cw, resolution - node.cw);
      for (let cx = 0; cx <= maxX; cx += 1) {
        if (!regionEmpty(cx, topY, node.cw, node.ch)) continue;
        markOccupied(cx, topY, node.cw, node.ch);
        px = cx * cell;
        py = topY * cell;
        return true;
      }
      return false;
    };
    const tryRight = (sl) => {
      const rightX = sl - node.cw;
      const maxY = Math.min(sl - node.ch, resolution - node.ch);
      for (let cy = 0; cy <= maxY; cy += 1) {
        if (!regionEmpty(rightX, cy, node.cw, node.ch)) continue;
        markOccupied(rightX, cy, node.cw, node.ch);
        px = rightX * cell;
        py = cy * cell;
        return true;
      }
      return false;
    };
    let found = false;
    for (let sl = minSL; sl <= scanLine && !found; sl += 1) {
      found = tryTop(sl) || tryRight(sl);
    }
    for (let sl = Math.max(scanLine + 1, minSL); sl <= resolution && !found; sl += 1) {
      found = tryTop(sl) || tryRight(sl);
      if (found) scanLine = Math.max(scanLine, sl);
    }
    if (!found) {
      overflow = true;
      node.x = 0;
      node.y = 0;
    } else {
      node.x = px;
      node.y = py;
    }
  }
  return {
    placements: nodes.map((node) => ({ id: node.id, island: node.island, x: node.x, y: node.y })),
    extentU: scanLine / resolution,
    extentV: scanLine / resolution,
    overflow
  };
}

// 随机 item 集（宽高在 [0.0002, 2] 间，含极端长条/超大 item 触发 overflow 分支）
function makeItems(n, rand, idPrefix) {
  const items = [];
  for (let i = 0; i < n; i += 1) {
    const w = Math.pow(10, -3.7 + rand() * 3.3); // 0.0002 ~ 0.4 对数分布
    const h = Math.pow(10, -3.7 + rand() * 3.3);
    items.push({ id: `${idPrefix}${i}`, island: i, width: w, height: h });
  }
  return items;
}

{
  let seed = 777;
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let rounds = 0;
  for (const resolution of [8, 16, 32, 256]) {
    for (let t = 0; t < 40; t += 1) {
      const items = makeItems(3 + Math.floor(next() * 18), next); // 3..20 个
      // 随机 order（含未传 order / null / 随机打乱 / maxSide 排序）
      const sorted = items
        .map((it, index) => ({ index, key: Math.max(it.width, it.height) }))
        .sort((a, b) => b.key - a.key)
        .map((entry) => entry.index);
      let order;
      const mode = Math.floor(next() * 4);
      if (mode === 0) order = undefined;
      else if (mode === 1) order = null;
      else if (mode === 2) {
        order = sorted.slice();
        for (let i = order.length - 1; i > 0; i -= 1) {
          const j = Math.floor(next() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
      } else order = sorted;
      const a = alpacaPackOccupancy(items, { gap: 10 / 4096, resolution, sort: "maxSide", order });
      const b = alpacaPackOccupancyOld(items, { gap: 10 / 4096, resolution, sort: "maxSide", order });
      assert.equal(a.overflow, b.overflow, `overflow mismatch (res=${resolution}, t=${t}, mode=${mode})`);
      assert.equal(a.extentU, b.extentU, `extentU mismatch (res=${resolution}, t=${t})`);
      assert.equal(a.extentV, b.extentV, `extentV mismatch (res=${resolution}, t=${t})`);
      assert.equal(a.placements.length, b.placements.length, `placements count mismatch (res=${resolution}, t=${t})`);
      for (let i = 0; i < a.placements.length; i += 1) {
        const pa = a.placements[i];
        const pb = b.placements[i];
        assert.equal(pa.id, pb.id, `placement id mismatch (res=${resolution}, t=${t}, i=${i})`);
        assert.equal(pa.x, pb.x, `placement x mismatch (res=${resolution}, t=${t}, i=${i}: ${pa.x} vs ${pb.x})`);
        assert.equal(pa.y, pb.y, `placement y mismatch (res=${resolution}, t=${t}, i=${i}: ${pa.y} vs ${pb.y})`);
      }
      rounds += 1;
    }
  }
  console.log(`B) alpacaPackOccupancy（行区间表）≡ 旧栅格+积分图：${rounds} 组 items 逐位一致 ✓`);
}

// ---- C) 已知小场景手算验证（回归锚点）----
{
  // 两个 1×1 单元 item（占位 cw=ch=1，gap 小于 1 格 → 量化后 1 格）：第一个放 (0,0)（top，
  // sl=1），第二个 L 形放 (0,1) 或 (1,0) → placements 与旧版一致（此处仅 sanity：不溢出、不重叠）
  const items = [
    { id: "a", island: 0, width: 0.001, height: 0.001 },
    { id: "b", island: 1, width: 0.001, height: 0.001 }
  ];
  const r = alpacaPackOccupancy(items, { resolution: 256 });
  assert.equal(r.overflow, false);
  assert.equal(r.placements.length, 2);
  // 两岛不重叠：a 在 (0,0)，b 在 (0, 1/256)（L 形右侧）或 (1/256, 0)
  const a = r.placements.find((p) => p.id === "a");
  const b = r.placements.find((p) => p.id === "b");
  assert.ok(Math.abs(a.x - 0) < 1e-12 && Math.abs(a.y - 0) < 1e-12, "a 在 (0,0)");
  assert.ok(
    (Math.abs(b.x) < 1e-12 && Math.abs(b.y - 1 / 256) < 1e-12)
    || (Math.abs(b.y) < 1e-12 && Math.abs(b.x - 1 / 256) < 1e-12),
    `b 在 L 形邻位 (x=${b.x}, y=${b.y})`
  );
  console.log("C) 两 1×1 单元小场景 sanity ✓");
}

console.log("diff-occupancy passed");
