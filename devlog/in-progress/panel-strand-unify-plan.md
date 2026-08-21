# Panel ↔ 普通发丝统一（发尖子骨骼普适化）计划

> ## 状态总览（0.2.126 更新）
>
> **Route 1 / Route 2 均已实现（0.2.62）**，此后统一工作又推进了三轮。**本文 §1–§5 是 0.2.62 的计划期内容**，读时注意下表：
>
> | 统一项 | 状态 | 落点 / 权威文档 |
> |---|---|---|
> | Route 1：普通发丝**单**尖端子骨骼 | ✅ 0.2.62 | `lock.strandTip`/`strandTipStart`；`modules/geometry/tip-sub-bone.js` |
> | Route 2：split 发丝**每管**子骨骼 | ✅ 0.2.62 | `lock.strandSplitBones`（0.2.116 起 2 → N+1 管） |
> | 段数 / 段骨骼 / 段号钳位的单一分派 | ✅ 0.2.125 | `bone-model.js` 的 `PANEL_SEGMENT_HOST`/`STRAND_SEGMENT_HOST` + `segmentBoneHost` + `resolveSegmentSelection` |
> | 每段（每管）编辑 UI | ✅ 0.2.125 | `segment-control.js` 的 `syncSegmentControls(target, host)` + `segmentUi(host)` |
> | 发尖 **WidthCurve** 曲线数学 | ✅ 0.2.125 | 共享层 `modules/geometry/tip-width-curve.js`（以相邻 zipper 高度为入参）+ 发丝侧 `strand-tip-width.js`；见 [strand-tip-width-ui-port-plan.md](strand-tip-width-ui-port-plan.md) |
> | 发尖 **选中系统**（选中/悬停/gizmo/笔刷/把手） | ✅ 0.2.126 | `modules/bones/tip-sub-bone-host.js` 的 `resolveTipHost`；状态键 `tipSelection`/`tipHover`；见 [strand-tip-selection-port-plan.md](strand-tip-selection-port-plan.md) |
>
> **仍未做 / 刻意不做**：
> - **统一骨骼 registry 收纳发尖**：`strandTip` 仍是顶层字段、未并入统一 registry（§5.2 末尾即如此计划，延后至今）。
> - **§0 的 `scale` 占位字段删除**：计划写「顺手删除」，**未执行**——`bone-model.js` 中该字段仍在。删前需确认 USDA 导出不引用。
> - **N>2 split 发丝的子发片桥接**：门控禁用（见 [strand-zipper-port-plan.md](strand-zipper-port-plan.md) Phase F）。
> - **strand 拉链 snap-to-loops**：判定为非缺口（发丝无纵向 loop 拓扑可吸附）。
> - **曲率收窄 `factors` 在发丝侧的把手复现**：刻意不做，取舍写在 strand-tip-width.js（`STRAND_TIP_WIDTH_FACTORS_APPROXIMATION = 1`）。
>
> 残余重复推导规则的审计见 [tip-subsystem-reuse-audit.md](tip-subsystem-reuse-audit.md)。

> 分支：`0.2.62-panel-strand-unify`。本文件是「先统一 panel 和普通发丝，骨骼系统随普适化同步成型」的实施计划骨架，供接手 agent 补齐细节。
> 前置评估（已落盘）：`devlog/archive/unified-bone-model.md` §6（panel/strand 兼容 + tip 迁移 + 骨骼统一）；app.js 瘦身结论见 `devlog/APPJS_SPLIT_GUIDE.md` §8（已判定不再瘦身）。

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


---

## 5. 本轮执行细化（2026-08-13，supervisor 落地）

> 状态：Route 1 + Route 2 已实现（2026-08-13），剩余骨骼系统随普适化继续。本节把 §3「待接手 agent 补齐」落成可执行的字段/API/文件边界与分派顺序。编码铁律见 `devlog/APPJS_SPLIT_GUIDE.md` §7：改中文文件一律 UTF-8 无 BOM + CRLF，禁止 PowerShell 管道喂中文给 node stdin。

### 5.1 分派顺序（文件不相交）

1. **子智能体 A（基础层）**：新增 `modules/geometry/tip-sub-bone.js`（发丝无关的 tip 链/帧/权重纯函数）+ 改 `modules/bones/bone-model.js`（strand tip 数据模型 + bonesFor 输出 main.N-1.tip.i）。
2. **子智能体 B（几何层）**：改 `modules/geometry/strand-geometry.js`（Route 1：普通发丝单尖端子骨骼）+ 改 `modules/geometry/panel-tip-strand.js`（内部改用 tip-sub-bone 原语，行为不变）。
3. **子智能体 C（UI/编辑器层）**：改 `modules/geometry/taper-editor.js`、`modules/bones/bone-view-handles.js`、`modules/bones/segment-control.js`（普通发丝 tip 长度/曲线/手柄复用）。
4. **主进程（supervisor）**：app.js import/decs 装配 + snapshot/restore/mirror 串行化接线 + modules/io 保存/导出接线 + 合并审查 + node --check + verify-smoke + 版本号 + 本 devlog。

> B/C 只读依赖 A 的 `tip-sub-bone.js` 导出；B 与 C 文件集不相交，可并行。

### 5.2 Route 1 数据模型（普通发丝单尖端子骨骼）

- 新字段 `lock.strandTip`（可空；旧档 null → 内存派生默认，编辑后落盘）：
  - `points`：authored tip 链点（世界坐标）。
  - `restPoints`：rest 链点（派生）。
  - `twists`：每点 twist roll。
  - `active`：是否启用（默认 true 仅当 authored/显式开启）。
- 新字段 `lock.strandTipStart`：t 权重起点，默认 `0.75`，clamp `[0.2, 0.95]`。
- 权重 `tipWeightAt(t, tipStart) = clamp((t - tipStart) / max(1e-4, 1 - tipStart), 0, 1)`（t-only，无需 u）。
- 链点数采用 `lock.points.length`（与 panel tip 同构，方便复用 `CatmullRomCurve3` 与既有序列化），restPointAt = `curve.getPoint(t)`（普通发丝中心线即自身曲线）。
- 镜像：x 翻负 + twists 取反；快照/恢复走 app.js `snapshotState`/`restoreLock`，保存走 `registryForSave` 之外的 `strandTip` 顶层字段（本轮不并入统一 registry，骨骼系统延后）。

### 5.3 Route 2 数据模型（split 发丝两管子骨骼，后续执行）

- 每个管一个 tip 子骨骼：`lock.strandSplitBones` = 长度 2 的数组（kind="split"），每个含 `tip`、`spread`、`taperCurve/depthCurve`。
- `strandSplitGap` 绝对开口改为相对 `spread` + 每管 Width/Depth 曲线；几何用 `sectionBases` 给每顶点 `[tube, weight]`。
- `bonesFor`/`splitBonesFor` 泛化接受 strand split 描述，接同一套曲线 UI/手柄；`createSplitStrandGeometry` 两管分别跟随各自 tip 链。

### 5.4 tip-sub-bone.js 拟定导出（纯函数）

- `materializeTipChain(authored, restPointAt, count)` → `{ restPoints, points, twists, active }`
- `tipChainFrameAt(restTip, tip, t, referenceFrame)` → `{ x, y, z }`
- `tipWeightAt(t, tipStart)` → number
- `sampleTipPosition(tip, t)` → `{x,y,z}`
- `cloneTip(tip)` / `mirrorTip(tip)`

### 5.5 验证

- `node --check` 全绿；`node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs` 基线 10/11（branch-bridge 内容相关失败与 HEAD 一致）。
- 普通发丝开启/编辑 tip 不破坏默认扫掠（无 tip 时行为不变）；旧 .ahs 无 `strandTip` 正常加载并派生默认。
- USDA 骨骼导出本轮仅保证不回归（骨骼/weights 正式导出延后到骨骼系统轮）。

### 5.6 Route 1 实施记录（2026-08-13）

- 基础层：`modules/geometry/tip-sub-bone.js`（发丝无关 tip 链/帧/权重纯函数）+ `modules/bones/bone-model.js`（`strandTip` 数据模型、`bonesFor` 输出 `main.N-1.tip.i`）。
- 几何层：`strand-geometry.js` `createBaseHairGeometry` 普通发丝 tip 重投影（t-only 权重 `tipWeightAt` + `tipChainFrameAt`）；`panel-tip-strand.js` 内部改用 tip-sub-bone 原语（行为不变）。
- 视口层：`bone-view-handles.js` 普通发丝 tip 手柄 + 引导线（显示，拖拽编辑延后）。
- 修复跨层消费：`bone-interaction.js` 两处普通对象→Vector3；`scripts/verify-tip-select.mjs` 同修。
- 集成：app.js/ index.html 增加 Tip Sub-Bone 控件（enable / tip start / tip length / reset）；快照/镜像/恢复/保存接 `strandTip`/`strandTipStart`；版本 0.2.62，缓存号 20260813-1。
- 验证：`node --check` 全绿；`verify-smoke` 10/11（branch-bridge 内容相关失败与基线一致）。
- 明确延后：普通发丝 tip 的视口拖拽/旋转编辑、骨骼 registry 统一、USDA weights/skel:joints——待「骨骼系统」轮随普适化继续。

### 5.7 Route 2 执行细化（2026-08-13，split 发丝两管子骨骼）

> 状态：已实现（2026-08-13）。目标：让 `createSplitStrandGeometry` 的两根闭合管各拥有一个 tip 子骨骼，复用 Route 1 的 `tip-sub-bone` 原语与 `bonesFor` 接缝；本轮先做「数据 + 几何 + 序列化 + 最小 UI」，每管独立 Width/Depth 曲线与视口拖拽编辑随骨骼系统轮补齐。

- 数据模型：
  - `lock.strandSplitBones` = 长度 2 数组（可空），每项复用 split bone 形状：`{ name, parent, parentParam, p, orient, tip, spread, taperCurve, taperCurveSecondary, depthCurve, depthCurveSecondary, asymmetricWidthCurve, asymmetricDepthCurve }`，kind="split"。
  - 默认 `spread = clamp(strandSplitGap, 0, 0.99)`（相对语义，与当前绝对 `strandSplitGap` 的默认观感一致；不引入 panel 的 ×2）。
  - `bonesFor(lock)`：strand split 时输出 `split.0/split.1` 及 `split.k.tip.i` 叶子，主链 role=root；与 Route 1 的 `strandTip` 互斥（split 时不输出 `main.N-1.tip.*`）。
- 几何（`createSplitStrandGeometry`）：
  - 每管 tip 链 rest = 管中心线 `curve.getPoint(t) + frame.x * (baseWidth * bone.spread * smoothstep(t, splitStart, 1) * direction)`；authored delta 用 `materializeTipChain` 叠加。
  - 每管在 `t >= splitStart` 用 `tipWeightAt(t, splitStart)` 把环顶点 blend 到 tip 链 frame；端盖 outward 改用每管 `tipChainFrameAt(...,1)` 的 y。
  - 输出 `geometry.userData.strandSplitWeights`（每顶点 [tube, 0, weight]）供后续 USDA/高亮；fused grid/sectionBases 元数据保持不动。
- 最小 UI（主进程）：Split Tip Length + Reset Split Tips；Split Spacing 继续写 `strandSplitGap` 并派生两管 spread。
- 验证：`node --check`；`verify-smoke` 10/11 基线；旧 split 发丝无 `strandSplitBones` 时默认派生、观感不变。

### 5.8 Route 2 实施记录（2026-08-13）

- 数据层：`bone-model.js` 新增 `strandSplitBonesFor/materializeStrandSplitBones/strandSplitBonesToData/FromData/mirrorStrandSplitBones`；`bonesFor` 对 split 发丝输出 `split.0/split.1` 与 `split.k.tip.i`，并与 Route 1 `strandTip` 互斥。
- 几何层：`strand-geometry.js` `createSplitStrandGeometry` 改为每管相对 spread（默认 `strandSplitGap` 数值等价）+ 每管 tip 链重投影 + 端盖随 tip 帧；输出 `geometry.userData.strandSplitWeights`；fused grid/sectionBases 不变。
- 视口层：`bone-view-handles.js` 为两根管各加 tip 手柄 + 引导线。
- 集成：`app.js`/`index.html` 增加 Split Tip Length + Reset Split Tips；序列化/镜像/快照/恢复接 `strandSplitBones`。
- 验证：`node --check` 全绿；`verify-smoke` 10/11（基线一致）。
- 延后：每管独立 Width/Depth 曲线面板、视口拖拽旋转编辑、USDA `skel:joints/weights`——随骨骼系统轮继续。

---

## 6. 全量统一评估（panel ↔ strand 单内核，2026-08-13）

> 用户命题：panel 与普通发丝是否可合并为同一架构，仅通过创建时预设参数不同达成。结论：**可行，但不是零成本直接合并**；需要先做一次「剖面 / split / tip 子骨骼 / 每顶点权重」内核抽象，之后 panel 与 strand 才成为同一内核的两个预设。当前已具备部分共享件，仍有 4 个关键缺口。

### 6.1 已共享（可复用）
- `modules/geometry/tip-sub-bone.js`：tip 链/帧/权重纯函数，panel 与 strand 已共用（Route 1/2 落地）。
- `modules/bones/bone-model.js`：`bonesFor` 统一视图 + `normalizeBone/normalizeStrandTip/strandSplitBones` 数据形状已基本对齐。
- `modules/geometry/strand-sweep.js`：闭合管扫掠内核（strand + child 共用）；panel 尚未接入。
- 序列化/镜像/快照/恢复：`splitBones` / `strandSplitBones` / `strandTip` 均已接。

### 6.2 关键差距
1. **几何拓扑不同**：
   - strand：闭合管；split = 1 个切分 → 两根闭合管（`createSplitStrandGeometry`，`sectionBases`）。
   - panel：开放曲面（front/back + side walls + zipper walls + caps），u 方向 N 个 zipper → N+1 段（`createPanelStrandGeometry`，`addPatch/addQuad`）。
   - 统一需要一个 `profile` 抽象支持 `closed: true/false` 与 `splits[]`（0..N），并让 wall/cap/zipper 拓扑作为 open-profile 特例生成。
2. **参数化维度不同**：
   - strand 只有 t；split 由标量 `strandSplitPosition/Height/Gap`。
   - panel 是 t×u；split 是 `panelSplits[{position,height}]`，`panelWeights` 需要 u。
   - 统一需给 strand 一个隐式 u（剖面环/宽度坐标），或让权重只依赖「leaf bone + t」、split 位置由 leaf 决定。
3. **每顶点权重索引模型不同**：
   - panel：`panelWeights[vertex*3] = [mainJoint, segment, weight]`（panel-tip-strand.js L889/894）。
   - strand split：`strandSplitWeights[vertex*3] = [tube, 0, weight]`（strand-geometry.js L169）。
   - 统一为 `[leafBone, weight]`（或 `[main, leaf, weight]`）后，高亮 / USDA / 镜像可共用。
4. **数据模型与 UI 不同**：
   - panel：`panelSplits` + `splitBones`；segment selector + spread + 每段 Width/Depth 曲线 + zipper/tip 手柄。
   - strand：`strandSplit*` + `strandSplitBones`（2 管）+ `strandTip`；Split Spacing + Split Tip Length + 单尖/两管手柄。
   - 统一为 `splits`（通用）+ `tipBones`（通用 leaf list）+ `profile` 预设；编辑器改为 leaf 驱动（现有 `taper-editor` 的 segment 模式可泛化）。

### 6.3 推荐路线（达成「仅预设不同」）
- Phase A（已完成）：tip 原语 + `bonesFor` + strand 单尖/两管 tip。
- Phase B（已完成 2026-08-13）：抽象通用 `leafWeights`，统一 panel/strand 每顶点权重形状。
- Phase C：泛化 `sweepSide` 支持 open profile + 0..N splits；panel 改走该内核，保留 zipper wall/cap 生成作为 open-profile 特例。
- Phase D：数据字段迁移 `panelSplits/splitBones` → 通用 `splits/tipBones`（旧档兼容），UI 改为 leaf 驱动；`createHairGeometry` 单入口。

### 6.4 风险与回归
- child-strand bridge 依赖 `createSplitStrandGeometry` 的 `sectionBases/splitFusedGrid/quadFaces/triangleEdgeMasks` userData 契约，内核泛化必须保持。
- panel 水密性、线框 mask、折叠 quad 清理、镜像段序、旧 .ahs 派生默认不能破坏。
- 建议按 Phase 提交，每 Phase `node --check` + `verify-smoke`（10/11 基线）+ seam/契约 CDP。

### 6.5 Phase B 实施记录（2026-08-13）

- 新增 `modules/geometry/leaf-weights.js`：统一每顶点 leaf 权重 `[mainJoint, leafIndex, weight]`（stride 3）及 `leafWeightAt/leafIndexAt/leafWeightValueAt/leafWeightsValid` 纯函数。
- `createSplitStrandGeometry`：`strandSplitWeights` 由 `[tube,0,weight]` 改为 `[mainJoint,tube,weight]`，并输出 `geometry.userData.leafWeights`；`strandSplitWeights` 保留为别名。
- `createPanelStrandGeometry`：输出 `geometry.userData.leafWeights`（与 `panelWeights` 同数组）。
- 消费方迁移：`updateTipHighlight`、`updatePanelTipHover`、USDA 权重读取统一走 `leafWeights`（回退 `panelWeights`），行为不变。
- 验证：`node --check` 全绿；`verify-smoke` 10/11 基线。

### 6.6 split 发丝 tip 拖拽（2026-08-13）

- `bone-interaction.js` 新增 `kind="strandTip"` 分支：两根管的 tip 手柄可像 panel zipper tip 一样在视平面拖动，写回 `strandSplitBones[tube].tip` 的链尾点；`app.js` 注入 `currentStrandSplitTipChains` 到 `boneInteractionDeps`。
- 仍延后：每管独立 Width/Depth 曲线、spread 手柄、USDA skel:joints/weights。