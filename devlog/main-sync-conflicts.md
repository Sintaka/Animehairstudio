# Main 同步冲突记录 / Main sync conflict log

> 本文件专门管理「main 上游更新 ↔ 本地 fork」之间的冲突、决策与合并记录。
> 新增 main 同步/合并工作时，把决策与冲突处理追加到本文件，并在 devlog/README.md 索引补一行。

## 决策记录 / Decision record

- **（2026-08）移除三个现有 Local 选项，改用本 fork 的快速保存 / 快速导出**：
  三个现有的 Local 选项——`Local Save`（#devSaveProject）、`Local Export to OBJ`（#localExportObj）、`Local Export to USDA`（#localExportUsda），全部标注 ⚠ "for Dev purposes"、全部走 `server.js` 的 `POST /api/save-project`（Node 本地服务 + 原生 SaveFileDialog + 临时文件 rename 原子写）——**均应移除**，统一使用本 fork 开发的**快速保存 Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）** 与**快速导出 Quick Export（Ctrl+Alt+S）**（浏览器 File System Access API 直写磁盘：覆盖写同一文件、不再产生 `(1)` 后缀）。
  - 依据：两者功能等价，我们的方案更优；server.js 只是把「外部本地小服务」收进了仓库（main d3358f6），本地架构文档第 90 行「服务不在本仓库」已过时，需在合并 main 时一并修订。
  - 状态：**决策已定，尚未实施**——三个 Local 选项目前仍保留在本 fork 的 index.html/app.js 中，待 main 合并时删除（连同 server.js 的本地保存端点，若保留 server.js 则仅保留静态文件服务 / 原生导出路径，另议）。

## Main 更新评估（d3358f6 "Add files via upload"，基线 0f34c27）

- **main 无子发片桥接代码**：`buildBranchBridgeGeometry` / `branchRootRegion` / `branchBridgeSmooth` 在 main 中全部不存在。
- **main 实际新增**：
  - 发丝预设 `PONYTAIL_CLUMP_TEMPLATE`（12 条 strands 的马尾预设，app.js:1020）挂入 `DRAW_CLUMP_TEMPLATES["ponytail-clump"]`；
  - 复合发丝几何 `createCompoundStrandGeometry`（app.js:14210，多控制器 + 控制器间桥接带，由 `lock.curveSurfaceCompoundProfile` 触发）；
  - `modules/compound-strand.js`（130 行）、`modules/procedural-draw.js` 程序化分支模板（`proceduralBranchGeometryLock`）；
  - 几何入口重构 `createHairGeometry` → `createBaseHairGeometry`（内部按 compound 分派）；
  - sculpt 画笔 preserve-tips 重构（`sculptBrushPreserveTipsByTool`）、材质双面判定统一为 `strandUsesDoubleSidedMaterial`；
  - `modules/radial-layout.js` / `modules/curve-math.js` / `modules/localization.js` / `modules/usda-export.js` 小改、`server.js` 原生保存对话框、`favicon.svg`。

## app.js 17 处冲突分类（git merge main 复现，坐标 = 冲突解析时行号）

| # | 行号 | 行数 | 功能区域 | 性质 |
|---|---|---|---|---|
| C1 | 206-210 | 5 | 顶部 import 缓存号 | 机械（版本号） |
| C2 | 10944-10953 | 10 | syncSculptBrushToolButtons（preserve-tips 显隐） | 功能重叠，需融合 |
| C3 | 11210-11214 | 5 | activeBrushSizeInput | 功能重叠，需融合 |
| C4 | 11226-11230 | 5 | refreshActiveBrushSizeCursor | 功能重叠，需融合 |
| C5 | 11247-11251 | 5 | refreshActiveBrushSizeScale | 功能重叠，需融合 |
| C6 | 13940-13988 | 49 | 本地 triangulatePolygon3D vs main orientedQuadFace | 各自新增、同插入点，保留两侧 |
| C7 | 14461-15444 | 984 | 本地 buildBranchBridgeGeometry+createBranchChildGeometry vs main createCompoundStrandGeometry | **各自新增、同插入点，无功能重叠（约 1000 行大冲突 = 误读）** |
| C8 | 15450-15492 | 43 | bridge userData vs compound userData 收尾 | 同插入点尾部，各自保留字段 |
| C9 | 15497-15571 | 75 | createHairGeometry 入口：本地 branchRootRegion 分支 vs main proceduralBranch + createBaseHairGeometry | 功能重叠，唯一真正需要手工融合的几何入口 |
| C10 | 15866-15870 | 5 | applyMaterialDefinitionToLock（材质双面判定） | 条件合并 `branchRootRegion \|\| strandUsesDoubleSidedMaterial` |
| C11 | 17400-17410 | 11 | openTaperCurveEditor（目标标签） | 功能重叠，需融合 |
| C12 | 17770-17774 | 5 | addLock（材质双面判定） | 同 C10 |
| C13 | 20023-20027 | 5 | restoreLock（材质双面判定） | 同 C10 |
| C14 | 23750-23755 | 6 | detachBranch 清理字段（两侧各加一行 delete） | 机械，两侧都保留 |
| C15 | 28097-28101 | 5 | rebuildLockGeometry（材质双面判定） | 同 C10 |
| C16 | 37914-37924 | 11 | applySculptMoveStrokeSample（本地 slide/scale/push vs main preserve-tips） | 功能重叠，需融合 |
| C17 | 37952-38010 | 59 | applySculptMoveStrokeSample（本地 slide 分支 vs main smooth/preserveTips） | 功能重叠，需融合 |

汇总：机械 2（C1/C14）+ 同插入点无重叠 3（C6/C7/C8）+ 功能重叠需融合 12（C2-C5、C9-C13、C15-C17）。index.html 另有 3 处（版本/缓存/新增结构）。

## 多发丝预设 vs 子发片系统（重要结论）

- main 预设走 clump/compound 路径（马尾 = 12 条独立 strands 的 clump；复合发丝 = 单 lock 内 3 控制器复合几何）；子发片系统走**单发丝路径**（分叉绘制 → attachDrawnLocksAsBranches → `if (lock.branchRootRegion) createBranchChildGeometry`），假设「一个子 lock ↔ 一个父孔洞环 ↔ 一次单曲线扫掠」。
- **直接把 main 的多发丝预设当子发片用会有 bug**：马尾是多 lock 集合、复合发丝是 lock 内多控制器，桥接不认识其 userData/顶点布局，索引与段数对不上会出错误拓扑；材质双面条件也要并入 `branchRootRegion`。
- 合并策略：桥接区**保留本地桥接实现、按需吸收 main 预设**；C9 入口按 `branchRootRegion` 先分流；不要直接把预设挂进子发片桥接路径；若未来要让马尾/复合预设支持子发片，应在桥接层单独适配多控制器/多 lock 拓扑。