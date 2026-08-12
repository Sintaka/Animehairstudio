# 几何 + 骨骼拆出计划（从 app.js 分两个独立域）

> 状态：**完成**（2026-08-12，几何 G1-G7 + 骨骼 B0-B3 全部落地，9 个 commit；app.js 32,530→26,288 行）。
> 动机：app.js 32,530 行仍是单文件上限压力；几何（~5.4k 行）与骨骼（~1.0k 行）是其中最大、且边界最清晰的两块，拆出并分开后，未来 bone roadmap（lock.bones/架空）与 delta mush 的改动都落在模块内。
> 关联：本计划是 devlog/in-progress/appjs-slim-remaining-plan.md 的聚焦子集（几何=其中的 A1/B1/G 类批次；骨骼=新增域）。
> 基于只读盘点（2026-08-12，FUNCTION_INDEX + app.js 实测），行数为毛估（净减≈毛行×0.75，扣 deps 脚手架）。

## 域设计（分开的关键）

```
骨骼数据  modules/bones/bone-model.js   （叶子，只依赖 THREE，自包含）
几何      modules/geometry/*           ──读──▶ bones-data (splitBonesFor/materializeSplitBones)
骨骼 UI   modules/bones/*              ──▶ geometry frames + bones-data + sculptState
app.js 脊柱 (addLock/snapshot/restore/mirror/stroke 各 2 行接线) ──▶ bones-data（保留，不拆）
```

- 依赖单向无环：geometry 只依赖 bones-data；bones-UI 只依赖 geometry；app.js 脊柱只做 2 行接线。
- modules/bones/ 新建域可行：bone-model.js 自包含、只有 app.js 1 处 import（L8），移动只改这一行。
- taper 编辑器保留在几何域（G5）；activeTaperTarget（materializeSplitBones+下标）下沉 bones-data 或随 G5 走；骨骼只留段控制胶水（B1）。

## 一、几何域（modules/geometry/）子批次

| 批次 | 内容 | 函数数 | 净减估 | 难度 | 说明 |
|---|---|---|---|---|---|
| G4 ✅ | curve-surface / surface-lattice 创建 | 50 | ~1,077 | 低 | 已迁出 modules/geometry/curve-surface-create.js（0.2.60 前，verify-smoke 10/11=基线） |
| G7 ✅ | poly 拓扑 | 28 | ~612 | 低中 | 已迁出 modules/geometry/poly-tools.js（verify-smoke 10/11=基线） |
| G5 ✅ | taper 编辑器（含 activeTaperTarget） | 32+1 | ~782 | 中 | 已迁出 modules/geometry/taper-editor.js（seam 重导出 renderTaperCurveEditor；verify-smoke 10/11=基线） |
| G1 ✅ | 面板/tip strand 几何（含 tip sub-bone 消费） | 26+1常量+10嵌套 | ~959 | 中 | 已迁出 modules/geometry/panel-tip-strand.js（19 个 seam 重导出；verify-smoke 10/11=基线） |
| G2 ✅ | split strand 几何 | 4+嵌套 | ~242 | 中 | 已迁入 modules/geometry/strand-geometry.js（G2+G3 合并批；triangulatePolygon3D 死代码删除） |
| G3 ✅ | base strand/card/compound 几何 | 7+嵌套 | ~603 | 中 | 已迁入 modules/geometry/strand-geometry.js（createHairGeometry 5 处接线；verify-smoke 10/11=基线） |
| G6 ✅ | sculpt 几何 | 34+9常量 | ~752 | 中 | 已迁出 modules/geometry/sculpt-geometry.js（G6↔B2 双向边经 deps；几何域 G1-G7 全部完成；verify-smoke 10/11=基线） |

> 几何合计净减 ~5.4k 行。依赖：curve-math、bone-model（数据读，不写）。

## 二、骨骼域（modules/bones/）子批次

| 批次 | 内容 | 行区间 | 函数 | 净减估 | 难度 |
|---|---|---|---|---|---|
| B0 ✅ | bone-model.js 移入 modules/bones/ | — | 0（纯移动） | 低 | 已移动，3 处 import 更新（app.js/panel-tip-strand/taper-editor）；verify-smoke 10/11=基线 |
| B1 ✅ | 段控制胶水 | 5 | ~121 | 低中 | 已迁出 modules/bones/segment-control.js（seam 1；verify-smoke 10/11=基线） |
| B2 ✅ | 骨骼 gizmo/拖拽/笔刷 | 8 | ~695 | 中 | 已迁出 modules/bones/bone-interaction.js（B2↔G6 双向边经 deps；seam 2；verify-smoke 10/11=基线） |
| B3 ✅ | 视口 handle | 5 段 | ~473 | 中高 | 已迁出 modules/bones/bone-view-handles.js（脊柱改薄 5 点；curveObjects 契约 CDP 8/8 保持；骨骼域 B0-B3 全部完成；verify-smoke 10/11=基线） |

> 骨骼合计净减 ~1.0k 行（不含脊柱接线）。

## 三、顺序建议（先几何，后骨骼）

1. 几何快赢：G4 → G7 → G5（每批独立 commit + verify-smoke）。
2. 几何大块：G1→G2（最大块，tip 几何连同 bone 参数消费一并收敛 modules/geometry）→ G3 → G6。
3. 骨骼收尾：B0（移动 bone-model.js，改 app.js L8 import）→ B1 → 先局部重构拆出 B3 → B2。
4. 脊柱接线（addLock/syncMirrorPartner/snapshotState/restoreLock/stroke 各 2 行）保留在 app.js，不拆。

## 四、硬障碍（每批前先处理）

- ① 序列化/undo/镜像 bones 字段在 app.js 脊柱：不拆，模块只供纯函数（bonesToData/bonesFromData/mirrorSplitBones 已是模块函数）。
- ② B3 与 curve-objects-core（createCurveObjects/updateCurveObjects/syncLockFromCurve）纠缠最深：先局部重构出 bone handle 段，再拆。
- ③ `__AHS_TEST_SEAM`（L32474-32529）引用 ~30 个 bone/tip 函数名：抽取后必须保留 seam 重导出（把 api 函数挂回 seam）。
- ④ stroke/creation 3 处 bones 复制属 draw 批：若先拆 draw 则随行带走，否则暂留 app.js。
- ⑤ tip 选择走 app.js pointer 事件层（userData.tipSubBoneHandle）：事件绑定留 app.js，回调改 api。

## 五、每批执行模板（沿用 appjs-slim-remaining-plan.md，批次 4/5 教训）

1. 先出函数引用图（devlog/in-progress/<batch>-refactor-map.md）。
2. 裸引用静态扫描归零（含 spread `...name`、app.js import 绑定、store 代理双重 .state）。
3. 引导期 deps 时序审计（批填前的顶层 api 调用，deps 就地填充）。
4. 跨批次重接（其它模块 deps 里引用了本批迁出函数名的，改 api.X）。
5. 编码：UTF-8 无 BOM、CRLF、中文逐字节一致。
6. 回归：node --check 双文件 + verify-smoke（layered-side-bun.ahs）与 HEAD 基线一致（10/11）。

## 六、收益

- app.js 净减 ~6.4k 行（几何 5.4k + 骨骼 1.0k）→ ~26k 行；配合 appjs-slim-remaining-plan.md 的其余批次（draw/preset/taper UI 等）最终可到 ~18-20k。
- 骨骼域独立后：bone roadmap（lock.bones、架空、KineFX 统一视图）在 modules/bones/ 内演进，不再动 app.js。
- 依赖单向无环 → 几何与骨骼可并行开发零冲突。
