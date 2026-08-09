# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1716** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38753 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 245 | function |  | 3 |
| `saveBooleanPreference` | 273 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 277 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 282 | function |  | 2 |
| `normalizeScaleSensitivity` | 287 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 292 | function |  | 2 |
| `normalizeSideNamingPerspective` | 297 | function |  | 2 |
| `normalizeNavigationStyle` | 301 | function |  | 2 |
| `setupEditableSliderControls` | 315 | function |  | 2 |
| `syncNumberFromRange` | 366 | arrow |  | 0 |
| `applyNumberValue` | 373 | arrow |  | 0 |
| `copyCameraPose` | 483 | function |  | 3 |
| `updateCameraProjectionForViewport` | 489 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 502 | function |  | 3 |
| `setOrthographicView` | 508 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 548 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 577 | function |  | 2 |
| `removeRotateFreeAxisRing` | 603 | function |  | 2 |
| `deflateTransformGizmoPickers` | 615 | function |  | 2 |
| `nextStrandName` | 998 | function |  | 2 |
| `activeDrawClumpTemplate` | 1083 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1088 | function |  | 3 |
| `drawModeCreatesClump` | 1115 | function |  | 1 |
| `isPanelGeometry` | 1259 | function |  | 31 |
| `normalizePanelSplits` | 1263 | function |  | 3 |
| `clonePanelSplits` | 1275 | function |  | 19 |
| `snapPanelSplitHeight` | 1279 | function |  | 5 |
| `createQuadSphereGeometry` | 1314 | function |  | 2 |
| `vertexIndex` | 1328 | function |  | 11 |
| `addEdge` | 1346 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1381 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1451 | function |  | 3 |
| `updateScalpRenderGeometry` | 1478 | function |  | 4 |
| `writeScalpRegionColors` | 1529 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1542 | function |  | 2 |
| `createScalpSelectionOutline` | 1572 | function |  | 5 |
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
| `currentStrandSelectionState` | 2102 | function |  | 4 |
| `applyStrandSelectionState` | 2106 | function |  | 5 |
| `clearStrandSelectionState` | 2111 | function |  | 7 |
| `guideHeadBounds` | 3219 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3229 | function |  | 5 |
| `disposeGuideModel` | 3243 | function |  | 3 |
| `syncHeadTransformInputs` | 3254 | function |  | 4 |
| `applyHeadTransform` | 3261 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3279 | function |  | 4 |
| `applyScalpRoughScale` | 3288 | function |  | 5 |
| `resetHeadTransform` | 3302 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3316 | function |  | 2 |
| `installGuideModel` | 3332 | function |  | 5 |
| `loadDefaultGuideModel` | 3408 | function |  | 3 |
| `braidTemplateFromEntries` | 3431 | function |  | 4 |
| `braidMeshEntries` | 3463 | function |  | 2 |
| `prepareBraidBodyCache` | 3475 | function |  | 2 |
| `quantize` | 3484 | arrow |  | 21 |
| `sourceNormalAt` | 3496 | arrow |  | 1 |
| `clusterBoundary` | 3499 | arrow |  | 2 |
| `normalBuckets` | 3516 | arrow |  | 2 |
| `applyBucketPair` | 3548 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3579 | function |  | 2 |
| `annotateBraidObjTopology` | 3600 | function |  | 2 |
| `loadBraidMeshPreset` | 3620 | function |  | 3 |
| `createSplitControlHandle` | 3637 | function |  | 4 |
| `frameGuideModel` | 3652 | function |  | 2 |
| `syncScalpInputs` | 3677 | function |  | 2 |
| `syncScalpArtistInputs` | 3683 | function |  | 2 |
| `rootScalpOffsetDistance` | 3691 | function |  | 15 |
| `applyLockRootScalpOffset` | 3696 | function |  | 5 |
| `normalizeHairLayer` | 3712 | function |  | 28 |
| `layerOffsetForLock` | 3716 | function |  | 9 |
| `layerRootOffsetFactor` | 3721 | function |  | 13 |
| `layerOffsetWeight` | 3725 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3731 | function |  | 5 |
| `pointsWithLayerOffset` | 3740 | function |  | 3 |
| `layerDirectionForLock` | 3748 | function |  | 2 |
| `applyLayerOffset` | 3759 | function |  | 5 |
| `setLockHairLayer` | 3783 | function |  | 2 |
| `setGroupLayerOffset` | 3798 | function |  | 2 |
| `scalpArtistWeight` | 3810 | function |  | 3 |
| `scalpArtistScalesAt` | 3814 | function |  | 3 |
| `applyScalpArtistShape` | 3824 | function |  | 5 |
| `inverseScalpArtistShape` | 3842 | function |  | 2 |
| `updateScalpSurface` | 3869 | function |  | 3 |
| `setActiveScalpRegion` | 3879 | function |  | 2 |
| `clearScalpRegions` | 3891 | function |  | 2 |
| `scalpHitFromEvent` | 3908 | function |  | 3 |
| `updateScalpBrushCursor` | 3916 | function |  | 4 |
| `paintScalpAt` | 3931 | function |  | 3 |
| `beginScalpPaint` | 3998 | function |  | 2 |
| `updateScalpPaint` | 4007 | function |  | 1 |
| `endScalpPaint` | 4016 | function |  | 2 |
| `createScalpLattice` | 4023 | function |  | 2 |
| `resetScalpLattice` | 4048 | function |  | 1 |
| `updateScalpLatticeObjects` | 4060 | function |  | 7 |
| `quadraticWeights` | 4074 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4079 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4106 | function |  | 3 |
| `selectScalpLatticePoint` | 4121 | function |  | 2 |
| `beginScalpLatticeDrag` | 4136 | function |  | 2 |
| `updateScalpLatticeDrag` | 4154 | function |  | 1 |
| `endScalpLatticeDrag` | 4172 | function |  | 2 |
| `setHeadReferenceTransparency` | 4178 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4188 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4206 | function |  | 3 |
| `trianglePlaneIntersections` | 4214 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4235 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4261 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4271 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4283 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4307 | function |  | 3 |
| `createScalpBuilderPlanes` | 4322 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4354 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4393 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4416 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4428 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4440 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4445 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4457 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4567 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4592 | function |  | 5 |
| `syncEditedScalpSurface` | 4607 | function |  | 4 |
| `ensureEditedScalpSurface` | 4678 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4708 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4793 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4806 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4822 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4832 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4850 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4863 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4870 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4889 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4903 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4944 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4953 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4966 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4987 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5124 | function |  | 2 |
| `scalpTemplateNeighbors` | 5132 | function |  | 2 |
| `smoothScalpVectorField` | 5144 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5158 | function |  | 2 |
| `upperContourCurve` | 5175 | function |  | 4 |
| `hermitePoint` | 5210 | function |  | 2 |
| `curveNetworkSection` | 5221 | function |  | 3 |
| `pointAlongSection` | 5250 | function |  | 3 |
| `longestStitchedContour` | 5256 | function |  | 2 |
| `nodeForPoint` | 5264 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5321 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5331 | function |  | 1 |
| `orderedRange` | 5343 | arrow |  | 3 |
| `clipSegment` | 5366 | arrow |  | 1 |
| `liftedPoint` | 5389 | arrow |  | 5 |
| `boundaryCorner` | 5394 | arrow |  | 4 |
| `surfaceCurveBetween` | 5403 | arrow |  | 1 |
| `addSurfaceConnector` | 5426 | arrow |  | 2 |
| `sideContourAtDepth` | 5494 | arrow |  | 3 |
| `addSurfacePatch` | 5528 | arrow |  | 1 |
| `addCenterBridgePatch` | 5608 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5716 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5751 | function |  | 1 |
| `generatedScalpObjContent` | 5841 | function |  | 2 |
| `generateScalpFromBuilder` | 5855 | function |  | 1 |
| `orderedDepthRange` | 5891 | arrow |  | 7 |
| `resetScalpBuilder` | 6020 | function |  | 1 |
| `confirmScalpBuilderPlane` | 6035 | function |  | 1 |
| `beginScalpBuilderInput` | 6049 | function |  | 2 |
| `updateScalpBuilderStroke` | 6050 | function |  | 1 |
| `finishScalpBuilderStroke` | 6051 | function |  | 2 |
| `setScalpBuilderEditing` | 6053 | function |  | 10 |
| `updateScalpEditingVisibility` | 6087 | function |  | 12 |
| `exitSetupEditors` | 6181 | function |  | 7 |
| `setCapsuleGuideEditing` | 6190 | function |  | 5 |
| `syncAppMenuVisibility` | 6218 | function |  | 3 |
| `closeAppMenus` | 6223 | function |  | 6 |
| `setAppMenuOpen` | 6234 | function |  | 3 |
| `setTurntableActive` | 6241 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6250 | function |  | 9 |
| `selectedReferenceImage` | 6254 | function |  | 20 |
| `normalizeReferenceCrop` | 6260 | function |  | 8 |
| `referenceCropIsFull` | 6268 | function |  | 3 |
| `referencePlaneFrontAxis` | 6273 | function |  | 4 |
| `referencePlanePlacement` | 6282 | function |  | 4 |
| `migratedReferencePlanePosition` | 6297 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6317 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6334 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6350 | function |  | 2 |
| `snappedReferenceImageView` | 6373 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6379 | function |  | 5 |
| `applyReferenceImageRuntime` | 6395 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6438 | function |  | 6 |
| `createReferenceImageRuntime` | 6446 | function |  | 3 |
| `addReferenceImage` | 6515 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6567 | function |  | 3 |
| `disposeReferenceImage` | 6586 | function |  | 2 |
| `clearReferenceImages` | 6590 | function |  | 2 |
| `serializeReferenceImage` | 6597 | function |  | 1 |
| `setReferenceImageType` | 6625 | function |  | 2 |
| `attachReferenceImageTransform` | 6669 | function |  | 6 |
| `selectReferenceImage` | 6683 | function |  | 12 |
| `placeReferencePlane` | 6706 | function |  | 2 |
| `setReferencePlaneInFront` | 6717 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6727 | function |  | 4 |
| `renderReferenceImagePanel` | 6746 | function |  | 20 |
| `setOutlinerTab` | 6793 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6811 | function |  | 4 |
| `componentEditModeActive` | 6815 | function |  | 38 |
| `selectionToolSupportsPicking` | 6819 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6824 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6840 | function |  | 2 |
| `setViewportSelectionMode` | 6870 | function |  | 4 |
| `setViewportEditMode` | 6882 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6924 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6938 | function |  | 8 |
| `outlinerGuides` | 6950 | function |  | 3 |
| `guideOutlinerLabel` | 6957 | function |  | 2 |
| `normalizeOutlinerName` | 6967 | function |  | 4 |
| `beginOutlinerRename` | 6972 | function |  | 2 |
| `finish` | 6983 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 7013 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 7023 | function |  | 2 |
| `renderGuideOutliner` | 7058 | function |  | 10 |
| `referenceOutlinerGroup` | 7116 | function |  | 2 |
| `renderReferenceOutliner` | 7120 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7237 | function |  | 5 |
| `readReferenceImageFile` | 7242 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7266 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7273 | function |  | 3 |
| `dragContainsReferenceImage` | 7318 | function |  | 3 |
| `setReferenceImageDragActive` | 7329 | function |  | 9 |
| `referenceDropDestination` | 7337 | function |  | 2 |
| `viewportOverlayDropPosition` | 7343 | function |  | 2 |
| `setReferenceDropHover` | 7352 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7370 | function |  | 2 |
| `referenceOverlayAtPointer` | 7390 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7408 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7421 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7467 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7517 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7539 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7550 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7576 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7585 | function |  | 2 |
| `referenceCropCursor` | 7600 | function |  | 3 |
| `updateReferenceCropHandles` | 7606 | function |  | 5 |
| `referenceCropSourcePoint` | 7627 | function |  | 2 |
| `beginReferenceCrop` | 7634 | function |  | 1 |
| `updateReferenceCrop` | 7672 | function |  | 1 |
| `finishReferenceCrop` | 7704 | function |  | 4 |
| `setHeadSetupEditing` | 7722 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7738 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7747 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7757 | function |  | 4 |
| `setScalpGuideVisibility` | 7763 | function |  | 12 |
| `currentGuideViewMode` | 7771 | function |  | 3 |
| `updateGuideViewToggle` | 7779 | function |  | 5 |
| `setGuideViewMode` | 7795 | function |  | 3 |
| `cycleGuideViewMode` | 7806 | function |  | 1 |
| `hideGuideViewContextMenu` | 7811 | function |  | 6 |
| `showGuideViewContextMenu` | 7815 | function |  | 1 |
| `strandPassesDisplayFilters` | 7828 | function |  | 4 |
| `strandVisibleForDisplay` | 7837 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7842 | function |  | 2 |
| `lockedStrandsExist` | 7846 | function |  | 3 |
| `hiddenStrandsExist` | 7850 | function |  | 2 |
| `hideSelectedStrands` | 7854 | function |  | 2 |
| `unhideHiddenStrands` | 7864 | function |  | 2 |
| `strandIsolationActive` | 7873 | function |  | 7 |
| `setStrandIsolation` | 7877 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7889 | function |  | 3 |
| `syncVisibilityParent` | 7900 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7907 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7936 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7943 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7963 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7986 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7994 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 8001 | function |  | 9 |
| `setScalpLatticeEditing` | 8012 | function |  | 4 |
| `setScalpShapeEditing` | 8027 | function |  | 9 |
| `setScalpPaintEditing` | 8045 | function |  | 7 |
| `defaultCurveLatticePoints` | 8069 | function |  | 3 |
| `flatCurveLatticePoints` | 8095 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8104 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8128 | function |  | 4 |
| `horizontalValue` | 8133 | arrow |  | 1 |
| `blendedSample` | 8144 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8177 | function |  | 2 |
| `curveLatticeControlPoint` | 8192 | function |  | 9 |
| `circularArcTangent` | 8196 | function |  | 4 |
| `arcLengthTo` | 8227 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8239 | function |  | 3 |
| `sampleHermiteCurve` | 8278 | function |  | 10 |
| `sampleCurveLattice` | 8295 | function |  | 6 |
| `curveLatticeNormal` | 8314 | function |  | 1 |
| `createCurveLatticeGeometry` | 8325 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8354 | function |  | 3 |
| `appendCurve` | 8356 | arrow |  | 4 |
| `sample` | 8358 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8385 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8401 | function |  | 3 |
| `addPicker` | 8403 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8442 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8455 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8459 | function |  | 3 |
| `curveLatticeEditablePoint` | 8477 | function |  | 13 |
| `curveLatticePointSection` | 8484 | function |  | 3 |
| `curveLatticeRestPoint` | 8495 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8501 | function |  | 7 |
| `curveLatticeRootColumns` | 8507 | function |  | 3 |
| `curveTangentsForPoints` | 8514 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8526 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8563 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8589 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8606 | function |  | 3 |
| `resampleGrid` | 8616 | arrow |  | 2 |
| `controlPointIsSelected` | 8643 | function |  | 7 |
| `clearMultiPointSelection` | 8651 | function |  | 9 |
| `createCurveLatticeHandles` | 8655 | function |  | 4 |
| `addCurveLattice` | 8677 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8786 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8817 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8823 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8862 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8883 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8900 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8909 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8916 | function |  | 1 |
| `selectCurveLatticeLoop` | 8935 | function |  | 3 |
| `selectCurveLatticePoint` | 8964 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8979 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 9021 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9042 | function |  | 3 |
| `curveLatticeColumnPoints` | 9085 | function |  | 3 |
| `groupCurveControlIndices` | 9094 | function |  | 4 |
| `groupCurveControlPoints` | 9100 | function |  | 2 |
| `updateGroupCurveDisplay` | 9106 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9116 | function |  | 2 |
| `groupCurveDeformationPairs` | 9138 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9145 | function |  | 2 |
| `appendPairs` | 9147 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9158 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9177 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9198 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9217 | function |  | 2 |
| `capsuleGuideCapHeight` | 9251 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9255 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9260 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9264 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9276 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9292 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9298 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9324 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9354 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9408 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9429 | function |  | 7 |
| `vertex` | 9443 | function |  | 4 |
| `addFace` | 9449 | function |  | 3 |
| `addRing` | 9467 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9522 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9532 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9597 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9643 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9656 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9677 | function |  | 3 |
| `capsuleGuidePointDistances` | 9682 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9703 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9723 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9728 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9734 | function |  | 3 |
| `capsuleGuideAccentColor` | 9739 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9744 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9755 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9767 | function |  | 2 |
| `createCapsuleGuideHandles` | 9799 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9822 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9841 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9848 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9864 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9881 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9896 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9933 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9949 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9966 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9972 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9999 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 10011 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 10030 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10075 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10110 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10124 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10130 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10147 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10158 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10169 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10199 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10209 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10250 | function |  | 3 |
| `createQuadCageGeometry` | 10266 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10290 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10310 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10321 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10374 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10412 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10422 | function |  | 4 |
| `addCapsuleGuide` | 10430 | function |  | 4 |
| `addGuide` | 10499 | function |  | 1 |
| `createGuideGeometry` | 10560 | function |  | 4 |
| `selectGuide` | 10615 | function |  | 17 |
| `updateGuideControlsVisibility` | 10683 | function |  | 10 |
| `updateViewportToolVisibility` | 10700 | function |  | 7 |
| `getSelectedGuide` | 10739 | function |  | 34 |
| `selectedViewportFocusBounds` | 10743 | function |  | 2 |
| `frameViewportBounds` | 10757 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10787 | function |  | 2 |
| `fullSceneFocusBounds` | 10791 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10808 | function |  | 3 |
| `cycleViewportFraming` | 10817 | function |  | 2 |
| `syncGuideInputs` | 10835 | function |  | 5 |
| `updateGuideGeometry` | 10878 | function |  | 3 |
| `sculptBrushToolActive` | 10899 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10903 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10907 | function |  | 3 |
| `effectiveSculptBrushTool` | 10911 | function |  | 13 |
| `updateSculptScaleModeRow` | 10917 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10922 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10944 | function |  | 5 |
| `setActiveTool` | 10953 | function |  | 19 |
| `setDrawStrandMode` | 11091 | function |  | 2 |
| `setObjectSpaceEditing` | 11101 | function |  | 7 |
| `setHierarchyEditing` | 11117 | function |  | 4 |
| `setProportionalEditing` | 11129 | function |  | 5 |
| `beginProportionalSizeEdit` | 11148 | function |  | 3 |
| `updateProportionalSizeEdit` | 11160 | function |  | 2 |
| `endProportionalSizeEdit` | 11171 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11178 | function |  | 2 |
| `refreshProportionalPreview` | 11186 | function |  | 4 |
| `activeBrushSizeInput` | 11196 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11205 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11217 | function |  | 2 |
| `beginBrushSizeDrag` | 11235 | function |  | 1 |
| `updateBrushSizeDrag` | 11262 | function |  | 1 |
| `finishBrushSizeDrag` | 11283 | function |  | 2 |
| `updateInteractionLocks` | 11300 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11309 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11318 | function |  | 2 |
| `configureTransformControls` | 11349 | function |  | 16 |
| `pullMoveActive` | 11357 | function |  | 9 |
| `updatePullGuideVisual` | 11361 | function |  | 4 |
| `attachTransformForCurvePoint` | 11377 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11401 | function |  | 7 |
| `strandObjectRootIndex` | 11417 | function |  | 3 |
| `strandObjectRoot` | 11426 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11430 | function |  | 2 |
| `attachStrandObjectTransform` | 11435 | function |  | 6 |
| `guideObjectPivot` | 11458 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11469 | function |  | 2 |
| `attachGuideObjectTransform` | 11474 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11493 | function |  | 2 |
| `beginGuideObjectTransform` | 11521 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11528 | function |  | 2 |
| `updateGuideObjectTransform` | 11550 | function |  | 2 |
| `finishGuideObjectTransform` | 11583 | function |  | 2 |
| `clonePlacementFrame` | 11592 | function |  | 2 |
| `cloneOptionalVectors` | 11604 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11608 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11625 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11640 | function |  | 2 |
| `strandObjectTransformOperators` | 11656 | function |  | 4 |
| `transformPoint` | 11664 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11671 | arrow |  | 0 |
| `transformNormal` | 11677 | arrow |  | 10 |
| `transformDirection` | 11687 | arrow |  | 7 |
| `worldMatrixForPivot` | 11699 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11705 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11721 | function |  | 6 |
| `beginStrandObjectTransform` | 11735 | function |  | 2 |
| `updateStrandObjectTransform` | 11773 | function |  | 2 |
| `commitStrandObjectTransform` | 11822 | function |  | 2 |
| `mapPoints` | 11835 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11869 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11883 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11906 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11919 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11934 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11960 | function |  | 2 |
| `finishSurfaceObjectTransform` | 12009 | function |  | 2 |
| `beginHandleEdit` | 12018 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12067 | function |  | 3 |
| `applyBranchRigidRootMove` | 12084 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12121 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12132 | function |  | 3 |
| `multiPointHandleEditActive` | 12143 | function |  | 7 |
| `applyMultiMove` | 12147 | function |  | 5 |
| `applyMultiRotate` | 12153 | function |  | 2 |
| `applyMultiScale` | 12162 | function |  | 2 |
| `applyHierarchicalMove` | 12171 | function |  | 3 |
| `applySingleMove` | 12183 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12187 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12204 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12213 | function |  | 3 |
| `changed` | 12223 | arrow |  | 1 |
| `applyPullMove` | 12265 | function |  | 3 |
| `pullHeadCollisionContext` | 12273 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12292 | function |  | 2 |
| `applyProportionalMove` | 12315 | function |  | 3 |
| `viewPlaneNormal` | 12326 | function |  | 20 |
| `isCameraInSnappedView` | 12330 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12338 | function |  | 10 |
| `updateViewPlaneGrid` | 12342 | function |  | 14 |
| `setViewPlaneMove` | 12399 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12410 | function |  | 2 |
| `rayFromViewportEvent` | 12418 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12426 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12436 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12447 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12460 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12479 | function |  | 4 |
| `beginViewPlaneMove` | 12486 | function |  | 3 |
| `updateViewPlaneMove` | 12550 | function |  | 1 |
| `endViewPlaneMove` | 12615 | function |  | 7 |
| `applyHierarchicalRotate` | 12634 | function |  | 2 |
| `rotateGuideNormal` | 12641 | arrow |  | 4 |
| `applySingleRotate` | 12679 | function |  | 2 |
| `applyProportionalRotate` | 12683 | function |  | 2 |
| `applyHierarchicalScale` | 12703 | function |  | 2 |
| `applySingleScale` | 12713 | function |  | 2 |
| `applyProportionalScale` | 12717 | function |  | 2 |
| `setPointScale` | 12733 | function |  | 8 |
| `proportionalWeight` | 12742 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12754 | function |  | 5 |
| `strandInfluenceColor` | 12760 | function |  | 17 |
| `beginRelaxEdit` | 12785 | function |  | 3 |
| `updateRelaxEdit` | 12814 | function |  | 1 |
| `endRelaxEdit` | 12874 | function |  | 1 |
| `disposeGuide` | 12884 | function |  | 3 |
| `removeGuideObjects` | 12912 | function |  | 3 |
| `strandRadiusAt` | 12926 | function |  | 5 |
| `strandProfileTopologyAt` | 12943 | function |  | 8 |
| `strandCurveParameters` | 12985 | function |  | 5 |
| `widthProfileAt` | 12995 | arrow |  | 1 |
| `braidFrameAt` | 13033 | function |  | 5 |
| `braidFrameAtExtended` | 13043 | function |  | 2 |
| `createBraidProfileProjector` | 13052 | function |  | 2 |
| `project` | 13068 | arrow |  | 17 |
| `createBraidGeometry` | 13083 | function |  | 2 |
| `deformationAt` | 13118 | function |  | 3 |
| `widthFor` | 13127 | arrow |  | 3 |
| `depthFor` | 13131 | arrow |  | 3 |
| `outputVertex` | 13163 | function |  | 7 |
| `appendAuthoredCap` | 13271 | function |  | 3 |
| `outputCapVertex` | 13278 | arrow |  | 6 |
| `capBoundary` | 13369 | function |  | 3 |
| `strandGeometryCurve` | 13431 | function |  | 15 |
| `strandGeometryFrameAt` | 13457 | function |  | 19 |
| `transportedStrandFrameAt` | 13520 | function |  | 7 |
| `twistOverrideAt` | 13523 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13551 | function |  | 2 |
| `weldPanelGeometryData` | 13587 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13627 | function |  | 3 |
| `surfacePanelPoint` | 13642 | function |  | 3 |
| `createPanelStrandGeometry` | 13665 | function |  | 2 |
| `addQuad` | 13699 | arrow |  | 6 |
| `near` | 13703 | arrow |  | 6 |
| `panelWidthAt` | 13733 | arrow |  | 6 |
| `panelThicknessAt` | 13742 | arrow |  | 6 |
| `panelFrameAt` | 13751 | arrow |  | 1 |
| `rawPanelPoint` | 13769 | arrow |  | 1 |
| `panelPoint` | 13789 | arrow |  | 2 |
| `addPatch` | 13795 | arrow |  | 1 |
| `splitOpening` | 13846 | arrow |  | 2 |
| `uStart` | 13870 | arrow |  | 1 |
| `uEnd` | 13873 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13911 | function |  | 3 |
| `inside` | 13912 | arrow |  | 2 |
| `pushOrientedTriangle` | 13934 | function |  | 7 |
| `triangulatePolygon3D` | 13945 | function |  | 1 |
| `orientedQuadFace` | 13985 | function |  | 2 |
| `createSplitStrandGeometry` | 13993 | function |  | 2 |
| `fusedIndexAt` | 14150 | arrow |  | 0 |
| `createHairCardGeometry` | 14199 | function |  | 2 |
| `createPolyGeometry` | 14298 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14325 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14334 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14381 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14389 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14405 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14414 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14425 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14433 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14443 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14463 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14486 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14565 | function |  | 2 |
| `pushBoundary` | 14594 | arrow |  | 5 |
| `boundaryAt` | 14612 | arrow |  | 3 |
| `hermite` | 14634 | arrow |  | 2 |
| `emitBottomMidRow` | 14679 | arrow |  | 2 |
| `emitTopMidRow` | 14778 | arrow |  | 2 |
| `sideHoleVertex` | 14820 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14869 | arrow |  | 2 |
| `emitFillStrip` | 14940 | arrow |  | 2 |
| `fillSide` | 14951 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14995 | arrow |  | 2 |
| `edgeDirection` | 15019 | arrow |  | 1 |
| `positionAt` | 15078 | arrow |  | 1 |
| `createBranchChildGeometry` | 15129 | function |  | 2 |
| `createCompoundStrandGeometry` | 15339 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15590 | function |  | 2 |
| `createHairGeometry` | 15621 | function |  | 6 |
| `createBaseHairGeometry` | 15673 | function |  | 3 |
| `hairMaterialDefinition` | 15791 | function |  | 4 |
| `materialForLock` | 15795 | function |  | 8 |
| `activeHairMaterialDefinition` | 15799 | function |  | 11 |
| `strandDisplayColor` | 15805 | function |  | 14 |
| `setAnimeHairBaseColor` | 15823 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15836 | function |  | 2 |
| `createHairMaterial` | 15876 | function |  | 5 |
| `createStrandSelectionOutline` | 15918 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15952 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15961 | function |  | 6 |
| `refreshMaterialUsers` | 15988 | function |  | 6 |
| `renderHairMaterialOutliner` | 15997 | function |  | 5 |
| `renderHairMaterialOptions` | 16027 | function |  | 3 |
| `syncHairMaterialEditor` | 16037 | function |  | 9 |
| `createProjectHairMaterial` | 16063 | function |  | 3 |
| `deleteActiveHairMaterial` | 16083 | function |  | 2 |
| `createHairTopologyGeometry` | 16101 | function |  | 4 |
| `createHairTopologyOverlay` | 16122 | function |  | 3 |
| `groupDefaultsFor` | 16169 | function |  | 9 |
| `creationToolActive` | 16176 | function |  | 8 |
| `activeCreationShapeDefaults` | 16180 | function |  | 11 |
| `activeStrandShapeTarget` | 16186 | function |  | 5 |
| `curvePolylineLength` | 16190 | function |  | 2 |
| `curvePolylineLengths` | 16198 | function |  | 3 |
| `samplePolylineDistance` | 16206 | function |  | 2 |
| `applyProjectedCurveLength` | 16216 | function |  | 4 |
| `clearRegionLengthBaseline` | 16247 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16254 | function |  | 2 |
| `setGroupLengthScale` | 16262 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16300 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16332 | function |  | 1 |
| `activeSweepProfile` | 16341 | function |  | 9 |
| `activeSweepProfileTarget` | 16348 | function |  | 6 |
| `trimmedSweepProfile` | 16355 | function |  | 7 |
| `roundedLeft` | 16364 | arrow |  | 1 |
| `roundedRight` | 16370 | arrow |  | 1 |
| `activeProfileOffset` | 16387 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16394 | function |  | 3 |
| `profileToCanvas` | 16411 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16415 | function |  | 11 |
| `sampleSweepProfile` | 16424 | function |  | 7 |
| `createSweepProfileTopology` | 16445 | function |  | 5 |
| `renderProfilePreview` | 16487 | function |  | 8 |
| `renderHairCardCoveragePath` | 16506 | function |  | 3 |
| `activeTaperTarget` | 16521 | function |  | 15 |
| `twistCurveEditing` | 16528 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16532 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16536 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16540 | function |  | 17 |
| `taperAsymmetryKey` | 16544 | function |  | 12 |
| `taperSecondaryKey` | 16548 | function |  | 11 |
| `activeTaperCurve` | 16552 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16563 | function |  | 6 |
| `taperSamples` | 16573 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16580 | function |  | 2 |
| `renderTaperPreview` | 16602 | function |  | 13 |
| `renderTwistCurvePreview` | 16638 | function |  | 5 |
| `cloneShapePresetValue` | 16656 | function |  | 66 |
| `shapeValuesMatch` | 16660 | function |  | 5 |
| `shapeTargetForSelect` | 16668 | function |  | 4 |
| `loadCustomShapePresets` | 16678 | function |  | 2 |
| `saveCustomShapePresets` | 16689 | function |  | 4 |
| `shapePresetLabel` | 16697 | function |  | 4 |
| `setupShapePresetControls` | 16702 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16727 | function |  | 3 |
| `syncShapePresetSelects` | 16733 | function |  | 8 |
| `populateShapePresetSelects` | 16754 | function |  | 5 |
| `applyShapePreset` | 16781 | function |  | 2 |
| `openSaveShapePreset` | 16818 | function |  | 2 |
| `commitCustomShapePreset` | 16843 | function |  | 2 |
| `openRemoveShapePreset` | 16866 | function |  | 2 |
| `commitRemoveShapePreset` | 16879 | function |  | 2 |
| `taperPointToCanvas` | 16895 | function |  | 4 |
| `canvasToTaperPoint` | 16912 | function |  | 2 |
| `clearTaperMeshPoints` | 16948 | function |  | 2 |
| `taperMeshPointFrame` | 16958 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16968 | function |  | 4 |
| `twistMeshGraphAxis` | 16976 | function |  | 4 |
| `addTwistMeshCurvePath` | 16980 | function |  | 2 |
| `appendSegment` | 17001 | arrow |  | 1 |
| `appendFill` | 17004 | arrow |  | 1 |
| `appendSignedSection` | 17010 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17059 | function |  | 6 |
| `updateTaperMeshPoints` | 17096 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17175 | function |  | 5 |
| `renderTaperCurveEditor` | 17193 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17265 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17279 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17295 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17329 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17338 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17349 | function |  | 2 |
| `applyTaperCurveEdit` | 17357 | function |  | 10 |
| `openTaperCurveEditor` | 17465 | function |  | 3 |
| `closeTaperCurveEditor` | 17510 | function |  | 6 |
| `updateViewportStatsVisibility` | 17523 | function |  | 6 |
| `canvasToProfile` | 17542 | function |  | 2 |
| `renderSweepProfileEditor` | 17552 | function |  | 7 |
| `applySweepProfileEdit` | 17595 | function |  | 8 |
| `openSweepProfileEditor` | 17622 | function |  | 1 |
| `closeSweepProfileEditor` | 17657 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17666 | function |  | 2 |
| `addLock` | 17681 | function |  | 19 |
| `mirroredScalpRegion` | 17884 | function |  | 5 |
| `mirroredVector` | 17893 | function |  | 12 |
| `mirroredPlacementFrame` | 17897 | function |  | 2 |
| `mirrorPartnerFor` | 17910 | function |  | 40 |
| `decoupleMirrorPartner` | 17914 | function |  | 2 |
| `createMirrorPartner` | 17922 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 18018 | function |  | 6 |
| `mirroredClumpPartners` | 18023 | function |  | 6 |
| `createMirroredClump` | 18029 | function |  | 3 |
| `decoupleMirroredClump` | 18051 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18060 | function |  | 6 |
| `syncActiveMirror` | 18225 | function |  | 25 |
| `setMirrorXEditing` | 18237 | function |  | 6 |
| `snapshotState` | 18261 | function |  | 7 |
| `scalpTriangleRegion` | 18518 | function |  | 4 |
| `closestPointOnActiveScalp` | 18531 | function |  | 12 |
| `rootAttachmentFrame` | 18603 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18615 | function |  | 4 |
| `resolveRootAttachment` | 18633 | function |  | 4 |
| `curvePointsToRootLocal` | 18673 | function |  | 2 |
| `curvePointsFromRootLocal` | 18685 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18693 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18709 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18739 | function |  | 2 |
| `createRootAttachment` | 18751 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18781 | function |  | 4 |
| `rootAttachmentToData` | 18808 | function |  | 2 |
| `rootAttachmentFromData` | 18836 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18875 | function |  | 2 |
| `remapPoint` | 18890 | arrow |  | 1 |
| `remapVector` | 18891 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18920 | function |  | 2 |
| `importHeadMeshFile` | 18937 | function |  | 3 |
| `importFullBodyMeshFile` | 18960 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18985 | function |  | 1 |
| `importedBooleanPreference` | 19018 | function |  | 11 |
| `loadPreferencesAndPresets` | 19022 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19092 | function |  | 1 |
| `openHairProjectFile` | 19135 | function |  | 4 |
| `dragContainsApplicationFile` | 19193 | function |  | 3 |
| `safelyRememberRecentProject` | 19202 | function |  | 2 |
| `renderRecentProjectsMenu` | 19211 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19243 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19268 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19272 | function |  | 2 |
| `pushUndoState` | 19288 | function |  | 119 |
| `undoLastAction` | 19295 | function |  | 2 |
| `redoLastAction` | 19309 | function |  | 2 |
| `updateHistoryButtons` | 19323 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19328 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19345 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19352 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19390 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19467 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19493 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19525 | function |  | 2 |
| `finalizeStateRestore` | 19566 | function |  | 2 |
| `restoreState` | 19573 | function |  | 5 |
| `disposeAllEditableObjects` | 19597 | function |  | 2 |
| `restoreLock` | 19618 | function |  | 4 |
| `restoreGuide` | 19835 | function |  | 2 |
| `vectorToData` | 19896 | function |  | 29 |
| `dataToVector` | 19900 | function |  | 31 |
| `frameToData` | 19904 | function |  | 2 |
| `frameFromData` | 19916 | function |  | 2 |
| `applyPresetSelection` | 19928 | function |  | 2 |
| `drawPresetThumbnail` | 19959 | function |  | 1 |
| `fillHair` | 19974 | arrow |  | 9 |
| `strand` | 19986 | arrow |  | 31 |
| `bun` | 20004 | arrow |  | 2 |
| `braid` | 20039 | arrow |  | 2 |
| `renderPresetLibrary` | 20128 | function |  | 3 |
| `setPresetLibraryOpen` | 20187 | function |  | 6 |
| `average` | 20200 | function |  | 4 |
| `fitPointAttributes` | 20204 | function |  | 9 |
| `rebuildCurveObjects` | 20233 | function |  | 10 |
| `createCurvePoints` | 20245 | function |  | 2 |
| `addGeneratedBangPreset` | 20254 | function |  | 1 |
| `sampleScalpQuad` | 20347 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20371 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20420 | function |  | 1 |
| `columns` | 20421 | arrow |  | 1 |
| `layer` | 20425 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20639 | function |  | 2 |
| `addBraidedBobPreset` | 20675 | function |  | 1 |
| `evenColumns` | 20676 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20892 | function |  | 1 |
| `scalpSeed` | 20915 | arrow |  | 1 |
| `createBowlCutPoints` | 21202 | function |  | 2 |
| `addBowlCutPreset` | 21240 | function |  | 1 |
| `scalpRegionAtHit` | 21306 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21318 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21325 | function |  | 12 |
| `braidStrokeActive` | 21332 | function |  | 9 |
| `proceduralDrawActive` | 21336 | function |  | 3 |
| `panelStrokeActive` | 21340 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21344 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21348 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21352 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21358 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21362 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21366 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21370 | function |  | 3 |
| `liveSurfaceStrandId` | 21380 | function |  | 4 |
| `liveSurfaceStrand` | 21384 | function |  | 4 |
| `liveSurfaceGuideId` | 21389 | function |  | 3 |
| `guideSupportsLiveSurface` | 21393 | function |  | 2 |
| `liveSurfaceGuide` | 21400 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21407 | function |  | 12 |
| `activeStrokeScalpOffset` | 21447 | function |  | 4 |
| `activeStrokeBrushSize` | 21453 | function |  | 10 |
| `activeStrokeBrushDepth` | 21459 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21465 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21473 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21483 | function |  | 13 |
| `worldNormalAtHit` | 21522 | function |  | 6 |
| `selectedPolyMesh` | 21530 | function |  | 10 |
| `addPolyLock` | 21535 | function |  | 2 |
| `ensurePolyMesh` | 21554 | function |  | 3 |
| `polySurfaceSample` | 21558 | function |  | 4 |
| `polyTargetAtEvent` | 21569 | function |  | 6 |
| `refreshPolyMesh` | 21595 | function |  | 10 |
| `ensurePolyFillPreview` | 21604 | function |  | 2 |
| `clearPolyFillPreview` | 21641 | function |  | 17 |
| `polyFillCandidateForEvent` | 21646 | function |  | 3 |
| `showPolyFillPreview` | 21666 | function |  | 2 |
| `updatePolyFillPreview` | 21692 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21717 | function |  | 5 |
| `fillPolyGap` | 21727 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21738 | function |  | 2 |
| `projectPolyRelaxPoint` | 21758 | function |  | 2 |
| `removePolyPointAttributes` | 21802 | function |  | 3 |
| `deletePolyComponent` | 21811 | function |  | 2 |
| `addPolyPoint` | 21834 | function |  | 4 |
| `appendPolyStrokeRow` | 21843 | function |  | 4 |
| `beginPolyBrushPointer` | 21863 | function |  | 1 |
| `finishPolyAltDelete` | 21949 | function |  | 1 |
| `updatePolyBrushStroke` | 21963 | function |  | 1 |
| `finishPolyBrushStroke` | 22053 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22090 | function |  | 2 |
| `drawSampleFromHit` | 22113 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22127 | function |  | 3 |
| `strokeLength` | 22164 | function |  | 9 |
| `resampleDrawStroke` | 22170 | function |  | 2 |
| `processedDrawStroke` | 22202 | function |  | 8 |
| `strokeSurfaceNormals` | 22231 | function |  | 7 |
| `drawClumpFrame` | 22242 | function |  | 4 |
| `nearestCurveParameter` | 22251 | function |  | 2 |
| `drawClumpSampleNormal` | 22265 | function |  | 6 |
| `drawClumpTemplateVector` | 22274 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22280 | function |  | 3 |
| `drawClumpStrandMaps` | 22296 | function |  | 4 |
| `nextClumpName` | 22351 | function |  | 6 |
| `initializeClumpShape` | 22358 | function |  | 5 |
| `stableClumpVariation` | 22369 | function |  | 3 |
| `createClumpFromLocks` | 22381 | function |  | 7 |
| `addLockToClump` | 22406 | function |  | 4 |
| `stableBranchBaseNormals` | 22424 | function |  | 4 |
| `ensureBranchParentNormalField` | 22435 | function |  | 2 |
| `branchParentFrame` | 22441 | function |  | 7 |
| `branchLocalVector` | 22453 | function |  | 3 |
| `branchWorldVector` | 22457 | function |  | 4 |
| `captureBranchLocalState` | 22463 | function |  | 6 |
| `enforceBranchRootPosition` | 22491 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22541 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22568 | function |  | 2 |
| `clampRegionParam` | 22615 | function |  | 113 |
| `branchRootRegionFromParam` | 22622 | function |  | 4 |
| `cloneBranchRootRegion` | 22645 | function |  | 5 |
| `flip` | 22647 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22680 | function |  | 8 |
| `setBranchRootRegionPoint` | 22711 | function |  | 3 |
| `branchRegionUVToCanvas` | 22747 | function |  | 10 |
| `branchRegionCanvasToUV` | 22750 | function |  | 4 |
| `openBranchRegionEditor` | 22756 | function |  | 2 |
| `closeBranchRegionEditor` | 22770 | function |  | 2 |
| `retargetBranchRegionEditor` | 22776 | function |  | 2 |
| `renderBranchRegionEditor` | 22781 | function |  | 9 |
| `applyBranchRegionView` | 22869 | function |  | 6 |
| `resetBranchRegionZoom` | 22872 | function |  | 1 |
| `branchRegionNavAction` | 22878 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22892 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22912 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22916 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22942 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22954 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22959 | function |  | 1 |
| `branchRegionEventUV` | 22979 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22987 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23092 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23225 | function |  | 1 |
| `pointerToNdc` | 23230 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23241 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23255 | function |  | 1 |
| `endBranchSweepStartDrag` | 23278 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23285 | function |  | 5 |
| `gridProfileSkipCol` | 23312 | function |  | 3 |
| `branchRootRegionSurface` | 23321 | function |  | 6 |
| `toGridCol` | 23346 | arrow |  | 5 |
| `toRow` | 23350 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23405 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23425 | function |  | 2 |
| `pointAt` | 23431 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23458 | function |  | 3 |
| `applyBranchRootOffset` | 23530 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23549 | function |  | 3 |
| `branchChildrenFor` | 23569 | function |  | 9 |
| `detachBranch` | 23573 | function |  | 2 |
| `updateBranchChildren` | 23584 | function |  | 4 |
| `clumpDirectMembers` | 23627 | function |  | 3 |
| `clumpMembersForGuide` | 23632 | function |  | 6 |
| `clumpGuideForLock` | 23636 | function |  | 13 |
| `proceduralGuideForLock` | 23641 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23648 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23655 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23662 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23674 | function |  | 2 |
| `applyProceduralBranchSettings` | 23687 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23726 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23742 | function |  | 3 |
| `createProceduralAccessoryLock` | 23756 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23808 | function |  | 2 |
| `clumpFrameAt` | 23859 | function |  | 5 |
| `commitClumpMemberRestState` | 23867 | function |  | 10 |
| `updateClumpMembers` | 23950 | function |  | 10 |
| `dissolveClump` | 24054 | function |  | 6 |
| `detachLockFromClump` | 24091 | function |  | 4 |
| `updateDrawVolumePreview` | 24117 | function |  | 5 |
| `hideDrawClumpPreviews` | 24141 | function |  | 5 |
| `resetDrawVolumePreview` | 24147 | function |  | 3 |
| `updateDrawStrandPreview` | 24153 | function |  | 23 |
| `continueFromTipEnabled` | 24372 | function |  | 2 |
| `selectedTipContinuationLock` | 24378 | function |  | 3 |
| `selectedDrawBranchPoint` | 24391 | function |  | 3 |
| `canBranchDrawFromLock` | 24408 | function |  | 3 |
| `beginDrawStrandStroke` | 24415 | function |  | 2 |
| `beginDrawFreePlane` | 24540 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24554 | function |  | 2 |
| `updateDrawStrandStroke` | 24579 | function |  | 1 |
| `createDrawnLock` | 24625 | function |  | 3 |
| `setting` | 24629 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24697 | function |  | 4 |
| `createDrawnBraid` | 24705 | function |  | 2 |
| `createDrawnStrand` | 24762 | function |  | 2 |
| `createDrawnPanel` | 24889 | function |  | 2 |
| `surfaceLatticeNormal` | 24939 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24954 | function |  | 3 |
| `createViewportSurface` | 25019 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25048 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25054 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25061 | function |  | 4 |
| `updateLoftSurfacePreview` | 25070 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25102 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25118 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25136 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25158 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25184 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25194 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25198 | function |  | 2 |
| `curveSurfacePreviewLock` | 25207 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25230 | function |  | 2 |
| `hideCurveSurfacePreview` | 25246 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25258 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25263 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25272 | function |  | 3 |
| `curveSurfaceSideVector` | 25310 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25323 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25331 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25344 | function |  | 5 |
| `updateCurveSurfacePreview` | 25364 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25426 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25448 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25463 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25511 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25546 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25578 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25636 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25713 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25718 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25727 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25761 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25772 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25802 | function |  | 2 |
| `extendDrawnStrand` | 25859 | function |  | 2 |
| `finishDrawStrandStroke` | 25892 | function |  | 7 |
| `createPlacedStrand` | 25919 | function |  | 2 |
| `placedPointCount` | 25983 | function |  | 3 |
| `createPlacedPoints` | 25987 | function |  | 3 |
| `pushPointOutsideHead` | 26006 | function |  | 8 |
| `resizePlacedStrand` | 26038 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26055 | function |  | 5 |
| `beginPlaceEdit` | 26060 | function |  | 2 |
| `updatePlaceEdit` | 26078 | function |  | 1 |
| `updatePlacementLength` | 26092 | function |  | 3 |
| `updatePlacementOrientation` | 26102 | function |  | 3 |
| `endPlaceEdit` | 26120 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26135 | function |  | 1 |
| `pendingPlacedLock` | 26145 | function |  | 2 |
| `beginPlacementPointer` | 26149 | function |  | 3 |
| `finishPlacementPointer` | 26159 | function |  | 2 |
| `confirmPlacementStep` | 26183 | function |  | 2 |
| `finishPlacementFlow` | 26206 | function |  | 7 |
| `updatePlacementStatus` | 26219 | function |  | 83 |
| `deselectStrands` | 26358 | function |  | 12 |
| `beginSelectionMarquee` | 26373 | function |  | 3 |
| `beginAltOrbit` | 26397 | function |  | 1 |
| `beginBlenderNavigation` | 26409 | function |  | 1 |
| `endBlenderNavigation` | 26454 | function |  | 1 |
| `prepareSelectPointerCapture` | 26462 | function |  | 1 |
| `endSelectPointerCapture` | 26468 | function |  | 1 |
| `endAltOrbit` | 26474 | function |  | 1 |
| `dollyCameraByDrag` | 26481 | function |  | 2 |
| `fastDragMagnitude` | 26504 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26510 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26518 | function |  | 1 |
| `endHoudiniZoomDrag` | 26535 | function |  | 1 |
| `updateSelectionMarquee` | 26543 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26560 | function |  | 3 |
| `selectPointsInMarquee` | 26568 | function |  | 2 |
| `pointKey` | 26594 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26625 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26662 | function |  | 3 |
| `projectedPoint` | 26679 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26708 | function |  | 2 |
| `finishSelectionMarquee` | 26753 | function |  | 2 |
| `headMeshes` | 26776 | function |  | 9 |
| `strandSplitProfileData` | 26784 | function |  | 4 |
| `strandSplitControlPoint` | 26797 | function |  | 4 |
| `panelSplitControlPoint` | 26833 | function |  | 6 |
| `strandControlPointRaycast` | 26889 | function |  | 1 |
| `strandControlPointFrame` | 26924 | function |  | 6 |
| `branchRootGizmoFrame` | 26955 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26973 | function |  | 5 |
| `createCurveObjects` | 27031 | function |  | 4 |
| `polyEdgeKey` | 27204 | function |  | 2 |
| `polyMeshEdges` | 27208 | function |  | 2 |
| `populatePolyEditObjects` | 27222 | function |  | 3 |
| `createPolyEditObjects` | 27283 | function |  | 2 |
| `rebuildPolyEditObjects` | 27291 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27305 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27312 | function |  | 2 |
| `strandWidthEdgeSample` | 27321 | function |  | 3 |
| `strandWidthEdgePoints` | 27344 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27358 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27362 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27369 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27381 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27386 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27392 | function |  | 3 |
| `updateCurveObjects` | 27406 | function |  | 41 |
| `createCurveNormalIndicator` | 27663 | function |  | 2 |
| `pointUpDirection` | 27689 | function |  | 2 |
| `curveFrameAtPoint` | 27693 | function |  | 5 |
| `curveFrameAt` | 27714 | function |  | 10 |
| `strandTwistAt` | 27734 | function |  | 6 |
| `controlPointRotationAt` | 27739 | function |  | 6 |
| `strandProfileTwistAt` | 27743 | function |  | 2 |
| `strandFrameAt` | 27749 | function |  | 1 |
| `curveFrameAtSnapshot` | 27755 | function |  | 3 |
| `outwardNormalAtPoint` | 27774 | function |  | 11 |
| `sampledSurfaceNormal` | 27786 | function |  | 2 |
| `guidedNormalAt` | 27802 | function |  | 5 |
| `twistFromHandle` | 27821 | function |  | 3 |
| `signedAngleAroundAxis` | 27842 | function |  | 5 |
| `handleColor` | 27849 | function |  | 2 |
| `isAffectedCurvePoint` | 27872 | function |  | 2 |
| `syncLockFromCurve` | 27878 | function |  | 26 |
| `labelForPreset` | 27908 | function |  | 1 |
| `rebuildLockGeometry` | 27912 | function |  | 21 |
| `scheduleSculptBrushGeometryUpdates` | 27939 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27947 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27953 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27975 | function |  | 8 |
| `updateLockGeometry` | 27988 | function |  | 57 |
| `setGroupColorView` | 28009 | function |  | 2 |
| `createUvCheckerTexture` | 28019 | function |  | 3 |
| `ensureUvCheckerForLock` | 28055 | function |  | 4 |
| `removeUvCheckerFromLock` | 28088 | function |  | 3 |
| `invalidateUvInspector` | 28103 | function |  | 7 |
| `uvInspectorRecord` | 28107 | function |  | 1 |
| `uvInspectorRecords` | 28146 | function |  | 2 |
| `drawUvInspectorGrid` | 28150 | function |  | 2 |
| `renderUvInspector` | 28184 | function |  | 3 |
| `setUvCheckerEnabled` | 28243 | function |  | 3 |
| `strandViewportBaseColor` | 28260 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28295 | function |  | 3 |
| `syncStrandSelectionOutline` | 28301 | function |  | 2 |
| `applyLockedStrandPalette` | 28312 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28321 | function |  | 6 |
| `setStrandSelectionVisual` | 28330 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28346 | function |  | 2 |
| `syncProceduralParentVisibility` | 28353 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28362 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28366 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28370 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28383 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28403 | function |  | 3 |
| `selectLock` | 28436 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28489 | function |  | 6 |
| `syncGroupInputs` | 28500 | function |  | 3 |
| `topologyStatsForLock` | 28533 | function |  | 4 |
| `formatTopologyStats` | 28541 | function |  | 5 |
| `updateTopologyStats` | 28545 | function |  | 20 |
| `normalizeBraidDimensions` | 28579 | function |  | 4 |
| `normalizeStrandDimensions` | 28592 | function |  | 3 |
| `strandBaseWidth` | 28606 | function |  | 5 |
| `strandWidthDimension` | 28610 | function |  | 5 |
| `strandDepthDimension` | 28618 | function |  | 8 |
| `setStrandWidthDimension` | 28626 | function |  | 2 |
| `setStrandDepthDimension` | 28648 | function |  | 4 |
| `syncShapeDimensionInputs` | 28664 | function |  | 4 |
| `syncCreationShapeInputs` | 28700 | function |  | 5 |
| `syncViewportDrawSettings` | 28738 | function |  | 5 |
| `syncPanelShapeInputs` | 28752 | function |  | 6 |
| `syncStrandSplitInputs` | 28778 | function |  | 4 |
| `syncHairCardControls` | 28787 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28795 | function |  | 3 |
| `updateAttributeEditorMode` | 28834 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28983 | function |  | 3 |
| `curveLatticeForGroup` | 29006 | function |  | 2 |
| `filterCurveLatticesToGroup` | 29024 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29069 | function |  | 2 |
| `showCurveLatticeForGroup` | 29086 | function |  | 2 |
| `selectStrandGroup` | 29123 | function |  | 3 |
| `selectCurvePoint` | 29165 | function |  | 10 |
| `updateSelectedPointLabel` | 29179 | function |  | 14 |
| `syncInputs` | 29192 | function |  | 16 |
| `syncClumpGuidePanel` | 29238 | function |  | 3 |
| `getSelectedLock` | 29265 | function |  | 104 |
| `selectedLocksInOrder` | 29269 | function |  | 37 |
| `lockStrands` | 29275 | function |  | 3 |
| `lockSelectedStrands` | 29308 | function |  | 3 |
| `unlockStrands` | 29314 | function |  | 3 |
| `unlockAllStrands` | 29329 | function |  | 3 |
| `strandEditFamily` | 29333 | function |  | 7 |
| `compatibleSelectedLocks` | 29338 | function |  | 6 |
| `selectedEditRoots` | 29345 | function |  | 2 |
| `editSelectedLocks` | 29358 | function |  | 21 |
| `multiEditValuesEqual` | 29391 | function |  | 2 |
| `setMixedControl` | 29400 | function |  | 28 |
| `syncMultiStrandInputs` | 29417 | function |  | 16 |
| `values` | 29433 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29513 | function |  | 5 |
| `createCompoundStrand` | 29520 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29581 | function |  | 9 |
| `openRebuildCurveDialog` | 29594 | function |  | 1 |
| `rebuildSelectedCurves` | 29608 | function |  | 2 |
| `selectionCanBecomeClump` | 29647 | function |  | 4 |
| `createClumpFromSelection` | 29652 | function |  | 3 |
| `cleanSelectionSets` | 29664 | function |  | 2 |
| `createSelectionSetFromSelection` | 29669 | function |  | 3 |
| `selectionSetById` | 29680 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29684 | function |  | 7 |
| `editSelectionSetFromSelection` | 29693 | function |  | 5 |
| `deleteSelectionSet` | 29713 | function |  | 2 |
| `selectSelectionSet` | 29722 | function |  | 2 |
| `deleteSelectedStrands` | 29732 | function |  | 4 |
| `deleteGuide` | 29740 | function |  | 3 |
| `deleteSelectedGuide` | 29763 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29767 | function |  | 4 |
| `hasDeletableSelection` | 29780 | function |  | 2 |
| `deleteCurrentSelection` | 29788 | function |  | 3 |
| `hideOutlinerContextMenu` | 29796 | function |  | 17 |
| `outlinerLockTargets` | 29801 | function |  | 3 |
| `showOutlinerContextMenu` | 29828 | function |  | 10 |
| `hideStrandRadialMenu` | 29908 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29919 | function |  | 3 |
| `radialButtonDimensions` | 29932 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29941 | function |  | 3 |
| `applyRadialMenuDimensions` | 29958 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29964 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29977 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29998 | function |  | 2 |
| `selectionSetRadialMenuOption` | 30015 | function |  | 4 |
| `selectedMirrorRadialOptions` | 30024 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30046 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30064 | function |  | 2 |
| `contextualRadialOptions` | 30071 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30200 | function |  | 3 |
| `layoutContextualRadialOptions` | 30204 | function |  | 4 |
| `renderRadialActionList` | 30228 | function |  | 3 |
| `radialListOptionAtPointer` | 30246 | function |  | 3 |
| `syncRadialListHighlight` | 30268 | function |  | 3 |
| `configureContextualRadialMenu` | 30274 | function |  | 3 |
| `beginStrandRadialGesture` | 30334 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30368 | function |  | 2 |
| `updateStrandRadialGesture` | 30414 | function |  | 1 |
| `performStrandRadialAction` | 30453 | function |  | 2 |
| `finishStrandRadialGesture` | 30556 | function |  | 2 |
| `cancelStrandRadialGesture` | 30566 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30573 | function |  | 1 |
| `setPullMoveEnabled` | 30579 | function |  | 3 |
| `toolRadialOptions` | 30587 | function |  | 2 |
| `hideToolRadialMenu` | 30612 | function |  | 4 |
| `beginToolRadialGesture` | 30625 | function |  | 2 |
| `beginToolShortcutPress` | 30665 | function |  | 2 |
| `finishToolShortcutPress` | 30680 | function |  | 2 |
| `cancelToolShortcutPress` | 30689 | function |  | 5 |
| `setRadialMenusEnabled` | 30697 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30710 | function |  | 5 |
| `setNavigationTipsEnabled` | 30725 | function |  | 5 |
| `configureNavigationMouseButtons` | 30732 | function |  | 3 |
| `syncNavigationModifierLocks` | 30745 | function |  | 7 |
| `setNavigationStyle` | 30750 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30766 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30781 | function |  | 5 |
| `setCameraSmoothingStrength` | 30787 | function |  | 5 |
| `setScaleSensitivity` | 30795 | function |  | 3 |
| `setToolTipsEnabled` | 30803 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30810 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30819 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30827 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30842 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30851 | function |  | 5 |
| `sideNamingDisplayId` | 30860 | function |  | 3 |
| `referenceViewDisplayLabel` | 30872 | function |  | 6 |
| `strandRegionDisplayLabel` | 30882 | function |  | 10 |
| `updateSideNamingLabels` | 30900 | function |  | 2 |
| `setSideNamingPerspective` | 30927 | function |  | 5 |
| `setControlPointDisplaySize` | 30936 | function |  | 6 |
| `scaleHexColor` | 30948 | function |  | 3 |
| `setViewportBackgroundColor` | 30953 | function |  | 7 |
| `setDefaultHairShader` | 30975 | function |  | 5 |
| `setPreferenceCategory` | 30981 | function |  | 4 |
| `openPreferencesDialog` | 31008 | function |  | 1 |
| `savePreferencesDialog` | 31036 | function |  | 1 |
| `cancelPreferencesDialog` | 31060 | function |  | 3 |
| `updateToolRadialGesture` | 31089 | function |  | 1 |
| `performToolRadialAction` | 31118 | function |  | 2 |
| `finishToolRadialGesture` | 31128 | function |  | 2 |
| `cancelToolRadialGesture` | 31137 | function |  | 5 |
| `duplicatePlacementTarget` | 31144 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31171 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31175 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31185 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31190 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31202 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31213 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31221 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31238 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31259 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31270 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31276 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31282 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31315 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31470 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31572 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31613 | function |  | 2 |
| `updateDuplicatePlacement` | 31640 | function |  | 2 |
| `beginDuplicatePlacement` | 31704 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31768 | function |  | 2 |
| `confirmDuplicatePlacement` | 31809 | function |  | 1 |
| `cancelDuplicatePlacement` | 31846 | function |  | 4 |
| `outlinerClumpLocks` | 31872 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31876 | function |  | 3 |
| `createOutlinerStrandButton` | 31899 | function |  | 4 |
| `createOutlinerCurveSurface` | 31985 | function |  | 2 |
| `createOutlinerClump` | 32081 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32163 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32170 | function |  | 2 |
| `renderLockList` | 32249 | function |  | 70 |
| `updateCount` | 32403 | function |  | 34 |
| `captureInputUndo` | 32412 | function |  | 1 |
| `bindUndoCapture` | 32418 | function |  | 36 |
| `bindLockInput` | 32429 | function |  | 2 |
| `applyValue` | 32446 | arrow |  | 2 |
| `applyUniformTransformScale` | 32765 | function |  | 2 |
| `applyReducedTransformScale` | 32782 | function |  | 2 |
| `applyTransformPrecision` | 32821 | function |  | 2 |
| `updateTransformScalePointer` | 32850 | function |  | 1 |
| `finishSweepProfileDrag` | 33081 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33177 | function |  | 3 |
| `finishTaperCurveDrag` | 33239 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33282 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33363 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33418 | function |  | 6 |
| `updateSelectedTaperPoint` | 33442 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 34016 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 34021 | function |  | 4 |
| `syncDrawCurlControls` | 34076 | function |  | 5 |
| `handleLiveSurfaceChange` | 34124 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34206 | function |  | 3 |
| `resampleSurfaceLock` | 34221 | function |  | 2 |
| `changePanelSplitCount` | 34334 | function |  | 3 |
| `presetNumber` | 34438 | function |  | 23 |
| `clonePresetShape` | 34443 | function |  | 7 |
| `creationPresetSnapshot` | 34452 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34500 | function |  | 5 |
| `applyPresetControl` | 34527 | function |  | 2 |
| `applyCreationToolSettings` | 34548 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34589 | function |  | 3 |
| `loadCustomCreationPresets` | 34596 | function |  | 2 |
| `saveCustomCreationPresets` | 34606 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34614 | function |  | 2 |
| `populateCreationPresetSelect` | 34650 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34674 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34707 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34712 | function |  | 2 |
| `applyCustomCreationPreset` | 34729 | function |  | 3 |
| `createCustomCreationPreset` | 34753 | function |  | 3 |
| `createCustomClumpPreset` | 34768 | function |  | 3 |
| `commitCustomCreationPreset` | 34783 | function |  | 2 |
| `openRemoveCreationPreset` | 34844 | function |  | 3 |
| `commitRemoveCreationPreset` | 34857 | function |  | 1 |
| `applyBraidToolPreset` | 34874 | function |  | 2 |
| `initPanelResizeHandles` | 35073 | function |  | 2 |
| `applyWidth` | 35079 | arrow |  | 2 |
| `restoreWidth` | 35086 | arrow |  | 2 |
| `bindResize` | 35094 | arrow |  | 2 |
| `onMove` | 35102 | arrow |  | 0 |
| `onUp` | 35106 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35123 | function |  | 2 |
| `initFloatingPanelControls` | 35132 | function |  | 2 |
| `detach` | 35141 | arrow |  | 43 |
| `endDrag` | 35179 | arrow |  | 0 |
| `endResize` | 35211 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35222 | function |  | 3 |
| `selectPatchNotesVersion` | 35356 | function |  | 3 |
| `requestReferenceImage` | 35389 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35593 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35599 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35606 | function |  | 1 |
| `deleteLocks` | 36173 | function |  | 10 |
| `disposeCurveObjects` | 36251 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36303 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36334 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36409 | function |  | 2 |
| `resize` | 36442 | function |  | 4 |
| `handleViewportPointerMove` | 36453 | function |  | 1 |
| `blockProportionalSizingEvent` | 36464 | function |  | 1 |
| `updateLightAngleFromInputs` | 36470 | function |  | 2 |
| `startViewSnap` | 36484 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36514 | function |  | 3 |
| `trackViewportPointerDown` | 36531 | function |  | 1 |
| `trackViewportPointerMove` | 36547 | function |  | 1 |
| `clearViewportPointer` | 36555 | function |  | 1 |
| `updateViewSnap` | 36560 | function |  | 1 |
| `nearestCardinalAxis` | 36596 | function |  | 5 |
| `cardinalAxisKey` | 36610 | function |  | 5 |
| `steppedDragAmount` | 36614 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36620 | function |  | 4 |
| `endViewSnap` | 36636 | function |  | 4 |
| `activateStrandControlPoint` | 36646 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36696 | function |  | 4 |
| `addStrandControlPointSelection` | 36723 | function |  | 3 |
| `removeStrandControlPointSelection` | 36740 | function |  | 3 |
| `sampleStrandPointNormal` | 36754 | function |  | 2 |
| `sampleStrandPointVectors` | 36764 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36770 | function |  | 2 |
| `resampleStrandCurveData` | 36781 | function |  | 4 |
| `resampleMatchingVectors` | 36787 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36826 | function |  | 4 |
| `removeStrandCurvePoint` | 36837 | function |  | 2 |
| `closestStrandCurveParameter` | 36850 | function |  | 2 |
| `insertStrandCurvePoint` | 36879 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36896 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36906 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36922 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36929 | function |  | 4 |
| `prepareCurvePointSelection` | 36951 | function |  | 1 |
| `finishCurvePointInsertion` | 37062 | function |  | 1 |
| `finishPointRemoval` | 37077 | function |  | 1 |
| `editableStrandWidth` | 37095 | function |  | 6 |
| `editableStrandWidthBounds` | 37107 | function |  | 2 |
| `applyEditableStrandWidth` | 37113 | function |  | 3 |
| `viewportPixelPoint` | 37149 | function |  | 3 |
| `syncSculptBrushControls` | 37157 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37172 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37180 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37188 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37194 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37198 | function |  | 7 |
| `updateSculptBrushCursor` | 37205 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37227 | function |  | 4 |
| `sculptBrushEditableLock` | 37234 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37244 | function |  | 5 |
| `sculptBrushLockViable` | 37250 | function |  | 5 |
| `sculptBrushUnits` | 37261 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37300 | function |  | 4 |
| `sculptBrushPointWeight` | 37350 | function |  | 5 |
| `sculptBrushWorldDelta` | 37360 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37369 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37395 | function |  | 2 |
| `beginSculptMoveStroke` | 37453 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37515 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37750 | function |  | 3 |
| `updateSculptMoveStroke` | 37759 | function |  | 1 |
| `finishSculptMoveStroke` | 37775 | function |  | 3 |
| `strandControlPointHit` | 37823 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37827 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37905 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37939 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37979 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37992 | function |  | 1 |
| `setHoveredControlPoint` | 38032 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38045 | function |  | 2 |
| `updateControlPointHover` | 38081 | function |  | 1 |
| `animate` | 38638 | function |  | 2 |
| `syncCompactSidebarLayout` | 38671 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38690 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38696 | function |  | 3 |
| `setAttributeEditorTab` | 38702 | function |  | 6 |

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
