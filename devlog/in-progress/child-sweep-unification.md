# 子发片扫掠进化：默认扫掠 + 桥接 + 根部移动优化 — P2 设计

> 分支：0.2.58-panel-split-refactor；目标版本 `0.1.4-Sintaka.0.2.59`。本文件为 P2 **设计规范**。
> 目标：子发片**不是**分离的第二套系统，而是「在默认扫掠上增加桥接系统 + 优化根部移动逻辑」。

## 1. 现状问题

- `createBaseHairGeometry` strand 路径（app.js L14720 起）：CatmullRom 曲线 + sweepProfile 拓扑 + `strandGeometryFrameAt` 逐帧扫掠 + 三角端盖 + grid meta 输出。
- `createBranchChildGeometry`（modules/geometry/branch-bridge.js L575）**重复实现**了同一扫掠：squareChildRing 环 + `SWEEP_START_T` 起始 + 父曲面/gizmo 种子帧 + 桥接 + 端盖。两份扫掠逻辑漂移风险高。

## 2. 方案：共享扫掠内核

- 新模块 `modules/geometry/strand-sweep.js`，导出 `sweepStrandGeometry(lock, curve, profilePoints, options)`：
  ```
  options: {
    startT = 0,            // 起始参数（子发片 = SWEEP_START_T，普通 = 0）
    profile = null,        // 覆盖 profile 拓扑（子发片 = squareChildRing 的 ring）
    seedFrame = null,      // 首帧种子（子发片 = 父曲面切向 + gizmo 根帧）
    capStart = true,       // 是否根端盖（子发片 = false，桥接代替）
    capEnd = true,         // 是否 tip 端盖
    gridMeta = true,       // 是否输出 gridRows/gridColumns/gridFacesPerRow/gridSkipCol/quadFaces
    bridgeAttach = null    // 桥接结果（子发片 = buildBranchBridgeGeometry 输出），拼到根部
  }
  ```
- `createBaseHairGeometry` strand 路径改用默认 options → **行为不变**（三角端盖 + grid meta）。
- `createBranchChildGeometry` 改为：构建父孔洞 ring + 种子帧 → 调内核（startT、ring profile、无 start cap、end cap、不输出 grid meta）→ 接桥接 → 输出原有 userData（bridgeVertexCount/ringWidthSegments/actualLengthSegments 等）。
- `applyBranchRootRegionCarving`、region 面板、根骨骼 gizmo、`captureBranchLocalState`/`enforceBranchRootPosition`/`applyBranchRigidRootMove`/`branchSurfaceFrameQuat`/`branchParentFrame` 全部**原样保留**（它们是「根部移动优化」层，作用于 lock.points，与扫掠内核解耦）。

## 3. 兼容性 / 验证基线

- 子发片几何输出必须与 0.2.57 基线一致：bridgeVertexCount、ringWidthSegments、actualLengthSegments、quadFaces、triangleEdgeMasks、0 NaN、非流形数。
- 验证：Sussurro_v1_0041（普通父）/ 0042（split 父）/ 0044 三档，子发片桥接对比基线。
- 范围外：panel 暂不支持桥接类子骨骼；strand 单 split（createSplitStrandGeometry）不并入本次内核（独立几何，后续再议）。

## 4. 里程碑

- P2a：提取 strand-sweep.js 内核，`createBaseHairGeometry` strand 路径切换（verify-smoke 回归，行为不变）。
- P2b：`createBranchChildGeometry` 切换内核 + 桥接拼接（0041/0042/0044 几何对比基线）。