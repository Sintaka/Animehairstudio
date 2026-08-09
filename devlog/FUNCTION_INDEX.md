# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1727** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38736 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 254 | function |  | 3 |
| `saveBooleanPreference` | 282 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 286 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 291 | function |  | 2 |
| `normalizeScaleSensitivity` | 296 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 301 | function |  | 2 |
| `normalizeSideNamingPerspective` | 306 | function |  | 2 |
| `normalizeNavigationStyle` | 310 | function |  | 2 |
| `setupEditableSliderControls` | 325 | function |  | 2 |
| `syncNumberFromRange` | 376 | arrow |  | 0 |
| `applyNumberValue` | 383 | arrow |  | 0 |
| `copyCameraPose` | 489 | function |  | 3 |
| `updateCameraProjectionForViewport` | 495 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 508 | function |  | 3 |
| `setOrthographicView` | 514 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 554 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 583 | function |  | 2 |
| `removeRotateFreeAxisRing` | 609 | function |  | 2 |
| `deflateTransformGizmoPickers` | 621 | function |  | 2 |
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
| `updateScalpRenderGeometry` | 1483 | function |  | 4 |
| `writeScalpRegionColors` | 1534 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 1547 | function |  | 2 |
| `createScalpSelectionOutline` | 1577 | function |  | 5 |
| `activeScalpSurfaceMesh` | 1629 | function |  | 25 |
| `activeScalpSurfaceWire` | 1634 | function |  | 2 |
| `activeScalpSelectionOutline` | 1639 | function |  | 2 |
| `inferredCustomScalpRegion` | 1644 | function |  | 2 |
| `writeCustomScalpRegionColors` | 1651 | function |  | 5 |
| `customScalpGeometryFromObject` | 1670 | function |  | 2 |
| `customScalpWireGeometry` | 1702 | function |  | 3 |
| `installCustomScalpGeometry` | 1713 | function |  | 3 |
| `installCustomScalpGuide` | 1737 | function |  | 3 |
| `setScalpGuideSource` | 1755 | function |  | 7 |
| `updateScalpQuadWire` | 1771 | function |  | 4 |
| `updateScalpTopology` | 1787 | function |  | 3 |
| `setDrawStrandBrushCursorScale` | 1851 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 2031 | function |  | 2 |
| `currentStrandSelectionState` | 2098 | function |  | 4 |
| `applyStrandSelectionState` | 2102 | function |  | 5 |
| `clearStrandSelectionState` | 2107 | function |  | 7 |
| `guideHeadBounds` | 3183 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3193 | function |  | 5 |
| `disposeGuideModel` | 3207 | function |  | 3 |
| `syncHeadTransformInputs` | 3218 | function |  | 4 |
| `applyHeadTransform` | 3225 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3243 | function |  | 4 |
| `applyScalpRoughScale` | 3252 | function |  | 5 |
| `resetHeadTransform` | 3266 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3280 | function |  | 2 |
| `installGuideModel` | 3296 | function |  | 5 |
| `loadDefaultGuideModel` | 3372 | function |  | 3 |
| `braidTemplateFromEntries` | 3395 | function |  | 4 |
| `braidMeshEntries` | 3427 | function |  | 2 |
| `prepareBraidBodyCache` | 3439 | function |  | 2 |
| `quantize` | 3448 | arrow |  | 21 |
| `sourceNormalAt` | 3460 | arrow |  | 1 |
| `clusterBoundary` | 3463 | arrow |  | 2 |
| `normalBuckets` | 3480 | arrow |  | 2 |
| `applyBucketPair` | 3512 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3543 | function |  | 2 |
| `annotateBraidObjTopology` | 3564 | function |  | 2 |
| `loadBraidMeshPreset` | 3584 | function |  | 3 |
| `createSplitControlHandle` | 3601 | function |  | 4 |
| `frameGuideModel` | 3616 | function |  | 2 |
| `syncScalpInputs` | 3641 | function |  | 2 |
| `syncScalpArtistInputs` | 3647 | function |  | 2 |
| `rootScalpOffsetDistance` | 3655 | function |  | 15 |
| `applyLockRootScalpOffset` | 3660 | function |  | 5 |
| `normalizeHairLayer` | 3676 | function |  | 28 |
| `layerOffsetForLock` | 3680 | function |  | 9 |
| `layerRootOffsetFactor` | 3685 | function |  | 13 |
| `layerOffsetWeight` | 3689 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3695 | function |  | 5 |
| `pointsWithLayerOffset` | 3704 | function |  | 3 |
| `layerDirectionForLock` | 3712 | function |  | 2 |
| `applyLayerOffset` | 3723 | function |  | 5 |
| `setLockHairLayer` | 3747 | function |  | 2 |
| `setGroupLayerOffset` | 3762 | function |  | 2 |
| `scalpArtistWeight` | 3774 | function |  | 3 |
| `scalpArtistScalesAt` | 3778 | function |  | 3 |
| `applyScalpArtistShape` | 3788 | function |  | 5 |
| `inverseScalpArtistShape` | 3806 | function |  | 2 |
| `updateScalpSurface` | 3833 | function |  | 3 |
| `setActiveScalpRegion` | 3843 | function |  | 2 |
| `clearScalpRegions` | 3855 | function |  | 2 |
| `scalpHitFromEvent` | 3872 | function |  | 3 |
| `updateScalpBrushCursor` | 3880 | function |  | 4 |
| `paintScalpAt` | 3895 | function |  | 3 |
| `beginScalpPaint` | 3962 | function |  | 2 |
| `updateScalpPaint` | 3971 | function |  | 1 |
| `endScalpPaint` | 3980 | function |  | 2 |
| `createScalpLattice` | 3987 | function |  | 2 |
| `resetScalpLattice` | 4012 | function |  | 1 |
| `updateScalpLatticeObjects` | 4024 | function |  | 7 |
| `quadraticWeights` | 4038 | function |  | 4 |
| `applyScalpLatticeDeformation` | 4043 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 4070 | function |  | 3 |
| `selectScalpLatticePoint` | 4085 | function |  | 2 |
| `beginScalpLatticeDrag` | 4100 | function |  | 2 |
| `updateScalpLatticeDrag` | 4118 | function |  | 1 |
| `endScalpLatticeDrag` | 4136 | function |  | 2 |
| `setHeadReferenceTransparency` | 4142 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4152 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4170 | function |  | 3 |
| `trianglePlaneIntersections` | 4178 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4199 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4225 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4235 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4247 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4271 | function |  | 3 |
| `createScalpBuilderPlanes` | 4286 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4318 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4357 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4380 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4392 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4404 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4409 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4421 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4531 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4556 | function |  | 5 |
| `syncEditedScalpSurface` | 4571 | function |  | 4 |
| `ensureEditedScalpSurface` | 4642 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4672 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4757 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4770 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4786 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4796 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4814 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4827 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4834 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4853 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4867 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4908 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4917 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4930 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4951 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 5088 | function |  | 2 |
| `scalpTemplateNeighbors` | 5096 | function |  | 2 |
| `smoothScalpVectorField` | 5108 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5122 | function |  | 2 |
| `upperContourCurve` | 5139 | function |  | 4 |
| `hermitePoint` | 5174 | function |  | 2 |
| `curveNetworkSection` | 5185 | function |  | 3 |
| `pointAlongSection` | 5214 | function |  | 3 |
| `longestStitchedContour` | 5220 | function |  | 2 |
| `nodeForPoint` | 5228 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5285 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5295 | function |  | 1 |
| `orderedRange` | 5307 | arrow |  | 3 |
| `clipSegment` | 5330 | arrow |  | 1 |
| `liftedPoint` | 5353 | arrow |  | 5 |
| `boundaryCorner` | 5358 | arrow |  | 4 |
| `surfaceCurveBetween` | 5367 | arrow |  | 1 |
| `addSurfaceConnector` | 5390 | arrow |  | 2 |
| `sideContourAtDepth` | 5458 | arrow |  | 3 |
| `addSurfacePatch` | 5492 | arrow |  | 1 |
| `addCenterBridgePatch` | 5572 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5680 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5715 | function |  | 1 |
| `generatedScalpObjContent` | 5805 | function |  | 2 |
| `generateScalpFromBuilder` | 5819 | function |  | 1 |
| `orderedDepthRange` | 5855 | arrow |  | 7 |
| `resetScalpBuilder` | 5984 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5999 | function |  | 1 |
| `beginScalpBuilderInput` | 6013 | function |  | 2 |
| `updateScalpBuilderStroke` | 6014 | function |  | 1 |
| `finishScalpBuilderStroke` | 6015 | function |  | 2 |
| `setScalpBuilderEditing` | 6017 | function |  | 10 |
| `updateScalpEditingVisibility` | 6051 | function |  | 12 |
| `exitSetupEditors` | 6145 | function |  | 7 |
| `setCapsuleGuideEditing` | 6154 | function |  | 5 |
| `syncAppMenuVisibility` | 6182 | function |  | 3 |
| `closeAppMenus` | 6187 | function |  | 6 |
| `setAppMenuOpen` | 6198 | function |  | 3 |
| `setTurntableActive` | 6205 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6214 | function |  | 9 |
| `selectedReferenceImage` | 6218 | function |  | 20 |
| `normalizeReferenceCrop` | 6224 | function |  | 8 |
| `referenceCropIsFull` | 6232 | function |  | 3 |
| `referencePlaneFrontAxis` | 6237 | function |  | 4 |
| `referencePlanePlacement` | 6246 | function |  | 4 |
| `migratedReferencePlanePosition` | 6261 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6281 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6298 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6314 | function |  | 2 |
| `snappedReferenceImageView` | 6337 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6343 | function |  | 5 |
| `applyReferenceImageRuntime` | 6359 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6402 | function |  | 6 |
| `createReferenceImageRuntime` | 6410 | function |  | 3 |
| `addReferenceImage` | 6479 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6531 | function |  | 3 |
| `disposeReferenceImage` | 6550 | function |  | 2 |
| `clearReferenceImages` | 6554 | function |  | 2 |
| `serializeReferenceImage` | 6561 | function |  | 1 |
| `setReferenceImageType` | 6589 | function |  | 2 |
| `attachReferenceImageTransform` | 6633 | function |  | 6 |
| `selectReferenceImage` | 6647 | function |  | 12 |
| `placeReferencePlane` | 6670 | function |  | 2 |
| `setReferencePlaneInFront` | 6681 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6691 | function |  | 4 |
| `renderReferenceImagePanel` | 6710 | function |  | 20 |
| `setOutlinerTab` | 6757 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6775 | function |  | 4 |
| `componentEditModeActive` | 6779 | function |  | 38 |
| `selectionToolSupportsPicking` | 6783 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6788 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6804 | function |  | 2 |
| `setViewportSelectionMode` | 6834 | function |  | 4 |
| `setViewportEditMode` | 6846 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6888 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6902 | function |  | 8 |
| `outlinerGuides` | 6914 | function |  | 3 |
| `guideOutlinerLabel` | 6921 | function |  | 2 |
| `normalizeOutlinerName` | 6931 | function |  | 4 |
| `beginOutlinerRename` | 6936 | function |  | 2 |
| `finish` | 6947 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6977 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6987 | function |  | 2 |
| `renderGuideOutliner` | 7022 | function |  | 10 |
| `referenceOutlinerGroup` | 7080 | function |  | 2 |
| `renderReferenceOutliner` | 7084 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7201 | function |  | 5 |
| `readReferenceImageFile` | 7206 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7230 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7237 | function |  | 3 |
| `dragContainsReferenceImage` | 7282 | function |  | 3 |
| `setReferenceImageDragActive` | 7293 | function |  | 9 |
| `referenceDropDestination` | 7301 | function |  | 2 |
| `viewportOverlayDropPosition` | 7307 | function |  | 2 |
| `setReferenceDropHover` | 7316 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7334 | function |  | 2 |
| `referenceOverlayAtPointer` | 7354 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7372 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7385 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7431 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7481 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7503 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7514 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7540 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7549 | function |  | 2 |
| `referenceCropCursor` | 7564 | function |  | 3 |
| `updateReferenceCropHandles` | 7570 | function |  | 5 |
| `referenceCropSourcePoint` | 7591 | function |  | 2 |
| `beginReferenceCrop` | 7598 | function |  | 1 |
| `updateReferenceCrop` | 7636 | function |  | 1 |
| `finishReferenceCrop` | 7668 | function |  | 4 |
| `setHeadSetupEditing` | 7686 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7702 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7711 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7721 | function |  | 4 |
| `setScalpGuideVisibility` | 7727 | function |  | 12 |
| `currentGuideViewMode` | 7735 | function |  | 3 |
| `updateGuideViewToggle` | 7743 | function |  | 5 |
| `setGuideViewMode` | 7759 | function |  | 3 |
| `cycleGuideViewMode` | 7770 | function |  | 1 |
| `hideGuideViewContextMenu` | 7775 | function |  | 6 |
| `showGuideViewContextMenu` | 7779 | function |  | 1 |
| `strandPassesDisplayFilters` | 7792 | function |  | 4 |
| `strandVisibleForDisplay` | 7801 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7806 | function |  | 2 |
| `lockedStrandsExist` | 7810 | function |  | 3 |
| `hiddenStrandsExist` | 7814 | function |  | 2 |
| `hideSelectedStrands` | 7818 | function |  | 2 |
| `unhideHiddenStrands` | 7828 | function |  | 2 |
| `strandIsolationActive` | 7837 | function |  | 7 |
| `setStrandIsolation` | 7841 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7853 | function |  | 3 |
| `syncVisibilityParent` | 7864 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7871 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7900 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7907 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7927 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7950 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7958 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7965 | function |  | 9 |
| `setScalpLatticeEditing` | 7976 | function |  | 4 |
| `setScalpShapeEditing` | 7991 | function |  | 9 |
| `setScalpPaintEditing` | 8009 | function |  | 7 |
| `defaultCurveLatticePoints` | 8033 | function |  | 3 |
| `flatCurveLatticePoints` | 8059 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 8068 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 8092 | function |  | 4 |
| `horizontalValue` | 8097 | arrow |  | 1 |
| `blendedSample` | 8108 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8141 | function |  | 2 |
| `curveLatticeControlPoint` | 8156 | function |  | 9 |
| `circularArcTangent` | 8160 | function |  | 4 |
| `arcLengthTo` | 8191 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8203 | function |  | 3 |
| `sampleHermiteCurve` | 8242 | function |  | 10 |
| `sampleCurveLattice` | 8259 | function |  | 6 |
| `curveLatticeNormal` | 8278 | function |  | 1 |
| `createCurveLatticeGeometry` | 8289 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8318 | function |  | 3 |
| `appendCurve` | 8320 | arrow |  | 4 |
| `sample` | 8322 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8349 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8365 | function |  | 3 |
| `addPicker` | 8367 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8406 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8419 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8423 | function |  | 3 |
| `curveLatticeEditablePoint` | 8441 | function |  | 13 |
| `curveLatticePointSection` | 8448 | function |  | 3 |
| `curveLatticeRestPoint` | 8459 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8465 | function |  | 7 |
| `curveLatticeRootColumns` | 8471 | function |  | 3 |
| `curveTangentsForPoints` | 8478 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8490 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8527 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8553 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8570 | function |  | 3 |
| `resampleGrid` | 8580 | arrow |  | 2 |
| `controlPointIsSelected` | 8607 | function |  | 7 |
| `clearMultiPointSelection` | 8615 | function |  | 9 |
| `createCurveLatticeHandles` | 8619 | function |  | 4 |
| `addCurveLattice` | 8641 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8750 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8781 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8787 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8826 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8847 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8864 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8873 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8880 | function |  | 1 |
| `selectCurveLatticeLoop` | 8899 | function |  | 3 |
| `selectCurveLatticePoint` | 8928 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8943 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8985 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 9006 | function |  | 3 |
| `curveLatticeColumnPoints` | 9049 | function |  | 3 |
| `groupCurveControlIndices` | 9058 | function |  | 4 |
| `groupCurveControlPoints` | 9064 | function |  | 2 |
| `updateGroupCurveDisplay` | 9070 | function |  | 3 |
| `ensureGroupCurveDisplay` | 9080 | function |  | 2 |
| `groupCurveDeformationPairs` | 9102 | function |  | 2 |
| `curveLatticeDeformationPairs` | 9109 | function |  | 2 |
| `appendPairs` | 9111 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9122 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9141 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9162 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9181 | function |  | 2 |
| `capsuleGuideCapHeight` | 9215 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9219 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9224 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9228 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9240 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9256 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9262 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9288 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9318 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9372 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9393 | function |  | 7 |
| `vertex` | 9407 | function |  | 4 |
| `addFace` | 9413 | function |  | 3 |
| `addRing` | 9431 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9486 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9496 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9561 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9607 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9620 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9641 | function |  | 3 |
| `capsuleGuidePointDistances` | 9646 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9667 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9687 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9692 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9698 | function |  | 3 |
| `capsuleGuideAccentColor` | 9703 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9708 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9719 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9731 | function |  | 2 |
| `createCapsuleGuideHandles` | 9763 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9786 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9805 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9812 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9828 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9845 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9860 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9897 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9913 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9930 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9936 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9963 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9975 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9994 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 10039 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 10074 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 10088 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 10094 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10111 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10122 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10133 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10163 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10173 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10214 | function |  | 3 |
| `createQuadCageGeometry` | 10230 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10254 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10274 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10285 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10338 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10376 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10386 | function |  | 4 |
| `addCapsuleGuide` | 10394 | function |  | 4 |
| `addGuide` | 10463 | function |  | 1 |
| `createGuideGeometry` | 10524 | function |  | 4 |
| `selectGuide` | 10579 | function |  | 17 |
| `updateGuideControlsVisibility` | 10647 | function |  | 10 |
| `updateViewportToolVisibility` | 10664 | function |  | 7 |
| `getSelectedGuide` | 10703 | function |  | 34 |
| `selectedViewportFocusBounds` | 10707 | function |  | 2 |
| `frameViewportBounds` | 10721 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10751 | function |  | 2 |
| `fullSceneFocusBounds` | 10755 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10771 | function |  | 3 |
| `cycleViewportFraming` | 10780 | function |  | 2 |
| `syncGuideInputs` | 10798 | function |  | 5 |
| `updateGuideGeometry` | 10841 | function |  | 3 |
| `sculptBrushToolActive` | 10862 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10866 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10870 | function |  | 3 |
| `effectiveSculptBrushTool` | 10874 | function |  | 13 |
| `updateSculptScaleModeRow` | 10880 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10885 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10907 | function |  | 5 |
| `setActiveTool` | 10916 | function |  | 19 |
| `setDrawStrandMode` | 11054 | function |  | 2 |
| `setObjectSpaceEditing` | 11064 | function |  | 7 |
| `setHierarchyEditing` | 11080 | function |  | 4 |
| `setProportionalEditing` | 11092 | function |  | 5 |
| `beginProportionalSizeEdit` | 11111 | function |  | 3 |
| `updateProportionalSizeEdit` | 11123 | function |  | 2 |
| `endProportionalSizeEdit` | 11134 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11141 | function |  | 2 |
| `refreshProportionalPreview` | 11149 | function |  | 4 |
| `activeBrushSizeInput` | 11159 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11168 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11180 | function |  | 2 |
| `beginBrushSizeDrag` | 11198 | function |  | 1 |
| `updateBrushSizeDrag` | 11225 | function |  | 1 |
| `finishBrushSizeDrag` | 11246 | function |  | 2 |
| `updateInteractionLocks` | 11263 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11272 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11281 | function |  | 2 |
| `configureTransformControls` | 11312 | function |  | 16 |
| `pullMoveActive` | 11320 | function |  | 9 |
| `updatePullGuideVisual` | 11324 | function |  | 4 |
| `attachTransformForCurvePoint` | 11340 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11364 | function |  | 7 |
| `strandObjectRootIndex` | 11380 | function |  | 3 |
| `strandObjectRoot` | 11389 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11393 | function |  | 2 |
| `attachStrandObjectTransform` | 11398 | function |  | 6 |
| `guideObjectPivot` | 11421 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11432 | function |  | 2 |
| `attachGuideObjectTransform` | 11437 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11456 | function |  | 2 |
| `beginGuideObjectTransform` | 11484 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11491 | function |  | 2 |
| `updateGuideObjectTransform` | 11513 | function |  | 2 |
| `finishGuideObjectTransform` | 11546 | function |  | 2 |
| `clonePlacementFrame` | 11555 | function |  | 2 |
| `cloneOptionalVectors` | 11567 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11571 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11588 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11603 | function |  | 2 |
| `strandObjectTransformOperators` | 11619 | function |  | 4 |
| `transformPoint` | 11627 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11634 | arrow |  | 0 |
| `transformNormal` | 11640 | arrow |  | 10 |
| `transformDirection` | 11650 | arrow |  | 7 |
| `worldMatrixForPivot` | 11662 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11668 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11684 | function |  | 6 |
| `beginStrandObjectTransform` | 11698 | function |  | 2 |
| `updateStrandObjectTransform` | 11736 | function |  | 2 |
| `commitStrandObjectTransform` | 11785 | function |  | 2 |
| `mapPoints` | 11798 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11832 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11846 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11869 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11882 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11897 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11923 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11972 | function |  | 2 |
| `beginHandleEdit` | 11981 | function |  | 5 |
| `branchSurfaceFrameQuat` | 12030 | function |  | 3 |
| `applyBranchRigidRootMove` | 12047 | function |  | 3 |
| `syncBranchRootHandleFrame` | 12084 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 12095 | function |  | 3 |
| `multiPointHandleEditActive` | 12106 | function |  | 7 |
| `applyMultiMove` | 12110 | function |  | 5 |
| `applyMultiRotate` | 12116 | function |  | 2 |
| `applyMultiScale` | 12125 | function |  | 2 |
| `applyHierarchicalMove` | 12134 | function |  | 3 |
| `applySingleMove` | 12146 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12150 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12167 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12176 | function |  | 3 |
| `changed` | 12186 | arrow |  | 1 |
| `applyPullMove` | 12228 | function |  | 3 |
| `pullHeadCollisionContext` | 12236 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12255 | function |  | 2 |
| `applyProportionalMove` | 12278 | function |  | 3 |
| `viewPlaneNormal` | 12289 | function |  | 20 |
| `isCameraInSnappedView` | 12293 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12301 | function |  | 10 |
| `updateViewPlaneGrid` | 12305 | function |  | 14 |
| `setViewPlaneMove` | 12362 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12373 | function |  | 2 |
| `rayFromViewportEvent` | 12381 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12389 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12399 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12410 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12423 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12442 | function |  | 4 |
| `beginViewPlaneMove` | 12449 | function |  | 3 |
| `updateViewPlaneMove` | 12513 | function |  | 1 |
| `endViewPlaneMove` | 12578 | function |  | 7 |
| `applyHierarchicalRotate` | 12597 | function |  | 2 |
| `rotateGuideNormal` | 12604 | arrow |  | 4 |
| `applySingleRotate` | 12642 | function |  | 2 |
| `applyProportionalRotate` | 12646 | function |  | 2 |
| `applyHierarchicalScale` | 12666 | function |  | 2 |
| `applySingleScale` | 12676 | function |  | 2 |
| `applyProportionalScale` | 12680 | function |  | 2 |
| `setPointScale` | 12696 | function |  | 8 |
| `proportionalWeight` | 12705 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12717 | function |  | 5 |
| `strandInfluenceColor` | 12723 | function |  | 17 |
| `beginRelaxEdit` | 12748 | function |  | 3 |
| `updateRelaxEdit` | 12777 | function |  | 1 |
| `endRelaxEdit` | 12837 | function |  | 1 |
| `disposeGuide` | 12847 | function |  | 3 |
| `removeGuideObjects` | 12875 | function |  | 3 |
| `strandRadiusAt` | 12889 | function |  | 5 |
| `strandProfileTopologyAt` | 12906 | function |  | 8 |
| `strandCurveParameters` | 12948 | function |  | 5 |
| `widthProfileAt` | 12958 | arrow |  | 1 |
| `braidFrameAt` | 12996 | function |  | 5 |
| `braidFrameAtExtended` | 13006 | function |  | 2 |
| `createBraidProfileProjector` | 13015 | function |  | 2 |
| `project` | 13031 | arrow |  | 17 |
| `createBraidGeometry` | 13046 | function |  | 2 |
| `deformationAt` | 13081 | function |  | 3 |
| `widthFor` | 13090 | arrow |  | 3 |
| `depthFor` | 13094 | arrow |  | 3 |
| `outputVertex` | 13126 | function |  | 7 |
| `appendAuthoredCap` | 13234 | function |  | 3 |
| `outputCapVertex` | 13241 | arrow |  | 6 |
| `capBoundary` | 13332 | function |  | 3 |
| `strandGeometryCurve` | 13394 | function |  | 15 |
| `strandGeometryFrameAt` | 13420 | function |  | 19 |
| `transportedStrandFrameAt` | 13483 | function |  | 7 |
| `twistOverrideAt` | 13486 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13514 | function |  | 2 |
| `weldPanelGeometryData` | 13550 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13590 | function |  | 3 |
| `surfacePanelPoint` | 13605 | function |  | 3 |
| `createPanelStrandGeometry` | 13628 | function |  | 2 |
| `addQuad` | 13662 | arrow |  | 6 |
| `near` | 13666 | arrow |  | 6 |
| `panelWidthAt` | 13696 | arrow |  | 6 |
| `panelThicknessAt` | 13705 | arrow |  | 6 |
| `panelFrameAt` | 13714 | arrow |  | 1 |
| `rawPanelPoint` | 13732 | arrow |  | 1 |
| `panelPoint` | 13752 | arrow |  | 2 |
| `addPatch` | 13758 | arrow |  | 1 |
| `splitOpening` | 13809 | arrow |  | 2 |
| `uStart` | 13833 | arrow |  | 1 |
| `uEnd` | 13836 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13874 | function |  | 3 |
| `inside` | 13875 | arrow |  | 2 |
| `pushOrientedTriangle` | 13897 | function |  | 7 |
| `triangulatePolygon3D` | 13908 | function |  | 1 |
| `orientedQuadFace` | 13948 | function |  | 2 |
| `createSplitStrandGeometry` | 13956 | function |  | 2 |
| `fusedIndexAt` | 14113 | arrow |  | 0 |
| `createHairCardGeometry` | 14162 | function |  | 2 |
| `createPolyGeometry` | 14261 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14288 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14297 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14344 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14352 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14368 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14377 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14388 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14396 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14406 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14426 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14449 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14528 | function |  | 2 |
| `pushBoundary` | 14557 | arrow |  | 5 |
| `boundaryAt` | 14575 | arrow |  | 3 |
| `hermite` | 14597 | arrow |  | 2 |
| `emitBottomMidRow` | 14642 | arrow |  | 2 |
| `emitTopMidRow` | 14741 | arrow |  | 2 |
| `sideHoleVertex` | 14783 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14832 | arrow |  | 2 |
| `emitFillStrip` | 14903 | arrow |  | 2 |
| `fillSide` | 14914 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14958 | arrow |  | 2 |
| `edgeDirection` | 14982 | arrow |  | 1 |
| `positionAt` | 15041 | arrow |  | 1 |
| `createBranchChildGeometry` | 15092 | function |  | 2 |
| `createCompoundStrandGeometry` | 15302 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15553 | function |  | 2 |
| `createHairGeometry` | 15584 | function |  | 6 |
| `createBaseHairGeometry` | 15636 | function |  | 3 |
| `hairMaterialDefinition` | 15754 | function |  | 4 |
| `materialForLock` | 15758 | function |  | 8 |
| `activeHairMaterialDefinition` | 15762 | function |  | 11 |
| `strandDisplayColor` | 15768 | function |  | 14 |
| `setAnimeHairBaseColor` | 15786 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15799 | function |  | 2 |
| `createHairMaterial` | 15839 | function |  | 5 |
| `createStrandSelectionOutline` | 15881 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15915 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15924 | function |  | 6 |
| `refreshMaterialUsers` | 15951 | function |  | 6 |
| `renderHairMaterialOutliner` | 15960 | function |  | 5 |
| `renderHairMaterialOptions` | 15990 | function |  | 3 |
| `syncHairMaterialEditor` | 16000 | function |  | 9 |
| `createProjectHairMaterial` | 16026 | function |  | 3 |
| `deleteActiveHairMaterial` | 16046 | function |  | 2 |
| `createHairTopologyGeometry` | 16064 | function |  | 4 |
| `createHairTopologyOverlay` | 16085 | function |  | 3 |
| `groupDefaultsFor` | 16132 | function |  | 9 |
| `creationToolActive` | 16139 | function |  | 8 |
| `activeCreationShapeDefaults` | 16143 | function |  | 11 |
| `activeStrandShapeTarget` | 16149 | function |  | 5 |
| `curvePolylineLength` | 16153 | function |  | 2 |
| `curvePolylineLengths` | 16161 | function |  | 3 |
| `samplePolylineDistance` | 16169 | function |  | 2 |
| `applyProjectedCurveLength` | 16179 | function |  | 4 |
| `clearRegionLengthBaseline` | 16210 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16217 | function |  | 2 |
| `setGroupLengthScale` | 16225 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16263 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16295 | function |  | 1 |
| `activeSweepProfile` | 16304 | function |  | 9 |
| `activeSweepProfileTarget` | 16311 | function |  | 6 |
| `trimmedSweepProfile` | 16318 | function |  | 7 |
| `roundedLeft` | 16327 | arrow |  | 1 |
| `roundedRight` | 16333 | arrow |  | 1 |
| `activeProfileOffset` | 16350 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16357 | function |  | 3 |
| `profileToCanvas` | 16374 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16378 | function |  | 11 |
| `sampleSweepProfile` | 16387 | function |  | 7 |
| `createSweepProfileTopology` | 16408 | function |  | 5 |
| `renderProfilePreview` | 16450 | function |  | 8 |
| `renderHairCardCoveragePath` | 16469 | function |  | 3 |
| `activeTaperTarget` | 16484 | function |  | 15 |
| `twistCurveEditing` | 16491 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16495 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16499 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16503 | function |  | 17 |
| `taperAsymmetryKey` | 16507 | function |  | 12 |
| `taperSecondaryKey` | 16511 | function |  | 11 |
| `activeTaperCurve` | 16515 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16526 | function |  | 6 |
| `taperSamples` | 16536 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16543 | function |  | 2 |
| `renderTaperPreview` | 16565 | function |  | 13 |
| `renderTwistCurvePreview` | 16601 | function |  | 5 |
| `cloneShapePresetValue` | 16619 | function |  | 66 |
| `shapeValuesMatch` | 16623 | function |  | 5 |
| `shapeTargetForSelect` | 16631 | function |  | 4 |
| `loadCustomShapePresets` | 16641 | function |  | 2 |
| `saveCustomShapePresets` | 16652 | function |  | 4 |
| `shapePresetLabel` | 16660 | function |  | 4 |
| `setupShapePresetControls` | 16665 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16690 | function |  | 3 |
| `syncShapePresetSelects` | 16696 | function |  | 8 |
| `populateShapePresetSelects` | 16717 | function |  | 5 |
| `applyShapePreset` | 16744 | function |  | 2 |
| `openSaveShapePreset` | 16781 | function |  | 2 |
| `commitCustomShapePreset` | 16806 | function |  | 2 |
| `openRemoveShapePreset` | 16829 | function |  | 2 |
| `commitRemoveShapePreset` | 16842 | function |  | 2 |
| `taperPointToCanvas` | 16858 | function |  | 4 |
| `canvasToTaperPoint` | 16875 | function |  | 2 |
| `clearTaperMeshPoints` | 16911 | function |  | 2 |
| `taperMeshPointFrame` | 16921 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16931 | function |  | 4 |
| `twistMeshGraphAxis` | 16939 | function |  | 4 |
| `addTwistMeshCurvePath` | 16943 | function |  | 2 |
| `appendSegment` | 16964 | arrow |  | 1 |
| `appendFill` | 16967 | arrow |  | 1 |
| `appendSignedSection` | 16973 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 17022 | function |  | 6 |
| `updateTaperMeshPoints` | 17059 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17138 | function |  | 5 |
| `renderTaperCurveEditor` | 17156 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17228 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17242 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17258 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17292 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17301 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17312 | function |  | 2 |
| `applyTaperCurveEdit` | 17320 | function |  | 10 |
| `openTaperCurveEditor` | 17428 | function |  | 3 |
| `closeTaperCurveEditor` | 17473 | function |  | 6 |
| `updateViewportStatsVisibility` | 17486 | function |  | 6 |
| `canvasToProfile` | 17505 | function |  | 2 |
| `renderSweepProfileEditor` | 17515 | function |  | 7 |
| `applySweepProfileEdit` | 17558 | function |  | 8 |
| `openSweepProfileEditor` | 17585 | function |  | 1 |
| `closeSweepProfileEditor` | 17620 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17629 | function |  | 2 |
| `addLock` | 17644 | function |  | 19 |
| `mirroredScalpRegion` | 17847 | function |  | 5 |
| `mirroredVector` | 17856 | function |  | 12 |
| `mirroredPlacementFrame` | 17860 | function |  | 2 |
| `mirrorPartnerFor` | 17873 | function |  | 40 |
| `decoupleMirrorPartner` | 17877 | function |  | 2 |
| `createMirrorPartner` | 17885 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17981 | function |  | 6 |
| `mirroredClumpPartners` | 17986 | function |  | 6 |
| `createMirroredClump` | 17992 | function |  | 3 |
| `decoupleMirroredClump` | 18014 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 18023 | function |  | 6 |
| `syncActiveMirror` | 18188 | function |  | 25 |
| `setMirrorXEditing` | 18200 | function |  | 6 |
| `snapshotState` | 18224 | function |  | 7 |
| `scalpTriangleRegion` | 18481 | function |  | 4 |
| `closestPointOnActiveScalp` | 18494 | function |  | 12 |
| `rootAttachmentFrame` | 18566 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18578 | function |  | 4 |
| `resolveRootAttachment` | 18596 | function |  | 4 |
| `curvePointsToRootLocal` | 18636 | function |  | 2 |
| `curvePointsFromRootLocal` | 18648 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18656 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18672 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18702 | function |  | 2 |
| `createRootAttachment` | 18714 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18744 | function |  | 4 |
| `rootAttachmentToData` | 18771 | function |  | 2 |
| `rootAttachmentFromData` | 18799 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18838 | function |  | 2 |
| `remapPoint` | 18853 | arrow |  | 1 |
| `remapVector` | 18854 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18883 | function |  | 2 |
| `importHeadMeshFile` | 18900 | function |  | 3 |
| `importFullBodyMeshFile` | 18923 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18948 | function |  | 1 |
| `importedBooleanPreference` | 18981 | function |  | 11 |
| `loadPreferencesAndPresets` | 18985 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 19055 | function |  | 1 |
| `openHairProjectFile` | 19098 | function |  | 4 |
| `dragContainsApplicationFile` | 19156 | function |  | 3 |
| `safelyRememberRecentProject` | 19165 | function |  | 2 |
| `renderRecentProjectsMenu` | 19174 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19206 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19231 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19235 | function |  | 2 |
| `pushUndoState` | 19251 | function |  | 119 |
| `undoLastAction` | 19258 | function |  | 2 |
| `redoLastAction` | 19272 | function |  | 2 |
| `updateHistoryButtons` | 19286 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19291 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19308 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19315 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19353 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19430 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19456 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19488 | function |  | 2 |
| `finalizeStateRestore` | 19529 | function |  | 2 |
| `restoreState` | 19536 | function |  | 5 |
| `disposeAllEditableObjects` | 19560 | function |  | 2 |
| `restoreLock` | 19581 | function |  | 4 |
| `restoreGuide` | 19798 | function |  | 2 |
| `vectorToData` | 19859 | function |  | 29 |
| `dataToVector` | 19863 | function |  | 31 |
| `frameToData` | 19867 | function |  | 2 |
| `frameFromData` | 19879 | function |  | 2 |
| `applyPresetSelection` | 19891 | function |  | 2 |
| `drawPresetThumbnail` | 19922 | function |  | 1 |
| `fillHair` | 19937 | arrow |  | 9 |
| `strand` | 19949 | arrow |  | 31 |
| `bun` | 19967 | arrow |  | 2 |
| `braid` | 20002 | arrow |  | 2 |
| `renderPresetLibrary` | 20091 | function |  | 3 |
| `setPresetLibraryOpen` | 20150 | function |  | 6 |
| `average` | 20163 | function |  | 4 |
| `fitPointAttributes` | 20167 | function |  | 9 |
| `rebuildCurveObjects` | 20196 | function |  | 10 |
| `createCurvePoints` | 20208 | function |  | 2 |
| `addGeneratedBangPreset` | 20217 | function |  | 1 |
| `sampleScalpQuad` | 20310 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20334 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20383 | function |  | 1 |
| `columns` | 20384 | arrow |  | 1 |
| `layer` | 20388 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20602 | function |  | 2 |
| `addBraidedBobPreset` | 20638 | function |  | 1 |
| `evenColumns` | 20639 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20855 | function |  | 1 |
| `scalpSeed` | 20878 | arrow |  | 1 |
| `createBowlCutPoints` | 21165 | function |  | 2 |
| `addBowlCutPreset` | 21203 | function |  | 1 |
| `scalpRegionAtHit` | 21269 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21281 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21288 | function |  | 12 |
| `braidStrokeActive` | 21295 | function |  | 9 |
| `proceduralDrawActive` | 21299 | function |  | 3 |
| `panelStrokeActive` | 21303 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21307 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21311 | function |  | 30 |
| `normalizedLiveSurfaceSelection` | 21315 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21321 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21325 | function |  | 8 |
| `setDrawSurfaceDynamicEnabled` | 21329 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21333 | function |  | 3 |
| `liveSurfaceStrandId` | 21343 | function |  | 4 |
| `liveSurfaceStrand` | 21347 | function |  | 4 |
| `liveSurfaceGuideId` | 21352 | function |  | 3 |
| `guideSupportsLiveSurface` | 21356 | function |  | 2 |
| `liveSurfaceGuide` | 21363 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21370 | function |  | 12 |
| `activeStrokeScalpOffset` | 21410 | function |  | 4 |
| `activeStrokeBrushSize` | 21416 | function |  | 10 |
| `activeStrokeBrushDepth` | 21422 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21428 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21436 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21446 | function |  | 13 |
| `worldNormalAtHit` | 21485 | function |  | 6 |
| `selectedPolyMesh` | 21493 | function |  | 10 |
| `addPolyLock` | 21498 | function |  | 2 |
| `ensurePolyMesh` | 21517 | function |  | 3 |
| `polySurfaceSample` | 21521 | function |  | 4 |
| `polyTargetAtEvent` | 21532 | function |  | 6 |
| `refreshPolyMesh` | 21558 | function |  | 10 |
| `ensurePolyFillPreview` | 21567 | function |  | 2 |
| `clearPolyFillPreview` | 21604 | function |  | 17 |
| `polyFillCandidateForEvent` | 21609 | function |  | 3 |
| `showPolyFillPreview` | 21629 | function |  | 2 |
| `updatePolyFillPreview` | 21655 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21680 | function |  | 5 |
| `fillPolyGap` | 21690 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21701 | function |  | 2 |
| `projectPolyRelaxPoint` | 21721 | function |  | 2 |
| `removePolyPointAttributes` | 21765 | function |  | 3 |
| `deletePolyComponent` | 21774 | function |  | 2 |
| `addPolyPoint` | 21797 | function |  | 4 |
| `appendPolyStrokeRow` | 21806 | function |  | 4 |
| `beginPolyBrushPointer` | 21826 | function |  | 1 |
| `finishPolyAltDelete` | 21912 | function |  | 1 |
| `updatePolyBrushStroke` | 21926 | function |  | 1 |
| `finishPolyBrushStroke` | 22016 | function |  | 4 |
| `drawScalpRegionAtEvent` | 22053 | function |  | 2 |
| `drawSampleFromHit` | 22076 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 22090 | function |  | 3 |
| `strokeLength` | 22127 | function |  | 9 |
| `resampleDrawStroke` | 22133 | function |  | 2 |
| `processedDrawStroke` | 22165 | function |  | 8 |
| `strokeSurfaceNormals` | 22194 | function |  | 7 |
| `drawClumpFrame` | 22205 | function |  | 4 |
| `nearestCurveParameter` | 22214 | function |  | 2 |
| `drawClumpSampleNormal` | 22228 | function |  | 6 |
| `drawClumpTemplateVector` | 22237 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22243 | function |  | 3 |
| `drawClumpStrandMaps` | 22259 | function |  | 4 |
| `nextClumpName` | 22314 | function |  | 6 |
| `initializeClumpShape` | 22321 | function |  | 5 |
| `stableClumpVariation` | 22332 | function |  | 3 |
| `createClumpFromLocks` | 22344 | function |  | 7 |
| `addLockToClump` | 22369 | function |  | 4 |
| `stableBranchBaseNormals` | 22387 | function |  | 4 |
| `ensureBranchParentNormalField` | 22398 | function |  | 2 |
| `branchParentFrame` | 22404 | function |  | 7 |
| `branchLocalVector` | 22416 | function |  | 3 |
| `branchWorldVector` | 22420 | function |  | 4 |
| `captureBranchLocalState` | 22426 | function |  | 6 |
| `enforceBranchRootPosition` | 22454 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22504 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22531 | function |  | 2 |
| `clampRegionParam` | 22578 | function |  | 113 |
| `branchRootRegionFromParam` | 22585 | function |  | 4 |
| `cloneBranchRootRegion` | 22608 | function |  | 5 |
| `flip` | 22610 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22643 | function |  | 8 |
| `setBranchRootRegionPoint` | 22674 | function |  | 3 |
| `branchRegionUVToCanvas` | 22710 | function |  | 10 |
| `branchRegionCanvasToUV` | 22713 | function |  | 4 |
| `openBranchRegionEditor` | 22719 | function |  | 2 |
| `closeBranchRegionEditor` | 22733 | function |  | 2 |
| `retargetBranchRegionEditor` | 22739 | function |  | 2 |
| `renderBranchRegionEditor` | 22744 | function |  | 9 |
| `applyBranchRegionView` | 22832 | function |  | 6 |
| `resetBranchRegionZoom` | 22835 | function |  | 1 |
| `branchRegionNavAction` | 22841 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22855 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22875 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22879 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22905 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22917 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22922 | function |  | 1 |
| `branchRegionEventUV` | 22942 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22950 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 23055 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23188 | function |  | 1 |
| `pointerToNdc` | 23193 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23204 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23218 | function |  | 1 |
| `endBranchSweepStartDrag` | 23241 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23248 | function |  | 5 |
| `gridProfileSkipCol` | 23275 | function |  | 3 |
| `branchRootRegionSurface` | 23284 | function |  | 6 |
| `toGridCol` | 23309 | arrow |  | 5 |
| `toRow` | 23313 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23368 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23388 | function |  | 2 |
| `pointAt` | 23394 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23421 | function |  | 3 |
| `applyBranchRootOffset` | 23493 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23512 | function |  | 3 |
| `branchChildrenFor` | 23532 | function |  | 9 |
| `detachBranch` | 23536 | function |  | 2 |
| `updateBranchChildren` | 23547 | function |  | 4 |
| `clumpDirectMembers` | 23590 | function |  | 3 |
| `clumpMembersForGuide` | 23595 | function |  | 6 |
| `clumpGuideForLock` | 23599 | function |  | 13 |
| `proceduralGuideForLock` | 23604 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23611 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23618 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23625 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23637 | function |  | 2 |
| `applyProceduralBranchSettings` | 23650 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23689 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23705 | function |  | 3 |
| `createProceduralAccessoryLock` | 23719 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23771 | function |  | 2 |
| `clumpFrameAt` | 23822 | function |  | 5 |
| `commitClumpMemberRestState` | 23830 | function |  | 10 |
| `updateClumpMembers` | 23913 | function |  | 10 |
| `dissolveClump` | 24017 | function |  | 6 |
| `detachLockFromClump` | 24054 | function |  | 4 |
| `updateDrawVolumePreview` | 24080 | function |  | 5 |
| `hideDrawClumpPreviews` | 24104 | function |  | 5 |
| `resetDrawVolumePreview` | 24110 | function |  | 3 |
| `updateDrawStrandPreview` | 24116 | function |  | 23 |
| `continueFromTipEnabled` | 24335 | function |  | 2 |
| `selectedTipContinuationLock` | 24341 | function |  | 3 |
| `selectedDrawBranchPoint` | 24354 | function |  | 3 |
| `canBranchDrawFromLock` | 24371 | function |  | 3 |
| `beginDrawStrandStroke` | 24378 | function |  | 2 |
| `beginDrawFreePlane` | 24503 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24517 | function |  | 2 |
| `updateDrawStrandStroke` | 24542 | function |  | 1 |
| `createDrawnLock` | 24588 | function |  | 3 |
| `setting` | 24592 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24660 | function |  | 4 |
| `createDrawnBraid` | 24668 | function |  | 2 |
| `createDrawnStrand` | 24725 | function |  | 2 |
| `createDrawnPanel` | 24852 | function |  | 2 |
| `surfaceLatticeNormal` | 24902 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24917 | function |  | 3 |
| `createViewportSurface` | 24982 | function |  | 2 |
| `loftSurfaceProfilePoints` | 25011 | function |  | 6 |
| `hideLoftSurfacePreviews` | 25017 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 25024 | function |  | 4 |
| `updateLoftSurfacePreview` | 25033 | function |  | 5 |
| `resetLoftSurfaceDraft` | 25065 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 25081 | function |  | 3 |
| `cloneCurveSurfaceSource` | 25099 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25121 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25147 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25157 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25161 | function |  | 2 |
| `curveSurfacePreviewLock` | 25170 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25193 | function |  | 2 |
| `hideCurveSurfacePreview` | 25209 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25221 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25226 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25235 | function |  | 3 |
| `curveSurfaceSideVector` | 25273 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25286 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25294 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25307 | function |  | 5 |
| `updateCurveSurfacePreview` | 25327 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25389 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25411 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25426 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25474 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25509 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25541 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25599 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25676 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25681 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25690 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25724 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25735 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25765 | function |  | 2 |
| `extendDrawnStrand` | 25822 | function |  | 2 |
| `finishDrawStrandStroke` | 25855 | function |  | 7 |
| `createPlacedStrand` | 25882 | function |  | 2 |
| `placedPointCount` | 25946 | function |  | 3 |
| `createPlacedPoints` | 25950 | function |  | 3 |
| `pushPointOutsideHead` | 25969 | function |  | 8 |
| `resizePlacedStrand` | 26001 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 26018 | function |  | 5 |
| `beginPlaceEdit` | 26023 | function |  | 2 |
| `updatePlaceEdit` | 26041 | function |  | 1 |
| `updatePlacementLength` | 26055 | function |  | 3 |
| `updatePlacementOrientation` | 26065 | function |  | 3 |
| `endPlaceEdit` | 26083 | function |  | 1 |
| `confirmPendingPlacedStrand` | 26098 | function |  | 1 |
| `pendingPlacedLock` | 26108 | function |  | 2 |
| `beginPlacementPointer` | 26112 | function |  | 3 |
| `finishPlacementPointer` | 26122 | function |  | 2 |
| `confirmPlacementStep` | 26146 | function |  | 2 |
| `finishPlacementFlow` | 26169 | function |  | 7 |
| `updatePlacementStatus` | 26182 | function |  | 83 |
| `deselectStrands` | 26321 | function |  | 12 |
| `beginSelectionMarquee` | 26336 | function |  | 3 |
| `beginAltOrbit` | 26360 | function |  | 1 |
| `beginBlenderNavigation` | 26372 | function |  | 1 |
| `endBlenderNavigation` | 26417 | function |  | 1 |
| `prepareSelectPointerCapture` | 26425 | function |  | 1 |
| `endSelectPointerCapture` | 26431 | function |  | 1 |
| `endAltOrbit` | 26437 | function |  | 1 |
| `dollyCameraByDrag` | 26444 | function |  | 2 |
| `fastDragMagnitude` | 26467 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26473 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26481 | function |  | 1 |
| `endHoudiniZoomDrag` | 26498 | function |  | 1 |
| `updateSelectionMarquee` | 26506 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26523 | function |  | 3 |
| `selectPointsInMarquee` | 26531 | function |  | 2 |
| `pointKey` | 26557 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26588 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26625 | function |  | 3 |
| `projectedPoint` | 26642 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26671 | function |  | 2 |
| `finishSelectionMarquee` | 26716 | function |  | 2 |
| `headMeshes` | 26739 | function |  | 9 |
| `strandSplitProfileData` | 26747 | function |  | 4 |
| `strandSplitControlPoint` | 26760 | function |  | 4 |
| `panelSplitControlPoint` | 26796 | function |  | 6 |
| `strandControlPointRaycast` | 26852 | function |  | 1 |
| `strandControlPointFrame` | 26887 | function |  | 6 |
| `branchRootGizmoFrame` | 26918 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26936 | function |  | 5 |
| `createCurveObjects` | 26994 | function |  | 4 |
| `polyEdgeKey` | 27167 | function |  | 2 |
| `polyMeshEdges` | 27171 | function |  | 2 |
| `populatePolyEditObjects` | 27185 | function |  | 3 |
| `createPolyEditObjects` | 27246 | function |  | 2 |
| `rebuildPolyEditObjects` | 27254 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27268 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27275 | function |  | 2 |
| `strandWidthEdgeSample` | 27284 | function |  | 3 |
| `strandWidthEdgePoints` | 27307 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27321 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27325 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27332 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27344 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27349 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27355 | function |  | 3 |
| `updateCurveObjects` | 27369 | function |  | 41 |
| `createCurveNormalIndicator` | 27626 | function |  | 2 |
| `pointUpDirection` | 27652 | function |  | 2 |
| `curveFrameAtPoint` | 27656 | function |  | 5 |
| `curveFrameAt` | 27677 | function |  | 10 |
| `strandTwistAt` | 27697 | function |  | 6 |
| `controlPointRotationAt` | 27702 | function |  | 6 |
| `strandProfileTwistAt` | 27706 | function |  | 2 |
| `strandFrameAt` | 27712 | function |  | 1 |
| `curveFrameAtSnapshot` | 27718 | function |  | 3 |
| `outwardNormalAtPoint` | 27737 | function |  | 11 |
| `sampledSurfaceNormal` | 27749 | function |  | 2 |
| `guidedNormalAt` | 27765 | function |  | 5 |
| `twistFromHandle` | 27784 | function |  | 3 |
| `signedAngleAroundAxis` | 27805 | function |  | 5 |
| `handleColor` | 27812 | function |  | 2 |
| `isAffectedCurvePoint` | 27835 | function |  | 2 |
| `syncLockFromCurve` | 27841 | function |  | 26 |
| `labelForPreset` | 27871 | function |  | 1 |
| `rebuildLockGeometry` | 27875 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27902 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27910 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27916 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27938 | function |  | 8 |
| `updateLockGeometry` | 27951 | function |  | 57 |
| `setGroupColorView` | 27972 | function |  | 2 |
| `createUvCheckerTexture` | 27982 | function |  | 3 |
| `ensureUvCheckerForLock` | 28018 | function |  | 4 |
| `removeUvCheckerFromLock` | 28051 | function |  | 3 |
| `invalidateUvInspector` | 28066 | function |  | 7 |
| `uvInspectorRecord` | 28070 | function |  | 1 |
| `uvInspectorRecords` | 28109 | function |  | 2 |
| `drawUvInspectorGrid` | 28113 | function |  | 2 |
| `renderUvInspector` | 28147 | function |  | 3 |
| `setUvCheckerEnabled` | 28206 | function |  | 3 |
| `strandViewportBaseColor` | 28223 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28258 | function |  | 3 |
| `syncStrandSelectionOutline` | 28264 | function |  | 2 |
| `applyLockedStrandPalette` | 28275 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28284 | function |  | 6 |
| `setStrandSelectionVisual` | 28293 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28309 | function |  | 2 |
| `syncProceduralParentVisibility` | 28316 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28325 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28329 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28333 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28346 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28366 | function |  | 3 |
| `selectLock` | 28399 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28452 | function |  | 6 |
| `syncGroupInputs` | 28463 | function |  | 3 |
| `topologyStatsForLock` | 28496 | function |  | 4 |
| `formatTopologyStats` | 28504 | function |  | 5 |
| `updateTopologyStats` | 28508 | function |  | 20 |
| `normalizeBraidDimensions` | 28542 | function |  | 4 |
| `normalizeStrandDimensions` | 28555 | function |  | 3 |
| `strandBaseWidth` | 28569 | function |  | 5 |
| `strandWidthDimension` | 28573 | function |  | 5 |
| `strandDepthDimension` | 28581 | function |  | 8 |
| `setStrandWidthDimension` | 28589 | function |  | 2 |
| `setStrandDepthDimension` | 28611 | function |  | 4 |
| `syncShapeDimensionInputs` | 28627 | function |  | 4 |
| `syncCreationShapeInputs` | 28663 | function |  | 5 |
| `syncViewportDrawSettings` | 28701 | function |  | 5 |
| `syncPanelShapeInputs` | 28715 | function |  | 6 |
| `syncStrandSplitInputs` | 28741 | function |  | 4 |
| `syncHairCardControls` | 28750 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28758 | function |  | 3 |
| `updateAttributeEditorMode` | 28797 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28947 | function |  | 3 |
| `curveLatticeForGroup` | 28970 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28988 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 29033 | function |  | 2 |
| `showCurveLatticeForGroup` | 29050 | function |  | 2 |
| `selectStrandGroup` | 29087 | function |  | 3 |
| `selectCurvePoint` | 29129 | function |  | 10 |
| `updateSelectedPointLabel` | 29143 | function |  | 14 |
| `syncInputs` | 29156 | function |  | 16 |
| `syncClumpGuidePanel` | 29202 | function |  | 3 |
| `getSelectedLock` | 29229 | function |  | 105 |
| `selectedLocksInOrder` | 29233 | function |  | 37 |
| `lockStrands` | 29239 | function |  | 3 |
| `lockSelectedStrands` | 29272 | function |  | 3 |
| `unlockStrands` | 29278 | function |  | 3 |
| `unlockAllStrands` | 29293 | function |  | 3 |
| `strandEditFamily` | 29297 | function |  | 7 |
| `compatibleSelectedLocks` | 29302 | function |  | 6 |
| `selectedEditRoots` | 29309 | function |  | 2 |
| `editSelectedLocks` | 29322 | function |  | 21 |
| `multiEditValuesEqual` | 29355 | function |  | 2 |
| `setMixedControl` | 29364 | function |  | 28 |
| `syncMultiStrandInputs` | 29381 | function |  | 16 |
| `values` | 29397 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29477 | function |  | 5 |
| `createCompoundStrand` | 29484 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29545 | function |  | 9 |
| `openRebuildCurveDialog` | 29558 | function |  | 1 |
| `rebuildSelectedCurves` | 29572 | function |  | 2 |
| `selectionCanBecomeClump` | 29611 | function |  | 4 |
| `createClumpFromSelection` | 29616 | function |  | 3 |
| `cleanSelectionSets` | 29628 | function |  | 2 |
| `createSelectionSetFromSelection` | 29633 | function |  | 3 |
| `selectionSetById` | 29644 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29648 | function |  | 7 |
| `editSelectionSetFromSelection` | 29657 | function |  | 5 |
| `deleteSelectionSet` | 29677 | function |  | 2 |
| `selectSelectionSet` | 29686 | function |  | 2 |
| `deleteSelectedStrands` | 29696 | function |  | 4 |
| `deleteGuide` | 29704 | function |  | 3 |
| `deleteSelectedGuide` | 29727 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29731 | function |  | 4 |
| `hasDeletableSelection` | 29744 | function |  | 2 |
| `deleteCurrentSelection` | 29752 | function |  | 3 |
| `hideOutlinerContextMenu` | 29760 | function |  | 17 |
| `outlinerLockTargets` | 29765 | function |  | 3 |
| `showOutlinerContextMenu` | 29792 | function |  | 10 |
| `hideStrandRadialMenu` | 29872 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29883 | function |  | 3 |
| `radialButtonDimensions` | 29896 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29905 | function |  | 3 |
| `applyRadialMenuDimensions` | 29922 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29928 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29941 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29962 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29979 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29988 | function |  | 3 |
| `strandVisibilityRadialOptions` | 30010 | function |  | 5 |
| `clumpMirrorRadialOptions` | 30028 | function |  | 2 |
| `contextualRadialOptions` | 30035 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30164 | function |  | 3 |
| `layoutContextualRadialOptions` | 30168 | function |  | 4 |
| `renderRadialActionList` | 30192 | function |  | 3 |
| `radialListOptionAtPointer` | 30210 | function |  | 3 |
| `syncRadialListHighlight` | 30232 | function |  | 3 |
| `configureContextualRadialMenu` | 30238 | function |  | 3 |
| `beginStrandRadialGesture` | 30298 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30332 | function |  | 2 |
| `updateStrandRadialGesture` | 30378 | function |  | 1 |
| `performStrandRadialAction` | 30417 | function |  | 2 |
| `finishStrandRadialGesture` | 30520 | function |  | 2 |
| `cancelStrandRadialGesture` | 30530 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30537 | function |  | 1 |
| `setPullMoveEnabled` | 30543 | function |  | 3 |
| `toolRadialOptions` | 30551 | function |  | 2 |
| `hideToolRadialMenu` | 30576 | function |  | 4 |
| `beginToolRadialGesture` | 30589 | function |  | 2 |
| `beginToolShortcutPress` | 30629 | function |  | 2 |
| `finishToolShortcutPress` | 30644 | function |  | 2 |
| `cancelToolShortcutPress` | 30653 | function |  | 5 |
| `setRadialMenusEnabled` | 30661 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30674 | function |  | 5 |
| `setNavigationTipsEnabled` | 30689 | function |  | 5 |
| `configureNavigationMouseButtons` | 30696 | function |  | 3 |
| `syncNavigationModifierLocks` | 30709 | function |  | 7 |
| `setNavigationStyle` | 30714 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30730 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30745 | function |  | 5 |
| `setCameraSmoothingStrength` | 30751 | function |  | 5 |
| `setScaleSensitivity` | 30759 | function |  | 3 |
| `setToolTipsEnabled` | 30767 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30774 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30783 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30791 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30806 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30815 | function |  | 5 |
| `sideNamingDisplayId` | 30824 | function |  | 3 |
| `referenceViewDisplayLabel` | 30836 | function |  | 6 |
| `strandRegionDisplayLabel` | 30846 | function |  | 10 |
| `updateSideNamingLabels` | 30864 | function |  | 2 |
| `setSideNamingPerspective` | 30891 | function |  | 5 |
| `setControlPointDisplaySize` | 30900 | function |  | 6 |
| `scaleHexColor` | 30912 | function |  | 3 |
| `setViewportBackgroundColor` | 30917 | function |  | 7 |
| `setDefaultHairShader` | 30939 | function |  | 5 |
| `setPreferenceCategory` | 30945 | function |  | 4 |
| `openPreferencesDialog` | 30972 | function |  | 1 |
| `savePreferencesDialog` | 31000 | function |  | 1 |
| `cancelPreferencesDialog` | 31024 | function |  | 3 |
| `updateToolRadialGesture` | 31053 | function |  | 1 |
| `performToolRadialAction` | 31082 | function |  | 2 |
| `finishToolRadialGesture` | 31092 | function |  | 2 |
| `cancelToolRadialGesture` | 31101 | function |  | 5 |
| `duplicatePlacementTarget` | 31108 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31135 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31139 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31149 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31154 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31166 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31177 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31185 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31202 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31223 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31234 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31240 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31246 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31279 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31434 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31536 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31577 | function |  | 2 |
| `updateDuplicatePlacement` | 31604 | function |  | 2 |
| `beginDuplicatePlacement` | 31668 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31732 | function |  | 2 |
| `confirmDuplicatePlacement` | 31773 | function |  | 1 |
| `cancelDuplicatePlacement` | 31810 | function |  | 4 |
| `outlinerClumpLocks` | 31836 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31840 | function |  | 3 |
| `createOutlinerStrandButton` | 31863 | function |  | 4 |
| `createOutlinerCurveSurface` | 31949 | function |  | 2 |
| `createOutlinerClump` | 32045 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32127 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32134 | function |  | 2 |
| `renderLockList` | 32213 | function |  | 70 |
| `updateCount` | 32367 | function |  | 34 |
| `captureInputUndo` | 32376 | function |  | 1 |
| `bindUndoCapture` | 32382 | function |  | 36 |
| `bindLockInput` | 32393 | function |  | 2 |
| `applyValue` | 32410 | arrow |  | 2 |
| `applyUniformTransformScale` | 32729 | function |  | 2 |
| `applyReducedTransformScale` | 32746 | function |  | 2 |
| `applyTransformPrecision` | 32785 | function |  | 2 |
| `updateTransformScalePointer` | 32814 | function |  | 1 |
| `finishSweepProfileDrag` | 33045 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33141 | function |  | 3 |
| `finishTaperCurveDrag` | 33203 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33246 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33327 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33382 | function |  | 6 |
| `updateSelectedTaperPoint` | 33406 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33978 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33983 | function |  | 4 |
| `syncDrawCurlControls` | 34038 | function |  | 5 |
| `handleLiveSurfaceChange` | 34086 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34168 | function |  | 3 |
| `resampleSurfaceLock` | 34183 | function |  | 2 |
| `changePanelSplitCount` | 34296 | function |  | 3 |
| `presetNumber` | 34400 | function |  | 23 |
| `clonePresetShape` | 34405 | function |  | 7 |
| `creationPresetSnapshot` | 34414 | function |  | 5 |
| `creationToolSettingsSnapshot` | 34462 | function |  | 5 |
| `applyPresetControl` | 34489 | function |  | 2 |
| `applyCreationToolSettings` | 34510 | function |  | 3 |
| `normalizeCreationPresetLibrary` | 34551 | function |  | 3 |
| `loadCustomCreationPresets` | 34558 | function |  | 2 |
| `saveCustomCreationPresets` | 34568 | function |  | 6 |
| `migrateLegacyClumpPresets` | 34576 | function |  | 2 |
| `populateCreationPresetSelect` | 34612 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34636 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34669 | function |  | 5 |
| `applyCreationPresetSnapshot` | 34674 | function |  | 2 |
| `applyCustomCreationPreset` | 34691 | function |  | 3 |
| `createCustomCreationPreset` | 34714 | function |  | 3 |
| `createCustomClumpPreset` | 34729 | function |  | 3 |
| `commitCustomCreationPreset` | 34744 | function |  | 2 |
| `openRemoveCreationPreset` | 34805 | function |  | 3 |
| `commitRemoveCreationPreset` | 34818 | function |  | 1 |
| `applyBraidToolPreset` | 34835 | function |  | 2 |
| `selectedBranchChildLock` | 34947 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34951 | function |  | 2 |
| `initPanelResizeHandles` | 35057 | function |  | 2 |
| `applyWidth` | 35063 | arrow |  | 2 |
| `restoreWidth` | 35070 | arrow |  | 2 |
| `bindResize` | 35078 | arrow |  | 2 |
| `onMove` | 35086 | arrow |  | 0 |
| `onUp` | 35090 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 35107 | function |  | 2 |
| `initFloatingPanelControls` | 35116 | function |  | 2 |
| `detach` | 35125 | arrow |  | 43 |
| `endDrag` | 35163 | arrow |  | 0 |
| `endResize` | 35195 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 35206 | function |  | 3 |
| `selectPatchNotesVersion` | 35340 | function |  | 3 |
| `requestReferenceImage` | 35373 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35577 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35583 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35590 | function |  | 1 |
| `deleteLocks` | 36157 | function |  | 10 |
| `disposeCurveObjects` | 36235 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 36287 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36318 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36393 | function |  | 2 |
| `resize` | 36426 | function |  | 4 |
| `handleViewportPointerMove` | 36437 | function |  | 1 |
| `blockProportionalSizingEvent` | 36448 | function |  | 1 |
| `updateLightAngleFromInputs` | 36454 | function |  | 2 |
| `startViewSnap` | 36468 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36498 | function |  | 3 |
| `trackViewportPointerDown` | 36515 | function |  | 1 |
| `trackViewportPointerMove` | 36531 | function |  | 1 |
| `clearViewportPointer` | 36539 | function |  | 1 |
| `updateViewSnap` | 36544 | function |  | 1 |
| `nearestCardinalAxis` | 36580 | function |  | 5 |
| `cardinalAxisKey` | 36594 | function |  | 5 |
| `steppedDragAmount` | 36598 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36604 | function |  | 4 |
| `endViewSnap` | 36620 | function |  | 4 |
| `activateStrandControlPoint` | 36630 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36680 | function |  | 4 |
| `addStrandControlPointSelection` | 36707 | function |  | 3 |
| `removeStrandControlPointSelection` | 36724 | function |  | 3 |
| `sampleStrandPointNormal` | 36738 | function |  | 2 |
| `sampleStrandPointVectors` | 36748 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36754 | function |  | 2 |
| `resampleStrandCurveData` | 36765 | function |  | 4 |
| `resampleMatchingVectors` | 36771 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36810 | function |  | 4 |
| `removeStrandCurvePoint` | 36821 | function |  | 2 |
| `closestStrandCurveParameter` | 36834 | function |  | 2 |
| `insertStrandCurvePoint` | 36863 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36880 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36890 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36906 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36913 | function |  | 4 |
| `prepareCurvePointSelection` | 36935 | function |  | 1 |
| `finishCurvePointInsertion` | 37046 | function |  | 1 |
| `finishPointRemoval` | 37061 | function |  | 1 |
| `editableStrandWidth` | 37079 | function |  | 6 |
| `editableStrandWidthBounds` | 37091 | function |  | 2 |
| `applyEditableStrandWidth` | 37097 | function |  | 3 |
| `viewportPixelPoint` | 37133 | function |  | 3 |
| `syncSculptBrushControls` | 37141 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 37156 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 37164 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 37172 | function |  | 1 |
| `sculptBrushPlaneOffset` | 37178 | function |  | 5 |
| `setSculptBrushCursorVisible` | 37182 | function |  | 7 |
| `updateSculptBrushCursor` | 37189 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 37211 | function |  | 4 |
| `sculptBrushEditableLock` | 37218 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 37228 | function |  | 5 |
| `sculptBrushLockViable` | 37234 | function |  | 5 |
| `sculptBrushUnits` | 37245 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 37284 | function |  | 4 |
| `sculptBrushPointWeight` | 37334 | function |  | 5 |
| `sculptBrushWorldDelta` | 37344 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37353 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37379 | function |  | 2 |
| `beginSculptMoveStroke` | 37437 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37499 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37734 | function |  | 3 |
| `updateSculptMoveStroke` | 37743 | function |  | 1 |
| `finishSculptMoveStroke` | 37759 | function |  | 3 |
| `strandControlPointHit` | 37807 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37811 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37889 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37923 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37963 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37976 | function |  | 1 |
| `setHoveredControlPoint` | 38015 | function |  | 7 |
| `visibleControlPointHoverTargets` | 38028 | function |  | 2 |
| `updateControlPointHover` | 38064 | function |  | 1 |
| `animate` | 38621 | function |  | 2 |
| `syncCompactSidebarLayout` | 38654 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38673 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38679 | function |  | 3 |
| `setAttributeEditorTab` | 38685 | function |  | 6 |

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
