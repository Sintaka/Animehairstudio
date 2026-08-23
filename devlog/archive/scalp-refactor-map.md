# scalp 系统迁出 — 函数引用图（refactor 3d batch 4）

> 目标：把 app.js 中 scalp（头皮）系统业务函数迁到 `modules/scalp/scalp-builder.js`（`createScalpBuilderApi(deps)` 依赖注入），app.js 只保留初始化 + store 装配 + 事件绑定。
> 本文件由迁移前的静态分析生成（2026-08-11），作为引用图与边界判断依据。

## 0. 边界判断与范围

- **迁移范围**：120 个顶层函数（FUNCTION_INDEX 中 121 个 scalp 命中，其中 `scalpSeed` 是 `addBraidedBobPresetV2` 内的嵌套 const，属 shape-preset 系统，**不迁移**，随宿主函数留在 app.js）。
- **不迁移**：scalp 相关的顶层 const/let（`scalpState`、`scalpSurfaceGroup`、`scalpRenderGeometry`、`scalpSurfaceMesh/Wire/SelectionOutline`、`scalpBrushCursor`、`scalpBuilderGroup/TemplateOverlay`、`scalpLattice*`、`scalpRoughScale*`、`SCALP_BUILDER_STEPS`、`scalpBuilderPlanePositions/Contours`、`scalpSetup*` 等 DOM const、`scalpInputs/scalpSurface/scalpArtistInputs/scalpArtistShape`、`advancedLatticeButton`）——全部留在 app.js，作为 deps 注入。
- **不改动**：index.html、store 文件（modules/scalp/scalp-store.js）、scalp 之外子系统代码。
- **api 创建时序**：scalp 初始化代码在模块顶层执行（L1467/1504/1579/1642/1831/3050 共 6 处模块级调用），且 deps 中大量 const 定义在 L1466 之后 → `scalpBuilder` 必须在 L1466（`scalpState` 创建后）创建，deps 用**可变对象** `scalpBuilderDeps` 渐进填充：模块级调用所需的 deps 在各 const 定义点就地填充，其余 deps 在最后一个 dep 定义（`advancedLatticeButton`@L3049）之后一次性批量填充。

## 1. 待迁函数清单（120）

| # | 函数 | app.js 行号 | 类型 | 外部调用点 |
|---|---|---|---|---|
| 1 | `createAuthoredScalpGeometry` | 1412-1463 | function | 1 |
| 2 | `buildDefaultScalpRegionAssignments` | 1482-1502 | function | 1 |
| 3 | `updateScalpRenderGeometry` | 1508-1557 | function | 1 |
| 4 | `writeScalpRegionColors` | 1559-1570 | function | 0 |
| 5 | `applyDefaultScalpRegionAssignments` | 1572-1578 | function | 1 |
| 6 | `createScalpSelectionOutline` | 1602-1641 | function | 1 |
| 7 | `activeScalpSurfaceMesh` | 1644-1647 | function | 14 |
| 8 | `activeScalpSurfaceWire` | 1649-1652 | function | 0 |
| 9 | `activeScalpSelectionOutline` | 1654-1657 | function | 0 |
| 10 | `inferredCustomScalpRegion` | 1659-1664 | function | 0 |
| 11 | `writeCustomScalpRegionColors` | 1666-1683 | function | 0 |
| 12 | `customScalpGeometryFromObject` | 1685-1715 | function | 0 |
| 13 | `customScalpWireGeometry` | 1717-1726 | function | 0 |
| 14 | `installCustomScalpGeometry` | 1728-1750 | function | 0 |
| 15 | `installCustomScalpGuide` | 1752-1768 | function | 1 |
| 16 | `setScalpGuideSource` | 1770-1784 | function | 3 |
| 17 | `updateScalpQuadWire` | 1786-1800 | function | 1 |
| 18 | `updateScalpTopology` | 1802-1829 | function | 1 |
| 19 | `fullBodyScalpFocusBounds` | 3110-3122 | function | 4 |
| 20 | `syncScalpRoughScaleInputs` | 3160-3167 | function | 2 |
| 21 | `applyScalpRoughScale` | 3169-3181 | function | 2 |
| 22 | `realignFullBodyGuideToScalpTop` | 3197-3211 | function | 1 |
| 23 | `syncScalpInputs` | 3558-3562 | function | 0 |
| 24 | `syncScalpArtistInputs` | 3564-3570 | function | 0 |
| 25 | `rootScalpOffsetDistance` | 3572-3575 | function | 13 |
| 26 | `applyLockRootScalpOffset` | 3577-3591 | function | 4 |
| 27 | `scalpArtistWeight` | 3691-3693 | function | 0 |
| 28 | `scalpArtistScalesAt` | 3695-3703 | function | 0 |
| 29 | `applyScalpArtistShape` | 3705-3721 | function | 0 |
| 30 | `inverseScalpArtistShape` | 3723-3748 | function | 0 |
| 31 | `updateScalpSurface` | 3750-3758 | function | 1 |
| 32 | `setActiveScalpRegion` | 3760-3770 | function | 1 |
| 33 | `clearScalpRegions` | 3772-3787 | function | 2 |
| 34 | `scalpHitFromEvent` | 3789-3795 | function | 1 |
| 35 | `updateScalpBrushCursor` | 3797-3810 | function | 1 |
| 36 | `paintScalpAt` | 3812-3877 | function | 0 |
| 37 | `beginScalpPaint` | 3879-3886 | function | 1 |
| 38 | `updateScalpPaint` | 3888-3895 | function | 1 |
| 39 | `endScalpPaint` | 3897-3902 | function | 2 |
| 40 | `createScalpLattice` | 3904-3927 | function | 1 |
| 41 | `resetScalpLattice` | 3929-3939 | function | 0 |
| 42 | `updateScalpLatticeObjects` | 3941-3953 | function | 1 |
| 43 | `applyScalpLatticeDeformation` | 3960-3985 | function | 1 |
| 44 | `updateScalpLatticeFromHandle` | 3987-4000 | function | 1 |
| 45 | `selectScalpLatticePoint` | 4002-4015 | function | 1 |
| 46 | `beginScalpLatticeDrag` | 4017-4033 | function | 1 |
| 47 | `updateScalpLatticeDrag` | 4035-4051 | function | 1 |
| 48 | `endScalpLatticeDrag` | 4053-4057 | function | 2 |
| 49 | `disposeScalpBuilderVisuals` | 4069-4085 | function | 1 |
| 50 | `updateScalpBuilderPositionReadout` | 4087-4093 | function | 1 |
| 51 | `scalpBuilderHeadMeshes` | 4142-4150 | function | 3 |
| 52 | `scalpBuilderIntersectionPositions` | 4152-4162 | function | 0 |
| 53 | `rebuildScalpBuilderIntersection` | 4164-4186 | function | 1 |
| 54 | `createScalpBuilderPlaneVisual` | 4188-4201 | function | 0 |
| 55 | `createScalpBuilderPlanes` | 4203-4233 | function | 0 |
| 56 | `updateScalpBuilderStepUi` | 4235-4255 | function | 0 |
| 57 | `parseScalpTopologyTemplate` | 4273-4294 | function | 0 |
| 58 | `loadScalpTopologyTemplate` | 4296-4306 | function | 0 |
| 59 | `loadScalpBuilderCurveLatticeTemplate` | 4308-4318 | function | 0 |
| 60 | `scalpBuilderCurveLatticeWorldPoints` | 4320-4323 | function | 0 |
| 61 | `scalpBuilderCurveLatticeEdges` | 4325-4335 | function | 0 |
| 62 | `subdivideScalpBuilderCage` | 4337-4445 | function | 1 |
| 63 | `scalpBuilderSurfaceGeometry` | 4447-4470 | function | 0 |
| 64 | `writeEditedScalpRegionColors` | 4472-4485 | function | 0 |
| 65 | `syncEditedScalpSurface` | 4487-4556 | function | 0 |
| 66 | `ensureEditedScalpSurface` | 4558-4586 | function | 1 |
| 67 | `updateScalpBuilderCurveLatticeGeometry` | 4588-4671 | function | 0 |
| 68 | `scalpBuilderLatticeNeighbors` | 4673-4684 | function | 0 |
| 69 | `scalpBuilderLatticeDistances` | 4686-4700 | function | 0 |
| 70 | `scalpBuilderProportionalWeight` | 4702-4710 | function | 6 |
| 71 | `scalpBuilderMirrorMap` | 4712-4728 | function | 0 |
| 72 | `beginScalpBuilderCurveLatticeEdit` | 4730-4741 | function | 1 |
| 73 | `commitScalpBuilderCurveLatticeEdit` | 4743-4748 | function | 1 |
| 74 | `updateScalpBuilderHandleColors` | 4750-4767 | function | 3 |
| 75 | `selectScalpBuilderCurveLatticePoint` | 4769-4781 | function | 0 |
| 76 | `updateScalpBuilderCurveLatticeFromHandle` | 4783-4822 | function | 1 |
| 77 | `scalpBuilderCurveLatticePointHit` | 4824-4831 | function | 0 |
| 78 | `beginScalpBuilderCurveLatticeSelection` | 4833-4844 | function | 0 |
| 79 | `prioritizeScalpBuilderPointSelection` | 4846-4865 | function | 1 |
| 80 | `createScalpBuilderCurveLattice` | 4867-5002 | function | 1 |
| 81 | `clearScalpBuilderTemplateOverlay` | 5004-5010 | function | 0 |
| 82 | `scalpTemplateNeighbors` | 5012-5022 | function | 0 |
| 83 | `smoothScalpVectorField` | 5024-5036 | function | 0 |
| 84 | `displayScalpBuilderConstructionCurves` | 5211-5594 | function | 1 |
| 85 | `keepScalpShellOutsideHead` | 5596-5629 | function | 0 |
| 86 | `rebuildScalpBuilderTemplateOverlay` | 5631-5719 | function | 1 |
| 87 | `generatedScalpObjContent` | 5721-5733 | function | 0 |
| 88 | `generateScalpFromBuilder` | 5735-5898 | function | 0 |
| 89 | `resetScalpBuilder` | 5900-5913 | function | 2 |
| 90 | `confirmScalpBuilderPlane` | 5915-5927 | function | 1 |
| 91 | `beginScalpBuilderInput` | 5929-5929 | function | 1 |
| 92 | `updateScalpBuilderStroke` | 5930-5930 | function | 1 |
| 93 | `finishScalpBuilderStroke` | 5931-5931 | function | 2 |
| 94 | `setScalpBuilderEditing` | 5933-5965 | function | 6 |
| 95 | `updateScalpEditingVisibility` | 5967-6059 | function | 4 |
| 96 | `setScalpSetupMenuOpen` | 6131-6133 | function | 8 |
| 97 | `createScalpGuideOutlinerRow` | 6904-6937 | function | 1 |
| 98 | `activeToolUsesScalpGuide` | 7619-7626 | function | 0 |
| 99 | `toolAutoShowsScalpGuide` | 7628-7636 | function | 0 |
| 100 | `autoShowScalpGuideForActiveTool` | 7638-7642 | function | 3 |
| 101 | `setScalpGuideVisibility` | 7644-7650 | function | 4 |
| 102 | `setScalpLatticeEditing` | 7893-7906 | function | 1 |
| 103 | `setScalpShapeEditing` | 7908-7924 | function | 4 |
| 104 | `setScalpPaintEditing` | 7926-7948 | function | 4 |
| 105 | `scalpRegionSurfaceSamples` | 7985-8007 | function | 0 |
| 106 | `curveLatticePointsForScalpRegion` | 8009-8056 | function | 3 |
| 107 | `scalpFittedCapsuleSpec` | 10171-10189 | function | 0 |
| 108 | `createScalpFittedCapsuleGuide` | 10191-10200 | function | 1 |
| 109 | `mirroredScalpRegion` | 17216-17223 | function | 4 |
| 110 | `scalpTriangleRegion` | 17865-17876 | function | 1 |
| 111 | `closestPointOnActiveScalp` | 17878-17948 | function | 8 |
| 112 | `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18086-18096 | function | 0 |
| 113 | `remapLegacyPresetToActiveScalp` | 18222-18264 | function | 1 |
| 114 | `importScalpGuideMeshFile` | 18267-18282 | function | 1 |
| 115 | `restoreAuthoredScalpForStateRestore` | 18757-18832 | function | 1 |
| 116 | `sampleScalpQuad` | 19721-19743 | function | 3 |
| 117 | `scalpRegionAtHit` | 20680-20690 | function | 1 |
| 118 | `scalpRegionNearestWorldPoint` | 20692-20697 | function | 3 |
| 119 | `activeStrokeScalpOffset` | 20821-20825 | function | 3 |
| 120 | `drawScalpRegionAtEvent` | 21464-21485 | function | 1 |

## 2. 外部调用点（app.js 边界外调用 → 改 `scalpBuilder.xxx`）

共 167 处（TOP-LEVEL 65 + IN-FN 102），另有模块内互调 171 处（IN-EXTRACTED，模块内直接调用，不改写）。

| 函数 | 行号 | 上下文 | 类型 |
|---|---|---|---|
| `beginScalpBuilderCurveLatticeEdit` | 833 | TOP-LEVEL | CALL |
| `commitScalpBuilderCurveLatticeEdit` | 835 | TOP-LEVEL | CALL |
| `updateScalpBuilderCurveLatticeFromHandle` | 890 | TOP-LEVEL | CALL |
| `rebuildScalpBuilderIntersection` | 896 | TOP-LEVEL | CALL |
| `updateScalpBuilderPositionReadout` | 897 | TOP-LEVEL | CALL |
| `updateScalpLatticeFromHandle` | 901 | TOP-LEVEL | CALL |
| `createAuthoredScalpGeometry` | 1467 | TOP-LEVEL | CALL |
| `buildDefaultScalpRegionAssignments` | 1504 | TOP-LEVEL | CALL |
| `updateScalpRenderGeometry` | 1579 | TOP-LEVEL | CALL |
| `createScalpSelectionOutline` | 1642 | TOP-LEVEL | CALL |
| `updateScalpQuadWire` | 1831 | TOP-LEVEL | CALL |
| `resetScalpBuilder` | 2588 | TOP-LEVEL | REF |
| `createScalpLattice` | 3050 | TOP-LEVEL | CALL |
| `activeScalpSurfaceMesh` | 3226 | IN-FN | CALL |
| `ensureEditedScalpSurface` | 3297 | IN-FN | CALL |
| `fullBodyScalpFocusBounds` | 3539 | IN-FN | CALL |
| `applyLockRootScalpOffset` | 3671 | IN-FN | CALL |
| `applyLockRootScalpOffset` | 3685 | IN-FN | CALL |
| `scalpBuilderHeadMeshes` | 4119 | IN-FN | CALL |
| `setScalpSetupMenuOpen` | 6062 | IN-FN | CALL |
| `setScalpBuilderEditing` | 6063 | IN-FN | CALL |
| `setScalpPaintEditing` | 6064 | IN-FN | CALL |
| `setScalpShapeEditing` | 6066 | IN-FN | CALL |
| `updateScalpEditingVisibility` | 6092 | IN-FN | CALL |
| `createScalpGuideOutlinerRow` | 6941 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 7263 | IN-FN | CALL |
| `setScalpBuilderEditing` | 7605 | IN-FN | CALL |
| `setScalpShapeEditing` | 7606 | IN-FN | CALL |
| `setScalpPaintEditing` | 7607 | IN-FN | CALL |
| `setScalpGuideVisibility` | 7611 | IN-FN | CALL |
| `createScalpBuilderCurveLattice` | 7612 | IN-FN | CALL |
| `disposeScalpBuilderVisuals` | 7614 | IN-FN | CALL |
| `updateScalpEditingVisibility` | 7615 | IN-FN | CALL |
| `setScalpGuideVisibility` | 7680 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 7961 | IN-FN | CALL |
| `curveLatticePointsForScalpRegion` | 8068 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 8346 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 8349 | IN-FN | CALL |
| `mirroredScalpRegion` | 8385 | IN-FN | CALL |
| `mirroredScalpRegion` | 8705 | IN-FN | CALL |
| `scalpRegionNearestWorldPoint` | 9118 | IN-FN | CALL |
| `scalpBuilderProportionalWeight` | 9769 | IN-FN | CALL |
| `scalpBuilderProportionalWeight` | 9796 | IN-FN | CALL |
| `scalpBuilderProportionalWeight` | 9925 | IN-FN | CALL |
| `scalpBuilderProportionalWeight` | 9982 | IN-FN | CALL |
| `scalpBuilderProportionalWeight` | 9997 | IN-FN | CALL |
| `scalpBuilderProportionalWeight` | 10062 | IN-FN | CALL |
| `subdivideScalpBuilderCage` | 10108 | IN-FN | CALL |
| `fullBodyScalpFocusBounds` | 10673 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 10677 | IN-FN | CALL |
| `fullBodyScalpFocusBounds` | 10700 | IN-FN | CALL |
| `setScalpShapeEditing` | 10892 | IN-FN | CALL |
| `autoShowScalpGuideForActiveTool` | 10913 | IN-FN | CALL |
| `updateScalpEditingVisibility` | 10916 | IN-FN | CALL |
| `updateScalpBuilderHandleColors` | 11017 | IN-FN | CALL |
| `updateScalpBuilderHandleColors` | 11069 | IN-FN | CALL |
| `updateScalpBrushCursor` | 11086 | IN-FN | CALL |
| `scalpHitFromEvent` | 11086 | IN-FN | CALL |
| `scalpBuilderHeadMeshes` | 12077 | IN-FN | CALL |
| `applyLockRootScalpOffset` | 15965 | IN-FN | CALL |
| `mirroredScalpRegion` | 17260 | IN-FN | CALL |
| `mirroredScalpRegion` | 17438 | IN-FN | CALL |
| `updateScalpBuilderHandleColors` | 17595 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 17963 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 17981 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 18062 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 18102 | IN-FN | CALL |
| `installCustomScalpGuide` | 18521 | IN-FN | CALL |
| `setScalpGuideSource` | 18529 | IN-FN | CALL |
| `realignFullBodyGuideToScalpTop` | 18532 | IN-FN | CALL |
| `fullBodyScalpFocusBounds` | 18534 | IN-FN | CALL |
| `restoreAuthoredScalpForStateRestore` | 18954 | IN-FN | CALL |
| `remapLegacyPresetToActiveScalp` | 19327 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 19762 | IN-FN | CALL |
| `sampleScalpQuad` | 19954 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 20025 | IN-FN | CALL |
| `sampleScalpQuad` | 20129 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 20323 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 20324 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 20326 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 20519 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 20520 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 20522 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 20589 | IN-FN | CALL |
| `sampleScalpQuad` | 20641 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 20880 | IN-FN | CALL |
| `activeStrokeScalpOffset` | 21487 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 21491 | IN-FN | CALL |
| `activeStrokeScalpOffset` | 21532 | IN-FN | CALL |
| `drawScalpRegionAtEvent` | 22648 | IN-FN | CALL |
| `activeStrokeScalpOffset` | 22652 | IN-FN | CALL |
| `scalpRegionNearestWorldPoint` | 23921 | IN-FN | CALL |
| `scalpRegionNearestWorldPoint` | 24076 | IN-FN | CALL |
| `scalpRegionAtHit` | 24163 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 24169 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 24252 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 24257 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 26438 | IN-FN | CALL |
| `curveLatticePointsForScalpRegion` | 27600 | IN-FN | CALL |
| `applyLockRootScalpOffset` | 27947 | IN-FN | CALL |
| `activeScalpSurfaceMesh` | 29729 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 29735 | IN-FN | CALL |
| `scalpTriangleRegion` | 29740 | IN-FN | CALL |
| `scalpBuilderHeadMeshes` | 29843 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 29960 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 29964 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 30113 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 30119 | IN-FN | CALL |
| `closestPointOnActiveScalp` | 30247 | IN-FN | CALL |
| `rootScalpOffsetDistance` | 30258 | IN-FN | CALL |
| `setScalpBuilderEditing` | 31203 | TOP-LEVEL | CALL |
| `setScalpSetupMenuOpen` | 31204 | TOP-LEVEL | CALL |
| `setScalpGuideSource` | 32233 | TOP-LEVEL | CALL |
| `setScalpGuideSource` | 32237 | TOP-LEVEL | CALL |
| `importScalpGuideMeshFile` | 32245 | TOP-LEVEL | CALL |
| `curveLatticePointsForScalpRegion` | 32269 | TOP-LEVEL | CALL |
| `createScalpFittedCapsuleGuide` | 32436 | TOP-LEVEL | CALL |
| `updateScalpSurface` | 32444 | TOP-LEVEL | CALL |
| `applyScalpLatticeDeformation` | 32453 | TOP-LEVEL | CALL |
| `updateScalpLatticeObjects` | 32454 | TOP-LEVEL | CALL |
| `updateScalpTopology` | 32461 | TOP-LEVEL | CALL |
| `applyDefaultScalpRegionAssignments` | 32467 | TOP-LEVEL | CALL |
| `autoShowScalpGuideForActiveTool` | 32736 | IN-FN | CALL |
| `updateScalpEditingVisibility` | 32737 | IN-FN | CALL |
| `setScalpPaintEditing` | 34073 | TOP-LEVEL | CALL |
| `setScalpSetupMenuOpen` | 34074 | TOP-LEVEL | CALL |
| `setScalpBuilderEditing` | 34077 | TOP-LEVEL | CALL |
| `setScalpSetupMenuOpen` | 34078 | TOP-LEVEL | CALL |
| `setScalpSetupMenuOpen` | 34082 | TOP-LEVEL | CALL |
| `setScalpSetupMenuOpen` | 34087 | IN-FN | CALL |
| `setScalpSetupMenuOpen` | 34094 | IN-FN | CALL |
| `setScalpSetupMenuOpen` | 34102 | IN-FN | CALL |
| `setScalpBuilderEditing` | 34113 | TOP-LEVEL | CALL |
| `resetScalpBuilder` | 34115 | TOP-LEVEL | REF |
| `confirmScalpBuilderPlane` | 34116 | TOP-LEVEL | REF |
| `displayScalpBuilderConstructionCurves` | 34117 | TOP-LEVEL | REF |
| `rebuildScalpBuilderTemplateOverlay` | 34118 | TOP-LEVEL | REF |
| `setScalpGuideVisibility` | 34175 | TOP-LEVEL | CALL |
| `setScalpGuideVisibility` | 34181 | TOP-LEVEL | CALL |
| `autoShowScalpGuideForActiveTool` | 34205 | TOP-LEVEL | CALL |
| `syncScalpRoughScaleInputs` | 34268 | TOP-LEVEL | CALL |
| `applyScalpRoughScale` | 34269 | TOP-LEVEL | CALL |
| `syncScalpRoughScaleInputs` | 34280 | TOP-LEVEL | CALL |
| `applyScalpRoughScale` | 34281 | TOP-LEVEL | CALL |
| `setScalpLatticeEditing` | 34284 | TOP-LEVEL | CALL |
| `setActiveScalpRegion` | 34289 | TOP-LEVEL | CALL |
| `clearScalpRegions` | 34291 | TOP-LEVEL | REF |
| `clearScalpRegions` | 34291 | TOP-LEVEL | CALL |
| `setScalpShapeEditing` | 37166 | TOP-LEVEL | CALL |
| `setScalpPaintEditing` | 37167 | TOP-LEVEL | CALL |
| `setScalpBuilderEditing` | 37168 | TOP-LEVEL | CALL |
| `updateScalpLatticeDrag` | 37200 | TOP-LEVEL | REF |
| `updateScalpPaint` | 37201 | TOP-LEVEL | REF |
| `updateScalpBuilderStroke` | 37202 | TOP-LEVEL | REF |
| `endScalpLatticeDrag` | 37225 | TOP-LEVEL | REF |
| `endScalpPaint` | 37226 | TOP-LEVEL | REF |
| `finishScalpBuilderStroke` | 37227 | TOP-LEVEL | REF |
| `endScalpLatticeDrag` | 37259 | TOP-LEVEL | REF |
| `endScalpPaint` | 37260 | TOP-LEVEL | REF |
| `finishScalpBuilderStroke` | 37261 | TOP-LEVEL | CALL |
| `prioritizeScalpBuilderPointSelection` | 37303 | TOP-LEVEL | REF |
| `beginScalpBuilderInput` | 37381 | TOP-LEVEL | CALL |
| `activeScalpSurfaceMesh` | 37386 | TOP-LEVEL | CALL |
| `beginScalpPaint` | 37388 | TOP-LEVEL | CALL |
| `selectScalpLatticePoint` | 37397 | TOP-LEVEL | CALL |
| `beginScalpLatticeDrag` | 37398 | TOP-LEVEL | CALL |
| `activeScalpSurfaceMesh` | 37547 | TOP-LEVEL | CALL |

## 3. deps 注入清单（144 项，以模块实际 deps.X 引用为准）

- **store state 代理（4）**：`scalpState`/`sculptState`/`sel`/`guideState`（均传 `.state`，模块内 `STORE.state.X`→`deps.STORE.X`）
- **模块级 import（不注入，7）**：`THREE`、`OBJLoader`、`mergeGeometries`、`normalizeTaperCurve`（curve-math）、`DEFAULT_SWEEP_PROFILE`/`ROOT_SCALP_OFFSET_DISTANCE`/`SCALP_REGIONS`（app-config）
- **app.js 顶层标识符注入（141）**：
  - `CONTROL_POINT_SELECTED_COLOR`
  - `FULL_BODY_FRAME_BOTTOM_MARGIN`
  - `GUIDE_BOUNDS_EXCLUDED_GROUPS`
  - `SCALP_BUILDER_STEPS`
  - `SCALP_REGION_CURVE_VISUALIZATION_ENABLED`
  - `SCALP_SEGMENTS`
  - `SCALP_TEMPLATE_MATERIAL_REGIONS`
  - `activeStrokeSurfaceValue`
  - `addCapsuleGuide`
  - `advancedLatticeButton`
  - `applyHeadTransform`
  - `braidAutoShowScalpInput`
  - `braidScalpOffsetInput`
  - `braidStrokeActive`
  - `camera`
  - `capsuleGuideMode`
  - `configureTransformControls`
  - `confirmScalpBuilderButton`
  - `createOutlinerVisibilityToggle`
  - `createRootAttachment`
  - `curveGroup`
  - `curveNetworkSection`
  - `dataToVector`
  - `defaultCurveLatticePoints`
  - `deselectStrands`
  - `deselectStrandsForGuideEditor`
  - `drawAutoShowScalpInput`
  - `drawCapsuleGuideMode`
  - `drawStrandScalpOffsetInput`
  - `exitSetupEditor`
  - `exitSetupEditorLabel`
  - `generateScalpBuilderButton`
  - `guideHeadBounds`
  - `guideState`
  - `guideSurfaceGroup`
  - `hairGroup`
  - `head`
  - `headMeshes`
  - `headPanel`
  - `headPlaneIntersectionSegments`
  - `headSetupMode`
  - `headTransform`
  - `hierarchyToggle`
  - `layerOffsetForLock`
  - `layerRootOffsetFactor`
  - `liveSurfaceGuide`
  - `liveSurfaceStrand`
  - `locks`
  - `mirrorXToggle`
  - `modeToolButtons`
  - `panelAutoShowScalpInput`
  - `panelScalpOffsetInput`
  - `panelStrokeActive`
  - `pinActiveToolSettingsPanel`
  - `placeAutoShowScalpInput`
  - `pointAlongSection`
  - `pointer`
  - `proportionalFalloffInput`
  - `proportionalRadiusInput`
  - `proportionalToggle`
  - `pushUndoState`
  - `quadraticWeights`
  - `rayFromViewportEvent`
  - `raycaster`
  - `renderGuideOutliner`
  - `renderLockList`
  - `renderer`
  - `scalpArtistInputs`
  - `scalpArtistShape`
  - `scalpBasePositions`
  - `scalpBrushCursor`
  - `scalpBrushSizeInput`
  - `scalpBuilderAxisLabel`
  - `scalpBuilderContours`
  - `scalpBuilderGroup`
  - `scalpBuilderInstruction`
  - `scalpBuilderMode`
  - `scalpBuilderPanel`
  - `scalpBuilderPlanePositions`
  - `scalpBuilderPositionOutput`
  - `scalpBuilderShowTemplateInput`
  - `scalpBuilderStepLabel`
  - `scalpBuilderStepName`
  - `scalpBuilderTemplateOverlay`
  - `scalpBuilderTransparentHeadInput`
  - `scalpGuideMeshFileInput`
  - `scalpGuideSourceInput`
  - `scalpInputs`
  - `scalpLatticeConnections`
  - `scalpLatticeGroup`
  - `scalpLatticeHandles`
  - `scalpLatticeLine`
  - `scalpLatticePoints`
  - `scalpPaintPanel`
  - `scalpPaintToggle`
  - `scalpPanel`
  - `scalpQuads`
  - `scalpRegionButtons`
  - `scalpRenderGeometry`
  - `scalpRoughScale`
  - `scalpRoughScaleInputs`
  - `scalpRoughScalePivot`
  - `scalpRoughScaleValues`
  - `scalpSelectionOutline`
  - `scalpSetupMenu`
  - `scalpSetupToggle`
  - `scalpState`
  - `scalpSurface`
  - `scalpSurfaceGeometry`
  - `scalpSurfaceGroup`
  - `scalpSurfaceMesh`
  - `scalpSurfaceWire`
  - `sculptState`
  - `sel`
  - `setActiveTool`
  - `setAppMenuOpen`
  - `setHeadReferenceTransparency`
  - `setMirrorXEditing`
  - `setViewportEditMode`
  - `showOutlinerContextMenu`
  - `spaceToggle`
  - `strandGroupDefaults`
  - `surfaceGuideDefaults`
  - `syncDisplayVisibilityInputs`
  - `syncGuideInputs`
  - `syncHeadTransformInputs`
  - `syncLockFromCurve`
  - `syncRootAttachmentMetadata`
  - `syncViewportDrawSettings`
  - `templatePlaneIntersectionSegments`
  - `transformControls`
  - `trianglePlaneIntersections`
  - `updateAttributeEditorMode`
  - `updateCount`
  - `updateCurveObjects`
  - `updateGuideViewToggle`
  - `updateInteractionLocks`
  - `updateLockGeometry`
  - `updatePlacementStatus`
  - `updateViewportToolVisibility`
  - `upperContourCurve`
- **保留的潜在 bug 裸引用（3，非 app.js 顶层，不注入，模块内为 `deps.X`=undefined）**：`editedScalpSurfaceMesh`、`editedScalpRegions`、`importedScalpGuideAsset`——原 app.js 中即无顶层声明（仅 `scalpState.state.*` 存取与一个 getter），对应分支原会 ReferenceError，现为 `deps.X`（undefined），仅影响潜在 bug 路径。

## 4. 修复记录（回归轮）

- **根因**：静态分析器 collectDeclared 的逗号处理把初始化表达式里逗号后的标识符误判为局部变量（如 `clamp(..., 0, SCALP_SEGMENTS)` 中的 `SCALP_SEGMENTS`），导致这些 app.js 顶层标识符漏改写为 `deps.X`。
- **已修**：重写声明收集（正确的声明符解析/解构/箭头与 function 参数；去掉过宽的「对象方法」启发式，避免把 `if (scalpState...)` 误当参数表）；模块重新从原始 app.js 生成；deps 注入清单从 136 修正为 141（新增 `curveNetworkSection`/`pointAlongSection`/`surfaceGuideDefaults`/`templatePlaneIntersectionSegments`/`upperContourCurve`）+ 3 潜在 bug 名（`deps.X`=undefined，不注入）。
- **自证**：完整静态扫描（模块内每个 app.js 顶层函数/const/let 名，排除模块自身函数/import/内建/THREE/字符串注释/已是 deps.X）→ **0 裸引用**；round-trip 反解 120/120 与原函数逐字节一致。
## 4. 边界存疑点

1. **`scalpSeed`**：FUNCTION_INDEX 因名称命中 scalp，实为 `addBraidedBobPresetV2`（braided bob 预设）内的嵌套 const，不迁移。
2. **保留的潜在 bug 裸引用**（原 app.js 就存在，逐字保留）：`paintScalpAt` 中 `editedScalpSurfaceMesh`/`editedScalpRegions`、`installCustomScalpGeometry` 中 `importedScalpGuideAsset`——这些裸引用在模块中同样会在对应分支执行时 ReferenceError，行为与原版一致。
3. **`createScalpGuideOutlinerRow` / `activeToolUsesScalpGuide` / `toolAutoShowsScalpGuide` / `autoShowScalpGuideForActiveTool` / `setScalpGuideVisibility` / `createScalpFittedCapsuleGuide`**：与 guide/capsule 子系统交错（引用 `guideState`、`capsuleGuideMode`、`renderGuideOutliner`、`createOutlinerVisibilityToggle` 等），判定属 scalp 系统，迁出并注入这些跨子系统引用。
4. **`importScalpGuideMeshFile`**：涉及文件 IO（OBJLoader 读文件），判定属 scalp 导入路径，迁出；`OBJLoader` 模块级 import。
5. **api 创建点**：因模块级调用早于 deps 定义，`scalpBuilderDeps` 为可变对象渐进填充（见第 0 节），这是对 branch-sweep 一次性字面量 deps 的**必要偏差**，已在 app.js 注释说明。