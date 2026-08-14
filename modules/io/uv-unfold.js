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
//   - split：每管 ringSize_g 个环顶点 = 1 个 clip seam 点（local col 0，gridCol=-1）
//     + Cg = ringSize_g-1 个 fused col（splitSections / colToSection 描述）。展开后
//     每管 Cg+1 槽：pos 0 = clip seam（u=0）、pos 1..Cg = 第 k 个 fused col
//     （u=管弧长/ref）；两管共享同一 circumference（= 两管边宽和）。
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
// split 还需要 userData.splitFusedGrid.colToSection / userData.splitSections。
// kind: "closed" | "child" | "split"（其它返回 null，不展开/不查）。
// seamCol: closed/child 的切缝列（split 由 colToSection 内部决定，忽略 seamCol）。
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
    const colToSection = userData.splitFusedGrid?.colToSection;
    const splitSections = userData.splitSections;
    if (!Array.isArray(colToSection) || colToSection.length === 0) return null;
    if (!Array.isArray(splitSections) || splitSections.length === 0) return null;
    const bySection = new Map();
    for (let fusedCol = 0; fusedCol < colToSection.length; fusedCol += 1) {
      const entry = colToSection[fusedCol];
      if (!entry || entry.section == null) continue;
      if (!bySection.has(entry.section)) bySection.set(entry.section, []);
      bySection.get(entry.section).push(fusedCol);
    }
    const tubeOrder = [...bySection.keys()].sort((a, b) => a - b);
    if (tubeOrder.length === 0) return null;
    colU = new Map();
    for (let g = 0; g < tubeOrder.length; g += 1) {
      const section = tubeOrder[g];
      const cols = [...new Set(bySection.get(section).sort((a, b) => a - b))];
      const info = splitSections[section];
      if (!info || !Number.isFinite(info.ringSize) || info.ringSize < 2
        || !Number.isFinite(info.base) || info.base < 0
        || cols.length !== info.ringSize - 1) return null;
      // row-0 管 seam 点（local col 0，gridCol<0）
      let seamIndex = -1;
      let seamCount = 0;
      for (let k = 0; k < info.ringSize; k += 1) {
        const vi = info.base + k;
        const col = Number(gridCols[vi]);
        if (!Number.isFinite(col) || col < 0) { seamIndex = vi; seamCount += 1; }
      }
      if (seamCount !== 1) return null;
      const seamPos = posOf(seamIndex);
      // 每管各自从 seam 点起累计：seam → 管首 fused col（起边），fused col 间相邻，
      // 管尾 fused col → seam（wrap 边，只计入 circumference）。
      let prev = seamPos;
      let acc = 0;
      for (let k = 0; k < cols.length; k += 1) {
        const source = gridIndexByRowCol.get("0:" + cols[k]);
        if (source == null) return null;
        const current = posOf(source);
        const width = dist(prev, current);
        circumference += width;
        acc += width;
        colU.set(cols[k], acc); // u(节点) = 到该节点的弧长（管首 fused col = 起边宽）
        prev = current;
      }
      circumference += dist(prev, seamPos); // wrap 边
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
  let colToSection = null; // split：fused col -> { section, col }
  let tubeCols = null;     // split：section -> 排序去重的 fused cols
  let tubeBase = null;     // split：section -> 该管在行内的起点
  let tubeOrder = null;    // split：升序 section 列表
  const seamSourceOf = new Map(); // split：`${row}:${section}` -> clip seam 顶点索引
  const seamInfoOf = new Map();   // split：clip seam 顶点索引 -> { row, section }
  if (kind === "closed" || kind === "child") {
    seamCol = Math.max(0, Math.round(Number(options.seamCol) || 0)) % C;
    rowStride = C;               // 单边：无 seam 副本
    gridVertexCount = R * rowStride;
  } else if (kind === "open" || kind === "compound") {
    rowStride = C;
    gridVertexCount = R * C;
  } else if (kind === "split") {
    // 每管：ringSize_g 个环顶点 = 1 个 clip seam 点（local col 0，gridCol=-1）
    // + Cg 个 fused col（gridCol>=0）。Cg 必须 = ringSize_g - 1，否则无法建立
    // 矩形布局 → 回退原几何。
    colToSection = userData.splitFusedGrid?.colToSection;
    const splitSections = userData.splitSections;
    if (!Array.isArray(colToSection) || colToSection.length === 0) return null;
    if (!Array.isArray(splitSections) || splitSections.length === 0) return null;
    const bySection = new Map();
    for (let fusedCol = 0; fusedCol < colToSection.length; fusedCol += 1) {
      const entry = colToSection[fusedCol];
      if (!entry || entry.section == null) continue;
      if (!bySection.has(entry.section)) bySection.set(entry.section, []);
      bySection.get(entry.section).push(fusedCol);
    }
    tubeOrder = [...bySection.keys()].sort((a, b) => a - b);
    if (tubeOrder.length === 0) return null;
    tubeCols = new Map();
    tubeBase = new Map();
    let base = 0;
    for (let g = 0; g < tubeOrder.length; g += 1) {
      const section = tubeOrder[g];
      const cols = [...new Set(bySection.get(section).sort((a, b) => a - b))];
      tubeCols.set(section, cols);
      const info = splitSections[section];
      if (!info || !Number.isFinite(info.ringSize) || info.ringSize < 2
        || !Number.isFinite(info.base) || info.base < 0
        || cols.length !== info.ringSize - 1) return null;
      tubeBase.set(section, base);
      base += info.ringSize; // 每管 ringSize 槽：seam + Cg fused（无副本）
    }
    rowStride = base;
    if (rowStride < 1) return null;
    gridVertexCount = R * rowStride;
    // 每行每管恰好 1 个 col=-1 clip seam 点（在管顶点范围 [base, base+R*ringSize) 内
    // 查找）；它不参与 gridIndexByRowCol（-1 路径），由 seamSourceOf/seamInfoOf 定位。
    for (let row = 0; row < R; row += 1) {
      for (let g = 0; g < tubeOrder.length; g += 1) {
        const section = tubeOrder[g];
        const info = splitSections[section];
        const rangeStart = info.base + row * info.ringSize;
        let seamIndex = -1;
        let seamCount = 0;
        for (let k = 0; k < info.ringSize; k += 1) {
          const vi = rangeStart + k;
          const col = Number(gridCols[vi]);
          if (!Number.isFinite(col) || col < 0) { seamIndex = vi; seamCount += 1; }
        }
        if (seamCount !== 1) return null;
        seamSourceOf.set(row + ":" + section, seamIndex);
        seamInfoOf.set(seamIndex, { row, section });
      }
    }
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
  // 矩形密度校验（缺格/重复 → 回退原几何）。split 的 expected = Σ(Cg)×R：clip seam 点
  // （col=-1）不在此 map 中，其"每行每管恰好 1 个"由上面的 seam 扫描保证。
  const expectedGridEntries = kind === "split"
    ? [...tubeCols.values()].reduce((sum, cols) => sum + cols.length, 0) * R
    : R * C;
  if (gridIndexByRowCol.size !== expectedGridEntries) return null;

  // ---- passthrough：非网格顶点保留（split 的 clip seam 点除外——它们已是网格顶点）----
  // 每个 -1 顶点单副本，唯一新索引排在网格顶点之后。
  const passthroughOf = new Map(); // 顶点索引 -> 新索引
  const passthroughList = [];
  let passthroughTotal = 0;
  for (let i = 0; i < vertexCount; i += 1) {
    const row = Number(gridRows[i]);
    const col = Number(gridCols[i]);
    const isGrid = Number.isFinite(row) && Number.isFinite(col) && row >= 0 && col >= 0;
    if (isGrid || seamInfoOf.has(i)) continue;
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
      for (let g = 0; g < tubeOrder.length; g += 1) {
        const section = tubeOrder[g];
        const cols = tubeCols.get(section);
        const Cg = cols.length;
        const base = tubeBase.get(section);
        const seamSource = seamSourceOf.get(row + ":" + section);
        if (seamSource == null) { fillOk = false; break gridLoop; }
        // pos 0 = clip seam 点（u=0）；pos 1..Cg = fused col（u=管弧长/ref）
        fillVertex(row * rowStride + base, seamSource, 0, v);
        for (let k = 0; k < Cg; k += 1) {
          const source = gridIndexByRowCol.get(row + ":" + cols[k]);
          if (source == null) { fillOk = false; break gridLoop; }
          fillVertex(row * rowStride + base + k + 1, source, uvTable.colU.get(cols[k]), v);
        }
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
  // 含环自身与桥接 quad）；split 含管 seam 点且 col>=0 顶点 = 管尾 fused col 的 quad。
  // 丢弃后 faces 数组少相应 quad；顶点全部保留（开口管，顶点不删）。
  const seamRingColSet = (kind === "closed" || kind === "child")
    ? new Set([(seamCol - 1 + C) % C, seamCol])
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
      let seamVertex = -1;
      for (const vertex of face) {
        if (seamInfoOf.has(vertex)) { seamVertex = vertex; break; }
      }
      if (seamVertex >= 0) {
        const seam = seamInfoOf.get(seamVertex);
        const cols = tubeCols.get(seam.section);
        const lastCol = cols[cols.length - 1];
        let wrap = true;
        let hasRingVertex = false;
        for (const vertex of face) {
          const col = Number(gridCols[vertex]);
          if (Number.isFinite(col) && col >= 0) {
            hasRingVertex = true;
            if (col !== lastCol) { wrap = false; break; }
          }
        }
        if (hasRingVertex && wrap) return; // seam ↔ 管尾 fused col wrap quad → 丢弃
      }
    }
    const newFace = new Array(face.length);
    for (let vi = 0; vi < face.length; vi += 1) {
      const vertex = face[vi];
      const col = Number(gridCols[vertex]);
      if (!Number.isFinite(col) || col < 0) {
        if (kind === "split" && seamInfoOf.has(vertex)) {
          // split：clip seam 点 → 管 seam 槽 pos 0（u=0，单边起点）
          const seam = seamInfoOf.get(vertex);
          newFace[vi] = seam.row * rowStride + tubeBase.get(seam.section);
          continue;
        }
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
        const entry = colToSection[col];
        if (entry && tubeCols.has(entry.section)) {
          const cols = tubeCols.get(entry.section);
          const p = cols.indexOf(col);
          // fused col → 管内序号 + 1（pos 0 留给 clip seam 点）
          newFace[vi] = row * rowStride + tubeBase.get(entry.section) + (p >= 0 ? p + 1 : 0);
        } else {
          // 密度校验已保证每个 col>=0 顶点都落在某管；此处仅为防御。
          newFace[vi] = row * rowStride + col;
        }
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
