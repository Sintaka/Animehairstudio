// tests/uv-unfold.test.mjs — 纯 node 测试（不 import three）：
// 验证 modules/io/uv-unfold.js 的归一化矩形 UV 展开（gridDimensions /
// gridUvTable / gridUvAt / unfoldHairMesh）。运行：node tests/uv-unfold.test.mjs

import assert from "node:assert/strict";
import {
  gridDimensions,
  gridUvTable,
  gridUvAt,
  unfoldHairMesh
} from "../modules/io/uv-unfold.js";

// Float32 位置精度：弧长比值会有 ~1e-9 抖动，容差取 1e-6。
const EPS = 1e-6;

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

// 非等距闭合环：每列 row0 顶点由 row0Points（[x, y]）给出（行 r 的 z = r），
// 环向边宽按欧氏距离。cols 必须 = row0Points.length。
function closedArcGeometry(rows, row0Points) {
  const cols = row0Points.length;
  const positions = [];
  const normals = [];
  const uvs = [];
  const gridRowIndices = new Float32Array(rows * cols);
  const gridColIndices = new Float32Array(rows * cols);
  const leafWeights = new Float32Array(rows * cols * 3);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c;
      positions.push(row0Points[c][0], row0Points[c][1], r);
      normals.push(0, 0, 1);
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
      quadFaces.push([
        row * cols + col,
        (row + 1) * cols + col,
        (row + 1) * cols + next,
        row * cols + next
      ]);
    }
  }
  return {
    userData: { gridRowIndices, gridColIndices, quadFaces, leafWeights },
    getAttribute: (name) => ({
      position: makeAttr(positions, 3),
      normal: makeAttr(normals, 3),
      uv: makeAttr(uvs, 2)
    }[name])
  };
}

// 非等距闭合环（周长 10）：边宽 1/2/3/4。c0=(0,0)、c1=(1,0)、c2=(3,0)、
// c3=(8/3, √80/3)——w(2,3)=3、w(3,0)=4。
const ARC10_POINTS = [[0, 0], [1, 0], [3, 0], [8 / 3, Math.sqrt(80) / 3]];

// ---- gridDimensions / gridUvTable / gridUvAt ----
{
  const rows = new Float32Array([0, 0, 1, 1, 2, 2]);
  const cols = new Float32Array([0, 1, 0, 1, 0, 1]);
  assert.deepEqual(gridDimensions(rows, cols), { rows: 3, cols: 2 });
  assert.deepEqual(gridDimensions(null, null), { rows: 0, cols: 0 });
  assert.deepEqual(gridDimensions(new Float32Array(0), new Float32Array(0)), { rows: 0, cols: 0 });
  assert.deepEqual(gridDimensions(new Float32Array([-1, -1]), new Float32Array([-1, -1])), { rows: 0, cols: 0 });
}
{
  // 弧长表：seam=0，边宽 1/2/3/4 → 周长 10；u = 累计弧长/周长
  const geometry = closedArcGeometry(2, ARC10_POINTS);
  const table = gridUvTable(geometry, "closed", 0);
  assert.ok(table, "closed arc table");
  assert.ok(Math.abs(table.circumference - 10) < 1e-6, `circumference ${table.circumference}`);
  assert.equal(table.rows, 2);
  assert.ok(Math.abs(table.colU.get(0) - 0) < EPS);
  assert.ok(Math.abs(table.colU.get(1) - 1 / 10) < EPS);
  assert.ok(Math.abs(table.colU.get(2) - 3 / 10) < EPS);
  assert.ok(Math.abs(table.colU.get(3) - 6 / 10) < EPS);
  // referenceCircumference 作分母：u = 累计弧长/ref
  const scaled = gridUvTable(geometry, "closed", 0, 20);
  assert.ok(Math.abs(scaled.colU.get(1) - 1 / 20) < EPS);
  assert.ok(Math.abs(scaled.colU.get(3) - 6 / 20) < EPS);
  assert.equal(scaled.circumference, table.circumference); // 周长本身不变
  // gridUvAt：u 按表、v = 1 - row/(rows-1)（根=1、尖=0）
  const rowsArr = geometry.userData.gridRowIndices;
  const colsArr = geometry.userData.gridColIndices;
  const uvAt = (vi) => gridUvAt(table, rowsArr, colsArr, vi);
  const uvClose = (a, b) => a != null && Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
  assert.ok(uvClose(uvAt(0), [0, 1]), "uvAt (0,0)");     // (0,0)
  assert.ok(uvClose(uvAt(1), [0.1, 1]), "uvAt (0,1)");   // (0,1)
  assert.ok(uvClose(uvAt(7), [0.6, 0]), "uvAt (1,3)");   // (1,3)
  assert.equal(gridUvAt(table, rowsArr, colsArr, 99), null); // 越界
  assert.equal(gridUvAt(table, null, null, 0), null);
  // 其它 kind → null（不展开/不查）
  assert.equal(gridUvTable(geometry, "open", 0), null);
  assert.equal(gridUvTable(geometry, "compound", 0), null);
  assert.equal(gridUvTable(geometry, "nonsense", 0), null);
  // row-0 某列缺 → null
  const broken = closedArcGeometry(2, ARC10_POINTS);
  broken.userData.gridColIndices[1] = 9; // row0 col1 缺失
  assert.equal(gridUvTable(broken, "closed", 0), null);
}
{
  // rows<2 → v=0.5 兜底
  const geometry = closedArcGeometry(1, [[0, 0], [1, 0]]);
  const table = gridUvTable(geometry, "closed", 0);
  assert.equal(table.rows, 1);
  assert.deepEqual(gridUvAt(table, geometry.userData.gridRowIndices, geometry.userData.gridColIndices, 0), [0, 0.5]);
}

// ---- closed：4×4 → 非等距 2×4 闭合环，弧长 u、单边切缝、wrap quad 丢弃 ----
{
  const R = 2;
  const C = 4;
  const geometry = closedArcGeometry(R, ARC10_POINTS);
  const mesh = unfoldHairMesh(geometry, { kind: "closed", seamCol: 0 });
  assert.ok(mesh, "closed unfold should succeed");
  // 每行 C 个新顶点（无 seam 副本）
  assert.equal(mesh.positions.length / 3, R * C);
  assert.equal(mesh.uvs.length / 2, R * C);
  assert.equal(mesh.faces.length, (R - 1) * (C - 1)); // wrap quad 丢弃
  assert.equal(mesh.normals.length, R * C * 3);
  assert.equal(mesh.tangents, null); // 源无 tangent 属性
  // row0 u 按弧长：0、1/10、3/10、6/10（非等距）
  assert.ok(Math.abs(mesh.uvs[0] - 0) < EPS);
  assert.ok(Math.abs(mesh.uvs[2] - 1 / 10) < EPS);
  assert.ok(Math.abs(mesh.uvs[4] - 3 / 10) < EPS);
  assert.ok(Math.abs(mesh.uvs[6] - 6 / 10) < EPS);
  // row1 同 u
  assert.ok(Math.abs(mesh.uvs[8] - 0) < EPS);
  assert.ok(Math.abs(mesh.uvs[10] - 1 / 10) < EPS);
  assert.ok(Math.abs(mesh.uvs[12] - 3 / 10) < EPS);
  assert.ok(Math.abs(mesh.uvs[14] - 6 / 10) < EPS);
  // v 根=1 尖=0
  for (let pos = 0; pos < C; pos += 1) {
    assert.equal(mesh.uvs[pos * 2 + 1], 1, "root row v=1");
    assert.equal(mesh.uvs[(R - 1) * C * 2 + pos * 2 + 1], 0, "tip row v=0");
  }
  // seam 列（col0）u=0 只出现一次/行；无 u=1 副本
  assert.equal(mesh.uvs[0], 0);
  assert.ok(mesh.uvs[2] > 0 && mesh.uvs[4] > 0 && mesh.uvs[6] > 0, "no other u=0 in row0");
  for (let i = 0; i < mesh.uvs.length; i += 2) {
    assert.ok(mesh.uvs[i] >= 0 && mesh.uvs[i] < 1, `u in [0,1): ${mesh.uvs[i]}`);
    assert.ok(mesh.uvs[i + 1] >= 0 && mesh.uvs[i + 1] <= 1, `v range: ${mesh.uvs[i + 1]}`);
  }
  // 单边映射：pos = (col - seamCol + C) % C；grid 属性无副本
  assert.deepEqual(Array.from(mesh.gridCols.slice(0, C)), [0, 1, 2, 3]);
  assert.deepEqual(Array.from(mesh.gridRows.slice(0, C)), [0, 0, 0, 0]);
  // 保留的 face 恰为 cols (0,1)/(1,2)/(2,3)；跨切缝 (3,0) 的 wrap quad 丢弃
  const expectedFaces = [
    [0, 4, 5, 1],
    [1, 5, 6, 2],
    [2, 6, 7, 3]
  ];
  assert.deepEqual(mesh.faces.map((f) => [...f]), expectedFaces);
  // faces 索引有效
  const newVertexCount = mesh.positions.length / 3;
  for (const face of mesh.faces) {
    for (const index of face) {
      assert.ok(Number.isInteger(index) && index >= 0 && index < newVertexCount, `face index ${index}`);
    }
  }
  // leafWeights 按映射复制：长度 = 新顶点数*3（无 seam 副本）
  assert.equal(mesh.leafWeights.length, R * C * 3);
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

// ---- split：2 管 × (3 个 fused col + 1 个 col=-1 clip seam 点)，弧长 u、共享周长 ----
// 几何布局：每管 ringSize_g 个环顶点/行（local col 0 = clip seam 点，gridCol=-1；
// local col 1..ringSize-1 = fused col）。splitSections 描述每管 base/ringSize。
// 管 0 边宽 1/1/1/3（sum 6）；管 1 边宽 2/2/2/6（sum 12）→ 共享 circumference=18。
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
  const scale = [1, 2]; // 管 0 边宽 1，管 1 边宽 2
  for (let s = 0; s < 2; s += 1) {
    const ringSize = s === 0 ? ringSize0 : ringSize1;
    for (let r = 0; r < R; r += 1) {
      for (let k = 0; k < ringSize; k += 1) {
        positions.push(r, k * scale[s], s);
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
  // 弧长表：两管共享 circumference = 6 + 12 = 18
  const table = gridUvTable(geometry, "split", -1);
  assert.ok(table, "split arc table");
  assert.ok(Math.abs(table.circumference - 18) < 1e-6, `circumference ${table.circumference}`);
  assert.equal(table.rows, R);
  assert.ok(Math.abs(table.colU.get(0) - 1 / 18) < EPS);
  assert.ok(Math.abs(table.colU.get(1) - 2 / 18) < EPS);
  assert.ok(Math.abs(table.colU.get(2) - 3 / 18) < EPS);
  assert.ok(Math.abs(table.colU.get(3) - 2 / 18) < EPS); // 管 1 首 fused col 也用 18 分母
  assert.ok(Math.abs(table.colU.get(4) - 4 / 18) < EPS);
  assert.ok(Math.abs(table.colU.get(5) - 6 / 18) < EPS);
  // 展开：每行 = ringSize0+ringSize1 = 8 个新顶点（无 seam 副本槽）
  const mesh = unfoldHairMesh(geometry, { kind: "split" });
  assert.ok(mesh, "split unfold should succeed");
  assert.equal(mesh.positions.length / 3, R * 8);
  assert.equal(mesh.uvs.length / 2, R * 8);
  // 每管 (R-1)*ringSize quads 中 wrap quad 丢弃 1 个 → 3/管 → 共 6
  assert.equal(mesh.faces.length, (R - 1) * 4 * 2 - 2);
  // 管 0（行内基 0）：pos0 = clip seam u=0、pos1..3 = fused col 弧长 u
  assert.equal(mesh.uvs[0], 0);      // seam u=0
  assert.equal(mesh.uvs[1], 1);      // row0 v=1
  assert.ok(Math.abs(mesh.uvs[2] - 1 / 18) < EPS);
  assert.ok(Math.abs(mesh.uvs[4] - 2 / 18) < EPS);
  assert.ok(Math.abs(mesh.uvs[6] - 3 / 18) < EPS);
  // 管 1（行内基 4）：pos4 = seam u=0、pos5..7 = fused col 弧长 u（共享 18 分母）
  assert.equal(mesh.uvs[4 * 2], 0);
  assert.ok(Math.abs(mesh.uvs[5 * 2] - 2 / 18) < EPS);
  assert.ok(Math.abs(mesh.uvs[6 * 2] - 4 / 18) < EPS);
  assert.ok(Math.abs(mesh.uvs[7 * 2] - 6 / 18) < EPS);
  // seam 单边：无 u=1；所有 u 在 [0,1)
  for (let i = 0; i < mesh.uvs.length; i += 2) {
    assert.ok(mesh.uvs[i] >= 0 && mesh.uvs[i] < 1, `u in [0,1): ${mesh.uvs[i]}`);
    assert.ok(mesh.uvs[i + 1] === 0 || mesh.uvs[i + 1] === 1, `v grid ${mesh.uvs[i + 1]}`);
  }
  // grid 属性：seam 点 row=r、col=-1；fused col 保持原 col
  assert.deepEqual(Array.from(mesh.gridCols.slice(0, 8)), [-1, 0, 1, 2, -1, 3, 4, 5]);
  assert.deepEqual(Array.from(mesh.gridRows.slice(0, 8)), [0, 0, 0, 0, 0, 0, 0, 0]);
  // row1 v=0
  assert.equal(mesh.uvs[8 * 2 + 1], 0);
  // wrap quad 丢弃：保留 face 恰为每管 k=0..2 的 quad（不含 seam↔管尾 fused col）
  const expectedFaces = [
    [0, 8, 9, 1],
    [1, 9, 10, 2],
    [2, 10, 11, 3],
    [4, 12, 13, 5],
    [5, 13, 14, 6],
    [6, 14, 15, 7]
  ];
  assert.deepEqual(mesh.faces.map((f) => [...f]), expectedFaces);
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

// ---- child：主发片尺度 U（ref = 主发片周长）、桥接 wrap quad 丢弃、中线单副本 ----
// 子发片：3×4 闭合环（正方形，周长 4）+ 3 个桥接 -1 顶点（b0 中线 ring=seamCol、
// b1 右侧、b2 左侧）。主发片：2×4 闭合环（周长 10）。
// child ref=10 → 子 u 范围 = 4/10 = [0, 0.4)。
{
  const R = 3;
  const C = 4;
  const seamCol = 2; // 子发片切缝列（背面中线）
  const childVStart = 0.6;
  const childVLength = 0.4;

  // ---- 子发片几何：环（正方形）+ 桥接顶点 ----
  const childPositions = [];
  const childNormals = [];
  const childUvs = [];
  const childRowIndices = [];
  const childColIndices = [];
  const ringXY = [[0, 0], [1, 0], [1, 1], [0, 1]]; // 边宽 1/1/1/1 → 周长 4
  for (let r = 0; r < R; r += 1) {
    for (let c = 0; c < C; c += 1) {
      childPositions.push(ringXY[c][0], ringXY[c][1], r);
      childNormals.push(0, 0, 1);
      childUvs.push(0.5, 0.5);
      childRowIndices.push(r);
      childColIndices.push(c);
    }
  }
  // 桥接顶点（col=-1）：12 = b0 中线（ring===seamCol）、13 = b1 右侧、14 = b2 左侧、
  // 15 = b3 纯洞侧（ring=-1，sideHoleVertex 型，t=1）
  childPositions.push(5, 0, 1); childNormals.push(0, 0, 1); childUvs.push(0.1, 0.2); childRowIndices.push(-1); childColIndices.push(-1);
  childPositions.push(5, 1, 1); childNormals.push(0, 0, 1); childUvs.push(0.3, 0.4); childRowIndices.push(-1); childColIndices.push(-1);
  childPositions.push(5, 2, 1); childNormals.push(0, 0, 1); childUvs.push(0.5, 0.6); childRowIndices.push(-1); childColIndices.push(-1);
  childPositions.push(5, 3, 1); childNormals.push(0, 0, 1); childUvs.push(0.5, 0); childRowIndices.push(-1); childColIndices.push(-1);
  const anchors = [
    null, null, null, null, null, null, null, null, null, null, null, null,
    { ring: seamCol, hole: 3, t: 0.5 }, // b0：中线 → u_ring=0
    { ring: 3, hole: 2, t: 0.5 },       // b1：ring3（切缝右侧相邻）
    { ring: 1, hole: 6, t: 0.5 },       // b2：ring1（切缝左侧相邻）
    { ring: -1, hole: 3, t: 1 }         // b3：无环侧锚点（纯洞侧，t=1 → u=洞 u）
  ];
  const childQuads = [];
  for (let r = 0; r < R - 1; r += 1) {
    for (let c = 0; c < C; c += 1) {
      const next = (c + 1) % C;
      childQuads.push([r * C + c, (r + 1) * C + c, (r + 1) * C + next, r * C + next]);
    }
  }
  childQuads.push([10, 11, 13, 12]); // 桥接 quad（ring2/3 右侧）→ 保留
  childQuads.push([9, 10, 12, 14]);  // 桥接 quad（ring1/2 跨切缝）→ 丢弃
  const childGeometry = {
    userData: {
      gridRowIndices: new Float32Array(childRowIndices),
      gridColIndices: new Float32Array(childColIndices),
      quadFaces: childQuads,
      ringWidthSegments: 4
    },
    getAttribute: (name) => ({
      position: makeAttr(childPositions, 3),
      normal: makeAttr(childNormals, 3),
      uv: makeAttr(childUvs, 2)
    })[name]
  };

  // ---- 主发片几何：2×4 闭合环（周长 10）----
  const parentGeometry = closedArcGeometry(2, ARC10_POINTS);
  const parentTable = gridUvTable(parentGeometry, "closed", 0);
  assert.ok(parentTable, "parent arc table");
  assert.ok(Math.abs(parentTable.circumference - 10) < 1e-6);
  const parentRows = parentGeometry.userData.gridRowIndices;
  const parentCols = parentGeometry.userData.gridColIndices;

  // ---- 子发片表：ref = 主发片周长 → u = 累计弧长/10 ----
  const childTable = gridUvTable(childGeometry, "child", seamCol, parentTable.circumference);
  assert.ok(childTable, "child scaled table");
  assert.ok(Math.abs(childTable.circumference - 4) < 1e-6);
  assert.ok(Math.abs(childTable.colU.get(seamCol) - 0) < EPS);
  assert.ok(Math.abs(childTable.colU.get(3) - 1 / 10) < EPS);
  assert.ok(Math.abs(childTable.colU.get(0) - 2 / 10) < EPS);
  assert.ok(Math.abs(childTable.colU.get(1) - 3 / 10) < EPS);
  // 自身周长表（无 ref）：独立归一 [0,1]
  const ownTable = gridUvTable(childGeometry, "child", seamCol);
  assert.ok(Math.abs(ownTable.colU.get(1) - 3 / 4) < EPS);

  const bridgeUvAt = (vertexIndex) => {
    const anchor = anchors[vertexIndex];
    if (!anchor) return null;
    const t = Math.min(1, Math.max(0, Number(anchor.t ?? 1)));
    let holeU = 0;
    let holeV = childVStart;
    if (anchor.hole >= 0) {
      const holeUv = gridUvAt(parentTable, parentRows, parentCols, anchor.hole);
      if (holeUv) { holeU = holeUv[0]; holeV = holeUv[1]; }
      else {
        const parentRow = Number(parentRows[anchor.hole]);
        if (Number.isFinite(parentRow) && parentRow >= 0) {
          holeV = parentTable.rows < 2 ? 0.5 : 1 - parentRow / (parentTable.rows - 1);
        }
      }
    }
    let ringU = 0;
    if (anchor.ring >= 0 && anchor.ring !== seamCol && childTable.colU.has(anchor.ring)) {
      ringU = childTable.colU.get(anchor.ring);
    } else if (anchor.ring !== seamCol) {
      ringU = holeU; // 无环侧锚点（ring=-1，t=1）：直接用洞 u
    }
    return [ringU + (holeU - ringU) * t, childVStart + (holeV - childVStart) * t];
  };
  const mesh = unfoldHairMesh(childGeometry, {
    kind: "child",
    seamCol,
    childVStart,
    childVLength,
    referenceCircumference: parentTable.circumference,
    bridgeUvAt
  });
  assert.ok(mesh, "child unfold should succeed");
  // 网格顶点 R*C = 12 + 4 个桥接单副本 = 16（中线不再双副本）
  assert.equal(mesh.positions.length / 3, R * C + 4);
  assert.equal(mesh.uvs.length / 2, R * C + 4);
  // faces：环 3+3（每带 4 quad 丢 wrap 1）+ 桥接保留 1 = 7
  assert.equal(mesh.faces.length, (R - 1) * (C - 1) + 1);
  // 环 u 按主发片尺度：row0 pos0..3 = col2,3,0,1 → u = 0, 1/10, 2/10, 3/10
  assert.ok(Math.abs(mesh.uvs[0] - 0) < EPS);
  assert.ok(Math.abs(mesh.uvs[2] - 1 / 10) < EPS);
  assert.ok(Math.abs(mesh.uvs[4] - 2 / 10) < EPS);
  assert.ok(Math.abs(mesh.uvs[6] - 3 / 10) < EPS);
  // 子 u 范围 = 子周长/主周长 = 0.4：扫掠环顶点 u < 0.4（桥接顶点为环↔洞插值，可到 parent 尺度）
  for (let i = 0; i < R * C; i += 1) {
    assert.ok(mesh.uvs[i * 2] >= 0 && mesh.uvs[i * 2] < 0.4 + 1e-9, `child ring u in [0, 0.4): ${mesh.uvs[i * 2]}`);
  }
  // 环 v = childVStart - row/(R-1)*childVLength
  assert.ok(Math.abs(mesh.uvs[1] - childVStart) < EPS);
  assert.ok(Math.abs(mesh.uvs[(C) * 2 + 1] - (childVStart - (1 / (R - 1)) * childVLength)) < EPS);
  assert.ok(Math.abs(mesh.uvs[2 * C * 2 + 1] - (childVStart - childVLength)) < EPS);
  // 桥接顶点：b0 中线单副本 u_ring=0 → u = 0+(0.6-0)*0.5 = 0.3；v 用 childVStart 插值
  assert.ok(Math.abs(mesh.uvs[12 * 2] - 0.3) < EPS);
  assert.ok(Math.abs(mesh.uvs[12 * 2 + 1] - (childVStart + (1 - childVStart) * 0.5)) < EPS);
  // b1（ring3 → u_ring=1/10，hole=(0,2) u=3/10）：u = 0.1+(0.3-0.1)*0.5 = 0.2
  assert.ok(Math.abs(mesh.uvs[13 * 2] - 0.2) < EPS);
  assert.ok(Math.abs(mesh.uvs[13 * 2 + 1] - (childVStart + (1 - childVStart) * 0.5)) < EPS);
  // b2（ring1 → u_ring=3/10，hole=(1,2) u=3/10 v=0）：u=0.3、v=childVStart*0.5
  assert.ok(Math.abs(mesh.uvs[14 * 2] - 0.3) < EPS);
  assert.ok(Math.abs(mesh.uvs[14 * 2 + 1] - childVStart * 0.5) < EPS);
  // b3（ring=-1 纯洞侧，hole=(0,3) u=0.6 v=1，t=1）：u=洞 u、v=1（不退回原 uv 0.5,0）
  assert.ok(Math.abs(mesh.uvs[15 * 2] - 0.6) < EPS);
  assert.ok(Math.abs(mesh.uvs[15 * 2 + 1] - 1) < EPS);
  // 桥接 wrap quad 丢弃：保留 face 不含 b0/b2 同现（丢弃 face 原为 [9,10,12,14]）
  for (const face of mesh.faces) {
    assert.ok(!(face.includes(12) && face.includes(14)), "bridge wrap quad dropped");
  }
  // 保留的桥接 quad [10,11,13,12] → [8,9,13,12]
  const bridgeFace = mesh.faces.find((f) => f.includes(12));
  assert.ok(bridgeFace, "kept bridge quad");
  assert.deepEqual([...bridgeFace], [8, 9, 13, 12]);
  // seam 列单边：row0 恰一个 u=0；grid 属性无副本（行内从 seamCol 起排）
  assert.equal(mesh.uvs[0], 0);
  assert.ok(mesh.uvs[2] > 0 && mesh.uvs[4] > 0 && mesh.uvs[6] > 0, "seam u=0 once in row0");
  assert.deepEqual(Array.from(mesh.gridCols.slice(0, C)), [2, 3, 0, 1]);
  assert.equal(mesh.gridRows[12], -1);
  assert.equal(mesh.colors, null); // 源无 color 属性
  assert.equal(mesh.leafWeights, null); // 源无 leafWeights
  // faces 索引有效
  for (const face of mesh.faces) {
    for (const index of face) assert.ok(index >= 0 && index < 16, `child face index ${index}`);
  }
}

// ---- 回退路径：缺 grid / 缺 quadFaces / 非矩形 grid / 未知 kind / 弧长表缺失 → null ----
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

  // row-0 某列缺 → 弧长表缺失 → 回退原几何
  const missingRow0 = closedArcGeometry(2, ARC10_POINTS);
  missingRow0.userData.gridColIndices[1] = 9;
  assert.equal(unfoldHairMesh(missingRow0, { kind: "closed", seamCol: 0 }), null);
}

console.log("uv-unfold tests passed");
