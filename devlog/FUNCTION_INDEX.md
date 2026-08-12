# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1805** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（30059 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 272 | function |  | 3 |
| `saveBooleanPreference` | 300 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 304 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 309 | function |  | 2 |
| `normalizeScaleSensitivity` | 314 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 319 | function |  | 2 |
| `normalizeSideNamingPerspective` | 324 | function |  | 2 |
| `normalizeNavigationStyle` | 328 | function |  | 2 |
| `setupEditableSliderControls` | 343 | function |  | 2 |
| `syncNumberFromRange` | 394 | arrow |  | 0 |
| `applyNumberValue` | 401 | arrow |  | 0 |
| `copyCameraPose` | 507 | function |  | 3 |
| `updateCameraProjectionForViewport` | 513 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 526 | function |  | 3 |
| `setOrthographicView` | 532 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 572 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 601 | function |  | 2 |
| `removeRotateFreeAxisRing` | 627 | function |  | 2 |
| `deflateTransformGizmoPickers` | 639 | function |  | 2 |
| `nextStrandName` | 1034 | function |  | 2 |
| `activeDrawClumpTemplate` | 1119 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1124 | function |  | 3 |
| `drawModeCreatesClump` | 1151 | function |  | 1 |
| `isPanelGeometry` | 1295 | function |  | 50 |
| `normalizePanelSplits` | 1299 | function |  | 3 |
| `clonePanelSplits` | 1311 | function |  | 31 |
| `snapPanelSplitHeight` | 1315 | function |  | 5 |
| `createQuadSphereGeometry` | 1350 | function |  | 2 |
| `vertexIndex` | 1364 | function |  | 11 |
| `addEdge` | 1382 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1548 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1728 | function |  | 2 |
| `currentStrandSelectionState` | 1790 | function |  | 4 |
| `applyStrandSelectionState` | 1794 | function |  | 5 |
| `clearStrandSelectionState` | 1799 | function |  | 6 |
| `disposeGuideModel` | 2851 | function |  | 3 |
| `syncHeadTransformInputs` | 2862 | function |  | 3 |
| `applyHeadTransform` | 2869 | function |  | 4 |
| `resetHeadTransform` | 2889 | function |  | 2 |
| `installGuideModel` | 2904 | function |  | 5 |
| `loadDefaultGuideModel` | 2980 | function |  | 3 |
| `braidTemplateFromEntries` | 3003 | function |  | 4 |
| `braidMeshEntries` | 3035 | function |  | 2 |
| `prepareBraidBodyCache` | 3047 | function |  | 2 |
| `quantize` | 3056 | arrow |  | 21 |
| `sourceNormalAt` | 3068 | arrow |  | 1 |
| `clusterBoundary` | 3071 | arrow |  | 2 |
| `normalBuckets` | 3088 | arrow |  | 2 |
| `applyBucketPair` | 3120 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3151 | function |  | 2 |
| `annotateBraidObjTopology` | 3172 | function |  | 2 |
| `loadBraidMeshPreset` | 3192 | function |  | 3 |
| `createSplitControlHandle` | 3209 | function |  | 6 |
| `frameGuideModel` | 3224 | function |  | 2 |
| `normalizeHairLayer` | 3253 | function |  | 26 |
| `layerOffsetForLock` | 3257 | function |  | 8 |
| `layerRootOffsetFactor` | 3262 | function |  | 12 |
| `layerOffsetWeight` | 3266 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3272 | function |  | 5 |
| `pointsWithLayerOffset` | 3281 | function |  | 3 |
| `layerDirectionForLock` | 3289 | function |  | 2 |
| `applyLayerOffset` | 3300 | function |  | 5 |
| `setLockHairLayer` | 3324 | function |  | 2 |
| `setGroupLayerOffset` | 3339 | function |  | 2 |
| `quadraticWeights` | 3367 | function |  | 1 |
| `setHeadReferenceTransparency` | 3378 | function |  | 4 |
| `trianglePlaneIntersections` | 3390 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3411 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3620 | function |  | 1 |
| `upperContourCurve` | 3637 | function |  | 2 |
| `hermitePoint` | 3672 | function |  | 2 |
| `curveNetworkSection` | 3683 | function |  | 1 |
| `pointAlongSection` | 3712 | function |  | 1 |
| `longestStitchedContour` | 3718 | function |  | 2 |
| `nodeForPoint` | 3726 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3783 | function |  | 1 |
| `exitSetupEditors` | 3803 | function |  | 6 |
| `syncAppMenuVisibility` | 3813 | function |  | 3 |
| `closeAppMenus` | 3819 | function |  | 6 |
| `setAppMenuOpen` | 3830 | function |  | 2 |
| `setTurntableActive` | 3837 | function |  | 3 |
| `selectedReferenceImage` | 3847 | function |  | 20 |
| `normalizeReferenceCrop` | 3853 | function |  | 8 |
| `referenceCropIsFull` | 3861 | function |  | 3 |
| `referencePlaneFrontAxis` | 3866 | function |  | 4 |
| `referencePlanePlacement` | 3875 | function |  | 4 |
| `migratedReferencePlanePosition` | 3890 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3910 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3927 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3943 | function |  | 2 |
| `snappedReferenceImageView` | 3966 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3972 | function |  | 5 |
| `applyReferenceImageRuntime` | 3988 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4031 | function |  | 6 |
| `createReferenceImageRuntime` | 4039 | function |  | 3 |
| `addReferenceImage` | 4108 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4160 | function |  | 3 |
| `disposeReferenceImage` | 4179 | function |  | 2 |
| `clearReferenceImages` | 4183 | function |  | 2 |
| `serializeReferenceImage` | 4190 | function |  | 1 |
| `setReferenceImageType` | 4218 | function |  | 2 |
| `attachReferenceImageTransform` | 4262 | function |  | 6 |
| `selectReferenceImage` | 4276 | function |  | 12 |
| `placeReferencePlane` | 4299 | function |  | 2 |
| `setReferencePlaneInFront` | 4310 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4320 | function |  | 4 |
| `renderReferenceImagePanel` | 4339 | function |  | 20 |
| `setOutlinerTab` | 4386 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4404 | function |  | 4 |
| `componentEditModeActive` | 4408 | function |  | 30 |
| `selectionToolSupportsPicking` | 4412 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4417 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4433 | function |  | 2 |
| `setViewportSelectionMode` | 4463 | function |  | 4 |
| `setViewportEditMode` | 4475 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4517 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4531 | function |  | 8 |
| `normalizeOutlinerName` | 4545 | function |  | 3 |
| `beginOutlinerRename` | 4550 | function |  | 2 |
| `finish` | 4561 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4591 | function |  | 6 |
| `referenceOutlinerGroup` | 4603 | function |  | 2 |
| `renderReferenceOutliner` | 4607 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4724 | function |  | 5 |
| `readReferenceImageFile` | 4729 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4753 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4760 | function |  | 3 |
| `dragContainsReferenceImage` | 4805 | function |  | 3 |
| `setReferenceImageDragActive` | 4816 | function |  | 9 |
| `referenceDropDestination` | 4824 | function |  | 2 |
| `viewportOverlayDropPosition` | 4830 | function |  | 2 |
| `setReferenceDropHover` | 4839 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4857 | function |  | 2 |
| `referenceOverlayAtPointer` | 4877 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4895 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4908 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4954 | function |  | 1 |
| `finishReferenceOverlayDrag` | 5004 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5026 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5037 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5063 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5072 | function |  | 2 |
| `referenceCropCursor` | 5087 | function |  | 3 |
| `updateReferenceCropHandles` | 5093 | function |  | 5 |
| `referenceCropSourcePoint` | 5114 | function |  | 2 |
| `beginReferenceCrop` | 5121 | function |  | 1 |
| `updateReferenceCrop` | 5159 | function |  | 1 |
| `finishReferenceCrop` | 5191 | function |  | 4 |
| `setHeadSetupEditing` | 5209 | function |  | 6 |
| `strandPassesDisplayFilters` | 5235 | function |  | 4 |
| `strandVisibleForDisplay` | 5244 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 5249 | function |  | 3 |
| `lockedStrandsExist` | 5253 | function |  | 3 |
| `hiddenStrandsExist` | 5257 | function |  | 2 |
| `hideSelectedStrands` | 5261 | function |  | 2 |
| `unhideHiddenStrands` | 5271 | function |  | 2 |
| `strandIsolationActive` | 5280 | function |  | 7 |
| `setStrandIsolation` | 5284 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5296 | function |  | 3 |
| `syncVisibilityParent` | 5307 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5314 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5343 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5350 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5373 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5591 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5612 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5631 | function |  | 2 |
| `selectedViewportFocusBounds` | 5729 | function |  | 2 |
| `frameViewportBounds` | 5743 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5773 | function |  | 2 |
| `fullSceneFocusBounds` | 5777 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5792 | function |  | 3 |
| `cycleViewportFraming` | 5801 | function |  | 2 |
| `sculptBrushToolActive` | 5821 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 5825 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5829 | function |  | 3 |
| `effectiveSculptBrushTool` | 5833 | function |  | 15 |
| `updateSculptScaleModeRow` | 5839 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5844 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5866 | function |  | 5 |
| `setActiveTool` | 5875 | function |  | 12 |
| `setDrawStrandMode` | 6013 | function |  | 2 |
| `setObjectSpaceEditing` | 6023 | function |  | 7 |
| `setHierarchyEditing` | 6039 | function |  | 4 |
| `setProportionalEditing` | 6051 | function |  | 5 |
| `beginProportionalSizeEdit` | 6070 | function |  | 3 |
| `updateProportionalSizeEdit` | 6082 | function |  | 2 |
| `endProportionalSizeEdit` | 6093 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6100 | function |  | 2 |
| `refreshProportionalPreview` | 6108 | function |  | 4 |
| `activeBrushSizeInput` | 6118 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6127 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6139 | function |  | 2 |
| `beginBrushSizeDrag` | 6157 | function |  | 1 |
| `updateBrushSizeDrag` | 6184 | function |  | 1 |
| `finishBrushSizeDrag` | 6205 | function |  | 2 |
| `updateInteractionLocks` | 6222 | function |  | 64 |
| `configureTransformControls` | 6233 | function |  | 13 |
| `pullMoveActive` | 6241 | function |  | 9 |
| `updatePullGuideVisual` | 6245 | function |  | 4 |
| `attachTransformForCurvePoint` | 6261 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6285 | function |  | 6 |
| `strandObjectRootIndex` | 6301 | function |  | 3 |
| `strandObjectRoot` | 6310 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6314 | function |  | 2 |
| `attachStrandObjectTransform` | 6319 | function |  | 6 |
| `guideObjectPivot` | 6342 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6353 | function |  | 2 |
| `attachGuideObjectTransform` | 6358 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6377 | function |  | 2 |
| `beginGuideObjectTransform` | 6405 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6412 | function |  | 2 |
| `updateGuideObjectTransform` | 6434 | function |  | 2 |
| `finishGuideObjectTransform` | 6467 | function |  | 2 |
| `clonePlacementFrame` | 6476 | function |  | 2 |
| `cloneOptionalVectors` | 6488 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6492 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6509 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6524 | function |  | 2 |
| `strandObjectTransformOperators` | 6540 | function |  | 4 |
| `transformPoint` | 6548 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6555 | arrow |  | 0 |
| `transformNormal` | 6561 | arrow |  | 10 |
| `transformDirection` | 6571 | arrow |  | 5 |
| `worldMatrixForPivot` | 6583 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6589 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6605 | function |  | 6 |
| `beginStrandObjectTransform` | 6631 | function |  | 2 |
| `updateStrandObjectTransform` | 6669 | function |  | 2 |
| `commitStrandObjectTransform` | 6727 | function |  | 2 |
| `mapPoints` | 6740 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6774 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6788 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6811 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6824 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6839 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6865 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6914 | function |  | 2 |
| `beginHandleEdit` | 6923 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6976 | function |  | 3 |
| `multiPointHandleEditActive` | 6987 | function |  | 7 |
| `applyMultiMove` | 6991 | function |  | 5 |
| `applyMultiRotate` | 6997 | function |  | 2 |
| `applyMultiScale` | 7006 | function |  | 2 |
| `applyHierarchicalMove` | 7015 | function |  | 3 |
| `applySingleMove` | 7027 | function |  | 5 |
| `applySurfaceLatticeMirror` | 7031 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 7048 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 7057 | function |  | 3 |
| `changed` | 7067 | arrow |  | 1 |
| `applyPullMove` | 7109 | function |  | 3 |
| `pullHeadCollisionContext` | 7117 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7136 | function |  | 2 |
| `applyProportionalMove` | 7159 | function |  | 3 |
| `viewPlaneNormal` | 7170 | function |  | 12 |
| `isCameraInSnappedView` | 7174 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7182 | function |  | 9 |
| `updateViewPlaneGrid` | 7186 | function |  | 14 |
| `setViewPlaneMove` | 7243 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7254 | function |  | 2 |
| `rayFromViewportEvent` | 7262 | function |  | 11 |
| `worldUnitsPerViewportPixel` | 7270 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7280 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7291 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7304 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7323 | function |  | 4 |
| `beginViewPlaneMove` | 7330 | function |  | 3 |
| `updateViewPlaneMove` | 7394 | function |  | 1 |
| `endViewPlaneMove` | 7459 | function |  | 7 |
| `applyHierarchicalRotate` | 7478 | function |  | 2 |
| `rotateGuideNormal` | 7485 | arrow |  | 4 |
| `applySingleRotate` | 7523 | function |  | 2 |
| `applyProportionalRotate` | 7527 | function |  | 2 |
| `applyHierarchicalScale` | 7547 | function |  | 2 |
| `applySingleScale` | 7557 | function |  | 2 |
| `applyProportionalScale` | 7561 | function |  | 2 |
| `setPointScale` | 7577 | function |  | 8 |
| `proportionalWeight` | 7586 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7598 | function |  | 5 |
| `strandInfluenceColor` | 7604 | function |  | 12 |
| `beginRelaxEdit` | 7629 | function |  | 3 |
| `updateRelaxEdit` | 7658 | function |  | 1 |
| `endRelaxEdit` | 7718 | function |  | 1 |
| `disposeGuide` | 7728 | function |  | 3 |
| `removeGuideObjects` | 7756 | function |  | 3 |
| `strandRadiusAt` | 7770 | function |  | 5 |
| `strandProfileTopologyAt` | 7787 | function |  | 5 |
| `strandCurveParameters` | 7829 | function |  | 3 |
| `widthProfileAt` | 7839 | arrow |  | 1 |
| `braidFrameAt` | 7877 | function |  | 4 |
| `braidFrameAtExtended` | 7887 | function |  | 2 |
| `createBraidProfileProjector` | 7896 | function |  | 2 |
| `project` | 7912 | arrow |  | 21 |
| `createBraidGeometry` | 7927 | function |  | 2 |
| `deformationAt` | 7962 | function |  | 3 |
| `widthFor` | 7971 | arrow |  | 3 |
| `depthFor` | 7975 | arrow |  | 3 |
| `outputVertex` | 8007 | function |  | 7 |
| `appendAuthoredCap` | 8115 | function |  | 3 |
| `outputCapVertex` | 8122 | arrow |  | 6 |
| `capBoundary` | 8213 | function |  | 3 |
| `strandGeometryCurve` | 8275 | function |  | 11 |
| `strandGeometryFrameAt` | 8301 | function |  | 13 |
| `transportedStrandFrameAt` | 8364 | function |  | 5 |
| `twistOverrideAt` | 8367 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 8395 | function |  | 2 |
| `weldPanelGeometryData` | 8431 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 8477 | function |  | 3 |
| `surfacePanelPoint` | 8492 | function |  | 3 |
| `splitForkT` | 8515 | function |  | 3 |
| `tipWidthSideForkT` | 8528 | function |  | 6 |
| `tipSegmentWeightAt` | 8539 | function |  | 2 |
| `tipWidthControlTs` | 8558 | function |  | 4 |
| `tipWidthCommonForkT` | 8569 | function |  | 4 |
| `tipWidthResetCurve` | 8577 | function |  | 3 |
| `tipWidthSpreadGap` | 8595 | function |  | 4 |
| `tipWidthMultiplierAt` | 8612 | function |  | 8 |
| `tipPanelWidthAt` | 8651 | function |  | 7 |
| `buildTipWidthCurve` | 8657 | function |  | 5 |
| `addPoint` | 8667 | arrow |  | 3 |
| `setTipWidthCurveValue` | 8698 | function |  | 4 |
| `tipPanelFrameAt` | 8717 | function |  | 4 |
| `tipMainSectionPoint` | 8751 | function |  | 4 |
| `tipSurfaceFrameAt` | 8799 | function |  | 3 |
| `tipChainFrameAt` | 8830 | function |  | 4 |
| `tipWidthEdgePosition` | 8861 | function |  | 4 |
| `tipWidthEdgePoints` | 8892 | function |  | 2 |
| `tipWidthControlPlacement` | 8907 | function |  | 3 |
| `tipHighlightMaterial` | 8923 | function |  | 2 |
| `updateTipHighlight` | 8945 | function |  | 4 |
| `splitTipForSegment` | 9002 | function |  | 9 |
| `createPanelStrandGeometry` | 9045 | function |  | 2 |
| `segmentWeightAt` | 9076 | arrow |  | 1 |
| `addQuad` | 9092 | arrow |  | 6 |
| `near` | 9096 | arrow |  | 6 |
| `panelWidthAt` | 9126 | arrow |  | 6 |
| `panelThicknessAt` | 9131 | arrow |  | 6 |
| `panelFrameAt` | 9140 | arrow |  | 1 |
| `rawPanelPoint` | 9158 | arrow |  | 1 |
| `panelPoint` | 9192 | arrow |  | 3 |
| `addPatch` | 9200 | arrow |  | 1 |
| `uStart` | 9331 | arrow |  | 1 |
| `uEnd` | 9334 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 9373 | function |  | 3 |
| `inside` | 9374 | arrow |  | 2 |
| `pushOrientedTriangle` | 9396 | function |  | 7 |
| `triangulatePolygon3D` | 9407 | function |  | 1 |
| `orientedQuadFace` | 9457 | function |  | 2 |
| `createSplitStrandGeometry` | 9465 | function |  | 2 |
| `fusedIndexAt` | 9622 | arrow |  | 0 |
| `createHairCardGeometry` | 9671 | function |  | 2 |
| `createPolyGeometry` | 9770 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 9797 | function |  | 4 |
| `createCompoundStrandGeometry` | 9880 | function |  | 2 |
| `proceduralBranchGeometryLock` | 10131 | function |  | 2 |
| `createHairGeometry` | 10176 | function |  | 5 |
| `createBaseHairGeometry` | 10228 | function |  | 3 |
| `hairMaterialDefinition` | 10313 | function |  | 4 |
| `materialForLock` | 10317 | function |  | 8 |
| `activeHairMaterialDefinition` | 10321 | function |  | 11 |
| `strandDisplayColor` | 10327 | function |  | 14 |
| `setAnimeHairBaseColor` | 10345 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 10358 | function |  | 2 |
| `createHairMaterial` | 10398 | function |  | 5 |
| `createStrandSelectionOutline` | 10440 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 10475 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 10484 | function |  | 6 |
| `refreshMaterialUsers` | 10511 | function |  | 6 |
| `renderHairMaterialOutliner` | 10520 | function |  | 5 |
| `renderHairMaterialOptions` | 10550 | function |  | 3 |
| `syncHairMaterialEditor` | 10560 | function |  | 9 |
| `createProjectHairMaterial` | 10586 | function |  | 3 |
| `deleteActiveHairMaterial` | 10606 | function |  | 2 |
| `createHairTopologyGeometry` | 10624 | function |  | 4 |
| `createHairTopologyOverlay` | 10645 | function |  | 3 |
| `groupDefaultsFor` | 10692 | function |  | 9 |
| `creationToolActive` | 10699 | function |  | 5 |
| `activeCreationShapeDefaults` | 10703 | function |  | 7 |
| `curvePolylineLength` | 10710 | function |  | 2 |
| `curvePolylineLengths` | 10718 | function |  | 3 |
| `samplePolylineDistance` | 10726 | function |  | 2 |
| `applyProjectedCurveLength` | 10736 | function |  | 4 |
| `clearRegionLengthBaseline` | 10767 | function |  | 2 |
| `ensureRegionLengthBaseline` | 10774 | function |  | 2 |
| `setGroupLengthScale` | 10782 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 10820 | function |  | 3 |
| `requestGroupDefaultsWarning` | 10852 | function |  | 1 |
| `activeProfileOffset` | 10864 | function |  | 3 |
| `profileToCanvas` | 10872 | function |  | 1 |
| `renderProfilePreview` | 10879 | function |  | 7 |
| `renderHairCardCoveragePath` | 10898 | function |  | 2 |
| `setupShapePresetControls` | 11037 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 11062 | function |  | 3 |
| `syncShapePresetSelects` | 11068 | function |  | 5 |
| `populateShapePresetSelects` | 11089 | function |  | 5 |
| `openSaveShapePreset` | 11117 | function |  | 2 |
| `commitCustomShapePreset` | 11142 | function |  | 2 |
| `openRemoveShapePreset` | 11165 | function |  | 2 |
| `commitRemoveShapePreset` | 11178 | function |  | 2 |
| `openPanelSegmentCurveEditor` | 11214 | function |  | 3 |
| `updateViewportStatsVisibility` | 11251 | function |  | 3 |
| `canvasToProfile` | 11270 | function |  | 2 |
| `addLock` | 11285 | function |  | 16 |
| `mirroredVector` | 11497 | function |  | 12 |
| `mirroredPlacementFrame` | 11501 | function |  | 2 |
| `mirrorPartnerFor` | 11514 | function |  | 39 |
| `decoupleMirrorPartner` | 11518 | function |  | 2 |
| `createMirrorPartner` | 11526 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 11622 | function |  | 6 |
| `mirroredClumpPartners` | 11627 | function |  | 6 |
| `createMirroredClump` | 11633 | function |  | 3 |
| `decoupleMirroredClump` | 11655 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 11675 | function |  | 6 |
| `syncActiveMirror` | 11842 | function |  | 29 |
| `setMirrorXEditing` | 11854 | function |  | 5 |
| `snapshotState` | 11878 | function |  | 7 |
| `rootAttachmentFrame` | 12139 | function |  | 3 |
| `rootAttachmentLocalFrame` | 12151 | function |  | 4 |
| `resolveRootAttachment` | 12169 | function |  | 4 |
| `curvePointsToRootLocal` | 12209 | function |  | 2 |
| `curvePointsFromRootLocal` | 12221 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 12229 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 12245 | function |  | 2 |
| `createRootAttachment` | 12276 | function |  | 7 |
| `syncRootAttachmentMetadata` | 12306 | function |  | 3 |
| `rootAttachmentToData` | 12333 | function |  | 2 |
| `rootAttachmentFromData` | 12361 | function |  | 3 |
| `importHeadMeshFile` | 12403 | function |  | 3 |
| `importFullBodyMeshFile` | 12426 | function |  | 3 |
| `downloadPreferencesAndPresets` | 12451 | function |  | 1 |
| `importedBooleanPreference` | 12484 | function |  | 11 |
| `loadPreferencesAndPresets` | 12498 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 12568 | function |  | 1 |
| `openHairProjectFile` | 12612 | function |  | 4 |
| `dragContainsApplicationFile` | 12670 | function |  | 3 |
| `safelyRememberRecentProject` | 12679 | function |  | 2 |
| `renderRecentProjectsMenu` | 12688 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 12720 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 12745 | function |  | 2 |
| `confirmDroppedApplicationFile` | 12749 | function |  | 2 |
| `pushUndoState` | 12765 | function |  | 98 |
| `undoLastAction` | 12772 | function |  | 2 |
| `redoLastAction` | 12789 | function |  | 2 |
| `updateHistoryButtons` | 12806 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 12811 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 12831 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 12838 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 12877 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 12903 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 12935 | function |  | 2 |
| `finalizeStateRestore` | 12976 | function |  | 2 |
| `restoreState` | 12983 | function |  | 5 |
| `disposeAllEditableObjects` | 13007 | function |  | 2 |
| `restoreLock` | 13028 | function |  | 4 |
| `restoreGuide` | 13252 | function |  | 2 |
| `vectorToData` | 13313 | function |  | 25 |
| `dataToVector` | 13317 | function |  | 22 |
| `frameToData` | 13321 | function |  | 2 |
| `frameFromData` | 13333 | function |  | 2 |
| `applyPresetSelection` | 13345 | function |  | 2 |
| `drawPresetThumbnail` | 13376 | function |  | 1 |
| `fillHair` | 13391 | arrow |  | 9 |
| `strand` | 13403 | arrow |  | 31 |
| `bun` | 13421 | arrow |  | 2 |
| `braid` | 13456 | arrow |  | 2 |
| `renderPresetLibrary` | 13545 | function |  | 3 |
| `setPresetLibraryOpen` | 13604 | function |  | 6 |
| `average` | 13617 | function |  | 4 |
| `fitPointAttributes` | 13621 | function |  | 7 |
| `rebuildCurveObjects` | 13650 | function |  | 9 |
| `createCurvePoints` | 13662 | function |  | 2 |
| `addGeneratedBangPreset` | 13671 | function |  | 1 |
| `createLongLayeredCurlPoints` | 13765 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 13814 | function |  | 1 |
| `columns` | 13815 | arrow |  | 1 |
| `layer` | 13819 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 14033 | function |  | 2 |
| `addBraidedBobPreset` | 14069 | function |  | 1 |
| `evenColumns` | 14070 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 14286 | function |  | 1 |
| `scalpSeed` | 14309 | arrow |  | 1 |
| `createBowlCutPoints` | 14596 | function |  | 2 |
| `addBowlCutPreset` | 14634 | function |  | 1 |
| `selectedCurveLatticeGuide` | 14702 | function |  | 10 |
| `braidStrokeActive` | 14709 | function |  | 8 |
| `proceduralDrawActive` | 14713 | function |  | 3 |
| `panelStrokeActive` | 14717 | function |  | 5 |
| `activeStrokeSurfaceInput` | 14721 | function |  | 4 |
| `activeStrokeSurfaceValue` | 14725 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 14729 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 14735 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 14739 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 14743 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 14747 | function |  | 3 |
| `liveSurfaceStrandId` | 14757 | function |  | 4 |
| `liveSurfaceStrand` | 14761 | function |  | 2 |
| `liveSurfaceGuideId` | 14766 | function |  | 3 |
| `guideSupportsLiveSurface` | 14770 | function |  | 2 |
| `liveSurfaceGuide` | 14777 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 14784 | function |  | 10 |
| `activeStrokeBrushSize` | 14825 | function |  | 10 |
| `activeStrokeBrushDepth` | 14831 | function |  | 5 |
| `strokeSurfaceIsContextual` | 14837 | function |  | 3 |
| `contextualPlaneAtOrigin` | 14845 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 14855 | function |  | 7 |
| `worldNormalAtHit` | 14894 | function |  | 4 |
| `drawSampleFromHit` | 14903 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 14917 | function |  | 3 |
| `strokeLength` | 14954 | function |  | 8 |
| `resampleDrawStroke` | 14960 | function |  | 2 |
| `processedDrawStroke` | 14992 | function |  | 6 |
| `strokeSurfaceNormals` | 15021 | function |  | 6 |
| `drawClumpFrame` | 15032 | function |  | 4 |
| `nearestCurveParameter` | 15041 | function |  | 2 |
| `drawClumpSampleNormal` | 15055 | function |  | 5 |
| `drawClumpTemplateVector` | 15064 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 15070 | function |  | 3 |
| `drawClumpStrandMaps` | 15086 | function |  | 4 |
| `nextClumpName` | 15141 | function |  | 6 |
| `initializeClumpShape` | 15148 | function |  | 5 |
| `stableClumpVariation` | 15159 | function |  | 3 |
| `createClumpFromLocks` | 15171 | function |  | 7 |
| `addLockToClump` | 15196 | function |  | 4 |
| `pointerToNdc` | 15252 | function |  | 1 |
| `gridProfileSkipCol` | 15268 | function |  | 3 |
| `clumpDirectMembers` | 15292 | function |  | 3 |
| `clumpMembersForGuide` | 15297 | function |  | 6 |
| `clumpGuideForLock` | 15301 | function |  | 13 |
| `proceduralGuideForLock` | 15306 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 15313 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 15320 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 15327 | function |  | 3 |
| `proceduralBranchWorldPoints` | 15339 | function |  | 2 |
| `applyProceduralBranchSettings` | 15352 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 15391 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 15407 | function |  | 3 |
| `createProceduralAccessoryLock` | 15421 | function |  | 2 |
| `applyProceduralAccessorySettings` | 15473 | function |  | 2 |
| `clumpFrameAt` | 15524 | function |  | 5 |
| `commitClumpMemberRestState` | 15532 | function |  | 10 |
| `updateClumpMembers` | 15615 | function |  | 10 |
| `dissolveClump` | 15719 | function |  | 6 |
| `detachLockFromClump` | 15756 | function |  | 4 |
| `updateDrawVolumePreview` | 15782 | function |  | 5 |
| `hideDrawClumpPreviews` | 15806 | function |  | 5 |
| `resetDrawVolumePreview` | 15812 | function |  | 3 |
| `updateDrawStrandPreview` | 15818 | function |  | 22 |
| `continueFromTipEnabled` | 16039 | function |  | 2 |
| `selectedTipContinuationLock` | 16045 | function |  | 3 |
| `beginDrawStrandStroke` | 16060 | function |  | 2 |
| `beginDrawFreePlane` | 16189 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 16203 | function |  | 2 |
| `updateDrawStrandStroke` | 16228 | function |  | 1 |
| `createDrawnLock` | 16274 | function |  | 3 |
| `setting` | 16278 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 16346 | function |  | 4 |
| `createDrawnBraid` | 16354 | function |  | 2 |
| `createDrawnStrand` | 16411 | function |  | 2 |
| `createDrawnPanel` | 16538 | function |  | 2 |
| `extendDrawnStrand` | 16590 | function |  | 2 |
| `finishDrawStrandStroke` | 16623 | function |  | 6 |
| `createPlacedStrand` | 16650 | function |  | 2 |
| `placedPointCount` | 16714 | function |  | 3 |
| `createPlacedPoints` | 16718 | function |  | 3 |
| `pushPointOutsideHead` | 16737 | function |  | 8 |
| `resizePlacedStrand` | 16769 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 16786 | function |  | 5 |
| `beginPlaceEdit` | 16791 | function |  | 2 |
| `updatePlaceEdit` | 16809 | function |  | 1 |
| `updatePlacementLength` | 16823 | function |  | 3 |
| `updatePlacementOrientation` | 16833 | function |  | 3 |
| `endPlaceEdit` | 16851 | function |  | 1 |
| `confirmPendingPlacedStrand` | 16866 | function |  | 1 |
| `pendingPlacedLock` | 16876 | function |  | 2 |
| `beginPlacementPointer` | 16880 | function |  | 3 |
| `finishPlacementPointer` | 16890 | function |  | 2 |
| `confirmPlacementStep` | 16914 | function |  | 2 |
| `finishPlacementFlow` | 16937 | function |  | 6 |
| `updatePlacementStatus` | 16950 | function |  | 53 |
| `deselectStrands` | 17089 | function |  | 11 |
| `beginSelectionMarquee` | 17104 | function |  | 3 |
| `beginAltOrbit` | 17128 | function |  | 1 |
| `beginBlenderNavigation` | 17140 | function |  | 1 |
| `endBlenderNavigation` | 17185 | function |  | 1 |
| `prepareSelectPointerCapture` | 17193 | function |  | 1 |
| `endSelectPointerCapture` | 17199 | function |  | 1 |
| `applyAltClickCandidate` | 17205 | function |  | 2 |
| `finishBrushAltClick` | 17231 | function |  | 1 |
| `endAltOrbit` | 17244 | function |  | 2 |
| `dollyCameraByDrag` | 17251 | function |  | 2 |
| `fastDragMagnitude` | 17274 | function |  | 2 |
| `beginHoudiniZoomDrag` | 17280 | function |  | 1 |
| `updateHoudiniZoomDrag` | 17288 | function |  | 1 |
| `endHoudiniZoomDrag` | 17305 | function |  | 1 |
| `updateSelectionMarquee` | 17313 | function |  | 1 |
| `pointInsideSelectionMarquee` | 17330 | function |  | 3 |
| `selectPointsInMarquee` | 17338 | function |  | 2 |
| `pointKey` | 17364 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 17395 | function |  | 2 |
| `objectInsideSelectionMarquee` | 17432 | function |  | 3 |
| `projectedPoint` | 17449 | arrow |  | 1 |
| `selectObjectsInMarquee` | 17478 | function |  | 2 |
| `finishSelectionMarquee` | 17523 | function |  | 2 |
| `headMeshes` | 17546 | function |  | 6 |
| `strandSplitProfileData` | 17554 | function |  | 4 |
| `strandSplitControlPoint` | 17567 | function |  | 4 |
| `panelSplitControlPoint` | 17603 | function |  | 8 |
| `strandControlPointRaycast` | 17660 | function |  | 1 |
| `strandControlPointFrame` | 17695 | function |  | 4 |
| `strandControlPointHitFromEvent` | 17727 | function |  | 4 |
| `createCurveObjects` | 17785 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 18047 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 18054 | function |  | 2 |
| `strandWidthEdgeSample` | 18063 | function |  | 3 |
| `strandWidthEdgePoints` | 18086 | function |  | 2 |
| `sculptBrushDebugRaycast` | 18100 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 18104 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 18111 | function |  | 3 |
| `refreshSculptBrushDebugView` | 18123 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 18128 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 18134 | function |  | 3 |
| `updateCurveObjects` | 18148 | function |  | 39 |
| `syncTipNormalArrow` | 18390 | arrow |  | 4 |
| `createCurveNormalIndicator` | 18603 | function |  | 3 |
| `pointUpDirection` | 18629 | function |  | 2 |
| `curveFrameAtPoint` | 18633 | function |  | 4 |
| `curveFrameAt` | 18654 | function |  | 4 |
| `strandTwistAt` | 18674 | function |  | 6 |
| `controlPointRotationAt` | 18679 | function |  | 3 |
| `strandProfileTwistAt` | 18683 | function |  | 2 |
| `strandFrameAt` | 18689 | function |  | 2 |
| `curveFrameAtSnapshot` | 18695 | function |  | 3 |
| `outwardNormalAtPoint` | 18714 | function |  | 11 |
| `sampledSurfaceNormal` | 18726 | function |  | 2 |
| `guidedNormalAt` | 18742 | function |  | 6 |
| `twistFromHandle` | 18761 | function |  | 3 |
| `signedAngleAroundAxis` | 18782 | function |  | 6 |
| `handleColor` | 18789 | function |  | 2 |
| `isAffectedCurvePoint` | 18812 | function |  | 2 |
| `syncLockFromCurve` | 18818 | function |  | 24 |
| `labelForPreset` | 18848 | function |  | 1 |
| `rebuildLockGeometry` | 18852 | function |  | 9 |
| `scheduleSculptBrushGeometryUpdates` | 18879 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 18887 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 18893 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 18915 | function |  | 8 |
| `updateLockGeometry` | 18928 | function |  | 55 |
| `setGroupColorView` | 18949 | function |  | 2 |
| `createUvCheckerTexture` | 18959 | function |  | 3 |
| `ensureUvCheckerForLock` | 18995 | function |  | 4 |
| `removeUvCheckerFromLock` | 19028 | function |  | 3 |
| `invalidateUvInspector` | 19043 | function |  | 7 |
| `uvInspectorRecord` | 19047 | function |  | 1 |
| `uvInspectorRecords` | 19086 | function |  | 2 |
| `drawUvInspectorGrid` | 19090 | function |  | 2 |
| `renderUvInspector` | 19124 | function |  | 3 |
| `setUvCheckerEnabled` | 19183 | function |  | 3 |
| `strandViewportBaseColor` | 19200 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 19235 | function |  | 3 |
| `syncStrandSelectionOutline` | 19241 | function |  | 2 |
| `applyLockedStrandPalette` | 19252 | function |  | 2 |
| `syncLockedStrandWireVisual` | 19261 | function |  | 6 |
| `setStrandSelectionVisual` | 19270 | function |  | 5 |
| `proceduralParentOutlineVisible` | 19286 | function |  | 2 |
| `syncProceduralParentVisibility` | 19293 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 19302 | function |  | 2 |
| `updateStrandSelectionHighlight` | 19306 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 19310 | function |  | 2 |
| `resetGuideSelectionVisuals` | 19323 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 19343 | function |  | 3 |
| `selectLock` | 19376 | function |  | 43 |
| `deselectStrandsForGuideEditor` | 19438 | function |  | 2 |
| `syncGroupInputs` | 19449 | function |  | 2 |
| `topologyStatsForLock` | 19482 | function |  | 4 |
| `formatTopologyStats` | 19490 | function |  | 5 |
| `updateTopologyStats` | 19494 | function |  | 23 |
| `normalizeBraidDimensions` | 19528 | function |  | 3 |
| `normalizeStrandDimensions` | 19541 | function |  | 3 |
| `strandBaseWidth` | 19555 | function |  | 5 |
| `strandWidthDimension` | 19559 | function |  | 5 |
| `strandDepthDimension` | 19567 | function |  | 8 |
| `setStrandWidthDimension` | 19575 | function |  | 2 |
| `setStrandDepthDimension` | 19597 | function |  | 4 |
| `syncShapeDimensionInputs` | 19613 | function |  | 4 |
| `syncCreationShapeInputs` | 19649 | function |  | 3 |
| `syncViewportDrawSettings` | 19687 | function |  | 4 |
| `selectedPanelSegment` | 19701 | function |  | 6 |
| `syncPanelSegmentControls` | 19707 | function |  | 11 |
| `syncPanelShapeInputs` | 19725 | function |  | 6 |
| `syncStrandSplitInputs` | 19752 | function |  | 4 |
| `syncHairCardControls` | 19761 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 19769 | function |  | 3 |
| `updateAttributeEditorMode` | 19808 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 19958 | function |  | 2 |
| `curveLatticeForGroup` | 19981 | function |  | 2 |
| `filterCurveLatticesToGroup` | 19999 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 20044 | function |  | 2 |
| `showCurveLatticeForGroup` | 20061 | function |  | 2 |
| `selectStrandGroup` | 20098 | function |  | 3 |
| `selectCurvePoint` | 20140 | function |  | 10 |
| `updateSelectedPointLabel` | 20154 | function |  | 12 |
| `syncInputs` | 20167 | function |  | 15 |
| `syncClumpGuidePanel` | 20213 | function |  | 3 |
| `getSelectedLock` | 20240 | function |  | 104 |
| `selectedLocksInOrder` | 20244 | function |  | 37 |
| `lockStrands` | 20250 | function |  | 3 |
| `lockSelectedStrands` | 20283 | function |  | 3 |
| `unlockStrands` | 20289 | function |  | 3 |
| `unlockAllStrands` | 20304 | function |  | 3 |
| `strandEditFamily` | 20308 | function |  | 7 |
| `compatibleSelectedLocks` | 20313 | function |  | 4 |
| `selectedEditRoots` | 20320 | function |  | 2 |
| `editSelectedLocks` | 20333 | function |  | 16 |
| `multiEditValuesEqual` | 20366 | function |  | 2 |
| `setMixedControl` | 20375 | function |  | 28 |
| `syncMultiStrandInputs` | 20392 | function |  | 16 |
| `values` | 20408 | arrow |  | 37 |
| `selectedRebuildableCurves` | 20488 | function |  | 5 |
| `createCompoundStrand` | 20495 | function |  | 1 |
| `refreshRebuildCurveDialog` | 20556 | function |  | 8 |
| `openRebuildCurveDialog` | 20569 | function |  | 1 |
| `rebuildSelectedCurves` | 20583 | function |  | 2 |
| `selectionCanBecomeClump` | 20622 | function |  | 4 |
| `createClumpFromSelection` | 20627 | function |  | 3 |
| `cleanSelectionSets` | 20639 | function |  | 2 |
| `createSelectionSetFromSelection` | 20644 | function |  | 3 |
| `selectionSetById` | 20655 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 20659 | function |  | 7 |
| `editSelectionSetFromSelection` | 20668 | function |  | 5 |
| `deleteSelectionSet` | 20688 | function |  | 2 |
| `selectSelectionSet` | 20697 | function |  | 2 |
| `deleteSelectedStrands` | 20707 | function |  | 4 |
| `deleteGuide` | 20715 | function |  | 3 |
| `deleteSelectedGuide` | 20738 | function |  | 3 |
| `deleteSelectedReferenceImage` | 20742 | function |  | 4 |
| `hasDeletableSelection` | 20755 | function |  | 2 |
| `deleteCurrentSelection` | 20763 | function |  | 3 |
| `hideOutlinerContextMenu` | 20771 | function |  | 17 |
| `outlinerLockTargets` | 20776 | function |  | 3 |
| `showOutlinerContextMenu` | 20803 | function |  | 8 |
| `hideStrandRadialMenu` | 20883 | function |  | 4 |
| `ensureRadialButtonCapacity` | 20894 | function |  | 3 |
| `radialButtonDimensions` | 20907 | function |  | 4 |
| `radialMenuDimensionsForKind` | 20916 | function |  | 3 |
| `applyRadialMenuDimensions` | 20933 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 20939 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 20952 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 20973 | function |  | 2 |
| `selectionSetRadialMenuOption` | 20990 | function |  | 4 |
| `selectedMirrorRadialOptions` | 20999 | function |  | 3 |
| `strandVisibilityRadialOptions` | 21021 | function |  | 5 |
| `clumpMirrorRadialOptions` | 21039 | function |  | 2 |
| `contextualRadialOptions` | 21046 | function |  | 3 |
| `sharedRadialFrameDimensions` | 21175 | function |  | 3 |
| `layoutContextualRadialOptions` | 21179 | function |  | 4 |
| `renderRadialActionList` | 21203 | function |  | 3 |
| `radialListOptionAtPointer` | 21221 | function |  | 3 |
| `syncRadialListHighlight` | 21243 | function |  | 3 |
| `configureContextualRadialMenu` | 21249 | function |  | 3 |
| `beginStrandRadialGesture` | 21309 | function |  | 2 |
| `enterStrandRadialSubmenu` | 21343 | function |  | 2 |
| `updateStrandRadialGesture` | 21389 | function |  | 1 |
| `performStrandRadialAction` | 21428 | function |  | 2 |
| `finishStrandRadialGesture` | 21531 | function |  | 2 |
| `cancelStrandRadialGesture` | 21541 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 21548 | function |  | 1 |
| `setPullMoveEnabled` | 21554 | function |  | 3 |
| `toolRadialOptions` | 21562 | function |  | 2 |
| `hideToolRadialMenu` | 21587 | function |  | 4 |
| `beginToolRadialGesture` | 21600 | function |  | 2 |
| `beginToolShortcutPress` | 21640 | function |  | 2 |
| `finishToolShortcutPress` | 21655 | function |  | 2 |
| `cancelToolShortcutPress` | 21664 | function |  | 5 |
| `setRadialMenusEnabled` | 21672 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 21685 | function |  | 5 |
| `setNavigationTipsEnabled` | 21700 | function |  | 5 |
| `configureNavigationMouseButtons` | 21707 | function |  | 3 |
| `syncNavigationModifierLocks` | 21720 | function |  | 7 |
| `setNavigationStyle` | 21725 | function |  | 5 |
| `applyCameraSmoothingPreference` | 21741 | function |  | 4 |
| `setCameraSmoothingEnabled` | 21756 | function |  | 5 |
| `setCameraSmoothingStrength` | 21762 | function |  | 5 |
| `setScaleSensitivity` | 21770 | function |  | 3 |
| `setToolTipsEnabled` | 21778 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 21785 | function |  | 5 |
| `setViewportStatisticsEnabled` | 21794 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 21802 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 21817 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 21826 | function |  | 5 |
| `sideNamingDisplayId` | 21835 | function |  | 3 |
| `referenceViewDisplayLabel` | 21847 | function |  | 6 |
| `strandRegionDisplayLabel` | 21857 | function |  | 7 |
| `updateSideNamingLabels` | 21875 | function |  | 2 |
| `setSideNamingPerspective` | 21902 | function |  | 5 |
| `setControlPointDisplaySize` | 21911 | function |  | 6 |
| `scaleHexColor` | 21923 | function |  | 3 |
| `setViewportBackgroundColor` | 21928 | function |  | 7 |
| `setDefaultHairShader` | 21950 | function |  | 5 |
| `setPreferenceCategory` | 21956 | function |  | 4 |
| `openPreferencesDialog` | 21983 | function |  | 1 |
| `savePreferencesDialog` | 22011 | function |  | 1 |
| `cancelPreferencesDialog` | 22035 | function |  | 3 |
| `updateToolRadialGesture` | 22064 | function |  | 1 |
| `performToolRadialAction` | 22093 | function |  | 2 |
| `finishToolRadialGesture` | 22103 | function |  | 2 |
| `cancelToolRadialGesture` | 22112 | function |  | 5 |
| `duplicatePlacementTarget` | 22119 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 22146 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 22150 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 22160 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 22165 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 22177 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 22188 | function |  | 7 |
| `openProceduralDuplicateDialog` | 22196 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 22213 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 22234 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 22245 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 22251 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 22257 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 22290 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 22445 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 22547 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 22588 | function |  | 2 |
| `updateDuplicatePlacement` | 22615 | function |  | 2 |
| `beginDuplicatePlacement` | 22679 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 22743 | function |  | 2 |
| `confirmDuplicatePlacement` | 22784 | function |  | 1 |
| `cancelDuplicatePlacement` | 22821 | function |  | 4 |
| `outlinerClumpLocks` | 22847 | function |  | 11 |
| `handleOutlinerClumpDrop` | 22851 | function |  | 3 |
| `createOutlinerStrandButton` | 22874 | function |  | 4 |
| `createOutlinerCurveSurface` | 22960 | function |  | 2 |
| `createOutlinerClump` | 23056 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 23138 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 23145 | function |  | 2 |
| `renderLockList` | 23224 | function |  | 61 |
| `updateCount` | 23378 | function |  | 26 |
| `captureInputUndo` | 23387 | function |  | 1 |
| `bindUndoCapture` | 23393 | function |  | 37 |
| `bindLockInput` | 23404 | function |  | 2 |
| `applyValue` | 23421 | arrow |  | 2 |
| `applyUniformTransformScale` | 23740 | function |  | 2 |
| `applyReducedTransformScale` | 23757 | function |  | 2 |
| `applyTransformPrecision` | 23796 | function |  | 2 |
| `updateTransformScalePointer` | 23825 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 24827 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 24832 | function |  | 4 |
| `syncDrawCurlControls` | 24887 | function |  | 5 |
| `handleLiveSurfaceChange` | 24935 | function |  | 1 |
| `changePanelSplitCount` | 25084 | function |  | 3 |
| `applyPresetControl` | 25234 | function |  | 2 |
| `applyCreationToolSettings` | 25255 | function |  | 2 |
| `populateCreationPresetSelect` | 25299 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 25323 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 25356 | function |  | 5 |
| `createCustomCreationPreset` | 25364 | function |  | 3 |
| `createCustomClumpPreset` | 25379 | function |  | 3 |
| `commitCustomCreationPreset` | 25394 | function |  | 2 |
| `openRemoveCreationPreset` | 25455 | function |  | 3 |
| `commitRemoveCreationPreset` | 25468 | function |  | 1 |
| `applyBraidToolPreset` | 25485 | function |  | 2 |
| `selectedBranchChildLock` | 25597 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 25601 | function |  | 2 |
| `initPanelResizeHandles` | 25707 | function |  | 2 |
| `applyWidth` | 25713 | arrow |  | 2 |
| `restoreWidth` | 25720 | arrow |  | 2 |
| `bindResize` | 25728 | arrow |  | 2 |
| `onMove` | 25737 | arrow |  | 0 |
| `onUp` | 25741 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 25758 | function |  | 2 |
| `initFloatingPanelControls` | 25767 | function |  | 2 |
| `detach` | 25776 | arrow |  | 28 |
| `endDrag` | 25814 | arrow |  | 0 |
| `endResize` | 25846 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 25857 | function |  | 3 |
| `selectPatchNotesVersion` | 25991 | function |  | 3 |
| `requestReferenceImage` | 26024 | function |  | 5 |
| `toggleCapsuleGuideTool` | 26228 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 26234 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 26241 | function |  | 1 |
| `deleteLocks` | 26808 | function |  | 10 |
| `disposeCurveObjects` | 26886 | function |  | 4 |
| `beginTipSubBoneRotate` | 26972 | function |  | 2 |
| `applyTipSubBoneTransform` | 27002 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 27034 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 27159 | function |  | 1 |
| `endPanelSplitHandleDrag` | 27380 | function |  | 3 |
| `resize` | 27413 | function |  | 3 |
| `handleViewportPointerMove` | 27424 | function |  | 1 |
| `blockProportionalSizingEvent` | 27435 | function |  | 1 |
| `updateLightAngleFromInputs` | 27441 | function |  | 2 |
| `startViewSnap` | 27455 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 27485 | function |  | 3 |
| `trackViewportPointerDown` | 27502 | function |  | 1 |
| `trackViewportPointerMove` | 27518 | function |  | 1 |
| `clearViewportPointer` | 27526 | function |  | 1 |
| `updateViewSnap` | 27531 | function |  | 1 |
| `nearestCardinalAxis` | 27567 | function |  | 5 |
| `cardinalAxisKey` | 27581 | function |  | 5 |
| `steppedDragAmount` | 27585 | function |  | 3 |
| `snapCameraToCardinalAxis` | 27591 | function |  | 4 |
| `endViewSnap` | 27607 | function |  | 4 |
| `activateStrandControlPoint` | 27617 | function |  | 4 |
| `refreshStrandControlPointSelection` | 27667 | function |  | 4 |
| `addStrandControlPointSelection` | 27694 | function |  | 3 |
| `removeStrandControlPointSelection` | 27711 | function |  | 3 |
| `sampleStrandPointNormal` | 27725 | function |  | 2 |
| `sampleStrandPointVectors` | 27735 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 27741 | function |  | 2 |
| `resampleStrandCurveData` | 27752 | function |  | 4 |
| `resampleMatchingVectors` | 27758 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 27797 | function |  | 4 |
| `removeStrandCurvePoint` | 27808 | function |  | 2 |
| `closestStrandCurveParameter` | 27821 | function |  | 2 |
| `insertStrandCurvePoint` | 27850 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 27867 | function |  | 2 |
| `selectionModifierCursorAvailable` | 27877 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 27893 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 27900 | function |  | 4 |
| `prepareCurvePointSelection` | 27922 | function |  | 1 |
| `finishCurvePointInsertion` | 28033 | function |  | 1 |
| `finishPointRemoval` | 28048 | function |  | 1 |
| `editableStrandWidth` | 28066 | function |  | 6 |
| `editableStrandWidthBounds` | 28078 | function |  | 2 |
| `applyEditableStrandWidth` | 28084 | function |  | 3 |
| `viewportPixelPoint` | 28120 | function |  | 5 |
| `syncSculptBrushControls` | 28128 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 28143 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 28151 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 28159 | function |  | 1 |
| `sculptBrushPlaneOffset` | 28165 | function |  | 5 |
| `setSculptBrushCursorVisible` | 28169 | function |  | 6 |
| `updateSculptBrushCursor` | 28176 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 28198 | function |  | 4 |
| `sculptBrushEditableLock` | 28205 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 28215 | function |  | 5 |
| `sculptBrushLockViable` | 28221 | function |  | 5 |
| `sculptBrushUnits` | 28232 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 28270 | function |  | 4 |
| `sculptBrushPointWeight` | 28320 | function |  | 6 |
| `sculptBrushWorldDelta` | 28330 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 28339 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 28365 | function |  | 2 |
| `beginSculptMoveStroke` | 28423 | function |  | 1 |
| `isHairCreateTool` | 28485 | function |  | 4 |
| `syncStrandHoverOutline` | 28489 | function |  | 1 |
| `pointerOverTaperEditor` | 28502 | function |  | 3 |
| `updateStrandBrushHover` | 28509 | function |  | 1 |
| `updatePanelTipHover` | 28530 | function |  | 1 |
| `applySubBoneBrushSample` | 28560 | function |  | 2 |
| `applySculptMoveStrokeSample` | 28705 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 28943 | function |  | 3 |
| `updateSculptMoveStroke` | 28952 | function |  | 1 |
| `finishSculptMoveStroke` | 28968 | function |  | 3 |
| `strandControlPointHit` | 29016 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 29020 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 29098 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 29132 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 29172 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 29185 | function |  | 1 |
| `setHoveredControlPoint` | 29224 | function |  | 7 |
| `visibleControlPointHoverTargets` | 29237 | function |  | 2 |
| `updateControlPointHover` | 29273 | function |  | 1 |
| `animate` | 29888 | function |  | 2 |
| `syncCompactSidebarLayout` | 29919 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 29938 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 29944 | function |  | 3 |
| `setAttributeEditorTab` | 29950 | function |  | 6 |

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
