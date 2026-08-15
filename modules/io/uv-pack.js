// uv-pack.js — 导出时 UV 打包：把展开后的 family（主发片 + 子发片 / panel 整片）按真实 3D
// 尺寸统一缩放（统一纹素密度·面积归一），再 MaxRects（不旋转、带间隙）打包进 UDIM 1001
// （[0,1]²）。填充率自适应：Smart 多策略择优——多套「启发式（CP 贴边评分 / BSSF 短边余量）×
// 排序（maxSide/area/height/width）」各自在 PACK_FILL 上限内稠密采样 + 局部细化逼近最大无兜底
// k，取 fillUsed 最高者，保证所有 bbox 放得下（无兜底、无重叠），尽量铺满（尤其填掉右上角
// 空档）。纯函数、零依赖；原地修改各 mesh.uvs（u/v 平铺 number 数组）。

export const PACK_GAP = 10 / 4096; // 10px @ 4096 分辨率 → UV 间隙
export const PACK_FILL = 0.8;     // 目标填充率（UDIM tile 面积填充比例）

// 扇三角 (v0, vi, vi+1) 面积：0.5 * |cross(b-a, c-a)|
function triangleArea(a, b, c) {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const abz = b[2] - a[2];
  const acx = c[0] - a[0];
  const acy = c[1] - a[1];
  const acz = c[2] - a[2];
  const cx = aby * acz - abz * acy;
  const cy = abz * acx - abx * acz;
  const cz = abx * acy - aby * acx;
  return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
}

// 一个 mesh 的 3D 多边形表面积：每个 face 扇形三角化累加
function meshSurfaceArea(mesh) {
  if (!mesh || !Array.isArray(mesh.positions) || !Array.isArray(mesh.faces)) return 0;
  const positions = mesh.positions;
  let area = 0;
  for (const face of mesh.faces) {
    if (!Array.isArray(face) || face.length < 3) continue;
    const a0 = face[0] * 3;
    if (!Number.isInteger(face[0]) || face[0] < 0 || a0 + 2 >= positions.length) continue;
    const a = [positions[a0], positions[a0 + 1], positions[a0 + 2]];
    for (let i = 1; i + 1 < face.length; i += 1) {
      const bi = face[i] * 3;
      const ci = face[i + 1] * 3;
      if (!Number.isInteger(face[i]) || face[i] < 0 || bi + 2 >= positions.length) continue;
      if (!Number.isInteger(face[i + 1]) || face[i + 1] < 0 || ci + 2 >= positions.length) continue;
      area += triangleArea(a,
        [positions[bi], positions[bi + 1], positions[bi + 2]],
        [positions[ci], positions[ci + 1], positions[ci + 2]]);
    }
  }
  return area;
}

// family 所有 meshes 的 UV 包围盒（缩放后）；无 uv → 零盒
function uvBounds(meshes) {
  let minU = Infinity;
  let minV = Infinity;
  let maxU = -Infinity;
  let maxV = -Infinity;
  let found = false;
  for (const mesh of meshes || []) {
    const uvs = mesh && mesh.uvs;
    if (!uvs) continue;
    for (let i = 0; i + 1 < uvs.length; i += 2) {
      const u = Number(uvs[i]);
      const v = Number(uvs[i + 1]);
      if (!Number.isFinite(u) || !Number.isFinite(v)) continue;
      found = true;
      if (u < minU) minU = u;
      if (u > maxU) maxU = u;
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
  }
  if (!found) return { minU: 0, minV: 0, maxU: 0, maxV: 0, width: 0, height: 0 };
  return { minU, minV, maxU, maxV, width: maxU - minU, height: maxV - minV };
}

// MaxRects（参考 Jukka Jylänki 的 MaxRectsBinPack，不旋转）：把 items（bbox 当矩形）逐个
// 放进 [gap, binW-gap]×[gap, binH-gap]² 自由矩形。占位尺寸 = (width+gap, height+gap)
// （右/下各留 gap；bin 边距已由初始自由矩形的 gap 偏移覆盖）。
// items: [{ id, island, width, height }]；返回 { placements, overflowCount }：
//   placements = [{ id, island, x, y }]（bbox 左上角放置坐标）；
//   overflowCount = 走兜底分支（没有自由矩形放得下）的 item 数。
// 参数化：
//   sort: "maxSide"（max(w,h) 降序，默认）/ "area"（w*h）/ "height" / "width"，均稳定排序；
//   heuristic: "contactPoint"（Contact Point Rule 贴边评分，默认）/ "bssf"（Best Short Side Fit）。
function maxRectsPack(items, { binW = 1, binH = 1, gap = 0, heuristic = "contactPoint", sort = "maxSide" } = {}) {
  const EPS = 1e-9;
  const free = [{ x: gap, y: gap, w: binW - 2 * gap, h: binH - 2 * gap }];
  const nodes = items.map((item) => ({
    id: item.id, island: item.island,
    x: gap, y: gap, w: item.width + gap, h: item.height + gap
  }));

  // 放置顺序：按排序键降序稳定排序（并列保持输入顺序；V8 sort 稳定）
  const sortKey = (node) => {
    if (sort === "area") return node.w * node.h;
    if (sort === "height") return node.h;
    if (sort === "width") return node.w;
    return Math.max(node.w, node.h); // "maxSide"
  };
  const order = nodes
    .map((node, index) => ({ index, key: sortKey(node) }))
    .sort((a, b) => b.key - a.key)
    .map((entry) => entry.index);

  // 用占位节点切分自由矩形（SplitFreeNode，不旋转）：SAT 交叠测试，不相交返回 null；
  // 相交返回最多 4 块余量（上/下/左/右，各自独立条件 push，EPS=1e-9 防零厚碎片）
  const splitFreeNode = (rect, used) => {
    // SAT：不相交 → null（不切）
    if (used.x >= rect.x + rect.w - EPS || used.x + used.w <= rect.x + EPS
      || used.y >= rect.y + rect.h - EPS || used.y + used.h <= rect.y + EPS) return null;
    const out = [];
    if (used.y > rect.y + EPS) out.push({ x: rect.x, y: rect.y, w: rect.w, h: used.y - rect.y });                                  // 上
    if (used.y + used.h < rect.y + rect.h - EPS) out.push({ x: rect.x, y: used.y + used.h, w: rect.w, h: rect.y + rect.h - (used.y + used.h) }); // 下
    if (used.x > rect.x + EPS) out.push({ x: rect.x, y: rect.y, w: used.x - rect.x, h: rect.h });                                  // 左
    if (used.x + used.w < rect.x + rect.w - EPS) out.push({ x: used.x + used.w, y: rect.y, w: rect.x + rect.w - (used.x + used.w), h: rect.h }); // 右
    return out;
  };

  // PruneFreeList：删除被其它自由矩形完全包含的自由矩形
  const pruneFreeList = () => {
    for (let i = free.length - 1; i >= 0; i -= 1) {
      const a = free[i];
      let contained = false;
      for (let j = 0; j < free.length; j += 1) {
        if (i === j) continue;
        const b = free[j];
        if (a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h) {
          contained = true;
          break;
        }
      }
      if (contained) free.splice(i, 1);
    }
  };

  // 两区间 [a1,a2] 与 [b1,b2] 的公共长度（共边接触长度）
  const commonIntervalLength = (a1, a2, b1, b2) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));

  // Contact Point Rule 评分：贴 bin 边加分，与已放置项共边按公共边长加分——接触越多越好
  const contactScore = (x, y, w, h) => {
    let score = 0;
    if (Math.abs(x - gap) < EPS || Math.abs(x + w - (binW - gap)) < EPS) score += h;   // 贴左/右边
    if (Math.abs(y - gap) < EPS || Math.abs(y + h - (binH - gap)) < EPS) score += w;   // 贴上/下边
    for (const u of usedRects) {
      if (Math.abs(u.x - (x + w)) < EPS || Math.abs(u.x + u.w - x) < EPS)
        score += commonIntervalLength(u.y, u.y + u.h, y, y + h);
      if (Math.abs(u.y - (y + h)) < EPS || Math.abs(u.y + u.h - y) < EPS)
        score += commonIntervalLength(u.x, u.x + u.w, x, x + w);
    }
    return score;
  };

  let overflowCount = 0;
  const usedRects = []; // 已放置项的占位尺寸矩形（w/h = item.width+gap），CP 评分用
  for (const index of order) {
    const node = nodes[index];
    // 选位循环按 heuristic 分支：
    //   contactPoint — 每个放得下的自由矩形算接触分（贴 bin 边加分、与已放置项共边按公共
    //     边长加分），取分最高者（并列取更早）；
    //   bssf（Best Short Side Fit）— shortSide 最小、并列取 longSide 最小。
    let best = -1;
    let bestScore = -1;       // CP 用：接触分
    let bestShort = Infinity; // BSSF 用：短边余量
    let bestLong = Infinity;  // BSSF 用：长边余量
    for (let i = 0; i < free.length; i += 1) {
      const rect = free[i];
      if (rect.w < node.w - EPS || rect.h < node.h - EPS) continue;
      if (heuristic === "bssf") {
        const leftoverHoriz = rect.w - node.w;
        const leftoverVert = rect.h - node.h;
        const shortSide = Math.min(leftoverHoriz, leftoverVert);
        const longSide = Math.max(leftoverHoriz, leftoverVert);
        if (shortSide < bestShort || (shortSide === bestShort && longSide < bestLong)) {
          best = i;
          bestShort = shortSide;
          bestLong = longSide;
        }
      } else {
        const score = contactScore(rect.x, rect.y, node.w, node.h);
        if (score > bestScore) { // 严格大于 → 并列时保留更早的自由矩形
          best = i;
          bestScore = score;
        }
      }
    }
    let used;
    if (best >= 0) {
      used = { x: free[best].x, y: free[best].y, w: node.w, h: node.h };
      // 不单独 erase best：把整个自由矩形列表快照后重建——与 used 相交的换成余量，
      // 不相交的原样保留（避免列表污染导致后续项与已放置项重叠）
      const snapshot = free.slice();
      free.length = 0;
      for (const rect of snapshot) {
        const remainders = splitFreeNode(rect, used); // null = 不相交
        if (remainders) free.push(...remainders);      // 相交 → 换成余量
        else free.push(rect);                          // 不相交 → 原样保留
      }
    } else {
      // 兜底：没有自由矩形放得下 → 放 (gap, gap)（尽力，可能越界，属退化情况；
      // 自适应填充下应极少触发）
      used = { x: gap, y: gap, w: node.w, h: node.h };
      overflowCount += 1;
    }
    usedRects.push({ x: used.x, y: used.y, w: node.w, h: node.h }); // 成功放置与兜底分支都记录
    node.x = used.x;
    node.y = used.y;
    pruneFreeList();
  }
  return {
    placements: nodes.map((node) => ({ id: node.id, island: node.island, x: node.x, y: node.y })),
    overflowCount
  };
}

// 自适应找最大无兜底 k：在 [0, sqrt(fill/totalArea)] 稠密采样 128 点找「最大能放下」的采样 k
// （fitsAt 对 k 非单调——贪心小尺度「拟合岛/失败带」交错，纯二分会停在失败带前），再在相邻
// 区间局部细化二分 24 次逼近真最大值，返回 lo*0.999999（留极小余量防浮点贴边兜底）；
// 完全放不下（理论不可达）返回 -1。fitsAt 用对应 heuristic+sort 调 maxRectsPack（只缩放
// width/height 喂给打包，不反复动 uv）。
// boxUnit: [{ family 或 id, island, width, height }]（width/height 为单位尺度 UV 包围盒）
export function findMaxK(boxUnit, totalArea, fill, gap, heuristic = "contactPoint", sort = "maxSide") {
  if (!(fill > 0) || !(totalArea > 0)) return -1;
  const kMax = Math.sqrt(fill / totalArea);
  const fitsAt = (k) => {
    const { overflowCount } = maxRectsPack(
      boxUnit.map((box) => ({
        id: box.id !== undefined ? box.id : box.family.id,
        island: box.island,
        width: box.width * k,
        height: box.height * k
      })),
      { gap, heuristic, sort }
    );
    return overflowCount === 0;
  };
  // 稠密采样 128 点：找「最大能放下」的采样 k（非单调也能覆盖大部分）
  const SAMPLES = 128;
  let bestK = 0;
  for (let i = 1; i <= SAMPLES; i += 1) {
    const k = kMax * i / SAMPLES;
    if (fitsAt(k)) bestK = k;
  }
  // 局部细化：在 [bestK, bestK + kMax/SAMPLES] 二分 24 次
  let lo = bestK;
  let hi = Math.min(kMax, bestK + kMax / SAMPLES);
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (fitsAt(mid)) lo = mid;
    else hi = mid;
  }
  if (!(lo > 0)) return -1;
  return lo * 0.999999; // 留极小余量，防浮点贴边兜底
}

// families: [{ id, meshes, length, width }]
//   - meshes: 展开网格 [{ uvs, positions, faces }]（family = 主发片 + 子发片 / panel 整片）
//   - length: 世界纵向长度（曲线长）；width: 世界横向宽度，可为 undefined/null——
//     此时按统一纹素密度推导 width = area / length（area 为该 family 所有 meshes 的 3D 表面积）
// 步骤：1) 面积/width/island（totalArea = Σ，守卫 totalArea<=0 无操作）→
//       2) 单位缩放（k=1）：uv × (width, length)，写 uvisland →
//       3) boxUnit = 单位尺度 UV 包围盒 →
//       4) kMax = sqrt(fill/totalArea)（作上限）→
//       5) Smart 择优：多套「启发式（CP/BSSF）× 排序（maxSide/area/height/width）」各自
//          稠密采样 128 点 + 局部细化 24 次二分 k ∈ [0, kMax] 逼近最大「maxRectsPack 无兜底」
//          的 k，取 fillUsed（= k²·totalArea）最高者（fitsAt 对 k 非单调，
//          kFinal = lo*0.999999 留极小余量防浮点贴边兜底）→
//       6) 最终缩放 uv × kFinal + 打包验证（贪心对 k 非单调：lo 邻域可能有「拟合岛/
//          失败带」交错，kFinal 落失败带会兜底 → 验证 overflowCount，非零则缩小 k 重试，
//          k→0 必无兜底保证终止，实际 1~3 次收敛）→
//       7) boxFinal = 重算 UV 包围盒 → 8) 按 placements 平移 → 9) 返回
// 返回 { k: kFinal, totalArea, fillUsed: kFinal²*totalArea, packed: [...] }；守卫返回
// { k: null, totalArea: 0, fillUsed: 0, packed: [] } 且不修改任何 uvs。
// length<=0 / area<=0 /（推导后）width<=0 的 family 跳过（原样不动、不缩放、不打包、不写
// uvisland）。island 按有效 family 密集编号 0..N-1、输入顺序（sort 前固定）。
export function packFamilies(families, { gap = PACK_GAP, fill = PACK_FILL } = {}) {
  // 1) 面积 / width（显式或推导）/ island
  const valid = [];
  let totalArea = 0;
  for (const family of families || []) {
    const length = Number(family.length);
    if (!(Number.isFinite(length) && length > 0)) continue;
    const area = (family.meshes || []).reduce((sum, mesh) => sum + meshSurfaceArea(mesh), 0);
    if (!(area > 0)) continue;
    // width：显式传值用显式；否则按统一纹素密度推导 width = area / length
    const explicitWidth = Number(family.width);
    const width = (Number.isFinite(explicitWidth) && explicitWidth > 0)
      ? explicitWidth
      : area / length;
    if (!(width > 0)) continue;
    valid.push({ family, area, width, length, island: valid.length }); // island = 有效 family 密集编号 0..N-1
    totalArea += area;
  }
  // 2) 守卫：总面积 <= 0 → 无操作
  if (!(totalArea > 0)) return { k: null, totalArea: 0, fillUsed: 0, packed: [] };

  // 3) 单位缩放（k=1）：uv × (width, length)，保持真实宽高比；写 uvisland
  for (const { family, width, length, island } of valid) {
    for (const mesh of family.meshes || []) {
      mesh.uvisland = island; // UV 岛编号（sort 前已固定，稳定 0..N-1）
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        uvs[i] *= width;
        uvs[i + 1] *= length;
      }
    }
  }
  // 4) 单位尺度（k=1）UV 包围盒
  const boxUnit = valid.map(({ family, island }) => ({ family, island, ...uvBounds(family.meshes) }));

  // 5) Smart 择优：多套「启发式 × 排序」各自找最大无兜底 k，取 fillUsed 最高者（右上角空档
  //    常源于单一排序/启发式的选位偏好——maxSide 把长条铺到底边、area 填平缺口、height/width
  //    贴合条带、BSSF 留最小余量；择优取最优布局，显著提高铺满率）
  const STRATEGIES = [
    ["contactPoint", "maxSide"], ["contactPoint", "area"],
    ["contactPoint", "height"], ["contactPoint", "width"],
    ["bssf", "maxSide"], ["bssf", "area"]
  ];
  const best = { k: -1, heuristic: "contactPoint", sort: "maxSide" };
  for (const [heuristic, sort] of STRATEGIES) {
    const k = findMaxK(boxUnit, totalArea, fill, gap, heuristic, sort);
    if (k > best.k) {
      best.k = k;
      best.heuristic = heuristic;
      best.sort = sort;
    }
  }
  // CP+maxSide 必成功 → best.k 恒 > 0；-1 分支仅防御（理论不可达）
  let kFinal = best.k > 0 ? best.k : findMaxK(boxUnit, totalArea, fill, gap);

  // 6) 最终缩放 + 打包验证：fitsAt 对 k 非单调（贪心，lo 邻域「拟合岛/失败带」交错，
  //    kFinal 可能恰落失败带 → 兜底重叠），故用真实 uvBounds 按择优策略（best.heuristic/
  //    best.sort）打包并验证 overflowCount，非零则缩小 k 重试（k→0 必无兜底，保证终止；
  //    实际 1~3 次收敛）
  let boxFinal = null;
  let placements = null;
  let applied = 1; // uvs 当前累计缩放（相对单位尺度；重试时按比例重缩放）
  for (;;) {
    const factor = kFinal / applied;
    for (const { family } of valid) {
      for (const mesh of family.meshes || []) {
        const uvs = mesh && mesh.uvs;
        if (!uvs) continue;
        for (let i = 0; i + 1 < uvs.length; i += 2) {
          uvs[i] *= factor;
          uvs[i + 1] *= factor;
        }
      }
    }
    applied = kFinal;
    // 7) 最终包围盒（uv 已缩放，重算 uvBounds）
    boxFinal = valid.map(({ family, island }) => ({ family, island, ...uvBounds(family.meshes) }));
    // 8) MaxRects 打包（择优策略的 heuristic+sort）
    const packed2 = maxRectsPack(
      boxFinal.map((box) => ({ id: box.family.id, island: box.island, width: box.width, height: box.height })),
      { gap, heuristic: best.heuristic, sort: best.sort }
    );
    if (packed2.overflowCount === 0) {
      placements = packed2.placements;
      break;
    }
    kFinal *= 0.999; // 缩小重试
  }

  // 9) 按 placements 平移：拿到放置坐标后把 family 所有 uv 平移到位
  const placedBy = new Map(placements.map((entry) => [entry.id, entry]));
  const packed = [];
  for (const box of boxFinal) {
    const pos = placedBy.get(box.family.id);
    if (!pos) continue; // maxRectsPack 返回与输入同 id 集，理论不可达
    const dx = pos.x - box.minU;
    const dy = pos.y - box.minV;
    for (const mesh of box.family.meshes || []) {
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        uvs[i] += dx;
        uvs[i + 1] += dy;
      }
    }
    packed.push({ id: box.family.id, island: box.island, x: pos.x, y: pos.y, width: box.width, height: box.height });
  }
  // 10) 返回
  return { k: kFinal, totalArea, fillUsed: kFinal * kFinal * totalArea, packed };
}
