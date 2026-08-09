# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **213** 个顶层 `let`（app.js 全局可变状态）。
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
| head/body | 3 | `importedHeadAsset`(9) `enterHeadSetupAfterHeadImport`(4) `enterHeadSetupAfterFullBodyImport`(4) |
| gizmo/transform | 3 | `transformPrecisionHeld`(6) `activeSurfaceObjectTransform`(6) `recursiveHierarchyTransforms`(5) |
| undo/history | 2 | `historyShortcutHeld`(7) `restoringHistory`(5) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2125 | 207 | 108 | 99 | 36515 | selection/outliner |
| `drawStrandStroke` | 2200 | 137 | 133 | 4 | 35871 | sculpt/edit |
| `taperCurveEdit` | 2281 | 120 | 117 | 3 | 31224 | sculpt/edit |
| `scalpBuilderCurveLattice` | 2160 | 73 | 71 | 2 | 35946 | scalp |
| `camera` | 466 | 67 | 62 | 5 | 38214 | camera/viewport |
| `viewportEditMode` | 2395 | 66 | 16 | 50 | 36214 | sculpt/edit |
| `scalpBuilderEditing` | 2150 | 58 | 53 | 5 | 36194 | scalp |
| `curveSurfaceDraft` | 2205 | 53 | 50 | 3 | 36224 | (unclassified) |
| `sweepProfileEdit` | 2279 | 49 | 46 | 3 | 30875 | sculpt/edit |
| `viewPlaneMoveDrag` | 2272 | 45 | 41 | 4 | 35798 | sculpt/edit |
| `guideModel` | 2063 | 42 | 40 | 2 | 24707 | guide/curve |
| `capsuleGuideEditing` | 2151 | 39 | 30 | 9 | 36234 | sculpt/edit |
| `mirrorXEditing` | 2142 | 37 | 36 | 1 | 33965 | sculpt/edit |
| `placeEdit` | 2199 | 35 | 31 | 4 | 36243 | sculpt/edit |
| `duplicatePlacement` | 2396 | 35 | 28 | 7 | 35669 | (unclassified) |
| `navigationStyle` | 2218 | 31 | 16 | 15 | 34332 | camera/viewport |
| `activeHandleEdit` | 2129 | 29 | 9 | 20 | 34591 | sculpt/edit |
| `scalpPaintEditing` | 2148 | 29 | 26 | 3 | 36201 | scalp |
| `branchRegionCanvasDrag` | 22738 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2144 | 28 | 26 | 2 | 35559 | sculpt/edit |
| `headSetupEditing` | 2149 | 27 | 17 | 10 | 33457 | sculpt/edit |
| `loftSurfaceDraft` | 2204 | 26 | 23 | 3 | 35869 | (unclassified) |
| `scalpShapeEditing` | 2146 | 24 | 21 | 3 | 36229 | scalp |
| `proportionalSizeEdit` | 2213 | 23 | 21 | 2 | 36089 | sculpt/edit |
| `selectionMarqueeDrag` | 2186 | 22 | 14 | 8 | 36335 | selection/outliner |
| `relaxEdit` | 2198 | 22 | 19 | 3 | 34343 | sculpt/edit |
| `viewSnapDrag` | 2266 | 22 | 19 | 3 | 36398 | sculpt/edit |
| `proportionalHotkeyPress` | 2214 | 21 | 16 | 5 | 36088 | sculpt/edit |
| `viewportBackgroundColor` | 2242 | 21 | 15 | 6 | 32843 | camera/viewport |
| `preferencesOpenSnapshot` | 2261 | 21 | 17 | 4 | 28817 | ui/panel |
| `customScalpSurfaceMesh` | 1616 | 18 | 15 | 3 | 32005 | scalp |
| `editedScalpSurfaceMesh` | 1621 | 18 | 16 | 2 | 19682 | scalp |
| `scalpBuilderStep` | 2157 | 18 | 16 | 2 | 3879 | scalp |
| `proceduralDuplicatePreview` | 2399 | 17 | 9 | 8 | 29849 | (unclassified) |
| `transformDragging` | 2134 | 16 | 12 | 4 | 35932 | sculpt/edit |
| `hierarchyEditing` | 2141 | 16 | 14 | 2 | 33956 | sculpt/edit |
| `activeViewportPointer` | 2267 | 16 | 10 | 6 | 34306 | camera/viewport |
| `customCreationPresets` | 34580 | 16 | 12 | 4 | 274 | save/project |
| `selectedSurfaceObjectAnchorId` | 2196 | 15 | 4 | 11 | 34521 | selection/outliner |
| `radialMenusEnabled` | 2216 | 15 | 13 | 2 | 32855 | ui/panel |
| `scalpRegionAssignments` | 1475 | 14 | 13 | 1 | 19832 | scalp |
| `scalpBuilderEditedPoints` | 2162 | 14 | 8 | 6 | 17224 | scalp |
| `altOrbitDrag` | 2187 | 14 | 10 | 4 | 36477 | sculpt/edit |
| `controlPointDisplaySize` | 2238 | 14 | 13 | 1 | 32846 | guide/curve |
| `strandRadialGesture` | 2393 | 14 | 10 | 4 | 28266 | hair/mesh |
| `branchRegionEdit` | 22737 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `scalpGuideSource` | 1615 | 13 | 4 | 9 | 32010 | scalp |
| `capsuleGuideLoopSelection` | 2153 | 13 | 8 | 5 | 8896 | selection/outliner |
| `scalpBuilderPlane` | 2159 | 13 | 10 | 3 | 3902 | scalp |
| `scalpLatticeDrag` | 2193 | 13 | 11 | 2 | 35874 | scalp |
| `polyBrushStroke` | 2202 | 13 | 7 | 6 | 33684 | sculpt/edit |
| `panelSplitDrag` | 2206 | 13 | 10 | 3 | 35868 | sculpt/edit |
| `drawStrandMode` | 2208 | 13 | 4 | 9 | 32653 | hair/mesh |
| `cameraSmoothingEnabled` | 2222 | 13 | 9 | 4 | 32853 | camera/viewport |
| `cameraSmoothingStrength` | 2223 | 13 | 12 | 1 | 32853 | camera/viewport |
| `viewportStatisticsEnabled` | 2230 | 13 | 11 | 2 | 32850 | camera/viewport |
| `defaultHairShader` | 307 | 12 | 9 | 3 | 34779 | hair/mesh |
| `capsuleGuidesVisible` | 2089 | 12 | 6 | 6 | 33620 | guide/curve |
| `objectSpaceEditing` | 2140 | 12 | 11 | 1 | 35990 | sculpt/edit |
| `layerColorShiftsEnabled` | 2236 | 12 | 10 | 2 | 32846 | selection/outliner |
| `sideNamingPerspective` | 2250 | 12 | 10 | 2 | 36516 | (unclassified) |
| `brushSizeDrag` | 2262 | 12 | 8 | 4 | 34967 | sculpt/edit |
| `strandWidthEdgeDrag` | 2263 | 12 | 8 | 4 | 35746 | sculpt/edit |
| `outlinerContextTarget` | 2391 | 12 | 5 | 7 | 30320 | selection/outliner |
| `toolRadialGesture` | 2394 | 12 | 9 | 3 | 33530 | (unclassified) |
| `scalpVisibleQuads` | 1477 | 11 | 10 | 1 | 18863 | scalp |
| `editedScalpRegions` | 1624 | 11 | 7 | 4 | 19680 | scalp |
| `curveLatticeGuidesVisible` | 2090 | 11 | 5 | 6 | 33624 | guide/curve |
| `capsuleGuideLoopDrag` | 2154 | 11 | 7 | 4 | 35921 | sculpt/edit |
| `houdiniZoomDrag` | 2190 | 11 | 8 | 3 | 24340 | sculpt/edit |
| `navigationTipsEnabled` | 2217 | 11 | 9 | 2 | 32856 | camera/viewport |
| `toolTipsEnabled` | 2228 | 11 | 9 | 2 | 32850 | (unclassified) |
| `compactToolButtonsEnabled` | 2229 | 11 | 9 | 2 | 32850 | (unclassified) |
| `twistCurveAllStrandsPreviewEnabled` | 2231 | 11 | 9 | 2 | 32850 | hair/mesh |
| `outlinerFolderColorsEnabled` | 2237 | 11 | 9 | 2 | 32846 | selection/outliner |
| `customShapePresets` | 16665 | 11 | 7 | 4 | 2389 | save/project |
| `scalpLatticeEditing` | 2147 | 10 | 8 | 2 | 36211 | scalp |
| `capsuleGuideDrawStroke` | 2201 | 10 | 6 | 4 | 35871 | sculpt/edit |
| `toolShortcutPress` | 2215 | 10 | 6 | 4 | 28470 | (unclassified) |
| `branchSweepStartDrag` | 23232 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `orthographicView` | 467 | 9 | 8 | 1 | 35969 | camera/viewport |
| `activeHairMaterialId` | 999 | 9 | 3 | 6 | 31909 | hair/mesh |
| `customScalpRegions` | 1619 | 9 | 6 | 3 | 19682 | scalp |
| `editedScalpSurfaceWire` | 1622 | 9 | 8 | 1 | 4469 | scalp |
| `uvCheckerEnabled` | 2081 | 9 | 8 | 1 | 33653 | hair/mesh |
| `taperMeshPointsVisible` | 2282 | 9 | 7 | 2 | 30996 | hair/mesh |
| `importedHeadAsset` | 3202 | 9 | 2 | 7 | 15939 | head/body |
| `scheduledTaperCurveEditFrame` | 17318 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22859 | 9 | 7 | 2 | 89 | sculpt/edit |
| `hoveredControlPoint` | 38046 | 9 | 6 | 3 | 12 | guide/curve |
| `turntableActive` | 469 | 8 | 7 | 1 | 38195 | camera/viewport |
| `transformScaleDrag` | 681 | 8 | 5 | 3 | 32166 | sculpt/edit |
| `importedScalpGuideAsset` | 1620 | 8 | 5 | 3 | 17542 | scalp |
| `showGroupColors` | 2080 | 8 | 7 | 1 | 33653 | hair/mesh |
| `scalpGuideVisible` | 2086 | 8 | 5 | 3 | 5820 | scalp |
| `referenceOverlayDrag` | 2123 | 8 | 4 | 4 | 9174 | sculpt/edit |
| `referenceCropDrag` | 2124 | 8 | 4 | 4 | 9173 | sculpt/edit |
| `sculptMoveStroke` | 2127 | 8 | 4 | 4 | 36149 | sculpt/edit |
| `activeCapsuleGuideLoopTransform` | 2155 | 8 | 0 | 8 | 8456 | guide/curve |
| `placementPointer` | 2211 | 8 | 5 | 3 | 36031 | (unclassified) |
| `scaleSensitivity` | 2227 | 8 | 7 | 1 | 32850 | (unclassified) |
| `viewPlaneMoveEnabled` | 2269 | 8 | 5 | 3 | 28848 | (unclassified) |
| `sweepProfileMirrorEnabled` | 2280 | 8 | 7 | 1 | 30826 | save/project |
| `taperMeshPointDrag` | 2283 | 8 | 4 | 4 | 31141 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 34007 | 8 | 1 | 7 | 2176 | sculpt/edit |
| `compactOutlinerCollapsed` | 38684 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38685 | 8 | 6 | 2 | 73 | sculpt/edit |
| `orthographicHalfHeight` | 468 | 7 | 3 | 4 | 10296 | camera/viewport |
| `customScalpSurfaceWire` | 1617 | 7 | 5 | 2 | 4477 | scalp |
| `hairTopologyVisible` | 2079 | 7 | 5 | 2 | 34371 | hair/mesh |
| `uvInspectorDrag` | 2085 | 7 | 4 | 3 | 33678 | sculpt/edit |
| `isolatedStrandIds` | 2102 | 7 | 4 | 3 | 34145 | selection/outliner |
| `lockIndex` | 2119 | 7 | 5 | 2 | 27436 | selection/outliner |
| `activeStrandObjectTransform` | 2131 | 7 | 2 | 5 | 9735 | hair/mesh |
| `activeLatticeMultiEdit` | 2133 | 7 | 2 | 5 | 10484 | sculpt/edit |
| `scalpPaintDrag` | 2181 | 7 | 5 | 2 | 35887 | scalp |
| `activeScalpRegion` | 2182 | 7 | 2 | 5 | 31512 | scalp |
| `clumpUpdateInProgress` | 2209 | 7 | 1 | 6 | 25717 | (unclassified) |
| `shiftSnappedViewActive` | 2268 | 7 | 1 | 6 | 34337 | ui/panel |
| `viewPlaneNormalMoveHeld` | 2271 | 7 | 5 | 2 | 10276 | (unclassified) |
| `pullMoveEnabled` | 2273 | 7 | 5 | 2 | 28845 | (unclassified) |
| `historyShortcutHeld` | 2402 | 7 | 2 | 5 | 35896 | undo/history |
| `strandRadialActions` | 2755 | 7 | 6 | 1 | 27675 | hair/mesh |
| `branchRegionPanDrag` | 22860 | 7 | 5 | 2 | 89 | sculpt/edit |
| `pendingCreationPresetType` | 34742 | 7 | 0 | 7 | 198 | save/project |
| `transformPrecisionHeld` | 683 | 6 | 3 | 3 | 35478 | gizmo/transform |
| `scalpManualRegionQuads` | 1476 | 6 | 4 | 2 | 17967 | scalp |
| `activeSurfaceObjectTransform` | 2130 | 6 | 2 | 4 | 34087 | gizmo/transform |
| `pendingLockGeometryFrame` | 2136 | 6 | 2 | 4 | 25851 | hair/mesh |
| `sculptBrushGeometryFrame` | 2138 | 6 | 3 | 3 | 25810 | sculpt/edit |
| `pointRemovalCandidate` | 2189 | 6 | 0 | 6 | 36025 | (unclassified) |
| `hoveredStrandWidthEdge` | 2264 | 6 | 1 | 5 | 35738 | hair/mesh |
| `selectionSetsOpen` | 2385 | 6 | 3 | 3 | 29811 | selection/outliner |
| `activeOutlinerTab` | 2390 | 6 | 0 | 6 | 5370 | selection/outliner |
| `toolRadialActions` | 2760 | 6 | 5 | 1 | 28341 | (unclassified) |
| `pendingShapePresetSave` | 16666 | 6 | 0 | 6 | 18276 | save/project |
| `pendingShapePresetRemoval` | 16667 | 6 | 1 | 5 | 18281 | save/project |
| `pendingCreationPresetRemoval` | 34743 | 6 | 1 | 5 | 204 | save/project |
| `customScalpSelectionOutline` | 1618 | 5 | 3 | 2 | 4477 | selection/outliner |
| `editedScalpSelectionOutline` | 1623 | 5 | 4 | 1 | 4469 | selection/outliner |
| `headMeshVisible` | 2098 | 5 | 1 | 4 | 33621 | hair/mesh |
| `bodyMeshVisible` | 2099 | 5 | 2 | 3 | 33625 | hair/mesh |
| `referenceScaleDrag` | 2122 | 5 | 3 | 2 | -1280 | sculpt/edit |
| `activeGuideObjectTransform` | 2132 | 5 | 0 | 5 | 9445 | guide/curve |
| `recursiveHierarchyTransforms` | 2143 | 5 | 4 | 1 | 32828 | gizmo/transform |
| `activeScalpBuilderCurveLatticeEdit` | 2161 | 5 | 1 | 4 | 3854 | scalp |
| `selectPointerCapture` | 2192 | 5 | 2 | 3 | 24270 | selection/outliner |
| `brushSizeHotkeyHeld` | 2265 | 5 | 2 | 3 | 35208 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2397 | 5 | 1 | 4 | 29453 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2398 | 5 | 1 | 4 | 29176 | (unclassified) |
| `restoringHistory` | 2401 | 5 | 1 | 4 | 17184 | undo/history |
| `groupDefaultsWarningContinuation` | 3105 | 5 | 0 | 5 | 29914 | (unclassified) |
| `panelSplitSnapWarningContinuation` | 3110 | 5 | 0 | 5 | 31175 | ui/panel |
| `taperCurveEditInteractiveDirty` | 17319 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 34008 | 5 | 1 | 4 | 2174 | sculpt/edit |
| `pendingClumpPresetGuideId` | 34744 | 5 | 1 | 4 | 197 | guide/curve |
| `sculptBrushViableLockIds` | 37310 | 5 | 2 | 3 | 46 | sculpt/edit |
| `turntableSpeed` | 470 | 4 | 3 | 1 | 38198 | camera/viewport |
| `selectionRemoveHeld` | 684 | 4 | 1 | 3 | 35478 | selection/outliner |
| `hairMaterialIndex` | 998 | 4 | 2 | 2 | 18357 | hair/mesh |
| `sculptBrushShiftSmoothHeld` | 2128 | 4 | 2 | 2 | 8811 | sculpt/edit |
| `capsuleGuideLoopHover` | 2152 | 4 | 1 | 3 | 8209 | guide/curve |
| `curveLatticeLoopHover` | 2156 | 4 | 3 | 1 | 6746 | guide/curve |
| `scalpBuilderStroke` | 2158 | 4 | 3 | 1 | 35911 | scalp |
| `curvePointInsertionCandidate` | 2191 | 4 | 0 | 4 | 36022 | (unclassified) |
| `activeCapsuleGuideEdit` | 2207 | 4 | 2 | 2 | 7724 | sculpt/edit |
| `viewPlaneMoveSnappedOnly` | 2270 | 4 | 2 | 2 | 10135 | ui/panel |
| `pullRigidity` | 2275 | 4 | 3 | 1 | 31647 | (unclassified) |
| `branchRegionMeshPointsVisible` | 2335 | 4 | 2 | 2 | 30925 | hair/mesh |
| `rebuildingProceduralDuplicatePreview` | 2400 | 4 | 2 | 2 | 29202 | (unclassified) |
| `inputUndoCaptured` | 2403 | 4 | 1 | 3 | 30015 | ui/panel |
| `groupDefaultsWarningAcknowledged` | 3104 | 4 | 3 | 1 | 29905 | (unclassified) |
| `activePresetFilter` | 3193 | 4 | 1 | 3 | 30442 | save/project |
| `currentProjectName` | 3194 | 4 | 0 | 4 | 16754 | save/project |
| `viewportFrameCycleStep` | 10797 | 4 | 0 | 4 | 26 | camera/viewport |
| `enterHeadSetupAfterHeadImport` | 33582 | 4 | 0 | 4 | 14 | head/body |
| `enterHeadSetupAfterFullBodyImport` | 33583 | 4 | 0 | 4 | 29 | head/body |
| `uniformScaleDrag` | 680 | 3 | 0 | 3 | 32079 | sculpt/edit |
| `transformPrecisionDrag` | 682 | 3 | 0 | 3 | 32133 | sculpt/edit |
| `defaultScalpGeometryData` | 1436 | 3 | 0 | 3 | 13 | scalp |
| `scalpQuadEdges` | 1450 | 3 | 2 | 1 | 353 | scalp |
| `uvInspectorDirty` | 2083 | 3 | 1 | 2 | 26096 | hair/mesh |
| `viewportSelectionMode` | 2126 | 3 | 0 | 3 | 4743 | selection/outliner |
| `scalpBuilderCurveLatticeLoadToken` | 2163 | 3 | 1 | 2 | 2828 | scalp |
| `scalpBuilderCurveLatticePromise` | 2164 | 3 | 1 | 2 | 2265 | scalp |
| `selectedScalpLatticeIndex` | 2183 | 3 | 0 | 3 | 36184 | selection/outliner |
| `blenderNavigationDrag` | 2188 | 3 | 1 | 2 | 24260 | sculpt/edit |
| `emptySelectionPointer` | 2212 | 3 | 0 | 3 | 36018 | selection/outliner |
| `strandRadialTargetId` | 2392 | 3 | 0 | 3 | 28160 | hair/mesh |
| `pendingDroppedApplicationFile` | 2653 | 3 | 0 | 3 | 30925 | save/project |
| `pendingDroppedApplicationKind` | 2654 | 3 | 0 | 3 | 30925 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2655 | 3 | 1 | 2 | 30925 | (unclassified) |
| `quickSaveFileHandle` | 3196 | 3 | 0 | 3 | 15976 | save/project |
| `quickSaveFileName` | 3197 | 3 | 0 | 3 | 15976 | save/project |
| `scalpTopologyTemplatePromise` | 4383 | 3 | 1 | 2 | 34 | scalp |
| `viewportFrameSelectionKey` | 10798 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38650 | 3 | 1 | 2 | 11 | (unclassified) |
| `scalpActiveVertexIndices` | 1451 | 2 | 1 | 1 | 24564 | scalp |
| `authoredScalpGuideMatrix` | 2064 | 2 | 1 | 1 | 2369 | scalp |
| `uvCheckerTexture` | 2082 | 2 | 0 | 2 | 26157 | hair/mesh |
| `proportionalRootLocked` | 2145 | 2 | 1 | 1 | 33681 | sculpt/edit |
| `pullCollisionEnabled` | 2274 | 2 | 1 | 1 | 31651 | (unclassified) |
| `lastHorizontalViewAxis` | 2276 | 2 | 2 | 0 | 34366 | (unclassified) |
| `panelSplitSnapWarningAcknowledged` | 3109 | 2 | 1 | 1 | 31174 | ui/panel |
| `projectSaveInProgress` | 3195 | 2 | 0 | 2 | 15912 | save/project |
| `lastExport` | 3198 | 2 | 0 | 2 | 15911 | save/project |
| `quickExportFileHandle` | 3199 | 2 | 0 | 2 | 15912 | save/project |
| `quickExportInProgress` | 3200 | 2 | 0 | 2 | 15913 | save/project |
| `pendingFileAction` | 3201 | 2 | 0 | 2 | 15914 | save/project |
| `fpsSampleStart` | 38651 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38652 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2076 | 1 | 0 | 1 | 1508 | (unclassified) |
| `braidSegmentBounds` | 2077 | 1 | 0 | 1 | 1508 | (unclassified) |