# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1735** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（36705 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 262 | function |  | 3 |
| `saveBooleanPreference` | 290 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 294 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 299 | function |  | 2 |
| `normalizeScaleSensitivity` | 304 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 309 | function |  | 2 |
| `normalizeSideNamingPerspective` | 314 | function |  | 2 |
| `normalizeNavigationStyle` | 318 | function |  | 2 |
| `setupEditableSliderControls` | 333 | function |  | 2 |
| `syncNumberFromRange` | 384 | arrow |  | 0 |
| `applyNumberValue` | 391 | arrow |  | 0 |
| `copyCameraPose` | 497 | function |  | 3 |
| `updateCameraProjectionForViewport` | 503 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 516 | function |  | 3 |
| `setOrthographicView` | 522 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 562 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 591 | function |  | 2 |
| `removeRotateFreeAxisRing` | 617 | function |  | 2 |
| `deflateTransformGizmoPickers` | 629 | function |  | 2 |
| `nextStrandName` | 1008 | function |  | 2 |
| `activeDrawClumpTemplate` | 1093 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1098 | function |  | 3 |
| `drawModeCreatesClump` | 1125 | function |  | 1 |
| `isPanelGeometry` | 1269 | function |  | 31 |
| `normalizePanelSplits` | 1273 | function |  | 3 |
| `clonePanelSplits` | 1285 | function |  | 19 |
| `snapPanelSplitHeight` | 1289 | function |  | 5 |
| `createQuadSphereGeometry` | 1324 | function |  | 2 |
| `vertexIndex` | 1338 | function |  | 11 |
| `addEdge` | 1356 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1391 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1461 | function |  | 3 |
| `updateScalpRenderGeometry` | 1487 | function |  | 4 |
| `writeScalpRegionColors` | 1538 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1551 | function |  | 2 |
| `createScalpSelectionOutline` | 1581 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1623 | function |  | 25 |
| `activeScalpSurfaceWire` | 1628 | function |  | 2 |
| `activeScalpSelectionOutline` | 1633 | function |  | 2 |
| `inferredCustomScalpRegion` | 1638 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1645 | function |  | 5 |
| `customScalpGeometryFromObject` | 1664 | function |  | 2 |
| `customScalpWireGeometry` | 1696 | function |  | 3 |
| `installCustomScalpGeometry` | 1707 | function |  | 3 |
| `installCustomScalpGuide` | 1731 | function |  | 3 |
| `setScalpGuideSource` | 1749 | function |  | 7 |
| `updateScalpQuadWire` | 1765 | function |  | 4 |
| `updateScalpTopology` | 1781 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1845 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2025 | function |  | 2 |
| `currentStrandSelectionState` | 2087 | function |  | 4 |
| `applyStrandSelectionState` | 2091 | function |  | 5 |
| `clearStrandSelectionState` | 2096 | function |  | 7 |
| `guideHeadBounds` | 3076 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3086 | function |  | 5 |
| `disposeGuideModel` | 3100 | function |  | 3 |
| `syncHeadTransformInputs` | 3111 | function |  | 4 |
| `applyHeadTransform` | 3118 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3136 | function |  | 4 |
| `applyScalpRoughScale` | 3145 | function |  | 5 |
| `resetHeadTransform` | 3159 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3173 | function |  | 2 |
| `installGuideModel` | 3189 | function |  | 5 |
| `loadDefaultGuideModel` | 3265 | function |  | 3 |
| `braidTemplateFromEntries` | 3288 | function |  | 4 |
| `braidMeshEntries` | 3320 | function |  | 2 |
| `prepareBraidBodyCache` | 3332 | function |  | 2 |
| `quantize` | 3341 | arrow |  | 21 |
| `sourceNormalAt` | 3353 | arrow |  | 1 |
| `clusterBoundary` | 3356 | arrow |  | 2 |
| `normalBuckets` | 3373 | arrow |  | 2 |
| `applyBucketPair` | 3405 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3436 | function |  | 2 |
| `annotateBraidObjTopology` | 3457 | function |  | 2 |
| `loadBraidMeshPreset` | 3477 | function |  | 3 |
| `createSplitControlHandle` | 3494 | function |  | 4 |
| `frameGuideModel` | 3509 | function |  | 2 |
| `syncScalpInputs` | 3534 | function |  | 2 |
| `syncScalpArtistInputs` | 3540 | function |  | 2 |
| `rootScalpOffsetDistance` | 3548 | function |  | 15 |
| `applyLockRootScalpOffset` | 3553 | function |  | 5 |
| `normalizeHairLayer` | 3569 | function |  | 27 |
| `layerOffsetForLock` | 3573 | function |  | 9 |
| `layerRootOffsetFactor` | 3578 | function |  | 13 |
| `layerOffsetWeight` | 3582 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3588 | function |  | 5 |
| `pointsWithLayerOffset` | 3597 | function |  | 3 |
| `layerDirectionForLock` | 3605 | function |  | 2 |
| `applyLayerOffset` | 3616 | function |  | 5 |
| `setLockHairLayer` | 3640 | function |  | 2 |
| `setGroupLayerOffset` | 3655 | function |  | 2 |
| `scalpArtistWeight` | 3667 | function |  | 3 |
| `scalpArtistScalesAt` | 3671 | function |  | 3 |
| `applyScalpArtistShape` | 3681 | function |  | 5 |
| `inverseScalpArtistShape` | 3699 | function |  | 2 |
| `updateScalpSurface` | 3726 | function |  | 3 |
| `setActiveScalpRegion` | 3736 | function |  | 2 |
| `clearScalpRegions` | 3748 | function |  | 2 |
| `scalpHitFromEvent` | 3765 | function |  | 3 |
| `updateScalpBrushCursor` | 3773 | function |  | 4 |
| `paintScalpAt` | 3788 | function |  | 3 |
| `beginScalpPaint` | 3855 | function |  | 2 |
| `updateScalpPaint` | 3864 | function |  | 1 |
| `endScalpPaint` | 3873 | function |  | 2 |
| `createScalpLattice` | 3880 | function |  | 2 |
| `resetScalpLattice` | 3905 | function |  | 1 |
| `updateScalpLatticeObjects` | 3917 | function |  | 7 |
| `quadraticWeights` | 3931 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3936 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3963 | function |  | 3 |
| `selectScalpLatticePoint` | 3978 | function |  | 2 |
| `beginScalpLatticeDrag` | 3993 | function |  | 2 |
| `updateScalpLatticeDrag` | 4011 | function |  | 1 |
| `endScalpLatticeDrag` | 4029 | function |  | 2 |
| `setHeadReferenceTransparency` | 4035 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4045 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4063 | function |  | 3 |
| `trianglePlaneIntersections` | 4071 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4092 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4118 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4128 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4140 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4164 | function |  | 3 |
| `createScalpBuilderPlanes` | 4179 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4211 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4249 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4272 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4284 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4296 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4301 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4313 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4423 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4448 | function |  | 5 |
| `syncEditedScalpSurface` | 4463 | function |  | 4 |
| `ensureEditedScalpSurface` | 4534 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4564 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4649 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4662 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4678 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4688 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4706 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4719 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4726 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4745 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4759 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4800 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4809 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4822 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4843 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4980 | function |  | 2 |
| `scalpTemplateNeighbors` | 4988 | function |  | 2 |
| `smoothScalpVectorField` | 5000 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5014 | function |  | 2 |
| `upperContourCurve` | 5031 | function |  | 4 |
| `hermitePoint` | 5066 | function |  | 2 |
| `curveNetworkSection` | 5077 | function |  | 3 |
| `pointAlongSection` | 5106 | function |  | 3 |
| `longestStitchedContour` | 5112 | function |  | 2 |
| `nodeForPoint` | 5120 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5177 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5187 | function |  | 1 |
| `orderedRange` | 5199 | arrow |  | 3 |
| `clipSegment` | 5222 | arrow |  | 1 |
| `liftedPoint` | 5245 | arrow |  | 5 |
| `boundaryCorner` | 5250 | arrow |  | 4 |
| `surfaceCurveBetween` | 5259 | arrow |  | 1 |
| `addSurfaceConnector` | 5282 | arrow |  | 2 |
| `sideContourAtDepth` | 5350 | arrow |  | 3 |
| `addSurfacePatch` | 5384 | arrow |  | 1 |
| `addCenterBridgePatch` | 5464 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5572 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5607 | function |  | 1 |
| `generatedScalpObjContent` | 5697 | function |  | 2 |
| `generateScalpFromBuilder` | 5711 | function |  | 1 |
| `orderedDepthRange` | 5747 | arrow |  | 7 |
| `resetScalpBuilder` | 5876 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5891 | function |  | 1 |
| `beginScalpBuilderInput` | 5905 | function |  | 2 |
| `updateScalpBuilderStroke` | 5906 | function |  | 1 |
| `finishScalpBuilderStroke` | 5907 | function |  | 2 |
| `setScalpBuilderEditing` | 5909 | function |  | 10 |
| `updateScalpEditingVisibility` | 5943 | function |  | 12 |
| `exitSetupEditors` | 6037 | function |  | 7 |
| `setCapsuleGuideEditing` | 6046 | function |  | 5 |
| `syncAppMenuVisibility` | 6074 | function |  | 3 |
| `closeAppMenus` | 6079 | function |  | 6 |
| `setAppMenuOpen` | 6090 | function |  | 3 |
| `setTurntableActive` | 6097 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6106 | function |  | 9 |
| `selectedReferenceImage` | 6110 | function |  | 20 |
| `normalizeReferenceCrop` | 6116 | function |  | 8 |
| `referenceCropIsFull` | 6124 | function |  | 3 |
| `referencePlaneFrontAxis` | 6129 | function |  | 4 |
| `referencePlanePlacement` | 6138 | function |  | 4 |
| `migratedReferencePlanePosition` | 6153 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6173 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6190 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6206 | function |  | 2 |
| `snappedReferenceImageView` | 6229 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6235 | function |  | 5 |
| `applyReferenceImageRuntime` | 6251 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6294 | function |  | 6 |
| `createReferenceImageRuntime` | 6302 | function |  | 3 |
| `addReferenceImage` | 6371 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6423 | function |  | 3 |
| `disposeReferenceImage` | 6442 | function |  | 2 |
| `clearReferenceImages` | 6446 | function |  | 2 |
| `serializeReferenceImage` | 6453 | function |  | 1 |
| `setReferenceImageType` | 6481 | function |  | 2 |
| `attachReferenceImageTransform` | 6525 | function |  | 6 |
| `selectReferenceImage` | 6539 | function |  | 12 |
| `placeReferencePlane` | 6562 | function |  | 2 |
| `setReferencePlaneInFront` | 6573 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6583 | function |  | 4 |
| `renderReferenceImagePanel` | 6602 | function |  | 20 |
| `setOutlinerTab` | 6649 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6667 | function |  | 4 |
| `componentEditModeActive` | 6671 | function |  | 38 |
| `selectionToolSupportsPicking` | 6675 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6680 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6696 | function |  | 2 |
| `setViewportSelectionMode` | 6726 | function |  | 4 |
| `setViewportEditMode` | 6738 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6780 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6794 | function |  | 8 |
| `outlinerGuides` | 6806 | function |  | 3 |
| `guideOutlinerLabel` | 6813 | function |  | 2 |
| `normalizeOutlinerName` | 6823 | function |  | 4 |
| `beginOutlinerRename` | 6828 | function |  | 2 |
| `finish` | 6839 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6869 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6879 | function |  | 2 |
| `renderGuideOutliner` | 6914 | function |  | 10 |
| `referenceOutlinerGroup` | 6972 | function |  | 2 |
| `renderReferenceOutliner` | 6976 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7093 | function |  | 5 |
| `readReferenceImageFile` | 7098 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7122 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7129 | function |  | 3 |
| `dragContainsReferenceImage` | 7174 | function |  | 3 |
| `setReferenceImageDragActive` | 7185 | function |  | 9 |
| `referenceDropDestination` | 7193 | function |  | 2 |
| `viewportOverlayDropPosition` | 7199 | function |  | 2 |
| `setReferenceDropHover` | 7208 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7226 | function |  | 2 |
| `referenceOverlayAtPointer` | 7246 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7264 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7277 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7323 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7373 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7395 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7406 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7432 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7441 | function |  | 2 |
| `referenceCropCursor` | 7456 | function |  | 3 |
| `updateReferenceCropHandles` | 7462 | function |  | 5 |
| `referenceCropSourcePoint` | 7483 | function |  | 2 |
| `beginReferenceCrop` | 7490 | function |  | 1 |
| `updateReferenceCrop` | 7528 | function |  | 1 |
| `finishReferenceCrop` | 7560 | function |  | 4 |
| `setHeadSetupEditing` | 7578 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7594 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7603 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7613 | function |  | 4 |
| `setScalpGuideVisibility` | 7619 | function |  | 12 |
| `currentGuideViewMode` | 7627 | function |  | 3 |
| `updateGuideViewToggle` | 7635 | function |  | 5 |
| `setGuideViewMode` | 7651 | function |  | 3 |
| `cycleGuideViewMode` | 7662 | function |  | 1 |
| `hideGuideViewContextMenu` | 7667 | function |  | 6 |
| `showGuideViewContextMenu` | 7671 | function |  | 1 |
| `strandPassesDisplayFilters` | 7684 | function |  | 4 |
| `strandVisibleForDisplay` | 7693 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7698 | function |  | 2 |
| `lockedStrandsExist` | 7702 | function |  | 3 |
| `hiddenStrandsExist` | 7706 | function |  | 2 |
| `hideSelectedStrands` | 7710 | function |  | 2 |
| `unhideHiddenStrands` | 7720 | function |  | 2 |
| `strandIsolationActive` | 7729 | function |  | 7 |
| `setStrandIsolation` | 7733 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7745 | function |  | 3 |
| `syncVisibilityParent` | 7756 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7763 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7792 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7799 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7819 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7842 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7850 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7857 | function |  | 9 |
| `setScalpLatticeEditing` | 7868 | function |  | 4 |
| `setScalpShapeEditing` | 7883 | function |  | 9 |
| `setScalpPaintEditing` | 7901 | function |  | 7 |
| `defaultCurveLatticePoints` | 7925 | function |  | 3 |
| `flatCurveLatticePoints` | 7951 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7960 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7984 | function |  | 4 |
| `horizontalValue` | 7989 | arrow |  | 1 |
| `blendedSample` | 8000 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8033 | function |  | 2 |
| `curveLatticeControlPoint` | 8048 | function |  | 9 |
| `circularArcTangent` | 8052 | function |  | 4 |
| `arcLengthTo` | 8083 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8095 | function |  | 3 |
| `sampleHermiteCurve` | 8134 | function |  | 10 |
| `sampleCurveLattice` | 8151 | function |  | 6 |
| `curveLatticeNormal` | 8170 | function |  | 1 |
| `createCurveLatticeGeometry` | 8181 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8210 | function |  | 3 |
| `appendCurve` | 8212 | arrow |  | 4 |
| `sample` | 8214 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8241 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8257 | function |  | 3 |
| `addPicker` | 8259 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8298 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8311 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8315 | function |  | 3 |
| `curveLatticeEditablePoint` | 8333 | function |  | 13 |
| `curveLatticePointSection` | 8340 | function |  | 3 |
| `curveLatticeRestPoint` | 8351 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8357 | function |  | 7 |
| `curveLatticeRootColumns` | 8363 | function |  | 3 |
| `curveTangentsForPoints` | 8370 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8382 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8419 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8445 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8462 | function |  | 3 |
| `resampleGrid` | 8472 | arrow |  | 2 |
| `controlPointIsSelected` | 8499 | function |  | 7 |
| `clearMultiPointSelection` | 8507 | function |  | 9 |
| `createCurveLatticeHandles` | 8511 | function |  | 4 |
| `addCurveLattice` | 8533 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8642 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8673 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8679 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8718 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8739 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8756 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8765 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8772 | function |  | 1 |
| `selectCurveLatticeLoop` | 8791 | function |  | 3 |
| `selectCurveLatticePoint` | 8820 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8835 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8877 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8898 | function |  | 3 |
| `curveLatticeColumnPoints` | 8941 | function |  | 3 |
| `groupCurveControlIndices` | 8950 | function |  | 4 |
| `groupCurveControlPoints` | 8956 | function |  | 2 |
| `updateGroupCurveDisplay` | 8962 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8972 | function |  | 2 |
| `groupCurveDeformationPairs` | 8994 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9001 | function |  | 2 |
| `appendPairs` | 9003 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9014 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9033 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9054 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9073 | function |  | 2 |
| `capsuleGuideCapHeight` | 9107 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9111 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9116 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9120 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9132 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9148 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9154 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9180 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9210 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9264 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9285 | function |  | 7 |
| `vertex` | 9299 | function |  | 3 |
| `addFace` | 9305 | function |  | 3 |
| `addRing` | 9323 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9378 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9388 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9453 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9499 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9512 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9533 | function |  | 3 |
| `capsuleGuidePointDistances` | 9538 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9559 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9579 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9584 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9590 | function |  | 3 |
| `capsuleGuideAccentColor` | 9595 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9600 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9611 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9623 | function |  | 2 |
| `createCapsuleGuideHandles` | 9655 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9678 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9697 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9704 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9720 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9737 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9752 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9789 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9805 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9822 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9828 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9855 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9867 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9886 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9931 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9966 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9980 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9986 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10003 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10014 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10025 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10055 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10065 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10106 | function |  | 3 |
| `createQuadCageGeometry` | 10122 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10146 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10166 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10177 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10230 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10268 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10278 | function |  | 4 |
| `addCapsuleGuide` | 10286 | function |  | 4 |
| `addGuide` | 10355 | function |  | 1 |
| `createGuideGeometry` | 10416 | function |  | 4 |
| `selectGuide` | 10471 | function |  | 17 |
| `updateGuideControlsVisibility` | 10539 | function |  | 10 |
| `updateViewportToolVisibility` | 10556 | function |  | 7 |
| `getSelectedGuide` | 10595 | function |  | 34 |
| `selectedViewportFocusBounds` | 10599 | function |  | 2 |
| `frameViewportBounds` | 10613 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10643 | function |  | 2 |
| `fullSceneFocusBounds` | 10647 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10662 | function |  | 3 |
| `cycleViewportFraming` | 10671 | function |  | 2 |
| `syncGuideInputs` | 10689 | function |  | 5 |
| `updateGuideGeometry` | 10732 | function |  | 3 |
| `sculptBrushToolActive` | 10753 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10757 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10761 | function |  | 3 |
| `effectiveSculptBrushTool` | 10765 | function |  | 13 |
| `updateSculptScaleModeRow` | 10771 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10776 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10798 | function |  | 5 |
| `setActiveTool` | 10807 | function |  | 19 |
| `setDrawStrandMode` | 10945 | function |  | 2 |
| `setObjectSpaceEditing` | 10955 | function |  | 7 |
| `setHierarchyEditing` | 10971 | function |  | 4 |
| `setProportionalEditing` | 10983 | function |  | 5 |
| `beginProportionalSizeEdit` | 11002 | function |  | 3 |
| `updateProportionalSizeEdit` | 11014 | function |  | 2 |
| `endProportionalSizeEdit` | 11025 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11032 | function |  | 2 |
| `refreshProportionalPreview` | 11040 | function |  | 4 |
| `activeBrushSizeInput` | 11050 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11059 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11071 | function |  | 2 |
| `beginBrushSizeDrag` | 11089 | function |  | 1 |
| `updateBrushSizeDrag` | 11116 | function |  | 1 |
| `finishBrushSizeDrag` | 11137 | function |  | 2 |
| `updateInteractionLocks` | 11154 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11163 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11172 | function |  | 2 |
| `configureTransformControls` | 11203 | function |  | 16 |
| `pullMoveActive` | 11211 | function |  | 9 |
| `updatePullGuideVisual` | 11215 | function |  | 4 |
| `attachTransformForCurvePoint` | 11231 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11255 | function |  | 7 |
| `strandObjectRootIndex` | 11271 | function |  | 3 |
| `strandObjectRoot` | 11280 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11284 | function |  | 2 |
| `attachStrandObjectTransform` | 11289 | function |  | 6 |
| `guideObjectPivot` | 11312 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11323 | function |  | 2 |
| `attachGuideObjectTransform` | 11328 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11347 | function |  | 2 |
| `beginGuideObjectTransform` | 11375 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11382 | function |  | 2 |
| `updateGuideObjectTransform` | 11404 | function |  | 2 |
| `finishGuideObjectTransform` | 11437 | function |  | 2 |
| `clonePlacementFrame` | 11446 | function |  | 2 |
| `cloneOptionalVectors` | 11458 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11462 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11479 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11494 | function |  | 2 |
| `strandObjectTransformOperators` | 11510 | function |  | 4 |
| `transformPoint` | 11518 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11525 | arrow |  | 0 |
| `transformNormal` | 11531 | arrow |  | 10 |
| `transformDirection` | 11541 | arrow |  | 7 |
| `worldMatrixForPivot` | 11553 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11559 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11575 | function |  | 6 |
| `beginStrandObjectTransform` | 11589 | function |  | 2 |
| `updateStrandObjectTransform` | 11627 | function |  | 2 |
| `commitStrandObjectTransform` | 11676 | function |  | 2 |
| `mapPoints` | 11689 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11723 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11737 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11760 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11773 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11788 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11814 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11863 | function |  | 2 |
| `beginHandleEdit` | 11872 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11921 | function |  | 3 |
| `applyBranchRigidRootMove` | 11938 | function |  | 3 |
| `syncBranchRootHandleFrame` | 11975 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 11986 | function |  | 3 |
| `multiPointHandleEditActive` | 11997 | function |  | 7 |
| `applyMultiMove` | 12001 | function |  | 5 |
| `applyMultiRotate` | 12007 | function |  | 2 |
| `applyMultiScale` | 12016 | function |  | 2 |
| `applyHierarchicalMove` | 12025 | function |  | 3 |
| `applySingleMove` | 12037 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12041 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12058 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12067 | function |  | 3 |
| `changed` | 12077 | arrow |  | 1 |
| `applyPullMove` | 12119 | function |  | 3 |
| `pullHeadCollisionContext` | 12127 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12146 | function |  | 2 |
| `applyProportionalMove` | 12169 | function |  | 3 |
| `viewPlaneNormal` | 12180 | function |  | 20 |
| `isCameraInSnappedView` | 12184 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12192 | function |  | 10 |
| `updateViewPlaneGrid` | 12196 | function |  | 14 |
| `setViewPlaneMove` | 12253 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12264 | function |  | 2 |
| `rayFromViewportEvent` | 12272 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12280 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12290 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12301 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12314 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12333 | function |  | 4 |
| `beginViewPlaneMove` | 12340 | function |  | 3 |
| `updateViewPlaneMove` | 12404 | function |  | 1 |
| `endViewPlaneMove` | 12469 | function |  | 7 |
| `applyHierarchicalRotate` | 12488 | function |  | 2 |
| `rotateGuideNormal` | 12495 | arrow |  | 4 |
| `applySingleRotate` | 12533 | function |  | 2 |
| `applyProportionalRotate` | 12537 | function |  | 2 |
| `applyHierarchicalScale` | 12557 | function |  | 2 |
| `applySingleScale` | 12567 | function |  | 2 |
| `applyProportionalScale` | 12571 | function |  | 2 |
| `setPointScale` | 12587 | function |  | 8 |
| `proportionalWeight` | 12596 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12608 | function |  | 5 |
| `strandInfluenceColor` | 12614 | function |  | 13 |
| `beginRelaxEdit` | 12639 | function |  | 3 |
| `updateRelaxEdit` | 12668 | function |  | 1 |
| `endRelaxEdit` | 12728 | function |  | 1 |
| `disposeGuide` | 12738 | function |  | 3 |
| `removeGuideObjects` | 12766 | function |  | 3 |
| `strandRadiusAt` | 12780 | function |  | 5 |
| `strandProfileTopologyAt` | 12797 | function |  | 6 |
| `strandCurveParameters` | 12839 | function |  | 4 |
| `widthProfileAt` | 12849 | arrow |  | 1 |
| `braidFrameAt` | 12887 | function |  | 5 |
| `braidFrameAtExtended` | 12897 | function |  | 2 |
| `createBraidProfileProjector` | 12906 | function |  | 2 |
| `project` | 12922 | arrow |  | 17 |
| `createBraidGeometry` | 12937 | function |  | 2 |
| `deformationAt` | 12972 | function |  | 3 |
| `widthFor` | 12981 | arrow |  | 3 |
| `depthFor` | 12985 | arrow |  | 3 |
| `outputVertex` | 13017 | function |  | 7 |
| `appendAuthoredCap` | 13125 | function |  | 3 |
| `outputCapVertex` | 13132 | arrow |  | 6 |
| `capBoundary` | 13223 | function |  | 3 |
| `strandGeometryCurve` | 13285 | function |  | 12 |
| `strandGeometryFrameAt` | 13311 | function |  | 15 |
| `transportedStrandFrameAt` | 13374 | function |  | 7 |
| `twistOverrideAt` | 13377 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13405 | function |  | 2 |
| `weldPanelGeometryData` | 13441 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13481 | function |  | 3 |
| `surfacePanelPoint` | 13496 | function |  | 3 |
| `createPanelStrandGeometry` | 13519 | function |  | 2 |
| `addQuad` | 13553 | arrow |  | 6 |
| `near` | 13557 | arrow |  | 6 |
| `panelWidthAt` | 13587 | arrow |  | 6 |
| `panelThicknessAt` | 13596 | arrow |  | 6 |
| `panelFrameAt` | 13605 | arrow |  | 1 |
| `rawPanelPoint` | 13623 | arrow |  | 1 |
| `panelPoint` | 13643 | arrow |  | 2 |
| `addPatch` | 13649 | arrow |  | 1 |
| `splitOpening` | 13700 | arrow |  | 2 |
| `uStart` | 13724 | arrow |  | 1 |
| `uEnd` | 13727 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13765 | function |  | 3 |
| `inside` | 13766 | arrow |  | 2 |
| `pushOrientedTriangle` | 13788 | function |  | 7 |
| `triangulatePolygon3D` | 13799 | function |  | 1 |
| `orientedQuadFace` | 13839 | function |  | 2 |
| `createSplitStrandGeometry` | 13847 | function |  | 2 |
| `fusedIndexAt` | 14004 | arrow |  | 0 |
| `createHairCardGeometry` | 14053 | function |  | 2 |
| `createPolyGeometry` | 14152 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14179 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14188 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14235 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14243 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14259 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14268 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14279 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14287 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14297 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14317 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14340 | function |  | 4 |
| `createCompoundStrandGeometry` | 14423 | function |  | 2 |
| `proceduralBranchGeometryLock` | 14674 | function |  | 2 |
| `createHairGeometry` | 14714 | function |  | 6 |
| `createBaseHairGeometry` | 14766 | function |  | 3 |
| `hairMaterialDefinition` | 14884 | function |  | 4 |
| `materialForLock` | 14888 | function |  | 8 |
| `activeHairMaterialDefinition` | 14892 | function |  | 11 |
| `strandDisplayColor` | 14898 | function |  | 14 |
| `setAnimeHairBaseColor` | 14916 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 14929 | function |  | 2 |
| `createHairMaterial` | 14969 | function |  | 5 |
| `createStrandSelectionOutline` | 15011 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15045 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15054 | function |  | 6 |
| `refreshMaterialUsers` | 15081 | function |  | 6 |
| `renderHairMaterialOutliner` | 15090 | function |  | 5 |
| `renderHairMaterialOptions` | 15120 | function |  | 3 |
| `syncHairMaterialEditor` | 15130 | function |  | 9 |
| `createProjectHairMaterial` | 15156 | function |  | 3 |
| `deleteActiveHairMaterial` | 15176 | function |  | 2 |
| `createHairTopologyGeometry` | 15194 | function |  | 4 |
| `createHairTopologyOverlay` | 15215 | function |  | 3 |
| `groupDefaultsFor` | 15262 | function |  | 9 |
| `creationToolActive` | 15269 | function |  | 8 |
| `activeCreationShapeDefaults` | 15273 | function |  | 11 |
| `activeStrandShapeTarget` | 15279 | function |  | 5 |
| `curvePolylineLength` | 15283 | function |  | 2 |
| `curvePolylineLengths` | 15291 | function |  | 3 |
| `samplePolylineDistance` | 15299 | function |  | 2 |
| `applyProjectedCurveLength` | 15309 | function |  | 4 |
| `clearRegionLengthBaseline` | 15340 | function |  | 2 |
| `ensureRegionLengthBaseline` | 15347 | function |  | 2 |
| `setGroupLengthScale` | 15355 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 15393 | function |  | 5 |
| `requestGroupDefaultsWarning` | 15425 | function |  | 1 |
| `activeSweepProfile` | 15434 | function |  | 9 |
| `activeSweepProfileTarget` | 15441 | function |  | 6 |
| `trimmedSweepProfile` | 15448 | function |  | 7 |
| `roundedLeft` | 15457 | arrow |  | 1 |
| `roundedRight` | 15463 | arrow |  | 1 |
| `activeProfileOffset` | 15480 | function |  | 4 |
| `mirroredSweepProfileIndex` | 15487 | function |  | 3 |
| `profileToCanvas` | 15504 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 15508 | function |  | 11 |
| `sampleSweepProfile` | 15517 | function |  | 7 |
| `createSweepProfileTopology` | 15538 | function |  | 5 |
| `renderProfilePreview` | 15580 | function |  | 8 |
| `renderHairCardCoveragePath` | 15599 | function |  | 3 |
| `activeTaperTarget` | 15614 | function |  | 15 |
| `twistCurveEditing` | 15621 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 15625 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 15629 | function |  | 7 |
| `proceduralBranchCurveEditing` | 15633 | function |  | 17 |
| `activeTaperCurve` | 15660 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 15671 | function |  | 6 |
| `taperSamples` | 15681 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 15688 | function |  | 2 |
| `renderTaperPreview` | 15710 | function |  | 13 |
| `renderTwistCurvePreview` | 15746 | function |  | 5 |
| `shapeTargetForSelect` | 15766 | function |  | 3 |
| `setupShapePresetControls` | 15776 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 15801 | function |  | 3 |
| `syncShapePresetSelects` | 15807 | function |  | 7 |
| `populateShapePresetSelects` | 15828 | function |  | 5 |
| `openSaveShapePreset` | 15856 | function |  | 2 |
| `commitCustomShapePreset` | 15881 | function |  | 2 |
| `openRemoveShapePreset` | 15904 | function |  | 2 |
| `commitRemoveShapePreset` | 15917 | function |  | 2 |
| `taperPointToCanvas` | 15933 | function |  | 4 |
| `canvasToTaperPoint` | 15950 | function |  | 2 |
| `clearTaperMeshPoints` | 15986 | function |  | 2 |
| `taperMeshPointFrame` | 15996 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16006 | function |  | 4 |
| `twistMeshGraphAxis` | 16014 | function |  | 4 |
| `addTwistMeshCurvePath` | 16018 | function |  | 2 |
| `appendSegment` | 16039 | arrow |  | 1 |
| `appendFill` | 16042 | arrow |  | 1 |
| `appendSignedSection` | 16048 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16097 | function |  | 6 |
| `updateTaperMeshPoints` | 16134 | function |  | 5 |
| `setTaperMeshPointsVisible` | 16213 | function |  | 5 |
| `renderTaperCurveEditor` | 16231 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 16303 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 16317 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 16333 | function |  | 2 |
| `scheduleTaperCurveEdit` | 16365 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 16374 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 16385 | function |  | 2 |
| `applyTaperCurveEdit` | 16393 | function |  | 10 |
| `openTaperCurveEditor` | 16501 | function |  | 3 |
| `closeTaperCurveEditor` | 16546 | function |  | 5 |
| `updateViewportStatsVisibility` | 16559 | function |  | 6 |
| `canvasToProfile` | 16578 | function |  | 2 |
| `renderSweepProfileEditor` | 16588 | function |  | 7 |
| `applySweepProfileEdit` | 16631 | function |  | 8 |
| `openSweepProfileEditor` | 16658 | function |  | 1 |
| `closeSweepProfileEditor` | 16693 | function |  | 2 |
| `retargetFloatingStrandEditors` | 16702 | function |  | 2 |
| `addLock` | 16717 | function |  | 19 |
| `mirroredScalpRegion` | 16920 | function |  | 5 |
| `mirroredVector` | 16929 | function |  | 12 |
| `mirroredPlacementFrame` | 16933 | function |  | 2 |
| `mirrorPartnerFor` | 16946 | function |  | 40 |
| `decoupleMirrorPartner` | 16950 | function |  | 2 |
| `createMirrorPartner` | 16958 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17054 | function |  | 6 |
| `mirroredClumpPartners` | 17059 | function |  | 6 |
| `createMirroredClump` | 17065 | function |  | 3 |
| `decoupleMirroredClump` | 17087 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17106 | function |  | 6 |
| `syncActiveMirror` | 17271 | function |  | 25 |
| `setMirrorXEditing` | 17283 | function |  | 6 |
| `snapshotState` | 17307 | function |  | 7 |
| `scalpTriangleRegion` | 17564 | function |  | 4 |
| `closestPointOnActiveScalp` | 17577 | function |  | 12 |
| `rootAttachmentFrame` | 17649 | function |  | 3 |
| `rootAttachmentLocalFrame` | 17661 | function |  | 4 |
| `resolveRootAttachment` | 17679 | function |  | 4 |
| `curvePointsToRootLocal` | 17719 | function |  | 2 |
| `curvePointsFromRootLocal` | 17731 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 17739 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 17755 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 17785 | function |  | 2 |
| `createRootAttachment` | 17797 | function |  | 9 |
| `syncRootAttachmentMetadata` | 17827 | function |  | 4 |
| `rootAttachmentToData` | 17854 | function |  | 2 |
| `rootAttachmentFromData` | 17882 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 17921 | function |  | 2 |
| `remapPoint` | 17936 | arrow |  | 1 |
| `remapVector` | 17937 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 17966 | function |  | 2 |
| `importHeadMeshFile` | 17983 | function |  | 3 |
| `importFullBodyMeshFile` | 18006 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18031 | function |  | 1 |
| `importedBooleanPreference` | 18064 | function |  | 11 |
| `loadPreferencesAndPresets` | 18078 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18148 | function |  | 1 |
| `openHairProjectFile` | 18191 | function |  | 4 |
| `dragContainsApplicationFile` | 18249 | function |  | 3 |
| `safelyRememberRecentProject` | 18258 | function |  | 2 |
| `renderRecentProjectsMenu` | 18267 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 18299 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 18324 | function |  | 2 |
| `confirmDroppedApplicationFile` | 18328 | function |  | 2 |
| `pushUndoState` | 18344 | function |  | 116 |
| `undoLastAction` | 18351 | function |  | 2 |
| `redoLastAction` | 18365 | function |  | 2 |
| `updateHistoryButtons` | 18379 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 18384 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 18401 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 18408 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 18446 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 18523 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 18549 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 18581 | function |  | 2 |
| `finalizeStateRestore` | 18622 | function |  | 2 |
| `restoreState` | 18629 | function |  | 5 |
| `disposeAllEditableObjects` | 18653 | function |  | 2 |
| `restoreLock` | 18674 | function |  | 4 |
| `restoreGuide` | 18891 | function |  | 2 |
| `vectorToData` | 18952 | function |  | 29 |
| `dataToVector` | 18956 | function |  | 31 |
| `frameToData` | 18960 | function |  | 2 |
| `frameFromData` | 18972 | function |  | 2 |
| `applyPresetSelection` | 18984 | function |  | 2 |
| `drawPresetThumbnail` | 19015 | function |  | 1 |
| `fillHair` | 19030 | arrow |  | 9 |
| `strand` | 19042 | arrow |  | 31 |
| `bun` | 19060 | arrow |  | 2 |
| `braid` | 19095 | arrow |  | 2 |
| `renderPresetLibrary` | 19184 | function |  | 3 |
| `setPresetLibraryOpen` | 19243 | function |  | 6 |
| `average` | 19256 | function |  | 4 |
| `fitPointAttributes` | 19260 | function |  | 9 |
| `rebuildCurveObjects` | 19289 | function |  | 10 |
| `createCurvePoints` | 19301 | function |  | 2 |
| `addGeneratedBangPreset` | 19310 | function |  | 1 |
| `sampleScalpQuad` | 19403 | function |  | 4 |
| `createLongLayeredCurlPoints` | 19427 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 19476 | function |  | 1 |
| `columns` | 19477 | arrow |  | 1 |
| `layer` | 19481 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 19695 | function |  | 2 |
| `addBraidedBobPreset` | 19731 | function |  | 1 |
| `evenColumns` | 19732 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 19948 | function |  | 1 |
| `scalpSeed` | 19971 | arrow |  | 1 |
| `createBowlCutPoints` | 20258 | function |  | 2 |
| `addBowlCutPreset` | 20296 | function |  | 1 |
| `scalpRegionAtHit` | 20362 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 20374 | function |  | 6 |
| `selectedCurveLatticeGuide` | 20381 | function |  | 12 |
| `braidStrokeActive` | 20388 | function |  | 9 |
| `proceduralDrawActive` | 20392 | function |  | 3 |
| `panelStrokeActive` | 20396 | function |  | 6 |
| `activeStrokeSurfaceInput` | 20400 | function |  | 4 |
| `activeStrokeSurfaceValue` | 20404 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 20408 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 20414 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 20418 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 20422 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 20426 | function |  | 3 |
| `liveSurfaceStrandId` | 20436 | function |  | 4 |
| `liveSurfaceStrand` | 20440 | function |  | 4 |
| `liveSurfaceGuideId` | 20445 | function |  | 3 |
| `guideSupportsLiveSurface` | 20449 | function |  | 2 |
| `liveSurfaceGuide` | 20456 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 20463 | function |  | 12 |
| `activeStrokeScalpOffset` | 20503 | function |  | 4 |
| `activeStrokeBrushSize` | 20509 | function |  | 10 |
| `activeStrokeBrushDepth` | 20515 | function |  | 5 |
| `strokeSurfaceIsContextual` | 20521 | function |  | 7 |
| `contextualPlaneAtOrigin` | 20529 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 20539 | function |  | 13 |
| `worldNormalAtHit` | 20578 | function |  | 6 |
| `selectedPolyMesh` | 20586 | function |  | 10 |
| `addPolyLock` | 20591 | function |  | 2 |
| `ensurePolyMesh` | 20610 | function |  | 3 |
| `polySurfaceSample` | 20614 | function |  | 4 |
| `polyTargetAtEvent` | 20625 | function |  | 6 |
| `refreshPolyMesh` | 20651 | function |  | 10 |
| `ensurePolyFillPreview` | 20660 | function |  | 2 |
| `clearPolyFillPreview` | 20697 | function |  | 17 |
| `polyFillCandidateForEvent` | 20702 | function |  | 3 |
| `showPolyFillPreview` | 20722 | function |  | 2 |
| `updatePolyFillPreview` | 20748 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 20773 | function |  | 5 |
| `fillPolyGap` | 20783 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 20794 | function |  | 2 |
| `projectPolyRelaxPoint` | 20814 | function |  | 2 |
| `removePolyPointAttributes` | 20858 | function |  | 3 |
| `deletePolyComponent` | 20867 | function |  | 2 |
| `addPolyPoint` | 20890 | function |  | 4 |
| `appendPolyStrokeRow` | 20899 | function |  | 4 |
| `beginPolyBrushPointer` | 20919 | function |  | 1 |
| `finishPolyAltDelete` | 21005 | function |  | 1 |
| `updatePolyBrushStroke` | 21019 | function |  | 1 |
| `finishPolyBrushStroke` | 21109 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21146 | function |  | 2 |
| `drawSampleFromHit` | 21169 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21183 | function |  | 3 |
| `strokeLength` | 21220 | function |  | 9 |
| `resampleDrawStroke` | 21226 | function |  | 2 |
| `processedDrawStroke` | 21258 | function |  | 8 |
| `strokeSurfaceNormals` | 21287 | function |  | 7 |
| `drawClumpFrame` | 21298 | function |  | 4 |
| `nearestCurveParameter` | 21307 | function |  | 2 |
| `drawClumpSampleNormal` | 21321 | function |  | 6 |
| `drawClumpTemplateVector` | 21330 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 21336 | function |  | 3 |
| `drawClumpStrandMaps` | 21352 | function |  | 4 |
| `nextClumpName` | 21407 | function |  | 6 |
| `initializeClumpShape` | 21414 | function |  | 5 |
| `stableClumpVariation` | 21425 | function |  | 3 |
| `createClumpFromLocks` | 21437 | function |  | 7 |
| `addLockToClump` | 21462 | function |  | 4 |
| `stableBranchBaseNormals` | 21480 | function |  | 4 |
| `ensureBranchParentNormalField` | 21491 | function |  | 2 |
| `branchParentFrame` | 21497 | function |  | 7 |
| `branchLocalVector` | 21509 | function |  | 3 |
| `branchWorldVector` | 21513 | function |  | 4 |
| `captureBranchLocalState` | 21519 | function |  | 6 |
| `enforceBranchRootPosition` | 21547 | function |  | 4 |
| `pointerToNdc` | 21631 | function |  | 1 |
| `gridProfileSkipCol` | 21647 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 21667 | function |  | 3 |
| `branchChildrenFor` | 21687 | function |  | 8 |
| `detachBranch` | 21691 | function |  | 2 |
| `updateBranchChildren` | 21702 | function |  | 4 |
| `clumpDirectMembers` | 21745 | function |  | 3 |
| `clumpMembersForGuide` | 21750 | function |  | 6 |
| `clumpGuideForLock` | 21754 | function |  | 13 |
| `proceduralGuideForLock` | 21759 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 21766 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 21773 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 21780 | function |  | 3 |
| `proceduralBranchWorldPoints` | 21792 | function |  | 2 |
| `applyProceduralBranchSettings` | 21805 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 21844 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 21860 | function |  | 3 |
| `createProceduralAccessoryLock` | 21874 | function |  | 2 |
| `applyProceduralAccessorySettings` | 21926 | function |  | 2 |
| `clumpFrameAt` | 21977 | function |  | 5 |
| `commitClumpMemberRestState` | 21985 | function |  | 10 |
| `updateClumpMembers` | 22068 | function |  | 10 |
| `dissolveClump` | 22172 | function |  | 6 |
| `detachLockFromClump` | 22209 | function |  | 4 |
| `updateDrawVolumePreview` | 22235 | function |  | 5 |
| `hideDrawClumpPreviews` | 22259 | function |  | 5 |
| `resetDrawVolumePreview` | 22265 | function |  | 3 |
| `updateDrawStrandPreview` | 22271 | function |  | 23 |
| `continueFromTipEnabled` | 22490 | function |  | 2 |
| `selectedTipContinuationLock` | 22496 | function |  | 3 |
| `selectedDrawBranchPoint` | 22509 | function |  | 3 |
| `canBranchDrawFromLock` | 22526 | function |  | 3 |
| `beginDrawStrandStroke` | 22533 | function |  | 2 |
| `beginDrawFreePlane` | 22658 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 22672 | function |  | 2 |
| `updateDrawStrandStroke` | 22697 | function |  | 1 |
| `createDrawnLock` | 22743 | function |  | 3 |
| `setting` | 22747 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 22815 | function |  | 4 |
| `createDrawnBraid` | 22823 | function |  | 2 |
| `createDrawnStrand` | 22880 | function |  | 2 |
| `createDrawnPanel` | 23007 | function |  | 2 |
| `surfaceLatticeNormal` | 23057 | function |  | 2 |
| `createSurfaceLockFromLattice` | 23072 | function |  | 3 |
| `createViewportSurface` | 23137 | function |  | 2 |
| `loftSurfaceProfilePoints` | 23166 | function |  | 6 |
| `hideLoftSurfacePreviews` | 23172 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 23179 | function |  | 4 |
| `updateLoftSurfacePreview` | 23188 | function |  | 5 |
| `resetLoftSurfaceDraft` | 23220 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 23236 | function |  | 3 |
| `cloneCurveSurfaceSource` | 23254 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 23276 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 23302 | function |  | 3 |
| `curveSurfaceProfilePoints` | 23312 | function |  | 3 |
| `curveSurfaceProfileNormals` | 23316 | function |  | 2 |
| `curveSurfacePreviewLock` | 23325 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 23348 | function |  | 2 |
| `hideCurveSurfacePreview` | 23364 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 23376 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 23381 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 23390 | function |  | 3 |
| `curveSurfaceSideVector` | 23428 | function |  | 4 |
| `curveSurfaceDraftCurves` | 23441 | function |  | 2 |
| `curveSurfaceFallbackHit` | 23449 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 23462 | function |  | 5 |
| `updateCurveSurfacePreview` | 23482 | function |  | 6 |
| `resetCurveSurfaceDraft` | 23544 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 23566 | function |  | 3 |
| `beginCurveSurfaceStroke` | 23581 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 23629 | function |  | 3 |
| `updateCurveSurfaceStroke` | 23664 | function |  | 1 |
| `finishCurveSurfaceStroke` | 23696 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 23754 | function |  | 2 |
| `commitCurveSurfaceDraft` | 23831 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 23836 | function |  | 8 |
| `beginLoftSurfaceStroke` | 23845 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 23879 | function |  | 2 |
| `updateLoftSurfaceStroke` | 23890 | function |  | 1 |
| `finishLoftSurfaceStroke` | 23920 | function |  | 2 |
| `extendDrawnStrand` | 23977 | function |  | 2 |
| `finishDrawStrandStroke` | 24010 | function |  | 7 |
| `createPlacedStrand` | 24037 | function |  | 2 |
| `placedPointCount` | 24101 | function |  | 3 |
| `createPlacedPoints` | 24105 | function |  | 3 |
| `pushPointOutsideHead` | 24124 | function |  | 8 |
| `resizePlacedStrand` | 24156 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 24173 | function |  | 5 |
| `beginPlaceEdit` | 24178 | function |  | 2 |
| `updatePlaceEdit` | 24196 | function |  | 1 |
| `updatePlacementLength` | 24210 | function |  | 3 |
| `updatePlacementOrientation` | 24220 | function |  | 3 |
| `endPlaceEdit` | 24238 | function |  | 1 |
| `confirmPendingPlacedStrand` | 24253 | function |  | 1 |
| `pendingPlacedLock` | 24263 | function |  | 2 |
| `beginPlacementPointer` | 24267 | function |  | 3 |
| `finishPlacementPointer` | 24277 | function |  | 2 |
| `confirmPlacementStep` | 24301 | function |  | 2 |
| `finishPlacementFlow` | 24324 | function |  | 7 |
| `updatePlacementStatus` | 24337 | function |  | 82 |
| `deselectStrands` | 24476 | function |  | 12 |
| `beginSelectionMarquee` | 24491 | function |  | 3 |
| `beginAltOrbit` | 24515 | function |  | 1 |
| `beginBlenderNavigation` | 24527 | function |  | 1 |
| `endBlenderNavigation` | 24572 | function |  | 1 |
| `prepareSelectPointerCapture` | 24580 | function |  | 1 |
| `endSelectPointerCapture` | 24586 | function |  | 1 |
| `endAltOrbit` | 24592 | function |  | 1 |
| `dollyCameraByDrag` | 24599 | function |  | 2 |
| `fastDragMagnitude` | 24622 | function |  | 2 |
| `beginHoudiniZoomDrag` | 24628 | function |  | 1 |
| `updateHoudiniZoomDrag` | 24636 | function |  | 1 |
| `endHoudiniZoomDrag` | 24653 | function |  | 1 |
| `updateSelectionMarquee` | 24661 | function |  | 1 |
| `pointInsideSelectionMarquee` | 24678 | function |  | 3 |
| `selectPointsInMarquee` | 24686 | function |  | 2 |
| `pointKey` | 24712 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 24743 | function |  | 2 |
| `objectInsideSelectionMarquee` | 24780 | function |  | 3 |
| `projectedPoint` | 24797 | arrow |  | 1 |
| `selectObjectsInMarquee` | 24826 | function |  | 2 |
| `finishSelectionMarquee` | 24871 | function |  | 2 |
| `headMeshes` | 24894 | function |  | 9 |
| `strandSplitProfileData` | 24902 | function |  | 4 |
| `strandSplitControlPoint` | 24915 | function |  | 4 |
| `panelSplitControlPoint` | 24951 | function |  | 6 |
| `strandControlPointRaycast` | 25007 | function |  | 1 |
| `strandControlPointFrame` | 25042 | function |  | 5 |
| `branchRootGizmoFrame` | 25073 | function |  | 5 |
| `strandControlPointHitFromEvent` | 25091 | function |  | 5 |
| `createCurveObjects` | 25149 | function |  | 4 |
| `polyEdgeKey` | 25322 | function |  | 2 |
| `polyMeshEdges` | 25326 | function |  | 2 |
| `populatePolyEditObjects` | 25340 | function |  | 3 |
| `createPolyEditObjects` | 25401 | function |  | 2 |
| `rebuildPolyEditObjects` | 25409 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 25423 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 25430 | function |  | 2 |
| `strandWidthEdgeSample` | 25439 | function |  | 3 |
| `strandWidthEdgePoints` | 25462 | function |  | 2 |
| `sculptBrushDebugRaycast` | 25476 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 25480 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 25487 | function |  | 3 |
| `refreshSculptBrushDebugView` | 25499 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 25504 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 25510 | function |  | 3 |
| `updateCurveObjects` | 25524 | function |  | 35 |
| `createCurveNormalIndicator` | 25781 | function |  | 2 |
| `pointUpDirection` | 25807 | function |  | 2 |
| `curveFrameAtPoint` | 25811 | function |  | 5 |
| `curveFrameAt` | 25832 | function |  | 6 |
| `strandTwistAt` | 25852 | function |  | 6 |
| `controlPointRotationAt` | 25857 | function |  | 5 |
| `strandProfileTwistAt` | 25861 | function |  | 2 |
| `strandFrameAt` | 25867 | function |  | 1 |
| `curveFrameAtSnapshot` | 25873 | function |  | 3 |
| `outwardNormalAtPoint` | 25892 | function |  | 11 |
| `sampledSurfaceNormal` | 25904 | function |  | 2 |
| `guidedNormalAt` | 25920 | function |  | 5 |
| `twistFromHandle` | 25939 | function |  | 3 |
| `signedAngleAroundAxis` | 25960 | function |  | 5 |
| `handleColor` | 25967 | function |  | 2 |
| `isAffectedCurvePoint` | 25990 | function |  | 2 |
| `syncLockFromCurve` | 25996 | function |  | 26 |
| `labelForPreset` | 26026 | function |  | 1 |
| `rebuildLockGeometry` | 26030 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 26057 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 26065 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 26071 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 26093 | function |  | 8 |
| `updateLockGeometry` | 26106 | function |  | 57 |
| `setGroupColorView` | 26127 | function |  | 2 |
| `createUvCheckerTexture` | 26137 | function |  | 3 |
| `ensureUvCheckerForLock` | 26173 | function |  | 4 |
| `removeUvCheckerFromLock` | 26206 | function |  | 3 |
| `invalidateUvInspector` | 26221 | function |  | 7 |
| `uvInspectorRecord` | 26225 | function |  | 1 |
| `uvInspectorRecords` | 26264 | function |  | 2 |
| `drawUvInspectorGrid` | 26268 | function |  | 2 |
| `renderUvInspector` | 26302 | function |  | 3 |
| `setUvCheckerEnabled` | 26361 | function |  | 3 |
| `strandViewportBaseColor` | 26378 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 26413 | function |  | 3 |
| `syncStrandSelectionOutline` | 26419 | function |  | 2 |
| `applyLockedStrandPalette` | 26430 | function |  | 2 |
| `syncLockedStrandWireVisual` | 26439 | function |  | 6 |
| `setStrandSelectionVisual` | 26448 | function |  | 6 |
| `proceduralParentOutlineVisible` | 26464 | function |  | 2 |
| `syncProceduralParentVisibility` | 26471 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 26480 | function |  | 2 |
| `updateStrandSelectionHighlight` | 26484 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 26488 | function |  | 2 |
| `resetGuideSelectionVisuals` | 26501 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 26521 | function |  | 3 |
| `selectLock` | 26554 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 26607 | function |  | 6 |
| `syncGroupInputs` | 26618 | function |  | 2 |
| `topologyStatsForLock` | 26651 | function |  | 4 |
| `formatTopologyStats` | 26659 | function |  | 5 |
| `updateTopologyStats` | 26663 | function |  | 20 |
| `normalizeBraidDimensions` | 26697 | function |  | 3 |
| `normalizeStrandDimensions` | 26710 | function |  | 3 |
| `strandBaseWidth` | 26724 | function |  | 5 |
| `strandWidthDimension` | 26728 | function |  | 5 |
| `strandDepthDimension` | 26736 | function |  | 8 |
| `setStrandWidthDimension` | 26744 | function |  | 2 |
| `setStrandDepthDimension` | 26766 | function |  | 4 |
| `syncShapeDimensionInputs` | 26782 | function |  | 4 |
| `syncCreationShapeInputs` | 26818 | function |  | 3 |
| `syncViewportDrawSettings` | 26856 | function |  | 5 |
| `syncPanelShapeInputs` | 26870 | function |  | 6 |
| `syncStrandSplitInputs` | 26896 | function |  | 4 |
| `syncHairCardControls` | 26905 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 26913 | function |  | 3 |
| `updateAttributeEditorMode` | 26952 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 27102 | function |  | 3 |
| `curveLatticeForGroup` | 27125 | function |  | 2 |
| `filterCurveLatticesToGroup` | 27143 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 27188 | function |  | 2 |
| `showCurveLatticeForGroup` | 27205 | function |  | 2 |
| `selectStrandGroup` | 27242 | function |  | 3 |
| `selectCurvePoint` | 27284 | function |  | 10 |
| `updateSelectedPointLabel` | 27298 | function |  | 14 |
| `syncInputs` | 27311 | function |  | 15 |
| `syncClumpGuidePanel` | 27357 | function |  | 3 |
| `getSelectedLock` | 27384 | function |  | 103 |
| `selectedLocksInOrder` | 27388 | function |  | 37 |
| `lockStrands` | 27394 | function |  | 3 |
| `lockSelectedStrands` | 27427 | function |  | 3 |
| `unlockStrands` | 27433 | function |  | 3 |
| `unlockAllStrands` | 27448 | function |  | 3 |
| `strandEditFamily` | 27452 | function |  | 7 |
| `compatibleSelectedLocks` | 27457 | function |  | 6 |
| `selectedEditRoots` | 27464 | function |  | 2 |
| `editSelectedLocks` | 27477 | function |  | 20 |
| `multiEditValuesEqual` | 27510 | function |  | 2 |
| `setMixedControl` | 27519 | function |  | 28 |
| `syncMultiStrandInputs` | 27536 | function |  | 16 |
| `values` | 27552 | arrow |  | 43 |
| `selectedRebuildableCurves` | 27632 | function |  | 5 |
| `createCompoundStrand` | 27639 | function |  | 1 |
| `refreshRebuildCurveDialog` | 27700 | function |  | 9 |
| `openRebuildCurveDialog` | 27713 | function |  | 1 |
| `rebuildSelectedCurves` | 27727 | function |  | 2 |
| `selectionCanBecomeClump` | 27766 | function |  | 4 |
| `createClumpFromSelection` | 27771 | function |  | 3 |
| `cleanSelectionSets` | 27783 | function |  | 2 |
| `createSelectionSetFromSelection` | 27788 | function |  | 3 |
| `selectionSetById` | 27799 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 27803 | function |  | 7 |
| `editSelectionSetFromSelection` | 27812 | function |  | 5 |
| `deleteSelectionSet` | 27832 | function |  | 2 |
| `selectSelectionSet` | 27841 | function |  | 2 |
| `deleteSelectedStrands` | 27851 | function |  | 4 |
| `deleteGuide` | 27859 | function |  | 3 |
| `deleteSelectedGuide` | 27882 | function |  | 3 |
| `deleteSelectedReferenceImage` | 27886 | function |  | 4 |
| `hasDeletableSelection` | 27899 | function |  | 2 |
| `deleteCurrentSelection` | 27907 | function |  | 3 |
| `hideOutlinerContextMenu` | 27915 | function |  | 17 |
| `outlinerLockTargets` | 27920 | function |  | 3 |
| `showOutlinerContextMenu` | 27947 | function |  | 10 |
| `hideStrandRadialMenu` | 28027 | function |  | 4 |
| `ensureRadialButtonCapacity` | 28038 | function |  | 3 |
| `radialButtonDimensions` | 28051 | function |  | 4 |
| `radialMenuDimensionsForKind` | 28060 | function |  | 3 |
| `applyRadialMenuDimensions` | 28077 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 28083 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 28096 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 28117 | function |  | 2 |
| `selectionSetRadialMenuOption` | 28134 | function |  | 4 |
| `selectedMirrorRadialOptions` | 28143 | function |  | 3 |
| `strandVisibilityRadialOptions` | 28165 | function |  | 5 |
| `clumpMirrorRadialOptions` | 28183 | function |  | 2 |
| `contextualRadialOptions` | 28190 | function |  | 3 |
| `sharedRadialFrameDimensions` | 28319 | function |  | 3 |
| `layoutContextualRadialOptions` | 28323 | function |  | 4 |
| `renderRadialActionList` | 28347 | function |  | 3 |
| `radialListOptionAtPointer` | 28365 | function |  | 3 |
| `syncRadialListHighlight` | 28387 | function |  | 3 |
| `configureContextualRadialMenu` | 28393 | function |  | 3 |
| `beginStrandRadialGesture` | 28453 | function |  | 2 |
| `enterStrandRadialSubmenu` | 28487 | function |  | 2 |
| `updateStrandRadialGesture` | 28533 | function |  | 1 |
| `performStrandRadialAction` | 28572 | function |  | 2 |
| `finishStrandRadialGesture` | 28675 | function |  | 2 |
| `cancelStrandRadialGesture` | 28685 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 28692 | function |  | 1 |
| `setPullMoveEnabled` | 28698 | function |  | 3 |
| `toolRadialOptions` | 28706 | function |  | 2 |
| `hideToolRadialMenu` | 28731 | function |  | 4 |
| `beginToolRadialGesture` | 28744 | function |  | 2 |
| `beginToolShortcutPress` | 28784 | function |  | 2 |
| `finishToolShortcutPress` | 28799 | function |  | 2 |
| `cancelToolShortcutPress` | 28808 | function |  | 5 |
| `setRadialMenusEnabled` | 28816 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 28829 | function |  | 5 |
| `setNavigationTipsEnabled` | 28844 | function |  | 5 |
| `configureNavigationMouseButtons` | 28851 | function |  | 3 |
| `syncNavigationModifierLocks` | 28864 | function |  | 7 |
| `setNavigationStyle` | 28869 | function |  | 5 |
| `applyCameraSmoothingPreference` | 28885 | function |  | 4 |
| `setCameraSmoothingEnabled` | 28900 | function |  | 5 |
| `setCameraSmoothingStrength` | 28906 | function |  | 5 |
| `setScaleSensitivity` | 28914 | function |  | 3 |
| `setToolTipsEnabled` | 28922 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 28929 | function |  | 5 |
| `setViewportStatisticsEnabled` | 28938 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 28946 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 28961 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 28970 | function |  | 5 |
| `sideNamingDisplayId` | 28979 | function |  | 3 |
| `referenceViewDisplayLabel` | 28991 | function |  | 6 |
| `strandRegionDisplayLabel` | 29001 | function |  | 10 |
| `updateSideNamingLabels` | 29019 | function |  | 2 |
| `setSideNamingPerspective` | 29046 | function |  | 5 |
| `setControlPointDisplaySize` | 29055 | function |  | 6 |
| `scaleHexColor` | 29067 | function |  | 3 |
| `setViewportBackgroundColor` | 29072 | function |  | 7 |
| `setDefaultHairShader` | 29094 | function |  | 5 |
| `setPreferenceCategory` | 29100 | function |  | 4 |
| `openPreferencesDialog` | 29127 | function |  | 1 |
| `savePreferencesDialog` | 29155 | function |  | 1 |
| `cancelPreferencesDialog` | 29179 | function |  | 3 |
| `updateToolRadialGesture` | 29208 | function |  | 1 |
| `performToolRadialAction` | 29237 | function |  | 2 |
| `finishToolRadialGesture` | 29247 | function |  | 2 |
| `cancelToolRadialGesture` | 29256 | function |  | 5 |
| `duplicatePlacementTarget` | 29263 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 29290 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 29294 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 29304 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 29309 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 29321 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 29332 | function |  | 7 |
| `openProceduralDuplicateDialog` | 29340 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 29357 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 29378 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 29389 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 29395 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 29401 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 29434 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 29589 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 29691 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 29732 | function |  | 2 |
| `updateDuplicatePlacement` | 29759 | function |  | 2 |
| `beginDuplicatePlacement` | 29823 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 29887 | function |  | 2 |
| `confirmDuplicatePlacement` | 29928 | function |  | 1 |
| `cancelDuplicatePlacement` | 29965 | function |  | 4 |
| `outlinerClumpLocks` | 29991 | function |  | 11 |
| `handleOutlinerClumpDrop` | 29995 | function |  | 3 |
| `createOutlinerStrandButton` | 30018 | function |  | 4 |
| `createOutlinerCurveSurface` | 30104 | function |  | 2 |
| `createOutlinerClump` | 30200 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 30282 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 30289 | function |  | 2 |
| `renderLockList` | 30368 | function |  | 70 |
| `updateCount` | 30522 | function |  | 34 |
| `captureInputUndo` | 30531 | function |  | 1 |
| `bindUndoCapture` | 30537 | function |  | 36 |
| `bindLockInput` | 30548 | function |  | 2 |
| `applyValue` | 30565 | arrow |  | 2 |
| `applyUniformTransformScale` | 30884 | function |  | 2 |
| `applyReducedTransformScale` | 30901 | function |  | 2 |
| `applyTransformPrecision` | 30940 | function |  | 2 |
| `updateTransformScalePointer` | 30969 | function |  | 1 |
| `finishSweepProfileDrag` | 31200 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 31296 | function |  | 3 |
| `finishTaperCurveDrag` | 31358 | function |  | 1 |
| `beginTaperMeshPointDrag` | 31401 | function |  | 1 |
| `updateTaperMeshPointDrag` | 31482 | function |  | 1 |
| `finishTaperMeshPointDrag` | 31537 | function |  | 6 |
| `updateSelectedTaperPoint` | 31561 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 32131 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 32136 | function |  | 4 |
| `syncDrawCurlControls` | 32191 | function |  | 5 |
| `handleLiveSurfaceChange` | 32239 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 32321 | function |  | 3 |
| `resampleSurfaceLock` | 32336 | function |  | 2 |
| `changePanelSplitCount` | 32449 | function |  | 3 |
| `applyPresetControl` | 32557 | function |  | 2 |
| `applyCreationToolSettings` | 32578 | function |  | 2 |
| `populateCreationPresetSelect` | 32622 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 32646 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 32679 | function |  | 5 |
| `createCustomCreationPreset` | 32687 | function |  | 3 |
| `createCustomClumpPreset` | 32702 | function |  | 3 |
| `commitCustomCreationPreset` | 32717 | function |  | 2 |
| `openRemoveCreationPreset` | 32778 | function |  | 3 |
| `commitRemoveCreationPreset` | 32791 | function |  | 1 |
| `applyBraidToolPreset` | 32808 | function |  | 2 |
| `selectedBranchChildLock` | 32920 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 32924 | function |  | 2 |
| `initPanelResizeHandles` | 33030 | function |  | 2 |
| `applyWidth` | 33036 | arrow |  | 2 |
| `restoreWidth` | 33043 | arrow |  | 2 |
| `bindResize` | 33051 | arrow |  | 2 |
| `onMove` | 33059 | arrow |  | 0 |
| `onUp` | 33063 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 33080 | function |  | 2 |
| `initFloatingPanelControls` | 33089 | function |  | 2 |
| `detach` | 33098 | arrow |  | 43 |
| `endDrag` | 33136 | arrow |  | 0 |
| `endResize` | 33168 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 33179 | function |  | 3 |
| `selectPatchNotesVersion` | 33313 | function |  | 3 |
| `requestReferenceImage` | 33346 | function |  | 5 |
| `toggleCapsuleGuideTool` | 33550 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 33556 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 33563 | function |  | 1 |
| `deleteLocks` | 34130 | function |  | 10 |
| `disposeCurveObjects` | 34208 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 34260 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 34291 | function |  | 1 |
| `endPanelSplitHandleDrag` | 34366 | function |  | 2 |
| `resize` | 34399 | function |  | 3 |
| `handleViewportPointerMove` | 34410 | function |  | 1 |
| `blockProportionalSizingEvent` | 34421 | function |  | 1 |
| `updateLightAngleFromInputs` | 34427 | function |  | 2 |
| `startViewSnap` | 34441 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 34471 | function |  | 3 |
| `trackViewportPointerDown` | 34488 | function |  | 1 |
| `trackViewportPointerMove` | 34504 | function |  | 1 |
| `clearViewportPointer` | 34512 | function |  | 1 |
| `updateViewSnap` | 34517 | function |  | 1 |
| `nearestCardinalAxis` | 34553 | function |  | 5 |
| `cardinalAxisKey` | 34567 | function |  | 5 |
| `steppedDragAmount` | 34571 | function |  | 3 |
| `snapCameraToCardinalAxis` | 34577 | function |  | 4 |
| `endViewSnap` | 34593 | function |  | 4 |
| `activateStrandControlPoint` | 34603 | function |  | 4 |
| `refreshStrandControlPointSelection` | 34653 | function |  | 4 |
| `addStrandControlPointSelection` | 34680 | function |  | 3 |
| `removeStrandControlPointSelection` | 34697 | function |  | 3 |
| `sampleStrandPointNormal` | 34711 | function |  | 2 |
| `sampleStrandPointVectors` | 34721 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 34727 | function |  | 2 |
| `resampleStrandCurveData` | 34738 | function |  | 4 |
| `resampleMatchingVectors` | 34744 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 34783 | function |  | 4 |
| `removeStrandCurvePoint` | 34794 | function |  | 2 |
| `closestStrandCurveParameter` | 34807 | function |  | 2 |
| `insertStrandCurvePoint` | 34836 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 34853 | function |  | 2 |
| `selectionModifierCursorAvailable` | 34863 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 34879 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 34886 | function |  | 4 |
| `prepareCurvePointSelection` | 34908 | function |  | 1 |
| `finishCurvePointInsertion` | 35019 | function |  | 1 |
| `finishPointRemoval` | 35034 | function |  | 1 |
| `editableStrandWidth` | 35052 | function |  | 6 |
| `editableStrandWidthBounds` | 35064 | function |  | 2 |
| `applyEditableStrandWidth` | 35070 | function |  | 3 |
| `viewportPixelPoint` | 35106 | function |  | 3 |
| `syncSculptBrushControls` | 35114 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 35129 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 35137 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 35145 | function |  | 1 |
| `sculptBrushPlaneOffset` | 35151 | function |  | 5 |
| `setSculptBrushCursorVisible` | 35155 | function |  | 7 |
| `updateSculptBrushCursor` | 35162 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 35184 | function |  | 4 |
| `sculptBrushEditableLock` | 35191 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 35201 | function |  | 5 |
| `sculptBrushLockViable` | 35207 | function |  | 5 |
| `sculptBrushUnits` | 35218 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 35256 | function |  | 4 |
| `sculptBrushPointWeight` | 35306 | function |  | 5 |
| `sculptBrushWorldDelta` | 35316 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 35325 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 35351 | function |  | 2 |
| `beginSculptMoveStroke` | 35409 | function |  | 1 |
| `applySculptMoveStrokeSample` | 35471 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 35706 | function |  | 3 |
| `updateSculptMoveStroke` | 35715 | function |  | 1 |
| `finishSculptMoveStroke` | 35731 | function |  | 3 |
| `strandControlPointHit` | 35779 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 35783 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 35861 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 35895 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 35935 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 35948 | function |  | 1 |
| `setHoveredControlPoint` | 35987 | function |  | 7 |
| `visibleControlPointHoverTargets` | 36000 | function |  | 2 |
| `updateControlPointHover` | 36036 | function |  | 1 |
| `animate` | 36592 | function |  | 2 |
| `syncCompactSidebarLayout` | 36623 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 36642 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 36648 | function |  | 3 |
| `setAttributeEditorTab` | 36654 | function |  | 6 |

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

## modules/core/misc-store.js（27 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createMiscStore` | 3 | function | export | 1 |

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

## modules/edit/sculpt-edit-store.js（27 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSculptEditStore` | 3 | function | export | 1 |

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

## modules/geometry/branch-bridge.js（1012 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchBridgeApi` | 7 | function | export | 2 |
| `buildBranchBridgeGeometry` | 13 | function |  | 2 |
| `pushBoundary` | 42 | arrow |  | 5 |
| `boundaryAt` | 60 | arrow |  | 3 |
| `hermite` | 82 | arrow |  | 2 |
| `emitBottomMidRow` | 127 | arrow |  | 2 |
| `emitTopMidRow` | 226 | arrow |  | 2 |
| `sideHoleVertex` | 268 | arrow |  | 4 |
| `cachedSideHoleVertex` | 317 | arrow |  | 2 |
| `emitFillStrip` | 388 | arrow |  | 2 |
| `fillSide` | 399 | arrow |  | 0 |
| `directBridgeQuadIndex` | 443 | arrow |  | 2 |
| `edgeDirection` | 467 | arrow |  | 1 |
| `positionAt` | 526 | arrow |  | 1 |
| `createBranchChildGeometry` | 575 | function |  | 1 |
| `applyBranchRootRegionCarving` | 785 | function |  | 1 |
| `branchRootRegionSurface` | 856 | function |  | 6 |
| `toGridCol` | 881 | arrow |  | 5 |
| `toRow` | 885 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 937 | function |  | 2 |
| `branchRootRegionWorldPoints` | 957 | function |  | 1 |
| `pointAt` | 963 | arrow |  | 5 |
| `applyBranchRootOffset` | 988 | function |  | 1 |

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

## modules/geometry/branch-region-panel.js（777 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clampRegionParam` | 7 | function | export | 107 |
| `createBranchRegionApi` | 11 | function | export | 2 |
| `syncBranchRootRegionOffsets` | 19 | function |  | 6 |
| `updateBranchRootRegionCenter` | 44 | function |  | 1 |
| `branchRootRegionFromParam` | 87 | function |  | 1 |
| `cloneBranchRootRegion` | 110 | function |  | 1 |
| `flip` | 112 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 138 | function |  | 7 |
| `setBranchRootRegionPoint` | 169 | function |  | 2 |
| `branchRegionUVToCanvas` | 202 | function |  | 10 |
| `branchRegionCanvasToUV` | 206 | function |  | 4 |
| `openBranchRegionEditor` | 213 | function |  | 2 |
| `closeBranchRegionEditor` | 228 | function |  | 2 |
| `retargetBranchRegionEditor` | 235 | function |  | 1 |
| `renderBranchRegionEditor` | 241 | function |  | 8 |
| `applyBranchRegionView` | 325 | function |  | 6 |
| `resetBranchRegionZoom` | 329 | function |  | 1 |
| `branchRegionNavAction` | 334 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 349 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 370 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 375 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 402 | function |  | 2 |
| `endBranchRegionCanvasNav` | 415 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 421 | function |  | 1 |
| `branchRegionEventUV` | 442 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 450 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 556 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 690 | function |  | 1 |
| `beginBranchSweepStartDrag` | 696 | function |  | 1 |
| `updateBranchSweepStartDrag` | 711 | function |  | 1 |
| `endBranchSweepStartDrag` | 735 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 741 | function |  | 4 |

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

## modules/io/creation-presets.js（233 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createCreationPresetsApi` | 6 | function | export | 2 |
| `presetNumber` | 33 | function |  | 23 |
| `clonePresetShape` | 38 | function |  | 7 |
| `creationPresetSnapshot` | 47 | function |  | 3 |
| `creationToolSettingsSnapshot` | 95 | function |  | 2 |
| `normalizeCreationPresetLibrary` | 122 | function |  | 2 |
| `loadCustomCreationPresets` | 129 | function |  | 1 |
| `saveCustomCreationPresets` | 139 | function |  | 2 |
| `migrateLegacyClumpPresets` | 147 | function |  | 1 |
| `applyCreationPresetSnapshot` | 183 | function |  | 2 |
| `applyCustomCreationPreset` | 200 | function |  | 1 |

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

## modules/io/shape-presets.js（103 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneShapePresetValue` | 3 | function | export | 7 |
| `createShapePresetsApi` | 7 | function | export | 2 |
| `taperAsymmetryKey` | 14 | function |  | 4 |
| `taperSecondaryKey` | 18 | function |  | 4 |
| `shapeValuesMatch` | 22 | function |  | 1 |
| `shapePresetLabel` | 30 | function |  | 1 |
| `loadCustomShapePresets` | 35 | function |  | 1 |
| `saveCustomShapePresets` | 46 | function |  | 1 |
| `applyShapePreset` | 54 | function |  | 1 |

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
