# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1715** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38774 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 244 | function |  | 3 |
| `saveBooleanPreference` | 272 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 276 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 281 | function |  | 2 |
| `normalizeScaleSensitivity` | 286 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 291 | function |  | 2 |
| `normalizeSideNamingPerspective` | 296 | function |  | 2 |
| `normalizeNavigationStyle` | 300 | function |  | 2 |
| `setupEditableSliderControls` | 314 | function |  | 2 |
| `syncNumberFromRange` | 365 | arrow |  | 0 |
| `applyNumberValue` | 372 | arrow |  | 0 |
| `copyCameraPose` | 482 | function |  | 3 |
| `updateCameraProjectionForViewport` | 488 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 501 | function |  | 3 |
| `setOrthographicView` | 507 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 547 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 576 | function |  | 2 |
| `removeRotateFreeAxisRing` | 602 | function |  | 2 |
| `deflateTransformGizmoPickers` | 614 | function |  | 2 |
| `nextStrandName` | 997 | function |  | 2 |
| `activeDrawClumpTemplate` | 1082 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1087 | function |  | 3 |
| `drawModeCreatesClump` | 1114 | function |  | 1 |
| `isPanelGeometry` | 1258 | function |  | 31 |
| `normalizePanelSplits` | 1262 | function |  | 3 |
| `clonePanelSplits` | 1274 | function |  | 19 |
| `snapPanelSplitHeight` | 1278 | function |  | 5 |
| `createQuadSphereGeometry` | 1313 | function |  | 2 |
| `vertexIndex` | 1327 | function |  | 11 |
| `addEdge` | 1345 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1380 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1450 | function |  | 3 |
| `updateScalpRenderGeometry` | 1477 | function |  | 4 |
| `writeScalpRegionColors` | 1528 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1541 | function |  | 2 |
| `createScalpSelectionOutline` | 1571 | function |  | 5 |
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
| `currentStrandSelectionState` | 2101 | function |  | 4 |
| `applyStrandSelectionState` | 2105 | function |  | 5 |
| `clearStrandSelectionState` | 2110 | function |  | 7 |
| `guideHeadBounds` | 3239 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3249 | function |  | 5 |
| `disposeGuideModel` | 3263 | function |  | 3 |
| `syncHeadTransformInputs` | 3274 | function |  | 4 |
| `applyHeadTransform` | 3281 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3299 | function |  | 4 |
| `applyScalpRoughScale` | 3308 | function |  | 5 |
| `resetHeadTransform` | 3322 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3336 | function |  | 2 |
| `installGuideModel` | 3352 | function |  | 5 |
| `loadDefaultGuideModel` | 3428 | function |  | 3 |
| `braidTemplateFromEntries` | 3451 | function |  | 4 |
| `braidMeshEntries` | 3483 | function |  | 2 |
| `prepareBraidBodyCache` | 3495 | function |  | 2 |
| `quantize` | 3504 | arrow |  | 21 |
| `sourceNormalAt` | 3516 | arrow |  | 1 |
| `clusterBoundary` | 3519 | arrow |  | 2 |
| `normalBuckets` | 3536 | arrow |  | 2 |
| `applyBucketPair` | 3568 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3599 | function |  | 2 |
| `annotateBraidObjTopology` | 3620 | function |  | 2 |
| `loadBraidMeshPreset` | 3640 | function |  | 3 |
| `createSplitControlHandle` | 3657 | function |  | 4 |
| `frameGuideModel` | 3672 | function |  | 2 |
| `syncScalpInputs` | 3697 | function |  | 2 |
| `syncScalpArtistInputs` | 3703 | function |  | 2 |
| `rootScalpOffsetDistance` | 3711 | function |  | 15 |
| `applyLockRootScalpOffset` | 3716 | function |  | 5 |
| `normalizeHairLayer` | 3732 | function |  | 28 |
| `layerOffsetForLock` | 3736 | function |  | 9 |
| `layerRootOffsetFactor` | 3741 | function |  | 13 |
| `layerOffsetWeight` | 3745 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3751 | function |  | 5 |
| `pointsWithLayerOffset` | 3760 | function |  | 3 |
| `layerDirectionForLock` | 3768 | function |  | 2 |
| `applyLayerOffset` | 3779 | function |  | 5 |
| `setLockHairLayer` | 3803 | function |  | 2 |
| `setGroupLayerOffset` | 3818 | function |  | 2 |
| `scalpArtistWeight` | 3830 | function |  | 3 |
| `scalpArtistScalesAt` | 3834 | function |  | 3 |
| `applyScalpArtistShape` | 3844 | function |  | 5 |
| `inverseScalpArtistShape` | 3862 | function |  | 2 |
| `updateScalpSurface` | 3889 | function |  | 3 |
| `setActiveScalpRegion` | 3899 | function |  | 2 |
| `clearScalpRegions` | 3911 | function |  | 2 |
| `scalpHitFromEvent` | 3928 | function |  | 3 |
| `updateScalpBrushCursor` | 3936 | function |  | 4 |
| `paintScalpAt` | 3951 | function |  | 3 |
| `beginScalpPaint` | 4018 | function |  | 2 |
| `updateScalpPaint` | 4027 | function |  | 1 |
| `endScalpPaint` | 4036 | function |  | 2 |
| `createScalpLattice` | 4043 | function |  | 2 |
| `resetScalpLattice` | 4068 | function |  | 1 |
| `updateScalpLatticeObjects` | 4080 | function |  | 7 |
| `quadraticWeights` | 4094 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4099 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4126 | function |  | 3 |
| `selectScalpLatticePoint` | 4141 | function |  | 2 |
| `beginScalpLatticeDrag` | 4156 | function |  | 2 |
| `updateScalpLatticeDrag` | 4174 | function |  | 1 |
| `endScalpLatticeDrag` | 4192 | function |  | 2 |
| `setHeadReferenceTransparency` | 4198 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4208 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4226 | function |  | 3 |
| `trianglePlaneIntersections` | 4234 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4255 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4281 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4291 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4303 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4327 | function |  | 3 |
| `createScalpBuilderPlanes` | 4342 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4374 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4413 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4436 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4448 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4460 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4465 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4477 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4587 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4612 | function |  | 5 |
| `syncEditedScalpSurface` | 4627 | function |  | 4 |
| `ensureEditedScalpSurface` | 4698 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4728 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4813 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4826 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4842 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4852 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4870 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4883 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4890 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4909 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4923 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4964 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4973 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4986 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 5007 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5144 | function |  | 2 |
| `scalpTemplateNeighbors` | 5152 | function |  | 2 |
| `smoothScalpVectorField` | 5164 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5178 | function |  | 2 |
| `upperContourCurve` | 5195 | function |  | 4 |
| `hermitePoint` | 5230 | function |  | 2 |
| `curveNetworkSection` | 5241 | function |  | 3 |
| `pointAlongSection` | 5270 | function |  | 3 |
| `longestStitchedContour` | 5276 | function |  | 2 |
| `nodeForPoint` | 5284 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5341 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5351 | function |  | 1 |
| `orderedRange` | 5363 | arrow |  | 3 |
| `clipSegment` | 5386 | arrow |  | 1 |
| `liftedPoint` | 5409 | arrow |  | 5 |
| `boundaryCorner` | 5414 | arrow |  | 4 |
| `surfaceCurveBetween` | 5423 | arrow |  | 1 |
| `addSurfaceConnector` | 5446 | arrow |  | 2 |
| `sideContourAtDepth` | 5514 | arrow |  | 3 |
| `addSurfacePatch` | 5548 | arrow |  | 1 |
| `addCenterBridgePatch` | 5628 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5736 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5771 | function |  | 1 |
| `generatedScalpObjContent` | 5861 | function |  | 2 |
| `generateScalpFromBuilder` | 5875 | function |  | 1 |
| `orderedDepthRange` | 5911 | arrow |  | 7 |
| `resetScalpBuilder` | 6040 | function |  | 1 |
| `confirmScalpBuilderPlane` | 6055 | function |  | 1 |
| `beginScalpBuilderInput` | 6069 | function |  | 2 |
| `updateScalpBuilderStroke` | 6070 | function |  | 1 |
| `finishScalpBuilderStroke` | 6071 | function |  | 2 |
| `setScalpBuilderEditing` | 6073 | function |  | 10 |
| `updateScalpEditingVisibility` | 6107 | function |  | 12 |
| `exitSetupEditors` | 6201 | function |  | 7 |
| `setCapsuleGuideEditing` | 6210 | function |  | 5 |
| `syncAppMenuVisibility` | 6238 | function |  | 3 |
| `closeAppMenus` | 6243 | function |  | 6 |
| `setAppMenuOpen` | 6254 | function |  | 3 |
| `setTurntableActive` | 6261 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6270 | function |  | 9 |
| `selectedReferenceImage` | 6274 | function |  | 20 |
| `normalizeReferenceCrop` | 6280 | function |  | 8 |
| `referenceCropIsFull` | 6288 | function |  | 3 |
| `referencePlaneFrontAxis` | 6293 | function |  | 4 |
| `referencePlanePlacement` | 6302 | function |  | 4 |
| `migratedReferencePlanePosition` | 6317 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6337 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6354 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6370 | function |  | 2 |
| `snappedReferenceImageView` | 6393 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6399 | function |  | 5 |
| `applyReferenceImageRuntime` | 6415 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6458 | function |  | 6 |
| `createReferenceImageRuntime` | 6466 | function |  | 3 |
| `addReferenceImage` | 6535 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6587 | function |  | 3 |
| `disposeReferenceImage` | 6606 | function |  | 2 |
| `clearReferenceImages` | 6610 | function |  | 2 |
| `serializeReferenceImage` | 6617 | function |  | 1 |
| `setReferenceImageType` | 6645 | function |  | 2 |
| `attachReferenceImageTransform` | 6689 | function |  | 6 |
| `selectReferenceImage` | 6703 | function |  | 12 |
| `placeReferencePlane` | 6726 | function |  | 2 |
| `setReferencePlaneInFront` | 6737 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6747 | function |  | 4 |
| `renderReferenceImagePanel` | 6766 | function |  | 20 |
| `setOutlinerTab` | 6813 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6831 | function |  | 4 |
| `componentEditModeActive` | 6835 | function |  | 38 |
| `selectionToolSupportsPicking` | 6839 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6844 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6860 | function |  | 2 |
| `setViewportSelectionMode` | 6890 | function |  | 4 |
| `setViewportEditMode` | 6902 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6944 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6958 | function |  | 8 |
| `outlinerGuides` | 6970 | function |  | 3 |
| `guideOutlinerLabel` | 6977 | function |  | 2 |
| `normalizeOutlinerName` | 6987 | function |  | 4 |
| `beginOutlinerRename` | 6992 | function |  | 2 |
| `finish` | 7003 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 7033 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 7043 | function |  | 2 |
| `renderGuideOutliner` | 7078 | function |  | 10 |
| `referenceOutlinerGroup` | 7136 | function |  | 2 |
| `renderReferenceOutliner` | 7140 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7257 | function |  | 5 |
| `readReferenceImageFile` | 7262 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7286 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7293 | function |  | 3 |
| `dragContainsReferenceImage` | 7338 | function |  | 3 |
| `setReferenceImageDragActive` | 7349 | function |  | 9 |
| `referenceDropDestination` | 7357 | function |  | 2 |
| `viewportOverlayDropPosition` | 7363 | function |  | 2 |
| `setReferenceDropHover` | 7372 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7390 | function |  | 2 |
| `referenceOverlayAtPointer` | 7410 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7428 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7441 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7487 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7537 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7559 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7570 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7596 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7605 | function |  | 2 |
| `referenceCropCursor` | 7620 | function |  | 3 |
| `updateReferenceCropHandles` | 7626 | function |  | 5 |
| `referenceCropSourcePoint` | 7647 | function |  | 2 |
| `beginReferenceCrop` | 7654 | function |  | 1 |
| `updateReferenceCrop` | 7692 | function |  | 1 |
| `finishReferenceCrop` | 7724 | function |  | 4 |
| `setHeadSetupEditing` | 7742 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7758 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7767 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7777 | function |  | 4 |
| `setScalpGuideVisibility` | 7783 | function |  | 12 |
| `currentGuideViewMode` | 7791 | function |  | 3 |
| `updateGuideViewToggle` | 7799 | function |  | 5 |
| `setGuideViewMode` | 7815 | function |  | 3 |
| `cycleGuideViewMode` | 7826 | function |  | 1 |
| `hideGuideViewContextMenu` | 7831 | function |  | 6 |
| `showGuideViewContextMenu` | 7835 | function |  | 1 |
| `strandPassesDisplayFilters` | 7848 | function |  | 4 |
| `strandVisibleForDisplay` | 7857 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7862 | function |  | 2 |
| `lockedStrandsExist` | 7866 | function |  | 3 |
| `hiddenStrandsExist` | 7870 | function |  | 2 |
| `hideSelectedStrands` | 7874 | function |  | 2 |
| `unhideHiddenStrands` | 7884 | function |  | 2 |
| `strandIsolationActive` | 7893 | function |  | 7 |
| `setStrandIsolation` | 7897 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7909 | function |  | 3 |
| `syncVisibilityParent` | 7920 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7927 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7956 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7963 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7983 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 8006 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 8014 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 8021 | function |  | 9 |
| `setScalpLatticeEditing` | 8032 | function |  | 4 |
| `setScalpShapeEditing` | 8047 | function |  | 9 |
| `setScalpPaintEditing` | 8065 | function |  | 7 |
| `defaultCurveLatticePoints` | 8089 | function |  | 3 |
| `flatCurveLatticePoints` | 8115 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8124 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8148 | function |  | 4 |
| `horizontalValue` | 8153 | arrow |  | 1 |
| `blendedSample` | 8164 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8197 | function |  | 2 |
| `curveLatticeControlPoint` | 8212 | function |  | 9 |
| `circularArcTangent` | 8216 | function |  | 4 |
| `arcLengthTo` | 8247 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8259 | function |  | 3 |
| `sampleHermiteCurve` | 8298 | function |  | 10 |
| `sampleCurveLattice` | 8315 | function |  | 6 |
| `curveLatticeNormal` | 8334 | function |  | 1 |
| `createCurveLatticeGeometry` | 8345 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8374 | function |  | 3 |
| `appendCurve` | 8376 | arrow |  | 4 |
| `sample` | 8378 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8405 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8421 | function |  | 3 |
| `addPicker` | 8423 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8462 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8475 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8479 | function |  | 3 |
| `curveLatticeEditablePoint` | 8497 | function |  | 13 |
| `curveLatticePointSection` | 8504 | function |  | 3 |
| `curveLatticeRestPoint` | 8515 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8521 | function |  | 7 |
| `curveLatticeRootColumns` | 8527 | function |  | 3 |
| `curveTangentsForPoints` | 8534 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8546 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8583 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8609 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8626 | function |  | 3 |
| `resampleGrid` | 8636 | arrow |  | 2 |
| `controlPointIsSelected` | 8663 | function |  | 7 |
| `clearMultiPointSelection` | 8671 | function |  | 9 |
| `createCurveLatticeHandles` | 8675 | function |  | 4 |
| `addCurveLattice` | 8697 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8806 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8837 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8843 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8882 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8903 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8920 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8929 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8936 | function |  | 1 |
| `selectCurveLatticeLoop` | 8955 | function |  | 3 |
| `selectCurveLatticePoint` | 8984 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8999 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 9041 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9062 | function |  | 3 |
| `curveLatticeColumnPoints` | 9105 | function |  | 3 |
| `groupCurveControlIndices` | 9114 | function |  | 4 |
| `groupCurveControlPoints` | 9120 | function |  | 2 |
| `updateGroupCurveDisplay` | 9126 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9136 | function |  | 2 |
| `groupCurveDeformationPairs` | 9158 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9165 | function |  | 2 |
| `appendPairs` | 9167 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9178 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9197 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9218 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9237 | function |  | 2 |
| `capsuleGuideCapHeight` | 9271 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9275 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9280 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9284 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9296 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9312 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9318 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9344 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9374 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9428 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9449 | function |  | 7 |
| `vertex` | 9463 | function |  | 4 |
| `addFace` | 9469 | function |  | 3 |
| `addRing` | 9487 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9542 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9552 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9617 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9663 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9676 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9697 | function |  | 3 |
| `capsuleGuidePointDistances` | 9702 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9723 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9743 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9748 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9754 | function |  | 3 |
| `capsuleGuideAccentColor` | 9759 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9764 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9775 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9787 | function |  | 2 |
| `createCapsuleGuideHandles` | 9819 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9842 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9861 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9868 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9884 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9901 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9916 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9953 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9969 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9986 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9992 | function |  | 3 |
| `selectCapsuleGuideLoop` | 10019 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 10031 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 10050 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10095 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10130 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10144 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10150 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10167 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10178 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10189 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10219 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10229 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10270 | function |  | 3 |
| `createQuadCageGeometry` | 10286 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10310 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10330 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10341 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10394 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10432 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10442 | function |  | 4 |
| `addCapsuleGuide` | 10450 | function |  | 4 |
| `addGuide` | 10519 | function |  | 1 |
| `createGuideGeometry` | 10580 | function |  | 4 |
| `selectGuide` | 10635 | function |  | 17 |
| `updateGuideControlsVisibility` | 10703 | function |  | 10 |
| `updateViewportToolVisibility` | 10720 | function |  | 7 |
| `getSelectedGuide` | 10759 | function |  | 34 |
| `selectedViewportFocusBounds` | 10763 | function |  | 2 |
| `frameViewportBounds` | 10777 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10807 | function |  | 2 |
| `fullSceneFocusBounds` | 10811 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10828 | function |  | 3 |
| `cycleViewportFraming` | 10837 | function |  | 2 |
| `syncGuideInputs` | 10855 | function |  | 5 |
| `updateGuideGeometry` | 10898 | function |  | 3 |
| `sculptBrushToolActive` | 10919 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10923 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10927 | function |  | 3 |
| `effectiveSculptBrushTool` | 10931 | function |  | 13 |
| `updateSculptScaleModeRow` | 10937 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10942 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10964 | function |  | 5 |
| `setActiveTool` | 10973 | function |  | 19 |
| `setDrawStrandMode` | 11111 | function |  | 2 |
| `setObjectSpaceEditing` | 11121 | function |  | 7 |
| `setHierarchyEditing` | 11137 | function |  | 4 |
| `setProportionalEditing` | 11149 | function |  | 5 |
| `beginProportionalSizeEdit` | 11168 | function |  | 3 |
| `updateProportionalSizeEdit` | 11180 | function |  | 2 |
| `endProportionalSizeEdit` | 11191 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11198 | function |  | 2 |
| `refreshProportionalPreview` | 11206 | function |  | 4 |
| `activeBrushSizeInput` | 11216 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11225 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11237 | function |  | 2 |
| `beginBrushSizeDrag` | 11255 | function |  | 1 |
| `updateBrushSizeDrag` | 11282 | function |  | 1 |
| `finishBrushSizeDrag` | 11303 | function |  | 2 |
| `updateInteractionLocks` | 11320 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11329 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11338 | function |  | 2 |
| `configureTransformControls` | 11369 | function |  | 16 |
| `pullMoveActive` | 11377 | function |  | 9 |
| `updatePullGuideVisual` | 11381 | function |  | 4 |
| `attachTransformForCurvePoint` | 11397 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11421 | function |  | 7 |
| `strandObjectRootIndex` | 11437 | function |  | 3 |
| `strandObjectRoot` | 11446 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11450 | function |  | 2 |
| `attachStrandObjectTransform` | 11455 | function |  | 6 |
| `guideObjectPivot` | 11478 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11489 | function |  | 2 |
| `attachGuideObjectTransform` | 11494 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11513 | function |  | 2 |
| `beginGuideObjectTransform` | 11541 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11548 | function |  | 2 |
| `updateGuideObjectTransform` | 11570 | function |  | 2 |
| `finishGuideObjectTransform` | 11603 | function |  | 2 |
| `clonePlacementFrame` | 11612 | function |  | 2 |
| `cloneOptionalVectors` | 11624 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11628 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11645 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11660 | function |  | 2 |
| `strandObjectTransformOperators` | 11676 | function |  | 4 |
| `transformPoint` | 11684 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11691 | arrow |  | 0 |
| `transformNormal` | 11697 | arrow |  | 10 |
| `transformDirection` | 11707 | arrow |  | 7 |
| `worldMatrixForPivot` | 11719 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11725 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11741 | function |  | 6 |
| `beginStrandObjectTransform` | 11755 | function |  | 2 |
| `updateStrandObjectTransform` | 11793 | function |  | 2 |
| `commitStrandObjectTransform` | 11842 | function |  | 2 |
| `mapPoints` | 11855 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11889 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11903 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11926 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11939 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11954 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11980 | function |  | 2 |
| `finishSurfaceObjectTransform` | 12029 | function |  | 2 |
| `beginHandleEdit` | 12038 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12087 | function |  | 3 |
| `applyBranchRigidRootMove` | 12104 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12141 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12152 | function |  | 3 |
| `multiPointHandleEditActive` | 12163 | function |  | 7 |
| `applyMultiMove` | 12167 | function |  | 5 |
| `applyMultiRotate` | 12173 | function |  | 2 |
| `applyMultiScale` | 12182 | function |  | 2 |
| `applyHierarchicalMove` | 12191 | function |  | 3 |
| `applySingleMove` | 12203 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12207 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12224 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12233 | function |  | 3 |
| `changed` | 12243 | arrow |  | 1 |
| `applyPullMove` | 12285 | function |  | 3 |
| `pullHeadCollisionContext` | 12293 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12312 | function |  | 2 |
| `applyProportionalMove` | 12335 | function |  | 3 |
| `viewPlaneNormal` | 12346 | function |  | 20 |
| `isCameraInSnappedView` | 12350 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12358 | function |  | 10 |
| `updateViewPlaneGrid` | 12362 | function |  | 14 |
| `setViewPlaneMove` | 12419 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12430 | function |  | 2 |
| `rayFromViewportEvent` | 12438 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12446 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12456 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12467 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12480 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12499 | function |  | 4 |
| `beginViewPlaneMove` | 12506 | function |  | 3 |
| `updateViewPlaneMove` | 12570 | function |  | 1 |
| `endViewPlaneMove` | 12635 | function |  | 7 |
| `applyHierarchicalRotate` | 12654 | function |  | 2 |
| `rotateGuideNormal` | 12661 | arrow |  | 4 |
| `applySingleRotate` | 12699 | function |  | 2 |
| `applyProportionalRotate` | 12703 | function |  | 2 |
| `applyHierarchicalScale` | 12723 | function |  | 2 |
| `applySingleScale` | 12733 | function |  | 2 |
| `applyProportionalScale` | 12737 | function |  | 2 |
| `setPointScale` | 12753 | function |  | 8 |
| `proportionalWeight` | 12762 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12774 | function |  | 5 |
| `strandInfluenceColor` | 12780 | function |  | 17 |
| `beginRelaxEdit` | 12805 | function |  | 3 |
| `updateRelaxEdit` | 12834 | function |  | 1 |
| `endRelaxEdit` | 12894 | function |  | 1 |
| `disposeGuide` | 12904 | function |  | 3 |
| `removeGuideObjects` | 12932 | function |  | 3 |
| `strandRadiusAt` | 12946 | function |  | 5 |
| `strandProfileTopologyAt` | 12963 | function |  | 8 |
| `strandCurveParameters` | 13005 | function |  | 5 |
| `widthProfileAt` | 13015 | arrow |  | 1 |
| `braidFrameAt` | 13053 | function |  | 5 |
| `braidFrameAtExtended` | 13063 | function |  | 2 |
| `createBraidProfileProjector` | 13072 | function |  | 2 |
| `project` | 13088 | arrow |  | 17 |
| `createBraidGeometry` | 13103 | function |  | 2 |
| `deformationAt` | 13138 | function |  | 3 |
| `widthFor` | 13147 | arrow |  | 3 |
| `depthFor` | 13151 | arrow |  | 3 |
| `outputVertex` | 13183 | function |  | 7 |
| `appendAuthoredCap` | 13291 | function |  | 3 |
| `outputCapVertex` | 13298 | arrow |  | 6 |
| `capBoundary` | 13389 | function |  | 3 |
| `strandGeometryCurve` | 13451 | function |  | 15 |
| `strandGeometryFrameAt` | 13477 | function |  | 19 |
| `transportedStrandFrameAt` | 13540 | function |  | 7 |
| `twistOverrideAt` | 13543 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13571 | function |  | 2 |
| `weldPanelGeometryData` | 13607 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13647 | function |  | 3 |
| `surfacePanelPoint` | 13662 | function |  | 3 |
| `createPanelStrandGeometry` | 13685 | function |  | 2 |
| `addQuad` | 13719 | arrow |  | 6 |
| `near` | 13723 | arrow |  | 6 |
| `panelWidthAt` | 13753 | arrow |  | 6 |
| `panelThicknessAt` | 13762 | arrow |  | 6 |
| `panelFrameAt` | 13771 | arrow |  | 1 |
| `rawPanelPoint` | 13789 | arrow |  | 1 |
| `panelPoint` | 13809 | arrow |  | 2 |
| `addPatch` | 13815 | arrow |  | 1 |
| `splitOpening` | 13866 | arrow |  | 2 |
| `uStart` | 13890 | arrow |  | 1 |
| `uEnd` | 13893 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13931 | function |  | 3 |
| `inside` | 13932 | arrow |  | 2 |
| `pushOrientedTriangle` | 13954 | function |  | 7 |
| `triangulatePolygon3D` | 13965 | function |  | 1 |
| `orientedQuadFace` | 14005 | function |  | 2 |
| `createSplitStrandGeometry` | 14013 | function |  | 2 |
| `fusedIndexAt` | 14170 | arrow |  | 0 |
| `createHairCardGeometry` | 14219 | function |  | 2 |
| `createPolyGeometry` | 14318 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14345 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14354 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14401 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14409 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14425 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14434 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14445 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14453 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14463 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14483 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14506 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14585 | function |  | 2 |
| `pushBoundary` | 14614 | arrow |  | 5 |
| `boundaryAt` | 14632 | arrow |  | 3 |
| `hermite` | 14654 | arrow |  | 2 |
| `emitBottomMidRow` | 14699 | arrow |  | 2 |
| `emitTopMidRow` | 14798 | arrow |  | 2 |
| `sideHoleVertex` | 14840 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14889 | arrow |  | 2 |
| `emitFillStrip` | 14960 | arrow |  | 2 |
| `fillSide` | 14971 | arrow |  | 0 |
| `directBridgeQuadIndex` | 15015 | arrow |  | 2 |
| `edgeDirection` | 15039 | arrow |  | 1 |
| `positionAt` | 15098 | arrow |  | 1 |
| `createBranchChildGeometry` | 15149 | function |  | 2 |
| `createCompoundStrandGeometry` | 15359 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15610 | function |  | 2 |
| `createHairGeometry` | 15641 | function |  | 6 |
| `createBaseHairGeometry` | 15693 | function |  | 3 |
| `hairMaterialDefinition` | 15811 | function |  | 4 |
| `materialForLock` | 15815 | function |  | 8 |
| `activeHairMaterialDefinition` | 15819 | function |  | 11 |
| `strandDisplayColor` | 15825 | function |  | 14 |
| `setAnimeHairBaseColor` | 15843 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15856 | function |  | 2 |
| `createHairMaterial` | 15896 | function |  | 5 |
| `createStrandSelectionOutline` | 15938 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15972 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15981 | function |  | 6 |
| `refreshMaterialUsers` | 16008 | function |  | 6 |
| `renderHairMaterialOutliner` | 16017 | function |  | 5 |
| `renderHairMaterialOptions` | 16047 | function |  | 3 |
| `syncHairMaterialEditor` | 16057 | function |  | 9 |
| `createProjectHairMaterial` | 16083 | function |  | 3 |
| `deleteActiveHairMaterial` | 16103 | function |  | 2 |
| `createHairTopologyGeometry` | 16121 | function |  | 4 |
| `createHairTopologyOverlay` | 16142 | function |  | 3 |
| `groupDefaultsFor` | 16189 | function |  | 9 |
| `creationToolActive` | 16196 | function |  | 8 |
| `activeCreationShapeDefaults` | 16200 | function |  | 11 |
| `activeStrandShapeTarget` | 16206 | function |  | 5 |
| `curvePolylineLength` | 16210 | function |  | 2 |
| `curvePolylineLengths` | 16218 | function |  | 3 |
| `samplePolylineDistance` | 16226 | function |  | 2 |
| `applyProjectedCurveLength` | 16236 | function |  | 4 |
| `clearRegionLengthBaseline` | 16267 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16274 | function |  | 2 |
| `setGroupLengthScale` | 16282 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16320 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16352 | function |  | 1 |
| `activeSweepProfile` | 16361 | function |  | 9 |
| `activeSweepProfileTarget` | 16368 | function |  | 6 |
| `trimmedSweepProfile` | 16375 | function |  | 7 |
| `roundedLeft` | 16384 | arrow |  | 1 |
| `roundedRight` | 16390 | arrow |  | 1 |
| `activeProfileOffset` | 16407 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16414 | function |  | 3 |
| `profileToCanvas` | 16431 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16435 | function |  | 11 |
| `sampleSweepProfile` | 16444 | function |  | 7 |
| `createSweepProfileTopology` | 16465 | function |  | 5 |
| `renderProfilePreview` | 16507 | function |  | 8 |
| `renderHairCardCoveragePath` | 16526 | function |  | 3 |
| `activeTaperTarget` | 16541 | function |  | 15 |
| `twistCurveEditing` | 16548 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16552 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16556 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16560 | function |  | 17 |
| `taperAsymmetryKey` | 16564 | function |  | 12 |
| `taperSecondaryKey` | 16568 | function |  | 11 |
| `activeTaperCurve` | 16572 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16583 | function |  | 6 |
| `taperSamples` | 16593 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16600 | function |  | 2 |
| `renderTaperPreview` | 16622 | function |  | 13 |
| `renderTwistCurvePreview` | 16658 | function |  | 5 |
| `cloneShapePresetValue` | 16676 | function |  | 66 |
| `shapeValuesMatch` | 16680 | function |  | 5 |
| `shapeTargetForSelect` | 16688 | function |  | 4 |
| `loadCustomShapePresets` | 16698 | function |  | 2 |
| `saveCustomShapePresets` | 16709 | function |  | 4 |
| `shapePresetLabel` | 16717 | function |  | 4 |
| `setupShapePresetControls` | 16722 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16747 | function |  | 3 |
| `syncShapePresetSelects` | 16753 | function |  | 8 |
| `populateShapePresetSelects` | 16774 | function |  | 5 |
| `applyShapePreset` | 16801 | function |  | 2 |
| `openSaveShapePreset` | 16838 | function |  | 2 |
| `commitCustomShapePreset` | 16863 | function |  | 2 |
| `openRemoveShapePreset` | 16886 | function |  | 2 |
| `commitRemoveShapePreset` | 16899 | function |  | 2 |
| `taperPointToCanvas` | 16915 | function |  | 4 |
| `canvasToTaperPoint` | 16932 | function |  | 2 |
| `clearTaperMeshPoints` | 16968 | function |  | 2 |
| `taperMeshPointFrame` | 16978 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16988 | function |  | 4 |
| `twistMeshGraphAxis` | 16996 | function |  | 4 |
| `addTwistMeshCurvePath` | 17000 | function |  | 2 |
| `appendSegment` | 17021 | arrow |  | 1 |
| `appendFill` | 17024 | arrow |  | 1 |
| `appendSignedSection` | 17030 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17079 | function |  | 6 |
| `updateTaperMeshPoints` | 17116 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17195 | function |  | 5 |
| `renderTaperCurveEditor` | 17213 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17285 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17299 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17315 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17349 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17358 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17369 | function |  | 2 |
| `applyTaperCurveEdit` | 17377 | function |  | 10 |
| `openTaperCurveEditor` | 17485 | function |  | 3 |
| `closeTaperCurveEditor` | 17530 | function |  | 6 |
| `updateViewportStatsVisibility` | 17543 | function |  | 6 |
| `canvasToProfile` | 17562 | function |  | 2 |
| `renderSweepProfileEditor` | 17572 | function |  | 7 |
| `applySweepProfileEdit` | 17615 | function |  | 8 |
| `openSweepProfileEditor` | 17642 | function |  | 1 |
| `closeSweepProfileEditor` | 17677 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17686 | function |  | 2 |
| `addLock` | 17701 | function |  | 19 |
| `mirroredScalpRegion` | 17904 | function |  | 5 |
| `mirroredVector` | 17913 | function |  | 12 |
| `mirroredPlacementFrame` | 17917 | function |  | 2 |
| `mirrorPartnerFor` | 17930 | function |  | 40 |
| `decoupleMirrorPartner` | 17934 | function |  | 2 |
| `createMirrorPartner` | 17942 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 18038 | function |  | 6 |
| `mirroredClumpPartners` | 18043 | function |  | 6 |
| `createMirroredClump` | 18049 | function |  | 3 |
| `decoupleMirroredClump` | 18071 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18080 | function |  | 6 |
| `syncActiveMirror` | 18245 | function |  | 25 |
| `setMirrorXEditing` | 18257 | function |  | 6 |
| `snapshotState` | 18281 | function |  | 7 |
| `scalpTriangleRegion` | 18538 | function |  | 4 |
| `closestPointOnActiveScalp` | 18551 | function |  | 12 |
| `rootAttachmentFrame` | 18623 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18635 | function |  | 4 |
| `resolveRootAttachment` | 18653 | function |  | 4 |
| `curvePointsToRootLocal` | 18693 | function |  | 2 |
| `curvePointsFromRootLocal` | 18705 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18713 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18729 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18759 | function |  | 2 |
| `createRootAttachment` | 18771 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18801 | function |  | 4 |
| `rootAttachmentToData` | 18828 | function |  | 2 |
| `rootAttachmentFromData` | 18856 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18895 | function |  | 2 |
| `remapPoint` | 18910 | arrow |  | 1 |
| `remapVector` | 18911 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18940 | function |  | 2 |
| `importHeadMeshFile` | 18957 | function |  | 3 |
| `importFullBodyMeshFile` | 18980 | function |  | 3 |
| `downloadPreferencesAndPresets` | 19005 | function |  | 1 |
| `importedBooleanPreference` | 19038 | function |  | 11 |
| `loadPreferencesAndPresets` | 19042 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19112 | function |  | 1 |
| `openHairProjectFile` | 19155 | function |  | 4 |
| `dragContainsApplicationFile` | 19213 | function |  | 3 |
| `safelyRememberRecentProject` | 19222 | function |  | 2 |
| `renderRecentProjectsMenu` | 19231 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19263 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19288 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19292 | function |  | 2 |
| `pushUndoState` | 19308 | function |  | 119 |
| `undoLastAction` | 19315 | function |  | 2 |
| `redoLastAction` | 19329 | function |  | 2 |
| `updateHistoryButtons` | 19343 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19348 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19365 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19372 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19410 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19487 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19513 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19545 | function |  | 2 |
| `finalizeStateRestore` | 19586 | function |  | 2 |
| `restoreState` | 19593 | function |  | 5 |
| `disposeAllEditableObjects` | 19617 | function |  | 2 |
| `restoreLock` | 19638 | function |  | 4 |
| `restoreGuide` | 19855 | function |  | 2 |
| `vectorToData` | 19916 | function |  | 29 |
| `dataToVector` | 19920 | function |  | 31 |
| `frameToData` | 19924 | function |  | 2 |
| `frameFromData` | 19936 | function |  | 2 |
| `applyPresetSelection` | 19948 | function |  | 2 |
| `drawPresetThumbnail` | 19979 | function |  | 1 |
| `fillHair` | 19994 | arrow |  | 9 |
| `strand` | 20006 | arrow |  | 31 |
| `bun` | 20024 | arrow |  | 2 |
| `braid` | 20059 | arrow |  | 2 |
| `renderPresetLibrary` | 20148 | function |  | 3 |
| `setPresetLibraryOpen` | 20207 | function |  | 6 |
| `average` | 20220 | function |  | 4 |
| `fitPointAttributes` | 20224 | function |  | 9 |
| `rebuildCurveObjects` | 20253 | function |  | 10 |
| `createCurvePoints` | 20265 | function |  | 2 |
| `addGeneratedBangPreset` | 20274 | function |  | 1 |
| `sampleScalpQuad` | 20367 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20391 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20440 | function |  | 1 |
| `columns` | 20441 | arrow |  | 1 |
| `layer` | 20445 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20659 | function |  | 2 |
| `addBraidedBobPreset` | 20695 | function |  | 1 |
| `evenColumns` | 20696 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20912 | function |  | 1 |
| `scalpSeed` | 20935 | arrow |  | 1 |
| `createBowlCutPoints` | 21222 | function |  | 2 |
| `addBowlCutPreset` | 21260 | function |  | 1 |
| `scalpRegionAtHit` | 21326 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21338 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21345 | function |  | 12 |
| `braidStrokeActive` | 21352 | function |  | 9 |
| `proceduralDrawActive` | 21356 | function |  | 3 |
| `panelStrokeActive` | 21360 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21364 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21368 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21372 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21378 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21382 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21386 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21390 | function |  | 3 |
| `liveSurfaceStrandId` | 21400 | function |  | 4 |
| `liveSurfaceStrand` | 21404 | function |  | 4 |
| `liveSurfaceGuideId` | 21409 | function |  | 3 |
| `guideSupportsLiveSurface` | 21413 | function |  | 2 |
| `liveSurfaceGuide` | 21420 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21427 | function |  | 12 |
| `activeStrokeScalpOffset` | 21467 | function |  | 4 |
| `activeStrokeBrushSize` | 21473 | function |  | 10 |
| `activeStrokeBrushDepth` | 21479 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21485 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21493 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21503 | function |  | 13 |
| `worldNormalAtHit` | 21542 | function |  | 6 |
| `selectedPolyMesh` | 21550 | function |  | 10 |
| `addPolyLock` | 21555 | function |  | 2 |
| `ensurePolyMesh` | 21574 | function |  | 3 |
| `polySurfaceSample` | 21578 | function |  | 4 |
| `polyTargetAtEvent` | 21589 | function |  | 6 |
| `refreshPolyMesh` | 21615 | function |  | 10 |
| `ensurePolyFillPreview` | 21624 | function |  | 2 |
| `clearPolyFillPreview` | 21661 | function |  | 17 |
| `polyFillCandidateForEvent` | 21666 | function |  | 3 |
| `showPolyFillPreview` | 21686 | function |  | 2 |
| `updatePolyFillPreview` | 21712 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21737 | function |  | 5 |
| `fillPolyGap` | 21747 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21758 | function |  | 2 |
| `projectPolyRelaxPoint` | 21778 | function |  | 2 |
| `removePolyPointAttributes` | 21822 | function |  | 3 |
| `deletePolyComponent` | 21831 | function |  | 2 |
| `addPolyPoint` | 21854 | function |  | 4 |
| `appendPolyStrokeRow` | 21863 | function |  | 4 |
| `beginPolyBrushPointer` | 21883 | function |  | 1 |
| `finishPolyAltDelete` | 21969 | function |  | 1 |
| `updatePolyBrushStroke` | 21983 | function |  | 1 |
| `finishPolyBrushStroke` | 22073 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22110 | function |  | 2 |
| `drawSampleFromHit` | 22133 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22147 | function |  | 3 |
| `strokeLength` | 22184 | function |  | 9 |
| `resampleDrawStroke` | 22190 | function |  | 2 |
| `processedDrawStroke` | 22222 | function |  | 8 |
| `strokeSurfaceNormals` | 22251 | function |  | 7 |
| `drawClumpFrame` | 22262 | function |  | 4 |
| `nearestCurveParameter` | 22271 | function |  | 2 |
| `drawClumpSampleNormal` | 22285 | function |  | 6 |
| `drawClumpTemplateVector` | 22294 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22300 | function |  | 3 |
| `drawClumpStrandMaps` | 22316 | function |  | 4 |
| `nextClumpName` | 22371 | function |  | 6 |
| `initializeClumpShape` | 22378 | function |  | 5 |
| `stableClumpVariation` | 22389 | function |  | 3 |
| `createClumpFromLocks` | 22401 | function |  | 7 |
| `addLockToClump` | 22426 | function |  | 4 |
| `stableBranchBaseNormals` | 22444 | function |  | 4 |
| `ensureBranchParentNormalField` | 22455 | function |  | 2 |
| `branchParentFrame` | 22461 | function |  | 7 |
| `branchLocalVector` | 22473 | function |  | 3 |
| `branchWorldVector` | 22477 | function |  | 4 |
| `captureBranchLocalState` | 22483 | function |  | 6 |
| `enforceBranchRootPosition` | 22511 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22561 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22588 | function |  | 2 |
| `clampRegionParam` | 22635 | function |  | 113 |
| `branchRootRegionFromParam` | 22642 | function |  | 4 |
| `cloneBranchRootRegion` | 22665 | function |  | 5 |
| `flip` | 22667 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22700 | function |  | 8 |
| `setBranchRootRegionPoint` | 22731 | function |  | 3 |
| `branchRegionUVToCanvas` | 22767 | function |  | 10 |
| `branchRegionCanvasToUV` | 22770 | function |  | 4 |
| `openBranchRegionEditor` | 22776 | function |  | 2 |
| `closeBranchRegionEditor` | 22790 | function |  | 2 |
| `retargetBranchRegionEditor` | 22796 | function |  | 2 |
| `renderBranchRegionEditor` | 22801 | function |  | 9 |
| `applyBranchRegionView` | 22890 | function |  | 6 |
| `resetBranchRegionZoom` | 22893 | function |  | 1 |
| `branchRegionNavAction` | 22899 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22913 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22933 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22937 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22963 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22975 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22980 | function |  | 1 |
| `branchRegionEventUV` | 23000 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 23008 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23113 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23246 | function |  | 1 |
| `pointerToNdc` | 23251 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23262 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23276 | function |  | 1 |
| `endBranchSweepStartDrag` | 23299 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23306 | function |  | 5 |
| `gridProfileSkipCol` | 23333 | function |  | 3 |
| `branchRootRegionSurface` | 23342 | function |  | 6 |
| `toGridCol` | 23367 | arrow |  | 5 |
| `toRow` | 23371 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23426 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23446 | function |  | 2 |
| `pointAt` | 23452 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23479 | function |  | 3 |
| `applyBranchRootOffset` | 23551 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23570 | function |  | 3 |
| `branchChildrenFor` | 23590 | function |  | 9 |
| `detachBranch` | 23594 | function |  | 2 |
| `updateBranchChildren` | 23605 | function |  | 4 |
| `clumpDirectMembers` | 23648 | function |  | 3 |
| `clumpMembersForGuide` | 23653 | function |  | 6 |
| `clumpGuideForLock` | 23657 | function |  | 13 |
| `proceduralGuideForLock` | 23662 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23669 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23676 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23683 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23695 | function |  | 2 |
| `applyProceduralBranchSettings` | 23708 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23747 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23763 | function |  | 3 |
| `createProceduralAccessoryLock` | 23777 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23829 | function |  | 2 |
| `clumpFrameAt` | 23880 | function |  | 5 |
| `commitClumpMemberRestState` | 23888 | function |  | 10 |
| `updateClumpMembers` | 23971 | function |  | 10 |
| `dissolveClump` | 24075 | function |  | 6 |
| `detachLockFromClump` | 24112 | function |  | 4 |
| `updateDrawVolumePreview` | 24138 | function |  | 5 |
| `hideDrawClumpPreviews` | 24162 | function |  | 5 |
| `resetDrawVolumePreview` | 24168 | function |  | 3 |
| `updateDrawStrandPreview` | 24174 | function |  | 23 |
| `continueFromTipEnabled` | 24393 | function |  | 2 |
| `selectedTipContinuationLock` | 24399 | function |  | 3 |
| `selectedDrawBranchPoint` | 24412 | function |  | 3 |
| `canBranchDrawFromLock` | 24429 | function |  | 3 |
| `beginDrawStrandStroke` | 24436 | function |  | 2 |
| `beginDrawFreePlane` | 24561 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24575 | function |  | 2 |
| `updateDrawStrandStroke` | 24600 | function |  | 1 |
| `createDrawnLock` | 24646 | function |  | 3 |
| `setting` | 24650 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24718 | function |  | 4 |
| `createDrawnBraid` | 24726 | function |  | 2 |
| `createDrawnStrand` | 24783 | function |  | 2 |
| `createDrawnPanel` | 24910 | function |  | 2 |
| `surfaceLatticeNormal` | 24960 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24975 | function |  | 3 |
| `createViewportSurface` | 25040 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25069 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25075 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25082 | function |  | 4 |
| `updateLoftSurfacePreview` | 25091 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25123 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25139 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25157 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25179 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25205 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25215 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25219 | function |  | 2 |
| `curveSurfacePreviewLock` | 25228 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25251 | function |  | 2 |
| `hideCurveSurfacePreview` | 25267 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25279 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25284 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25293 | function |  | 3 |
| `curveSurfaceSideVector` | 25331 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25344 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25352 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25365 | function |  | 5 |
| `updateCurveSurfacePreview` | 25385 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25447 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25469 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25484 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25532 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25567 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25599 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25657 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25734 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25739 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25748 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25782 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25793 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25823 | function |  | 2 |
| `extendDrawnStrand` | 25880 | function |  | 2 |
| `finishDrawStrandStroke` | 25913 | function |  | 7 |
| `createPlacedStrand` | 25940 | function |  | 2 |
| `placedPointCount` | 26004 | function |  | 3 |
| `createPlacedPoints` | 26008 | function |  | 3 |
| `pushPointOutsideHead` | 26027 | function |  | 8 |
| `resizePlacedStrand` | 26059 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26076 | function |  | 5 |
| `beginPlaceEdit` | 26081 | function |  | 2 |
| `updatePlaceEdit` | 26099 | function |  | 1 |
| `updatePlacementLength` | 26113 | function |  | 3 |
| `updatePlacementOrientation` | 26123 | function |  | 3 |
| `endPlaceEdit` | 26141 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26156 | function |  | 1 |
| `pendingPlacedLock` | 26166 | function |  | 2 |
| `beginPlacementPointer` | 26170 | function |  | 3 |
| `finishPlacementPointer` | 26180 | function |  | 2 |
| `confirmPlacementStep` | 26204 | function |  | 2 |
| `finishPlacementFlow` | 26227 | function |  | 7 |
| `updatePlacementStatus` | 26240 | function |  | 83 |
| `deselectStrands` | 26379 | function |  | 12 |
| `beginSelectionMarquee` | 26394 | function |  | 3 |
| `beginAltOrbit` | 26418 | function |  | 1 |
| `beginBlenderNavigation` | 26430 | function |  | 1 |
| `endBlenderNavigation` | 26475 | function |  | 1 |
| `prepareSelectPointerCapture` | 26483 | function |  | 1 |
| `endSelectPointerCapture` | 26489 | function |  | 1 |
| `endAltOrbit` | 26495 | function |  | 1 |
| `dollyCameraByDrag` | 26502 | function |  | 2 |
| `fastDragMagnitude` | 26525 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26531 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26539 | function |  | 1 |
| `endHoudiniZoomDrag` | 26556 | function |  | 1 |
| `updateSelectionMarquee` | 26564 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26581 | function |  | 3 |
| `selectPointsInMarquee` | 26589 | function |  | 2 |
| `pointKey` | 26615 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26646 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26683 | function |  | 3 |
| `projectedPoint` | 26700 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26729 | function |  | 2 |
| `finishSelectionMarquee` | 26774 | function |  | 2 |
| `headMeshes` | 26797 | function |  | 9 |
| `strandSplitProfileData` | 26805 | function |  | 4 |
| `strandSplitControlPoint` | 26818 | function |  | 4 |
| `panelSplitControlPoint` | 26854 | function |  | 6 |
| `strandControlPointRaycast` | 26910 | function |  | 1 |
| `strandControlPointFrame` | 26945 | function |  | 6 |
| `branchRootGizmoFrame` | 26976 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26994 | function |  | 5 |
| `createCurveObjects` | 27052 | function |  | 4 |
| `polyEdgeKey` | 27225 | function |  | 2 |
| `polyMeshEdges` | 27229 | function |  | 2 |
| `populatePolyEditObjects` | 27243 | function |  | 3 |
| `createPolyEditObjects` | 27304 | function |  | 2 |
| `rebuildPolyEditObjects` | 27312 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27326 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27333 | function |  | 2 |
| `strandWidthEdgeSample` | 27342 | function |  | 3 |
| `strandWidthEdgePoints` | 27365 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27379 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27383 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27390 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27402 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27407 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27413 | function |  | 3 |
| `updateCurveObjects` | 27427 | function |  | 41 |
| `createCurveNormalIndicator` | 27684 | function |  | 2 |
| `pointUpDirection` | 27710 | function |  | 2 |
| `curveFrameAtPoint` | 27714 | function |  | 5 |
| `curveFrameAt` | 27735 | function |  | 10 |
| `strandTwistAt` | 27755 | function |  | 6 |
| `controlPointRotationAt` | 27760 | function |  | 6 |
| `strandProfileTwistAt` | 27764 | function |  | 2 |
| `strandFrameAt` | 27770 | function |  | 1 |
| `curveFrameAtSnapshot` | 27776 | function |  | 3 |
| `outwardNormalAtPoint` | 27795 | function |  | 11 |
| `sampledSurfaceNormal` | 27807 | function |  | 2 |
| `guidedNormalAt` | 27823 | function |  | 5 |
| `twistFromHandle` | 27842 | function |  | 3 |
| `signedAngleAroundAxis` | 27863 | function |  | 5 |
| `handleColor` | 27870 | function |  | 2 |
| `isAffectedCurvePoint` | 27893 | function |  | 2 |
| `syncLockFromCurve` | 27899 | function |  | 26 |
| `labelForPreset` | 27929 | function |  | 1 |
| `rebuildLockGeometry` | 27933 | function |  | 21 |
| `scheduleSculptBrushGeometryUpdates` | 27960 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27968 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27974 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27996 | function |  | 8 |
| `updateLockGeometry` | 28009 | function |  | 57 |
| `setGroupColorView` | 28030 | function |  | 2 |
| `createUvCheckerTexture` | 28040 | function |  | 3 |
| `ensureUvCheckerForLock` | 28076 | function |  | 4 |
| `removeUvCheckerFromLock` | 28109 | function |  | 3 |
| `invalidateUvInspector` | 28124 | function |  | 7 |
| `uvInspectorRecord` | 28128 | function |  | 1 |
| `uvInspectorRecords` | 28167 | function |  | 2 |
| `drawUvInspectorGrid` | 28171 | function |  | 2 |
| `renderUvInspector` | 28205 | function |  | 3 |
| `setUvCheckerEnabled` | 28264 | function |  | 3 |
| `strandViewportBaseColor` | 28281 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28316 | function |  | 3 |
| `syncStrandSelectionOutline` | 28322 | function |  | 2 |
| `applyLockedStrandPalette` | 28333 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28342 | function |  | 6 |
| `setStrandSelectionVisual` | 28351 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28367 | function |  | 2 |
| `syncProceduralParentVisibility` | 28374 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28383 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28387 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28391 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28404 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28424 | function |  | 3 |
| `selectLock` | 28457 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28510 | function |  | 6 |
| `syncGroupInputs` | 28521 | function |  | 3 |
| `topologyStatsForLock` | 28554 | function |  | 4 |
| `formatTopologyStats` | 28562 | function |  | 5 |
| `updateTopologyStats` | 28566 | function |  | 20 |
| `normalizeBraidDimensions` | 28600 | function |  | 4 |
| `normalizeStrandDimensions` | 28613 | function |  | 3 |
| `strandBaseWidth` | 28627 | function |  | 5 |
| `strandWidthDimension` | 28631 | function |  | 5 |
| `strandDepthDimension` | 28639 | function |  | 8 |
| `setStrandWidthDimension` | 28647 | function |  | 2 |
| `setStrandDepthDimension` | 28669 | function |  | 4 |
| `syncShapeDimensionInputs` | 28685 | function |  | 4 |
| `syncCreationShapeInputs` | 28721 | function |  | 5 |
| `syncViewportDrawSettings` | 28759 | function |  | 5 |
| `syncPanelShapeInputs` | 28773 | function |  | 6 |
| `syncStrandSplitInputs` | 28799 | function |  | 4 |
| `syncHairCardControls` | 28808 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28816 | function |  | 3 |
| `updateAttributeEditorMode` | 28855 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 29004 | function |  | 3 |
| `curveLatticeForGroup` | 29027 | function |  | 2 |
| `filterCurveLatticesToGroup` | 29045 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29090 | function |  | 2 |
| `showCurveLatticeForGroup` | 29107 | function |  | 2 |
| `selectStrandGroup` | 29144 | function |  | 3 |
| `selectCurvePoint` | 29186 | function |  | 10 |
| `updateSelectedPointLabel` | 29200 | function |  | 14 |
| `syncInputs` | 29213 | function |  | 16 |
| `syncClumpGuidePanel` | 29259 | function |  | 3 |
| `getSelectedLock` | 29286 | function |  | 104 |
| `selectedLocksInOrder` | 29290 | function |  | 37 |
| `lockStrands` | 29296 | function |  | 3 |
| `lockSelectedStrands` | 29329 | function |  | 3 |
| `unlockStrands` | 29335 | function |  | 3 |
| `unlockAllStrands` | 29350 | function |  | 3 |
| `strandEditFamily` | 29354 | function |  | 7 |
| `compatibleSelectedLocks` | 29359 | function |  | 6 |
| `selectedEditRoots` | 29366 | function |  | 2 |
| `editSelectedLocks` | 29379 | function |  | 21 |
| `multiEditValuesEqual` | 29412 | function |  | 2 |
| `setMixedControl` | 29421 | function |  | 28 |
| `syncMultiStrandInputs` | 29438 | function |  | 16 |
| `values` | 29454 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29534 | function |  | 5 |
| `createCompoundStrand` | 29541 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29602 | function |  | 9 |
| `openRebuildCurveDialog` | 29615 | function |  | 1 |
| `rebuildSelectedCurves` | 29629 | function |  | 2 |
| `selectionCanBecomeClump` | 29668 | function |  | 4 |
| `createClumpFromSelection` | 29673 | function |  | 3 |
| `cleanSelectionSets` | 29685 | function |  | 2 |
| `createSelectionSetFromSelection` | 29690 | function |  | 3 |
| `selectionSetById` | 29701 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29705 | function |  | 7 |
| `editSelectionSetFromSelection` | 29714 | function |  | 5 |
| `deleteSelectionSet` | 29734 | function |  | 2 |
| `selectSelectionSet` | 29743 | function |  | 2 |
| `deleteSelectedStrands` | 29753 | function |  | 4 |
| `deleteGuide` | 29761 | function |  | 3 |
| `deleteSelectedGuide` | 29784 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29788 | function |  | 4 |
| `hasDeletableSelection` | 29801 | function |  | 2 |
| `deleteCurrentSelection` | 29809 | function |  | 3 |
| `hideOutlinerContextMenu` | 29817 | function |  | 17 |
| `outlinerLockTargets` | 29822 | function |  | 3 |
| `showOutlinerContextMenu` | 29849 | function |  | 10 |
| `hideStrandRadialMenu` | 29929 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29940 | function |  | 3 |
| `radialButtonDimensions` | 29953 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29962 | function |  | 3 |
| `applyRadialMenuDimensions` | 29979 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29985 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29998 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 30019 | function |  | 2 |
| `selectionSetRadialMenuOption` | 30036 | function |  | 4 |
| `selectedMirrorRadialOptions` | 30045 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30067 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30085 | function |  | 2 |
| `contextualRadialOptions` | 30092 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30221 | function |  | 3 |
| `layoutContextualRadialOptions` | 30225 | function |  | 4 |
| `renderRadialActionList` | 30249 | function |  | 3 |
| `radialListOptionAtPointer` | 30267 | function |  | 3 |
| `syncRadialListHighlight` | 30289 | function |  | 3 |
| `configureContextualRadialMenu` | 30295 | function |  | 3 |
| `beginStrandRadialGesture` | 30355 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30389 | function |  | 2 |
| `updateStrandRadialGesture` | 30435 | function |  | 1 |
| `performStrandRadialAction` | 30474 | function |  | 2 |
| `finishStrandRadialGesture` | 30577 | function |  | 2 |
| `cancelStrandRadialGesture` | 30587 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30594 | function |  | 1 |
| `setPullMoveEnabled` | 30600 | function |  | 3 |
| `toolRadialOptions` | 30608 | function |  | 2 |
| `hideToolRadialMenu` | 30633 | function |  | 4 |
| `beginToolRadialGesture` | 30646 | function |  | 2 |
| `beginToolShortcutPress` | 30686 | function |  | 2 |
| `finishToolShortcutPress` | 30701 | function |  | 2 |
| `cancelToolShortcutPress` | 30710 | function |  | 5 |
| `setRadialMenusEnabled` | 30718 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30731 | function |  | 5 |
| `setNavigationTipsEnabled` | 30746 | function |  | 5 |
| `configureNavigationMouseButtons` | 30753 | function |  | 3 |
| `syncNavigationModifierLocks` | 30766 | function |  | 7 |
| `setNavigationStyle` | 30771 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30787 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30802 | function |  | 5 |
| `setCameraSmoothingStrength` | 30808 | function |  | 5 |
| `setScaleSensitivity` | 30816 | function |  | 3 |
| `setToolTipsEnabled` | 30824 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30831 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30840 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30848 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30863 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30872 | function |  | 5 |
| `sideNamingDisplayId` | 30881 | function |  | 3 |
| `referenceViewDisplayLabel` | 30893 | function |  | 6 |
| `strandRegionDisplayLabel` | 30903 | function |  | 10 |
| `updateSideNamingLabels` | 30921 | function |  | 2 |
| `setSideNamingPerspective` | 30948 | function |  | 5 |
| `setControlPointDisplaySize` | 30957 | function |  | 6 |
| `scaleHexColor` | 30969 | function |  | 3 |
| `setViewportBackgroundColor` | 30974 | function |  | 7 |
| `setDefaultHairShader` | 30996 | function |  | 5 |
| `setPreferenceCategory` | 31002 | function |  | 4 |
| `openPreferencesDialog` | 31029 | function |  | 1 |
| `savePreferencesDialog` | 31057 | function |  | 1 |
| `cancelPreferencesDialog` | 31081 | function |  | 3 |
| `updateToolRadialGesture` | 31110 | function |  | 1 |
| `performToolRadialAction` | 31139 | function |  | 2 |
| `finishToolRadialGesture` | 31149 | function |  | 2 |
| `cancelToolRadialGesture` | 31158 | function |  | 5 |
| `duplicatePlacementTarget` | 31165 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31192 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31196 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31206 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31211 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31223 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31234 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31242 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31259 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31280 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31291 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31297 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31303 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31336 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31491 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31593 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31634 | function |  | 2 |
| `updateDuplicatePlacement` | 31661 | function |  | 2 |
| `beginDuplicatePlacement` | 31725 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31789 | function |  | 2 |
| `confirmDuplicatePlacement` | 31830 | function |  | 1 |
| `cancelDuplicatePlacement` | 31867 | function |  | 4 |
| `outlinerClumpLocks` | 31893 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31897 | function |  | 3 |
| `createOutlinerStrandButton` | 31920 | function |  | 4 |
| `createOutlinerCurveSurface` | 32006 | function |  | 2 |
| `createOutlinerClump` | 32102 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32184 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32191 | function |  | 2 |
| `renderLockList` | 32270 | function |  | 70 |
| `updateCount` | 32424 | function |  | 34 |
| `captureInputUndo` | 32433 | function |  | 1 |
| `bindUndoCapture` | 32439 | function |  | 36 |
| `bindLockInput` | 32450 | function |  | 2 |
| `applyValue` | 32467 | arrow |  | 2 |
| `applyUniformTransformScale` | 32786 | function |  | 2 |
| `applyReducedTransformScale` | 32803 | function |  | 2 |
| `applyTransformPrecision` | 32842 | function |  | 2 |
| `updateTransformScalePointer` | 32871 | function |  | 1 |
| `finishSweepProfileDrag` | 33102 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33198 | function |  | 3 |
| `finishTaperCurveDrag` | 33260 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33303 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33384 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33439 | function |  | 6 |
| `updateSelectedTaperPoint` | 33463 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 34037 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 34042 | function |  | 4 |
| `syncDrawCurlControls` | 34097 | function |  | 5 |
| `handleLiveSurfaceChange` | 34145 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34227 | function |  | 3 |
| `resampleSurfaceLock` | 34242 | function |  | 2 |
| `changePanelSplitCount` | 34355 | function |  | 3 |
| `presetNumber` | 34459 | function |  | 23 |
| `clonePresetShape` | 34464 | function |  | 7 |
| `creationPresetSnapshot` | 34473 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34521 | function |  | 5 |
| `applyPresetControl` | 34548 | function |  | 2 |
| `applyCreationToolSettings` | 34569 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34610 | function |  | 3 |
| `loadCustomCreationPresets` | 34617 | function |  | 2 |
| `saveCustomCreationPresets` | 34627 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34635 | function |  | 2 |
| `populateCreationPresetSelect` | 34671 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34695 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34728 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34733 | function |  | 2 |
| `applyCustomCreationPreset` | 34750 | function |  | 3 |
| `createCustomCreationPreset` | 34774 | function |  | 3 |
| `createCustomClumpPreset` | 34789 | function |  | 3 |
| `commitCustomCreationPreset` | 34804 | function |  | 2 |
| `openRemoveCreationPreset` | 34865 | function |  | 3 |
| `commitRemoveCreationPreset` | 34878 | function |  | 1 |
| `applyBraidToolPreset` | 34895 | function |  | 2 |
| `initPanelResizeHandles` | 35094 | function |  | 2 |
| `applyWidth` | 35100 | arrow |  | 2 |
| `restoreWidth` | 35107 | arrow |  | 2 |
| `bindResize` | 35115 | arrow |  | 2 |
| `onMove` | 35123 | arrow |  | 0 |
| `onUp` | 35127 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35144 | function |  | 2 |
| `initFloatingPanelControls` | 35153 | function |  | 2 |
| `detach` | 35162 | arrow |  | 43 |
| `endDrag` | 35200 | arrow |  | 0 |
| `endResize` | 35232 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35243 | function |  | 3 |
| `selectPatchNotesVersion` | 35377 | function |  | 3 |
| `requestReferenceImage` | 35410 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35614 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35620 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35627 | function |  | 1 |
| `deleteLocks` | 36194 | function |  | 10 |
| `disposeCurveObjects` | 36272 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36324 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36355 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36430 | function |  | 2 |
| `resize` | 36463 | function |  | 4 |
| `handleViewportPointerMove` | 36474 | function |  | 1 |
| `blockProportionalSizingEvent` | 36485 | function |  | 1 |
| `updateLightAngleFromInputs` | 36491 | function |  | 2 |
| `startViewSnap` | 36505 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36535 | function |  | 3 |
| `trackViewportPointerDown` | 36552 | function |  | 1 |
| `trackViewportPointerMove` | 36568 | function |  | 1 |
| `clearViewportPointer` | 36576 | function |  | 1 |
| `updateViewSnap` | 36581 | function |  | 1 |
| `nearestCardinalAxis` | 36617 | function |  | 5 |
| `cardinalAxisKey` | 36631 | function |  | 5 |
| `steppedDragAmount` | 36635 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36641 | function |  | 4 |
| `endViewSnap` | 36657 | function |  | 4 |
| `activateStrandControlPoint` | 36667 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36717 | function |  | 4 |
| `addStrandControlPointSelection` | 36744 | function |  | 3 |
| `removeStrandControlPointSelection` | 36761 | function |  | 3 |
| `sampleStrandPointNormal` | 36775 | function |  | 2 |
| `sampleStrandPointVectors` | 36785 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36791 | function |  | 2 |
| `resampleStrandCurveData` | 36802 | function |  | 4 |
| `resampleMatchingVectors` | 36808 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36847 | function |  | 4 |
| `removeStrandCurvePoint` | 36858 | function |  | 2 |
| `closestStrandCurveParameter` | 36871 | function |  | 2 |
| `insertStrandCurvePoint` | 36900 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36917 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36927 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36943 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36950 | function |  | 4 |
| `prepareCurvePointSelection` | 36972 | function |  | 1 |
| `finishCurvePointInsertion` | 37083 | function |  | 1 |
| `finishPointRemoval` | 37098 | function |  | 1 |
| `editableStrandWidth` | 37116 | function |  | 6 |
| `editableStrandWidthBounds` | 37128 | function |  | 2 |
| `applyEditableStrandWidth` | 37134 | function |  | 3 |
| `viewportPixelPoint` | 37170 | function |  | 3 |
| `syncSculptBrushControls` | 37178 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37193 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37201 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37209 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37215 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37219 | function |  | 7 |
| `updateSculptBrushCursor` | 37226 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37248 | function |  | 4 |
| `sculptBrushEditableLock` | 37255 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37265 | function |  | 5 |
| `sculptBrushLockViable` | 37271 | function |  | 5 |
| `sculptBrushUnits` | 37282 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37321 | function |  | 4 |
| `sculptBrushPointWeight` | 37371 | function |  | 5 |
| `sculptBrushWorldDelta` | 37381 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37390 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37416 | function |  | 2 |
| `beginSculptMoveStroke` | 37474 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37536 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37771 | function |  | 3 |
| `updateSculptMoveStroke` | 37780 | function |  | 1 |
| `finishSculptMoveStroke` | 37796 | function |  | 3 |
| `strandControlPointHit` | 37844 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37848 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37926 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37960 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 38000 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 38013 | function |  | 1 |
| `setHoveredControlPoint` | 38053 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38066 | function |  | 2 |
| `updateControlPointHover` | 38102 | function |  | 1 |
| `animate` | 38659 | function |  | 2 |
| `syncCompactSidebarLayout` | 38692 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38711 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38717 | function |  | 3 |
| `setAttributeEditorTab` | 38723 | function |  | 6 |

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

## modules/edit/selection-store.js（42 行）

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
