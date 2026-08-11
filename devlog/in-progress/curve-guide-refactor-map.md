# curve/guide 系统迁出分析（阶段 3d 批次 5）— 函数引用图 / Refactor Map

> 生成：2026-08-11 · 分支 `0.2.59-refactor` · 仓库 `D:\\code\\dev\\web\\Animehairstudio`
> 约束：仅分析 `app.js` + `modules/*.js`，未做任何修改；唯一产出本文档。
> 行号口径：`devlog/FUNCTION_INDEX.json` 为 2026-08-09 快照（app.js 36,064 行），当前 app.js 为 **37,914 行**，索引行号整体漂移（L8000 附近约 +21，文件尾约 +1,850）。本文档所有行号均按当前 app.js 用 Select-String + 花括号配对扫描复核；`calls` 列用 `gen-function-index.js` 同款正则对当前文件重算。

## 1. 结论速览（TL;DR）

- **候选函数：151 个**，合计约 **2,950 行**（占 app.js 37,914 行的 ~7.8%），全部可迁入一个模块 `modules/geometry/guide-system.js`。
- 候选按职责分 5 组：
  - **curve-lattice core（61 个 / 1,107 行）**：曲线晶格 guide 的几何/交互/选择/镜像/多选编辑，模块内高度自洽；
  - **capsule-guide（61 个 / 1,224 行）**：胶囊 guide 的绘制/几何/手柄/loop 编辑/材质，模块内自洽；
  - **guide-general（8 个 / 300 行）**：addGuide/addCapsuleGuide/selectGuide/getSelectedGuide/updateGuideGeometry 等通用入口（`selectGuide`/`getSelectedGuide` 为跨子系统 hub，见 §6.3）；
  - **guide-vis / outliner / UI（18 个 / 248 行）**：scalp guide 显隐、guide 视图模式、guide outliner 行、capsule guide 编辑态开关；
  - **strand-bridge（3 个 / 71 行）**：curve-lattice ↔ strand(locks) 桥接（`createStrandsFromCurveLattice`/`updateGroupCurveLatticeStrands`/`updateBoundCurveLatticeStrands`）——**边界存疑，建议单列一批或留 app.js**（见 §6.1）。
- **外部调用点：176 处**（迁出后需改为 `api.xxx(...)`），其中：
  - 顶层事件绑定 86 处（TransformControls 分派 L814-914、guide UI 控件绑定 L31338-37743 等）；
  - 其它子系统函数内 90 处（scalp/strand/selection/tools/marquee/taper 等，见 §4）。
- **模块内调用边：269 处**（候选函数互相调用，迁出后为模块内直接调用，无需改）。
- **deps 注入清单**：5 个 store（`guideState`/`sel`/`sculptState`/`scalpState`/`draw`）+ 5 个共享对象/数组（`guides`/`locks`/`guideSurfaceGroup`/`scalpSurfaceGroup`/`scalpSurfaceGeometry`）+ 约 40 个 helper 函数 + 约 40 个 DOM/常量（详见 §5）。`THREE`、feature flags（`CURVE_LATTICE_FEATURE_ENABLED` 等）、曲线数学模块（`curve-lattice.js`/`capsule-curve.js`/`curve-math.js`）可直接 import，**无需注入**。
- **边界存疑 6 组**：见 §6。

## 2. 区间完整枚举（当前 app.js L5900-12614，364 个函数）

> 该区间横跨 scalp 建立、reference、outliner、显隐过滤器、curve/guide、sculpt brush、工具/编辑模式、变换/视平面等子系统。`候选` = 属于 curve/guide 系统可整体迁出（`★` 为边界存疑，建议单独评估）。`bucket` 为按行号区间的初判归属。

| # | 函数 | 行号 | 类型 | calls | bucket | 候选 |
|---|---|---|---|---|---|---|
| 1 | `resetScalpBuilder` | 5900 | function | 1 | scalp 建立 |  |
| 2 | `confirmScalpBuilderPlane` | 5915 | function | 1 | scalp 建立 |  |
| 3 | `beginScalpBuilderInput` | 5929 | function | 2 | scalp 建立 |  |
| 4 | `updateScalpBuilderStroke` | 5930 | function | 1 | scalp 建立 |  |
| 5 | `finishScalpBuilderStroke` | 5931 | function | 2 | scalp 建立 |  |
| 6 | `setScalpBuilderEditing` | 5933 | function | 10 | scalp 建立 |  |
| 7 | `updateScalpEditingVisibility` | 5967 | function | 12 | scalp 建立 |  |
| 8 | `exitSetupEditors` | 6061 | function | 7 | scalp 建立 |  |
| 9 | `setCapsuleGuideEditing` | 6070 | function | 5 | guide UI(候选) | ★ |
| 10 | `syncAppMenuVisibility` | 6098 | function | 3 | 应用菜单/turntable |  |
| 11 | `closeAppMenus` | 6104 | function | 6 | 应用菜单/turntable |  |
| 12 | `setAppMenuOpen` | 6115 | function | 3 | 应用菜单/turntable |  |
| 13 | `setTurntableActive` | 6122 | function | 3 | 应用菜单/turntable |  |
| 14 | `setScalpSetupMenuOpen` | 6131 | function | 9 | 应用菜单/turntable |  |
| 15 | `selectedReferenceImage` | 6135 | function | 20 | reference 子系统 |  |
| 16 | `normalizeReferenceCrop` | 6141 | function | 8 | reference 子系统 |  |
| 17 | `referenceCropIsFull` | 6149 | function | 3 | reference 子系统 |  |
| 18 | `referencePlaneFrontAxis` | 6154 | function | 4 | reference 子系统 |  |
| 19 | `referencePlanePlacement` | 6163 | function | 4 | reference 子系统 |  |
| 20 | `migratedReferencePlanePosition` | 6178 | function | 2 | reference 子系统 |  |
| 21 | `isUntouchedLegacySideReferencePlacement` | 6198 | function | 3 | reference 子系统 |  |
| 22 | `migratedReferencePlaneRotation` | 6215 | function | 2 | reference 子系统 |  |
| 23 | `isInwardFacingSideReferencePlacement` | 6231 | function | 2 | reference 子系统 |  |
| 24 | `snappedReferenceImageView` | 6254 | function | 2 | reference 子系统 |  |
| 25 | `updateReferencePlaneVisibility` | 6260 | function | 5 | reference 子系统 |  |
| 26 | `applyReferenceImageRuntime` | 6276 | function | 15 | reference 子系统 |  |
| 27 | `updateReferenceSelectionVisuals` | 6319 | function | 6 | reference 子系统 |  |
| 28 | `createReferenceImageRuntime` | 6327 | function | 3 | reference 子系统 |  |
| 29 | `addReferenceImage` | 6396 | function | 3 | reference 子系统 |  |
| 30 | `disposeReferenceImageRuntime` | 6448 | function | 3 | reference 子系统 |  |
| 31 | `disposeReferenceImage` | 6467 | function | 2 | reference 子系统 |  |
| 32 | `clearReferenceImages` | 6471 | function | 2 | reference 子系统 |  |
| 33 | `serializeReferenceImage` | 6478 | function | 1 | reference 子系统 |  |
| 34 | `setReferenceImageType` | 6506 | function | 2 | reference 子系统 |  |
| 35 | `attachReferenceImageTransform` | 6550 | function | 6 | reference 子系统 |  |
| 36 | `selectReferenceImage` | 6564 | function | 12 | reference 子系统 |  |
| 37 | `placeReferencePlane` | 6587 | function | 2 | reference 子系统 |  |
| 38 | `setReferencePlaneInFront` | 6598 | function | 2 | reference 子系统 |  |
| 39 | `syncReferenceImageFromMesh` | 6608 | function | 4 | reference 子系统 |  |
| 40 | `renderReferenceImagePanel` | 6627 | function | 20 | reference 子系统 |  |
| 41 | `setOutlinerTab` | 6674 | function | 9 | outliner 共享 |  |
| 42 | `effectiveViewportSelectionMode` | 6692 | function | 4 | outliner 共享 |  |
| 43 | `componentEditModeActive` | 6696 | function | 37 | outliner 共享 |  |
| 44 | `selectionToolSupportsPicking` | 6700 | function | 3 | outliner 共享 |  |
| 45 | `syncViewportSelectionModeControl` | 6705 | function | 4 | outliner 共享 |  |
| 46 | `refreshSelectionModeVisuals` | 6721 | function | 2 | outliner 共享 |  |
| 47 | `setViewportSelectionMode` | 6751 | function | 4 | outliner 共享 |  |
| 48 | `setViewportEditMode` | 6763 | function | 18 | outliner 共享 |  |
| 49 | `createOutlinerVisibilityToggle` | 6805 | function | 10 | outliner 共享 |  |
| 50 | `setLocksOutlinerVisibility` | 6819 | function | 8 | outliner 共享 |  |
| 51 | `outlinerGuides` | 6831 | function | 3 | outliner 共享 | ★ |
| 52 | `guideOutlinerLabel` | 6838 | function | 2 | outliner 共享 | ★ |
| 53 | `normalizeOutlinerName` | 6848 | function | 4 | outliner 共享 |  |
| 54 | `beginOutlinerRename` | 6853 | function | 2 | outliner 共享 |  |
| 55 | `finish` | 6864 | arrow | 3 | outliner 共享 |  |
| 56 | `handleOutlinerRenameClick` | 6894 | function | 7 | outliner 共享 |  |
| 57 | `createScalpGuideOutlinerRow` | 6904 | function | 2 | guide outliner(候选) | ★ |
| 58 | `renderGuideOutliner` | 6939 | function | 10 | guide outliner(候选) | ★ |
| 59 | `referenceOutlinerGroup` | 6997 | function | 2 | reference 覆盖层 |  |
| 60 | `renderReferenceOutliner` | 7001 | function | 4 | reference 覆盖层 |  |
| 61 | `setReferenceImagePanelOpen` | 7118 | function | 5 | reference 覆盖层 |  |
| 62 | `readReferenceImageFile` | 7123 | function | 2 | reference 覆盖层 |  |
| 63 | `isSupportedReferenceImageFile` | 7147 | function | 2 | reference 覆盖层 |  |
| 64 | `addReferenceImagesFromFiles` | 7154 | function | 3 | reference 覆盖层 |  |
| 65 | `dragContainsReferenceImage` | 7199 | function | 3 | reference 覆盖层 |  |
| 66 | `setReferenceImageDragActive` | 7210 | function | 9 | reference 覆盖层 |  |
| 67 | `referenceDropDestination` | 7218 | function | 2 | reference 覆盖层 |  |
| 68 | `viewportOverlayDropPosition` | 7224 | function | 2 | reference 覆盖层 |  |
| 69 | `setReferenceDropHover` | 7233 | function | 4 | reference 覆盖层 |  |
| 70 | `referencePlaneHitFromPointer` | 7251 | function | 2 | reference 覆盖层 |  |
| 71 | `referenceOverlayAtPointer` | 7271 | function | 2 | reference 覆盖层 |  |
| 72 | `referenceOverlayCornerAtPointer` | 7289 | function | 4 | reference 覆盖层 |  |
| 73 | `beginReferenceOverlayDrag` | 7302 | function | 2 | reference 覆盖层 |  |
| 74 | `updateReferenceOverlayDrag` | 7348 | function | 1 | reference 覆盖层 |  |
| 75 | `finishReferenceOverlayDrag` | 7398 | function | 5 | reference 覆盖层 |  |
| 76 | `setReferenceOverlayScaleHandleHover` | 7420 | function | 6 | reference 覆盖层 |  |
| 77 | `updateReferenceOverlayCursor` | 7431 | function | 1 | reference 覆盖层 |  |
| 78 | `referenceCropAnchorCoordinates` | 7457 | function | 2 | reference 覆盖层 |  |
| 79 | `referenceCropAnchorScreenPositions` | 7466 | function | 2 | reference 覆盖层 |  |
| 80 | `referenceCropCursor` | 7481 | function | 3 | reference 覆盖层 |  |
| 81 | `updateReferenceCropHandles` | 7487 | function | 5 | reference 覆盖层 |  |
| 82 | `referenceCropSourcePoint` | 7508 | function | 2 | reference 覆盖层 |  |
| 83 | `beginReferenceCrop` | 7515 | function | 1 | reference 覆盖层 |  |
| 84 | `updateReferenceCrop` | 7553 | function | 1 | reference 覆盖层 |  |
| 85 | `finishReferenceCrop` | 7585 | function | 4 | reference 覆盖层 |  |
| 86 | `setHeadSetupEditing` | 7603 | function | 6 | guide 显隐(候选) |  |
| 87 | `activeToolUsesScalpGuide` | 7619 | function | 2 | guide 显隐(候选) | ★ |
| 88 | `toolAutoShowsScalpGuide` | 7628 | function | 2 | guide 显隐(候选) | ★ |
| 89 | `autoShowScalpGuideForActiveTool` | 7638 | function | 4 | guide 显隐(候选) | ★ |
| 90 | `setScalpGuideVisibility` | 7644 | function | 12 | guide 显隐(候选) | ★ |
| 91 | `currentGuideViewMode` | 7652 | function | 3 | guide 显隐(候选) | ★ |
| 92 | `updateGuideViewToggle` | 7660 | function | 5 | guide 显隐(候选) | ★ |
| 93 | `setGuideViewMode` | 7676 | function | 3 | guide 显隐(候选) | ★ |
| 94 | `cycleGuideViewMode` | 7687 | function | 1 | guide 显隐(候选) | ★ |
| 95 | `hideGuideViewContextMenu` | 7692 | function | 6 | guide 显隐(候选) | ★ |
| 96 | `showGuideViewContextMenu` | 7696 | function | 1 | guide 显隐(候选) | ★ |
| 97 | `strandPassesDisplayFilters` | 7709 | function | 4 | 显示过滤器(混合) |  |
| 98 | `strandVisibleForDisplay` | 7718 | function | 14 | 显示过滤器(混合) |  |
| 99 | `strandAvailableForViewportInteraction` | 7723 | function | 3 | 显示过滤器(混合) |  |
| 100 | `lockedStrandsExist` | 7727 | function | 3 | 显示过滤器(混合) |  |
| 101 | `hiddenStrandsExist` | 7731 | function | 2 | 显示过滤器(混合) |  |
| 102 | `hideSelectedStrands` | 7735 | function | 2 | 显示过滤器(混合) |  |
| 103 | `unhideHiddenStrands` | 7745 | function | 2 | 显示过滤器(混合) |  |
| 104 | `strandIsolationActive` | 7754 | function | 7 | 显示过滤器(混合) |  |
| 105 | `setStrandIsolation` | 7758 | function | 3 | 显示过滤器(混合) |  |
| 106 | `toggleSelectedStrandIsolation` | 7770 | function | 3 | 显示过滤器(混合) |  |
| 107 | `syncVisibilityParent` | 7781 | function | 4 | 显示过滤器(混合) |  |
| 108 | `syncDisplayVisibilityInputs` | 7788 | function | 10 | 显示过滤器(混合) |  |
| 109 | `applyCharacterMeshDisplayVisibility` | 7817 | function | 5 | 显示过滤器(混合) |  |
| 110 | `applyStrandDisplayVisibility` | 7824 | function | 4 | 显示过滤器(混合) |  |
| 111 | `applyCapsuleGuideDisplayVisibility` | 7844 | function | 8 | 显示过滤器(混合) | ★ |
| 112 | `applyOtherGuideDisplayVisibility` | 7867 | function | 2 | 显示过滤器(混合) | ★ |
| 113 | `applyCurveLatticeGuideDisplayVisibility` | 7875 | function | 5 | 显示过滤器(混合) | ★ |
| 114 | `applyDisplayVisibilityFilters` | 7882 | function | 9 | 显示过滤器(混合) |  |
| 115 | `setScalpLatticeEditing` | 7893 | function | 4 | scalp 编辑态 |  |
| 116 | `setScalpShapeEditing` | 7908 | function | 9 | scalp 编辑态 |  |
| 117 | `setScalpPaintEditing` | 7926 | function | 7 | scalp 编辑态 |  |
| 118 | `defaultCurveLatticePoints` | 7950 | function | 3 | curve-lattice(候选) | ★ |
| 119 | `flatCurveLatticePoints` | 7976 | function | 4 | curve-lattice(候选) | ★ |
| 120 | `scalpRegionSurfaceSamples` | 7985 | function | 2 | curve-lattice(候选) | ★ |
| 121 | `curveLatticePointsForScalpRegion` | 8009 | function | 4 | curve-lattice(候选) | ★ |
| 122 | `horizontalValue` | 8014 | arrow | 1 | curve-lattice(候选) | ★ |
| 123 | `blendedSample` | 8025 | arrow | 1 | curve-lattice(候选) | ★ |
| 124 | `createCurveLatticeGuideSet` | 8058 | function | 2 | curve-lattice(候选) | ★ |
| 125 | `curveLatticeControlPoint` | 8073 | function | 9 | curve-lattice(候选) | ★ |
| 126 | `circularArcTangent` | 8077 | function | 4 | curve-lattice(候选) | ★ |
| 127 | `arcLengthTo` | 8108 | arrow | 2 | curve-lattice(候选) | ★ |
| 128 | `defaultCurveLatticeFrames` | 8120 | function | 3 | curve-lattice(候选) | ★ |
| 129 | `sampleHermiteCurve` | 8159 | function | 10 | curve-lattice(候选) | ★ |
| 130 | `sampleCurveLattice` | 8176 | function | 6 | curve-lattice(候选) | ★ |
| 131 | `curveLatticeNormal` | 8195 | function | 1 | curve-lattice(候选) | ★ |
| 132 | `createCurveLatticeGeometry` | 8206 | function | 3 | curve-lattice(候选) | ★ |
| 133 | `createCurveLatticeLineGeometry` | 8235 | function | 3 | curve-lattice(候选) | ★ |
| 134 | `appendCurve` | 8237 | arrow | 4 | curve-lattice(候选) | ★ |
| 135 | `sample` | 8239 | arrow | 4 | curve-lattice(候选) | ★ |
| 136 | `curveLatticeLoopPickerGeometry` | 8266 | function | 2 | curve-lattice(候选) | ★ |
| 137 | `createCurveLatticeLoopPickers` | 8282 | function | 3 | curve-lattice(候选) | ★ |
| 138 | `addPicker` | 8284 | arrow | 2 | curve-lattice(候选) | ★ |
| 139 | `rebuildCurveLatticeLoopPickers` | 8323 | function | 2 | curve-lattice(候选) | ★ |
| 140 | `curveLatticeHasRootExtension` | 8336 | function | 4 | curve-lattice(候选) | ★ |
| 141 | `defaultCurveLatticeRootPoints` | 8340 | function | 3 | curve-lattice(候选) | ★ |
| 142 | `curveLatticeEditablePoint` | 8358 | function | 13 | curve-lattice(候选) | ★ |
| 143 | `curveLatticePointSection` | 8365 | function | 3 | curve-lattice(候选) | ★ |
| 144 | `curveLatticeRestPoint` | 8376 | function | 7 | curve-lattice(候选) | ★ |
| 145 | `editingCurveLatticeDeformation` | 8382 | function | 7 | curve-lattice(候选) | ★ |
| 146 | `curveLatticeRootColumns` | 8388 | function | 3 | curve-lattice(候选) | ★ |
| 147 | `curveTangentsForPoints` | 8395 | function | 6 | curve-lattice(候选) | ★ |
| 148 | `createCurveLatticeRootGeometry` | 8407 | function | 3 | curve-lattice(候选) | ★ |
| 149 | `createCurveLatticeRootLineGeometry` | 8444 | function | 3 | curve-lattice(候选) | ★ |
| 150 | `rebuildCurveLatticeHandles` | 8470 | function | 2 | curve-lattice(候选) | ★ |
| 151 | `resampleCurveLatticeGuide` | 8487 | function | 3 | curve-lattice(候选) | ★ |
| 152 | `resampleGrid` | 8497 | arrow | 2 | curve-lattice(候选) | ★ |
| 153 | `controlPointIsSelected` | 8524 | function | 7 | curve-lattice(候选) | ★ |
| 154 | `clearMultiPointSelection` | 8532 | function | 9 | curve-lattice(候选) | ★ |
| 155 | `createCurveLatticeHandles` | 8536 | function | 4 | curve-lattice(候选) | ★ |
| 156 | `addCurveLattice` | 8558 | function | 6 | curve-lattice(候选) | ★ |
| 157 | `updateCurveLatticeGeometry` | 8667 | function | 9 | curve-lattice(候选) | ★ |
| 158 | `mirroredCurveLatticePointIndex` | 8698 | function | 2 | curve-lattice(候选) | ★ |
| 159 | `mirroredCurveLatticeTarget` | 8704 | function | 4 | curve-lattice(候选) | ★ |
| 160 | `updateCurveLatticeHandleColors` | 8743 | function | 1 | curve-lattice(候选) | ★ |
| 161 | `curveLatticeLoopHitFromEvent` | 8764 | function | 4 | curve-lattice(候选) | ★ |
| 162 | `refreshCurveLatticeLoopHover` | 8781 | function | 3 | curve-lattice(候选) | ★ |
| 163 | `setCurveLatticeLoopHover` | 8790 | function | 5 | curve-lattice(候选) | ★ |
| 164 | `updateCurveLatticeLoopHover` | 8797 | function | 1 | curve-lattice(候选) | ★ |
| 165 | `selectCurveLatticeLoop` | 8816 | function | 3 | curve-lattice(候选) | ★ |
| 166 | `selectCurveLatticePoint` | 8845 | function | 4 | curve-lattice(候选) | ★ |
| 167 | `updateCurveLatticeFromHandle` | 8860 | function | 3 | curve-lattice(候选) | ★ |
| 168 | `beginCurveLatticeMultiEdit` | 8902 | function | 3 | curve-lattice(候选) | ★ |
| 169 | `applyCurveLatticeMultiTransform` | 8923 | function | 3 | curve-lattice(候选) | ★ |
| 170 | `curveLatticeColumnPoints` | 8966 | function | 3 | curve-lattice(候选) | ★ |
| 171 | `groupCurveControlIndices` | 8975 | function | 4 | curve-lattice(候选) | ★ |
| 172 | `groupCurveControlPoints` | 8981 | function | 2 | curve-lattice(候选) | ★ |
| 173 | `updateGroupCurveDisplay` | 8987 | function | 3 | curve-lattice(候选) | ★ |
| 174 | `ensureGroupCurveDisplay` | 8997 | function | 2 | curve-lattice(候选) | ★ |
| 175 | `groupCurveDeformationPairs` | 9019 | function | 2 | curve-lattice(候选) | ★ |
| 176 | `curveLatticeDeformationPairs` | 9026 | function | 2 | curve-lattice(候选) | ★ |
| 177 | `appendPairs` | 9028 | arrow | 2 | curve-lattice(候选) | ★ |
| 178 | `groupLatticeOffsetAtPoint` | 9039 | function | 2 | curve-lattice(候选) | ★ |
| 179 | `updateGroupCurveLatticeStrands` | 9058 | function | 2 | curve-lattice(候选) | ★ |
| 180 | `updateBoundCurveLatticeStrands` | 9079 | function | 2 | curve-lattice(候选) | ★ |
| 181 | `createStrandsFromCurveLattice` | 9098 | function | 2 | curve-lattice(候选) | ★ |
| 182 | `capsuleGuideCapHeight` | 9132 | function | 3 | capsule-guide(候选) | ★ |
| 183 | `hideCapsuleGuideDrawPreview` | 9136 | function | 2 | capsule-guide(候选) | ★ |
| 184 | `currentCapsuleGuideDrawProfile` | 9141 | function | 3 | capsule-guide(候选) | ★ |
| 185 | `updateCapsuleGuideProfilePreview` | 9145 | function | 3 | capsule-guide(候选) | ★ |
| 186 | `capsuleGuideDrawPoints` | 9157 | function | 4 | capsule-guide(候选) | ★ |
| 187 | `updateCapsuleGuideDrawPreview` | 9173 | function | 3 | capsule-guide(候选) | ★ |
| 188 | `beginCapsuleGuideDrawStroke` | 9179 | function | 2 | capsule-guide(候选) | ★ |
| 189 | `updateCapsuleGuideDrawStroke` | 9205 | function | 2 | capsule-guide(候选) | ★ |
| 190 | `createCapsuleGuideAlongCurve` | 9235 | function | 2 | capsule-guide(候选) | ★ |
| 191 | `finishCapsuleGuideDrawStroke` | 9289 | function | 4 | capsule-guide(候选) | ★ |
| 192 | `createCapsuleGuideGeometry` | 9310 | function | 7 | capsule-guide(候选) | ★ |
| 193 | `vertex` | 9324 | function | 3 | capsule-guide(候选) | ★ |
| 194 | `addFace` | 9330 | function | 3 | capsule-guide(候选) | ★ |
| 195 | `addRing` | 9348 | function | 3 | capsule-guide(候选) | ★ |
| 196 | `capsuleGuideTopologyFeature` | 9403 | function | 3 | capsule-guide(候选) | ★ |
| 197 | `retopologizeCapsuleGuide` | 9413 | function | 2 | capsule-guide(候选) | ★ |
| 198 | `resizeCapsuleGuideCylinder` | 9478 | function | 2 | capsule-guide(候选) | ★ |
| 199 | `capsuleControlDataFromGeometry` | 9524 | function | 7 | capsule-guide(候选) | ★ |
| 200 | `capsuleControlGeometryFromData` | 9537 | function | 2 | capsule-guide(候选) | ★ |
| 201 | `capsuleGuidePointWorldPosition` | 9558 | function | 3 | capsule-guide(候选) | ★ |
| 202 | `capsuleGuidePointDistances` | 9563 | function | 3 | capsule-guide(候选) | ★ |
| 203 | `capsuleGuideHorizontalLoopsFromTopology` | 9584 | function | 4 | capsule-guide(候选) | ★ |
| 204 | `capsuleGuideLoopCenter` | 9604 | function | 4 | capsule-guide(候选) | ★ |
| 205 | `normalizeCapsuleGuideColor` | 9609 | function | 8 | capsule-guide(候选) | ★ |
| 206 | `normalizeCapsuleGuideName` | 9615 | function | 3 | capsule-guide(候选) | ★ |
| 207 | `capsuleGuideAccentColor` | 9620 | function | 8 | capsule-guide(候选) | ★ |
| 208 | `updateCapsuleGuideDisplayColor` | 9625 | function | 5 | capsule-guide(候选) | ★ |
| 209 | `updateCapsuleGuideLoopLines` | 9636 | function | 3 | capsule-guide(候选) | ★ |
| 210 | `rebuildCapsuleGuideLoopLines` | 9648 | function | 2 | capsule-guide(候选) | ★ |
| 211 | `createCapsuleGuideHandles` | 9680 | function | 2 | capsule-guide(候选) | ★ |
| 212 | `rebuildCapsuleGuideHandles` | 9703 | function | 2 | capsule-guide(候选) | ★ |
| 213 | `syncCapsuleGuideHandles` | 9722 | function | 4 | capsule-guide(候选) | ★ |
| 214 | `capsuleGuideMirrorMap` | 9729 | function | 4 | capsule-guide(候选) | ★ |
| 215 | `mirrorCapsuleGuidePointEdits` | 9745 | function | 3 | capsule-guide(候选) | ★ |
| 216 | `updateCapsuleGuideHandleColors` | 9762 | function | 9 | capsule-guide(候选) | ★ |
| 217 | `updateCapsuleGuideFromHandle` | 9777 | function | 2 | capsule-guide(候选) | ★ |
| 218 | `beginCapsuleGuideHandleEdit` | 9814 | function | 2 | capsule-guide(候选) | ★ |
| 219 | `selectCapsuleGuidePoint` | 9830 | function | 2 | capsule-guide(候选) | ★ |
| 220 | `capsuleGuideLoopTransformGuide` | 9847 | function | 3 | capsule-guide(候选) | ★ |
| 221 | `attachCapsuleGuideLoopTransform` | 9853 | function | 3 | capsule-guide(候选) | ★ |
| 222 | `selectCapsuleGuideLoop` | 9880 | function | 2 | capsule-guide(候选) | ★ |
| 223 | `beginCapsuleGuideLoopTransform` | 9892 | function | 2 | capsule-guide(候选) | ★ |
| 224 | `updateCapsuleGuideLoopTransform` | 9911 | function | 2 | capsule-guide(候选) | ★ |
| 225 | `refreshCapsuleGuideFillInfluence` | 9956 | function | 4 | capsule-guide(候选) | ★ |
| 226 | `refreshCapsuleGuideLoopInfluence` | 9991 | function | 7 | capsule-guide(候选) | ★ |
| 227 | `setCapsuleGuideLoopHover` | 10005 | function | 5 | capsule-guide(候选) | ★ |
| 228 | `capsuleGuideLoopHitFromEvent` | 10011 | function | 3 | capsule-guide(候选) | ★ |
| 229 | `updateCapsuleGuideLoopHover` | 10028 | function | 2 | capsule-guide(候选) | ★ |
| 230 | `beginCapsuleGuideLoopDrag` | 10039 | function | 2 | capsule-guide(候选) | ★ |
| 231 | `updateCapsuleGuideLoopDrag` | 10050 | function | 1 | capsule-guide(候选) | ★ |
| 232 | `endCapsuleGuideLoopDrag` | 10080 | function | 1 | capsule-guide(候选) | ★ |
| 233 | `createSubdividedQuadGeometry` | 10090 | function | 3 | capsule-guide(候选) | ★ |
| 234 | `createEmphasizedSubdivisionEdges` | 10131 | function | 3 | capsule-guide(候选) | ★ |
| 235 | `createQuadCageGeometry` | 10147 | function | 3 | capsule-guide(候选) | ★ |
| 236 | `scalpFittedCapsuleSpec` | 10171 | function | 2 | capsule-guide(候选) | ★ |
| 237 | `createScalpFittedCapsuleGuide` | 10191 | function | 2 | capsule-guide(候选) | ★ |
| 238 | `updateCapsuleGuideGeometry` | 10202 | function | 13 | capsule-guide(候选) | ★ |
| 239 | `createCapsuleGuideMaterial` | 10255 | function | 2 | capsule-guide(候选) | ★ |
| 240 | `updateCapsuleGuideWireOpacity` | 10293 | function | 6 | capsule-guide(候选) | ★ |
| 241 | `updateCapsuleGuideFresnelMaterial` | 10303 | function | 4 | capsule-guide(候选) | ★ |
| 242 | `addCapsuleGuide` | 10311 | function | 4 | capsule-guide(候选) | ★ |
| 243 | `addGuide` | 10380 | function | 1 | guide 通用(候选) | ★ |
| 244 | `createGuideGeometry` | 10441 | function | 4 | guide 通用(候选) | ★ |
| 245 | `selectGuide` | 10496 | function | 17 | guide 通用(候选) | ★ |
| 246 | `updateGuideControlsVisibility` | 10564 | function | 10 | guide 通用(候选) | ★ |
| 247 | `updateViewportToolVisibility` | 10581 | function | 7 | guide 通用(候选) | ★ |
| 248 | `getSelectedGuide` | 10620 | function | 34 | guide 通用(候选) | ★ |
| 249 | `selectedViewportFocusBounds` | 10624 | function | 2 | guide 通用(候选) |  |
| 250 | `frameViewportBounds` | 10638 | function | 6 | guide 通用(候选) |  |
| 251 | `centerViewportOnSelectedItem` | 10668 | function | 2 | guide 通用(候选) |  |
| 252 | `fullSceneFocusBounds` | 10672 | function | 2 | guide 通用(候选) |  |
| 253 | `currentViewportFrameSelectionKey` | 10687 | function | 3 | guide 通用(候选) |  |
| 254 | `cycleViewportFraming` | 10696 | function | 2 | guide 通用(候选) |  |
| 255 | `syncGuideInputs` | 10714 | function | 5 | guide 通用(候选) | ★ |
| 256 | `updateGuideGeometry` | 10757 | function | 3 | guide 通用(候选) | ★ |
| 257 | `sculptBrushToolActive` | 10778 | function | 29 | sculpt brush |  |
| 258 | `sculptBrushSelectionMaskActive` | 10782 | function | 3 | sculpt brush |  |
| 259 | `sculptBrushSelectionAllows` | 10786 | function | 3 | sculpt brush |  |
| 260 | `effectiveSculptBrushTool` | 10790 | function | 15 | sculpt brush |  |
| 261 | `updateSculptScaleModeRow` | 10796 | function | 4 | sculpt brush |  |
| 262 | `syncSculptBrushToolButtons` | 10801 | function | 3 | sculpt brush |  |
| 263 | `setSculptBrushShiftSmoothHeld` | 10823 | function | 5 | sculpt brush |  |
| 264 | `setActiveTool` | 10832 | function | 19 | 工具/编辑模式 |  |
| 265 | `setDrawStrandMode` | 10970 | function | 2 | 工具/编辑模式 |  |
| 266 | `setObjectSpaceEditing` | 10980 | function | 7 | 工具/编辑模式 |  |
| 267 | `setHierarchyEditing` | 10996 | function | 4 | 工具/编辑模式 |  |
| 268 | `setProportionalEditing` | 11008 | function | 5 | 工具/编辑模式 |  |
| 269 | `beginProportionalSizeEdit` | 11027 | function | 3 | 工具/编辑模式 |  |
| 270 | `updateProportionalSizeEdit` | 11039 | function | 2 | 工具/编辑模式 |  |
| 271 | `endProportionalSizeEdit` | 11050 | function | 5 | 工具/编辑模式 |  |
| 272 | `activateProportionalHotkeyHold` | 11057 | function | 2 | 工具/编辑模式 |  |
| 273 | `refreshProportionalPreview` | 11065 | function | 4 | 工具/编辑模式 |  |
| 274 | `activeBrushSizeInput` | 11075 | function | 2 | 工具/编辑模式 |  |
| 275 | `refreshActiveBrushSizeCursor` | 11084 | function | 3 | 工具/编辑模式 |  |
| 276 | `refreshActiveBrushSizeScale` | 11096 | function | 2 | 工具/编辑模式 |  |
| 277 | `beginBrushSizeDrag` | 11114 | function | 1 | 工具/编辑模式 |  |
| 278 | `updateBrushSizeDrag` | 11141 | function | 1 | 工具/编辑模式 |  |
| 279 | `finishBrushSizeDrag` | 11162 | function | 2 | 工具/编辑模式 |  |
| 280 | `updateInteractionLocks` | 11179 | function | 88 | 变换/交互 |  |
| 281 | `configureTransformControls` | 11190 | function | 17 | 变换/交互 |  |
| 282 | `pullMoveActive` | 11198 | function | 9 | 变换/交互 |  |
| 283 | `updatePullGuideVisual` | 11202 | function | 4 | 变换/交互 |  |
| 284 | `attachTransformForCurvePoint` | 11218 | function | 5 | 变换/交互 |  |
| 285 | `pointerHitsTransformGizmo` | 11242 | function | 7 | 变换/交互 |  |
| 286 | `strandObjectRootIndex` | 11258 | function | 3 | 变换/交互 |  |
| 287 | `strandObjectRoot` | 11267 | function | 4 | 变换/交互 |  |
| 288 | `strandObjectTransformQuaternion` | 11271 | function | 2 | 变换/交互 |  |
| 289 | `attachStrandObjectTransform` | 11276 | function | 6 | 变换/交互 |  |
| 290 | `guideObjectPivot` | 11299 | function | 3 | 变换/交互 |  |
| 291 | `guideObjectTransformQuaternion` | 11310 | function | 2 | 变换/交互 |  |
| 292 | `attachGuideObjectTransform` | 11315 | function | 6 | 变换/交互 |  |
| 293 | `guideObjectTransformSnapshot` | 11334 | function | 2 | 变换/交互 |  |
| 294 | `beginGuideObjectTransform` | 11362 | function | 2 | 变换/交互 |  |
| 295 | `updateLegacyGuideObjectTransform` | 11369 | function | 2 | 变换/交互 |  |
| 296 | `updateGuideObjectTransform` | 11391 | function | 2 | 变换/交互 |  |
| 297 | `finishGuideObjectTransform` | 11424 | function | 2 | 变换/交互 |  |
| 298 | `clonePlacementFrame` | 11433 | function | 2 | 变换/交互 |  |
| 299 | `cloneOptionalVectors` | 11445 | function | 10 | 变换/交互 |  |
| 300 | `strandObjectTransformSnapshot` | 11449 | function | 2 | 变换/交互 |  |
| 301 | `strandObjectPreviewMeshSnapshot` | 11466 | function | 2 | 变换/交互 |  |
| 302 | `restoreStrandObjectPreviewMeshes` | 11481 | function | 2 | 变换/交互 |  |
| 303 | `strandObjectTransformOperators` | 11497 | function | 4 | 变换/交互 |  |
| 304 | `transformPoint` | 11505 | arrow | 12 | 变换/交互 |  |
| 305 | `transformPointAroundFixedPivot` | 11512 | arrow | 0 | 变换/交互 |  |
| 306 | `transformNormal` | 11518 | arrow | 10 | 变换/交互 |  |
| 307 | `transformDirection` | 11528 | arrow | 7 | 变换/交互 |  |
| 308 | `worldMatrixForPivot` | 11540 | arrow | 2 | 变换/交互 |  |
| 309 | `worldMatrixForFixedPivot` | 11546 | arrow | 1 | 变换/交互 |  |
| 310 | `applyStrandObjectPreviewMatrix` | 11562 | function | 6 | 变换/交互 |  |
| 311 | `beginStrandObjectTransform` | 11588 | function | 2 | 变换/交互 |  |
| 312 | `updateStrandObjectTransform` | 11626 | function | 2 | 变换/交互 |  |
| 313 | `commitStrandObjectTransform` | 11684 | function | 2 | 变换/交互 |  |
| 314 | `mapPoints` | 11697 | arrow | 4 | 变换/交互 |  |
| 315 | `finishStrandObjectTransform` | 11731 | function | 2 | 变换/交互 |  |
| 316 | `surfaceObjectAnchorPose` | 11745 | function | 2 | 变换/交互 |  |
| 317 | `attachSurfaceObjectAnchorTransform` | 11768 | function | 5 | 变换/交互 |  |
| 318 | `selectSurfaceObjectAnchor` | 11781 | function | 3 | 变换/交互 |  |
| 319 | `beginSurfaceObjectTransform` | 11796 | function | 2 | 变换/交互 |  |
| 320 | `updateSurfaceObjectTransform` | 11822 | function | 2 | 变换/交互 |  |
| 321 | `finishSurfaceObjectTransform` | 11871 | function | 2 | 变换/交互 |  |
| 322 | `beginHandleEdit` | 11880 | function | 5 | handle 多编辑 |  |
| 323 | `updateGroupLatticeBaseFromHandleEdit` | 11933 | function | 3 | handle 多编辑 |  |
| 324 | `multiPointHandleEditActive` | 11944 | function | 7 | handle 多编辑 |  |
| 325 | `applyMultiMove` | 11948 | function | 5 | handle 多编辑 |  |
| 326 | `applyMultiRotate` | 11954 | function | 2 | handle 多编辑 |  |
| 327 | `applyMultiScale` | 11963 | function | 2 | handle 多编辑 |  |
| 328 | `applyHierarchicalMove` | 11972 | function | 3 | handle 多编辑 |  |
| 329 | `applySingleMove` | 11984 | function | 5 | handle 多编辑 |  |
| 330 | `applySurfaceLatticeMirror` | 11988 | function | 3 | handle 多编辑 |  |
| 331 | `curveSurfaceMirroredPointIndex` | 12005 | function | 2 | handle 多编辑 |  |
| 332 | `syncUnifiedCurveSurfaceMirror` | 12014 | function | 3 | handle 多编辑 |  |
| 333 | `changed` | 12024 | arrow | 1 | 视平面移动 |  |
| 334 | `applyPullMove` | 12066 | function | 3 | 视平面移动 |  |
| 335 | `pullHeadCollisionContext` | 12074 | function | 2 | 视平面移动 |  |
| 336 | `constrainPullPointsOutsideHead` | 12093 | function | 2 | 视平面移动 |  |
| 337 | `applyProportionalMove` | 12116 | function | 3 | 视平面移动 |  |
| 338 | `viewPlaneNormal` | 12127 | function | 20 | 视平面移动 |  |
| 339 | `isCameraInSnappedView` | 12131 | function | 3 | 视平面移动 |  |
| 340 | `viewPlaneMoveActiveForView` | 12139 | function | 10 | 视平面移动 |  |
| 341 | `updateViewPlaneGrid` | 12143 | function | 14 | 视平面移动 |  |
| 342 | `setViewPlaneMove` | 12200 | function | 4 | 视平面移动 |  |
| 343 | `setViewPlaneMoveSnappedOnly` | 12211 | function | 2 | 视平面移动 |  |
| 344 | `rayFromViewportEvent` | 12219 | function | 23 | 视平面移动 |  |
| 345 | `worldUnitsPerViewportPixel` | 12227 | function | 4 | 视平面移动 |  |
| 346 | `viewPlaneMovePointNormal` | 12237 | function | 2 | 视平面移动 |  |
| 347 | `updateViewPlaneNormalGuide` | 12248 | function | 5 | 视平面移动 |  |
| 348 | `rebaseViewPlaneMoveDrag` | 12261 | function | 3 | 视平面移动 |  |
| 349 | `setViewPlaneNormalMoveHeld` | 12280 | function | 4 | 视平面移动 |  |
| 350 | `beginViewPlaneMove` | 12287 | function | 3 | 视平面移动 |  |
| 351 | `updateViewPlaneMove` | 12351 | function | 1 | 视平面移动 |  |
| 352 | `endViewPlaneMove` | 12416 | function | 7 | 视平面移动 |  |
| 353 | `applyHierarchicalRotate` | 12435 | function | 2 | 视平面移动 |  |
| 354 | `rotateGuideNormal` | 12442 | arrow | 4 | 视平面移动 |  |
| 355 | `applySingleRotate` | 12480 | function | 2 | 视平面移动 |  |
| 356 | `applyProportionalRotate` | 12484 | function | 2 | 视平面移动 |  |
| 357 | `applyHierarchicalScale` | 12504 | function | 2 | 视平面移动 |  |
| 358 | `applySingleScale` | 12514 | function | 2 | 视平面移动 |  |
| 359 | `applyProportionalScale` | 12518 | function | 2 | 视平面移动 |  |
| 360 | `setPointScale` | 12534 | function | 8 | relax/比例编辑 |  |
| 361 | `proportionalWeight` | 12543 | function | 8 | relax/比例编辑 |  |
| 362 | `proportionalStrandVisualsActive` | 12555 | function | 5 | relax/比例编辑 |  |
| 363 | `strandInfluenceColor` | 12561 | function | 12 | relax/比例编辑 |  |
| 364 | `beginRelaxEdit` | 12586 | function | 3 | relax/比例编辑 |  |

> 区间内共 364 个函数；其中候选（curve/guide）151 个。

## 3. curve/guide 候选函数引用图（151 个）

> 列说明：`模块内调用` = 候选集合内的直接调用（迁出后模块内可直接引用，无需 deps）；`外部调用点` = app.js 其它子系统函数或顶层事件绑定里的调用（需改 `api.xxx`，行号为当前文件）；`关键 deps` = 用到的 store/全局对象/DOM/外部 helper（完整清单见 §5）。

### 3.1 curve-lattice core（61 个 / 1,107 行）

| 函数 | 行号 | 类型 | 模块内调用 | 外部调用点 | 关键 deps |
|---|---|---|---|---|---|
| `defaultCurveLatticePoints` | 7950 | function | — | — | scalpSurfaceGroup  activeScalpSurfaceMesh |
| `flatCurveLatticePoints` | 7976 | function | — | 2 处L27663(createStandaloneCurveLatticeGuide) L32268(顶层绑定) |    |
| `scalpRegionSurfaceSamples` | 7985 | function | — | — | scalpState scalpSurfaceGroup   |
| `curveLatticePointsForScalpRegion` | 8009 | function | `defaultCurveLatticePoints` `scalpRegionSurfaceSamples` | 2 处L27600(curveLatticeForGroup) L32269(顶层绑定) |    |
| `horizontalValue` | 8014 | arrow | — | — |    |
| `blendedSample` | 8025 | arrow | `horizontalValue` | — |    |
| `createCurveLatticeGuideSet` | 8058 | function | `curveLatticePointsForScalpRegion` `addCurveLattice` | 1 处L32312(顶层绑定) |    |
| `curveLatticeControlPoint` | 8073 | function | — | — |    |
| `circularArcTangent` | 8077 | function | — | — |    |
| `arcLengthTo` | 8108 | arrow | — | — |    |
| `defaultCurveLatticeFrames` | 8120 | function | `circularArcTangent` | — |    |
| `sampleHermiteCurve` | 8159 | function | — | — |    |
| `sampleCurveLattice` | 8176 | function | `curveLatticeControlPoint` `sampleHermiteCurve` | — |    |
| `curveLatticeNormal` | 8195 | function | `sampleCurveLattice` | — |    |
| `createCurveLatticeGeometry` | 8206 | function | `sampleCurveLattice` | — |    |
| `createCurveLatticeLineGeometry` | 8235 | function | — | — |    |
| `appendCurve` | 8237 | arrow | — | — |    |
| `sample` | 8239 | arrow | `curveLatticeControlPoint` `sampleHermiteCurve` `appendCurve` | — |    |
| `curveLatticeLoopPickerGeometry` | 8266 | function | `sampleHermiteCurve` `sample` | — |    |
| `createCurveLatticeLoopPickers` | 8282 | function | — | — |    |
| `addPicker` | 8284 | arrow | `curveLatticeControlPoint` `curveLatticeLoopPickerGeometry` | — |    |
| `rebuildCurveLatticeLoopPickers` | 8323 | function | `createCurveLatticeLoopPickers` `refreshCurveLatticeLoopHover` | — | guideSurfaceGroup   |
| `curveLatticeHasRootExtension` | 8336 | function | — | — |    |
| `defaultCurveLatticeRootPoints` | 8340 | function | `curveLatticeControlPoint` `curveLatticeHasRootExtension` | 1 处L32270(顶层绑定) |   activeScalpSurfaceMesh |
| `curveLatticeEditablePoint` | 8358 | function | — | 2 处L12152(updateViewPlaneGrid) L18925(reapplySelectionAfterStateRestore) |    |
| `curveLatticePointSection` | 8365 | function | — | — |    |
| `curveLatticeRestPoint` | 8376 | function | `curveLatticePointSection` | — |    |
| `editingCurveLatticeDeformation` | 8382 | function | — | — | sculptState sel  mirroredScalpRegion |
| `curveLatticeRootColumns` | 8388 | function | `curveLatticeControlPoint` | — |    |
| `curveTangentsForPoints` | 8395 | function | `circularArcTangent` | — |    |
| `createCurveLatticeRootGeometry` | 8407 | function | `sampleHermiteCurve` `curveLatticeRootColumns` `curveTangentsForPoints` | — |    |
| `createCurveLatticeRootLineGeometry` | 8444 | function | `sampleHermiteCurve` `appendCurve` `curveLatticeRootColumns` `curveTangentsForPoints` | — |    |
| `rebuildCurveLatticeHandles` | 8470 | function | `createCurveLatticeHandles` | — | guideSurfaceGroup sel transformControls  detach |
| `resampleCurveLatticeGuide` | 8487 | function | — | 2 处L32329(顶层绑定) L32336(顶层绑定) |    |
| `resampleGrid` | 8497 | arrow | `rebuildCurveLatticeHandles` `updateCurveLatticeGeometry` | — | locks   |
| `controlPointIsSelected` | 8524 | function | — | 5 处L21243(beginPolyBrushPointer) L25875(updateCurveObjects) L26401(handleColor) L35486(activateStrandControlPoint) L37646(顶层绑定) | sel   |
| `clearMultiPointSelection` | 8532 | function | — | 7 处L6571(selectReferenceImage) L6727(refreshSelectionModeVisuals) L11786(selectSurfaceObjectAnchor) L24594(deselectStrands) L27014(selectLock) … | sel   |
| `createCurveLatticeHandles` | 8536 | function | — | 1 处L32279(顶层绑定) |    |
| `addCurveLattice` | 8558 | function | `defaultCurveLatticePoints` `flatCurveLatticePoints` `defaultCurveLatticeFrames` `createCurveLatticeGeometry` `createCurveLatticeLineGeometry` `createCurveLatticeLoopPickers` `curveLatticeHasRootExtension` `defaultCurveLatticeRootPoints` `createCurveLatticeRootGeometry` `createCurveLatticeRootLineGeometry` `createCurveLatticeHandles` `selectGuide` | 4 处L19219(restoreGuide) L27595(curveLatticeForGroup) L27658(createStandaloneCurveLatticeGuide) L32309(顶层绑定) | REGION_CURVE_VISUALIZATION_ENABLED guideSurfaceGroup guides  normalizeOutlinerName dataToVector updateCount |
| `updateCurveLatticeGeometry` | 8667 | function | `defaultCurveLatticeFrames` `createCurveLatticeGeometry` `createCurveLatticeLineGeometry` `rebuildCurveLatticeLoopPickers` `curveLatticeEditablePoint` `createCurveLatticeRootGeometry` `createCurveLatticeRootLineGeometry` `updateGroupCurveDisplay` `updateBoundCurveLatticeStrands` | 2 处L11401(updateGuideObjectTransform) L32282(顶层绑定) | sel  filterCurveLatticesToGroup |
| `mirroredCurveLatticePointIndex` | 8698 | function | — | — |    |
| `mirroredCurveLatticeTarget` | 8704 | function | `curveLatticePointSection` `mirroredCurveLatticePointIndex` | — | guides  mirroredScalpRegion |
| `updateCurveLatticeHandleColors` | 8743 | function | `controlPointIsSelected` `mirroredCurveLatticeTarget` | — | CONTROL_POINT_SELECTED_COLOR guides sculptState sel   |
| `curveLatticeLoopHitFromEvent` | 8764 | function | — | 2 处L37606(顶层绑定) L37657(顶层绑定) | raycaster  rayFromViewportEvent selectedCurveLatticeGuide |
| `refreshCurveLatticeLoopHover` | 8781 | function | — | — | guideState guides   |
| `setCurveLatticeLoopHover` | 8790 | function | `refreshCurveLatticeLoopHover` | 2 处L37315(顶层绑定) L37324(顶层绑定) | guideState   |
| `updateCurveLatticeLoopHover` | 8797 | function | `curveLatticeLoopHitFromEvent` `setCurveLatticeLoopHover` | — | guideState pointer renderer sculptState sel  componentEditModeActive pointerHitsTransformGizmo |
| `selectCurveLatticeLoop` | 8816 | function | — | 2 处L37607(顶层绑定) L37658(顶层绑定) | guides sel transformControls  configureTransformControls viewPlaneMoveActiveForView updatePlacementStatus updateSelectedPointLabel detach |
| `selectCurveLatticePoint` | 8845 | function | — | 3 处L18919(reapplySelectionAfterStateRestore) L37603(顶层绑定) L37647(顶层绑定) | guides sel transformControls  detach |
| `updateCurveLatticeFromHandle` | 8860 | function | `curveLatticeEditablePoint` `curveLatticeRestPoint` `editingCurveLatticeDeformation` `updateCurveLatticeGeometry` `mirroredCurveLatticeTarget` | 2 处L914(顶层绑定) L12380(updateViewPlaneMove) | guides sculptState   |
| `beginCurveLatticeMultiEdit` | 8902 | function | `curveLatticeEditablePoint` | 2 处L844(顶层绑定) L12311(beginViewPlaneMove) | guides sculptState sel   |
| `applyCurveLatticeMultiTransform` | 8923 | function | `curveLatticeEditablePoint` `curveLatticeRestPoint` `editingCurveLatticeDeformation` `updateCurveLatticeGeometry` `mirroredCurveLatticeTarget` | 2 处L913(顶层绑定) L12379(updateViewPlaneMove) | guides sculptState sel transformControls   |
| `curveLatticeColumnPoints` | 8966 | function | `curveLatticeControlPoint` `sampleHermiteCurve` `curveTangentsForPoints` | — |    |
| `groupCurveControlIndices` | 8975 | function | — | 1 处L27643(filterCurveLatticesToGroup) |    |
| `groupCurveControlPoints` | 8981 | function | `curveLatticeEditablePoint` `groupCurveControlIndices` | — |    |
| `updateGroupCurveDisplay` | 8987 | function | `groupCurveControlPoints` | — |    |
| `ensureGroupCurveDisplay` | 8997 | function | `updateGroupCurveDisplay` | 1 处L27636(filterCurveLatticesToGroup) | REGION_CURVE_VISUALIZATION_ENABLED guideSurfaceGroup   |
| `groupCurveDeformationPairs` | 9019 | function | `curveLatticeEditablePoint` `curveLatticeRestPoint` `groupCurveControlIndices` | — |    |
| `curveLatticeDeformationPairs` | 9026 | function | — | — |    |
| `appendPairs` | 9028 | arrow | — | — |    |
| `groupLatticeOffsetAtPoint` | 9039 | function | — | — |    |

### 3.2 strand-bridge（3 个 / 71 行）★ 边界存疑

| 函数 | 行号 | 类型 | 模块内调用 | 外部调用点 | 关键 deps |
|---|---|---|---|---|---|
| `updateGroupCurveLatticeStrands` | 9058 | function | `editingCurveLatticeDeformation` `groupCurveDeformationPairs` `curveLatticeDeformationPairs` `groupLatticeOffsetAtPoint` | — | locks  syncLockFromCurve updateLockGeometry |
| `updateBoundCurveLatticeStrands` | 9079 | function | `editingCurveLatticeDeformation` `curveLatticeColumnPoints` `updateGroupCurveLatticeStrands` | — | locks  syncActiveMirror fitPointAttributes rebuildCurveObjects syncLockFromCurve updateLockGeometry updateTopologyStats |
| `createStrandsFromCurveLattice` | 9098 | function | `curveLatticeColumnPoints` | 1 处L32340(顶层绑定) | drawStrandBrushSizeInput locks  addLock pushUndoState scalpRegionNearestWorldPoint applyPlacedStrandScaleProfile updateLockGeometry selectLock renderLockList updateCount |

### 3.3 capsule-guide（61 个 / 1,224 行）

| 函数 | 行号 | 类型 | 模块内调用 | 外部调用点 | 关键 deps |
|---|---|---|---|---|---|
| `capsuleGuideCapHeight` | 9132 | function | — | — |    |
| `hideCapsuleGuideDrawPreview` | 9136 | function | — | — | capsuleGuideDrawPreview   |
| `currentCapsuleGuideDrawProfile` | 9141 | function | — | — | capsuleGuideDrawDefaults   |
| `updateCapsuleGuideProfilePreview` | 9145 | function | `currentCapsuleGuideDrawProfile` | 2 处L32520(顶层绑定) L37170(顶层绑定) | capsuleGuideProfilePath   |
| `capsuleGuideDrawPoints` | 9157 | function | — | — | sculptState  loftSurfaceProfilePoints |
| `updateCapsuleGuideDrawPreview` | 9173 | function | `capsuleGuideDrawPoints` | — | capsuleGuideDrawPreview   |
| `beginCapsuleGuideDrawStroke` | 9179 | function | `updateCapsuleGuideDrawPreview` | 1 处L37473(顶层绑定) | renderer sculptState  updateInteractionLocks activeStrokeSurfaceValue activeStrokeDynamicEnabled contextualPlaneAtOrigin loftSurfaceSampleFromHit updatePlacementStatus |
| `updateCapsuleGuideDrawStroke` | 9205 | function | `updateCapsuleGuideDrawPreview` | — | sculptState  viewPlaneNormal rayFromViewportEvent strokeSurfaceIsContextual drawSurfaceHitFromEvent loftSurfaceSampleFromHit |
| `createCapsuleGuideAlongCurve` | 9235 | function | `currentCapsuleGuideDrawProfile` `capsuleGuideDrawPoints` `createCapsuleGuideGeometry` `capsuleControlDataFromGeometry` `addCapsuleGuide` | — | capsuleGuideDrawDefaults surfaceGuideDefaults surfaceGuideFresnelInput surfaceGuideInputs  vectorToData dataToVector |
| `finishCapsuleGuideDrawStroke` | 9289 | function | `hideCapsuleGuideDrawPreview` `capsuleGuideDrawPoints` `updateCapsuleGuideDrawStroke` `createCapsuleGuideAlongCurve` | 3 处L10850(setActiveTool) L34368(顶层绑定) L37255(顶层绑定) | renderer sculptState  updateInteractionLocks pushUndoState updatePlacementStatus |
| `createCapsuleGuideGeometry` | 9310 | function | `capsuleGuideCapHeight` | — |    |
| `vertex` | 9324 | function | — | — |    |
| `addFace` | 9330 | function | — | — |    |
| `addRing` | 9348 | function | `vertex` `addFace` | — |    |
| `capsuleGuideTopologyFeature` | 9403 | function | — | — |    |
| `retopologizeCapsuleGuide` | 9413 | function | `createCapsuleGuideGeometry` `capsuleGuideTopologyFeature` `capsuleControlDataFromGeometry` `capsuleGuideHorizontalLoopsFromTopology` `refreshCapsuleGuideLoopInfluence` `updateCapsuleGuideGeometry` | 1 处L32395(顶层绑定) | guideState sculptState   |
| `resizeCapsuleGuideCylinder` | 9478 | function | `capsuleGuideCapHeight` `createCapsuleGuideGeometry` `capsuleControlDataFromGeometry` | 1 处L32386(顶层绑定) |    |
| `capsuleControlDataFromGeometry` | 9524 | function | — | — |    |
| `capsuleControlGeometryFromData` | 9537 | function | — | — |    |
| `capsuleGuidePointWorldPosition` | 9558 | function | — | — |    |
| `capsuleGuidePointDistances` | 9563 | function | — | — |    |
| `capsuleGuideHorizontalLoopsFromTopology` | 9584 | function | — | — |    |
| `capsuleGuideLoopCenter` | 9604 | function | — | — |    |
| `normalizeCapsuleGuideColor` | 9609 | function | — | 2 处L17815(snapshotState) L32417(顶层绑定) | DEFAULT_CAPSULE_GUIDE_COLOR   |
| `normalizeCapsuleGuideName` | 9615 | function | — | 1 处L32407(顶层绑定) |    |
| `capsuleGuideAccentColor` | 9620 | function | `normalizeCapsuleGuideColor` | — |    |
| `updateCapsuleGuideDisplayColor` | 9625 | function | `normalizeCapsuleGuideColor` `capsuleGuideAccentColor` `updateCapsuleGuideHandleColors` `refreshCapsuleGuideFillInfluence` | 2 处L26933(resetGuideSelectionVisuals) L32418(顶层绑定) | guideState sculptState   |
| `updateCapsuleGuideLoopLines` | 9636 | function | — | — |    |
| `rebuildCapsuleGuideLoopLines` | 9648 | function | `updateCapsuleGuideLoopLines` | — | guideSurfaceGroup sculptState sel   |
| `createCapsuleGuideHandles` | 9680 | function | `capsuleGuidePointWorldPosition` `capsuleGuideAccentColor` | — | sculptState sel   |
| `rebuildCapsuleGuideHandles` | 9703 | function | `rebuildCapsuleGuideLoopLines` `createCapsuleGuideHandles` | — | guideSurfaceGroup sculptState sel transformControls  componentEditModeActive detach |
| `syncCapsuleGuideHandles` | 9722 | function | `capsuleGuidePointWorldPosition` `updateCapsuleGuideLoopLines` | — |    |
| `capsuleGuideMirrorMap` | 9729 | function | — | — |    |
| `mirrorCapsuleGuidePointEdits` | 9745 | function | — | — | sculptState   |
| `updateCapsuleGuideHandleColors` | 9762 | function | `capsuleGuidePointDistances` `capsuleGuideAccentColor` `capsuleGuideMirrorMap` | 4 处L10926(setActiveTool) L11019(setProportionalEditing) L11071(refreshProportionalPreview) L17593(setMirrorXEditing) | CONTROL_POINT_SELECTED_COLOR sculptState  scalpBuilderProportionalWeight |
| `updateCapsuleGuideFromHandle` | 9777 | function | `syncCapsuleGuideHandles` `capsuleGuideMirrorMap` `mirrorCapsuleGuidePointEdits` `updateCapsuleGuideHandleColors` `updateCapsuleGuideGeometry` | 1 处L909(顶层绑定) | guides sculptState  scalpBuilderProportionalWeight |
| `beginCapsuleGuideHandleEdit` | 9814 | function | `capsuleGuidePointDistances` `capsuleGuideMirrorMap` | 1 处L824(顶层绑定) | guides sculptState   |
| `selectCapsuleGuidePoint` | 9830 | function | `updateCapsuleGuideHandleColors` | 1 处L37484(顶层绑定) | guideState sculptState sel transformControls  configureTransformControls detach |
| `capsuleGuideLoopTransformGuide` | 9847 | function | — | — | guides sculptState   |
| `attachCapsuleGuideLoopTransform` | 9853 | function | `capsuleGuideLoopCenter` `capsuleGuideLoopTransformGuide` | 1 处L10936(setActiveTool) | capsuleGuideLoopHandle sculptState sel transformControls  configureTransformControls detach |
| `selectCapsuleGuideLoop` | 9880 | function | `updateCapsuleGuideHandleColors` `attachCapsuleGuideLoopTransform` `setCapsuleGuideLoopHover` | — | guideState sculptState sel   |
| `beginCapsuleGuideLoopTransform` | 9892 | function | `capsuleGuideLoopCenter` `capsuleGuideLoopTransformGuide` | 1 处L814(顶层绑定) | capsuleGuideLoopHandle guideState sculptState sel   |
| `updateCapsuleGuideLoopTransform` | 9911 | function | `syncCapsuleGuideHandles` `refreshCapsuleGuideLoopInfluence` `updateCapsuleGuideGeometry` | 1 处L905(顶层绑定) | capsuleGuideLoopHandle guideState guides sculptState  scalpBuilderProportionalWeight |
| `refreshCapsuleGuideFillInfluence` | 9956 | function | `capsuleGuideLoopCenter` `capsuleGuideAccentColor` | — |   scalpBuilderProportionalWeight |
| `refreshCapsuleGuideLoopInfluence` | 9991 | function | `refreshCapsuleGuideFillInfluence` | 3 处L11020(setProportionalEditing) L11072(refreshProportionalPreview) L32391(顶层绑定) | guideState guides sculptState  scalpBuilderProportionalWeight |
| `setCapsuleGuideLoopHover` | 10005 | function | `refreshCapsuleGuideLoopInfluence` | — | guideState   |
| `capsuleGuideLoopHitFromEvent` | 10011 | function | `getSelectedGuide` | — | camera pointer raycaster renderer sculptState   |
| `updateCapsuleGuideLoopHover` | 10028 | function | `setCapsuleGuideLoopHover` `capsuleGuideLoopHitFromEvent` | — | pointer renderer sculptState   |
| `beginCapsuleGuideLoopDrag` | 10039 | function | `selectCapsuleGuideLoop` `capsuleGuideLoopHitFromEvent` | 1 处L37488(顶层绑定) | sculptState sel   |
| `updateCapsuleGuideLoopDrag` | 10050 | function | `syncCapsuleGuideHandles` `updateCapsuleGuideGeometry` | — | guides sculptState  scalpBuilderProportionalWeight |
| `endCapsuleGuideLoopDrag` | 10080 | function | `updateCapsuleGuideLoopHover` | — | renderer sculptState  updateInteractionLocks |
| `createSubdividedQuadGeometry` | 10090 | function | — | — |   subdivideScalpBuilderCage |
| `createEmphasizedSubdivisionEdges` | 10131 | function | — | — |    |
| `createQuadCageGeometry` | 10147 | function | — | — |    |
| `scalpFittedCapsuleSpec` | 10171 | function | — | — |   activeScalpSurfaceMesh |
| `createScalpFittedCapsuleGuide` | 10191 | function | `scalpFittedCapsuleSpec` `addCapsuleGuide` `syncGuideInputs` | 1 处L32436(顶层绑定) | surfaceGuideDefaults  pushUndoState |
| `updateCapsuleGuideGeometry` | 10202 | function | `createCapsuleGuideGeometry` `capsuleControlDataFromGeometry` `capsuleControlGeometryFromData` `capsuleGuideHorizontalLoopsFromTopology` `rebuildCapsuleGuideHandles` `refreshCapsuleGuideFillInfluence` `createSubdividedQuadGeometry` `createEmphasizedSubdivisionEdges` `createQuadCageGeometry` `updateCapsuleGuideFresnelMaterial` | 6 处L11418(updateGuideObjectTransform) L32263(顶层绑定) L32383(顶层绑定) L32387(顶层绑定) L32390(顶层绑定) … | guideState sculptState   |
| `createCapsuleGuideMaterial` | 10255 | function | — | — |    |
| `updateCapsuleGuideWireOpacity` | 10293 | function | — | 3 处L26943(resetGuideSelectionVisuals) L32370(顶层绑定) L32425(顶层绑定) | sel   |
| `updateCapsuleGuideFresnelMaterial` | 10303 | function | `updateCapsuleGuideWireOpacity` | 2 处L32368(顶层绑定) L32433(顶层绑定) |    |
| `addCapsuleGuide` | 10311 | function | `applyCapsuleGuideDisplayVisibility` `createCapsuleGuideGeometry` `capsuleControlDataFromGeometry` `capsuleGuideHorizontalLoopsFromTopology` `normalizeCapsuleGuideColor` `normalizeCapsuleGuideName` `capsuleGuideAccentColor` `updateCapsuleGuideDisplayColor` `createSubdividedQuadGeometry` `createEmphasizedSubdivisionEdges` `createQuadCageGeometry` `updateCapsuleGuideGeometry` `createCapsuleGuideMaterial` `selectGuide` | 1 处L19211(restoreGuide) | guideSurfaceGroup guides surfaceGuideDefaults  dataToVector refreshLiveSurfaceOptions updateCount |

### 3.4 guide-general（8 个 / 300 行）

| 函数 | 行号 | 类型 | 模块内调用 | 外部调用点 | 关键 deps |
|---|---|---|---|---|---|
| `addGuide` | 10380 | function | `createGuideGeometry` `selectGuide` | — | guideSurfaceGroup guides  updateCount |
| `createGuideGeometry` | 10441 | function | — | 1 处L19230(restoreGuide) |    |
| `selectGuide` | 10496 | function | `renderGuideOutliner` `applyCapsuleGuideDisplayVisibility` `clearMultiPointSelection` `setCurveLatticeLoopHover` `updateCapsuleGuideDisplayColor` `updateCapsuleGuideWireOpacity` `updateGuideControlsVisibility` `getSelectedGuide` `syncGuideInputs` | 9 处L18908(reapplySelectionAfterStateRestore) L25023(selectObjectsInMarquee) L25039(finishSelectionMarquee) L28341(deleteGuide) L32283(顶层绑定) … | curveLatticeToggle guideState guides locks sculptState sel transformControls  clearStrandSelectionState setOutlinerTab componentEditModeActive setViewportEditMode setActiveTool attachGuideObjectTransform updatePlacementStatus updateCurveObjects setStrandSelectionVisual updateAttributeEditorMode filterCurveLatticesToGroup updateSelectedPointLabel refreshRebuildCurveDialog renderLockList detach |
| `updateGuideControlsVisibility` | 10564 | function | `updateViewportToolVisibility` `getSelectedGuide` | 8 处L6581(selectReferenceImage) L6800(setViewportEditMode) L18910(reapplySelectionAfterStateRestore) L26972(refreshStrandSelectionConsumers) L27702(showCurveLatticeForGroup) … | curveLatticeControls guideControls guidePanelTitle ##guideControls  |
| `updateViewportToolVisibility` | 10581 | function | `getSelectedGuide` | 5 处L6009(updateScalpEditingVisibility) L6747(refreshSelectionModeVisuals) L11788(selectSurfaceObjectAnchor) L27759(selectCurvePoint) L35545(refreshStrandControlPointSelection) | draw modeToolButtons scalpState sculptBrushDock sculptState sel viewportCapsuleGuideTool viewportCurveLatticeGuideTool viewportDrawCapsuleGuideTool  componentEditModeActive getSelectedLock setSculptBrushCursorVisible |
| `getSelectedGuide` | 10620 | function | — | 27 处L10626(selectedViewportFocusBounds) L10861(setActiveTool) L11018(setProportionalEditing) L11070(refreshProportionalPreview) L11316(attachGuideObjectTransform) … | guides sel   |
| `syncGuideInputs` | 10714 | function | `normalizeCapsuleGuideColor` | 2 处L11428(finishGuideObjectTransform) L27701(showCurveLatticeForGroup) | curveLatticeHorizontalLoopsInput curveLatticeHorizontalLoopsValue curveLatticeOpacityInput curveLatticeVerticalLoopsInput curveLatticeVerticalLoopsValue guideInputs surfaceGuideColorInput surfaceGuideFresnelInput surfaceGuideInputs surfaceGuideNameInput surfaceGuideValues   |
| `updateGuideGeometry` | 10757 | function | `updateCurveLatticeGeometry` `updateCapsuleGuideGeometry` `createGuideGeometry` `selectGuide` | 2 处L32289(顶层绑定) L32348(顶层绑定) |    |

### 3.5 guide-vis / outliner / UI（18 个 / 248 行）

| 函数 | 行号 | 类型 | 模块内调用 | 外部调用点 | 关键 deps |
|---|---|---|---|---|---|
| `setCapsuleGuideEditing` | 6070 | function | `applyCapsuleGuideDisplayVisibility` `setCapsuleGuideLoopHover` | 4 处L6067(exitSetupEditors) L10854(setActiveTool) L34085(toggleCapsuleGuideTool) L37169(顶层绑定) | capsuleGuideLoopHandle guideState guides renderer sculptState sel transformControls  updateScalpEditingVisibility setViewportEditMode setActiveTool updatePlacementStatus deselectStrandsForGuideEditor updateAttributeEditorMode detach |
| `outlinerGuides` | 6831 | function | — | 1 处L30988(updateCount) | guides   |
| `guideOutlinerLabel` | 6838 | function | — | — |   strandRegionDisplayLabel |
| `createScalpGuideOutlinerRow` | 6904 | function | `setScalpGuideVisibility` | — | scalpState  setViewportEditMode createOutlinerVisibilityToggle deselectStrands updateAttributeEditorMode showOutlinerContextMenu |
| `renderGuideOutliner` | 6939 | function | `outlinerGuides` `guideOutlinerLabel` `createScalpGuideOutlinerRow` `normalizeCapsuleGuideColor` `selectGuide` | 6 处L5964(setScalpBuilderEditing) L6688(setOutlinerTab) L7890(applyDisplayVisibilityFilters) L30991(updateCount) L32409(顶层绑定) … | guideOutliner guideState sel surfaceGuideNameInput  createOutlinerVisibilityToggle handleOutlinerRenameClick applyDisplayVisibilityFilters pushUndoState refreshLiveSurfaceOptions showOutlinerContextMenu |
| `activeToolUsesScalpGuide` | 7619 | function | — | — | draw scalpState sel  activeStrokeSurfaceValue |
| `toolAutoShowsScalpGuide` | 7628 | function | — | — | braidAutoShowScalpInput draw drawAutoShowScalpInput panelAutoShowScalpInput placeAutoShowScalpInput scalpState sel   |
| `autoShowScalpGuideForActiveTool` | 7638 | function | `activeToolUsesScalpGuide` `toolAutoShowsScalpGuide` `setScalpGuideVisibility` | 3 处L10913(setActiveTool) L32736(handleLiveSurfaceChange) L34205(顶层绑定) |    |
| `setScalpGuideVisibility` | 7644 | function | `renderGuideOutliner` `updateGuideViewToggle` | 7 处L5889(generateScalpFromBuilder) L5944(setScalpBuilderEditing) L7611(setHeadSetupEditing) L7919(setScalpShapeEditing) L7937(setScalpPaintEditing) … | guides scalpState sel  updateScalpEditingVisibility syncDisplayVisibilityInputs |
| `currentGuideViewMode` | 7652 | function | — | — | GUIDE_VIEW_MODES guideState scalpState   |
| `updateGuideViewToggle` | 7660 | function | `currentGuideViewMode` | 1 处L7814(syncDisplayVisibilityInputs) | guideState guideViewModeActions scalpGuideVisibilityToggle scalpState   |
| `setGuideViewMode` | 7676 | function | `setScalpGuideVisibility` `updateGuideViewToggle` `applyCapsuleGuideDisplayVisibility` `applyCurveLatticeGuideDisplayVisibility` | 1 处L34133(顶层绑定) | GUIDE_VIEW_MODES guideState  syncDisplayVisibilityInputs |
| `cycleGuideViewMode` | 7687 | function | `currentGuideViewMode` `setGuideViewMode` | — | GUIDE_VIEW_MODES   |
| `hideGuideViewContextMenu` | 7692 | function | — | 5 处L31338(顶层绑定) L31441(顶层绑定) L31445(顶层绑定) L31450(顶层绑定) L34134(顶层绑定) | guideViewContextMenu   |
| `showGuideViewContextMenu` | 7696 | function | `updateGuideViewToggle` | — | guideViewContextMenu #button.active  |
| `applyCapsuleGuideDisplayVisibility` | 7844 | function | `getSelectedGuide` | 3 处L7885(applyDisplayVisibilityFilters) L34176(顶层绑定) L34185(顶层绑定) | guideState guides sculptState sel transformControls  detach |
| `applyOtherGuideDisplayVisibility` | 7867 | function | — | 1 处L7887(applyDisplayVisibilityFilters) | guides   |
| `applyCurveLatticeGuideDisplayVisibility` | 7875 | function | `getSelectedGuide` | 3 处L7886(applyDisplayVisibilityFilters) L34177(顶层绑定) L34190(顶层绑定) | guideState sel transformControls  filterCurveLatticesToGroup detach |

## 4. 外部调用点清单（176 处，需改 api.xxx；不含候选函数互相调用）

> 按调用方分组。`顶层事件绑定` = app.js 顶层的 `addEventListener`/`bindUndoCapture` 等绑定代码（不在任何函数体内）。行号为当前文件。候选→候选的 269 处内部调用不在此列。

> 实际列出 176 处（与 §1 的 176 一致）。

- **顶层事件绑定**（86 处）：setCapsuleGuideEditing@37169，autoShowScalpGuideForActiveTool@34205，setScalpGuideVisibility@34175，setScalpGuideVisibility@34181，setGuideViewMode@34133，hideGuideViewContextMenu@31338，hideGuideViewContextMenu@31441，hideGuideViewContextMenu@31445，hideGuideViewContextMenu@31450，hideGuideViewContextMenu@34134，renderGuideOutliner@32409，renderGuideOutliner@32419，applyCapsuleGuideDisplayVisibility@34176，applyCapsuleGuideDisplayVisibility@34185，applyCurveLatticeGuideDisplayVisibility@34177，applyCurveLatticeGuideDisplayVisibility@34190，flatCurveLatticePoints@32268，curveLatticePointsForScalpRegion@32269，createCurveLatticeGuideSet@32312，defaultCurveLatticeRootPoints@32270，resampleCurveLatticeGuide@32329，resampleCurveLatticeGuide@32336，controlPointIsSelected@37646，createCurveLatticeHandles@32279，addCurveLattice@32309，updateCurveLatticeGeometry@32282，curveLatticeLoopHitFromEvent@37606，curveLatticeLoopHitFromEvent@37657，setCurveLatticeLoopHover@37315，setCurveLatticeLoopHover@37324，selectCurveLatticeLoop@37607，selectCurveLatticeLoop@37658，selectCurveLatticePoint@37603，selectCurveLatticePoint@37647，updateCurveLatticeFromHandle@914，beginCurveLatticeMultiEdit@844，applyCurveLatticeMultiTransform@913，createStrandsFromCurveLattice@32340，updateCapsuleGuideProfilePreview@32520，updateCapsuleGuideProfilePreview@37170，beginCapsuleGuideDrawStroke@37473，finishCapsuleGuideDrawStroke@34368，finishCapsuleGuideDrawStroke@37255，retopologizeCapsuleGuide@32395，resizeCapsuleGuideCylinder@32386，normalizeCapsuleGuideColor@32417，normalizeCapsuleGuideName@32407，updateCapsuleGuideDisplayColor@32418，updateCapsuleGuideFromHandle@909，beginCapsuleGuideHandleEdit@824，selectCapsuleGuidePoint@37484，beginCapsuleGuideLoopTransform@814，updateCapsuleGuideLoopTransform@905，refreshCapsuleGuideLoopInfluence@32391，beginCapsuleGuideLoopDrag@37488，createScalpFittedCapsuleGuide@32436，updateCapsuleGuideGeometry@32263，updateCapsuleGuideGeometry@32383，updateCapsuleGuideGeometry@32387，updateCapsuleGuideGeometry@32390，updateCapsuleGuideGeometry@32398，updateCapsuleGuideWireOpacity@32370，updateCapsuleGuideWireOpacity@32425，updateCapsuleGuideFresnelMaterial@32368，updateCapsuleGuideFresnelMaterial@32433，selectGuide@32283，selectGuide@32304，selectGuide@32314，selectGuide@37500，selectGuide@37716，updateGuideControlsVisibility@37160，getSelectedGuide@32256，getSelectedGuide@32296，getSelectedGuide@32319，getSelectedGuide@32327，getSelectedGuide@32334，getSelectedGuide@32340，getSelectedGuide@32345，getSelectedGuide@32359，getSelectedGuide@32405，getSelectedGuide@32415，getSelectedGuide@32422，getSelectedGuide@32430，getSelectedGuide@37478，updateGuideGeometry@32289，updateGuideGeometry@32348
- **setActiveTool**（6 处）：setCapsuleGuideEditing@10854，autoShowScalpGuideForActiveTool@10913，finishCapsuleGuideDrawStroke@10850，updateCapsuleGuideHandleColors@10926，attachCapsuleGuideLoopTransform@10936，getSelectedGuide@10861
- **applyDisplayVisibilityFilters**（4 处）：renderGuideOutliner@7890，applyCapsuleGuideDisplayVisibility@7885，applyOtherGuideDisplayVisibility@7887，applyCurveLatticeGuideDisplayVisibility@7886
- **reapplySelectionAfterStateRestore**（4 处）：curveLatticeEditablePoint@18925，selectCurveLatticePoint@18919，selectGuide@18908，updateGuideControlsVisibility@18910
- **selectStrandGroup**（3 处）：clearMultiPointSelection@27729，updateGuideControlsVisibility@27722，updateGuideControlsVisibility@27742
- **restoreGuide**（3 处）：addCurveLattice@19219，addCapsuleGuide@19211，createGuideGeometry@19230
- **setProportionalEditing**（3 处）：updateCapsuleGuideHandleColors@11019，refreshCapsuleGuideLoopInfluence@11020，getSelectedGuide@11018
- **refreshProportionalPreview**（3 处）：updateCapsuleGuideHandleColors@11071，refreshCapsuleGuideLoopInfluence@11072，getSelectedGuide@11070
- **setScalpBuilderEditing**（2 处）：setScalpGuideVisibility@5944，renderGuideOutliner@5964
- **updateCount**（2 处）：outlinerGuides@30988，renderGuideOutliner@30991
- **createStandaloneCurveLatticeGuide**（2 处）：flatCurveLatticePoints@27663，addCurveLattice@27658
- **curveLatticeForGroup**（2 处）：curveLatticePointsForScalpRegion@27600，addCurveLattice@27595
- **selectReferenceImage**（2 处）：clearMultiPointSelection@6571，updateGuideControlsVisibility@6581
- **refreshSelectionModeVisuals**（2 处）：clearMultiPointSelection@6727，updateViewportToolVisibility@6747
- **selectSurfaceObjectAnchor**（2 处）：clearMultiPointSelection@11786，updateViewportToolVisibility@11788
- **updateGuideObjectTransform**（2 处）：updateCurveLatticeGeometry@11401，updateCapsuleGuideGeometry@11418
- **updateViewPlaneMove**（2 处）：updateCurveLatticeFromHandle@12380，applyCurveLatticeMultiTransform@12379
- **filterCurveLatticesToGroup**（2 处）：groupCurveControlIndices@27643，ensureGroupCurveDisplay@27636
- **resetGuideSelectionVisuals**（2 处）：updateCapsuleGuideDisplayColor@26933，updateCapsuleGuideWireOpacity@26943
- **showCurveLatticeForGroup**（2 处）：updateGuideControlsVisibility@27702，syncGuideInputs@27701
- **exitSetupEditors**（1 处）：setCapsuleGuideEditing@6067
- **toggleCapsuleGuideTool**（1 处）：setCapsuleGuideEditing@34085
- **handleLiveSurfaceChange**（1 处）：autoShowScalpGuideForActiveTool@32736
- **generateScalpFromBuilder**（1 处）：setScalpGuideVisibility@5889
- **setHeadSetupEditing**（1 处）：setScalpGuideVisibility@7611
- **setScalpShapeEditing**（1 处）：setScalpGuideVisibility@7919
- **setScalpPaintEditing**（1 处）：setScalpGuideVisibility@7937
- **syncDisplayVisibilityInputs**（1 处）：updateGuideViewToggle@7814
- **setOutlinerTab**（1 处）：renderGuideOutliner@6688
- **updateViewPlaneGrid**（1 处）：curveLatticeEditablePoint@12152
- **beginPolyBrushPointer**（1 处）：controlPointIsSelected@21243
- **updateCurveObjects**（1 处）：controlPointIsSelected@25875
- **handleColor**（1 处）：controlPointIsSelected@26401
- **activateStrandControlPoint**（1 处）：controlPointIsSelected@35486
- **deselectStrands**（1 处）：clearMultiPointSelection@24594
- **selectLock**（1 处）：clearMultiPointSelection@27014
- **rebuildSelectedCurves**（1 处）：clearMultiPointSelection@28214
- **beginViewPlaneMove**（1 处）：beginCurveLatticeMultiEdit@12311
- **snapshotState**（1 处）：normalizeCapsuleGuideColor@17815
- **setMirrorXEditing**（1 处）：updateCapsuleGuideHandleColors@17593
- **selectObjectsInMarquee**（1 处）：selectGuide@25023
- **finishSelectionMarquee**（1 处）：selectGuide@25039
- **deleteGuide**（1 处）：selectGuide@28341
- **setViewportEditMode**（1 处）：updateGuideControlsVisibility@6800
- **refreshStrandSelectionConsumers**（1 处）：updateGuideControlsVisibility@26972
- **updateScalpEditingVisibility**（1 处）：updateViewportToolVisibility@6009
- **selectCurvePoint**（1 处）：updateViewportToolVisibility@27759
- **refreshStrandControlPointSelection**（1 处）：updateViewportToolVisibility@35545
- **selectedViewportFocusBounds**（1 处）：getSelectedGuide@10626
- **attachGuideObjectTransform**（1 处）：getSelectedGuide@11316
- **beginGuideObjectTransform**（1 处）：getSelectedGuide@11364
- **finalizeStateRestore**（1 处）：getSelectedGuide@18934
- **updateAttributeEditorMode**（1 处）：getSelectedGuide@27419
- **pinActiveToolSettingsPanel**（1 处）：getSelectedGuide@27580
- **deleteSelectedGuide**（1 处）：getSelectedGuide@28347
- **hasDeletableSelection**（1 处）：getSelectedGuide@28367
- **deleteCurrentSelection**（1 处）：getSelectedGuide@28374
- **beginStrandRadialGesture**（1 处）：getSelectedGuide@28920
- **visibleControlPointHoverTargets**（1 处）：getSelectedGuide@37113
- **finishGuideObjectTransform**（1 处）：syncGuideInputs@11428

## 5. deps 注入清单

### 5.1 store（直接传 store 对象，模块内读 `store.state.xxx` / 写 `store.state.xxx`）

| store | 用途（候选函数读取/写入的关键 state） | 来源 |
|---|---|---|
| `guideState`（createGuideStore） | `capsuleGuidesVisible`、`curveLatticeGuidesVisible`、`activeCapsuleGuideLoopTransform`、`capsuleGuideLoopHover`、`activeCurveLatticeGuideId` | modules/core/guide-store.js |
| `sel`（createSelectionStore） | `selectedGuideId`、`selectedControlPoints`、`selectedStrandGroup`、`activeTool`、`selectedCurveLatticePoint`、`activeCurveLatticeGuideId`、`selectedReferenceImageId`、`selectedPoint`、`selectedSurfaceObjectAnchorId`、`selectedCurveSurfaceController`、`clumpViewportSelection`、`activeOutlinerTab` | modules/edit/selection-store.js |
| `sculptState`（createSculptEditStore） | `viewportEditMode`、`capsuleGuideEditing`、`mirrorXEditing`、`capsuleGuideLoopSelection`、`capsuleGuideLoopDrag`、`activeCapsuleGuideEdit`、`activeLatticeMultiEdit`、`capsuleGuideDrawStroke`、`proportionalEditing`、`transformDragging`、`headSetupEditing`、`selectedScalpLatticeIndex` | modules/edit/sculpt-edit-store.js |
| `scalpState`（createScalpStore） | `scalpGuideVisible`、`scalpRegionAssignments`、`scalpVisibleQuads`、`scalpShapeEditing`、`scalpPaintEditing`、`scalpBuilderEditing`、`activeScalpRegion` | modules/scalp/scalp-store.js |
| `draw`（createDrawStore） | `activeToolUsesScalpGuide`/`toolAutoShowsScalpGuide` 读取（若一并迁出） | modules/edit/draw-store.js |

### 5.2 共享对象 / 数组（引用注入，模块内可变）

| 标识符 | 行号 | 类型 | 用途 |
|---|---|---|---|
| `guides` | 2269 | `const []` | 全部 guide 注册表（`push`/`filter`/`find`），curve/capsule/curve-lattice 通用 |
| `locks` | 2267 | `const []` | strand(locks) 注册表，strand-bridge 3 函数 + `resampleGrid`/`selectGuide` 使用 |
| `guideSurfaceGroup` | 1019 | `THREE.Group` | guide 网格/手柄挂载点 |
| `scalpSurfaceGroup` | 1473 | `THREE.Group` | scalp 采样/射线（`defaultCurveLatticePoints`/`scalpRegionSurfaceSamples`/`rebuildCurveLatticeLoopPickers` 等） |
| `scalpSurfaceGeometry` | 1475 | 解构 const | scalp 顶点/法线属性读取（`scalpRegionSurfaceSamples`） |
| `transformControls` | 497 | `TransformControls` | 手柄 attach/detach/配置（selectGuide、handle 编辑、loop 变换等） |
| `camera` | 487 | 全局 let | 射线拾取（`capsuleGuideLoopHitFromEvent`） |
| `pointer` / `raycaster` | 2079 / 2076 | `Vector2` / `Raycaster` | loop/point 拾取 |
| `capsuleGuideLoopHandle` | 695 | `THREE.Object3D` | loop 变换 gizmo 附着对象 |
| `renderer` | 453 | WebGLRenderer | 指针捕获/光标/射线 |

### 5.3 DOM 元素 / 常量（引用注入）

| 标识符 | 行号 | 用途 |
|---|---|---|
| `scalpGuideVisibilityToggle` | 2497 | guide 视图切换按钮（updateGuideViewToggle） |
| `guideViewContextMenu` / `guideViewModeActions` | 2498 / 2499 | guide 视图右键菜单 |
| `guideOutliner` | 2463 | guide outliner 容器（renderGuideOutliner） |
| `curveLatticeToggle` / `curveLatticeControls` / `curveLatticeOpacityInput` / `curveLatticeHorizontalLoopsInput`(+`Value`) / `curveLatticeVerticalLoopsInput`(+`Value`) | 2604-2609 | curve-lattice 控制面板 |
| `guideControls`（NodeList）/ `guidePanelTitle` | 2373 / 2603 | 通用 guide 面板显隐/标题 |
| `guideInputs`（对象集合） | 2359 | 通用 guide 参数输入 |
| `surfaceGuideNameInput` / `surfaceGuideColorInput` / `surfaceGuideFresnelInput` / `surfaceGuideInputs` / `surfaceGuideValues` / `surfaceGuideFitScalpButton` | 2845-2866 | capsule guide 面板 |
| `capsuleGuideProfilePath` / `capsuleGuideDrawPreview` | 2834 / 1972 | capsule guide 绘制预览 |
| `surfaceGuideDefaults` / `capsuleGuideDrawDefaults` / `DEFAULT_CAPSULE_GUIDE_COLOR` / `CONTROL_POINT_SELECTED_COLOR` | 2272 / 2282 / 2271 / 560 | 默认值/颜色常量 |
| `modeToolButtons` / `sculptBrushDock` / `viewportCapsuleGuideTool` / `viewportDrawCapsuleGuideTool` / `viewportCurveLatticeGuideTool` | 3051 / 425 / 2454-2456 | 工具可见性（updateViewportToolVisibility） |
| `placeAutoShowScalpInput` / `drawAutoShowScalpInput` / `braidAutoShowScalpInput` / `panelAutoShowScalpInput` | 2700-2829 | auto-show-scalp-guide 勾选 |
| `drawStrandBrushSizeInput` | 2744 | createStrandsFromCurveLattice 读取宽度 |

### 5.4 helper 函数（注入；均为 app.js 顶层函数，附当前行号）

| helper | 行号 | 调用方（候选函数） |
|---|---|---|
| `activeScalpSurfaceMesh` | 1644 | defaultCurveLatticePoints / defaultCurveLatticeRootPoints / scalpFittedCapsuleSpec / scalpRegionSurfaceSamples |
| `mirroredScalpRegion` | 17216 | editingCurveLatticeDeformation / mirroredCurveLatticeTarget |
| `scalpBuilderProportionalWeight` | 4702 | updateCapsuleGuideFromHandle / refreshCapsuleGuideFillInfluence / refreshCapsuleGuideLoopInfluence / updateCapsuleGuideLoopTransform / updateCapsuleGuideLoopDrag / updateCapsuleGuideHandleColors |
| `setViewportEditMode` | 6763 | setCapsuleGuideEditing / selectGuide / createScalpGuideOutlinerRow |
| `setOutlinerTab` | 6674 | selectGuide |
| `createOutlinerVisibilityToggle` | 6805 | renderGuideOutliner / createScalpGuideOutlinerRow |
| `componentEditModeActive` | 6696 | selectGuide / updateViewportToolVisibility / rebuildCapsuleGuideHandles / updateCurveLatticeLoopHover |
| `syncDisplayVisibilityInputs` | 7788 | setScalpGuideVisibility / setGuideViewMode |
| `updateScalpEditingVisibility` | 5967 | setCapsuleGuideEditing / setScalpGuideVisibility |
| `applyDisplayVisibilityFilters` | 7882 | renderGuideOutliner(onToggle) |
| `setActiveTool` | 10832 | setCapsuleGuideEditing / selectGuide |
| `setSculptBrushCursorVisible` | 36025 | updateViewportToolVisibility |
| `updateInteractionLocks` | 11179 | beginCapsuleGuideDrawStroke / finishCapsuleGuideDrawStroke / endCapsuleGuideLoopDrag |
| `configureTransformControls` | 11190 | selectCapsuleGuidePoint / selectCurveLatticeLoop / attachCapsuleGuideLoopTransform |
| `detach` | 33632 | applyCapsuleGuideDisplayVisibility / applyCurveLatticeGuideDisplayVisibility / rebuildCurveLatticeHandles / selectCurveLatticeLoop / selectCurveLatticePoint / selectGuide / rebuildCapsuleGuideHandles / selectCapsuleGuidePoint / attachCapsuleGuideLoopTransform / setCapsuleGuideEditing |
| `viewPlaneNormal` | 12127 | updateCapsuleGuideDrawStroke |
| `viewPlaneMoveActiveForView` | 12139 | selectCurveLatticeLoop |
| `rayFromViewportEvent` | 12219 | updateCapsuleGuideDrawStroke / curveLatticeLoopHitFromEvent |
| `pointerHitsTransformGizmo` | 11242 | updateCurveLatticeLoopHover |
| `updatePlacementStatus` | 24454 | setCapsuleGuideEditing / beginCapsuleGuideDrawStroke / finishCapsuleGuideDrawStroke / selectCurveLatticeLoop / selectGuide |
| `updateAttributeEditorMode` | 27416 | setCapsuleGuideEditing / selectGuide / createScalpGuideOutlinerRow |
| `updateSelectedPointLabel` | 27762 | selectGuide / selectCurveLatticeLoop |
| `deselectStrandsForGuideEditor` | 27046 | setCapsuleGuideEditing |
| `deselectStrands` | 24593 | createScalpGuideOutlinerRow |
| `clearStrandSelectionState` | 2117 | selectGuide |
| `setStrandSelectionVisual` | 26878 | selectGuide |
| `updateCurveObjects` | 25756 | selectGuide |
| `renderLockList` | 30832 | selectGuide / createStrandsFromCurveLattice |
| `refreshRebuildCurveDialog` | 28164 | selectGuide |
| `filterCurveLatticesToGroup` | 27607 | updateCurveLatticeGeometry / applyCurveLatticeGuideDisplayVisibility / selectGuide |
| `attachGuideObjectTransform` | 11315 | selectGuide |
| `updateCount` | 30986 | addCurveLattice / addCapsuleGuide / addGuide / createStrandsFromCurveLattice |
| `pushUndoState` | 18646 | renderGuideOutliner(onToggle) / createStrandsFromCurveLattice / finishCapsuleGuideDrawStroke / createScalpFittedCapsuleGuide |
| `normalizeOutlinerName` | 6848 | addCurveLattice |
| `dataToVector / vectorToData` | 19274 / 19270 | addCurveLattice / createCapsuleGuideAlongCurve / addCapsuleGuide |
| `refreshLiveSurfaceOptions` | 20781 | renderGuideOutliner / addCapsuleGuide |
| `showOutlinerContextMenu` | 28411 | renderGuideOutliner / createScalpGuideOutlinerRow |
| `handleOutlinerRenameClick` | 6894 | renderGuideOutliner |
| `activeStrokeSurfaceValue / activeStrokeDynamicEnabled / strokeSurfaceIsContextual / contextualPlaneAtOrigin / loftSurfaceSampleFromHit / drawSurfaceHitFromEvent` | 20722 / 20732 / 20839 / 20847 / 23953 / 20857 | beginCapsuleGuideDrawStroke / updateCapsuleGuideDrawStroke / activeToolUsesScalpGuide / capsuleGuideDrawPoints |
| `loftSurfaceProfilePoints` | 23283 | capsuleGuideDrawPoints |
| `addLock / selectLock / scalpRegionNearestWorldPoint / applyPlacedStrandScaleProfile / updateLockGeometry / syncLockFromCurve / fitPointAttributes / rebuildCurveObjects / syncActiveMirror / updateTopologyStats` | 17005 / 26984 / 20692 / 24290 / 26536 / 26426 / 19578 / 19607 / 17570 / 27102 | strand-bridge 3 函数 |
| `subdivideScalpBuilderCage` | 4337 | createSubdividedQuadGeometry |
| `getSelectedLock` | 27848 | updateViewportToolVisibility |
| `selectedCurveLatticeGuide` | 20699 | curveLatticeLoopHitFromEvent |
| `updateViewPlaneGrid` | 12143 | 顶层事件绑定(曲线晶格 toggle) |

### 5.5 可直接 import 的模块（无需注入）

| 模块 | 导出（候选函数用到） |
|---|---|
| `three` | `THREE`（全部几何/材质/数学） |
| `modules/core/app-config.js` | `CURVE_LATTICE_FEATURE_ENABLED`、`GROUP_CURVE_FEATURE_ENABLED`、`SCALP_REGIONS`、`STRAND_GROUPS`、`DEFAULT_HAIR_COLOR` |
| `modules/geometry/curve-lattice.js` | `curveLatticeLoopPointIndices`、`DEFAULT_CURVE_LATTICE_PLANE`、`flatCurveLatticePointData`、`resampleCurveLatticeLineData`、`resampleCurveLatticePointData`（app.js 本地 `flatCurveLatticePoints`/`resampleCurveLatticeGuide` 与之存在重叠，可评估合并） |
| `modules/geometry/capsule-curve.js` | `curveDeformedCapsulePoints`、`polylineLength`、`sampleCapsuleRadialProfile`、`scaleCapsuleRadialLoops` |
| `modules/geometry/curve-math.js` | `sampleArray` 等曲线采样（如需） |

## 6. 边界存疑点

1. **strand-bridge 3 函数（§3.2）**：`createStrandsFromCurveLattice`/`updateGroupCurveLatticeStrands`/`updateBoundCurveLatticeStrands` 直接读写 `locks` 并调用 strand 子系统 helper（`addLock`/`selectLock`/`syncLockFromCurve`/`updateLockGeometry`/`fitPointAttributes`/`rebuildCurveObjects`/`syncActiveMirror`/`updateTopologyStats`/`applyPlacedStrandScaleProfile`/`scalpRegionNearestWorldPoint`），并 pushUndoState。它们是 curve-lattice 与 strand 的桥接：**建议单独一批**（如 `modules/geometry/guide-strand-bridge.js`）或暂留 app.js，避免 guide 模块反向依赖 strand 注册表。
2. **scalp 耦合**：`scalpRegionSurfaceSamples`（读 scalpState/scalpSurfaceGroup/scalpSurfaceGeometry）、`defaultCurveLatticePoints`/`defaultCurveLatticeRootPoints`/`scalpFittedCapsuleSpec`（用 `activeScalpSurfaceMesh` 射线）、`createScalpFittedCapsuleGuide`（surfaceGuideFitScalpButton 入口）依赖 scalp 网格数据。可随 guide 模块迁出（注入 `activeScalpSurfaceMesh`/scalp store），但若阶段 4「scalp 系统」也要拆，需先定归属。
3. **hub 函数跨子系统**：`getSelectedGuide`（外部 33 处，被 selection/outliner/transform/marquee/delete 等引用）、`selectGuide`（外部 16 处，重置 strand/reference/curve-surface 选择态并调 `clearStrandSelectionState`/`setStrandSelectionVisual`/`updateCurveObjects`/`renderLockList`）、`updateGuideControlsVisibility`（外部 9 处）、`updateViewportToolVisibility`（外部 6 处）、`controlPointIsSelected`/`clearMultiPointSelection`（被 strand 控制点选择引用）。这些迁出会形成 **app.js → guide 模块** 的单向依赖（其它子系统调 api），可接受；但 `selectGuide` 内部对 strand/selection 的重置逻辑较多，**建议把 `selectGuide` 留在 app.js 或拆成 `api.selectGuide(id)` + app.js 包装**（二选一，倾向后者）。
4. **显示过滤器编排**：`applyDisplayVisibilityFilters`（L7882）是编排器（character/strand/capsule/curve-lattice/other + sync inputs + renderLockList + renderGuideOutliner），**留在 app.js**，改调 `api.applyCapsuleGuideDisplayVisibility()` 等；`applyStrandDisplayVisibility`/`applyCharacterMeshDisplayVisibility` 属于 strand/character，不迁。`renderGuideOutliner` 与 outliner 子系统共用 `createOutlinerVisibilityToggle`/`handleOutlinerRenameClick`/`showOutlinerContextMenu`/`normalizeOutlinerName`/`pushUndoState`——建议一并注入或把 outliner 共享件也参数化。
5. **capsule guide 绘制（draw 子系统耦合）**：`begin/update/finishCapsuleGuideDrawStroke` 依赖 draw/surface 子系统（`activeStrokeSurfaceValue`/`loftSurfaceSampleFromHit`/`drawSurfaceHitFromEvent`/`strokeSurfaceIsContextual`/`contextualPlaneAtOrigin`/`viewPlaneNormal`/`rayFromViewportEvent`/`updateInteractionLocks`）与 `sculptState.state.capsuleGuideDrawStroke`。若这些 helper 稳定，可随模块迁出（注入）；若后续「draw 子系统」也要拆，需协调。
6. **TransformControls 顶层事件绑定（L630-1028）**：`dragging-changed`/`objectChange` 监听按 `userData` 分派到候选 handle 函数（`begin/updateCapsuleGuideLoopTransform`、`begin/updateCapsuleGuideFromHandle`、`beginCurveLatticeMultiEdit`、`update/applyCurveLatticeFromHandle/MultiTransform`）。这部分绑定留在 app.js，改调 api。

## 7. 模块装配建议

```js
// modules/geometry/guide-system.js  （新文件，约 2,950 行）
import * as THREE from "three";
import { CURVE_LATTICE_FEATURE_ENABLED, GROUP_CURVE_FEATURE_ENABLED, SCALP_REGIONS, STRAND_GROUPS, DEFAULT_HAIR_COLOR } from "../core/app-config.js";
import { flatCurveLatticePointData, resampleCurveLatticePointData, resampleCurveLatticeLineData } from "./curve-lattice.js";
import { curveDeformedCapsulePoints, polylineLength, sampleCapsuleRadialProfile } from "./capsule-curve.js";

export function createGuideSystemApi(deps) {
  // deps: { stores:{guideState,sel,sculptState,scalpState,draw},
  //         shared:{guides,locks,guideSurfaceGroup,scalpSurfaceGroup,scalpSurfaceGeometry,transformControls,camera,pointer,raycaster,capsuleGuideLoopHandle,renderer},
  //         dom:{...见 §5.3}, consts:{GUIDE_VIEW_MODES,surfaceGuideDefaults,capsuleGuideDrawDefaults,DEFAULT_CAPSULE_GUIDE_COLOR,CONTROL_POINT_SELECTED_COLOR},
  //         helpers:{activeScalpSurfaceMesh,mirroredScalpRegion,scalpBuilderProportionalWeight,...,pushUndoState,updateCount,...} }
  // ... 内部实现 = §3 的 151 个函数（模块内直接互相调用）
  return {
    // 暴露给 app.js 的 api（§4 外部调用点全部改走这里）
    createCurveLatticeGuideSet, addCurveLattice, resampleCurveLatticeGuide,
    updateCurveLatticeGeometry, updateCurveLatticeFromHandle, beginCurveLatticeMultiEdit, applyCurveLatticeMultiTransform,
    selectCurveLatticePoint, selectCurveLatticeLoop, curveLatticeLoopHitFromEvent,
    addCapsuleGuide, updateCapsuleGuideGeometry, updateCapsuleGuideFromHandle, beginCapsuleGuideHandleEdit,
    beginCapsuleGuideLoopTransform, updateCapsuleGuideLoopTransform, beginCapsuleGuideLoopDrag,
    beginCapsuleGuideDrawStroke, updateCapsuleGuideDrawStroke, finishCapsuleGuideDrawStroke, createScalpFittedCapsuleGuide,
    addGuide, createGuideGeometry, selectGuide, getSelectedGuide, syncGuideInputs, updateGuideGeometry,
    updateGuideControlsVisibility, updateViewportToolVisibility,
    setScalpGuideVisibility, setGuideViewMode, cycleGuideViewMode, updateGuideViewToggle,
    showGuideViewContextMenu, hideGuideViewContextMenu, setCapsuleGuideEditing, autoShowScalpGuideForActiveTool,
    renderGuideOutliner, applyCapsuleGuideDisplayVisibility, applyCurveLatticeGuideDisplayVisibility, applyOtherGuideDisplayVisibility,
    createStrandsFromCurveLattice, // ← strand-bridge 若随批迁出（§6.1）
  };
}
```

**app.js 接线点**：
- `import { createGuideSystemApi } from "./modules/geometry/guide-system.js?v=<date>";`
- 在 store/对象初始化完成后（`guideSurfaceGroup`/`guides`/`locks`/DOM 引用齐备处，约 L2600-2870 之后）调用 `const guideApi = createGuideSystemApi({...})`；
- §4 的 176 处外部调用点改为 `guideApi.xxx(...)`（顶层事件绑定直接改；函数内调用改形参或闭包引用）；
- `transformControls` 顶层监听（L630-1028）里对 handle 的分派改调 `guideApi.begin/update/...`；
- 删除被迁函数定义后，确认无残留顶层 `const/let` 引用（`guideSurfaceGroup` 等仍在 app.js 创建，仅注入）。

**验证**：不跑 verify-smoke（本次只读分析）；实际迁出批次需 verify-smoke 13/13 回归 + 手测 guide 创建/编辑/loop/strand 生成。
