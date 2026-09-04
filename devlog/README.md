# Anime Hair Studio — Devlog 索引 / Devlog index

> 这是本地适配开发日志的目录 / 指引字典。详细内容已拆到各专题文件，按需读取，避免一次性加载全文。
> 新增改动时：把详细条目追加到对应专题文件（local-adaptation-log.md / js-change-annotations.md / bug-fixes.md），不要再往本文件追加版本摘要——「最近版本」段只留指针，避免与专题文件产生滞后副本。

## 子发片底模（Low-poly child-strand base mesh）

![子发片底模](assets/lowpoly-child-strand-basemesh.png)

> 本 fork 支持 low-poly 子发片拓扑：父发片挖洞后，子发片通过低模水密桥接（父孔洞边界 → 子根环 → 顶/底带 + 侧面 quad）与父级衔接。截图是子发片底模部分；导出 UV 已解决（0.2.69–0.2.79）：按扫掠 grid 属性生成矩形 UV（规则/理念/踩坑见 [uv-unfold.md](uv-unfold.md)）。

> 本地运行方式（静态服务器 / `node server.js` / `npx http-server`）见仓库根 [README.md](../README.md)。

## 字典 / Dictionary

| 主题 | 文件 |
|---|---|
| 新 Agent 快速入口（保留代码清单 + 决策总览，先读这个） | [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md) |
| 派活共享前言（子智能体先读这个） | [SUBAGENT_BRIEF.md](SUBAGENT_BRIEF.md) |
| 重构计划 / 执行状态 | [REFACTOR_PLAN.md](REFACTOR_PLAN.md) |
| 从原版拆分指引（完成，新 agent 必读） | [APPJS_SPLIT_GUIDE.md](APPJS_SPLIT_GUIDE.md) |
| 函数索引（机器生成，函数名→行号→calls） | [FUNCTION_INDEX.md](FUNCTION_INDEX.md)（`node scripts/gen-function-index.js` 重新生成；过期就跑生成器，勿手改，具体计数现场核实） |
| 全局状态登记表（机器生成） | [GLOBAL_LET_INVENTORY.md](GLOBAL_LET_INVENTORY.md)（`node scripts/gen-let-inventory.js` 重新生成） |
| 状态管理架构（scene-store 模式 / store 清单 / 发尖选中键 §2.1 / 替换验证 9 点） | [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) |
| 子发片系统架构（数据流 / 5 子系统划分 / 依赖清单 / 3d-3 拆分方案） | [BranchSystem.md](BranchSystem.md) |
| 拆 UV 规则 / 实现理念 / 踩坑记录（普通发丝 + 子发片，0.2.69–0.2.79） | [uv-unfold.md](uv-unfold.md) |
| USD 骨骼/蒙皮导出规范（Houdini 实测） | [usd-bone-export.md](usd-bone-export.md) |
| 蒙皮权重算法分析（视口 vs 导出） | [weight-algorithm.md](weight-algorithm.md) |
| 加载性能对比（本地 fork vs upstream main 实测） | [performance-load.md](performance-load.md) |
| 迁移方法论（脚本化提取 / 依赖注入 / 模块间 import / 9 点验证清单） | [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) |
| 开发规范 / 持续修改功能（本地适配清单）/ 许可证 | [development-standards.md](development-standards.md) |
| JS 改动标注（索引 + 6 个子系统专题） | [js-change-annotations.md](js-change-annotations.md)（索引）+ [annotations-bridge.md](annotations-bridge.md) / [annotations-region-panel.md](annotations-region-panel.md) / [annotations-root-bone.md](annotations-root-bone.md) / [annotations-split.md](annotations-split.md) / [annotations-display-fixes.md](annotations-display-fixes.md) / [annotations-adapt.md](annotations-adapt.md) |
| Bug 修复 / 已知问题 | [bug-fixes.md](bug-fixes.md) |
| 修改型笔刷开发规范 | [brush-dev-spec.md](brush-dev-spec.md) |
| 本地适配进度（时间线，权威版本历史） | [local-adaptation-log.md](local-adaptation-log.md) |
| 技术架构分析 & 复刻 DCC 参考 | [AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md](AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md) |
| Main 同步冲突 / 决策记录（Local 选项移除、桥接区合并策略） | [main-sync-conflicts.md](main-sync-conflicts.md) |

## 进行中计划 / In-progress plans

> 完成后归档到 [archive/](archive/)（不是 `plans/archive/`——本仓没有 `plans/` 目录）。

- [archive/uv-unfold-plan.md](archive/uv-unfold-plan.md) — 导出拆 UV：主体已完成（0.2.79），剩余待办 5 项。
- [archive/panel-split-tip-bones.md](archive/panel-split-tip-bones.md) — **历史实施记录，止于 0.2.65，已被 0.2.123/0.2.125/0.2.126 三轮取代，勿当当前状态读**：`panelTipSelection`、`isPanelGeometry` 门控、「每段 1 个把手」皆已变更，详见文档头部作废清单。
- [in-progress/panel-strand-unify-plan.md](in-progress/panel-strand-unify-plan.md) — 0.2.62 已落地：发尖子骨骼普适化，strandTip/strandSplitBones 启用。
- [archive/child-sweep-unification.md](archive/child-sweep-unification.md) — 子发片=默认扫掠+桥接+根部移动，P2 已实现。
- [archive/wind-preview-plan.md](archive/wind-preview-plan.md) — 吹风预览已实现（0.2.112–0.2.113）；文档内碰撞路线图 §8 仍未实施。
- [archive/uv-pack-parallel-plan.md](archive/uv-pack-parallel-plan.md) — 多线程打包已实现（0.2.110，23 岛 4.0s→341ms）；Phase 2 去栅格暂缓。
- [archive/strand-zipper-port-plan.md](archive/strand-zipper-port-plan.md) — 普通发丝多拉链移植，0.2.116 已全部落地；已知未做项见文档头部状态行。
- [archive/strand-tip-width-ui-port-plan.md](archive/strand-tip-width-ui-port-plan.md) — 发尖 WidthCurve UI 移植到普通发丝，0.2.125 已实施。**原文 §1.1「按 profile 点的 x 符号判定左右侧」是错的**——裁剪后每根管 raw x 只有一个符号，照做会产生死区；实施时已改为管内相对坐标，先读文档头部「实施期修正」。
- [archive/strand-tip-selection-port-plan.md](archive/strand-tip-selection-port-plan.md) — 发尖选中系统移植到普通发丝，0.2.126 已实施：`tip-sub-bone-host.js` + `tipSelection`/`tipHover` 改名 + 每链点把手。
- [in-progress/tip-subsystem-reuse-audit.md](in-progress/tip-subsystem-reuse-audit.md) — 发尖子系统重复推导规则审计（0.2.126）：残余重复站点 / 建议处置 / 刻意保留的不对称，重构前必读。
- [archive/scalp-conform-bend-v4-plan.md](archive/scalp-conform-bend-v4-plan.md) — Scalp Conform 第四版胶囊轴，0.2.143 已实施。**已被第五版取代，「球冠/圆柱二分」概念已废除**——读它只为查 D1–D11 裁决与前四版驳回理由。
- [archive/scalp-conform-ellipsoid-v5-plan.md](archive/scalp-conform-ellipsoid-v5-plan.md) — Scalp Conform 第五版纬线轴 + 拟合椭球，0.2.144 已实施（删掉 `min(C.y,P.y)` 病根、新增全局 `scalpConformFit`、修 NaN 静默摊平）。**D11 三难与两条椭球已知限制必读**；CDP 真实链验收尚未跑。

以下已完成，仅供追溯：

- [archive/bone-system-roadmap.md](archive/bone-system-roadmap.md) — 骨骼推进路线 + registry，Phase A/B/C 已落地 §4.5。
- [archive/split-bone-refactor-plan.md](archive/split-bone-refactor-plan.md) — Split Spacing/Trim → split 子骨骼，P1 已实现。
- [archive/unified-bone-model.md](archive/unified-bone-model.md) — KineFX 式统一骨骼模型，已实现。
- [archive/appjs-slim-remaining-plan.md](archive/appjs-slim-remaining-plan.md) — 拆分延续计划，剩余批次 A2/A3/A4/A6/B2/B3/B6/C1 全部完成。
- [archive/geometry-bones-extraction-plan.md](archive/geometry-bones-extraction-plan.md) — 几何 G1-G7 + 骨骼 B0-B3 全部完成；各批 `<batch>-refactor-map.md` 为引用图，见 [archive/README.md](archive/README.md) 索引。

## 常用查找 / Quick lookup

- 新 agent 上手：先读 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（哪些代码必须保留 + 决策 + 关键函数名）。
- 子发片深度重置 / 桥接系列（2.1→2.5，含坐标方向规律、底部/侧面/顶部桥接、选区控制、width curve 联动、sweep 起点）：annotations-bridge.md（几何/挖洞）+ annotations-region-panel.md（选区）+ annotations-root-bone.md（gizmo/twist）。
- 导出拆 UV（普通发丝 + 子发片扫掠/桥接规则、实现理念、9 条踩坑）：uv-unfold.md。
- 刘海 / 面板线框三角面修复：annotations-display-fixes.md + bug-fixes.md #3/#4/#5。
- 快捷键 / 导出 / 笔刷 / 语言 / 导航：js-change-annotations.md 顶部条目；修改型笔刷规范见 brush-dev-spec.md。
- 本地持久化功能（简体中文、Houdini 导航、Quick Save/Export 等）：development-standards.md「持续修改功能」。

## 最近版本 / Latest

> 完整时间线见 [local-adaptation-log.md](local-adaptation-log.md)（按版本号编年）与 [js-change-annotations.md](js-change-annotations.md)（逐文件改动标注）；bug 根因见 [bug-fixes.md](bug-fixes.md)。这两个文件是最近版本的唯一真源——本节不复制版本摘要，只保留下面两条**在别处查不到**的独有记录（历史遗留，均已核实）。

- devlog 字典整理 + 吹风计划复查（0.2.111，仅文档，实施准备；**全仓库唯一出处**）：重新生成 FUNCTION_INDEX/GLOBAL_LET_INVENTORY；字典文件更新到拆分后现状；「main 原版」指针全部指向当前编排层架构；新增踩坑 2 条（worker boxes 必须 Float64Array / worker_threads 必须 URL 对象；`?v=` 缓存号必须定点刷新勿全局替换）；UV Phase 2 结论暂缓（详见 uv-pack-parallel-plan.md §3）；吹风预览计划复查（开关改入 Preview 菜单，详见 wind-preview-plan.md §0）；dom-contract 滞后断言清理进行中。
- 代码复用审计 + 文档纠偏（0.2.129，**全仓库唯一出处**；审计正文见 [in-progress/tip-subsystem-reuse-audit.md](in-progress/tip-subsystem-reuse-audit.md)）：审计发尖子系统重复推导，发现 8 条真重复，最严重的是 fork-T 规则 `1 − max(左右高)` 全仓库 9 处各算一遍（后已于 0.2.133 collapse，见审计文档 §9）；另标 7 项「不建议动」（`tipChainPointCount` 的 0/2 下限差、两个 usda tag、`FACTORS_APPROXIMATION=1` 等），防止后人照过时文档「修」掉刻意的不对称；`APPJS_SPLIT_GUIDE.md` 重写至 0.2.129（136→266 行），修正多处漂移数字；同时根除 `development-standards.md` 里写在「不要复写版本号」警告自身里的过期版本号。

