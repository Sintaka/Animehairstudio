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
| Panel Split 骨骼化 / 尖端子骨骼 / 统一骨骼模型 / 子发片扫掠 | `lock.splitBones` / `bonesFor` / `sweepStrandGeometry` / `createPanelStrandGeometry` / `createBranchChildGeometry` | 0.2.59 已实施（P1/P2 与 Phase A/B/C 落地）；**发尖子系统的当前状态见 0.2.123/0.2.125/0.2.126 三轮条目**，panel-split-tip-bones.md 只到 0.2.65 | [archive/panel-split-tip-bones.md](archive/panel-split-tip-bones.md)（**历史实施记录，止于 0.2.65** §8.5–§8.30）+ [archive/strand-tip-selection-port-plan.md](archive/strand-tip-selection-port-plan.md)（0.2.126 选中系统）+ [archive/strand-tip-width-ui-port-plan.md](archive/strand-tip-width-ui-port-plan.md)（0.2.125 WidthCurve）+ [archive/bone-system-roadmap.md](archive/bone-system-roadmap.md) + [archive/split-bone-refactor-plan.md](archive/split-bone-refactor-plan.md) + [archive/unified-bone-model.md](archive/unified-bone-model.md) + [archive/child-sweep-unification.md](archive/child-sweep-unification.md) |
| **导出拆 UV（0.2.69–0.2.79）** | `unfoldHairMesh` / `gridUvTable` / `gridUvAt` / `childUTopologyScale` / `buildUnfoldedMeshes` / `bridgeUvAnchors` / `bridgeSeamCol` / `gridRowIndices` | 0.2.69–0.2.79（规则/理念/9 条踩坑见右） | [uv-unfold.md](uv-unfold.md) |

> 新 agent 先读 `devlog/AGENT_QUICKSTART.md`；本文档只作索引，不要全文顺序读。

## 最近更新（0.2.148：Conform 回归修复 + Tip Clump 全局曲线回退 + zipper 加号联动 + Width Brush 调研）

> 三个 bug 修复 + 一处未实施的调研，详见 `devlog/bug-fixes.md` #27–#29。本条目只记录改了哪些文件、
> 怎么改，决策理由与实测数字见 bug-fixes.md。

- **`modules/geometry/panel-tip-strand.js`**（bug①②，130 行新增）：
  - `tipSurfaceFrameAt` 签名增加**可选**形参 `bone = null`（原签名 `(lock, t, centerU, segmentIndex, splits)`），
    内部三处 `tipMainSectionPoint(...)` 调用把硬编码的 `null` 换成 `bone`（bug②）。上方补 12 行契约注释，
    说明另两个调用点（`tipChainFrameAt`、`splitTipForSegment` 的 `restPointAt`）为什么**绝不能**传 bone。
  - 新增 `tipChainReanchorAt(lock, segmentIndex, splits, bone, t)`：取 `bone.tip` 的 rest→authored 变换
    （四元数 + twist 滚转 + 两个中心点），无 authored 链或 `active:false` 返回 null。与
    `strand-tip-width.js` 的 `strandTipChainTransformAt`（0.2.127）成对同构。
  - 新增 `applyTipChainReanchor(transform, reference, worldPoint, blend)`：按上面的变换把一个已 conform
    的世界点搬到 authored 空间，`blend<=0` 或 `transform` 为 null 时原样返回。
  - 新增 `panelRowParameters(lock)` / `panelLengthLoopCount(lock)`：把 `createPanelStrandGeometry` 里内联
    的行参数表推导（`panelTipLoopParameters(baseLengthLoops, tipLoops)`，钳位 `[3,32]`/`[0,16]`）收成唯一
    定义点，`createPanelStrandGeometry` 改为调用它（原三行内联删除）。
  - 新增 `tipWidthEdgeRenderPoint(lock, segmentIndex, splits, bone, side, t)`：绿色 WidthCurve 手柄渲染坐标
    的唯一定义点——先 `tipMainSectionPoint`（conform）再 `tipChainReanchorAt`/`applyTipChainReanchor`
    （链再锚定，bug①）。`blend` 与 `reference` 都与网格同源（`panelLengthLoopCount` + 段中心点）。
  - deps 导出新增 4 个：`tipWidthEdgeRenderPoint`、`tipChainReanchorAt`、`applyTipChainReanchor`、
    `panelLengthLoopCount`。
- **`modules/bones/bone-view-handles.js`**（11 行改 / 7 行删）：
  - `panelTipClumpHandlePoint` 调 `tipSurfaceFrameAt` 时补上第 6 个参数 `bone`（bug②）。
  - `updateBoneViewHandles` 内联的 `panelWidthEdgeRenderPoint`（原 6d4e9b0 引入的公式，只做 conform 不做
    链再锚定）改为直接调用 `deps.panelTipStrand.tipWidthEdgeRenderPoint(...)`（bug①），公式本体从此文件
    移进 `panel-tip-strand.js`，此处只调用不复制。
- **`modules/bones/segment-control.js`**（23 行新增 / 1 行改，bug③）：`changePanelSplitCount` 的 `+`
  分支在既有 `selectionUsable ? selectedIndex : largestGapIndex` 之前插入一级：读
  `deps.sculptState.panelSplitSelection`，`lockId` 匹配时按 `order` 反查 splits 下标 `j`，可用则
  `insertIndex = j + 1`；不可用（lockId 不符 / order 查不到 / 该段放不下）静默回落到原有两级链。
- **版本号三件套**：`APP_VERSION` → `0.1.5-Sintaka.0.2.148`；`index.html` 两处入口缓存号
  `20260910-11` → `20260910-12`；`tests/dom-contract.test.mjs` 5 处冻结断言同步（4 处缓存号 + 1 处
  APP_VERSION 字面量）。
- **测试**：`tests/panel-scalp-conform.test.mjs` +397 行 / 6 条（bug①×3 含惰性、bug②×3 含源码契约）；
  `tests/strand-segment-ui.test.mjs` +158 行 / 3 条（bug③正向 / 回落逐位相同 / `panelSegmentIndex` 不变量）。
- 回归：全量 **410/410**。实测数字、判据踩坑（两次误报分母、容差 2e-3 的成因、契约断言大小写漏网）
  见 `devlog/bug-fixes.md` #27–#29。

### 调研（未实施，供下一轮）：Width Brush 的「紫色 WidthCurve」是哪套数据

> 用户想要一个沿链扫过的 Width 笔刷，效果类似发尖绿色 WidthCurve 控制点，但作用于普通发丝/panel 的
> 整体宽度曲线（非发尖）。本轮只调研数据结构与可行性，**未写任何代码**。

用户原话逐字：「我本意是像刷 WidthCurve 而不涉及那个整体的宽度调节，对应发尖的是绿色的 WidthCurve
控制点和线，对应普通发丝和 panel 就是紫色的 WidthCurve 和控制点而不是控制整体的 Width 属性」

- 绿 `0x5df0a8` = 发尖 WidthCurve 控制点/线，写 `bone.taperCurve`/`taperCurveSecondary`（段骨骼）。
  **用户的绿色对应关系成立。**
- 「紫色」实为两种易混的品红，按证据判断用户指的是后者：
  - `0xff42cf` = **zipper 分裂点手柄**，写 `lock.panelSplits`/`strandSplits`，**不是曲线**。
  - `0xe62bea` = **taperMeshPoints**，即 `lock.taperCurve`/`taperCurveSecondary` 在 3D 视口的可拖拽
    叠加，**默认隐藏**，需勾 `#moveWidthCurveControls` 或打开曲线编辑器才出现。
- panel 与发丝的整体 taperCurve 是**两套独立实现**，只共享最底层纯函数 `sampleAsymmetricTaperCurve`
  （`curve-math.js`）；这与绿色发尖曲线**相反**（那套刻意抽了共享中间层）。
- 点数规则也相反：紫色是**自由格式关键点数组**（最少 2 点，可任意增删，两侧独立、点数可不同）；
  绿色是固定网格、共享索引、按侧暴露子集。
- **可行性困难（下一轮必须先解决）**：笔刷是沿链稠密扫过，紫色曲线是稀疏自由关键点且一点移动会经
  插值影响相邻大段，需要「曲线 → 稠密采样 → 笔刷编辑 → 重新拟合关键点」的转换层，这是当前完全没有
  的能力。且紫色 taperCurve 同时存在于 lock 全局 / strand group 默认 / segment 骨骼**三个层级**，笔刷
  该写哪层有歧义（绿色不存在此歧义）。
- 用户已拍板的其它决策点（供下一轮实施时直接采用，不必重新确认）：反向增大宽度用 **Ctrl**（沿用既有
  `reverse = Boolean(event.ctrlKey)`）；W/E/R 的 Shift 平滑**本轮不做**，原话「Smooth 默认行为保持
  不变在兼容的情况下直接加入几个笔刷的特殊支持即可」。

## 最近更新（File > New，0.2.134）

> **左上角 File 菜单新增 New**（main 无此项）。做法是**复用 `restoreState`**，不另写清空路径。
>
> - **app.js `startNewProject()`**（紧邻 `restoreState`）：`restoreState` 已是「整场景换掉」的唯一
>   入口（打开项目 / undo / redo 都走它），其 `resetEditableSceneForStateRestore` 内部已处理吹风预览
>   互斥 + `disposeAllEditableObjects` + 清 `locks`/`selectionSets`/`guides` —— 那里的注释**早已把
>   "new project" 列为该路径的既定用例之一**，本轮只是把它真正接上。
> - **基准 = boot 时抓的 `snapshotState()`**，存在 `projectState.pristineProjectSnapshot`。两个要点：
>   ① **必须抓在 `offerRecoverySnapshot()` 之前** —— 恢复流程会把上次崩溃的场景灌进来，抓晚了基准
>   就变成「上次的项目」；② **存 JSON 字符串而非对象** —— `restoreState` 会就地消费还原出的集合
>   （`locks` 被 `restoreLock` 吃掉），留同一份对象引用会让**第二次 New** 拿到已污染的基准。于是 New
>   与「刚打开应用」逐字段一致，不必另外维护一份「空项目」定义（那必然与 boot 漂移）。
> - **头模 / 头皮引导资产不在 `snapshotState()` 里**（随 .ahs 的 `headAsset`/`scalpGuideAsset` 单独
>   走），必须显式复位，否则 New 之后仍留着上一个项目的自定义头模。两段与 `openHairProjectFile`
>   处理「项目未带资产」时**同规则**（同步点：`modules/io/io-tail.js` 的 `headAssetOmitted` /
>   `hasOwnProperty("scalpGuideAsset")` 分支）。
> - **最高风险项：四个快速保存/导出句柄必须忘掉**（`quickSaveFileHandle`/`quickSaveFileName`/
>   `lastExport`/`quickExportFileHandle`）。留着 ⇒ New 之后按 Ctrl+S **静默覆盖上一个项目文件**。
>   项目名一并回 `"Untitled Hair Project"`，免得另存对话框预填旧名。
> - **undo/redo 栈清空**：New 是**新的 undo 基准**、不是可撤销步骤（与 `openHairProjectFile` 的同名
>   处理逐条一致），否则 Ctrl+Z 会把用户拖回一个已被 dispose 的半场景。崩溃恢复快照亦清掉。
> - **确认对话框** `#newProjectWarning`（沿用 `panelSplitSnapWarning` 的 warning-dialog 形状）。
>   **刻意不做「不再提示」勾选**（对比 `groupDefaultsWarning`）：这一步丢弃全部未保存工作且不可
>   撤销，不给静默跳过的开关。
> - **`__AHS_TEST_SEAM__` 新增 `projectState`**：验收要断言句柄被忘掉，而这些值只在 store 里 ——
>   `fileApi` **只导出函数**，那些 getter 在传进 `createProjectSaveApi` 的 deps 对象上、不在返回值上；
>   从 `fileApi` 读会得到 `undefined`、写会凭空造出同名属性（初版实测 3 条断言因此假绿/假红）。
> - **验收** `scripts/verify-new-project.mjs`（新增，**21/21**）：真实 Sussurro_v1_0060.ahs 上
>   locks 26→0、场景图 Mesh 2398→137、Cancel 路径逐项不变、四句柄全忘、undo 栈空、**二次 New 仍干净**
>   （证明基准未被污染）、全程 0 page exception。
> - **顺带修掉 `scripts/verify-smoke.mjs` 的取参 bug**：`args.indexOf("--port")` 缺失时返回 −1 ⇒
>   `args[-1+1]` 读到**第一个位置参数**（.ahs 路径）⇒ `Number(路径)=NaN` ⇒ `ERR_SOCKET_BAD_PORT`，
>   即**照 AGENT_QUICKSTART 里写的命令跑就崩**（看着像环境坏了，其实是取参 bug）。两个脚本都换成
>   先判 flag 存在的 `optNumber`；新脚本勿再复制旧写法。

## 最近更新（控件组强调框，0.2.134）

> **纯装饰**，把三组相关控件从周围的普通滑杆里视觉分出来（用户：「不用改太多只是想让它看起来
> 不太一样」）。无 JS 改动，只有 `styles.css` + `index.html` 的 wrapper。
>
> - **styles.css**：一个基类 `.control-emphasis`（半透明底 + 6px 圆角 + 1px 描边 + padding）+ 三个
>   修饰类 `--red` / `--green` / `--blue` 只改描边色。参照同文件既有的 `.visibility-filter-box`
>   （同为「框起一组」的组件），不新造版式体系。
> - **底色用半透明白叠加 `rgba(255,255,255,0.035)` 而非字面浅灰**：本主题是纯暗色（`:root` 的
>   `color-scheme: dark`、面板底 `#19181d`），字面浅灰会变成一块突兀亮斑。
> - **三色 alpha 刻意不等**（红 .5 / 绿 .45 / 蓝 .62）：暗底上蓝色天生显得更弱，等 alpha 会让
>   「深蓝」几乎看不见；按**感知重量**配平而不是按数值统一。
> - **`#sweepOverlapPanel` 加内层 wrapper `#sweepSmoothGroup`，不直接给它套类**：`.panel-section`
>   自带 `padding/margin/border-bottom`，直接套会与盒子版式冲突。另两组新增 `#panelEdgeLengthGroup`
>   （蓝，四个 Trim）与 `#panelZipperGroup`（绿，Split Segments + 发尖 Width/Depth Curve + Split Tip）。
>   `#panelHemisphereControls` 也给蓝框（与 Trim 同族的程序化变形）。
> - **红框圈的是全部 5 个滑杆**：用户说「那四个」，但 `#sweepOverlapPanel` 的 5 个参数
>   （Strength/Threshold/EdgeSmooth/Falloff/TangentSmooth）是**同一个系统**（AGENT_QUICKSTART §2.6
>   即按 5 参数系统记录），任意排除一个都无依据，故整块圈起。
> - **插 wrapper 前的依赖审计**（最可能引入回归的地方）：`.panel-shape-controls` 在 panel 上下文会变
>   `display: contents`，其子级由 `#strandShapePanel` 直接布局 —— 若那是 grid/flex，wrapper 会把整组
>   塌成一个格子。实测 `#strandShapePanel` **只设 `order`、是普通块容器**；`.sliders` 无裸规则、其全部
>   规则用的都是**后代**（非子）选择器，故 wrapper 安全。JS 侧全部按 id 取元素，无
>   `.children`/`parentElement`/兄弟遍历依赖；`hairCardIncompatibleControls` 只含 `#strandSplitControls`
>   （在 wrapper 之外）。
> - **`.hidden` 仍然生效**（`display: none !important`，全局定义）：真实浏览器实测隐藏时盒子塌成
>   **0×0**，不留残余描边/padding。**红框只在选中普通发丝时可见** —— panel 选中时 app.js 本就隐藏
>   `#sweepOverlapPanel`，所以视觉核验必须换选一根 strand，否则永远报 `visible: false`（本轮踩过）。
> - **本组由主进程完成**：原派给子智能体，但它长时间零产出（`styles.css` mtime 未变），按规范
>   「子智能体中途失败时主进程直接接手」接管，并 `interrupt_agent` 掉它以免回头覆写。

## 最近更新（0.2.144：Scalp Conform 第五版 —— 纬线轴 + 拟合椭球密切圆心，删掉那个 `min`）

> 用户驳回第四版的**根部**手感：「由于根部是切线方向bend, 会导致视图弯进头皮中, 而不是根据头皮走向往后弯」，
> 给出模型「纬线的中心也是偏移球中心而往北极去而保持在一个横切面中, 这正是现在欠缺的地方」，
> 并要求「刘海的后半部分(靠近尖端)和现在效果差不多」。
>
> - **根因就是一个 `min`**：`axisPoint = (C.x, min(C.y, P.y), C.z)`。`P.y < C.y` 时取 `P.y` ⇒ 径向纯水平
>   ⇒ **本来就是纬线包裹**（发尖手感对的原因）；`P.y > C.y` 时取 `C.y` ⇒ 轴塌成**头心一点** ⇒ 变成过头顶的大圆、
>   轴倾斜。用户那句「纬线圆心往北极偏移」= 去掉这个 `min`。真实档（发根 `y=1.8326`、7 点中 4 点在 `y>C.y`）实测：
>   发根轴 `(0,−0.407,0.913)`、边缘 `Δy = −1.578`、行逆序 **4/6**。
> - **新模型**：纬线椭圆半轴 `A=ax·c`/`B=az·c`（`c=√(1−h²)`），取该方位**密切圆心** `O_osc = Pe + ρ·n̂ₑ`、
>   `Reff = |P−O_osc|`、`k = amount/(Reff+gap)`、轴 `â` **恒竖直**。`panelBendCrossSection` **一字未改**（本就平面无关）。
> - **球退化精确**：`ax==az` ⇒ 圆的密切圆心即圆心 ⇒ `Reff = hypot(dx,dz)` ⇒ **`scale` 全 1 且 `P.y<C.y` 时与第四版
>   逐位相同**（`maxDiff = 6.9e-18`）。「尖端不变」是**结构性保证**，不是调参凑的。
> - **三个"软化"变体被驳回**（L2 法曲率 / L3 双侧混合 / L4 单侧混合）：「这几版的效果不行, 还是过于偏向切线偏折」
>   ⇒ 任何朝三维半径的混合**不许再提**。发根包裹角 111°→**241°** 是接受的结果（延续 D8「就要包这么宽」）。
>   ⚠️ 探针恒定 `halfWidth=2.5`、**忽略 widthCurve** ⇒ 241° 是**上界**。
> - **修掉 NaN 静默摊平**（真实缺陷）：`h=±1` ⇒ `A=B=0` ⇒ `ρ=0/0=NaN`，而内核首行 `Number(curvature)||0`
>   **把 NaN 当 falsy 变 0** ⇒ 该行摊平成直线、不报错；旧守卫 `radius<1e-6` 抓不到（`NaN<1e-6` 为 false）。
>   修法：`h` 钳到 `|h|≤1−1e-3` + 守卫扩成 `!Number.isFinite(reff) || reff<1e-6`。
> - **新增全局 `scalpConformFit = {fitScaleX, fitScaleZ}`**（`0.5–1.5`，默认 1，滑杆 Fit Width/Fit Depth）。
>   与可视头模**解耦**（用户「椭球只是近似模型, 暴露数据给用户简单调一下近似即可」；可视头皮被 lattice +
>   `artistShape` 变形过）。**全局非逐 lock**（用户「D10用全局」）⇒ 改滑杆走全量 `rebuildLockGeometry`。
> - **为什么只 2 个参数**：灵敏度实测发现球构型下 `fitRadius`/`fitScaleY`/`C.y` 的影响 **`maxDiff` 精确为 0**
>   （半径与竖直半轴被代数消掉）⇒ 4 个里 2 个是**死控件**。`ay` 与整体半径写死 1，这是**明确取值**（它们在
>   `ax≠az` 时有效，7.68e-3 / 8.12e-3）。代价：球构型下移动头心高度**不再改变** conform（相对第四版的回退，
>   用户知情接受）；两条测试断言已从「移头心必变」重写成「移 `C.x/C.z` 必变 + `C.y` 仅 `ax≠az` 时变」的双向断言。
> - **两条已知限制（椭球是近似的代价，勿当回归修掉）**：㈠ 非球构型下「不穿透」**不再由构造保证**（椭圆其它方位角
>   的水平半径可 > `Reff`，实测边缘深度 P5 **−0.668**）；㈡ 包裹松紧随方位角不对称（y=1.4 处正面 69° vs 侧面 173°，
>   **2.5×**，方向随 `ax/az` 翻转）。球构型均不受影响。
> - 顺手修了条潜伏 bug：`dom-contract.test.mjs:4471` 用写死 `"\r\n}\r\n"` 切函数体 ⇒ 只在 CRLF checkout 下成立，
>   LF 检出下静默切空串、**断言空转**。改成 `\r?\n` + 边界非空断言（`split-tip-geometry.test.mjs:3035` 早有同坑记录）。
> - 验收：全量 **394/394**（基线 387 + 新增 7）、专项 **27/27**、变异验证 7 组全部确认变红后还原。
>   **CDP 真实链（`verify-scalp-conform.mjs`）尚未跑**（沙箱无 Chrome，需 Windows 侧补），且它 4 条硬编码阈值
>   按第四版钉的，**必须重新实测**。详见 `archive/scalp-conform-ellipsoid-v5-plan.md`。

## 最近更新（0.2.143：Scalp Conform 第四版模型 —— 逐行绕头部胶囊轴的同心 wrap）

> 替换 0.2.138–0.2.142 那一版（弯曲发生在面板自己的 `(frame.x, frame.z)` 平面内、
> `bendRadius` 为全局标量）。根因、全部实测数据、8 点验收判据见
> `archive/scalp-conform-bend-v4-plan.md`（权威文档），本条目只描述两个改动文件里
> 实际改了什么。
>
> - **`modules/geometry/curve-math.js`**：只改了 `panelBendCrossSection` 上方的注释块
>   （模型说明、四条由构造保证的性质、Houdini Bend SOP 实测的外部佐证），**函数本体
>   一字未改** —— 它本来就是「吃一个 2D 截面采样器 + 一个曲率标量，返回逐段保长弯曲后的
>   `{lateral, normal, angle}`」的平面无关内核，选哪张平面是调用方的事，换轴不需要动它。
>   `PANEL_SCALP_CONFORM_DEFAULTS` 未变（仍是 `{amount: 0, gap: 0.02}`）。
> - **`modules/geometry/panel-tip-strand.js`**：
>   - `panelScalpConformParams(lock)` 不再返回 `bendRadius`（那是「水平平均半径 + gap」的
>     单一全局标量，根因 B），改为返回 `center`（头部代理中心，`THREE.Vector3`，世界空间）；
>     `amount`/`gap` 字段不变。`scaleX`/`scaleY`/`scaleZ` 不再在本函数里出现（卷绕半径已是
>     逐行实测距离，代理缩放通过「面板落在 center 什么相对位置」隐式生效）。
>   - `panelScalpConformOffsets(params, sample, u, shellOffset, cache, cacheKey, frame)`
>     的最后一个参数从 `lateralAxis`（该行 `frame.x`）改为 `frame`（该行完整的
>     `{point, x, y, z}`）。函数体内逐行推导：胶囊轴最近点
>     `A = (center.x, min(center.y, frame.point.y), center.z)`（中心高度以上退化为球冠、
>     以下是竖直线，即圆柱）、径向 `radialHat`、法向 `normalHat`（与 `frame.z` 同侧）、
>     宽度方向投影到切平面得到 `lateralHat`、曲率 `k = params.amount / (radius + params.gap)`、
>     弯曲轴 `axisHat = lateralHat × normalHat`。用一个内部适配器 `sample2` 把
>     `sample(v)` 原本在 `(frame.x, frame.z)` 里的一对系数转换到 `(lateralHat, normalHat)`
>     基上，再调用**未改动的** `panelBendCrossSection`；沿 `axisHat` 的分量原样携带
>     （bend 的定义：点只在垂直于弯曲轴的平面内移动）。返回值从 `{lateral, normal}`
>     变成一个世界空间 `THREE.Vector3` 偏移（起点为 `frame.point`），因此两个调用点也从
>     `origin.addScaledVector(frame.x, offsets.lateral)...` 改成了
>     `frame.point.clone().add(offsets)`。
>   - **两道早退门**：`params.amount === 0` 与 `u === 0`（新增，第四版起）都直接
>     `return null`，调用方走原表达式。旧版只有前一道门；`u===0` 这道门是新模型「换基
>     再还原」这条路径特有的，没有它会在浮点往返里给中线留下噪声。
>   - 缓存策略不变（同一个 per-build `Map`，key 仍含 `sampleT`），只是缓存的内容从
>     `{lateral, normal}`（那对系数）换成了 `{offset, shellDirection}`（世界空间向量 +
>     弯后法向单位向量），`shellOffset` 仍在缓存之外通过 `shellDirection` 叠加。
>   - 两个消费点 `rawPanelPoint`（`createPanelStrandGeometry` 内）与
>     `tipMainSectionPoint`（宽度把手截面复刻）都已改为传整个 `frame` 并用
>     `offsets ? origin.clone().add(offsets) : <原表达式>` 的形状，两处逐字节同构。
>   - **`k·cos²α`（0.2.142 引入的水平度衰减）已删除**，连同它依赖的 `lateralAxis` 参数
>     一起被 `frame` 取代；新模型下衰减是投影 `x̂_t = normalize(frame.x − (frame.x·n̂)n̂)`
>     的自然结果（宽度方向指向头心时退化为零向量），不再需要额外系数。
> - **测试**：`tests/panel-scalp-conform.test.mjs` 按第四版模型整体重写（断言参见文件头
>   注释的八条不变式）；`scripts/probe-conform-diagnosis.mjs` 等诊断/实验脚本按计划文档
>   §10 属临时件。版本号三件套已 bump 到 `0.2.143`。

## 最近更新（0.2.142：曲率按宽度方向的水平度缩放 —— 修倾斜面板的 sweep 边缘挤压）

> 用户确认 tube 弯曲本身是对的（「尤其是末端, 记住就这么处理」），但报告：「整个发片有点只是
> 沿着切线和一个曲率去旋转, 这在发尖这种一般比较垂直的地方还行得通, 但是前额那些又倾斜的
> 地方在宽度较大的时候直接这样旋转会导致 sweep 边缘挤压」。
>
> - **根因**：弯曲发生在面板自己的 `(frame.x, frame.z)` 平面内 = **绕 `frame.y` 转**，而 `frame.y`
>   是**面板切向** —— 只有发尖那种近竖直处它才≈竖直轴。前额面板倾斜时轴跟着倾，宽度一大，
>   边缘就被拧挤。这与前两轮同一类错误：**拿局部基向量当全局轴用**。
> - **修法**：按柱面的 Euler 公式，绕**竖直**轴的柱面在偏离水平 α 的方向上法曲率是 `k·cos²α`，
>   所以把曲率缩放为 `k_eff = k · (1 − (x̂·up)²)`（`x̂` = 该行的 `frame.x`，up = 世界 +Y）。
>   发尖（x̂ 水平）⇒ 系数 1，保持用户已确认的手感；倾斜处按余弦平方自动减弱。
>   两个消费点各传自己那一行的 `frame.x`（把手侧无 memo，故 cache 参数传 null）。
> - **默认值刻意选"完整弯曲"**：漏传 `lateralAxis` 时 `horizontality = 1`，退回 0.2.141 的行为，
>   而不是静默把功能关掉 —— 后者会让"看起来没生效"变成难查的静默失效。
> - **验证的诚实边界**：浏览器 31/31 的三个数字（边缘位移 2.6226、跨度比值 0.970..1.002）与修正
>   **前完全相同** ⇒ 在 Test 2 那个面板上本修正是**空操作**（其宽度方向已接近水平，cos²α≈1），
>   所以 31/31 **不构成**倾斜修正的证据。真正钉住新行为的是 node 测试：同一 lock、同一 u，
>   把 `lateralAxis` 从水平转到竖直，弯曲量必须按 cos²α 递减（水平 > 45° > 竖直≈0）。
>   全量 379/379。
> - **测试初版断言错了**：我写成"漏传 lateralAxis ⇒ 不弯"，而代码默认是**完整弯曲** ——
>   写断言时没核对自己刚写的默认值。已改为断言"等价于水平轴"并留档成因。

## 最近更新（0.2.141：Bend 截面 memo —— 砍掉 shell 造成的重复积分）

> 0.2.140 把步数从 16 降到 8 后，24×24 仍要 19.6ms、贴着 ~16ms 帧预算。本轮再砍一半。
>
> - **发现来自更正 devlog 时的副产品**：我原先声称"同一行截面对所有 shell、所有 u 都相同"。
>   后半句是错的（已在 0.2.140 条目更正：`sampleT` 在 `tipCurve≠0` 或左右 EdgeTrim 不等时是
>   `u` 的函数）；但**前半句是对的** —— `midAt` 不含 shell，厚度是在 `panelScalpConformOffsets`
>   的结果之外才沿弯后法向加上的。而 `rawPanelPoint` 按 front/back 各调一次 ⇒ 同一
>   `(sampleT, u)` 的积分跑了两遍。
> - **实测确认重复倍数恰好 2.00×**（198 顶点 / 99 个去重 `(row, u)` 组合），所以这不是估算。
> - **做法**：`panelScalpConformOffsets` 接受可选 `cache`/`cacheKey`；`createPanelStrandGeometry`
>   建一个 **per-build 的 Map** 传进去。**key 用 `sampleT` 本身**而不是 row 索引 —— 这正是被
>   更正的那条认知的直接应用：用索引会在 `tipCurve≠0` 或左右 Trim 不等时把不同截面混成一份、
>   **静默给出错误几何**。key 还含 `segment` 与 `boneToken(bone)`（bone 是对象，用模块级
>   WeakMap 发稳定 id：不污染 bone、bone 被回收时 token 一起消失）。
> - **memo 只给几何路径**：宽度把手的 `tipMainSectionPoint` 是 ad-hoc 调用（不成批），没有
>   per-build 生命周期可挂，传 null 走原路径。
> - **`bendSectionCache` 必须每次重建新建**（`conform.amount === 0` 时干脆为 null，保持零分配
>   早退路径）：截面依赖 lock 当前参数，跨重建复用会画出上一版几何。
> - **实测（用户 Test 2）**：24×24 **19.57 → 14.13ms**（进帧预算）、默认 10×6 **3.94 → 2.97ms**。
>   按**conform 归因成本**看更准：`ON−OFF` 从 12.57ms 降到 7.00ms，**−44%**，与 2× 预测吻合
>   （memo 只能砍积分那部分，OFF 基线不受影响）。精度与形状判据不变：全量 378/378、
>   跨度比值仍 0.968..1.002。
> - **顺带修了一条自己写的空转风险**：`单一定义点` 测试用 `panelScalpConformOffsets\(conform,`
>   数消费点，我把几何侧改成多行调用后它只数到 1 ⇒ 先误改成 `\(\s`（反过来漏掉单行的把手
>   调用），最终用负向 lookbehind 排除定义、只数调用。**判据要问"有几个消费点"，不是"参数
>   怎么排版"** —— 两版错法都留在注释里。

## 最近更新（0.2.140：Bend 积分步数从实测挑定 16 → 8）

> 0.2.139 的弧长参数化在**每个顶点**上跑积分，步数 16 是我拍的、没量过。这是**几何热路径**
> （用户实时拖滑杆），所以补了性能实测。
>
> - **实测超预算**：24×24 细分的单发片重建 conform ON **29.2ms**（OFF 6.6ms，3.4–4.5×），
>   超过 ~16ms 帧预算；默认 10×6 为 5.99ms（OFF 1.76ms）。
> - **步数从精度曲线挑，不再拍**（同一 panel 扫 4→32，判据 = 弯后折线长度 / 弯前）：
>   4 步 1.18% ／ 6 步 0.51% ／ **8 步 0.29%** ／ 16 步 0.066% ／ 32 步 0.011%。
>   测试容差 2% ⇒ 8 步仍有 7× 余量，而 16 步是精度需求的 2 倍多。
> - **改后**：24×24 降到 **19.6ms**（−33%），默认 10×6 降到 **3.94ms**（−34%）。精度实测仍
>   0.29%，全套 378/378、跨度比值判据（0.968..1.002）不变。
> - **仍未做的优化（已知未解项），但适用条件比我最初写的窄 —— 已更正**：我曾断言"同一行的
>   截面对所有 shell、所有 u 都相同，按行建前缀和表可再降一个数量级"。**前半句只在特定条件下
>   成立**：`rawPanelPoint` 收到的是 `sampleT = panelTipCurveParameter(t, u, tipCurve, edgeTrim)`，
>   而 ① `tipCurve ≠ 0` 时它显式含 `u²`（curve-math L284 的 `edgeWeight`）；② 即使
>   `tipCurve == 0`，它仍返回 `along · (1 − edgeTrim)`，而调用点喂进去的 edgeTrim 是
>   `lerp(leftEdgeTrim, rightEdgeTrim, (u+1)/2)` —— 左右 Trim 不等时**每个 u 的 sampleT 都不同**，
>   于是每个顶点的截面（`midAt` 闭包）也不同，表无法跨行内顶点共享。
>   **所以该优化只在 `tipCurve == 0 且左右 EdgeTrim 相等` 时有效**（这确实是常见默认，用户的两个
>   repro 文件都满足），一般情形要退化回逐顶点积分。做之前必须先按这两个条件分流，
>   否则会静默给出错误几何。shell 那半句是对的：厚度不进 `midAt`，同一 (row, u) 的两壳共用。

## 最近更新（0.2.139：camber 折进弧长参数化 —— Bend 真正保长）

> 用户在 0.2.138 的两个已知未解项里选了「折进弧长参数化（数学上真正保长）」，UV 那项选
> 「先不管，等形状定下来」。
>
> - **0.2.138 为什么还没保住长度**：它把 `(lateral, camber)` 当**一对系数整体旋转**，等价于
>   弯一条 **offset curve**。偏离中性面 `n` 的部分其弧长按 `(1 + n·k)` 放大 —— camber 恰恰就是
>   那个 `n`（`curvature·halfWidth·(1−u²)`，Test 2 上峰值 0.45），`k≈0.95` ⇒ 峰值放大 ~1.43。
>   实测中面弧长 **+26.5%**、逐行跨度比值 1.046..1.259。方向与用户报告的"坍缩"相反，但同样
>   是"面板尺寸变了"，所以不能算达标。
> - **新做法：离散曲率相加**（`panelBendCrossSection`，curve-math.js 唯一定义点）。把中面截面
>   （**含 camber**）在 `[0, u]` 上采成折线，**逐段保长**、只把每段方向按该段中点处的累计弧长
>   旋转 `−k·σ`：`seg' = rot(seg, −k·σ_mid)`，`P = C(0) + Σ seg'`。
>   **保弧长因此是逐段构造出来的**（每段长度一字不改，只转方向），不依赖积分精度 ——
>   这比"连续意义上保弧长"更强：**离散折线长度也精确守恒**，而 UV 的 U 正是逐段弦长累加。
>   一致性：camber ≡ 0 时截面是直线，本式退化为 0.2.138 的 `sin(kσ)/k, (1−cos kσ)/k`。
> - **厚度不被剪切**：函数额外返回弯后切向角 `angle`，调用方把 `shell·thickness/2 + centerZ·w`
>   沿 `(−sin angle, cos angle)` 放上去。实测两壳间距恒为 thickness，偏差 <1e-9。
> - **两个消费点各自的 camber 逻辑收成了一个 `midAt(v)` 采样器**（`tipMainSectionPoint` 与
>   `rawPanelPoint` 各一份，互为同步点）。**`amount==0` 的原表达式刻意不复用 `shellOffset`**：
>   左结合顺序必须与引入前逐字节一致，否则逐位守恒契约会在末位破掉。
> - **实测（用户的 Scalp Conform Test 2.ahs）**：逐行跨度比值 **0.968..1.002**
>   （投影模型 0.52 → 0.2.138 的 1.046..1.259 → 现在贴住 1）。下限略小于 1 是折线内接圆弧的
>   离散效应，有推导：`ratio = 2·sin(Δθ/2)/Δθ`，6 段宽度分段下理论下限 ≈0.973。
> - **暴露出一个非本轮引入的不一致，但我最初的归因是错的（0.2.141 实测更正）**：
>   曾记为「`tipPanelWidthAt` 与 `panelWidthAt` 在 `t=1` 处取值不同」。**读码即可证伪**：两者是
>   **同一公式、同一 `fullWidth`**（`max(0.0001, fullWidth × tipWidthMultiplierAt(...))`，
>   L389-393 与 L939-943），frame 也由同一个循环构建。**实测拆开来看**（发尖边缘列，
>   `TAPER_TO_ZERO`）：
>     row 9  ：网格与把手**逐位一致**（差 1.9e-8）
>     row 10 ：**中面都恰好 1.5**（一致），但半程厚度 网格 ±0.0400 / 把手 ±0.0379
>   ⇒ 差的是**壳厚方向**，不是宽度：比值 0.0379/0.04 = **0.9475 = cos(18.8°)**，即两个消费方在
>   `t=1` 算出了不同的 `angle`。成因是 `t=1` 处 taper 收到 0、截面退化成一个点，此时"弯后切向"
>   本身无定义 —— 网格侧拿到 `angle=0`（逐段循环一次都没进），把手侧拿到非零值。
>   `splits=null` vs `splits=[]` 实测**无差别**（都 1.30e-2），所以与调用约定无关。
>   测试跳过该行并注明；修它要给"退化截面"定义一个确定的切向，属独立改动。
> - 全量 378/378、浏览器 28/28。

## 最近更新（0.2.138：Scalp Conform 改为绕竖直轴的 Bend + 悬停高亮修复）

> 用户三条反馈：① 「我拉宽 width 和 Conform, 橙色高亮选择仍然还是原来的 panel 默认的很窄的
> 状态, 选择后高亮正常」；② 「主发片的控制点和控制器不会随着 Conform 拉高而跟着 geo 走, 但是
> 子发尖的控制器会跟随……而且 WidthCurve 是无变化的」；③ 「不用直接改变切面, 而是变形切面……
> 大概按照头的中心那里有个竖着的 tube 把平面的 panel 卷成圆柱的轨迹, 不是直接 ray 投射而是
> 弯曲变形, 类似 bend, 这个是保持长度的. 我们现在的实现是不保持长度的, 坍缩有点严重」。
>
> - **bug① 根因（app.js `rebuildLockGeometry`）**：该函数只把 `selectionOutline.geometry` 重指向
>   新几何、**漏了 `hoverOutline`**，而下一行就 `previousGeometry.dispose()`。两条轮廓由
>   `createStrandSelectionOutline` 用**同一份 geometry 引用**创建 ⇒ hoverOutline 攥着已 dispose
>   的旧几何。`dispose()` 只释放 GPU buffer、JS 侧属性数据仍在，下次渲染重新上传 ⇒ **画出旧
>   形状**（不是消失，所以极易误判成"缓存没刷新"）。**与 Conform 无关**：任何几何重建都中招，
>   只是 Conform 位移量大才显眼。修复一行 + dom-contract 三条断言（含顺序判据：两条重指向都
>   必须在 dispose 之前）；变异测试确认咬（删掉那行 ⇒ 108/109）。
> - **bug② 与 ③ 是同一个根因**，用户诊断准确：「控制器没跟着头皮走说明不是本质的程序化修改,
>   可能程序化到生成的 geo 上去了」。旧模型逐顶点在世界空间投影 ⇒ 位移不进"形状定义"，凡从
>   **参数**推导的东西（主发片控制点 `handle.position.copy(lock.points[index])`、WidthCurve）
>   都看不见它；发尖控制器能跟随只是因为它恰好经 `tipSurfaceFrameAt → tipMainSectionPoint`。
> - **新模型（Bend，保弧长）**：`θ = k·s`、`k = amount / bendRadius`、
>   `P(s) = base + (sin θ/k)·T − ((1−cos θ)/k)·N`，唯一定义点 `panelBendCoefficients`
>   （curve-math.js）。弯曲在面板**自己的 (frame.x, frame.z) 平面**内，厚度/camber 随弯曲旋转
>   （实测两壳间距恒为 thickness，偏差 <1e-9）。**保弧长**由 `|dP/ds| ≡ 1` 保证（差分核验）；
>   `k→0` **逐位**退化为平板；**插值曲率而非位置** ⇒ 中间态本身仍是光滑圆柱，因此 0.2.137 的
>   `Root Release` 与 0.2.136 的 `Capsule Length` **两参数删除**（前者本是救"部分贴合鼓包"的
>   补丁，后者被竖直轴取代）。四滑杆缩到两个：Conform + Scalp Gap。
> - **bug② 的结构性修复**：`s = 0` ⇒ `along = 0, inward = 0` ⇒ **中线零位移**。主发片控制点落在
>   授权曲线（中线）上，所以它们**本来就对齐**，无需给控制器另打补丁。有测试钉住"中线列逐位
>   不动"。
> - **实测（用户的 Scalp Conform Test 2.ahs，width=5、amount=0.87）**：横向跨度比值从投影模型的
>   **0.52** 回到 **1.046..1.259**，坍缩消失。全量 378/378、浏览器 27/27。
> - **两个已知未解项（如实记录，勿当已修）**：
>   ㈠ **camber 导致跨度偏大**：camber = `curvature·halfWidth·(1−u²)` 是"偏离中性面 n 的偏移"，
>      弯曲时其弧长按 `(1 + n·k)` 放大。Test 2 上 camber=0.45、k≈0.95 ⇒ 峰值 ~1.43，实测中面
>      弧长 +26.5%。方向与用户报告的"坍缩"**相反**（偏大而非偏小），是否需要修正（把 camber
>      折进弧长参数化，即用截面自身弧长而非横向坐标做 bend 参数）需由观感决定。
>   ㈡ **row 0 会移动 ⇒ U 尺度变 4.6%**：uv-unfold 的 U 由 row-0 逐段**弦长**累加得出，而弯曲后
>      弦长和 ≠ 原弧长（折线内接圆弧 + camber 放大）。我曾在 curve-math 注释里断言"保弧长正好
>      给出 UV 不变"，**那是错的**（连续保弧长 ≠ 离散弦长和不变），已就地更正。解法是给
>      `gridUvTable` 传未弯曲的 `referenceCircumference`（该参数已在签名里），尚未实现。

## 最近更新（0.2.137：修掉 Scalp Conform 的中段鼓包 —— Root Release 钳到 0.25）

> 用户报告：「靠近尖端的部分完美的按照头皮类似胶囊半体来变形, 要的就是这种, 不过根部附近
> 可能由于算法问题或者模型不正确导致会有很诡异的挤压, 而且比整个头都要宽」，并提供了
> 复现文件（`Scalp Conform Test 1.ahs`，单个 panel、width=5、amount=1、**range=0.91**）。
>
> - **"尖端对、根部错"本身就是最强的线索**：它排除了"代理形状不对"整类猜测 —— 若代理错，
>   尖端不会正确。差别只在 weight：尖端 `weight==1`（**没在插值**），根部到中段 weight 在
>   0→1 之间（**正在插值**）。
> - **根因**：`range`（当时叫 Falloff、上限 1、默认 0.6）让 ramp 跨度内的行处于**部分贴合**。
>   `delta = (target − point)·amount·weight` 是**位置线性插值**，而「原始构型」与「裹住头的
>   构型」差异极大 ⇒ 中间态不落在任何光滑曲面上（糖纸褶皱）。实测该 panel（目标距头心
>   1.155）：`range=0.91` 时各行距离 `1.17→1.42→1.24`，**中段停在 1.42** —— 既没贴上头也不是
>   原始形状，就是那个"包"；`range=0.15` 时距离几乎恒定 `1.17→1.24`。
> - **修复 = 把 range 钳到 0.25 并重命名 `Root Release`**（默认 0.15）。上限**是扫出来的**：
>   0.05–0.25 跨度反转 1 次（与 conform 关闭时相同）、最大偏离 ≤0.093；**0.30 反转跳到 3 次**、
>   偏离 0.104。边界与细分有关（`panelLengthLoops=10` ⇒ 行距 0.1，0.25 ≈ 放开两行），故是
>   **经验上限**，改细分默认值时应重扫。语义随之改变：它不再是艺术衰减，只是**把被 UV 红线
>   钉死的 row 0 平滑放开**；不给过渡则根部留台阶。
> - **单一定义点**：`PANEL_SCALP_CONFORM_MAX_RANGE` 与 `PANEL_SCALP_CONFORM_DEFAULTS` 都在
>   curve-math.js，**app.js 改为 import**（本轮初版在 app.js 里硬写了三处 `0.3`，是同一条规则
>   的多个定义点）。`index.html` 的 `value=`/`max=` 仍是必须人工同步的第三处，有测试钉住。
> - **旧档兼容**：0.2.136 存的大 range 在反序列化处被钳回 0.25。这是**刻意的形状变更**
>   （变的方向是"不再鼓包"），不是静默丢数据。
> - **回归测试的判据经过两轮修正，过程本身值得记**：
>   ① 初版判据是"clearance 剖面的方向反转次数不多于 flat" —— **变异测试证明它不咬**
>      （把上限改回 1，该测试仍绿）。原因是 fixture 的 camber = `curvature×width×0.5 = 0.45`
>      在 harness 的**常量 frame.z** 上整体平移中面，把精心构造的 clearance 剖面淹掉了；
>      修法是 fixture 里 `panelCurvature: 0`，此时中面点恰好等于曲线点。
>   ② 修完 fixture 后判据**又太严**：任何非零长度的释放带都会在带内留下一个极小反转
>      （实测 `range=0.15` 时 `0.020→0.059→0.050`，overshoot 仅 0.009），那是正常的。
>   ③ 最终判据 = **鼓包幅度**：`overshoot / flat跨度 < 10%`。两种情形相差一个数量级
>      （正常 2% vs 病态 39.8%），阈值干净分开。变异测试确认它现在真的咬（`range=1` 时报
>      `overshoot=0.1829（39.8%）`，剖面 `0.020→0.233→0.050` 正是用户文件的形状）。
>   **教训**：判据要选**幅度**而不是**存在性** —— "有没有反转"把正常现象和病态混为一谈。
> - **fixture 必须复刻病征的全部成因**（这条最容易漏）：宽度远大于头径、曲线逐渐远离头部、
>   且 **clearance 上升是"前重"的**（前 1/3 涨掉大半）。第三条才是鼓包成因：早期 w 小 ⇒
>   conformed 跟着 flat 猛涨，等 w 追上来才被拽回 gap ⇒ 中途出现局部极大。flat 若匀速上升，
>   两个效应互相抵消、鼓包不显形。初版 fixture 只满足前两条，于是空转。
> - **真实浏览器验收**（`verify-scalp-conform.mjs`，在**用户的 repro 文件**上 28/28）：
>   `conform=1` 后收满行贴在「半径 + gap」上，最大偏差 **0.0215**（108 顶点）；平均距头心
>   2.081 → 1.050；row 0 逐位不动；Capsule Length 0→2.5 使包围盒 min.y 0.438 → 0.095；
>   0 page exception。该脚本本轮修掉两个**自身**缺陷：继承的 `range=0.35` 已超新上限（必然
>   假红）；以及它假设"全新场景"，而用户文件带着 `amount=1` 存盘 ⇒ 基线本身已是收缩态、
>   所有方向断言失效。现在先把四个字段归位再取基线，且"授权默认值"改读 `defaultValue`
>   （HTML `value=` 属性）而不是 `value`（当前状态）。

## 最近更新（0.2.136：Scalp Conform —— 世界空间收缩包裹，替换半球模型）

> **用户驳回了 0.2.134/0.2.135 的整个模型**，原话：「这个使用体验并不好, 可能不能简单根据
> 法线去弯折一个刘海, 因为那终究是单个刘海, 而非用户想贴着头皮的前额部分去弯折, 导致刘海
> 会拱起来而且后推的边缘并没有很好的贴近它该有的位置」，并给出方向：「直接分析现有头皮的
> 集合结构, 把整个头当成 Capsule 的一端」。
>
> - **根因确凿（不是调参能救的）**：旧模型的位移是沿**面板自己的 `frame.z`** 的标量偏移 ——
>   纯局部量，**完全不知道头皮在世界空间的哪里**。所以"后推的边缘"只是沿自己法线退了一段
>   公式算出来的距离，落点与头皮实际位置无关；"拱起来"同理（面板相对自己弯，而不是去贴一个
>   外部曲面）。**旁证**：app.js 现有的 `outwardNormalAtPoint`（L12391）也只是「以世界原点为
>   心的径向」，连 `scalpSurface` 的 y=0.9 都没用上 —— 旧模型建立在同一套错误认知上。
> - **新模型**：`delta = (target − point) · amount · weight(t)`，`target` = 头部代理表面点 + gap。
>   落点**由真实几何决定而非公式**。`amount = 1` ⇒ 中面精确落在 target 上（恒等式，1e-12）。
> - **头部代理 = Capsule 一端**（`capsuleEndNearestSurface`，curve-math.js 唯一定义点）：单位球
>   空间里轴 = 原点 → (0, −cylinder, 0)，对轴上最近点取径向外推单位半径 ⇒ y≥0 是半球（头顶）、
>   y<−cylinder 又是半球（下方收口）、中间是**圆柱段**（径向只在 xz 内）。圆柱段的意义：长刘海
>   垂到下巴时**直着垂下**，而纯球在赤道以下会让顶点朝内卷（往下巴底下收）—— 这是纯球模型
>   解决不了的，也是用户建议 Capsule 的原因。
> - **代理跟随真实头皮**：椭球归一用**注入的 `deps.scalpSurface`**（app.js 的
>   `{x:0,y:0.9,z:0,radius:1,scaleXYZ}`，`panelTipStrandDeps` 里注入**对象本体**而非快照 ⇒ 用户调
>   头模后下次重建自动生效）。0.2.135 刻意"不跟随头模"，那是错的 —— 收缩的落点必须是真实头皮
>   位置。**刻意不传 `scalpSurfaceGroup`（Object3D）**：几何重建时机早于渲染，它的 `matrixWorld`
>   可能是脏的；从纯数据推变换永远是当前值。缺失时走 `PANEL_SCALP_PROXY_FALLBACK` 兜底。
> - **两壳必须共用同一份 delta**（delta 从 shell 项归零的**中面点**算，再原样加到 front/back）——
>   若两壳各自朝代理表面收，它们会收到同一张表面上、**面板厚度被压成 0**。这是本模型最容易
>   踩的坑，两个消费点（`rawPanelPoint` / `tipMainSectionPoint`）的注释互指为同步点，并有
>   「厚度逐位守恒 + 两壳 delta 完全相同」的回归钉住。
> - **gap 在世界空间加**（沿"轴上最近点 → 表面点"的世界径向），不在单位球空间加：gap 是"离头皮
>   多远"的物理距离，而非均匀 `scaleXYZ` 下单位球空间的等距并不对应世界等距。
> - **四个字段整体改名** `panelHemisphere{Amount,Width,Center,RootAngle}` →
>   `panelScalpConform{Amount,Range,Gap,Cylinder}`。前两个同义（强度 / 沿 t 跨度），**后两个语义
>   换掉**（球冠顶点位置 → 离头余量；根部纬度 → Capsule 圆柱段长度）。改名而非复用旧名：本仓库
>   有"字段名与语义漂移"的历史教训（`bone.spread` 撞上两个无关概念，见 §7.2b）。**旧档刻意不
>   迁移** —— 把旧数值灌进新字段会得到与作者当年意图无关的形状，回落到 amount 0（关闭）更诚实。
> - **`Root Latitude` 滑杆随模型一起删除**：新模型里"根在哪个纬度"由顶点**在世界空间的真实位置**
>   决定，不需要用户告诉我们。这是相对 0.2.135 的实质简化（少一个需要理解的旋钮）。
> - **测试整份重写** `tests/panel-scalp-conform.test.mjs`（14 条）替换
>   `panel-hemisphere-deform.test.mjs`（已删）：机械改名会留下"看起来在测新模型、实则断言旧公式"
>   的假绿。新增判据里最有价值的两条：**中面精确落在 radius+gap 上**（球代理下是独立几何事实，
>   不是复述实现）、**厚度逐位守恒**。另有"代理跟随 scalpSurface 每个轴"（防退回写死常数）。
> - **真实浏览器 28/28**（`scripts/verify-scalp-conform.mjs`，原 verify-hemisphere-ui.mjs）：
>   真实工程 Sussurro_v1_0060.ahs 上 conform=1 后**平均距头心 2.436 → 1.045**（= 半径 1 + gap
>   0.05），486 个收满顶点最大偏差 0.094（半个板厚量级）；Capsule Length 0 → 2.5 使包围盒
>   min.y 0.339 → −0.159（圆柱段真的让头发垂更低）；row 0 逐位不动；0 page exception。
>   判据的 center/radius **从测试缝读注入的 `scalpSurface`**，不写死 `{y:0.9,r:1}` —— 写死就只是
>   复述实现的假设、用户改过头模后会假绿。

## 最近更新（0.2.135：Panel Width 上限 5 + 半球「两侧后移」）

> 用户两项优化：① Panel 的 Width 上限 2.5 → 5；② 半球手感从「软选后单纯向前凸」改成
> **两侧在鼓起的同时往后移**。用户原话：「我拉了一个很平的 panel 刘海在额前的这个平面拉下来,
> 做到我拉宽 width, 然后我拉动 Bulge Amount, 这个 panel 就差不多贴着头皮往后挪了, 而不是我
> 手动去调整边缘曲线」。并明确「适配当前头皮」**不是要真写适配算法，直接定个常数**。
>
> - **Width 上限（index.html 一处属性）**：`#panelWidth` 的 `max` 2.5 → 5。**无 JS 常数需同步** ——
>   `lock.width` 全局无上限钳位，而多选相对编辑 `relativeEditValue` 的 min/max 直接读
>   `Number(input.min)`/`Number(input.max)`（app.js L17486-17487），**滑杆属性即唯一真源**。
>   `dom-contract` 只冻结 `panelWidthLoops`，不冻结 width 的 max。
> - **两侧后移（curve-math.js）**：`offset = amount·(cap − recede)·guard(t)`。
>   `recede = (1 − cos(|u|·k)) / k`，`k = wrapRatio = 面板半宽 / 头皮球半径` —— 这是把平面窄条
>   **卷到半径 R 的球面**上的精确后移量（横向弧长 `s = |u|·W` 对应圆心角 `θ = s/R`，相对切平面
>   后移 `R(1 − cos θ)`，再除以 W 归一）。**自洽性验证**：乘回世界尺度（半宽）后半宽被约掉，
>   剩下正是 `R(1 − cos θ)` ⇒ 尺度约定没引入伪量纲。
>   **关键性质**：k 随 `lock.width` 增大 ⇒「拉宽 width 再拉 Bulge Amount 就贴上头皮」是自然
>   结果，用户不必再手调边缘曲线。k → 0 时 `recede → 0`，退化为 0.2.134 的纯球冠。
> - **`amount = 1` 的物理刻度（构造性恒等式，已钉成测试）**：边缘**精确**落在半径 R 的头皮球面上，
>   实测最大偏差 **1.11e-16**（纯 float64 舍入），因此断言用 1e-12 而非 1e-6 —— 这是恒等式不是近似。
>   于是滑杆有了明确刻度：1 = 精确贴合头皮、0.5 = 贴一半。**钉住它的理由**：将来任何"简化"若破坏
>   该等式，滑杆就退化成没有物理含义的魔法系数，而形状看起来仍然"差不多"、行为测试未必发现。
> - **量级提示（用户手感相关）**：`fullWidth = 5`（UI 上限）时半弧角 = 143.2°/侧 ⇒ 面板一共绕过
>   **286.5°**，`amount = 1` 会把它几乎整圈包住头。这不是 bug（用户自己选 width 与 amount），但
>   「一体前额刘海」的实用区间通常是**较低的 amount**；`θ` 在数值层钳到 180° 只是安全网，UI 上限
>   （143.2° < 180°）够不到它。
> - **头皮半径是常数** `PANEL_SCALP_RADIUS = 1`（panel-tip-strand.js），与 app.js 的
>   `scalpSurface = { y: 0.9, radius: 1 }` 同值 —— 这是**应用自己的头皮球**，不是我拍的数。
>   **受控副本**（几何层不便 import 运行时状态），scalpSurface 默认值变了要同步。用户可缩放头模，
>   但本值**刻意不跟随**：它只是「快速出半球效果」的手感基准，跟随会让同一 Bulge Amount 在不同
>   头模上给出不同形状。
> - **`r ≥ 1` 不再恒为 0**（语义变更，刻意）：后移必须作用于**整片宽度**，否则宽面板的边缘会停在
>   切平面上、贴不住头。因此原来的 `if (radiusSquared >= 1) return 0` 改成只让 `cap` 归零。
> - **根部纬度 Root Latitude（新滑杆 `#panelHemisphereRootAngle`，0..1，默认 0.5）**：用户要求
>   「按照根部的朝向曲率和 panel 末端的朝向去简单计算一下根部大概在什么位置」并「做一个非线性
>   范围映射，因为根部一般难以从真的头顶上垂直 90 度开始刷，这个控制权给用户」。实现：
>   `φ₀ = (π/2)·knob²`（**平方映射**：φ₀ 极小时 sin 变化最快、观感最敏感，平方把滑杆低端拉开，
>   0→0.5 只覆盖 0°→22.5°，把分辨率放在常用的浅纬度、把少用的陡端压到末段）；
>   `rootFraction = sin φ₀` 的物理含义 = 该纬度处表面已经"侧过去"多少（真头顶 0、赤道 1）；
>   沿 t 的后移权重 = `rootFraction + (1 − rootFraction)·t`。
>   **为什么根部要弱**：发根那一圈本来就贴着头，需要往后收的是往下绕过颅侧的部分；整片等权后移
>   会把根部拉离头皮（观感是"整片往后平移"而不是"包住头"）。
> - **默认值三处同源**：`PANEL_HEMISPHERE_DEFAULT_ROOT_ANGLE`（curve-math，唯一定义点）、
>   app.js 的 `panelCreationDefaults`、index.html 的 `value=` —— 不同源会让「没动过滑杆的面板」
>   与默认几何不一致。
> - **测试（14 → 19 条）**：新增「中线前凸/边缘后移 + 越宽越贴」「根部弱于发尖（单调）」
>   「Root Latitude 非线性映射（低半段跨度 < 高半段，带线性映射的负向对照）」「wrapRatio=0 退化
>   为纯球冠」「**几何层**宽面板中间前凸两侧后移」。接线/镜像断言从三字段扩到四字段。
>   **两条既有量值断言曾变红，红的是测试不是几何** —— 它们手写了 5 个参数；改为从
>   `panelHemisphereParams`（参数唯一定义点）取全部参数，并把峰值期望从写死的 `amount × scale`
>   改成实际采样期望的最大值（后移叠加后峰值不一定还在球冠顶点上）。
> - **真实浏览器验证** `verify-hemisphere-ui.mjs` 18 → **24/24**：宽面板拉 Bulge Amount 后
>   **中线沿法线前移 +1.173、两侧后移 −0.747**（正是用户要的手感）；Width 上限实测为 5；
>   Root Latitude 0 vs 1 包围盒确实不同；row 0 仍逐位不动（UV 红线未破）；0 page exception。
>   判据取**几何自身法线**（从中线点位移方向反解）而非假设世界 +Z —— 真实工程里 panel 朝向任意。

## 最近更新（Hemispherical Deform，仅 panel，0.2.134）

> **面板「半球隆起」= 四个 Trim 控件的法线方向对位物**。动机（用户原文）：把额头/刘海做成
> **一整片**大面板时，它必须「在法线方向往前拱出一个半球」，因为额头是凸的；手绘半圆进
> sweep profile 或 depth 曲线不现实，所以必须程序化。**普通发丝刻意未实现**（用户明确延后）。
>
> - **modules/geometry/curve-math.js**：新增 `panelHemisphereOffset(t, u, amount, width, center)`
>   —— 球冠位移的**唯一定义点**（紧邻 `panelTipCurveParameter`）。剖面是**真球冠**而非泛化凸包：
>   `dt = (t − center)/width`、`r = hypot(dt, u)`、`offset = amount·sqrt(1 − r²)`（`r < 1`），
>   `r ≥ 1` 处**精确为 0**；返回标量，世界尺度由调用方乘。与四个 Trim 的分工：它们重参数化
>   `sampleT`（**切向**），本函数只管**法线方向**。面板自己的 `panelCurvature`（camber，沿 u 的
>   抛物线）刻意**不与之合并** —— camber 描述截面弧度、本函数描述沿 t 的球冠，是两个艺术控件。
> - **根部守卫（UV 红线）**：`if (along <= 0) return 0` + 常量 `PANEL_HEMISPHERE_ROOT_GUARD = 0.05`
>   的 smoothstep 斜坡，**写在纯函数内部**，任何消费方都无法忘记。两条独立理由：① `uv-unfold` 的
>   U 完全由 row 0 环向弧长决定、V 纯行号 ⇒ 触到 t=0 会静默重排每片面板的 UV；② 面板根锚在头皮，
>   根部位移物理上就是错的。带宽取 0.05 ≈ 默认 `panelLengthLoops`(10) 行距的一半 ⇒ 默认细分下
>   **只有 row 0** 落进守卫带、row 1 已拿到完整隆起，所以半球不会被"抹平在根部附近"；用 smoothstep
>   而非硬阶跃，是因为 `tipSurfaceFrameAt` 靠**差分**求法线，t→0 处的跳变会让它算出错误法线。
>   **`along <= 0` 提前归零不是冗余**：`strength` 为负时 `strength·…·0` 得到的是 **-0**，虽然对位置
>   无影响（`x + -0 === x`），但 `Object.is(-0, 0) === false` 会让「精确为 0」的断言与将来按符号
>   分流的消费方产生歧义。
> - **modules/geometry/panel-tip-strand.js**：新增 `panelHemisphereParams(lock)` —— 本文件内
>   lock 读取 + 钳位 + **世界尺度**的唯一定义点，并**导出供测试按同一规则推导期望值**（规范禁止把
>   现场数值写死进测试）。世界尺度 = `fullWidth * 0.5`（面板半宽），使控件**与面板尺寸无关**：同一
>   滑杆值在大小不同的面板上观感一致；用绝对世界单位会让宽面板隆起不足、窄面板炸开。
>   `geometryType === "surface"`（lattice 控制）恒 0，与 `panelTipCurve`/`panelLeftEdgeTrim` 既有先例
>   一致。两个消费点各加一段沿 `frame.z`（camber 与 `shell*thickness*0.5` 骑的同一基向量）的
>   `addScaledVector`：① `rawPanelPoint`（几何本身，传**已含 Trim 重参数化的 `sampleT`**，所以半球
>   活在与扫掠面同一参数空间）；② `tipMainSectionPoint`（宽度把手的截面复刻）。**`amount == 0` 时
>   两处都整段不执行** ⇒ 与引入前逐位相同（先例：`SWEEP_OVERLAP_DEFAULTS`「全部关到 0 时输出逐位守恒」）。
> - **消费方审计（只改了上面两处，其余顺着链自动继承）**：`tipSurfaceFrameAt` → `splitTipForSegment`
>   （发尖 rest 链）→ `tipWidthEdgePosition` / `tipWidthControlPlacement`（绿色宽度把手）→
>   `usda-export.js` 的 `splitBoneLayout`/`splitChainLayout`（panel 分支取的就是注入的
>   `splitTipForSegment` 的链点）**全部经由 `tipMainSectionPoint` 取点，故无需各自改动**；漏改
>   `tipMainSectionPoint` 会让网格鼓起而把手留在原处，该 bug 类见 bug-fixes.md #25。
> - **app.js**：纯接线，**不参与推导**（有测试断言 app.js 不出现 `panelHemisphereOffset`）。三个字段
>   `panelHemisphereAmount`(-1..1, 默认 0) / `panelHemisphereWidth`(0.05..1, 默认 0.5) /
>   `panelHemisphereCenter`(0..1, 默认 0.5) 覆盖 `panelCreationDefaults`、lock normalize、snapshot
>   序列化/反序列化、镜像伙伴、preset/clone 全部路径。滑杆复用**已有**的 `panelShapeInputs` 通用
>   接线（`bindUndoCapture` + input 监听 + `setMixedControl` 多选同步各只有一份实现），因此只往字典
>   补键、不手搓监听器；但通用循环对元素**不判空**，故先 `.filter` 掉缺失元素 —— markup 缺失时这三个
>   键根本不进字典，启动不会抛。
> - **镜像语义（与 panelTipCurve / EdgeTrim 都不同）**：三个值**原样拷贝，不取反、不交换**。理由：
>   球冠剖面 `r = hypot(dt, u)` 在 u 上是**偶函数** ⇒ X 镜像翻转 u 的符号后形状不变；而
>   `center`/`width` 沿 **t**（长度方向）度量，镜像不动 t。对比：`panelTipCurve` 要取负（其 `bowWeight`
>   随 strength 符号在"边缘/中心"间切换），左右 `EdgeTrim` 要互换（本身按侧定义）。两个镜像站点
>   （`createMirrorPartner` / `syncMirrorPartnerFromLock`）的注释互指为同步点。
> - **tests/panel-hemisphere-deform.test.mjs**（新增，14 条）：`amount==0` 逐位守恒（含 width/center
>   被改动、含 zipper 路径）、row 0 对任意参数逐位不动（含最恶劣的 `width=1 center=0` 与 zipper 路径）、
>   `t==0` 纯函数恒 0 的穷举、球冠剖面（`r≥1` 精确 0 / 朝顶点单调 / u 上对称）、负 amount 严格反号、
>   中段行位移 == `panelHemisphereOffset × fullWidth × 0.5`（**峰值**亦逐值核对）、**跨消费方一致性**
>   （把手截面点位移 == 网格位移，规范要求的形式）、surface 恒 0 + 尺度正比于面板宽度、以及
>   **单一定义点的源码级守卫**（球冠公式只在 curve-math.js；panel-tip-strand 恰好 2 个调用点；
>   app.js 不出现该函数名）。fixture 的 taper 末点为 0，满足 §2.4b「至少一个 taper 收到 0 的构型」。
>   **另 2 条是 app.js 接线的源码文本断言**：app.js 顶层就 `querySelector`/`new THREE.Scene`，node 里
>   无法 import 执行（`dom-contract` 全篇同样只读源码文本），所以按本仓库既有惯例把 7 类接线路径
>   逐条钉住（defaults / DOM 引用含缺失过滤 / normalize / snapshot 序列化 / 反序列化 / 隐藏 + 可选链），
>   并把**镜像语义**单独立一条：三值在两个镜像站点都「同名→同名」，且带**负向对照**（断言
>   `panelTipCurve` 确实取负、EdgeTrim 确实互换，证明那两种写法在本文件里写得出来 ⇒ 半球的
>   「不取反/不互换」断言不是空转）。**这不能替代浏览器验证**，只能防"少接一条路径"。
> - **「空操作路径」那条为什么必须是源码断言（变异测试结论）**：「`amount==0` 空操作路径不分配」这条要求
>   **行为测试原理上逮不到** —— `amount==0 ⇒ strength==0 ⇒ offset 恒为 +0`，而 `x + 分量*0 === x`
>   逐位成立，所以把两处 `hemisphere.amount !== 0` 门控和纯函数早退全部拿掉，输出仍然逐位相同
>   （实测：该变异体是 **equivalent mutant**）。故只能用源码断言钉住「纯函数早退 1 处 + 消费点门控
>   恰好 2 处」；少了它，将来有人"简化"掉早退不会有任何测试变红，但每次重建面板都会白算球冠并多
>   clone 一个 Vector3。
> - **断言承重性已用变异测试验证**（改**临时副本**、不碰生产文件；探针跑完即删，两个生产文件事后
>   SHA256 与基线逐位相同）：① 从 `tipMainSectionPoint` 摘掉半球 → 跨消费方断言逮到（最大偏差
>   1.7e-1，正是 bug-fixes.md #25 那类把手漂移）；② 摘掉根部守卫 → row 0 断言逮到；③ 球冠改成抛物线
>   （`sqrt(1−r²)` → `1−r²`）→ 量值断言逮到（偏差 5.8e-2）—— 这条证明「峰值 == amount × scale」不是
>   只要"动了"就通过；④ 取消早退 → 行为判据放过（equivalent mutant，见上条），源码判据逮到。
>   合计 4/5 被逮，唯一漏网者已证明为等价变异体。
> - **~~顺带发现：两个镜像站点对 EdgeTrim 处理不一致~~（已实测证伪，勿据此"修 bug"）**：曾记为
>   「`createMirrorPartner`（L9491）原样拷贝、`syncMirrorPartnerFromLock`（L9669）左右互换，疑为潜伏
>   镜像 bug」。**这个结论是错的，只读了对象字面量、没跟控制流**：`createMirrorPartner` 在 `return`
>   之前的 **L9563 无条件调用 `syncMirrorPartnerFromLock(lock, mirrored)`**，而它的守卫
>   `if (!lock || !partner || partner === lock) return null` 对两个不同 lock 必然通过 ⇒ **互换总是最后
>   执行、必然生效**，L9491–9492 的字面量是**死值**（被立刻覆盖）。**真实浏览器实测**（走 outliner 右键
>   Mirror Instance 的真实路径，源 left/right = 0.5/0）：partner 得到 **0/0.5**，互换生效、镜像正确。
>   **教训**：判断「同一字段在两处赋值哪个生效」必须跟到控制流，不能只对比两处字面量 —— 尤其当其中
>   一处是构造函数、另一处是它自己在返回前调用的同步函数时。**由此推论也适用于半球三值**：它们在
>   `syncMirrorPartnerFromLock` 里同样有一份「原样拷贝」，那份才是最终生效的（字面量那份是死值），
>   两处写法一致所以结论不变。
> - **scripts/verify-hemisphere-ui.mjs（新增，18/18，主进程补）**：上面那些都是 node 层，**滑杆接线
>   在真实浏览器里从未验过** —— 而那正是用户实际会碰的东西。本脚本在真实工程 Sussurro_v1_0060.ahs
>   的 panel（Front Bangs 1）上驱动真实滑杆：控件在 panel 上可见且带蓝框、默认中性 0、派发 `input`
>   后 `lock.panelHemisphereAmount` 写入 0.8、`<output>` 显示 0.80、网格**重建后顶点数不变**（918）
>   而平均 z 从 0.966 → 1.126（**真的鼓起来了**）、**row 0 的 20 个顶点在活应用里逐位不动**（UV 红线
>   在真实管线上成立，不只在测试 fixture 上）、负值反向凹（+0.8: +0.1595 / −0.8: −0.1596）、三个字段
>   都落到 lock 上，以及 **undo 往返**（0.55 → 0.15 → undo → 0.55，width/center 一并保持、滑杆 UI
>   重新同步）—— 后者比读 snapshot 更强，因为它同时跑 `snapshotState` 与 `restoreLock` 两条真实路径，
>   等于把「随 .ahs 持久化」也一并证了，且无需为此加宽 `__AHS_TEST_SEAM__`。全程 0 page exception。
>   **踩坑**：`bindUndoCapture` 监听 `pointerdown`/`keydown` 而非 `input`，只派发裸 `input` 不会产生
>   undo 步（初版因此拿不到快照、看着像持久化坏了）；已写进 AGENT_QUICKSTART §5。

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
> - 回归：Node 全量 **342/342**。详见 archive/strand-tip-selection-port-plan.md。

## 最近更新（0.2.125，Phase C：普通发丝 per-segment UI）

> 普通发丝（分裂管）补上 panel 早有的「按段编辑」UI 基座：段选择器 + 每段 Spread + 每段 Width/Depth 曲线预览与编辑入口。数据层（`lock.strandSplitBones[i]` 的 spread/曲线，持久化/镜像/增删重映射）0.2.116–0.2.117 已就位，本轮只做 UI 与分派。**曲线在同版本的发尖 WidthCurve 移植中已被几何消费**（见下方 0.2.125 发尖 WidthCurve 条目与 `archive/strand-tip-width-ui-port-plan.md`）；原文此处记「尚未被几何消费」已作废。
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

> 普通发丝多拉链移植（panel zipper → strand，分支 DHS/develop，6 阶段并行子智能体 + 主进程 merge/验证；计划 archive/strand-zipper-port-plan.md）——普通发丝从单拉链升级为多拉链 `lock.strandSplits=[{position,height,order}]`（N 拉链→N+1 管）：
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
> - 回归：Node 全量 261/261（dom-contract 缓存号 20260822-1 + APP_VERSION 0.2.115 冻结断言同步）。普通发丝多 zipper 移植计划见 archive/strand-zipper-port-plan.md。

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

> Sweep 转角过大修复：曲率感知环收窄（防自相交/穿插）+ 转角边缘平滑（分支 codex/0.2.66-sweep-corner-smooth，实施依据 devlog/archive/delta-mush-plan.md 主任务）：
> - **曲率感知环收窄**：`modules/geometry/curve-math.js` 新增纯函数 `sweepCurvatureResponse(centers, radii, { strength, safety, minScale })`（相邻三点外接圆半径作局部曲率半径 ρ，factor = max(minScale, 1 − (1 − min(1, safety·ρ/r))·strength)，返回 `{ factors, heat }`，heat 为与 strength 无关的曲率热度）。依据 Elber 1997 / Maekawa 1999 判据（偏置距离 > 曲率半径即自相交），业界惯例 scale = min(1, safety·ρ/r)。
> - **接入点**：`strand-sweep.js` `sweepSide`（普通发丝 + 子发片共用内核）+ `strand-geometry.js` `createSplitStrandGeometry` / `createHairCardGeometry`（独立手写环循环同步接入）。脊柱点不动，仅环剖面按曲率收窄。
> - **边缘平滑**：`curve-math.js` 新增 `smoothSweepChains(vertices, rowCount, columnCount, { strength, iterations, weights, pinRows })`（纵向链 Jacobi Laplacian，按 heat 加权、根环 pinned）；三个 sweep 构建器顶点产出后各跑一遍（iterations=2）。
> - **复用/抽取**：`branch-bridge.js` 内联的桥接均匀平滑（Laplacian）抽成新模块 `modules/geometry/mesh-smooth.js` 的 `smoothMeshVertices(vertices, quads, movable, strength, iterations, positionAt)`，branch-bridge 改调用（860 次随机对照逐位一致）。
> - **UI**：新增 `#sweepOverlapPanel`（strands 组，位于 #branchBridgePanel 之后）3 个滑块：Sweep Overlap Strength（0–1，默认 0.7）/ Sweep Overlap Threshold（0.1–2，默认 0.6）/ Sweep Edge Smooth（0–1，默认 0.3）；per-lock 字段随 .ahs 自动持久化；无选中写 hairState 全局默认；ZH/JA 词典各 +3 key。
> - **默认参数**：`SWEEP_OVERLAP_DEFAULTS` 由 `strand-sweep.js` 导出（单源），UI 与几何共用；strength/edgeSmooth 关到 0 时输出与改动前逐位一致。
> - 回归：core-math 114 pass（+2 新单测）、verify-smoke 10/11=基线、dom-contract 16/89 不变。

## 最近更新（0.2.65）

> 发尖控件 4 项修复（分支 0.2.64-panel-tip-curve，详见 [archive/panel-split-tip-bones.md](archive/panel-split-tip-bones.md) §8.29）：
> - ① 绿色 spread 手柄视口拖拽热同步 Main 面板 Segment Spread（`updatePanelSplitHandleDrag` segment 分支补 `syncPanelSegmentControls`）；
> - ② 所有段绿色手柄在任一子发尖选中时显示、拖非选中段不切换选中——有意设计，`bone-view-handles.js` 补注释规范化；
> - ③ 绿色手柄位置改跟随 tip trim/curve（`tipSurfaceFrameAt`）+ 沿切线外推 `TIP_SEGMENT_HANDLE_TANGENT_OFFSET=0.08`，不再浮在未 trim 尖端；
> - ④ W 移动 gizmo 可挂发尖子骨骼（gizmo 挂载扩为 move/rotate/scale），translate 用 `solvePulledStrand` 按 fork 以下暴露区整体求解（`beginTipSubBoneTranslate` / `applyTipSubBoneTransform` translate 分支），app.js `dragging-changed` 支持 translate。
> - ⑤ 修复两个遗留问题：W 移动 gizmo 拖点不生效（`beginTipSubBoneTranslate` 漏导出，`bonesApi.beginTipSubBoneTranslate` 为 undefined → translate 分支提前 return）；绿色手柄叠加 authored delta（`points[last]−restPoints[last]`），跟随用户修改的发尖位置（详见 §8.30）。
> - ⑥ 快捷键修复：数字/日期等可键入数值的输入框不再被 1/2/3（workspace）与 q/w/e（工具）快捷键抢占——`focusedControlShouldYieldToShortcut` 把 number/date/datetime-local/time/month/week 视为文本输入（core-math 契约测试同断言）。

## 最近更新（0.2.59）

> Panel split 尖端子骨骼系统已落地 + 本轮 UI/交互收尾（详细记录见 [archive/panel-split-tip-bones.md](archive/panel-split-tip-bones.md) §8.5–§8.9，权威当前状态）：
> - 已实现：程序化权重字段（panelWeights）+ `splitBone.tip` 链 + 每段 tip 手柄/高亮 + USDA SkelBindingAPI 蒙皮 + `bonesFor` 只读骨骼视图 + `lock.bones` registry 双写；§8.6–§8.8 修复：点击 toggle 选中 + 保持主发丝、overlay z-fighting、双段高亮、笔刷保留 tip UI、边界段 tip 链、orient/scale 统一变换、undo tip 持久化、笔刷 bones-only、alt+点击切换。
> - 本轮（0.2.59 进行中）：发丝悬停改柔和橙色高亮（hoverOutline）、切换主选中清旧 tip 选中/高亮、alt+点击仅真点击触发、tip 子骨骼完整切线/副切线/法线帧（orient 旋转几何）、修复选中发尖后 Push 笔刷。
> - 8.19（0.2.59 进行中）：发尖 WidthCurve 修复——① `tipWidthEdgePosition` 的 `lateral` 改用发尖自己 authored 宽度轴（dq*主帧x）并把 baseEdge 提到前表面 shell=1，消除拖拽方向 7°~170° 倾斜的「梯形」手感；② `sampleAsymmetricTaperCurve`（modules/geometry/curve-math.js）由 u<0 硬切分改为线性插值（u=0=左右均值，主面板/strand 非对称一致受益）；③ 拖拽去重（begin 只 materialize 一次并复用 `tipWidthBones`、`setTipWidthCurveValue` 只重建编辑侧曲线）。详见 archive/panel-split-tip-bones.md §8.19。
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

