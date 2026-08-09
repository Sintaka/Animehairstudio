# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **206** 个顶层 `let`（app.js 全局可变状态）。
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
| head/body | 3 | `importedHeadAsset`(9) `enterHeadSetupAfterHeadImport`(4) `enterHeadSetupAfterFullBodyImport`(4) |
| gizmo/transform | 3 | `transformPrecisionHeld`(6) `activeSurfaceObjectTransform`(6) `recursiveHierarchyTransforms`(5) |
| undo/history | 2 | `historyShortcutHeld`(7) `restoringHistory`(5) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2126 | 207 | 108 | 99 | 36509 | selection/outliner |
| `drawStrandStroke` | 2201 | 137 | 133 | 4 | 35865 | sculpt/edit |
| `taperCurveEdit` | 2279 | 120 | 117 | 3 | 31221 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2161 | 73 | 71 | 2 | 35940 | scalp |
| `camera` | 467 | 67 | 62 | 5 | 38208 | camera/viewport |
| `viewportEditMode` | 2393 | 66 | 16 | 50 | 36211 | sculpt/edit |
| `scalpBuilderEditing` | 2151 | 58 | 53 | 5 | 36188 | scalp |
| `curveSurfaceDraft` | 2206 | 53 | 50 | 3 | 36218 | (unclassified) |
| `sweepProfileEdit` | 2277 | 49 | 46 | 3 | 30872 | sculpt/edit |
| `viewPlaneMoveDrag` | 2270 | 45 | 41 | 4 | 35795 | sculpt/edit |
| `guideModel` | 2064 | 42 | 40 | 2 | 24701 | guide/curve |
| `capsuleGuideEditing` | 2152 | 39 | 30 | 9 | 36228 | sculpt/edit |
| `mirrorXEditing` | 2143 | 37 | 36 | 1 | 33959 | sculpt/edit |
| `placeEdit` | 2200 | 35 | 31 | 4 | 36237 | sculpt/edit |
| `duplicatePlacement` | 2394 | 35 | 28 | 7 | 35666 | (unclassified) |
| `navigationStyle` | 2219 | 31 | 16 | 15 | 34326 | camera/viewport |
| `activeHandleEdit` | 2130 | 29 | 9 | 20 | 34585 | sculpt/edit |
| `scalpPaintEditing` | 2149 | 29 | 26 | 3 | 36195 | scalp |
| `branchRegionCanvasDrag` | 22733 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2145 | 28 | 26 | 2 | 35553 | sculpt/edit |
| `headSetupEditing` | 2150 | 27 | 17 | 10 | 33451 | sculpt/edit |
| `loftSurfaceDraft` | 2205 | 26 | 23 | 3 | 35863 | (unclassified) |
| `scalpShapeEditing` | 2147 | 24 | 21 | 3 | 36223 | scalp |
| `proportionalSizeEdit` | 2214 | 23 | 21 | 2 | 36083 | sculpt/edit |
| `selectionMarqueeDrag` | 2187 | 22 | 14 | 8 | 36329 | selection/outliner |
| `relaxEdit` | 2199 | 22 | 19 | 3 | 34337 | sculpt/edit |
| `viewSnapDrag` | 2266 | 22 | 19 | 3 | 36393 | sculpt/edit |
| `proportionalHotkeyPress` | 2215 | 21 | 16 | 5 | 36082 | sculpt/edit |
| `viewportBackgroundColor` | 2243 | 21 | 15 | 6 | 32837 | camera/viewport |
| `customScalpSurfaceMesh` | 1617 | 18 | 15 | 3 | 31999 | scalp |
| `editedScalpSurfaceMesh` | 1622 | 18 | 16 | 2 | 19676 | scalp |
| `scalpBuilderStep` | 2158 | 18 | 16 | 2 | 3873 | scalp |
| `proceduralDuplicatePreview` | 2397 | 17 | 9 | 8 | 29846 | (unclassified) |
| `transformDragging` | 2135 | 16 | 12 | 4 | 35926 | sculpt/edit |
| `hierarchyEditing` | 2142 | 16 | 14 | 2 | 33950 | sculpt/edit |
| `activeViewportPointer` | 2267 | 16 | 10 | 6 | 34301 | camera/viewport |
| `customCreationPresets` | 34575 | 16 | 12 | 4 | 274 | save/project |
| `selectedSurfaceObjectAnchorId` | 2197 | 15 | 4 | 11 | 34515 | selection/outliner |
| `scalpRegionAssignments` | 1476 | 14 | 13 | 1 | 19826 | scalp |
| `scalpBuilderEditedPoints` | 2163 | 14 | 8 | 6 | 17218 | scalp |
| `altOrbitDrag` | 2188 | 14 | 10 | 4 | 36471 | sculpt/edit |
| `controlPointDisplaySize` | 2239 | 14 | 13 | 1 | 32840 | guide/curve |
| `strandRadialGesture` | 2391 | 14 | 10 | 4 | 28263 | hair/mesh |
| `branchRegionEdit` | 22732 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `scalpGuideSource` | 1616 | 13 | 4 | 9 | 32004 | scalp |
| `capsuleGuideLoopSelection` | 2154 | 13 | 8 | 5 | 8890 | selection/outliner |
| `scalpBuilderPlane` | 2160 | 13 | 10 | 3 | 3896 | scalp |
| `scalpLatticeDrag` | 2194 | 13 | 11 | 2 | 35868 | scalp |
| `polyBrushStroke` | 2203 | 13 | 7 | 6 | 33678 | sculpt/edit |
| `panelSplitDrag` | 2207 | 13 | 10 | 3 | 35862 | sculpt/edit |
| `drawStrandMode` | 2209 | 13 | 4 | 9 | 32647 | hair/mesh |
| `cameraSmoothingEnabled` | 2223 | 13 | 9 | 4 | 32847 | camera/viewport |
| `cameraSmoothingStrength` | 2224 | 13 | 12 | 1 | 32847 | camera/viewport |
| `viewportStatisticsEnabled` | 2231 | 13 | 11 | 2 | 32844 | camera/viewport |
| `defaultHairShader` | 308 | 12 | 9 | 3 | 34773 | hair/mesh |
| `capsuleGuidesVisible` | 2090 | 12 | 6 | 6 | 33614 | guide/curve |
| `objectSpaceEditing` | 2141 | 12 | 11 | 1 | 35984 | sculpt/edit |
| `layerColorShiftsEnabled` | 2237 | 12 | 10 | 2 | 32840 | selection/outliner |
| `sideNamingPerspective` | 2251 | 12 | 10 | 2 | 36510 | (unclassified) |
| `brushSizeDrag` | 2262 | 12 | 8 | 4 | 34962 | sculpt/edit |
| `strandWidthEdgeDrag` | 2263 | 12 | 8 | 4 | 35741 | sculpt/edit |
| `outlinerContextTarget` | 2389 | 12 | 5 | 7 | 30317 | selection/outliner |
| `toolRadialGesture` | 2392 | 12 | 9 | 3 | 33527 | (unclassified) |
| `scalpVisibleQuads` | 1478 | 11 | 10 | 1 | 18857 | scalp |
| `editedScalpRegions` | 1625 | 11 | 7 | 4 | 19674 | scalp |
| `curveLatticeGuidesVisible` | 2091 | 11 | 5 | 6 | 33618 | guide/curve |
| `capsuleGuideLoopDrag` | 2155 | 11 | 7 | 4 | 35915 | sculpt/edit |
| `houdiniZoomDrag` | 2191 | 11 | 8 | 3 | 24334 | sculpt/edit |
| `navigationTipsEnabled` | 2218 | 11 | 9 | 2 | 32850 | camera/viewport |
| `toolTipsEnabled` | 2229 | 11 | 9 | 2 | 32844 | (unclassified) |
| `compactToolButtonsEnabled` | 2230 | 11 | 9 | 2 | 32844 | (unclassified) |
| `twistCurveAllStrandsPreviewEnabled` | 2232 | 11 | 9 | 2 | 32844 | hair/mesh |
| `outlinerFolderColorsEnabled` | 2238 | 11 | 9 | 2 | 32840 | selection/outliner |
| `customShapePresets` | 16660 | 11 | 7 | 4 | 2389 | save/project |
| `scalpLatticeEditing` | 2148 | 10 | 8 | 2 | 36205 | scalp |
| `capsuleGuideDrawStroke` | 2202 | 10 | 6 | 4 | 35865 | sculpt/edit |
| `toolShortcutPress` | 2216 | 10 | 6 | 4 | 28464 | (unclassified) |
| `branchSweepStartDrag` | 23227 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `orthographicView` | 468 | 9 | 8 | 1 | 35963 | camera/viewport |
| `activeHairMaterialId` | 1000 | 9 | 3 | 6 | 31903 | hair/mesh |
| `customScalpRegions` | 1620 | 9 | 6 | 3 | 19676 | scalp |
| `editedScalpSurfaceWire` | 1623 | 9 | 8 | 1 | 4463 | scalp |
| `uvCheckerEnabled` | 2082 | 9 | 8 | 1 | 33647 | hair/mesh |
| `taperMeshPointsVisible` | 2280 | 9 | 7 | 2 | 30993 | hair/mesh |
| `importedHeadAsset` | 3197 | 9 | 2 | 7 | 15939 | head/body |
| `scheduledTaperCurveEditFrame` | 17313 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22854 | 9 | 7 | 2 | 89 | sculpt/edit |
| `hoveredControlPoint` | 38041 | 9 | 6 | 3 | 12 | guide/curve |
| `turntableActive` | 470 | 8 | 7 | 1 | 38189 | camera/viewport |
| `transformScaleDrag` | 682 | 8 | 5 | 3 | 32160 | sculpt/edit |
| `importedScalpGuideAsset` | 1621 | 8 | 5 | 3 | 17536 | scalp |
| `showGroupColors` | 2081 | 8 | 7 | 1 | 33647 | hair/mesh |
| `scalpGuideVisible` | 2087 | 8 | 5 | 3 | 5814 | scalp |
| `referenceOverlayDrag` | 2124 | 8 | 4 | 4 | 9168 | sculpt/edit |
| `referenceCropDrag` | 2125 | 8 | 4 | 4 | 9167 | sculpt/edit |
| `sculptMoveStroke` | 2128 | 8 | 4 | 4 | 36143 | sculpt/edit |
| `activeCapsuleGuideLoopTransform` | 2156 | 8 | 0 | 8 | 8450 | guide/curve |
| `placementPointer` | 2212 | 8 | 5 | 3 | 36025 | (unclassified) |
| `scaleSensitivity` | 2228 | 8 | 7 | 1 | 32844 | (unclassified) |
| `viewPlaneMoveEnabled` | 2268 | 8 | 5 | 3 | 28844 | (unclassified) |
| `sweepProfileMirrorEnabled` | 2278 | 8 | 7 | 1 | 30823 | save/project |
| `taperMeshPointDrag` | 2281 | 8 | 4 | 4 | 31138 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 34002 | 8 | 1 | 7 | 2176 | sculpt/edit |
| `compactOutlinerCollapsed` | 38679 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38680 | 8 | 6 | 2 | 73 | sculpt/edit |
| `orthographicHalfHeight` | 469 | 7 | 3 | 4 | 10290 | camera/viewport |
| `customScalpSurfaceWire` | 1618 | 7 | 5 | 2 | 4471 | scalp |
| `hairTopologyVisible` | 2080 | 7 | 5 | 2 | 34365 | hair/mesh |
| `uvInspectorDrag` | 2086 | 7 | 4 | 3 | 33672 | sculpt/edit |
| `isolatedStrandIds` | 2103 | 7 | 4 | 3 | 34139 | selection/outliner |
| `lockIndex` | 2120 | 7 | 5 | 2 | 27430 | selection/outliner |
| `activeStrandObjectTransform` | 2132 | 7 | 2 | 5 | 9729 | hair/mesh |
| `activeLatticeMultiEdit` | 2134 | 7 | 2 | 5 | 10478 | sculpt/edit |
| `scalpPaintDrag` | 2182 | 7 | 5 | 2 | 35881 | scalp |
| `activeScalpRegion` | 2183 | 7 | 2 | 5 | 31506 | scalp |
| `clumpUpdateInProgress` | 2210 | 7 | 1 | 6 | 25711 | (unclassified) |
| `viewPlaneNormalMoveHeld` | 2269 | 7 | 5 | 2 | 10273 | (unclassified) |
| `pullMoveEnabled` | 2271 | 7 | 5 | 2 | 28842 | (unclassified) |
| `historyShortcutHeld` | 2400 | 7 | 2 | 5 | 35893 | undo/history |
| `strandRadialActions` | 2752 | 7 | 6 | 1 | 27673 | hair/mesh |
| `branchRegionPanDrag` | 22855 | 7 | 5 | 2 | 89 | sculpt/edit |
| `pendingCreationPresetType` | 34737 | 7 | 0 | 7 | 198 | save/project |
| `transformPrecisionHeld` | 684 | 6 | 3 | 3 | 35472 | gizmo/transform |
| `scalpManualRegionQuads` | 1477 | 6 | 4 | 2 | 17961 | scalp |
| `activeSurfaceObjectTransform` | 2131 | 6 | 2 | 4 | 34081 | gizmo/transform |
| `pendingLockGeometryFrame` | 2137 | 6 | 2 | 4 | 25845 | hair/mesh |
| `sculptBrushGeometryFrame` | 2139 | 6 | 3 | 3 | 25804 | sculpt/edit |
| `pointRemovalCandidate` | 2190 | 6 | 0 | 6 | 36019 | (unclassified) |
| `hoveredStrandWidthEdge` | 2264 | 6 | 1 | 5 | 35733 | hair/mesh |
| `selectionSetsOpen` | 2383 | 6 | 3 | 3 | 29808 | selection/outliner |
| `activeOutlinerTab` | 2388 | 6 | 0 | 6 | 5367 | selection/outliner |
| `toolRadialActions` | 2757 | 6 | 5 | 1 | 28339 | (unclassified) |
| `pendingShapePresetSave` | 16661 | 6 | 0 | 6 | 18276 | save/project |
| `pendingShapePresetRemoval` | 16662 | 6 | 1 | 5 | 18281 | save/project |
| `pendingCreationPresetRemoval` | 34738 | 6 | 1 | 5 | 204 | save/project |
| `customScalpSelectionOutline` | 1619 | 5 | 3 | 2 | 4471 | selection/outliner |
| `editedScalpSelectionOutline` | 1624 | 5 | 4 | 1 | 4463 | selection/outliner |
| `headMeshVisible` | 2099 | 5 | 1 | 4 | 33615 | hair/mesh |
| `bodyMeshVisible` | 2100 | 5 | 2 | 3 | 33619 | hair/mesh |
| `referenceScaleDrag` | 2123 | 5 | 3 | 2 | -1280 | sculpt/edit |
| `activeGuideObjectTransform` | 2133 | 5 | 0 | 5 | 9439 | guide/curve |
| `recursiveHierarchyTransforms` | 2144 | 5 | 4 | 1 | 32822 | gizmo/transform |
| `activeScalpBuilderCurveLatticeEdit` | 2162 | 5 | 1 | 4 | 3848 | scalp |
| `selectPointerCapture` | 2193 | 5 | 2 | 3 | 24264 | selection/outliner |
| `brushSizeHotkeyHeld` | 2265 | 5 | 2 | 3 | 35203 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2395 | 5 | 1 | 4 | 29450 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2396 | 5 | 1 | 4 | 29173 | (unclassified) |
| `restoringHistory` | 2399 | 5 | 1 | 4 | 17181 | undo/history |
| `groupDefaultsWarningContinuation` | 3102 | 5 | 0 | 5 | 29912 | (unclassified) |
| `taperCurveEditInteractiveDirty` | 17314 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 34003 | 5 | 1 | 4 | 2174 | sculpt/edit |
| `pendingClumpPresetGuideId` | 34739 | 5 | 1 | 4 | 197 | guide/curve |
| `sculptBrushViableLockIds` | 37305 | 5 | 2 | 3 | 46 | sculpt/edit |
| `turntableSpeed` | 471 | 4 | 3 | 1 | 38192 | camera/viewport |
| `selectionRemoveHeld` | 685 | 4 | 1 | 3 | 35472 | selection/outliner |
| `hairMaterialIndex` | 999 | 4 | 2 | 2 | 18351 | hair/mesh |
| `sculptBrushShiftSmoothHeld` | 2129 | 4 | 2 | 2 | 8805 | sculpt/edit |
| `capsuleGuideLoopHover` | 2153 | 4 | 1 | 3 | 8203 | guide/curve |
| `curveLatticeLoopHover` | 2157 | 4 | 3 | 1 | 6740 | guide/curve |
| `scalpBuilderStroke` | 2159 | 4 | 3 | 1 | 35905 | scalp |
| `curvePointInsertionCandidate` | 2192 | 4 | 0 | 4 | 36016 | (unclassified) |
| `activeCapsuleGuideEdit` | 2208 | 4 | 2 | 2 | 7718 | sculpt/edit |
| `pullRigidity` | 2273 | 4 | 3 | 1 | 31644 | (unclassified) |
| `branchRegionMeshPointsVisible` | 2333 | 4 | 2 | 2 | 30922 | hair/mesh |
| `rebuildingProceduralDuplicatePreview` | 2398 | 4 | 2 | 2 | 29199 | (unclassified) |
| `groupDefaultsWarningAcknowledged` | 3101 | 4 | 3 | 1 | 29903 | (unclassified) |
| `activePresetFilter` | 3188 | 4 | 1 | 3 | 30442 | save/project |
| `currentProjectName` | 3189 | 4 | 0 | 4 | 16754 | save/project |
| `viewportFrameCycleStep` | 10792 | 4 | 0 | 4 | 26 | camera/viewport |
| `enterHeadSetupAfterHeadImport` | 33577 | 4 | 0 | 4 | 14 | head/body |
| `enterHeadSetupAfterFullBodyImport` | 33578 | 4 | 0 | 4 | 29 | head/body |
| `uniformScaleDrag` | 681 | 3 | 0 | 3 | 32073 | sculpt/edit |
| `transformPrecisionDrag` | 683 | 3 | 0 | 3 | 32127 | sculpt/edit |
| `defaultScalpGeometryData` | 1437 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1451 | 3 | 2 | 1 | 353 | scalp |
| `uvInspectorDirty` | 2084 | 3 | 1 | 2 | 26090 | hair/mesh |
| `viewportSelectionMode` | 2127 | 3 | 0 | 3 | 4737 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2164 | 3 | 1 | 2 | 2822 | scalp |
| `scalpBuilderCurveLatticePromise` | 2165 | 3 | 1 | 2 | 2259 | scalp |
| `selectedScalpLatticeIndex` | 2184 | 3 | 0 | 3 | 36178 | selection/outliner |
| `blenderNavigationDrag` | 2189 | 3 | 1 | 2 | 24254 | sculpt/edit |
| `emptySelectionPointer` | 2213 | 3 | 0 | 3 | 36012 | selection/outliner |
| `strandRadialTargetId` | 2390 | 3 | 0 | 3 | 28157 | hair/mesh |
| `pendingDroppedApplicationFile` | 2650 | 3 | 0 | 3 | 30923 | save/project |
| `pendingDroppedApplicationKind` | 2651 | 3 | 0 | 3 | 30923 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2652 | 3 | 1 | 2 | 30923 | (unclassified) |
| `quickSaveFileHandle` | 3191 | 3 | 0 | 3 | 15976 | save/project |
| `quickSaveFileName` | 3192 | 3 | 0 | 3 | 15976 | save/project |
| `scalpTopologyTemplatePromise` | 4378 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10793 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38645 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1452 | 2 | 1 | 1 | 24558 | scalp |
| `authoredScalpGuideMatrix` | 2065 | 2 | 1 | 1 | 2363 | scalp |
| `uvCheckerTexture` | 2083 | 2 | 0 | 2 | 26151 | hair/mesh |
| `proportionalRootLocked` | 2146 | 2 | 1 | 1 | 33675 | sculpt/edit |
| `pullCollisionEnabled` | 2272 | 2 | 1 | 1 | 31648 | (unclassified) |
| `lastHorizontalViewAxis` | 2274 | 2 | 2 | 0 | 34363 | (unclassified) |
| `projectSaveInProgress` | 3190 | 2 | 0 | 2 | 15912 | save/project |
| `lastExport` | 3193 | 2 | 0 | 2 | 15911 | save/project |
| `quickExportFileHandle` | 3194 | 2 | 0 | 2 | 15912 | save/project |
| `quickExportInProgress` | 3195 | 2 | 0 | 2 | 15913 | save/project |
| `pendingFileAction` | 3196 | 2 | 0 | 2 | 15914 | save/project |
| `fpsSampleStart` | 38646 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38647 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2077 | 1 | 0 | 1 | 1502 | (unclassified) |
| `braidSegmentBounds` | 2078 | 1 | 0 | 1 | 1502 | (unclassified) |