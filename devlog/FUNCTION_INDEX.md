# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1734** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（37682 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 261 | function |  | 3 |
| `saveBooleanPreference` | 289 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 293 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 298 | function |  | 2 |
| `normalizeScaleSensitivity` | 303 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 308 | function |  | 2 |
| `normalizeSideNamingPerspective` | 313 | function |  | 2 |
| `normalizeNavigationStyle` | 317 | function |  | 2 |
| `setupEditableSliderControls` | 332 | function |  | 2 |
| `syncNumberFromRange` | 383 | arrow |  | 0 |
| `applyNumberValue` | 390 | arrow |  | 0 |
| `copyCameraPose` | 496 | function |  | 3 |
| `updateCameraProjectionForViewport` | 502 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 515 | function |  | 3 |
| `setOrthographicView` | 521 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 561 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 590 | function |  | 2 |
| `removeRotateFreeAxisRing` | 616 | function |  | 2 |
| `deflateTransformGizmoPickers` | 628 | function |  | 2 |
| `nextStrandName` | 1007 | function |  | 2 |
| `activeDrawClumpTemplate` | 1092 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1097 | function |  | 3 |
| `drawModeCreatesClump` | 1124 | function |  | 1 |
| `isPanelGeometry` | 1268 | function |  | 31 |
| `normalizePanelSplits` | 1272 | function |  | 3 |
| `clonePanelSplits` | 1284 | function |  | 19 |
| `snapPanelSplitHeight` | 1288 | function |  | 5 |
| `createQuadSphereGeometry` | 1323 | function |  | 2 |
| `vertexIndex` | 1337 | function |  | 11 |
| `addEdge` | 1355 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1390 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1460 | function |  | 3 |
| `updateScalpRenderGeometry` | 1486 | function |  | 4 |
| `writeScalpRegionColors` | 1537 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1550 | function |  | 2 |
| `createScalpSelectionOutline` | 1580 | function |  | 5 |
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
| `currentStrandSelectionState` | 2086 | function |  | 4 |
| `applyStrandSelectionState` | 2090 | function |  | 5 |
| `clearStrandSelectionState` | 2095 | function |  | 7 |
| `guideHeadBounds` | 3075 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3085 | function |  | 5 |
| `disposeGuideModel` | 3099 | function |  | 3 |
| `syncHeadTransformInputs` | 3110 | function |  | 4 |
| `applyHeadTransform` | 3117 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3135 | function |  | 4 |
| `applyScalpRoughScale` | 3144 | function |  | 5 |
| `resetHeadTransform` | 3158 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3172 | function |  | 2 |
| `installGuideModel` | 3188 | function |  | 5 |
| `loadDefaultGuideModel` | 3264 | function |  | 3 |
| `braidTemplateFromEntries` | 3287 | function |  | 4 |
| `braidMeshEntries` | 3319 | function |  | 2 |
| `prepareBraidBodyCache` | 3331 | function |  | 2 |
| `quantize` | 3340 | arrow |  | 21 |
| `sourceNormalAt` | 3352 | arrow |  | 1 |
| `clusterBoundary` | 3355 | arrow |  | 2 |
| `normalBuckets` | 3372 | arrow |  | 2 |
| `applyBucketPair` | 3404 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3435 | function |  | 2 |
| `annotateBraidObjTopology` | 3456 | function |  | 2 |
| `loadBraidMeshPreset` | 3476 | function |  | 3 |
| `createSplitControlHandle` | 3493 | function |  | 4 |
| `frameGuideModel` | 3508 | function |  | 2 |
| `syncScalpInputs` | 3533 | function |  | 2 |
| `syncScalpArtistInputs` | 3539 | function |  | 2 |
| `rootScalpOffsetDistance` | 3547 | function |  | 15 |
| `applyLockRootScalpOffset` | 3552 | function |  | 5 |
| `normalizeHairLayer` | 3568 | function |  | 27 |
| `layerOffsetForLock` | 3572 | function |  | 9 |
| `layerRootOffsetFactor` | 3577 | function |  | 13 |
| `layerOffsetWeight` | 3581 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3587 | function |  | 5 |
| `pointsWithLayerOffset` | 3596 | function |  | 3 |
| `layerDirectionForLock` | 3604 | function |  | 2 |
| `applyLayerOffset` | 3615 | function |  | 5 |
| `setLockHairLayer` | 3639 | function |  | 2 |
| `setGroupLayerOffset` | 3654 | function |  | 2 |
| `scalpArtistWeight` | 3666 | function |  | 3 |
| `scalpArtistScalesAt` | 3670 | function |  | 3 |
| `applyScalpArtistShape` | 3680 | function |  | 5 |
| `inverseScalpArtistShape` | 3698 | function |  | 2 |
| `updateScalpSurface` | 3725 | function |  | 3 |
| `setActiveScalpRegion` | 3735 | function |  | 2 |
| `clearScalpRegions` | 3747 | function |  | 2 |
| `scalpHitFromEvent` | 3764 | function |  | 3 |
| `updateScalpBrushCursor` | 3772 | function |  | 4 |
| `paintScalpAt` | 3787 | function |  | 3 |
| `beginScalpPaint` | 3854 | function |  | 2 |
| `updateScalpPaint` | 3863 | function |  | 1 |
| `endScalpPaint` | 3872 | function |  | 2 |
| `createScalpLattice` | 3879 | function |  | 2 |
| `resetScalpLattice` | 3904 | function |  | 1 |
| `updateScalpLatticeObjects` | 3916 | function |  | 7 |
| `quadraticWeights` | 3930 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3935 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3962 | function |  | 3 |
| `selectScalpLatticePoint` | 3977 | function |  | 2 |
| `beginScalpLatticeDrag` | 3992 | function |  | 2 |
| `updateScalpLatticeDrag` | 4010 | function |  | 1 |
| `endScalpLatticeDrag` | 4028 | function |  | 2 |
| `setHeadReferenceTransparency` | 4034 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4044 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4062 | function |  | 3 |
| `trianglePlaneIntersections` | 4070 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4091 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4117 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4127 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4139 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4163 | function |  | 3 |
| `createScalpBuilderPlanes` | 4178 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4210 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4248 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4271 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4283 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4295 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4300 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4312 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4422 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4447 | function |  | 5 |
| `syncEditedScalpSurface` | 4462 | function |  | 4 |
| `ensureEditedScalpSurface` | 4533 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4563 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4648 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4661 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4677 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4687 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4705 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4718 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4725 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4744 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4758 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4799 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4808 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4821 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4842 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4979 | function |  | 2 |
| `scalpTemplateNeighbors` | 4987 | function |  | 2 |
| `smoothScalpVectorField` | 4999 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5013 | function |  | 2 |
| `upperContourCurve` | 5030 | function |  | 4 |
| `hermitePoint` | 5065 | function |  | 2 |
| `curveNetworkSection` | 5076 | function |  | 3 |
| `pointAlongSection` | 5105 | function |  | 3 |
| `longestStitchedContour` | 5111 | function |  | 2 |
| `nodeForPoint` | 5119 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5176 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5186 | function |  | 1 |
| `orderedRange` | 5198 | arrow |  | 3 |
| `clipSegment` | 5221 | arrow |  | 1 |
| `liftedPoint` | 5244 | arrow |  | 5 |
| `boundaryCorner` | 5249 | arrow |  | 4 |
| `surfaceCurveBetween` | 5258 | arrow |  | 1 |
| `addSurfaceConnector` | 5281 | arrow |  | 2 |
| `sideContourAtDepth` | 5349 | arrow |  | 3 |
| `addSurfacePatch` | 5383 | arrow |  | 1 |
| `addCenterBridgePatch` | 5463 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5571 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5606 | function |  | 1 |
| `generatedScalpObjContent` | 5696 | function |  | 2 |
| `generateScalpFromBuilder` | 5710 | function |  | 1 |
| `orderedDepthRange` | 5746 | arrow |  | 7 |
| `resetScalpBuilder` | 5875 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5890 | function |  | 1 |
| `beginScalpBuilderInput` | 5904 | function |  | 2 |
| `updateScalpBuilderStroke` | 5905 | function |  | 1 |
| `finishScalpBuilderStroke` | 5906 | function |  | 2 |
| `setScalpBuilderEditing` | 5908 | function |  | 10 |
| `updateScalpEditingVisibility` | 5942 | function |  | 12 |
| `exitSetupEditors` | 6036 | function |  | 7 |
| `setCapsuleGuideEditing` | 6045 | function |  | 5 |
| `syncAppMenuVisibility` | 6073 | function |  | 3 |
| `closeAppMenus` | 6078 | function |  | 6 |
| `setAppMenuOpen` | 6089 | function |  | 3 |
| `setTurntableActive` | 6096 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6105 | function |  | 9 |
| `selectedReferenceImage` | 6109 | function |  | 20 |
| `normalizeReferenceCrop` | 6115 | function |  | 8 |
| `referenceCropIsFull` | 6123 | function |  | 3 |
| `referencePlaneFrontAxis` | 6128 | function |  | 4 |
| `referencePlanePlacement` | 6137 | function |  | 4 |
| `migratedReferencePlanePosition` | 6152 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6172 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6189 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6205 | function |  | 2 |
| `snappedReferenceImageView` | 6228 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6234 | function |  | 5 |
| `applyReferenceImageRuntime` | 6250 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6293 | function |  | 6 |
| `createReferenceImageRuntime` | 6301 | function |  | 3 |
| `addReferenceImage` | 6370 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6422 | function |  | 3 |
| `disposeReferenceImage` | 6441 | function |  | 2 |
| `clearReferenceImages` | 6445 | function |  | 2 |
| `serializeReferenceImage` | 6452 | function |  | 1 |
| `setReferenceImageType` | 6480 | function |  | 2 |
| `attachReferenceImageTransform` | 6524 | function |  | 6 |
| `selectReferenceImage` | 6538 | function |  | 12 |
| `placeReferencePlane` | 6561 | function |  | 2 |
| `setReferencePlaneInFront` | 6572 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6582 | function |  | 4 |
| `renderReferenceImagePanel` | 6601 | function |  | 20 |
| `setOutlinerTab` | 6648 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6666 | function |  | 4 |
| `componentEditModeActive` | 6670 | function |  | 38 |
| `selectionToolSupportsPicking` | 6674 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6679 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6695 | function |  | 2 |
| `setViewportSelectionMode` | 6725 | function |  | 4 |
| `setViewportEditMode` | 6737 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6779 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6793 | function |  | 8 |
| `outlinerGuides` | 6805 | function |  | 3 |
| `guideOutlinerLabel` | 6812 | function |  | 2 |
| `normalizeOutlinerName` | 6822 | function |  | 4 |
| `beginOutlinerRename` | 6827 | function |  | 2 |
| `finish` | 6838 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6868 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6878 | function |  | 2 |
| `renderGuideOutliner` | 6913 | function |  | 10 |
| `referenceOutlinerGroup` | 6971 | function |  | 2 |
| `renderReferenceOutliner` | 6975 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7092 | function |  | 5 |
| `readReferenceImageFile` | 7097 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7121 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7128 | function |  | 3 |
| `dragContainsReferenceImage` | 7173 | function |  | 3 |
| `setReferenceImageDragActive` | 7184 | function |  | 9 |
| `referenceDropDestination` | 7192 | function |  | 2 |
| `viewportOverlayDropPosition` | 7198 | function |  | 2 |
| `setReferenceDropHover` | 7207 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7225 | function |  | 2 |
| `referenceOverlayAtPointer` | 7245 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7263 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7276 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7322 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7372 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7394 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7405 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7431 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7440 | function |  | 2 |
| `referenceCropCursor` | 7455 | function |  | 3 |
| `updateReferenceCropHandles` | 7461 | function |  | 5 |
| `referenceCropSourcePoint` | 7482 | function |  | 2 |
| `beginReferenceCrop` | 7489 | function |  | 1 |
| `updateReferenceCrop` | 7527 | function |  | 1 |
| `finishReferenceCrop` | 7559 | function |  | 4 |
| `setHeadSetupEditing` | 7577 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7593 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7602 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7612 | function |  | 4 |
| `setScalpGuideVisibility` | 7618 | function |  | 12 |
| `currentGuideViewMode` | 7626 | function |  | 3 |
| `updateGuideViewToggle` | 7634 | function |  | 5 |
| `setGuideViewMode` | 7650 | function |  | 3 |
| `cycleGuideViewMode` | 7661 | function |  | 1 |
| `hideGuideViewContextMenu` | 7666 | function |  | 6 |
| `showGuideViewContextMenu` | 7670 | function |  | 1 |
| `strandPassesDisplayFilters` | 7683 | function |  | 4 |
| `strandVisibleForDisplay` | 7692 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7697 | function |  | 2 |
| `lockedStrandsExist` | 7701 | function |  | 3 |
| `hiddenStrandsExist` | 7705 | function |  | 2 |
| `hideSelectedStrands` | 7709 | function |  | 2 |
| `unhideHiddenStrands` | 7719 | function |  | 2 |
| `strandIsolationActive` | 7728 | function |  | 7 |
| `setStrandIsolation` | 7732 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7744 | function |  | 3 |
| `syncVisibilityParent` | 7755 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7762 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7791 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7798 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7818 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7841 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7849 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7856 | function |  | 9 |
| `setScalpLatticeEditing` | 7867 | function |  | 4 |
| `setScalpShapeEditing` | 7882 | function |  | 9 |
| `setScalpPaintEditing` | 7900 | function |  | 7 |
| `defaultCurveLatticePoints` | 7924 | function |  | 3 |
| `flatCurveLatticePoints` | 7950 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7959 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7983 | function |  | 4 |
| `horizontalValue` | 7988 | arrow |  | 1 |
| `blendedSample` | 7999 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8032 | function |  | 2 |
| `curveLatticeControlPoint` | 8047 | function |  | 9 |
| `circularArcTangent` | 8051 | function |  | 4 |
| `arcLengthTo` | 8082 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8094 | function |  | 3 |
| `sampleHermiteCurve` | 8133 | function |  | 10 |
| `sampleCurveLattice` | 8150 | function |  | 6 |
| `curveLatticeNormal` | 8169 | function |  | 1 |
| `createCurveLatticeGeometry` | 8180 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8209 | function |  | 3 |
| `appendCurve` | 8211 | arrow |  | 4 |
| `sample` | 8213 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8240 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8256 | function |  | 3 |
| `addPicker` | 8258 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8297 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8310 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8314 | function |  | 3 |
| `curveLatticeEditablePoint` | 8332 | function |  | 13 |
| `curveLatticePointSection` | 8339 | function |  | 3 |
| `curveLatticeRestPoint` | 8350 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8356 | function |  | 7 |
| `curveLatticeRootColumns` | 8362 | function |  | 3 |
| `curveTangentsForPoints` | 8369 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8381 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8418 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8444 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8461 | function |  | 3 |
| `resampleGrid` | 8471 | arrow |  | 2 |
| `controlPointIsSelected` | 8498 | function |  | 7 |
| `clearMultiPointSelection` | 8506 | function |  | 9 |
| `createCurveLatticeHandles` | 8510 | function |  | 4 |
| `addCurveLattice` | 8532 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8641 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8672 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8678 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8717 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8738 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8755 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8764 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8771 | function |  | 1 |
| `selectCurveLatticeLoop` | 8790 | function |  | 3 |
| `selectCurveLatticePoint` | 8819 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8834 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8876 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8897 | function |  | 3 |
| `curveLatticeColumnPoints` | 8940 | function |  | 3 |
| `groupCurveControlIndices` | 8949 | function |  | 4 |
| `groupCurveControlPoints` | 8955 | function |  | 2 |
| `updateGroupCurveDisplay` | 8961 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8971 | function |  | 2 |
| `groupCurveDeformationPairs` | 8993 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9000 | function |  | 2 |
| `appendPairs` | 9002 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9013 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9032 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9053 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9072 | function |  | 2 |
| `capsuleGuideCapHeight` | 9106 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9110 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9115 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9119 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9131 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9147 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9153 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9179 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9209 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9263 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9284 | function |  | 7 |
| `vertex` | 9298 | function |  | 4 |
| `addFace` | 9304 | function |  | 3 |
| `addRing` | 9322 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9377 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9387 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9452 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9498 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9511 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9532 | function |  | 3 |
| `capsuleGuidePointDistances` | 9537 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9558 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9578 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9583 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9589 | function |  | 3 |
| `capsuleGuideAccentColor` | 9594 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9599 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9610 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9622 | function |  | 2 |
| `createCapsuleGuideHandles` | 9654 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9677 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9696 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9703 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9719 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9736 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9751 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9788 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9804 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9821 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9827 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9854 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9866 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9885 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9930 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9965 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9979 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9985 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10002 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10013 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10024 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10054 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10064 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10105 | function |  | 3 |
| `createQuadCageGeometry` | 10121 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10145 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10165 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10176 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10229 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10267 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10277 | function |  | 4 |
| `addCapsuleGuide` | 10285 | function |  | 4 |
| `addGuide` | 10354 | function |  | 1 |
| `createGuideGeometry` | 10415 | function |  | 4 |
| `selectGuide` | 10470 | function |  | 17 |
| `updateGuideControlsVisibility` | 10538 | function |  | 10 |
| `updateViewportToolVisibility` | 10555 | function |  | 7 |
| `getSelectedGuide` | 10594 | function |  | 34 |
| `selectedViewportFocusBounds` | 10598 | function |  | 2 |
| `frameViewportBounds` | 10612 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10642 | function |  | 2 |
| `fullSceneFocusBounds` | 10646 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10661 | function |  | 3 |
| `cycleViewportFraming` | 10670 | function |  | 2 |
| `syncGuideInputs` | 10688 | function |  | 5 |
| `updateGuideGeometry` | 10731 | function |  | 3 |
| `sculptBrushToolActive` | 10752 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10756 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10760 | function |  | 3 |
| `effectiveSculptBrushTool` | 10764 | function |  | 13 |
| `updateSculptScaleModeRow` | 10770 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10775 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10797 | function |  | 5 |
| `setActiveTool` | 10806 | function |  | 19 |
| `setDrawStrandMode` | 10944 | function |  | 2 |
| `setObjectSpaceEditing` | 10954 | function |  | 7 |
| `setHierarchyEditing` | 10970 | function |  | 4 |
| `setProportionalEditing` | 10982 | function |  | 5 |
| `beginProportionalSizeEdit` | 11001 | function |  | 3 |
| `updateProportionalSizeEdit` | 11013 | function |  | 2 |
| `endProportionalSizeEdit` | 11024 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11031 | function |  | 2 |
| `refreshProportionalPreview` | 11039 | function |  | 4 |
| `activeBrushSizeInput` | 11049 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11058 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11070 | function |  | 2 |
| `beginBrushSizeDrag` | 11088 | function |  | 1 |
| `updateBrushSizeDrag` | 11115 | function |  | 1 |
| `finishBrushSizeDrag` | 11136 | function |  | 2 |
| `updateInteractionLocks` | 11153 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11162 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11171 | function |  | 2 |
| `configureTransformControls` | 11202 | function |  | 16 |
| `pullMoveActive` | 11210 | function |  | 9 |
| `updatePullGuideVisual` | 11214 | function |  | 4 |
| `attachTransformForCurvePoint` | 11230 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11254 | function |  | 7 |
| `strandObjectRootIndex` | 11270 | function |  | 3 |
| `strandObjectRoot` | 11279 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11283 | function |  | 2 |
| `attachStrandObjectTransform` | 11288 | function |  | 6 |
| `guideObjectPivot` | 11311 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11322 | function |  | 2 |
| `attachGuideObjectTransform` | 11327 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11346 | function |  | 2 |
| `beginGuideObjectTransform` | 11374 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11381 | function |  | 2 |
| `updateGuideObjectTransform` | 11403 | function |  | 2 |
| `finishGuideObjectTransform` | 11436 | function |  | 2 |
| `clonePlacementFrame` | 11445 | function |  | 2 |
| `cloneOptionalVectors` | 11457 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11461 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11478 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11493 | function |  | 2 |
| `strandObjectTransformOperators` | 11509 | function |  | 4 |
| `transformPoint` | 11517 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11524 | arrow |  | 0 |
| `transformNormal` | 11530 | arrow |  | 10 |
| `transformDirection` | 11540 | arrow |  | 7 |
| `worldMatrixForPivot` | 11552 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11558 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11574 | function |  | 6 |
| `beginStrandObjectTransform` | 11588 | function |  | 2 |
| `updateStrandObjectTransform` | 11626 | function |  | 2 |
| `commitStrandObjectTransform` | 11675 | function |  | 2 |
| `mapPoints` | 11688 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11722 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11736 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11759 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11772 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11787 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11813 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11862 | function |  | 2 |
| `beginHandleEdit` | 11871 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11920 | function |  | 3 |
| `applyBranchRigidRootMove` | 11937 | function |  | 3 |
| `syncBranchRootHandleFrame` | 11974 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 11985 | function |  | 3 |
| `multiPointHandleEditActive` | 11996 | function |  | 7 |
| `applyMultiMove` | 12000 | function |  | 5 |
| `applyMultiRotate` | 12006 | function |  | 2 |
| `applyMultiScale` | 12015 | function |  | 2 |
| `applyHierarchicalMove` | 12024 | function |  | 3 |
| `applySingleMove` | 12036 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12040 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12057 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12066 | function |  | 3 |
| `changed` | 12076 | arrow |  | 1 |
| `applyPullMove` | 12118 | function |  | 3 |
| `pullHeadCollisionContext` | 12126 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12145 | function |  | 2 |
| `applyProportionalMove` | 12168 | function |  | 3 |
| `viewPlaneNormal` | 12179 | function |  | 20 |
| `isCameraInSnappedView` | 12183 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12191 | function |  | 10 |
| `updateViewPlaneGrid` | 12195 | function |  | 14 |
| `setViewPlaneMove` | 12252 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12263 | function |  | 2 |
| `rayFromViewportEvent` | 12271 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12279 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12289 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12300 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12313 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12332 | function |  | 4 |
| `beginViewPlaneMove` | 12339 | function |  | 3 |
| `updateViewPlaneMove` | 12403 | function |  | 1 |
| `endViewPlaneMove` | 12468 | function |  | 7 |
| `applyHierarchicalRotate` | 12487 | function |  | 2 |
| `rotateGuideNormal` | 12494 | arrow |  | 4 |
| `applySingleRotate` | 12532 | function |  | 2 |
| `applyProportionalRotate` | 12536 | function |  | 2 |
| `applyHierarchicalScale` | 12556 | function |  | 2 |
| `applySingleScale` | 12566 | function |  | 2 |
| `applyProportionalScale` | 12570 | function |  | 2 |
| `setPointScale` | 12586 | function |  | 8 |
| `proportionalWeight` | 12595 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12607 | function |  | 5 |
| `strandInfluenceColor` | 12613 | function |  | 17 |
| `beginRelaxEdit` | 12638 | function |  | 3 |
| `updateRelaxEdit` | 12667 | function |  | 1 |
| `endRelaxEdit` | 12727 | function |  | 1 |
| `disposeGuide` | 12737 | function |  | 3 |
| `removeGuideObjects` | 12765 | function |  | 3 |
| `strandRadiusAt` | 12779 | function |  | 5 |
| `strandProfileTopologyAt` | 12796 | function |  | 8 |
| `strandCurveParameters` | 12838 | function |  | 5 |
| `widthProfileAt` | 12848 | arrow |  | 1 |
| `braidFrameAt` | 12886 | function |  | 5 |
| `braidFrameAtExtended` | 12896 | function |  | 2 |
| `createBraidProfileProjector` | 12905 | function |  | 2 |
| `project` | 12921 | arrow |  | 17 |
| `createBraidGeometry` | 12936 | function |  | 2 |
| `deformationAt` | 12971 | function |  | 3 |
| `widthFor` | 12980 | arrow |  | 3 |
| `depthFor` | 12984 | arrow |  | 3 |
| `outputVertex` | 13016 | function |  | 7 |
| `appendAuthoredCap` | 13124 | function |  | 3 |
| `outputCapVertex` | 13131 | arrow |  | 6 |
| `capBoundary` | 13222 | function |  | 3 |
| `strandGeometryCurve` | 13284 | function |  | 14 |
| `strandGeometryFrameAt` | 13310 | function |  | 19 |
| `transportedStrandFrameAt` | 13373 | function |  | 7 |
| `twistOverrideAt` | 13376 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13404 | function |  | 2 |
| `weldPanelGeometryData` | 13440 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13480 | function |  | 3 |
| `surfacePanelPoint` | 13495 | function |  | 3 |
| `createPanelStrandGeometry` | 13518 | function |  | 2 |
| `addQuad` | 13552 | arrow |  | 6 |
| `near` | 13556 | arrow |  | 6 |
| `panelWidthAt` | 13586 | arrow |  | 6 |
| `panelThicknessAt` | 13595 | arrow |  | 6 |
| `panelFrameAt` | 13604 | arrow |  | 1 |
| `rawPanelPoint` | 13622 | arrow |  | 1 |
| `panelPoint` | 13642 | arrow |  | 2 |
| `addPatch` | 13648 | arrow |  | 1 |
| `splitOpening` | 13699 | arrow |  | 2 |
| `uStart` | 13723 | arrow |  | 1 |
| `uEnd` | 13726 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13764 | function |  | 3 |
| `inside` | 13765 | arrow |  | 2 |
| `pushOrientedTriangle` | 13787 | function |  | 7 |
| `triangulatePolygon3D` | 13798 | function |  | 1 |
| `orientedQuadFace` | 13838 | function |  | 2 |
| `createSplitStrandGeometry` | 13846 | function |  | 2 |
| `fusedIndexAt` | 14003 | arrow |  | 0 |
| `createHairCardGeometry` | 14052 | function |  | 2 |
| `createPolyGeometry` | 14151 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14178 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14187 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14234 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14242 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14258 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14267 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14278 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14286 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14296 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14316 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14339 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14418 | function |  | 2 |
| `pushBoundary` | 14447 | arrow |  | 5 |
| `boundaryAt` | 14465 | arrow |  | 3 |
| `hermite` | 14487 | arrow |  | 2 |
| `emitBottomMidRow` | 14532 | arrow |  | 2 |
| `emitTopMidRow` | 14631 | arrow |  | 2 |
| `sideHoleVertex` | 14673 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14722 | arrow |  | 2 |
| `emitFillStrip` | 14793 | arrow |  | 2 |
| `fillSide` | 14804 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14848 | arrow |  | 2 |
| `edgeDirection` | 14872 | arrow |  | 1 |
| `positionAt` | 14931 | arrow |  | 1 |
| `createBranchChildGeometry` | 14982 | function |  | 2 |
| `createCompoundStrandGeometry` | 15192 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15443 | function |  | 2 |
| `createHairGeometry` | 15474 | function |  | 6 |
| `createBaseHairGeometry` | 15526 | function |  | 3 |
| `hairMaterialDefinition` | 15644 | function |  | 4 |
| `materialForLock` | 15648 | function |  | 8 |
| `activeHairMaterialDefinition` | 15652 | function |  | 11 |
| `strandDisplayColor` | 15658 | function |  | 14 |
| `setAnimeHairBaseColor` | 15676 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15689 | function |  | 2 |
| `createHairMaterial` | 15729 | function |  | 5 |
| `createStrandSelectionOutline` | 15771 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15805 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15814 | function |  | 6 |
| `refreshMaterialUsers` | 15841 | function |  | 6 |
| `renderHairMaterialOutliner` | 15850 | function |  | 5 |
| `renderHairMaterialOptions` | 15880 | function |  | 3 |
| `syncHairMaterialEditor` | 15890 | function |  | 9 |
| `createProjectHairMaterial` | 15916 | function |  | 3 |
| `deleteActiveHairMaterial` | 15936 | function |  | 2 |
| `createHairTopologyGeometry` | 15954 | function |  | 4 |
| `createHairTopologyOverlay` | 15975 | function |  | 3 |
| `groupDefaultsFor` | 16022 | function |  | 9 |
| `creationToolActive` | 16029 | function |  | 8 |
| `activeCreationShapeDefaults` | 16033 | function |  | 11 |
| `activeStrandShapeTarget` | 16039 | function |  | 5 |
| `curvePolylineLength` | 16043 | function |  | 2 |
| `curvePolylineLengths` | 16051 | function |  | 3 |
| `samplePolylineDistance` | 16059 | function |  | 2 |
| `applyProjectedCurveLength` | 16069 | function |  | 4 |
| `clearRegionLengthBaseline` | 16100 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16107 | function |  | 2 |
| `setGroupLengthScale` | 16115 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16153 | function |  | 5 |
| `requestGroupDefaultsWarning` | 16185 | function |  | 1 |
| `activeSweepProfile` | 16194 | function |  | 9 |
| `activeSweepProfileTarget` | 16201 | function |  | 6 |
| `trimmedSweepProfile` | 16208 | function |  | 7 |
| `roundedLeft` | 16217 | arrow |  | 1 |
| `roundedRight` | 16223 | arrow |  | 1 |
| `activeProfileOffset` | 16240 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16247 | function |  | 3 |
| `profileToCanvas` | 16264 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16268 | function |  | 11 |
| `sampleSweepProfile` | 16277 | function |  | 7 |
| `createSweepProfileTopology` | 16298 | function |  | 5 |
| `renderProfilePreview` | 16340 | function |  | 8 |
| `renderHairCardCoveragePath` | 16359 | function |  | 3 |
| `activeTaperTarget` | 16374 | function |  | 15 |
| `twistCurveEditing` | 16381 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16385 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16389 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16393 | function |  | 17 |
| `activeTaperCurve` | 16420 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16431 | function |  | 6 |
| `taperSamples` | 16441 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16448 | function |  | 2 |
| `renderTaperPreview` | 16470 | function |  | 13 |
| `renderTwistCurvePreview` | 16506 | function |  | 5 |
| `shapeTargetForSelect` | 16526 | function |  | 3 |
| `setupShapePresetControls` | 16536 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16561 | function |  | 3 |
| `syncShapePresetSelects` | 16567 | function |  | 7 |
| `populateShapePresetSelects` | 16588 | function |  | 5 |
| `openSaveShapePreset` | 16616 | function |  | 2 |
| `commitCustomShapePreset` | 16641 | function |  | 2 |
| `openRemoveShapePreset` | 16664 | function |  | 2 |
| `commitRemoveShapePreset` | 16677 | function |  | 2 |
| `taperPointToCanvas` | 16693 | function |  | 4 |
| `canvasToTaperPoint` | 16710 | function |  | 2 |
| `clearTaperMeshPoints` | 16746 | function |  | 2 |
| `taperMeshPointFrame` | 16756 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16766 | function |  | 4 |
| `twistMeshGraphAxis` | 16774 | function |  | 4 |
| `addTwistMeshCurvePath` | 16778 | function |  | 2 |
| `appendSegment` | 16799 | arrow |  | 1 |
| `appendFill` | 16802 | arrow |  | 1 |
| `appendSignedSection` | 16808 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16857 | function |  | 6 |
| `updateTaperMeshPoints` | 16894 | function |  | 5 |
| `setTaperMeshPointsVisible` | 16973 | function |  | 5 |
| `renderTaperCurveEditor` | 16991 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17063 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17077 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17093 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17125 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17134 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17145 | function |  | 2 |
| `applyTaperCurveEdit` | 17153 | function |  | 10 |
| `openTaperCurveEditor` | 17261 | function |  | 3 |
| `closeTaperCurveEditor` | 17306 | function |  | 5 |
| `updateViewportStatsVisibility` | 17319 | function |  | 6 |
| `canvasToProfile` | 17338 | function |  | 2 |
| `renderSweepProfileEditor` | 17348 | function |  | 7 |
| `applySweepProfileEdit` | 17391 | function |  | 8 |
| `openSweepProfileEditor` | 17418 | function |  | 1 |
| `closeSweepProfileEditor` | 17453 | function |  | 2 |
| `retargetFloatingStrandEditors` | 17462 | function |  | 2 |
| `addLock` | 17477 | function |  | 19 |
| `mirroredScalpRegion` | 17680 | function |  | 5 |
| `mirroredVector` | 17689 | function |  | 12 |
| `mirroredPlacementFrame` | 17693 | function |  | 2 |
| `mirrorPartnerFor` | 17706 | function |  | 40 |
| `decoupleMirrorPartner` | 17710 | function |  | 2 |
| `createMirrorPartner` | 17718 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17814 | function |  | 6 |
| `mirroredClumpPartners` | 17819 | function |  | 6 |
| `createMirroredClump` | 17825 | function |  | 3 |
| `decoupleMirroredClump` | 17847 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17866 | function |  | 6 |
| `syncActiveMirror` | 18031 | function |  | 25 |
| `setMirrorXEditing` | 18043 | function |  | 6 |
| `snapshotState` | 18067 | function |  | 7 |
| `scalpTriangleRegion` | 18324 | function |  | 4 |
| `closestPointOnActiveScalp` | 18337 | function |  | 12 |
| `rootAttachmentFrame` | 18409 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18421 | function |  | 4 |
| `resolveRootAttachment` | 18439 | function |  | 4 |
| `curvePointsToRootLocal` | 18479 | function |  | 2 |
| `curvePointsFromRootLocal` | 18491 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18499 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18515 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18545 | function |  | 2 |
| `createRootAttachment` | 18557 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18587 | function |  | 4 |
| `rootAttachmentToData` | 18614 | function |  | 2 |
| `rootAttachmentFromData` | 18642 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18681 | function |  | 2 |
| `remapPoint` | 18696 | arrow |  | 1 |
| `remapVector` | 18697 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18726 | function |  | 2 |
| `importHeadMeshFile` | 18743 | function |  | 3 |
| `importFullBodyMeshFile` | 18766 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18791 | function |  | 1 |
| `importedBooleanPreference` | 18824 | function |  | 11 |
| `loadPreferencesAndPresets` | 18838 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18908 | function |  | 1 |
| `openHairProjectFile` | 18951 | function |  | 4 |
| `dragContainsApplicationFile` | 19009 | function |  | 3 |
| `safelyRememberRecentProject` | 19018 | function |  | 2 |
| `renderRecentProjectsMenu` | 19027 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19059 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19084 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19088 | function |  | 2 |
| `pushUndoState` | 19104 | function |  | 116 |
| `undoLastAction` | 19111 | function |  | 2 |
| `redoLastAction` | 19125 | function |  | 2 |
| `updateHistoryButtons` | 19139 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19144 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19161 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19168 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19206 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19283 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19309 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19341 | function |  | 2 |
| `finalizeStateRestore` | 19382 | function |  | 2 |
| `restoreState` | 19389 | function |  | 5 |
| `disposeAllEditableObjects` | 19413 | function |  | 2 |
| `restoreLock` | 19434 | function |  | 4 |
| `restoreGuide` | 19651 | function |  | 2 |
| `vectorToData` | 19712 | function |  | 29 |
| `dataToVector` | 19716 | function |  | 31 |
| `frameToData` | 19720 | function |  | 2 |
| `frameFromData` | 19732 | function |  | 2 |
| `applyPresetSelection` | 19744 | function |  | 2 |
| `drawPresetThumbnail` | 19775 | function |  | 1 |
| `fillHair` | 19790 | arrow |  | 9 |
| `strand` | 19802 | arrow |  | 31 |
| `bun` | 19820 | arrow |  | 2 |
| `braid` | 19855 | arrow |  | 2 |
| `renderPresetLibrary` | 19944 | function |  | 3 |
| `setPresetLibraryOpen` | 20003 | function |  | 6 |
| `average` | 20016 | function |  | 4 |
| `fitPointAttributes` | 20020 | function |  | 9 |
| `rebuildCurveObjects` | 20049 | function |  | 10 |
| `createCurvePoints` | 20061 | function |  | 2 |
| `addGeneratedBangPreset` | 20070 | function |  | 1 |
| `sampleScalpQuad` | 20163 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20187 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20236 | function |  | 1 |
| `columns` | 20237 | arrow |  | 1 |
| `layer` | 20241 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20455 | function |  | 2 |
| `addBraidedBobPreset` | 20491 | function |  | 1 |
| `evenColumns` | 20492 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20708 | function |  | 1 |
| `scalpSeed` | 20731 | arrow |  | 1 |
| `createBowlCutPoints` | 21018 | function |  | 2 |
| `addBowlCutPreset` | 21056 | function |  | 1 |
| `scalpRegionAtHit` | 21122 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21134 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21141 | function |  | 12 |
| `braidStrokeActive` | 21148 | function |  | 9 |
| `proceduralDrawActive` | 21152 | function |  | 3 |
| `panelStrokeActive` | 21156 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21160 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21164 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 21168 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21174 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21178 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 21182 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21186 | function |  | 3 |
| `liveSurfaceStrandId` | 21196 | function |  | 4 |
| `liveSurfaceStrand` | 21200 | function |  | 4 |
| `liveSurfaceGuideId` | 21205 | function |  | 3 |
| `guideSupportsLiveSurface` | 21209 | function |  | 2 |
| `liveSurfaceGuide` | 21216 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21223 | function |  | 12 |
| `activeStrokeScalpOffset` | 21263 | function |  | 4 |
| `activeStrokeBrushSize` | 21269 | function |  | 10 |
| `activeStrokeBrushDepth` | 21275 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21281 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21289 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21299 | function |  | 13 |
| `worldNormalAtHit` | 21338 | function |  | 6 |
| `selectedPolyMesh` | 21346 | function |  | 10 |
| `addPolyLock` | 21351 | function |  | 2 |
| `ensurePolyMesh` | 21370 | function |  | 3 |
| `polySurfaceSample` | 21374 | function |  | 4 |
| `polyTargetAtEvent` | 21385 | function |  | 6 |
| `refreshPolyMesh` | 21411 | function |  | 10 |
| `ensurePolyFillPreview` | 21420 | function |  | 2 |
| `clearPolyFillPreview` | 21457 | function |  | 17 |
| `polyFillCandidateForEvent` | 21462 | function |  | 3 |
| `showPolyFillPreview` | 21482 | function |  | 2 |
| `updatePolyFillPreview` | 21508 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21533 | function |  | 5 |
| `fillPolyGap` | 21543 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21554 | function |  | 2 |
| `projectPolyRelaxPoint` | 21574 | function |  | 2 |
| `removePolyPointAttributes` | 21618 | function |  | 3 |
| `deletePolyComponent` | 21627 | function |  | 2 |
| `addPolyPoint` | 21650 | function |  | 4 |
| `appendPolyStrokeRow` | 21659 | function |  | 4 |
| `beginPolyBrushPointer` | 21679 | function |  | 1 |
| `finishPolyAltDelete` | 21765 | function |  | 1 |
| `updatePolyBrushStroke` | 21779 | function |  | 1 |
| `finishPolyBrushStroke` | 21869 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21906 | function |  | 2 |
| `drawSampleFromHit` | 21929 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21943 | function |  | 3 |
| `strokeLength` | 21980 | function |  | 9 |
| `resampleDrawStroke` | 21986 | function |  | 2 |
| `processedDrawStroke` | 22018 | function |  | 8 |
| `strokeSurfaceNormals` | 22047 | function |  | 7 |
| `drawClumpFrame` | 22058 | function |  | 4 |
| `nearestCurveParameter` | 22067 | function |  | 2 |
| `drawClumpSampleNormal` | 22081 | function |  | 6 |
| `drawClumpTemplateVector` | 22090 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22096 | function |  | 3 |
| `drawClumpStrandMaps` | 22112 | function |  | 4 |
| `nextClumpName` | 22167 | function |  | 6 |
| `initializeClumpShape` | 22174 | function |  | 5 |
| `stableClumpVariation` | 22185 | function |  | 3 |
| `createClumpFromLocks` | 22197 | function |  | 7 |
| `addLockToClump` | 22222 | function |  | 4 |
| `stableBranchBaseNormals` | 22240 | function |  | 4 |
| `ensureBranchParentNormalField` | 22251 | function |  | 2 |
| `branchParentFrame` | 22257 | function |  | 7 |
| `branchLocalVector` | 22269 | function |  | 3 |
| `branchWorldVector` | 22273 | function |  | 4 |
| `captureBranchLocalState` | 22279 | function |  | 6 |
| `enforceBranchRootPosition` | 22307 | function |  | 4 |
| `pointerToNdc` | 22391 | function |  | 1 |
| `gridProfileSkipCol` | 22407 | function |  | 3 |
| `branchRootRegionSurface` | 22416 | function |  | 6 |
| `toGridCol` | 22441 | arrow |  | 5 |
| `toRow` | 22445 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 22500 | function |  | 2 |
| `branchRootRegionWorldPoints` | 22520 | function |  | 1 |
| `pointAt` | 22526 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 22553 | function |  | 3 |
| `applyBranchRootOffset` | 22625 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 22644 | function |  | 3 |
| `branchChildrenFor` | 22664 | function |  | 9 |
| `detachBranch` | 22668 | function |  | 2 |
| `updateBranchChildren` | 22679 | function |  | 4 |
| `clumpDirectMembers` | 22722 | function |  | 3 |
| `clumpMembersForGuide` | 22727 | function |  | 6 |
| `clumpGuideForLock` | 22731 | function |  | 13 |
| `proceduralGuideForLock` | 22736 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 22743 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 22750 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 22757 | function |  | 3 |
| `proceduralBranchWorldPoints` | 22769 | function |  | 2 |
| `applyProceduralBranchSettings` | 22782 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 22821 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 22837 | function |  | 3 |
| `createProceduralAccessoryLock` | 22851 | function |  | 2 |
| `applyProceduralAccessorySettings` | 22903 | function |  | 2 |
| `clumpFrameAt` | 22954 | function |  | 5 |
| `commitClumpMemberRestState` | 22962 | function |  | 10 |
| `updateClumpMembers` | 23045 | function |  | 10 |
| `dissolveClump` | 23149 | function |  | 6 |
| `detachLockFromClump` | 23186 | function |  | 4 |
| `updateDrawVolumePreview` | 23212 | function |  | 5 |
| `hideDrawClumpPreviews` | 23236 | function |  | 5 |
| `resetDrawVolumePreview` | 23242 | function |  | 3 |
| `updateDrawStrandPreview` | 23248 | function |  | 23 |
| `continueFromTipEnabled` | 23467 | function |  | 2 |
| `selectedTipContinuationLock` | 23473 | function |  | 3 |
| `selectedDrawBranchPoint` | 23486 | function |  | 3 |
| `canBranchDrawFromLock` | 23503 | function |  | 3 |
| `beginDrawStrandStroke` | 23510 | function |  | 2 |
| `beginDrawFreePlane` | 23635 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 23649 | function |  | 2 |
| `updateDrawStrandStroke` | 23674 | function |  | 1 |
| `createDrawnLock` | 23720 | function |  | 3 |
| `setting` | 23724 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 23792 | function |  | 4 |
| `createDrawnBraid` | 23800 | function |  | 2 |
| `createDrawnStrand` | 23857 | function |  | 2 |
| `createDrawnPanel` | 23984 | function |  | 2 |
| `surfaceLatticeNormal` | 24034 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24049 | function |  | 3 |
| `createViewportSurface` | 24114 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24143 | function |  | 6 |
| `hideLoftSurfacePreviews` | 24149 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 24156 | function |  | 4 |
| `updateLoftSurfacePreview` | 24165 | function |  | 5 |
| `resetLoftSurfaceDraft` | 24197 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 24213 | function |  | 3 |
| `cloneCurveSurfaceSource` | 24231 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 24253 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 24279 | function |  | 3 |
| `curveSurfaceProfilePoints` | 24289 | function |  | 3 |
| `curveSurfaceProfileNormals` | 24293 | function |  | 2 |
| `curveSurfacePreviewLock` | 24302 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 24325 | function |  | 2 |
| `hideCurveSurfacePreview` | 24341 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 24353 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 24358 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 24367 | function |  | 3 |
| `curveSurfaceSideVector` | 24405 | function |  | 4 |
| `curveSurfaceDraftCurves` | 24418 | function |  | 2 |
| `curveSurfaceFallbackHit` | 24426 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 24439 | function |  | 5 |
| `updateCurveSurfacePreview` | 24459 | function |  | 6 |
| `resetCurveSurfaceDraft` | 24521 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 24543 | function |  | 3 |
| `beginCurveSurfaceStroke` | 24558 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 24606 | function |  | 3 |
| `updateCurveSurfaceStroke` | 24641 | function |  | 1 |
| `finishCurveSurfaceStroke` | 24673 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 24731 | function |  | 2 |
| `commitCurveSurfaceDraft` | 24808 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 24813 | function |  | 8 |
| `beginLoftSurfaceStroke` | 24822 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 24856 | function |  | 2 |
| `updateLoftSurfaceStroke` | 24867 | function |  | 1 |
| `finishLoftSurfaceStroke` | 24897 | function |  | 2 |
| `extendDrawnStrand` | 24954 | function |  | 2 |
| `finishDrawStrandStroke` | 24987 | function |  | 7 |
| `createPlacedStrand` | 25014 | function |  | 2 |
| `placedPointCount` | 25078 | function |  | 3 |
| `createPlacedPoints` | 25082 | function |  | 3 |
| `pushPointOutsideHead` | 25101 | function |  | 8 |
| `resizePlacedStrand` | 25133 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 25150 | function |  | 5 |
| `beginPlaceEdit` | 25155 | function |  | 2 |
| `updatePlaceEdit` | 25173 | function |  | 1 |
| `updatePlacementLength` | 25187 | function |  | 3 |
| `updatePlacementOrientation` | 25197 | function |  | 3 |
| `endPlaceEdit` | 25215 | function |  | 1 |
| `confirmPendingPlacedStrand` | 25230 | function |  | 1 |
| `pendingPlacedLock` | 25240 | function |  | 2 |
| `beginPlacementPointer` | 25244 | function |  | 3 |
| `finishPlacementPointer` | 25254 | function |  | 2 |
| `confirmPlacementStep` | 25278 | function |  | 2 |
| `finishPlacementFlow` | 25301 | function |  | 7 |
| `updatePlacementStatus` | 25314 | function |  | 82 |
| `deselectStrands` | 25453 | function |  | 12 |
| `beginSelectionMarquee` | 25468 | function |  | 3 |
| `beginAltOrbit` | 25492 | function |  | 1 |
| `beginBlenderNavigation` | 25504 | function |  | 1 |
| `endBlenderNavigation` | 25549 | function |  | 1 |
| `prepareSelectPointerCapture` | 25557 | function |  | 1 |
| `endSelectPointerCapture` | 25563 | function |  | 1 |
| `endAltOrbit` | 25569 | function |  | 1 |
| `dollyCameraByDrag` | 25576 | function |  | 2 |
| `fastDragMagnitude` | 25599 | function |  | 2 |
| `beginHoudiniZoomDrag` | 25605 | function |  | 1 |
| `updateHoudiniZoomDrag` | 25613 | function |  | 1 |
| `endHoudiniZoomDrag` | 25630 | function |  | 1 |
| `updateSelectionMarquee` | 25638 | function |  | 1 |
| `pointInsideSelectionMarquee` | 25655 | function |  | 3 |
| `selectPointsInMarquee` | 25663 | function |  | 2 |
| `pointKey` | 25689 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 25720 | function |  | 2 |
| `objectInsideSelectionMarquee` | 25757 | function |  | 3 |
| `projectedPoint` | 25774 | arrow |  | 1 |
| `selectObjectsInMarquee` | 25803 | function |  | 2 |
| `finishSelectionMarquee` | 25848 | function |  | 2 |
| `headMeshes` | 25871 | function |  | 9 |
| `strandSplitProfileData` | 25879 | function |  | 4 |
| `strandSplitControlPoint` | 25892 | function |  | 4 |
| `panelSplitControlPoint` | 25928 | function |  | 6 |
| `strandControlPointRaycast` | 25984 | function |  | 1 |
| `strandControlPointFrame` | 26019 | function |  | 6 |
| `branchRootGizmoFrame` | 26050 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26068 | function |  | 5 |
| `createCurveObjects` | 26126 | function |  | 4 |
| `polyEdgeKey` | 26299 | function |  | 2 |
| `polyMeshEdges` | 26303 | function |  | 2 |
| `populatePolyEditObjects` | 26317 | function |  | 3 |
| `createPolyEditObjects` | 26378 | function |  | 2 |
| `rebuildPolyEditObjects` | 26386 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 26400 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 26407 | function |  | 2 |
| `strandWidthEdgeSample` | 26416 | function |  | 3 |
| `strandWidthEdgePoints` | 26439 | function |  | 2 |
| `sculptBrushDebugRaycast` | 26453 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 26457 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 26464 | function |  | 3 |
| `refreshSculptBrushDebugView` | 26476 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 26481 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 26487 | function |  | 3 |
| `updateCurveObjects` | 26501 | function |  | 35 |
| `createCurveNormalIndicator` | 26758 | function |  | 2 |
| `pointUpDirection` | 26784 | function |  | 2 |
| `curveFrameAtPoint` | 26788 | function |  | 5 |
| `curveFrameAt` | 26809 | function |  | 10 |
| `strandTwistAt` | 26829 | function |  | 6 |
| `controlPointRotationAt` | 26834 | function |  | 6 |
| `strandProfileTwistAt` | 26838 | function |  | 2 |
| `strandFrameAt` | 26844 | function |  | 1 |
| `curveFrameAtSnapshot` | 26850 | function |  | 3 |
| `outwardNormalAtPoint` | 26869 | function |  | 11 |
| `sampledSurfaceNormal` | 26881 | function |  | 2 |
| `guidedNormalAt` | 26897 | function |  | 5 |
| `twistFromHandle` | 26916 | function |  | 3 |
| `signedAngleAroundAxis` | 26937 | function |  | 5 |
| `handleColor` | 26944 | function |  | 2 |
| `isAffectedCurvePoint` | 26967 | function |  | 2 |
| `syncLockFromCurve` | 26973 | function |  | 26 |
| `labelForPreset` | 27003 | function |  | 1 |
| `rebuildLockGeometry` | 27007 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 27034 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27042 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27048 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27070 | function |  | 8 |
| `updateLockGeometry` | 27083 | function |  | 57 |
| `setGroupColorView` | 27104 | function |  | 2 |
| `createUvCheckerTexture` | 27114 | function |  | 3 |
| `ensureUvCheckerForLock` | 27150 | function |  | 4 |
| `removeUvCheckerFromLock` | 27183 | function |  | 3 |
| `invalidateUvInspector` | 27198 | function |  | 7 |
| `uvInspectorRecord` | 27202 | function |  | 1 |
| `uvInspectorRecords` | 27241 | function |  | 2 |
| `drawUvInspectorGrid` | 27245 | function |  | 2 |
| `renderUvInspector` | 27279 | function |  | 3 |
| `setUvCheckerEnabled` | 27338 | function |  | 3 |
| `strandViewportBaseColor` | 27355 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 27390 | function |  | 3 |
| `syncStrandSelectionOutline` | 27396 | function |  | 2 |
| `applyLockedStrandPalette` | 27407 | function |  | 2 |
| `syncLockedStrandWireVisual` | 27416 | function |  | 6 |
| `setStrandSelectionVisual` | 27425 | function |  | 6 |
| `proceduralParentOutlineVisible` | 27441 | function |  | 2 |
| `syncProceduralParentVisibility` | 27448 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 27457 | function |  | 2 |
| `updateStrandSelectionHighlight` | 27461 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 27465 | function |  | 2 |
| `resetGuideSelectionVisuals` | 27478 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 27498 | function |  | 3 |
| `selectLock` | 27531 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 27584 | function |  | 6 |
| `syncGroupInputs` | 27595 | function |  | 2 |
| `topologyStatsForLock` | 27628 | function |  | 4 |
| `formatTopologyStats` | 27636 | function |  | 5 |
| `updateTopologyStats` | 27640 | function |  | 20 |
| `normalizeBraidDimensions` | 27674 | function |  | 3 |
| `normalizeStrandDimensions` | 27687 | function |  | 3 |
| `strandBaseWidth` | 27701 | function |  | 5 |
| `strandWidthDimension` | 27705 | function |  | 5 |
| `strandDepthDimension` | 27713 | function |  | 8 |
| `setStrandWidthDimension` | 27721 | function |  | 2 |
| `setStrandDepthDimension` | 27743 | function |  | 4 |
| `syncShapeDimensionInputs` | 27759 | function |  | 4 |
| `syncCreationShapeInputs` | 27795 | function |  | 3 |
| `syncViewportDrawSettings` | 27833 | function |  | 5 |
| `syncPanelShapeInputs` | 27847 | function |  | 6 |
| `syncStrandSplitInputs` | 27873 | function |  | 4 |
| `syncHairCardControls` | 27882 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 27890 | function |  | 3 |
| `updateAttributeEditorMode` | 27929 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28079 | function |  | 3 |
| `curveLatticeForGroup` | 28102 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28120 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 28165 | function |  | 2 |
| `showCurveLatticeForGroup` | 28182 | function |  | 2 |
| `selectStrandGroup` | 28219 | function |  | 3 |
| `selectCurvePoint` | 28261 | function |  | 10 |
| `updateSelectedPointLabel` | 28275 | function |  | 14 |
| `syncInputs` | 28288 | function |  | 15 |
| `syncClumpGuidePanel` | 28334 | function |  | 3 |
| `getSelectedLock` | 28361 | function |  | 103 |
| `selectedLocksInOrder` | 28365 | function |  | 37 |
| `lockStrands` | 28371 | function |  | 3 |
| `lockSelectedStrands` | 28404 | function |  | 3 |
| `unlockStrands` | 28410 | function |  | 3 |
| `unlockAllStrands` | 28425 | function |  | 3 |
| `strandEditFamily` | 28429 | function |  | 7 |
| `compatibleSelectedLocks` | 28434 | function |  | 6 |
| `selectedEditRoots` | 28441 | function |  | 2 |
| `editSelectedLocks` | 28454 | function |  | 20 |
| `multiEditValuesEqual` | 28487 | function |  | 2 |
| `setMixedControl` | 28496 | function |  | 28 |
| `syncMultiStrandInputs` | 28513 | function |  | 16 |
| `values` | 28529 | arrow |  | 43 |
| `selectedRebuildableCurves` | 28609 | function |  | 5 |
| `createCompoundStrand` | 28616 | function |  | 1 |
| `refreshRebuildCurveDialog` | 28677 | function |  | 9 |
| `openRebuildCurveDialog` | 28690 | function |  | 1 |
| `rebuildSelectedCurves` | 28704 | function |  | 2 |
| `selectionCanBecomeClump` | 28743 | function |  | 4 |
| `createClumpFromSelection` | 28748 | function |  | 3 |
| `cleanSelectionSets` | 28760 | function |  | 2 |
| `createSelectionSetFromSelection` | 28765 | function |  | 3 |
| `selectionSetById` | 28776 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 28780 | function |  | 7 |
| `editSelectionSetFromSelection` | 28789 | function |  | 5 |
| `deleteSelectionSet` | 28809 | function |  | 2 |
| `selectSelectionSet` | 28818 | function |  | 2 |
| `deleteSelectedStrands` | 28828 | function |  | 4 |
| `deleteGuide` | 28836 | function |  | 3 |
| `deleteSelectedGuide` | 28859 | function |  | 3 |
| `deleteSelectedReferenceImage` | 28863 | function |  | 4 |
| `hasDeletableSelection` | 28876 | function |  | 2 |
| `deleteCurrentSelection` | 28884 | function |  | 3 |
| `hideOutlinerContextMenu` | 28892 | function |  | 17 |
| `outlinerLockTargets` | 28897 | function |  | 3 |
| `showOutlinerContextMenu` | 28924 | function |  | 10 |
| `hideStrandRadialMenu` | 29004 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29015 | function |  | 3 |
| `radialButtonDimensions` | 29028 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29037 | function |  | 3 |
| `applyRadialMenuDimensions` | 29054 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29060 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29073 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29094 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29111 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29120 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29142 | function |  | 5 |
| `clumpMirrorRadialOptions` | 29160 | function |  | 2 |
| `contextualRadialOptions` | 29167 | function |  | 3 |
| `sharedRadialFrameDimensions` | 29296 | function |  | 3 |
| `layoutContextualRadialOptions` | 29300 | function |  | 4 |
| `renderRadialActionList` | 29324 | function |  | 3 |
| `radialListOptionAtPointer` | 29342 | function |  | 3 |
| `syncRadialListHighlight` | 29364 | function |  | 3 |
| `configureContextualRadialMenu` | 29370 | function |  | 3 |
| `beginStrandRadialGesture` | 29430 | function |  | 2 |
| `enterStrandRadialSubmenu` | 29464 | function |  | 2 |
| `updateStrandRadialGesture` | 29510 | function |  | 1 |
| `performStrandRadialAction` | 29549 | function |  | 2 |
| `finishStrandRadialGesture` | 29652 | function |  | 2 |
| `cancelStrandRadialGesture` | 29662 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 29669 | function |  | 1 |
| `setPullMoveEnabled` | 29675 | function |  | 3 |
| `toolRadialOptions` | 29683 | function |  | 2 |
| `hideToolRadialMenu` | 29708 | function |  | 4 |
| `beginToolRadialGesture` | 29721 | function |  | 2 |
| `beginToolShortcutPress` | 29761 | function |  | 2 |
| `finishToolShortcutPress` | 29776 | function |  | 2 |
| `cancelToolShortcutPress` | 29785 | function |  | 5 |
| `setRadialMenusEnabled` | 29793 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 29806 | function |  | 5 |
| `setNavigationTipsEnabled` | 29821 | function |  | 5 |
| `configureNavigationMouseButtons` | 29828 | function |  | 3 |
| `syncNavigationModifierLocks` | 29841 | function |  | 7 |
| `setNavigationStyle` | 29846 | function |  | 5 |
| `applyCameraSmoothingPreference` | 29862 | function |  | 4 |
| `setCameraSmoothingEnabled` | 29877 | function |  | 5 |
| `setCameraSmoothingStrength` | 29883 | function |  | 5 |
| `setScaleSensitivity` | 29891 | function |  | 3 |
| `setToolTipsEnabled` | 29899 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 29906 | function |  | 5 |
| `setViewportStatisticsEnabled` | 29915 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 29923 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 29938 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 29947 | function |  | 5 |
| `sideNamingDisplayId` | 29956 | function |  | 3 |
| `referenceViewDisplayLabel` | 29968 | function |  | 6 |
| `strandRegionDisplayLabel` | 29978 | function |  | 10 |
| `updateSideNamingLabels` | 29996 | function |  | 2 |
| `setSideNamingPerspective` | 30023 | function |  | 5 |
| `setControlPointDisplaySize` | 30032 | function |  | 6 |
| `scaleHexColor` | 30044 | function |  | 3 |
| `setViewportBackgroundColor` | 30049 | function |  | 7 |
| `setDefaultHairShader` | 30071 | function |  | 5 |
| `setPreferenceCategory` | 30077 | function |  | 4 |
| `openPreferencesDialog` | 30104 | function |  | 1 |
| `savePreferencesDialog` | 30132 | function |  | 1 |
| `cancelPreferencesDialog` | 30156 | function |  | 3 |
| `updateToolRadialGesture` | 30185 | function |  | 1 |
| `performToolRadialAction` | 30214 | function |  | 2 |
| `finishToolRadialGesture` | 30224 | function |  | 2 |
| `cancelToolRadialGesture` | 30233 | function |  | 5 |
| `duplicatePlacementTarget` | 30240 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 30267 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 30271 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 30281 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 30286 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 30298 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 30309 | function |  | 7 |
| `openProceduralDuplicateDialog` | 30317 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 30334 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 30355 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 30366 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 30372 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 30378 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 30411 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 30566 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 30668 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 30709 | function |  | 2 |
| `updateDuplicatePlacement` | 30736 | function |  | 2 |
| `beginDuplicatePlacement` | 30800 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 30864 | function |  | 2 |
| `confirmDuplicatePlacement` | 30905 | function |  | 1 |
| `cancelDuplicatePlacement` | 30942 | function |  | 4 |
| `outlinerClumpLocks` | 30968 | function |  | 11 |
| `handleOutlinerClumpDrop` | 30972 | function |  | 3 |
| `createOutlinerStrandButton` | 30995 | function |  | 4 |
| `createOutlinerCurveSurface` | 31081 | function |  | 2 |
| `createOutlinerClump` | 31177 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 31259 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 31266 | function |  | 2 |
| `renderLockList` | 31345 | function |  | 70 |
| `updateCount` | 31499 | function |  | 34 |
| `captureInputUndo` | 31508 | function |  | 1 |
| `bindUndoCapture` | 31514 | function |  | 36 |
| `bindLockInput` | 31525 | function |  | 2 |
| `applyValue` | 31542 | arrow |  | 2 |
| `applyUniformTransformScale` | 31861 | function |  | 2 |
| `applyReducedTransformScale` | 31878 | function |  | 2 |
| `applyTransformPrecision` | 31917 | function |  | 2 |
| `updateTransformScalePointer` | 31946 | function |  | 1 |
| `finishSweepProfileDrag` | 32177 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 32273 | function |  | 3 |
| `finishTaperCurveDrag` | 32335 | function |  | 1 |
| `beginTaperMeshPointDrag` | 32378 | function |  | 1 |
| `updateTaperMeshPointDrag` | 32459 | function |  | 1 |
| `finishTaperMeshPointDrag` | 32514 | function |  | 6 |
| `updateSelectedTaperPoint` | 32538 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33108 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33113 | function |  | 4 |
| `syncDrawCurlControls` | 33168 | function |  | 5 |
| `handleLiveSurfaceChange` | 33216 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 33298 | function |  | 3 |
| `resampleSurfaceLock` | 33313 | function |  | 2 |
| `changePanelSplitCount` | 33426 | function |  | 3 |
| `applyPresetControl` | 33534 | function |  | 2 |
| `applyCreationToolSettings` | 33555 | function |  | 2 |
| `populateCreationPresetSelect` | 33599 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 33623 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 33656 | function |  | 5 |
| `createCustomCreationPreset` | 33664 | function |  | 3 |
| `createCustomClumpPreset` | 33679 | function |  | 3 |
| `commitCustomCreationPreset` | 33694 | function |  | 2 |
| `openRemoveCreationPreset` | 33755 | function |  | 3 |
| `commitRemoveCreationPreset` | 33768 | function |  | 1 |
| `applyBraidToolPreset` | 33785 | function |  | 2 |
| `selectedBranchChildLock` | 33897 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 33901 | function |  | 2 |
| `initPanelResizeHandles` | 34007 | function |  | 2 |
| `applyWidth` | 34013 | arrow |  | 2 |
| `restoreWidth` | 34020 | arrow |  | 2 |
| `bindResize` | 34028 | arrow |  | 2 |
| `onMove` | 34036 | arrow |  | 0 |
| `onUp` | 34040 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 34057 | function |  | 2 |
| `initFloatingPanelControls` | 34066 | function |  | 2 |
| `detach` | 34075 | arrow |  | 43 |
| `endDrag` | 34113 | arrow |  | 0 |
| `endResize` | 34145 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 34156 | function |  | 3 |
| `selectPatchNotesVersion` | 34290 | function |  | 3 |
| `requestReferenceImage` | 34323 | function |  | 5 |
| `toggleCapsuleGuideTool` | 34527 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 34533 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 34540 | function |  | 1 |
| `deleteLocks` | 35107 | function |  | 10 |
| `disposeCurveObjects` | 35185 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 35237 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 35268 | function |  | 1 |
| `endPanelSplitHandleDrag` | 35343 | function |  | 2 |
| `resize` | 35376 | function |  | 3 |
| `handleViewportPointerMove` | 35387 | function |  | 1 |
| `blockProportionalSizingEvent` | 35398 | function |  | 1 |
| `updateLightAngleFromInputs` | 35404 | function |  | 2 |
| `startViewSnap` | 35418 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 35448 | function |  | 3 |
| `trackViewportPointerDown` | 35465 | function |  | 1 |
| `trackViewportPointerMove` | 35481 | function |  | 1 |
| `clearViewportPointer` | 35489 | function |  | 1 |
| `updateViewSnap` | 35494 | function |  | 1 |
| `nearestCardinalAxis` | 35530 | function |  | 5 |
| `cardinalAxisKey` | 35544 | function |  | 5 |
| `steppedDragAmount` | 35548 | function |  | 3 |
| `snapCameraToCardinalAxis` | 35554 | function |  | 4 |
| `endViewSnap` | 35570 | function |  | 4 |
| `activateStrandControlPoint` | 35580 | function |  | 4 |
| `refreshStrandControlPointSelection` | 35630 | function |  | 4 |
| `addStrandControlPointSelection` | 35657 | function |  | 3 |
| `removeStrandControlPointSelection` | 35674 | function |  | 3 |
| `sampleStrandPointNormal` | 35688 | function |  | 2 |
| `sampleStrandPointVectors` | 35698 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 35704 | function |  | 2 |
| `resampleStrandCurveData` | 35715 | function |  | 4 |
| `resampleMatchingVectors` | 35721 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 35760 | function |  | 4 |
| `removeStrandCurvePoint` | 35771 | function |  | 2 |
| `closestStrandCurveParameter` | 35784 | function |  | 2 |
| `insertStrandCurvePoint` | 35813 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 35830 | function |  | 2 |
| `selectionModifierCursorAvailable` | 35840 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 35856 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 35863 | function |  | 4 |
| `prepareCurvePointSelection` | 35885 | function |  | 1 |
| `finishCurvePointInsertion` | 35996 | function |  | 1 |
| `finishPointRemoval` | 36011 | function |  | 1 |
| `editableStrandWidth` | 36029 | function |  | 6 |
| `editableStrandWidthBounds` | 36041 | function |  | 2 |
| `applyEditableStrandWidth` | 36047 | function |  | 3 |
| `viewportPixelPoint` | 36083 | function |  | 3 |
| `syncSculptBrushControls` | 36091 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 36106 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 36114 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 36122 | function |  | 1 |
| `sculptBrushPlaneOffset` | 36128 | function |  | 5 |
| `setSculptBrushCursorVisible` | 36132 | function |  | 7 |
| `updateSculptBrushCursor` | 36139 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 36161 | function |  | 4 |
| `sculptBrushEditableLock` | 36168 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 36178 | function |  | 5 |
| `sculptBrushLockViable` | 36184 | function |  | 5 |
| `sculptBrushUnits` | 36195 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 36233 | function |  | 4 |
| `sculptBrushPointWeight` | 36283 | function |  | 5 |
| `sculptBrushWorldDelta` | 36293 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 36302 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 36328 | function |  | 2 |
| `beginSculptMoveStroke` | 36386 | function |  | 1 |
| `applySculptMoveStrokeSample` | 36448 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 36683 | function |  | 3 |
| `updateSculptMoveStroke` | 36692 | function |  | 1 |
| `finishSculptMoveStroke` | 36708 | function |  | 3 |
| `strandControlPointHit` | 36756 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 36760 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 36838 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 36872 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 36912 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 36925 | function |  | 1 |
| `setHoveredControlPoint` | 36964 | function |  | 7 |
| `visibleControlPointHoverTargets` | 36977 | function |  | 2 |
| `updateControlPointHover` | 37013 | function |  | 1 |
| `animate` | 37569 | function |  | 2 |
| `syncCompactSidebarLayout` | 37600 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 37619 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 37625 | function |  | 3 |
| `setAttributeEditorTab` | 37631 | function |  | 6 |

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

## modules/geometry/branch-region-panel.js（773 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchRegionApi` | 7 | function | export | 2 |
| `syncBranchRootRegionOffsets` | 15 | function |  | 6 |
| `updateBranchRootRegionCenter` | 40 | function |  | 1 |
| `clampRegionParam` | 79 | function |  | 106 |
| `branchRootRegionFromParam` | 83 | function |  | 1 |
| `cloneBranchRootRegion` | 106 | function |  | 1 |
| `flip` | 108 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 134 | function |  | 7 |
| `setBranchRootRegionPoint` | 165 | function |  | 2 |
| `branchRegionUVToCanvas` | 198 | function |  | 10 |
| `branchRegionCanvasToUV` | 202 | function |  | 4 |
| `openBranchRegionEditor` | 209 | function |  | 2 |
| `closeBranchRegionEditor` | 224 | function |  | 2 |
| `retargetBranchRegionEditor` | 231 | function |  | 1 |
| `renderBranchRegionEditor` | 237 | function |  | 8 |
| `applyBranchRegionView` | 321 | function |  | 6 |
| `resetBranchRegionZoom` | 325 | function |  | 1 |
| `branchRegionNavAction` | 330 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 345 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 366 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 371 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 398 | function |  | 2 |
| `endBranchRegionCanvasNav` | 411 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 417 | function |  | 1 |
| `branchRegionEventUV` | 438 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 446 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 552 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 686 | function |  | 1 |
| `beginBranchSweepStartDrag` | 692 | function |  | 1 |
| `updateBranchSweepStartDrag` | 707 | function |  | 1 |
| `endBranchSweepStartDrag` | 731 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 737 | function |  | 4 |

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
