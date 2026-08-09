# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1736** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（36493 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 263 | function |  | 3 |
| `saveBooleanPreference` | 291 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 295 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 300 | function |  | 2 |
| `normalizeScaleSensitivity` | 305 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 310 | function |  | 2 |
| `normalizeSideNamingPerspective` | 315 | function |  | 2 |
| `normalizeNavigationStyle` | 319 | function |  | 2 |
| `setupEditableSliderControls` | 334 | function |  | 2 |
| `syncNumberFromRange` | 385 | arrow |  | 0 |
| `applyNumberValue` | 392 | arrow |  | 0 |
| `copyCameraPose` | 498 | function |  | 3 |
| `updateCameraProjectionForViewport` | 504 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 517 | function |  | 3 |
| `setOrthographicView` | 523 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 563 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 592 | function |  | 2 |
| `removeRotateFreeAxisRing` | 618 | function |  | 2 |
| `deflateTransformGizmoPickers` | 630 | function |  | 2 |
| `nextStrandName` | 1009 | function |  | 2 |
| `activeDrawClumpTemplate` | 1094 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1099 | function |  | 3 |
| `drawModeCreatesClump` | 1126 | function |  | 1 |
| `isPanelGeometry` | 1270 | function |  | 31 |
| `normalizePanelSplits` | 1274 | function |  | 3 |
| `clonePanelSplits` | 1286 | function |  | 19 |
| `snapPanelSplitHeight` | 1290 | function |  | 5 |
| `createQuadSphereGeometry` | 1325 | function |  | 2 |
| `vertexIndex` | 1339 | function |  | 11 |
| `addEdge` | 1357 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1392 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1462 | function |  | 3 |
| `updateScalpRenderGeometry` | 1488 | function |  | 4 |
| `writeScalpRegionColors` | 1539 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1552 | function |  | 2 |
| `createScalpSelectionOutline` | 1582 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1624 | function |  | 25 |
| `activeScalpSurfaceWire` | 1629 | function |  | 2 |
| `activeScalpSelectionOutline` | 1634 | function |  | 2 |
| `inferredCustomScalpRegion` | 1639 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1646 | function |  | 5 |
| `customScalpGeometryFromObject` | 1665 | function |  | 2 |
| `customScalpWireGeometry` | 1697 | function |  | 3 |
| `installCustomScalpGeometry` | 1708 | function |  | 3 |
| `installCustomScalpGuide` | 1732 | function |  | 3 |
| `setScalpGuideSource` | 1750 | function |  | 7 |
| `updateScalpQuadWire` | 1766 | function |  | 4 |
| `updateScalpTopology` | 1782 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1846 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2026 | function |  | 2 |
| `currentStrandSelectionState` | 2088 | function |  | 4 |
| `applyStrandSelectionState` | 2092 | function |  | 5 |
| `clearStrandSelectionState` | 2097 | function |  | 7 |
| `guideHeadBounds` | 3077 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3087 | function |  | 5 |
| `disposeGuideModel` | 3101 | function |  | 3 |
| `syncHeadTransformInputs` | 3112 | function |  | 4 |
| `applyHeadTransform` | 3119 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3137 | function |  | 4 |
| `applyScalpRoughScale` | 3146 | function |  | 5 |
| `resetHeadTransform` | 3160 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3174 | function |  | 2 |
| `installGuideModel` | 3190 | function |  | 5 |
| `loadDefaultGuideModel` | 3266 | function |  | 3 |
| `braidTemplateFromEntries` | 3289 | function |  | 4 |
| `braidMeshEntries` | 3321 | function |  | 2 |
| `prepareBraidBodyCache` | 3333 | function |  | 2 |
| `quantize` | 3342 | arrow |  | 21 |
| `sourceNormalAt` | 3354 | arrow |  | 1 |
| `clusterBoundary` | 3357 | arrow |  | 2 |
| `normalBuckets` | 3374 | arrow |  | 2 |
| `applyBucketPair` | 3406 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3437 | function |  | 2 |
| `annotateBraidObjTopology` | 3458 | function |  | 2 |
| `loadBraidMeshPreset` | 3478 | function |  | 3 |
| `createSplitControlHandle` | 3495 | function |  | 4 |
| `frameGuideModel` | 3510 | function |  | 2 |
| `syncScalpInputs` | 3535 | function |  | 2 |
| `syncScalpArtistInputs` | 3541 | function |  | 2 |
| `rootScalpOffsetDistance` | 3549 | function |  | 15 |
| `applyLockRootScalpOffset` | 3554 | function |  | 5 |
| `normalizeHairLayer` | 3570 | function |  | 27 |
| `layerOffsetForLock` | 3574 | function |  | 9 |
| `layerRootOffsetFactor` | 3579 | function |  | 13 |
| `layerOffsetWeight` | 3583 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3589 | function |  | 5 |
| `pointsWithLayerOffset` | 3598 | function |  | 3 |
| `layerDirectionForLock` | 3606 | function |  | 2 |
| `applyLayerOffset` | 3617 | function |  | 5 |
| `setLockHairLayer` | 3641 | function |  | 2 |
| `setGroupLayerOffset` | 3656 | function |  | 2 |
| `scalpArtistWeight` | 3668 | function |  | 3 |
| `scalpArtistScalesAt` | 3672 | function |  | 3 |
| `applyScalpArtistShape` | 3682 | function |  | 5 |
| `inverseScalpArtistShape` | 3700 | function |  | 2 |
| `updateScalpSurface` | 3727 | function |  | 3 |
| `setActiveScalpRegion` | 3737 | function |  | 2 |
| `clearScalpRegions` | 3749 | function |  | 2 |
| `scalpHitFromEvent` | 3766 | function |  | 3 |
| `updateScalpBrushCursor` | 3774 | function |  | 4 |
| `paintScalpAt` | 3789 | function |  | 3 |
| `beginScalpPaint` | 3856 | function |  | 2 |
| `updateScalpPaint` | 3865 | function |  | 1 |
| `endScalpPaint` | 3874 | function |  | 2 |
| `createScalpLattice` | 3881 | function |  | 2 |
| `resetScalpLattice` | 3906 | function |  | 1 |
| `updateScalpLatticeObjects` | 3918 | function |  | 7 |
| `quadraticWeights` | 3932 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3937 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3964 | function |  | 3 |
| `selectScalpLatticePoint` | 3979 | function |  | 2 |
| `beginScalpLatticeDrag` | 3994 | function |  | 2 |
| `updateScalpLatticeDrag` | 4012 | function |  | 1 |
| `endScalpLatticeDrag` | 4030 | function |  | 2 |
| `setHeadReferenceTransparency` | 4036 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4046 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4064 | function |  | 3 |
| `trianglePlaneIntersections` | 4072 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4093 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4119 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4129 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4141 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4165 | function |  | 3 |
| `createScalpBuilderPlanes` | 4180 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4212 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4250 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4273 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4285 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4297 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4302 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4314 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4424 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4449 | function |  | 5 |
| `syncEditedScalpSurface` | 4464 | function |  | 4 |
| `ensureEditedScalpSurface` | 4535 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4565 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4650 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4663 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4679 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4689 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4707 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4720 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4727 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4746 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4760 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4801 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4810 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4823 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4844 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4981 | function |  | 2 |
| `scalpTemplateNeighbors` | 4989 | function |  | 2 |
| `smoothScalpVectorField` | 5001 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5015 | function |  | 2 |
| `upperContourCurve` | 5032 | function |  | 4 |
| `hermitePoint` | 5067 | function |  | 2 |
| `curveNetworkSection` | 5078 | function |  | 3 |
| `pointAlongSection` | 5107 | function |  | 3 |
| `longestStitchedContour` | 5113 | function |  | 2 |
| `nodeForPoint` | 5121 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5178 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5188 | function |  | 1 |
| `orderedRange` | 5200 | arrow |  | 3 |
| `clipSegment` | 5223 | arrow |  | 1 |
| `liftedPoint` | 5246 | arrow |  | 5 |
| `boundaryCorner` | 5251 | arrow |  | 4 |
| `surfaceCurveBetween` | 5260 | arrow |  | 1 |
| `addSurfaceConnector` | 5283 | arrow |  | 2 |
| `sideContourAtDepth` | 5351 | arrow |  | 3 |
| `addSurfacePatch` | 5385 | arrow |  | 1 |
| `addCenterBridgePatch` | 5465 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5573 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5608 | function |  | 1 |
| `generatedScalpObjContent` | 5698 | function |  | 2 |
| `generateScalpFromBuilder` | 5712 | function |  | 1 |
| `orderedDepthRange` | 5748 | arrow |  | 7 |
| `resetScalpBuilder` | 5877 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5892 | function |  | 1 |
| `beginScalpBuilderInput` | 5906 | function |  | 2 |
| `updateScalpBuilderStroke` | 5907 | function |  | 1 |
| `finishScalpBuilderStroke` | 5908 | function |  | 2 |
| `setScalpBuilderEditing` | 5910 | function |  | 10 |
| `updateScalpEditingVisibility` | 5944 | function |  | 12 |
| `exitSetupEditors` | 6038 | function |  | 7 |
| `setCapsuleGuideEditing` | 6047 | function |  | 5 |
| `syncAppMenuVisibility` | 6075 | function |  | 3 |
| `closeAppMenus` | 6080 | function |  | 6 |
| `setAppMenuOpen` | 6091 | function |  | 3 |
| `setTurntableActive` | 6098 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6107 | function |  | 9 |
| `selectedReferenceImage` | 6111 | function |  | 20 |
| `normalizeReferenceCrop` | 6117 | function |  | 8 |
| `referenceCropIsFull` | 6125 | function |  | 3 |
| `referencePlaneFrontAxis` | 6130 | function |  | 4 |
| `referencePlanePlacement` | 6139 | function |  | 4 |
| `migratedReferencePlanePosition` | 6154 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6174 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6191 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6207 | function |  | 2 |
| `snappedReferenceImageView` | 6230 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6236 | function |  | 5 |
| `applyReferenceImageRuntime` | 6252 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6295 | function |  | 6 |
| `createReferenceImageRuntime` | 6303 | function |  | 3 |
| `addReferenceImage` | 6372 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6424 | function |  | 3 |
| `disposeReferenceImage` | 6443 | function |  | 2 |
| `clearReferenceImages` | 6447 | function |  | 2 |
| `serializeReferenceImage` | 6454 | function |  | 1 |
| `setReferenceImageType` | 6482 | function |  | 2 |
| `attachReferenceImageTransform` | 6526 | function |  | 6 |
| `selectReferenceImage` | 6540 | function |  | 12 |
| `placeReferencePlane` | 6563 | function |  | 2 |
| `setReferencePlaneInFront` | 6574 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6584 | function |  | 4 |
| `renderReferenceImagePanel` | 6603 | function |  | 20 |
| `setOutlinerTab` | 6650 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6668 | function |  | 4 |
| `componentEditModeActive` | 6672 | function |  | 37 |
| `selectionToolSupportsPicking` | 6676 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6681 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6697 | function |  | 2 |
| `setViewportSelectionMode` | 6727 | function |  | 4 |
| `setViewportEditMode` | 6739 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6781 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6795 | function |  | 8 |
| `outlinerGuides` | 6807 | function |  | 3 |
| `guideOutlinerLabel` | 6814 | function |  | 2 |
| `normalizeOutlinerName` | 6824 | function |  | 4 |
| `beginOutlinerRename` | 6829 | function |  | 2 |
| `finish` | 6840 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6870 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6880 | function |  | 2 |
| `renderGuideOutliner` | 6915 | function |  | 10 |
| `referenceOutlinerGroup` | 6973 | function |  | 2 |
| `renderReferenceOutliner` | 6977 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7094 | function |  | 5 |
| `readReferenceImageFile` | 7099 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7123 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7130 | function |  | 3 |
| `dragContainsReferenceImage` | 7175 | function |  | 3 |
| `setReferenceImageDragActive` | 7186 | function |  | 9 |
| `referenceDropDestination` | 7194 | function |  | 2 |
| `viewportOverlayDropPosition` | 7200 | function |  | 2 |
| `setReferenceDropHover` | 7209 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7227 | function |  | 2 |
| `referenceOverlayAtPointer` | 7247 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7265 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7278 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7324 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7374 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7396 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7407 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7433 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7442 | function |  | 2 |
| `referenceCropCursor` | 7457 | function |  | 3 |
| `updateReferenceCropHandles` | 7463 | function |  | 5 |
| `referenceCropSourcePoint` | 7484 | function |  | 2 |
| `beginReferenceCrop` | 7491 | function |  | 1 |
| `updateReferenceCrop` | 7529 | function |  | 1 |
| `finishReferenceCrop` | 7561 | function |  | 4 |
| `setHeadSetupEditing` | 7579 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7595 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7604 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7614 | function |  | 4 |
| `setScalpGuideVisibility` | 7620 | function |  | 12 |
| `currentGuideViewMode` | 7628 | function |  | 3 |
| `updateGuideViewToggle` | 7636 | function |  | 5 |
| `setGuideViewMode` | 7652 | function |  | 3 |
| `cycleGuideViewMode` | 7663 | function |  | 1 |
| `hideGuideViewContextMenu` | 7668 | function |  | 6 |
| `showGuideViewContextMenu` | 7672 | function |  | 1 |
| `strandPassesDisplayFilters` | 7685 | function |  | 4 |
| `strandVisibleForDisplay` | 7694 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7699 | function |  | 2 |
| `lockedStrandsExist` | 7703 | function |  | 3 |
| `hiddenStrandsExist` | 7707 | function |  | 2 |
| `hideSelectedStrands` | 7711 | function |  | 2 |
| `unhideHiddenStrands` | 7721 | function |  | 2 |
| `strandIsolationActive` | 7730 | function |  | 7 |
| `setStrandIsolation` | 7734 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7746 | function |  | 3 |
| `syncVisibilityParent` | 7757 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7764 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7793 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7800 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7820 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7843 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7851 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7858 | function |  | 9 |
| `setScalpLatticeEditing` | 7869 | function |  | 4 |
| `setScalpShapeEditing` | 7884 | function |  | 9 |
| `setScalpPaintEditing` | 7902 | function |  | 7 |
| `defaultCurveLatticePoints` | 7926 | function |  | 3 |
| `flatCurveLatticePoints` | 7952 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7961 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7985 | function |  | 4 |
| `horizontalValue` | 7990 | arrow |  | 1 |
| `blendedSample` | 8001 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8034 | function |  | 2 |
| `curveLatticeControlPoint` | 8049 | function |  | 9 |
| `circularArcTangent` | 8053 | function |  | 4 |
| `arcLengthTo` | 8084 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8096 | function |  | 3 |
| `sampleHermiteCurve` | 8135 | function |  | 10 |
| `sampleCurveLattice` | 8152 | function |  | 6 |
| `curveLatticeNormal` | 8171 | function |  | 1 |
| `createCurveLatticeGeometry` | 8182 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8211 | function |  | 3 |
| `appendCurve` | 8213 | arrow |  | 4 |
| `sample` | 8215 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8242 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8258 | function |  | 3 |
| `addPicker` | 8260 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8299 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8312 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8316 | function |  | 3 |
| `curveLatticeEditablePoint` | 8334 | function |  | 13 |
| `curveLatticePointSection` | 8341 | function |  | 3 |
| `curveLatticeRestPoint` | 8352 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8358 | function |  | 7 |
| `curveLatticeRootColumns` | 8364 | function |  | 3 |
| `curveTangentsForPoints` | 8371 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8383 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8420 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8446 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8463 | function |  | 3 |
| `resampleGrid` | 8473 | arrow |  | 2 |
| `controlPointIsSelected` | 8500 | function |  | 7 |
| `clearMultiPointSelection` | 8508 | function |  | 9 |
| `createCurveLatticeHandles` | 8512 | function |  | 4 |
| `addCurveLattice` | 8534 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8643 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8674 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8680 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8719 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8740 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8757 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8766 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8773 | function |  | 1 |
| `selectCurveLatticeLoop` | 8792 | function |  | 3 |
| `selectCurveLatticePoint` | 8821 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8836 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8878 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8899 | function |  | 3 |
| `curveLatticeColumnPoints` | 8942 | function |  | 3 |
| `groupCurveControlIndices` | 8951 | function |  | 4 |
| `groupCurveControlPoints` | 8957 | function |  | 2 |
| `updateGroupCurveDisplay` | 8963 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8973 | function |  | 2 |
| `groupCurveDeformationPairs` | 8995 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9002 | function |  | 2 |
| `appendPairs` | 9004 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9015 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9034 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9055 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9074 | function |  | 2 |
| `capsuleGuideCapHeight` | 9108 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9112 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9117 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9121 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9133 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9149 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9155 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9181 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9211 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9265 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9286 | function |  | 7 |
| `vertex` | 9300 | function |  | 3 |
| `addFace` | 9306 | function |  | 3 |
| `addRing` | 9324 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9379 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9389 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9454 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9500 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9513 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9534 | function |  | 3 |
| `capsuleGuidePointDistances` | 9539 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9560 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9580 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9585 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9591 | function |  | 3 |
| `capsuleGuideAccentColor` | 9596 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9601 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9612 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9624 | function |  | 2 |
| `createCapsuleGuideHandles` | 9656 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9679 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9698 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9705 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9721 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9738 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9753 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9790 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9806 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9823 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9829 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9856 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9868 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9887 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9932 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9967 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9981 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9987 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10004 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10015 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10026 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10056 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10066 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10107 | function |  | 3 |
| `createQuadCageGeometry` | 10123 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10147 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10167 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10178 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10231 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10269 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10279 | function |  | 4 |
| `addCapsuleGuide` | 10287 | function |  | 4 |
| `addGuide` | 10356 | function |  | 1 |
| `createGuideGeometry` | 10417 | function |  | 4 |
| `selectGuide` | 10472 | function |  | 17 |
| `updateGuideControlsVisibility` | 10540 | function |  | 10 |
| `updateViewportToolVisibility` | 10557 | function |  | 7 |
| `getSelectedGuide` | 10596 | function |  | 34 |
| `selectedViewportFocusBounds` | 10600 | function |  | 2 |
| `frameViewportBounds` | 10614 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10644 | function |  | 2 |
| `fullSceneFocusBounds` | 10648 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10663 | function |  | 3 |
| `cycleViewportFraming` | 10672 | function |  | 2 |
| `syncGuideInputs` | 10690 | function |  | 5 |
| `updateGuideGeometry` | 10733 | function |  | 3 |
| `sculptBrushToolActive` | 10754 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10758 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10762 | function |  | 3 |
| `effectiveSculptBrushTool` | 10766 | function |  | 13 |
| `updateSculptScaleModeRow` | 10772 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10777 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10799 | function |  | 5 |
| `setActiveTool` | 10808 | function |  | 19 |
| `setDrawStrandMode` | 10946 | function |  | 2 |
| `setObjectSpaceEditing` | 10956 | function |  | 7 |
| `setHierarchyEditing` | 10972 | function |  | 4 |
| `setProportionalEditing` | 10984 | function |  | 5 |
| `beginProportionalSizeEdit` | 11003 | function |  | 3 |
| `updateProportionalSizeEdit` | 11015 | function |  | 2 |
| `endProportionalSizeEdit` | 11026 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11033 | function |  | 2 |
| `refreshProportionalPreview` | 11041 | function |  | 4 |
| `activeBrushSizeInput` | 11051 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11060 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11072 | function |  | 2 |
| `beginBrushSizeDrag` | 11090 | function |  | 1 |
| `updateBrushSizeDrag` | 11117 | function |  | 1 |
| `finishBrushSizeDrag` | 11138 | function |  | 2 |
| `updateInteractionLocks` | 11155 | function |  | 87 |
| `configureTransformControls` | 11166 | function |  | 16 |
| `pullMoveActive` | 11174 | function |  | 9 |
| `updatePullGuideVisual` | 11178 | function |  | 4 |
| `attachTransformForCurvePoint` | 11194 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11218 | function |  | 7 |
| `strandObjectRootIndex` | 11234 | function |  | 3 |
| `strandObjectRoot` | 11243 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11247 | function |  | 2 |
| `attachStrandObjectTransform` | 11252 | function |  | 6 |
| `guideObjectPivot` | 11275 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11286 | function |  | 2 |
| `attachGuideObjectTransform` | 11291 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11310 | function |  | 2 |
| `beginGuideObjectTransform` | 11338 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11345 | function |  | 2 |
| `updateGuideObjectTransform` | 11367 | function |  | 2 |
| `finishGuideObjectTransform` | 11400 | function |  | 2 |
| `clonePlacementFrame` | 11409 | function |  | 2 |
| `cloneOptionalVectors` | 11421 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11425 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11442 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11457 | function |  | 2 |
| `strandObjectTransformOperators` | 11473 | function |  | 4 |
| `transformPoint` | 11481 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11488 | arrow |  | 0 |
| `transformNormal` | 11494 | arrow |  | 10 |
| `transformDirection` | 11504 | arrow |  | 7 |
| `worldMatrixForPivot` | 11516 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11522 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11538 | function |  | 6 |
| `beginStrandObjectTransform` | 11552 | function |  | 2 |
| `updateStrandObjectTransform` | 11590 | function |  | 2 |
| `commitStrandObjectTransform` | 11648 | function |  | 2 |
| `mapPoints` | 11661 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11695 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11709 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11732 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11745 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11760 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11786 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11835 | function |  | 2 |
| `beginHandleEdit` | 11844 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 11897 | function |  | 3 |
| `multiPointHandleEditActive` | 11908 | function |  | 7 |
| `applyMultiMove` | 11912 | function |  | 5 |
| `applyMultiRotate` | 11918 | function |  | 2 |
| `applyMultiScale` | 11927 | function |  | 2 |
| `applyHierarchicalMove` | 11936 | function |  | 3 |
| `applySingleMove` | 11948 | function |  | 5 |
| `applySurfaceLatticeMirror` | 11952 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 11969 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 11978 | function |  | 3 |
| `changed` | 11988 | arrow |  | 1 |
| `applyPullMove` | 12030 | function |  | 3 |
| `pullHeadCollisionContext` | 12038 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12057 | function |  | 2 |
| `applyProportionalMove` | 12080 | function |  | 3 |
| `viewPlaneNormal` | 12091 | function |  | 20 |
| `isCameraInSnappedView` | 12095 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12103 | function |  | 10 |
| `updateViewPlaneGrid` | 12107 | function |  | 14 |
| `setViewPlaneMove` | 12164 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12175 | function |  | 2 |
| `rayFromViewportEvent` | 12183 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12191 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12201 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12212 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12225 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12244 | function |  | 4 |
| `beginViewPlaneMove` | 12251 | function |  | 3 |
| `updateViewPlaneMove` | 12315 | function |  | 1 |
| `endViewPlaneMove` | 12380 | function |  | 7 |
| `applyHierarchicalRotate` | 12399 | function |  | 2 |
| `rotateGuideNormal` | 12406 | arrow |  | 4 |
| `applySingleRotate` | 12444 | function |  | 2 |
| `applyProportionalRotate` | 12448 | function |  | 2 |
| `applyHierarchicalScale` | 12468 | function |  | 2 |
| `applySingleScale` | 12478 | function |  | 2 |
| `applyProportionalScale` | 12482 | function |  | 2 |
| `setPointScale` | 12498 | function |  | 8 |
| `proportionalWeight` | 12507 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12519 | function |  | 5 |
| `strandInfluenceColor` | 12525 | function |  | 13 |
| `beginRelaxEdit` | 12550 | function |  | 3 |
| `updateRelaxEdit` | 12579 | function |  | 1 |
| `endRelaxEdit` | 12639 | function |  | 1 |
| `disposeGuide` | 12649 | function |  | 3 |
| `removeGuideObjects` | 12677 | function |  | 3 |
| `strandRadiusAt` | 12691 | function |  | 5 |
| `strandProfileTopologyAt` | 12708 | function |  | 6 |
| `strandCurveParameters` | 12750 | function |  | 4 |
| `widthProfileAt` | 12760 | arrow |  | 1 |
| `braidFrameAt` | 12798 | function |  | 5 |
| `braidFrameAtExtended` | 12808 | function |  | 2 |
| `createBraidProfileProjector` | 12817 | function |  | 2 |
| `project` | 12833 | arrow |  | 17 |
| `createBraidGeometry` | 12848 | function |  | 2 |
| `deformationAt` | 12883 | function |  | 3 |
| `widthFor` | 12892 | arrow |  | 3 |
| `depthFor` | 12896 | arrow |  | 3 |
| `outputVertex` | 12928 | function |  | 7 |
| `appendAuthoredCap` | 13036 | function |  | 3 |
| `outputCapVertex` | 13043 | arrow |  | 6 |
| `capBoundary` | 13134 | function |  | 3 |
| `strandGeometryCurve` | 13196 | function |  | 12 |
| `strandGeometryFrameAt` | 13222 | function |  | 15 |
| `transportedStrandFrameAt` | 13285 | function |  | 6 |
| `twistOverrideAt` | 13288 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13316 | function |  | 2 |
| `weldPanelGeometryData` | 13352 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13392 | function |  | 3 |
| `surfacePanelPoint` | 13407 | function |  | 3 |
| `createPanelStrandGeometry` | 13430 | function |  | 2 |
| `addQuad` | 13464 | arrow |  | 6 |
| `near` | 13468 | arrow |  | 6 |
| `panelWidthAt` | 13498 | arrow |  | 6 |
| `panelThicknessAt` | 13507 | arrow |  | 6 |
| `panelFrameAt` | 13516 | arrow |  | 1 |
| `rawPanelPoint` | 13534 | arrow |  | 1 |
| `panelPoint` | 13554 | arrow |  | 2 |
| `addPatch` | 13560 | arrow |  | 1 |
| `splitOpening` | 13611 | arrow |  | 2 |
| `uStart` | 13635 | arrow |  | 1 |
| `uEnd` | 13638 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13676 | function |  | 3 |
| `inside` | 13677 | arrow |  | 2 |
| `pushOrientedTriangle` | 13699 | function |  | 7 |
| `triangulatePolygon3D` | 13710 | function |  | 1 |
| `orientedQuadFace` | 13750 | function |  | 2 |
| `createSplitStrandGeometry` | 13758 | function |  | 2 |
| `fusedIndexAt` | 13915 | arrow |  | 0 |
| `createHairCardGeometry` | 13964 | function |  | 2 |
| `createPolyGeometry` | 14063 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14090 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14099 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14146 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14154 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14170 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14179 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14190 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14198 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14208 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14228 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14251 | function |  | 4 |
| `createCompoundStrandGeometry` | 14334 | function |  | 2 |
| `proceduralBranchGeometryLock` | 14585 | function |  | 2 |
| `createHairGeometry` | 14625 | function |  | 6 |
| `createBaseHairGeometry` | 14677 | function |  | 3 |
| `hairMaterialDefinition` | 14795 | function |  | 4 |
| `materialForLock` | 14799 | function |  | 8 |
| `activeHairMaterialDefinition` | 14803 | function |  | 11 |
| `strandDisplayColor` | 14809 | function |  | 14 |
| `setAnimeHairBaseColor` | 14827 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 14840 | function |  | 2 |
| `createHairMaterial` | 14880 | function |  | 5 |
| `createStrandSelectionOutline` | 14922 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 14956 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 14965 | function |  | 6 |
| `refreshMaterialUsers` | 14992 | function |  | 6 |
| `renderHairMaterialOutliner` | 15001 | function |  | 5 |
| `renderHairMaterialOptions` | 15031 | function |  | 3 |
| `syncHairMaterialEditor` | 15041 | function |  | 9 |
| `createProjectHairMaterial` | 15067 | function |  | 3 |
| `deleteActiveHairMaterial` | 15087 | function |  | 2 |
| `createHairTopologyGeometry` | 15105 | function |  | 4 |
| `createHairTopologyOverlay` | 15126 | function |  | 3 |
| `groupDefaultsFor` | 15173 | function |  | 9 |
| `creationToolActive` | 15180 | function |  | 8 |
| `activeCreationShapeDefaults` | 15184 | function |  | 11 |
| `activeStrandShapeTarget` | 15190 | function |  | 5 |
| `curvePolylineLength` | 15194 | function |  | 2 |
| `curvePolylineLengths` | 15202 | function |  | 3 |
| `samplePolylineDistance` | 15210 | function |  | 2 |
| `applyProjectedCurveLength` | 15220 | function |  | 4 |
| `clearRegionLengthBaseline` | 15251 | function |  | 2 |
| `ensureRegionLengthBaseline` | 15258 | function |  | 2 |
| `setGroupLengthScale` | 15266 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 15304 | function |  | 5 |
| `requestGroupDefaultsWarning` | 15336 | function |  | 1 |
| `activeSweepProfile` | 15345 | function |  | 9 |
| `activeSweepProfileTarget` | 15352 | function |  | 6 |
| `trimmedSweepProfile` | 15359 | function |  | 7 |
| `roundedLeft` | 15368 | arrow |  | 1 |
| `roundedRight` | 15374 | arrow |  | 1 |
| `activeProfileOffset` | 15391 | function |  | 4 |
| `mirroredSweepProfileIndex` | 15398 | function |  | 3 |
| `profileToCanvas` | 15415 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 15419 | function |  | 11 |
| `sampleSweepProfile` | 15428 | function |  | 7 |
| `createSweepProfileTopology` | 15449 | function |  | 5 |
| `renderProfilePreview` | 15491 | function |  | 8 |
| `renderHairCardCoveragePath` | 15510 | function |  | 3 |
| `activeTaperTarget` | 15525 | function |  | 15 |
| `twistCurveEditing` | 15532 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 15536 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 15540 | function |  | 7 |
| `proceduralBranchCurveEditing` | 15544 | function |  | 17 |
| `activeTaperCurve` | 15571 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 15582 | function |  | 6 |
| `taperSamples` | 15592 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 15599 | function |  | 2 |
| `renderTaperPreview` | 15621 | function |  | 13 |
| `renderTwistCurvePreview` | 15657 | function |  | 5 |
| `shapeTargetForSelect` | 15677 | function |  | 3 |
| `setupShapePresetControls` | 15687 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 15712 | function |  | 3 |
| `syncShapePresetSelects` | 15718 | function |  | 7 |
| `populateShapePresetSelects` | 15739 | function |  | 5 |
| `openSaveShapePreset` | 15767 | function |  | 2 |
| `commitCustomShapePreset` | 15792 | function |  | 2 |
| `openRemoveShapePreset` | 15815 | function |  | 2 |
| `commitRemoveShapePreset` | 15828 | function |  | 2 |
| `taperPointToCanvas` | 15844 | function |  | 4 |
| `canvasToTaperPoint` | 15861 | function |  | 2 |
| `clearTaperMeshPoints` | 15897 | function |  | 2 |
| `taperMeshPointFrame` | 15907 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 15917 | function |  | 4 |
| `twistMeshGraphAxis` | 15925 | function |  | 4 |
| `addTwistMeshCurvePath` | 15929 | function |  | 2 |
| `appendSegment` | 15950 | arrow |  | 1 |
| `appendFill` | 15953 | arrow |  | 1 |
| `appendSignedSection` | 15959 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16008 | function |  | 6 |
| `updateTaperMeshPoints` | 16045 | function |  | 5 |
| `setTaperMeshPointsVisible` | 16124 | function |  | 5 |
| `renderTaperCurveEditor` | 16142 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 16214 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 16228 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 16244 | function |  | 2 |
| `scheduleTaperCurveEdit` | 16276 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 16285 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 16296 | function |  | 2 |
| `applyTaperCurveEdit` | 16304 | function |  | 10 |
| `openTaperCurveEditor` | 16412 | function |  | 3 |
| `closeTaperCurveEditor` | 16457 | function |  | 5 |
| `updateViewportStatsVisibility` | 16470 | function |  | 6 |
| `canvasToProfile` | 16489 | function |  | 2 |
| `renderSweepProfileEditor` | 16499 | function |  | 7 |
| `applySweepProfileEdit` | 16542 | function |  | 8 |
| `openSweepProfileEditor` | 16569 | function |  | 1 |
| `closeSweepProfileEditor` | 16604 | function |  | 2 |
| `retargetFloatingStrandEditors` | 16613 | function |  | 2 |
| `addLock` | 16628 | function |  | 19 |
| `mirroredScalpRegion` | 16831 | function |  | 5 |
| `mirroredVector` | 16840 | function |  | 12 |
| `mirroredPlacementFrame` | 16844 | function |  | 2 |
| `mirrorPartnerFor` | 16857 | function |  | 40 |
| `decoupleMirrorPartner` | 16861 | function |  | 2 |
| `createMirrorPartner` | 16869 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 16965 | function |  | 6 |
| `mirroredClumpPartners` | 16970 | function |  | 6 |
| `createMirroredClump` | 16976 | function |  | 3 |
| `decoupleMirroredClump` | 16998 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17017 | function |  | 6 |
| `syncActiveMirror` | 17182 | function |  | 25 |
| `setMirrorXEditing` | 17194 | function |  | 6 |
| `snapshotState` | 17218 | function |  | 7 |
| `scalpTriangleRegion` | 17475 | function |  | 4 |
| `closestPointOnActiveScalp` | 17488 | function |  | 12 |
| `rootAttachmentFrame` | 17560 | function |  | 3 |
| `rootAttachmentLocalFrame` | 17572 | function |  | 4 |
| `resolveRootAttachment` | 17590 | function |  | 4 |
| `curvePointsToRootLocal` | 17630 | function |  | 2 |
| `curvePointsFromRootLocal` | 17642 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 17650 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 17666 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 17696 | function |  | 2 |
| `createRootAttachment` | 17708 | function |  | 9 |
| `syncRootAttachmentMetadata` | 17738 | function |  | 4 |
| `rootAttachmentToData` | 17765 | function |  | 2 |
| `rootAttachmentFromData` | 17793 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 17832 | function |  | 2 |
| `remapPoint` | 17847 | arrow |  | 1 |
| `remapVector` | 17848 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 17877 | function |  | 2 |
| `importHeadMeshFile` | 17894 | function |  | 3 |
| `importFullBodyMeshFile` | 17917 | function |  | 3 |
| `downloadPreferencesAndPresets` | 17942 | function |  | 1 |
| `importedBooleanPreference` | 17975 | function |  | 11 |
| `loadPreferencesAndPresets` | 17989 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18059 | function |  | 1 |
| `openHairProjectFile` | 18102 | function |  | 4 |
| `dragContainsApplicationFile` | 18160 | function |  | 3 |
| `safelyRememberRecentProject` | 18169 | function |  | 2 |
| `renderRecentProjectsMenu` | 18178 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 18210 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 18235 | function |  | 2 |
| `confirmDroppedApplicationFile` | 18239 | function |  | 2 |
| `pushUndoState` | 18255 | function |  | 116 |
| `undoLastAction` | 18262 | function |  | 2 |
| `redoLastAction` | 18276 | function |  | 2 |
| `updateHistoryButtons` | 18290 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 18295 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 18312 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 18319 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 18357 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 18434 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 18460 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 18492 | function |  | 2 |
| `finalizeStateRestore` | 18533 | function |  | 2 |
| `restoreState` | 18540 | function |  | 5 |
| `disposeAllEditableObjects` | 18564 | function |  | 2 |
| `restoreLock` | 18585 | function |  | 4 |
| `restoreGuide` | 18802 | function |  | 2 |
| `vectorToData` | 18863 | function |  | 29 |
| `dataToVector` | 18867 | function |  | 31 |
| `frameToData` | 18871 | function |  | 2 |
| `frameFromData` | 18883 | function |  | 2 |
| `applyPresetSelection` | 18895 | function |  | 2 |
| `drawPresetThumbnail` | 18926 | function |  | 1 |
| `fillHair` | 18941 | arrow |  | 9 |
| `strand` | 18953 | arrow |  | 31 |
| `bun` | 18971 | arrow |  | 2 |
| `braid` | 19006 | arrow |  | 2 |
| `renderPresetLibrary` | 19095 | function |  | 3 |
| `setPresetLibraryOpen` | 19154 | function |  | 6 |
| `average` | 19167 | function |  | 4 |
| `fitPointAttributes` | 19171 | function |  | 9 |
| `rebuildCurveObjects` | 19200 | function |  | 10 |
| `createCurvePoints` | 19212 | function |  | 2 |
| `addGeneratedBangPreset` | 19221 | function |  | 1 |
| `sampleScalpQuad` | 19314 | function |  | 4 |
| `createLongLayeredCurlPoints` | 19338 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 19387 | function |  | 1 |
| `columns` | 19388 | arrow |  | 1 |
| `layer` | 19392 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 19606 | function |  | 2 |
| `addBraidedBobPreset` | 19642 | function |  | 1 |
| `evenColumns` | 19643 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 19859 | function |  | 1 |
| `scalpSeed` | 19882 | arrow |  | 1 |
| `createBowlCutPoints` | 20169 | function |  | 2 |
| `addBowlCutPreset` | 20207 | function |  | 1 |
| `scalpRegionAtHit` | 20273 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 20285 | function |  | 6 |
| `selectedCurveLatticeGuide` | 20292 | function |  | 12 |
| `braidStrokeActive` | 20299 | function |  | 9 |
| `proceduralDrawActive` | 20303 | function |  | 3 |
| `panelStrokeActive` | 20307 | function |  | 6 |
| `activeStrokeSurfaceInput` | 20311 | function |  | 4 |
| `activeStrokeSurfaceValue` | 20315 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 20319 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 20325 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 20329 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 20333 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 20337 | function |  | 3 |
| `liveSurfaceStrandId` | 20347 | function |  | 4 |
| `liveSurfaceStrand` | 20351 | function |  | 4 |
| `liveSurfaceGuideId` | 20356 | function |  | 3 |
| `guideSupportsLiveSurface` | 20360 | function |  | 2 |
| `liveSurfaceGuide` | 20367 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 20374 | function |  | 12 |
| `activeStrokeScalpOffset` | 20414 | function |  | 4 |
| `activeStrokeBrushSize` | 20420 | function |  | 10 |
| `activeStrokeBrushDepth` | 20426 | function |  | 5 |
| `strokeSurfaceIsContextual` | 20432 | function |  | 7 |
| `contextualPlaneAtOrigin` | 20440 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 20450 | function |  | 13 |
| `worldNormalAtHit` | 20489 | function |  | 6 |
| `selectedPolyMesh` | 20497 | function |  | 10 |
| `addPolyLock` | 20502 | function |  | 2 |
| `ensurePolyMesh` | 20521 | function |  | 3 |
| `polySurfaceSample` | 20525 | function |  | 4 |
| `polyTargetAtEvent` | 20536 | function |  | 6 |
| `refreshPolyMesh` | 20562 | function |  | 10 |
| `ensurePolyFillPreview` | 20571 | function |  | 2 |
| `clearPolyFillPreview` | 20608 | function |  | 17 |
| `polyFillCandidateForEvent` | 20613 | function |  | 3 |
| `showPolyFillPreview` | 20633 | function |  | 2 |
| `updatePolyFillPreview` | 20659 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 20684 | function |  | 5 |
| `fillPolyGap` | 20694 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 20705 | function |  | 2 |
| `projectPolyRelaxPoint` | 20725 | function |  | 2 |
| `removePolyPointAttributes` | 20769 | function |  | 3 |
| `deletePolyComponent` | 20778 | function |  | 2 |
| `addPolyPoint` | 20801 | function |  | 4 |
| `appendPolyStrokeRow` | 20810 | function |  | 4 |
| `beginPolyBrushPointer` | 20830 | function |  | 1 |
| `finishPolyAltDelete` | 20916 | function |  | 1 |
| `updatePolyBrushStroke` | 20930 | function |  | 1 |
| `finishPolyBrushStroke` | 21020 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21057 | function |  | 2 |
| `drawSampleFromHit` | 21080 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21094 | function |  | 3 |
| `strokeLength` | 21131 | function |  | 9 |
| `resampleDrawStroke` | 21137 | function |  | 2 |
| `processedDrawStroke` | 21169 | function |  | 8 |
| `strokeSurfaceNormals` | 21198 | function |  | 7 |
| `drawClumpFrame` | 21209 | function |  | 4 |
| `nearestCurveParameter` | 21218 | function |  | 2 |
| `drawClumpSampleNormal` | 21232 | function |  | 6 |
| `drawClumpTemplateVector` | 21241 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 21247 | function |  | 3 |
| `drawClumpStrandMaps` | 21263 | function |  | 4 |
| `nextClumpName` | 21318 | function |  | 6 |
| `initializeClumpShape` | 21325 | function |  | 5 |
| `stableClumpVariation` | 21336 | function |  | 3 |
| `createClumpFromLocks` | 21348 | function |  | 7 |
| `addLockToClump` | 21373 | function |  | 4 |
| `pointerToNdc` | 21436 | function |  | 1 |
| `gridProfileSkipCol` | 21452 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 21472 | function |  | 3 |
| `branchChildrenFor` | 21492 | function |  | 8 |
| `detachBranch` | 21496 | function |  | 2 |
| `updateBranchChildren` | 21507 | function |  | 4 |
| `clumpDirectMembers` | 21550 | function |  | 3 |
| `clumpMembersForGuide` | 21555 | function |  | 6 |
| `clumpGuideForLock` | 21559 | function |  | 13 |
| `proceduralGuideForLock` | 21564 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 21571 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 21578 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 21585 | function |  | 3 |
| `proceduralBranchWorldPoints` | 21597 | function |  | 2 |
| `applyProceduralBranchSettings` | 21610 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 21649 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 21665 | function |  | 3 |
| `createProceduralAccessoryLock` | 21679 | function |  | 2 |
| `applyProceduralAccessorySettings` | 21731 | function |  | 2 |
| `clumpFrameAt` | 21782 | function |  | 5 |
| `commitClumpMemberRestState` | 21790 | function |  | 10 |
| `updateClumpMembers` | 21873 | function |  | 10 |
| `dissolveClump` | 21977 | function |  | 6 |
| `detachLockFromClump` | 22014 | function |  | 4 |
| `updateDrawVolumePreview` | 22040 | function |  | 5 |
| `hideDrawClumpPreviews` | 22064 | function |  | 5 |
| `resetDrawVolumePreview` | 22070 | function |  | 3 |
| `updateDrawStrandPreview` | 22076 | function |  | 23 |
| `continueFromTipEnabled` | 22295 | function |  | 2 |
| `selectedTipContinuationLock` | 22301 | function |  | 3 |
| `selectedDrawBranchPoint` | 22314 | function |  | 3 |
| `canBranchDrawFromLock` | 22331 | function |  | 3 |
| `beginDrawStrandStroke` | 22338 | function |  | 2 |
| `beginDrawFreePlane` | 22463 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 22477 | function |  | 2 |
| `updateDrawStrandStroke` | 22502 | function |  | 1 |
| `createDrawnLock` | 22548 | function |  | 3 |
| `setting` | 22552 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 22620 | function |  | 4 |
| `createDrawnBraid` | 22628 | function |  | 2 |
| `createDrawnStrand` | 22685 | function |  | 2 |
| `createDrawnPanel` | 22812 | function |  | 2 |
| `surfaceLatticeNormal` | 22862 | function |  | 2 |
| `createSurfaceLockFromLattice` | 22877 | function |  | 3 |
| `createViewportSurface` | 22942 | function |  | 2 |
| `loftSurfaceProfilePoints` | 22971 | function |  | 6 |
| `hideLoftSurfacePreviews` | 22977 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 22984 | function |  | 4 |
| `updateLoftSurfacePreview` | 22993 | function |  | 5 |
| `resetLoftSurfaceDraft` | 23025 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 23041 | function |  | 3 |
| `cloneCurveSurfaceSource` | 23059 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 23081 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 23107 | function |  | 3 |
| `curveSurfaceProfilePoints` | 23117 | function |  | 3 |
| `curveSurfaceProfileNormals` | 23121 | function |  | 2 |
| `curveSurfacePreviewLock` | 23130 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 23153 | function |  | 2 |
| `hideCurveSurfacePreview` | 23169 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 23181 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 23186 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 23195 | function |  | 3 |
| `curveSurfaceSideVector` | 23233 | function |  | 4 |
| `curveSurfaceDraftCurves` | 23246 | function |  | 2 |
| `curveSurfaceFallbackHit` | 23254 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 23267 | function |  | 5 |
| `updateCurveSurfacePreview` | 23287 | function |  | 6 |
| `resetCurveSurfaceDraft` | 23349 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 23371 | function |  | 3 |
| `beginCurveSurfaceStroke` | 23386 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 23434 | function |  | 3 |
| `updateCurveSurfaceStroke` | 23469 | function |  | 1 |
| `finishCurveSurfaceStroke` | 23501 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 23559 | function |  | 2 |
| `commitCurveSurfaceDraft` | 23636 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 23641 | function |  | 8 |
| `beginLoftSurfaceStroke` | 23650 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 23684 | function |  | 2 |
| `updateLoftSurfaceStroke` | 23695 | function |  | 1 |
| `finishLoftSurfaceStroke` | 23725 | function |  | 2 |
| `extendDrawnStrand` | 23782 | function |  | 2 |
| `finishDrawStrandStroke` | 23815 | function |  | 7 |
| `createPlacedStrand` | 23842 | function |  | 2 |
| `placedPointCount` | 23906 | function |  | 3 |
| `createPlacedPoints` | 23910 | function |  | 3 |
| `pushPointOutsideHead` | 23929 | function |  | 8 |
| `resizePlacedStrand` | 23961 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 23978 | function |  | 5 |
| `beginPlaceEdit` | 23983 | function |  | 2 |
| `updatePlaceEdit` | 24001 | function |  | 1 |
| `updatePlacementLength` | 24015 | function |  | 3 |
| `updatePlacementOrientation` | 24025 | function |  | 3 |
| `endPlaceEdit` | 24043 | function |  | 1 |
| `confirmPendingPlacedStrand` | 24058 | function |  | 1 |
| `pendingPlacedLock` | 24068 | function |  | 2 |
| `beginPlacementPointer` | 24072 | function |  | 3 |
| `finishPlacementPointer` | 24082 | function |  | 2 |
| `confirmPlacementStep` | 24106 | function |  | 2 |
| `finishPlacementFlow` | 24129 | function |  | 7 |
| `updatePlacementStatus` | 24142 | function |  | 82 |
| `deselectStrands` | 24281 | function |  | 12 |
| `beginSelectionMarquee` | 24296 | function |  | 3 |
| `beginAltOrbit` | 24320 | function |  | 1 |
| `beginBlenderNavigation` | 24332 | function |  | 1 |
| `endBlenderNavigation` | 24377 | function |  | 1 |
| `prepareSelectPointerCapture` | 24385 | function |  | 1 |
| `endSelectPointerCapture` | 24391 | function |  | 1 |
| `endAltOrbit` | 24397 | function |  | 1 |
| `dollyCameraByDrag` | 24404 | function |  | 2 |
| `fastDragMagnitude` | 24427 | function |  | 2 |
| `beginHoudiniZoomDrag` | 24433 | function |  | 1 |
| `updateHoudiniZoomDrag` | 24441 | function |  | 1 |
| `endHoudiniZoomDrag` | 24458 | function |  | 1 |
| `updateSelectionMarquee` | 24466 | function |  | 1 |
| `pointInsideSelectionMarquee` | 24483 | function |  | 3 |
| `selectPointsInMarquee` | 24491 | function |  | 2 |
| `pointKey` | 24517 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 24548 | function |  | 2 |
| `objectInsideSelectionMarquee` | 24585 | function |  | 3 |
| `projectedPoint` | 24602 | arrow |  | 1 |
| `selectObjectsInMarquee` | 24631 | function |  | 2 |
| `finishSelectionMarquee` | 24676 | function |  | 2 |
| `headMeshes` | 24699 | function |  | 9 |
| `strandSplitProfileData` | 24707 | function |  | 4 |
| `strandSplitControlPoint` | 24720 | function |  | 4 |
| `panelSplitControlPoint` | 24756 | function |  | 6 |
| `strandControlPointRaycast` | 24812 | function |  | 1 |
| `strandControlPointFrame` | 24847 | function |  | 4 |
| `strandControlPointHitFromEvent` | 24879 | function |  | 5 |
| `createCurveObjects` | 24937 | function |  | 4 |
| `polyEdgeKey` | 25110 | function |  | 2 |
| `polyMeshEdges` | 25114 | function |  | 2 |
| `populatePolyEditObjects` | 25128 | function |  | 3 |
| `createPolyEditObjects` | 25189 | function |  | 2 |
| `rebuildPolyEditObjects` | 25197 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 25211 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 25218 | function |  | 2 |
| `strandWidthEdgeSample` | 25227 | function |  | 3 |
| `strandWidthEdgePoints` | 25250 | function |  | 2 |
| `sculptBrushDebugRaycast` | 25264 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 25268 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 25275 | function |  | 3 |
| `refreshSculptBrushDebugView` | 25287 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 25292 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 25298 | function |  | 3 |
| `updateCurveObjects` | 25312 | function |  | 35 |
| `createCurveNormalIndicator` | 25569 | function |  | 2 |
| `pointUpDirection` | 25595 | function |  | 2 |
| `curveFrameAtPoint` | 25599 | function |  | 5 |
| `curveFrameAt` | 25620 | function |  | 4 |
| `strandTwistAt` | 25640 | function |  | 6 |
| `controlPointRotationAt` | 25645 | function |  | 4 |
| `strandProfileTwistAt` | 25649 | function |  | 2 |
| `strandFrameAt` | 25655 | function |  | 1 |
| `curveFrameAtSnapshot` | 25661 | function |  | 3 |
| `outwardNormalAtPoint` | 25680 | function |  | 11 |
| `sampledSurfaceNormal` | 25692 | function |  | 2 |
| `guidedNormalAt` | 25708 | function |  | 5 |
| `twistFromHandle` | 25727 | function |  | 3 |
| `signedAngleAroundAxis` | 25748 | function |  | 5 |
| `handleColor` | 25755 | function |  | 2 |
| `isAffectedCurvePoint` | 25778 | function |  | 2 |
| `syncLockFromCurve` | 25784 | function |  | 26 |
| `labelForPreset` | 25814 | function |  | 1 |
| `rebuildLockGeometry` | 25818 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 25845 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 25853 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 25859 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 25881 | function |  | 8 |
| `updateLockGeometry` | 25894 | function |  | 57 |
| `setGroupColorView` | 25915 | function |  | 2 |
| `createUvCheckerTexture` | 25925 | function |  | 3 |
| `ensureUvCheckerForLock` | 25961 | function |  | 4 |
| `removeUvCheckerFromLock` | 25994 | function |  | 3 |
| `invalidateUvInspector` | 26009 | function |  | 7 |
| `uvInspectorRecord` | 26013 | function |  | 1 |
| `uvInspectorRecords` | 26052 | function |  | 2 |
| `drawUvInspectorGrid` | 26056 | function |  | 2 |
| `renderUvInspector` | 26090 | function |  | 3 |
| `setUvCheckerEnabled` | 26149 | function |  | 3 |
| `strandViewportBaseColor` | 26166 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 26201 | function |  | 3 |
| `syncStrandSelectionOutline` | 26207 | function |  | 2 |
| `applyLockedStrandPalette` | 26218 | function |  | 2 |
| `syncLockedStrandWireVisual` | 26227 | function |  | 6 |
| `setStrandSelectionVisual` | 26236 | function |  | 6 |
| `proceduralParentOutlineVisible` | 26252 | function |  | 2 |
| `syncProceduralParentVisibility` | 26259 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 26268 | function |  | 2 |
| `updateStrandSelectionHighlight` | 26272 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 26276 | function |  | 2 |
| `resetGuideSelectionVisuals` | 26289 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 26309 | function |  | 3 |
| `selectLock` | 26342 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 26395 | function |  | 6 |
| `syncGroupInputs` | 26406 | function |  | 2 |
| `topologyStatsForLock` | 26439 | function |  | 4 |
| `formatTopologyStats` | 26447 | function |  | 5 |
| `updateTopologyStats` | 26451 | function |  | 20 |
| `normalizeBraidDimensions` | 26485 | function |  | 3 |
| `normalizeStrandDimensions` | 26498 | function |  | 3 |
| `strandBaseWidth` | 26512 | function |  | 5 |
| `strandWidthDimension` | 26516 | function |  | 5 |
| `strandDepthDimension` | 26524 | function |  | 8 |
| `setStrandWidthDimension` | 26532 | function |  | 2 |
| `setStrandDepthDimension` | 26554 | function |  | 4 |
| `syncShapeDimensionInputs` | 26570 | function |  | 4 |
| `syncCreationShapeInputs` | 26606 | function |  | 3 |
| `syncViewportDrawSettings` | 26644 | function |  | 5 |
| `syncPanelShapeInputs` | 26658 | function |  | 6 |
| `syncStrandSplitInputs` | 26684 | function |  | 4 |
| `syncHairCardControls` | 26693 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 26701 | function |  | 3 |
| `updateAttributeEditorMode` | 26740 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 26890 | function |  | 3 |
| `curveLatticeForGroup` | 26913 | function |  | 2 |
| `filterCurveLatticesToGroup` | 26931 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 26976 | function |  | 2 |
| `showCurveLatticeForGroup` | 26993 | function |  | 2 |
| `selectStrandGroup` | 27030 | function |  | 3 |
| `selectCurvePoint` | 27072 | function |  | 10 |
| `updateSelectedPointLabel` | 27086 | function |  | 14 |
| `syncInputs` | 27099 | function |  | 15 |
| `syncClumpGuidePanel` | 27145 | function |  | 3 |
| `getSelectedLock` | 27172 | function |  | 102 |
| `selectedLocksInOrder` | 27176 | function |  | 37 |
| `lockStrands` | 27182 | function |  | 3 |
| `lockSelectedStrands` | 27215 | function |  | 3 |
| `unlockStrands` | 27221 | function |  | 3 |
| `unlockAllStrands` | 27236 | function |  | 3 |
| `strandEditFamily` | 27240 | function |  | 7 |
| `compatibleSelectedLocks` | 27245 | function |  | 6 |
| `selectedEditRoots` | 27252 | function |  | 2 |
| `editSelectedLocks` | 27265 | function |  | 20 |
| `multiEditValuesEqual` | 27298 | function |  | 2 |
| `setMixedControl` | 27307 | function |  | 28 |
| `syncMultiStrandInputs` | 27324 | function |  | 16 |
| `values` | 27340 | arrow |  | 42 |
| `selectedRebuildableCurves` | 27420 | function |  | 5 |
| `createCompoundStrand` | 27427 | function |  | 1 |
| `refreshRebuildCurveDialog` | 27488 | function |  | 9 |
| `openRebuildCurveDialog` | 27501 | function |  | 1 |
| `rebuildSelectedCurves` | 27515 | function |  | 2 |
| `selectionCanBecomeClump` | 27554 | function |  | 4 |
| `createClumpFromSelection` | 27559 | function |  | 3 |
| `cleanSelectionSets` | 27571 | function |  | 2 |
| `createSelectionSetFromSelection` | 27576 | function |  | 3 |
| `selectionSetById` | 27587 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 27591 | function |  | 7 |
| `editSelectionSetFromSelection` | 27600 | function |  | 5 |
| `deleteSelectionSet` | 27620 | function |  | 2 |
| `selectSelectionSet` | 27629 | function |  | 2 |
| `deleteSelectedStrands` | 27639 | function |  | 4 |
| `deleteGuide` | 27647 | function |  | 3 |
| `deleteSelectedGuide` | 27670 | function |  | 3 |
| `deleteSelectedReferenceImage` | 27674 | function |  | 4 |
| `hasDeletableSelection` | 27687 | function |  | 2 |
| `deleteCurrentSelection` | 27695 | function |  | 3 |
| `hideOutlinerContextMenu` | 27703 | function |  | 17 |
| `outlinerLockTargets` | 27708 | function |  | 3 |
| `showOutlinerContextMenu` | 27735 | function |  | 10 |
| `hideStrandRadialMenu` | 27815 | function |  | 4 |
| `ensureRadialButtonCapacity` | 27826 | function |  | 3 |
| `radialButtonDimensions` | 27839 | function |  | 4 |
| `radialMenuDimensionsForKind` | 27848 | function |  | 3 |
| `applyRadialMenuDimensions` | 27865 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 27871 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 27884 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 27905 | function |  | 2 |
| `selectionSetRadialMenuOption` | 27922 | function |  | 4 |
| `selectedMirrorRadialOptions` | 27931 | function |  | 3 |
| `strandVisibilityRadialOptions` | 27953 | function |  | 5 |
| `clumpMirrorRadialOptions` | 27971 | function |  | 2 |
| `contextualRadialOptions` | 27978 | function |  | 3 |
| `sharedRadialFrameDimensions` | 28107 | function |  | 3 |
| `layoutContextualRadialOptions` | 28111 | function |  | 4 |
| `renderRadialActionList` | 28135 | function |  | 3 |
| `radialListOptionAtPointer` | 28153 | function |  | 3 |
| `syncRadialListHighlight` | 28175 | function |  | 3 |
| `configureContextualRadialMenu` | 28181 | function |  | 3 |
| `beginStrandRadialGesture` | 28241 | function |  | 2 |
| `enterStrandRadialSubmenu` | 28275 | function |  | 2 |
| `updateStrandRadialGesture` | 28321 | function |  | 1 |
| `performStrandRadialAction` | 28360 | function |  | 2 |
| `finishStrandRadialGesture` | 28463 | function |  | 2 |
| `cancelStrandRadialGesture` | 28473 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 28480 | function |  | 1 |
| `setPullMoveEnabled` | 28486 | function |  | 3 |
| `toolRadialOptions` | 28494 | function |  | 2 |
| `hideToolRadialMenu` | 28519 | function |  | 4 |
| `beginToolRadialGesture` | 28532 | function |  | 2 |
| `beginToolShortcutPress` | 28572 | function |  | 2 |
| `finishToolShortcutPress` | 28587 | function |  | 2 |
| `cancelToolShortcutPress` | 28596 | function |  | 5 |
| `setRadialMenusEnabled` | 28604 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 28617 | function |  | 5 |
| `setNavigationTipsEnabled` | 28632 | function |  | 5 |
| `configureNavigationMouseButtons` | 28639 | function |  | 3 |
| `syncNavigationModifierLocks` | 28652 | function |  | 7 |
| `setNavigationStyle` | 28657 | function |  | 5 |
| `applyCameraSmoothingPreference` | 28673 | function |  | 4 |
| `setCameraSmoothingEnabled` | 28688 | function |  | 5 |
| `setCameraSmoothingStrength` | 28694 | function |  | 5 |
| `setScaleSensitivity` | 28702 | function |  | 3 |
| `setToolTipsEnabled` | 28710 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 28717 | function |  | 5 |
| `setViewportStatisticsEnabled` | 28726 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 28734 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 28749 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 28758 | function |  | 5 |
| `sideNamingDisplayId` | 28767 | function |  | 3 |
| `referenceViewDisplayLabel` | 28779 | function |  | 6 |
| `strandRegionDisplayLabel` | 28789 | function |  | 10 |
| `updateSideNamingLabels` | 28807 | function |  | 2 |
| `setSideNamingPerspective` | 28834 | function |  | 5 |
| `setControlPointDisplaySize` | 28843 | function |  | 6 |
| `scaleHexColor` | 28855 | function |  | 3 |
| `setViewportBackgroundColor` | 28860 | function |  | 7 |
| `setDefaultHairShader` | 28882 | function |  | 5 |
| `setPreferenceCategory` | 28888 | function |  | 4 |
| `openPreferencesDialog` | 28915 | function |  | 1 |
| `savePreferencesDialog` | 28943 | function |  | 1 |
| `cancelPreferencesDialog` | 28967 | function |  | 3 |
| `updateToolRadialGesture` | 28996 | function |  | 1 |
| `performToolRadialAction` | 29025 | function |  | 2 |
| `finishToolRadialGesture` | 29035 | function |  | 2 |
| `cancelToolRadialGesture` | 29044 | function |  | 5 |
| `duplicatePlacementTarget` | 29051 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 29078 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 29082 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 29092 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 29097 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 29109 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 29120 | function |  | 7 |
| `openProceduralDuplicateDialog` | 29128 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 29145 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 29166 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 29177 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 29183 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 29189 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 29222 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 29377 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 29479 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 29520 | function |  | 2 |
| `updateDuplicatePlacement` | 29547 | function |  | 2 |
| `beginDuplicatePlacement` | 29611 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 29675 | function |  | 2 |
| `confirmDuplicatePlacement` | 29716 | function |  | 1 |
| `cancelDuplicatePlacement` | 29753 | function |  | 4 |
| `outlinerClumpLocks` | 29779 | function |  | 11 |
| `handleOutlinerClumpDrop` | 29783 | function |  | 3 |
| `createOutlinerStrandButton` | 29806 | function |  | 4 |
| `createOutlinerCurveSurface` | 29892 | function |  | 2 |
| `createOutlinerClump` | 29988 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 30070 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 30077 | function |  | 2 |
| `renderLockList` | 30156 | function |  | 70 |
| `updateCount` | 30310 | function |  | 34 |
| `captureInputUndo` | 30319 | function |  | 1 |
| `bindUndoCapture` | 30325 | function |  | 36 |
| `bindLockInput` | 30336 | function |  | 2 |
| `applyValue` | 30353 | arrow |  | 2 |
| `applyUniformTransformScale` | 30672 | function |  | 2 |
| `applyReducedTransformScale` | 30689 | function |  | 2 |
| `applyTransformPrecision` | 30728 | function |  | 2 |
| `updateTransformScalePointer` | 30757 | function |  | 1 |
| `finishSweepProfileDrag` | 30988 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 31084 | function |  | 3 |
| `finishTaperCurveDrag` | 31146 | function |  | 1 |
| `beginTaperMeshPointDrag` | 31189 | function |  | 1 |
| `updateTaperMeshPointDrag` | 31270 | function |  | 1 |
| `finishTaperMeshPointDrag` | 31325 | function |  | 6 |
| `updateSelectedTaperPoint` | 31349 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 31919 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 31924 | function |  | 4 |
| `syncDrawCurlControls` | 31979 | function |  | 5 |
| `handleLiveSurfaceChange` | 32027 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 32109 | function |  | 3 |
| `resampleSurfaceLock` | 32124 | function |  | 2 |
| `changePanelSplitCount` | 32237 | function |  | 3 |
| `applyPresetControl` | 32345 | function |  | 2 |
| `applyCreationToolSettings` | 32366 | function |  | 2 |
| `populateCreationPresetSelect` | 32410 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 32434 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 32467 | function |  | 5 |
| `createCustomCreationPreset` | 32475 | function |  | 3 |
| `createCustomClumpPreset` | 32490 | function |  | 3 |
| `commitCustomCreationPreset` | 32505 | function |  | 2 |
| `openRemoveCreationPreset` | 32566 | function |  | 3 |
| `commitRemoveCreationPreset` | 32579 | function |  | 1 |
| `applyBraidToolPreset` | 32596 | function |  | 2 |
| `selectedBranchChildLock` | 32708 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 32712 | function |  | 2 |
| `initPanelResizeHandles` | 32818 | function |  | 2 |
| `applyWidth` | 32824 | arrow |  | 2 |
| `restoreWidth` | 32831 | arrow |  | 2 |
| `bindResize` | 32839 | arrow |  | 2 |
| `onMove` | 32847 | arrow |  | 0 |
| `onUp` | 32851 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 32868 | function |  | 2 |
| `initFloatingPanelControls` | 32877 | function |  | 2 |
| `detach` | 32886 | arrow |  | 43 |
| `endDrag` | 32924 | arrow |  | 0 |
| `endResize` | 32956 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 32967 | function |  | 3 |
| `selectPatchNotesVersion` | 33101 | function |  | 3 |
| `requestReferenceImage` | 33134 | function |  | 5 |
| `toggleCapsuleGuideTool` | 33338 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 33344 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 33351 | function |  | 1 |
| `deleteLocks` | 33918 | function |  | 10 |
| `disposeCurveObjects` | 33996 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 34048 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 34079 | function |  | 1 |
| `endPanelSplitHandleDrag` | 34154 | function |  | 2 |
| `resize` | 34187 | function |  | 3 |
| `handleViewportPointerMove` | 34198 | function |  | 1 |
| `blockProportionalSizingEvent` | 34209 | function |  | 1 |
| `updateLightAngleFromInputs` | 34215 | function |  | 2 |
| `startViewSnap` | 34229 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 34259 | function |  | 3 |
| `trackViewportPointerDown` | 34276 | function |  | 1 |
| `trackViewportPointerMove` | 34292 | function |  | 1 |
| `clearViewportPointer` | 34300 | function |  | 1 |
| `updateViewSnap` | 34305 | function |  | 1 |
| `nearestCardinalAxis` | 34341 | function |  | 5 |
| `cardinalAxisKey` | 34355 | function |  | 5 |
| `steppedDragAmount` | 34359 | function |  | 3 |
| `snapCameraToCardinalAxis` | 34365 | function |  | 4 |
| `endViewSnap` | 34381 | function |  | 4 |
| `activateStrandControlPoint` | 34391 | function |  | 4 |
| `refreshStrandControlPointSelection` | 34441 | function |  | 4 |
| `addStrandControlPointSelection` | 34468 | function |  | 3 |
| `removeStrandControlPointSelection` | 34485 | function |  | 3 |
| `sampleStrandPointNormal` | 34499 | function |  | 2 |
| `sampleStrandPointVectors` | 34509 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 34515 | function |  | 2 |
| `resampleStrandCurveData` | 34526 | function |  | 4 |
| `resampleMatchingVectors` | 34532 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 34571 | function |  | 4 |
| `removeStrandCurvePoint` | 34582 | function |  | 2 |
| `closestStrandCurveParameter` | 34595 | function |  | 2 |
| `insertStrandCurvePoint` | 34624 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 34641 | function |  | 2 |
| `selectionModifierCursorAvailable` | 34651 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 34667 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 34674 | function |  | 4 |
| `prepareCurvePointSelection` | 34696 | function |  | 1 |
| `finishCurvePointInsertion` | 34807 | function |  | 1 |
| `finishPointRemoval` | 34822 | function |  | 1 |
| `editableStrandWidth` | 34840 | function |  | 6 |
| `editableStrandWidthBounds` | 34852 | function |  | 2 |
| `applyEditableStrandWidth` | 34858 | function |  | 3 |
| `viewportPixelPoint` | 34894 | function |  | 3 |
| `syncSculptBrushControls` | 34902 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 34917 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 34925 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 34933 | function |  | 1 |
| `sculptBrushPlaneOffset` | 34939 | function |  | 5 |
| `setSculptBrushCursorVisible` | 34943 | function |  | 7 |
| `updateSculptBrushCursor` | 34950 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 34972 | function |  | 4 |
| `sculptBrushEditableLock` | 34979 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 34989 | function |  | 5 |
| `sculptBrushLockViable` | 34995 | function |  | 5 |
| `sculptBrushUnits` | 35006 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 35044 | function |  | 4 |
| `sculptBrushPointWeight` | 35094 | function |  | 5 |
| `sculptBrushWorldDelta` | 35104 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 35113 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 35139 | function |  | 2 |
| `beginSculptMoveStroke` | 35197 | function |  | 1 |
| `applySculptMoveStrokeSample` | 35259 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 35494 | function |  | 3 |
| `updateSculptMoveStroke` | 35503 | function |  | 1 |
| `finishSculptMoveStroke` | 35519 | function |  | 3 |
| `strandControlPointHit` | 35567 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 35571 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 35649 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 35683 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 35723 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 35736 | function |  | 1 |
| `setHoveredControlPoint` | 35775 | function |  | 7 |
| `visibleControlPointHoverTargets` | 35788 | function |  | 2 |
| `updateControlPointHover` | 35824 | function |  | 1 |
| `animate` | 36380 | function |  | 2 |
| `syncCompactSidebarLayout` | 36411 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 36430 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 36436 | function |  | 3 |
| `setAttributeEditorTab` | 36442 | function |  | 6 |

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
