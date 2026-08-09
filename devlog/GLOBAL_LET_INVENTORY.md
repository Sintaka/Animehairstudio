# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **92** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| sculpt/edit | 53 | `drawStrandStroke`(137) `taperCurveEdit`(120) `viewportEditMode`(66) `sweepProfileEdit`(49) `viewPlaneMoveDrag`(45) |
| (unclassified) | 33 | `curveSurfaceDraft`(53) `duplicatePlacement`(35) `loftSurfaceDraft`(26) `proceduralDuplicatePreview`(17) `sideNamingPerspective`(12) |
| selection/outliner | 5 | `selectionMarqueeDrag`(22) `capsuleGuideLoopSelection`(13) `selectPointerCapture`(5) `selectionRemoveHeld`(4) `emptySelectionPointer`(3) |
| camera/viewport | 1 | `camera`(68) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `drawStrandStroke` | 2154 | 137 | 133 | 4 | 35831 | sculpt/edit |
| `taperCurveEdit` | 2228 | 120 | 117 | 3 | 31198 | sculpt/edit |
| `camera` | 476 | 68 | 63 | 5 | 38118 | camera/viewport |
| `viewportEditMode` | 2335 | 66 | 16 | 50 | 36188 | sculpt/edit |
| `curveSurfaceDraft` | 2159 | 53 | 50 | 3 | 36184 | (unclassified) |
| `sweepProfileEdit` | 2227 | 49 | 46 | 3 | 30848 | sculpt/edit |
| `viewPlaneMoveDrag` | 2220 | 45 | 41 | 4 | 35764 | sculpt/edit |
| `capsuleGuideEditing` | 2121 | 39 | 30 | 9 | 36178 | sculpt/edit |
| `mirrorXEditing` | 2117 | 37 | 36 | 1 | 33905 | sculpt/edit |
| `placeEdit` | 2153 | 35 | 31 | 4 | 36203 | sculpt/edit |
| `duplicatePlacement` | 2336 | 35 | 28 | 7 | 35643 | (unclassified) |
| `activeHandleEdit` | 2108 | 29 | 9 | 20 | 34527 | sculpt/edit |
| `branchRegionCanvasDrag` | 22659 | 29 | 22 | 7 | 482 | sculpt/edit |
| `proportionalEditing` | 2118 | 28 | 26 | 2 | 35500 | sculpt/edit |
| `headSetupEditing` | 2120 | 27 | 17 | 10 | 33401 | sculpt/edit |
| `loftSurfaceDraft` | 2158 | 26 | 23 | 3 | 35829 | (unclassified) |
| `proportionalSizeEdit` | 2166 | 23 | 21 | 2 | 36050 | sculpt/edit |
| `selectionMarqueeDrag` | 2142 | 22 | 14 | 8 | 36293 | selection/outliner |
| `relaxEdit` | 2152 | 22 | 19 | 3 | 34304 | sculpt/edit |
| `viewSnapDrag` | 2217 | 22 | 19 | 3 | 36361 | sculpt/edit |
| `proportionalHotkeyPress` | 2167 | 21 | 16 | 5 | 36049 | sculpt/edit |
| `proceduralDuplicatePreview` | 2339 | 17 | 9 | 8 | 29830 | (unclassified) |
| `transformDragging` | 2110 | 16 | 12 | 4 | 35870 | sculpt/edit |
| `hierarchyEditing` | 2116 | 16 | 14 | 2 | 33896 | sculpt/edit |
| `altOrbitDrag` | 2143 | 14 | 10 | 4 | 36435 | sculpt/edit |
| `branchRegionEdit` | 22658 | 14 | 12 | 2 | 10510 | sculpt/edit |
| `capsuleGuideLoopSelection` | 2122 | 13 | 8 | 5 | 8851 | selection/outliner |
| `polyBrushStroke` | 2156 | 13 | 7 | 6 | 33645 | sculpt/edit |
| `panelSplitDrag` | 2160 | 13 | 10 | 3 | 35828 | sculpt/edit |
| `objectSpaceEditing` | 2115 | 12 | 11 | 1 | 35929 | sculpt/edit |
| `sideNamingPerspective` | 2203 | 12 | 10 | 2 | 36476 | (unclassified) |
| `brushSizeDrag` | 2214 | 12 | 8 | 4 | 34930 | sculpt/edit |
| `strandWidthEdgeDrag` | 2215 | 12 | 8 | 4 | 35709 | sculpt/edit |
| `toolRadialGesture` | 2334 | 12 | 9 | 3 | 33505 | (unclassified) |
| `capsuleGuideLoopDrag` | 2123 | 11 | 7 | 4 | 35866 | sculpt/edit |
| `houdiniZoomDrag` | 2146 | 11 | 8 | 3 | 24305 | sculpt/edit |
| `toolTipsEnabled` | 2181 | 11 | 9 | 2 | 32812 | (unclassified) |
| `compactToolButtonsEnabled` | 2182 | 11 | 9 | 2 | 32812 | (unclassified) |
| `capsuleGuideDrawStroke` | 2155 | 10 | 6 | 4 | 35831 | sculpt/edit |
| `toolShortcutPress` | 2168 | 10 | 6 | 4 | 28438 | (unclassified) |
| `branchSweepStartDrag` | 23153 | 10 | 7 | 3 | 4400 | sculpt/edit |
| `scheduledTaperCurveEditFrame` | 17239 | 9 | 5 | 4 | 26 | sculpt/edit |
| `branchRegionZoomDrag` | 22780 | 9 | 7 | 2 | 89 | sculpt/edit |
| `transformScaleDrag` | 687 | 8 | 5 | 3 | 32081 | sculpt/edit |
| `referenceOverlayDrag` | 2104 | 8 | 4 | 4 | 9117 | sculpt/edit |
| `referenceCropDrag` | 2105 | 8 | 4 | 4 | 9116 | sculpt/edit |
| `sculptMoveStroke` | 2106 | 8 | 4 | 4 | 36084 | sculpt/edit |
| `placementPointer` | 2164 | 8 | 5 | 3 | 35992 | (unclassified) |
| `scaleSensitivity` | 2180 | 8 | 7 | 1 | 32812 | (unclassified) |
| `viewPlaneMoveEnabled` | 2218 | 8 | 5 | 3 | 28820 | (unclassified) |
| `taperMeshPointDrag` | 2229 | 8 | 4 | 4 | 31116 | sculpt/edit |
| `proceduralAccessoryEditHistoryOpen` | 33926 | 8 | 1 | 7 | 2172 | sculpt/edit |
| `compactAttributeEditorCollapsed` | 38598 | 8 | 6 | 2 | 73 | sculpt/edit |
| `uvInspectorDrag` | 2073 | 7 | 4 | 3 | 33605 | sculpt/edit |
| `activeLatticeMultiEdit` | 2109 | 7 | 2 | 5 | 10432 | sculpt/edit |
| `clumpUpdateInProgress` | 2162 | 7 | 1 | 6 | 25685 | (unclassified) |
| `viewPlaneNormalMoveHeld` | 2219 | 7 | 5 | 2 | 10252 | (unclassified) |
| `pullMoveEnabled` | 2221 | 7 | 5 | 2 | 28818 | (unclassified) |
| `branchRegionPanDrag` | 22781 | 7 | 5 | 2 | 89 | sculpt/edit |
| `sculptBrushGeometryFrame` | 2113 | 6 | 3 | 3 | 25756 | sculpt/edit |
| `pointRemovalCandidate` | 2145 | 6 | 0 | 6 | 35983 | (unclassified) |
| `toolRadialActions` | 2698 | 6 | 5 | 1 | 28324 | (unclassified) |
| `referenceScaleDrag` | 2103 | 5 | 3 | 2 | -1254 | sculpt/edit |
| `selectPointerCapture` | 2148 | 5 | 2 | 3 | 24235 | selection/outliner |
| `brushSizeHotkeyHeld` | 2216 | 5 | 2 | 3 | 35172 | sculpt/edit |
| `proceduralDuplicateModeActive` | 2337 | 5 | 1 | 4 | 29434 | (unclassified) |
| `proceduralDuplicateWindowSourceIds` | 2338 | 5 | 1 | 4 | 29157 | (unclassified) |
| `groupDefaultsWarningContinuation` | 3043 | 5 | 0 | 5 | 29897 | (unclassified) |
| `taperCurveEditInteractiveDirty` | 17240 | 5 | 1 | 4 | 26 | sculpt/edit |
| `proceduralAccessoryEditPointerActive` | 33927 | 5 | 1 | 4 | 2170 | sculpt/edit |
| `sculptBrushViableLockIds` | 37225 | 5 | 2 | 3 | 46 | sculpt/edit |
| `selectionRemoveHeld` | 690 | 4 | 1 | 3 | 35387 | selection/outliner |
| `sculptBrushShiftSmoothHeld` | 2107 | 4 | 2 | 2 | 8756 | sculpt/edit |
| `curvePointInsertionCandidate` | 2147 | 4 | 0 | 4 | 35980 | (unclassified) |
| `activeCapsuleGuideEdit` | 2161 | 4 | 2 | 2 | 7696 | sculpt/edit |
| `pullRigidity` | 2223 | 4 | 3 | 1 | 31618 | (unclassified) |
| `rebuildingProceduralDuplicatePreview` | 2340 | 4 | 2 | 2 | 29183 | (unclassified) |
| `groupDefaultsWarningAcknowledged` | 3042 | 4 | 3 | 1 | 29888 | (unclassified) |
| `uniformScaleDrag` | 686 | 3 | 0 | 3 | 31994 | sculpt/edit |
| `transformPrecisionDrag` | 688 | 3 | 0 | 3 | 32048 | sculpt/edit |
| `blenderNavigationDrag` | 2144 | 3 | 1 | 2 | 24225 | sculpt/edit |
| `emptySelectionPointer` | 2165 | 3 | 0 | 3 | 35979 | selection/outliner |
| `pendingDroppedApplicationKind` | 2591 | 3 | 0 | 3 | 30909 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2593 | 3 | 1 | 2 | 30908 | (unclassified) |
| `fpsFrameCount` | 38564 | 3 | 1 | 2 | 11 | (unclassified) |
| `proportionalRootLocked` | 2119 | 2 | 1 | 1 | 33622 | sculpt/edit |
| `pullCollisionEnabled` | 2222 | 2 | 1 | 1 | 31622 | (unclassified) |
| `lastHorizontalViewAxis` | 2224 | 2 | 2 | 0 | 34333 | (unclassified) |
| `fpsSampleStart` | 38565 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38566 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2069 | 1 | 0 | 1 | 1442 | (unclassified) |
| `braidSegmentBounds` | 2070 | 1 | 0 | 1 | 1442 | (unclassified) |