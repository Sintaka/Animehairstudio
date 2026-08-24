# Bug 修复 / 已知问题

<!-- 本文件由 devlog 拆分而来；入口见 AGENT_QUICKSTART.md（新 agent 必读）；文档路由表见 README.md -->

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

12. **USDA bridge family 融合：四影响 capture 被首个父顶点降为双影响（0.2.114 修复，2026-08-17 真实导出）**
   - 现象：首次导出 `Sussurro_v1_0059.usda` 虽然已有 family 融合、`Character` SkelRoot、faceVarying UV 与正确 bridge root parent，但所有 skin prim 的 `elementSize` 仍为 2；桥接带内四影响数组因此与 primvar arity 不一致。
   - 根因：`mergeBranchFamilyMeshes()` 直接复制父网格的既有双槽 capture；`meshBlock()` 以合并 mesh 的**第一个顶点**决定 `elementSize`，首点通常来自父发片，故写成 2。
   - 修复：family 合并写入点 capture 前统一经 `normalizedCapture(..., arity=4)` 归一并补齐四槽；父侧保持其原有权重，桥带仍保留父/子混合的四影响。
   - 验证：真实浏览器导出 `D:\Downloads\Sussurro_v1_0059.usda`，2,376,424 bytes；`def SkelRoot "Character"` 存在、`elementSize = 4` 共 46 个、`elementSize = 2` 为 0、`primvars:st:indices` 共 23 组，且 `Side_Left_3_0` parent 为 `Side_Left_2_2`。`tests/bridge-export.test.mjs` 通过。

13. **增删 zipper 后发尖骨骼位移错位到相邻发尖 + 新段退回默认姿态（0.2.117 修复，0.2.59 起的系统性缺陷，多拉链后更易触发）**
   - 问题（用户报告）：① 给面板加一个 zipper 后，原本那个发尖的**发尖骨骼位移数据被挪到了下一个发尖**；② 选中一个发尖加 zipper 时，新造出来的发尖子骨骼是**默认位置**，期望基于原发尖的姿态创建（Del 掉 zipper 后退化成的大发尖同理，应接近现有姿势而非默认）。
   - 根因：`lock.splitBones`（面板，长度 = `panelSplits.length+1`）与 `lock.strandSplitBones`（发丝，长度 = `strandSplits.length+1`）是**按段下标**存储的 authored 数据（含 `spread`、每段曲线、`tip`={points,restPoints,twists,active}），而 `normalizeSplitBones`（bone-model.js L17-57）按 `value[k]` **位置**映射。增删 zipper 会**重新划分段**，但 `changePanelSplitCount`/`changeStrandSplitCount`/两个 `deleteSelected*Split` 只改 splits 数组、**从不按段身份重映射骨骼数组** → 在段 j 插入后 bone[j+1] 仍是旧段 j+1 的数据却已归属另一块几何（错位）；又因 `splitBonesFor` 仅在 `stored.length === count` 时接受 authored 骨骼，长度一变还可能整体退回默认值（数据静默丢失）。
   - 修复：bone-model.js 新增两个**纯函数** `remapSegmentBonesOnInsert(bones, insertIndex)`（段 insertIndex 一分为二、两半都从来源段深克隆、其后整体后移）与 `remapSegmentBonesOnDelete(bones, deleteIndex, {spans, survivorIndex})`（段 deleteIndex 与 deleteIndex+1 合并取 survivor、其后整体前移），配 `cloneSegmentBone`（深克隆 `tip`/曲线；`name`/`parentParam` 置 null 交由 normalize 按**新段边界**重新派生，避免继承旧叉口深度）与 `resolveMergeSurvivor`（显式 survivorIndex > span 更宽者 > 左段）；segment-control.js 四条增删路径统一改为「先按段身份重映射骨骼 → 再改 splits → `materializeSplitBones`/`materializeStrandSplitBones` 双写」。
   - 需求②零管线改动：`materializeTipChain`（tip-sub-bone.js L37-58）本就在 `authored.points/restPoints` 长度匹配时把每点 delta（`points[i]-restPoints[i]`）重新应用到新 rest chain，因此 remap 时把来源段的 `tip` 原样深克隆过去，新段/合并段就自动继承原姿态偏移——正是「一次性骨骼数据写入」，无需改程序化管线。
   - 附带修复（同类误删风险，P0）：选中 zipper 后按 `-`（删的是 order 最大者，可能正是选中那个）→ `panelSplitSelection`/`strandSplitSelection` 仍持有已不存在的 order → 下次按 Del 时 `deleteSelectedPanelSplit` 找不到 order 返回 false → **穿透到 `deleteCurrentSelection()` 删掉整根头发**。新增 `hasOrder` + `dropDangling{Panel,Strand}SplitSelection`，增删后清理悬空选择。
   - 附带修复（strand tip 回退路径的多拉链错误）：`currentStrandSplitTipChains`（app.js）的回退分支用单一 `splitStart = 1-strandSplitHeight` 与 2 管规则 `direction = tubeIndex===0?-1:1`，N>1 时叉口深度与推开方向都错；该回退恰在**刚加完 zipper、`strandSplitRestCenters` 长度尚不匹配**时会走到，从而把继承的 delta 应用到错误 rest 位置。改用新增的 `strandSplitForkTForSegment`/`strandSplitDirectionForSegment`（与 `createSplitStrandGeometry` 同规则，N=1 退化为旧值）。
   - 附带修复（校验脚本写死期望导致误报）：`scripts/verify-skeleton-layout.mjs` 原写死「Front Bangs 1 seg0 exposes 2」，用户用新 +/- 编辑存档后段的相邻高度改变（实测该档现为 2 拉链、order 1/3 非连续、三段 height 均 0.4375 → 三段 exposed 均 3）导致**误报为回归**；改为按同一公式从存档现场推导 + 「暴露数随叉口深度单调」交叉校验。排查要点：该脚本直接读 .ahs JSON、不经被改代码，故「校验数下降」应先怀疑存档变化而非代码回归。
   - 验证：新增 4 测试——插入错位回归（tip delta 序列 `[0,1,1,2]`，旧实现为 `[0,1,2,null]` 即错位 + 末段默认）、深克隆不别名、删除按 span 选 survivor（含显式 survivorIndex 优先与无 spans 回退左段）、悬空选择清理；Node 全量 271/271，真实 `Sussurro_v1_0060.ahs` 98/98。

14. **发尖 WidthCurve 出现抓不到的控制点 → 宽度凹陷（0.2.118 修复，两侧 zipper 高度不同时触发）**
   - 问题（用户报告）：发尖 WidthCurve 的绿色控制点有些**不会暴露在视口上**，导致发尖宽度曲线出现**凹陷**；现象出现在两个 zipper 高度不一时、**较低那个 zipper 对应的另一侧**会有一个点无法控制。
   - 根因（三处不一致，panel-tip-strand.js）：① `buildTipWidthCurve`（旧 L371）按 `tipWidthCommonForkT`（**最深** zipper）分布并写入控制点，两侧共用同一批 chain 参数；② 采样器 `tipWidthMultiplierAt`（L307）在 `t < 本侧 sideForkT` 时回退**全局曲线**（发尖曲线只管暴露区）；③ `tipWidthControlPlacement`（旧 L601）又把 `t < sideForkT` 的把手**隐藏**。于是落在 `[commonForkT, sideForkT)` 的点在浅 zipper 侧「活在曲线数据里、值取自全局曲线采样、参与宽度采样，但视口没有把手」，且恰好卡在采样器切换全局/骨骼曲线的边界上 → 该处宽度不连续，表现为用户抓不到的凹陷。旧注释（L358）其实明写了 "Points below this side's fork stay in the curve data but the sampler ignores them"，即该行为是**已知设计**，但它与「控制点必须可抓」冲突。
   - 第二个隐藏活点来源（子智能体发现）：`buildTipWidthCurve` 原**无条件**写入「对侧 fork 记录点」（用途是 `asymmetricWidthCurve=false` 时几何只采样 primary 曲线，只写本侧 fork 会让对侧 fork 在重建后重新阶跃 → zipper 开裂）。当对侧 zipper 更浅（对侧 fork 更靠发尖）时，该点落进**本侧暴露区内部**，成为无把手却参与采样的活点，且其值被钉在全局曲线采样上、而左右邻居是用户创作值 → V 形凹陷，与报告症状一致。
   - 修复：新增 `tipWidthSideControlTs(lock, segmentIndex, splits, side)`——控制位置改从**本侧自己的 fork** 分布，使「影响某侧宽度的控制点必定可抓、可抓的控制点必定影响该侧宽度」成为**构造性不变式**（而非靠守卫过滤）；`tipWidthResetCurve`/`buildTipWidthCurve`/`tipWidthControlPlacement` 三处统一改用它，隐藏守卫降级为安全网。新增 `tipWidthRecordsOppositeFork`：对侧 fork 记录点仅在「落在本侧 fork 之下（采样器忽略区）」时才写，保留防开裂目的又不产生活点。配套两处：`setTipWidthCurveValue` 把写入位置**吸附到本侧控制网格**并跳过本侧锁定区（对称拖拽 bone-interaction 用同一个 t 写两侧，位置按侧分布后该 t 通常不是对侧的控制位置 → 不吸附会写出无把手点并被下次 `buildTipWidthCurve` 丢弃，即**编辑静默丢失**）；`taper-editor.js` 浮动面板锁定点规则改按侧 fork（否则浅侧已可抓的点被误判为锁定）。
   - 向后兼容：旧档曲线加载时不改写（无跳变）；首次重建时 `buildTipWidthCurve` 对已有创作数据按新位置**重采样旧曲线**迁移形状（原逻辑是精确命中否则退回全局默认 → 旧档会突然跳变或留下凹陷）；`sampleTaperCurve` 空曲线返回 1 且 clamp t，故过期参数区间退化为插值，无 NaN。
   - 验证：新增 2 测试（两侧无隐藏活点——对每个 index 断言 placement 非 null 而非只比数值；Reset 后两侧整个暴露区宽度恒 1 即无凹陷）+ 1 旧档迁移测试；`scripts/verify-tip-select.mjs` 的 9 处公共 fork 推导改按侧，其中旧断言 `rightVisible < leftVisible`（**把本 bug 当预期行为在测**）改为「两侧 6 个位置全部可抓」。Node 全量 275/275、真实 `Sussurro_v1_0060.ahs` 98/98。
   - **重要后续修正（0.2.123，本条的修法只对了一半）**：上面「消除隐藏活点」的**目标正确**，但采用的手段——把控制位置从公共（最深 zipper）fork 分布改成**每侧各自从本侧 fork 分布**——是**设计错误**：那样两侧恒定各 6 个点、各自在**不同长度**区间上等分、间距不一致（左 zipper 0.5 / 右 0.2 时左间距 0.10、右 0.04），用户实际要的是「两侧共用同一套参数网格（间距一致），**暴露几个**按各自 zipper 高度动态决定」（深侧 6 / 浅侧 3）。0.2.123 改为 `tipWidthGridTs`（唯一共享网格）+ `tipWidthSideExposesT`（暴露判据单一定义点）+ `tipWidthSideControlTs` 过滤出本侧子集，索引仍指完整网格、未暴露者 placement 返回 null 由视口隐藏；本条的无隐藏活点不变式仍构造性成立（`tipWidthRecordsOppositeFork` 守卫保留，理由见 local-adaptation-log 0.2.123）。**教训（已写入 development-standards）**：修 bug 时若顺手改动「用户可见的编辑手感/布局」，那属于**设计变更**、必须单独确认，不能夹带在 bug 修复里——本条把两件事绑在一起，导致又绕一轮。
   - **待浏览器验收**：视口把手渲染与该 puppeteer 脚本始终未跑浏览器（仅纯函数/node 级验证）。

15. **发尖骨骼根部用 round 落到自己第一个暴露子节点之上（0.2.118 修复）**
   - 问题（用户报告）：发尖骨骼根部是四舍五入的，应该用 floor 或 ceil；或「始终在最高 zipper 四舍五入后再往上暴露一个发尖骨骼」。
   - 根因（usda-export.js）：暴露链点用**严格**判定 `t > forkT`（L703-706），即第一个暴露索引 = `floor(forkT·(mainCount−1)) + 1`；但父锚点用 `Math.round`（`splitBoneLayout` L617 旧 / `splitChainLayout` L709 旧）。当 `frac(forkT·(mainCount−1)) > 0.5` 时 round 会跳到（甚至越过）**自己的第一个暴露子节点** → 骨骼根与其子节点落在同一主链索引上，等于根没有锚在 zipper 行之下。实测 mainCount=6：h=0.4375 → forkT=0.5625、firstExposed=3、round=3（错）/floor=2（对）；h=0.5、0.3、0.28 同样出错，**6 个常见高度里 4 个错**，且 0.4375 正是当前工程使用的高度。
   - 修复：新增导出纯函数 `splitParentMainIndex(forkT, mainCount)` = `clamp(floor(clamp(forkT,0,1)·(mainCount−1)), 0, mainCount−1)`（`mainCount ≤ 1` 恒 0），两处 `parentMainIndex` 统一调用。新根恒等于 `firstExposed − 1`，严格位于第一个暴露点之下，与严格暴露判定自洽——即用户描述的「在 zipper 行锚定、再往上暴露发尖骨骼」。
   - 与视口取整的关系（已核对，不统一）：视口 `firstBelow` 用 `ceil`（bone-view-handles.js L459、bone-interaction.js L99/L629），`root <= firstBelow` 在 6 个高度上全部成立。`forkT·last` 恰为整数时（如 h=0.2）视口 ceil 得 4、导出严格规则得 firstExposed=5 —— 视口刻意把 fork 行作为引导线首点，导出刻意排除该行（该行 capture 仍归主链，`tipCaptureWeightAt(0.7,0.7)===0`），二者语义不同故**不应统一**。`project-files.js` L578 只做名字插值，floor 保证索引在 `[0, mainCount−1]` 内，无需改动。
   - 验证：新增回归——对 6 个高度断言 `parentMainIndex` **严格小于**首个暴露链索引（旧 round 在 4 个高度上违反）。更新 3 处旧断言（`main.4→main.3`、`main.3→main.2` ×2）：它们原本写死的正是 round 的错值，其中 `splitChainLayout` 那两处的缺陷直接可见——`chain0.joints[0]` 正是其自身采样链点 index 4 的关节。Node 全量 275/275。
   - **后续修正（0.2.119，方向取反）**：上述「根严格位于首个暴露点之下」的结构性结论正确，但**暴露方向反了**——用户要求「多暴露一个发尖骨骼」。暴露规则从严格 `t > forkT`（首个暴露 = `floor(forkT·last)+1`）改为 `firstExposed = clamp(floor(forkT·last), 1, last)`（fork 所在行本身也暴露），根随之 `= firstExposed − 1`。6 个高度各多一根发尖骨骼（h=0.4375：3→4 根、root main.2→main.1；h=0.2 从退化的 1 根变 2 根）。下界钳 1 是不变式关键（否则 `forkT·last < 1` 时 root 会等于 firstExposed），且索引 0 是坐在主链上的链根、不可暴露。**必须四处同规则**：导出暴露循环、`tipChainNearestIndex`（`project-files.js` L753 用 `index === i0` 区分根关节与 `tip.N`，不同步会绑到不存在的关节 → 权重丢失）、视口 `bone-view-handles.js` 两处、`bone-interaction.js` 两处（`ceil`→`floor`）。副作用（正面）：视口 `firstBelow` 与导出 `firstExposed` 六个高度全部相等，上文「刻意不统一」的结论作废。`tipCaptureWeightAt` 刻意不动（几何 capture 归属，非骨骼索引）。另修 `verify-skeleton-layout.mjs` 的「split 不得 parent 到 main.0」旧守卫——新规则下深 zipper 的 `root=0` 是正确结果（Side Left 2 height 0.62 → firstExposed=1/root=0），改为断言 root 由 fork 深度推导且 `< firstExposed`。回归：275/275 + 真实工程 130/130。

16. **笔刷雕刻发尖时发尖跳回原位（0.2.120 修复，笔刷与拖拽坐标空间不一致；非 zipper 专属）**
   - 问题（用户报告）：加 zipper 后用**笔刷**动发尖，发尖会**跳回原来的位置**；拖拽发尖把手正常，只有笔刷会跳。
   - 根因：发尖姿态存为 `bone.tip = {points, restPoints, twists, active}`，`materializeTipChain`（tip-sub-bone.js L37-58）渲染的是 `shown[i] = rest[i] + (points[i] − restPoints[i])`——即 `authored.points` 是「**旧** rest + delta」的陈旧绝对空间，视口画的是物化结果而非 `points` 本身。两条拖拽路径（bone-interaction.js L370-393 panel / L410-435 strand）都按 `rest[point] + delta` 计算、再把 `restPoints` 重基准到当前 rest，**空间自洽**；而笔刷 `applySubBoneBrushSample` 在 L622（旧）从 `authored.points` 取种子（陈旧空间），末尾 L747-749 却把 `restPoints` 重基准到**新** rest → 继承/既有的 delta 被销毁，发尖瞬间落回 `authored.points` 的旧位置。1D 验算：旧 rest 0、authored 5（delta +5）、新 rest 20 → 视口正确显示 25；笔刷取 5、推到 6、写回后渲染 `20+(6−20)=6`，**跳回量恰等于 rest 链位移（−20）**。
   - 修复：笔刷改从**物化链** `tip.points` 取种子（`splitTipForSegment` 返回 `materializeTipChain` 的结果，L749-750，正是视口所画；`tip.points` 与 `rest` 同空间），写回逻辑保持不变——此时 edited 与 rest 同空间，存储的 `points − restPoints` 恰为相对当前 rest 的可见偏移，下次渲染的 delta 重叠加变成**恒等**，与拖拽路径的不变式一致。`twists` 同步改读物化数组 `currentTwists`（L688 `sculpt-push`、L712-713 `sculpt-orient`；twists 无 rest 基准，但物化数组长度恒为 `rest.length` 且已归一化）。保留 `authored.points` 作为物化链畸形时的兜底（无 authored tip 时 `materializeTipChain` 返回 `points === restPoints`，行为不变）。
   - **影响面比 zipper 更广**（排查确认）：`splitTipForSegment` 的 rest 由 `tipSurfaceFrameAt(lock, t, centerU, segmentIndex, splits)` 重建，因此**任何**移动 rest 链的操作都会触发——主链控制点编辑、zipper 位置/高度变化（改 `centerU` 与 fork）、面板宽度/厚度/曲率、面板 loop 数变化（改 `mainCount` 即链长）。旧代码下这些情况的**首次笔刷描边都会跳**；加 zipper 只是每次都制造大幅基准错位、最容易复现。
   - 未受影响：**普通发丝 / split 管没有笔刷路径**。`applySubBoneBrushSample` 是唯一子骨骼笔刷入口（单一调用点 sculpt-geometry.js L549）且在 L604 硬门控到 panel（`!isPanelGeometry(lock) → return false`）；`currentStrandSplitTipChains` 仅两个消费点（L249 拖拽锚点、L416 `strandTip` 拖拽分支）均为已正确的物化空间写法。发丝侧只能拖拽，从未受此 bug 影响。
   - 刻意未改：`materializeTipChain` 与 bone-model.js 的 `remapSegmentBonesOnInsert/Delete`——姿态继承（新段深克隆来源段的 `points` + 旧 `restPoints`）是 0.2.117 的**正确**设计，正是它让 delta 有意义；本 bug 是消费方读错空间，不是数据错。
   - 验证：新增纯数据回归（非源码字符串断言），三段——① 继承语义锁定（authored rest 0 / points 5，物化到新 rest 20 → 显示 25）；② 修复后往返恒等（从物化值 25 取种子、推 +1、写回 `points=26/restPoints=20`，再物化仍为 26）；③ **负向对照**（按旧方式从 `authored.points` 取种子 → 得 6，并断言 `buggy − fixed === −20`，让测试自解释它守的是哪个回归）。Node 全量 276/276、真实 `Sussurro_v1_0060.ahs` 130/130。

17. **普通发丝加多个 zipper 只有一条缝张开（0.2.124 修复，0.2.116 移植遗留；离散 direction）**
   - 问题（用户报告）：zipper 从 panel 移植到普通发丝后，**加多个 zipper 也只有一条缝真的起效**，其余 zipper 看起来什么都没做。
   - 根因（`modules/geometry/strand-geometry.js` `createSplitStrandGeometry`）：每段的横向推开量是 `opening = baseWidth · tubeSpread · smoothstep(t, sectionSplitStart, 1) · direction`，即**整管沿 `frame.x` 平移**；而 `direction` 取的是**离散 ±1/0**（`i===0 → −1`、`i===splitCount → +1`、中间 `Math.sign(sectionCenterX − profileMidX)`）。两条相邻管之间的缝，只有在它们**朝相反方向分开**（`direction[i+1] > direction[i]`）时才张开——离散取值下相邻管经常拿到**同一个** direction，于是一起平移、缝始终闭合。实测（profile minX=−1/maxX=1）：1 zipper → `[-1, 1]` 开 1/1（旧行为正常，所以移植时没发现）；2 zippers @ −0.4/0.4 → `[-1, -1, 1]` 只开 **1/2**；3 zippers @ −0.5/0/0.5 → `[-1, -1, 1, 1]` 只开 **1/3** —— 无论多少 zipper 永远只开一条。
   - 修复：改为**单调递增的每管偏移**，抽成 `bone-model.js` 的导出纯函数 `strandSplitDirection(k, N) = (2k − N) / N`（k=0..N）。性质：严格递增 → **N 条缝全开**；总横向跨度恒为 2 → silhouette 不随 zipper 数膨胀；关于 0 对称 → 发丝整体不侧漂；中间管位移小于外侧管；**N=1 时恒为 `[-1, +1]`，与旧版逐字节一致**。
   - **三处必须同步**（本 bug 的真正教训）：该规则此前被**复制成三份**——`strand-geometry.js`、`bone-model.js` 的 `strandSplitDirectionForSegment`、`usda-export.js` 的 `strandDirectionForTube`。只改几何会让**骨骼与 USDA 导出的横向偏移和渲染出来的管错位**。按 0.2.121 规范抽成单一定义点后另两处**真 import**（已核实无循环：bone-model 只 import three；usda-export 原零 import，新增后 usda-export → bone-model → three，浏览器 importmap 与 node 测试均覆盖）。**这条规则是在「单一定义点」规范之前被抄三份的，所以 bug 藏得住**——移植功能时若把某条推导抄进新模块，必须当场抽函数。
   - 顺带修：`index.html` L1191 的 Split Spacing tooltip（「how far apart the **two** tip branches open」自多 zipper 起过时；该字符串无 localization key）。
   - 验证：新增 5 测试——N=1 恒 `[-1,1]`（legacy 一致）；**严格递增使每条缝都开**（旧离散规则在 N=2 得 `[-1,-1,1]` 会失败此断言，即本 bug 的回归守卫）；对称不侧漂；**三消费方对同一 lock 每根管逐值一致**（跨消费方一致性断言）；几何级「N+1 根管在 tip 处全部横向分离」。Node 全量 293/293、真实 `Sussurro_v1_0060.ahs` 130/130。**待浏览器验收**：视口里加 2+ zipper 目视确认每条缝都张开（本轮为纯函数/几何级验证）。

18. **N≥2 拉链时第 3 根管及以后没有发尖把手（0.2.125 修复，0.2.116 N-泛化遗留）**
   - 问题：普通发丝加到 2 个以上 zipper（≥3 管）后，**第 3 根管起既看不到黄色发尖手柄、也看不到引导线**，那些管的发尖子骨骼无法拖动。
   - 根因（`modules/bones/bone-view-handles.js`）：创建块与更新块**双双写死 2**（`for (let tubeIndex = 0; tubeIndex < 2; ...)`），注释也还写着「one per tube (0/1)」。0.2.116 把管数泛化成 N+1 时漏了这两个循环。**写入侧早已泛化**（`app.js` 的 Tip Length / Reset Split Tips 都是 `chains.forEach`），所以数据能改、把手看不见——纯遗漏，修它不改任何用户可见设计。
   - 修复：创建按 `lock.strandSplits.length + 1`（刚被 `cloneStrandSplits` 归一化过，与 `strandSplitBonesFor` 同真源，三方恒等）；更新遍历**实际分配的数组长度**并与骨骼数组求交（`placeableTubeCount`）——遍历交集会让骨骼数组缩短时残留把手永久可见，故循环用数组长度、放置用交集，越界不可能发生。**刻意不用** `strandSplitBonesFor(lock)?.length`：它对未启用 split 的发丝返回 null，会分配 0 个把手，而创建只在 `rebuildCurveObjects` 跑一次、启用 split 后不再重分配。
   - 顺带修 `bone-model.js` 两处与下方代码矛盾的旧契约注释（「length 2」「exactly two tubes」）。
   - 验证：源码断言（模块 THREE/DOM 耦合、node 不可执行，与既有同类断言同理）+ 行为断言（N=2 → 3 管 = `strandSplitBonesFor` 长度）+ **「文件内不再存在 `tubeIndex < 2` 字面量」计数断言**；负向对照实测：还原两个字面量 → 1 fail。

19. **X 镜像把每根管的发尖姿态贴到错误的管上（0.2.125 修复）**
   - 问题：`mirrorStrandSplitBones` 只翻转每根管的横向分量，**不反转管顺序**，旧注释称「两管左右对称所以保持顺序」。
   - 根因：管下标 = 从左到右的横向次序，这由 `strandSplitDirection(k, N) = (2k − N)/N` 的**单调性**决定（本仓库唯一定义点）。绕 X 镜像把最左管映到最右管，故源管 k 的创作数据在镜像体里属于下标 **N−k**。panel 侧的 `mirrorSplitBones` 早就 `.reverse()`，`mirrorBones` 对全 split registry 也 reverse——**三条镜像路径里只有发丝这条漏了**。
   - 修复：`bones.slice().reverse().map(...)`（先 slice：两个调用点都直接传 `lock.strandSplitBones`，原地反转会破坏源 lock）。派生字段处置**一分为二**：`name` 置 null 交由 normalize 按新下标重派生（继承会让下标 k 的骨骼叫 `split.${N-k}`，USDA 关节名与骨骼层级错位）；`parentParam` **刻意保留**——① 它在 reverse 下恒等：镜像 splits = 源 splits 取反 position 后重排 = heights 数组整体反转，故 `forkT'(k) = 1 − max(h'[k−1], h'[k]) = forkT(N−k)`，正是随管携带过来的值（主进程逐管实测 4/4 成立）；② 置 null 反而**损坏存档**：镜像路径直接赋值 `partner.strandSplitBones`、**不经** materialize，保存时 `strandSplitBonesToData` 的 `?? 0.5` 会把 null 永久写成 0.5、摧毁叉口深度。
   - 验证：N=2 三管各带可区分的 tip x 与 twist，断言下标 k 拿到源 N−k 的数据且横向取反、y/z 不变；**负向对照**断言未反转结果不成立（实测删掉 `.reverse()` → 2 fail）；另测 N=1 legacy 与空/null 输入。

20. **Split Spacing 滑杆在骨骼 materialize 之后完全失效（0.2.125 修复）**
   - 问题：普通发丝的 Split Spacing（`#strandSplitGap`）拖动只改读数、**不改网格**。触发条件是任何一次 +/−、Tip Length、Reset Split Tips 或拖发尖——即正常使用几步之内必然发生。
   - 根因：几何优先读 `bone.spread`（`strand-geometry.js` 的 `splitBones[i]?.spread ?? defaultSplitSpread`），而 `defaultStrandSplitSpread(lock)` 只在 `bone.spread == null` 时才被查（`bone-model.js`）。materialize 后每根管都持有显式数值，全局标量再也到不了网格。滑杆处理器只写标量。主进程实测：materialize 前 0.12→0.4 生效；materialize 后改 0.05 被忽略、spread 卡在 0.4。
   - 修复（**用户已确认语义**）：Split Spacing 是**全局刷子——写入每一根管**，与其既有 tooltip「the default spread for every split tube」一致；代价是它会覆盖用每管滑杆单独调过的 spread（panel 侧没有这个全局滑杆，故无此权衡）。新增单点定义 `applyStrandSplitGapToTubes(target)`（`segment-control.js`，与 `applyStrandSegmentSpread` 相邻并**共用** `SPREAD_MAX = 0.99`，顺带消除了后者内联的 0.99）。接线只在共享处理器里加一行 key 条件，写入放进 mutator 内部 → 多选与镜像同步复用 `editSelectedLocks` 既有的「几何 → 曲线对象 → 镜像 → 统计」序列，不新增第二条重建路径。滑杆 UI range 仍是 0..0.5（未动），但写入按 spread 定义域钳到 0.99——两者差异已在注释中说明。
   - 验证：主进程独立实测（真实导出函数）——中间管先authored 成 0.77，改 gap 后三管齐变 0.05、gap=5 钳到 0.99、非 split 发丝返回 null 不动；子智能体测试含**负向对照**（旧行为得 `[0.4, 0.77, 0.4]`，修复后 `[0.05, 0.05, 0.05]`）。

21. **X 镜像未排序 → 把错误 zipper 的高度写进 legacy 标量（0.2.125 修复）**
   - 问题：镜像伴生体的 `strandSplits` 由 `map(position → −position)` 得到、**不重新排序**，随后 `syncStrandSplitLegacyFields` 取 `strandSplits[0]` 回写 legacy 标量——那已不是最左的那条 zipper。
   - 主进程实测：源 `[{−0.5, h=0.7}, {0.2, h=0.25}]` → 伴生体数组 `[{0.5, h=0.7}, {−0.2, h=0.25}]`，写出 `position=0.5, height=0.7`，而排序后首条应是 `−0.2 / 0.25` —— **写错了高度**。这不是「下次重建会自愈」：legacy 标量是 N=1 的真源、参与 save/load，并且（见下）曾是新增 zipper 的继承来源。
   - 附带：裸 `.map` 绕过了 `cloneStrandSplits`，丢掉 position/height 钳位、`order` 去重与「空数组按 legacy 标量回退成 1 条」的保证。
   - 修复：两处镜像站点（live mirror 与 snapshot）统一 `cloneStrandSplits(...)` → negate → `.sort()`，与紧邻下方 panel 的 clone→negate→sort **同形**。snapshot 那处原本靠 `addLock` 下游重新归一化而**侥幸正确**，仍一并改正——依赖下游重排来掩盖局部错误的数组，正是规范点名的漂移来源。
   - 验证：断言伴生体数组升序、legacy 标量等于排序后首条（用 0.7/0.25 非对称 fixture 使错序可被检出），并断言裸 negate 写法已绝迹。

22. **panel 发尖 gizmo（rotate/translate）拖拽种子取自陈旧创作空间 → rest 动过之后一按下就跳（0.2.126 修复；与 #16 同类，当年只修了笔刷没查 gizmo）**
   - 问题（**panel 侧潜伏 bug**，非普通发丝专属）：选中发尖子骨骼后用 W/E gizmo 拖动，若该发丝的 rest 链自上次创作后移动过，**一按下发尖就跳一段**，跳量恰等于 rest 位移。
   - 发现经过：本轮移植「发尖选中系统」到普通发丝、给 gizmo 分派几何时读到该路径，发现它把 `bone.tip.points` 当拖拽种子。
   - 根因（0.2.120 物化空间规则的又一处违反）：`handle.position` 与 gizmo 增量都在**物化空间**（`materializeTipChain` 的 `points[i] = rest[i] + (authored.points[i] − authored.restPoints[i])`，即视口所画），而 `authored.points` 是**旧 rest 基准**下的陈旧绝对坐标。两者混用时，只要 rest 动过（主链编辑 / zipper 位置或高度 / spread / 面板宽度 / 发丝 Split Spacing 都会动 rest），种子与把手位置就差了一个 rest 位移。
   - **为什么长期没被发现**：只有「先让 rest 动过、再用 gizmo 拖发尖」才复现；单独调 gizmo 不动 rest，值恰好相同。#16（笔刷）当年修的是同一条规则的另一个消费方，但没有回头审计 gizmo —— 印证规范里那条「一条推导规则只准有一个定义点」：种子取值当时在笔刷/rotate/translate 各写了一遍。
   - 修复：取种子与写回集中成两个单点定义 —— `tipDragSnapshot(tip)`（`startPoints` ← 物化链 `points`、`restPoints` ← **同一次物化**的 `restPoints`，成对取值）与 `writeTipEdit(bone, points, restPoints)`（写回 `points` = 物化空间编辑结果、`restPoints` = 同批 rest；**两行必须成对**，单独改 `points` 会让 delta 相对旧 rest 被重新解释）。笔刷/rotate/translate 三条路径统一走这两个函数。
   - **对既有 panel 工程无影响（主进程实测，非推断）**：探针直接调 `materializeTipChain` —— ① rest **未动**时物化值与 `authored.points` **逐值相同**（max 差 `0.000000000000`）⇒ 种子切换是恒等；② rest 移动 y+0.2 时，物化值与 authored 的偏差在**全部 4 个链点上恰为 (0, 0.200000, 0)** ⇒ 正是旧写法会产生的跳变量；③ 创作 delta（点 2 的 +0.5 x）在 rest 移动后仍被保留。
   - 教训：修某条规则的违反时，必须**把该规则的全部消费方列出来逐个查**，而不是只修报告出来的那一个。#16 只修笔刷，导致同一条规则在 gizmo 上又躺了 6 个版本。

23. **普通发丝发尖 WidthCurve：对称编辑却只有一侧动（0.2.128 修复；与 panel 在 0.2.80 后修的是同一条规则）**
   - 问题（用户报告）：拖普通发丝发尖 WidthCurve 的绿色控制点调宽度，「两侧不对称，一侧位移很小，但右边曲线面板里又是正常的」。面板正常 ⇒ **写入没问题**，错在**消费**（几何）。
   - 根因：`app.js` `strandProfileTopologyAt` 的 `x_out = profile.x · strandRadiusAt(...)` 是绕**全局 profile 原点 x = 0** 的缩放，位移 `profile.x · (m − 1)` **正比于 |raw x|**。管（tube）的 band 一般**不以 0 为中心**，于是同一个对称 multiplier 在一根管的两侧落在差别很大的 |x| 上、位移差别很大。
   - 实测（16 边形 profile、对称 m = 1.5，`scripts/tmp-asym-probe.mjs`）：

     | N | 管 | band | 中心 | 低侧位移 | 高侧位移 | 老式不对称比 | 绕管中心 |
     |---|---|---|---|---|---|---|---|
     | 1 | 0 | [−1.000, 0.000] | −0.500 | −0.500000 | **0.000000** | **∞** | 1.00× |
     | 1 | 1 | [0.000, 1.000] | +0.500 | **0.000000** | 0.500000 | **∞** | 1.00× |
     | 2 | 0 | [−1.000, −0.400] | −0.700 | −0.500000 | −0.200000 | 2.50× | 1.00× |
     | 2 | 1 | [−0.400, 0.400] | −0.000 | −0.200000 | 0.200000 | 1.00× | 1.00× |
     | 2 | 2 | [0.400, 1.000] | +0.700 | 0.200000 | 0.500000 | 2.50× | 1.00× |

     **N = 1（默认拉链，真实工程的形态）时缝侧位移恰为 0** —— 那个绿把手拖了网格一动不动，即「一侧位移很小」的极端形式。只有**奇数**拉链的中间管恰好跨 0 才碰巧对称，所以现象看起来时有时无。
   - 修复：override 生效时绕**管中心**缩放（与 panel 在 `panel-split-tip-bones.md` §8.20 改成 tip-relative 的**同一条规则**：段宽度以段中心为参考，不是主骨骼中心 u = 0）。
     `x_out = (x · R_override(x) + pivotX · (R0(pivotX) − R_override(x))) · scaleX`，`pivotX = override.centerX`（管中心，profile 局部空间）。
     - **为什么这样写而不用代数等价的 `pivotX·R0 + (x − pivotX)·R_override`**：`R_override === R0` 时 `R0 − R_override` 恰为 0、`pivotX · 0` 恰为 0，于是 **m = 1 逐位**化简回老式 `x · R0`。第二式在浮点下只是近似相等，会让 byte-identity 断言必须放宽到容差。
     - pivot 半径取**基础**曲线在管中心处的值（与 multiplier 无关）⇒ 宽度编辑仍是**纯缩放、不掺平移**（红线 4）。
     - `centerX` 由 `strand-tip-width.js` 的 `boneCurveOverride` 随 override 载荷下传（几何路径必传）；纯读值路径 `strandTipWidthMultiplierAt` 不带 band ⇒ `centerX` 为 undefined ⇒ app.js 退回绕 0 缩放，与缩放中心无关，不受影响。
   - **总量不变，只改分布**：发尖行总宽度仍恰好按 multiplier 缩放（测试里以无量纲的 span 比断言）。N = 1、m = 0.4 时老式是「外缘 +0.12 / 缝 0.00」，修后是「外缘 +0.06 / 缝 −0.06」—— 同样的收窄量，不再全压在一侧。
   - **UV / row 0 契约**：override 在 `t <= fork` 恒为 null，row 0（t = 0）永不进入本分支 ⇒ row 0 逐位不动，`unfoldHairMesh` 的 uv 逐值相等（既有断言继续通过；真实工程 7/7 浏览器校验 0 异常）。
   - 缝顶点**应该**动：拉链两侧的管各自绕自己的中心缩放，缝侧是管的切面。对称编辑的定义就是两侧位移等值反号，缝侧不动才是 bug（那正是老式行为）。
   - 验证：新增 3 条断言（偏心管等值反号 + 总量不变、N = 1 缝侧位移 ±0.06、m = 1 逐位恒等）。**反向对照**：把 pivot 项置 0 后前两条立刻红（高侧/缝侧位移 `got 0`），source-text 守卫同时红（证明不是空跑）；恢复后全绿。
   - panel 侧**逐字节未动**：`panel-tip-strand.js` 不调用 `strandProfileTopologyAt`，其发尖宽度早已以段中心为参考。

24. **普通发丝正中间管的 Tip Clump 是死控件（0.2.132 修复；自 0.2.116 多拉链移植起就存在）**
   - 问题：偶数拉链数时**正中间那根管**（N=2 的管 1）拖绿手柄、拉右侧 Tip Clump 滑杆，读数会变但**网格一动不动**。
   - 根因：Tip Clump（当时叫 `bone.spread`）在发丝几何里**只**经 `opening = baseWidth · spread · smoothstep(t, fork, 1) · direction` 生效，而 `direction = strandSplitDirection(k, N) = (2k − N)/N`。`k = N/2` 时该系数恰为 **0** ⇒ 整个 opening 恒为 0 ⇒ 该管对任何 Tip Clump 取值都无响应。这一点当年是**知情的**（`strandTipClumpAxis` 的 DEGENERATE 注释把它记作「已知几何行为，不是本函数的 bug」），但它其实是个用户可见的死控件。
   - 修复：Tip Clump 语义整体改为「绕**本管 band 中心**的相对收窄」（与 panel 同义，共享 `tipClumpNarrowFraction`），不再乘任何方向系数 ⇒ **每一根管都必然响应**。同轮删除 opening 平移语义本身（用户决策：分离改由拉 zipper 实现）。
   - 验证：新增测试「中间管的 Tip Clump 现在会动网格」——断言 Tip Clump 0 → 0.8 使该管发尖行 span 严格变小，且两侧极值**中点逐值不动**（证明是绕管心缩放、不掺平移）；旧实现下这两个 span 逐位相同（死区）。

25. **绿色 Tip Clump 手柄在真实工程里拖不动（0.2.132 当轮引入并修复；node 测试全绿、真实浏览器抓到）**
   - 问题：把 Tip Clump 轴的跨度基准改成「t = 1 处该管的真实网格边缘」后，手柄轴长恒为 0 —— 视口里拖不动，且 N+1 个手柄重叠成一个、无法分辨在拖哪根管。
   - 根因：**`DEFAULT_TAPER_CURVE` 的末点 `value` 恰为 0**（`app-config.js`；真实工程 layered-side-bun 的 Front Bangs 逐值相同）。于是 t = 1 处每根管的宽度都是 0、两侧边缘塌到脊柱同一点。旧实现的轴跨度来自已删除的 opening（与 taper 无关），所以此前不暴露。
   - **为什么 node 测试没抓到**：`split-tip-geometry.test.mjs` 的 fixture 用恒 1 的 `FLAT_CURVE`，管在 t = 1 仍是满宽 —— 掩盖了真实工程的形状。教训：**凡「取发尖处几何量」的把手/放置逻辑，fixture 必须至少有一个 taper 收到 0 的构型**。
   - 修复：轴跨度改用**标称管宽**（band 的 profile 极值 × baseWidth × widthScale × 该行 pointScales.x，**与 taper 无关**），正对应 panel 用「不随 taper 收缩的段 boundaries」建 handleU。taper 恒 1 时标称跨度与真实边缘重合。同时保住仿射性（两端点都不含 Tip Clump，它只作 lerp 系数）——拖拽端 49 探针反演的前提。
   - 验证：`scripts/verify-tip-clump.mjs` 真实浏览器从 16/17 → **17/17**（`lowToHigh` 由 0 变为 0.146）；补 node 回归「taper(1)=0 时轴仍可拖 + 每管手柄互不重合」，并在该测试里先断言「真实边缘确实横向退化」作为前提确认。

26. **`scalp-builder.js` 三个 `deps.X` 裸引用恒为 undefined（0.2.145 发现，0.2.147 已修）**
   - 问题：`modules/scalp/scalp-builder.js` 里 `deps.editedScalpSurfaceMesh` / `deps.editedScalpRegions` / `deps.importedScalpGuideAsset` 三处依赖在 `app.js` 顶层没有同名变量可批填，实际恒为 `undefined`。使用点：L306（`deps.importedScalpGuideAsset`）、L617/L618（`editingAuthoredScalp ? deps.editedScalpSurfaceMesh : deps.scalpState.customScalpSurfaceMesh` 这类三元表达式）——即「编辑内置头皮」（`editingAuthoredScalp` 为真）分支恒取到 `undefined`。
   - 正确字段应在 `scalpState.state` 上：`modules/scalp/scalp-store.js:13` 有 `editedScalpSurfaceMesh: null`，正确写法应为 `deps.scalpState.editedScalpSurfaceMesh`（`editedScalpRegions`/`importedScalpGuideAsset` 同理）。
   - **修复（0.2.147）**：三处统一补 `.scalpState`。原意无歧义 —— `paintScalpAt` 的**上一行**（判定 `editingAuthoredScalp` 那行）读的正是 `deps.scalpState.editedScalpSurfaceMesh`，同一个字段隔一行两种写法，是漏写而非设计。
   - **真实症状比"取到 undefined"更重**：`targetMesh` 拿到 `undefined` 后，紧接的 `targetMesh.geometry.getAttribute("position")` **直接 TypeError** ⇒ 给**内置**头皮刷区域从来就是崩的，不是"行为不对"。另一处 L310 的 `content === null` 分支本意是"保留既有 guide 资产"，实际把 store 里的值**清成 undefined**；补 `.scalpState` 后成为自赋值 = 真正的 no-op，符合原意。
   - **为什么躲过了所有测试**：`createScalpBuilderApi` 要约 157 个注入依赖 + renderer/DOM/THREE 场景图，纯 node 驱动不了 `paintScalpAt`。回归改用**源码契约断言**（`panel-scalp-conform.test.mjs`，本仓库 dom-contract / split-tip-geometry 已有同手法）：剥掉注释后断言三个裸 `deps.X` 出现 0 次。**必须先剥注释** —— 修复处的解释性注释逐字引用了这三个错误写法，不剥则断言被自己的注释满足、永远绿。已变异验证：改回任一处即 `not ok`。
   - **教训**：`Object.assign(deps, {...})` 批填式依赖注入，漏填一个 key 不会有任何静态或运行时提示，直到那条分支被走到。这类 bug 的可检出面在**源码层**（`deps.X` 是否在批填清单里），不在行为层。

27. **panel 侧发尖 WidthCurve 绿色控制点不跟随发尖骨骼（0.2.148 修复，0.2.146 的 `6d4e9b0` 引入的回归）**
   - 问题：用户拖动 `bone.tip`（发尖子骨骼的 authored 链）后，网格随之形变，但绿色 WidthCurve 手柄停在原地不动。
   - 根因：`6d4e9b0`（0.2.146）为让手柄渲染吃 scalp conform，新增 `modules/bones/bone-view-handles.js` 的 `panelWidthEdgeRenderPoint` 覆写 `placement.point`，但它只调 `tipMainSectionPoint`，而后者**只读 `bone` 的曲线类参数**（taperCurve/depthCurve/tipClump）**、从不读 `bone.tip`**。真正让网格跟随 `bone.tip` 的是 `createPanelStrandGeometry` → `addPatch` 的 rest→authored 四元数再锚定这一步；旧公式 `tipWidthEdgePosition` 走 `splitTipForSegment` 所以本来是跟随的，`6d4e9b0` 换公式时把这一步丢了。
   - **为什么此前的验收探针没抓到**：panel 侧「把手跟随发尖骨骼」这条不变式此前只在**发丝侧**被显式钉住（`tests/split-tip-geometry.test.mjs` 约 L2719-2969，0.2.127 同一类 bug 的回归，走 `strandTipWidthControlPlacement`），panel 侧从未有等价测试。`6d4e9b0` 自己的验收探针只测了 amount=0 vs amount=0.89 的静态残差，两条回归用例传的 `bone` 全是 `{tipClump:0, taperCurve:null, ...}`，从没设过 `.tip`，因此从未测过「`bone.tip` 被拖动」这个场景。
   - 修复：`modules/geometry/panel-tip-strand.js` 新增三个函数——`tipChainReanchorAt`（取 rest→authored 变换：四元数 + twist 滚转 + 两个中心点，无 authored 链返回 null）、`applyTipChainReanchor`（按变换搬点）、`tipWidthEdgeRenderPoint`（渲染坐标的唯一定义点：先 conform 再链再锚定）。同时把 `panelRowParameters`/`panelLengthLoopCount` 收成唯一定义点——把手侧的 blend 分母必须与网格同源，否则渐变带内会与网格错位。`bone-view-handles.js` L691-696 原内联公式改为调用 `tipWidthEdgeRenderPoint`。**拖拽路径（bone-interaction.js）未动**——宽度拖拽是比值运算（`ratio = latOffset/startLatOffset`，起点 `ratio==1` 不产生跳变），渲染先修不会造成拖拽起手瞬间跳变。
   - 做法参照发丝侧 `strand-tip-width.js` 的 `strandTipChainTransformAt`/`applyStrandTipChainTransform`（0.2.127 同一 bug 在发丝侧的修法）：选「新增对称导出函数」而非内联进调用处，便于测试断言复合关系。
   - **实测数字**（双拉链 panel，segment=1，`bone.tip` 整链沿 +x 平移 1.0）：amount=0 时手柄位移 1.000000、网格最大顶点位移 1.000000、比值 1.0000；amount=0.89 时同为 1.000000 / 1.000000 / 1.0000。`bone.tip` 为 null 或 `active:false` 时，修复后与 `6d4e9b0` 公式**逐位相同**（在两个 amount × 两侧 × 全部网格点上 worst delta = 0）。
   - **判据踩过两个坑**：① 拿网格**全局**最大位移当分母——fork 处 blend=0，手柄本不该动，用全局最大值会稀释掉这个 0；② 拿**最近离散顶点**当分母——手柄 t=0.96 的 blend=0.874 vs 顶点 t=1.0 的 blend=1.0，比值 0.87 纯属采样位置差异，不是 bug。最终容差取 **2e-3 而非 1e-6**：reference 是截面中心点的解析值，`authoredCenter` 是 3 点链的 CatmullRom 采样，两者天然差一个插值残差（实测约 8.5e-4），`addPatch` 带着同一个残差，所以那正是「与网格一致」的表现，不该被精确断言拒绝。
   - 验证：`tests/panel-scalp-conform.test.mjs` 新增 3 条（含惰性 —— `bone.tip` 为 null/inactive 时逐位不变）。变异验证：注释掉再锚定步骤 ⇒ 比值变 0.0000，2 处断言变红。

28. **panel 侧 Tip Clump 绿球回退到全局曲线（0.2.148 修复，随 0.2.146 引入、与 conform 幅度无关）**
   - 问题：用户拖过某一段自己的 WidthCurve/DepthCurve 后，该段的 Tip Clump 绿球位置与网格产生残余偏差；与 Scalp Conform 的幅度无关，这是它与上一条 bug 的区别特征。
   - 根因：`modules/geometry/panel-tip-strand.js` 的 `tipSurfaceFrameAt` **签名里没有 `bone` 形参**，内部三处调用 `tipMainSectionPoint` 时第 5 个参数（bone）被硬编码传 `null`，导致 `bone?.taperCurve || lock.taperCurve` 永远回退到**全局**曲线；而真实网格走 `panelPoint`→`rawPanelPoint` 是正确传 bone 的，两条路径就此分叉。
   - 修复：签名末尾加**可选**形参 `bone = null`（默认 null，保证现有调用逐位不变），函数体内三处 `null` 换成 `bone`；`bone-view-handles.js` L408 把该函数本来就已经算出的 `tipSplitBones[segment] || null` 传下去。
   - **两个调用点刻意不传 bone**（已在函数上方补 12 行契约注释，防止后人顺手传进去）：`tipChainFrameAt`——该 frame 同时服务 rest/authored 两个空间，传 bone 会让 rest 侧的参考法线依赖 authored 数据；`splitTipForSegment` 的 `restPointAt`——它**定义** rest 链本身，若让 rest 依赖 authored 曲线，会造成 delta（points − restPoints）基准跟着用户拖曲线漂移，症状是「拖完曲线发尖自己跑掉」，与 0.2.120 修掉的「一动就跳回原位」同类。
   - **实测数字**（段自己的 taperCurve 末点 0.35 vs 全局 1.0）：frame 位移 0.113750，网格位移 0.097825，比值 1.1628；bone 曲线字段全为 null 时，修复后与旧行为（`bone=null`）逐位相同（delta 0）。
   - 验证：新增测试 2 条正向 + 1 条源码契约。变异验证：把传入的 `bone` 改回 `null` ⇒ frame 位移变 0.000000，2 处断言变红；给 `restPointAt` 注入 bone ⇒ 契约断言变红。**契约断言第一版没抓到**：原判据是「调用文本里不含 `bone`」，而注入的变量名叫 `splitBone`，大小写不同直接漏网；改成「实参个数恰为 5」才咬住。

29. **panel 加 zipper「必须先选中前一个」（0.2.148 修复，方案 B，用户拍板）**
   - 问题：用户报告「zipper 无法跨 zipper 移动，这导致必须先选中前一个 zipper 才能新增 zipper，挺麻烦的」（该条实为「点击拖过 zipper 手柄后按 + 加号不生效」）。
   - 根因：`+` 按钮（`modules/bones/segment-control.js` 的 `changePanelSplitCount` 的 `+` 分支）的 `insertIndex` 来自 `selectedPanelSegment` → `resolveSegmentSelection` 读 `panelSegmentIndex`；而点击 zipper 手柄（`bone-interaction.js` 的 `beginPanelSplitHandleDrag`）只写 `sculptState.panelSplitSelection`，**从不写** `panelSegmentIndex`。两套选中状态之间没有同步路径。
   - **用户拍板方案 B**（不动 `panelSegmentIndex`，改 `+` 识别 zipper 选中）。**为什么不选方案 A**（同步 `panelSegmentIndex`）：会产生用户没预期的连带跳变——右侧面板段标签/Prev-Next 可用性/Tip Clump 值/Width-Depth 曲线预览（`syncSegmentControls`）随「只是想拖 zipper」而变；浮动曲线编辑器开着会热切换到另一段（`taper-editor.js` 的 `retargetOpenSegmentTaperEditor`）；Width/Depth 预设下拉框的写入目标也被带走（`segmentCurveTargetForWrite`）。且 `panelSegmentIndex` 只由 Prev/Next 与选中发尖子骨骼驱动、zipper 选中是独立的第二套状态，这是 **0.2.117/0.2.126 的明确设计**（`modules/edit/sculpt-edit-store.js` L14-22 注释）。
   - 实施：优先级改为 `zipper 选中 > 段选中 > 最大间隙`；按 `order` 反查下标复用 `62fbd31` 的既有写法（不另发明）；反查失败（陈旧 selection / lockId 不匹配 / order 查不到）**静默回落**到现有逻辑，回落路径逐位未改。插入位置选 **k+1**（插在被点 zipper 右侧）：`insertIndex` 既有语义是「细分第 insertIndex 段」，选中 zipper 排序下标 j 的右侧是段 j+1，选 k+1 使连按 `+` 时新拉链朝同一方向持续排开。
   - 验证：`tests/strand-segment-ui.test.mjs` 新增 3 条（正向 / 回落逐位相同 / `panelSegmentIndex` 不变量）。变异验证：短路 zipper 判断 ⇒ 正向测试变红；把 `k+1` 改成 `k` ⇒ 同一测试**依然变红**（证明位置断言能咬住 k/k+1 的差异，不是仅判断存在性）。**已知盲区**（如实记录）：去掉跨度守卫的第三次变异未被捕捉，因本轮用例里 zipper 优先段本身放得下、未触发降级路径。
