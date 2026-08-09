# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **241** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| sculpt/edit | 53 | `drawStrandStroke`(137) `taperCurveEdit`(120) `viewportEditMode`(66) `sweepProfileEdit`(49) `viewPlaneMoveDrag`(45) |
| (unclassified) | 34 | `curveSurfaceDraft`(53) `duplicatePlacement`(35) `loftSurfaceDraft`(26) `proceduralDuplicatePreview`(17) `sideNamingPerspective`(12) |
| scalp | 32 | `scalpBuilderCurveLattice`(73) `scalpBuilderEditing`(58) `scalpPaintEditing`(29) `scalpShapeEditing`(24) `customScalpSurfaceMesh`(18) |
| selection/outliner | 30 | `activeTool`(207) `selectedId`(61) `selectedStrandGroup`(52) `selectedPoint`(42) `selectedGuideId`(36) |
| hair/mesh | 20 | `strandRadialGesture`(14) `drawStrandMode`(13) `defaultHairShader`(12) `twistCurveAllStrandsPreviewEnabled`(11) `activeHairMaterialId`(9) |
| save/project | 17 | `customCreationPresets`(16) `customShapePresets`(11) `sweepProfileMirrorEnabled`(8) `pendingCreationPresetType`(7) `pendingShapePresetSave`(6) |
| camera/viewport | 13 | `camera`(67) `navigationStyle`(31) `viewportBackgroundColor`(21) `activeViewportPointer`(16) `cameraSmoothingEnabled`(13) |
| guide/curve | 11 | `guideModel`(42) `controlPointDisplaySize`(14) `capsuleGuidesVisible`(12) `curveLatticeGuidesVisible`(11) `activeCurveLatticeGuideId`(11) |
| branch/sub | 8 | `branchRegionView`(17) `branchBridgeSmoothStrength`(6) `branchBridgeSmoothDetail`(6) `branchRigidCurvatureBlend`(5) `branchRegionSyncLateral`(5) |
| ui/panel | 7 | `preferencesOpenSnapshot`(21) `radialMenusEnabled`(15) `shiftSnappedViewActive`(7) `panelSplitSnapWarningContinuation`(5) `viewPlaneMoveSnappedOnly`(4) |
| draw/poly | 6 | `proceduralDrawExperimentalEnabled`(16) `activeCustomDrawClumpTemplate`(9) `polyAltDeleteCandidate`(5) `polyShiftPreviewHeld`(5) `polyFillPreviewGroup`(3) |
| head/body | 3 | `importedHeadAsset`(9) `enterHeadSetupAfterHeadImport`(4) `enterHeadSetupAfterFullBodyImport`(4) |
| gizmo/transform | 3 | `transformPrecisionHeld`(6) `activeSurfaceObjectTransform`(6) `recursiveHierarchyTransforms`(5) |
| undo/history | 2 | `historyShortcutHeld`(7) `restoringHistory`(5) |
| reference | 2 | `referenceImageIndex`(5) `pendingReferenceImageType`(3) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2122 | 207 | 108 | 99 | 36535 | selection/outliner |
| `drawStrandStroke` | 2197 | 137 | 133 | 4 | 35891 | sculpt/edit |
| `taperCurveEdit` | 2308 | 120 | 117 | 3 | 31237 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2157 | 73 | 71 | 2 | 35966 | scalp |
| `camera` | 462 | 67 | 62 | 5 | 38235 | camera/viewport |
| `viewportEditMode` | 2422 | 66 | 16 | 50 | 36204 | sculpt/edit |
| `selectedId` | 2096 | 61 | 53 | 8 | 36552 | selection/outliner |
| `scalpBuilderEditing` | 2147 | 58 | 53 | 5 | 36214 | scalp |
| `curveSurfaceDraft` | 2205 | 53 | 50 | 3 | 36241 | (unclassified) |
| `selectedStrandGroup` | 2194 | 52 | 38 | 14 | 30852 | selection/outliner |
| `sweepProfileEdit` | 2306 | 49 | 46 | 3 | 30888 | sculpt/edit |
| `viewPlaneMoveDrag` | 2299 | 45 | 41 | 4 | 35788 | sculpt/edit |
| `guideModel` | 2059 | 42 | 40 | 2 | 24752 | guide/curve |
| `selectedPoint` | 2191 | 42 | 25 | 17 | 36467 | selection/outliner |
| `capsuleGuideEditing` | 2148 | 39 | 30 | 9 | 36254 | sculpt/edit |
| `mirrorXEditing` | 2139 | 37 | 36 | 1 | 33985 | sculpt/edit |
| `selectedGuideId` | 2113 | 36 | 18 | 18 | 36528 | selection/outliner |
| `placeEdit` | 2196 | 35 | 31 | 4 | 36263 | sculpt/edit |
| `duplicatePlacement` | 2423 | 35 | 28 | 7 | 35659 | (unclassified) |
| `selectedCurveLatticePoint` | 2181 | 34 | 14 | 20 | 34554 | selection/outliner |
| `selectedStrandIds` | 2097 | 33 | 31 | 2 | 34174 | selection/outliner |
| `selectedControlPoints` | 2182 | 33 | 20 | 13 | 36389 | selection/outliner |
| `navigationStyle` | 2225 | 31 | 16 | 15 | 34342 | camera/viewport |
| `activeHandleEdit` | 2126 | 29 | 9 | 20 | 34611 | sculpt/edit |
| `scalpPaintEditing` | 2145 | 29 | 26 | 3 | 36221 | scalp |
| `branchRegionCanvasDrag` | 22778 | 29 | 22 | 7 | 483 | sculpt/edit |
| `proportionalEditing` | 2141 | 28 | 26 | 2 | 35579 | sculpt/edit |
| `headSetupEditing` | 2146 | 27 | 17 | 10 | 33477 | sculpt/edit |
| `loftSurfaceDraft` | 2204 | 26 | 23 | 3 | 35886 | (unclassified) |
| `scalpShapeEditing` | 2143 | 24 | 21 | 3 | 36249 | scalp |
| `proportionalSizeEdit` | 2215 | 23 | 21 | 2 | 36104 | sculpt/edit |
| `selectionMarqueeDrag` | 2183 | 22 | 14 | 8 | 36355 | selection/outliner |
| `relaxEdit` | 2195 | 22 | 19 | 3 | 34363 | sculpt/edit |
| `viewSnapDrag` | 2293 | 22 | 19 | 3 | 36388 | sculpt/edit |
| `proportionalHotkeyPress` | 2216 | 21 | 16 | 5 | 36103 | sculpt/edit |
| `viewportBackgroundColor` | 2249 | 21 | 15 | 6 | 32853 | camera/viewport |
| `preferencesOpenSnapshot` | 2288 | 21 | 17 | 4 | 28830 | ui/panel |
| `clumpViewportSelection` | 2112 | 19 | 9 | 10 | 34880 | selection/outliner |
| `selectedReferenceImageId` | 2117 | 19 | 10 | 9 | 27691 | selection/outliner |
| `customScalpSurfaceMesh` | 1612 | 18 | 15 | 3 | 32049 | scalp |
| `editedScalpSurfaceMesh` | 1617 | 18 | 16 | 2 | 19726 | scalp |
| `scalpBuilderStep` | 2154 | 18 | 16 | 2 | 3909 | scalp |
| `proceduralDuplicatePreview` | 2426 | 17 | 9 | 8 | 29862 | (unclassified) |
| `branchRegionView` | 22899 | 17 | 13 | 4 | 107 | branch/sub |
| `transformDragging` | 2131 | 16 | 12 | 4 | 35952 | sculpt/edit |
| `hierarchyEditing` | 2138 | 16 | 14 | 2 | 33976 | sculpt/edit |
| `selectedCurveSurfaceController` | 2192 | 16 | 8 | 8 | 34075 | selection/outliner |
| `proceduralDrawExperimentalEnabled` | 2219 | 16 | 13 | 3 | 32870 | draw/poly |
| `activeViewportPointer` | 2294 | 16 | 10 | 6 | 34296 | camera/viewport |
| `customCreationPresets` | 34620 | 16 | 12 | 4 | 274 | save/project |
| `selectedSurfaceObjectAnchorId` | 2193 | 15 | 4 | 11 | 34541 | selection/outliner |
| `radialMenusEnabled` | 2218 | 15 | 13 | 2 | 32870 | ui/panel |
| `scalpRegionAssignments` | 1471 | 14 | 13 | 1 | 19876 | scalp |
| `scalpBuilderEditedPoints` | 2159 | 14 | 8 | 6 | 17267 | scalp |
| `altOrbitDrag` | 2184 | 14 | 10 | 4 | 36497 | sculpt/edit |
| `controlPointDisplaySize` | 2245 | 14 | 13 | 1 | 32856 | guide/curve |
| `strandRadialGesture` | 2420 | 14 | 10 | 4 | 28279 | hair/mesh |
| `branchRegionEdit` | 22777 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `scalpGuideSource` | 1611 | 13 | 4 | 9 | 32054 | scalp |
| `capsuleGuideLoopSelection` | 2150 | 13 | 8 | 5 | 8926 | selection/outliner |
| `scalpBuilderPlane` | 2156 | 13 | 10 | 3 | 3932 | scalp |
| `scalpLatticeDrag` | 2190 | 13 | 11 | 2 | 35894 | scalp |
| `polyBrushStroke` | 2199 | 13 | 7 | 6 | 33704 | sculpt/edit |
| `panelSplitDrag` | 2206 | 13 | 10 | 3 | 35885 | sculpt/edit |
| `drawStrandMode` | 2208 | 13 | 4 | 9 | 32693 | hair/mesh |
| `cameraSmoothingEnabled` | 2229 | 13 | 9 | 4 | 32863 | camera/viewport |
| `cameraSmoothingStrength` | 2230 | 13 | 12 | 1 | 32863 | camera/viewport |
| `viewportStatisticsEnabled` | 2237 | 13 | 11 | 2 | 32860 | camera/viewport |
| `defaultHairShader` | 303 | 12 | 9 | 3 | 34800 | hair/mesh |
| `capsuleGuidesVisible` | 2085 | 12 | 6 | 6 | 33641 | guide/curve |
| `objectSpaceEditing` | 2137 | 12 | 11 | 1 | 36010 | sculpt/edit |
| `layerColorShiftsEnabled` | 2243 | 12 | 10 | 2 | 32856 | selection/outliner |
| `sideNamingPerspective` | 2257 | 12 | 10 | 2 | 36526 | (unclassified) |
| `brushSizeDrag` | 2289 | 12 | 8 | 4 | 34957 | sculpt/edit |
| `strandWidthEdgeDrag` | 2290 | 12 | 8 | 4 | 35736 | sculpt/edit |
| `outlinerContextTarget` | 2418 | 12 | 5 | 7 | 30333 | selection/outliner |
| `toolRadialGesture` | 2421 | 12 | 9 | 3 | 33520 | (unclassified) |
| `scalpVisibleQuads` | 1473 | 11 | 10 | 1 | 18907 | scalp |
| `editedScalpRegions` | 1620 | 11 | 7 | 4 | 19724 | scalp |
| `curveLatticeGuidesVisible` | 2086 | 11 | 5 | 6 | 33645 | guide/curve |
| `activeCurveLatticeGuideId` | 2114 | 11 | 3 | 8 | 27670 | guide/curve |
| `capsuleGuideLoopDrag` | 2151 | 11 | 7 | 4 | 35941 | sculpt/edit |
| `houdiniZoomDrag` | 2187 | 11 | 8 | 3 | 24384 | sculpt/edit |
| `navigationTipsEnabled` | 2224 | 11 | 9 | 2 | 32866 | camera/viewport |
| `toolTipsEnabled` | 2235 | 11 | 9 | 2 | 32860 | (unclassified) |
| `compactToolButtonsEnabled` | 2236 | 11 | 9 | 2 | 32860 | (unclassified) |
| `twistCurveAllStrandsPreviewEnabled` | 2238 | 11 | 9 | 2 | 32860 | hair/mesh |
| `outlinerFolderColorsEnabled` | 2244 | 11 | 9 | 2 | 32856 | selection/outliner |
| `pendingPlacedLockId` | 2379 | 11 | 4 | 7 | 36085 | (unclassified) |
| `customShapePresets` | 16692 | 11 | 7 | 4 | 2402 | save/project |
| `scalpLatticeEditing` | 2144 | 10 | 8 | 2 | 36231 | scalp |
| `capsuleGuideDrawStroke` | 2198 | 10 | 6 | 4 | 35891 | sculpt/edit |
| `toolShortcutPress` | 2217 | 10 | 6 | 4 | 28508 | (unclassified) |
| `branchSweepStartDrag` | 23273 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `orthographicView` | 463 | 9 | 8 | 1 | 35990 | camera/viewport |
| `activeHairMaterialId` | 995 | 9 | 3 | 6 | 31953 | hair/mesh |
| `customScalpRegions` | 1615 | 9 | 6 | 3 | 19726 | scalp |
| `editedScalpSurfaceWire` | 1618 | 9 | 8 | 1 | 4500 | scalp |
| `uvCheckerEnabled` | 2077 | 9 | 8 | 1 | 33674 | hair/mesh |
| `activeCustomDrawClumpTemplate` | 2209 | 9 | 4 | 5 | 32691 | draw/poly |
| `taperMeshPointsVisible` | 2309 | 9 | 7 | 2 | 31009 | hair/mesh |
| `importedHeadAsset` | 3229 | 9 | 2 | 7 | 15952 | head/body |
| `scheduledTaperCurveEditFrame` | 17345 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22900 | 9 | 7 | 2 | 89 | sculpt/edit |
| `hoveredControlPoint` | 38063 | 9 | 6 | 3 | 12 | guide/curve |
| `turntableActive` | 465 | 8 | 7 | 1 | 38216 | camera/viewport |
| `transformScaleDrag` | 677 | 8 | 5 | 3 | 32210 | sculpt/edit |
| `importedScalpGuideAsset` | 1616 | 8 | 5 | 3 | 17586 | scalp |
| `showGroupColors` | 2076 | 8 | 7 | 1 | 33674 | hair/mesh |
| `scalpGuideVisible` | 2082 | 8 | 5 | 3 | 5851 | scalp |
| `referenceOverlayDrag` | 2120 | 8 | 4 | 4 | 9204 | sculpt/edit |
| `referenceCropDrag` | 2121 | 8 | 4 | 4 | 9203 | sculpt/edit |
| `sculptMoveStroke` | 2124 | 8 | 4 | 4 | 36169 | sculpt/edit |
| `activeCapsuleGuideLoopTransform` | 2152 | 8 | 0 | 8 | 8486 | guide/curve |
| `placementPointer` | 2213 | 8 | 5 | 3 | 36046 | (unclassified) |
| `scaleSensitivity` | 2234 | 8 | 7 | 1 | 32860 | (unclassified) |
| `viewPlaneMoveEnabled` | 2296 | 8 | 5 | 3 | 28861 | (unclassified) |
| `sweepProfileMirrorEnabled` | 2307 | 8 | 7 | 1 | 30839 | save/project |
| `taperMeshPointDrag` | 2310 | 8 | 4 | 4 | 31154 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 34047 | 8 | 1 | 7 | 2153 | sculpt/edit |
| `compactOutlinerCollapsed` | 38701 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38702 | 8 | 6 | 2 | 73 | sculpt/edit |
| `orthographicHalfHeight` | 464 | 7 | 3 | 4 | 10327 | camera/viewport |
| `customScalpSurfaceWire` | 1613 | 7 | 5 | 2 | 4508 | scalp |
| `hairTopologyVisible` | 2075 | 7 | 5 | 2 | 34392 | hair/mesh |
| `uvInspectorDrag` | 2081 | 7 | 4 | 3 | 33699 | sculpt/edit |
| `isolatedStrandIds` | 2098 | 7 | 4 | 3 | 34166 | selection/outliner |
| `lockIndex` | 2115 | 7 | 5 | 2 | 27480 | selection/outliner |
| `activeStrandObjectTransform` | 2128 | 7 | 2 | 5 | 9765 | hair/mesh |
| `activeLatticeMultiEdit` | 2130 | 7 | 2 | 5 | 10514 | sculpt/edit |
| `scalpPaintDrag` | 2178 | 7 | 5 | 2 | 35907 | scalp |
| `activeScalpRegion` | 2179 | 7 | 2 | 5 | 31555 | scalp |
| `clumpUpdateInProgress` | 2210 | 7 | 1 | 6 | 25757 | (unclassified) |
| `shiftSnappedViewActive` | 2295 | 7 | 1 | 6 | 34327 | ui/panel |
| `viewPlaneNormalMoveHeld` | 2298 | 7 | 5 | 2 | 10276 | (unclassified) |
| `pullMoveEnabled` | 2300 | 7 | 5 | 2 | 28858 | (unclassified) |
| `historyShortcutHeld` | 2429 | 7 | 2 | 5 | 35886 | undo/history |
| `strandRadialActions` | 2782 | 7 | 6 | 1 | 27688 | hair/mesh |
| `branchRegionPanDrag` | 22901 | 7 | 5 | 2 | 89 | sculpt/edit |
| `pendingCreationPresetType` | 34782 | 7 | 0 | 7 | 198 | save/project |
| `transformPrecisionHeld` | 679 | 6 | 3 | 3 | 35499 | gizmo/transform |
| `scalpManualRegionQuads` | 1472 | 6 | 4 | 2 | 18011 | scalp |
| `activeSurfaceObjectTransform` | 2127 | 6 | 2 | 4 | 34107 | gizmo/transform |
| `pendingLockGeometryFrame` | 2133 | 6 | 2 | 4 | 25895 | hair/mesh |
| `sculptBrushGeometryFrame` | 2135 | 6 | 3 | 3 | 25854 | sculpt/edit |
| `pointRemovalCandidate` | 2186 | 6 | 0 | 6 | 36045 | (unclassified) |
| `branchBridgeSmoothStrength` | 2270 | 6 | 2 | 4 | 32757 | branch/sub |
| `branchBridgeSmoothDetail` | 2274 | 6 | 2 | 4 | 32764 | branch/sub |
| `hoveredStrandWidthEdge` | 2291 | 6 | 1 | 5 | 35728 | hair/mesh |
| `selectionSetsOpen` | 2412 | 6 | 3 | 3 | 29824 | selection/outliner |
| `activeOutlinerTab` | 2417 | 6 | 0 | 6 | 5370 | selection/outliner |
| `toolRadialActions` | 2787 | 6 | 5 | 1 | 28354 | (unclassified) |
| `pendingShapePresetSave` | 16693 | 6 | 0 | 6 | 18289 | save/project |
| `pendingShapePresetRemoval` | 16694 | 6 | 1 | 5 | 18294 | save/project |
| `pendingCreationPresetRemoval` | 34783 | 6 | 1 | 5 | 204 | save/project |
| `customScalpSelectionOutline` | 1614 | 5 | 3 | 2 | 4508 | selection/outliner |
| `editedScalpSelectionOutline` | 1619 | 5 | 4 | 1 | 4500 | selection/outliner |
| `headMeshVisible` | 2094 | 5 | 1 | 4 | 33642 | hair/mesh |
| `bodyMeshVisible` | 2095 | 5 | 2 | 3 | 33646 | hair/mesh |
| `referenceImageIndex` | 2116 | 5 | 3 | 2 | 17270 | reference |
| `referenceScaleDrag` | 2119 | 5 | 3 | 2 | -1281 | sculpt/edit |
| `activeGuideObjectTransform` | 2129 | 5 | 0 | 5 | 9475 | guide/curve |
| `recursiveHierarchyTransforms` | 2140 | 5 | 4 | 1 | 32871 | gizmo/transform |
| `activeScalpBuilderCurveLatticeEdit` | 2158 | 5 | 1 | 4 | 3884 | scalp |
| `selectPointerCapture` | 2189 | 5 | 2 | 3 | 24314 | selection/outliner |
| `polyAltDeleteCandidate` | 2200 | 5 | 0 | 5 | 36029 | draw/poly |
| `polyShiftPreviewHeld` | 2203 | 5 | 1 | 4 | 33981 | draw/poly |
| `branchRigidCurvatureBlend` | 2266 | 5 | 2 | 3 | 32751 | branch/sub |
| `branchRegionSyncLateral` | 2280 | 5 | 1 | 4 | 32765 | branch/sub |
| `branchRegionSyncVertical` | 2284 | 5 | 1 | 4 | 32767 | branch/sub |
| `brushSizeHotkeyHeld` | 2292 | 5 | 2 | 3 | 35198 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2424 | 5 | 1 | 4 | 29466 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2425 | 5 | 1 | 4 | 29189 | (unclassified) |
| `restoringHistory` | 2428 | 5 | 1 | 4 | 17197 | undo/history |
| `groupDefaultsWarningContinuation` | 3132 | 5 | 0 | 5 | 29927 | (unclassified) |
| `panelSplitSnapWarningContinuation` | 3137 | 5 | 0 | 5 | 31188 | ui/panel |
| `taperCurveEditInteractiveDirty` | 17346 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 34048 | 5 | 1 | 4 | 2151 | sculpt/edit |
| `pendingClumpPresetGuideId` | 34784 | 5 | 1 | 4 | 197 | guide/curve |
| `sculptBrushViableLockIds` | 37327 | 5 | 2 | 3 | 46 | sculpt/edit |
| `turntableSpeed` | 466 | 4 | 3 | 1 | 38219 | camera/viewport |
| `selectionRemoveHeld` | 680 | 4 | 1 | 3 | 35499 | selection/outliner |
| `hairMaterialIndex` | 994 | 4 | 2 | 2 | 18401 | hair/mesh |
| `sculptBrushShiftSmoothHeld` | 2125 | 4 | 2 | 2 | 8841 | sculpt/edit |
| `capsuleGuideLoopHover` | 2149 | 4 | 1 | 3 | 8239 | guide/curve |
| `curveLatticeLoopHover` | 2153 | 4 | 3 | 1 | 6776 | guide/curve |
| `scalpBuilderStroke` | 2155 | 4 | 3 | 1 | 35931 | scalp |
| `curvePointInsertionCandidate` | 2188 | 4 | 0 | 4 | 36042 | (unclassified) |
| `activeCapsuleGuideEdit` | 2207 | 4 | 2 | 2 | 7751 | sculpt/edit |
| `viewPlaneMoveSnappedOnly` | 2297 | 4 | 2 | 2 | 10135 | ui/panel |
| `pullRigidity` | 2302 | 4 | 3 | 1 | 31660 | (unclassified) |
| `branchRegionMeshPointsVisible` | 2362 | 4 | 2 | 2 | 30938 | hair/mesh |
| `rebuildingProceduralDuplicatePreview` | 2427 | 4 | 2 | 2 | 29215 | (unclassified) |
| `inputUndoCaptured` | 2430 | 4 | 1 | 3 | 30028 | ui/panel |
| `groupDefaultsWarningAcknowledged` | 3131 | 4 | 3 | 1 | 29918 | (unclassified) |
| `activePresetFilter` | 3220 | 4 | 1 | 3 | 30455 | save/project |
| `currentProjectName` | 3221 | 4 | 0 | 4 | 16767 | save/project |
| `viewportFrameCycleStep` | 10824 | 4 | 0 | 4 | 26 | camera/viewport |
| `enterHeadSetupAfterHeadImport` | 33622 | 4 | 0 | 4 | 14 | head/body |
| `enterHeadSetupAfterFullBodyImport` | 33623 | 4 | 0 | 4 | 29 | head/body |
| `uniformScaleDrag` | 676 | 3 | 0 | 3 | 32123 | sculpt/edit |
| `transformPrecisionDrag` | 678 | 3 | 0 | 3 | 32177 | sculpt/edit |
| `defaultScalpGeometryData` | 1432 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1446 | 3 | 2 | 1 | 353 | scalp |
| `uvInspectorDirty` | 2079 | 3 | 1 | 2 | 26141 | hair/mesh |
| `pendingReferenceImageType` | 2118 | 3 | 0 | 3 | 33319 | reference |
| `viewportSelectionMode` | 2123 | 3 | 0 | 3 | 4773 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2160 | 3 | 1 | 2 | 2858 | scalp |
| `scalpBuilderCurveLatticePromise` | 2161 | 3 | 1 | 2 | 2295 | scalp |
| `selectedScalpLatticeIndex` | 2180 | 3 | 0 | 3 | 36204 | selection/outliner |
| `blenderNavigationDrag` | 2185 | 3 | 1 | 2 | 24304 | sculpt/edit |
| `polyFillPreviewGroup` | 2201 | 3 | 1 | 2 | 19474 | draw/poly |
| `branchUpdateInProgress` | 2211 | 3 | 1 | 2 | 25757 | branch/sub |
| `regionLengthUpdateInProgress` | 2212 | 3 | 1 | 2 | 25700 | branch/sub |
| `emptySelectionPointer` | 2214 | 3 | 0 | 3 | 36033 | selection/outliner |
| `strandRadialTargetId` | 2419 | 3 | 0 | 3 | 28173 | hair/mesh |
| `pendingDroppedApplicationFile` | 2680 | 3 | 0 | 3 | 30938 | save/project |
| `pendingDroppedApplicationKind` | 2681 | 3 | 0 | 3 | 30938 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2682 | 3 | 1 | 2 | 30938 | (unclassified) |
| `quickSaveFileHandle` | 3223 | 3 | 0 | 3 | 15989 | save/project |
| `quickSaveFileName` | 3224 | 3 | 0 | 3 | 15989 | save/project |
| `scalpTopologyTemplatePromise` | 4410 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10825 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38667 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1447 | 2 | 1 | 1 | 24609 | scalp |
| `authoredScalpGuideMatrix` | 2060 | 2 | 1 | 1 | 2400 | scalp |
| `uvCheckerTexture` | 2078 | 2 | 0 | 2 | 26202 | hair/mesh |
| `proportionalRootLocked` | 2142 | 2 | 1 | 1 | 33701 | sculpt/edit |
| `polyFillPreviewCandidate` | 2202 | 2 | 0 | 2 | 19514 | draw/poly |
| `pullCollisionEnabled` | 2301 | 2 | 1 | 1 | 31664 | (unclassified) |
| `lastHorizontalViewAxis` | 2303 | 2 | 2 | 0 | 34356 | (unclassified) |
| `panelSplitSnapWarningAcknowledged` | 3136 | 2 | 1 | 1 | 31187 | ui/panel |
| `projectSaveInProgress` | 3222 | 2 | 0 | 2 | 15925 | save/project |
| `lastExport` | 3225 | 2 | 0 | 2 | 15924 | save/project |
| `quickExportFileHandle` | 3226 | 2 | 0 | 2 | 15925 | save/project |
| `quickExportInProgress` | 3227 | 2 | 0 | 2 | 15926 | save/project |
| `pendingFileAction` | 3228 | 2 | 0 | 2 | 15927 | save/project |
| `fpsSampleStart` | 38668 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38669 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2072 | 1 | 0 | 1 | 1539 | (unclassified) |
| `braidSegmentBounds` | 2073 | 1 | 0 | 1 | 1539 | (unclassified) |