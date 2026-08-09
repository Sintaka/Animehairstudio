# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1729** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38682 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 256 | function |  | 3 |
| `saveBooleanPreference` | 284 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 288 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 293 | function |  | 2 |
| `normalizeScaleSensitivity` | 298 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 303 | function |  | 2 |
| `normalizeSideNamingPerspective` | 308 | function |  | 2 |
| `normalizeNavigationStyle` | 312 | function |  | 2 |
| `setupEditableSliderControls` | 327 | function |  | 2 |
| `syncNumberFromRange` | 378 | arrow |  | 0 |
| `applyNumberValue` | 385 | arrow |  | 0 |
| `copyCameraPose` | 491 | function |  | 3 |
| `updateCameraProjectionForViewport` | 497 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 510 | function |  | 3 |
| `setOrthographicView` | 516 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 556 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 585 | function |  | 2 |
| `removeRotateFreeAxisRing` | 611 | function |  | 2 |
| `deflateTransformGizmoPickers` | 623 | function |  | 2 |
| `nextStrandName` | 1005 | function |  | 2 |
| `activeDrawClumpTemplate` | 1090 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1095 | function |  | 3 |
| `drawModeCreatesClump` | 1122 | function |  | 1 |
| `isPanelGeometry` | 1266 | function |  | 31 |
| `normalizePanelSplits` | 1270 | function |  | 3 |
| `clonePanelSplits` | 1282 | function |  | 19 |
| `snapPanelSplitHeight` | 1286 | function |  | 5 |
| `createQuadSphereGeometry` | 1321 | function |  | 2 |
| `vertexIndex` | 1335 | function |  | 11 |
| `addEdge` | 1353 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1388 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1458 | function |  | 3 |
| `updateScalpRenderGeometry` | 1484 | function |  | 4 |
| `writeScalpRegionColors` | 1535 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1548 | function |  | 2 |
| `createScalpSelectionOutline` | 1578 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1620 | function |  | 25 |
| `activeScalpSurfaceWire` | 1625 | function |  | 2 |
| `activeScalpSelectionOutline` | 1630 | function |  | 2 |
| `inferredCustomScalpRegion` | 1635 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1642 | function |  | 5 |
| `customScalpGeometryFromObject` | 1661 | function |  | 2 |
| `customScalpWireGeometry` | 1693 | function |  | 3 |
| `installCustomScalpGeometry` | 1704 | function |  | 3 |
| `installCustomScalpGuide` | 1728 | function |  | 3 |
| `setScalpGuideSource` | 1746 | function |  | 7 |
| `updateScalpQuadWire` | 1762 | function |  | 4 |
| `updateScalpTopology` | 1778 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1842 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2022 | function |  | 2 |
| `currentStrandSelectionState` | 2086 | function |  | 4 |
| `applyStrandSelectionState` | 2090 | function |  | 5 |
| `clearStrandSelectionState` | 2095 | function |  | 7 |
| `guideHeadBounds` | 3138 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3148 | function |  | 5 |
| `disposeGuideModel` | 3162 | function |  | 3 |
| `syncHeadTransformInputs` | 3173 | function |  | 4 |
| `applyHeadTransform` | 3180 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3198 | function |  | 4 |
| `applyScalpRoughScale` | 3207 | function |  | 5 |
| `resetHeadTransform` | 3221 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3235 | function |  | 2 |
| `installGuideModel` | 3251 | function |  | 5 |
| `loadDefaultGuideModel` | 3327 | function |  | 3 |
| `braidTemplateFromEntries` | 3350 | function |  | 4 |
| `braidMeshEntries` | 3382 | function |  | 2 |
| `prepareBraidBodyCache` | 3394 | function |  | 2 |
| `quantize` | 3403 | arrow |  | 21 |
| `sourceNormalAt` | 3415 | arrow |  | 1 |
| `clusterBoundary` | 3418 | arrow |  | 2 |
| `normalBuckets` | 3435 | arrow |  | 2 |
| `applyBucketPair` | 3467 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3498 | function |  | 2 |
| `annotateBraidObjTopology` | 3519 | function |  | 2 |
| `loadBraidMeshPreset` | 3539 | function |  | 3 |
| `createSplitControlHandle` | 3556 | function |  | 4 |
| `frameGuideModel` | 3571 | function |  | 2 |
| `syncScalpInputs` | 3596 | function |  | 2 |
| `syncScalpArtistInputs` | 3602 | function |  | 2 |
| `rootScalpOffsetDistance` | 3610 | function |  | 15 |
| `applyLockRootScalpOffset` | 3615 | function |  | 5 |
| `normalizeHairLayer` | 3631 | function |  | 28 |
| `layerOffsetForLock` | 3635 | function |  | 9 |
| `layerRootOffsetFactor` | 3640 | function |  | 13 |
| `layerOffsetWeight` | 3644 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3650 | function |  | 5 |
| `pointsWithLayerOffset` | 3659 | function |  | 3 |
| `layerDirectionForLock` | 3667 | function |  | 2 |
| `applyLayerOffset` | 3678 | function |  | 5 |
| `setLockHairLayer` | 3702 | function |  | 2 |
| `setGroupLayerOffset` | 3717 | function |  | 2 |
| `scalpArtistWeight` | 3729 | function |  | 3 |
| `scalpArtistScalesAt` | 3733 | function |  | 3 |
| `applyScalpArtistShape` | 3743 | function |  | 5 |
| `inverseScalpArtistShape` | 3761 | function |  | 2 |
| `updateScalpSurface` | 3788 | function |  | 3 |
| `setActiveScalpRegion` | 3798 | function |  | 2 |
| `clearScalpRegions` | 3810 | function |  | 2 |
| `scalpHitFromEvent` | 3827 | function |  | 3 |
| `updateScalpBrushCursor` | 3835 | function |  | 4 |
| `paintScalpAt` | 3850 | function |  | 3 |
| `beginScalpPaint` | 3917 | function |  | 2 |
| `updateScalpPaint` | 3926 | function |  | 1 |
| `endScalpPaint` | 3935 | function |  | 2 |
| `createScalpLattice` | 3942 | function |  | 2 |
| `resetScalpLattice` | 3967 | function |  | 1 |
| `updateScalpLatticeObjects` | 3979 | function |  | 7 |
| `quadraticWeights` | 3993 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3998 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4025 | function |  | 3 |
| `selectScalpLatticePoint` | 4040 | function |  | 2 |
| `beginScalpLatticeDrag` | 4055 | function |  | 2 |
| `updateScalpLatticeDrag` | 4073 | function |  | 1 |
| `endScalpLatticeDrag` | 4091 | function |  | 2 |
| `setHeadReferenceTransparency` | 4097 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4107 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4125 | function |  | 3 |
| `trianglePlaneIntersections` | 4133 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4154 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4180 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4190 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4202 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4226 | function |  | 3 |
| `createScalpBuilderPlanes` | 4241 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4273 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4311 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4334 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4346 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4358 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4363 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4375 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4485 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4510 | function |  | 5 |
| `syncEditedScalpSurface` | 4525 | function |  | 4 |
| `ensureEditedScalpSurface` | 4596 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4626 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4711 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4724 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4740 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4750 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4768 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4781 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4788 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4807 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4821 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4862 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4871 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4884 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4905 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5042 | function |  | 2 |
| `scalpTemplateNeighbors` | 5050 | function |  | 2 |
| `smoothScalpVectorField` | 5062 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5076 | function |  | 2 |
| `upperContourCurve` | 5093 | function |  | 4 |
| `hermitePoint` | 5128 | function |  | 2 |
| `curveNetworkSection` | 5139 | function |  | 3 |
| `pointAlongSection` | 5168 | function |  | 3 |
| `longestStitchedContour` | 5174 | function |  | 2 |
| `nodeForPoint` | 5182 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5239 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5249 | function |  | 1 |
| `orderedRange` | 5261 | arrow |  | 3 |
| `clipSegment` | 5284 | arrow |  | 1 |
| `liftedPoint` | 5307 | arrow |  | 5 |
| `boundaryCorner` | 5312 | arrow |  | 4 |
| `surfaceCurveBetween` | 5321 | arrow |  | 1 |
| `addSurfaceConnector` | 5344 | arrow |  | 2 |
| `sideContourAtDepth` | 5412 | arrow |  | 3 |
| `addSurfacePatch` | 5446 | arrow |  | 1 |
| `addCenterBridgePatch` | 5526 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5634 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5669 | function |  | 1 |
| `generatedScalpObjContent` | 5759 | function |  | 2 |
| `generateScalpFromBuilder` | 5773 | function |  | 1 |
| `orderedDepthRange` | 5809 | arrow |  | 7 |
| `resetScalpBuilder` | 5938 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5953 | function |  | 1 |
| `beginScalpBuilderInput` | 5967 | function |  | 2 |
| `updateScalpBuilderStroke` | 5968 | function |  | 1 |
| `finishScalpBuilderStroke` | 5969 | function |  | 2 |
| `setScalpBuilderEditing` | 5971 | function |  | 10 |
| `updateScalpEditingVisibility` | 6005 | function |  | 12 |
| `exitSetupEditors` | 6099 | function |  | 7 |
| `setCapsuleGuideEditing` | 6108 | function |  | 5 |
| `syncAppMenuVisibility` | 6136 | function |  | 3 |
| `closeAppMenus` | 6141 | function |  | 6 |
| `setAppMenuOpen` | 6152 | function |  | 3 |
| `setTurntableActive` | 6159 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6168 | function |  | 9 |
| `selectedReferenceImage` | 6172 | function |  | 20 |
| `normalizeReferenceCrop` | 6178 | function |  | 8 |
| `referenceCropIsFull` | 6186 | function |  | 3 |
| `referencePlaneFrontAxis` | 6191 | function |  | 4 |
| `referencePlanePlacement` | 6200 | function |  | 4 |
| `migratedReferencePlanePosition` | 6215 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6235 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6252 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6268 | function |  | 2 |
| `snappedReferenceImageView` | 6291 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6297 | function |  | 5 |
| `applyReferenceImageRuntime` | 6313 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6356 | function |  | 6 |
| `createReferenceImageRuntime` | 6364 | function |  | 3 |
| `addReferenceImage` | 6433 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6485 | function |  | 3 |
| `disposeReferenceImage` | 6504 | function |  | 2 |
| `clearReferenceImages` | 6508 | function |  | 2 |
| `serializeReferenceImage` | 6515 | function |  | 1 |
| `setReferenceImageType` | 6543 | function |  | 2 |
| `attachReferenceImageTransform` | 6587 | function |  | 6 |
| `selectReferenceImage` | 6601 | function |  | 12 |
| `placeReferencePlane` | 6624 | function |  | 2 |
| `setReferencePlaneInFront` | 6635 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6645 | function |  | 4 |
| `renderReferenceImagePanel` | 6664 | function |  | 20 |
| `setOutlinerTab` | 6711 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6729 | function |  | 4 |
| `componentEditModeActive` | 6733 | function |  | 38 |
| `selectionToolSupportsPicking` | 6737 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6742 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6758 | function |  | 2 |
| `setViewportSelectionMode` | 6788 | function |  | 4 |
| `setViewportEditMode` | 6800 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6842 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6856 | function |  | 8 |
| `outlinerGuides` | 6868 | function |  | 3 |
| `guideOutlinerLabel` | 6875 | function |  | 2 |
| `normalizeOutlinerName` | 6885 | function |  | 4 |
| `beginOutlinerRename` | 6890 | function |  | 2 |
| `finish` | 6901 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6931 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6941 | function |  | 2 |
| `renderGuideOutliner` | 6976 | function |  | 10 |
| `referenceOutlinerGroup` | 7034 | function |  | 2 |
| `renderReferenceOutliner` | 7038 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7155 | function |  | 5 |
| `readReferenceImageFile` | 7160 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7184 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7191 | function |  | 3 |
| `dragContainsReferenceImage` | 7236 | function |  | 3 |
| `setReferenceImageDragActive` | 7247 | function |  | 9 |
| `referenceDropDestination` | 7255 | function |  | 2 |
| `viewportOverlayDropPosition` | 7261 | function |  | 2 |
| `setReferenceDropHover` | 7270 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7288 | function |  | 2 |
| `referenceOverlayAtPointer` | 7308 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7326 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7339 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7385 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7435 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7457 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7468 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7494 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7503 | function |  | 2 |
| `referenceCropCursor` | 7518 | function |  | 3 |
| `updateReferenceCropHandles` | 7524 | function |  | 5 |
| `referenceCropSourcePoint` | 7545 | function |  | 2 |
| `beginReferenceCrop` | 7552 | function |  | 1 |
| `updateReferenceCrop` | 7590 | function |  | 1 |
| `finishReferenceCrop` | 7622 | function |  | 4 |
| `setHeadSetupEditing` | 7640 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7656 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7665 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7675 | function |  | 4 |
| `setScalpGuideVisibility` | 7681 | function |  | 12 |
| `currentGuideViewMode` | 7689 | function |  | 3 |
| `updateGuideViewToggle` | 7697 | function |  | 5 |
| `setGuideViewMode` | 7713 | function |  | 3 |
| `cycleGuideViewMode` | 7724 | function |  | 1 |
| `hideGuideViewContextMenu` | 7729 | function |  | 6 |
| `showGuideViewContextMenu` | 7733 | function |  | 1 |
| `strandPassesDisplayFilters` | 7746 | function |  | 4 |
| `strandVisibleForDisplay` | 7755 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7760 | function |  | 2 |
| `lockedStrandsExist` | 7764 | function |  | 3 |
| `hiddenStrandsExist` | 7768 | function |  | 2 |
| `hideSelectedStrands` | 7772 | function |  | 2 |
| `unhideHiddenStrands` | 7782 | function |  | 2 |
| `strandIsolationActive` | 7791 | function |  | 7 |
| `setStrandIsolation` | 7795 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7807 | function |  | 3 |
| `syncVisibilityParent` | 7818 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7825 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7854 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7861 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7881 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7904 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7912 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7919 | function |  | 9 |
| `setScalpLatticeEditing` | 7930 | function |  | 4 |
| `setScalpShapeEditing` | 7945 | function |  | 9 |
| `setScalpPaintEditing` | 7963 | function |  | 7 |
| `defaultCurveLatticePoints` | 7987 | function |  | 3 |
| `flatCurveLatticePoints` | 8013 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8022 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8046 | function |  | 4 |
| `horizontalValue` | 8051 | arrow |  | 1 |
| `blendedSample` | 8062 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8095 | function |  | 2 |
| `curveLatticeControlPoint` | 8110 | function |  | 9 |
| `circularArcTangent` | 8114 | function |  | 4 |
| `arcLengthTo` | 8145 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8157 | function |  | 3 |
| `sampleHermiteCurve` | 8196 | function |  | 10 |
| `sampleCurveLattice` | 8213 | function |  | 6 |
| `curveLatticeNormal` | 8232 | function |  | 1 |
| `createCurveLatticeGeometry` | 8243 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8272 | function |  | 3 |
| `appendCurve` | 8274 | arrow |  | 4 |
| `sample` | 8276 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8303 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8319 | function |  | 3 |
| `addPicker` | 8321 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8360 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8373 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8377 | function |  | 3 |
| `curveLatticeEditablePoint` | 8395 | function |  | 13 |
| `curveLatticePointSection` | 8402 | function |  | 3 |
| `curveLatticeRestPoint` | 8413 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8419 | function |  | 7 |
| `curveLatticeRootColumns` | 8425 | function |  | 3 |
| `curveTangentsForPoints` | 8432 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8444 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8481 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8507 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8524 | function |  | 3 |
| `resampleGrid` | 8534 | arrow |  | 2 |
| `controlPointIsSelected` | 8561 | function |  | 7 |
| `clearMultiPointSelection` | 8569 | function |  | 9 |
| `createCurveLatticeHandles` | 8573 | function |  | 4 |
| `addCurveLattice` | 8595 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8704 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8735 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8741 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8780 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8801 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8818 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8827 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8834 | function |  | 1 |
| `selectCurveLatticeLoop` | 8853 | function |  | 3 |
| `selectCurveLatticePoint` | 8882 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8897 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8939 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8960 | function |  | 3 |
| `curveLatticeColumnPoints` | 9003 | function |  | 3 |
| `groupCurveControlIndices` | 9012 | function |  | 4 |
| `groupCurveControlPoints` | 9018 | function |  | 2 |
| `updateGroupCurveDisplay` | 9024 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9034 | function |  | 2 |
| `groupCurveDeformationPairs` | 9056 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9063 | function |  | 2 |
| `appendPairs` | 9065 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9076 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9095 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9116 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9135 | function |  | 2 |
| `capsuleGuideCapHeight` | 9169 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9173 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9178 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9182 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9194 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9210 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9216 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9242 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9272 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9326 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9347 | function |  | 7 |
| `vertex` | 9361 | function |  | 4 |
| `addFace` | 9367 | function |  | 3 |
| `addRing` | 9385 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9440 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9450 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9515 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9561 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9574 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9595 | function |  | 3 |
| `capsuleGuidePointDistances` | 9600 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9621 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9641 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9646 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9652 | function |  | 3 |
| `capsuleGuideAccentColor` | 9657 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9662 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9673 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9685 | function |  | 2 |
| `createCapsuleGuideHandles` | 9717 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9740 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9759 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9766 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9782 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9799 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9814 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9851 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9867 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9884 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9890 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9917 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9929 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9948 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9993 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10028 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10042 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10048 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10065 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10076 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10087 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10117 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10127 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10168 | function |  | 3 |
| `createQuadCageGeometry` | 10184 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10208 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10228 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10239 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10292 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10330 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10340 | function |  | 4 |
| `addCapsuleGuide` | 10348 | function |  | 4 |
| `addGuide` | 10417 | function |  | 1 |
| `createGuideGeometry` | 10478 | function |  | 4 |
| `selectGuide` | 10533 | function |  | 17 |
| `updateGuideControlsVisibility` | 10601 | function |  | 10 |
| `updateViewportToolVisibility` | 10618 | function |  | 7 |
| `getSelectedGuide` | 10657 | function |  | 34 |
| `selectedViewportFocusBounds` | 10661 | function |  | 2 |
| `frameViewportBounds` | 10675 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10705 | function |  | 2 |
| `fullSceneFocusBounds` | 10709 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10724 | function |  | 3 |
| `cycleViewportFraming` | 10733 | function |  | 2 |
| `syncGuideInputs` | 10751 | function |  | 5 |
| `updateGuideGeometry` | 10794 | function |  | 3 |
| `sculptBrushToolActive` | 10815 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10819 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10823 | function |  | 3 |
| `effectiveSculptBrushTool` | 10827 | function |  | 13 |
| `updateSculptScaleModeRow` | 10833 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10838 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10860 | function |  | 5 |
| `setActiveTool` | 10869 | function |  | 19 |
| `setDrawStrandMode` | 11007 | function |  | 2 |
| `setObjectSpaceEditing` | 11017 | function |  | 7 |
| `setHierarchyEditing` | 11033 | function |  | 4 |
| `setProportionalEditing` | 11045 | function |  | 5 |
| `beginProportionalSizeEdit` | 11064 | function |  | 3 |
| `updateProportionalSizeEdit` | 11076 | function |  | 2 |
| `endProportionalSizeEdit` | 11087 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11094 | function |  | 2 |
| `refreshProportionalPreview` | 11102 | function |  | 4 |
| `activeBrushSizeInput` | 11112 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11121 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11133 | function |  | 2 |
| `beginBrushSizeDrag` | 11151 | function |  | 1 |
| `updateBrushSizeDrag` | 11178 | function |  | 1 |
| `finishBrushSizeDrag` | 11199 | function |  | 2 |
| `updateInteractionLocks` | 11216 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11225 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11234 | function |  | 2 |
| `configureTransformControls` | 11265 | function |  | 16 |
| `pullMoveActive` | 11273 | function |  | 9 |
| `updatePullGuideVisual` | 11277 | function |  | 4 |
| `attachTransformForCurvePoint` | 11293 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11317 | function |  | 7 |
| `strandObjectRootIndex` | 11333 | function |  | 3 |
| `strandObjectRoot` | 11342 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11346 | function |  | 2 |
| `attachStrandObjectTransform` | 11351 | function |  | 6 |
| `guideObjectPivot` | 11374 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11385 | function |  | 2 |
| `attachGuideObjectTransform` | 11390 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11409 | function |  | 2 |
| `beginGuideObjectTransform` | 11437 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11444 | function |  | 2 |
| `updateGuideObjectTransform` | 11466 | function |  | 2 |
| `finishGuideObjectTransform` | 11499 | function |  | 2 |
| `clonePlacementFrame` | 11508 | function |  | 2 |
| `cloneOptionalVectors` | 11520 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11524 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11541 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11556 | function |  | 2 |
| `strandObjectTransformOperators` | 11572 | function |  | 4 |
| `transformPoint` | 11580 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11587 | arrow |  | 0 |
| `transformNormal` | 11593 | arrow |  | 10 |
| `transformDirection` | 11603 | arrow |  | 7 |
| `worldMatrixForPivot` | 11615 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11621 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11637 | function |  | 6 |
| `beginStrandObjectTransform` | 11651 | function |  | 2 |
| `updateStrandObjectTransform` | 11689 | function |  | 2 |
| `commitStrandObjectTransform` | 11738 | function |  | 2 |
| `mapPoints` | 11751 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11785 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11799 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11822 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11835 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11850 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11876 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11925 | function |  | 2 |
| `beginHandleEdit` | 11934 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11983 | function |  | 3 |
| `applyBranchRigidRootMove` | 12000 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12037 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12048 | function |  | 3 |
| `multiPointHandleEditActive` | 12059 | function |  | 7 |
| `applyMultiMove` | 12063 | function |  | 5 |
| `applyMultiRotate` | 12069 | function |  | 2 |
| `applyMultiScale` | 12078 | function |  | 2 |
| `applyHierarchicalMove` | 12087 | function |  | 3 |
| `applySingleMove` | 12099 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12103 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12120 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12129 | function |  | 3 |
| `changed` | 12139 | arrow |  | 1 |
| `applyPullMove` | 12181 | function |  | 3 |
| `pullHeadCollisionContext` | 12189 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12208 | function |  | 2 |
| `applyProportionalMove` | 12231 | function |  | 3 |
| `viewPlaneNormal` | 12242 | function |  | 20 |
| `isCameraInSnappedView` | 12246 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12254 | function |  | 10 |
| `updateViewPlaneGrid` | 12258 | function |  | 14 |
| `setViewPlaneMove` | 12315 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12326 | function |  | 2 |
| `rayFromViewportEvent` | 12334 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12342 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12352 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12363 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12376 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12395 | function |  | 4 |
| `beginViewPlaneMove` | 12402 | function |  | 3 |
| `updateViewPlaneMove` | 12466 | function |  | 1 |
| `endViewPlaneMove` | 12531 | function |  | 7 |
| `applyHierarchicalRotate` | 12550 | function |  | 2 |
| `rotateGuideNormal` | 12557 | arrow |  | 4 |
| `applySingleRotate` | 12595 | function |  | 2 |
| `applyProportionalRotate` | 12599 | function |  | 2 |
| `applyHierarchicalScale` | 12619 | function |  | 2 |
| `applySingleScale` | 12629 | function |  | 2 |
| `applyProportionalScale` | 12633 | function |  | 2 |
| `setPointScale` | 12649 | function |  | 8 |
| `proportionalWeight` | 12658 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12670 | function |  | 5 |
| `strandInfluenceColor` | 12676 | function |  | 17 |
| `beginRelaxEdit` | 12701 | function |  | 3 |
| `updateRelaxEdit` | 12730 | function |  | 1 |
| `endRelaxEdit` | 12790 | function |  | 1 |
| `disposeGuide` | 12800 | function |  | 3 |
| `removeGuideObjects` | 12828 | function |  | 3 |
| `strandRadiusAt` | 12842 | function |  | 5 |
| `strandProfileTopologyAt` | 12859 | function |  | 8 |
| `strandCurveParameters` | 12901 | function |  | 5 |
| `widthProfileAt` | 12911 | arrow |  | 1 |
| `braidFrameAt` | 12949 | function |  | 5 |
| `braidFrameAtExtended` | 12959 | function |  | 2 |
| `createBraidProfileProjector` | 12968 | function |  | 2 |
| `project` | 12984 | arrow |  | 17 |
| `createBraidGeometry` | 12999 | function |  | 2 |
| `deformationAt` | 13034 | function |  | 3 |
| `widthFor` | 13043 | arrow |  | 3 |
| `depthFor` | 13047 | arrow |  | 3 |
| `outputVertex` | 13079 | function |  | 7 |
| `appendAuthoredCap` | 13187 | function |  | 3 |
| `outputCapVertex` | 13194 | arrow |  | 6 |
| `capBoundary` | 13285 | function |  | 3 |
| `strandGeometryCurve` | 13347 | function |  | 15 |
| `strandGeometryFrameAt` | 13373 | function |  | 19 |
| `transportedStrandFrameAt` | 13436 | function |  | 7 |
| `twistOverrideAt` | 13439 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13467 | function |  | 2 |
| `weldPanelGeometryData` | 13503 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13543 | function |  | 3 |
| `surfacePanelPoint` | 13558 | function |  | 3 |
| `createPanelStrandGeometry` | 13581 | function |  | 2 |
| `addQuad` | 13615 | arrow |  | 6 |
| `near` | 13619 | arrow |  | 6 |
| `panelWidthAt` | 13649 | arrow |  | 6 |
| `panelThicknessAt` | 13658 | arrow |  | 6 |
| `panelFrameAt` | 13667 | arrow |  | 1 |
| `rawPanelPoint` | 13685 | arrow |  | 1 |
| `panelPoint` | 13705 | arrow |  | 2 |
| `addPatch` | 13711 | arrow |  | 1 |
| `splitOpening` | 13762 | arrow |  | 2 |
| `uStart` | 13786 | arrow |  | 1 |
| `uEnd` | 13789 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13827 | function |  | 3 |
| `inside` | 13828 | arrow |  | 2 |
| `pushOrientedTriangle` | 13850 | function |  | 7 |
| `triangulatePolygon3D` | 13861 | function |  | 1 |
| `orientedQuadFace` | 13901 | function |  | 2 |
| `createSplitStrandGeometry` | 13909 | function |  | 2 |
| `fusedIndexAt` | 14066 | arrow |  | 0 |
| `createHairCardGeometry` | 14115 | function |  | 2 |
| `createPolyGeometry` | 14214 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14241 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14250 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14297 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14305 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14321 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14330 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14341 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14349 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14359 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14379 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14402 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14481 | function |  | 2 |
| `pushBoundary` | 14510 | arrow |  | 5 |
| `boundaryAt` | 14528 | arrow |  | 3 |
| `hermite` | 14550 | arrow |  | 2 |
| `emitBottomMidRow` | 14595 | arrow |  | 2 |
| `emitTopMidRow` | 14694 | arrow |  | 2 |
| `sideHoleVertex` | 14736 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14785 | arrow |  | 2 |
| `emitFillStrip` | 14856 | arrow |  | 2 |
| `fillSide` | 14867 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14911 | arrow |  | 2 |
| `edgeDirection` | 14935 | arrow |  | 1 |
| `positionAt` | 14994 | arrow |  | 1 |
| `createBranchChildGeometry` | 15045 | function |  | 2 |
| `createCompoundStrandGeometry` | 15255 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15506 | function |  | 2 |
| `createHairGeometry` | 15537 | function |  | 6 |
| `createBaseHairGeometry` | 15589 | function |  | 3 |
| `hairMaterialDefinition` | 15707 | function |  | 4 |
| `materialForLock` | 15711 | function |  | 8 |
| `activeHairMaterialDefinition` | 15715 | function |  | 11 |
| `strandDisplayColor` | 15721 | function |  | 14 |
| `setAnimeHairBaseColor` | 15739 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15752 | function |  | 2 |
| `createHairMaterial` | 15792 | function |  | 5 |
| `createStrandSelectionOutline` | 15834 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15868 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15877 | function |  | 6 |
| `refreshMaterialUsers` | 15904 | function |  | 6 |
| `renderHairMaterialOutliner` | 15913 | function |  | 5 |
| `renderHairMaterialOptions` | 15943 | function |  | 3 |
| `syncHairMaterialEditor` | 15953 | function |  | 9 |
| `createProjectHairMaterial` | 15979 | function |  | 3 |
| `deleteActiveHairMaterial` | 15999 | function |  | 2 |
| `createHairTopologyGeometry` | 16017 | function |  | 4 |
| `createHairTopologyOverlay` | 16038 | function |  | 3 |
| `groupDefaultsFor` | 16085 | function |  | 9 |
| `creationToolActive` | 16092 | function |  | 8 |
| `activeCreationShapeDefaults` | 16096 | function |  | 11 |
| `activeStrandShapeTarget` | 16102 | function |  | 5 |
| `curvePolylineLength` | 16106 | function |  | 2 |
| `curvePolylineLengths` | 16114 | function |  | 3 |
| `samplePolylineDistance` | 16122 | function |  | 2 |
| `applyProjectedCurveLength` | 16132 | function |  | 4 |
| `clearRegionLengthBaseline` | 16163 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16170 | function |  | 2 |
| `setGroupLengthScale` | 16178 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16216 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16248 | function |  | 1 |
| `activeSweepProfile` | 16257 | function |  | 9 |
| `activeSweepProfileTarget` | 16264 | function |  | 6 |
| `trimmedSweepProfile` | 16271 | function |  | 7 |
| `roundedLeft` | 16280 | arrow |  | 1 |
| `roundedRight` | 16286 | arrow |  | 1 |
| `activeProfileOffset` | 16303 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16310 | function |  | 3 |
| `profileToCanvas` | 16327 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16331 | function |  | 11 |
| `sampleSweepProfile` | 16340 | function |  | 7 |
| `createSweepProfileTopology` | 16361 | function |  | 5 |
| `renderProfilePreview` | 16403 | function |  | 8 |
| `renderHairCardCoveragePath` | 16422 | function |  | 3 |
| `activeTaperTarget` | 16437 | function |  | 15 |
| `twistCurveEditing` | 16444 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16448 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16452 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16456 | function |  | 17 |
| `taperAsymmetryKey` | 16460 | function |  | 12 |
| `taperSecondaryKey` | 16464 | function |  | 11 |
| `activeTaperCurve` | 16468 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16479 | function |  | 6 |
| `taperSamples` | 16489 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16496 | function |  | 2 |
| `renderTaperPreview` | 16518 | function |  | 13 |
| `renderTwistCurvePreview` | 16554 | function |  | 5 |
| `cloneShapePresetValue` | 16572 | function |  | 66 |
| `shapeValuesMatch` | 16576 | function |  | 5 |
| `shapeTargetForSelect` | 16584 | function |  | 4 |
| `loadCustomShapePresets` | 16591 | function |  | 2 |
| `saveCustomShapePresets` | 16602 | function |  | 4 |
| `shapePresetLabel` | 16610 | function |  | 4 |
| `setupShapePresetControls` | 16615 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16640 | function |  | 3 |
| `syncShapePresetSelects` | 16646 | function |  | 8 |
| `populateShapePresetSelects` | 16667 | function |  | 5 |
| `applyShapePreset` | 16694 | function |  | 2 |
| `openSaveShapePreset` | 16731 | function |  | 2 |
| `commitCustomShapePreset` | 16756 | function |  | 2 |
| `openRemoveShapePreset` | 16779 | function |  | 2 |
| `commitRemoveShapePreset` | 16792 | function |  | 2 |
| `taperPointToCanvas` | 16808 | function |  | 4 |
| `canvasToTaperPoint` | 16825 | function |  | 2 |
| `clearTaperMeshPoints` | 16861 | function |  | 2 |
| `taperMeshPointFrame` | 16871 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16881 | function |  | 4 |
| `twistMeshGraphAxis` | 16889 | function |  | 4 |
| `addTwistMeshCurvePath` | 16893 | function |  | 2 |
| `appendSegment` | 16914 | arrow |  | 1 |
| `appendFill` | 16917 | arrow |  | 1 |
| `appendSignedSection` | 16923 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16972 | function |  | 6 |
| `updateTaperMeshPoints` | 17009 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17088 | function |  | 5 |
| `renderTaperCurveEditor` | 17106 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17178 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17192 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17208 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17242 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17251 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17262 | function |  | 2 |
| `applyTaperCurveEdit` | 17270 | function |  | 10 |
| `openTaperCurveEditor` | 17378 | function |  | 3 |
| `closeTaperCurveEditor` | 17423 | function |  | 6 |
| `updateViewportStatsVisibility` | 17436 | function |  | 6 |
| `canvasToProfile` | 17455 | function |  | 2 |
| `renderSweepProfileEditor` | 17465 | function |  | 7 |
| `applySweepProfileEdit` | 17508 | function |  | 8 |
| `openSweepProfileEditor` | 17535 | function |  | 1 |
| `closeSweepProfileEditor` | 17570 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17579 | function |  | 2 |
| `addLock` | 17594 | function |  | 19 |
| `mirroredScalpRegion` | 17797 | function |  | 5 |
| `mirroredVector` | 17806 | function |  | 12 |
| `mirroredPlacementFrame` | 17810 | function |  | 2 |
| `mirrorPartnerFor` | 17823 | function |  | 40 |
| `decoupleMirrorPartner` | 17827 | function |  | 2 |
| `createMirrorPartner` | 17835 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17931 | function |  | 6 |
| `mirroredClumpPartners` | 17936 | function |  | 6 |
| `createMirroredClump` | 17942 | function |  | 3 |
| `decoupleMirroredClump` | 17964 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17973 | function |  | 6 |
| `syncActiveMirror` | 18138 | function |  | 25 |
| `setMirrorXEditing` | 18150 | function |  | 6 |
| `snapshotState` | 18174 | function |  | 7 |
| `scalpTriangleRegion` | 18431 | function |  | 4 |
| `closestPointOnActiveScalp` | 18444 | function |  | 12 |
| `rootAttachmentFrame` | 18516 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18528 | function |  | 4 |
| `resolveRootAttachment` | 18546 | function |  | 4 |
| `curvePointsToRootLocal` | 18586 | function |  | 2 |
| `curvePointsFromRootLocal` | 18598 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18606 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18622 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18652 | function |  | 2 |
| `createRootAttachment` | 18664 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18694 | function |  | 4 |
| `rootAttachmentToData` | 18721 | function |  | 2 |
| `rootAttachmentFromData` | 18749 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18788 | function |  | 2 |
| `remapPoint` | 18803 | arrow |  | 1 |
| `remapVector` | 18804 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18833 | function |  | 2 |
| `importHeadMeshFile` | 18850 | function |  | 3 |
| `importFullBodyMeshFile` | 18873 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18898 | function |  | 1 |
| `importedBooleanPreference` | 18931 | function |  | 11 |
| `loadPreferencesAndPresets` | 18935 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19005 | function |  | 1 |
| `openHairProjectFile` | 19048 | function |  | 4 |
| `dragContainsApplicationFile` | 19106 | function |  | 3 |
| `safelyRememberRecentProject` | 19115 | function |  | 2 |
| `renderRecentProjectsMenu` | 19124 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19156 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19181 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19185 | function |  | 2 |
| `pushUndoState` | 19201 | function |  | 119 |
| `undoLastAction` | 19208 | function |  | 2 |
| `redoLastAction` | 19222 | function |  | 2 |
| `updateHistoryButtons` | 19236 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19241 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19258 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19265 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19303 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19380 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19406 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19438 | function |  | 2 |
| `finalizeStateRestore` | 19479 | function |  | 2 |
| `restoreState` | 19486 | function |  | 5 |
| `disposeAllEditableObjects` | 19510 | function |  | 2 |
| `restoreLock` | 19531 | function |  | 4 |
| `restoreGuide` | 19748 | function |  | 2 |
| `vectorToData` | 19809 | function |  | 29 |
| `dataToVector` | 19813 | function |  | 31 |
| `frameToData` | 19817 | function |  | 2 |
| `frameFromData` | 19829 | function |  | 2 |
| `applyPresetSelection` | 19841 | function |  | 2 |
| `drawPresetThumbnail` | 19872 | function |  | 1 |
| `fillHair` | 19887 | arrow |  | 9 |
| `strand` | 19899 | arrow |  | 31 |
| `bun` | 19917 | arrow |  | 2 |
| `braid` | 19952 | arrow |  | 2 |
| `renderPresetLibrary` | 20041 | function |  | 3 |
| `setPresetLibraryOpen` | 20100 | function |  | 6 |
| `average` | 20113 | function |  | 4 |
| `fitPointAttributes` | 20117 | function |  | 9 |
| `rebuildCurveObjects` | 20146 | function |  | 10 |
| `createCurvePoints` | 20158 | function |  | 2 |
| `addGeneratedBangPreset` | 20167 | function |  | 1 |
| `sampleScalpQuad` | 20260 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20284 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20333 | function |  | 1 |
| `columns` | 20334 | arrow |  | 1 |
| `layer` | 20338 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20552 | function |  | 2 |
| `addBraidedBobPreset` | 20588 | function |  | 1 |
| `evenColumns` | 20589 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20805 | function |  | 1 |
| `scalpSeed` | 20828 | arrow |  | 1 |
| `createBowlCutPoints` | 21115 | function |  | 2 |
| `addBowlCutPreset` | 21153 | function |  | 1 |
| `scalpRegionAtHit` | 21219 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21231 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21238 | function |  | 12 |
| `braidStrokeActive` | 21245 | function |  | 9 |
| `proceduralDrawActive` | 21249 | function |  | 3 |
| `panelStrokeActive` | 21253 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21257 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21261 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21265 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21271 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21275 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21279 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21283 | function |  | 3 |
| `liveSurfaceStrandId` | 21293 | function |  | 4 |
| `liveSurfaceStrand` | 21297 | function |  | 4 |
| `liveSurfaceGuideId` | 21302 | function |  | 3 |
| `guideSupportsLiveSurface` | 21306 | function |  | 2 |
| `liveSurfaceGuide` | 21313 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21320 | function |  | 12 |
| `activeStrokeScalpOffset` | 21360 | function |  | 4 |
| `activeStrokeBrushSize` | 21366 | function |  | 10 |
| `activeStrokeBrushDepth` | 21372 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21378 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21386 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21396 | function |  | 13 |
| `worldNormalAtHit` | 21435 | function |  | 6 |
| `selectedPolyMesh` | 21443 | function |  | 10 |
| `addPolyLock` | 21448 | function |  | 2 |
| `ensurePolyMesh` | 21467 | function |  | 3 |
| `polySurfaceSample` | 21471 | function |  | 4 |
| `polyTargetAtEvent` | 21482 | function |  | 6 |
| `refreshPolyMesh` | 21508 | function |  | 10 |
| `ensurePolyFillPreview` | 21517 | function |  | 2 |
| `clearPolyFillPreview` | 21554 | function |  | 17 |
| `polyFillCandidateForEvent` | 21559 | function |  | 3 |
| `showPolyFillPreview` | 21579 | function |  | 2 |
| `updatePolyFillPreview` | 21605 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21630 | function |  | 5 |
| `fillPolyGap` | 21640 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21651 | function |  | 2 |
| `projectPolyRelaxPoint` | 21671 | function |  | 2 |
| `removePolyPointAttributes` | 21715 | function |  | 3 |
| `deletePolyComponent` | 21724 | function |  | 2 |
| `addPolyPoint` | 21747 | function |  | 4 |
| `appendPolyStrokeRow` | 21756 | function |  | 4 |
| `beginPolyBrushPointer` | 21776 | function |  | 1 |
| `finishPolyAltDelete` | 21862 | function |  | 1 |
| `updatePolyBrushStroke` | 21876 | function |  | 1 |
| `finishPolyBrushStroke` | 21966 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22003 | function |  | 2 |
| `drawSampleFromHit` | 22026 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22040 | function |  | 3 |
| `strokeLength` | 22077 | function |  | 9 |
| `resampleDrawStroke` | 22083 | function |  | 2 |
| `processedDrawStroke` | 22115 | function |  | 8 |
| `strokeSurfaceNormals` | 22144 | function |  | 7 |
| `drawClumpFrame` | 22155 | function |  | 4 |
| `nearestCurveParameter` | 22164 | function |  | 2 |
| `drawClumpSampleNormal` | 22178 | function |  | 6 |
| `drawClumpTemplateVector` | 22187 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22193 | function |  | 3 |
| `drawClumpStrandMaps` | 22209 | function |  | 4 |
| `nextClumpName` | 22264 | function |  | 6 |
| `initializeClumpShape` | 22271 | function |  | 5 |
| `stableClumpVariation` | 22282 | function |  | 3 |
| `createClumpFromLocks` | 22294 | function |  | 7 |
| `addLockToClump` | 22319 | function |  | 4 |
| `stableBranchBaseNormals` | 22337 | function |  | 4 |
| `ensureBranchParentNormalField` | 22348 | function |  | 2 |
| `branchParentFrame` | 22354 | function |  | 7 |
| `branchLocalVector` | 22366 | function |  | 3 |
| `branchWorldVector` | 22370 | function |  | 4 |
| `captureBranchLocalState` | 22376 | function |  | 6 |
| `enforceBranchRootPosition` | 22404 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22454 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22481 | function |  | 2 |
| `clampRegionParam` | 22528 | function |  | 113 |
| `branchRootRegionFromParam` | 22535 | function |  | 4 |
| `cloneBranchRootRegion` | 22558 | function |  | 5 |
| `flip` | 22560 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22593 | function |  | 8 |
| `setBranchRootRegionPoint` | 22624 | function |  | 3 |
| `branchRegionUVToCanvas` | 22660 | function |  | 10 |
| `branchRegionCanvasToUV` | 22663 | function |  | 4 |
| `openBranchRegionEditor` | 22669 | function |  | 2 |
| `closeBranchRegionEditor` | 22683 | function |  | 2 |
| `retargetBranchRegionEditor` | 22689 | function |  | 2 |
| `renderBranchRegionEditor` | 22694 | function |  | 9 |
| `applyBranchRegionView` | 22782 | function |  | 6 |
| `resetBranchRegionZoom` | 22785 | function |  | 1 |
| `branchRegionNavAction` | 22791 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22805 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22825 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22829 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22855 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22867 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22872 | function |  | 1 |
| `branchRegionEventUV` | 22892 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22900 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23005 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23138 | function |  | 1 |
| `pointerToNdc` | 23143 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23154 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23168 | function |  | 1 |
| `endBranchSweepStartDrag` | 23191 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23198 | function |  | 5 |
| `gridProfileSkipCol` | 23225 | function |  | 3 |
| `branchRootRegionSurface` | 23234 | function |  | 6 |
| `toGridCol` | 23259 | arrow |  | 5 |
| `toRow` | 23263 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23318 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23338 | function |  | 2 |
| `pointAt` | 23344 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23371 | function |  | 3 |
| `applyBranchRootOffset` | 23443 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23462 | function |  | 3 |
| `branchChildrenFor` | 23482 | function |  | 9 |
| `detachBranch` | 23486 | function |  | 2 |
| `updateBranchChildren` | 23497 | function |  | 4 |
| `clumpDirectMembers` | 23540 | function |  | 3 |
| `clumpMembersForGuide` | 23545 | function |  | 6 |
| `clumpGuideForLock` | 23549 | function |  | 13 |
| `proceduralGuideForLock` | 23554 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23561 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23568 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23575 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23587 | function |  | 2 |
| `applyProceduralBranchSettings` | 23600 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23639 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23655 | function |  | 3 |
| `createProceduralAccessoryLock` | 23669 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23721 | function |  | 2 |
| `clumpFrameAt` | 23772 | function |  | 5 |
| `commitClumpMemberRestState` | 23780 | function |  | 10 |
| `updateClumpMembers` | 23863 | function |  | 10 |
| `dissolveClump` | 23967 | function |  | 6 |
| `detachLockFromClump` | 24004 | function |  | 4 |
| `updateDrawVolumePreview` | 24030 | function |  | 5 |
| `hideDrawClumpPreviews` | 24054 | function |  | 5 |
| `resetDrawVolumePreview` | 24060 | function |  | 3 |
| `updateDrawStrandPreview` | 24066 | function |  | 23 |
| `continueFromTipEnabled` | 24285 | function |  | 2 |
| `selectedTipContinuationLock` | 24291 | function |  | 3 |
| `selectedDrawBranchPoint` | 24304 | function |  | 3 |
| `canBranchDrawFromLock` | 24321 | function |  | 3 |
| `beginDrawStrandStroke` | 24328 | function |  | 2 |
| `beginDrawFreePlane` | 24453 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24467 | function |  | 2 |
| `updateDrawStrandStroke` | 24492 | function |  | 1 |
| `createDrawnLock` | 24538 | function |  | 3 |
| `setting` | 24542 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24610 | function |  | 4 |
| `createDrawnBraid` | 24618 | function |  | 2 |
| `createDrawnStrand` | 24675 | function |  | 2 |
| `createDrawnPanel` | 24802 | function |  | 2 |
| `surfaceLatticeNormal` | 24852 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24867 | function |  | 3 |
| `createViewportSurface` | 24932 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24961 | function |  | 6 |
| `hideLoftSurfacePreviews` | 24967 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 24974 | function |  | 4 |
| `updateLoftSurfacePreview` | 24983 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25015 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25031 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25049 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25071 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25097 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25107 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25111 | function |  | 2 |
| `curveSurfacePreviewLock` | 25120 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25143 | function |  | 2 |
| `hideCurveSurfacePreview` | 25159 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25171 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25176 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25185 | function |  | 3 |
| `curveSurfaceSideVector` | 25223 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25236 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25244 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25257 | function |  | 5 |
| `updateCurveSurfacePreview` | 25277 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25339 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25361 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25376 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25424 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25459 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25491 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25549 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25626 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25631 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25640 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25674 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25685 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25715 | function |  | 2 |
| `extendDrawnStrand` | 25772 | function |  | 2 |
| `finishDrawStrandStroke` | 25805 | function |  | 7 |
| `createPlacedStrand` | 25832 | function |  | 2 |
| `placedPointCount` | 25896 | function |  | 3 |
| `createPlacedPoints` | 25900 | function |  | 3 |
| `pushPointOutsideHead` | 25919 | function |  | 8 |
| `resizePlacedStrand` | 25951 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 25968 | function |  | 5 |
| `beginPlaceEdit` | 25973 | function |  | 2 |
| `updatePlaceEdit` | 25991 | function |  | 1 |
| `updatePlacementLength` | 26005 | function |  | 3 |
| `updatePlacementOrientation` | 26015 | function |  | 3 |
| `endPlaceEdit` | 26033 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26048 | function |  | 1 |
| `pendingPlacedLock` | 26058 | function |  | 2 |
| `beginPlacementPointer` | 26062 | function |  | 3 |
| `finishPlacementPointer` | 26072 | function |  | 2 |
| `confirmPlacementStep` | 26096 | function |  | 2 |
| `finishPlacementFlow` | 26119 | function |  | 7 |
| `updatePlacementStatus` | 26132 | function |  | 83 |
| `deselectStrands` | 26271 | function |  | 12 |
| `beginSelectionMarquee` | 26286 | function |  | 3 |
| `beginAltOrbit` | 26310 | function |  | 1 |
| `beginBlenderNavigation` | 26322 | function |  | 1 |
| `endBlenderNavigation` | 26367 | function |  | 1 |
| `prepareSelectPointerCapture` | 26375 | function |  | 1 |
| `endSelectPointerCapture` | 26381 | function |  | 1 |
| `endAltOrbit` | 26387 | function |  | 1 |
| `dollyCameraByDrag` | 26394 | function |  | 2 |
| `fastDragMagnitude` | 26417 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26423 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26431 | function |  | 1 |
| `endHoudiniZoomDrag` | 26448 | function |  | 1 |
| `updateSelectionMarquee` | 26456 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26473 | function |  | 3 |
| `selectPointsInMarquee` | 26481 | function |  | 2 |
| `pointKey` | 26507 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26538 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26575 | function |  | 3 |
| `projectedPoint` | 26592 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26621 | function |  | 2 |
| `finishSelectionMarquee` | 26666 | function |  | 2 |
| `headMeshes` | 26689 | function |  | 9 |
| `strandSplitProfileData` | 26697 | function |  | 4 |
| `strandSplitControlPoint` | 26710 | function |  | 4 |
| `panelSplitControlPoint` | 26746 | function |  | 6 |
| `strandControlPointRaycast` | 26802 | function |  | 1 |
| `strandControlPointFrame` | 26837 | function |  | 6 |
| `branchRootGizmoFrame` | 26868 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26886 | function |  | 5 |
| `createCurveObjects` | 26944 | function |  | 4 |
| `polyEdgeKey` | 27117 | function |  | 2 |
| `polyMeshEdges` | 27121 | function |  | 2 |
| `populatePolyEditObjects` | 27135 | function |  | 3 |
| `createPolyEditObjects` | 27196 | function |  | 2 |
| `rebuildPolyEditObjects` | 27204 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27218 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27225 | function |  | 2 |
| `strandWidthEdgeSample` | 27234 | function |  | 3 |
| `strandWidthEdgePoints` | 27257 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27271 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27275 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27282 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27294 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27299 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27305 | function |  | 3 |
| `updateCurveObjects` | 27319 | function |  | 41 |
| `createCurveNormalIndicator` | 27576 | function |  | 2 |
| `pointUpDirection` | 27602 | function |  | 2 |
| `curveFrameAtPoint` | 27606 | function |  | 5 |
| `curveFrameAt` | 27627 | function |  | 10 |
| `strandTwistAt` | 27647 | function |  | 6 |
| `controlPointRotationAt` | 27652 | function |  | 6 |
| `strandProfileTwistAt` | 27656 | function |  | 2 |
| `strandFrameAt` | 27662 | function |  | 1 |
| `curveFrameAtSnapshot` | 27668 | function |  | 3 |
| `outwardNormalAtPoint` | 27687 | function |  | 11 |
| `sampledSurfaceNormal` | 27699 | function |  | 2 |
| `guidedNormalAt` | 27715 | function |  | 5 |
| `twistFromHandle` | 27734 | function |  | 3 |
| `signedAngleAroundAxis` | 27755 | function |  | 5 |
| `handleColor` | 27762 | function |  | 2 |
| `isAffectedCurvePoint` | 27785 | function |  | 2 |
| `syncLockFromCurve` | 27791 | function |  | 26 |
| `labelForPreset` | 27821 | function |  | 1 |
| `rebuildLockGeometry` | 27825 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27852 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27860 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27866 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27888 | function |  | 8 |
| `updateLockGeometry` | 27901 | function |  | 57 |
| `setGroupColorView` | 27922 | function |  | 2 |
| `createUvCheckerTexture` | 27932 | function |  | 3 |
| `ensureUvCheckerForLock` | 27968 | function |  | 4 |
| `removeUvCheckerFromLock` | 28001 | function |  | 3 |
| `invalidateUvInspector` | 28016 | function |  | 7 |
| `uvInspectorRecord` | 28020 | function |  | 1 |
| `uvInspectorRecords` | 28059 | function |  | 2 |
| `drawUvInspectorGrid` | 28063 | function |  | 2 |
| `renderUvInspector` | 28097 | function |  | 3 |
| `setUvCheckerEnabled` | 28156 | function |  | 3 |
| `strandViewportBaseColor` | 28173 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28208 | function |  | 3 |
| `syncStrandSelectionOutline` | 28214 | function |  | 2 |
| `applyLockedStrandPalette` | 28225 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28234 | function |  | 6 |
| `setStrandSelectionVisual` | 28243 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28259 | function |  | 2 |
| `syncProceduralParentVisibility` | 28266 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28275 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28279 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28283 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28296 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28316 | function |  | 3 |
| `selectLock` | 28349 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28402 | function |  | 6 |
| `syncGroupInputs` | 28413 | function |  | 3 |
| `topologyStatsForLock` | 28446 | function |  | 4 |
| `formatTopologyStats` | 28454 | function |  | 5 |
| `updateTopologyStats` | 28458 | function |  | 20 |
| `normalizeBraidDimensions` | 28492 | function |  | 4 |
| `normalizeStrandDimensions` | 28505 | function |  | 3 |
| `strandBaseWidth` | 28519 | function |  | 5 |
| `strandWidthDimension` | 28523 | function |  | 5 |
| `strandDepthDimension` | 28531 | function |  | 8 |
| `setStrandWidthDimension` | 28539 | function |  | 2 |
| `setStrandDepthDimension` | 28561 | function |  | 4 |
| `syncShapeDimensionInputs` | 28577 | function |  | 4 |
| `syncCreationShapeInputs` | 28613 | function |  | 5 |
| `syncViewportDrawSettings` | 28651 | function |  | 5 |
| `syncPanelShapeInputs` | 28665 | function |  | 6 |
| `syncStrandSplitInputs` | 28691 | function |  | 4 |
| `syncHairCardControls` | 28700 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28708 | function |  | 3 |
| `updateAttributeEditorMode` | 28747 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28897 | function |  | 3 |
| `curveLatticeForGroup` | 28920 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28938 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 28983 | function |  | 2 |
| `showCurveLatticeForGroup` | 29000 | function |  | 2 |
| `selectStrandGroup` | 29037 | function |  | 3 |
| `selectCurvePoint` | 29079 | function |  | 10 |
| `updateSelectedPointLabel` | 29093 | function |  | 14 |
| `syncInputs` | 29106 | function |  | 16 |
| `syncClumpGuidePanel` | 29152 | function |  | 3 |
| `getSelectedLock` | 29179 | function |  | 105 |
| `selectedLocksInOrder` | 29183 | function |  | 37 |
| `lockStrands` | 29189 | function |  | 3 |
| `lockSelectedStrands` | 29222 | function |  | 3 |
| `unlockStrands` | 29228 | function |  | 3 |
| `unlockAllStrands` | 29243 | function |  | 3 |
| `strandEditFamily` | 29247 | function |  | 7 |
| `compatibleSelectedLocks` | 29252 | function |  | 6 |
| `selectedEditRoots` | 29259 | function |  | 2 |
| `editSelectedLocks` | 29272 | function |  | 21 |
| `multiEditValuesEqual` | 29305 | function |  | 2 |
| `setMixedControl` | 29314 | function |  | 28 |
| `syncMultiStrandInputs` | 29331 | function |  | 16 |
| `values` | 29347 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29427 | function |  | 5 |
| `createCompoundStrand` | 29434 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29495 | function |  | 9 |
| `openRebuildCurveDialog` | 29508 | function |  | 1 |
| `rebuildSelectedCurves` | 29522 | function |  | 2 |
| `selectionCanBecomeClump` | 29561 | function |  | 4 |
| `createClumpFromSelection` | 29566 | function |  | 3 |
| `cleanSelectionSets` | 29578 | function |  | 2 |
| `createSelectionSetFromSelection` | 29583 | function |  | 3 |
| `selectionSetById` | 29594 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29598 | function |  | 7 |
| `editSelectionSetFromSelection` | 29607 | function |  | 5 |
| `deleteSelectionSet` | 29627 | function |  | 2 |
| `selectSelectionSet` | 29636 | function |  | 2 |
| `deleteSelectedStrands` | 29646 | function |  | 4 |
| `deleteGuide` | 29654 | function |  | 3 |
| `deleteSelectedGuide` | 29677 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29681 | function |  | 4 |
| `hasDeletableSelection` | 29694 | function |  | 2 |
| `deleteCurrentSelection` | 29702 | function |  | 3 |
| `hideOutlinerContextMenu` | 29710 | function |  | 17 |
| `outlinerLockTargets` | 29715 | function |  | 3 |
| `showOutlinerContextMenu` | 29742 | function |  | 10 |
| `hideStrandRadialMenu` | 29822 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29833 | function |  | 3 |
| `radialButtonDimensions` | 29846 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29855 | function |  | 3 |
| `applyRadialMenuDimensions` | 29872 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29878 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29891 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29912 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29929 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29938 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29960 | function |  | 5 |
| `clumpMirrorRadialOptions` | 29978 | function |  | 2 |
| `contextualRadialOptions` | 29985 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30114 | function |  | 3 |
| `layoutContextualRadialOptions` | 30118 | function |  | 4 |
| `renderRadialActionList` | 30142 | function |  | 3 |
| `radialListOptionAtPointer` | 30160 | function |  | 3 |
| `syncRadialListHighlight` | 30182 | function |  | 3 |
| `configureContextualRadialMenu` | 30188 | function |  | 3 |
| `beginStrandRadialGesture` | 30248 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30282 | function |  | 2 |
| `updateStrandRadialGesture` | 30328 | function |  | 1 |
| `performStrandRadialAction` | 30367 | function |  | 2 |
| `finishStrandRadialGesture` | 30470 | function |  | 2 |
| `cancelStrandRadialGesture` | 30480 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30487 | function |  | 1 |
| `setPullMoveEnabled` | 30493 | function |  | 3 |
| `toolRadialOptions` | 30501 | function |  | 2 |
| `hideToolRadialMenu` | 30526 | function |  | 4 |
| `beginToolRadialGesture` | 30539 | function |  | 2 |
| `beginToolShortcutPress` | 30579 | function |  | 2 |
| `finishToolShortcutPress` | 30594 | function |  | 2 |
| `cancelToolShortcutPress` | 30603 | function |  | 5 |
| `setRadialMenusEnabled` | 30611 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30624 | function |  | 5 |
| `setNavigationTipsEnabled` | 30639 | function |  | 5 |
| `configureNavigationMouseButtons` | 30646 | function |  | 3 |
| `syncNavigationModifierLocks` | 30659 | function |  | 7 |
| `setNavigationStyle` | 30664 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30680 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30695 | function |  | 5 |
| `setCameraSmoothingStrength` | 30701 | function |  | 5 |
| `setScaleSensitivity` | 30709 | function |  | 3 |
| `setToolTipsEnabled` | 30717 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30724 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30733 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30741 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30756 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30765 | function |  | 5 |
| `sideNamingDisplayId` | 30774 | function |  | 3 |
| `referenceViewDisplayLabel` | 30786 | function |  | 6 |
| `strandRegionDisplayLabel` | 30796 | function |  | 10 |
| `updateSideNamingLabels` | 30814 | function |  | 2 |
| `setSideNamingPerspective` | 30841 | function |  | 5 |
| `setControlPointDisplaySize` | 30850 | function |  | 6 |
| `scaleHexColor` | 30862 | function |  | 3 |
| `setViewportBackgroundColor` | 30867 | function |  | 7 |
| `setDefaultHairShader` | 30889 | function |  | 5 |
| `setPreferenceCategory` | 30895 | function |  | 4 |
| `openPreferencesDialog` | 30922 | function |  | 1 |
| `savePreferencesDialog` | 30950 | function |  | 1 |
| `cancelPreferencesDialog` | 30974 | function |  | 3 |
| `updateToolRadialGesture` | 31003 | function |  | 1 |
| `performToolRadialAction` | 31032 | function |  | 2 |
| `finishToolRadialGesture` | 31042 | function |  | 2 |
| `cancelToolRadialGesture` | 31051 | function |  | 5 |
| `duplicatePlacementTarget` | 31058 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31085 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31089 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31099 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31104 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31116 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31127 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31135 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31152 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31173 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31184 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31190 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31196 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31229 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31384 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31486 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31527 | function |  | 2 |
| `updateDuplicatePlacement` | 31554 | function |  | 2 |
| `beginDuplicatePlacement` | 31618 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31682 | function |  | 2 |
| `confirmDuplicatePlacement` | 31723 | function |  | 1 |
| `cancelDuplicatePlacement` | 31760 | function |  | 4 |
| `outlinerClumpLocks` | 31786 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31790 | function |  | 3 |
| `createOutlinerStrandButton` | 31813 | function |  | 4 |
| `createOutlinerCurveSurface` | 31899 | function |  | 2 |
| `createOutlinerClump` | 31995 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32077 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32084 | function |  | 2 |
| `renderLockList` | 32163 | function |  | 70 |
| `updateCount` | 32317 | function |  | 34 |
| `captureInputUndo` | 32326 | function |  | 1 |
| `bindUndoCapture` | 32332 | function |  | 36 |
| `bindLockInput` | 32343 | function |  | 2 |
| `applyValue` | 32360 | arrow |  | 2 |
| `applyUniformTransformScale` | 32679 | function |  | 2 |
| `applyReducedTransformScale` | 32696 | function |  | 2 |
| `applyTransformPrecision` | 32735 | function |  | 2 |
| `updateTransformScalePointer` | 32764 | function |  | 1 |
| `finishSweepProfileDrag` | 32995 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33091 | function |  | 3 |
| `finishTaperCurveDrag` | 33153 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33196 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33277 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33332 | function |  | 6 |
| `updateSelectedTaperPoint` | 33356 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33928 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33933 | function |  | 4 |
| `syncDrawCurlControls` | 33988 | function |  | 5 |
| `handleLiveSurfaceChange` | 34036 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34118 | function |  | 3 |
| `resampleSurfaceLock` | 34133 | function |  | 2 |
| `changePanelSplitCount` | 34246 | function |  | 3 |
| `presetNumber` | 34350 | function |  | 23 |
| `clonePresetShape` | 34355 | function |  | 7 |
| `creationPresetSnapshot` | 34364 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34412 | function |  | 5 |
| `applyPresetControl` | 34439 | function |  | 2 |
| `applyCreationToolSettings` | 34460 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34500 | function |  | 3 |
| `loadCustomCreationPresets` | 34507 | function |  | 2 |
| `saveCustomCreationPresets` | 34517 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34525 | function |  | 2 |
| `populateCreationPresetSelect` | 34561 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34585 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34618 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34623 | function |  | 2 |
| `applyCustomCreationPreset` | 34640 | function |  | 3 |
| `createCustomCreationPreset` | 34661 | function |  | 3 |
| `createCustomClumpPreset` | 34676 | function |  | 3 |
| `commitCustomCreationPreset` | 34691 | function |  | 2 |
| `openRemoveCreationPreset` | 34752 | function |  | 3 |
| `commitRemoveCreationPreset` | 34765 | function |  | 1 |
| `applyBraidToolPreset` | 34782 | function |  | 2 |
| `selectedBranchChildLock` | 34894 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34898 | function |  | 2 |
| `initPanelResizeHandles` | 35004 | function |  | 2 |
| `applyWidth` | 35010 | arrow |  | 2 |
| `restoreWidth` | 35017 | arrow |  | 2 |
| `bindResize` | 35025 | arrow |  | 2 |
| `onMove` | 35033 | arrow |  | 0 |
| `onUp` | 35037 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35054 | function |  | 2 |
| `initFloatingPanelControls` | 35063 | function |  | 2 |
| `detach` | 35072 | arrow |  | 43 |
| `endDrag` | 35110 | arrow |  | 0 |
| `endResize` | 35142 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35153 | function |  | 3 |
| `selectPatchNotesVersion` | 35287 | function |  | 3 |
| `requestReferenceImage` | 35320 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35524 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35530 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35537 | function |  | 1 |
| `deleteLocks` | 36104 | function |  | 10 |
| `disposeCurveObjects` | 36182 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36234 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36265 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36340 | function |  | 2 |
| `resize` | 36373 | function |  | 4 |
| `handleViewportPointerMove` | 36384 | function |  | 1 |
| `blockProportionalSizingEvent` | 36395 | function |  | 1 |
| `updateLightAngleFromInputs` | 36401 | function |  | 2 |
| `startViewSnap` | 36415 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36445 | function |  | 3 |
| `trackViewportPointerDown` | 36462 | function |  | 1 |
| `trackViewportPointerMove` | 36478 | function |  | 1 |
| `clearViewportPointer` | 36486 | function |  | 1 |
| `updateViewSnap` | 36491 | function |  | 1 |
| `nearestCardinalAxis` | 36527 | function |  | 5 |
| `cardinalAxisKey` | 36541 | function |  | 5 |
| `steppedDragAmount` | 36545 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36551 | function |  | 4 |
| `endViewSnap` | 36567 | function |  | 4 |
| `activateStrandControlPoint` | 36577 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36627 | function |  | 4 |
| `addStrandControlPointSelection` | 36654 | function |  | 3 |
| `removeStrandControlPointSelection` | 36671 | function |  | 3 |
| `sampleStrandPointNormal` | 36685 | function |  | 2 |
| `sampleStrandPointVectors` | 36695 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36701 | function |  | 2 |
| `resampleStrandCurveData` | 36712 | function |  | 4 |
| `resampleMatchingVectors` | 36718 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36757 | function |  | 4 |
| `removeStrandCurvePoint` | 36768 | function |  | 2 |
| `closestStrandCurveParameter` | 36781 | function |  | 2 |
| `insertStrandCurvePoint` | 36810 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36827 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36837 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36853 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36860 | function |  | 4 |
| `prepareCurvePointSelection` | 36882 | function |  | 1 |
| `finishCurvePointInsertion` | 36993 | function |  | 1 |
| `finishPointRemoval` | 37008 | function |  | 1 |
| `editableStrandWidth` | 37026 | function |  | 6 |
| `editableStrandWidthBounds` | 37038 | function |  | 2 |
| `applyEditableStrandWidth` | 37044 | function |  | 3 |
| `viewportPixelPoint` | 37080 | function |  | 3 |
| `syncSculptBrushControls` | 37088 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37103 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37111 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37119 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37125 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37129 | function |  | 7 |
| `updateSculptBrushCursor` | 37136 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37158 | function |  | 4 |
| `sculptBrushEditableLock` | 37165 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37175 | function |  | 5 |
| `sculptBrushLockViable` | 37181 | function |  | 5 |
| `sculptBrushUnits` | 37192 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37231 | function |  | 4 |
| `sculptBrushPointWeight` | 37281 | function |  | 5 |
| `sculptBrushWorldDelta` | 37291 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37300 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37326 | function |  | 2 |
| `beginSculptMoveStroke` | 37384 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37446 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37681 | function |  | 3 |
| `updateSculptMoveStroke` | 37690 | function |  | 1 |
| `finishSculptMoveStroke` | 37706 | function |  | 3 |
| `strandControlPointHit` | 37754 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37758 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37836 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37870 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37910 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37923 | function |  | 1 |
| `setHoveredControlPoint` | 37962 | function |  | 7 |
| `visibleControlPointHoverTargets` | 37975 | function |  | 2 |
| `updateControlPointHover` | 38011 | function |  | 1 |
| `animate` | 38568 | function |  | 2 |
| `syncCompactSidebarLayout` | 38600 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38619 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38625 | function |  | 3 |
| `setAttributeEditorTab` | 38631 | function |  | 6 |

## modules/branch/branch-store.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchStore` | 15 | function | export | 1 |

## modules/core/app-config.js（92 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/core/camera-store.js（21 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createCameraStore` | 4 | function | export | 1 |

## modules/core/guide-store.js（18 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createGuideStore` | 3 | function | export | 1 |

## modules/core/hair-store.js（29 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createHairStore` | 4 | function | export | 1 |

## modules/core/head-store.js（11 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createHeadStore` | 3 | function | export | 1 |

## modules/core/history.js（45 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/core/preference-storage.js（33 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `readStoredPreference` | 1 | function | export | 2 |
| `readStoredBooleanPreference` | 14 | function | export | 1 |
| `writeStoredPreference` | 25 | function | export | 1 |

## modules/core/preferences-backup.js（73 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPreferencesBackup` | 4 | function | export | 1 |
| `normalizePreferencesBackup` | 29 | function | export | 1 |
| `preferencesBackupFileName` | 66 | function | export | 1 |

## modules/core/scene-store.js（38 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSceneStore` | 5 | function | export | 1 |

## modules/core/shortcut-registry.js（54 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `shortcutToolForKey` | 34 | function | export | 1 |
| `workspaceForShortcutKey` | 38 | function | export | 1 |
| `focusedControlShouldYieldToShortcut` | 42 | function | export | 1 |

## modules/core/transform-store.js（11 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createTransformStore` | 3 | function | export | 1 |

## modules/core/ui-store.js（22 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createUiStore` | 10 | function | export | 1 |

## modules/core/undo-store.js（10 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createUndoStore` | 3 | function | export | 1 |

## modules/data/clump-brush-presets.js（144 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneJsonValue` | 1 | arrow |  | 4 |
| `finitePoint` | 46 | function |  | 1 |
| `normalizePoints` | 53 | function |  | 2 |
| `normalizeStrand` | 62 | function |  | 1 |
| `normalizeClumpBrushTemplate` | 82 | function | export | 2 |
| `createClumpBrushTemplate` | 107 | function | export | 1 |

## modules/data/loc-ja.js（673 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/data/loc-zh.js（660 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/data/localization.js（151 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeLanguage` | 14 | function | export | 3 |
| `translateUiString` | 19 | function | export | 6 |
| `createDocumentLocalizer` | 54 | function | export | 1 |
| `localizeTextNode` | 61 | function |  | 4 |
| `localizeElement` | 78 | function |  | 4 |
| `localizeSubtree` | 97 | function |  | 2 |
| `setLanguage` | 121 | function |  | 2 |

## modules/data/shape-presets.js（56 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `emptyShapePresetLibrary` | 3 | function | export | 2 |
| `normalizedPoints` | 7 | function |  | 3 |
| `normalizeShapePresetLibrary` | 23 | function | export | 1 |
| `removeShapePreset` | 47 | function | export | 1 |

## modules/data/tool-presets.js（45 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `emptyToolPresetLibrary` | 3 | function | export | 2 |
| `normalizeToolPresetLibrary` | 7 | function | export | 1 |
| `removeToolPreset` | 36 | function | export | 1 |

## modules/edit/draw-store.js（24 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createDrawStore` | 9 | function | export | 1 |

## modules/edit/mirror-selection.js（21 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `mirrorSelectionTargets` | 1 | function | export | 1 |

## modules/edit/multi-edit.js（10 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `relativeEditValue` | 1 | function | export | 1 |

## modules/edit/reference-store.js（11 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createReferenceStore` | 4 | function | export | 1 |

## modules/edit/selection-sets.js（55 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `uniqueStrandIds` | 1 | function |  | 5 |
| `nextSelectionSetName` | 8 | function | export | 2 |
| `normalizeSelectionSets` | 15 | function | export | 1 |
| `createSelectionSetRecord` | 32 | function | export | 1 |
| `updateSelectionSetMembers` | 42 | function | export | 1 |

## modules/edit/selection-state.js（125 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `uniqueValidIds` | 1 | function |  | 6 |
| `screenBoundsOverlap` | 6 | function | export | 3 |
| `pointInsideScreenBounds` | 14 | function |  | 2 |
| `screenCross` | 19 | function |  | 8 |
| `pointInsideScreenTriangle` | 23 | function |  | 2 |
| `screenSegmentsIntersect` | 31 | function |  | 2 |
| `triangleIntersectsScreenBounds` | 44 | function | export | 1 |
| `emptyStrandSelection` | 66 | function | export | 2 |
| `resolveStrandSelection` | 70 | function | export | 1 |
| `restoreStrandSelection` | 108 | function | export | 1 |
| `activateStrandSelection` | 119 | function | export | 1 |

## modules/edit/selection-store.js（54 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSelectionStore` | 6 | function | export | 1 |

## modules/geometry/anime-hair-shaders.js（286 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeHairShader` | 5 | function | export | 1 |
| `normalizedHexColor` | 52 | function |  | 6 |
| `normalizeAnimeAnisotropicSettings` | 56 | function | export | 1 |

## modules/geometry/branch-connect.js（163 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp01` | 8 | arrow |  | 0 |
| `squareChildRing` | 14 | function | export | 1 |
| `holeBoundary` | 36 | function | export | 1 |
| `indexOf` | 42 | arrow |  | 4 |
| `connectSide` | 76 | function | export | 2 |
| `realEdge` | 81 | arrow |  | 4 |
| `progress` | 102 | arrow |  | 2 |
| `connectBoundaryToRing` | 143 | function | export | 1 |

## modules/geometry/capsule-curve.js（215 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `vector` | 3 | function |  | 5 |
| `add` | 11 | function |  | 8 |
| `subtract` | 15 | function |  | 10 |
| `scale` | 19 | function |  | 15 |
| `dot` | 23 | function |  | 9 |
| `cross` | 27 | function |  | 7 |
| `length` | 35 | function |  | 6 |
| `normalize` | 39 | function |  | 12 |
| `lerp` | 44 | function |  | 5 |
| `rotateAroundAxis` | 48 | function |  | 2 |
| `cleanPolyline` | 57 | function |  | 3 |
| `polylineLength` | 66 | function | export | 2 |
| `resamplePolyline` | 75 | function | export | 2 |
| `fallbackNormal` | 96 | function |  | 5 |
| `parallelTransportFrames` | 105 | function | export | 2 |
| `interpolatedFrame` | 141 | function |  | 2 |
| `sampleCapsuleRadialProfile` | 155 | function | export | 2 |
| `scaleCapsuleRadialLoops` | 172 | function | export | 1 |
| `curveDeformedCapsulePoints` | 191 | function | export | 1 |

## modules/geometry/compound-strand.js（131 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `edgeMidpointX` | 1 | function |  | 3 |
| `sideEdgeIndex` | 6 | function |  | 3 |
| `nodeKey` | 18 | function |  | 5 |
| `addGraphEdge` | 22 | function |  | 3 |
| `slotFromKey` | 29 | function |  | 2 |
| `compoundConnectedSegmentCount` | 34 | function | export | 1 |
| `compoundBridgeParameters` | 41 | function | export | 1 |
| `compoundBridgeArchWeight` | 47 | function | export | 1 |
| `compoundProfileBridgePlan` | 61 | function | export | 1 |

## modules/geometry/curve-lattice.js（102 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `flatCurveLatticePointData` | 11 | function | export | 1 |
| `interpolatePoint` | 37 | function |  | 5 |
| `resampleCurveLatticePointData` | 45 | function | export | 1 |
| `resampleCurveLatticeLineData` | 79 | function | export | 1 |
| `curveLatticeLoopPointIndices` | 90 | function | export | 1 |

## modules/geometry/curve-math.js（1163 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 45 |
| `lerp` | 5 | function |  | 36 |
| `clumpMemberGuideParameter` | 9 | function | export | 1 |
| `relaxAngleValue` | 15 | function | export | 1 |
| `angularDelta` | 17 | arrow |  | 2 |
| `curvedRelaxPositionTarget` | 25 | function | export | 1 |
| `axisTarget` | 37 | arrow |  | 3 |
| `smoothstep` | 56 | function |  | 4 |
| `legacyTaperCurve` | 61 | function | export | 2 |
| `normalizeTaperCurve` | 74 | function | export | 3 |
| `normalizeEnvelopeCurve` | 86 | function | export | 3 |
| `smoothTaperTangents` | 102 | function | export | 2 |
| `sampleTaperCurve` | 122 | function | export | 14 |
| `remapEnvelopeCurveRange` | 146 | function | export | 1 |
| `interpolationAt` | 158 | arrow |  | 2 |
| `twistRateUnitsFromDegrees` | 192 | function | export | 1 |
| `twistRateDegreesFromUnits` | 196 | function | export | 1 |
| `sampleIntegratedEnvelopeCurve` | 200 | function | export | 1 |
| `sampleAsymmetricTaperCurve` | 228 | function | export | 1 |
| `profileTopologyCenterWeight` | 241 | function | export | 1 |
| `uniformCurveParameters` | 251 | function | export | 2 |
| `eightWayScreenDelta` | 255 | function | export | 1 |
| `symmetricClosedCurveParameters` | 270 | function | export | 1 |
| `wrap` | 276 | arrow |  | 4 |
| `curveRebuildParameters` | 290 | function | export | 1 |
| `pointDistance` | 316 | function |  | 4 |
| `interpolatePoint` | 324 | function |  | 2 |
| `resamplePolylinePointData` | 332 | function | export | 8 |
| `polylineMidpointPointData` | 373 | function | export | 3 |
| `blendRelativePolylinePointData` | 377 | function | export | 1 |
| `normalizedPointData` | 394 | function |  | 17 |
| `blendDirectionPointData` | 403 | function | export | 1 |
| `rotatePointDataBetweenNormals` | 414 | function |  | 5 |
| `tangentDirectionPointData` | 454 | function |  | 3 |
| `rotatePointDataAroundAxis` | 468 | function |  | 3 |
| `blendSurfaceOrientedPolylinePointData` | 486 | function | export | 1 |
| `proximityCurveBlendAmount` | 557 | function | export | 2 |
| `evenlySpacedInteriorAmounts` | 564 | function | export | 1 |
| `surfaceArcBlendAmount` | 572 | function | export | 1 |
| `direction` | 574 | arrow |  | 3 |
| `surfaceArcPolylinePointData` | 602 | function | export | 1 |
| `relative` | 610 | arrow |  | 2 |
| `horizontalCircleThroughPointData` | 677 | function | export | 2 |
| `horizontalCirclePointData` | 720 | function | export | 2 |
| `rootCorrectionFalloff` | 731 | function | export | 1 |
| `cylindricalArcPointData` | 740 | function | export | 2 |
| `truncatePolylinePointDataAtY` | 747 | function |  | 3 |
| `lowestSharedHorizontalPolylinePointData` | 792 | function | export | 2 |
| `minimumY` | 796 | arrow |  | 2 |
| `blendCylindricalPolylinePointData` | 814 | function | export | 1 |
| `blendSampleArrays` | 836 | function | export | 1 |
| `blendTaperCurves` | 852 | function | export | 1 |
| `blendEnvelopeCurves` | 869 | function | export | 1 |
| `curvePointRemovalPlan` | 886 | function | export | 1 |
| `curvePointInsertionPlan` | 915 | function | export | 1 |
| `adaptiveCurveParameters` | 936 | function | export | 1 |
| `sampleProfile` | 959 | arrow |  | 3 |
| `weightedParameter` | 1032 | arrow |  | 1 |
| `twistCurveDensityDetail` | 1067 | function | export | 1 |
| `twistCurveDisplayRange` | 1095 | function | export | 1 |
| `twistCurveHandleDistancePerDegree` | 1104 | function | export | 1 |
| `sampleArray` | 1110 | function | export | 3 |
| `sampleScale` | 1119 | function | export | 1 |
| `upperProfileArcIndices` | 1128 | function | export | 1 |
| `cyclicPath` | 1146 | arrow |  | 2 |
| `averageHeight` | 1157 | arrow |  | 2 |

## modules/geometry/curve-surface.js（313 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `pointValue` | 6 | function |  | 43 |
| `clonePoint` | 10 | function |  | 2 |
| `interpolatePoint` | 18 | function |  | 3 |
| `pointDistance` | 26 | function |  | 5 |
| `curveSurfaceLineLength` | 34 | function | export | 2 |
| `curveSurfaceControllerSideDirections` | 49 | function | export | 1 |
| `curveSurfaceControlPointCount` | 102 | function | export | 1 |
| `resampleCurveSurfaceLine` | 120 | function | export | 4 |
| `normalizedDirection` | 138 | function |  | 8 |
| `offsetPoint` | 144 | function |  | 7 |
| `endpointDistance` | 152 | function |  | 3 |
| `orientCurveSurfaceLine` | 156 | function | export | 3 |
| `averageLateralScore` | 163 | function |  | 4 |
| `buildCurveSurfaceGrid` | 180 | function | export | 1 |
| `buildConnectedCurveCardGrid` | 254 | function | export | 1 |
| `curveSurfaceCurveLateralScore` | 302 | function | export | 2 |

## modules/geometry/poly-topology.js（340 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `validVertexIndex` | 1 | function |  | 4 |
| `edgeKey` | 5 | function |  | 5 |
| `normalizePolyFaces` | 9 | function | export | 15 |
| `appendPolyQuad` | 24 | function | export | 3 |
| `polyBoundaryEdges` | 28 | function | export | 2 |
| `relaxPolyPoints` | 43 | function | export | 1 |
| `squaredDistance` | 106 | function |  | 12 |
| `midpoint` | 113 | function |  | 3 |
| `orderedVerticesAroundTarget` | 121 | function |  | 2 |
| `bridgePolyEdges` | 169 | function | export | 2 |
| `polyFillCandidate` | 183 | function | export | 1 |
| `deletePolyFace` | 249 | function | export | 1 |
| `deletePolyFaceAndOrphans` | 253 | function | export | 1 |
| `deletePolyEdge` | 282 | function | export | 1 |
| `deletePolyVertex` | 290 | function | export | 1 |
| `polyMeshBuffers` | 304 | function | export | 1 |

## modules/geometry/procedural-draw.js（107 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `proceduralAccessoryTaperScale` | 3 | function | export | 1 |
| `proceduralAccessoryTemplateData` | 24 | function | export | 1 |
| `longitudinalPoints` | 30 | arrow |  | 2 |
| `proceduralBranchTemplateData` | 52 | function | export | 1 |

## modules/geometry/radial-layout.js（169 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `radialMenuAngles` | 3 | function | export | 3 |
| `buttonsOverlapAtRadius` | 20 | function |  | 2 |
| `radialMenuDimensions` | 36 | function | export | 1 |
| `radialButtonRayExtent` | 57 | function | export | 2 |
| `radialButtonEntryDistance` | 72 | function | export | 1 |
| `layoutRadialOptions` | 83 | function | export | 1 |
| `angularDistanceFromBottom` | 108 | arrow |  | 3 |
| `radialListCorridorContains` | 141 | function | export | 1 |
| `partitionRadialOptions` | 153 | function | export | 1 |

## modules/geometry/strand-constraints.js（120 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 3 |
| `solvePulledStrand` | 5 | function | export | 1 |

## modules/geometry/surface-lattice.js（236 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeSurfaceLatticeCount` | 5 | function | export | 19 |
| `surfaceLatticePointOrder` | 10 | function |  | 3 |
| `surfaceLatticePointIndex` | 23 | function | export | 6 |
| `mirroredSurfaceLatticePointIndex` | 36 | function | export | 1 |
| `pointComponent` | 56 | function |  | 2 |
| `catmullRomComponent` | 60 | function |  | 2 |
| `catmullRomDerivativeComponent` | 71 | function |  | 2 |
| `sampleCatmullRomLine` | 80 | function |  | 7 |
| `sampleSurfaceLattice` | 100 | function | export | 6 |
| `createSurfaceLatticePointData` | 125 | function | export | 1 |
| `createLoftSurfaceLatticePointData` | 151 | function | export | 1 |
| `resampleSurfaceLatticePointData` | 177 | function | export | 1 |
| `surfaceLatticeWireSegments` | 206 | function | export | 1 |

## modules/geometry/topology.js（21 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `parseObjFaceVertexCounts` | 1 | function | export | 1 |
| `fanTriangleEdgeMasks` | 10 | function | export | 1 |

## modules/geometry/uv-inspector.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `uvCoordinateBounds` | 1 | function | export | 1 |
| `uvViewTransform` | 23 | function | export | 1 |

## modules/io/file-actions.js（47 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `fileActionFormat` | 19 | function | export | 3 |
| `cleanFileBaseName` | 23 | function | export | 2 |
| `fileNameForAction` | 35 | function | export | 1 |
| `normalizeExportContents` | 40 | function | export | 1 |

## modules/io/file-drop.js（7 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `applicationDropFileKind` | 1 | function | export | 1 |

## modules/io/obj-export.js（77 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `orderedFanBoundary` | 1 | function | export | 2 |
| `hairFaceIndices` | 14 | function | export | 2 |
| `exportHairFaces` | 58 | function | export | 1 |
| `faceVertex` | 60 | arrow |  | 0 |
| `exportCurvePolyline` | 68 | function | export | 1 |

## modules/io/obj-import.js（11 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `polygonOnlyObjSource` | 1 | function | export | 1 |

## modules/io/project-files.js（508 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProjectSaveApi` | 13 | function | export | 2 |
| `downloadTextFile` | 56 | function |  | 4 |
| `downloadProjectFile` | 68 | function |  | 2 |
| `bufferAttributeTuples` | 72 | function |  | 6 |
| `setProjectSaveButtonsDisabled` | 79 | function |  | 5 |
| `buildHairProjectFile` | 85 | function |  | 4 |
| `buildHairObj` | 101 | function |  | 3 |
| `buildHairUsda` | 151 | function |  | 3 |
| `openFileActionDialog` | 211 | function |  | 5 |
| `performFileAction` | 256 | function |  | 2 |
| `saveHairProjectFile` | 324 | function |  | 2 |
| `saveHairProjectQuickly` | 353 | function |  | 1 |
| `exportHairObj` | 380 | function |  | 1 |
| `exportHairUsda` | 384 | function |  | 1 |
| `exportHairProjectQuickly` | 388 | function |  | 1 |
| `writeExportThroughFileSystem` | 440 | function |  | 3 |

## modules/io/project-schema.js（51 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `projectFileName` | 4 | function | export | 1 |
| `validateHairProject` | 9 | function | export | 1 |
| `createHairProject` | 19 | function | export | 1 |

## modules/io/project-state.js（89 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneOptionalRecord` | 1 | function |  | 7 |
| `createProjectSelectionSnapshot` | 5 | function | export | 1 |
| `projectSnapshotLocks` | 35 | function | export | 1 |
| `createProjectRestorePlan` | 43 | function | export | 1 |

## modules/io/project-store.js（28 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProjectStore` | 6 | function | export | 1 |

## modules/io/recent-projects.js（109 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `recentProjectId` | 7 | function | export | 2 |
| `normalizeRecentProjects` | 14 | function | export | 4 |
| `indexedDbApi` | 35 | function |  | 2 |
| `requestResult` | 39 | function |  | 3 |
| `transactionComplete` | 46 | function |  | 5 |
| `openRecentProjectsDatabase` | 54 | function |  | 3 |
| `listRecentProjects` | 68 | function | export | 1 |
| `rememberRecentProject` | 81 | function | export | 1 |

## modules/io/usda-export.js（162 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `finiteNumber` | 1 | function |  | 4 |
| `formatNumber` | 6 | function |  | 2 |
| `quoteString` | 12 | function |  | 4 |
| `usdIdentifier` | 19 | function | export | 3 |
| `uniqueIdentifier` | 29 | function |  | 3 |
| `tuple` | 41 | function |  | 1 |
| `tupleArray` | 45 | function |  | 5 |
| `numberArray` | 49 | function |  | 4 |
| `metadataLines` | 53 | function |  | 3 |
| `primvarLines` | 60 | function |  | 4 |
| `meshBlock` | 72 | function |  | 2 |
| `curveBlock` | 106 | function |  | 2 |
| `exportAnimeHairUsda` | 124 | function | export | 1 |

## modules/material/material-state.js（49 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeHairMaterialDefinition` | 22 | function | export | 2 |
| `resolveHairMaterialDefinition` | 34 | function | export | 2 |
| `hairMaterialUsageCounts` | 40 | function | export | 1 |

## modules/scalp/scalp-store.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createScalpStore` | 3 | function | export | 1 |

## modules/sculpt/sculpt-brush.js（123 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `sculptBrushWeight` | 1 | function | export | 1 |
| `smoothSculptPointDeltas` | 13 | function | export | 1 |
| `proportionalSculptWeights` | 40 | function | export | 1 |
| `cameraFacingPlaneNormal` | 69 | function | export | 2 |
| `inflateSculptPointScale` | 82 | function | export | 1 |
| `pointInCameraFacingHalfSpace` | 97 | function | export | 1 |
| `smoothSculptTwistDeltas` | 105 | function | export | 1 |
