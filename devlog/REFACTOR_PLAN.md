# 重构计划 / Refactor Plan

> 目的：把项目从「小项目一次性塞给 agent」推向「内容过多、一次读不完」阶段时，建立面向 agent 的文档检索流程、可拆分的项目结构、可并行的开发方式。
> 维护：每个阶段完成后更新下方「执行状态」并打勾；详细设计见 AGENT_QUICKSTART.md 与各专题文件。

## 目标（三个问题的答案摘要）

1. **文档检索**：三层金字塔——入口层（AGENT_QUICKSTART/README 字典）→ 检索层（机器生成的 FUNCTION_INDEX）→ 详情层（按子系统拆的专题 + VERSIONS.json）。
2. **项目结构**：app.js（39,207 行 / 1319 函数 / 237 全局 let）依赖图驱动、三阶段渐进拆分，不以「文件变小」为目标，以「子系统边界清晰」为目标。
3. **并行方式**：子 agent 在隔离副本工作、主 agent 整合；git 冲突取决于改动边界是否重叠；main 分支即原版跟踪，加 upstream remote，不另存原版文件夹。

## 现状基线（2026-08-09，0.2.56）

- app.js：39,207 行；顶层 function 1319 / const 780 / let 237；全文件仅 2 个 `// ----` 分区注释；index.html 只加载 app.js 一个 module。
- modules/*.js：38 个，均为「干净边界」小模块（export 纯函数/常量）；localization.js 92KB 实为词典数据。
- main 分支 = 原版（app.js 34,582 行）；HEAD 比 main 多 149 个本地提交；origin = Sintaka/Animehairstudio（自己的 fork）。
- devlog：js-change-annotations 107KB 线性（最大问题）；local-adaptation-log 按版本健康；AGENT_QUICKSTART 已建。

## 执行状态

- [x] **阶段 0：函数索引与依赖图脚本**（scripts/gen-function-index.js → FUNCTION_INDEX.md + FUNCTION_INDEX.json；1712 个函数，2026-08-09）
- [x] **阶段 1a：localization 词典拆数据文件**（modules/loc-ja.js + loc-zh.js，本地化逻辑零改动；JA/ZH key 数与拆分前完全一致 667/653；verify-smoke.mjs 6/6 通过）
- [x] **阶段 1b：bug-fixes 拆独立条目**（#3 拆为 #3/#4/#5，每版含根因/修复/验证/保留判断）
- [x] **阶段 1c：js-change-annotations 按子系统拆文件**（195 条目 → annotations-bridge/region-panel/root-bone/split/display-fixes/adapt 6 文件，原文件为 42 行索引；local-adaptation-log 保持唯一时间线）
- [x] **阶段 1d：加 upstream remote，核对 main 与上游同步**（upstream = Ludetools/Animehairstudio；main == upstream/main == d3358f6，完全同步）
- [x] **阶段 2a：目标文件夹架构落地（IO 域）**——新建 `modules/io/`，把 8 个现有 IO 模块移入（file-actions / file-drop / obj-export / obj-import / usda-export / project-schema / project-state / recent-projects），更新 app.js 8 处 import（纯路径，逻辑零改动）
- [x] **阶段 2b：从 app.js 拆 IO 子系统**（save/export + 文件对话框 → `modules/io/project-files.js`，依赖注入 4 函数 + 8 状态 getter/setter；app.js 39,207→38,785 行；verify-smoke 8/8）
- [x] **阶段 2c：全部模块按域归组落地**（core 5 / data 6 / edit 4 / geometry 14 / material 1 / sculpt 1 + io 9；扁平模块归零；material-state 跨域 import 改相对路径；verify-smoke 8/8）
- [x] **阶段 3a：全局状态登记表**（scripts/gen-let-inventory.js → GLOBAL_LET_INVENTORY.md/.json；241 个 let，按 refs/bucket/span 排序；核心状态集中在 app.js L2059-2422 场景状态带）
- [x] **阶段 3b：核心场景 store（选择集）**（12 个高频 let → modules/core/scene-store.js + modules/edit/selection-store.js；selectionSnapshot() 对接 io/project-state.js 快照；app.js 全局 let 241→229；verify-smoke 12/12 含选择交互点击）
- [x] **阶段 3c（第一批）：branch/sub store**（modules/branch/branch-store.js；8 个 let / 55 refs，含 5 个偏好持久化到 localStorage；全局 let 229→221；verify-smoke 12/12）
- [x] **阶段 3c（第二批）：draw/poly store**（modules/edit/draw-store.js；6 个 let / 41 refs；全局 let 221→215；verify 13/13）
- [x] **阶段 3c（第三批）：reference + ui-panel store**（modules/edit/reference-store.js + modules/core/ui-store.js；9 个 let；全局 let 213→206；verify 13/13）
- [x] **阶段 3c（第四批）：undo/transform/head store**（modules/core/undo-store.js + transform-store.js + head-store.js；8 个 let，含 IO fileApi 的 importedHeadAsset getter 兼容；全局 let 206→198；verify 13/13）
- [ ] **阶段 3c（后续）**：scalp / camera / guide / sculpt 等逐域落地（每域独立 commit + verify）

> 批量替换验证清单（3b/3c 教训，替换后必须逐项扫）：(1) 双重替换 `.store.state.`（对象属性名被误替换，曾致项目加载静默失败）；(2) 函数参数/绑定位置（`function f(store.state.x)`）；(3) 对象简写残留（含**跨行** `{ x,\n store.state.y,`，单行正则会漏，曾致 SyntaxError）；(4) 对象属性访问 `obj.name`（用 `(?<!\.)` 排除）；(5) `name:` key 位置（用 `(?!\s*:)` 排除）；(6) 字符串/选择器字面量（`document.querySelector("#name")` 曾把 `"#viewPlaneMoveSnappedOnly"` 误改成 `"#ui.state.viewPlaneMoveSnappedOnly"`，需用精确字符串字面量扫描）；(7) getter/setter 方法名（`get importedHeadAsset()` 曾被误改成 `get head.state.importedHeadAsset()`，对象字面量 get/set 方法名位置要排除）。每步替换后先跑这 5 项扫描再 node --check + verify-smoke 全量。
- [ ] **阶段 3d：app.js 瘦身为编排层**（业务逻辑迁入模块，模块显式依赖 store；IO 的 createProjectSaveApi(deps) 从 25 个散装依赖收敛为单个 store）

## 验证策略（每条铁律）

1. 每个改动 commit 独立跑 Playwright headless 回归：静态服务器 127.0.0.1:8080 + `%TEMP%\ahs-verify-three\vendor`(three) + D:/Downloads/Sussurro_v1_004*.ahs，断言无页面错误、桥接 quads/NaN 与基线一致。
2. 文档类改动：改完 `Select-String` 抽查渲染/链接。
3. 拆分只允许「独立 commit + 失败回滚」，不允许「拆完未验证」。

## 目标文件夹架构（modules/）

```
modules/
  core/      app-config preference-storage preferences-backup shortcut-registry history
  data/      loc-ja loc-zh localization clump-brush-presets shape-presets tool-presets
  geometry/  curve-math curve-surface curve-lattice surface-lattice poly-topology topology strand-constraints capsule-curve branch-connect compound-strand procedural-draw radial-layout anime-hair-shaders uv-inspector
  io/        project-files file-actions file-drop obj-export obj-import usda-export project-schema project-state recent-projects
  edit/      selection-state selection-sets mirror-selection multi-edit
  sculpt/    sculpt-brush
  material/  material-state
```

> 归组原则：按功能域分目录；模块间保持扁平（不互相 import，只被 app.js import）；每个域落地独立 commit + verify-smoke 回归。

## 阶段 3：全局状态收敛的工程意义

app.js 仍有 **241 个顶层 `let`**（全局可变状态），这是它无法真正模块化的根因，也是「项目内容过多、一次读不完」的核心障碍：

1. **并行开发的必要条件**：IO 拆分（2b）用了依赖注入，但 `createProjectSaveApi(deps)` 里塞了 8 个状态 getter/setter——这是「伪模块化」：状态还在 app.js 全局，任何改这些状态的功能仍会冲突。收敛成 store 后，每个子系统 = 独立模块 + 独立 store，两个 agent 改不同子系统 = 改不同文件 = 零冲突。
2. **undo / 恢复统一**：`io/project-state.js` 已有快照机制（createProjectSelectionSnapshot），但 241 个全局 let 分散导致快照必须手工枚举、容易漏；store 化后「快照 = 序列化 store」，新建/加载/重置项目 = reset store，彻底收敛散落的重置逻辑。
3. **状态可调试**：全局 let 无法追踪「谁在什么时候改了什么」。store 化后可加 middleware 记录状态变更（函数 → 状态 → 旧值/新值），直接服务历史 bug 定位（扫掠乱转、gizmo 跳变、region 反向这类状态问题）。
4. **减少全局命名空间污染**：241 个全局名 → 几个 store 对象，消除误引用/命名冲突，agent 定位状态也只需 grep store 键。
5. **渐进、可回滚**：按 3a→3d 分步，每步只收敛一个子系统的 let，独立 commit + verify-smoke 回归；getter/setter 兼容层保证中间态功能不回退。

> 风险与红线：不做「大爆炸重写」；不追求一步到位；每步收敛前先看 GLOBAL_LET_INVENTORY 的 refs 数，从高频（最核心）开始，避免低频冷状态拖慢进度。
