# Panel split 尖端子骨骼分析：每 split 段一个「类普通发丝尖端」的子骨骼（0.2.59 规划）

> ## ⚠️ 本文档**不是**发尖子系统的当前状态（止于 0.2.65）
>
> 本文记录 0.2.59–0.2.65 的 panel 发尖子骨骼实施与修复。此后发尖子系统又经过**三轮**改动，本文**未**覆盖，读到与下列结论冲突处一律以新文档为准：
>
> | 轮次 | 内容 | 权威文档 |
> |---|---|---|
> | 0.2.123 | 发尖 WidthCurve 改回**共享网格 + 按侧动态暴露**（推翻 0.2.118 的「每侧各自等分」） | development-standards.md「发尖 WidthCurve 共享网格」行 |
> | 0.2.125 | WidthCurve **移植到普通发丝**；抽出共享层 `modules/geometry/tip-width-curve.js` + 发丝侧 `strand-tip-width.js`；每管编辑 UI | [strand-tip-width-ui-port-plan.md](strand-tip-width-ui-port-plan.md) |
> | 0.2.126 | 发尖**选中系统**移植到普通发丝；新增 `modules/bones/tip-sub-bone-host.js`；状态键 `panelTipSelection`/`panelTipHover` → **`tipSelection`/`tipHover`**；把手改为每链点一个 | [strand-tip-selection-port-plan.md](strand-tip-selection-port-plan.md) |
>
> **已知会误导的具体点**：① 本文 §8 内的 `panelTipSelection` 键名**已改名**为 `tipSelection`（几何无关，panel/发丝共用一个键）；② 本文 `tipUiActive = isPanelGeometry(lock) && …` 一类几何门控**已改为** `segmentBoneHost(lock)` 分派（`!isPanelGeometry` 是错的写法，它会卷入既非 panel 也非 split 发丝的几何）；③ 发尖把手**不再是「每段 1 个尖端把手」**，改为每链点一个 + 法线箭头，数量取自 `tipChainPointCount`；④ §8.21/§8.26 记的 `SPREAD_MAX` 历史值（1 → 0.99）以当前 `bone-model.js` 为准。
>
> 残余重复推导规则的审计见 [tip-subsystem-reuse-audit.md](tip-subsystem-reuse-audit.md)。

> **✅ 已实现（0.2.59 落地）+ 0.2.59–0.2.65 修复记录**：本文档由「规划」转为「实施 + 修复记录」——尖端子骨骼 S1–S6（程序化权重 / 数据模型 / 几何跟随 / 视口手柄 / 关联系统 / USDA 蒙皮）见 §8.5；点击 toggle 选中 + 主发丝保持 + overlay z-fighting 见 §8.6；双段高亮 + 笔刷保留 tip UI 见 §8.7；边界段 / 笔刷统一变换 / undo 持久化 / bones-only / alt+点击见 §8.8；本轮 5 项改动（0.2.59 进行中）见 §8.9。§1–§7 与「§8 待确认（实施前）」为规划期内容，已被实施取代，保留作历史。
> 目标：让用户能控制 panel 每个尖端的长短和走向；在尖端建立与普通发丝一样的子骨骼部分，以兼容现有工具。
> 分支：0.2.58-panel-split-refactor；关联：unified-bone-model.md（bonesFor/架空）、bone-system-roadmap.md（registry）、split-bone-refactor-plan.md（splitBones）。

## 1. 现状：发丝驱动系统梳理

- **主骨骼链**：所有发丝/panel 都有 `lock.points`（单链控制点）→ `strandGeometryCurve` 建 CatmullRom 曲线 → `strandGeometryFrameAt` 逐帧（切线 y + 外法线 z + twist）。几何 = 沿曲线扫掠 profile。
- **panel split（现状）**：`panelSplits`（zipper position/height）把 panel 在 u 方向切成多段；每段一个 `splitBone`（kind=split）携带 `spread`（相对尖端收窄）+ 每段 taper/depth 曲线 + p/orient（手柄）。几何：段内局部 u' + 每段曲线 + 相对缩放（0.2.59 已根除 crossover）。
- **尖端（现状）**：段尖锁定在 t=1（主曲线末端），只由 spread（收窄比例）+ 每段 taper 曲线（宽度）决定——**长短和走向都不可独立控制**。
- **splitBone 的 p/orient**：目前是视图/手柄数据（未驱动几何，orient 预留）。
- **bonesFor / 架空**：有 split 段或 children 时 main 链 role="root"（层级根），叶子 = split.*/child.*；否则 main 链 role="geometry" 直接驱动。
- **子发片参照**：子发片 = 默认扫掠 + 桥接 + 根部移动优化；子发片有自己的主骨骼链（`child.<id>.i`），根挂在父 main 上（branchParentParameter）。

## 2. 目标系统

- 每个 split 段（zipper 切出的子段）在**尖端**建立 1 个「类普通发丝尖端」的子骨骼：
  - 跟随主骨骼的大体（base 锚在段尖、方向初始沿主切线）。
  - 是真实控制点：用户可拖/转它 → 控制该段尖端**长短**（延伸/缩短）和**走向**（方向）。
  - 复用现有工具（strand 点手柄 / transform gizmo / Move-Rotate）编辑，像普通发丝尖端一样。
- 主骨骼**架空**：段尖子骨骼是叶子、真正驱动尖端几何；主链是层级根。
- **判定**：只有存在 split zipper（`panelSplitEnabled && panelSplits.length>0`）才创建段尖子骨骼；无 zipper 时主骨骼直接驱动（现状，bonesFor main role=geometry）。

## 3. 数据模型

- **方案 A（推荐）**：在 `splitBone`（registry kind=split 条目）顶层加 `tip` 字段：
```
splitBone.tip = {
  points: [{x,y,z}, ...],   // 2–3 个点（base…tip），段尖子骨骼链
  followT: <主链参数，默认 1>,
  rest: { base, direction }, // 跟随主骨骼的 rest 帧（base 在段尖、方向沿主切线）
  active: true               // 是否创建（有 zipper 时）
}
```
- 点存储：世界坐标 + 相对 rest 的 delta 派生（编辑存 delta，类似 branchLocalPoints 思路），rest 随主骨骼热更新重算。
- 持久化：随 `lock.bones`（kind=split）条目顶层 `tip` 写入；旧档无 tip → 派生默认（跟随主骨骼、无 delta）；`splitBonesToData/registryForSave/mirrorBones` 补 tip（镜像翻转 x）。
- bonesFor：`split.<k>` 现有条目已是叶子；tip 子骨骼作为该条目的子信息（或独立 `split.<k>.tip.<i>` 命名，parent=该 split 条目），role=leaf。

## 4. 几何驱动（尖端跟随子骨骼）

- 段尖行（t 接近 1 的最后 N 行）采样改为跟随子骨骼：
  - 尖端中心 = tip.points 的 base→tip 插值（相对主框架 rest 的 delta 叠加）。
  - 尖端方向（截面法线/切线） = tip 方向相对主框架的旋转。
  - **长短**：tip.points 的长度/延伸量控制尖端伸出原 t=1 之外（或缩短到段内）。
  - **走向**：tip 方向旋转尖端行（保持墙 quad/端盖 capEnd 跟随，水密）。
- 段内其余行保持现有 u' + 曲线 + spread（不回归）；spread 仍为相对缩放。
- 与 0.2.55 退化/反射 quad 跳过、焊接、法线平滑共存（尖端跟随应保持非退化）。

## 5. 编辑与工具兼容

- 视口：段尖显示 tip.points 手柄（复用 strand 点手柄/`createSplitControlHandle` 一类的拖点），transform gizmo 支持 Move/Rotate。
- 拖动写相对 rest 的 delta（热更新时 rest 重算、delta 保留——同 branchLocalPoints 的「保留用户偏移」原则）。
- 与现有 segment 手柄（拖 spread）并存：段手柄管宽度/开叉，tip 手柄管尖端长短/走向。

## 6. 实施阶段（每步独立 commit + verify-smoke）

| 阶段 | 内容 | 阻塞 |
|---|---|---|
| S1 | 数据模型：splitBone.tip + normalize/序列化/双写/镜像/快照/stroke；几何仍旧（零行为变化） | 是 |
| S2 | 几何：段尖行跟随 tip 子骨骼（长短/走向）；无 tip 时回退现状 | 是 |
| S3 | 视口：tip 手柄 + gizmo（Move/Rotate）+ delta 编辑 | S2 后 |
| S4 | 判定 + 架空：有 zipper 才创建 tip 子骨骼；bonesFor main role 联动；USDA 导出可选带 tip 关节 | 否 |

## 7. 风险 / 兼容

- 旧档无 tip → 派生默认，视觉零回归；无 zipper 的 panel 零改动。
- 水密拓扑（墙 quad/端盖/焊接/退化跳过）必须保留；尖端跟随需验证 0 NaN、无折叠。
- tip 是控制数据非真实网格骨骼：不新增 mesh，只改尖端行的采样。
- 与 USDA 骨骼导出/未来 skinning 的关系：tip 可作为该段 Skeleton 的额外关节（后续）。

## 8.5 实施状态（0.2.59 已落地，S1–S6）

- **S1 程序化权重字段 ✅**：createPanelStrandGeometry 每顶点算 [mainJoint, segment, weight]；weight = smoothstep((t-forkT)/band)，forkT = 1-max(该段两侧 zipper 高度)，u 方向权重 1（zipper 线硬分配、一发尖一骨骼）；geometry.userData.panelWeights（weld 同步）。无 zipper → 权重 0（主骨骼直接驱动）。
- **S2 尖端子骨骼数据模型 ✅**：splitBone.tip = { points, restPoints, active } 照抄主骨骼尾部拓扑（parentMainIndex = fork 最近主控制点）；normalizeSplitBones/normalizeBone/bonesToData/mirrorSplitBones 保留 tip；splitTipForSegment 派生命 rest = 主尾副本、author 存绝对点 + rest（delta 保留）。
- **S3 尖端几何跟随 ✅**：zipper 以下 final = base + w×(author 链截面 - rest 链截面)；rest 恒等（验证 maxDiff 0）；author 只动本段（seg0 动、seg2 不动）。长短 = 子骨骼链长变化、走向 = 链方向。墙/capEnd/焊接/退化跳过保留。
- **S4 视口编辑 ✅**：每段黄色 tip 手柄（panelTipHandles），视平面拖拽写 bone.tip（rest+delta）；zipper 以上无手柄、spread/曲线照常（上部保持现状）。验证：Front Bangs 1 5 手柄、拖拽移动尖端。
- **S5 关联系统改造 ✅**：splitBone p/orient 预留驱动被 tip 链+权重取代；bonesFor 输出 split.<k>.tip.*（role=leaf）；主骨骼有 split 时 role=root（架空）。
- **S6 USDA 蒙皮 ✅**：Mesh 施加 SkelBindingAPI + rel skel:bindTransforms + skel:joints + primvars skel:joints/skel:weights（vertex）；buildHairUsda 从 panelWeights 计算每顶点 [main, N+segment]×[1-w,w]。0044 导出 3 面板带 binding（修 Houdini "no Skeleton children"）。

**验证**：Sussurro_v1_0041/0042/0044 三档 11/11 smoke；尖端 authoring 保存/重载不丢、镜像翻转、rest 零回归。

### 8.6 选中/高亮交互修复（0.2.59，commit 14d6f2c→18eac4a→待提交）

**症状**：视口不卡了，但「选中不了子骨骼」——鼠标悬浮有高亮强调，点击却没有任何选中效果；拉远时高亮与 panel shader 共面 z-fighting 像素抽搐。

**根因（点击不选）**：
1. 原 pointerdown 的 tip 处理块只在「已有 panelTipSelection」时**取消**选择，从不**创建**选择 → 点击面板体永远无法选中子骨骼（只有点 tip 手柄能选，且之前手柄点击还触发视口冻结）。
2. 更隐蔽：即使 tip 块设置了 `panelTipSelection`，它**不 return**，流程继续落到 select 工具的 selection-marquee 逻辑——marquee 会重新 raycast 所有 strand mesh 并**把当前选中切换成点击点最前面的那根发丝**（实测 0044 中点击 Front Bangs 1 面板体后 `getSelectedLock()` 变成 Back 5）。用户看到的现象就是「选中了但立刻没了/没反应」。

**修复（app.js）**：
- 点击面板体（hover 命中段）→ **toggle 选中**该段 tip 子骨骼；再点同一区域 → 取消、回到主发丝选择（仅当主发丝已选中 + 有 split；无 split 的 panel 不触发；手柄/笔刷/draw/place 工具下不 toggle）。
- tip 块成功处理点击后 `event.preventDefault(); event.stopImmediatePropagation(); return;` —— 不再落到 marquee/选择逻辑，主发丝保持选中。
- overlay `tipHighlightMaterial` 设 `depthTest:false`（`depthWrite:false` 已有）→ 高亮与 panel shader 共面不再 z-fighting 抽搐；overlay `renderOrder:7`、`frustumCulled:false`。
- 之前 overlay index 用 `setIndex(rawTypedArray)` 在 THREE r165 被忽略导致数组为空 → 视口冻结（commit ab8a707），改 `new THREE.BufferAttribute(array,1)`。

**新增回归测试**：`scripts/verify-tip-select.mjs`（依赖 app.js 末尾 `?ahstest=1` 才激活的 `__AHS_TEST_SEAM__`）：
- 加载 0044 → 选中 split panel（Front Bangs 1）→ 找一个**无任何 3D 手柄遮挡**的面板体屏幕点（segment 0、权重>0.5、raycast 所有 handles 均不命中）→ 真实 CDP pointer 事件点击：
  - 点击①：`panelTipSelection={lockId,0}`、主发丝保持选中（不再被 marquee 切换）、overlay visible + `depthTest:false` + opacity 0.62。
  - 点击②：toggle 取消、回到主发丝选择。
  - 全程 0 异常。
- 三档 smoke（0041/0042/0044）11/11、12/12 通过。

### 8.8 边界段骨骼、笔刷统一变换、undo tip 持久化、笔刷 bones-only、alt+点击切换（0.2.59）

**1. 最左/最右边界段发尖骨骼不显示 ✅**：`updateCurveObjects` 里 `tipChains`/`tipForkTs` 用 `tipSplits.map(...)` 构建——只有 `splits.length` 个条目，而段数是 `splits.length+1`，最后一段（边界段）的 chain 是 undefined → 手柄/链线全被隐藏。改为 `Array.from({ length: tipSplits.length + 1 }, ...)`。0044 Front Bangs 1 现在 5 段全部有手柄（seg0=2、seg1-4=3）。

**2. orient/scale 笔刷表现成 move ✅**：`applySubBoneBrushSample` 的 scale/orient 原来按屏幕距离 falloff 逐点加权，光标在发尖时几乎只动尖端几个点 → 观感像 move。改为**对整个暴露段（fork 以下）统一变换**：scale 以暴露根部为中心整体缩放、orient 绕视轴整体旋转（ZBrush 子工具式），不再按光标遮罩。

**3. undo 丢失 tip 编辑 ✅（真 bug）**：`snapshotState` 的 undo 快照走 `splitBonesToData`，而它**没序列化 `tip`** → undo 后 tip 变回默认（发尖改动一起被「撤回」，且与主链操作混在一个快照里）。项目保存走 `registryForSave`（含 tip）所以保存/重载不丢。修复：`splitBonesToData` 补 `kind/meta/tip`（与 `bonesToData` 对齐）；`normalizeSplitBones` 本来就保留 tip。验证：orient 笔刷后 undo → `reverted:true, maxDiff:0`，`panelTipSelection` 仍在。

**4. 笔刷下引导几何全消失 ✅**：`updateCurveObjects` 新增 `brushBonesOnly = sculptBrushHelpersSuppressed && lock.id===selectedId`——任意笔刷下只显示选中发丝的**骨骼线**（main line + tip 链线），主控制点手柄在笔刷下隐藏、width/split/segment 控件仍隐藏；`sculptBrushShowCurves` 勾选行为不受影响。

**5. alt+点击切换发尖（ZBrush 式）✅**：pointerdown 里 alt+点击悬停的发尖段 → toggle 选中/取消该段（任意工具下生效，含笔刷）；悬停高亮保持。

**6. 笔刷下其它发丝悬停高亮 + alt+点击切换 ✅**：`hair-store` 加 `hoveredStrandId`；每 lock 加 `hoverOutline`（青色半透明描边，`createStrandSelectionOutline` 支持 color/opacity/renderOrder 选项）；`updateStrandBrushHover`（pointermove，仅笔刷+strand 模式）raycast 所有 strand mesh 并更新悬停描边；alt+点击悬停发丝 → `selectLock` 切换选择。

**回归测试（scripts/verify-tip-select.mjs，22/22）**：边界段手柄、scale 均匀径向（maxDeltaDiff>0.01 && minCos≈1）、orient 生效、undo 精确回退（maxDiff 0 + 选择保留）、笔刷 bones-only（group+line 可见、主手柄 0）、alt+点击发尖/发丝切换。三档 smoke 11/11、12/12 通过。

### 8.7 双段高亮 + 笔刷下保留 tip UI（0.2.59）

**症状**：
1. 选中一个发尖后，再悬停其它发尖不再出现浮动高亮（`updateTipHighlight` 只渲染一个 target：有 selection 就只画选中段，hover 被忽略）。
2. 切到 Scale Brush 后，高亮 + 控制点 + 骨骼全部消失（`curveObjects.group.visible` 在笔刷下被关；tip 手柄/链线又被 `sculptBrushHelpersSuppressed` 单独关掉）。

**修复（app.js）**：
- `updateTipHighlight`：`selectedSeg` 与 `hoveredSeg` 各自独立求值；overlay 每顶点同时写选中段（fade=weight、material.opacity 0.62）与悬停段（fade=weight×(0.34/0.62) → 有效 alpha 0.34）；两者可同屏。无 selection 时仍走纯 hover 路径（opacity 0.34）。
- `updateCurveObjects` 新增 `tipUiActive = isPanelGeometry(lock) && panelTipSelection?.lockId === lock.id`：
  - tip 手柄/链线 visible 条件由 `!sculptBrushHelpersSuppressed` 放宽为 `(!sculptBrushHelpersSuppressed || tipUiActive)`；
  - group visible 在笔刷下额外 `|| tipUiActive`，且绕过 `sculptBrushShowCurvesInput` 的 checkbox 门（`(brushCurveVisibilityAllowed || tipUiActive)`）——选中子骨骼时笔刷下也显示高亮 + 控制点 + 骨骼；未选中时笔刷下保持原样（不打扰）。
- 主发丝手柄/箭头/split/segment 手柄在笔刷下仍按原逻辑隐藏（`sculptBrushHelpersSuppressed` 未放宽），只有 tip UI 例外。

**回归测试（scripts/verify-tip-select.mjs，14/14）**：
- 双段高亮：选中 seg0 后把 hover 设到 seg1 → overlay aFade 同时覆盖 seg0（32 顶点）与 seg1（64 顶点），opacity 0.62。
- 笔刷保留：点击真实 Scale Brush 按钮（sculpt-scale）+ updateCurveObjects 同步 → tool=sculpt-scale、group.visible=true、tipHighlightMesh.visible=true、11 个 tip 手柄 + 4 条链线可见；切回 select 后点击②仍能 toggle 取消。
- 三档 smoke（0041/0042/0044）11/11、12/12 通过。

### 8.8 边界段骨骼、笔刷统一变换、undo tip 持久化、笔刷 bones-only、alt+点击切换（0.2.59）

**1. 最左/最右边界段发尖骨骼不显示 ✅**：`updateCurveObjects` 里 `tipChains`/`tipForkTs` 用 `tipSplits.map(...)` 构建——只有 `splits.length` 个条目，而段数是 `splits.length+1`，最后一段（边界段）的 chain 是 undefined → 手柄/链线全被隐藏。改为 `Array.from({ length: tipSplits.length + 1 }, ...)`。0044 Front Bangs 1 现在 5 段全部有手柄（seg0=2、seg1-4=3）。

**2. orient/scale 笔刷表现成 move ✅**：`applySubBoneBrushSample` 的 scale/orient 原来按屏幕距离 falloff 逐点加权，光标在发尖时几乎只动尖端几个点 → 观感像 move。改为**对整个暴露段（fork 以下）统一变换**：scale 以暴露根部为中心整体缩放、orient 绕视轴整体旋转（ZBrush 子工具式），不再按光标遮罩。

**3. undo 丢失 tip 编辑 ✅（真 bug）**：`snapshotState` 的 undo 快照走 `splitBonesToData`，而它**没序列化 `tip`** → undo 后 tip 变回默认（发尖改动一起被「撤回」，且与主链操作混在一个快照里）。项目保存走 `registryForSave`（含 tip）所以保存/重载不丢。修复：`splitBonesToData` 补 `kind/meta/tip`（与 `bonesToData` 对齐）；`normalizeSplitBones` 本来就保留 tip。验证：orient 笔刷后 undo → `reverted:true, maxDiff:0`，`panelTipSelection` 仍在。

**4. 笔刷下引导几何全消失 ✅**：`updateCurveObjects` 新增 `brushBonesOnly = sculptBrushHelpersSuppressed && lock.id===selectedId`——任意笔刷下只显示选中发丝的**骨骼线**（main line + tip 链线），主控制点手柄在笔刷下隐藏、width/split/segment 控件仍隐藏；`sculptBrushShowCurves` 勾选行为不受影响。

**5. alt+点击切换发尖（ZBrush 式）✅**：pointerdown 里 alt+点击悬停的发尖段 → toggle 选中/取消该段（任意工具下生效，含笔刷）；悬停高亮保持。

**6. 笔刷下其它发丝悬停高亮 + alt+点击切换 ✅**：`hair-store` 加 `hoveredStrandId`；每 lock 加 `hoverOutline`（青色半透明描边，`createStrandSelectionOutline` 支持 color/opacity/renderOrder 选项）；`updateStrandBrushHover`（pointermove，仅笔刷+strand 模式）raycast 所有 strand mesh 并更新悬停描边；alt+点击悬停发丝 → `selectLock` 切换选择。

**回归测试（scripts/verify-tip-select.mjs，22/22）**：边界段手柄、scale 均匀径向（maxDeltaDiff>0.01 && minCos≈1）、orient 生效、undo 精确回退（maxDiff 0 + 选择保留）、笔刷 bones-only（group+line 可见、主手柄 0）、alt+点击发尖/发丝切换。三档 smoke 11/11、12/12 通过。

### 8.9 悬停橙色高亮、主选中切换清理、alt+真点击门、tip 完整正交帧、Push 笔刷修复（0.2.59 已落地）

**1. 发丝悬停高亮改柔和橙色 ✅**：`hoverOutline` 颜色由 `0x8fd8ff`（蓝）改为 `0xffb45e`（柔和橙），`createStrandSelectionOutline` 支持 color/opacity/renderOrder 选项；与选中橙色、tip 高亮区分、更柔和。

**2. 切换主选中时清除旧发尖选中/悬停 ✅**：`selectLock` 在 `id = nextSelection.activeId` 后，若 `panelTipSelection.lockId !== id`（或 hover 不匹配新 id）则清空——alt+点击切到别的 panel/发丝、或点空白取消选择时，旧锁的 tip 高亮/手柄不再残留。

**3. alt+点击切换只在真点击触发 ✅**：pointerdown（alt、无修饰键）只**记录候选**（`altClickCandidate` = hovered tip 段或 hovered 发丝 + 起始坐标 + pointerId），不再立即切换；新增 `finishBrushAltClick`（pointerup）在**位移 < 6px** 时才 `applyAltClickCandidate`（tip toggle 或 `selectLock(hoveredStrand)`）。alt+拖拽 = 导航（beginAltOrbit），不再误触发切换。

**4. tip 子骨骼完整正交帧 + orient 旋转 ✅**：tip 链的帧（tangent/bitangent/normal）由 authored 链曲线**派生**（`getTangent` + 截面几何）；`createPanelStrandGeometry` 的段内行把截面从 rest 中心平移到 authored 中心并**按 `dq = setFromUnitVectors(restTangent, authoredTangent)` 旋转**（`final = lerp(base, authoredCenter + dq·(base−restCenter), weight)`；rest 时恒等、零回归）。orient 笔刷弯曲链 → 切线变化 → 尖端截面真实旋转（回归验证：orient 后尖端切线夹角 11.21°）。

**5. Push 笔刷动不了（真实 bug）✅**：`applySubBoneBrushSample` 的 push 分支对 `stroke.planeNormal.clone().projectOnPlane(...)`——而 `stroke.planeNormal` 来自 `cameraFacingPlaneNormal`（modules/sculpt/sculpt-brush.js），返回**纯 `{x,y,z}` 对象**（不是 THREE.Vector3）→ `.clone` 不存在 → 抛 TypeError → 该次采样中断、发尖不更新。主发丝 push 用 `guidedNormalAt`（不碰 planeNormal）所以一直正常，只有 tip 路径崩。修复：先 `new THREE.Vector3(planeNormal.x, planeNormal.y, planeNormal.z)` 再投影。回归验证：push 后发尖链移动（pushMax 0.0099）。

**验证**：verify-tip-select.mjs 24/24（新增：每段手柄、scale 均匀径向、orient 改变切线 11.21°、undo 精确回退 maxDiff 0、笔刷 bones-only、alt+点击发尖/发丝、push 移动发尖）；三档 smoke 11/11、12/12 通过。
### 8.10 悬停/alt+点击全模式、tip width 控制点取代绿色控制器（0.2.59 已落地）

**1. 悬停高亮 + alt+点击切换扩展到全模式（除 create 类）✅**：新增 `isHairCreateTool(tool)`（draw/procedural-draw/braid/panel/curve-surface/surface-loft/place/draw-capsule-guide）。`updateStrandBrushHover`/`syncStrandHoverOutline` 的触发门由「笔刷激活」改为「非 create 工具 + strand 模式」——Q 选择模式下悬停其它发丝也显示柔和橙描边、alt+左键（真点击）切换选中；select/move/rotate/scale/relax/笔刷等非 create 模式全部生效。create 类工具 pointerdown 会起笔画，跳过以免冲突。

**2+3. 绿色控制器 → tip width 控制点（左右独立、zipper 截断）✅**：
- 每段每侧 5 个绿色控制点（`tipWidthHandles`，侧 fork 到尖端之间），仅当该发尖被选中时显示；此时**隐藏绿色 spread 手柄与主发片 width 边缘控制**。
- 数据：写 `bone.taperCurve`（右）/`bone.taperCurveSecondary`（左）+ `asymmetricWidthCurve=true`；左右侧各自独立（`tipWidthSideForkT`：左边界用左侧 zipper 高度、右边界用右侧 zipper 高度，无 zipper 的边界段回退到段 fork——左右可控制区可不同）。
- **截断/锁定**：构建宽度曲线时 t < 该侧 forkT 的区段强制取全局默认（`lock.taperCurve`/secondary 采样），用户只能拖动暴露区控制点；zipper 拉上去（forkT 减小）→ 新暴露区保持默认直到被拖动；zipper 拉下来 → 下次拖动重建时新锁定区重置为默认。
- 拖动：`beginPanelSplitHandleDrag` kind="tipWidth"（按视平面侧向偏移计算新半宽 → 写曲线 → 重建几何）。注：笔刷工具 pointerdown 被笔刷笔画 consume，width 控制点拖动在 select/move 等非笔刷工具下操作（与 tip 链手柄一致）。

**回归测试（scripts/verify-tip-select.mjs，28/28 新增）**：tip 选中时 width 控制点显示（左右各 5）+ 绿色手柄 0 + 主 width 边缘 0；拖动右侧控制点 → 右/左曲线生成、asymmetric=true、锁定区与全局默认一致（rightForkT 0.8125）；select 模式悬停其它发丝 outline=true、alt+点击切换选中。三档 smoke 11/11、12/12 通过。
### 8.11 发尖 TBN 帧调查 + orient 改弯曲 + width 粉色曲线/删绿色控制器（0.2.59 已落地）

**调查①：发尖子骨骼 TBN 与主骨骼一致吗？**
- 约定一致：发尖链与主链同为 y=切线、x=副切线(横向/宽度方向)、z=法线。
- rest 链实测（Front Bangs 1 seg2，t=0.3/0.6/0.9）：副切线 vs 主 x 偏差 0.2–3.9°；切线 vs 主 y、法线 vs 主 z 偏差 0.8–11.7°（链端约 10–12°）。**不是 90°**。偏差来源：段中心线是横向偏移到段中心 u 的曲线，panel 宽度沿 t 变化使中心线相对主曲线轻微倾斜（链端切线偏 10° 左右属正常几何）。
- **结论：帧约定一致，存在小的几何偏差（~10° 级），无需改 TBN 定义。**

**调查②：发尖旋转被锁死了吗？**
- 数据层：`splitTipForSegment` 的 authored 是逐点绝对坐标 + 编辑时 rest，组合为 `当前 rest + delta`（平移 delta 保留）；几何用 `dq = setFromUnitVectors(restTangent, authoredTangent)` 旋转截面——旋转**没有被锁死**。
- 真正问题：旧 orient 笔刷把链点绕**视轴（相机→根）**旋转——发尖朝向相机时≈绕链自转 → 主要转副切线/横向，切线方向变化很小 → 观感「切线锁死、转的是副切线」。实测旧行为：55px 拖拽 tangent 变 10.4°、lateral 也变 10.6°（两者相当）。

**修改（orient 改弯曲）✅**：发尖 orient 改为**朝拖拽方向弯曲链**——弯曲轴 = 链根切线 × 拖拽方向（垂直于链、朝向拖拽），绕根旋转暴露段；拖横→尖横弯、拖竖→尖竖弯，**切线方向明显旋转**，几何经 dq 跟随。回归：orient 后尖端切线夹角 8.03°（>5° 断言）。

**修改②：tip width 粉色曲线 + 删绿色控制器 ✅**
- 删除绿色 spread 手柄（`panelSegmentHandles` 视口句柄，保留 spread 数据/滑杆）。
- tip width 控制 = 每侧**粉色曲线**（`tipWidthLines`，0xff42cf）+ **粉色控制点**（`tipWidthHandles` 改 0xff42cf），选中发尖即显示；左右曲线从各自侧 fork 到尖端、**长度不同**（seg2 实测左 0.97 / 右 0.37）。
- 宽度数据仍写 `bone.taperCurve`/`taperCurveSecondary` + 自动 `asymmetricWidthCurve=true`；拖控制点 = 副切线(横向)方向改变半宽。

**回归测试（scripts/verify-tip-select.mjs，28/28）**：orient 切线弯曲 >5°；粉色曲线/小点显示 + 绿色手柄 0 + 主 width 边缘 0 + 左右曲线长度不同；宽度拖动 author 右曲线（asymmetric、锁定区=全局默认）。三档 smoke 11/11、12/12 通过。
### 8.12 发尖 width 控制点修正：子发片边缘定位 + 拖拽不再动发尖 + 绿色小点（0.2.59 已落地）

**1. 拖动宽度点却带动发尖子骨骼（真 bug）✅**：宽度控制点按段边缘 u 放置，而段右/左边缘 = zipper 的 u——第 1 个宽度控制点（t=fork）与 zipper 手柄在同一世界位置，zipper 手柄更大且 raycast 更近 → 命中 kind="panel"（拖 zipper → 发尖跟着变）。修复：① 宽度控制点改**中点分布**（`(i+0.5)/N`，避开 fork 与尖端端点）；② 命中测试把 `tipWidthHandles` 放最前；③ **选中发尖时隐藏 zipper 手柄**（`panelSplitHandles` 加 `!tipUiActive`，zipper 线仍显示；取消发尖选中即可拖 zipper）。验证：pointerdown 后 `panelSplitDrag.kind==="tipWidth"`，拖完发尖链不变（chainMoved=false）。

**2. 宽度点显示位置 = 子发片边缘而非主发片全宽 ✅**：新增 `tipWidthEdgeLateral` —— 用段自身 u 边界（左/右 zipper position）计算「链中心到段边缘」的副切线偏移 = `(edgeU·widthEdge − centerU·widthCenter)/2`，控制点与粉色/绿色曲线都落到子发片的实际边缘；边界段回到面板外缘。宽度拖拽公式同步改为按段边缘跨度映射（`2·latOffset/((edgeU−centerU)·fullWidth)`），锁定区（zipper 以上）仍强制全局默认。

**3. 控制点半径 ✅**：scale 0.34 → 0.26（比之前更小、更接近普通发丝控制点观感）。

**4. 颜色改绿 ✅**：宽度控制点 + 控制曲线由粉 `#ff42cf` 改为绿 `#5df0a8`，与主发片宽度控制（粉/棕）区分。

**回归测试（scripts/verify-tip-select.mjs，28/28 新增）**：绿色曲线/小点显示在子发片边缘（左右各 5 点、左右曲线长度不同 0.91 vs 0.34、`#5df0a8`、zipper 手柄隐藏、主 width 边缘隐藏）；拖右控制点 → 右/左曲线生成、asymmetric=true、锁定区=全局默认、**发尖链不变**。三档 smoke 11/11、12/12 通过。
### 8.13 orient 弯曲增强、zipper 上端线性权重过渡、width 控制跟随发尖帧（0.2.59 已落地）

**1. orient 笔刷改发尖切线旋转 ✅**：数据层此前已能改切线（各段 8–10°/60px），观感弱且有「怪异翻转」。增强：弯曲量 `0.006→0.012`（现 17–20.5°/60px，seg0/2/4 实测 20.5/17.0/19.3°）；fallback 弯曲轴由任意世界轴改为**链自身副切线**（`rootTangent × rootFrame.z`），拖拽方向与链平行时不再随机翻转。

**2. Zipper 上端开裂 ✅**：权重过渡由「fork 附近窄带 smoothstep（band≈0.2，之后立即满权重）」改为**暴露区全程线性过渡**（fork=0 → tip=1）。未分开（zipper 以上）几何权重恒 0、不跟发尖；线性衰减把 tip 变形沿整段均匀摊开，消除 fork 处突转造成的折痕/开裂。

**3. width 控制跟随发尖子骨骼帧 ✅**：宽度控制点/曲线改为用几何同款 tip 变形公式放置——`authoredCenter + dq·(baseEdge − restCenter)`（dq = rest→authored 切线旋转），`baseEdge` 用主面板扫掠截面（width/depth 曲线 + camber + 非对称中心，`tipMainSectionPoint` 复刻 `rawPanelPoint`）。大刘海边缘发尖的 tangent 偏差大时，宽度控制随发尖子骨骼的弯曲/朝向走，不再只参考主骨骼。修复过程中发现 `strandFrameAt` 不含 `point`（geometry 的 panelFrameAt 才有），改用 `strandGeometryCurve(lock).getPoint(t)` 作原点。

**回归测试（scripts/verify-tip-select.mjs，28/28）**：orient 切线弯曲 16.05°（>5°）；宽度绿色曲线/小点显示在子发片边缘（左右长度不同 0.87 vs 0.33）；拖右控制点 → 曲线生成、asymmetric、锁定区=全局默认、发尖链不变；0 异常。三档 smoke 11/11、12/12 通过。
### 8.14 orient 改为绕切线滚动（法线朝视口）、push 用法线、width 拖拽稳定比例（0.2.59 已落地）

**1. orient 笔刷彻底重做 ✅**：之前「朝拖拽方向弯曲链」把骨骼当橡皮拖着走，方向错了。现改为与主发丝 orient 一致的语义——**绕链切线滚动截面，让发尖法线面向视口**；链（骨骼位置）完全不动。数据层新增 `bone.tip.twists`（每链点滚动角数组，随 splitBones/registry 序列化、镜像翻转符号、undo 保留）；几何 `addPatch` 用 `dqRoll = R(authoredTangent, twist)·dq` 旋转截面；orient 累加「当前法线与相机朝向（投影到切线平面）的带符号夹角」×权重×strength×0.2，多次采样收敛到法线朝视口。回归：orient 后链不动、twists 非零、法线-相机夹角 13.0°→10.9°。

**2. push 笔刷方向 ✅**：`up` 由「相机朝向平面法线投影」改为**发尖截面自身法线**（主面板法线经 dq 运输 + orient 滚动），侧面/边缘发尖不再过分倾斜（原先是初始法线参考主骨骼导致）。

**3. width 拖拽塌缩 ✅**：原公式 `2·latOffset/((edgeU−centerU)·fullWidth)` 依赖当前宽度形成反馈 → 往回缩、定死、退行。改为**稳定比例**：拖动起点记录 `startLatOffset`（边缘到链中心的副切线距离）与 `startMult`（当前宽度倍数），拖拽时 `newMult = startMult × (latOffset/startLatOffset)`（clamp [0.02,2]），无反馈、可反复拖动。

**回归测试（scripts/verify-tip-select.mjs，27/27 更新）**：orient 滚动截面（链不动 + twists 非零 + 法线朝视口更近）；push 移动发尖；width 拖拽 author 曲线（asymmetric、锁定区=全局、链不变）；0 异常。三档 smoke 11/11、12/12 通过。
### 8.15 width 拖拽塌缩修复 + push 方向统一 + zipper 根部权重死区 + alt+点击 orbit 泄漏（0.2.59 已落地）

**1. 绿色 width 控制点依旧坍缩（两个真 bug）✅**
- **编辑点丢失**：`setTipWidthCurveValue` 只在「曲线位置与手柄 t 误差<1e-3」时写入，而手柄 t（如 0.90625）落不到固定 0.1 步长点 → 编辑被丢弃；`buildTipWidthCurve` 重建时也只保留固定网格点。修复：setTipWidthCurveValue 在 t 处**插入曲线点**；buildTipWidthCurve 重建时**保留 current 曲线暴露区的原始点**（含任意 t 的编辑点），锁定区（zipper 以上）仍强制全局默认。
- **拖拽映射不响应/易误缩**：改为**沿屏幕副切线方向投影拖拽量**（同主发丝 width 边缘拖拽），按起点边缘屏幕距离缩放 → 任意方向有横向分量都改变宽度；仍用起点比例（startMult×latOffset/startLatOffset）无反馈。最小宽度 0.02→0.08，避免塌缩成细条叠到链上不可再拖。验证：向外拖 v=2、向内拖 v=0.631，链不变。

**2. push 方向用主发丝同款机制 ✅**：不再特殊化，直接 `guidedNormalAt(lock, 链点, 链切线, t) + 发尖 twist`（与主发丝 push 一致），侧面/边缘发尖不再沿副切线偏斜。

**3. zipper 根部权重死区 ✅**：`segmentWeightAt` 在 fork 之上加 `weightDeadZone=max(1/lengthLoops,0.02)` 的零权区，之后线性过渡到 1——笔刷不再把未分开（zipper 以上）的头发刷开。

**4. alt+点击后相机漂移（真实产品 bug）✅**：`finishBrushAltClick` 调 `stopImmediatePropagation()` 阻止了紧接注册的 `endAltOrbit` 在 pointerup 清除 `altOrbitDrag` → 下一次鼠标移动触发 orbit 把相机转走。修复：不再 stopImmediatePropagation，让 endAltOrbit 正常收尾。

**回归测试（scripts/verify-tip-select.mjs，27/27 更新）**：width 拖拽沿边缘屏幕方向多次移动 → 曲线生成、asymmetric、锁定区=全局、编辑值改变、链不变；orient 滚动截面；push 移动发尖；select 模式悬停/alt+点击（相机保持默认位，验证 orbit 泄漏已修）。三档 smoke 11/11、12/12 通过。
### 8.16 width 拖拽防塌缩下限 + 测试环境 Chrome --no-sandbox（0.2.59 已落地）

**1. 绿色 width 控制点仍会塌缩 ✅**：拖拽映射 `newMult = startMult × latOffset/startLatOffset` 在把边缘拖向中心时（latOffset→0）会把宽度压到绝对下限 0.08 → 发尖缩成细针、手柄叠到链上不可再拖。修复：单次拖拽加**下限** `newMult ≥ max(0.08, startMult×0.3)`（上限 2）——一次向内拖最多收窄到起始宽度的 30%，不会瞬间塌缩；要更细可多次拖拽或走 taper 曲线编辑器。验证：沿边缘方向多次向外/向内拖，宽度剖面（0.8/0.9/0.906/1.0）按比例增/减、不塌缩、链不动。

**2. 测试环境：Chrome 151 更新后沙箱崩溃（环境问题，非产品代码）**：`chrome.exe` 全模式启动即退出（exit 0x80000003 STATUS_BREAKPOINT），CDP 不可达导致测试挂起。修复：`verify-smoke.mjs` / `verify-tip-select.mjs` 的 Chrome 启动参数加 `--no-sandbox`（本机安全沙箱在当前容器/系统策略下与 Chrome 151 冲突）。三档 smoke 与 27/27 回归恢复。

**回归测试（scripts/verify-tip-select.mjs，27/27）**：width 拖拽（编辑值改变、链不变、不塌缩）；orient 滚动截面；push 移动发尖；select 模式悬停/alt+点击；0 异常。
### 8.17 width 拖拽起始「凹进/跳层」根因：帧不一致 + 拖拽过敏感（0.2.59 已落地）

**症状**：能拖绿色宽度控制点了，但拖动起始瞬间这半边控制点+曲线往头皮凹进去一截，观感像发丝从 mid 层跳到 bottom 层。

**调查**（浏览器实测 Front Bangs 1 seg2）：
1. **UI 与 mesh 帧不一致**：宽度控制点/曲线用 `strandFrameAt`（逐点 guidedNormalAt+twist 帧）定位，而 mesh 几何用 `panelFrameAt`（沿曲线平行运输帧插值）——两套帧在弯曲刘海上有几 cm 级差异，UI 悬在 mesh 外像「另一层」。
2. **拖拽过敏感**：屏幕投影映射在边缘屏幕尺寸小（24px）时放大——5px 拖拽宽度跳 22%、手柄跳 ~4cm，等于拖动起始瞬间整侧跳变（这就是「凹进去一截」）。

**修复（根因，非特殊化）**：
- 新增 `tipPanelFrameAt`：复刻几何 `panelFrameAt`（平行运输帧数组插值，缓存于 `lock._tipWidthFrames`，几何重建时失效），`tipMainSectionPoint` 改用它 → 宽度 UI 精确落在 mesh 表面。
- 拖拽映射改**世界空间相对比例**（`startMult × (1 + (latOffset/startLatOffset − 1) × 0.5)`）：消除屏幕透视放大；敏感度减半（拖满边缘≈+50% 而非 +100%），5px 拖拽变化从 22% 降到 ~11%、手柄位移从 ~4cm 降到 ~2.6cm，不再「瞬间跳变」。

**回归测试（scripts/verify-tip-select.mjs，27/27）**：width 拖拽（编辑值改变、链不变、锁定区=全局）；orient 滚动截面；push 移动发尖；select 悬停/alt+点击；0 异常。三档 smoke 11/11、12/12 通过。
### 8.18 一侧 widthCurve 跳变根因：烘焙左侧时错误切到副曲线（0.2.59 已修复）

**症状**：拖右侧绿色宽度控制点，左侧 widthCurve 一起跳变（像从主曲线切到副曲线 / mid 层跳到底层）。

**根因（浏览器实测 Front Bangs 1 seg2 确认）**：
- 面板本身有 `taperCurveSecondary` 且 `lock.asymmetricWidthCurve=false`（默认对称）→ 左侧宽度原本用主曲线（1.0287）。
- `setTipWidthCurveValue` 首次编辑会**创建/重建两侧曲线并设 `bone.asymmetricWidthCurve=true`**；而 `buildTipWidthCurve` 对左侧的 `globalCurve` 用 `lock.taperCurveSecondary || lock.taperCurve`（**不看 asymmetric 标志**）→ 烘焙出的左侧=面板副曲线。
- 几何 `panelWidthAt`/`sampleAsymmetricTaperCurve` 在 asymmetric=true 且 side<0 时切到副曲线 → 拖右侧瞬间左侧从 1.0287 跳到 0.7222（实测）。子智能体（对比 git 历史）确认：原版 `applyEditableStrandWidth` 只改标量 width、`taperCurveEditor` 只动被选侧曲线，从不无谓烘焙另一侧。

**修复**：`buildTipWidthCurve` 对左侧 `globalCurve` 取「该侧编辑前的有效曲线」=`(lock.asymmetricWidthCurve && lock.taperCurveSecondary) ? lock.taperCurveSecondary : lock.taperCurve` —— 面板对称时左侧烘焙自主曲线，开 asymmetric 不再改变左侧参考。实测：拖右侧后 left 保持 1.0287（不再跳变）、right 独立可编辑。

**回归测试（scripts/verify-tip-select.mjs，27/27）**：width 拖拽（编辑值改变、链不变、锁定区=全局）；orient 滚动；push；select 悬停/alt+点击；0 异常。三档 smoke 11/11、12/12 通过。
### 8.19 发尖 WidthCurve 拖拽方向 + 非对称中间线性过渡 + 拖拽去重（0.2.59 已修复）

**症状 1（拖拽方向/坐标系混乱）**：拖绿色宽度控制点时手感像梯形——滑动方向不是沿当前发尖自己的宽度轴，而是偏向主骨骼/面板法线方向。实测（0044 Front Bangs 1 各段、t=0.6/0.8/0.95）：`tipWidthEdgePosition` 返回的 `lateral` 相对真正宽度轴 `dq*主帧x` 倾斜，右边缘 7°~51°（越靠尖端越大）、左边缘 131°~170°（几乎反向）。

**根因**：`lateral` 此前是 `rel.normalize()`，其中 `rel = dq*(baseEdge − restCenter)`：`baseEdge` 用 `tipMainSectionPoint(..., shell=0)`（面板中平面），而 `restCenter` 在面板前表面（`panelSplitControlPoint` 带 thickness*0.58 的 z 偏移）→ rel 混入约 0.5×thickness 的**法线方向分量**，被 dq 旋转后 lateral 偏离宽度平面；且 baseEdge 用的是主面板帧（`tipPanelFrameAt`），与发尖链自身帧存在 ~10° 几何偏差（§8.11 已调查）——两层坐标系混淆叠加，就是「指向主骨骼而不是当前发尖自己的子骨骼」的观感。

**修复（app.js `tipWidthEdgePosition`）**：
- `baseEdge` 的 shell 由 0 改为 1（前表面）→ 绿色控制点/曲线精确落在网格前边缘（几何 addPatch 用 shell=1 的 frontPoint），不再陷进面板内部。
- `lateral` 改为当前发尖自己的 authored 宽度轴：`dq * tipPanelFrameAt(t).x`，并定向到本侧边缘（`dot(rel)<0` 则取反）→ 实测各段 `maxTilt=0°`（此前 7°~170°），拖拽沿真实宽度轴、无梯形感。
- 位置公式 `point = authoredCenter + dq*(baseEdge − restCenter)` 不变（与网格一致）。

**症状 2（非对称宽度中间硬切分）**：拖右侧到 1.45 后，t=0.9 剖面在 u=0 处从 1.0287 直接跳到 1.45（左半=副曲线、右半=主曲线），中间起棱、一调就很硬。

**根因**：`sampleAsymmetricTaperCurve`（modules/geometry/curve-math.js）对 `signedCoordinate<0` 硬切副曲线、否则主曲线（「一半一半常数」）。

**修复**：改为按 signedCoordinate 线性插值——u=-1 完全副曲线、u=+1 完全主曲线、中间 `lerp(副, 主, (u+1)/2)` 线性过渡（NaN/非数值回退主曲线）。实测：u=0 = 两值平均、中心步长 0.42→0.042（连续）。该函数同时被主面板非对称宽度/厚度、strand 非对称半径共用，属一致性平滑。

**症状 3（拖拽重复写入）**：拖拽中每次 pointermove 都 `materializeSplitBones` 深克隆全部骨骼 + 双写 lock.splitBones/lock.bones，且 `setTipWidthCurveValue` 每次重建左右两条曲线。

**修复（app.js）**：
- `beginPanelSplitHandleDrag` tipWidth 块只 materialize 一次，把骨骼数组存入 `panelSplitDrag.tipWidthBones`；`updatePanelSplitHandleDrag` 复用（缺失/数量不符才回退）。
- `setTipWidthCurveValue` 只重建被编辑侧曲线（未编辑侧锁定区已烘焙、暴露区点已保留）。

**回归测试（scripts/verify-tip-select.mjs，29/29）**：新增 2 项——`tip width lateral follows tip sub-bone width axis`（maxTilt<5°、lateral 与发尖切线夹角>60°）；`asymmetric tip width blends linearly at center`（u=0=均值、±0.5 线性、中心步长<0.1、左右不等）。原 27 项全过（宽度拖拽编辑值改变/链不变/锁定区=全局/asymmetric；orient/push/undo/悬停/alt+点击 0 异常）。三档 smoke（0041/0042/0044）11/11 通过。

### 8.20 发尖 WidthCurve 拖拽方向真正根因：复用主骨骼宽度采样导致坐标系混乱（0.2.59 已修复）

**用户反馈**：8.19 之后「情况没有好转」——绿色控制点仍沿「指向主骨骼的位置」那条连线运动，而不是沿发尖子骨骼方向。用户怀疑代码复用了原版 width curve 的「中心关联逻辑」（中心 = 主面板中心 u=0），并希望把中心对象调整为发尖子骨骼。

**深度调研（浏览器实测 0044 Front Bangs 1 各段/两侧）**：
- 旧 tipWidthEdgePosition 的边位置 = `authoredCenter + dq*(tipMainSectionPoint(edgeU) - restCenter)`：`tipMainSectionPoint(edgeU)` 用**绝对 u**（u×半宽 + camber(u)），`restCenter` 是段中心。宽度变化时 Δ = dq*(frame.x×(edgeU×Δhw) + frame.z×(Δcamber(edgeU)))——**依赖绝对 u**：对「右侧边缘落在主面板左半段」（edgeU<0，如 seg0/seg1 右缘 -0.807/-0.44）会**反向移动**；对窄段 camber 项占主导，手柄沿主面板法线/径向走。实测手柄运动方向相对真正宽度轴倾斜：右 7°~51°、左 131°~170°（≈指向主骨骼）。
- 更深一层：`splitTipForSegment` 的 rest 链用 `panelSplitControlPoint`（采样**骨宽曲线**）→ 宽度一编辑，rest 链/发尖链本身跟着漂移，额外放大位移。
- 结论：确实如用户所说——复用了主面板的宽度采样（绝对 u、以主中心 u=0 为左右分界），**没区分发尖子骨骼中心（段中心 centerU）与主骨骼中心（u=0）**；且宽度曲线同时缩放横向与 camber，运动方向被绝对 u 和 camber 主导。

**修复（app.js，直接改造为 tip-relative）**：
1. **段宽度改为以段中心为参考**（几何 rawPanelPoint 与 UI tipMainSectionPoint 同式）：横向 `lateralU = (u - centerU)` + 中心对齐常量 `centerU×全局半宽(centerU)`（保证段中心落在主面板原位置、zipper 墙对齐）；**camber 固定用全局曲线**——宽度编辑只改变横向，不再改变面板鼓包。实测全部段/两侧手柄运动方向 `dAngleVsLateral = 0°`（严格沿发尖子骨骼宽度轴）。
2. **rest 链稳定化**：`splitTipForSegment` 的 restPoints 改用全局曲线（传 `{}` bone override）——rest 链是稳定基准，宽度编辑不再移动发尖链。
3. **曲线精简**：`buildTipWidthCurve` 不再烘焙锁定区 0.1 网格（11 点）——采样器对 `t < forkT` 回退全局曲线；曲线只含暴露区（fork 边界 + 5 控制点 + 尖端）。实测每侧 7 个点、**全部在 viewport 内可见**（原 11~16 点、其中约 9 个在锁定区不可见）。
4. **拖拽轴** = `dq×主帧x`（从发尖链指向本侧边缘的方向），定向到边缘——手柄精确跟随光标。
- 保留：非对称曲线（左右独立、u=0 中线线性插值）、zipper 上端权重线性降 0、水密拓扑。

**回归测试（scripts/verify-tip-select.mjs，31/31）**：新增 `tip width drag moves handle along tip sub-bone width axis`（全部段/侧 maxAngle=0°）与 `tip width curve is lean and fully visible`（≤8 点、全可见、编辑生效）；原 29 项全过（宽度拖拽编辑值改变/链不变/锁定区=全局/asymmetric；orient/push/undo/悬停/alt+点击 0 异常）。三档 smoke（0041/0042/0044）11/11 通过，网格 0 NaN。

### 8.21 发尖 WidthCurve 体验优化 4 项（0.2.59）

**1. tip 端（t=1）绿色控制点暴露**：之前每侧 5 个控制点是 `lerp(fork,1,(i+0.5)/5)`（0.1~0.9），没有尖端。新增 `tipWidthControlTs(fork)`（5 中点 + tip 端 t=1，共 6 个），`tipWidthControlPlacement`/`buildTipWidthCurve`/视口手柄数量（TIP_WIDTH_CONTROL_POINTS+1）全部对齐。

**2. Segment Spread 范围 0–1 + 线性聚合**：`SPREAD_MAX` 0.9→1（bone-model.js）、滑杆 `max="0.9"→"1"`（index.html）、app.js clamp 0.9→1；几何 `segmentRamp` 由 smoothstep 改为**线性**（从本侧 zipper 高度线性 ramp 到尖端），「尖端聚合多、越往上越少」。

**3. 调 Spread 时绿点/绿色曲线跟随**：新增共享 `tipWidthSpreadGap(lock, segmentIndex, splits, bone, t, side)`（0.5×spread×span×线性 ramp，本侧 zipper 起、尖端最大；无 zipper 的边界侧为 0），几何 `uStart/uEnd` 与 `tipWidthEdgePosition` 的 edgeU 都用它——绿色控制点/曲线精确落在几何边缘上，调 spread 一起移动（不应用缩放）。实测 spread 0→1 时 tip 端手柄位移 0.144。

**4. 两侧等距分布（基于最深 zipper）、短侧截断、数据保留**：新增 `tipWidthCommonForkT`（`1−max(两侧 zipper 高度)`）。两侧控制点共用同一组链参数（`tipWidthControlTs(commonForkT)`）；某侧**低于本侧自己 fork** 的控制点隐藏（`tipWidthControlPlacement` 返回 null），但其曲线数据**保留**（采样器在 t<本侧 fork 回退全局，隐藏点不生效）；想把上面的点调回来 → 把 zipper 往上拉（fork 下降）即重新暴露。实测 seg2：leftFork=commonFork=0.563（左 6 点全显）、rightFork=0.813（右仅 0.869/0.956/1.0 三个可见，其余记录）。

**回归测试（scripts/verify-tip-select.mjs，33/33）**：新增 tip 端控制点、spread 跟随（范围 0–1）、common-fork 分布（短侧截断但记录）；原 29 项全过（拖拽方向 maxAngle=0、宽度拖拽链不变、锁定区=全局等）。三档 smoke（0041/0042/0044）11/11 通过。

### 8.22 发尖 WidthCurve 浮动面板 4 项修复（0.2.59）

**1. 浮动面板不随 viewport 拖拽刷新**：打开发尖 WidthCurve 浮动面板后在 viewport 拖绿色控制点，面板曲线不更新。修复：`updatePanelSplitHandleDrag` tipWidth 分支在编辑后，若 `taperCurveEditor.open` 且目标为该段的宽度曲线，调用 `renderTaperCurveEditor()` 重绘。

**2. Reset 预设错误**：Segment 宽度曲线的 Reset 走的是 `STRAIGHT_CUT_PANEL_CURVE`（不是全 1）。修复：Segment（发尖骨宽）宽度曲线 Reset 生成「全 1」曲线——本侧 fork 边界 + `tipWidthControlTs(commonForkT)` 全部 value=1（满宽、无收窄）。深度/其它曲线保持原默认。

**3. Asymmetric 模式一侧曲线影响另一侧**：实测在暴露区（t≥两侧 fork，如 0.869）拖左侧曲线 +50%，右侧靠近段中心的区域跟着动最多 ~0.16（约 30%）——根源是 u 方向全段线性混合（`sampleAsymmetricTaperCurve` 的 alpha=(signed+1)/2 覆盖整段）。修复：给 `sampleAsymmetricTaperCurve` 增加可选 `blendZone`（默认全段=1），发尖在 `tipWidthMultiplierAt` 暴露分支传 `0.25`——只有段中心 ±25% 半跨内线性混合，外侧纯本侧曲线 → 拖一侧不再带动另一侧（中心小带仍在，属「中间线性插值」本意）。

**4. 非对称改为 Ctrl 触发**：默认拖绿色控制点 = **等比对称**（另一侧按相同比例镜像，`otherNew = otherStart×(new/draggedStart)`）；按住 Ctrl 拖动 = 非对称（只调一侧）。同时：发尖浮动面板隐藏「Asymmetric curve」和「Center asymmetric profile」开关（仅 segment 编辑器），并在下方加小字提示「Ctrl+拖拽 = 非对称（只调一侧）」。

**回归测试（scripts/verify-tip-select.mjs，36/36）**：新增浮动面板刷新（编辑后 render 读取到新值）、Reset 全 1、非对称混合窄带（拖一侧另一侧远端 delta≈0）、Ctrl/默认对称（默认写两侧等比、Ctrl 只写一侧）；原 33 项全过（含拖拽方向 maxAngle=0、宽度拖拽链不变、锁定区=全局等）。三档 smoke（0041/0042/0044）11/11 通过。

### 8.23 发尖 WidthCurve 5 项深入修复（0.2.59）

**1. Reset Curve 只重置上半部分**：Reset 只重置了被编辑侧（primary），副曲线（secondary）为空/陈旧 → 左右不对称；且几何锁定区（t<fork）仍回退全局曲线，只有暴露区（t≥fork）变 1 → 视觉上「只重置上半部分」。修复：① Reset 同时重置两侧曲线为全 1；② reset 曲线显式覆盖 [0,1]（加 position=0 点）；③ `tipWidthMultiplierAt` 在骨曲线从 0 开始（覆盖整段）时不再回退全局，整段用骨曲线（Reset 后整段宽度=1）；④ `buildTipWidthCurve` 保留当前曲线的 0 点，Reset 效果在后续编辑中持续。

**2. 对称修改另一半 2x/延迟**：等比镜像 `otherNew = otherStart × (new/draggedStart)` 依赖起始值，起始不对称时另一侧绝对量会偏离；且每次 move 两次重建曲线。修复：对称拖拽直接把**两侧曲线同一 t 设为同一个 newWidthMult**（真正对称），不再按比例。

**3. 右侧属性面板 + 浮动面板不热更新**：视口拖拽只更新了几何/手柄，未同步右侧 `segmentTaperPreview` 预览与浮动面板。修复：tipWidth 拖拽分支在编辑后调用 `syncPanelSegmentControls(lock)`（右侧预览）与 `renderTaperCurveEditor()`（浮动面板，目标为同段时）。

**4. 移动方向未按发尖子骨骼法线**：`tipWidthEdgePosition` 的 lateral 用 `dq×主帧x`（主骨骼法线旋转），当发尖子骨骼默认曲率与主骨骼法线有偏角（弯曲刘海侧面发尖）时，运动轨迹被限制为与主法线垂直。修复：计算发尖链**自身 frame**（切线 y、法线 z、副切线 x），lateral 用其副切线，宽度移动与子骨骼法线垂直。另：旋转模式（E）下给选中发尖子骨骼加「法线向上箭头」（复用 `createCurveNormalIndicator`），方便调试。

**5. 旋转模式选中发尖子骨骼变拖拽**：`beginPanelSplitHandleDrag` 对 tip 手柄始终直接拖拽，未像 strand 控制点那样在 rotate/scale 工具下挂到 transform gizmo。修复：rotate/scale 工具下命中 tip 子骨骼手柄时走 `configureTransformControls` + `attachTransformForCurvePoint`（gizmo 旋转），select/move 保持原有拖拽。

**回归测试（scripts/verify-tip-select.mjs，38/38）**：新增 Reset 整段全 1（两侧、所有 t）、右侧 segmentTaperPreview 热更新、对称拖拽两侧同值、lateral 与发尖子骨骼切线垂直（maxPerpDeviation<5°）；原 34 项全过。三档 smoke（0041/0042/0044）11/11 通过。

### 8.24 发尖子骨骼 orient 与面板交互修复（0.2.59）

**1. 鼠标在浮动面板上触发后面头发高亮**：`updatePanelTipHover`/`updateStrandBrushHover` 挂 window pointermove，鼠标移到 taperCurveEditor 上仍 raycast 头发 → 高亮穿透。修复：新增 `pointerOverTaperEditor(event)`（面板 open 且指针在面板矩形内则 true），两个 hover 函数开头跳过（tip hover 还会清掉旧 hover）。

**2. Reset 后未暴露控制区开裂**：上一轮加的 `coversWhole`（骨曲线从 0 开始就整段用它）让 Zipper 上半部分宽度跟随骨曲线（=1），与主骨骼/全局宽度不一致 → 开裂。修复：**回退 coversWhole**——`tipWidthMultiplierAt` 对 t<本侧 fork（未暴露控制区）始终回退全局曲线，Zipper 上半部分直接跟随主骨骼；Reset 只重置暴露区 + 保留 [0,1] 记录数据（zipper 拉高后重新暴露仍是 1）。

**3. 发尖子骨骼 orient 跟随表面曲率**：此前 rest 链用 `panelSplitControlPoint`（guidedNormalAt 主链法线 + 主链 twist）生成，发尖子骨骼朝向与主骨骼一致，弯曲大刘海侧面穿帮；且 WidthCurve 点绝对位移让 poly 像「移动」而非「缩放」。修复：rest 链/发尖 frame 改用主发片构建曲线在段中心的**表面曲率**帧（面板平行运输帧），法线垂直于面板表面。因 tip 点是「rest+delta」，rest 生成逻辑修正后旧数据（0044.ahs）自动用新基准 + 原 delta，无需改文件。

**4. 浮动面板无法拖动 + 只能拖暴露点**：定位 segment 曲线点拖动失效原因并修复；`renderTaperCurveEditor` 给 t<本侧 fork 的隐藏点打标记，`taperCurveCanvas` pointerdown 跳过 → 只能拖动暴露的控制点。

**回归测试（scripts/verify-tip-select.mjs，40/40）**：新增面板悬停不穿透（pointerOverTaperEditor）、Reset 后未暴露区跟随全局（不裂）、发尖表面法线与主法线在弯曲段有夹角且与链切线正交、浮动面板隐藏点打 data-tip-hidden 不可拖；原 38 项全过。三档 smoke（0041/0042/0044）11/11 通过。

### 8.25 边缘段 Segment Spread 镜像补全（0.2.59）

**问题**：最边缘段（segment 0 / 最后一段）外侧没有 zipper，`tipWidthSpreadGap` 对无 zipper 侧直接返回 0，几何 `uStart/uEnd` 也强制 -1/1 → Segment Spread 在最边缘刘海只能控制有 zipper 的内侧，尖端收窄不对称。

**修复（自动补全，不展示 UI）**：
1. `tipWidthSpreadGap`：本侧 zipper 缺失（边缘段外侧）时镜像取对侧 zipper（同一 `bone.spread`、同一 ramp 起点），两侧 gap 完全一致；仅当两侧都无 zipper（完全没有 splits）才不内收。
2. `createPanelStrandGeometry` 的 `uStart/uEnd`：守卫从 `leftSplit`/`rightSplit` 改为 `(leftSplit || rightSplit)`，边缘段一侧有 zipper 即应用镜像 gap；两侧都无 zipper 才保持 -1/1。
3. `tipWidthEdgePosition` 直接复用 `tipWidthSpreadGap`，无需改动即自动跟随。

**回归测试（scripts/verify-tip-select.mjs，41/41）**：新增「edge segment spread mirrors gap to the no-zipper side」——segment 0 外侧/zipper 侧 gap 在 spread=0 时均为 0，spread=0.7 时相等且 >0（差 <1e-6），外侧手柄位置随 spread 内收（moved>0）；原 40 项全过。三档 smoke（0041/0042/0044）11/11 通过。

### 8.26 三段修复：spread 上限 / 权重斜线 / gizmo 朝向（0.2.59）

**1. Segment Spread 上限 0-0.99（防退化面）**：spread=1 时每侧尖端内收 0.5*span，合计 = span → 尖端宽度 0、产生退化面。修复：`bone-model.js` 的 `SPREAD_MAX` 1→0.99（覆盖 default/normalize/fromData 所有 clamp 点）；`index.html` slider `max=0.99`；app.js slider/segment 拖拽 clamp 0.99、绿色手柄满行程 `(spread/0.99)*span`；`tipWidthSpreadGap` 消费点防御性 `clamp(spread, 0, 0.99)`——即使旧文件有 spread=1 也绝不退化。

**2. 发尖段两侧 zipper 不等高 → 权重斜线分界**：原 `segmentWeightAt` 用 `1-max(左右 height)` 做统一水平 fork，低 zipper 侧在其 zipper 上方权重已爬升 → scale 笔刷一拉一边裂。修复：新增顶层 `tipSegmentWeightAt(lock, segmentIndex, splits, t, u, lengthLoops)`——每侧以自己 zipper 顶 `1-height` 为权重 0 边界、段内按 u 线性插值成斜线，斜线上方（靠根）权重 0（主骨骼 100%），下方线性爬到 1；边缘段单侧 zipper 时另一侧镜像同一 fork（与 8.25 spread 镜像一致）。`createPanelStrandGeometry`：`boundaries` 上移、删 `segmentForkT`，`segmentWeightAt` 改为 (segment, t, u)；tipTransform 每行无条件组装、列循环按每列 weight 混合（panelWeights 与几何变形同源）。

**3. 旋转 gizmo 一拖跳到主骨骼朝向**：tip 手柄 quaternion 从未设置（恒 identity），gizmo 起始=identity，`beginTipSubBoneRotate` 的 startQuaternion=identity，`dq=identity⁻¹×handle.quaternion` 变成从主骨骼朝向起的全量旋转 → 轻转即跳。修复（根源）：`updateCurveObjects` 在 rotate/scale 工具下把 tip 手柄 quaternion 对齐到发尖链自身 frame（`tipChainFrameAt` 的 x/y/z，`makeBasis` 构造），拖拽中（`tipSubBoneRotateDrag` 活动）保留 gizmo 已施加旋转不清零 → dq 变为相对真实朝向的增量，无跳变；不触碰 WidthCurve 数学（只用位置）。

**回归测试（scripts/verify-tip-select.mjs，46/46）**：新增 spread clamp（gap(spread=1)==gap(0.99)、materialize 读回 0.99）、权重斜线（构造不等高 zipper：左 fork 0.4 / 右 0.65，tMid 处高侧权重>0、低侧=0、中间单调且在两者间）、gizmo 朝向（真实指针选中 tip 手柄后 handle.quaternion 与链 frame 夹角 0°、非 identity、startQuaternion==frame）；原 43 项全过。三档 smoke（0041/0042/0044）11/11 通过。

### 8.27 发尖曲线编辑统一（0.2.60，分支 0.2.60-bugfix）

> 本轮 4 项：浮动面板非对称显示一致性、子发尖切换热刷新、Reset fork 连续（zipper 开裂）、segment 曲线面板统一为普通 Width Curve 形态。回归：verify-tip-select **51/51**、verify-smoke **10/11**（branch-bridge 基线失败）。

**1. 浮动面板非对称显示跟随真实数据（Bug 1）**
- 症状：视口默认拖绿色控制点 = 等比对称（两侧写同值），但浮动面板曲线因 `bone.asymmetricWidthCurve` 恒 true（几何路由依赖）而持续显示非对称（双曲线+中线），两者不一致。
- 修复（taper-editor.js）：新增 `taperCurvesActuallyDiffer`（40 采样点、epsilon 1e-4 比较两侧）与 `taperDisplayAsymmetric`；段编辑时显示用「两侧曲线实际是否不同」，`bone.asymmetricWidthCurve` 数据 flag 保持 true。`canvasToTaperPoint` / `refreshTaperCurveEditorAfterStateRestore` 同步改用同一判定。
- 对称显示下 `applyTaperCurveEdit` segment 分支把被编辑一侧克隆写入另一侧（primary↔secondary，depth 同理），一次对称编辑不会突然切到非对称；视口 Ctrl 非对称拖拽不经过此路径。

**2. 子发尖切换浮动面板热刷新（Bug 3）**
- 根因：`retargetOpenTaperCurveEditor` / `retargetFloatingStrandEditors` 只处理 type==="strand"；视口点击另一段发尖、Segment 步进按钮都只调 `syncPanelSegmentControls`，不刷新浮动面板。
- 修复：taper-editor.js 新增 `retargetOpenSegmentTaperEditor(lock, index)`（flush/finish drag → clamp segmentIndex → 更新标签 + 重渲染），`retargetOpenTaperCurveEditor` 增加 segment 分支；segment-control.js `syncPanelSegmentControls` 末尾与 app.js 视口 tip 点击处、prev/next 步进按钮调用。

**3. Reset curve fork 连续（Bug 2，zipper 端点开裂）**
- 症状：Segment Spread>0 时浮动面板点 Reset，fork 行宽度乘数从全局值（0044 实测 1.163）阶跃到 1，zipper 端点（墙起始行）顶点解焊开裂（间距 0.0136、distinct 2→4）；spread 让墙列内收使错位更明显。
- 根因（浏览器实测）：`tipWidthResetCurve` 把 fork 边界点写成 1，而采样器 `tipWidthMultiplierAt` 在 t>=fork 切到骨曲线 → 阶跃。关键：几何实际 fork ≠ 曲线数据里的本侧 sideForkT（segment 整段落在一侧 u 时只采样 primary 曲线），只改本侧 fork 点无效。
- 修复（panel-tip-strand.js）：`tipWidthResetCurve` 重写——position 0=1 + **两侧 fork 点**各取 `sampleTaperCurve(globalCurve, fork)` + 暴露区控制点=1，去重排序；`buildTipWidthCurve` 加写对侧 fork 点（防后续拖拽重建再阶跃）。`tipWidthMultiplierAt` 与权重机制（tipSegmentWeightAt）未动。
- 新回归断言 3 项：fork 行采样器连续、Reset 曲线数据含两侧 fork 点（值=全局）、fork 行网格焊接（distinct=2）。

**4. Segment 曲线面板统一为普通 Width Curve 形态（架构 Phase 1）**
- 目标：子发尖曲线面板与普通曲线一致——「Width Curve/Depth Curve」heading + 预设 select + 右上角小铅笔，移除「Edit Segment Width Curve/Depth Curve」大按钮。
- 改动：index.html（`#panelSegmentCurveControls[data-segment-curve]` 两行曲线块，保留 segmentTaperPreview/segmentDepthPreview id）；app.js（editTaperCurveButtons 按 `[data-segment-curve]` 分派、shapePresets/segmentControl deps 扩充、删大按钮绑定）；taper-editor.js（`shapeTargetForSelect` segment 分支 + 只读 `segmentCurveTarget`（不 materialize，防同步 select 写出 splitBones）+ 写路径 `segmentCurveTargetForWrite`）；shape-presets.js（`applyShapePreset` segment 分支：整条预设写 bone、secondary 克隆、asymmetric flag=true、刷新几何/预览/浮动面板）；segment-control.js（`syncPanelSegmentControls` 首行 `syncShapePresetSelects()`，覆盖 prev/next、切段、视口拖拽全部触发点）。
- 预设整条 [0,1] 写入 bone，锁定区由采样器回退全局曲线保持不裂；未用 buildTipWidthCurve 重建（避免丢「select 显示预设名」）。
- 遗留（Phase 2 候选）：右侧小预览（renderTaperPreview）仍按 asymmetric flag 显示双曲线，与浮动面板显示可后续统一；depth 曲线的 tipHidden 标记（深度无 fork 语义）可恢复全点可编辑。

**验证**：verify-tip-select.mjs 51/51（原 46 + 新增 5：段编辑器热刷新、对称/非对称显示切换、Reset fork 连续×3），0 页面异常；verify-smoke 10/11 基线。

**未来工作（架构，Phase 2/3）**：合并 openTaperCurveEditor / openPanelSegmentCurveEditor 打开路径；数据模型整体升级评估（Route A 保留「左右独立曲线+asymmetric 恒 true」路由 vs Route B 重构为 {primary, secondary} 结构，当前推荐 Route A，除非出现跨 segment/strand 预设互套的真实需求）——详见架构子智能体输出，未落盘。

## 踩坑记录：发尖 WidthCurve 专项（8.10–8.20 复盘）

> 这一轮发尖 WidthCurve 前后改了 11 个版本（8.10–8.20）才真正修对，把踩过的坑记下来，避免重蹈。

### 几何/坐标类
1. **复用主骨骼宽度采样 = 最大的坑**：原版 panel/strand 宽度以**主面板中心线 u=0** 为左右分界、用**绝对 u**（`u×半宽`、`camber(u)`）求边。发尖直接复用后，宽度变化时边缘沿 `frame.x×edgeU + frame.z×camber(edgeU)` 移动——对「右缘落在主面板左半段」的段（edgeU<0）**反向移动**，窄段 camber 占主导沿法线走 → 手柄沿主骨骼线运动（实测偏 7°~170°）。**教训：发尖宽度必须相对发尖子骨骼（段中心 centerU），不能相对主中心。**
2. **rest 链不能采样骨宽曲线**：`splitTipForSegment` 的 restPoints 曾用 `panelSplitControlPoint`（带 bone 曲线），宽度一编辑 rest 链/发尖链跟着漂移 → 位移被二次放大。**教训：rest 链是稳定基准，必须用全局曲线（传 `{}` override）。**
3. **宽度曲线不能同时缩放 camber**：camber = curvature×半宽×(1-u²) 与宽度联动，导致宽度编辑改变鼓包、控制点沿法线走。**教训：tip 宽度只改横向，camber 固定用全局曲线**（对齐常量 `centerU×全局半宽` 保证段中心仍在主面板原位置、zipper 墙不裂）。
4. **每侧单独 fork 分布会让两侧控制点错位**：后续改为基于**最深 zipper** 的等距分布，短侧动态截断、数据保留（§8.21）。
5. **spread 是段内相对收窄（相对缩放），不是绝对位移**：旧 `splitOpening` 绝对位移导致 u 反转 crossover（0.2.58 调研），重铸为 `0.5×spread×span×ramp` 相对开口。

### 数据/交互类
6. **曲线烘焙锁定区 0.1 网格（11 点）**：点太多且约 9 个在锁定区不可见。**教训：采样器对 `t<forkT` 回退全局曲线，曲线只存暴露区（fork 边界 + 控制点 + 尖端），保持精简。**
7. **拖拽重复写入**：pointermove 每帧深克隆全部骨骼 + 双写 + 重建两条曲线。**教训：begin 只 materialize 一次并复用；`setTipWidthCurveValue` 只重建被编辑侧。**
8. **一次性跳变**：8.17 帧不一致（UI 用 strandFrameAt、mesh 用 panelFrameAt）→ 新增 `tipPanelFrameAt` 复刻几何帧；8.18 烘焙未拖侧误切副曲线 → 取「编辑前有效曲线」。

### 工具链类
9. **PowerShell 写中文/CRLF 会破坏文件**：`Set-Content -Encoding UTF8` 会加 BOM/改行尾；`| node -` 管道会乱中文。**教训：一律用 Node 读写（UTF-8 无 BOM + CRLF），或用临时 .cjs 文件执行。**
10. **模板字符串内嵌反引号会破坏 .cjs 脚本**：devlog 内容含 markdown 反引号时，写进模板字符串会提前闭合。**教训：把长内容写进临时 .txt，脚本读取再插入。**


### 8.28 发尖 Reset 全 1 + 绿色 spread 手柄 + Width Curve 中段可编辑 + Panel Hair Cards 评估（0.2.61）

> 本轮按用户反馈做三项发尖收尾 + 一项 panel Hair Cards 评估（Hair Cards 未实现，仅评估）。

**1. Reset curve 全 1**：`tipWidthResetCurve` 不再采样全局曲线写 fork 边界点，改为所有点 value=1（含两个 fork 边界点与 position 0）。这是有意的行为取舍——spread>0 时 Reset 后 fork 行会从全局宽度阶跃到 1（原 0.2.60 的「fork 连续」防裂特性被撤销），用户接受全 1 的简单语义。若后续需要两者兼顾，可再引入「锁定区跟随全局 + 暴露区全 1」的混合重置。

**2. 绿色 spread 手柄（视口拖拽直接写 Segment Spread）**：恢复被 8.11 删除的 `panelSegmentHandles`（绿色 `#5df0a8` 球，每段一个），仅在该发尖被选中时显示，位置按当前 `bone.spread` 计算；拖拽命中 `userData.panelSegmentIndex` 走既有 kind="segment" 路径，直接写 `bone.spread = clamp(((u-left)/span)*0.99, 0, 0.99)`，与右侧 `#panelSegmentSpread` 滑杆一致。

**3. Width Curve 浮动面板中段可编辑**：`renderTaperCurveEditor` 的 `tipSideForkFor` 由「本侧 fork」改为「公共 fork（最深 zipper，`tipWidthCommonForkT`）」——只有 t 小于公共 fork 的锁定点打 `tip-hidden`，两 zipper 之间的点现在可选中/拖拽；`taperEditorDeps` 补充 `tipWidthCommonForkT`。

**Panel Hair Cards 评估（未实现，仅评估）**：
- 结论：**可行，兼容度高**。`lock.hairCard` 与材质双面判定（`strandUsesDoubleSidedMaterial` 已对 `Boolean(lock.hairCard)` 返回 DoubleSide）均已是通用字段/逻辑，panel 仅需补几何与 UI。
- 几何：`createPanelStrandGeometry` 的 `addPatch` 当前 front+back+walls+caps；Hair Card 模式只需在 `lock.hairCard` 时只发 front 行（shell=+1）与 front 面 quad，跳过 back/walls/caps，并置 `geometry.userData.openSurface=true`。surface（lattice）面板同理。
- 兼容：发尖子骨骼/zipper 分段/spread/panelWeights/USDA 蒙皮都作用在 front 面板上，Hair Card 单面后这些系统保持兼容（zipper 的「墙」仅存在于 front/back 之间，单面后自然省略）。panelThickness/depthCurve 在单面模式下无实际作用但无需删。
- 待办（若实施）：`syncHairCardControls` 目前只对 strand 目标显示开关；需放开 panel 目标并接 `hairCardInput` change 分支；面板属性编辑器需让 Hair Card 开关对 panel 可见。建议独立 feature 分支实现。

**验证**：node --check 全绿；verify-smoke 10/11（branch-bridge 基线失败，与 HEAD 一致）。verify-tip-select 契约测试因仓库内无 Sussurro_v1_0041/0042/0044 资产无法在本机运行，相关断言已按新语义改写（Reset 全 1、fork 采样=1、浮动面板公共 fork 阈值、Reset 按钮双面全 1）。

### 8.29 发尖控件 4 项修复（0.2.65，分支 0.2.64-panel-tip-curve）

> 本轮按用户反馈修复发尖控件 4 项（绿色 spread 手柄热同步/位置、所有段手柄显示规范化、W 移动 gizmo 上发尖骨骼 + Pull Strand 暴露区整体）：

**1. 绿色 spread 手柄视口拖拽 → Main 面板热同步**：`updatePanelSplitHandleDrag` 的 `kind==="segment"` 分支（写 `bone.spread`）此前缺少右侧属性面板同步；现与 `tipWidth` 分支一致，在 `updateTopologyStats()` 后按 `panelTipSelection.lockId===lock.id || getSelectedLock().id===lock.id` 调用 `syncPanelSegmentControls(lock)`，拖拽时 `#panelSegmentSpread` 滑杆/数值实时更新。

**2. 所有段绿色手柄显示 + 拖非选中段不切换（有意设计，规范化）**：只要任一子发尖被选中（tipUiActive），所有段的绿色手柄都会显示，且拖任意段手柄直接写该段 spread、不改变 `panelTipSelection`（不跳转）。此行为本就由 `panelSegmentHandles` 的 visible 条件与拖拽分支实现，本轮在 `bone-view-handles.js` 补注释明确为有意设计，防止后续误改。

**3. 绿色手柄跟随 tip trim/curve + 切线偏移**：绿色手柄原用 `panelSplitControlPoint(lock,{position:handleU,height:0})`（主面板未 trim 的 t=1 尖端），会浮在 trim/curve 后的真实发尖之外。改为 `tipSurfaceFrameAt(lock, 1, handleU, segment, tipSplits)`（内部已应用 `panelTipCurve` + edge trim 的 `tipOffsetSampleT`），并沿切线（y）外推 `TIP_SEGMENT_HANDLE_TANGENT_OFFSET=0.08`，落在适配后最尖端稍前方、不与发尖子骨骼手柄重合。spread→handleU 横向映射不变。

**4. W 移动 gizmo 上发尖骨骼 + Pull Strand 暴露区整体**：`beginPanelSplitHandleDrag` 的 gizmo 挂载分支由 `["rotate","scale"]` 扩为 `["move","rotate","scale"]`（W 移动也能挂 transform gizmo 精细调控）；新增 `beginTipSubBoneTranslate`（拖拽开始快照 startPosition/startPoints/restPoints）+ `applyTipSubBoneTransform` translate 分支——把 fork 以下暴露子链当整体做 Pull Strand 求解（`solvePulledStrand(exposedVecs, point-firstBelow, handle.position, 0, pullRigidity)`，根点钉在 fork），写回 `bone.tip.points`，而不是把整个主骨骼当链。app.js `dragging-changed` 同步 translate 的 begin/清理；`__ahsTest` 暴露新函数。move 工具的视平面单点拖拽改为 select 工具路径（原 kind="tip" 代码保留）。

**验证**：node --check 3 文件全绿；单测与 verify-smoke 与 HEAD 基线一致（dom-contract/core-math shortcut-registry 为已知契约分叉失败；verify-smoke 8/10 因仓库无 .ahs 资产，selection/branch-bridge 两项环境性失败与基线相同）。

### 8.30 发尖控件 2 项修复：W 移动 gizmo 不生效 + 绿色手柄不跟 authored（0.2.65，分支 0.2.65-bugfix）

> 本轮修复上轮遗留的两个发尖控件问题（用户反馈 + 深度定位，未轻信直觉）：

**1. W 移动 gizmo 拖点不生效、切选择就瞬移回去**：根因是 `beginTipSubBoneTranslate` 在 `bone-interaction.js` 中实现了但**漏在 `createBoneInteractionApi` 的 return 对象里导出** → app.js `dragging-changed` 里 `bonesApi.beginTipSubBoneTranslate(...)` 是 undefined → 抛 TypeError → `tipSubBoneTranslateDrag` 从未设置 → `applyTipSubBoneTransform` 的 translate 分支因 `!drag` 提前 return → 发尖链从未被写入 → gizmo 拖出来的点只是视觉位移、下次 updateCurveObjects 就瞬移回原位（move 笔刷走 `applySubBoneBrushSample` 不依赖该导出所以正常）。修复：return 对象补 `beginTipSubBoneTranslate,`。数据流本身（materializeSplitBones → 写 bone.tip.points → splitBonesFor 读回）用真实模块测试验证持久化成立（persisted == solved 端点）。

**2. 绿色手柄只跟 trim、不跟用户修改的发尖子骨骼位置**：绿色手柄位置用 `tipSurfaceFrameAt(lock,1,handleU,segment,tipSplits).point`（纯 rest 表面点，含 panelTipCurve/edge trim），不含 `bone.tip` 的 authored delta。修复：把 `tipSplitBones/tipChains/tipForkTs` 的计算提前到绿色 forEach 之前（pink tip 手柄/链线/tipWidth 继续复用同一份，避免重复计算），绿色手柄在 rest 表面点 + 切线外推之后，再叠加链最后一点（t=1 尖端）的 authored delta（`points[last] − restPoints[last]`）。无 authored 编辑时 delta=0，行为与原来完全一致。

**验证**：node --check 2 文件全绿；verify-smoke 8/10 与 HEAD 基线一致（仓库无 .ahs 资产，selection/branch-bridge 环境性失败）；真实模块数据流测试确认 tip.points 写入经 splitBonesFor 持久化。

## 8. 待确认（实施前）

- tip.points 用 2 点（base+tip）还是 3 点（base+mid+tip，可调曲率）；默认长度取多少（如 0.15×面板长度）。
- 尖端跟随的「行数 N」取多少（如最后 2–3 行）与平滑插值方式（smoothstep）。
- 是否允许 tip 越过相邻段（segment 边界约束，类似 zipper 最小间距）。
