// 唯一外部依赖：发丝多拉链的「管 k 横向推开方向」唯一定义点（standards「一处派生」）。
// bone-model.js 只依赖 three，不反向依赖 io/*，故无循环依赖；导出的骨骼横向偏移因此
// 与 createSplitStrandGeometry 渲染出的管逐值一致。
import { strandSplitTubeCenter } from "../bones/bone-model.js?v=20260901-1";
// fork-T（`1 − max(相邻 zipper 高)`）的唯一定义点。本文件此前有 3 份独立算式
// （strandForkTForTube + splitBoneLayout/splitChainLayout 的 panel 分支各一），0.2.133 折叠。
// 两种缺侧语义各有一个入口：`?? 0` 版（发丝，splits 已归一化）与 guard 版（panel，读原始
// lock.panelSplits）。tip-width-curve 只 import three / curve-math / bone-model ⇒ 无循环。
import {
  tipWidthCommonForkFromHeights,
  tipWidthCommonForkFromPresentHeights
} from "../geometry/tip-width-curve.js?v=20260910-9";

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value) {
  const number = finiteNumber(value);
  if (Math.abs(number) < 0.0000005) return "0";
  return Number(number.toFixed(6)).toString();
}

function quoteString(value) {
  return `"${String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\"", "\\\"")
    .replaceAll("\n", "\\n")}"`;
}

export function usdIdentifier(value, fallback = "Item") {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const safe = normalized || fallback;
  return /^[A-Za-z_]/.test(safe) ? safe : `_${safe}`;
}

function uniqueIdentifier(value, used, fallback) {
  const base = usdIdentifier(value, fallback);
  let identifier = base;
  let suffix = 2;
  while (used.has(identifier)) {
    identifier = `${base}_${suffix}`;
    suffix += 1;
  }
  used.add(identifier);
  return identifier;
}

function tuple(values) {
  return `(${values.map(formatNumber).join(", ")})`;
}

function tupleArray(values) {
  return `[${values.map(tuple).join(", ")}]`;
}

function numberArray(values) {
  return `[${values.map((value) => Math.trunc(finiteNumber(value))).join(", ")}]`;
}

// 展平 int 对 [[a,b],[c,d]] → [a,b,c,d]（primvar 数组文本，供 int[]）。
function flatIntArray(pairs) {
  const values = [];
  (Array.isArray(pairs) ? pairs : []).forEach((pair) => {
    if (Array.isArray(pair)) pair.forEach((value) => values.push(Math.trunc(finiteNumber(value))));
    else values.push(Math.trunc(finiteNumber(pair)));
  });
  return `[${values.join(", ")}]`;
}

// 平铺 float 列表（支持嵌套对），逐项 formatNumber → "a, b, c, d"（供 float[]）。
function floatArray(values) {
  const flat = [];
  (Array.isArray(values) ? values : []).forEach((value) => {
    if (Array.isArray(value)) value.forEach((v) => flat.push(v));
    else flat.push(value);
  });
  return `[${flat.map(formatNumber).join(", ")}]`;
}

function metadataLines(item, indent) {
  const lines = [`${indent}custom string animeHairStudio:sourceName = ${quoteString(item.name)}`];
  if (item.group) lines.push(`${indent}custom string animeHairStudio:group = ${quoteString(item.group)}`);
  if (item.layer) lines.push(`${indent}custom string animeHairStudio:layer = ${quoteString(item.layer)}`);
  return lines;
}

function primvarLines(type, name, values, interpolation, indices = null, indent = 12) {
  const pad = " ".repeat(indent);
  const pad2 = " ".repeat(indent + 4);
  const lines = [
    `${pad}${type}[] primvars:${name} = ${tupleArray(values)} (`,
    `${pad2}interpolation = "${interpolation}"`,
    `${pad})`
  ];
  if (Array.isArray(indices) && indices.length) {
    lines.push(`${pad}int[] primvars:${name}:indices = ${numberArray(indices)}`);
  }
  return lines;
}

// 蒙皮数据是否完整（每点一个影响列表，与 meshBlock 的 hasSkin 判定一致）。
function hasSkinData(mesh) {
  const points = Array.isArray(mesh?.points) ? mesh.points : [];
  return Array.isArray(mesh?.skelIndices) && mesh.skelIndices.length === points.length
    && Array.isArray(mesh?.skelWeights) && mesh.skelWeights.length === points.length;
}

// indent 为基础缩进（def Mesh 所在列），属性在 indent+4。
function meshBlock(mesh, identifier, skelPath = null, indent = 8) {
  const pad = " ".repeat(indent);
  const pad2 = " ".repeat(indent + 4);
  const pad3 = " ".repeat(indent + 8);
  const points = Array.isArray(mesh.points) ? mesh.points : [];
  const faces = (Array.isArray(mesh.faces) ? mesh.faces : [])
    .filter((face) => Array.isArray(face) && face.length >= 3);
  const faceVertexCounts = faces.map((face) => face.length);
  const faceVertexIndices = faces.flat();
  const hasSkin = skelPath && hasSkinData(mesh);
  const header = hasSkin
    ? `${pad}def Mesh "${identifier}" (` + "\n" + `${pad2}prepend apiSchemas = ["SkelBindingAPI"]` + "\n" + `${pad})`
    : `${pad}def Mesh "${identifier}"`;
  const lines = [
    header,
    `${pad}{`,
    `${pad2}point3f[] points = ${tupleArray(points)}`,
    `${pad2}int[] faceVertexCounts = ${numberArray(faceVertexCounts)}`,
    `${pad2}int[] faceVertexIndices = ${numberArray(faceVertexIndices)}`,
    `${pad2}uniform token subdivisionScheme = "none"`
  ];

  if (hasSkin) {
    // SkelBindingAPI：rel skel:skeleton 指向 Skeleton prim；蒙皮用
    // jointIndices/jointWeights（elementSize = 每顶点影响数）。
    const elementSize = Array.isArray(mesh.skelIndices[0]) ? mesh.skelIndices[0].length : 2;
    lines.push(
      `${pad2}rel skel:skeleton = </${skelPath}>`,
      `${pad2}int[] primvars:skel:jointIndices = ${flatIntArray(mesh.skelIndices)} (`,
      `${pad3}elementSize = ${elementSize}`,
      `${pad3}interpolation = "vertex"`,
      `${pad2})`,
      `${pad2}float[] primvars:skel:jointWeights = ${floatArray(mesh.skelWeights)} (`,
      `${pad3}elementSize = ${elementSize}`,
      `${pad3}interpolation = "vertex"`,
      `${pad2})`
    );
  }
  if (Array.isArray(mesh.normals) && mesh.normals.length === points.length) {
    lines.push(
      `${pad2}normal3f[] normals = ${tupleArray(mesh.normals)}`,
      `${pad2}uniform token normals:interpolation = "vertex"`
    );
  }
  if (Array.isArray(mesh.uvs) && mesh.uvs.length) {
    const indexedUvs = Array.isArray(mesh.uvIndices)
      && mesh.uvIndices.length === faceVertexIndices.length
      && mesh.uvIndices.every((index) => Number.isInteger(index) && index >= 0 && index < mesh.uvs.length);
    const directUvs = mesh.uvs.length === points.length;
    if (indexedUvs || directUvs) {
      lines.push(...primvarLines(
        "texCoord2f",
        "st",
        mesh.uvs,
        "faceVarying",
        indexedUvs ? mesh.uvIndices : faceVertexIndices,
        indent + 4
      ));
    }
  }
  if (Array.isArray(mesh.colors) && mesh.colors.length === points.length) {
    lines.push(...primvarLines("color3f", "displayColor", mesh.colors, "vertex", null, indent + 4));
  }
  if (Array.isArray(mesh.tangents) && mesh.tangents.length === points.length) {
    lines.push(...primvarLines("float4", "animeHairStudio:tangent", mesh.tangents, "vertex", null, indent + 4));
  }
  if (Array.isArray(mesh.gridRowIndices) && mesh.gridRowIndices.length === points.length) {
    lines.push(
      `${pad2}int[] primvars:AHS_gridRow = ${numberArray(mesh.gridRowIndices)} (`,
      `${pad3}interpolation = "vertex"`,
      `${pad2})`
    );
  }
  if (Array.isArray(mesh.gridColIndices) && mesh.gridColIndices.length === points.length) {
    lines.push(
      `${pad2}int[] primvars:AHS_gridCol = ${numberArray(mesh.gridColIndices)} (`,
      `${pad3}interpolation = "vertex"`,
      `${pad2})`
    );
  }
  const uvislandValues = Array.isArray(mesh.uvislandValues) && mesh.uvislandValues.length === faces.length
    ? mesh.uvislandValues : (Number.isInteger(mesh.uvisland) ? faces.map(() => mesh.uvisland) : null);
  if (uvislandValues) {
    // UV 岛枚举：uniform = 每面一个值（Houdini prim 属性语义），DCC 可按 @uvisland==k 选岛
    lines.push(
      `${pad2}int[] primvars:uvisland = ${numberArray(uvislandValues)} (`,
      `${pad3}interpolation = "uniform"`,
      `${pad2})`
    );
  }
  lines.push(...metadataLines(mesh, pad2), `${pad}}`);
  return lines.join("\n");
}

function curveBlock(curve, identifier) {
  const points = Array.isArray(curve.points) ? curve.points : [];
  const width = Math.max(0.0001, finiteNumber(curve.width || 0.01));
  return [
    `        def BasisCurves "${identifier}"`,
    "        {",
    '            uniform token type = "cubic"',
    '            uniform token basis = "catmullRom"',
    '            uniform token wrap = "pinned"',
    `            int[] curveVertexCounts = [${points.length}]`,
    `            point3f[] points = ${tupleArray(points)}`,
    `            float[] widths = [${formatNumber(width)}]`,
    '            uniform token widths:interpolation = "constant"',
    ...metadataLines(curve, "            "),
    "        }"
  ].join("\n");
}

function pointTuple(p) {
  return `(${formatNumber(p?.[0] ?? 0)}, ${formatNumber(p?.[1] ?? 0)}, ${formatNumber(p?.[2] ?? 0)})`;
}

// orient 为 [w,x,y,z]（null 视为单位四元数）→ 3x3 旋转矩阵（9 值，row-vector 约定，
// scale 默认 1）。导出给 project-files.js 用：数据流里骨骼旋转统一用 3x3 矩阵表示。
export function quatToMat3(orient) {
  const w = finiteNumber(orient?.[0] ?? 1);
  const x = finiteNumber(orient?.[1] ?? 0);
  const y = finiteNumber(orient?.[2] ?? 0);
  const z = finiteNumber(orient?.[3] ?? 0);
  // row-vector 约定（USD v' = v·M）：旋转矩阵是 column-vector 版本的转置。
  return [
    1 - 2 * (y * y + z * z), 2 * (x * y + w * z), 2 * (x * z - w * y),
    2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x),
    2 * (x * z + w * y), 2 * (y * z - w * x), 1 - 2 * (x * x + y * y)
  ];
}

// 由三个正交轴向量直接构造 3x3 旋转矩阵（9 值，row-vector 约定，行 = 基向量，scale 恒 1）。
// 输入 xAxis/yAxis/zAxis 为 {x,y,z} 或 [x,y,z]；分量经 finiteNumber 保护（缺失/非有限 → 0）。
export function axesToMat3(xAxis, yAxis, zAxis) {
  // 兼容 {x,y,z} 对象与 [x,y,z] 数组两种输入。
  const component = (axis, index) => {
    const key = ["x", "y", "z"][index];
    return finiteNumber(Array.isArray(axis) ? axis[index] : axis?.[key]);
  };
  return [
    component(xAxis, 0), component(xAxis, 1), component(xAxis, 2),
    component(yAxis, 0), component(yAxis, 1), component(yAxis, 2),
    component(zAxis, 0), component(zAxis, 1), component(zAxis, 2)
  ];
}

// 3x3 旋转矩阵（9 值，scale=1）→ 4x4（左上角嵌入，平移 0）；null → identity。
function mat3ToMat4(orient) {
  const m = Array.isArray(orient) && orient.length >= 9 ? orient : null;
  return [
    m ? m[0] : 1, m ? m[1] : 0, m ? m[2] : 0, 0,
    m ? m[3] : 0, m ? m[4] : 1, m ? m[5] : 0, 0,
    m ? m[6] : 0, m ? m[7] : 0, m ? m[8] : 1, 0,
    0, 0, 0, 1
  ];
}

// 平移矩阵（p 为 null 视为 (0,0,0)）；row-vector 约定：平移分量在最后一行。
function translationMatrix(p) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    finiteNumber(p?.[0] ?? 0), finiteNumber(p?.[1] ?? 0), finiteNumber(p?.[2] ?? 0), 1
  ];
}

// 行主序 4x4 矩阵乘法 a·b。
function matrixMultiply(a, b) {
  const out = new Array(16);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      out[row * 4 + col] = (
        a[row * 4] * b[col]
        + a[row * 4 + 1] * b[4 + col]
        + a[row * 4 + 2] * b[8 + col]
        + a[row * 4 + 3] * b[12 + col]
      );
    }
  }
  return out;
}

// 3x3 转置（旋转矩阵的逆 = 转置；9 值，row-vector）；null → identity。
function mat3Transpose(m) {
  const s = Array.isArray(m) && m.length >= 9 ? m : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  return [s[0], s[3], s[6], s[1], s[4], s[7], s[2], s[5], s[8]];
}

// 3x3 矩阵乘法 a·b（9 值，行主序，out[r*3+c] = Σ a[r*3+k]·b[k*3+c]）；null → identity。
function mat3Multiply(a, b) {
  const ma = Array.isArray(a) && a.length >= 9 ? a : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const mb = Array.isArray(b) && b.length >= 9 ? b : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const out = new Array(9);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      out[row * 3 + col] = (
        ma[row * 3] * mb[col]
        + ma[row * 3 + 1] * mb[3 + col]
        + ma[row * 3 + 2] * mb[6 + col]
      );
    }
  }
  return out;
}

// 行向量 v（3 值）· 3x3 矩阵 m（9 值，row-vector）→ 3 值行向量：
// [v0*m0+v1*m3+v2*m6, v0*m1+v1*m4+v2*m7, v0*m2+v1*m5+v2*m8]；null → identity。
function rowVecTimesMat3(v, m) {
  const mv = Array.isArray(v) && v.length >= 3 ? v : [0, 0, 0];
  const mm = Array.isArray(m) && m.length >= 9 ? m : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  return [
    mv[0] * mm[0] + mv[1] * mm[3] + mv[2] * mm[6],
    mv[0] * mm[1] + mv[1] * mm[4] + mv[2] * mm[7],
    mv[0] * mm[2] + mv[1] * mm[5] + mv[2] * mm[8]
  ];
}

// 关节 orient 为世界旋转 3x3（9 值，row-vector）；缺失/非数组 → identity。
function orientOf(joint) {
  return Array.isArray(joint?.orient) && joint.orient.length >= 9 ? joint.orient : [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

// 行主序 4x4 矩阵的 USD matrix4d 文本（4 个 4 元组）。
function matrixTuple(m) {
  const rows = [];
  for (let row = 0; row < 16; row += 4) {
    rows.push(`(${formatNumber(m[row])}, ${formatNumber(m[row + 1])}, ${formatNumber(m[row + 2])}, ${formatNumber(m[row + 3])})`);
  }
  return `(${rows.join(", ")})`;
}

// Emit one Skeleton prim (USD SkelBindingAPI), to live inside the shared
// def SkelRoot "Character" — all per-strand Skeletons and their skinned meshes
// go into that single SkelRoot, so Houdini usdcharacterimport imports the whole
// rig in one go (skelrootpath = /<Root>/Character).
// SkelRoot/Skeleton 是类型化 schema（def 即设类型），不再写 prepend apiSchemas。
// Skeleton 属性名不带 skel: 前缀（joints/bindTransforms/restTransforms），
// 只有 mesh 上的 SkelBindingAPI 属性带 skel: 前缀。
// joints token 是相对 stage root 的完整 prim 路径（无前导斜杠）：
// `${rootName}/${characterSkelRootName}/${identifier}/${...}`，父链用 / 拼接；
// orient 是世界旋转（发丝 frame 派生的世界坐标方向）、p 是世界位置：
// bindTransforms 是各关节世界矩阵（R_world · T(p)，平移恒 = p，不受父级旋转
// 影响），restTransforms 是局部矩阵（满足 bind[i] = rest[i] · bind[parent]）。
// identifier 为去重后的 Skeleton prim 名（project-files.js 的 `${sanitized}_Skel`），
// skinnedMeshBlocks（缩进 12 的 meshBlock 输出）与 Skeleton 同级。
function skeletonBlock(skeleton, identifier, skinnedMeshBlocks = [], rootName, characterSkelRootName) {
  const joints = Array.isArray(skeleton?.joints) ? skeleton.joints : [];
  if (!joints.length) return "";
  const byName = new Map(joints.map((joint) => [joint.name, joint]));
  const jointId = (name) => usdIdentifier(name, "Joint");
  const pathCache = new Map();
  // joint token 相对 stage root：Character SkelRoot / Skeleton prim 名为前缀。
  const prefix = `${rootName}/${characterSkelRootName}/${identifier}`;
  const fullPathOf = (joint) => {
    if (pathCache.has(joint.name)) return pathCache.get(joint.name);
    const parent = joint.parent && byName.get(joint.parent);
    const path = parent ? `${fullPathOf(parent)}/${jointId(joint.name)}` : `${prefix}/${jointId(joint.name)}`;
    pathCache.set(joint.name, path);
    return path;
  };
  // orient 是世界旋转、p 是世界位置。世界矩阵 = R_world · T(p)：平移恒 = 自身 p，
  // 不再随父级旋转带偏（父级旋转只体现在世界旋转里）。p 为 null 时继承父级世界
  // 平移（递归 worldOf(parent)，取结果矩阵第 12/13/14 个分量；无父级 → (0,0,0)）。
  const worldOf = (joint) => {
    const rotation = mat3ToMat4(orientOf(joint));
    const parent = joint.parent ? byName.get(joint.parent) : null;
    let p = joint.p;
    if (!Array.isArray(joint.p)) {
      p = parent ? [worldOf(parent)[12], worldOf(parent)[13], worldOf(parent)[14]] : [0, 0, 0];
    }
    return matrixMultiply(rotation, translationMatrix(p));
  };
  // 局部矩阵（restTransforms），满足 USD Skel 规范 bind[i] = rest[i] · bind[parent]：
  // rest = bind[i] · bind[parent]⁻¹，即 R_local = R_i · R_parentᵀ（旋转矩阵的逆 =
  // 转置）、t_local = (p_i - p_parent) · R_parentᵀ（局部偏移转回父级局部空间）。
  // 根关节（无 parent）或 p / parent.p 任一缺失时 rest = bind（worldOf 结果）。
  const localOf = (joint) => {
    const parent = joint.parent ? byName.get(joint.parent) : null;
    if (!parent || !Array.isArray(joint.p) || !Array.isArray(parent.p)) {
      return worldOf(joint);
    }
    const rParentInv = mat3Transpose(orientOf(parent));
    const rLocal = mat3Multiply(orientOf(joint), rParentInv);
    const delta = [
      finiteNumber(joint.p[0]) - finiteNumber(parent.p[0]),
      finiteNumber(joint.p[1]) - finiteNumber(parent.p[1]),
      finiteNumber(joint.p[2]) - finiteNumber(parent.p[2])
    ];
    const tLocal = rowVecTimesMat3(delta, rParentInv);
    return matrixMultiply(mat3ToMat4(rLocal), translationMatrix(tLocal));
  };
  const jointPaths = joints.map((joint) => fullPathOf(joint));
  const bindTransforms = joints.map((joint) => matrixTuple(worldOf(joint)));
  const restTransforms = joints.map((joint) => matrixTuple(localOf(joint)));
  // Character SkelRoot 内（12 空格）；Skeleton 与蒙皮 mesh 同级。
  return [
    `        def Skeleton "${identifier}"`,
    "        {",
    `            uniform token[] joints = [${jointPaths.map((path) => `"${path}"`).join(", ")}]`,
    `            uniform matrix4d[] bindTransforms = [${bindTransforms.join(", ")}]`,
    `            uniform matrix4d[] restTransforms = [${restTransforms.join(", ")}]`,
    "        }",
    ...skinnedMeshBlocks
  ].join("\n");
}

// 平滑主链蒙皮绑定混合（smooth main-chain skinning blends）：按行参数 t 在相邻
// 主链骨骼间线性混合 —— [mainIdx, nextIdx] × [1-frac, frac]。t=1（链尾）时
// main === next（frac 0）；调用方用它替代单骨骼绑定作为平滑回退。
export function smoothMainPair(t, mainCount) {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const n = Math.max(1, Math.floor(Number(mainCount) || 0));
  const x = clamp(Number(t) || 0, 0, 1) * (n - 1);
  const main = Math.min(n - 1, Math.floor(x));
  const next = Math.min(n - 1, main + 1);
  return { main, next, frac: x - main };
}

// 发尖链最近关节：链点 i 的主链参数 t_i = i/(mainCount-1)；暴露起点
// i0 = clamp(floor(forkT·last), 1, last) —— 与 splitChainLayout 的暴露循环逐值同规则
// （fork 所在行本身也暴露，比旧的严格 t > forkT 多一行）。必须与之同步，否则蒙皮会绑到
// 不存在 / 差一位的关节上。返回暴露区内最接近参数 t 的链索引与暴露起点 i0。
export function tipChainNearestIndex(t, mainCount, forkT) {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const n = Math.max(2, Math.floor(Number(mainCount) || 0));
  const last = n - 1;
  const fork = clamp(Number(forkT) || 0, 0, 1);
  const i0 = clamp(Math.floor(fork * last), 1, last);
  const ci = clamp(Number(t) || 0, 0, 1) * last;
  return { index: Math.min(last, Math.max(i0, Math.round(ci))), i0 };
}

export function exportAnimeHairUsda({
  meshes = [],
  curves = [],
  skeletons = [],
  rootName = "AnimeHairStudio"
} = {}) {
  const usedMeshNames = new Set();
  const usedCurveNames = new Set();
  const rootIdentifier = usdIdentifier(rootName, "AnimeHairStudio");
  // 单个 SkelRoot 固定名 "Character"：所有发丝的 Skeleton + 蒙皮 mesh 都在里面，
  // Houdini usdcharacterimport 只需填一个 skelrootpath（/<Root>/Character）。
  const characterSkelRootName = "Character";
  // Skeleton prim 标识符 = skeleton.name 本身（project-files.js 已产出去重后的
  // `${usdIdentifier(lock.name)}_Skel`）；这里按 name 原样存，只做防御性去重
  // （同名依次 _2/_3），保证 rel skel:skeleton 与 Skeleton prim 名一致。
  const usedSkeletonNames = new Set();
  const skeletonNameToId = new Map();
  const validSkeletons = skeletons
    .filter((skeleton) => Array.isArray(skeleton?.joints) && skeleton.joints.length);
  validSkeletons.forEach((skeleton) => {
    skeletonNameToId.set(
      skeleton.name,
      uniqueIdentifier(skeleton?.name || "HairSkel", usedSkeletonNames, "HairSkel")
    );
  });
  // mesh 一次性保留 identifier；蒙皮 mesh（skelRootName 匹配有效 skeleton 且蒙皮数据完整）
  // 嵌入 Character SkelRoot，其余留在 "Meshes" scope（未蒙皮）。
  const meshRecords = meshes
    .filter((mesh) => Array.isArray(mesh?.points) && mesh.points.length && Array.isArray(mesh?.faces) && mesh.faces.length)
    .map((mesh) => {
      const identifier = uniqueIdentifier(mesh.name, usedMeshNames, "HairMesh");
      const skelId = mesh.skelRootName ? skeletonNameToId.get(mesh.skelRootName) : null;
      return { mesh, identifier, skelId, skinned: Boolean(skelId) && hasSkinData(mesh) };
    });
  const skinnedBySkelId = new Map();
  const unskinnedMeshBlocks = [];
  meshRecords.forEach(({ mesh, identifier, skelId, skinned }) => {
    const block = skinned
      ? meshBlock(mesh, identifier, `${rootIdentifier}/${characterSkelRootName}/${skelId}`, 8)
      : meshBlock(mesh, identifier, null, 8);
    if (skinned) {
      if (!skinnedBySkelId.has(skelId)) skinnedBySkelId.set(skelId, []);
      skinnedBySkelId.get(skelId).push(block);
    } else {
      unskinnedMeshBlocks.push(block);
    }
  });
  const skeletonBlocks = validSkeletons
    .map((skeleton) => {
      const identifier = skeletonNameToId.get(skeleton.name);
      return skeletonBlock(skeleton, identifier, skinnedBySkelId.get(identifier) || [], rootIdentifier, characterSkelRootName);
    })
    .filter(Boolean);
  const curveBlocks = curves
    .filter((curve) => Array.isArray(curve?.points) && curve.points.length >= 4)
    .map((curve) => curveBlock(curve, uniqueIdentifier(`${curve.name || "Hair"}_Curve`, usedCurveNames, "HairCurve")));

  const parts = [
    "#usda 1.0",
    "(",
    `    defaultPrim = "${rootIdentifier}"`,
    "    metersPerUnit = 1",
    '    upAxis = "Y"',
    ")",
    "",
    `def Xform "${rootIdentifier}"`,
    "{"
  ];
  if (unskinnedMeshBlocks.length) {
    parts.push('    def Scope "Meshes"', "    {", unskinnedMeshBlocks.join("\n\n"), "    }", "");
  }
  if (curveBlocks.length) {
    parts.push('    def Scope "CenterCurves"', "    {", curveBlocks.join("\n\n"), "    }", "");
  }
  if (skeletonBlocks.length) {
    parts.push(`    def SkelRoot "${characterSkelRootName}"`, "    {", skeletonBlocks.join("\n\n"), "    }");
  }
  parts.push("}", "");
  return parts.join("\n");
}

// ---- 发丝多拉链 split 辅助（与 createSplitStrandGeometry / bone-model 对齐）----
// N 条拉链 -> N+1 管。splits 归一化方式与几何完全一致（同样的 legacy 单标量回退，
// 按 position 排序），使 fork 深度与方向和几何、骨骼三处逐值一致。
function strandSplitsForExport(lock) {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const rawSplits = Array.isArray(lock?.strandSplits) && lock.strandSplits.length
    ? lock.strandSplits
    : [{ position: Number(lock?.strandSplitPosition ?? 0), height: Number(lock?.strandSplitHeight ?? 0.3) }];
  return rawSplits
    .map((split) => ({
      position: clamp(Number(split?.position ?? 0), -0.8, 0.8),
      height: clamp(Number(split?.height ?? 0.3), 0.02, 0.8)
    }))
    .sort((a, b) => a.position - b.position);
}

// 管 k 的 fork 深度：**委托** tip-width-curve 的唯一定义点（`1 − max(相邻拉链高)`）。
// 边缘段的缺侧为 undefined ⇒ 共享层按 `?? 0` 处理，与此前本地 `?? 0` 写法逐值相同。
// 与 Phase B 的 sectionSplitStart 及 bone-model strandSplitForkTForSegment 同一条规则。
// N=1 时 = 1 - strandSplitHeight。
function strandForkTForTube(splits, k) {
  return tipWidthCommonForkFromHeights(splits[k - 1]?.height, splits[k]?.height);
}

// 管 k 的横向**中心**（归一化 profile 坐标 ∈ [-1, 1]，唯一定义点 = bone-model.js 的
// strandSplitTubeCenter：边界 [-1, ...position, 1] 的第 k 段中点）。
// splits 由 strandSplitsForExport 归一化（与几何同规则：排序 + 钳制 + legacy 回退），
// 所以同一个 k 在骨骼与导出两处得到同一个中心。N=1 且 zipper 居中时 k=0 -> -0.5、k=1 -> +0.5。
// 0.2.132：本函数取代了 strandDirectionForTube（横向推开方向）—— 那条规则只服务于已删除的
// opening 平移；未创作发尖时该挂骨骼的地方是管自身的中心，不是「推开方向」。
export function strandTubeCenterForTube(splits, k) {
  return strandSplitTubeCenter(k, splits);
}

// split 骨骼根部锚定的主链索引：必须严格位于自己的第一个暴露链点之下（根不能与它的
// 子节点落在同一主链索引上，否则等于根没有锚在 zipper 行之下）。第一个暴露索引现在是
// firstExposed = clamp(floor(forkT·(mainCount−1)), 1, mainCount−1) —— 比旧的严格
// t > forkT 规则（floor+1）往发根方向多暴露一行，让发尖骨骼覆盖到 fork 所在行。
// 于是根 = firstExposed − 1 = floor(forkT·(mainCount−1)) − 1，钳到 [0, mainCount−1]
// （mainCount ≤ 1 时恒为 0）。floor（不是 round）仍是必要的：round 在
// frac(forkT·(mainCount−1)) > 0.5 时会跳到（甚至越过）第一个暴露子节点。
export function splitParentMainIndex(forkT, mainCount) {
  const count = Number(mainCount);
  if (!Number.isFinite(count) || count <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, Number(forkT) || 0));
  return Math.min(count - 1, Math.max(0, Math.floor(clamped * (count - 1)) - 1));
}

// ---- splitBoneLayout / bridgeRootParentName：split 骨骼的 fork 父索引与派生位置 ----
// split 骨骼（split.N，暴露段）在数据流里 authored p 为 null、父级是根骨骼，导出时
// 按此解析：fork 参数（暴露段起始处的主链位置）→ 父主骨骼索引 parentMainIndex，以及
// 派生世界位置 p（面板/表面取 splitTipForSegment 的 tip 链末点，回退曲线末端；发丝取
// 曲线末端 + 发丝宽度 × 该管中心 沿 frame.x 方向偏移）。不适用时返回 null。
export function splitBoneLayout(lock, bone, options = {}) {
  if (!lock || !bone || typeof bone.name !== "string") return null;
  // 仅 split.N 主骨骼参与；tip 链关节（split.N.tip.M）排除。
  if (!bone.name.startsWith("split.") || bone.name.includes(".tip.")) return null;
  const k = Number.parseInt(bone.name.slice(6), 10);
  if (!Number.isFinite(k) || k < 0) return null;
  const { mainCount = 0, curve = null, strandGeometryFrameAt = null, splitTipForSegment = null } = options;
  if (mainCount < 1) return null;

  let forkT = null;
  let p = null;

  if (lock.geometryType === "panel" || lock.geometryType === "surface") {
    // 面板/表面分支：forkT 走 tip-width-curve 的 guard 形式唯一定义点（只让在场的相邻
    // 段高参与 max）。这里读的是**原始** lock.panelSplits（未经 normalizePanelSplits
    // 钳制），guard 形式正是为此保留 —— 详见 tipWidthCommonForkFromPresentHeights。
    // 无 panelSplits 时该 split 无意义。
    if (!Array.isArray(lock.panelSplits) || !lock.panelSplits.length) return null;
    forkT = tipWidthCommonForkFromPresentHeights(
      lock.panelSplits[k - 1]?.height,
      lock.panelSplits[k]?.height
    );
    if (typeof splitTipForSegment === "function") {
      try {
        const tip = splitTipForSegment(lock, k, lock.panelSplits, bone);
        const last = tip?.points?.at(-1);
        if (last && Number.isFinite(Number(last.x))) {
          p = [Number(last.x), Number(last.y), Number(last.z)];
        }
      } catch {
        // tip 链解析失败 → 回退到曲线末端
      }
    }
    if (p === null && curve && typeof curve.getPoint === "function") {
      const tip = curve.getPoint(1);
      if (Number.isFinite(tip?.x)) p = [tip.x, tip.y, tip.z];
    }
  } else if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    // 发丝分支：per-tube forkT = 1 - max(相邻拉链高)；p = 曲线末端 + 该管**中心**的侧向偏移。
    // 0.2.132：偏移原为 baseWidth × spread × direction（已删除的 opening 平移）。Tip Clump
    // 现在只控制收窄、不再决定管挂在哪，所以派生位置改用管中心 —— 与几何真正的管心同侧同序。
    // 量纲：管中心是**归一化** profile 坐标，而 profile 的 x 恰好也在 [-1, 1]（两个内置
    // profile 都是；几何按 lerp(minX, maxX, position*0.5+0.5) 把 zipper position 映进 profile
    // x，minX/maxX = ∓1 时该 lerp 就是恒等），世界横向 = profile.x × baseWidth × widthScale
    // ⇒ 偏移 = baseWidth(含 widthScale) × 中心。刻意不乘发尖处的 taper 采样值：这是「未创作
    // 发尖」时的派生锚点，取基础包络即可（创作过时走 splitChainLayout）。
    const splits = strandSplitsForExport(lock);
    forkT = strandForkTForTube(splits, k);
    try {
      if (curve && typeof strandGeometryFrameAt === "function") {
        const frame = strandGeometryFrameAt(lock, curve, 1);
        const tip = curve.getPoint(1);
        if (frame?.x && tip && Number.isFinite(tip.x)) {
          const baseWidth = Number(lock.baseWidth ?? lock.width ?? 0.16) * Number(lock.widthScale ?? 1);
          const offset = baseWidth * strandTubeCenterForTube(splits, k);
          p = [tip.x + frame.x.x * offset, tip.y + frame.x.y * offset, tip.z + frame.x.z * offset];
        }
      }
    } catch {
      // frame 派生失败 → 回退到曲线末端
    }
    if (p === null && curve && typeof curve.getPoint === "function") {
      const tip = curve.getPoint(1);
      if (Number.isFinite(tip?.x)) p = [tip.x, tip.y, tip.z];
    }
  } else {
    // 发丝但未启用 split（或未知类型）→ 不适用。
    return null;
  }

  if (forkT == null) return null;
  const parentMainIndex = splitParentMainIndex(forkT, mainCount);
  return { parentMainIndex, p };
}

// ---- splitChainLayout：split 骨骼 = 发尖暴露链根，tip 关节链式导出 ----
// split 骨骼（split.N）的暴露段 tip 链：第一个暴露链点就是 split 骨骼自身（位置/
// 旋转直接采样 tip 链，不再重算），其后的每个暴露点成为 split.N.tip.M 关节，
// root→tip 链式 parent。fork 参数（暴露段起始处的主链位置）决定父主骨骼索引
// parentMainIndex。不适用（无 split、无 tip 链、链过短）时返回 null；
// splitBoneLayout 仍是调用方的回退。
export function splitChainLayout(lock, bone, options = {}) {
  if (!lock || !bone || typeof bone.name !== "string") return null;
  // 仅 split.N 主骨骼参与；tip 链关节（split.N.tip.M）排除。
  if (!bone.name.startsWith("split.") || bone.name.includes(".tip.")) return null;
  const k = Number.parseInt(bone.name.slice(6), 10);
  if (!Number.isFinite(k) || k < 0) return null;
  const {
    mainCount = 0,
    curve = null,
    strandGeometryFrameAt = null,
    splitTipForSegment = null,
    panelTipChainFrameAt = null,
    strandTipChainFrameAt = null,
    materializeTipChain = null
  } = options;

  let forkT = null;
  let chain = null;

  if (lock.geometryType === "panel" || lock.geometryType === "surface") {
    // 面板/表面分支：forkT 走与 splitBoneLayout 同一个 guard 形式定义点（同上，读原始
    // panelSplits）；tip 链由 splitTipForSegment 提供。
    if (!Array.isArray(lock.panelSplits) || !lock.panelSplits.length) return null;
    forkT = tipWidthCommonForkFromPresentHeights(
      lock.panelSplits[k - 1]?.height,
      lock.panelSplits[k]?.height
    );
    if (typeof splitTipForSegment === "function") {
      try {
        chain = splitTipForSegment(lock, k, lock.panelSplits, bone);
      } catch {
        chain = null;
      }
    }
  } else if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    // 发丝分支：per-tube forkT = 1 - max(相邻拉链高)；rest 链 = 主链曲线 + 该管**中心**的
    // 侧向偏移（沿 frame.x，量纲同 splitBoneLayout 的派生 p，见那里的说明）。
    // 0.2.132：原为 baseWidth × spread × smoothstep(t, fork, 1) × direction，即已删除的
    // opening 平移。管现在**不随 Tip Clump 平移**，其中心沿全长恒定（band 是等宽裁剪），所以
    // 偏移不再需要沿 t 斜升 —— smoothstep 与 splitStart 随之删除。
    const splits = strandSplitsForExport(lock);
    forkT = strandForkTForTube(splits, k);
    try {
      if (curve && typeof curve.getPoint === "function"
        && typeof strandGeometryFrameAt === "function"
        && typeof materializeTipChain === "function") {
        const baseWidth = Number(lock.baseWidth ?? lock.width ?? 0.16) * Number(lock.widthScale ?? 1);
        const offset = baseWidth * strandTubeCenterForTube(splits, k);
        const restPointAt = (t) => {
          const frame = strandGeometryFrameAt(lock, curve, t);
          const point = curve.getPoint(t);
          return {
            x: point.x + frame.x.x * offset,
            y: point.y + frame.x.y * offset,
            z: point.z + frame.x.z * offset
          };
        };
        chain = materializeTipChain(bone?.tip || null, restPointAt, Math.max(2, mainCount));
      }
    } catch {
      chain = null;
    }
  } else {
    // 发丝但未启用 split（或未知类型）→ 不适用。
    return null;
  }

  if (!chain || !Array.isArray(chain.points) || chain.points.length < 2) return null;

  // 暴露段索引：第一个暴露索引 = clamp(floor(forkT·(n−1)), 1, n−1)，即 fork 所在
  // 那一行本身也暴露 —— 比旧的严格 t > forkT 规则多暴露一行，发尖骨骼覆盖到 fork 行，
  // 每个 zipper 高度都多一根发尖骨骼（用户要求的方向）。下界钳到 1：索引 0 是链根，
  // 它坐在主链上，暴露它会与 main 骨骼重复、也让根骨骼无处可锚。
  // 无暴露 → 至少末点，即单骨情形。
  const n = chain.points.length;
  const last = n - 1;
  const firstExposed = Math.min(last, Math.max(1, Math.floor(forkT * last)));
  const indices = [];
  for (let i = firstExposed; i < n; i += 1) indices.push(i);
  if (!indices.length) indices.push(n - 1);

  // 根用 mainCount（主链行数），暴露用 n（tip 链点数）；两者在实际数据流里相等
  // （panel: splitTipForSegment 建 mainCount 点；strand: materializeTipChain(max(2, mainCount))），
  // 因此 parentMainIndex = firstExposed − 1，严格位于第一个暴露点之下。
  const parentMainIndex = splitParentMainIndex(forkT, mainCount);
  const cross = (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  });
  const joints = [];
  indices.forEach((i, slot) => {
    const t = i / Math.max(1, n - 1);
    const point = chain.points[i];
    const p = point ? [Number(point.x), Number(point.y), Number(point.z)] : null;
    let orient = null;
    if (lock.geometryType === "panel" || lock.geometryType === "surface") {
      if (typeof panelTipChainFrameAt === "function") {
        try {
          const frame = panelTipChainFrameAt(lock, chain, chain, t, k, lock.panelSplits);
          if (frame && frame.y && frame.z) orient = axesToMat3(cross(frame.z, frame.y), frame.z, frame.y);
        } catch {
          orient = null;
        }
      }
    } else if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
      try {
        if (curve && typeof strandGeometryFrameAt === "function" && typeof strandTipChainFrameAt === "function") {
          const referenceZ = strandGeometryFrameAt(lock, curve, t).z;
          const frame = strandTipChainFrameAt(chain, chain, t, referenceZ);
          if (frame && frame.y && frame.z) orient = axesToMat3(cross(frame.z, frame.y), frame.z, frame.y);
        }
      } catch {
        orient = null;
      }
    }
    joints.push({
      name: slot === 0 ? "split." + k : "split." + k + ".tip." + i,
      parent: null,
      p,
      orient
    });
  });
  joints[0].parent = "main." + parentMainIndex;
  for (let j = 1; j < joints.length; j += 1) joints[j].parent = joints[j - 1].name;
  return { parentMainIndex, joints };
}

// bridgeRootParentName：桥接子锁根关节的父骨骼内部名。子锁通过
// branchParentId/branchParentParameter 记录挂在哪个父锁主链的哪个位置，
// t → k = round(clamp(t)·(parentCount-1)) 得 main.k，再经 jointNameOf 映射为
// 导出关节名（调用方校验父锁确实导出该骨骼）。不适用 → null。
export function bridgeRootParentName(lock, locks = [], jointNameOf = null) {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  if (!lock?.branchParentId) return null;
  const parent = locks.find((item) => item?.id === lock.branchParentId);
  if (!parent) return null;
  const parentCount = Array.isArray(parent.points) ? parent.points.length : 0;
  if (parentCount < 2) return null;
  const t = clamp(Number(lock.branchParentParameter ?? 0), 0, 1);
  const k = Math.round(t * (parentCount - 1));
  const internalName = "main." + k;
  return typeof jointNameOf === "function" ? jointNameOf(parent, internalName) : internalName;
}
