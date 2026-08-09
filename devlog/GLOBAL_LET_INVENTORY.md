# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **221** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| sculpt/edit | 53 | `drawStrandStroke`(137) `taperCurveEdit`(120) `viewportEditMode`(66) `sweepProfileEdit`(49) `viewPlaneMoveDrag`(45) |
| (unclassified) | 33 | `curveSurfaceDraft`(53) `duplicatePlacement`(35) `loftSurfaceDraft`(26) `proceduralDuplicatePreview`(17) `sideNamingPerspective`(12) |
| scalp | 32 | `scalpBuilderCurveLattice`(73) `scalpBuilderEditing`(58) `scalpPaintEditing`(29) `scalpShapeEditing`(24) `customScalpSurfaceMesh`(18) |
| selection/outliner | 20 | `activeTool`(207) `selectionMarqueeDrag`(22) `selectedSurfaceObjectAnchorId`(15) `capsuleGuideLoopSelection`(13) `layerColorShiftsEnabled`(12) |
| hair/mesh | 20 | `strandRadialGesture`(14) `drawStrandMode`(13) `defaultHairShader`(12) `twistCurveAllStrandsPreviewEnabled`(11) `activeHairMaterialId`(9) |
| save/project | 17 | `customCreationPresets`(16) `customShapePresets`(11) `sweepProfileMirrorEnabled`(8) `pendingCreationPresetType`(7) `pendingShapePresetSave`(6) |
| camera/viewport | 13 | `camera`(67) `navigationStyle`(31) `viewportBackgroundColor`(21) `activeViewportPointer`(16) `cameraSmoothingEnabled`(13) |
| guide/curve | 10 | `guideModel`(42) `controlPointDisplaySize`(14) `capsuleGuidesVisible`(12) `curveLatticeGuidesVisible`(11) `hoveredControlPoint`(9) |
| ui/panel | 7 | `preferencesOpenSnapshot`(21) `radialMenusEnabled`(15) `shiftSnappedViewActive`(7) `panelSplitSnapWarningContinuation`(5) `viewPlaneMoveSnappedOnly`(4) |
| draw/poly | 6 | `proceduralDrawExperimentalEnabled`(16) `activeCustomDrawClumpTemplate`(9) `polyAltDeleteCandidate`(5) `polyShiftPreviewHeld`(5) `polyFillPreviewGroup`(3) |
| head/body | 3 | `importedHeadAsset`(9) `enterHeadSetupAfterHeadImport`(4) `enterHeadSetupAfterFullBodyImport`(4) |
| gizmo/transform | 3 | `transformPrecisionHeld`(6) `activeSurfaceObjectTransform`(6) `recursiveHierarchyTransforms`(5) |
| undo/history | 2 | `historyShortcutHeld`(7) `restoringHistory`(5) |
| reference | 2 | `referenceImageIndex`(5) `pendingReferenceImageType`(3) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2124 | 207 | 108 | 99 | 36500 | selection/outliner |
| `drawStrandStroke` | 2199 | 137 | 133 | 4 | 35856 | sculpt/edit |
| `taperCurveEdit` | 2289 | 120 | 117 | 3 | 31223 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2159 | 73 | 71 | 2 | 35931 | scalp |
| `camera` | 464 | 67 | 62 | 5 | 38200 | camera/viewport |
| `viewportEditMode` | 2403 | 66 | 16 | 50 | 36190 | sculpt/edit |
| `scalpBuilderEditing` | 2149 | 58 | 53 | 5 | 36179 | scalp |
| `curveSurfaceDraft` | 2207 | 53 | 50 | 3 | 36206 | (unclassified) |
| `sweepProfileEdit` | 2287 | 49 | 46 | 3 | 30874 | sculpt/edit |
| `viewPlaneMoveDrag` | 2280 | 45 | 41 | 4 | 35774 | sculpt/edit |
| `guideModel` | 2061 | 42 | 40 | 2 | 24717 | guide/curve |
| `capsuleGuideEditing` | 2150 | 39 | 30 | 9 | 36219 | sculpt/edit |
| `mirrorXEditing` | 2141 | 37 | 36 | 1 | 33950 | sculpt/edit |
| `placeEdit` | 2198 | 35 | 31 | 4 | 36228 | sculpt/edit |
| `duplicatePlacement` | 2404 | 35 | 28 | 7 | 35645 | (unclassified) |
| `navigationStyle` | 2226 | 31 | 16 | 15 | 34308 | camera/viewport |
| `activeHandleEdit` | 2128 | 29 | 9 | 20 | 34576 | sculpt/edit |
| `scalpPaintEditing` | 2147 | 29 | 26 | 3 | 36186 | scalp |
| `branchRegionCanvasDrag` | 22746 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2143 | 28 | 26 | 2 | 35544 | sculpt/edit |
| `headSetupEditing` | 2148 | 27 | 17 | 10 | 33442 | sculpt/edit |
| `loftSurfaceDraft` | 2206 | 26 | 23 | 3 | 35851 | (unclassified) |
| `scalpShapeEditing` | 2145 | 24 | 21 | 3 | 36214 | scalp |
| `proportionalSizeEdit` | 2216 | 23 | 21 | 2 | 36070 | sculpt/edit |
| `selectionMarqueeDrag` | 2185 | 22 | 14 | 8 | 36320 | selection/outliner |
| `relaxEdit` | 2197 | 22 | 19 | 3 | 34328 | sculpt/edit |
| `viewSnapDrag` | 2274 | 22 | 19 | 3 | 36374 | sculpt/edit |
| `proportionalHotkeyPress` | 2217 | 21 | 16 | 5 | 36069 | sculpt/edit |
| `viewportBackgroundColor` | 2250 | 21 | 15 | 6 | 32819 | camera/viewport |
| `preferencesOpenSnapshot` | 2269 | 21 | 17 | 4 | 28816 | ui/panel |
| `customScalpSurfaceMesh` | 1614 | 18 | 15 | 3 | 32014 | scalp |
| `editedScalpSurfaceMesh` | 1619 | 18 | 16 | 2 | 19692 | scalp |
| `scalpBuilderStep` | 2156 | 18 | 16 | 2 | 3888 | scalp |
| `proceduralDuplicatePreview` | 2407 | 17 | 9 | 8 | 29848 | (unclassified) |
| `transformDragging` | 2133 | 16 | 12 | 4 | 35917 | sculpt/edit |
| `hierarchyEditing` | 2140 | 16 | 14 | 2 | 33941 | sculpt/edit |
| `proceduralDrawExperimentalEnabled` | 2220 | 16 | 13 | 3 | 32836 | draw/poly |
| `activeViewportPointer` | 2275 | 16 | 10 | 6 | 34282 | camera/viewport |
| `customCreationPresets` | 34587 | 16 | 12 | 4 | 274 | save/project |
| `selectedSurfaceObjectAnchorId` | 2195 | 15 | 4 | 11 | 34506 | selection/outliner |
| `radialMenusEnabled` | 2219 | 15 | 13 | 2 | 32836 | ui/panel |
| `scalpRegionAssignments` | 1473 | 14 | 13 | 1 | 19842 | scalp |
| `scalpBuilderEditedPoints` | 2161 | 14 | 8 | 6 | 17233 | scalp |
| `altOrbitDrag` | 2186 | 14 | 10 | 4 | 36462 | sculpt/edit |
| `controlPointDisplaySize` | 2246 | 14 | 13 | 1 | 32822 | guide/curve |
| `strandRadialGesture` | 2401 | 14 | 10 | 4 | 28265 | hair/mesh |
| `branchRegionEdit` | 22745 | 14 | 12 | 2 | 10509 | sculpt/edit |
| `scalpGuideSource` | 1613 | 13 | 4 | 9 | 32019 | scalp |
| `capsuleGuideLoopSelection` | 2152 | 13 | 8 | 5 | 8905 | selection/outliner |
| `scalpBuilderPlane` | 2158 | 13 | 10 | 3 | 3911 | scalp |
| `scalpLatticeDrag` | 2192 | 13 | 11 | 2 | 35859 | scalp |
| `polyBrushStroke` | 2201 | 13 | 7 | 6 | 33669 | sculpt/edit |
| `panelSplitDrag` | 2208 | 13 | 10 | 3 | 35850 | sculpt/edit |
| `drawStrandMode` | 2210 | 13 | 4 | 9 | 32658 | hair/mesh |
| `cameraSmoothingEnabled` | 2230 | 13 | 9 | 4 | 32829 | camera/viewport |
| `cameraSmoothingStrength` | 2231 | 13 | 12 | 1 | 32829 | camera/viewport |
| `viewportStatisticsEnabled` | 2238 | 13 | 11 | 2 | 32826 | camera/viewport |
| `defaultHairShader` | 305 | 12 | 9 | 3 | 34765 | hair/mesh |
| `capsuleGuidesVisible` | 2087 | 12 | 6 | 6 | 33606 | guide/curve |
| `objectSpaceEditing` | 2139 | 12 | 11 | 1 | 35975 | sculpt/edit |
| `layerColorShiftsEnabled` | 2244 | 12 | 10 | 2 | 32822 | selection/outliner |
| `sideNamingPerspective` | 2258 | 12 | 10 | 2 | 36492 | (unclassified) |
| `brushSizeDrag` | 2270 | 12 | 8 | 4 | 34943 | sculpt/edit |
| `strandWidthEdgeDrag` | 2271 | 12 | 8 | 4 | 35722 | sculpt/edit |
| `outlinerContextTarget` | 2399 | 12 | 5 | 7 | 30319 | selection/outliner |
| `toolRadialGesture` | 2402 | 12 | 9 | 3 | 33506 | (unclassified) |
| `scalpVisibleQuads` | 1475 | 11 | 10 | 1 | 18873 | scalp |
| `editedScalpRegions` | 1622 | 11 | 7 | 4 | 19690 | scalp |
| `curveLatticeGuidesVisible` | 2088 | 11 | 5 | 6 | 33610 | guide/curve |
| `capsuleGuideLoopDrag` | 2153 | 11 | 7 | 4 | 35906 | sculpt/edit |
| `houdiniZoomDrag` | 2189 | 11 | 8 | 3 | 24349 | sculpt/edit |
| `navigationTipsEnabled` | 2225 | 11 | 9 | 2 | 32832 | camera/viewport |
| `toolTipsEnabled` | 2236 | 11 | 9 | 2 | 32826 | (unclassified) |
| `compactToolButtonsEnabled` | 2237 | 11 | 9 | 2 | 32826 | (unclassified) |
| `twistCurveAllStrandsPreviewEnabled` | 2239 | 11 | 9 | 2 | 32826 | hair/mesh |
| `outlinerFolderColorsEnabled` | 2245 | 11 | 9 | 2 | 32822 | selection/outliner |
| `customShapePresets` | 16673 | 11 | 7 | 4 | 2389 | save/project |
| `scalpLatticeEditing` | 2146 | 10 | 8 | 2 | 36196 | scalp |
| `capsuleGuideDrawStroke` | 2200 | 10 | 6 | 4 | 35856 | sculpt/edit |
| `toolShortcutPress` | 2218 | 10 | 6 | 4 | 28474 | (unclassified) |
| `branchSweepStartDrag` | 23240 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `orthographicView` | 465 | 9 | 8 | 1 | 35955 | camera/viewport |
| `activeHairMaterialId` | 997 | 9 | 3 | 6 | 31918 | hair/mesh |
| `customScalpRegions` | 1617 | 9 | 6 | 3 | 19692 | scalp |
| `editedScalpSurfaceWire` | 1620 | 9 | 8 | 1 | 4479 | scalp |
| `uvCheckerEnabled` | 2079 | 9 | 8 | 1 | 33639 | hair/mesh |
| `activeCustomDrawClumpTemplate` | 2211 | 9 | 4 | 5 | 32656 | draw/poly |
| `taperMeshPointsVisible` | 2290 | 9 | 7 | 2 | 30995 | hair/mesh |
| `importedHeadAsset` | 3210 | 9 | 2 | 7 | 15939 | head/body |
| `scheduledTaperCurveEditFrame` | 17326 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22867 | 9 | 7 | 2 | 89 | sculpt/edit |
| `hoveredControlPoint` | 38030 | 9 | 6 | 3 | 12 | guide/curve |
| `turntableActive` | 467 | 8 | 7 | 1 | 38181 | camera/viewport |
| `transformScaleDrag` | 679 | 8 | 5 | 3 | 32175 | sculpt/edit |
| `importedScalpGuideAsset` | 1618 | 8 | 5 | 3 | 17552 | scalp |
| `showGroupColors` | 2078 | 8 | 7 | 1 | 33639 | hair/mesh |
| `scalpGuideVisible` | 2084 | 8 | 5 | 3 | 5830 | scalp |
| `referenceOverlayDrag` | 2122 | 8 | 4 | 4 | 9183 | sculpt/edit |
| `referenceCropDrag` | 2123 | 8 | 4 | 4 | 9182 | sculpt/edit |
| `sculptMoveStroke` | 2126 | 8 | 4 | 4 | 36134 | sculpt/edit |
| `activeCapsuleGuideLoopTransform` | 2154 | 8 | 0 | 8 | 8465 | guide/curve |
| `placementPointer` | 2214 | 8 | 5 | 3 | 36012 | (unclassified) |
| `scaleSensitivity` | 2235 | 8 | 7 | 1 | 32826 | (unclassified) |
| `viewPlaneMoveEnabled` | 2277 | 8 | 5 | 3 | 28847 | (unclassified) |
| `sweepProfileMirrorEnabled` | 2288 | 8 | 7 | 1 | 30825 | save/project |
| `taperMeshPointDrag` | 2291 | 8 | 4 | 4 | 31140 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 34014 | 8 | 1 | 7 | 2153 | sculpt/edit |
| `compactOutlinerCollapsed` | 38668 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38669 | 8 | 6 | 2 | 73 | sculpt/edit |
| `orthographicHalfHeight` | 466 | 7 | 3 | 4 | 10306 | camera/viewport |
| `customScalpSurfaceWire` | 1615 | 7 | 5 | 2 | 4487 | scalp |
| `hairTopologyVisible` | 2077 | 7 | 5 | 2 | 34357 | hair/mesh |
| `uvInspectorDrag` | 2083 | 7 | 4 | 3 | 33664 | sculpt/edit |
| `isolatedStrandIds` | 2100 | 7 | 4 | 3 | 34131 | selection/outliner |
| `lockIndex` | 2117 | 7 | 5 | 2 | 27445 | selection/outliner |
| `activeStrandObjectTransform` | 2130 | 7 | 2 | 5 | 9744 | hair/mesh |
| `activeLatticeMultiEdit` | 2132 | 7 | 2 | 5 | 10493 | sculpt/edit |
| `scalpPaintDrag` | 2180 | 7 | 5 | 2 | 35872 | scalp |
| `activeScalpRegion` | 2181 | 7 | 2 | 5 | 31520 | scalp |
| `clumpUpdateInProgress` | 2212 | 7 | 1 | 6 | 25722 | (unclassified) |
| `shiftSnappedViewActive` | 2276 | 7 | 1 | 6 | 34313 | ui/panel |
| `viewPlaneNormalMoveHeld` | 2279 | 7 | 5 | 2 | 10276 | (unclassified) |
| `pullMoveEnabled` | 2281 | 7 | 5 | 2 | 28844 | (unclassified) |
| `historyShortcutHeld` | 2410 | 7 | 2 | 5 | 35872 | undo/history |
| `strandRadialActions` | 2763 | 7 | 6 | 1 | 27674 | hair/mesh |
| `branchRegionPanDrag` | 22868 | 7 | 5 | 2 | 89 | sculpt/edit |
| `pendingCreationPresetType` | 34749 | 7 | 0 | 7 | 198 | save/project |
| `transformPrecisionHeld` | 681 | 6 | 3 | 3 | 35464 | gizmo/transform |
| `scalpManualRegionQuads` | 1474 | 6 | 4 | 2 | 17977 | scalp |
| `activeSurfaceObjectTransform` | 2129 | 6 | 2 | 4 | 34072 | gizmo/transform |
| `pendingLockGeometryFrame` | 2135 | 6 | 2 | 4 | 25860 | hair/mesh |
| `sculptBrushGeometryFrame` | 2137 | 6 | 3 | 3 | 25819 | sculpt/edit |
| `pointRemovalCandidate` | 2188 | 6 | 0 | 6 | 36010 | (unclassified) |
| `hoveredStrandWidthEdge` | 2272 | 6 | 1 | 5 | 35714 | hair/mesh |
| `selectionSetsOpen` | 2393 | 6 | 3 | 3 | 29810 | selection/outliner |
| `activeOutlinerTab` | 2398 | 6 | 0 | 6 | 5370 | selection/outliner |
| `toolRadialActions` | 2768 | 6 | 5 | 1 | 28340 | (unclassified) |
| `pendingShapePresetSave` | 16674 | 6 | 0 | 6 | 18275 | save/project |
| `pendingShapePresetRemoval` | 16675 | 6 | 1 | 5 | 18280 | save/project |
| `pendingCreationPresetRemoval` | 34750 | 6 | 1 | 5 | 204 | save/project |
| `customScalpSelectionOutline` | 1616 | 5 | 3 | 2 | 4487 | selection/outliner |
| `editedScalpSelectionOutline` | 1621 | 5 | 4 | 1 | 4479 | selection/outliner |
| `headMeshVisible` | 2096 | 5 | 1 | 4 | 33607 | hair/mesh |
| `bodyMeshVisible` | 2097 | 5 | 2 | 3 | 33611 | hair/mesh |
| `referenceImageIndex` | 2118 | 5 | 3 | 2 | 17236 | reference |
| `referenceScaleDrag` | 2121 | 5 | 3 | 2 | -1281 | sculpt/edit |
| `activeGuideObjectTransform` | 2131 | 5 | 0 | 5 | 9454 | guide/curve |
| `recursiveHierarchyTransforms` | 2142 | 5 | 4 | 1 | 32836 | gizmo/transform |
| `activeScalpBuilderCurveLatticeEdit` | 2160 | 5 | 1 | 4 | 3863 | scalp |
| `selectPointerCapture` | 2191 | 5 | 2 | 3 | 24279 | selection/outliner |
| `polyAltDeleteCandidate` | 2202 | 5 | 0 | 5 | 35994 | draw/poly |
| `polyShiftPreviewHeld` | 2205 | 5 | 1 | 4 | 33946 | draw/poly |
| `brushSizeHotkeyHeld` | 2273 | 5 | 2 | 3 | 35184 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2405 | 5 | 1 | 4 | 29452 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2406 | 5 | 1 | 4 | 29175 | (unclassified) |
| `restoringHistory` | 2409 | 5 | 1 | 4 | 17184 | undo/history |
| `groupDefaultsWarningContinuation` | 3113 | 5 | 0 | 5 | 29913 | (unclassified) |
| `panelSplitSnapWarningContinuation` | 3118 | 5 | 0 | 5 | 31174 | ui/panel |
| `taperCurveEditInteractiveDirty` | 17327 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 34015 | 5 | 1 | 4 | 2151 | sculpt/edit |
| `pendingClumpPresetGuideId` | 34751 | 5 | 1 | 4 | 197 | guide/curve |
| `sculptBrushViableLockIds` | 37294 | 5 | 2 | 3 | 46 | sculpt/edit |
| `turntableSpeed` | 468 | 4 | 3 | 1 | 38184 | camera/viewport |
| `selectionRemoveHeld` | 682 | 4 | 1 | 3 | 35464 | selection/outliner |
| `hairMaterialIndex` | 996 | 4 | 2 | 2 | 18367 | hair/mesh |
| `sculptBrushShiftSmoothHeld` | 2127 | 4 | 2 | 2 | 8820 | sculpt/edit |
| `capsuleGuideLoopHover` | 2151 | 4 | 1 | 3 | 8218 | guide/curve |
| `curveLatticeLoopHover` | 2155 | 4 | 3 | 1 | 6755 | guide/curve |
| `scalpBuilderStroke` | 2157 | 4 | 3 | 1 | 35896 | scalp |
| `curvePointInsertionCandidate` | 2190 | 4 | 0 | 4 | 36007 | (unclassified) |
| `activeCapsuleGuideEdit` | 2209 | 4 | 2 | 2 | 7730 | sculpt/edit |
| `viewPlaneMoveSnappedOnly` | 2278 | 4 | 2 | 2 | 10135 | ui/panel |
| `pullRigidity` | 2283 | 4 | 3 | 1 | 31646 | (unclassified) |
| `branchRegionMeshPointsVisible` | 2343 | 4 | 2 | 2 | 30924 | hair/mesh |
| `rebuildingProceduralDuplicatePreview` | 2408 | 4 | 2 | 2 | 29201 | (unclassified) |
| `inputUndoCaptured` | 2411 | 4 | 1 | 3 | 30014 | ui/panel |
| `groupDefaultsWarningAcknowledged` | 3112 | 4 | 3 | 1 | 29904 | (unclassified) |
| `activePresetFilter` | 3201 | 4 | 1 | 3 | 30441 | save/project |
| `currentProjectName` | 3202 | 4 | 0 | 4 | 16754 | save/project |
| `viewportFrameCycleStep` | 10805 | 4 | 0 | 4 | 26 | camera/viewport |
| `enterHeadSetupAfterHeadImport` | 33589 | 4 | 0 | 4 | 14 | head/body |
| `enterHeadSetupAfterFullBodyImport` | 33590 | 4 | 0 | 4 | 29 | head/body |
| `uniformScaleDrag` | 678 | 3 | 0 | 3 | 32088 | sculpt/edit |
| `transformPrecisionDrag` | 680 | 3 | 0 | 3 | 32142 | sculpt/edit |
| `defaultScalpGeometryData` | 1434 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1448 | 3 | 2 | 1 | 353 | scalp |
| `uvInspectorDirty` | 2081 | 3 | 1 | 2 | 26106 | hair/mesh |
| `pendingReferenceImageType` | 2120 | 3 | 0 | 3 | 33284 | reference |
| `viewportSelectionMode` | 2125 | 3 | 0 | 3 | 4752 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2162 | 3 | 1 | 2 | 2837 | scalp |
| `scalpBuilderCurveLatticePromise` | 2163 | 3 | 1 | 2 | 2274 | scalp |
| `selectedScalpLatticeIndex` | 2182 | 3 | 0 | 3 | 36169 | selection/outliner |
| `blenderNavigationDrag` | 2187 | 3 | 1 | 2 | 24269 | sculpt/edit |
| `polyFillPreviewGroup` | 2203 | 3 | 1 | 2 | 19440 | draw/poly |
| `emptySelectionPointer` | 2215 | 3 | 0 | 3 | 35999 | selection/outliner |
| `strandRadialTargetId` | 2400 | 3 | 0 | 3 | 28159 | hair/mesh |
| `pendingDroppedApplicationFile` | 2661 | 3 | 0 | 3 | 30924 | save/project |
| `pendingDroppedApplicationKind` | 2662 | 3 | 0 | 3 | 30924 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2663 | 3 | 1 | 2 | 30924 | (unclassified) |
| `quickSaveFileHandle` | 3204 | 3 | 0 | 3 | 15976 | save/project |
| `quickSaveFileName` | 3205 | 3 | 0 | 3 | 15976 | save/project |
| `scalpTopologyTemplatePromise` | 4391 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10806 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38634 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1449 | 2 | 1 | 1 | 24574 | scalp |
| `authoredScalpGuideMatrix` | 2062 | 2 | 1 | 1 | 2379 | scalp |
| `uvCheckerTexture` | 2080 | 2 | 0 | 2 | 26167 | hair/mesh |
| `proportionalRootLocked` | 2144 | 2 | 1 | 1 | 33666 | sculpt/edit |
| `polyFillPreviewCandidate` | 2204 | 2 | 0 | 2 | 19480 | draw/poly |
| `pullCollisionEnabled` | 2282 | 2 | 1 | 1 | 31650 | (unclassified) |
| `lastHorizontalViewAxis` | 2284 | 2 | 2 | 0 | 34342 | (unclassified) |
| `panelSplitSnapWarningAcknowledged` | 3117 | 2 | 1 | 1 | 31173 | ui/panel |
| `projectSaveInProgress` | 3203 | 2 | 0 | 2 | 15912 | save/project |
| `lastExport` | 3206 | 2 | 0 | 2 | 15911 | save/project |
| `quickExportFileHandle` | 3207 | 2 | 0 | 2 | 15912 | save/project |
| `quickExportInProgress` | 3208 | 2 | 0 | 2 | 15913 | save/project |
| `pendingFileAction` | 3209 | 2 | 0 | 2 | 15914 | save/project |
| `fpsSampleStart` | 38635 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38636 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2074 | 1 | 0 | 1 | 1518 | (unclassified) |
| `braidSegmentBounds` | 2075 | 1 | 0 | 1 | 1518 | (unclassified) |