# 子发片系统架构 / BRANCH SYSTEM ARCHITECTURE

> 3d-3（子发片桥接系统迁出）的前置梳理。子发片系统是 app.js 中最独立的大块（93 个核心函数），但内部深交织。本文档给出数据流、子系统划分、依赖清单与拆分方案。

## 1. 系统总览（数据流）

```
用户绘制分叉
  → attachDrawnLocksAsBranches：建子 lock（branchParentId/branchRootRegion 初始化）
  → captureBranchLocalState：记住子相对父的局部状态（across/along、朝向）
  → Region 选区（branchRootRegion 2D u/v + 3D 标记）→ normalizeBranchRootRegion 规范
  → applyBranchRootRegionCarving：父几何挖洞（删面 + 同步 triangleEdgeMasks）
  → buildBranchBridgeGeometry + createBranchChildGeometry：桥接几何（父孔洞边界 → 子根环）
  → updateBranchChildren：层级更新（子跟随父移动）
根骨骼工作流：
  → branchRootGizmoFrame（tube 数学基线 + 用户 twist）→ 扫掠 up/tangent/twist 跟随
  → syncBranchRootRegionOffsets：H 模式拖根时 region 跟随
```

## 2. 子系统划分（5 组 + 独立性）

| 子系统 | 核心函数 | 外部依赖 | 独立性 |
|---|---|---|---|
| **region-panel**（选区/2D 面板/拖拽） | clampRegionParam, normalizeBranchRootRegion, syncBranchRootRegionOffsets, updateBranchRootRegionCenter, setBranchRootRegionPoint, renderBranchRegionEditor, applyBranchRegionView, branchRegionNavAction, begin/update/endBranchRegionCanvasDrag, begin/update/endBranchSweepStartDrag, updateBranchRegionMeshPoints, branchRegionUVToCanvas/CanvasToUV, branchRootRegionFromParam, cloneBranchRootRegion 等 ~31 | 外部 app.js 函数 ~8（getSelectedLock, pushUndoState, rebuildLockGeometry, updateCurveObjects, resize, pointerToNdc, closeSweepProfileEditor, closeTaperCurveEditor）；store 5（branch/sel/sculptState/viewportState/hair）；DOM ~25 个 branchRegionCanvas 等 | **最独立（推荐先拆）** |
| **geometry**（桥接几何/挖洞） | buildBranchBridgeGeometry, createBranchChildGeometry, directBridgeQuadIndex, applyBranchRootRegionCarving, branchRootRegionSurface, branchRegionTopEdgeCount, branchRootRegionWorldPoints, applyBranchRootOffset | 几何工具 ~9（strandCurveParameters, strandGeometryFrameAt, strandProfileTopologyAt, strandControlPointFrame, curveFrameAt, guidedNormalAt, controlPointRotationAt, toGridCol, fusedIndexAt）+ updateBranchChildren；内部 build↔create 互调 | 依赖几何工具，中等 |
| **root-bone**（根骨骼/gizmo） | captureBranchLocalState, branchParentFrame, branchLocalVector, branchWorldVector, branchSurfaceFrameQuat, applyBranchRigidRootMove, syncBranchRootHandleFrame, enforceBranchRootPosition, stableBranchBaseNormals, ensureBranchParentNormalField, branchRootGizmoFrame, branchMoveGizmoDisabled/Visual | 内部紧密；依赖 updateBranchChildren, updateBranchRootRegionCenter, clampRegionParam | 内部紧密，中等 |
| **hierarchy**（层级树） | attachDrawnLocksAsBranches, branchChildrenFor, detachBranch, updateBranchChildren, canBranchDrawFromLock, selectedDrawBranchPoint | attach 依赖 ensureBranchParentNormalField/captureBranchLocalState/branchRootRegionFromParam/updateBranchChildren；updateBranchChildren 是跨组 hub（root-bone/geometry 都依赖） | 依赖多，**最后拆** |
| **sweep-profile**（扫掠/轮廓编辑器） | activeSweepProfile, createSmoothSweepProfileCurve, sampleSweepProfile, createSweepProfileTopology, trimmedSweepProfile, mirroredSweepProfileIndex, twistCurveEditing, renderSweepProfileEditor, applySweepProfileEdit, open/closeSweepProfileEditor 等 ~18 | 依赖 taper 编辑器（open/closeTaperCurveEditor）、renderTaperPreview 等 | 与 taper 系统耦合 |

## 3. 已有模块与复用

- `modules/geometry/branch-connect.js`：**纯函数桥接核心**（squareChildRing / holeBoundary / connectSide / connectBoundaryToRing，无 THREE 依赖）——已经是模块，迁移时直接复用
- store：branch（参数/视图）、sel（选中）、sculptState（taperCurveEdit 等）、projectState、guideState、draw、hair 均已就绪

## 4. 拆分方案（建议批次）

| 批次 | 迁出 | 新模块 | 依赖注入 |
|---|---|---|---|
| **3d-3a** | region-panel（~31 函数） | modules/geometry/branch-region-panel.js | `createBranchRegionApi(deps)`：~8 函数 + 5 store；DOM 内部 query（branchRegionCanvas 等） |
| **3d-3b** | geometry（~8 函数） | modules/geometry/branch-bridge.js | `createBranchBridgeApi(deps)`：~9 几何工具 + updateBranchChildren；复用 branch-connect.js |
| **3d-3c** | root-bone（~12 函数） | modules/geometry/branch-root-bone.js | `createBranchRootBoneApi(deps)`：updateBranchChildren + updateBranchRootRegionCenter 等 |
| **3d-3d** | hierarchy + sweep-profile | modules/geometry/branch-hierarchy.js + branch-sweep.js | 最后做（hub 依赖多） |

## 5. 风险与注意

1. **updateBranchChildren 是跨组 hub**：root-bone/geometry/hierarchy 都依赖它，且它自身依赖多（branchParentFrame/branchWorldVector/captureBranchLocalState/applyBranchRootOffset/branchChildrenFor）——建议在 hierarchy 批次一起迁，避免反复注入。
2. **build↔create 循环互调**：buildBranchBridgeGeometry ↔ createBranchChildGeometry 同组迁移（不要拆到两个模块）。
3. **几何工具依赖**：strandCurveParameters/strandGeometryFrameAt 等仍在 app.js（是发丝几何核心）——3d-3b 注入引用；若后续把 hair 几何也迁出，可改模块间 import。
4. **DOM 面板元素**：region-panel 依赖 ~25 个 DOM（branchRegionCanvas 等）——模块内部 querySelector（DOM 就绪时），保持 app.js 的 const 引用不删（其他函数可能用）。
5. 每批独立 commit + verify 13/13；沿用「删函数 + api 创建 + 调用点替换 + 9 点扫描」成熟流程。
