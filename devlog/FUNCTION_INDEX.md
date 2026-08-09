# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1728** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38721 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 255 | function |  | 3 |
| `saveBooleanPreference` | 283 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 287 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 292 | function |  | 2 |
| `normalizeScaleSensitivity` | 297 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 302 | function |  | 2 |
| `normalizeSideNamingPerspective` | 307 | function |  | 2 |
| `normalizeNavigationStyle` | 311 | function |  | 2 |
| `setupEditableSliderControls` | 326 | function |  | 2 |
| `syncNumberFromRange` | 377 | arrow |  | 0 |
| `applyNumberValue` | 384 | arrow |  | 0 |
| `copyCameraPose` | 490 | function |  | 3 |
| `updateCameraProjectionForViewport` | 496 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 509 | function |  | 3 |
| `setOrthographicView` | 515 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 555 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 584 | function |  | 2 |
| `removeRotateFreeAxisRing` | 610 | function |  | 2 |
| `deflateTransformGizmoPickers` | 622 | function |  | 2 |
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
| `currentStrandSelectionState` | 2099 | function |  | 4 |
| `applyStrandSelectionState` | 2103 | function |  | 5 |
| `clearStrandSelectionState` | 2108 | function |  | 7 |
| `guideHeadBounds` | 3174 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3184 | function |  | 5 |
| `disposeGuideModel` | 3198 | function |  | 3 |
| `syncHeadTransformInputs` | 3209 | function |  | 4 |
| `applyHeadTransform` | 3216 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3234 | function |  | 4 |
| `applyScalpRoughScale` | 3243 | function |  | 5 |
| `resetHeadTransform` | 3257 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3271 | function |  | 2 |
| `installGuideModel` | 3287 | function |  | 5 |
| `loadDefaultGuideModel` | 3363 | function |  | 3 |
| `braidTemplateFromEntries` | 3386 | function |  | 4 |
| `braidMeshEntries` | 3418 | function |  | 2 |
| `prepareBraidBodyCache` | 3430 | function |  | 2 |
| `quantize` | 3439 | arrow |  | 21 |
| `sourceNormalAt` | 3451 | arrow |  | 1 |
| `clusterBoundary` | 3454 | arrow |  | 2 |
| `normalBuckets` | 3471 | arrow |  | 2 |
| `applyBucketPair` | 3503 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3534 | function |  | 2 |
| `annotateBraidObjTopology` | 3555 | function |  | 2 |
| `loadBraidMeshPreset` | 3575 | function |  | 3 |
| `createSplitControlHandle` | 3592 | function |  | 4 |
| `frameGuideModel` | 3607 | function |  | 2 |
| `syncScalpInputs` | 3632 | function |  | 2 |
| `syncScalpArtistInputs` | 3638 | function |  | 2 |
| `rootScalpOffsetDistance` | 3646 | function |  | 15 |
| `applyLockRootScalpOffset` | 3651 | function |  | 5 |
| `normalizeHairLayer` | 3667 | function |  | 28 |
| `layerOffsetForLock` | 3671 | function |  | 9 |
| `layerRootOffsetFactor` | 3676 | function |  | 13 |
| `layerOffsetWeight` | 3680 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3686 | function |  | 5 |
| `pointsWithLayerOffset` | 3695 | function |  | 3 |
| `layerDirectionForLock` | 3703 | function |  | 2 |
| `applyLayerOffset` | 3714 | function |  | 5 |
| `setLockHairLayer` | 3738 | function |  | 2 |
| `setGroupLayerOffset` | 3753 | function |  | 2 |
| `scalpArtistWeight` | 3765 | function |  | 3 |
| `scalpArtistScalesAt` | 3769 | function |  | 3 |
| `applyScalpArtistShape` | 3779 | function |  | 5 |
| `inverseScalpArtistShape` | 3797 | function |  | 2 |
| `updateScalpSurface` | 3824 | function |  | 3 |
| `setActiveScalpRegion` | 3834 | function |  | 2 |
| `clearScalpRegions` | 3846 | function |  | 2 |
| `scalpHitFromEvent` | 3863 | function |  | 3 |
| `updateScalpBrushCursor` | 3871 | function |  | 4 |
| `paintScalpAt` | 3886 | function |  | 3 |
| `beginScalpPaint` | 3953 | function |  | 2 |
| `updateScalpPaint` | 3962 | function |  | 1 |
| `endScalpPaint` | 3971 | function |  | 2 |
| `createScalpLattice` | 3978 | function |  | 2 |
| `resetScalpLattice` | 4003 | function |  | 1 |
| `updateScalpLatticeObjects` | 4015 | function |  | 7 |
| `quadraticWeights` | 4029 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4034 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4061 | function |  | 3 |
| `selectScalpLatticePoint` | 4076 | function |  | 2 |
| `beginScalpLatticeDrag` | 4091 | function |  | 2 |
| `updateScalpLatticeDrag` | 4109 | function |  | 1 |
| `endScalpLatticeDrag` | 4127 | function |  | 2 |
| `setHeadReferenceTransparency` | 4133 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4143 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4161 | function |  | 3 |
| `trianglePlaneIntersections` | 4169 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4190 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4216 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4226 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4238 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4262 | function |  | 3 |
| `createScalpBuilderPlanes` | 4277 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4309 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4348 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4371 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4383 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4395 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4400 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4412 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4522 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4547 | function |  | 5 |
| `syncEditedScalpSurface` | 4562 | function |  | 4 |
| `ensureEditedScalpSurface` | 4633 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4663 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4748 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4761 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4777 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4787 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4805 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4818 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4825 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4844 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4858 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4899 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4908 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4921 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4942 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5079 | function |  | 2 |
| `scalpTemplateNeighbors` | 5087 | function |  | 2 |
| `smoothScalpVectorField` | 5099 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5113 | function |  | 2 |
| `upperContourCurve` | 5130 | function |  | 4 |
| `hermitePoint` | 5165 | function |  | 2 |
| `curveNetworkSection` | 5176 | function |  | 3 |
| `pointAlongSection` | 5205 | function |  | 3 |
| `longestStitchedContour` | 5211 | function |  | 2 |
| `nodeForPoint` | 5219 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5276 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5286 | function |  | 1 |
| `orderedRange` | 5298 | arrow |  | 3 |
| `clipSegment` | 5321 | arrow |  | 1 |
| `liftedPoint` | 5344 | arrow |  | 5 |
| `boundaryCorner` | 5349 | arrow |  | 4 |
| `surfaceCurveBetween` | 5358 | arrow |  | 1 |
| `addSurfaceConnector` | 5381 | arrow |  | 2 |
| `sideContourAtDepth` | 5449 | arrow |  | 3 |
| `addSurfacePatch` | 5483 | arrow |  | 1 |
| `addCenterBridgePatch` | 5563 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5671 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5706 | function |  | 1 |
| `generatedScalpObjContent` | 5796 | function |  | 2 |
| `generateScalpFromBuilder` | 5810 | function |  | 1 |
| `orderedDepthRange` | 5846 | arrow |  | 7 |
| `resetScalpBuilder` | 5975 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5990 | function |  | 1 |
| `beginScalpBuilderInput` | 6004 | function |  | 2 |
| `updateScalpBuilderStroke` | 6005 | function |  | 1 |
| `finishScalpBuilderStroke` | 6006 | function |  | 2 |
| `setScalpBuilderEditing` | 6008 | function |  | 10 |
| `updateScalpEditingVisibility` | 6042 | function |  | 12 |
| `exitSetupEditors` | 6136 | function |  | 7 |
| `setCapsuleGuideEditing` | 6145 | function |  | 5 |
| `syncAppMenuVisibility` | 6173 | function |  | 3 |
| `closeAppMenus` | 6178 | function |  | 6 |
| `setAppMenuOpen` | 6189 | function |  | 3 |
| `setTurntableActive` | 6196 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6205 | function |  | 9 |
| `selectedReferenceImage` | 6209 | function |  | 20 |
| `normalizeReferenceCrop` | 6215 | function |  | 8 |
| `referenceCropIsFull` | 6223 | function |  | 3 |
| `referencePlaneFrontAxis` | 6228 | function |  | 4 |
| `referencePlanePlacement` | 6237 | function |  | 4 |
| `migratedReferencePlanePosition` | 6252 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6272 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6289 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6305 | function |  | 2 |
| `snappedReferenceImageView` | 6328 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6334 | function |  | 5 |
| `applyReferenceImageRuntime` | 6350 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6393 | function |  | 6 |
| `createReferenceImageRuntime` | 6401 | function |  | 3 |
| `addReferenceImage` | 6470 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6522 | function |  | 3 |
| `disposeReferenceImage` | 6541 | function |  | 2 |
| `clearReferenceImages` | 6545 | function |  | 2 |
| `serializeReferenceImage` | 6552 | function |  | 1 |
| `setReferenceImageType` | 6580 | function |  | 2 |
| `attachReferenceImageTransform` | 6624 | function |  | 6 |
| `selectReferenceImage` | 6638 | function |  | 12 |
| `placeReferencePlane` | 6661 | function |  | 2 |
| `setReferencePlaneInFront` | 6672 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6682 | function |  | 4 |
| `renderReferenceImagePanel` | 6701 | function |  | 20 |
| `setOutlinerTab` | 6748 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6766 | function |  | 4 |
| `componentEditModeActive` | 6770 | function |  | 38 |
| `selectionToolSupportsPicking` | 6774 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6779 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6795 | function |  | 2 |
| `setViewportSelectionMode` | 6825 | function |  | 4 |
| `setViewportEditMode` | 6837 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6879 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6893 | function |  | 8 |
| `outlinerGuides` | 6905 | function |  | 3 |
| `guideOutlinerLabel` | 6912 | function |  | 2 |
| `normalizeOutlinerName` | 6922 | function |  | 4 |
| `beginOutlinerRename` | 6927 | function |  | 2 |
| `finish` | 6938 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6968 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6978 | function |  | 2 |
| `renderGuideOutliner` | 7013 | function |  | 10 |
| `referenceOutlinerGroup` | 7071 | function |  | 2 |
| `renderReferenceOutliner` | 7075 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7192 | function |  | 5 |
| `readReferenceImageFile` | 7197 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7221 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7228 | function |  | 3 |
| `dragContainsReferenceImage` | 7273 | function |  | 3 |
| `setReferenceImageDragActive` | 7284 | function |  | 9 |
| `referenceDropDestination` | 7292 | function |  | 2 |
| `viewportOverlayDropPosition` | 7298 | function |  | 2 |
| `setReferenceDropHover` | 7307 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7325 | function |  | 2 |
| `referenceOverlayAtPointer` | 7345 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7363 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7376 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7422 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7472 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7494 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7505 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7531 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7540 | function |  | 2 |
| `referenceCropCursor` | 7555 | function |  | 3 |
| `updateReferenceCropHandles` | 7561 | function |  | 5 |
| `referenceCropSourcePoint` | 7582 | function |  | 2 |
| `beginReferenceCrop` | 7589 | function |  | 1 |
| `updateReferenceCrop` | 7627 | function |  | 1 |
| `finishReferenceCrop` | 7659 | function |  | 4 |
| `setHeadSetupEditing` | 7677 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7693 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7702 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7712 | function |  | 4 |
| `setScalpGuideVisibility` | 7718 | function |  | 12 |
| `currentGuideViewMode` | 7726 | function |  | 3 |
| `updateGuideViewToggle` | 7734 | function |  | 5 |
| `setGuideViewMode` | 7750 | function |  | 3 |
| `cycleGuideViewMode` | 7761 | function |  | 1 |
| `hideGuideViewContextMenu` | 7766 | function |  | 6 |
| `showGuideViewContextMenu` | 7770 | function |  | 1 |
| `strandPassesDisplayFilters` | 7783 | function |  | 4 |
| `strandVisibleForDisplay` | 7792 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7797 | function |  | 2 |
| `lockedStrandsExist` | 7801 | function |  | 3 |
| `hiddenStrandsExist` | 7805 | function |  | 2 |
| `hideSelectedStrands` | 7809 | function |  | 2 |
| `unhideHiddenStrands` | 7819 | function |  | 2 |
| `strandIsolationActive` | 7828 | function |  | 7 |
| `setStrandIsolation` | 7832 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7844 | function |  | 3 |
| `syncVisibilityParent` | 7855 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7862 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7891 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7898 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7918 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7941 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7949 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7956 | function |  | 9 |
| `setScalpLatticeEditing` | 7967 | function |  | 4 |
| `setScalpShapeEditing` | 7982 | function |  | 9 |
| `setScalpPaintEditing` | 8000 | function |  | 7 |
| `defaultCurveLatticePoints` | 8024 | function |  | 3 |
| `flatCurveLatticePoints` | 8050 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8059 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8083 | function |  | 4 |
| `horizontalValue` | 8088 | arrow |  | 1 |
| `blendedSample` | 8099 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8132 | function |  | 2 |
| `curveLatticeControlPoint` | 8147 | function |  | 9 |
| `circularArcTangent` | 8151 | function |  | 4 |
| `arcLengthTo` | 8182 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8194 | function |  | 3 |
| `sampleHermiteCurve` | 8233 | function |  | 10 |
| `sampleCurveLattice` | 8250 | function |  | 6 |
| `curveLatticeNormal` | 8269 | function |  | 1 |
| `createCurveLatticeGeometry` | 8280 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8309 | function |  | 3 |
| `appendCurve` | 8311 | arrow |  | 4 |
| `sample` | 8313 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8340 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8356 | function |  | 3 |
| `addPicker` | 8358 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8397 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8410 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8414 | function |  | 3 |
| `curveLatticeEditablePoint` | 8432 | function |  | 13 |
| `curveLatticePointSection` | 8439 | function |  | 3 |
| `curveLatticeRestPoint` | 8450 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8456 | function |  | 7 |
| `curveLatticeRootColumns` | 8462 | function |  | 3 |
| `curveTangentsForPoints` | 8469 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8481 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8518 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8544 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8561 | function |  | 3 |
| `resampleGrid` | 8571 | arrow |  | 2 |
| `controlPointIsSelected` | 8598 | function |  | 7 |
| `clearMultiPointSelection` | 8606 | function |  | 9 |
| `createCurveLatticeHandles` | 8610 | function |  | 4 |
| `addCurveLattice` | 8632 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8741 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8772 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8778 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8817 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8838 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8855 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8864 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8871 | function |  | 1 |
| `selectCurveLatticeLoop` | 8890 | function |  | 3 |
| `selectCurveLatticePoint` | 8919 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8934 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8976 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8997 | function |  | 3 |
| `curveLatticeColumnPoints` | 9040 | function |  | 3 |
| `groupCurveControlIndices` | 9049 | function |  | 4 |
| `groupCurveControlPoints` | 9055 | function |  | 2 |
| `updateGroupCurveDisplay` | 9061 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9071 | function |  | 2 |
| `groupCurveDeformationPairs` | 9093 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9100 | function |  | 2 |
| `appendPairs` | 9102 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9113 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9132 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9153 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9172 | function |  | 2 |
| `capsuleGuideCapHeight` | 9206 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9210 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9215 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9219 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9231 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9247 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9253 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9279 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9309 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9363 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9384 | function |  | 7 |
| `vertex` | 9398 | function |  | 4 |
| `addFace` | 9404 | function |  | 3 |
| `addRing` | 9422 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9477 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9487 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9552 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9598 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9611 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9632 | function |  | 3 |
| `capsuleGuidePointDistances` | 9637 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9658 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9678 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9683 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9689 | function |  | 3 |
| `capsuleGuideAccentColor` | 9694 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9699 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9710 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9722 | function |  | 2 |
| `createCapsuleGuideHandles` | 9754 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9777 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9796 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9803 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9819 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9836 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9851 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9888 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9904 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9921 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9927 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9954 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9966 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9985 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10030 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10065 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10079 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10085 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10102 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10113 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10124 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10154 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10164 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10205 | function |  | 3 |
| `createQuadCageGeometry` | 10221 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10245 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10265 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10276 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10329 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10367 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10377 | function |  | 4 |
| `addCapsuleGuide` | 10385 | function |  | 4 |
| `addGuide` | 10454 | function |  | 1 |
| `createGuideGeometry` | 10515 | function |  | 4 |
| `selectGuide` | 10570 | function |  | 17 |
| `updateGuideControlsVisibility` | 10638 | function |  | 10 |
| `updateViewportToolVisibility` | 10655 | function |  | 7 |
| `getSelectedGuide` | 10694 | function |  | 34 |
| `selectedViewportFocusBounds` | 10698 | function |  | 2 |
| `frameViewportBounds` | 10712 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10742 | function |  | 2 |
| `fullSceneFocusBounds` | 10746 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10762 | function |  | 3 |
| `cycleViewportFraming` | 10771 | function |  | 2 |
| `syncGuideInputs` | 10789 | function |  | 5 |
| `updateGuideGeometry` | 10832 | function |  | 3 |
| `sculptBrushToolActive` | 10853 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10857 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10861 | function |  | 3 |
| `effectiveSculptBrushTool` | 10865 | function |  | 13 |
| `updateSculptScaleModeRow` | 10871 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10876 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10898 | function |  | 5 |
| `setActiveTool` | 10907 | function |  | 19 |
| `setDrawStrandMode` | 11045 | function |  | 2 |
| `setObjectSpaceEditing` | 11055 | function |  | 7 |
| `setHierarchyEditing` | 11071 | function |  | 4 |
| `setProportionalEditing` | 11083 | function |  | 5 |
| `beginProportionalSizeEdit` | 11102 | function |  | 3 |
| `updateProportionalSizeEdit` | 11114 | function |  | 2 |
| `endProportionalSizeEdit` | 11125 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11132 | function |  | 2 |
| `refreshProportionalPreview` | 11140 | function |  | 4 |
| `activeBrushSizeInput` | 11150 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11159 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11171 | function |  | 2 |
| `beginBrushSizeDrag` | 11189 | function |  | 1 |
| `updateBrushSizeDrag` | 11216 | function |  | 1 |
| `finishBrushSizeDrag` | 11237 | function |  | 2 |
| `updateInteractionLocks` | 11254 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11263 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11272 | function |  | 2 |
| `configureTransformControls` | 11303 | function |  | 16 |
| `pullMoveActive` | 11311 | function |  | 9 |
| `updatePullGuideVisual` | 11315 | function |  | 4 |
| `attachTransformForCurvePoint` | 11331 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11355 | function |  | 7 |
| `strandObjectRootIndex` | 11371 | function |  | 3 |
| `strandObjectRoot` | 11380 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11384 | function |  | 2 |
| `attachStrandObjectTransform` | 11389 | function |  | 6 |
| `guideObjectPivot` | 11412 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11423 | function |  | 2 |
| `attachGuideObjectTransform` | 11428 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11447 | function |  | 2 |
| `beginGuideObjectTransform` | 11475 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11482 | function |  | 2 |
| `updateGuideObjectTransform` | 11504 | function |  | 2 |
| `finishGuideObjectTransform` | 11537 | function |  | 2 |
| `clonePlacementFrame` | 11546 | function |  | 2 |
| `cloneOptionalVectors` | 11558 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11562 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11579 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11594 | function |  | 2 |
| `strandObjectTransformOperators` | 11610 | function |  | 4 |
| `transformPoint` | 11618 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11625 | arrow |  | 0 |
| `transformNormal` | 11631 | arrow |  | 10 |
| `transformDirection` | 11641 | arrow |  | 7 |
| `worldMatrixForPivot` | 11653 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11659 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11675 | function |  | 6 |
| `beginStrandObjectTransform` | 11689 | function |  | 2 |
| `updateStrandObjectTransform` | 11727 | function |  | 2 |
| `commitStrandObjectTransform` | 11776 | function |  | 2 |
| `mapPoints` | 11789 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11823 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11837 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11860 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11873 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11888 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11914 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11963 | function |  | 2 |
| `beginHandleEdit` | 11972 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12021 | function |  | 3 |
| `applyBranchRigidRootMove` | 12038 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12075 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12086 | function |  | 3 |
| `multiPointHandleEditActive` | 12097 | function |  | 7 |
| `applyMultiMove` | 12101 | function |  | 5 |
| `applyMultiRotate` | 12107 | function |  | 2 |
| `applyMultiScale` | 12116 | function |  | 2 |
| `applyHierarchicalMove` | 12125 | function |  | 3 |
| `applySingleMove` | 12137 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12141 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12158 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12167 | function |  | 3 |
| `changed` | 12177 | arrow |  | 1 |
| `applyPullMove` | 12219 | function |  | 3 |
| `pullHeadCollisionContext` | 12227 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12246 | function |  | 2 |
| `applyProportionalMove` | 12269 | function |  | 3 |
| `viewPlaneNormal` | 12280 | function |  | 20 |
| `isCameraInSnappedView` | 12284 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12292 | function |  | 10 |
| `updateViewPlaneGrid` | 12296 | function |  | 14 |
| `setViewPlaneMove` | 12353 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12364 | function |  | 2 |
| `rayFromViewportEvent` | 12372 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12380 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12390 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12401 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12414 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12433 | function |  | 4 |
| `beginViewPlaneMove` | 12440 | function |  | 3 |
| `updateViewPlaneMove` | 12504 | function |  | 1 |
| `endViewPlaneMove` | 12569 | function |  | 7 |
| `applyHierarchicalRotate` | 12588 | function |  | 2 |
| `rotateGuideNormal` | 12595 | arrow |  | 4 |
| `applySingleRotate` | 12633 | function |  | 2 |
| `applyProportionalRotate` | 12637 | function |  | 2 |
| `applyHierarchicalScale` | 12657 | function |  | 2 |
| `applySingleScale` | 12667 | function |  | 2 |
| `applyProportionalScale` | 12671 | function |  | 2 |
| `setPointScale` | 12687 | function |  | 8 |
| `proportionalWeight` | 12696 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12708 | function |  | 5 |
| `strandInfluenceColor` | 12714 | function |  | 17 |
| `beginRelaxEdit` | 12739 | function |  | 3 |
| `updateRelaxEdit` | 12768 | function |  | 1 |
| `endRelaxEdit` | 12828 | function |  | 1 |
| `disposeGuide` | 12838 | function |  | 3 |
| `removeGuideObjects` | 12866 | function |  | 3 |
| `strandRadiusAt` | 12880 | function |  | 5 |
| `strandProfileTopologyAt` | 12897 | function |  | 8 |
| `strandCurveParameters` | 12939 | function |  | 5 |
| `widthProfileAt` | 12949 | arrow |  | 1 |
| `braidFrameAt` | 12987 | function |  | 5 |
| `braidFrameAtExtended` | 12997 | function |  | 2 |
| `createBraidProfileProjector` | 13006 | function |  | 2 |
| `project` | 13022 | arrow |  | 17 |
| `createBraidGeometry` | 13037 | function |  | 2 |
| `deformationAt` | 13072 | function |  | 3 |
| `widthFor` | 13081 | arrow |  | 3 |
| `depthFor` | 13085 | arrow |  | 3 |
| `outputVertex` | 13117 | function |  | 7 |
| `appendAuthoredCap` | 13225 | function |  | 3 |
| `outputCapVertex` | 13232 | arrow |  | 6 |
| `capBoundary` | 13323 | function |  | 3 |
| `strandGeometryCurve` | 13385 | function |  | 15 |
| `strandGeometryFrameAt` | 13411 | function |  | 19 |
| `transportedStrandFrameAt` | 13474 | function |  | 7 |
| `twistOverrideAt` | 13477 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13505 | function |  | 2 |
| `weldPanelGeometryData` | 13541 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13581 | function |  | 3 |
| `surfacePanelPoint` | 13596 | function |  | 3 |
| `createPanelStrandGeometry` | 13619 | function |  | 2 |
| `addQuad` | 13653 | arrow |  | 6 |
| `near` | 13657 | arrow |  | 6 |
| `panelWidthAt` | 13687 | arrow |  | 6 |
| `panelThicknessAt` | 13696 | arrow |  | 6 |
| `panelFrameAt` | 13705 | arrow |  | 1 |
| `rawPanelPoint` | 13723 | arrow |  | 1 |
| `panelPoint` | 13743 | arrow |  | 2 |
| `addPatch` | 13749 | arrow |  | 1 |
| `splitOpening` | 13800 | arrow |  | 2 |
| `uStart` | 13824 | arrow |  | 1 |
| `uEnd` | 13827 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13865 | function |  | 3 |
| `inside` | 13866 | arrow |  | 2 |
| `pushOrientedTriangle` | 13888 | function |  | 7 |
| `triangulatePolygon3D` | 13899 | function |  | 1 |
| `orientedQuadFace` | 13939 | function |  | 2 |
| `createSplitStrandGeometry` | 13947 | function |  | 2 |
| `fusedIndexAt` | 14104 | arrow |  | 0 |
| `createHairCardGeometry` | 14153 | function |  | 2 |
| `createPolyGeometry` | 14252 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14279 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14288 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14335 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14343 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14359 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14368 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14379 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14387 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14397 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14417 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14440 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14519 | function |  | 2 |
| `pushBoundary` | 14548 | arrow |  | 5 |
| `boundaryAt` | 14566 | arrow |  | 3 |
| `hermite` | 14588 | arrow |  | 2 |
| `emitBottomMidRow` | 14633 | arrow |  | 2 |
| `emitTopMidRow` | 14732 | arrow |  | 2 |
| `sideHoleVertex` | 14774 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14823 | arrow |  | 2 |
| `emitFillStrip` | 14894 | arrow |  | 2 |
| `fillSide` | 14905 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14949 | arrow |  | 2 |
| `edgeDirection` | 14973 | arrow |  | 1 |
| `positionAt` | 15032 | arrow |  | 1 |
| `createBranchChildGeometry` | 15083 | function |  | 2 |
| `createCompoundStrandGeometry` | 15293 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15544 | function |  | 2 |
| `createHairGeometry` | 15575 | function |  | 6 |
| `createBaseHairGeometry` | 15627 | function |  | 3 |
| `hairMaterialDefinition` | 15745 | function |  | 4 |
| `materialForLock` | 15749 | function |  | 8 |
| `activeHairMaterialDefinition` | 15753 | function |  | 11 |
| `strandDisplayColor` | 15759 | function |  | 14 |
| `setAnimeHairBaseColor` | 15777 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15790 | function |  | 2 |
| `createHairMaterial` | 15830 | function |  | 5 |
| `createStrandSelectionOutline` | 15872 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15906 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15915 | function |  | 6 |
| `refreshMaterialUsers` | 15942 | function |  | 6 |
| `renderHairMaterialOutliner` | 15951 | function |  | 5 |
| `renderHairMaterialOptions` | 15981 | function |  | 3 |
| `syncHairMaterialEditor` | 15991 | function |  | 9 |
| `createProjectHairMaterial` | 16017 | function |  | 3 |
| `deleteActiveHairMaterial` | 16037 | function |  | 2 |
| `createHairTopologyGeometry` | 16055 | function |  | 4 |
| `createHairTopologyOverlay` | 16076 | function |  | 3 |
| `groupDefaultsFor` | 16123 | function |  | 9 |
| `creationToolActive` | 16130 | function |  | 8 |
| `activeCreationShapeDefaults` | 16134 | function |  | 11 |
| `activeStrandShapeTarget` | 16140 | function |  | 5 |
| `curvePolylineLength` | 16144 | function |  | 2 |
| `curvePolylineLengths` | 16152 | function |  | 3 |
| `samplePolylineDistance` | 16160 | function |  | 2 |
| `applyProjectedCurveLength` | 16170 | function |  | 4 |
| `clearRegionLengthBaseline` | 16201 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16208 | function |  | 2 |
| `setGroupLengthScale` | 16216 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16254 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16286 | function |  | 1 |
| `activeSweepProfile` | 16295 | function |  | 9 |
| `activeSweepProfileTarget` | 16302 | function |  | 6 |
| `trimmedSweepProfile` | 16309 | function |  | 7 |
| `roundedLeft` | 16318 | arrow |  | 1 |
| `roundedRight` | 16324 | arrow |  | 1 |
| `activeProfileOffset` | 16341 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16348 | function |  | 3 |
| `profileToCanvas` | 16365 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16369 | function |  | 11 |
| `sampleSweepProfile` | 16378 | function |  | 7 |
| `createSweepProfileTopology` | 16399 | function |  | 5 |
| `renderProfilePreview` | 16441 | function |  | 8 |
| `renderHairCardCoveragePath` | 16460 | function |  | 3 |
| `activeTaperTarget` | 16475 | function |  | 15 |
| `twistCurveEditing` | 16482 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16486 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16490 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16494 | function |  | 17 |
| `taperAsymmetryKey` | 16498 | function |  | 12 |
| `taperSecondaryKey` | 16502 | function |  | 11 |
| `activeTaperCurve` | 16506 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16517 | function |  | 6 |
| `taperSamples` | 16527 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16534 | function |  | 2 |
| `renderTaperPreview` | 16556 | function |  | 13 |
| `renderTwistCurvePreview` | 16592 | function |  | 5 |
| `cloneShapePresetValue` | 16610 | function |  | 66 |
| `shapeValuesMatch` | 16614 | function |  | 5 |
| `shapeTargetForSelect` | 16622 | function |  | 4 |
| `loadCustomShapePresets` | 16629 | function |  | 2 |
| `saveCustomShapePresets` | 16640 | function |  | 4 |
| `shapePresetLabel` | 16648 | function |  | 4 |
| `setupShapePresetControls` | 16653 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16678 | function |  | 3 |
| `syncShapePresetSelects` | 16684 | function |  | 8 |
| `populateShapePresetSelects` | 16705 | function |  | 5 |
| `applyShapePreset` | 16732 | function |  | 2 |
| `openSaveShapePreset` | 16769 | function |  | 2 |
| `commitCustomShapePreset` | 16794 | function |  | 2 |
| `openRemoveShapePreset` | 16817 | function |  | 2 |
| `commitRemoveShapePreset` | 16830 | function |  | 2 |
| `taperPointToCanvas` | 16846 | function |  | 4 |
| `canvasToTaperPoint` | 16863 | function |  | 2 |
| `clearTaperMeshPoints` | 16899 | function |  | 2 |
| `taperMeshPointFrame` | 16909 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16919 | function |  | 4 |
| `twistMeshGraphAxis` | 16927 | function |  | 4 |
| `addTwistMeshCurvePath` | 16931 | function |  | 2 |
| `appendSegment` | 16952 | arrow |  | 1 |
| `appendFill` | 16955 | arrow |  | 1 |
| `appendSignedSection` | 16961 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17010 | function |  | 6 |
| `updateTaperMeshPoints` | 17047 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17126 | function |  | 5 |
| `renderTaperCurveEditor` | 17144 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17216 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17230 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17246 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17280 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17289 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17300 | function |  | 2 |
| `applyTaperCurveEdit` | 17308 | function |  | 10 |
| `openTaperCurveEditor` | 17416 | function |  | 3 |
| `closeTaperCurveEditor` | 17461 | function |  | 6 |
| `updateViewportStatsVisibility` | 17474 | function |  | 6 |
| `canvasToProfile` | 17493 | function |  | 2 |
| `renderSweepProfileEditor` | 17503 | function |  | 7 |
| `applySweepProfileEdit` | 17546 | function |  | 8 |
| `openSweepProfileEditor` | 17573 | function |  | 1 |
| `closeSweepProfileEditor` | 17608 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17617 | function |  | 2 |
| `addLock` | 17632 | function |  | 19 |
| `mirroredScalpRegion` | 17835 | function |  | 5 |
| `mirroredVector` | 17844 | function |  | 12 |
| `mirroredPlacementFrame` | 17848 | function |  | 2 |
| `mirrorPartnerFor` | 17861 | function |  | 40 |
| `decoupleMirrorPartner` | 17865 | function |  | 2 |
| `createMirrorPartner` | 17873 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17969 | function |  | 6 |
| `mirroredClumpPartners` | 17974 | function |  | 6 |
| `createMirroredClump` | 17980 | function |  | 3 |
| `decoupleMirroredClump` | 18002 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18011 | function |  | 6 |
| `syncActiveMirror` | 18176 | function |  | 25 |
| `setMirrorXEditing` | 18188 | function |  | 6 |
| `snapshotState` | 18212 | function |  | 7 |
| `scalpTriangleRegion` | 18469 | function |  | 4 |
| `closestPointOnActiveScalp` | 18482 | function |  | 12 |
| `rootAttachmentFrame` | 18554 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18566 | function |  | 4 |
| `resolveRootAttachment` | 18584 | function |  | 4 |
| `curvePointsToRootLocal` | 18624 | function |  | 2 |
| `curvePointsFromRootLocal` | 18636 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18644 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18660 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18690 | function |  | 2 |
| `createRootAttachment` | 18702 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18732 | function |  | 4 |
| `rootAttachmentToData` | 18759 | function |  | 2 |
| `rootAttachmentFromData` | 18787 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18826 | function |  | 2 |
| `remapPoint` | 18841 | arrow |  | 1 |
| `remapVector` | 18842 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18871 | function |  | 2 |
| `importHeadMeshFile` | 18888 | function |  | 3 |
| `importFullBodyMeshFile` | 18911 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18936 | function |  | 1 |
| `importedBooleanPreference` | 18969 | function |  | 11 |
| `loadPreferencesAndPresets` | 18973 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19043 | function |  | 1 |
| `openHairProjectFile` | 19086 | function |  | 4 |
| `dragContainsApplicationFile` | 19144 | function |  | 3 |
| `safelyRememberRecentProject` | 19153 | function |  | 2 |
| `renderRecentProjectsMenu` | 19162 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19194 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19219 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19223 | function |  | 2 |
| `pushUndoState` | 19239 | function |  | 119 |
| `undoLastAction` | 19246 | function |  | 2 |
| `redoLastAction` | 19260 | function |  | 2 |
| `updateHistoryButtons` | 19274 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19279 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19296 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19303 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19341 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19418 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19444 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19476 | function |  | 2 |
| `finalizeStateRestore` | 19517 | function |  | 2 |
| `restoreState` | 19524 | function |  | 5 |
| `disposeAllEditableObjects` | 19548 | function |  | 2 |
| `restoreLock` | 19569 | function |  | 4 |
| `restoreGuide` | 19786 | function |  | 2 |
| `vectorToData` | 19847 | function |  | 29 |
| `dataToVector` | 19851 | function |  | 31 |
| `frameToData` | 19855 | function |  | 2 |
| `frameFromData` | 19867 | function |  | 2 |
| `applyPresetSelection` | 19879 | function |  | 2 |
| `drawPresetThumbnail` | 19910 | function |  | 1 |
| `fillHair` | 19925 | arrow |  | 9 |
| `strand` | 19937 | arrow |  | 31 |
| `bun` | 19955 | arrow |  | 2 |
| `braid` | 19990 | arrow |  | 2 |
| `renderPresetLibrary` | 20079 | function |  | 3 |
| `setPresetLibraryOpen` | 20138 | function |  | 6 |
| `average` | 20151 | function |  | 4 |
| `fitPointAttributes` | 20155 | function |  | 9 |
| `rebuildCurveObjects` | 20184 | function |  | 10 |
| `createCurvePoints` | 20196 | function |  | 2 |
| `addGeneratedBangPreset` | 20205 | function |  | 1 |
| `sampleScalpQuad` | 20298 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20322 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20371 | function |  | 1 |
| `columns` | 20372 | arrow |  | 1 |
| `layer` | 20376 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20590 | function |  | 2 |
| `addBraidedBobPreset` | 20626 | function |  | 1 |
| `evenColumns` | 20627 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20843 | function |  | 1 |
| `scalpSeed` | 20866 | arrow |  | 1 |
| `createBowlCutPoints` | 21153 | function |  | 2 |
| `addBowlCutPreset` | 21191 | function |  | 1 |
| `scalpRegionAtHit` | 21257 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21269 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21276 | function |  | 12 |
| `braidStrokeActive` | 21283 | function |  | 9 |
| `proceduralDrawActive` | 21287 | function |  | 3 |
| `panelStrokeActive` | 21291 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21295 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21299 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21303 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21309 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21313 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21317 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21321 | function |  | 3 |
| `liveSurfaceStrandId` | 21331 | function |  | 4 |
| `liveSurfaceStrand` | 21335 | function |  | 4 |
| `liveSurfaceGuideId` | 21340 | function |  | 3 |
| `guideSupportsLiveSurface` | 21344 | function |  | 2 |
| `liveSurfaceGuide` | 21351 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21358 | function |  | 12 |
| `activeStrokeScalpOffset` | 21398 | function |  | 4 |
| `activeStrokeBrushSize` | 21404 | function |  | 10 |
| `activeStrokeBrushDepth` | 21410 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21416 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21424 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21434 | function |  | 13 |
| `worldNormalAtHit` | 21473 | function |  | 6 |
| `selectedPolyMesh` | 21481 | function |  | 10 |
| `addPolyLock` | 21486 | function |  | 2 |
| `ensurePolyMesh` | 21505 | function |  | 3 |
| `polySurfaceSample` | 21509 | function |  | 4 |
| `polyTargetAtEvent` | 21520 | function |  | 6 |
| `refreshPolyMesh` | 21546 | function |  | 10 |
| `ensurePolyFillPreview` | 21555 | function |  | 2 |
| `clearPolyFillPreview` | 21592 | function |  | 17 |
| `polyFillCandidateForEvent` | 21597 | function |  | 3 |
| `showPolyFillPreview` | 21617 | function |  | 2 |
| `updatePolyFillPreview` | 21643 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21668 | function |  | 5 |
| `fillPolyGap` | 21678 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21689 | function |  | 2 |
| `projectPolyRelaxPoint` | 21709 | function |  | 2 |
| `removePolyPointAttributes` | 21753 | function |  | 3 |
| `deletePolyComponent` | 21762 | function |  | 2 |
| `addPolyPoint` | 21785 | function |  | 4 |
| `appendPolyStrokeRow` | 21794 | function |  | 4 |
| `beginPolyBrushPointer` | 21814 | function |  | 1 |
| `finishPolyAltDelete` | 21900 | function |  | 1 |
| `updatePolyBrushStroke` | 21914 | function |  | 1 |
| `finishPolyBrushStroke` | 22004 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22041 | function |  | 2 |
| `drawSampleFromHit` | 22064 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22078 | function |  | 3 |
| `strokeLength` | 22115 | function |  | 9 |
| `resampleDrawStroke` | 22121 | function |  | 2 |
| `processedDrawStroke` | 22153 | function |  | 8 |
| `strokeSurfaceNormals` | 22182 | function |  | 7 |
| `drawClumpFrame` | 22193 | function |  | 4 |
| `nearestCurveParameter` | 22202 | function |  | 2 |
| `drawClumpSampleNormal` | 22216 | function |  | 6 |
| `drawClumpTemplateVector` | 22225 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22231 | function |  | 3 |
| `drawClumpStrandMaps` | 22247 | function |  | 4 |
| `nextClumpName` | 22302 | function |  | 6 |
| `initializeClumpShape` | 22309 | function |  | 5 |
| `stableClumpVariation` | 22320 | function |  | 3 |
| `createClumpFromLocks` | 22332 | function |  | 7 |
| `addLockToClump` | 22357 | function |  | 4 |
| `stableBranchBaseNormals` | 22375 | function |  | 4 |
| `ensureBranchParentNormalField` | 22386 | function |  | 2 |
| `branchParentFrame` | 22392 | function |  | 7 |
| `branchLocalVector` | 22404 | function |  | 3 |
| `branchWorldVector` | 22408 | function |  | 4 |
| `captureBranchLocalState` | 22414 | function |  | 6 |
| `enforceBranchRootPosition` | 22442 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22492 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22519 | function |  | 2 |
| `clampRegionParam` | 22566 | function |  | 113 |
| `branchRootRegionFromParam` | 22573 | function |  | 4 |
| `cloneBranchRootRegion` | 22596 | function |  | 5 |
| `flip` | 22598 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22631 | function |  | 8 |
| `setBranchRootRegionPoint` | 22662 | function |  | 3 |
| `branchRegionUVToCanvas` | 22698 | function |  | 10 |
| `branchRegionCanvasToUV` | 22701 | function |  | 4 |
| `openBranchRegionEditor` | 22707 | function |  | 2 |
| `closeBranchRegionEditor` | 22721 | function |  | 2 |
| `retargetBranchRegionEditor` | 22727 | function |  | 2 |
| `renderBranchRegionEditor` | 22732 | function |  | 9 |
| `applyBranchRegionView` | 22820 | function |  | 6 |
| `resetBranchRegionZoom` | 22823 | function |  | 1 |
| `branchRegionNavAction` | 22829 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22843 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22863 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22867 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22893 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22905 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22910 | function |  | 1 |
| `branchRegionEventUV` | 22930 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22938 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23043 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23176 | function |  | 1 |
| `pointerToNdc` | 23181 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23192 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23206 | function |  | 1 |
| `endBranchSweepStartDrag` | 23229 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23236 | function |  | 5 |
| `gridProfileSkipCol` | 23263 | function |  | 3 |
| `branchRootRegionSurface` | 23272 | function |  | 6 |
| `toGridCol` | 23297 | arrow |  | 5 |
| `toRow` | 23301 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23356 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23376 | function |  | 2 |
| `pointAt` | 23382 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23409 | function |  | 3 |
| `applyBranchRootOffset` | 23481 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23500 | function |  | 3 |
| `branchChildrenFor` | 23520 | function |  | 9 |
| `detachBranch` | 23524 | function |  | 2 |
| `updateBranchChildren` | 23535 | function |  | 4 |
| `clumpDirectMembers` | 23578 | function |  | 3 |
| `clumpMembersForGuide` | 23583 | function |  | 6 |
| `clumpGuideForLock` | 23587 | function |  | 13 |
| `proceduralGuideForLock` | 23592 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23599 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23606 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23613 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23625 | function |  | 2 |
| `applyProceduralBranchSettings` | 23638 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23677 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23693 | function |  | 3 |
| `createProceduralAccessoryLock` | 23707 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23759 | function |  | 2 |
| `clumpFrameAt` | 23810 | function |  | 5 |
| `commitClumpMemberRestState` | 23818 | function |  | 10 |
| `updateClumpMembers` | 23901 | function |  | 10 |
| `dissolveClump` | 24005 | function |  | 6 |
| `detachLockFromClump` | 24042 | function |  | 4 |
| `updateDrawVolumePreview` | 24068 | function |  | 5 |
| `hideDrawClumpPreviews` | 24092 | function |  | 5 |
| `resetDrawVolumePreview` | 24098 | function |  | 3 |
| `updateDrawStrandPreview` | 24104 | function |  | 23 |
| `continueFromTipEnabled` | 24323 | function |  | 2 |
| `selectedTipContinuationLock` | 24329 | function |  | 3 |
| `selectedDrawBranchPoint` | 24342 | function |  | 3 |
| `canBranchDrawFromLock` | 24359 | function |  | 3 |
| `beginDrawStrandStroke` | 24366 | function |  | 2 |
| `beginDrawFreePlane` | 24491 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24505 | function |  | 2 |
| `updateDrawStrandStroke` | 24530 | function |  | 1 |
| `createDrawnLock` | 24576 | function |  | 3 |
| `setting` | 24580 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24648 | function |  | 4 |
| `createDrawnBraid` | 24656 | function |  | 2 |
| `createDrawnStrand` | 24713 | function |  | 2 |
| `createDrawnPanel` | 24840 | function |  | 2 |
| `surfaceLatticeNormal` | 24890 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24905 | function |  | 3 |
| `createViewportSurface` | 24970 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24999 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25005 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25012 | function |  | 4 |
| `updateLoftSurfacePreview` | 25021 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25053 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25069 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25087 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25109 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25135 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25145 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25149 | function |  | 2 |
| `curveSurfacePreviewLock` | 25158 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25181 | function |  | 2 |
| `hideCurveSurfacePreview` | 25197 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25209 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25214 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25223 | function |  | 3 |
| `curveSurfaceSideVector` | 25261 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25274 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25282 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25295 | function |  | 5 |
| `updateCurveSurfacePreview` | 25315 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25377 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25399 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25414 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25462 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25497 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25529 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25587 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25664 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25669 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25678 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25712 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25723 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25753 | function |  | 2 |
| `extendDrawnStrand` | 25810 | function |  | 2 |
| `finishDrawStrandStroke` | 25843 | function |  | 7 |
| `createPlacedStrand` | 25870 | function |  | 2 |
| `placedPointCount` | 25934 | function |  | 3 |
| `createPlacedPoints` | 25938 | function |  | 3 |
| `pushPointOutsideHead` | 25957 | function |  | 8 |
| `resizePlacedStrand` | 25989 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26006 | function |  | 5 |
| `beginPlaceEdit` | 26011 | function |  | 2 |
| `updatePlaceEdit` | 26029 | function |  | 1 |
| `updatePlacementLength` | 26043 | function |  | 3 |
| `updatePlacementOrientation` | 26053 | function |  | 3 |
| `endPlaceEdit` | 26071 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26086 | function |  | 1 |
| `pendingPlacedLock` | 26096 | function |  | 2 |
| `beginPlacementPointer` | 26100 | function |  | 3 |
| `finishPlacementPointer` | 26110 | function |  | 2 |
| `confirmPlacementStep` | 26134 | function |  | 2 |
| `finishPlacementFlow` | 26157 | function |  | 7 |
| `updatePlacementStatus` | 26170 | function |  | 83 |
| `deselectStrands` | 26309 | function |  | 12 |
| `beginSelectionMarquee` | 26324 | function |  | 3 |
| `beginAltOrbit` | 26348 | function |  | 1 |
| `beginBlenderNavigation` | 26360 | function |  | 1 |
| `endBlenderNavigation` | 26405 | function |  | 1 |
| `prepareSelectPointerCapture` | 26413 | function |  | 1 |
| `endSelectPointerCapture` | 26419 | function |  | 1 |
| `endAltOrbit` | 26425 | function |  | 1 |
| `dollyCameraByDrag` | 26432 | function |  | 2 |
| `fastDragMagnitude` | 26455 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26461 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26469 | function |  | 1 |
| `endHoudiniZoomDrag` | 26486 | function |  | 1 |
| `updateSelectionMarquee` | 26494 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26511 | function |  | 3 |
| `selectPointsInMarquee` | 26519 | function |  | 2 |
| `pointKey` | 26545 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26576 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26613 | function |  | 3 |
| `projectedPoint` | 26630 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26659 | function |  | 2 |
| `finishSelectionMarquee` | 26704 | function |  | 2 |
| `headMeshes` | 26727 | function |  | 9 |
| `strandSplitProfileData` | 26735 | function |  | 4 |
| `strandSplitControlPoint` | 26748 | function |  | 4 |
| `panelSplitControlPoint` | 26784 | function |  | 6 |
| `strandControlPointRaycast` | 26840 | function |  | 1 |
| `strandControlPointFrame` | 26875 | function |  | 6 |
| `branchRootGizmoFrame` | 26906 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26924 | function |  | 5 |
| `createCurveObjects` | 26982 | function |  | 4 |
| `polyEdgeKey` | 27155 | function |  | 2 |
| `polyMeshEdges` | 27159 | function |  | 2 |
| `populatePolyEditObjects` | 27173 | function |  | 3 |
| `createPolyEditObjects` | 27234 | function |  | 2 |
| `rebuildPolyEditObjects` | 27242 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27256 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27263 | function |  | 2 |
| `strandWidthEdgeSample` | 27272 | function |  | 3 |
| `strandWidthEdgePoints` | 27295 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27309 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27313 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27320 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27332 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27337 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27343 | function |  | 3 |
| `updateCurveObjects` | 27357 | function |  | 41 |
| `createCurveNormalIndicator` | 27614 | function |  | 2 |
| `pointUpDirection` | 27640 | function |  | 2 |
| `curveFrameAtPoint` | 27644 | function |  | 5 |
| `curveFrameAt` | 27665 | function |  | 10 |
| `strandTwistAt` | 27685 | function |  | 6 |
| `controlPointRotationAt` | 27690 | function |  | 6 |
| `strandProfileTwistAt` | 27694 | function |  | 2 |
| `strandFrameAt` | 27700 | function |  | 1 |
| `curveFrameAtSnapshot` | 27706 | function |  | 3 |
| `outwardNormalAtPoint` | 27725 | function |  | 11 |
| `sampledSurfaceNormal` | 27737 | function |  | 2 |
| `guidedNormalAt` | 27753 | function |  | 5 |
| `twistFromHandle` | 27772 | function |  | 3 |
| `signedAngleAroundAxis` | 27793 | function |  | 5 |
| `handleColor` | 27800 | function |  | 2 |
| `isAffectedCurvePoint` | 27823 | function |  | 2 |
| `syncLockFromCurve` | 27829 | function |  | 26 |
| `labelForPreset` | 27859 | function |  | 1 |
| `rebuildLockGeometry` | 27863 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27890 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27898 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27904 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27926 | function |  | 8 |
| `updateLockGeometry` | 27939 | function |  | 57 |
| `setGroupColorView` | 27960 | function |  | 2 |
| `createUvCheckerTexture` | 27970 | function |  | 3 |
| `ensureUvCheckerForLock` | 28006 | function |  | 4 |
| `removeUvCheckerFromLock` | 28039 | function |  | 3 |
| `invalidateUvInspector` | 28054 | function |  | 7 |
| `uvInspectorRecord` | 28058 | function |  | 1 |
| `uvInspectorRecords` | 28097 | function |  | 2 |
| `drawUvInspectorGrid` | 28101 | function |  | 2 |
| `renderUvInspector` | 28135 | function |  | 3 |
| `setUvCheckerEnabled` | 28194 | function |  | 3 |
| `strandViewportBaseColor` | 28211 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28246 | function |  | 3 |
| `syncStrandSelectionOutline` | 28252 | function |  | 2 |
| `applyLockedStrandPalette` | 28263 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28272 | function |  | 6 |
| `setStrandSelectionVisual` | 28281 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28297 | function |  | 2 |
| `syncProceduralParentVisibility` | 28304 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28313 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28317 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28321 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28334 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28354 | function |  | 3 |
| `selectLock` | 28387 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28440 | function |  | 6 |
| `syncGroupInputs` | 28451 | function |  | 3 |
| `topologyStatsForLock` | 28484 | function |  | 4 |
| `formatTopologyStats` | 28492 | function |  | 5 |
| `updateTopologyStats` | 28496 | function |  | 20 |
| `normalizeBraidDimensions` | 28530 | function |  | 4 |
| `normalizeStrandDimensions` | 28543 | function |  | 3 |
| `strandBaseWidth` | 28557 | function |  | 5 |
| `strandWidthDimension` | 28561 | function |  | 5 |
| `strandDepthDimension` | 28569 | function |  | 8 |
| `setStrandWidthDimension` | 28577 | function |  | 2 |
| `setStrandDepthDimension` | 28599 | function |  | 4 |
| `syncShapeDimensionInputs` | 28615 | function |  | 4 |
| `syncCreationShapeInputs` | 28651 | function |  | 5 |
| `syncViewportDrawSettings` | 28689 | function |  | 5 |
| `syncPanelShapeInputs` | 28703 | function |  | 6 |
| `syncStrandSplitInputs` | 28729 | function |  | 4 |
| `syncHairCardControls` | 28738 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28746 | function |  | 3 |
| `updateAttributeEditorMode` | 28785 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28935 | function |  | 3 |
| `curveLatticeForGroup` | 28958 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28976 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29021 | function |  | 2 |
| `showCurveLatticeForGroup` | 29038 | function |  | 2 |
| `selectStrandGroup` | 29075 | function |  | 3 |
| `selectCurvePoint` | 29117 | function |  | 10 |
| `updateSelectedPointLabel` | 29131 | function |  | 14 |
| `syncInputs` | 29144 | function |  | 16 |
| `syncClumpGuidePanel` | 29190 | function |  | 3 |
| `getSelectedLock` | 29217 | function |  | 105 |
| `selectedLocksInOrder` | 29221 | function |  | 37 |
| `lockStrands` | 29227 | function |  | 3 |
| `lockSelectedStrands` | 29260 | function |  | 3 |
| `unlockStrands` | 29266 | function |  | 3 |
| `unlockAllStrands` | 29281 | function |  | 3 |
| `strandEditFamily` | 29285 | function |  | 7 |
| `compatibleSelectedLocks` | 29290 | function |  | 6 |
| `selectedEditRoots` | 29297 | function |  | 2 |
| `editSelectedLocks` | 29310 | function |  | 21 |
| `multiEditValuesEqual` | 29343 | function |  | 2 |
| `setMixedControl` | 29352 | function |  | 28 |
| `syncMultiStrandInputs` | 29369 | function |  | 16 |
| `values` | 29385 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29465 | function |  | 5 |
| `createCompoundStrand` | 29472 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29533 | function |  | 9 |
| `openRebuildCurveDialog` | 29546 | function |  | 1 |
| `rebuildSelectedCurves` | 29560 | function |  | 2 |
| `selectionCanBecomeClump` | 29599 | function |  | 4 |
| `createClumpFromSelection` | 29604 | function |  | 3 |
| `cleanSelectionSets` | 29616 | function |  | 2 |
| `createSelectionSetFromSelection` | 29621 | function |  | 3 |
| `selectionSetById` | 29632 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29636 | function |  | 7 |
| `editSelectionSetFromSelection` | 29645 | function |  | 5 |
| `deleteSelectionSet` | 29665 | function |  | 2 |
| `selectSelectionSet` | 29674 | function |  | 2 |
| `deleteSelectedStrands` | 29684 | function |  | 4 |
| `deleteGuide` | 29692 | function |  | 3 |
| `deleteSelectedGuide` | 29715 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29719 | function |  | 4 |
| `hasDeletableSelection` | 29732 | function |  | 2 |
| `deleteCurrentSelection` | 29740 | function |  | 3 |
| `hideOutlinerContextMenu` | 29748 | function |  | 17 |
| `outlinerLockTargets` | 29753 | function |  | 3 |
| `showOutlinerContextMenu` | 29780 | function |  | 10 |
| `hideStrandRadialMenu` | 29860 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29871 | function |  | 3 |
| `radialButtonDimensions` | 29884 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29893 | function |  | 3 |
| `applyRadialMenuDimensions` | 29910 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29916 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29929 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29950 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29967 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29976 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29998 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30016 | function |  | 2 |
| `contextualRadialOptions` | 30023 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30152 | function |  | 3 |
| `layoutContextualRadialOptions` | 30156 | function |  | 4 |
| `renderRadialActionList` | 30180 | function |  | 3 |
| `radialListOptionAtPointer` | 30198 | function |  | 3 |
| `syncRadialListHighlight` | 30220 | function |  | 3 |
| `configureContextualRadialMenu` | 30226 | function |  | 3 |
| `beginStrandRadialGesture` | 30286 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30320 | function |  | 2 |
| `updateStrandRadialGesture` | 30366 | function |  | 1 |
| `performStrandRadialAction` | 30405 | function |  | 2 |
| `finishStrandRadialGesture` | 30508 | function |  | 2 |
| `cancelStrandRadialGesture` | 30518 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30525 | function |  | 1 |
| `setPullMoveEnabled` | 30531 | function |  | 3 |
| `toolRadialOptions` | 30539 | function |  | 2 |
| `hideToolRadialMenu` | 30564 | function |  | 4 |
| `beginToolRadialGesture` | 30577 | function |  | 2 |
| `beginToolShortcutPress` | 30617 | function |  | 2 |
| `finishToolShortcutPress` | 30632 | function |  | 2 |
| `cancelToolShortcutPress` | 30641 | function |  | 5 |
| `setRadialMenusEnabled` | 30649 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30662 | function |  | 5 |
| `setNavigationTipsEnabled` | 30677 | function |  | 5 |
| `configureNavigationMouseButtons` | 30684 | function |  | 3 |
| `syncNavigationModifierLocks` | 30697 | function |  | 7 |
| `setNavigationStyle` | 30702 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30718 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30733 | function |  | 5 |
| `setCameraSmoothingStrength` | 30739 | function |  | 5 |
| `setScaleSensitivity` | 30747 | function |  | 3 |
| `setToolTipsEnabled` | 30755 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30762 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30771 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30779 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30794 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30803 | function |  | 5 |
| `sideNamingDisplayId` | 30812 | function |  | 3 |
| `referenceViewDisplayLabel` | 30824 | function |  | 6 |
| `strandRegionDisplayLabel` | 30834 | function |  | 10 |
| `updateSideNamingLabels` | 30852 | function |  | 2 |
| `setSideNamingPerspective` | 30879 | function |  | 5 |
| `setControlPointDisplaySize` | 30888 | function |  | 6 |
| `scaleHexColor` | 30900 | function |  | 3 |
| `setViewportBackgroundColor` | 30905 | function |  | 7 |
| `setDefaultHairShader` | 30927 | function |  | 5 |
| `setPreferenceCategory` | 30933 | function |  | 4 |
| `openPreferencesDialog` | 30960 | function |  | 1 |
| `savePreferencesDialog` | 30988 | function |  | 1 |
| `cancelPreferencesDialog` | 31012 | function |  | 3 |
| `updateToolRadialGesture` | 31041 | function |  | 1 |
| `performToolRadialAction` | 31070 | function |  | 2 |
| `finishToolRadialGesture` | 31080 | function |  | 2 |
| `cancelToolRadialGesture` | 31089 | function |  | 5 |
| `duplicatePlacementTarget` | 31096 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31123 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31127 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31137 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31142 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31154 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31165 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31173 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31190 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31211 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31222 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31228 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31234 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31267 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31422 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31524 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31565 | function |  | 2 |
| `updateDuplicatePlacement` | 31592 | function |  | 2 |
| `beginDuplicatePlacement` | 31656 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31720 | function |  | 2 |
| `confirmDuplicatePlacement` | 31761 | function |  | 1 |
| `cancelDuplicatePlacement` | 31798 | function |  | 4 |
| `outlinerClumpLocks` | 31824 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31828 | function |  | 3 |
| `createOutlinerStrandButton` | 31851 | function |  | 4 |
| `createOutlinerCurveSurface` | 31937 | function |  | 2 |
| `createOutlinerClump` | 32033 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32115 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32122 | function |  | 2 |
| `renderLockList` | 32201 | function |  | 70 |
| `updateCount` | 32355 | function |  | 34 |
| `captureInputUndo` | 32364 | function |  | 1 |
| `bindUndoCapture` | 32370 | function |  | 36 |
| `bindLockInput` | 32381 | function |  | 2 |
| `applyValue` | 32398 | arrow |  | 2 |
| `applyUniformTransformScale` | 32717 | function |  | 2 |
| `applyReducedTransformScale` | 32734 | function |  | 2 |
| `applyTransformPrecision` | 32773 | function |  | 2 |
| `updateTransformScalePointer` | 32802 | function |  | 1 |
| `finishSweepProfileDrag` | 33033 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33129 | function |  | 3 |
| `finishTaperCurveDrag` | 33191 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33234 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33315 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33370 | function |  | 6 |
| `updateSelectedTaperPoint` | 33394 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33966 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33971 | function |  | 4 |
| `syncDrawCurlControls` | 34026 | function |  | 5 |
| `handleLiveSurfaceChange` | 34074 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34156 | function |  | 3 |
| `resampleSurfaceLock` | 34171 | function |  | 2 |
| `changePanelSplitCount` | 34284 | function |  | 3 |
| `presetNumber` | 34388 | function |  | 23 |
| `clonePresetShape` | 34393 | function |  | 7 |
| `creationPresetSnapshot` | 34402 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34450 | function |  | 5 |
| `applyPresetControl` | 34477 | function |  | 2 |
| `applyCreationToolSettings` | 34498 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34538 | function |  | 3 |
| `loadCustomCreationPresets` | 34545 | function |  | 2 |
| `saveCustomCreationPresets` | 34555 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34563 | function |  | 2 |
| `populateCreationPresetSelect` | 34599 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34623 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34656 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34661 | function |  | 2 |
| `applyCustomCreationPreset` | 34678 | function |  | 3 |
| `createCustomCreationPreset` | 34699 | function |  | 3 |
| `createCustomClumpPreset` | 34714 | function |  | 3 |
| `commitCustomCreationPreset` | 34729 | function |  | 2 |
| `openRemoveCreationPreset` | 34790 | function |  | 3 |
| `commitRemoveCreationPreset` | 34803 | function |  | 1 |
| `applyBraidToolPreset` | 34820 | function |  | 2 |
| `selectedBranchChildLock` | 34932 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34936 | function |  | 2 |
| `initPanelResizeHandles` | 35042 | function |  | 2 |
| `applyWidth` | 35048 | arrow |  | 2 |
| `restoreWidth` | 35055 | arrow |  | 2 |
| `bindResize` | 35063 | arrow |  | 2 |
| `onMove` | 35071 | arrow |  | 0 |
| `onUp` | 35075 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35092 | function |  | 2 |
| `initFloatingPanelControls` | 35101 | function |  | 2 |
| `detach` | 35110 | arrow |  | 43 |
| `endDrag` | 35148 | arrow |  | 0 |
| `endResize` | 35180 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35191 | function |  | 3 |
| `selectPatchNotesVersion` | 35325 | function |  | 3 |
| `requestReferenceImage` | 35358 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35562 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35568 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35575 | function |  | 1 |
| `deleteLocks` | 36142 | function |  | 10 |
| `disposeCurveObjects` | 36220 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36272 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36303 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36378 | function |  | 2 |
| `resize` | 36411 | function |  | 4 |
| `handleViewportPointerMove` | 36422 | function |  | 1 |
| `blockProportionalSizingEvent` | 36433 | function |  | 1 |
| `updateLightAngleFromInputs` | 36439 | function |  | 2 |
| `startViewSnap` | 36453 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36483 | function |  | 3 |
| `trackViewportPointerDown` | 36500 | function |  | 1 |
| `trackViewportPointerMove` | 36516 | function |  | 1 |
| `clearViewportPointer` | 36524 | function |  | 1 |
| `updateViewSnap` | 36529 | function |  | 1 |
| `nearestCardinalAxis` | 36565 | function |  | 5 |
| `cardinalAxisKey` | 36579 | function |  | 5 |
| `steppedDragAmount` | 36583 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36589 | function |  | 4 |
| `endViewSnap` | 36605 | function |  | 4 |
| `activateStrandControlPoint` | 36615 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36665 | function |  | 4 |
| `addStrandControlPointSelection` | 36692 | function |  | 3 |
| `removeStrandControlPointSelection` | 36709 | function |  | 3 |
| `sampleStrandPointNormal` | 36723 | function |  | 2 |
| `sampleStrandPointVectors` | 36733 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36739 | function |  | 2 |
| `resampleStrandCurveData` | 36750 | function |  | 4 |
| `resampleMatchingVectors` | 36756 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36795 | function |  | 4 |
| `removeStrandCurvePoint` | 36806 | function |  | 2 |
| `closestStrandCurveParameter` | 36819 | function |  | 2 |
| `insertStrandCurvePoint` | 36848 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36865 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36875 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36891 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36898 | function |  | 4 |
| `prepareCurvePointSelection` | 36920 | function |  | 1 |
| `finishCurvePointInsertion` | 37031 | function |  | 1 |
| `finishPointRemoval` | 37046 | function |  | 1 |
| `editableStrandWidth` | 37064 | function |  | 6 |
| `editableStrandWidthBounds` | 37076 | function |  | 2 |
| `applyEditableStrandWidth` | 37082 | function |  | 3 |
| `viewportPixelPoint` | 37118 | function |  | 3 |
| `syncSculptBrushControls` | 37126 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37141 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37149 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37157 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37163 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37167 | function |  | 7 |
| `updateSculptBrushCursor` | 37174 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37196 | function |  | 4 |
| `sculptBrushEditableLock` | 37203 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37213 | function |  | 5 |
| `sculptBrushLockViable` | 37219 | function |  | 5 |
| `sculptBrushUnits` | 37230 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37269 | function |  | 4 |
| `sculptBrushPointWeight` | 37319 | function |  | 5 |
| `sculptBrushWorldDelta` | 37329 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37338 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37364 | function |  | 2 |
| `beginSculptMoveStroke` | 37422 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37484 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37719 | function |  | 3 |
| `updateSculptMoveStroke` | 37728 | function |  | 1 |
| `finishSculptMoveStroke` | 37744 | function |  | 3 |
| `strandControlPointHit` | 37792 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37796 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37874 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37908 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37948 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37961 | function |  | 1 |
| `setHoveredControlPoint` | 38000 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38013 | function |  | 2 |
| `updateControlPointHover` | 38049 | function |  | 1 |
| `animate` | 38606 | function |  | 2 |
| `syncCompactSidebarLayout` | 38639 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38658 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38664 | function |  | 3 |
| `setAttributeEditorTab` | 38670 | function |  | 6 |

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
