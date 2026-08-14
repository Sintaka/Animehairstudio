// uv-unfold.js — 导出时把扫掠网格 UV 切成归一化矩形（每根发丝独立 0-1 tile）。
//
// 约定：
//   - V 负方向 = 发丝切线方向：根（row=0）→ V=1，尖（row=R-1）→ V=0。
//     tangent 与 V 负方向对齐，DCC 中头发竖直向下打直。
//   - U 沿列：闭合环（closed/split/child）的切缝只保留一边——切缝列不复制成
//     u=0/u=1 双副本，环从切缝列开始按列排列方向线性往前排，跨切缝的 wrap quad
//     丢弃（管子沿切缝开口）；开放网格（open/compound）不复制，u = col/(C-1)
//     （C==1 时 u=0.5）。
//   - 闭合环 U 按每列平均宽度（row-0 顶点位置的弧长）调整，不是等间距：
//     u(列) = 从切缝沿环向累计弧长 / referenceCircumference（默认自身周长）。
//     gridUvTable 建表（colU/周长），gridUvAt 按表查 [u, v]。
//   - child：U 按主发片尺度——子发片 u 范围 = 子发片一圈周长 / 主发片一圈周长
//     （unfoldHairMesh options.referenceCircumference 传入主发片周长）；桥接 -1
//     顶点单副本，uv = bridgeUvAt(vertexIndex) 或原 uv 属性；环与桥接的 wrap quad
//     （跨越切缝的 quad）都丢弃；桥接中线顶点 u_ring=0（不再需要双副本）。
//   - split：每管 ringSize_g 个环顶点 = 1 个 clip seam 点（local col 0，即管首列）+
//     ringSize_g-1 个普通列。网格列 = 管局部列 + 全局偏移（colBase_g 累计），无 -1
//     网格顶点；管首列 u=0 单边切缝，环向 l=1..ringSize-1 累计弧长，wrap 边只计入
//     circumference。展开后每管 ringSize 槽（pos = 全局 col）；两管共享同一
//     circumference（= 两管周长和，含 wrap 边）。
//   - 每根发丝独立 0-1 UV，允许重叠，不做打包。
//   - 顶点属性（position/normal/tangent/color/leafWeights）按映射复制。
//   - 其它 col=-1 顶点一律作为 passthrough 保留（每个 -1 顶点占一个新索引，排在
//     网格顶点之后），uv = bridgeUvAt(vertexIndex) 或原 uv 属性；未在任何 face 中
//     引用的也保留。
//   - 纯函数，无 THREE 依赖；geometry 仅鸭子类型访问（getAttribute / userData）。

// 从两路 grid 数组推出矩形尺寸：max+1；空/无数据返回 {rows:0, cols:0}。
export function gridDimensions(gridRows, gridCols) {
  if (!gridRows || !gridCols) return { rows: 0, cols: 0 };
  let rows = 0;
  let cols = 0;
  const length = Math.min(gridRows.length, gridCols.length);
  for (let i = 0; i < length; i += 1) {
    const row = Number(gridRows[i]);
    const col = Number(gridCols[i]);
    if (Number.isFinite(row) && row >= 0 && row + 1 > rows) rows = row + 1;
    if (Number.isFinite(col) && col >= 0 && col + 1 > cols) cols = col + 1;
  }
  return { rows, cols };
}

const COMPONENT_GETTERS = ["getX", "getY", "getZ", "getW"];

// 鸭子类型读取属性分量：优先 attribute.array（BufferAttribute 风格），
// 否则退回 getX/getY/getZ/getW（假实现 / 其它访问器）。
function attributeComponent(attribute, index, component) {
  if (!attribute) return 0;
  const array = attribute.array;
  if (array && (Array.isArray(array) || ArrayBuffer.isView(array))) {
    const itemSize = attribute.itemSize || 3;
    const value = array[index * itemSize + component];
    if (Number.isFinite(value)) return value;
  }
  const getter = COMPONENT_GETTERS[component];
  return typeof attribute[getter] === "function" ? attribute[getter](index) : 0;
}

// 弧长 UV 表：按 row-0 顶点的环向边宽（欧氏距离）把列映射为弧长归一 u。
// geometry 需要 position 属性 + userData.gridRowIndices/gridColIndices；
// split 还需要 userData.splitSections（管首列即切缝，忽略 seamCol）。
// kind: "closed" | "child" | "split"（其它返回 null，不展开/不查）。
// seamCol: closed/child 的切缝列（split 忽略）。
// referenceCircumference: 归一分母（null/undefined = 自身 circumference）。
// 返回 { colU: Map<col, u>, circumference, rows }；row-0 顶点缺失（某列缺）→ null。
export function gridUvTable(geometry, kind, seamCol, referenceCircumference = null) {
  const userData = geometry?.userData || {};
  const gridRows = userData.gridRowIndices;
  const gridCols = userData.gridColIndices;
  if (!gridRows || !gridCols) return null;
  const positionAttr = geometry?.getAttribute?.("position");
  if (!positionAttr) return null;
  const dims = gridDimensions(gridRows, gridCols);
  const R = dims.rows;
  const C = dims.cols;
  if (R < 1 || C < 1) return null;

  const posOf = (index) => [
    attributeComponent(positionAttr, index, 0),
    attributeComponent(positionAttr, index, 1),
    attributeComponent(positionAttr, index, 2)
  ];
  const dist = (a, b) => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // (row, col) -> 原顶点索引
  const gridIndexByRowCol = new Map();
  const length = Math.min(gridRows.length, gridCols.length);
  for (let i = 0; i < length; i += 1) {
    const row = Number(gridRows[i]);
    const col = Number(gridCols[i]);
    if (Number.isFinite(row) && Number.isFinite(col) && row >= 0 && col >= 0) {
      gridIndexByRowCol.set(row + ":" + col, i);
    }
  }

  // colU：节点 u = 从切缝（closed/child 的 seamCol；split 每管的 seam 点）沿环向
  // 到该节点的累计弧长 / ref。wrap 边只计入 circumference，不归给任何节点。
  let colU = null;
  let circumference = 0;

  if (kind === "closed" || kind === "child") {
    const sCol = Math.max(0, Math.round(Number(seamCol) || 0)) % C;
    const order = [];
    for (let k = 0; k < C; k += 1) order.push((sCol + k) % C);
    const positions = new Array(C);
    for (let c = 0; c < C; c += 1) {
      const source = gridIndexByRowCol.get("0:" + order[c]);
      if (source == null) return null;
      positions[c] = posOf(source);
    }
    for (let k = 0; k < C; k += 1) {
      circumference += dist(positions[k], positions[(k + 1) % C]);
    }
    colU = new Map();
    let acc = 0;
    for (let k = 0; k < C; k += 1) {
      colU.set(order[k], acc); // seam（order[0]）u=0；u(节点) = 到该节点的弧长
      acc += dist(positions[k], positions[(k + 1) % C]);
    }
  } else if (kind === "split") {
    const splitSections = userData.splitSections;
    if (!Array.isArray(splitSections) || splitSections.length === 0) return null;
    colU = new Map();
    let colBase = 0;
    for (let g = 0; g < splitSections.length; g += 1) {
      const info = splitSections[g];
      if (!info || !Number.isFinite(info.ringSize) || info.ringSize < 2
        || !Number.isFinite(info.base) || info.base < 0) return null;
      const ringSize = info.ringSize;
      // row-0 管顶点 = gridIndexByRowCol["0:" + (colBase+l)]（l=0..ringSize-1，行主序；
      // l=0 = clip seam 点，即管首列）。任何一列缺失 → null。
      const positions = new Array(ringSize);
      for (let l = 0; l < ringSize; l += 1) {
        const source = gridIndexByRowCol.get("0:" + (colBase + l));
        if (source == null) return null;
        positions[l] = posOf(source);
      }
      // seam（l=0）u=0；l=1..ringSize-1 累计弧长；wrap 边（l=ringSize-1 → 0）只计入
      // circumference，不归给任何节点。
      let acc = 0;
      for (let l = 0; l < ringSize; l += 1) {
        colU.set(colBase + l, acc);
        const width = dist(positions[l], positions[(l + 1) % ringSize]);
        circumference += width;
        acc += width;
      }
      colBase += ringSize;
    }
  } else {
    return null; // open / compound / 未知 kind → 无弧长表
  }

  const ref = Number.isFinite(Number(referenceCircumference)) && Number(referenceCircumference) > 0
    ? Number(referenceCircumference)
    : circumference;
  if (!(ref > 0)) return null;
  const scale = 1 / ref;
  for (const [node, arc] of colU) colU.set(node, arc * scale);

  return { colU, circumference, rows: R };
}

// 按弧长表查 UV：u = uvTable.colU.get(col)、v = 1 - row/(rows-1)（rows<2 → 0.5）。
// row/col 为 -1、越界或不在表内返回 null（供桥接锚点查父发片）。
export function gridUvAt(uvTable, gridRows, gridCols, vertexIndex) {
  if (!uvTable || !gridRows || !gridCols) return null;
  const row = Number(gridRows[vertexIndex]);
  const col = Number(gridCols[vertexIndex]);
  if (!Number.isFinite(row) || !Number.isFinite(col) || row < 0 || col < 0) return null;
  const u = uvTable.colU.get(col);
  if (!Number.isFinite(u)) return null;
  const v = uvTable.rows < 2 ? 0.5 : 1 - row / (uvTable.rows - 1);
  return [u, v];
}

// 把扫掠网格展开为归一化矩形 UV 的导出网格。
// geometry 需要 position 属性 + userData.gridRowIndices/gridColIndices/quadFaces；
// 缺 grid 或缺 quadFaces 返回 null（调用方回退原几何）。
// options:
//   kind       "closed" | "open" | "split" | "compound" | "child"（默认 "closed"）
//   seamCol    closed/child 的切缝列（默认 0）
//   referenceCircumference  弧长归一分母（默认 null = 自身 circumference；
//              child 传入主发片周长使子发片 u 范围 = 子周长 / 主周长）
//   bridgeUvAt (vertexIndex) -> [u, v] | null：-1 顶点 UV 回调；null 退回原 uv。
//   childVStart / childVLength  child kind 的 V 归一（默认 1 / 1；v = start - row/(R-1)*len）
// 返回 { positions, normals, tangents, colors, uvs, faces, gridRows, gridCols, leafWeights }；
// positions/normals/colors 三元组、tangents 四元组、uvs 二元组平铺 number 数组，
// faces 为 number[][]；normals/tangents/colors 在源属性缺失时为 null，
// leafWeights 在源 userData.leafWeights 长度不匹配时为 null。
export function unfoldHairMesh(geometry, options = {}) {
  const kind = options.kind || "closed";
  const userData = geometry?.userData || {};
  const gridRows = userData.gridRowIndices;
  const gridCols = userData.gridColIndices;
  const quadFaces = userData.quadFaces;
  if (!gridRows || !gridCols || !Array.isArray(quadFaces) || quadFaces.length === 0) return null;
  const positionAttr = geometry?.getAttribute?.("position");
  if (!positionAttr) return null;
  const vertexCount = positionAttr.count != null
    ? positionAttr.count
    : (positionAttr.array
      ? Math.floor(positionAttr.array.length / (positionAttr.itemSize || 3))
      : 0);
  if (vertexCount < 1) return null;
  const dims = gridDimensions(gridRows, gridCols);
  if (dims.rows < 1 || dims.cols < 1) return null;
  const R = dims.rows;
  const C = dims.cols;

  // ---- kind 布局参数：每行新顶点数、网格顶点总数、seam ----
  let seamCol = -1;
  let rowStride = 0;
  let gridVertexCount = 0;
  let tubeCols = null;     // split：section -> 管全局列（colBase..colBase+ringSize-1）
  let tubeOrder = null;    // split：升序 section 列表（0..N-1）
  if (kind === "closed" || kind === "child") {
    seamCol = Math.max(0, Math.round(Number(options.seamCol) || 0)) % C;
    rowStride = C;               // 单边：无 seam 副本
    gridVertexCount = R * rowStride;
  } else if (kind === "open" || kind === "compound") {
    rowStride = C;
    gridVertexCount = R * C;
  } else if (kind === "split") {
    // 每管 ringSize_g 个环顶点 = 1 个 clip seam 点（local col 0，即管首列）+
    // ringSize_g-1 个普通列。网格列 = 管局部列 + 全局偏移（colBase_g 累计），无 -1
    // 网格顶点；C = Σ ringSize。seam 在展开时作单边切缝（u=0），无副本。
    const splitSections = userData.splitSections;
    if (!Array.isArray(splitSections) || splitSections.length === 0) return null;
    tubeOrder = [];
    tubeCols = new Map();
    let colBase = 0;
    for (let g = 0; g < splitSections.length; g += 1) {
      const info = splitSections[g];
      if (!info || !Number.isFinite(info.ringSize) || info.ringSize < 2
        || !Number.isFinite(info.base) || info.base < 0) return null;
      const cols = [];
      for (let l = 0; l < info.ringSize; l += 1) cols.push(colBase + l);
      tubeOrder.push(g);
      tubeCols.set(g, cols);
      colBase += info.ringSize;
    }
    if (colBase !== C) return null; // 偏移列必须与 gridDimensions 的 C 一致
    rowStride = C;
    gridVertexCount = R * rowStride;
  } else {
    return null; // 未知 kind
  }

  // ---- 弧长表：closed/child/split 按 row-0 弧长定 u；表缺失 → 回退原几何 ----
  let uvTable = null;
  if (kind === "closed" || kind === "child" || kind === "split") {
    uvTable = gridUvTable(geometry, kind, seamCol, options.referenceCircumference ?? null);
    if (!uvTable) return null;
  }

  // ---- (row, col) -> 原顶点索引；矩形密度校验（缺格/重复 → 回退原几何）----
  const gridIndexByRowCol = new Map();
  const length = Math.min(gridRows.length, gridCols.length);
  for (let i = 0; i < length; i += 1) {
    const row = Number(gridRows[i]);
    const col = Number(gridCols[i]);
    if (Number.isFinite(row) && Number.isFinite(col) && row >= 0 && col >= 0) {
      gridIndexByRowCol.set(row + ":" + col, i);
    }
  }
  // 矩形密度校验（缺格/重复 → 回退原几何）。split 的偏移列方案下所有顶点 col ≥ 0 且
  // 唯一，expected = R*C（与其它 kind 一致，C = Σ ringSize）。
  const expectedGridEntries = R * C;
  if (gridIndexByRowCol.size !== expectedGridEntries) return null;

  // ---- passthrough：非网格顶点保留（split 的偏移列方案无 -1 顶点，正常为 0 个）----
  // 每个 -1 顶点单副本，唯一新索引排在网格顶点之后。
  const passthroughOf = new Map(); // 顶点索引 -> 新索引
  const passthroughList = [];
  let passthroughTotal = 0;
  for (let i = 0; i < vertexCount; i += 1) {
    const row = Number(gridRows[i]);
    const col = Number(gridCols[i]);
    const isGrid = Number.isFinite(row) && Number.isFinite(col) && row >= 0 && col >= 0;
    if (isGrid) continue;
    passthroughOf.set(i, gridVertexCount + passthroughTotal);
    passthroughTotal += 1;
    passthroughList.push(i);
  }
  const totalVertexCount = gridVertexCount + passthroughTotal;

  // ---- 输出数组 ----
  const positions = new Array(totalVertexCount * 3);
  const uvs = new Array(totalVertexCount * 2);
  const hasNormal = Boolean(geometry?.getAttribute?.("normal"));
  const hasTangent = Boolean(geometry?.getAttribute?.("tangent"));
  const hasColor = Boolean(geometry?.getAttribute?.("color"));
  const normals = hasNormal ? new Array(totalVertexCount * 3) : null;
  const tangents = hasTangent ? new Array(totalVertexCount * 4) : null;
  const colors = hasColor ? new Array(totalVertexCount * 3) : null;
  const gridRowOut = new Float32Array(totalVertexCount);
  const gridColOut = new Float32Array(totalVertexCount);
  const sourceOfNew = new Array(totalVertexCount);
  // child：V 按主发片尺度归一（childVStart - row/(R-1)*childVLength）；其它 kind 保持
  // 根=1 / 尖=0。childVStart=1、childVLength=1 时与旧行为一致。
  const childVStart = Number.isFinite(Number(options.childVStart)) ? Number(options.childVStart) : 1;
  const childVLength = Number.isFinite(Number(options.childVLength)) ? Number(options.childVLength) : 1;
  const vForRow = (row) => {
    if (R < 2) return kind === "child" ? childVStart : 0.5;
    if (kind === "child") return childVStart - (row / (R - 1)) * childVLength;
    return 1 - row / (R - 1);
  };

  const fillVertex = (newIndex, sourceVertex, u, v) => {
    sourceOfNew[newIndex] = sourceVertex;
    const pBase = newIndex * 3;
    positions[pBase] = attributeComponent(positionAttr, sourceVertex, 0);
    positions[pBase + 1] = attributeComponent(positionAttr, sourceVertex, 1);
    positions[pBase + 2] = attributeComponent(positionAttr, sourceVertex, 2);
    if (normals) {
      normals[pBase] = attributeComponent(geometry.getAttribute("normal"), sourceVertex, 0);
      normals[pBase + 1] = attributeComponent(geometry.getAttribute("normal"), sourceVertex, 1);
      normals[pBase + 2] = attributeComponent(geometry.getAttribute("normal"), sourceVertex, 2);
    }
    if (tangents) {
      const tBase = newIndex * 4;
      const tangentAttr = geometry.getAttribute("tangent");
      tangents[tBase] = attributeComponent(tangentAttr, sourceVertex, 0);
      tangents[tBase + 1] = attributeComponent(tangentAttr, sourceVertex, 1);
      tangents[tBase + 2] = attributeComponent(tangentAttr, sourceVertex, 2);
      tangents[tBase + 3] = attributeComponent(tangentAttr, sourceVertex, 3);
    }
    if (colors) {
      colors[pBase] = attributeComponent(geometry.getAttribute("color"), sourceVertex, 0);
      colors[pBase + 1] = attributeComponent(geometry.getAttribute("color"), sourceVertex, 1);
      colors[pBase + 2] = attributeComponent(geometry.getAttribute("color"), sourceVertex, 2);
    }
    uvs[newIndex * 2] = u;
    uvs[newIndex * 2 + 1] = v;
    gridRowOut[newIndex] = Number(gridRows[sourceVertex]);
    gridColOut[newIndex] = Number(gridCols[sourceVertex]);
  };

  // ---- 网格顶点填充 ----
  let fillOk = true;
  if (kind === "closed" || kind === "child") {
    gridLoop:
    for (let row = 0; row < R; row += 1) {
      const v = vForRow(row);
      for (let pos = 0; pos < C; pos += 1) {
        const col = (seamCol + pos) % C;
        const source = gridIndexByRowCol.get(row + ":" + col);
        if (source == null) { fillOk = false; break gridLoop; }
        fillVertex(row * rowStride + pos, source, uvTable.colU.get(col), v);
      }
    }
  } else if (kind === "open" || kind === "compound") {
    gridLoop:
    for (let row = 0; row < R; row += 1) {
      const v = vForRow(row);
      for (let col = 0; col < C; col += 1) {
        const source = gridIndexByRowCol.get(row + ":" + col);
        if (source == null) { fillOk = false; break gridLoop; }
        fillVertex(row * C + col, source, C > 1 ? col / (C - 1) : 0.5, v);
      }
    }
  } else if (kind === "split") {
    gridLoop:
    for (let row = 0; row < R; row += 1) {
      const v = vForRow(row);
      // 每行每管 pos = 全局 col 本身（newIndex = row*C + col）；seam（管首列）u=0
      // 单边，无副本。cols 0..C-1 连续且跨管唯一。
      for (let col = 0; col < C; col += 1) {
        const source = gridIndexByRowCol.get(row + ":" + col);
        if (source == null) { fillOk = false; break gridLoop; }
        fillVertex(row * rowStride + col, source, uvTable.colU.get(col), v);
      }
    }
  }
  if (!fillOk) return null;

  // ---- passthrough 填充：uv = bridgeUvAt(vertexIndex) 或原 uv 属性 ----
  const uvAttr = geometry.getAttribute("uv");
  passthroughList.forEach((source) => {
    const newIndex = passthroughOf.get(source);
    let u = attributeComponent(uvAttr, source, 0);
    let v = attributeComponent(uvAttr, source, 1);
    if (typeof options.bridgeUvAt === "function") {
      const override = options.bridgeUvAt(source);
      if (Array.isArray(override) && override.length >= 2
        && Number.isFinite(override[0]) && Number.isFinite(override[1])) {
        u = override[0];
        v = override[1];
      }
    }
    fillVertex(newIndex, source, u, v);
  });

  // ---- face 重映射（wrap quad 丢弃 + 顶点槽位换算）----
  // wrap quad：闭合环（closed/child）跨切缝的 quad（环向相邻列 {seamCol-1, seamCol}，
  // 含环自身与桥接 quad）；split 某管的管尾↔管首 quad（col 对 = {colBase+ringSize-1,
  // colBase}）。丢弃后 faces 数组少相应 quad；顶点全部保留（开口管，顶点不删）。
  const seamRingColSet = (kind === "closed" || kind === "child")
    ? new Set([(seamCol - 1 + C) % C, seamCol])
    : null;
  const splitWrapPairs = kind === "split"
    ? tubeOrder.map((g) => {
        const cols = tubeCols.get(g);
        return [cols[0], cols[cols.length - 1]];
      })
    : null;
  const faces = [];
  quadFaces.forEach((face) => {
    if (kind === "closed" || kind === "child") {
      const ringCols = new Set();
      for (const vertex of face) {
        const col = Number(gridCols[vertex]);
        if (Number.isFinite(col) && col >= 0) ringCols.add(col);
      }
      if (ringCols.size === seamRingColSet.size) {
        let match = true;
        for (const c of ringCols) {
          if (!seamRingColSet.has(c)) { match = false; break; }
        }
        if (match) return; // 跨切缝 wrap quad → 丢弃
      }
    } else if (kind === "split") {
      const ringCols = new Set();
      for (const vertex of face) {
        const col = Number(gridCols[vertex]);
        if (Number.isFinite(col) && col >= 0) ringCols.add(col);
      }
      for (const [first, last] of splitWrapPairs) {
        if (ringCols.has(first) && ringCols.has(last)) return; // 管尾↔管首 wrap quad → 丢弃
      }
    }
    const newFace = new Array(face.length);
    for (let vi = 0; vi < face.length; vi += 1) {
      const vertex = face[vi];
      const col = Number(gridCols[vertex]);
      if (!Number.isFinite(col) || col < 0) {
        const entry = passthroughOf.get(vertex);
        newFace[vi] = entry != null ? entry : vertex;
        continue;
      }
      const row = Number(gridRows[vertex]);
      if (!Number.isFinite(row) || row < 0) {
        const entry = passthroughOf.get(vertex);
        newFace[vi] = entry != null ? entry : vertex;
        continue;
      }
      if (kind === "closed" || kind === "child") {
        // 单边：col 直接映射 pos = (col - seamCol + C) % C
        newFace[vi] = row * rowStride + ((col - seamCol) % C + C) % C;
      } else if (kind === "split") {
        // 全局 col 即行内槽位（newIndex = row*C + col）
        newFace[vi] = row * rowStride + col;
      } else {
        // open / compound：无 seam，直接主映射
        newFace[vi] = row * C + col;
      }
    }
    faces.push(newFace);
  });

  // ---- leafWeights（stride 3）按映射复制 ----
  let leafWeights = null;
  const sourceWeights = userData.leafWeights;
  if (sourceWeights && sourceWeights.length === vertexCount * 3) {
    leafWeights = new Float32Array(totalVertexCount * 3);
    for (let i = 0; i < totalVertexCount; i += 1) {
      const from = sourceOfNew[i] * 3;
      const to = i * 3;
      leafWeights[to] = sourceWeights[from];
      leafWeights[to + 1] = sourceWeights[from + 1];
      leafWeights[to + 2] = sourceWeights[from + 2];
    }
  }

  return {
    positions,
    normals,
    tangents,
    colors,
    uvs,
    faces,
    gridRows: gridRowOut,
    gridCols: gridColOut,
    leafWeights
  };
}
