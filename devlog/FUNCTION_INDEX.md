# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-10），由 `node scripts/gen-function-index.js` 产出。共 **1738** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（36064 行）

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
| `closeAppMenus` | 6083 | function |  | 6 |
| `setAppMenuOpen` | 6094 | function |  | 3 |
| `setTurntableActive` | 6101 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6110 | function |  | 9 |
| `selectedReferenceImage` | 6114 | function |  | 20 |
| `normalizeReferenceCrop` | 6120 | function |  | 8 |
| `referenceCropIsFull` | 6128 | function |  | 3 |
| `referencePlaneFrontAxis` | 6133 | function |  | 4 |
| `referencePlanePlacement` | 6142 | function |  | 4 |
| `migratedReferencePlanePosition` | 6157 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6177 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6194 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6210 | function |  | 2 |
| `snappedReferenceImageView` | 6233 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6239 | function |  | 5 |
| `applyReferenceImageRuntime` | 6255 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6298 | function |  | 6 |
| `createReferenceImageRuntime` | 6306 | function |  | 3 |
| `addReferenceImage` | 6375 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6427 | function |  | 3 |
| `disposeReferenceImage` | 6446 | function |  | 2 |
| `clearReferenceImages` | 6450 | function |  | 2 |
| `serializeReferenceImage` | 6457 | function |  | 1 |
| `setReferenceImageType` | 6485 | function |  | 2 |
| `attachReferenceImageTransform` | 6529 | function |  | 6 |
| `selectReferenceImage` | 6543 | function |  | 12 |
| `placeReferencePlane` | 6566 | function |  | 2 |
| `setReferencePlaneInFront` | 6577 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6587 | function |  | 4 |
| `renderReferenceImagePanel` | 6606 | function |  | 20 |
| `setOutlinerTab` | 6653 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6671 | function |  | 4 |
| `componentEditModeActive` | 6675 | function |  | 37 |
| `selectionToolSupportsPicking` | 6679 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6684 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6700 | function |  | 2 |
| `setViewportSelectionMode` | 6730 | function |  | 4 |
| `setViewportEditMode` | 6742 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6784 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6798 | function |  | 8 |
| `outlinerGuides` | 6810 | function |  | 3 |
| `guideOutlinerLabel` | 6817 | function |  | 2 |
| `normalizeOutlinerName` | 6827 | function |  | 4 |
| `beginOutlinerRename` | 6832 | function |  | 2 |
| `finish` | 6843 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6873 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6883 | function |  | 2 |
| `renderGuideOutliner` | 6918 | function |  | 10 |
| `referenceOutlinerGroup` | 6976 | function |  | 2 |
| `renderReferenceOutliner` | 6980 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7097 | function |  | 5 |
| `readReferenceImageFile` | 7102 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7126 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7133 | function |  | 3 |
| `dragContainsReferenceImage` | 7178 | function |  | 3 |
| `setReferenceImageDragActive` | 7189 | function |  | 9 |
| `referenceDropDestination` | 7197 | function |  | 2 |
| `viewportOverlayDropPosition` | 7203 | function |  | 2 |
| `setReferenceDropHover` | 7212 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7230 | function |  | 2 |
| `referenceOverlayAtPointer` | 7250 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7268 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7281 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7327 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7377 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7399 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7410 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7436 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7445 | function |  | 2 |
| `referenceCropCursor` | 7460 | function |  | 3 |
| `updateReferenceCropHandles` | 7466 | function |  | 5 |
| `referenceCropSourcePoint` | 7487 | function |  | 2 |
| `beginReferenceCrop` | 7494 | function |  | 1 |
| `updateReferenceCrop` | 7532 | function |  | 1 |
| `finishReferenceCrop` | 7564 | function |  | 4 |
| `setHeadSetupEditing` | 7582 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7598 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7607 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7617 | function |  | 4 |
| `setScalpGuideVisibility` | 7623 | function |  | 12 |
| `currentGuideViewMode` | 7631 | function |  | 3 |
| `updateGuideViewToggle` | 7639 | function |  | 5 |
| `setGuideViewMode` | 7655 | function |  | 3 |
| `cycleGuideViewMode` | 7666 | function |  | 1 |
| `hideGuideViewContextMenu` | 7671 | function |  | 6 |
| `showGuideViewContextMenu` | 7675 | function |  | 1 |
| `strandPassesDisplayFilters` | 7688 | function |  | 4 |
| `strandVisibleForDisplay` | 7697 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7702 | function |  | 2 |
| `lockedStrandsExist` | 7706 | function |  | 3 |
| `hiddenStrandsExist` | 7710 | function |  | 2 |
| `hideSelectedStrands` | 7714 | function |  | 2 |
| `unhideHiddenStrands` | 7724 | function |  | 2 |
| `strandIsolationActive` | 7733 | function |  | 7 |
| `setStrandIsolation` | 7737 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7749 | function |  | 3 |
| `syncVisibilityParent` | 7760 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7767 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7796 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7803 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7823 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7846 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7854 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7861 | function |  | 9 |
| `setScalpLatticeEditing` | 7872 | function |  | 4 |
| `setScalpShapeEditing` | 7887 | function |  | 9 |
| `setScalpPaintEditing` | 7905 | function |  | 7 |
| `defaultCurveLatticePoints` | 7929 | function |  | 3 |
| `flatCurveLatticePoints` | 7955 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7964 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7988 | function |  | 4 |
| `horizontalValue` | 7993 | arrow |  | 1 |
| `blendedSample` | 8004 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8037 | function |  | 2 |
| `curveLatticeControlPoint` | 8052 | function |  | 9 |
| `circularArcTangent` | 8056 | function |  | 4 |
| `arcLengthTo` | 8087 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8099 | function |  | 3 |
| `sampleHermiteCurve` | 8138 | function |  | 10 |
| `sampleCurveLattice` | 8155 | function |  | 6 |
| `curveLatticeNormal` | 8174 | function |  | 1 |
| `createCurveLatticeGeometry` | 8185 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8214 | function |  | 3 |
| `appendCurve` | 8216 | arrow |  | 4 |
| `sample` | 8218 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8245 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8261 | function |  | 3 |
| `addPicker` | 8263 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8302 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8315 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8319 | function |  | 3 |
| `curveLatticeEditablePoint` | 8337 | function |  | 13 |
| `curveLatticePointSection` | 8344 | function |  | 3 |
| `curveLatticeRestPoint` | 8355 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8361 | function |  | 7 |
| `curveLatticeRootColumns` | 8367 | function |  | 3 |
| `curveTangentsForPoints` | 8374 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8386 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8423 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8449 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8466 | function |  | 3 |
| `resampleGrid` | 8476 | arrow |  | 2 |
| `controlPointIsSelected` | 8503 | function |  | 7 |
| `clearMultiPointSelection` | 8511 | function |  | 9 |
| `createCurveLatticeHandles` | 8515 | function |  | 4 |
| `addCurveLattice` | 8537 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8646 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8677 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8683 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8722 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8743 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8760 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8769 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8776 | function |  | 1 |
| `selectCurveLatticeLoop` | 8795 | function |  | 3 |
| `selectCurveLatticePoint` | 8824 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8839 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8881 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8902 | function |  | 3 |
| `curveLatticeColumnPoints` | 8945 | function |  | 3 |
| `groupCurveControlIndices` | 8954 | function |  | 4 |
| `groupCurveControlPoints` | 8960 | function |  | 2 |
| `updateGroupCurveDisplay` | 8966 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8976 | function |  | 2 |
| `groupCurveDeformationPairs` | 8998 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9005 | function |  | 2 |
| `appendPairs` | 9007 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9018 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9037 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9058 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9077 | function |  | 2 |
| `capsuleGuideCapHeight` | 9111 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9115 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9120 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9124 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9136 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9152 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9158 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9184 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9214 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9268 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9289 | function |  | 7 |
| `vertex` | 9303 | function |  | 3 |
| `addFace` | 9309 | function |  | 3 |
| `addRing` | 9327 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9382 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9392 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9457 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9503 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9516 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9537 | function |  | 3 |
| `capsuleGuidePointDistances` | 9542 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9563 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9583 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9588 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9594 | function |  | 3 |
| `capsuleGuideAccentColor` | 9599 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9604 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9615 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9627 | function |  | 2 |
| `createCapsuleGuideHandles` | 9659 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9682 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9701 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9708 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9724 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9741 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9756 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9793 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9809 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9826 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9832 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9859 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9871 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9890 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9935 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9970 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9984 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9990 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10007 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10018 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10029 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10059 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10069 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10110 | function |  | 3 |
| `createQuadCageGeometry` | 10126 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10150 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10170 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10181 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10234 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10272 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10282 | function |  | 4 |
| `addCapsuleGuide` | 10290 | function |  | 4 |
| `addGuide` | 10359 | function |  | 1 |
| `createGuideGeometry` | 10420 | function |  | 4 |
| `selectGuide` | 10475 | function |  | 17 |
| `updateGuideControlsVisibility` | 10543 | function |  | 10 |
| `updateViewportToolVisibility` | 10560 | function |  | 7 |
| `getSelectedGuide` | 10599 | function |  | 34 |
| `selectedViewportFocusBounds` | 10603 | function |  | 2 |
| `frameViewportBounds` | 10617 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10647 | function |  | 2 |
| `fullSceneFocusBounds` | 10651 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10666 | function |  | 3 |
| `cycleViewportFraming` | 10675 | function |  | 2 |
| `syncGuideInputs` | 10693 | function |  | 5 |
| `updateGuideGeometry` | 10736 | function |  | 3 |
| `sculptBrushToolActive` | 10757 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10761 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10765 | function |  | 3 |
| `effectiveSculptBrushTool` | 10769 | function |  | 13 |
| `updateSculptScaleModeRow` | 10775 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10780 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10802 | function |  | 5 |
| `setActiveTool` | 10811 | function |  | 19 |
| `setDrawStrandMode` | 10949 | function |  | 2 |
| `setObjectSpaceEditing` | 10959 | function |  | 7 |
| `setHierarchyEditing` | 10975 | function |  | 4 |
| `setProportionalEditing` | 10987 | function |  | 5 |
| `beginProportionalSizeEdit` | 11006 | function |  | 3 |
| `updateProportionalSizeEdit` | 11018 | function |  | 2 |
| `endProportionalSizeEdit` | 11029 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11036 | function |  | 2 |
| `refreshProportionalPreview` | 11044 | function |  | 4 |
| `activeBrushSizeInput` | 11054 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11063 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11075 | function |  | 2 |
| `beginBrushSizeDrag` | 11093 | function |  | 1 |
| `updateBrushSizeDrag` | 11120 | function |  | 1 |
| `finishBrushSizeDrag` | 11141 | function |  | 2 |
| `updateInteractionLocks` | 11158 | function |  | 87 |
| `configureTransformControls` | 11169 | function |  | 16 |
| `pullMoveActive` | 11177 | function |  | 9 |
| `updatePullGuideVisual` | 11181 | function |  | 4 |
| `attachTransformForCurvePoint` | 11197 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11221 | function |  | 7 |
| `strandObjectRootIndex` | 11237 | function |  | 3 |
| `strandObjectRoot` | 11246 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11250 | function |  | 2 |
| `attachStrandObjectTransform` | 11255 | function |  | 6 |
| `guideObjectPivot` | 11278 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11289 | function |  | 2 |
| `attachGuideObjectTransform` | 11294 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11313 | function |  | 2 |
| `beginGuideObjectTransform` | 11341 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11348 | function |  | 2 |
| `updateGuideObjectTransform` | 11370 | function |  | 2 |
| `finishGuideObjectTransform` | 11403 | function |  | 2 |
| `clonePlacementFrame` | 11412 | function |  | 2 |
| `cloneOptionalVectors` | 11424 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11428 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11445 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11460 | function |  | 2 |
| `strandObjectTransformOperators` | 11476 | function |  | 4 |
| `transformPoint` | 11484 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11491 | arrow |  | 0 |
| `transformNormal` | 11497 | arrow |  | 10 |
| `transformDirection` | 11507 | arrow |  | 7 |
| `worldMatrixForPivot` | 11519 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11525 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11541 | function |  | 6 |
| `beginStrandObjectTransform` | 11567 | function |  | 2 |
| `updateStrandObjectTransform` | 11605 | function |  | 2 |
| `commitStrandObjectTransform` | 11663 | function |  | 2 |
| `mapPoints` | 11676 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11710 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11724 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11747 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11760 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11775 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11801 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11850 | function |  | 2 |
| `beginHandleEdit` | 11859 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 11912 | function |  | 3 |
| `multiPointHandleEditActive` | 11923 | function |  | 7 |
| `applyMultiMove` | 11927 | function |  | 5 |
| `applyMultiRotate` | 11933 | function |  | 2 |
| `applyMultiScale` | 11942 | function |  | 2 |
| `applyHierarchicalMove` | 11951 | function |  | 3 |
| `applySingleMove` | 11963 | function |  | 5 |
| `applySurfaceLatticeMirror` | 11967 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 11984 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 11993 | function |  | 3 |
| `changed` | 12003 | arrow |  | 1 |
| `applyPullMove` | 12045 | function |  | 3 |
| `pullHeadCollisionContext` | 12053 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12072 | function |  | 2 |
| `applyProportionalMove` | 12095 | function |  | 3 |
| `viewPlaneNormal` | 12106 | function |  | 20 |
| `isCameraInSnappedView` | 12110 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12118 | function |  | 10 |
| `updateViewPlaneGrid` | 12122 | function |  | 14 |
| `setViewPlaneMove` | 12179 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12190 | function |  | 2 |
| `rayFromViewportEvent` | 12198 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12206 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12216 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12227 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12240 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12259 | function |  | 4 |
| `beginViewPlaneMove` | 12266 | function |  | 3 |
| `updateViewPlaneMove` | 12330 | function |  | 1 |
| `endViewPlaneMove` | 12395 | function |  | 7 |
| `applyHierarchicalRotate` | 12414 | function |  | 2 |
| `rotateGuideNormal` | 12421 | arrow |  | 4 |
| `applySingleRotate` | 12459 | function |  | 2 |
| `applyProportionalRotate` | 12463 | function |  | 2 |
| `applyHierarchicalScale` | 12483 | function |  | 2 |
| `applySingleScale` | 12493 | function |  | 2 |
| `applyProportionalScale` | 12497 | function |  | 2 |
| `setPointScale` | 12513 | function |  | 8 |
| `proportionalWeight` | 12522 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12534 | function |  | 5 |
| `strandInfluenceColor` | 12540 | function |  | 13 |
| `beginRelaxEdit` | 12565 | function |  | 3 |
| `updateRelaxEdit` | 12594 | function |  | 1 |
| `endRelaxEdit` | 12654 | function |  | 1 |
| `disposeGuide` | 12664 | function |  | 3 |
| `removeGuideObjects` | 12692 | function |  | 3 |
| `strandRadiusAt` | 12706 | function |  | 5 |
| `strandProfileTopologyAt` | 12723 | function |  | 6 |
| `strandCurveParameters` | 12765 | function |  | 4 |
| `widthProfileAt` | 12775 | arrow |  | 1 |
| `braidFrameAt` | 12813 | function |  | 5 |
| `braidFrameAtExtended` | 12823 | function |  | 2 |
| `createBraidProfileProjector` | 12832 | function |  | 2 |
| `project` | 12848 | arrow |  | 17 |
| `createBraidGeometry` | 12863 | function |  | 2 |
| `deformationAt` | 12898 | function |  | 3 |
| `widthFor` | 12907 | arrow |  | 3 |
| `depthFor` | 12911 | arrow |  | 3 |
| `outputVertex` | 12943 | function |  | 7 |
| `appendAuthoredCap` | 13051 | function |  | 3 |
| `outputCapVertex` | 13058 | arrow |  | 6 |
| `capBoundary` | 13149 | function |  | 3 |
| `strandGeometryCurve` | 13211 | function |  | 12 |
| `strandGeometryFrameAt` | 13237 | function |  | 15 |
| `transportedStrandFrameAt` | 13300 | function |  | 6 |
| `twistOverrideAt` | 13303 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13331 | function |  | 2 |
| `weldPanelGeometryData` | 13367 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13407 | function |  | 3 |
| `surfacePanelPoint` | 13422 | function |  | 3 |
| `createPanelStrandGeometry` | 13445 | function |  | 2 |
| `addQuad` | 13479 | arrow |  | 6 |
| `near` | 13483 | arrow |  | 6 |
| `panelWidthAt` | 13513 | arrow |  | 6 |
| `panelThicknessAt` | 13522 | arrow |  | 6 |
| `panelFrameAt` | 13531 | arrow |  | 1 |
| `rawPanelPoint` | 13549 | arrow |  | 1 |
| `panelPoint` | 13569 | arrow |  | 2 |
| `addPatch` | 13575 | arrow |  | 1 |
| `splitOpening` | 13626 | arrow |  | 2 |
| `uStart` | 13650 | arrow |  | 1 |
| `uEnd` | 13653 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13691 | function |  | 3 |
| `inside` | 13692 | arrow |  | 2 |
| `pushOrientedTriangle` | 13714 | function |  | 7 |
| `triangulatePolygon3D` | 13725 | function |  | 1 |
| `orientedQuadFace` | 13775 | function |  | 2 |
| `createSplitStrandGeometry` | 13783 | function |  | 2 |
| `fusedIndexAt` | 13940 | arrow |  | 0 |
| `createHairCardGeometry` | 13989 | function |  | 2 |
| `createPolyGeometry` | 14088 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14115 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14124 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14171 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14179 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14195 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14204 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14215 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14223 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14233 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14253 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14276 | function |  | 4 |
| `createCompoundStrandGeometry` | 14359 | function |  | 2 |
| `proceduralBranchGeometryLock` | 14610 | function |  | 2 |
| `createHairGeometry` | 14650 | function |  | 6 |
| `createBaseHairGeometry` | 14702 | function |  | 3 |
| `hairMaterialDefinition` | 14820 | function |  | 4 |
| `materialForLock` | 14824 | function |  | 8 |
| `activeHairMaterialDefinition` | 14828 | function |  | 11 |
| `strandDisplayColor` | 14834 | function |  | 14 |
| `setAnimeHairBaseColor` | 14852 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 14865 | function |  | 2 |
| `createHairMaterial` | 14905 | function |  | 5 |
| `createStrandSelectionOutline` | 14947 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 14981 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 14990 | function |  | 6 |
| `refreshMaterialUsers` | 15017 | function |  | 6 |
| `renderHairMaterialOutliner` | 15026 | function |  | 5 |
| `renderHairMaterialOptions` | 15056 | function |  | 3 |
| `syncHairMaterialEditor` | 15066 | function |  | 9 |
| `createProjectHairMaterial` | 15092 | function |  | 3 |
| `deleteActiveHairMaterial` | 15112 | function |  | 2 |
| `createHairTopologyGeometry` | 15130 | function |  | 4 |
| `createHairTopologyOverlay` | 15151 | function |  | 3 |
| `groupDefaultsFor` | 15198 | function |  | 9 |
| `creationToolActive` | 15205 | function |  | 7 |
| `activeCreationShapeDefaults` | 15209 | function |  | 9 |
| `activeStrandShapeTarget` | 15215 | function |  | 5 |
| `curvePolylineLength` | 15219 | function |  | 2 |
| `curvePolylineLengths` | 15227 | function |  | 3 |
| `samplePolylineDistance` | 15235 | function |  | 2 |
| `applyProjectedCurveLength` | 15245 | function |  | 4 |
| `clearRegionLengthBaseline` | 15276 | function |  | 2 |
| `ensureRegionLengthBaseline` | 15283 | function |  | 2 |
| `setGroupLengthScale` | 15291 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 15329 | function |  | 4 |
| `requestGroupDefaultsWarning` | 15361 | function |  | 1 |
| `activeProfileOffset` | 15373 | function |  | 3 |
| `profileToCanvas` | 15381 | function |  | 1 |
| `renderProfilePreview` | 15388 | function |  | 7 |
| `renderHairCardCoveragePath` | 15407 | function |  | 2 |
| `activeTaperTarget` | 15422 | function |  | 15 |
| `activeTaperCurve` | 15456 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 15467 | function |  | 6 |
| `taperSamples` | 15477 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 15484 | function |  | 2 |
| `renderTaperPreview` | 15506 | function |  | 13 |
| `shapeTargetForSelect` | 15545 | function |  | 3 |
| `setupShapePresetControls` | 15555 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 15580 | function |  | 3 |
| `syncShapePresetSelects` | 15586 | function |  | 6 |
| `populateShapePresetSelects` | 15607 | function |  | 5 |
| `openSaveShapePreset` | 15635 | function |  | 2 |
| `commitCustomShapePreset` | 15660 | function |  | 2 |
| `openRemoveShapePreset` | 15683 | function |  | 2 |
| `commitRemoveShapePreset` | 15696 | function |  | 2 |
| `taperPointToCanvas` | 15712 | function |  | 4 |
| `canvasToTaperPoint` | 15729 | function |  | 2 |
| `clearTaperMeshPoints` | 15765 | function |  | 2 |
| `taperMeshPointFrame` | 15775 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 15788 | function |  | 4 |
| `updateTaperMeshPoints` | 15825 | function |  | 5 |
| `setTaperMeshPointsVisible` | 15904 | function |  | 5 |
| `renderTaperCurveEditor` | 15922 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 15994 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 16008 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 16024 | function |  | 2 |
| `scheduleTaperCurveEdit` | 16056 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 16065 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 16076 | function |  | 2 |
| `applyTaperCurveEdit` | 16084 | function |  | 10 |
| `openTaperCurveEditor` | 16192 | function |  | 3 |
| `closeTaperCurveEditor` | 16237 | function |  | 4 |
| `updateViewportStatsVisibility` | 16250 | function |  | 4 |
| `canvasToProfile` | 16269 | function |  | 2 |
| `retargetFloatingStrandEditors` | 16283 | function |  | 2 |
| `addLock` | 16298 | function |  | 19 |
| `mirroredScalpRegion` | 16501 | function |  | 5 |
| `mirroredVector` | 16510 | function |  | 12 |
| `mirroredPlacementFrame` | 16514 | function |  | 2 |
| `mirrorPartnerFor` | 16527 | function |  | 40 |
| `decoupleMirrorPartner` | 16531 | function |  | 2 |
| `createMirrorPartner` | 16539 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 16635 | function |  | 6 |
| `mirroredClumpPartners` | 16640 | function |  | 6 |
| `createMirroredClump` | 16646 | function |  | 3 |
| `decoupleMirroredClump` | 16668 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 16688 | function |  | 6 |
| `syncActiveMirror` | 16853 | function |  | 25 |
| `setMirrorXEditing` | 16865 | function |  | 6 |
| `snapshotState` | 16889 | function |  | 7 |
| `scalpTriangleRegion` | 17146 | function |  | 4 |
| `closestPointOnActiveScalp` | 17159 | function |  | 12 |
| `rootAttachmentFrame` | 17231 | function |  | 3 |
| `rootAttachmentLocalFrame` | 17243 | function |  | 4 |
| `resolveRootAttachment` | 17261 | function |  | 4 |
| `curvePointsToRootLocal` | 17301 | function |  | 2 |
| `curvePointsFromRootLocal` | 17313 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 17321 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 17337 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 17367 | function |  | 2 |
| `createRootAttachment` | 17379 | function |  | 9 |
| `syncRootAttachmentMetadata` | 17409 | function |  | 4 |
| `rootAttachmentToData` | 17436 | function |  | 2 |
| `rootAttachmentFromData` | 17464 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 17503 | function |  | 2 |
| `remapPoint` | 17518 | arrow |  | 1 |
| `remapVector` | 17519 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 17548 | function |  | 2 |
| `importHeadMeshFile` | 17565 | function |  | 3 |
| `importFullBodyMeshFile` | 17588 | function |  | 3 |
| `downloadPreferencesAndPresets` | 17613 | function |  | 1 |
| `importedBooleanPreference` | 17646 | function |  | 11 |
| `loadPreferencesAndPresets` | 17660 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 17730 | function |  | 1 |
| `openHairProjectFile` | 17773 | function |  | 4 |
| `dragContainsApplicationFile` | 17831 | function |  | 3 |
| `safelyRememberRecentProject` | 17840 | function |  | 2 |
| `renderRecentProjectsMenu` | 17849 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 17881 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 17906 | function |  | 2 |
| `confirmDroppedApplicationFile` | 17910 | function |  | 2 |
| `pushUndoState` | 17926 | function |  | 114 |
| `undoLastAction` | 17933 | function |  | 2 |
| `redoLastAction` | 17950 | function |  | 2 |
| `updateHistoryButtons` | 17967 | function |  | 12 |
| `resetTransientInteractionsForStateRestore` | 17972 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 17992 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 17999 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 18037 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 18114 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 18140 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 18172 | function |  | 2 |
| `finalizeStateRestore` | 18213 | function |  | 2 |
| `restoreState` | 18220 | function |  | 5 |
| `disposeAllEditableObjects` | 18244 | function |  | 2 |
| `restoreLock` | 18265 | function |  | 4 |
| `restoreGuide` | 18481 | function |  | 2 |
| `vectorToData` | 18542 | function |  | 29 |
| `dataToVector` | 18546 | function |  | 31 |
| `frameToData` | 18550 | function |  | 2 |
| `frameFromData` | 18562 | function |  | 2 |
| `applyPresetSelection` | 18574 | function |  | 2 |
| `drawPresetThumbnail` | 18605 | function |  | 1 |
| `fillHair` | 18620 | arrow |  | 9 |
| `strand` | 18632 | arrow |  | 31 |
| `bun` | 18650 | arrow |  | 2 |
| `braid` | 18685 | arrow |  | 2 |
| `renderPresetLibrary` | 18774 | function |  | 3 |
| `setPresetLibraryOpen` | 18833 | function |  | 6 |
| `average` | 18846 | function |  | 4 |
| `fitPointAttributes` | 18850 | function |  | 9 |
| `rebuildCurveObjects` | 18879 | function |  | 10 |
| `createCurvePoints` | 18891 | function |  | 2 |
| `addGeneratedBangPreset` | 18900 | function |  | 1 |
| `sampleScalpQuad` | 18993 | function |  | 4 |
| `createLongLayeredCurlPoints` | 19017 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 19066 | function |  | 1 |
| `columns` | 19067 | arrow |  | 1 |
| `layer` | 19071 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 19285 | function |  | 2 |
| `addBraidedBobPreset` | 19321 | function |  | 1 |
| `evenColumns` | 19322 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 19538 | function |  | 1 |
| `scalpSeed` | 19561 | arrow |  | 1 |
| `createBowlCutPoints` | 19848 | function |  | 2 |
| `addBowlCutPreset` | 19886 | function |  | 1 |
| `scalpRegionAtHit` | 19952 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 19964 | function |  | 6 |
| `selectedCurveLatticeGuide` | 19971 | function |  | 12 |
| `braidStrokeActive` | 19978 | function |  | 9 |
| `proceduralDrawActive` | 19982 | function |  | 3 |
| `panelStrokeActive` | 19986 | function |  | 6 |
| `activeStrokeSurfaceInput` | 19990 | function |  | 4 |
| `activeStrokeSurfaceValue` | 19994 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 19998 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 20004 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 20008 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 20012 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 20016 | function |  | 3 |
| `liveSurfaceStrandId` | 20026 | function |  | 4 |
| `liveSurfaceStrand` | 20030 | function |  | 4 |
| `liveSurfaceGuideId` | 20035 | function |  | 3 |
| `guideSupportsLiveSurface` | 20039 | function |  | 2 |
| `liveSurfaceGuide` | 20046 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 20053 | function |  | 12 |
| `activeStrokeScalpOffset` | 20093 | function |  | 4 |
| `activeStrokeBrushSize` | 20099 | function |  | 10 |
| `activeStrokeBrushDepth` | 20105 | function |  | 5 |
| `strokeSurfaceIsContextual` | 20111 | function |  | 7 |
| `contextualPlaneAtOrigin` | 20119 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 20129 | function |  | 13 |
| `worldNormalAtHit` | 20168 | function |  | 6 |
| `selectedPolyMesh` | 20176 | function |  | 10 |
| `addPolyLock` | 20181 | function |  | 2 |
| `ensurePolyMesh` | 20200 | function |  | 3 |
| `polySurfaceSample` | 20204 | function |  | 4 |
| `polyTargetAtEvent` | 20215 | function |  | 6 |
| `refreshPolyMesh` | 20241 | function |  | 10 |
| `ensurePolyFillPreview` | 20250 | function |  | 2 |
| `clearPolyFillPreview` | 20287 | function |  | 17 |
| `polyFillCandidateForEvent` | 20292 | function |  | 3 |
| `showPolyFillPreview` | 20312 | function |  | 2 |
| `updatePolyFillPreview` | 20338 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 20363 | function |  | 5 |
| `fillPolyGap` | 20373 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 20384 | function |  | 2 |
| `projectPolyRelaxPoint` | 20404 | function |  | 2 |
| `removePolyPointAttributes` | 20448 | function |  | 3 |
| `deletePolyComponent` | 20457 | function |  | 2 |
| `addPolyPoint` | 20480 | function |  | 4 |
| `appendPolyStrokeRow` | 20489 | function |  | 4 |
| `beginPolyBrushPointer` | 20509 | function |  | 1 |
| `finishPolyAltDelete` | 20595 | function |  | 1 |
| `updatePolyBrushStroke` | 20609 | function |  | 1 |
| `finishPolyBrushStroke` | 20699 | function |  | 4 |
| `drawScalpRegionAtEvent` | 20736 | function |  | 2 |
| `drawSampleFromHit` | 20759 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 20773 | function |  | 3 |
| `strokeLength` | 20810 | function |  | 9 |
| `resampleDrawStroke` | 20816 | function |  | 2 |
| `processedDrawStroke` | 20848 | function |  | 8 |
| `strokeSurfaceNormals` | 20877 | function |  | 7 |
| `drawClumpFrame` | 20888 | function |  | 4 |
| `nearestCurveParameter` | 20897 | function |  | 2 |
| `drawClumpSampleNormal` | 20911 | function |  | 6 |
| `drawClumpTemplateVector` | 20920 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 20926 | function |  | 3 |
| `drawClumpStrandMaps` | 20942 | function |  | 4 |
| `nextClumpName` | 20997 | function |  | 6 |
| `initializeClumpShape` | 21004 | function |  | 5 |
| `stableClumpVariation` | 21015 | function |  | 3 |
| `createClumpFromLocks` | 21027 | function |  | 7 |
| `addLockToClump` | 21052 | function |  | 4 |
| `pointerToNdc` | 21108 | function |  | 1 |
| `gridProfileSkipCol` | 21124 | function |  | 3 |
| `clumpDirectMembers` | 21148 | function |  | 3 |
| `clumpMembersForGuide` | 21153 | function |  | 6 |
| `clumpGuideForLock` | 21157 | function |  | 13 |
| `proceduralGuideForLock` | 21162 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 21169 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 21176 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 21183 | function |  | 3 |
| `proceduralBranchWorldPoints` | 21195 | function |  | 2 |
| `applyProceduralBranchSettings` | 21208 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 21247 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 21263 | function |  | 3 |
| `createProceduralAccessoryLock` | 21277 | function |  | 2 |
| `applyProceduralAccessorySettings` | 21329 | function |  | 2 |
| `clumpFrameAt` | 21380 | function |  | 5 |
| `commitClumpMemberRestState` | 21388 | function |  | 10 |
| `updateClumpMembers` | 21471 | function |  | 10 |
| `dissolveClump` | 21575 | function |  | 6 |
| `detachLockFromClump` | 21612 | function |  | 4 |
| `updateDrawVolumePreview` | 21638 | function |  | 5 |
| `hideDrawClumpPreviews` | 21662 | function |  | 5 |
| `resetDrawVolumePreview` | 21668 | function |  | 3 |
| `updateDrawStrandPreview` | 21674 | function |  | 22 |
| `continueFromTipEnabled` | 21893 | function |  | 2 |
| `selectedTipContinuationLock` | 21899 | function |  | 3 |
| `beginDrawStrandStroke` | 21914 | function |  | 2 |
| `beginDrawFreePlane` | 22039 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 22053 | function |  | 2 |
| `updateDrawStrandStroke` | 22078 | function |  | 1 |
| `createDrawnLock` | 22124 | function |  | 3 |
| `setting` | 22128 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 22196 | function |  | 4 |
| `createDrawnBraid` | 22204 | function |  | 2 |
| `createDrawnStrand` | 22261 | function |  | 2 |
| `createDrawnPanel` | 22388 | function |  | 2 |
| `surfaceLatticeNormal` | 22438 | function |  | 2 |
| `createSurfaceLockFromLattice` | 22453 | function |  | 3 |
| `createViewportSurface` | 22518 | function |  | 2 |
| `loftSurfaceProfilePoints` | 22547 | function |  | 6 |
| `hideLoftSurfacePreviews` | 22553 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 22560 | function |  | 4 |
| `updateLoftSurfacePreview` | 22569 | function |  | 5 |
| `resetLoftSurfaceDraft` | 22601 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 22617 | function |  | 3 |
| `cloneCurveSurfaceSource` | 22635 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 22657 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 22683 | function |  | 3 |
| `curveSurfaceProfilePoints` | 22693 | function |  | 3 |
| `curveSurfaceProfileNormals` | 22697 | function |  | 2 |
| `curveSurfacePreviewLock` | 22706 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 22729 | function |  | 2 |
| `hideCurveSurfacePreview` | 22745 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 22757 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 22762 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 22771 | function |  | 3 |
| `curveSurfaceSideVector` | 22809 | function |  | 4 |
| `curveSurfaceDraftCurves` | 22822 | function |  | 2 |
| `curveSurfaceFallbackHit` | 22830 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 22843 | function |  | 5 |
| `updateCurveSurfacePreview` | 22863 | function |  | 6 |
| `resetCurveSurfaceDraft` | 22925 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 22947 | function |  | 3 |
| `beginCurveSurfaceStroke` | 22962 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 23010 | function |  | 3 |
| `updateCurveSurfaceStroke` | 23045 | function |  | 1 |
| `finishCurveSurfaceStroke` | 23077 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 23135 | function |  | 2 |
| `commitCurveSurfaceDraft` | 23212 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 23217 | function |  | 8 |
| `beginLoftSurfaceStroke` | 23226 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 23260 | function |  | 2 |
| `updateLoftSurfaceStroke` | 23271 | function |  | 1 |
| `finishLoftSurfaceStroke` | 23301 | function |  | 2 |
| `extendDrawnStrand` | 23358 | function |  | 2 |
| `finishDrawStrandStroke` | 23391 | function |  | 7 |
| `createPlacedStrand` | 23418 | function |  | 2 |
| `placedPointCount` | 23482 | function |  | 3 |
| `createPlacedPoints` | 23486 | function |  | 3 |
| `pushPointOutsideHead` | 23505 | function |  | 8 |
| `resizePlacedStrand` | 23537 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 23554 | function |  | 5 |
| `beginPlaceEdit` | 23559 | function |  | 2 |
| `updatePlaceEdit` | 23577 | function |  | 1 |
| `updatePlacementLength` | 23591 | function |  | 3 |
| `updatePlacementOrientation` | 23601 | function |  | 3 |
| `endPlaceEdit` | 23619 | function |  | 1 |
| `confirmPendingPlacedStrand` | 23634 | function |  | 1 |
| `pendingPlacedLock` | 23644 | function |  | 2 |
| `beginPlacementPointer` | 23648 | function |  | 3 |
| `finishPlacementPointer` | 23658 | function |  | 2 |
| `confirmPlacementStep` | 23682 | function |  | 2 |
| `finishPlacementFlow` | 23705 | function |  | 7 |
| `updatePlacementStatus` | 23718 | function |  | 82 |
| `deselectStrands` | 23857 | function |  | 12 |
| `beginSelectionMarquee` | 23872 | function |  | 3 |
| `beginAltOrbit` | 23896 | function |  | 1 |
| `beginBlenderNavigation` | 23908 | function |  | 1 |
| `endBlenderNavigation` | 23953 | function |  | 1 |
| `prepareSelectPointerCapture` | 23961 | function |  | 1 |
| `endSelectPointerCapture` | 23967 | function |  | 1 |
| `endAltOrbit` | 23973 | function |  | 1 |
| `dollyCameraByDrag` | 23980 | function |  | 2 |
| `fastDragMagnitude` | 24003 | function |  | 2 |
| `beginHoudiniZoomDrag` | 24009 | function |  | 1 |
| `updateHoudiniZoomDrag` | 24017 | function |  | 1 |
| `endHoudiniZoomDrag` | 24034 | function |  | 1 |
| `updateSelectionMarquee` | 24042 | function |  | 1 |
| `pointInsideSelectionMarquee` | 24059 | function |  | 3 |
| `selectPointsInMarquee` | 24067 | function |  | 2 |
| `pointKey` | 24093 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 24124 | function |  | 2 |
| `objectInsideSelectionMarquee` | 24161 | function |  | 3 |
| `projectedPoint` | 24178 | arrow |  | 1 |
| `selectObjectsInMarquee` | 24207 | function |  | 2 |
| `finishSelectionMarquee` | 24252 | function |  | 2 |
| `headMeshes` | 24275 | function |  | 9 |
| `strandSplitProfileData` | 24283 | function |  | 4 |
| `strandSplitControlPoint` | 24296 | function |  | 4 |
| `panelSplitControlPoint` | 24332 | function |  | 6 |
| `strandControlPointRaycast` | 24388 | function |  | 1 |
| `strandControlPointFrame` | 24423 | function |  | 4 |
| `strandControlPointHitFromEvent` | 24455 | function |  | 4 |
| `createCurveObjects` | 24513 | function |  | 4 |
| `polyEdgeKey` | 24686 | function |  | 2 |
| `polyMeshEdges` | 24690 | function |  | 2 |
| `populatePolyEditObjects` | 24704 | function |  | 3 |
| `createPolyEditObjects` | 24765 | function |  | 2 |
| `rebuildPolyEditObjects` | 24773 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 24787 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 24794 | function |  | 2 |
| `strandWidthEdgeSample` | 24803 | function |  | 3 |
| `strandWidthEdgePoints` | 24826 | function |  | 2 |
| `sculptBrushDebugRaycast` | 24840 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 24844 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 24851 | function |  | 3 |
| `refreshSculptBrushDebugView` | 24863 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 24868 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 24874 | function |  | 3 |
| `updateCurveObjects` | 24888 | function |  | 35 |
| `createCurveNormalIndicator` | 25145 | function |  | 2 |
| `pointUpDirection` | 25171 | function |  | 2 |
| `curveFrameAtPoint` | 25175 | function |  | 4 |
| `curveFrameAt` | 25196 | function |  | 4 |
| `strandTwistAt` | 25216 | function |  | 6 |
| `controlPointRotationAt` | 25221 | function |  | 4 |
| `strandProfileTwistAt` | 25225 | function |  | 2 |
| `strandFrameAt` | 25231 | function |  | 1 |
| `curveFrameAtSnapshot` | 25237 | function |  | 3 |
| `outwardNormalAtPoint` | 25256 | function |  | 11 |
| `sampledSurfaceNormal` | 25268 | function |  | 2 |
| `guidedNormalAt` | 25284 | function |  | 5 |
| `twistFromHandle` | 25303 | function |  | 3 |
| `signedAngleAroundAxis` | 25324 | function |  | 5 |
| `handleColor` | 25331 | function |  | 2 |
| `isAffectedCurvePoint` | 25354 | function |  | 2 |
| `syncLockFromCurve` | 25360 | function |  | 25 |
| `labelForPreset` | 25390 | function |  | 1 |
| `rebuildLockGeometry` | 25394 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 25421 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 25429 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 25435 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 25457 | function |  | 8 |
| `updateLockGeometry` | 25470 | function |  | 56 |
| `setGroupColorView` | 25491 | function |  | 2 |
| `createUvCheckerTexture` | 25501 | function |  | 3 |
| `ensureUvCheckerForLock` | 25537 | function |  | 4 |
| `removeUvCheckerFromLock` | 25570 | function |  | 3 |
| `invalidateUvInspector` | 25585 | function |  | 7 |
| `uvInspectorRecord` | 25589 | function |  | 1 |
| `uvInspectorRecords` | 25628 | function |  | 2 |
| `drawUvInspectorGrid` | 25632 | function |  | 2 |
| `renderUvInspector` | 25666 | function |  | 3 |
| `setUvCheckerEnabled` | 25725 | function |  | 3 |
| `strandViewportBaseColor` | 25742 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 25777 | function |  | 3 |
| `syncStrandSelectionOutline` | 25783 | function |  | 2 |
| `applyLockedStrandPalette` | 25794 | function |  | 2 |
| `syncLockedStrandWireVisual` | 25803 | function |  | 6 |
| `setStrandSelectionVisual` | 25812 | function |  | 6 |
| `proceduralParentOutlineVisible` | 25828 | function |  | 2 |
| `syncProceduralParentVisibility` | 25835 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 25844 | function |  | 2 |
| `updateStrandSelectionHighlight` | 25848 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 25852 | function |  | 2 |
| `resetGuideSelectionVisuals` | 25865 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 25885 | function |  | 3 |
| `selectLock` | 25918 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 25971 | function |  | 6 |
| `syncGroupInputs` | 25982 | function |  | 2 |
| `topologyStatsForLock` | 26015 | function |  | 4 |
| `formatTopologyStats` | 26023 | function |  | 5 |
| `updateTopologyStats` | 26027 | function |  | 20 |
| `normalizeBraidDimensions` | 26061 | function |  | 3 |
| `normalizeStrandDimensions` | 26074 | function |  | 3 |
| `strandBaseWidth` | 26088 | function |  | 5 |
| `strandWidthDimension` | 26092 | function |  | 5 |
| `strandDepthDimension` | 26100 | function |  | 8 |
| `setStrandWidthDimension` | 26108 | function |  | 2 |
| `setStrandDepthDimension` | 26130 | function |  | 4 |
| `syncShapeDimensionInputs` | 26146 | function |  | 4 |
| `syncCreationShapeInputs` | 26182 | function |  | 3 |
| `syncViewportDrawSettings` | 26220 | function |  | 5 |
| `syncPanelShapeInputs` | 26234 | function |  | 6 |
| `syncStrandSplitInputs` | 26260 | function |  | 4 |
| `syncHairCardControls` | 26269 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 26277 | function |  | 3 |
| `updateAttributeEditorMode` | 26316 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 26466 | function |  | 3 |
| `curveLatticeForGroup` | 26489 | function |  | 2 |
| `filterCurveLatticesToGroup` | 26507 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 26552 | function |  | 2 |
| `showCurveLatticeForGroup` | 26569 | function |  | 2 |
| `selectStrandGroup` | 26606 | function |  | 3 |
| `selectCurvePoint` | 26648 | function |  | 10 |
| `updateSelectedPointLabel` | 26662 | function |  | 14 |
| `syncInputs` | 26675 | function |  | 15 |
| `syncClumpGuidePanel` | 26721 | function |  | 3 |
| `getSelectedLock` | 26748 | function |  | 100 |
| `selectedLocksInOrder` | 26752 | function |  | 37 |
| `lockStrands` | 26758 | function |  | 3 |
| `lockSelectedStrands` | 26791 | function |  | 3 |
| `unlockStrands` | 26797 | function |  | 3 |
| `unlockAllStrands` | 26812 | function |  | 3 |
| `strandEditFamily` | 26816 | function |  | 7 |
| `compatibleSelectedLocks` | 26821 | function |  | 5 |
| `selectedEditRoots` | 26828 | function |  | 2 |
| `editSelectedLocks` | 26841 | function |  | 19 |
| `multiEditValuesEqual` | 26874 | function |  | 2 |
| `setMixedControl` | 26883 | function |  | 28 |
| `syncMultiStrandInputs` | 26900 | function |  | 16 |
| `values` | 26916 | arrow |  | 42 |
| `selectedRebuildableCurves` | 26996 | function |  | 5 |
| `createCompoundStrand` | 27003 | function |  | 1 |
| `refreshRebuildCurveDialog` | 27064 | function |  | 9 |
| `openRebuildCurveDialog` | 27077 | function |  | 1 |
| `rebuildSelectedCurves` | 27091 | function |  | 2 |
| `selectionCanBecomeClump` | 27130 | function |  | 4 |
| `createClumpFromSelection` | 27135 | function |  | 3 |
| `cleanSelectionSets` | 27147 | function |  | 2 |
| `createSelectionSetFromSelection` | 27152 | function |  | 3 |
| `selectionSetById` | 27163 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 27167 | function |  | 7 |
| `editSelectionSetFromSelection` | 27176 | function |  | 5 |
| `deleteSelectionSet` | 27196 | function |  | 2 |
| `selectSelectionSet` | 27205 | function |  | 2 |
| `deleteSelectedStrands` | 27215 | function |  | 4 |
| `deleteGuide` | 27223 | function |  | 3 |
| `deleteSelectedGuide` | 27246 | function |  | 3 |
| `deleteSelectedReferenceImage` | 27250 | function |  | 4 |
| `hasDeletableSelection` | 27263 | function |  | 2 |
| `deleteCurrentSelection` | 27271 | function |  | 3 |
| `hideOutlinerContextMenu` | 27279 | function |  | 17 |
| `outlinerLockTargets` | 27284 | function |  | 3 |
| `showOutlinerContextMenu` | 27311 | function |  | 10 |
| `hideStrandRadialMenu` | 27391 | function |  | 4 |
| `ensureRadialButtonCapacity` | 27402 | function |  | 3 |
| `radialButtonDimensions` | 27415 | function |  | 4 |
| `radialMenuDimensionsForKind` | 27424 | function |  | 3 |
| `applyRadialMenuDimensions` | 27441 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 27447 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 27460 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 27481 | function |  | 2 |
| `selectionSetRadialMenuOption` | 27498 | function |  | 4 |
| `selectedMirrorRadialOptions` | 27507 | function |  | 3 |
| `strandVisibilityRadialOptions` | 27529 | function |  | 5 |
| `clumpMirrorRadialOptions` | 27547 | function |  | 2 |
| `contextualRadialOptions` | 27554 | function |  | 3 |
| `sharedRadialFrameDimensions` | 27683 | function |  | 3 |
| `layoutContextualRadialOptions` | 27687 | function |  | 4 |
| `renderRadialActionList` | 27711 | function |  | 3 |
| `radialListOptionAtPointer` | 27729 | function |  | 3 |
| `syncRadialListHighlight` | 27751 | function |  | 3 |
| `configureContextualRadialMenu` | 27757 | function |  | 3 |
| `beginStrandRadialGesture` | 27817 | function |  | 2 |
| `enterStrandRadialSubmenu` | 27851 | function |  | 2 |
| `updateStrandRadialGesture` | 27897 | function |  | 1 |
| `performStrandRadialAction` | 27936 | function |  | 2 |
| `finishStrandRadialGesture` | 28039 | function |  | 2 |
| `cancelStrandRadialGesture` | 28049 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 28056 | function |  | 1 |
| `setPullMoveEnabled` | 28062 | function |  | 3 |
| `toolRadialOptions` | 28070 | function |  | 2 |
| `hideToolRadialMenu` | 28095 | function |  | 4 |
| `beginToolRadialGesture` | 28108 | function |  | 2 |
| `beginToolShortcutPress` | 28148 | function |  | 2 |
| `finishToolShortcutPress` | 28163 | function |  | 2 |
| `cancelToolShortcutPress` | 28172 | function |  | 5 |
| `setRadialMenusEnabled` | 28180 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 28193 | function |  | 5 |
| `setNavigationTipsEnabled` | 28208 | function |  | 5 |
| `configureNavigationMouseButtons` | 28215 | function |  | 3 |
| `syncNavigationModifierLocks` | 28228 | function |  | 7 |
| `setNavigationStyle` | 28233 | function |  | 5 |
| `applyCameraSmoothingPreference` | 28249 | function |  | 4 |
| `setCameraSmoothingEnabled` | 28264 | function |  | 5 |
| `setCameraSmoothingStrength` | 28270 | function |  | 5 |
| `setScaleSensitivity` | 28278 | function |  | 3 |
| `setToolTipsEnabled` | 28286 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 28293 | function |  | 5 |
| `setViewportStatisticsEnabled` | 28302 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 28310 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 28325 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 28334 | function |  | 5 |
| `sideNamingDisplayId` | 28343 | function |  | 3 |
| `referenceViewDisplayLabel` | 28355 | function |  | 6 |
| `strandRegionDisplayLabel` | 28365 | function |  | 9 |
| `updateSideNamingLabels` | 28383 | function |  | 2 |
| `setSideNamingPerspective` | 28410 | function |  | 5 |
| `setControlPointDisplaySize` | 28419 | function |  | 6 |
| `scaleHexColor` | 28431 | function |  | 3 |
| `setViewportBackgroundColor` | 28436 | function |  | 7 |
| `setDefaultHairShader` | 28458 | function |  | 5 |
| `setPreferenceCategory` | 28464 | function |  | 4 |
| `openPreferencesDialog` | 28491 | function |  | 1 |
| `savePreferencesDialog` | 28519 | function |  | 1 |
| `cancelPreferencesDialog` | 28543 | function |  | 3 |
| `updateToolRadialGesture` | 28572 | function |  | 1 |
| `performToolRadialAction` | 28601 | function |  | 2 |
| `finishToolRadialGesture` | 28611 | function |  | 2 |
| `cancelToolRadialGesture` | 28620 | function |  | 5 |
| `duplicatePlacementTarget` | 28627 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 28654 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 28658 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 28668 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 28673 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 28685 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 28696 | function |  | 7 |
| `openProceduralDuplicateDialog` | 28704 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 28721 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 28742 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 28753 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 28759 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 28765 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 28798 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 28953 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 29055 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 29096 | function |  | 2 |
| `updateDuplicatePlacement` | 29123 | function |  | 2 |
| `beginDuplicatePlacement` | 29187 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 29251 | function |  | 2 |
| `confirmDuplicatePlacement` | 29292 | function |  | 1 |
| `cancelDuplicatePlacement` | 29329 | function |  | 4 |
| `outlinerClumpLocks` | 29355 | function |  | 11 |
| `handleOutlinerClumpDrop` | 29359 | function |  | 3 |
| `createOutlinerStrandButton` | 29382 | function |  | 4 |
| `createOutlinerCurveSurface` | 29468 | function |  | 2 |
| `createOutlinerClump` | 29564 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 29646 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 29653 | function |  | 2 |
| `renderLockList` | 29732 | function |  | 70 |
| `updateCount` | 29886 | function |  | 34 |
| `captureInputUndo` | 29895 | function |  | 1 |
| `bindUndoCapture` | 29901 | function |  | 36 |
| `bindLockInput` | 29912 | function |  | 2 |
| `applyValue` | 29929 | arrow |  | 2 |
| `applyUniformTransformScale` | 30248 | function |  | 2 |
| `applyReducedTransformScale` | 30265 | function |  | 2 |
| `applyTransformPrecision` | 30304 | function |  | 2 |
| `updateTransformScalePointer` | 30333 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 30654 | function |  | 3 |
| `finishTaperCurveDrag` | 30716 | function |  | 1 |
| `beginTaperMeshPointDrag` | 30759 | function |  | 1 |
| `updateTaperMeshPointDrag` | 30840 | function |  | 1 |
| `finishTaperMeshPointDrag` | 30895 | function |  | 6 |
| `updateSelectedTaperPoint` | 30919 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 31489 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 31494 | function |  | 4 |
| `syncDrawCurlControls` | 31549 | function |  | 5 |
| `handleLiveSurfaceChange` | 31597 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 31679 | function |  | 3 |
| `resampleSurfaceLock` | 31694 | function |  | 2 |
| `changePanelSplitCount` | 31807 | function |  | 3 |
| `applyPresetControl` | 31915 | function |  | 2 |
| `applyCreationToolSettings` | 31936 | function |  | 2 |
| `populateCreationPresetSelect` | 31980 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 32004 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 32037 | function |  | 5 |
| `createCustomCreationPreset` | 32045 | function |  | 3 |
| `createCustomClumpPreset` | 32060 | function |  | 3 |
| `commitCustomCreationPreset` | 32075 | function |  | 2 |
| `openRemoveCreationPreset` | 32136 | function |  | 3 |
| `commitRemoveCreationPreset` | 32149 | function |  | 1 |
| `applyBraidToolPreset` | 32166 | function |  | 2 |
| `selectedBranchChildLock` | 32278 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 32282 | function |  | 2 |
| `initPanelResizeHandles` | 32388 | function |  | 2 |
| `applyWidth` | 32394 | arrow |  | 2 |
| `restoreWidth` | 32401 | arrow |  | 2 |
| `bindResize` | 32409 | arrow |  | 2 |
| `onMove` | 32418 | arrow |  | 0 |
| `onUp` | 32422 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 32439 | function |  | 2 |
| `initFloatingPanelControls` | 32448 | function |  | 2 |
| `detach` | 32457 | arrow |  | 43 |
| `endDrag` | 32495 | arrow |  | 0 |
| `endResize` | 32527 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 32538 | function |  | 3 |
| `selectPatchNotesVersion` | 32672 | function |  | 3 |
| `requestReferenceImage` | 32705 | function |  | 5 |
| `toggleCapsuleGuideTool` | 32909 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 32915 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 32922 | function |  | 1 |
| `deleteLocks` | 33489 | function |  | 10 |
| `disposeCurveObjects` | 33567 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 33619 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 33650 | function |  | 1 |
| `endPanelSplitHandleDrag` | 33725 | function |  | 2 |
| `resize` | 33758 | function |  | 3 |
| `handleViewportPointerMove` | 33769 | function |  | 1 |
| `blockProportionalSizingEvent` | 33780 | function |  | 1 |
| `updateLightAngleFromInputs` | 33786 | function |  | 2 |
| `startViewSnap` | 33800 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 33830 | function |  | 3 |
| `trackViewportPointerDown` | 33847 | function |  | 1 |
| `trackViewportPointerMove` | 33863 | function |  | 1 |
| `clearViewportPointer` | 33871 | function |  | 1 |
| `updateViewSnap` | 33876 | function |  | 1 |
| `nearestCardinalAxis` | 33912 | function |  | 5 |
| `cardinalAxisKey` | 33926 | function |  | 5 |
| `steppedDragAmount` | 33930 | function |  | 3 |
| `snapCameraToCardinalAxis` | 33936 | function |  | 4 |
| `endViewSnap` | 33952 | function |  | 4 |
| `activateStrandControlPoint` | 33962 | function |  | 4 |
| `refreshStrandControlPointSelection` | 34012 | function |  | 4 |
| `addStrandControlPointSelection` | 34039 | function |  | 3 |
| `removeStrandControlPointSelection` | 34056 | function |  | 3 |
| `sampleStrandPointNormal` | 34070 | function |  | 2 |
| `sampleStrandPointVectors` | 34080 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 34086 | function |  | 2 |
| `resampleStrandCurveData` | 34097 | function |  | 4 |
| `resampleMatchingVectors` | 34103 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 34142 | function |  | 4 |
| `removeStrandCurvePoint` | 34153 | function |  | 2 |
| `closestStrandCurveParameter` | 34166 | function |  | 2 |
| `insertStrandCurvePoint` | 34195 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 34212 | function |  | 2 |
| `selectionModifierCursorAvailable` | 34222 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 34238 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 34245 | function |  | 4 |
| `prepareCurvePointSelection` | 34267 | function |  | 1 |
| `finishCurvePointInsertion` | 34378 | function |  | 1 |
| `finishPointRemoval` | 34393 | function |  | 1 |
| `editableStrandWidth` | 34411 | function |  | 6 |
| `editableStrandWidthBounds` | 34423 | function |  | 2 |
| `applyEditableStrandWidth` | 34429 | function |  | 3 |
| `viewportPixelPoint` | 34465 | function |  | 3 |
| `syncSculptBrushControls` | 34473 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 34488 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 34496 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 34504 | function |  | 1 |
| `sculptBrushPlaneOffset` | 34510 | function |  | 5 |
| `setSculptBrushCursorVisible` | 34514 | function |  | 7 |
| `updateSculptBrushCursor` | 34521 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 34543 | function |  | 4 |
| `sculptBrushEditableLock` | 34550 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 34560 | function |  | 5 |
| `sculptBrushLockViable` | 34566 | function |  | 5 |
| `sculptBrushUnits` | 34577 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 34615 | function |  | 4 |
| `sculptBrushPointWeight` | 34665 | function |  | 5 |
| `sculptBrushWorldDelta` | 34675 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 34684 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 34710 | function |  | 2 |
| `beginSculptMoveStroke` | 34768 | function |  | 1 |
| `applySculptMoveStrokeSample` | 34830 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 35065 | function |  | 3 |
| `updateSculptMoveStroke` | 35074 | function |  | 1 |
| `finishSculptMoveStroke` | 35090 | function |  | 3 |
| `strandControlPointHit` | 35138 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 35142 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 35220 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 35254 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 35294 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 35307 | function |  | 1 |
| `setHoveredControlPoint` | 35346 | function |  | 7 |
| `visibleControlPointHoverTargets` | 35359 | function |  | 2 |
| `updateControlPointHover` | 35395 | function |  | 1 |
| `animate` | 35951 | function |  | 2 |
| `syncCompactSidebarLayout` | 35982 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 36001 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 36007 | function |  | 3 |
| `setAttributeEditorTab` | 36013 | function |  | 6 |

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

## modules/geometry/branch-hierarchy.js（119 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchHierarchyApi` | 6 | function | export | 2 |
| `attachDrawnLocksAsBranches` | 12 | function |  | 1 |
| `branchChildrenFor` | 33 | function |  | 2 |
| `detachBranch` | 37 | function |  | 1 |
| `updateBranchChildren` | 48 | function |  | 3 |
| `canBranchDrawFromLock` | 91 | function |  | 3 |
| `selectedDrawBranchPoint` | 98 | function |  | 1 |

## modules/geometry/branch-region-panel.js（787 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clampRegionParam` | 15 | function | export | 107 |
| `createBranchRegionApi` | 19 | function | export | 2 |
| `syncBranchRootRegionOffsets` | 27 | function |  | 6 |
| `updateBranchRootRegionCenter` | 52 | function |  | 1 |
| `branchRootRegionFromParam` | 95 | function |  | 1 |
| `cloneBranchRootRegion` | 118 | function |  | 1 |
| `flip` | 120 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 146 | function |  | 7 |
| `setBranchRootRegionPoint` | 177 | function |  | 2 |
| `branchRegionUVToCanvas` | 210 | function |  | 10 |
| `branchRegionCanvasToUV` | 214 | function |  | 4 |
| `openBranchRegionEditor` | 221 | function |  | 2 |
| `closeBranchRegionEditor` | 236 | function |  | 2 |
| `retargetBranchRegionEditor` | 243 | function |  | 1 |
| `renderBranchRegionEditor` | 249 | function |  | 8 |
| `applyBranchRegionView` | 333 | function |  | 6 |
| `resetBranchRegionZoom` | 337 | function |  | 1 |
| `branchRegionNavAction` | 342 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 357 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 378 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 383 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 410 | function |  | 2 |
| `endBranchRegionCanvasNav` | 423 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 429 | function |  | 1 |
| `branchRegionEventUV` | 450 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 458 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 564 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 698 | function |  | 1 |
| `beginBranchSweepStartDrag` | 704 | function |  | 1 |
| `updateBranchSweepStartDrag` | 721 | function |  | 1 |
| `endBranchSweepStartDrag` | 745 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 751 | function |  | 4 |

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
