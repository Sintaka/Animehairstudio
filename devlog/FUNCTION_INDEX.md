# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1737** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（36410 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 264 | function |  | 3 |
| `saveBooleanPreference` | 292 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 296 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 301 | function |  | 2 |
| `normalizeScaleSensitivity` | 306 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 311 | function |  | 2 |
| `normalizeSideNamingPerspective` | 316 | function |  | 2 |
| `normalizeNavigationStyle` | 320 | function |  | 2 |
| `setupEditableSliderControls` | 335 | function |  | 2 |
| `syncNumberFromRange` | 386 | arrow |  | 0 |
| `applyNumberValue` | 393 | arrow |  | 0 |
| `copyCameraPose` | 499 | function |  | 3 |
| `updateCameraProjectionForViewport` | 505 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 518 | function |  | 3 |
| `setOrthographicView` | 524 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 564 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 593 | function |  | 2 |
| `removeRotateFreeAxisRing` | 619 | function |  | 2 |
| `deflateTransformGizmoPickers` | 631 | function |  | 2 |
| `nextStrandName` | 1010 | function |  | 2 |
| `activeDrawClumpTemplate` | 1095 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1100 | function |  | 3 |
| `drawModeCreatesClump` | 1127 | function |  | 1 |
| `isPanelGeometry` | 1271 | function |  | 31 |
| `normalizePanelSplits` | 1275 | function |  | 3 |
| `clonePanelSplits` | 1287 | function |  | 19 |
| `snapPanelSplitHeight` | 1291 | function |  | 5 |
| `createQuadSphereGeometry` | 1326 | function |  | 2 |
| `vertexIndex` | 1340 | function |  | 11 |
| `addEdge` | 1358 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1393 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1463 | function |  | 3 |
| `updateScalpRenderGeometry` | 1489 | function |  | 4 |
| `writeScalpRegionColors` | 1540 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1553 | function |  | 2 |
| `createScalpSelectionOutline` | 1583 | function |  | 5 |
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
| `currentStrandSelectionState` | 2089 | function |  | 4 |
| `applyStrandSelectionState` | 2093 | function |  | 5 |
| `clearStrandSelectionState` | 2098 | function |  | 7 |
| `guideHeadBounds` | 3078 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3088 | function |  | 5 |
| `disposeGuideModel` | 3102 | function |  | 3 |
| `syncHeadTransformInputs` | 3113 | function |  | 4 |
| `applyHeadTransform` | 3120 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3138 | function |  | 4 |
| `applyScalpRoughScale` | 3147 | function |  | 5 |
| `resetHeadTransform` | 3161 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3175 | function |  | 2 |
| `installGuideModel` | 3191 | function |  | 5 |
| `loadDefaultGuideModel` | 3267 | function |  | 3 |
| `braidTemplateFromEntries` | 3290 | function |  | 4 |
| `braidMeshEntries` | 3322 | function |  | 2 |
| `prepareBraidBodyCache` | 3334 | function |  | 2 |
| `quantize` | 3343 | arrow |  | 21 |
| `sourceNormalAt` | 3355 | arrow |  | 1 |
| `clusterBoundary` | 3358 | arrow |  | 2 |
| `normalBuckets` | 3375 | arrow |  | 2 |
| `applyBucketPair` | 3407 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3438 | function |  | 2 |
| `annotateBraidObjTopology` | 3459 | function |  | 2 |
| `loadBraidMeshPreset` | 3479 | function |  | 3 |
| `createSplitControlHandle` | 3496 | function |  | 4 |
| `frameGuideModel` | 3511 | function |  | 2 |
| `syncScalpInputs` | 3536 | function |  | 2 |
| `syncScalpArtistInputs` | 3542 | function |  | 2 |
| `rootScalpOffsetDistance` | 3550 | function |  | 15 |
| `applyLockRootScalpOffset` | 3555 | function |  | 5 |
| `normalizeHairLayer` | 3571 | function |  | 27 |
| `layerOffsetForLock` | 3575 | function |  | 9 |
| `layerRootOffsetFactor` | 3580 | function |  | 13 |
| `layerOffsetWeight` | 3584 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3590 | function |  | 5 |
| `pointsWithLayerOffset` | 3599 | function |  | 3 |
| `layerDirectionForLock` | 3607 | function |  | 2 |
| `applyLayerOffset` | 3618 | function |  | 5 |
| `setLockHairLayer` | 3642 | function |  | 2 |
| `setGroupLayerOffset` | 3657 | function |  | 2 |
| `scalpArtistWeight` | 3669 | function |  | 3 |
| `scalpArtistScalesAt` | 3673 | function |  | 3 |
| `applyScalpArtistShape` | 3683 | function |  | 5 |
| `inverseScalpArtistShape` | 3701 | function |  | 2 |
| `updateScalpSurface` | 3728 | function |  | 3 |
| `setActiveScalpRegion` | 3738 | function |  | 2 |
| `clearScalpRegions` | 3750 | function |  | 2 |
| `scalpHitFromEvent` | 3767 | function |  | 3 |
| `updateScalpBrushCursor` | 3775 | function |  | 4 |
| `paintScalpAt` | 3790 | function |  | 3 |
| `beginScalpPaint` | 3857 | function |  | 2 |
| `updateScalpPaint` | 3866 | function |  | 1 |
| `endScalpPaint` | 3875 | function |  | 2 |
| `createScalpLattice` | 3882 | function |  | 2 |
| `resetScalpLattice` | 3907 | function |  | 1 |
| `updateScalpLatticeObjects` | 3919 | function |  | 7 |
| `quadraticWeights` | 3933 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3938 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3965 | function |  | 3 |
| `selectScalpLatticePoint` | 3980 | function |  | 2 |
| `beginScalpLatticeDrag` | 3995 | function |  | 2 |
| `updateScalpLatticeDrag` | 4013 | function |  | 1 |
| `endScalpLatticeDrag` | 4031 | function |  | 2 |
| `setHeadReferenceTransparency` | 4037 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4047 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4065 | function |  | 3 |
| `trianglePlaneIntersections` | 4073 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4094 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4120 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4130 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4142 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4166 | function |  | 3 |
| `createScalpBuilderPlanes` | 4181 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4213 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4251 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4274 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4286 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4298 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4303 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4315 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4425 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4450 | function |  | 5 |
| `syncEditedScalpSurface` | 4465 | function |  | 4 |
| `ensureEditedScalpSurface` | 4536 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4566 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4651 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4664 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4680 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4690 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4708 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4721 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4728 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4747 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4761 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4802 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4811 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4824 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4845 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4982 | function |  | 2 |
| `scalpTemplateNeighbors` | 4990 | function |  | 2 |
| `smoothScalpVectorField` | 5002 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5016 | function |  | 2 |
| `upperContourCurve` | 5033 | function |  | 4 |
| `hermitePoint` | 5068 | function |  | 2 |
| `curveNetworkSection` | 5079 | function |  | 3 |
| `pointAlongSection` | 5108 | function |  | 3 |
| `longestStitchedContour` | 5114 | function |  | 2 |
| `nodeForPoint` | 5122 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5179 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5189 | function |  | 1 |
| `orderedRange` | 5201 | arrow |  | 3 |
| `clipSegment` | 5224 | arrow |  | 1 |
| `liftedPoint` | 5247 | arrow |  | 5 |
| `boundaryCorner` | 5252 | arrow |  | 4 |
| `surfaceCurveBetween` | 5261 | arrow |  | 1 |
| `addSurfaceConnector` | 5284 | arrow |  | 2 |
| `sideContourAtDepth` | 5352 | arrow |  | 3 |
| `addSurfacePatch` | 5386 | arrow |  | 1 |
| `addCenterBridgePatch` | 5466 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5574 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5609 | function |  | 1 |
| `generatedScalpObjContent` | 5699 | function |  | 2 |
| `generateScalpFromBuilder` | 5713 | function |  | 1 |
| `orderedDepthRange` | 5749 | arrow |  | 7 |
| `resetScalpBuilder` | 5878 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5893 | function |  | 1 |
| `beginScalpBuilderInput` | 5907 | function |  | 2 |
| `updateScalpBuilderStroke` | 5908 | function |  | 1 |
| `finishScalpBuilderStroke` | 5909 | function |  | 2 |
| `setScalpBuilderEditing` | 5911 | function |  | 10 |
| `updateScalpEditingVisibility` | 5945 | function |  | 12 |
| `exitSetupEditors` | 6039 | function |  | 7 |
| `setCapsuleGuideEditing` | 6048 | function |  | 5 |
| `syncAppMenuVisibility` | 6076 | function |  | 3 |
| `closeAppMenus` | 6081 | function |  | 6 |
| `setAppMenuOpen` | 6092 | function |  | 3 |
| `setTurntableActive` | 6099 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6108 | function |  | 9 |
| `selectedReferenceImage` | 6112 | function |  | 20 |
| `normalizeReferenceCrop` | 6118 | function |  | 8 |
| `referenceCropIsFull` | 6126 | function |  | 3 |
| `referencePlaneFrontAxis` | 6131 | function |  | 4 |
| `referencePlanePlacement` | 6140 | function |  | 4 |
| `migratedReferencePlanePosition` | 6155 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6175 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6192 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6208 | function |  | 2 |
| `snappedReferenceImageView` | 6231 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6237 | function |  | 5 |
| `applyReferenceImageRuntime` | 6253 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6296 | function |  | 6 |
| `createReferenceImageRuntime` | 6304 | function |  | 3 |
| `addReferenceImage` | 6373 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6425 | function |  | 3 |
| `disposeReferenceImage` | 6444 | function |  | 2 |
| `clearReferenceImages` | 6448 | function |  | 2 |
| `serializeReferenceImage` | 6455 | function |  | 1 |
| `setReferenceImageType` | 6483 | function |  | 2 |
| `attachReferenceImageTransform` | 6527 | function |  | 6 |
| `selectReferenceImage` | 6541 | function |  | 12 |
| `placeReferencePlane` | 6564 | function |  | 2 |
| `setReferencePlaneInFront` | 6575 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6585 | function |  | 4 |
| `renderReferenceImagePanel` | 6604 | function |  | 20 |
| `setOutlinerTab` | 6651 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6669 | function |  | 4 |
| `componentEditModeActive` | 6673 | function |  | 37 |
| `selectionToolSupportsPicking` | 6677 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6682 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6698 | function |  | 2 |
| `setViewportSelectionMode` | 6728 | function |  | 4 |
| `setViewportEditMode` | 6740 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6782 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6796 | function |  | 8 |
| `outlinerGuides` | 6808 | function |  | 3 |
| `guideOutlinerLabel` | 6815 | function |  | 2 |
| `normalizeOutlinerName` | 6825 | function |  | 4 |
| `beginOutlinerRename` | 6830 | function |  | 2 |
| `finish` | 6841 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6871 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6881 | function |  | 2 |
| `renderGuideOutliner` | 6916 | function |  | 10 |
| `referenceOutlinerGroup` | 6974 | function |  | 2 |
| `renderReferenceOutliner` | 6978 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7095 | function |  | 5 |
| `readReferenceImageFile` | 7100 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7124 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7131 | function |  | 3 |
| `dragContainsReferenceImage` | 7176 | function |  | 3 |
| `setReferenceImageDragActive` | 7187 | function |  | 9 |
| `referenceDropDestination` | 7195 | function |  | 2 |
| `viewportOverlayDropPosition` | 7201 | function |  | 2 |
| `setReferenceDropHover` | 7210 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7228 | function |  | 2 |
| `referenceOverlayAtPointer` | 7248 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7266 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7279 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7325 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7375 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7397 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7408 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7434 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7443 | function |  | 2 |
| `referenceCropCursor` | 7458 | function |  | 3 |
| `updateReferenceCropHandles` | 7464 | function |  | 5 |
| `referenceCropSourcePoint` | 7485 | function |  | 2 |
| `beginReferenceCrop` | 7492 | function |  | 1 |
| `updateReferenceCrop` | 7530 | function |  | 1 |
| `finishReferenceCrop` | 7562 | function |  | 4 |
| `setHeadSetupEditing` | 7580 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7596 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7605 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7615 | function |  | 4 |
| `setScalpGuideVisibility` | 7621 | function |  | 12 |
| `currentGuideViewMode` | 7629 | function |  | 3 |
| `updateGuideViewToggle` | 7637 | function |  | 5 |
| `setGuideViewMode` | 7653 | function |  | 3 |
| `cycleGuideViewMode` | 7664 | function |  | 1 |
| `hideGuideViewContextMenu` | 7669 | function |  | 6 |
| `showGuideViewContextMenu` | 7673 | function |  | 1 |
| `strandPassesDisplayFilters` | 7686 | function |  | 4 |
| `strandVisibleForDisplay` | 7695 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7700 | function |  | 2 |
| `lockedStrandsExist` | 7704 | function |  | 3 |
| `hiddenStrandsExist` | 7708 | function |  | 2 |
| `hideSelectedStrands` | 7712 | function |  | 2 |
| `unhideHiddenStrands` | 7722 | function |  | 2 |
| `strandIsolationActive` | 7731 | function |  | 7 |
| `setStrandIsolation` | 7735 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7747 | function |  | 3 |
| `syncVisibilityParent` | 7758 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7765 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7794 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7801 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7821 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7844 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7852 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7859 | function |  | 9 |
| `setScalpLatticeEditing` | 7870 | function |  | 4 |
| `setScalpShapeEditing` | 7885 | function |  | 9 |
| `setScalpPaintEditing` | 7903 | function |  | 7 |
| `defaultCurveLatticePoints` | 7927 | function |  | 3 |
| `flatCurveLatticePoints` | 7953 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7962 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7986 | function |  | 4 |
| `horizontalValue` | 7991 | arrow |  | 1 |
| `blendedSample` | 8002 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8035 | function |  | 2 |
| `curveLatticeControlPoint` | 8050 | function |  | 9 |
| `circularArcTangent` | 8054 | function |  | 4 |
| `arcLengthTo` | 8085 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8097 | function |  | 3 |
| `sampleHermiteCurve` | 8136 | function |  | 10 |
| `sampleCurveLattice` | 8153 | function |  | 6 |
| `curveLatticeNormal` | 8172 | function |  | 1 |
| `createCurveLatticeGeometry` | 8183 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8212 | function |  | 3 |
| `appendCurve` | 8214 | arrow |  | 4 |
| `sample` | 8216 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8243 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8259 | function |  | 3 |
| `addPicker` | 8261 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8300 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8313 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8317 | function |  | 3 |
| `curveLatticeEditablePoint` | 8335 | function |  | 13 |
| `curveLatticePointSection` | 8342 | function |  | 3 |
| `curveLatticeRestPoint` | 8353 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8359 | function |  | 7 |
| `curveLatticeRootColumns` | 8365 | function |  | 3 |
| `curveTangentsForPoints` | 8372 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8384 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8421 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8447 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8464 | function |  | 3 |
| `resampleGrid` | 8474 | arrow |  | 2 |
| `controlPointIsSelected` | 8501 | function |  | 7 |
| `clearMultiPointSelection` | 8509 | function |  | 9 |
| `createCurveLatticeHandles` | 8513 | function |  | 4 |
| `addCurveLattice` | 8535 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8644 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8675 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8681 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8720 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8741 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8758 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8767 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8774 | function |  | 1 |
| `selectCurveLatticeLoop` | 8793 | function |  | 3 |
| `selectCurveLatticePoint` | 8822 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8837 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8879 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8900 | function |  | 3 |
| `curveLatticeColumnPoints` | 8943 | function |  | 3 |
| `groupCurveControlIndices` | 8952 | function |  | 4 |
| `groupCurveControlPoints` | 8958 | function |  | 2 |
| `updateGroupCurveDisplay` | 8964 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8974 | function |  | 2 |
| `groupCurveDeformationPairs` | 8996 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9003 | function |  | 2 |
| `appendPairs` | 9005 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9016 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9035 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9056 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9075 | function |  | 2 |
| `capsuleGuideCapHeight` | 9109 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9113 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9118 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9122 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9134 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9150 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9156 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9182 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9212 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9266 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9287 | function |  | 7 |
| `vertex` | 9301 | function |  | 3 |
| `addFace` | 9307 | function |  | 3 |
| `addRing` | 9325 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9380 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9390 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9455 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9501 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9514 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9535 | function |  | 3 |
| `capsuleGuidePointDistances` | 9540 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9561 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9581 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9586 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9592 | function |  | 3 |
| `capsuleGuideAccentColor` | 9597 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9602 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9613 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9625 | function |  | 2 |
| `createCapsuleGuideHandles` | 9657 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9680 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9699 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9706 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9722 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9739 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9754 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9791 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9807 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9824 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9830 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9857 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9869 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9888 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9933 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9968 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9982 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9988 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10005 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10016 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10027 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10057 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10067 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10108 | function |  | 3 |
| `createQuadCageGeometry` | 10124 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10148 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10168 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10179 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10232 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10270 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10280 | function |  | 4 |
| `addCapsuleGuide` | 10288 | function |  | 4 |
| `addGuide` | 10357 | function |  | 1 |
| `createGuideGeometry` | 10418 | function |  | 4 |
| `selectGuide` | 10473 | function |  | 17 |
| `updateGuideControlsVisibility` | 10541 | function |  | 10 |
| `updateViewportToolVisibility` | 10558 | function |  | 7 |
| `getSelectedGuide` | 10597 | function |  | 34 |
| `selectedViewportFocusBounds` | 10601 | function |  | 2 |
| `frameViewportBounds` | 10615 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10645 | function |  | 2 |
| `fullSceneFocusBounds` | 10649 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10664 | function |  | 3 |
| `cycleViewportFraming` | 10673 | function |  | 2 |
| `syncGuideInputs` | 10691 | function |  | 5 |
| `updateGuideGeometry` | 10734 | function |  | 3 |
| `sculptBrushToolActive` | 10755 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10759 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10763 | function |  | 3 |
| `effectiveSculptBrushTool` | 10767 | function |  | 13 |
| `updateSculptScaleModeRow` | 10773 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10778 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10800 | function |  | 5 |
| `setActiveTool` | 10809 | function |  | 19 |
| `setDrawStrandMode` | 10947 | function |  | 2 |
| `setObjectSpaceEditing` | 10957 | function |  | 7 |
| `setHierarchyEditing` | 10973 | function |  | 4 |
| `setProportionalEditing` | 10985 | function |  | 5 |
| `beginProportionalSizeEdit` | 11004 | function |  | 3 |
| `updateProportionalSizeEdit` | 11016 | function |  | 2 |
| `endProportionalSizeEdit` | 11027 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11034 | function |  | 2 |
| `refreshProportionalPreview` | 11042 | function |  | 4 |
| `activeBrushSizeInput` | 11052 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11061 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11073 | function |  | 2 |
| `beginBrushSizeDrag` | 11091 | function |  | 1 |
| `updateBrushSizeDrag` | 11118 | function |  | 1 |
| `finishBrushSizeDrag` | 11139 | function |  | 2 |
| `updateInteractionLocks` | 11156 | function |  | 87 |
| `configureTransformControls` | 11167 | function |  | 16 |
| `pullMoveActive` | 11175 | function |  | 9 |
| `updatePullGuideVisual` | 11179 | function |  | 4 |
| `attachTransformForCurvePoint` | 11195 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11219 | function |  | 7 |
| `strandObjectRootIndex` | 11235 | function |  | 3 |
| `strandObjectRoot` | 11244 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11248 | function |  | 2 |
| `attachStrandObjectTransform` | 11253 | function |  | 6 |
| `guideObjectPivot` | 11276 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11287 | function |  | 2 |
| `attachGuideObjectTransform` | 11292 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11311 | function |  | 2 |
| `beginGuideObjectTransform` | 11339 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11346 | function |  | 2 |
| `updateGuideObjectTransform` | 11368 | function |  | 2 |
| `finishGuideObjectTransform` | 11401 | function |  | 2 |
| `clonePlacementFrame` | 11410 | function |  | 2 |
| `cloneOptionalVectors` | 11422 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11426 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11443 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11458 | function |  | 2 |
| `strandObjectTransformOperators` | 11474 | function |  | 4 |
| `transformPoint` | 11482 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11489 | arrow |  | 0 |
| `transformNormal` | 11495 | arrow |  | 10 |
| `transformDirection` | 11505 | arrow |  | 7 |
| `worldMatrixForPivot` | 11517 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11523 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11539 | function |  | 6 |
| `beginStrandObjectTransform` | 11565 | function |  | 2 |
| `updateStrandObjectTransform` | 11603 | function |  | 2 |
| `commitStrandObjectTransform` | 11661 | function |  | 2 |
| `mapPoints` | 11674 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11708 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11722 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11745 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11758 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11773 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11799 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11848 | function |  | 2 |
| `beginHandleEdit` | 11857 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 11910 | function |  | 3 |
| `multiPointHandleEditActive` | 11921 | function |  | 7 |
| `applyMultiMove` | 11925 | function |  | 5 |
| `applyMultiRotate` | 11931 | function |  | 2 |
| `applyMultiScale` | 11940 | function |  | 2 |
| `applyHierarchicalMove` | 11949 | function |  | 3 |
| `applySingleMove` | 11961 | function |  | 5 |
| `applySurfaceLatticeMirror` | 11965 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 11982 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 11991 | function |  | 3 |
| `changed` | 12001 | arrow |  | 1 |
| `applyPullMove` | 12043 | function |  | 3 |
| `pullHeadCollisionContext` | 12051 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12070 | function |  | 2 |
| `applyProportionalMove` | 12093 | function |  | 3 |
| `viewPlaneNormal` | 12104 | function |  | 20 |
| `isCameraInSnappedView` | 12108 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12116 | function |  | 10 |
| `updateViewPlaneGrid` | 12120 | function |  | 14 |
| `setViewPlaneMove` | 12177 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12188 | function |  | 2 |
| `rayFromViewportEvent` | 12196 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12204 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12214 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12225 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12238 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12257 | function |  | 4 |
| `beginViewPlaneMove` | 12264 | function |  | 3 |
| `updateViewPlaneMove` | 12328 | function |  | 1 |
| `endViewPlaneMove` | 12393 | function |  | 7 |
| `applyHierarchicalRotate` | 12412 | function |  | 2 |
| `rotateGuideNormal` | 12419 | arrow |  | 4 |
| `applySingleRotate` | 12457 | function |  | 2 |
| `applyProportionalRotate` | 12461 | function |  | 2 |
| `applyHierarchicalScale` | 12481 | function |  | 2 |
| `applySingleScale` | 12491 | function |  | 2 |
| `applyProportionalScale` | 12495 | function |  | 2 |
| `setPointScale` | 12511 | function |  | 8 |
| `proportionalWeight` | 12520 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12532 | function |  | 5 |
| `strandInfluenceColor` | 12538 | function |  | 13 |
| `beginRelaxEdit` | 12563 | function |  | 3 |
| `updateRelaxEdit` | 12592 | function |  | 1 |
| `endRelaxEdit` | 12652 | function |  | 1 |
| `disposeGuide` | 12662 | function |  | 3 |
| `removeGuideObjects` | 12690 | function |  | 3 |
| `strandRadiusAt` | 12704 | function |  | 5 |
| `strandProfileTopologyAt` | 12721 | function |  | 6 |
| `strandCurveParameters` | 12763 | function |  | 4 |
| `widthProfileAt` | 12773 | arrow |  | 1 |
| `braidFrameAt` | 12811 | function |  | 5 |
| `braidFrameAtExtended` | 12821 | function |  | 2 |
| `createBraidProfileProjector` | 12830 | function |  | 2 |
| `project` | 12846 | arrow |  | 17 |
| `createBraidGeometry` | 12861 | function |  | 2 |
| `deformationAt` | 12896 | function |  | 3 |
| `widthFor` | 12905 | arrow |  | 3 |
| `depthFor` | 12909 | arrow |  | 3 |
| `outputVertex` | 12941 | function |  | 7 |
| `appendAuthoredCap` | 13049 | function |  | 3 |
| `outputCapVertex` | 13056 | arrow |  | 6 |
| `capBoundary` | 13147 | function |  | 3 |
| `strandGeometryCurve` | 13209 | function |  | 12 |
| `strandGeometryFrameAt` | 13235 | function |  | 15 |
| `transportedStrandFrameAt` | 13298 | function |  | 6 |
| `twistOverrideAt` | 13301 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13329 | function |  | 2 |
| `weldPanelGeometryData` | 13365 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13405 | function |  | 3 |
| `surfacePanelPoint` | 13420 | function |  | 3 |
| `createPanelStrandGeometry` | 13443 | function |  | 2 |
| `addQuad` | 13477 | arrow |  | 6 |
| `near` | 13481 | arrow |  | 6 |
| `panelWidthAt` | 13511 | arrow |  | 6 |
| `panelThicknessAt` | 13520 | arrow |  | 6 |
| `panelFrameAt` | 13529 | arrow |  | 1 |
| `rawPanelPoint` | 13547 | arrow |  | 1 |
| `panelPoint` | 13567 | arrow |  | 2 |
| `addPatch` | 13573 | arrow |  | 1 |
| `splitOpening` | 13624 | arrow |  | 2 |
| `uStart` | 13648 | arrow |  | 1 |
| `uEnd` | 13651 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13689 | function |  | 3 |
| `inside` | 13690 | arrow |  | 2 |
| `pushOrientedTriangle` | 13712 | function |  | 7 |
| `triangulatePolygon3D` | 13723 | function |  | 1 |
| `orientedQuadFace` | 13763 | function |  | 2 |
| `createSplitStrandGeometry` | 13771 | function |  | 2 |
| `fusedIndexAt` | 13928 | arrow |  | 0 |
| `createHairCardGeometry` | 13977 | function |  | 2 |
| `createPolyGeometry` | 14076 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14103 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14112 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14159 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14167 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14183 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14192 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14203 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14211 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14221 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14241 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14264 | function |  | 4 |
| `createCompoundStrandGeometry` | 14347 | function |  | 2 |
| `proceduralBranchGeometryLock` | 14598 | function |  | 2 |
| `createHairGeometry` | 14638 | function |  | 6 |
| `createBaseHairGeometry` | 14690 | function |  | 3 |
| `hairMaterialDefinition` | 14808 | function |  | 4 |
| `materialForLock` | 14812 | function |  | 8 |
| `activeHairMaterialDefinition` | 14816 | function |  | 11 |
| `strandDisplayColor` | 14822 | function |  | 14 |
| `setAnimeHairBaseColor` | 14840 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 14853 | function |  | 2 |
| `createHairMaterial` | 14893 | function |  | 5 |
| `createStrandSelectionOutline` | 14935 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 14969 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 14978 | function |  | 6 |
| `refreshMaterialUsers` | 15005 | function |  | 6 |
| `renderHairMaterialOutliner` | 15014 | function |  | 5 |
| `renderHairMaterialOptions` | 15044 | function |  | 3 |
| `syncHairMaterialEditor` | 15054 | function |  | 9 |
| `createProjectHairMaterial` | 15080 | function |  | 3 |
| `deleteActiveHairMaterial` | 15100 | function |  | 2 |
| `createHairTopologyGeometry` | 15118 | function |  | 4 |
| `createHairTopologyOverlay` | 15139 | function |  | 3 |
| `groupDefaultsFor` | 15186 | function |  | 9 |
| `creationToolActive` | 15193 | function |  | 8 |
| `activeCreationShapeDefaults` | 15197 | function |  | 11 |
| `activeStrandShapeTarget` | 15203 | function |  | 5 |
| `curvePolylineLength` | 15207 | function |  | 2 |
| `curvePolylineLengths` | 15215 | function |  | 3 |
| `samplePolylineDistance` | 15223 | function |  | 2 |
| `applyProjectedCurveLength` | 15233 | function |  | 4 |
| `clearRegionLengthBaseline` | 15264 | function |  | 2 |
| `ensureRegionLengthBaseline` | 15271 | function |  | 2 |
| `setGroupLengthScale` | 15279 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 15317 | function |  | 5 |
| `requestGroupDefaultsWarning` | 15349 | function |  | 1 |
| `activeSweepProfile` | 15358 | function |  | 9 |
| `activeSweepProfileTarget` | 15365 | function |  | 6 |
| `trimmedSweepProfile` | 15372 | function |  | 7 |
| `roundedLeft` | 15381 | arrow |  | 1 |
| `roundedRight` | 15387 | arrow |  | 1 |
| `activeProfileOffset` | 15404 | function |  | 4 |
| `mirroredSweepProfileIndex` | 15411 | function |  | 3 |
| `profileToCanvas` | 15428 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 15432 | function |  | 11 |
| `sampleSweepProfile` | 15441 | function |  | 7 |
| `createSweepProfileTopology` | 15462 | function |  | 5 |
| `renderProfilePreview` | 15504 | function |  | 8 |
| `renderHairCardCoveragePath` | 15523 | function |  | 3 |
| `activeTaperTarget` | 15538 | function |  | 15 |
| `twistCurveEditing` | 15545 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 15549 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 15553 | function |  | 7 |
| `proceduralBranchCurveEditing` | 15557 | function |  | 17 |
| `activeTaperCurve` | 15584 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 15595 | function |  | 6 |
| `taperSamples` | 15605 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 15612 | function |  | 2 |
| `renderTaperPreview` | 15634 | function |  | 13 |
| `renderTwistCurvePreview` | 15670 | function |  | 5 |
| `shapeTargetForSelect` | 15690 | function |  | 3 |
| `setupShapePresetControls` | 15700 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 15725 | function |  | 3 |
| `syncShapePresetSelects` | 15731 | function |  | 7 |
| `populateShapePresetSelects` | 15752 | function |  | 5 |
| `openSaveShapePreset` | 15780 | function |  | 2 |
| `commitCustomShapePreset` | 15805 | function |  | 2 |
| `openRemoveShapePreset` | 15828 | function |  | 2 |
| `commitRemoveShapePreset` | 15841 | function |  | 2 |
| `taperPointToCanvas` | 15857 | function |  | 4 |
| `canvasToTaperPoint` | 15874 | function |  | 2 |
| `clearTaperMeshPoints` | 15910 | function |  | 2 |
| `taperMeshPointFrame` | 15920 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 15930 | function |  | 4 |
| `twistMeshGraphAxis` | 15938 | function |  | 4 |
| `addTwistMeshCurvePath` | 15942 | function |  | 2 |
| `appendSegment` | 15963 | arrow |  | 1 |
| `appendFill` | 15966 | arrow |  | 1 |
| `appendSignedSection` | 15972 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16021 | function |  | 6 |
| `updateTaperMeshPoints` | 16058 | function |  | 5 |
| `setTaperMeshPointsVisible` | 16137 | function |  | 5 |
| `renderTaperCurveEditor` | 16155 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 16227 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 16241 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 16257 | function |  | 2 |
| `scheduleTaperCurveEdit` | 16289 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 16298 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 16309 | function |  | 2 |
| `applyTaperCurveEdit` | 16317 | function |  | 10 |
| `openTaperCurveEditor` | 16425 | function |  | 3 |
| `closeTaperCurveEditor` | 16470 | function |  | 5 |
| `updateViewportStatsVisibility` | 16483 | function |  | 6 |
| `canvasToProfile` | 16502 | function |  | 2 |
| `renderSweepProfileEditor` | 16512 | function |  | 7 |
| `applySweepProfileEdit` | 16555 | function |  | 8 |
| `openSweepProfileEditor` | 16582 | function |  | 1 |
| `closeSweepProfileEditor` | 16617 | function |  | 2 |
| `retargetFloatingStrandEditors` | 16626 | function |  | 2 |
| `addLock` | 16641 | function |  | 19 |
| `mirroredScalpRegion` | 16844 | function |  | 5 |
| `mirroredVector` | 16853 | function |  | 12 |
| `mirroredPlacementFrame` | 16857 | function |  | 2 |
| `mirrorPartnerFor` | 16870 | function |  | 40 |
| `decoupleMirrorPartner` | 16874 | function |  | 2 |
| `createMirrorPartner` | 16882 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 16978 | function |  | 6 |
| `mirroredClumpPartners` | 16983 | function |  | 6 |
| `createMirroredClump` | 16989 | function |  | 3 |
| `decoupleMirroredClump` | 17011 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17030 | function |  | 6 |
| `syncActiveMirror` | 17195 | function |  | 25 |
| `setMirrorXEditing` | 17207 | function |  | 6 |
| `snapshotState` | 17231 | function |  | 7 |
| `scalpTriangleRegion` | 17488 | function |  | 4 |
| `closestPointOnActiveScalp` | 17501 | function |  | 12 |
| `rootAttachmentFrame` | 17573 | function |  | 3 |
| `rootAttachmentLocalFrame` | 17585 | function |  | 4 |
| `resolveRootAttachment` | 17603 | function |  | 4 |
| `curvePointsToRootLocal` | 17643 | function |  | 2 |
| `curvePointsFromRootLocal` | 17655 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 17663 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 17679 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 17709 | function |  | 2 |
| `createRootAttachment` | 17721 | function |  | 9 |
| `syncRootAttachmentMetadata` | 17751 | function |  | 4 |
| `rootAttachmentToData` | 17778 | function |  | 2 |
| `rootAttachmentFromData` | 17806 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 17845 | function |  | 2 |
| `remapPoint` | 17860 | arrow |  | 1 |
| `remapVector` | 17861 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 17890 | function |  | 2 |
| `importHeadMeshFile` | 17907 | function |  | 3 |
| `importFullBodyMeshFile` | 17930 | function |  | 3 |
| `downloadPreferencesAndPresets` | 17955 | function |  | 1 |
| `importedBooleanPreference` | 17988 | function |  | 11 |
| `loadPreferencesAndPresets` | 18002 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18072 | function |  | 1 |
| `openHairProjectFile` | 18115 | function |  | 4 |
| `dragContainsApplicationFile` | 18173 | function |  | 3 |
| `safelyRememberRecentProject` | 18182 | function |  | 2 |
| `renderRecentProjectsMenu` | 18191 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 18223 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 18248 | function |  | 2 |
| `confirmDroppedApplicationFile` | 18252 | function |  | 2 |
| `pushUndoState` | 18268 | function |  | 116 |
| `undoLastAction` | 18275 | function |  | 2 |
| `redoLastAction` | 18289 | function |  | 2 |
| `updateHistoryButtons` | 18303 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 18308 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 18325 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 18332 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 18370 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 18447 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 18473 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 18505 | function |  | 2 |
| `finalizeStateRestore` | 18546 | function |  | 2 |
| `restoreState` | 18553 | function |  | 5 |
| `disposeAllEditableObjects` | 18577 | function |  | 2 |
| `restoreLock` | 18598 | function |  | 4 |
| `restoreGuide` | 18815 | function |  | 2 |
| `vectorToData` | 18876 | function |  | 29 |
| `dataToVector` | 18880 | function |  | 31 |
| `frameToData` | 18884 | function |  | 2 |
| `frameFromData` | 18896 | function |  | 2 |
| `applyPresetSelection` | 18908 | function |  | 2 |
| `drawPresetThumbnail` | 18939 | function |  | 1 |
| `fillHair` | 18954 | arrow |  | 9 |
| `strand` | 18966 | arrow |  | 31 |
| `bun` | 18984 | arrow |  | 2 |
| `braid` | 19019 | arrow |  | 2 |
| `renderPresetLibrary` | 19108 | function |  | 3 |
| `setPresetLibraryOpen` | 19167 | function |  | 6 |
| `average` | 19180 | function |  | 4 |
| `fitPointAttributes` | 19184 | function |  | 9 |
| `rebuildCurveObjects` | 19213 | function |  | 10 |
| `createCurvePoints` | 19225 | function |  | 2 |
| `addGeneratedBangPreset` | 19234 | function |  | 1 |
| `sampleScalpQuad` | 19327 | function |  | 4 |
| `createLongLayeredCurlPoints` | 19351 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 19400 | function |  | 1 |
| `columns` | 19401 | arrow |  | 1 |
| `layer` | 19405 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 19619 | function |  | 2 |
| `addBraidedBobPreset` | 19655 | function |  | 1 |
| `evenColumns` | 19656 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 19872 | function |  | 1 |
| `scalpSeed` | 19895 | arrow |  | 1 |
| `createBowlCutPoints` | 20182 | function |  | 2 |
| `addBowlCutPreset` | 20220 | function |  | 1 |
| `scalpRegionAtHit` | 20286 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 20298 | function |  | 6 |
| `selectedCurveLatticeGuide` | 20305 | function |  | 12 |
| `braidStrokeActive` | 20312 | function |  | 9 |
| `proceduralDrawActive` | 20316 | function |  | 3 |
| `panelStrokeActive` | 20320 | function |  | 6 |
| `activeStrokeSurfaceInput` | 20324 | function |  | 4 |
| `activeStrokeSurfaceValue` | 20328 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 20332 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 20338 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 20342 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 20346 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 20350 | function |  | 3 |
| `liveSurfaceStrandId` | 20360 | function |  | 4 |
| `liveSurfaceStrand` | 20364 | function |  | 4 |
| `liveSurfaceGuideId` | 20369 | function |  | 3 |
| `guideSupportsLiveSurface` | 20373 | function |  | 2 |
| `liveSurfaceGuide` | 20380 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 20387 | function |  | 12 |
| `activeStrokeScalpOffset` | 20427 | function |  | 4 |
| `activeStrokeBrushSize` | 20433 | function |  | 10 |
| `activeStrokeBrushDepth` | 20439 | function |  | 5 |
| `strokeSurfaceIsContextual` | 20445 | function |  | 7 |
| `contextualPlaneAtOrigin` | 20453 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 20463 | function |  | 13 |
| `worldNormalAtHit` | 20502 | function |  | 6 |
| `selectedPolyMesh` | 20510 | function |  | 10 |
| `addPolyLock` | 20515 | function |  | 2 |
| `ensurePolyMesh` | 20534 | function |  | 3 |
| `polySurfaceSample` | 20538 | function |  | 4 |
| `polyTargetAtEvent` | 20549 | function |  | 6 |
| `refreshPolyMesh` | 20575 | function |  | 10 |
| `ensurePolyFillPreview` | 20584 | function |  | 2 |
| `clearPolyFillPreview` | 20621 | function |  | 17 |
| `polyFillCandidateForEvent` | 20626 | function |  | 3 |
| `showPolyFillPreview` | 20646 | function |  | 2 |
| `updatePolyFillPreview` | 20672 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 20697 | function |  | 5 |
| `fillPolyGap` | 20707 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 20718 | function |  | 2 |
| `projectPolyRelaxPoint` | 20738 | function |  | 2 |
| `removePolyPointAttributes` | 20782 | function |  | 3 |
| `deletePolyComponent` | 20791 | function |  | 2 |
| `addPolyPoint` | 20814 | function |  | 4 |
| `appendPolyStrokeRow` | 20823 | function |  | 4 |
| `beginPolyBrushPointer` | 20843 | function |  | 1 |
| `finishPolyAltDelete` | 20929 | function |  | 1 |
| `updatePolyBrushStroke` | 20943 | function |  | 1 |
| `finishPolyBrushStroke` | 21033 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21070 | function |  | 2 |
| `drawSampleFromHit` | 21093 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21107 | function |  | 3 |
| `strokeLength` | 21144 | function |  | 9 |
| `resampleDrawStroke` | 21150 | function |  | 2 |
| `processedDrawStroke` | 21182 | function |  | 8 |
| `strokeSurfaceNormals` | 21211 | function |  | 7 |
| `drawClumpFrame` | 21222 | function |  | 4 |
| `nearestCurveParameter` | 21231 | function |  | 2 |
| `drawClumpSampleNormal` | 21245 | function |  | 6 |
| `drawClumpTemplateVector` | 21254 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 21260 | function |  | 3 |
| `drawClumpStrandMaps` | 21276 | function |  | 4 |
| `nextClumpName` | 21331 | function |  | 6 |
| `initializeClumpShape` | 21338 | function |  | 5 |
| `stableClumpVariation` | 21349 | function |  | 3 |
| `createClumpFromLocks` | 21361 | function |  | 7 |
| `addLockToClump` | 21386 | function |  | 4 |
| `pointerToNdc` | 21449 | function |  | 1 |
| `gridProfileSkipCol` | 21465 | function |  | 3 |
| `clumpDirectMembers` | 21489 | function |  | 3 |
| `clumpMembersForGuide` | 21494 | function |  | 6 |
| `clumpGuideForLock` | 21498 | function |  | 13 |
| `proceduralGuideForLock` | 21503 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 21510 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 21517 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 21524 | function |  | 3 |
| `proceduralBranchWorldPoints` | 21536 | function |  | 2 |
| `applyProceduralBranchSettings` | 21549 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 21588 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 21604 | function |  | 3 |
| `createProceduralAccessoryLock` | 21618 | function |  | 2 |
| `applyProceduralAccessorySettings` | 21670 | function |  | 2 |
| `clumpFrameAt` | 21721 | function |  | 5 |
| `commitClumpMemberRestState` | 21729 | function |  | 10 |
| `updateClumpMembers` | 21812 | function |  | 10 |
| `dissolveClump` | 21916 | function |  | 6 |
| `detachLockFromClump` | 21953 | function |  | 4 |
| `updateDrawVolumePreview` | 21979 | function |  | 5 |
| `hideDrawClumpPreviews` | 22003 | function |  | 5 |
| `resetDrawVolumePreview` | 22009 | function |  | 3 |
| `updateDrawStrandPreview` | 22015 | function |  | 23 |
| `continueFromTipEnabled` | 22234 | function |  | 2 |
| `selectedTipContinuationLock` | 22240 | function |  | 3 |
| `beginDrawStrandStroke` | 22255 | function |  | 2 |
| `beginDrawFreePlane` | 22380 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 22394 | function |  | 2 |
| `updateDrawStrandStroke` | 22419 | function |  | 1 |
| `createDrawnLock` | 22465 | function |  | 3 |
| `setting` | 22469 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 22537 | function |  | 4 |
| `createDrawnBraid` | 22545 | function |  | 2 |
| `createDrawnStrand` | 22602 | function |  | 2 |
| `createDrawnPanel` | 22729 | function |  | 2 |
| `surfaceLatticeNormal` | 22779 | function |  | 2 |
| `createSurfaceLockFromLattice` | 22794 | function |  | 3 |
| `createViewportSurface` | 22859 | function |  | 2 |
| `loftSurfaceProfilePoints` | 22888 | function |  | 6 |
| `hideLoftSurfacePreviews` | 22894 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 22901 | function |  | 4 |
| `updateLoftSurfacePreview` | 22910 | function |  | 5 |
| `resetLoftSurfaceDraft` | 22942 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 22958 | function |  | 3 |
| `cloneCurveSurfaceSource` | 22976 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 22998 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 23024 | function |  | 3 |
| `curveSurfaceProfilePoints` | 23034 | function |  | 3 |
| `curveSurfaceProfileNormals` | 23038 | function |  | 2 |
| `curveSurfacePreviewLock` | 23047 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 23070 | function |  | 2 |
| `hideCurveSurfacePreview` | 23086 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 23098 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 23103 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 23112 | function |  | 3 |
| `curveSurfaceSideVector` | 23150 | function |  | 4 |
| `curveSurfaceDraftCurves` | 23163 | function |  | 2 |
| `curveSurfaceFallbackHit` | 23171 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 23184 | function |  | 5 |
| `updateCurveSurfacePreview` | 23204 | function |  | 6 |
| `resetCurveSurfaceDraft` | 23266 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 23288 | function |  | 3 |
| `beginCurveSurfaceStroke` | 23303 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 23351 | function |  | 3 |
| `updateCurveSurfaceStroke` | 23386 | function |  | 1 |
| `finishCurveSurfaceStroke` | 23418 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 23476 | function |  | 2 |
| `commitCurveSurfaceDraft` | 23553 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 23558 | function |  | 8 |
| `beginLoftSurfaceStroke` | 23567 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 23601 | function |  | 2 |
| `updateLoftSurfaceStroke` | 23612 | function |  | 1 |
| `finishLoftSurfaceStroke` | 23642 | function |  | 2 |
| `extendDrawnStrand` | 23699 | function |  | 2 |
| `finishDrawStrandStroke` | 23732 | function |  | 7 |
| `createPlacedStrand` | 23759 | function |  | 2 |
| `placedPointCount` | 23823 | function |  | 3 |
| `createPlacedPoints` | 23827 | function |  | 3 |
| `pushPointOutsideHead` | 23846 | function |  | 8 |
| `resizePlacedStrand` | 23878 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 23895 | function |  | 5 |
| `beginPlaceEdit` | 23900 | function |  | 2 |
| `updatePlaceEdit` | 23918 | function |  | 1 |
| `updatePlacementLength` | 23932 | function |  | 3 |
| `updatePlacementOrientation` | 23942 | function |  | 3 |
| `endPlaceEdit` | 23960 | function |  | 1 |
| `confirmPendingPlacedStrand` | 23975 | function |  | 1 |
| `pendingPlacedLock` | 23985 | function |  | 2 |
| `beginPlacementPointer` | 23989 | function |  | 3 |
| `finishPlacementPointer` | 23999 | function |  | 2 |
| `confirmPlacementStep` | 24023 | function |  | 2 |
| `finishPlacementFlow` | 24046 | function |  | 7 |
| `updatePlacementStatus` | 24059 | function |  | 82 |
| `deselectStrands` | 24198 | function |  | 12 |
| `beginSelectionMarquee` | 24213 | function |  | 3 |
| `beginAltOrbit` | 24237 | function |  | 1 |
| `beginBlenderNavigation` | 24249 | function |  | 1 |
| `endBlenderNavigation` | 24294 | function |  | 1 |
| `prepareSelectPointerCapture` | 24302 | function |  | 1 |
| `endSelectPointerCapture` | 24308 | function |  | 1 |
| `endAltOrbit` | 24314 | function |  | 1 |
| `dollyCameraByDrag` | 24321 | function |  | 2 |
| `fastDragMagnitude` | 24344 | function |  | 2 |
| `beginHoudiniZoomDrag` | 24350 | function |  | 1 |
| `updateHoudiniZoomDrag` | 24358 | function |  | 1 |
| `endHoudiniZoomDrag` | 24375 | function |  | 1 |
| `updateSelectionMarquee` | 24383 | function |  | 1 |
| `pointInsideSelectionMarquee` | 24400 | function |  | 3 |
| `selectPointsInMarquee` | 24408 | function |  | 2 |
| `pointKey` | 24434 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 24465 | function |  | 2 |
| `objectInsideSelectionMarquee` | 24502 | function |  | 3 |
| `projectedPoint` | 24519 | arrow |  | 1 |
| `selectObjectsInMarquee` | 24548 | function |  | 2 |
| `finishSelectionMarquee` | 24593 | function |  | 2 |
| `headMeshes` | 24616 | function |  | 9 |
| `strandSplitProfileData` | 24624 | function |  | 4 |
| `strandSplitControlPoint` | 24637 | function |  | 4 |
| `panelSplitControlPoint` | 24673 | function |  | 6 |
| `strandControlPointRaycast` | 24729 | function |  | 1 |
| `strandControlPointFrame` | 24764 | function |  | 4 |
| `strandControlPointHitFromEvent` | 24796 | function |  | 4 |
| `createCurveObjects` | 24854 | function |  | 4 |
| `polyEdgeKey` | 25027 | function |  | 2 |
| `polyMeshEdges` | 25031 | function |  | 2 |
| `populatePolyEditObjects` | 25045 | function |  | 3 |
| `createPolyEditObjects` | 25106 | function |  | 2 |
| `rebuildPolyEditObjects` | 25114 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 25128 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 25135 | function |  | 2 |
| `strandWidthEdgeSample` | 25144 | function |  | 3 |
| `strandWidthEdgePoints` | 25167 | function |  | 2 |
| `sculptBrushDebugRaycast` | 25181 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 25185 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 25192 | function |  | 3 |
| `refreshSculptBrushDebugView` | 25204 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 25209 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 25215 | function |  | 3 |
| `updateCurveObjects` | 25229 | function |  | 35 |
| `createCurveNormalIndicator` | 25486 | function |  | 2 |
| `pointUpDirection` | 25512 | function |  | 2 |
| `curveFrameAtPoint` | 25516 | function |  | 4 |
| `curveFrameAt` | 25537 | function |  | 4 |
| `strandTwistAt` | 25557 | function |  | 6 |
| `controlPointRotationAt` | 25562 | function |  | 4 |
| `strandProfileTwistAt` | 25566 | function |  | 2 |
| `strandFrameAt` | 25572 | function |  | 1 |
| `curveFrameAtSnapshot` | 25578 | function |  | 3 |
| `outwardNormalAtPoint` | 25597 | function |  | 11 |
| `sampledSurfaceNormal` | 25609 | function |  | 2 |
| `guidedNormalAt` | 25625 | function |  | 5 |
| `twistFromHandle` | 25644 | function |  | 3 |
| `signedAngleAroundAxis` | 25665 | function |  | 5 |
| `handleColor` | 25672 | function |  | 2 |
| `isAffectedCurvePoint` | 25695 | function |  | 2 |
| `syncLockFromCurve` | 25701 | function |  | 25 |
| `labelForPreset` | 25731 | function |  | 1 |
| `rebuildLockGeometry` | 25735 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 25762 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 25770 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 25776 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 25798 | function |  | 8 |
| `updateLockGeometry` | 25811 | function |  | 56 |
| `setGroupColorView` | 25832 | function |  | 2 |
| `createUvCheckerTexture` | 25842 | function |  | 3 |
| `ensureUvCheckerForLock` | 25878 | function |  | 4 |
| `removeUvCheckerFromLock` | 25911 | function |  | 3 |
| `invalidateUvInspector` | 25926 | function |  | 7 |
| `uvInspectorRecord` | 25930 | function |  | 1 |
| `uvInspectorRecords` | 25969 | function |  | 2 |
| `drawUvInspectorGrid` | 25973 | function |  | 2 |
| `renderUvInspector` | 26007 | function |  | 3 |
| `setUvCheckerEnabled` | 26066 | function |  | 3 |
| `strandViewportBaseColor` | 26083 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 26118 | function |  | 3 |
| `syncStrandSelectionOutline` | 26124 | function |  | 2 |
| `applyLockedStrandPalette` | 26135 | function |  | 2 |
| `syncLockedStrandWireVisual` | 26144 | function |  | 6 |
| `setStrandSelectionVisual` | 26153 | function |  | 6 |
| `proceduralParentOutlineVisible` | 26169 | function |  | 2 |
| `syncProceduralParentVisibility` | 26176 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 26185 | function |  | 2 |
| `updateStrandSelectionHighlight` | 26189 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 26193 | function |  | 2 |
| `resetGuideSelectionVisuals` | 26206 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 26226 | function |  | 3 |
| `selectLock` | 26259 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 26312 | function |  | 6 |
| `syncGroupInputs` | 26323 | function |  | 2 |
| `topologyStatsForLock` | 26356 | function |  | 4 |
| `formatTopologyStats` | 26364 | function |  | 5 |
| `updateTopologyStats` | 26368 | function |  | 20 |
| `normalizeBraidDimensions` | 26402 | function |  | 3 |
| `normalizeStrandDimensions` | 26415 | function |  | 3 |
| `strandBaseWidth` | 26429 | function |  | 5 |
| `strandWidthDimension` | 26433 | function |  | 5 |
| `strandDepthDimension` | 26441 | function |  | 8 |
| `setStrandWidthDimension` | 26449 | function |  | 2 |
| `setStrandDepthDimension` | 26471 | function |  | 4 |
| `syncShapeDimensionInputs` | 26487 | function |  | 4 |
| `syncCreationShapeInputs` | 26523 | function |  | 3 |
| `syncViewportDrawSettings` | 26561 | function |  | 5 |
| `syncPanelShapeInputs` | 26575 | function |  | 6 |
| `syncStrandSplitInputs` | 26601 | function |  | 4 |
| `syncHairCardControls` | 26610 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 26618 | function |  | 3 |
| `updateAttributeEditorMode` | 26657 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 26807 | function |  | 3 |
| `curveLatticeForGroup` | 26830 | function |  | 2 |
| `filterCurveLatticesToGroup` | 26848 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 26893 | function |  | 2 |
| `showCurveLatticeForGroup` | 26910 | function |  | 2 |
| `selectStrandGroup` | 26947 | function |  | 3 |
| `selectCurvePoint` | 26989 | function |  | 10 |
| `updateSelectedPointLabel` | 27003 | function |  | 14 |
| `syncInputs` | 27016 | function |  | 15 |
| `syncClumpGuidePanel` | 27062 | function |  | 3 |
| `getSelectedLock` | 27089 | function |  | 101 |
| `selectedLocksInOrder` | 27093 | function |  | 37 |
| `lockStrands` | 27099 | function |  | 3 |
| `lockSelectedStrands` | 27132 | function |  | 3 |
| `unlockStrands` | 27138 | function |  | 3 |
| `unlockAllStrands` | 27153 | function |  | 3 |
| `strandEditFamily` | 27157 | function |  | 7 |
| `compatibleSelectedLocks` | 27162 | function |  | 6 |
| `selectedEditRoots` | 27169 | function |  | 2 |
| `editSelectedLocks` | 27182 | function |  | 20 |
| `multiEditValuesEqual` | 27215 | function |  | 2 |
| `setMixedControl` | 27224 | function |  | 28 |
| `syncMultiStrandInputs` | 27241 | function |  | 16 |
| `values` | 27257 | arrow |  | 42 |
| `selectedRebuildableCurves` | 27337 | function |  | 5 |
| `createCompoundStrand` | 27344 | function |  | 1 |
| `refreshRebuildCurveDialog` | 27405 | function |  | 9 |
| `openRebuildCurveDialog` | 27418 | function |  | 1 |
| `rebuildSelectedCurves` | 27432 | function |  | 2 |
| `selectionCanBecomeClump` | 27471 | function |  | 4 |
| `createClumpFromSelection` | 27476 | function |  | 3 |
| `cleanSelectionSets` | 27488 | function |  | 2 |
| `createSelectionSetFromSelection` | 27493 | function |  | 3 |
| `selectionSetById` | 27504 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 27508 | function |  | 7 |
| `editSelectionSetFromSelection` | 27517 | function |  | 5 |
| `deleteSelectionSet` | 27537 | function |  | 2 |
| `selectSelectionSet` | 27546 | function |  | 2 |
| `deleteSelectedStrands` | 27556 | function |  | 4 |
| `deleteGuide` | 27564 | function |  | 3 |
| `deleteSelectedGuide` | 27587 | function |  | 3 |
| `deleteSelectedReferenceImage` | 27591 | function |  | 4 |
| `hasDeletableSelection` | 27604 | function |  | 2 |
| `deleteCurrentSelection` | 27612 | function |  | 3 |
| `hideOutlinerContextMenu` | 27620 | function |  | 17 |
| `outlinerLockTargets` | 27625 | function |  | 3 |
| `showOutlinerContextMenu` | 27652 | function |  | 10 |
| `hideStrandRadialMenu` | 27732 | function |  | 4 |
| `ensureRadialButtonCapacity` | 27743 | function |  | 3 |
| `radialButtonDimensions` | 27756 | function |  | 4 |
| `radialMenuDimensionsForKind` | 27765 | function |  | 3 |
| `applyRadialMenuDimensions` | 27782 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 27788 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 27801 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 27822 | function |  | 2 |
| `selectionSetRadialMenuOption` | 27839 | function |  | 4 |
| `selectedMirrorRadialOptions` | 27848 | function |  | 3 |
| `strandVisibilityRadialOptions` | 27870 | function |  | 5 |
| `clumpMirrorRadialOptions` | 27888 | function |  | 2 |
| `contextualRadialOptions` | 27895 | function |  | 3 |
| `sharedRadialFrameDimensions` | 28024 | function |  | 3 |
| `layoutContextualRadialOptions` | 28028 | function |  | 4 |
| `renderRadialActionList` | 28052 | function |  | 3 |
| `radialListOptionAtPointer` | 28070 | function |  | 3 |
| `syncRadialListHighlight` | 28092 | function |  | 3 |
| `configureContextualRadialMenu` | 28098 | function |  | 3 |
| `beginStrandRadialGesture` | 28158 | function |  | 2 |
| `enterStrandRadialSubmenu` | 28192 | function |  | 2 |
| `updateStrandRadialGesture` | 28238 | function |  | 1 |
| `performStrandRadialAction` | 28277 | function |  | 2 |
| `finishStrandRadialGesture` | 28380 | function |  | 2 |
| `cancelStrandRadialGesture` | 28390 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 28397 | function |  | 1 |
| `setPullMoveEnabled` | 28403 | function |  | 3 |
| `toolRadialOptions` | 28411 | function |  | 2 |
| `hideToolRadialMenu` | 28436 | function |  | 4 |
| `beginToolRadialGesture` | 28449 | function |  | 2 |
| `beginToolShortcutPress` | 28489 | function |  | 2 |
| `finishToolShortcutPress` | 28504 | function |  | 2 |
| `cancelToolShortcutPress` | 28513 | function |  | 5 |
| `setRadialMenusEnabled` | 28521 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 28534 | function |  | 5 |
| `setNavigationTipsEnabled` | 28549 | function |  | 5 |
| `configureNavigationMouseButtons` | 28556 | function |  | 3 |
| `syncNavigationModifierLocks` | 28569 | function |  | 7 |
| `setNavigationStyle` | 28574 | function |  | 5 |
| `applyCameraSmoothingPreference` | 28590 | function |  | 4 |
| `setCameraSmoothingEnabled` | 28605 | function |  | 5 |
| `setCameraSmoothingStrength` | 28611 | function |  | 5 |
| `setScaleSensitivity` | 28619 | function |  | 3 |
| `setToolTipsEnabled` | 28627 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 28634 | function |  | 5 |
| `setViewportStatisticsEnabled` | 28643 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 28651 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 28666 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 28675 | function |  | 5 |
| `sideNamingDisplayId` | 28684 | function |  | 3 |
| `referenceViewDisplayLabel` | 28696 | function |  | 6 |
| `strandRegionDisplayLabel` | 28706 | function |  | 10 |
| `updateSideNamingLabels` | 28724 | function |  | 2 |
| `setSideNamingPerspective` | 28751 | function |  | 5 |
| `setControlPointDisplaySize` | 28760 | function |  | 6 |
| `scaleHexColor` | 28772 | function |  | 3 |
| `setViewportBackgroundColor` | 28777 | function |  | 7 |
| `setDefaultHairShader` | 28799 | function |  | 5 |
| `setPreferenceCategory` | 28805 | function |  | 4 |
| `openPreferencesDialog` | 28832 | function |  | 1 |
| `savePreferencesDialog` | 28860 | function |  | 1 |
| `cancelPreferencesDialog` | 28884 | function |  | 3 |
| `updateToolRadialGesture` | 28913 | function |  | 1 |
| `performToolRadialAction` | 28942 | function |  | 2 |
| `finishToolRadialGesture` | 28952 | function |  | 2 |
| `cancelToolRadialGesture` | 28961 | function |  | 5 |
| `duplicatePlacementTarget` | 28968 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 28995 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 28999 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 29009 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 29014 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 29026 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 29037 | function |  | 7 |
| `openProceduralDuplicateDialog` | 29045 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 29062 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 29083 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 29094 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 29100 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 29106 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 29139 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 29294 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 29396 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 29437 | function |  | 2 |
| `updateDuplicatePlacement` | 29464 | function |  | 2 |
| `beginDuplicatePlacement` | 29528 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 29592 | function |  | 2 |
| `confirmDuplicatePlacement` | 29633 | function |  | 1 |
| `cancelDuplicatePlacement` | 29670 | function |  | 4 |
| `outlinerClumpLocks` | 29696 | function |  | 11 |
| `handleOutlinerClumpDrop` | 29700 | function |  | 3 |
| `createOutlinerStrandButton` | 29723 | function |  | 4 |
| `createOutlinerCurveSurface` | 29809 | function |  | 2 |
| `createOutlinerClump` | 29905 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 29987 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 29994 | function |  | 2 |
| `renderLockList` | 30073 | function |  | 70 |
| `updateCount` | 30227 | function |  | 34 |
| `captureInputUndo` | 30236 | function |  | 1 |
| `bindUndoCapture` | 30242 | function |  | 36 |
| `bindLockInput` | 30253 | function |  | 2 |
| `applyValue` | 30270 | arrow |  | 2 |
| `applyUniformTransformScale` | 30589 | function |  | 2 |
| `applyReducedTransformScale` | 30606 | function |  | 2 |
| `applyTransformPrecision` | 30645 | function |  | 2 |
| `updateTransformScalePointer` | 30674 | function |  | 1 |
| `finishSweepProfileDrag` | 30905 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 31001 | function |  | 3 |
| `finishTaperCurveDrag` | 31063 | function |  | 1 |
| `beginTaperMeshPointDrag` | 31106 | function |  | 1 |
| `updateTaperMeshPointDrag` | 31187 | function |  | 1 |
| `finishTaperMeshPointDrag` | 31242 | function |  | 6 |
| `updateSelectedTaperPoint` | 31266 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 31836 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 31841 | function |  | 4 |
| `syncDrawCurlControls` | 31896 | function |  | 5 |
| `handleLiveSurfaceChange` | 31944 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 32026 | function |  | 3 |
| `resampleSurfaceLock` | 32041 | function |  | 2 |
| `changePanelSplitCount` | 32154 | function |  | 3 |
| `applyPresetControl` | 32262 | function |  | 2 |
| `applyCreationToolSettings` | 32283 | function |  | 2 |
| `populateCreationPresetSelect` | 32327 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 32351 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 32384 | function |  | 5 |
| `createCustomCreationPreset` | 32392 | function |  | 3 |
| `createCustomClumpPreset` | 32407 | function |  | 3 |
| `commitCustomCreationPreset` | 32422 | function |  | 2 |
| `openRemoveCreationPreset` | 32483 | function |  | 3 |
| `commitRemoveCreationPreset` | 32496 | function |  | 1 |
| `applyBraidToolPreset` | 32513 | function |  | 2 |
| `selectedBranchChildLock` | 32625 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 32629 | function |  | 2 |
| `initPanelResizeHandles` | 32735 | function |  | 2 |
| `applyWidth` | 32741 | arrow |  | 2 |
| `restoreWidth` | 32748 | arrow |  | 2 |
| `bindResize` | 32756 | arrow |  | 2 |
| `onMove` | 32764 | arrow |  | 0 |
| `onUp` | 32768 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 32785 | function |  | 2 |
| `initFloatingPanelControls` | 32794 | function |  | 2 |
| `detach` | 32803 | arrow |  | 43 |
| `endDrag` | 32841 | arrow |  | 0 |
| `endResize` | 32873 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 32884 | function |  | 3 |
| `selectPatchNotesVersion` | 33018 | function |  | 3 |
| `requestReferenceImage` | 33051 | function |  | 5 |
| `toggleCapsuleGuideTool` | 33255 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 33261 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 33268 | function |  | 1 |
| `deleteLocks` | 33835 | function |  | 10 |
| `disposeCurveObjects` | 33913 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 33965 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 33996 | function |  | 1 |
| `endPanelSplitHandleDrag` | 34071 | function |  | 2 |
| `resize` | 34104 | function |  | 3 |
| `handleViewportPointerMove` | 34115 | function |  | 1 |
| `blockProportionalSizingEvent` | 34126 | function |  | 1 |
| `updateLightAngleFromInputs` | 34132 | function |  | 2 |
| `startViewSnap` | 34146 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 34176 | function |  | 3 |
| `trackViewportPointerDown` | 34193 | function |  | 1 |
| `trackViewportPointerMove` | 34209 | function |  | 1 |
| `clearViewportPointer` | 34217 | function |  | 1 |
| `updateViewSnap` | 34222 | function |  | 1 |
| `nearestCardinalAxis` | 34258 | function |  | 5 |
| `cardinalAxisKey` | 34272 | function |  | 5 |
| `steppedDragAmount` | 34276 | function |  | 3 |
| `snapCameraToCardinalAxis` | 34282 | function |  | 4 |
| `endViewSnap` | 34298 | function |  | 4 |
| `activateStrandControlPoint` | 34308 | function |  | 4 |
| `refreshStrandControlPointSelection` | 34358 | function |  | 4 |
| `addStrandControlPointSelection` | 34385 | function |  | 3 |
| `removeStrandControlPointSelection` | 34402 | function |  | 3 |
| `sampleStrandPointNormal` | 34416 | function |  | 2 |
| `sampleStrandPointVectors` | 34426 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 34432 | function |  | 2 |
| `resampleStrandCurveData` | 34443 | function |  | 4 |
| `resampleMatchingVectors` | 34449 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 34488 | function |  | 4 |
| `removeStrandCurvePoint` | 34499 | function |  | 2 |
| `closestStrandCurveParameter` | 34512 | function |  | 2 |
| `insertStrandCurvePoint` | 34541 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 34558 | function |  | 2 |
| `selectionModifierCursorAvailable` | 34568 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 34584 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 34591 | function |  | 4 |
| `prepareCurvePointSelection` | 34613 | function |  | 1 |
| `finishCurvePointInsertion` | 34724 | function |  | 1 |
| `finishPointRemoval` | 34739 | function |  | 1 |
| `editableStrandWidth` | 34757 | function |  | 6 |
| `editableStrandWidthBounds` | 34769 | function |  | 2 |
| `applyEditableStrandWidth` | 34775 | function |  | 3 |
| `viewportPixelPoint` | 34811 | function |  | 3 |
| `syncSculptBrushControls` | 34819 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 34834 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 34842 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 34850 | function |  | 1 |
| `sculptBrushPlaneOffset` | 34856 | function |  | 5 |
| `setSculptBrushCursorVisible` | 34860 | function |  | 7 |
| `updateSculptBrushCursor` | 34867 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 34889 | function |  | 4 |
| `sculptBrushEditableLock` | 34896 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 34906 | function |  | 5 |
| `sculptBrushLockViable` | 34912 | function |  | 5 |
| `sculptBrushUnits` | 34923 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 34961 | function |  | 4 |
| `sculptBrushPointWeight` | 35011 | function |  | 5 |
| `sculptBrushWorldDelta` | 35021 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 35030 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 35056 | function |  | 2 |
| `beginSculptMoveStroke` | 35114 | function |  | 1 |
| `applySculptMoveStrokeSample` | 35176 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 35411 | function |  | 3 |
| `updateSculptMoveStroke` | 35420 | function |  | 1 |
| `finishSculptMoveStroke` | 35436 | function |  | 3 |
| `strandControlPointHit` | 35484 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 35488 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 35566 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 35600 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 35640 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 35653 | function |  | 1 |
| `setHoveredControlPoint` | 35692 | function |  | 7 |
| `visibleControlPointHoverTargets` | 35705 | function |  | 2 |
| `updateControlPointHover` | 35741 | function |  | 1 |
| `animate` | 36297 | function |  | 2 |
| `syncCompactSidebarLayout` | 36328 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 36347 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 36353 | function |  | 3 |
| `setAttributeEditorTab` | 36359 | function |  | 6 |

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
