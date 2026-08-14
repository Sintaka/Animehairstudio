// scripts/check-usda-slit.mjs — 解析导出的 USDA，统计「跨缝长边面」。
// panel 的 zipper 缝(相邻段边界列间隙约 0.03~0.11 世界单位)不应被任何面跨越:
// 若导出的 face 有边 > 0.07 且两个端点分属不同段间隙位置,即为缝被填起的证据。
// Run: node scripts/check-usda-slit.mjs <file.usda> [edgeThreshold]
import fs from "node:fs";

const file = process.argv[2];
const threshold = Number(process.argv[3] || 0.07);
const text = fs.readFileSync(file, "utf8");

function parseArray(body) {
  // 去掉括号,按逗号分割,支持 (a, b, c) 元组与平铺数值
  const inner = body.replace(/[()]/g, " ");
  const tokens = inner.split(",").map((t) => t.trim()).filter(Boolean);
  const nums = [];
  for (const tok of tokens) {
    if (tok.includes(" ")) {
      // 平铺数值行: 先按逗号分再按空白分
      for (const piece of tok.split(/\s+/)) {
        const n = Number(piece);
        if (Number.isFinite(n)) nums.push(n);
      }
    } else {
      const n = Number(tok);
      if (Number.isFinite(n)) nums.push(n);
    }
  }
  return nums;
}

const meshes = [...text.matchAll(/def Mesh "([^"]+)"[\s\S]*?(?=\n\s*def Mesh |\n\s*def Scope|$)/g)];
let meshCount = 0;
let totalBridged = 0;
for (const match of meshes) {
  const name = match[1];
  const body = match[0];
  const ptsM = body.match(/point3f\[\] points = \[([\s\S]*?)\]/);
  const fviM = body.match(/int\[\] faceVertexIndices = \[([\s\S]*?)\]/);
  if (!ptsM || !fviM) continue;
  meshCount += 1;
  const flat = parseArray(ptsM[1]);
  const pts = [];
  for (let i = 0; i + 2 < flat.length; i += 3) pts.push([flat[i], flat[i + 1], flat[i + 2]]);
  const idx = parseArray(fviM[1]).map((n) => Math.round(n));
  const dist = (a, b) => Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1], pts[a][2] - pts[b][2]);
  // 遍历面:每 4 个索引一个 quad(全部面板导出为 quad)
  let bridged = 0;
  for (let i = 0; i + 4 <= idx.length; i += 4) {
    const q = [idx[i], idx[i + 1], idx[i + 2], idx[i + 3]];
    for (let k = 0; k < 4; k += 1) {
      if (dist(q[k], q[(k + 1) % 4]) > threshold) { bridged += 1; break; }
    }
  }
  totalBridged += bridged;
  console.log(`${name}: ${idx.length / 4} quads, ${bridged} 跨缝长边面(阈值 ${threshold})`);
}
console.log(meshCount === 0 ? "no meshes found" : `\n总计 ${totalBridged} 个跨缝长边面`);
