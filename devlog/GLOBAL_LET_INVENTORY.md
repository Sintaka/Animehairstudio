# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **139** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| sculpt/edit | 53 | `drawStrandStroke`(137) `taperCurveEdit`(120) `viewportEditMode`(66) `sweepProfileEdit`(49) `viewPlaneMoveDrag`(45) |
| (unclassified) | 33 | `curveSurfaceDraft`(53) `duplicatePlacement`(35) `loftSurfaceDraft`(26) `proceduralDuplicatePreview`(17) `sideNamingPerspective`(12) |
| scalp | 32 | `scalpBuilderCurveLattice`(73) `scalpBuilderEditing`(58) `scalpPaintEditing`(29) `scalpShapeEditing`(24) `customScalpSurfaceMesh`(18) |
| selection/outliner | 20 | `activeTool`(207) `selectionMarqueeDrag`(22) `selectedSurfaceObjectAnchorId`(15) `capsuleGuideLoopSelection`(13) `layerColorShiftsEnabled`(12) |
| camera/viewport | 1 | `camera`(68) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2120 | 207 | 108 | 99 | 36472 | selection/outliner |
| `drawStrandStroke` | 2187 | 137 | 133 | 4 | 35836 | sculpt/edit |
| `taperCurveEdit` | 2261 | 120 | 117 | 3 | 31203 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2147 | 73 | 71 | 2 | 35911 | scalp |
| `camera` | 475 | 68 | 63 | 5 | 38157 | camera/viewport |
| `viewportEditMode` | 2371 | 66 | 16 | 50 | 36190 | sculpt/edit |
| `scalpBuilderEditing` | 2140 | 58 | 53 | 5 | 36156 | scalp |
| `curveSurfaceDraft` | 2192 | 53 | 50 | 3 | 36189 | (unclassified) |
| `sweepProfileEdit` | 2260 | 49 | 46 | 3 | 30853 | sculpt/edit |
| `viewPlaneMoveDrag` | 2253 | 45 | 41 | 4 | 35769 | sculpt/edit |
| `capsuleGuideEditing` | 2141 | 39 | 30 | 9 | 36196 | sculpt/edit |
| `mirrorXEditing` | 2133 | 37 | 36 | 1 | 33927 | sculpt/edit |
| `placeEdit` | 2186 | 35 | 31 | 4 | 36208 | sculpt/edit |
| `duplicatePlacement` | 2372 | 35 | 28 | 7 | 35645 | (unclassified) |
| `activeHandleEdit` | 2124 | 29 | 9 | 20 | 34549 | sculpt/edit |
| `scalpPaintEditing` | 2138 | 29 | 26 | 3 | 36163 | scalp |
| `branchRegionCanvasDrag` | 22697 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2134 | 28 | 26 | 2 | 35522 | sculpt/edit |
| `headSetupEditing` | 2139 | 27 | 17 | 10 | 33420 | sculpt/edit |
| `loftSurfaceDraft` | 2191 | 26 | 23 | 3 | 35834 | (unclassified) |
| `scalpShapeEditing` | 2136 | 24 | 21 | 3 | 36191 | scalp |
| `proportionalSizeEdit` | 2199 | 23 | 21 | 2 | 36055 | sculpt/edit |
| `selectionMarqueeDrag` | 2173 | 22 | 14 | 8 | 36300 | selection/outliner |
| `relaxEdit` | 2185 | 22 | 19 | 3 | 34309 | sculpt/edit |
| `viewSnapDrag` | 2250 | 22 | 19 | 3 | 36366 | sculpt/edit |
| `proportionalHotkeyPress` | 2200 | 21 | 16 | 5 | 36054 | sculpt/edit |
| `customScalpSurfaceMesh` | 1620 | 18 | 15 | 3 | 31958 | scalp |
| `editedScalpSurfaceMesh` | 1625 | 18 | 16 | 2 | 19637 | scalp |
| `scalpBuilderStep` | 2144 | 18 | 16 | 2 | 3855 | scalp |
| `proceduralDuplicatePreview` | 2375 | 17 | 9 | 8 | 29832 | (unclassified) |
| `transformDragging` | 2126 | 16 | 12 | 4 | 35892 | sculpt/edit |
| `hierarchyEditing` | 2132 | 16 | 14 | 2 | 33918 | sculpt/edit |
| `selectedSurfaceObjectAnchorId` | 2183 | 15 | 4 | 11 | 34487 | selection/outliner |
| `scalpRegionAssignments` | 1479 | 14 | 13 | 1 | 19787 | scalp |
| `scalpBuilderEditedPoints` | 2149 | 14 | 8 | 6 | 17196 | scalp |
| `altOrbitDrag` | 2174 | 14 | 10 | 4 | 36442 | sculpt/edit |
| `branchRegionEdit` | 22696 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `scalpGuideSource` | 1619 | 13 | 4 | 9 | 31963 | scalp |
| `capsuleGuideLoopSelection` | 2142 | 13 | 8 | 5 | 8869 | selection/outliner |
| `scalpBuilderPlane` | 2146 | 13 | 10 | 3 | 3878 | scalp |
| `scalpLatticeDrag` | 2180 | 13 | 11 | 2 | 35839 | scalp |
| `polyBrushStroke` | 2189 | 13 | 7 | 6 | 33650 | sculpt/edit |
| `panelSplitDrag` | 2193 | 13 | 10 | 3 | 35833 | sculpt/edit |
| `objectSpaceEditing` | 2131 | 12 | 11 | 1 | 35951 | sculpt/edit |
| `layerColorShiftsEnabled` | 2222 | 12 | 10 | 2 | 32813 | selection/outliner |
| `sideNamingPerspective` | 2236 | 12 | 10 | 2 | 36482 | (unclassified) |
| `brushSizeDrag` | 2247 | 12 | 8 | 4 | 34935 | sculpt/edit |
| `strandWidthEdgeDrag` | 2248 | 12 | 8 | 4 | 35714 | sculpt/edit |
| `outlinerContextTarget` | 2369 | 12 | 5 | 7 | 30301 | selection/outliner |
| `toolRadialGesture` | 2370 | 12 | 9 | 3 | 33507 | (unclassified) |
| `scalpVisibleQuads` | 1481 | 11 | 10 | 1 | 18818 | scalp |
| `editedScalpRegions` | 1628 | 11 | 7 | 4 | 19635 | scalp |
| `capsuleGuideLoopDrag` | 2143 | 11 | 7 | 4 | 35884 | sculpt/edit |
| `houdiniZoomDrag` | 2177 | 11 | 8 | 3 | 24312 | sculpt/edit |
| `toolTipsEnabled` | 2214 | 11 | 9 | 2 | 32817 | (unclassified) |
| `compactToolButtonsEnabled` | 2215 | 11 | 9 | 2 | 32817 | (unclassified) |
| `outlinerFolderColorsEnabled` | 2223 | 11 | 9 | 2 | 32813 | selection/outliner |
| `scalpLatticeEditing` | 2137 | 10 | 8 | 2 | 36173 | scalp |
| `capsuleGuideDrawStroke` | 2188 | 10 | 6 | 4 | 35836 | sculpt/edit |
| `toolShortcutPress` | 2201 | 10 | 6 | 4 | 28443 | (unclassified) |
| `branchSweepStartDrag` | 23191 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `customScalpRegions` | 1623 | 9 | 6 | 3 | 19637 | scalp |
| `editedScalpSurfaceWire` | 1626 | 9 | 8 | 1 | 4428 | scalp |
| `scheduledTaperCurveEditFrame` | 17277 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22818 | 9 | 7 | 2 | 89 | sculpt/edit |
| `transformScaleDrag` | 686 | 8 | 5 | 3 | 32120 | sculpt/edit |
| `importedScalpGuideAsset` | 1624 | 8 | 5 | 3 | 17497 | scalp |
| `scalpGuideVisible` | 2085 | 8 | 5 | 3 | 5784 | scalp |
| `referenceOverlayDrag` | 2118 | 8 | 4 | 4 | 9141 | sculpt/edit |
| `referenceCropDrag` | 2119 | 8 | 4 | 4 | 9140 | sculpt/edit |
| `sculptMoveStroke` | 2122 | 8 | 4 | 4 | 36106 | sculpt/edit |
| `placementPointer` | 2197 | 8 | 5 | 3 | 35997 | (unclassified) |
| `scaleSensitivity` | 2213 | 8 | 7 | 1 | 32817 | (unclassified) |
| `viewPlaneMoveEnabled` | 2251 | 8 | 5 | 3 | 28825 | (unclassified) |
| `taperMeshPointDrag` | 2262 | 8 | 4 | 4 | 31121 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 33964 | 8 | 1 | 7 | 2172 | sculpt/edit |
| `compactOutlinerCollapsed` | 38636 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38637 | 8 | 6 | 2 | 73 | sculpt/edit |
| `customScalpSurfaceWire` | 1621 | 7 | 5 | 2 | 4436 | scalp |
| `uvInspectorDrag` | 2084 | 7 | 4 | 3 | 33632 | sculpt/edit |
| `isolatedStrandIds` | 2097 | 7 | 4 | 3 | 34103 | selection/outliner |
| `lockIndex` | 2114 | 7 | 5 | 2 | 27400 | selection/outliner |
| `activeLatticeMultiEdit` | 2125 | 7 | 2 | 5 | 10454 | sculpt/edit |
| `scalpPaintDrag` | 2168 | 7 | 5 | 2 | 35852 | scalp |
| `activeScalpRegion` | 2169 | 7 | 2 | 5 | 31482 | scalp |
| `clumpUpdateInProgress` | 2195 | 7 | 1 | 6 | 25690 | (unclassified) |
| `viewPlaneNormalMoveHeld` | 2252 | 7 | 5 | 2 | 10257 | (unclassified) |
| `pullMoveEnabled` | 2254 | 7 | 5 | 2 | 28823 | (unclassified) |
| `branchRegionPanDrag` | 22819 | 7 | 5 | 2 | 89 | sculpt/edit |
| `scalpManualRegionQuads` | 1480 | 6 | 4 | 2 | 17922 | scalp |
| `sculptBrushGeometryFrame` | 2129 | 6 | 3 | 3 | 25778 | sculpt/edit |
| `pointRemovalCandidate` | 2176 | 6 | 0 | 6 | 35990 | (unclassified) |
| `selectionSetsOpen` | 2363 | 6 | 3 | 3 | 29792 | selection/outliner |
| `activeOutlinerTab` | 2368 | 6 | 0 | 6 | 5355 | selection/outliner |
| `toolRadialActions` | 2734 | 6 | 5 | 1 | 28326 | (unclassified) |
| `customScalpSelectionOutline` | 1622 | 5 | 3 | 2 | 4436 | selection/outliner |
| `editedScalpSelectionOutline` | 1627 | 5 | 4 | 1 | 4428 | selection/outliner |
| `referenceScaleDrag` | 2117 | 5 | 3 | 2 | -1269 | sculpt/edit |
| `activeScalpBuilderCurveLatticeEdit` | 2148 | 5 | 1 | 4 | 3830 | scalp |
| `selectPointerCapture` | 2179 | 5 | 2 | 3 | 24242 | selection/outliner |
| `brushSizeHotkeyHeld` | 2249 | 5 | 2 | 3 | 35177 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2373 | 5 | 1 | 4 | 29436 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2374 | 5 | 1 | 4 | 29159 | (unclassified) |
| `groupDefaultsWarningContinuation` | 3079 | 5 | 0 | 5 | 29899 | (unclassified) |
| `taperCurveEditInteractiveDirty` | 17278 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 33965 | 5 | 1 | 4 | 2170 | sculpt/edit |
| `sculptBrushViableLockIds` | 37263 | 5 | 2 | 3 | 46 | sculpt/edit |
| `selectionRemoveHeld` | 689 | 4 | 1 | 3 | 35426 | selection/outliner |
| `sculptBrushShiftSmoothHeld` | 2123 | 4 | 2 | 2 | 8778 | sculpt/edit |
| `scalpBuilderStroke` | 2145 | 4 | 3 | 1 | 35876 | scalp |
| `curvePointInsertionCandidate` | 2178 | 4 | 0 | 4 | 35987 | (unclassified) |
| `activeCapsuleGuideEdit` | 2194 | 4 | 2 | 2 | 7700 | sculpt/edit |
| `pullRigidity` | 2256 | 4 | 3 | 1 | 31623 | (unclassified) |
| `rebuildingProceduralDuplicatePreview` | 2376 | 4 | 2 | 2 | 29185 | (unclassified) |
| `groupDefaultsWarningAcknowledged` | 3078 | 4 | 3 | 1 | 29890 | (unclassified) |
| `uniformScaleDrag` | 685 | 3 | 0 | 3 | 32033 | sculpt/edit |
| `transformPrecisionDrag` | 687 | 3 | 0 | 3 | 32087 | sculpt/edit |
| `defaultScalpGeometryData` | 1440 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1454 | 3 | 2 | 1 | 353 | scalp |
| `viewportSelectionMode` | 2121 | 3 | 0 | 3 | 4711 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2150 | 3 | 1 | 2 | 2804 | scalp |
| `scalpBuilderCurveLatticePromise` | 2151 | 3 | 1 | 2 | 2241 | scalp |
| `selectedScalpLatticeIndex` | 2170 | 3 | 0 | 3 | 36149 | selection/outliner |
| `blenderNavigationDrag` | 2175 | 3 | 1 | 2 | 24232 | sculpt/edit |
| `emptySelectionPointer` | 2198 | 3 | 0 | 3 | 35984 | selection/outliner |
| `pendingDroppedApplicationKind` | 2627 | 3 | 0 | 3 | 30911 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2629 | 3 | 1 | 2 | 30910 | (unclassified) |
| `scalpTopologyTemplatePromise` | 4346 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10760 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38602 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1455 | 2 | 1 | 1 | 24519 | scalp |
| `authoredScalpGuideMatrix` | 2068 | 2 | 1 | 1 | 2328 | scalp |
| `proportionalRootLocked` | 2135 | 2 | 1 | 1 | 33644 | sculpt/edit |
| `pullCollisionEnabled` | 2255 | 2 | 1 | 1 | 31627 | (unclassified) |
| `lastHorizontalViewAxis` | 2257 | 2 | 2 | 0 | 34338 | (unclassified) |
| `fpsSampleStart` | 38603 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38604 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2080 | 1 | 0 | 1 | 1467 | (unclassified) |
| `braidSegmentBounds` | 2081 | 1 | 0 | 1 | 1467 | (unclassified) |