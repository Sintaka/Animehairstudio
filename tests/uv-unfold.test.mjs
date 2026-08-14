// tests/uv-unfold.test.mjs — 纯 node 测试（不 import three）：
// 验证 modules/io/uv-unfold.js 的归一化矩形 UV 展开（gridDimensions /
// parametricGridUv / unfoldHairMesh）。运行：node tests/uv-unfold.test.mjs

import assert from "node:assert/strict";
import {
  gridDimensions,
  parametricGridUv,
  unfoldHairMesh
} from "../modules/io/uv-unfold.js";

// BufferAttribute 风格的假属性：array + itemSize + count + getX/getY/getZ/getW。
function makeAttr(values, itemSize) {
  const array = new Float32Array(values);
  return {
    array,
    itemSize,
    count: array.length / itemSize,
    getX: (i) => array[i * itemSize],
    getY: (i) => array[i * itemSize + 1],
    getZ: (i) => array[i * itemSize + 2],
    getW: (i) => array[i * itemSize + 3]
  };
}

// 闭合环假网格：rows×cols 行主序顶点 + 环面 quadFaces（含跨 seam 的 wrap quad）。
function closedTorusGeometry(rows, cols) {
  const positions = [];
  const normals = [];
  const colors = [];
  const uvs = [];
  const gridRowIndices = new Float32Array(rows * cols);
  const gridColIndices = new Float32Array(rows * cols);
  const leafWeights = new Float32Array(rows * cols * 3);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c;
      positions.push(r, c, 0);
      normals.push(0, 0, 1);
      colors.push(0.5, 0.25, 0);
      uvs.push(0.5, 0.5);
      gridRowIndices[i] = r;
      gridColIndices[i] = c;
      leafWeights[i * 3] = 1;
      leafWeights[i * 3 + 1] = r;
      leafWeights[i * 3 + 2] = 0.5;
    }
  }
  const quadFaces = [];
  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const next = (col + 1) % cols;
      const a = row * cols + col;
      const c = (row + 1) * cols + col;
      const d = (row + 1) * cols + next;
      const b = row * cols + next;
      quadFaces.push([a, c, d, b]);
    }
  }
  return {
    userData: { gridRowIndices, gridColIndices, quadFaces, leafWeights },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      color: makeAttr(colors, 3),
      uv: makeAttr(uvs, 2)
    }[name])
  };
}

// ---- gridDimensions / parametricGridUv ----
{
  const rows = new Float32Array([0, 0, 1, 1, 2, 2]);
  const cols = new Float32Array([0, 1, 0, 1, 0, 1]);
  assert.deepEqual(gridDimensions(rows, cols), { rows: 3, cols: 2 });
  assert.deepEqual(gridDimensions(null, null), { rows: 0, cols: 0 });
  assert.deepEqual(gridDimensions(new Float32Array(0), new Float32Array(0)), { rows: 0, cols: 0 });
  assert.deepEqual(gridDimensions(new Float32Array([-1, -1]), new Float32Array([-1, -1])), { rows: 0, cols: 0 });
  // u = col/cols；v = 1 - row/(rows-1)（根=1、尖=0）
  assert.deepEqual(parametricGridUv(rows, cols, 0), [0, 1]);
  assert.deepEqual(parametricGridUv(rows, cols, 4), [0, 0]);
  assert.deepEqual(parametricGridUv(rows, cols, 5), [0.5, 0]);
  assert.equal(parametricGridUv(rows, cols, 99), null); // 越界
  assert.equal(parametricGridUv(rows, cols, -1), null);
  assert.equal(parametricGridUv(null, null, 0), null);
}
{
  // rows<2 → v=0.5 兜底
  const rows = new Float32Array([0, 0]);
  const cols = new Float32Array([0, 1]);
  assert.deepEqual(parametricGridUv(rows, cols, 0), [0, 0.5]);
}

// ---- closed：4×4 闭合环 ----
{
  const R = 4;
  const C = 4;
  const geometry = closedTorusGeometry(R, C);
  const mesh = unfoldHairMesh(geometry, { kind: "closed", seamCol: 0 });
  assert.ok(mesh, "closed unfold should succeed");
  // 每行 C+1 个新顶点（seam 复制）
  assert.equal(mesh.positions.length / 3, R * (C + 1));
  assert.equal(mesh.uvs.length / 2, R * (C + 1));
  assert.equal(mesh.faces.length, (R - 1) * C);
  assert.equal(mesh.normals.length, R * (C + 1) * 3);
  assert.equal(mesh.colors.length, R * (C + 1) * 3);
  assert.equal(mesh.tangents, null); // 源无 tangent 属性
  // u/v 范围 [0,1]
  for (let i = 0; i < mesh.uvs.length; i += 2) {
    assert.ok(mesh.uvs[i] >= 0 && mesh.uvs[i] <= 1, `u out of range: ${mesh.uvs[i]}`);
    assert.ok(mesh.uvs[i + 1] >= 0 && mesh.uvs[i + 1] <= 1, `v out of range: ${mesh.uvs[i + 1]}`);
  }
  // 根行 v=1、尖行 v=0
  for (let pos = 0; pos <= C; pos += 1) {
    assert.equal(mesh.uvs[pos * 2 + 1], 1, "root row v=1");
    assert.equal(mesh.uvs[((R - 1) * (C + 1) + pos) * 2 + 1], 0, "tip row v=0");
  }
  // seam 行（row 0）：pos0 → u=0、posC → u=1 双副本
  assert.equal(mesh.uvs[0], 0);
  assert.equal(mesh.uvs[C * 2], 1);
  // 每行 u 严格递增
  for (let row = 0; row < R; row += 1) {
    const base = row * (C + 1) * 2;
    for (let pos = 1; pos <= C; pos += 1) {
      assert.ok(mesh.uvs[base + pos * 2] > mesh.uvs[base + (pos - 1) * 2], "u strictly increasing");
    }
  }
  // seam 副本复制同值（pos0 与 posC 都来自 col0 顶点）
  assert.deepEqual(mesh.positions.slice(0, 3), mesh.positions.slice(C * 3, C * 3 + 3));
  assert.deepEqual(Array.from(mesh.gridRows.slice(0, C + 1)), [0, 0, 0, 0, 0]);
  assert.deepEqual(Array.from(mesh.gridCols.slice(0, C + 1)), [0, 1, 2, 3, 0]);
  // faces 索引有效
  const newVertexCount = mesh.positions.length / 3;
  for (const face of mesh.faces) {
    for (const index of face) {
      assert.ok(Number.isInteger(index) && index >= 0 && index < newVertexCount, `face index ${index}`);
    }
  }
  // 跨 seam quad（原 [3,7,4,0]，cols 3→0 wrap）→ 重映射后含两行 u=1 的 seam 副本，
  // 且该 quad 两端 u 相差 ~1/C。
  const crossSeam = mesh.faces.find((face) => face.includes(4) && face.includes(9));
  assert.ok(crossSeam, "cross-seam quad keeps both u=1 seam copies");
  const us = crossSeam.map((index) => mesh.uvs[index * 2]);
  const uMin = Math.min(...us);
  const uMax = Math.max(...us);
  assert.ok(Math.abs(uMax - uMin - 1 / C) < 1e-9, `cross-seam u span ${uMax - uMin}`);
  assert.equal(uMax, 1, "seam copies land on u=1");
  // leafWeights 按映射复制：长度=新顶点数*3，seam 副本同值
  assert.equal(mesh.leafWeights.length, R * (C + 1) * 3);
  assert.deepEqual(Array.from(mesh.leafWeights.slice(0, 3)), Array.from(mesh.leafWeights.slice(C * 3, C * 3 + 3)));
  assert.equal(mesh.leafWeights[1], 0); // source vertex 0 的 leafIndex=0
}

// ---- open：2×3，u = col/(C-1)，无 seam 复制 ----
{
  const R = 2;
  const C = 3;
  const geometry = closedTorusGeometry(R, C);
  const mesh = unfoldHairMesh(geometry, { kind: "open" });
  assert.ok(mesh, "open unfold should succeed");
  assert.equal(mesh.positions.length / 3, R * C); // 无 +1 副本
  // row0: u = 0, 0.5, 1；v = 1
  assert.deepEqual([mesh.uvs[0], mesh.uvs[2], mesh.uvs[4]], [0, 0.5, 1]);
  assert.deepEqual([mesh.uvs[1], mesh.uvs[3], mesh.uvs[5]], [1, 1, 1]);
  // row1: v = 0
  assert.equal(mesh.uvs[C * 2 + 1], 0);
  for (const face of mesh.faces) {
    for (const index of face) assert.ok(index >= 0 && index < R * C, `open face index ${index}`);
  }
}

// ---- split：2 管 × 每管 3 列（fused cols 0-2 / 3-5），各管独立 seam ----
{
  const R = 2;
  const tubeCols0 = [0, 1, 2];
  const tubeCols1 = [3, 4, 5];
  const colToSection = [
    { section: 0, col: 0 }, { section: 0, col: 1 }, { section: 0, col: 2 },
    { section: 1, col: 0 }, { section: 1, col: 1 }, { section: 1, col: 2 }
  ];
  const positions = [];
  const uvs = [];
  const normals = [];
  const gridRowIndices = [];
  const gridColIndices = [];
  for (let r = 0; r < R; r += 1) {
    for (let f = 0; f < 6; f += 1) {
      positions.push(r, f, 0);
      uvs.push(0.5, 0.5);
      normals.push(0, 0, 1);
      gridRowIndices.push(r);
      gridColIndices.push(f);
    }
  }
  const indexAt = (r, f) => r * 6 + f;
  const quadFaces = [];
  const pushTubeQuads = (cols) => {
    for (let k = 0; k < cols.length; k += 1) {
      const c = cols[k];
      const next = cols[(k + 1) % cols.length];
      quadFaces.push([indexAt(0, c), indexAt(1, c), indexAt(1, next), indexAt(0, next)]);
    }
  };
  pushTubeQuads(tubeCols0);
  pushTubeQuads(tubeCols1);
  const geometry = {
    userData: {
      gridRowIndices: new Float32Array(gridRowIndices),
      gridColIndices: new Float32Array(gridColIndices),
      quadFaces,
      splitFusedGrid: { colToSection }
    },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      uv: makeAttr(uvs, 2)
    }[name])
  };
  const mesh = unfoldHairMesh(geometry, { kind: "split" });
  assert.ok(mesh, "split unfold should succeed");
  // 每行 (C0+1)+(C1+1) = 8 个新顶点
  assert.equal(mesh.positions.length / 3, R * 8);
  assert.equal(mesh.faces.length, 6);
  // 管 0 首列 seam：pos0 → u=0（新索引 0）、pos C0 → u=1（新索引 3），位置同源
  assert.equal(mesh.uvs[0], 0);
  assert.equal(mesh.uvs[3 * 2], 1);
  assert.deepEqual(mesh.positions.slice(0, 3), mesh.positions.slice(3 * 3, 3 * 3 + 3));
  assert.deepEqual(Array.from(mesh.gridCols.slice(0, 4)), [0, 1, 2, 0]);
  // 管 1 首列 seam（fused col 3）：管 1 行基 = C0+1 = 4 → 新索引 4（u=0）、7（u=1）
  assert.equal(mesh.uvs[4 * 2], 0);
  assert.equal(mesh.uvs[7 * 2], 1);
  // v：row0=1、row1=0
  assert.equal(mesh.uvs[1], 1);
  assert.equal(mesh.uvs[8 * 2 + 1], 0);
  // 跨 seam quad（管 0 的 cols 2→0 wrap，原 [2,8,6,0]）→ 重映射后 seam 顶点走 u=1
  const crossSeam = mesh.faces.find((face) => face.includes(3) && face.includes(11));
  assert.ok(crossSeam, "split cross-seam quad keeps u=1 copies");
  const us = crossSeam.map((index) => mesh.uvs[index * 2]);
  assert.ok(Math.abs(Math.max(...us) - Math.min(...us) - 1 / 3) < 1e-9);
  // 每 face 顶点落在合法索引范围
  for (const face of mesh.faces) {
    for (const index of face) assert.ok(index >= 0 && index < R * 8, `split face index ${index}`);
  }
}

// ---- compound：open 布局 + col=-1 顶点 passthrough（uv = 原 uv 属性） ----
{
  const positions = [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 9, 9, 9];
  const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  const uvs = [0, 0, 0, 1, 1, 0, 1, 1, 0.3, 0.7];
  const gridRowIndices = new Float32Array([0, 0, 1, 1, -1]);
  const gridColIndices = new Float32Array([0, 1, 0, 1, -1]);
  const quadFaces = [[0, 2, 3, 1], [1, 4, 3]];
  const geometry = {
    userData: { gridRowIndices, gridColIndices, quadFaces },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      uv: makeAttr(uvs, 2)
    }[name])
  };
  const mesh = unfoldHairMesh(geometry, { kind: "compound" });
  assert.ok(mesh, "compound unfold should succeed");
  // 网格顶点 = R*C = 4（open 无 seam 复制）+ 1 个 passthrough = 5
  assert.equal(mesh.positions.length / 3, 5);
  assert.equal(mesh.uvs.length / 2, 5);
  assert.deepEqual(Array.from(mesh.gridCols.slice(4)), [-1]);
  assert.equal(mesh.gridRows[4], -1);
  // passthrough 用原 uv（0.3, 0.7，Float32 精度内）
  assert.ok(Math.abs(mesh.uvs[4 * 2] - 0.3) < 1e-6);
  assert.ok(Math.abs(mesh.uvs[4 * 2 + 1] - 0.7) < 1e-6);
  // 三角形 [1,4,3] → 网格顶点 1、3 + passthrough 4
  const face = mesh.faces.find((f) => f.includes(4));
  assert.ok(face, "face referencing passthrough vertex");
  assert.deepEqual([...face].sort((a, b) => a - b), [1, 3, 4]);
  // 网格顶点 uv 为矩形 uv：顶点 1（row0 col1）→ u = 1/(C-1) = 1
  assert.deepEqual([mesh.uvs[2], mesh.uvs[3]], [1, 1]);
}

// ---- child：closed 布局（seam=2）+ bridgeUvAt override 的 -1 顶点 ----
{
  const R = 2;
  const C = 4;
  const positions = [];
  const normals = [];
  const uvs = [];
  const gridRowIndices = [];
  const gridColIndices = [];
  for (let r = 0; r < R; r += 1) {
    for (let c = 0; c < C; c += 1) {
      positions.push(r, c, 0);
      normals.push(0, 0, 1);
      uvs.push(0.5, 0.5);
      gridRowIndices.push(r);
      gridColIndices.push(c);
    }
  }
  // 追加桥接顶点（索引 8，col=-1）
  positions.push(5, 5, 5);
  normals.push(0, 0, 1);
  uvs.push(0.1, 0.2);
  gridRowIndices.push(-1);
  gridColIndices.push(-1);
  const quadFaces = [];
  for (let col = 0; col < C; col += 1) {
    const next = (col + 1) % C;
    quadFaces.push([col, C + col, C + next, next]);
  }
  quadFaces.push([4, 8, 5]); // 桥接三角形（含 -1 顶点）
  const geometry = {
    userData: {
      gridRowIndices: new Float32Array(gridRowIndices),
      gridColIndices: new Float32Array(gridColIndices),
      quadFaces,
      ringWidthSegments: 4
    },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      uv: makeAttr(uvs, 2)
    })[name]
  };
  let bridgeUvCalls = 0;
  const mesh = unfoldHairMesh(geometry, {
    kind: "child",
    seamCol: 2,
    bridgeUvAt: (vertexIndex) => {
      if (vertexIndex === 8) {
        bridgeUvCalls += 1;
        return [0.42, 0.66];
      }
      return null;
    }
  });
  assert.ok(mesh, "child unfold should succeed");
  // closed 网格顶点 = R*(C+1) = 10 + 1 passthrough = 11
  assert.equal(mesh.positions.length / 3, 11);
  assert.equal(mesh.uvs.length / 2, 11);
  // passthrough 顶点（新索引 10）用 bridgeUvAt override
  assert.ok(bridgeUvCalls >= 1);
  assert.equal(mesh.uvs[10 * 2], 0.42);
  assert.equal(mesh.uvs[10 * 2 + 1], 0.66);
  assert.deepEqual(Array.from(mesh.gridCols.slice(10)), [-1]);
  assert.equal(mesh.gridRows[10], -1);
  // 桥接三角形 [4,8,5] → 顶点 4（row1 col0 → pos 2 → 新 7）、8（passthrough → 10）、5（row1 col1 → 8）
  const bridgeFace = mesh.faces.find((f) => f.includes(10));
  assert.ok(bridgeFace, "bridge triangle remapped");
  assert.deepEqual([...bridgeFace].sort((a, b) => a - b), [7, 8, 10]);
  // seam（col2）双副本：quad(c1) 中 (0,2) 为终点 → 新索引 4（u=1）；quad(c2) 中为起点 → 新索引 0（u=0）
  assert.equal(mesh.uvs[0], 0);
  assert.equal(mesh.uvs[4 * 2], 1);
  assert.equal(mesh.uvs[1], 1); // v 根行 = 1
  assert.deepEqual(mesh.positions.slice(0, 3), mesh.positions.slice(4 * 3, 4 * 3 + 3));
  assert.equal(mesh.gridRows[4], 0);
  assert.equal(mesh.gridCols[4], 2);
  assert.equal(mesh.colors, null); // 源无 color 属性
  assert.equal(mesh.leafWeights, null); // 源无 leafWeights
}

// ---- 回退路径：缺 grid / 缺 quadFaces / 非矩形 grid / 未知 kind → null ----
{
  const noQuads = closedTorusGeometry(2, 2);
  delete noQuads.userData.quadFaces;
  assert.equal(unfoldHairMesh(noQuads, { kind: "closed" }), null);

  const noGrid = closedTorusGeometry(2, 2);
  delete noGrid.userData.gridRowIndices;
  assert.equal(unfoldHairMesh(noGrid, { kind: "closed" }), null);

  const emptyQuads = closedTorusGeometry(2, 2);
  emptyQuads.userData.quadFaces = [];
  assert.equal(unfoldHairMesh(emptyQuads, { kind: "closed" }), null);

  const ragged = closedTorusGeometry(2, 2);
  ragged.userData.gridColIndices = new Float32Array([0, 1, 0, 9]); // col 9 缺 2..8
  assert.equal(unfoldHairMesh(ragged, { kind: "closed" }), null);

  const unknown = closedTorusGeometry(2, 2);
  assert.equal(unfoldHairMesh(unknown, { kind: "nonsense" }), null);
}

console.log("uv-unfold tests passed");
