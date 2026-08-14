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

// ---- split：2 管 × (3 个 fused col + 1 个 col=-1 clip seam 点)，各管独立 seam ----
// 几何布局：每管 ringSize_g 个环顶点/行（local col 0 = clip seam 点，gridCol=-1；
// local col 1..ringSize-1 = fused col）。splitSections 描述每管 base/ringSize。
{
  const R = 2;
  const ringSize0 = 4; // tube 0：seam + 3 个 fused col
  const ringSize1 = 4; // tube 1：seam + 3 个 fused col
  const base0 = 0;
  const base1 = R * ringSize0;
  // fused grid：tube0 → fused col 0..2（local col 1..3）；tube1 → fused col 3..5
  const colToSection = [
    { section: 0, col: 1 }, { section: 0, col: 2 }, { section: 0, col: 3 },
    { section: 1, col: 1 }, { section: 1, col: 2 }, { section: 1, col: 3 }
  ];
  const splitSections = [
    { base: base0, ringSize: ringSize0, faceBase: 0 },
    { base: base1, ringSize: ringSize1, faceBase: 6 }
  ];
  const positions = [];
  const uvs = [];
  const normals = [];
  const gridRowIndices = [];
  const gridColIndices = [];
  const fusedColOf = (section, localCol) => {
    for (let f = 0; f < colToSection.length; f += 1) {
      if (colToSection[f].section === section && colToSection[f].col === localCol) return f;
    }
    return -1;
  };
  const indexAt = (section, r, localCol) => splitSections[section].base + r * splitSections[section].ringSize + localCol;
  for (let s = 0; s < 2; s += 1) {
    const ringSize = s === 0 ? ringSize0 : ringSize1;
    for (let r = 0; r < R; r += 1) {
      for (let k = 0; k < ringSize; k += 1) {
        positions.push(r, k, s);
        normals.push(0, 0, 1);
        uvs.push(0.11, 0.22); // 原 uv（展开后不应混入）
        gridRowIndices.push(r);
        gridColIndices.push(k === 0 ? -1 : fusedColOf(s, k));
      }
    }
  }
  const quadFaces = [];
  const pushRingQuads = (section) => {
    const ringSize = splitSections[section].ringSize;
    for (let r = 0; r < R - 1; r += 1) {
      for (let k = 0; k < ringSize; k += 1) {
        const next = (k + 1) % ringSize;
        quadFaces.push([
          indexAt(section, r, k),
          indexAt(section, r + 1, k),
          indexAt(section, r + 1, next),
          indexAt(section, r, next)
        ]);
      }
    }
  };
  pushRingQuads(0);
  pushRingQuads(1);
  const geometry = {
    userData: {
      gridRowIndices: new Float32Array(gridRowIndices),
      gridColIndices: new Float32Array(gridColIndices),
      quadFaces,
      splitFusedGrid: { colToSection },
      splitSections
    },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      uv: makeAttr(uvs, 2)
    }[name])
  };
  const mesh = unfoldHairMesh(geometry, { kind: "split" });
  assert.ok(mesh, "split unfold should succeed");
  // 每行 = (ringSize0+1)+(ringSize1+1) = 10 个新顶点，共 R*10 = 20；无 passthrough
  assert.equal(mesh.positions.length / 3, R * 10);
  assert.equal(mesh.uvs.length / 2, R * 10);
  assert.equal(mesh.faces.length, (R - 1) * 4 * 2); // 每管 4 quads × 2 管
  // 管 0（行内基 0，Cg=3，列数 Cg+1=4）：pos0 = clip seam u=0、pos1..3 = fused col
  // u=1/4,2/4,3/4、pos4 = clip seam 副本 u=1；row0 v=1
  assert.equal(mesh.uvs[0], 0);      // seam u=0
  assert.equal(mesh.uvs[1], 1);      // row0 v=1
  assert.equal(mesh.uvs[2], 1 / 4);
  assert.equal(mesh.uvs[4], 2 / 4);
  assert.equal(mesh.uvs[6], 3 / 4);  // 第 3 个 fused col u=3/4
  assert.equal(mesh.uvs[8], 1);      // seam 副本 u=1
  assert.equal(mesh.uvs[9], 1);      // row0 v=1
  // seam 双副本位置同源（pos0 与 pos4 都来自 clip seam 顶点）
  assert.deepEqual(mesh.positions.slice(0, 3), mesh.positions.slice(4 * 3, 4 * 3 + 3));
  // grid 属性：seam 副本 row=r、col=-1；fused col 保持原 col
  assert.deepEqual(Array.from(mesh.gridCols.slice(0, 5)), [-1, 0, 1, 2, -1]);
  assert.deepEqual(Array.from(mesh.gridRows.slice(0, 5)), [0, 0, 0, 0, 0]);
  // 管 1（行内基 = ringSize0+1 = 5，Cg=3）：pos 5 = seam u=0、pos 9 = seam 副本 u=1
  assert.equal(mesh.uvs[5 * 2], 0);
  assert.equal(mesh.uvs[9 * 2], 1);
  // 无 passthrough 原 uv 混入：所有 uv 都是矩形 uv（v ∈ {0,1}；u 无 0.11 原值）
  for (let i = 0; i < mesh.uvs.length; i += 2) {
    assert.ok(mesh.uvs[i] >= 0 && mesh.uvs[i] <= 1, `u range ${mesh.uvs[i]}`);
    assert.ok(mesh.uvs[i + 1] === 0 || mesh.uvs[i + 1] === 1, `v grid ${mesh.uvs[i + 1]}`);
  }
  // row1 v=0
  assert.equal(mesh.uvs[10 * 2 + 1], 0);
  // 每 face 顶点落在合法索引范围
  for (const face of mesh.faces) {
    for (const index of face) assert.ok(index >= 0 && index < R * 10, `split face index ${index}`);
  }
  // 跨 seam quad（local col 3 → local col 0 wrap）：fused col3 走 pos3（u=3/4），
  // clip seam 点因 cx 管内序号 = Cg-1 → pos Cg+1（u=1）——wrap 段宽 1/(Cg+1)=1/4
  const wrapFace = mesh.faces.find((face) => face.includes(3) && face.includes(4));
  assert.ok(wrapFace, "split wrap quad remapped");
  for (const index of wrapFace) {
    const u = mesh.uvs[index * 2];
    assert.ok(u === 3 / 4 || u === 1, `wrap u in {3/4, 1} got ${u}`);
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

// ---- child 桥接中线切开：中线锚点双副本（copyCount=2），左右 quad 各引用一侧 ----
// 中线顶点（anchor.ring === seamCol）复制双副本：side 0 → u_ring=0（右侧 quad）、
// side 1 → u_ring=1（左侧 quad）；非中线桥接顶点单副本，u_ring = 环展开 u。
// 环向 V 按 childVStart - row/(R-1)*childVLength 归一；桥接 v 用 childVStart 插值。
{
  const R = 3;
  const C = 6;
  const seamCol = 3; // bridgeSeamCol（背面中线）
  const childVStart = 0.7;
  const childVLength = 0.5;
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
  // 桥接顶点（col=-1）：v18 中线（ring===seamCol，双副本）、v19 左侧、v20 右侧
  positions.push(9, 1, 1); normals.push(0, 0, 1); uvs.push(0.111, 0.222); gridRowIndices.push(-1); gridColIndices.push(-1);
  positions.push(9, 2, 1); normals.push(0, 0, 1); uvs.push(0.333, 0.444); gridRowIndices.push(-1); gridColIndices.push(-1);
  positions.push(9, 3, 1); normals.push(0, 0, 1); uvs.push(0.555, 0.666); gridRowIndices.push(-1); gridColIndices.push(-1);
  const anchors = [
    null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    { ring: seamCol, hole: 40, t: 0.5 }, // v18 中线
    { ring: 2, hole: 41, t: 0.5 },       // v19 左侧
    { ring: 4, hole: 42, t: 0.5 }        // v20 右侧
  ];
  const quadFaces = [];
  for (let r = 0; r < R - 1; r += 1) {
    for (let c = 0; c < C; c += 1) {
      const next = (c + 1) % C;
      quadFaces.push([r * C + c, (r + 1) * C + c, (r + 1) * C + next, r * C + next]);
    }
  }
  // 桥接三角：L = 左 quad（环顶点 col2 < seamCol）→ 中线 v18 用 side 1（u_ring=1）；
  // R = 右 quad（环顶点 col4 > seamCol）→ v18 用 side 0（u_ring=0）
  quadFaces.push([2 * C + 2, 19, 18]); // [14, v19, v18]
  quadFaces.push([18, 20, 2 * C + 4]); // [v18, v20, 16]
  const holeUv = { 40: [0.3, 0.9], 41: [0.4, 0.9], 42: [0.2, 0.9] };
  const geometry = {
    userData: {
      gridRowIndices: new Float32Array(gridRowIndices),
      gridColIndices: new Float32Array(gridColIndices),
      quadFaces,
      ringWidthSegments: 4,
      bridgeSeamCol: seamCol,
      bridgeUvAnchors: anchors
    },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      uv: makeAttr(uvs, 2)
    })[name]
  };
  const bridgeUvAt = (vertexIndex, side = 0) => {
    const anchor = anchors[vertexIndex];
    if (!anchor) return null;
    const h = holeUv[anchor.hole];
    if (!h) return null;
    const t = anchor.t;
    const ringU = anchor.ring === seamCol
      ? (side === 1 ? 1 : 0)
      : ((anchor.ring - seamCol) % C + C) % C / C;
    return [ringU + (h[0] - ringU) * t, childVStart + (h[1] - childVStart) * t];
  };
  const passthroughCopyCount = (vertexIndex) => {
    const anchor = anchors[vertexIndex];
    return anchor && anchor.ring === seamCol ? 2 : 1;
  };
  const passthroughSide = (vertexIndex, face) => {
    const anchor = anchors[vertexIndex];
    if (!anchor || anchor.ring !== seamCol) return 0;
    let cx = -1;
    for (const fx of face) {
      const fCol = Number(gridColIndices[fx]);
      if (Number.isFinite(fCol) && fCol >= 0) {
        if (fCol !== seamCol) { cx = fCol; break; }
      } else {
        const fAnchor = anchors[fx];
        if (fAnchor && fAnchor.ring >= 0 && fAnchor.ring !== seamCol) { cx = fAnchor.ring; break; }
      }
    }
    if (cx < 0) return 0;
    return cx < seamCol ? 1 : 0;
  };
  const mesh = unfoldHairMesh(geometry, {
    kind: "child",
    seamCol,
    childVStart,
    childVLength,
    bridgeUvAt,
    passthroughCopyCount,
    passthroughSide
  });
  assert.ok(mesh, "child bridge unfold should succeed");
  // 网格顶点 R*(C+1) = 21；passthrough：v18×2 + v19 + v20 = 4 → 25
  assert.equal(mesh.positions.length / 3, R * (C + 1) + 4);
  assert.equal(mesh.uvs.length / 2, R * (C + 1) + 4);
  // v18 双副本：side0 u_ring=0 → u = 0 + (0.3-0)*0.5 = 0.15；side1 u_ring=1 → u = 0.65；
  // v 都用 childVStart 插值：0.7 + (0.9-0.7)*0.5 = 0.8（原 uv 0.111/0.222 未混入）
  assert.ok(Math.abs(mesh.uvs[21 * 2] - 0.15) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[21 * 2 + 1] - 0.8) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[22 * 2] - 0.65) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[22 * 2 + 1] - 0.8) < 1e-9);
  // 单副本桥接顶点：v19（ring2）u_ring = 5/6；v20（ring4）u_ring = 1/6
  assert.ok(Math.abs(mesh.uvs[23 * 2] - (5 / 6 + (0.4 - 5 / 6) * 0.5)) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[24 * 2] - (1 / 6 + (0.2 - 1 / 6) * 0.5)) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[23 * 2 + 1] - 0.8) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[24 * 2 + 1] - 0.8) < 1e-9);
  // 环顶点 v = childVStart - row/(R-1)*childVLength：row0=0.7、row1=0.45、row2=0.2
  assert.ok(Math.abs(mesh.uvs[1] - childVStart) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[(C + 1) * 2 + 1] - (childVStart - (1 / (R - 1)) * childVLength)) < 1e-9);
  assert.ok(Math.abs(mesh.uvs[2 * (C + 1) * 2 + 1] - (childVStart - childVLength)) < 1e-9);
  // 环 seam（col3）双副本：pos0（u=0）与 posC（u=1）
  assert.equal(mesh.uvs[0], 0);
  assert.equal(mesh.uvs[C * 2], 1);
  // 左右 quad 各自引用正确副本：左 quad 用 side1（u=0.65）、右 quad 用 side0（u=0.15）
  const leftFace = mesh.faces.find((f) => f.includes(22));
  const rightFace = mesh.faces.find((f) => f.includes(21) && !f.includes(22));
  assert.ok(leftFace, "left quad references side 1 copy");
  assert.ok(rightFace, "right quad references side 0 copy");
  assert.ok(leftFace.includes(22) && !leftFace.includes(21), "left quad uses side 1 copy only");
  assert.ok(rightFace.includes(21) && !rightFace.includes(22), "right quad uses side 0 copy only");
  for (const face of mesh.faces) {
    for (const index of face) assert.ok(index >= 0 && index < 25, `child face index ${index}`);
  }
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
