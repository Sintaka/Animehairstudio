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
- [ ] **阶段 2：按依赖图拆第一个子系统**（候选：save/export、子发片桥接）
- [ ] **阶段 3（可选）：全局状态收敛**（237 个 let → 按子系统 store）

## 验证策略（每条铁律）

1. 每个改动 commit 独立跑 Playwright headless 回归：静态服务器 127.0.0.1:8080 + `%TEMP%\ahs-verify-three\vendor`(three) + D:/Downloads/Sussurro_v1_004*.ahs，断言无页面错误、桥接 quads/NaN 与基线一致。
2. 文档类改动：改完 `Select-String` 抽查渲染/链接。
3. 拆分只允许「独立 commit + 失败回滚」，不允许「拆完未验证」。
