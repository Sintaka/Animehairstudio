# 统一骨骼模型（KineFX 式，混合持久化）— P1 设计

> 分支：0.2.58-panel-split-refactor；目标版本 `0.1.4-Sintaka.0.2.59`。本文件为 P1 统一骨骼模型的**设计规范**；实施见 split-bone-refactor-plan.md（P1）。
> 灵感：Houdini KineFX——所有骨骼都是普通点，带 `name` 和 transform；本项目无矩阵，只有 **P（位置）+ 旋转（四元数）**。
> **✅ 已实现（0.2.59）**：Phase A/B/C 全部落地——`bonesFor` 被 app.js 消费（USDA 骨骼导出）、main 链架空 role 语义、`lock.bones` 统一 registry 双写，见 bone-system-roadmap.md §4.5 实施状态；panel 尖端子骨骼见 panel-split-tip-bones.md §8.5–§8.9。下文 §4.5 审计中「未接入/未落地」表述已过时，以 bone-system-roadmap.md §4.5 为准。

## 1. 统一视图 bonesFor(lock)

- 新模块 `modules/geometry/bone-model.js`，导出 `bonesFor(lock)`（只读）：返回该 strand 全部骨骼：
  ```
  { name, parent, parentParam, p:{x,y,z}, orient:{x,y,z,w}, scale:{x,z} }
  ```
- 层级约定：
  - 主骨骼链：`main.0` … `main.N-1`（根，`parent` 链式 `main.i-1`；`parent=null` 仅 `main.0`）。p = `lock.points[i]`，orient = `strandGeometryFrameAt(lock, curve, i/(N-1)).quaternion`（**派生，不持久化**）。
  - split 子骨骼：`split.0` … `split.K`（K = `panelSplits.length`），`parent="main"` + `parentParam`（沿主链 t）。p/orient **持久化**于 `lock.splitBones`。
  - 子发片主链：`child.<lockId>.0` …（该子发片自己的主骨骼链），根 `parent="main"` + `parentParam=branchParentParameter`；内部链式。数据来自子发片 `lock.points`/`branchLocalPoints`（**派生，不持久化**）。
- 命名空间天然隔离：split 子骨骼控制主发丝 split 段区域，子发片主链控制子发片区域——**不冲突、不混淆**（用户原始意图）。

## 2. 「架空」语义（主骨骼有子骨骼才架空）

- strand 有 `splitBones` **或** branch children 时：`bonesFor` 把 main 链作为**层级根节点**，几何由叶子骨骼驱动（split 段由 split 子骨骼驱动；子发片由子链驱动）。
- 两者皆无（简单发丝）：只返回 main 链，几何路径 = 现状 `createBaseHairGeometry`（零改动）。
- 该语义只影响**读取/编辑层**（bonesFor 与骨骼手柄），不影响既有几何函数。

## 3. 持久化策略（混合）

- **持久化**：仅新创作的 split 子骨骼（`lock.splitBones`，含 p/orient + 段曲线）。主链/子链沿用现有字段（points/pointTwists/pointScales/branchLocalPoints）。
- **不新增矩阵**：旋转统一四元数 `{x,y,z,w}`（THREE.Quaternion 可序列化）。
- 旧档无 `splitBones` → 内存派生默认骨骼，不写回；用户编辑后整体落盘。

## 4. 兼容性

- `bonesFor` 只读；不改变 `createHairGeometry` 分流、branch bridge/region/root-bone 现有路径。
- 子发片系统字段（branchParentId/branchParentParameter/branchRootRegion/branchLocalPoints）全部原样；层级视图中的 `child.*` 骨骼由它们派生。
- panel 暂不支持桥接类子骨骼（范围外）。

## 4.5 实施状态审计（0.2.59，Task 1）

- **split 子骨骼（P1a–P1d）：符合计划、已落地**——`lock.splitBones` 数据/混合持久化/序列化链路（serializer/snapshot/mirror/stroke/creation）、几何（段内 u' + 每段曲线 + 相对 spread）、UI（段选择器/spread 滑杆/taperCurveEditor segment 模式）、视口段手柄、镜像段序反转全部接入。
- **统一视图 `bonesFor(lock)`：结构符合计划但未接入 app**——主链 `main.0..N-1`（链式 parent）+ `split.*` + `child.<lockId>.i`（根 parent=`"main"`、parentParam=branchParentParameter）输出正确；但 app.js **未 import/未消费**，子发片链从未进入任何运行路径，「框架内统一包含子发片和主发丝多骨骼」尚未实现（当前仅是未使用的模块 API）。
- **「主骨骼架空」语义：未落地**——无代码把 main 链当纯层级根；panel 几何仍由主曲线 + splitBones（spread/曲线）驱动，split 子骨骼的 p/orient 是视图/手柄数据，未替换主链作几何驱动。
- **后续计划（决策）**：① 为 bonesFor 找真实消费方（导出骨骼、调试视图、或后续「多骨骼编辑」）；② 接入时传 `options.locks` 使其包含子发片链；③ 「架空」语义随消费方一起落地（有 split/child 时 main 链作层级根）。在此之前 bonesFor 保持为只读 scaffold，不影响现有路径。

## 5. 里程碑

- P1a：bone-model.js（bonesFor）+ splitBones 数据/序列化链路（零几何变化）。
- P1b：createPanelStrandGeometry 重铸（见 split-bone-refactor-plan.md §3）。
- P1c/P1d：UI/视口（段选择器、每段曲线、split 子骨骼手柄、镜像段序、EN/JA/ZH）。


## 6. Panel ↔ 普通发丝兼容性与发尖子骨骼迁移评估（0.2.61，深度评估）

> 结论：**几何层已部分统一（扫掠内核），但「split/发尖子骨骼」当前是 panel 专属；迁移到普通发丝可行，但需要先抽取发尖通用原语，并按「单发丝尖端子骨骼 → split 两管子骨骼」分两步走，而不是照搬 panel 的 u 分区/权重数学。**

### 6.1 现状差异（panel vs strand）

- 共享：`strand-sweep.js` `sweepSide` 已统一「默认发丝扫掠 + 子发片扫掠」（同曲线/同 `strandGeometryFrameAt`/`strandProfileTopologyAt`/`sampleScale`）。
- panel（`createPanelStrandGeometry`）：**不走 sweepSide**——它是 u 参数化连续曲面（front/back 壳 + 墙/端盖），用 `panelWeights`（每顶点 [mainJoint, segment, weight]）+ `tipTransform` 做尖端子骨骼混合；`panelSplits` 把 u 切成 N+1 段。
- strand split（`createSplitStrandGeometry`）：**1 个 split** 把截面多边形切成两根**闭合管子**，沿同一条曲线扫掠，开口用绝对 `splitGap × smoothstep × direction`；无子骨骼、无 tip 链、无每顶点权重（顶点只属于某根管子，不混合）。
- 结论：两者「split」语义不同——panel 是连续曲面的 u 分区，strand 是截面多边形硬切成两根管。直接复用 panel 的 `tipSegmentWeightAt`/`splitTipForSegment` 需要 u 参数化，而普通发丝没有 u。

### 6.2 发尖子骨骼的依赖清单（要迁移必须先泛化）

- 数据：`lock.panelSplits` → `splitBonesFor`（N+1 split bone + tip）；strand 只有标量 `strandSplit*`。
- 几何：`tipSegmentWeightAt`（u 边界 + 每侧 fork → weight）、`splitTipForSegment`（rest 链 + authored tip 链）、`tipTransform`（rest→authored 四元数 + twist roll）。
- UI/手柄：`panelTipHandles/Lines`、`tipWidthHandles/Lines`、spread 手柄、segment 曲线面板——全部以 `segmentIndex`/`panelSplits` 为键。
- 导出：`panelWeights` → USDA `skel:joints/weights`；`bonesFor` 输出 `split.k` + `split.k.tip.i`。

### 6.3 兼容与复用可能

- 高复用：tip 链（rest+delta）、twist roll、frame 跟随、Width/Depth 曲线采样、曲线编辑 UI、`bonesFor` 的 `kind` 标签——这些与 u 无关，可抽成发丝无关模块。
- 低复用（panel 专属，不应硬搬）：`panelWeights` 的 u 分区、`tipWidthSpreadGap` 的段内相对开口、zipper 墙/端盖拓扑。
- 骨骼模型已泛化：`normalizeBone/normalizeSplitBones` 已接受 `tip` 对象与曲线；`lock.bones` registry 与 `bonesFor` 的 `kind` 字段是统一接缝——普通发丝只需产出同构的 `split/tip` 条目。

### 6.4 推荐迁移路线（骨骼统一视角）

- **Route 1（最小，先做）**：给普通发丝加「单尖端子骨骼」——数据用 `lock.strandTip`（或单元素 `splitBones`），几何用 t-only 的 `strandTipWeights`（从 `tipStart` 到 t=1 沿整根线性爬升，无需 u），复用 `tipTransform`/`tipChainFrameAt`/曲线面板；`bonesFor` 输出 `main.N-1.tip.i`。收益最高、风险最低，直接复用现有发尖编辑 UX。
- **Route 2（后做）**：升级 `createSplitStrandGeometry` 为「两根管子各一个子骨骼」——把绝对 `splitGap` 换成相对 spread + 每管 Width/Depth 曲线，给每顶点 [tube, weight]（现有 `sectionBases` 已能定位两根管），与 panel 语义对齐（相对、无 crossover），并接入同一套曲线 UI/手柄。
- **统一接缝**：把 `splitBonesFor(lock)` 泛化为接受 strand split 描述（`strandSplitBones` 或由 `strandSplit*` 派生长度为 1 的 splits），`bonesFor` 已按 `kind` 输出，USDA/调试消费方即可统一。
- 不建议：把 panel 的 `panelWeights`/zipper 数学照搬到普通发丝；u 分区应保持 panel 专属。

### 6.5 决策建议

- 优先级：Route 1 > Route 2 > 「全套 panel 化」。
- 落地前先把 tip 链/weight 原语抽到发丝无关模块（如 `modules/geometry/tip-sub-bone.js`），避免 panel/strand 双份实现。
