# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1729** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38692 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 256 | function |  | 3 |
| `saveBooleanPreference` | 284 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 288 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 293 | function |  | 2 |
| `normalizeScaleSensitivity` | 298 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 303 | function |  | 2 |
| `normalizeSideNamingPerspective` | 308 | function |  | 2 |
| `normalizeNavigationStyle` | 312 | function |  | 2 |
| `setupEditableSliderControls` | 327 | function |  | 2 |
| `syncNumberFromRange` | 378 | arrow |  | 0 |
| `applyNumberValue` | 385 | arrow |  | 0 |
| `copyCameraPose` | 491 | function |  | 3 |
| `updateCameraProjectionForViewport` | 497 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 510 | function |  | 3 |
| `setOrthographicView` | 516 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 556 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 585 | function |  | 2 |
| `removeRotateFreeAxisRing` | 611 | function |  | 2 |
| `deflateTransformGizmoPickers` | 623 | function |  | 2 |
| `nextStrandName` | 1005 | function |  | 2 |
| `activeDrawClumpTemplate` | 1090 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1095 | function |  | 3 |
| `drawModeCreatesClump` | 1122 | function |  | 1 |
| `isPanelGeometry` | 1266 | function |  | 31 |
| `normalizePanelSplits` | 1270 | function |  | 3 |
| `clonePanelSplits` | 1282 | function |  | 19 |
| `snapPanelSplitHeight` | 1286 | function |  | 5 |
| `createQuadSphereGeometry` | 1321 | function |  | 2 |
| `vertexIndex` | 1335 | function |  | 11 |
| `addEdge` | 1353 | function |  | 5 |
| `createAuthoredScalpGeometry` | 1388 | function |  | 2 |
| `buildDefaultScalpRegionAssignments` | 1458 | function |  | 3 |
| `updateScalpRenderGeometry` | 1484 | function |  | 4 |
| `writeScalpRegionColors` | 1535 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1548 | function |  | 2 |
| `createScalpSelectionOutline` | 1578 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1620 | function |  | 25 |
| `activeScalpSurfaceWire` | 1625 | function |  | 2 |
| `activeScalpSelectionOutline` | 1630 | function |  | 2 |
| `inferredCustomScalpRegion` | 1635 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1642 | function |  | 5 |
| `customScalpGeometryFromObject` | 1661 | function |  | 2 |
| `customScalpWireGeometry` | 1693 | function |  | 3 |
| `installCustomScalpGeometry` | 1704 | function |  | 3 |
| `installCustomScalpGuide` | 1728 | function |  | 3 |
| `setScalpGuideSource` | 1746 | function |  | 7 |
| `updateScalpQuadWire` | 1762 | function |  | 4 |
| `updateScalpTopology` | 1778 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1842 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2022 | function |  | 2 |
| `currentStrandSelectionState` | 2087 | function |  | 4 |
| `applyStrandSelectionState` | 2091 | function |  | 5 |
| `clearStrandSelectionState` | 2096 | function |  | 7 |
| `guideHeadBounds` | 3146 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3156 | function |  | 5 |
| `disposeGuideModel` | 3170 | function |  | 3 |
| `syncHeadTransformInputs` | 3181 | function |  | 4 |
| `applyHeadTransform` | 3188 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3206 | function |  | 4 |
| `applyScalpRoughScale` | 3215 | function |  | 5 |
| `resetHeadTransform` | 3229 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3243 | function |  | 2 |
| `installGuideModel` | 3259 | function |  | 5 |
| `loadDefaultGuideModel` | 3335 | function |  | 3 |
| `braidTemplateFromEntries` | 3358 | function |  | 4 |
| `braidMeshEntries` | 3390 | function |  | 2 |
| `prepareBraidBodyCache` | 3402 | function |  | 2 |
| `quantize` | 3411 | arrow |  | 21 |
| `sourceNormalAt` | 3423 | arrow |  | 1 |
| `clusterBoundary` | 3426 | arrow |  | 2 |
| `normalBuckets` | 3443 | arrow |  | 2 |
| `applyBucketPair` | 3475 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3506 | function |  | 2 |
| `annotateBraidObjTopology` | 3527 | function |  | 2 |
| `loadBraidMeshPreset` | 3547 | function |  | 3 |
| `createSplitControlHandle` | 3564 | function |  | 4 |
| `frameGuideModel` | 3579 | function |  | 2 |
| `syncScalpInputs` | 3604 | function |  | 2 |
| `syncScalpArtistInputs` | 3610 | function |  | 2 |
| `rootScalpOffsetDistance` | 3618 | function |  | 15 |
| `applyLockRootScalpOffset` | 3623 | function |  | 5 |
| `normalizeHairLayer` | 3639 | function |  | 28 |
| `layerOffsetForLock` | 3643 | function |  | 9 |
| `layerRootOffsetFactor` | 3648 | function |  | 13 |
| `layerOffsetWeight` | 3652 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3658 | function |  | 5 |
| `pointsWithLayerOffset` | 3667 | function |  | 3 |
| `layerDirectionForLock` | 3675 | function |  | 2 |
| `applyLayerOffset` | 3686 | function |  | 5 |
| `setLockHairLayer` | 3710 | function |  | 2 |
| `setGroupLayerOffset` | 3725 | function |  | 2 |
| `scalpArtistWeight` | 3737 | function |  | 3 |
| `scalpArtistScalesAt` | 3741 | function |  | 3 |
| `applyScalpArtistShape` | 3751 | function |  | 5 |
| `inverseScalpArtistShape` | 3769 | function |  | 2 |
| `updateScalpSurface` | 3796 | function |  | 3 |
| `setActiveScalpRegion` | 3806 | function |  | 2 |
| `clearScalpRegions` | 3818 | function |  | 2 |
| `scalpHitFromEvent` | 3835 | function |  | 3 |
| `updateScalpBrushCursor` | 3843 | function |  | 4 |
| `paintScalpAt` | 3858 | function |  | 3 |
| `beginScalpPaint` | 3925 | function |  | 2 |
| `updateScalpPaint` | 3934 | function |  | 1 |
| `endScalpPaint` | 3943 | function |  | 2 |
| `createScalpLattice` | 3950 | function |  | 2 |
| `resetScalpLattice` | 3975 | function |  | 1 |
| `updateScalpLatticeObjects` | 3987 | function |  | 7 |
| `quadraticWeights` | 4001 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4006 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4033 | function |  | 3 |
| `selectScalpLatticePoint` | 4048 | function |  | 2 |
| `beginScalpLatticeDrag` | 4063 | function |  | 2 |
| `updateScalpLatticeDrag` | 4081 | function |  | 1 |
| `endScalpLatticeDrag` | 4099 | function |  | 2 |
| `setHeadReferenceTransparency` | 4105 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4115 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4133 | function |  | 3 |
| `trianglePlaneIntersections` | 4141 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4162 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4188 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4198 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4210 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4234 | function |  | 3 |
| `createScalpBuilderPlanes` | 4249 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4281 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4319 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4342 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4354 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4366 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4371 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4383 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4493 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4518 | function |  | 5 |
| `syncEditedScalpSurface` | 4533 | function |  | 4 |
| `ensureEditedScalpSurface` | 4604 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4634 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4719 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4732 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4748 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4758 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4776 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4789 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4796 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4815 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4829 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4870 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4879 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4892 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4913 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5050 | function |  | 2 |
| `scalpTemplateNeighbors` | 5058 | function |  | 2 |
| `smoothScalpVectorField` | 5070 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5084 | function |  | 2 |
| `upperContourCurve` | 5101 | function |  | 4 |
| `hermitePoint` | 5136 | function |  | 2 |
| `curveNetworkSection` | 5147 | function |  | 3 |
| `pointAlongSection` | 5176 | function |  | 3 |
| `longestStitchedContour` | 5182 | function |  | 2 |
| `nodeForPoint` | 5190 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5247 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5257 | function |  | 1 |
| `orderedRange` | 5269 | arrow |  | 3 |
| `clipSegment` | 5292 | arrow |  | 1 |
| `liftedPoint` | 5315 | arrow |  | 5 |
| `boundaryCorner` | 5320 | arrow |  | 4 |
| `surfaceCurveBetween` | 5329 | arrow |  | 1 |
| `addSurfaceConnector` | 5352 | arrow |  | 2 |
| `sideContourAtDepth` | 5420 | arrow |  | 3 |
| `addSurfacePatch` | 5454 | arrow |  | 1 |
| `addCenterBridgePatch` | 5534 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5642 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5677 | function |  | 1 |
| `generatedScalpObjContent` | 5767 | function |  | 2 |
| `generateScalpFromBuilder` | 5781 | function |  | 1 |
| `orderedDepthRange` | 5817 | arrow |  | 7 |
| `resetScalpBuilder` | 5946 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5961 | function |  | 1 |
| `beginScalpBuilderInput` | 5975 | function |  | 2 |
| `updateScalpBuilderStroke` | 5976 | function |  | 1 |
| `finishScalpBuilderStroke` | 5977 | function |  | 2 |
| `setScalpBuilderEditing` | 5979 | function |  | 10 |
| `updateScalpEditingVisibility` | 6013 | function |  | 12 |
| `exitSetupEditors` | 6107 | function |  | 7 |
| `setCapsuleGuideEditing` | 6116 | function |  | 5 |
| `syncAppMenuVisibility` | 6144 | function |  | 3 |
| `closeAppMenus` | 6149 | function |  | 6 |
| `setAppMenuOpen` | 6160 | function |  | 3 |
| `setTurntableActive` | 6167 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6176 | function |  | 9 |
| `selectedReferenceImage` | 6180 | function |  | 20 |
| `normalizeReferenceCrop` | 6186 | function |  | 8 |
| `referenceCropIsFull` | 6194 | function |  | 3 |
| `referencePlaneFrontAxis` | 6199 | function |  | 4 |
| `referencePlanePlacement` | 6208 | function |  | 4 |
| `migratedReferencePlanePosition` | 6223 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6243 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6260 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6276 | function |  | 2 |
| `snappedReferenceImageView` | 6299 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6305 | function |  | 5 |
| `applyReferenceImageRuntime` | 6321 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6364 | function |  | 6 |
| `createReferenceImageRuntime` | 6372 | function |  | 3 |
| `addReferenceImage` | 6441 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6493 | function |  | 3 |
| `disposeReferenceImage` | 6512 | function |  | 2 |
| `clearReferenceImages` | 6516 | function |  | 2 |
| `serializeReferenceImage` | 6523 | function |  | 1 |
| `setReferenceImageType` | 6551 | function |  | 2 |
| `attachReferenceImageTransform` | 6595 | function |  | 6 |
| `selectReferenceImage` | 6609 | function |  | 12 |
| `placeReferencePlane` | 6632 | function |  | 2 |
| `setReferencePlaneInFront` | 6643 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6653 | function |  | 4 |
| `renderReferenceImagePanel` | 6672 | function |  | 20 |
| `setOutlinerTab` | 6719 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6737 | function |  | 4 |
| `componentEditModeActive` | 6741 | function |  | 38 |
| `selectionToolSupportsPicking` | 6745 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6750 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6766 | function |  | 2 |
| `setViewportSelectionMode` | 6796 | function |  | 4 |
| `setViewportEditMode` | 6808 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6850 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6864 | function |  | 8 |
| `outlinerGuides` | 6876 | function |  | 3 |
| `guideOutlinerLabel` | 6883 | function |  | 2 |
| `normalizeOutlinerName` | 6893 | function |  | 4 |
| `beginOutlinerRename` | 6898 | function |  | 2 |
| `finish` | 6909 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6939 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6949 | function |  | 2 |
| `renderGuideOutliner` | 6984 | function |  | 10 |
| `referenceOutlinerGroup` | 7042 | function |  | 2 |
| `renderReferenceOutliner` | 7046 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7163 | function |  | 5 |
| `readReferenceImageFile` | 7168 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7192 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7199 | function |  | 3 |
| `dragContainsReferenceImage` | 7244 | function |  | 3 |
| `setReferenceImageDragActive` | 7255 | function |  | 9 |
| `referenceDropDestination` | 7263 | function |  | 2 |
| `viewportOverlayDropPosition` | 7269 | function |  | 2 |
| `setReferenceDropHover` | 7278 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7296 | function |  | 2 |
| `referenceOverlayAtPointer` | 7316 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7334 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7347 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7393 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7443 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7465 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7476 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7502 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7511 | function |  | 2 |
| `referenceCropCursor` | 7526 | function |  | 3 |
| `updateReferenceCropHandles` | 7532 | function |  | 5 |
| `referenceCropSourcePoint` | 7553 | function |  | 2 |
| `beginReferenceCrop` | 7560 | function |  | 1 |
| `updateReferenceCrop` | 7598 | function |  | 1 |
| `finishReferenceCrop` | 7630 | function |  | 4 |
| `setHeadSetupEditing` | 7648 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7664 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7673 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7683 | function |  | 4 |
| `setScalpGuideVisibility` | 7689 | function |  | 12 |
| `currentGuideViewMode` | 7697 | function |  | 3 |
| `updateGuideViewToggle` | 7705 | function |  | 5 |
| `setGuideViewMode` | 7721 | function |  | 3 |
| `cycleGuideViewMode` | 7732 | function |  | 1 |
| `hideGuideViewContextMenu` | 7737 | function |  | 6 |
| `showGuideViewContextMenu` | 7741 | function |  | 1 |
| `strandPassesDisplayFilters` | 7754 | function |  | 4 |
| `strandVisibleForDisplay` | 7763 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7768 | function |  | 2 |
| `lockedStrandsExist` | 7772 | function |  | 3 |
| `hiddenStrandsExist` | 7776 | function |  | 2 |
| `hideSelectedStrands` | 7780 | function |  | 2 |
| `unhideHiddenStrands` | 7790 | function |  | 2 |
| `strandIsolationActive` | 7799 | function |  | 7 |
| `setStrandIsolation` | 7803 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7815 | function |  | 3 |
| `syncVisibilityParent` | 7826 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7833 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7862 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7869 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7889 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7912 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7920 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7927 | function |  | 9 |
| `setScalpLatticeEditing` | 7938 | function |  | 4 |
| `setScalpShapeEditing` | 7953 | function |  | 9 |
| `setScalpPaintEditing` | 7971 | function |  | 7 |
| `defaultCurveLatticePoints` | 7995 | function |  | 3 |
| `flatCurveLatticePoints` | 8021 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8030 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8054 | function |  | 4 |
| `horizontalValue` | 8059 | arrow |  | 1 |
| `blendedSample` | 8070 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8103 | function |  | 2 |
| `curveLatticeControlPoint` | 8118 | function |  | 9 |
| `circularArcTangent` | 8122 | function |  | 4 |
| `arcLengthTo` | 8153 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8165 | function |  | 3 |
| `sampleHermiteCurve` | 8204 | function |  | 10 |
| `sampleCurveLattice` | 8221 | function |  | 6 |
| `curveLatticeNormal` | 8240 | function |  | 1 |
| `createCurveLatticeGeometry` | 8251 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8280 | function |  | 3 |
| `appendCurve` | 8282 | arrow |  | 4 |
| `sample` | 8284 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8311 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8327 | function |  | 3 |
| `addPicker` | 8329 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8368 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8381 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8385 | function |  | 3 |
| `curveLatticeEditablePoint` | 8403 | function |  | 13 |
| `curveLatticePointSection` | 8410 | function |  | 3 |
| `curveLatticeRestPoint` | 8421 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8427 | function |  | 7 |
| `curveLatticeRootColumns` | 8433 | function |  | 3 |
| `curveTangentsForPoints` | 8440 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8452 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8489 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8515 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8532 | function |  | 3 |
| `resampleGrid` | 8542 | arrow |  | 2 |
| `controlPointIsSelected` | 8569 | function |  | 7 |
| `clearMultiPointSelection` | 8577 | function |  | 9 |
| `createCurveLatticeHandles` | 8581 | function |  | 4 |
| `addCurveLattice` | 8603 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8712 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8743 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8749 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8788 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8809 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8826 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8835 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8842 | function |  | 1 |
| `selectCurveLatticeLoop` | 8861 | function |  | 3 |
| `selectCurveLatticePoint` | 8890 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8905 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8947 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8968 | function |  | 3 |
| `curveLatticeColumnPoints` | 9011 | function |  | 3 |
| `groupCurveControlIndices` | 9020 | function |  | 4 |
| `groupCurveControlPoints` | 9026 | function |  | 2 |
| `updateGroupCurveDisplay` | 9032 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9042 | function |  | 2 |
| `groupCurveDeformationPairs` | 9064 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9071 | function |  | 2 |
| `appendPairs` | 9073 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9084 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9103 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9124 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9143 | function |  | 2 |
| `capsuleGuideCapHeight` | 9177 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9181 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9186 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9190 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9202 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9218 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9224 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9250 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9280 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9334 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9355 | function |  | 7 |
| `vertex` | 9369 | function |  | 4 |
| `addFace` | 9375 | function |  | 3 |
| `addRing` | 9393 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9448 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9458 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9523 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9569 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9582 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9603 | function |  | 3 |
| `capsuleGuidePointDistances` | 9608 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9629 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9649 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9654 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9660 | function |  | 3 |
| `capsuleGuideAccentColor` | 9665 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9670 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9681 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9693 | function |  | 2 |
| `createCapsuleGuideHandles` | 9725 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9748 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9767 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9774 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9790 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9807 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9822 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9859 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9875 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9892 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9898 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9925 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9937 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9956 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10001 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10036 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10050 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10056 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10073 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10084 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10095 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10125 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10135 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10176 | function |  | 3 |
| `createQuadCageGeometry` | 10192 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10216 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10236 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10247 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10300 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10338 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10348 | function |  | 4 |
| `addCapsuleGuide` | 10356 | function |  | 4 |
| `addGuide` | 10425 | function |  | 1 |
| `createGuideGeometry` | 10486 | function |  | 4 |
| `selectGuide` | 10541 | function |  | 17 |
| `updateGuideControlsVisibility` | 10609 | function |  | 10 |
| `updateViewportToolVisibility` | 10626 | function |  | 7 |
| `getSelectedGuide` | 10665 | function |  | 34 |
| `selectedViewportFocusBounds` | 10669 | function |  | 2 |
| `frameViewportBounds` | 10683 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10713 | function |  | 2 |
| `fullSceneFocusBounds` | 10717 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10733 | function |  | 3 |
| `cycleViewportFraming` | 10742 | function |  | 2 |
| `syncGuideInputs` | 10760 | function |  | 5 |
| `updateGuideGeometry` | 10803 | function |  | 3 |
| `sculptBrushToolActive` | 10824 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10828 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10832 | function |  | 3 |
| `effectiveSculptBrushTool` | 10836 | function |  | 13 |
| `updateSculptScaleModeRow` | 10842 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10847 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10869 | function |  | 5 |
| `setActiveTool` | 10878 | function |  | 19 |
| `setDrawStrandMode` | 11016 | function |  | 2 |
| `setObjectSpaceEditing` | 11026 | function |  | 7 |
| `setHierarchyEditing` | 11042 | function |  | 4 |
| `setProportionalEditing` | 11054 | function |  | 5 |
| `beginProportionalSizeEdit` | 11073 | function |  | 3 |
| `updateProportionalSizeEdit` | 11085 | function |  | 2 |
| `endProportionalSizeEdit` | 11096 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11103 | function |  | 2 |
| `refreshProportionalPreview` | 11111 | function |  | 4 |
| `activeBrushSizeInput` | 11121 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11130 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11142 | function |  | 2 |
| `beginBrushSizeDrag` | 11160 | function |  | 1 |
| `updateBrushSizeDrag` | 11187 | function |  | 1 |
| `finishBrushSizeDrag` | 11208 | function |  | 2 |
| `updateInteractionLocks` | 11225 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11234 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11243 | function |  | 2 |
| `configureTransformControls` | 11274 | function |  | 16 |
| `pullMoveActive` | 11282 | function |  | 9 |
| `updatePullGuideVisual` | 11286 | function |  | 4 |
| `attachTransformForCurvePoint` | 11302 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11326 | function |  | 7 |
| `strandObjectRootIndex` | 11342 | function |  | 3 |
| `strandObjectRoot` | 11351 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11355 | function |  | 2 |
| `attachStrandObjectTransform` | 11360 | function |  | 6 |
| `guideObjectPivot` | 11383 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11394 | function |  | 2 |
| `attachGuideObjectTransform` | 11399 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11418 | function |  | 2 |
| `beginGuideObjectTransform` | 11446 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11453 | function |  | 2 |
| `updateGuideObjectTransform` | 11475 | function |  | 2 |
| `finishGuideObjectTransform` | 11508 | function |  | 2 |
| `clonePlacementFrame` | 11517 | function |  | 2 |
| `cloneOptionalVectors` | 11529 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11533 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11550 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11565 | function |  | 2 |
| `strandObjectTransformOperators` | 11581 | function |  | 4 |
| `transformPoint` | 11589 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11596 | arrow |  | 0 |
| `transformNormal` | 11602 | arrow |  | 10 |
| `transformDirection` | 11612 | arrow |  | 7 |
| `worldMatrixForPivot` | 11624 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11630 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11646 | function |  | 6 |
| `beginStrandObjectTransform` | 11660 | function |  | 2 |
| `updateStrandObjectTransform` | 11698 | function |  | 2 |
| `commitStrandObjectTransform` | 11747 | function |  | 2 |
| `mapPoints` | 11760 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11794 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11808 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11831 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11844 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11859 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11885 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11934 | function |  | 2 |
| `beginHandleEdit` | 11943 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11992 | function |  | 3 |
| `applyBranchRigidRootMove` | 12009 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12046 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12057 | function |  | 3 |
| `multiPointHandleEditActive` | 12068 | function |  | 7 |
| `applyMultiMove` | 12072 | function |  | 5 |
| `applyMultiRotate` | 12078 | function |  | 2 |
| `applyMultiScale` | 12087 | function |  | 2 |
| `applyHierarchicalMove` | 12096 | function |  | 3 |
| `applySingleMove` | 12108 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12112 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12129 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12138 | function |  | 3 |
| `changed` | 12148 | arrow |  | 1 |
| `applyPullMove` | 12190 | function |  | 3 |
| `pullHeadCollisionContext` | 12198 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12217 | function |  | 2 |
| `applyProportionalMove` | 12240 | function |  | 3 |
| `viewPlaneNormal` | 12251 | function |  | 20 |
| `isCameraInSnappedView` | 12255 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12263 | function |  | 10 |
| `updateViewPlaneGrid` | 12267 | function |  | 14 |
| `setViewPlaneMove` | 12324 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12335 | function |  | 2 |
| `rayFromViewportEvent` | 12343 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12351 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12361 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12372 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12385 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12404 | function |  | 4 |
| `beginViewPlaneMove` | 12411 | function |  | 3 |
| `updateViewPlaneMove` | 12475 | function |  | 1 |
| `endViewPlaneMove` | 12540 | function |  | 7 |
| `applyHierarchicalRotate` | 12559 | function |  | 2 |
| `rotateGuideNormal` | 12566 | arrow |  | 4 |
| `applySingleRotate` | 12604 | function |  | 2 |
| `applyProportionalRotate` | 12608 | function |  | 2 |
| `applyHierarchicalScale` | 12628 | function |  | 2 |
| `applySingleScale` | 12638 | function |  | 2 |
| `applyProportionalScale` | 12642 | function |  | 2 |
| `setPointScale` | 12658 | function |  | 8 |
| `proportionalWeight` | 12667 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12679 | function |  | 5 |
| `strandInfluenceColor` | 12685 | function |  | 17 |
| `beginRelaxEdit` | 12710 | function |  | 3 |
| `updateRelaxEdit` | 12739 | function |  | 1 |
| `endRelaxEdit` | 12799 | function |  | 1 |
| `disposeGuide` | 12809 | function |  | 3 |
| `removeGuideObjects` | 12837 | function |  | 3 |
| `strandRadiusAt` | 12851 | function |  | 5 |
| `strandProfileTopologyAt` | 12868 | function |  | 8 |
| `strandCurveParameters` | 12910 | function |  | 5 |
| `widthProfileAt` | 12920 | arrow |  | 1 |
| `braidFrameAt` | 12958 | function |  | 5 |
| `braidFrameAtExtended` | 12968 | function |  | 2 |
| `createBraidProfileProjector` | 12977 | function |  | 2 |
| `project` | 12993 | arrow |  | 17 |
| `createBraidGeometry` | 13008 | function |  | 2 |
| `deformationAt` | 13043 | function |  | 3 |
| `widthFor` | 13052 | arrow |  | 3 |
| `depthFor` | 13056 | arrow |  | 3 |
| `outputVertex` | 13088 | function |  | 7 |
| `appendAuthoredCap` | 13196 | function |  | 3 |
| `outputCapVertex` | 13203 | arrow |  | 6 |
| `capBoundary` | 13294 | function |  | 3 |
| `strandGeometryCurve` | 13356 | function |  | 15 |
| `strandGeometryFrameAt` | 13382 | function |  | 19 |
| `transportedStrandFrameAt` | 13445 | function |  | 7 |
| `twistOverrideAt` | 13448 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13476 | function |  | 2 |
| `weldPanelGeometryData` | 13512 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13552 | function |  | 3 |
| `surfacePanelPoint` | 13567 | function |  | 3 |
| `createPanelStrandGeometry` | 13590 | function |  | 2 |
| `addQuad` | 13624 | arrow |  | 6 |
| `near` | 13628 | arrow |  | 6 |
| `panelWidthAt` | 13658 | arrow |  | 6 |
| `panelThicknessAt` | 13667 | arrow |  | 6 |
| `panelFrameAt` | 13676 | arrow |  | 1 |
| `rawPanelPoint` | 13694 | arrow |  | 1 |
| `panelPoint` | 13714 | arrow |  | 2 |
| `addPatch` | 13720 | arrow |  | 1 |
| `splitOpening` | 13771 | arrow |  | 2 |
| `uStart` | 13795 | arrow |  | 1 |
| `uEnd` | 13798 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13836 | function |  | 3 |
| `inside` | 13837 | arrow |  | 2 |
| `pushOrientedTriangle` | 13859 | function |  | 7 |
| `triangulatePolygon3D` | 13870 | function |  | 1 |
| `orientedQuadFace` | 13910 | function |  | 2 |
| `createSplitStrandGeometry` | 13918 | function |  | 2 |
| `fusedIndexAt` | 14075 | arrow |  | 0 |
| `createHairCardGeometry` | 14124 | function |  | 2 |
| `createPolyGeometry` | 14223 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14250 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14259 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14306 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14314 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14330 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14339 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14350 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14358 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14368 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14388 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14411 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14490 | function |  | 2 |
| `pushBoundary` | 14519 | arrow |  | 5 |
| `boundaryAt` | 14537 | arrow |  | 3 |
| `hermite` | 14559 | arrow |  | 2 |
| `emitBottomMidRow` | 14604 | arrow |  | 2 |
| `emitTopMidRow` | 14703 | arrow |  | 2 |
| `sideHoleVertex` | 14745 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14794 | arrow |  | 2 |
| `emitFillStrip` | 14865 | arrow |  | 2 |
| `fillSide` | 14876 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14920 | arrow |  | 2 |
| `edgeDirection` | 14944 | arrow |  | 1 |
| `positionAt` | 15003 | arrow |  | 1 |
| `createBranchChildGeometry` | 15054 | function |  | 2 |
| `createCompoundStrandGeometry` | 15264 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15515 | function |  | 2 |
| `createHairGeometry` | 15546 | function |  | 6 |
| `createBaseHairGeometry` | 15598 | function |  | 3 |
| `hairMaterialDefinition` | 15716 | function |  | 4 |
| `materialForLock` | 15720 | function |  | 8 |
| `activeHairMaterialDefinition` | 15724 | function |  | 11 |
| `strandDisplayColor` | 15730 | function |  | 14 |
| `setAnimeHairBaseColor` | 15748 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15761 | function |  | 2 |
| `createHairMaterial` | 15801 | function |  | 5 |
| `createStrandSelectionOutline` | 15843 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15877 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15886 | function |  | 6 |
| `refreshMaterialUsers` | 15913 | function |  | 6 |
| `renderHairMaterialOutliner` | 15922 | function |  | 5 |
| `renderHairMaterialOptions` | 15952 | function |  | 3 |
| `syncHairMaterialEditor` | 15962 | function |  | 9 |
| `createProjectHairMaterial` | 15988 | function |  | 3 |
| `deleteActiveHairMaterial` | 16008 | function |  | 2 |
| `createHairTopologyGeometry` | 16026 | function |  | 4 |
| `createHairTopologyOverlay` | 16047 | function |  | 3 |
| `groupDefaultsFor` | 16094 | function |  | 9 |
| `creationToolActive` | 16101 | function |  | 8 |
| `activeCreationShapeDefaults` | 16105 | function |  | 11 |
| `activeStrandShapeTarget` | 16111 | function |  | 5 |
| `curvePolylineLength` | 16115 | function |  | 2 |
| `curvePolylineLengths` | 16123 | function |  | 3 |
| `samplePolylineDistance` | 16131 | function |  | 2 |
| `applyProjectedCurveLength` | 16141 | function |  | 4 |
| `clearRegionLengthBaseline` | 16172 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16179 | function |  | 2 |
| `setGroupLengthScale` | 16187 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16225 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16257 | function |  | 1 |
| `activeSweepProfile` | 16266 | function |  | 9 |
| `activeSweepProfileTarget` | 16273 | function |  | 6 |
| `trimmedSweepProfile` | 16280 | function |  | 7 |
| `roundedLeft` | 16289 | arrow |  | 1 |
| `roundedRight` | 16295 | arrow |  | 1 |
| `activeProfileOffset` | 16312 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16319 | function |  | 3 |
| `profileToCanvas` | 16336 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16340 | function |  | 11 |
| `sampleSweepProfile` | 16349 | function |  | 7 |
| `createSweepProfileTopology` | 16370 | function |  | 5 |
| `renderProfilePreview` | 16412 | function |  | 8 |
| `renderHairCardCoveragePath` | 16431 | function |  | 3 |
| `activeTaperTarget` | 16446 | function |  | 15 |
| `twistCurveEditing` | 16453 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16457 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16461 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16465 | function |  | 17 |
| `taperAsymmetryKey` | 16469 | function |  | 12 |
| `taperSecondaryKey` | 16473 | function |  | 11 |
| `activeTaperCurve` | 16477 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16488 | function |  | 6 |
| `taperSamples` | 16498 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16505 | function |  | 2 |
| `renderTaperPreview` | 16527 | function |  | 13 |
| `renderTwistCurvePreview` | 16563 | function |  | 5 |
| `cloneShapePresetValue` | 16581 | function |  | 66 |
| `shapeValuesMatch` | 16585 | function |  | 5 |
| `shapeTargetForSelect` | 16593 | function |  | 4 |
| `loadCustomShapePresets` | 16600 | function |  | 2 |
| `saveCustomShapePresets` | 16611 | function |  | 4 |
| `shapePresetLabel` | 16619 | function |  | 4 |
| `setupShapePresetControls` | 16624 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16649 | function |  | 3 |
| `syncShapePresetSelects` | 16655 | function |  | 8 |
| `populateShapePresetSelects` | 16676 | function |  | 5 |
| `applyShapePreset` | 16703 | function |  | 2 |
| `openSaveShapePreset` | 16740 | function |  | 2 |
| `commitCustomShapePreset` | 16765 | function |  | 2 |
| `openRemoveShapePreset` | 16788 | function |  | 2 |
| `commitRemoveShapePreset` | 16801 | function |  | 2 |
| `taperPointToCanvas` | 16817 | function |  | 4 |
| `canvasToTaperPoint` | 16834 | function |  | 2 |
| `clearTaperMeshPoints` | 16870 | function |  | 2 |
| `taperMeshPointFrame` | 16880 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16890 | function |  | 4 |
| `twistMeshGraphAxis` | 16898 | function |  | 4 |
| `addTwistMeshCurvePath` | 16902 | function |  | 2 |
| `appendSegment` | 16923 | arrow |  | 1 |
| `appendFill` | 16926 | arrow |  | 1 |
| `appendSignedSection` | 16932 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16981 | function |  | 6 |
| `updateTaperMeshPoints` | 17018 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17097 | function |  | 5 |
| `renderTaperCurveEditor` | 17115 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17187 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17201 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17217 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17251 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17260 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17271 | function |  | 2 |
| `applyTaperCurveEdit` | 17279 | function |  | 10 |
| `openTaperCurveEditor` | 17387 | function |  | 3 |
| `closeTaperCurveEditor` | 17432 | function |  | 6 |
| `updateViewportStatsVisibility` | 17445 | function |  | 6 |
| `canvasToProfile` | 17464 | function |  | 2 |
| `renderSweepProfileEditor` | 17474 | function |  | 7 |
| `applySweepProfileEdit` | 17517 | function |  | 8 |
| `openSweepProfileEditor` | 17544 | function |  | 1 |
| `closeSweepProfileEditor` | 17579 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17588 | function |  | 2 |
| `addLock` | 17603 | function |  | 19 |
| `mirroredScalpRegion` | 17806 | function |  | 5 |
| `mirroredVector` | 17815 | function |  | 12 |
| `mirroredPlacementFrame` | 17819 | function |  | 2 |
| `mirrorPartnerFor` | 17832 | function |  | 40 |
| `decoupleMirrorPartner` | 17836 | function |  | 2 |
| `createMirrorPartner` | 17844 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17940 | function |  | 6 |
| `mirroredClumpPartners` | 17945 | function |  | 6 |
| `createMirroredClump` | 17951 | function |  | 3 |
| `decoupleMirroredClump` | 17973 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17982 | function |  | 6 |
| `syncActiveMirror` | 18147 | function |  | 25 |
| `setMirrorXEditing` | 18159 | function |  | 6 |
| `snapshotState` | 18183 | function |  | 7 |
| `scalpTriangleRegion` | 18440 | function |  | 4 |
| `closestPointOnActiveScalp` | 18453 | function |  | 12 |
| `rootAttachmentFrame` | 18525 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18537 | function |  | 4 |
| `resolveRootAttachment` | 18555 | function |  | 4 |
| `curvePointsToRootLocal` | 18595 | function |  | 2 |
| `curvePointsFromRootLocal` | 18607 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18615 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18631 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18661 | function |  | 2 |
| `createRootAttachment` | 18673 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18703 | function |  | 4 |
| `rootAttachmentToData` | 18730 | function |  | 2 |
| `rootAttachmentFromData` | 18758 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18797 | function |  | 2 |
| `remapPoint` | 18812 | arrow |  | 1 |
| `remapVector` | 18813 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18842 | function |  | 2 |
| `importHeadMeshFile` | 18859 | function |  | 3 |
| `importFullBodyMeshFile` | 18882 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18907 | function |  | 1 |
| `importedBooleanPreference` | 18940 | function |  | 11 |
| `loadPreferencesAndPresets` | 18944 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19014 | function |  | 1 |
| `openHairProjectFile` | 19057 | function |  | 4 |
| `dragContainsApplicationFile` | 19115 | function |  | 3 |
| `safelyRememberRecentProject` | 19124 | function |  | 2 |
| `renderRecentProjectsMenu` | 19133 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19165 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19190 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19194 | function |  | 2 |
| `pushUndoState` | 19210 | function |  | 119 |
| `undoLastAction` | 19217 | function |  | 2 |
| `redoLastAction` | 19231 | function |  | 2 |
| `updateHistoryButtons` | 19245 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19250 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19267 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19274 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19312 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19389 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19415 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19447 | function |  | 2 |
| `finalizeStateRestore` | 19488 | function |  | 2 |
| `restoreState` | 19495 | function |  | 5 |
| `disposeAllEditableObjects` | 19519 | function |  | 2 |
| `restoreLock` | 19540 | function |  | 4 |
| `restoreGuide` | 19757 | function |  | 2 |
| `vectorToData` | 19818 | function |  | 29 |
| `dataToVector` | 19822 | function |  | 31 |
| `frameToData` | 19826 | function |  | 2 |
| `frameFromData` | 19838 | function |  | 2 |
| `applyPresetSelection` | 19850 | function |  | 2 |
| `drawPresetThumbnail` | 19881 | function |  | 1 |
| `fillHair` | 19896 | arrow |  | 9 |
| `strand` | 19908 | arrow |  | 31 |
| `bun` | 19926 | arrow |  | 2 |
| `braid` | 19961 | arrow |  | 2 |
| `renderPresetLibrary` | 20050 | function |  | 3 |
| `setPresetLibraryOpen` | 20109 | function |  | 6 |
| `average` | 20122 | function |  | 4 |
| `fitPointAttributes` | 20126 | function |  | 9 |
| `rebuildCurveObjects` | 20155 | function |  | 10 |
| `createCurvePoints` | 20167 | function |  | 2 |
| `addGeneratedBangPreset` | 20176 | function |  | 1 |
| `sampleScalpQuad` | 20269 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20293 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20342 | function |  | 1 |
| `columns` | 20343 | arrow |  | 1 |
| `layer` | 20347 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20561 | function |  | 2 |
| `addBraidedBobPreset` | 20597 | function |  | 1 |
| `evenColumns` | 20598 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20814 | function |  | 1 |
| `scalpSeed` | 20837 | arrow |  | 1 |
| `createBowlCutPoints` | 21124 | function |  | 2 |
| `addBowlCutPreset` | 21162 | function |  | 1 |
| `scalpRegionAtHit` | 21228 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21240 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21247 | function |  | 12 |
| `braidStrokeActive` | 21254 | function |  | 9 |
| `proceduralDrawActive` | 21258 | function |  | 3 |
| `panelStrokeActive` | 21262 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21266 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21270 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21274 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21280 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21284 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21288 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21292 | function |  | 3 |
| `liveSurfaceStrandId` | 21302 | function |  | 4 |
| `liveSurfaceStrand` | 21306 | function |  | 4 |
| `liveSurfaceGuideId` | 21311 | function |  | 3 |
| `guideSupportsLiveSurface` | 21315 | function |  | 2 |
| `liveSurfaceGuide` | 21322 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21329 | function |  | 12 |
| `activeStrokeScalpOffset` | 21369 | function |  | 4 |
| `activeStrokeBrushSize` | 21375 | function |  | 10 |
| `activeStrokeBrushDepth` | 21381 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21387 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21395 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21405 | function |  | 13 |
| `worldNormalAtHit` | 21444 | function |  | 6 |
| `selectedPolyMesh` | 21452 | function |  | 10 |
| `addPolyLock` | 21457 | function |  | 2 |
| `ensurePolyMesh` | 21476 | function |  | 3 |
| `polySurfaceSample` | 21480 | function |  | 4 |
| `polyTargetAtEvent` | 21491 | function |  | 6 |
| `refreshPolyMesh` | 21517 | function |  | 10 |
| `ensurePolyFillPreview` | 21526 | function |  | 2 |
| `clearPolyFillPreview` | 21563 | function |  | 17 |
| `polyFillCandidateForEvent` | 21568 | function |  | 3 |
| `showPolyFillPreview` | 21588 | function |  | 2 |
| `updatePolyFillPreview` | 21614 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21639 | function |  | 5 |
| `fillPolyGap` | 21649 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21660 | function |  | 2 |
| `projectPolyRelaxPoint` | 21680 | function |  | 2 |
| `removePolyPointAttributes` | 21724 | function |  | 3 |
| `deletePolyComponent` | 21733 | function |  | 2 |
| `addPolyPoint` | 21756 | function |  | 4 |
| `appendPolyStrokeRow` | 21765 | function |  | 4 |
| `beginPolyBrushPointer` | 21785 | function |  | 1 |
| `finishPolyAltDelete` | 21871 | function |  | 1 |
| `updatePolyBrushStroke` | 21885 | function |  | 1 |
| `finishPolyBrushStroke` | 21975 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22012 | function |  | 2 |
| `drawSampleFromHit` | 22035 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22049 | function |  | 3 |
| `strokeLength` | 22086 | function |  | 9 |
| `resampleDrawStroke` | 22092 | function |  | 2 |
| `processedDrawStroke` | 22124 | function |  | 8 |
| `strokeSurfaceNormals` | 22153 | function |  | 7 |
| `drawClumpFrame` | 22164 | function |  | 4 |
| `nearestCurveParameter` | 22173 | function |  | 2 |
| `drawClumpSampleNormal` | 22187 | function |  | 6 |
| `drawClumpTemplateVector` | 22196 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22202 | function |  | 3 |
| `drawClumpStrandMaps` | 22218 | function |  | 4 |
| `nextClumpName` | 22273 | function |  | 6 |
| `initializeClumpShape` | 22280 | function |  | 5 |
| `stableClumpVariation` | 22291 | function |  | 3 |
| `createClumpFromLocks` | 22303 | function |  | 7 |
| `addLockToClump` | 22328 | function |  | 4 |
| `stableBranchBaseNormals` | 22346 | function |  | 4 |
| `ensureBranchParentNormalField` | 22357 | function |  | 2 |
| `branchParentFrame` | 22363 | function |  | 7 |
| `branchLocalVector` | 22375 | function |  | 3 |
| `branchWorldVector` | 22379 | function |  | 4 |
| `captureBranchLocalState` | 22385 | function |  | 6 |
| `enforceBranchRootPosition` | 22413 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22463 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22490 | function |  | 2 |
| `clampRegionParam` | 22537 | function |  | 113 |
| `branchRootRegionFromParam` | 22544 | function |  | 4 |
| `cloneBranchRootRegion` | 22567 | function |  | 5 |
| `flip` | 22569 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22602 | function |  | 8 |
| `setBranchRootRegionPoint` | 22633 | function |  | 3 |
| `branchRegionUVToCanvas` | 22669 | function |  | 10 |
| `branchRegionCanvasToUV` | 22672 | function |  | 4 |
| `openBranchRegionEditor` | 22678 | function |  | 2 |
| `closeBranchRegionEditor` | 22692 | function |  | 2 |
| `retargetBranchRegionEditor` | 22698 | function |  | 2 |
| `renderBranchRegionEditor` | 22703 | function |  | 9 |
| `applyBranchRegionView` | 22791 | function |  | 6 |
| `resetBranchRegionZoom` | 22794 | function |  | 1 |
| `branchRegionNavAction` | 22800 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22814 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22834 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22838 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22864 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22876 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22881 | function |  | 1 |
| `branchRegionEventUV` | 22901 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22909 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23014 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23147 | function |  | 1 |
| `pointerToNdc` | 23152 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23163 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23177 | function |  | 1 |
| `endBranchSweepStartDrag` | 23200 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23207 | function |  | 5 |
| `gridProfileSkipCol` | 23234 | function |  | 3 |
| `branchRootRegionSurface` | 23243 | function |  | 6 |
| `toGridCol` | 23268 | arrow |  | 5 |
| `toRow` | 23272 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23327 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23347 | function |  | 2 |
| `pointAt` | 23353 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23380 | function |  | 3 |
| `applyBranchRootOffset` | 23452 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23471 | function |  | 3 |
| `branchChildrenFor` | 23491 | function |  | 9 |
| `detachBranch` | 23495 | function |  | 2 |
| `updateBranchChildren` | 23506 | function |  | 4 |
| `clumpDirectMembers` | 23549 | function |  | 3 |
| `clumpMembersForGuide` | 23554 | function |  | 6 |
| `clumpGuideForLock` | 23558 | function |  | 13 |
| `proceduralGuideForLock` | 23563 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23570 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23577 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23584 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23596 | function |  | 2 |
| `applyProceduralBranchSettings` | 23609 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23648 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23664 | function |  | 3 |
| `createProceduralAccessoryLock` | 23678 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23730 | function |  | 2 |
| `clumpFrameAt` | 23781 | function |  | 5 |
| `commitClumpMemberRestState` | 23789 | function |  | 10 |
| `updateClumpMembers` | 23872 | function |  | 10 |
| `dissolveClump` | 23976 | function |  | 6 |
| `detachLockFromClump` | 24013 | function |  | 4 |
| `updateDrawVolumePreview` | 24039 | function |  | 5 |
| `hideDrawClumpPreviews` | 24063 | function |  | 5 |
| `resetDrawVolumePreview` | 24069 | function |  | 3 |
| `updateDrawStrandPreview` | 24075 | function |  | 23 |
| `continueFromTipEnabled` | 24294 | function |  | 2 |
| `selectedTipContinuationLock` | 24300 | function |  | 3 |
| `selectedDrawBranchPoint` | 24313 | function |  | 3 |
| `canBranchDrawFromLock` | 24330 | function |  | 3 |
| `beginDrawStrandStroke` | 24337 | function |  | 2 |
| `beginDrawFreePlane` | 24462 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24476 | function |  | 2 |
| `updateDrawStrandStroke` | 24501 | function |  | 1 |
| `createDrawnLock` | 24547 | function |  | 3 |
| `setting` | 24551 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24619 | function |  | 4 |
| `createDrawnBraid` | 24627 | function |  | 2 |
| `createDrawnStrand` | 24684 | function |  | 2 |
| `createDrawnPanel` | 24811 | function |  | 2 |
| `surfaceLatticeNormal` | 24861 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24876 | function |  | 3 |
| `createViewportSurface` | 24941 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24970 | function |  | 6 |
| `hideLoftSurfacePreviews` | 24976 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 24983 | function |  | 4 |
| `updateLoftSurfacePreview` | 24992 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25024 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25040 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25058 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25080 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25106 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25116 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25120 | function |  | 2 |
| `curveSurfacePreviewLock` | 25129 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25152 | function |  | 2 |
| `hideCurveSurfacePreview` | 25168 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25180 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25185 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25194 | function |  | 3 |
| `curveSurfaceSideVector` | 25232 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25245 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25253 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25266 | function |  | 5 |
| `updateCurveSurfacePreview` | 25286 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25348 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25370 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25385 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25433 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25468 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25500 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25558 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25635 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25640 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25649 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25683 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25694 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25724 | function |  | 2 |
| `extendDrawnStrand` | 25781 | function |  | 2 |
| `finishDrawStrandStroke` | 25814 | function |  | 7 |
| `createPlacedStrand` | 25841 | function |  | 2 |
| `placedPointCount` | 25905 | function |  | 3 |
| `createPlacedPoints` | 25909 | function |  | 3 |
| `pushPointOutsideHead` | 25928 | function |  | 8 |
| `resizePlacedStrand` | 25960 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 25977 | function |  | 5 |
| `beginPlaceEdit` | 25982 | function |  | 2 |
| `updatePlaceEdit` | 26000 | function |  | 1 |
| `updatePlacementLength` | 26014 | function |  | 3 |
| `updatePlacementOrientation` | 26024 | function |  | 3 |
| `endPlaceEdit` | 26042 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26057 | function |  | 1 |
| `pendingPlacedLock` | 26067 | function |  | 2 |
| `beginPlacementPointer` | 26071 | function |  | 3 |
| `finishPlacementPointer` | 26081 | function |  | 2 |
| `confirmPlacementStep` | 26105 | function |  | 2 |
| `finishPlacementFlow` | 26128 | function |  | 7 |
| `updatePlacementStatus` | 26141 | function |  | 83 |
| `deselectStrands` | 26280 | function |  | 12 |
| `beginSelectionMarquee` | 26295 | function |  | 3 |
| `beginAltOrbit` | 26319 | function |  | 1 |
| `beginBlenderNavigation` | 26331 | function |  | 1 |
| `endBlenderNavigation` | 26376 | function |  | 1 |
| `prepareSelectPointerCapture` | 26384 | function |  | 1 |
| `endSelectPointerCapture` | 26390 | function |  | 1 |
| `endAltOrbit` | 26396 | function |  | 1 |
| `dollyCameraByDrag` | 26403 | function |  | 2 |
| `fastDragMagnitude` | 26426 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26432 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26440 | function |  | 1 |
| `endHoudiniZoomDrag` | 26457 | function |  | 1 |
| `updateSelectionMarquee` | 26465 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26482 | function |  | 3 |
| `selectPointsInMarquee` | 26490 | function |  | 2 |
| `pointKey` | 26516 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26547 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26584 | function |  | 3 |
| `projectedPoint` | 26601 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26630 | function |  | 2 |
| `finishSelectionMarquee` | 26675 | function |  | 2 |
| `headMeshes` | 26698 | function |  | 9 |
| `strandSplitProfileData` | 26706 | function |  | 4 |
| `strandSplitControlPoint` | 26719 | function |  | 4 |
| `panelSplitControlPoint` | 26755 | function |  | 6 |
| `strandControlPointRaycast` | 26811 | function |  | 1 |
| `strandControlPointFrame` | 26846 | function |  | 6 |
| `branchRootGizmoFrame` | 26877 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26895 | function |  | 5 |
| `createCurveObjects` | 26953 | function |  | 4 |
| `polyEdgeKey` | 27126 | function |  | 2 |
| `polyMeshEdges` | 27130 | function |  | 2 |
| `populatePolyEditObjects` | 27144 | function |  | 3 |
| `createPolyEditObjects` | 27205 | function |  | 2 |
| `rebuildPolyEditObjects` | 27213 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27227 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27234 | function |  | 2 |
| `strandWidthEdgeSample` | 27243 | function |  | 3 |
| `strandWidthEdgePoints` | 27266 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27280 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27284 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27291 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27303 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27308 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27314 | function |  | 3 |
| `updateCurveObjects` | 27328 | function |  | 41 |
| `createCurveNormalIndicator` | 27585 | function |  | 2 |
| `pointUpDirection` | 27611 | function |  | 2 |
| `curveFrameAtPoint` | 27615 | function |  | 5 |
| `curveFrameAt` | 27636 | function |  | 10 |
| `strandTwistAt` | 27656 | function |  | 6 |
| `controlPointRotationAt` | 27661 | function |  | 6 |
| `strandProfileTwistAt` | 27665 | function |  | 2 |
| `strandFrameAt` | 27671 | function |  | 1 |
| `curveFrameAtSnapshot` | 27677 | function |  | 3 |
| `outwardNormalAtPoint` | 27696 | function |  | 11 |
| `sampledSurfaceNormal` | 27708 | function |  | 2 |
| `guidedNormalAt` | 27724 | function |  | 5 |
| `twistFromHandle` | 27743 | function |  | 3 |
| `signedAngleAroundAxis` | 27764 | function |  | 5 |
| `handleColor` | 27771 | function |  | 2 |
| `isAffectedCurvePoint` | 27794 | function |  | 2 |
| `syncLockFromCurve` | 27800 | function |  | 26 |
| `labelForPreset` | 27830 | function |  | 1 |
| `rebuildLockGeometry` | 27834 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27861 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27869 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27875 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27897 | function |  | 8 |
| `updateLockGeometry` | 27910 | function |  | 57 |
| `setGroupColorView` | 27931 | function |  | 2 |
| `createUvCheckerTexture` | 27941 | function |  | 3 |
| `ensureUvCheckerForLock` | 27977 | function |  | 4 |
| `removeUvCheckerFromLock` | 28010 | function |  | 3 |
| `invalidateUvInspector` | 28025 | function |  | 7 |
| `uvInspectorRecord` | 28029 | function |  | 1 |
| `uvInspectorRecords` | 28068 | function |  | 2 |
| `drawUvInspectorGrid` | 28072 | function |  | 2 |
| `renderUvInspector` | 28106 | function |  | 3 |
| `setUvCheckerEnabled` | 28165 | function |  | 3 |
| `strandViewportBaseColor` | 28182 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28217 | function |  | 3 |
| `syncStrandSelectionOutline` | 28223 | function |  | 2 |
| `applyLockedStrandPalette` | 28234 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28243 | function |  | 6 |
| `setStrandSelectionVisual` | 28252 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28268 | function |  | 2 |
| `syncProceduralParentVisibility` | 28275 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28284 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28288 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28292 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28305 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28325 | function |  | 3 |
| `selectLock` | 28358 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28411 | function |  | 6 |
| `syncGroupInputs` | 28422 | function |  | 3 |
| `topologyStatsForLock` | 28455 | function |  | 4 |
| `formatTopologyStats` | 28463 | function |  | 5 |
| `updateTopologyStats` | 28467 | function |  | 20 |
| `normalizeBraidDimensions` | 28501 | function |  | 4 |
| `normalizeStrandDimensions` | 28514 | function |  | 3 |
| `strandBaseWidth` | 28528 | function |  | 5 |
| `strandWidthDimension` | 28532 | function |  | 5 |
| `strandDepthDimension` | 28540 | function |  | 8 |
| `setStrandWidthDimension` | 28548 | function |  | 2 |
| `setStrandDepthDimension` | 28570 | function |  | 4 |
| `syncShapeDimensionInputs` | 28586 | function |  | 4 |
| `syncCreationShapeInputs` | 28622 | function |  | 5 |
| `syncViewportDrawSettings` | 28660 | function |  | 5 |
| `syncPanelShapeInputs` | 28674 | function |  | 6 |
| `syncStrandSplitInputs` | 28700 | function |  | 4 |
| `syncHairCardControls` | 28709 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28717 | function |  | 3 |
| `updateAttributeEditorMode` | 28756 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28906 | function |  | 3 |
| `curveLatticeForGroup` | 28929 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28947 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 28992 | function |  | 2 |
| `showCurveLatticeForGroup` | 29009 | function |  | 2 |
| `selectStrandGroup` | 29046 | function |  | 3 |
| `selectCurvePoint` | 29088 | function |  | 10 |
| `updateSelectedPointLabel` | 29102 | function |  | 14 |
| `syncInputs` | 29115 | function |  | 16 |
| `syncClumpGuidePanel` | 29161 | function |  | 3 |
| `getSelectedLock` | 29188 | function |  | 105 |
| `selectedLocksInOrder` | 29192 | function |  | 37 |
| `lockStrands` | 29198 | function |  | 3 |
| `lockSelectedStrands` | 29231 | function |  | 3 |
| `unlockStrands` | 29237 | function |  | 3 |
| `unlockAllStrands` | 29252 | function |  | 3 |
| `strandEditFamily` | 29256 | function |  | 7 |
| `compatibleSelectedLocks` | 29261 | function |  | 6 |
| `selectedEditRoots` | 29268 | function |  | 2 |
| `editSelectedLocks` | 29281 | function |  | 21 |
| `multiEditValuesEqual` | 29314 | function |  | 2 |
| `setMixedControl` | 29323 | function |  | 28 |
| `syncMultiStrandInputs` | 29340 | function |  | 16 |
| `values` | 29356 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29436 | function |  | 5 |
| `createCompoundStrand` | 29443 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29504 | function |  | 9 |
| `openRebuildCurveDialog` | 29517 | function |  | 1 |
| `rebuildSelectedCurves` | 29531 | function |  | 2 |
| `selectionCanBecomeClump` | 29570 | function |  | 4 |
| `createClumpFromSelection` | 29575 | function |  | 3 |
| `cleanSelectionSets` | 29587 | function |  | 2 |
| `createSelectionSetFromSelection` | 29592 | function |  | 3 |
| `selectionSetById` | 29603 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29607 | function |  | 7 |
| `editSelectionSetFromSelection` | 29616 | function |  | 5 |
| `deleteSelectionSet` | 29636 | function |  | 2 |
| `selectSelectionSet` | 29645 | function |  | 2 |
| `deleteSelectedStrands` | 29655 | function |  | 4 |
| `deleteGuide` | 29663 | function |  | 3 |
| `deleteSelectedGuide` | 29686 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29690 | function |  | 4 |
| `hasDeletableSelection` | 29703 | function |  | 2 |
| `deleteCurrentSelection` | 29711 | function |  | 3 |
| `hideOutlinerContextMenu` | 29719 | function |  | 17 |
| `outlinerLockTargets` | 29724 | function |  | 3 |
| `showOutlinerContextMenu` | 29751 | function |  | 10 |
| `hideStrandRadialMenu` | 29831 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29842 | function |  | 3 |
| `radialButtonDimensions` | 29855 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29864 | function |  | 3 |
| `applyRadialMenuDimensions` | 29881 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29887 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29900 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29921 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29938 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29947 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29969 | function |  | 5 |
| `clumpMirrorRadialOptions` | 29987 | function |  | 2 |
| `contextualRadialOptions` | 29994 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30123 | function |  | 3 |
| `layoutContextualRadialOptions` | 30127 | function |  | 4 |
| `renderRadialActionList` | 30151 | function |  | 3 |
| `radialListOptionAtPointer` | 30169 | function |  | 3 |
| `syncRadialListHighlight` | 30191 | function |  | 3 |
| `configureContextualRadialMenu` | 30197 | function |  | 3 |
| `beginStrandRadialGesture` | 30257 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30291 | function |  | 2 |
| `updateStrandRadialGesture` | 30337 | function |  | 1 |
| `performStrandRadialAction` | 30376 | function |  | 2 |
| `finishStrandRadialGesture` | 30479 | function |  | 2 |
| `cancelStrandRadialGesture` | 30489 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30496 | function |  | 1 |
| `setPullMoveEnabled` | 30502 | function |  | 3 |
| `toolRadialOptions` | 30510 | function |  | 2 |
| `hideToolRadialMenu` | 30535 | function |  | 4 |
| `beginToolRadialGesture` | 30548 | function |  | 2 |
| `beginToolShortcutPress` | 30588 | function |  | 2 |
| `finishToolShortcutPress` | 30603 | function |  | 2 |
| `cancelToolShortcutPress` | 30612 | function |  | 5 |
| `setRadialMenusEnabled` | 30620 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30633 | function |  | 5 |
| `setNavigationTipsEnabled` | 30648 | function |  | 5 |
| `configureNavigationMouseButtons` | 30655 | function |  | 3 |
| `syncNavigationModifierLocks` | 30668 | function |  | 7 |
| `setNavigationStyle` | 30673 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30689 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30704 | function |  | 5 |
| `setCameraSmoothingStrength` | 30710 | function |  | 5 |
| `setScaleSensitivity` | 30718 | function |  | 3 |
| `setToolTipsEnabled` | 30726 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30733 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30742 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30750 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30765 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30774 | function |  | 5 |
| `sideNamingDisplayId` | 30783 | function |  | 3 |
| `referenceViewDisplayLabel` | 30795 | function |  | 6 |
| `strandRegionDisplayLabel` | 30805 | function |  | 10 |
| `updateSideNamingLabels` | 30823 | function |  | 2 |
| `setSideNamingPerspective` | 30850 | function |  | 5 |
| `setControlPointDisplaySize` | 30859 | function |  | 6 |
| `scaleHexColor` | 30871 | function |  | 3 |
| `setViewportBackgroundColor` | 30876 | function |  | 7 |
| `setDefaultHairShader` | 30898 | function |  | 5 |
| `setPreferenceCategory` | 30904 | function |  | 4 |
| `openPreferencesDialog` | 30931 | function |  | 1 |
| `savePreferencesDialog` | 30959 | function |  | 1 |
| `cancelPreferencesDialog` | 30983 | function |  | 3 |
| `updateToolRadialGesture` | 31012 | function |  | 1 |
| `performToolRadialAction` | 31041 | function |  | 2 |
| `finishToolRadialGesture` | 31051 | function |  | 2 |
| `cancelToolRadialGesture` | 31060 | function |  | 5 |
| `duplicatePlacementTarget` | 31067 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31094 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31098 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31108 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31113 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31125 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31136 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31144 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31161 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31182 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31193 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31199 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31205 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31238 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31393 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31495 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31536 | function |  | 2 |
| `updateDuplicatePlacement` | 31563 | function |  | 2 |
| `beginDuplicatePlacement` | 31627 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31691 | function |  | 2 |
| `confirmDuplicatePlacement` | 31732 | function |  | 1 |
| `cancelDuplicatePlacement` | 31769 | function |  | 4 |
| `outlinerClumpLocks` | 31795 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31799 | function |  | 3 |
| `createOutlinerStrandButton` | 31822 | function |  | 4 |
| `createOutlinerCurveSurface` | 31908 | function |  | 2 |
| `createOutlinerClump` | 32004 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32086 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32093 | function |  | 2 |
| `renderLockList` | 32172 | function |  | 70 |
| `updateCount` | 32326 | function |  | 34 |
| `captureInputUndo` | 32335 | function |  | 1 |
| `bindUndoCapture` | 32341 | function |  | 36 |
| `bindLockInput` | 32352 | function |  | 2 |
| `applyValue` | 32369 | arrow |  | 2 |
| `applyUniformTransformScale` | 32688 | function |  | 2 |
| `applyReducedTransformScale` | 32705 | function |  | 2 |
| `applyTransformPrecision` | 32744 | function |  | 2 |
| `updateTransformScalePointer` | 32773 | function |  | 1 |
| `finishSweepProfileDrag` | 33004 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33100 | function |  | 3 |
| `finishTaperCurveDrag` | 33162 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33205 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33286 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33341 | function |  | 6 |
| `updateSelectedTaperPoint` | 33365 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33937 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33942 | function |  | 4 |
| `syncDrawCurlControls` | 33997 | function |  | 5 |
| `handleLiveSurfaceChange` | 34045 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34127 | function |  | 3 |
| `resampleSurfaceLock` | 34142 | function |  | 2 |
| `changePanelSplitCount` | 34255 | function |  | 3 |
| `presetNumber` | 34359 | function |  | 23 |
| `clonePresetShape` | 34364 | function |  | 7 |
| `creationPresetSnapshot` | 34373 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34421 | function |  | 5 |
| `applyPresetControl` | 34448 | function |  | 2 |
| `applyCreationToolSettings` | 34469 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34509 | function |  | 3 |
| `loadCustomCreationPresets` | 34516 | function |  | 2 |
| `saveCustomCreationPresets` | 34526 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34534 | function |  | 2 |
| `populateCreationPresetSelect` | 34570 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34594 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34627 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34632 | function |  | 2 |
| `applyCustomCreationPreset` | 34649 | function |  | 3 |
| `createCustomCreationPreset` | 34670 | function |  | 3 |
| `createCustomClumpPreset` | 34685 | function |  | 3 |
| `commitCustomCreationPreset` | 34700 | function |  | 2 |
| `openRemoveCreationPreset` | 34761 | function |  | 3 |
| `commitRemoveCreationPreset` | 34774 | function |  | 1 |
| `applyBraidToolPreset` | 34791 | function |  | 2 |
| `selectedBranchChildLock` | 34903 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34907 | function |  | 2 |
| `initPanelResizeHandles` | 35013 | function |  | 2 |
| `applyWidth` | 35019 | arrow |  | 2 |
| `restoreWidth` | 35026 | arrow |  | 2 |
| `bindResize` | 35034 | arrow |  | 2 |
| `onMove` | 35042 | arrow |  | 0 |
| `onUp` | 35046 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35063 | function |  | 2 |
| `initFloatingPanelControls` | 35072 | function |  | 2 |
| `detach` | 35081 | arrow |  | 43 |
| `endDrag` | 35119 | arrow |  | 0 |
| `endResize` | 35151 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35162 | function |  | 3 |
| `selectPatchNotesVersion` | 35296 | function |  | 3 |
| `requestReferenceImage` | 35329 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35533 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35539 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35546 | function |  | 1 |
| `deleteLocks` | 36113 | function |  | 10 |
| `disposeCurveObjects` | 36191 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36243 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36274 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36349 | function |  | 2 |
| `resize` | 36382 | function |  | 4 |
| `handleViewportPointerMove` | 36393 | function |  | 1 |
| `blockProportionalSizingEvent` | 36404 | function |  | 1 |
| `updateLightAngleFromInputs` | 36410 | function |  | 2 |
| `startViewSnap` | 36424 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36454 | function |  | 3 |
| `trackViewportPointerDown` | 36471 | function |  | 1 |
| `trackViewportPointerMove` | 36487 | function |  | 1 |
| `clearViewportPointer` | 36495 | function |  | 1 |
| `updateViewSnap` | 36500 | function |  | 1 |
| `nearestCardinalAxis` | 36536 | function |  | 5 |
| `cardinalAxisKey` | 36550 | function |  | 5 |
| `steppedDragAmount` | 36554 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36560 | function |  | 4 |
| `endViewSnap` | 36576 | function |  | 4 |
| `activateStrandControlPoint` | 36586 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36636 | function |  | 4 |
| `addStrandControlPointSelection` | 36663 | function |  | 3 |
| `removeStrandControlPointSelection` | 36680 | function |  | 3 |
| `sampleStrandPointNormal` | 36694 | function |  | 2 |
| `sampleStrandPointVectors` | 36704 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36710 | function |  | 2 |
| `resampleStrandCurveData` | 36721 | function |  | 4 |
| `resampleMatchingVectors` | 36727 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36766 | function |  | 4 |
| `removeStrandCurvePoint` | 36777 | function |  | 2 |
| `closestStrandCurveParameter` | 36790 | function |  | 2 |
| `insertStrandCurvePoint` | 36819 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36836 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36846 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36862 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36869 | function |  | 4 |
| `prepareCurvePointSelection` | 36891 | function |  | 1 |
| `finishCurvePointInsertion` | 37002 | function |  | 1 |
| `finishPointRemoval` | 37017 | function |  | 1 |
| `editableStrandWidth` | 37035 | function |  | 6 |
| `editableStrandWidthBounds` | 37047 | function |  | 2 |
| `applyEditableStrandWidth` | 37053 | function |  | 3 |
| `viewportPixelPoint` | 37089 | function |  | 3 |
| `syncSculptBrushControls` | 37097 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37112 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37120 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37128 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37134 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37138 | function |  | 7 |
| `updateSculptBrushCursor` | 37145 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37167 | function |  | 4 |
| `sculptBrushEditableLock` | 37174 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37184 | function |  | 5 |
| `sculptBrushLockViable` | 37190 | function |  | 5 |
| `sculptBrushUnits` | 37201 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37240 | function |  | 4 |
| `sculptBrushPointWeight` | 37290 | function |  | 5 |
| `sculptBrushWorldDelta` | 37300 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37309 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37335 | function |  | 2 |
| `beginSculptMoveStroke` | 37393 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37455 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37690 | function |  | 3 |
| `updateSculptMoveStroke` | 37699 | function |  | 1 |
| `finishSculptMoveStroke` | 37715 | function |  | 3 |
| `strandControlPointHit` | 37763 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37767 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37845 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37879 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37919 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37932 | function |  | 1 |
| `setHoveredControlPoint` | 37971 | function |  | 7 |
| `visibleControlPointHoverTargets` | 37984 | function |  | 2 |
| `updateControlPointHover` | 38020 | function |  | 1 |
| `animate` | 38577 | function |  | 2 |
| `syncCompactSidebarLayout` | 38610 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38629 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38635 | function |  | 3 |
| `setAttributeEditorTab` | 38641 | function |  | 6 |

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
