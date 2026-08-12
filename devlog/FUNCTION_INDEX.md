# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1807** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（23072 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 280 | function |  | 3 |
| `saveBooleanPreference` | 308 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 312 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 317 | function |  | 2 |
| `normalizeScaleSensitivity` | 322 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 327 | function |  | 2 |
| `normalizeSideNamingPerspective` | 332 | function |  | 2 |
| `normalizeNavigationStyle` | 336 | function |  | 2 |
| `setupEditableSliderControls` | 351 | function |  | 2 |
| `syncNumberFromRange` | 402 | arrow |  | 0 |
| `applyNumberValue` | 409 | arrow |  | 0 |
| `copyCameraPose` | 515 | function |  | 3 |
| `updateCameraProjectionForViewport` | 521 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 534 | function |  | 3 |
| `setOrthographicView` | 540 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 580 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 609 | function |  | 2 |
| `removeRotateFreeAxisRing` | 635 | function |  | 2 |
| `deflateTransformGizmoPickers` | 647 | function |  | 2 |
| `nextStrandName` | 1042 | function |  | 2 |
| `isPanelGeometry` | 1268 | function |  | 29 |
| `normalizePanelSplits` | 1272 | function |  | 2 |
| `clonePanelSplits` | 1284 | function |  | 11 |
| `snapPanelSplitHeight` | 1288 | function |  | 3 |
| `createQuadSphereGeometry` | 1323 | function |  | 2 |
| `vertexIndex` | 1337 | function |  | 5 |
| `addEdge` | 1355 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1561 | function |  | 4 |
| `ensureDrawClumpPreviewCount` | 1741 | function |  | 1 |
| `currentStrandSelectionState` | 1803 | function |  | 4 |
| `applyStrandSelectionState` | 1807 | function |  | 5 |
| `clearStrandSelectionState` | 1812 | function |  | 6 |
| `disposeGuideModel` | 2915 | function |  | 3 |
| `syncHeadTransformInputs` | 2926 | function |  | 3 |
| `applyHeadTransform` | 2933 | function |  | 4 |
| `resetHeadTransform` | 2953 | function |  | 2 |
| `installGuideModel` | 2968 | function |  | 5 |
| `loadDefaultGuideModel` | 3044 | function |  | 3 |
| `frameGuideModel` | 3067 | function |  | 2 |
| `normalizeHairLayer` | 3096 | function |  | 25 |
| `layerOffsetForLock` | 3100 | function |  | 8 |
| `layerRootOffsetFactor` | 3105 | function |  | 12 |
| `layerOffsetWeight` | 3109 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3115 | function |  | 5 |
| `pointsWithLayerOffset` | 3124 | function |  | 1 |
| `layerDirectionForLock` | 3132 | function |  | 2 |
| `applyLayerOffset` | 3143 | function |  | 5 |
| `setLockHairLayer` | 3167 | function |  | 2 |
| `setGroupLayerOffset` | 3182 | function |  | 2 |
| `quadraticWeights` | 3210 | function |  | 1 |
| `setHeadReferenceTransparency` | 3221 | function |  | 4 |
| `trianglePlaneIntersections` | 3233 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3254 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3463 | function |  | 1 |
| `upperContourCurve` | 3480 | function |  | 2 |
| `hermitePoint` | 3515 | function |  | 2 |
| `curveNetworkSection` | 3526 | function |  | 1 |
| `pointAlongSection` | 3555 | function |  | 1 |
| `longestStitchedContour` | 3561 | function |  | 2 |
| `nodeForPoint` | 3569 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3626 | function |  | 1 |
| `exitSetupEditors` | 3646 | function |  | 6 |
| `syncAppMenuVisibility` | 3656 | function |  | 3 |
| `closeAppMenus` | 3662 | function |  | 6 |
| `setAppMenuOpen` | 3673 | function |  | 2 |
| `setTurntableActive` | 3680 | function |  | 3 |
| `selectedReferenceImage` | 3690 | function |  | 20 |
| `normalizeReferenceCrop` | 3696 | function |  | 8 |
| `referenceCropIsFull` | 3704 | function |  | 3 |
| `referencePlaneFrontAxis` | 3709 | function |  | 4 |
| `referencePlanePlacement` | 3718 | function |  | 4 |
| `migratedReferencePlanePosition` | 3733 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3753 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3770 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3786 | function |  | 2 |
| `snappedReferenceImageView` | 3809 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3815 | function |  | 5 |
| `applyReferenceImageRuntime` | 3831 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 3874 | function |  | 6 |
| `createReferenceImageRuntime` | 3882 | function |  | 3 |
| `addReferenceImage` | 3951 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4003 | function |  | 3 |
| `disposeReferenceImage` | 4022 | function |  | 2 |
| `clearReferenceImages` | 4026 | function |  | 2 |
| `serializeReferenceImage` | 4033 | function |  | 1 |
| `setReferenceImageType` | 4061 | function |  | 2 |
| `attachReferenceImageTransform` | 4105 | function |  | 6 |
| `selectReferenceImage` | 4119 | function |  | 12 |
| `placeReferencePlane` | 4142 | function |  | 2 |
| `setReferencePlaneInFront` | 4153 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4163 | function |  | 4 |
| `renderReferenceImagePanel` | 4182 | function |  | 20 |
| `setOutlinerTab` | 4229 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4247 | function |  | 4 |
| `componentEditModeActive` | 4251 | function |  | 29 |
| `selectionToolSupportsPicking` | 4255 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4260 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4276 | function |  | 2 |
| `setViewportSelectionMode` | 4306 | function |  | 4 |
| `setViewportEditMode` | 4318 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4360 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4374 | function |  | 8 |
| `normalizeOutlinerName` | 4388 | function |  | 3 |
| `beginOutlinerRename` | 4393 | function |  | 2 |
| `finish` | 4404 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4434 | function |  | 6 |
| `referenceOutlinerGroup` | 4446 | function |  | 2 |
| `renderReferenceOutliner` | 4450 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4567 | function |  | 5 |
| `readReferenceImageFile` | 4572 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4596 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4603 | function |  | 3 |
| `dragContainsReferenceImage` | 4648 | function |  | 3 |
| `setReferenceImageDragActive` | 4659 | function |  | 9 |
| `referenceDropDestination` | 4667 | function |  | 2 |
| `viewportOverlayDropPosition` | 4673 | function |  | 2 |
| `setReferenceDropHover` | 4682 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4700 | function |  | 2 |
| `referenceOverlayAtPointer` | 4720 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4738 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4751 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4797 | function |  | 1 |
| `finishReferenceOverlayDrag` | 4847 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 4869 | function |  | 6 |
| `updateReferenceOverlayCursor` | 4880 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 4906 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 4915 | function |  | 2 |
| `referenceCropCursor` | 4930 | function |  | 3 |
| `updateReferenceCropHandles` | 4936 | function |  | 5 |
| `referenceCropSourcePoint` | 4957 | function |  | 2 |
| `beginReferenceCrop` | 4964 | function |  | 1 |
| `updateReferenceCrop` | 5002 | function |  | 1 |
| `finishReferenceCrop` | 5034 | function |  | 4 |
| `setHeadSetupEditing` | 5052 | function |  | 6 |
| `strandPassesDisplayFilters` | 5078 | function |  | 4 |
| `strandVisibleForDisplay` | 5087 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 5092 | function |  | 3 |
| `lockedStrandsExist` | 5096 | function |  | 3 |
| `hiddenStrandsExist` | 5100 | function |  | 2 |
| `hideSelectedStrands` | 5104 | function |  | 2 |
| `unhideHiddenStrands` | 5114 | function |  | 2 |
| `strandIsolationActive` | 5123 | function |  | 7 |
| `setStrandIsolation` | 5127 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5139 | function |  | 3 |
| `syncVisibilityParent` | 5150 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5157 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5186 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5193 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5216 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5434 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5455 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5474 | function |  | 2 |
| `selectedViewportFocusBounds` | 5572 | function |  | 2 |
| `frameViewportBounds` | 5586 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5616 | function |  | 2 |
| `fullSceneFocusBounds` | 5620 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5635 | function |  | 3 |
| `cycleViewportFraming` | 5644 | function |  | 2 |
| `sculptBrushToolActive` | 5664 | function |  | 23 |
| `sculptBrushSelectionMaskActive` | 5668 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5672 | function |  | 2 |
| `effectiveSculptBrushTool` | 5676 | function |  | 4 |
| `updateSculptScaleModeRow` | 5682 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5687 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5709 | function |  | 5 |
| `setActiveTool` | 5718 | function |  | 12 |
| `setDrawStrandMode` | 5856 | function |  | 1 |
| `setObjectSpaceEditing` | 5866 | function |  | 7 |
| `setHierarchyEditing` | 5882 | function |  | 4 |
| `setProportionalEditing` | 5894 | function |  | 5 |
| `beginProportionalSizeEdit` | 5913 | function |  | 3 |
| `updateProportionalSizeEdit` | 5925 | function |  | 2 |
| `endProportionalSizeEdit` | 5936 | function |  | 5 |
| `activateProportionalHotkeyHold` | 5943 | function |  | 2 |
| `refreshProportionalPreview` | 5951 | function |  | 4 |
| `activeBrushSizeInput` | 5961 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 5970 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 5982 | function |  | 2 |
| `beginBrushSizeDrag` | 6000 | function |  | 1 |
| `updateBrushSizeDrag` | 6027 | function |  | 1 |
| `finishBrushSizeDrag` | 6048 | function |  | 2 |
| `updateInteractionLocks` | 6065 | function |  | 57 |
| `configureTransformControls` | 6076 | function |  | 12 |
| `pullMoveActive` | 6084 | function |  | 9 |
| `updatePullGuideVisual` | 6088 | function |  | 4 |
| `attachTransformForCurvePoint` | 6104 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6128 | function |  | 5 |
| `strandObjectRootIndex` | 6144 | function |  | 3 |
| `strandObjectRoot` | 6153 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6157 | function |  | 2 |
| `attachStrandObjectTransform` | 6162 | function |  | 6 |
| `guideObjectPivot` | 6185 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6196 | function |  | 2 |
| `attachGuideObjectTransform` | 6201 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6220 | function |  | 2 |
| `beginGuideObjectTransform` | 6248 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6255 | function |  | 2 |
| `updateGuideObjectTransform` | 6277 | function |  | 2 |
| `finishGuideObjectTransform` | 6310 | function |  | 2 |
| `clonePlacementFrame` | 6319 | function |  | 2 |
| `cloneOptionalVectors` | 6331 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6335 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6352 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6367 | function |  | 2 |
| `strandObjectTransformOperators` | 6383 | function |  | 4 |
| `transformPoint` | 6391 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6398 | arrow |  | 0 |
| `transformNormal` | 6404 | arrow |  | 10 |
| `transformDirection` | 6414 | arrow |  | 5 |
| `worldMatrixForPivot` | 6426 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6432 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6448 | function |  | 6 |
| `beginStrandObjectTransform` | 6474 | function |  | 2 |
| `updateStrandObjectTransform` | 6512 | function |  | 2 |
| `commitStrandObjectTransform` | 6570 | function |  | 2 |
| `mapPoints` | 6583 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6617 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6631 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6654 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6667 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6682 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6708 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6757 | function |  | 2 |
| `beginHandleEdit` | 6766 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6819 | function |  | 3 |
| `multiPointHandleEditActive` | 6830 | function |  | 7 |
| `applyMultiMove` | 6834 | function |  | 5 |
| `applyMultiRotate` | 6840 | function |  | 2 |
| `applyMultiScale` | 6849 | function |  | 2 |
| `applyHierarchicalMove` | 6858 | function |  | 3 |
| `applySingleMove` | 6870 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6874 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6891 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6900 | function |  | 3 |
| `changed` | 6910 | arrow |  | 1 |
| `applyPullMove` | 6952 | function |  | 3 |
| `pullHeadCollisionContext` | 6960 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 6979 | function |  | 2 |
| `applyProportionalMove` | 7002 | function |  | 3 |
| `viewPlaneNormal` | 7013 | function |  | 7 |
| `isCameraInSnappedView` | 7017 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7025 | function |  | 9 |
| `updateViewPlaneGrid` | 7029 | function |  | 13 |
| `setViewPlaneMove` | 7086 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7097 | function |  | 2 |
| `rayFromViewportEvent` | 7105 | function |  | 9 |
| `worldUnitsPerViewportPixel` | 7113 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7123 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7134 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7147 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7166 | function |  | 4 |
| `beginViewPlaneMove` | 7173 | function |  | 3 |
| `updateViewPlaneMove` | 7237 | function |  | 1 |
| `endViewPlaneMove` | 7302 | function |  | 7 |
| `applyHierarchicalRotate` | 7321 | function |  | 2 |
| `rotateGuideNormal` | 7328 | arrow |  | 4 |
| `applySingleRotate` | 7366 | function |  | 2 |
| `applyProportionalRotate` | 7370 | function |  | 2 |
| `applyHierarchicalScale` | 7390 | function |  | 2 |
| `applySingleScale` | 7400 | function |  | 2 |
| `applyProportionalScale` | 7404 | function |  | 2 |
| `setPointScale` | 7420 | function |  | 7 |
| `proportionalWeight` | 7429 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7441 | function |  | 5 |
| `strandInfluenceColor` | 7447 | function |  | 4 |
| `beginRelaxEdit` | 7472 | function |  | 3 |
| `updateRelaxEdit` | 7501 | function |  | 1 |
| `endRelaxEdit` | 7561 | function |  | 1 |
| `disposeGuide` | 7571 | function |  | 3 |
| `removeGuideObjects` | 7599 | function |  | 3 |
| `strandRadiusAt` | 7613 | function |  | 5 |
| `strandProfileTopologyAt` | 7630 | function |  | 2 |
| `strandCurveParameters` | 7672 | function |  | 1 |
| `widthProfileAt` | 7682 | arrow |  | 1 |
| `braidFrameAt` | 7720 | function |  | 4 |
| `braidFrameAtExtended` | 7730 | function |  | 2 |
| `createBraidProfileProjector` | 7739 | function |  | 2 |
| `project` | 7755 | arrow |  | 11 |
| `createBraidGeometry` | 7770 | function |  | 1 |
| `quantize` | 7803 | arrow |  | 19 |
| `deformationAt` | 7805 | function |  | 3 |
| `widthFor` | 7814 | arrow |  | 3 |
| `depthFor` | 7818 | arrow |  | 3 |
| `outputVertex` | 7850 | function |  | 7 |
| `appendAuthoredCap` | 7958 | function |  | 3 |
| `outputCapVertex` | 7965 | arrow |  | 6 |
| `capBoundary` | 8056 | function |  | 3 |
| `strandGeometryCurve` | 8118 | function |  | 6 |
| `strandGeometryFrameAt` | 8144 | function |  | 5 |
| `transportedStrandFrameAt` | 8207 | function |  | 5 |
| `twistOverrideAt` | 8210 | arrow |  | 2 |
| `hairMaterialDefinition` | 8280 | function |  | 4 |
| `materialForLock` | 8284 | function |  | 7 |
| `activeHairMaterialDefinition` | 8288 | function |  | 11 |
| `strandDisplayColor` | 8294 | function |  | 13 |
| `setAnimeHairBaseColor` | 8312 | function |  | 3 |
| `createAnimeAnisotropicMaterial` | 8325 | function |  | 2 |
| `createHairMaterial` | 8365 | function |  | 4 |
| `createStrandSelectionOutline` | 8407 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 8442 | function |  | 6 |
| `applyMaterialDefinitionToLock` | 8451 | function |  | 6 |
| `refreshMaterialUsers` | 8478 | function |  | 6 |
| `renderHairMaterialOutliner` | 8487 | function |  | 5 |
| `renderHairMaterialOptions` | 8517 | function |  | 3 |
| `syncHairMaterialEditor` | 8527 | function |  | 9 |
| `createProjectHairMaterial` | 8553 | function |  | 3 |
| `deleteActiveHairMaterial` | 8573 | function |  | 2 |
| `createHairTopologyGeometry` | 8591 | function |  | 4 |
| `createHairTopologyOverlay` | 8612 | function |  | 3 |
| `groupDefaultsFor` | 8659 | function |  | 7 |
| `creationToolActive` | 8666 | function |  | 5 |
| `activeCreationShapeDefaults` | 8670 | function |  | 6 |
| `curvePolylineLength` | 8677 | function |  | 2 |
| `curvePolylineLengths` | 8685 | function |  | 3 |
| `samplePolylineDistance` | 8693 | function |  | 2 |
| `applyProjectedCurveLength` | 8703 | function |  | 4 |
| `clearRegionLengthBaseline` | 8734 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8741 | function |  | 2 |
| `setGroupLengthScale` | 8749 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 8787 | function |  | 3 |
| `requestGroupDefaultsWarning` | 8819 | function |  | 1 |
| `activeProfileOffset` | 8831 | function |  | 3 |
| `profileToCanvas` | 8839 | function |  | 1 |
| `renderProfilePreview` | 8846 | function |  | 7 |
| `renderHairCardCoveragePath` | 8865 | function |  | 2 |
| `updateViewportStatsVisibility` | 9209 | function |  | 1 |
| `canvasToProfile` | 9228 | function |  | 2 |
| `addLock` | 9243 | function |  | 5 |
| `mirroredVector` | 9455 | function |  | 12 |
| `mirroredPlacementFrame` | 9459 | function |  | 2 |
| `mirrorPartnerFor` | 9472 | function |  | 34 |
| `decoupleMirrorPartner` | 9476 | function |  | 2 |
| `createMirrorPartner` | 9484 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 9580 | function |  | 4 |
| `mirroredClumpPartners` | 9585 | function |  | 6 |
| `createMirroredClump` | 9591 | function |  | 3 |
| `decoupleMirroredClump` | 9613 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 9633 | function |  | 5 |
| `syncActiveMirror` | 9800 | function |  | 21 |
| `setMirrorXEditing` | 9812 | function |  | 5 |
| `snapshotState` | 9836 | function |  | 6 |
| `rootAttachmentFrame` | 10097 | function |  | 3 |
| `rootAttachmentLocalFrame` | 10109 | function |  | 4 |
| `resolveRootAttachment` | 10127 | function |  | 4 |
| `curvePointsToRootLocal` | 10167 | function |  | 2 |
| `curvePointsFromRootLocal` | 10179 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 10187 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 10203 | function |  | 2 |
| `createRootAttachment` | 10234 | function |  | 7 |
| `syncRootAttachmentMetadata` | 10264 | function |  | 3 |
| `rootAttachmentToData` | 10291 | function |  | 2 |
| `rootAttachmentFromData` | 10319 | function |  | 3 |
| `importHeadMeshFile` | 10361 | function |  | 3 |
| `importFullBodyMeshFile` | 10384 | function |  | 3 |
| `downloadPreferencesAndPresets` | 10409 | function |  | 1 |
| `importedBooleanPreference` | 10442 | function |  | 11 |
| `loadPreferencesAndPresets` | 10490 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 10560 | function |  | 1 |
| `openHairProjectFile` | 10604 | function |  | 4 |
| `dragContainsApplicationFile` | 10662 | function |  | 3 |
| `safelyRememberRecentProject` | 10671 | function |  | 2 |
| `renderRecentProjectsMenu` | 10680 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 10712 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 10737 | function |  | 2 |
| `confirmDroppedApplicationFile` | 10741 | function |  | 2 |
| `pushUndoState` | 10757 | function |  | 86 |
| `undoLastAction` | 10764 | function |  | 2 |
| `redoLastAction` | 10781 | function |  | 2 |
| `updateHistoryButtons` | 10798 | function |  | 8 |
| `resetTransientInteractionsForStateRestore` | 10803 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 10823 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 10830 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 10869 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 10895 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 10927 | function |  | 2 |
| `finalizeStateRestore` | 10968 | function |  | 2 |
| `restoreState` | 10975 | function |  | 4 |
| `disposeAllEditableObjects` | 10999 | function |  | 2 |
| `restoreLock` | 11020 | function |  | 4 |
| `restoreGuide` | 11244 | function |  | 2 |
| `vectorToData` | 11305 | function |  | 25 |
| `dataToVector` | 11309 | function |  | 22 |
| `frameToData` | 11313 | function |  | 2 |
| `frameFromData` | 11325 | function |  | 2 |
| `average` | 11337 | function |  | 3 |
| `fitPointAttributes` | 11341 | function |  | 7 |
| `rebuildCurveObjects` | 11370 | function |  | 6 |
| `createCurvePoints` | 11382 | function |  | 2 |
| `nextClumpName` | 11392 | function |  | 3 |
| `initializeClumpShape` | 11399 | function |  | 5 |
| `stableClumpVariation` | 11410 | function |  | 3 |
| `createClumpFromLocks` | 11422 | function |  | 4 |
| `addLockToClump` | 11447 | function |  | 4 |
| `pointerToNdc` | 11503 | function |  | 1 |
| `gridProfileSkipCol` | 11519 | function |  | 1 |
| `clumpDirectMembers` | 11543 | function |  | 3 |
| `clumpMembersForGuide` | 11548 | function |  | 6 |
| `clumpGuideForLock` | 11552 | function |  | 13 |
| `proceduralGuideForLock` | 11557 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 11564 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 11571 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 11578 | function |  | 2 |
| `proceduralBranchWorldPoints` | 11590 | function |  | 1 |
| `applyProceduralBranchSettings` | 11603 | function |  | 2 |
| `proceduralAccessoryMapsForGuide` | 11642 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 11658 | function |  | 3 |
| `createProceduralAccessoryLock` | 11672 | function |  | 2 |
| `applyProceduralAccessorySettings` | 11724 | function |  | 2 |
| `clumpFrameAt` | 11775 | function |  | 5 |
| `commitClumpMemberRestState` | 11783 | function |  | 9 |
| `updateClumpMembers` | 11866 | function |  | 9 |
| `dissolveClump` | 11970 | function |  | 6 |
| `detachLockFromClump` | 12007 | function |  | 4 |
| `createPlacedStrand` | 12037 | function |  | 2 |
| `placedPointCount` | 12101 | function |  | 3 |
| `createPlacedPoints` | 12105 | function |  | 3 |
| `pushPointOutsideHead` | 12124 | function |  | 2 |
| `resizePlacedStrand` | 12156 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 12173 | function |  | 4 |
| `beginPlaceEdit` | 12178 | function |  | 2 |
| `updatePlaceEdit` | 12196 | function |  | 1 |
| `updatePlacementLength` | 12210 | function |  | 3 |
| `updatePlacementOrientation` | 12220 | function |  | 3 |
| `endPlaceEdit` | 12238 | function |  | 1 |
| `confirmPendingPlacedStrand` | 12253 | function |  | 1 |
| `pendingPlacedLock` | 12263 | function |  | 2 |
| `beginPlacementPointer` | 12267 | function |  | 3 |
| `finishPlacementPointer` | 12277 | function |  | 2 |
| `confirmPlacementStep` | 12301 | function |  | 2 |
| `finishPlacementFlow` | 12324 | function |  | 6 |
| `updatePlacementStatus` | 12337 | function |  | 49 |
| `deselectStrands` | 12476 | function |  | 11 |
| `beginSelectionMarquee` | 12491 | function |  | 3 |
| `beginAltOrbit` | 12515 | function |  | 1 |
| `beginBlenderNavigation` | 12527 | function |  | 1 |
| `endBlenderNavigation` | 12572 | function |  | 1 |
| `prepareSelectPointerCapture` | 12580 | function |  | 1 |
| `endSelectPointerCapture` | 12586 | function |  | 1 |
| `applyAltClickCandidate` | 12592 | function |  | 2 |
| `finishBrushAltClick` | 12618 | function |  | 1 |
| `endAltOrbit` | 12631 | function |  | 2 |
| `dollyCameraByDrag` | 12638 | function |  | 2 |
| `fastDragMagnitude` | 12661 | function |  | 2 |
| `beginHoudiniZoomDrag` | 12667 | function |  | 1 |
| `updateHoudiniZoomDrag` | 12675 | function |  | 1 |
| `endHoudiniZoomDrag` | 12692 | function |  | 1 |
| `updateSelectionMarquee` | 12700 | function |  | 1 |
| `pointInsideSelectionMarquee` | 12717 | function |  | 3 |
| `selectPointsInMarquee` | 12725 | function |  | 2 |
| `pointKey` | 12751 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 12782 | function |  | 2 |
| `objectInsideSelectionMarquee` | 12819 | function |  | 3 |
| `projectedPoint` | 12836 | arrow |  | 1 |
| `selectObjectsInMarquee` | 12865 | function |  | 2 |
| `finishSelectionMarquee` | 12910 | function |  | 2 |
| `headMeshes` | 12933 | function |  | 3 |
| `strandSplitProfileData` | 12941 | function |  | 2 |
| `strandSplitControlPoint` | 12954 | function |  | 1 |
| `panelSplitControlPoint` | 12990 | function |  | 3 |
| `panelWidthAt` | 13007 | arrow |  | 3 |
| `panelThicknessAt` | 13014 | arrow |  | 3 |
| `strandControlPointRaycast` | 13047 | function |  | 1 |
| `strandControlPointFrame` | 13082 | function |  | 4 |
| `strandControlPointHitFromEvent` | 13114 | function |  | 3 |
| `createCurveObjects` | 13172 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 13293 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 13300 | function |  | 2 |
| `strandWidthEdgeSample` | 13309 | function |  | 3 |
| `strandWidthEdgePoints` | 13332 | function |  | 2 |
| `sculptBrushDebugRaycast` | 13346 | arrow |  | 0 |
| `updateCurveObjects` | 13348 | function |  | 26 |
| `pointUpDirection` | 13543 | function |  | 2 |
| `curveFrameAtPoint` | 13547 | function |  | 4 |
| `curveFrameAt` | 13568 | function |  | 3 |
| `strandTwistAt` | 13588 | function |  | 6 |
| `controlPointRotationAt` | 13593 | function |  | 3 |
| `strandProfileTwistAt` | 13597 | function |  | 2 |
| `strandFrameAt` | 13603 | function |  | 1 |
| `curveFrameAtSnapshot` | 13609 | function |  | 3 |
| `outwardNormalAtPoint` | 13628 | function |  | 6 |
| `sampledSurfaceNormal` | 13691 | function |  | 2 |
| `guidedNormalAt` | 13707 | function |  | 4 |
| `twistFromHandle` | 13726 | function |  | 3 |
| `signedAngleAroundAxis` | 13747 | function |  | 4 |
| `handleColor` | 13754 | function |  | 2 |
| `isAffectedCurvePoint` | 13777 | function |  | 2 |
| `syncLockFromCurve` | 13783 | function |  | 19 |
| `rebuildLockGeometry` | 13813 | function |  | 8 |
| `flushPendingLockGeometryUpdates` | 13841 | function |  | 7 |
| `updateLockGeometry` | 13854 | function |  | 36 |
| `setGroupColorView` | 13875 | function |  | 2 |
| `createUvCheckerTexture` | 13885 | function |  | 3 |
| `ensureUvCheckerForLock` | 13921 | function |  | 4 |
| `removeUvCheckerFromLock` | 13954 | function |  | 3 |
| `invalidateUvInspector` | 13969 | function |  | 7 |
| `uvInspectorRecord` | 13973 | function |  | 1 |
| `uvInspectorRecords` | 14012 | function |  | 2 |
| `drawUvInspectorGrid` | 14016 | function |  | 2 |
| `renderUvInspector` | 14050 | function |  | 3 |
| `setUvCheckerEnabled` | 14109 | function |  | 3 |
| `strandViewportBaseColor` | 14126 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 14161 | function |  | 3 |
| `syncStrandSelectionOutline` | 14167 | function |  | 2 |
| `applyLockedStrandPalette` | 14178 | function |  | 2 |
| `syncLockedStrandWireVisual` | 14187 | function |  | 6 |
| `setStrandSelectionVisual` | 14196 | function |  | 5 |
| `proceduralParentOutlineVisible` | 14212 | function |  | 2 |
| `syncProceduralParentVisibility` | 14219 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 14228 | function |  | 2 |
| `updateStrandSelectionHighlight` | 14232 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 14236 | function |  | 2 |
| `resetGuideSelectionVisuals` | 14249 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 14269 | function |  | 3 |
| `selectLock` | 14302 | function |  | 35 |
| `deselectStrandsForGuideEditor` | 14364 | function |  | 2 |
| `syncGroupInputs` | 14375 | function |  | 2 |
| `topologyStatsForLock` | 14408 | function |  | 4 |
| `formatTopologyStats` | 14416 | function |  | 5 |
| `updateTopologyStats` | 14420 | function |  | 15 |
| `normalizeStrandDimensions` | 14454 | function |  | 3 |
| `strandBaseWidth` | 14468 | function |  | 5 |
| `strandWidthDimension` | 14472 | function |  | 5 |
| `strandDepthDimension` | 14480 | function |  | 8 |
| `setStrandWidthDimension` | 14488 | function |  | 2 |
| `setStrandDepthDimension` | 14510 | function |  | 4 |
| `syncShapeDimensionInputs` | 14526 | function |  | 4 |
| `syncCreationShapeInputs` | 14562 | function |  | 2 |
| `syncViewportDrawSettings` | 14600 | function |  | 4 |
| `syncStrandSplitInputs` | 14617 | function |  | 4 |
| `syncHairCardControls` | 14626 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 14634 | function |  | 3 |
| `updateAttributeEditorMode` | 14673 | function |  | 11 |
| `pinActiveToolSettingsPanel` | 14823 | function |  | 2 |
| `curveLatticeForGroup` | 14846 | function |  | 2 |
| `filterCurveLatticesToGroup` | 14864 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 14909 | function |  | 2 |
| `showCurveLatticeForGroup` | 14926 | function |  | 2 |
| `selectStrandGroup` | 14963 | function |  | 3 |
| `selectCurvePoint` | 15005 | function |  | 5 |
| `updateSelectedPointLabel` | 15019 | function |  | 12 |
| `syncInputs` | 15032 | function |  | 14 |
| `syncClumpGuidePanel` | 15078 | function |  | 3 |
| `getSelectedLock` | 15105 | function |  | 91 |
| `selectedLocksInOrder` | 15109 | function |  | 37 |
| `lockStrands` | 15115 | function |  | 3 |
| `lockSelectedStrands` | 15148 | function |  | 3 |
| `unlockStrands` | 15154 | function |  | 3 |
| `unlockAllStrands` | 15169 | function |  | 3 |
| `strandEditFamily` | 15173 | function |  | 7 |
| `compatibleSelectedLocks` | 15178 | function |  | 4 |
| `selectedEditRoots` | 15185 | function |  | 2 |
| `editSelectedLocks` | 15198 | function |  | 16 |
| `multiEditValuesEqual` | 15231 | function |  | 2 |
| `setMixedControl` | 15240 | function |  | 28 |
| `syncMultiStrandInputs` | 15257 | function |  | 16 |
| `values` | 15273 | arrow |  | 35 |
| `selectedRebuildableCurves` | 15353 | function |  | 5 |
| `createCompoundStrand` | 15360 | function |  | 1 |
| `refreshRebuildCurveDialog` | 15421 | function |  | 8 |
| `openRebuildCurveDialog` | 15434 | function |  | 1 |
| `rebuildSelectedCurves` | 15448 | function |  | 2 |
| `selectionCanBecomeClump` | 15487 | function |  | 4 |
| `createClumpFromSelection` | 15492 | function |  | 3 |
| `cleanSelectionSets` | 15504 | function |  | 2 |
| `createSelectionSetFromSelection` | 15509 | function |  | 3 |
| `selectionSetById` | 15520 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 15524 | function |  | 7 |
| `editSelectionSetFromSelection` | 15533 | function |  | 5 |
| `deleteSelectionSet` | 15553 | function |  | 2 |
| `selectSelectionSet` | 15562 | function |  | 2 |
| `deleteSelectedStrands` | 15572 | function |  | 4 |
| `deleteGuide` | 15580 | function |  | 3 |
| `deleteSelectedGuide` | 15603 | function |  | 3 |
| `deleteSelectedReferenceImage` | 15607 | function |  | 4 |
| `hasDeletableSelection` | 15620 | function |  | 2 |
| `deleteCurrentSelection` | 15628 | function |  | 3 |
| `hideOutlinerContextMenu` | 15636 | function |  | 17 |
| `outlinerLockTargets` | 15641 | function |  | 3 |
| `showOutlinerContextMenu` | 15668 | function |  | 8 |
| `hideStrandRadialMenu` | 15748 | function |  | 4 |
| `ensureRadialButtonCapacity` | 15759 | function |  | 3 |
| `radialButtonDimensions` | 15772 | function |  | 4 |
| `radialMenuDimensionsForKind` | 15781 | function |  | 3 |
| `applyRadialMenuDimensions` | 15798 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 15804 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 15817 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 15838 | function |  | 2 |
| `selectionSetRadialMenuOption` | 15855 | function |  | 4 |
| `selectedMirrorRadialOptions` | 15864 | function |  | 3 |
| `strandVisibilityRadialOptions` | 15886 | function |  | 5 |
| `clumpMirrorRadialOptions` | 15904 | function |  | 2 |
| `contextualRadialOptions` | 15911 | function |  | 3 |
| `sharedRadialFrameDimensions` | 16040 | function |  | 3 |
| `layoutContextualRadialOptions` | 16044 | function |  | 4 |
| `renderRadialActionList` | 16068 | function |  | 3 |
| `radialListOptionAtPointer` | 16086 | function |  | 3 |
| `syncRadialListHighlight` | 16108 | function |  | 3 |
| `configureContextualRadialMenu` | 16114 | function |  | 3 |
| `beginStrandRadialGesture` | 16174 | function |  | 2 |
| `enterStrandRadialSubmenu` | 16208 | function |  | 2 |
| `updateStrandRadialGesture` | 16254 | function |  | 1 |
| `performStrandRadialAction` | 16293 | function |  | 2 |
| `finishStrandRadialGesture` | 16396 | function |  | 2 |
| `cancelStrandRadialGesture` | 16406 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 16413 | function |  | 1 |
| `setPullMoveEnabled` | 16419 | function |  | 3 |
| `toolRadialOptions` | 16427 | function |  | 2 |
| `hideToolRadialMenu` | 16452 | function |  | 4 |
| `beginToolRadialGesture` | 16465 | function |  | 2 |
| `beginToolShortcutPress` | 16505 | function |  | 2 |
| `finishToolShortcutPress` | 16520 | function |  | 2 |
| `cancelToolShortcutPress` | 16529 | function |  | 5 |
| `setRadialMenusEnabled` | 16537 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 16550 | function |  | 5 |
| `setNavigationTipsEnabled` | 16565 | function |  | 5 |
| `configureNavigationMouseButtons` | 16572 | function |  | 3 |
| `syncNavigationModifierLocks` | 16585 | function |  | 7 |
| `setNavigationStyle` | 16590 | function |  | 5 |
| `applyCameraSmoothingPreference` | 16606 | function |  | 4 |
| `setCameraSmoothingEnabled` | 16621 | function |  | 5 |
| `setCameraSmoothingStrength` | 16627 | function |  | 5 |
| `setScaleSensitivity` | 16635 | function |  | 3 |
| `setToolTipsEnabled` | 16643 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 16650 | function |  | 5 |
| `setViewportStatisticsEnabled` | 16659 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 16667 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 16682 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 16691 | function |  | 5 |
| `sideNamingDisplayId` | 16700 | function |  | 3 |
| `referenceViewDisplayLabel` | 16712 | function |  | 6 |
| `strandRegionDisplayLabel` | 16722 | function |  | 7 |
| `updateSideNamingLabels` | 16740 | function |  | 2 |
| `setSideNamingPerspective` | 16767 | function |  | 5 |
| `setControlPointDisplaySize` | 16776 | function |  | 6 |
| `scaleHexColor` | 16788 | function |  | 3 |
| `setViewportBackgroundColor` | 16793 | function |  | 7 |
| `setDefaultHairShader` | 16815 | function |  | 5 |
| `setPreferenceCategory` | 16821 | function |  | 4 |
| `openPreferencesDialog` | 16848 | function |  | 1 |
| `savePreferencesDialog` | 16876 | function |  | 1 |
| `cancelPreferencesDialog` | 16900 | function |  | 3 |
| `updateToolRadialGesture` | 16929 | function |  | 1 |
| `performToolRadialAction` | 16958 | function |  | 2 |
| `finishToolRadialGesture` | 16968 | function |  | 2 |
| `cancelToolRadialGesture` | 16977 | function |  | 5 |
| `duplicatePlacementTarget` | 16984 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 17011 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 17015 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 17025 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 17030 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 17042 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 17053 | function |  | 7 |
| `openProceduralDuplicateDialog` | 17061 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 17078 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 17099 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 17110 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 17116 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 17122 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 17155 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 17310 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 17412 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 17453 | function |  | 2 |
| `updateDuplicatePlacement` | 17480 | function |  | 2 |
| `beginDuplicatePlacement` | 17544 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 17608 | function |  | 2 |
| `confirmDuplicatePlacement` | 17649 | function |  | 1 |
| `cancelDuplicatePlacement` | 17686 | function |  | 4 |
| `outlinerClumpLocks` | 17712 | function |  | 11 |
| `handleOutlinerClumpDrop` | 17716 | function |  | 3 |
| `createOutlinerStrandButton` | 17739 | function |  | 4 |
| `createOutlinerCurveSurface` | 17825 | function |  | 2 |
| `createOutlinerClump` | 17921 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 18003 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 18010 | function |  | 2 |
| `renderLockList` | 18089 | function |  | 53 |
| `updateCount` | 18243 | function |  | 18 |
| `captureInputUndo` | 18252 | function |  | 1 |
| `bindUndoCapture` | 18258 | function |  | 37 |
| `bindLockInput` | 18269 | function |  | 2 |
| `applyValue` | 18286 | arrow |  | 2 |
| `applyUniformTransformScale` | 18605 | function |  | 2 |
| `applyReducedTransformScale` | 18622 | function |  | 2 |
| `applyTransformPrecision` | 18661 | function |  | 2 |
| `updateTransformScalePointer` | 18690 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 19687 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 19692 | function |  | 4 |
| `syncDrawCurlControls` | 19747 | function |  | 5 |
| `handleLiveSurfaceChange` | 19795 | function |  | 1 |
| `selectedBranchChildLock` | 20086 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 20090 | function |  | 2 |
| `initPanelResizeHandles` | 20196 | function |  | 2 |
| `applyWidth` | 20202 | arrow |  | 2 |
| `restoreWidth` | 20209 | arrow |  | 2 |
| `bindResize` | 20217 | arrow |  | 2 |
| `onMove` | 20226 | arrow |  | 0 |
| `onUp` | 20230 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 20247 | function |  | 2 |
| `initFloatingPanelControls` | 20256 | function |  | 2 |
| `detach` | 20265 | arrow |  | 26 |
| `endDrag` | 20303 | arrow |  | 0 |
| `endResize` | 20335 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 20346 | function |  | 3 |
| `selectPatchNotesVersion` | 20480 | function |  | 3 |
| `requestReferenceImage` | 20513 | function |  | 5 |
| `toggleCapsuleGuideTool` | 20717 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 20723 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 20730 | function |  | 1 |
| `deleteLocks` | 21297 | function |  | 10 |
| `disposeCurveObjects` | 21375 | function |  | 4 |
| `resize` | 21437 | function |  | 3 |
| `handleViewportPointerMove` | 21448 | function |  | 1 |
| `blockProportionalSizingEvent` | 21459 | function |  | 1 |
| `updateLightAngleFromInputs` | 21465 | function |  | 2 |
| `startViewSnap` | 21479 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 21509 | function |  | 3 |
| `trackViewportPointerDown` | 21526 | function |  | 1 |
| `trackViewportPointerMove` | 21542 | function |  | 1 |
| `clearViewportPointer` | 21550 | function |  | 1 |
| `updateViewSnap` | 21555 | function |  | 1 |
| `nearestCardinalAxis` | 21591 | function |  | 5 |
| `cardinalAxisKey` | 21605 | function |  | 5 |
| `steppedDragAmount` | 21609 | function |  | 3 |
| `snapCameraToCardinalAxis` | 21615 | function |  | 4 |
| `endViewSnap` | 21631 | function |  | 4 |
| `activateStrandControlPoint` | 21641 | function |  | 2 |
| `refreshStrandControlPointSelection` | 21691 | function |  | 4 |
| `addStrandControlPointSelection` | 21718 | function |  | 2 |
| `removeStrandControlPointSelection` | 21735 | function |  | 3 |
| `sampleStrandPointNormal` | 21749 | function |  | 2 |
| `sampleStrandPointVectors` | 21759 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 21765 | function |  | 2 |
| `resampleStrandCurveData` | 21776 | function |  | 4 |
| `resampleMatchingVectors` | 21782 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 21821 | function |  | 4 |
| `removeStrandCurvePoint` | 21832 | function |  | 2 |
| `closestStrandCurveParameter` | 21845 | function |  | 1 |
| `insertStrandCurvePoint` | 21874 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 21891 | function |  | 2 |
| `selectionModifierCursorAvailable` | 21901 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 21917 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 21924 | function |  | 4 |
| `finishCurvePointInsertion` | 21947 | function |  | 1 |
| `finishPointRemoval` | 21962 | function |  | 1 |
| `isHairCreateTool` | 21981 | function |  | 4 |
| `syncStrandHoverOutline` | 21985 | function |  | 1 |
| `pointerOverTaperEditor` | 21998 | function |  | 2 |
| `updateStrandBrushHover` | 22005 | function |  | 1 |
| `strandControlPointHit` | 22029 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 22033 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 22111 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 22145 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 22185 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 22198 | function |  | 1 |
| `setHoveredControlPoint` | 22237 | function |  | 7 |
| `visibleControlPointHoverTargets` | 22250 | function |  | 2 |
| `updateControlPointHover` | 22286 | function |  | 1 |
| `animate` | 22901 | function |  | 2 |
| `syncCompactSidebarLayout` | 22932 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 22951 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 22957 | function |  | 3 |
| `setAttributeEditorTab` | 22963 | function |  | 6 |

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

## modules/geometry/draw-flow.js（1453 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createDrawFlowApi` | 34 | function | export | 2 |
| `activeDrawClumpTemplate` | 56 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 61 | function |  | 2 |
| `drawModeCreatesClump` | 88 | function |  | 1 |
| `selectedCurveLatticeGuide` | 92 | function |  | 2 |
| `braidStrokeActive` | 99 | function |  | 7 |
| `proceduralDrawActive` | 103 | function |  | 3 |
| `panelStrokeActive` | 107 | function |  | 5 |
| `activeStrokeSurfaceInput` | 111 | function |  | 3 |
| `activeStrokeSurfaceValue` | 115 | function |  | 10 |
| `normalizedLiveSurfaceSelection` | 119 | function |  | 3 |
| `activeStrokeDynamicEnabled` | 125 | function |  | 3 |
| `drawSurfaceDynamicEnabled` | 129 | function |  | 2 |
| `setDrawSurfaceDynamicEnabled` | 133 | function |  | 3 |
| `setActiveStrokeSurfaceValue` | 137 | function |  | 1 |
| `liveSurfaceStrandId` | 147 | function |  | 4 |
| `liveSurfaceStrand` | 151 | function |  | 2 |
| `liveSurfaceGuideId` | 156 | function |  | 3 |
| `guideSupportsLiveSurface` | 160 | function |  | 2 |
| `liveSurfaceGuide` | 167 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 174 | function |  | 1 |
| `activeStrokeBrushSize` | 214 | function |  | 4 |
| `activeStrokeBrushDepth` | 220 | function |  | 3 |
| `strokeSurfaceIsContextual` | 226 | function |  | 3 |
| `contextualPlaneAtOrigin` | 234 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 244 | function |  | 3 |
| `worldNormalAtHit` | 283 | function |  | 3 |
| `drawSampleFromHit` | 291 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 305 | function |  | 2 |
| `strokeLength` | 342 | function |  | 8 |
| `resampleDrawStroke` | 348 | function |  | 2 |
| `processedDrawStroke` | 380 | function |  | 6 |
| `strokeSurfaceNormals` | 409 | function |  | 6 |
| `drawClumpFrame` | 420 | function |  | 4 |
| `nearestCurveParameter` | 429 | function |  | 2 |
| `drawClumpSampleNormal` | 443 | function |  | 5 |
| `drawClumpTemplateVector` | 452 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 458 | function |  | 3 |
| `drawClumpStrandMaps` | 474 | function |  | 3 |
| `updateDrawVolumePreview` | 529 | function |  | 5 |
| `hideDrawClumpPreviews` | 553 | function |  | 5 |
| `resetDrawVolumePreview` | 559 | function |  | 3 |
| `updateDrawStrandPreview` | 565 | function |  | 3 |
| `continueFromTipEnabled` | 786 | function |  | 2 |
| `selectedTipContinuationLock` | 792 | function |  | 2 |
| `beginDrawStrandStroke` | 805 | function |  | 1 |
| `beginDrawFreePlane` | 934 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 948 | function |  | 2 |
| `updateDrawStrandStroke` | 973 | function |  | 1 |
| `createDrawnLock` | 1019 | function |  | 2 |
| `setting` | 1023 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 1091 | function |  | 4 |
| `createDrawnBraid` | 1099 | function |  | 2 |
| `createDrawnStrand` | 1156 | function |  | 2 |
| `createDrawnPanel` | 1283 | function |  | 2 |
| `extendDrawnStrand` | 1335 | function |  | 2 |
| `finishDrawStrandStroke` | 1368 | function |  | 1 |

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
