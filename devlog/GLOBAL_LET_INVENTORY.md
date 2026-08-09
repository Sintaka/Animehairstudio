# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **229** 个顶层 `let`（app.js 全局可变状态）。
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
| `activeTool` | 2123 | 207 | 108 | 99 | 36522 | selection/outliner |
| `drawStrandStroke` | 2198 | 137 | 133 | 4 | 35878 | sculpt/edit |
| `taperCurveEdit` | 2309 | 120 | 117 | 3 | 31224 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2158 | 73 | 71 | 2 | 35953 | scalp |
| `camera` | 463 | 67 | 62 | 5 | 38222 | camera/viewport |
| `viewportEditMode` | 2423 | 66 | 16 | 50 | 36191 | sculpt/edit |
| `scalpBuilderEditing` | 2148 | 58 | 53 | 5 | 36201 | scalp |
| `curveSurfaceDraft` | 2206 | 53 | 50 | 3 | 36228 | (unclassified) |
| `sweepProfileEdit` | 2307 | 49 | 46 | 3 | 30875 | sculpt/edit |
| `viewPlaneMoveDrag` | 2300 | 45 | 41 | 4 | 35775 | sculpt/edit |
| `guideModel` | 2060 | 42 | 40 | 2 | 24739 | guide/curve |
| `capsuleGuideEditing` | 2149 | 39 | 30 | 9 | 36241 | sculpt/edit |
| `mirrorXEditing` | 2140 | 37 | 36 | 1 | 33972 | sculpt/edit |
| `placeEdit` | 2197 | 35 | 31 | 4 | 36250 | sculpt/edit |
| `duplicatePlacement` | 2424 | 35 | 28 | 7 | 35646 | (unclassified) |
| `navigationStyle` | 2226 | 31 | 16 | 15 | 34329 | camera/viewport |
| `activeHandleEdit` | 2127 | 29 | 9 | 20 | 34598 | sculpt/edit |
| `scalpPaintEditing` | 2146 | 29 | 26 | 3 | 36208 | scalp |
| `branchRegionCanvasDrag` | 22766 | 29 | 22 | 7 | 483 | sculpt/edit |
| `proportionalEditing` | 2142 | 28 | 26 | 2 | 35566 | sculpt/edit |
| `headSetupEditing` | 2147 | 27 | 17 | 10 | 33464 | sculpt/edit |
| `loftSurfaceDraft` | 2205 | 26 | 23 | 3 | 35873 | (unclassified) |
| `scalpShapeEditing` | 2144 | 24 | 21 | 3 | 36236 | scalp |
| `proportionalSizeEdit` | 2216 | 23 | 21 | 2 | 36091 | sculpt/edit |
| `selectionMarqueeDrag` | 2184 | 22 | 14 | 8 | 36342 | selection/outliner |
| `relaxEdit` | 2196 | 22 | 19 | 3 | 34350 | sculpt/edit |
| `viewSnapDrag` | 2294 | 22 | 19 | 3 | 36375 | sculpt/edit |
| `proportionalHotkeyPress` | 2217 | 21 | 16 | 5 | 36090 | sculpt/edit |
| `viewportBackgroundColor` | 2250 | 21 | 15 | 6 | 32840 | camera/viewport |
| `preferencesOpenSnapshot` | 2289 | 21 | 17 | 4 | 28817 | ui/panel |
| `customScalpSurfaceMesh` | 1613 | 18 | 15 | 3 | 32036 | scalp |
| `editedScalpSurfaceMesh` | 1618 | 18 | 16 | 2 | 19713 | scalp |
| `scalpBuilderStep` | 2155 | 18 | 16 | 2 | 3909 | scalp |
| `proceduralDuplicatePreview` | 2427 | 17 | 9 | 8 | 29849 | (unclassified) |
| `branchRegionView` | 22887 | 17 | 13 | 4 | 107 | branch/sub |
| `transformDragging` | 2132 | 16 | 12 | 4 | 35939 | sculpt/edit |
| `hierarchyEditing` | 2139 | 16 | 14 | 2 | 33963 | sculpt/edit |
| `proceduralDrawExperimentalEnabled` | 2220 | 16 | 13 | 3 | 32857 | draw/poly |
| `activeViewportPointer` | 2295 | 16 | 10 | 6 | 34283 | camera/viewport |
| `customCreationPresets` | 34608 | 16 | 12 | 4 | 274 | save/project |
| `selectedSurfaceObjectAnchorId` | 2194 | 15 | 4 | 11 | 34528 | selection/outliner |
| `radialMenusEnabled` | 2219 | 15 | 13 | 2 | 32857 | ui/panel |
| `scalpRegionAssignments` | 1472 | 14 | 13 | 1 | 19863 | scalp |
| `scalpBuilderEditedPoints` | 2160 | 14 | 8 | 6 | 17254 | scalp |
| `altOrbitDrag` | 2185 | 14 | 10 | 4 | 36484 | sculpt/edit |
| `controlPointDisplaySize` | 2246 | 14 | 13 | 1 | 32843 | guide/curve |
| `strandRadialGesture` | 2421 | 14 | 10 | 4 | 28266 | hair/mesh |
| `branchRegionEdit` | 22765 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `scalpGuideSource` | 1612 | 13 | 4 | 9 | 32041 | scalp |
| `capsuleGuideLoopSelection` | 2151 | 13 | 8 | 5 | 8926 | selection/outliner |
| `scalpBuilderPlane` | 2157 | 13 | 10 | 3 | 3932 | scalp |
| `scalpLatticeDrag` | 2191 | 13 | 11 | 2 | 35881 | scalp |
| `polyBrushStroke` | 2200 | 13 | 7 | 6 | 33691 | sculpt/edit |
| `panelSplitDrag` | 2207 | 13 | 10 | 3 | 35872 | sculpt/edit |
| `drawStrandMode` | 2209 | 13 | 4 | 9 | 32680 | hair/mesh |
| `cameraSmoothingEnabled` | 2230 | 13 | 9 | 4 | 32850 | camera/viewport |
| `cameraSmoothingStrength` | 2231 | 13 | 12 | 1 | 32850 | camera/viewport |
| `viewportStatisticsEnabled` | 2238 | 13 | 11 | 2 | 32847 | camera/viewport |
| `defaultHairShader` | 304 | 12 | 9 | 3 | 34787 | hair/mesh |
| `capsuleGuidesVisible` | 2086 | 12 | 6 | 6 | 33628 | guide/curve |
| `objectSpaceEditing` | 2138 | 12 | 11 | 1 | 35997 | sculpt/edit |
| `layerColorShiftsEnabled` | 2244 | 12 | 10 | 2 | 32843 | selection/outliner |
| `sideNamingPerspective` | 2258 | 12 | 10 | 2 | 36513 | (unclassified) |
| `brushSizeDrag` | 2290 | 12 | 8 | 4 | 34944 | sculpt/edit |
| `strandWidthEdgeDrag` | 2291 | 12 | 8 | 4 | 35723 | sculpt/edit |
| `outlinerContextTarget` | 2419 | 12 | 5 | 7 | 30320 | selection/outliner |
| `toolRadialGesture` | 2422 | 12 | 9 | 3 | 33507 | (unclassified) |
| `scalpVisibleQuads` | 1474 | 11 | 10 | 1 | 18894 | scalp |
| `editedScalpRegions` | 1621 | 11 | 7 | 4 | 19711 | scalp |
| `curveLatticeGuidesVisible` | 2087 | 11 | 5 | 6 | 33632 | guide/curve |
| `capsuleGuideLoopDrag` | 2152 | 11 | 7 | 4 | 35928 | sculpt/edit |
| `houdiniZoomDrag` | 2188 | 11 | 8 | 3 | 24371 | sculpt/edit |
| `navigationTipsEnabled` | 2225 | 11 | 9 | 2 | 32853 | camera/viewport |
| `toolTipsEnabled` | 2236 | 11 | 9 | 2 | 32847 | (unclassified) |
| `compactToolButtonsEnabled` | 2237 | 11 | 9 | 2 | 32847 | (unclassified) |
| `twistCurveAllStrandsPreviewEnabled` | 2239 | 11 | 9 | 2 | 32847 | hair/mesh |
| `outlinerFolderColorsEnabled` | 2245 | 11 | 9 | 2 | 32843 | selection/outliner |
| `customShapePresets` | 16693 | 11 | 7 | 4 | 2389 | save/project |
| `scalpLatticeEditing` | 2145 | 10 | 8 | 2 | 36218 | scalp |
| `capsuleGuideDrawStroke` | 2199 | 10 | 6 | 4 | 35878 | sculpt/edit |
| `toolShortcutPress` | 2218 | 10 | 6 | 4 | 28495 | (unclassified) |
| `branchSweepStartDrag` | 23261 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `orthographicView` | 464 | 9 | 8 | 1 | 35977 | camera/viewport |
| `activeHairMaterialId` | 996 | 9 | 3 | 6 | 31940 | hair/mesh |
| `customScalpRegions` | 1616 | 9 | 6 | 3 | 19713 | scalp |
| `editedScalpSurfaceWire` | 1619 | 9 | 8 | 1 | 4500 | scalp |
| `uvCheckerEnabled` | 2078 | 9 | 8 | 1 | 33661 | hair/mesh |
| `activeCustomDrawClumpTemplate` | 2210 | 9 | 4 | 5 | 32678 | draw/poly |
| `taperMeshPointsVisible` | 2310 | 9 | 7 | 2 | 30996 | hair/mesh |
| `importedHeadAsset` | 3230 | 9 | 2 | 7 | 15939 | head/body |
| `scheduledTaperCurveEditFrame` | 17346 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22888 | 9 | 7 | 2 | 89 | sculpt/edit |
| `hoveredControlPoint` | 38051 | 9 | 6 | 3 | 12 | guide/curve |
| `turntableActive` | 466 | 8 | 7 | 1 | 38203 | camera/viewport |
| `transformScaleDrag` | 678 | 8 | 5 | 3 | 32197 | sculpt/edit |
| `importedScalpGuideAsset` | 1617 | 8 | 5 | 3 | 17573 | scalp |
| `showGroupColors` | 2077 | 8 | 7 | 1 | 33661 | hair/mesh |
| `scalpGuideVisible` | 2083 | 8 | 5 | 3 | 5851 | scalp |
| `referenceOverlayDrag` | 2121 | 8 | 4 | 4 | 9204 | sculpt/edit |
| `referenceCropDrag` | 2122 | 8 | 4 | 4 | 9203 | sculpt/edit |
| `sculptMoveStroke` | 2125 | 8 | 4 | 4 | 36156 | sculpt/edit |
| `activeCapsuleGuideLoopTransform` | 2153 | 8 | 0 | 8 | 8486 | guide/curve |
| `placementPointer` | 2214 | 8 | 5 | 3 | 36033 | (unclassified) |
| `scaleSensitivity` | 2235 | 8 | 7 | 1 | 32847 | (unclassified) |
| `viewPlaneMoveEnabled` | 2297 | 8 | 5 | 3 | 28848 | (unclassified) |
| `sweepProfileMirrorEnabled` | 2308 | 8 | 7 | 1 | 30826 | save/project |
| `taperMeshPointDrag` | 2311 | 8 | 4 | 4 | 31141 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 34035 | 8 | 1 | 7 | 2153 | sculpt/edit |
| `compactOutlinerCollapsed` | 38689 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38690 | 8 | 6 | 2 | 73 | sculpt/edit |
| `orthographicHalfHeight` | 465 | 7 | 3 | 4 | 10327 | camera/viewport |
| `customScalpSurfaceWire` | 1614 | 7 | 5 | 2 | 4508 | scalp |
| `hairTopologyVisible` | 2076 | 7 | 5 | 2 | 34379 | hair/mesh |
| `uvInspectorDrag` | 2082 | 7 | 4 | 3 | 33686 | sculpt/edit |
| `isolatedStrandIds` | 2099 | 7 | 4 | 3 | 34153 | selection/outliner |
| `lockIndex` | 2116 | 7 | 5 | 2 | 27467 | selection/outliner |
| `activeStrandObjectTransform` | 2129 | 7 | 2 | 5 | 9765 | hair/mesh |
| `activeLatticeMultiEdit` | 2131 | 7 | 2 | 5 | 10514 | sculpt/edit |
| `scalpPaintDrag` | 2179 | 7 | 5 | 2 | 35894 | scalp |
| `activeScalpRegion` | 2180 | 7 | 2 | 5 | 31542 | scalp |
| `clumpUpdateInProgress` | 2211 | 7 | 1 | 6 | 25744 | (unclassified) |
| `shiftSnappedViewActive` | 2296 | 7 | 1 | 6 | 34314 | ui/panel |
| `viewPlaneNormalMoveHeld` | 2299 | 7 | 5 | 2 | 10276 | (unclassified) |
| `pullMoveEnabled` | 2301 | 7 | 5 | 2 | 28845 | (unclassified) |
| `historyShortcutHeld` | 2430 | 7 | 2 | 5 | 35873 | undo/history |
| `strandRadialActions` | 2783 | 7 | 6 | 1 | 27675 | hair/mesh |
| `branchRegionPanDrag` | 22889 | 7 | 5 | 2 | 89 | sculpt/edit |
| `pendingCreationPresetType` | 34770 | 7 | 0 | 7 | 198 | save/project |
| `transformPrecisionHeld` | 680 | 6 | 3 | 3 | 35486 | gizmo/transform |
| `scalpManualRegionQuads` | 1473 | 6 | 4 | 2 | 17998 | scalp |
| `activeSurfaceObjectTransform` | 2128 | 6 | 2 | 4 | 34094 | gizmo/transform |
| `pendingLockGeometryFrame` | 2134 | 6 | 2 | 4 | 25882 | hair/mesh |
| `sculptBrushGeometryFrame` | 2136 | 6 | 3 | 3 | 25841 | sculpt/edit |
| `pointRemovalCandidate` | 2187 | 6 | 0 | 6 | 36032 | (unclassified) |
| `branchBridgeSmoothStrength` | 2271 | 6 | 2 | 4 | 32744 | branch/sub |
| `branchBridgeSmoothDetail` | 2275 | 6 | 2 | 4 | 32751 | branch/sub |
| `hoveredStrandWidthEdge` | 2292 | 6 | 1 | 5 | 35715 | hair/mesh |
| `selectionSetsOpen` | 2413 | 6 | 3 | 3 | 29811 | selection/outliner |
| `activeOutlinerTab` | 2418 | 6 | 0 | 6 | 5370 | selection/outliner |
| `toolRadialActions` | 2788 | 6 | 5 | 1 | 28341 | (unclassified) |
| `pendingShapePresetSave` | 16694 | 6 | 0 | 6 | 18276 | save/project |
| `pendingShapePresetRemoval` | 16695 | 6 | 1 | 5 | 18281 | save/project |
| `pendingCreationPresetRemoval` | 34771 | 6 | 1 | 5 | 204 | save/project |
| `customScalpSelectionOutline` | 1615 | 5 | 3 | 2 | 4508 | selection/outliner |
| `editedScalpSelectionOutline` | 1620 | 5 | 4 | 1 | 4500 | selection/outliner |
| `headMeshVisible` | 2095 | 5 | 1 | 4 | 33629 | hair/mesh |
| `bodyMeshVisible` | 2096 | 5 | 2 | 3 | 33633 | hair/mesh |
| `referenceImageIndex` | 2117 | 5 | 3 | 2 | 17257 | reference |
| `referenceScaleDrag` | 2120 | 5 | 3 | 2 | -1281 | sculpt/edit |
| `activeGuideObjectTransform` | 2130 | 5 | 0 | 5 | 9475 | guide/curve |
| `recursiveHierarchyTransforms` | 2141 | 5 | 4 | 1 | 32858 | gizmo/transform |
| `activeScalpBuilderCurveLatticeEdit` | 2159 | 5 | 1 | 4 | 3884 | scalp |
| `selectPointerCapture` | 2190 | 5 | 2 | 3 | 24301 | selection/outliner |
| `polyAltDeleteCandidate` | 2201 | 5 | 0 | 5 | 36016 | draw/poly |
| `polyShiftPreviewHeld` | 2204 | 5 | 1 | 4 | 33968 | draw/poly |
| `branchRigidCurvatureBlend` | 2267 | 5 | 2 | 3 | 32738 | branch/sub |
| `branchRegionSyncLateral` | 2281 | 5 | 1 | 4 | 32752 | branch/sub |
| `branchRegionSyncVertical` | 2285 | 5 | 1 | 4 | 32754 | branch/sub |
| `brushSizeHotkeyHeld` | 2293 | 5 | 2 | 3 | 35185 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2425 | 5 | 1 | 4 | 29453 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2426 | 5 | 1 | 4 | 29176 | (unclassified) |
| `restoringHistory` | 2429 | 5 | 1 | 4 | 17184 | undo/history |
| `groupDefaultsWarningContinuation` | 3133 | 5 | 0 | 5 | 29914 | (unclassified) |
| `panelSplitSnapWarningContinuation` | 3138 | 5 | 0 | 5 | 31175 | ui/panel |
| `taperCurveEditInteractiveDirty` | 17347 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 34036 | 5 | 1 | 4 | 2151 | sculpt/edit |
| `pendingClumpPresetGuideId` | 34772 | 5 | 1 | 4 | 197 | guide/curve |
| `sculptBrushViableLockIds` | 37315 | 5 | 2 | 3 | 46 | sculpt/edit |
| `turntableSpeed` | 467 | 4 | 3 | 1 | 38206 | camera/viewport |
| `selectionRemoveHeld` | 681 | 4 | 1 | 3 | 35486 | selection/outliner |
| `hairMaterialIndex` | 995 | 4 | 2 | 2 | 18388 | hair/mesh |
| `sculptBrushShiftSmoothHeld` | 2126 | 4 | 2 | 2 | 8841 | sculpt/edit |
| `capsuleGuideLoopHover` | 2150 | 4 | 1 | 3 | 8239 | guide/curve |
| `curveLatticeLoopHover` | 2154 | 4 | 3 | 1 | 6776 | guide/curve |
| `scalpBuilderStroke` | 2156 | 4 | 3 | 1 | 35918 | scalp |
| `curvePointInsertionCandidate` | 2189 | 4 | 0 | 4 | 36029 | (unclassified) |
| `activeCapsuleGuideEdit` | 2208 | 4 | 2 | 2 | 7751 | sculpt/edit |
| `viewPlaneMoveSnappedOnly` | 2298 | 4 | 2 | 2 | 10135 | ui/panel |
| `pullRigidity` | 2303 | 4 | 3 | 1 | 31647 | (unclassified) |
| `branchRegionMeshPointsVisible` | 2363 | 4 | 2 | 2 | 30925 | hair/mesh |
| `rebuildingProceduralDuplicatePreview` | 2428 | 4 | 2 | 2 | 29202 | (unclassified) |
| `inputUndoCaptured` | 2431 | 4 | 1 | 3 | 30015 | ui/panel |
| `groupDefaultsWarningAcknowledged` | 3132 | 4 | 3 | 1 | 29905 | (unclassified) |
| `activePresetFilter` | 3221 | 4 | 1 | 3 | 30442 | save/project |
| `currentProjectName` | 3222 | 4 | 0 | 4 | 16754 | save/project |
| `viewportFrameCycleStep` | 10825 | 4 | 0 | 4 | 26 | camera/viewport |
| `enterHeadSetupAfterHeadImport` | 33610 | 4 | 0 | 4 | 14 | head/body |
| `enterHeadSetupAfterFullBodyImport` | 33611 | 4 | 0 | 4 | 29 | head/body |
| `uniformScaleDrag` | 677 | 3 | 0 | 3 | 32110 | sculpt/edit |
| `transformPrecisionDrag` | 679 | 3 | 0 | 3 | 32164 | sculpt/edit |
| `defaultScalpGeometryData` | 1433 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1447 | 3 | 2 | 1 | 353 | scalp |
| `uvInspectorDirty` | 2080 | 3 | 1 | 2 | 26128 | hair/mesh |
| `pendingReferenceImageType` | 2119 | 3 | 0 | 3 | 33306 | reference |
| `viewportSelectionMode` | 2124 | 3 | 0 | 3 | 4773 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2161 | 3 | 1 | 2 | 2858 | scalp |
| `scalpBuilderCurveLatticePromise` | 2162 | 3 | 1 | 2 | 2295 | scalp |
| `selectedScalpLatticeIndex` | 2181 | 3 | 0 | 3 | 36191 | selection/outliner |
| `blenderNavigationDrag` | 2186 | 3 | 1 | 2 | 24291 | sculpt/edit |
| `polyFillPreviewGroup` | 2202 | 3 | 1 | 2 | 19461 | draw/poly |
| `branchUpdateInProgress` | 2212 | 3 | 1 | 2 | 25744 | branch/sub |
| `regionLengthUpdateInProgress` | 2213 | 3 | 1 | 2 | 25687 | branch/sub |
| `emptySelectionPointer` | 2215 | 3 | 0 | 3 | 36020 | selection/outliner |
| `strandRadialTargetId` | 2420 | 3 | 0 | 3 | 28160 | hair/mesh |
| `pendingDroppedApplicationFile` | 2681 | 3 | 0 | 3 | 30925 | save/project |
| `pendingDroppedApplicationKind` | 2682 | 3 | 0 | 3 | 30925 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2683 | 3 | 1 | 2 | 30925 | (unclassified) |
| `quickSaveFileHandle` | 3224 | 3 | 0 | 3 | 15976 | save/project |
| `quickSaveFileName` | 3225 | 3 | 0 | 3 | 15976 | save/project |
| `scalpTopologyTemplatePromise` | 4411 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10826 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38655 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1448 | 2 | 1 | 1 | 24596 | scalp |
| `authoredScalpGuideMatrix` | 2061 | 2 | 1 | 1 | 2400 | scalp |
| `uvCheckerTexture` | 2079 | 2 | 0 | 2 | 26189 | hair/mesh |
| `proportionalRootLocked` | 2143 | 2 | 1 | 1 | 33688 | sculpt/edit |
| `polyFillPreviewCandidate` | 2203 | 2 | 0 | 2 | 19501 | draw/poly |
| `pullCollisionEnabled` | 2302 | 2 | 1 | 1 | 31651 | (unclassified) |
| `lastHorizontalViewAxis` | 2304 | 2 | 2 | 0 | 34343 | (unclassified) |
| `panelSplitSnapWarningAcknowledged` | 3137 | 2 | 1 | 1 | 31174 | ui/panel |
| `projectSaveInProgress` | 3223 | 2 | 0 | 2 | 15912 | save/project |
| `lastExport` | 3226 | 2 | 0 | 2 | 15911 | save/project |
| `quickExportFileHandle` | 3227 | 2 | 0 | 2 | 15912 | save/project |
| `quickExportInProgress` | 3228 | 2 | 0 | 2 | 15913 | save/project |
| `pendingFileAction` | 3229 | 2 | 0 | 2 | 15914 | save/project |
| `fpsSampleStart` | 38656 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38657 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2073 | 1 | 0 | 1 | 1539 | (unclassified) |
| `braidSegmentBounds` | 2074 | 1 | 0 | 1 | 1539 | (unclassified) |