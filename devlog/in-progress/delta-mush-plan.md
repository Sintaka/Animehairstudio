# 骨骼弯曲防重叠 +（可选）Delta Mush 平滑 — 实施计划

> 状态：**主任务已实现（0.2.66，codex/0.2.66-sweep-corner-smooth）**；Delta Mush 仍为可选辅助（未实现）。原目标版本 `0.1.4-Sintaka.0.2.60+`。
> 关联：bone-system-roadmap.md、AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md。
> 历史：本文档最初按"Delta Mush 平滑"立项；2026-08-11 经评估后**修正为以「扫掠防重叠」为主任务，Delta Mush 降级为可选的辅助平滑**，见 §1。

## 0. 实施状态（0.2.66 主任务已完成）

- §3 曲率感知环收窄 + 转角边缘平滑已按本节实现并合入：
  - `curve-math.js`：`sweepCurvatureResponse`（返回 `{factors, heat}`，heat 供平滑加权）/ `smoothSweepChains`（纵向链 Jacobi Laplacian）。
  - `strand-sweep.js` `sweepSide` + `strand-geometry.js` split/hair card 接入；脊柱不动，仅剖面按曲率收窄。
  - `branch-bridge.js` 内联 Laplacian 抽到新模块 `mesh-smooth.js`（`smoothMeshVertices`）。
  - UI：`#sweepOverlapPanel`（Strength 0.7 / Threshold 0.6 / Edge Smooth 0.3），per-lock 持久化 + hairState 全局默认；默认参数导出 `SWEEP_OVERLAP_DEFAULTS`（strand-sweep.js 单源）。
  - 验证：core-math 114 pass、verify-smoke 10/11=基线、dom-contract 16/89 不变；开关置 0 逐位守恒。
- §6 Delta Mush（可选辅助）未实现，仍按原评估保留为后续项；§3.4 源头夹角 clamp 未做（留给用户调 Threshold）。
- 0.2.67 跟进：`sweepCurvatureResponse` 新增 `falloff`（默认 3，`SWEEP_OVERLAP_DEFAULTS.falloff`），收窄系数/heat 沿脊柱三角加权扩散、端点钉死，消除急弯处被处理环与相邻未收窄环的宽度硬跳变/缺口；UI 增加 Sweep Overlap Falloff 滑块。


## 1. ⚠️ 评估结论（先读）

**用户初衷**：在保证大体变形（骨骼姿态）不变的前提下，解决主骨骼弯曲角度过大导致扫掠 poly 重叠。

**评估：Delta Mush 不是必需，也不是对症的工具。**
- 重叠的根因是**扫掠自相交**：`modules/geometry/strand-sweep.js` `sweepSide` 里每环 = 曲线点 + frame.x·宽 + frame.z·深。当脊柱局部曲率半径 ρ < 环半宽，或曲线折返（发夹弯）时，相邻环/两腿相互穿插。**扫掠内核目前没有任何曲率感知处理**（只有 dynamic density 加密 + 帧传输）。
- Delta Mush = 对变形的低通滤波 + rest 细节还原。它"解决"重叠只能靠**把折角磨圆（摊开弯曲）**，这正是用户想保留的"大体变形"本身——与初衷冲突；且它是松弛而非求交求解，**不保证消除重叠**，发夹弯下磨得再圆也可能仍重叠；rest 有卷曲时 delta 还原甚至可能把重叠加回来。
- 正确做法是**从扫掠端直接约束**：按局部曲率/段长收窄剖面。脊柱（大体变形）完全不动，只在弯折处变窄 → 无重叠。成本 O(n)/根发丝，比 Delta Mush（rest 缓存 + 标架 + 迭代）更省、更可控。

## 2. 需求

- 骨骼编辑（主链 points / split 子骨骼 / 子发片链）→ 触发几何重建时才计算；整根刷新；不空转（复用现有 rAF 合并队列）。
- 保证大体变形：脊柱点不动，仅扫掠剖面按曲率收窄。
- 主面板 2 个 float + 滑块（推荐语义：收窄强度 / 阈值，替代原 Delta Mush 的迭代/强度；若仍要平滑残留折角，可再留一组 relax 参数，见 §6）。

## 3. 推荐主任务：扫掠防重叠（curvature-aware ring clamp）

### 3.1 算法
在 `sweepSide`（modules/geometry/strand-sweep.js ~66-73，ring 生成处）对每个采样环：
1. 计算局部曲率半径 ρ（或更稳的代理量：相邻环中心距离 / 弦长 s）。
2. 计算该环当前最大横向半径 r = max(|w.x|, |w.z|)（宽度方向为主）。
3. 若 r > safety · ρ（safety 约 0.5~0.7），把环缩放系数 clamp 到 `min(1, safety·ρ/r)`，乘到 `warped` 的 x/z 上（与现有 `sampleScale(lock.pointScales, ...)` 组合）。
- 效果：折角处局部变窄 → 相邻环不再相交；脊柱、UV、法线、帧全部不变。
- 备注：发夹弯"两条长腿近距平行"属自接近（self-proximity）情形，局部曲率 clamp 只解决弯折处；若需要，后续再加段级自距离检测（v1 范围外）。

### 3.2 代码落点
- `modules/geometry/strand-sweep.js` `sweepSide`：在 `curveParameters.forEach` 环循环内，用 `curve.getTangentAt/getPointAt`（或相邻点差分）求 ρ，计算并应用收窄系数。
- 面板/子发片/braid 共用 `strand-sweep.js` 或各自 sweep 的，若为独立实现（`createPanelStrandGeometry`、`branch-bridge.js` child sweep）则同步加同样的 clamp 助手。
- 助手可放 `modules/geometry/curve-math.js`：`curvatureClampFactor(points, t, width, { safety, minScale })`，纯函数可测。

### 3.3 UI（2 个 float + 滑块，主面板）
- `index.html` 在 `branchBridgePanel`（~932）后加 `sweepOverlapPanel`（`panel-section sliders hidden` `data-attribute-panel="strands"`）：
  - **收窄强度** `#sweepOverlapStrength`：range 0–1 step 0.01 value 0.7（float）。
  - **阈值/灵敏度** `#sweepOverlapThreshold`：range 0.1–2 step 0.01 value 0.6（float，safety 系数）。
- `app.js` wiring 照抄 `branchBridgeSmoothStrengthInput` 模式（app.js 2657 / 33282-33321）；per-lock 值 + 全局默认（`hairState.state.sweepOverlapStrength/Threshold`）；input → clamp → 写 lock + state → `updateLockGeometry(lock, { immediate: true })`。
- 本地化：loc-ja.js / loc-zh.js 补 "Overlap Prevention" / "Strength" / "Threshold" 词条。
- 持久化：serializer（app.js ~17580-17620）+ 反序列化（~17037）+ 快照/恢复（~18951/~19048）+ 镜像（~17425）+ stroke/creation（~22615/~23038）四路同步。

### 3.4 可选加固（源头限制）
- 主链骨骼间夹角上限：编辑骨骼时 clamp 相邻段夹角（如 ≤150°），从源头挡掉极端折叠；保留整体姿态直到阈值。与 3.1 组合使用。

## 4. 触发与"不空转"（与原计划一致）

- 骨骼编辑统一走 `updateLockGeometry`/`rebuildLockGeometry`（app.js ~26307/~26383），已有 `pendingLockGeometryUpdates` + rAF 合并——一帧多次编辑只重建一次；无变更不重建。
- 直通：`strength<=0` 或 `threshold` 极大 → 系数恒 1，零额外成本。
- 收窄系数是纯函数、每环 O(1)，无需缓存/标架/迭代，天然便宜。

## 5. 验证

1. 恒等：`strength=0` 或直线/小弯曲 → 顶点与关闭时一致（1e-6）。
2. 效果：主链 90°/150° 弯折 → 折角处剖面收窄、无重叠 poly；脊柱点与弯曲形状不变（大体变形保留）。
3. 不空转：拖动骨骼 → 每帧最多一次 rebuild；无改动无重建。
4. 性能：全场景（200+ locks）开关前后 cook 时间对比，应 <1ms。

## 6. Delta Mush（降级为可选辅助）

若评估后仍想要"把折角残留磨圆"的平滑控制，再按原 delta-mush 方案实施：
- 新模块 `modules/geometry/delta-mush.js`（1D 链 Laplacian + 局部标架 delta，根部钉住）。
- hook：`strandGeometryCurve`（app.js 13216）脊柱点级；panel split 段（`tip.restPoints`/`tip.points`）与子发片链后续补。
- UI 复用 §3.3 面板或另加一组（迭代 0–10 float / 强度 0–1 float）。
- **顺序**：先做主任务（防重叠），验证重叠解决后，若仍有折角伪影再决定是否要 DM。

## 7. 范围外（后续）

- 发夹弯两腿近距平行（self-proximity）的段级收窄。
- 动画逐帧变形场景。

## 8. 参考文献 / 出处（sweep 自相交是老问题）

- G. Elber, *Global error bounds and amelioration of sweep surfaces*, Computer-Aided Design 29(6), 1997, 441-447 —— 大曲率脊线导致 sweep 自相交的消除（最对症）。
- T. Maekawa, *An overview of offset curves and surfaces*, Computer-Aided Design 31(3), 1999, 165-173 —— 判据：偏置距离 > 曲率半径即自相交；sweep 与 offset 同源。
- 汪国平等, *Sweep 曲面自相交的快速检测和消除*（北京大学）—— 距离判据 + 候选区间去除（精确检测，离线 CAD 用）。
- Chuan He, Aizeng Wang, Gang Zhao, *Self-intersection detection algorithm of sweep surfaces based on geometric features of spine curves*, Computer-Aided Design 192:104024 (2026) —— 最新检测算法。
- Bishop frames / rotation-minimizing frames —— 防扭转伪影；本项目已用帧传输。
- 工业界惯例（Rhino/SolidWorks/Onshape 文档 + Houdini odforce #21427）：scale = min(1, ρ/r·safety)；剖面置于弯外侧；width ≤ k·segmentLength 兜底。
- 结论：主任务 = 曲率感知环缩放（§3.1 的 clamp），脊柱不动；Delta Mush 属"平滑+混合"类治标补丁（可选）。
