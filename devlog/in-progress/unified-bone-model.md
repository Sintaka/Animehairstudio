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