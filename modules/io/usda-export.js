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

function metadataLines(item, indent) {
  const lines = [`${indent}custom string animeHairStudio:sourceName = ${quoteString(item.name)}`];
  if (item.group) lines.push(`${indent}custom string animeHairStudio:group = ${quoteString(item.group)}`);
  if (item.layer) lines.push(`${indent}custom string animeHairStudio:layer = ${quoteString(item.layer)}`);
  return lines;
}

function primvarLines(type, name, values, interpolation, indices = null) {
  const lines = [
    `            ${type}[] primvars:${name} = ${tupleArray(values)} (`,
    `                interpolation = "${interpolation}"`,
    "            )"
  ];
  if (Array.isArray(indices) && indices.length) {
    lines.push(`            int[] primvars:${name}:indices = ${numberArray(indices)}`);
  }
  return lines;
}

function meshBlock(mesh, identifier, skelId = null) {
  const points = Array.isArray(mesh.points) ? mesh.points : [];
  const faces = (Array.isArray(mesh.faces) ? mesh.faces : [])
    .filter((face) => Array.isArray(face) && face.length >= 3);
  const faceVertexCounts = faces.map((face) => face.length);
  const faceVertexIndices = faces.flat();
  const hasSkin = skelId
    && Array.isArray(mesh.skelJoints) && mesh.skelJoints.length
    && Array.isArray(mesh.skelIndices) && mesh.skelIndices.length === points.length
    && Array.isArray(mesh.skelWeights) && mesh.skelWeights.length === points.length;
  const header = hasSkin
    ? `        def Mesh "${identifier}" (` + "\n" + '            prepend apiSchemas = ["SkelBindingAPI"]' + "\n" + "        )"
    : `        def Mesh "${identifier}"`;
  const lines = [
    header,
    "        {",
    `            point3f[] points = ${tupleArray(points)}`,
    `            int[] faceVertexCounts = ${numberArray(faceVertexCounts)}`,
    `            int[] faceVertexIndices = ${numberArray(faceVertexIndices)}`,
    '            uniform token subdivisionScheme = "none"'
  ];

  if (hasSkin) {
    lines.push(
      `            rel skel:bindTransforms = </${skelId}>`,
      `            uniform token[] skel:joints = [${mesh.skelJoints.map((name) => `"${usdIdentifier(name, "Joint")}"`).join(", ")}]`,
      `            int2[] primvars:skel:joints = ${tupleArray(mesh.skelIndices)} (`,
      '                interpolation = "vertex"',
      "            )",
      `            float2[] primvars:skel:weights = ${tupleArray(mesh.skelWeights)} (`,
      '                interpolation = "vertex"',
      "            )"
    );
  }
  if (Array.isArray(mesh.normals) && mesh.normals.length === points.length) {
    lines.push(
      `            normal3f[] normals = ${tupleArray(mesh.normals)}`,
      '            uniform token normals:interpolation = "vertex"'
    );
  }
  if (Array.isArray(mesh.uvs) && mesh.uvs.length === points.length) {
    lines.push(...primvarLines("texCoord2f", "st", mesh.uvs, "faceVarying", faceVertexIndices));
  }
  if (Array.isArray(mesh.colors) && mesh.colors.length === points.length) {
    lines.push(...primvarLines("color3f", "displayColor", mesh.colors, "vertex"));
  }
  if (Array.isArray(mesh.tangents) && mesh.tangents.length === points.length) {
    lines.push(...primvarLines("float4", "animeHairStudio:tangent", mesh.tangents, "vertex"));
  }
  if (Array.isArray(mesh.gridRowIndices) && mesh.gridRowIndices.length === points.length) {
    lines.push(
      `            int[] primvars:AHS_gridRow = ${numberArray(mesh.gridRowIndices)} (`,
      '                interpolation = "vertex"',
      "            )"
    );
  }
  if (Array.isArray(mesh.gridColIndices) && mesh.gridColIndices.length === points.length) {
    lines.push(
      `            int[] primvars:AHS_gridCol = ${numberArray(mesh.gridColIndices)} (`,
      '                interpolation = "vertex"',
      "            )"
    );
  }
  if (Number.isInteger(mesh.uvisland)) {
    // UV 岛枚举：uniform = 每面一个值（Houdini prim 属性语义），DCC 可按 @uvisland==k 选岛
    lines.push(
      `            int[] primvars:uvisland = ${numberArray(faces.map(() => mesh.uvisland))} (`,
      '                interpolation = "uniform"',
      "            )"
    );
  }
  lines.push(...metadataLines(mesh, "            "), "        }");
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

function quatTuple(orient) {
  return `(${formatNumber(orient?.[0] ?? 1)}, ${formatNumber(orient?.[1] ?? 0)}, ${formatNumber(orient?.[2] ?? 0)}, ${formatNumber(orient?.[3] ?? 0)})`;
}

function pointTuple(p) {
  return `(${formatNumber(p?.[0] ?? 0)}, ${formatNumber(p?.[1] ?? 0)}, ${formatNumber(p?.[2] ?? 0)})`;
}

// Emit a SkelRoot with nested SkelJoint prims (hierarchy = prim nesting). Each joint
// carries a translate (P) and an orient quaternion; parent linkage via nesting.
function skeletonBlock(skeleton, usedNames) {
  const identifier = uniqueIdentifier(`${skeleton?.name || "Hair"}_Skel`, usedNames, "HairSkel");
  const joints = Array.isArray(skeleton?.joints) ? skeleton.joints : [];
  if (!joints.length) return "";
  const names = new Set(joints.map((joint) => joint.name));
  const roots = joints.filter((joint) => !joint.parent || !names.has(joint.parent));
  const childrenOf = (parentName) => joints.filter((joint) => joint.parent === parentName);
  const jointBlock = (joint, depth) => {
    const indent = "    ".repeat(depth + 1);
    const childLines = childrenOf(joint.name).map((child) => jointBlock(child, depth + 1));
    return [
      `${indent}def SkelJoint "${usdIdentifier(joint.name, "Joint")}"`,
      `${indent}{`,
      `${indent}    quatf orient = ${quatTuple(joint.orient)}`,
      `${indent}    point3f xformOp:translate = ${pointTuple(joint.p)}`,
      `${indent}    uniform token[] xformOpOrder = ["xformOp:translate"]`,
      ...childLines,
      `${indent}}`
    ].join("\n");
  };
  const block = [
    `def SkelRoot "${identifier}"`,
    "{",
    ...roots.map((root) => jointBlock(root, 1)),
    "}"
  ].join("\n");
  // Indent to sit inside the Skeletons Scope (8 spaces like mesh/curve prims).
  return block.split("\n").map((line) => `        ${line}`).join("\n");
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
  const usedSkeletonNames = new Set();
  const skeletonNameToId = new Map();
  skeletons
    .filter((skeleton) => Array.isArray(skeleton?.joints) && skeleton.joints.length)
    .forEach((skeleton) => {
      skeletonNameToId.set(
        skeleton.name,
        uniqueIdentifier(`${skeleton?.name || "Hair"}_Skel`, usedSkeletonNames, "HairSkel")
      );
    });
  const meshBlocks = meshes
    .filter((mesh) => Array.isArray(mesh?.points) && mesh.points.length && Array.isArray(mesh?.faces) && mesh.faces.length)
    .map((mesh) => {
      const identifier = uniqueIdentifier(mesh.name, usedMeshNames, "HairMesh");
      const skelId = mesh.skelRootName ? skeletonNameToId.get(mesh.skelRootName) : null;
      const skelPath = skelId ? `${rootIdentifier}/Skeletons/${skelId}` : null;
      return meshBlock(mesh, identifier, skelPath);
    });
  const curveBlocks = curves
    .filter((curve) => Array.isArray(curve?.points) && curve.points.length >= 4)
    .map((curve) => curveBlock(curve, uniqueIdentifier(`${curve.name || "Hair"}_Curve`, usedCurveNames, "HairCurve")));
  const skeletonBlocks = skeletons
    .filter((skeleton) => Array.isArray(skeleton?.joints) && skeleton.joints.length)
    .map((skeleton) => skeletonBlock(skeleton, usedSkeletonNames))
    .filter(Boolean);

  return [
    "#usda 1.0",
    "(",
    `    defaultPrim = "${rootIdentifier}"`,
    "    metersPerUnit = 1",
    '    upAxis = "Y"',
    ")",
    "",
    `def Xform "${rootIdentifier}"`,
    "{",
    '    def Scope "Meshes"',
    "    {",
    meshBlocks.join("\n\n"),
    "    }",
    "",
    '    def Scope "CenterCurves"',
    "    {",
    curveBlocks.join("\n\n"),
    "    }",
    "",
    '    def Scope "Skeletons"',
    "    {",
    skeletonBlocks.join("\n\n"),
    "    }",
    "}",
    ""
  ].join("\n");
}
