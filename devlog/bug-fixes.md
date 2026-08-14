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

2. **USDA 骨骼导出：Houdini Character Import 报 "Primitive does not have any Skeleton children"（0.2.59 记录，未修）**
   - 现象：0044 导出 USDA（勾选 Bones）后，Houdini `USD Character Import` 报 `Invalid source /obj/geo1/usdcharacterimport1/**skin**` / "Primitive does not have any Skeleton children"。
   - 根因：v1 骨骼导出只输出 `SkelRoot`（`Scope "Skeletons"` 下嵌套 `SkelJoint`），**没有任何蒙皮绑定**——Mesh 上没有 `SkelBindingAPI`（`skel:joints` / `skel:bindTransforms` / `rel skel:bindTransforms`），也没有含 Skeleton 的 `skin` prim。Houdini Character Import 要导入的是「蒙皮角色」（skin 下有 Skeleton），找不到 → 该报错。这属于计划中已推迟的 weights/binding 功能（`exportIncludeWeights` 保持禁用）。
   - 修复方向（后续）：导出时给每个 Mesh 施加 `SkelBindingAPI`——`skel:joints` = 该锁 main+split 关节序列、`skel:bindTransforms` = rest 位姿、`rel skel:bindTransforms` 指向该锁 SkelRoot；如需要变形再补权重（无权重时网格停在 bind pose，Houdini 可能仍提示缺权重）。记录在案，本轮不修（见 devlog/in-progress/bone-system-roadmap.md）。

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
