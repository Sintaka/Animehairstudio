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

判不准就不归档：本索引只收录经核实「代码/测试零引用 + 正文无残留未做项」的文档；其余在 `in-progress/` 里仍被代码注释指向或正文含未完成项的文档，一律留在 `devlog/in-progress/`。

主脑本轮的判据被证伪，留档以免重犯：我断言「16 份 `*-refactor-map.md` 全部已完成、可归档」，子智能体实测发现其中 15 份被 `modules/*.js` 与 `app.js` 的代码注释直接引用（形如 `// full list: devlog/in-progress/xxx-refactor-map.md section 3`），是"完整 deps 清单在哪查"的活指针，不是历史记录。主脑独立复核确认共 27 处这类引用——按原判据搬走会一次打断全部 27 个指针。只有 `preset-library-refactor-map.md` 零代码引用，故 16 份里只归档了 1 份。

教训：「已完成」不等于「可归档」。判据必须是「代码/测试零引用」，而不是「工作是否收口」——已完成的工作照样可以留着一份被代码指向的速查表。

0.2.145：15 份 refactor-map 终于可归档，不是因为判据放宽，而是因为把钉住它们的 32 处代码注释指针**先处理掉了**——其中 27 处经逐处读码确认是纯冗余（注释承诺的「完整 deps 清单」就是紧邻的 Object.assign 批填点，54–157 项逐项字面列出），5 处内容不可替代、已内联进代码注释。教训：文档搬不动时，先查「钉住它的东西本身是否必要」，而不是反复重判文档本身。
