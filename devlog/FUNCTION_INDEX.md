# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1809** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（28230 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 274 | function |  | 3 |
| `saveBooleanPreference` | 302 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 306 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 311 | function |  | 2 |
| `normalizeScaleSensitivity` | 316 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 321 | function |  | 2 |
| `normalizeSideNamingPerspective` | 326 | function |  | 2 |
| `normalizeNavigationStyle` | 330 | function |  | 2 |
| `setupEditableSliderControls` | 345 | function |  | 2 |
| `syncNumberFromRange` | 396 | arrow |  | 0 |
| `applyNumberValue` | 403 | arrow |  | 0 |
| `copyCameraPose` | 509 | function |  | 3 |
| `updateCameraProjectionForViewport` | 515 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 528 | function |  | 3 |
| `setOrthographicView` | 534 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 574 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 603 | function |  | 2 |
| `removeRotateFreeAxisRing` | 629 | function |  | 2 |
| `deflateTransformGizmoPickers` | 641 | function |  | 2 |
| `nextStrandName` | 1036 | function |  | 2 |
| `activeDrawClumpTemplate` | 1121 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1126 | function |  | 3 |
| `drawModeCreatesClump` | 1153 | function |  | 1 |
| `isPanelGeometry` | 1297 | function |  | 49 |
| `normalizePanelSplits` | 1301 | function |  | 2 |
| `clonePanelSplits` | 1313 | function |  | 30 |
| `snapPanelSplitHeight` | 1317 | function |  | 5 |
| `createQuadSphereGeometry` | 1352 | function |  | 2 |
| `vertexIndex` | 1366 | function |  | 5 |
| `addEdge` | 1384 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1560 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1740 | function |  | 2 |
| `currentStrandSelectionState` | 1802 | function |  | 4 |
| `applyStrandSelectionState` | 1806 | function |  | 5 |
| `clearStrandSelectionState` | 1811 | function |  | 6 |
| `disposeGuideModel` | 2863 | function |  | 3 |
| `syncHeadTransformInputs` | 2874 | function |  | 3 |
| `applyHeadTransform` | 2881 | function |  | 4 |
| `resetHeadTransform` | 2901 | function |  | 2 |
| `installGuideModel` | 2916 | function |  | 5 |
| `loadDefaultGuideModel` | 2992 | function |  | 3 |
| `braidTemplateFromEntries` | 3015 | function |  | 4 |
| `braidMeshEntries` | 3047 | function |  | 2 |
| `prepareBraidBodyCache` | 3059 | function |  | 2 |
| `quantize` | 3068 | arrow |  | 21 |
| `sourceNormalAt` | 3080 | arrow |  | 1 |
| `clusterBoundary` | 3083 | arrow |  | 2 |
| `normalBuckets` | 3100 | arrow |  | 2 |
| `applyBucketPair` | 3132 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3163 | function |  | 2 |
| `annotateBraidObjTopology` | 3184 | function |  | 2 |
| `loadBraidMeshPreset` | 3204 | function |  | 3 |
| `createSplitControlHandle` | 3221 | function |  | 6 |
| `frameGuideModel` | 3236 | function |  | 2 |
| `normalizeHairLayer` | 3265 | function |  | 26 |
| `layerOffsetForLock` | 3269 | function |  | 8 |
| `layerRootOffsetFactor` | 3274 | function |  | 12 |
| `layerOffsetWeight` | 3278 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3284 | function |  | 5 |
| `pointsWithLayerOffset` | 3293 | function |  | 3 |
| `layerDirectionForLock` | 3301 | function |  | 2 |
| `applyLayerOffset` | 3312 | function |  | 5 |
| `setLockHairLayer` | 3336 | function |  | 2 |
| `setGroupLayerOffset` | 3351 | function |  | 2 |
| `quadraticWeights` | 3379 | function |  | 1 |
| `setHeadReferenceTransparency` | 3390 | function |  | 4 |
| `trianglePlaneIntersections` | 3402 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3423 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3632 | function |  | 1 |
| `upperContourCurve` | 3649 | function |  | 2 |
| `hermitePoint` | 3684 | function |  | 2 |
| `curveNetworkSection` | 3695 | function |  | 1 |
| `pointAlongSection` | 3724 | function |  | 1 |
| `longestStitchedContour` | 3730 | function |  | 2 |
| `nodeForPoint` | 3738 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3795 | function |  | 1 |
| `exitSetupEditors` | 3815 | function |  | 6 |
| `syncAppMenuVisibility` | 3825 | function |  | 3 |
| `closeAppMenus` | 3831 | function |  | 6 |
| `setAppMenuOpen` | 3842 | function |  | 2 |
| `setTurntableActive` | 3849 | function |  | 3 |
| `selectedReferenceImage` | 3859 | function |  | 20 |
| `normalizeReferenceCrop` | 3865 | function |  | 8 |
| `referenceCropIsFull` | 3873 | function |  | 3 |
| `referencePlaneFrontAxis` | 3878 | function |  | 4 |
| `referencePlanePlacement` | 3887 | function |  | 4 |
| `migratedReferencePlanePosition` | 3902 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3922 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3939 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3955 | function |  | 2 |
| `snappedReferenceImageView` | 3978 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3984 | function |  | 5 |
| `applyReferenceImageRuntime` | 4000 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4043 | function |  | 6 |
| `createReferenceImageRuntime` | 4051 | function |  | 3 |
| `addReferenceImage` | 4120 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4172 | function |  | 3 |
| `disposeReferenceImage` | 4191 | function |  | 2 |
| `clearReferenceImages` | 4195 | function |  | 2 |
| `serializeReferenceImage` | 4202 | function |  | 1 |
| `setReferenceImageType` | 4230 | function |  | 2 |
| `attachReferenceImageTransform` | 4274 | function |  | 6 |
| `selectReferenceImage` | 4288 | function |  | 12 |
| `placeReferencePlane` | 4311 | function |  | 2 |
| `setReferencePlaneInFront` | 4322 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4332 | function |  | 4 |
| `renderReferenceImagePanel` | 4351 | function |  | 20 |
| `setOutlinerTab` | 4398 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4416 | function |  | 4 |
| `componentEditModeActive` | 4420 | function |  | 30 |
| `selectionToolSupportsPicking` | 4424 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4429 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4445 | function |  | 2 |
| `setViewportSelectionMode` | 4475 | function |  | 4 |
| `setViewportEditMode` | 4487 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4529 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4543 | function |  | 8 |
| `normalizeOutlinerName` | 4557 | function |  | 3 |
| `beginOutlinerRename` | 4562 | function |  | 2 |
| `finish` | 4573 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4603 | function |  | 6 |
| `referenceOutlinerGroup` | 4615 | function |  | 2 |
| `renderReferenceOutliner` | 4619 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4736 | function |  | 5 |
| `readReferenceImageFile` | 4741 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4765 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4772 | function |  | 3 |
| `dragContainsReferenceImage` | 4817 | function |  | 3 |
| `setReferenceImageDragActive` | 4828 | function |  | 9 |
| `referenceDropDestination` | 4836 | function |  | 2 |
| `viewportOverlayDropPosition` | 4842 | function |  | 2 |
| `setReferenceDropHover` | 4851 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4869 | function |  | 2 |
| `referenceOverlayAtPointer` | 4889 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4907 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4920 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4966 | function |  | 1 |
| `finishReferenceOverlayDrag` | 5016 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5038 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5049 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5075 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5084 | function |  | 2 |
| `referenceCropCursor` | 5099 | function |  | 3 |
| `updateReferenceCropHandles` | 5105 | function |  | 5 |
| `referenceCropSourcePoint` | 5126 | function |  | 2 |
| `beginReferenceCrop` | 5133 | function |  | 1 |
| `updateReferenceCrop` | 5171 | function |  | 1 |
| `finishReferenceCrop` | 5203 | function |  | 4 |
| `setHeadSetupEditing` | 5221 | function |  | 6 |
| `strandPassesDisplayFilters` | 5247 | function |  | 4 |
| `strandVisibleForDisplay` | 5256 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 5261 | function |  | 3 |
| `lockedStrandsExist` | 5265 | function |  | 3 |
| `hiddenStrandsExist` | 5269 | function |  | 2 |
| `hideSelectedStrands` | 5273 | function |  | 2 |
| `unhideHiddenStrands` | 5283 | function |  | 2 |
| `strandIsolationActive` | 5292 | function |  | 7 |
| `setStrandIsolation` | 5296 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5308 | function |  | 3 |
| `syncVisibilityParent` | 5319 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5326 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5355 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5362 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5385 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5603 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5624 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5643 | function |  | 2 |
| `selectedViewportFocusBounds` | 5741 | function |  | 2 |
| `frameViewportBounds` | 5755 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5785 | function |  | 2 |
| `fullSceneFocusBounds` | 5789 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5804 | function |  | 3 |
| `cycleViewportFraming` | 5813 | function |  | 2 |
| `sculptBrushToolActive` | 5833 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 5837 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5841 | function |  | 3 |
| `effectiveSculptBrushTool` | 5845 | function |  | 15 |
| `updateSculptScaleModeRow` | 5851 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5856 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5878 | function |  | 5 |
| `setActiveTool` | 5887 | function |  | 12 |
| `setDrawStrandMode` | 6025 | function |  | 2 |
| `setObjectSpaceEditing` | 6035 | function |  | 7 |
| `setHierarchyEditing` | 6051 | function |  | 4 |
| `setProportionalEditing` | 6063 | function |  | 5 |
| `beginProportionalSizeEdit` | 6082 | function |  | 3 |
| `updateProportionalSizeEdit` | 6094 | function |  | 2 |
| `endProportionalSizeEdit` | 6105 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6112 | function |  | 2 |
| `refreshProportionalPreview` | 6120 | function |  | 4 |
| `activeBrushSizeInput` | 6130 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6139 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6151 | function |  | 2 |
| `beginBrushSizeDrag` | 6169 | function |  | 1 |
| `updateBrushSizeDrag` | 6196 | function |  | 1 |
| `finishBrushSizeDrag` | 6217 | function |  | 2 |
| `updateInteractionLocks` | 6234 | function |  | 64 |
| `configureTransformControls` | 6245 | function |  | 13 |
| `pullMoveActive` | 6253 | function |  | 9 |
| `updatePullGuideVisual` | 6257 | function |  | 4 |
| `attachTransformForCurvePoint` | 6273 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6297 | function |  | 6 |
| `strandObjectRootIndex` | 6313 | function |  | 3 |
| `strandObjectRoot` | 6322 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6326 | function |  | 2 |
| `attachStrandObjectTransform` | 6331 | function |  | 6 |
| `guideObjectPivot` | 6354 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6365 | function |  | 2 |
| `attachGuideObjectTransform` | 6370 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6389 | function |  | 2 |
| `beginGuideObjectTransform` | 6417 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6424 | function |  | 2 |
| `updateGuideObjectTransform` | 6446 | function |  | 2 |
| `finishGuideObjectTransform` | 6479 | function |  | 2 |
| `clonePlacementFrame` | 6488 | function |  | 2 |
| `cloneOptionalVectors` | 6500 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6504 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6521 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6536 | function |  | 2 |
| `strandObjectTransformOperators` | 6552 | function |  | 4 |
| `transformPoint` | 6560 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6567 | arrow |  | 0 |
| `transformNormal` | 6573 | arrow |  | 10 |
| `transformDirection` | 6583 | arrow |  | 5 |
| `worldMatrixForPivot` | 6595 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6601 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6617 | function |  | 6 |
| `beginStrandObjectTransform` | 6643 | function |  | 2 |
| `updateStrandObjectTransform` | 6681 | function |  | 2 |
| `commitStrandObjectTransform` | 6739 | function |  | 2 |
| `mapPoints` | 6752 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6786 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6800 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6823 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6836 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6851 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6877 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6926 | function |  | 2 |
| `beginHandleEdit` | 6935 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6988 | function |  | 3 |
| `multiPointHandleEditActive` | 6999 | function |  | 7 |
| `applyMultiMove` | 7003 | function |  | 5 |
| `applyMultiRotate` | 7009 | function |  | 2 |
| `applyMultiScale` | 7018 | function |  | 2 |
| `applyHierarchicalMove` | 7027 | function |  | 3 |
| `applySingleMove` | 7039 | function |  | 5 |
| `applySurfaceLatticeMirror` | 7043 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 7060 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 7069 | function |  | 3 |
| `changed` | 7079 | arrow |  | 1 |
| `applyPullMove` | 7121 | function |  | 3 |
| `pullHeadCollisionContext` | 7129 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7148 | function |  | 2 |
| `applyProportionalMove` | 7171 | function |  | 3 |
| `viewPlaneNormal` | 7182 | function |  | 12 |
| `isCameraInSnappedView` | 7186 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7194 | function |  | 9 |
| `updateViewPlaneGrid` | 7198 | function |  | 14 |
| `setViewPlaneMove` | 7255 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7266 | function |  | 2 |
| `rayFromViewportEvent` | 7274 | function |  | 11 |
| `worldUnitsPerViewportPixel` | 7282 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7292 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7303 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7316 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7335 | function |  | 4 |
| `beginViewPlaneMove` | 7342 | function |  | 3 |
| `updateViewPlaneMove` | 7406 | function |  | 1 |
| `endViewPlaneMove` | 7471 | function |  | 7 |
| `applyHierarchicalRotate` | 7490 | function |  | 2 |
| `rotateGuideNormal` | 7497 | arrow |  | 4 |
| `applySingleRotate` | 7535 | function |  | 2 |
| `applyProportionalRotate` | 7539 | function |  | 2 |
| `applyHierarchicalScale` | 7559 | function |  | 2 |
| `applySingleScale` | 7569 | function |  | 2 |
| `applyProportionalScale` | 7573 | function |  | 2 |
| `setPointScale` | 7589 | function |  | 8 |
| `proportionalWeight` | 7598 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7610 | function |  | 5 |
| `strandInfluenceColor` | 7616 | function |  | 4 |
| `beginRelaxEdit` | 7641 | function |  | 3 |
| `updateRelaxEdit` | 7670 | function |  | 1 |
| `endRelaxEdit` | 7730 | function |  | 1 |
| `disposeGuide` | 7740 | function |  | 3 |
| `removeGuideObjects` | 7768 | function |  | 3 |
| `strandRadiusAt` | 7782 | function |  | 5 |
| `strandProfileTopologyAt` | 7799 | function |  | 2 |
| `strandCurveParameters` | 7841 | function |  | 1 |
| `widthProfileAt` | 7851 | arrow |  | 1 |
| `braidFrameAt` | 7889 | function |  | 4 |
| `braidFrameAtExtended` | 7899 | function |  | 2 |
| `createBraidProfileProjector` | 7908 | function |  | 2 |
| `project` | 7924 | arrow |  | 21 |
| `createBraidGeometry` | 7939 | function |  | 1 |
| `deformationAt` | 7974 | function |  | 3 |
| `widthFor` | 7983 | arrow |  | 3 |
| `depthFor` | 7987 | arrow |  | 3 |
| `outputVertex` | 8019 | function |  | 7 |
| `appendAuthoredCap` | 8127 | function |  | 3 |
| `outputCapVertex` | 8134 | arrow |  | 6 |
| `capBoundary` | 8225 | function |  | 3 |
| `strandGeometryCurve` | 8287 | function |  | 8 |
| `strandGeometryFrameAt` | 8313 | function |  | 6 |
| `transportedStrandFrameAt` | 8376 | function |  | 5 |
| `twistOverrideAt` | 8379 | arrow |  | 2 |
| `hairMaterialDefinition` | 8449 | function |  | 4 |
| `materialForLock` | 8453 | function |  | 8 |
| `activeHairMaterialDefinition` | 8457 | function |  | 11 |
| `strandDisplayColor` | 8463 | function |  | 14 |
| `setAnimeHairBaseColor` | 8481 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 8494 | function |  | 2 |
| `createHairMaterial` | 8534 | function |  | 5 |
| `createStrandSelectionOutline` | 8576 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 8611 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 8620 | function |  | 6 |
| `refreshMaterialUsers` | 8647 | function |  | 6 |
| `renderHairMaterialOutliner` | 8656 | function |  | 5 |
| `renderHairMaterialOptions` | 8686 | function |  | 3 |
| `syncHairMaterialEditor` | 8696 | function |  | 9 |
| `createProjectHairMaterial` | 8722 | function |  | 3 |
| `deleteActiveHairMaterial` | 8742 | function |  | 2 |
| `createHairTopologyGeometry` | 8760 | function |  | 4 |
| `createHairTopologyOverlay` | 8781 | function |  | 3 |
| `groupDefaultsFor` | 8828 | function |  | 9 |
| `creationToolActive` | 8835 | function |  | 5 |
| `activeCreationShapeDefaults` | 8839 | function |  | 7 |
| `curvePolylineLength` | 8846 | function |  | 2 |
| `curvePolylineLengths` | 8854 | function |  | 3 |
| `samplePolylineDistance` | 8862 | function |  | 2 |
| `applyProjectedCurveLength` | 8872 | function |  | 4 |
| `clearRegionLengthBaseline` | 8903 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8910 | function |  | 2 |
| `setGroupLengthScale` | 8918 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 8956 | function |  | 3 |
| `requestGroupDefaultsWarning` | 8988 | function |  | 1 |
| `activeProfileOffset` | 9000 | function |  | 3 |
| `profileToCanvas` | 9008 | function |  | 1 |
| `renderProfilePreview` | 9015 | function |  | 7 |
| `renderHairCardCoveragePath` | 9034 | function |  | 2 |
| `setupShapePresetControls` | 9173 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 9198 | function |  | 3 |
| `syncShapePresetSelects` | 9204 | function |  | 5 |
| `populateShapePresetSelects` | 9225 | function |  | 5 |
| `openSaveShapePreset` | 9253 | function |  | 2 |
| `commitCustomShapePreset` | 9278 | function |  | 2 |
| `openRemoveShapePreset` | 9301 | function |  | 2 |
| `commitRemoveShapePreset` | 9314 | function |  | 2 |
| `openPanelSegmentCurveEditor` | 9350 | function |  | 3 |
| `updateViewportStatsVisibility` | 9387 | function |  | 3 |
| `canvasToProfile` | 9406 | function |  | 2 |
| `addLock` | 9421 | function |  | 16 |
| `mirroredVector` | 9633 | function |  | 12 |
| `mirroredPlacementFrame` | 9637 | function |  | 2 |
| `mirrorPartnerFor` | 9650 | function |  | 39 |
| `decoupleMirrorPartner` | 9654 | function |  | 2 |
| `createMirrorPartner` | 9662 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 9758 | function |  | 6 |
| `mirroredClumpPartners` | 9763 | function |  | 6 |
| `createMirroredClump` | 9769 | function |  | 3 |
| `decoupleMirroredClump` | 9791 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 9811 | function |  | 6 |
| `syncActiveMirror` | 9978 | function |  | 29 |
| `setMirrorXEditing` | 9990 | function |  | 5 |
| `snapshotState` | 10014 | function |  | 7 |
| `rootAttachmentFrame` | 10275 | function |  | 3 |
| `rootAttachmentLocalFrame` | 10287 | function |  | 4 |
| `resolveRootAttachment` | 10305 | function |  | 4 |
| `curvePointsToRootLocal` | 10345 | function |  | 2 |
| `curvePointsFromRootLocal` | 10357 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 10365 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 10381 | function |  | 2 |
| `createRootAttachment` | 10412 | function |  | 7 |
| `syncRootAttachmentMetadata` | 10442 | function |  | 3 |
| `rootAttachmentToData` | 10469 | function |  | 2 |
| `rootAttachmentFromData` | 10497 | function |  | 3 |
| `importHeadMeshFile` | 10539 | function |  | 3 |
| `importFullBodyMeshFile` | 10562 | function |  | 3 |
| `downloadPreferencesAndPresets` | 10587 | function |  | 1 |
| `importedBooleanPreference` | 10620 | function |  | 11 |
| `loadPreferencesAndPresets` | 10634 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 10704 | function |  | 1 |
| `openHairProjectFile` | 10748 | function |  | 4 |
| `dragContainsApplicationFile` | 10806 | function |  | 3 |
| `safelyRememberRecentProject` | 10815 | function |  | 2 |
| `renderRecentProjectsMenu` | 10824 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 10856 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 10881 | function |  | 2 |
| `confirmDroppedApplicationFile` | 10885 | function |  | 2 |
| `pushUndoState` | 10901 | function |  | 98 |
| `undoLastAction` | 10908 | function |  | 2 |
| `redoLastAction` | 10925 | function |  | 2 |
| `updateHistoryButtons` | 10942 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 10947 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 10967 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 10974 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 11013 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 11039 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 11071 | function |  | 2 |
| `finalizeStateRestore` | 11112 | function |  | 2 |
| `restoreState` | 11119 | function |  | 5 |
| `disposeAllEditableObjects` | 11143 | function |  | 2 |
| `restoreLock` | 11164 | function |  | 4 |
| `restoreGuide` | 11388 | function |  | 2 |
| `vectorToData` | 11449 | function |  | 25 |
| `dataToVector` | 11453 | function |  | 22 |
| `frameToData` | 11457 | function |  | 2 |
| `frameFromData` | 11469 | function |  | 2 |
| `applyPresetSelection` | 11481 | function |  | 2 |
| `drawPresetThumbnail` | 11512 | function |  | 1 |
| `fillHair` | 11527 | arrow |  | 9 |
| `strand` | 11539 | arrow |  | 31 |
| `bun` | 11557 | arrow |  | 2 |
| `braid` | 11592 | arrow |  | 2 |
| `renderPresetLibrary` | 11681 | function |  | 3 |
| `setPresetLibraryOpen` | 11740 | function |  | 6 |
| `average` | 11753 | function |  | 4 |
| `fitPointAttributes` | 11757 | function |  | 7 |
| `rebuildCurveObjects` | 11786 | function |  | 9 |
| `createCurvePoints` | 11798 | function |  | 2 |
| `addGeneratedBangPreset` | 11807 | function |  | 1 |
| `createLongLayeredCurlPoints` | 11901 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 11950 | function |  | 1 |
| `columns` | 11951 | arrow |  | 1 |
| `layer` | 11955 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 12169 | function |  | 2 |
| `addBraidedBobPreset` | 12205 | function |  | 1 |
| `evenColumns` | 12206 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 12422 | function |  | 1 |
| `scalpSeed` | 12445 | arrow |  | 1 |
| `createBowlCutPoints` | 12732 | function |  | 2 |
| `addBowlCutPreset` | 12770 | function |  | 1 |
| `selectedCurveLatticeGuide` | 12838 | function |  | 10 |
| `braidStrokeActive` | 12845 | function |  | 8 |
| `proceduralDrawActive` | 12849 | function |  | 3 |
| `panelStrokeActive` | 12853 | function |  | 5 |
| `activeStrokeSurfaceInput` | 12857 | function |  | 4 |
| `activeStrokeSurfaceValue` | 12861 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 12865 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 12871 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 12875 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 12879 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 12883 | function |  | 3 |
| `liveSurfaceStrandId` | 12893 | function |  | 4 |
| `liveSurfaceStrand` | 12897 | function |  | 2 |
| `liveSurfaceGuideId` | 12902 | function |  | 3 |
| `guideSupportsLiveSurface` | 12906 | function |  | 2 |
| `liveSurfaceGuide` | 12913 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 12920 | function |  | 10 |
| `activeStrokeBrushSize` | 12961 | function |  | 10 |
| `activeStrokeBrushDepth` | 12967 | function |  | 5 |
| `strokeSurfaceIsContextual` | 12973 | function |  | 3 |
| `contextualPlaneAtOrigin` | 12981 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 12991 | function |  | 7 |
| `worldNormalAtHit` | 13030 | function |  | 4 |
| `drawSampleFromHit` | 13039 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 13053 | function |  | 3 |
| `strokeLength` | 13090 | function |  | 8 |
| `resampleDrawStroke` | 13096 | function |  | 2 |
| `processedDrawStroke` | 13128 | function |  | 6 |
| `strokeSurfaceNormals` | 13157 | function |  | 6 |
| `drawClumpFrame` | 13168 | function |  | 4 |
| `nearestCurveParameter` | 13177 | function |  | 2 |
| `drawClumpSampleNormal` | 13191 | function |  | 5 |
| `drawClumpTemplateVector` | 13200 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 13206 | function |  | 3 |
| `drawClumpStrandMaps` | 13222 | function |  | 4 |
| `nextClumpName` | 13277 | function |  | 6 |
| `initializeClumpShape` | 13284 | function |  | 5 |
| `stableClumpVariation` | 13295 | function |  | 3 |
| `createClumpFromLocks` | 13307 | function |  | 7 |
| `addLockToClump` | 13332 | function |  | 4 |
| `pointerToNdc` | 13388 | function |  | 1 |
| `gridProfileSkipCol` | 13404 | function |  | 1 |
| `clumpDirectMembers` | 13428 | function |  | 3 |
| `clumpMembersForGuide` | 13433 | function |  | 6 |
| `clumpGuideForLock` | 13437 | function |  | 13 |
| `proceduralGuideForLock` | 13442 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 13449 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 13456 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 13463 | function |  | 2 |
| `proceduralBranchWorldPoints` | 13475 | function |  | 1 |
| `applyProceduralBranchSettings` | 13488 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 13527 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 13543 | function |  | 3 |
| `createProceduralAccessoryLock` | 13557 | function |  | 2 |
| `applyProceduralAccessorySettings` | 13609 | function |  | 2 |
| `clumpFrameAt` | 13660 | function |  | 5 |
| `commitClumpMemberRestState` | 13668 | function |  | 10 |
| `updateClumpMembers` | 13751 | function |  | 10 |
| `dissolveClump` | 13855 | function |  | 6 |
| `detachLockFromClump` | 13892 | function |  | 4 |
| `updateDrawVolumePreview` | 13918 | function |  | 5 |
| `hideDrawClumpPreviews` | 13942 | function |  | 5 |
| `resetDrawVolumePreview` | 13948 | function |  | 3 |
| `updateDrawStrandPreview` | 13954 | function |  | 22 |
| `continueFromTipEnabled` | 14175 | function |  | 2 |
| `selectedTipContinuationLock` | 14181 | function |  | 3 |
| `beginDrawStrandStroke` | 14196 | function |  | 2 |
| `beginDrawFreePlane` | 14325 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 14339 | function |  | 2 |
| `updateDrawStrandStroke` | 14364 | function |  | 1 |
| `createDrawnLock` | 14410 | function |  | 3 |
| `setting` | 14414 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 14482 | function |  | 4 |
| `createDrawnBraid` | 14490 | function |  | 2 |
| `createDrawnStrand` | 14547 | function |  | 2 |
| `createDrawnPanel` | 14674 | function |  | 2 |
| `extendDrawnStrand` | 14726 | function |  | 2 |
| `finishDrawStrandStroke` | 14759 | function |  | 6 |
| `createPlacedStrand` | 14786 | function |  | 2 |
| `placedPointCount` | 14850 | function |  | 3 |
| `createPlacedPoints` | 14854 | function |  | 3 |
| `pushPointOutsideHead` | 14873 | function |  | 8 |
| `resizePlacedStrand` | 14905 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 14922 | function |  | 5 |
| `beginPlaceEdit` | 14927 | function |  | 2 |
| `updatePlaceEdit` | 14945 | function |  | 1 |
| `updatePlacementLength` | 14959 | function |  | 3 |
| `updatePlacementOrientation` | 14969 | function |  | 3 |
| `endPlaceEdit` | 14987 | function |  | 1 |
| `confirmPendingPlacedStrand` | 15002 | function |  | 1 |
| `pendingPlacedLock` | 15012 | function |  | 2 |
| `beginPlacementPointer` | 15016 | function |  | 3 |
| `finishPlacementPointer` | 15026 | function |  | 2 |
| `confirmPlacementStep` | 15050 | function |  | 2 |
| `finishPlacementFlow` | 15073 | function |  | 6 |
| `updatePlacementStatus` | 15086 | function |  | 53 |
| `deselectStrands` | 15225 | function |  | 11 |
| `beginSelectionMarquee` | 15240 | function |  | 3 |
| `beginAltOrbit` | 15264 | function |  | 1 |
| `beginBlenderNavigation` | 15276 | function |  | 1 |
| `endBlenderNavigation` | 15321 | function |  | 1 |
| `prepareSelectPointerCapture` | 15329 | function |  | 1 |
| `endSelectPointerCapture` | 15335 | function |  | 1 |
| `applyAltClickCandidate` | 15341 | function |  | 2 |
| `finishBrushAltClick` | 15367 | function |  | 1 |
| `endAltOrbit` | 15380 | function |  | 2 |
| `dollyCameraByDrag` | 15387 | function |  | 2 |
| `fastDragMagnitude` | 15410 | function |  | 2 |
| `beginHoudiniZoomDrag` | 15416 | function |  | 1 |
| `updateHoudiniZoomDrag` | 15424 | function |  | 1 |
| `endHoudiniZoomDrag` | 15441 | function |  | 1 |
| `updateSelectionMarquee` | 15449 | function |  | 1 |
| `pointInsideSelectionMarquee` | 15466 | function |  | 3 |
| `selectPointsInMarquee` | 15474 | function |  | 2 |
| `pointKey` | 15500 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 15531 | function |  | 2 |
| `objectInsideSelectionMarquee` | 15568 | function |  | 3 |
| `projectedPoint` | 15585 | arrow |  | 1 |
| `selectObjectsInMarquee` | 15614 | function |  | 2 |
| `finishSelectionMarquee` | 15659 | function |  | 2 |
| `headMeshes` | 15682 | function |  | 6 |
| `strandSplitProfileData` | 15690 | function |  | 4 |
| `strandSplitControlPoint` | 15703 | function |  | 4 |
| `panelSplitControlPoint` | 15739 | function |  | 8 |
| `panelWidthAt` | 15756 | arrow |  | 3 |
| `panelThicknessAt` | 15763 | arrow |  | 3 |
| `strandControlPointRaycast` | 15796 | function |  | 1 |
| `strandControlPointFrame` | 15831 | function |  | 4 |
| `strandControlPointHitFromEvent` | 15863 | function |  | 4 |
| `createCurveObjects` | 15921 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 16183 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 16190 | function |  | 2 |
| `strandWidthEdgeSample` | 16199 | function |  | 3 |
| `strandWidthEdgePoints` | 16222 | function |  | 2 |
| `sculptBrushDebugRaycast` | 16236 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 16240 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 16247 | function |  | 3 |
| `refreshSculptBrushDebugView` | 16259 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 16264 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 16270 | function |  | 3 |
| `updateCurveObjects` | 16284 | function |  | 39 |
| `syncTipNormalArrow` | 16526 | arrow |  | 4 |
| `createCurveNormalIndicator` | 16739 | function |  | 3 |
| `pointUpDirection` | 16765 | function |  | 2 |
| `curveFrameAtPoint` | 16769 | function |  | 4 |
| `curveFrameAt` | 16790 | function |  | 4 |
| `strandTwistAt` | 16810 | function |  | 6 |
| `controlPointRotationAt` | 16815 | function |  | 3 |
| `strandProfileTwistAt` | 16819 | function |  | 2 |
| `strandFrameAt` | 16825 | function |  | 2 |
| `curveFrameAtSnapshot` | 16831 | function |  | 3 |
| `outwardNormalAtPoint` | 16850 | function |  | 8 |
| `sampledSurfaceNormal` | 16897 | function |  | 2 |
| `guidedNormalAt` | 16913 | function |  | 6 |
| `twistFromHandle` | 16932 | function |  | 3 |
| `signedAngleAroundAxis` | 16953 | function |  | 6 |
| `handleColor` | 16960 | function |  | 2 |
| `isAffectedCurvePoint` | 16983 | function |  | 2 |
| `syncLockFromCurve` | 16989 | function |  | 24 |
| `labelForPreset` | 17019 | function |  | 1 |
| `rebuildLockGeometry` | 17023 | function |  | 9 |
| `scheduleSculptBrushGeometryUpdates` | 17050 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 17058 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 17064 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 17086 | function |  | 8 |
| `updateLockGeometry` | 17099 | function |  | 55 |
| `setGroupColorView` | 17120 | function |  | 2 |
| `createUvCheckerTexture` | 17130 | function |  | 3 |
| `ensureUvCheckerForLock` | 17166 | function |  | 4 |
| `removeUvCheckerFromLock` | 17199 | function |  | 3 |
| `invalidateUvInspector` | 17214 | function |  | 7 |
| `uvInspectorRecord` | 17218 | function |  | 1 |
| `uvInspectorRecords` | 17257 | function |  | 2 |
| `drawUvInspectorGrid` | 17261 | function |  | 2 |
| `renderUvInspector` | 17295 | function |  | 3 |
| `setUvCheckerEnabled` | 17354 | function |  | 3 |
| `strandViewportBaseColor` | 17371 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 17406 | function |  | 3 |
| `syncStrandSelectionOutline` | 17412 | function |  | 2 |
| `applyLockedStrandPalette` | 17423 | function |  | 2 |
| `syncLockedStrandWireVisual` | 17432 | function |  | 6 |
| `setStrandSelectionVisual` | 17441 | function |  | 5 |
| `proceduralParentOutlineVisible` | 17457 | function |  | 2 |
| `syncProceduralParentVisibility` | 17464 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 17473 | function |  | 2 |
| `updateStrandSelectionHighlight` | 17477 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 17481 | function |  | 2 |
| `resetGuideSelectionVisuals` | 17494 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 17514 | function |  | 3 |
| `selectLock` | 17547 | function |  | 43 |
| `deselectStrandsForGuideEditor` | 17609 | function |  | 2 |
| `syncGroupInputs` | 17620 | function |  | 2 |
| `topologyStatsForLock` | 17653 | function |  | 4 |
| `formatTopologyStats` | 17661 | function |  | 5 |
| `updateTopologyStats` | 17665 | function |  | 23 |
| `normalizeBraidDimensions` | 17699 | function |  | 3 |
| `normalizeStrandDimensions` | 17712 | function |  | 3 |
| `strandBaseWidth` | 17726 | function |  | 5 |
| `strandWidthDimension` | 17730 | function |  | 5 |
| `strandDepthDimension` | 17738 | function |  | 8 |
| `setStrandWidthDimension` | 17746 | function |  | 2 |
| `setStrandDepthDimension` | 17768 | function |  | 4 |
| `syncShapeDimensionInputs` | 17784 | function |  | 4 |
| `syncCreationShapeInputs` | 17820 | function |  | 3 |
| `syncViewportDrawSettings` | 17858 | function |  | 4 |
| `selectedPanelSegment` | 17872 | function |  | 6 |
| `syncPanelSegmentControls` | 17878 | function |  | 11 |
| `syncPanelShapeInputs` | 17896 | function |  | 6 |
| `syncStrandSplitInputs` | 17923 | function |  | 4 |
| `syncHairCardControls` | 17932 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 17940 | function |  | 3 |
| `updateAttributeEditorMode` | 17979 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 18129 | function |  | 2 |
| `curveLatticeForGroup` | 18152 | function |  | 2 |
| `filterCurveLatticesToGroup` | 18170 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 18215 | function |  | 2 |
| `showCurveLatticeForGroup` | 18232 | function |  | 2 |
| `selectStrandGroup` | 18269 | function |  | 3 |
| `selectCurvePoint` | 18311 | function |  | 10 |
| `updateSelectedPointLabel` | 18325 | function |  | 12 |
| `syncInputs` | 18338 | function |  | 15 |
| `syncClumpGuidePanel` | 18384 | function |  | 3 |
| `getSelectedLock` | 18411 | function |  | 104 |
| `selectedLocksInOrder` | 18415 | function |  | 37 |
| `lockStrands` | 18421 | function |  | 3 |
| `lockSelectedStrands` | 18454 | function |  | 3 |
| `unlockStrands` | 18460 | function |  | 3 |
| `unlockAllStrands` | 18475 | function |  | 3 |
| `strandEditFamily` | 18479 | function |  | 7 |
| `compatibleSelectedLocks` | 18484 | function |  | 4 |
| `selectedEditRoots` | 18491 | function |  | 2 |
| `editSelectedLocks` | 18504 | function |  | 16 |
| `multiEditValuesEqual` | 18537 | function |  | 2 |
| `setMixedControl` | 18546 | function |  | 28 |
| `syncMultiStrandInputs` | 18563 | function |  | 16 |
| `values` | 18579 | arrow |  | 37 |
| `selectedRebuildableCurves` | 18659 | function |  | 5 |
| `createCompoundStrand` | 18666 | function |  | 1 |
| `refreshRebuildCurveDialog` | 18727 | function |  | 8 |
| `openRebuildCurveDialog` | 18740 | function |  | 1 |
| `rebuildSelectedCurves` | 18754 | function |  | 2 |
| `selectionCanBecomeClump` | 18793 | function |  | 4 |
| `createClumpFromSelection` | 18798 | function |  | 3 |
| `cleanSelectionSets` | 18810 | function |  | 2 |
| `createSelectionSetFromSelection` | 18815 | function |  | 3 |
| `selectionSetById` | 18826 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 18830 | function |  | 7 |
| `editSelectionSetFromSelection` | 18839 | function |  | 5 |
| `deleteSelectionSet` | 18859 | function |  | 2 |
| `selectSelectionSet` | 18868 | function |  | 2 |
| `deleteSelectedStrands` | 18878 | function |  | 4 |
| `deleteGuide` | 18886 | function |  | 3 |
| `deleteSelectedGuide` | 18909 | function |  | 3 |
| `deleteSelectedReferenceImage` | 18913 | function |  | 4 |
| `hasDeletableSelection` | 18926 | function |  | 2 |
| `deleteCurrentSelection` | 18934 | function |  | 3 |
| `hideOutlinerContextMenu` | 18942 | function |  | 17 |
| `outlinerLockTargets` | 18947 | function |  | 3 |
| `showOutlinerContextMenu` | 18974 | function |  | 8 |
| `hideStrandRadialMenu` | 19054 | function |  | 4 |
| `ensureRadialButtonCapacity` | 19065 | function |  | 3 |
| `radialButtonDimensions` | 19078 | function |  | 4 |
| `radialMenuDimensionsForKind` | 19087 | function |  | 3 |
| `applyRadialMenuDimensions` | 19104 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 19110 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 19123 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 19144 | function |  | 2 |
| `selectionSetRadialMenuOption` | 19161 | function |  | 4 |
| `selectedMirrorRadialOptions` | 19170 | function |  | 3 |
| `strandVisibilityRadialOptions` | 19192 | function |  | 5 |
| `clumpMirrorRadialOptions` | 19210 | function |  | 2 |
| `contextualRadialOptions` | 19217 | function |  | 3 |
| `sharedRadialFrameDimensions` | 19346 | function |  | 3 |
| `layoutContextualRadialOptions` | 19350 | function |  | 4 |
| `renderRadialActionList` | 19374 | function |  | 3 |
| `radialListOptionAtPointer` | 19392 | function |  | 3 |
| `syncRadialListHighlight` | 19414 | function |  | 3 |
| `configureContextualRadialMenu` | 19420 | function |  | 3 |
| `beginStrandRadialGesture` | 19480 | function |  | 2 |
| `enterStrandRadialSubmenu` | 19514 | function |  | 2 |
| `updateStrandRadialGesture` | 19560 | function |  | 1 |
| `performStrandRadialAction` | 19599 | function |  | 2 |
| `finishStrandRadialGesture` | 19702 | function |  | 2 |
| `cancelStrandRadialGesture` | 19712 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 19719 | function |  | 1 |
| `setPullMoveEnabled` | 19725 | function |  | 3 |
| `toolRadialOptions` | 19733 | function |  | 2 |
| `hideToolRadialMenu` | 19758 | function |  | 4 |
| `beginToolRadialGesture` | 19771 | function |  | 2 |
| `beginToolShortcutPress` | 19811 | function |  | 2 |
| `finishToolShortcutPress` | 19826 | function |  | 2 |
| `cancelToolShortcutPress` | 19835 | function |  | 5 |
| `setRadialMenusEnabled` | 19843 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 19856 | function |  | 5 |
| `setNavigationTipsEnabled` | 19871 | function |  | 5 |
| `configureNavigationMouseButtons` | 19878 | function |  | 3 |
| `syncNavigationModifierLocks` | 19891 | function |  | 7 |
| `setNavigationStyle` | 19896 | function |  | 5 |
| `applyCameraSmoothingPreference` | 19912 | function |  | 4 |
| `setCameraSmoothingEnabled` | 19927 | function |  | 5 |
| `setCameraSmoothingStrength` | 19933 | function |  | 5 |
| `setScaleSensitivity` | 19941 | function |  | 3 |
| `setToolTipsEnabled` | 19949 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 19956 | function |  | 5 |
| `setViewportStatisticsEnabled` | 19965 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 19973 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 19988 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 19997 | function |  | 5 |
| `sideNamingDisplayId` | 20006 | function |  | 3 |
| `referenceViewDisplayLabel` | 20018 | function |  | 6 |
| `strandRegionDisplayLabel` | 20028 | function |  | 7 |
| `updateSideNamingLabels` | 20046 | function |  | 2 |
| `setSideNamingPerspective` | 20073 | function |  | 5 |
| `setControlPointDisplaySize` | 20082 | function |  | 6 |
| `scaleHexColor` | 20094 | function |  | 3 |
| `setViewportBackgroundColor` | 20099 | function |  | 7 |
| `setDefaultHairShader` | 20121 | function |  | 5 |
| `setPreferenceCategory` | 20127 | function |  | 4 |
| `openPreferencesDialog` | 20154 | function |  | 1 |
| `savePreferencesDialog` | 20182 | function |  | 1 |
| `cancelPreferencesDialog` | 20206 | function |  | 3 |
| `updateToolRadialGesture` | 20235 | function |  | 1 |
| `performToolRadialAction` | 20264 | function |  | 2 |
| `finishToolRadialGesture` | 20274 | function |  | 2 |
| `cancelToolRadialGesture` | 20283 | function |  | 5 |
| `duplicatePlacementTarget` | 20290 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 20317 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 20321 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 20331 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 20336 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 20348 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 20359 | function |  | 7 |
| `openProceduralDuplicateDialog` | 20367 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 20384 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 20405 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 20416 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 20422 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 20428 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 20461 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 20616 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 20718 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 20759 | function |  | 2 |
| `updateDuplicatePlacement` | 20786 | function |  | 2 |
| `beginDuplicatePlacement` | 20850 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 20914 | function |  | 2 |
| `confirmDuplicatePlacement` | 20955 | function |  | 1 |
| `cancelDuplicatePlacement` | 20992 | function |  | 4 |
| `outlinerClumpLocks` | 21018 | function |  | 11 |
| `handleOutlinerClumpDrop` | 21022 | function |  | 3 |
| `createOutlinerStrandButton` | 21045 | function |  | 4 |
| `createOutlinerCurveSurface` | 21131 | function |  | 2 |
| `createOutlinerClump` | 21227 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 21309 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 21316 | function |  | 2 |
| `renderLockList` | 21395 | function |  | 61 |
| `updateCount` | 21549 | function |  | 26 |
| `captureInputUndo` | 21558 | function |  | 1 |
| `bindUndoCapture` | 21564 | function |  | 37 |
| `bindLockInput` | 21575 | function |  | 2 |
| `applyValue` | 21592 | arrow |  | 2 |
| `applyUniformTransformScale` | 21911 | function |  | 2 |
| `applyReducedTransformScale` | 21928 | function |  | 2 |
| `applyTransformPrecision` | 21967 | function |  | 2 |
| `updateTransformScalePointer` | 21996 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 22998 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 23003 | function |  | 4 |
| `syncDrawCurlControls` | 23058 | function |  | 5 |
| `handleLiveSurfaceChange` | 23106 | function |  | 1 |
| `changePanelSplitCount` | 23255 | function |  | 3 |
| `applyPresetControl` | 23405 | function |  | 2 |
| `applyCreationToolSettings` | 23426 | function |  | 2 |
| `populateCreationPresetSelect` | 23470 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 23494 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 23527 | function |  | 5 |
| `createCustomCreationPreset` | 23535 | function |  | 3 |
| `createCustomClumpPreset` | 23550 | function |  | 3 |
| `commitCustomCreationPreset` | 23565 | function |  | 2 |
| `openRemoveCreationPreset` | 23626 | function |  | 3 |
| `commitRemoveCreationPreset` | 23639 | function |  | 1 |
| `applyBraidToolPreset` | 23656 | function |  | 2 |
| `selectedBranchChildLock` | 23768 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 23772 | function |  | 2 |
| `initPanelResizeHandles` | 23878 | function |  | 2 |
| `applyWidth` | 23884 | arrow |  | 2 |
| `restoreWidth` | 23891 | arrow |  | 2 |
| `bindResize` | 23899 | arrow |  | 2 |
| `onMove` | 23908 | arrow |  | 0 |
| `onUp` | 23912 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 23929 | function |  | 2 |
| `initFloatingPanelControls` | 23938 | function |  | 2 |
| `detach` | 23947 | arrow |  | 28 |
| `endDrag` | 23985 | arrow |  | 0 |
| `endResize` | 24017 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 24028 | function |  | 3 |
| `selectPatchNotesVersion` | 24162 | function |  | 3 |
| `requestReferenceImage` | 24195 | function |  | 5 |
| `toggleCapsuleGuideTool` | 24399 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 24405 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 24412 | function |  | 1 |
| `deleteLocks` | 24979 | function |  | 10 |
| `disposeCurveObjects` | 25057 | function |  | 4 |
| `beginTipSubBoneRotate` | 25143 | function |  | 2 |
| `applyTipSubBoneTransform` | 25173 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 25205 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 25330 | function |  | 1 |
| `endPanelSplitHandleDrag` | 25551 | function |  | 3 |
| `resize` | 25584 | function |  | 3 |
| `handleViewportPointerMove` | 25595 | function |  | 1 |
| `blockProportionalSizingEvent` | 25606 | function |  | 1 |
| `updateLightAngleFromInputs` | 25612 | function |  | 2 |
| `startViewSnap` | 25626 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 25656 | function |  | 3 |
| `trackViewportPointerDown` | 25673 | function |  | 1 |
| `trackViewportPointerMove` | 25689 | function |  | 1 |
| `clearViewportPointer` | 25697 | function |  | 1 |
| `updateViewSnap` | 25702 | function |  | 1 |
| `nearestCardinalAxis` | 25738 | function |  | 5 |
| `cardinalAxisKey` | 25752 | function |  | 5 |
| `steppedDragAmount` | 25756 | function |  | 3 |
| `snapCameraToCardinalAxis` | 25762 | function |  | 4 |
| `endViewSnap` | 25778 | function |  | 4 |
| `activateStrandControlPoint` | 25788 | function |  | 4 |
| `refreshStrandControlPointSelection` | 25838 | function |  | 4 |
| `addStrandControlPointSelection` | 25865 | function |  | 3 |
| `removeStrandControlPointSelection` | 25882 | function |  | 3 |
| `sampleStrandPointNormal` | 25896 | function |  | 2 |
| `sampleStrandPointVectors` | 25906 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 25912 | function |  | 2 |
| `resampleStrandCurveData` | 25923 | function |  | 4 |
| `resampleMatchingVectors` | 25929 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 25968 | function |  | 4 |
| `removeStrandCurvePoint` | 25979 | function |  | 2 |
| `closestStrandCurveParameter` | 25992 | function |  | 2 |
| `insertStrandCurvePoint` | 26021 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 26038 | function |  | 2 |
| `selectionModifierCursorAvailable` | 26048 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 26064 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 26071 | function |  | 4 |
| `prepareCurvePointSelection` | 26093 | function |  | 1 |
| `finishCurvePointInsertion` | 26204 | function |  | 1 |
| `finishPointRemoval` | 26219 | function |  | 1 |
| `editableStrandWidth` | 26237 | function |  | 6 |
| `editableStrandWidthBounds` | 26249 | function |  | 2 |
| `applyEditableStrandWidth` | 26255 | function |  | 3 |
| `viewportPixelPoint` | 26291 | function |  | 5 |
| `syncSculptBrushControls` | 26299 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 26314 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 26322 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 26330 | function |  | 1 |
| `sculptBrushPlaneOffset` | 26336 | function |  | 5 |
| `setSculptBrushCursorVisible` | 26340 | function |  | 6 |
| `updateSculptBrushCursor` | 26347 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 26369 | function |  | 4 |
| `sculptBrushEditableLock` | 26376 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 26386 | function |  | 5 |
| `sculptBrushLockViable` | 26392 | function |  | 5 |
| `sculptBrushUnits` | 26403 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 26441 | function |  | 4 |
| `sculptBrushPointWeight` | 26491 | function |  | 6 |
| `sculptBrushWorldDelta` | 26501 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 26510 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 26536 | function |  | 2 |
| `beginSculptMoveStroke` | 26594 | function |  | 1 |
| `isHairCreateTool` | 26656 | function |  | 4 |
| `syncStrandHoverOutline` | 26660 | function |  | 1 |
| `pointerOverTaperEditor` | 26673 | function |  | 3 |
| `updateStrandBrushHover` | 26680 | function |  | 1 |
| `updatePanelTipHover` | 26701 | function |  | 1 |
| `applySubBoneBrushSample` | 26731 | function |  | 2 |
| `applySculptMoveStrokeSample` | 26876 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 27114 | function |  | 3 |
| `updateSculptMoveStroke` | 27123 | function |  | 1 |
| `finishSculptMoveStroke` | 27139 | function |  | 3 |
| `strandControlPointHit` | 27187 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 27191 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 27269 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 27303 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 27343 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 27356 | function |  | 1 |
| `setHoveredControlPoint` | 27395 | function |  | 7 |
| `visibleControlPointHoverTargets` | 27408 | function |  | 2 |
| `updateControlPointHover` | 27444 | function |  | 1 |
| `animate` | 28059 | function |  | 2 |
| `syncCompactSidebarLayout` | 28090 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 28109 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 28115 | function |  | 3 |
| `setAttributeEditorTab` | 28121 | function |  | 6 |

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
