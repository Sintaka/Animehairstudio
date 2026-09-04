# devlog 归档区

这里存放已完成工作的留档：拆分/重构计划的执行记录、已落地设计文档的规划稿。

agent 默认不读这里——除非要追溯某个历史决策的原始推理，按下表索引定点打开对应文件。读它们只增加上下文输入、不改变当前决策；当前状态永远以 `devlog/in-progress/` 里仍在跟踪的文档、`local-adaptation-log.md`、`js-change-annotations.md`、`bug-fixes.md`、`development-standards.md` 为准。

本索引刻意不写行号。上一版写了 `README.md:117` 这类定位，而它在同一轮内就漂移到了 `:118`——正是 `development-standards.md`「版本号规范」禁止的"写死具体值"。改为按小节标题引用。

归档动作全部是 `git mv`（不是复制/删除），历史完整保留；需要追溯改动过程可用 `git log --follow <path>` 查看归档前的提交记录。

## 索引

| 文件 | 是什么 | 归档日期 | 成文出处 |
|---|---|---|---|
| `bone-system-roadmap.md` | 骨骼系统推进路线图（`bonesFor`/`lock.bones` registry/架空语义设计） | 2026-08-22 | Phase A/B/C 于 0.2.59 落地，见 `local-adaptation-log.md`（按版本号 0.2.59 检索） |
| `appjs-slim-remaining-plan.md` | app.js 瘦身第二阶段计划（A2/A3/A4/A6/B2/B3/B6/C1 批次表） | 2026-08-22 | 各批次已完成，见 `local-adaptation-log.md` 中「重构：…迁出」系列条目 |
| `geometry-bones-extraction-plan.md` | 几何 G1-G7 + 骨骼 B0-B3 拆分计划 | 2026-08-22 | 全部完成，见 `local-adaptation-log.md` 各批次条目（G1/G2-G3/G4/G5/G6/G7 + B1-B2/B3） |
| `split-bone-refactor-plan.md` | Split Spacing/Trim → split 子骨骼重构规范（P1） | 2026-08-22 | 0.2.59 已实现，见 `local-adaptation-log.md`（按版本号 0.2.59 检索） |
| `unified-bone-model.md` | KineFX 式统一骨骼模型设计（`bonesFor` 只读视图） | 2026-08-22 | 0.2.59 已实现，见 `local-adaptation-log.md`（按版本号 0.2.59 / 0.2.61 检索） |
| `preset-library-refactor-map.md` | preset library 迁出（批次 B3）函数引用图 | 2026-08-22 | 已完成，见 `local-adaptation-log.md`「重构：preset library 迁出（B3）」条 |
| `curve-guide-refactor-map.md` | curve/guide 系统迁出（3d batch 5）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `clump-procedural-refactor-map.md` | clump/procedural 迁出（批次 B6）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `g5-taper-refactor-map.md` | taper 曲线编辑器迁出（G5）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `g6-sculpt-geometry-refactor-map.md` | sculpt 几何迁出（几何域批次 G6）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `radial-menu-refactor-map.md` | radial menu（径向菜单）迁出（批次 A2）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `g1-strand-geometry-refactor-map.md` | 面板/tip strand 几何迁出（G1）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `b1-b2-bones-refactor-map.md` | B1+B2 骨骼域迁出（段控制胶水 + gizmo/拖拽/笔刷）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `b3-bones-handle-refactor-map.md` | B3 骨骼域迁出（视口 handle）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `reference-head-refactor-map.md` | reference + head/body 迁出（批次 A4）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `g2-g3-strand-geometry-refactor-map.md` | G2/G3（split strand + base strand/card/compound 几何）迁出函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `g7-poly-refactor-map.md` | poly 拓扑工具迁出（G7）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `g4-refactor-map.md` | curve-surface / surface-lattice 创建层迁出（几何域批次 G4）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `material-io-refactor-map.md` | material + IO 收尾（rootAttachment + createProjectSaveApi 收敛）重构引用图 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `scalp-refactor-map.md` | scalp 系统迁出（refactor 3d batch 4）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `draw-creation-refactor-map.md` | draw/creation 流程迁出（批次 B2）函数引用图 + deps 分类 | 2026-08-23 | 代码注释指针已于 0.2.145 删除（deps 清单以 app.js 的 Object.assign 批填点为真源），零引用后归档 |
| `panel-split-tip-bones.md` | Panel Split 骨骼化 + 发尖子骨骼实施记录（S1–S6，止于 0.2.65） | 2026-09-04 | 文档自身已声明「不是当前状态」；当前状态见 0.2.123/0.2.125/0.2.126 三轮条目 |
| `child-sweep-unification.md` | 子发片扫掠统一到共享内核 `strand-sweep.js`（P2） | 2026-09-04 | 0.2.59 已实现；`sweepSide` 被 `createBaseHairGeometry` 与 `createBranchChildGeometry` 双双调用 |
| `uv-pack-parallel-plan.md` | UV pack 并行化（Phase 0/1：行区间表 + worker 池） | 2026-09-04 | 0.2.110 已实施（`local-adaptation-log.md` 按 0.2.110 检索）；Phase 2 由文档自身拍板暂缓并给出触发条件 |
| `uv-unfold-plan.md` | UV 展开 P1–P9 阶段表 | 2026-09-04 | 0.2.69–0.2.79 全部完成；规则/踩坑全集已迁至 `devlog/uv-unfold.md` |
| `wind-preview-plan.md` | 风场预览 v1（程序化预览 + 浮动窗口 + seed 卡死修复） | 2026-09-04 | 0.2.112/0.2.113 已实施；§8 碰撞路线图属未开工远期项，文档已标注「另立路线图」 |
| `delta-mush-plan.md` | 扫掠防重叠（曲率感知收窄 + 转角平滑） | 2026-09-04 | 0.2.66–0.2.68 已实施；§6 Delta Mush 经文档自身评估为「非对症」未立项 |
| `scalp-conform-ellipsoid-v5-plan.md` | Scalp Conform 第五版：椭球纬线 + 密切圆心 | 2026-09-04 | **原头部写「计划中」已滞后**，实为 0.2.144 已发布；`panelScalpConformOffsets` 实现与文档公式逐项对应。归档时已更正头部 |
| `strand-tip-selection-port-plan.md` | 发尖子骨骼选中系统移植到普通发丝 | 2026-09-04 | **原头部写「实施中」已滞后**，实为 0.2.126 已落地；`tip-sub-bone-host.js` 已建。归档时已更正头部 |
| `strand-tip-width-ui-port-plan.md` | 发尖 WidthCurve UI 移植到普通发丝 | 2026-09-04 | **原头部写「实施中」已滞后**，实为 0.2.125 已落地；`tip-width-curve.js` + `strand-tip-width.js` 已建并有测试。归档时已更正头部 |
| `strand-zipper-port-plan.md` | 普通发丝拉链移植（Phase A–F） | 2026-09-04 | 文档自身状态即「已全部实施」；`strandSplitDirection` 已于 0.2.132 被管中心公式取代 |
| `main-015-port-plan.md` | main 0.1.5 移植计划（三波任务） | 2026-09-04 | **原头部写「进行中」已滞后**，文档「十三、完成」章节已记收尾（`257225e`/`8584b2f`）。归档时已更正头部 |
| `branch-geo-merge-eval.md` | 桥接几何合并可行性评估（A/B/C 三层） | 2026-09-04 | 评估结论已拍板：B+C 于 0.2.113 落地（`mergeBranchFamilyMeshes`），A 层定性为独立后续 |
| `panel-bone-tree-handoff.md` | Panel 骨骼树交接（§4 方案 A：中间层分组节点的发尖链） | 2026-09-04 | 方案 A 已落地为 `splitTipForLeafSpan`；`tests/panel-tip-span-chain.test.mjs` 的指针已同步改指本文件 |
| `scalp-conform-bend-v4-plan.md` | Scalp Conform 第四版：绕竖直轴 Bend + k·cos²α | 2026-09-04 | 0.2.138–0.2.142 实施，**已被第五版（0.2.144）取代**；两条根因留作 v5 的证据来源，`tests/panel-scalp-conform.test.mjs` 指针已同步 |

判不准就不归档：本索引只收录经核实「代码/测试零引用 + 正文无残留未做项」的文档；其余在 `in-progress/` 里仍被代码注释指向或正文含未完成项的文档，一律留在 `devlog/in-progress/`。

主脑本轮的判据被证伪，留档以免重犯：我断言「16 份 `*-refactor-map.md` 全部已完成、可归档」，子智能体实测发现其中 15 份被 `modules/*.js` 与 `app.js` 的代码注释直接引用（形如 `// full list: devlog/in-progress/xxx-refactor-map.md section 3`），是"完整 deps 清单在哪查"的活指针，不是历史记录。主脑独立复核确认共 27 处这类引用——按原判据搬走会一次打断全部 27 个指针。只有 `preset-library-refactor-map.md` 零代码引用，故 16 份里只归档了 1 份。

教训：「已完成」不等于「可归档」。判据必须是「代码/测试零引用」，而不是「工作是否收口」——已完成的工作照样可以留着一份被代码指向的速查表。

0.2.145：15 份 refactor-map 终于可归档，不是因为判据放宽，而是因为把钉住它们的 32 处代码注释指针**先处理掉了**——其中 27 处经逐处读码确认是纯冗余（注释承诺的「完整 deps 清单」就是紧邻的 Object.assign 批填点，54–157 项逐项字面列出），5 处内容不可替代、已内联进代码注释。教训：文档搬不动时，先查「钉住它的东西本身是否必要」，而不是反复重判文档本身。
