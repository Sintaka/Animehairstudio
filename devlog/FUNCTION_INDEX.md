# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1712** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（39208 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 242 | function |  | 3 |
| `saveBooleanPreference` | 270 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 274 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 279 | function |  | 2 |
| `normalizeScaleSensitivity` | 284 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 289 | function |  | 2 |
| `normalizeSideNamingPerspective` | 294 | function |  | 2 |
| `normalizeNavigationStyle` | 298 | function |  | 2 |
| `setupEditableSliderControls` | 312 | function |  | 2 |
| `syncNumberFromRange` | 363 | arrow |  | 0 |
| `applyNumberValue` | 370 | arrow |  | 0 |
| `copyCameraPose` | 480 | function |  | 3 |
| `updateCameraProjectionForViewport` | 486 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 499 | function |  | 3 |
| `setOrthographicView` | 505 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 545 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 574 | function |  | 2 |
| `removeRotateFreeAxisRing` | 600 | function |  | 2 |
| `deflateTransformGizmoPickers` | 612 | function |  | 2 |
| `nextStrandName` | 995 | function |  | 2 |
| `activeDrawClumpTemplate` | 1080 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1085 | function |  | 3 |
| `drawModeCreatesClump` | 1112 | function |  | 1 |
| `isPanelGeometry` | 1256 | function |  | 31 |
| `normalizePanelSplits` | 1260 | function |  | 3 |
| `clonePanelSplits` | 1272 | function |  | 19 |
| `snapPanelSplitHeight` | 1276 | function |  | 5 |
| `createQuadSphereGeometry` | 1311 | function |  | 2 |
| `vertexIndex` | 1325 | function |  | 11 |
| `addEdge` | 1343 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1378 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1448 | function |  | 3 |
| `updateScalpRenderGeometry` | 1475 | function |  | 4 |
| `writeScalpRegionColors` | 1526 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1539 | function |  | 2 |
| `createScalpSelectionOutline` | 1569 | function |  | 5 |
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
| `currentStrandSelectionState` | 2099 | function |  | 4 |
| `applyStrandSelectionState` | 2103 | function |  | 5 |
| `clearStrandSelectionState` | 2108 | function |  | 7 |
| `guideHeadBounds` | 3237 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3247 | function |  | 5 |
| `disposeGuideModel` | 3261 | function |  | 3 |
| `syncHeadTransformInputs` | 3272 | function |  | 4 |
| `applyHeadTransform` | 3279 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3297 | function |  | 4 |
| `applyScalpRoughScale` | 3306 | function |  | 5 |
| `resetHeadTransform` | 3320 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3334 | function |  | 2 |
| `installGuideModel` | 3350 | function |  | 5 |
| `loadDefaultGuideModel` | 3426 | function |  | 3 |
| `braidTemplateFromEntries` | 3449 | function |  | 4 |
| `braidMeshEntries` | 3481 | function |  | 2 |
| `prepareBraidBodyCache` | 3493 | function |  | 2 |
| `quantize` | 3502 | arrow |  | 21 |
| `sourceNormalAt` | 3514 | arrow |  | 1 |
| `clusterBoundary` | 3517 | arrow |  | 2 |
| `normalBuckets` | 3534 | arrow |  | 2 |
| `applyBucketPair` | 3566 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3597 | function |  | 2 |
| `annotateBraidObjTopology` | 3618 | function |  | 2 |
| `loadBraidMeshPreset` | 3638 | function |  | 3 |
| `createSplitControlHandle` | 3655 | function |  | 4 |
| `frameGuideModel` | 3670 | function |  | 2 |
| `syncScalpInputs` | 3695 | function |  | 2 |
| `syncScalpArtistInputs` | 3701 | function |  | 2 |
| `rootScalpOffsetDistance` | 3709 | function |  | 15 |
| `applyLockRootScalpOffset` | 3714 | function |  | 5 |
| `normalizeHairLayer` | 3730 | function |  | 28 |
| `layerOffsetForLock` | 3734 | function |  | 9 |
| `layerRootOffsetFactor` | 3739 | function |  | 13 |
| `layerOffsetWeight` | 3743 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3749 | function |  | 5 |
| `pointsWithLayerOffset` | 3758 | function |  | 3 |
| `layerDirectionForLock` | 3766 | function |  | 2 |
| `applyLayerOffset` | 3777 | function |  | 5 |
| `setLockHairLayer` | 3801 | function |  | 2 |
| `setGroupLayerOffset` | 3816 | function |  | 2 |
| `scalpArtistWeight` | 3828 | function |  | 3 |
| `scalpArtistScalesAt` | 3832 | function |  | 3 |
| `applyScalpArtistShape` | 3842 | function |  | 5 |
| `inverseScalpArtistShape` | 3860 | function |  | 2 |
| `updateScalpSurface` | 3887 | function |  | 3 |
| `setActiveScalpRegion` | 3897 | function |  | 2 |
| `clearScalpRegions` | 3909 | function |  | 2 |
| `scalpHitFromEvent` | 3926 | function |  | 3 |
| `updateScalpBrushCursor` | 3934 | function |  | 4 |
| `paintScalpAt` | 3949 | function |  | 3 |
| `beginScalpPaint` | 4016 | function |  | 2 |
| `updateScalpPaint` | 4025 | function |  | 1 |
| `endScalpPaint` | 4034 | function |  | 2 |
| `createScalpLattice` | 4041 | function |  | 2 |
| `resetScalpLattice` | 4066 | function |  | 1 |
| `updateScalpLatticeObjects` | 4078 | function |  | 7 |
| `quadraticWeights` | 4092 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4097 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4124 | function |  | 3 |
| `selectScalpLatticePoint` | 4139 | function |  | 2 |
| `beginScalpLatticeDrag` | 4154 | function |  | 2 |
| `updateScalpLatticeDrag` | 4172 | function |  | 1 |
| `endScalpLatticeDrag` | 4190 | function |  | 2 |
| `setHeadReferenceTransparency` | 4196 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4206 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4224 | function |  | 3 |
| `trianglePlaneIntersections` | 4232 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4253 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4279 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4289 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4301 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4325 | function |  | 3 |
| `createScalpBuilderPlanes` | 4340 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4372 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4411 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4434 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4446 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4458 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4463 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4475 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4585 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4610 | function |  | 5 |
| `syncEditedScalpSurface` | 4625 | function |  | 4 |
| `ensureEditedScalpSurface` | 4696 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4726 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4811 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4824 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4840 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4850 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4868 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4881 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4888 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4907 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4921 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4962 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4971 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4984 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 5005 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5142 | function |  | 2 |
| `scalpTemplateNeighbors` | 5150 | function |  | 2 |
| `smoothScalpVectorField` | 5162 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5176 | function |  | 2 |
| `upperContourCurve` | 5193 | function |  | 4 |
| `hermitePoint` | 5228 | function |  | 2 |
| `curveNetworkSection` | 5239 | function |  | 3 |
| `pointAlongSection` | 5268 | function |  | 3 |
| `longestStitchedContour` | 5274 | function |  | 2 |
| `nodeForPoint` | 5282 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5339 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5349 | function |  | 1 |
| `orderedRange` | 5361 | arrow |  | 3 |
| `clipSegment` | 5384 | arrow |  | 1 |
| `liftedPoint` | 5407 | arrow |  | 5 |
| `boundaryCorner` | 5412 | arrow |  | 4 |
| `surfaceCurveBetween` | 5421 | arrow |  | 1 |
| `addSurfaceConnector` | 5444 | arrow |  | 2 |
| `sideContourAtDepth` | 5512 | arrow |  | 3 |
| `addSurfacePatch` | 5546 | arrow |  | 1 |
| `addCenterBridgePatch` | 5626 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5734 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5769 | function |  | 1 |
| `generatedScalpObjContent` | 5859 | function |  | 2 |
| `generateScalpFromBuilder` | 5873 | function |  | 1 |
| `orderedDepthRange` | 5909 | arrow |  | 7 |
| `resetScalpBuilder` | 6038 | function |  | 1 |
| `confirmScalpBuilderPlane` | 6053 | function |  | 1 |
| `beginScalpBuilderInput` | 6067 | function |  | 2 |
| `updateScalpBuilderStroke` | 6068 | function |  | 1 |
| `finishScalpBuilderStroke` | 6069 | function |  | 2 |
| `setScalpBuilderEditing` | 6071 | function |  | 10 |
| `updateScalpEditingVisibility` | 6105 | function |  | 12 |
| `exitSetupEditors` | 6199 | function |  | 7 |
| `setCapsuleGuideEditing` | 6208 | function |  | 5 |
| `syncAppMenuVisibility` | 6236 | function |  | 3 |
| `closeAppMenus` | 6241 | function |  | 6 |
| `setAppMenuOpen` | 6252 | function |  | 3 |
| `setTurntableActive` | 6259 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6268 | function |  | 9 |
| `selectedReferenceImage` | 6272 | function |  | 20 |
| `normalizeReferenceCrop` | 6278 | function |  | 8 |
| `referenceCropIsFull` | 6286 | function |  | 3 |
| `referencePlaneFrontAxis` | 6291 | function |  | 4 |
| `referencePlanePlacement` | 6300 | function |  | 4 |
| `migratedReferencePlanePosition` | 6315 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6335 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6352 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6368 | function |  | 2 |
| `snappedReferenceImageView` | 6391 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6397 | function |  | 5 |
| `applyReferenceImageRuntime` | 6413 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6456 | function |  | 6 |
| `createReferenceImageRuntime` | 6464 | function |  | 3 |
| `addReferenceImage` | 6533 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6585 | function |  | 3 |
| `disposeReferenceImage` | 6604 | function |  | 2 |
| `clearReferenceImages` | 6608 | function |  | 2 |
| `serializeReferenceImage` | 6615 | function |  | 1 |
| `setReferenceImageType` | 6643 | function |  | 2 |
| `attachReferenceImageTransform` | 6687 | function |  | 6 |
| `selectReferenceImage` | 6701 | function |  | 12 |
| `placeReferencePlane` | 6724 | function |  | 2 |
| `setReferencePlaneInFront` | 6735 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6745 | function |  | 4 |
| `renderReferenceImagePanel` | 6764 | function |  | 20 |
| `setOutlinerTab` | 6811 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6829 | function |  | 4 |
| `componentEditModeActive` | 6833 | function |  | 38 |
| `selectionToolSupportsPicking` | 6837 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6842 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6858 | function |  | 2 |
| `setViewportSelectionMode` | 6888 | function |  | 4 |
| `setViewportEditMode` | 6900 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6942 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6956 | function |  | 8 |
| `outlinerGuides` | 6968 | function |  | 3 |
| `guideOutlinerLabel` | 6975 | function |  | 2 |
| `normalizeOutlinerName` | 6985 | function |  | 4 |
| `beginOutlinerRename` | 6990 | function |  | 2 |
| `finish` | 7001 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 7031 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 7041 | function |  | 2 |
| `renderGuideOutliner` | 7076 | function |  | 10 |
| `referenceOutlinerGroup` | 7134 | function |  | 2 |
| `renderReferenceOutliner` | 7138 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7255 | function |  | 5 |
| `readReferenceImageFile` | 7260 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7284 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7291 | function |  | 3 |
| `dragContainsReferenceImage` | 7336 | function |  | 3 |
| `setReferenceImageDragActive` | 7347 | function |  | 9 |
| `referenceDropDestination` | 7355 | function |  | 2 |
| `viewportOverlayDropPosition` | 7361 | function |  | 2 |
| `setReferenceDropHover` | 7370 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7388 | function |  | 2 |
| `referenceOverlayAtPointer` | 7408 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7426 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7439 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7485 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7535 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7557 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7568 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7594 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7603 | function |  | 2 |
| `referenceCropCursor` | 7618 | function |  | 3 |
| `updateReferenceCropHandles` | 7624 | function |  | 5 |
| `referenceCropSourcePoint` | 7645 | function |  | 2 |
| `beginReferenceCrop` | 7652 | function |  | 1 |
| `updateReferenceCrop` | 7690 | function |  | 1 |
| `finishReferenceCrop` | 7722 | function |  | 4 |
| `setHeadSetupEditing` | 7740 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7756 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7765 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7775 | function |  | 4 |
| `setScalpGuideVisibility` | 7781 | function |  | 12 |
| `currentGuideViewMode` | 7789 | function |  | 3 |
| `updateGuideViewToggle` | 7797 | function |  | 5 |
| `setGuideViewMode` | 7813 | function |  | 3 |
| `cycleGuideViewMode` | 7824 | function |  | 1 |
| `hideGuideViewContextMenu` | 7829 | function |  | 6 |
| `showGuideViewContextMenu` | 7833 | function |  | 1 |
| `strandPassesDisplayFilters` | 7846 | function |  | 4 |
| `strandVisibleForDisplay` | 7855 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7860 | function |  | 2 |
| `lockedStrandsExist` | 7864 | function |  | 3 |
| `hiddenStrandsExist` | 7868 | function |  | 2 |
| `hideSelectedStrands` | 7872 | function |  | 2 |
| `unhideHiddenStrands` | 7882 | function |  | 2 |
| `strandIsolationActive` | 7891 | function |  | 7 |
| `setStrandIsolation` | 7895 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7907 | function |  | 3 |
| `syncVisibilityParent` | 7918 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7925 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7954 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7961 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7981 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 8004 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 8012 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 8019 | function |  | 9 |
| `setScalpLatticeEditing` | 8030 | function |  | 4 |
| `setScalpShapeEditing` | 8045 | function |  | 9 |
| `setScalpPaintEditing` | 8063 | function |  | 7 |
| `defaultCurveLatticePoints` | 8087 | function |  | 3 |
| `flatCurveLatticePoints` | 8113 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8122 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8146 | function |  | 4 |
| `horizontalValue` | 8151 | arrow |  | 1 |
| `blendedSample` | 8162 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8195 | function |  | 2 |
| `curveLatticeControlPoint` | 8210 | function |  | 9 |
| `circularArcTangent` | 8214 | function |  | 4 |
| `arcLengthTo` | 8245 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8257 | function |  | 3 |
| `sampleHermiteCurve` | 8296 | function |  | 10 |
| `sampleCurveLattice` | 8313 | function |  | 6 |
| `curveLatticeNormal` | 8332 | function |  | 1 |
| `createCurveLatticeGeometry` | 8343 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8372 | function |  | 3 |
| `appendCurve` | 8374 | arrow |  | 4 |
| `sample` | 8376 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8403 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8419 | function |  | 3 |
| `addPicker` | 8421 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8460 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8473 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8477 | function |  | 3 |
| `curveLatticeEditablePoint` | 8495 | function |  | 13 |
| `curveLatticePointSection` | 8502 | function |  | 3 |
| `curveLatticeRestPoint` | 8513 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8519 | function |  | 7 |
| `curveLatticeRootColumns` | 8525 | function |  | 3 |
| `curveTangentsForPoints` | 8532 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8544 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8581 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8607 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8624 | function |  | 3 |
| `resampleGrid` | 8634 | arrow |  | 2 |
| `controlPointIsSelected` | 8661 | function |  | 7 |
| `clearMultiPointSelection` | 8669 | function |  | 9 |
| `createCurveLatticeHandles` | 8673 | function |  | 4 |
| `addCurveLattice` | 8695 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8804 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8835 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8841 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8880 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8901 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8918 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8927 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8934 | function |  | 1 |
| `selectCurveLatticeLoop` | 8953 | function |  | 3 |
| `selectCurveLatticePoint` | 8982 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8997 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 9039 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9060 | function |  | 3 |
| `curveLatticeColumnPoints` | 9103 | function |  | 3 |
| `groupCurveControlIndices` | 9112 | function |  | 4 |
| `groupCurveControlPoints` | 9118 | function |  | 2 |
| `updateGroupCurveDisplay` | 9124 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9134 | function |  | 2 |
| `groupCurveDeformationPairs` | 9156 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9163 | function |  | 2 |
| `appendPairs` | 9165 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9176 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9195 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9216 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9235 | function |  | 2 |
| `capsuleGuideCapHeight` | 9269 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9273 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9278 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9282 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9294 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9310 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9316 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9342 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9372 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9426 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9447 | function |  | 7 |
| `vertex` | 9461 | function |  | 4 |
| `addFace` | 9467 | function |  | 3 |
| `addRing` | 9485 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9540 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9550 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9615 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9661 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9674 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9695 | function |  | 3 |
| `capsuleGuidePointDistances` | 9700 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9721 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9741 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9746 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9752 | function |  | 3 |
| `capsuleGuideAccentColor` | 9757 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9762 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9773 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9785 | function |  | 2 |
| `createCapsuleGuideHandles` | 9817 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9840 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9859 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9866 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9882 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9899 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9914 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9951 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9967 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9984 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9990 | function |  | 3 |
| `selectCapsuleGuideLoop` | 10017 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 10029 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 10048 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10093 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10128 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10142 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10148 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10165 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10176 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10187 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10217 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10227 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10268 | function |  | 3 |
| `createQuadCageGeometry` | 10284 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10308 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10328 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10339 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10392 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10430 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10440 | function |  | 4 |
| `addCapsuleGuide` | 10448 | function |  | 4 |
| `addGuide` | 10517 | function |  | 1 |
| `createGuideGeometry` | 10578 | function |  | 4 |
| `selectGuide` | 10633 | function |  | 17 |
| `updateGuideControlsVisibility` | 10701 | function |  | 10 |
| `updateViewportToolVisibility` | 10718 | function |  | 7 |
| `getSelectedGuide` | 10757 | function |  | 34 |
| `selectedViewportFocusBounds` | 10761 | function |  | 2 |
| `frameViewportBounds` | 10775 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10805 | function |  | 2 |
| `fullSceneFocusBounds` | 10809 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10826 | function |  | 3 |
| `cycleViewportFraming` | 10835 | function |  | 2 |
| `syncGuideInputs` | 10853 | function |  | 5 |
| `updateGuideGeometry` | 10896 | function |  | 3 |
| `sculptBrushToolActive` | 10917 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10921 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10925 | function |  | 3 |
| `effectiveSculptBrushTool` | 10929 | function |  | 13 |
| `updateSculptScaleModeRow` | 10935 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10940 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10962 | function |  | 5 |
| `setActiveTool` | 10971 | function |  | 19 |
| `setDrawStrandMode` | 11109 | function |  | 2 |
| `setObjectSpaceEditing` | 11119 | function |  | 7 |
| `setHierarchyEditing` | 11135 | function |  | 4 |
| `setProportionalEditing` | 11147 | function |  | 5 |
| `beginProportionalSizeEdit` | 11166 | function |  | 3 |
| `updateProportionalSizeEdit` | 11178 | function |  | 2 |
| `endProportionalSizeEdit` | 11189 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11196 | function |  | 2 |
| `refreshProportionalPreview` | 11204 | function |  | 4 |
| `activeBrushSizeInput` | 11214 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11223 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11235 | function |  | 2 |
| `beginBrushSizeDrag` | 11253 | function |  | 1 |
| `updateBrushSizeDrag` | 11280 | function |  | 1 |
| `finishBrushSizeDrag` | 11301 | function |  | 2 |
| `updateInteractionLocks` | 11318 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11327 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11336 | function |  | 2 |
| `configureTransformControls` | 11367 | function |  | 16 |
| `pullMoveActive` | 11375 | function |  | 9 |
| `updatePullGuideVisual` | 11379 | function |  | 4 |
| `attachTransformForCurvePoint` | 11395 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11419 | function |  | 7 |
| `strandObjectRootIndex` | 11435 | function |  | 3 |
| `strandObjectRoot` | 11444 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11448 | function |  | 2 |
| `attachStrandObjectTransform` | 11453 | function |  | 6 |
| `guideObjectPivot` | 11476 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11487 | function |  | 2 |
| `attachGuideObjectTransform` | 11492 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11511 | function |  | 2 |
| `beginGuideObjectTransform` | 11539 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11546 | function |  | 2 |
| `updateGuideObjectTransform` | 11568 | function |  | 2 |
| `finishGuideObjectTransform` | 11601 | function |  | 2 |
| `clonePlacementFrame` | 11610 | function |  | 2 |
| `cloneOptionalVectors` | 11622 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11626 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11643 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11658 | function |  | 2 |
| `strandObjectTransformOperators` | 11674 | function |  | 4 |
| `transformPoint` | 11682 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11689 | arrow |  | 0 |
| `transformNormal` | 11695 | arrow |  | 10 |
| `transformDirection` | 11705 | arrow |  | 7 |
| `worldMatrixForPivot` | 11717 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11723 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11739 | function |  | 6 |
| `beginStrandObjectTransform` | 11753 | function |  | 2 |
| `updateStrandObjectTransform` | 11791 | function |  | 2 |
| `commitStrandObjectTransform` | 11840 | function |  | 2 |
| `mapPoints` | 11853 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11887 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11901 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11924 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11937 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11952 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11978 | function |  | 2 |
| `finishSurfaceObjectTransform` | 12027 | function |  | 2 |
| `beginHandleEdit` | 12036 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12085 | function |  | 3 |
| `applyBranchRigidRootMove` | 12102 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12139 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12150 | function |  | 3 |
| `multiPointHandleEditActive` | 12161 | function |  | 7 |
| `applyMultiMove` | 12165 | function |  | 5 |
| `applyMultiRotate` | 12171 | function |  | 2 |
| `applyMultiScale` | 12180 | function |  | 2 |
| `applyHierarchicalMove` | 12189 | function |  | 3 |
| `applySingleMove` | 12201 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12205 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12222 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12231 | function |  | 3 |
| `changed` | 12241 | arrow |  | 1 |
| `applyPullMove` | 12283 | function |  | 3 |
| `pullHeadCollisionContext` | 12291 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12310 | function |  | 2 |
| `applyProportionalMove` | 12333 | function |  | 3 |
| `viewPlaneNormal` | 12344 | function |  | 20 |
| `isCameraInSnappedView` | 12348 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12356 | function |  | 10 |
| `updateViewPlaneGrid` | 12360 | function |  | 14 |
| `setViewPlaneMove` | 12417 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12428 | function |  | 2 |
| `rayFromViewportEvent` | 12436 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12444 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12454 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12465 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12478 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12497 | function |  | 4 |
| `beginViewPlaneMove` | 12504 | function |  | 3 |
| `updateViewPlaneMove` | 12568 | function |  | 1 |
| `endViewPlaneMove` | 12633 | function |  | 7 |
| `applyHierarchicalRotate` | 12652 | function |  | 2 |
| `rotateGuideNormal` | 12659 | arrow |  | 4 |
| `applySingleRotate` | 12697 | function |  | 2 |
| `applyProportionalRotate` | 12701 | function |  | 2 |
| `applyHierarchicalScale` | 12721 | function |  | 2 |
| `applySingleScale` | 12731 | function |  | 2 |
| `applyProportionalScale` | 12735 | function |  | 2 |
| `setPointScale` | 12751 | function |  | 8 |
| `proportionalWeight` | 12760 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12772 | function |  | 5 |
| `strandInfluenceColor` | 12778 | function |  | 17 |
| `beginRelaxEdit` | 12803 | function |  | 3 |
| `updateRelaxEdit` | 12832 | function |  | 1 |
| `endRelaxEdit` | 12892 | function |  | 1 |
| `disposeGuide` | 12902 | function |  | 3 |
| `removeGuideObjects` | 12930 | function |  | 3 |
| `strandRadiusAt` | 12944 | function |  | 5 |
| `strandProfileTopologyAt` | 12961 | function |  | 8 |
| `strandCurveParameters` | 13003 | function |  | 7 |
| `widthProfileAt` | 13013 | arrow |  | 1 |
| `braidFrameAt` | 13051 | function |  | 5 |
| `braidFrameAtExtended` | 13061 | function |  | 2 |
| `createBraidProfileProjector` | 13070 | function |  | 2 |
| `project` | 13086 | arrow |  | 17 |
| `createBraidGeometry` | 13101 | function |  | 2 |
| `deformationAt` | 13136 | function |  | 3 |
| `widthFor` | 13145 | arrow |  | 3 |
| `depthFor` | 13149 | arrow |  | 3 |
| `outputVertex` | 13181 | function |  | 7 |
| `appendAuthoredCap` | 13289 | function |  | 3 |
| `outputCapVertex` | 13296 | arrow |  | 6 |
| `capBoundary` | 13387 | function |  | 3 |
| `strandGeometryCurve` | 13449 | function |  | 15 |
| `strandGeometryFrameAt` | 13475 | function |  | 19 |
| `transportedStrandFrameAt` | 13538 | function |  | 7 |
| `twistOverrideAt` | 13541 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13569 | function |  | 2 |
| `weldPanelGeometryData` | 13605 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13645 | function |  | 3 |
| `surfacePanelPoint` | 13660 | function |  | 3 |
| `createPanelStrandGeometry` | 13683 | function |  | 2 |
| `addQuad` | 13717 | arrow |  | 6 |
| `near` | 13721 | arrow |  | 6 |
| `panelWidthAt` | 13751 | arrow |  | 6 |
| `panelThicknessAt` | 13760 | arrow |  | 6 |
| `panelFrameAt` | 13769 | arrow |  | 1 |
| `rawPanelPoint` | 13787 | arrow |  | 1 |
| `panelPoint` | 13807 | arrow |  | 2 |
| `addPatch` | 13813 | arrow |  | 1 |
| `splitOpening` | 13864 | arrow |  | 2 |
| `uStart` | 13888 | arrow |  | 1 |
| `uEnd` | 13891 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13929 | function |  | 3 |
| `inside` | 13930 | arrow |  | 2 |
| `pushOrientedTriangle` | 13952 | function |  | 7 |
| `triangulatePolygon3D` | 13963 | function |  | 1 |
| `orientedQuadFace` | 14003 | function |  | 2 |
| `createSplitStrandGeometry` | 14011 | function |  | 2 |
| `fusedIndexAt` | 14168 | arrow |  | 0 |
| `createHairCardGeometry` | 14217 | function |  | 2 |
| `createPolyGeometry` | 14316 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14343 | function |  | 6 |
| `curveSurfaceControllerFrameLock` | 14352 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14399 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14407 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14423 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14432 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14443 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14451 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14461 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14481 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14504 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14583 | function |  | 2 |
| `pushBoundary` | 14612 | arrow |  | 5 |
| `boundaryAt` | 14630 | arrow |  | 3 |
| `hermite` | 14652 | arrow |  | 2 |
| `emitBottomMidRow` | 14697 | arrow |  | 2 |
| `emitTopMidRow` | 14796 | arrow |  | 2 |
| `sideHoleVertex` | 14838 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14887 | arrow |  | 2 |
| `emitFillStrip` | 14958 | arrow |  | 2 |
| `fillSide` | 14969 | arrow |  | 0 |
| `directBridgeQuadIndex` | 15013 | arrow |  | 2 |
| `edgeDirection` | 15037 | arrow |  | 1 |
| `positionAt` | 15096 | arrow |  | 1 |
| `createBranchChildGeometry` | 15147 | function |  | 2 |
| `createCompoundStrandGeometry` | 15357 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15608 | function |  | 2 |
| `createHairGeometry` | 15639 | function |  | 6 |
| `createBaseHairGeometry` | 15691 | function |  | 3 |
| `hairMaterialDefinition` | 15809 | function |  | 4 |
| `materialForLock` | 15813 | function |  | 8 |
| `activeHairMaterialDefinition` | 15817 | function |  | 11 |
| `strandDisplayColor` | 15823 | function |  | 14 |
| `setAnimeHairBaseColor` | 15841 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15854 | function |  | 2 |
| `createHairMaterial` | 15894 | function |  | 5 |
| `createStrandSelectionOutline` | 15936 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15970 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15979 | function |  | 6 |
| `refreshMaterialUsers` | 16006 | function |  | 6 |
| `renderHairMaterialOutliner` | 16015 | function |  | 5 |
| `renderHairMaterialOptions` | 16045 | function |  | 3 |
| `syncHairMaterialEditor` | 16055 | function |  | 9 |
| `createProjectHairMaterial` | 16081 | function |  | 3 |
| `deleteActiveHairMaterial` | 16101 | function |  | 2 |
| `createHairTopologyGeometry` | 16119 | function |  | 4 |
| `createHairTopologyOverlay` | 16140 | function |  | 3 |
| `groupDefaultsFor` | 16187 | function |  | 9 |
| `creationToolActive` | 16194 | function |  | 8 |
| `activeCreationShapeDefaults` | 16198 | function |  | 11 |
| `activeStrandShapeTarget` | 16204 | function |  | 5 |
| `curvePolylineLength` | 16208 | function |  | 2 |
| `curvePolylineLengths` | 16216 | function |  | 3 |
| `samplePolylineDistance` | 16224 | function |  | 2 |
| `applyProjectedCurveLength` | 16234 | function |  | 4 |
| `clearRegionLengthBaseline` | 16265 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16272 | function |  | 2 |
| `setGroupLengthScale` | 16280 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16318 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16350 | function |  | 1 |
| `activeSweepProfile` | 16359 | function |  | 9 |
| `activeSweepProfileTarget` | 16366 | function |  | 6 |
| `trimmedSweepProfile` | 16373 | function |  | 7 |
| `roundedLeft` | 16382 | arrow |  | 1 |
| `roundedRight` | 16388 | arrow |  | 1 |
| `activeProfileOffset` | 16405 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16412 | function |  | 3 |
| `profileToCanvas` | 16429 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16433 | function |  | 11 |
| `sampleSweepProfile` | 16442 | function |  | 7 |
| `createSweepProfileTopology` | 16463 | function |  | 5 |
| `renderProfilePreview` | 16505 | function |  | 8 |
| `renderHairCardCoveragePath` | 16524 | function |  | 3 |
| `activeTaperTarget` | 16539 | function |  | 15 |
| `twistCurveEditing` | 16546 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16550 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16554 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16558 | function |  | 17 |
| `taperAsymmetryKey` | 16562 | function |  | 12 |
| `taperSecondaryKey` | 16566 | function |  | 11 |
| `activeTaperCurve` | 16570 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16581 | function |  | 6 |
| `taperSamples` | 16591 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16598 | function |  | 2 |
| `renderTaperPreview` | 16620 | function |  | 13 |
| `renderTwistCurvePreview` | 16656 | function |  | 5 |
| `cloneShapePresetValue` | 16674 | function |  | 66 |
| `shapeValuesMatch` | 16678 | function |  | 5 |
| `shapeTargetForSelect` | 16686 | function |  | 4 |
| `loadCustomShapePresets` | 16696 | function |  | 2 |
| `saveCustomShapePresets` | 16707 | function |  | 4 |
| `shapePresetLabel` | 16715 | function |  | 4 |
| `setupShapePresetControls` | 16720 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16745 | function |  | 3 |
| `syncShapePresetSelects` | 16751 | function |  | 8 |
| `populateShapePresetSelects` | 16772 | function |  | 5 |
| `applyShapePreset` | 16799 | function |  | 2 |
| `openSaveShapePreset` | 16836 | function |  | 2 |
| `commitCustomShapePreset` | 16861 | function |  | 2 |
| `openRemoveShapePreset` | 16884 | function |  | 2 |
| `commitRemoveShapePreset` | 16897 | function |  | 2 |
| `taperPointToCanvas` | 16913 | function |  | 4 |
| `canvasToTaperPoint` | 16930 | function |  | 2 |
| `clearTaperMeshPoints` | 16966 | function |  | 2 |
| `taperMeshPointFrame` | 16976 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16986 | function |  | 4 |
| `twistMeshGraphAxis` | 16994 | function |  | 4 |
| `addTwistMeshCurvePath` | 16998 | function |  | 2 |
| `appendSegment` | 17019 | arrow |  | 1 |
| `appendFill` | 17022 | arrow |  | 1 |
| `appendSignedSection` | 17028 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17077 | function |  | 6 |
| `updateTaperMeshPoints` | 17114 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17193 | function |  | 5 |
| `renderTaperCurveEditor` | 17211 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17283 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17297 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17313 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17347 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17356 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17367 | function |  | 2 |
| `applyTaperCurveEdit` | 17375 | function |  | 10 |
| `openTaperCurveEditor` | 17483 | function |  | 3 |
| `closeTaperCurveEditor` | 17528 | function |  | 6 |
| `updateViewportStatsVisibility` | 17541 | function |  | 6 |
| `canvasToProfile` | 17560 | function |  | 2 |
| `renderSweepProfileEditor` | 17570 | function |  | 7 |
| `applySweepProfileEdit` | 17613 | function |  | 8 |
| `openSweepProfileEditor` | 17640 | function |  | 1 |
| `closeSweepProfileEditor` | 17675 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17684 | function |  | 2 |
| `addLock` | 17699 | function |  | 19 |
| `mirroredScalpRegion` | 17902 | function |  | 5 |
| `mirroredVector` | 17911 | function |  | 12 |
| `mirroredPlacementFrame` | 17915 | function |  | 2 |
| `mirrorPartnerFor` | 17928 | function |  | 40 |
| `decoupleMirrorPartner` | 17932 | function |  | 2 |
| `createMirrorPartner` | 17940 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 18036 | function |  | 6 |
| `mirroredClumpPartners` | 18041 | function |  | 6 |
| `createMirroredClump` | 18047 | function |  | 3 |
| `decoupleMirroredClump` | 18069 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18078 | function |  | 6 |
| `syncActiveMirror` | 18243 | function |  | 25 |
| `setMirrorXEditing` | 18255 | function |  | 6 |
| `snapshotState` | 18279 | function |  | 8 |
| `scalpTriangleRegion` | 18549 | function |  | 4 |
| `closestPointOnActiveScalp` | 18562 | function |  | 12 |
| `rootAttachmentFrame` | 18634 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18646 | function |  | 4 |
| `resolveRootAttachment` | 18664 | function |  | 4 |
| `curvePointsToRootLocal` | 18704 | function |  | 2 |
| `curvePointsFromRootLocal` | 18716 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18724 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18740 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18770 | function |  | 2 |
| `createRootAttachment` | 18782 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18812 | function |  | 4 |
| `rootAttachmentToData` | 18839 | function |  | 2 |
| `rootAttachmentFromData` | 18867 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18906 | function |  | 2 |
| `remapPoint` | 18921 | arrow |  | 1 |
| `remapVector` | 18922 | arrow |  | 4 |
| `buildHairProjectFile` | 18950 | function |  | 4 |
| `importScalpGuideMeshFile` | 18966 | function |  | 2 |
| `importHeadMeshFile` | 18983 | function |  | 3 |
| `importFullBodyMeshFile` | 19006 | function |  | 3 |
| `downloadTextFile` | 19030 | function |  | 4 |
| `downloadProjectFile` | 19042 | function |  | 3 |
| `downloadPreferencesAndPresets` | 19046 | function |  | 1 |
| `importedBooleanPreference` | 19079 | function |  | 11 |
| `loadPreferencesAndPresets` | 19083 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19153 | function |  | 1 |
| `setProjectSaveButtonsDisabled` | 19167 | function |  | 5 |
| `openFileActionDialog` | 19191 | function |  | 5 |
| `performFileAction` | 19236 | function |  | 2 |
| `saveHairProjectFile` | 19337 | function |  | 3 |
| `saveHairProjectQuickly` | 19366 | function |  | 2 |
| `openHairProjectFile` | 19393 | function |  | 4 |
| `dragContainsApplicationFile` | 19451 | function |  | 3 |
| `safelyRememberRecentProject` | 19460 | function |  | 3 |
| `renderRecentProjectsMenu` | 19469 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19501 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19526 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19530 | function |  | 2 |
| `pushUndoState` | 19546 | function |  | 119 |
| `undoLastAction` | 19553 | function |  | 2 |
| `redoLastAction` | 19567 | function |  | 2 |
| `updateHistoryButtons` | 19581 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19586 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19603 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19610 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19648 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19725 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19751 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19783 | function |  | 2 |
| `finalizeStateRestore` | 19824 | function |  | 2 |
| `restoreState` | 19831 | function |  | 5 |
| `disposeAllEditableObjects` | 19855 | function |  | 2 |
| `restoreLock` | 19876 | function |  | 4 |
| `restoreGuide` | 20093 | function |  | 2 |
| `vectorToData` | 20154 | function |  | 29 |
| `dataToVector` | 20158 | function |  | 31 |
| `frameToData` | 20162 | function |  | 2 |
| `frameFromData` | 20174 | function |  | 2 |
| `applyPresetSelection` | 20186 | function |  | 2 |
| `drawPresetThumbnail` | 20217 | function |  | 1 |
| `fillHair` | 20232 | arrow |  | 9 |
| `strand` | 20244 | arrow |  | 31 |
| `bun` | 20262 | arrow |  | 2 |
| `braid` | 20297 | arrow |  | 2 |
| `renderPresetLibrary` | 20386 | function |  | 3 |
| `setPresetLibraryOpen` | 20445 | function |  | 6 |
| `average` | 20458 | function |  | 4 |
| `fitPointAttributes` | 20462 | function |  | 9 |
| `rebuildCurveObjects` | 20491 | function |  | 10 |
| `createCurvePoints` | 20503 | function |  | 2 |
| `addGeneratedBangPreset` | 20512 | function |  | 1 |
| `sampleScalpQuad` | 20605 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20629 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20678 | function |  | 1 |
| `columns` | 20679 | arrow |  | 1 |
| `layer` | 20683 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20897 | function |  | 2 |
| `addBraidedBobPreset` | 20933 | function |  | 1 |
| `evenColumns` | 20934 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 21150 | function |  | 1 |
| `scalpSeed` | 21173 | arrow |  | 1 |
| `createBowlCutPoints` | 21460 | function |  | 2 |
| `addBowlCutPreset` | 21498 | function |  | 1 |
| `scalpRegionAtHit` | 21564 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21576 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21583 | function |  | 12 |
| `braidStrokeActive` | 21590 | function |  | 9 |
| `proceduralDrawActive` | 21594 | function |  | 3 |
| `panelStrokeActive` | 21598 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21602 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21606 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21610 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21616 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21620 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21624 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21628 | function |  | 3 |
| `liveSurfaceStrandId` | 21638 | function |  | 4 |
| `liveSurfaceStrand` | 21642 | function |  | 4 |
| `liveSurfaceGuideId` | 21647 | function |  | 3 |
| `guideSupportsLiveSurface` | 21651 | function |  | 2 |
| `liveSurfaceGuide` | 21658 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21665 | function |  | 12 |
| `activeStrokeScalpOffset` | 21705 | function |  | 4 |
| `activeStrokeBrushSize` | 21711 | function |  | 10 |
| `activeStrokeBrushDepth` | 21717 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21723 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21731 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21741 | function |  | 13 |
| `worldNormalAtHit` | 21780 | function |  | 6 |
| `selectedPolyMesh` | 21788 | function |  | 10 |
| `addPolyLock` | 21793 | function |  | 2 |
| `ensurePolyMesh` | 21812 | function |  | 3 |
| `polySurfaceSample` | 21816 | function |  | 4 |
| `polyTargetAtEvent` | 21827 | function |  | 6 |
| `refreshPolyMesh` | 21853 | function |  | 10 |
| `ensurePolyFillPreview` | 21862 | function |  | 2 |
| `clearPolyFillPreview` | 21899 | function |  | 17 |
| `polyFillCandidateForEvent` | 21904 | function |  | 3 |
| `showPolyFillPreview` | 21924 | function |  | 2 |
| `updatePolyFillPreview` | 21950 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21975 | function |  | 5 |
| `fillPolyGap` | 21985 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21996 | function |  | 2 |
| `projectPolyRelaxPoint` | 22016 | function |  | 2 |
| `removePolyPointAttributes` | 22060 | function |  | 3 |
| `deletePolyComponent` | 22069 | function |  | 2 |
| `addPolyPoint` | 22092 | function |  | 4 |
| `appendPolyStrokeRow` | 22101 | function |  | 4 |
| `beginPolyBrushPointer` | 22121 | function |  | 1 |
| `finishPolyAltDelete` | 22207 | function |  | 1 |
| `updatePolyBrushStroke` | 22221 | function |  | 1 |
| `finishPolyBrushStroke` | 22311 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22348 | function |  | 2 |
| `drawSampleFromHit` | 22371 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22385 | function |  | 3 |
| `strokeLength` | 22422 | function |  | 9 |
| `resampleDrawStroke` | 22428 | function |  | 2 |
| `processedDrawStroke` | 22460 | function |  | 8 |
| `strokeSurfaceNormals` | 22489 | function |  | 7 |
| `drawClumpFrame` | 22500 | function |  | 4 |
| `nearestCurveParameter` | 22509 | function |  | 2 |
| `drawClumpSampleNormal` | 22523 | function |  | 6 |
| `drawClumpTemplateVector` | 22532 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22538 | function |  | 3 |
| `drawClumpStrandMaps` | 22554 | function |  | 4 |
| `nextClumpName` | 22609 | function |  | 6 |
| `initializeClumpShape` | 22616 | function |  | 5 |
| `stableClumpVariation` | 22627 | function |  | 3 |
| `createClumpFromLocks` | 22639 | function |  | 7 |
| `addLockToClump` | 22664 | function |  | 4 |
| `stableBranchBaseNormals` | 22682 | function |  | 4 |
| `ensureBranchParentNormalField` | 22693 | function |  | 2 |
| `branchParentFrame` | 22699 | function |  | 7 |
| `branchLocalVector` | 22711 | function |  | 3 |
| `branchWorldVector` | 22715 | function |  | 4 |
| `captureBranchLocalState` | 22721 | function |  | 6 |
| `enforceBranchRootPosition` | 22749 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22799 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22826 | function |  | 2 |
| `clampRegionParam` | 22873 | function |  | 113 |
| `branchRootRegionFromParam` | 22880 | function |  | 4 |
| `cloneBranchRootRegion` | 22903 | function |  | 5 |
| `flip` | 22905 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22938 | function |  | 8 |
| `setBranchRootRegionPoint` | 22969 | function |  | 3 |
| `branchRegionUVToCanvas` | 23005 | function |  | 10 |
| `branchRegionCanvasToUV` | 23008 | function |  | 4 |
| `openBranchRegionEditor` | 23014 | function |  | 2 |
| `closeBranchRegionEditor` | 23028 | function |  | 2 |
| `retargetBranchRegionEditor` | 23034 | function |  | 2 |
| `renderBranchRegionEditor` | 23039 | function |  | 9 |
| `applyBranchRegionView` | 23128 | function |  | 6 |
| `resetBranchRegionZoom` | 23131 | function |  | 1 |
| `branchRegionNavAction` | 23137 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 23151 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 23171 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 23175 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 23201 | function |  | 2 |
| `endBranchRegionCanvasNav` | 23213 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 23218 | function |  | 1 |
| `branchRegionEventUV` | 23238 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 23246 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23351 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23484 | function |  | 1 |
| `pointerToNdc` | 23489 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23500 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23514 | function |  | 1 |
| `endBranchSweepStartDrag` | 23537 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23544 | function |  | 5 |
| `gridProfileSkipCol` | 23571 | function |  | 3 |
| `branchRootRegionSurface` | 23580 | function |  | 6 |
| `toGridCol` | 23605 | arrow |  | 5 |
| `toRow` | 23609 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23664 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23684 | function |  | 2 |
| `pointAt` | 23690 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23717 | function |  | 3 |
| `applyBranchRootOffset` | 23789 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23808 | function |  | 3 |
| `branchChildrenFor` | 23828 | function |  | 9 |
| `detachBranch` | 23832 | function |  | 2 |
| `updateBranchChildren` | 23843 | function |  | 4 |
| `clumpDirectMembers` | 23886 | function |  | 3 |
| `clumpMembersForGuide` | 23891 | function |  | 6 |
| `clumpGuideForLock` | 23895 | function |  | 13 |
| `proceduralGuideForLock` | 23900 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23907 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23914 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23921 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23933 | function |  | 2 |
| `applyProceduralBranchSettings` | 23946 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23985 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 24001 | function |  | 3 |
| `createProceduralAccessoryLock` | 24015 | function |  | 2 |
| `applyProceduralAccessorySettings` | 24067 | function |  | 2 |
| `clumpFrameAt` | 24118 | function |  | 5 |
| `commitClumpMemberRestState` | 24126 | function |  | 10 |
| `updateClumpMembers` | 24209 | function |  | 10 |
| `dissolveClump` | 24313 | function |  | 6 |
| `detachLockFromClump` | 24350 | function |  | 4 |
| `updateDrawVolumePreview` | 24376 | function |  | 5 |
| `hideDrawClumpPreviews` | 24400 | function |  | 5 |
| `resetDrawVolumePreview` | 24406 | function |  | 3 |
| `updateDrawStrandPreview` | 24412 | function |  | 23 |
| `continueFromTipEnabled` | 24631 | function |  | 2 |
| `selectedTipContinuationLock` | 24637 | function |  | 3 |
| `selectedDrawBranchPoint` | 24650 | function |  | 3 |
| `canBranchDrawFromLock` | 24667 | function |  | 3 |
| `beginDrawStrandStroke` | 24674 | function |  | 2 |
| `beginDrawFreePlane` | 24799 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24813 | function |  | 2 |
| `updateDrawStrandStroke` | 24838 | function |  | 1 |
| `createDrawnLock` | 24884 | function |  | 3 |
| `setting` | 24888 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24956 | function |  | 4 |
| `createDrawnBraid` | 24964 | function |  | 2 |
| `createDrawnStrand` | 25021 | function |  | 2 |
| `createDrawnPanel` | 25148 | function |  | 2 |
| `surfaceLatticeNormal` | 25198 | function |  | 2 |
| `createSurfaceLockFromLattice` | 25213 | function |  | 3 |
| `createViewportSurface` | 25278 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25307 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25313 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25320 | function |  | 4 |
| `updateLoftSurfacePreview` | 25329 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25361 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25377 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25395 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25417 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25443 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25453 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25457 | function |  | 2 |
| `curveSurfacePreviewLock` | 25466 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25489 | function |  | 2 |
| `hideCurveSurfacePreview` | 25505 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25517 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25522 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25531 | function |  | 3 |
| `curveSurfaceSideVector` | 25569 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25582 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25590 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25603 | function |  | 5 |
| `updateCurveSurfacePreview` | 25623 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25685 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25707 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25722 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25770 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25805 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25837 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25895 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25972 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25977 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25986 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 26020 | function |  | 2 |
| `updateLoftSurfaceStroke` | 26031 | function |  | 1 |
| `finishLoftSurfaceStroke` | 26061 | function |  | 2 |
| `extendDrawnStrand` | 26118 | function |  | 2 |
| `finishDrawStrandStroke` | 26151 | function |  | 7 |
| `createPlacedStrand` | 26178 | function |  | 2 |
| `placedPointCount` | 26242 | function |  | 3 |
| `createPlacedPoints` | 26246 | function |  | 3 |
| `pushPointOutsideHead` | 26265 | function |  | 8 |
| `resizePlacedStrand` | 26297 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26314 | function |  | 5 |
| `beginPlaceEdit` | 26319 | function |  | 2 |
| `updatePlaceEdit` | 26337 | function |  | 1 |
| `updatePlacementLength` | 26351 | function |  | 3 |
| `updatePlacementOrientation` | 26361 | function |  | 3 |
| `endPlaceEdit` | 26379 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26394 | function |  | 1 |
| `pendingPlacedLock` | 26404 | function |  | 2 |
| `beginPlacementPointer` | 26408 | function |  | 3 |
| `finishPlacementPointer` | 26418 | function |  | 2 |
| `confirmPlacementStep` | 26442 | function |  | 2 |
| `finishPlacementFlow` | 26465 | function |  | 7 |
| `updatePlacementStatus` | 26478 | function |  | 83 |
| `deselectStrands` | 26617 | function |  | 12 |
| `beginSelectionMarquee` | 26632 | function |  | 3 |
| `beginAltOrbit` | 26656 | function |  | 1 |
| `beginBlenderNavigation` | 26668 | function |  | 1 |
| `endBlenderNavigation` | 26713 | function |  | 1 |
| `prepareSelectPointerCapture` | 26721 | function |  | 1 |
| `endSelectPointerCapture` | 26727 | function |  | 1 |
| `endAltOrbit` | 26733 | function |  | 1 |
| `dollyCameraByDrag` | 26740 | function |  | 2 |
| `fastDragMagnitude` | 26763 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26769 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26777 | function |  | 1 |
| `endHoudiniZoomDrag` | 26794 | function |  | 1 |
| `updateSelectionMarquee` | 26802 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26819 | function |  | 3 |
| `selectPointsInMarquee` | 26827 | function |  | 2 |
| `pointKey` | 26853 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26884 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26921 | function |  | 3 |
| `projectedPoint` | 26938 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26967 | function |  | 2 |
| `finishSelectionMarquee` | 27012 | function |  | 2 |
| `headMeshes` | 27035 | function |  | 9 |
| `strandSplitProfileData` | 27043 | function |  | 4 |
| `strandSplitControlPoint` | 27056 | function |  | 4 |
| `panelSplitControlPoint` | 27092 | function |  | 6 |
| `strandControlPointRaycast` | 27148 | function |  | 1 |
| `strandControlPointFrame` | 27183 | function |  | 6 |
| `branchRootGizmoFrame` | 27214 | function |  | 5 |
| `strandControlPointHitFromEvent` | 27232 | function |  | 5 |
| `createCurveObjects` | 27290 | function |  | 4 |
| `polyEdgeKey` | 27463 | function |  | 2 |
| `polyMeshEdges` | 27467 | function |  | 2 |
| `populatePolyEditObjects` | 27481 | function |  | 3 |
| `createPolyEditObjects` | 27542 | function |  | 2 |
| `rebuildPolyEditObjects` | 27550 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27564 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27571 | function |  | 2 |
| `strandWidthEdgeSample` | 27580 | function |  | 3 |
| `strandWidthEdgePoints` | 27603 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27617 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27621 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27628 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27640 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27645 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27651 | function |  | 3 |
| `updateCurveObjects` | 27665 | function |  | 41 |
| `createCurveNormalIndicator` | 27922 | function |  | 2 |
| `pointUpDirection` | 27948 | function |  | 2 |
| `curveFrameAtPoint` | 27952 | function |  | 5 |
| `curveFrameAt` | 27973 | function |  | 10 |
| `strandTwistAt` | 27993 | function |  | 6 |
| `controlPointRotationAt` | 27998 | function |  | 6 |
| `strandProfileTwistAt` | 28002 | function |  | 2 |
| `strandFrameAt` | 28008 | function |  | 1 |
| `curveFrameAtSnapshot` | 28014 | function |  | 3 |
| `outwardNormalAtPoint` | 28033 | function |  | 11 |
| `sampledSurfaceNormal` | 28045 | function |  | 2 |
| `guidedNormalAt` | 28061 | function |  | 5 |
| `twistFromHandle` | 28080 | function |  | 3 |
| `signedAngleAroundAxis` | 28101 | function |  | 5 |
| `handleColor` | 28108 | function |  | 2 |
| `isAffectedCurvePoint` | 28131 | function |  | 2 |
| `syncLockFromCurve` | 28137 | function |  | 26 |
| `labelForPreset` | 28167 | function |  | 1 |
| `rebuildLockGeometry` | 28171 | function |  | 21 |
| `scheduleSculptBrushGeometryUpdates` | 28198 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 28206 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 28212 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 28234 | function |  | 8 |
| `updateLockGeometry` | 28247 | function |  | 57 |
| `setGroupColorView` | 28268 | function |  | 2 |
| `createUvCheckerTexture` | 28278 | function |  | 3 |
| `ensureUvCheckerForLock` | 28314 | function |  | 4 |
| `removeUvCheckerFromLock` | 28347 | function |  | 3 |
| `invalidateUvInspector` | 28362 | function |  | 7 |
| `uvInspectorRecord` | 28366 | function |  | 1 |
| `uvInspectorRecords` | 28405 | function |  | 2 |
| `drawUvInspectorGrid` | 28409 | function |  | 2 |
| `renderUvInspector` | 28443 | function |  | 3 |
| `setUvCheckerEnabled` | 28502 | function |  | 3 |
| `strandViewportBaseColor` | 28519 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28554 | function |  | 3 |
| `syncStrandSelectionOutline` | 28560 | function |  | 2 |
| `applyLockedStrandPalette` | 28571 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28580 | function |  | 6 |
| `setStrandSelectionVisual` | 28589 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28605 | function |  | 2 |
| `syncProceduralParentVisibility` | 28612 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28621 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28625 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28629 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28642 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28662 | function |  | 3 |
| `selectLock` | 28695 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28748 | function |  | 6 |
| `syncGroupInputs` | 28759 | function |  | 3 |
| `topologyStatsForLock` | 28792 | function |  | 4 |
| `formatTopologyStats` | 28800 | function |  | 5 |
| `updateTopologyStats` | 28804 | function |  | 20 |
| `normalizeBraidDimensions` | 28838 | function |  | 4 |
| `normalizeStrandDimensions` | 28851 | function |  | 3 |
| `strandBaseWidth` | 28865 | function |  | 5 |
| `strandWidthDimension` | 28869 | function |  | 5 |
| `strandDepthDimension` | 28877 | function |  | 8 |
| `setStrandWidthDimension` | 28885 | function |  | 2 |
| `setStrandDepthDimension` | 28907 | function |  | 4 |
| `syncShapeDimensionInputs` | 28923 | function |  | 4 |
| `syncCreationShapeInputs` | 28959 | function |  | 5 |
| `syncViewportDrawSettings` | 28997 | function |  | 5 |
| `syncPanelShapeInputs` | 29011 | function |  | 6 |
| `syncStrandSplitInputs` | 29037 | function |  | 4 |
| `syncHairCardControls` | 29046 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 29054 | function |  | 3 |
| `updateAttributeEditorMode` | 29093 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 29242 | function |  | 3 |
| `curveLatticeForGroup` | 29265 | function |  | 2 |
| `filterCurveLatticesToGroup` | 29283 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29328 | function |  | 2 |
| `showCurveLatticeForGroup` | 29345 | function |  | 2 |
| `selectStrandGroup` | 29382 | function |  | 3 |
| `selectCurvePoint` | 29424 | function |  | 10 |
| `updateSelectedPointLabel` | 29438 | function |  | 14 |
| `syncInputs` | 29451 | function |  | 16 |
| `syncClumpGuidePanel` | 29497 | function |  | 3 |
| `getSelectedLock` | 29524 | function |  | 104 |
| `selectedLocksInOrder` | 29528 | function |  | 37 |
| `lockStrands` | 29534 | function |  | 3 |
| `lockSelectedStrands` | 29567 | function |  | 3 |
| `unlockStrands` | 29573 | function |  | 3 |
| `unlockAllStrands` | 29588 | function |  | 3 |
| `strandEditFamily` | 29592 | function |  | 7 |
| `compatibleSelectedLocks` | 29597 | function |  | 6 |
| `selectedEditRoots` | 29604 | function |  | 2 |
| `editSelectedLocks` | 29617 | function |  | 21 |
| `multiEditValuesEqual` | 29650 | function |  | 2 |
| `setMixedControl` | 29659 | function |  | 28 |
| `syncMultiStrandInputs` | 29676 | function |  | 16 |
| `values` | 29692 | arrow |  | 44 |
| `selectedRebuildableCurves` | 29772 | function |  | 5 |
| `createCompoundStrand` | 29779 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29840 | function |  | 9 |
| `openRebuildCurveDialog` | 29853 | function |  | 1 |
| `rebuildSelectedCurves` | 29867 | function |  | 2 |
| `selectionCanBecomeClump` | 29906 | function |  | 4 |
| `createClumpFromSelection` | 29911 | function |  | 3 |
| `cleanSelectionSets` | 29923 | function |  | 2 |
| `createSelectionSetFromSelection` | 29928 | function |  | 3 |
| `selectionSetById` | 29939 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29943 | function |  | 7 |
| `editSelectionSetFromSelection` | 29952 | function |  | 5 |
| `deleteSelectionSet` | 29972 | function |  | 2 |
| `selectSelectionSet` | 29981 | function |  | 2 |
| `deleteSelectedStrands` | 29991 | function |  | 4 |
| `deleteGuide` | 29999 | function |  | 3 |
| `deleteSelectedGuide` | 30022 | function |  | 3 |
| `deleteSelectedReferenceImage` | 30026 | function |  | 4 |
| `hasDeletableSelection` | 30039 | function |  | 2 |
| `deleteCurrentSelection` | 30047 | function |  | 3 |
| `hideOutlinerContextMenu` | 30055 | function |  | 17 |
| `outlinerLockTargets` | 30060 | function |  | 3 |
| `showOutlinerContextMenu` | 30087 | function |  | 10 |
| `hideStrandRadialMenu` | 30167 | function |  | 4 |
| `ensureRadialButtonCapacity` | 30178 | function |  | 3 |
| `radialButtonDimensions` | 30191 | function |  | 4 |
| `radialMenuDimensionsForKind` | 30200 | function |  | 3 |
| `applyRadialMenuDimensions` | 30217 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 30223 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 30236 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 30257 | function |  | 2 |
| `selectionSetRadialMenuOption` | 30274 | function |  | 4 |
| `selectedMirrorRadialOptions` | 30283 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30305 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30323 | function |  | 2 |
| `contextualRadialOptions` | 30330 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30459 | function |  | 3 |
| `layoutContextualRadialOptions` | 30463 | function |  | 4 |
| `renderRadialActionList` | 30487 | function |  | 3 |
| `radialListOptionAtPointer` | 30505 | function |  | 3 |
| `syncRadialListHighlight` | 30527 | function |  | 3 |
| `configureContextualRadialMenu` | 30533 | function |  | 3 |
| `beginStrandRadialGesture` | 30593 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30627 | function |  | 2 |
| `updateStrandRadialGesture` | 30673 | function |  | 1 |
| `performStrandRadialAction` | 30712 | function |  | 2 |
| `finishStrandRadialGesture` | 30815 | function |  | 2 |
| `cancelStrandRadialGesture` | 30825 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30832 | function |  | 1 |
| `setPullMoveEnabled` | 30838 | function |  | 3 |
| `toolRadialOptions` | 30846 | function |  | 2 |
| `hideToolRadialMenu` | 30871 | function |  | 4 |
| `beginToolRadialGesture` | 30884 | function |  | 2 |
| `beginToolShortcutPress` | 30924 | function |  | 2 |
| `finishToolShortcutPress` | 30939 | function |  | 2 |
| `cancelToolShortcutPress` | 30948 | function |  | 5 |
| `setRadialMenusEnabled` | 30956 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30969 | function |  | 5 |
| `setNavigationTipsEnabled` | 30984 | function |  | 5 |
| `configureNavigationMouseButtons` | 30991 | function |  | 3 |
| `syncNavigationModifierLocks` | 31004 | function |  | 7 |
| `setNavigationStyle` | 31009 | function |  | 5 |
| `applyCameraSmoothingPreference` | 31025 | function |  | 4 |
| `setCameraSmoothingEnabled` | 31040 | function |  | 5 |
| `setCameraSmoothingStrength` | 31046 | function |  | 5 |
| `setScaleSensitivity` | 31054 | function |  | 3 |
| `setToolTipsEnabled` | 31062 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 31069 | function |  | 5 |
| `setViewportStatisticsEnabled` | 31078 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 31086 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 31101 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 31110 | function |  | 5 |
| `sideNamingDisplayId` | 31119 | function |  | 3 |
| `referenceViewDisplayLabel` | 31131 | function |  | 6 |
| `strandRegionDisplayLabel` | 31141 | function |  | 10 |
| `updateSideNamingLabels` | 31159 | function |  | 2 |
| `setSideNamingPerspective` | 31186 | function |  | 5 |
| `setControlPointDisplaySize` | 31195 | function |  | 6 |
| `scaleHexColor` | 31207 | function |  | 3 |
| `setViewportBackgroundColor` | 31212 | function |  | 7 |
| `setDefaultHairShader` | 31234 | function |  | 5 |
| `setPreferenceCategory` | 31240 | function |  | 4 |
| `openPreferencesDialog` | 31267 | function |  | 1 |
| `savePreferencesDialog` | 31295 | function |  | 1 |
| `cancelPreferencesDialog` | 31319 | function |  | 3 |
| `updateToolRadialGesture` | 31348 | function |  | 1 |
| `performToolRadialAction` | 31377 | function |  | 2 |
| `finishToolRadialGesture` | 31387 | function |  | 2 |
| `cancelToolRadialGesture` | 31396 | function |  | 5 |
| `duplicatePlacementTarget` | 31403 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31430 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31434 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31444 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31449 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31461 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31472 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31480 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31497 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31518 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31529 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31535 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31541 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31574 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31729 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31831 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31872 | function |  | 2 |
| `updateDuplicatePlacement` | 31899 | function |  | 2 |
| `beginDuplicatePlacement` | 31963 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 32027 | function |  | 2 |
| `confirmDuplicatePlacement` | 32068 | function |  | 1 |
| `cancelDuplicatePlacement` | 32105 | function |  | 4 |
| `outlinerClumpLocks` | 32131 | function |  | 11 |
| `handleOutlinerClumpDrop` | 32135 | function |  | 3 |
| `createOutlinerStrandButton` | 32158 | function |  | 4 |
| `createOutlinerCurveSurface` | 32244 | function |  | 2 |
| `createOutlinerClump` | 32340 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32422 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32429 | function |  | 2 |
| `renderLockList` | 32508 | function |  | 70 |
| `updateCount` | 32662 | function |  | 34 |
| `captureInputUndo` | 32671 | function |  | 1 |
| `bindUndoCapture` | 32677 | function |  | 36 |
| `bindLockInput` | 32688 | function |  | 2 |
| `applyValue` | 32705 | arrow |  | 2 |
| `applyUniformTransformScale` | 33024 | function |  | 2 |
| `applyReducedTransformScale` | 33041 | function |  | 2 |
| `applyTransformPrecision` | 33080 | function |  | 2 |
| `updateTransformScalePointer` | 33109 | function |  | 1 |
| `finishSweepProfileDrag` | 33340 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33436 | function |  | 3 |
| `finishTaperCurveDrag` | 33498 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33541 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33622 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33677 | function |  | 6 |
| `updateSelectedTaperPoint` | 33701 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 34275 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 34280 | function |  | 4 |
| `syncDrawCurlControls` | 34335 | function |  | 5 |
| `handleLiveSurfaceChange` | 34383 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34465 | function |  | 3 |
| `resampleSurfaceLock` | 34480 | function |  | 2 |
| `changePanelSplitCount` | 34593 | function |  | 3 |
| `presetNumber` | 34697 | function |  | 23 |
| `clonePresetShape` | 34702 | function |  | 7 |
| `creationPresetSnapshot` | 34711 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34759 | function |  | 5 |
| `applyPresetControl` | 34786 | function |  | 2 |
| `applyCreationToolSettings` | 34807 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34848 | function |  | 3 |
| `loadCustomCreationPresets` | 34855 | function |  | 2 |
| `saveCustomCreationPresets` | 34865 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34873 | function |  | 2 |
| `populateCreationPresetSelect` | 34909 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34933 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34966 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34971 | function |  | 2 |
| `applyCustomCreationPreset` | 34988 | function |  | 3 |
| `createCustomCreationPreset` | 35012 | function |  | 3 |
| `createCustomClumpPreset` | 35027 | function |  | 3 |
| `commitCustomCreationPreset` | 35042 | function |  | 2 |
| `openRemoveCreationPreset` | 35103 | function |  | 3 |
| `commitRemoveCreationPreset` | 35116 | function |  | 1 |
| `applyBraidToolPreset` | 35133 | function |  | 2 |
| `initPanelResizeHandles` | 35332 | function |  | 2 |
| `applyWidth` | 35338 | arrow |  | 2 |
| `restoreWidth` | 35345 | arrow |  | 2 |
| `bindResize` | 35353 | arrow |  | 2 |
| `onMove` | 35361 | arrow |  | 0 |
| `onUp` | 35365 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35382 | function |  | 2 |
| `initFloatingPanelControls` | 35391 | function |  | 2 |
| `detach` | 35400 | arrow |  | 43 |
| `endDrag` | 35438 | arrow |  | 0 |
| `endResize` | 35470 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35481 | function |  | 3 |
| `selectPatchNotesVersion` | 35615 | function |  | 3 |
| `requestReferenceImage` | 35648 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35852 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35858 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35865 | function |  | 1 |
| `deleteLocks` | 36432 | function |  | 10 |
| `disposeCurveObjects` | 36510 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36562 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36593 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36668 | function |  | 2 |
| `buildHairObj` | 36700 | function |  | 3 |
| `exportHairObj` | 36750 | function |  | 1 |
| `bufferAttributeTuples` | 36754 | function |  | 6 |
| `buildHairUsda` | 36761 | function |  | 3 |
| `exportHairUsda` | 36820 | function |  | 1 |
| `writeExportThroughFileSystem` | 36824 | function |  | 3 |
| `exportHairProjectQuickly` | 36845 | function |  | 2 |
| `resize` | 36897 | function |  | 4 |
| `handleViewportPointerMove` | 36908 | function |  | 1 |
| `blockProportionalSizingEvent` | 36919 | function |  | 1 |
| `updateLightAngleFromInputs` | 36925 | function |  | 2 |
| `startViewSnap` | 36939 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36969 | function |  | 3 |
| `trackViewportPointerDown` | 36986 | function |  | 1 |
| `trackViewportPointerMove` | 37002 | function |  | 1 |
| `clearViewportPointer` | 37010 | function |  | 1 |
| `updateViewSnap` | 37015 | function |  | 1 |
| `nearestCardinalAxis` | 37051 | function |  | 5 |
| `cardinalAxisKey` | 37065 | function |  | 5 |
| `steppedDragAmount` | 37069 | function |  | 3 |
| `snapCameraToCardinalAxis` | 37075 | function |  | 4 |
| `endViewSnap` | 37091 | function |  | 4 |
| `activateStrandControlPoint` | 37101 | function |  | 4 |
| `refreshStrandControlPointSelection` | 37151 | function |  | 4 |
| `addStrandControlPointSelection` | 37178 | function |  | 3 |
| `removeStrandControlPointSelection` | 37195 | function |  | 3 |
| `sampleStrandPointNormal` | 37209 | function |  | 2 |
| `sampleStrandPointVectors` | 37219 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 37225 | function |  | 2 |
| `resampleStrandCurveData` | 37236 | function |  | 4 |
| `resampleMatchingVectors` | 37242 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 37281 | function |  | 4 |
| `removeStrandCurvePoint` | 37292 | function |  | 2 |
| `closestStrandCurveParameter` | 37305 | function |  | 2 |
| `insertStrandCurvePoint` | 37334 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 37351 | function |  | 2 |
| `selectionModifierCursorAvailable` | 37361 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 37377 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 37384 | function |  | 4 |
| `prepareCurvePointSelection` | 37406 | function |  | 1 |
| `finishCurvePointInsertion` | 37517 | function |  | 1 |
| `finishPointRemoval` | 37532 | function |  | 1 |
| `editableStrandWidth` | 37550 | function |  | 6 |
| `editableStrandWidthBounds` | 37562 | function |  | 2 |
| `applyEditableStrandWidth` | 37568 | function |  | 3 |
| `viewportPixelPoint` | 37604 | function |  | 3 |
| `syncSculptBrushControls` | 37612 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37627 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37635 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37643 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37649 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37653 | function |  | 7 |
| `updateSculptBrushCursor` | 37660 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37682 | function |  | 4 |
| `sculptBrushEditableLock` | 37689 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37699 | function |  | 5 |
| `sculptBrushLockViable` | 37705 | function |  | 5 |
| `sculptBrushUnits` | 37716 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37755 | function |  | 4 |
| `sculptBrushPointWeight` | 37805 | function |  | 5 |
| `sculptBrushWorldDelta` | 37815 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37824 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37850 | function |  | 2 |
| `beginSculptMoveStroke` | 37908 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37970 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 38205 | function |  | 3 |
| `updateSculptMoveStroke` | 38214 | function |  | 1 |
| `finishSculptMoveStroke` | 38230 | function |  | 3 |
| `strandControlPointHit` | 38278 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 38282 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 38360 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 38394 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 38434 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 38447 | function |  | 1 |
| `setHoveredControlPoint` | 38487 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38500 | function |  | 2 |
| `updateControlPointHover` | 38536 | function |  | 1 |
| `animate` | 39093 | function |  | 2 |
| `syncCompactSidebarLayout` | 39126 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 39145 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 39151 | function |  | 3 |
| `setAttributeEditorTab` | 39157 | function |  | 6 |

## modules/anime-hair-shaders.js（286 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeHairShader` | 5 | function | export | 1 |
| `normalizedHexColor` | 52 | function |  | 6 |
| `normalizeAnimeAnisotropicSettings` | 56 | function | export | 1 |

## modules/app-config.js（92 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/branch-connect.js（163 行）

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

## modules/capsule-curve.js（215 行）

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

## modules/clump-brush-presets.js（144 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneJsonValue` | 1 | arrow |  | 4 |
| `finitePoint` | 46 | function |  | 1 |
| `normalizePoints` | 53 | function |  | 2 |
| `normalizeStrand` | 62 | function |  | 1 |
| `normalizeClumpBrushTemplate` | 82 | function | export | 2 |
| `createClumpBrushTemplate` | 107 | function | export | 1 |

## modules/compound-strand.js（131 行）

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

## modules/curve-lattice.js（102 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `flatCurveLatticePointData` | 11 | function | export | 1 |
| `interpolatePoint` | 37 | function |  | 5 |
| `resampleCurveLatticePointData` | 45 | function | export | 1 |
| `resampleCurveLatticeLineData` | 79 | function | export | 1 |
| `curveLatticeLoopPointIndices` | 90 | function | export | 1 |

## modules/curve-math.js（1163 行）

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

## modules/curve-surface.js（313 行）

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

## modules/file-actions.js（47 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `fileActionFormat` | 19 | function | export | 3 |
| `cleanFileBaseName` | 23 | function | export | 2 |
| `fileNameForAction` | 35 | function | export | 1 |
| `normalizeExportContents` | 40 | function | export | 1 |

## modules/file-drop.js（7 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `applicationDropFileKind` | 1 | function | export | 1 |

## modules/history.js（45 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/localization.js（1474 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeLanguage` | 1337 | function | export | 3 |
| `translateUiString` | 1343 | function | export | 6 |
| `createDocumentLocalizer` | 1378 | function | export | 1 |
| `localizeTextNode` | 1385 | function |  | 4 |
| `localizeElement` | 1402 | function |  | 4 |
| `localizeSubtree` | 1421 | function |  | 2 |
| `setLanguage` | 1445 | function |  | 2 |

## modules/material-state.js（49 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeHairMaterialDefinition` | 22 | function | export | 2 |
| `resolveHairMaterialDefinition` | 34 | function | export | 2 |
| `hairMaterialUsageCounts` | 40 | function | export | 1 |

## modules/mirror-selection.js（21 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `mirrorSelectionTargets` | 1 | function | export | 1 |

## modules/multi-edit.js（10 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `relativeEditValue` | 1 | function | export | 1 |

## modules/obj-export.js（77 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `orderedFanBoundary` | 1 | function | export | 2 |
| `hairFaceIndices` | 14 | function | export | 2 |
| `exportHairFaces` | 58 | function | export | 1 |
| `faceVertex` | 60 | arrow |  | 0 |
| `exportCurvePolyline` | 68 | function | export | 1 |

## modules/obj-import.js（11 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `polygonOnlyObjSource` | 1 | function | export | 1 |

## modules/poly-topology.js（340 行）

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

## modules/preference-storage.js（33 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `readStoredPreference` | 1 | function | export | 2 |
| `readStoredBooleanPreference` | 14 | function | export | 1 |
| `writeStoredPreference` | 25 | function | export | 1 |

## modules/preferences-backup.js（73 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPreferencesBackup` | 4 | function | export | 1 |
| `normalizePreferencesBackup` | 29 | function | export | 1 |
| `preferencesBackupFileName` | 66 | function | export | 1 |

## modules/procedural-draw.js（107 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `proceduralAccessoryTaperScale` | 3 | function | export | 1 |
| `proceduralAccessoryTemplateData` | 24 | function | export | 1 |
| `longitudinalPoints` | 30 | arrow |  | 2 |
| `proceduralBranchTemplateData` | 52 | function | export | 1 |

## modules/project-schema.js（51 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `projectFileName` | 4 | function | export | 1 |
| `validateHairProject` | 9 | function | export | 1 |
| `createHairProject` | 19 | function | export | 1 |

## modules/project-state.js（89 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneOptionalRecord` | 1 | function |  | 7 |
| `createProjectSelectionSnapshot` | 5 | function | export | 1 |
| `projectSnapshotLocks` | 35 | function | export | 1 |
| `createProjectRestorePlan` | 43 | function | export | 1 |

## modules/radial-layout.js（169 行）

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

## modules/recent-projects.js（109 行）

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

## modules/sculpt-brush.js（123 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `sculptBrushWeight` | 1 | function | export | 1 |
| `smoothSculptPointDeltas` | 13 | function | export | 1 |
| `proportionalSculptWeights` | 40 | function | export | 1 |
| `cameraFacingPlaneNormal` | 69 | function | export | 2 |
| `inflateSculptPointScale` | 82 | function | export | 1 |
| `pointInCameraFacingHalfSpace` | 97 | function | export | 1 |
| `smoothSculptTwistDeltas` | 105 | function | export | 1 |

## modules/selection-sets.js（55 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `uniqueStrandIds` | 1 | function |  | 5 |
| `nextSelectionSetName` | 8 | function | export | 2 |
| `normalizeSelectionSets` | 15 | function | export | 1 |
| `createSelectionSetRecord` | 32 | function | export | 1 |
| `updateSelectionSetMembers` | 42 | function | export | 1 |

## modules/selection-state.js（125 行）

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

## modules/shape-presets.js（56 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `emptyShapePresetLibrary` | 3 | function | export | 2 |
| `normalizedPoints` | 7 | function |  | 3 |
| `normalizeShapePresetLibrary` | 23 | function | export | 1 |
| `removeShapePreset` | 47 | function | export | 1 |

## modules/shortcut-registry.js（54 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `shortcutToolForKey` | 34 | function | export | 1 |
| `workspaceForShortcutKey` | 38 | function | export | 1 |
| `focusedControlShouldYieldToShortcut` | 42 | function | export | 1 |

## modules/strand-constraints.js（120 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 3 |
| `solvePulledStrand` | 5 | function | export | 1 |

## modules/surface-lattice.js（236 行）

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

## modules/tool-presets.js（45 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `emptyToolPresetLibrary` | 3 | function | export | 2 |
| `normalizeToolPresetLibrary` | 7 | function | export | 1 |
| `removeToolPreset` | 36 | function | export | 1 |

## modules/topology.js（21 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `parseObjFaceVertexCounts` | 1 | function | export | 1 |
| `fanTriangleEdgeMasks` | 10 | function | export | 1 |

## modules/usda-export.js（162 行）

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

## modules/uv-inspector.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `uvCoordinateBounds` | 1 | function | export | 1 |
| `uvViewTransform` | 23 | function | export | 1 |
