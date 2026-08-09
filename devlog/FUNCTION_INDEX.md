# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1724** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38762 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 251 | function |  | 3 |
| `saveBooleanPreference` | 279 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 283 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 288 | function |  | 2 |
| `normalizeScaleSensitivity` | 293 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 298 | function |  | 2 |
| `normalizeSideNamingPerspective` | 303 | function |  | 2 |
| `normalizeNavigationStyle` | 307 | function |  | 2 |
| `setupEditableSliderControls` | 321 | function |  | 2 |
| `syncNumberFromRange` | 372 | arrow |  | 0 |
| `applyNumberValue` | 379 | arrow |  | 0 |
| `copyCameraPose` | 489 | function |  | 3 |
| `updateCameraProjectionForViewport` | 495 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 508 | function |  | 3 |
| `setOrthographicView` | 514 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 554 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 583 | function |  | 2 |
| `removeRotateFreeAxisRing` | 609 | function |  | 2 |
| `deflateTransformGizmoPickers` | 621 | function |  | 2 |
| `nextStrandName` | 1004 | function |  | 2 |
| `activeDrawClumpTemplate` | 1089 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1094 | function |  | 3 |
| `drawModeCreatesClump` | 1121 | function |  | 1 |
| `isPanelGeometry` | 1265 | function |  | 31 |
| `normalizePanelSplits` | 1269 | function |  | 3 |
| `clonePanelSplits` | 1281 | function |  | 19 |
| `snapPanelSplitHeight` | 1285 | function |  | 5 |
| `createQuadSphereGeometry` | 1320 | function |  | 2 |
| `vertexIndex` | 1334 | function |  | 11 |
| `addEdge` | 1352 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1387 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1457 | function |  | 3 |
| `updateScalpRenderGeometry` | 1484 | function |  | 4 |
| `writeScalpRegionColors` | 1535 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1548 | function |  | 2 |
| `createScalpSelectionOutline` | 1578 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1630 | function |  | 25 |
| `activeScalpSurfaceWire` | 1635 | function |  | 2 |
| `activeScalpSelectionOutline` | 1640 | function |  | 2 |
| `inferredCustomScalpRegion` | 1645 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1652 | function |  | 5 |
| `customScalpGeometryFromObject` | 1671 | function |  | 2 |
| `customScalpWireGeometry` | 1703 | function |  | 3 |
| `installCustomScalpGeometry` | 1714 | function |  | 3 |
| `installCustomScalpGuide` | 1738 | function |  | 3 |
| `setScalpGuideSource` | 1756 | function |  | 7 |
| `updateScalpQuadWire` | 1772 | function |  | 4 |
| `updateScalpTopology` | 1788 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1852 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2032 | function |  | 2 |
| `currentStrandSelectionState` | 2108 | function |  | 4 |
| `applyStrandSelectionState` | 2112 | function |  | 5 |
| `clearStrandSelectionState` | 2117 | function |  | 7 |
| `guideHeadBounds` | 3206 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3216 | function |  | 5 |
| `disposeGuideModel` | 3230 | function |  | 3 |
| `syncHeadTransformInputs` | 3241 | function |  | 4 |
| `applyHeadTransform` | 3248 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3266 | function |  | 4 |
| `applyScalpRoughScale` | 3275 | function |  | 5 |
| `resetHeadTransform` | 3289 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3303 | function |  | 2 |
| `installGuideModel` | 3319 | function |  | 5 |
| `loadDefaultGuideModel` | 3395 | function |  | 3 |
| `braidTemplateFromEntries` | 3418 | function |  | 4 |
| `braidMeshEntries` | 3450 | function |  | 2 |
| `prepareBraidBodyCache` | 3462 | function |  | 2 |
| `quantize` | 3471 | arrow |  | 21 |
| `sourceNormalAt` | 3483 | arrow |  | 1 |
| `clusterBoundary` | 3486 | arrow |  | 2 |
| `normalBuckets` | 3503 | arrow |  | 2 |
| `applyBucketPair` | 3535 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3566 | function |  | 2 |
| `annotateBraidObjTopology` | 3587 | function |  | 2 |
| `loadBraidMeshPreset` | 3607 | function |  | 3 |
| `createSplitControlHandle` | 3624 | function |  | 4 |
| `frameGuideModel` | 3639 | function |  | 2 |
| `syncScalpInputs` | 3664 | function |  | 2 |
| `syncScalpArtistInputs` | 3670 | function |  | 2 |
| `rootScalpOffsetDistance` | 3678 | function |  | 15 |
| `applyLockRootScalpOffset` | 3683 | function |  | 5 |
| `normalizeHairLayer` | 3699 | function |  | 28 |
| `layerOffsetForLock` | 3703 | function |  | 9 |
| `layerRootOffsetFactor` | 3708 | function |  | 13 |
| `layerOffsetWeight` | 3712 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3718 | function |  | 5 |
| `pointsWithLayerOffset` | 3727 | function |  | 3 |
| `layerDirectionForLock` | 3735 | function |  | 2 |
| `applyLayerOffset` | 3746 | function |  | 5 |
| `setLockHairLayer` | 3770 | function |  | 2 |
| `setGroupLayerOffset` | 3785 | function |  | 2 |
| `scalpArtistWeight` | 3797 | function |  | 3 |
| `scalpArtistScalesAt` | 3801 | function |  | 3 |
| `applyScalpArtistShape` | 3811 | function |  | 5 |
| `inverseScalpArtistShape` | 3829 | function |  | 2 |
| `updateScalpSurface` | 3856 | function |  | 3 |
| `setActiveScalpRegion` | 3866 | function |  | 2 |
| `clearScalpRegions` | 3878 | function |  | 2 |
| `scalpHitFromEvent` | 3895 | function |  | 3 |
| `updateScalpBrushCursor` | 3903 | function |  | 4 |
| `paintScalpAt` | 3918 | function |  | 3 |
| `beginScalpPaint` | 3985 | function |  | 2 |
| `updateScalpPaint` | 3994 | function |  | 1 |
| `endScalpPaint` | 4003 | function |  | 2 |
| `createScalpLattice` | 4010 | function |  | 2 |
| `resetScalpLattice` | 4035 | function |  | 1 |
| `updateScalpLatticeObjects` | 4047 | function |  | 7 |
| `quadraticWeights` | 4061 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4066 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4093 | function |  | 3 |
| `selectScalpLatticePoint` | 4108 | function |  | 2 |
| `beginScalpLatticeDrag` | 4123 | function |  | 2 |
| `updateScalpLatticeDrag` | 4141 | function |  | 1 |
| `endScalpLatticeDrag` | 4159 | function |  | 2 |
| `setHeadReferenceTransparency` | 4165 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4175 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4193 | function |  | 3 |
| `trianglePlaneIntersections` | 4201 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4222 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4248 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4258 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4270 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4294 | function |  | 3 |
| `createScalpBuilderPlanes` | 4309 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4341 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4380 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4403 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4415 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4427 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4432 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4444 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4554 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4579 | function |  | 5 |
| `syncEditedScalpSurface` | 4594 | function |  | 4 |
| `ensureEditedScalpSurface` | 4665 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4695 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4780 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4793 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4809 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4819 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4837 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4850 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4857 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4876 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4890 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4931 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4940 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4953 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4974 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5111 | function |  | 2 |
| `scalpTemplateNeighbors` | 5119 | function |  | 2 |
| `smoothScalpVectorField` | 5131 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5145 | function |  | 2 |
| `upperContourCurve` | 5162 | function |  | 4 |
| `hermitePoint` | 5197 | function |  | 2 |
| `curveNetworkSection` | 5208 | function |  | 3 |
| `pointAlongSection` | 5237 | function |  | 3 |
| `longestStitchedContour` | 5243 | function |  | 2 |
| `nodeForPoint` | 5251 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5308 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5318 | function |  | 1 |
| `orderedRange` | 5330 | arrow |  | 3 |
| `clipSegment` | 5353 | arrow |  | 1 |
| `liftedPoint` | 5376 | arrow |  | 5 |
| `boundaryCorner` | 5381 | arrow |  | 4 |
| `surfaceCurveBetween` | 5390 | arrow |  | 1 |
| `addSurfaceConnector` | 5413 | arrow |  | 2 |
| `sideContourAtDepth` | 5481 | arrow |  | 3 |
| `addSurfacePatch` | 5515 | arrow |  | 1 |
| `addCenterBridgePatch` | 5595 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5703 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5738 | function |  | 1 |
| `generatedScalpObjContent` | 5828 | function |  | 2 |
| `generateScalpFromBuilder` | 5842 | function |  | 1 |
| `orderedDepthRange` | 5878 | arrow |  | 7 |
| `resetScalpBuilder` | 6007 | function |  | 1 |
| `confirmScalpBuilderPlane` | 6022 | function |  | 1 |
| `beginScalpBuilderInput` | 6036 | function |  | 2 |
| `updateScalpBuilderStroke` | 6037 | function |  | 1 |
| `finishScalpBuilderStroke` | 6038 | function |  | 2 |
| `setScalpBuilderEditing` | 6040 | function |  | 10 |
| `updateScalpEditingVisibility` | 6074 | function |  | 12 |
| `exitSetupEditors` | 6168 | function |  | 7 |
| `setCapsuleGuideEditing` | 6177 | function |  | 5 |
| `syncAppMenuVisibility` | 6205 | function |  | 3 |
| `closeAppMenus` | 6210 | function |  | 6 |
| `setAppMenuOpen` | 6221 | function |  | 3 |
| `setTurntableActive` | 6228 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6237 | function |  | 9 |
| `selectedReferenceImage` | 6241 | function |  | 20 |
| `normalizeReferenceCrop` | 6247 | function |  | 8 |
| `referenceCropIsFull` | 6255 | function |  | 3 |
| `referencePlaneFrontAxis` | 6260 | function |  | 4 |
| `referencePlanePlacement` | 6269 | function |  | 4 |
| `migratedReferencePlanePosition` | 6284 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6304 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6321 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6337 | function |  | 2 |
| `snappedReferenceImageView` | 6360 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6366 | function |  | 5 |
| `applyReferenceImageRuntime` | 6382 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6425 | function |  | 6 |
| `createReferenceImageRuntime` | 6433 | function |  | 3 |
| `addReferenceImage` | 6502 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6554 | function |  | 3 |
| `disposeReferenceImage` | 6573 | function |  | 2 |
| `clearReferenceImages` | 6577 | function |  | 2 |
| `serializeReferenceImage` | 6584 | function |  | 1 |
| `setReferenceImageType` | 6612 | function |  | 2 |
| `attachReferenceImageTransform` | 6656 | function |  | 6 |
| `selectReferenceImage` | 6670 | function |  | 12 |
| `placeReferencePlane` | 6693 | function |  | 2 |
| `setReferencePlaneInFront` | 6704 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6714 | function |  | 4 |
| `renderReferenceImagePanel` | 6733 | function |  | 20 |
| `setOutlinerTab` | 6780 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6798 | function |  | 4 |
| `componentEditModeActive` | 6802 | function |  | 38 |
| `selectionToolSupportsPicking` | 6806 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6811 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6827 | function |  | 2 |
| `setViewportSelectionMode` | 6857 | function |  | 4 |
| `setViewportEditMode` | 6869 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6911 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6925 | function |  | 8 |
| `outlinerGuides` | 6937 | function |  | 3 |
| `guideOutlinerLabel` | 6944 | function |  | 2 |
| `normalizeOutlinerName` | 6954 | function |  | 4 |
| `beginOutlinerRename` | 6959 | function |  | 2 |
| `finish` | 6970 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 7000 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 7010 | function |  | 2 |
| `renderGuideOutliner` | 7045 | function |  | 10 |
| `referenceOutlinerGroup` | 7103 | function |  | 2 |
| `renderReferenceOutliner` | 7107 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7224 | function |  | 5 |
| `readReferenceImageFile` | 7229 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7253 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7260 | function |  | 3 |
| `dragContainsReferenceImage` | 7305 | function |  | 3 |
| `setReferenceImageDragActive` | 7316 | function |  | 9 |
| `referenceDropDestination` | 7324 | function |  | 2 |
| `viewportOverlayDropPosition` | 7330 | function |  | 2 |
| `setReferenceDropHover` | 7339 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7357 | function |  | 2 |
| `referenceOverlayAtPointer` | 7377 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7395 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7408 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7454 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7504 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7526 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7537 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7563 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7572 | function |  | 2 |
| `referenceCropCursor` | 7587 | function |  | 3 |
| `updateReferenceCropHandles` | 7593 | function |  | 5 |
| `referenceCropSourcePoint` | 7614 | function |  | 2 |
| `beginReferenceCrop` | 7621 | function |  | 1 |
| `updateReferenceCrop` | 7659 | function |  | 1 |
| `finishReferenceCrop` | 7691 | function |  | 4 |
| `setHeadSetupEditing` | 7709 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7725 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7734 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7744 | function |  | 4 |
| `setScalpGuideVisibility` | 7750 | function |  | 12 |
| `currentGuideViewMode` | 7758 | function |  | 3 |
| `updateGuideViewToggle` | 7766 | function |  | 5 |
| `setGuideViewMode` | 7782 | function |  | 3 |
| `cycleGuideViewMode` | 7793 | function |  | 1 |
| `hideGuideViewContextMenu` | 7798 | function |  | 6 |
| `showGuideViewContextMenu` | 7802 | function |  | 1 |
| `strandPassesDisplayFilters` | 7815 | function |  | 4 |
| `strandVisibleForDisplay` | 7824 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7829 | function |  | 2 |
| `lockedStrandsExist` | 7833 | function |  | 3 |
| `hiddenStrandsExist` | 7837 | function |  | 2 |
| `hideSelectedStrands` | 7841 | function |  | 2 |
| `unhideHiddenStrands` | 7851 | function |  | 2 |
| `strandIsolationActive` | 7860 | function |  | 7 |
| `setStrandIsolation` | 7864 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7876 | function |  | 3 |
| `syncVisibilityParent` | 7887 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7894 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7923 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7930 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7950 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7973 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7981 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7988 | function |  | 9 |
| `setScalpLatticeEditing` | 7999 | function |  | 4 |
| `setScalpShapeEditing` | 8014 | function |  | 9 |
| `setScalpPaintEditing` | 8032 | function |  | 7 |
| `defaultCurveLatticePoints` | 8056 | function |  | 3 |
| `flatCurveLatticePoints` | 8082 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8091 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8115 | function |  | 4 |
| `horizontalValue` | 8120 | arrow |  | 1 |
| `blendedSample` | 8131 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8164 | function |  | 2 |
| `curveLatticeControlPoint` | 8179 | function |  | 9 |
| `circularArcTangent` | 8183 | function |  | 4 |
| `arcLengthTo` | 8214 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8226 | function |  | 3 |
| `sampleHermiteCurve` | 8265 | function |  | 10 |
| `sampleCurveLattice` | 8282 | function |  | 6 |
| `curveLatticeNormal` | 8301 | function |  | 1 |
| `createCurveLatticeGeometry` | 8312 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8341 | function |  | 3 |
| `appendCurve` | 8343 | arrow |  | 4 |
| `sample` | 8345 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8372 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8388 | function |  | 3 |
| `addPicker` | 8390 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8429 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8442 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8446 | function |  | 3 |
| `curveLatticeEditablePoint` | 8464 | function |  | 13 |
| `curveLatticePointSection` | 8471 | function |  | 3 |
| `curveLatticeRestPoint` | 8482 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8488 | function |  | 7 |
| `curveLatticeRootColumns` | 8494 | function |  | 3 |
| `curveTangentsForPoints` | 8501 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8513 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8550 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8576 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8593 | function |  | 3 |
| `resampleGrid` | 8603 | arrow |  | 2 |
| `controlPointIsSelected` | 8630 | function |  | 7 |
| `clearMultiPointSelection` | 8638 | function |  | 9 |
| `createCurveLatticeHandles` | 8642 | function |  | 4 |
| `addCurveLattice` | 8664 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8773 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8804 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8810 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8849 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8870 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8887 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8896 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8903 | function |  | 1 |
| `selectCurveLatticeLoop` | 8922 | function |  | 3 |
| `selectCurveLatticePoint` | 8951 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8966 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 9008 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9029 | function |  | 3 |
| `curveLatticeColumnPoints` | 9072 | function |  | 3 |
| `groupCurveControlIndices` | 9081 | function |  | 4 |
| `groupCurveControlPoints` | 9087 | function |  | 2 |
| `updateGroupCurveDisplay` | 9093 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9103 | function |  | 2 |
| `groupCurveDeformationPairs` | 9125 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9132 | function |  | 2 |
| `appendPairs` | 9134 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9145 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9164 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9185 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9204 | function |  | 2 |
| `capsuleGuideCapHeight` | 9238 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9242 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9247 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9251 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9263 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9279 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9285 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9311 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9341 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9395 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9416 | function |  | 7 |
| `vertex` | 9430 | function |  | 4 |
| `addFace` | 9436 | function |  | 3 |
| `addRing` | 9454 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9509 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9519 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9584 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9630 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9643 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9664 | function |  | 3 |
| `capsuleGuidePointDistances` | 9669 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9690 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9710 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9715 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9721 | function |  | 3 |
| `capsuleGuideAccentColor` | 9726 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9731 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9742 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9754 | function |  | 2 |
| `createCapsuleGuideHandles` | 9786 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9809 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9828 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9835 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9851 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9868 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9883 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9920 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9936 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9953 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9959 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9986 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9998 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 10017 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10062 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10097 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10111 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10117 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10134 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10145 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10156 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10186 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10196 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10237 | function |  | 3 |
| `createQuadCageGeometry` | 10253 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10277 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10297 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10308 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10361 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10399 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10409 | function |  | 4 |
| `addCapsuleGuide` | 10417 | function |  | 4 |
| `addGuide` | 10486 | function |  | 1 |
| `createGuideGeometry` | 10547 | function |  | 4 |
| `selectGuide` | 10602 | function |  | 17 |
| `updateGuideControlsVisibility` | 10670 | function |  | 10 |
| `updateViewportToolVisibility` | 10687 | function |  | 7 |
| `getSelectedGuide` | 10726 | function |  | 34 |
| `selectedViewportFocusBounds` | 10730 | function |  | 2 |
| `frameViewportBounds` | 10744 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10774 | function |  | 2 |
| `fullSceneFocusBounds` | 10778 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10795 | function |  | 3 |
| `cycleViewportFraming` | 10804 | function |  | 2 |
| `syncGuideInputs` | 10822 | function |  | 5 |
| `updateGuideGeometry` | 10865 | function |  | 3 |
| `sculptBrushToolActive` | 10886 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10890 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10894 | function |  | 3 |
| `effectiveSculptBrushTool` | 10898 | function |  | 13 |
| `updateSculptScaleModeRow` | 10904 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10909 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10931 | function |  | 5 |
| `setActiveTool` | 10940 | function |  | 19 |
| `setDrawStrandMode` | 11078 | function |  | 2 |
| `setObjectSpaceEditing` | 11088 | function |  | 7 |
| `setHierarchyEditing` | 11104 | function |  | 4 |
| `setProportionalEditing` | 11116 | function |  | 5 |
| `beginProportionalSizeEdit` | 11135 | function |  | 3 |
| `updateProportionalSizeEdit` | 11147 | function |  | 2 |
| `endProportionalSizeEdit` | 11158 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11165 | function |  | 2 |
| `refreshProportionalPreview` | 11173 | function |  | 4 |
| `activeBrushSizeInput` | 11183 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11192 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11204 | function |  | 2 |
| `beginBrushSizeDrag` | 11222 | function |  | 1 |
| `updateBrushSizeDrag` | 11249 | function |  | 1 |
| `finishBrushSizeDrag` | 11270 | function |  | 2 |
| `updateInteractionLocks` | 11287 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11296 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11305 | function |  | 2 |
| `configureTransformControls` | 11336 | function |  | 16 |
| `pullMoveActive` | 11344 | function |  | 9 |
| `updatePullGuideVisual` | 11348 | function |  | 4 |
| `attachTransformForCurvePoint` | 11364 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11388 | function |  | 7 |
| `strandObjectRootIndex` | 11404 | function |  | 3 |
| `strandObjectRoot` | 11413 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11417 | function |  | 2 |
| `attachStrandObjectTransform` | 11422 | function |  | 6 |
| `guideObjectPivot` | 11445 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11456 | function |  | 2 |
| `attachGuideObjectTransform` | 11461 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11480 | function |  | 2 |
| `beginGuideObjectTransform` | 11508 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11515 | function |  | 2 |
| `updateGuideObjectTransform` | 11537 | function |  | 2 |
| `finishGuideObjectTransform` | 11570 | function |  | 2 |
| `clonePlacementFrame` | 11579 | function |  | 2 |
| `cloneOptionalVectors` | 11591 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11595 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11612 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11627 | function |  | 2 |
| `strandObjectTransformOperators` | 11643 | function |  | 4 |
| `transformPoint` | 11651 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11658 | arrow |  | 0 |
| `transformNormal` | 11664 | arrow |  | 10 |
| `transformDirection` | 11674 | arrow |  | 7 |
| `worldMatrixForPivot` | 11686 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11692 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11708 | function |  | 6 |
| `beginStrandObjectTransform` | 11722 | function |  | 2 |
| `updateStrandObjectTransform` | 11760 | function |  | 2 |
| `commitStrandObjectTransform` | 11809 | function |  | 2 |
| `mapPoints` | 11822 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11856 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11870 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11893 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11906 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11921 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11947 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11996 | function |  | 2 |
| `beginHandleEdit` | 12005 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12054 | function |  | 3 |
| `applyBranchRigidRootMove` | 12071 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12108 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12119 | function |  | 3 |
| `multiPointHandleEditActive` | 12130 | function |  | 7 |
| `applyMultiMove` | 12134 | function |  | 5 |
| `applyMultiRotate` | 12140 | function |  | 2 |
| `applyMultiScale` | 12149 | function |  | 2 |
| `applyHierarchicalMove` | 12158 | function |  | 3 |
| `applySingleMove` | 12170 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12174 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12191 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12200 | function |  | 3 |
| `changed` | 12210 | arrow |  | 1 |
| `applyPullMove` | 12252 | function |  | 3 |
| `pullHeadCollisionContext` | 12260 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12279 | function |  | 2 |
| `applyProportionalMove` | 12302 | function |  | 3 |
| `viewPlaneNormal` | 12313 | function |  | 20 |
| `isCameraInSnappedView` | 12317 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12325 | function |  | 10 |
| `updateViewPlaneGrid` | 12329 | function |  | 14 |
| `setViewPlaneMove` | 12386 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12397 | function |  | 2 |
| `rayFromViewportEvent` | 12405 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12413 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12423 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12434 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12447 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12466 | function |  | 4 |
| `beginViewPlaneMove` | 12473 | function |  | 3 |
| `updateViewPlaneMove` | 12537 | function |  | 1 |
| `endViewPlaneMove` | 12602 | function |  | 7 |
| `applyHierarchicalRotate` | 12621 | function |  | 2 |
| `rotateGuideNormal` | 12628 | arrow |  | 4 |
| `applySingleRotate` | 12666 | function |  | 2 |
| `applyProportionalRotate` | 12670 | function |  | 2 |
| `applyHierarchicalScale` | 12690 | function |  | 2 |
| `applySingleScale` | 12700 | function |  | 2 |
| `applyProportionalScale` | 12704 | function |  | 2 |
| `setPointScale` | 12720 | function |  | 8 |
| `proportionalWeight` | 12729 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12741 | function |  | 5 |
| `strandInfluenceColor` | 12747 | function |  | 17 |
| `beginRelaxEdit` | 12772 | function |  | 3 |
| `updateRelaxEdit` | 12801 | function |  | 1 |
| `endRelaxEdit` | 12861 | function |  | 1 |
| `disposeGuide` | 12871 | function |  | 3 |
| `removeGuideObjects` | 12899 | function |  | 3 |
| `strandRadiusAt` | 12913 | function |  | 5 |
| `strandProfileTopologyAt` | 12930 | function |  | 8 |
| `strandCurveParameters` | 12972 | function |  | 5 |
| `widthProfileAt` | 12982 | arrow |  | 1 |
| `braidFrameAt` | 13020 | function |  | 5 |
| `braidFrameAtExtended` | 13030 | function |  | 2 |
| `createBraidProfileProjector` | 13039 | function |  | 2 |
| `project` | 13055 | arrow |  | 17 |
| `createBraidGeometry` | 13070 | function |  | 2 |
| `deformationAt` | 13105 | function |  | 3 |
| `widthFor` | 13114 | arrow |  | 3 |
| `depthFor` | 13118 | arrow |  | 3 |
| `outputVertex` | 13150 | function |  | 7 |
| `appendAuthoredCap` | 13258 | function |  | 3 |
| `outputCapVertex` | 13265 | arrow |  | 6 |
| `capBoundary` | 13356 | function |  | 3 |
| `strandGeometryCurve` | 13418 | function |  | 15 |
| `strandGeometryFrameAt` | 13444 | function |  | 19 |
| `transportedStrandFrameAt` | 13507 | function |  | 7 |
| `twistOverrideAt` | 13510 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13538 | function |  | 2 |
| `weldPanelGeometryData` | 13574 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13614 | function |  | 3 |
| `surfacePanelPoint` | 13629 | function |  | 3 |
| `createPanelStrandGeometry` | 13652 | function |  | 2 |
| `addQuad` | 13686 | arrow |  | 6 |
| `near` | 13690 | arrow |  | 6 |
| `panelWidthAt` | 13720 | arrow |  | 6 |
| `panelThicknessAt` | 13729 | arrow |  | 6 |
| `panelFrameAt` | 13738 | arrow |  | 1 |
| `rawPanelPoint` | 13756 | arrow |  | 1 |
| `panelPoint` | 13776 | arrow |  | 2 |
| `addPatch` | 13782 | arrow |  | 1 |
| `splitOpening` | 13833 | arrow |  | 2 |
| `uStart` | 13857 | arrow |  | 1 |
| `uEnd` | 13860 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13898 | function |  | 3 |
| `inside` | 13899 | arrow |  | 2 |
| `pushOrientedTriangle` | 13921 | function |  | 7 |
| `triangulatePolygon3D` | 13932 | function |  | 1 |
| `orientedQuadFace` | 13972 | function |  | 2 |
| `createSplitStrandGeometry` | 13980 | function |  | 2 |
| `fusedIndexAt` | 14137 | arrow |  | 0 |
| `createHairCardGeometry` | 14186 | function |  | 2 |
| `createPolyGeometry` | 14285 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14312 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14321 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14368 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14376 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14392 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14401 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14412 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14420 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14430 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14450 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14473 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14552 | function |  | 2 |
| `pushBoundary` | 14581 | arrow |  | 5 |
| `boundaryAt` | 14599 | arrow |  | 3 |
| `hermite` | 14621 | arrow |  | 2 |
| `emitBottomMidRow` | 14666 | arrow |  | 2 |
| `emitTopMidRow` | 14765 | arrow |  | 2 |
| `sideHoleVertex` | 14807 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14856 | arrow |  | 2 |
| `emitFillStrip` | 14927 | arrow |  | 2 |
| `fillSide` | 14938 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14982 | arrow |  | 2 |
| `edgeDirection` | 15006 | arrow |  | 1 |
| `positionAt` | 15065 | arrow |  | 1 |
| `createBranchChildGeometry` | 15116 | function |  | 2 |
| `createCompoundStrandGeometry` | 15326 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15577 | function |  | 2 |
| `createHairGeometry` | 15608 | function |  | 6 |
| `createBaseHairGeometry` | 15660 | function |  | 3 |
| `hairMaterialDefinition` | 15778 | function |  | 4 |
| `materialForLock` | 15782 | function |  | 8 |
| `activeHairMaterialDefinition` | 15786 | function |  | 11 |
| `strandDisplayColor` | 15792 | function |  | 14 |
| `setAnimeHairBaseColor` | 15810 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15823 | function |  | 2 |
| `createHairMaterial` | 15863 | function |  | 5 |
| `createStrandSelectionOutline` | 15905 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15939 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15948 | function |  | 6 |
| `refreshMaterialUsers` | 15975 | function |  | 6 |
| `renderHairMaterialOutliner` | 15984 | function |  | 5 |
| `renderHairMaterialOptions` | 16014 | function |  | 3 |
| `syncHairMaterialEditor` | 16024 | function |  | 9 |
| `createProjectHairMaterial` | 16050 | function |  | 3 |
| `deleteActiveHairMaterial` | 16070 | function |  | 2 |
| `createHairTopologyGeometry` | 16088 | function |  | 4 |
| `createHairTopologyOverlay` | 16109 | function |  | 3 |
| `groupDefaultsFor` | 16156 | function |  | 9 |
| `creationToolActive` | 16163 | function |  | 8 |
| `activeCreationShapeDefaults` | 16167 | function |  | 11 |
| `activeStrandShapeTarget` | 16173 | function |  | 5 |
| `curvePolylineLength` | 16177 | function |  | 2 |
| `curvePolylineLengths` | 16185 | function |  | 3 |
| `samplePolylineDistance` | 16193 | function |  | 2 |
| `applyProjectedCurveLength` | 16203 | function |  | 4 |
| `clearRegionLengthBaseline` | 16234 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16241 | function |  | 2 |
| `setGroupLengthScale` | 16249 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16287 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16319 | function |  | 1 |
| `activeSweepProfile` | 16328 | function |  | 9 |
| `activeSweepProfileTarget` | 16335 | function |  | 6 |
| `trimmedSweepProfile` | 16342 | function |  | 7 |
| `roundedLeft` | 16351 | arrow |  | 1 |
| `roundedRight` | 16357 | arrow |  | 1 |
| `activeProfileOffset` | 16374 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16381 | function |  | 3 |
| `profileToCanvas` | 16398 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16402 | function |  | 11 |
| `sampleSweepProfile` | 16411 | function |  | 7 |
| `createSweepProfileTopology` | 16432 | function |  | 5 |
| `renderProfilePreview` | 16474 | function |  | 8 |
| `renderHairCardCoveragePath` | 16493 | function |  | 3 |
| `activeTaperTarget` | 16508 | function |  | 15 |
| `twistCurveEditing` | 16515 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16519 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16523 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16527 | function |  | 17 |
| `taperAsymmetryKey` | 16531 | function |  | 12 |
| `taperSecondaryKey` | 16535 | function |  | 11 |
| `activeTaperCurve` | 16539 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16550 | function |  | 6 |
| `taperSamples` | 16560 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16567 | function |  | 2 |
| `renderTaperPreview` | 16589 | function |  | 13 |
| `renderTwistCurvePreview` | 16625 | function |  | 5 |
| `cloneShapePresetValue` | 16643 | function |  | 66 |
| `shapeValuesMatch` | 16647 | function |  | 5 |
| `shapeTargetForSelect` | 16655 | function |  | 4 |
| `loadCustomShapePresets` | 16665 | function |  | 2 |
| `saveCustomShapePresets` | 16676 | function |  | 4 |
| `shapePresetLabel` | 16684 | function |  | 4 |
| `setupShapePresetControls` | 16689 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16714 | function |  | 3 |
| `syncShapePresetSelects` | 16720 | function |  | 8 |
| `populateShapePresetSelects` | 16741 | function |  | 5 |
| `applyShapePreset` | 16768 | function |  | 2 |
| `openSaveShapePreset` | 16805 | function |  | 2 |
| `commitCustomShapePreset` | 16830 | function |  | 2 |
| `openRemoveShapePreset` | 16853 | function |  | 2 |
| `commitRemoveShapePreset` | 16866 | function |  | 2 |
| `taperPointToCanvas` | 16882 | function |  | 4 |
| `canvasToTaperPoint` | 16899 | function |  | 2 |
| `clearTaperMeshPoints` | 16935 | function |  | 2 |
| `taperMeshPointFrame` | 16945 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16955 | function |  | 4 |
| `twistMeshGraphAxis` | 16963 | function |  | 4 |
| `addTwistMeshCurvePath` | 16967 | function |  | 2 |
| `appendSegment` | 16988 | arrow |  | 1 |
| `appendFill` | 16991 | arrow |  | 1 |
| `appendSignedSection` | 16997 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17046 | function |  | 6 |
| `updateTaperMeshPoints` | 17083 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17162 | function |  | 5 |
| `renderTaperCurveEditor` | 17180 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17252 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17266 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17282 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17316 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17325 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17336 | function |  | 2 |
| `applyTaperCurveEdit` | 17344 | function |  | 10 |
| `openTaperCurveEditor` | 17452 | function |  | 3 |
| `closeTaperCurveEditor` | 17497 | function |  | 6 |
| `updateViewportStatsVisibility` | 17510 | function |  | 6 |
| `canvasToProfile` | 17529 | function |  | 2 |
| `renderSweepProfileEditor` | 17539 | function |  | 7 |
| `applySweepProfileEdit` | 17582 | function |  | 8 |
| `openSweepProfileEditor` | 17609 | function |  | 1 |
| `closeSweepProfileEditor` | 17644 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17653 | function |  | 2 |
| `addLock` | 17668 | function |  | 19 |
| `mirroredScalpRegion` | 17871 | function |  | 5 |
| `mirroredVector` | 17880 | function |  | 12 |
| `mirroredPlacementFrame` | 17884 | function |  | 2 |
| `mirrorPartnerFor` | 17897 | function |  | 40 |
| `decoupleMirrorPartner` | 17901 | function |  | 2 |
| `createMirrorPartner` | 17909 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 18005 | function |  | 6 |
| `mirroredClumpPartners` | 18010 | function |  | 6 |
| `createMirroredClump` | 18016 | function |  | 3 |
| `decoupleMirroredClump` | 18038 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18047 | function |  | 6 |
| `syncActiveMirror` | 18212 | function |  | 25 |
| `setMirrorXEditing` | 18224 | function |  | 6 |
| `snapshotState` | 18248 | function |  | 7 |
| `scalpTriangleRegion` | 18505 | function |  | 4 |
| `closestPointOnActiveScalp` | 18518 | function |  | 12 |
| `rootAttachmentFrame` | 18590 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18602 | function |  | 4 |
| `resolveRootAttachment` | 18620 | function |  | 4 |
| `curvePointsToRootLocal` | 18660 | function |  | 2 |
| `curvePointsFromRootLocal` | 18672 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18680 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18696 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18726 | function |  | 2 |
| `createRootAttachment` | 18738 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18768 | function |  | 4 |
| `rootAttachmentToData` | 18795 | function |  | 2 |
| `rootAttachmentFromData` | 18823 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18862 | function |  | 2 |
| `remapPoint` | 18877 | arrow |  | 1 |
| `remapVector` | 18878 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18907 | function |  | 2 |
| `importHeadMeshFile` | 18924 | function |  | 3 |
| `importFullBodyMeshFile` | 18947 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18972 | function |  | 1 |
| `importedBooleanPreference` | 19005 | function |  | 11 |
| `loadPreferencesAndPresets` | 19009 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19079 | function |  | 1 |
| `openHairProjectFile` | 19122 | function |  | 4 |
| `dragContainsApplicationFile` | 19180 | function |  | 3 |
| `safelyRememberRecentProject` | 19189 | function |  | 2 |
| `renderRecentProjectsMenu` | 19198 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19230 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19255 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19259 | function |  | 2 |
| `pushUndoState` | 19275 | function |  | 119 |
| `undoLastAction` | 19282 | function |  | 2 |
| `redoLastAction` | 19296 | function |  | 2 |
| `updateHistoryButtons` | 19310 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19315 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19332 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19339 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19377 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19454 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19480 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19512 | function |  | 2 |
| `finalizeStateRestore` | 19553 | function |  | 2 |
| `restoreState` | 19560 | function |  | 5 |
| `disposeAllEditableObjects` | 19584 | function |  | 2 |
| `restoreLock` | 19605 | function |  | 4 |
| `restoreGuide` | 19822 | function |  | 2 |
| `vectorToData` | 19883 | function |  | 29 |
| `dataToVector` | 19887 | function |  | 31 |
| `frameToData` | 19891 | function |  | 2 |
| `frameFromData` | 19903 | function |  | 2 |
| `applyPresetSelection` | 19915 | function |  | 2 |
| `drawPresetThumbnail` | 19946 | function |  | 1 |
| `fillHair` | 19961 | arrow |  | 9 |
| `strand` | 19973 | arrow |  | 31 |
| `bun` | 19991 | arrow |  | 2 |
| `braid` | 20026 | arrow |  | 2 |
| `renderPresetLibrary` | 20115 | function |  | 3 |
| `setPresetLibraryOpen` | 20174 | function |  | 6 |
| `average` | 20187 | function |  | 4 |
| `fitPointAttributes` | 20191 | function |  | 9 |
| `rebuildCurveObjects` | 20220 | function |  | 10 |
| `createCurvePoints` | 20232 | function |  | 2 |
| `addGeneratedBangPreset` | 20241 | function |  | 1 |
| `sampleScalpQuad` | 20334 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20358 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20407 | function |  | 1 |
| `columns` | 20408 | arrow |  | 1 |
| `layer` | 20412 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20626 | function |  | 2 |
| `addBraidedBobPreset` | 20662 | function |  | 1 |
| `evenColumns` | 20663 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20879 | function |  | 1 |
| `scalpSeed` | 20902 | arrow |  | 1 |
| `createBowlCutPoints` | 21189 | function |  | 2 |
| `addBowlCutPreset` | 21227 | function |  | 1 |
| `scalpRegionAtHit` | 21293 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21305 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21312 | function |  | 12 |
| `braidStrokeActive` | 21319 | function |  | 9 |
| `proceduralDrawActive` | 21323 | function |  | 3 |
| `panelStrokeActive` | 21327 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21331 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21335 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21339 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21345 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21349 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21353 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21357 | function |  | 3 |
| `liveSurfaceStrandId` | 21367 | function |  | 4 |
| `liveSurfaceStrand` | 21371 | function |  | 4 |
| `liveSurfaceGuideId` | 21376 | function |  | 3 |
| `guideSupportsLiveSurface` | 21380 | function |  | 2 |
| `liveSurfaceGuide` | 21387 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21394 | function |  | 12 |
| `activeStrokeScalpOffset` | 21434 | function |  | 4 |
| `activeStrokeBrushSize` | 21440 | function |  | 10 |
| `activeStrokeBrushDepth` | 21446 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21452 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21460 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21470 | function |  | 13 |
| `worldNormalAtHit` | 21509 | function |  | 6 |
| `selectedPolyMesh` | 21517 | function |  | 10 |
| `addPolyLock` | 21522 | function |  | 2 |
| `ensurePolyMesh` | 21541 | function |  | 3 |
| `polySurfaceSample` | 21545 | function |  | 4 |
| `polyTargetAtEvent` | 21556 | function |  | 6 |
| `refreshPolyMesh` | 21582 | function |  | 10 |
| `ensurePolyFillPreview` | 21591 | function |  | 2 |
| `clearPolyFillPreview` | 21628 | function |  | 17 |
| `polyFillCandidateForEvent` | 21633 | function |  | 3 |
| `showPolyFillPreview` | 21653 | function |  | 2 |
| `updatePolyFillPreview` | 21679 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21704 | function |  | 5 |
| `fillPolyGap` | 21714 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21725 | function |  | 2 |
| `projectPolyRelaxPoint` | 21745 | function |  | 2 |
| `removePolyPointAttributes` | 21789 | function |  | 3 |
| `deletePolyComponent` | 21798 | function |  | 2 |
| `addPolyPoint` | 21821 | function |  | 4 |
| `appendPolyStrokeRow` | 21830 | function |  | 4 |
| `beginPolyBrushPointer` | 21850 | function |  | 1 |
| `finishPolyAltDelete` | 21936 | function |  | 1 |
| `updatePolyBrushStroke` | 21950 | function |  | 1 |
| `finishPolyBrushStroke` | 22040 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22077 | function |  | 2 |
| `drawSampleFromHit` | 22100 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22114 | function |  | 3 |
| `strokeLength` | 22151 | function |  | 9 |
| `resampleDrawStroke` | 22157 | function |  | 2 |
| `processedDrawStroke` | 22189 | function |  | 8 |
| `strokeSurfaceNormals` | 22218 | function |  | 7 |
| `drawClumpFrame` | 22229 | function |  | 4 |
| `nearestCurveParameter` | 22238 | function |  | 2 |
| `drawClumpSampleNormal` | 22252 | function |  | 6 |
| `drawClumpTemplateVector` | 22261 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22267 | function |  | 3 |
| `drawClumpStrandMaps` | 22283 | function |  | 4 |
| `nextClumpName` | 22338 | function |  | 6 |
| `initializeClumpShape` | 22345 | function |  | 5 |
| `stableClumpVariation` | 22356 | function |  | 3 |
| `createClumpFromLocks` | 22368 | function |  | 7 |
| `addLockToClump` | 22393 | function |  | 4 |
| `stableBranchBaseNormals` | 22411 | function |  | 4 |
| `ensureBranchParentNormalField` | 22422 | function |  | 2 |
| `branchParentFrame` | 22428 | function |  | 7 |
| `branchLocalVector` | 22440 | function |  | 3 |
| `branchWorldVector` | 22444 | function |  | 4 |
| `captureBranchLocalState` | 22450 | function |  | 6 |
| `enforceBranchRootPosition` | 22478 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22528 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22555 | function |  | 2 |
| `clampRegionParam` | 22602 | function |  | 113 |
| `branchRootRegionFromParam` | 22609 | function |  | 4 |
| `cloneBranchRootRegion` | 22632 | function |  | 5 |
| `flip` | 22634 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22667 | function |  | 8 |
| `setBranchRootRegionPoint` | 22698 | function |  | 3 |
| `branchRegionUVToCanvas` | 22734 | function |  | 10 |
| `branchRegionCanvasToUV` | 22737 | function |  | 4 |
| `openBranchRegionEditor` | 22743 | function |  | 2 |
| `closeBranchRegionEditor` | 22757 | function |  | 2 |
| `retargetBranchRegionEditor` | 22763 | function |  | 2 |
| `renderBranchRegionEditor` | 22768 | function |  | 9 |
| `applyBranchRegionView` | 22856 | function |  | 6 |
| `resetBranchRegionZoom` | 22859 | function |  | 1 |
| `branchRegionNavAction` | 22865 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22879 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22899 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22903 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22929 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22941 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22946 | function |  | 1 |
| `branchRegionEventUV` | 22966 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22974 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23079 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23212 | function |  | 1 |
| `pointerToNdc` | 23217 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23228 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23242 | function |  | 1 |
| `endBranchSweepStartDrag` | 23265 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23272 | function |  | 5 |
| `gridProfileSkipCol` | 23299 | function |  | 3 |
| `branchRootRegionSurface` | 23308 | function |  | 6 |
| `toGridCol` | 23333 | arrow |  | 5 |
| `toRow` | 23337 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23392 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23412 | function |  | 2 |
| `pointAt` | 23418 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23445 | function |  | 3 |
| `applyBranchRootOffset` | 23517 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23536 | function |  | 3 |
| `branchChildrenFor` | 23556 | function |  | 9 |
| `detachBranch` | 23560 | function |  | 2 |
| `updateBranchChildren` | 23571 | function |  | 4 |
| `clumpDirectMembers` | 23614 | function |  | 3 |
| `clumpMembersForGuide` | 23619 | function |  | 6 |
| `clumpGuideForLock` | 23623 | function |  | 13 |
| `proceduralGuideForLock` | 23628 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23635 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23642 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23649 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23661 | function |  | 2 |
| `applyProceduralBranchSettings` | 23674 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23713 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23729 | function |  | 3 |
| `createProceduralAccessoryLock` | 23743 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23795 | function |  | 2 |
| `clumpFrameAt` | 23846 | function |  | 5 |
| `commitClumpMemberRestState` | 23854 | function |  | 10 |
| `updateClumpMembers` | 23937 | function |  | 10 |
| `dissolveClump` | 24041 | function |  | 6 |
| `detachLockFromClump` | 24078 | function |  | 4 |
| `updateDrawVolumePreview` | 24104 | function |  | 5 |
| `hideDrawClumpPreviews` | 24128 | function |  | 5 |
| `resetDrawVolumePreview` | 24134 | function |  | 3 |
| `updateDrawStrandPreview` | 24140 | function |  | 23 |
| `continueFromTipEnabled` | 24359 | function |  | 2 |
| `selectedTipContinuationLock` | 24365 | function |  | 3 |
| `selectedDrawBranchPoint` | 24378 | function |  | 3 |
| `canBranchDrawFromLock` | 24395 | function |  | 3 |
| `beginDrawStrandStroke` | 24402 | function |  | 2 |
| `beginDrawFreePlane` | 24527 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24541 | function |  | 2 |
| `updateDrawStrandStroke` | 24566 | function |  | 1 |
| `createDrawnLock` | 24612 | function |  | 3 |
| `setting` | 24616 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24684 | function |  | 4 |
| `createDrawnBraid` | 24692 | function |  | 2 |
| `createDrawnStrand` | 24749 | function |  | 2 |
| `createDrawnPanel` | 24876 | function |  | 2 |
| `surfaceLatticeNormal` | 24926 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24941 | function |  | 3 |
| `createViewportSurface` | 25006 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25035 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25041 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25048 | function |  | 4 |
| `updateLoftSurfacePreview` | 25057 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25089 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25105 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25123 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25145 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25171 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25181 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25185 | function |  | 2 |
| `curveSurfacePreviewLock` | 25194 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25217 | function |  | 2 |
| `hideCurveSurfacePreview` | 25233 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25245 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25250 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25259 | function |  | 3 |
| `curveSurfaceSideVector` | 25297 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25310 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25318 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25331 | function |  | 5 |
| `updateCurveSurfacePreview` | 25351 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25413 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25435 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25450 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25498 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25533 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25565 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25623 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25700 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25705 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25714 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25748 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25759 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25789 | function |  | 2 |
| `extendDrawnStrand` | 25846 | function |  | 2 |
| `finishDrawStrandStroke` | 25879 | function |  | 7 |
| `createPlacedStrand` | 25906 | function |  | 2 |
| `placedPointCount` | 25970 | function |  | 3 |
| `createPlacedPoints` | 25974 | function |  | 3 |
| `pushPointOutsideHead` | 25993 | function |  | 8 |
| `resizePlacedStrand` | 26025 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26042 | function |  | 5 |
| `beginPlaceEdit` | 26047 | function |  | 2 |
| `updatePlaceEdit` | 26065 | function |  | 1 |
| `updatePlacementLength` | 26079 | function |  | 3 |
| `updatePlacementOrientation` | 26089 | function |  | 3 |
| `endPlaceEdit` | 26107 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26122 | function |  | 1 |
| `pendingPlacedLock` | 26132 | function |  | 2 |
| `beginPlacementPointer` | 26136 | function |  | 3 |
| `finishPlacementPointer` | 26146 | function |  | 2 |
| `confirmPlacementStep` | 26170 | function |  | 2 |
| `finishPlacementFlow` | 26193 | function |  | 7 |
| `updatePlacementStatus` | 26206 | function |  | 83 |
| `deselectStrands` | 26345 | function |  | 12 |
| `beginSelectionMarquee` | 26360 | function |  | 3 |
| `beginAltOrbit` | 26384 | function |  | 1 |
| `beginBlenderNavigation` | 26396 | function |  | 1 |
| `endBlenderNavigation` | 26441 | function |  | 1 |
| `prepareSelectPointerCapture` | 26449 | function |  | 1 |
| `endSelectPointerCapture` | 26455 | function |  | 1 |
| `endAltOrbit` | 26461 | function |  | 1 |
| `dollyCameraByDrag` | 26468 | function |  | 2 |
| `fastDragMagnitude` | 26491 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26497 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26505 | function |  | 1 |
| `endHoudiniZoomDrag` | 26522 | function |  | 1 |
| `updateSelectionMarquee` | 26530 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26547 | function |  | 3 |
| `selectPointsInMarquee` | 26555 | function |  | 2 |
| `pointKey` | 26581 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26612 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26649 | function |  | 3 |
| `projectedPoint` | 26666 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26695 | function |  | 2 |
| `finishSelectionMarquee` | 26740 | function |  | 2 |
| `headMeshes` | 26763 | function |  | 9 |
| `strandSplitProfileData` | 26771 | function |  | 4 |
| `strandSplitControlPoint` | 26784 | function |  | 4 |
| `panelSplitControlPoint` | 26820 | function |  | 6 |
| `strandControlPointRaycast` | 26876 | function |  | 1 |
| `strandControlPointFrame` | 26911 | function |  | 6 |
| `branchRootGizmoFrame` | 26942 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26960 | function |  | 5 |
| `createCurveObjects` | 27018 | function |  | 4 |
| `polyEdgeKey` | 27191 | function |  | 2 |
| `polyMeshEdges` | 27195 | function |  | 2 |
| `populatePolyEditObjects` | 27209 | function |  | 3 |
| `createPolyEditObjects` | 27270 | function |  | 2 |
| `rebuildPolyEditObjects` | 27278 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27292 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27299 | function |  | 2 |
| `strandWidthEdgeSample` | 27308 | function |  | 3 |
| `strandWidthEdgePoints` | 27331 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27345 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27349 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27356 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27368 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27373 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27379 | function |  | 3 |
| `updateCurveObjects` | 27393 | function |  | 41 |
| `createCurveNormalIndicator` | 27650 | function |  | 2 |
| `pointUpDirection` | 27676 | function |  | 2 |
| `curveFrameAtPoint` | 27680 | function |  | 5 |
| `curveFrameAt` | 27701 | function |  | 10 |
| `strandTwistAt` | 27721 | function |  | 6 |
| `controlPointRotationAt` | 27726 | function |  | 6 |
| `strandProfileTwistAt` | 27730 | function |  | 2 |
| `strandFrameAt` | 27736 | function |  | 1 |
| `curveFrameAtSnapshot` | 27742 | function |  | 3 |
| `outwardNormalAtPoint` | 27761 | function |  | 11 |
| `sampledSurfaceNormal` | 27773 | function |  | 2 |
| `guidedNormalAt` | 27789 | function |  | 5 |
| `twistFromHandle` | 27808 | function |  | 3 |
| `signedAngleAroundAxis` | 27829 | function |  | 5 |
| `handleColor` | 27836 | function |  | 2 |
| `isAffectedCurvePoint` | 27859 | function |  | 2 |
| `syncLockFromCurve` | 27865 | function |  | 26 |
| `labelForPreset` | 27895 | function |  | 1 |
| `rebuildLockGeometry` | 27899 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27926 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27934 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27940 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27962 | function |  | 8 |
| `updateLockGeometry` | 27975 | function |  | 57 |
| `setGroupColorView` | 27996 | function |  | 2 |
| `createUvCheckerTexture` | 28006 | function |  | 3 |
| `ensureUvCheckerForLock` | 28042 | function |  | 4 |
| `removeUvCheckerFromLock` | 28075 | function |  | 3 |
| `invalidateUvInspector` | 28090 | function |  | 7 |
| `uvInspectorRecord` | 28094 | function |  | 1 |
| `uvInspectorRecords` | 28133 | function |  | 2 |
| `drawUvInspectorGrid` | 28137 | function |  | 2 |
| `renderUvInspector` | 28171 | function |  | 3 |
| `setUvCheckerEnabled` | 28230 | function |  | 3 |
| `strandViewportBaseColor` | 28247 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28282 | function |  | 3 |
| `syncStrandSelectionOutline` | 28288 | function |  | 2 |
| `applyLockedStrandPalette` | 28299 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28308 | function |  | 6 |
| `setStrandSelectionVisual` | 28317 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28333 | function |  | 2 |
| `syncProceduralParentVisibility` | 28340 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28349 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28353 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28357 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28370 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28390 | function |  | 3 |
| `selectLock` | 28423 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28476 | function |  | 6 |
| `syncGroupInputs` | 28487 | function |  | 3 |
| `topologyStatsForLock` | 28520 | function |  | 4 |
| `formatTopologyStats` | 28528 | function |  | 5 |
| `updateTopologyStats` | 28532 | function |  | 20 |
| `normalizeBraidDimensions` | 28566 | function |  | 4 |
| `normalizeStrandDimensions` | 28579 | function |  | 3 |
| `strandBaseWidth` | 28593 | function |  | 5 |
| `strandWidthDimension` | 28597 | function |  | 5 |
| `strandDepthDimension` | 28605 | function |  | 8 |
| `setStrandWidthDimension` | 28613 | function |  | 2 |
| `setStrandDepthDimension` | 28635 | function |  | 4 |
| `syncShapeDimensionInputs` | 28651 | function |  | 4 |
| `syncCreationShapeInputs` | 28687 | function |  | 5 |
| `syncViewportDrawSettings` | 28725 | function |  | 5 |
| `syncPanelShapeInputs` | 28739 | function |  | 6 |
| `syncStrandSplitInputs` | 28765 | function |  | 4 |
| `syncHairCardControls` | 28774 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28782 | function |  | 3 |
| `updateAttributeEditorMode` | 28821 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28971 | function |  | 3 |
| `curveLatticeForGroup` | 28994 | function |  | 2 |
| `filterCurveLatticesToGroup` | 29012 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29057 | function |  | 2 |
| `showCurveLatticeForGroup` | 29074 | function |  | 2 |
| `selectStrandGroup` | 29111 | function |  | 3 |
| `selectCurvePoint` | 29153 | function |  | 10 |
| `updateSelectedPointLabel` | 29167 | function |  | 14 |
| `syncInputs` | 29180 | function |  | 16 |
| `syncClumpGuidePanel` | 29226 | function |  | 3 |
| `getSelectedLock` | 29253 | function |  | 105 |
| `selectedLocksInOrder` | 29257 | function |  | 37 |
| `lockStrands` | 29263 | function |  | 3 |
| `lockSelectedStrands` | 29296 | function |  | 3 |
| `unlockStrands` | 29302 | function |  | 3 |
| `unlockAllStrands` | 29317 | function |  | 3 |
| `strandEditFamily` | 29321 | function |  | 7 |
| `compatibleSelectedLocks` | 29326 | function |  | 6 |
| `selectedEditRoots` | 29333 | function |  | 2 |
| `editSelectedLocks` | 29346 | function |  | 21 |
| `multiEditValuesEqual` | 29379 | function |  | 2 |
| `setMixedControl` | 29388 | function |  | 28 |
| `syncMultiStrandInputs` | 29405 | function |  | 16 |
| `values` | 29421 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29501 | function |  | 5 |
| `createCompoundStrand` | 29508 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29569 | function |  | 9 |
| `openRebuildCurveDialog` | 29582 | function |  | 1 |
| `rebuildSelectedCurves` | 29596 | function |  | 2 |
| `selectionCanBecomeClump` | 29635 | function |  | 4 |
| `createClumpFromSelection` | 29640 | function |  | 3 |
| `cleanSelectionSets` | 29652 | function |  | 2 |
| `createSelectionSetFromSelection` | 29657 | function |  | 3 |
| `selectionSetById` | 29668 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29672 | function |  | 7 |
| `editSelectionSetFromSelection` | 29681 | function |  | 5 |
| `deleteSelectionSet` | 29701 | function |  | 2 |
| `selectSelectionSet` | 29710 | function |  | 2 |
| `deleteSelectedStrands` | 29720 | function |  | 4 |
| `deleteGuide` | 29728 | function |  | 3 |
| `deleteSelectedGuide` | 29751 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29755 | function |  | 4 |
| `hasDeletableSelection` | 29768 | function |  | 2 |
| `deleteCurrentSelection` | 29776 | function |  | 3 |
| `hideOutlinerContextMenu` | 29784 | function |  | 17 |
| `outlinerLockTargets` | 29789 | function |  | 3 |
| `showOutlinerContextMenu` | 29816 | function |  | 10 |
| `hideStrandRadialMenu` | 29896 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29907 | function |  | 3 |
| `radialButtonDimensions` | 29920 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29929 | function |  | 3 |
| `applyRadialMenuDimensions` | 29946 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29952 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29965 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29986 | function |  | 2 |
| `selectionSetRadialMenuOption` | 30003 | function |  | 4 |
| `selectedMirrorRadialOptions` | 30012 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30034 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30052 | function |  | 2 |
| `contextualRadialOptions` | 30059 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30188 | function |  | 3 |
| `layoutContextualRadialOptions` | 30192 | function |  | 4 |
| `renderRadialActionList` | 30216 | function |  | 3 |
| `radialListOptionAtPointer` | 30234 | function |  | 3 |
| `syncRadialListHighlight` | 30256 | function |  | 3 |
| `configureContextualRadialMenu` | 30262 | function |  | 3 |
| `beginStrandRadialGesture` | 30322 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30356 | function |  | 2 |
| `updateStrandRadialGesture` | 30402 | function |  | 1 |
| `performStrandRadialAction` | 30441 | function |  | 2 |
| `finishStrandRadialGesture` | 30544 | function |  | 2 |
| `cancelStrandRadialGesture` | 30554 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30561 | function |  | 1 |
| `setPullMoveEnabled` | 30567 | function |  | 3 |
| `toolRadialOptions` | 30575 | function |  | 2 |
| `hideToolRadialMenu` | 30600 | function |  | 4 |
| `beginToolRadialGesture` | 30613 | function |  | 2 |
| `beginToolShortcutPress` | 30653 | function |  | 2 |
| `finishToolShortcutPress` | 30668 | function |  | 2 |
| `cancelToolShortcutPress` | 30677 | function |  | 5 |
| `setRadialMenusEnabled` | 30685 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30698 | function |  | 5 |
| `setNavigationTipsEnabled` | 30713 | function |  | 5 |
| `configureNavigationMouseButtons` | 30720 | function |  | 3 |
| `syncNavigationModifierLocks` | 30733 | function |  | 7 |
| `setNavigationStyle` | 30738 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30754 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30769 | function |  | 5 |
| `setCameraSmoothingStrength` | 30775 | function |  | 5 |
| `setScaleSensitivity` | 30783 | function |  | 3 |
| `setToolTipsEnabled` | 30791 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30798 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30807 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30815 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30830 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30839 | function |  | 5 |
| `sideNamingDisplayId` | 30848 | function |  | 3 |
| `referenceViewDisplayLabel` | 30860 | function |  | 6 |
| `strandRegionDisplayLabel` | 30870 | function |  | 10 |
| `updateSideNamingLabels` | 30888 | function |  | 2 |
| `setSideNamingPerspective` | 30915 | function |  | 5 |
| `setControlPointDisplaySize` | 30924 | function |  | 6 |
| `scaleHexColor` | 30936 | function |  | 3 |
| `setViewportBackgroundColor` | 30941 | function |  | 7 |
| `setDefaultHairShader` | 30963 | function |  | 5 |
| `setPreferenceCategory` | 30969 | function |  | 4 |
| `openPreferencesDialog` | 30996 | function |  | 1 |
| `savePreferencesDialog` | 31024 | function |  | 1 |
| `cancelPreferencesDialog` | 31048 | function |  | 3 |
| `updateToolRadialGesture` | 31077 | function |  | 1 |
| `performToolRadialAction` | 31106 | function |  | 2 |
| `finishToolRadialGesture` | 31116 | function |  | 2 |
| `cancelToolRadialGesture` | 31125 | function |  | 5 |
| `duplicatePlacementTarget` | 31132 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31159 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31163 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31173 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31178 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31190 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31201 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31209 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31226 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31247 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31258 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31264 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31270 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31303 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31458 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31560 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31601 | function |  | 2 |
| `updateDuplicatePlacement` | 31628 | function |  | 2 |
| `beginDuplicatePlacement` | 31692 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31756 | function |  | 2 |
| `confirmDuplicatePlacement` | 31797 | function |  | 1 |
| `cancelDuplicatePlacement` | 31834 | function |  | 4 |
| `outlinerClumpLocks` | 31860 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31864 | function |  | 3 |
| `createOutlinerStrandButton` | 31887 | function |  | 4 |
| `createOutlinerCurveSurface` | 31973 | function |  | 2 |
| `createOutlinerClump` | 32069 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32151 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32158 | function |  | 2 |
| `renderLockList` | 32237 | function |  | 70 |
| `updateCount` | 32391 | function |  | 34 |
| `captureInputUndo` | 32400 | function |  | 1 |
| `bindUndoCapture` | 32406 | function |  | 36 |
| `bindLockInput` | 32417 | function |  | 2 |
| `applyValue` | 32434 | arrow |  | 2 |
| `applyUniformTransformScale` | 32753 | function |  | 2 |
| `applyReducedTransformScale` | 32770 | function |  | 2 |
| `applyTransformPrecision` | 32809 | function |  | 2 |
| `updateTransformScalePointer` | 32838 | function |  | 1 |
| `finishSweepProfileDrag` | 33069 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33165 | function |  | 3 |
| `finishTaperCurveDrag` | 33227 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33270 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33351 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33406 | function |  | 6 |
| `updateSelectedTaperPoint` | 33430 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 34002 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 34007 | function |  | 4 |
| `syncDrawCurlControls` | 34062 | function |  | 5 |
| `handleLiveSurfaceChange` | 34110 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34192 | function |  | 3 |
| `resampleSurfaceLock` | 34207 | function |  | 2 |
| `changePanelSplitCount` | 34320 | function |  | 3 |
| `presetNumber` | 34424 | function |  | 23 |
| `clonePresetShape` | 34429 | function |  | 7 |
| `creationPresetSnapshot` | 34438 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34486 | function |  | 5 |
| `applyPresetControl` | 34513 | function |  | 2 |
| `applyCreationToolSettings` | 34534 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34575 | function |  | 3 |
| `loadCustomCreationPresets` | 34582 | function |  | 2 |
| `saveCustomCreationPresets` | 34592 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34600 | function |  | 2 |
| `populateCreationPresetSelect` | 34636 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34660 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34693 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34698 | function |  | 2 |
| `applyCustomCreationPreset` | 34715 | function |  | 3 |
| `createCustomCreationPreset` | 34739 | function |  | 3 |
| `createCustomClumpPreset` | 34754 | function |  | 3 |
| `commitCustomCreationPreset` | 34769 | function |  | 2 |
| `openRemoveCreationPreset` | 34830 | function |  | 3 |
| `commitRemoveCreationPreset` | 34843 | function |  | 1 |
| `applyBraidToolPreset` | 34860 | function |  | 2 |
| `selectedBranchChildLock` | 34972 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34976 | function |  | 2 |
| `initPanelResizeHandles` | 35082 | function |  | 2 |
| `applyWidth` | 35088 | arrow |  | 2 |
| `restoreWidth` | 35095 | arrow |  | 2 |
| `bindResize` | 35103 | arrow |  | 2 |
| `onMove` | 35111 | arrow |  | 0 |
| `onUp` | 35115 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35132 | function |  | 2 |
| `initFloatingPanelControls` | 35141 | function |  | 2 |
| `detach` | 35150 | arrow |  | 43 |
| `endDrag` | 35188 | arrow |  | 0 |
| `endResize` | 35220 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35231 | function |  | 3 |
| `selectPatchNotesVersion` | 35365 | function |  | 3 |
| `requestReferenceImage` | 35398 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35602 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35608 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35615 | function |  | 1 |
| `deleteLocks` | 36182 | function |  | 10 |
| `disposeCurveObjects` | 36260 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36312 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36343 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36418 | function |  | 2 |
| `resize` | 36451 | function |  | 4 |
| `handleViewportPointerMove` | 36462 | function |  | 1 |
| `blockProportionalSizingEvent` | 36473 | function |  | 1 |
| `updateLightAngleFromInputs` | 36479 | function |  | 2 |
| `startViewSnap` | 36493 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36523 | function |  | 3 |
| `trackViewportPointerDown` | 36540 | function |  | 1 |
| `trackViewportPointerMove` | 36556 | function |  | 1 |
| `clearViewportPointer` | 36564 | function |  | 1 |
| `updateViewSnap` | 36569 | function |  | 1 |
| `nearestCardinalAxis` | 36605 | function |  | 5 |
| `cardinalAxisKey` | 36619 | function |  | 5 |
| `steppedDragAmount` | 36623 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36629 | function |  | 4 |
| `endViewSnap` | 36645 | function |  | 4 |
| `activateStrandControlPoint` | 36655 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36705 | function |  | 4 |
| `addStrandControlPointSelection` | 36732 | function |  | 3 |
| `removeStrandControlPointSelection` | 36749 | function |  | 3 |
| `sampleStrandPointNormal` | 36763 | function |  | 2 |
| `sampleStrandPointVectors` | 36773 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36779 | function |  | 2 |
| `resampleStrandCurveData` | 36790 | function |  | 4 |
| `resampleMatchingVectors` | 36796 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36835 | function |  | 4 |
| `removeStrandCurvePoint` | 36846 | function |  | 2 |
| `closestStrandCurveParameter` | 36859 | function |  | 2 |
| `insertStrandCurvePoint` | 36888 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36905 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36915 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36931 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36938 | function |  | 4 |
| `prepareCurvePointSelection` | 36960 | function |  | 1 |
| `finishCurvePointInsertion` | 37071 | function |  | 1 |
| `finishPointRemoval` | 37086 | function |  | 1 |
| `editableStrandWidth` | 37104 | function |  | 6 |
| `editableStrandWidthBounds` | 37116 | function |  | 2 |
| `applyEditableStrandWidth` | 37122 | function |  | 3 |
| `viewportPixelPoint` | 37158 | function |  | 3 |
| `syncSculptBrushControls` | 37166 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37181 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37189 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37197 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37203 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37207 | function |  | 7 |
| `updateSculptBrushCursor` | 37214 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37236 | function |  | 4 |
| `sculptBrushEditableLock` | 37243 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37253 | function |  | 5 |
| `sculptBrushLockViable` | 37259 | function |  | 5 |
| `sculptBrushUnits` | 37270 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37309 | function |  | 4 |
| `sculptBrushPointWeight` | 37359 | function |  | 5 |
| `sculptBrushWorldDelta` | 37369 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37378 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37404 | function |  | 2 |
| `beginSculptMoveStroke` | 37462 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37524 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37759 | function |  | 3 |
| `updateSculptMoveStroke` | 37768 | function |  | 1 |
| `finishSculptMoveStroke` | 37784 | function |  | 3 |
| `strandControlPointHit` | 37832 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37836 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37914 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37948 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37988 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 38001 | function |  | 1 |
| `setHoveredControlPoint` | 38041 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38054 | function |  | 2 |
| `updateControlPointHover` | 38090 | function |  | 1 |
| `animate` | 38647 | function |  | 2 |
| `syncCompactSidebarLayout` | 38680 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38699 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38705 | function |  | 3 |
| `setAttributeEditorTab` | 38711 | function |  | 6 |

## modules/branch/branch-store.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchStore` | 15 | function | export | 1 |

## modules/core/app-config.js（92 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

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
