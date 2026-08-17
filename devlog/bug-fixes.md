# Bug 修复 / 已知问题

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## 已知问题 / Known issues

- 拖入文件时浮动 UI 不出现（drop 悬浮提示失效）：待修复（迁移到 main 的拖放处理后在部分情况下不再显示悬浮层）。

## Bug 修复 / Bug fixes

> 对齐 main 分支（原版本）：以下为原始版本中已存在的问题，本地适配中修复。新功能自身的实现问题不列入此节。

1. **拖入 .ahs 项目文件被当作参考图，drop 后被浏览器直接打开**
   - 问题（原版本存在）：.ahs 的 MIME 类型为空，被当成参考图，拖动一开始就切进 reference 编辑模式；drop 后因不是图片而未处理，浏览器直接打开文件（全是字符）。
   - 修复：拖放统一分发——拖动阶段不再切换编辑模式；drop 时按类型分发（.ahs → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略）。

2. **浮动面板指向旧头发；show points on mesh 不更新**
   - 问题（原版本存在）：Strand Profile / Width・Depth Curve 面板打开后切换选中头发，仍编辑旧头发；雕刻/移动后 3D 控制点停留在原地。
   - 修复：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新；`rebuildLockGeometry` 末尾按需刷新 `updateTaperMeshPoints()`。

3. **刘海（split 发丝）线框显示三角面（0.2.54 修复）**
   - 问题（原版本存在）：split 发丝（如 Side Bangs Left/Right 1/2）线框/拓扑模式下最后 7~11 个 quad 显示成两个三角。
   - 根因：createHairTopologyGeometry 按三角形序号分配边掩码，假设索引流是 [扫掠][端盖]；createSplitStrandGeometry 实际是两段 [s0扫掠][s0端盖][s1扫掠][s1端盖]，sideTriangleCount 只统计扫掠，第二段扫掠末尾落入 [1,1,1] 全边掩码，quad 对角线被描边 → 看似三角。
   - 修复：createSplitStrandGeometry 生成 authored triangleEdgeMasks（扫掠交替 [0,1,1]/[1,1,0]，端盖 [1,1,1]），createHairTopologyGeometry 优先读 authoredEdgeMasks（原有分支子级已用同机制）。验证：所有 split 刘海 maskCount === 三角形数（如 1180/1180），0 个 quad 画对角线。
   - **补充（2.7 排查）**：线框掩码经 quad 重建法确认全部正确（split 发丝 572 quad 0 显示对角线、面板焊接保序）。

4. **面板（Front Bangs 1/2/3）视口三角观感（0.2.55，显示问题非数据错误）**
   - 问题（原版本存在）：三片大刘海面板线框/拓扑视图下显示三角面观感。
   - 排查确认：Front Bangs 1/2/3 的 `quadFaces`/masks 均正确（maskLen==三角形数，线框不画对角线），OBJ/USDA 导出走 quadFaces 是四边面。三角观感来自面板 Split（拉链）开口处的**非平面折叠 wall quad**：GPU 把每个 quad 沿固定对角线拆成 2 个三角形，折叠 quad 两三角法线差异大（Front Bangs 1 有 16 个 120-180° 近完全折叠、Front Bangs 3 有 12 个 60-120°、Front Bangs 2 较轻微 3 个 ≤7°）→ 着色沿对角线出折痕。纯显示瑕疵，数据/导出/线框均正确；原版同样存在。
   - 修复：`createPanelStrandGeometry` 的 `addQuad` 跳过退化（角点重合 <1e-10）与反射折叠（两三角法线点积 < -0.999）的零面积/翻折 quad，最大二面角 180/90° → ≤10.7°。
   - 保留判断：保留（防 NaN/翻折），但不是 0.2.56 线框三角的根因。
   - 后续若修：对折叠 quad 选「落在形内」的对角（把折痕变成刻意的折），或细分开口段使 wall quad 更平面。

5. **面板线框三角面真正根因（0.2.56，mask 与绕序不同步）**
   - 问题（原版本存在）：面板（三片大刘海 Front Bangs 1/2/3 及新拉 panel）线框/拓扑视图显示三角面，quad 对角线被描边。
   - 根因：`createPanelStrandGeometry` 结尾绕序翻转（交换三角形 v1/v2）后**未同步交换 `triangleEdgeMasks`**，mask 错位导致 quad 对角线被描边 → 看似三角。
   - 修复：翻转后同步交换 mask 的 [1]/[2]（`masks.forEach(m => [m[1],m[2]]=[m[2],m[1]])`）。
   - 验证：Front Bangs 1/2/3 `diagDrawn=0`、0 NaN；0.2.55 的退化/反射折叠清理保留（二者独立）。
## 本地新增功能的实现问题 / Local feature regressions

1. **子发片父发片挖洞不干净（0.2.59 修复，P2 扫掠内核回归）**
   - 问题：0044 Side Bangs Left 3（父）+ Left 6（子）桥接中，父发片挖洞只删了 2 个面，洞没删干净。
   - 根因：P2 共享扫掠内核 `strand-sweep.sweepSide` 的侧面 quad 循环按 **slot 数**（profileCount=11）而非 **edge 数**（10）发射 quad——profile 在硬点（linear）处有一个重复 seam slot，slot 3→4 是同一样本，按 slot 循环每行多出 1 个退化 quad（26 行 → 282 quadFaces，正确应为 260），quadFaces 布局与 `gridFacesPerRow=10` 脱节；`applyBranchRootRegionCarving` 又用 `round(faces.length/(rows-1))` 重算 facesPerRow（282/26→11），导致行/列错位，洞只删到部分面。
   - 修复：① 内核新增 `profileEdges` 选项，按 profile edges 发射 quad（base 传 `profileTopology.edges`，child ring 保持连续边）；② `applyBranchRootRegionCarving` 改用 build-time `gridFacesPerRow`（回退重算），即使 quadFaces 含额外面（procedural 合并等）也不漂移。
   - 验证：父发片 fresh quadFaces 260（原 282），carve 精确删除 region 面 [122,123,132,133]（行 12-13 × 面列 2-3，skipCol=3 下 grid 列 2/4），洞完整；Sussurro_v1_0041/0042/0044 三档 11/11 smoke。

2. **USDA 骨骼导出：Houdini Character Import 报 "Primitive does not have any Skeleton children"（0.2.59 记录，0.2.93–0.2.102 修复）**
   - 现象：0044 导出 USDA（勾选 Bones）后，Houdini `USD Character Import` 报 `Invalid source /obj/geo1/usdcharacterimport1/**skin**` / "Primitive does not have any Skeleton children"。
   - 根因（v1）：骨骼导出只输出 `SkelRoot`（`Scope "Skeletons"` 下嵌套 `SkelJoint`），**没有 `Skeleton` prim**；且 Mesh 蒙皮绑定写错——`rel skel:bindTransforms`（应为 `rel skel:skeleton`）、`int2[] primvars:skel:joints`/`float2[] primvars:skel:weights`（应为 `int[] primvars:skel:jointIndices`/`float[] primvars:skel:jointWeights` + `elementSize`）。找不到 Skeleton → 该报错。
   - 修复（0.2.93）：重写 `usda-export.js` 的 `skeletonBlock`/`meshBlock`——`SkelRoot` 内新增 `def Skeleton "Skel"`；Mesh 施加 `SkelBindingAPI`：`rel skel:skeleton` 指向 Skeleton prim + `int[]/float[]` jointIndices/jointWeights（`elementSize=2`）。同时修复 `project-files.js` 蒙皮索引用 `mainCount+segment` 算术（split.* 之后还跟 split.*.tip.* 尖端子骨骼会指错）→ 改按关节名查表；修复 SkelRoot 标识符双重 `uniqueIdentifier` 保留 → mesh rel 指向不存在 SkelRoot 的错配。新增 `tests/usda-export.test.mjs` 纯 node 回归。
   - 补充（0.2.94，Houdini 22.0 `kinefx::usdcharacterimport`/`usdanimimport` 实测又发现两处）：① **Skeleton prim 属性名误加 `skel:` 前缀**——UsdSkelSkeleton 的 `joints`/`bindTransforms`/`restTransforms` 不带前缀（只有 Mesh 的 SkelBindingAPI 属性带 `skel:`），写 `skel:joints` 时 `UsdSkelCache.GetSkelQuery().GetJointOrder()` 读到空；`def SkelRoot`/`def Skeleton` 上多余的 `prepend apiSchemas=["SkelRoot"]/["Skeleton"]` 一并删除（类型化 schema 不需要，只有 mesh 的 `SkelBindingAPI` 保留）。② **蒙皮 mesh 必须嵌在 SkelRoot 之下**——USD 规范 "A SkelRoot must be defined at or above a skinned primitive"，Houdini 只导入 SkelRoot 之下的 skinned primitive；原把 mesh 放独立 `Scope "Meshes"`（与 SkelRoot 兄弟）→ 导入 0 点。改为蒙皮 mesh 嵌进对应 SkelRoot（与 Skeleton 同级，缩进 12/16），未蒙皮 mesh 仍留 `Scope "Meshes"`。实测：`usdanimimport` 导入 9 关节名/层级正确、`rest_transform` 世界=局部 compose 正确；`usdcharacterimport` 导入蒙皮 `boneCapture` 关节索引正确（split.* 段指到 4/7，不再是 tip 骨骼 5）。
   - 补充（0.2.95，Houdini 实测 0046 崩溃根因）：**同名 lock 导致重复 SkelRoot prim**——两个 lock 同名（如 "Side Left 1 Procedural Copy"）时骨骼名相同，`skeletonNameToId`（Map key=name）被后一个覆盖 → 两个 skeleton 拿到同一标识符 → 输出两个同名 `def SkelRoot` → USD 解析报 "Duplicate prim" → Houdini 报 "Primitive is not a SkelRoot"/卡死。修复：`buildHairUsda` 按 `lock.id` 预生成去重唯一骨骼名（同名依次加 `_2`/`_3`），三处 `(lock.name)+" Skeleton"` 改用之。另对齐 OpenUSD（对照 `UsdSkel` 官方 API 导出确认）：Skeleton 的 `bindTransforms`/`restTransforms` 补 `uniform` 关键字（`uniform matrix4d[]`）。
   - 补充（0.2.96，Houdini 实测三处）：① **矩阵约定写反导致骨骼关节位置 P 全 0**——USD `Gf.Matrix4d` 是 row-vector 约定（v'=v·M），平移在**最后一行** `(1,0,0,0),(0,1,0,0),(0,0,1,0),(tx,ty,tz,1)`、旋转矩阵是 column-vector 的转置、`local=R·T`（先旋转后平移）、`world=local·parent`；原代码按 column-vector 写（平移在最后一列）→ Houdini 读出的平移为 0 → 关节全挤原点（对照官方 `Gf.Matrix4d.SetTranslate`/`SetRotate` 实测确认）。② **合并为单个 SkelRoot**——原「每发丝一个 SkelRoot」导致 `usdcharacterimport` 一次只能导入一个发丝；改为单个 `def SkelRoot "Character"` 内含所有发丝的 Skeleton + 蒙皮 mesh（官方 API 确认单 SkelRoot 多 Skeleton 合法），`skelrootpath` 填一个 `/Root/Character` 即一次导入整角色。③ **关节名改为发丝名前缀**——`main.${i}`→`${发丝名}_${i}`、`split.${k}`→`${发丝名}_split_${k}`（`jointNameOf` 映射），joints token 改相对 stage root 的完整路径（`Root/Character/${Skel}/${joint}`）。实测：单 SkelRoot 一次导入两发丝（skin 8 点 2 prim + 8 关节名 `Front_Bangs_1_0` 等）、关节 P 位置正确（不再是 000）。
   - 补充（0.2.97，Houdini 实测）：**统一 Hair_Root 骨骼层级 + 修复局部偏移累积**——① 原来「每发丝一个 Skeleton、各自 main.0 为 root」导致骨骼是散的（N 棵独立树）；改为单个 `Hair_Skel`，加一个 `Hair_Root` 空关节（x=0 正中线，y/z 取所有发根平均）作为所有发丝的 root，所有发丝 `main.0` parent 到 `Hair_Root` → 单连通树（同名 lock 的关节名前缀也去重 `lockPrefix`）。② **bonesFor 的 joint.p 是世界坐标，但导出当局部偏移用**（`localOf` 直接 `R·T(p)`）→ 世界位置被逐关节累积（如发根 1.7 + Hair_Root 1.7 = 3.4）；修复 `localOf` 用局部偏移 `p - parent.p`（根关节保持 p，p/parent.p 缺失时回退原 p）。实测：单 Skeleton 9 关节单连通树（parent indices `[-1,0,1,2,1,0,5,6,5]`，Hair_Root 唯一根）、发根 P=1.7/1.6 正确（不再是 3.4/3.3 累积值）。
   - 补充（0.2.98，Houdini 实测）：**普通发丝蒙皮 + 菜单调整 + orient 3x3 矩阵**——① 普通发丝（无 split/leafWeights）原残留在 `Scope "Meshes"` 无蒙皮，Houdini usd skin import 漏掉；新增 `bindBySweepRow` 按扫掠行号 `t=row/(rows-1)` 绑定 main 关节（单影响），所有发丝（含普通）都有 boneCapture → 全部进 Character，不再残留 Meshes（历史「发尖顶点无绑定」根因是 0.2.93 已修的 mainCount+segment 算术，本轮不复现）。② 菜单：去掉 Weights 选项（boneCapture 与骨骼强绑定），Bones 改「Bones & Capture Mesh」，勾选时 Mesh 自动灰掉；OBJ 直接导出（只有 mesh、无曲线）；快速导出默认 usda。③ orient 四元数→3x3 旋转矩阵（scale=1，`quatToMat3` 导出给 project-files.js、`mat3ToMat4` 嵌入 4x4）。实测：普通发丝+面板发丝都进 Character（2 mesh）、0 个无 boneCapture 顶点、骨骼位置正确。
   - 补充（0.2.99，Houdini 实测）：**修复 mesh 全消失 + 骨骼 orient 派生**——① 「Bones & Capture Mesh」勾选时 Mesh 复选框被灰掉+取消勾选，但导出仍用 `contents.mesh` → `includeMesh=false` → Character/Meshes 都空；修复为 `includeMesh = contents.mesh || contents.bones`（勾 Bones 隐含含 mesh，两处导出调用都改）。② 骨骼 orient 原导出全是单位矩阵——`bonesFor` 的 main 链 `orient` 是 null（注释 "geometry-derived by the caller"），导出没派生；修复：注入 `strandGeometryFrameAt` 到导出层，main 链骨骼 orient 从发丝切线方向的 quaternion 派生（`t=i/(N-1)` 取 frame.quaternion → `quatToMat3`）。实测：bindTransforms 含非单位旋转（X轴180°）、Houdini 读到非单位 transform、mesh 在 Character 下。
   - 补充（0.2.100）：**取消导出不再触发下载 + Bones 默认打开 + SkelRoot 路径前缀可配置**——① 导出时 `showSaveFilePicker` 用户取消（AbortError）原会 fallback 到浏览器下载，改为 `writeExportThroughFileSystem` 返回 `{handle, cancelled}`，取消时不下载、不更新 lastExport。② 导出菜单「Bones & Capture Mesh」默认勾选（`key === "bones"` 也默认勾选，联动 Mesh 灰掉）；新增 Path Prefix 输入框（`#exportPathPrefix`）作为 SkelRoot 路径前缀（默认 = 文件名），随 lastExport 持久化（`rootName` 字段）并应用于快速导出——如 `/Sussurro_v1_0047/Character` 可改用前缀 `/Sussurro/Character`。
   - 补充（0.2.101）：**修复 Export 卡住后静默关闭菜单不导出 + Path Prefix 排版**——① 导出时点 Export 会卡一会后直接关菜单且不导出：`buildHairUsda` 在 `performFileAction` 的 try 块**外面**，且 main 链骨骼 orient 派生调 `strandGeometryFrameAt` 对某些 lock（如 compound）抛异常 → uncaught（菜单已 close、showSaveFilePicker 未弹出）；修复：orient 派生 try-catch（失败跳过）+ `buildHairUsda` 移进 try 块（异常被捕获 alert）。② Path Prefix 从单开一行改到「Bones & Capture Mesh」选项内（input 在 label 里），默认文件名用灰色 placeholder 显示（输入后隐藏），并补 `.file-export-option` 的 grid 布局 CSS 修排版挤在一起。
   - 补充（0.2.102）：**导出仍报错 + Path Prefix 过窄/autofill + 描述精简**——① 导出仍提示失败：`deps.bonesFor(lock)` 收集骨骼时对某些 lock 抛异常（在 lockBoneData 收集 forEach 里无 try-catch）；给 bonesFor 调用加 try-catch（失败跳过该发丝），catch 块 alert 改为带 `error.message`（便于定位）。② Path Prefix 输入框从 grid 第二列改 `grid-column: 1 / -1` 跨整行（和 FileName 等宽），加 `autocomplete="off"`（避免浏览器记忆输入）。③ Bones 选项描述去掉「(all strands bound to bones)」。
    - 补充（0.2.103）：**导出报 "The USDA export failed: lock is not defined" + Path Prefix 仍窄**——① `bindBySweepRow` 函数体里调用 `jointNameOf(lock, ...)` 引用了 `lock`，但函数签名没声明 `lock` 参数 → ReferenceError → 勾 Bones 导出直接失败；修复：签名补 `lock` 参数，两处调用点传入 `lock`。② Path Prefix 仍只有 16px 宽、看不见字符：根因 `.creation-preset-dialog .file-export-option input { width:16px }` 匹配了**所有** input（含 `#exportPathPrefix` 文本输入框），specificity (0,2,1) 高于 `.file-export-option > input[type="text"]` 的 (0,1,2)，把文本框压成 16px；修复：该规则改为只匹配 checkbox（`input[type="checkbox"]`），文本框恢复 `width:100%` 跨整行。
    - 补充（0.2.104）：**骨骼 transform 全单位矩阵 / 默认朝向**——① 根因：`bonesFor` 的 main/child/tip 骨骼 `orient` 恒为 null（bone-model.js 注释 "geometry-derived by the caller"），导出层只有 `main.*` 从 `frame.quaternion` 派生且轴约定是 y=tangent、z=up（split/tip/Hair_Root 全 identity）→ 骨骼无旋转、都是默认朝向。② 修复：orient 轴约定改为 **z 前（tangent）/ y 上（up）/ x=up×tangent（右手系）**；`usda-export.js` 新增 `axesToMat3(xAxis, yAxis, zAxis)`（三正交轴→row-vector 3x3，行=基向量，scale 恒 1）；main 链 `orient = axesToMat3(-frame.x, frame.z, frame.y)`（frame.x=tangent×up → -frame.x=up×tangent、frame.z=up、frame.y=tangent）；split/tip 骨骼从 `p - parent.p` 差分算 tangent、up 继承父级 orient 的 y 轴（父级无 orient 用世界 up `(0,1,0)` 投影到 tangent 平面，退化用 `(0,0,1)`），`orient = axesToMat3(up×tangent, up, tangent)`；Hair_Root 空关节 orient 保持 null（identity+平移）。
    - 补充（0.2.105）：**骨骼位置（P）整体偏移**——① 根因：0.2.104 把 orient 改为**世界旋转**（frame 派生的世界坐标方向），但 `skeletonBlock` 的 `localOf`/`worldOf` 仍按「orient 当局部旋转」的旧语义计算（`localOf = R·T(p−parent.p)`、`worldOf = localOf·worldOf(parent)`），父级 orient 非 identity 时子级世界平移 = `(p−parent.p)·R_parent + parentP` ≠ `p`（发丝沿 y 轴、父级绕 x 轴 90° 时，子级 y 轴偏移被转到 z 轴）。② 修复：`bindTransforms` 改为 `worldOf = orient·T(p)`（平移恒 = 世界 p，不再被父级旋转带偏）；`restTransforms` 改为局部 `R_local·T(t_local)`，`R_local = orient·orient_parent⁻¹`（`mat3Multiply`/`mat3Transpose`，旋转逆=转置）、`t_local = (p−parent.p)·orient_parent⁻¹`（`rowVecTimesMat3`，世界差分变换到父级局部坐标），满足 USD Skel 规范 `bind[i]=rest[i]·bind[parent]`；p 为 null 时继承父级世界位置。③ 退化验证：orient 全 identity 时输出与旧代码一致（bind=T(p)、rest=T(p−parent.p)）。

3. **Strand Profile 浮动面板打不开（0.2.69 修复，3d-3d-b 重构回归）**
   - 问题：点击 Strand Profile 区铅笔按钮（Edit strand profile）不弹出浮动面板 `#sweepProfileEditor`。
   - 根因：`modules/geometry/branch-sweep.js` 在 0.2.57「3d-3d-b」重构中从 app.js 抽取**不完整**——22 个 DOM/共享/THREE 变量（`taperCurveEditor`/`sweepProfileEditor`/`strandGroupDefaults`/`shapePresets` 等）既未在模块声明、未 import、也未注入 deps，ES module 严格模式下 `openSweepProfileEditor` 第一处 `if (taperCurveEditor.open)` 即抛 ReferenceError。
   - 修复：补齐 import（curve-math 的 `sampleTaperCurve`/`twistCurveHandleDistancePerDegree` + io/shape-presets 的 `cloneShapePresetValue`；`shapePresets` 改直接 import 避开其 L8196 晚于 branchSweep L7855 的 TDZ）+ 22 个 deps 注入 + 修正 app.js 3 处 `branchSweep.branchSweep.activeSweepProfileTarget()` 双重笔误（同一复制粘贴 bug）。

4. **桥接 UV 挤点回归（0.2.74 修复，0.2.73 引入）**
   - 问题：0.2.73 单边切缝重构后，子发片桥接 UV「回到最初的 uv 模样」——大量桥接顶点挤在一个点 (0.5, 0)。
   - 根因：`bridgeUvAt` 对无环侧锚点的桥接顶点（`sideHoleVertex`，锚点 `ring=-1` 的纯洞侧顶点，t=1）执行 `uvTable.colU.get(-1)` → undefined → `!Number.isFinite(ringU)` → return null → passthrough 退回原 uv 属性（pushBoundary 的统一原值 (0.5, 0)）；split 父发片洞边界上的管 seam 列顶点（col=-1）查 parent 弧长表同样为 null。
   - 修复：ring 无效（-1 / 不在表内）时 `ringU = 洞 u`（t=1 时即洞侧 UV 本身）；洞侧查询失败时兜底 u=0、v 按 parent 行号（不再退回 (0.5,0)）；tests 增补 ring=-1 用例（b3 断言 u=洞 u、v=1）。

5. **split 父发片弧长表整体失效 → 子发片桥接 UV 接线整个关闭（0.2.75 修复，0.2.73 引入的深层根因）**
   - 问题：真实几何（Side Left 3 的 split 父发片 Side Left 2）下桥接仍「没有切 UV、没有对齐洞」——比 #4 更根本：整个桥接 UV 接线（bridgeUvAt）都被关闭。
   - 根因：0.2.70 给 split 写 `gridColIndices` 用 `colToSection.findIndex` 按坐标匹配 fused 列；DEFAULT_SWEEP_PROFILE 有 x=0 点且 splitX=0，x=0 点被 clip 进**两管**但 colToSection 只归管 0 → 管 1 每行 2 个 `findIndex=-1`（x=0 副本 + seam 点，实测复现：tube1 -1 count=2）→ `gridUvTable`/`unfoldHairMesh` 的 split 分支「每行每管恰好 1 个 -1」校验失败 → 返回 null → split 父发片弧长表缺失 → child 的 `bridgeUvAt` 未设置 → 桥接全退回原 uv (0.5,0)，split 父发片自身也无展开 UV。0.2.71/0.2.72 用等距 parametricGridUv 查洞（对单点 -1 容错）所以症状只在 0.2.73 起显现。
   - 修复：split 网格列改为**管局部列 + 全局偏移**（管 g local col l → colBase+l，local col 0 = clip seam 点即管首列，无 -1）；uv-unfold 的 split 分支删除 -1/seam 扫描与 colToSection 依赖（直接读 splitSections），wrap quad 丢弃按「管尾↔管首」col 对判定；AHS_gridCol 语义随之为管局部偏移列；tests 重写（偏移列无 -1、周长、wrap 丢弃、弧长比例）。

6. **桥接底部两道意外 UV seam → 一块 poly 被切出去（0.2.79 修复，0.2.76 引入）**
   - 问题：桥接底部出现两道「不属于 uv seam 但也是 uv seam」的边，一块 poly 被单独切出去。
   - 根因：bottom band 的「自然展开」（0.2.76：洞侧 u=环侧 u、v=childVStart−t×span）与 side fill 的「对齐洞」（洞侧 u/v=parent uv）在**洞底角共享顶点**处 UV 不连续 → 洞底两侧形成意外 seam。
   - 修复：bottom band 改回与 top/side 相同的插值（u/v 向洞侧 lerp）——洞底整圈（bottom band + side fill）洞侧统一 = parent uv，UV 连续；`bottomBandSpan` 仍保留用于 childVSweepStart（扫掠下移）。
   - 完整踩坑清单（9 条，含 wrap quad 丢弃→poly 缺失、横缝切乱取消、刚性倍率→拓扑对齐等）见 devlog/uv-unfold.md §7。

7. **发尖宽度控制点拖拽「曲线动、发丝不动」死区（0.2.80 修复，0.2.59 系统自身缺陷）**
   - 问题：Front Bangs 1 某发尖（不跨 0 的段）上两侧 zipper 高度相差、只暴露一边的绿色宽度控制点，视口拖拽后右侧曲线面板跟随变化，但发尖网格宽度纹丝不动（无论是否 Ctrl）；其它发尖正常。
   - 根因：`tipWidthMultiplierAt` 的 fork 守卫用**绝对 u 符号**（`u < 0 ? -1 : 1`）选侧 zipper，而曲线采样用**段内相对归一化坐标**（`(u - centerU) / halfSpan`，左半段采 secondary、右半段采 primary）——不跨 0 的段整段被绝对符号判成同一侧，守卫取到另一侧 zipper 的 fork，t ∈ [本侧 fork, 另一侧 fork) 的写入被「锁定区回退全局曲线」分支挡住 → 几何永远不采样 bone 曲线。0045 实测：第 1 段（边界 [-0.8067,-0.44] 全负半轴）band t=0.69375 写 primary=2.0 后几何采样恒为全局值 1.192（死区）。
   - 修复：centerU/halfSpan 提到 fork 判断之前，side 改段内相对符号 `(u - centerU) < 0 ? -1 : 1`。回归：函数级断言 mR 1.192→2.0（右半段生效）、mL 不变（左半段 t<0.75 保持锁定区全局值）；跨 0 的段仅段中心细条翻转。

8. **USDA/OBJ 导出 panel 刘海 zipper 缝被填起来（0.2.80 修复，0.2.70 引入）**
   - 问题：0045/0046 导出的 USDA 在 Houdini 视口里点位置正常，但几个 panel 尖端本来被 zipper 拉开的缝被面填起来；OBJ 同样连起来、没有开口；旧导出（0044，0.2.70 之前）正常。
   - 根因：panel 网格 grid 列号 `(colBase+column)*2(+1)` 的 colBase 只累加各段列数、**不为段边界预留格子**——段 k 最后一列与段 k+1 第一列共用同一 (row,col) 格子（Front Bangs 1 实测 42 个重复 cell）；zipper 开口以下两侧边界链是独立顶点（缝），而导出 `unfoldHairMesh`（kind "open"）按格子槽位重映射面索引 → 两个顶点坍缩到同一槽位 → 面被桥接到对侧顶点、缝被填（点位置不变）。0.2.70 之前 panel 无 grid primvar，导出走原始几何回退，所以旧导出正常。
   - 修复：① `createPanelStrandGeometry` 的 addPatch `colBase` 累加改 `sum + count + 1`（每段边界预留 1 列，C=46→54 恰为每行顶点数，格子唯一无空洞）；② `weldPanelGeometryData` 的 weld key 加入 gridRow/gridCol（fork 以上位置重合但格子不同的边界链顶点不再被焊掉）。回归：P0 dupCell=0 / unfold 重映射 1:1 / 逐面边集与视口一致；USDA 导出 918 点 822 quad。

9. **USDA 导出：split 骨骼全挤在发根 + 桥接子发片根骨骼挂错（0.2.106 修复，见 usd-bone-export.md §2/§9）**
   - 问题①（split 骨骼位置/旋转）：勾选 Bones 导出的 USDA 里所有 `*_split_*` 关节（panel 每段、发丝每管的 split 骨骼）位置全在发根（头顶）、旋转全相同——Houdini 实测 Sussurro_v1_0051：`Front_Bangs_1_split_0..4` 全部 P 相同、bindTransforms 全是 `identity·T(main.0.p)`；`Side_Left_2_split_0/1` 同样。
   - 根因①：`bonesFor` 的 split 骨骼 `parent: "main"`（导出层映射到 `main.0`=发根）、`p: null`（未创作时默认）→ 导出 `worldOf` 继承父级世界位置 + identity 旋转 → 全部挤在发根。
   - 修复①（usda-export.js 新增纯函数 `splitBoneLayout` + project-files.js 接线）：fork parent 索引——panel 段 `forkT = 1 - max(两侧 zipper 高)`（边缘段单侧 zipper 即该侧）、发丝管 `forkT = 1 - strandSplitHeight`，`parentMainIndex = round(forkT·(mainCount-1))`；派生位置——panel 段尖 = `splitTipForSegment` tip 链最后一点（段中心前表面，含 panelTipCurve/edge trim，失败回退主曲线 t=1）、发丝管尖 = `curve.getPoint(1) + frame(1).x·(baseWidth·spread·direction)`（direction 管0=-1/管1=+1，与 strand-geometry 两管开口同式）；authored `p` 存在时仍优先。`split.${k}` parent 改 `main.${forkIdx}`（暴露部分根部挂到主骨骼对应骨骼点），不再挂 `main.0`。
   - 问题②（桥接子发片根骨骼）：Side Bangs Left 6/5、Side Left 3 等 bridge child 的 `main.0` 直接 parent 到 `Hair_Root`，尽管其根点就坐在父发片对应骨骼点上（实测 `Side_Bangs_Left_6_0` P == `Side_Bangs_Left_3_5` P）。
   - 根因②：导出循环对每个 lock 的 `main.0` 一律 `parent = HAIR_ROOT_NAME`，不看 `branchParentId`。
   - 修复②（`bridgeRootParentName`）：按 `branchParentParameter` 映射父发片 main 索引 `k = round(t·(parentMainCount-1))`，`main.0` parent 到父发片 `main.${k}`（父发片无导出骨骼时回退 Hair_Root）。实测目标值：Side Bangs Left 6→`Side_Bangs_Left_3_5`、Side Bangs Left 5→`Side_Bangs_Left_1_5`、Side Left 3→`Side_Left_2_2`。
   - 验证：tests/usda-export.test.mjs 新增 27 断言（fork 索引 4/3、tip 链末点 p、抛异常回退曲线末端、tip 链排除、发丝管 p ±0.0304、bridge 三档映射 + null 兜底）；scripts/verify-skeleton-layout.mjs 用真实 .ahs 全锁扫描 55/55（24 split 骨骼越界/挂 main.0 检查 + 桥接根 parent 已知值 + parent 存在于 main 链）。
   - 补充（0.2.106 热修复，commit 5731b1a）：接线时 `const boneP` 后紧跟 `boneP = derivedP` 赋值 → 勾 Bones 导出直接报 "Assignment to constant variable"（浏览器运行时错误）；改 `let boneP` 一行修复，导出恢复正常。
   - 补充（0.2.107）：**发尖暴露链导出 + File Name 记忆**——① 每段/每管只导出 split 单骨骼（在发尖）→ 新增 `splitChainLayout`：split 骨骼 = 暴露链**根**（第一个暴露链点，t>forkT 视口规则，Front Bangs 1 各段 2~3 个），后续暴露点导出为 `split.${k}.tip.${i}` 关节，root→tip 链式 parent（根挂 `main.${forkIdx}`）；位置与旋转一律从完整 tip 链采样（panel：`splitTipForSegment` 链 + `tipChainFrameAt` 帧；发丝管：`materializeTipChain`(restPointAt=曲线+frame.x·spread·smoothstep) + tip-sub-bone 帧，参考法线=发丝 frame.z），不再现算；`split.*.tip.*` 从 bonesFor 收集里过滤（避免重复）；无暴露时回退末点（单骨骼也遵守链采样旋转）。② 导出对话框 File Name 不再每次重置为项目名——`openFileActionDialog` 从 `deps.lastExport.fileName` 恢复上次导出名（与 Path Prefix 恢复 rootName 同款）。验证：tests/usda-export.test.mjs 133 断言全过（新增 36：链关节数/命名/链式 parent/位置/旋转矩阵/无暴露回退）；scripts/verify-skeleton-layout.mjs 82/82（新增暴露链点数量已知值：Front Bangs 1 seg0=2、seg1=3、Side Bangs Left 1 管=4）。

10. **USDA 空 Scope 残留 + boneCapture 假双影响（0.2.108 修复，Houdini 实测 Sussurro_v1_0054/0056）**
   - 问题①（空容器）：不勾 Mesh/Curve 时 USDA 仍输出空的 `def Scope "Meshes"` / `def Scope "CenterCurves"`（勾 Bones 时蒙皮 mesh 都在 Character SkelRoot 内，Meshes 必空）；无骨骼时还输出空 SkelRoot。
   - 修复①：`exportAnimeHairUsda` 改 parts 数组按内容条件拼接——`Meshes`/`CenterCurves`/`SkelRoot` 只在对应块非空时输出；块生成逻辑（skinned/unskinned 分流、hasSkinData）零改动。实测（Mesh/Curves 去勾 + Bones 勾选）：文件只有 `def SkelRoot "Character"`（Hair_Skel + 26 蒙皮 mesh），空 Scope 全部消失，蒙皮 mesh 不丢（不重演「勾 Bones 但 mesh 不导出」旧 bug）。
   - 问题②（boneCapture 只有一个点控制）：Houdini 实测 0054——10489 顶点中 **8855 个是假双影响 `[1,-1]×[1,-1]`**（导出写 `[mainIdx, mainIdx]×[1,0]`，Houdini 压成单影响并 (-1,-1) 填充）。
   - 根因②：`bindBySweepRow`（普通发丝/权重缺失兜底）整体写同索引对；leafWeights 路径对 weight=0（fork 以上主骨骼驱动区）也写同索引对。
   - 修复②（`smoothMainPair` 纯函数 + 三处接线）：每顶点真双影响——暴露区保持视口算法 `[main, split]×[1-w,w]`；其余改**平滑主链双影响** `[floor, floor+1]×[1-frac, frac]`（`frac = frac(t·(mainCount-1))`，t 由顶点 gridRow 推算，端盖 -1 行 → 根；链末端 main===next 自然退化）。实测 0056：**假双影响 0、真双影响 10489/10489、负槽位 1245**（仅 frac=0 行的 0 权重第二影响被 Houdini 压缩，语义正确——该行本来就该由该主骨骼驱动）、权重全部归一。算法分析见 devlog/weight-algorithm.md。
   - 补充（0.2.109，Houdini 实测 0057）：**暴露区蒙皮绑最近发尖链关节**——问题：0 个顶点引用 `split.${k}.tip.${i}` 关节（发尖链关节"没有权重"），暴露区全部绑在最根部的 `split.${k}`（位于 fork），末端行是 `[main@0, split_k@1]`（主骨骼占第一槽）。修复：新增 `tipChainNearestIndex(t, mainCount, forkT)` 纯函数——顶点行 t → 链位置 `ci = t·(mainCount-1)` → 暴露区（`t_i > forkT`）内最近链索引（`index===i0` 即链根 split 自身，否则 `split.${segment}.tip.${index}`），并按权重降序排列（主导影响放第一槽）。实测 0057：**1450 顶点绑定发尖链关节、996 顶点主导影响是发尖链关节**（原 0），末端行 `[split_0_tip_5@1, main@0]`、gridRow 15 `[tip_5@0.67, main_5@0.33]`；fork 邻接行仍绑链根（28/12/8 顶点），主驱动区不变（平滑主链混合）。

11. **吹风预览：改 windSeed/windStrandRandom 后预览"卡死/不恢复"，再次开启进一步弯曲（0.2.113 修复）**
   - 问题（0.2.112 引入）：预览激活时拖动 Seed 或 Strand Random 滑杆，动画冻结（"卡死"）；预览关闭后头发不恢复原样；再次开启预览头发**进一步弯曲**。
   - 根因：滑杆 input 处理器（app.js ~17438-17443）在 windSeed/windStrandRandom 变更且预览激活时只执行 `windPreviewCache.delete(lock)`——缓存删了但**从不重建**（`buildWindPreviewCache` 只在 `setWindPreviewActive(true)` 调用）。后果链：① tick 取不到缓存 → 动画冻结；② 网格停留在上次变形状态、永不恢复（关闭时的逐位恢复因缓存已删成为无操作）；③ 再次开启时 rest 快照从"已弯曲"的几何上重建 → 新快照把弯曲当 rest → 继续弯曲（用户观察到的"进一步弯曲"）。
   - 修复：该分支改为「**先逐位恢复 → 删缓存 → 重建（新参数）→ `windPreviewTick(0)` 立即变形一帧**」——恢复保证重建快照的 rest 是真实 rest（非上次变形残留），tick(0) 消除"冻结感"，重建保证新 perStrand/noise 立即生效（seed 变更仍保留 `windNoiseCache` 失效重建）。
   - 验证：scripts/verify-wind-preview.mjs 新增 3 条回归断言（改 seed 后预览**仍激活**、几何**立即变形非冻结**、改回原值后**逐位还原**）——端到端 15/15（headless Chrome + CDP，Sussurro_v1_0046.ahs）。
