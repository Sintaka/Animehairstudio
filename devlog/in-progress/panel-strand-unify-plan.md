# Panel ↔ 普通发丝统一（发尖子骨骼普适化）计划

> 分支：`0.2.62-panel-strand-unify`。本文件是「先统一 panel 和普通发丝，骨骼系统随普适化同步成型」的实施计划骨架，供接手 agent 补齐细节。
> 前置评估（已落盘）：`devlog/in-progress/unified-bone-model.md` §6（panel/strand 兼容 + tip 迁移 + 骨骼统一）；app.js 瘦身结论见 `devlog/APPJS_SPLIT_GUIDE.md` §8（已判定不再瘦身）。

## 0. 排序决策（已定）

- **先做 panel 和普通发丝统一（geometry / 发尖子骨骼普适化），不单独先建「统一骨骼系统」。**
- 骨骼系统作为数据/视图层随普适化同步成型：`bone-model.js` 输出 strand 的 tip/split 骨骼，`lock.bones` registry 与 `bonesFor` 的 `kind` 标签是统一接缝。
- **不引入 scale**：tip 长短 = tip 链点（rest + delta），宽度 = spread（相对收窄）+ Width/Depth 曲线。`bone-model.js` 里始终为 null 的 `scale` 占位字段在本次统一中顺手删除，不扩展。

## 1. 目标

- 让所有带 zipper 的发丝都拥有成熟的尖端子骨骼编辑：tip 长短/走向 + 每段（或每管）Width/Depth 曲线 + spread。
- 普通发丝按两阶段推进：先「单尖端子骨骼」（Route 1），再做「split 两管子骨骼」（Route 2）。

## 2. 路线（详见 unified-bone-model.md §6.4）

- **Route 1（先）**：普通发丝单尖端子骨骼——t-only 权重（`tipStart` → 1 沿整根线性爬升，无需 u），复用 `tipTransform` / `tipChainFrameAt` / 曲线编辑 UI / 浮动面板。
- **Route 2（后）**：`createSplitStrandGeometry` 升级为「两根管子各一个子骨骼」——把绝对 `splitGap` 换成相对 spread + 每管 Width/Depth 曲线，给每顶点 [tube, weight]（现有 `sectionBases` 已能定位两根管），与 panel 语义对齐（相对、无 crossover），接入同一套曲线 UI/手柄。
- **统一接缝**：`splitBonesFor(lock)` 泛化接受 strand split 描述（`strandSplitBones` 或由 `strandSplit*` 派生）；tip 链/权重原语抽到发丝无关模块（如 `modules/geometry/tip-sub-bone.js`），避免 panel/strand 双份实现。

## 3. 待接手 agent 补齐

- 数据模型 / 序列化 / 镜像 / 快照 / stroke / creation 字段清单（含旧 .ahs 无新字段时的派生默认）。
- 每阶段 commit 切分与 `verify-tip-select` / `verify-smoke` 回归策略。
- UI/视口手柄与曲线面板的复用矩阵（panel 现有 `panelTipHandles/Lines`、`tipWidthHandles/Lines`、spread 手柄、segment 曲线面板）。
- 风险与回退：旧档派生默认、USDA `skel:joints/weights` 对 strand tip 的导出、镜像段序/符号。
- 明确 `scale` 占位字段的删除点与 USDA 导出是否引用（当前均为 null）。

## 4. 与死代码清理的关系

- 本轮已删除 server.js 的原作本地保存死代码（原生 SaveFileDialog `/api/save-project`），Quick Save（File System Access API）继续作为唯一保存路径。
