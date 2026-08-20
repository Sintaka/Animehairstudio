# App.js 拆分指引 / APP.JS SPLIT GUIDE（从原版到编排层）

> 状态：**拆分本身已完成**（2026-08-12，分支 0.2.59-refactor，19 个重构 commit）；本文件此后继续作为**定位字典**维护。
> 本文件是从原版 app.js 拆到当前「编排层」的**权威指引**：历程、当前架构、拆分模式、每批执行模板、踩坑清单、保留区、以及给修 bug agent 的定位字典。
> 配套：入口字典 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（保留代码+决策）、检索层 [FUNCTION_INDEX.md](FUNCTION_INDEX.md)（函数名→行号→文件，机器生成）、状态 [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)（18 store）、重复推导审计 [in-progress/tip-subsystem-reuse-audit.md](in-progress/tip-subsystem-reuse-audit.md)。
> **计数基准：0.2.129 现场统计**（一次性 node 脚本逐文件计数 + `node scripts/gen-function-index.js`）。**本文件的所有行号与计数都会随开发漂移**——引用前请现场复核，不要把它当契约。

## 0. 一句话

- 原版 app.js **39,207 行 / 1,319 顶层 function / 237 顶层 let**（REFACTOR_PLAN §1 首轮统计；阶段 3a 的生成器全量扫出 **241** 个 let，两个数都真实，差在首轮漏扫）→ 当前 **20,828 行 / 580 顶层 function 声明 / 1 个顶层 let（camera）**，净减 **≈−47%**。
- 业务逻辑按子系统迁入 modules（**104 个 .js 文件 / 41,931 行**）；app.js 只保留「初始化 + store 装配 + 事件绑定 + 少量脊柱函数」。
- 拆分方式统一为 **`createXxxApi(deps)` 依赖注入**（app.js 内 29 个实例、90 条 import）；**纯函数模块不走这个模式**，直接 `export function`（curve-math、tip-width-curve、strand-tip-width、uv-unfold、uv-pack、bone-model、sculpt-brush…）。
- 当前测试基线：`node --test "tests/*.test.mjs"` **350 pass / 0 fail**（16 个测试文件，其中 dom-contract **108/108**）；`verify-smoke` 基线 **9/11**（export 对话框标题 + branch-bridge 数据依赖为已知环境差异）。

## 1. 历程总览（从原版到现在）

| 阶段 | 内容 | 结果 |
|---|---|---|
| 阶段 0–2c（REFACTOR_PLAN.md） | 函数索引/依赖图脚本、localization 词典拆数据、文档按子系统拆、IO 域落地、IO 子系统迁出 | app.js 39,207→38,785；模块按域归组 |
| 阶段 3（store 收敛） | 241 个全局 let → 15 个 store（scene 基类 + 14 域 store） | 全局 let 只剩 camera |
| 3d 批次 1–5 | creation/shape preset、branch 系列（region/bridge/root-bone/hierarchy/sweep）、scalp、curve/guide | app.js → 32,530 行 |
| 延续计划 A：几何+骨骼 | 几何域 G4/G7/G5/G1/G2+G3/G6 + 骨骼域 B0/B1+B2/B3 | app.js → 26,288 行 |
| 延续计划 B：剩余批次 | preset library、draw-stroke、placement、reference+head、radial、duplicate、clump、material、IO 收尾 | app.js → **18,401 行**（拆分终点） |
| main 0.1.5 移植（0.2.6x） | Multi-Cam / Autosave / Material Presets / Numeric Transform / Responsive header 等约 1,560 行 | app.js → 19,970 |
| 0.2.108–0.2.114 | 导出骨骼/打包异步化、吹风预览、USDA 桥接家族融合 | app.js → 20,183 |
| **0.2.115–0.2.129（发尖/拉链子系统）** | panel 的 zipper / WidthCurve / 选中系统**移植到普通发丝**，并把三份重复推导收成单点定义；新增 5 个模块 | app.js → **20,828**；modules 98→**104** |

> 两个延续计划的批次表、函数清单、执行记录在 `devlog/in-progress/geometry-bones-extraction-plan.md` 与 `devlog/in-progress/appjs-slim-remaining-plan.md`（及其各自的 `<batch>-refactor-map.md` 引用图）。
> **0.2.115 之后不再有「拆 app.js」批次**：新增代码直接进 modules，app.js 只增接线。上表最后一行的 +645 行几乎全是接线与 store 键，不是新业务逻辑。

## 2. 当前架构（功能 → 文件字典）

### app.js（20,828 行，编排层）

- 保留：模块 import（90 条）、store 创建与 deps 批填（20 处 `Object.assign(*Deps, …)`）、事件绑定（571 处 addEventListener）、render loop、启动 bootstrap；顶层 const 950 个，其中 **636 个是 `querySelector`/`getElementById` DOM 引用**。
- 脊柱（**不拆，拆=伪模块化**）：undo/snapshot/mirror 数据管线（pushUndoState/restoreState/snapshotState/restoreLock/mirrorPartnerFor）、selection 粘合层（selectLock/getSelectedLock 等，外部调用点最多）、curve-objects 核心（createCurveObjects/updateCurveObjects/syncLockFromCurve/rebuildLockGeometry）、`__AHS_TEST_SEAM`（测试 seam，约 L20760；引用迁移函数处保留 `api.X` 重导出）。
- 拆分之后**仍在 app.js 里新增**的少数东西（有意的）：拉链数据模型 `normalizeStrandSplits`(L1566)/`syncStrandSplitLegacyFields`(L1606)/`normalizePanelSplits`、发尖链真源 `currentStrandSplitTipChains`(L13415)、以及 `strandRadiusAt`/`strandProfileTopologyAt` 两个几何采样脊柱（0.2.125 给它们加了 override 形参）。理由：它们被 undo/几何/骨骼/导出四条链同时消费，属脊柱级横切。

### modules/ 域（104 文件 / 41,931 行）

| 域 | 文件数 | 文件 | 功能 |
|---|---|---|---|
| core | 16 | app-config、scene-store、camera/guide/hair/head/misc/multi-camera/transform/ui/undo/wind store、preference-storage、preferences-backup、shortcut-registry、history | 配置/状态/偏好/快捷键/历史 |
| data | 6 | localization、loc-zh/loc-ja、shape/tool/clump-brush presets | 词典/预设数据 |
| edit | 8 | selection-state/sets/store、draw-store、reference-store、mirror-selection、multi-edit、sculpt-edit-store | 选择/绘制/参考/镜像 |
| geometry | 41 | 见 §2.1 | 几何/拓扑/曲线/创建/编辑/引导/子发片/发尖 |
| bones | 5 | bone-model、segment-control、bone-interaction、bone-view-handles、**tip-sub-bone-host** | 骨骼数据层/段控制/交互/视口 handle/发尖宿主分派 |
| scene | 1 | reference-head | 参考图/头部/身体 |
| io | 21 | project-files、preset-library、io-tail、project-store/schema/state、file-actions/drop、obj-import/export、usda-export、**bridge-export**、recent-projects、recovery-storage/store、creation-presets、shape-presets、**uv-unfold**、**uv-pack**、**uv-pack-async**、**uv-pack-worker** | 保存/导出/项目/预设库/UV 展开与打包 |
| material | 2 | material-state、material-ui | 材质数据/UI |
| sculpt | 1 | sculpt-brush | 雕刻笔刷纯函数（含 Twist Brush 角度） |
| branch | 1 | branch-store | 子发片状态 |
| scalp | 2 | scalp-store、scalp-builder | 头皮状态/构建 |

> `modules/package.json` 是 `{"type":"module"}`（**不计入 104**）；仓库根 `package.json` **没有** `type: module`。
> 完整函数清单见 `FUNCTION_INDEX.md`（`node scripts/gen-function-index.js` 重新生成，当前 **2,293 函数 / 105 文件**＝104 模块 + app.js）。

### 2.1 geometry 域 41 文件（最容易迷路的域）

| 分组 | 文件 |
|---|---|
| 纯曲线/拓扑数学 | curve-math、curve-surface、surface-lattice、curve-lattice、poly-topology、topology、mesh-smooth、capsule-curve、strand-constraints、leaf-weights |
| 发丝几何 | strand-geometry（split/base/card/compound）、strand-sweep（共享扫掠核）、panel-tip-strand（panel/ribbon 发尖）、compound-strand、arc-hair-surface、hair-shell |
| **发尖子系统（0.2.123–0.2.129）** | **tip-width-curve**（几何无关曲线数学）、**strand-tip-width**（发丝侧管内坐标/放置）、**tip-sub-bone**（链/帧/权重原语） |
| 子发片（branch） | branch-bridge、branch-connect、branch-hierarchy、branch-region-panel、branch-root-bone、branch-sweep、branch-knife |
| 创建/编辑流程 | curve-surface-create、draw-flow、placement、procedural-draw、procedural-duplicate、clump-procedural、poly-tools、sculpt-geometry、guide-system |
| UI 层 | radial-menu、radial-layout、taper-editor、uv-inspector |
| 其它 | anime-hair-shaders、wind-preview |

> **命名陷阱**：`tip-sub-bone.js` 在 **geometry** 域，`tip-sub-bone-host.js` 在 **bones** 域。分工是「纯几何原语 vs 需要注入 app.js 曲线/帧函数的宿主分派」，见 tip-sub-bone-host.js 文件头注释。

## 3. 拆分模式

### 3.1 `createXxxApi(deps)`（有状态/需注入的子系统，29 个实例）

- 每个子系统一个模块文件，`export function createXxxApi(deps) { ... return { 函数们 }; }`；模块内函数互相直接调用。
- app.js 顶部 `import { createXxxApi } from "./modules/<域>/<文件>.js?v=YYYYMMDD-N";`（带缓存号）；在合适初始化点 `const xxx = createXxxApi(xxxDeps);` 创建。
- **deps 注入**：store `.state` 代理（`sel: sel.state` 等）、共享对象/数组（locks/guides/renderer/camera）、app.js 保留的 helper 函数、DOM 元素、跨模块 api 对象（如 `drawFlow: drawFlowApi`）。
- **模块级 import（不塞 deps）**：THREE、纯函数模块（curve-math/curve-surface/surface-lattice/poly-topology/procedural-draw/bone-model/tip-width-curve/strand-tip-width/tip-sub-bone）、app-config 常量。
- **渐进填充**：`xxxDeps = {}` 先建 api（可运行期读 deps）；引导期（boot 前）就会调用的函数，其 deps 必须在调用行前**就地填充**（`xxxDeps.y = y;`）；其余在 `Object.assign(xxxDeps, {...})` 批填（生效行 = `});`，不是 key 所在行）。
- **跨批次重接**：其它模块的 deps 批填（scalpBuilderDeps/guideDeps/drawFlowDeps/...）里引用了本批迁出函数名的，改成 `api.X` 引用；模块文件本身不动。
- 事件绑定（pointer/keydown 等）通常**留在 app.js**，回调改 `api.X`。

### 3.2 纯函数模块（0.2.121 起的首选，新代码优先走这条）

- 形态：`export function f(标量/数组/普通对象) {}`，**不接 lock、不接 store、不接 deps**。可在 node 测试里直接调，因此每条规则都能写断言。
- 关键设计（0.2.125 的经验，写进规范）：**签名要参数化掉 lock**。`tip-width-curve.js` 全部以「相邻 zipper 高度 / fork 标量」为入参，**刻意不接受** `(lock, segmentIndex, splits)` —— panel 的 `panelSplits` 与发丝的 `strandSplits` 字段名不同但条目形状相同，只有参数化掉 lock 才能真共用一份，否则必然各留一份、然后其中一份腐化。
- 原地留下的旧 API 改成**薄适配器**委托共享层（panel-tip-strand.js 1174→1100 行，28 个导出名与签名逐个保留，56 处外部调用点零改动）。
- 验收「纯搬迁」的方式：把每个适配器在 N 组输入上的输出与 `git show HEAD:<file>` 版本逐字节对比（0.2.125 做了 36 用例 / 496,518 字节）。**不要只靠测试全绿**——panel 的断言在那轮一条没改也全绿。

### 3.3 两层描述子（同一交互要覆盖多种几何时）

- **数据层**在 `bones/bone-model.js`：`PANEL_SEGMENT_HOST` / `STRAND_SEGMENT_HOST` 两个 frozen 描述子 + `segmentBoneHost(lock)` 分派 + `resolveSegmentSelection(lock, sculptState, host)`。纯数据，可在 node 直接用。
- **几何层**在 `bones/tip-sub-bone-host.js`：`resolveTipHost(lock, {materialize})` 一次分派出该几何的发尖链 / splits / 骨骼 / fork / 帧，需要注入 app.js 的曲线/帧函数，所以单独成层。
- **门控一律写 `segmentBoneHost(lock) === STRAND_SEGMENT_HOST`，不要写 `!isPanelGeometry`**（0.2.126 定论）：后者会把「既非 panel 也非 split 发丝」的几何一并卷入。
- **状态键选单键、不要按几何各开一套**：`tipSelection`/`tipHover`（0.2.126 由 `panelTipSelection`/`panelTipHover` 改名）。两套键会让清理路径、表面高亮、笔刷门控、`tipUiActive` 四处各长出一个 `if(几何)` 分叉。

## 4. 每批执行模板（8 步，必做）

1. **先出函数引用图**：写 `devlog/in-progress/<batch>-refactor-map.md`（待迁函数/行号、外部调用点、deps 清单、边界判定）。
2. **裸引用静态扫描归零**：对模块内每个 app.js 顶层函数/const/let 名检查；排除模块自身定义/import/JS 内建/THREE/字符串注释/deps.X/属性访问；**对象键 `name:` 前后冒号都要排除**；**spread `...name` 是裸引用**（前两字符 `..`，与 `obj.name` 区分）。
3. **store 代理双重 .state 检查**：deps 传 `.state` 代理时模块内必须 `deps.X.y`，不能 `deps.X.state.y`（完整 store 对象 projectState/scalpState/head 例外，走 `deps.X.state.y`）。
4. **引导期 deps 时序审计**：列出批填前的顶层 `api.X(` 调用，其传递闭包 deps 必须调用行前已填；批填生效行 = `});` 行。
5. **跨批次重接**：其它 deps 批填引用了本批函数名的改 `api.X`；seam（`__AHS_TEST_SEAM`）引用了本批函数名的必须挂 `api.X` 重导出。
6. **编码**：UTF-8 无 BOM、CRLF、中文逐字节一致（非 ASCII 总量守恒，允许 ±1 文件头注释字符）。⚠️ `write` 与 `edit` 工具**都会静默剥掉 BOM**（0.2.125/0.2.129 共中 6 次，`index.html` 与 `dom-contract.test.mjs` 有 BOM，改这两个文件后必须字节级复核并还原）。
7. **语法**：`Copy-Item app.js $env:TEMP\app_check.mjs -Force; node --check $env:TEMP\app_check.mjs` + `node --check <模块>`；**再以 .mjs 副本权威解析**。原因：仓库根 `package.json` **没有** `type: module`，`node --check` 会把 app.js 当 CommonJS 解析而静默放行部分非法 ESM 语法（`modules/package.json` 有 `type: module`，故模块文件本身按 ESM 解析）。
8. **回归**：
   - `node --test "tests/*.test.mjs"` → **350 pass / 0 fail**（16 文件；dom-contract **108/108**）。⚠️ `uv-pack-async` 是**负载相关 flake**（Worker 池单条最慢 ≈14s、该文件 ≈35s）：并行跑多个子智能体时可能报**恰好 1 条** fail，单独跑或降载重跑即绿——见到这个形态**先重跑**再怀疑代码。
   - `node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs` → 基线 **9/11**（export 对话框标题 + branch-bridge 为已知环境差异）。
   - 真实工程：`node scripts/verify-uv-pack-real.mjs`（headless Chrome + CDP，**7/7**、0 page exceptions；同时守住全部 `?v=` 缓存号——任一写错就是 import 失败 → page exception）。
   - seam/契约类（tip 子骨、curveObjects 字段）用 CDP 探针（`?ahstest=1`）实测。`scripts/verify-tip-select.mjs` 当前 **47/51**，那 4 条是**脚本过时**（钉的是 0.2.118 per-side 模型，已被 0.2.123 推翻，满足它会重新引入 bug-fixes #14 的凹陷），不是回归。

## 5. 踩坑清单

### 5.1 拆分期（17 批汇总）

- **deps 改写漏网**：SCALP_SEGMENTS/scalpState/scalpBuilderPlanePositions/scalpBuilderGroup/guideState/sel/editedScalpSurfaceMesh 等裸引用 → verify-smoke 启动即 ReferenceError；需全量静态扫描。
- **spread 漏改写**：`...scalpLatticeHandles`/`...selectionSets` 等（扫描器必须区分 `...name` 与 `obj.name`）。
- **store 双重 .state**：批次 5 复现 165 处 `deps.sculptState.state.X`。
- **引导期时序**：scalpSurfaceGroup/scalpArtistShape（createScalpLattice 前）、loadBraidMeshPreset/updatePlacementStatus（preset boot 前）、loadDefaultGuideModel（boot 顶层调用）等 deps 未提前填即崩。
- **未 import 常量**：DEFAULT_LAYER_OFFSETS（项目加载恢复路径 ReferenceError）→ 补 app-config import。
- **TDZ**：批填引用晚定义 const（SUPPORTED_REFERENCE_IMAGE_TYPES、vectorToData/dataToVector）→ 批填移到最晚 const 之后。
- **对象键/模板/三元歧义**：对象键 `name:` 前后冒号、模板字面量 `${}` 内代码需递归改写、三元 `?` 与可选链 `?.` 区分。
- **模块生成必须基于迁移前原文件**（git HEAD 提取），否则 span 错位。
- **seam 重导出**：`__AHS_TEST_SEAM`（现约 L20760）引用迁移函数必须改 `api.X`（G1 19 个、G5 1 个、B1+B2 3 个），否则 verify-tip-select（?ahstest=1）ReferenceError。
- **curveObjects 契约**：B3 迁移 handle 段必须原样保留字段名（panelSplitHandles/branchSweepStartHandle/strandSplitHandle…）+ userData + 可见性语义（CDP 8/8 验证）。
- **node --check 静默放行**：见 §4 第 7 步（根仓库无 `type: module`）→ .mjs 副本权威解析。

### 5.2 维护期（0.2.110 之后新增，同样会咬人）

- **`?v=` 缓存号必须定点 bump，不要全局替换**（0.2.110 教训）：`dom-contract.test.mjs` 冻结了具体版本串。**0.2.129 实测该文件有 10 条 `?v=` 断言**（`app.js` ×3、`styles.css`、`localization`、`surface-lattice`、`sculpt-brush`、`clump-brush-presets`、preset 资源 ×2）——旧文档写的「一次打挂 89 条」是 0.2.110 当时的滞后失败总数，不是缓存号断言数，勿据此估算影响面。只 bump 本次改动链（如 `strand-tip-width`→`strand-geometry`→`app.js`→`index.html`）。
- **朴素 grep 找不全冻结断言**（0.2.125 教训）：测试里写的是转义正则 `localization\.js\?v=`，`Select-String "localization.js?v="` **漏掉了真实存在的那一条**；照那个结论 bump 会让套件变红。要用**解析式审计**（反转义 dom-contract 里的正则 + 收集全树实际 tag + 交叉比对 + 报「同一模块被多个 tag 导入」）——该审计 0.2.125 是临时脚本、**未入库**，需要时重写。已入库的相关工具是 `scripts/check-stale-cache-params.mjs`，但它做的是**另一件事**：按被 import 文件的最后提交日期判断 `?v=` 是否过期，**不检查 dom-contract 的冻结断言**。
- **`check-stale-cache-params.mjs` 的两个坑（0.2.134 实测）**：① 它**硬编码** `const ROOT = "D:/code/dev/web/Animehairstudio"`（L6），所以在 worktree 里跑、或用绝对路径指向另一个 checkout 的副本跑，**扫的仍是主树** —— 我据此做过一次「baseline vs HEAD」对比，两边都得 57、以为是"无变化"，其实是**同一次扫描重复了两遍**，结论无效。要比两个版本必须自己按 `git show <rev>:<file>` 重算，`lastMod` 也要带上 `<rev>`（`git log -1 <rev> -- <file>`），否则日期取的是当前 HEAD 的。② 它报的 57 条是**长期存量**，不是当轮回归：成因是 0.2.131（全仓库去 BOM）那类**广泛触碰文件**的提交把大量模块的 last-commit 日期推到今天，而没人做过 `?v=` 的**传递闭包**刷新。**判据**（0.2.134 实测口径）：真正会让回访用户打不开应用的只有一种情形 —— **新文件 import 旧依赖而旧依赖没有那个新增 export**（ESM 是链接期解析，直接 `SyntaxError`）。所以 bump 后要验的不是"57 条清零"，而是**新增 export 的那条链是否端到端全新**（本轮实测：`index.html`→`app.js`→`panel-tip-strand.js`→`curve-math.js` 全部 `?v=20260909-2`，且新增 export 只被 `panel-tip-strand.js` 跨文件 import）。其余「旧文件 import 旧依赖」的组合**自洽、不会崩**，只是浏览器多留一份旧模块。本轮 baseline 58 → HEAD 57、**新增 0 条**（curve-math 的 13 个消费方一起 bump 反而清掉 1 条存量）。
- **BOM**：`write` 与 `edit` **都会**静默剥 BOM；**PowerShell 的 BOM 审计会说谎**（`Get-Content -Encoding Byte` 把带 BOM 的文件报成无 BOM，`>` 重定向 git 输出按 UTF-16 写盘凭空造出 `FF FE`）。用 node 读字节判定。
- **PowerShell→node stdin 中文损坏**：管道会丢中文（变 ??）；文档写入一律 `[IO.File]::WriteAllLines($path,$lines,(New-Object System.Text.UTF8Encoding($false)))` 或用 node/工具写。
- **信任前缀必须是命令首 token**：`git`/`node` 不在第一位就被沙箱拦（0.2.125 主进程踩了 4 次）；用 workdir 参数代替 `cd`。
- **批量改名/替换脚本要写成文件再跑，别用 `node -e` 内联（0.2.136 教训）**：内联脚本里的正则字符类、模板串、多行解构会被 PowerShell 的引号解析吃掉，症状是**静默什么都没做**（退出码 0、无输出），照它的"成功"继续走会基于错误前提。本轮一次 `node -e` 改名脚本零输出、52 处旧标识符一个没换。写成 `scripts/tmp-*.mjs` 再 `node scripts/tmp-x.mjs`，并让脚本**逐文件打印替换数 + 回读校验**（0.2.57 有过"批量脚本 lines.join 覆盖丢失替换"的先例）；跑完即删。
- **测试红的三种形态要分清**：① `uv-pack-async` 单条 fail = 负载 flake，重跑；② 失败集中在**刚被写过的文件**上 = 子智能体持有写入时的文件竞态，重跑；③ 其余才怀疑代码。
- **source-text 断言**（钉代码形状的测试）重构后失效时，**要改写不要删**：先核实它守的行为仍成立，再改写断言（0.2.126 的三条如此处理，测试名保留）。

## 6. 留在 app.js 的（不拆）

- undo/restore/快照/mirror 数据管线（≈31 函数/~1,200 行，跨子系统最高风险）。
- selection 粘合层（≈45 函数/~940 行，外部调用点全文件最高；`getSelectedLock` 仅 app.js 内就 97 处、`pushUndoState` 68 处）。
- curve-objects 核心（createCurveObjects/updateCurveObjects/syncLockFromCurve/rebuildLockGeometry，几何脊柱）。
- UI 事件绑定/初始化/render loop（571 处 addEventListener + animate + bootstrap；950 个顶层 const 里 636 个是 DOM 引用）。
- 过小/过散单点（viewplane-nav、prefs-appconfig、display-visibility、layer-hair 等）。
- `createProjectSaveApi(deps)` 收敛为单 store：**判定不值得**（剩余 10 个是函数/活数组/跨 store 数据，并入会造成引用环，收益仅 1 行）。
- 拉链/发尖数据模型的归一化与真源（§2 app.js 段最后一条）。

## 7. 修 bug agent 定位字典

### 7.1 检索方法（先用这个，别整文件读）

- **查函数在哪**：`devlog/FUNCTION_INDEX.md`（函数名 → 文件/行号/calls，2,293 函数 / 105 文件）；过期就跑 `node scripts/gen-function-index.js`，**勿手改**。
- **状态在哪**：`STATE_MANAGEMENT.md`（**18 个 store** + 1 个全局 let camera；`modules/**/-store.js` 实为 19 个文件 = 18 域 store + `scene-store` 基类）。发尖选中键见其 §2.1。新状态一律进对应 store，不新增全局 let。
- **某功能在哪个模块**：本文件 §2/§2.1 + §7.2 表 + AGENT_QUICKSTART §2（保留代码/决策）。
- **一条推导规则的唯一定义点在哪**：§7.3 表 + `in-progress/tip-subsystem-reuse-audit.md`（8 条真重复 + 7 项刻意保留的不对称）。
- **模块需要新的 app.js 依赖**：走 deps 注入（模块内 `deps.X`，app.js 批填 `X: 引用`），不要改成模块内裸引用。
- **新函数要暴露给 app.js**：加进模块 return 对象，app.js 调用点改 `api.X`。
- **改完必验证**：node --check（.mjs 副本）+ `node --test "tests/*.test.mjs"`（350/350）+ verify-smoke（9/11 基线）+ seam/契约 CDP（涉及 tip/bone 时）。
- **编码铁律**：改任何含中文的文件都用 UTF-8 无 BOM 写入（`index.html`/`dom-contract.test.mjs` 例外，它们**有** BOM 且必须保留）；不要用 PowerShell 管道把中文喂给 node stdin。

### 7.2 「我要找 X 功能」→ 文件

> 从原版 main（扁平 app.js）过来的 agent 最容易在这里迷路：原版里这些全在 app.js。

| 我要找的功能 | 现在在哪 |
|---|---|
| 撤销/重做、快照、镜像数据管线 | **app.js 脊柱**（pushUndoState/snapshotState/restoreState/restoreLock/mirrorPartnerFor） |
| 选择集/大纲选中/工具切换粘合层 | **app.js 脊柱**（selectLock…getSelectedLock）+ `edit/selection-state.js`/`selection-sets.js`/`selection-store.js` |
| curveObjects（控制点/把手/线框对象） | **app.js 脊柱** createCurveObjects/updateCurveObjects；视口 handle 创建在 `bones/bone-view-handles.js` |
| 普通发丝几何（含 split/多拉链管） | `geometry/strand-geometry.js`（`createSplitStrandGeometry`、`clipStrandProfileBand`） |
| 共享扫掠核（发丝/子发片共用） | `geometry/strand-sweep.js`（`createStrandSweepApi(deps).sweepSide`；`SWEEP_OVERLAP_DEFAULTS` 是模块级导出，为默认参数单源） |
| 刘海/panel（ribbon）几何与发尖 | `geometry/panel-tip-strand.js` |
| **发尖 WidthCurve 曲线数学（几何无关）** | `geometry/tip-width-curve.js`（0.2.125 新增，纯函数，入参是**相邻 zipper 高度/fork 标量**） |
| **发丝侧发尖宽度放置/管内坐标** | `geometry/strand-tip-width.js`（0.2.125 新增；`strandTubeSignedCoordinate` 是核心） |
| 发尖子骨骼链/帧/权重原语 | `geometry/tip-sub-bone.js`（注意在 **geometry** 域） |
| **发尖宿主分派（选中/把手/gizmo/笔刷共用）** | `bones/tip-sub-bone-host.js`（0.2.126 新增，`resolveTipHost`） |
| 骨骼数据模型 / 段描述子 / 段骨骼重映射 | `bones/bone-model.js`（`bonesFor`、`splitBonesFor`、`strandSplitBonesFor`、`segmentBoneHost`、`remapSegmentBonesOnInsert/Delete`） |
| 拉链（zipper）增删 / 段选择器 UI | `bones/segment-control.js`（`changeStrandSplitCount`、`deleteSelectedStrandSplit`） |
| 骨骼 gizmo/拖拽/子骨骼笔刷 | `bones/bone-interaction.js`（发尖拖拽种子统一走 `tipDragSnapshot`/`writeTipEdit`） |
| 视口把手（骨骼/段/拉链球/发尖链/宽度绿点） | `bones/bone-view-handles.js`（`allocateTipChainHandles`） |
| 拉链/发尖数据的归一化与 legacy 迁移 | **app.js**（`normalizeStrandSplits`/`syncStrandSplitLegacyFields`/`normalizePanelSplits`）+ 发尖链真源 `currentStrandSplitTipChains` |
| Twist Brush（绕切线滚转） | `sculpt/sculpt-brush.js`（`sculptTwistBrushAngle`/`sculptTwistBrushDeltas`，纯函数）；主发丝消费在 `geometry/sculpt-geometry.js`，发尖消费在 `bones/bone-interaction.js` |
| 其它雕刻笔刷几何/重建调度 | `geometry/sculpt-geometry.js` |
| 子发片桥接/挖洞/Region 面板/根骨骼 | `geometry/branch-bridge.js`、`branch-connect.js`、`branch-region-panel.js`、`branch-root-bone.js`、`branch-hierarchy.js`、`branch-sweep.js` |
| 导出 UV 展开（矩形化/接缝/子发片对齐） | `io/uv-unfold.js` |
| 导出 UV 打包（UDIM 1001 / uvisland） | `io/uv-pack.js`（同步纯函数）+ `io/uv-pack-async.js` + `uv-pack-worker.js`（Worker 池，导出默认走这条；**全链 async，调用点必须 await**） |
| USDA / OBJ 导出 | `io/usda-export.js`、`io/obj-export.js`；桥接家族融合与 bone capture 在 `io/bridge-export.js` |
| 保存/导出/展开总接线 | `io/project-files.js`（`buildUnfoldedMeshes`/`packUnfoldedUv`/`buildHairObj`/`buildHairUsda`） |
| 自动保存/崩溃恢复 | `io/recovery-store.js` + `io/recovery-storage.js` |
| 吹风预览 | `geometry/wind-preview.js` + `core/wind-store.js` |
| UV checker / 2D UV Inspector | `geometry/uv-inspector.js`（视图变换）+ `io/project-files.js`（重建预览几何） |
| 头皮引导/绘制/构建 | `scalp/scalp-builder.js`、`scalp/scalp-store.js` |
| 参考图 / 头部/身体导入 | `scene/reference-head.js` |
| 材质/着色器 | `material/material-state.js`、`material/material-ui.js`、`geometry/anime-hair-shaders.js` |
| 曲线编辑器（taper/width/depth/twist 2D 面板） | `geometry/taper-editor.js` |
| 径向菜单 | `geometry/radial-menu.js` + `geometry/radial-layout.js` |
| 多语言词典 | `data/localization.js` + `data/loc-zh.js`/`loc-ja.js` |
| 快捷键注册/焦点回收 | `core/shortcut-registry.js` |

### 7.2b 术语对照：main 原版 → 本 fork（**改名 / 语义漂移都在这里**）

> **本表存在的理由**：0.2.132 之前，「发尖聚合」这个功能在**标签、代码、main 三处各叫不同的名字**，
> 导致连续几轮对话把它和 main 的「简单分叉分离」搞混、修错方向。凡是**改过名或改过语义**的
> 概念都必须登记在此，新 agent 从原版找功能时先查这张表，别靠猜。
>
> ⚠️ **最容易踩的一条**：`spread` 在 main 里是**发丝聚簇**（`#clumpSpread`/`#clumpDepthSpread`），
> **不是**分裂管的分离量。main 表示「简单分叉分离」的词是 `strandSplitGap` / `panelSplitGap`。
> 本 fork 一度把 per-tube 发尖数据塞进 `bone.spread`，于是**同时撞上这两个概念**。

| main 原版 | 本 fork 现名 | 关系 | 说明 |
|---|---|---|---|
| `strandSplitGap` / `panelSplitGap`（简单分叉**分离**：整根管侧向平移推开） | **已删除该语义**（0.2.132） | ✂️ 移除 | 分离改由**拉 zipper**实现（zipper 位置/高度即决定缝在哪、开多深），不再单独给「分离量」滑块。`strandSplitGap` **字段仍留在存档里**，仅作 per-tube 值的派生默认来源，旧文件照常打开 |
| `spread` / `depthSpread`（**发丝聚簇**，`#clumpSpread`） | 同名保留，**与发尖无关** | ⚠️ 同名不同物 | main 的 `spread` 是聚簇参数。**不要**把它和发尖的 `tipClump` 混为一谈——这正是 0.2.132 之前反复搞混的根源 |
| （无对应物） | **`bone.tipClump`** + UI「**Tip Clump**」 | ✨ 新概念 | 每段/每管发尖的**整体宽度缩放**（以发尖骨骼为中心两侧对称收窄，panel 侧注释原文称 "aggregation/聚合"）。0.2.132 起为独立字段名；读取时 `tipClump ?? spread` 回退，旧档不丢值。panel 与发丝**同一语义**，绿色手柄与滑块联动 |
| （无对应物） | `panelSplits` / `strandSplits`（zipper 数组） | ✨ 新概念 | main 只有单个分叉标量；本 fork 是 N 个 zipper → N+1 管/段，各带独立 position/height/order |
| （无对应物） | ~~`strandSplitDirection(k,N)=(2k−N)/N`~~ → **`strandSplitTubeCenter(k, splits)`** | ✂️→✨ 替换 | 前者是管的横向**推开方向**，只服务于 0.2.132 删掉的 opening 平移，已随之删除；后者是管**自身的中心**（边界 `[-1,...position,1]` 第 k 段中点）。差别不只是名字：中心**跟随真实 zipper 划分**，等距的旧规则不跟（zipper 挤在一侧时旧规则会把「管心」算到管外）。消费方：usda-export 派生骨骼位置、app.js 的 rest 回退 |
| （无对应物） | `defaultSplitTipClump(lock)` / `defaultStrandTipClump(lock)` | ✨ 新概念 | 每段/每管 Tip Clump 的**默认值**派生，分别读 `panelSplitGap` / `strandSplitGap`。**两者刻意同构**——都是「无滑杆、只喂默认值」的存档字段；上面第一行对两个字段都成立，只是删除时间不同（panel 的位移语义 0.2.59 就已删除，strand 的是 0.2.132） |
| `panelTipSelection` / `panelTipHover` | `tipSelection` / `tipHover` | 🔁 改名 | 0.2.126 改为几何无关单键（panel 与发丝共用），使清理/高亮/笔刷门控各只有一份实现 |
| 扁平 `modules/*.js` + 大 app.js | `modules/<domain>/*.js` + `app.js` 编排层 | 🏗️ 架构 | 见 §2；`app.js` 已判定**不再继续瘦身**（§8） |

### 7.3 单点定义速查（**禁止就地重写这些表达式**）

> 0.2.124 的 bug 就是「同一条规则被复制三份、只改了一份」造成的（几何/骨骼/导出横向偏移错位）。改这些规则前先看它的消费方清单（写在各定义点的注释里）。

| 规则 | 唯一定义点 |
|---|---|
| 管 k 的横向**中心**（边界中点） | `bones/bone-model.js` `strandSplitTubeCenter`（`usda-export.js` 真 import；0.2.132 取代了只服务于已删除 opening 的 `strandSplitDirection`） |
| **Tip Clump 收窄比例**（本侧 zipper 处 0 → 发尖满值，线性） | `geometry/tip-width-curve.js` `tipClumpNarrowFraction`（panel 乘段半跨度、发丝乘管内半跨度 —— 这是「同一数值在两种几何上同义」的构造性保证） |
| 段/管数与段索引钳位 | `bones/bone-model.js` `resolveSegmentSelection` |
| 几何 → 段宿主分派 | `bones/bone-model.js` `segmentBoneHost` + `PANEL_SEGMENT_HOST`/`STRAND_SEGMENT_HOST` |
| 发尖链点数 | 两个描述子的 `tipChainPointCount`（panel 下限 0 / 发丝下限 2，**下限差是刻意的**） |
| 发尖宿主（链/splits/骨骼/fork/帧） | `bones/tip-sub-bone-host.js` `resolveTipHost` |
| 首个暴露发尖链索引 `clamp(floor(forkT·last),1,last)` | `geometry/tip-sub-bone.js` `firstExposedTipChainIndex`（导出侧 `usda-export.js` 仍是**受控副本**，注释互指 + 跨消费方一致性断言） |
| 按侧暴露判据 | `geometry/tip-width-curve.js` `tipWidthSideExposesTAt` |
| 侧 fork / 公共 fork（由 zipper 高度算） | `geometry/tip-width-curve.js` `tipWidthSideForkFromHeights` / `tipWidthCommonForkFromHeights` |
| 管内相对坐标（**不要用 raw `profile.x` 判左右**） | `geometry/strand-tip-width.js` `strandTubeSignedCoordinate` |
| 发丝管 fork / 发尖混合起点 | `geometry/strand-tip-width.js` `strandTubeForkT` / `strandTipBlendStartT` |
| 发尖编辑读写基准（gizmo/笔刷共用） | `bones/bone-interaction.js` `tipDragSnapshot` / `writeTipEdit` |
| 发丝发尖链真源 | **app.js** `currentStrandSplitTipChains`（**不要**在别处自行 `materializeTipChain`，会用近似 rest → 编辑基准一错发尖就跳） |
| Twist 笔刷角度 | `sculpt/sculpt-brush.js` `sculptTwistBrushAngle`（方向常量 `TWIST_DIRECTION` 独立于可覆盖的 `scale`） |

### 7.4 红线（做了必出 bug）

- **发丝路径绝不调 `clonePanelSplits`**：会造出与真实 zipper 无关的假 `panelSplits`，段数/fork 全错（0.2.126 之前已踩两次）。0.2.126 审计的是**发尖子系统内**（`bone-interaction`/`bone-view-handles`/`tip-sub-bone-host`/`taper-editor` 那条链）的 6 个调用点，全部 panel 门控或位于 `resolveTipHost` 的 panel 分支；panel 自身创建/快照/镜像路径上还有大量合法调用（app.js、`draw-flow`、`segment-control`），**不要把它们一并"修掉"**。
- **发尖宽度只准缩放 `t > fork` 的顶点，`row 0` 顶点位置不得改变**：`uv-unfold` 的 U 完全由 row 0 环向弧长决定、V 纯行号。因此曲率收窄预趟**刻意不传** width override（其 factors 全行共享且经 falloff 会把位移传到 row 0），`strandProfileTopologyAt` 的重居中分支在 override 生效时也**刻意跳过**。这两处不对称是**有意的**。
- **override 路径必须绕该管自身中心缩放**，不是全局 profile 中心 x=0（0.2.128；否则位移 ∝ |raw x|，N=1 缝侧位移恰为 0）。分组写法要让 m=1 时逐字节恒等，而不是落到容差。
- **视口 `ceil` / 导出 `floor` 的旧结论已作废**（0.2.119 起六处全部 `floor`）：`tipChainNearestIndex` 不同步会让蒙皮绑到不存在的关节、权重丢失。
- **panel 侧「行为不变」不能只靠套件全绿**：正确做法是把改动前 HEAD 的文件拉进树做逐值对比探针（0.2.126：`splitBonesFor` / `mirrorSplitBones` / 索引钳位三组）。

## 8. 进一步瘦身评估（0.2.61 结论，0.2.129 复测仍成立）

> 结论：**app.js 已接近「编排层地板」；再拆主要是伪模块化**。真正可拆的只剩少量 UI 辅助函数簇，收益约 200–500 行，不值得为拆而拆，除非出现明确驱动（第二入口 / 测试 harness / 某功能需要独立复用）。
> 0.2.115–0.2.129 五轮功能开发是这个结论的**反面验证**：新增的 5 个模块（tip-width-curve / strand-tip-width / tip-sub-bone-host / bridge-export / uv-pack-worker 等）全部按真实复用边界产生，app.js 只多了接线，没有再拆出「一次引用的小模块」。

实测基线（**0.2.129 现场统计**）：app.js **20,828 行**、**580 个顶层 function 声明**、**950 个顶层 const**（其中 636 个是 DOM 引用）、**1 个顶层 let（camera）**、**571 处 addEventListener**；`import` 90 条、29 个 `createXxxApi` 实例、20 处 `Object.assign(*Deps, …)` 批填。modules **104 文件 / 41,931 行**。原版 39,207 行 → 当前 20,828 行（**≈−47%**）。
历史刻度：0.2.61 = 18,412 行（拆分终点 18,401 + 少量）；main 0.1.5 移植后 19,970；0.2.110 后 20,183；0.2.129 = 20,828。

### 8.1 剩余代码三大块与是否该拆

> 下列行号是 **0.2.129 实测值**，会随开发漂移——用 `FUNCTION_INDEX.md` 或 grep 复核，不要照抄。

1. **脊柱（不拆=正确）**
   - undo/snapshot/mirror 数据管线：`mirrorPartnerFor`(9397)、`snapshotState`(9767)、`pushUndoState`(10119)、`restoreState`(10346)、`restoreLock`(10392) 等，约 1,100–1,300 行。
   - selection 粘合层：`selectLock`(12975)→`getSelectedLock`(13913)，约 45 函数 / 938 行；`getSelectedLock` 仅 app.js 内就 97 个调用点。
   - curve-objects 核心：`createCurveObjects`(11606)/`updateCurveObjects`(11930)/`syncLockFromCurve`(12384)/`rebuildLockGeometry`(12414) + `outwardNormalAtPoint`/`guidedNormalAt`/`strandGeometryCurve`/`strandGeometryFrameAt`，约 800–1,000 行。
   - 这些是**跨子系统横切**：抽出去会形成模块间循环依赖，或把隐藏耦合显式化为「注入一切」的 deps 传参，收益为负——正是 §6 已判定的伪模块化。

2. **编排/初始化/事件绑定（不拆）**
   - 顶部 950 个 const 里 636 个是 DOM 引用；20 处 deps 批填 + bootstrap + animate + 571 处 addEventListener。这部分是「胶水」本身，拆到模块只是搬家，不减少耦合（绑定要引用所有 store/api），反而增加跳转成本。

3. **过小/过散单点（拆了意义不大）**
   - `setupEditableSliderControls`(399)、`updateInteractionLocks`(5844)、`configureTransformControls`(5855)、`pointerHitsTransformGizmo`(5907)、`rayFromViewportEvent`(7056)、`profileToCanvas`(8546)/`renderProfilePreview`(8553)/`renderHairCardCoveragePath`(8572)、`updateViewportStatsVisibility`(9121)、`strandControlPointHitFromEvent`(11548)、`renderLockList`(15292)、`bindUndoCapture`(15488)、`activateStrandControlPoint`(19361)/`addStrandControlPointSelection`(19438)/`closestStrandCurveParameter`(19565) 等。
   - 这些都是 20–150 行的单点，散落且依赖 DOM/store/其它 app.js helper；即使全部抽出，总收益约 200–500 行，却要新增十几个「一次引用」小模块，性价比低。

### 8.2 什么情况下才值得再拆

- 出现**第二入口/复用需求**：如 SSR、测试 harness、Web Worker、或「无 UI 导出服务」需要复用某组 helper，再按真实边界抽。`uv-pack-worker.js`（0.2.110）就是这类**真驱动**的样板：Worker 需要零依赖 import 打包核心，边界天然存在。
- 某个功能要**独立演进**且改动频繁（如 profile 预览、大纲列表、transform gizmo 命中），此时抽出可隔离回归。
- **两种几何要共用同一交互**：0.2.125/0.2.126 的样板——先抽纯函数共享层（参数化掉 lock）+ 描述子分派，再放宽门控；**不要在第二种几何上长出第二套实现**。
- 否则建议保持现状，把精力放在 seam/契约测试与「删除死绑定」上，而不是追求行数。

### 8.3 比瘦身更划算的下一步

- 用 `node scripts/gen-function-index.js` 定期刷新 FUNCTION_INDEX（每次结构性改动后）。
- 按 `in-progress/tip-subsystem-reuse-audit.md` 逐条 collapse 残余重复推导（最严重：fork-T 规则 `1−max(左右高)` 在全仓库 9 处各算一遍，与 0.2.124 那个 bug 同形）。
- 清理已确认的死绑定/死 DOM 引用（如 server.js `/api/save-project` 死代码）比再拆模块更实在。
