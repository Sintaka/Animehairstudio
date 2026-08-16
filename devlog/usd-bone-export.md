# USD 骨骼/蒙皮导出规范（0.2.93–0.2.105，Houdini 22 实测）

> 专题文档：记录「USDA 骨骼导出（Bones & Capture Mesh）」从 0.2.93 到 0.2.105 经
> Houdini 22.0（`kinefx::usdcharacterimport` / `usdanimimport`）实测迭代后的**最终规范**。
> 修复历程见 [bug-fixes.md](bug-fixes.md) #2；本文描述当前代码行为（以代码为准）。

## 代码位置 / 数据流

| 层 | 文件 | 职责 |
|---|---|---|
| 数据组织 | `modules/io/project-files.js` `buildHairUsda()` | 收集 meshes / curves / skeletons，生成关节名、Hair_Root、蒙皮权重、orient 派生 |
| 文本生成 | `modules/io/usda-export.js` `exportAnimeHairUsda()` | meshBlock / skeletonBlock / curveBlock，输出 .usda 文本 |
| 回归测试 | `tests/usda-export.test.mjs` | 纯 node 回归 |

调用链：导出菜单 → `performFileAction` → `buildHairUsda({ includeMesh, includeCurves, includeBones, rootName })`
→ `exportAnimeHairUsda({ meshes, curves, skeletons, rootName })` → 写盘 / 下载。
快速导出（Ctrl+Alt+S）复用 `deps.lastExport` 走同一 `buildHairUsda`。

## 1. 导出结构

```
#usda 1.0
(
    defaultPrim = "<rootName>"      # usdIdentifier(rootName)
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "<rootName>"
{
    def Scope "Meshes"        # 未蒙皮 mesh（meshBlock，缩进 8）
    { ... }

    def Scope "CenterCurves"  # 发丝中心曲线（curveBlock）
    { ... }

    def SkelRoot "Character"  # 单个 SkelRoot：Skeleton 与蒙皮 mesh 同级（缩进 8）
    {
        def Skeleton "Hair_Skel"
        {
            uniform token[] joints = [...]
            uniform matrix4d[] bindTransforms = [...]
            uniform matrix4d[] restTransforms = [...]
        }
        def Mesh "<skinned>"  # 蒙皮 mesh，与 Skeleton 同级
        { ... }
    }
}
```

- **单个 `def SkelRoot "Character"`**（`characterSkelRootName = "Character"`，固定名）：
  所有发丝的 Skeleton + 蒙皮 mesh 都在里面，`usdcharacterimport` 只需填一个
  `skelrootpath = /<rootName>/Character` 即一次导入整角色（0.2.96 由「每发丝一个 SkelRoot」合并而来）。
- `def SkelRoot` / `def Skeleton` 是**类型化 schema**（def 即设类型），不写
  `prepend apiSchemas`；只有蒙皮 mesh 写 `prepend apiSchemas = ["SkelBindingAPI"]`。
- Skeleton 属性名**不带 `skel:` 前缀**（`joints`/`bindTransforms`/`restTransforms`）；
  只有 mesh 上的 SkelBindingAPI 属性带 `skel:` 前缀（0.2.94 修复误加前缀导致
  `UsdSkelCache.GetSkelQuery().GetJointOrder()` 读到空）。
- **蒙皮 mesh 必须嵌在 SkelRoot 之下**（USD 规范 "A SkelRoot must be defined at or above a
  skinned primitive"）：蒙皮 mesh（`mesh.skelRootName` 命中有效 skeleton 且蒙皮数据完整）
  与 Skeleton 同级嵌入 Character；未蒙皮 mesh 留在 `Scope "Meshes"`（0.2.94 修复
  mesh 放 Meshes 与 SkelRoot 兄弟 → 导入 0 点）。
- meshBlock 输出：`point3f[] points`、`int[] faceVertexCounts`、`int[] faceVertexIndices`、
  `uniform token subdivisionScheme = "none"`；可选 `normal3f[] normals`（vertex）、
  `texCoord2f[] primvars:st`（faceVarying，indices = faceVertexIndices）、
  `color3f[] primvars:displayColor`（vertex）、`float4[] primvars:animeHairStudio:tangent`（vertex）、
  `int[] primvars:AHS_gridRow` / `AHS_gridCol`（vertex）、`int[] primvars:uvisland`（uniform，每面一个值）、
  metadata：`custom string animeHairStudio:sourceName/group/layer`。
- `Scope "CenterCurves"`：`def BasisCurves`（uniform token type="cubic"、basis="catmullRom"、
  wrap="pinned"、`int[] curveVertexCounts`、`point3f[] points`、`float[] widths` constant，
  宽度 = `max(0.001, lock.width * 0.06)`）。
- 过滤规则：mesh 需 `points.length > 0 && faces.length > 0`；曲线需 `points.length >= 4`。

### 蒙皮 mesh 的 SkelBindingAPI

```usda
def Mesh "Front_Bangs_1" (
    prepend apiSchemas = ["SkelBindingAPI"]
)
{
    rel skel:skeleton = </<rootName>/Character/Hair_Skel>
    int[] primvars:skel:jointIndices = [0, 0, 1, 1, ...] (
        elementSize = 2
        interpolation = "vertex"
    )
    float[] primvars:skel:jointWeights = [1, 0, 1, 0, ...] (
        elementSize = 2
        interpolation = "vertex"
    )
    ...
}
```

- `rel skel:skeleton` 指向 `<rootName>/Character/Hair_Skel`（Skeleton prim 路径）。
- `elementSize` = 每顶点影响数 = `skelIndices[0].length`（当前统一 2，多余权重为 0）。
- `hasSkinData(mesh)`：`skelIndices.length === points.length && skelWeights.length === points.length`，
  与 meshBlock 的蒙皮判定一致。
- 蒙皮数据不完整的 mesh 不带 SkelBindingAPI，留在 `Scope "Meshes"`。

## 2. 骨骼层级：Hair_Root 单根

- 单个 Skeleton 名 `Hair_Skel`（`SKEL_NAME`；usda-export.js 的 skeletonBlock 本身支持多
  Skeleton 的通用路径与防御性去重，但 `buildHairUsda` 恰好只产出这一个）。
- 空关节 **`Hair_Root`**（`HAIR_ROOT_NAME`）：`parent = null`，
  `p = [0, rootY/rootCount, rootZ/rootCount]`——**x=0 正中线，y/z 取所有发丝 `main.0`
  的 p 平均**（无发丝时 `[0,0,0]`），`orient = null`。
- 每个发丝（`bonesFor` 输出 ≥2 根骨骼，且过滤掉 `child.*` 前缀）的 `main.0` **parent 到
  `Hair_Root`**；其余关节按 `bone.parent` 挂接（0.2.106 起 split/桥接子发片有专门规则，见 §9）：
  - `bone.parent === "main"` → parent = 该发丝 `main.0`（split 骨骼的 legacy 兜底语义）；
  - 其他 `bone.parent` → `nameMap.get(bone.parent)`（已映射为发丝名前缀）；
  - 无 parent → `Hair_Root`。
- **0.2.106 例外（优先于上述规则）**：
  - split 骨骼（`split.${k}`，非 tip 链）：parent = 该发丝 `main.${forkIdx}`——forkIdx 由
    暴露段起点参数（panel：`forkT = 1 - max(两侧 zipper 高)`；发丝管：`forkT = 1 - strandSplitHeight`）
    映射 `round(forkT·(mainCount-1))` 得到，不再挂 `main.0`。
  - 桥接子发片（`branchParentId`）的 `main.0`：parent = 父发片 `main.${k}`，
    `k = round(branchParentParameter·(parentMainCount-1))`，不再直接挂 `Hair_Root`
    （父发片无导出骨骼时回退 Hair_Root）。
- 结果：**单连通树**，Hair_Root 是唯一根（0.2.97 之前「每发丝一个 Skeleton、各自 main.0
  为 root」→ N 棵散树，Houdini 导入的骨骼是散的）。实测 parent indices
  `[-1,0,1,2,1,0,5,6,5]`，发根 P=1.7/1.6 正确。

## 3. 关节命名（jointNameOf）

| 内部名（bonesFor） | 导出关节名 |
|---|---|
| `main.${i}` | `${发丝名}_${i}`（如 `Front_Bangs_1_0`） |
| `split.${k}` | `${发丝名}_split_${k}` |
| `split.${k}.tip.${j}` | `${发丝名}_split_${k}_tip_${j}`（`name.replaceAll(".", "_")`） |
| registry custom（不以 `main.` / `split.` 开头） | 保持原名 |

- 发丝名前缀 = `usdIdentifier(lock.name)` 经 **`lockPrefix` 按 `lock.id` 去重**（同名 lock
  依次 `_2`/`_3`）——合并进单个 Skeleton 后，同名 lock 的 `_0` 等关节名不再冲突
  （0.2.95 修复同名 lock 导致重复 SkelRoot prim / "Duplicate prim" / Houdini 卡死的根因）。
- `joints` token 是**相对 stage root 的完整 prim 路径**：`<rootName>/Character/Hair_Skel/<关节名>`，
  父链用 `/` 拼接（`fullPathOf`）；token 内的关节名再经 `usdIdentifier` 规范化（`jointId`）。
- 蒙皮索引用 `globalJointIndex`（关节名 → 全局索引）**按名字查表**，不用
  `mainCount + segment` 算术——split 之后还有 `split.*.tip.*` 尖端子骨骼，算术定位会指错
  （0.2.93 修复）。

## 4. 蒙皮（面板 / 普通发丝）

每条发丝两种蒙皮路径，最终都写 `mesh.skelRootName = "Hair_Skel"` +
`skelIndices` / `skelWeights`（vertex 长度 = 点数）：

1. **面板 / split 发丝（panelWeights，双影响 main+split）**：
   - 权重源：`leafWeights = unfolded.leafWeights ?? geometry.userData?.leafWeights ??
     geometry.userData?.panelWeights`，`leafWeightsValid()` 通过才走此路径。
   - 每顶点：`main = round(w.mainJoint)`、`segment = round(w.leafIndex)`、`weight = Number(w.weight) || 0`；
     满足 `segment >= 0 && splitName 命中 && weight > 0.0001` → `[mainIdx, splitIdx]` +
     `[1 - weight, weight]`；否则 `[mainIdx, mainIdx]` + `[1, 0]`（统一 2 影响，多余权重为 0）。
   - `splitIdx` 按 split 骨骼名查 `globalJointIndex`，找不到时回退 `mainIdx`。
2. **普通发丝 / 权重缺失兜底（bindBySweepRow，单影响）**：
   - `t = row/(rows-1)`：rows = `gridRows` 或 `max(gridRowIndices)+1`；
     `mainJoint = min(mainCount-1, round(t*(mainCount-1)))`；
     `skelIndices = [mainIdx, mainIdx]`、`skelWeights = [1, 0]`。
   - 普通发丝（无 split / leafWeights）也有 boneCapture → 全部进 Character，
     不再残留 `Scope "Meshes"`（0.2.98；「发尖顶点无绑定」是 0.2.93 已修的
     mainCount+segment 算术，本轮不复现）。

- **`includeMesh = contents.mesh || contents.bones`**：勾 Bones 隐含含 mesh（Bones &
  Capture Mesh 的捕获网格就是 mesh），两处调用（`performFileAction` 与
  `exportHairProjectQuickly`）都这么写（0.2.99 修复勾 Bones 后 Mesh 复选框灰掉+取消勾选、
  但导出仍用 `contents.mesh` → includeMesh=false → Character/Meshes 全空的 bug）。
- `skeletons.push` 条件：`includeBones && typeof bonesFor === "function" && allJoints.length > 1`。

## 5. 矩阵约定（row-vector + 世界旋转 orient）

USD `Gf.Matrix4d` 是 **row-vector 约定（v' = v·M）**：

- **平移在最后一行**：`(1,0,0,0),(0,1,0,0),(0,0,1,0),(tx,ty,tz,1)`（`translationMatrix`）。
- **旋转矩阵是 column-vector 版本的转置**（`quatToMat3` 注释即此）；`axesToMat3` 直接以三行
  基向量构造旋转（0.2.104）。
- **orient 是世界旋转、p 是世界位置**（0.2.104 起 orient 从发丝 frame 派生，世界坐标方向）：
  - `bindTransforms` = `worldOf` = **`orient · T(p)`**——平移恒 = p（世界位置），不受父级旋转影响。
  - `restTransforms` = `localOf` = **`R_local · T(t_local)`**，其中
    `R_local = orient · orient_parent⁻¹`（= `mat3Multiply(orient, mat3Transpose(orient_parent))`，
    旋转逆 = 转置），`t_local = (p - parent.p) · orient_parent⁻¹`（`rowVecTimesMat3`）——
    把世界差分变换到**父级局部坐标系**。
  - 保证 USD Skel 规范 `bind[i] = rest[i] · bind[parent]`；根关节（无 parent）或 p/parent.p
    缺失时 `localOf = worldOf`（rest = bind）；p 缺失时 worldOf 继承父级世界位置。
- `matrixMultiply(a, b)` 是行主序 a·b（4x4）。

> 0.2.96 之前按 column-vector 写（平移在最后一列）→ 平移为 0 → 关节全挤原点（P 全 0）；
> 0.2.97 之前局部偏移直接用世界 p → 位置逐关节累积；0.2.104 起 orient 派生为世界旋转，
> 但 localOf/worldOf 仍按「orient 当局部旋转」的旧语义计算 → 父级旋转把子级世界差分
> `(p - parent.p)` 带偏 → 非根骨骼位置偏移（0.2.105 修复：bind = orient·T(p)、
> rest = 世界差分经父级旋转逆变换到父级局部坐标）。

## 6. orient 表示与派生（z 前 / y 上）

- 骨骼旋转用 **3x3 矩阵**（scale 恒 1）表示：`quatToMat3([w, x, y, z])` 四元数→3x3（9 值，
  row-vector），`axesToMat3(xAxis, yAxis, zAxis)` 三正交轴→3x3（行 = 基向量），
  `mat3ToMat4(m)` 3x3→4x4（左上角嵌入、平移 0，null → identity）。数据流里骨骼旋转
  统一是 3x3 矩阵（0.2.98）。
- **输出轴约定（0.2.104）**：row-vector 矩阵三行即骨骼局部基向量——**x 轴 =
  up × tangent（右手系）、y 轴 = up（向上）、z 轴 = tangent（发丝前进方向，向前）**，
  scale 恒 1。这是把「发丝 frame」（`strandGeometryFrameAt` 返回 x=tangent×up、
  y=tangent、z=up）重排为 `x = -frame.x`、`y = frame.z`、`z = frame.y` 得到。
- `bone.orient`（THREE 四元数，带 `.w/.x/.y/.z`）存在时优先直接
  `quatToMat3([orient.w, orient.x, orient.y, orient.z])`。
- 为 null 时从发丝几何派生（0.2.99 引入、0.2.104 重写）：
  - **main 链**（`main.*`）：注入 `deps.strandGeometryFrameAt(lock, curve, t)`，curve =
    `new THREE.CatmullRomCurve3(lock.points)`；`index = parseInt(bone.name.slice(5))`，
    `t = clamp(index/(mainCount-1), 0, 1)`（mainCount > 1 才除，否则 t=0）；
    `orient = axesToMat3(-frame.x, frame.z, frame.y)`（frame.x/y/z 是 THREE.Vector3）。
  - **split/tip/其他**：`tangent = normalize(p - parent.p)`（p 差分，退化 → identity 兜底）；
    up 优先继承父级 orient 的 y 轴（9 值矩阵行 1 = `orient[3..5]`），父级无 orient 时用
    世界 up `(0,1,0)` 投影到 tangent 平面（退化时 `(0,0,1)` 投影）；`x = up × tangent`；
    `orient = axesToMat3(x, up, tangent)`。
  - 派生包 try-catch：compound / curve-surface 等 lock 可能抛异常，失败时跳过
    （orient 保持 identity，`console.error` 记录），不让整个导出失败。
- 背景：`bonesFor` 的 main/child/tip 骨骼 orient 是 null（注释
  "geometry-derived by the caller"），0.2.99 之前导出层没派生 → bindTransforms 全是
  单位矩阵；0.2.99 修 main 链派生但轴约定是 y=tangent、z=up（split/tip 仍 identity）；
  0.2.104 改为 z 前 / y 上轴约定并覆盖 split/tip。Hair_Root 空关节 orient 保持 null
  （identity + 平移，合理）。

## 7. 导出菜单行为（0.2.98–0.2.100）

| 行为 | 说明 |
|---|---|
| Bones 改「Bones & Capture Mesh」 | `fileExportLabels.bones`；描述 "Skeleton and captured skin mesh (all strands bound to bones)" |
| 可用性条件 | `fileExportAvailability.bones`（getter）：任一 lock 有 `splitBones` / `bones` registry / 是子发片父级（`branchParentId`）时启用 |
| 默认勾选 + 联动 Mesh 灰掉 | 对话框初始化 mesh/curves/bones 默认勾选（受支持且可用）；bones 勾选 → `mesh.disabled = true; mesh.checked = false`；上次导出勾过 bones（`lastExport.contents.bones`）也恢复勾选态；取消勾选 bones → 恢复 Mesh 可用并默认勾选（change 事件一次性绑定） |
| 去掉 Weights 选项 | boneCapture 与骨骼强绑定，不再单独勾选（0.2.98） |
| Path Prefix 输入框（`#exportPathPrefix`） | SkelRoot 路径前缀：value 回填 `lastExport.rootName`，placeholder = 文件名（`cleanFileBaseName(currentProjectName)`）；`rootName = cleanFileBaseName(输入 || baseName, baseName)` → `exportAnimeHairUsda({ rootName })`——如 `/Sussurro_v1_0047/Character` 可改用 `/Sussurro/Character` |
| rootName 持久化 | `deps.lastExport = { format, fileName, rootName, contents }`；快速导出复用 `lastExport.rootName || baseName` |
| OBJ 直接导出 | `exportHairObj()` 不开对话框，`{ mesh: true, curves: false }` → `buildHairObj`（只有 mesh、无曲线） |
| 快速导出默认 usda | 无 `lastExport` 时 `openFileActionDialog({ format: "usda" })` |
| 取消导出不触发下载 | `writeExportThroughFileSystem` 返回 `{ handle, cancelled }`；`showSaveFilePicker` AbortError → `cancelled: true`，调用方直接 return：不 fallback 下载、不更新 lastExport（0.2.100） |

## 8. Houdini 导入验证方法

用 Houdini 22.0 的 `kinefx::usdcharacterimport`（USD Character Import）实测：

1. 导出 .usda（勾选 Bones & Capture Mesh）。
2. 节点参数：`Source = File`、`usdfile = <导出的 .usda>`、
   `skelrootpath = /<rootName>/Character`（rootName = 导出时 Path Prefix / 文件名；
   SkelRoot 固定名 Character）。
3. **输出 0 = 蒙皮 mesh（带 `boneCapture`）**，**输出 1 = 骨骼 rig**。
   检查点：关节名 / 层级正确（`Front_Bangs_1_0` 等发丝名前缀）、关节 P 位置正确
   （发根 1.7/1.6，不是 0 也不是 3.4 累积值）、`boneCapture` 关节索引指向 main/split
   而非 tip 骨骼、bindTransforms 含非单位旋转（X 轴 180° 之类）。

> 辅助：`usdanimimport` 可核对 joints token / 层级与 `rest_transform`（世界 = 局部 compose 正确）。
> 以上都是 0.2.94–0.2.99 实测时用过的验证手段（详见 bug-fixes.md #2）。

## 9. split 骨骼布局与派生位置（0.2.106）

> 修复「split 骨骼全挤在发根 + 桥接子发片根骨骼挂 Hair_Root」的规范；详见 bug-fixes.md #9。

- **纯函数（usda-export.js，无 import 可单测）**：
  - `splitBoneLayout(lock, bone, { mainCount, curve, strandGeometryFrameAt, splitTipForSegment })`：
    - 只处理 `split.${k}`（`split.${k}.tip.${j}` 排除），返回 `{ parentMainIndex, p }` 或 null。
    - **fork parent**：panel/surface 段 `forkT = 1 - max(两侧 zipper 高)`（边缘段只取有的一侧，
      两侧都没有 → 1）；发丝管 `forkT = 1 - strandSplitHeight`（clamp 0.02–0.8）；
      `parentMainIndex = round(forkT·(mainCount-1))`。
    - **派生位置 p**（authored `bone.p` 存在时导出层仍优先用 authored）：
      - panel/surface：`splitTipForSegment(lock, k, lock.panelSplits, bone)` tip 链**最后一点**
        （段中心前表面，含 panelTipCurve / edge trim / authored delta），抛异常或缺失时回退
        主曲线 `curve.getPoint(1)`。
      - 发丝管：`curve.getPoint(1) + frame(1).x · (baseWidth · spread · direction)`——
        `baseWidth = (lock.baseWidth ?? lock.width ?? 0.16)·(lock.widthScale ?? 1)`、
        `spread = clamp(bone.spread ?? lock.strandSplitGap ?? 0.12, 0, 0.99)`、
        `direction = k===0 ? -1 : 1`（与 strand-geometry 两管开口 `section.direction` 同式）；
        frame 抛异常或缺失时回退曲线末端。
  - `bridgeRootParentName(lock, locks, jointNameOf)`：桥接子发片根骨骼的父内部名——
    `k = round(clamp(branchParentParameter)·(parentMainCount-1))` → `jointNameOf(parent, "main.${k}")`；
    无 `branchParentId` / 父锁缺失 / 父锁 <2 点 → null。
- **project-files.js 接线（buildHairUsda）**：split 骨骼先走 `splitChainLayout`（0.2.107，
  发尖暴露链，见 §9.1），失败回退 `splitBoneLayout`（fork parent + 派生位置）；桥接子发片
  `main.0` 走 `bridgeRootParentName`（并校验父锁确实导出该关节，否则回退 Hair_Root）；
  其余保持旧规则；`deps.splitTipForSegment`/`deps.tipChainFrameAt` 由 app.js 注入
  （`panelTipStrand.splitTipForSegment` / `panelTipStrand.tipChainFrameAt`）。
- **实测目标值（.ahs 全锁扫描 55/55 + Houdini 对照）**：Front Bangs 1 五段 → `_4/_3/_3/_3/_3`；
  Side Bangs Left 1 两管 → `_6`；Side Left 2 两管 → `_2`；桥接子发片
  Side Bangs Left 6→`Side_Bangs_Left_3_5`、Side Bangs Left 5→`Side_Bangs_Left_1_5`、
  Side Left 3→`Side_Left_2_2`（与其根点实际位置一致）。

### §9.1 发尖暴露链导出（0.2.107，splitChainLayout）

- 每段/每管不再只导出 split 单骨骼：**split.${k} = 暴露链根**（第一个暴露链点，
  视口规则 `t > forkT`，Front Bangs 1 各段 2~3 个），其后的暴露链点导出为
  `split.${k}.tip.${i}`（i = 链索引）关节，**root→tip 链式 parent**（根挂 `main.${forkIdx}`）。
- **位置与旋转一律从完整 tip 链采样**（含 authored delta），不再现算：
  - panel/surface：链 = `splitTipForSegment(lock, k, panelSplits, bone)`；帧 =
    `tipChainFrameAt(lock, chain, chain, t, k, splits)`（y=链切线、z=面板表面法线参考）。
  - 发丝管：链 = `materializeTipChain(bone.tip, restPointAt, mainCount)`，
    `restPointAt(t) = curve.getPoint(t) + frame(t).x·(baseWidth·spread·smoothstep(t, forkT, 1)·direction)`
    （精确 t 采样 frame，与 strand-geometry 的管中心线同式）；帧 = tip-sub-bone
    `tipChainFrameAt(chain, chain, t, strandFrame(t).z)`。
  - orient = `axesToMat3(cross(frame.z, frame.y), frame.z, frame.y)`（x=up×tangent、y=up、z=tangent）。
- 无暴露（forkT≥1）回退末点：单骨骼也遵守链采样旋转（"不要 parent 直指唯一发尖骨骼"）。
- `split.*.tip.*` 从 bonesFor 收集过滤（链布局取代，避免重复关节）；`splitBoneLayout`
  保留为链构建失败时的回退（仍单骨骼）。

## 版本历程速览（0.2.93 → 0.2.108）

| 版本 | 要点 |
|---|---|
| 0.2.93 | 重写 `skeletonBlock`/`meshBlock`：`def Skeleton` + SkelBindingAPI（rel skel:skeleton + jointIndices/jointWeights + elementSize=2）；蒙皮索引改按关节名查表（修 split.*.tip.* 指错）；修 SkelRoot 标识符双重 uniqueIdentifier 错配；新增 `tests/usda-export.test.mjs` |
| 0.2.94 | Skeleton 属性去 `skel:` 前缀、删多余 apiSchemas；蒙皮 mesh 必须嵌在 SkelRoot 之下（否则导入 0 点） |
| 0.2.95 | 同名 lock 按 lock.id 去重骨骼名（lockPrefix）；bindTransforms/restTransforms 补 `uniform` |
| 0.2.96 | 矩阵改 row-vector（修 P 全 0）；合并单个 SkelRoot "Character"；关节名改发丝名前缀；joints token 改相对 stage root 完整路径 |
| 0.2.97 | 统一 Hair_Root 层级（单连通树）；`localOf` 局部偏移 `p - parent.p`（修位置累积） |
| 0.2.98 | `bindBySweepRow` 普通发丝蒙皮；菜单去 Weights、Bones & Capture Mesh、OBJ 直接导出、快速导出默认 usda；orient 改 3x3 矩阵（quatToMat3/mat3ToMat4） |
| 0.2.99 | `includeMesh = contents.mesh || contents.bones`（修勾 Bones 后 mesh 全消失）；main 链 orient 从发丝切线派生（注入 strandGeometryFrameAt） |
| 0.2.100 | 取消导出不下载（`{handle, cancelled}`）；Bones 默认勾选；Path Prefix 输入框（rootName 持久化 + 快速导出复用） |
| 0.2.101 | 修 Export 卡住后静默关闭不导出（`buildHairUsda` 移进 try + main 链 orient 派生 try-catch）+ Path Prefix 移进 Bones 选项内排版 |
| 0.2.102 | `bonesFor(lock)` 收集 try-catch（失败跳过该发丝）+ catch 报具体异常 + Path Prefix 跨行加宽/autocomplete off + 描述精简 |
| 0.2.103 | `bindBySweepRow` 补 `lock` 参数（修 "lock is not defined" 导出失败）+ Path Prefix 文本框修复被 checkbox 规则压成 16px |
| 0.2.104 | orient 轴约定改 z 前（tangent）/ y 上（up）/ x=up×tangent；新增 `axesToMat3`；split/tip 骨骼 orient 从 p 差分 + 父级 up 继承派生（修 transform 全单位矩阵） |
| 0.2.105 | 修位置偏移：bind = `orient·T(p)`（平移恒 = 世界 p，不再被父级旋转带偏）、rest = 局部（`R_local = orient·orient_parent⁻¹`、`t_local = (p−parent.p)·orient_parent⁻¹`）；新增 `mat3Transpose`/`mat3Multiply`/`rowVecTimesMat3` |
| 0.2.106 | split 骨骼布局修复：新增 `splitBoneLayout`/`bridgeRootParentName` 纯函数——split 骨骼 parent 改 `main.${forkIdx}`（不再挂 main.0）+ 未创作时派生位置（panel 段尖 = tip 链末点 / 发丝管尖 = 曲线末端 + spread 侧向偏移）；桥接子发片 `main.0` parent 到父发片 `main.${k}`（不再挂 Hair_Root）；app.js 注入 `splitTipForSegment`；新增 scripts/verify-skeleton-layout.mjs 真实数据回归 |
| 0.2.107 | 发尖暴露链导出（`splitChainLayout`）：split 骨骼 = 暴露链根，后续暴露链点导出 `split.${k}.tip.${i}` 关节（root→tip 链式 parent），位置/旋转从完整 tip 链采样（panel：splitTipForSegment + tipChainFrameAt；发丝管：materializeTipChain + tip-sub-bone 帧），`split.*.tip.*` 从 bonesFor 过滤；导出对话框 File Name 恢复上次导出名（lastExport.fileName）；app.js 注入 `tipChainFrameAt` |
| 0.2.108 | 空容器修复 + 蒙皮平滑双影响：`def Scope "Meshes"`/`CenterCurves`/`SkelRoot` 只在对应块非空时输出（不再残留空 Scope）；boneCapture 假双影响（`[j,j]×[1,0]` → Houdini `(-1,-1)` 填充，实测 8855/10489）→ 新增 `smoothMainPair` 平滑主链双影响 `[floor, floor+1]×[1-frac, frac]`（暴露区仍用视口 `[main, split]` 算法），实测 0 假双影响、10489/10489 真双影响；浏览器真实导出脚本 scripts/export-verify.mjs + 加载性能对比 scripts/measure-boot.mjs |
| 0.2.109 | 暴露区蒙皮绑最近发尖链关节（`tipChainNearestIndex`）：0.2.107 导出的发尖链关节（`split.${k}.tip.${i}`）此前 0 顶点引用——暴露区全部绑在链根 `split.${k}`（fork 处），末端行 `[main@0, split@1]`；修复后顶点行 t → 暴露区最近链索引（根=split 自身，其余=tip 关节），按权重降序排列。实测 0057：1450 顶点绑定发尖链关节、末端行 `[tip_5@1, main@0]`；fork 邻接行仍绑链根 |
