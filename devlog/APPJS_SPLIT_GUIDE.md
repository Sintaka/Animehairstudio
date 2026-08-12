# App.js 拆分指引 / APP.JS SPLIT GUIDE（从原版到编排层）

> 状态：**完成**（2026-08-12，分支 0.2.59-refactor，19 个重构 commit）。
> 本文件是从原版 app.js 拆到当前「编排层」的**权威指引**：历程、当前架构、拆分模式、每批执行模板、踩坑清单、保留区、以及给修 bug agent 的定位字典。
> 配套：入口字典 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（保留代码+决策）、检索层 [FUNCTION_INDEX.md](FUNCTION_INDEX.md)（函数名→行号→文件，机器生成）、状态 [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)（15 store）。

## 0. 一句话

- 原版 app.js **39,207 行 / 1,319 顶层函数 / 237 全局 let** → 当前 **18,401 行 / ~1,000 函数 / 1 个全局 let（camera）**，净减 **−53%**。
- 业务逻辑按子系统迁入 modules（**85 个文件**）；app.js 只保留「初始化 + store 装配 + 事件绑定 + 少量脊柱函数」。
- 拆分方式统一为 **`createXxxApi(deps)` 依赖注入**，每批独立 commit + verify-smoke 基线回归（当前基线 10/11，唯一失败为内容相关的 branch-bridge 断言，基线同样失败）。

## 1. 历程总览（从原版到现在）

| 阶段 | 内容 | 结果 |
|---|---|---|
| 阶段 0–2c（REFACTOR_PLAN.md） | 函数索引/依赖图脚本、localization 词典拆数据、文档按子系统拆、IO 域落地、IO 子系统迁出 | app.js 39,207→38,785；模块按域归组 |
| 阶段 3（store 收敛） | 241 个全局 let → 15 个 store（scene 基类 + 14 域 store） | 全局 let 只剩 camera |
| 3d 批次 1–5 | creation/shape preset、branch 系列（region/bridge/root-bone/hierarchy/sweep）、scalp、curve/guide | app.js → 32,530 行 |
| 延续计划 A：几何+骨骼 | 几何域 G4/G7/G5/G1/G2+G3/G6 + 骨骼域 B0/B1+B2/B3 | app.js → 26,288 行 |
| 延续计划 B：剩余批次 | preset library、draw-stroke、placement、reference+head、radial、duplicate、clump、material、IO 收尾 | app.js → **18,401 行** |

> 两个延续计划的批次表、函数清单、执行记录在 `devlog/in-progress/geometry-bones-extraction-plan.md` 与 `devlog/in-progress/appjs-slim-remaining-plan.md`（及其各自的 `<batch>-refactor-map.md` 引用图）。

## 2. 当前架构（功能 → 文件字典）

### app.js（18,401 行，编排层）

- 保留：模块 import 装配、store 创建与 deps 批填、事件绑定、render loop、启动 bootstrap。
- 脊柱（**不拆，拆=伪模块化**）：undo/snapshot/mirror 数据管线（pushUndoState/restoreState/snapshotState/restoreLock/mirrorPartnerFor）、selection 粘合层（selectLock/getSelectedLock 等，外部调用点最多）、curve-objects 核心（createCurveObjects/updateCurveObjects/syncLockFromCurve/rebuildLockGeometry）、`__AHS_TEST_SEAM`（测试 seam，引用迁移函数处保留 api.X 重导出）。

### modules/ 域

| 域 | 代表文件 | 功能 |
|---|---|---|
| core | app-config、scene-store、camera/guide/hair/head/misc/project/transform/ui/undo store、preference-storage、shortcut-registry、history | 配置/状态/偏好/快捷键/历史 |
| data | localization、loc-zh/loc-ja、shape/tool/clump-brush presets | 词典/预设数据 |
| edit | selection-state/sets/store、draw-store、reference-store、mirror-selection、multi-edit、sculpt-edit-store | 选择/绘制/参考/镜像 |
| geometry | curve-math、curve-surface、surface-lattice、poly-topology、strand-constraints/sweep、panel-tip-strand、strand-geometry、sculpt-geometry、curve-surface-create、draw-flow、placement、radial-menu、radial-layout、taper-editor、guide-system、procedural-duplicate、clump-procedural、branch-* | 几何/拓扑/曲线/创建/编辑/引导/子发片 |
| bones | bone-model、segment-control、bone-interaction、bone-view-handles | 骨骼数据层/段控制/交互/视口 handle |
| scene | reference-head | 参考图/头部/身体 |
| io | project-files、preset-library、io-tail、project-store/schema/state、file-actions/drop、obj-import/export、usda-export、recent-projects、preferences-backup | 保存/导出/项目/预设库/收尾 |
| material | material-state、material-ui | 材质数据/UI |
| sculpt | sculpt-brush | 雕刻笔刷纯函数 |
| branch | branch-store | 子发片状态 |
| scalp | scalp-store、scalp-builder | 头皮状态/构建 |

> 完整文件清单见 `FUNCTION_INDEX.md`（`node scripts/gen-function-index.js` 重新生成，当前 1,814 函数 / 86 文件）。

## 3. 拆分模式（createXxxApi(deps)）

- 每个子系统一个模块文件，`export function createXxxApi(deps) { ... return { 函数们 }; }`；模块内函数互相直接调用。
- app.js 顶部 `import { createXxxApi } from "./modules/<域>/<文件>.js?v=YYYYMMDD-N";`（带缓存号）；在合适初始化点 `const xxx = createXxxApi(xxxDeps);` 创建。
- **deps 注入**：store `.state` 代理（`sel: sel.state` 等）、共享对象/数组（locks/guides/renderer/camera）、app.js 保留的 helper 函数、DOM 元素、跨模块 api 对象（如 `drawFlow: drawFlowApi`）。
- **模块级 import（不塞 deps）**：THREE、纯函数模块（curve-math/curve-surface/surface-lattice/poly-topology/procedural-draw/bone-model）、app-config 常量。
- **渐进填充**：`xxxDeps = {}` 先建 api（可运行期读 deps）；引导期（boot 前）就会调用的函数，其 deps 必须在调用行前**就地填充**（`xxxDeps.y = y;`）；其余在 `Object.assign(xxxDeps, {...})` 批填（生效行 = `});`，不是 key 所在行）。
- **跨批次重接**：其它模块的 deps 批填（scalpBuilderDeps/guideDeps/drawFlowDeps/...）里引用了本批迁出函数名的，改成 `api.X` 引用；模块文件本身不动。
- 事件绑定（pointer/keydown 等）通常**留在 app.js**，回调改 `api.X`。

## 4. 每批执行模板（8 步，必做）

1. **先出函数引用图**：写 `devlog/in-progress/<batch>-refactor-map.md`（待迁函数/行号、外部调用点、deps 清单、边界判定）。
2. **裸引用静态扫描归零**：对模块内每个 app.js 顶层函数/const/let 名检查；排除模块自身定义/import/JS 内建/THREE/字符串注释/deps.X/属性访问；**对象键 `name:` 前后冒号都要排除**；**spread `...name` 是裸引用**（前两字符 `..`，与 `obj.name` 区分）。
3. **store 代理双重 .state 检查**：deps 传 `.state` 代理时模块内必须 `deps.X.y`，不能 `deps.X.state.y`（完整 store 对象 projectState/scalpState/head 例外，走 `deps.X.state.y`）。
4. **引导期 deps 时序审计**：列出批填前的顶层 `api.X(` 调用，其传递闭包 deps 必须调用行前已填；批填生效行 = `});` 行。
5. **跨批次重接**：其它 deps 批填引用了本批函数名的改 `api.X`；seam（`__AHS_TEST_SEAM`）引用了本批函数名的必须挂 `api.X` 重导出。
6. **编码**：UTF-8 无 BOM、CRLF、中文逐字节一致（非 ASCII 总量守恒，允许 ±1 文件头注释字符）。
7. **语法**：`Copy-Item app.js $env:TEMP\app_check.mjs -Force; node --check $env:TEMP\app_check.mjs` + `node --check <模块>`；**再以 .mjs 副本权威解析**（node --check 对无 package.json 的 ESM .js 会静默放行非法语法）。
8. **回归**：`node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs` 结果与 HEAD 基线一致（10/11）；seam/契约类（tip 子骨、curveObjects 字段）用 CDP 探针（`?ahstest=1`）实测。

## 5. 踩坑清单（17 批汇总）

- **deps 改写漏网**：SCALP_SEGMENTS/scalpState/scalpBuilderPlanePositions/scalpBuilderGroup/guideState/sel/editedScalpSurfaceMesh 等裸引用 → verify-smoke 启动即 ReferenceError；需全量静态扫描。
- **spread 漏改写**：`...scalpLatticeHandles`/`...selectionSets` 等（扫描器必须区分 `...name` 与 `obj.name`）。
- **store 双重 .state**：批次 5 复现 165 处 `deps.sculptState.state.X`。
- **引导期时序**：scalpSurfaceGroup/scalpArtistShape（createScalpLattice 前）、loadBraidMeshPreset/updatePlacementStatus（preset boot 前）、loadDefaultGuideModel（boot 顶层调用）等 deps 未提前填即崩。
- **未 import 常量**：DEFAULT_LAYER_OFFSETS（项目加载恢复路径 ReferenceError）→ 补 app-config import。
- **TDZ**：批填引用晚定义 const（SUPPORTED_REFERENCE_IMAGE_TYPES、vectorToData/dataToVector）→ 批填移到最晚 const 之后。
- **对象键/模板/三元歧义**：对象键 `name:` 前后冒号、模板字面量 `${}` 内代码需递归改写、三元 `?` 与可选链 `?.` 区分。
- **模块生成必须基于迁移前原文件**（git HEAD 提取），否则 span 错位。
- **seam 重导出**：`__AHS_TEST_SEAM`（现约 L20575 附近）引用迁移函数必须改 `api.X`（G1 19 个、G5 1 个、B1+B2 3 个），否则 verify-tip-select（?ahstest=1）ReferenceError。
- **curveObjects 契约**：B3 迁移 handle 段必须原样保留字段名（panelSplitHandles/branchSweepStartHandle/strandSplitHandle…）+ userData + 可见性语义（CDP 8/8 验证）。
- **node --check 静默放行**：无 package.json 仓库的 ESM .js 用 node --check 查不出非法语法 → .mjs 副本权威解析。
- **PowerShell→node stdin 中文损坏**：管道会丢中文（变 ??）；文档写入一律 `[IO.File]::WriteAllLines($path,$lines,(New-Object System.Text.UTF8Encoding($false)))`。

## 6. 留在 app.js 的（不拆）

- undo/restore/快照/mirror 数据管线（31 函数/~1,200 行，跨子系统最高风险）。
- selection 粘合层（45 函数/~920 行，外部调用点 291 全文件最高）。
- curve-objects 核心（createCurveObjects/updateCurveObjects/syncLockFromCurve/rebuildLockGeometry，几何脊柱）。
- UI 事件绑定/初始化/render loop（547 个 addEventListener + animate + bootstrap）。
- 过小/过散单点（viewplane-nav、prefs-appconfig、display-visibility、layer-hair 等）。
- `createProjectSaveApi(deps)` 收敛为单 store：**判定不值得**（剩余 10 个是函数/活数组/跨 store 数据，并入会造成引用环，收益仅 1 行）。

## 7. 修 bug agent 定位字典

- **查函数在哪**：`devlog/FUNCTION_INDEX.md`（函数名 → 文件/行号/calls）或 `Select-String` 定点搜函数名，不要整文件读。
- **状态在哪**：`STATE_MANAGEMENT.md`（15 个 store + 1 个全局 let camera）；新状态一律进对应 store，不新增全局 let。
- **某功能在哪个模块**：本文件 §2 表 + AGENT_QUICKSTART §2（保留代码/决策）。
- **模块需要新的 app.js 依赖**：走 deps 注入（模块内 `deps.X`，app.js 批填 `X: 引用`），不要改成模块内裸引用。
- **新函数要暴露给 app.js**：加进模块 return 对象，app.js 调用点改 `api.X`。
- **改完必验证**：node --check（.mjs 副本）+ verify-smoke（10/11 基线）+ seam/契约 CDP（如涉及 tip/bone）。
- **编码铁律**：改任何含中文的文件都用 UTF-8 无 BOM 写入；不要用 PowerShell 管道把中文喂给 node stdin。


## 8. 进一步瘦身评估（0.2.61，深度评估）

> 结论：**app.js 已接近「编排层地板」；再拆主要是伪模块化**。真正可拆的只剩少量 UI 辅助函数簇，收益约 200–500 行，不值得为拆而拆，除非出现明确驱动（第二入口 / 测试 harness / 某功能需要独立复用）。

实测基线（0.2.61）：app.js **18,412 行**、**494 个顶层 function**、**828 个顶层 const**（大量是 `document.querySelector` DOM 引用）、**1 个顶层 let（camera）**、**515 处 addEventListener**；`import` 83 条、约 30 个 `createXxxApi` 实例；modules 85 文件 / 30,939 行。原版 39,207 行 → 当前 18,412 行（−53%）。

### 8.1 剩余代码三大块与是否该拆

1. **脊柱（不拆=正确）**
   - undo/snapshot/mirror 数据管线：`mirrorPartnerFor`(8222)、`snapshotState`(8552)、`pushUndoState`(8893)、`restoreState`(9111)、`restoreLock`(9156) 等，约 1,100–1,300 行。
   - selection 粘合层：`selectLock`(11450)→`getSelectedLock`(12189)，45 函数 / 291 调用点，约 900 行。
   - curve-objects 核心：`createCurveObjects`(10334)/`updateCurveObjects`(10510)/`syncLockFromCurve`(10945)/`rebuildLockGeometry`(10975) + `outwardNormalAtPoint`/`guidedNormalAt`/`strandGeometryCurve`/`strandGeometryFrameAt`，约 800–1,000 行。
   - 这些是**跨子系统横切**：抽出去会形成模块间循环依赖，或把隐藏耦合显式化为「注入一切」的 deps 传参，收益为负——正是 §6 已判定的伪模块化。

2. **编排/初始化/事件绑定（不拆）**
   - 顶部 828 个 const 大多是 DOM 引用；deps 批填（7497/7576/7615/8812 等）+ bootstrap + animate + 515 个 addEventListener。这部分是「胶水」本身，拆到模块只是搬家，不减少耦合（绑定要引用所有 store/api），反而增加跳转成本。

3. **过小/过散单点（拆了意义不大）**
   - `setupEditableSliderControls`(355)、`updateInteractionLocks`(4952)、`configureTransformControls`(4963)、`pointerHitsTransformGizmo`(5015)、`rayFromViewportEvent`(5992)、`profileToCanvas`(7418)/`renderProfilePreview`(7425)/`renderHairCardCoveragePath`(7444)、`updateViewportStatsVisibility`(7959)、`strandControlPointHitFromEvent`(10276)、`renderLockList`(13440)、`bindUndoCapture`(13625)、`activateStrandControlPoint`(16980)/`addStrandControlPointSelection`(17057)/`closestStrandCurveParameter`(17184) 等。
   - 这些都是 20–150 行的单点，散落且依赖 DOM/store/其它 app.js helper；即使全部抽出，总收益约 200–500 行，却要新增十几个「一次引用」小模块，性价比低。

### 8.2 什么情况下才值得再拆

- 出现**第二入口/复用需求**：如 SSR、测试 harness、Web Worker、或「无 UI 导出服务」需要复用某组 helper，再按真实边界抽。
- 某个功能要**独立演进**且改动频繁（如 profile 预览、大纲列表、transform gizmo 命中），此时抽出可隔离回归。
- 否则建议保持现状，把精力放在 seam/契约测试与「删除死绑定」上，而不是追求行数。

### 8.3 比瘦身更划算的下一步

- 用 `node scripts/gen-function-index.js` 定期刷新 FUNCTION_INDEX（0.2.61 改动后已略过期）。
- 清理已确认的死绑定/死 DOM 引用（如 server.js `/api/save-project` 死代码）比再拆模块更实在。
