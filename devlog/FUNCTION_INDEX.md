# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1803** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（31454 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 270 | function |  | 3 |
| `saveBooleanPreference` | 298 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 302 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 307 | function |  | 2 |
| `normalizeScaleSensitivity` | 312 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 317 | function |  | 2 |
| `normalizeSideNamingPerspective` | 322 | function |  | 2 |
| `normalizeNavigationStyle` | 326 | function |  | 2 |
| `setupEditableSliderControls` | 341 | function |  | 2 |
| `syncNumberFromRange` | 392 | arrow |  | 0 |
| `applyNumberValue` | 399 | arrow |  | 0 |
| `copyCameraPose` | 505 | function |  | 3 |
| `updateCameraProjectionForViewport` | 511 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 524 | function |  | 3 |
| `setOrthographicView` | 530 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 570 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 599 | function |  | 2 |
| `removeRotateFreeAxisRing` | 625 | function |  | 2 |
| `deflateTransformGizmoPickers` | 637 | function |  | 2 |
| `nextStrandName` | 1032 | function |  | 2 |
| `activeDrawClumpTemplate` | 1117 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1122 | function |  | 3 |
| `drawModeCreatesClump` | 1149 | function |  | 1 |
| `isPanelGeometry` | 1293 | function |  | 51 |
| `normalizePanelSplits` | 1297 | function |  | 3 |
| `clonePanelSplits` | 1309 | function |  | 32 |
| `snapPanelSplitHeight` | 1313 | function |  | 5 |
| `createQuadSphereGeometry` | 1348 | function |  | 2 |
| `vertexIndex` | 1362 | function |  | 11 |
| `addEdge` | 1380 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1535 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1715 | function |  | 2 |
| `currentStrandSelectionState` | 1777 | function |  | 4 |
| `applyStrandSelectionState` | 1781 | function |  | 5 |
| `clearStrandSelectionState` | 1786 | function |  | 6 |
| `disposeGuideModel` | 2838 | function |  | 3 |
| `syncHeadTransformInputs` | 2849 | function |  | 3 |
| `applyHeadTransform` | 2856 | function |  | 4 |
| `resetHeadTransform` | 2876 | function |  | 2 |
| `installGuideModel` | 2891 | function |  | 5 |
| `loadDefaultGuideModel` | 2967 | function |  | 3 |
| `braidTemplateFromEntries` | 2990 | function |  | 4 |
| `braidMeshEntries` | 3022 | function |  | 2 |
| `prepareBraidBodyCache` | 3034 | function |  | 2 |
| `quantize` | 3043 | arrow |  | 21 |
| `sourceNormalAt` | 3055 | arrow |  | 1 |
| `clusterBoundary` | 3058 | arrow |  | 2 |
| `normalBuckets` | 3075 | arrow |  | 2 |
| `applyBucketPair` | 3107 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3138 | function |  | 2 |
| `annotateBraidObjTopology` | 3159 | function |  | 2 |
| `loadBraidMeshPreset` | 3179 | function |  | 3 |
| `createSplitControlHandle` | 3196 | function |  | 6 |
| `frameGuideModel` | 3211 | function |  | 2 |
| `normalizeHairLayer` | 3240 | function |  | 27 |
| `layerOffsetForLock` | 3244 | function |  | 8 |
| `layerRootOffsetFactor` | 3249 | function |  | 12 |
| `layerOffsetWeight` | 3253 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3259 | function |  | 5 |
| `pointsWithLayerOffset` | 3268 | function |  | 3 |
| `layerDirectionForLock` | 3276 | function |  | 2 |
| `applyLayerOffset` | 3287 | function |  | 5 |
| `setLockHairLayer` | 3311 | function |  | 2 |
| `setGroupLayerOffset` | 3326 | function |  | 2 |
| `quadraticWeights` | 3354 | function |  | 1 |
| `setHeadReferenceTransparency` | 3365 | function |  | 4 |
| `trianglePlaneIntersections` | 3377 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3398 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3607 | function |  | 1 |
| `upperContourCurve` | 3624 | function |  | 2 |
| `hermitePoint` | 3659 | function |  | 2 |
| `curveNetworkSection` | 3670 | function |  | 1 |
| `pointAlongSection` | 3699 | function |  | 1 |
| `longestStitchedContour` | 3705 | function |  | 2 |
| `nodeForPoint` | 3713 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3770 | function |  | 1 |
| `exitSetupEditors` | 3790 | function |  | 6 |
| `syncAppMenuVisibility` | 3800 | function |  | 3 |
| `closeAppMenus` | 3806 | function |  | 6 |
| `setAppMenuOpen` | 3817 | function |  | 2 |
| `setTurntableActive` | 3824 | function |  | 3 |
| `selectedReferenceImage` | 3834 | function |  | 20 |
| `normalizeReferenceCrop` | 3840 | function |  | 8 |
| `referenceCropIsFull` | 3848 | function |  | 3 |
| `referencePlaneFrontAxis` | 3853 | function |  | 4 |
| `referencePlanePlacement` | 3862 | function |  | 4 |
| `migratedReferencePlanePosition` | 3877 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3897 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3914 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3930 | function |  | 2 |
| `snappedReferenceImageView` | 3953 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3959 | function |  | 5 |
| `applyReferenceImageRuntime` | 3975 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4018 | function |  | 6 |
| `createReferenceImageRuntime` | 4026 | function |  | 3 |
| `addReferenceImage` | 4095 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4147 | function |  | 3 |
| `disposeReferenceImage` | 4166 | function |  | 2 |
| `clearReferenceImages` | 4170 | function |  | 2 |
| `serializeReferenceImage` | 4177 | function |  | 1 |
| `setReferenceImageType` | 4205 | function |  | 2 |
| `attachReferenceImageTransform` | 4249 | function |  | 6 |
| `selectReferenceImage` | 4263 | function |  | 12 |
| `placeReferencePlane` | 4286 | function |  | 2 |
| `setReferencePlaneInFront` | 4297 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4307 | function |  | 4 |
| `renderReferenceImagePanel` | 4326 | function |  | 20 |
| `setOutlinerTab` | 4373 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4391 | function |  | 4 |
| `componentEditModeActive` | 4395 | function |  | 30 |
| `selectionToolSupportsPicking` | 4399 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4404 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4420 | function |  | 2 |
| `setViewportSelectionMode` | 4450 | function |  | 4 |
| `setViewportEditMode` | 4462 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4504 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4518 | function |  | 8 |
| `normalizeOutlinerName` | 4532 | function |  | 3 |
| `beginOutlinerRename` | 4537 | function |  | 2 |
| `finish` | 4548 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4578 | function |  | 6 |
| `referenceOutlinerGroup` | 4590 | function |  | 2 |
| `renderReferenceOutliner` | 4594 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4711 | function |  | 5 |
| `readReferenceImageFile` | 4716 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4740 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4747 | function |  | 3 |
| `dragContainsReferenceImage` | 4792 | function |  | 3 |
| `setReferenceImageDragActive` | 4803 | function |  | 9 |
| `referenceDropDestination` | 4811 | function |  | 2 |
| `viewportOverlayDropPosition` | 4817 | function |  | 2 |
| `setReferenceDropHover` | 4826 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4844 | function |  | 2 |
| `referenceOverlayAtPointer` | 4864 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4882 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4895 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4941 | function |  | 1 |
| `finishReferenceOverlayDrag` | 4991 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5013 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5024 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5050 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5059 | function |  | 2 |
| `referenceCropCursor` | 5074 | function |  | 3 |
| `updateReferenceCropHandles` | 5080 | function |  | 5 |
| `referenceCropSourcePoint` | 5101 | function |  | 2 |
| `beginReferenceCrop` | 5108 | function |  | 1 |
| `updateReferenceCrop` | 5146 | function |  | 1 |
| `finishReferenceCrop` | 5178 | function |  | 4 |
| `setHeadSetupEditing` | 5196 | function |  | 6 |
| `strandPassesDisplayFilters` | 5222 | function |  | 4 |
| `strandVisibleForDisplay` | 5231 | function |  | 14 |
| `strandAvailableForViewportInteraction` | 5236 | function |  | 3 |
| `lockedStrandsExist` | 5240 | function |  | 3 |
| `hiddenStrandsExist` | 5244 | function |  | 2 |
| `hideSelectedStrands` | 5248 | function |  | 2 |
| `unhideHiddenStrands` | 5258 | function |  | 2 |
| `strandIsolationActive` | 5267 | function |  | 7 |
| `setStrandIsolation` | 5271 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5283 | function |  | 3 |
| `syncVisibilityParent` | 5294 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5301 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5330 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5337 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5360 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5533 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5554 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5573 | function |  | 2 |
| `selectedViewportFocusBounds` | 5671 | function |  | 2 |
| `frameViewportBounds` | 5685 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5715 | function |  | 2 |
| `fullSceneFocusBounds` | 5719 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5734 | function |  | 3 |
| `cycleViewportFraming` | 5743 | function |  | 2 |
| `sculptBrushToolActive` | 5763 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 5767 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5771 | function |  | 3 |
| `effectiveSculptBrushTool` | 5775 | function |  | 15 |
| `updateSculptScaleModeRow` | 5781 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5786 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5808 | function |  | 5 |
| `setActiveTool` | 5817 | function |  | 13 |
| `setDrawStrandMode` | 5955 | function |  | 2 |
| `setObjectSpaceEditing` | 5965 | function |  | 7 |
| `setHierarchyEditing` | 5981 | function |  | 4 |
| `setProportionalEditing` | 5993 | function |  | 5 |
| `beginProportionalSizeEdit` | 6012 | function |  | 3 |
| `updateProportionalSizeEdit` | 6024 | function |  | 2 |
| `endProportionalSizeEdit` | 6035 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6042 | function |  | 2 |
| `refreshProportionalPreview` | 6050 | function |  | 4 |
| `activeBrushSizeInput` | 6060 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6069 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6081 | function |  | 2 |
| `beginBrushSizeDrag` | 6099 | function |  | 1 |
| `updateBrushSizeDrag` | 6126 | function |  | 1 |
| `finishBrushSizeDrag` | 6147 | function |  | 2 |
| `updateInteractionLocks` | 6164 | function |  | 70 |
| `configureTransformControls` | 6175 | function |  | 13 |
| `pullMoveActive` | 6183 | function |  | 9 |
| `updatePullGuideVisual` | 6187 | function |  | 4 |
| `attachTransformForCurvePoint` | 6203 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6227 | function |  | 6 |
| `strandObjectRootIndex` | 6243 | function |  | 3 |
| `strandObjectRoot` | 6252 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6256 | function |  | 2 |
| `attachStrandObjectTransform` | 6261 | function |  | 6 |
| `guideObjectPivot` | 6284 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6295 | function |  | 2 |
| `attachGuideObjectTransform` | 6300 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6319 | function |  | 2 |
| `beginGuideObjectTransform` | 6347 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6354 | function |  | 2 |
| `updateGuideObjectTransform` | 6376 | function |  | 2 |
| `finishGuideObjectTransform` | 6409 | function |  | 2 |
| `clonePlacementFrame` | 6418 | function |  | 2 |
| `cloneOptionalVectors` | 6430 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6434 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6451 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6466 | function |  | 2 |
| `strandObjectTransformOperators` | 6482 | function |  | 4 |
| `transformPoint` | 6490 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6497 | arrow |  | 0 |
| `transformNormal` | 6503 | arrow |  | 10 |
| `transformDirection` | 6513 | arrow |  | 5 |
| `worldMatrixForPivot` | 6525 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6531 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6547 | function |  | 6 |
| `beginStrandObjectTransform` | 6573 | function |  | 2 |
| `updateStrandObjectTransform` | 6611 | function |  | 2 |
| `commitStrandObjectTransform` | 6669 | function |  | 2 |
| `mapPoints` | 6682 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6716 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6730 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6753 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6766 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6781 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6807 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6856 | function |  | 2 |
| `beginHandleEdit` | 6865 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6918 | function |  | 3 |
| `multiPointHandleEditActive` | 6929 | function |  | 7 |
| `applyMultiMove` | 6933 | function |  | 5 |
| `applyMultiRotate` | 6939 | function |  | 2 |
| `applyMultiScale` | 6948 | function |  | 2 |
| `applyHierarchicalMove` | 6957 | function |  | 3 |
| `applySingleMove` | 6969 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6973 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6990 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6999 | function |  | 3 |
| `changed` | 7009 | arrow |  | 1 |
| `applyPullMove` | 7051 | function |  | 3 |
| `pullHeadCollisionContext` | 7059 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7078 | function |  | 2 |
| `applyProportionalMove` | 7101 | function |  | 3 |
| `viewPlaneNormal` | 7112 | function |  | 12 |
| `isCameraInSnappedView` | 7116 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7124 | function |  | 9 |
| `updateViewPlaneGrid` | 7128 | function |  | 14 |
| `setViewPlaneMove` | 7185 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7196 | function |  | 2 |
| `rayFromViewportEvent` | 7204 | function |  | 14 |
| `worldUnitsPerViewportPixel` | 7212 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7222 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7233 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7246 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7265 | function |  | 4 |
| `beginViewPlaneMove` | 7272 | function |  | 3 |
| `updateViewPlaneMove` | 7336 | function |  | 1 |
| `endViewPlaneMove` | 7401 | function |  | 7 |
| `applyHierarchicalRotate` | 7420 | function |  | 2 |
| `rotateGuideNormal` | 7427 | arrow |  | 4 |
| `applySingleRotate` | 7465 | function |  | 2 |
| `applyProportionalRotate` | 7469 | function |  | 2 |
| `applyHierarchicalScale` | 7489 | function |  | 2 |
| `applySingleScale` | 7499 | function |  | 2 |
| `applyProportionalScale` | 7503 | function |  | 2 |
| `setPointScale` | 7519 | function |  | 8 |
| `proportionalWeight` | 7528 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7540 | function |  | 5 |
| `strandInfluenceColor` | 7546 | function |  | 12 |
| `beginRelaxEdit` | 7571 | function |  | 3 |
| `updateRelaxEdit` | 7600 | function |  | 1 |
| `endRelaxEdit` | 7660 | function |  | 1 |
| `disposeGuide` | 7670 | function |  | 3 |
| `removeGuideObjects` | 7698 | function |  | 3 |
| `strandRadiusAt` | 7712 | function |  | 5 |
| `strandProfileTopologyAt` | 7729 | function |  | 5 |
| `strandCurveParameters` | 7771 | function |  | 3 |
| `widthProfileAt` | 7781 | arrow |  | 1 |
| `braidFrameAt` | 7819 | function |  | 5 |
| `braidFrameAtExtended` | 7829 | function |  | 2 |
| `createBraidProfileProjector` | 7838 | function |  | 2 |
| `project` | 7854 | arrow |  | 21 |
| `createBraidGeometry` | 7869 | function |  | 2 |
| `deformationAt` | 7904 | function |  | 3 |
| `widthFor` | 7913 | arrow |  | 3 |
| `depthFor` | 7917 | arrow |  | 3 |
| `outputVertex` | 7949 | function |  | 7 |
| `appendAuthoredCap` | 8057 | function |  | 3 |
| `outputCapVertex` | 8064 | arrow |  | 6 |
| `capBoundary` | 8155 | function |  | 3 |
| `strandGeometryCurve` | 8217 | function |  | 13 |
| `strandGeometryFrameAt` | 8243 | function |  | 14 |
| `transportedStrandFrameAt` | 8306 | function |  | 6 |
| `twistOverrideAt` | 8309 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 8337 | function |  | 2 |
| `weldPanelGeometryData` | 8373 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 8419 | function |  | 3 |
| `surfacePanelPoint` | 8434 | function |  | 3 |
| `splitForkT` | 8457 | function |  | 3 |
| `tipWidthSideForkT` | 8470 | function |  | 7 |
| `tipSegmentWeightAt` | 8481 | function |  | 2 |
| `tipWidthControlTs` | 8500 | function |  | 4 |
| `tipWidthCommonForkT` | 8511 | function |  | 4 |
| `tipWidthResetCurve` | 8519 | function |  | 3 |
| `tipWidthSpreadGap` | 8537 | function |  | 4 |
| `tipWidthMultiplierAt` | 8554 | function |  | 8 |
| `tipPanelWidthAt` | 8593 | function |  | 7 |
| `buildTipWidthCurve` | 8599 | function |  | 5 |
| `addPoint` | 8609 | arrow |  | 3 |
| `setTipWidthCurveValue` | 8640 | function |  | 4 |
| `tipPanelFrameAt` | 8659 | function |  | 4 |
| `tipMainSectionPoint` | 8693 | function |  | 4 |
| `tipSurfaceFrameAt` | 8741 | function |  | 3 |
| `tipChainFrameAt` | 8772 | function |  | 4 |
| `tipWidthEdgePosition` | 8803 | function |  | 4 |
| `tipWidthEdgePoints` | 8834 | function |  | 2 |
| `tipWidthControlPlacement` | 8849 | function |  | 3 |
| `tipHighlightMaterial` | 8865 | function |  | 2 |
| `updateTipHighlight` | 8887 | function |  | 4 |
| `splitTipForSegment` | 8944 | function |  | 9 |
| `createPanelStrandGeometry` | 8987 | function |  | 2 |
| `segmentWeightAt` | 9018 | arrow |  | 1 |
| `addQuad` | 9034 | arrow |  | 6 |
| `near` | 9038 | arrow |  | 6 |
| `panelWidthAt` | 9068 | arrow |  | 6 |
| `panelThicknessAt` | 9073 | arrow |  | 6 |
| `panelFrameAt` | 9082 | arrow |  | 1 |
| `rawPanelPoint` | 9100 | arrow |  | 1 |
| `panelPoint` | 9134 | arrow |  | 3 |
| `addPatch` | 9142 | arrow |  | 1 |
| `uStart` | 9273 | arrow |  | 1 |
| `uEnd` | 9276 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 9315 | function |  | 3 |
| `inside` | 9316 | arrow |  | 2 |
| `pushOrientedTriangle` | 9338 | function |  | 7 |
| `triangulatePolygon3D` | 9349 | function |  | 1 |
| `orientedQuadFace` | 9399 | function |  | 2 |
| `createSplitStrandGeometry` | 9407 | function |  | 2 |
| `fusedIndexAt` | 9564 | arrow |  | 0 |
| `createHairCardGeometry` | 9613 | function |  | 2 |
| `createPolyGeometry` | 9712 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 9739 | function |  | 4 |
| `createCompoundStrandGeometry` | 9822 | function |  | 2 |
| `proceduralBranchGeometryLock` | 10073 | function |  | 2 |
| `createHairGeometry` | 10118 | function |  | 5 |
| `createBaseHairGeometry` | 10170 | function |  | 3 |
| `hairMaterialDefinition` | 10255 | function |  | 4 |
| `materialForLock` | 10259 | function |  | 8 |
| `activeHairMaterialDefinition` | 10263 | function |  | 11 |
| `strandDisplayColor` | 10269 | function |  | 14 |
| `setAnimeHairBaseColor` | 10287 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 10300 | function |  | 2 |
| `createHairMaterial` | 10340 | function |  | 5 |
| `createStrandSelectionOutline` | 10382 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 10417 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 10426 | function |  | 6 |
| `refreshMaterialUsers` | 10453 | function |  | 6 |
| `renderHairMaterialOutliner` | 10462 | function |  | 5 |
| `renderHairMaterialOptions` | 10492 | function |  | 3 |
| `syncHairMaterialEditor` | 10502 | function |  | 9 |
| `createProjectHairMaterial` | 10528 | function |  | 3 |
| `deleteActiveHairMaterial` | 10548 | function |  | 2 |
| `createHairTopologyGeometry` | 10566 | function |  | 4 |
| `createHairTopologyOverlay` | 10587 | function |  | 3 |
| `groupDefaultsFor` | 10634 | function |  | 9 |
| `creationToolActive` | 10641 | function |  | 7 |
| `activeCreationShapeDefaults` | 10645 | function |  | 9 |
| `activeStrandShapeTarget` | 10651 | function |  | 8 |
| `curvePolylineLength` | 10655 | function |  | 2 |
| `curvePolylineLengths` | 10663 | function |  | 3 |
| `samplePolylineDistance` | 10671 | function |  | 2 |
| `applyProjectedCurveLength` | 10681 | function |  | 4 |
| `clearRegionLengthBaseline` | 10712 | function |  | 2 |
| `ensureRegionLengthBaseline` | 10719 | function |  | 2 |
| `setGroupLengthScale` | 10727 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 10765 | function |  | 4 |
| `requestGroupDefaultsWarning` | 10797 | function |  | 1 |
| `activeProfileOffset` | 10809 | function |  | 3 |
| `profileToCanvas` | 10817 | function |  | 1 |
| `renderProfilePreview` | 10824 | function |  | 7 |
| `renderHairCardCoveragePath` | 10843 | function |  | 2 |
| `activeTaperTarget` | 10858 | function |  | 20 |
| `activeTaperCurve` | 10913 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 10924 | function |  | 7 |
| `taperSamples` | 10934 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 10941 | function |  | 2 |
| `renderTaperPreview` | 10963 | function |  | 17 |
| `shapeTargetForSelect` | 11002 | function |  | 3 |
| `setupShapePresetControls` | 11012 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 11037 | function |  | 3 |
| `syncShapePresetSelects` | 11043 | function |  | 6 |
| `populateShapePresetSelects` | 11064 | function |  | 5 |
| `openSaveShapePreset` | 11092 | function |  | 2 |
| `commitCustomShapePreset` | 11117 | function |  | 2 |
| `openRemoveShapePreset` | 11140 | function |  | 2 |
| `commitRemoveShapePreset` | 11153 | function |  | 2 |
| `taperPointToCanvas` | 11169 | function |  | 4 |
| `canvasToTaperPoint` | 11186 | function |  | 2 |
| `clearTaperMeshPoints` | 11222 | function |  | 2 |
| `taperMeshPointFrame` | 11232 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 11245 | function |  | 4 |
| `updateTaperMeshPoints` | 11282 | function |  | 5 |
| `setTaperMeshPointsVisible` | 11361 | function |  | 6 |
| `renderTaperCurveEditor` | 11379 | function |  | 13 |
| `tipSideForkFor` | 11392 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 11471 | function |  | 4 |
| `retargetOpenTaperCurveEditor` | 11485 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 11501 | function |  | 2 |
| `scheduleTaperCurveEdit` | 11533 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 11542 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 11553 | function |  | 2 |
| `applyTaperCurveEdit` | 11561 | function |  | 10 |
| `openTaperCurveEditor` | 11687 | function |  | 3 |
| `openPanelSegmentCurveEditor` | 11732 | function |  | 3 |
| `closeTaperCurveEditor` | 11768 | function |  | 4 |
| `updateViewportStatsVisibility` | 11781 | function |  | 5 |
| `canvasToProfile` | 11800 | function |  | 2 |
| `retargetFloatingStrandEditors` | 11814 | function |  | 2 |
| `addLock` | 11829 | function |  | 17 |
| `mirroredVector` | 12041 | function |  | 12 |
| `mirroredPlacementFrame` | 12045 | function |  | 2 |
| `mirrorPartnerFor` | 12058 | function |  | 40 |
| `decoupleMirrorPartner` | 12062 | function |  | 2 |
| `createMirrorPartner` | 12070 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 12166 | function |  | 6 |
| `mirroredClumpPartners` | 12171 | function |  | 6 |
| `createMirroredClump` | 12177 | function |  | 3 |
| `decoupleMirroredClump` | 12199 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 12219 | function |  | 6 |
| `syncActiveMirror` | 12386 | function |  | 30 |
| `setMirrorXEditing` | 12398 | function |  | 5 |
| `snapshotState` | 12422 | function |  | 7 |
| `rootAttachmentFrame` | 12683 | function |  | 3 |
| `rootAttachmentLocalFrame` | 12695 | function |  | 4 |
| `resolveRootAttachment` | 12713 | function |  | 4 |
| `curvePointsToRootLocal` | 12753 | function |  | 2 |
| `curvePointsFromRootLocal` | 12765 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 12773 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 12789 | function |  | 2 |
| `createRootAttachment` | 12820 | function |  | 7 |
| `syncRootAttachmentMetadata` | 12850 | function |  | 3 |
| `rootAttachmentToData` | 12877 | function |  | 2 |
| `rootAttachmentFromData` | 12905 | function |  | 3 |
| `importHeadMeshFile` | 12947 | function |  | 3 |
| `importFullBodyMeshFile` | 12970 | function |  | 3 |
| `downloadPreferencesAndPresets` | 12995 | function |  | 1 |
| `importedBooleanPreference` | 13028 | function |  | 11 |
| `loadPreferencesAndPresets` | 13042 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 13112 | function |  | 1 |
| `openHairProjectFile` | 13156 | function |  | 4 |
| `dragContainsApplicationFile` | 13214 | function |  | 3 |
| `safelyRememberRecentProject` | 13223 | function |  | 2 |
| `renderRecentProjectsMenu` | 13232 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 13264 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 13289 | function |  | 2 |
| `confirmDroppedApplicationFile` | 13293 | function |  | 2 |
| `pushUndoState` | 13309 | function |  | 105 |
| `undoLastAction` | 13316 | function |  | 2 |
| `redoLastAction` | 13333 | function |  | 2 |
| `updateHistoryButtons` | 13350 | function |  | 12 |
| `resetTransientInteractionsForStateRestore` | 13355 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 13375 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 13382 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 13421 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 13447 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 13479 | function |  | 2 |
| `finalizeStateRestore` | 13520 | function |  | 2 |
| `restoreState` | 13527 | function |  | 5 |
| `disposeAllEditableObjects` | 13551 | function |  | 2 |
| `restoreLock` | 13572 | function |  | 4 |
| `restoreGuide` | 13796 | function |  | 2 |
| `vectorToData` | 13857 | function |  | 25 |
| `dataToVector` | 13861 | function |  | 22 |
| `frameToData` | 13865 | function |  | 2 |
| `frameFromData` | 13877 | function |  | 2 |
| `applyPresetSelection` | 13889 | function |  | 2 |
| `drawPresetThumbnail` | 13920 | function |  | 1 |
| `fillHair` | 13935 | arrow |  | 9 |
| `strand` | 13947 | arrow |  | 31 |
| `bun` | 13965 | arrow |  | 2 |
| `braid` | 14000 | arrow |  | 2 |
| `renderPresetLibrary` | 14089 | function |  | 3 |
| `setPresetLibraryOpen` | 14148 | function |  | 6 |
| `average` | 14161 | function |  | 4 |
| `fitPointAttributes` | 14165 | function |  | 9 |
| `rebuildCurveObjects` | 14194 | function |  | 9 |
| `createCurvePoints` | 14206 | function |  | 2 |
| `addGeneratedBangPreset` | 14215 | function |  | 1 |
| `createLongLayeredCurlPoints` | 14309 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 14358 | function |  | 1 |
| `columns` | 14359 | arrow |  | 1 |
| `layer` | 14363 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 14577 | function |  | 2 |
| `addBraidedBobPreset` | 14613 | function |  | 1 |
| `evenColumns` | 14614 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 14830 | function |  | 1 |
| `scalpSeed` | 14853 | arrow |  | 1 |
| `createBowlCutPoints` | 15140 | function |  | 2 |
| `addBowlCutPreset` | 15178 | function |  | 1 |
| `selectedCurveLatticeGuide` | 15246 | function |  | 11 |
| `braidStrokeActive` | 15253 | function |  | 8 |
| `proceduralDrawActive` | 15257 | function |  | 3 |
| `panelStrokeActive` | 15261 | function |  | 5 |
| `activeStrokeSurfaceInput` | 15265 | function |  | 4 |
| `activeStrokeSurfaceValue` | 15269 | function |  | 19 |
| `normalizedLiveSurfaceSelection` | 15273 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 15279 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 15283 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 15287 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 15291 | function |  | 3 |
| `liveSurfaceStrandId` | 15301 | function |  | 4 |
| `liveSurfaceStrand` | 15305 | function |  | 3 |
| `liveSurfaceGuideId` | 15310 | function |  | 3 |
| `guideSupportsLiveSurface` | 15314 | function |  | 2 |
| `liveSurfaceGuide` | 15321 | function |  | 3 |
| `refreshLiveSurfaceOptions` | 15328 | function |  | 10 |
| `activeStrokeBrushSize` | 15369 | function |  | 10 |
| `activeStrokeBrushDepth` | 15375 | function |  | 5 |
| `strokeSurfaceIsContextual` | 15381 | function |  | 3 |
| `contextualPlaneAtOrigin` | 15389 | function |  | 4 |
| `drawSurfaceHitFromEvent` | 15399 | function |  | 8 |
| `worldNormalAtHit` | 15438 | function |  | 5 |
| `selectedPolyMesh` | 15446 | function |  | 10 |
| `addPolyLock` | 15451 | function |  | 2 |
| `ensurePolyMesh` | 15470 | function |  | 3 |
| `polySurfaceSample` | 15474 | function |  | 4 |
| `polyTargetAtEvent` | 15485 | function |  | 6 |
| `refreshPolyMesh` | 15511 | function |  | 10 |
| `ensurePolyFillPreview` | 15520 | function |  | 2 |
| `clearPolyFillPreview` | 15557 | function |  | 17 |
| `polyFillCandidateForEvent` | 15562 | function |  | 3 |
| `showPolyFillPreview` | 15582 | function |  | 2 |
| `updatePolyFillPreview` | 15608 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 15633 | function |  | 5 |
| `fillPolyGap` | 15643 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 15654 | function |  | 2 |
| `projectPolyRelaxPoint` | 15674 | function |  | 2 |
| `removePolyPointAttributes` | 15718 | function |  | 3 |
| `deletePolyComponent` | 15727 | function |  | 2 |
| `addPolyPoint` | 15750 | function |  | 4 |
| `appendPolyStrokeRow` | 15759 | function |  | 4 |
| `beginPolyBrushPointer` | 15779 | function |  | 1 |
| `finishPolyAltDelete` | 15865 | function |  | 1 |
| `updatePolyBrushStroke` | 15879 | function |  | 1 |
| `finishPolyBrushStroke` | 15969 | function |  | 4 |
| `drawSampleFromHit` | 16007 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 16021 | function |  | 3 |
| `strokeLength` | 16058 | function |  | 8 |
| `resampleDrawStroke` | 16064 | function |  | 2 |
| `processedDrawStroke` | 16096 | function |  | 6 |
| `strokeSurfaceNormals` | 16125 | function |  | 6 |
| `drawClumpFrame` | 16136 | function |  | 4 |
| `nearestCurveParameter` | 16145 | function |  | 2 |
| `drawClumpSampleNormal` | 16159 | function |  | 5 |
| `drawClumpTemplateVector` | 16168 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 16174 | function |  | 3 |
| `drawClumpStrandMaps` | 16190 | function |  | 4 |
| `nextClumpName` | 16245 | function |  | 6 |
| `initializeClumpShape` | 16252 | function |  | 5 |
| `stableClumpVariation` | 16263 | function |  | 3 |
| `createClumpFromLocks` | 16275 | function |  | 7 |
| `addLockToClump` | 16300 | function |  | 4 |
| `pointerToNdc` | 16356 | function |  | 1 |
| `gridProfileSkipCol` | 16372 | function |  | 3 |
| `clumpDirectMembers` | 16396 | function |  | 3 |
| `clumpMembersForGuide` | 16401 | function |  | 6 |
| `clumpGuideForLock` | 16405 | function |  | 13 |
| `proceduralGuideForLock` | 16410 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 16417 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 16424 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 16431 | function |  | 3 |
| `proceduralBranchWorldPoints` | 16443 | function |  | 2 |
| `applyProceduralBranchSettings` | 16456 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 16495 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 16511 | function |  | 3 |
| `createProceduralAccessoryLock` | 16525 | function |  | 2 |
| `applyProceduralAccessorySettings` | 16577 | function |  | 2 |
| `clumpFrameAt` | 16628 | function |  | 5 |
| `commitClumpMemberRestState` | 16636 | function |  | 10 |
| `updateClumpMembers` | 16719 | function |  | 10 |
| `dissolveClump` | 16823 | function |  | 6 |
| `detachLockFromClump` | 16860 | function |  | 4 |
| `updateDrawVolumePreview` | 16886 | function |  | 5 |
| `hideDrawClumpPreviews` | 16910 | function |  | 5 |
| `resetDrawVolumePreview` | 16916 | function |  | 3 |
| `updateDrawStrandPreview` | 16922 | function |  | 23 |
| `continueFromTipEnabled` | 17143 | function |  | 2 |
| `selectedTipContinuationLock` | 17149 | function |  | 3 |
| `beginDrawStrandStroke` | 17164 | function |  | 2 |
| `beginDrawFreePlane` | 17293 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 17307 | function |  | 2 |
| `updateDrawStrandStroke` | 17332 | function |  | 1 |
| `createDrawnLock` | 17378 | function |  | 3 |
| `setting` | 17382 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 17450 | function |  | 4 |
| `createDrawnBraid` | 17458 | function |  | 2 |
| `createDrawnStrand` | 17515 | function |  | 2 |
| `createDrawnPanel` | 17642 | function |  | 2 |
| `extendDrawnStrand` | 17694 | function |  | 2 |
| `finishDrawStrandStroke` | 17727 | function |  | 6 |
| `createPlacedStrand` | 17754 | function |  | 2 |
| `placedPointCount` | 17818 | function |  | 3 |
| `createPlacedPoints` | 17822 | function |  | 3 |
| `pushPointOutsideHead` | 17841 | function |  | 8 |
| `resizePlacedStrand` | 17873 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 17890 | function |  | 5 |
| `beginPlaceEdit` | 17895 | function |  | 2 |
| `updatePlaceEdit` | 17913 | function |  | 1 |
| `updatePlacementLength` | 17927 | function |  | 3 |
| `updatePlacementOrientation` | 17937 | function |  | 3 |
| `endPlaceEdit` | 17955 | function |  | 1 |
| `confirmPendingPlacedStrand` | 17970 | function |  | 1 |
| `pendingPlacedLock` | 17980 | function |  | 2 |
| `beginPlacementPointer` | 17984 | function |  | 3 |
| `finishPlacementPointer` | 17994 | function |  | 2 |
| `confirmPlacementStep` | 18018 | function |  | 2 |
| `finishPlacementFlow` | 18041 | function |  | 6 |
| `updatePlacementStatus` | 18054 | function |  | 57 |
| `deselectStrands` | 18193 | function |  | 11 |
| `beginSelectionMarquee` | 18208 | function |  | 3 |
| `beginAltOrbit` | 18232 | function |  | 1 |
| `beginBlenderNavigation` | 18244 | function |  | 1 |
| `endBlenderNavigation` | 18289 | function |  | 1 |
| `prepareSelectPointerCapture` | 18297 | function |  | 1 |
| `endSelectPointerCapture` | 18303 | function |  | 1 |
| `applyAltClickCandidate` | 18309 | function |  | 2 |
| `finishBrushAltClick` | 18335 | function |  | 1 |
| `endAltOrbit` | 18348 | function |  | 2 |
| `dollyCameraByDrag` | 18355 | function |  | 2 |
| `fastDragMagnitude` | 18378 | function |  | 2 |
| `beginHoudiniZoomDrag` | 18384 | function |  | 1 |
| `updateHoudiniZoomDrag` | 18392 | function |  | 1 |
| `endHoudiniZoomDrag` | 18409 | function |  | 1 |
| `updateSelectionMarquee` | 18417 | function |  | 1 |
| `pointInsideSelectionMarquee` | 18434 | function |  | 3 |
| `selectPointsInMarquee` | 18442 | function |  | 2 |
| `pointKey` | 18468 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 18499 | function |  | 2 |
| `objectInsideSelectionMarquee` | 18536 | function |  | 3 |
| `projectedPoint` | 18553 | arrow |  | 1 |
| `selectObjectsInMarquee` | 18582 | function |  | 2 |
| `finishSelectionMarquee` | 18627 | function |  | 2 |
| `headMeshes` | 18650 | function |  | 7 |
| `strandSplitProfileData` | 18658 | function |  | 4 |
| `strandSplitControlPoint` | 18671 | function |  | 4 |
| `panelSplitControlPoint` | 18707 | function |  | 8 |
| `strandControlPointRaycast` | 18764 | function |  | 1 |
| `strandControlPointFrame` | 18799 | function |  | 4 |
| `strandControlPointHitFromEvent` | 18831 | function |  | 4 |
| `createCurveObjects` | 18889 | function |  | 4 |
| `polyEdgeKey` | 19151 | function |  | 2 |
| `polyMeshEdges` | 19155 | function |  | 2 |
| `populatePolyEditObjects` | 19169 | function |  | 3 |
| `createPolyEditObjects` | 19233 | function |  | 2 |
| `rebuildPolyEditObjects` | 19241 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 19255 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 19262 | function |  | 2 |
| `strandWidthEdgeSample` | 19271 | function |  | 3 |
| `strandWidthEdgePoints` | 19294 | function |  | 2 |
| `sculptBrushDebugRaycast` | 19308 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 19312 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 19319 | function |  | 3 |
| `refreshSculptBrushDebugView` | 19331 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 19336 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 19342 | function |  | 3 |
| `updateCurveObjects` | 19356 | function |  | 41 |
| `syncTipNormalArrow` | 19598 | arrow |  | 4 |
| `createCurveNormalIndicator` | 19811 | function |  | 3 |
| `pointUpDirection` | 19837 | function |  | 2 |
| `curveFrameAtPoint` | 19841 | function |  | 4 |
| `curveFrameAt` | 19862 | function |  | 4 |
| `strandTwistAt` | 19882 | function |  | 6 |
| `controlPointRotationAt` | 19887 | function |  | 4 |
| `strandProfileTwistAt` | 19891 | function |  | 2 |
| `strandFrameAt` | 19897 | function |  | 2 |
| `curveFrameAtSnapshot` | 19903 | function |  | 3 |
| `outwardNormalAtPoint` | 19922 | function |  | 11 |
| `sampledSurfaceNormal` | 19934 | function |  | 2 |
| `guidedNormalAt` | 19950 | function |  | 6 |
| `twistFromHandle` | 19969 | function |  | 3 |
| `signedAngleAroundAxis` | 19990 | function |  | 6 |
| `handleColor` | 19997 | function |  | 2 |
| `isAffectedCurvePoint` | 20020 | function |  | 2 |
| `syncLockFromCurve` | 20026 | function |  | 24 |
| `labelForPreset` | 20056 | function |  | 1 |
| `rebuildLockGeometry` | 20060 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 20087 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 20095 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 20101 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 20123 | function |  | 8 |
| `updateLockGeometry` | 20136 | function |  | 59 |
| `setGroupColorView` | 20157 | function |  | 2 |
| `createUvCheckerTexture` | 20167 | function |  | 3 |
| `ensureUvCheckerForLock` | 20203 | function |  | 4 |
| `removeUvCheckerFromLock` | 20236 | function |  | 3 |
| `invalidateUvInspector` | 20251 | function |  | 7 |
| `uvInspectorRecord` | 20255 | function |  | 1 |
| `uvInspectorRecords` | 20294 | function |  | 2 |
| `drawUvInspectorGrid` | 20298 | function |  | 2 |
| `renderUvInspector` | 20332 | function |  | 3 |
| `setUvCheckerEnabled` | 20391 | function |  | 3 |
| `strandViewportBaseColor` | 20408 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 20443 | function |  | 3 |
| `syncStrandSelectionOutline` | 20449 | function |  | 2 |
| `applyLockedStrandPalette` | 20460 | function |  | 2 |
| `syncLockedStrandWireVisual` | 20469 | function |  | 6 |
| `setStrandSelectionVisual` | 20478 | function |  | 5 |
| `proceduralParentOutlineVisible` | 20494 | function |  | 2 |
| `syncProceduralParentVisibility` | 20501 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 20510 | function |  | 2 |
| `updateStrandSelectionHighlight` | 20514 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 20518 | function |  | 2 |
| `resetGuideSelectionVisuals` | 20531 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 20551 | function |  | 3 |
| `selectLock` | 20584 | function |  | 44 |
| `deselectStrandsForGuideEditor` | 20646 | function |  | 2 |
| `syncGroupInputs` | 20657 | function |  | 2 |
| `topologyStatsForLock` | 20690 | function |  | 4 |
| `formatTopologyStats` | 20698 | function |  | 5 |
| `updateTopologyStats` | 20702 | function |  | 24 |
| `normalizeBraidDimensions` | 20736 | function |  | 3 |
| `normalizeStrandDimensions` | 20749 | function |  | 3 |
| `strandBaseWidth` | 20763 | function |  | 5 |
| `strandWidthDimension` | 20767 | function |  | 5 |
| `strandDepthDimension` | 20775 | function |  | 8 |
| `setStrandWidthDimension` | 20783 | function |  | 2 |
| `setStrandDepthDimension` | 20805 | function |  | 4 |
| `syncShapeDimensionInputs` | 20821 | function |  | 4 |
| `syncCreationShapeInputs` | 20857 | function |  | 3 |
| `syncViewportDrawSettings` | 20895 | function |  | 4 |
| `selectedPanelSegment` | 20909 | function |  | 6 |
| `syncPanelSegmentControls` | 20915 | function |  | 11 |
| `syncPanelShapeInputs` | 20933 | function |  | 6 |
| `syncStrandSplitInputs` | 20960 | function |  | 4 |
| `syncHairCardControls` | 20969 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 20977 | function |  | 3 |
| `updateAttributeEditorMode` | 21016 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 21166 | function |  | 2 |
| `curveLatticeForGroup` | 21189 | function |  | 2 |
| `filterCurveLatticesToGroup` | 21207 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 21252 | function |  | 2 |
| `showCurveLatticeForGroup` | 21269 | function |  | 2 |
| `selectStrandGroup` | 21306 | function |  | 3 |
| `selectCurvePoint` | 21348 | function |  | 10 |
| `updateSelectedPointLabel` | 21362 | function |  | 12 |
| `syncInputs` | 21375 | function |  | 15 |
| `syncClumpGuidePanel` | 21421 | function |  | 3 |
| `getSelectedLock` | 21448 | function |  | 108 |
| `selectedLocksInOrder` | 21452 | function |  | 37 |
| `lockStrands` | 21458 | function |  | 3 |
| `lockSelectedStrands` | 21491 | function |  | 3 |
| `unlockStrands` | 21497 | function |  | 3 |
| `unlockAllStrands` | 21512 | function |  | 3 |
| `strandEditFamily` | 21516 | function |  | 7 |
| `compatibleSelectedLocks` | 21521 | function |  | 5 |
| `selectedEditRoots` | 21528 | function |  | 2 |
| `editSelectedLocks` | 21541 | function |  | 19 |
| `multiEditValuesEqual` | 21574 | function |  | 2 |
| `setMixedControl` | 21583 | function |  | 28 |
| `syncMultiStrandInputs` | 21600 | function |  | 16 |
| `values` | 21616 | arrow |  | 38 |
| `selectedRebuildableCurves` | 21696 | function |  | 5 |
| `createCompoundStrand` | 21703 | function |  | 1 |
| `refreshRebuildCurveDialog` | 21764 | function |  | 8 |
| `openRebuildCurveDialog` | 21777 | function |  | 1 |
| `rebuildSelectedCurves` | 21791 | function |  | 2 |
| `selectionCanBecomeClump` | 21830 | function |  | 4 |
| `createClumpFromSelection` | 21835 | function |  | 3 |
| `cleanSelectionSets` | 21847 | function |  | 2 |
| `createSelectionSetFromSelection` | 21852 | function |  | 3 |
| `selectionSetById` | 21863 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 21867 | function |  | 7 |
| `editSelectionSetFromSelection` | 21876 | function |  | 5 |
| `deleteSelectionSet` | 21896 | function |  | 2 |
| `selectSelectionSet` | 21905 | function |  | 2 |
| `deleteSelectedStrands` | 21915 | function |  | 4 |
| `deleteGuide` | 21923 | function |  | 3 |
| `deleteSelectedGuide` | 21946 | function |  | 3 |
| `deleteSelectedReferenceImage` | 21950 | function |  | 4 |
| `hasDeletableSelection` | 21963 | function |  | 2 |
| `deleteCurrentSelection` | 21971 | function |  | 3 |
| `hideOutlinerContextMenu` | 21979 | function |  | 17 |
| `outlinerLockTargets` | 21984 | function |  | 3 |
| `showOutlinerContextMenu` | 22011 | function |  | 8 |
| `hideStrandRadialMenu` | 22091 | function |  | 4 |
| `ensureRadialButtonCapacity` | 22102 | function |  | 3 |
| `radialButtonDimensions` | 22115 | function |  | 4 |
| `radialMenuDimensionsForKind` | 22124 | function |  | 3 |
| `applyRadialMenuDimensions` | 22141 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 22147 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 22160 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 22181 | function |  | 2 |
| `selectionSetRadialMenuOption` | 22198 | function |  | 4 |
| `selectedMirrorRadialOptions` | 22207 | function |  | 3 |
| `strandVisibilityRadialOptions` | 22229 | function |  | 5 |
| `clumpMirrorRadialOptions` | 22247 | function |  | 2 |
| `contextualRadialOptions` | 22254 | function |  | 3 |
| `sharedRadialFrameDimensions` | 22383 | function |  | 3 |
| `layoutContextualRadialOptions` | 22387 | function |  | 4 |
| `renderRadialActionList` | 22411 | function |  | 3 |
| `radialListOptionAtPointer` | 22429 | function |  | 3 |
| `syncRadialListHighlight` | 22451 | function |  | 3 |
| `configureContextualRadialMenu` | 22457 | function |  | 3 |
| `beginStrandRadialGesture` | 22517 | function |  | 2 |
| `enterStrandRadialSubmenu` | 22551 | function |  | 2 |
| `updateStrandRadialGesture` | 22597 | function |  | 1 |
| `performStrandRadialAction` | 22636 | function |  | 2 |
| `finishStrandRadialGesture` | 22739 | function |  | 2 |
| `cancelStrandRadialGesture` | 22749 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 22756 | function |  | 1 |
| `setPullMoveEnabled` | 22762 | function |  | 3 |
| `toolRadialOptions` | 22770 | function |  | 2 |
| `hideToolRadialMenu` | 22795 | function |  | 4 |
| `beginToolRadialGesture` | 22808 | function |  | 2 |
| `beginToolShortcutPress` | 22848 | function |  | 2 |
| `finishToolShortcutPress` | 22863 | function |  | 2 |
| `cancelToolShortcutPress` | 22872 | function |  | 5 |
| `setRadialMenusEnabled` | 22880 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 22893 | function |  | 5 |
| `setNavigationTipsEnabled` | 22908 | function |  | 5 |
| `configureNavigationMouseButtons` | 22915 | function |  | 3 |
| `syncNavigationModifierLocks` | 22928 | function |  | 7 |
| `setNavigationStyle` | 22933 | function |  | 5 |
| `applyCameraSmoothingPreference` | 22949 | function |  | 4 |
| `setCameraSmoothingEnabled` | 22964 | function |  | 5 |
| `setCameraSmoothingStrength` | 22970 | function |  | 5 |
| `setScaleSensitivity` | 22978 | function |  | 3 |
| `setToolTipsEnabled` | 22986 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 22993 | function |  | 5 |
| `setViewportStatisticsEnabled` | 23002 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 23010 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 23025 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 23034 | function |  | 5 |
| `sideNamingDisplayId` | 23043 | function |  | 3 |
| `referenceViewDisplayLabel` | 23055 | function |  | 6 |
| `strandRegionDisplayLabel` | 23065 | function |  | 8 |
| `updateSideNamingLabels` | 23083 | function |  | 2 |
| `setSideNamingPerspective` | 23110 | function |  | 5 |
| `setControlPointDisplaySize` | 23119 | function |  | 6 |
| `scaleHexColor` | 23131 | function |  | 3 |
| `setViewportBackgroundColor` | 23136 | function |  | 7 |
| `setDefaultHairShader` | 23158 | function |  | 5 |
| `setPreferenceCategory` | 23164 | function |  | 4 |
| `openPreferencesDialog` | 23191 | function |  | 1 |
| `savePreferencesDialog` | 23219 | function |  | 1 |
| `cancelPreferencesDialog` | 23243 | function |  | 3 |
| `updateToolRadialGesture` | 23272 | function |  | 1 |
| `performToolRadialAction` | 23301 | function |  | 2 |
| `finishToolRadialGesture` | 23311 | function |  | 2 |
| `cancelToolRadialGesture` | 23320 | function |  | 5 |
| `duplicatePlacementTarget` | 23327 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 23354 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 23358 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 23368 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 23373 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 23385 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 23396 | function |  | 7 |
| `openProceduralDuplicateDialog` | 23404 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 23421 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 23442 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 23453 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 23459 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 23465 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 23498 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 23653 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 23755 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 23796 | function |  | 2 |
| `updateDuplicatePlacement` | 23823 | function |  | 2 |
| `beginDuplicatePlacement` | 23887 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 23951 | function |  | 2 |
| `confirmDuplicatePlacement` | 23992 | function |  | 1 |
| `cancelDuplicatePlacement` | 24029 | function |  | 4 |
| `outlinerClumpLocks` | 24055 | function |  | 11 |
| `handleOutlinerClumpDrop` | 24059 | function |  | 3 |
| `createOutlinerStrandButton` | 24082 | function |  | 4 |
| `createOutlinerCurveSurface` | 24168 | function |  | 2 |
| `createOutlinerClump` | 24264 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 24346 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 24353 | function |  | 2 |
| `renderLockList` | 24432 | function |  | 63 |
| `updateCount` | 24586 | function |  | 27 |
| `captureInputUndo` | 24595 | function |  | 1 |
| `bindUndoCapture` | 24601 | function |  | 37 |
| `bindLockInput` | 24612 | function |  | 2 |
| `applyValue` | 24629 | arrow |  | 2 |
| `applyUniformTransformScale` | 24948 | function |  | 2 |
| `applyReducedTransformScale` | 24965 | function |  | 2 |
| `applyTransformPrecision` | 25004 | function |  | 2 |
| `updateTransformScalePointer` | 25033 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 25354 | function |  | 3 |
| `finishTaperCurveDrag` | 25418 | function |  | 1 |
| `beginTaperMeshPointDrag` | 25461 | function |  | 1 |
| `updateTaperMeshPointDrag` | 25542 | function |  | 1 |
| `finishTaperMeshPointDrag` | 25597 | function |  | 6 |
| `updateSelectedTaperPoint` | 25621 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 26222 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 26227 | function |  | 4 |
| `syncDrawCurlControls` | 26282 | function |  | 5 |
| `handleLiveSurfaceChange` | 26330 | function |  | 1 |
| `changePanelSplitCount` | 26479 | function |  | 3 |
| `applyPresetControl` | 26629 | function |  | 2 |
| `applyCreationToolSettings` | 26650 | function |  | 2 |
| `populateCreationPresetSelect` | 26694 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 26718 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 26751 | function |  | 5 |
| `createCustomCreationPreset` | 26759 | function |  | 3 |
| `createCustomClumpPreset` | 26774 | function |  | 3 |
| `commitCustomCreationPreset` | 26789 | function |  | 2 |
| `openRemoveCreationPreset` | 26850 | function |  | 3 |
| `commitRemoveCreationPreset` | 26863 | function |  | 1 |
| `applyBraidToolPreset` | 26880 | function |  | 2 |
| `selectedBranchChildLock` | 26992 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 26996 | function |  | 2 |
| `initPanelResizeHandles` | 27102 | function |  | 2 |
| `applyWidth` | 27108 | arrow |  | 2 |
| `restoreWidth` | 27115 | arrow |  | 2 |
| `bindResize` | 27123 | arrow |  | 2 |
| `onMove` | 27132 | arrow |  | 0 |
| `onUp` | 27136 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 27153 | function |  | 2 |
| `initFloatingPanelControls` | 27162 | function |  | 2 |
| `detach` | 27171 | arrow |  | 28 |
| `endDrag` | 27209 | arrow |  | 0 |
| `endResize` | 27241 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 27252 | function |  | 3 |
| `selectPatchNotesVersion` | 27386 | function |  | 3 |
| `requestReferenceImage` | 27419 | function |  | 5 |
| `toggleCapsuleGuideTool` | 27623 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 27629 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 27636 | function |  | 1 |
| `deleteLocks` | 28203 | function |  | 10 |
| `disposeCurveObjects` | 28281 | function |  | 4 |
| `beginTipSubBoneRotate` | 28367 | function |  | 2 |
| `applyTipSubBoneTransform` | 28397 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 28429 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 28554 | function |  | 1 |
| `endPanelSplitHandleDrag` | 28775 | function |  | 3 |
| `resize` | 28808 | function |  | 3 |
| `handleViewportPointerMove` | 28819 | function |  | 1 |
| `blockProportionalSizingEvent` | 28830 | function |  | 1 |
| `updateLightAngleFromInputs` | 28836 | function |  | 2 |
| `startViewSnap` | 28850 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 28880 | function |  | 3 |
| `trackViewportPointerDown` | 28897 | function |  | 1 |
| `trackViewportPointerMove` | 28913 | function |  | 1 |
| `clearViewportPointer` | 28921 | function |  | 1 |
| `updateViewSnap` | 28926 | function |  | 1 |
| `nearestCardinalAxis` | 28962 | function |  | 5 |
| `cardinalAxisKey` | 28976 | function |  | 5 |
| `steppedDragAmount` | 28980 | function |  | 3 |
| `snapCameraToCardinalAxis` | 28986 | function |  | 4 |
| `endViewSnap` | 29002 | function |  | 4 |
| `activateStrandControlPoint` | 29012 | function |  | 4 |
| `refreshStrandControlPointSelection` | 29062 | function |  | 4 |
| `addStrandControlPointSelection` | 29089 | function |  | 3 |
| `removeStrandControlPointSelection` | 29106 | function |  | 3 |
| `sampleStrandPointNormal` | 29120 | function |  | 2 |
| `sampleStrandPointVectors` | 29130 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 29136 | function |  | 2 |
| `resampleStrandCurveData` | 29147 | function |  | 4 |
| `resampleMatchingVectors` | 29153 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 29192 | function |  | 4 |
| `removeStrandCurvePoint` | 29203 | function |  | 2 |
| `closestStrandCurveParameter` | 29216 | function |  | 2 |
| `insertStrandCurvePoint` | 29245 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 29262 | function |  | 2 |
| `selectionModifierCursorAvailable` | 29272 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 29288 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 29295 | function |  | 4 |
| `prepareCurvePointSelection` | 29317 | function |  | 1 |
| `finishCurvePointInsertion` | 29428 | function |  | 1 |
| `finishPointRemoval` | 29443 | function |  | 1 |
| `editableStrandWidth` | 29461 | function |  | 6 |
| `editableStrandWidthBounds` | 29473 | function |  | 2 |
| `applyEditableStrandWidth` | 29479 | function |  | 3 |
| `viewportPixelPoint` | 29515 | function |  | 5 |
| `syncSculptBrushControls` | 29523 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 29538 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 29546 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 29554 | function |  | 1 |
| `sculptBrushPlaneOffset` | 29560 | function |  | 5 |
| `setSculptBrushCursorVisible` | 29564 | function |  | 6 |
| `updateSculptBrushCursor` | 29571 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 29593 | function |  | 4 |
| `sculptBrushEditableLock` | 29600 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 29610 | function |  | 5 |
| `sculptBrushLockViable` | 29616 | function |  | 5 |
| `sculptBrushUnits` | 29627 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 29665 | function |  | 4 |
| `sculptBrushPointWeight` | 29715 | function |  | 6 |
| `sculptBrushWorldDelta` | 29725 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 29734 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 29760 | function |  | 2 |
| `beginSculptMoveStroke` | 29818 | function |  | 1 |
| `isHairCreateTool` | 29880 | function |  | 4 |
| `syncStrandHoverOutline` | 29884 | function |  | 1 |
| `pointerOverTaperEditor` | 29897 | function |  | 3 |
| `updateStrandBrushHover` | 29904 | function |  | 1 |
| `updatePanelTipHover` | 29925 | function |  | 1 |
| `applySubBoneBrushSample` | 29955 | function |  | 2 |
| `applySculptMoveStrokeSample` | 30100 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 30338 | function |  | 3 |
| `updateSculptMoveStroke` | 30347 | function |  | 1 |
| `finishSculptMoveStroke` | 30363 | function |  | 3 |
| `strandControlPointHit` | 30411 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 30415 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 30493 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 30527 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 30567 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 30580 | function |  | 1 |
| `setHoveredControlPoint` | 30619 | function |  | 7 |
| `visibleControlPointHoverTargets` | 30632 | function |  | 2 |
| `updateControlPointHover` | 30668 | function |  | 1 |
| `animate` | 31283 | function |  | 2 |
| `syncCompactSidebarLayout` | 31314 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 31333 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 31339 | function |  | 3 |
| `setAttributeEditorTab` | 31345 | function |  | 6 |

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

## modules/core/hair-store.js（30 行）

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

## modules/data/loc-ja.js（688 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/data/loc-zh.js（675 行）

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

## modules/geometry/bone-model.js（349 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `defaultSplitSpread` | 11 | function | export | 3 |
| `normalizeSplitBones` | 17 | function | export | 6 |
| `srcCurve` | 27 | arrow |  | 4 |
| `cloneSplitBones` | 59 | function | export | 2 |
| `splitBonesFor` | 67 | function | export | 3 |
| `materializeSplitBones` | 83 | function | export | 1 |
| `bonesFor` | 101 | function | export | 1 |
| `splitBonesToData` | 172 | function | export | 1 |
| `splitBonesFromData` | 200 | function | export | 1 |
| `mirrorSplitBones` | 205 | function | export | 1 |
| `normalizeBone` | 230 | function | export | 6 |
| `curve` | 233 | arrow |  | 4 |
| `pick` | 237 | arrow |  | 6 |
| `normalizeBones` | 269 | function | export | 2 |
| `bonesToData` | 276 | function | export | 2 |
| `bonesFromData` | 307 | function | export | 1 |
| `mirrorBones` | 313 | function | export | 1 |
| `registryForSave` | 333 | function | export | 1 |

## modules/geometry/branch-bridge.js（999 行）

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
| `applyBranchRootRegionCarving` | 767 | function |  | 1 |
| `branchRootRegionSurface` | 843 | function |  | 6 |
| `toGridCol` | 868 | arrow |  | 5 |
| `toRow` | 872 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 924 | function |  | 2 |
| `branchRootRegionWorldPoints` | 944 | function |  | 1 |
| `pointAt` | 950 | arrow |  | 5 |
| `applyBranchRootOffset` | 975 | function |  | 1 |

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

## modules/geometry/branch-hierarchy.js（119 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchHierarchyApi` | 6 | function | export | 2 |
| `attachDrawnLocksAsBranches` | 12 | function |  | 1 |
| `branchChildrenFor` | 33 | function |  | 2 |
| `detachBranch` | 37 | function |  | 1 |
| `updateBranchChildren` | 48 | function |  | 3 |
| `canBranchDrawFromLock` | 91 | function |  | 3 |
| `selectedDrawBranchPoint` | 98 | function |  | 1 |

## modules/geometry/branch-region-panel.js（782 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clampRegionParam` | 15 | function | export | 103 |
| `createBranchRegionApi` | 19 | function | export | 2 |
| `syncBranchRootRegionOffsets` | 27 | function |  | 6 |
| `updateBranchRootRegionCenter` | 52 | function |  | 1 |
| `branchRootRegionFromParam` | 95 | function |  | 1 |
| `cloneBranchRootRegion` | 118 | function |  | 1 |
| `flip` | 120 | arrow |  | 5 |
| `normalizeBranchRootRegion` | 146 | function |  | 7 |
| `setBranchRootRegionPoint` | 168 | function |  | 2 |
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
| `endBranchRegionCanvasDrag` | 693 | function |  | 1 |
| `beginBranchSweepStartDrag` | 699 | function |  | 1 |
| `updateBranchSweepStartDrag` | 716 | function |  | 1 |
| `endBranchSweepStartDrag` | 740 | function |  | 1 |
| `updateBranchRegionMeshPoints` | 746 | function |  | 4 |

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

## modules/geometry/branch-sweep.js（403 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchSweepApi` | 6 | function | export | 2 |
| `activeSweepProfile` | 14 | function |  | 3 |
| `activeSweepProfileTarget` | 21 | function |  | 3 |
| `trimmedSweepProfile` | 28 | function |  | 2 |
| `roundedLeft` | 37 | arrow |  | 1 |
| `roundedRight` | 43 | arrow |  | 1 |
| `mirroredSweepProfileIndex` | 60 | function |  | 1 |
| `createSmoothSweepProfileCurve` | 77 | function |  | 5 |
| `sampleSweepProfile` | 86 | function |  | 4 |
| `createSweepProfileTopology` | 107 | function |  | 1 |
| `twistCurveEditing` | 149 | function |  | 1 |
| `proceduralBranchLengthCurveEditing` | 153 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 157 | function |  | 2 |
| `proceduralBranchCurveEditing` | 161 | function |  | 1 |
| `renderTwistCurvePreview` | 165 | function |  | 1 |
| `twistMeshPointDistancePerDegree` | 183 | function |  | 2 |
| `twistMeshGraphAxis` | 191 | function |  | 2 |
| `addTwistMeshCurvePath` | 195 | function |  | 1 |
| `appendSegment` | 216 | arrow |  | 1 |
| `appendFill` | 219 | arrow |  | 1 |
| `appendSignedSection` | 225 | arrow |  | 3 |
| `renderSweepProfileEditor` | 274 | function |  | 3 |
| `applySweepProfileEdit` | 317 | function |  | 1 |
| `openSweepProfileEditor` | 344 | function |  | 1 |
| `closeSweepProfileEditor` | 379 | function |  | 1 |
| `finishSweepProfileDrag` | 388 | function |  | 1 |

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

## modules/geometry/curve-math.js（1172 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 46 |
| `lerp` | 5 | function |  | 37 |
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
| `sampleTaperCurve` | 122 | function | export | 16 |
| `remapEnvelopeCurveRange` | 146 | function | export | 1 |
| `interpolationAt` | 158 | arrow |  | 2 |
| `twistRateUnitsFromDegrees` | 192 | function | export | 1 |
| `twistRateDegreesFromUnits` | 196 | function | export | 1 |
| `sampleIntegratedEnvelopeCurve` | 200 | function | export | 1 |
| `sampleAsymmetricTaperCurve` | 228 | function | export | 1 |
| `profileTopologyCenterWeight` | 250 | function | export | 1 |
| `uniformCurveParameters` | 260 | function | export | 2 |
| `eightWayScreenDelta` | 264 | function | export | 1 |
| `symmetricClosedCurveParameters` | 279 | function | export | 1 |
| `wrap` | 285 | arrow |  | 4 |
| `curveRebuildParameters` | 299 | function | export | 1 |
| `pointDistance` | 325 | function |  | 4 |
| `interpolatePoint` | 333 | function |  | 2 |
| `resamplePolylinePointData` | 341 | function | export | 8 |
| `polylineMidpointPointData` | 382 | function | export | 3 |
| `blendRelativePolylinePointData` | 386 | function | export | 1 |
| `normalizedPointData` | 403 | function |  | 17 |
| `blendDirectionPointData` | 412 | function | export | 1 |
| `rotatePointDataBetweenNormals` | 423 | function |  | 5 |
| `tangentDirectionPointData` | 463 | function |  | 3 |
| `rotatePointDataAroundAxis` | 477 | function |  | 3 |
| `blendSurfaceOrientedPolylinePointData` | 495 | function | export | 1 |
| `proximityCurveBlendAmount` | 566 | function | export | 2 |
| `evenlySpacedInteriorAmounts` | 573 | function | export | 1 |
| `surfaceArcBlendAmount` | 581 | function | export | 1 |
| `direction` | 583 | arrow |  | 3 |
| `surfaceArcPolylinePointData` | 611 | function | export | 1 |
| `relative` | 619 | arrow |  | 2 |
| `horizontalCircleThroughPointData` | 686 | function | export | 2 |
| `horizontalCirclePointData` | 729 | function | export | 2 |
| `rootCorrectionFalloff` | 740 | function | export | 1 |
| `cylindricalArcPointData` | 749 | function | export | 2 |
| `truncatePolylinePointDataAtY` | 756 | function |  | 3 |
| `lowestSharedHorizontalPolylinePointData` | 801 | function | export | 2 |
| `minimumY` | 805 | arrow |  | 2 |
| `blendCylindricalPolylinePointData` | 823 | function | export | 1 |
| `blendSampleArrays` | 845 | function | export | 1 |
| `blendTaperCurves` | 861 | function | export | 1 |
| `blendEnvelopeCurves` | 878 | function | export | 1 |
| `curvePointRemovalPlan` | 895 | function | export | 1 |
| `curvePointInsertionPlan` | 924 | function | export | 1 |
| `adaptiveCurveParameters` | 945 | function | export | 1 |
| `sampleProfile` | 968 | arrow |  | 3 |
| `weightedParameter` | 1041 | arrow |  | 1 |
| `twistCurveDensityDetail` | 1076 | function | export | 1 |
| `twistCurveDisplayRange` | 1104 | function | export | 1 |
| `twistCurveHandleDistancePerDegree` | 1113 | function | export | 1 |
| `sampleArray` | 1119 | function | export | 3 |
| `sampleScale` | 1128 | function | export | 1 |
| `upperProfileArcIndices` | 1137 | function | export | 1 |
| `cyclicPath` | 1155 | arrow |  | 2 |
| `averageHeight` | 1166 | arrow |  | 2 |

## modules/geometry/curve-surface-create.js（1226 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createCurveSurfaceCreateApi` | 28 | function | export | 2 |
| `curveSurfaceControllerCurves` | 32 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 41 | function |  | 2 |
| `sampledCurveSurfaceControllerCurves` | 88 | function |  | 3 |
| `sampledCurveSurfaceControllerSides` | 96 | function |  | 1 |
| `activeCurveSurfaceControllerIndex` | 112 | function |  | 2 |
| `curveSurfaceControllerPointRange` | 121 | function |  | 1 |
| `curveSurfaceControllerPreviewRows` | 132 | function |  | 3 |
| `curveSurfaceControllerSegments` | 140 | function |  | 1 |
| `curveSurfaceControllerIndexNearPoint` | 150 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 170 | function |  | 1 |
| `surfaceLatticeNormal` | 193 | function |  | 2 |
| `createSurfaceLockFromLattice` | 208 | function |  | 3 |
| `createViewportSurface` | 273 | function |  | 1 |
| `loftSurfaceProfilePoints` | 302 | function |  | 5 |
| `hideLoftSurfacePreviews` | 308 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 315 | function |  | 4 |
| `updateLoftSurfacePreview` | 324 | function |  | 5 |
| `resetLoftSurfaceDraft` | 356 | function |  | 2 |
| `cancelLoftSurfaceDraft` | 372 | function |  | 1 |
| `cloneCurveSurfaceSource` | 390 | function |  | 3 |
| `curveSurfaceSourceForSnapshot` | 412 | function |  | 1 |
| `mirroredCurveSurfaceSource` | 438 | function |  | 1 |
| `curveSurfaceProfilePoints` | 448 | function |  | 3 |
| `curveSurfaceProfileNormals` | 452 | function |  | 2 |
| `curveSurfacePreviewLock` | 461 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 484 | function |  | 2 |
| `hideCurveSurfacePreview` | 500 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 512 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 517 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 526 | function |  | 3 |
| `curveSurfaceSideVector` | 564 | function |  | 4 |
| `curveSurfaceDraftCurves` | 577 | function |  | 2 |
| `curveSurfaceFallbackHit` | 585 | function |  | 3 |
| `updateCurveSurfaceDraftUi` | 598 | function |  | 5 |
| `updateCurveSurfacePreview` | 618 | function |  | 4 |
| `resetCurveSurfaceDraft` | 680 | function |  | 2 |
| `cancelCurveSurfaceDraft` | 702 | function |  | 1 |
| `beginCurveSurfaceStroke` | 717 | function |  | 1 |
| `curveSurfaceStrokeEvent` | 765 | function |  | 3 |
| `updateCurveSurfaceStroke` | 800 | function |  | 1 |
| `finishCurveSurfaceStroke` | 832 | function |  | 2 |
| `confirmCurveSurfaceDraft` | 890 | function |  | 2 |
| `commitCurveSurfaceDraft` | 967 | function |  | 1 |
| `loftSurfaceSampleFromHit` | 972 | function |  | 6 |
| `beginLoftSurfaceStroke` | 981 | function |  | 1 |
| `beginLoftSurfaceFreePlane` | 1015 | function |  | 2 |
| `updateLoftSurfaceStroke` | 1026 | function |  | 1 |
| `finishLoftSurfaceStroke` | 1056 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 1113 | function |  | 1 |
| `resampleSurfaceLock` | 1128 | function |  | 1 |

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

## modules/geometry/guide-system.js（2912 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createGuideSystemApi` | 9 | function | export | 2 |
| `guideHeadBounds` | 14 | function |  | 1 |
| `setCapsuleGuideEditing` | 24 | function |  | 1 |
| `outlinerGuides` | 52 | function |  | 2 |
| `guideOutlinerLabel` | 59 | function |  | 2 |
| `renderGuideOutliner` | 69 | function |  | 3 |
| `currentGuideViewMode` | 127 | function |  | 3 |
| `updateGuideViewToggle` | 135 | function |  | 3 |
| `setGuideViewMode` | 151 | function |  | 2 |
| `cycleGuideViewMode` | 162 | function |  | 1 |
| `hideGuideViewContextMenu` | 167 | function |  | 1 |
| `showGuideViewContextMenu` | 171 | function |  | 1 |
| `applyCapsuleGuideDisplayVisibility` | 184 | function |  | 5 |
| `applyOtherGuideDisplayVisibility` | 207 | function |  | 1 |
| `applyCurveLatticeGuideDisplayVisibility` | 215 | function |  | 2 |
| `defaultCurveLatticePoints` | 222 | function |  | 2 |
| `flatCurveLatticePoints` | 248 | function |  | 2 |
| `createCurveLatticeGuideSet` | 257 | function |  | 1 |
| `curveLatticeControlPoint` | 272 | function |  | 9 |
| `circularArcTangent` | 276 | function |  | 4 |
| `arcLengthTo` | 307 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 319 | function |  | 3 |
| `sampleHermiteCurve` | 358 | function |  | 10 |
| `sampleCurveLattice` | 375 | function |  | 6 |
| `curveLatticeNormal` | 394 | function |  | 1 |
| `createCurveLatticeGeometry` | 405 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 434 | function |  | 3 |
| `appendCurve` | 436 | arrow |  | 4 |
| `sample` | 438 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 465 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 481 | function |  | 3 |
| `addPicker` | 483 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 522 | function |  | 2 |
| `curveLatticeHasRootExtension` | 535 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 539 | function |  | 2 |
| `curveLatticeEditablePoint` | 557 | function |  | 11 |
| `curveLatticePointSection` | 564 | function |  | 3 |
| `curveLatticeRestPoint` | 575 | function |  | 7 |
| `editingCurveLatticeDeformation` | 581 | function |  | 5 |
| `curveLatticeRootColumns` | 587 | function |  | 3 |
| `curveTangentsForPoints` | 594 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 606 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 643 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 669 | function |  | 2 |
| `resampleCurveLatticeGuide` | 686 | function |  | 1 |
| `resampleGrid` | 696 | arrow |  | 2 |
| `controlPointIsSelected` | 723 | function |  | 2 |
| `clearMultiPointSelection` | 731 | function |  | 2 |
| `createCurveLatticeHandles` | 735 | function |  | 3 |
| `addCurveLattice` | 757 | function |  | 2 |
| `updateCurveLatticeGeometry` | 866 | function |  | 7 |
| `mirroredCurveLatticePointIndex` | 897 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 903 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 942 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 963 | function |  | 2 |
| `refreshCurveLatticeLoopHover` | 980 | function |  | 3 |
| `setCurveLatticeLoopHover` | 989 | function |  | 3 |
| `updateCurveLatticeLoopHover` | 996 | function |  | 1 |
| `selectCurveLatticeLoop` | 1015 | function |  | 1 |
| `selectCurveLatticePoint` | 1044 | function |  | 1 |
| `updateCurveLatticeFromHandle` | 1059 | function |  | 1 |
| `beginCurveLatticeMultiEdit` | 1101 | function |  | 1 |
| `applyCurveLatticeMultiTransform` | 1122 | function |  | 1 |
| `curveLatticeColumnPoints` | 1165 | function |  | 1 |
| `groupCurveControlIndices` | 1174 | function |  | 3 |
| `groupCurveControlPoints` | 1180 | function |  | 2 |
| `updateGroupCurveDisplay` | 1186 | function |  | 3 |
| `ensureGroupCurveDisplay` | 1196 | function |  | 1 |
| `groupCurveDeformationPairs` | 1216 | function |  | 1 |
| `curveLatticeDeformationPairs` | 1223 | function |  | 1 |
| `appendPairs` | 1225 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 1236 | function |  | 1 |
| `capsuleGuideCapHeight` | 1255 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 1259 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 1264 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 1268 | function |  | 1 |
| `capsuleGuideDrawPoints` | 1280 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 1296 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 1302 | function |  | 1 |
| `updateCapsuleGuideDrawStroke` | 1328 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 1358 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 1412 | function |  | 1 |
| `createCapsuleGuideGeometry` | 1433 | function |  | 7 |
| `vertex` | 1447 | function |  | 3 |
| `addFace` | 1453 | function |  | 3 |
| `addRing` | 1471 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 1526 | function |  | 3 |
| `retopologizeCapsuleGuide` | 1536 | function |  | 1 |
| `resizeCapsuleGuideCylinder` | 1601 | function |  | 1 |
| `capsuleControlDataFromGeometry` | 1647 | function |  | 7 |
| `capsuleControlGeometryFromData` | 1660 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 1681 | function |  | 3 |
| `capsuleGuidePointDistances` | 1686 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 1707 | function |  | 4 |
| `capsuleGuideLoopCenter` | 1727 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 1732 | function |  | 6 |
| `normalizeCapsuleGuideName` | 1738 | function |  | 2 |
| `capsuleGuideAccentColor` | 1743 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 1748 | function |  | 3 |
| `updateCapsuleGuideLoopLines` | 1759 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 1771 | function |  | 2 |
| `createCapsuleGuideHandles` | 1803 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 1826 | function |  | 2 |
| `syncCapsuleGuideHandles` | 1845 | function |  | 4 |
| `capsuleGuideMirrorMap` | 1852 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 1868 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 1885 | function |  | 5 |
| `updateCapsuleGuideFromHandle` | 1900 | function |  | 1 |
| `beginCapsuleGuideHandleEdit` | 1937 | function |  | 1 |
| `selectCapsuleGuidePoint` | 1953 | function |  | 1 |
| `capsuleGuideLoopTransformGuide` | 1970 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 1976 | function |  | 2 |
| `selectCapsuleGuideLoop` | 2003 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 2015 | function |  | 1 |
| `updateCapsuleGuideLoopTransform` | 2034 | function |  | 1 |
| `refreshCapsuleGuideFillInfluence` | 2079 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 2114 | function |  | 4 |
| `setCapsuleGuideLoopHover` | 2128 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 2134 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 2151 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 2162 | function |  | 1 |
| `updateCapsuleGuideLoopDrag` | 2173 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 2203 | function |  | 1 |
| `createSubdividedQuadGeometry` | 2213 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 2254 | function |  | 3 |
| `createQuadCageGeometry` | 2270 | function |  | 3 |
| `updateCapsuleGuideGeometry` | 2294 | function |  | 7 |
| `createCapsuleGuideMaterial` | 2347 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 2385 | function |  | 3 |
| `updateCapsuleGuideFresnelMaterial` | 2395 | function |  | 2 |
| `addCapsuleGuide` | 2403 | function |  | 2 |
| `addGuide` | 2472 | function |  | 1 |
| `createGuideGeometry` | 2533 | function |  | 3 |
| `selectGuide` | 2588 | function |  | 8 |
| `updateGuideControlsVisibility` | 2656 | function |  | 2 |
| `updateViewportToolVisibility` | 2673 | function |  | 2 |
| `getSelectedGuide` | 2712 | function |  | 7 |
| `syncGuideInputs` | 2716 | function |  | 2 |
| `updateGuideGeometry` | 2759 | function |  | 1 |

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

## modules/geometry/strand-sweep.js（100 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandSweepApi` | 7 | function | export | 1 |
| `sweepSide` | 10 | function |  | 1 |

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

## modules/io/project-files.js（566 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProjectSaveApi` | 13 | function | export | 2 |
| `downloadTextFile` | 64 | function |  | 4 |
| `downloadProjectFile` | 76 | function |  | 2 |
| `bufferAttributeTuples` | 80 | function |  | 6 |
| `setProjectSaveButtonsDisabled` | 87 | function |  | 5 |
| `buildHairProjectFile` | 93 | function |  | 4 |
| `buildHairObj` | 109 | function |  | 3 |
| `buildHairUsda` | 159 | function |  | 3 |
| `openFileActionDialog` | 269 | function |  | 5 |
| `performFileAction` | 314 | function |  | 2 |
| `saveHairProjectFile` | 382 | function |  | 2 |
| `saveHairProjectQuickly` | 411 | function |  | 1 |
| `exportHairObj` | 438 | function |  | 1 |
| `exportHairUsda` | 442 | function |  | 1 |
| `exportHairProjectQuickly` | 446 | function |  | 1 |
| `writeExportThroughFileSystem` | 498 | function |  | 3 |

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

## modules/io/usda-export.js（246 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `finiteNumber` | 1 | function |  | 4 |
| `formatNumber` | 6 | function |  | 9 |
| `quoteString` | 12 | function |  | 4 |
| `usdIdentifier` | 19 | function | export | 5 |
| `uniqueIdentifier` | 29 | function |  | 5 |
| `tuple` | 41 | function |  | 1 |
| `tupleArray` | 45 | function |  | 7 |
| `numberArray` | 49 | function |  | 4 |
| `metadataLines` | 53 | function |  | 3 |
| `primvarLines` | 60 | function |  | 4 |
| `meshBlock` | 72 | function |  | 2 |
| `curveBlock` | 125 | function |  | 2 |
| `quatTuple` | 143 | function |  | 2 |
| `pointTuple` | 147 | function |  | 2 |
| `skeletonBlock` | 153 | function |  | 2 |
| `childrenOf` | 159 | arrow |  | 1 |
| `jointBlock` | 160 | arrow |  | 2 |
| `exportAnimeHairUsda` | 183 | function | export | 1 |

## modules/material/material-state.js（49 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeHairMaterialDefinition` | 22 | function | export | 2 |
| `resolveHairMaterialDefinition` | 34 | function | export | 2 |
| `hairMaterialUsageCounts` | 40 | function | export | 1 |

## modules/scalp/scalp-builder.js（3269 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createScalpBuilderApi` | 10 | function | export | 2 |
| `createAuthoredScalpGeometry` | 14 | function |  | 1 |
| `buildDefaultScalpRegionAssignments` | 67 | function |  | 2 |
| `updateScalpRenderGeometry` | 89 | function |  | 3 |
| `writeScalpRegionColors` | 140 | function |  | 4 |
| `applyDefaultScalpRegionAssignments` | 153 | function |  | 1 |
| `createScalpSelectionOutline` | 161 | function |  | 4 |
| `activeScalpSurfaceMesh` | 202 | function |  | 11 |
| `activeScalpSurfaceWire` | 207 | function |  | 2 |
| `activeScalpSelectionOutline` | 212 | function |  | 2 |
| `inferredCustomScalpRegion` | 217 | function |  | 2 |
| `writeCustomScalpRegionColors` | 224 | function |  | 5 |
| `customScalpGeometryFromObject` | 243 | function |  | 2 |
| `customScalpWireGeometry` | 275 | function |  | 3 |
| `installCustomScalpGeometry` | 286 | function |  | 3 |
| `installCustomScalpGuide` | 310 | function |  | 2 |
| `setScalpGuideSource` | 328 | function |  | 4 |
| `updateScalpQuadWire` | 344 | function |  | 3 |
| `updateScalpTopology` | 360 | function |  | 2 |
| `fullBodyScalpFocusBounds` | 389 | function |  | 1 |
| `syncScalpRoughScaleInputs` | 403 | function |  | 2 |
| `applyScalpRoughScale` | 412 | function |  | 3 |
| `realignFullBodyGuideToScalpTop` | 426 | function |  | 1 |
| `syncScalpInputs` | 442 | function |  | 2 |
| `syncScalpArtistInputs` | 448 | function |  | 2 |
| `rootScalpOffsetDistance` | 456 | function |  | 2 |
| `applyLockRootScalpOffset` | 461 | function |  | 1 |
| `scalpArtistWeight` | 477 | function |  | 3 |
| `scalpArtistScalesAt` | 481 | function |  | 3 |
| `applyScalpArtistShape` | 491 | function |  | 5 |
| `inverseScalpArtistShape` | 509 | function |  | 2 |
| `updateScalpSurface` | 536 | function |  | 2 |
| `setActiveScalpRegion` | 546 | function |  | 1 |
| `clearScalpRegions` | 558 | function |  | 1 |
| `scalpHitFromEvent` | 575 | function |  | 2 |
| `updateScalpBrushCursor` | 583 | function |  | 3 |
| `paintScalpAt` | 598 | function |  | 3 |
| `beginScalpPaint` | 665 | function |  | 1 |
| `updateScalpPaint` | 674 | function |  | 1 |
| `endScalpPaint` | 683 | function |  | 2 |
| `createScalpLattice` | 690 | function |  | 1 |
| `resetScalpLattice` | 715 | function |  | 1 |
| `updateScalpLatticeObjects` | 727 | function |  | 6 |
| `applyScalpLatticeDeformation` | 741 | function |  | 4 |
| `updateScalpLatticeFromHandle` | 768 | function |  | 2 |
| `selectScalpLatticePoint` | 783 | function |  | 1 |
| `beginScalpLatticeDrag` | 798 | function |  | 1 |
| `updateScalpLatticeDrag` | 816 | function |  | 1 |
| `endScalpLatticeDrag` | 834 | function |  | 2 |
| `disposeScalpBuilderVisuals` | 840 | function |  | 6 |
| `updateScalpBuilderPositionReadout` | 858 | function |  | 2 |
| `scalpBuilderHeadMeshes` | 866 | function |  | 3 |
| `scalpBuilderIntersectionPositions` | 876 | function |  | 2 |
| `rebuildScalpBuilderIntersection` | 888 | function |  | 2 |
| `createScalpBuilderPlaneVisual` | 912 | function |  | 3 |
| `createScalpBuilderPlanes` | 927 | function |  | 2 |
| `updateScalpBuilderStepUi` | 959 | function |  | 3 |
| `parseScalpTopologyTemplate` | 981 | function |  | 1 |
| `loadScalpTopologyTemplate` | 1004 | function |  | 3 |
| `loadScalpBuilderCurveLatticeTemplate` | 1016 | function |  | 3 |
| `scalpBuilderCurveLatticeWorldPoints` | 1028 | function |  | 3 |
| `scalpBuilderCurveLatticeEdges` | 1033 | function |  | 4 |
| `subdivideScalpBuilderCage` | 1045 | function |  | 3 |
| `scalpBuilderSurfaceGeometry` | 1155 | function |  | 2 |
| `writeEditedScalpRegionColors` | 1180 | function |  | 5 |
| `syncEditedScalpSurface` | 1195 | function |  | 4 |
| `ensureEditedScalpSurface` | 1266 | function |  | 2 |
| `updateScalpBuilderCurveLatticeGeometry` | 1296 | function |  | 5 |
| `scalpBuilderLatticeNeighbors` | 1381 | function |  | 2 |
| `scalpBuilderLatticeDistances` | 1394 | function |  | 3 |
| `scalpBuilderProportionalWeight` | 1410 | function |  | 3 |
| `scalpBuilderMirrorMap` | 1420 | function |  | 3 |
| `beginScalpBuilderCurveLatticeEdit` | 1438 | function |  | 1 |
| `commitScalpBuilderCurveLatticeEdit` | 1451 | function |  | 1 |
| `updateScalpBuilderHandleColors` | 1458 | function |  | 5 |
| `selectScalpBuilderCurveLatticePoint` | 1477 | function |  | 3 |
| `updateScalpBuilderCurveLatticeFromHandle` | 1491 | function |  | 1 |
| `scalpBuilderCurveLatticePointHit` | 1532 | function |  | 3 |
| `beginScalpBuilderCurveLatticeSelection` | 1541 | function |  | 2 |
| `prioritizeScalpBuilderPointSelection` | 1554 | function |  | 1 |
| `createScalpBuilderCurveLattice` | 1575 | function |  | 3 |
| `clearScalpBuilderTemplateOverlay` | 1712 | function |  | 2 |
| `scalpTemplateNeighbors` | 1720 | function |  | 2 |
| `smoothScalpVectorField` | 1732 | function |  | 1 |
| `displayScalpBuilderConstructionCurves` | 1746 | function |  | 1 |
| `orderedRange` | 1758 | arrow |  | 3 |
| `clipSegment` | 1781 | arrow |  | 1 |
| `liftedPoint` | 1804 | arrow |  | 5 |
| `boundaryCorner` | 1809 | arrow |  | 4 |
| `surfaceCurveBetween` | 1818 | arrow |  | 1 |
| `addSurfaceConnector` | 1841 | arrow |  | 2 |
| `sideContourAtDepth` | 1909 | arrow |  | 3 |
| `addSurfacePatch` | 1943 | arrow |  | 1 |
| `addCenterBridgePatch` | 2023 | arrow |  | 1 |
| `keepScalpShellOutsideHead` | 2131 | function |  | 2 |
| `rebuildScalpBuilderTemplateOverlay` | 2166 | function |  | 1 |
| `generatedScalpObjContent` | 2256 | function |  | 2 |
| `generateScalpFromBuilder` | 2270 | function |  | 1 |
| `orderedDepthRange` | 2306 | arrow |  | 7 |
| `resetScalpBuilder` | 2435 | function |  | 1 |
| `confirmScalpBuilderPlane` | 2450 | function |  | 1 |
| `beginScalpBuilderInput` | 2464 | function |  | 1 |
| `updateScalpBuilderStroke` | 2466 | function |  | 1 |
| `finishScalpBuilderStroke` | 2468 | function |  | 1 |
| `setScalpBuilderEditing` | 2470 | function |  | 4 |
| `updateScalpEditingVisibility` | 2504 | function |  | 8 |
| `setScalpSetupMenuOpen` | 2598 | function |  | 1 |
| `createScalpGuideOutlinerRow` | 2602 | function |  | 1 |
| `activeToolUsesScalpGuide` | 2637 | function |  | 2 |
| `toolAutoShowsScalpGuide` | 2646 | function |  | 2 |
| `autoShowScalpGuideForActiveTool` | 2656 | function |  | 1 |
| `setScalpGuideVisibility` | 2662 | function |  | 8 |
| `setScalpLatticeEditing` | 2670 | function |  | 3 |
| `setScalpShapeEditing` | 2685 | function |  | 5 |
| `setScalpPaintEditing` | 2703 | function |  | 3 |
| `scalpRegionSurfaceSamples` | 2727 | function |  | 2 |
| `curveLatticePointsForScalpRegion` | 2751 | function |  | 1 |
| `horizontalValue` | 2756 | arrow |  | 1 |
| `blendedSample` | 2767 | arrow |  | 1 |
| `scalpFittedCapsuleSpec` | 2800 | function |  | 2 |
| `createScalpFittedCapsuleGuide` | 2820 | function |  | 1 |
| `mirroredScalpRegion` | 2831 | function |  | 1 |
| `scalpTriangleRegion` | 2840 | function |  | 3 |
| `closestPointOnActiveScalp` | 2853 | function |  | 4 |
| `refreshLoadedRootAttachmentsOnAuthoredScalp` | 2925 | function |  | 2 |
| `remapLegacyPresetToActiveScalp` | 2937 | function |  | 1 |
| `remapPoint` | 2952 | arrow |  | 1 |
| `remapVector` | 2953 | arrow |  | 4 |
| `importScalpGuideMeshFile` | 2981 | function |  | 1 |
| `restoreAuthoredScalpForStateRestore` | 2998 | function |  | 1 |
| `sampleScalpQuad` | 3075 | function |  | 1 |
| `scalpRegionAtHit` | 3099 | function |  | 3 |
| `scalpRegionNearestWorldPoint` | 3111 | function |  | 3 |
| `activeStrokeScalpOffset` | 3118 | function |  | 1 |
| `drawScalpRegionAtEvent` | 3124 | function |  | 1 |

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
