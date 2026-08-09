# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **104** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| sculpt/edit | 53 | `drawStrandStroke`(137) `taperCurveEdit`(120) `viewportEditMode`(66) `sweepProfileEdit`(49) `viewPlaneMoveDrag`(45) |
| (unclassified) | 33 | `curveSurfaceDraft`(53) `duplicatePlacement`(35) `loftSurfaceDraft`(26) `proceduralDuplicatePreview`(17) `sideNamingPerspective`(12) |
| selection/outliner | 17 | `activeTool`(207) `selectionMarqueeDrag`(22) `selectedSurfaceObjectAnchorId`(15) `capsuleGuideLoopSelection`(13) `layerColorShiftsEnabled`(12) |
| camera/viewport | 1 | `camera`(68) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `activeTool` | 2108 | 207 | 108 | 99 | 36455 | selection/outliner |
| `drawStrandStroke` | 2159 | 137 | 133 | 4 | 35835 | sculpt/edit |
| `taperCurveEdit` | 2233 | 120 | 117 | 3 | 31202 | sculpt/edit |
| `camera` | 476 | 68 | 63 | 5 | 38127 | camera/viewport |
| `viewportEditMode` | 2343 | 66 | 16 | 50 | 36189 | sculpt/edit |
| `curveSurfaceDraft` | 2164 | 53 | 50 | 3 | 36188 | (unclassified) |
| `sweepProfileEdit` | 2232 | 49 | 46 | 3 | 30852 | sculpt/edit |
| `viewPlaneMoveDrag` | 2225 | 45 | 41 | 4 | 35768 | sculpt/edit |
| `capsuleGuideEditing` | 2125 | 39 | 30 | 9 | 36183 | sculpt/edit |
| `mirrorXEditing` | 2121 | 37 | 36 | 1 | 33910 | sculpt/edit |
| `placeEdit` | 2158 | 35 | 31 | 4 | 36207 | sculpt/edit |
| `duplicatePlacement` | 2344 | 35 | 28 | 7 | 35644 | (unclassified) |
| `activeHandleEdit` | 2112 | 29 | 9 | 20 | 34532 | sculpt/edit |
| `branchRegionCanvasDrag` | 22668 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2122 | 28 | 26 | 2 | 35505 | sculpt/edit |
| `headSetupEditing` | 2124 | 27 | 17 | 10 | 33406 | sculpt/edit |
| `loftSurfaceDraft` | 2163 | 26 | 23 | 3 | 35833 | (unclassified) |
| `proportionalSizeEdit` | 2171 | 23 | 21 | 2 | 36054 | sculpt/edit |
| `selectionMarqueeDrag` | 2146 | 22 | 14 | 8 | 36298 | selection/outliner |
| `relaxEdit` | 2157 | 22 | 19 | 3 | 34308 | sculpt/edit |
| `viewSnapDrag` | 2222 | 22 | 19 | 3 | 36365 | sculpt/edit |
| `proportionalHotkeyPress` | 2172 | 21 | 16 | 5 | 36053 | sculpt/edit |
| `proceduralDuplicatePreview` | 2347 | 17 | 9 | 8 | 29831 | (unclassified) |
| `transformDragging` | 2114 | 16 | 12 | 4 | 35875 | sculpt/edit |
| `hierarchyEditing` | 2120 | 16 | 14 | 2 | 33901 | sculpt/edit |
| `selectedSurfaceObjectAnchorId` | 2155 | 15 | 4 | 11 | 34486 | selection/outliner |
| `altOrbitDrag` | 2147 | 14 | 10 | 4 | 36440 | sculpt/edit |
| `branchRegionEdit` | 22667 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `capsuleGuideLoopSelection` | 2126 | 13 | 8 | 5 | 8856 | selection/outliner |
| `polyBrushStroke` | 2161 | 13 | 7 | 6 | 33649 | sculpt/edit |
| `panelSplitDrag` | 2165 | 13 | 10 | 3 | 35832 | sculpt/edit |
| `objectSpaceEditing` | 2119 | 12 | 11 | 1 | 35934 | sculpt/edit |
| `layerColorShiftsEnabled` | 2194 | 12 | 10 | 2 | 32812 | selection/outliner |
| `sideNamingPerspective` | 2208 | 12 | 10 | 2 | 36481 | (unclassified) |
| `brushSizeDrag` | 2219 | 12 | 8 | 4 | 34934 | sculpt/edit |
| `strandWidthEdgeDrag` | 2220 | 12 | 8 | 4 | 35713 | sculpt/edit |
| `outlinerContextTarget` | 2341 | 12 | 5 | 7 | 30300 | selection/outliner |
| `toolRadialGesture` | 2342 | 12 | 9 | 3 | 33506 | (unclassified) |
| `capsuleGuideLoopDrag` | 2127 | 11 | 7 | 4 | 35871 | sculpt/edit |
| `houdiniZoomDrag` | 2150 | 11 | 8 | 3 | 24310 | sculpt/edit |
| `toolTipsEnabled` | 2186 | 11 | 9 | 2 | 32816 | (unclassified) |
| `compactToolButtonsEnabled` | 2187 | 11 | 9 | 2 | 32816 | (unclassified) |
| `outlinerFolderColorsEnabled` | 2195 | 11 | 9 | 2 | 32812 | selection/outliner |
| `capsuleGuideDrawStroke` | 2160 | 10 | 6 | 4 | 35835 | sculpt/edit |
| `toolShortcutPress` | 2173 | 10 | 6 | 4 | 28442 | (unclassified) |
| `branchSweepStartDrag` | 23162 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `scheduledTaperCurveEditFrame` | 17248 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22789 | 9 | 7 | 2 | 89 | sculpt/edit |
| `transformScaleDrag` | 687 | 8 | 5 | 3 | 32090 | sculpt/edit |
| `referenceOverlayDrag` | 2106 | 8 | 4 | 4 | 9124 | sculpt/edit |
| `referenceCropDrag` | 2107 | 8 | 4 | 4 | 9123 | sculpt/edit |
| `sculptMoveStroke` | 2110 | 8 | 4 | 4 | 36089 | sculpt/edit |
| `placementPointer` | 2169 | 8 | 5 | 3 | 35996 | (unclassified) |
| `scaleSensitivity` | 2185 | 8 | 7 | 1 | 32816 | (unclassified) |
| `viewPlaneMoveEnabled` | 2223 | 8 | 5 | 3 | 28824 | (unclassified) |
| `taperMeshPointDrag` | 2234 | 8 | 4 | 4 | 31120 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 33935 | 8 | 1 | 7 | 2172 | sculpt/edit |
| `compactOutlinerCollapsed` | 38607 | 8 | 6 | 2 | 71 | selection/outliner |
| `compactAttributeEditorCollapsed` | 38608 | 8 | 6 | 2 | 73 | sculpt/edit |
| `uvInspectorDrag` | 2073 | 7 | 4 | 3 | 33614 | sculpt/edit |
| `isolatedStrandIds` | 2085 | 7 | 4 | 3 | 34086 | selection/outliner |
| `lockIndex` | 2102 | 7 | 5 | 2 | 27383 | selection/outliner |
| `activeLatticeMultiEdit` | 2113 | 7 | 2 | 5 | 10437 | sculpt/edit |
| `clumpUpdateInProgress` | 2167 | 7 | 1 | 6 | 25689 | (unclassified) |
| `viewPlaneNormalMoveHeld` | 2224 | 7 | 5 | 2 | 10256 | (unclassified) |
| `pullMoveEnabled` | 2226 | 7 | 5 | 2 | 28822 | (unclassified) |
| `branchRegionPanDrag` | 22790 | 7 | 5 | 2 | 89 | sculpt/edit |
| `sculptBrushGeometryFrame` | 2117 | 6 | 3 | 3 | 25761 | sculpt/edit |
| `pointRemovalCandidate` | 2149 | 6 | 0 | 6 | 35988 | (unclassified) |
| `selectionSetsOpen` | 2335 | 6 | 3 | 3 | 29791 | selection/outliner |
| `activeOutlinerTab` | 2340 | 6 | 0 | 6 | 5354 | selection/outliner |
| `toolRadialActions` | 2706 | 6 | 5 | 1 | 28325 | (unclassified) |
| `referenceScaleDrag` | 2105 | 5 | 3 | 2 | -1256 | sculpt/edit |
| `selectPointerCapture` | 2152 | 5 | 2 | 3 | 24240 | selection/outliner |
| `brushSizeHotkeyHeld` | 2221 | 5 | 2 | 3 | 35176 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2345 | 5 | 1 | 4 | 29435 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2346 | 5 | 1 | 4 | 29158 | (unclassified) |
| `groupDefaultsWarningContinuation` | 3051 | 5 | 0 | 5 | 29898 | (unclassified) |
| `taperCurveEditInteractiveDirty` | 17249 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 33936 | 5 | 1 | 4 | 2170 | sculpt/edit |
| `sculptBrushViableLockIds` | 37234 | 5 | 2 | 3 | 46 | sculpt/edit |
| `selectionRemoveHeld` | 690 | 4 | 1 | 3 | 35396 | selection/outliner |
| `sculptBrushShiftSmoothHeld` | 2111 | 4 | 2 | 2 | 8761 | sculpt/edit |
| `curvePointInsertionCandidate` | 2151 | 4 | 0 | 4 | 35985 | (unclassified) |
| `activeCapsuleGuideEdit` | 2166 | 4 | 2 | 2 | 7699 | sculpt/edit |
| `pullRigidity` | 2228 | 4 | 3 | 1 | 31622 | (unclassified) |
| `rebuildingProceduralDuplicatePreview` | 2348 | 4 | 2 | 2 | 29184 | (unclassified) |
| `groupDefaultsWarningAcknowledged` | 3050 | 4 | 3 | 1 | 29889 | (unclassified) |
| `uniformScaleDrag` | 686 | 3 | 0 | 3 | 32003 | sculpt/edit |
| `transformPrecisionDrag` | 688 | 3 | 0 | 3 | 32057 | sculpt/edit |
| `viewportSelectionMode` | 2109 | 3 | 0 | 3 | 4694 | selection/outliner |
| `blenderNavigationDrag` | 2148 | 3 | 1 | 2 | 24230 | sculpt/edit |
| `emptySelectionPointer` | 2170 | 3 | 0 | 3 | 35983 | selection/outliner |
| `pendingDroppedApplicationKind` | 2599 | 3 | 0 | 3 | 30910 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2601 | 3 | 1 | 2 | 30909 | (unclassified) |
| `viewportFrameSelectionKey` | 10731 | 3 | 1 | 2 | 19 | selection/outliner |
| `fpsFrameCount` | 38573 | 3 | 1 | 2 | 11 | (unclassified) |
| `proportionalRootLocked` | 2123 | 2 | 1 | 1 | 33627 | sculpt/edit |
| `pullCollisionEnabled` | 2227 | 2 | 1 | 1 | 31626 | (unclassified) |
| `lastHorizontalViewAxis` | 2229 | 2 | 2 | 0 | 34337 | (unclassified) |
| `fpsSampleStart` | 38574 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38575 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2069 | 1 | 0 | 1 | 1450 | (unclassified) |
| `braidSegmentBounds` | 2070 | 1 | 0 | 1 | 1450 | (unclassified) |