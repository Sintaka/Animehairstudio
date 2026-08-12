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


---

## 5. 本轮执行细化（2026-08-13，supervisor 落地）

> 状态：进行中。把 §3「待接手 agent 补齐」落成可执行的字段/API/文件边界与分派顺序。编码铁律见 `devlog/APPJS_SPLIT_GUIDE.md` §7：改中文文件一律 UTF-8 无 BOM + CRLF，禁止 PowerShell 管道喂中文给 node stdin。

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