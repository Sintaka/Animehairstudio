# app.js 瘦身第二阶段计划（剩余子系统迁出）

> 状态：规划中（未开工）。目标版本 0.1.4-Sintaka.0.2.60+（与 delta mush 并行不冲突）。
> 前置：REFACTOR_PLAN 阶段 3d 批次 1-5 已完成（creation/shape preset、branch 系列、scalp、curve/guide），app.js 37,914→32,530 行。
> 本计划基于 devlog/in-progress/ 的只读盘点（2026-08-12），行数/函数数/外部调用点为毛估（FUNCTION_INDEX 相邻函数行距）。

## 目标

- 继续按子系统把业务逻辑迁入 modules，app.js 只保留「初始化 + store 装配 + 事件绑定 + 少量脊柱函数」（与 REFACTOR_PLAN 目标一致）。
- 让 app.js 单文件规模从 32.5k 行降到 ~18-20k 行（净减 ~1.2-1.4 万行），降低单文件对 LLM 上下文的压力。
- 不以「文件变小」为唯一 KPI：子系统边界清晰 + 并行开发零冲突仍是同等目标。

## 现状（2026-08-12，0.2.59-refactor）

- app.js：32,530 行 / 1,079 个顶层函数 / 顶层 let 仅 1 个（camera）/ 67 个模块文件。
- 已迁出样板：modules/scalp/scalp-builder.js（120 函数）、modules/geometry/guide-system.js（129 函数），均为 createXxxApi(deps) 依赖注入。

## 候选批次（收益排序）

| 优先级 | 批次 | 函数数 | 毛行 | 净减估 | 难度 | 外部调用点 | 说明 |
|---|---|---|---|---|---|---|---|
| A1 | curve-surface / surface-lattice 创建 | ~50 | ~1,200 | ~950 | 低 | 43 | 低耦合高收益，curve-surface.js 等模块已就位 |
| A2 | radial menu | 36 | ~830 | ~650 | 低 | 21 | 极低耦合、完全自洽 |
| A3 | procedural duplicate | 22 | ~730 | ~580 | 低 | 17 | 极低耦合、自洽 |
| A4 | reference + head/body | 74 | ~1,720 | ~1,400 | 低中 | ~110 | 参考图/头部互相独立，可合成或分两批 |
| A5 | poly tools | 28 | ~665 | ~530 | 低中 | 16 | 自洽工具集 |
| A6 | material | 16 | ~310 | ~250 | 低 | 51 | 小但干净，material-state.js 已在 |
| B1 | strand/panel/split/tip 几何与编辑 | ~100 | ~4,500 | ~3,400 | 中 | ~220 | 最大剩余块，建议分 2-3 批；与 bone roadmap 强相关（先拆几何，bones 改动落模块内更安全） |
| B2 ✅(1/2) | draw/creation 流程（B2-1 draw-stroke+live-surface 完成） | 55 | ~1,237 | 中高 | B2-1 已迁出 modules/geometry/draw-flow.js（12 处跨模块重接；B2-2 放置 18 函数待迁；verify-smoke 10/11=基线） |
| B3 ✅ | preset library（含 hair 生成器） | 32+5嵌套 | ~1,980 | 中 | 已迁出 modules/io/preset-library.js（删 7 个死函数 1,072 行；装配 presetLibraryApi→creationPresets 顺序；verify-smoke 10/11=基线） |
| B4 | taper curve editor | ~39 | ~1,680 | ~1,300 | 中 | 63 | 自洽编辑器；updateSelectedTaperPoint 单函数 601 行 |
| B5 | sculpt 笔刷 | ~45 | ~1,000 | ~800 | 中 | ~55 | sculpt-brush.js 已有纯函数底座；delta mush 不触及 |
| B6 | clump/procedural | 36 | ~860 | ~690 | 中 | 72 | 与 draw 相关但自成一组 |
| C1 | IO 遗留 + rootAttachment | 26 | ~610 | ~490 | 低 | 40 | 与「createProjectSaveApi(deps) 收敛为单 store」一并收尾 |

> A=低风险快赢批（约 4,360 行净减），B=大块批（约 9,390 行），C=收尾。全部完成 app.js 可到 ~18.5k 行。

## 不值得拆（留在 app.js）

- **undo/restore/快照 + mirror/serialize**（31 函数/~1,200 行）：数据管线，pushUndoState 108 引用、restoreLock 224 行——跨子系统最高风险，拆=伪模块化。
- **curve-objects-core**（27/~540）：updateLockGeometry/syncLockFromCurve/rebuildLockGeometry 即几何脊柱。
- **selection-edit**（45/~920，外部调用点 291 全文件最高）：纯粘合层（selectLock/getSelectedLock/marquee/删除）。
- **UI 事件绑定/初始化 + render loop**（547 个 addEventListener + animate + bootstrap）：计划目标中 app.js 的保留部分。
- 过小/过散的单点（viewplane-nav、view-camera、prefs-appconfig、display-visibility、group-len-dim、panel-floating、layer-hair、branch-leftover 等）。
- 未归类脊柱：applyValue+updateTransformScalePointer+bindLockInput（~750 行数值输入管线）、addLock(212)、setActiveTool/updateInteractionLocks（hub）。

## 每批执行模板（批次 4/5 的踩坑教训，必须逐条执行）

1. **先出函数引用图**（写 devlog/in-progress/<batch>-refactor-map.md）：待迁函数/行号、外部调用点、deps 注入清单、边界判定。
2. **裸引用静态扫描归零**：对模块内每个 app.js 顶层函数/const/let 名检查，排除模块自身定义/import/JS 内建/THREE/字符串注释/deps.X/属性访问；**注意 spread `...name` 也是裸引用**（前两字符 `..`，须与 `obj.name` 区分）。
3. **app.js import 绑定扫描归零**：app.js 里从其它模块 import 的名字（如 DEFAULT_LAYER_OFFSETS），模块裸用必须补 import 或走 deps。
4. **store 代理双重 .state 检查**：deps 传的是 `.state` 代理，模块内必须 `deps.X.y` 而不是 `deps.X.state.y`（批次 5 复现过 165 处）。
5. **引导期 deps 时序审计**：批填（Object.assign）之前的顶层 `api.X(` 调用，其传递闭包 deps 必须在调用行前就地填充；批填生效行 = `});` 行，不是 key 行。
6. **跨批次重接**：其它模块 deps（scalpBuilderDeps 等）里引用了本批迁出函数名的，改成 `api.X` 引用。
7. **编码**：UTF-8 无 BOM、CRLF、中文逐字节一致（非 ASCII 总量守恒，允许 ±1）。
8. **回归**：node --check 双文件 + verify-smoke（带 assets/presets/layered-side-bun.ahs）结果与 HEAD 基线一致（当前基线 10/11，唯一失败为 branch-bridge 内容相关）。

## 执行顺序建议

1. A 批（低风险快赢，每批独立 commit）：curve-surface → radial → duplicate → material → poly → reference/head。
2. B 批（大块，strand 几何拆 2-3 批）：B1 → B4 → B3 → B2 → B5 → B6。
3. C 收尾：IO 遗留 + rootAttachment + createProjectSaveApi(deps) 收敛为单 store。

## 风险与注意

- 与 delta mush（0.2.60）并行：delta mush 只动已拆的 strand-sweep.js/curve-math.js，不阻塞本计划；反之亦然。
- 与 bone roadmap 强相关：建议先拆 strand/panel/split 几何（B1），未来 lock.bones 改动落在模块内更安全。
- 序列化/快照/镜像链路（restoreLock/snapshotState/mirrorPartnerFor）保留在 app.js，各批边界注意不要把它们卷进去。
- 每批独立分支或按 commit 推进，verify-smoke 全量回归后再提交；大改动开独立分支（版本号-操作 命名）。
