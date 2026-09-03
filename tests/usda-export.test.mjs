// tests/usda-export.test.mjs — 纯 node 测试（usda-export.js 仅依赖 bone-model.js 的
// strandSplitTubeCenter 唯一定义点 → three，无 DOM 依赖，可直接 import）：
// 验证骨骼导出的 USD SkelBindingAPI 结构 —— 单个 def SkelRoot "Character" 内含所有
// 发丝的 def Skeleton（joints / bindTransforms / restTransforms，不带 skel: 前缀），
// 蒙皮 mesh 与 Skeleton 同级嵌在 Character SkelRoot 内，rel skel:skeleton 指向
// Skeleton prim（绝对路径 </Root/Character/Name_Skel>），joints token 为相对
// stage root 的完整 prim 路径（Root/Character/Name_Skel/...）。
// 运行：node tests/usda-export.test.mjs

import assert from "node:assert/strict";
import { exportAnimeHairUsda, axesToMat3, splitBoneLayout, splitChainLayout, splitParentMainIndex, bridgeRootParentName, smoothMainPair, tipChainNearestIndex } from "../modules/io/usda-export.js";
// 视口消费方的真实定义点（唯一定义点，standards「一条推导规则只准有一个定义点」）——
// 用于下面的跨消费方一致性断言，不是本地复刻。
import { firstExposedTipChainIndex } from "../modules/geometry/tip-sub-bone.js";

// project-files.js 已把内部骨骼名（main./split.）映射为发丝名前缀（jointNameOf），
// 且 skeleton.name 已是去重后的 `${usdIdentifier(lock.name)}_Skel`；这里直接喂
// 映射后的数据（lock.name="Hair" → "Hair_Skel"、关节 "Hair_0"/"Hair_split_0"）。
const skeleton = {
  name: "Hair_Skel",
  joints: [
    { name: "Hair_0", parent: null, p: [0, 0, 0], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    { name: "Hair_1", parent: "Hair_0", p: [0, 1, 0], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    { name: "Hair_split_0", parent: "Hair_0", p: [1, 0, 0], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] }
  ]
};

const mesh = {
  name: "Hair",
  points: [[0, 0, 0], [0, 1, 0], [0, 2, 0]],
  faces: [[0, 1, 2]],
  skelRootName: "Hair_Skel",
  skelIndices: [[0, 2], [1, 2], [0, 0]],
  skelWeights: [[0.5, 0.5], [0.3, 0.7], [1, 0]]
};

const usda = exportAnimeHairUsda({
  meshes: [mesh],
  skeletons: [skeleton],
  rootName: "Test"
});

// ---- 单个 SkelRoot "Character"（固定名，取代旧的每发丝一个 SkelRoot）----
assert.ok(usda.includes('def SkelRoot "Character"'), "缺单个 def SkelRoot \"Character\"");
assert.ok(!usda.includes('def SkelRoot "Hair_Skel"'), "不应再按发丝输出独立 SkelRoot");
assert.ok(!usda.includes('def SkelRoot "Hair_Skeleton_Skel"'), "不应再出现旧的 Hair_Skeleton_Skel SkelRoot");
// 每个 Skeleton 名 = ${sanitized}_Skel（sanitized = usdIdentifier(lock.name)）。
assert.ok(usda.includes('def Skeleton "Hair_Skel"'), "缺 def Skeleton \"Hair_Skel\"");
// SkelRoot/Skeleton 是类型化 schema，不应写 prepend apiSchemas（只有 mesh 的
// SkelBindingAPI 才需要）。
assert.ok(!usda.includes('prepend apiSchemas = ["Skeleton"]'), "Skeleton 不应有 prepend apiSchemas");
assert.ok(!usda.includes('prepend apiSchemas = ["SkelRoot"]'), "SkelRoot 不应有 prepend apiSchemas");
assert.ok(usda.includes('prepend apiSchemas = ["SkelBindingAPI"]'), "mesh 上应有 SkelBindingAPI schema");
// Skeleton 属性不带 skel: 前缀（UsdSkelSkeleton schema：joints/bindTransforms/restTransforms）。
assert.ok(usda.includes("uniform token[] joints"), "Skeleton 缺 joints");
assert.ok(usda.includes("matrix4d[] bindTransforms"), "Skeleton 缺 bindTransforms");
assert.ok(usda.includes("matrix4d[] restTransforms"), "Skeleton 缺 restTransforms");
assert.ok(!usda.includes("skel:joints"), "不应再出现带前缀的 skel:joints");
assert.ok(!usda.includes("skel:bindTransforms"), "不应再出现带前缀的 skel:bindTransforms");
assert.ok(!usda.includes("skel:restTransforms"), "不应再出现带前缀的 skel:restTransforms");

// ---- 嵌套结构：蒙皮 mesh 嵌在 Character SkelRoot 内（def Skeleton 之后）----
const idxSkelRoot = usda.indexOf('def SkelRoot "Character"');
const idxSkeleton = usda.indexOf('def Skeleton "Hair_Skel"');
const idxMesh = usda.indexOf('def Mesh "Hair"');
assert.ok(idxSkeleton > idxSkelRoot, "def Skeleton 应在 def SkelRoot 之后");
assert.ok(idxMesh > idxSkeleton, "蒙皮 def Mesh 应嵌在 def Skeleton 之后（Character SkelRoot 内）");
// def Mesh 不应出现在 "Meshes" 与 "CenterCurves" 两个 Scope 之间。
const betweenScopes = usda.slice(usda.indexOf('def Scope "Meshes"'), usda.indexOf('def Scope "CenterCurves"'));
assert.ok(!betweenScopes.includes("def Mesh"), "Meshes Scope 内不应有蒙皮 def Mesh");

// ---- joints token 是相对 stage root 的完整 prim 路径（父链 / 拼接，无前导斜杠）----
assert.ok(usda.includes('"Test/Character/Hair_Skel/Hair_0"'), "Hair_0 token 应为完整路径");
assert.ok(usda.includes('"Test/Character/Hair_Skel/Hair_0/Hair_1"'), "Hair_1 token 应为完整路径");
assert.ok(usda.includes('"Test/Character/Hair_Skel/Hair_0/Hair_split_0"'), "split_0 token 应为完整路径");
assert.ok(!usda.includes('"Skel/Hair_0"'), "joint token 不应再相对 Skel 前缀");
assert.ok(
  !usda.includes('"Test/Skeletons/Hair_Skeleton_Skel/Skel/Hair_0"'),
  "joint token 不应带旧 Skeletons Scope 前缀"
);

// ---- bindTransforms 数值（矩阵逻辑未改）：身份 / translate(0,1,0) / translate(1,0,0) ----
const bindLine = usda.split("\n").find((line) => line.includes("bindTransforms"));
assert.ok(bindLine, "缺 bindTransforms 行");
assert.ok(
  bindLine.includes("((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1))"),
  "Hair_0 应为身份矩阵"
);
assert.ok(
  bindLine.includes("((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 1, 0, 1))"),
  "Hair_1 应为 translate(0,1,0)"
);
assert.ok(
  bindLine.includes("((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (1, 0, 0, 1))"),
  "Hair_split_0 应为 translate(1,0,0)"
);
// bind = 世界矩阵；rest = 局部矩阵。本示例 orient 均单位四元数且父为身份，
// 世界与局部恰好相同，故 rest 行 == bind 行。
const restLine = usda.split("\n").find((line) => line.includes("restTransforms"));
assert.equal(restLine, bindLine.replace("bindTransforms", "restTransforms"), "rest 应等于 bind");

// ---- mesh 蒙皮：rel skel:skeleton 指向 Character 内 Skeleton，primvars 带 elementSize ----
assert.ok(
  usda.includes("rel skel:skeleton = </Test/Character/Hair_Skel>"),
  "rel skel:skeleton 应指向 Character 内 Skeleton prim"
);
assert.ok(usda.includes("primvars:skel:jointIndices"), "缺 primvars:skel:jointIndices");
assert.ok(usda.includes("primvars:skel:jointWeights"), "缺 primvars:skel:jointWeights");
assert.ok(usda.includes("elementSize = 2"), "缺 elementSize = 2");
const indicesLine = usda.split("\n").find((line) => line.includes("primvars:skel:jointIndices"));
assert.ok(indicesLine.includes("[0, 2, 1, 2, 0, 0]"), "jointIndices 展平错误");
const weightsLine = usda.split("\n").find((line) => line.includes("primvars:skel:jointWeights"));
assert.ok(weightsLine.includes("[0.5, 0.5, 0.3, 0.7, 1, 0]"), "jointWeights 展平错误");

// ---- 旧的错误写法不应再出现 ----
assert.ok(!usda.includes("rel skel:bindTransforms"), "mesh 上不应再有 rel skel:bindTransforms");
// joints 只应出现在 Skeleton prim 上（mesh 上不应再有；mesh 上的 skel:jointIndices/
// skel:jointWeights 是另一回事，不受影响）。
assert.equal(
  usda.split("uniform token[] joints").length - 1,
  1,
  "uniform token[] joints 应只出现在 Skeleton prim"
);
assert.ok(!usda.includes("primvars:skel:joints"), "不应再有 int2[] primvars:skel:joints");
assert.ok(!usda.includes("primvars:skel:weights"), "不应再有 float2[] primvars:skel:weights");
assert.ok(!usda.includes("def SkelJoint"), "不应再有 def SkelJoint");

// ---- bind=世界 / rest=局部 区分：Rot_1 带旋转且 p:null 时两者相同；p/orient 为 null 不报错 ----
// 新语义（orient = 世界旋转、p = 世界位置）：
// Rot_0: p=[1,2,3], orient=R180X（X 轴 180°）→ 世界 M0 = R·T(p)。
// Rot_1: p=null → 继承父级世界平移 (1,2,3)，世界 = R180X·T(1,2,3) = M0；
//         局部（p 缺失）→ rest = bind = M0。bind 与 rest 均为 [M0, M0]。
const rotated = exportAnimeHairUsda({
  meshes: [],
  skeletons: [{
    name: "Rot_Skel",
    joints: [
      { name: "Rot_0", parent: null, p: [1, 2, 3], orient: [1, 0, 0, 0, -1, 0, 0, 0, -1] },
      { name: "Rot_1", parent: "Rot_0", p: null, orient: [1, 0, 0, 0, -1, 0, 0, 0, -1] }
    ]
  }],
  rootName: "Test"
});
const M0 = "((1, 0, 0, 0), (0, -1, 0, 0), (0, 0, -1, 0), (1, 2, 3, 1))";
const R180X = "((1, 0, 0, 0), (0, -1, 0, 0), (0, 0, -1, 0), (0, 0, 0, 1))";
const T123 = "((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (1, 2, 3, 1))";
const bind2 = rotated.split("\n").find((line) => line.includes("bindTransforms"));
assert.ok(bind2.includes(M0), "bind 缺 Rot_0 世界矩阵");
assert.ok(bind2.includes(M0), "bind 缺 Rot_1 世界矩阵（继承父级位置 + 自身 orient = M0）");
assert.ok(!bind2.includes(R180X), "bind 不应出现 R180X（那是局部矩阵）");
const rest2 = rotated.split("\n").find((line) => line.includes("restTransforms"));
assert.ok(rest2.includes(M0), "rest 缺 Rot_0 局部矩阵");
assert.ok(rest2.includes(M0), "rest 缺 Rot_1 局部矩阵（p 缺失 → rest = bind = M0）");
assert.ok(!rest2.includes(T123), "rest 不应出现 T123（那是旧语义的世界矩阵）");

// ---- 缩进：Character SkelRoot（4 空格）内 Skeleton/mesh 为 8 空格，属性为 12 空格 ----
const meshLine = usda.split("\n").find((line) => line.includes('def Mesh "Hair"'));
assert.ok(meshLine.startsWith("        def Mesh"), "Character SkelRoot 内 def Mesh 应缩进 8 空格");
const pointsLine = usda.split("\n").find((line) => line.trim().startsWith("point3f[] points"));
assert.ok(pointsLine.startsWith("            point3f[]"), "Character SkelRoot 内 mesh 属性应缩进 12 空格");
const jointsLine = usda.split("\n").find((line) => line.trim().startsWith("uniform token[] joints"));
assert.ok(jointsLine.startsWith("            uniform"), "Skeleton 属性应缩进 12 空格");

// ---- 未蒙皮 mesh（无 skelRootName）仍留在 def Scope "Meshes" ----
const unskinned = exportAnimeHairUsda({
  meshes: [{ name: "Hair", points: mesh.points, faces: mesh.faces }],
  skeletons: [skeleton],
  rootName: "Test"
});
const meshesRegion = unskinned.slice(
  unskinned.indexOf('def Scope "Meshes"'),
  unskinned.indexOf('def Scope "CenterCurves"')
);
assert.ok(meshesRegion.includes('def Mesh "Hair"'), "未蒙皮 mesh 应留在 Meshes Scope");
assert.ok(
  meshesRegion.includes("            point3f[] points"),
  "Meshes Scope 内 mesh 属性应缩进 12 空格"
);
// 未蒙皮 mesh 不应写蒙皮绑定。
assert.ok(!meshesRegion.includes("rel skel:skeleton"), "未蒙皮 mesh 不应有 rel skel:skeleton");
// 混合导出：蒙皮 mesh 进 Character SkelRoot，未蒙皮 mesh 留 Meshes。
const mixed = exportAnimeHairUsda({
  meshes: [
    mesh,
    { name: "Cap", points: [[0, 0, 0], [1, 0, 0], [0, 1, 0]], faces: [[0, 1, 2]] }
  ],
  curves: [{ name: "C", points: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]], widths: [1] }],
  skeletons: [skeleton],
  rootName: "Test"
});
assert.ok(
  mixed.indexOf('def Mesh "Hair"') > mixed.indexOf('def Skeleton "Hair_Skel"'),
  "混合导出：蒙皮 mesh 应嵌在 Character SkelRoot 内"
);
const mixedMeshes = mixed.slice(mixed.indexOf('def Scope "Meshes"'), mixed.indexOf('def Scope "CenterCurves"'));
assert.ok(mixedMeshes.includes('def Mesh "Cap"'), "混合导出：未蒙皮 mesh 应留在 Meshes Scope");
assert.ok(!mixedMeshes.includes('def Mesh "Hair"'), "混合导出：Meshes Scope 不应有蒙皮 mesh");

// ---- 同名 lock 去重后的导出（project-files.js 已产出唯一 ${sanitized}_Skel 名）----
// 模拟 project-files.js 去重结果：两个同名 lock "A" 得到 "A_Skel" 与 "A_Skel_2"，
// 单个 def SkelRoot "Character" 内应有两个不同名 Skeleton + 两个蒙皮 mesh，无重复 prim。
const dedupSkeletons = [
  { name: "A_Skel", joints: skeleton.joints },
  { name: "A_Skel_2", joints: skeleton.joints }
];
const dedupUsda = exportAnimeHairUsda({
  meshes: [
    { ...mesh, name: "A", skelRootName: "A_Skel" },
    { ...mesh, name: "A2", skelRootName: "A_Skel_2" }
  ],
  skeletons: dedupSkeletons,
  rootName: "Test"
});
assert.equal(
  dedupUsda.split('def SkelRoot "Character"').length - 1,
  1,
  "应只有一个 def SkelRoot \"Character\"（不再按发丝拆多个 SkelRoot）"
);
assert.ok(dedupUsda.includes('def Skeleton "A_Skel"'), "缺 A_Skel 的 Skeleton");
assert.ok(dedupUsda.includes('def Skeleton "A_Skel_2"'), "缺 A_Skel_2 的 Skeleton");
// 两个 Skeleton + 两个蒙皮 mesh 都在同一个 Character SkelRoot 内，按
// Skeleton A_Skel → Mesh A → Skeleton A_Skel_2 → Mesh A2 顺序排列。
const dRoot = dedupUsda.indexOf('def SkelRoot "Character"');
const dSkel1 = dedupUsda.indexOf('def Skeleton "A_Skel"');
const dMesh1 = dedupUsda.indexOf('def Mesh "A"');
const dSkel2 = dedupUsda.indexOf('def Skeleton "A_Skel_2"');
const dMesh2 = dedupUsda.indexOf('def Mesh "A2"');
assert.ok(
  dRoot < dSkel1 && dSkel1 < dMesh1 && dMesh1 < dSkel2 && dSkel2 < dMesh2,
  "单 SkelRoot 下应按 Skeleton→Mesh 顺序包含两个发丝"
);
// 每个蒙皮 mesh 都绑到各自的 Skeleton（绝对路径，均在 Character 下）。
assert.ok(
  dedupUsda.includes("rel skel:skeleton = </Test/Character/A_Skel>"),
  "A 应绑到 A_Skel"
);
assert.ok(
  dedupUsda.includes("rel skel:skeleton = </Test/Character/A_Skel_2>"),
  "A2 应绑到 A_Skel_2"
);
// 两个 Skeleton 各含一份 joints（joints 出现两次）。
assert.equal(
  dedupUsda.split("uniform token[] joints").length - 1,
  2,
  "两个 Skeleton 应各含一份 joints"
);

// ---- 统一 Skeleton：Hair_Root 空关节作为唯一根，多个发丝 main.0 全部 parent 到它 ----
// project-files.js 重构后：单个 Skeleton "Hair_Skel" 内含 Hair_Root（x=0 正中线，
// y/z 为所有发根平均）+ 每个发丝的 main/split/tip 关节，main.0 parent 到 Hair_Root，
// 形成一棵连通骨骼树。usda-export.js 按 parent 链拼接完整路径，此处直接喂
// 映射后的数据（关节名已是发丝名前缀），验证层级正确。
const hairRootSkeleton = {
  name: "Hair_Skel",
  joints: [
    { name: "Hair_Root", parent: null, p: [0, 1.7, 0], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    { name: "Front_Bangs_1_0", parent: "Hair_Root", p: [-0.3, 1.6, 0.2], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    { name: "Front_Bangs_1_1", parent: "Front_Bangs_1_0", p: [-0.3, 1.1, 0.2], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
    { name: "Front_Bangs_2_0", parent: "Hair_Root", p: [0.3, 1.6, 0.2], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] }
  ]
};
const hairRootMesh = {
  name: "Front_Bangs",
  points: [[0, 0, 0], [0, 1, 0], [0, 2, 0]],
  faces: [[0, 1, 2]],
  skelRootName: "Hair_Skel",
  skelIndices: [[0, 1], [1, 2], [0, 0]],
  skelWeights: [[0.5, 0.5], [0.3, 0.7], [1, 0]]
};
const hairRootUsda = exportAnimeHairUsda({
  meshes: [
    { ...hairRootMesh, name: "Front_Bangs_1" },
    { ...hairRootMesh, name: "Front_Bangs_2" }
  ],
  skeletons: [hairRootSkeleton],
  rootName: "Test"
});
// joints token：Hair_Root 是唯一根；两个发丝的 main.0 都挂在 Hair_Root 下，链式层级正确。
assert.ok(
  hairRootUsda.includes('"Test/Character/Hair_Skel/Hair_Root"'),
  "Hair_Root token 应为完整路径（唯一根）"
);
assert.ok(
  hairRootUsda.includes('"Test/Character/Hair_Skel/Hair_Root/Front_Bangs_1_0"'),
  "Front_Bangs_1_0 token 应挂在 Hair_Root 下"
);
assert.ok(
  hairRootUsda.includes('"Test/Character/Hair_Skel/Hair_Root/Front_Bangs_1_0/Front_Bangs_1_1"'),
  "Front_Bangs_1_1 token 应挂在 Front_Bangs_1_0 下（链式层级）"
);
assert.ok(
  hairRootUsda.includes('"Test/Character/Hair_Skel/Hair_Root/Front_Bangs_2_0"'),
  "Front_Bangs_2_0 token 应挂在 Hair_Root 下"
);
// 只有一个 Skeleton（一份 joints），两个蒙皮 mesh 都绑到它（同一 rel 路径出现两次）。
assert.equal(
  hairRootUsda.split("uniform token[] joints").length - 1,
  1,
  "统一 Skeleton 应只有一份 joints"
);
assert.equal(
  hairRootUsda.split("rel skel:skeleton = </Test/Character/Hair_Skel>").length - 1,
  2,
  "两个蒙皮 mesh 都应绑到 </Test/Character/Hair_Skel>"
);

// ---- axesToMat3：由三个正交轴向量直接构造 3x3 旋转矩阵（row-vector，行 = 基向量）----
// 单位轴 → identity。
assert.deepEqual(
  axesToMat3([1, 0, 0], [0, 1, 0], [0, 0, 1]),
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  "单位轴应得到 identity 矩阵"
);
// {x,y,z} 对象输入与数组输入等价。
assert.deepEqual(
  axesToMat3({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }),
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  "对象输入应得到 identity 矩阵"
);
// 任务目标场景：up=(0,1,0)、tangent=(0,0,1)（z 向前）→ x = up × tangent = (1,0,0)，
// 矩阵行 = [(1,0,0),(0,1,0),(0,0,1)]（与 identity 相同）。
assert.deepEqual(
  axesToMat3(
    { x: 1, y: 0, z: 0 }, // up × tangent = (0,1,0)×(0,0,1) = (1,0,0)
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 }
  ),
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  "up=(0,1,0)/tangent=(0,0,1) 应得到 identity"
);
// 非平凡旋转：up=(0,1,0)、tangent=(1,0,0) → x = up × tangent = (0,0,-1)。
assert.deepEqual(
  axesToMat3(
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 0, z: 0 }
  ),
  [0, 0, -1, 0, 1, 0, 1, 0, 0],
  "非平凡轴应正确构造旋转矩阵"
);
// finiteNumber 保护：非有限/缺失分量 → 0，不抛错。
assert.deepEqual(
  axesToMat3([NaN, 1, 0], [0, 1, 0], [0, 0, 1]),
  [0, 1, 0, 0, 1, 0, 0, 0, 1],
  "非有限分量应被保护为 0"
);
assert.deepEqual(
  axesToMat3(undefined, [0, 1, 0], [0, 0, 1]),
  [0, 0, 0, 0, 1, 0, 0, 0, 1],
  "缺失轴应被保护为 0"
);

// ---- 父级旋转不偏移子级位置：orient 是世界旋转、p 是世界位置 ----
// Drift_Root 绕 x 轴 90°（y→z、z→-y），Drift_Child p=[0,2.2,0]（identity orient）。
// 旧语义把世界差分 (p - parent.p) 当局部偏移再乘父级旋转，子级平移会被转到 z 轴
// （bug 值 (0, 1.7, 0.5)）；新语义下 child 的 bind 平移恒 = 自身 p = (0, 2.2, 0)。
const driftUsda = exportAnimeHairUsda({
  meshes: [],
  skeletons: [{
    name: "Drift_Skel",
    joints: [
      { name: "Drift_Root", parent: null, p: [0, 1.7, 0], orient: [1, 0, 0, 0, 0, 1, 0, -1, 0] },
      { name: "Drift_Child", parent: "Drift_Root", p: [0, 2.2, 0], orient: [1, 0, 0, 0, 1, 0, 0, 0, 1] }
    ]
  }],
  rootName: "Test"
});
const driftBind = driftUsda.split("\n").find((line) => line.includes("bindTransforms"));
assert.ok(
  driftBind.includes("((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 2.2, 0, 1))"),
  "Drift_Child 的 bind 平移应为自身 p=(0, 2.2, 0)，不被父级 90° 旋转转到 z 轴"
);
assert.ok(!driftBind.includes("(0, 1.7, 0.5, 1)"), "Drift_Child 的 bind 不应出现父级旋转带偏的平移");
// USD Skel 规范 bind[i] = rest[i] · bind[parent]：数值验证 rest[child]·bind[root] == bind[child]。
const parseMatrices = (line) => {
  const body = line.slice(line.indexOf("= [") + 3, line.lastIndexOf("]"));
  const numbers = (body.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const matrices = [];
  for (let i = 0; i < numbers.length; i += 16) matrices.push(numbers.slice(i, i + 16));
  return matrices;
};
const multiply4x4 = (a, b) => {
  const out = new Array(16);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      out[row * 4 + col] = (
        a[row * 4] * b[col] + a[row * 4 + 1] * b[4 + col]
        + a[row * 4 + 2] * b[8 + col] + a[row * 4 + 3] * b[12 + col]
      );
    }
  }
  return out;
};
const driftBindMats = parseMatrices(driftBind);
const driftRestLine = driftUsda.split("\n").find((line) => line.includes("restTransforms"));
const driftRestMats = parseMatrices(driftRestLine);
assert.equal(driftBindMats.length, 2, "Drift 应有 2 个 bind 矩阵");
assert.equal(driftRestMats.length, 2, "Drift 应有 2 个 rest 矩阵");
const recomposed = multiply4x4(driftRestMats[1], driftBindMats[0]);
driftBindMats[1].forEach((value, index) => {
  assert.ok(
    Math.abs(value - recomposed[index]) < 1e-5,
    `bind[child] 应与 rest[child]·bind[root] 数值一致（分量 ${index}）`
  );
});
assert.ok(
  Math.abs(driftBindMats[1][12]) < 1e-5 && Math.abs(driftBindMats[1][13] - 2.2) < 1e-5 && Math.abs(driftBindMats[1][14]) < 1e-5,
  "Drift_Child 的 bind 平移应仍 = 自身 p (0, 2.2, 0)"
);

// ---- splitBoneLayout：split 骨骼 fork parent + 派生位置 ----
// 面板/表面分支：forkT = 1 - max(相邻 panelSplits 高度)，p 取 splitTipForSegment
// 的 tip 链末点（stub 抛错时回退曲线末端）；发丝分支：forkT = 1 - splitHeight，
// p = 曲线末端 + 发丝宽度 × spread 沿 frame.x 方向偏移（k=0 向左，其余向右）。
const panelLock = {
  geometryType: "panel",
  panelSplitEnabled: true,
  panelSplits: [
    { position: -0.8066666666666668, height: 0.25 },
    { position: -0.44, height: 0.4375 },
    { position: 0.32999999999999996, height: 0.1875 },
    { position: 0.6966666666666667, height: 0.4375 }
  ],
  points: Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
};
// parentMainIndex = firstExposed − 1，其中第一个暴露索引
// firstExposed = clamp(floor(forkT·(mainCount−1)), 1, mainCount−1) —— fork 所在行本身
// 也暴露（比旧的严格 t > forkT 规则多暴露一行发尖骨骼）。floor（不是 round）仍必要：
// round 会在 frac > 0.5 时把骨骼根抬到自己的第一个暴露子节点上（甚至越过）。
// split.0：heights=[0.25] → forkT 0.75 → floor(0.75·5)=3 = firstExposed → 根 2。
assert.equal(splitBoneLayout(panelLock, { name: "split.0" }, { mainCount: 6 }).parentMainIndex, 2, "split.0 fork 应指向 main.2");
// split.1~4：相邻高度 max=0.4375 → forkT 0.5625 → floor(2.8125)=2 = firstExposed → 根 1。
for (const k of [1, 2, 3, 4]) {
  assert.equal(
    splitBoneLayout(panelLock, { name: `split.${k}` }, { mainCount: 6 }).parentMainIndex,
    1,
    `split.${k} fork 应指向 main.1`
  );
}
// p = tip 链末点；stub 应收到原始 panelSplits 引用与 bone。
const splitCalls = [];
let stubSplits = null;
let stubBone = null;
const splitTipStub = (l, k, splits, b) => {
  splitCalls.push(k);
  stubSplits = splits;
  stubBone = b;
  return { points: [{ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }] };
};
assert.deepEqual(
  splitBoneLayout(panelLock, { name: "split.2" }, { mainCount: 6, splitTipForSegment: splitTipStub }).p,
  [4, 5, 6],
  "p 应为 tip 链末点 [4,5,6]"
);
assert.deepEqual(splitCalls, [2], "stub 应只收到请求的 k");
assert.equal(stubSplits, panelLock.panelSplits, "stub 应收到原始 panelSplits 引用");
assert.deepEqual(stubBone, { name: "split.2" }, "stub 应收到该 bone");
// tip 链关节（split.N.tip.M）不参与。
assert.equal(splitBoneLayout(panelLock, { name: "split.0.tip.0" }, { mainCount: 6 }), null, "tip 链关节应返回 null");
// stub 抛错 → 回退曲线末端。
assert.deepEqual(
  splitBoneLayout(
    panelLock,
    { name: "split.0" },
    { mainCount: 6, curve: { getPoint: () => ({ x: 7, y: 8, z: 9 }) }, splitTipForSegment: () => { throw new Error("boom"); } }
  ).p,
  [7, 8, 9],
  "stub 抛错时应回退到曲线末端 [7,8,9]"
);

// ---- 发丝分支 ----
const strandLock = {
  geometryType: "strand",
  strandSplitEnabled: true,
  strandSplitHeight: 0.36125,
  baseWidth: 0.16,
  points: Array.from({ length: 11 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.12, z: 0 }))
};
const fakeCurve = { getPoint: (t) => (t >= 1 ? { x: 0, y: 0.5, z: 0 } : { x: 0, y: 1.7, z: 0 }) };
const frameStub = () => ({ x: { x: 0, y: 0, z: 1 } });
// forkT = 1 - 0.36125 = 0.63875 → firstExposed = floor(6.3875)=6 → 根 5。
assert.equal(
  splitBoneLayout(strandLock, { name: "split.0", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).parentMainIndex,
  5,
  "发丝 split.0 fork 应指向 main.5"
);
assert.equal(
  splitBoneLayout(strandLock, { name: "split.1", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).parentMainIndex,
  5,
  "发丝 split.1 fork 应指向 main.5"
);
// 0.2.132：派生位置的侧向偏移从 baseWidth·spread·direction（已删除的 opening 平移）改为
// baseWidth·**管中心**。legacy 单标量回退 ⇒ zipper 居中（position 0）⇒ 边界 [-1,0,1] ⇒
// 中心 ∓0.5 ⇒ offset = 0.16·(∓0.5) = ∓0.08。spread 不再参与（故意仍传 0.19：它必须被忽略）。
const p0 = splitBoneLayout(strandLock, { name: "split.0", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).p;
const p1 = splitBoneLayout(strandLock, { name: "split.1", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).p;
[0, 1, 2].forEach((i) => {
  assert.ok(Math.abs(p0[i] - [0, 0.5, -0.08][i]) < 1e-9, `split.0 p[${i}] 应约等于 [0, 0.5, -0.08]`);
  assert.ok(Math.abs(p1[i] - [0, 0.5, 0.08][i]) < 1e-9, `split.1 p[${i}] 应约等于 [0, 0.5, 0.08]`);
});
// Tip Clump 必须完全不影响派生位置（它只控制收窄，不决定管挂在哪）。**两个字段名都试**：
// tipClump 是 0.2.132 起的名字，spread 是旧档字段名，任何一个悄悄回到派生位置都是回归。
["tipClump", "spread"].forEach((field) => {
  [0, 0.5, 0.99].forEach((value) => {
    assert.deepEqual(
      splitBoneLayout(
        strandLock,
        { name: "split.0", [field]: value },
        { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }
      ).p,
      p0,
      `${field} ${value} must not move the derived split bone position`
    );
  });
});
// 无 frame（strandGeometryFrameAt 缺省）→ p 回退曲线末端。
assert.deepEqual(
  splitBoneLayout(strandLock, { name: "split.0", spread: 0.19 }, { mainCount: 11, curve: fakeCurve }).p,
  [0, 0.5, 0],
  "无 frame 时应回退到曲线末端 [0, 0.5, 0]"
);

// ---- 发丝多拉链（N=2 → 3 管）：per-tube forkT + per-tube 管中心 ----
// strandSplits 两条拉链 -> 3 段。fork 深度 = 1 - max(相邻拉链高)：
//   split.0 = 1-0.4=0.6、split.1(中间) = 1-max(0.4,0.2)=0.6、split.2 = 1-0.2=0.8。
// 管中心（边界 [-1,-0.3,0.3,1] 的三个中点）：split.0 = -0.65、split.1 = 0、split.2 = +0.65。
const strandMultiLock = {
  geometryType: "strand",
  strandSplitEnabled: true,
  strandSplits: [
    { position: -0.3, height: 0.4, order: 0 },
    { position: 0.3, height: 0.2, order: 1 }
  ],
  baseWidth: 0.16,
  points: Array.from({ length: 11 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.12, z: 0 }))
};
// parentMainIndex = floor(forkT·10) − 1：split.0/1 → floor(0.6·10)−1=5、split.2 → floor(0.8·10)−1=7。
assert.equal(
  splitBoneLayout(strandMultiLock, { name: "split.0", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).parentMainIndex,
  5,
  "N=2 发丝 split.0 fork = 1-0.4 → main.5"
);
assert.equal(
  splitBoneLayout(strandMultiLock, { name: "split.1", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).parentMainIndex,
  5,
  "N=2 发丝 split.1 fork = 1-max(0.4,0.2) → main.5"
);
assert.equal(
  splitBoneLayout(strandMultiLock, { name: "split.2", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).parentMainIndex,
  7,
  "N=2 发丝 split.2 fork = 1-0.2 → main.7"
);
// 管中心通过 p 的侧向偏移验证：frameStub 的 frame.x=(0,0,1) → p[2] = baseWidth · 管中心。
// tip = fakeCurve(1) = (0,0.5,0)，幅度 = 0.16·0.65 = 0.104（中间管中心 0 ⇒ 偏移 0）。
const mp0 = splitBoneLayout(strandMultiLock, { name: "split.0", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).p;
const mp1 = splitBoneLayout(strandMultiLock, { name: "split.1", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).p;
const mp2 = splitBoneLayout(strandMultiLock, { name: "split.2", spread: 0.19 }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).p;
assert.ok(mp0[2] < 0 && Math.abs(mp0[2] + 0.104) < 1e-9, "split.0 中心 -0.65 → p.z=-0.104");
assert.ok(Math.abs(mp1[2]) < 1e-9, "split.1 中心 0（对称 zipper 的正中间管）→ p.z=0");
assert.ok(mp2[2] > 0 && Math.abs(mp2[2] - 0.104) < 1e-9, "split.2 中心 +0.65 → p.z=+0.104");

// 非对称 zipper：中心必须跟随**真实划分**，而不是被取代的等距 (2k−N)/N 规则。
// 边界 [-1, 0.4, 0.6, 1] ⇒ 中心 -0.3 / 0.5 / 0.8 ⇒ p.z = 0.16 × 中心。
const strandSkewLock = {
  geometryType: "strand",
  strandSplitEnabled: true,
  strandSplits: [
    { position: 0.4, height: 0.4, order: 0 },
    { position: 0.6, height: 0.2, order: 1 }
  ],
  baseWidth: 0.16,
  points: Array.from({ length: 11 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.12, z: 0 }))
};
[[-0.3, 0], [0.5, 1], [0.8, 2]].forEach(([center, k]) => {
  const p = splitBoneLayout(strandSkewLock, { name: `split.${k}` }, { mainCount: 11, curve: fakeCurve, strandGeometryFrameAt: frameStub }).p;
  assert.ok(
    Math.abs(p[2] - 0.16 * center) < 1e-9,
    `skewed zippers: split.${k} centre ${center} → p.z=${0.16 * center}, got ${p[2]}`
  );
});

// ---- bridgeRootParentName：桥接子锁根关节的父骨骼名 ----
const parentLock = { id: "P", points: Array.from({ length: 13 }, (_, i) => ({ x: 0, y: 0, z: 0 })) };
const jointNameOf = (l, name) => l.id + ":" + name;
assert.equal(
  bridgeRootParentName({ branchParentId: "P", branchParentParameter: 0.4166666666666667 }, [parentLock], jointNameOf),
  "P:main.5",
  "round(0.4166667·12)=5 → P:main.5"
);
assert.equal(
  bridgeRootParentName({ branchParentId: "P", branchParentParameter: 0.5 }, [{ id: "P", points: Array.from({ length: 11 }, (_, i) => ({ x: 0, y: 0, z: 0 })) }], jointNameOf),
  "P:main.5",
  "round(0.5·10)=5 → P:main.5"
);
assert.equal(
  bridgeRootParentName({ branchParentId: "P", branchParentParameter: 0.46875 }, [{ id: "P", points: Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 0, z: 0 })) }], jointNameOf),
  "P:main.2",
  "round(0.46875·5)=2 → P:main.2"
);
assert.equal(bridgeRootParentName({}, [parentLock], jointNameOf), null, "无 branchParentId → null");
assert.equal(bridgeRootParentName({ branchParentId: "Q" }, [parentLock], jointNameOf), null, "父锁缺失 → null");
assert.equal(
  bridgeRootParentName({ branchParentId: "P" }, [{ id: "P", points: [{ x: 0, y: 0, z: 0 }] }], jointNameOf),
  null,
  "父锁只有 1 点 → null"
);

// ---- 非 split 骨骼 ----
assert.equal(splitBoneLayout(panelLock, { name: "main.3" }, { mainCount: 6 }), null, "main 骨骼应返回 null");

// ---- splitChainLayout：发尖暴露链导出（split 骨骼 = 链根 + tip 关节链式）----
// split 骨骼是暴露段 tip 链的链根：位置/旋转直接采样 tip 链，其后的暴露点成为
// split.N.tip.M 关节并 root→tip 链式 parent；fork 参数决定父主骨骼索引。
const tipChainLock = {
  geometryType: "panel",
  panelSplitEnabled: true,
  panelSplits: [
    { position: -0.8066666666666668, height: 0.25 },
    { position: -0.44, height: 0.4375 },
    { position: 0.32999999999999996, height: 0.1875 },
    { position: 0.6966666666666667, height: 0.4375 }
  ],
  points: Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
};
const tipChainStub = (l, k, splits, b) => ({
  points: Array.from({ length: 6 }, (_, i) => ({ x: i, y: 10 + i, z: 20 + i })),
  restPoints: Array.from({ length: 6 }, (_, i) => ({ x: i, y: 10 + i, z: 20 + i })),
  twists: [],
  active: true
});
// y=tangent=(0,0,1)、z=up=(0,1,0) → cross(z,y)=(1,0,0) → identity。
const identityTipFrame = () => ({ x: { x: 0, y: 0, z: 1 }, y: { x: 0, y: 0, z: 1 }, z: { x: 0, y: 1, z: 0 } });
// split.0：forkT = 1-0.25 = 0.75 → firstExposed = floor(0.75·5)=3 → 暴露 3/4/5 → 3 关节
// （fork 行本身也暴露，比旧规则多一根发尖骨骼）。
const chain0 = splitChainLayout(tipChainLock, { name: "split.0" }, {
  mainCount: 6,
  splitTipForSegment: tipChainStub,
  panelTipChainFrameAt: identityTipFrame
});
assert.equal(chain0.joints.length, 3, "split.0 应有 3 个暴露关节");
assert.equal(chain0.joints[0].name, "split.0", "链根关节名应为 split.0");
assert.equal(chain0.joints[0].parent, "main.2", "split.0 父级应为 main.2（firstExposed 3 − 1，严格位于第一个暴露点之下）");
assert.deepEqual(chain0.joints[0].p, [3, 13, 23], "split.0 位置应直接采样 tip 链点 3");
assert.deepEqual(chain0.joints[0].orient, [1, 0, 0, 0, 1, 0, 0, 0, 1], "身份 frame 应得到 identity orient");
assert.equal(chain0.joints[1].name, "split.0.tip.4", "第二关节名应为 split.0.tip.4");
assert.equal(chain0.joints[1].parent, "split.0", "tip.4 应链到 split.0");
assert.deepEqual(chain0.joints[1].p, [4, 14, 24], "tip.4 位置应直接采样 tip 链点 4");
assert.equal(chain0.joints[2].name, "split.0.tip.5", "第三关节名应为 split.0.tip.5");
assert.equal(chain0.joints[2].parent, "split.0.tip.4", "tip.5 应链到 tip.4");
assert.deepEqual(chain0.joints[2].p, [5, 15, 25], "tip.5 位置应直接采样 tip 链点 5");
// split.1：forkT = 1-max(0.25,0.4375) = 0.5625 → firstExposed = floor(2.8125)=2 →
// 暴露 2/3/4/5 → 4 关节链式。
const chain1 = splitChainLayout(tipChainLock, { name: "split.1" }, {
  mainCount: 6,
  splitTipForSegment: tipChainStub,
  panelTipChainFrameAt: identityTipFrame
});
assert.equal(chain1.joints.length, 4, "split.1 应有 4 个暴露关节");
assert.equal(chain1.joints[0].name, "split.1", "链根关节名应为 split.1");
assert.equal(chain1.joints[0].parent, "main.1", "split.1 父级应为 main.1（firstExposed 2 − 1，严格位于第一个暴露点之下）");
assert.equal(chain1.joints[1].name, "split.1.tip.3", "第二关节名应为 split.1.tip.3");
assert.equal(chain1.joints[1].parent, "split.1", "tip.3 应链到 split.1");
assert.equal(chain1.joints[2].name, "split.1.tip.4", "第三关节名应为 split.1.tip.4");
assert.equal(chain1.joints[2].parent, "split.1.tip.3", "tip.4 应链到 tip.3");
assert.equal(chain1.joints[3].name, "split.1.tip.5", "第四关节名应为 split.1.tip.5");
assert.equal(chain1.joints[3].parent, "split.1.tip.4", "tip.5 应链到 tip.4");
// 非身份 frame：y=(0,1,0)、z=(0,0,1) → cross(z,y)=(-1,0,0) → 非对角矩阵。
const nonIdentityTipFrame = () => ({ x: { x: 0, y: 0, z: 1 }, y: { x: 0, y: 1, z: 0 }, z: { x: 0, y: 0, z: 1 } });
const chainRot = splitChainLayout(tipChainLock, { name: "split.0" }, {
  mainCount: 6,
  splitTipForSegment: tipChainStub,
  panelTipChainFrameAt: nonIdentityTipFrame
});
assert.deepEqual(chainRot.joints[0].orient, [-1, 0, 0, 0, 0, 1, 0, 1, 0], "非身份 frame 应正确构造旋转矩阵");
// 抛错 frame → 每个关节 orient 均为 null。
const chainThrowing = splitChainLayout(tipChainLock, { name: "split.0" }, {
  mainCount: 6,
  splitTipForSegment: tipChainStub,
  panelTipChainFrameAt: () => { throw new Error("boom"); }
});
assert.ok(chainThrowing.joints.every((j) => j.orient === null), "抛错 frame 时所有关节 orient 应为 null");
// splitTipForSegment 返回 null → 无 tip 链 → 整体 null。
assert.equal(
  splitChainLayout(tipChainLock, { name: "split.0" }, { mainCount: 6, splitTipForSegment: () => null, panelTipChainFrameAt: identityTipFrame }),
  null,
  "splitTipForSegment 返回 null 时整体应返回 null"
);
// 非 split 骨骼 / tip 链关节 → null。
assert.equal(splitChainLayout(tipChainLock, { name: "main.3" }, { mainCount: 6 }), null, "main 骨骼应返回 null");
assert.equal(splitChainLayout(tipChainLock, { name: "split.0.tip.5" }, { mainCount: 6 }), null, "tip 链关节应返回 null");

// ---- 发丝分支：tip 链 = 主链曲线 + 宽度 × 管中心 侧向偏移（0.2.132：沿全长恒定）----
const strandChainLock = {
  geometryType: "strand",
  strandSplitEnabled: true,
  strandSplitHeight: 0.36125,
  baseWidth: 0.16,
  points: Array.from({ length: 11 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.12, z: 0 }))
};
const strandChainCurve = { getPoint: (t) => ({ x: 0, y: 1 - t, z: 0 }) };
const strandChainFrame = () => ({ x: { x: 0, y: 0, z: 1 }, y: { x: 0, y: 0, z: 1 }, z: { x: 0, y: 1, z: 0 } });
const strandMaterializeStub = (authored, restPointAt, count) => ({
  points: Array.from({ length: count }, (_, i) => restPointAt(i / Math.max(1, count - 1))),
  restPoints: [],
  twists: [],
  active: true
});
const strandChain = splitChainLayout(strandChainLock, { name: "split.0" }, {
  mainCount: 11,
  curve: strandChainCurve,
  strandGeometryFrameAt: strandChainFrame,
  materializeTipChain: strandMaterializeStub,
  strandTipChainFrameAt: strandChainFrame
});
// forkT = 1-0.36125 = 0.63875；firstExposed = floor(6.3875)=6 → 6/7/8/9/10 → 5 关节。
assert.equal(strandChain.joints.length, 5, "发丝 split.0 应有 5 个暴露关节（firstExposed 6 → 6/7/8/9/10）");
assert.equal(strandChain.joints[0].name, "split.0", "发丝链根应为 split.0");
assert.equal(strandChain.joints[0].parent, "main.5", "发丝 split.0 父级应为 main.5");
assert.equal(strandChain.joints[1].name, "split.0.tip.7", "第二关节名应为 split.0.tip.7");
assert.equal(strandChain.joints[2].name, "split.0.tip.8", "第三关节名应为 split.0.tip.8");
assert.equal(strandChain.joints[3].name, "split.0.tip.9", "第四关节名应为 split.0.tip.9");
assert.equal(strandChain.joints[4].name, "split.0.tip.10", "第五关节名应为 split.0.tip.10");
assert.equal(strandChain.joints[1].parent, "split.0", "tip.7 应链到 split.0");
assert.equal(strandChain.joints[2].parent, "split.0.tip.7", "tip.8 应链到 tip.7");
assert.equal(strandChain.joints[3].parent, "split.0.tip.8", "tip.9 应链到 tip.8");
assert.equal(strandChain.joints[4].parent, "split.0.tip.9", "tip.10 应链到 tip.9");
// p：restPointAt(t) = curve(t) + frame.x · (baseWidth × 管中心)。0.2.132 起该偏移**沿全长
// 恒定**（管的 band 是等宽裁剪，中心不随 t 变），所以不再有 smoothstep/splitStart 项 ——
// 原先那套是已删除的 opening 平移（spread × smoothstep × direction）。
// legacy 单标量回退 ⇒ zipper 居中 ⇒ 管 0 中心 = -0.5 ⇒ 偏移 = 0.16 × (-0.5) = -0.08。
const expectedTubeOffset = 0.16 * -0.5;
assert.ok(
  Math.abs(strandChain.joints[0].p[2] - expectedTubeOffset) < 1e-9,
  `发丝 split.0 位置 z 应约等于 ${expectedTubeOffset}（实测 ${strandChain.joints[0].p[2]}）`
);
// 恒定性：链上每个关节的横向偏移都相同（旧实现是沿 t 斜升的）。
strandChain.joints.forEach((joint, i) => {
  assert.ok(
    Math.abs(joint.p[2] - expectedTubeOffset) < 1e-9,
    `joint ${i} 的横向偏移应与管中心一致（恒定），实测 ${joint.p[2]}`
  );
});
assert.deepEqual(strandChain.joints[0].orient, [1, 0, 0, 0, 1, 0, 0, 0, 1], "发丝身份 frame 应得到 identity orient");

// ---- 无暴露段：forkT=1 → 回退末点，单关节 ----
const singleSplitLock = {
  geometryType: "panel",
  panelSplitEnabled: true,
  panelSplits: [{ position: 0, height: 0 }],
  points: Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
};
const noExposure = splitChainLayout(singleSplitLock, { name: "split.0" }, {
  mainCount: 6,
  splitTipForSegment: tipChainStub,
  panelTipChainFrameAt: identityTipFrame
});
assert.equal(noExposure.joints.length, 1, "无暴露段时应回退为单关节");
assert.equal(noExposure.joints[0].name, "split.0", "回退关节名应为 split.0");
// forkT=1 → firstExposed 钳到末点 5（单关节），根 = 5 − 1 = 4：新规则连这个退化情形
// 也满足 root < firstExposed（旧规则下根 = 5 = 暴露点本身）。
assert.equal(noExposure.joints[0].parent, "main.4", "forkT=1 → parentMainIndex 应为 main.4");
assert.deepEqual(noExposure.joints[0].p, [5, 15, 25], "回退关节位置应为 tip 链末点 [5,15,25]");

// mainCount 1 → null（无 tip 链可导出：发丝分支缺 materializeTipChain）。
assert.equal(
  splitChainLayout(strandChainLock, { name: "split.0" }, { mainCount: 1, curve: strandChainCurve, strandGeometryFrameAt: strandChainFrame }),
  null,
  "mainCount 1 且无 materializeTipChain → null"
);

// ---- 空容器省略：无内容时不再输出空的 Scope/SkelRoot ----
// 全部蒙皮（现有 usda fixture：mesh+skeleton 均 skinned）→ Meshes/CenterCurves
// 省略，仍保留 Character SkelRoot。
assert.ok(!usda.includes('def Scope "Meshes"'), "全部蒙皮时应省略 def Scope \"Meshes\"");
assert.ok(!usda.includes('def Scope "CenterCurves"'), "未传 curves 时应省略 def Scope \"CenterCurves\"");
assert.ok(usda.includes('def SkelRoot "Character"'), "全部蒙皮时仍应输出 Character SkelRoot");

// 仅曲线：CenterCurves 存在，Meshes/SkelRoot 省略。
const curvesOnly = exportAnimeHairUsda({
  curves: [{ name: "C", points: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]], widths: [1] }],
  rootName: "Test"
});
assert.ok(curvesOnly.includes('def Scope "CenterCurves"'), "仅曲线时应输出 CenterCurves Scope");
assert.ok(!curvesOnly.includes('def Scope "Meshes"'), "仅曲线时不应输出 Meshes Scope");
assert.ok(!curvesOnly.includes("def SkelRoot"), "仅曲线时不应输出 SkelRoot");

// 什么都不导出：仅 Xform 根（合法 USDA）。
const nothing = exportAnimeHairUsda({ rootName: "Test" });
assert.ok(nothing.includes('def Xform "Test"'), "空导出仍应含 def Xform");
assert.ok(!nothing.includes('def Scope "Meshes"'), "空导出不应有 Meshes Scope");
assert.ok(!nothing.includes('def Scope "CenterCurves"'), "空导出不应有 CenterCurves Scope");
assert.ok(!nothing.includes("def SkelRoot"), "空导出不应有 SkelRoot");

// 仅未蒙皮 mesh（无 skelRootName）：Meshes 存在，无 CenterCurves/SkelRoot。
const unskinnedOnly = exportAnimeHairUsda({
  meshes: [{ name: "Cap", points: [[0, 0, 0], [1, 0, 0], [0, 1, 0]], faces: [[0, 1, 2]] }]
});
assert.ok(unskinnedOnly.includes('def Scope "Meshes"'), "未蒙皮 mesh 时应输出 Meshes Scope");
assert.ok(unskinnedOnly.includes('def Mesh "Cap"'), "未蒙皮 mesh 应留在 Meshes Scope");
assert.ok(!unskinnedOnly.includes('def Scope "CenterCurves"'), "无曲线时不应输出 CenterCurves Scope");
assert.ok(!unskinnedOnly.includes("def SkelRoot"), "无骨架时不应输出 SkelRoot");

// ---- smoothMainPair：平滑主链蒙皮绑定混合（[mainIdx, nextIdx] × [1-frac, frac]）----
assert.deepEqual(smoothMainPair(0, 6), { main: 0, next: 1, frac: 0 }, "t=0 → main 0/next 1/frac 0");
assert.deepEqual(smoothMainPair(0.5, 6), { main: 2, next: 3, frac: 0.5 }, "t=0.5 → x=2.5 → main 2/next 3/frac 0.5");
assert.deepEqual(smoothMainPair(0.25, 6), { main: 1, next: 2, frac: 0.25 }, "t=0.25 → x=1.25 → main 1/next 2/frac 0.25");
assert.deepEqual(smoothMainPair(1, 6), { main: 5, next: 5, frac: 0 }, "t=1 → 链尾 main===next");
// 0.99·5 = 4.9500000000000002（IEEE-754 下 0.99 不精确）→ main/next 精确、frac 容差比较。
const pair099 = smoothMainPair(0.99, 6);
assert.deepEqual({ main: pair099.main, next: pair099.next }, { main: 4, next: 5 }, "t=0.99 → main 4/next 5");
assert.ok(Math.abs(pair099.frac - 0.95) < 1e-9, `t=0.99 → frac 应约等于 0.95（实测 ${pair099.frac}）`);
assert.deepEqual(smoothMainPair(2, 6), { main: 5, next: 5, frac: 0 }, "t=2 应钳到 1");
assert.deepEqual(smoothMainPair(-1, 6), { main: 0, next: 1, frac: 0 }, "t=-1 应钳到 0");
assert.deepEqual(smoothMainPair(0.5, 1), { main: 0, next: 0, frac: 0 }, "mainCount=1 → n-1=0 → x=0");

// ---- tipChainNearestIndex：暴露区最近发尖链关节 ----
// 链点 i 的主链参数 t_i = i/(mainCount-1)，暴露区 = t_i > forkT（视口规则）；
// 返回暴露区内最接近参数 t 的链索引（无暴露 → 末点）与暴露起点 i0。
// 暴露起点 i0 = clamp(floor(forkT·last), 1, last)，与 splitChainLayout 的暴露循环同规则
// （fork 行本身也暴露，比旧的 floor+1 多一行）。
// mainCount 6 → last = 5；forkT 0.75 → i0 = floor(0.75·5) = 3。
assert.deepEqual(tipChainNearestIndex(1, 6, 0.75), { index: 5, i0: 3 }, "t=1 → 末点 5（i0=3）");
assert.deepEqual(tipChainNearestIndex(0.8, 6, 0.75), { index: 4, i0: 3 }, "t=0.8 → ci=4.0 → round 4（i0=3）");
assert.deepEqual(tipChainNearestIndex(0.6, 6, 0.75), { index: 3, i0: 3 }, "t=0.6 → ci=3.0 → 3 = i0（split 根自身）");
assert.deepEqual(tipChainNearestIndex(0.99, 6, 0.75), { index: 5, i0: 3 }, "t=0.99 → ci=4.95 → 末点 5");
// forkT 0.5625 → i0 = floor(0.5625·5) = 2。
assert.deepEqual(tipChainNearestIndex(0.4, 6, 0.5625), { index: 2, i0: 2 }, "t=0.4 → ci=2.0 → 2 = i0");
assert.deepEqual(tipChainNearestIndex(0.6, 6, 0.5625), { index: 3, i0: 2 }, "t=0.6 → ci=3.0 → 3");
assert.deepEqual(tipChainNearestIndex(0.9, 6, 0.5625), { index: 5, i0: 2 }, "t=0.9 → ci=4.5 → JS round 4.5 = 5");
assert.deepEqual(tipChainNearestIndex(1, 6, 0.5625), { index: 5, i0: 2 }, "t=1 → 末点 5");
// forkT 1 → 仅末点暴露（单暴露点）。
assert.deepEqual(tipChainNearestIndex(1, 6, 1), { index: 5, i0: 5 }, "forkT=1 → 仅末点 5 暴露");
// t 越界钳到 [0,1]：t=2 同 t=1；t=-1 → ci=0 → 钳到 i0。
assert.deepEqual(tipChainNearestIndex(2, 6, 0.75), { index: 5, i0: 3 }, "t=2 → 同 t=1");
assert.deepEqual(tipChainNearestIndex(-1, 6, 0.75), { index: 3, i0: 3 }, "t=-1 → ci=0 → index=3=i0");
// forkT 0 → floor(0)=0，下界钳到 1（索引 0 是坐在主链上的链根，不作为发尖关节）。
assert.deepEqual(tipChainNearestIndex(0, 6, 0), { index: 1, i0: 1 }, "forkT=0 → i0 下界钳到 1");
// mainCount 2 → last = 1；forkT 0.5 → floor(0.5)=0 → 钳到 1。
assert.deepEqual(tipChainNearestIndex(1, 2, 0.5), { index: 1, i0: 1 }, "mainCount=2 → 单暴露点 1");
// 与 smoothMainPair 边界一致性：暴露区内取点，index 永不小于 i0（整型比较，无容差）。
for (const t of [0, 0.5, 0.75, 0.99, 1]) {
  const nearest = tipChainNearestIndex(t, 6, 0.5625);
  assert.ok(nearest.index >= nearest.i0, `forkT=0.5625/mainCount=6 时 t=${t} → index=${nearest.index} 应 >= i0=${nearest.i0}`);
}

// ---- 回归：split 骨骼根索引必须严格小于它自己的第一个暴露链索引 ----
// 行为守卫，不是复刻品守卫：firstExposed 不在测试里重新推导公式，而是从生产输出反推
// ——firstExposedFromProd = mainCount − joints.length（成立前提：splitChainLayout 的
// panel 分支里 n === mainCount，见 usda-export.js:744-746 的注释）——并与
// firstExposedTipChainIndex（tip-sub-bone.js，视口把手/引导线/gizmo 的唯一定义点）
// 逐值核对。这样改生产侧任一端（:739 的暴露 clamp，或 splitParentMainIndex 的 − 1）
// 都会让 joints.length 或 parentMainIndex 变化而被本守卫捉到；旧版在测试里本地复刻了
// `Math.min(last, Math.max(1, Math.floor(forkT*last)))`，改生产公式不会牵动它，
// 是假守卫（历史教训：复刻品守卫 = 假守卫，不要再加回来）。
// mainCount 覆盖 {2,3,5,6}：每档都放一个落在 floor(forkT·(mainCount−1)) === 0 危险区
// 的高度（原下界 clamp 的 `Math.max(1, …)` 正是为这个区兜底，去掉 `-1`/下界会在这里露馅），
// mainCount=6 那 6 个高度是原回归值，保留作全区覆盖 + 历史值不丢的双重保险。
const rootIndexCases = [
  // mainCount=2 → last=1，任意 height>0 都落在 floor(forkT·1)===0 区（forkT<1）。
  { mainCount: 2, heights: [0.5] },
  // mainCount=3 → last=2，需 forkT<0.5 即 height>0.5。
  { mainCount: 3, heights: [0.6] },
  // mainCount=5 → last=4，需 forkT<0.25 即 height∈(0.75,0.78]（app.js:1577 钳到 0.78）。
  { mainCount: 5, heights: [0.76] },
  { mainCount: 6, heights: [0.4375, 0.5, 0.3, 0.2, 0.78, 0.28] }
];
const tipChainStubFor = (count) => (l, k, splits, b) => ({
  points: Array.from({ length: count }, (_, i) => ({ x: i, y: 10 + i, z: 20 + i })),
  restPoints: Array.from({ length: count }, (_, i) => ({ x: i, y: 10 + i, z: 20 + i })),
  twists: [],
  active: true
});
for (const { mainCount, heights } of rootIndexCases) {
  const chainLast = mainCount - 1;
  const stub = tipChainStubFor(mainCount);
  for (const height of heights) {
    const forkT = 1 - height;
    const dangerZoneFloor = Math.floor(forkT * chainLast);
    // splitBoneLayout（面板分支）：单 zipper → 相邻高度 max = height。
    const heightLock = {
      geometryType: "panel",
      panelSplitEnabled: true,
      panelSplits: [{ position: 0, height }],
      points: Array.from({ length: mainCount }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
    };
    // splitChainLayout：生产输出，不重算公式。
    const heightChain = splitChainLayout(heightLock, { name: "split.0" }, {
      mainCount,
      splitTipForSegment: stub,
      panelTipChainFrameAt: identityTipFrame
    });
    // 反推暴露起点：n===mainCount（面板分支恒等式，见 usda-export.js:744-746）。
    const firstExposedFromProd = mainCount - heightChain.joints.length;
    const rootIndex = splitParentMainIndex(forkT, mainCount);
    assert.ok(
      rootIndex < firstExposedFromProd,
      `mainCount=${mainCount} h=${height}（forkT=${forkT}，floor(forkT·last)=${dangerZoneFloor}）：` +
      `根索引 ${rootIndex} 应严格小于生产反推的暴露起点 ${firstExposedFromProd}`
    );
    assert.equal(
      rootIndex,
      firstExposedFromProd - 1,
      `mainCount=${mainCount} h=${height}：根应正好锚在生产反推暴露起点下方一格`
    );
    // 与视口/gizmo/笔刷的唯一定义点 firstExposedTipChainIndex 逐值核对（跨消费方一致性；
    // 该函数上方注释点名 usda-export.js 是「受控副本」，数值必须一致）。
    const viewportFirstExposed = firstExposedTipChainIndex(forkT, mainCount);
    assert.equal(
      firstExposedFromProd,
      viewportFirstExposed,
      `mainCount=${mainCount} h=${height}：生产反推的暴露起点 ${firstExposedFromProd} 应与视口 ` +
      `firstExposedTipChainIndex ${viewportFirstExposed} 一致`
    );
    assert.equal(
      rootIndex,
      viewportFirstExposed - 1,
      `mainCount=${mainCount} h=${height}：splitParentMainIndex 应等于 firstExposedTipChainIndex − 1`
    );
    // 链根 parent 与位置：直接读生产输出，不重算。
    assert.equal(
      heightChain.joints[0].parent,
      `main.${rootIndex}`,
      `mainCount=${mainCount} h=${height}：splitChainLayout 链根父级应为 main.${rootIndex}`
    );
    assert.deepEqual(
      heightChain.joints[0].p,
      [firstExposedFromProd, 10 + firstExposedFromProd, 20 + firstExposedFromProd],
      `mainCount=${mainCount} h=${height}：链根应采样第一个暴露链点 ${firstExposedFromProd}`
    );
    // splitBoneLayout 的 fork parent 也必须与同一个 rootIndex 一致（两条独立数据流不能分叉）。
    for (const k of [0, mainCount > 2 ? 1 : 0]) {
      assert.equal(
        splitBoneLayout(heightLock, { name: `split.${k}` }, { mainCount }).parentMainIndex,
        rootIndex,
        `mainCount=${mainCount} h=${height}：splitBoneLayout split.${k} 根索引应为 ${rootIndex}`
      );
    }
  }
}
// mainCount <= 1 时恒为 0（保持既有行为）。
assert.equal(splitParentMainIndex(0.5, 1), 0, "mainCount=1 → 根索引 0");
assert.equal(splitParentMainIndex(0.5, 0), 0, "mainCount=0 → 根索引 0");
// forkT 越界钳到 [0,1]，索引钳到 [0, mainCount-1]。
assert.equal(splitParentMainIndex(-1, 6), 0, "forkT=-1 → 钳到根索引 0");
assert.equal(splitParentMainIndex(2, 6), 4, "forkT=2 → 钳到 forkT=1 → 根索引 4");
assert.equal(splitParentMainIndex(1, 6), 4, "forkT=1（仅末点暴露）→ 根索引 4");

console.log("usda-export.test.mjs: all assertions passed");
