# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1713** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38786 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 243 | function |  | 3 |
| `saveBooleanPreference` | 271 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 275 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 280 | function |  | 2 |
| `normalizeScaleSensitivity` | 285 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 290 | function |  | 2 |
| `normalizeSideNamingPerspective` | 295 | function |  | 2 |
| `normalizeNavigationStyle` | 299 | function |  | 2 |
| `setupEditableSliderControls` | 313 | function |  | 2 |
| `syncNumberFromRange` | 364 | arrow |  | 0 |
| `applyNumberValue` | 371 | arrow |  | 0 |
| `copyCameraPose` | 481 | function |  | 3 |
| `updateCameraProjectionForViewport` | 487 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 500 | function |  | 3 |
| `setOrthographicView` | 506 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 546 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 575 | function |  | 2 |
| `removeRotateFreeAxisRing` | 601 | function |  | 2 |
| `deflateTransformGizmoPickers` | 613 | function |  | 2 |
| `nextStrandName` | 996 | function |  | 2 |
| `activeDrawClumpTemplate` | 1081 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1086 | function |  | 3 |
| `drawModeCreatesClump` | 1113 | function |  | 1 |
| `isPanelGeometry` | 1257 | function |  | 31 |
| `normalizePanelSplits` | 1261 | function |  | 3 |
| `clonePanelSplits` | 1273 | function |  | 19 |
| `snapPanelSplitHeight` | 1277 | function |  | 5 |
| `createQuadSphereGeometry` | 1312 | function |  | 2 |
| `vertexIndex` | 1326 | function |  | 11 |
| `addEdge` | 1344 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1379 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1449 | function |  | 3 |
| `updateScalpRenderGeometry` | 1476 | function |  | 4 |
| `writeScalpRegionColors` | 1527 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1540 | function |  | 2 |
| `createScalpSelectionOutline` | 1570 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1622 | function |  | 25 |
| `activeScalpSurfaceWire` | 1627 | function |  | 2 |
| `activeScalpSelectionOutline` | 1632 | function |  | 2 |
| `inferredCustomScalpRegion` | 1637 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1644 | function |  | 5 |
| `customScalpGeometryFromObject` | 1663 | function |  | 2 |
| `customScalpWireGeometry` | 1695 | function |  | 3 |
| `installCustomScalpGeometry` | 1706 | function |  | 3 |
| `installCustomScalpGuide` | 1730 | function |  | 3 |
| `setScalpGuideSource` | 1748 | function |  | 7 |
| `updateScalpQuadWire` | 1764 | function |  | 4 |
| `updateScalpTopology` | 1780 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1844 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2024 | function |  | 2 |
| `currentStrandSelectionState` | 2100 | function |  | 4 |
| `applyStrandSelectionState` | 2104 | function |  | 5 |
| `clearStrandSelectionState` | 2109 | function |  | 7 |
| `guideHeadBounds` | 3238 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3248 | function |  | 5 |
| `disposeGuideModel` | 3262 | function |  | 3 |
| `syncHeadTransformInputs` | 3273 | function |  | 4 |
| `applyHeadTransform` | 3280 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3298 | function |  | 4 |
| `applyScalpRoughScale` | 3307 | function |  | 5 |
| `resetHeadTransform` | 3321 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3335 | function |  | 2 |
| `installGuideModel` | 3351 | function |  | 5 |
| `loadDefaultGuideModel` | 3427 | function |  | 3 |
| `braidTemplateFromEntries` | 3450 | function |  | 4 |
| `braidMeshEntries` | 3482 | function |  | 2 |
| `prepareBraidBodyCache` | 3494 | function |  | 2 |
| `quantize` | 3503 | arrow |  | 21 |
| `sourceNormalAt` | 3515 | arrow |  | 1 |
| `clusterBoundary` | 3518 | arrow |  | 2 |
| `normalBuckets` | 3535 | arrow |  | 2 |
| `applyBucketPair` | 3567 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3598 | function |  | 2 |
| `annotateBraidObjTopology` | 3619 | function |  | 2 |
| `loadBraidMeshPreset` | 3639 | function |  | 3 |
| `createSplitControlHandle` | 3656 | function |  | 4 |
| `frameGuideModel` | 3671 | function |  | 2 |
| `syncScalpInputs` | 3696 | function |  | 2 |
| `syncScalpArtistInputs` | 3702 | function |  | 2 |
| `rootScalpOffsetDistance` | 3710 | function |  | 15 |
| `applyLockRootScalpOffset` | 3715 | function |  | 5 |
| `normalizeHairLayer` | 3731 | function |  | 28 |
| `layerOffsetForLock` | 3735 | function |  | 9 |
| `layerRootOffsetFactor` | 3740 | function |  | 13 |
| `layerOffsetWeight` | 3744 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3750 | function |  | 5 |
| `pointsWithLayerOffset` | 3759 | function |  | 3 |
| `layerDirectionForLock` | 3767 | function |  | 2 |
| `applyLayerOffset` | 3778 | function |  | 5 |
| `setLockHairLayer` | 3802 | function |  | 2 |
| `setGroupLayerOffset` | 3817 | function |  | 2 |
| `scalpArtistWeight` | 3829 | function |  | 3 |
| `scalpArtistScalesAt` | 3833 | function |  | 3 |
| `applyScalpArtistShape` | 3843 | function |  | 5 |
| `inverseScalpArtistShape` | 3861 | function |  | 2 |
| `updateScalpSurface` | 3888 | function |  | 3 |
| `setActiveScalpRegion` | 3898 | function |  | 2 |
| `clearScalpRegions` | 3910 | function |  | 2 |
| `scalpHitFromEvent` | 3927 | function |  | 3 |
| `updateScalpBrushCursor` | 3935 | function |  | 4 |
| `paintScalpAt` | 3950 | function |  | 3 |
| `beginScalpPaint` | 4017 | function |  | 2 |
| `updateScalpPaint` | 4026 | function |  | 1 |
| `endScalpPaint` | 4035 | function |  | 2 |
| `createScalpLattice` | 4042 | function |  | 2 |
| `resetScalpLattice` | 4067 | function |  | 1 |
| `updateScalpLatticeObjects` | 4079 | function |  | 7 |
| `quadraticWeights` | 4093 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4098 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4125 | function |  | 3 |
| `selectScalpLatticePoint` | 4140 | function |  | 2 |
| `beginScalpLatticeDrag` | 4155 | function |  | 2 |
| `updateScalpLatticeDrag` | 4173 | function |  | 1 |
| `endScalpLatticeDrag` | 4191 | function |  | 2 |
| `setHeadReferenceTransparency` | 4197 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4207 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4225 | function |  | 3 |
| `trianglePlaneIntersections` | 4233 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4254 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4280 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4290 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4302 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4326 | function |  | 3 |
| `createScalpBuilderPlanes` | 4341 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4373 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4412 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4435 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4447 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4459 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4464 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4476 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4586 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4611 | function |  | 5 |
| `syncEditedScalpSurface` | 4626 | function |  | 4 |
| `ensureEditedScalpSurface` | 4697 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4727 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4812 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4825 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4841 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4851 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4869 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4882 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4889 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4908 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4922 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4963 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4972 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4985 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 5006 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5143 | function |  | 2 |
| `scalpTemplateNeighbors` | 5151 | function |  | 2 |
| `smoothScalpVectorField` | 5163 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5177 | function |  | 2 |
| `upperContourCurve` | 5194 | function |  | 4 |
| `hermitePoint` | 5229 | function |  | 2 |
| `curveNetworkSection` | 5240 | function |  | 3 |
| `pointAlongSection` | 5269 | function |  | 3 |
| `longestStitchedContour` | 5275 | function |  | 2 |
| `nodeForPoint` | 5283 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5340 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5350 | function |  | 1 |
| `orderedRange` | 5362 | arrow |  | 3 |
| `clipSegment` | 5385 | arrow |  | 1 |
| `liftedPoint` | 5408 | arrow |  | 5 |
| `boundaryCorner` | 5413 | arrow |  | 4 |
| `surfaceCurveBetween` | 5422 | arrow |  | 1 |
| `addSurfaceConnector` | 5445 | arrow |  | 2 |
| `sideContourAtDepth` | 5513 | arrow |  | 3 |
| `addSurfacePatch` | 5547 | arrow |  | 1 |
| `addCenterBridgePatch` | 5627 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5735 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5770 | function |  | 1 |
| `generatedScalpObjContent` | 5860 | function |  | 2 |
| `generateScalpFromBuilder` | 5874 | function |  | 1 |
| `orderedDepthRange` | 5910 | arrow |  | 7 |
| `resetScalpBuilder` | 6039 | function |  | 1 |
| `confirmScalpBuilderPlane` | 6054 | function |  | 1 |
| `beginScalpBuilderInput` | 6068 | function |  | 2 |
| `updateScalpBuilderStroke` | 6069 | function |  | 1 |
| `finishScalpBuilderStroke` | 6070 | function |  | 2 |
| `setScalpBuilderEditing` | 6072 | function |  | 10 |
| `updateScalpEditingVisibility` | 6106 | function |  | 12 |
| `exitSetupEditors` | 6200 | function |  | 7 |
| `setCapsuleGuideEditing` | 6209 | function |  | 5 |
| `syncAppMenuVisibility` | 6237 | function |  | 3 |
| `closeAppMenus` | 6242 | function |  | 6 |
| `setAppMenuOpen` | 6253 | function |  | 3 |
| `setTurntableActive` | 6260 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6269 | function |  | 9 |
| `selectedReferenceImage` | 6273 | function |  | 20 |
| `normalizeReferenceCrop` | 6279 | function |  | 8 |
| `referenceCropIsFull` | 6287 | function |  | 3 |
| `referencePlaneFrontAxis` | 6292 | function |  | 4 |
| `referencePlanePlacement` | 6301 | function |  | 4 |
| `migratedReferencePlanePosition` | 6316 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6336 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6353 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6369 | function |  | 2 |
| `snappedReferenceImageView` | 6392 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6398 | function |  | 5 |
| `applyReferenceImageRuntime` | 6414 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6457 | function |  | 6 |
| `createReferenceImageRuntime` | 6465 | function |  | 3 |
| `addReferenceImage` | 6534 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6586 | function |  | 3 |
| `disposeReferenceImage` | 6605 | function |  | 2 |
| `clearReferenceImages` | 6609 | function |  | 2 |
| `serializeReferenceImage` | 6616 | function |  | 1 |
| `setReferenceImageType` | 6644 | function |  | 2 |
| `attachReferenceImageTransform` | 6688 | function |  | 6 |
| `selectReferenceImage` | 6702 | function |  | 12 |
| `placeReferencePlane` | 6725 | function |  | 2 |
| `setReferencePlaneInFront` | 6736 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6746 | function |  | 4 |
| `renderReferenceImagePanel` | 6765 | function |  | 20 |
| `setOutlinerTab` | 6812 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6830 | function |  | 4 |
| `componentEditModeActive` | 6834 | function |  | 38 |
| `selectionToolSupportsPicking` | 6838 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6843 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6859 | function |  | 2 |
| `setViewportSelectionMode` | 6889 | function |  | 4 |
| `setViewportEditMode` | 6901 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6943 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6957 | function |  | 8 |
| `outlinerGuides` | 6969 | function |  | 3 |
| `guideOutlinerLabel` | 6976 | function |  | 2 |
| `normalizeOutlinerName` | 6986 | function |  | 4 |
| `beginOutlinerRename` | 6991 | function |  | 2 |
| `finish` | 7002 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 7032 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 7042 | function |  | 2 |
| `renderGuideOutliner` | 7077 | function |  | 10 |
| `referenceOutlinerGroup` | 7135 | function |  | 2 |
| `renderReferenceOutliner` | 7139 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7256 | function |  | 5 |
| `readReferenceImageFile` | 7261 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7285 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7292 | function |  | 3 |
| `dragContainsReferenceImage` | 7337 | function |  | 3 |
| `setReferenceImageDragActive` | 7348 | function |  | 9 |
| `referenceDropDestination` | 7356 | function |  | 2 |
| `viewportOverlayDropPosition` | 7362 | function |  | 2 |
| `setReferenceDropHover` | 7371 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7389 | function |  | 2 |
| `referenceOverlayAtPointer` | 7409 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7427 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7440 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7486 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7536 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7558 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7569 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7595 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7604 | function |  | 2 |
| `referenceCropCursor` | 7619 | function |  | 3 |
| `updateReferenceCropHandles` | 7625 | function |  | 5 |
| `referenceCropSourcePoint` | 7646 | function |  | 2 |
| `beginReferenceCrop` | 7653 | function |  | 1 |
| `updateReferenceCrop` | 7691 | function |  | 1 |
| `finishReferenceCrop` | 7723 | function |  | 4 |
| `setHeadSetupEditing` | 7741 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7757 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7766 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7776 | function |  | 4 |
| `setScalpGuideVisibility` | 7782 | function |  | 12 |
| `currentGuideViewMode` | 7790 | function |  | 3 |
| `updateGuideViewToggle` | 7798 | function |  | 5 |
| `setGuideViewMode` | 7814 | function |  | 3 |
| `cycleGuideViewMode` | 7825 | function |  | 1 |
| `hideGuideViewContextMenu` | 7830 | function |  | 6 |
| `showGuideViewContextMenu` | 7834 | function |  | 1 |
| `strandPassesDisplayFilters` | 7847 | function |  | 4 |
| `strandVisibleForDisplay` | 7856 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7861 | function |  | 2 |
| `lockedStrandsExist` | 7865 | function |  | 3 |
| `hiddenStrandsExist` | 7869 | function |  | 2 |
| `hideSelectedStrands` | 7873 | function |  | 2 |
| `unhideHiddenStrands` | 7883 | function |  | 2 |
| `strandIsolationActive` | 7892 | function |  | 7 |
| `setStrandIsolation` | 7896 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7908 | function |  | 3 |
| `syncVisibilityParent` | 7919 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7926 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7955 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7962 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7982 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 8005 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 8013 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 8020 | function |  | 9 |
| `setScalpLatticeEditing` | 8031 | function |  | 4 |
| `setScalpShapeEditing` | 8046 | function |  | 9 |
| `setScalpPaintEditing` | 8064 | function |  | 7 |
| `defaultCurveLatticePoints` | 8088 | function |  | 3 |
| `flatCurveLatticePoints` | 8114 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8123 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8147 | function |  | 4 |
| `horizontalValue` | 8152 | arrow |  | 1 |
| `blendedSample` | 8163 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8196 | function |  | 2 |
| `curveLatticeControlPoint` | 8211 | function |  | 9 |
| `circularArcTangent` | 8215 | function |  | 4 |
| `arcLengthTo` | 8246 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8258 | function |  | 3 |
| `sampleHermiteCurve` | 8297 | function |  | 10 |
| `sampleCurveLattice` | 8314 | function |  | 6 |
| `curveLatticeNormal` | 8333 | function |  | 1 |
| `createCurveLatticeGeometry` | 8344 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8373 | function |  | 3 |
| `appendCurve` | 8375 | arrow |  | 4 |
| `sample` | 8377 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8404 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8420 | function |  | 3 |
| `addPicker` | 8422 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8461 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8474 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8478 | function |  | 3 |
| `curveLatticeEditablePoint` | 8496 | function |  | 13 |
| `curveLatticePointSection` | 8503 | function |  | 3 |
| `curveLatticeRestPoint` | 8514 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8520 | function |  | 7 |
| `curveLatticeRootColumns` | 8526 | function |  | 3 |
| `curveTangentsForPoints` | 8533 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8545 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8582 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8608 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8625 | function |  | 3 |
| `resampleGrid` | 8635 | arrow |  | 2 |
| `controlPointIsSelected` | 8662 | function |  | 7 |
| `clearMultiPointSelection` | 8670 | function |  | 9 |
| `createCurveLatticeHandles` | 8674 | function |  | 4 |
| `addCurveLattice` | 8696 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8805 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8836 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8842 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8881 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8902 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8919 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8928 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8935 | function |  | 1 |
| `selectCurveLatticeLoop` | 8954 | function |  | 3 |
| `selectCurveLatticePoint` | 8983 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8998 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 9040 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9061 | function |  | 3 |
| `curveLatticeColumnPoints` | 9104 | function |  | 3 |
| `groupCurveControlIndices` | 9113 | function |  | 4 |
| `groupCurveControlPoints` | 9119 | function |  | 2 |
| `updateGroupCurveDisplay` | 9125 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9135 | function |  | 2 |
| `groupCurveDeformationPairs` | 9157 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9164 | function |  | 2 |
| `appendPairs` | 9166 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9177 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9196 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9217 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9236 | function |  | 2 |
| `capsuleGuideCapHeight` | 9270 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9274 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9279 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9283 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9295 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9311 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9317 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9343 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9373 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9427 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9448 | function |  | 7 |
| `vertex` | 9462 | function |  | 4 |
| `addFace` | 9468 | function |  | 3 |
| `addRing` | 9486 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9541 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9551 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9616 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9662 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9675 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9696 | function |  | 3 |
| `capsuleGuidePointDistances` | 9701 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9722 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9742 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9747 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9753 | function |  | 3 |
| `capsuleGuideAccentColor` | 9758 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9763 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9774 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9786 | function |  | 2 |
| `createCapsuleGuideHandles` | 9818 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9841 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9860 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9867 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9883 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9900 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9915 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9952 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9968 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9985 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9991 | function |  | 3 |
| `selectCapsuleGuideLoop` | 10018 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 10030 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 10049 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10094 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10129 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10143 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10149 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10166 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10177 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10188 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10218 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10228 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10269 | function |  | 3 |
| `createQuadCageGeometry` | 10285 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10309 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10329 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10340 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10393 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10431 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10441 | function |  | 4 |
| `addCapsuleGuide` | 10449 | function |  | 4 |
| `addGuide` | 10518 | function |  | 1 |
| `createGuideGeometry` | 10579 | function |  | 4 |
| `selectGuide` | 10634 | function |  | 17 |
| `updateGuideControlsVisibility` | 10702 | function |  | 10 |
| `updateViewportToolVisibility` | 10719 | function |  | 7 |
| `getSelectedGuide` | 10758 | function |  | 34 |
| `selectedViewportFocusBounds` | 10762 | function |  | 2 |
| `frameViewportBounds` | 10776 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10806 | function |  | 2 |
| `fullSceneFocusBounds` | 10810 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10827 | function |  | 3 |
| `cycleViewportFraming` | 10836 | function |  | 2 |
| `syncGuideInputs` | 10854 | function |  | 5 |
| `updateGuideGeometry` | 10897 | function |  | 3 |
| `sculptBrushToolActive` | 10918 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10922 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10926 | function |  | 3 |
| `effectiveSculptBrushTool` | 10930 | function |  | 13 |
| `updateSculptScaleModeRow` | 10936 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10941 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10963 | function |  | 5 |
| `setActiveTool` | 10972 | function |  | 19 |
| `setDrawStrandMode` | 11110 | function |  | 2 |
| `setObjectSpaceEditing` | 11120 | function |  | 7 |
| `setHierarchyEditing` | 11136 | function |  | 4 |
| `setProportionalEditing` | 11148 | function |  | 5 |
| `beginProportionalSizeEdit` | 11167 | function |  | 3 |
| `updateProportionalSizeEdit` | 11179 | function |  | 2 |
| `endProportionalSizeEdit` | 11190 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11197 | function |  | 2 |
| `refreshProportionalPreview` | 11205 | function |  | 4 |
| `activeBrushSizeInput` | 11215 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11224 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11236 | function |  | 2 |
| `beginBrushSizeDrag` | 11254 | function |  | 1 |
| `updateBrushSizeDrag` | 11281 | function |  | 1 |
| `finishBrushSizeDrag` | 11302 | function |  | 2 |
| `updateInteractionLocks` | 11319 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11328 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11337 | function |  | 2 |
| `configureTransformControls` | 11368 | function |  | 16 |
| `pullMoveActive` | 11376 | function |  | 9 |
| `updatePullGuideVisual` | 11380 | function |  | 4 |
| `attachTransformForCurvePoint` | 11396 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11420 | function |  | 7 |
| `strandObjectRootIndex` | 11436 | function |  | 3 |
| `strandObjectRoot` | 11445 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11449 | function |  | 2 |
| `attachStrandObjectTransform` | 11454 | function |  | 6 |
| `guideObjectPivot` | 11477 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11488 | function |  | 2 |
| `attachGuideObjectTransform` | 11493 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11512 | function |  | 2 |
| `beginGuideObjectTransform` | 11540 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11547 | function |  | 2 |
| `updateGuideObjectTransform` | 11569 | function |  | 2 |
| `finishGuideObjectTransform` | 11602 | function |  | 2 |
| `clonePlacementFrame` | 11611 | function |  | 2 |
| `cloneOptionalVectors` | 11623 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11627 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11644 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11659 | function |  | 2 |
| `strandObjectTransformOperators` | 11675 | function |  | 4 |
| `transformPoint` | 11683 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11690 | arrow |  | 0 |
| `transformNormal` | 11696 | arrow |  | 10 |
| `transformDirection` | 11706 | arrow |  | 7 |
| `worldMatrixForPivot` | 11718 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11724 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11740 | function |  | 6 |
| `beginStrandObjectTransform` | 11754 | function |  | 2 |
| `updateStrandObjectTransform` | 11792 | function |  | 2 |
| `commitStrandObjectTransform` | 11841 | function |  | 2 |
| `mapPoints` | 11854 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11888 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11902 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11925 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11938 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11953 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11979 | function |  | 2 |
| `finishSurfaceObjectTransform` | 12028 | function |  | 2 |
| `beginHandleEdit` | 12037 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12086 | function |  | 3 |
| `applyBranchRigidRootMove` | 12103 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12140 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12151 | function |  | 3 |
| `multiPointHandleEditActive` | 12162 | function |  | 7 |
| `applyMultiMove` | 12166 | function |  | 5 |
| `applyMultiRotate` | 12172 | function |  | 2 |
| `applyMultiScale` | 12181 | function |  | 2 |
| `applyHierarchicalMove` | 12190 | function |  | 3 |
| `applySingleMove` | 12202 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12206 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12223 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12232 | function |  | 3 |
| `changed` | 12242 | arrow |  | 1 |
| `applyPullMove` | 12284 | function |  | 3 |
| `pullHeadCollisionContext` | 12292 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12311 | function |  | 2 |
| `applyProportionalMove` | 12334 | function |  | 3 |
| `viewPlaneNormal` | 12345 | function |  | 20 |
| `isCameraInSnappedView` | 12349 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12357 | function |  | 10 |
| `updateViewPlaneGrid` | 12361 | function |  | 14 |
| `setViewPlaneMove` | 12418 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12429 | function |  | 2 |
| `rayFromViewportEvent` | 12437 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12445 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12455 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12466 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12479 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12498 | function |  | 4 |
| `beginViewPlaneMove` | 12505 | function |  | 3 |
| `updateViewPlaneMove` | 12569 | function |  | 1 |
| `endViewPlaneMove` | 12634 | function |  | 7 |
| `applyHierarchicalRotate` | 12653 | function |  | 2 |
| `rotateGuideNormal` | 12660 | arrow |  | 4 |
| `applySingleRotate` | 12698 | function |  | 2 |
| `applyProportionalRotate` | 12702 | function |  | 2 |
| `applyHierarchicalScale` | 12722 | function |  | 2 |
| `applySingleScale` | 12732 | function |  | 2 |
| `applyProportionalScale` | 12736 | function |  | 2 |
| `setPointScale` | 12752 | function |  | 8 |
| `proportionalWeight` | 12761 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12773 | function |  | 5 |
| `strandInfluenceColor` | 12779 | function |  | 17 |
| `beginRelaxEdit` | 12804 | function |  | 3 |
| `updateRelaxEdit` | 12833 | function |  | 1 |
| `endRelaxEdit` | 12893 | function |  | 1 |
| `disposeGuide` | 12903 | function |  | 3 |
| `removeGuideObjects` | 12931 | function |  | 3 |
| `strandRadiusAt` | 12945 | function |  | 5 |
| `strandProfileTopologyAt` | 12962 | function |  | 8 |
| `strandCurveParameters` | 13004 | function |  | 5 |
| `widthProfileAt` | 13014 | arrow |  | 1 |
| `braidFrameAt` | 13052 | function |  | 5 |
| `braidFrameAtExtended` | 13062 | function |  | 2 |
| `createBraidProfileProjector` | 13071 | function |  | 2 |
| `project` | 13087 | arrow |  | 17 |
| `createBraidGeometry` | 13102 | function |  | 2 |
| `deformationAt` | 13137 | function |  | 3 |
| `widthFor` | 13146 | arrow |  | 3 |
| `depthFor` | 13150 | arrow |  | 3 |
| `outputVertex` | 13182 | function |  | 7 |
| `appendAuthoredCap` | 13290 | function |  | 3 |
| `outputCapVertex` | 13297 | arrow |  | 6 |
| `capBoundary` | 13388 | function |  | 3 |
| `strandGeometryCurve` | 13450 | function |  | 15 |
| `strandGeometryFrameAt` | 13476 | function |  | 19 |
| `transportedStrandFrameAt` | 13539 | function |  | 7 |
| `twistOverrideAt` | 13542 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13570 | function |  | 2 |
| `weldPanelGeometryData` | 13606 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13646 | function |  | 3 |
| `surfacePanelPoint` | 13661 | function |  | 3 |
| `createPanelStrandGeometry` | 13684 | function |  | 2 |
| `addQuad` | 13718 | arrow |  | 6 |
| `near` | 13722 | arrow |  | 6 |
| `panelWidthAt` | 13752 | arrow |  | 6 |
| `panelThicknessAt` | 13761 | arrow |  | 6 |
| `panelFrameAt` | 13770 | arrow |  | 1 |
| `rawPanelPoint` | 13788 | arrow |  | 1 |
| `panelPoint` | 13808 | arrow |  | 2 |
| `addPatch` | 13814 | arrow |  | 1 |
| `splitOpening` | 13865 | arrow |  | 2 |
| `uStart` | 13889 | arrow |  | 1 |
| `uEnd` | 13892 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13930 | function |  | 3 |
| `inside` | 13931 | arrow |  | 2 |
| `pushOrientedTriangle` | 13953 | function |  | 7 |
| `triangulatePolygon3D` | 13964 | function |  | 1 |
| `orientedQuadFace` | 14004 | function |  | 2 |
| `createSplitStrandGeometry` | 14012 | function |  | 2 |
| `fusedIndexAt` | 14169 | arrow |  | 0 |
| `createHairCardGeometry` | 14218 | function |  | 2 |
| `createPolyGeometry` | 14317 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14344 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14353 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14400 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14408 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14424 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14433 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14444 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14452 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14462 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14482 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14505 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14584 | function |  | 2 |
| `pushBoundary` | 14613 | arrow |  | 5 |
| `boundaryAt` | 14631 | arrow |  | 3 |
| `hermite` | 14653 | arrow |  | 2 |
| `emitBottomMidRow` | 14698 | arrow |  | 2 |
| `emitTopMidRow` | 14797 | arrow |  | 2 |
| `sideHoleVertex` | 14839 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14888 | arrow |  | 2 |
| `emitFillStrip` | 14959 | arrow |  | 2 |
| `fillSide` | 14970 | arrow |  | 0 |
| `directBridgeQuadIndex` | 15014 | arrow |  | 2 |
| `edgeDirection` | 15038 | arrow |  | 1 |
| `positionAt` | 15097 | arrow |  | 1 |
| `createBranchChildGeometry` | 15148 | function |  | 2 |
| `createCompoundStrandGeometry` | 15358 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15609 | function |  | 2 |
| `createHairGeometry` | 15640 | function |  | 6 |
| `createBaseHairGeometry` | 15692 | function |  | 3 |
| `hairMaterialDefinition` | 15810 | function |  | 4 |
| `materialForLock` | 15814 | function |  | 8 |
| `activeHairMaterialDefinition` | 15818 | function |  | 11 |
| `strandDisplayColor` | 15824 | function |  | 14 |
| `setAnimeHairBaseColor` | 15842 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15855 | function |  | 2 |
| `createHairMaterial` | 15895 | function |  | 5 |
| `createStrandSelectionOutline` | 15937 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15971 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15980 | function |  | 6 |
| `refreshMaterialUsers` | 16007 | function |  | 6 |
| `renderHairMaterialOutliner` | 16016 | function |  | 5 |
| `renderHairMaterialOptions` | 16046 | function |  | 3 |
| `syncHairMaterialEditor` | 16056 | function |  | 9 |
| `createProjectHairMaterial` | 16082 | function |  | 3 |
| `deleteActiveHairMaterial` | 16102 | function |  | 2 |
| `createHairTopologyGeometry` | 16120 | function |  | 4 |
| `createHairTopologyOverlay` | 16141 | function |  | 3 |
| `groupDefaultsFor` | 16188 | function |  | 9 |
| `creationToolActive` | 16195 | function |  | 8 |
| `activeCreationShapeDefaults` | 16199 | function |  | 11 |
| `activeStrandShapeTarget` | 16205 | function |  | 5 |
| `curvePolylineLength` | 16209 | function |  | 2 |
| `curvePolylineLengths` | 16217 | function |  | 3 |
| `samplePolylineDistance` | 16225 | function |  | 2 |
| `applyProjectedCurveLength` | 16235 | function |  | 4 |
| `clearRegionLengthBaseline` | 16266 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16273 | function |  | 2 |
| `setGroupLengthScale` | 16281 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16319 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16351 | function |  | 1 |
| `activeSweepProfile` | 16360 | function |  | 9 |
| `activeSweepProfileTarget` | 16367 | function |  | 6 |
| `trimmedSweepProfile` | 16374 | function |  | 7 |
| `roundedLeft` | 16383 | arrow |  | 1 |
| `roundedRight` | 16389 | arrow |  | 1 |
| `activeProfileOffset` | 16406 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16413 | function |  | 3 |
| `profileToCanvas` | 16430 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16434 | function |  | 11 |
| `sampleSweepProfile` | 16443 | function |  | 7 |
| `createSweepProfileTopology` | 16464 | function |  | 5 |
| `renderProfilePreview` | 16506 | function |  | 8 |
| `renderHairCardCoveragePath` | 16525 | function |  | 3 |
| `activeTaperTarget` | 16540 | function |  | 15 |
| `twistCurveEditing` | 16547 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16551 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16555 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16559 | function |  | 17 |
| `taperAsymmetryKey` | 16563 | function |  | 12 |
| `taperSecondaryKey` | 16567 | function |  | 11 |
| `activeTaperCurve` | 16571 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16582 | function |  | 6 |
| `taperSamples` | 16592 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16599 | function |  | 2 |
| `renderTaperPreview` | 16621 | function |  | 13 |
| `renderTwistCurvePreview` | 16657 | function |  | 5 |
| `cloneShapePresetValue` | 16675 | function |  | 66 |
| `shapeValuesMatch` | 16679 | function |  | 5 |
| `shapeTargetForSelect` | 16687 | function |  | 4 |
| `loadCustomShapePresets` | 16697 | function |  | 2 |
| `saveCustomShapePresets` | 16708 | function |  | 4 |
| `shapePresetLabel` | 16716 | function |  | 4 |
| `setupShapePresetControls` | 16721 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16746 | function |  | 3 |
| `syncShapePresetSelects` | 16752 | function |  | 8 |
| `populateShapePresetSelects` | 16773 | function |  | 5 |
| `applyShapePreset` | 16800 | function |  | 2 |
| `openSaveShapePreset` | 16837 | function |  | 2 |
| `commitCustomShapePreset` | 16862 | function |  | 2 |
| `openRemoveShapePreset` | 16885 | function |  | 2 |
| `commitRemoveShapePreset` | 16898 | function |  | 2 |
| `taperPointToCanvas` | 16914 | function |  | 4 |
| `canvasToTaperPoint` | 16931 | function |  | 2 |
| `clearTaperMeshPoints` | 16967 | function |  | 2 |
| `taperMeshPointFrame` | 16977 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16987 | function |  | 4 |
| `twistMeshGraphAxis` | 16995 | function |  | 4 |
| `addTwistMeshCurvePath` | 16999 | function |  | 2 |
| `appendSegment` | 17020 | arrow |  | 1 |
| `appendFill` | 17023 | arrow |  | 1 |
| `appendSignedSection` | 17029 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17078 | function |  | 6 |
| `updateTaperMeshPoints` | 17115 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17194 | function |  | 5 |
| `renderTaperCurveEditor` | 17212 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17284 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17298 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17314 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17348 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17357 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17368 | function |  | 2 |
| `applyTaperCurveEdit` | 17376 | function |  | 10 |
| `openTaperCurveEditor` | 17484 | function |  | 3 |
| `closeTaperCurveEditor` | 17529 | function |  | 6 |
| `updateViewportStatsVisibility` | 17542 | function |  | 6 |
| `canvasToProfile` | 17561 | function |  | 2 |
| `renderSweepProfileEditor` | 17571 | function |  | 7 |
| `applySweepProfileEdit` | 17614 | function |  | 8 |
| `openSweepProfileEditor` | 17641 | function |  | 1 |
| `closeSweepProfileEditor` | 17676 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17685 | function |  | 2 |
| `addLock` | 17700 | function |  | 19 |
| `mirroredScalpRegion` | 17903 | function |  | 5 |
| `mirroredVector` | 17912 | function |  | 12 |
| `mirroredPlacementFrame` | 17916 | function |  | 2 |
| `mirrorPartnerFor` | 17929 | function |  | 40 |
| `decoupleMirrorPartner` | 17933 | function |  | 2 |
| `createMirrorPartner` | 17941 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 18037 | function |  | 6 |
| `mirroredClumpPartners` | 18042 | function |  | 6 |
| `createMirroredClump` | 18048 | function |  | 3 |
| `decoupleMirroredClump` | 18070 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18079 | function |  | 6 |
| `syncActiveMirror` | 18244 | function |  | 25 |
| `setMirrorXEditing` | 18256 | function |  | 6 |
| `snapshotState` | 18280 | function |  | 7 |
| `scalpTriangleRegion` | 18550 | function |  | 4 |
| `closestPointOnActiveScalp` | 18563 | function |  | 12 |
| `rootAttachmentFrame` | 18635 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18647 | function |  | 4 |
| `resolveRootAttachment` | 18665 | function |  | 4 |
| `curvePointsToRootLocal` | 18705 | function |  | 2 |
| `curvePointsFromRootLocal` | 18717 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18725 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18741 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18771 | function |  | 2 |
| `createRootAttachment` | 18783 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18813 | function |  | 4 |
| `rootAttachmentToData` | 18840 | function |  | 2 |
| `rootAttachmentFromData` | 18868 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18907 | function |  | 2 |
| `remapPoint` | 18922 | arrow |  | 1 |
| `remapVector` | 18923 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18952 | function |  | 2 |
| `importHeadMeshFile` | 18969 | function |  | 3 |
| `importFullBodyMeshFile` | 18992 | function |  | 3 |
| `downloadPreferencesAndPresets` | 19017 | function |  | 1 |
| `importedBooleanPreference` | 19050 | function |  | 11 |
| `loadPreferencesAndPresets` | 19054 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19124 | function |  | 1 |
| `openHairProjectFile` | 19167 | function |  | 4 |
| `dragContainsApplicationFile` | 19225 | function |  | 3 |
| `safelyRememberRecentProject` | 19234 | function |  | 2 |
| `renderRecentProjectsMenu` | 19243 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19275 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19300 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19304 | function |  | 2 |
| `pushUndoState` | 19320 | function |  | 119 |
| `undoLastAction` | 19327 | function |  | 2 |
| `redoLastAction` | 19341 | function |  | 2 |
| `updateHistoryButtons` | 19355 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19360 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19377 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19384 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19422 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19499 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19525 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19557 | function |  | 2 |
| `finalizeStateRestore` | 19598 | function |  | 2 |
| `restoreState` | 19605 | function |  | 5 |
| `disposeAllEditableObjects` | 19629 | function |  | 2 |
| `restoreLock` | 19650 | function |  | 4 |
| `restoreGuide` | 19867 | function |  | 2 |
| `vectorToData` | 19928 | function |  | 29 |
| `dataToVector` | 19932 | function |  | 31 |
| `frameToData` | 19936 | function |  | 2 |
| `frameFromData` | 19948 | function |  | 2 |
| `applyPresetSelection` | 19960 | function |  | 2 |
| `drawPresetThumbnail` | 19991 | function |  | 1 |
| `fillHair` | 20006 | arrow |  | 9 |
| `strand` | 20018 | arrow |  | 31 |
| `bun` | 20036 | arrow |  | 2 |
| `braid` | 20071 | arrow |  | 2 |
| `renderPresetLibrary` | 20160 | function |  | 3 |
| `setPresetLibraryOpen` | 20219 | function |  | 6 |
| `average` | 20232 | function |  | 4 |
| `fitPointAttributes` | 20236 | function |  | 9 |
| `rebuildCurveObjects` | 20265 | function |  | 10 |
| `createCurvePoints` | 20277 | function |  | 2 |
| `addGeneratedBangPreset` | 20286 | function |  | 1 |
| `sampleScalpQuad` | 20379 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20403 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20452 | function |  | 1 |
| `columns` | 20453 | arrow |  | 1 |
| `layer` | 20457 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20671 | function |  | 2 |
| `addBraidedBobPreset` | 20707 | function |  | 1 |
| `evenColumns` | 20708 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20924 | function |  | 1 |
| `scalpSeed` | 20947 | arrow |  | 1 |
| `createBowlCutPoints` | 21234 | function |  | 2 |
| `addBowlCutPreset` | 21272 | function |  | 1 |
| `scalpRegionAtHit` | 21338 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21350 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21357 | function |  | 12 |
| `braidStrokeActive` | 21364 | function |  | 9 |
| `proceduralDrawActive` | 21368 | function |  | 3 |
| `panelStrokeActive` | 21372 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21376 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21380 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21384 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21390 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21394 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21398 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21402 | function |  | 3 |
| `liveSurfaceStrandId` | 21412 | function |  | 4 |
| `liveSurfaceStrand` | 21416 | function |  | 4 |
| `liveSurfaceGuideId` | 21421 | function |  | 3 |
| `guideSupportsLiveSurface` | 21425 | function |  | 2 |
| `liveSurfaceGuide` | 21432 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21439 | function |  | 12 |
| `activeStrokeScalpOffset` | 21479 | function |  | 4 |
| `activeStrokeBrushSize` | 21485 | function |  | 10 |
| `activeStrokeBrushDepth` | 21491 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21497 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21505 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21515 | function |  | 13 |
| `worldNormalAtHit` | 21554 | function |  | 6 |
| `selectedPolyMesh` | 21562 | function |  | 10 |
| `addPolyLock` | 21567 | function |  | 2 |
| `ensurePolyMesh` | 21586 | function |  | 3 |
| `polySurfaceSample` | 21590 | function |  | 4 |
| `polyTargetAtEvent` | 21601 | function |  | 6 |
| `refreshPolyMesh` | 21627 | function |  | 10 |
| `ensurePolyFillPreview` | 21636 | function |  | 2 |
| `clearPolyFillPreview` | 21673 | function |  | 17 |
| `polyFillCandidateForEvent` | 21678 | function |  | 3 |
| `showPolyFillPreview` | 21698 | function |  | 2 |
| `updatePolyFillPreview` | 21724 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21749 | function |  | 5 |
| `fillPolyGap` | 21759 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21770 | function |  | 2 |
| `projectPolyRelaxPoint` | 21790 | function |  | 2 |
| `removePolyPointAttributes` | 21834 | function |  | 3 |
| `deletePolyComponent` | 21843 | function |  | 2 |
| `addPolyPoint` | 21866 | function |  | 4 |
| `appendPolyStrokeRow` | 21875 | function |  | 4 |
| `beginPolyBrushPointer` | 21895 | function |  | 1 |
| `finishPolyAltDelete` | 21981 | function |  | 1 |
| `updatePolyBrushStroke` | 21995 | function |  | 1 |
| `finishPolyBrushStroke` | 22085 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22122 | function |  | 2 |
| `drawSampleFromHit` | 22145 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22159 | function |  | 3 |
| `strokeLength` | 22196 | function |  | 9 |
| `resampleDrawStroke` | 22202 | function |  | 2 |
| `processedDrawStroke` | 22234 | function |  | 8 |
| `strokeSurfaceNormals` | 22263 | function |  | 7 |
| `drawClumpFrame` | 22274 | function |  | 4 |
| `nearestCurveParameter` | 22283 | function |  | 2 |
| `drawClumpSampleNormal` | 22297 | function |  | 6 |
| `drawClumpTemplateVector` | 22306 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22312 | function |  | 3 |
| `drawClumpStrandMaps` | 22328 | function |  | 4 |
| `nextClumpName` | 22383 | function |  | 6 |
| `initializeClumpShape` | 22390 | function |  | 5 |
| `stableClumpVariation` | 22401 | function |  | 3 |
| `createClumpFromLocks` | 22413 | function |  | 7 |
| `addLockToClump` | 22438 | function |  | 4 |
| `stableBranchBaseNormals` | 22456 | function |  | 4 |
| `ensureBranchParentNormalField` | 22467 | function |  | 2 |
| `branchParentFrame` | 22473 | function |  | 7 |
| `branchLocalVector` | 22485 | function |  | 3 |
| `branchWorldVector` | 22489 | function |  | 4 |
| `captureBranchLocalState` | 22495 | function |  | 6 |
| `enforceBranchRootPosition` | 22523 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22573 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22600 | function |  | 2 |
| `clampRegionParam` | 22647 | function |  | 113 |
| `branchRootRegionFromParam` | 22654 | function |  | 4 |
| `cloneBranchRootRegion` | 22677 | function |  | 5 |
| `flip` | 22679 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22712 | function |  | 8 |
| `setBranchRootRegionPoint` | 22743 | function |  | 3 |
| `branchRegionUVToCanvas` | 22779 | function |  | 10 |
| `branchRegionCanvasToUV` | 22782 | function |  | 4 |
| `openBranchRegionEditor` | 22788 | function |  | 2 |
| `closeBranchRegionEditor` | 22802 | function |  | 2 |
| `retargetBranchRegionEditor` | 22808 | function |  | 2 |
| `renderBranchRegionEditor` | 22813 | function |  | 9 |
| `applyBranchRegionView` | 22902 | function |  | 6 |
| `resetBranchRegionZoom` | 22905 | function |  | 1 |
| `branchRegionNavAction` | 22911 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22925 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22945 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22949 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22975 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22987 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22992 | function |  | 1 |
| `branchRegionEventUV` | 23012 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 23020 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23125 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23258 | function |  | 1 |
| `pointerToNdc` | 23263 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23274 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23288 | function |  | 1 |
| `endBranchSweepStartDrag` | 23311 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23318 | function |  | 5 |
| `gridProfileSkipCol` | 23345 | function |  | 3 |
| `branchRootRegionSurface` | 23354 | function |  | 6 |
| `toGridCol` | 23379 | arrow |  | 5 |
| `toRow` | 23383 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23438 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23458 | function |  | 2 |
| `pointAt` | 23464 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23491 | function |  | 3 |
| `applyBranchRootOffset` | 23563 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23582 | function |  | 3 |
| `branchChildrenFor` | 23602 | function |  | 9 |
| `detachBranch` | 23606 | function |  | 2 |
| `updateBranchChildren` | 23617 | function |  | 4 |
| `clumpDirectMembers` | 23660 | function |  | 3 |
| `clumpMembersForGuide` | 23665 | function |  | 6 |
| `clumpGuideForLock` | 23669 | function |  | 13 |
| `proceduralGuideForLock` | 23674 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23681 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23688 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23695 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23707 | function |  | 2 |
| `applyProceduralBranchSettings` | 23720 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23759 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23775 | function |  | 3 |
| `createProceduralAccessoryLock` | 23789 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23841 | function |  | 2 |
| `clumpFrameAt` | 23892 | function |  | 5 |
| `commitClumpMemberRestState` | 23900 | function |  | 10 |
| `updateClumpMembers` | 23983 | function |  | 10 |
| `dissolveClump` | 24087 | function |  | 6 |
| `detachLockFromClump` | 24124 | function |  | 4 |
| `updateDrawVolumePreview` | 24150 | function |  | 5 |
| `hideDrawClumpPreviews` | 24174 | function |  | 5 |
| `resetDrawVolumePreview` | 24180 | function |  | 3 |
| `updateDrawStrandPreview` | 24186 | function |  | 23 |
| `continueFromTipEnabled` | 24405 | function |  | 2 |
| `selectedTipContinuationLock` | 24411 | function |  | 3 |
| `selectedDrawBranchPoint` | 24424 | function |  | 3 |
| `canBranchDrawFromLock` | 24441 | function |  | 3 |
| `beginDrawStrandStroke` | 24448 | function |  | 2 |
| `beginDrawFreePlane` | 24573 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24587 | function |  | 2 |
| `updateDrawStrandStroke` | 24612 | function |  | 1 |
| `createDrawnLock` | 24658 | function |  | 3 |
| `setting` | 24662 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24730 | function |  | 4 |
| `createDrawnBraid` | 24738 | function |  | 2 |
| `createDrawnStrand` | 24795 | function |  | 2 |
| `createDrawnPanel` | 24922 | function |  | 2 |
| `surfaceLatticeNormal` | 24972 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24987 | function |  | 3 |
| `createViewportSurface` | 25052 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25081 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25087 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25094 | function |  | 4 |
| `updateLoftSurfacePreview` | 25103 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25135 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25151 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25169 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25191 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25217 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25227 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25231 | function |  | 2 |
| `curveSurfacePreviewLock` | 25240 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25263 | function |  | 2 |
| `hideCurveSurfacePreview` | 25279 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25291 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25296 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25305 | function |  | 3 |
| `curveSurfaceSideVector` | 25343 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25356 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25364 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25377 | function |  | 5 |
| `updateCurveSurfacePreview` | 25397 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25459 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25481 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25496 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25544 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25579 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25611 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25669 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25746 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25751 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25760 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25794 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25805 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25835 | function |  | 2 |
| `extendDrawnStrand` | 25892 | function |  | 2 |
| `finishDrawStrandStroke` | 25925 | function |  | 7 |
| `createPlacedStrand` | 25952 | function |  | 2 |
| `placedPointCount` | 26016 | function |  | 3 |
| `createPlacedPoints` | 26020 | function |  | 3 |
| `pushPointOutsideHead` | 26039 | function |  | 8 |
| `resizePlacedStrand` | 26071 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26088 | function |  | 5 |
| `beginPlaceEdit` | 26093 | function |  | 2 |
| `updatePlaceEdit` | 26111 | function |  | 1 |
| `updatePlacementLength` | 26125 | function |  | 3 |
| `updatePlacementOrientation` | 26135 | function |  | 3 |
| `endPlaceEdit` | 26153 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26168 | function |  | 1 |
| `pendingPlacedLock` | 26178 | function |  | 2 |
| `beginPlacementPointer` | 26182 | function |  | 3 |
| `finishPlacementPointer` | 26192 | function |  | 2 |
| `confirmPlacementStep` | 26216 | function |  | 2 |
| `finishPlacementFlow` | 26239 | function |  | 7 |
| `updatePlacementStatus` | 26252 | function |  | 83 |
| `deselectStrands` | 26391 | function |  | 12 |
| `beginSelectionMarquee` | 26406 | function |  | 3 |
| `beginAltOrbit` | 26430 | function |  | 1 |
| `beginBlenderNavigation` | 26442 | function |  | 1 |
| `endBlenderNavigation` | 26487 | function |  | 1 |
| `prepareSelectPointerCapture` | 26495 | function |  | 1 |
| `endSelectPointerCapture` | 26501 | function |  | 1 |
| `endAltOrbit` | 26507 | function |  | 1 |
| `dollyCameraByDrag` | 26514 | function |  | 2 |
| `fastDragMagnitude` | 26537 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26543 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26551 | function |  | 1 |
| `endHoudiniZoomDrag` | 26568 | function |  | 1 |
| `updateSelectionMarquee` | 26576 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26593 | function |  | 3 |
| `selectPointsInMarquee` | 26601 | function |  | 2 |
| `pointKey` | 26627 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26658 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26695 | function |  | 3 |
| `projectedPoint` | 26712 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26741 | function |  | 2 |
| `finishSelectionMarquee` | 26786 | function |  | 2 |
| `headMeshes` | 26809 | function |  | 9 |
| `strandSplitProfileData` | 26817 | function |  | 4 |
| `strandSplitControlPoint` | 26830 | function |  | 4 |
| `panelSplitControlPoint` | 26866 | function |  | 6 |
| `strandControlPointRaycast` | 26922 | function |  | 1 |
| `strandControlPointFrame` | 26957 | function |  | 6 |
| `branchRootGizmoFrame` | 26988 | function |  | 5 |
| `strandControlPointHitFromEvent` | 27006 | function |  | 5 |
| `createCurveObjects` | 27064 | function |  | 4 |
| `polyEdgeKey` | 27237 | function |  | 2 |
| `polyMeshEdges` | 27241 | function |  | 2 |
| `populatePolyEditObjects` | 27255 | function |  | 3 |
| `createPolyEditObjects` | 27316 | function |  | 2 |
| `rebuildPolyEditObjects` | 27324 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27338 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27345 | function |  | 2 |
| `strandWidthEdgeSample` | 27354 | function |  | 3 |
| `strandWidthEdgePoints` | 27377 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27391 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27395 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27402 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27414 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27419 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27425 | function |  | 3 |
| `updateCurveObjects` | 27439 | function |  | 41 |
| `createCurveNormalIndicator` | 27696 | function |  | 2 |
| `pointUpDirection` | 27722 | function |  | 2 |
| `curveFrameAtPoint` | 27726 | function |  | 5 |
| `curveFrameAt` | 27747 | function |  | 10 |
| `strandTwistAt` | 27767 | function |  | 6 |
| `controlPointRotationAt` | 27772 | function |  | 6 |
| `strandProfileTwistAt` | 27776 | function |  | 2 |
| `strandFrameAt` | 27782 | function |  | 1 |
| `curveFrameAtSnapshot` | 27788 | function |  | 3 |
| `outwardNormalAtPoint` | 27807 | function |  | 11 |
| `sampledSurfaceNormal` | 27819 | function |  | 2 |
| `guidedNormalAt` | 27835 | function |  | 5 |
| `twistFromHandle` | 27854 | function |  | 3 |
| `signedAngleAroundAxis` | 27875 | function |  | 5 |
| `handleColor` | 27882 | function |  | 2 |
| `isAffectedCurvePoint` | 27905 | function |  | 2 |
| `syncLockFromCurve` | 27911 | function |  | 26 |
| `labelForPreset` | 27941 | function |  | 1 |
| `rebuildLockGeometry` | 27945 | function |  | 21 |
| `scheduleSculptBrushGeometryUpdates` | 27972 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27980 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27986 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 28008 | function |  | 8 |
| `updateLockGeometry` | 28021 | function |  | 57 |
| `setGroupColorView` | 28042 | function |  | 2 |
| `createUvCheckerTexture` | 28052 | function |  | 3 |
| `ensureUvCheckerForLock` | 28088 | function |  | 4 |
| `removeUvCheckerFromLock` | 28121 | function |  | 3 |
| `invalidateUvInspector` | 28136 | function |  | 7 |
| `uvInspectorRecord` | 28140 | function |  | 1 |
| `uvInspectorRecords` | 28179 | function |  | 2 |
| `drawUvInspectorGrid` | 28183 | function |  | 2 |
| `renderUvInspector` | 28217 | function |  | 3 |
| `setUvCheckerEnabled` | 28276 | function |  | 3 |
| `strandViewportBaseColor` | 28293 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28328 | function |  | 3 |
| `syncStrandSelectionOutline` | 28334 | function |  | 2 |
| `applyLockedStrandPalette` | 28345 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28354 | function |  | 6 |
| `setStrandSelectionVisual` | 28363 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28379 | function |  | 2 |
| `syncProceduralParentVisibility` | 28386 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28395 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28399 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28403 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28416 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28436 | function |  | 3 |
| `selectLock` | 28469 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28522 | function |  | 6 |
| `syncGroupInputs` | 28533 | function |  | 3 |
| `topologyStatsForLock` | 28566 | function |  | 4 |
| `formatTopologyStats` | 28574 | function |  | 5 |
| `updateTopologyStats` | 28578 | function |  | 20 |
| `normalizeBraidDimensions` | 28612 | function |  | 4 |
| `normalizeStrandDimensions` | 28625 | function |  | 3 |
| `strandBaseWidth` | 28639 | function |  | 5 |
| `strandWidthDimension` | 28643 | function |  | 5 |
| `strandDepthDimension` | 28651 | function |  | 8 |
| `setStrandWidthDimension` | 28659 | function |  | 2 |
| `setStrandDepthDimension` | 28681 | function |  | 4 |
| `syncShapeDimensionInputs` | 28697 | function |  | 4 |
| `syncCreationShapeInputs` | 28733 | function |  | 5 |
| `syncViewportDrawSettings` | 28771 | function |  | 5 |
| `syncPanelShapeInputs` | 28785 | function |  | 6 |
| `syncStrandSplitInputs` | 28811 | function |  | 4 |
| `syncHairCardControls` | 28820 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28828 | function |  | 3 |
| `updateAttributeEditorMode` | 28867 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 29016 | function |  | 3 |
| `curveLatticeForGroup` | 29039 | function |  | 2 |
| `filterCurveLatticesToGroup` | 29057 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29102 | function |  | 2 |
| `showCurveLatticeForGroup` | 29119 | function |  | 2 |
| `selectStrandGroup` | 29156 | function |  | 3 |
| `selectCurvePoint` | 29198 | function |  | 10 |
| `updateSelectedPointLabel` | 29212 | function |  | 14 |
| `syncInputs` | 29225 | function |  | 16 |
| `syncClumpGuidePanel` | 29271 | function |  | 3 |
| `getSelectedLock` | 29298 | function |  | 104 |
| `selectedLocksInOrder` | 29302 | function |  | 37 |
| `lockStrands` | 29308 | function |  | 3 |
| `lockSelectedStrands` | 29341 | function |  | 3 |
| `unlockStrands` | 29347 | function |  | 3 |
| `unlockAllStrands` | 29362 | function |  | 3 |
| `strandEditFamily` | 29366 | function |  | 7 |
| `compatibleSelectedLocks` | 29371 | function |  | 6 |
| `selectedEditRoots` | 29378 | function |  | 2 |
| `editSelectedLocks` | 29391 | function |  | 21 |
| `multiEditValuesEqual` | 29424 | function |  | 2 |
| `setMixedControl` | 29433 | function |  | 28 |
| `syncMultiStrandInputs` | 29450 | function |  | 16 |
| `values` | 29466 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29546 | function |  | 5 |
| `createCompoundStrand` | 29553 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29614 | function |  | 9 |
| `openRebuildCurveDialog` | 29627 | function |  | 1 |
| `rebuildSelectedCurves` | 29641 | function |  | 2 |
| `selectionCanBecomeClump` | 29680 | function |  | 4 |
| `createClumpFromSelection` | 29685 | function |  | 3 |
| `cleanSelectionSets` | 29697 | function |  | 2 |
| `createSelectionSetFromSelection` | 29702 | function |  | 3 |
| `selectionSetById` | 29713 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29717 | function |  | 7 |
| `editSelectionSetFromSelection` | 29726 | function |  | 5 |
| `deleteSelectionSet` | 29746 | function |  | 2 |
| `selectSelectionSet` | 29755 | function |  | 2 |
| `deleteSelectedStrands` | 29765 | function |  | 4 |
| `deleteGuide` | 29773 | function |  | 3 |
| `deleteSelectedGuide` | 29796 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29800 | function |  | 4 |
| `hasDeletableSelection` | 29813 | function |  | 2 |
| `deleteCurrentSelection` | 29821 | function |  | 3 |
| `hideOutlinerContextMenu` | 29829 | function |  | 17 |
| `outlinerLockTargets` | 29834 | function |  | 3 |
| `showOutlinerContextMenu` | 29861 | function |  | 10 |
| `hideStrandRadialMenu` | 29941 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29952 | function |  | 3 |
| `radialButtonDimensions` | 29965 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29974 | function |  | 3 |
| `applyRadialMenuDimensions` | 29991 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29997 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 30010 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 30031 | function |  | 2 |
| `selectionSetRadialMenuOption` | 30048 | function |  | 4 |
| `selectedMirrorRadialOptions` | 30057 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30079 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30097 | function |  | 2 |
| `contextualRadialOptions` | 30104 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30233 | function |  | 3 |
| `layoutContextualRadialOptions` | 30237 | function |  | 4 |
| `renderRadialActionList` | 30261 | function |  | 3 |
| `radialListOptionAtPointer` | 30279 | function |  | 3 |
| `syncRadialListHighlight` | 30301 | function |  | 3 |
| `configureContextualRadialMenu` | 30307 | function |  | 3 |
| `beginStrandRadialGesture` | 30367 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30401 | function |  | 2 |
| `updateStrandRadialGesture` | 30447 | function |  | 1 |
| `performStrandRadialAction` | 30486 | function |  | 2 |
| `finishStrandRadialGesture` | 30589 | function |  | 2 |
| `cancelStrandRadialGesture` | 30599 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30606 | function |  | 1 |
| `setPullMoveEnabled` | 30612 | function |  | 3 |
| `toolRadialOptions` | 30620 | function |  | 2 |
| `hideToolRadialMenu` | 30645 | function |  | 4 |
| `beginToolRadialGesture` | 30658 | function |  | 2 |
| `beginToolShortcutPress` | 30698 | function |  | 2 |
| `finishToolShortcutPress` | 30713 | function |  | 2 |
| `cancelToolShortcutPress` | 30722 | function |  | 5 |
| `setRadialMenusEnabled` | 30730 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30743 | function |  | 5 |
| `setNavigationTipsEnabled` | 30758 | function |  | 5 |
| `configureNavigationMouseButtons` | 30765 | function |  | 3 |
| `syncNavigationModifierLocks` | 30778 | function |  | 7 |
| `setNavigationStyle` | 30783 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30799 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30814 | function |  | 5 |
| `setCameraSmoothingStrength` | 30820 | function |  | 5 |
| `setScaleSensitivity` | 30828 | function |  | 3 |
| `setToolTipsEnabled` | 30836 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30843 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30852 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30860 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30875 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30884 | function |  | 5 |
| `sideNamingDisplayId` | 30893 | function |  | 3 |
| `referenceViewDisplayLabel` | 30905 | function |  | 6 |
| `strandRegionDisplayLabel` | 30915 | function |  | 10 |
| `updateSideNamingLabels` | 30933 | function |  | 2 |
| `setSideNamingPerspective` | 30960 | function |  | 5 |
| `setControlPointDisplaySize` | 30969 | function |  | 6 |
| `scaleHexColor` | 30981 | function |  | 3 |
| `setViewportBackgroundColor` | 30986 | function |  | 7 |
| `setDefaultHairShader` | 31008 | function |  | 5 |
| `setPreferenceCategory` | 31014 | function |  | 4 |
| `openPreferencesDialog` | 31041 | function |  | 1 |
| `savePreferencesDialog` | 31069 | function |  | 1 |
| `cancelPreferencesDialog` | 31093 | function |  | 3 |
| `updateToolRadialGesture` | 31122 | function |  | 1 |
| `performToolRadialAction` | 31151 | function |  | 2 |
| `finishToolRadialGesture` | 31161 | function |  | 2 |
| `cancelToolRadialGesture` | 31170 | function |  | 5 |
| `duplicatePlacementTarget` | 31177 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31204 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31208 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31218 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31223 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31235 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31246 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31254 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31271 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31292 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31303 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31309 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31315 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31348 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31503 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31605 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31646 | function |  | 2 |
| `updateDuplicatePlacement` | 31673 | function |  | 2 |
| `beginDuplicatePlacement` | 31737 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31801 | function |  | 2 |
| `confirmDuplicatePlacement` | 31842 | function |  | 1 |
| `cancelDuplicatePlacement` | 31879 | function |  | 4 |
| `outlinerClumpLocks` | 31905 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31909 | function |  | 3 |
| `createOutlinerStrandButton` | 31932 | function |  | 4 |
| `createOutlinerCurveSurface` | 32018 | function |  | 2 |
| `createOutlinerClump` | 32114 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32196 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32203 | function |  | 2 |
| `renderLockList` | 32282 | function |  | 70 |
| `updateCount` | 32436 | function |  | 34 |
| `captureInputUndo` | 32445 | function |  | 1 |
| `bindUndoCapture` | 32451 | function |  | 36 |
| `bindLockInput` | 32462 | function |  | 2 |
| `applyValue` | 32479 | arrow |  | 2 |
| `applyUniformTransformScale` | 32798 | function |  | 2 |
| `applyReducedTransformScale` | 32815 | function |  | 2 |
| `applyTransformPrecision` | 32854 | function |  | 2 |
| `updateTransformScalePointer` | 32883 | function |  | 1 |
| `finishSweepProfileDrag` | 33114 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33210 | function |  | 3 |
| `finishTaperCurveDrag` | 33272 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33315 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33396 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33451 | function |  | 6 |
| `updateSelectedTaperPoint` | 33475 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 34049 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 34054 | function |  | 4 |
| `syncDrawCurlControls` | 34109 | function |  | 5 |
| `handleLiveSurfaceChange` | 34157 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34239 | function |  | 3 |
| `resampleSurfaceLock` | 34254 | function |  | 2 |
| `changePanelSplitCount` | 34367 | function |  | 3 |
| `presetNumber` | 34471 | function |  | 23 |
| `clonePresetShape` | 34476 | function |  | 7 |
| `creationPresetSnapshot` | 34485 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34533 | function |  | 5 |
| `applyPresetControl` | 34560 | function |  | 2 |
| `applyCreationToolSettings` | 34581 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34622 | function |  | 3 |
| `loadCustomCreationPresets` | 34629 | function |  | 2 |
| `saveCustomCreationPresets` | 34639 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34647 | function |  | 2 |
| `populateCreationPresetSelect` | 34683 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34707 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34740 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34745 | function |  | 2 |
| `applyCustomCreationPreset` | 34762 | function |  | 3 |
| `createCustomCreationPreset` | 34786 | function |  | 3 |
| `createCustomClumpPreset` | 34801 | function |  | 3 |
| `commitCustomCreationPreset` | 34816 | function |  | 2 |
| `openRemoveCreationPreset` | 34877 | function |  | 3 |
| `commitRemoveCreationPreset` | 34890 | function |  | 1 |
| `applyBraidToolPreset` | 34907 | function |  | 2 |
| `initPanelResizeHandles` | 35106 | function |  | 2 |
| `applyWidth` | 35112 | arrow |  | 2 |
| `restoreWidth` | 35119 | arrow |  | 2 |
| `bindResize` | 35127 | arrow |  | 2 |
| `onMove` | 35135 | arrow |  | 0 |
| `onUp` | 35139 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35156 | function |  | 2 |
| `initFloatingPanelControls` | 35165 | function |  | 2 |
| `detach` | 35174 | arrow |  | 43 |
| `endDrag` | 35212 | arrow |  | 0 |
| `endResize` | 35244 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35255 | function |  | 3 |
| `selectPatchNotesVersion` | 35389 | function |  | 3 |
| `requestReferenceImage` | 35422 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35626 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35632 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35639 | function |  | 1 |
| `deleteLocks` | 36206 | function |  | 10 |
| `disposeCurveObjects` | 36284 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36336 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36367 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36442 | function |  | 2 |
| `resize` | 36475 | function |  | 4 |
| `handleViewportPointerMove` | 36486 | function |  | 1 |
| `blockProportionalSizingEvent` | 36497 | function |  | 1 |
| `updateLightAngleFromInputs` | 36503 | function |  | 2 |
| `startViewSnap` | 36517 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36547 | function |  | 3 |
| `trackViewportPointerDown` | 36564 | function |  | 1 |
| `trackViewportPointerMove` | 36580 | function |  | 1 |
| `clearViewportPointer` | 36588 | function |  | 1 |
| `updateViewSnap` | 36593 | function |  | 1 |
| `nearestCardinalAxis` | 36629 | function |  | 5 |
| `cardinalAxisKey` | 36643 | function |  | 5 |
| `steppedDragAmount` | 36647 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36653 | function |  | 4 |
| `endViewSnap` | 36669 | function |  | 4 |
| `activateStrandControlPoint` | 36679 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36729 | function |  | 4 |
| `addStrandControlPointSelection` | 36756 | function |  | 3 |
| `removeStrandControlPointSelection` | 36773 | function |  | 3 |
| `sampleStrandPointNormal` | 36787 | function |  | 2 |
| `sampleStrandPointVectors` | 36797 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36803 | function |  | 2 |
| `resampleStrandCurveData` | 36814 | function |  | 4 |
| `resampleMatchingVectors` | 36820 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36859 | function |  | 4 |
| `removeStrandCurvePoint` | 36870 | function |  | 2 |
| `closestStrandCurveParameter` | 36883 | function |  | 2 |
| `insertStrandCurvePoint` | 36912 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36929 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36939 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36955 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36962 | function |  | 4 |
| `prepareCurvePointSelection` | 36984 | function |  | 1 |
| `finishCurvePointInsertion` | 37095 | function |  | 1 |
| `finishPointRemoval` | 37110 | function |  | 1 |
| `editableStrandWidth` | 37128 | function |  | 6 |
| `editableStrandWidthBounds` | 37140 | function |  | 2 |
| `applyEditableStrandWidth` | 37146 | function |  | 3 |
| `viewportPixelPoint` | 37182 | function |  | 3 |
| `syncSculptBrushControls` | 37190 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37205 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37213 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37221 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37227 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37231 | function |  | 7 |
| `updateSculptBrushCursor` | 37238 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37260 | function |  | 4 |
| `sculptBrushEditableLock` | 37267 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37277 | function |  | 5 |
| `sculptBrushLockViable` | 37283 | function |  | 5 |
| `sculptBrushUnits` | 37294 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37333 | function |  | 4 |
| `sculptBrushPointWeight` | 37383 | function |  | 5 |
| `sculptBrushWorldDelta` | 37393 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37402 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37428 | function |  | 2 |
| `beginSculptMoveStroke` | 37486 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37548 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37783 | function |  | 3 |
| `updateSculptMoveStroke` | 37792 | function |  | 1 |
| `finishSculptMoveStroke` | 37808 | function |  | 3 |
| `strandControlPointHit` | 37856 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37860 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37938 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37972 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 38012 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 38025 | function |  | 1 |
| `setHoveredControlPoint` | 38065 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38078 | function |  | 2 |
| `updateControlPointHover` | 38114 | function |  | 1 |
| `animate` | 38671 | function |  | 2 |
| `syncCompactSidebarLayout` | 38704 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38723 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38729 | function |  | 3 |
| `setAttributeEditorTab` | 38735 | function |  | 6 |

## modules/core/app-config.js（92 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

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

## modules/core/shortcut-registry.js（54 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `shortcutToolForKey` | 34 | function | export | 1 |
| `workspaceForShortcutKey` | 38 | function | export | 1 |
| `focusedControlShouldYieldToShortcut` | 42 | function | export | 1 |

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

## modules/edit/mirror-selection.js（21 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `mirrorSelectionTargets` | 1 | function | export | 1 |

## modules/edit/multi-edit.js（10 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `relativeEditValue` | 1 | function | export | 1 |

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
