# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-09），由 `node scripts/gen-function-index.js` 产出。共 **1732** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（38438 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 259 | function |  | 3 |
| `saveBooleanPreference` | 287 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 291 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 296 | function |  | 2 |
| `normalizeScaleSensitivity` | 301 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 306 | function |  | 2 |
| `normalizeSideNamingPerspective` | 311 | function |  | 2 |
| `normalizeNavigationStyle` | 315 | function |  | 2 |
| `setupEditableSliderControls` | 330 | function |  | 2 |
| `syncNumberFromRange` | 381 | arrow |  | 0 |
| `applyNumberValue` | 388 | arrow |  | 0 |
| `copyCameraPose` | 494 | function |  | 3 |
| `updateCameraProjectionForViewport` | 500 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 513 | function |  | 3 |
| `setOrthographicView` | 519 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 559 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 588 | function |  | 2 |
| `removeRotateFreeAxisRing` | 614 | function |  | 2 |
| `deflateTransformGizmoPickers` | 626 | function |  | 2 |
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
| `currentStrandSelectionState` | 2084 | function |  | 4 |
| `applyStrandSelectionState` | 2088 | function |  | 5 |
| `clearStrandSelectionState` | 2093 | function |  | 7 |
| `guideHeadBounds` | 3073 | function |  | 8 |
| `fullBodyScalpFocusBounds` | 3083 | function |  | 5 |
| `disposeGuideModel` | 3097 | function |  | 3 |
| `syncHeadTransformInputs` | 3108 | function |  | 4 |
| `applyHeadTransform` | 3115 | function |  | 6 |
| `syncScalpRoughScaleInputs` | 3133 | function |  | 4 |
| `applyScalpRoughScale` | 3142 | function |  | 5 |
| `resetHeadTransform` | 3156 | function |  | 2 |
| `realignFullBodyGuideToScalpTop` | 3170 | function |  | 2 |
| `installGuideModel` | 3186 | function |  | 5 |
| `loadDefaultGuideModel` | 3262 | function |  | 3 |
| `braidTemplateFromEntries` | 3285 | function |  | 4 |
| `braidMeshEntries` | 3317 | function |  | 2 |
| `prepareBraidBodyCache` | 3329 | function |  | 2 |
| `quantize` | 3338 | arrow |  | 21 |
| `sourceNormalAt` | 3350 | arrow |  | 1 |
| `clusterBoundary` | 3353 | arrow |  | 2 |
| `normalBuckets` | 3370 | arrow |  | 2 |
| `applyBucketPair` | 3402 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3433 | function |  | 2 |
| `annotateBraidObjTopology` | 3454 | function |  | 2 |
| `loadBraidMeshPreset` | 3474 | function |  | 3 |
| `createSplitControlHandle` | 3491 | function |  | 4 |
| `frameGuideModel` | 3506 | function |  | 2 |
| `syncScalpInputs` | 3531 | function |  | 2 |
| `syncScalpArtistInputs` | 3537 | function |  | 2 |
| `rootScalpOffsetDistance` | 3545 | function |  | 15 |
| `applyLockRootScalpOffset` | 3550 | function |  | 5 |
| `normalizeHairLayer` | 3566 | function |  | 27 |
| `layerOffsetForLock` | 3570 | function |  | 9 |
| `layerRootOffsetFactor` | 3575 | function |  | 13 |
| `layerOffsetWeight` | 3579 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3585 | function |  | 5 |
| `pointsWithLayerOffset` | 3594 | function |  | 3 |
| `layerDirectionForLock` | 3602 | function |  | 2 |
| `applyLayerOffset` | 3613 | function |  | 5 |
| `setLockHairLayer` | 3637 | function |  | 2 |
| `setGroupLayerOffset` | 3652 | function |  | 2 |
| `scalpArtistWeight` | 3664 | function |  | 3 |
| `scalpArtistScalesAt` | 3668 | function |  | 3 |
| `applyScalpArtistShape` | 3678 | function |  | 5 |
| `inverseScalpArtistShape` | 3696 | function |  | 2 |
| `updateScalpSurface` | 3723 | function |  | 3 |
| `setActiveScalpRegion` | 3733 | function |  | 2 |
| `clearScalpRegions` | 3745 | function |  | 2 |
| `scalpHitFromEvent` | 3762 | function |  | 3 |
| `updateScalpBrushCursor` | 3770 | function |  | 4 |
| `paintScalpAt` | 3785 | function |  | 3 |
| `beginScalpPaint` | 3852 | function |  | 2 |
| `updateScalpPaint` | 3861 | function |  | 1 |
| `endScalpPaint` | 3870 | function |  | 2 |
| `createScalpLattice` | 3877 | function |  | 2 |
| `resetScalpLattice` | 3902 | function |  | 1 |
| `updateScalpLatticeObjects` | 3914 | function |  | 7 |
| `quadraticWeights` | 3928 | function |  | 4 |
| `applyScalpLatticeDeformation` | 3933 | function |  | 5 |
| `updateScalpLatticeFromHandle` | 3960 | function |  | 3 |
| `selectScalpLatticePoint` | 3975 | function |  | 2 |
| `beginScalpLatticeDrag` | 3990 | function |  | 2 |
| `updateScalpLatticeDrag` | 4008 | function |  | 1 |
| `endScalpLatticeDrag` | 4026 | function |  | 2 |
| `setHeadReferenceTransparency` | 4032 | function |  | 7 |
| `disposeScalpBuilderVisuals` | 4042 | function |  | 7 |
| `updateScalpBuilderPositionReadout` | 4060 | function |  | 3 |
| `trianglePlaneIntersections` | 4068 | function |  | 4 |
| `headPlaneIntersectionSegments` | 4089 | function |  | 9 |
| `scalpBuilderHeadMeshes` | 4115 | function |  | 6 |
| `scalpBuilderIntersectionPositions` | 4125 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 4137 | function |  | 3 |
| `createScalpBuilderPlaneVisual` | 4161 | function |  | 3 |
| `createScalpBuilderPlanes` | 4176 | function |  | 2 |
| `updateScalpBuilderStepUi` | 4208 | function |  | 3 |
| `parseScalpTopologyTemplate` | 4246 | function |  | 1 |
| `loadScalpTopologyTemplate` | 4269 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 4281 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 4293 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 4298 | function |  | 4 |
| `subdivideScalpBuilderCage` | 4310 | function |  | 4 |
| `scalpBuilderSurfaceGeometry` | 4420 | function |  | 2 |
| `writeEditedScalpRegionColors` | 4445 | function |  | 5 |
| `syncEditedScalpSurface` | 4460 | function |  | 4 |
| `ensureEditedScalpSurface` | 4531 | function |  | 3 |
| `updateScalpBuilderCurveLatticeGeometry` | 4561 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 4646 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 4659 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 4675 | function |  | 9 |
| `scalpBuilderMirrorMap` | 4685 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 4703 | function |  | 2 |
| `commitScalpBuilderCurveLatticeEdit` | 4716 | function |  | 2 |
| `updateScalpBuilderHandleColors` | 4723 | function |  | 8 |
| `selectScalpBuilderCurveLatticePoint` | 4742 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 4756 | function |  | 2 |
| `scalpBuilderCurveLatticePointHit` | 4797 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 4806 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 4819 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 4840 | function |  | 4 |
| `clearScalpBuilderTemplateOverlay` | 4977 | function |  | 2 |
| `scalpTemplateNeighbors` | 4985 | function |  | 2 |
| `smoothScalpVectorField` | 4997 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 5011 | function |  | 2 |
| `upperContourCurve` | 5028 | function |  | 4 |
| `hermitePoint` | 5063 | function |  | 2 |
| `curveNetworkSection` | 5074 | function |  | 3 |
| `pointAlongSection` | 5103 | function |  | 3 |
| `longestStitchedContour` | 5109 | function |  | 2 |
| `nodeForPoint` | 5117 | arrow |  | 2 |
| `constructionCurveFromSegments` | 5174 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 5184 | function |  | 1 |
| `orderedRange` | 5196 | arrow |  | 3 |
| `clipSegment` | 5219 | arrow |  | 1 |
| `liftedPoint` | 5242 | arrow |  | 5 |
| `boundaryCorner` | 5247 | arrow |  | 4 |
| `surfaceCurveBetween` | 5256 | arrow |  | 1 |
| `addSurfaceConnector` | 5279 | arrow |  | 2 |
| `sideContourAtDepth` | 5347 | arrow |  | 3 |
| `addSurfacePatch` | 5381 | arrow |  | 1 |
| `addCenterBridgePatch` | 5461 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 5569 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 5604 | function |  | 1 |
| `generatedScalpObjContent` | 5694 | function |  | 2 |
| `generateScalpFromBuilder` | 5708 | function |  | 1 |
| `orderedDepthRange` | 5744 | arrow |  | 7 |
| `resetScalpBuilder` | 5873 | function |  | 1 |
| `confirmScalpBuilderPlane` | 5888 | function |  | 1 |
| `beginScalpBuilderInput` | 5902 | function |  | 2 |
| `updateScalpBuilderStroke` | 5903 | function |  | 1 |
| `finishScalpBuilderStroke` | 5904 | function |  | 2 |
| `setScalpBuilderEditing` | 5906 | function |  | 10 |
| `updateScalpEditingVisibility` | 5940 | function |  | 12 |
| `exitSetupEditors` | 6034 | function |  | 7 |
| `setCapsuleGuideEditing` | 6043 | function |  | 5 |
| `syncAppMenuVisibility` | 6071 | function |  | 3 |
| `closeAppMenus` | 6076 | function |  | 6 |
| `setAppMenuOpen` | 6087 | function |  | 3 |
| `setTurntableActive` | 6094 | function |  | 3 |
| `setScalpSetupMenuOpen` | 6103 | function |  | 9 |
| `selectedReferenceImage` | 6107 | function |  | 20 |
| `normalizeReferenceCrop` | 6113 | function |  | 8 |
| `referenceCropIsFull` | 6121 | function |  | 3 |
| `referencePlaneFrontAxis` | 6126 | function |  | 4 |
| `referencePlanePlacement` | 6135 | function |  | 4 |
| `migratedReferencePlanePosition` | 6150 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 6170 | function |  | 3 |
| `migratedReferencePlaneRotation` | 6187 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 6203 | function |  | 2 |
| `snappedReferenceImageView` | 6226 | function |  | 2 |
| `updateReferencePlaneVisibility` | 6232 | function |  | 5 |
| `applyReferenceImageRuntime` | 6248 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 6291 | function |  | 6 |
| `createReferenceImageRuntime` | 6299 | function |  | 3 |
| `addReferenceImage` | 6368 | function |  | 3 |
| `disposeReferenceImageRuntime` | 6420 | function |  | 3 |
| `disposeReferenceImage` | 6439 | function |  | 2 |
| `clearReferenceImages` | 6443 | function |  | 2 |
| `serializeReferenceImage` | 6450 | function |  | 1 |
| `setReferenceImageType` | 6478 | function |  | 2 |
| `attachReferenceImageTransform` | 6522 | function |  | 6 |
| `selectReferenceImage` | 6536 | function |  | 12 |
| `placeReferencePlane` | 6559 | function |  | 2 |
| `setReferencePlaneInFront` | 6570 | function |  | 2 |
| `syncReferenceImageFromMesh` | 6580 | function |  | 4 |
| `renderReferenceImagePanel` | 6599 | function |  | 20 |
| `setOutlinerTab` | 6646 | function |  | 9 |
| `effectiveViewportSelectionMode` | 6664 | function |  | 4 |
| `componentEditModeActive` | 6668 | function |  | 38 |
| `selectionToolSupportsPicking` | 6672 | function |  | 3 |
| `syncViewportSelectionModeControl` | 6677 | function |  | 4 |
| `refreshSelectionModeVisuals` | 6693 | function |  | 2 |
| `setViewportSelectionMode` | 6723 | function |  | 4 |
| `setViewportEditMode` | 6735 | function |  | 18 |
| `createOutlinerVisibilityToggle` | 6777 | function |  | 10 |
| `setLocksOutlinerVisibility` | 6791 | function |  | 8 |
| `outlinerGuides` | 6803 | function |  | 3 |
| `guideOutlinerLabel` | 6810 | function |  | 2 |
| `normalizeOutlinerName` | 6820 | function |  | 4 |
| `beginOutlinerRename` | 6825 | function |  | 2 |
| `finish` | 6836 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 6866 | function |  | 7 |
| `createScalpGuideOutlinerRow` | 6876 | function |  | 2 |
| `renderGuideOutliner` | 6911 | function |  | 10 |
| `referenceOutlinerGroup` | 6969 | function |  | 2 |
| `renderReferenceOutliner` | 6973 | function |  | 4 |
| `setReferenceImagePanelOpen` | 7090 | function |  | 5 |
| `readReferenceImageFile` | 7095 | function |  | 2 |
| `isSupportedReferenceImageFile` | 7119 | function |  | 2 |
| `addReferenceImagesFromFiles` | 7126 | function |  | 3 |
| `dragContainsReferenceImage` | 7171 | function |  | 3 |
| `setReferenceImageDragActive` | 7182 | function |  | 9 |
| `referenceDropDestination` | 7190 | function |  | 2 |
| `viewportOverlayDropPosition` | 7196 | function |  | 2 |
| `setReferenceDropHover` | 7205 | function |  | 4 |
| `referencePlaneHitFromPointer` | 7223 | function |  | 2 |
| `referenceOverlayAtPointer` | 7243 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 7261 | function |  | 4 |
| `beginReferenceOverlayDrag` | 7274 | function |  | 2 |
| `updateReferenceOverlayDrag` | 7320 | function |  | 1 |
| `finishReferenceOverlayDrag` | 7370 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 7392 | function |  | 6 |
| `updateReferenceOverlayCursor` | 7403 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 7429 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 7438 | function |  | 2 |
| `referenceCropCursor` | 7453 | function |  | 3 |
| `updateReferenceCropHandles` | 7459 | function |  | 5 |
| `referenceCropSourcePoint` | 7480 | function |  | 2 |
| `beginReferenceCrop` | 7487 | function |  | 1 |
| `updateReferenceCrop` | 7525 | function |  | 1 |
| `finishReferenceCrop` | 7557 | function |  | 4 |
| `setHeadSetupEditing` | 7575 | function |  | 6 |
| `activeToolUsesScalpGuide` | 7591 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 7600 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 7610 | function |  | 4 |
| `setScalpGuideVisibility` | 7616 | function |  | 12 |
| `currentGuideViewMode` | 7624 | function |  | 3 |
| `updateGuideViewToggle` | 7632 | function |  | 5 |
| `setGuideViewMode` | 7648 | function |  | 3 |
| `cycleGuideViewMode` | 7659 | function |  | 1 |
| `hideGuideViewContextMenu` | 7664 | function |  | 6 |
| `showGuideViewContextMenu` | 7668 | function |  | 1 |
| `strandPassesDisplayFilters` | 7681 | function |  | 4 |
| `strandVisibleForDisplay` | 7690 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 7695 | function |  | 2 |
| `lockedStrandsExist` | 7699 | function |  | 3 |
| `hiddenStrandsExist` | 7703 | function |  | 2 |
| `hideSelectedStrands` | 7707 | function |  | 2 |
| `unhideHiddenStrands` | 7717 | function |  | 2 |
| `strandIsolationActive` | 7726 | function |  | 7 |
| `setStrandIsolation` | 7730 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 7742 | function |  | 3 |
| `syncVisibilityParent` | 7753 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 7760 | function |  | 10 |
| `applyCharacterMeshDisplayVisibility` | 7789 | function |  | 5 |
| `applyStrandDisplayVisibility` | 7796 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 7816 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 7839 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 7847 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 7854 | function |  | 9 |
| `setScalpLatticeEditing` | 7865 | function |  | 4 |
| `setScalpShapeEditing` | 7880 | function |  | 9 |
| `setScalpPaintEditing` | 7898 | function |  | 7 |
| `defaultCurveLatticePoints` | 7922 | function |  | 3 |
| `flatCurveLatticePoints` | 7948 | function |  | 4 |
| `scalpRegionSurfaceSamples` | 7957 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 7981 | function |  | 4 |
| `horizontalValue` | 7986 | arrow |  | 1 |
| `blendedSample` | 7997 | arrow |  | 1 |
| `createCurveLatticeGuideSet` | 8030 | function |  | 2 |
| `curveLatticeControlPoint` | 8045 | function |  | 9 |
| `circularArcTangent` | 8049 | function |  | 4 |
| `arcLengthTo` | 8080 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 8092 | function |  | 3 |
| `sampleHermiteCurve` | 8131 | function |  | 10 |
| `sampleCurveLattice` | 8148 | function |  | 6 |
| `curveLatticeNormal` | 8167 | function |  | 1 |
| `createCurveLatticeGeometry` | 8178 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 8207 | function |  | 3 |
| `appendCurve` | 8209 | arrow |  | 4 |
| `sample` | 8211 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 8238 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 8254 | function |  | 3 |
| `addPicker` | 8256 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 8295 | function |  | 2 |
| `curveLatticeHasRootExtension` | 8308 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 8312 | function |  | 3 |
| `curveLatticeEditablePoint` | 8330 | function |  | 13 |
| `curveLatticePointSection` | 8337 | function |  | 3 |
| `curveLatticeRestPoint` | 8348 | function |  | 7 |
| `editingCurveLatticeDeformation` | 8354 | function |  | 7 |
| `curveLatticeRootColumns` | 8360 | function |  | 3 |
| `curveTangentsForPoints` | 8367 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 8379 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 8416 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 8442 | function |  | 2 |
| `resampleCurveLatticeGuide` | 8459 | function |  | 3 |
| `resampleGrid` | 8469 | arrow |  | 2 |
| `controlPointIsSelected` | 8496 | function |  | 7 |
| `clearMultiPointSelection` | 8504 | function |  | 9 |
| `createCurveLatticeHandles` | 8508 | function |  | 4 |
| `addCurveLattice` | 8530 | function |  | 6 |
| `updateCurveLatticeGeometry` | 8639 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 8670 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 8676 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 8715 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 8736 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 8753 | function |  | 3 |
| `setCurveLatticeLoopHover` | 8762 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 8769 | function |  | 1 |
| `selectCurveLatticeLoop` | 8788 | function |  | 3 |
| `selectCurveLatticePoint` | 8817 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 8832 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 8874 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 8895 | function |  | 3 |
| `curveLatticeColumnPoints` | 8938 | function |  | 3 |
| `groupCurveControlIndices` | 8947 | function |  | 4 |
| `groupCurveControlPoints` | 8953 | function |  | 2 |
| `updateGroupCurveDisplay` | 8959 | function |  | 3 |
| `ensureGroupCurveDisplay` | 8969 | function |  | 2 |
| `groupCurveDeformationPairs` | 8991 | function |  | 2 |
| `curveLatticeDeformationPairs` | 8998 | function |  | 2 |
| `appendPairs` | 9000 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 9011 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 9030 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 9051 | function |  | 2 |
| `createStrandsFromCurveLattice` | 9070 | function |  | 2 |
| `capsuleGuideCapHeight` | 9104 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 9108 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 9113 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 9117 | function |  | 3 |
| `capsuleGuideDrawPoints` | 9129 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 9145 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 9151 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 9177 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 9207 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 9261 | function |  | 4 |
| `createCapsuleGuideGeometry` | 9282 | function |  | 7 |
| `vertex` | 9296 | function |  | 4 |
| `addFace` | 9302 | function |  | 3 |
| `addRing` | 9320 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 9375 | function |  | 3 |
| `retopologizeCapsuleGuide` | 9385 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 9450 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 9496 | function |  | 7 |
| `capsuleControlGeometryFromData` | 9509 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 9530 | function |  | 3 |
| `capsuleGuidePointDistances` | 9535 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 9556 | function |  | 4 |
| `capsuleGuideLoopCenter` | 9576 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 9581 | function |  | 8 |
| `normalizeCapsuleGuideName` | 9587 | function |  | 3 |
| `capsuleGuideAccentColor` | 9592 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 9597 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 9608 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 9620 | function |  | 2 |
| `createCapsuleGuideHandles` | 9652 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 9675 | function |  | 2 |
| `syncCapsuleGuideHandles` | 9694 | function |  | 4 |
| `capsuleGuideMirrorMap` | 9701 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 9717 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 9734 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 9749 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 9786 | function |  | 2 |
| `selectCapsuleGuidePoint` | 9802 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 9819 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 9825 | function |  | 3 |
| `selectCapsuleGuideLoop` | 9852 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 9864 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 9883 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 9928 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 9963 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 9977 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 9983 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 10000 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 10011 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 10022 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 10052 | function |  | 1 |
| `createSubdividedQuadGeometry` | 10062 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 10103 | function |  | 3 |
| `createQuadCageGeometry` | 10119 | function |  | 3 |
| `scalpFittedCapsuleSpec` | 10143 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 10163 | function |  | 2 |
| `updateCapsuleGuideGeometry` | 10174 | function |  | 13 |
| `createCapsuleGuideMaterial` | 10227 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 10265 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 10275 | function |  | 4 |
| `addCapsuleGuide` | 10283 | function |  | 4 |
| `addGuide` | 10352 | function |  | 1 |
| `createGuideGeometry` | 10413 | function |  | 4 |
| `selectGuide` | 10468 | function |  | 17 |
| `updateGuideControlsVisibility` | 10536 | function |  | 10 |
| `updateViewportToolVisibility` | 10553 | function |  | 7 |
| `getSelectedGuide` | 10592 | function |  | 34 |
| `selectedViewportFocusBounds` | 10596 | function |  | 2 |
| `frameViewportBounds` | 10610 | function |  | 6 |
| `centerViewportOnSelectedItem` | 10640 | function |  | 2 |
| `fullSceneFocusBounds` | 10644 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 10659 | function |  | 3 |
| `cycleViewportFraming` | 10668 | function |  | 2 |
| `syncGuideInputs` | 10686 | function |  | 5 |
| `updateGuideGeometry` | 10729 | function |  | 3 |
| `sculptBrushToolActive` | 10750 | function |  | 28 |
| `sculptBrushSelectionMaskActive` | 10754 | function |  | 3 |
| `sculptBrushSelectionAllows` | 10758 | function |  | 3 |
| `effectiveSculptBrushTool` | 10762 | function |  | 13 |
| `updateSculptScaleModeRow` | 10768 | function |  | 4 |
| `syncSculptBrushToolButtons` | 10773 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 10795 | function |  | 5 |
| `setActiveTool` | 10804 | function |  | 19 |
| `setDrawStrandMode` | 10942 | function |  | 2 |
| `setObjectSpaceEditing` | 10952 | function |  | 7 |
| `setHierarchyEditing` | 10968 | function |  | 4 |
| `setProportionalEditing` | 10980 | function |  | 5 |
| `beginProportionalSizeEdit` | 10999 | function |  | 3 |
| `updateProportionalSizeEdit` | 11011 | function |  | 2 |
| `endProportionalSizeEdit` | 11022 | function |  | 5 |
| `activateProportionalHotkeyHold` | 11029 | function |  | 2 |
| `refreshProportionalPreview` | 11037 | function |  | 4 |
| `activeBrushSizeInput` | 11047 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 11056 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 11068 | function |  | 2 |
| `beginBrushSizeDrag` | 11086 | function |  | 1 |
| `updateBrushSizeDrag` | 11113 | function |  | 1 |
| `finishBrushSizeDrag` | 11134 | function |  | 2 |
| `updateInteractionLocks` | 11151 | function |  | 87 |
| `branchMoveGizmoDisabled` | 11160 | function |  | 2 |
| `setBranchMoveGizmoVisual` | 11169 | function |  | 2 |
| `configureTransformControls` | 11200 | function |  | 16 |
| `pullMoveActive` | 11208 | function |  | 9 |
| `updatePullGuideVisual` | 11212 | function |  | 4 |
| `attachTransformForCurvePoint` | 11228 | function |  | 5 |
| `pointerHitsTransformGizmo` | 11252 | function |  | 7 |
| `strandObjectRootIndex` | 11268 | function |  | 3 |
| `strandObjectRoot` | 11277 | function |  | 4 |
| `strandObjectTransformQuaternion` | 11281 | function |  | 2 |
| `attachStrandObjectTransform` | 11286 | function |  | 6 |
| `guideObjectPivot` | 11309 | function |  | 3 |
| `guideObjectTransformQuaternion` | 11320 | function |  | 2 |
| `attachGuideObjectTransform` | 11325 | function |  | 6 |
| `guideObjectTransformSnapshot` | 11344 | function |  | 2 |
| `beginGuideObjectTransform` | 11372 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 11379 | function |  | 2 |
| `updateGuideObjectTransform` | 11401 | function |  | 2 |
| `finishGuideObjectTransform` | 11434 | function |  | 2 |
| `clonePlacementFrame` | 11443 | function |  | 2 |
| `cloneOptionalVectors` | 11455 | function |  | 10 |
| `strandObjectTransformSnapshot` | 11459 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 11476 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 11491 | function |  | 2 |
| `strandObjectTransformOperators` | 11507 | function |  | 4 |
| `transformPoint` | 11515 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 11522 | arrow |  | 0 |
| `transformNormal` | 11528 | arrow |  | 10 |
| `transformDirection` | 11538 | arrow |  | 7 |
| `worldMatrixForPivot` | 11550 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 11556 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 11572 | function |  | 6 |
| `beginStrandObjectTransform` | 11586 | function |  | 2 |
| `updateStrandObjectTransform` | 11624 | function |  | 2 |
| `commitStrandObjectTransform` | 11673 | function |  | 2 |
| `mapPoints` | 11686 | arrow |  | 4 |
| `finishStrandObjectTransform` | 11720 | function |  | 2 |
| `surfaceObjectAnchorPose` | 11734 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 11757 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 11770 | function |  | 3 |
| `beginSurfaceObjectTransform` | 11785 | function |  | 2 |
| `updateSurfaceObjectTransform` | 11811 | function |  | 2 |
| `finishSurfaceObjectTransform` | 11860 | function |  | 2 |
| `beginHandleEdit` | 11869 | function |  | 5 |
| `branchSurfaceFrameQuat` | 11918 | function |  | 3 |
| `applyBranchRigidRootMove` | 11935 | function |  | 3 |
| `syncBranchRootHandleFrame` | 11972 | function |  | 3 |
| `updateGroupLatticeBaseFromHandleEdit` | 11983 | function |  | 3 |
| `multiPointHandleEditActive` | 11994 | function |  | 7 |
| `applyMultiMove` | 11998 | function |  | 5 |
| `applyMultiRotate` | 12004 | function |  | 2 |
| `applyMultiScale` | 12013 | function |  | 2 |
| `applyHierarchicalMove` | 12022 | function |  | 3 |
| `applySingleMove` | 12034 | function |  | 5 |
| `applySurfaceLatticeMirror` | 12038 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 12055 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 12064 | function |  | 3 |
| `changed` | 12074 | arrow |  | 1 |
| `applyPullMove` | 12116 | function |  | 3 |
| `pullHeadCollisionContext` | 12124 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 12143 | function |  | 2 |
| `applyProportionalMove` | 12166 | function |  | 3 |
| `viewPlaneNormal` | 12177 | function |  | 20 |
| `isCameraInSnappedView` | 12181 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 12189 | function |  | 10 |
| `updateViewPlaneGrid` | 12193 | function |  | 14 |
| `setViewPlaneMove` | 12250 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 12261 | function |  | 2 |
| `rayFromViewportEvent` | 12269 | function |  | 23 |
| `worldUnitsPerViewportPixel` | 12277 | function |  | 4 |
| `viewPlaneMovePointNormal` | 12287 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 12298 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 12311 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 12330 | function |  | 4 |
| `beginViewPlaneMove` | 12337 | function |  | 3 |
| `updateViewPlaneMove` | 12401 | function |  | 1 |
| `endViewPlaneMove` | 12466 | function |  | 7 |
| `applyHierarchicalRotate` | 12485 | function |  | 2 |
| `rotateGuideNormal` | 12492 | arrow |  | 4 |
| `applySingleRotate` | 12530 | function |  | 2 |
| `applyProportionalRotate` | 12534 | function |  | 2 |
| `applyHierarchicalScale` | 12554 | function |  | 2 |
| `applySingleScale` | 12564 | function |  | 2 |
| `applyProportionalScale` | 12568 | function |  | 2 |
| `setPointScale` | 12584 | function |  | 8 |
| `proportionalWeight` | 12593 | function |  | 8 |
| `proportionalStrandVisualsActive` | 12605 | function |  | 5 |
| `strandInfluenceColor` | 12611 | function |  | 17 |
| `beginRelaxEdit` | 12636 | function |  | 3 |
| `updateRelaxEdit` | 12665 | function |  | 1 |
| `endRelaxEdit` | 12725 | function |  | 1 |
| `disposeGuide` | 12735 | function |  | 3 |
| `removeGuideObjects` | 12763 | function |  | 3 |
| `strandRadiusAt` | 12777 | function |  | 5 |
| `strandProfileTopologyAt` | 12794 | function |  | 8 |
| `strandCurveParameters` | 12836 | function |  | 5 |
| `widthProfileAt` | 12846 | arrow |  | 1 |
| `braidFrameAt` | 12884 | function |  | 5 |
| `braidFrameAtExtended` | 12894 | function |  | 2 |
| `createBraidProfileProjector` | 12903 | function |  | 2 |
| `project` | 12919 | arrow |  | 17 |
| `createBraidGeometry` | 12934 | function |  | 2 |
| `deformationAt` | 12969 | function |  | 3 |
| `widthFor` | 12978 | arrow |  | 3 |
| `depthFor` | 12982 | arrow |  | 3 |
| `outputVertex` | 13014 | function |  | 7 |
| `appendAuthoredCap` | 13122 | function |  | 3 |
| `outputCapVertex` | 13129 | arrow |  | 6 |
| `capBoundary` | 13220 | function |  | 3 |
| `strandGeometryCurve` | 13282 | function |  | 15 |
| `strandGeometryFrameAt` | 13308 | function |  | 19 |
| `transportedStrandFrameAt` | 13371 | function |  | 7 |
| `twistOverrideAt` | 13374 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 13402 | function |  | 2 |
| `weldPanelGeometryData` | 13438 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 13478 | function |  | 3 |
| `surfacePanelPoint` | 13493 | function |  | 3 |
| `createPanelStrandGeometry` | 13516 | function |  | 2 |
| `addQuad` | 13550 | arrow |  | 6 |
| `near` | 13554 | arrow |  | 6 |
| `panelWidthAt` | 13584 | arrow |  | 6 |
| `panelThicknessAt` | 13593 | arrow |  | 6 |
| `panelFrameAt` | 13602 | arrow |  | 1 |
| `rawPanelPoint` | 13620 | arrow |  | 1 |
| `panelPoint` | 13640 | arrow |  | 2 |
| `addPatch` | 13646 | arrow |  | 1 |
| `splitOpening` | 13697 | arrow |  | 2 |
| `uStart` | 13721 | arrow |  | 1 |
| `uEnd` | 13724 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 13762 | function |  | 3 |
| `inside` | 13763 | arrow |  | 2 |
| `pushOrientedTriangle` | 13785 | function |  | 7 |
| `triangulatePolygon3D` | 13796 | function |  | 1 |
| `orientedQuadFace` | 13836 | function |  | 2 |
| `createSplitStrandGeometry` | 13844 | function |  | 2 |
| `fusedIndexAt` | 14001 | arrow |  | 0 |
| `createHairCardGeometry` | 14050 | function |  | 2 |
| `createPolyGeometry` | 14149 | function |  | 2 |
| `curveSurfaceControllerCurves` | 14176 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 14185 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 14232 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 14240 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 14256 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 14265 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 14276 | function |  | 3 |
| `curveSurfaceControllerSegments` | 14284 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 14294 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 14314 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 14337 | function |  | 4 |
| `buildBranchBridgeGeometry` | 14416 | function |  | 2 |
| `pushBoundary` | 14445 | arrow |  | 5 |
| `boundaryAt` | 14463 | arrow |  | 3 |
| `hermite` | 14485 | arrow |  | 2 |
| `emitBottomMidRow` | 14530 | arrow |  | 2 |
| `emitTopMidRow` | 14629 | arrow |  | 2 |
| `sideHoleVertex` | 14671 | arrow |  | 4 |
| `cachedSideHoleVertex` | 14720 | arrow |  | 2 |
| `emitFillStrip` | 14791 | arrow |  | 2 |
| `fillSide` | 14802 | arrow |  | 0 |
| `directBridgeQuadIndex` | 14846 | arrow |  | 2 |
| `edgeDirection` | 14870 | arrow |  | 1 |
| `positionAt` | 14929 | arrow |  | 1 |
| `createBranchChildGeometry` | 14980 | function |  | 2 |
| `createCompoundStrandGeometry` | 15190 | function |  | 2 |
| `proceduralBranchGeometryLock` | 15441 | function |  | 2 |
| `createHairGeometry` | 15472 | function |  | 6 |
| `createBaseHairGeometry` | 15524 | function |  | 3 |
| `hairMaterialDefinition` | 15642 | function |  | 4 |
| `materialForLock` | 15646 | function |  | 8 |
| `activeHairMaterialDefinition` | 15650 | function |  | 11 |
| `strandDisplayColor` | 15656 | function |  | 14 |
| `setAnimeHairBaseColor` | 15674 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 15687 | function |  | 2 |
| `createHairMaterial` | 15727 | function |  | 5 |
| `createStrandSelectionOutline` | 15769 | function |  | 3 |
| `strandUsesDoubleSidedMaterial` | 15803 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 15812 | function |  | 6 |
| `refreshMaterialUsers` | 15839 | function |  | 6 |
| `renderHairMaterialOutliner` | 15848 | function |  | 5 |
| `renderHairMaterialOptions` | 15878 | function |  | 3 |
| `syncHairMaterialEditor` | 15888 | function |  | 9 |
| `createProjectHairMaterial` | 15914 | function |  | 3 |
| `deleteActiveHairMaterial` | 15934 | function |  | 2 |
| `createHairTopologyGeometry` | 15952 | function |  | 4 |
| `createHairTopologyOverlay` | 15973 | function |  | 3 |
| `groupDefaultsFor` | 16020 | function |  | 9 |
| `creationToolActive` | 16027 | function |  | 8 |
| `activeCreationShapeDefaults` | 16031 | function |  | 11 |
| `activeStrandShapeTarget` | 16037 | function |  | 5 |
| `curvePolylineLength` | 16041 | function |  | 2 |
| `curvePolylineLengths` | 16049 | function |  | 3 |
| `samplePolylineDistance` | 16057 | function |  | 2 |
| `applyProjectedCurveLength` | 16067 | function |  | 4 |
| `clearRegionLengthBaseline` | 16098 | function |  | 2 |
| `ensureRegionLengthBaseline` | 16105 | function |  | 2 |
| `setGroupLengthScale` | 16113 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 16151 | function |  | 6 |
| `requestGroupDefaultsWarning` | 16183 | function |  | 1 |
| `activeSweepProfile` | 16192 | function |  | 9 |
| `activeSweepProfileTarget` | 16199 | function |  | 6 |
| `trimmedSweepProfile` | 16206 | function |  | 7 |
| `roundedLeft` | 16215 | arrow |  | 1 |
| `roundedRight` | 16221 | arrow |  | 1 |
| `activeProfileOffset` | 16238 | function |  | 4 |
| `mirroredSweepProfileIndex` | 16245 | function |  | 3 |
| `profileToCanvas` | 16262 | function |  | 5 |
| `createSmoothSweepProfileCurve` | 16266 | function |  | 11 |
| `sampleSweepProfile` | 16275 | function |  | 7 |
| `createSweepProfileTopology` | 16296 | function |  | 5 |
| `renderProfilePreview` | 16338 | function |  | 8 |
| `renderHairCardCoveragePath` | 16357 | function |  | 3 |
| `activeTaperTarget` | 16372 | function |  | 15 |
| `twistCurveEditing` | 16379 | function |  | 18 |
| `proceduralBranchLengthCurveEditing` | 16383 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 16387 | function |  | 7 |
| `proceduralBranchCurveEditing` | 16391 | function |  | 17 |
| `taperAsymmetryKey` | 16395 | function |  | 12 |
| `taperSecondaryKey` | 16399 | function |  | 11 |
| `activeTaperCurve` | 16403 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 16414 | function |  | 6 |
| `taperSamples` | 16424 | function |  | 6 |
| `ensureAsymmetricTaperPreviewElements` | 16431 | function |  | 2 |
| `renderTaperPreview` | 16453 | function |  | 13 |
| `renderTwistCurvePreview` | 16489 | function |  | 5 |
| `cloneShapePresetValue` | 16507 | function |  | 64 |
| `shapeValuesMatch` | 16511 | function |  | 5 |
| `shapeTargetForSelect` | 16519 | function |  | 4 |
| `loadCustomShapePresets` | 16526 | function |  | 2 |
| `saveCustomShapePresets` | 16537 | function |  | 4 |
| `shapePresetLabel` | 16545 | function |  | 4 |
| `setupShapePresetControls` | 16550 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 16575 | function |  | 3 |
| `syncShapePresetSelects` | 16581 | function |  | 8 |
| `populateShapePresetSelects` | 16602 | function |  | 5 |
| `applyShapePreset` | 16629 | function |  | 2 |
| `openSaveShapePreset` | 16666 | function |  | 2 |
| `commitCustomShapePreset` | 16691 | function |  | 2 |
| `openRemoveShapePreset` | 16714 | function |  | 2 |
| `commitRemoveShapePreset` | 16727 | function |  | 2 |
| `taperPointToCanvas` | 16743 | function |  | 4 |
| `canvasToTaperPoint` | 16760 | function |  | 2 |
| `clearTaperMeshPoints` | 16796 | function |  | 2 |
| `taperMeshPointFrame` | 16806 | function |  | 4 |
| `twistMeshPointDistancePerDegree` | 16816 | function |  | 4 |
| `twistMeshGraphAxis` | 16824 | function |  | 4 |
| `addTwistMeshCurvePath` | 16828 | function |  | 2 |
| `appendSegment` | 16849 | arrow |  | 1 |
| `appendFill` | 16852 | arrow |  | 1 |
| `appendSignedSection` | 16858 | arrow |  | 3 |
| `taperMeshPointExtentPerValue` | 16907 | function |  | 6 |
| `updateTaperMeshPoints` | 16944 | function |  | 5 |
| `setTaperMeshPointsVisible` | 17023 | function |  | 5 |
| `renderTaperCurveEditor` | 17041 | function |  | 11 |
| `updateTaperCurveEditorTargetLabel` | 17113 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 17127 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 17143 | function |  | 2 |
| `scheduleTaperCurveEdit` | 17175 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 17184 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 17195 | function |  | 2 |
| `applyTaperCurveEdit` | 17203 | function |  | 10 |
| `openTaperCurveEditor` | 17311 | function |  | 3 |
| `closeTaperCurveEditor` | 17356 | function |  | 6 |
| `updateViewportStatsVisibility` | 17369 | function |  | 6 |
| `canvasToProfile` | 17388 | function |  | 2 |
| `renderSweepProfileEditor` | 17398 | function |  | 7 |
| `applySweepProfileEdit` | 17441 | function |  | 8 |
| `openSweepProfileEditor` | 17468 | function |  | 1 |
| `closeSweepProfileEditor` | 17503 | function |  | 3 |
| `retargetFloatingStrandEditors` | 17512 | function |  | 2 |
| `addLock` | 17527 | function |  | 19 |
| `mirroredScalpRegion` | 17730 | function |  | 5 |
| `mirroredVector` | 17739 | function |  | 12 |
| `mirroredPlacementFrame` | 17743 | function |  | 2 |
| `mirrorPartnerFor` | 17756 | function |  | 40 |
| `decoupleMirrorPartner` | 17760 | function |  | 2 |
| `createMirrorPartner` | 17768 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 17864 | function |  | 6 |
| `mirroredClumpPartners` | 17869 | function |  | 6 |
| `createMirroredClump` | 17875 | function |  | 3 |
| `decoupleMirroredClump` | 17897 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 17906 | function |  | 6 |
| `syncActiveMirror` | 18071 | function |  | 25 |
| `setMirrorXEditing` | 18083 | function |  | 6 |
| `snapshotState` | 18107 | function |  | 7 |
| `scalpTriangleRegion` | 18364 | function |  | 4 |
| `closestPointOnActiveScalp` | 18377 | function |  | 12 |
| `rootAttachmentFrame` | 18449 | function |  | 3 |
| `rootAttachmentLocalFrame` | 18461 | function |  | 4 |
| `resolveRootAttachment` | 18479 | function |  | 4 |
| `curvePointsToRootLocal` | 18519 | function |  | 2 |
| `curvePointsFromRootLocal` | 18531 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 18539 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 18555 | function |  | 2 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 18585 | function |  | 2 |
| `createRootAttachment` | 18597 | function |  | 9 |
| `syncRootAttachmentMetadata` | 18627 | function |  | 4 |
| `rootAttachmentToData` | 18654 | function |  | 2 |
| `rootAttachmentFromData` | 18682 | function |  | 3 |
| `remapLegacyPresetToActiveScalp` | 18721 | function |  | 2 |
| `remapPoint` | 18736 | arrow |  | 1 |
| `remapVector` | 18737 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 18766 | function |  | 2 |
| `importHeadMeshFile` | 18783 | function |  | 3 |
| `importFullBodyMeshFile` | 18806 | function |  | 3 |
| `downloadPreferencesAndPresets` | 18831 | function |  | 1 |
| `importedBooleanPreference` | 18864 | function |  | 11 |
| `loadPreferencesAndPresets` | 18878 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 18948 | function |  | 1 |
| `openHairProjectFile` | 18991 | function |  | 4 |
| `dragContainsApplicationFile` | 19049 | function |  | 3 |
| `safelyRememberRecentProject` | 19058 | function |  | 2 |
| `renderRecentProjectsMenu` | 19067 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 19099 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 19124 | function |  | 2 |
| `confirmDroppedApplicationFile` | 19128 | function |  | 2 |
| `pushUndoState` | 19144 | function |  | 119 |
| `undoLastAction` | 19151 | function |  | 2 |
| `redoLastAction` | 19165 | function |  | 2 |
| `updateHistoryButtons` | 19179 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 19184 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 19201 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 19208 | function |  | 2 |
| `restoreAuthoredScalpForStateRestore` | 19246 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 19323 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 19349 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 19381 | function |  | 2 |
| `finalizeStateRestore` | 19422 | function |  | 2 |
| `restoreState` | 19429 | function |  | 5 |
| `disposeAllEditableObjects` | 19453 | function |  | 2 |
| `restoreLock` | 19474 | function |  | 4 |
| `restoreGuide` | 19691 | function |  | 2 |
| `vectorToData` | 19752 | function |  | 29 |
| `dataToVector` | 19756 | function |  | 31 |
| `frameToData` | 19760 | function |  | 2 |
| `frameFromData` | 19772 | function |  | 2 |
| `applyPresetSelection` | 19784 | function |  | 2 |
| `drawPresetThumbnail` | 19815 | function |  | 1 |
| `fillHair` | 19830 | arrow |  | 9 |
| `strand` | 19842 | arrow |  | 31 |
| `bun` | 19860 | arrow |  | 2 |
| `braid` | 19895 | arrow |  | 2 |
| `renderPresetLibrary` | 19984 | function |  | 3 |
| `setPresetLibraryOpen` | 20043 | function |  | 6 |
| `average` | 20056 | function |  | 4 |
| `fitPointAttributes` | 20060 | function |  | 9 |
| `rebuildCurveObjects` | 20089 | function |  | 10 |
| `createCurvePoints` | 20101 | function |  | 2 |
| `addGeneratedBangPreset` | 20110 | function |  | 1 |
| `sampleScalpQuad` | 20203 | function |  | 4 |
| `createLongLayeredCurlPoints` | 20227 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 20276 | function |  | 1 |
| `columns` | 20277 | arrow |  | 1 |
| `layer` | 20281 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 20495 | function |  | 2 |
| `addBraidedBobPreset` | 20531 | function |  | 1 |
| `evenColumns` | 20532 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 20748 | function |  | 1 |
| `scalpSeed` | 20771 | arrow |  | 1 |
| `createBowlCutPoints` | 21058 | function |  | 2 |
| `addBowlCutPreset` | 21096 | function |  | 1 |
| `scalpRegionAtHit` | 21162 | function |  | 4 |
| `scalpRegionNearestWorldPoint` | 21174 | function |  | 6 |
| `selectedCurveLatticeGuide` | 21181 | function |  | 12 |
| `braidStrokeActive` | 21188 | function |  | 9 |
| `proceduralDrawActive` | 21192 | function |  | 3 |
| `panelStrokeActive` | 21196 | function |  | 6 |
| `activeStrokeSurfaceInput` | 21200 | function |  | 4 |
| `activeStrokeSurfaceValue` | 21204 | function |  | 28 |
| `normalizedLiveSurfaceSelection` | 21208 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 21214 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 21218 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 21222 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 21226 | function |  | 3 |
| `liveSurfaceStrandId` | 21236 | function |  | 4 |
| `liveSurfaceStrand` | 21240 | function |  | 4 |
| `liveSurfaceGuideId` | 21245 | function |  | 3 |
| `guideSupportsLiveSurface` | 21249 | function |  | 2 |
| `liveSurfaceGuide` | 21256 | function |  | 4 |
| `refreshLiveSurfaceOptions` | 21263 | function |  | 12 |
| `activeStrokeScalpOffset` | 21303 | function |  | 4 |
| `activeStrokeBrushSize` | 21309 | function |  | 10 |
| `activeStrokeBrushDepth` | 21315 | function |  | 5 |
| `strokeSurfaceIsContextual` | 21321 | function |  | 7 |
| `contextualPlaneAtOrigin` | 21329 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 21339 | function |  | 13 |
| `worldNormalAtHit` | 21378 | function |  | 6 |
| `selectedPolyMesh` | 21386 | function |  | 10 |
| `addPolyLock` | 21391 | function |  | 2 |
| `ensurePolyMesh` | 21410 | function |  | 3 |
| `polySurfaceSample` | 21414 | function |  | 4 |
| `polyTargetAtEvent` | 21425 | function |  | 6 |
| `refreshPolyMesh` | 21451 | function |  | 10 |
| `ensurePolyFillPreview` | 21460 | function |  | 2 |
| `clearPolyFillPreview` | 21497 | function |  | 17 |
| `polyFillCandidateForEvent` | 21502 | function |  | 3 |
| `showPolyFillPreview` | 21522 | function |  | 2 |
| `updatePolyFillPreview` | 21548 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 21573 | function |  | 5 |
| `fillPolyGap` | 21583 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 21594 | function |  | 2 |
| `projectPolyRelaxPoint` | 21614 | function |  | 2 |
| `removePolyPointAttributes` | 21658 | function |  | 3 |
| `deletePolyComponent` | 21667 | function |  | 2 |
| `addPolyPoint` | 21690 | function |  | 4 |
| `appendPolyStrokeRow` | 21699 | function |  | 4 |
| `beginPolyBrushPointer` | 21719 | function |  | 1 |
| `finishPolyAltDelete` | 21805 | function |  | 1 |
| `updatePolyBrushStroke` | 21819 | function |  | 1 |
| `finishPolyBrushStroke` | 21909 | function |  | 4 |
| `drawScalpRegionAtEvent` | 21946 | function |  | 2 |
| `drawSampleFromHit` | 21969 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 21983 | function |  | 3 |
| `strokeLength` | 22020 | function |  | 9 |
| `resampleDrawStroke` | 22026 | function |  | 2 |
| `processedDrawStroke` | 22058 | function |  | 8 |
| `strokeSurfaceNormals` | 22087 | function |  | 7 |
| `drawClumpFrame` | 22098 | function |  | 4 |
| `nearestCurveParameter` | 22107 | function |  | 2 |
| `drawClumpSampleNormal` | 22121 | function |  | 6 |
| `drawClumpTemplateVector` | 22130 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 22136 | function |  | 3 |
| `drawClumpStrandMaps` | 22152 | function |  | 4 |
| `nextClumpName` | 22207 | function |  | 6 |
| `initializeClumpShape` | 22214 | function |  | 5 |
| `stableClumpVariation` | 22225 | function |  | 3 |
| `createClumpFromLocks` | 22237 | function |  | 7 |
| `addLockToClump` | 22262 | function |  | 4 |
| `stableBranchBaseNormals` | 22280 | function |  | 4 |
| `ensureBranchParentNormalField` | 22291 | function |  | 2 |
| `branchParentFrame` | 22297 | function |  | 7 |
| `branchLocalVector` | 22309 | function |  | 3 |
| `branchWorldVector` | 22313 | function |  | 4 |
| `captureBranchLocalState` | 22319 | function |  | 6 |
| `enforceBranchRootPosition` | 22347 | function |  | 4 |
| `syncBranchRootRegionOffsets` | 22397 | function |  | 7 |
| `updateBranchRootRegionCenter` | 22424 | function |  | 2 |
| `clampRegionParam` | 22471 | function |  | 113 |
| `branchRootRegionFromParam` | 22478 | function |  | 4 |
| `cloneBranchRootRegion` | 22501 | function |  | 5 |
| `flip` | 22503 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 22536 | function |  | 8 |
| `setBranchRootRegionPoint` | 22567 | function |  | 3 |
| `branchRegionUVToCanvas` | 22601 | function |  | 10 |
| `branchRegionCanvasToUV` | 22604 | function |  | 4 |
| `openBranchRegionEditor` | 22610 | function |  | 2 |
| `closeBranchRegionEditor` | 22624 | function |  | 2 |
| `retargetBranchRegionEditor` | 22630 | function |  | 2 |
| `renderBranchRegionEditor` | 22635 | function |  | 9 |
| `applyBranchRegionView` | 22721 | function |  | 6 |
| `resetBranchRegionZoom` | 22724 | function |  | 1 |
| `branchRegionNavAction` | 22730 | function |  | 2 |
| `beginBranchRegionCanvasNav` | 22744 | function |  | 1 |
| `updateBranchRegionCanvasNav` | 22764 | function |  | 1 |
| `updateBranchRegionCanvasZoom` | 22768 | function |  | 2 |
| `updateBranchRegionCanvasPan` | 22794 | function |  | 2 |
| `endBranchRegionCanvasNav` | 22806 | function |  | 1 |
| `onBranchRegionCanvasWheel` | 22811 | function |  | 1 |
| `branchRegionEventUV` | 22831 | function |  | 3 |
| `beginBranchRegionCanvasDrag` | 22839 | function |  | 1 |
| `updateBranchRegionCanvasDrag` | 22944 | function |  | 1 |
| `endBranchRegionCanvasDrag` | 23077 | function |  | 1 |
| `pointerToNdc` | 23082 | function |  | 3 |
| `beginBranchSweepStartDrag` | 23092 | function |  | 1 |
| `updateBranchSweepStartDrag` | 23106 | function |  | 1 |
| `endBranchSweepStartDrag` | 23129 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 23136 | function |  | 5 |
| `gridProfileSkipCol` | 23163 | function |  | 3 |
| `branchRootRegionSurface` | 23172 | function |  | 6 |
| `toGridCol` | 23197 | arrow |  | 5 |
| `toRow` | 23201 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 23256 | function |  | 2 |
| `branchRootRegionWorldPoints` | 23276 | function |  | 2 |
| `pointAt` | 23282 | arrow |  | 5 |
| `applyBranchRootRegionCarving` | 23309 | function |  | 3 |
| `applyBranchRootOffset` | 23381 | function |  | 3 |
| `attachDrawnLocksAsBranches` | 23400 | function |  | 3 |
| `branchChildrenFor` | 23420 | function |  | 9 |
| `detachBranch` | 23424 | function |  | 2 |
| `updateBranchChildren` | 23435 | function |  | 4 |
| `clumpDirectMembers` | 23478 | function |  | 3 |
| `clumpMembersForGuide` | 23483 | function |  | 6 |
| `clumpGuideForLock` | 23487 | function |  | 13 |
| `proceduralGuideForLock` | 23492 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 23499 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 23506 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 23513 | function |  | 3 |
| `proceduralBranchWorldPoints` | 23525 | function |  | 2 |
| `applyProceduralBranchSettings` | 23538 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 23577 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 23593 | function |  | 3 |
| `createProceduralAccessoryLock` | 23607 | function |  | 2 |
| `applyProceduralAccessorySettings` | 23659 | function |  | 2 |
| `clumpFrameAt` | 23710 | function |  | 5 |
| `commitClumpMemberRestState` | 23718 | function |  | 10 |
| `updateClumpMembers` | 23801 | function |  | 10 |
| `dissolveClump` | 23905 | function |  | 6 |
| `detachLockFromClump` | 23942 | function |  | 4 |
| `updateDrawVolumePreview` | 23968 | function |  | 5 |
| `hideDrawClumpPreviews` | 23992 | function |  | 5 |
| `resetDrawVolumePreview` | 23998 | function |  | 3 |
| `updateDrawStrandPreview` | 24004 | function |  | 23 |
| `continueFromTipEnabled` | 24223 | function |  | 2 |
| `selectedTipContinuationLock` | 24229 | function |  | 3 |
| `selectedDrawBranchPoint` | 24242 | function |  | 3 |
| `canBranchDrawFromLock` | 24259 | function |  | 3 |
| `beginDrawStrandStroke` | 24266 | function |  | 2 |
| `beginDrawFreePlane` | 24391 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 24405 | function |  | 2 |
| `updateDrawStrandStroke` | 24430 | function |  | 1 |
| `createDrawnLock` | 24476 | function |  | 3 |
| `setting` | 24480 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 24548 | function |  | 4 |
| `createDrawnBraid` | 24556 | function |  | 2 |
| `createDrawnStrand` | 24613 | function |  | 2 |
| `createDrawnPanel` | 24740 | function |  | 2 |
| `surfaceLatticeNormal` | 24790 | function |  | 2 |
| `createSurfaceLockFromLattice` | 24805 | function |  | 3 |
| `createViewportSurface` | 24870 | function |  | 2 |
| `loftSurfaceProfilePoints` | 24899 | function |  | 6 |
| `hideLoftSurfacePreviews` | 24905 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 24912 | function |  | 4 |
| `updateLoftSurfacePreview` | 24921 | function |  | 5 |
| `resetLoftSurfaceDraft` | 24953 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 24969 | function |  | 3 |
| `cloneCurveSurfaceSource` | 24987 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 25009 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 25035 | function |  | 3 |
| `curveSurfaceProfilePoints` | 25045 | function |  | 3 |
| `curveSurfaceProfileNormals` | 25049 | function |  | 2 |
| `curveSurfacePreviewLock` | 25058 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 25081 | function |  | 2 |
| `hideCurveSurfacePreview` | 25097 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 25109 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 25114 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 25123 | function |  | 3 |
| `curveSurfaceSideVector` | 25161 | function |  | 4 |
| `curveSurfaceDraftCurves` | 25174 | function |  | 2 |
| `curveSurfaceFallbackHit` | 25182 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 25195 | function |  | 5 |
| `updateCurveSurfacePreview` | 25215 | function |  | 6 |
| `resetCurveSurfaceDraft` | 25277 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 25299 | function |  | 3 |
| `beginCurveSurfaceStroke` | 25314 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 25362 | function |  | 3 |
| `updateCurveSurfaceStroke` | 25397 | function |  | 1 |
| `finishCurveSurfaceStroke` | 25429 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 25487 | function |  | 2 |
| `commitCurveSurfaceDraft` | 25564 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 25569 | function |  | 8 |
| `beginLoftSurfaceStroke` | 25578 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 25612 | function |  | 2 |
| `updateLoftSurfaceStroke` | 25623 | function |  | 1 |
| `finishLoftSurfaceStroke` | 25653 | function |  | 2 |
| `extendDrawnStrand` | 25710 | function |  | 2 |
| `finishDrawStrandStroke` | 25743 | function |  | 7 |
| `createPlacedStrand` | 25770 | function |  | 2 |
| `placedPointCount` | 25834 | function |  | 3 |
| `createPlacedPoints` | 25838 | function |  | 3 |
| `pushPointOutsideHead` | 25857 | function |  | 8 |
| `resizePlacedStrand` | 25889 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 25906 | function |  | 5 |
| `beginPlaceEdit` | 25911 | function |  | 2 |
| `updatePlaceEdit` | 25929 | function |  | 1 |
| `updatePlacementLength` | 25943 | function |  | 3 |
| `updatePlacementOrientation` | 25953 | function |  | 3 |
| `endPlaceEdit` | 25971 | function |  | 1 |
| `confirmPendingPlacedStrand` | 25986 | function |  | 1 |
| `pendingPlacedLock` | 25996 | function |  | 2 |
| `beginPlacementPointer` | 26000 | function |  | 3 |
| `finishPlacementPointer` | 26010 | function |  | 2 |
| `confirmPlacementStep` | 26034 | function |  | 2 |
| `finishPlacementFlow` | 26057 | function |  | 7 |
| `updatePlacementStatus` | 26070 | function |  | 82 |
| `deselectStrands` | 26209 | function |  | 12 |
| `beginSelectionMarquee` | 26224 | function |  | 3 |
| `beginAltOrbit` | 26248 | function |  | 1 |
| `beginBlenderNavigation` | 26260 | function |  | 1 |
| `endBlenderNavigation` | 26305 | function |  | 1 |
| `prepareSelectPointerCapture` | 26313 | function |  | 1 |
| `endSelectPointerCapture` | 26319 | function |  | 1 |
| `endAltOrbit` | 26325 | function |  | 1 |
| `dollyCameraByDrag` | 26332 | function |  | 2 |
| `fastDragMagnitude` | 26355 | function |  | 2 |
| `beginHoudiniZoomDrag` | 26361 | function |  | 1 |
| `updateHoudiniZoomDrag` | 26369 | function |  | 1 |
| `endHoudiniZoomDrag` | 26386 | function |  | 1 |
| `updateSelectionMarquee` | 26394 | function |  | 1 |
| `pointInsideSelectionMarquee` | 26411 | function |  | 3 |
| `selectPointsInMarquee` | 26419 | function |  | 2 |
| `pointKey` | 26445 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 26476 | function |  | 2 |
| `objectInsideSelectionMarquee` | 26513 | function |  | 3 |
| `projectedPoint` | 26530 | arrow |  | 1 |
| `selectObjectsInMarquee` | 26559 | function |  | 2 |
| `finishSelectionMarquee` | 26604 | function |  | 2 |
| `headMeshes` | 26627 | function |  | 9 |
| `strandSplitProfileData` | 26635 | function |  | 4 |
| `strandSplitControlPoint` | 26648 | function |  | 4 |
| `panelSplitControlPoint` | 26684 | function |  | 6 |
| `strandControlPointRaycast` | 26740 | function |  | 1 |
| `strandControlPointFrame` | 26775 | function |  | 6 |
| `branchRootGizmoFrame` | 26806 | function |  | 5 |
| `strandControlPointHitFromEvent` | 26824 | function |  | 5 |
| `createCurveObjects` | 26882 | function |  | 4 |
| `polyEdgeKey` | 27055 | function |  | 2 |
| `polyMeshEdges` | 27059 | function |  | 2 |
| `populatePolyEditObjects` | 27073 | function |  | 3 |
| `createPolyEditObjects` | 27134 | function |  | 2 |
| `rebuildPolyEditObjects` | 27142 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 27156 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 27163 | function |  | 2 |
| `strandWidthEdgeSample` | 27172 | function |  | 3 |
| `strandWidthEdgePoints` | 27195 | function |  | 2 |
| `sculptBrushDebugRaycast` | 27209 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 27213 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 27220 | function |  | 3 |
| `refreshSculptBrushDebugView` | 27232 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 27237 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 27243 | function |  | 3 |
| `updateCurveObjects` | 27257 | function |  | 41 |
| `createCurveNormalIndicator` | 27514 | function |  | 2 |
| `pointUpDirection` | 27540 | function |  | 2 |
| `curveFrameAtPoint` | 27544 | function |  | 5 |
| `curveFrameAt` | 27565 | function |  | 10 |
| `strandTwistAt` | 27585 | function |  | 6 |
| `controlPointRotationAt` | 27590 | function |  | 6 |
| `strandProfileTwistAt` | 27594 | function |  | 2 |
| `strandFrameAt` | 27600 | function |  | 1 |
| `curveFrameAtSnapshot` | 27606 | function |  | 3 |
| `outwardNormalAtPoint` | 27625 | function |  | 11 |
| `sampledSurfaceNormal` | 27637 | function |  | 2 |
| `guidedNormalAt` | 27653 | function |  | 5 |
| `twistFromHandle` | 27672 | function |  | 3 |
| `signedAngleAroundAxis` | 27693 | function |  | 5 |
| `handleColor` | 27700 | function |  | 2 |
| `isAffectedCurvePoint` | 27723 | function |  | 2 |
| `syncLockFromCurve` | 27729 | function |  | 26 |
| `labelForPreset` | 27759 | function |  | 1 |
| `rebuildLockGeometry` | 27763 | function |  | 23 |
| `scheduleSculptBrushGeometryUpdates` | 27790 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 27798 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 27804 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 27826 | function |  | 8 |
| `updateLockGeometry` | 27839 | function |  | 57 |
| `setGroupColorView` | 27860 | function |  | 2 |
| `createUvCheckerTexture` | 27870 | function |  | 3 |
| `ensureUvCheckerForLock` | 27906 | function |  | 4 |
| `removeUvCheckerFromLock` | 27939 | function |  | 3 |
| `invalidateUvInspector` | 27954 | function |  | 7 |
| `uvInspectorRecord` | 27958 | function |  | 1 |
| `uvInspectorRecords` | 27997 | function |  | 2 |
| `drawUvInspectorGrid` | 28001 | function |  | 2 |
| `renderUvInspector` | 28035 | function |  | 3 |
| `setUvCheckerEnabled` | 28094 | function |  | 3 |
| `strandViewportBaseColor` | 28111 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 28146 | function |  | 3 |
| `syncStrandSelectionOutline` | 28152 | function |  | 2 |
| `applyLockedStrandPalette` | 28163 | function |  | 2 |
| `syncLockedStrandWireVisual` | 28172 | function |  | 6 |
| `setStrandSelectionVisual` | 28181 | function |  | 6 |
| `proceduralParentOutlineVisible` | 28197 | function |  | 2 |
| `syncProceduralParentVisibility` | 28204 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 28213 | function |  | 2 |
| `updateStrandSelectionHighlight` | 28217 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 28221 | function |  | 2 |
| `resetGuideSelectionVisuals` | 28234 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 28254 | function |  | 3 |
| `selectLock` | 28287 | function |  | 46 |
| `deselectStrandsForGuideEditor` | 28340 | function |  | 6 |
| `syncGroupInputs` | 28351 | function |  | 3 |
| `topologyStatsForLock` | 28384 | function |  | 4 |
| `formatTopologyStats` | 28392 | function |  | 5 |
| `updateTopologyStats` | 28396 | function |  | 20 |
| `normalizeBraidDimensions` | 28430 | function |  | 3 |
| `normalizeStrandDimensions` | 28443 | function |  | 3 |
| `strandBaseWidth` | 28457 | function |  | 5 |
| `strandWidthDimension` | 28461 | function |  | 5 |
| `strandDepthDimension` | 28469 | function |  | 8 |
| `setStrandWidthDimension` | 28477 | function |  | 2 |
| `setStrandDepthDimension` | 28499 | function |  | 4 |
| `syncShapeDimensionInputs` | 28515 | function |  | 4 |
| `syncCreationShapeInputs` | 28551 | function |  | 4 |
| `syncViewportDrawSettings` | 28589 | function |  | 5 |
| `syncPanelShapeInputs` | 28603 | function |  | 6 |
| `syncStrandSplitInputs` | 28629 | function |  | 4 |
| `syncHairCardControls` | 28638 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 28646 | function |  | 3 |
| `updateAttributeEditorMode` | 28685 | function |  | 19 |
| `pinActiveToolSettingsPanel` | 28835 | function |  | 3 |
| `curveLatticeForGroup` | 28858 | function |  | 2 |
| `filterCurveLatticesToGroup` | 28876 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 28921 | function |  | 2 |
| `showCurveLatticeForGroup` | 28938 | function |  | 2 |
| `selectStrandGroup` | 28975 | function |  | 3 |
| `selectCurvePoint` | 29017 | function |  | 10 |
| `updateSelectedPointLabel` | 29031 | function |  | 14 |
| `syncInputs` | 29044 | function |  | 16 |
| `syncClumpGuidePanel` | 29090 | function |  | 3 |
| `getSelectedLock` | 29117 | function |  | 104 |
| `selectedLocksInOrder` | 29121 | function |  | 37 |
| `lockStrands` | 29127 | function |  | 3 |
| `lockSelectedStrands` | 29160 | function |  | 3 |
| `unlockStrands` | 29166 | function |  | 3 |
| `unlockAllStrands` | 29181 | function |  | 3 |
| `strandEditFamily` | 29185 | function |  | 7 |
| `compatibleSelectedLocks` | 29190 | function |  | 6 |
| `selectedEditRoots` | 29197 | function |  | 2 |
| `editSelectedLocks` | 29210 | function |  | 21 |
| `multiEditValuesEqual` | 29243 | function |  | 2 |
| `setMixedControl` | 29252 | function |  | 28 |
| `syncMultiStrandInputs` | 29269 | function |  | 16 |
| `values` | 29285 | arrow |  | 43 |
| `selectedRebuildableCurves` | 29365 | function |  | 5 |
| `createCompoundStrand` | 29372 | function |  | 1 |
| `refreshRebuildCurveDialog` | 29433 | function |  | 9 |
| `openRebuildCurveDialog` | 29446 | function |  | 1 |
| `rebuildSelectedCurves` | 29460 | function |  | 2 |
| `selectionCanBecomeClump` | 29499 | function |  | 4 |
| `createClumpFromSelection` | 29504 | function |  | 3 |
| `cleanSelectionSets` | 29516 | function |  | 2 |
| `createSelectionSetFromSelection` | 29521 | function |  | 3 |
| `selectionSetById` | 29532 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 29536 | function |  | 7 |
| `editSelectionSetFromSelection` | 29545 | function |  | 5 |
| `deleteSelectionSet` | 29565 | function |  | 2 |
| `selectSelectionSet` | 29574 | function |  | 2 |
| `deleteSelectedStrands` | 29584 | function |  | 4 |
| `deleteGuide` | 29592 | function |  | 3 |
| `deleteSelectedGuide` | 29615 | function |  | 3 |
| `deleteSelectedReferenceImage` | 29619 | function |  | 4 |
| `hasDeletableSelection` | 29632 | function |  | 2 |
| `deleteCurrentSelection` | 29640 | function |  | 3 |
| `hideOutlinerContextMenu` | 29648 | function |  | 17 |
| `outlinerLockTargets` | 29653 | function |  | 3 |
| `showOutlinerContextMenu` | 29680 | function |  | 10 |
| `hideStrandRadialMenu` | 29760 | function |  | 4 |
| `ensureRadialButtonCapacity` | 29771 | function |  | 3 |
| `radialButtonDimensions` | 29784 | function |  | 4 |
| `radialMenuDimensionsForKind` | 29793 | function |  | 3 |
| `applyRadialMenuDimensions` | 29810 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 29816 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 29829 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 29850 | function |  | 2 |
| `selectionSetRadialMenuOption` | 29867 | function |  | 4 |
| `selectedMirrorRadialOptions` | 29876 | function |  | 3 |
| `strandVisibilityRadialOptions` | 29898 | function |  | 5 |
| `clumpMirrorRadialOptions` | 29916 | function |  | 2 |
| `contextualRadialOptions` | 29923 | function |  | 3 |
| `sharedRadialFrameDimensions` | 30052 | function |  | 3 |
| `layoutContextualRadialOptions` | 30056 | function |  | 4 |
| `renderRadialActionList` | 30080 | function |  | 3 |
| `radialListOptionAtPointer` | 30098 | function |  | 3 |
| `syncRadialListHighlight` | 30120 | function |  | 3 |
| `configureContextualRadialMenu` | 30126 | function |  | 3 |
| `beginStrandRadialGesture` | 30186 | function |  | 2 |
| `enterStrandRadialSubmenu` | 30220 | function |  | 2 |
| `updateStrandRadialGesture` | 30266 | function |  | 1 |
| `performStrandRadialAction` | 30305 | function |  | 2 |
| `finishStrandRadialGesture` | 30408 | function |  | 2 |
| `cancelStrandRadialGesture` | 30418 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 30425 | function |  | 1 |
| `setPullMoveEnabled` | 30431 | function |  | 3 |
| `toolRadialOptions` | 30439 | function |  | 2 |
| `hideToolRadialMenu` | 30464 | function |  | 4 |
| `beginToolRadialGesture` | 30477 | function |  | 2 |
| `beginToolShortcutPress` | 30517 | function |  | 2 |
| `finishToolShortcutPress` | 30532 | function |  | 2 |
| `cancelToolShortcutPress` | 30541 | function |  | 5 |
| `setRadialMenusEnabled` | 30549 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 30562 | function |  | 5 |
| `setNavigationTipsEnabled` | 30577 | function |  | 5 |
| `configureNavigationMouseButtons` | 30584 | function |  | 3 |
| `syncNavigationModifierLocks` | 30597 | function |  | 7 |
| `setNavigationStyle` | 30602 | function |  | 5 |
| `applyCameraSmoothingPreference` | 30618 | function |  | 4 |
| `setCameraSmoothingEnabled` | 30633 | function |  | 5 |
| `setCameraSmoothingStrength` | 30639 | function |  | 5 |
| `setScaleSensitivity` | 30647 | function |  | 3 |
| `setToolTipsEnabled` | 30655 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 30662 | function |  | 5 |
| `setViewportStatisticsEnabled` | 30671 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 30679 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 30694 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 30703 | function |  | 5 |
| `sideNamingDisplayId` | 30712 | function |  | 3 |
| `referenceViewDisplayLabel` | 30724 | function |  | 6 |
| `strandRegionDisplayLabel` | 30734 | function |  | 10 |
| `updateSideNamingLabels` | 30752 | function |  | 2 |
| `setSideNamingPerspective` | 30779 | function |  | 5 |
| `setControlPointDisplaySize` | 30788 | function |  | 6 |
| `scaleHexColor` | 30800 | function |  | 3 |
| `setViewportBackgroundColor` | 30805 | function |  | 7 |
| `setDefaultHairShader` | 30827 | function |  | 5 |
| `setPreferenceCategory` | 30833 | function |  | 4 |
| `openPreferencesDialog` | 30860 | function |  | 1 |
| `savePreferencesDialog` | 30888 | function |  | 1 |
| `cancelPreferencesDialog` | 30912 | function |  | 3 |
| `updateToolRadialGesture` | 30941 | function |  | 1 |
| `performToolRadialAction` | 30970 | function |  | 2 |
| `finishToolRadialGesture` | 30980 | function |  | 2 |
| `cancelToolRadialGesture` | 30989 | function |  | 5 |
| `duplicatePlacementTarget` | 30996 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 31023 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 31027 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 31037 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 31042 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 31054 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 31065 | function |  | 7 |
| `openProceduralDuplicateDialog` | 31073 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 31090 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 31111 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 31122 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 31128 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 31134 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 31167 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 31322 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 31424 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 31465 | function |  | 2 |
| `updateDuplicatePlacement` | 31492 | function |  | 2 |
| `beginDuplicatePlacement` | 31556 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 31620 | function |  | 2 |
| `confirmDuplicatePlacement` | 31661 | function |  | 1 |
| `cancelDuplicatePlacement` | 31698 | function |  | 4 |
| `outlinerClumpLocks` | 31724 | function |  | 11 |
| `handleOutlinerClumpDrop` | 31728 | function |  | 3 |
| `createOutlinerStrandButton` | 31751 | function |  | 4 |
| `createOutlinerCurveSurface` | 31837 | function |  | 2 |
| `createOutlinerClump` | 31933 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 32015 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 32022 | function |  | 2 |
| `renderLockList` | 32101 | function |  | 70 |
| `updateCount` | 32255 | function |  | 34 |
| `captureInputUndo` | 32264 | function |  | 1 |
| `bindUndoCapture` | 32270 | function |  | 36 |
| `bindLockInput` | 32281 | function |  | 2 |
| `applyValue` | 32298 | arrow |  | 2 |
| `applyUniformTransformScale` | 32617 | function |  | 2 |
| `applyReducedTransformScale` | 32634 | function |  | 2 |
| `applyTransformPrecision` | 32673 | function |  | 2 |
| `updateTransformScalePointer` | 32702 | function |  | 1 |
| `finishSweepProfileDrag` | 32933 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 33029 | function |  | 3 |
| `finishTaperCurveDrag` | 33091 | function |  | 1 |
| `beginTaperMeshPointDrag` | 33134 | function |  | 1 |
| `updateTaperMeshPointDrag` | 33215 | function |  | 1 |
| `finishTaperMeshPointDrag` | 33270 | function |  | 6 |
| `updateSelectedTaperPoint` | 33294 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 33864 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 33869 | function |  | 4 |
| `syncDrawCurlControls` | 33924 | function |  | 5 |
| `handleLiveSurfaceChange` | 33972 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 34054 | function |  | 3 |
| `resampleSurfaceLock` | 34069 | function |  | 2 |
| `changePanelSplitCount` | 34182 | function |  | 3 |
| `applyPresetControl` | 34290 | function |  | 2 |
| `applyCreationToolSettings` | 34311 | function |  | 2 |
| `populateCreationPresetSelect` | 34355 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 34379 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 34412 | function |  | 5 |
| `createCustomCreationPreset` | 34420 | function |  | 3 |
| `createCustomClumpPreset` | 34435 | function |  | 3 |
| `commitCustomCreationPreset` | 34450 | function |  | 2 |
| `openRemoveCreationPreset` | 34511 | function |  | 3 |
| `commitRemoveCreationPreset` | 34524 | function |  | 1 |
| `applyBraidToolPreset` | 34541 | function |  | 2 |
| `selectedBranchChildLock` | 34653 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 34657 | function |  | 2 |
| `initPanelResizeHandles` | 34763 | function |  | 2 |
| `applyWidth` | 34769 | arrow |  | 2 |
| `restoreWidth` | 34776 | arrow |  | 2 |
| `bindResize` | 34784 | arrow |  | 2 |
| `onMove` | 34792 | arrow |  | 0 |
| `onUp` | 34796 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 34813 | function |  | 2 |
| `initFloatingPanelControls` | 34822 | function |  | 2 |
| `detach` | 34831 | arrow |  | 43 |
| `endDrag` | 34869 | arrow |  | 0 |
| `endResize` | 34901 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 34912 | function |  | 3 |
| `selectPatchNotesVersion` | 35046 | function |  | 3 |
| `requestReferenceImage` | 35079 | function |  | 5 |
| `toggleCapsuleGuideTool` | 35283 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 35289 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 35296 | function |  | 1 |
| `deleteLocks` | 35863 | function |  | 10 |
| `disposeCurveObjects` | 35941 | function |  | 4 |
| `beginPanelSplitHandleDrag` | 35993 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 36024 | function |  | 1 |
| `endPanelSplitHandleDrag` | 36099 | function |  | 2 |
| `resize` | 36132 | function |  | 4 |
| `handleViewportPointerMove` | 36143 | function |  | 1 |
| `blockProportionalSizingEvent` | 36154 | function |  | 1 |
| `updateLightAngleFromInputs` | 36160 | function |  | 2 |
| `startViewSnap` | 36174 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 36204 | function |  | 3 |
| `trackViewportPointerDown` | 36221 | function |  | 1 |
| `trackViewportPointerMove` | 36237 | function |  | 1 |
| `clearViewportPointer` | 36245 | function |  | 1 |
| `updateViewSnap` | 36250 | function |  | 1 |
| `nearestCardinalAxis` | 36286 | function |  | 5 |
| `cardinalAxisKey` | 36300 | function |  | 5 |
| `steppedDragAmount` | 36304 | function |  | 3 |
| `snapCameraToCardinalAxis` | 36310 | function |  | 4 |
| `endViewSnap` | 36326 | function |  | 4 |
| `activateStrandControlPoint` | 36336 | function |  | 4 |
| `refreshStrandControlPointSelection` | 36386 | function |  | 4 |
| `addStrandControlPointSelection` | 36413 | function |  | 3 |
| `removeStrandControlPointSelection` | 36430 | function |  | 3 |
| `sampleStrandPointNormal` | 36444 | function |  | 2 |
| `sampleStrandPointVectors` | 36454 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 36460 | function |  | 2 |
| `resampleStrandCurveData` | 36471 | function |  | 4 |
| `resampleMatchingVectors` | 36477 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 36516 | function |  | 4 |
| `removeStrandCurvePoint` | 36527 | function |  | 2 |
| `closestStrandCurveParameter` | 36540 | function |  | 2 |
| `insertStrandCurvePoint` | 36569 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 36586 | function |  | 2 |
| `selectionModifierCursorAvailable` | 36596 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 36612 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 36619 | function |  | 4 |
| `prepareCurvePointSelection` | 36641 | function |  | 1 |
| `finishCurvePointInsertion` | 36752 | function |  | 1 |
| `finishPointRemoval` | 36767 | function |  | 1 |
| `editableStrandWidth` | 36785 | function |  | 6 |
| `editableStrandWidthBounds` | 36797 | function |  | 2 |
| `applyEditableStrandWidth` | 36803 | function |  | 3 |
| `viewportPixelPoint` | 36839 | function |  | 3 |
| `syncSculptBrushControls` | 36847 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 36862 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 36870 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 36878 | function |  | 1 |
| `sculptBrushPlaneOffset` | 36884 | function |  | 5 |
| `setSculptBrushCursorVisible` | 36888 | function |  | 7 |
| `updateSculptBrushCursor` | 36895 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 36917 | function |  | 4 |
| `sculptBrushEditableLock` | 36924 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 36934 | function |  | 5 |
| `sculptBrushLockViable` | 36940 | function |  | 5 |
| `sculptBrushUnits` | 36951 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 36989 | function |  | 4 |
| `sculptBrushPointWeight` | 37039 | function |  | 5 |
| `sculptBrushWorldDelta` | 37049 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 37058 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 37084 | function |  | 2 |
| `beginSculptMoveStroke` | 37142 | function |  | 1 |
| `applySculptMoveStrokeSample` | 37204 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 37439 | function |  | 3 |
| `updateSculptMoveStroke` | 37448 | function |  | 1 |
| `finishSculptMoveStroke` | 37464 | function |  | 3 |
| `strandControlPointHit` | 37512 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 37516 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 37594 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 37628 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 37668 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 37681 | function |  | 1 |
| `setHoveredControlPoint` | 37720 | function |  | 7 |
| `visibleControlPointHoverTargets` | 37733 | function |  | 2 |
| `updateControlPointHover` | 37769 | function |  | 1 |
| `animate` | 38325 | function |  | 2 |
| `syncCompactSidebarLayout` | 38356 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 38375 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 38381 | function |  | 3 |
| `setAttributeEditorTab` | 38387 | function |  | 6 |

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

## modules/io/creation-presets.js（232 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createCreationPresetsApi` | 5 | function | export | 2 |
| `presetNumber` | 32 | function |  | 23 |
| `clonePresetShape` | 37 | function |  | 7 |
| `creationPresetSnapshot` | 46 | function |  | 3 |
| `creationToolSettingsSnapshot` | 94 | function |  | 2 |
| `normalizeCreationPresetLibrary` | 121 | function |  | 2 |
| `loadCustomCreationPresets` | 128 | function |  | 1 |
| `saveCustomCreationPresets` | 138 | function |  | 2 |
| `migrateLegacyClumpPresets` | 146 | function |  | 1 |
| `applyCreationPresetSnapshot` | 182 | function |  | 2 |
| `applyCustomCreationPreset` | 199 | function |  | 1 |

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
