// uv-pack.js — 导出时 UV 打包：把展开后的 family（主发片 + 子发片）按真实 3D 尺寸
// 统一缩放（统一纹素密度·面积归一），再 shelf-pack 进 UDIM 1001（[0,1]²）。
// 纯函数、零依赖；原地修改各 mesh.uvs（u/v 平铺 number 数组）。

export const PACK_GAP = 5 / 4096; // 5px @ 4096 分辨率 → UV 间隙
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

// families: [{ id, meshes, length, circumference }]
//   - meshes: 展开网格 [{ uvs, positions, faces }]（family = 主发片 + 子发片，UV 已互相同尺度）
//   - length: 主发片世界长度；circumference: 主发片世界环周长
// 步骤：1) 面积（3D 多边形表面积，totalArea = Σ）→ 2) 守卫 totalArea<=0 无操作 →
//       3) k = sqrt(fill/totalArea) → 4) 缩放 uScale=k*circumference、vScale=k*length →
//       5) UV 包围盒 → 6) shelf-pack（按高度降序稳定排序，不旋转只平移，项间/边缘留 gap）
// 返回 { k, totalArea, packed: [{ id, island, x, y, width, height }] }；守卫返回
// { k: null, packed: [], totalArea: 0 } 且不修改任何 uvs。
// 长度<=0 或周长<=0 的 family 跳过（原样不动、不纳入缩放/打包）。
export function packFamilies(families, { gap = PACK_GAP, fill = PACK_FILL } = {}) {
  // 1) 面积
  const valid = [];
  let totalArea = 0;
  for (const family of families || []) {
    const length = Number(family.length);
    const circumference = Number(family.circumference);
    if (!(Number.isFinite(length) && length > 0)) continue;
    if (!(Number.isFinite(circumference) && circumference > 0)) continue;
    const area = (family.meshes || []).reduce((sum, mesh) => sum + meshSurfaceArea(mesh), 0);
    valid.push({ family, area, island: valid.length }); // island = 有效 family 密集编号 0..N-1
    totalArea += area;
  }
  // 2) 守卫：总面积 <= 0 → 无操作
  if (!(totalArea > 0)) return { k: null, packed: [], totalArea: 0 };
  // 3) 全局尺度
  const k = Math.sqrt(fill / totalArea);
  // 4) 缩放：统一纹素密度（UV 面积 ∝ 世界面积）并保持真实宽高比
  for (const { family, island } of valid) {
    const uScale = k * Number(family.circumference);
    const vScale = k * Number(family.length);
    for (const mesh of family.meshes || []) {
      mesh.uvisland = island; // UV 岛编号（sort 前已固定，稳定 0..N-1）
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        uvs[i] *= uScale;
        uvs[i + 1] *= vScale;
      }
    }
  }
  // 5) 缩放后 UV 包围盒
  const boxes = valid.map(({ family, island }) => ({ family, island, ...uvBounds(family.meshes) }));
  // 6) shelf-pack：高度降序（稳定）；放不下换行
  boxes.sort((a, b) => b.height - a.height);
  let x = gap;
  let y = gap;
  let shelfHeight = 0;
  const packed = [];
  for (const box of boxes) {
    if (x > gap && x + box.width > 1 - gap) {
      y += shelfHeight + gap; // 换到下一行
      x = gap;
      shelfHeight = 0;
    }
    const dx = x - box.minU;
    const dy = y - box.minV;
    for (const mesh of box.family.meshes || []) {
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        uvs[i] += dx;
        uvs[i + 1] += dy;
      }
    }
    packed.push({ id: box.family.id, island: box.island, x, y, width: box.width, height: box.height });
    x += box.width + gap;
    shelfHeight = Math.max(shelfHeight, box.height);
  }
  // 7) 返回
  return { k, totalArea, packed };
}
