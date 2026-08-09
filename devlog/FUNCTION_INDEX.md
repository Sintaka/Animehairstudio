# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1730** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38613 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 257 | function |  | 3 |
| `saveBooleanPreference` | 285 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 289 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 294 | function |  | 2 |
| `normalizeScaleSensitivity` | 299 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 304 | function |  | 2 |
| `normalizeSideNamingPerspective` | 309 | function |  | 2 |
| `normalizeNavigationStyle` | 313 | function |  | 2 |
| `setupEditableSliderControls` | 328 | function |  | 2 |
| `syncNumberFromRange` | 379 | arrow |  | 0 |
| `applyNumberValue` | 386 | arrow |  | 0 |
| `copyCameraPose` | 492 | function |  | 3 |
| `updateCameraProjectionForViewport` | 498 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 511 | function |  | 3 |
| `setOrthographicView` | 517 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 557 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 586 | function |  | 2 |
| `removeRotateFreeAxisRing` | 612 | function |  | 2 |
| `deflateTransformGizmoPickers` | 624 | function |  | 2 |
| `nextStrandName` | 1003 | function |  | 2 |
| `activeDrawClumpTemplate` | 1088 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1093 | function |  | 3 |
| `drawModeCreatesClump` | 1120 | function |  | 1 |
| `isPanelGeometry` | 1264 | function |  | 31 |
| `normalizePanelSplits` | 1268 | function |  | 3 |
| `clonePanelSplits` | 1280 | function |  | 19 |
| `snapPanelSplitHeight` | 1284 | function |  | 5 |
| `createQuadSphereGeometry` | 1319 | function |  | 2 |
| `vertexIndex` | 1333 | function |  | 11 |
| `addEdge` | 1351 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1386 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1456 | function |  | 3 |
| `updateScalpRenderGeometry` | 1482 | function |  | 4 |
| `writeScalpRegionColors` | 1533 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1546 | function |  | 2 |
| `createScalpSelectionOutline` | 1576 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1618 | function |  | 25 |
| `activeScalpSurfaceWire` | 1623 | function |  | 2 |
| `activeScalpSelectionOutline` | 1628 | function |  | 2 |
| `inferredCustomScalpRegion` | 1633 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1640 | function |  | 5 |
| `customScalpGeometryFromObject` | 1659 | function |  | 2 |
| `customScalpWireGeometry` | 1691 | function |  | 3 |
| `installCustomScalpGeometry` | 1702 | function |  | 3 |
| `installCustomScalpGuide` | 1726 | function |  | 3 |
| `setScalpGuideSource` | 1744 | function |  | 7 |
| `updateScalpQuadWire` | 1760 | function |  | 4 |
| `updateScalpTopology` | 1776 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1840 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2020 | function |  | 2 |
| `currentStrandSelectionState` | 2083 | function |  | 4 |
| `applyStrandSelectionState` | 2087 | function |  | 5 |
| `clearStrandSelectionState` | 2092 | function |  | 7 |
| `guideHeadBounds` | 3080 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3090 | function |  | 5 |
| `disposeGuideModel` | 3104 | function |  | 3 |
| `syncHeadTransformInputs` | 3115 | function |  | 4 |
| `applyHeadTransform` | 3122 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3140 | function |  | 4 |
| `applyScalpRoughScale` | 3149 | function |  | 5 |
| `resetHeadTransform` | 3163 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3177 | function |  | 2 |
| `installGuideModel` | 3193 | function |  | 5 |
| `loadDefaultGuideModel` | 3269 | function |  | 3 |
| `braidTemplateFromEntries` | 3292 | function |  | 4 |
| `braidMeshEntries` | 3324 | function |  | 2 |
| `prepareBraidBodyCache` | 3336 | function |  | 2 |
| `quantize` | 3345 | arrow |  | 21 |
| `sourceNormalAt` | 3357 | arrow |  | 1 |
| `clusterBoundary` | 3360 | arrow |  | 2 |
| `normalBuckets` | 3377 | arrow |  | 2 |
| `applyBucketPair` | 3409 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3440 | function |  | 2 |
| `annotateBraidObjTopology` | 3461 | function |  | 2 |
| `loadBraidMeshPreset` | 3481 | function |  | 3 |
| `createSplitControlHandle` | 3498 | function |  | 4 |
| `frameGuideModel` | 3513 | function |  | 2 |
| `syncScalpInputs` | 3538 | function |  | 2 |
| `syncScalpArtistInputs` | 3544 | function |  | 2 |
| `rootScalpOffsetDistance` | 3552 | function |  | 15 |
| `applyLockRootScalpOffset` | 3557 | function |  | 5 |
| `normalizeHairLayer` | 3573 | function |  | 28 |
| `layerOffsetForLock` | 3577 | function |  | 9 |
| `layerRootOffsetFactor` | 3582 | function |  | 13 |
| `layerOffsetWeight` | 3586 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3592 | function |  | 5 |
| `pointsWithLayerOffset` | 3601 | function |  | 3 |
| `layerDirectionForLock` | 3609 | function |  | 2 |
| `applyLayerOffset` | 3620 | function |  | 5 |
| `setLockHairLayer` | 3644 | function |  | 2 |
| `setGroupLayerOffset` | 3659 | function |  | 2 |
| `scalpArtistWeight` | 3671 | function |  | 3 |
| `scalpArtistScalesAt` | 3675 | function |  | 3 |
| `applyScalpArtistShape` | 3685 | function |  | 5 |
| `inverseScalpArtistShape` | 3703 | function |  | 2 |
| `updateScalpSurface` | 3730 | function |  | 3 |
| `setActiveScalpRegion` | 3740 | function |  | 2 |
| `clearScalpRegions` | 3752 | function |  | 2 |
| `scalpHitFromEvent` | 3769 | function |  | 3 |
| `updateScalpBrushCursor` | 3777 | function |  | 4 |
| `paintScalpAt` | 3792 | function |  | 3 |
| `beginScalpPaint` | 3859 | function |  | 2 |
| `updateScalpPaint` | 3868 | function |  | 1 |
| `endScalpPaint` | 3877 | function |  | 2 |
| `createScalpLattice` | 3884 | function |  | 2 |
| `resetScalpLattice` | 3909 | function |  | 1 |
| `updateScalpLatticeObjects` | 3921 | function |  | 7 |
| `quadraticWeights` | 3935 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3940 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3967 | function |  | 3 |
| `selectScalpLatticePoint` | 3982 | function |  | 2 |
| `beginScalpLatticeDrag` | 3997 | function |  | 2 |
| `updateScalpLatticeDrag` | 4015 | function |  | 1 |
| `endScalpLatticeDrag` | 4033 | function |  | 2 |
| `setHeadReferenceTransparency` | 4039 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4049 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4067 | function |  | 3 |
| `trianglePlaneIntersections` | 4075 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4096 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4122 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4132 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4144 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4168 | function |  | 3 |
| `createScalpBuilderPlanes` | 4183 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4215 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4253 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4276 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4288 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4300 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4305 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4317 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4427 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4452 | function |  | 5 |
| `syncEditedScalpSurface` | 4467 | function |  | 4 |
| `ensureEditedScalpSurface` | 4538 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4568 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4653 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4666 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4682 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4692 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4710 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4723 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4730 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4749 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4763 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4804 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4813 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4826 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4847 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4984 | function |  | 2 |
| `scalpTemplateNeighbors` | 4992 | function |  | 2 |
| `smoothScalpVectorField` | 5004 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5018 | function |  | 2 |
| `upperContourCurve` | 5035 | function |  | 4 |
| `hermitePoint` | 5070 | function |  | 2 |
| `curveNetworkSection` | 5081 | function |  | 3 |
| `pointAlongSection` | 5110 | function |  | 3 |
| `longestStitchedContour` | 5116 | function |  | 2 |
| `nodeForPoint` | 5124 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5181 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5191 | function |  | 1 |
| `orderedRange` | 5203 | arrow |  | 3 |
| `clipSegment` | 5226 | arrow |  | 1 |
| `liftedPoint` | 5249 | arrow |  | 5 |
| `boundaryCorner` | 5254 | arrow |  | 4 |
| `surfaceCurveBetween` | 5263 | arrow |  | 1 |
| `addSurfaceConnector` | 5286 | arrow |  | 2 |
| `sideContourAtDepth` | 5354 | arrow |  | 3 |
| `addSurfacePatch` | 5388 | arrow |  | 1 |
| `addCenterBridgePatch` | 5468 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5576 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5611 | function |  | 1 |
| `generatedScalpObjContent` | 5701 | function |  | 2 |
| `generateScalpFromBuilder` | 5715 | function |  | 1 |
| `orderedDepthRange` | 5751 | arrow |  | 7 |
| `resetScalpBuilder` | 5880 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5895 | function |  | 1 |
| `beginScalpBuilderInput` | 5909 | function |  | 2 |
| `updateScalpBuilderStroke` | 5910 | function |  | 1 |
| `finishScalpBuilderStroke` | 5911 | function |  | 2 |
| `setScalpBuilderEditing` | 5913 | function |  | 10 |
| `updateScalpEditingVisibility` | 5947 | function |  | 12 |
| `exitSetupEditors` | 6041 | function |  | 7 |
| `setCapsuleGuideEditing` | 6050 | function |  | 5 |
| `syncAppMenuVisibility` | 6078 | function |  | 3 |
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
| `componentEditModeActive` | 6675 | function |  | 38 |
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
| `vertex` | 9303 | function |  | 4 |
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
| `branchMoveGizmoDisabled` | 11167 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11176 | function |  | 2 |
| `configureTransformControls` | 11207 | function |  | 16 |
| `pullMoveActive` | 11215 | function |  | 9 |
| `updatePullGuideVisual` | 11219 | function |  | 4 |
| `attachTransformForCurvePoint` | 11235 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11259 | function |  | 7 |
| `strandObjectRootIndex` | 11275 | function |  | 3 |
| `strandObjectRoot` | 11284 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11288 | function |  | 2 |
| `attachStrandObjectTransform` | 11293 | function |  | 6 |
| `guideObjectPivot` | 11316 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11327 | function |  | 2 |
| `attachGuideObjectTransform` | 11332 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11351 | function |  | 2 |
| `beginGuideObjectTransform` | 11379 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11386 | function |  | 2 |
| `updateGuideObjectTransform` | 11408 | function |  | 2 |
| `finishGuideObjectTransform` | 11441 | function |  | 2 |
| `clonePlacementFrame` | 11450 | function |  | 2 |
| `cloneOptionalVectors` | 11462 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11466 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11483 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11498 | function |  | 2 |
| `strandObjectTransformOperators` | 11514 | function |  | 4 |
| `transformPoint` | 11522 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11529 | arrow |  | 0 |
| `transformNormal` | 11535 | arrow |  | 10 |
| `transformDirection` | 11545 | arrow |  | 7 |
| `worldMatrixForPivot` | 11557 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11563 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11579 | function |  | 6 |
| `beginStrandObjectTransform` | 11593 | function |  | 2 |
| `updateStrandObjectTransform` | 11631 | function |  | 2 |
| `commitStrandObjectTransform` | 11680 | function |  | 2 |
| `mapPoints` | 11693 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11727 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11741 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11764 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11777 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11792 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11818 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11867 | function |  | 2 |
| `beginHandleEdit` | 11876 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11925 | function |  | 3 |
| `applyBranchRigidRootMove` | 11942 | function |  | 3 |
| `syncBranchRootHandleFrame` | 11979 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 11990 | function |  | 3 |
| `multiPointHandleEditActive` | 12001 | function |  | 7 |
| `applyMultiMove` | 12005 | function |  | 5 |
| `applyMultiRotate` | 12011 | function |  | 2 |
| `applyMultiScale` | 12020 | function |  | 2 |
| `applyHierarchicalMove` | 12029 | function |  | 3 |
| `applySingleMove` | 12041 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12045 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12062 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12071 | function |  | 3 |
| `changed` | 12081 | arrow |  | 1 |
| `applyPullMove` | 12123 | function |  | 3 |
| `pullHeadCollisionContext` | 12131 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12150 | function |  | 2 |
| `applyProportionalMove` | 12173 | function |  | 3 |
| `viewPlaneNormal` | 12184 | function |  | 20 |
| `isCameraInSnappedView` | 12188 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12196 | function |  | 10 |
| `updateViewPlaneGrid` | 12200 | function |  | 14 |
| `setViewPlaneMove` | 12257 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12268 | function |  | 2 |
| `rayFromViewportEvent` | 12276 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12284 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12294 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12305 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12318 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12337 | function |  | 4 |
| `beginViewPlaneMove` | 12344 | function |  | 3 |
| `updateViewPlaneMove` | 12408 | function |  | 1 |
| `endViewPlaneMove` | 12473 | function |  | 7 |
| `applyHierarchicalRotate` | 12492 | function |  | 2 |
| `rotateGuideNormal` | 12499 | arrow |  | 4 |
| `applySingleRotate` | 12537 | function |  | 2 |
| `applyProportionalRotate` | 12541 | function |  | 2 |
| `applyHierarchicalScale` | 12561 | function |  | 2 |
| `applySingleScale` | 12571 | function |  | 2 |
| `applyProportionalScale` | 12575 | function |  | 2 |
| `setPointScale` | 12591 | function |  | 8 |
| `proportionalWeight` | 12600 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12612 | function |  | 5 |
| `strandInfluenceColor` | 12618 | function |  | 17 |
| `beginRelaxEdit` | 12643 | function |  | 3 |
| `updateRelaxEdit` | 12672 | function |  | 1 |
| `endRelaxEdit` | 12732 | function |  | 1 |
| `disposeGuide` | 12742 | function |  | 3 |
| `removeGuideObjects` | 12770 | function |  | 3 |
| `strandRadiusAt` | 12784 | function |  | 5 |
| `strandProfileTopologyAt` | 12801 | function |  | 8 |
| `strandCurveParameters` | 12843 | function |  | 5 |
| `widthProfileAt` | 12853 | arrow |  | 1 |
| `braidFrameAt` | 12891 | function |  | 5 |
| `braidFrameAtExtended` | 12901 | function |  | 2 |
| `createBraidProfileProjector` | 12910 | function |  | 2 |
| `project` | 12926 | arrow |  | 17 |
| `createBraidGeometry` | 12941 | function |  | 2 |
| `deformationAt` | 12976 | function |  | 3 |
| `widthFor` | 12985 | arrow |  | 3 |
| `depthFor` | 12989 | arrow |  | 3 |
| `outputVertex` | 13021 | function |  | 7 |
| `appendAuthoredCap` | 13129 | function |  | 3 |
| `outputCapVertex` | 13136 | arrow |  | 6 |
| `capBoundary` | 13227 | function |  | 3 |
| `strandGeometryCurve` | 13289 | function |  | 15 |
| `strandGeometryFrameAt` | 13315 | function |  | 19 |
| `transportedStrandFrameAt` | 13378 | function |  | 7 |
| `twistOverrideAt` | 13381 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13409 | function |  | 2 |
| `weldPanelGeometryData` | 13445 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13485 | function |  | 3 |
| `surfacePanelPoint` | 13500 | function |  | 3 |
| `createPanelStrandGeometry` | 13523 | function |  | 2 |
| `addQuad` | 13557 | arrow |  | 6 |
| `near` | 13561 | arrow |  | 6 |
| `panelWidthAt` | 13591 | arrow |  | 6 |
| `panelThicknessAt` | 13600 | arrow |  | 6 |
| `panelFrameAt` | 13609 | arrow |  | 1 |
| `rawPanelPoint` | 13627 | arrow |  | 1 |
| `panelPoint` | 13647 | arrow |  | 2 |
| `addPatch` | 13653 | arrow |  | 1 |
| `splitOpening` | 13704 | arrow |  | 2 |
| `uStart` | 13728 | arrow |  | 1 |
| `uEnd` | 13731 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13769 | function |  | 3 |
| `inside` | 13770 | arrow |  | 2 |
| `pushOrientedTriangle` | 13792 | function |  | 7 |
| `triangulatePolygon3D` | 13803 | function |  | 1 |
| `orientedQuadFace` | 13843 | function |  | 2 |
| `createSplitStrandGeometry` | 13851 | function |  | 2 |
| `fusedIndexAt` | 14008 | arrow |  | 0 |
| `createHairCardGeometry` | 14057 | function |  | 2 |
| `createPolyGeometry` | 14156 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14183 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14192 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14239 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14247 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14263 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14272 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14283 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14291 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14301 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14321 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14344 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14423 | function |  | 2 |
| `pushBoundary` | 14452 | arrow |  | 5 |
| `boundaryAt` | 14470 | arrow |  | 3 |
| `hermite` | 14492 | arrow |  | 2 |
| `emitBottomMidRow` | 14537 | arrow |  | 2 |
| `emitTopMidRow` | 14636 | arrow |  | 2 |
| `sideHoleVertex` | 14678 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14727 | arrow |  | 2 |
| `emitFillStrip` | 14798 | arrow |  | 2 |
| `fillSide` | 14809 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14853 | arrow |  | 2 |
| `edgeDirection` | 14877 | arrow |  | 1 |
| `positionAt` | 14936 | arrow |  | 1 |
| `createBranchChildGeometry` | 14987 | function |  | 2 |
| `createCompoundStrandGeometry` | 15197 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15448 | function |  | 2 |
| `createHairGeometry` | 15479 | function |  | 6 |
| `createBaseHairGeometry` | 15531 | function |  | 3 |
| `hairMaterialDefinition` | 15649 | function |  | 4 |
| `materialForLock` | 15653 | function |  | 8 |
| `activeHairMaterialDefinition` | 15657 | function |  | 11 |
| `strandDisplayColor` | 15663 | function |  | 14 |
| `setAnimeHairBaseColor` | 15681 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15694 | function |  | 2 |
| `createHairMaterial` | 15734 | function |  | 5 |
| `createStrandSelectionOutline` | 15776 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15810 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15819 | function |  | 6 |
| `refreshMaterialUsers` | 15846 | function |  | 6 |
| `renderHairMaterialOutliner` | 15855 | function |  | 5 |
| `renderHairMaterialOptions` | 15885 | function |  | 3 |
| `syncHairMaterialEditor` | 15895 | function |  | 9 |
| `createProjectHairMaterial` | 15921 | function |  | 3 |
| `deleteActiveHairMaterial` | 15941 | function |  | 2 |
| `createHairTopologyGeometry` | 15959 | function |  | 4 |
| `createHairTopologyOverlay` | 15980 | function |  | 3 |
| `groupDefaultsFor` | 16027 | function |  | 9 |
| `creationToolActive` | 16034 | function |  | 8 |
| `activeCreationShapeDefaults` | 16038 | function |  | 11 |
| `activeStrandShapeTarget` | 16044 | function |  | 5 |
| `curvePolylineLength` | 16048 | function |  | 2 |
| `curvePolylineLengths` | 16056 | function |  | 3 |
| `samplePolylineDistance` | 16064 | function |  | 2 |
| `applyProjectedCurveLength` | 16074 | function |  | 4 |
| `clearRegionLengthBaseline` | 16105 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16112 | function |  | 2 |
| `setGroupLengthScale` | 16120 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16158 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16190 | function |  | 1 |
| `activeSweepProfile` | 16199 | function |  | 9 |
| `activeSweepProfileTarget` | 16206 | function |  | 6 |
| `trimmedSweepProfile` | 16213 | function |  | 7 |
| `roundedLeft` | 16222 | arrow |  | 1 |
| `roundedRight` | 16228 | arrow |  | 1 |
| `activeProfileOffset` | 16245 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16252 | function |  | 3 |
| `profileToCanvas` | 16269 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16273 | function |  | 11 |
| `sampleSweepProfile` | 16282 | function |  | 7 |
| `createSweepProfileTopology` | 16303 | function |  | 5 |
| `renderProfilePreview` | 16345 | function |  | 8 |
| `renderHairCardCoveragePath` | 16364 | function |  | 3 |
| `activeTaperTarget` | 16379 | function |  | 15 |
| `twistCurveEditing` | 16386 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16390 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16394 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16398 | function |  | 17 |
| `taperAsymmetryKey` | 16402 | function |  | 12 |
| `taperSecondaryKey` | 16406 | function |  | 11 |
| `activeTaperCurve` | 16410 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16421 | function |  | 6 |
| `taperSamples` | 16431 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16438 | function |  | 2 |
| `renderTaperPreview` | 16460 | function |  | 13 |
| `renderTwistCurvePreview` | 16496 | function |  | 5 |
| `cloneShapePresetValue` | 16514 | function |  | 66 |
| `shapeValuesMatch` | 16518 | function |  | 5 |
| `shapeTargetForSelect` | 16526 | function |  | 4 |
| `loadCustomShapePresets` | 16533 | function |  | 2 |
| `saveCustomShapePresets` | 16544 | function |  | 4 |
| `shapePresetLabel` | 16552 | function |  | 4 |
| `setupShapePresetControls` | 16557 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16582 | function |  | 3 |
| `syncShapePresetSelects` | 16588 | function |  | 8 |
| `populateShapePresetSelects` | 16609 | function |  | 5 |
| `applyShapePreset` | 16636 | function |  | 2 |
| `openSaveShapePreset` | 16673 | function |  | 2 |
| `commitCustomShapePreset` | 16698 | function |  | 2 |
| `openRemoveShapePreset` | 16721 | function |  | 2 |
| `commitRemoveShapePreset` | 16734 | function |  | 2 |
| `taperPointToCanvas` | 16750 | function |  | 4 |
| `canvasToTaperPoint` | 16767 | function |  | 2 |
| `clearTaperMeshPoints` | 16803 | function |  | 2 |
| `taperMeshPointFrame` | 16813 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16823 | function |  | 4 |
| `twistMeshGraphAxis` | 16831 | function |  | 4 |
| `addTwistMeshCurvePath` | 16835 | function |  | 2 |
| `appendSegment` | 16856 | arrow |  | 1 |
| `appendFill` | 16859 | arrow |  | 1 |
| `appendSignedSection` | 16865 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16914 | function |  | 6 |
| `updateTaperMeshPoints` | 16951 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17030 | function |  | 5 |
| `renderTaperCurveEditor` | 17048 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17120 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17134 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17150 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17182 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17191 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17202 | function |  | 2 |
| `applyTaperCurveEdit` | 17210 | function |  | 10 |
| `openTaperCurveEditor` | 17318 | function |  | 3 |
| `closeTaperCurveEditor` | 17363 | function |  | 6 |
| `updateViewportStatsVisibility` | 17376 | function |  | 6 |
| `canvasToProfile` | 17395 | function |  | 2 |
| `renderSweepProfileEditor` | 17405 | function |  | 7 |
| `applySweepProfileEdit` | 17448 | function |  | 8 |
| `openSweepProfileEditor` | 17475 | function |  | 1 |
| `closeSweepProfileEditor` | 17510 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17519 | function |  | 2 |
| `addLock` | 17534 | function |  | 19 |
| `mirroredScalpRegion` | 17737 | function |  | 5 |
| `mirroredVector` | 17746 | function |  | 12 |
| `mirroredPlacementFrame` | 17750 | function |  | 2 |
| `mirrorPartnerFor` | 17763 | function |  | 40 |
| `decoupleMirrorPartner` | 17767 | function |  | 2 |
| `createMirrorPartner` | 17775 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17871 | function |  | 6 |
| `mirroredClumpPartners` | 17876 | function |  | 6 |
| `createMirroredClump` | 17882 | function |  | 3 |
| `decoupleMirroredClump` | 17904 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17913 | function |  | 6 |
| `syncActiveMirror` | 18078 | function |  | 25 |
| `setMirrorXEditing` | 18090 | function |  | 6 |
| `snapshotState` | 18114 | function |  | 7 |
| `scalpTriangleRegion` | 18371 | function |  | 4 |
| `closestPointOnActiveScalp` | 18384 | function |  | 12 |
| `rootAttachmentFrame` | 18456 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18468 | function |  | 4 |
| `resolveRootAttachment` | 18486 | function |  | 4 |
| `curvePointsToRootLocal` | 18526 | function |  | 2 |
| `curvePointsFromRootLocal` | 18538 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18546 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18562 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18592 | function |  | 2 |
| `createRootAttachment` | 18604 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18634 | function |  | 4 |
| `rootAttachmentToData` | 18661 | function |  | 2 |
| `rootAttachmentFromData` | 18689 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18728 | function |  | 2 |
| `remapPoint` | 18743 | arrow |  | 1 |
| `remapVector` | 18744 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18773 | function |  | 2 |
| `importHeadMeshFile` | 18790 | function |  | 3 |
| `importFullBodyMeshFile` | 18813 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18838 | function |  | 1 |
| `importedBooleanPreference` | 18871 | function |  | 11 |
| `loadPreferencesAndPresets` | 18875 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18945 | function |  | 1 |
| `openHairProjectFile` | 18988 | function |  | 4 |
| `dragContainsApplicationFile` | 19046 | function |  | 3 |
| `safelyRememberRecentProject` | 19055 | function |  | 2 |
| `renderRecentProjectsMenu` | 19064 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19096 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19121 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19125 | function |  | 2 |
| `pushUndoState` | 19141 | function |  | 119 |
| `undoLastAction` | 19148 | function |  | 2 |
| `redoLastAction` | 19162 | function |  | 2 |
| `updateHistoryButtons` | 19176 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19181 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19198 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19205 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19243 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19320 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19346 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19378 | function |  | 2 |
| `finalizeStateRestore` | 19419 | function |  | 2 |
| `restoreState` | 19426 | function |  | 5 |
| `disposeAllEditableObjects` | 19450 | function |  | 2 |
| `restoreLock` | 19471 | function |  | 4 |
| `restoreGuide` | 19688 | function |  | 2 |
| `vectorToData` | 19749 | function |  | 29 |
| `dataToVector` | 19753 | function |  | 31 |
| `frameToData` | 19757 | function |  | 2 |
| `frameFromData` | 19769 | function |  | 2 |
| `applyPresetSelection` | 19781 | function |  | 2 |
| `drawPresetThumbnail` | 19812 | function |  | 1 |
| `fillHair` | 19827 | arrow |  | 9 |
| `strand` | 19839 | arrow |  | 31 |
| `bun` | 19857 | arrow |  | 2 |
| `braid` | 19892 | arrow |  | 2 |
| `renderPresetLibrary` | 19981 | function |  | 3 |
| `setPresetLibraryOpen` | 20040 | function |  | 6 |
| `average` | 20053 | function |  | 4 |
| `fitPointAttributes` | 20057 | function |  | 9 |
| `rebuildCurveObjects` | 20086 | function |  | 10 |
| `createCurvePoints` | 20098 | function |  | 2 |
| `addGeneratedBangPreset` | 20107 | function |  | 1 |
| `sampleScalpQuad` | 20200 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20224 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20273 | function |  | 1 |
| `columns` | 20274 | arrow |  | 1 |
| `layer` | 20278 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20492 | function |  | 2 |
| `addBraidedBobPreset` | 20528 | function |  | 1 |
| `evenColumns` | 20529 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20745 | function |  | 1 |
| `scalpSeed` | 20768 | arrow |  | 1 |
| `createBowlCutPoints` | 21055 | function |  | 2 |
| `addBowlCutPreset` | 21093 | function |  | 1 |
| `scalpRegionAtHit` | 21159 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21171 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21178 | function |  | 12 |
| `braidStrokeActive` | 21185 | function |  | 9 |
| `proceduralDrawActive` | 21189 | function |  | 3 |
| `panelStrokeActive` | 21193 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21197 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21201 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21205 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21211 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21215 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21219 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21223 | function |  | 3 |
| `liveSurfaceStrandId` | 21233 | function |  | 4 |
| `liveSurfaceStrand` | 21237 | function |  | 4 |
| `liveSurfaceGuideId` | 21242 | function |  | 3 |
| `guideSupportsLiveSurface` | 21246 | function |  | 2 |
| `liveSurfaceGuide` | 21253 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21260 | function |  | 12 |
| `activeStrokeScalpOffset` | 21300 | function |  | 4 |
| `activeStrokeBrushSize` | 21306 | function |  | 10 |
| `activeStrokeBrushDepth` | 21312 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21318 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21326 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21336 | function |  | 13 |
| `worldNormalAtHit` | 21375 | function |  | 6 |
| `selectedPolyMesh` | 21383 | function |  | 10 |
| `addPolyLock` | 21388 | function |  | 2 |
| `ensurePolyMesh` | 21407 | function |  | 3 |
| `polySurfaceSample` | 21411 | function |  | 4 |
| `polyTargetAtEvent` | 21422 | function |  | 6 |
| `refreshPolyMesh` | 21448 | function |  | 10 |
| `ensurePolyFillPreview` | 21457 | function |  | 2 |
| `clearPolyFillPreview` | 21494 | function |  | 17 |
| `polyFillCandidateForEvent` | 21499 | function |  | 3 |
| `showPolyFillPreview` | 21519 | function |  | 2 |
| `updatePolyFillPreview` | 21545 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21570 | function |  | 5 |
| `fillPolyGap` | 21580 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21591 | function |  | 2 |
| `projectPolyRelaxPoint` | 21611 | function |  | 2 |
| `removePolyPointAttributes` | 21655 | function |  | 3 |
| `deletePolyComponent` | 21664 | function |  | 2 |
| `addPolyPoint` | 21687 | function |  | 4 |
| `appendPolyStrokeRow` | 21696 | function |  | 4 |
| `beginPolyBrushPointer` | 21716 | function |  | 1 |
| `finishPolyAltDelete` | 21802 | function |  | 1 |
| `updatePolyBrushStroke` | 21816 | function |  | 1 |
| `finishPolyBrushStroke` | 21906 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21943 | function |  | 2 |
| `drawSampleFromHit` | 21966 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21980 | function |  | 3 |
| `strokeLength` | 22017 | function |  | 9 |
| `resampleDrawStroke` | 22023 | function |  | 2 |
| `processedDrawStroke` | 22055 | function |  | 8 |
| `strokeSurfaceNormals` | 22084 | function |  | 7 |
| `drawClumpFrame` | 22095 | function |  | 4 |
| `nearestCurveParameter` | 22104 | function |  | 2 |
| `drawClumpSampleNormal` | 22118 | function |  | 6 |
| `drawClumpTemplateVector` | 22127 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22133 | function |  | 3 |
| `drawClumpStrandMaps` | 22149 | function |  | 4 |
| `nextClumpName` | 22204 | function |  | 6 |
| `initializeClumpShape` | 22211 | function |  | 5 |
| `stableClumpVariation` | 22222 | function |  | 3 |
| `createClumpFromLocks` | 22234 | function |  | 7 |
| `addLockToClump` | 22259 | function |  | 4 |
| `stableBranchBaseNormals` | 22277 | function |  | 4 |
| `ensureBranchParentNormalField` | 22288 | function |  | 2 |
| `branchParentFrame` | 22294 | function |  | 7 |
| `branchLocalVector` | 22306 | function |  | 3 |
| `branchWorldVector` | 22310 | function |  | 4 |
| `captureBranchLocalState` | 22316 | function |  | 6 |
| `enforceBranchRootPosition` | 22344 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22394 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22421 | function |  | 2 |
| `clampRegionParam` | 22468 | function |  | 113 |
| `branchRootRegionFromParam` | 22475 | function |  | 4 |
| `cloneBranchRootRegion` | 22498 | function |  | 5 |
| `flip` | 22500 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22533 | function |  | 8 |
| `setBranchRootRegionPoint` | 22564 | function |  | 3 |
| `branchRegionUVToCanvas` | 22598 | function |  | 10 |
| `branchRegionCanvasToUV` | 22601 | function |  | 4 |
| `openBranchRegionEditor` | 22607 | function |  | 2 |
| `closeBranchRegionEditor` | 22621 | function |  | 2 |
| `retargetBranchRegionEditor` | 22627 | function |  | 2 |
| `renderBranchRegionEditor` | 22632 | function |  | 9 |
| `applyBranchRegionView` | 22718 | function |  | 6 |
| `resetBranchRegionZoom` | 22721 | function |  | 1 |
| `branchRegionNavAction` | 22727 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22741 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22761 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22765 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22791 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22803 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22808 | function |  | 1 |
| `branchRegionEventUV` | 22828 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22836 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 22941 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23074 | function |  | 1 |
| `pointerToNdc` | 23079 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23089 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23103 | function |  | 1 |
| `endBranchSweepStartDrag` | 23126 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23133 | function |  | 5 |
| `gridProfileSkipCol` | 23160 | function |  | 3 |
| `branchRootRegionSurface` | 23169 | function |  | 6 |
| `toGridCol` | 23194 | arrow |  | 5 |
| `toRow` | 23198 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23253 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23273 | function |  | 2 |
| `pointAt` | 23279 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23306 | function |  | 3 |
| `applyBranchRootOffset` | 23378 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23397 | function |  | 3 |
| `branchChildrenFor` | 23417 | function |  | 9 |
| `detachBranch` | 23421 | function |  | 2 |
| `updateBranchChildren` | 23432 | function |  | 4 |
| `clumpDirectMembers` | 23475 | function |  | 3 |
| `clumpMembersForGuide` | 23480 | function |  | 6 |
| `clumpGuideForLock` | 23484 | function |  | 13 |
| `proceduralGuideForLock` | 23489 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23496 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23503 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23510 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23522 | function |  | 2 |
| `applyProceduralBranchSettings` | 23535 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23574 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23590 | function |  | 3 |
| `createProceduralAccessoryLock` | 23604 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23656 | function |  | 2 |
| `clumpFrameAt` | 23707 | function |  | 5 |
| `commitClumpMemberRestState` | 23715 | function |  | 10 |
| `updateClumpMembers` | 23798 | function |  | 10 |
| `dissolveClump` | 23902 | function |  | 6 |
| `detachLockFromClump` | 23939 | function |  | 4 |
| `updateDrawVolumePreview` | 23965 | function |  | 5 |
| `hideDrawClumpPreviews` | 23989 | function |  | 5 |
| `resetDrawVolumePreview` | 23995 | function |  | 3 |
| `updateDrawStrandPreview` | 24001 | function |  | 23 |
| `continueFromTipEnabled` | 24220 | function |  | 2 |
| `selectedTipContinuationLock` | 24226 | function |  | 3 |
| `selectedDrawBranchPoint` | 24239 | function |  | 3 |
| `canBranchDrawFromLock` | 24256 | function |  | 3 |
| `beginDrawStrandStroke` | 24263 | function |  | 2 |
| `beginDrawFreePlane` | 24388 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24402 | function |  | 2 |
| `updateDrawStrandStroke` | 24427 | function |  | 1 |
| `createDrawnLock` | 24473 | function |  | 3 |
| `setting` | 24477 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24545 | function |  | 4 |
| `createDrawnBraid` | 24553 | function |  | 2 |
| `createDrawnStrand` | 24610 | function |  | 2 |
| `createDrawnPanel` | 24737 | function |  | 2 |
| `surfaceLatticeNormal` | 24787 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24802 | function |  | 3 |
| `createViewportSurface` | 24867 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24896 | function |  | 6 |
| `hideLoftSurfacePreviews` | 24902 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 24909 | function |  | 4 |
| `updateLoftSurfacePreview` | 24918 | function |  | 5 |
| `resetLoftSurfaceDraft` | 24950 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 24966 | function |  | 3 |
| `cloneCurveSurfaceSource` | 24984 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25006 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25032 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25042 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25046 | function |  | 2 |
| `curveSurfacePreviewLock` | 25055 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25078 | function |  | 2 |
| `hideCurveSurfacePreview` | 25094 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25106 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25111 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25120 | function |  | 3 |
| `curveSurfaceSideVector` | 25158 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25171 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25179 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25192 | function |  | 5 |
| `updateCurveSurfacePreview` | 25212 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25274 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25296 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25311 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25359 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25394 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25426 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25484 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25561 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25566 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25575 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25609 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25620 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25650 | function |  | 2 |
| `extendDrawnStrand` | 25707 | function |  | 2 |
| `finishDrawStrandStroke` | 25740 | function |  | 7 |
| `createPlacedStrand` | 25767 | function |  | 2 |
| `placedPointCount` | 25831 | function |  | 3 |
| `createPlacedPoints` | 25835 | function |  | 3 |
| `pushPointOutsideHead` | 25854 | function |  | 8 |
| `resizePlacedStrand` | 25886 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 25903 | function |  | 5 |
| `beginPlaceEdit` | 25908 | function |  | 2 |
| `updatePlaceEdit` | 25926 | function |  | 1 |
| `updatePlacementLength` | 25940 | function |  | 3 |
| `updatePlacementOrientation` | 25950 | function |  | 3 |
| `endPlaceEdit` | 25968 | function |  | 1 |
| `confirmPendingPlacedStrand` | 25983 | function |  | 1 |
| `pendingPlacedLock` | 25993 | function |  | 2 |
| `beginPlacementPointer` | 25997 | function |  | 3 |
| `finishPlacementPointer` | 26007 | function |  | 2 |
| `confirmPlacementStep` | 26031 | function |  | 2 |
| `finishPlacementFlow` | 26054 | function |  | 7 |
| `updatePlacementStatus` | 26067 | function |  | 83 |
| `deselectStrands` | 26206 | function |  | 12 |
| `beginSelectionMarquee` | 26221 | function |  | 3 |
| `beginAltOrbit` | 26245 | function |  | 1 |
| `beginBlenderNavigation` | 26257 | function |  | 1 |
| `endBlenderNavigation` | 26302 | function |  | 1 |
| `prepareSelectPointerCapture` | 26310 | function |  | 1 |
| `endSelectPointerCapture` | 26316 | function |  | 1 |
| `endAltOrbit` | 26322 | function |  | 1 |
| `dollyCameraByDrag` | 26329 | function |  | 2 |
| `fastDragMagnitude` | 26352 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26358 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26366 | function |  | 1 |
| `endHoudiniZoomDrag` | 26383 | function |  | 1 |
| `updateSelectionMarquee` | 26391 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26408 | function |  | 3 |
| `selectPointsInMarquee` | 26416 | function |  | 2 |
| `pointKey` | 26442 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26473 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26510 | function |  | 3 |
| `projectedPoint` | 26527 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26556 | function |  | 2 |
| `finishSelectionMarquee` | 26601 | function |  | 2 |
| `headMeshes` | 26624 | function |  | 9 |
| `strandSplitProfileData` | 26632 | function |  | 4 |
| `strandSplitControlPoint` | 26645 | function |  | 4 |
| `panelSplitControlPoint` | 26681 | function |  | 6 |
| `strandControlPointRaycast` | 26737 | function |  | 1 |
| `strandControlPointFrame` | 26772 | function |  | 6 |
| `branchRootGizmoFrame` | 26803 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26821 | function |  | 5 |
| `createCurveObjects` | 26879 | function |  | 4 |
| `polyEdgeKey` | 27052 | function |  | 2 |
| `polyMeshEdges` | 27056 | function |  | 2 |
| `populatePolyEditObjects` | 27070 | function |  | 3 |
| `createPolyEditObjects` | 27131 | function |  | 2 |
| `rebuildPolyEditObjects` | 27139 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27153 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27160 | function |  | 2 |
| `strandWidthEdgeSample` | 27169 | function |  | 3 |
| `strandWidthEdgePoints` | 27192 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27206 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27210 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27217 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27229 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27234 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27240 | function |  | 3 |
| `updateCurveObjects` | 27254 | function |  | 41 |
| `createCurveNormalIndicator` | 27511 | function |  | 2 |
| `pointUpDirection` | 27537 | function |  | 2 |
| `curveFrameAtPoint` | 27541 | function |  | 5 |
| `curveFrameAt` | 27562 | function |  | 10 |
| `strandTwistAt` | 27582 | function |  | 6 |
| `controlPointRotationAt` | 27587 | function |  | 6 |
| `strandProfileTwistAt` | 27591 | function |  | 2 |
| `strandFrameAt` | 27597 | function |  | 1 |
| `curveFrameAtSnapshot` | 27603 | function |  | 3 |
| `outwardNormalAtPoint` | 27622 | function |  | 11 |
| `sampledSurfaceNormal` | 27634 | function |  | 2 |
| `guidedNormalAt` | 27650 | function |  | 5 |
| `twistFromHandle` | 27669 | function |  | 3 |
| `signedAngleAroundAxis` | 27690 | function |  | 5 |
| `handleColor` | 27697 | function |  | 2 |
| `isAffectedCurvePoint` | 27720 | function |  | 2 |
| `syncLockFromCurve` | 27726 | function |  | 26 |
| `labelForPreset` | 27756 | function |  | 1 |
| `rebuildLockGeometry` | 27760 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27787 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27795 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27801 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27823 | function |  | 8 |
| `updateLockGeometry` | 27836 | function |  | 57 |
| `setGroupColorView` | 27857 | function |  | 2 |
| `createUvCheckerTexture` | 27867 | function |  | 3 |
| `ensureUvCheckerForLock` | 27903 | function |  | 4 |
| `removeUvCheckerFromLock` | 27936 | function |  | 3 |
| `invalidateUvInspector` | 27951 | function |  | 7 |
| `uvInspectorRecord` | 27955 | function |  | 1 |
| `uvInspectorRecords` | 27994 | function |  | 2 |
| `drawUvInspectorGrid` | 27998 | function |  | 2 |
| `renderUvInspector` | 28032 | function |  | 3 |
| `setUvCheckerEnabled` | 28091 | function |  | 3 |
| `strandViewportBaseColor` | 28108 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28143 | function |  | 3 |
| `syncStrandSelectionOutline` | 28149 | function |  | 2 |
| `applyLockedStrandPalette` | 28160 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28169 | function |  | 6 |
| `setStrandSelectionVisual` | 28178 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28194 | function |  | 2 |
| `syncProceduralParentVisibility` | 28201 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28210 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28214 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28218 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28231 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28251 | function |  | 3 |
| `selectLock` | 28284 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28337 | function |  | 6 |
| `syncGroupInputs` | 28348 | function |  | 3 |
| `topologyStatsForLock` | 28381 | function |  | 4 |
| `formatTopologyStats` | 28389 | function |  | 5 |
| `updateTopologyStats` | 28393 | function |  | 20 |
| `normalizeBraidDimensions` | 28427 | function |  | 4 |
| `normalizeStrandDimensions` | 28440 | function |  | 3 |
| `strandBaseWidth` | 28454 | function |  | 5 |
| `strandWidthDimension` | 28458 | function |  | 5 |
| `strandDepthDimension` | 28466 | function |  | 8 |
| `setStrandWidthDimension` | 28474 | function |  | 2 |
| `setStrandDepthDimension` | 28496 | function |  | 4 |
| `syncShapeDimensionInputs` | 28512 | function |  | 4 |
| `syncCreationShapeInputs` | 28548 | function |  | 5 |
| `syncViewportDrawSettings` | 28586 | function |  | 5 |
| `syncPanelShapeInputs` | 28600 | function |  | 6 |
| `syncStrandSplitInputs` | 28626 | function |  | 4 |
| `syncHairCardControls` | 28635 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28643 | function |  | 3 |
| `updateAttributeEditorMode` | 28682 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28832 | function |  | 3 |
| `curveLatticeForGroup` | 28855 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28873 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 28918 | function |  | 2 |
| `showCurveLatticeForGroup` | 28935 | function |  | 2 |
| `selectStrandGroup` | 28972 | function |  | 3 |
| `selectCurvePoint` | 29014 | function |  | 10 |
| `updateSelectedPointLabel` | 29028 | function |  | 14 |
| `syncInputs` | 29041 | function |  | 16 |
| `syncClumpGuidePanel` | 29087 | function |  | 3 |
| `getSelectedLock` | 29114 | function |  | 105 |
| `selectedLocksInOrder` | 29118 | function |  | 37 |
| `lockStrands` | 29124 | function |  | 3 |
| `lockSelectedStrands` | 29157 | function |  | 3 |
| `unlockStrands` | 29163 | function |  | 3 |
| `unlockAllStrands` | 29178 | function |  | 3 |
| `strandEditFamily` | 29182 | function |  | 7 |
| `compatibleSelectedLocks` | 29187 | function |  | 6 |
| `selectedEditRoots` | 29194 | function |  | 2 |
| `editSelectedLocks` | 29207 | function |  | 21 |
| `multiEditValuesEqual` | 29240 | function |  | 2 |
| `setMixedControl` | 29249 | function |  | 28 |
| `syncMultiStrandInputs` | 29266 | function |  | 16 |
| `values` | 29282 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29362 | function |  | 5 |
| `createCompoundStrand` | 29369 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29430 | function |  | 9 |
| `openRebuildCurveDialog` | 29443 | function |  | 1 |
| `rebuildSelectedCurves` | 29457 | function |  | 2 |
| `selectionCanBecomeClump` | 29496 | function |  | 4 |
| `createClumpFromSelection` | 29501 | function |  | 3 |
| `cleanSelectionSets` | 29513 | function |  | 2 |
| `createSelectionSetFromSelection` | 29518 | function |  | 3 |
| `selectionSetById` | 29529 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29533 | function |  | 7 |
| `editSelectionSetFromSelection` | 29542 | function |  | 5 |
| `deleteSelectionSet` | 29562 | function |  | 2 |
| `selectSelectionSet` | 29571 | function |  | 2 |
| `deleteSelectedStrands` | 29581 | function |  | 4 |
| `deleteGuide` | 29589 | function |  | 3 |
| `deleteSelectedGuide` | 29612 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29616 | function |  | 4 |
| `hasDeletableSelection` | 29629 | function |  | 2 |
| `deleteCurrentSelection` | 29637 | function |  | 3 |
| `hideOutlinerContextMenu` | 29645 | function |  | 17 |
| `outlinerLockTargets` | 29650 | function |  | 3 |
| `showOutlinerContextMenu` | 29677 | function |  | 10 |
| `hideStrandRadialMenu` | 29757 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29768 | function |  | 3 |
| `radialButtonDimensions` | 29781 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29790 | function |  | 3 |
| `applyRadialMenuDimensions` | 29807 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29813 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29826 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29847 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29864 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29873 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29895 | function |  | 5 |
| `clumpMirrorRadialOptions` | 29913 | function |  | 2 |
| `contextualRadialOptions` | 29920 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30049 | function |  | 3 |
| `layoutContextualRadialOptions` | 30053 | function |  | 4 |
| `renderRadialActionList` | 30077 | function |  | 3 |
| `radialListOptionAtPointer` | 30095 | function |  | 3 |
| `syncRadialListHighlight` | 30117 | function |  | 3 |
| `configureContextualRadialMenu` | 30123 | function |  | 3 |
| `beginStrandRadialGesture` | 30183 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30217 | function |  | 2 |
| `updateStrandRadialGesture` | 30263 | function |  | 1 |
| `performStrandRadialAction` | 30302 | function |  | 2 |
| `finishStrandRadialGesture` | 30405 | function |  | 2 |
| `cancelStrandRadialGesture` | 30415 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30422 | function |  | 1 |
| `setPullMoveEnabled` | 30428 | function |  | 3 |
| `toolRadialOptions` | 30436 | function |  | 2 |
| `hideToolRadialMenu` | 30461 | function |  | 4 |
| `beginToolRadialGesture` | 30474 | function |  | 2 |
| `beginToolShortcutPress` | 30514 | function |  | 2 |
| `finishToolShortcutPress` | 30529 | function |  | 2 |
| `cancelToolShortcutPress` | 30538 | function |  | 5 |
| `setRadialMenusEnabled` | 30546 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30559 | function |  | 5 |
| `setNavigationTipsEnabled` | 30574 | function |  | 5 |
| `configureNavigationMouseButtons` | 30581 | function |  | 3 |
| `syncNavigationModifierLocks` | 30594 | function |  | 7 |
| `setNavigationStyle` | 30599 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30615 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30630 | function |  | 5 |
| `setCameraSmoothingStrength` | 30636 | function |  | 5 |
| `setScaleSensitivity` | 30644 | function |  | 3 |
| `setToolTipsEnabled` | 30652 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30659 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30668 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30676 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30691 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30700 | function |  | 5 |
| `sideNamingDisplayId` | 30709 | function |  | 3 |
| `referenceViewDisplayLabel` | 30721 | function |  | 6 |
| `strandRegionDisplayLabel` | 30731 | function |  | 10 |
| `updateSideNamingLabels` | 30749 | function |  | 2 |
| `setSideNamingPerspective` | 30776 | function |  | 5 |
| `setControlPointDisplaySize` | 30785 | function |  | 6 |
| `scaleHexColor` | 30797 | function |  | 3 |
| `setViewportBackgroundColor` | 30802 | function |  | 7 |
| `setDefaultHairShader` | 30824 | function |  | 5 |
| `setPreferenceCategory` | 30830 | function |  | 4 |
| `openPreferencesDialog` | 30857 | function |  | 1 |
| `savePreferencesDialog` | 30885 | function |  | 1 |
| `cancelPreferencesDialog` | 30909 | function |  | 3 |
| `updateToolRadialGesture` | 30938 | function |  | 1 |
| `performToolRadialAction` | 30967 | function |  | 2 |
| `finishToolRadialGesture` | 30977 | function |  | 2 |
| `cancelToolRadialGesture` | 30986 | function |  | 5 |
| `duplicatePlacementTarget` | 30993 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31020 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31024 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31034 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31039 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31051 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31062 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31070 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31087 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31108 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31119 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31125 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31131 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31164 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31319 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31421 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31462 | function |  | 2 |
| `updateDuplicatePlacement` | 31489 | function |  | 2 |
| `beginDuplicatePlacement` | 31553 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31617 | function |  | 2 |
| `confirmDuplicatePlacement` | 31658 | function |  | 1 |
| `cancelDuplicatePlacement` | 31695 | function |  | 4 |
| `outlinerClumpLocks` | 31721 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31725 | function |  | 3 |
| `createOutlinerStrandButton` | 31748 | function |  | 4 |
| `createOutlinerCurveSurface` | 31834 | function |  | 2 |
| `createOutlinerClump` | 31930 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32012 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32019 | function |  | 2 |
| `renderLockList` | 32098 | function |  | 70 |
| `updateCount` | 32252 | function |  | 34 |
| `captureInputUndo` | 32261 | function |  | 1 |
| `bindUndoCapture` | 32267 | function |  | 36 |
| `bindLockInput` | 32278 | function |  | 2 |
| `applyValue` | 32295 | arrow |  | 2 |
| `applyUniformTransformScale` | 32614 | function |  | 2 |
| `applyReducedTransformScale` | 32631 | function |  | 2 |
| `applyTransformPrecision` | 32670 | function |  | 2 |
| `updateTransformScalePointer` | 32699 | function |  | 1 |
| `finishSweepProfileDrag` | 32930 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33026 | function |  | 3 |
| `finishTaperCurveDrag` | 33088 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33131 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33212 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33267 | function |  | 6 |
| `updateSelectedTaperPoint` | 33291 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33861 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33866 | function |  | 4 |
| `syncDrawCurlControls` | 33921 | function |  | 5 |
| `handleLiveSurfaceChange` | 33969 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34051 | function |  | 3 |
| `resampleSurfaceLock` | 34066 | function |  | 2 |
| `changePanelSplitCount` | 34179 | function |  | 3 |
| `presetNumber` | 34283 | function |  | 23 |
| `clonePresetShape` | 34288 | function |  | 7 |
| `creationPresetSnapshot` | 34297 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34345 | function |  | 5 |
| `applyPresetControl` | 34372 | function |  | 2 |
| `applyCreationToolSettings` | 34393 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34433 | function |  | 3 |
| `loadCustomCreationPresets` | 34440 | function |  | 2 |
| `saveCustomCreationPresets` | 34450 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34458 | function |  | 2 |
| `populateCreationPresetSelect` | 34494 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34518 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34551 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34556 | function |  | 2 |
| `applyCustomCreationPreset` | 34573 | function |  | 3 |
| `createCustomCreationPreset` | 34594 | function |  | 3 |
| `createCustomClumpPreset` | 34609 | function |  | 3 |
| `commitCustomCreationPreset` | 34624 | function |  | 2 |
| `openRemoveCreationPreset` | 34685 | function |  | 3 |
| `commitRemoveCreationPreset` | 34698 | function |  | 1 |
| `applyBraidToolPreset` | 34715 | function |  | 2 |
| `selectedBranchChildLock` | 34827 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34831 | function |  | 2 |
| `initPanelResizeHandles` | 34937 | function |  | 2 |
| `applyWidth` | 34943 | arrow |  | 2 |
| `restoreWidth` | 34950 | arrow |  | 2 |
| `bindResize` | 34958 | arrow |  | 2 |
| `onMove` | 34966 | arrow |  | 0 |
| `onUp` | 34970 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 34987 | function |  | 2 |
| `initFloatingPanelControls` | 34996 | function |  | 2 |
| `detach` | 35005 | arrow |  | 43 |
| `endDrag` | 35043 | arrow |  | 0 |
| `endResize` | 35075 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35086 | function |  | 3 |
| `selectPatchNotesVersion` | 35220 | function |  | 3 |
| `requestReferenceImage` | 35253 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35457 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35463 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35470 | function |  | 1 |
| `deleteLocks` | 36037 | function |  | 10 |
| `disposeCurveObjects` | 36115 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36167 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36198 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36273 | function |  | 2 |
| `resize` | 36306 | function |  | 4 |
| `handleViewportPointerMove` | 36317 | function |  | 1 |
| `blockProportionalSizingEvent` | 36328 | function |  | 1 |
| `updateLightAngleFromInputs` | 36334 | function |  | 2 |
| `startViewSnap` | 36348 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36378 | function |  | 3 |
| `trackViewportPointerDown` | 36395 | function |  | 1 |
| `trackViewportPointerMove` | 36411 | function |  | 1 |
| `clearViewportPointer` | 36419 | function |  | 1 |
| `updateViewSnap` | 36424 | function |  | 1 |
| `nearestCardinalAxis` | 36460 | function |  | 5 |
| `cardinalAxisKey` | 36474 | function |  | 5 |
| `steppedDragAmount` | 36478 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36484 | function |  | 4 |
| `endViewSnap` | 36500 | function |  | 4 |
| `activateStrandControlPoint` | 36510 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36560 | function |  | 4 |
| `addStrandControlPointSelection` | 36587 | function |  | 3 |
| `removeStrandControlPointSelection` | 36604 | function |  | 3 |
| `sampleStrandPointNormal` | 36618 | function |  | 2 |
| `sampleStrandPointVectors` | 36628 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36634 | function |  | 2 |
| `resampleStrandCurveData` | 36645 | function |  | 4 |
| `resampleMatchingVectors` | 36651 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36690 | function |  | 4 |
| `removeStrandCurvePoint` | 36701 | function |  | 2 |
| `closestStrandCurveParameter` | 36714 | function |  | 2 |
| `insertStrandCurvePoint` | 36743 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36760 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36770 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36786 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36793 | function |  | 4 |
| `prepareCurvePointSelection` | 36815 | function |  | 1 |
| `finishCurvePointInsertion` | 36926 | function |  | 1 |
| `finishPointRemoval` | 36941 | function |  | 1 |
| `editableStrandWidth` | 36959 | function |  | 6 |
| `editableStrandWidthBounds` | 36971 | function |  | 2 |
| `applyEditableStrandWidth` | 36977 | function |  | 3 |
| `viewportPixelPoint` | 37013 | function |  | 3 |
| `syncSculptBrushControls` | 37021 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37036 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37044 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37052 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37058 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37062 | function |  | 7 |
| `updateSculptBrushCursor` | 37069 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37091 | function |  | 4 |
| `sculptBrushEditableLock` | 37098 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37108 | function |  | 5 |
| `sculptBrushLockViable` | 37114 | function |  | 5 |
| `sculptBrushUnits` | 37125 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37163 | function |  | 4 |
| `sculptBrushPointWeight` | 37213 | function |  | 5 |
| `sculptBrushWorldDelta` | 37223 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37232 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37258 | function |  | 2 |
| `beginSculptMoveStroke` | 37316 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37378 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37613 | function |  | 3 |
| `updateSculptMoveStroke` | 37622 | function |  | 1 |
| `finishSculptMoveStroke` | 37638 | function |  | 3 |
| `strandControlPointHit` | 37686 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37690 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37768 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37802 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37842 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37855 | function |  | 1 |
| `setHoveredControlPoint` | 37894 | function |  | 7 |
| `visibleControlPointHoverTargets` | 37907 | function |  | 2 |
| `updateControlPointHover` | 37943 | function |  | 1 |
| `animate` | 38500 | function |  | 2 |
| `syncCompactSidebarLayout` | 38531 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38550 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38556 | function |  | 3 |
| `setAttributeEditorTab` | 38562 | function |  | 6 |

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
