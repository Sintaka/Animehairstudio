# 骨骼系统推进路线图 + 持久化多骨骼设计（0.2.59 规划）

> 分支：0.2.58-panel-split-refactor；目标版本 `0.1.4-Sintaka.0.2.59+`。本文为骨骼系统「如何推进 + 后续持久化多骨骼如何实现」的**规划**（Task 3），实施按 Phase 分批。
> 关联：unified-bone-model.md（P1 设计）、split-bone-refactor-plan.md（P1 实施）、annotations-panel-zipper.md / annotations-split.md（0.2.58 调研）。

## 1. 现状（0.2.59 audit 摘要）

- split 子骨骼（panel）：`lock.splitBones` 已落地——混合持久化、序列化/快照/镜像/stroke、几何（段内 u' + 每段曲线 + 相对 spread）、UI/视口、EN/JA/ZH。
- 统一视图 `bonesFor(lock)`：模块里有，**app.js 未 import/未消费**（scaffold）。
- 「主骨骼架空」语义：未落地（无代码把 main 链当纯层级根）。
- 骨骼导出：`#exportIncludeBones` 复选框存在，但 OBJ/USDA 导出器**未实现**骨骼输出（当前无消费方）。

## 2. 目标

- **KineFX 式**：所有骨骼都是带 `name` 的 P + 旋转点（无矩阵）；命名空间隔离 `main.*` / `split.*` / `child.*`，不冲突、不混淆。
- **统一视图**：`bonesFor(lock, { locks })` 返回主链 + split 子骨骼 + 子发片链；**有子骨骼才架空** main 链（作为层级根），两者皆无时 main 链直接驱动扫掠（现状）。
- **混合持久化**：只持久化「创作骨骼」；主链（points）/子发片链（points/branchLocalPoints）始终派生，不入存档。

## 3. 推进路线

### Phase A — 接入 bonesFor（近端，无 schema 变更，独立 commit）
- **接线**：app.js import `bonesFor`；新增消费方时传 `options.locks`（子发片链）。
- **消费方 1：骨骼导出**——OBJ/USDA 导出器实现 `#exportIncludeBones`：按 `bonesFor(lock, { locks })` 输出统一骨架（bone 名 / parent / P / orient 四元数），主链按参数链式 parent。
- **消费方 2：视口骨骼调试视图**（可选开关）——显示 main/split/child 骨点 + 名称（复用 `createSplitControlHandle` 一类小点）。
- 验证：0044 导出含骨骼层级；三档 smoke 11/11；无几何变化。

### Phase B — 架空语义 + 叶子驱动（独立 commit）
- `bonesFor` 输出为每条骨骼加 `isRoot`/层级角色：strand 有 splitBones 或 branch children 时，main 链作层级根，叶子 = `split.*` 与 `child.*`；两者皆无时 main 链为唯一几何骨骼。
- 几何不动（panel 已用 splitBones；子发片已用自身扫掠）；架空只影响视图/导出/未来编辑。
- 验证：bonesFor 快照断言（有/无子骨骼时 main 角色正确）；smoke。

### Phase C — 持久化多骨骼（统一 registry，核心）

**数据模型（新增可选 `lock.bones`）**
```
lock.bones = [{
  name: "split.0" | "child.<id>.0" | "custom.x",
  parent: "main" | <bone name>,
  parentParam: <t 沿主链>,
  p: {x,y,z}, orient: {x,y,z,w}, scale: {x,z},
  kind: "split" | "child" | "custom",
  meta: { ... }   // 曲线/spread/句柄等特性数据
}...]
```
- **主链 / 子发片链保持派生**（points / branchLocalPoints），不入 registry——避免数据重复。
- **迁移**：0.2.59 的 `splitBones` 读取为 `kind:"split"` 条目（兼容别名）；新写档优先 `lock.bones`；快照/undo/镜像（名称、横向符号、段序反转）/stroke/creation 链路补齐。
- **读路径**：`bonesFor(lock, { locks })` = 主链派生 + `lock.bones` + 子发片链派生，按 name 合并；`splitBonesFor` 退化为对 `kind:"split"` 条目的便捷读写（向后兼容）。
- **消费方**：
  - 骨骼导出（Phase A 的统一骨架，数据源换 registry）。
  - 视口：`kind` 带 handle 的骨骼显示 transform gizmo（P/orient 编辑，panel 段手柄已示范）。
  - 几何（后续）：`meta.deform` 条目可驱动局部偏移（panel split 用 spread/曲线；strand 多骨骼编辑待定）。
- **验证**：.ahs 往返（splitBones→bones 不丢）、快照/镜像/stroke 回归、bonesFor 一致性断言、三档 smoke。

## 4. 决策 / 假设

- 旋转统一四元数 `{x,y,z,w}`；**不引入矩阵**。
- 混合持久化：只持久化创作骨骼；主链/子链派生。
- 命名空间隔离：`main.*` / `split.*` / `child.*`；parent 引用为 bone name（KineFX 式）。
- panel 暂不支持桥接类子骨骼（范围外，不变）。
- 每 Phase 独立 commit + verify-smoke 回归；Phase C 的 `lock.bones` 是向后兼容的增量字段，不破坏旧档。
