# Panel split 尖端子骨骼分析：每 split 段一个「类普通发丝尖端」的子骨骼（0.2.59 规划）

> **✅ 已实现（0.2.59 落地）+ 本轮进行中**：本文档由「规划」转为「实施 + 修复记录」——尖端子骨骼 S1–S6（程序化权重 / 数据模型 / 几何跟随 / 视口手柄 / 关联系统 / USDA 蒙皮）见 §8.5；点击 toggle 选中 + 主发丝保持 + overlay z-fighting 见 §8.6；双段高亮 + 笔刷保留 tip UI 见 §8.7；边界段 / 笔刷统一变换 / undo 持久化 / bones-only / alt+点击见 §8.8；本轮 5 项改动（0.2.59 进行中）见 §8.9。§1–§7 与「§8 待确认（实施前）」为规划期内容，已被实施取代，保留作历史。
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
## 8. 待确认（实施前）

- tip.points 用 2 点（base+tip）还是 3 点（base+mid+tip，可调曲率）；默认长度取多少（如 0.15×面板长度）。
- 尖端跟随的「行数 N」取多少（如最后 2–3 行）与平滑插值方式（smoothstep）。
- 是否允许 tip 越过相邻段（segment 边界约束，类似 zipper 最小间距）。
