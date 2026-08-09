# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **156** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| sculpt/edit | 53 | `drawStrandStroke`(137) `taperCurveEdit`(120) `viewportEditMode`(66) `sweepProfileEdit`(49) `viewPlaneMoveDrag`(45) |
| (unclassified) | 33 | `curveSurfaceDraft`(53) `duplicatePlacement`(35) `loftSurfaceDraft`(26) `proceduralDuplicatePreview`(17) `sideNamingPerspective`(12) |
| scalp | 32 | `scalpBuilderCurveLattice`(73) `scalpBuilderEditing`(58) `scalpPaintEditing`(29) `scalpShapeEditing`(24) `customScalpSurfaceMesh`(18) |
| selection/outliner | 20 | `activeTool`(207) `selectionMarqueeDrag`(22) `selectedSurfaceObjectAnchorId`(15) `capsuleGuideLoopSelection`(13) `layerColorShiftsEnabled`(12) |
| save/project | 17 | `customCreationPresets`(16) `customShapePresets`(11) `sweepProfileMirrorEnabled`(8) `pendingCreationPresetType`(7) `pendingShapePresetSave`(6) |
| camera/viewport | 1 | `camera`(68) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2119 | 207 | 108 | 99 | 36488 | selection/outliner |
| `drawStrandStroke` | 2186 | 137 | 133 | 4 | 35852 | sculpt/edit |
| `taperCurveEdit` | 2261 | 120 | 117 | 3 | 31215 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2146 | 73 | 71 | 2 | 35927 | scalp |
| `camera` | 474 | 68 | 63 | 5 | 38173 | camera/viewport |
| `viewportEditMode` | 2371 | 66 | 16 | 50 | 36205 | sculpt/edit |
| `scalpBuilderEditing` | 2139 | 58 | 53 | 5 | 36172 | scalp |
| `curveSurfaceDraft` | 2191 | 53 | 50 | 3 | 36205 | (unclassified) |
| `sweepProfileEdit` | 2259 | 49 | 46 | 3 | 30866 | sculpt/edit |
| `viewPlaneMoveDrag` | 2252 | 45 | 41 | 4 | 35785 | sculpt/edit |
| `capsuleGuideEditing` | 2140 | 39 | 30 | 9 | 36212 | sculpt/edit |
| `mirrorXEditing` | 2132 | 37 | 36 | 1 | 33943 | sculpt/edit |
| `placeEdit` | 2185 | 35 | 31 | 4 | 36224 | sculpt/edit |
| `duplicatePlacement` | 2372 | 35 | 28 | 7 | 35660 | (unclassified) |
| `activeHandleEdit` | 2123 | 29 | 9 | 20 | 34565 | sculpt/edit |
| `scalpPaintEditing` | 2137 | 29 | 26 | 3 | 36179 | scalp |
| `branchRegionCanvasDrag` | 22709 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2133 | 28 | 26 | 2 | 35538 | sculpt/edit |
| `headSetupEditing` | 2138 | 27 | 17 | 10 | 33436 | sculpt/edit |
| `loftSurfaceDraft` | 2190 | 26 | 23 | 3 | 35850 | (unclassified) |
| `scalpShapeEditing` | 2135 | 24 | 21 | 3 | 36207 | scalp |
| `proportionalSizeEdit` | 2198 | 23 | 21 | 2 | 36071 | sculpt/edit |
| `selectionMarqueeDrag` | 2172 | 22 | 14 | 8 | 36316 | selection/outliner |
| `relaxEdit` | 2184 | 22 | 19 | 3 | 34325 | sculpt/edit |
| `viewSnapDrag` | 2249 | 22 | 19 | 3 | 36382 | sculpt/edit |
| `proportionalHotkeyPress` | 2199 | 21 | 16 | 5 | 36070 | sculpt/edit |
| `customScalpSurfaceMesh` | 1619 | 18 | 15 | 3 | 31971 | scalp |
| `editedScalpSurfaceMesh` | 1624 | 18 | 16 | 2 | 19650 | scalp |
| `scalpBuilderStep` | 2143 | 18 | 16 | 2 | 3865 | scalp |
| `proceduralDuplicatePreview` | 2375 | 17 | 9 | 8 | 29844 | (unclassified) |
| `transformDragging` | 2125 | 16 | 12 | 4 | 35908 | sculpt/edit |
| `hierarchyEditing` | 2131 | 16 | 14 | 2 | 33934 | sculpt/edit |
| `customCreationPresets` | 34549 | 16 | 12 | 4 | 273 | save/project |
| `selectedSurfaceObjectAnchorId` | 2182 | 15 | 4 | 11 | 34503 | selection/outliner |
| `scalpRegionAssignments` | 1478 | 14 | 13 | 1 | 19800 | scalp |
| `scalpBuilderEditedPoints` | 2148 | 14 | 8 | 6 | 17209 | scalp |
| `altOrbitDrag` | 2173 | 14 | 10 | 4 | 36458 | sculpt/edit |
| `branchRegionEdit` | 22708 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `scalpGuideSource` | 1618 | 13 | 4 | 9 | 31976 | scalp |
| `capsuleGuideLoopSelection` | 2141 | 13 | 8 | 5 | 8879 | selection/outliner |
| `scalpBuilderPlane` | 2145 | 13 | 10 | 3 | 3888 | scalp |
| `scalpLatticeDrag` | 2179 | 13 | 11 | 2 | 35855 | scalp |
| `polyBrushStroke` | 2188 | 13 | 7 | 6 | 33666 | sculpt/edit |
| `panelSplitDrag` | 2192 | 13 | 10 | 3 | 35849 | sculpt/edit |
| `objectSpaceEditing` | 2130 | 12 | 11 | 1 | 35967 | sculpt/edit |
| `layerColorShiftsEnabled` | 2221 | 12 | 10 | 2 | 32829 | selection/outliner |
| `sideNamingPerspective` | 2235 | 12 | 10 | 2 | 36498 | (unclassified) |
| `brushSizeDrag` | 2246 | 12 | 8 | 4 | 34951 | sculpt/edit |
| `strandWidthEdgeDrag` | 2247 | 12 | 8 | 4 | 35730 | sculpt/edit |
| `outlinerContextTarget` | 2369 | 12 | 5 | 7 | 30313 | selection/outliner |
| `toolRadialGesture` | 2370 | 12 | 9 | 3 | 33522 | (unclassified) |
| `scalpVisibleQuads` | 1480 | 11 | 10 | 1 | 18831 | scalp |
| `editedScalpRegions` | 1627 | 11 | 7 | 4 | 19648 | scalp |
| `capsuleGuideLoopDrag` | 2142 | 11 | 7 | 4 | 35900 | sculpt/edit |
| `houdiniZoomDrag` | 2176 | 11 | 8 | 3 | 24325 | sculpt/edit |
| `toolTipsEnabled` | 2213 | 11 | 9 | 2 | 32833 | (unclassified) |
| `compactToolButtonsEnabled` | 2214 | 11 | 9 | 2 | 32833 | (unclassified) |
| `outlinerFolderColorsEnabled` | 2222 | 11 | 9 | 2 | 32829 | selection/outliner |
| `customShapePresets` | 16636 | 11 | 7 | 4 | 2389 | save/project |
| `scalpLatticeEditing` | 2136 | 10 | 8 | 2 | 36189 | scalp |
| `capsuleGuideDrawStroke` | 2187 | 10 | 6 | 4 | 35852 | sculpt/edit |
| `toolShortcutPress` | 2200 | 10 | 6 | 4 | 28456 | (unclassified) |
| `branchSweepStartDrag` | 23203 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `customScalpRegions` | 1622 | 9 | 6 | 3 | 19650 | scalp |
| `editedScalpSurfaceWire` | 1625 | 9 | 8 | 1 | 4438 | scalp |
| `scheduledTaperCurveEditFrame` | 17289 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22830 | 9 | 7 | 2 | 89 | sculpt/edit |
| `transformScaleDrag` | 685 | 8 | 5 | 3 | 32133 | sculpt/edit |
| `importedScalpGuideAsset` | 1623 | 8 | 5 | 3 | 17510 | scalp |
| `scalpGuideVisible` | 2084 | 8 | 5 | 3 | 5794 | scalp |
| `referenceOverlayDrag` | 2117 | 8 | 4 | 4 | 9151 | sculpt/edit |
| `referenceCropDrag` | 2118 | 8 | 4 | 4 | 9150 | sculpt/edit |
| `sculptMoveStroke` | 2121 | 8 | 4 | 4 | 36122 | sculpt/edit |
| `placementPointer` | 2196 | 8 | 5 | 3 | 36013 | (unclassified) |
| `scaleSensitivity` | 2212 | 8 | 7 | 1 | 32833 | (unclassified) |
| `viewPlaneMoveEnabled` | 2250 | 8 | 5 | 3 | 28838 | (unclassified) |
| `sweepProfileMirrorEnabled` | 2260 | 8 | 7 | 1 | 30817 | save/project |
| `taperMeshPointDrag` | 2262 | 8 | 4 | 4 | 31133 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 33976 | 8 | 1 | 7 | 2175 | sculpt/edit |
| `compactOutlinerCollapsed` | 38651 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38652 | 8 | 6 | 2 | 73 | sculpt/edit |
| `customScalpSurfaceWire` | 1620 | 7 | 5 | 2 | 4446 | scalp |
| `uvInspectorDrag` | 2083 | 7 | 4 | 3 | 33648 | sculpt/edit |
| `isolatedStrandIds` | 2096 | 7 | 4 | 3 | 34119 | selection/outliner |
| `lockIndex` | 2113 | 7 | 5 | 2 | 27413 | selection/outliner |
| `activeLatticeMultiEdit` | 2124 | 7 | 2 | 5 | 10464 | sculpt/edit |
| `scalpPaintDrag` | 2167 | 7 | 5 | 2 | 35868 | scalp |
| `activeScalpRegion` | 2168 | 7 | 2 | 5 | 31495 | scalp |
| `clumpUpdateInProgress` | 2194 | 7 | 1 | 6 | 25703 | (unclassified) |
| `viewPlaneNormalMoveHeld` | 2251 | 7 | 5 | 2 | 10267 | (unclassified) |
| `pullMoveEnabled` | 2253 | 7 | 5 | 2 | 28836 | (unclassified) |
| `branchRegionPanDrag` | 22831 | 7 | 5 | 2 | 89 | sculpt/edit |
| `pendingCreationPresetType` | 34711 | 7 | 0 | 7 | 197 | save/project |
| `scalpManualRegionQuads` | 1479 | 6 | 4 | 2 | 17935 | scalp |
| `sculptBrushGeometryFrame` | 2128 | 6 | 3 | 3 | 25791 | sculpt/edit |
| `pointRemovalCandidate` | 2175 | 6 | 0 | 6 | 36006 | (unclassified) |
| `selectionSetsOpen` | 2363 | 6 | 3 | 3 | 29804 | selection/outliner |
| `activeOutlinerTab` | 2368 | 6 | 0 | 6 | 5364 | selection/outliner |
| `toolRadialActions` | 2734 | 6 | 5 | 1 | 28338 | (unclassified) |
| `pendingShapePresetSave` | 16637 | 6 | 0 | 6 | 18273 | save/project |
| `pendingShapePresetRemoval` | 16638 | 6 | 1 | 5 | 18278 | save/project |
| `pendingCreationPresetRemoval` | 34712 | 6 | 1 | 5 | 203 | save/project |
| `customScalpSelectionOutline` | 1621 | 5 | 3 | 2 | 4446 | selection/outliner |
| `editedScalpSelectionOutline` | 1626 | 5 | 4 | 1 | 4438 | selection/outliner |
| `referenceScaleDrag` | 2116 | 5 | 3 | 2 | -1269 | sculpt/edit |
| `activeScalpBuilderCurveLatticeEdit` | 2147 | 5 | 1 | 4 | 3840 | scalp |
| `selectPointerCapture` | 2178 | 5 | 2 | 3 | 24255 | selection/outliner |
| `brushSizeHotkeyHeld` | 2248 | 5 | 2 | 3 | 35193 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2373 | 5 | 1 | 4 | 29448 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2374 | 5 | 1 | 4 | 29171 | (unclassified) |
| `groupDefaultsWarningContinuation` | 3079 | 5 | 0 | 5 | 29911 | (unclassified) |
| `taperCurveEditInteractiveDirty` | 17290 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 33977 | 5 | 1 | 4 | 2173 | sculpt/edit |
| `sculptBrushViableLockIds` | 37278 | 5 | 2 | 3 | 46 | sculpt/edit |
| `selectionRemoveHeld` | 688 | 4 | 1 | 3 | 35442 | selection/outliner |
| `sculptBrushShiftSmoothHeld` | 2122 | 4 | 2 | 2 | 8788 | sculpt/edit |
| `scalpBuilderStroke` | 2144 | 4 | 3 | 1 | 35892 | scalp |
| `curvePointInsertionCandidate` | 2177 | 4 | 0 | 4 | 36003 | (unclassified) |
| `activeCapsuleGuideEdit` | 2193 | 4 | 2 | 2 | 7710 | sculpt/edit |
| `pullRigidity` | 2255 | 4 | 3 | 1 | 31636 | (unclassified) |
| `rebuildingProceduralDuplicatePreview` | 2376 | 4 | 2 | 2 | 29197 | (unclassified) |
| `groupDefaultsWarningAcknowledged` | 3078 | 4 | 3 | 1 | 29902 | (unclassified) |
| `activePresetFilter` | 3165 | 4 | 1 | 3 | 30439 | save/project |
| `currentProjectName` | 3166 | 4 | 0 | 4 | 16753 | save/project |
| `uniformScaleDrag` | 684 | 3 | 0 | 3 | 32046 | sculpt/edit |
| `transformPrecisionDrag` | 686 | 3 | 0 | 3 | 32100 | sculpt/edit |
| `defaultScalpGeometryData` | 1439 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1453 | 3 | 2 | 1 | 353 | scalp |
| `viewportSelectionMode` | 2120 | 3 | 0 | 3 | 4721 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2149 | 3 | 1 | 2 | 2814 | scalp |
| `scalpBuilderCurveLatticePromise` | 2150 | 3 | 1 | 2 | 2251 | scalp |
| `selectedScalpLatticeIndex` | 2169 | 3 | 0 | 3 | 36165 | selection/outliner |
| `blenderNavigationDrag` | 2174 | 3 | 1 | 2 | 24245 | sculpt/edit |
| `emptySelectionPointer` | 2197 | 3 | 0 | 3 | 36000 | selection/outliner |
| `pendingDroppedApplicationFile` | 2627 | 3 | 0 | 3 | 30922 | save/project |
| `pendingDroppedApplicationKind` | 2628 | 3 | 0 | 3 | 30922 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2629 | 3 | 1 | 2 | 30922 | (unclassified) |
| `quickSaveFileHandle` | 3168 | 3 | 0 | 3 | 15975 | save/project |
| `quickSaveFileName` | 3169 | 3 | 0 | 3 | 15975 | save/project |
| `scalpTopologyTemplatePromise` | 4355 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10769 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38617 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1454 | 2 | 1 | 1 | 24532 | scalp |
| `authoredScalpGuideMatrix` | 2067 | 2 | 1 | 1 | 2338 | scalp |
| `proportionalRootLocked` | 2134 | 2 | 1 | 1 | 33660 | sculpt/edit |
| `pullCollisionEnabled` | 2254 | 2 | 1 | 1 | 31640 | (unclassified) |
| `lastHorizontalViewAxis` | 2256 | 2 | 2 | 0 | 34354 | (unclassified) |
| `projectSaveInProgress` | 3167 | 2 | 0 | 2 | 15911 | save/project |
| `lastExport` | 3170 | 2 | 0 | 2 | 15910 | save/project |
| `quickExportFileHandle` | 3171 | 2 | 0 | 2 | 15911 | save/project |
| `quickExportInProgress` | 3172 | 2 | 0 | 2 | 15912 | save/project |
| `pendingFileAction` | 3173 | 2 | 0 | 2 | 15913 | save/project |
| `fpsSampleStart` | 38618 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38619 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2079 | 1 | 0 | 1 | 1477 | (unclassified) |
| `braidSegmentBounds` | 2080 | 1 | 0 | 1 | 1477 | (unclassified) |