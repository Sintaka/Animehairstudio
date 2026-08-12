# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1806** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（24309 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 279 | function |  | 3 |
| `saveBooleanPreference` | 307 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 311 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 316 | function |  | 2 |
| `normalizeScaleSensitivity` | 321 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 326 | function |  | 2 |
| `normalizeSideNamingPerspective` | 331 | function |  | 2 |
| `normalizeNavigationStyle` | 335 | function |  | 2 |
| `setupEditableSliderControls` | 350 | function |  | 2 |
| `syncNumberFromRange` | 401 | arrow |  | 0 |
| `applyNumberValue` | 408 | arrow |  | 0 |
| `copyCameraPose` | 514 | function |  | 3 |
| `updateCameraProjectionForViewport` | 520 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 533 | function |  | 3 |
| `setOrthographicView` | 539 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 579 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 608 | function |  | 2 |
| `removeRotateFreeAxisRing` | 634 | function |  | 2 |
| `deflateTransformGizmoPickers` | 646 | function |  | 2 |
| `nextStrandName` | 1041 | function |  | 2 |
| `activeDrawClumpTemplate` | 1126 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1131 | function |  | 3 |
| `drawModeCreatesClump` | 1158 | function |  | 1 |
| `isPanelGeometry` | 1302 | function |  | 29 |
| `normalizePanelSplits` | 1306 | function |  | 2 |
| `clonePanelSplits` | 1318 | function |  | 14 |
| `snapPanelSplitHeight` | 1322 | function |  | 3 |
| `createQuadSphereGeometry` | 1357 | function |  | 2 |
| `vertexIndex` | 1371 | function |  | 5 |
| `addEdge` | 1389 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1588 | function |  | 7 |
| `ensureDrawClumpPreviewCount` | 1768 | function |  | 2 |
| `currentStrandSelectionState` | 1830 | function |  | 4 |
| `applyStrandSelectionState` | 1834 | function |  | 5 |
| `clearStrandSelectionState` | 1839 | function |  | 6 |
| `disposeGuideModel` | 2942 | function |  | 3 |
| `syncHeadTransformInputs` | 2953 | function |  | 3 |
| `applyHeadTransform` | 2960 | function |  | 4 |
| `resetHeadTransform` | 2980 | function |  | 2 |
| `installGuideModel` | 2995 | function |  | 5 |
| `loadDefaultGuideModel` | 3071 | function |  | 3 |
| `frameGuideModel` | 3094 | function |  | 2 |
| `normalizeHairLayer` | 3123 | function |  | 26 |
| `layerOffsetForLock` | 3127 | function |  | 8 |
| `layerRootOffsetFactor` | 3132 | function |  | 12 |
| `layerOffsetWeight` | 3136 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3142 | function |  | 5 |
| `pointsWithLayerOffset` | 3151 | function |  | 3 |
| `layerDirectionForLock` | 3159 | function |  | 2 |
| `applyLayerOffset` | 3170 | function |  | 5 |
| `setLockHairLayer` | 3194 | function |  | 2 |
| `setGroupLayerOffset` | 3209 | function |  | 2 |
| `quadraticWeights` | 3237 | function |  | 1 |
| `setHeadReferenceTransparency` | 3248 | function |  | 4 |
| `trianglePlaneIntersections` | 3260 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3281 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3490 | function |  | 1 |
| `upperContourCurve` | 3507 | function |  | 2 |
| `hermitePoint` | 3542 | function |  | 2 |
| `curveNetworkSection` | 3553 | function |  | 1 |
| `pointAlongSection` | 3582 | function |  | 1 |
| `longestStitchedContour` | 3588 | function |  | 2 |
| `nodeForPoint` | 3596 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3653 | function |  | 1 |
| `exitSetupEditors` | 3673 | function |  | 6 |
| `syncAppMenuVisibility` | 3683 | function |  | 3 |
| `closeAppMenus` | 3689 | function |  | 6 |
| `setAppMenuOpen` | 3700 | function |  | 2 |
| `setTurntableActive` | 3707 | function |  | 3 |
| `selectedReferenceImage` | 3717 | function |  | 20 |
| `normalizeReferenceCrop` | 3723 | function |  | 8 |
| `referenceCropIsFull` | 3731 | function |  | 3 |
| `referencePlaneFrontAxis` | 3736 | function |  | 4 |
| `referencePlanePlacement` | 3745 | function |  | 4 |
| `migratedReferencePlanePosition` | 3760 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3780 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3797 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3813 | function |  | 2 |
| `snappedReferenceImageView` | 3836 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3842 | function |  | 5 |
| `applyReferenceImageRuntime` | 3858 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 3901 | function |  | 6 |
| `createReferenceImageRuntime` | 3909 | function |  | 3 |
| `addReferenceImage` | 3978 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4030 | function |  | 3 |
| `disposeReferenceImage` | 4049 | function |  | 2 |
| `clearReferenceImages` | 4053 | function |  | 2 |
| `serializeReferenceImage` | 4060 | function |  | 1 |
| `setReferenceImageType` | 4088 | function |  | 2 |
| `attachReferenceImageTransform` | 4132 | function |  | 6 |
| `selectReferenceImage` | 4146 | function |  | 12 |
| `placeReferencePlane` | 4169 | function |  | 2 |
| `setReferencePlaneInFront` | 4180 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4190 | function |  | 4 |
| `renderReferenceImagePanel` | 4209 | function |  | 20 |
| `setOutlinerTab` | 4256 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4274 | function |  | 4 |
| `componentEditModeActive` | 4278 | function |  | 29 |
| `selectionToolSupportsPicking` | 4282 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4287 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4303 | function |  | 2 |
| `setViewportSelectionMode` | 4333 | function |  | 4 |
| `setViewportEditMode` | 4345 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4387 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4401 | function |  | 8 |
| `normalizeOutlinerName` | 4415 | function |  | 3 |
| `beginOutlinerRename` | 4420 | function |  | 2 |
| `finish` | 4431 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4461 | function |  | 6 |
| `referenceOutlinerGroup` | 4473 | function |  | 2 |
| `renderReferenceOutliner` | 4477 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4594 | function |  | 5 |
| `readReferenceImageFile` | 4599 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4623 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4630 | function |  | 3 |
| `dragContainsReferenceImage` | 4675 | function |  | 3 |
| `setReferenceImageDragActive` | 4686 | function |  | 9 |
| `referenceDropDestination` | 4694 | function |  | 2 |
| `viewportOverlayDropPosition` | 4700 | function |  | 2 |
| `setReferenceDropHover` | 4709 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4727 | function |  | 2 |
| `referenceOverlayAtPointer` | 4747 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4765 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4778 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4824 | function |  | 1 |
| `finishReferenceOverlayDrag` | 4874 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 4896 | function |  | 6 |
| `updateReferenceOverlayCursor` | 4907 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 4933 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 4942 | function |  | 2 |
| `referenceCropCursor` | 4957 | function |  | 3 |
| `updateReferenceCropHandles` | 4963 | function |  | 5 |
| `referenceCropSourcePoint` | 4984 | function |  | 2 |
| `beginReferenceCrop` | 4991 | function |  | 1 |
| `updateReferenceCrop` | 5029 | function |  | 1 |
| `finishReferenceCrop` | 5061 | function |  | 4 |
| `setHeadSetupEditing` | 5079 | function |  | 6 |
| `strandPassesDisplayFilters` | 5105 | function |  | 4 |
| `strandVisibleForDisplay` | 5114 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 5119 | function |  | 3 |
| `lockedStrandsExist` | 5123 | function |  | 3 |
| `hiddenStrandsExist` | 5127 | function |  | 2 |
| `hideSelectedStrands` | 5131 | function |  | 2 |
| `unhideHiddenStrands` | 5141 | function |  | 2 |
| `strandIsolationActive` | 5150 | function |  | 7 |
| `setStrandIsolation` | 5154 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5166 | function |  | 3 |
| `syncVisibilityParent` | 5177 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5184 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5213 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5220 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5243 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5461 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5482 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5501 | function |  | 2 |
| `selectedViewportFocusBounds` | 5599 | function |  | 2 |
| `frameViewportBounds` | 5613 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5643 | function |  | 2 |
| `fullSceneFocusBounds` | 5647 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5662 | function |  | 3 |
| `cycleViewportFraming` | 5671 | function |  | 2 |
| `sculptBrushToolActive` | 5691 | function |  | 23 |
| `sculptBrushSelectionMaskActive` | 5695 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5699 | function |  | 2 |
| `effectiveSculptBrushTool` | 5703 | function |  | 4 |
| `updateSculptScaleModeRow` | 5709 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5714 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5736 | function |  | 5 |
| `setActiveTool` | 5745 | function |  | 12 |
| `setDrawStrandMode` | 5883 | function |  | 1 |
| `setObjectSpaceEditing` | 5893 | function |  | 7 |
| `setHierarchyEditing` | 5909 | function |  | 4 |
| `setProportionalEditing` | 5921 | function |  | 5 |
| `beginProportionalSizeEdit` | 5940 | function |  | 3 |
| `updateProportionalSizeEdit` | 5952 | function |  | 2 |
| `endProportionalSizeEdit` | 5963 | function |  | 5 |
| `activateProportionalHotkeyHold` | 5970 | function |  | 2 |
| `refreshProportionalPreview` | 5978 | function |  | 4 |
| `activeBrushSizeInput` | 5988 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 5997 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6009 | function |  | 2 |
| `beginBrushSizeDrag` | 6027 | function |  | 1 |
| `updateBrushSizeDrag` | 6054 | function |  | 1 |
| `finishBrushSizeDrag` | 6075 | function |  | 2 |
| `updateInteractionLocks` | 6092 | function |  | 59 |
| `configureTransformControls` | 6103 | function |  | 12 |
| `pullMoveActive` | 6111 | function |  | 9 |
| `updatePullGuideVisual` | 6115 | function |  | 4 |
| `attachTransformForCurvePoint` | 6131 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6155 | function |  | 5 |
| `strandObjectRootIndex` | 6171 | function |  | 3 |
| `strandObjectRoot` | 6180 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6184 | function |  | 2 |
| `attachStrandObjectTransform` | 6189 | function |  | 6 |
| `guideObjectPivot` | 6212 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6223 | function |  | 2 |
| `attachGuideObjectTransform` | 6228 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6247 | function |  | 2 |
| `beginGuideObjectTransform` | 6275 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6282 | function |  | 2 |
| `updateGuideObjectTransform` | 6304 | function |  | 2 |
| `finishGuideObjectTransform` | 6337 | function |  | 2 |
| `clonePlacementFrame` | 6346 | function |  | 2 |
| `cloneOptionalVectors` | 6358 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6362 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6379 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6394 | function |  | 2 |
| `strandObjectTransformOperators` | 6410 | function |  | 4 |
| `transformPoint` | 6418 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6425 | arrow |  | 0 |
| `transformNormal` | 6431 | arrow |  | 10 |
| `transformDirection` | 6441 | arrow |  | 5 |
| `worldMatrixForPivot` | 6453 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6459 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6475 | function |  | 6 |
| `beginStrandObjectTransform` | 6501 | function |  | 2 |
| `updateStrandObjectTransform` | 6539 | function |  | 2 |
| `commitStrandObjectTransform` | 6597 | function |  | 2 |
| `mapPoints` | 6610 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6644 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6658 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6681 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6694 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6709 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6735 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6784 | function |  | 2 |
| `beginHandleEdit` | 6793 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6846 | function |  | 3 |
| `multiPointHandleEditActive` | 6857 | function |  | 7 |
| `applyMultiMove` | 6861 | function |  | 5 |
| `applyMultiRotate` | 6867 | function |  | 2 |
| `applyMultiScale` | 6876 | function |  | 2 |
| `applyHierarchicalMove` | 6885 | function |  | 3 |
| `applySingleMove` | 6897 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6901 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6918 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6927 | function |  | 3 |
| `changed` | 6937 | arrow |  | 1 |
| `applyPullMove` | 6979 | function |  | 3 |
| `pullHeadCollisionContext` | 6987 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7006 | function |  | 2 |
| `applyProportionalMove` | 7029 | function |  | 3 |
| `viewPlaneNormal` | 7040 | function |  | 12 |
| `isCameraInSnappedView` | 7044 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7052 | function |  | 9 |
| `updateViewPlaneGrid` | 7056 | function |  | 14 |
| `setViewPlaneMove` | 7113 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7124 | function |  | 2 |
| `rayFromViewportEvent` | 7132 | function |  | 11 |
| `worldUnitsPerViewportPixel` | 7140 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7150 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7161 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7174 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7193 | function |  | 4 |
| `beginViewPlaneMove` | 7200 | function |  | 3 |
| `updateViewPlaneMove` | 7264 | function |  | 1 |
| `endViewPlaneMove` | 7329 | function |  | 7 |
| `applyHierarchicalRotate` | 7348 | function |  | 2 |
| `rotateGuideNormal` | 7355 | arrow |  | 4 |
| `applySingleRotate` | 7393 | function |  | 2 |
| `applyProportionalRotate` | 7397 | function |  | 2 |
| `applyHierarchicalScale` | 7417 | function |  | 2 |
| `applySingleScale` | 7427 | function |  | 2 |
| `applyProportionalScale` | 7431 | function |  | 2 |
| `setPointScale` | 7447 | function |  | 7 |
| `proportionalWeight` | 7456 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7468 | function |  | 5 |
| `strandInfluenceColor` | 7474 | function |  | 4 |
| `beginRelaxEdit` | 7499 | function |  | 3 |
| `updateRelaxEdit` | 7528 | function |  | 1 |
| `endRelaxEdit` | 7588 | function |  | 1 |
| `disposeGuide` | 7598 | function |  | 3 |
| `removeGuideObjects` | 7626 | function |  | 3 |
| `strandRadiusAt` | 7640 | function |  | 5 |
| `strandProfileTopologyAt` | 7657 | function |  | 2 |
| `strandCurveParameters` | 7699 | function |  | 1 |
| `widthProfileAt` | 7709 | arrow |  | 1 |
| `braidFrameAt` | 7747 | function |  | 4 |
| `braidFrameAtExtended` | 7757 | function |  | 2 |
| `createBraidProfileProjector` | 7766 | function |  | 2 |
| `project` | 7782 | arrow |  | 12 |
| `createBraidGeometry` | 7797 | function |  | 1 |
| `quantize` | 7830 | arrow |  | 19 |
| `deformationAt` | 7832 | function |  | 3 |
| `widthFor` | 7841 | arrow |  | 3 |
| `depthFor` | 7845 | arrow |  | 3 |
| `outputVertex` | 7877 | function |  | 7 |
| `appendAuthoredCap` | 7985 | function |  | 3 |
| `outputCapVertex` | 7992 | arrow |  | 6 |
| `capBoundary` | 8083 | function |  | 3 |
| `strandGeometryCurve` | 8145 | function |  | 6 |
| `strandGeometryFrameAt` | 8171 | function |  | 5 |
| `transportedStrandFrameAt` | 8234 | function |  | 5 |
| `twistOverrideAt` | 8237 | arrow |  | 2 |
| `hairMaterialDefinition` | 8307 | function |  | 4 |
| `materialForLock` | 8311 | function |  | 8 |
| `activeHairMaterialDefinition` | 8315 | function |  | 11 |
| `strandDisplayColor` | 8321 | function |  | 14 |
| `setAnimeHairBaseColor` | 8339 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 8352 | function |  | 2 |
| `createHairMaterial` | 8392 | function |  | 5 |
| `createStrandSelectionOutline` | 8434 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 8469 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 8478 | function |  | 6 |
| `refreshMaterialUsers` | 8505 | function |  | 6 |
| `renderHairMaterialOutliner` | 8514 | function |  | 5 |
| `renderHairMaterialOptions` | 8544 | function |  | 3 |
| `syncHairMaterialEditor` | 8554 | function |  | 9 |
| `createProjectHairMaterial` | 8580 | function |  | 3 |
| `deleteActiveHairMaterial` | 8600 | function |  | 2 |
| `createHairTopologyGeometry` | 8618 | function |  | 4 |
| `createHairTopologyOverlay` | 8639 | function |  | 3 |
| `groupDefaultsFor` | 8686 | function |  | 8 |
| `creationToolActive` | 8693 | function |  | 5 |
| `activeCreationShapeDefaults` | 8697 | function |  | 7 |
| `curvePolylineLength` | 8704 | function |  | 2 |
| `curvePolylineLengths` | 8712 | function |  | 3 |
| `samplePolylineDistance` | 8720 | function |  | 2 |
| `applyProjectedCurveLength` | 8730 | function |  | 4 |
| `clearRegionLengthBaseline` | 8761 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8768 | function |  | 2 |
| `setGroupLengthScale` | 8776 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 8814 | function |  | 3 |
| `requestGroupDefaultsWarning` | 8846 | function |  | 1 |
| `activeProfileOffset` | 8858 | function |  | 3 |
| `profileToCanvas` | 8866 | function |  | 1 |
| `renderProfilePreview` | 8873 | function |  | 7 |
| `renderHairCardCoveragePath` | 8892 | function |  | 2 |
| `updateViewportStatsVisibility` | 9144 | function |  | 1 |
| `canvasToProfile` | 9163 | function |  | 2 |
| `addLock` | 9178 | function |  | 8 |
| `mirroredVector` | 9390 | function |  | 12 |
| `mirroredPlacementFrame` | 9394 | function |  | 2 |
| `mirrorPartnerFor` | 9407 | function |  | 36 |
| `decoupleMirrorPartner` | 9411 | function |  | 2 |
| `createMirrorPartner` | 9419 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 9515 | function |  | 6 |
| `mirroredClumpPartners` | 9520 | function |  | 6 |
| `createMirroredClump` | 9526 | function |  | 3 |
| `decoupleMirroredClump` | 9548 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 9568 | function |  | 6 |
| `syncActiveMirror` | 9735 | function |  | 22 |
| `setMirrorXEditing` | 9747 | function |  | 5 |
| `snapshotState` | 9771 | function |  | 6 |
| `rootAttachmentFrame` | 10032 | function |  | 3 |
| `rootAttachmentLocalFrame` | 10044 | function |  | 4 |
| `resolveRootAttachment` | 10062 | function |  | 4 |
| `curvePointsToRootLocal` | 10102 | function |  | 2 |
| `curvePointsFromRootLocal` | 10114 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 10122 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 10138 | function |  | 2 |
| `createRootAttachment` | 10169 | function |  | 7 |
| `syncRootAttachmentMetadata` | 10199 | function |  | 3 |
| `rootAttachmentToData` | 10226 | function |  | 2 |
| `rootAttachmentFromData` | 10254 | function |  | 3 |
| `importHeadMeshFile` | 10296 | function |  | 3 |
| `importFullBodyMeshFile` | 10319 | function |  | 3 |
| `downloadPreferencesAndPresets` | 10344 | function |  | 1 |
| `importedBooleanPreference` | 10377 | function |  | 11 |
| `loadPreferencesAndPresets` | 10425 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 10495 | function |  | 1 |
| `openHairProjectFile` | 10539 | function |  | 4 |
| `dragContainsApplicationFile` | 10597 | function |  | 3 |
| `safelyRememberRecentProject` | 10606 | function |  | 2 |
| `renderRecentProjectsMenu` | 10615 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 10647 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 10672 | function |  | 2 |
| `confirmDroppedApplicationFile` | 10676 | function |  | 2 |
| `pushUndoState` | 10692 | function |  | 87 |
| `undoLastAction` | 10699 | function |  | 2 |
| `redoLastAction` | 10716 | function |  | 2 |
| `updateHistoryButtons` | 10733 | function |  | 8 |
| `resetTransientInteractionsForStateRestore` | 10738 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 10758 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 10765 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 10804 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 10830 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 10862 | function |  | 2 |
| `finalizeStateRestore` | 10903 | function |  | 2 |
| `restoreState` | 10910 | function |  | 4 |
| `disposeAllEditableObjects` | 10934 | function |  | 2 |
| `restoreLock` | 10955 | function |  | 4 |
| `restoreGuide` | 11179 | function |  | 2 |
| `vectorToData` | 11240 | function |  | 25 |
| `dataToVector` | 11244 | function |  | 22 |
| `frameToData` | 11248 | function |  | 2 |
| `frameFromData` | 11260 | function |  | 2 |
| `average` | 11272 | function |  | 3 |
| `fitPointAttributes` | 11276 | function |  | 7 |
| `rebuildCurveObjects` | 11305 | function |  | 8 |
| `createCurvePoints` | 11317 | function |  | 2 |
| `selectedCurveLatticeGuide` | 11326 | function |  | 10 |
| `braidStrokeActive` | 11333 | function |  | 8 |
| `proceduralDrawActive` | 11337 | function |  | 3 |
| `panelStrokeActive` | 11341 | function |  | 5 |
| `activeStrokeSurfaceInput` | 11345 | function |  | 4 |
| `activeStrokeSurfaceValue` | 11349 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 11353 | function |  | 3 |
| `activeStrokeDynamicEnabled` | 11359 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 11363 | function |  | 5 |
| `setDrawSurfaceDynamicEnabled` | 11367 | function |  | 5 |
| `setActiveStrokeSurfaceValue` | 11371 | function |  | 3 |
| `liveSurfaceStrandId` | 11381 | function |  | 4 |
| `liveSurfaceStrand` | 11385 | function |  | 2 |
| `liveSurfaceGuideId` | 11390 | function |  | 3 |
| `guideSupportsLiveSurface` | 11394 | function |  | 2 |
| `liveSurfaceGuide` | 11401 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 11408 | function |  | 10 |
| `activeStrokeBrushSize` | 11449 | function |  | 9 |
| `activeStrokeBrushDepth` | 11455 | function |  | 5 |
| `strokeSurfaceIsContextual` | 11461 | function |  | 3 |
| `contextualPlaneAtOrigin` | 11469 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 11479 | function |  | 7 |
| `worldNormalAtHit` | 11518 | function |  | 4 |
| `drawSampleFromHit` | 11527 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 11541 | function |  | 3 |
| `strokeLength` | 11578 | function |  | 8 |
| `resampleDrawStroke` | 11584 | function |  | 2 |
| `processedDrawStroke` | 11616 | function |  | 6 |
| `strokeSurfaceNormals` | 11645 | function |  | 6 |
| `drawClumpFrame` | 11656 | function |  | 4 |
| `nearestCurveParameter` | 11665 | function |  | 2 |
| `drawClumpSampleNormal` | 11679 | function |  | 5 |
| `drawClumpTemplateVector` | 11688 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 11694 | function |  | 3 |
| `drawClumpStrandMaps` | 11710 | function |  | 4 |
| `nextClumpName` | 11765 | function |  | 6 |
| `initializeClumpShape` | 11772 | function |  | 5 |
| `stableClumpVariation` | 11783 | function |  | 3 |
| `createClumpFromLocks` | 11795 | function |  | 7 |
| `addLockToClump` | 11820 | function |  | 4 |
| `pointerToNdc` | 11876 | function |  | 1 |
| `gridProfileSkipCol` | 11892 | function |  | 1 |
| `clumpDirectMembers` | 11916 | function |  | 3 |
| `clumpMembersForGuide` | 11921 | function |  | 6 |
| `clumpGuideForLock` | 11925 | function |  | 13 |
| `proceduralGuideForLock` | 11930 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 11937 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 11944 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 11951 | function |  | 2 |
| `proceduralBranchWorldPoints` | 11963 | function |  | 1 |
| `applyProceduralBranchSettings` | 11976 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 12015 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 12031 | function |  | 3 |
| `createProceduralAccessoryLock` | 12045 | function |  | 2 |
| `applyProceduralAccessorySettings` | 12097 | function |  | 2 |
| `clumpFrameAt` | 12148 | function |  | 5 |
| `commitClumpMemberRestState` | 12156 | function |  | 9 |
| `updateClumpMembers` | 12239 | function |  | 10 |
| `dissolveClump` | 12343 | function |  | 6 |
| `detachLockFromClump` | 12380 | function |  | 4 |
| `updateDrawVolumePreview` | 12406 | function |  | 5 |
| `hideDrawClumpPreviews` | 12430 | function |  | 5 |
| `resetDrawVolumePreview` | 12436 | function |  | 3 |
| `updateDrawStrandPreview` | 12442 | function |  | 20 |
| `continueFromTipEnabled` | 12663 | function |  | 2 |
| `selectedTipContinuationLock` | 12669 | function |  | 3 |
| `beginDrawStrandStroke` | 12684 | function |  | 2 |
| `beginDrawFreePlane` | 12813 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 12827 | function |  | 2 |
| `updateDrawStrandStroke` | 12852 | function |  | 1 |
| `createDrawnLock` | 12898 | function |  | 3 |
| `setting` | 12902 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 12970 | function |  | 4 |
| `createDrawnBraid` | 12978 | function |  | 2 |
| `createDrawnStrand` | 13035 | function |  | 2 |
| `createDrawnPanel` | 13162 | function |  | 2 |
| `extendDrawnStrand` | 13214 | function |  | 2 |
| `finishDrawStrandStroke` | 13247 | function |  | 6 |
| `createPlacedStrand` | 13274 | function |  | 2 |
| `placedPointCount` | 13338 | function |  | 3 |
| `createPlacedPoints` | 13342 | function |  | 3 |
| `pushPointOutsideHead` | 13361 | function |  | 2 |
| `resizePlacedStrand` | 13393 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 13410 | function |  | 5 |
| `beginPlaceEdit` | 13415 | function |  | 2 |
| `updatePlaceEdit` | 13433 | function |  | 1 |
| `updatePlacementLength` | 13447 | function |  | 3 |
| `updatePlacementOrientation` | 13457 | function |  | 3 |
| `endPlaceEdit` | 13475 | function |  | 1 |
| `confirmPendingPlacedStrand` | 13490 | function |  | 1 |
| `pendingPlacedLock` | 13500 | function |  | 2 |
| `beginPlacementPointer` | 13504 | function |  | 3 |
| `finishPlacementPointer` | 13514 | function |  | 2 |
| `confirmPlacementStep` | 13538 | function |  | 2 |
| `finishPlacementFlow` | 13561 | function |  | 6 |
| `updatePlacementStatus` | 13574 | function |  | 51 |
| `deselectStrands` | 13713 | function |  | 11 |
| `beginSelectionMarquee` | 13728 | function |  | 3 |
| `beginAltOrbit` | 13752 | function |  | 1 |
| `beginBlenderNavigation` | 13764 | function |  | 1 |
| `endBlenderNavigation` | 13809 | function |  | 1 |
| `prepareSelectPointerCapture` | 13817 | function |  | 1 |
| `endSelectPointerCapture` | 13823 | function |  | 1 |
| `applyAltClickCandidate` | 13829 | function |  | 2 |
| `finishBrushAltClick` | 13855 | function |  | 1 |
| `endAltOrbit` | 13868 | function |  | 2 |
| `dollyCameraByDrag` | 13875 | function |  | 2 |
| `fastDragMagnitude` | 13898 | function |  | 2 |
| `beginHoudiniZoomDrag` | 13904 | function |  | 1 |
| `updateHoudiniZoomDrag` | 13912 | function |  | 1 |
| `endHoudiniZoomDrag` | 13929 | function |  | 1 |
| `updateSelectionMarquee` | 13937 | function |  | 1 |
| `pointInsideSelectionMarquee` | 13954 | function |  | 3 |
| `selectPointsInMarquee` | 13962 | function |  | 2 |
| `pointKey` | 13988 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 14019 | function |  | 2 |
| `objectInsideSelectionMarquee` | 14056 | function |  | 3 |
| `projectedPoint` | 14073 | arrow |  | 1 |
| `selectObjectsInMarquee` | 14102 | function |  | 2 |
| `finishSelectionMarquee` | 14147 | function |  | 2 |
| `headMeshes` | 14170 | function |  | 6 |
| `strandSplitProfileData` | 14178 | function |  | 2 |
| `strandSplitControlPoint` | 14191 | function |  | 1 |
| `panelSplitControlPoint` | 14227 | function |  | 3 |
| `panelWidthAt` | 14244 | arrow |  | 3 |
| `panelThicknessAt` | 14251 | arrow |  | 3 |
| `strandControlPointRaycast` | 14284 | function |  | 1 |
| `strandControlPointFrame` | 14319 | function |  | 4 |
| `strandControlPointHitFromEvent` | 14351 | function |  | 3 |
| `createCurveObjects` | 14409 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 14530 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 14537 | function |  | 2 |
| `strandWidthEdgeSample` | 14546 | function |  | 3 |
| `strandWidthEdgePoints` | 14569 | function |  | 2 |
| `sculptBrushDebugRaycast` | 14583 | arrow |  | 0 |
| `updateCurveObjects` | 14585 | function |  | 27 |
| `pointUpDirection` | 14780 | function |  | 2 |
| `curveFrameAtPoint` | 14784 | function |  | 4 |
| `curveFrameAt` | 14805 | function |  | 3 |
| `strandTwistAt` | 14825 | function |  | 6 |
| `controlPointRotationAt` | 14830 | function |  | 3 |
| `strandProfileTwistAt` | 14834 | function |  | 2 |
| `strandFrameAt` | 14840 | function |  | 1 |
| `curveFrameAtSnapshot` | 14846 | function |  | 3 |
| `outwardNormalAtPoint` | 14865 | function |  | 8 |
| `sampledSurfaceNormal` | 14928 | function |  | 2 |
| `guidedNormalAt` | 14944 | function |  | 4 |
| `twistFromHandle` | 14963 | function |  | 3 |
| `signedAngleAroundAxis` | 14984 | function |  | 4 |
| `handleColor` | 14991 | function |  | 2 |
| `isAffectedCurvePoint` | 15014 | function |  | 2 |
| `syncLockFromCurve` | 15020 | function |  | 20 |
| `rebuildLockGeometry` | 15050 | function |  | 8 |
| `flushPendingLockGeometryUpdates` | 15078 | function |  | 7 |
| `updateLockGeometry` | 15091 | function |  | 40 |
| `setGroupColorView` | 15112 | function |  | 2 |
| `createUvCheckerTexture` | 15122 | function |  | 3 |
| `ensureUvCheckerForLock` | 15158 | function |  | 4 |
| `removeUvCheckerFromLock` | 15191 | function |  | 3 |
| `invalidateUvInspector` | 15206 | function |  | 7 |
| `uvInspectorRecord` | 15210 | function |  | 1 |
| `uvInspectorRecords` | 15249 | function |  | 2 |
| `drawUvInspectorGrid` | 15253 | function |  | 2 |
| `renderUvInspector` | 15287 | function |  | 3 |
| `setUvCheckerEnabled` | 15346 | function |  | 3 |
| `strandViewportBaseColor` | 15363 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 15398 | function |  | 3 |
| `syncStrandSelectionOutline` | 15404 | function |  | 2 |
| `applyLockedStrandPalette` | 15415 | function |  | 2 |
| `syncLockedStrandWireVisual` | 15424 | function |  | 6 |
| `setStrandSelectionVisual` | 15433 | function |  | 5 |
| `proceduralParentOutlineVisible` | 15449 | function |  | 2 |
| `syncProceduralParentVisibility` | 15456 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 15465 | function |  | 2 |
| `updateStrandSelectionHighlight` | 15469 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 15473 | function |  | 2 |
| `resetGuideSelectionVisuals` | 15486 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 15506 | function |  | 3 |
| `selectLock` | 15539 | function |  | 37 |
| `deselectStrandsForGuideEditor` | 15601 | function |  | 2 |
| `syncGroupInputs` | 15612 | function |  | 2 |
| `topologyStatsForLock` | 15645 | function |  | 4 |
| `formatTopologyStats` | 15653 | function |  | 5 |
| `updateTopologyStats` | 15657 | function |  | 15 |
| `normalizeStrandDimensions` | 15691 | function |  | 3 |
| `strandBaseWidth` | 15705 | function |  | 5 |
| `strandWidthDimension` | 15709 | function |  | 5 |
| `strandDepthDimension` | 15717 | function |  | 8 |
| `setStrandWidthDimension` | 15725 | function |  | 2 |
| `setStrandDepthDimension` | 15747 | function |  | 4 |
| `syncShapeDimensionInputs` | 15763 | function |  | 4 |
| `syncCreationShapeInputs` | 15799 | function |  | 2 |
| `syncViewportDrawSettings` | 15837 | function |  | 4 |
| `syncStrandSplitInputs` | 15854 | function |  | 4 |
| `syncHairCardControls` | 15863 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 15871 | function |  | 3 |
| `updateAttributeEditorMode` | 15910 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 16060 | function |  | 2 |
| `curveLatticeForGroup` | 16083 | function |  | 2 |
| `filterCurveLatticesToGroup` | 16101 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 16146 | function |  | 2 |
| `showCurveLatticeForGroup` | 16163 | function |  | 2 |
| `selectStrandGroup` | 16200 | function |  | 3 |
| `selectCurvePoint` | 16242 | function |  | 5 |
| `updateSelectedPointLabel` | 16256 | function |  | 12 |
| `syncInputs` | 16269 | function |  | 14 |
| `syncClumpGuidePanel` | 16315 | function |  | 3 |
| `getSelectedLock` | 16342 | function |  | 92 |
| `selectedLocksInOrder` | 16346 | function |  | 37 |
| `lockStrands` | 16352 | function |  | 3 |
| `lockSelectedStrands` | 16385 | function |  | 3 |
| `unlockStrands` | 16391 | function |  | 3 |
| `unlockAllStrands` | 16406 | function |  | 3 |
| `strandEditFamily` | 16410 | function |  | 7 |
| `compatibleSelectedLocks` | 16415 | function |  | 4 |
| `selectedEditRoots` | 16422 | function |  | 2 |
| `editSelectedLocks` | 16435 | function |  | 16 |
| `multiEditValuesEqual` | 16468 | function |  | 2 |
| `setMixedControl` | 16477 | function |  | 28 |
| `syncMultiStrandInputs` | 16494 | function |  | 16 |
| `values` | 16510 | arrow |  | 35 |
| `selectedRebuildableCurves` | 16590 | function |  | 5 |
| `createCompoundStrand` | 16597 | function |  | 1 |
| `refreshRebuildCurveDialog` | 16658 | function |  | 8 |
| `openRebuildCurveDialog` | 16671 | function |  | 1 |
| `rebuildSelectedCurves` | 16685 | function |  | 2 |
| `selectionCanBecomeClump` | 16724 | function |  | 4 |
| `createClumpFromSelection` | 16729 | function |  | 3 |
| `cleanSelectionSets` | 16741 | function |  | 2 |
| `createSelectionSetFromSelection` | 16746 | function |  | 3 |
| `selectionSetById` | 16757 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 16761 | function |  | 7 |
| `editSelectionSetFromSelection` | 16770 | function |  | 5 |
| `deleteSelectionSet` | 16790 | function |  | 2 |
| `selectSelectionSet` | 16799 | function |  | 2 |
| `deleteSelectedStrands` | 16809 | function |  | 4 |
| `deleteGuide` | 16817 | function |  | 3 |
| `deleteSelectedGuide` | 16840 | function |  | 3 |
| `deleteSelectedReferenceImage` | 16844 | function |  | 4 |
| `hasDeletableSelection` | 16857 | function |  | 2 |
| `deleteCurrentSelection` | 16865 | function |  | 3 |
| `hideOutlinerContextMenu` | 16873 | function |  | 17 |
| `outlinerLockTargets` | 16878 | function |  | 3 |
| `showOutlinerContextMenu` | 16905 | function |  | 8 |
| `hideStrandRadialMenu` | 16985 | function |  | 4 |
| `ensureRadialButtonCapacity` | 16996 | function |  | 3 |
| `radialButtonDimensions` | 17009 | function |  | 4 |
| `radialMenuDimensionsForKind` | 17018 | function |  | 3 |
| `applyRadialMenuDimensions` | 17035 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 17041 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 17054 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 17075 | function |  | 2 |
| `selectionSetRadialMenuOption` | 17092 | function |  | 4 |
| `selectedMirrorRadialOptions` | 17101 | function |  | 3 |
| `strandVisibilityRadialOptions` | 17123 | function |  | 5 |
| `clumpMirrorRadialOptions` | 17141 | function |  | 2 |
| `contextualRadialOptions` | 17148 | function |  | 3 |
| `sharedRadialFrameDimensions` | 17277 | function |  | 3 |
| `layoutContextualRadialOptions` | 17281 | function |  | 4 |
| `renderRadialActionList` | 17305 | function |  | 3 |
| `radialListOptionAtPointer` | 17323 | function |  | 3 |
| `syncRadialListHighlight` | 17345 | function |  | 3 |
| `configureContextualRadialMenu` | 17351 | function |  | 3 |
| `beginStrandRadialGesture` | 17411 | function |  | 2 |
| `enterStrandRadialSubmenu` | 17445 | function |  | 2 |
| `updateStrandRadialGesture` | 17491 | function |  | 1 |
| `performStrandRadialAction` | 17530 | function |  | 2 |
| `finishStrandRadialGesture` | 17633 | function |  | 2 |
| `cancelStrandRadialGesture` | 17643 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 17650 | function |  | 1 |
| `setPullMoveEnabled` | 17656 | function |  | 3 |
| `toolRadialOptions` | 17664 | function |  | 2 |
| `hideToolRadialMenu` | 17689 | function |  | 4 |
| `beginToolRadialGesture` | 17702 | function |  | 2 |
| `beginToolShortcutPress` | 17742 | function |  | 2 |
| `finishToolShortcutPress` | 17757 | function |  | 2 |
| `cancelToolShortcutPress` | 17766 | function |  | 5 |
| `setRadialMenusEnabled` | 17774 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 17787 | function |  | 5 |
| `setNavigationTipsEnabled` | 17802 | function |  | 5 |
| `configureNavigationMouseButtons` | 17809 | function |  | 3 |
| `syncNavigationModifierLocks` | 17822 | function |  | 7 |
| `setNavigationStyle` | 17827 | function |  | 5 |
| `applyCameraSmoothingPreference` | 17843 | function |  | 4 |
| `setCameraSmoothingEnabled` | 17858 | function |  | 5 |
| `setCameraSmoothingStrength` | 17864 | function |  | 5 |
| `setScaleSensitivity` | 17872 | function |  | 3 |
| `setToolTipsEnabled` | 17880 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 17887 | function |  | 5 |
| `setViewportStatisticsEnabled` | 17896 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 17904 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 17919 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 17928 | function |  | 5 |
| `sideNamingDisplayId` | 17937 | function |  | 3 |
| `referenceViewDisplayLabel` | 17949 | function |  | 6 |
| `strandRegionDisplayLabel` | 17959 | function |  | 7 |
| `updateSideNamingLabels` | 17977 | function |  | 2 |
| `setSideNamingPerspective` | 18004 | function |  | 5 |
| `setControlPointDisplaySize` | 18013 | function |  | 6 |
| `scaleHexColor` | 18025 | function |  | 3 |
| `setViewportBackgroundColor` | 18030 | function |  | 7 |
| `setDefaultHairShader` | 18052 | function |  | 5 |
| `setPreferenceCategory` | 18058 | function |  | 4 |
| `openPreferencesDialog` | 18085 | function |  | 1 |
| `savePreferencesDialog` | 18113 | function |  | 1 |
| `cancelPreferencesDialog` | 18137 | function |  | 3 |
| `updateToolRadialGesture` | 18166 | function |  | 1 |
| `performToolRadialAction` | 18195 | function |  | 2 |
| `finishToolRadialGesture` | 18205 | function |  | 2 |
| `cancelToolRadialGesture` | 18214 | function |  | 5 |
| `duplicatePlacementTarget` | 18221 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 18248 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 18252 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 18262 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 18267 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 18279 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 18290 | function |  | 7 |
| `openProceduralDuplicateDialog` | 18298 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 18315 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 18336 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 18347 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 18353 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 18359 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 18392 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 18547 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 18649 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 18690 | function |  | 2 |
| `updateDuplicatePlacement` | 18717 | function |  | 2 |
| `beginDuplicatePlacement` | 18781 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 18845 | function |  | 2 |
| `confirmDuplicatePlacement` | 18886 | function |  | 1 |
| `cancelDuplicatePlacement` | 18923 | function |  | 4 |
| `outlinerClumpLocks` | 18949 | function |  | 11 |
| `handleOutlinerClumpDrop` | 18953 | function |  | 3 |
| `createOutlinerStrandButton` | 18976 | function |  | 4 |
| `createOutlinerCurveSurface` | 19062 | function |  | 2 |
| `createOutlinerClump` | 19158 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 19240 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 19247 | function |  | 2 |
| `renderLockList` | 19326 | function |  | 57 |
| `updateCount` | 19480 | function |  | 22 |
| `captureInputUndo` | 19489 | function |  | 1 |
| `bindUndoCapture` | 19495 | function |  | 37 |
| `bindLockInput` | 19506 | function |  | 2 |
| `applyValue` | 19523 | arrow |  | 2 |
| `applyUniformTransformScale` | 19842 | function |  | 2 |
| `applyReducedTransformScale` | 19859 | function |  | 2 |
| `applyTransformPrecision` | 19898 | function |  | 2 |
| `updateTransformScalePointer` | 19927 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 20924 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 20929 | function |  | 4 |
| `syncDrawCurlControls` | 20984 | function |  | 5 |
| `handleLiveSurfaceChange` | 21032 | function |  | 1 |
| `selectedBranchChildLock` | 21323 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 21327 | function |  | 2 |
| `initPanelResizeHandles` | 21433 | function |  | 2 |
| `applyWidth` | 21439 | arrow |  | 2 |
| `restoreWidth` | 21446 | arrow |  | 2 |
| `bindResize` | 21454 | arrow |  | 2 |
| `onMove` | 21463 | arrow |  | 0 |
| `onUp` | 21467 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 21484 | function |  | 2 |
| `initFloatingPanelControls` | 21493 | function |  | 2 |
| `detach` | 21502 | arrow |  | 26 |
| `endDrag` | 21540 | arrow |  | 0 |
| `endResize` | 21572 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 21583 | function |  | 3 |
| `selectPatchNotesVersion` | 21717 | function |  | 3 |
| `requestReferenceImage` | 21750 | function |  | 5 |
| `toggleCapsuleGuideTool` | 21954 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 21960 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 21967 | function |  | 1 |
| `deleteLocks` | 22534 | function |  | 10 |
| `disposeCurveObjects` | 22612 | function |  | 4 |
| `resize` | 22674 | function |  | 3 |
| `handleViewportPointerMove` | 22685 | function |  | 1 |
| `blockProportionalSizingEvent` | 22696 | function |  | 1 |
| `updateLightAngleFromInputs` | 22702 | function |  | 2 |
| `startViewSnap` | 22716 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 22746 | function |  | 3 |
| `trackViewportPointerDown` | 22763 | function |  | 1 |
| `trackViewportPointerMove` | 22779 | function |  | 1 |
| `clearViewportPointer` | 22787 | function |  | 1 |
| `updateViewSnap` | 22792 | function |  | 1 |
| `nearestCardinalAxis` | 22828 | function |  | 5 |
| `cardinalAxisKey` | 22842 | function |  | 5 |
| `steppedDragAmount` | 22846 | function |  | 3 |
| `snapCameraToCardinalAxis` | 22852 | function |  | 4 |
| `endViewSnap` | 22868 | function |  | 4 |
| `activateStrandControlPoint` | 22878 | function |  | 2 |
| `refreshStrandControlPointSelection` | 22928 | function |  | 4 |
| `addStrandControlPointSelection` | 22955 | function |  | 2 |
| `removeStrandControlPointSelection` | 22972 | function |  | 3 |
| `sampleStrandPointNormal` | 22986 | function |  | 2 |
| `sampleStrandPointVectors` | 22996 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 23002 | function |  | 2 |
| `resampleStrandCurveData` | 23013 | function |  | 4 |
| `resampleMatchingVectors` | 23019 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 23058 | function |  | 4 |
| `removeStrandCurvePoint` | 23069 | function |  | 2 |
| `closestStrandCurveParameter` | 23082 | function |  | 1 |
| `insertStrandCurvePoint` | 23111 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 23128 | function |  | 2 |
| `selectionModifierCursorAvailable` | 23138 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 23154 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 23161 | function |  | 4 |
| `finishCurvePointInsertion` | 23184 | function |  | 1 |
| `finishPointRemoval` | 23199 | function |  | 1 |
| `isHairCreateTool` | 23218 | function |  | 4 |
| `syncStrandHoverOutline` | 23222 | function |  | 1 |
| `pointerOverTaperEditor` | 23235 | function |  | 2 |
| `updateStrandBrushHover` | 23242 | function |  | 1 |
| `strandControlPointHit` | 23266 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 23270 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 23348 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 23382 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 23422 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 23435 | function |  | 1 |
| `setHoveredControlPoint` | 23474 | function |  | 7 |
| `visibleControlPointHoverTargets` | 23487 | function |  | 2 |
| `updateControlPointHover` | 23523 | function |  | 1 |
| `animate` | 24138 | function |  | 2 |
| `syncCompactSidebarLayout` | 24169 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 24188 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 24194 | function |  | 3 |
| `setAttributeEditorTab` | 24200 | function |  | 6 |

## modules/bones/bone-interaction.js（734 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBoneInteractionApi` | 19 | function | export | 1 |
| `beginTipSubBoneRotate` | 20 | function |  | 1 |
| `applyTipSubBoneTransform` | 48 | function |  | 1 |
| `beginPanelSplitHandleDrag` | 80 | function |  | 1 |
| `updatePanelSplitHandleDrag` | 205 | function |  | 1 |
| `endPanelSplitHandleDrag` | 426 | function |  | 3 |
| `applySubBoneBrushSample` | 437 | function |  | 1 |
| `updatePanelTipHover` | 582 | function |  | 1 |
| `prepareCurvePointSelection` | 612 | function |  | 1 |

## modules/bones/bone-model.js（349 行）

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

## modules/bones/bone-view-handles.js（539 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBoneViewHandlesApi` | 14 | function | export | 2 |
| `createSplitControlHandle` | 15 | function |  | 6 |
| `createCurveNormalIndicator` | 30 | function |  | 2 |
| `createBoneViewHandles` | 56 | function |  | 1 |
| `updateBoneViewHandles` | 204 | function |  | 1 |
| `syncTipNormalArrow` | 272 | arrow |  | 4 |
| `disposeBoneViewHandles` | 474 | function |  | 1 |

## modules/bones/segment-control.js（150 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSegmentControlApi` | 15 | function | export | 1 |
| `selectedPanelSegment` | 16 | function |  | 3 |
| `syncPanelSegmentControls` | 22 | function |  | 2 |
| `syncPanelShapeInputs` | 40 | function |  | 2 |
| `openPanelSegmentCurveEditor` | 67 | function |  | 1 |
| `changePanelSplitCount` | 103 | function |  | 1 |

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

## modules/geometry/panel-tip-strand.js（1029 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPanelTipStrandApi` | 17 | function | export | 2 |
| `smoothCoincidentPanelNormals` | 24 | function |  | 2 |
| `weldPanelGeometryData` | 60 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 106 | function |  | 2 |
| `surfacePanelPoint` | 121 | function |  | 2 |
| `splitForkT` | 144 | function |  | 1 |
| `tipWidthSideForkT` | 156 | function |  | 6 |
| `tipSegmentWeightAt` | 167 | function |  | 2 |
| `tipWidthControlTs` | 186 | function |  | 4 |
| `tipWidthCommonForkT` | 197 | function |  | 4 |
| `tipWidthResetCurve` | 205 | function |  | 1 |
| `tipWidthSpreadGap` | 223 | function |  | 4 |
| `tipWidthMultiplierAt` | 240 | function |  | 8 |
| `tipPanelWidthAt` | 279 | function |  | 6 |
| `buildTipWidthCurve` | 285 | function |  | 5 |
| `addPoint` | 295 | arrow |  | 3 |
| `setTipWidthCurveValue` | 326 | function |  | 1 |
| `tipPanelFrameAt` | 345 | function |  | 4 |
| `tipMainSectionPoint` | 379 | function |  | 4 |
| `tipSurfaceFrameAt` | 427 | function |  | 3 |
| `tipChainFrameAt` | 458 | function |  | 2 |
| `tipWidthEdgePosition` | 489 | function |  | 3 |
| `tipWidthEdgePoints` | 520 | function |  | 1 |
| `tipWidthControlPlacement` | 535 | function |  | 1 |
| `tipHighlightMaterial` | 551 | function |  | 2 |
| `updateTipHighlight` | 573 | function |  | 1 |
| `splitTipForSegment` | 630 | function |  | 3 |
| `createPanelStrandGeometry` | 673 | function |  | 1 |
| `segmentWeightAt` | 704 | arrow |  | 1 |
| `addQuad` | 720 | arrow |  | 6 |
| `near` | 724 | arrow |  | 6 |
| `panelWidthAt` | 754 | arrow |  | 3 |
| `panelThicknessAt` | 759 | arrow |  | 3 |
| `panelFrameAt` | 768 | arrow |  | 1 |
| `rawPanelPoint` | 786 | arrow |  | 1 |
| `panelPoint` | 820 | arrow |  | 3 |
| `addPatch` | 828 | arrow |  | 1 |
| `uStart` | 959 | arrow |  | 1 |
| `uEnd` | 962 | arrow |  | 1 |

## modules/geometry/poly-tools.js（715 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPolyToolsApi` | 15 | function | export | 2 |
| `selectedPolyMesh` | 21 | function |  | 10 |
| `addPolyLock` | 26 | function |  | 2 |
| `ensurePolyMesh` | 45 | function |  | 3 |
| `polySurfaceSample` | 49 | function |  | 4 |
| `polyTargetAtEvent` | 60 | function |  | 6 |
| `refreshPolyMesh` | 86 | function |  | 10 |
| `ensurePolyFillPreview` | 95 | function |  | 2 |
| `clearPolyFillPreview` | 132 | function |  | 10 |
| `polyFillCandidateForEvent` | 137 | function |  | 3 |
| `showPolyFillPreview` | 157 | function |  | 2 |
| `updatePolyFillPreview` | 183 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 208 | function |  | 1 |
| `fillPolyGap` | 218 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 229 | function |  | 2 |
| `projectPolyRelaxPoint` | 249 | function |  | 2 |
| `removePolyPointAttributes` | 293 | function |  | 3 |
| `deletePolyComponent` | 302 | function |  | 2 |
| `addPolyPoint` | 325 | function |  | 4 |
| `appendPolyStrokeRow` | 334 | function |  | 4 |
| `beginPolyBrushPointer` | 354 | function |  | 1 |
| `finishPolyAltDelete` | 440 | function |  | 1 |
| `updatePolyBrushStroke` | 454 | function |  | 1 |
| `finishPolyBrushStroke` | 544 | function |  | 1 |
| `polyEdgeKey` | 581 | function |  | 2 |
| `polyMeshEdges` | 585 | function |  | 2 |
| `populatePolyEditObjects` | 599 | function |  | 3 |
| `createPolyEditObjects` | 663 | function |  | 1 |
| `rebuildPolyEditObjects` | 671 | function |  | 1 |

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

## modules/geometry/sculpt-geometry.js（889 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSculptGeometryApi` | 22 | function | export | 2 |
| `setSculptBrushMaterialClipping` | 39 | function |  | 1 |
| `sculptBrushDebugCurveVisible` | 46 | function |  | 2 |
| `refreshSculptBrushDebugView` | 58 | function |  | 2 |
| `refreshSculptBrushDebugAfterStateRestore` | 63 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 69 | function |  | 3 |
| `scheduleSculptBrushGeometryUpdates` | 86 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 94 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 100 | function |  | 3 |
| `editableStrandWidth` | 122 | function |  | 1 |
| `editableStrandWidthBounds` | 134 | function |  | 2 |
| `applyEditableStrandWidth` | 140 | function |  | 1 |
| `viewportPixelPoint` | 176 | function |  | 1 |
| `syncSculptBrushControls` | 184 | function |  | 3 |
| `syncSculptBrushStrengthForActiveTool` | 199 | function |  | 1 |
| `updateActiveSculptBrushStrength` | 207 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 215 | function |  | 1 |
| `sculptBrushPlaneOffset` | 221 | function |  | 5 |
| `setSculptBrushCursorVisible` | 225 | function |  | 4 |
| `updateSculptBrushCursor` | 232 | function |  | 2 |
| `sculptBrushMirrorUpdateLock` | 254 | function |  | 4 |
| `sculptBrushEditableLock` | 261 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 271 | function |  | 5 |
| `sculptBrushLockViable` | 277 | function |  | 5 |
| `sculptBrushUnits` | 288 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 326 | function |  | 2 |
| `sculptBrushPointWeight` | 376 | function |  | 5 |
| `sculptBrushWorldDelta` | 386 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 395 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 421 | function |  | 2 |
| `beginSculptMoveStroke` | 479 | function |  | 1 |
| `applySculptMoveStrokeSample` | 541 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 779 | function |  | 3 |
| `updateSculptMoveStroke` | 788 | function |  | 1 |
| `finishSculptMoveStroke` | 804 | function |  | 1 |

## modules/geometry/strand-constraints.js（120 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 3 |
| `solvePulledStrand` | 5 | function | export | 1 |

## modules/geometry/strand-geometry.js（899 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandGeometryApi` | 20 | function | export | 2 |
| `clipStrandProfilePolygon` | 29 | function |  | 3 |
| `inside` | 30 | arrow |  | 2 |
| `pushOrientedTriangle` | 52 | function |  | 7 |
| `orientedQuadFace` | 61 | function |  | 2 |
| `createSplitStrandGeometry` | 69 | function |  | 2 |
| `fusedIndexAt` | 226 | arrow |  | 0 |
| `createHairCardGeometry` | 275 | function |  | 2 |
| `createPolyGeometry` | 374 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 401 | function |  | 4 |
| `createCompoundStrandGeometry` | 466 | function |  | 2 |
| `vertexIndex` | 551 | arrow |  | 6 |
| `proceduralBranchGeometryLock` | 717 | function |  | 2 |
| `createHairGeometry` | 748 | function |  | 1 |
| `createBaseHairGeometry` | 800 | function |  | 3 |

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

## modules/geometry/taper-editor.js（943 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createTaperEditorApi` | 22 | function | export | 2 |
| `activeStrandShapeTarget` | 36 | function |  | 2 |
| `activeTaperTarget` | 39 | function |  | 15 |
| `activeTaperCurve` | 66 | function |  | 10 |
| `ensureSecondaryTaperCurve` | 76 | function |  | 5 |
| `taperSamples` | 85 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 91 | function |  | 2 |
| `renderTaperPreview` | 112 | function |  | 6 |
| `shapeTargetForSelect` | 147 | function |  | 1 |
| `taperPointToCanvas` | 151 | function |  | 4 |
| `canvasToTaperPoint` | 167 | function |  | 1 |
| `clearTaperMeshPoints` | 202 | function |  | 2 |
| `taperMeshPointFrame` | 211 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 220 | function |  | 3 |
| `updateTaperMeshPoints` | 256 | function |  | 4 |
| `setTaperMeshPointsVisible` | 334 | function |  | 3 |
| `renderTaperCurveEditor` | 351 | function |  | 8 |
| `tipSideForkFor` | 364 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 442 | function |  | 3 |
| `retargetOpenTaperCurveEditor` | 455 | function |  | 1 |
| `refreshTaperCurveEditorAfterStateRestore` | 470 | function |  | 2 |
| `scheduleTaperCurveEdit` | 500 | function |  | 2 |
| `flushScheduledTaperCurveEdit` | 508 | function |  | 5 |
| `cancelScheduledTaperCurveEdit` | 518 | function |  | 2 |
| `applyTaperCurveEdit` | 525 | function |  | 5 |
| `openTaperCurveEditor` | 650 | function |  | 2 |
| `closeTaperCurveEditor` | 694 | function |  | 4 |
| `retargetFloatingStrandEditors` | 706 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 720 | function |  | 2 |
| `finishTaperCurveDrag` | 731 | function |  | 1 |
| `beginTaperMeshPointDrag` | 738 | function |  | 1 |
| `updateTaperMeshPointDrag` | 818 | function |  | 1 |
| `finishTaperMeshPointDrag` | 872 | function |  | 4 |
| `updateSelectedTaperPoint` | 895 | function |  | 1 |

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

## modules/io/preset-library.js（980 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPresetLibraryApi` | 11 | function | export | 2 |
| `braidTemplateFromEntries` | 24 | function |  | 4 |
| `braidMeshEntries` | 56 | function |  | 2 |
| `prepareBraidBodyCache` | 68 | function |  | 2 |
| `quantize` | 77 | arrow |  | 2 |
| `sourceNormalAt` | 89 | arrow |  | 1 |
| `clusterBoundary` | 92 | arrow |  | 2 |
| `normalBuckets` | 109 | arrow |  | 2 |
| `applyBucketPair` | 141 | arrow |  | 2 |
| `registerBraidMeshPreset` | 172 | function |  | 2 |
| `annotateBraidObjTopology` | 193 | function |  | 2 |
| `loadBraidMeshPreset` | 213 | function |  | 1 |
| `setupShapePresetControls` | 227 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 252 | function |  | 3 |
| `syncShapePresetSelects` | 258 | function |  | 2 |
| `populateShapePresetSelects` | 279 | function |  | 4 |
| `openSaveShapePreset` | 306 | function |  | 2 |
| `commitCustomShapePreset` | 331 | function |  | 2 |
| `openRemoveShapePreset` | 354 | function |  | 2 |
| `commitRemoveShapePreset` | 367 | function |  | 2 |
| `applyPresetSelection` | 378 | function |  | 2 |
| `renderPresetLibrary` | 409 | function |  | 3 |
| `setPresetLibraryOpen` | 468 | function |  | 4 |
| `createLongLayeredCurlPoints` | 481 | function |  | 1 |
| `createBraidedBobShellPoints` | 530 | function |  | 1 |
| `createBowlCutPoints` | 566 | function |  | 1 |
| `normalizeBraidDimensions` | 604 | function |  | 1 |
| `applyPresetControl` | 617 | function |  | 2 |
| `applyCreationToolSettings` | 638 | function |  | 2 |
| `populateCreationPresetSelect` | 676 | function |  | 4 |
| `populateDrawBrushPresetSelect` | 700 | function |  | 5 |
| `syncCreationPresetRemoveButtons` | 733 | function |  | 5 |
| `createCustomCreationPreset` | 738 | function |  | 3 |
| `createCustomClumpPreset` | 753 | function |  | 1 |
| `commitCustomCreationPreset` | 768 | function |  | 2 |
| `openRemoveCreationPreset` | 829 | function |  | 3 |
| `commitRemoveCreationPreset` | 842 | function |  | 1 |
| `applyBraidToolPreset` | 859 | function |  | 2 |
| `setupShapePresetUi` | 894 | function |  | 1 |
| `setupCreationPresetUi` | 901 | function |  | 1 |
| `setupPresetLibraryEvents` | 951 | function |  | 1 |

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
