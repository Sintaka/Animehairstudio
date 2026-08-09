# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1719** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38769 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 246 | function |  | 3 |
| `saveBooleanPreference` | 274 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 278 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 283 | function |  | 2 |
| `normalizeScaleSensitivity` | 288 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 293 | function |  | 2 |
| `normalizeSideNamingPerspective` | 298 | function |  | 2 |
| `normalizeNavigationStyle` | 302 | function |  | 2 |
| `setupEditableSliderControls` | 316 | function |  | 2 |
| `syncNumberFromRange` | 367 | arrow |  | 0 |
| `applyNumberValue` | 374 | arrow |  | 0 |
| `copyCameraPose` | 484 | function |  | 3 |
| `updateCameraProjectionForViewport` | 490 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 503 | function |  | 3 |
| `setOrthographicView` | 509 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 549 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 578 | function |  | 2 |
| `removeRotateFreeAxisRing` | 604 | function |  | 2 |
| `deflateTransformGizmoPickers` | 616 | function |  | 2 |
| `nextStrandName` | 999 | function |  | 2 |
| `activeDrawClumpTemplate` | 1084 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1089 | function |  | 3 |
| `drawModeCreatesClump` | 1116 | function |  | 1 |
| `isPanelGeometry` | 1260 | function |  | 31 |
| `normalizePanelSplits` | 1264 | function |  | 3 |
| `clonePanelSplits` | 1276 | function |  | 19 |
| `snapPanelSplitHeight` | 1280 | function |  | 5 |
| `createQuadSphereGeometry` | 1315 | function |  | 2 |
| `vertexIndex` | 1329 | function |  | 11 |
| `addEdge` | 1347 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1382 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1452 | function |  | 3 |
| `updateScalpRenderGeometry` | 1479 | function |  | 4 |
| `writeScalpRegionColors` | 1530 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1543 | function |  | 2 |
| `createScalpSelectionOutline` | 1573 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1625 | function |  | 25 |
| `activeScalpSurfaceWire` | 1630 | function |  | 2 |
| `activeScalpSelectionOutline` | 1635 | function |  | 2 |
| `inferredCustomScalpRegion` | 1640 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1647 | function |  | 5 |
| `customScalpGeometryFromObject` | 1666 | function |  | 2 |
| `customScalpWireGeometry` | 1698 | function |  | 3 |
| `installCustomScalpGeometry` | 1709 | function |  | 3 |
| `installCustomScalpGuide` | 1733 | function |  | 3 |
| `setScalpGuideSource` | 1751 | function |  | 7 |
| `updateScalpQuadWire` | 1767 | function |  | 4 |
| `updateScalpTopology` | 1783 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1847 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2027 | function |  | 2 |
| `currentStrandSelectionState` | 2103 | function |  | 4 |
| `applyStrandSelectionState` | 2107 | function |  | 5 |
| `clearStrandSelectionState` | 2112 | function |  | 7 |
| `guideHeadBounds` | 3211 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3221 | function |  | 5 |
| `disposeGuideModel` | 3235 | function |  | 3 |
| `syncHeadTransformInputs` | 3246 | function |  | 4 |
| `applyHeadTransform` | 3253 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3271 | function |  | 4 |
| `applyScalpRoughScale` | 3280 | function |  | 5 |
| `resetHeadTransform` | 3294 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3308 | function |  | 2 |
| `installGuideModel` | 3324 | function |  | 5 |
| `loadDefaultGuideModel` | 3400 | function |  | 3 |
| `braidTemplateFromEntries` | 3423 | function |  | 4 |
| `braidMeshEntries` | 3455 | function |  | 2 |
| `prepareBraidBodyCache` | 3467 | function |  | 2 |
| `quantize` | 3476 | arrow |  | 21 |
| `sourceNormalAt` | 3488 | arrow |  | 1 |
| `clusterBoundary` | 3491 | arrow |  | 2 |
| `normalBuckets` | 3508 | arrow |  | 2 |
| `applyBucketPair` | 3540 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3571 | function |  | 2 |
| `annotateBraidObjTopology` | 3592 | function |  | 2 |
| `loadBraidMeshPreset` | 3612 | function |  | 3 |
| `createSplitControlHandle` | 3629 | function |  | 4 |
| `frameGuideModel` | 3644 | function |  | 2 |
| `syncScalpInputs` | 3669 | function |  | 2 |
| `syncScalpArtistInputs` | 3675 | function |  | 2 |
| `rootScalpOffsetDistance` | 3683 | function |  | 15 |
| `applyLockRootScalpOffset` | 3688 | function |  | 5 |
| `normalizeHairLayer` | 3704 | function |  | 28 |
| `layerOffsetForLock` | 3708 | function |  | 9 |
| `layerRootOffsetFactor` | 3713 | function |  | 13 |
| `layerOffsetWeight` | 3717 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3723 | function |  | 5 |
| `pointsWithLayerOffset` | 3732 | function |  | 3 |
| `layerDirectionForLock` | 3740 | function |  | 2 |
| `applyLayerOffset` | 3751 | function |  | 5 |
| `setLockHairLayer` | 3775 | function |  | 2 |
| `setGroupLayerOffset` | 3790 | function |  | 2 |
| `scalpArtistWeight` | 3802 | function |  | 3 |
| `scalpArtistScalesAt` | 3806 | function |  | 3 |
| `applyScalpArtistShape` | 3816 | function |  | 5 |
| `inverseScalpArtistShape` | 3834 | function |  | 2 |
| `updateScalpSurface` | 3861 | function |  | 3 |
| `setActiveScalpRegion` | 3871 | function |  | 2 |
| `clearScalpRegions` | 3883 | function |  | 2 |
| `scalpHitFromEvent` | 3900 | function |  | 3 |
| `updateScalpBrushCursor` | 3908 | function |  | 4 |
| `paintScalpAt` | 3923 | function |  | 3 |
| `beginScalpPaint` | 3990 | function |  | 2 |
| `updateScalpPaint` | 3999 | function |  | 1 |
| `endScalpPaint` | 4008 | function |  | 2 |
| `createScalpLattice` | 4015 | function |  | 2 |
| `resetScalpLattice` | 4040 | function |  | 1 |
| `updateScalpLatticeObjects` | 4052 | function |  | 7 |
| `quadraticWeights` | 4066 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4071 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4098 | function |  | 3 |
| `selectScalpLatticePoint` | 4113 | function |  | 2 |
| `beginScalpLatticeDrag` | 4128 | function |  | 2 |
| `updateScalpLatticeDrag` | 4146 | function |  | 1 |
| `endScalpLatticeDrag` | 4164 | function |  | 2 |
| `setHeadReferenceTransparency` | 4170 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4180 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4198 | function |  | 3 |
| `trianglePlaneIntersections` | 4206 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4227 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4253 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4263 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4275 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4299 | function |  | 3 |
| `createScalpBuilderPlanes` | 4314 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4346 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4385 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4408 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4420 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4432 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4437 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4449 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4559 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4584 | function |  | 5 |
| `syncEditedScalpSurface` | 4599 | function |  | 4 |
| `ensureEditedScalpSurface` | 4670 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4700 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4785 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4798 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4814 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4824 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4842 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4855 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4862 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4881 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4895 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4936 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4945 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4958 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4979 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5116 | function |  | 2 |
| `scalpTemplateNeighbors` | 5124 | function |  | 2 |
| `smoothScalpVectorField` | 5136 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5150 | function |  | 2 |
| `upperContourCurve` | 5167 | function |  | 4 |
| `hermitePoint` | 5202 | function |  | 2 |
| `curveNetworkSection` | 5213 | function |  | 3 |
| `pointAlongSection` | 5242 | function |  | 3 |
| `longestStitchedContour` | 5248 | function |  | 2 |
| `nodeForPoint` | 5256 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5313 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5323 | function |  | 1 |
| `orderedRange` | 5335 | arrow |  | 3 |
| `clipSegment` | 5358 | arrow |  | 1 |
| `liftedPoint` | 5381 | arrow |  | 5 |
| `boundaryCorner` | 5386 | arrow |  | 4 |
| `surfaceCurveBetween` | 5395 | arrow |  | 1 |
| `addSurfaceConnector` | 5418 | arrow |  | 2 |
| `sideContourAtDepth` | 5486 | arrow |  | 3 |
| `addSurfacePatch` | 5520 | arrow |  | 1 |
| `addCenterBridgePatch` | 5600 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5708 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5743 | function |  | 1 |
| `generatedScalpObjContent` | 5833 | function |  | 2 |
| `generateScalpFromBuilder` | 5847 | function |  | 1 |
| `orderedDepthRange` | 5883 | arrow |  | 7 |
| `resetScalpBuilder` | 6012 | function |  | 1 |
| `confirmScalpBuilderPlane` | 6027 | function |  | 1 |
| `beginScalpBuilderInput` | 6041 | function |  | 2 |
| `updateScalpBuilderStroke` | 6042 | function |  | 1 |
| `finishScalpBuilderStroke` | 6043 | function |  | 2 |
| `setScalpBuilderEditing` | 6045 | function |  | 10 |
| `updateScalpEditingVisibility` | 6079 | function |  | 12 |
| `exitSetupEditors` | 6173 | function |  | 7 |
| `setCapsuleGuideEditing` | 6182 | function |  | 5 |
| `syncAppMenuVisibility` | 6210 | function |  | 3 |
| `closeAppMenus` | 6215 | function |  | 6 |
| `setAppMenuOpen` | 6226 | function |  | 3 |
| `setTurntableActive` | 6233 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6242 | function |  | 9 |
| `selectedReferenceImage` | 6246 | function |  | 20 |
| `normalizeReferenceCrop` | 6252 | function |  | 8 |
| `referenceCropIsFull` | 6260 | function |  | 3 |
| `referencePlaneFrontAxis` | 6265 | function |  | 4 |
| `referencePlanePlacement` | 6274 | function |  | 4 |
| `migratedReferencePlanePosition` | 6289 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6309 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6326 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6342 | function |  | 2 |
| `snappedReferenceImageView` | 6365 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6371 | function |  | 5 |
| `applyReferenceImageRuntime` | 6387 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6430 | function |  | 6 |
| `createReferenceImageRuntime` | 6438 | function |  | 3 |
| `addReferenceImage` | 6507 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6559 | function |  | 3 |
| `disposeReferenceImage` | 6578 | function |  | 2 |
| `clearReferenceImages` | 6582 | function |  | 2 |
| `serializeReferenceImage` | 6589 | function |  | 1 |
| `setReferenceImageType` | 6617 | function |  | 2 |
| `attachReferenceImageTransform` | 6661 | function |  | 6 |
| `selectReferenceImage` | 6675 | function |  | 12 |
| `placeReferencePlane` | 6698 | function |  | 2 |
| `setReferencePlaneInFront` | 6709 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6719 | function |  | 4 |
| `renderReferenceImagePanel` | 6738 | function |  | 20 |
| `setOutlinerTab` | 6785 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6803 | function |  | 4 |
| `componentEditModeActive` | 6807 | function |  | 38 |
| `selectionToolSupportsPicking` | 6811 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6816 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6832 | function |  | 2 |
| `setViewportSelectionMode` | 6862 | function |  | 4 |
| `setViewportEditMode` | 6874 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6916 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6930 | function |  | 8 |
| `outlinerGuides` | 6942 | function |  | 3 |
| `guideOutlinerLabel` | 6949 | function |  | 2 |
| `normalizeOutlinerName` | 6959 | function |  | 4 |
| `beginOutlinerRename` | 6964 | function |  | 2 |
| `finish` | 6975 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 7005 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 7015 | function |  | 2 |
| `renderGuideOutliner` | 7050 | function |  | 10 |
| `referenceOutlinerGroup` | 7108 | function |  | 2 |
| `renderReferenceOutliner` | 7112 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7229 | function |  | 5 |
| `readReferenceImageFile` | 7234 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7258 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7265 | function |  | 3 |
| `dragContainsReferenceImage` | 7310 | function |  | 3 |
| `setReferenceImageDragActive` | 7321 | function |  | 9 |
| `referenceDropDestination` | 7329 | function |  | 2 |
| `viewportOverlayDropPosition` | 7335 | function |  | 2 |
| `setReferenceDropHover` | 7344 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7362 | function |  | 2 |
| `referenceOverlayAtPointer` | 7382 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7400 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7413 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7459 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7509 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7531 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7542 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7568 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7577 | function |  | 2 |
| `referenceCropCursor` | 7592 | function |  | 3 |
| `updateReferenceCropHandles` | 7598 | function |  | 5 |
| `referenceCropSourcePoint` | 7619 | function |  | 2 |
| `beginReferenceCrop` | 7626 | function |  | 1 |
| `updateReferenceCrop` | 7664 | function |  | 1 |
| `finishReferenceCrop` | 7696 | function |  | 4 |
| `setHeadSetupEditing` | 7714 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7730 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7739 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7749 | function |  | 4 |
| `setScalpGuideVisibility` | 7755 | function |  | 12 |
| `currentGuideViewMode` | 7763 | function |  | 3 |
| `updateGuideViewToggle` | 7771 | function |  | 5 |
| `setGuideViewMode` | 7787 | function |  | 3 |
| `cycleGuideViewMode` | 7798 | function |  | 1 |
| `hideGuideViewContextMenu` | 7803 | function |  | 6 |
| `showGuideViewContextMenu` | 7807 | function |  | 1 |
| `strandPassesDisplayFilters` | 7820 | function |  | 4 |
| `strandVisibleForDisplay` | 7829 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7834 | function |  | 2 |
| `lockedStrandsExist` | 7838 | function |  | 3 |
| `hiddenStrandsExist` | 7842 | function |  | 2 |
| `hideSelectedStrands` | 7846 | function |  | 2 |
| `unhideHiddenStrands` | 7856 | function |  | 2 |
| `strandIsolationActive` | 7865 | function |  | 7 |
| `setStrandIsolation` | 7869 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7881 | function |  | 3 |
| `syncVisibilityParent` | 7892 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7899 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7928 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7935 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7955 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7978 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7986 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7993 | function |  | 9 |
| `setScalpLatticeEditing` | 8004 | function |  | 4 |
| `setScalpShapeEditing` | 8019 | function |  | 9 |
| `setScalpPaintEditing` | 8037 | function |  | 7 |
| `defaultCurveLatticePoints` | 8061 | function |  | 3 |
| `flatCurveLatticePoints` | 8087 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8096 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8120 | function |  | 4 |
| `horizontalValue` | 8125 | arrow |  | 1 |
| `blendedSample` | 8136 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8169 | function |  | 2 |
| `curveLatticeControlPoint` | 8184 | function |  | 9 |
| `circularArcTangent` | 8188 | function |  | 4 |
| `arcLengthTo` | 8219 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8231 | function |  | 3 |
| `sampleHermiteCurve` | 8270 | function |  | 10 |
| `sampleCurveLattice` | 8287 | function |  | 6 |
| `curveLatticeNormal` | 8306 | function |  | 1 |
| `createCurveLatticeGeometry` | 8317 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8346 | function |  | 3 |
| `appendCurve` | 8348 | arrow |  | 4 |
| `sample` | 8350 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8377 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8393 | function |  | 3 |
| `addPicker` | 8395 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8434 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8447 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8451 | function |  | 3 |
| `curveLatticeEditablePoint` | 8469 | function |  | 13 |
| `curveLatticePointSection` | 8476 | function |  | 3 |
| `curveLatticeRestPoint` | 8487 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8493 | function |  | 7 |
| `curveLatticeRootColumns` | 8499 | function |  | 3 |
| `curveTangentsForPoints` | 8506 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8518 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8555 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8581 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8598 | function |  | 3 |
| `resampleGrid` | 8608 | arrow |  | 2 |
| `controlPointIsSelected` | 8635 | function |  | 7 |
| `clearMultiPointSelection` | 8643 | function |  | 9 |
| `createCurveLatticeHandles` | 8647 | function |  | 4 |
| `addCurveLattice` | 8669 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8778 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8809 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8815 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8854 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8875 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8892 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8901 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8908 | function |  | 1 |
| `selectCurveLatticeLoop` | 8927 | function |  | 3 |
| `selectCurveLatticePoint` | 8956 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8971 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 9013 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9034 | function |  | 3 |
| `curveLatticeColumnPoints` | 9077 | function |  | 3 |
| `groupCurveControlIndices` | 9086 | function |  | 4 |
| `groupCurveControlPoints` | 9092 | function |  | 2 |
| `updateGroupCurveDisplay` | 9098 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9108 | function |  | 2 |
| `groupCurveDeformationPairs` | 9130 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9137 | function |  | 2 |
| `appendPairs` | 9139 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9150 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9169 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9190 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9209 | function |  | 2 |
| `capsuleGuideCapHeight` | 9243 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9247 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9252 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9256 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9268 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9284 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9290 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9316 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9346 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9400 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9421 | function |  | 7 |
| `vertex` | 9435 | function |  | 4 |
| `addFace` | 9441 | function |  | 3 |
| `addRing` | 9459 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9514 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9524 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9589 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9635 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9648 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9669 | function |  | 3 |
| `capsuleGuidePointDistances` | 9674 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9695 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9715 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9720 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9726 | function |  | 3 |
| `capsuleGuideAccentColor` | 9731 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9736 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9747 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9759 | function |  | 2 |
| `createCapsuleGuideHandles` | 9791 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9814 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9833 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9840 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9856 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9873 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9888 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9925 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9941 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9958 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9964 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9991 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 10003 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 10022 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10067 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10102 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10116 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10122 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10139 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10150 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10161 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10191 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10201 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10242 | function |  | 3 |
| `createQuadCageGeometry` | 10258 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10282 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10302 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10313 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10366 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10404 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10414 | function |  | 4 |
| `addCapsuleGuide` | 10422 | function |  | 4 |
| `addGuide` | 10491 | function |  | 1 |
| `createGuideGeometry` | 10552 | function |  | 4 |
| `selectGuide` | 10607 | function |  | 17 |
| `updateGuideControlsVisibility` | 10675 | function |  | 10 |
| `updateViewportToolVisibility` | 10692 | function |  | 7 |
| `getSelectedGuide` | 10731 | function |  | 34 |
| `selectedViewportFocusBounds` | 10735 | function |  | 2 |
| `frameViewportBounds` | 10749 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10779 | function |  | 2 |
| `fullSceneFocusBounds` | 10783 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10800 | function |  | 3 |
| `cycleViewportFraming` | 10809 | function |  | 2 |
| `syncGuideInputs` | 10827 | function |  | 5 |
| `updateGuideGeometry` | 10870 | function |  | 3 |
| `sculptBrushToolActive` | 10891 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10895 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10899 | function |  | 3 |
| `effectiveSculptBrushTool` | 10903 | function |  | 13 |
| `updateSculptScaleModeRow` | 10909 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10914 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10936 | function |  | 5 |
| `setActiveTool` | 10945 | function |  | 19 |
| `setDrawStrandMode` | 11083 | function |  | 2 |
| `setObjectSpaceEditing` | 11093 | function |  | 7 |
| `setHierarchyEditing` | 11109 | function |  | 4 |
| `setProportionalEditing` | 11121 | function |  | 5 |
| `beginProportionalSizeEdit` | 11140 | function |  | 3 |
| `updateProportionalSizeEdit` | 11152 | function |  | 2 |
| `endProportionalSizeEdit` | 11163 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11170 | function |  | 2 |
| `refreshProportionalPreview` | 11178 | function |  | 4 |
| `activeBrushSizeInput` | 11188 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11197 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11209 | function |  | 2 |
| `beginBrushSizeDrag` | 11227 | function |  | 1 |
| `updateBrushSizeDrag` | 11254 | function |  | 1 |
| `finishBrushSizeDrag` | 11275 | function |  | 2 |
| `updateInteractionLocks` | 11292 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11301 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11310 | function |  | 2 |
| `configureTransformControls` | 11341 | function |  | 16 |
| `pullMoveActive` | 11349 | function |  | 9 |
| `updatePullGuideVisual` | 11353 | function |  | 4 |
| `attachTransformForCurvePoint` | 11369 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11393 | function |  | 7 |
| `strandObjectRootIndex` | 11409 | function |  | 3 |
| `strandObjectRoot` | 11418 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11422 | function |  | 2 |
| `attachStrandObjectTransform` | 11427 | function |  | 6 |
| `guideObjectPivot` | 11450 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11461 | function |  | 2 |
| `attachGuideObjectTransform` | 11466 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11485 | function |  | 2 |
| `beginGuideObjectTransform` | 11513 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11520 | function |  | 2 |
| `updateGuideObjectTransform` | 11542 | function |  | 2 |
| `finishGuideObjectTransform` | 11575 | function |  | 2 |
| `clonePlacementFrame` | 11584 | function |  | 2 |
| `cloneOptionalVectors` | 11596 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11600 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11617 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11632 | function |  | 2 |
| `strandObjectTransformOperators` | 11648 | function |  | 4 |
| `transformPoint` | 11656 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11663 | arrow |  | 0 |
| `transformNormal` | 11669 | arrow |  | 10 |
| `transformDirection` | 11679 | arrow |  | 7 |
| `worldMatrixForPivot` | 11691 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11697 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11713 | function |  | 6 |
| `beginStrandObjectTransform` | 11727 | function |  | 2 |
| `updateStrandObjectTransform` | 11765 | function |  | 2 |
| `commitStrandObjectTransform` | 11814 | function |  | 2 |
| `mapPoints` | 11827 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11861 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11875 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11898 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11911 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11926 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11952 | function |  | 2 |
| `finishSurfaceObjectTransform` | 12001 | function |  | 2 |
| `beginHandleEdit` | 12010 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12059 | function |  | 3 |
| `applyBranchRigidRootMove` | 12076 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12113 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12124 | function |  | 3 |
| `multiPointHandleEditActive` | 12135 | function |  | 7 |
| `applyMultiMove` | 12139 | function |  | 5 |
| `applyMultiRotate` | 12145 | function |  | 2 |
| `applyMultiScale` | 12154 | function |  | 2 |
| `applyHierarchicalMove` | 12163 | function |  | 3 |
| `applySingleMove` | 12175 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12179 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12196 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12205 | function |  | 3 |
| `changed` | 12215 | arrow |  | 1 |
| `applyPullMove` | 12257 | function |  | 3 |
| `pullHeadCollisionContext` | 12265 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12284 | function |  | 2 |
| `applyProportionalMove` | 12307 | function |  | 3 |
| `viewPlaneNormal` | 12318 | function |  | 20 |
| `isCameraInSnappedView` | 12322 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12330 | function |  | 10 |
| `updateViewPlaneGrid` | 12334 | function |  | 14 |
| `setViewPlaneMove` | 12391 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12402 | function |  | 2 |
| `rayFromViewportEvent` | 12410 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12418 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12428 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12439 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12452 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12471 | function |  | 4 |
| `beginViewPlaneMove` | 12478 | function |  | 3 |
| `updateViewPlaneMove` | 12542 | function |  | 1 |
| `endViewPlaneMove` | 12607 | function |  | 7 |
| `applyHierarchicalRotate` | 12626 | function |  | 2 |
| `rotateGuideNormal` | 12633 | arrow |  | 4 |
| `applySingleRotate` | 12671 | function |  | 2 |
| `applyProportionalRotate` | 12675 | function |  | 2 |
| `applyHierarchicalScale` | 12695 | function |  | 2 |
| `applySingleScale` | 12705 | function |  | 2 |
| `applyProportionalScale` | 12709 | function |  | 2 |
| `setPointScale` | 12725 | function |  | 8 |
| `proportionalWeight` | 12734 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12746 | function |  | 5 |
| `strandInfluenceColor` | 12752 | function |  | 17 |
| `beginRelaxEdit` | 12777 | function |  | 3 |
| `updateRelaxEdit` | 12806 | function |  | 1 |
| `endRelaxEdit` | 12866 | function |  | 1 |
| `disposeGuide` | 12876 | function |  | 3 |
| `removeGuideObjects` | 12904 | function |  | 3 |
| `strandRadiusAt` | 12918 | function |  | 5 |
| `strandProfileTopologyAt` | 12935 | function |  | 8 |
| `strandCurveParameters` | 12977 | function |  | 5 |
| `widthProfileAt` | 12987 | arrow |  | 1 |
| `braidFrameAt` | 13025 | function |  | 5 |
| `braidFrameAtExtended` | 13035 | function |  | 2 |
| `createBraidProfileProjector` | 13044 | function |  | 2 |
| `project` | 13060 | arrow |  | 17 |
| `createBraidGeometry` | 13075 | function |  | 2 |
| `deformationAt` | 13110 | function |  | 3 |
| `widthFor` | 13119 | arrow |  | 3 |
| `depthFor` | 13123 | arrow |  | 3 |
| `outputVertex` | 13155 | function |  | 7 |
| `appendAuthoredCap` | 13263 | function |  | 3 |
| `outputCapVertex` | 13270 | arrow |  | 6 |
| `capBoundary` | 13361 | function |  | 3 |
| `strandGeometryCurve` | 13423 | function |  | 15 |
| `strandGeometryFrameAt` | 13449 | function |  | 19 |
| `transportedStrandFrameAt` | 13512 | function |  | 7 |
| `twistOverrideAt` | 13515 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13543 | function |  | 2 |
| `weldPanelGeometryData` | 13579 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13619 | function |  | 3 |
| `surfacePanelPoint` | 13634 | function |  | 3 |
| `createPanelStrandGeometry` | 13657 | function |  | 2 |
| `addQuad` | 13691 | arrow |  | 6 |
| `near` | 13695 | arrow |  | 6 |
| `panelWidthAt` | 13725 | arrow |  | 6 |
| `panelThicknessAt` | 13734 | arrow |  | 6 |
| `panelFrameAt` | 13743 | arrow |  | 1 |
| `rawPanelPoint` | 13761 | arrow |  | 1 |
| `panelPoint` | 13781 | arrow |  | 2 |
| `addPatch` | 13787 | arrow |  | 1 |
| `splitOpening` | 13838 | arrow |  | 2 |
| `uStart` | 13862 | arrow |  | 1 |
| `uEnd` | 13865 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13903 | function |  | 3 |
| `inside` | 13904 | arrow |  | 2 |
| `pushOrientedTriangle` | 13926 | function |  | 7 |
| `triangulatePolygon3D` | 13937 | function |  | 1 |
| `orientedQuadFace` | 13977 | function |  | 2 |
| `createSplitStrandGeometry` | 13985 | function |  | 2 |
| `fusedIndexAt` | 14142 | arrow |  | 0 |
| `createHairCardGeometry` | 14191 | function |  | 2 |
| `createPolyGeometry` | 14290 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14317 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14326 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14373 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14381 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14397 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14406 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14417 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14425 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14435 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14455 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14478 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14557 | function |  | 2 |
| `pushBoundary` | 14586 | arrow |  | 5 |
| `boundaryAt` | 14604 | arrow |  | 3 |
| `hermite` | 14626 | arrow |  | 2 |
| `emitBottomMidRow` | 14671 | arrow |  | 2 |
| `emitTopMidRow` | 14770 | arrow |  | 2 |
| `sideHoleVertex` | 14812 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14861 | arrow |  | 2 |
| `emitFillStrip` | 14932 | arrow |  | 2 |
| `fillSide` | 14943 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14987 | arrow |  | 2 |
| `edgeDirection` | 15011 | arrow |  | 1 |
| `positionAt` | 15070 | arrow |  | 1 |
| `createBranchChildGeometry` | 15121 | function |  | 2 |
| `createCompoundStrandGeometry` | 15331 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15582 | function |  | 2 |
| `createHairGeometry` | 15613 | function |  | 6 |
| `createBaseHairGeometry` | 15665 | function |  | 3 |
| `hairMaterialDefinition` | 15783 | function |  | 4 |
| `materialForLock` | 15787 | function |  | 8 |
| `activeHairMaterialDefinition` | 15791 | function |  | 11 |
| `strandDisplayColor` | 15797 | function |  | 14 |
| `setAnimeHairBaseColor` | 15815 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15828 | function |  | 2 |
| `createHairMaterial` | 15868 | function |  | 5 |
| `createStrandSelectionOutline` | 15910 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15944 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15953 | function |  | 6 |
| `refreshMaterialUsers` | 15980 | function |  | 6 |
| `renderHairMaterialOutliner` | 15989 | function |  | 5 |
| `renderHairMaterialOptions` | 16019 | function |  | 3 |
| `syncHairMaterialEditor` | 16029 | function |  | 9 |
| `createProjectHairMaterial` | 16055 | function |  | 3 |
| `deleteActiveHairMaterial` | 16075 | function |  | 2 |
| `createHairTopologyGeometry` | 16093 | function |  | 4 |
| `createHairTopologyOverlay` | 16114 | function |  | 3 |
| `groupDefaultsFor` | 16161 | function |  | 9 |
| `creationToolActive` | 16168 | function |  | 8 |
| `activeCreationShapeDefaults` | 16172 | function |  | 11 |
| `activeStrandShapeTarget` | 16178 | function |  | 5 |
| `curvePolylineLength` | 16182 | function |  | 2 |
| `curvePolylineLengths` | 16190 | function |  | 3 |
| `samplePolylineDistance` | 16198 | function |  | 2 |
| `applyProjectedCurveLength` | 16208 | function |  | 4 |
| `clearRegionLengthBaseline` | 16239 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16246 | function |  | 2 |
| `setGroupLengthScale` | 16254 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16292 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16324 | function |  | 1 |
| `activeSweepProfile` | 16333 | function |  | 9 |
| `activeSweepProfileTarget` | 16340 | function |  | 6 |
| `trimmedSweepProfile` | 16347 | function |  | 7 |
| `roundedLeft` | 16356 | arrow |  | 1 |
| `roundedRight` | 16362 | arrow |  | 1 |
| `activeProfileOffset` | 16379 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16386 | function |  | 3 |
| `profileToCanvas` | 16403 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16407 | function |  | 11 |
| `sampleSweepProfile` | 16416 | function |  | 7 |
| `createSweepProfileTopology` | 16437 | function |  | 5 |
| `renderProfilePreview` | 16479 | function |  | 8 |
| `renderHairCardCoveragePath` | 16498 | function |  | 3 |
| `activeTaperTarget` | 16513 | function |  | 15 |
| `twistCurveEditing` | 16520 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16524 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16528 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16532 | function |  | 17 |
| `taperAsymmetryKey` | 16536 | function |  | 12 |
| `taperSecondaryKey` | 16540 | function |  | 11 |
| `activeTaperCurve` | 16544 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16555 | function |  | 6 |
| `taperSamples` | 16565 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16572 | function |  | 2 |
| `renderTaperPreview` | 16594 | function |  | 13 |
| `renderTwistCurvePreview` | 16630 | function |  | 5 |
| `cloneShapePresetValue` | 16648 | function |  | 66 |
| `shapeValuesMatch` | 16652 | function |  | 5 |
| `shapeTargetForSelect` | 16660 | function |  | 4 |
| `loadCustomShapePresets` | 16670 | function |  | 2 |
| `saveCustomShapePresets` | 16681 | function |  | 4 |
| `shapePresetLabel` | 16689 | function |  | 4 |
| `setupShapePresetControls` | 16694 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16719 | function |  | 3 |
| `syncShapePresetSelects` | 16725 | function |  | 8 |
| `populateShapePresetSelects` | 16746 | function |  | 5 |
| `applyShapePreset` | 16773 | function |  | 2 |
| `openSaveShapePreset` | 16810 | function |  | 2 |
| `commitCustomShapePreset` | 16835 | function |  | 2 |
| `openRemoveShapePreset` | 16858 | function |  | 2 |
| `commitRemoveShapePreset` | 16871 | function |  | 2 |
| `taperPointToCanvas` | 16887 | function |  | 4 |
| `canvasToTaperPoint` | 16904 | function |  | 2 |
| `clearTaperMeshPoints` | 16940 | function |  | 2 |
| `taperMeshPointFrame` | 16950 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16960 | function |  | 4 |
| `twistMeshGraphAxis` | 16968 | function |  | 4 |
| `addTwistMeshCurvePath` | 16972 | function |  | 2 |
| `appendSegment` | 16993 | arrow |  | 1 |
| `appendFill` | 16996 | arrow |  | 1 |
| `appendSignedSection` | 17002 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17051 | function |  | 6 |
| `updateTaperMeshPoints` | 17088 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17167 | function |  | 5 |
| `renderTaperCurveEditor` | 17185 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17257 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17271 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17287 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17321 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17330 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17341 | function |  | 2 |
| `applyTaperCurveEdit` | 17349 | function |  | 10 |
| `openTaperCurveEditor` | 17457 | function |  | 3 |
| `closeTaperCurveEditor` | 17502 | function |  | 6 |
| `updateViewportStatsVisibility` | 17515 | function |  | 6 |
| `canvasToProfile` | 17534 | function |  | 2 |
| `renderSweepProfileEditor` | 17544 | function |  | 7 |
| `applySweepProfileEdit` | 17587 | function |  | 8 |
| `openSweepProfileEditor` | 17614 | function |  | 1 |
| `closeSweepProfileEditor` | 17649 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17658 | function |  | 2 |
| `addLock` | 17673 | function |  | 19 |
| `mirroredScalpRegion` | 17876 | function |  | 5 |
| `mirroredVector` | 17885 | function |  | 12 |
| `mirroredPlacementFrame` | 17889 | function |  | 2 |
| `mirrorPartnerFor` | 17902 | function |  | 40 |
| `decoupleMirrorPartner` | 17906 | function |  | 2 |
| `createMirrorPartner` | 17914 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 18010 | function |  | 6 |
| `mirroredClumpPartners` | 18015 | function |  | 6 |
| `createMirroredClump` | 18021 | function |  | 3 |
| `decoupleMirroredClump` | 18043 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18052 | function |  | 6 |
| `syncActiveMirror` | 18217 | function |  | 25 |
| `setMirrorXEditing` | 18229 | function |  | 6 |
| `snapshotState` | 18253 | function |  | 7 |
| `scalpTriangleRegion` | 18510 | function |  | 4 |
| `closestPointOnActiveScalp` | 18523 | function |  | 12 |
| `rootAttachmentFrame` | 18595 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18607 | function |  | 4 |
| `resolveRootAttachment` | 18625 | function |  | 4 |
| `curvePointsToRootLocal` | 18665 | function |  | 2 |
| `curvePointsFromRootLocal` | 18677 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18685 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18701 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18731 | function |  | 2 |
| `createRootAttachment` | 18743 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18773 | function |  | 4 |
| `rootAttachmentToData` | 18800 | function |  | 2 |
| `rootAttachmentFromData` | 18828 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18867 | function |  | 2 |
| `remapPoint` | 18882 | arrow |  | 1 |
| `remapVector` | 18883 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18912 | function |  | 2 |
| `importHeadMeshFile` | 18929 | function |  | 3 |
| `importFullBodyMeshFile` | 18952 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18977 | function |  | 1 |
| `importedBooleanPreference` | 19010 | function |  | 11 |
| `loadPreferencesAndPresets` | 19014 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19084 | function |  | 1 |
| `openHairProjectFile` | 19127 | function |  | 4 |
| `dragContainsApplicationFile` | 19185 | function |  | 3 |
| `safelyRememberRecentProject` | 19194 | function |  | 2 |
| `renderRecentProjectsMenu` | 19203 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19235 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19260 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19264 | function |  | 2 |
| `pushUndoState` | 19280 | function |  | 119 |
| `undoLastAction` | 19287 | function |  | 2 |
| `redoLastAction` | 19301 | function |  | 2 |
| `updateHistoryButtons` | 19315 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19320 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19337 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19344 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19382 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19459 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19485 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19517 | function |  | 2 |
| `finalizeStateRestore` | 19558 | function |  | 2 |
| `restoreState` | 19565 | function |  | 5 |
| `disposeAllEditableObjects` | 19589 | function |  | 2 |
| `restoreLock` | 19610 | function |  | 4 |
| `restoreGuide` | 19827 | function |  | 2 |
| `vectorToData` | 19888 | function |  | 29 |
| `dataToVector` | 19892 | function |  | 31 |
| `frameToData` | 19896 | function |  | 2 |
| `frameFromData` | 19908 | function |  | 2 |
| `applyPresetSelection` | 19920 | function |  | 2 |
| `drawPresetThumbnail` | 19951 | function |  | 1 |
| `fillHair` | 19966 | arrow |  | 9 |
| `strand` | 19978 | arrow |  | 31 |
| `bun` | 19996 | arrow |  | 2 |
| `braid` | 20031 | arrow |  | 2 |
| `renderPresetLibrary` | 20120 | function |  | 3 |
| `setPresetLibraryOpen` | 20179 | function |  | 6 |
| `average` | 20192 | function |  | 4 |
| `fitPointAttributes` | 20196 | function |  | 9 |
| `rebuildCurveObjects` | 20225 | function |  | 10 |
| `createCurvePoints` | 20237 | function |  | 2 |
| `addGeneratedBangPreset` | 20246 | function |  | 1 |
| `sampleScalpQuad` | 20339 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20363 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20412 | function |  | 1 |
| `columns` | 20413 | arrow |  | 1 |
| `layer` | 20417 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20631 | function |  | 2 |
| `addBraidedBobPreset` | 20667 | function |  | 1 |
| `evenColumns` | 20668 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20884 | function |  | 1 |
| `scalpSeed` | 20907 | arrow |  | 1 |
| `createBowlCutPoints` | 21194 | function |  | 2 |
| `addBowlCutPreset` | 21232 | function |  | 1 |
| `scalpRegionAtHit` | 21298 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21310 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21317 | function |  | 12 |
| `braidStrokeActive` | 21324 | function |  | 9 |
| `proceduralDrawActive` | 21328 | function |  | 3 |
| `panelStrokeActive` | 21332 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21336 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21340 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21344 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21350 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21354 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21358 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21362 | function |  | 3 |
| `liveSurfaceStrandId` | 21372 | function |  | 4 |
| `liveSurfaceStrand` | 21376 | function |  | 4 |
| `liveSurfaceGuideId` | 21381 | function |  | 3 |
| `guideSupportsLiveSurface` | 21385 | function |  | 2 |
| `liveSurfaceGuide` | 21392 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21399 | function |  | 12 |
| `activeStrokeScalpOffset` | 21439 | function |  | 4 |
| `activeStrokeBrushSize` | 21445 | function |  | 10 |
| `activeStrokeBrushDepth` | 21451 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21457 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21465 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21475 | function |  | 13 |
| `worldNormalAtHit` | 21514 | function |  | 6 |
| `selectedPolyMesh` | 21522 | function |  | 10 |
| `addPolyLock` | 21527 | function |  | 2 |
| `ensurePolyMesh` | 21546 | function |  | 3 |
| `polySurfaceSample` | 21550 | function |  | 4 |
| `polyTargetAtEvent` | 21561 | function |  | 6 |
| `refreshPolyMesh` | 21587 | function |  | 10 |
| `ensurePolyFillPreview` | 21596 | function |  | 2 |
| `clearPolyFillPreview` | 21633 | function |  | 17 |
| `polyFillCandidateForEvent` | 21638 | function |  | 3 |
| `showPolyFillPreview` | 21658 | function |  | 2 |
| `updatePolyFillPreview` | 21684 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21709 | function |  | 5 |
| `fillPolyGap` | 21719 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21730 | function |  | 2 |
| `projectPolyRelaxPoint` | 21750 | function |  | 2 |
| `removePolyPointAttributes` | 21794 | function |  | 3 |
| `deletePolyComponent` | 21803 | function |  | 2 |
| `addPolyPoint` | 21826 | function |  | 4 |
| `appendPolyStrokeRow` | 21835 | function |  | 4 |
| `beginPolyBrushPointer` | 21855 | function |  | 1 |
| `finishPolyAltDelete` | 21941 | function |  | 1 |
| `updatePolyBrushStroke` | 21955 | function |  | 1 |
| `finishPolyBrushStroke` | 22045 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22082 | function |  | 2 |
| `drawSampleFromHit` | 22105 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22119 | function |  | 3 |
| `strokeLength` | 22156 | function |  | 9 |
| `resampleDrawStroke` | 22162 | function |  | 2 |
| `processedDrawStroke` | 22194 | function |  | 8 |
| `strokeSurfaceNormals` | 22223 | function |  | 7 |
| `drawClumpFrame` | 22234 | function |  | 4 |
| `nearestCurveParameter` | 22243 | function |  | 2 |
| `drawClumpSampleNormal` | 22257 | function |  | 6 |
| `drawClumpTemplateVector` | 22266 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22272 | function |  | 3 |
| `drawClumpStrandMaps` | 22288 | function |  | 4 |
| `nextClumpName` | 22343 | function |  | 6 |
| `initializeClumpShape` | 22350 | function |  | 5 |
| `stableClumpVariation` | 22361 | function |  | 3 |
| `createClumpFromLocks` | 22373 | function |  | 7 |
| `addLockToClump` | 22398 | function |  | 4 |
| `stableBranchBaseNormals` | 22416 | function |  | 4 |
| `ensureBranchParentNormalField` | 22427 | function |  | 2 |
| `branchParentFrame` | 22433 | function |  | 7 |
| `branchLocalVector` | 22445 | function |  | 3 |
| `branchWorldVector` | 22449 | function |  | 4 |
| `captureBranchLocalState` | 22455 | function |  | 6 |
| `enforceBranchRootPosition` | 22483 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22533 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22560 | function |  | 2 |
| `clampRegionParam` | 22607 | function |  | 113 |
| `branchRootRegionFromParam` | 22614 | function |  | 4 |
| `cloneBranchRootRegion` | 22637 | function |  | 5 |
| `flip` | 22639 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22672 | function |  | 8 |
| `setBranchRootRegionPoint` | 22703 | function |  | 3 |
| `branchRegionUVToCanvas` | 22739 | function |  | 10 |
| `branchRegionCanvasToUV` | 22742 | function |  | 4 |
| `openBranchRegionEditor` | 22748 | function |  | 2 |
| `closeBranchRegionEditor` | 22762 | function |  | 2 |
| `retargetBranchRegionEditor` | 22768 | function |  | 2 |
| `renderBranchRegionEditor` | 22773 | function |  | 9 |
| `applyBranchRegionView` | 22861 | function |  | 6 |
| `resetBranchRegionZoom` | 22864 | function |  | 1 |
| `branchRegionNavAction` | 22870 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22884 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22904 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22908 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22934 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22946 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22951 | function |  | 1 |
| `branchRegionEventUV` | 22971 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22979 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23084 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23217 | function |  | 1 |
| `pointerToNdc` | 23222 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23233 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23247 | function |  | 1 |
| `endBranchSweepStartDrag` | 23270 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23277 | function |  | 5 |
| `gridProfileSkipCol` | 23304 | function |  | 3 |
| `branchRootRegionSurface` | 23313 | function |  | 6 |
| `toGridCol` | 23338 | arrow |  | 5 |
| `toRow` | 23342 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23397 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23417 | function |  | 2 |
| `pointAt` | 23423 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23450 | function |  | 3 |
| `applyBranchRootOffset` | 23522 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23541 | function |  | 3 |
| `branchChildrenFor` | 23561 | function |  | 9 |
| `detachBranch` | 23565 | function |  | 2 |
| `updateBranchChildren` | 23576 | function |  | 4 |
| `clumpDirectMembers` | 23619 | function |  | 3 |
| `clumpMembersForGuide` | 23624 | function |  | 6 |
| `clumpGuideForLock` | 23628 | function |  | 13 |
| `proceduralGuideForLock` | 23633 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23640 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23647 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23654 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23666 | function |  | 2 |
| `applyProceduralBranchSettings` | 23679 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23718 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23734 | function |  | 3 |
| `createProceduralAccessoryLock` | 23748 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23800 | function |  | 2 |
| `clumpFrameAt` | 23851 | function |  | 5 |
| `commitClumpMemberRestState` | 23859 | function |  | 10 |
| `updateClumpMembers` | 23942 | function |  | 10 |
| `dissolveClump` | 24046 | function |  | 6 |
| `detachLockFromClump` | 24083 | function |  | 4 |
| `updateDrawVolumePreview` | 24109 | function |  | 5 |
| `hideDrawClumpPreviews` | 24133 | function |  | 5 |
| `resetDrawVolumePreview` | 24139 | function |  | 3 |
| `updateDrawStrandPreview` | 24145 | function |  | 23 |
| `continueFromTipEnabled` | 24364 | function |  | 2 |
| `selectedTipContinuationLock` | 24370 | function |  | 3 |
| `selectedDrawBranchPoint` | 24383 | function |  | 3 |
| `canBranchDrawFromLock` | 24400 | function |  | 3 |
| `beginDrawStrandStroke` | 24407 | function |  | 2 |
| `beginDrawFreePlane` | 24532 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24546 | function |  | 2 |
| `updateDrawStrandStroke` | 24571 | function |  | 1 |
| `createDrawnLock` | 24617 | function |  | 3 |
| `setting` | 24621 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24689 | function |  | 4 |
| `createDrawnBraid` | 24697 | function |  | 2 |
| `createDrawnStrand` | 24754 | function |  | 2 |
| `createDrawnPanel` | 24881 | function |  | 2 |
| `surfaceLatticeNormal` | 24931 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24946 | function |  | 3 |
| `createViewportSurface` | 25011 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25040 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25046 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25053 | function |  | 4 |
| `updateLoftSurfacePreview` | 25062 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25094 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25110 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25128 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25150 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25176 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25186 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25190 | function |  | 2 |
| `curveSurfacePreviewLock` | 25199 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25222 | function |  | 2 |
| `hideCurveSurfacePreview` | 25238 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25250 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25255 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25264 | function |  | 3 |
| `curveSurfaceSideVector` | 25302 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25315 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25323 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25336 | function |  | 5 |
| `updateCurveSurfacePreview` | 25356 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25418 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25440 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25455 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25503 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25538 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25570 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25628 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25705 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25710 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25719 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25753 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25764 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25794 | function |  | 2 |
| `extendDrawnStrand` | 25851 | function |  | 2 |
| `finishDrawStrandStroke` | 25884 | function |  | 7 |
| `createPlacedStrand` | 25911 | function |  | 2 |
| `placedPointCount` | 25975 | function |  | 3 |
| `createPlacedPoints` | 25979 | function |  | 3 |
| `pushPointOutsideHead` | 25998 | function |  | 8 |
| `resizePlacedStrand` | 26030 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26047 | function |  | 5 |
| `beginPlaceEdit` | 26052 | function |  | 2 |
| `updatePlaceEdit` | 26070 | function |  | 1 |
| `updatePlacementLength` | 26084 | function |  | 3 |
| `updatePlacementOrientation` | 26094 | function |  | 3 |
| `endPlaceEdit` | 26112 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26127 | function |  | 1 |
| `pendingPlacedLock` | 26137 | function |  | 2 |
| `beginPlacementPointer` | 26141 | function |  | 3 |
| `finishPlacementPointer` | 26151 | function |  | 2 |
| `confirmPlacementStep` | 26175 | function |  | 2 |
| `finishPlacementFlow` | 26198 | function |  | 7 |
| `updatePlacementStatus` | 26211 | function |  | 83 |
| `deselectStrands` | 26350 | function |  | 12 |
| `beginSelectionMarquee` | 26365 | function |  | 3 |
| `beginAltOrbit` | 26389 | function |  | 1 |
| `beginBlenderNavigation` | 26401 | function |  | 1 |
| `endBlenderNavigation` | 26446 | function |  | 1 |
| `prepareSelectPointerCapture` | 26454 | function |  | 1 |
| `endSelectPointerCapture` | 26460 | function |  | 1 |
| `endAltOrbit` | 26466 | function |  | 1 |
| `dollyCameraByDrag` | 26473 | function |  | 2 |
| `fastDragMagnitude` | 26496 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26502 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26510 | function |  | 1 |
| `endHoudiniZoomDrag` | 26527 | function |  | 1 |
| `updateSelectionMarquee` | 26535 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26552 | function |  | 3 |
| `selectPointsInMarquee` | 26560 | function |  | 2 |
| `pointKey` | 26586 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26617 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26654 | function |  | 3 |
| `projectedPoint` | 26671 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26700 | function |  | 2 |
| `finishSelectionMarquee` | 26745 | function |  | 2 |
| `headMeshes` | 26768 | function |  | 9 |
| `strandSplitProfileData` | 26776 | function |  | 4 |
| `strandSplitControlPoint` | 26789 | function |  | 4 |
| `panelSplitControlPoint` | 26825 | function |  | 6 |
| `strandControlPointRaycast` | 26881 | function |  | 1 |
| `strandControlPointFrame` | 26916 | function |  | 6 |
| `branchRootGizmoFrame` | 26947 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26965 | function |  | 5 |
| `createCurveObjects` | 27023 | function |  | 4 |
| `polyEdgeKey` | 27196 | function |  | 2 |
| `polyMeshEdges` | 27200 | function |  | 2 |
| `populatePolyEditObjects` | 27214 | function |  | 3 |
| `createPolyEditObjects` | 27275 | function |  | 2 |
| `rebuildPolyEditObjects` | 27283 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27297 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27304 | function |  | 2 |
| `strandWidthEdgeSample` | 27313 | function |  | 3 |
| `strandWidthEdgePoints` | 27336 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27350 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27354 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27361 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27373 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27378 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27384 | function |  | 3 |
| `updateCurveObjects` | 27398 | function |  | 41 |
| `createCurveNormalIndicator` | 27655 | function |  | 2 |
| `pointUpDirection` | 27681 | function |  | 2 |
| `curveFrameAtPoint` | 27685 | function |  | 5 |
| `curveFrameAt` | 27706 | function |  | 10 |
| `strandTwistAt` | 27726 | function |  | 6 |
| `controlPointRotationAt` | 27731 | function |  | 6 |
| `strandProfileTwistAt` | 27735 | function |  | 2 |
| `strandFrameAt` | 27741 | function |  | 1 |
| `curveFrameAtSnapshot` | 27747 | function |  | 3 |
| `outwardNormalAtPoint` | 27766 | function |  | 11 |
| `sampledSurfaceNormal` | 27778 | function |  | 2 |
| `guidedNormalAt` | 27794 | function |  | 5 |
| `twistFromHandle` | 27813 | function |  | 3 |
| `signedAngleAroundAxis` | 27834 | function |  | 5 |
| `handleColor` | 27841 | function |  | 2 |
| `isAffectedCurvePoint` | 27864 | function |  | 2 |
| `syncLockFromCurve` | 27870 | function |  | 26 |
| `labelForPreset` | 27900 | function |  | 1 |
| `rebuildLockGeometry` | 27904 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27931 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27939 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27945 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27967 | function |  | 8 |
| `updateLockGeometry` | 27980 | function |  | 57 |
| `setGroupColorView` | 28001 | function |  | 2 |
| `createUvCheckerTexture` | 28011 | function |  | 3 |
| `ensureUvCheckerForLock` | 28047 | function |  | 4 |
| `removeUvCheckerFromLock` | 28080 | function |  | 3 |
| `invalidateUvInspector` | 28095 | function |  | 7 |
| `uvInspectorRecord` | 28099 | function |  | 1 |
| `uvInspectorRecords` | 28138 | function |  | 2 |
| `drawUvInspectorGrid` | 28142 | function |  | 2 |
| `renderUvInspector` | 28176 | function |  | 3 |
| `setUvCheckerEnabled` | 28235 | function |  | 3 |
| `strandViewportBaseColor` | 28252 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28287 | function |  | 3 |
| `syncStrandSelectionOutline` | 28293 | function |  | 2 |
| `applyLockedStrandPalette` | 28304 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28313 | function |  | 6 |
| `setStrandSelectionVisual` | 28322 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28338 | function |  | 2 |
| `syncProceduralParentVisibility` | 28345 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28354 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28358 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28362 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28375 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28395 | function |  | 3 |
| `selectLock` | 28428 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28481 | function |  | 6 |
| `syncGroupInputs` | 28492 | function |  | 3 |
| `topologyStatsForLock` | 28525 | function |  | 4 |
| `formatTopologyStats` | 28533 | function |  | 5 |
| `updateTopologyStats` | 28537 | function |  | 20 |
| `normalizeBraidDimensions` | 28571 | function |  | 4 |
| `normalizeStrandDimensions` | 28584 | function |  | 3 |
| `strandBaseWidth` | 28598 | function |  | 5 |
| `strandWidthDimension` | 28602 | function |  | 5 |
| `strandDepthDimension` | 28610 | function |  | 8 |
| `setStrandWidthDimension` | 28618 | function |  | 2 |
| `setStrandDepthDimension` | 28640 | function |  | 4 |
| `syncShapeDimensionInputs` | 28656 | function |  | 4 |
| `syncCreationShapeInputs` | 28692 | function |  | 5 |
| `syncViewportDrawSettings` | 28730 | function |  | 5 |
| `syncPanelShapeInputs` | 28744 | function |  | 6 |
| `syncStrandSplitInputs` | 28770 | function |  | 4 |
| `syncHairCardControls` | 28779 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28787 | function |  | 3 |
| `updateAttributeEditorMode` | 28826 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28976 | function |  | 3 |
| `curveLatticeForGroup` | 28999 | function |  | 2 |
| `filterCurveLatticesToGroup` | 29017 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29062 | function |  | 2 |
| `showCurveLatticeForGroup` | 29079 | function |  | 2 |
| `selectStrandGroup` | 29116 | function |  | 3 |
| `selectCurvePoint` | 29158 | function |  | 10 |
| `updateSelectedPointLabel` | 29172 | function |  | 14 |
| `syncInputs` | 29185 | function |  | 16 |
| `syncClumpGuidePanel` | 29231 | function |  | 3 |
| `getSelectedLock` | 29258 | function |  | 105 |
| `selectedLocksInOrder` | 29262 | function |  | 37 |
| `lockStrands` | 29268 | function |  | 3 |
| `lockSelectedStrands` | 29301 | function |  | 3 |
| `unlockStrands` | 29307 | function |  | 3 |
| `unlockAllStrands` | 29322 | function |  | 3 |
| `strandEditFamily` | 29326 | function |  | 7 |
| `compatibleSelectedLocks` | 29331 | function |  | 6 |
| `selectedEditRoots` | 29338 | function |  | 2 |
| `editSelectedLocks` | 29351 | function |  | 21 |
| `multiEditValuesEqual` | 29384 | function |  | 2 |
| `setMixedControl` | 29393 | function |  | 28 |
| `syncMultiStrandInputs` | 29410 | function |  | 16 |
| `values` | 29426 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29506 | function |  | 5 |
| `createCompoundStrand` | 29513 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29574 | function |  | 9 |
| `openRebuildCurveDialog` | 29587 | function |  | 1 |
| `rebuildSelectedCurves` | 29601 | function |  | 2 |
| `selectionCanBecomeClump` | 29640 | function |  | 4 |
| `createClumpFromSelection` | 29645 | function |  | 3 |
| `cleanSelectionSets` | 29657 | function |  | 2 |
| `createSelectionSetFromSelection` | 29662 | function |  | 3 |
| `selectionSetById` | 29673 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29677 | function |  | 7 |
| `editSelectionSetFromSelection` | 29686 | function |  | 5 |
| `deleteSelectionSet` | 29706 | function |  | 2 |
| `selectSelectionSet` | 29715 | function |  | 2 |
| `deleteSelectedStrands` | 29725 | function |  | 4 |
| `deleteGuide` | 29733 | function |  | 3 |
| `deleteSelectedGuide` | 29756 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29760 | function |  | 4 |
| `hasDeletableSelection` | 29773 | function |  | 2 |
| `deleteCurrentSelection` | 29781 | function |  | 3 |
| `hideOutlinerContextMenu` | 29789 | function |  | 17 |
| `outlinerLockTargets` | 29794 | function |  | 3 |
| `showOutlinerContextMenu` | 29821 | function |  | 10 |
| `hideStrandRadialMenu` | 29901 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29912 | function |  | 3 |
| `radialButtonDimensions` | 29925 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29934 | function |  | 3 |
| `applyRadialMenuDimensions` | 29951 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29957 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29970 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29991 | function |  | 2 |
| `selectionSetRadialMenuOption` | 30008 | function |  | 4 |
| `selectedMirrorRadialOptions` | 30017 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30039 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30057 | function |  | 2 |
| `contextualRadialOptions` | 30064 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30193 | function |  | 3 |
| `layoutContextualRadialOptions` | 30197 | function |  | 4 |
| `renderRadialActionList` | 30221 | function |  | 3 |
| `radialListOptionAtPointer` | 30239 | function |  | 3 |
| `syncRadialListHighlight` | 30261 | function |  | 3 |
| `configureContextualRadialMenu` | 30267 | function |  | 3 |
| `beginStrandRadialGesture` | 30327 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30361 | function |  | 2 |
| `updateStrandRadialGesture` | 30407 | function |  | 1 |
| `performStrandRadialAction` | 30446 | function |  | 2 |
| `finishStrandRadialGesture` | 30549 | function |  | 2 |
| `cancelStrandRadialGesture` | 30559 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30566 | function |  | 1 |
| `setPullMoveEnabled` | 30572 | function |  | 3 |
| `toolRadialOptions` | 30580 | function |  | 2 |
| `hideToolRadialMenu` | 30605 | function |  | 4 |
| `beginToolRadialGesture` | 30618 | function |  | 2 |
| `beginToolShortcutPress` | 30658 | function |  | 2 |
| `finishToolShortcutPress` | 30673 | function |  | 2 |
| `cancelToolShortcutPress` | 30682 | function |  | 5 |
| `setRadialMenusEnabled` | 30690 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30703 | function |  | 5 |
| `setNavigationTipsEnabled` | 30718 | function |  | 5 |
| `configureNavigationMouseButtons` | 30725 | function |  | 3 |
| `syncNavigationModifierLocks` | 30738 | function |  | 7 |
| `setNavigationStyle` | 30743 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30759 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30774 | function |  | 5 |
| `setCameraSmoothingStrength` | 30780 | function |  | 5 |
| `setScaleSensitivity` | 30788 | function |  | 3 |
| `setToolTipsEnabled` | 30796 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30803 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30812 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30820 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30835 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30844 | function |  | 5 |
| `sideNamingDisplayId` | 30853 | function |  | 3 |
| `referenceViewDisplayLabel` | 30865 | function |  | 6 |
| `strandRegionDisplayLabel` | 30875 | function |  | 10 |
| `updateSideNamingLabels` | 30893 | function |  | 2 |
| `setSideNamingPerspective` | 30920 | function |  | 5 |
| `setControlPointDisplaySize` | 30929 | function |  | 6 |
| `scaleHexColor` | 30941 | function |  | 3 |
| `setViewportBackgroundColor` | 30946 | function |  | 7 |
| `setDefaultHairShader` | 30968 | function |  | 5 |
| `setPreferenceCategory` | 30974 | function |  | 4 |
| `openPreferencesDialog` | 31001 | function |  | 1 |
| `savePreferencesDialog` | 31029 | function |  | 1 |
| `cancelPreferencesDialog` | 31053 | function |  | 3 |
| `updateToolRadialGesture` | 31082 | function |  | 1 |
| `performToolRadialAction` | 31111 | function |  | 2 |
| `finishToolRadialGesture` | 31121 | function |  | 2 |
| `cancelToolRadialGesture` | 31130 | function |  | 5 |
| `duplicatePlacementTarget` | 31137 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31164 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31168 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31178 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31183 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31195 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31206 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31214 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31231 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31252 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31263 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31269 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31275 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31308 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31463 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31565 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31606 | function |  | 2 |
| `updateDuplicatePlacement` | 31633 | function |  | 2 |
| `beginDuplicatePlacement` | 31697 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31761 | function |  | 2 |
| `confirmDuplicatePlacement` | 31802 | function |  | 1 |
| `cancelDuplicatePlacement` | 31839 | function |  | 4 |
| `outlinerClumpLocks` | 31865 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31869 | function |  | 3 |
| `createOutlinerStrandButton` | 31892 | function |  | 4 |
| `createOutlinerCurveSurface` | 31978 | function |  | 2 |
| `createOutlinerClump` | 32074 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32156 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32163 | function |  | 2 |
| `renderLockList` | 32242 | function |  | 70 |
| `updateCount` | 32396 | function |  | 34 |
| `captureInputUndo` | 32405 | function |  | 1 |
| `bindUndoCapture` | 32411 | function |  | 36 |
| `bindLockInput` | 32422 | function |  | 2 |
| `applyValue` | 32439 | arrow |  | 2 |
| `applyUniformTransformScale` | 32758 | function |  | 2 |
| `applyReducedTransformScale` | 32775 | function |  | 2 |
| `applyTransformPrecision` | 32814 | function |  | 2 |
| `updateTransformScalePointer` | 32843 | function |  | 1 |
| `finishSweepProfileDrag` | 33074 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33170 | function |  | 3 |
| `finishTaperCurveDrag` | 33232 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33275 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33356 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33411 | function |  | 6 |
| `updateSelectedTaperPoint` | 33435 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 34009 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 34014 | function |  | 4 |
| `syncDrawCurlControls` | 34069 | function |  | 5 |
| `handleLiveSurfaceChange` | 34117 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34199 | function |  | 3 |
| `resampleSurfaceLock` | 34214 | function |  | 2 |
| `changePanelSplitCount` | 34327 | function |  | 3 |
| `presetNumber` | 34431 | function |  | 23 |
| `clonePresetShape` | 34436 | function |  | 7 |
| `creationPresetSnapshot` | 34445 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34493 | function |  | 5 |
| `applyPresetControl` | 34520 | function |  | 2 |
| `applyCreationToolSettings` | 34541 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34582 | function |  | 3 |
| `loadCustomCreationPresets` | 34589 | function |  | 2 |
| `saveCustomCreationPresets` | 34599 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34607 | function |  | 2 |
| `populateCreationPresetSelect` | 34643 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34667 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34700 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34705 | function |  | 2 |
| `applyCustomCreationPreset` | 34722 | function |  | 3 |
| `createCustomCreationPreset` | 34746 | function |  | 3 |
| `createCustomClumpPreset` | 34761 | function |  | 3 |
| `commitCustomCreationPreset` | 34776 | function |  | 2 |
| `openRemoveCreationPreset` | 34837 | function |  | 3 |
| `commitRemoveCreationPreset` | 34850 | function |  | 1 |
| `applyBraidToolPreset` | 34867 | function |  | 2 |
| `selectedBranchChildLock` | 34979 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34983 | function |  | 2 |
| `initPanelResizeHandles` | 35089 | function |  | 2 |
| `applyWidth` | 35095 | arrow |  | 2 |
| `restoreWidth` | 35102 | arrow |  | 2 |
| `bindResize` | 35110 | arrow |  | 2 |
| `onMove` | 35118 | arrow |  | 0 |
| `onUp` | 35122 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35139 | function |  | 2 |
| `initFloatingPanelControls` | 35148 | function |  | 2 |
| `detach` | 35157 | arrow |  | 43 |
| `endDrag` | 35195 | arrow |  | 0 |
| `endResize` | 35227 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35238 | function |  | 3 |
| `selectPatchNotesVersion` | 35372 | function |  | 3 |
| `requestReferenceImage` | 35405 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35609 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35615 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35622 | function |  | 1 |
| `deleteLocks` | 36189 | function |  | 10 |
| `disposeCurveObjects` | 36267 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36319 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36350 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36425 | function |  | 2 |
| `resize` | 36458 | function |  | 4 |
| `handleViewportPointerMove` | 36469 | function |  | 1 |
| `blockProportionalSizingEvent` | 36480 | function |  | 1 |
| `updateLightAngleFromInputs` | 36486 | function |  | 2 |
| `startViewSnap` | 36500 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36530 | function |  | 3 |
| `trackViewportPointerDown` | 36547 | function |  | 1 |
| `trackViewportPointerMove` | 36563 | function |  | 1 |
| `clearViewportPointer` | 36571 | function |  | 1 |
| `updateViewSnap` | 36576 | function |  | 1 |
| `nearestCardinalAxis` | 36612 | function |  | 5 |
| `cardinalAxisKey` | 36626 | function |  | 5 |
| `steppedDragAmount` | 36630 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36636 | function |  | 4 |
| `endViewSnap` | 36652 | function |  | 4 |
| `activateStrandControlPoint` | 36662 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36712 | function |  | 4 |
| `addStrandControlPointSelection` | 36739 | function |  | 3 |
| `removeStrandControlPointSelection` | 36756 | function |  | 3 |
| `sampleStrandPointNormal` | 36770 | function |  | 2 |
| `sampleStrandPointVectors` | 36780 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36786 | function |  | 2 |
| `resampleStrandCurveData` | 36797 | function |  | 4 |
| `resampleMatchingVectors` | 36803 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36842 | function |  | 4 |
| `removeStrandCurvePoint` | 36853 | function |  | 2 |
| `closestStrandCurveParameter` | 36866 | function |  | 2 |
| `insertStrandCurvePoint` | 36895 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36912 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36922 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36938 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36945 | function |  | 4 |
| `prepareCurvePointSelection` | 36967 | function |  | 1 |
| `finishCurvePointInsertion` | 37078 | function |  | 1 |
| `finishPointRemoval` | 37093 | function |  | 1 |
| `editableStrandWidth` | 37111 | function |  | 6 |
| `editableStrandWidthBounds` | 37123 | function |  | 2 |
| `applyEditableStrandWidth` | 37129 | function |  | 3 |
| `viewportPixelPoint` | 37165 | function |  | 3 |
| `syncSculptBrushControls` | 37173 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37188 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37196 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37204 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37210 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37214 | function |  | 7 |
| `updateSculptBrushCursor` | 37221 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37243 | function |  | 4 |
| `sculptBrushEditableLock` | 37250 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37260 | function |  | 5 |
| `sculptBrushLockViable` | 37266 | function |  | 5 |
| `sculptBrushUnits` | 37277 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37316 | function |  | 4 |
| `sculptBrushPointWeight` | 37366 | function |  | 5 |
| `sculptBrushWorldDelta` | 37376 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37385 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37411 | function |  | 2 |
| `beginSculptMoveStroke` | 37469 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37531 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37766 | function |  | 3 |
| `updateSculptMoveStroke` | 37775 | function |  | 1 |
| `finishSculptMoveStroke` | 37791 | function |  | 3 |
| `strandControlPointHit` | 37839 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37843 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37921 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37955 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37995 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 38008 | function |  | 1 |
| `setHoveredControlPoint` | 38048 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38061 | function |  | 2 |
| `updateControlPointHover` | 38097 | function |  | 1 |
| `animate` | 38654 | function |  | 2 |
| `syncCompactSidebarLayout` | 38687 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38706 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38712 | function |  | 3 |
| `setAttributeEditorTab` | 38718 | function |  | 6 |

## modules/branch/branch-store.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchStore` | 15 | function | export | 1 |

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
