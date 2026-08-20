# JS 改动标注

<!-- 本文件已按子系统拆分：详细条目见 devlog/annotations-*.md；时间线见 devlog/local-adaptation-log.md。 -->

## JS 改动标注 / JS change annotations

> 以 main 分支（原版本）为基准，记录本地适配的差别/新增功能。
> 详细条目见各子系统文件，时间线见 local-adaptation-log.md。

## 子系统索引（先 grep 关键词，再跳读对应条目，不要全文顺序读）

| 子系统 | 关键词 / 函数（app.js 行号可 `Select-String` 定位） | 对应条目 | 条目文件 |
|---|---|---|---|
| 子发片桥接（几何）/ 父发片挖洞 | `buildBranchBridgeGeometry` / `createBranchChildGeometry` / `applyBranchRootRegionCarving` / `holeBoundary` / `connectSide` | 2.2、2.4a→2.4t、0.2.43–0.2.44 | [annotations-bridge.md](annotations-bridge.md) |
| Region 选区 / 面板 | `branchRootRegion` / `normalizeBranchRootRegion` / `syncBranchRootRegionOffsets` / `updateBranchRootRegionCenter` / `branchRegionNavAction` | 2.1、2.4u–2.4w、2.5–2.14 选区相关、0.2.40–0.2.47、0.2.52–0.2.53 | [annotations-region-panel.md](annotations-region-panel.md) |
| 根骨骼 gizmo / twist / H 模式 | `captureBranchLocalState` / `pointerHitsTransformGizmo` / `branchRootGizmoFrame` / `strandControlPointFrame` / 扫掠起始手柄 | Phase 2.15–2.16、0.2.23–0.2.42 | [annotations-root-bone.md](annotations-root-bone.md) |
| split 父发片兼容 | `splitFusedGrid` / `parentSupportsTopologyConnect` / `createSplitStrandGeometry` | 0.2.49–0.2.51 | [annotations-split.md](annotations-split.md) |
| 刘海 / 面板线框三角面显示修复 | `createPanelStrandGeometry` / `addQuad` / `triangleEdgeMasks` / `authoredEdgeMasks` | 0.2.54–0.2.56 | [annotations-display-fixes.md](annotations-display-fixes.md) |
| 日常适配（保存/导出、语言、导航、笔刷、拖放、材质、快捷键等） | `saveHairProjectQuickly` / `exportHairProjectQuickly` / `localization.js` / Navigation style / `sculpt-brush.js` / `server.js` | 顶部条目、v0.1.4 迁移、0.2.48 | [annotations-adapt.md](annotations-adapt.md) |
| Panel Split 骨骼化 / 尖端子骨骼 / 统一骨骼模型 / 子发片扫掠 | `lock.splitBones` / `bonesFor` / `sweepStrandGeometry` / `createPanelStrandGeometry` / `createBranchChildGeometry` | 0.2.59 已实施（P1/P2 与 Phase A/B/C 落地）；**发尖子系统的当前状态见 0.2.123/0.2.125/0.2.126 三轮条目**，panel-split-tip-bones.md 只到 0.2.65 | [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md)（**历史实施记录，止于 0.2.65** §8.5–§8.30）+ [in-progress/strand-tip-selection-port-plan.md](in-progress/strand-tip-selection-port-plan.md)（0.2.126 选中系统）+ [in-progress/strand-tip-width-ui-port-plan.md](in-progress/strand-tip-width-ui-port-plan.md)（0.2.125 WidthCurve）+ [in-progress/bone-system-roadmap.md](in-progress/bone-system-roadmap.md) + [in-progress/split-bone-refactor-plan.md](in-progress/split-bone-refactor-plan.md) + [in-progress/unified-bone-model.md](in-progress/unified-bone-model.md) + [in-progress/child-sweep-unification.md](in-progress/child-sweep-unification.md) |
| **导出拆 UV（0.2.69–0.2.79）** | `unfoldHairMesh` / `gridUvTable` / `gridUvAt` / `childUTopologyScale` / `buildUnfoldedMeshes` / `bridgeUvAnchors` / `bridgeSeamCol` / `gridRowIndices` | 0.2.69–0.2.79（规则/理念/9 条踩坑见右） | [uv-unfold.md](uv-unfold.md) |

> 新 agent 先读 `devlog/AGENT_QUICKSTART.md`；本文档只作索引，不要全文顺序读。

## 最近更新（0.2.132）

> **Tip Clump 语义统一 + 删除继承来的「segment separate」（分支 DHS/develop）**。用户决策原文：
> 「那个滑块可以删了, 简单分叉可以通过发尖系统实现」「发尖的绿色宽度整体控制器应该和 tip clump
> 联动就像现在 panel 一样, tip clump 是需要的」。即：① 普通发丝的 Tip Clump 改成与 panel **同义**的
> 「发尖相对自身宽度整体收窄」；② main 继承来的「整管横向平移分离」语义与其全局滑杆**整体删除**
> （分离改由拉 zipper 实现）；③ 绿色宽度手柄随 Tip Clump 联动。术语对照见
> [APPJS_SPLIT_GUIDE.md §7.2b](APPJS_SPLIT_GUIDE.md)。
>
> - **modules/geometry/tip-width-curve.js**：新增 `tipClumpNarrowFraction(sideZipperHeight, tipClump, t)`
>   —— Tip Clump 收窄比例的**唯一定义点**（本侧 zipper 处 0、线性升到发尖满值）。panel 侧
>   `tipWidthSpreadGap` 改为「共享比例 × 0.5 × 段 span」，发丝侧乘管内半跨度，于是同一个数值在两种
>   几何上收掉的都是「自身宽度的同一比例」。**必须线性**：发丝侧此前用 smoothstep（那是已删除的
>   opening 平移遗留），两侧不同会让同一数值收窄形状不一致。真 import `SPREAD_MAX`（无循环依赖）。
> - **modules/geometry/strand-geometry.js**：`createSplitStrandGeometry` 删除 `direction` 与
>   `opening = baseWidth·spread·smoothstep(...)·direction`（整管沿 frame.x 平移）；改为在 sweep 趟里
>   **先**用 `strandTipClumpNarrowedProfile` 把 profile x 绕本管 band 中心收窄、**再**送进
>   `strandProfileTopologyAt` —— 与 panel「先把列的 u 收进 [uStart,uEnd]、再用该 u 采样宽度曲线」同序。
>   每段新增 `leftClumpHeight`/`rightClumpHeight`（无 zipper 的外侧镜像对侧，与 panel 邻居规则同构）。
>   **曲率收窄预趟刻意不传收窄**（与发尖 WidthCurve override 同样的三条理由：factors 全行全管共享、
>   经 falloff 会传播到 row 0 破 UV 契约、语义上是基础包络粗细）。
> - **modules/geometry/strand-tip-width.js**：新增 `strandTipClumpNarrowedProfile`（几何与把手**共用
>   同一函数**，所以绿色宽度手柄落在真实收窄后的网格边缘上 = 用户要的「联动」）；
>   `strandTipWidthEdgePosition` 删掉 opening 加回项、改为先收窄；`strandTipClumpAxis` 重写为
>   **标称管宽**轴（见下方踩坑）。
> - **modules/bones/bone-model.js**：字段 `bone.spread` → **`bone.tipClump`**（读取 `tipClump ?? spread`，
>   **只在 normalize 层回退一次**；写盘只写新名，双写会漂移）。删除 `strandSplitDirection` /
>   `strandSplitDirectionForSegment`（只服务于已删除的 opening），改为 `strandSplitTubeCenter(k, splits)`
>   = 边界 `[-1, ...position, 1]` 第 k 段**中点** —— 管现在不平移，需要的是管自身的中心；它跟随**真实
>   划分**，而旧的等距 `(2k−N)/N` 不跟。`defaultStrandTipClump(lock)` 读 `lock.strandSplitGap`（**存档
>   字段保留**、滑杆删除，与 panel 的 `defaultSplitTipClump` 读 `panelSplitGap` 逐条同构），旧档因此
>   保留作者当年的量级。
> - **改名的边界（哪些跟着改、哪些刻意不改）**：跟着改的是**字段名与内部标识符** —— `bone.tipClump`、
>   `defaultSplitTipClump`/`defaultStrandTipClump`、`tipClumpNarrowFraction` 的形参、`clumpBest.tipClump`、
>   `segmentUi` 描述子键 `tipClumpInput`/`tipClumpValue`。**刻意不改**的是 **DOM 控件 id**
>   （`#panelSegmentSpread`/`#strandSegmentSpread` 及其 `*Value`）与处理器名 `applyStrandSegmentSpread`：
>   id 属 `dom-contract` 冻结面（改它要同步 index.html + 多条断言），且与用户存档无关；本轮的目标是
>   「字段名与 UI 名指向同一个概念」，控件 id 不在其中。**`clump-procedural.js` 的 `spread`/`depthSpread`
>   一字未动** —— 那是 main 的发丝聚簇参数（`#clumpSpread`），正是本轮要与之区分开的那个同名概念。
> - **三条持久化路径逐条验证**（不只信一条）：`strandSplitBones*`（发丝管）、`splitBones*`（panel 段）、
>   `bones*`（统一 registry，`project-files` 的导出侧经 `bonesFor` 消费它）都做到「旧档 `spread` 逐值
>   升级成 `tipClump` + 落盘不再双写」；两条镜像路径（`mirrorStrandSplitBones`/`mirrorSplitBones`）的
>   `tipClump` 随管/段序 reverse。**负向对照实测**：把 `pickTipClump` 改成只读 `spread` 后，
>   `split-tip-geometry` 立刻 **6 条红**（含三条新增的跨路径/几何消费断言），恢复后全绿 —— 证明这些
>   断言不是空跑。另有一条几何侧负向对照：同一根管写 `tipClump: 0.8` 与 `spread: 0`，断言网格跟着
>   **tipClump** 走（若消费端读错字段，该断言等于基准值、立刻红）。
> - **modules/io/usda-export.js**：`strandDirectionForTube` → `strandTubeCenterForTube`；派生骨骼位置与
>   rest 链的侧向偏移改为 `baseWidth × 管中心`，且**沿全长恒定**（band 等宽裁剪 ⇒ 中心不随 t 变），
>   smoothstep/splitStart 随之删除。
> - **index.html / app.js / segment-control.js / draw-flow.js / creation-presets.js / clump-brush-presets.js**：
>   删除 `#strandSplitGap` 滑杆与其读数、`applyStrandSplitGapToTubes` 全局刷及全部接线（创建默认值、
>   克隆、镜像、快照、预设、draw stroke）。`app.js` 的 `currentStrandSplitTipChains` rest 回退不再加
>   opening（连同整趟只为它预算的逐行 frame 一起删除）。两个 Tip Clump tooltip 去掉「Split Spacing」
>   措辞，EN/JA/ZH 三词典同步。
> - **踩坑（node 测试漏掉、真实浏览器抓到）**：`strandTipClumpAxis` 一度用「t=1 处的真实网格边缘」当
>   跨度基准。**DEFAULT_TAPER_CURVE 末点 value 恰为 0**（真实工程亦然）⇒ 该处管宽为 0 ⇒ 轴长恒 0 ⇒
>   **手柄拖不动**、且 N+1 个手柄重叠。本文件的 fixture 用恒 1 的 FLAT_CURVE，所以 node 全绿。改为
>   **标称管宽**（band 极值 × baseWidth，与 taper 无关，正对应 panel 用不随 taper 收缩的段 boundaries），
>   并补了一条「taper(1)=0 仍可拖且互不重合」的回归测试。
> - **顺带修掉一个真实死区**：旧 Tip Clump 只经 opening 生效，而 opening ∝ `(2k−N)/N`，偶数拉链数的
>   正中间管系数恰为 0 ⇒ 拖它完全不动网格（自 0.2.116 起如此）。收窄不依赖方向系数，每管必然响应。
> - **验证**：node 回归 **362/362**；真实浏览器 `scripts/verify-tip-clump.mjs` **17/17**（0 page exception）；
>   主进程探针实测「zipper + Tip Clump 真的产生分叉」：缝隙在 fork 处恒为 0、发尖处随 Tip Clump 单调
>   张开（0 → 0.017 → 0.033 → 0.050），管宽同步收窄。

## 上一轮（0.2.126）

> 普通发丝发尖子骨骼「选中系统」移植（分支 DHS/develop；用户报告「选不中 zipper 分出的子发尖」，定「以 panel 操作方式为准、一批做完」）。**根因与 0.2.124 的 `strandSplitDirection` 同类**：选中逻辑当初只写在 panel 分支里、没抽成单点定义，发丝侧永远追不上；因此本轮是**泛化**而非在发丝侧新造第二套。
> - **modules/bones/tip-sub-bone-host.js（新增）**：`resolveTipHost(lock, { materialize })` —— 一次分派出该几何的发尖链 / splits / 段骨骼 / fork / 帧，替代此前「`clonePanelSplits` + `materializeSplitBones` + `splitTipForSegment`」的 panel 专用三连。与 `bone-model.js` 的 `segmentBoneHost` 分工：那边是**纯数据**分派（段数 / 段骨骼数组 / 段号键），这边是**发尖链**分派（需要 deps 注入几何函数）。fork 走 `strandSplitForkTForSegment`，**不新写公式**。
> - **modules/edit/sculpt-edit-store.js**：状态键 `panelTipSelection`/`panelTipHover` → 几何无关的 **`tipSelection`/`tipHover`**（形状恒为 `{ lockId, segmentIndex } | null`，`segmentIndex` 在 panel 上是段号、在发丝上是管号，含义由 `segmentBoneHost` 决定）。**刻意选单键而非两套**：清理路径 `selectLock`、表面高亮 `updateTipHighlight`、笔刷门控 `applySubBoneBrushSample`、`tipUiActive` 各只有一份实现，两套键会让这四处都长出 `if(几何)` 分叉。理由写在 store 定义处（L14-22）。
> - **modules/bones/bone-model.js**：描述子新增**单点定义** `tipChainPointCount(lock)`（发尖链点数）。两几何的发尖链都复刻主链拓扑，但**下限刻意不同**——panel 允许 0（主链不足 2 点时整段没有可编辑发尖，`splitTipForSegment` 也返回 null），发丝为 `Math.max(2, …)`（对应 `materializeTipChain` 内部同一下限，传 0 会造出与视口不一致的 2 点链）。把手分配 / 链物化 / 笔刷区间三处不同源会导致「手柄比链点多或少」→ 越界或漏点。
> - **modules/geometry/tip-sub-bone.js**：新增导出 `firstExposedTipChainIndex(forkT, pointCount)` = `clamp(floor(forkT·last), 1, last)` —— 「发尖链第一个暴露点」的**唯一定义点**，替代此前散在四处的同一表达式（视口把手 / 引导线 / gizmo translate / 笔刷）。floor 而非 round/ceil 的理由与消费方清单写在函数上方。
> - **modules/bones/bone-view-handles.js**：把手从「每管 1 个尖端把手」改为**每链点一个 + 旋转模式法线箭头**（实测 3 管 × 4 链点 = 12 个，原先仅 3 个），两几何共用 `allocateTipChainHandles`，数量取自 `tipChainPointCount`、管数取自 `STRAND_SEGMENT_HOST.segmentCount`（不写 `strandSplitBonesFor(lock)?.length`：它对未启用 split 的发丝返回 null，而把手必须**预先**分配）。
> - **modules/bones/bone-interaction.js**：gizmo 挂接（move/rotate/scale）、笔刷雕刻子骨骼门控（原「panel only」扩为「任何有段发尖子骨骼的几何」）、alt+点快切、点本体 toggle 全部按 `segmentBoneHost` 分派；暴露区间走 `firstExposedTipChainIndex`。
> - **modules/geometry/panel-tip-strand.js**：`updateTipHighlight` 的几何门控从 `isPanelGeometry` 扩为 `segmentBoneHost`——函数主体本来就与几何无关（读 `leafWeights`），只需放开这道门。
> - **门控口径定论**：正确写法是 `segmentBoneHost(lock) === STRAND_SEGMENT_HOST`，**不是 `!isPanelGeometry`**（后者会把「既非 panel 也非 split 发丝」的几何一并卷入）。**发丝路径绝不调 `clonePanelSplits`**（会造出与真实 zipper 无关的假 splits，段数/fork 全错——本轮前已踩过两次）：已审计全部 6 个调用点，均为 panel 门控或位于 `resolveTipHost` 的 panel 分支。
> - **panel 行为不变有独立证据**（不只靠套件全绿）：主进程探针对比改动前 HEAD —— `splitBonesFor` 在 4 种 panel 形态下逐值相同、新分派复现 HEAD 的内联规则、`mirrorSplitBones` 逐值相同、索引钳位对 `-3/99/1.6/NaN` 全部落界内。顺带修掉 panel 侧潜伏的 gizmo 种子 bug（见 bug-fixes.md #22）。
> - 回归：Node 全量 **342/342**。详见 in-progress/strand-tip-selection-port-plan.md。

## 最近更新（0.2.125，Phase C：普通发丝 per-segment UI）

> 普通发丝（分裂管）补上 panel 早有的「按段编辑」UI 基座：段选择器 + 每段 Spread + 每段 Width/Depth 曲线预览与编辑入口。数据层（`lock.strandSplitBones[i]` 的 spread/曲线，持久化/镜像/增删重映射）0.2.116–0.2.117 已就位，本轮只做 UI 与分派。**曲线在同版本的发尖 WidthCurve 移植中已被几何消费**（见下方 0.2.125 发尖 WidthCurve 条目与 `in-progress/strand-tip-width-ui-port-plan.md`）；原文此处记「尚未被几何消费」已作废。
> - **modules/bones/bone-model.js**（文件末尾新增段）：新增「段骨骼宿主」描述子 `PANEL_SEGMENT_HOST` / `STRAND_SEGMENT_HOST`（各含 `bonesField` / `segmentIndexKey` / `segmentCount` / `bonesFor` / `materializeBones`）、几何分派 `segmentBoneHost(lock)` 与选中段解析 `resolveSegmentSelection(lock, sculptState, host?)`。这是「当前几何的段数 / 段骨骼数组 / 选中段下标」的**唯一定义点**——此前 `panelSplits.length + 1` 与 `clamp(round(panelSegmentIndex))` 在 taper-editor 里各复制了两份、segment-control 里第三份。strand 的段数刻意委托既有 `strandSplitsFor`（排序 + 钳制 + legacy 单标量回退），与几何同真源。
> - **modules/bones/segment-control.js**：抽出共用同步体 `syncSegmentControls(target, host)` + DOM 侧描述子 `segmentUi(host)`，`syncPanelSegmentControls` 与新增 `syncStrandSegmentControls` 都是它的薄封装（段号/两端禁用/spread/两条曲线预览/浮动面板热刷新一份实现）。新增 `selectedStrandSegment`、`openSegmentCurveEditor`（按几何分派的曲线编辑入口，`openPanelSegmentCurveEditor`/`openStrandSegmentCurveEditor` 为具名封装）、`stepSegment`/`stepPanelSegment`/`stepStrandSegment`（段步进的唯一实现，app.js 只转发点击）、`applyStrandSegmentSpread`（materialize → 写 `strandSplitBones[i].spread` → 几何/曲线对象/镜像/统计，与 `changeStrandSplitCount` 同序列）、`syncSegmentControlsForLock`（供 shape-presets 按几何刷新）。`stepSegment` 刻意不再在 sync 之后补一次 `retargetOpenSegmentTaperEditor`（旧 panel 处理器会让同一次点击把曲线面板渲染两遍；retarget 幂等，去掉只省功）。
> - **modules/geometry/taper-editor.js**：`activeTaperTarget` 的 segment 分支、`segmentCurveTarget`、`segmentCurveTargetForWrite`、`retargetOpenSegmentTaperEditor` 四处从 `isPanelGeometry` 硬门控改为经 `segmentBoneHost` 分派（panel 行为逐值不变，split 发丝解析到 `strandSplitBones[i]`）；新增 `selectedSegmentIndex(lock)`；segment 编辑的预览刷新按宿主选 `strandSegment*Preview` 或 `segment*Preview`。`renderTaperCurveEditor` 里发尖 WidthCurve 的「按侧暴露锁定点」判定**只对 panel 生效**（`clonePanelSplits` 对发丝会回退出与几何无关的假 splits，据此算暴露会把可编辑点误标成锁定点）——发丝侧的暴露规则留给发尖 WidthCurve 移植那一轮。
> - **modules/io/shape-presets.js**：段曲线预设写入后的刷新从 `syncPanelSegmentControls` 改 `syncSegmentControlsForLock`，「是否仍停在同一段」判定从直接读 `panelSegmentIndex` 改 `selectedSegmentIndex(lock)`（否则发丝段预设会去比 panel 的段号）。
> - **modules/edit/sculpt-edit-store.js**：新增 `strandSegmentIndex: 0`。刻意**新增独立键**而非复用 `panelSegmentIndex`——两套段号必须能各自停在不同下标，混用会让切换选中对象时段号互相污染。
> - **app.js**：新增 8 个 DOM 常量（`strandSegmentControls`/`strandSegmentLabel`/`previous|nextStrandSegmentButton`/`strandSegmentSpread`/`strandSegmentSpreadValue`/`strandSegment(Taper|Depth)Preview`）并接进 segmentControl 与 taperEditor 两个 deps 批次；panel 段步进的两个处理器（原各 8 行内联 clamp+sync+retarget）改为转发 `segmentApi.stepPanelSegment(±1)`；发丝段步进/Spread 同样只转发；铅笔按钮从 `openPanelSegmentCurveEditor` 改 `openSegmentCurveEditor`（两块段曲线容器共用 `data-segment-curve`，目标由几何分派）；`syncStrandSplitInputs` 末尾补 `segmentApi.syncStrandSegmentControls(target)`（与 `syncPanelShapeInputs` 末尾调 `syncPanelSegmentControls` 同构，段数随 zipper 增删变化必须同入口刷新）。
> - **index.html**（`#strandSplitControls` 内，Zipper Controls 与 Split Spacing 之间）：新增 `#strandSegmentControls`（`draw-shape-controls hidden`，复用既有 `display:contents` + `.hidden` 机制，**无新 CSS**）内含 Split Segments 小节、段步进器（`#previousStrandSegment`/`#strandSegmentLabel`/`#nextStrandSegment`）、`#strandSegmentSpread` + `#strandSegmentSpreadValue`（0..0.99 step 0.01，与 `SPREAD_MAX` 同界）、`#strandSegmentCurveControls[data-segment-curve]`（Width/Depth 预设 select + `#strandSegmentTaperPreview`/`#strandSegmentDepthPreview` + 铅笔）。整块仅对「已开启分裂的普通发丝」可见（`syncSegmentControls` 按 `bonesFor` 为 null 判定，与 `#strandSplitControls` 同源）。缓存号未动：本轮没有新增/改变任何 `?v=` import 边。
> - **modules/data/loc-ja.js / loc-zh.js**：各 +6 词条（2 条新 tooltip：段选择行、每管 Spread；4 条补齐 panel 侧原本漏译的段曲线 aria-label/tooltip：`Selected segment width|depth curve preset`、`Edit segment width|depth curve`——EN 即 index.html 源串，无需第三份词典）。
> - 回归：Node 全量 **312/312**（新增 6：DOM 契约 1 条 + `tests/strand-segment-ui.test.mjs` 5 条——几何分派、段数=拉链+1（含 legacy 标量回退）与索引钳位（越界/负/NaN/浮点）、步进两端禁用与 panel 段号不受污染、未分裂时整块隐藏且步进 no-op、spread 只落选中管 + 重建序列 + SPREAD_MAX 钳位）。当时的套件规模为 312；`APP_VERSION` 与入口缓存号由主进程在 0.2.125 合并时统一 bump。

## 最近更新（0.2.124）

> 修普通发丝多 zipper「只有一个缝起效」（分支 DHS/develop，1 Opus 子智能体 + 主进程 merge/实测核验）：
> - **modules/bones/bone-model.js**（L454-476）：新增导出纯函数 `strandSplitDirection(segmentIndex, splitCount)` = `(2k − N) / N` —— 该横向推开规则的**唯一定义点**；`strandSplitDirectionForSegment(lock, k)` 改为薄封装（N 取自既有 `strandSplitsFor` 归一化）。注释记录「为何单调性才是修复」并列出两个消费方。
> - **modules/geometry/strand-geometry.js**（L22 import、L118-134）：per-section `direction` 改调 `strandSplitDirection(i, splitCount)`，删除已失效的 `profileMidX` 与「push away from profile center」旧注释。原离散规则（`i===0?-1 : i===splitCount?+1 : Math.sign(center−mid)`）会让相邻管拿到同一 direction、一起平移 → 缝不张开。
> - **modules/io/usda-export.js**（L1-7 新增 import、L534-539）：`strandDirectionForTube` 改为委托同一规则并导出（供跨消费方一致性断言）。此前它与 bone-model、strand-geometry 各持一份**复制的**离散规则，只改几何会让骨骼/导出偏移与渲染管错位。
> - **index.html**（L1191）：Split Spacing tooltip 从「how far apart the **two** tip branches open」改为覆盖 N 根管（该字符串无 localization key，词典无需改）。
> - 依赖检查：bone-model 仅 import three，无循环；usda-export 原零 import，新增后为 usda-export → bone-model → three（浏览器 importmap 与 node 测试均覆盖）。顺带修正 `tests/usda-export.test.mjs` 头部「usda-export 无 import」的过期说明。
> - 回归：Node 全量 293/293（新增 5：N=1 恒 `[-1,1]` legacy 一致、严格递增使每条缝都开、对称不侧漂、**三消费方逐值一致**、几何级「N+1 管在 tip 全部横向分离」）+ 真实 Sussurro_v1_0060.ahs 130/130；缓存号 20260831-1 + APP_VERSION 0.2.124 冻结同步。

## 最近更新（0.2.123）

> 发尖 WidthCurve 控制点改回共用网格 + 按侧动态暴露（修正 0.2.118 的设计错误；分支 DHS/develop，1 Opus 子智能体 + 主进程 merge/实测核验）：
> - **modules/geometry/panel-tip-strand.js**：新增 `tipWidthGridTs(lock, segmentIndex, splits)`（唯一共享网格 = `tipWidthControlTs(commonForkT)`，最深 zipper span 的 5 中点 + 尖端 1；**其下标即稳定把手索引**）与 `tipWidthSideExposesT(lock, segmentIndex, splits, side, t)`（暴露判据单一定义点）；`tipWidthSideControlTs` 从「按本侧 fork 独立分布」改为「共享网格**过滤**出本侧暴露子集」（契约写进注释：参数共享、数量动态）；`tipWidthControlPlacement` 改为索引完整网格 + 未暴露返回 null（注释里把该守卫从「安全网」正名为**动态暴露的真正机制**）；`tipWidthResetCurve`/`buildTipWidthCurve`/`setTipWidthCurveValue` 同步走同一判据，`setTipWidthCurveValue` 补 `positions.length === 0` 早退（全锁侧 `sideForkT >= 1` 无处可写）；`tipWidthRecordsOppositeFork` **保留**（对侧 fork 为滑杆连续值、几乎不落网格，对侧更浅时会成为本侧暴露区内的无把手活点）。导出 `tipWidthGridTs`/`tipWidthSideExposesT`。
> - **modules/geometry/taper-editor.js**：新增 `tipPointLocked(curveSide, position)`——段 **width** 曲线的点，仅当其 position 属于该侧暴露子集时可拖，其余（position-0 记录点、对侧 fork 记录点、本侧 fork 锚点）读作锁定；非 width 的段曲线（depth，无 fork 暴露语义）保持原 fork 阈值规则。
> - **modules/bones/bone-view-handles.js**：仅注释（说明固定的 `TIP_WIDTH_CONTROL_POINTS + 1` 把手数组对应**完整共享网格**、`userData.tipWidthIndex` 索引该网格）。**modules/bones/bone-interaction.js**：零改动（索引语义未变，隐藏把手不可 raycast 命中，且 `setTipWidthCurveValue` 独立吸附到暴露子集，陈旧 index 也无法写出不可达点）。
> - **app.js**：`taperEditorDeps` 新增 `tipWidthSideControlTs`；测试 seam 暴露 `tipWidthGridTs`/`tipWidthSideExposesT`。
> - 索引方案取 (a)（索引完整网格、以可见性表达非对称数量），而非 (b)（索引过滤子集）——后者同一 index 在两侧含义不同、zipper 高度一变即漂移，把手创建时捕获的索引会静默指向另一参数。
> - 回归：Node 全量 288/288（首个测试重写为共享网格/子集/同间距/深侧更多/精确计数 + placement↔暴露双射 + 0.2.118 不变式双向断言；新增对称场景；写入测试新增「拖深侧位置时浅侧曲线逐字节不变」；旧档迁移 fixture 换成真正的 0.2.118 per-side 曲线）+ 真实 Sussurro_v1_0060.ahs 130/130；`scripts/verify-tip-select.mjs` 9 处同步（含把写死的「两侧各 6 个可抓」改为按函数推导的共享网格成员性 + 单调性 + 双射，符合 0.2.121 的验收脚本规范）；缓存号 20260830-1 + APP_VERSION 0.2.123 冻结同步。

## 最近更新（0.2.122）

> Twist Brush 方向反转 + 描边期间冻结影响范围（分支 DHS/develop，1 Opus 子智能体 + 主进程 merge/自审）：
> - **modules/sculpt/sculpt-brush.js**：新增 `const TWIST_DIRECTION = -1`（L119）并乘进 `sculptTwistBrushAngle`（L126），`SCULPT_TWIST_BRUSH_SCALE` 保持正幅值——符号**不能**藏进 scale 常量，否则调用方的 `{scale: …}` 覆盖会静默恢复旧方向。新语义：拖右 = 绕切线负向滚转、拖左为正；Ctrl 仍相对新默认取反。新增纯函数 `resolveFrozenTwistStrokeWeights(stroke, key, pointCount, computeWeights)`（L161-174）：首个采样算权重并存 `stroke.twistTipWeights`（Map，键 `lockId:segmentIndex`），后续采样复用；长度不符则重算（防链长中途变化错位）。
> - **modules/geometry/sculpt-geometry.js**：快照捕获条件 `deps.sel.activeTool === "sculpt-move"` → `["sculpt-move","sculpt-twist"].includes(...)`（L513）；`fixedMoveBrushInfluence` 摘掉 `&& !twistBrushActive`（L577）并重写上方注释（原注释写的是相反理由）。twist 分支读的 `pointWeights` 由该 gate 填充，自动获得起笔冻结权重。`captureSculptMoveStrokeInfluence` 经核实与工具无关（只读 units/起笔光标/半径衰减/比例输入/裁剪面，不 branch on activeTool、不回写），复用安全。
> - **modules/bones/bone-interaction.js**：抽出 `computeCursorWeights`，`weights` 仅在 `tool === "sculpt-twist"` 时走 `resolveFrozenTwistStrokeWeights`（L653-669），其余笔刷保持实时权重。缓存挂在每次 pointerdown 新建的 stroke 对象上（`finishSculptMoveStroke` 置 null、不池化），不跨描边泄漏。
> - **tests**：`twist-brush.test.mjs` 翻转符号断言（断的是乘积与关系，幅值/衰减/层级/范围/根排除逻辑未变）+ 3 条冻结测试；零拖拽断言改 `Math.abs(...) === 0`（乘 −1 会产生 IEEE `-0`）；`dom-contract.test.mjs` 更新捕获条件断言并把 twist 分支的 `doesNotMatch` 切片重锚到 `} else if (tool === "sculpt-twist") {`（新增三元表达式抢在原锚点之前）。
> - 回归：Node 全量 287/287（284 + 3）+ 真实 Sussurro_v1_0060.ahs 130/130；缓存号 20260829-1 + APP_VERSION 0.2.122 冻结同步。

## 最近更新（0.2.121）

> 新增 Twist Brush + dev 规范审计整改（分支 DHS/develop，2 Opus 子智能体并行 + 主进程 merge/自审/整改）：
> - **modules/sculpt/sculpt-brush.js（新增纯函数）**：`SCULPT_TWIST_BRUSH_SCALE = 0.01`、`sculptTwistBrushAngle(deltaX, weight, strength, {reverse, scale})`、`sculptTwistBrushDeltas(pointCount, weights, {deltaX, strength, reverse, hierarchy, rangeStart, rangeEnd, firstIndex})` → per-point twist **delta 数组**（签名与函数体内不出现位置）。角度**只来自 `deltaX`**、无 camera 项（与 Orient 的本质差别：后者目标 up 取自 `camera.position`，相机穿过发丝时符号翻转）；`hierarchy` 为真时把同一 delta 累加进 `[rangeStart, rangeEnd)` 全部下游点。
> - **modules/geometry/sculpt-geometry.js**：`reverseTool` 列表 += `sculpt-twist`；新增 `twistBrushActive` 标志并纳入 `fixedMoveBrushInfluence` 排除组（twist 不移动点，与 orient 同类）；主发丝分支只写 `source.pointTwists`，range 取 `curveSurfaceControllerPointRange(source)`、`firstIndex: 1`（根不参与）。
> - **modules/bones/bone-interaction.js**：发尖子骨骼分支紧随 `sculpt-orient` 之后，只写 `twistArr`→`authored.twists`，`points` 全程不动；range/firstIndex 取既有 `firstBelow`（暴露根钳位）。**未回归 0.2.120**：`current`/`displayed` 的物化取种子未改，twist 只读 `currentTwists`。
> - **app.js**：`sculptBrushStrengthByTool["sculpt-twist"] = 0.5`；`sculptBrushToolActive()` 谓词列表 += `sculpt-twist`；`sculptGeomDeps` 新增 `curveSurfaceControllerPointRange`。**index.html**：Orient 之后新增工具按钮（`data-tool="sculpt-twist"` + `sculpt-twist-icon` + title/aria-label）。**styles.css**：`.sculpt-twist-icon`（仿 `.sculpt-orient-icon`）。**loc-ja.js / loc-zh.js**：2 条词条（ZH 按既有约定笔刷名保留英文）。
> - **H 模式刻意不复用 `applyHierarchicalRotate`**（app.js L7280-7281 重挂 segment、L7287 绕 pivot 旋转位置 —— 那会改子骨骼位置，正是要避免的）；只传播 twist 标量，沿用 L7299-7302 既有累加约定。硬断言见 tests/twist-brush.test.mjs（H ON 时下游同 delta **且** 位置 deepEqual 不变）。
> - **未加快捷键**（无既有空位；规范要求新快捷键独立分区）。**未改** `placement.js` 状态栏文案（与 slide/scale/push/orient 一致落到通用文案，改动会波及既有笔刷的共享字符串）。
> - **devlog 规范整改**（审计子智能体产出，主进程执行）：`development-standards.md` 修版本号自相矛盾、作废 0.2.118 的「刻意不统一」结论、store 数 15→18、app.js 行数不再写死、注释规则重写、子智能体条目去产品名 + 补失败接手、bump 清单澄清、信任前缀补 node/npm、**新增 4 条根因规范**；`README.md` 修「未实施」误标 + 补 0.2.114–0.2.121 摘要 + store 数；`STATE_MANAGEMENT.md` 17→18 并补 `windState` 行。
> - 回归：Node 全量 284/284（新增 8：twist-brush 7 + dom-contract 1）+ 真实 Sussurro_v1_0060.ahs 130/130；缓存号 20260828-1 + APP_VERSION 0.2.121 冻结同步。

## 最近更新（0.2.120）

> 修笔刷雕刻发尖时发尖跳回原位（分支 DHS/develop，1 Opus 子智能体 + 主进程 merge/自审）：
> - **modules/bones/bone-interaction.js**（`applySubBoneBrushSample`）：种子从 `authored.points`（陈旧绝对空间）改为**物化链** `tip.points`（`splitTipForSegment` → `materializeTipChain`，即视口所画）——L622-639；`twists` 读取改用物化 `currentTwists`（L688 `sculpt-push`、L712-713 `sculpt-orient`）。写回（L747-749：`points = edited` + `restPoints = rest`）**保持不变**且此时才自洽：edited 与 rest 同空间 → 存储 delta = 相对当前 rest 的可见偏移 → 下次渲染 delta 重叠加为恒等。旧代码「陈旧空间取种子 + 新 rest 重基准」会销毁继承 delta，发尖跳回旧位（跳回量 = rest 链位移）。
> - 未改动：`tip-sub-bone.js` 的 `materializeTipChain`、`bone-model.js` 的 remap 函数（姿态继承正确且必要）；`restCurve`（L711 由 `rest` 构建）与 `authored.twists` 写回（L736，twists 无 rest 基准）经核对无需改。
> - 影响面：非 zipper 专属——`splitTipForSegment` 的 rest 由 `tipSurfaceFrameAt` 重建，主链编辑、zipper 位置/高度、面板宽度/厚度/曲率、面板 loop 数（改 mainCount）都会移动 rest，旧代码下首次笔刷描边都会跳。发丝/split 管无笔刷路径（唯一入口 sculpt-geometry.js L549，L604 硬门控 panel），只能拖拽，从不受影响。
> - 回归：Node 全量 276/276（新增 1 测试：继承语义 + 修复后恒等 + 负向对照断言跳回量 −20）+ 真实 Sussurro_v1_0060.ahs 130/130；缓存号 20260827-1 + APP_VERSION 0.2.120 冻结同步。

## 最近更新（0.2.119）

> 发尖骨骼暴露方向取反：多暴露一行（分支 DHS/develop，1 Opus 子智能体 + 主进程 merge/自审/收尾）。0.2.118 的 `round`→`floor` 结构修复保留，但方向反了：
> - **modules/io/usda-export.js**：暴露循环从严格 `t > forkT`（`floor+1`）改为 `firstExposed = clamp(floor(forkT·last), 1, last)`（fork 行本身也暴露）；`splitParentMainIndex` 改 `clamp(floor(forkT·(count−1)) − 1, 0, count−1)`（= `firstExposed − 1`）；`tipChainNearestIndex` 的 `i0` 同步为**同一表达式**（不同步会让蒙皮绑到不存在/差一位的关节——`project-files.js` L753 靠 `index === i0` 区分根关节与 `tip.N`）。
> - **modules/bones/bone-view-handles.js**：引导线 `firstBelow`（L467）与把手可见性 `firstBelowHandle`（L417）`Math.ceil`→`Math.floor`。**modules/bones/bone-interaction.js**：拖拽（L102）与雕刻笔刷（L635）同样改 floor。四处 + 导出共用 `clamp(floor(forkT·last), 1, last)`，视口与导出的暴露行集合现在完全一致。
> - **scripts/verify-skeleton-layout.mjs**（主进程收尾）：`exposedCountFor` helper 改新规则；「split 不得 parent 到 main.0」旧守卫（0.2.106 抓硬挂 main.0 的 bug）在新规则下会误判深 zipper 的正确 `root=0`（Side Left 2 height 0.62 → firstExposed=1/root=0）→ 改为断言 root 由 fork 深度推导且 `< firstExposed`；`forkTFor` 定义提前（const 箭头 TDZ）。**scripts/verify-tip-select.mjs**：L321 缩放中心的 ceil→floor 同步。
> - 保留不动：`tipCaptureWeightAt`（严格 `t > forkT`）—— 它管发尖变形的网格行归属（几何 capture），非骨骼索引。
> - 回归：Node 全量 275/275（更新约 12 处写死索引断言、新增「暴露数比旧规则恰好 +1」方向守卫与「视口 firstBelow === 导出 firstExposed」断言）+ 真实 Sussurro_v1_0060.ahs 130/130；缓存号 20260826-1 + APP_VERSION 0.2.119 冻结同步。

## 最近更新（0.2.118）

> 发尖 WidthCurve 控制点按侧分布（修宽度凹陷）+ 发尖骨骼根部改 floor（分支 DHS/develop，1 Opus 子智能体 + 主进程 merge/自审/收尾）：
> - **modules/geometry/panel-tip-strand.js**：新增 `tipWidthSideControlTs(lock, segmentIndex, splits, side)`（控制位置从**本侧** `tipWidthSideForkT` 分布，替代原公共 `tipWidthCommonForkT` 分布）与 `tipWidthRecordsOppositeFork`（对侧 fork 记录点仅在 ≤ 本侧 fork 时写入）；`tipWidthResetCurve`/`buildTipWidthCurve`/`tipWidthControlPlacement` 三处统一改用按侧位置（`placement` 的 `t < sideForkT` 隐藏守卫降级为安全网）；`buildTipWidthCurve` 新增旧档**重采样迁移**（旧公共 fork 位置的创作数据按新位置采样迁移，不退回全局默认）；`setTipWidthCurveValue` 写入位置吸附到本侧控制网格 + 跳过本侧锁定区（修对称拖拽写出无把手点并在重建时丢失编辑）。`tipWidthCommonForkT` 保留（供浮动面板与段级 fork 使用）。
> - **modules/io/usda-export.js**：新增导出 `splitParentMainIndex(forkT, mainCount)` = `clamp(floor(forkT·(mainCount−1)))`；`splitBoneLayout`/`splitChainLayout` 两处 `parentMainIndex` 从 `Math.round` 改为调用它——原 round 在 `frac > 0.5` 时会把骨骼根跳到自己第一个暴露子节点之上（mainCount=6 时 6 个常见高度中 4 个出错，含当前工程的 0.4375）。
> - **modules/geometry/taper-editor.js**：浮动曲线面板的锁定点规则改按侧 fork（`tipSideForkFor(curveSide)` 走 `deps.tipWidthSideForkT`），否则浅 zipper 侧已可抓的点会被误判为锁定点。
> - **app.js**：seam 导出 `tipWidthSideControlTs`（供 `__ahsTest` 与浏览器校验脚本使用）。
> - **scripts/verify-tip-select.mjs**（主进程收尾）：9 处按公共 fork 推导控制位置全部改按侧；原断言 `rightVisible < leftVisible`（**把凹陷 bug 当预期行为在测**）改为「两侧全部 6 个位置可抓、placement 非 null」的新不变式；浮动面板锁定点断言同步改按侧 fork。
> - 回归：Node 全量 275/275（新增 4 测试：无隐藏活点、Reset 两侧平坦、旧档迁移、floor 根 vs 首个暴露点）+ 真实 Sussurro_v1_0060.ahs 98/98；更新 3 处旧断言（原写死 round 错值）；缓存号 20260825-1 + APP_VERSION 0.2.118 冻结同步。待浏览器验收：视口把手渲染与 verify-tip-select.mjs 本轮未跑浏览器。

## 最近更新（0.2.117）

> zipper 增删的段骨骼重映射 + 新段继承来源姿态（分支 DHS/develop，子智能体中途失败 → 主进程接手完成 + 自审）。根因：`splitBones`/`strandSplitBones` 按**段下标**存储、`normalizeSplitBones` 按 `value[k]` 位置映射，而增删 zipper 会重新划分段，旧代码从不重映射 → 骨骼错位到相邻段：
> - **modules/bones/bone-model.js**：新增纯函数 `remapSegmentBonesOnInsert(bones, insertIndex)`（段一分为二，两半都从来源段深克隆；其后整体后移）、`remapSegmentBonesOnDelete(bones, deleteIndex, {spans, survivorIndex})`（两段合并取 survivor；其后整体前移）、`cloneSegmentBone`（深克隆 `tip`/曲线；`name`/`parentParam` 置 null 交由 normalize 按新段边界重新派生）、`resolveMergeSurvivor`（显式 survivorIndex > 更宽 span > 左段）；新增 `strandSplitDirectionForSegment`（与 `createSplitStrandGeometry` 的 per-section direction 同规则）。
> - **modules/bones/segment-control.js**：新增 `fitSegmentBones`/`segmentSpans`/`hasOrder`/`dropDanglingPanelSplitSelection`/`dropDanglingStrandSplitSelection`；四条增删路径（panel ±/Del、strand ±/Del）统一改为「按段身份重映射骨骼 → 改 splits → materialize 双写 → 清理悬空选择」；`changePanelSplitCount` 的 `+` 改为**优先细分当前选中段**（`selectedPanelSegment`），窄段回退最大间隙。
> - **app.js**：`currentStrandSplitTipChains` 的回退路径改用 `strandSplitForkTForSegment`/`strandSplitDirectionForSegment`（原为单一 `1-strandSplitHeight` + 2 管 `tubeIndex===0?-1:1`，N>1 时叉口与方向都错，且刚加完 zipper 时正好会走到该回退）；bone-model import 补两个 per-segment helper。
> - **scripts/verify-skeleton-layout.mjs**：暴露数断言从写死（「Front Bangs 1 seg0 exposes 2」）改为**按公式从存档现场推导** + 「暴露数随叉口深度单调」交叉校验（用户用新 +/- 编辑存档后段高度改变会误报）。
> - **Bug2 零管线改动**：`materializeTipChain`（tip-sub-bone.js L37-58）本就把 `points[i]-restPoints[i]` delta 重应用到新 rest chain，故 remap 深克隆 `tip` 即让新段继承来源段姿态；删除时保留更宽段 → 合并后的大发尖姿态接近现状。
> - 回归：Node 全量 271/271（新增 4 测试，含插入错位回归 `[0,1,1,2]` vs 旧 `[0,1,2,null]`）+ 真实 Sussurro_v1_0060.ahs 98/98；缓存号 20260824-1 + APP_VERSION 0.2.117 冻结同步。

## 最近更新（0.2.116）

> 普通发丝多拉链移植（panel zipper → strand，分支 DHS/develop，6 阶段并行子智能体 + 主进程 merge/验证；计划 in-progress/strand-zipper-port-plan.md）——普通发丝从单拉链升级为多拉链 `lock.strandSplits=[{position,height,order}]`（N 拉链→N+1 管）：
> - **app.js（Phase A/E）**：新增 `normalizeStrandSplits`/`cloneStrandSplits`/`syncStrandSplitLegacyFields`（`strandSplits[0]` 镜像 legacy 标量，`STRAND_SPLIT_MAX=8`）；load/save/snapshot/mirror 全程 round-trip；legacy `strandSplit*` 标量加载迁移；`syncStrandSplitControls` + `#addStrandSplit`/`#removeStrandSplit` 按钮接线；Del 处理器 `deleteSelectedStrandSplit`；`selectLock`/`deselectStrands` 清 `strandSplitSelection`；mirror rebuild 触发新增 strand 手柄数校验。
> - **modules/geometry/strand-geometry.js（Phase B）**：`clipStrandProfileBand`（半平面裁剪串联，±Infinity 跳过）；`createSplitStrandGeometry` sections 数组驱动 N+1 段、per-section direction/`sectionSplitStart`、`colToSection` N 段化。N=1 逐字节等价。
> - **modules/io/uv-unfold.js（Phase C）**：零改动（split 分支本就按 `splitSections.length` 泛化）；tests/uv-unfold.test.mjs 补 3 管回归。
> - **modules/bones/bone-model.js + modules/io/usda-export.js + project-files.js（Phase D）**：`strandSplitBonesFor`/`FromData` 2→N+1 + `strandSplitsFor`/`strandSplitForkTForSegment`；USDA `splitBoneLayout`/`splitChainLayout` 发丝分支 per-tube fork/direction（与几何逐值对齐）。
> - **modules/bones/segment-control.js + bone-view-handles.js + bone-interaction.js（Phase E）**：`changeStrandSplitCount`（最大 order 删、min-sep 0.12、≥1 拉链）/`deleteSelectedStrandSplit`；单手柄→数组 + 选中高亮；拖拽写 `strandSplits[i]` + 点击选中。
> - **modules/geometry/branch-bridge.js（Phase F）**：split 父发片 `splitSections.length>2` 时 `branchRootRegionSurface` 返回 null / `applyBranchRootRegionCarving` 跳过（子发片回退直接生成）。
> - **modules/edit/sculpt-edit-store.js**：新增 `strandSplitSelection`。**modules/data/loc-zh.js / loc-ja.js**：新增 4 词条（Zipper Controls / Add·Remove a strand zipper control / 说明）。
> - 回归：Node 全量 267/267（缓存号 20260823-1 + APP_VERSION 0.2.116 冻结同步）+ 真实 Sussurro_v1_0060.ahs 骨骼导出 verify-skeleton-layout 82/82；N=1 全程逐字节/逐值等价。

## 最近更新（0.2.115）

> Panel zipper 创建序号 + 可选中 Del 删除（分支 DHS/develop，1 子智能体编码 + 主进程 merge/验证）：
> - **app.js**：`normalizePanelSplits`（~L1525）为每个 `panelSplits` 条目补 `order` 整数（保留既有值；旧存档缺失用数组索引回退；重复按 (order,原索引) 重排）；`panelCreationDefaults.panelSplits` 两默认条目加 `order:0/1`；Delete 键处理（~L18568）在 `deleteCurrentSelection()` 前先 `if (segmentApi.deleteSelectedPanelSplit()) return;`；`selectLock`（换 lock）/`deselectStrands` 清 `panelSplitSelection`。数组仍按 position 排序供几何消费。
> - **modules/edit/sculpt-edit-store.js**：sculptState 新增 `panelSplitSelection: null`。
> - **modules/bones/segment-control.js**：`changePanelSplitCount` 的 `+` 分配 `order=max+1`、`-` 改删 order 最大者（最近创建）而非 `splits.pop()`（原删最右 position）；新增 `deleteSelectedPanelSplit()`（按选中 order splice + 沿用同一重建路径，返回 true/false）暴露到 api。
> - **modules/bones/bone-interaction.js**：`beginPanelSplitHandleDrag` 中 kind==="panel" 且命中普通 zipper 手柄时写 `panelSplitSelection={lockId,order}`（点击即选中；拖拽不删除）。
> - **modules/bones/bone-view-handles.js**：选中的 zipper 手柄（按 order 匹配）放大 1.3× + opacity 1，其余复位 0.68/1。
> - 回归：Node 全量 261/261（dom-contract 缓存号 20260822-1 + APP_VERSION 0.2.115 冻结断言同步）。普通发丝多 zipper 移植计划见 in-progress/strand-zipper-port-plan.md。

## 最近更新（2026-08-17）

> 桥接 USDA family 融合、split capture 与 Wind Preview 间距收尾：
> - `modules/io/bridge-export.js` + `project-files.js`：UV 展开后按 `sourceIndices`/`bridgeBoundaryParentIndices` 融合完整父→子→孙 family 的同位 bridge boundary position；UV 维持 faceVarying 独立 indices。洞边界严格继承父 capture，桥内部用固定端点调和/Laplacian 权重场，固定四影响并归一；不对 fused position 额外做 Uniform Smooth。桥接子 `main.0` parent 到父对应 `main.k`。
> - `modules/geometry/panel-tip-strand.js` / `strand-geometry.js` / `tip-sub-bone.js`：panel 与普通 split fork 以下 capture 严格归 tip/split、主链为 0；渲染几何保留连续过渡。普通 split 的 rest chain/视口 handle 改同源于实际 swept tube center，保存的 tip delta 重映射保留。
> - `styles.css`：Wind Preview 浮窗滑杆 label 间距与主 `.sliders` 对齐。
> - 回归：`bridge-export.test.mjs`、`split-tip-geometry.test.mjs`、既有 USDA/UV 测试；Node 全量 261/261 通过。

## 最近更新（0.2.113）

> 吹风预览 UI 浮动窗口化 + seed/StrandRandom 卡死 bug 修复（分支 DHS/develop，3 子智能体并行 + 主进程 merge；详见 annotations-adapt.md 吹风条目 + bug-fixes.md #11 + wind-preview-plan.md §0.2）：
> - **UI**：`index.html`——Preview 菜单 `#toggleWindPreview` 改非 toggle 普通按钮（去 aria-pressed 与 `#windPreviewMenuState` span）；删除 strands 组 `#windPreviewPanel`；新增浮动窗口 `<dialog id="windPreviewWindow">`（`#windPreviewDragHandle` 头部 + `#windPreviewEnableButton`（aria-pressed + `#windPreviewEnableState`）+ `#windPlayPauseButton` + `#windPreviewCloseButton` + 10 滑杆（id 不变））。`styles.css` 新增 `.wind-preview-window`/`.wind-preview-head`/`.wind-preview-head-actions`/`.wind-preview-body`（uvInspectorWindow 模式，滑杆复用 `.topology-control`/`.slider-value`）。词典无新增 key（全复用既有）。
> - **app.js**：DOM 查询换新元素；`setWindPreviewActive` 同步启用按钮 + 启用时自动 `windPreviewWindow.show()`；菜单按钮=窗口开关（关闭窗口=停预览）；启用/关闭按钮接线；窗口拖拽（模块级 `windPreviewDrag`，uvInspector 同款，不入 store）；菜单点击排除只保留 `#toggleTurntable`；**bug 修复**（滑杆 input 处理器）：seed/strandRandom 变更且预览激活时改「先逐位恢复 → 删缓存 → 重建 → `windPreviewTick(0)`」（原只删缓存不重建 → 冻结/不恢复/再次开启进一步弯曲）。
> - **scripts/verify-wind-preview.mjs**：UI 段重写（菜单开窗不自动启用 → 启用开关 → seed 回归 3 断言 → 关闭逐位恢复 rest）。
> - 回归：单测 257/257（dom-contract 105/105；缓存号 `20260821-1` 与 APP_VERSION 0.2.113 冻结断言同步）、端到端 15/15。

## 最近更新（0.2.80）

> 两个 bug 修复（分支 0.2.69-bugfix 续用，并行 Codex 子智能体 + 主管合并；headless 复现脚本 scripts/repro-0045-bugs.mjs）：
> - **发尖宽度控制点「死区」修复**：`modules/geometry/panel-tip-strand.js` 的 `tipWidthMultiplierAt`——fork 守卫原先用绝对 u 符号（`u < 0 ? -1 : 1`）选侧 zipper，而曲线采样用段内相对归一化坐标 `(u − centerU) / halfSpan`（左半段采 secondary、右半段采 primary），两者对「段内左右半」判定不一致：不跨 0 的段（边界全在半轴一侧）整段被绝对符号判成同一侧，守卫取到另一侧 zipper 的 fork → t ∈ [本侧 fork, 另一侧 fork) 的拖拽写入了 bone 曲线但几何永远走「回退全局曲线」分支（死区）→ 用户现象「右侧曲线面板在动、发丝没动、只有这个发尖有问题」。修复：centerU/halfSpan 提到 fork 判断之前，side 改段内相对符号 `(u - centerU) < 0 ? -1 : 1`；跨 0 的段仅在段中心细条内翻转（语义更正确）。回归：函数级断言 mR 1.192→2.0（右半段采样新值）、mL 不变（左半段 t<0.75 保持锁定区全局值）。
> - **USDA/OBJ 导出 panel zipper 缝被填**：panel 网格 grid 列号在段边界重叠（colBase 累加未预留边界列 → 相邻两段的边界列共用同一 (row,col) 格子，Front Bangs 1 实测 42 个重复 cell）→ `unfoldHairMesh`（kind "open"）按格子槽位重映射时把缝两侧的独立边界链坍缩到同一槽位 → 导出面桥接对侧顶点、缝被填（点位置不变；旧导出无 grid primvar 走原始回退所以正常）。修复：① `createPanelStrandGeometry` 的 addPatch `colBase` 累加改 `sum + count + 1`（每段边界预留 1 列，C=46→54 恰为每行顶点数，格子唯一）；② `weldPanelGeometryData` 的 weld key 加入 gridRow/gridCol（fork 以上位置重合但格子不同的顶点不再被焊掉）。回归：P0 dupCell=0 / 重映射 1:1 / 逐面边集与视口一致。
> - **缓存号全量刷新**：87 条过期 import `?v=` 统一 bump 到 `20260814-12`（含 index.html app.js/styles.css 入口），消除浏览器旧模块缓存导致的「用户行为与当前代码不一致」类问题；新增 `scripts/check-stale-cache-params.mjs` 审计脚本。
> - 回归：core-math 118/118、uv-unfold tests 全绿、headless repro 22/24（2 项为指针合成事件抖动、由函数级断言覆盖）、verify-smoke 11/11。

## 最近更新（0.2.79）

> 导出拆 UV 收尾（分支 0.2.69-bugfix，0.2.69–0.2.79，规则/理念/踩坑全集见 [uv-unfold.md](uv-unfold.md)）：
> - 新增 `modules/io/uv-unfold.js`（纯函数展开核心）+ `modules/io/project-files.js` 接线（`buildUnfoldedMeshes` 两遍：父弧长表 + 展开）+ `modules/geometry/branch-bridge.js` 桥接 UV 锚点（`{ring,hole,t,band}`）+ 各几何类型 `gridRowIndices/gridColIndices` 写入 + `tests/uv-unfold.test.mjs` 回归。
> - 最终规则：普通发丝第一列切开、弧长 U、seam 双副本不丢面；split 管局部列+全局偏移、两管 U 轴排列不重叠；子发片切缝在背面、U 拓扑对齐缩放（环顶面弧长↔洞顶 u 跨度）、V 洞底对齐+扫掠下移、桥接 top/side/bottom 统一向洞插值 + 中线竖缝双副本。
> - 9 条踩坑（wrap quad 丢弃→poly 缺失、split x=0 共享点→父表 null、横缝切乱取消、bottom 自然展开冲突→意外 seam、刚性倍率→拓扑对齐等）记录在 uv-unfold.md §7。

## 最近更新（0.2.68）

> Sweep 切线后处理平滑（按曲率）+ 平滑参数镜像对称同步（分支 codex/0.2.68-sweep-tangent-mirror，0.2.66/0.2.67 跟进）：
> - **切线后处理 smooth**：`curve-math.js` 新增 `smoothSweepFrames(frames, heat, { strength, iterations, pinRows })`——按曲率热度 heat 对每环 frame 的切线方向（y）做 Jacobi 混合（`normalize(y + strength·heat·((y_prev+y_next)/2 − y))`），再把 z 投影到垂直新切线的平面、`x = y × z` 重新正交化，环朝向在弯折处渐变（脊柱中心线不动）。接入 `strand-sweep.js` `sweepSide` + `createSplitStrandGeometry`（已有 frames 数组）+ `createHairCardGeometry`（改为先预收集 frames 再平滑，链式 previousFrame 与原循环一致）；根/尖端行 pin 住（根 cap、尖端 cap、子发片桥接锚点朝向不变）。
> - **参数**：`lock.sweepTangentSmooth`（0–1，默认 0.3，`SWEEP_OVERLAP_DEFAULTS.tangentSmooth` 单源）；`#sweepOverlapPanel` 第 5 个滑块 Sweep Tangent Smooth + hairStore 默认 + ZH/JA 各 +1 key；`tangentSmooth=0` 时输出逐位一致。
> - **镜像对称同步**：5 个平滑参数（sweepOverlapStrength / sweepOverlapThreshold / sweepEdgeSmooth / sweepOverlapFalloff / sweepTangentSmooth）加入镜像系统——`createMirrorPartner` 创建时透传 + `syncMirrorPartnerFromLock` 字段复制表 clamp 复制（Side Bangs Left 1 ↔ Right 1 现在会同步）；5 个滑块监听器在写 lock 后调用 `syncActiveMirror(lock, { deferGeometry: false })`（照 panelSegmentSpread 现成模式）。
> - 回归：core-math 118 pass（+2 新单测）、verify-smoke 10/11=基线。

## 最近更新（0.2.67）

> Sweep 收窄系数沿脊柱扩散（falloff），修复急弯过渡硬跳变/缺口（分支 codex/0.2.67-sweep-falloff，0.2.66 跟进）：
> - **问题**：0.2.66 的曲率收窄只处理超过阈值的环，弯折处被收窄环与相邻“主曲率较平滑”的未收窄环之间宽度硬跳变 → 突兀 + 过渡 quad 可能产生新缺口。
> - **方案（后处理传播）**：`curve-math.js` `sweepCurvatureResponse` 新增 `falloff` 选项（默认 0=旧行为；`strand-sweep.js` `SWEEP_OVERLAP_DEFAULTS.falloff=3`）。算出 factors/heat 后沿脊柱做三角加权扩散（window=min(floor(falloff), count−1)，w=1−|i−j|/(window+1)），端点钉死 factors=1 / heat=0；`falloff=0` 时输出逐位一致。
> - **接入**：`strand-sweep.js` `sweepSide` + `strand-geometry.js` `createSplitStrandGeometry` / `createHairCardGeometry` 读取 `lock.sweepOverlapFalloff`（0–8 整数，默认 3）并传入。
> - **UI**：`#sweepOverlapPanel` 新增第 4 个滑块 Sweep Overlap Falloff（0–8，默认 3）；hairStore 默认 + ZH/JA 各 +1 key。
> - 回归：core-math 116 pass（+2 新单测）、verify-smoke 10/11=基线。

## 最近更新（0.2.66）

> Sweep 转角过大修复：曲率感知环收窄（防自相交/穿插）+ 转角边缘平滑（分支 codex/0.2.66-sweep-corner-smooth，实施依据 devlog/in-progress/delta-mush-plan.md 主任务）：
> - **曲率感知环收窄**：`modules/geometry/curve-math.js` 新增纯函数 `sweepCurvatureResponse(centers, radii, { strength, safety, minScale })`（相邻三点外接圆半径作局部曲率半径 ρ，factor = max(minScale, 1 − (1 − min(1, safety·ρ/r))·strength)，返回 `{ factors, heat }`，heat 为与 strength 无关的曲率热度）。依据 Elber 1997 / Maekawa 1999 判据（偏置距离 > 曲率半径即自相交），业界惯例 scale = min(1, safety·ρ/r)。
> - **接入点**：`strand-sweep.js` `sweepSide`（普通发丝 + 子发片共用内核）+ `strand-geometry.js` `createSplitStrandGeometry` / `createHairCardGeometry`（独立手写环循环同步接入）。脊柱点不动，仅环剖面按曲率收窄。
> - **边缘平滑**：`curve-math.js` 新增 `smoothSweepChains(vertices, rowCount, columnCount, { strength, iterations, weights, pinRows })`（纵向链 Jacobi Laplacian，按 heat 加权、根环 pinned）；三个 sweep 构建器顶点产出后各跑一遍（iterations=2）。
> - **复用/抽取**：`branch-bridge.js` 内联的桥接均匀平滑（Laplacian）抽成新模块 `modules/geometry/mesh-smooth.js` 的 `smoothMeshVertices(vertices, quads, movable, strength, iterations, positionAt)`，branch-bridge 改调用（860 次随机对照逐位一致）。
> - **UI**：新增 `#sweepOverlapPanel`（strands 组，位于 #branchBridgePanel 之后）3 个滑块：Sweep Overlap Strength（0–1，默认 0.7）/ Sweep Overlap Threshold（0.1–2，默认 0.6）/ Sweep Edge Smooth（0–1，默认 0.3）；per-lock 字段随 .ahs 自动持久化；无选中写 hairState 全局默认；ZH/JA 词典各 +3 key。
> - **默认参数**：`SWEEP_OVERLAP_DEFAULTS` 由 `strand-sweep.js` 导出（单源），UI 与几何共用；strength/edgeSmooth 关到 0 时输出与改动前逐位一致。
> - 回归：core-math 114 pass（+2 新单测）、verify-smoke 10/11=基线、dom-contract 16/89 不变。

## 最近更新（0.2.65）

> 发尖控件 4 项修复（分支 0.2.64-panel-tip-curve，详见 [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md) §8.29）：
> - ① 绿色 spread 手柄视口拖拽热同步 Main 面板 Segment Spread（`updatePanelSplitHandleDrag` segment 分支补 `syncPanelSegmentControls`）；
> - ② 所有段绿色手柄在任一子发尖选中时显示、拖非选中段不切换选中——有意设计，`bone-view-handles.js` 补注释规范化；
> - ③ 绿色手柄位置改跟随 tip trim/curve（`tipSurfaceFrameAt`）+ 沿切线外推 `TIP_SEGMENT_HANDLE_TANGENT_OFFSET=0.08`，不再浮在未 trim 尖端；
> - ④ W 移动 gizmo 可挂发尖子骨骼（gizmo 挂载扩为 move/rotate/scale），translate 用 `solvePulledStrand` 按 fork 以下暴露区整体求解（`beginTipSubBoneTranslate` / `applyTipSubBoneTransform` translate 分支），app.js `dragging-changed` 支持 translate。
> - ⑤ 修复两个遗留问题：W 移动 gizmo 拖点不生效（`beginTipSubBoneTranslate` 漏导出，`bonesApi.beginTipSubBoneTranslate` 为 undefined → translate 分支提前 return）；绿色手柄叠加 authored delta（`points[last]−restPoints[last]`），跟随用户修改的发尖位置（详见 §8.30）。
> - ⑥ 快捷键修复：数字/日期等可键入数值的输入框不再被 1/2/3（workspace）与 q/w/e（工具）快捷键抢占——`focusedControlShouldYieldToShortcut` 把 number/date/datetime-local/time/month/week 视为文本输入（core-math 契约测试同断言）。

## 最近更新（0.2.59）

> Panel split 尖端子骨骼系统已落地 + 本轮 UI/交互收尾（详细记录见 [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md) §8.5–§8.9，权威当前状态）：
> - 已实现：程序化权重字段（panelWeights）+ `splitBone.tip` 链 + 每段 tip 手柄/高亮 + USDA SkelBindingAPI 蒙皮 + `bonesFor` 只读骨骼视图 + `lock.bones` registry 双写；§8.6–§8.8 修复：点击 toggle 选中 + 保持主发丝、overlay z-fighting、双段高亮、笔刷保留 tip UI、边界段 tip 链、orient/scale 统一变换、undo tip 持久化、笔刷 bones-only、alt+点击切换。
> - 本轮（0.2.59 进行中）：发丝悬停改柔和橙色高亮（hoverOutline）、切换主选中清旧 tip 选中/高亮、alt+点击仅真点击触发、tip 子骨骼完整切线/副切线/法线帧（orient 旋转几何）、修复选中发尖后 Push 笔刷。
> - 8.19（0.2.59 进行中）：发尖 WidthCurve 修复——① `tipWidthEdgePosition` 的 `lateral` 改用发尖自己 authored 宽度轴（dq*主帧x）并把 baseEdge 提到前表面 shell=1，消除拖拽方向 7°~170° 倾斜的「梯形」手感；② `sampleAsymmetricTaperCurve`（modules/geometry/curve-math.js）由 u<0 硬切分改为线性插值（u=0=左右均值，主面板/strand 非对称一致受益）；③ 拖拽去重（begin 只 materialize 一次并复用 `tipWidthBones`、`setTipWidthCurveValue` 只重建编辑侧曲线）。详见 in-progress/panel-split-tip-bones.md §8.19。
> - 8.20（0.2.59 进行中）：发尖 WidthCurve 拖拽方向真正根因修复——旧实现复用主面板宽度采样（绝对 u、以主中心 u=0 分界），宽度变化沿 `frame.x×edgeU + frame.z×camber(edgeU)` 移动（左半段反向、窄段 camber 主导）→ 手柄沿主骨骼线运动。改造为 tip-relative：几何/UI 的段宽度以段中心为参考（`(u-centerU)×半宽 + centerU×全局半宽` 对齐），camber 固定全局曲线（宽度只改横向）；`splitTipForSegment` rest 链改用全局曲线（稳定基准）；`buildTipWidthCurve` 不再烘焙锁定区网格（采样回退全局），曲线每侧 7 点且全可见；拖拽轴 = `dq×主帧x`。实测全部段/侧 maxAngle=0°。详见 §8.20。
> - 8.21（0.2.59 进行中）：体验优化 4 项——① tip 端 t=1 绿色控制点暴露（`tipWidthControlTs` 6 个位置、手柄数 +1）；② Segment Spread 0–1 + 线性聚合（SPREAD_MAX/slider/clamp 全改 1，`segmentRamp` smoothstep→线性）；③ 调 spread 绿点/曲线跟随几何（共享 `tipWidthSpreadGap`，几何 uStart/uEnd 与 `tipWidthEdgePosition` 同用，不缩放）；④ 两侧等距分布基于最深 zipper（`tipWidthCommonForkT`），短侧低于本侧 fork 的控制隐藏但数据保留，zipper 上拉重新暴露。详见 §8.21。
> - 8.22（0.2.59 进行中）：发尖 WidthCurve 浮动面板 4 项修复——① 视口拖拽后浮动面板同步刷新（tipWidth 拖拽分支调用 `renderTaperCurveEditor`）；② Reset 预设改为全 1（`tipWidthResetCurve`，segment 宽度曲线）；③ Asymmetric 混合改为窄带（`sampleAsymmetricTaperCurve` 加可选 `blendZone`，发尖传 0.25，外侧纯本侧曲线不再带动另一侧）；④ 非对称改为 Ctrl 触发（默认等比对称写两侧、Ctrl 只写一侧；`beginPanelSplitHandleDrag` 允许 tipWidth 手柄带 Ctrl；segment 编辑器隐藏 Asymmetric/Center 开关 + 小字 Ctrl 提示）。详见 §8.22。
> - 8.23（0.2.59 进行中）：5 项深入修复——① Reset 整段全 1（同时重置两侧、`tipWidthResetCurve` 覆盖 [0,1]、`tipWidthMultiplierAt` 曲线从 0 开始时不回退全局、`buildTipWidthCurve` 保留 0 点）；② 对称拖拽两侧直接写同一值（不再按起始比例，消除 2x/延迟）；③ 视口拖拽后右侧 `segmentTaperPreview`（syncPanelSegmentControls）+ 浮动面板都热更新；④ 宽度移动方向改为与发尖子骨骼自身法线垂直（新增 `tipChainFrameAt`，lateral/把手位置用链横向），旋转模式加法线向上箭头；⑤ rotate/scale 工具下 tip 子骨骼手柄挂到 transform gizmo（`beginTipSubBoneRotate`/`applyTipSubBoneTransform`），select/move 保持拖拽。详见 §8.23。
> - 8.24（0.2.59 进行中）：① 鼠标在浮动面板上不再触发头发/发尖高亮（`pointerOverTaperEditor` 守卫）；② 回退 coversWhole——Reset 后未暴露控制区（Zipper 上半部分）始终跟随主骨骼全局宽度，不再开裂；③ 发尖子骨骼 orient 跟随主发片表面曲率（新增 `tipSurfaceFrameAt`，rest 链改用表面帧；tip 点是 rest+delta，rest 生成修正后旧 .ahs 数据自动用新基准）；④ 浮动面板 segment 曲线点可拖动（`activeTaperTarget` 复用 live lock.splitBones）且只允许拖动暴露点（`data-tip-hidden` 拦截）。详见 §8.24。
> - 8.25（0.2.59 进行中）：最边缘段 Segment Spread 自动镜像——`tipWidthSpreadGap` 对无 zipper 的外侧取对侧 zipper（同一 bone.spread/ramp 起点），几何 `uStart/uEnd` 守卫改 `(leftSplit || rightSplit)`，两侧一致收窄、无 UI 展示。详见 §8.25。
> - 8.26（0.2.59 进行中）：① Segment Spread 上限 0-0.99（`SPREAD_MAX`、slider、clamp、`tipWidthSpreadGap` 兜底，防退化面）；② 发尖蒙皮权重改为每侧 zipper 顶为 0 边界、段内 u 线性插值成斜线（新增 `tipSegmentWeightAt`，scale 笔刷不再裂一边）；③ 旋转 gizmo 起始朝向对齐发尖链自身 frame（`updateCurveObjects` 设 tip 手柄 quaternion，拖拽中保留），不再一拖跳回主骨骼朝向。详见 §8.26。

## 最近更新（0.2.54–0.2.56）

> 三片大刘海（Front Bangs）视口/线框三角面观感修复（几何与导出始终是四边面，均为显示层问题）：
> - 0.2.54：刘海（split 父发片）挖洞后未同步裁剪 `triangleEdgeMasks`，线框按错位 mask 描对角线 → 挖洞重建后同步裁剪（maskLen==三角形数）。
> - 0.2.55：面板 Split 开口处退化/反射折叠 quad（零面积 / 二面角 179–180°）导致视口着色三角观感 → `createPanelStrandGeometry` 的 `addQuad` 跳过退化与折叠 quad（含排查记录）。
> - 0.2.56：`createPanelStrandGeometry` 结尾绕序翻转未同步交换 `triangleEdgeMasks`，mask 错位导致所有 panel 线框画对角线 → 翻转后同步交换 mask [1]/[2]。
> 详细条目见各子系统文件，时间线见 local-adaptation-log.md。

## 条目文件

- [annotations-bridge.md](annotations-bridge.md) —— 子发片桥接几何 / 父发片挖洞（2.2、2.4a→2.4t、0.2.43–0.2.44 等）
- [annotations-region-panel.md](annotations-region-panel.md) —— Region 选区 / 面板（2.1、2.4u–2.4w、0.2.40–0.2.47、0.2.52–0.2.53 等）
- [annotations-root-bone.md](annotations-root-bone.md) —— 根骨骼 gizmo / twist / H 模式（Phase 2.15–2.16、0.2.23–0.2.42 等）
- [annotations-split.md](annotations-split.md) —— split 父发片兼容（0.2.49–0.2.51）
- [annotations-display-fixes.md](annotations-display-fixes.md) —— 刘海 / 面板线框三角面显示修复（0.2.54–0.2.56）
- [annotations-adapt.md](annotations-adapt.md) —— 日常适配（保存/导出、语言、导航、笔刷、拖放、材质、main 合并 0.2.48、server.js、Local 选项移除、快捷键等）

> 详细条目见各子系统文件，时间线见 local-adaptation-log.md。

