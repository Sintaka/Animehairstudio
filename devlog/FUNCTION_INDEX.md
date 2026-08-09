# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1733** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38387 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 260 | function |  | 3 |
| `saveBooleanPreference` | 288 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 292 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 297 | function |  | 2 |
| `normalizeScaleSensitivity` | 302 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 307 | function |  | 2 |
| `normalizeSideNamingPerspective` | 312 | function |  | 2 |
| `normalizeNavigationStyle` | 316 | function |  | 2 |
| `setupEditableSliderControls` | 331 | function |  | 2 |
| `syncNumberFromRange` | 382 | arrow |  | 0 |
| `applyNumberValue` | 389 | arrow |  | 0 |
| `copyCameraPose` | 495 | function |  | 3 |
| `updateCameraProjectionForViewport` | 501 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 514 | function |  | 3 |
| `setOrthographicView` | 520 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 560 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 589 | function |  | 2 |
| `removeRotateFreeAxisRing` | 615 | function |  | 2 |
| `deflateTransformGizmoPickers` | 627 | function |  | 2 |
| `nextStrandName` | 1006 | function |  | 2 |
| `activeDrawClumpTemplate` | 1091 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1096 | function |  | 3 |
| `drawModeCreatesClump` | 1123 | function |  | 1 |
| `isPanelGeometry` | 1267 | function |  | 31 |
| `normalizePanelSplits` | 1271 | function |  | 3 |
| `clonePanelSplits` | 1283 | function |  | 19 |
| `snapPanelSplitHeight` | 1287 | function |  | 5 |
| `createQuadSphereGeometry` | 1322 | function |  | 2 |
| `vertexIndex` | 1336 | function |  | 11 |
| `addEdge` | 1354 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1389 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1459 | function |  | 3 |
| `updateScalpRenderGeometry` | 1485 | function |  | 4 |
| `writeScalpRegionColors` | 1536 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1549 | function |  | 2 |
| `createScalpSelectionOutline` | 1579 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1621 | function |  | 25 |
| `activeScalpSurfaceWire` | 1626 | function |  | 2 |
| `activeScalpSelectionOutline` | 1631 | function |  | 2 |
| `inferredCustomScalpRegion` | 1636 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1643 | function |  | 5 |
| `customScalpGeometryFromObject` | 1662 | function |  | 2 |
| `customScalpWireGeometry` | 1694 | function |  | 3 |
| `installCustomScalpGeometry` | 1705 | function |  | 3 |
| `installCustomScalpGuide` | 1729 | function |  | 3 |
| `setScalpGuideSource` | 1747 | function |  | 7 |
| `updateScalpQuadWire` | 1763 | function |  | 4 |
| `updateScalpTopology` | 1779 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1843 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2023 | function |  | 2 |
| `currentStrandSelectionState` | 2085 | function |  | 4 |
| `applyStrandSelectionState` | 2089 | function |  | 5 |
| `clearStrandSelectionState` | 2094 | function |  | 7 |
| `guideHeadBounds` | 3074 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3084 | function |  | 5 |
| `disposeGuideModel` | 3098 | function |  | 3 |
| `syncHeadTransformInputs` | 3109 | function |  | 4 |
| `applyHeadTransform` | 3116 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3134 | function |  | 4 |
| `applyScalpRoughScale` | 3143 | function |  | 5 |
| `resetHeadTransform` | 3157 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3171 | function |  | 2 |
| `installGuideModel` | 3187 | function |  | 5 |
| `loadDefaultGuideModel` | 3263 | function |  | 3 |
| `braidTemplateFromEntries` | 3286 | function |  | 4 |
| `braidMeshEntries` | 3318 | function |  | 2 |
| `prepareBraidBodyCache` | 3330 | function |  | 2 |
| `quantize` | 3339 | arrow |  | 21 |
| `sourceNormalAt` | 3351 | arrow |  | 1 |
| `clusterBoundary` | 3354 | arrow |  | 2 |
| `normalBuckets` | 3371 | arrow |  | 2 |
| `applyBucketPair` | 3403 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3434 | function |  | 2 |
| `annotateBraidObjTopology` | 3455 | function |  | 2 |
| `loadBraidMeshPreset` | 3475 | function |  | 3 |
| `createSplitControlHandle` | 3492 | function |  | 4 |
| `frameGuideModel` | 3507 | function |  | 2 |
| `syncScalpInputs` | 3532 | function |  | 2 |
| `syncScalpArtistInputs` | 3538 | function |  | 2 |
| `rootScalpOffsetDistance` | 3546 | function |  | 15 |
| `applyLockRootScalpOffset` | 3551 | function |  | 5 |
| `normalizeHairLayer` | 3567 | function |  | 27 |
| `layerOffsetForLock` | 3571 | function |  | 9 |
| `layerRootOffsetFactor` | 3576 | function |  | 13 |
| `layerOffsetWeight` | 3580 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3586 | function |  | 5 |
| `pointsWithLayerOffset` | 3595 | function |  | 3 |
| `layerDirectionForLock` | 3603 | function |  | 2 |
| `applyLayerOffset` | 3614 | function |  | 5 |
| `setLockHairLayer` | 3638 | function |  | 2 |
| `setGroupLayerOffset` | 3653 | function |  | 2 |
| `scalpArtistWeight` | 3665 | function |  | 3 |
| `scalpArtistScalesAt` | 3669 | function |  | 3 |
| `applyScalpArtistShape` | 3679 | function |  | 5 |
| `inverseScalpArtistShape` | 3697 | function |  | 2 |
| `updateScalpSurface` | 3724 | function |  | 3 |
| `setActiveScalpRegion` | 3734 | function |  | 2 |
| `clearScalpRegions` | 3746 | function |  | 2 |
| `scalpHitFromEvent` | 3763 | function |  | 3 |
| `updateScalpBrushCursor` | 3771 | function |  | 4 |
| `paintScalpAt` | 3786 | function |  | 3 |
| `beginScalpPaint` | 3853 | function |  | 2 |
| `updateScalpPaint` | 3862 | function |  | 1 |
| `endScalpPaint` | 3871 | function |  | 2 |
| `createScalpLattice` | 3878 | function |  | 2 |
| `resetScalpLattice` | 3903 | function |  | 1 |
| `updateScalpLatticeObjects` | 3915 | function |  | 7 |
| `quadraticWeights` | 3929 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3934 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3961 | function |  | 3 |
| `selectScalpLatticePoint` | 3976 | function |  | 2 |
| `beginScalpLatticeDrag` | 3991 | function |  | 2 |
| `updateScalpLatticeDrag` | 4009 | function |  | 1 |
| `endScalpLatticeDrag` | 4027 | function |  | 2 |
| `setHeadReferenceTransparency` | 4033 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4043 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4061 | function |  | 3 |
| `trianglePlaneIntersections` | 4069 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4090 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4116 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4126 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4138 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4162 | function |  | 3 |
| `createScalpBuilderPlanes` | 4177 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4209 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4247 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4270 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4282 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4294 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4299 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4311 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4421 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4446 | function |  | 5 |
| `syncEditedScalpSurface` | 4461 | function |  | 4 |
| `ensureEditedScalpSurface` | 4532 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4562 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4647 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4660 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4676 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4686 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4704 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4717 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4724 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4743 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4757 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4798 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4807 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4820 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4841 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4978 | function |  | 2 |
| `scalpTemplateNeighbors` | 4986 | function |  | 2 |
| `smoothScalpVectorField` | 4998 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5012 | function |  | 2 |
| `upperContourCurve` | 5029 | function |  | 4 |
| `hermitePoint` | 5064 | function |  | 2 |
| `curveNetworkSection` | 5075 | function |  | 3 |
| `pointAlongSection` | 5104 | function |  | 3 |
| `longestStitchedContour` | 5110 | function |  | 2 |
| `nodeForPoint` | 5118 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5175 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5185 | function |  | 1 |
| `orderedRange` | 5197 | arrow |  | 3 |
| `clipSegment` | 5220 | arrow |  | 1 |
| `liftedPoint` | 5243 | arrow |  | 5 |
| `boundaryCorner` | 5248 | arrow |  | 4 |
| `surfaceCurveBetween` | 5257 | arrow |  | 1 |
| `addSurfaceConnector` | 5280 | arrow |  | 2 |
| `sideContourAtDepth` | 5348 | arrow |  | 3 |
| `addSurfacePatch` | 5382 | arrow |  | 1 |
| `addCenterBridgePatch` | 5462 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5570 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5605 | function |  | 1 |
| `generatedScalpObjContent` | 5695 | function |  | 2 |
| `generateScalpFromBuilder` | 5709 | function |  | 1 |
| `orderedDepthRange` | 5745 | arrow |  | 7 |
| `resetScalpBuilder` | 5874 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5889 | function |  | 1 |
| `beginScalpBuilderInput` | 5903 | function |  | 2 |
| `updateScalpBuilderStroke` | 5904 | function |  | 1 |
| `finishScalpBuilderStroke` | 5905 | function |  | 2 |
| `setScalpBuilderEditing` | 5907 | function |  | 10 |
| `updateScalpEditingVisibility` | 5941 | function |  | 12 |
| `exitSetupEditors` | 6035 | function |  | 7 |
| `setCapsuleGuideEditing` | 6044 | function |  | 5 |
| `syncAppMenuVisibility` | 6072 | function |  | 3 |
| `closeAppMenus` | 6077 | function |  | 6 |
| `setAppMenuOpen` | 6088 | function |  | 3 |
| `setTurntableActive` | 6095 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6104 | function |  | 9 |
| `selectedReferenceImage` | 6108 | function |  | 20 |
| `normalizeReferenceCrop` | 6114 | function |  | 8 |
| `referenceCropIsFull` | 6122 | function |  | 3 |
| `referencePlaneFrontAxis` | 6127 | function |  | 4 |
| `referencePlanePlacement` | 6136 | function |  | 4 |
| `migratedReferencePlanePosition` | 6151 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6171 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6188 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6204 | function |  | 2 |
| `snappedReferenceImageView` | 6227 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6233 | function |  | 5 |
| `applyReferenceImageRuntime` | 6249 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6292 | function |  | 6 |
| `createReferenceImageRuntime` | 6300 | function |  | 3 |
| `addReferenceImage` | 6369 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6421 | function |  | 3 |
| `disposeReferenceImage` | 6440 | function |  | 2 |
| `clearReferenceImages` | 6444 | function |  | 2 |
| `serializeReferenceImage` | 6451 | function |  | 1 |
| `setReferenceImageType` | 6479 | function |  | 2 |
| `attachReferenceImageTransform` | 6523 | function |  | 6 |
| `selectReferenceImage` | 6537 | function |  | 12 |
| `placeReferencePlane` | 6560 | function |  | 2 |
| `setReferencePlaneInFront` | 6571 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6581 | function |  | 4 |
| `renderReferenceImagePanel` | 6600 | function |  | 20 |
| `setOutlinerTab` | 6647 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6665 | function |  | 4 |
| `componentEditModeActive` | 6669 | function |  | 38 |
| `selectionToolSupportsPicking` | 6673 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6678 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6694 | function |  | 2 |
| `setViewportSelectionMode` | 6724 | function |  | 4 |
| `setViewportEditMode` | 6736 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6778 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6792 | function |  | 8 |
| `outlinerGuides` | 6804 | function |  | 3 |
| `guideOutlinerLabel` | 6811 | function |  | 2 |
| `normalizeOutlinerName` | 6821 | function |  | 4 |
| `beginOutlinerRename` | 6826 | function |  | 2 |
| `finish` | 6837 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6867 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6877 | function |  | 2 |
| `renderGuideOutliner` | 6912 | function |  | 10 |
| `referenceOutlinerGroup` | 6970 | function |  | 2 |
| `renderReferenceOutliner` | 6974 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7091 | function |  | 5 |
| `readReferenceImageFile` | 7096 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7120 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7127 | function |  | 3 |
| `dragContainsReferenceImage` | 7172 | function |  | 3 |
| `setReferenceImageDragActive` | 7183 | function |  | 9 |
| `referenceDropDestination` | 7191 | function |  | 2 |
| `viewportOverlayDropPosition` | 7197 | function |  | 2 |
| `setReferenceDropHover` | 7206 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7224 | function |  | 2 |
| `referenceOverlayAtPointer` | 7244 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7262 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7275 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7321 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7371 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7393 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7404 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7430 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7439 | function |  | 2 |
| `referenceCropCursor` | 7454 | function |  | 3 |
| `updateReferenceCropHandles` | 7460 | function |  | 5 |
| `referenceCropSourcePoint` | 7481 | function |  | 2 |
| `beginReferenceCrop` | 7488 | function |  | 1 |
| `updateReferenceCrop` | 7526 | function |  | 1 |
| `finishReferenceCrop` | 7558 | function |  | 4 |
| `setHeadSetupEditing` | 7576 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7592 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7601 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7611 | function |  | 4 |
| `setScalpGuideVisibility` | 7617 | function |  | 12 |
| `currentGuideViewMode` | 7625 | function |  | 3 |
| `updateGuideViewToggle` | 7633 | function |  | 5 |
| `setGuideViewMode` | 7649 | function |  | 3 |
| `cycleGuideViewMode` | 7660 | function |  | 1 |
| `hideGuideViewContextMenu` | 7665 | function |  | 6 |
| `showGuideViewContextMenu` | 7669 | function |  | 1 |
| `strandPassesDisplayFilters` | 7682 | function |  | 4 |
| `strandVisibleForDisplay` | 7691 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7696 | function |  | 2 |
| `lockedStrandsExist` | 7700 | function |  | 3 |
| `hiddenStrandsExist` | 7704 | function |  | 2 |
| `hideSelectedStrands` | 7708 | function |  | 2 |
| `unhideHiddenStrands` | 7718 | function |  | 2 |
| `strandIsolationActive` | 7727 | function |  | 7 |
| `setStrandIsolation` | 7731 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7743 | function |  | 3 |
| `syncVisibilityParent` | 7754 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7761 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7790 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7797 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7817 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7840 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7848 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7855 | function |  | 9 |
| `setScalpLatticeEditing` | 7866 | function |  | 4 |
| `setScalpShapeEditing` | 7881 | function |  | 9 |
| `setScalpPaintEditing` | 7899 | function |  | 7 |
| `defaultCurveLatticePoints` | 7923 | function |  | 3 |
| `flatCurveLatticePoints` | 7949 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7958 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7982 | function |  | 4 |
| `horizontalValue` | 7987 | arrow |  | 1 |
| `blendedSample` | 7998 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8031 | function |  | 2 |
| `curveLatticeControlPoint` | 8046 | function |  | 9 |
| `circularArcTangent` | 8050 | function |  | 4 |
| `arcLengthTo` | 8081 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8093 | function |  | 3 |
| `sampleHermiteCurve` | 8132 | function |  | 10 |
| `sampleCurveLattice` | 8149 | function |  | 6 |
| `curveLatticeNormal` | 8168 | function |  | 1 |
| `createCurveLatticeGeometry` | 8179 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8208 | function |  | 3 |
| `appendCurve` | 8210 | arrow |  | 4 |
| `sample` | 8212 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8239 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8255 | function |  | 3 |
| `addPicker` | 8257 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8296 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8309 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8313 | function |  | 3 |
| `curveLatticeEditablePoint` | 8331 | function |  | 13 |
| `curveLatticePointSection` | 8338 | function |  | 3 |
| `curveLatticeRestPoint` | 8349 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8355 | function |  | 7 |
| `curveLatticeRootColumns` | 8361 | function |  | 3 |
| `curveTangentsForPoints` | 8368 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8380 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8417 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8443 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8460 | function |  | 3 |
| `resampleGrid` | 8470 | arrow |  | 2 |
| `controlPointIsSelected` | 8497 | function |  | 7 |
| `clearMultiPointSelection` | 8505 | function |  | 9 |
| `createCurveLatticeHandles` | 8509 | function |  | 4 |
| `addCurveLattice` | 8531 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8640 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8671 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8677 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8716 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8737 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8754 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8763 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8770 | function |  | 1 |
| `selectCurveLatticeLoop` | 8789 | function |  | 3 |
| `selectCurveLatticePoint` | 8818 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8833 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8875 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8896 | function |  | 3 |
| `curveLatticeColumnPoints` | 8939 | function |  | 3 |
| `groupCurveControlIndices` | 8948 | function |  | 4 |
| `groupCurveControlPoints` | 8954 | function |  | 2 |
| `updateGroupCurveDisplay` | 8960 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8970 | function |  | 2 |
| `groupCurveDeformationPairs` | 8992 | function |  | 2 |
| `curveLatticeDeformationPairs` | 8999 | function |  | 2 |
| `appendPairs` | 9001 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9012 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9031 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9052 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9071 | function |  | 2 |
| `capsuleGuideCapHeight` | 9105 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9109 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9114 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9118 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9130 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9146 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9152 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9178 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9208 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9262 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9283 | function |  | 7 |
| `vertex` | 9297 | function |  | 4 |
| `addFace` | 9303 | function |  | 3 |
| `addRing` | 9321 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9376 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9386 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9451 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9497 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9510 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9531 | function |  | 3 |
| `capsuleGuidePointDistances` | 9536 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9557 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9577 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9582 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9588 | function |  | 3 |
| `capsuleGuideAccentColor` | 9593 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9598 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9609 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9621 | function |  | 2 |
| `createCapsuleGuideHandles` | 9653 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9676 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9695 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9702 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9718 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9735 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9750 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9787 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9803 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9820 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9826 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9853 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9865 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9884 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9929 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9964 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9978 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9984 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10001 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10012 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10023 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10053 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10063 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10104 | function |  | 3 |
| `createQuadCageGeometry` | 10120 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10144 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10164 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10175 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10228 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10266 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10276 | function |  | 4 |
| `addCapsuleGuide` | 10284 | function |  | 4 |
| `addGuide` | 10353 | function |  | 1 |
| `createGuideGeometry` | 10414 | function |  | 4 |
| `selectGuide` | 10469 | function |  | 17 |
| `updateGuideControlsVisibility` | 10537 | function |  | 10 |
| `updateViewportToolVisibility` | 10554 | function |  | 7 |
| `getSelectedGuide` | 10593 | function |  | 34 |
| `selectedViewportFocusBounds` | 10597 | function |  | 2 |
| `frameViewportBounds` | 10611 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10641 | function |  | 2 |
| `fullSceneFocusBounds` | 10645 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10660 | function |  | 3 |
| `cycleViewportFraming` | 10669 | function |  | 2 |
| `syncGuideInputs` | 10687 | function |  | 5 |
| `updateGuideGeometry` | 10730 | function |  | 3 |
| `sculptBrushToolActive` | 10751 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10755 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10759 | function |  | 3 |
| `effectiveSculptBrushTool` | 10763 | function |  | 13 |
| `updateSculptScaleModeRow` | 10769 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10774 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10796 | function |  | 5 |
| `setActiveTool` | 10805 | function |  | 19 |
| `setDrawStrandMode` | 10943 | function |  | 2 |
| `setObjectSpaceEditing` | 10953 | function |  | 7 |
| `setHierarchyEditing` | 10969 | function |  | 4 |
| `setProportionalEditing` | 10981 | function |  | 5 |
| `beginProportionalSizeEdit` | 11000 | function |  | 3 |
| `updateProportionalSizeEdit` | 11012 | function |  | 2 |
| `endProportionalSizeEdit` | 11023 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11030 | function |  | 2 |
| `refreshProportionalPreview` | 11038 | function |  | 4 |
| `activeBrushSizeInput` | 11048 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11057 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11069 | function |  | 2 |
| `beginBrushSizeDrag` | 11087 | function |  | 1 |
| `updateBrushSizeDrag` | 11114 | function |  | 1 |
| `finishBrushSizeDrag` | 11135 | function |  | 2 |
| `updateInteractionLocks` | 11152 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11161 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11170 | function |  | 2 |
| `configureTransformControls` | 11201 | function |  | 16 |
| `pullMoveActive` | 11209 | function |  | 9 |
| `updatePullGuideVisual` | 11213 | function |  | 4 |
| `attachTransformForCurvePoint` | 11229 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11253 | function |  | 7 |
| `strandObjectRootIndex` | 11269 | function |  | 3 |
| `strandObjectRoot` | 11278 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11282 | function |  | 2 |
| `attachStrandObjectTransform` | 11287 | function |  | 6 |
| `guideObjectPivot` | 11310 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11321 | function |  | 2 |
| `attachGuideObjectTransform` | 11326 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11345 | function |  | 2 |
| `beginGuideObjectTransform` | 11373 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11380 | function |  | 2 |
| `updateGuideObjectTransform` | 11402 | function |  | 2 |
| `finishGuideObjectTransform` | 11435 | function |  | 2 |
| `clonePlacementFrame` | 11444 | function |  | 2 |
| `cloneOptionalVectors` | 11456 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11460 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11477 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11492 | function |  | 2 |
| `strandObjectTransformOperators` | 11508 | function |  | 4 |
| `transformPoint` | 11516 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11523 | arrow |  | 0 |
| `transformNormal` | 11529 | arrow |  | 10 |
| `transformDirection` | 11539 | arrow |  | 7 |
| `worldMatrixForPivot` | 11551 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11557 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11573 | function |  | 6 |
| `beginStrandObjectTransform` | 11587 | function |  | 2 |
| `updateStrandObjectTransform` | 11625 | function |  | 2 |
| `commitStrandObjectTransform` | 11674 | function |  | 2 |
| `mapPoints` | 11687 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11721 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11735 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11758 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11771 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11786 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11812 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11861 | function |  | 2 |
| `beginHandleEdit` | 11870 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11919 | function |  | 3 |
| `applyBranchRigidRootMove` | 11936 | function |  | 3 |
| `syncBranchRootHandleFrame` | 11973 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 11984 | function |  | 3 |
| `multiPointHandleEditActive` | 11995 | function |  | 7 |
| `applyMultiMove` | 11999 | function |  | 5 |
| `applyMultiRotate` | 12005 | function |  | 2 |
| `applyMultiScale` | 12014 | function |  | 2 |
| `applyHierarchicalMove` | 12023 | function |  | 3 |
| `applySingleMove` | 12035 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12039 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12056 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12065 | function |  | 3 |
| `changed` | 12075 | arrow |  | 1 |
| `applyPullMove` | 12117 | function |  | 3 |
| `pullHeadCollisionContext` | 12125 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12144 | function |  | 2 |
| `applyProportionalMove` | 12167 | function |  | 3 |
| `viewPlaneNormal` | 12178 | function |  | 20 |
| `isCameraInSnappedView` | 12182 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12190 | function |  | 10 |
| `updateViewPlaneGrid` | 12194 | function |  | 14 |
| `setViewPlaneMove` | 12251 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12262 | function |  | 2 |
| `rayFromViewportEvent` | 12270 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12278 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12288 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12299 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12312 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12331 | function |  | 4 |
| `beginViewPlaneMove` | 12338 | function |  | 3 |
| `updateViewPlaneMove` | 12402 | function |  | 1 |
| `endViewPlaneMove` | 12467 | function |  | 7 |
| `applyHierarchicalRotate` | 12486 | function |  | 2 |
| `rotateGuideNormal` | 12493 | arrow |  | 4 |
| `applySingleRotate` | 12531 | function |  | 2 |
| `applyProportionalRotate` | 12535 | function |  | 2 |
| `applyHierarchicalScale` | 12555 | function |  | 2 |
| `applySingleScale` | 12565 | function |  | 2 |
| `applyProportionalScale` | 12569 | function |  | 2 |
| `setPointScale` | 12585 | function |  | 8 |
| `proportionalWeight` | 12594 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12606 | function |  | 5 |
| `strandInfluenceColor` | 12612 | function |  | 17 |
| `beginRelaxEdit` | 12637 | function |  | 3 |
| `updateRelaxEdit` | 12666 | function |  | 1 |
| `endRelaxEdit` | 12726 | function |  | 1 |
| `disposeGuide` | 12736 | function |  | 3 |
| `removeGuideObjects` | 12764 | function |  | 3 |
| `strandRadiusAt` | 12778 | function |  | 5 |
| `strandProfileTopologyAt` | 12795 | function |  | 8 |
| `strandCurveParameters` | 12837 | function |  | 5 |
| `widthProfileAt` | 12847 | arrow |  | 1 |
| `braidFrameAt` | 12885 | function |  | 5 |
| `braidFrameAtExtended` | 12895 | function |  | 2 |
| `createBraidProfileProjector` | 12904 | function |  | 2 |
| `project` | 12920 | arrow |  | 17 |
| `createBraidGeometry` | 12935 | function |  | 2 |
| `deformationAt` | 12970 | function |  | 3 |
| `widthFor` | 12979 | arrow |  | 3 |
| `depthFor` | 12983 | arrow |  | 3 |
| `outputVertex` | 13015 | function |  | 7 |
| `appendAuthoredCap` | 13123 | function |  | 3 |
| `outputCapVertex` | 13130 | arrow |  | 6 |
| `capBoundary` | 13221 | function |  | 3 |
| `strandGeometryCurve` | 13283 | function |  | 15 |
| `strandGeometryFrameAt` | 13309 | function |  | 19 |
| `transportedStrandFrameAt` | 13372 | function |  | 7 |
| `twistOverrideAt` | 13375 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13403 | function |  | 2 |
| `weldPanelGeometryData` | 13439 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13479 | function |  | 3 |
| `surfacePanelPoint` | 13494 | function |  | 3 |
| `createPanelStrandGeometry` | 13517 | function |  | 2 |
| `addQuad` | 13551 | arrow |  | 6 |
| `near` | 13555 | arrow |  | 6 |
| `panelWidthAt` | 13585 | arrow |  | 6 |
| `panelThicknessAt` | 13594 | arrow |  | 6 |
| `panelFrameAt` | 13603 | arrow |  | 1 |
| `rawPanelPoint` | 13621 | arrow |  | 1 |
| `panelPoint` | 13641 | arrow |  | 2 |
| `addPatch` | 13647 | arrow |  | 1 |
| `splitOpening` | 13698 | arrow |  | 2 |
| `uStart` | 13722 | arrow |  | 1 |
| `uEnd` | 13725 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13763 | function |  | 3 |
| `inside` | 13764 | arrow |  | 2 |
| `pushOrientedTriangle` | 13786 | function |  | 7 |
| `triangulatePolygon3D` | 13797 | function |  | 1 |
| `orientedQuadFace` | 13837 | function |  | 2 |
| `createSplitStrandGeometry` | 13845 | function |  | 2 |
| `fusedIndexAt` | 14002 | arrow |  | 0 |
| `createHairCardGeometry` | 14051 | function |  | 2 |
| `createPolyGeometry` | 14150 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14177 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14186 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14233 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14241 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14257 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14266 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14277 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14285 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14295 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14315 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14338 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14417 | function |  | 2 |
| `pushBoundary` | 14446 | arrow |  | 5 |
| `boundaryAt` | 14464 | arrow |  | 3 |
| `hermite` | 14486 | arrow |  | 2 |
| `emitBottomMidRow` | 14531 | arrow |  | 2 |
| `emitTopMidRow` | 14630 | arrow |  | 2 |
| `sideHoleVertex` | 14672 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14721 | arrow |  | 2 |
| `emitFillStrip` | 14792 | arrow |  | 2 |
| `fillSide` | 14803 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14847 | arrow |  | 2 |
| `edgeDirection` | 14871 | arrow |  | 1 |
| `positionAt` | 14930 | arrow |  | 1 |
| `createBranchChildGeometry` | 14981 | function |  | 2 |
| `createCompoundStrandGeometry` | 15191 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15442 | function |  | 2 |
| `createHairGeometry` | 15473 | function |  | 6 |
| `createBaseHairGeometry` | 15525 | function |  | 3 |
| `hairMaterialDefinition` | 15643 | function |  | 4 |
| `materialForLock` | 15647 | function |  | 8 |
| `activeHairMaterialDefinition` | 15651 | function |  | 11 |
| `strandDisplayColor` | 15657 | function |  | 14 |
| `setAnimeHairBaseColor` | 15675 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15688 | function |  | 2 |
| `createHairMaterial` | 15728 | function |  | 5 |
| `createStrandSelectionOutline` | 15770 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15804 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15813 | function |  | 6 |
| `refreshMaterialUsers` | 15840 | function |  | 6 |
| `renderHairMaterialOutliner` | 15849 | function |  | 5 |
| `renderHairMaterialOptions` | 15879 | function |  | 3 |
| `syncHairMaterialEditor` | 15889 | function |  | 9 |
| `createProjectHairMaterial` | 15915 | function |  | 3 |
| `deleteActiveHairMaterial` | 15935 | function |  | 2 |
| `createHairTopologyGeometry` | 15953 | function |  | 4 |
| `createHairTopologyOverlay` | 15974 | function |  | 3 |
| `groupDefaultsFor` | 16021 | function |  | 9 |
| `creationToolActive` | 16028 | function |  | 8 |
| `activeCreationShapeDefaults` | 16032 | function |  | 11 |
| `activeStrandShapeTarget` | 16038 | function |  | 5 |
| `curvePolylineLength` | 16042 | function |  | 2 |
| `curvePolylineLengths` | 16050 | function |  | 3 |
| `samplePolylineDistance` | 16058 | function |  | 2 |
| `applyProjectedCurveLength` | 16068 | function |  | 4 |
| `clearRegionLengthBaseline` | 16099 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16106 | function |  | 2 |
| `setGroupLengthScale` | 16114 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16152 | function |  | 5 |
| `requestGroupDefaultsWarning` | 16184 | function |  | 1 |
| `activeSweepProfile` | 16193 | function |  | 9 |
| `activeSweepProfileTarget` | 16200 | function |  | 6 |
| `trimmedSweepProfile` | 16207 | function |  | 7 |
| `roundedLeft` | 16216 | arrow |  | 1 |
| `roundedRight` | 16222 | arrow |  | 1 |
| `activeProfileOffset` | 16239 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16246 | function |  | 3 |
| `profileToCanvas` | 16263 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16267 | function |  | 11 |
| `sampleSweepProfile` | 16276 | function |  | 7 |
| `createSweepProfileTopology` | 16297 | function |  | 5 |
| `renderProfilePreview` | 16339 | function |  | 8 |
| `renderHairCardCoveragePath` | 16358 | function |  | 3 |
| `activeTaperTarget` | 16373 | function |  | 15 |
| `twistCurveEditing` | 16380 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16384 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16388 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16392 | function |  | 17 |
| `activeTaperCurve` | 16419 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16430 | function |  | 6 |
| `taperSamples` | 16440 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16447 | function |  | 2 |
| `renderTaperPreview` | 16469 | function |  | 13 |
| `renderTwistCurvePreview` | 16505 | function |  | 5 |
| `shapeTargetForSelect` | 16525 | function |  | 3 |
| `setupShapePresetControls` | 16535 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16560 | function |  | 3 |
| `syncShapePresetSelects` | 16566 | function |  | 7 |
| `populateShapePresetSelects` | 16587 | function |  | 5 |
| `openSaveShapePreset` | 16615 | function |  | 2 |
| `commitCustomShapePreset` | 16640 | function |  | 2 |
| `openRemoveShapePreset` | 16663 | function |  | 2 |
| `commitRemoveShapePreset` | 16676 | function |  | 2 |
| `taperPointToCanvas` | 16692 | function |  | 4 |
| `canvasToTaperPoint` | 16709 | function |  | 2 |
| `clearTaperMeshPoints` | 16745 | function |  | 2 |
| `taperMeshPointFrame` | 16755 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16765 | function |  | 4 |
| `twistMeshGraphAxis` | 16773 | function |  | 4 |
| `addTwistMeshCurvePath` | 16777 | function |  | 2 |
| `appendSegment` | 16798 | arrow |  | 1 |
| `appendFill` | 16801 | arrow |  | 1 |
| `appendSignedSection` | 16807 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16856 | function |  | 6 |
| `updateTaperMeshPoints` | 16893 | function |  | 5 |
| `setTaperMeshPointsVisible` | 16972 | function |  | 5 |
| `renderTaperCurveEditor` | 16990 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17062 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17076 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17092 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17124 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17133 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17144 | function |  | 2 |
| `applyTaperCurveEdit` | 17152 | function |  | 10 |
| `openTaperCurveEditor` | 17260 | function |  | 3 |
| `closeTaperCurveEditor` | 17305 | function |  | 6 |
| `updateViewportStatsVisibility` | 17318 | function |  | 6 |
| `canvasToProfile` | 17337 | function |  | 2 |
| `renderSweepProfileEditor` | 17347 | function |  | 7 |
| `applySweepProfileEdit` | 17390 | function |  | 8 |
| `openSweepProfileEditor` | 17417 | function |  | 1 |
| `closeSweepProfileEditor` | 17452 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17461 | function |  | 2 |
| `addLock` | 17476 | function |  | 19 |
| `mirroredScalpRegion` | 17679 | function |  | 5 |
| `mirroredVector` | 17688 | function |  | 12 |
| `mirroredPlacementFrame` | 17692 | function |  | 2 |
| `mirrorPartnerFor` | 17705 | function |  | 40 |
| `decoupleMirrorPartner` | 17709 | function |  | 2 |
| `createMirrorPartner` | 17717 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17813 | function |  | 6 |
| `mirroredClumpPartners` | 17818 | function |  | 6 |
| `createMirroredClump` | 17824 | function |  | 3 |
| `decoupleMirroredClump` | 17846 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17855 | function |  | 6 |
| `syncActiveMirror` | 18020 | function |  | 25 |
| `setMirrorXEditing` | 18032 | function |  | 6 |
| `snapshotState` | 18056 | function |  | 7 |
| `scalpTriangleRegion` | 18313 | function |  | 4 |
| `closestPointOnActiveScalp` | 18326 | function |  | 12 |
| `rootAttachmentFrame` | 18398 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18410 | function |  | 4 |
| `resolveRootAttachment` | 18428 | function |  | 4 |
| `curvePointsToRootLocal` | 18468 | function |  | 2 |
| `curvePointsFromRootLocal` | 18480 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18488 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18504 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18534 | function |  | 2 |
| `createRootAttachment` | 18546 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18576 | function |  | 4 |
| `rootAttachmentToData` | 18603 | function |  | 2 |
| `rootAttachmentFromData` | 18631 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18670 | function |  | 2 |
| `remapPoint` | 18685 | arrow |  | 1 |
| `remapVector` | 18686 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18715 | function |  | 2 |
| `importHeadMeshFile` | 18732 | function |  | 3 |
| `importFullBodyMeshFile` | 18755 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18780 | function |  | 1 |
| `importedBooleanPreference` | 18813 | function |  | 11 |
| `loadPreferencesAndPresets` | 18827 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18897 | function |  | 1 |
| `openHairProjectFile` | 18940 | function |  | 4 |
| `dragContainsApplicationFile` | 18998 | function |  | 3 |
| `safelyRememberRecentProject` | 19007 | function |  | 2 |
| `renderRecentProjectsMenu` | 19016 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19048 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19073 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19077 | function |  | 2 |
| `pushUndoState` | 19093 | function |  | 118 |
| `undoLastAction` | 19100 | function |  | 2 |
| `redoLastAction` | 19114 | function |  | 2 |
| `updateHistoryButtons` | 19128 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19133 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19150 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19157 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19195 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19272 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19298 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19330 | function |  | 2 |
| `finalizeStateRestore` | 19371 | function |  | 2 |
| `restoreState` | 19378 | function |  | 5 |
| `disposeAllEditableObjects` | 19402 | function |  | 2 |
| `restoreLock` | 19423 | function |  | 4 |
| `restoreGuide` | 19640 | function |  | 2 |
| `vectorToData` | 19701 | function |  | 29 |
| `dataToVector` | 19705 | function |  | 31 |
| `frameToData` | 19709 | function |  | 2 |
| `frameFromData` | 19721 | function |  | 2 |
| `applyPresetSelection` | 19733 | function |  | 2 |
| `drawPresetThumbnail` | 19764 | function |  | 1 |
| `fillHair` | 19779 | arrow |  | 9 |
| `strand` | 19791 | arrow |  | 31 |
| `bun` | 19809 | arrow |  | 2 |
| `braid` | 19844 | arrow |  | 2 |
| `renderPresetLibrary` | 19933 | function |  | 3 |
| `setPresetLibraryOpen` | 19992 | function |  | 6 |
| `average` | 20005 | function |  | 4 |
| `fitPointAttributes` | 20009 | function |  | 9 |
| `rebuildCurveObjects` | 20038 | function |  | 10 |
| `createCurvePoints` | 20050 | function |  | 2 |
| `addGeneratedBangPreset` | 20059 | function |  | 1 |
| `sampleScalpQuad` | 20152 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20176 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20225 | function |  | 1 |
| `columns` | 20226 | arrow |  | 1 |
| `layer` | 20230 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20444 | function |  | 2 |
| `addBraidedBobPreset` | 20480 | function |  | 1 |
| `evenColumns` | 20481 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20697 | function |  | 1 |
| `scalpSeed` | 20720 | arrow |  | 1 |
| `createBowlCutPoints` | 21007 | function |  | 2 |
| `addBowlCutPreset` | 21045 | function |  | 1 |
| `scalpRegionAtHit` | 21111 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21123 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21130 | function |  | 12 |
| `braidStrokeActive` | 21137 | function |  | 9 |
| `proceduralDrawActive` | 21141 | function |  | 3 |
| `panelStrokeActive` | 21145 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21149 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21153 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 21157 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21163 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21167 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 21171 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21175 | function |  | 3 |
| `liveSurfaceStrandId` | 21185 | function |  | 4 |
| `liveSurfaceStrand` | 21189 | function |  | 4 |
| `liveSurfaceGuideId` | 21194 | function |  | 3 |
| `guideSupportsLiveSurface` | 21198 | function |  | 2 |
| `liveSurfaceGuide` | 21205 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21212 | function |  | 12 |
| `activeStrokeScalpOffset` | 21252 | function |  | 4 |
| `activeStrokeBrushSize` | 21258 | function |  | 10 |
| `activeStrokeBrushDepth` | 21264 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21270 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21278 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21288 | function |  | 13 |
| `worldNormalAtHit` | 21327 | function |  | 6 |
| `selectedPolyMesh` | 21335 | function |  | 10 |
| `addPolyLock` | 21340 | function |  | 2 |
| `ensurePolyMesh` | 21359 | function |  | 3 |
| `polySurfaceSample` | 21363 | function |  | 4 |
| `polyTargetAtEvent` | 21374 | function |  | 6 |
| `refreshPolyMesh` | 21400 | function |  | 10 |
| `ensurePolyFillPreview` | 21409 | function |  | 2 |
| `clearPolyFillPreview` | 21446 | function |  | 17 |
| `polyFillCandidateForEvent` | 21451 | function |  | 3 |
| `showPolyFillPreview` | 21471 | function |  | 2 |
| `updatePolyFillPreview` | 21497 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21522 | function |  | 5 |
| `fillPolyGap` | 21532 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21543 | function |  | 2 |
| `projectPolyRelaxPoint` | 21563 | function |  | 2 |
| `removePolyPointAttributes` | 21607 | function |  | 3 |
| `deletePolyComponent` | 21616 | function |  | 2 |
| `addPolyPoint` | 21639 | function |  | 4 |
| `appendPolyStrokeRow` | 21648 | function |  | 4 |
| `beginPolyBrushPointer` | 21668 | function |  | 1 |
| `finishPolyAltDelete` | 21754 | function |  | 1 |
| `updatePolyBrushStroke` | 21768 | function |  | 1 |
| `finishPolyBrushStroke` | 21858 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21895 | function |  | 2 |
| `drawSampleFromHit` | 21918 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21932 | function |  | 3 |
| `strokeLength` | 21969 | function |  | 9 |
| `resampleDrawStroke` | 21975 | function |  | 2 |
| `processedDrawStroke` | 22007 | function |  | 8 |
| `strokeSurfaceNormals` | 22036 | function |  | 7 |
| `drawClumpFrame` | 22047 | function |  | 4 |
| `nearestCurveParameter` | 22056 | function |  | 2 |
| `drawClumpSampleNormal` | 22070 | function |  | 6 |
| `drawClumpTemplateVector` | 22079 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22085 | function |  | 3 |
| `drawClumpStrandMaps` | 22101 | function |  | 4 |
| `nextClumpName` | 22156 | function |  | 6 |
| `initializeClumpShape` | 22163 | function |  | 5 |
| `stableClumpVariation` | 22174 | function |  | 3 |
| `createClumpFromLocks` | 22186 | function |  | 7 |
| `addLockToClump` | 22211 | function |  | 4 |
| `stableBranchBaseNormals` | 22229 | function |  | 4 |
| `ensureBranchParentNormalField` | 22240 | function |  | 2 |
| `branchParentFrame` | 22246 | function |  | 7 |
| `branchLocalVector` | 22258 | function |  | 3 |
| `branchWorldVector` | 22262 | function |  | 4 |
| `captureBranchLocalState` | 22268 | function |  | 6 |
| `enforceBranchRootPosition` | 22296 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22346 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22373 | function |  | 2 |
| `clampRegionParam` | 22420 | function |  | 113 |
| `branchRootRegionFromParam` | 22427 | function |  | 4 |
| `cloneBranchRootRegion` | 22450 | function |  | 5 |
| `flip` | 22452 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22485 | function |  | 8 |
| `setBranchRootRegionPoint` | 22516 | function |  | 3 |
| `branchRegionUVToCanvas` | 22550 | function |  | 10 |
| `branchRegionCanvasToUV` | 22553 | function |  | 4 |
| `openBranchRegionEditor` | 22559 | function |  | 2 |
| `closeBranchRegionEditor` | 22573 | function |  | 2 |
| `retargetBranchRegionEditor` | 22579 | function |  | 2 |
| `renderBranchRegionEditor` | 22584 | function |  | 9 |
| `applyBranchRegionView` | 22670 | function |  | 6 |
| `resetBranchRegionZoom` | 22673 | function |  | 1 |
| `branchRegionNavAction` | 22679 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22693 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22713 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22717 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22743 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22755 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22760 | function |  | 1 |
| `branchRegionEventUV` | 22780 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22788 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 22893 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23026 | function |  | 1 |
| `pointerToNdc` | 23031 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23041 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23055 | function |  | 1 |
| `endBranchSweepStartDrag` | 23078 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23085 | function |  | 5 |
| `gridProfileSkipCol` | 23112 | function |  | 3 |
| `branchRootRegionSurface` | 23121 | function |  | 6 |
| `toGridCol` | 23146 | arrow |  | 5 |
| `toRow` | 23150 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23205 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23225 | function |  | 2 |
| `pointAt` | 23231 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23258 | function |  | 3 |
| `applyBranchRootOffset` | 23330 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23349 | function |  | 3 |
| `branchChildrenFor` | 23369 | function |  | 9 |
| `detachBranch` | 23373 | function |  | 2 |
| `updateBranchChildren` | 23384 | function |  | 4 |
| `clumpDirectMembers` | 23427 | function |  | 3 |
| `clumpMembersForGuide` | 23432 | function |  | 6 |
| `clumpGuideForLock` | 23436 | function |  | 13 |
| `proceduralGuideForLock` | 23441 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23448 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23455 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23462 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23474 | function |  | 2 |
| `applyProceduralBranchSettings` | 23487 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23526 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23542 | function |  | 3 |
| `createProceduralAccessoryLock` | 23556 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23608 | function |  | 2 |
| `clumpFrameAt` | 23659 | function |  | 5 |
| `commitClumpMemberRestState` | 23667 | function |  | 10 |
| `updateClumpMembers` | 23750 | function |  | 10 |
| `dissolveClump` | 23854 | function |  | 6 |
| `detachLockFromClump` | 23891 | function |  | 4 |
| `updateDrawVolumePreview` | 23917 | function |  | 5 |
| `hideDrawClumpPreviews` | 23941 | function |  | 5 |
| `resetDrawVolumePreview` | 23947 | function |  | 3 |
| `updateDrawStrandPreview` | 23953 | function |  | 23 |
| `continueFromTipEnabled` | 24172 | function |  | 2 |
| `selectedTipContinuationLock` | 24178 | function |  | 3 |
| `selectedDrawBranchPoint` | 24191 | function |  | 3 |
| `canBranchDrawFromLock` | 24208 | function |  | 3 |
| `beginDrawStrandStroke` | 24215 | function |  | 2 |
| `beginDrawFreePlane` | 24340 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24354 | function |  | 2 |
| `updateDrawStrandStroke` | 24379 | function |  | 1 |
| `createDrawnLock` | 24425 | function |  | 3 |
| `setting` | 24429 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24497 | function |  | 4 |
| `createDrawnBraid` | 24505 | function |  | 2 |
| `createDrawnStrand` | 24562 | function |  | 2 |
| `createDrawnPanel` | 24689 | function |  | 2 |
| `surfaceLatticeNormal` | 24739 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24754 | function |  | 3 |
| `createViewportSurface` | 24819 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24848 | function |  | 6 |
| `hideLoftSurfacePreviews` | 24854 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 24861 | function |  | 4 |
| `updateLoftSurfacePreview` | 24870 | function |  | 5 |
| `resetLoftSurfaceDraft` | 24902 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 24918 | function |  | 3 |
| `cloneCurveSurfaceSource` | 24936 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 24958 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 24984 | function |  | 3 |
| `curveSurfaceProfilePoints` | 24994 | function |  | 3 |
| `curveSurfaceProfileNormals` | 24998 | function |  | 2 |
| `curveSurfacePreviewLock` | 25007 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25030 | function |  | 2 |
| `hideCurveSurfacePreview` | 25046 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25058 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25063 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25072 | function |  | 3 |
| `curveSurfaceSideVector` | 25110 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25123 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25131 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25144 | function |  | 5 |
| `updateCurveSurfacePreview` | 25164 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25226 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25248 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25263 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25311 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25346 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25378 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25436 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25513 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25518 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25527 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25561 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25572 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25602 | function |  | 2 |
| `extendDrawnStrand` | 25659 | function |  | 2 |
| `finishDrawStrandStroke` | 25692 | function |  | 7 |
| `createPlacedStrand` | 25719 | function |  | 2 |
| `placedPointCount` | 25783 | function |  | 3 |
| `createPlacedPoints` | 25787 | function |  | 3 |
| `pushPointOutsideHead` | 25806 | function |  | 8 |
| `resizePlacedStrand` | 25838 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 25855 | function |  | 5 |
| `beginPlaceEdit` | 25860 | function |  | 2 |
| `updatePlaceEdit` | 25878 | function |  | 1 |
| `updatePlacementLength` | 25892 | function |  | 3 |
| `updatePlacementOrientation` | 25902 | function |  | 3 |
| `endPlaceEdit` | 25920 | function |  | 1 |
| `confirmPendingPlacedStrand` | 25935 | function |  | 1 |
| `pendingPlacedLock` | 25945 | function |  | 2 |
| `beginPlacementPointer` | 25949 | function |  | 3 |
| `finishPlacementPointer` | 25959 | function |  | 2 |
| `confirmPlacementStep` | 25983 | function |  | 2 |
| `finishPlacementFlow` | 26006 | function |  | 7 |
| `updatePlacementStatus` | 26019 | function |  | 82 |
| `deselectStrands` | 26158 | function |  | 12 |
| `beginSelectionMarquee` | 26173 | function |  | 3 |
| `beginAltOrbit` | 26197 | function |  | 1 |
| `beginBlenderNavigation` | 26209 | function |  | 1 |
| `endBlenderNavigation` | 26254 | function |  | 1 |
| `prepareSelectPointerCapture` | 26262 | function |  | 1 |
| `endSelectPointerCapture` | 26268 | function |  | 1 |
| `endAltOrbit` | 26274 | function |  | 1 |
| `dollyCameraByDrag` | 26281 | function |  | 2 |
| `fastDragMagnitude` | 26304 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26310 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26318 | function |  | 1 |
| `endHoudiniZoomDrag` | 26335 | function |  | 1 |
| `updateSelectionMarquee` | 26343 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26360 | function |  | 3 |
| `selectPointsInMarquee` | 26368 | function |  | 2 |
| `pointKey` | 26394 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26425 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26462 | function |  | 3 |
| `projectedPoint` | 26479 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26508 | function |  | 2 |
| `finishSelectionMarquee` | 26553 | function |  | 2 |
| `headMeshes` | 26576 | function |  | 9 |
| `strandSplitProfileData` | 26584 | function |  | 4 |
| `strandSplitControlPoint` | 26597 | function |  | 4 |
| `panelSplitControlPoint` | 26633 | function |  | 6 |
| `strandControlPointRaycast` | 26689 | function |  | 1 |
| `strandControlPointFrame` | 26724 | function |  | 6 |
| `branchRootGizmoFrame` | 26755 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26773 | function |  | 5 |
| `createCurveObjects` | 26831 | function |  | 4 |
| `polyEdgeKey` | 27004 | function |  | 2 |
| `polyMeshEdges` | 27008 | function |  | 2 |
| `populatePolyEditObjects` | 27022 | function |  | 3 |
| `createPolyEditObjects` | 27083 | function |  | 2 |
| `rebuildPolyEditObjects` | 27091 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27105 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27112 | function |  | 2 |
| `strandWidthEdgeSample` | 27121 | function |  | 3 |
| `strandWidthEdgePoints` | 27144 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27158 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27162 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27169 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27181 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27186 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27192 | function |  | 3 |
| `updateCurveObjects` | 27206 | function |  | 41 |
| `createCurveNormalIndicator` | 27463 | function |  | 2 |
| `pointUpDirection` | 27489 | function |  | 2 |
| `curveFrameAtPoint` | 27493 | function |  | 5 |
| `curveFrameAt` | 27514 | function |  | 10 |
| `strandTwistAt` | 27534 | function |  | 6 |
| `controlPointRotationAt` | 27539 | function |  | 6 |
| `strandProfileTwistAt` | 27543 | function |  | 2 |
| `strandFrameAt` | 27549 | function |  | 1 |
| `curveFrameAtSnapshot` | 27555 | function |  | 3 |
| `outwardNormalAtPoint` | 27574 | function |  | 11 |
| `sampledSurfaceNormal` | 27586 | function |  | 2 |
| `guidedNormalAt` | 27602 | function |  | 5 |
| `twistFromHandle` | 27621 | function |  | 3 |
| `signedAngleAroundAxis` | 27642 | function |  | 5 |
| `handleColor` | 27649 | function |  | 2 |
| `isAffectedCurvePoint` | 27672 | function |  | 2 |
| `syncLockFromCurve` | 27678 | function |  | 26 |
| `labelForPreset` | 27708 | function |  | 1 |
| `rebuildLockGeometry` | 27712 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27739 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27747 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27753 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27775 | function |  | 8 |
| `updateLockGeometry` | 27788 | function |  | 57 |
| `setGroupColorView` | 27809 | function |  | 2 |
| `createUvCheckerTexture` | 27819 | function |  | 3 |
| `ensureUvCheckerForLock` | 27855 | function |  | 4 |
| `removeUvCheckerFromLock` | 27888 | function |  | 3 |
| `invalidateUvInspector` | 27903 | function |  | 7 |
| `uvInspectorRecord` | 27907 | function |  | 1 |
| `uvInspectorRecords` | 27946 | function |  | 2 |
| `drawUvInspectorGrid` | 27950 | function |  | 2 |
| `renderUvInspector` | 27984 | function |  | 3 |
| `setUvCheckerEnabled` | 28043 | function |  | 3 |
| `strandViewportBaseColor` | 28060 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28095 | function |  | 3 |
| `syncStrandSelectionOutline` | 28101 | function |  | 2 |
| `applyLockedStrandPalette` | 28112 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28121 | function |  | 6 |
| `setStrandSelectionVisual` | 28130 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28146 | function |  | 2 |
| `syncProceduralParentVisibility` | 28153 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28162 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28166 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28170 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28183 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28203 | function |  | 3 |
| `selectLock` | 28236 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28289 | function |  | 6 |
| `syncGroupInputs` | 28300 | function |  | 2 |
| `topologyStatsForLock` | 28333 | function |  | 4 |
| `formatTopologyStats` | 28341 | function |  | 5 |
| `updateTopologyStats` | 28345 | function |  | 20 |
| `normalizeBraidDimensions` | 28379 | function |  | 3 |
| `normalizeStrandDimensions` | 28392 | function |  | 3 |
| `strandBaseWidth` | 28406 | function |  | 5 |
| `strandWidthDimension` | 28410 | function |  | 5 |
| `strandDepthDimension` | 28418 | function |  | 8 |
| `setStrandWidthDimension` | 28426 | function |  | 2 |
| `setStrandDepthDimension` | 28448 | function |  | 4 |
| `syncShapeDimensionInputs` | 28464 | function |  | 4 |
| `syncCreationShapeInputs` | 28500 | function |  | 3 |
| `syncViewportDrawSettings` | 28538 | function |  | 5 |
| `syncPanelShapeInputs` | 28552 | function |  | 6 |
| `syncStrandSplitInputs` | 28578 | function |  | 4 |
| `syncHairCardControls` | 28587 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28595 | function |  | 3 |
| `updateAttributeEditorMode` | 28634 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28784 | function |  | 3 |
| `curveLatticeForGroup` | 28807 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28825 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 28870 | function |  | 2 |
| `showCurveLatticeForGroup` | 28887 | function |  | 2 |
| `selectStrandGroup` | 28924 | function |  | 3 |
| `selectCurvePoint` | 28966 | function |  | 10 |
| `updateSelectedPointLabel` | 28980 | function |  | 14 |
| `syncInputs` | 28993 | function |  | 15 |
| `syncClumpGuidePanel` | 29039 | function |  | 3 |
| `getSelectedLock` | 29066 | function |  | 104 |
| `selectedLocksInOrder` | 29070 | function |  | 37 |
| `lockStrands` | 29076 | function |  | 3 |
| `lockSelectedStrands` | 29109 | function |  | 3 |
| `unlockStrands` | 29115 | function |  | 3 |
| `unlockAllStrands` | 29130 | function |  | 3 |
| `strandEditFamily` | 29134 | function |  | 7 |
| `compatibleSelectedLocks` | 29139 | function |  | 6 |
| `selectedEditRoots` | 29146 | function |  | 2 |
| `editSelectedLocks` | 29159 | function |  | 20 |
| `multiEditValuesEqual` | 29192 | function |  | 2 |
| `setMixedControl` | 29201 | function |  | 28 |
| `syncMultiStrandInputs` | 29218 | function |  | 16 |
| `values` | 29234 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29314 | function |  | 5 |
| `createCompoundStrand` | 29321 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29382 | function |  | 9 |
| `openRebuildCurveDialog` | 29395 | function |  | 1 |
| `rebuildSelectedCurves` | 29409 | function |  | 2 |
| `selectionCanBecomeClump` | 29448 | function |  | 4 |
| `createClumpFromSelection` | 29453 | function |  | 3 |
| `cleanSelectionSets` | 29465 | function |  | 2 |
| `createSelectionSetFromSelection` | 29470 | function |  | 3 |
| `selectionSetById` | 29481 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29485 | function |  | 7 |
| `editSelectionSetFromSelection` | 29494 | function |  | 5 |
| `deleteSelectionSet` | 29514 | function |  | 2 |
| `selectSelectionSet` | 29523 | function |  | 2 |
| `deleteSelectedStrands` | 29533 | function |  | 4 |
| `deleteGuide` | 29541 | function |  | 3 |
| `deleteSelectedGuide` | 29564 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29568 | function |  | 4 |
| `hasDeletableSelection` | 29581 | function |  | 2 |
| `deleteCurrentSelection` | 29589 | function |  | 3 |
| `hideOutlinerContextMenu` | 29597 | function |  | 17 |
| `outlinerLockTargets` | 29602 | function |  | 3 |
| `showOutlinerContextMenu` | 29629 | function |  | 10 |
| `hideStrandRadialMenu` | 29709 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29720 | function |  | 3 |
| `radialButtonDimensions` | 29733 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29742 | function |  | 3 |
| `applyRadialMenuDimensions` | 29759 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29765 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29778 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29799 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29816 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29825 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29847 | function |  | 5 |
| `clumpMirrorRadialOptions` | 29865 | function |  | 2 |
| `contextualRadialOptions` | 29872 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30001 | function |  | 3 |
| `layoutContextualRadialOptions` | 30005 | function |  | 4 |
| `renderRadialActionList` | 30029 | function |  | 3 |
| `radialListOptionAtPointer` | 30047 | function |  | 3 |
| `syncRadialListHighlight` | 30069 | function |  | 3 |
| `configureContextualRadialMenu` | 30075 | function |  | 3 |
| `beginStrandRadialGesture` | 30135 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30169 | function |  | 2 |
| `updateStrandRadialGesture` | 30215 | function |  | 1 |
| `performStrandRadialAction` | 30254 | function |  | 2 |
| `finishStrandRadialGesture` | 30357 | function |  | 2 |
| `cancelStrandRadialGesture` | 30367 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30374 | function |  | 1 |
| `setPullMoveEnabled` | 30380 | function |  | 3 |
| `toolRadialOptions` | 30388 | function |  | 2 |
| `hideToolRadialMenu` | 30413 | function |  | 4 |
| `beginToolRadialGesture` | 30426 | function |  | 2 |
| `beginToolShortcutPress` | 30466 | function |  | 2 |
| `finishToolShortcutPress` | 30481 | function |  | 2 |
| `cancelToolShortcutPress` | 30490 | function |  | 5 |
| `setRadialMenusEnabled` | 30498 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30511 | function |  | 5 |
| `setNavigationTipsEnabled` | 30526 | function |  | 5 |
| `configureNavigationMouseButtons` | 30533 | function |  | 3 |
| `syncNavigationModifierLocks` | 30546 | function |  | 7 |
| `setNavigationStyle` | 30551 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30567 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30582 | function |  | 5 |
| `setCameraSmoothingStrength` | 30588 | function |  | 5 |
| `setScaleSensitivity` | 30596 | function |  | 3 |
| `setToolTipsEnabled` | 30604 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30611 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30620 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30628 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30643 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30652 | function |  | 5 |
| `sideNamingDisplayId` | 30661 | function |  | 3 |
| `referenceViewDisplayLabel` | 30673 | function |  | 6 |
| `strandRegionDisplayLabel` | 30683 | function |  | 10 |
| `updateSideNamingLabels` | 30701 | function |  | 2 |
| `setSideNamingPerspective` | 30728 | function |  | 5 |
| `setControlPointDisplaySize` | 30737 | function |  | 6 |
| `scaleHexColor` | 30749 | function |  | 3 |
| `setViewportBackgroundColor` | 30754 | function |  | 7 |
| `setDefaultHairShader` | 30776 | function |  | 5 |
| `setPreferenceCategory` | 30782 | function |  | 4 |
| `openPreferencesDialog` | 30809 | function |  | 1 |
| `savePreferencesDialog` | 30837 | function |  | 1 |
| `cancelPreferencesDialog` | 30861 | function |  | 3 |
| `updateToolRadialGesture` | 30890 | function |  | 1 |
| `performToolRadialAction` | 30919 | function |  | 2 |
| `finishToolRadialGesture` | 30929 | function |  | 2 |
| `cancelToolRadialGesture` | 30938 | function |  | 5 |
| `duplicatePlacementTarget` | 30945 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 30972 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 30976 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 30986 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 30991 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31003 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31014 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31022 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31039 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31060 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31071 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31077 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31083 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31116 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31271 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31373 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31414 | function |  | 2 |
| `updateDuplicatePlacement` | 31441 | function |  | 2 |
| `beginDuplicatePlacement` | 31505 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31569 | function |  | 2 |
| `confirmDuplicatePlacement` | 31610 | function |  | 1 |
| `cancelDuplicatePlacement` | 31647 | function |  | 4 |
| `outlinerClumpLocks` | 31673 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31677 | function |  | 3 |
| `createOutlinerStrandButton` | 31700 | function |  | 4 |
| `createOutlinerCurveSurface` | 31786 | function |  | 2 |
| `createOutlinerClump` | 31882 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 31964 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 31971 | function |  | 2 |
| `renderLockList` | 32050 | function |  | 70 |
| `updateCount` | 32204 | function |  | 34 |
| `captureInputUndo` | 32213 | function |  | 1 |
| `bindUndoCapture` | 32219 | function |  | 36 |
| `bindLockInput` | 32230 | function |  | 2 |
| `applyValue` | 32247 | arrow |  | 2 |
| `applyUniformTransformScale` | 32566 | function |  | 2 |
| `applyReducedTransformScale` | 32583 | function |  | 2 |
| `applyTransformPrecision` | 32622 | function |  | 2 |
| `updateTransformScalePointer` | 32651 | function |  | 1 |
| `finishSweepProfileDrag` | 32882 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 32978 | function |  | 3 |
| `finishTaperCurveDrag` | 33040 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33083 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33164 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33219 | function |  | 6 |
| `updateSelectedTaperPoint` | 33243 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33813 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33818 | function |  | 4 |
| `syncDrawCurlControls` | 33873 | function |  | 5 |
| `handleLiveSurfaceChange` | 33921 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34003 | function |  | 3 |
| `resampleSurfaceLock` | 34018 | function |  | 2 |
| `changePanelSplitCount` | 34131 | function |  | 3 |
| `applyPresetControl` | 34239 | function |  | 2 |
| `applyCreationToolSettings` | 34260 | function |  | 2 |
| `populateCreationPresetSelect` | 34304 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34328 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34361 | function |  | 5 |
| `createCustomCreationPreset` | 34369 | function |  | 3 |
| `createCustomClumpPreset` | 34384 | function |  | 3 |
| `commitCustomCreationPreset` | 34399 | function |  | 2 |
| `openRemoveCreationPreset` | 34460 | function |  | 3 |
| `commitRemoveCreationPreset` | 34473 | function |  | 1 |
| `applyBraidToolPreset` | 34490 | function |  | 2 |
| `selectedBranchChildLock` | 34602 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34606 | function |  | 2 |
| `initPanelResizeHandles` | 34712 | function |  | 2 |
| `applyWidth` | 34718 | arrow |  | 2 |
| `restoreWidth` | 34725 | arrow |  | 2 |
| `bindResize` | 34733 | arrow |  | 2 |
| `onMove` | 34741 | arrow |  | 0 |
| `onUp` | 34745 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 34762 | function |  | 2 |
| `initFloatingPanelControls` | 34771 | function |  | 2 |
| `detach` | 34780 | arrow |  | 43 |
| `endDrag` | 34818 | arrow |  | 0 |
| `endResize` | 34850 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 34861 | function |  | 3 |
| `selectPatchNotesVersion` | 34995 | function |  | 3 |
| `requestReferenceImage` | 35028 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35232 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35238 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35245 | function |  | 1 |
| `deleteLocks` | 35812 | function |  | 10 |
| `disposeCurveObjects` | 35890 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 35942 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 35973 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36048 | function |  | 2 |
| `resize` | 36081 | function |  | 4 |
| `handleViewportPointerMove` | 36092 | function |  | 1 |
| `blockProportionalSizingEvent` | 36103 | function |  | 1 |
| `updateLightAngleFromInputs` | 36109 | function |  | 2 |
| `startViewSnap` | 36123 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36153 | function |  | 3 |
| `trackViewportPointerDown` | 36170 | function |  | 1 |
| `trackViewportPointerMove` | 36186 | function |  | 1 |
| `clearViewportPointer` | 36194 | function |  | 1 |
| `updateViewSnap` | 36199 | function |  | 1 |
| `nearestCardinalAxis` | 36235 | function |  | 5 |
| `cardinalAxisKey` | 36249 | function |  | 5 |
| `steppedDragAmount` | 36253 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36259 | function |  | 4 |
| `endViewSnap` | 36275 | function |  | 4 |
| `activateStrandControlPoint` | 36285 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36335 | function |  | 4 |
| `addStrandControlPointSelection` | 36362 | function |  | 3 |
| `removeStrandControlPointSelection` | 36379 | function |  | 3 |
| `sampleStrandPointNormal` | 36393 | function |  | 2 |
| `sampleStrandPointVectors` | 36403 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36409 | function |  | 2 |
| `resampleStrandCurveData` | 36420 | function |  | 4 |
| `resampleMatchingVectors` | 36426 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36465 | function |  | 4 |
| `removeStrandCurvePoint` | 36476 | function |  | 2 |
| `closestStrandCurveParameter` | 36489 | function |  | 2 |
| `insertStrandCurvePoint` | 36518 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36535 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36545 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36561 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36568 | function |  | 4 |
| `prepareCurvePointSelection` | 36590 | function |  | 1 |
| `finishCurvePointInsertion` | 36701 | function |  | 1 |
| `finishPointRemoval` | 36716 | function |  | 1 |
| `editableStrandWidth` | 36734 | function |  | 6 |
| `editableStrandWidthBounds` | 36746 | function |  | 2 |
| `applyEditableStrandWidth` | 36752 | function |  | 3 |
| `viewportPixelPoint` | 36788 | function |  | 3 |
| `syncSculptBrushControls` | 36796 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 36811 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 36819 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 36827 | function |  | 1 |
| `sculptBrushPlaneOffset` | 36833 | function |  | 5 |
| `setSculptBrushCursorVisible` | 36837 | function |  | 7 |
| `updateSculptBrushCursor` | 36844 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 36866 | function |  | 4 |
| `sculptBrushEditableLock` | 36873 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 36883 | function |  | 5 |
| `sculptBrushLockViable` | 36889 | function |  | 5 |
| `sculptBrushUnits` | 36900 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 36938 | function |  | 4 |
| `sculptBrushPointWeight` | 36988 | function |  | 5 |
| `sculptBrushWorldDelta` | 36998 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37007 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37033 | function |  | 2 |
| `beginSculptMoveStroke` | 37091 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37153 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37388 | function |  | 3 |
| `updateSculptMoveStroke` | 37397 | function |  | 1 |
| `finishSculptMoveStroke` | 37413 | function |  | 3 |
| `strandControlPointHit` | 37461 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37465 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37543 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37577 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37617 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37630 | function |  | 1 |
| `setHoveredControlPoint` | 37669 | function |  | 7 |
| `visibleControlPointHoverTargets` | 37682 | function |  | 2 |
| `updateControlPointHover` | 37718 | function |  | 1 |
| `animate` | 38274 | function |  | 2 |
| `syncCompactSidebarLayout` | 38305 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38324 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38330 | function |  | 3 |
| `setAttributeEditorTab` | 38336 | function |  | 6 |

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
