# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1804** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（30841 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 271 | function |  | 3 |
| `saveBooleanPreference` | 299 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 303 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 308 | function |  | 2 |
| `normalizeScaleSensitivity` | 313 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 318 | function |  | 2 |
| `normalizeSideNamingPerspective` | 323 | function |  | 2 |
| `normalizeNavigationStyle` | 327 | function |  | 2 |
| `setupEditableSliderControls` | 342 | function |  | 2 |
| `syncNumberFromRange` | 393 | arrow |  | 0 |
| `applyNumberValue` | 400 | arrow |  | 0 |
| `copyCameraPose` | 506 | function |  | 3 |
| `updateCameraProjectionForViewport` | 512 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 525 | function |  | 3 |
| `setOrthographicView` | 531 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 571 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 600 | function |  | 2 |
| `removeRotateFreeAxisRing` | 626 | function |  | 2 |
| `deflateTransformGizmoPickers` | 638 | function |  | 2 |
| `nextStrandName` | 1033 | function |  | 2 |
| `activeDrawClumpTemplate` | 1118 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1123 | function |  | 3 |
| `drawModeCreatesClump` | 1150 | function |  | 1 |
| `isPanelGeometry` | 1294 | function |  | 51 |
| `normalizePanelSplits` | 1298 | function |  | 3 |
| `clonePanelSplits` | 1310 | function |  | 32 |
| `snapPanelSplitHeight` | 1314 | function |  | 5 |
| `createQuadSphereGeometry` | 1349 | function |  | 2 |
| `vertexIndex` | 1363 | function |  | 11 |
| `addEdge` | 1381 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1541 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1721 | function |  | 2 |
| `currentStrandSelectionState` | 1783 | function |  | 4 |
| `applyStrandSelectionState` | 1787 | function |  | 5 |
| `clearStrandSelectionState` | 1792 | function |  | 6 |
| `disposeGuideModel` | 2844 | function |  | 3 |
| `syncHeadTransformInputs` | 2855 | function |  | 3 |
| `applyHeadTransform` | 2862 | function |  | 4 |
| `resetHeadTransform` | 2882 | function |  | 2 |
| `installGuideModel` | 2897 | function |  | 5 |
| `loadDefaultGuideModel` | 2973 | function |  | 3 |
| `braidTemplateFromEntries` | 2996 | function |  | 4 |
| `braidMeshEntries` | 3028 | function |  | 2 |
| `prepareBraidBodyCache` | 3040 | function |  | 2 |
| `quantize` | 3049 | arrow |  | 21 |
| `sourceNormalAt` | 3061 | arrow |  | 1 |
| `clusterBoundary` | 3064 | arrow |  | 2 |
| `normalBuckets` | 3081 | arrow |  | 2 |
| `applyBucketPair` | 3113 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3144 | function |  | 2 |
| `annotateBraidObjTopology` | 3165 | function |  | 2 |
| `loadBraidMeshPreset` | 3185 | function |  | 3 |
| `createSplitControlHandle` | 3202 | function |  | 6 |
| `frameGuideModel` | 3217 | function |  | 2 |
| `normalizeHairLayer` | 3246 | function |  | 26 |
| `layerOffsetForLock` | 3250 | function |  | 8 |
| `layerRootOffsetFactor` | 3255 | function |  | 12 |
| `layerOffsetWeight` | 3259 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3265 | function |  | 5 |
| `pointsWithLayerOffset` | 3274 | function |  | 3 |
| `layerDirectionForLock` | 3282 | function |  | 2 |
| `applyLayerOffset` | 3293 | function |  | 5 |
| `setLockHairLayer` | 3317 | function |  | 2 |
| `setGroupLayerOffset` | 3332 | function |  | 2 |
| `quadraticWeights` | 3360 | function |  | 1 |
| `setHeadReferenceTransparency` | 3371 | function |  | 4 |
| `trianglePlaneIntersections` | 3383 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3404 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3613 | function |  | 1 |
| `upperContourCurve` | 3630 | function |  | 2 |
| `hermitePoint` | 3665 | function |  | 2 |
| `curveNetworkSection` | 3676 | function |  | 1 |
| `pointAlongSection` | 3705 | function |  | 1 |
| `longestStitchedContour` | 3711 | function |  | 2 |
| `nodeForPoint` | 3719 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3776 | function |  | 1 |
| `exitSetupEditors` | 3796 | function |  | 6 |
| `syncAppMenuVisibility` | 3806 | function |  | 3 |
| `closeAppMenus` | 3812 | function |  | 6 |
| `setAppMenuOpen` | 3823 | function |  | 2 |
| `setTurntableActive` | 3830 | function |  | 3 |
| `selectedReferenceImage` | 3840 | function |  | 20 |
| `normalizeReferenceCrop` | 3846 | function |  | 8 |
| `referenceCropIsFull` | 3854 | function |  | 3 |
| `referencePlaneFrontAxis` | 3859 | function |  | 4 |
| `referencePlanePlacement` | 3868 | function |  | 4 |
| `migratedReferencePlanePosition` | 3883 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3903 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3920 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3936 | function |  | 2 |
| `snappedReferenceImageView` | 3959 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3965 | function |  | 5 |
| `applyReferenceImageRuntime` | 3981 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4024 | function |  | 6 |
| `createReferenceImageRuntime` | 4032 | function |  | 3 |
| `addReferenceImage` | 4101 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4153 | function |  | 3 |
| `disposeReferenceImage` | 4172 | function |  | 2 |
| `clearReferenceImages` | 4176 | function |  | 2 |
| `serializeReferenceImage` | 4183 | function |  | 1 |
| `setReferenceImageType` | 4211 | function |  | 2 |
| `attachReferenceImageTransform` | 4255 | function |  | 6 |
| `selectReferenceImage` | 4269 | function |  | 12 |
| `placeReferencePlane` | 4292 | function |  | 2 |
| `setReferencePlaneInFront` | 4303 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4313 | function |  | 4 |
| `renderReferenceImagePanel` | 4332 | function |  | 20 |
| `setOutlinerTab` | 4379 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4397 | function |  | 4 |
| `componentEditModeActive` | 4401 | function |  | 30 |
| `selectionToolSupportsPicking` | 4405 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4410 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4426 | function |  | 2 |
| `setViewportSelectionMode` | 4456 | function |  | 4 |
| `setViewportEditMode` | 4468 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4510 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4524 | function |  | 8 |
| `normalizeOutlinerName` | 4538 | function |  | 3 |
| `beginOutlinerRename` | 4543 | function |  | 2 |
| `finish` | 4554 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4584 | function |  | 6 |
| `referenceOutlinerGroup` | 4596 | function |  | 2 |
| `renderReferenceOutliner` | 4600 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4717 | function |  | 5 |
| `readReferenceImageFile` | 4722 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4746 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4753 | function |  | 3 |
| `dragContainsReferenceImage` | 4798 | function |  | 3 |
| `setReferenceImageDragActive` | 4809 | function |  | 9 |
| `referenceDropDestination` | 4817 | function |  | 2 |
| `viewportOverlayDropPosition` | 4823 | function |  | 2 |
| `setReferenceDropHover` | 4832 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4850 | function |  | 2 |
| `referenceOverlayAtPointer` | 4870 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4888 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4901 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4947 | function |  | 1 |
| `finishReferenceOverlayDrag` | 4997 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5019 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5030 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5056 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5065 | function |  | 2 |
| `referenceCropCursor` | 5080 | function |  | 3 |
| `updateReferenceCropHandles` | 5086 | function |  | 5 |
| `referenceCropSourcePoint` | 5107 | function |  | 2 |
| `beginReferenceCrop` | 5114 | function |  | 1 |
| `updateReferenceCrop` | 5152 | function |  | 1 |
| `finishReferenceCrop` | 5184 | function |  | 4 |
| `setHeadSetupEditing` | 5202 | function |  | 6 |
| `strandPassesDisplayFilters` | 5228 | function |  | 4 |
| `strandVisibleForDisplay` | 5237 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 5242 | function |  | 3 |
| `lockedStrandsExist` | 5246 | function |  | 3 |
| `hiddenStrandsExist` | 5250 | function |  | 2 |
| `hideSelectedStrands` | 5254 | function |  | 2 |
| `unhideHiddenStrands` | 5264 | function |  | 2 |
| `strandIsolationActive` | 5273 | function |  | 7 |
| `setStrandIsolation` | 5277 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5289 | function |  | 3 |
| `syncVisibilityParent` | 5300 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5307 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5336 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5343 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5366 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5584 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5605 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5624 | function |  | 2 |
| `selectedViewportFocusBounds` | 5722 | function |  | 2 |
| `frameViewportBounds` | 5736 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5766 | function |  | 2 |
| `fullSceneFocusBounds` | 5770 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5785 | function |  | 3 |
| `cycleViewportFraming` | 5794 | function |  | 2 |
| `sculptBrushToolActive` | 5814 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 5818 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5822 | function |  | 3 |
| `effectiveSculptBrushTool` | 5826 | function |  | 15 |
| `updateSculptScaleModeRow` | 5832 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5837 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5859 | function |  | 5 |
| `setActiveTool` | 5868 | function |  | 13 |
| `setDrawStrandMode` | 6006 | function |  | 2 |
| `setObjectSpaceEditing` | 6016 | function |  | 7 |
| `setHierarchyEditing` | 6032 | function |  | 4 |
| `setProportionalEditing` | 6044 | function |  | 5 |
| `beginProportionalSizeEdit` | 6063 | function |  | 3 |
| `updateProportionalSizeEdit` | 6075 | function |  | 2 |
| `endProportionalSizeEdit` | 6086 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6093 | function |  | 2 |
| `refreshProportionalPreview` | 6101 | function |  | 4 |
| `activeBrushSizeInput` | 6111 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6120 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6132 | function |  | 2 |
| `beginBrushSizeDrag` | 6150 | function |  | 1 |
| `updateBrushSizeDrag` | 6177 | function |  | 1 |
| `finishBrushSizeDrag` | 6198 | function |  | 2 |
| `updateInteractionLocks` | 6215 | function |  | 66 |
| `configureTransformControls` | 6226 | function |  | 13 |
| `pullMoveActive` | 6234 | function |  | 9 |
| `updatePullGuideVisual` | 6238 | function |  | 4 |
| `attachTransformForCurvePoint` | 6254 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6278 | function |  | 6 |
| `strandObjectRootIndex` | 6294 | function |  | 3 |
| `strandObjectRoot` | 6303 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6307 | function |  | 2 |
| `attachStrandObjectTransform` | 6312 | function |  | 6 |
| `guideObjectPivot` | 6335 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6346 | function |  | 2 |
| `attachGuideObjectTransform` | 6351 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6370 | function |  | 2 |
| `beginGuideObjectTransform` | 6398 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6405 | function |  | 2 |
| `updateGuideObjectTransform` | 6427 | function |  | 2 |
| `finishGuideObjectTransform` | 6460 | function |  | 2 |
| `clonePlacementFrame` | 6469 | function |  | 2 |
| `cloneOptionalVectors` | 6481 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6485 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6502 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6517 | function |  | 2 |
| `strandObjectTransformOperators` | 6533 | function |  | 4 |
| `transformPoint` | 6541 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6548 | arrow |  | 0 |
| `transformNormal` | 6554 | arrow |  | 10 |
| `transformDirection` | 6564 | arrow |  | 5 |
| `worldMatrixForPivot` | 6576 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6582 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6598 | function |  | 6 |
| `beginStrandObjectTransform` | 6624 | function |  | 2 |
| `updateStrandObjectTransform` | 6662 | function |  | 2 |
| `commitStrandObjectTransform` | 6720 | function |  | 2 |
| `mapPoints` | 6733 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6767 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6781 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6804 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6817 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6832 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6858 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6907 | function |  | 2 |
| `beginHandleEdit` | 6916 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6969 | function |  | 3 |
| `multiPointHandleEditActive` | 6980 | function |  | 7 |
| `applyMultiMove` | 6984 | function |  | 5 |
| `applyMultiRotate` | 6990 | function |  | 2 |
| `applyMultiScale` | 6999 | function |  | 2 |
| `applyHierarchicalMove` | 7008 | function |  | 3 |
| `applySingleMove` | 7020 | function |  | 5 |
| `applySurfaceLatticeMirror` | 7024 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 7041 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 7050 | function |  | 3 |
| `changed` | 7060 | arrow |  | 1 |
| `applyPullMove` | 7102 | function |  | 3 |
| `pullHeadCollisionContext` | 7110 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7129 | function |  | 2 |
| `applyProportionalMove` | 7152 | function |  | 3 |
| `viewPlaneNormal` | 7163 | function |  | 12 |
| `isCameraInSnappedView` | 7167 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7175 | function |  | 9 |
| `updateViewPlaneGrid` | 7179 | function |  | 14 |
| `setViewPlaneMove` | 7236 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7247 | function |  | 2 |
| `rayFromViewportEvent` | 7255 | function |  | 13 |
| `worldUnitsPerViewportPixel` | 7263 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7273 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7284 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7297 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7316 | function |  | 4 |
| `beginViewPlaneMove` | 7323 | function |  | 3 |
| `updateViewPlaneMove` | 7387 | function |  | 1 |
| `endViewPlaneMove` | 7452 | function |  | 7 |
| `applyHierarchicalRotate` | 7471 | function |  | 2 |
| `rotateGuideNormal` | 7478 | arrow |  | 4 |
| `applySingleRotate` | 7516 | function |  | 2 |
| `applyProportionalRotate` | 7520 | function |  | 2 |
| `applyHierarchicalScale` | 7540 | function |  | 2 |
| `applySingleScale` | 7550 | function |  | 2 |
| `applyProportionalScale` | 7554 | function |  | 2 |
| `setPointScale` | 7570 | function |  | 8 |
| `proportionalWeight` | 7579 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7591 | function |  | 5 |
| `strandInfluenceColor` | 7597 | function |  | 12 |
| `beginRelaxEdit` | 7622 | function |  | 3 |
| `updateRelaxEdit` | 7651 | function |  | 1 |
| `endRelaxEdit` | 7711 | function |  | 1 |
| `disposeGuide` | 7721 | function |  | 3 |
| `removeGuideObjects` | 7749 | function |  | 3 |
| `strandRadiusAt` | 7763 | function |  | 5 |
| `strandProfileTopologyAt` | 7780 | function |  | 5 |
| `strandCurveParameters` | 7822 | function |  | 3 |
| `widthProfileAt` | 7832 | arrow |  | 1 |
| `braidFrameAt` | 7870 | function |  | 5 |
| `braidFrameAtExtended` | 7880 | function |  | 2 |
| `createBraidProfileProjector` | 7889 | function |  | 2 |
| `project` | 7905 | arrow |  | 21 |
| `createBraidGeometry` | 7920 | function |  | 2 |
| `deformationAt` | 7955 | function |  | 3 |
| `widthFor` | 7964 | arrow |  | 3 |
| `depthFor` | 7968 | arrow |  | 3 |
| `outputVertex` | 8000 | function |  | 7 |
| `appendAuthoredCap` | 8108 | function |  | 3 |
| `outputCapVertex` | 8115 | arrow |  | 6 |
| `capBoundary` | 8206 | function |  | 3 |
| `strandGeometryCurve` | 8268 | function |  | 13 |
| `strandGeometryFrameAt` | 8294 | function |  | 14 |
| `transportedStrandFrameAt` | 8357 | function |  | 6 |
| `twistOverrideAt` | 8360 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 8388 | function |  | 2 |
| `weldPanelGeometryData` | 8424 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 8470 | function |  | 3 |
| `surfacePanelPoint` | 8485 | function |  | 3 |
| `splitForkT` | 8508 | function |  | 3 |
| `tipWidthSideForkT` | 8521 | function |  | 7 |
| `tipSegmentWeightAt` | 8532 | function |  | 2 |
| `tipWidthControlTs` | 8551 | function |  | 4 |
| `tipWidthCommonForkT` | 8562 | function |  | 4 |
| `tipWidthResetCurve` | 8570 | function |  | 3 |
| `tipWidthSpreadGap` | 8588 | function |  | 4 |
| `tipWidthMultiplierAt` | 8605 | function |  | 8 |
| `tipPanelWidthAt` | 8644 | function |  | 7 |
| `buildTipWidthCurve` | 8650 | function |  | 5 |
| `addPoint` | 8660 | arrow |  | 3 |
| `setTipWidthCurveValue` | 8691 | function |  | 4 |
| `tipPanelFrameAt` | 8710 | function |  | 4 |
| `tipMainSectionPoint` | 8744 | function |  | 4 |
| `tipSurfaceFrameAt` | 8792 | function |  | 3 |
| `tipChainFrameAt` | 8823 | function |  | 4 |
| `tipWidthEdgePosition` | 8854 | function |  | 4 |
| `tipWidthEdgePoints` | 8885 | function |  | 2 |
| `tipWidthControlPlacement` | 8900 | function |  | 3 |
| `tipHighlightMaterial` | 8916 | function |  | 2 |
| `updateTipHighlight` | 8938 | function |  | 4 |
| `splitTipForSegment` | 8995 | function |  | 9 |
| `createPanelStrandGeometry` | 9038 | function |  | 2 |
| `segmentWeightAt` | 9069 | arrow |  | 1 |
| `addQuad` | 9085 | arrow |  | 6 |
| `near` | 9089 | arrow |  | 6 |
| `panelWidthAt` | 9119 | arrow |  | 6 |
| `panelThicknessAt` | 9124 | arrow |  | 6 |
| `panelFrameAt` | 9133 | arrow |  | 1 |
| `rawPanelPoint` | 9151 | arrow |  | 1 |
| `panelPoint` | 9185 | arrow |  | 3 |
| `addPatch` | 9193 | arrow |  | 1 |
| `uStart` | 9324 | arrow |  | 1 |
| `uEnd` | 9327 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 9366 | function |  | 3 |
| `inside` | 9367 | arrow |  | 2 |
| `pushOrientedTriangle` | 9389 | function |  | 7 |
| `triangulatePolygon3D` | 9400 | function |  | 1 |
| `orientedQuadFace` | 9450 | function |  | 2 |
| `createSplitStrandGeometry` | 9458 | function |  | 2 |
| `fusedIndexAt` | 9615 | arrow |  | 0 |
| `createHairCardGeometry` | 9664 | function |  | 2 |
| `createPolyGeometry` | 9763 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 9790 | function |  | 4 |
| `createCompoundStrandGeometry` | 9873 | function |  | 2 |
| `proceduralBranchGeometryLock` | 10124 | function |  | 2 |
| `createHairGeometry` | 10169 | function |  | 5 |
| `createBaseHairGeometry` | 10221 | function |  | 3 |
| `hairMaterialDefinition` | 10306 | function |  | 4 |
| `materialForLock` | 10310 | function |  | 8 |
| `activeHairMaterialDefinition` | 10314 | function |  | 11 |
| `strandDisplayColor` | 10320 | function |  | 14 |
| `setAnimeHairBaseColor` | 10338 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 10351 | function |  | 2 |
| `createHairMaterial` | 10391 | function |  | 5 |
| `createStrandSelectionOutline` | 10433 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 10468 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 10477 | function |  | 6 |
| `refreshMaterialUsers` | 10504 | function |  | 6 |
| `renderHairMaterialOutliner` | 10513 | function |  | 5 |
| `renderHairMaterialOptions` | 10543 | function |  | 3 |
| `syncHairMaterialEditor` | 10553 | function |  | 9 |
| `createProjectHairMaterial` | 10579 | function |  | 3 |
| `deleteActiveHairMaterial` | 10599 | function |  | 2 |
| `createHairTopologyGeometry` | 10617 | function |  | 4 |
| `createHairTopologyOverlay` | 10638 | function |  | 3 |
| `groupDefaultsFor` | 10685 | function |  | 9 |
| `creationToolActive` | 10692 | function |  | 7 |
| `activeCreationShapeDefaults` | 10696 | function |  | 9 |
| `activeStrandShapeTarget` | 10702 | function |  | 8 |
| `curvePolylineLength` | 10706 | function |  | 2 |
| `curvePolylineLengths` | 10714 | function |  | 3 |
| `samplePolylineDistance` | 10722 | function |  | 2 |
| `applyProjectedCurveLength` | 10732 | function |  | 4 |
| `clearRegionLengthBaseline` | 10763 | function |  | 2 |
| `ensureRegionLengthBaseline` | 10770 | function |  | 2 |
| `setGroupLengthScale` | 10778 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 10816 | function |  | 4 |
| `requestGroupDefaultsWarning` | 10848 | function |  | 1 |
| `activeProfileOffset` | 10860 | function |  | 3 |
| `profileToCanvas` | 10868 | function |  | 1 |
| `renderProfilePreview` | 10875 | function |  | 7 |
| `renderHairCardCoveragePath` | 10894 | function |  | 2 |
| `activeTaperTarget` | 10909 | function |  | 20 |
| `activeTaperCurve` | 10964 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 10975 | function |  | 7 |
| `taperSamples` | 10985 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 10992 | function |  | 2 |
| `renderTaperPreview` | 11014 | function |  | 17 |
| `shapeTargetForSelect` | 11053 | function |  | 3 |
| `setupShapePresetControls` | 11063 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 11088 | function |  | 3 |
| `syncShapePresetSelects` | 11094 | function |  | 6 |
| `populateShapePresetSelects` | 11115 | function |  | 5 |
| `openSaveShapePreset` | 11143 | function |  | 2 |
| `commitCustomShapePreset` | 11168 | function |  | 2 |
| `openRemoveShapePreset` | 11191 | function |  | 2 |
| `commitRemoveShapePreset` | 11204 | function |  | 2 |
| `taperPointToCanvas` | 11220 | function |  | 4 |
| `canvasToTaperPoint` | 11237 | function |  | 2 |
| `clearTaperMeshPoints` | 11273 | function |  | 2 |
| `taperMeshPointFrame` | 11283 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 11296 | function |  | 4 |
| `updateTaperMeshPoints` | 11333 | function |  | 5 |
| `setTaperMeshPointsVisible` | 11412 | function |  | 6 |
| `renderTaperCurveEditor` | 11430 | function |  | 13 |
| `tipSideForkFor` | 11443 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 11522 | function |  | 4 |
| `retargetOpenTaperCurveEditor` | 11536 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 11552 | function |  | 2 |
| `scheduleTaperCurveEdit` | 11584 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 11593 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 11604 | function |  | 2 |
| `applyTaperCurveEdit` | 11612 | function |  | 10 |
| `openTaperCurveEditor` | 11738 | function |  | 3 |
| `openPanelSegmentCurveEditor` | 11783 | function |  | 3 |
| `closeTaperCurveEditor` | 11819 | function |  | 4 |
| `updateViewportStatsVisibility` | 11832 | function |  | 5 |
| `canvasToProfile` | 11851 | function |  | 2 |
| `retargetFloatingStrandEditors` | 11865 | function |  | 2 |
| `addLock` | 11880 | function |  | 16 |
| `mirroredVector` | 12092 | function |  | 12 |
| `mirroredPlacementFrame` | 12096 | function |  | 2 |
| `mirrorPartnerFor` | 12109 | function |  | 40 |
| `decoupleMirrorPartner` | 12113 | function |  | 2 |
| `createMirrorPartner` | 12121 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 12217 | function |  | 6 |
| `mirroredClumpPartners` | 12222 | function |  | 6 |
| `createMirroredClump` | 12228 | function |  | 3 |
| `decoupleMirroredClump` | 12250 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 12270 | function |  | 6 |
| `syncActiveMirror` | 12437 | function |  | 30 |
| `setMirrorXEditing` | 12449 | function |  | 5 |
| `snapshotState` | 12473 | function |  | 7 |
| `rootAttachmentFrame` | 12734 | function |  | 3 |
| `rootAttachmentLocalFrame` | 12746 | function |  | 4 |
| `resolveRootAttachment` | 12764 | function |  | 4 |
| `curvePointsToRootLocal` | 12804 | function |  | 2 |
| `curvePointsFromRootLocal` | 12816 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 12824 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 12840 | function |  | 2 |
| `createRootAttachment` | 12871 | function |  | 7 |
| `syncRootAttachmentMetadata` | 12901 | function |  | 3 |
| `rootAttachmentToData` | 12928 | function |  | 2 |
| `rootAttachmentFromData` | 12956 | function |  | 3 |
| `importHeadMeshFile` | 12998 | function |  | 3 |
| `importFullBodyMeshFile` | 13021 | function |  | 3 |
| `downloadPreferencesAndPresets` | 13046 | function |  | 1 |
| `importedBooleanPreference` | 13079 | function |  | 11 |
| `loadPreferencesAndPresets` | 13093 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 13163 | function |  | 1 |
| `openHairProjectFile` | 13207 | function |  | 4 |
| `dragContainsApplicationFile` | 13265 | function |  | 3 |
| `safelyRememberRecentProject` | 13274 | function |  | 2 |
| `renderRecentProjectsMenu` | 13283 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 13315 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 13340 | function |  | 2 |
| `confirmDroppedApplicationFile` | 13344 | function |  | 2 |
| `pushUndoState` | 13360 | function |  | 99 |
| `undoLastAction` | 13367 | function |  | 2 |
| `redoLastAction` | 13384 | function |  | 2 |
| `updateHistoryButtons` | 13401 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 13406 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 13426 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 13433 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 13472 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 13498 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 13530 | function |  | 2 |
| `finalizeStateRestore` | 13571 | function |  | 2 |
| `restoreState` | 13578 | function |  | 5 |
| `disposeAllEditableObjects` | 13602 | function |  | 2 |
| `restoreLock` | 13623 | function |  | 4 |
| `restoreGuide` | 13847 | function |  | 2 |
| `vectorToData` | 13908 | function |  | 25 |
| `dataToVector` | 13912 | function |  | 22 |
| `frameToData` | 13916 | function |  | 2 |
| `frameFromData` | 13928 | function |  | 2 |
| `applyPresetSelection` | 13940 | function |  | 2 |
| `drawPresetThumbnail` | 13971 | function |  | 1 |
| `fillHair` | 13986 | arrow |  | 9 |
| `strand` | 13998 | arrow |  | 31 |
| `bun` | 14016 | arrow |  | 2 |
| `braid` | 14051 | arrow |  | 2 |
| `renderPresetLibrary` | 14140 | function |  | 3 |
| `setPresetLibraryOpen` | 14199 | function |  | 6 |
| `average` | 14212 | function |  | 4 |
| `fitPointAttributes` | 14216 | function |  | 7 |
| `rebuildCurveObjects` | 14245 | function |  | 9 |
| `createCurvePoints` | 14257 | function |  | 2 |
| `addGeneratedBangPreset` | 14266 | function |  | 1 |
| `createLongLayeredCurlPoints` | 14360 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 14409 | function |  | 1 |
| `columns` | 14410 | arrow |  | 1 |
| `layer` | 14414 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 14628 | function |  | 2 |
| `addBraidedBobPreset` | 14664 | function |  | 1 |
| `evenColumns` | 14665 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 14881 | function |  | 1 |
| `scalpSeed` | 14904 | arrow |  | 1 |
| `createBowlCutPoints` | 15191 | function |  | 2 |
| `addBowlCutPreset` | 15229 | function |  | 1 |
| `selectedCurveLatticeGuide` | 15297 | function |  | 10 |
| `braidStrokeActive` | 15304 | function |  | 8 |
| `proceduralDrawActive` | 15308 | function |  | 3 |
| `panelStrokeActive` | 15312 | function |  | 5 |
| `activeStrokeSurfaceInput` | 15316 | function |  | 4 |
| `activeStrokeSurfaceValue` | 15320 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 15324 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 15330 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 15334 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 15338 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 15342 | function |  | 3 |
| `liveSurfaceStrandId` | 15352 | function |  | 4 |
| `liveSurfaceStrand` | 15356 | function |  | 2 |
| `liveSurfaceGuideId` | 15361 | function |  | 3 |
| `guideSupportsLiveSurface` | 15365 | function |  | 2 |
| `liveSurfaceGuide` | 15372 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 15379 | function |  | 10 |
| `activeStrokeBrushSize` | 15420 | function |  | 10 |
| `activeStrokeBrushDepth` | 15426 | function |  | 5 |
| `strokeSurfaceIsContextual` | 15432 | function |  | 3 |
| `contextualPlaneAtOrigin` | 15440 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 15450 | function |  | 7 |
| `worldNormalAtHit` | 15489 | function |  | 4 |
| `drawSampleFromHit` | 15498 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 15512 | function |  | 3 |
| `strokeLength` | 15549 | function |  | 8 |
| `resampleDrawStroke` | 15555 | function |  | 2 |
| `processedDrawStroke` | 15587 | function |  | 6 |
| `strokeSurfaceNormals` | 15616 | function |  | 6 |
| `drawClumpFrame` | 15627 | function |  | 4 |
| `nearestCurveParameter` | 15636 | function |  | 2 |
| `drawClumpSampleNormal` | 15650 | function |  | 5 |
| `drawClumpTemplateVector` | 15659 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 15665 | function |  | 3 |
| `drawClumpStrandMaps` | 15681 | function |  | 4 |
| `nextClumpName` | 15736 | function |  | 6 |
| `initializeClumpShape` | 15743 | function |  | 5 |
| `stableClumpVariation` | 15754 | function |  | 3 |
| `createClumpFromLocks` | 15766 | function |  | 7 |
| `addLockToClump` | 15791 | function |  | 4 |
| `pointerToNdc` | 15847 | function |  | 1 |
| `gridProfileSkipCol` | 15863 | function |  | 3 |
| `clumpDirectMembers` | 15887 | function |  | 3 |
| `clumpMembersForGuide` | 15892 | function |  | 6 |
| `clumpGuideForLock` | 15896 | function |  | 13 |
| `proceduralGuideForLock` | 15901 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 15908 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 15915 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 15922 | function |  | 3 |
| `proceduralBranchWorldPoints` | 15934 | function |  | 2 |
| `applyProceduralBranchSettings` | 15947 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 15986 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 16002 | function |  | 3 |
| `createProceduralAccessoryLock` | 16016 | function |  | 2 |
| `applyProceduralAccessorySettings` | 16068 | function |  | 2 |
| `clumpFrameAt` | 16119 | function |  | 5 |
| `commitClumpMemberRestState` | 16127 | function |  | 10 |
| `updateClumpMembers` | 16210 | function |  | 10 |
| `dissolveClump` | 16314 | function |  | 6 |
| `detachLockFromClump` | 16351 | function |  | 4 |
| `updateDrawVolumePreview` | 16377 | function |  | 5 |
| `hideDrawClumpPreviews` | 16401 | function |  | 5 |
| `resetDrawVolumePreview` | 16407 | function |  | 3 |
| `updateDrawStrandPreview` | 16413 | function |  | 23 |
| `continueFromTipEnabled` | 16634 | function |  | 2 |
| `selectedTipContinuationLock` | 16640 | function |  | 3 |
| `beginDrawStrandStroke` | 16655 | function |  | 2 |
| `beginDrawFreePlane` | 16784 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 16798 | function |  | 2 |
| `updateDrawStrandStroke` | 16823 | function |  | 1 |
| `createDrawnLock` | 16869 | function |  | 3 |
| `setting` | 16873 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 16941 | function |  | 4 |
| `createDrawnBraid` | 16949 | function |  | 2 |
| `createDrawnStrand` | 17006 | function |  | 2 |
| `createDrawnPanel` | 17133 | function |  | 2 |
| `extendDrawnStrand` | 17185 | function |  | 2 |
| `finishDrawStrandStroke` | 17218 | function |  | 6 |
| `createPlacedStrand` | 17245 | function |  | 2 |
| `placedPointCount` | 17309 | function |  | 3 |
| `createPlacedPoints` | 17313 | function |  | 3 |
| `pushPointOutsideHead` | 17332 | function |  | 8 |
| `resizePlacedStrand` | 17364 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 17381 | function |  | 5 |
| `beginPlaceEdit` | 17386 | function |  | 2 |
| `updatePlaceEdit` | 17404 | function |  | 1 |
| `updatePlacementLength` | 17418 | function |  | 3 |
| `updatePlacementOrientation` | 17428 | function |  | 3 |
| `endPlaceEdit` | 17446 | function |  | 1 |
| `confirmPendingPlacedStrand` | 17461 | function |  | 1 |
| `pendingPlacedLock` | 17471 | function |  | 2 |
| `beginPlacementPointer` | 17475 | function |  | 3 |
| `finishPlacementPointer` | 17485 | function |  | 2 |
| `confirmPlacementStep` | 17509 | function |  | 2 |
| `finishPlacementFlow` | 17532 | function |  | 6 |
| `updatePlacementStatus` | 17545 | function |  | 53 |
| `deselectStrands` | 17684 | function |  | 11 |
| `beginSelectionMarquee` | 17699 | function |  | 3 |
| `beginAltOrbit` | 17723 | function |  | 1 |
| `beginBlenderNavigation` | 17735 | function |  | 1 |
| `endBlenderNavigation` | 17780 | function |  | 1 |
| `prepareSelectPointerCapture` | 17788 | function |  | 1 |
| `endSelectPointerCapture` | 17794 | function |  | 1 |
| `applyAltClickCandidate` | 17800 | function |  | 2 |
| `finishBrushAltClick` | 17826 | function |  | 1 |
| `endAltOrbit` | 17839 | function |  | 2 |
| `dollyCameraByDrag` | 17846 | function |  | 2 |
| `fastDragMagnitude` | 17869 | function |  | 2 |
| `beginHoudiniZoomDrag` | 17875 | function |  | 1 |
| `updateHoudiniZoomDrag` | 17883 | function |  | 1 |
| `endHoudiniZoomDrag` | 17900 | function |  | 1 |
| `updateSelectionMarquee` | 17908 | function |  | 1 |
| `pointInsideSelectionMarquee` | 17925 | function |  | 3 |
| `selectPointsInMarquee` | 17933 | function |  | 2 |
| `pointKey` | 17959 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 17990 | function |  | 2 |
| `objectInsideSelectionMarquee` | 18027 | function |  | 3 |
| `projectedPoint` | 18044 | arrow |  | 1 |
| `selectObjectsInMarquee` | 18073 | function |  | 2 |
| `finishSelectionMarquee` | 18118 | function |  | 2 |
| `headMeshes` | 18141 | function |  | 6 |
| `strandSplitProfileData` | 18149 | function |  | 4 |
| `strandSplitControlPoint` | 18162 | function |  | 4 |
| `panelSplitControlPoint` | 18198 | function |  | 8 |
| `strandControlPointRaycast` | 18255 | function |  | 1 |
| `strandControlPointFrame` | 18290 | function |  | 4 |
| `strandControlPointHitFromEvent` | 18322 | function |  | 4 |
| `createCurveObjects` | 18380 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 18642 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 18649 | function |  | 2 |
| `strandWidthEdgeSample` | 18658 | function |  | 3 |
| `strandWidthEdgePoints` | 18681 | function |  | 2 |
| `sculptBrushDebugRaycast` | 18695 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 18699 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 18706 | function |  | 3 |
| `refreshSculptBrushDebugView` | 18718 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 18723 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 18729 | function |  | 3 |
| `updateCurveObjects` | 18743 | function |  | 40 |
| `syncTipNormalArrow` | 18985 | arrow |  | 4 |
| `createCurveNormalIndicator` | 19198 | function |  | 3 |
| `pointUpDirection` | 19224 | function |  | 2 |
| `curveFrameAtPoint` | 19228 | function |  | 4 |
| `curveFrameAt` | 19249 | function |  | 4 |
| `strandTwistAt` | 19269 | function |  | 6 |
| `controlPointRotationAt` | 19274 | function |  | 4 |
| `strandProfileTwistAt` | 19278 | function |  | 2 |
| `strandFrameAt` | 19284 | function |  | 2 |
| `curveFrameAtSnapshot` | 19290 | function |  | 3 |
| `outwardNormalAtPoint` | 19309 | function |  | 11 |
| `sampledSurfaceNormal` | 19321 | function |  | 2 |
| `guidedNormalAt` | 19337 | function |  | 6 |
| `twistFromHandle` | 19356 | function |  | 3 |
| `signedAngleAroundAxis` | 19377 | function |  | 6 |
| `handleColor` | 19384 | function |  | 2 |
| `isAffectedCurvePoint` | 19407 | function |  | 2 |
| `syncLockFromCurve` | 19413 | function |  | 24 |
| `labelForPreset` | 19443 | function |  | 1 |
| `rebuildLockGeometry` | 19447 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 19474 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 19482 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 19488 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 19510 | function |  | 8 |
| `updateLockGeometry` | 19523 | function |  | 58 |
| `setGroupColorView` | 19544 | function |  | 2 |
| `createUvCheckerTexture` | 19554 | function |  | 3 |
| `ensureUvCheckerForLock` | 19590 | function |  | 4 |
| `removeUvCheckerFromLock` | 19623 | function |  | 3 |
| `invalidateUvInspector` | 19638 | function |  | 7 |
| `uvInspectorRecord` | 19642 | function |  | 1 |
| `uvInspectorRecords` | 19681 | function |  | 2 |
| `drawUvInspectorGrid` | 19685 | function |  | 2 |
| `renderUvInspector` | 19719 | function |  | 3 |
| `setUvCheckerEnabled` | 19778 | function |  | 3 |
| `strandViewportBaseColor` | 19795 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 19830 | function |  | 3 |
| `syncStrandSelectionOutline` | 19836 | function |  | 2 |
| `applyLockedStrandPalette` | 19847 | function |  | 2 |
| `syncLockedStrandWireVisual` | 19856 | function |  | 6 |
| `setStrandSelectionVisual` | 19865 | function |  | 5 |
| `proceduralParentOutlineVisible` | 19881 | function |  | 2 |
| `syncProceduralParentVisibility` | 19888 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 19897 | function |  | 2 |
| `updateStrandSelectionHighlight` | 19901 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 19905 | function |  | 2 |
| `resetGuideSelectionVisuals` | 19918 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 19938 | function |  | 3 |
| `selectLock` | 19971 | function |  | 43 |
| `deselectStrandsForGuideEditor` | 20033 | function |  | 2 |
| `syncGroupInputs` | 20044 | function |  | 2 |
| `topologyStatsForLock` | 20077 | function |  | 4 |
| `formatTopologyStats` | 20085 | function |  | 5 |
| `updateTopologyStats` | 20089 | function |  | 23 |
| `normalizeBraidDimensions` | 20123 | function |  | 3 |
| `normalizeStrandDimensions` | 20136 | function |  | 3 |
| `strandBaseWidth` | 20150 | function |  | 5 |
| `strandWidthDimension` | 20154 | function |  | 5 |
| `strandDepthDimension` | 20162 | function |  | 8 |
| `setStrandWidthDimension` | 20170 | function |  | 2 |
| `setStrandDepthDimension` | 20192 | function |  | 4 |
| `syncShapeDimensionInputs` | 20208 | function |  | 4 |
| `syncCreationShapeInputs` | 20244 | function |  | 3 |
| `syncViewportDrawSettings` | 20282 | function |  | 4 |
| `selectedPanelSegment` | 20296 | function |  | 6 |
| `syncPanelSegmentControls` | 20302 | function |  | 11 |
| `syncPanelShapeInputs` | 20320 | function |  | 6 |
| `syncStrandSplitInputs` | 20347 | function |  | 4 |
| `syncHairCardControls` | 20356 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 20364 | function |  | 3 |
| `updateAttributeEditorMode` | 20403 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 20553 | function |  | 2 |
| `curveLatticeForGroup` | 20576 | function |  | 2 |
| `filterCurveLatticesToGroup` | 20594 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 20639 | function |  | 2 |
| `showCurveLatticeForGroup` | 20656 | function |  | 2 |
| `selectStrandGroup` | 20693 | function |  | 3 |
| `selectCurvePoint` | 20735 | function |  | 10 |
| `updateSelectedPointLabel` | 20749 | function |  | 12 |
| `syncInputs` | 20762 | function |  | 15 |
| `syncClumpGuidePanel` | 20808 | function |  | 3 |
| `getSelectedLock` | 20835 | function |  | 107 |
| `selectedLocksInOrder` | 20839 | function |  | 37 |
| `lockStrands` | 20845 | function |  | 3 |
| `lockSelectedStrands` | 20878 | function |  | 3 |
| `unlockStrands` | 20884 | function |  | 3 |
| `unlockAllStrands` | 20899 | function |  | 3 |
| `strandEditFamily` | 20903 | function |  | 7 |
| `compatibleSelectedLocks` | 20908 | function |  | 5 |
| `selectedEditRoots` | 20915 | function |  | 2 |
| `editSelectedLocks` | 20928 | function |  | 19 |
| `multiEditValuesEqual` | 20961 | function |  | 2 |
| `setMixedControl` | 20970 | function |  | 28 |
| `syncMultiStrandInputs` | 20987 | function |  | 16 |
| `values` | 21003 | arrow |  | 37 |
| `selectedRebuildableCurves` | 21083 | function |  | 5 |
| `createCompoundStrand` | 21090 | function |  | 1 |
| `refreshRebuildCurveDialog` | 21151 | function |  | 8 |
| `openRebuildCurveDialog` | 21164 | function |  | 1 |
| `rebuildSelectedCurves` | 21178 | function |  | 2 |
| `selectionCanBecomeClump` | 21217 | function |  | 4 |
| `createClumpFromSelection` | 21222 | function |  | 3 |
| `cleanSelectionSets` | 21234 | function |  | 2 |
| `createSelectionSetFromSelection` | 21239 | function |  | 3 |
| `selectionSetById` | 21250 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 21254 | function |  | 7 |
| `editSelectionSetFromSelection` | 21263 | function |  | 5 |
| `deleteSelectionSet` | 21283 | function |  | 2 |
| `selectSelectionSet` | 21292 | function |  | 2 |
| `deleteSelectedStrands` | 21302 | function |  | 4 |
| `deleteGuide` | 21310 | function |  | 3 |
| `deleteSelectedGuide` | 21333 | function |  | 3 |
| `deleteSelectedReferenceImage` | 21337 | function |  | 4 |
| `hasDeletableSelection` | 21350 | function |  | 2 |
| `deleteCurrentSelection` | 21358 | function |  | 3 |
| `hideOutlinerContextMenu` | 21366 | function |  | 17 |
| `outlinerLockTargets` | 21371 | function |  | 3 |
| `showOutlinerContextMenu` | 21398 | function |  | 8 |
| `hideStrandRadialMenu` | 21478 | function |  | 4 |
| `ensureRadialButtonCapacity` | 21489 | function |  | 3 |
| `radialButtonDimensions` | 21502 | function |  | 4 |
| `radialMenuDimensionsForKind` | 21511 | function |  | 3 |
| `applyRadialMenuDimensions` | 21528 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 21534 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 21547 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 21568 | function |  | 2 |
| `selectionSetRadialMenuOption` | 21585 | function |  | 4 |
| `selectedMirrorRadialOptions` | 21594 | function |  | 3 |
| `strandVisibilityRadialOptions` | 21616 | function |  | 5 |
| `clumpMirrorRadialOptions` | 21634 | function |  | 2 |
| `contextualRadialOptions` | 21641 | function |  | 3 |
| `sharedRadialFrameDimensions` | 21770 | function |  | 3 |
| `layoutContextualRadialOptions` | 21774 | function |  | 4 |
| `renderRadialActionList` | 21798 | function |  | 3 |
| `radialListOptionAtPointer` | 21816 | function |  | 3 |
| `syncRadialListHighlight` | 21838 | function |  | 3 |
| `configureContextualRadialMenu` | 21844 | function |  | 3 |
| `beginStrandRadialGesture` | 21904 | function |  | 2 |
| `enterStrandRadialSubmenu` | 21938 | function |  | 2 |
| `updateStrandRadialGesture` | 21984 | function |  | 1 |
| `performStrandRadialAction` | 22023 | function |  | 2 |
| `finishStrandRadialGesture` | 22126 | function |  | 2 |
| `cancelStrandRadialGesture` | 22136 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 22143 | function |  | 1 |
| `setPullMoveEnabled` | 22149 | function |  | 3 |
| `toolRadialOptions` | 22157 | function |  | 2 |
| `hideToolRadialMenu` | 22182 | function |  | 4 |
| `beginToolRadialGesture` | 22195 | function |  | 2 |
| `beginToolShortcutPress` | 22235 | function |  | 2 |
| `finishToolShortcutPress` | 22250 | function |  | 2 |
| `cancelToolShortcutPress` | 22259 | function |  | 5 |
| `setRadialMenusEnabled` | 22267 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 22280 | function |  | 5 |
| `setNavigationTipsEnabled` | 22295 | function |  | 5 |
| `configureNavigationMouseButtons` | 22302 | function |  | 3 |
| `syncNavigationModifierLocks` | 22315 | function |  | 7 |
| `setNavigationStyle` | 22320 | function |  | 5 |
| `applyCameraSmoothingPreference` | 22336 | function |  | 4 |
| `setCameraSmoothingEnabled` | 22351 | function |  | 5 |
| `setCameraSmoothingStrength` | 22357 | function |  | 5 |
| `setScaleSensitivity` | 22365 | function |  | 3 |
| `setToolTipsEnabled` | 22373 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 22380 | function |  | 5 |
| `setViewportStatisticsEnabled` | 22389 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 22397 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 22412 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 22421 | function |  | 5 |
| `sideNamingDisplayId` | 22430 | function |  | 3 |
| `referenceViewDisplayLabel` | 22442 | function |  | 6 |
| `strandRegionDisplayLabel` | 22452 | function |  | 8 |
| `updateSideNamingLabels` | 22470 | function |  | 2 |
| `setSideNamingPerspective` | 22497 | function |  | 5 |
| `setControlPointDisplaySize` | 22506 | function |  | 6 |
| `scaleHexColor` | 22518 | function |  | 3 |
| `setViewportBackgroundColor` | 22523 | function |  | 7 |
| `setDefaultHairShader` | 22545 | function |  | 5 |
| `setPreferenceCategory` | 22551 | function |  | 4 |
| `openPreferencesDialog` | 22578 | function |  | 1 |
| `savePreferencesDialog` | 22606 | function |  | 1 |
| `cancelPreferencesDialog` | 22630 | function |  | 3 |
| `updateToolRadialGesture` | 22659 | function |  | 1 |
| `performToolRadialAction` | 22688 | function |  | 2 |
| `finishToolRadialGesture` | 22698 | function |  | 2 |
| `cancelToolRadialGesture` | 22707 | function |  | 5 |
| `duplicatePlacementTarget` | 22714 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 22741 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 22745 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 22755 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 22760 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 22772 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 22783 | function |  | 7 |
| `openProceduralDuplicateDialog` | 22791 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 22808 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 22829 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 22840 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 22846 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 22852 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 22885 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 23040 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 23142 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 23183 | function |  | 2 |
| `updateDuplicatePlacement` | 23210 | function |  | 2 |
| `beginDuplicatePlacement` | 23274 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 23338 | function |  | 2 |
| `confirmDuplicatePlacement` | 23379 | function |  | 1 |
| `cancelDuplicatePlacement` | 23416 | function |  | 4 |
| `outlinerClumpLocks` | 23442 | function |  | 11 |
| `handleOutlinerClumpDrop` | 23446 | function |  | 3 |
| `createOutlinerStrandButton` | 23469 | function |  | 4 |
| `createOutlinerCurveSurface` | 23555 | function |  | 2 |
| `createOutlinerClump` | 23651 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 23733 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 23740 | function |  | 2 |
| `renderLockList` | 23819 | function |  | 61 |
| `updateCount` | 23973 | function |  | 26 |
| `captureInputUndo` | 23982 | function |  | 1 |
| `bindUndoCapture` | 23988 | function |  | 37 |
| `bindLockInput` | 23999 | function |  | 2 |
| `applyValue` | 24016 | arrow |  | 2 |
| `applyUniformTransformScale` | 24335 | function |  | 2 |
| `applyReducedTransformScale` | 24352 | function |  | 2 |
| `applyTransformPrecision` | 24391 | function |  | 2 |
| `updateTransformScalePointer` | 24420 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 24741 | function |  | 3 |
| `finishTaperCurveDrag` | 24805 | function |  | 1 |
| `beginTaperMeshPointDrag` | 24848 | function |  | 1 |
| `updateTaperMeshPointDrag` | 24929 | function |  | 1 |
| `finishTaperMeshPointDrag` | 24984 | function |  | 6 |
| `updateSelectedTaperPoint` | 25008 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 25609 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 25614 | function |  | 4 |
| `syncDrawCurlControls` | 25669 | function |  | 5 |
| `handleLiveSurfaceChange` | 25717 | function |  | 1 |
| `changePanelSplitCount` | 25866 | function |  | 3 |
| `applyPresetControl` | 26016 | function |  | 2 |
| `applyCreationToolSettings` | 26037 | function |  | 2 |
| `populateCreationPresetSelect` | 26081 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 26105 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 26138 | function |  | 5 |
| `createCustomCreationPreset` | 26146 | function |  | 3 |
| `createCustomClumpPreset` | 26161 | function |  | 3 |
| `commitCustomCreationPreset` | 26176 | function |  | 2 |
| `openRemoveCreationPreset` | 26237 | function |  | 3 |
| `commitRemoveCreationPreset` | 26250 | function |  | 1 |
| `applyBraidToolPreset` | 26267 | function |  | 2 |
| `selectedBranchChildLock` | 26379 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 26383 | function |  | 2 |
| `initPanelResizeHandles` | 26489 | function |  | 2 |
| `applyWidth` | 26495 | arrow |  | 2 |
| `restoreWidth` | 26502 | arrow |  | 2 |
| `bindResize` | 26510 | arrow |  | 2 |
| `onMove` | 26519 | arrow |  | 0 |
| `onUp` | 26523 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 26540 | function |  | 2 |
| `initFloatingPanelControls` | 26549 | function |  | 2 |
| `detach` | 26558 | arrow |  | 28 |
| `endDrag` | 26596 | arrow |  | 0 |
| `endResize` | 26628 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 26639 | function |  | 3 |
| `selectPatchNotesVersion` | 26773 | function |  | 3 |
| `requestReferenceImage` | 26806 | function |  | 5 |
| `toggleCapsuleGuideTool` | 27010 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 27016 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 27023 | function |  | 1 |
| `deleteLocks` | 27590 | function |  | 10 |
| `disposeCurveObjects` | 27668 | function |  | 4 |
| `beginTipSubBoneRotate` | 27754 | function |  | 2 |
| `applyTipSubBoneTransform` | 27784 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 27816 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 27941 | function |  | 1 |
| `endPanelSplitHandleDrag` | 28162 | function |  | 3 |
| `resize` | 28195 | function |  | 3 |
| `handleViewportPointerMove` | 28206 | function |  | 1 |
| `blockProportionalSizingEvent` | 28217 | function |  | 1 |
| `updateLightAngleFromInputs` | 28223 | function |  | 2 |
| `startViewSnap` | 28237 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 28267 | function |  | 3 |
| `trackViewportPointerDown` | 28284 | function |  | 1 |
| `trackViewportPointerMove` | 28300 | function |  | 1 |
| `clearViewportPointer` | 28308 | function |  | 1 |
| `updateViewSnap` | 28313 | function |  | 1 |
| `nearestCardinalAxis` | 28349 | function |  | 5 |
| `cardinalAxisKey` | 28363 | function |  | 5 |
| `steppedDragAmount` | 28367 | function |  | 3 |
| `snapCameraToCardinalAxis` | 28373 | function |  | 4 |
| `endViewSnap` | 28389 | function |  | 4 |
| `activateStrandControlPoint` | 28399 | function |  | 4 |
| `refreshStrandControlPointSelection` | 28449 | function |  | 4 |
| `addStrandControlPointSelection` | 28476 | function |  | 3 |
| `removeStrandControlPointSelection` | 28493 | function |  | 3 |
| `sampleStrandPointNormal` | 28507 | function |  | 2 |
| `sampleStrandPointVectors` | 28517 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 28523 | function |  | 2 |
| `resampleStrandCurveData` | 28534 | function |  | 4 |
| `resampleMatchingVectors` | 28540 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 28579 | function |  | 4 |
| `removeStrandCurvePoint` | 28590 | function |  | 2 |
| `closestStrandCurveParameter` | 28603 | function |  | 2 |
| `insertStrandCurvePoint` | 28632 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 28649 | function |  | 2 |
| `selectionModifierCursorAvailable` | 28659 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 28675 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 28682 | function |  | 4 |
| `prepareCurvePointSelection` | 28704 | function |  | 1 |
| `finishCurvePointInsertion` | 28815 | function |  | 1 |
| `finishPointRemoval` | 28830 | function |  | 1 |
| `editableStrandWidth` | 28848 | function |  | 6 |
| `editableStrandWidthBounds` | 28860 | function |  | 2 |
| `applyEditableStrandWidth` | 28866 | function |  | 3 |
| `viewportPixelPoint` | 28902 | function |  | 5 |
| `syncSculptBrushControls` | 28910 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 28925 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 28933 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 28941 | function |  | 1 |
| `sculptBrushPlaneOffset` | 28947 | function |  | 5 |
| `setSculptBrushCursorVisible` | 28951 | function |  | 6 |
| `updateSculptBrushCursor` | 28958 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 28980 | function |  | 4 |
| `sculptBrushEditableLock` | 28987 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 28997 | function |  | 5 |
| `sculptBrushLockViable` | 29003 | function |  | 5 |
| `sculptBrushUnits` | 29014 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 29052 | function |  | 4 |
| `sculptBrushPointWeight` | 29102 | function |  | 6 |
| `sculptBrushWorldDelta` | 29112 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 29121 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 29147 | function |  | 2 |
| `beginSculptMoveStroke` | 29205 | function |  | 1 |
| `isHairCreateTool` | 29267 | function |  | 4 |
| `syncStrandHoverOutline` | 29271 | function |  | 1 |
| `pointerOverTaperEditor` | 29284 | function |  | 3 |
| `updateStrandBrushHover` | 29291 | function |  | 1 |
| `updatePanelTipHover` | 29312 | function |  | 1 |
| `applySubBoneBrushSample` | 29342 | function |  | 2 |
| `applySculptMoveStrokeSample` | 29487 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 29725 | function |  | 3 |
| `updateSculptMoveStroke` | 29734 | function |  | 1 |
| `finishSculptMoveStroke` | 29750 | function |  | 3 |
| `strandControlPointHit` | 29798 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 29802 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 29880 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 29914 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 29954 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 29967 | function |  | 1 |
| `setHoveredControlPoint` | 30006 | function |  | 7 |
| `visibleControlPointHoverTargets` | 30019 | function |  | 2 |
| `updateControlPointHover` | 30055 | function |  | 1 |
| `animate` | 30670 | function |  | 2 |
| `syncCompactSidebarLayout` | 30701 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 30720 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 30726 | function |  | 3 |
| `setAttributeEditorTab` | 30732 | function |  | 6 |

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
