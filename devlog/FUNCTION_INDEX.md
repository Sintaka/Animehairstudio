# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1738** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（36060 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 265 | function |  | 3 |
| `saveBooleanPreference` | 293 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 297 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 302 | function |  | 2 |
| `normalizeScaleSensitivity` | 307 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 312 | function |  | 2 |
| `normalizeSideNamingPerspective` | 317 | function |  | 2 |
| `normalizeNavigationStyle` | 321 | function |  | 2 |
| `setupEditableSliderControls` | 336 | function |  | 2 |
| `syncNumberFromRange` | 387 | arrow |  | 0 |
| `applyNumberValue` | 394 | arrow |  | 0 |
| `copyCameraPose` | 500 | function |  | 3 |
| `updateCameraProjectionForViewport` | 506 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 519 | function |  | 3 |
| `setOrthographicView` | 525 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 565 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 594 | function |  | 2 |
| `removeRotateFreeAxisRing` | 620 | function |  | 2 |
| `deflateTransformGizmoPickers` | 632 | function |  | 2 |
| `nextStrandName` | 1011 | function |  | 2 |
| `activeDrawClumpTemplate` | 1096 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1101 | function |  | 3 |
| `drawModeCreatesClump` | 1128 | function |  | 1 |
| `isPanelGeometry` | 1272 | function |  | 31 |
| `normalizePanelSplits` | 1276 | function |  | 3 |
| `clonePanelSplits` | 1288 | function |  | 19 |
| `snapPanelSplitHeight` | 1292 | function |  | 5 |
| `createQuadSphereGeometry` | 1327 | function |  | 2 |
| `vertexIndex` | 1341 | function |  | 11 |
| `addEdge` | 1359 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1394 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1464 | function |  | 3 |
| `updateScalpRenderGeometry` | 1490 | function |  | 4 |
| `writeScalpRegionColors` | 1541 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1554 | function |  | 2 |
| `createScalpSelectionOutline` | 1584 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1626 | function |  | 25 |
| `activeScalpSurfaceWire` | 1631 | function |  | 2 |
| `activeScalpSelectionOutline` | 1636 | function |  | 2 |
| `inferredCustomScalpRegion` | 1641 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1648 | function |  | 5 |
| `customScalpGeometryFromObject` | 1667 | function |  | 2 |
| `customScalpWireGeometry` | 1699 | function |  | 3 |
| `installCustomScalpGeometry` | 1710 | function |  | 3 |
| `installCustomScalpGuide` | 1734 | function |  | 3 |
| `setScalpGuideSource` | 1752 | function |  | 7 |
| `updateScalpQuadWire` | 1768 | function |  | 4 |
| `updateScalpTopology` | 1784 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1848 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2028 | function |  | 2 |
| `currentStrandSelectionState` | 2090 | function |  | 4 |
| `applyStrandSelectionState` | 2094 | function |  | 5 |
| `clearStrandSelectionState` | 2099 | function |  | 7 |
| `guideHeadBounds` | 3079 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3089 | function |  | 5 |
| `disposeGuideModel` | 3103 | function |  | 3 |
| `syncHeadTransformInputs` | 3114 | function |  | 4 |
| `applyHeadTransform` | 3121 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3139 | function |  | 4 |
| `applyScalpRoughScale` | 3148 | function |  | 5 |
| `resetHeadTransform` | 3162 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3176 | function |  | 2 |
| `installGuideModel` | 3192 | function |  | 5 |
| `loadDefaultGuideModel` | 3268 | function |  | 3 |
| `braidTemplateFromEntries` | 3291 | function |  | 4 |
| `braidMeshEntries` | 3323 | function |  | 2 |
| `prepareBraidBodyCache` | 3335 | function |  | 2 |
| `quantize` | 3344 | arrow |  | 21 |
| `sourceNormalAt` | 3356 | arrow |  | 1 |
| `clusterBoundary` | 3359 | arrow |  | 2 |
| `normalBuckets` | 3376 | arrow |  | 2 |
| `applyBucketPair` | 3408 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3439 | function |  | 2 |
| `annotateBraidObjTopology` | 3460 | function |  | 2 |
| `loadBraidMeshPreset` | 3480 | function |  | 3 |
| `createSplitControlHandle` | 3497 | function |  | 4 |
| `frameGuideModel` | 3512 | function |  | 2 |
| `syncScalpInputs` | 3537 | function |  | 2 |
| `syncScalpArtistInputs` | 3543 | function |  | 2 |
| `rootScalpOffsetDistance` | 3551 | function |  | 15 |
| `applyLockRootScalpOffset` | 3556 | function |  | 5 |
| `normalizeHairLayer` | 3572 | function |  | 27 |
| `layerOffsetForLock` | 3576 | function |  | 9 |
| `layerRootOffsetFactor` | 3581 | function |  | 13 |
| `layerOffsetWeight` | 3585 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3591 | function |  | 5 |
| `pointsWithLayerOffset` | 3600 | function |  | 3 |
| `layerDirectionForLock` | 3608 | function |  | 2 |
| `applyLayerOffset` | 3619 | function |  | 5 |
| `setLockHairLayer` | 3643 | function |  | 2 |
| `setGroupLayerOffset` | 3658 | function |  | 2 |
| `scalpArtistWeight` | 3670 | function |  | 3 |
| `scalpArtistScalesAt` | 3674 | function |  | 3 |
| `applyScalpArtistShape` | 3684 | function |  | 5 |
| `inverseScalpArtistShape` | 3702 | function |  | 2 |
| `updateScalpSurface` | 3729 | function |  | 3 |
| `setActiveScalpRegion` | 3739 | function |  | 2 |
| `clearScalpRegions` | 3751 | function |  | 2 |
| `scalpHitFromEvent` | 3768 | function |  | 3 |
| `updateScalpBrushCursor` | 3776 | function |  | 4 |
| `paintScalpAt` | 3791 | function |  | 3 |
| `beginScalpPaint` | 3858 | function |  | 2 |
| `updateScalpPaint` | 3867 | function |  | 1 |
| `endScalpPaint` | 3876 | function |  | 2 |
| `createScalpLattice` | 3883 | function |  | 2 |
| `resetScalpLattice` | 3908 | function |  | 1 |
| `updateScalpLatticeObjects` | 3920 | function |  | 7 |
| `quadraticWeights` | 3934 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3939 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3966 | function |  | 3 |
| `selectScalpLatticePoint` | 3981 | function |  | 2 |
| `beginScalpLatticeDrag` | 3996 | function |  | 2 |
| `updateScalpLatticeDrag` | 4014 | function |  | 1 |
| `endScalpLatticeDrag` | 4032 | function |  | 2 |
| `setHeadReferenceTransparency` | 4038 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4048 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4066 | function |  | 3 |
| `trianglePlaneIntersections` | 4074 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4095 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4121 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4131 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4143 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4167 | function |  | 3 |
| `createScalpBuilderPlanes` | 4182 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4214 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4252 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4275 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4287 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4299 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4304 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4316 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4426 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4451 | function |  | 5 |
| `syncEditedScalpSurface` | 4466 | function |  | 4 |
| `ensureEditedScalpSurface` | 4537 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4567 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4652 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4665 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4681 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4691 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4709 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4722 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4729 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4748 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4762 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4803 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4812 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4825 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4846 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4983 | function |  | 2 |
| `scalpTemplateNeighbors` | 4991 | function |  | 2 |
| `smoothScalpVectorField` | 5003 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5017 | function |  | 2 |
| `upperContourCurve` | 5034 | function |  | 4 |
| `hermitePoint` | 5069 | function |  | 2 |
| `curveNetworkSection` | 5080 | function |  | 3 |
| `pointAlongSection` | 5109 | function |  | 3 |
| `longestStitchedContour` | 5115 | function |  | 2 |
| `nodeForPoint` | 5123 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5180 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5190 | function |  | 1 |
| `orderedRange` | 5202 | arrow |  | 3 |
| `clipSegment` | 5225 | arrow |  | 1 |
| `liftedPoint` | 5248 | arrow |  | 5 |
| `boundaryCorner` | 5253 | arrow |  | 4 |
| `surfaceCurveBetween` | 5262 | arrow |  | 1 |
| `addSurfaceConnector` | 5285 | arrow |  | 2 |
| `sideContourAtDepth` | 5353 | arrow |  | 3 |
| `addSurfacePatch` | 5387 | arrow |  | 1 |
| `addCenterBridgePatch` | 5467 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5575 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5610 | function |  | 1 |
| `generatedScalpObjContent` | 5700 | function |  | 2 |
| `generateScalpFromBuilder` | 5714 | function |  | 1 |
| `orderedDepthRange` | 5750 | arrow |  | 7 |
| `resetScalpBuilder` | 5879 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5894 | function |  | 1 |
| `beginScalpBuilderInput` | 5908 | function |  | 2 |
| `updateScalpBuilderStroke` | 5909 | function |  | 1 |
| `finishScalpBuilderStroke` | 5910 | function |  | 2 |
| `setScalpBuilderEditing` | 5912 | function |  | 10 |
| `updateScalpEditingVisibility` | 5946 | function |  | 12 |
| `exitSetupEditors` | 6040 | function |  | 7 |
| `setCapsuleGuideEditing` | 6049 | function |  | 5 |
| `syncAppMenuVisibility` | 6077 | function |  | 3 |
| `closeAppMenus` | 6082 | function |  | 6 |
| `setAppMenuOpen` | 6093 | function |  | 3 |
| `setTurntableActive` | 6100 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6109 | function |  | 9 |
| `selectedReferenceImage` | 6113 | function |  | 20 |
| `normalizeReferenceCrop` | 6119 | function |  | 8 |
| `referenceCropIsFull` | 6127 | function |  | 3 |
| `referencePlaneFrontAxis` | 6132 | function |  | 4 |
| `referencePlanePlacement` | 6141 | function |  | 4 |
| `migratedReferencePlanePosition` | 6156 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6176 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6193 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6209 | function |  | 2 |
| `snappedReferenceImageView` | 6232 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6238 | function |  | 5 |
| `applyReferenceImageRuntime` | 6254 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6297 | function |  | 6 |
| `createReferenceImageRuntime` | 6305 | function |  | 3 |
| `addReferenceImage` | 6374 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6426 | function |  | 3 |
| `disposeReferenceImage` | 6445 | function |  | 2 |
| `clearReferenceImages` | 6449 | function |  | 2 |
| `serializeReferenceImage` | 6456 | function |  | 1 |
| `setReferenceImageType` | 6484 | function |  | 2 |
| `attachReferenceImageTransform` | 6528 | function |  | 6 |
| `selectReferenceImage` | 6542 | function |  | 12 |
| `placeReferencePlane` | 6565 | function |  | 2 |
| `setReferencePlaneInFront` | 6576 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6586 | function |  | 4 |
| `renderReferenceImagePanel` | 6605 | function |  | 20 |
| `setOutlinerTab` | 6652 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6670 | function |  | 4 |
| `componentEditModeActive` | 6674 | function |  | 37 |
| `selectionToolSupportsPicking` | 6678 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6683 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6699 | function |  | 2 |
| `setViewportSelectionMode` | 6729 | function |  | 4 |
| `setViewportEditMode` | 6741 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6783 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6797 | function |  | 8 |
| `outlinerGuides` | 6809 | function |  | 3 |
| `guideOutlinerLabel` | 6816 | function |  | 2 |
| `normalizeOutlinerName` | 6826 | function |  | 4 |
| `beginOutlinerRename` | 6831 | function |  | 2 |
| `finish` | 6842 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6872 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6882 | function |  | 2 |
| `renderGuideOutliner` | 6917 | function |  | 10 |
| `referenceOutlinerGroup` | 6975 | function |  | 2 |
| `renderReferenceOutliner` | 6979 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7096 | function |  | 5 |
| `readReferenceImageFile` | 7101 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7125 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7132 | function |  | 3 |
| `dragContainsReferenceImage` | 7177 | function |  | 3 |
| `setReferenceImageDragActive` | 7188 | function |  | 9 |
| `referenceDropDestination` | 7196 | function |  | 2 |
| `viewportOverlayDropPosition` | 7202 | function |  | 2 |
| `setReferenceDropHover` | 7211 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7229 | function |  | 2 |
| `referenceOverlayAtPointer` | 7249 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7267 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7280 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7326 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7376 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7398 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7409 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7435 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7444 | function |  | 2 |
| `referenceCropCursor` | 7459 | function |  | 3 |
| `updateReferenceCropHandles` | 7465 | function |  | 5 |
| `referenceCropSourcePoint` | 7486 | function |  | 2 |
| `beginReferenceCrop` | 7493 | function |  | 1 |
| `updateReferenceCrop` | 7531 | function |  | 1 |
| `finishReferenceCrop` | 7563 | function |  | 4 |
| `setHeadSetupEditing` | 7581 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7597 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7606 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7616 | function |  | 4 |
| `setScalpGuideVisibility` | 7622 | function |  | 12 |
| `currentGuideViewMode` | 7630 | function |  | 3 |
| `updateGuideViewToggle` | 7638 | function |  | 5 |
| `setGuideViewMode` | 7654 | function |  | 3 |
| `cycleGuideViewMode` | 7665 | function |  | 1 |
| `hideGuideViewContextMenu` | 7670 | function |  | 6 |
| `showGuideViewContextMenu` | 7674 | function |  | 1 |
| `strandPassesDisplayFilters` | 7687 | function |  | 4 |
| `strandVisibleForDisplay` | 7696 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7701 | function |  | 2 |
| `lockedStrandsExist` | 7705 | function |  | 3 |
| `hiddenStrandsExist` | 7709 | function |  | 2 |
| `hideSelectedStrands` | 7713 | function |  | 2 |
| `unhideHiddenStrands` | 7723 | function |  | 2 |
| `strandIsolationActive` | 7732 | function |  | 7 |
| `setStrandIsolation` | 7736 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7748 | function |  | 3 |
| `syncVisibilityParent` | 7759 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7766 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7795 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7802 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7822 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7845 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7853 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7860 | function |  | 9 |
| `setScalpLatticeEditing` | 7871 | function |  | 4 |
| `setScalpShapeEditing` | 7886 | function |  | 9 |
| `setScalpPaintEditing` | 7904 | function |  | 7 |
| `defaultCurveLatticePoints` | 7928 | function |  | 3 |
| `flatCurveLatticePoints` | 7954 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7963 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7987 | function |  | 4 |
| `horizontalValue` | 7992 | arrow |  | 1 |
| `blendedSample` | 8003 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8036 | function |  | 2 |
| `curveLatticeControlPoint` | 8051 | function |  | 9 |
| `circularArcTangent` | 8055 | function |  | 4 |
| `arcLengthTo` | 8086 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8098 | function |  | 3 |
| `sampleHermiteCurve` | 8137 | function |  | 10 |
| `sampleCurveLattice` | 8154 | function |  | 6 |
| `curveLatticeNormal` | 8173 | function |  | 1 |
| `createCurveLatticeGeometry` | 8184 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8213 | function |  | 3 |
| `appendCurve` | 8215 | arrow |  | 4 |
| `sample` | 8217 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8244 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8260 | function |  | 3 |
| `addPicker` | 8262 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8301 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8314 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8318 | function |  | 3 |
| `curveLatticeEditablePoint` | 8336 | function |  | 13 |
| `curveLatticePointSection` | 8343 | function |  | 3 |
| `curveLatticeRestPoint` | 8354 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8360 | function |  | 7 |
| `curveLatticeRootColumns` | 8366 | function |  | 3 |
| `curveTangentsForPoints` | 8373 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8385 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8422 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8448 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8465 | function |  | 3 |
| `resampleGrid` | 8475 | arrow |  | 2 |
| `controlPointIsSelected` | 8502 | function |  | 7 |
| `clearMultiPointSelection` | 8510 | function |  | 9 |
| `createCurveLatticeHandles` | 8514 | function |  | 4 |
| `addCurveLattice` | 8536 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8645 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8676 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8682 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8721 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8742 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8759 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8768 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8775 | function |  | 1 |
| `selectCurveLatticeLoop` | 8794 | function |  | 3 |
| `selectCurveLatticePoint` | 8823 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8838 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8880 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8901 | function |  | 3 |
| `curveLatticeColumnPoints` | 8944 | function |  | 3 |
| `groupCurveControlIndices` | 8953 | function |  | 4 |
| `groupCurveControlPoints` | 8959 | function |  | 2 |
| `updateGroupCurveDisplay` | 8965 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8975 | function |  | 2 |
| `groupCurveDeformationPairs` | 8997 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9004 | function |  | 2 |
| `appendPairs` | 9006 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9017 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9036 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9057 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9076 | function |  | 2 |
| `capsuleGuideCapHeight` | 9110 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9114 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9119 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9123 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9135 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9151 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9157 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9183 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9213 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9267 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9288 | function |  | 7 |
| `vertex` | 9302 | function |  | 3 |
| `addFace` | 9308 | function |  | 3 |
| `addRing` | 9326 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9381 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9391 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9456 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9502 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9515 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9536 | function |  | 3 |
| `capsuleGuidePointDistances` | 9541 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9562 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9582 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9587 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9593 | function |  | 3 |
| `capsuleGuideAccentColor` | 9598 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9603 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9614 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9626 | function |  | 2 |
| `createCapsuleGuideHandles` | 9658 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9681 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9700 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9707 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9723 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9740 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9755 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9792 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9808 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9825 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9831 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9858 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9870 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9889 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9934 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9969 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9983 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9989 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10006 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10017 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10028 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10058 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10068 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10109 | function |  | 3 |
| `createQuadCageGeometry` | 10125 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10149 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10169 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10180 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10233 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10271 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10281 | function |  | 4 |
| `addCapsuleGuide` | 10289 | function |  | 4 |
| `addGuide` | 10358 | function |  | 1 |
| `createGuideGeometry` | 10419 | function |  | 4 |
| `selectGuide` | 10474 | function |  | 17 |
| `updateGuideControlsVisibility` | 10542 | function |  | 10 |
| `updateViewportToolVisibility` | 10559 | function |  | 7 |
| `getSelectedGuide` | 10598 | function |  | 34 |
| `selectedViewportFocusBounds` | 10602 | function |  | 2 |
| `frameViewportBounds` | 10616 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10646 | function |  | 2 |
| `fullSceneFocusBounds` | 10650 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10665 | function |  | 3 |
| `cycleViewportFraming` | 10674 | function |  | 2 |
| `syncGuideInputs` | 10692 | function |  | 5 |
| `updateGuideGeometry` | 10735 | function |  | 3 |
| `sculptBrushToolActive` | 10756 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10760 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10764 | function |  | 3 |
| `effectiveSculptBrushTool` | 10768 | function |  | 13 |
| `updateSculptScaleModeRow` | 10774 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10779 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10801 | function |  | 5 |
| `setActiveTool` | 10810 | function |  | 19 |
| `setDrawStrandMode` | 10948 | function |  | 2 |
| `setObjectSpaceEditing` | 10958 | function |  | 7 |
| `setHierarchyEditing` | 10974 | function |  | 4 |
| `setProportionalEditing` | 10986 | function |  | 5 |
| `beginProportionalSizeEdit` | 11005 | function |  | 3 |
| `updateProportionalSizeEdit` | 11017 | function |  | 2 |
| `endProportionalSizeEdit` | 11028 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11035 | function |  | 2 |
| `refreshProportionalPreview` | 11043 | function |  | 4 |
| `activeBrushSizeInput` | 11053 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11062 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11074 | function |  | 2 |
| `beginBrushSizeDrag` | 11092 | function |  | 1 |
| `updateBrushSizeDrag` | 11119 | function |  | 1 |
| `finishBrushSizeDrag` | 11140 | function |  | 2 |
| `updateInteractionLocks` | 11157 | function |  | 87 |
| `configureTransformControls` | 11168 | function |  | 16 |
| `pullMoveActive` | 11176 | function |  | 9 |
| `updatePullGuideVisual` | 11180 | function |  | 4 |
| `attachTransformForCurvePoint` | 11196 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11220 | function |  | 7 |
| `strandObjectRootIndex` | 11236 | function |  | 3 |
| `strandObjectRoot` | 11245 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11249 | function |  | 2 |
| `attachStrandObjectTransform` | 11254 | function |  | 6 |
| `guideObjectPivot` | 11277 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11288 | function |  | 2 |
| `attachGuideObjectTransform` | 11293 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11312 | function |  | 2 |
| `beginGuideObjectTransform` | 11340 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11347 | function |  | 2 |
| `updateGuideObjectTransform` | 11369 | function |  | 2 |
| `finishGuideObjectTransform` | 11402 | function |  | 2 |
| `clonePlacementFrame` | 11411 | function |  | 2 |
| `cloneOptionalVectors` | 11423 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11427 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11444 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11459 | function |  | 2 |
| `strandObjectTransformOperators` | 11475 | function |  | 4 |
| `transformPoint` | 11483 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11490 | arrow |  | 0 |
| `transformNormal` | 11496 | arrow |  | 10 |
| `transformDirection` | 11506 | arrow |  | 7 |
| `worldMatrixForPivot` | 11518 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11524 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11540 | function |  | 6 |
| `beginStrandObjectTransform` | 11566 | function |  | 2 |
| `updateStrandObjectTransform` | 11604 | function |  | 2 |
| `commitStrandObjectTransform` | 11662 | function |  | 2 |
| `mapPoints` | 11675 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11709 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11723 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11746 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11759 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11774 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11800 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11849 | function |  | 2 |
| `beginHandleEdit` | 11858 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 11911 | function |  | 3 |
| `multiPointHandleEditActive` | 11922 | function |  | 7 |
| `applyMultiMove` | 11926 | function |  | 5 |
| `applyMultiRotate` | 11932 | function |  | 2 |
| `applyMultiScale` | 11941 | function |  | 2 |
| `applyHierarchicalMove` | 11950 | function |  | 3 |
| `applySingleMove` | 11962 | function |  | 5 |
| `applySurfaceLatticeMirror` | 11966 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 11983 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 11992 | function |  | 3 |
| `changed` | 12002 | arrow |  | 1 |
| `applyPullMove` | 12044 | function |  | 3 |
| `pullHeadCollisionContext` | 12052 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12071 | function |  | 2 |
| `applyProportionalMove` | 12094 | function |  | 3 |
| `viewPlaneNormal` | 12105 | function |  | 20 |
| `isCameraInSnappedView` | 12109 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12117 | function |  | 10 |
| `updateViewPlaneGrid` | 12121 | function |  | 14 |
| `setViewPlaneMove` | 12178 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12189 | function |  | 2 |
| `rayFromViewportEvent` | 12197 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12205 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12215 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12226 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12239 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12258 | function |  | 4 |
| `beginViewPlaneMove` | 12265 | function |  | 3 |
| `updateViewPlaneMove` | 12329 | function |  | 1 |
| `endViewPlaneMove` | 12394 | function |  | 7 |
| `applyHierarchicalRotate` | 12413 | function |  | 2 |
| `rotateGuideNormal` | 12420 | arrow |  | 4 |
| `applySingleRotate` | 12458 | function |  | 2 |
| `applyProportionalRotate` | 12462 | function |  | 2 |
| `applyHierarchicalScale` | 12482 | function |  | 2 |
| `applySingleScale` | 12492 | function |  | 2 |
| `applyProportionalScale` | 12496 | function |  | 2 |
| `setPointScale` | 12512 | function |  | 8 |
| `proportionalWeight` | 12521 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12533 | function |  | 5 |
| `strandInfluenceColor` | 12539 | function |  | 13 |
| `beginRelaxEdit` | 12564 | function |  | 3 |
| `updateRelaxEdit` | 12593 | function |  | 1 |
| `endRelaxEdit` | 12653 | function |  | 1 |
| `disposeGuide` | 12663 | function |  | 3 |
| `removeGuideObjects` | 12691 | function |  | 3 |
| `strandRadiusAt` | 12705 | function |  | 5 |
| `strandProfileTopologyAt` | 12722 | function |  | 6 |
| `strandCurveParameters` | 12764 | function |  | 4 |
| `widthProfileAt` | 12774 | arrow |  | 1 |
| `braidFrameAt` | 12812 | function |  | 5 |
| `braidFrameAtExtended` | 12822 | function |  | 2 |
| `createBraidProfileProjector` | 12831 | function |  | 2 |
| `project` | 12847 | arrow |  | 17 |
| `createBraidGeometry` | 12862 | function |  | 2 |
| `deformationAt` | 12897 | function |  | 3 |
| `widthFor` | 12906 | arrow |  | 3 |
| `depthFor` | 12910 | arrow |  | 3 |
| `outputVertex` | 12942 | function |  | 7 |
| `appendAuthoredCap` | 13050 | function |  | 3 |
| `outputCapVertex` | 13057 | arrow |  | 6 |
| `capBoundary` | 13148 | function |  | 3 |
| `strandGeometryCurve` | 13210 | function |  | 12 |
| `strandGeometryFrameAt` | 13236 | function |  | 15 |
| `transportedStrandFrameAt` | 13299 | function |  | 6 |
| `twistOverrideAt` | 13302 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13330 | function |  | 2 |
| `weldPanelGeometryData` | 13366 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13406 | function |  | 3 |
| `surfacePanelPoint` | 13421 | function |  | 3 |
| `createPanelStrandGeometry` | 13444 | function |  | 2 |
| `addQuad` | 13478 | arrow |  | 6 |
| `near` | 13482 | arrow |  | 6 |
| `panelWidthAt` | 13512 | arrow |  | 6 |
| `panelThicknessAt` | 13521 | arrow |  | 6 |
| `panelFrameAt` | 13530 | arrow |  | 1 |
| `rawPanelPoint` | 13548 | arrow |  | 1 |
| `panelPoint` | 13568 | arrow |  | 2 |
| `addPatch` | 13574 | arrow |  | 1 |
| `splitOpening` | 13625 | arrow |  | 2 |
| `uStart` | 13649 | arrow |  | 1 |
| `uEnd` | 13652 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13690 | function |  | 3 |
| `inside` | 13691 | arrow |  | 2 |
| `pushOrientedTriangle` | 13713 | function |  | 7 |
| `triangulatePolygon3D` | 13724 | function |  | 1 |
| `orientedQuadFace` | 13774 | function |  | 2 |
| `createSplitStrandGeometry` | 13782 | function |  | 2 |
| `fusedIndexAt` | 13939 | arrow |  | 0 |
| `createHairCardGeometry` | 13988 | function |  | 2 |
| `createPolyGeometry` | 14087 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14114 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14123 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14170 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14178 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14194 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14203 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14214 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14222 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14232 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14252 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14275 | function |  | 4 |
| `createCompoundStrandGeometry` | 14358 | function |  | 2 |
| `proceduralBranchGeometryLock` | 14609 | function |  | 2 |
| `createHairGeometry` | 14649 | function |  | 6 |
| `createBaseHairGeometry` | 14701 | function |  | 3 |
| `hairMaterialDefinition` | 14819 | function |  | 4 |
| `materialForLock` | 14823 | function |  | 8 |
| `activeHairMaterialDefinition` | 14827 | function |  | 11 |
| `strandDisplayColor` | 14833 | function |  | 14 |
| `setAnimeHairBaseColor` | 14851 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 14864 | function |  | 2 |
| `createHairMaterial` | 14904 | function |  | 5 |
| `createStrandSelectionOutline` | 14946 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 14980 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 14989 | function |  | 6 |
| `refreshMaterialUsers` | 15016 | function |  | 6 |
| `renderHairMaterialOutliner` | 15025 | function |  | 5 |
| `renderHairMaterialOptions` | 15055 | function |  | 3 |
| `syncHairMaterialEditor` | 15065 | function |  | 9 |
| `createProjectHairMaterial` | 15091 | function |  | 3 |
| `deleteActiveHairMaterial` | 15111 | function |  | 2 |
| `createHairTopologyGeometry` | 15129 | function |  | 4 |
| `createHairTopologyOverlay` | 15150 | function |  | 3 |
| `groupDefaultsFor` | 15197 | function |  | 9 |
| `creationToolActive` | 15204 | function |  | 7 |
| `activeCreationShapeDefaults` | 15208 | function |  | 9 |
| `activeStrandShapeTarget` | 15214 | function |  | 5 |
| `curvePolylineLength` | 15218 | function |  | 2 |
| `curvePolylineLengths` | 15226 | function |  | 3 |
| `samplePolylineDistance` | 15234 | function |  | 2 |
| `applyProjectedCurveLength` | 15244 | function |  | 4 |
| `clearRegionLengthBaseline` | 15275 | function |  | 2 |
| `ensureRegionLengthBaseline` | 15282 | function |  | 2 |
| `setGroupLengthScale` | 15290 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 15328 | function |  | 4 |
| `requestGroupDefaultsWarning` | 15360 | function |  | 1 |
| `activeProfileOffset` | 15372 | function |  | 3 |
| `profileToCanvas` | 15380 | function |  | 1 |
| `renderProfilePreview` | 15387 | function |  | 7 |
| `renderHairCardCoveragePath` | 15406 | function |  | 2 |
| `activeTaperTarget` | 15421 | function |  | 15 |
| `activeTaperCurve` | 15455 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 15466 | function |  | 6 |
| `taperSamples` | 15476 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 15483 | function |  | 2 |
| `renderTaperPreview` | 15505 | function |  | 13 |
| `shapeTargetForSelect` | 15544 | function |  | 3 |
| `setupShapePresetControls` | 15554 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 15579 | function |  | 3 |
| `syncShapePresetSelects` | 15585 | function |  | 6 |
| `populateShapePresetSelects` | 15606 | function |  | 5 |
| `openSaveShapePreset` | 15634 | function |  | 2 |
| `commitCustomShapePreset` | 15659 | function |  | 2 |
| `openRemoveShapePreset` | 15682 | function |  | 2 |
| `commitRemoveShapePreset` | 15695 | function |  | 2 |
| `taperPointToCanvas` | 15711 | function |  | 4 |
| `canvasToTaperPoint` | 15728 | function |  | 2 |
| `clearTaperMeshPoints` | 15764 | function |  | 2 |
| `taperMeshPointFrame` | 15774 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 15787 | function |  | 4 |
| `updateTaperMeshPoints` | 15824 | function |  | 5 |
| `setTaperMeshPointsVisible` | 15903 | function |  | 5 |
| `renderTaperCurveEditor` | 15921 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 15993 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 16007 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 16023 | function |  | 2 |
| `scheduleTaperCurveEdit` | 16055 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 16064 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 16075 | function |  | 2 |
| `applyTaperCurveEdit` | 16083 | function |  | 10 |
| `openTaperCurveEditor` | 16191 | function |  | 3 |
| `closeTaperCurveEditor` | 16236 | function |  | 4 |
| `updateViewportStatsVisibility` | 16249 | function |  | 4 |
| `canvasToProfile` | 16268 | function |  | 2 |
| `retargetFloatingStrandEditors` | 16282 | function |  | 2 |
| `addLock` | 16297 | function |  | 19 |
| `mirroredScalpRegion` | 16500 | function |  | 5 |
| `mirroredVector` | 16509 | function |  | 12 |
| `mirroredPlacementFrame` | 16513 | function |  | 2 |
| `mirrorPartnerFor` | 16526 | function |  | 40 |
| `decoupleMirrorPartner` | 16530 | function |  | 2 |
| `createMirrorPartner` | 16538 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 16634 | function |  | 6 |
| `mirroredClumpPartners` | 16639 | function |  | 6 |
| `createMirroredClump` | 16645 | function |  | 3 |
| `decoupleMirroredClump` | 16667 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 16686 | function |  | 6 |
| `syncActiveMirror` | 16851 | function |  | 25 |
| `setMirrorXEditing` | 16863 | function |  | 6 |
| `snapshotState` | 16887 | function |  | 7 |
| `scalpTriangleRegion` | 17144 | function |  | 4 |
| `closestPointOnActiveScalp` | 17157 | function |  | 12 |
| `rootAttachmentFrame` | 17229 | function |  | 3 |
| `rootAttachmentLocalFrame` | 17241 | function |  | 4 |
| `resolveRootAttachment` | 17259 | function |  | 4 |
| `curvePointsToRootLocal` | 17299 | function |  | 2 |
| `curvePointsFromRootLocal` | 17311 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 17319 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 17335 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 17365 | function |  | 2 |
| `createRootAttachment` | 17377 | function |  | 9 |
| `syncRootAttachmentMetadata` | 17407 | function |  | 4 |
| `rootAttachmentToData` | 17434 | function |  | 2 |
| `rootAttachmentFromData` | 17462 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 17501 | function |  | 2 |
| `remapPoint` | 17516 | arrow |  | 1 |
| `remapVector` | 17517 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 17546 | function |  | 2 |
| `importHeadMeshFile` | 17563 | function |  | 3 |
| `importFullBodyMeshFile` | 17586 | function |  | 3 |
| `downloadPreferencesAndPresets` | 17611 | function |  | 1 |
| `importedBooleanPreference` | 17644 | function |  | 11 |
| `loadPreferencesAndPresets` | 17658 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 17728 | function |  | 1 |
| `openHairProjectFile` | 17771 | function |  | 4 |
| `dragContainsApplicationFile` | 17829 | function |  | 3 |
| `safelyRememberRecentProject` | 17838 | function |  | 2 |
| `renderRecentProjectsMenu` | 17847 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 17879 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 17904 | function |  | 2 |
| `confirmDroppedApplicationFile` | 17908 | function |  | 2 |
| `pushUndoState` | 17924 | function |  | 116 |
| `undoLastAction` | 17931 | function |  | 2 |
| `redoLastAction` | 17945 | function |  | 2 |
| `updateHistoryButtons` | 17959 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 17964 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 17981 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 17988 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 18026 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 18103 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 18129 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 18161 | function |  | 2 |
| `finalizeStateRestore` | 18202 | function |  | 2 |
| `restoreState` | 18209 | function |  | 5 |
| `disposeAllEditableObjects` | 18233 | function |  | 2 |
| `restoreLock` | 18254 | function |  | 4 |
| `restoreGuide` | 18471 | function |  | 2 |
| `vectorToData` | 18532 | function |  | 29 |
| `dataToVector` | 18536 | function |  | 31 |
| `frameToData` | 18540 | function |  | 2 |
| `frameFromData` | 18552 | function |  | 2 |
| `applyPresetSelection` | 18564 | function |  | 2 |
| `drawPresetThumbnail` | 18595 | function |  | 1 |
| `fillHair` | 18610 | arrow |  | 9 |
| `strand` | 18622 | arrow |  | 31 |
| `bun` | 18640 | arrow |  | 2 |
| `braid` | 18675 | arrow |  | 2 |
| `renderPresetLibrary` | 18764 | function |  | 3 |
| `setPresetLibraryOpen` | 18823 | function |  | 6 |
| `average` | 18836 | function |  | 4 |
| `fitPointAttributes` | 18840 | function |  | 9 |
| `rebuildCurveObjects` | 18869 | function |  | 10 |
| `createCurvePoints` | 18881 | function |  | 2 |
| `addGeneratedBangPreset` | 18890 | function |  | 1 |
| `sampleScalpQuad` | 18983 | function |  | 4 |
| `createLongLayeredCurlPoints` | 19007 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 19056 | function |  | 1 |
| `columns` | 19057 | arrow |  | 1 |
| `layer` | 19061 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 19275 | function |  | 2 |
| `addBraidedBobPreset` | 19311 | function |  | 1 |
| `evenColumns` | 19312 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 19528 | function |  | 1 |
| `scalpSeed` | 19551 | arrow |  | 1 |
| `createBowlCutPoints` | 19838 | function |  | 2 |
| `addBowlCutPreset` | 19876 | function |  | 1 |
| `scalpRegionAtHit` | 19942 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 19954 | function |  | 6 |
| `selectedCurveLatticeGuide` | 19961 | function |  | 12 |
| `braidStrokeActive` | 19968 | function |  | 9 |
| `proceduralDrawActive` | 19972 | function |  | 3 |
| `panelStrokeActive` | 19976 | function |  | 6 |
| `activeStrokeSurfaceInput` | 19980 | function |  | 4 |
| `activeStrokeSurfaceValue` | 19984 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 19988 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 19994 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 19998 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 20002 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 20006 | function |  | 3 |
| `liveSurfaceStrandId` | 20016 | function |  | 4 |
| `liveSurfaceStrand` | 20020 | function |  | 4 |
| `liveSurfaceGuideId` | 20025 | function |  | 3 |
| `guideSupportsLiveSurface` | 20029 | function |  | 2 |
| `liveSurfaceGuide` | 20036 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 20043 | function |  | 12 |
| `activeStrokeScalpOffset` | 20083 | function |  | 4 |
| `activeStrokeBrushSize` | 20089 | function |  | 10 |
| `activeStrokeBrushDepth` | 20095 | function |  | 5 |
| `strokeSurfaceIsContextual` | 20101 | function |  | 7 |
| `contextualPlaneAtOrigin` | 20109 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 20119 | function |  | 13 |
| `worldNormalAtHit` | 20158 | function |  | 6 |
| `selectedPolyMesh` | 20166 | function |  | 10 |
| `addPolyLock` | 20171 | function |  | 2 |
| `ensurePolyMesh` | 20190 | function |  | 3 |
| `polySurfaceSample` | 20194 | function |  | 4 |
| `polyTargetAtEvent` | 20205 | function |  | 6 |
| `refreshPolyMesh` | 20231 | function |  | 10 |
| `ensurePolyFillPreview` | 20240 | function |  | 2 |
| `clearPolyFillPreview` | 20277 | function |  | 17 |
| `polyFillCandidateForEvent` | 20282 | function |  | 3 |
| `showPolyFillPreview` | 20302 | function |  | 2 |
| `updatePolyFillPreview` | 20328 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 20353 | function |  | 5 |
| `fillPolyGap` | 20363 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 20374 | function |  | 2 |
| `projectPolyRelaxPoint` | 20394 | function |  | 2 |
| `removePolyPointAttributes` | 20438 | function |  | 3 |
| `deletePolyComponent` | 20447 | function |  | 2 |
| `addPolyPoint` | 20470 | function |  | 4 |
| `appendPolyStrokeRow` | 20479 | function |  | 4 |
| `beginPolyBrushPointer` | 20499 | function |  | 1 |
| `finishPolyAltDelete` | 20585 | function |  | 1 |
| `updatePolyBrushStroke` | 20599 | function |  | 1 |
| `finishPolyBrushStroke` | 20689 | function |  | 4 |
| `drawScalpRegionAtEvent` | 20726 | function |  | 2 |
| `drawSampleFromHit` | 20749 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 20763 | function |  | 3 |
| `strokeLength` | 20800 | function |  | 9 |
| `resampleDrawStroke` | 20806 | function |  | 2 |
| `processedDrawStroke` | 20838 | function |  | 8 |
| `strokeSurfaceNormals` | 20867 | function |  | 7 |
| `drawClumpFrame` | 20878 | function |  | 4 |
| `nearestCurveParameter` | 20887 | function |  | 2 |
| `drawClumpSampleNormal` | 20901 | function |  | 6 |
| `drawClumpTemplateVector` | 20910 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 20916 | function |  | 3 |
| `drawClumpStrandMaps` | 20932 | function |  | 4 |
| `nextClumpName` | 20987 | function |  | 6 |
| `initializeClumpShape` | 20994 | function |  | 5 |
| `stableClumpVariation` | 21005 | function |  | 3 |
| `createClumpFromLocks` | 21017 | function |  | 7 |
| `addLockToClump` | 21042 | function |  | 4 |
| `pointerToNdc` | 21105 | function |  | 1 |
| `gridProfileSkipCol` | 21121 | function |  | 3 |
| `clumpDirectMembers` | 21145 | function |  | 3 |
| `clumpMembersForGuide` | 21150 | function |  | 6 |
| `clumpGuideForLock` | 21154 | function |  | 13 |
| `proceduralGuideForLock` | 21159 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 21166 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 21173 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 21180 | function |  | 3 |
| `proceduralBranchWorldPoints` | 21192 | function |  | 2 |
| `applyProceduralBranchSettings` | 21205 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 21244 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 21260 | function |  | 3 |
| `createProceduralAccessoryLock` | 21274 | function |  | 2 |
| `applyProceduralAccessorySettings` | 21326 | function |  | 2 |
| `clumpFrameAt` | 21377 | function |  | 5 |
| `commitClumpMemberRestState` | 21385 | function |  | 10 |
| `updateClumpMembers` | 21468 | function |  | 10 |
| `dissolveClump` | 21572 | function |  | 6 |
| `detachLockFromClump` | 21609 | function |  | 4 |
| `updateDrawVolumePreview` | 21635 | function |  | 5 |
| `hideDrawClumpPreviews` | 21659 | function |  | 5 |
| `resetDrawVolumePreview` | 21665 | function |  | 3 |
| `updateDrawStrandPreview` | 21671 | function |  | 22 |
| `continueFromTipEnabled` | 21890 | function |  | 2 |
| `selectedTipContinuationLock` | 21896 | function |  | 3 |
| `beginDrawStrandStroke` | 21911 | function |  | 2 |
| `beginDrawFreePlane` | 22036 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 22050 | function |  | 2 |
| `updateDrawStrandStroke` | 22075 | function |  | 1 |
| `createDrawnLock` | 22121 | function |  | 3 |
| `setting` | 22125 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 22193 | function |  | 4 |
| `createDrawnBraid` | 22201 | function |  | 2 |
| `createDrawnStrand` | 22258 | function |  | 2 |
| `createDrawnPanel` | 22385 | function |  | 2 |
| `surfaceLatticeNormal` | 22435 | function |  | 2 |
| `createSurfaceLockFromLattice` | 22450 | function |  | 3 |
| `createViewportSurface` | 22515 | function |  | 2 |
| `loftSurfaceProfilePoints` | 22544 | function |  | 6 |
| `hideLoftSurfacePreviews` | 22550 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 22557 | function |  | 4 |
| `updateLoftSurfacePreview` | 22566 | function |  | 5 |
| `resetLoftSurfaceDraft` | 22598 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 22614 | function |  | 3 |
| `cloneCurveSurfaceSource` | 22632 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 22654 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 22680 | function |  | 3 |
| `curveSurfaceProfilePoints` | 22690 | function |  | 3 |
| `curveSurfaceProfileNormals` | 22694 | function |  | 2 |
| `curveSurfacePreviewLock` | 22703 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 22726 | function |  | 2 |
| `hideCurveSurfacePreview` | 22742 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 22754 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 22759 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 22768 | function |  | 3 |
| `curveSurfaceSideVector` | 22806 | function |  | 4 |
| `curveSurfaceDraftCurves` | 22819 | function |  | 2 |
| `curveSurfaceFallbackHit` | 22827 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 22840 | function |  | 5 |
| `updateCurveSurfacePreview` | 22860 | function |  | 6 |
| `resetCurveSurfaceDraft` | 22922 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 22944 | function |  | 3 |
| `beginCurveSurfaceStroke` | 22959 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 23007 | function |  | 3 |
| `updateCurveSurfaceStroke` | 23042 | function |  | 1 |
| `finishCurveSurfaceStroke` | 23074 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 23132 | function |  | 2 |
| `commitCurveSurfaceDraft` | 23209 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 23214 | function |  | 8 |
| `beginLoftSurfaceStroke` | 23223 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 23257 | function |  | 2 |
| `updateLoftSurfaceStroke` | 23268 | function |  | 1 |
| `finishLoftSurfaceStroke` | 23298 | function |  | 2 |
| `extendDrawnStrand` | 23355 | function |  | 2 |
| `finishDrawStrandStroke` | 23388 | function |  | 7 |
| `createPlacedStrand` | 23415 | function |  | 2 |
| `placedPointCount` | 23479 | function |  | 3 |
| `createPlacedPoints` | 23483 | function |  | 3 |
| `pushPointOutsideHead` | 23502 | function |  | 8 |
| `resizePlacedStrand` | 23534 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 23551 | function |  | 5 |
| `beginPlaceEdit` | 23556 | function |  | 2 |
| `updatePlaceEdit` | 23574 | function |  | 1 |
| `updatePlacementLength` | 23588 | function |  | 3 |
| `updatePlacementOrientation` | 23598 | function |  | 3 |
| `endPlaceEdit` | 23616 | function |  | 1 |
| `confirmPendingPlacedStrand` | 23631 | function |  | 1 |
| `pendingPlacedLock` | 23641 | function |  | 2 |
| `beginPlacementPointer` | 23645 | function |  | 3 |
| `finishPlacementPointer` | 23655 | function |  | 2 |
| `confirmPlacementStep` | 23679 | function |  | 2 |
| `finishPlacementFlow` | 23702 | function |  | 7 |
| `updatePlacementStatus` | 23715 | function |  | 82 |
| `deselectStrands` | 23854 | function |  | 12 |
| `beginSelectionMarquee` | 23869 | function |  | 3 |
| `beginAltOrbit` | 23893 | function |  | 1 |
| `beginBlenderNavigation` | 23905 | function |  | 1 |
| `endBlenderNavigation` | 23950 | function |  | 1 |
| `prepareSelectPointerCapture` | 23958 | function |  | 1 |
| `endSelectPointerCapture` | 23964 | function |  | 1 |
| `endAltOrbit` | 23970 | function |  | 1 |
| `dollyCameraByDrag` | 23977 | function |  | 2 |
| `fastDragMagnitude` | 24000 | function |  | 2 |
| `beginHoudiniZoomDrag` | 24006 | function |  | 1 |
| `updateHoudiniZoomDrag` | 24014 | function |  | 1 |
| `endHoudiniZoomDrag` | 24031 | function |  | 1 |
| `updateSelectionMarquee` | 24039 | function |  | 1 |
| `pointInsideSelectionMarquee` | 24056 | function |  | 3 |
| `selectPointsInMarquee` | 24064 | function |  | 2 |
| `pointKey` | 24090 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 24121 | function |  | 2 |
| `objectInsideSelectionMarquee` | 24158 | function |  | 3 |
| `projectedPoint` | 24175 | arrow |  | 1 |
| `selectObjectsInMarquee` | 24204 | function |  | 2 |
| `finishSelectionMarquee` | 24249 | function |  | 2 |
| `headMeshes` | 24272 | function |  | 9 |
| `strandSplitProfileData` | 24280 | function |  | 4 |
| `strandSplitControlPoint` | 24293 | function |  | 4 |
| `panelSplitControlPoint` | 24329 | function |  | 6 |
| `strandControlPointRaycast` | 24385 | function |  | 1 |
| `strandControlPointFrame` | 24420 | function |  | 4 |
| `strandControlPointHitFromEvent` | 24452 | function |  | 4 |
| `createCurveObjects` | 24510 | function |  | 4 |
| `polyEdgeKey` | 24683 | function |  | 2 |
| `polyMeshEdges` | 24687 | function |  | 2 |
| `populatePolyEditObjects` | 24701 | function |  | 3 |
| `createPolyEditObjects` | 24762 | function |  | 2 |
| `rebuildPolyEditObjects` | 24770 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 24784 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 24791 | function |  | 2 |
| `strandWidthEdgeSample` | 24800 | function |  | 3 |
| `strandWidthEdgePoints` | 24823 | function |  | 2 |
| `sculptBrushDebugRaycast` | 24837 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 24841 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 24848 | function |  | 3 |
| `refreshSculptBrushDebugView` | 24860 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 24865 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 24871 | function |  | 3 |
| `updateCurveObjects` | 24885 | function |  | 35 |
| `createCurveNormalIndicator` | 25142 | function |  | 2 |
| `pointUpDirection` | 25168 | function |  | 2 |
| `curveFrameAtPoint` | 25172 | function |  | 4 |
| `curveFrameAt` | 25193 | function |  | 4 |
| `strandTwistAt` | 25213 | function |  | 6 |
| `controlPointRotationAt` | 25218 | function |  | 4 |
| `strandProfileTwistAt` | 25222 | function |  | 2 |
| `strandFrameAt` | 25228 | function |  | 1 |
| `curveFrameAtSnapshot` | 25234 | function |  | 3 |
| `outwardNormalAtPoint` | 25253 | function |  | 11 |
| `sampledSurfaceNormal` | 25265 | function |  | 2 |
| `guidedNormalAt` | 25281 | function |  | 5 |
| `twistFromHandle` | 25300 | function |  | 3 |
| `signedAngleAroundAxis` | 25321 | function |  | 5 |
| `handleColor` | 25328 | function |  | 2 |
| `isAffectedCurvePoint` | 25351 | function |  | 2 |
| `syncLockFromCurve` | 25357 | function |  | 25 |
| `labelForPreset` | 25387 | function |  | 1 |
| `rebuildLockGeometry` | 25391 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 25418 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 25426 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 25432 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 25454 | function |  | 8 |
| `updateLockGeometry` | 25467 | function |  | 56 |
| `setGroupColorView` | 25488 | function |  | 2 |
| `createUvCheckerTexture` | 25498 | function |  | 3 |
| `ensureUvCheckerForLock` | 25534 | function |  | 4 |
| `removeUvCheckerFromLock` | 25567 | function |  | 3 |
| `invalidateUvInspector` | 25582 | function |  | 7 |
| `uvInspectorRecord` | 25586 | function |  | 1 |
| `uvInspectorRecords` | 25625 | function |  | 2 |
| `drawUvInspectorGrid` | 25629 | function |  | 2 |
| `renderUvInspector` | 25663 | function |  | 3 |
| `setUvCheckerEnabled` | 25722 | function |  | 3 |
| `strandViewportBaseColor` | 25739 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 25774 | function |  | 3 |
| `syncStrandSelectionOutline` | 25780 | function |  | 2 |
| `applyLockedStrandPalette` | 25791 | function |  | 2 |
| `syncLockedStrandWireVisual` | 25800 | function |  | 6 |
| `setStrandSelectionVisual` | 25809 | function |  | 6 |
| `proceduralParentOutlineVisible` | 25825 | function |  | 2 |
| `syncProceduralParentVisibility` | 25832 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 25841 | function |  | 2 |
| `updateStrandSelectionHighlight` | 25845 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 25849 | function |  | 2 |
| `resetGuideSelectionVisuals` | 25862 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 25882 | function |  | 3 |
| `selectLock` | 25915 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 25968 | function |  | 6 |
| `syncGroupInputs` | 25979 | function |  | 2 |
| `topologyStatsForLock` | 26012 | function |  | 4 |
| `formatTopologyStats` | 26020 | function |  | 5 |
| `updateTopologyStats` | 26024 | function |  | 20 |
| `normalizeBraidDimensions` | 26058 | function |  | 3 |
| `normalizeStrandDimensions` | 26071 | function |  | 3 |
| `strandBaseWidth` | 26085 | function |  | 5 |
| `strandWidthDimension` | 26089 | function |  | 5 |
| `strandDepthDimension` | 26097 | function |  | 8 |
| `setStrandWidthDimension` | 26105 | function |  | 2 |
| `setStrandDepthDimension` | 26127 | function |  | 4 |
| `syncShapeDimensionInputs` | 26143 | function |  | 4 |
| `syncCreationShapeInputs` | 26179 | function |  | 3 |
| `syncViewportDrawSettings` | 26217 | function |  | 5 |
| `syncPanelShapeInputs` | 26231 | function |  | 6 |
| `syncStrandSplitInputs` | 26257 | function |  | 4 |
| `syncHairCardControls` | 26266 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 26274 | function |  | 3 |
| `updateAttributeEditorMode` | 26313 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 26463 | function |  | 3 |
| `curveLatticeForGroup` | 26486 | function |  | 2 |
| `filterCurveLatticesToGroup` | 26504 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 26549 | function |  | 2 |
| `showCurveLatticeForGroup` | 26566 | function |  | 2 |
| `selectStrandGroup` | 26603 | function |  | 3 |
| `selectCurvePoint` | 26645 | function |  | 10 |
| `updateSelectedPointLabel` | 26659 | function |  | 14 |
| `syncInputs` | 26672 | function |  | 15 |
| `syncClumpGuidePanel` | 26718 | function |  | 3 |
| `getSelectedLock` | 26745 | function |  | 100 |
| `selectedLocksInOrder` | 26749 | function |  | 37 |
| `lockStrands` | 26755 | function |  | 3 |
| `lockSelectedStrands` | 26788 | function |  | 3 |
| `unlockStrands` | 26794 | function |  | 3 |
| `unlockAllStrands` | 26809 | function |  | 3 |
| `strandEditFamily` | 26813 | function |  | 7 |
| `compatibleSelectedLocks` | 26818 | function |  | 5 |
| `selectedEditRoots` | 26825 | function |  | 2 |
| `editSelectedLocks` | 26838 | function |  | 19 |
| `multiEditValuesEqual` | 26871 | function |  | 2 |
| `setMixedControl` | 26880 | function |  | 28 |
| `syncMultiStrandInputs` | 26897 | function |  | 16 |
| `values` | 26913 | arrow |  | 42 |
| `selectedRebuildableCurves` | 26993 | function |  | 5 |
| `createCompoundStrand` | 27000 | function |  | 1 |
| `refreshRebuildCurveDialog` | 27061 | function |  | 9 |
| `openRebuildCurveDialog` | 27074 | function |  | 1 |
| `rebuildSelectedCurves` | 27088 | function |  | 2 |
| `selectionCanBecomeClump` | 27127 | function |  | 4 |
| `createClumpFromSelection` | 27132 | function |  | 3 |
| `cleanSelectionSets` | 27144 | function |  | 2 |
| `createSelectionSetFromSelection` | 27149 | function |  | 3 |
| `selectionSetById` | 27160 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 27164 | function |  | 7 |
| `editSelectionSetFromSelection` | 27173 | function |  | 5 |
| `deleteSelectionSet` | 27193 | function |  | 2 |
| `selectSelectionSet` | 27202 | function |  | 2 |
| `deleteSelectedStrands` | 27212 | function |  | 4 |
| `deleteGuide` | 27220 | function |  | 3 |
| `deleteSelectedGuide` | 27243 | function |  | 3 |
| `deleteSelectedReferenceImage` | 27247 | function |  | 4 |
| `hasDeletableSelection` | 27260 | function |  | 2 |
| `deleteCurrentSelection` | 27268 | function |  | 3 |
| `hideOutlinerContextMenu` | 27276 | function |  | 17 |
| `outlinerLockTargets` | 27281 | function |  | 3 |
| `showOutlinerContextMenu` | 27308 | function |  | 10 |
| `hideStrandRadialMenu` | 27388 | function |  | 4 |
| `ensureRadialButtonCapacity` | 27399 | function |  | 3 |
| `radialButtonDimensions` | 27412 | function |  | 4 |
| `radialMenuDimensionsForKind` | 27421 | function |  | 3 |
| `applyRadialMenuDimensions` | 27438 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 27444 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 27457 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 27478 | function |  | 2 |
| `selectionSetRadialMenuOption` | 27495 | function |  | 4 |
| `selectedMirrorRadialOptions` | 27504 | function |  | 3 |
| `strandVisibilityRadialOptions` | 27526 | function |  | 5 |
| `clumpMirrorRadialOptions` | 27544 | function |  | 2 |
| `contextualRadialOptions` | 27551 | function |  | 3 |
| `sharedRadialFrameDimensions` | 27680 | function |  | 3 |
| `layoutContextualRadialOptions` | 27684 | function |  | 4 |
| `renderRadialActionList` | 27708 | function |  | 3 |
| `radialListOptionAtPointer` | 27726 | function |  | 3 |
| `syncRadialListHighlight` | 27748 | function |  | 3 |
| `configureContextualRadialMenu` | 27754 | function |  | 3 |
| `beginStrandRadialGesture` | 27814 | function |  | 2 |
| `enterStrandRadialSubmenu` | 27848 | function |  | 2 |
| `updateStrandRadialGesture` | 27894 | function |  | 1 |
| `performStrandRadialAction` | 27933 | function |  | 2 |
| `finishStrandRadialGesture` | 28036 | function |  | 2 |
| `cancelStrandRadialGesture` | 28046 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 28053 | function |  | 1 |
| `setPullMoveEnabled` | 28059 | function |  | 3 |
| `toolRadialOptions` | 28067 | function |  | 2 |
| `hideToolRadialMenu` | 28092 | function |  | 4 |
| `beginToolRadialGesture` | 28105 | function |  | 2 |
| `beginToolShortcutPress` | 28145 | function |  | 2 |
| `finishToolShortcutPress` | 28160 | function |  | 2 |
| `cancelToolShortcutPress` | 28169 | function |  | 5 |
| `setRadialMenusEnabled` | 28177 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 28190 | function |  | 5 |
| `setNavigationTipsEnabled` | 28205 | function |  | 5 |
| `configureNavigationMouseButtons` | 28212 | function |  | 3 |
| `syncNavigationModifierLocks` | 28225 | function |  | 7 |
| `setNavigationStyle` | 28230 | function |  | 5 |
| `applyCameraSmoothingPreference` | 28246 | function |  | 4 |
| `setCameraSmoothingEnabled` | 28261 | function |  | 5 |
| `setCameraSmoothingStrength` | 28267 | function |  | 5 |
| `setScaleSensitivity` | 28275 | function |  | 3 |
| `setToolTipsEnabled` | 28283 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 28290 | function |  | 5 |
| `setViewportStatisticsEnabled` | 28299 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 28307 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 28322 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 28331 | function |  | 5 |
| `sideNamingDisplayId` | 28340 | function |  | 3 |
| `referenceViewDisplayLabel` | 28352 | function |  | 6 |
| `strandRegionDisplayLabel` | 28362 | function |  | 9 |
| `updateSideNamingLabels` | 28380 | function |  | 2 |
| `setSideNamingPerspective` | 28407 | function |  | 5 |
| `setControlPointDisplaySize` | 28416 | function |  | 6 |
| `scaleHexColor` | 28428 | function |  | 3 |
| `setViewportBackgroundColor` | 28433 | function |  | 7 |
| `setDefaultHairShader` | 28455 | function |  | 5 |
| `setPreferenceCategory` | 28461 | function |  | 4 |
| `openPreferencesDialog` | 28488 | function |  | 1 |
| `savePreferencesDialog` | 28516 | function |  | 1 |
| `cancelPreferencesDialog` | 28540 | function |  | 3 |
| `updateToolRadialGesture` | 28569 | function |  | 1 |
| `performToolRadialAction` | 28598 | function |  | 2 |
| `finishToolRadialGesture` | 28608 | function |  | 2 |
| `cancelToolRadialGesture` | 28617 | function |  | 5 |
| `duplicatePlacementTarget` | 28624 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 28651 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 28655 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 28665 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 28670 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 28682 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 28693 | function |  | 7 |
| `openProceduralDuplicateDialog` | 28701 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 28718 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 28739 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 28750 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 28756 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 28762 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 28795 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 28950 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 29052 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 29093 | function |  | 2 |
| `updateDuplicatePlacement` | 29120 | function |  | 2 |
| `beginDuplicatePlacement` | 29184 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 29248 | function |  | 2 |
| `confirmDuplicatePlacement` | 29289 | function |  | 1 |
| `cancelDuplicatePlacement` | 29326 | function |  | 4 |
| `outlinerClumpLocks` | 29352 | function |  | 11 |
| `handleOutlinerClumpDrop` | 29356 | function |  | 3 |
| `createOutlinerStrandButton` | 29379 | function |  | 4 |
| `createOutlinerCurveSurface` | 29465 | function |  | 2 |
| `createOutlinerClump` | 29561 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 29643 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 29650 | function |  | 2 |
| `renderLockList` | 29729 | function |  | 70 |
| `updateCount` | 29883 | function |  | 34 |
| `captureInputUndo` | 29892 | function |  | 1 |
| `bindUndoCapture` | 29898 | function |  | 36 |
| `bindLockInput` | 29909 | function |  | 2 |
| `applyValue` | 29926 | arrow |  | 2 |
| `applyUniformTransformScale` | 30245 | function |  | 2 |
| `applyReducedTransformScale` | 30262 | function |  | 2 |
| `applyTransformPrecision` | 30301 | function |  | 2 |
| `updateTransformScalePointer` | 30330 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 30651 | function |  | 3 |
| `finishTaperCurveDrag` | 30713 | function |  | 1 |
| `beginTaperMeshPointDrag` | 30756 | function |  | 1 |
| `updateTaperMeshPointDrag` | 30837 | function |  | 1 |
| `finishTaperMeshPointDrag` | 30892 | function |  | 6 |
| `updateSelectedTaperPoint` | 30916 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 31486 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 31491 | function |  | 4 |
| `syncDrawCurlControls` | 31546 | function |  | 5 |
| `handleLiveSurfaceChange` | 31594 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 31676 | function |  | 3 |
| `resampleSurfaceLock` | 31691 | function |  | 2 |
| `changePanelSplitCount` | 31804 | function |  | 3 |
| `applyPresetControl` | 31912 | function |  | 2 |
| `applyCreationToolSettings` | 31933 | function |  | 2 |
| `populateCreationPresetSelect` | 31977 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 32001 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 32034 | function |  | 5 |
| `createCustomCreationPreset` | 32042 | function |  | 3 |
| `createCustomClumpPreset` | 32057 | function |  | 3 |
| `commitCustomCreationPreset` | 32072 | function |  | 2 |
| `openRemoveCreationPreset` | 32133 | function |  | 3 |
| `commitRemoveCreationPreset` | 32146 | function |  | 1 |
| `applyBraidToolPreset` | 32163 | function |  | 2 |
| `selectedBranchChildLock` | 32275 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 32279 | function |  | 2 |
| `initPanelResizeHandles` | 32385 | function |  | 2 |
| `applyWidth` | 32391 | arrow |  | 2 |
| `restoreWidth` | 32398 | arrow |  | 2 |
| `bindResize` | 32406 | arrow |  | 2 |
| `onMove` | 32414 | arrow |  | 0 |
| `onUp` | 32418 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 32435 | function |  | 2 |
| `initFloatingPanelControls` | 32444 | function |  | 2 |
| `detach` | 32453 | arrow |  | 43 |
| `endDrag` | 32491 | arrow |  | 0 |
| `endResize` | 32523 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 32534 | function |  | 3 |
| `selectPatchNotesVersion` | 32668 | function |  | 3 |
| `requestReferenceImage` | 32701 | function |  | 5 |
| `toggleCapsuleGuideTool` | 32905 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 32911 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 32918 | function |  | 1 |
| `deleteLocks` | 33485 | function |  | 10 |
| `disposeCurveObjects` | 33563 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 33615 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 33646 | function |  | 1 |
| `endPanelSplitHandleDrag` | 33721 | function |  | 2 |
| `resize` | 33754 | function |  | 3 |
| `handleViewportPointerMove` | 33765 | function |  | 1 |
| `blockProportionalSizingEvent` | 33776 | function |  | 1 |
| `updateLightAngleFromInputs` | 33782 | function |  | 2 |
| `startViewSnap` | 33796 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 33826 | function |  | 3 |
| `trackViewportPointerDown` | 33843 | function |  | 1 |
| `trackViewportPointerMove` | 33859 | function |  | 1 |
| `clearViewportPointer` | 33867 | function |  | 1 |
| `updateViewSnap` | 33872 | function |  | 1 |
| `nearestCardinalAxis` | 33908 | function |  | 5 |
| `cardinalAxisKey` | 33922 | function |  | 5 |
| `steppedDragAmount` | 33926 | function |  | 3 |
| `snapCameraToCardinalAxis` | 33932 | function |  | 4 |
| `endViewSnap` | 33948 | function |  | 4 |
| `activateStrandControlPoint` | 33958 | function |  | 4 |
| `refreshStrandControlPointSelection` | 34008 | function |  | 4 |
| `addStrandControlPointSelection` | 34035 | function |  | 3 |
| `removeStrandControlPointSelection` | 34052 | function |  | 3 |
| `sampleStrandPointNormal` | 34066 | function |  | 2 |
| `sampleStrandPointVectors` | 34076 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 34082 | function |  | 2 |
| `resampleStrandCurveData` | 34093 | function |  | 4 |
| `resampleMatchingVectors` | 34099 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 34138 | function |  | 4 |
| `removeStrandCurvePoint` | 34149 | function |  | 2 |
| `closestStrandCurveParameter` | 34162 | function |  | 2 |
| `insertStrandCurvePoint` | 34191 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 34208 | function |  | 2 |
| `selectionModifierCursorAvailable` | 34218 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 34234 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 34241 | function |  | 4 |
| `prepareCurvePointSelection` | 34263 | function |  | 1 |
| `finishCurvePointInsertion` | 34374 | function |  | 1 |
| `finishPointRemoval` | 34389 | function |  | 1 |
| `editableStrandWidth` | 34407 | function |  | 6 |
| `editableStrandWidthBounds` | 34419 | function |  | 2 |
| `applyEditableStrandWidth` | 34425 | function |  | 3 |
| `viewportPixelPoint` | 34461 | function |  | 3 |
| `syncSculptBrushControls` | 34469 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 34484 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 34492 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 34500 | function |  | 1 |
| `sculptBrushPlaneOffset` | 34506 | function |  | 5 |
| `setSculptBrushCursorVisible` | 34510 | function |  | 7 |
| `updateSculptBrushCursor` | 34517 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 34539 | function |  | 4 |
| `sculptBrushEditableLock` | 34546 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 34556 | function |  | 5 |
| `sculptBrushLockViable` | 34562 | function |  | 5 |
| `sculptBrushUnits` | 34573 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 34611 | function |  | 4 |
| `sculptBrushPointWeight` | 34661 | function |  | 5 |
| `sculptBrushWorldDelta` | 34671 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 34680 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 34706 | function |  | 2 |
| `beginSculptMoveStroke` | 34764 | function |  | 1 |
| `applySculptMoveStrokeSample` | 34826 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 35061 | function |  | 3 |
| `updateSculptMoveStroke` | 35070 | function |  | 1 |
| `finishSculptMoveStroke` | 35086 | function |  | 3 |
| `strandControlPointHit` | 35134 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 35138 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 35216 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 35250 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 35290 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 35303 | function |  | 1 |
| `setHoveredControlPoint` | 35342 | function |  | 7 |
| `visibleControlPointHoverTargets` | 35355 | function |  | 2 |
| `updateControlPointHover` | 35391 | function |  | 1 |
| `animate` | 35947 | function |  | 2 |
| `syncCompactSidebarLayout` | 35978 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 35997 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 36003 | function |  | 3 |
| `setAttributeEditorTab` | 36009 | function |  | 6 |

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

## modules/geometry/branch-hierarchy.js（117 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchHierarchyApi` | 5 | function | export | 2 |
| `attachDrawnLocksAsBranches` | 11 | function |  | 1 |
| `branchChildrenFor` | 31 | function |  | 2 |
| `detachBranch` | 35 | function |  | 1 |
| `updateBranchChildren` | 46 | function |  | 3 |
| `canBranchDrawFromLock` | 89 | function |  | 3 |
| `selectedDrawBranchPoint` | 96 | function |  | 1 |

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

## modules/geometry/branch-root-bone.js（253 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchRootBoneApi` | 6 | function | export | 2 |
| `branchMoveGizmoDisabled` | 12 | function |  | 1 |
| `setBranchMoveGizmoVisual` | 21 | function |  | 1 |
| `branchSurfaceFrameQuat` | 52 | function |  | 2 |
| `applyBranchRigidRootMove` | 70 | function |  | 1 |
| `syncBranchRootHandleFrame` | 105 | function |  | 1 |
| `stableBranchBaseNormals` | 116 | function |  | 3 |
| `ensureBranchParentNormalField` | 127 | function |  | 1 |
| `branchParentFrame` | 133 | function |  | 4 |
| `branchLocalVector` | 145 | function |  | 3 |
| `branchWorldVector` | 149 | function |  | 1 |
| `captureBranchLocalState` | 155 | function |  | 1 |
| `enforceBranchRootPosition` | 183 | function |  | 1 |
| `branchRootGizmoFrame` | 229 | function |  | 2 |

## modules/geometry/branch-sweep.js（403 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchSweepApi` | 6 | function | export | 2 |
| `activeSweepProfile` | 14 | function |  | 3 |
| `activeSweepProfileTarget` | 21 | function |  | 3 |
| `trimmedSweepProfile` | 28 | function |  | 2 |
| `roundedLeft` | 37 | arrow |  | 1 |
| `roundedRight` | 43 | arrow |  | 1 |
| `mirroredSweepProfileIndex` | 60 | function |  | 1 |
| `createSmoothSweepProfileCurve` | 77 | function |  | 5 |
| `sampleSweepProfile` | 86 | function |  | 4 |
| `createSweepProfileTopology` | 107 | function |  | 1 |
| `twistCurveEditing` | 149 | function |  | 1 |
| `proceduralBranchLengthCurveEditing` | 153 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 157 | function |  | 2 |
| `proceduralBranchCurveEditing` | 161 | function |  | 1 |
| `renderTwistCurvePreview` | 165 | function |  | 1 |
| `twistMeshPointDistancePerDegree` | 183 | function |  | 2 |
| `twistMeshGraphAxis` | 191 | function |  | 2 |
| `addTwistMeshCurvePath` | 195 | function |  | 1 |
| `appendSegment` | 216 | arrow |  | 1 |
| `appendFill` | 219 | arrow |  | 1 |
| `appendSignedSection` | 225 | arrow |  | 3 |
| `renderSweepProfileEditor` | 274 | function |  | 3 |
| `applySweepProfileEdit` | 317 | function |  | 1 |
| `openSweepProfileEditor` | 344 | function |  | 1 |
| `closeSweepProfileEditor` | 379 | function |  | 1 |
| `finishSweepProfileDrag` | 388 | function |  | 1 |

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
