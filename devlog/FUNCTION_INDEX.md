# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1812** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（26762 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 277 | function |  | 3 |
| `saveBooleanPreference` | 305 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 309 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 314 | function |  | 2 |
| `normalizeScaleSensitivity` | 319 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 324 | function |  | 2 |
| `normalizeSideNamingPerspective` | 329 | function |  | 2 |
| `normalizeNavigationStyle` | 333 | function |  | 2 |
| `setupEditableSliderControls` | 348 | function |  | 2 |
| `syncNumberFromRange` | 399 | arrow |  | 0 |
| `applyNumberValue` | 406 | arrow |  | 0 |
| `copyCameraPose` | 512 | function |  | 3 |
| `updateCameraProjectionForViewport` | 518 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 531 | function |  | 3 |
| `setOrthographicView` | 537 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 577 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 606 | function |  | 2 |
| `removeRotateFreeAxisRing` | 632 | function |  | 2 |
| `deflateTransformGizmoPickers` | 644 | function |  | 2 |
| `nextStrandName` | 1039 | function |  | 2 |
| `activeDrawClumpTemplate` | 1124 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1129 | function |  | 3 |
| `drawModeCreatesClump` | 1156 | function |  | 1 |
| `isPanelGeometry` | 1300 | function |  | 36 |
| `normalizePanelSplits` | 1304 | function |  | 2 |
| `clonePanelSplits` | 1316 | function |  | 18 |
| `snapPanelSplitHeight` | 1320 | function |  | 3 |
| `createQuadSphereGeometry` | 1355 | function |  | 2 |
| `vertexIndex` | 1369 | function |  | 5 |
| `addEdge` | 1387 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1576 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1756 | function |  | 2 |
| `currentStrandSelectionState` | 1818 | function |  | 4 |
| `applyStrandSelectionState` | 1822 | function |  | 5 |
| `clearStrandSelectionState` | 1827 | function |  | 6 |
| `disposeGuideModel` | 2930 | function |  | 3 |
| `syncHeadTransformInputs` | 2941 | function |  | 3 |
| `applyHeadTransform` | 2948 | function |  | 4 |
| `resetHeadTransform` | 2968 | function |  | 2 |
| `installGuideModel` | 2983 | function |  | 5 |
| `loadDefaultGuideModel` | 3059 | function |  | 3 |
| `braidTemplateFromEntries` | 3082 | function |  | 4 |
| `braidMeshEntries` | 3114 | function |  | 2 |
| `prepareBraidBodyCache` | 3126 | function |  | 2 |
| `quantize` | 3135 | arrow |  | 21 |
| `sourceNormalAt` | 3147 | arrow |  | 1 |
| `clusterBoundary` | 3150 | arrow |  | 2 |
| `normalBuckets` | 3167 | arrow |  | 2 |
| `applyBucketPair` | 3199 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3230 | function |  | 2 |
| `annotateBraidObjTopology` | 3251 | function |  | 2 |
| `loadBraidMeshPreset` | 3271 | function |  | 3 |
| `createSplitControlHandle` | 3288 | function |  | 6 |
| `frameGuideModel` | 3303 | function |  | 2 |
| `normalizeHairLayer` | 3332 | function |  | 26 |
| `layerOffsetForLock` | 3336 | function |  | 8 |
| `layerRootOffsetFactor` | 3341 | function |  | 12 |
| `layerOffsetWeight` | 3345 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3351 | function |  | 5 |
| `pointsWithLayerOffset` | 3360 | function |  | 3 |
| `layerDirectionForLock` | 3368 | function |  | 2 |
| `applyLayerOffset` | 3379 | function |  | 5 |
| `setLockHairLayer` | 3403 | function |  | 2 |
| `setGroupLayerOffset` | 3418 | function |  | 2 |
| `quadraticWeights` | 3446 | function |  | 1 |
| `setHeadReferenceTransparency` | 3457 | function |  | 4 |
| `trianglePlaneIntersections` | 3469 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3490 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3699 | function |  | 1 |
| `upperContourCurve` | 3716 | function |  | 2 |
| `hermitePoint` | 3751 | function |  | 2 |
| `curveNetworkSection` | 3762 | function |  | 1 |
| `pointAlongSection` | 3791 | function |  | 1 |
| `longestStitchedContour` | 3797 | function |  | 2 |
| `nodeForPoint` | 3805 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3862 | function |  | 1 |
| `exitSetupEditors` | 3882 | function |  | 6 |
| `syncAppMenuVisibility` | 3892 | function |  | 3 |
| `closeAppMenus` | 3898 | function |  | 6 |
| `setAppMenuOpen` | 3909 | function |  | 2 |
| `setTurntableActive` | 3916 | function |  | 3 |
| `selectedReferenceImage` | 3926 | function |  | 20 |
| `normalizeReferenceCrop` | 3932 | function |  | 8 |
| `referenceCropIsFull` | 3940 | function |  | 3 |
| `referencePlaneFrontAxis` | 3945 | function |  | 4 |
| `referencePlanePlacement` | 3954 | function |  | 4 |
| `migratedReferencePlanePosition` | 3969 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3989 | function |  | 3 |
| `migratedReferencePlaneRotation` | 4006 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 4022 | function |  | 2 |
| `snappedReferenceImageView` | 4045 | function |  | 2 |
| `updateReferencePlaneVisibility` | 4051 | function |  | 5 |
| `applyReferenceImageRuntime` | 4067 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4110 | function |  | 6 |
| `createReferenceImageRuntime` | 4118 | function |  | 3 |
| `addReferenceImage` | 4187 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4239 | function |  | 3 |
| `disposeReferenceImage` | 4258 | function |  | 2 |
| `clearReferenceImages` | 4262 | function |  | 2 |
| `serializeReferenceImage` | 4269 | function |  | 1 |
| `setReferenceImageType` | 4297 | function |  | 2 |
| `attachReferenceImageTransform` | 4341 | function |  | 6 |
| `selectReferenceImage` | 4355 | function |  | 12 |
| `placeReferencePlane` | 4378 | function |  | 2 |
| `setReferencePlaneInFront` | 4389 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4399 | function |  | 4 |
| `renderReferenceImagePanel` | 4418 | function |  | 20 |
| `setOutlinerTab` | 4465 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4483 | function |  | 4 |
| `componentEditModeActive` | 4487 | function |  | 29 |
| `selectionToolSupportsPicking` | 4491 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4496 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4512 | function |  | 2 |
| `setViewportSelectionMode` | 4542 | function |  | 4 |
| `setViewportEditMode` | 4554 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4596 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4610 | function |  | 8 |
| `normalizeOutlinerName` | 4624 | function |  | 3 |
| `beginOutlinerRename` | 4629 | function |  | 2 |
| `finish` | 4640 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4670 | function |  | 6 |
| `referenceOutlinerGroup` | 4682 | function |  | 2 |
| `renderReferenceOutliner` | 4686 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4803 | function |  | 5 |
| `readReferenceImageFile` | 4808 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4832 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4839 | function |  | 3 |
| `dragContainsReferenceImage` | 4884 | function |  | 3 |
| `setReferenceImageDragActive` | 4895 | function |  | 9 |
| `referenceDropDestination` | 4903 | function |  | 2 |
| `viewportOverlayDropPosition` | 4909 | function |  | 2 |
| `setReferenceDropHover` | 4918 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4936 | function |  | 2 |
| `referenceOverlayAtPointer` | 4956 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4974 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4987 | function |  | 2 |
| `updateReferenceOverlayDrag` | 5033 | function |  | 1 |
| `finishReferenceOverlayDrag` | 5083 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5105 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5116 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5142 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5151 | function |  | 2 |
| `referenceCropCursor` | 5166 | function |  | 3 |
| `updateReferenceCropHandles` | 5172 | function |  | 5 |
| `referenceCropSourcePoint` | 5193 | function |  | 2 |
| `beginReferenceCrop` | 5200 | function |  | 1 |
| `updateReferenceCrop` | 5238 | function |  | 1 |
| `finishReferenceCrop` | 5270 | function |  | 4 |
| `setHeadSetupEditing` | 5288 | function |  | 6 |
| `strandPassesDisplayFilters` | 5314 | function |  | 4 |
| `strandVisibleForDisplay` | 5323 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 5328 | function |  | 3 |
| `lockedStrandsExist` | 5332 | function |  | 3 |
| `hiddenStrandsExist` | 5336 | function |  | 2 |
| `hideSelectedStrands` | 5340 | function |  | 2 |
| `unhideHiddenStrands` | 5350 | function |  | 2 |
| `strandIsolationActive` | 5359 | function |  | 7 |
| `setStrandIsolation` | 5363 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5375 | function |  | 3 |
| `syncVisibilityParent` | 5386 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5393 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5422 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5429 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5452 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5670 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5691 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5710 | function |  | 2 |
| `selectedViewportFocusBounds` | 5808 | function |  | 2 |
| `frameViewportBounds` | 5822 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5852 | function |  | 2 |
| `fullSceneFocusBounds` | 5856 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5871 | function |  | 3 |
| `cycleViewportFraming` | 5880 | function |  | 2 |
| `sculptBrushToolActive` | 5900 | function |  | 23 |
| `sculptBrushSelectionMaskActive` | 5904 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5908 | function |  | 2 |
| `effectiveSculptBrushTool` | 5912 | function |  | 4 |
| `updateSculptScaleModeRow` | 5918 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5923 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5945 | function |  | 5 |
| `setActiveTool` | 5954 | function |  | 12 |
| `setDrawStrandMode` | 6092 | function |  | 2 |
| `setObjectSpaceEditing` | 6102 | function |  | 7 |
| `setHierarchyEditing` | 6118 | function |  | 4 |
| `setProportionalEditing` | 6130 | function |  | 5 |
| `beginProportionalSizeEdit` | 6149 | function |  | 3 |
| `updateProportionalSizeEdit` | 6161 | function |  | 2 |
| `endProportionalSizeEdit` | 6172 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6179 | function |  | 2 |
| `refreshProportionalPreview` | 6187 | function |  | 4 |
| `activeBrushSizeInput` | 6197 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6206 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6218 | function |  | 2 |
| `beginBrushSizeDrag` | 6236 | function |  | 1 |
| `updateBrushSizeDrag` | 6263 | function |  | 1 |
| `finishBrushSizeDrag` | 6284 | function |  | 2 |
| `updateInteractionLocks` | 6301 | function |  | 59 |
| `configureTransformControls` | 6312 | function |  | 12 |
| `pullMoveActive` | 6320 | function |  | 9 |
| `updatePullGuideVisual` | 6324 | function |  | 4 |
| `attachTransformForCurvePoint` | 6340 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6364 | function |  | 5 |
| `strandObjectRootIndex` | 6380 | function |  | 3 |
| `strandObjectRoot` | 6389 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6393 | function |  | 2 |
| `attachStrandObjectTransform` | 6398 | function |  | 6 |
| `guideObjectPivot` | 6421 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6432 | function |  | 2 |
| `attachGuideObjectTransform` | 6437 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6456 | function |  | 2 |
| `beginGuideObjectTransform` | 6484 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6491 | function |  | 2 |
| `updateGuideObjectTransform` | 6513 | function |  | 2 |
| `finishGuideObjectTransform` | 6546 | function |  | 2 |
| `clonePlacementFrame` | 6555 | function |  | 2 |
| `cloneOptionalVectors` | 6567 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6571 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6588 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6603 | function |  | 2 |
| `strandObjectTransformOperators` | 6619 | function |  | 4 |
| `transformPoint` | 6627 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6634 | arrow |  | 0 |
| `transformNormal` | 6640 | arrow |  | 10 |
| `transformDirection` | 6650 | arrow |  | 5 |
| `worldMatrixForPivot` | 6662 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6668 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6684 | function |  | 6 |
| `beginStrandObjectTransform` | 6710 | function |  | 2 |
| `updateStrandObjectTransform` | 6748 | function |  | 2 |
| `commitStrandObjectTransform` | 6806 | function |  | 2 |
| `mapPoints` | 6819 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6853 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6867 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6890 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6903 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6918 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6944 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6993 | function |  | 2 |
| `beginHandleEdit` | 7002 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 7055 | function |  | 3 |
| `multiPointHandleEditActive` | 7066 | function |  | 7 |
| `applyMultiMove` | 7070 | function |  | 5 |
| `applyMultiRotate` | 7076 | function |  | 2 |
| `applyMultiScale` | 7085 | function |  | 2 |
| `applyHierarchicalMove` | 7094 | function |  | 3 |
| `applySingleMove` | 7106 | function |  | 5 |
| `applySurfaceLatticeMirror` | 7110 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 7127 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 7136 | function |  | 3 |
| `changed` | 7146 | arrow |  | 1 |
| `applyPullMove` | 7188 | function |  | 3 |
| `pullHeadCollisionContext` | 7196 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7215 | function |  | 2 |
| `applyProportionalMove` | 7238 | function |  | 3 |
| `viewPlaneNormal` | 7249 | function |  | 12 |
| `isCameraInSnappedView` | 7253 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7261 | function |  | 9 |
| `updateViewPlaneGrid` | 7265 | function |  | 14 |
| `setViewPlaneMove` | 7322 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7333 | function |  | 2 |
| `rayFromViewportEvent` | 7341 | function |  | 11 |
| `worldUnitsPerViewportPixel` | 7349 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7359 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7370 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7383 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7402 | function |  | 4 |
| `beginViewPlaneMove` | 7409 | function |  | 3 |
| `updateViewPlaneMove` | 7473 | function |  | 1 |
| `endViewPlaneMove` | 7538 | function |  | 7 |
| `applyHierarchicalRotate` | 7557 | function |  | 2 |
| `rotateGuideNormal` | 7564 | arrow |  | 4 |
| `applySingleRotate` | 7602 | function |  | 2 |
| `applyProportionalRotate` | 7606 | function |  | 2 |
| `applyHierarchicalScale` | 7626 | function |  | 2 |
| `applySingleScale` | 7636 | function |  | 2 |
| `applyProportionalScale` | 7640 | function |  | 2 |
| `setPointScale` | 7656 | function |  | 7 |
| `proportionalWeight` | 7665 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7677 | function |  | 5 |
| `strandInfluenceColor` | 7683 | function |  | 4 |
| `beginRelaxEdit` | 7708 | function |  | 3 |
| `updateRelaxEdit` | 7737 | function |  | 1 |
| `endRelaxEdit` | 7797 | function |  | 1 |
| `disposeGuide` | 7807 | function |  | 3 |
| `removeGuideObjects` | 7835 | function |  | 3 |
| `strandRadiusAt` | 7849 | function |  | 5 |
| `strandProfileTopologyAt` | 7866 | function |  | 2 |
| `strandCurveParameters` | 7908 | function |  | 1 |
| `widthProfileAt` | 7918 | arrow |  | 1 |
| `braidFrameAt` | 7956 | function |  | 4 |
| `braidFrameAtExtended` | 7966 | function |  | 2 |
| `createBraidProfileProjector` | 7975 | function |  | 2 |
| `project` | 7991 | arrow |  | 13 |
| `createBraidGeometry` | 8006 | function |  | 1 |
| `deformationAt` | 8041 | function |  | 3 |
| `widthFor` | 8050 | arrow |  | 3 |
| `depthFor` | 8054 | arrow |  | 3 |
| `outputVertex` | 8086 | function |  | 7 |
| `appendAuthoredCap` | 8194 | function |  | 3 |
| `outputCapVertex` | 8201 | arrow |  | 6 |
| `capBoundary` | 8292 | function |  | 3 |
| `strandGeometryCurve` | 8354 | function |  | 7 |
| `strandGeometryFrameAt` | 8380 | function |  | 6 |
| `transportedStrandFrameAt` | 8443 | function |  | 5 |
| `twistOverrideAt` | 8446 | arrow |  | 2 |
| `hairMaterialDefinition` | 8516 | function |  | 4 |
| `materialForLock` | 8520 | function |  | 8 |
| `activeHairMaterialDefinition` | 8524 | function |  | 11 |
| `strandDisplayColor` | 8530 | function |  | 14 |
| `setAnimeHairBaseColor` | 8548 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 8561 | function |  | 2 |
| `createHairMaterial` | 8601 | function |  | 5 |
| `createStrandSelectionOutline` | 8643 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 8678 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 8687 | function |  | 6 |
| `refreshMaterialUsers` | 8714 | function |  | 6 |
| `renderHairMaterialOutliner` | 8723 | function |  | 5 |
| `renderHairMaterialOptions` | 8753 | function |  | 3 |
| `syncHairMaterialEditor` | 8763 | function |  | 9 |
| `createProjectHairMaterial` | 8789 | function |  | 3 |
| `deleteActiveHairMaterial` | 8809 | function |  | 2 |
| `createHairTopologyGeometry` | 8827 | function |  | 4 |
| `createHairTopologyOverlay` | 8848 | function |  | 3 |
| `groupDefaultsFor` | 8895 | function |  | 9 |
| `creationToolActive` | 8902 | function |  | 5 |
| `activeCreationShapeDefaults` | 8906 | function |  | 7 |
| `curvePolylineLength` | 8913 | function |  | 2 |
| `curvePolylineLengths` | 8921 | function |  | 3 |
| `samplePolylineDistance` | 8929 | function |  | 2 |
| `applyProjectedCurveLength` | 8939 | function |  | 4 |
| `clearRegionLengthBaseline` | 8970 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8977 | function |  | 2 |
| `setGroupLengthScale` | 8985 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 9023 | function |  | 3 |
| `requestGroupDefaultsWarning` | 9055 | function |  | 1 |
| `activeProfileOffset` | 9067 | function |  | 3 |
| `profileToCanvas` | 9075 | function |  | 1 |
| `renderProfilePreview` | 9082 | function |  | 7 |
| `renderHairCardCoveragePath` | 9101 | function |  | 2 |
| `setupShapePresetControls` | 9330 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 9355 | function |  | 3 |
| `syncShapePresetSelects` | 9361 | function |  | 5 |
| `populateShapePresetSelects` | 9382 | function |  | 5 |
| `openSaveShapePreset` | 9410 | function |  | 2 |
| `commitCustomShapePreset` | 9435 | function |  | 2 |
| `openRemoveShapePreset` | 9458 | function |  | 2 |
| `commitRemoveShapePreset` | 9471 | function |  | 2 |
| `updateViewportStatsVisibility` | 9509 | function |  | 2 |
| `canvasToProfile` | 9528 | function |  | 2 |
| `addLock` | 9543 | function |  | 16 |
| `mirroredVector` | 9755 | function |  | 12 |
| `mirroredPlacementFrame` | 9759 | function |  | 2 |
| `mirrorPartnerFor` | 9772 | function |  | 36 |
| `decoupleMirrorPartner` | 9776 | function |  | 2 |
| `createMirrorPartner` | 9784 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 9880 | function |  | 6 |
| `mirroredClumpPartners` | 9885 | function |  | 6 |
| `createMirroredClump` | 9891 | function |  | 3 |
| `decoupleMirroredClump` | 9913 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 9933 | function |  | 6 |
| `syncActiveMirror` | 10100 | function |  | 22 |
| `setMirrorXEditing` | 10112 | function |  | 5 |
| `snapshotState` | 10136 | function |  | 7 |
| `rootAttachmentFrame` | 10397 | function |  | 3 |
| `rootAttachmentLocalFrame` | 10409 | function |  | 4 |
| `resolveRootAttachment` | 10427 | function |  | 4 |
| `curvePointsToRootLocal` | 10467 | function |  | 2 |
| `curvePointsFromRootLocal` | 10479 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 10487 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 10503 | function |  | 2 |
| `createRootAttachment` | 10534 | function |  | 7 |
| `syncRootAttachmentMetadata` | 10564 | function |  | 3 |
| `rootAttachmentToData` | 10591 | function |  | 2 |
| `rootAttachmentFromData` | 10619 | function |  | 3 |
| `importHeadMeshFile` | 10661 | function |  | 3 |
| `importFullBodyMeshFile` | 10684 | function |  | 3 |
| `downloadPreferencesAndPresets` | 10709 | function |  | 1 |
| `importedBooleanPreference` | 10742 | function |  | 11 |
| `loadPreferencesAndPresets` | 10756 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 10826 | function |  | 1 |
| `openHairProjectFile` | 10870 | function |  | 4 |
| `dragContainsApplicationFile` | 10928 | function |  | 3 |
| `safelyRememberRecentProject` | 10937 | function |  | 2 |
| `renderRecentProjectsMenu` | 10946 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 10978 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 11003 | function |  | 2 |
| `confirmDroppedApplicationFile` | 11007 | function |  | 2 |
| `pushUndoState` | 11023 | function |  | 88 |
| `undoLastAction` | 11030 | function |  | 2 |
| `redoLastAction` | 11047 | function |  | 2 |
| `updateHistoryButtons` | 11064 | function |  | 9 |
| `resetTransientInteractionsForStateRestore` | 11069 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 11089 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 11096 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 11135 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 11161 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 11193 | function |  | 2 |
| `finalizeStateRestore` | 11234 | function |  | 2 |
| `restoreState` | 11241 | function |  | 5 |
| `disposeAllEditableObjects` | 11265 | function |  | 2 |
| `restoreLock` | 11286 | function |  | 4 |
| `restoreGuide` | 11510 | function |  | 2 |
| `vectorToData` | 11571 | function |  | 25 |
| `dataToVector` | 11575 | function |  | 22 |
| `frameToData` | 11579 | function |  | 2 |
| `frameFromData` | 11591 | function |  | 2 |
| `applyPresetSelection` | 11603 | function |  | 2 |
| `drawPresetThumbnail` | 11634 | function |  | 1 |
| `fillHair` | 11649 | arrow |  | 9 |
| `strand` | 11661 | arrow |  | 31 |
| `bun` | 11679 | arrow |  | 2 |
| `braid` | 11714 | arrow |  | 2 |
| `renderPresetLibrary` | 11803 | function |  | 3 |
| `setPresetLibraryOpen` | 11862 | function |  | 6 |
| `average` | 11875 | function |  | 3 |
| `fitPointAttributes` | 11879 | function |  | 7 |
| `rebuildCurveObjects` | 11908 | function |  | 8 |
| `createCurvePoints` | 11920 | function |  | 2 |
| `addGeneratedBangPreset` | 11929 | function |  | 1 |
| `createLongLayeredCurlPoints` | 12023 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 12072 | function |  | 1 |
| `columns` | 12073 | arrow |  | 1 |
| `layer` | 12077 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 12291 | function |  | 2 |
| `addBraidedBobPreset` | 12327 | function |  | 1 |
| `evenColumns` | 12328 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 12544 | function |  | 1 |
| `scalpSeed` | 12567 | arrow |  | 1 |
| `createBowlCutPoints` | 12854 | function |  | 2 |
| `addBowlCutPreset` | 12892 | function |  | 1 |
| `selectedCurveLatticeGuide` | 12960 | function |  | 10 |
| `braidStrokeActive` | 12967 | function |  | 8 |
| `proceduralDrawActive` | 12971 | function |  | 3 |
| `panelStrokeActive` | 12975 | function |  | 5 |
| `activeStrokeSurfaceInput` | 12979 | function |  | 4 |
| `activeStrokeSurfaceValue` | 12983 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 12987 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 12993 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 12997 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 13001 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 13005 | function |  | 3 |
| `liveSurfaceStrandId` | 13015 | function |  | 4 |
| `liveSurfaceStrand` | 13019 | function |  | 2 |
| `liveSurfaceGuideId` | 13024 | function |  | 3 |
| `guideSupportsLiveSurface` | 13028 | function |  | 2 |
| `liveSurfaceGuide` | 13035 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 13042 | function |  | 10 |
| `activeStrokeBrushSize` | 13083 | function |  | 10 |
| `activeStrokeBrushDepth` | 13089 | function |  | 5 |
| `strokeSurfaceIsContextual` | 13095 | function |  | 3 |
| `contextualPlaneAtOrigin` | 13103 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 13113 | function |  | 7 |
| `worldNormalAtHit` | 13152 | function |  | 4 |
| `drawSampleFromHit` | 13161 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 13175 | function |  | 3 |
| `strokeLength` | 13212 | function |  | 8 |
| `resampleDrawStroke` | 13218 | function |  | 2 |
| `processedDrawStroke` | 13250 | function |  | 6 |
| `strokeSurfaceNormals` | 13279 | function |  | 6 |
| `drawClumpFrame` | 13290 | function |  | 4 |
| `nearestCurveParameter` | 13299 | function |  | 2 |
| `drawClumpSampleNormal` | 13313 | function |  | 5 |
| `drawClumpTemplateVector` | 13322 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 13328 | function |  | 3 |
| `drawClumpStrandMaps` | 13344 | function |  | 4 |
| `nextClumpName` | 13399 | function |  | 6 |
| `initializeClumpShape` | 13406 | function |  | 5 |
| `stableClumpVariation` | 13417 | function |  | 3 |
| `createClumpFromLocks` | 13429 | function |  | 7 |
| `addLockToClump` | 13454 | function |  | 4 |
| `pointerToNdc` | 13510 | function |  | 1 |
| `gridProfileSkipCol` | 13526 | function |  | 1 |
| `clumpDirectMembers` | 13550 | function |  | 3 |
| `clumpMembersForGuide` | 13555 | function |  | 6 |
| `clumpGuideForLock` | 13559 | function |  | 13 |
| `proceduralGuideForLock` | 13564 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 13571 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 13578 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 13585 | function |  | 2 |
| `proceduralBranchWorldPoints` | 13597 | function |  | 1 |
| `applyProceduralBranchSettings` | 13610 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 13649 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 13665 | function |  | 3 |
| `createProceduralAccessoryLock` | 13679 | function |  | 2 |
| `applyProceduralAccessorySettings` | 13731 | function |  | 2 |
| `clumpFrameAt` | 13782 | function |  | 5 |
| `commitClumpMemberRestState` | 13790 | function |  | 9 |
| `updateClumpMembers` | 13873 | function |  | 10 |
| `dissolveClump` | 13977 | function |  | 6 |
| `detachLockFromClump` | 14014 | function |  | 4 |
| `updateDrawVolumePreview` | 14040 | function |  | 5 |
| `hideDrawClumpPreviews` | 14064 | function |  | 5 |
| `resetDrawVolumePreview` | 14070 | function |  | 3 |
| `updateDrawStrandPreview` | 14076 | function |  | 21 |
| `continueFromTipEnabled` | 14297 | function |  | 2 |
| `selectedTipContinuationLock` | 14303 | function |  | 3 |
| `beginDrawStrandStroke` | 14318 | function |  | 2 |
| `beginDrawFreePlane` | 14447 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 14461 | function |  | 2 |
| `updateDrawStrandStroke` | 14486 | function |  | 1 |
| `createDrawnLock` | 14532 | function |  | 3 |
| `setting` | 14536 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 14604 | function |  | 4 |
| `createDrawnBraid` | 14612 | function |  | 2 |
| `createDrawnStrand` | 14669 | function |  | 2 |
| `createDrawnPanel` | 14796 | function |  | 2 |
| `extendDrawnStrand` | 14848 | function |  | 2 |
| `finishDrawStrandStroke` | 14881 | function |  | 6 |
| `createPlacedStrand` | 14908 | function |  | 2 |
| `placedPointCount` | 14972 | function |  | 3 |
| `createPlacedPoints` | 14976 | function |  | 3 |
| `pushPointOutsideHead` | 14995 | function |  | 8 |
| `resizePlacedStrand` | 15027 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 15044 | function |  | 5 |
| `beginPlaceEdit` | 15049 | function |  | 2 |
| `updatePlaceEdit` | 15067 | function |  | 1 |
| `updatePlacementLength` | 15081 | function |  | 3 |
| `updatePlacementOrientation` | 15091 | function |  | 3 |
| `endPlaceEdit` | 15109 | function |  | 1 |
| `confirmPendingPlacedStrand` | 15124 | function |  | 1 |
| `pendingPlacedLock` | 15134 | function |  | 2 |
| `beginPlacementPointer` | 15138 | function |  | 3 |
| `finishPlacementPointer` | 15148 | function |  | 2 |
| `confirmPlacementStep` | 15172 | function |  | 2 |
| `finishPlacementFlow` | 15195 | function |  | 6 |
| `updatePlacementStatus` | 15208 | function |  | 53 |
| `deselectStrands` | 15347 | function |  | 11 |
| `beginSelectionMarquee` | 15362 | function |  | 3 |
| `beginAltOrbit` | 15386 | function |  | 1 |
| `beginBlenderNavigation` | 15398 | function |  | 1 |
| `endBlenderNavigation` | 15443 | function |  | 1 |
| `prepareSelectPointerCapture` | 15451 | function |  | 1 |
| `endSelectPointerCapture` | 15457 | function |  | 1 |
| `applyAltClickCandidate` | 15463 | function |  | 2 |
| `finishBrushAltClick` | 15489 | function |  | 1 |
| `endAltOrbit` | 15502 | function |  | 2 |
| `dollyCameraByDrag` | 15509 | function |  | 2 |
| `fastDragMagnitude` | 15532 | function |  | 2 |
| `beginHoudiniZoomDrag` | 15538 | function |  | 1 |
| `updateHoudiniZoomDrag` | 15546 | function |  | 1 |
| `endHoudiniZoomDrag` | 15563 | function |  | 1 |
| `updateSelectionMarquee` | 15571 | function |  | 1 |
| `pointInsideSelectionMarquee` | 15588 | function |  | 3 |
| `selectPointsInMarquee` | 15596 | function |  | 2 |
| `pointKey` | 15622 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 15653 | function |  | 2 |
| `objectInsideSelectionMarquee` | 15690 | function |  | 3 |
| `projectedPoint` | 15707 | arrow |  | 1 |
| `selectObjectsInMarquee` | 15736 | function |  | 2 |
| `finishSelectionMarquee` | 15781 | function |  | 2 |
| `headMeshes` | 15804 | function |  | 6 |
| `strandSplitProfileData` | 15812 | function |  | 3 |
| `strandSplitControlPoint` | 15825 | function |  | 3 |
| `panelSplitControlPoint` | 15861 | function |  | 6 |
| `panelWidthAt` | 15878 | arrow |  | 3 |
| `panelThicknessAt` | 15885 | arrow |  | 3 |
| `strandControlPointRaycast` | 15918 | function |  | 1 |
| `strandControlPointFrame` | 15953 | function |  | 4 |
| `strandControlPointHitFromEvent` | 15985 | function |  | 3 |
| `createCurveObjects` | 16043 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 16305 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 16312 | function |  | 2 |
| `strandWidthEdgeSample` | 16321 | function |  | 3 |
| `strandWidthEdgePoints` | 16344 | function |  | 2 |
| `sculptBrushDebugRaycast` | 16358 | arrow |  | 0 |
| `updateCurveObjects` | 16360 | function |  | 27 |
| `syncTipNormalArrow` | 16602 | arrow |  | 4 |
| `createCurveNormalIndicator` | 16815 | function |  | 3 |
| `pointUpDirection` | 16841 | function |  | 2 |
| `curveFrameAtPoint` | 16845 | function |  | 4 |
| `curveFrameAt` | 16866 | function |  | 3 |
| `strandTwistAt` | 16886 | function |  | 6 |
| `controlPointRotationAt` | 16891 | function |  | 3 |
| `strandProfileTwistAt` | 16895 | function |  | 2 |
| `strandFrameAt` | 16901 | function |  | 1 |
| `curveFrameAtSnapshot` | 16907 | function |  | 3 |
| `outwardNormalAtPoint` | 16926 | function |  | 8 |
| `sampledSurfaceNormal` | 16973 | function |  | 2 |
| `guidedNormalAt` | 16989 | function |  | 4 |
| `twistFromHandle` | 17008 | function |  | 3 |
| `signedAngleAroundAxis` | 17029 | function |  | 4 |
| `handleColor` | 17036 | function |  | 2 |
| `isAffectedCurvePoint` | 17059 | function |  | 2 |
| `syncLockFromCurve` | 17065 | function |  | 20 |
| `labelForPreset` | 17095 | function |  | 1 |
| `rebuildLockGeometry` | 17099 | function |  | 8 |
| `flushPendingLockGeometryUpdates` | 17127 | function |  | 7 |
| `updateLockGeometry` | 17140 | function |  | 47 |
| `setGroupColorView` | 17161 | function |  | 2 |
| `createUvCheckerTexture` | 17171 | function |  | 3 |
| `ensureUvCheckerForLock` | 17207 | function |  | 4 |
| `removeUvCheckerFromLock` | 17240 | function |  | 3 |
| `invalidateUvInspector` | 17255 | function |  | 7 |
| `uvInspectorRecord` | 17259 | function |  | 1 |
| `uvInspectorRecords` | 17298 | function |  | 2 |
| `drawUvInspectorGrid` | 17302 | function |  | 2 |
| `renderUvInspector` | 17336 | function |  | 3 |
| `setUvCheckerEnabled` | 17395 | function |  | 3 |
| `strandViewportBaseColor` | 17412 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 17447 | function |  | 3 |
| `syncStrandSelectionOutline` | 17453 | function |  | 2 |
| `applyLockedStrandPalette` | 17464 | function |  | 2 |
| `syncLockedStrandWireVisual` | 17473 | function |  | 6 |
| `setStrandSelectionVisual` | 17482 | function |  | 5 |
| `proceduralParentOutlineVisible` | 17498 | function |  | 2 |
| `syncProceduralParentVisibility` | 17505 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 17514 | function |  | 2 |
| `updateStrandSelectionHighlight` | 17518 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 17522 | function |  | 2 |
| `resetGuideSelectionVisuals` | 17535 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 17555 | function |  | 3 |
| `selectLock` | 17588 | function |  | 42 |
| `deselectStrandsForGuideEditor` | 17650 | function |  | 2 |
| `syncGroupInputs` | 17661 | function |  | 2 |
| `topologyStatsForLock` | 17694 | function |  | 4 |
| `formatTopologyStats` | 17702 | function |  | 5 |
| `updateTopologyStats` | 17706 | function |  | 15 |
| `normalizeBraidDimensions` | 17740 | function |  | 3 |
| `normalizeStrandDimensions` | 17753 | function |  | 3 |
| `strandBaseWidth` | 17767 | function |  | 5 |
| `strandWidthDimension` | 17771 | function |  | 5 |
| `strandDepthDimension` | 17779 | function |  | 8 |
| `setStrandWidthDimension` | 17787 | function |  | 2 |
| `setStrandDepthDimension` | 17809 | function |  | 4 |
| `syncShapeDimensionInputs` | 17825 | function |  | 4 |
| `syncCreationShapeInputs` | 17861 | function |  | 3 |
| `syncViewportDrawSettings` | 17899 | function |  | 4 |
| `syncStrandSplitInputs` | 17916 | function |  | 4 |
| `syncHairCardControls` | 17925 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 17933 | function |  | 3 |
| `updateAttributeEditorMode` | 17972 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 18122 | function |  | 2 |
| `curveLatticeForGroup` | 18145 | function |  | 2 |
| `filterCurveLatticesToGroup` | 18163 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 18208 | function |  | 2 |
| `showCurveLatticeForGroup` | 18225 | function |  | 2 |
| `selectStrandGroup` | 18262 | function |  | 3 |
| `selectCurvePoint` | 18304 | function |  | 10 |
| `updateSelectedPointLabel` | 18318 | function |  | 12 |
| `syncInputs` | 18331 | function |  | 14 |
| `syncClumpGuidePanel` | 18377 | function |  | 3 |
| `getSelectedLock` | 18404 | function |  | 95 |
| `selectedLocksInOrder` | 18408 | function |  | 37 |
| `lockStrands` | 18414 | function |  | 3 |
| `lockSelectedStrands` | 18447 | function |  | 3 |
| `unlockStrands` | 18453 | function |  | 3 |
| `unlockAllStrands` | 18468 | function |  | 3 |
| `strandEditFamily` | 18472 | function |  | 7 |
| `compatibleSelectedLocks` | 18477 | function |  | 4 |
| `selectedEditRoots` | 18484 | function |  | 2 |
| `editSelectedLocks` | 18497 | function |  | 16 |
| `multiEditValuesEqual` | 18530 | function |  | 2 |
| `setMixedControl` | 18539 | function |  | 28 |
| `syncMultiStrandInputs` | 18556 | function |  | 16 |
| `values` | 18572 | arrow |  | 36 |
| `selectedRebuildableCurves` | 18652 | function |  | 5 |
| `createCompoundStrand` | 18659 | function |  | 1 |
| `refreshRebuildCurveDialog` | 18720 | function |  | 8 |
| `openRebuildCurveDialog` | 18733 | function |  | 1 |
| `rebuildSelectedCurves` | 18747 | function |  | 2 |
| `selectionCanBecomeClump` | 18786 | function |  | 4 |
| `createClumpFromSelection` | 18791 | function |  | 3 |
| `cleanSelectionSets` | 18803 | function |  | 2 |
| `createSelectionSetFromSelection` | 18808 | function |  | 3 |
| `selectionSetById` | 18819 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 18823 | function |  | 7 |
| `editSelectionSetFromSelection` | 18832 | function |  | 5 |
| `deleteSelectionSet` | 18852 | function |  | 2 |
| `selectSelectionSet` | 18861 | function |  | 2 |
| `deleteSelectedStrands` | 18871 | function |  | 4 |
| `deleteGuide` | 18879 | function |  | 3 |
| `deleteSelectedGuide` | 18902 | function |  | 3 |
| `deleteSelectedReferenceImage` | 18906 | function |  | 4 |
| `hasDeletableSelection` | 18919 | function |  | 2 |
| `deleteCurrentSelection` | 18927 | function |  | 3 |
| `hideOutlinerContextMenu` | 18935 | function |  | 17 |
| `outlinerLockTargets` | 18940 | function |  | 3 |
| `showOutlinerContextMenu` | 18967 | function |  | 8 |
| `hideStrandRadialMenu` | 19047 | function |  | 4 |
| `ensureRadialButtonCapacity` | 19058 | function |  | 3 |
| `radialButtonDimensions` | 19071 | function |  | 4 |
| `radialMenuDimensionsForKind` | 19080 | function |  | 3 |
| `applyRadialMenuDimensions` | 19097 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 19103 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 19116 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 19137 | function |  | 2 |
| `selectionSetRadialMenuOption` | 19154 | function |  | 4 |
| `selectedMirrorRadialOptions` | 19163 | function |  | 3 |
| `strandVisibilityRadialOptions` | 19185 | function |  | 5 |
| `clumpMirrorRadialOptions` | 19203 | function |  | 2 |
| `contextualRadialOptions` | 19210 | function |  | 3 |
| `sharedRadialFrameDimensions` | 19339 | function |  | 3 |
| `layoutContextualRadialOptions` | 19343 | function |  | 4 |
| `renderRadialActionList` | 19367 | function |  | 3 |
| `radialListOptionAtPointer` | 19385 | function |  | 3 |
| `syncRadialListHighlight` | 19407 | function |  | 3 |
| `configureContextualRadialMenu` | 19413 | function |  | 3 |
| `beginStrandRadialGesture` | 19473 | function |  | 2 |
| `enterStrandRadialSubmenu` | 19507 | function |  | 2 |
| `updateStrandRadialGesture` | 19553 | function |  | 1 |
| `performStrandRadialAction` | 19592 | function |  | 2 |
| `finishStrandRadialGesture` | 19695 | function |  | 2 |
| `cancelStrandRadialGesture` | 19705 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 19712 | function |  | 1 |
| `setPullMoveEnabled` | 19718 | function |  | 3 |
| `toolRadialOptions` | 19726 | function |  | 2 |
| `hideToolRadialMenu` | 19751 | function |  | 4 |
| `beginToolRadialGesture` | 19764 | function |  | 2 |
| `beginToolShortcutPress` | 19804 | function |  | 2 |
| `finishToolShortcutPress` | 19819 | function |  | 2 |
| `cancelToolShortcutPress` | 19828 | function |  | 5 |
| `setRadialMenusEnabled` | 19836 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 19849 | function |  | 5 |
| `setNavigationTipsEnabled` | 19864 | function |  | 5 |
| `configureNavigationMouseButtons` | 19871 | function |  | 3 |
| `syncNavigationModifierLocks` | 19884 | function |  | 7 |
| `setNavigationStyle` | 19889 | function |  | 5 |
| `applyCameraSmoothingPreference` | 19905 | function |  | 4 |
| `setCameraSmoothingEnabled` | 19920 | function |  | 5 |
| `setCameraSmoothingStrength` | 19926 | function |  | 5 |
| `setScaleSensitivity` | 19934 | function |  | 3 |
| `setToolTipsEnabled` | 19942 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 19949 | function |  | 5 |
| `setViewportStatisticsEnabled` | 19958 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 19966 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 19981 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 19990 | function |  | 5 |
| `sideNamingDisplayId` | 19999 | function |  | 3 |
| `referenceViewDisplayLabel` | 20011 | function |  | 6 |
| `strandRegionDisplayLabel` | 20021 | function |  | 7 |
| `updateSideNamingLabels` | 20039 | function |  | 2 |
| `setSideNamingPerspective` | 20066 | function |  | 5 |
| `setControlPointDisplaySize` | 20075 | function |  | 6 |
| `scaleHexColor` | 20087 | function |  | 3 |
| `setViewportBackgroundColor` | 20092 | function |  | 7 |
| `setDefaultHairShader` | 20114 | function |  | 5 |
| `setPreferenceCategory` | 20120 | function |  | 4 |
| `openPreferencesDialog` | 20147 | function |  | 1 |
| `savePreferencesDialog` | 20175 | function |  | 1 |
| `cancelPreferencesDialog` | 20199 | function |  | 3 |
| `updateToolRadialGesture` | 20228 | function |  | 1 |
| `performToolRadialAction` | 20257 | function |  | 2 |
| `finishToolRadialGesture` | 20267 | function |  | 2 |
| `cancelToolRadialGesture` | 20276 | function |  | 5 |
| `duplicatePlacementTarget` | 20283 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 20310 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 20314 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 20324 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 20329 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 20341 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 20352 | function |  | 7 |
| `openProceduralDuplicateDialog` | 20360 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 20377 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 20398 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 20409 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 20415 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 20421 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 20454 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 20609 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 20711 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 20752 | function |  | 2 |
| `updateDuplicatePlacement` | 20779 | function |  | 2 |
| `beginDuplicatePlacement` | 20843 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 20907 | function |  | 2 |
| `confirmDuplicatePlacement` | 20948 | function |  | 1 |
| `cancelDuplicatePlacement` | 20985 | function |  | 4 |
| `outlinerClumpLocks` | 21011 | function |  | 11 |
| `handleOutlinerClumpDrop` | 21015 | function |  | 3 |
| `createOutlinerStrandButton` | 21038 | function |  | 4 |
| `createOutlinerCurveSurface` | 21124 | function |  | 2 |
| `createOutlinerClump` | 21220 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 21302 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 21309 | function |  | 2 |
| `renderLockList` | 21388 | function |  | 61 |
| `updateCount` | 21542 | function |  | 26 |
| `captureInputUndo` | 21551 | function |  | 1 |
| `bindUndoCapture` | 21557 | function |  | 37 |
| `bindLockInput` | 21568 | function |  | 2 |
| `applyValue` | 21585 | arrow |  | 2 |
| `applyUniformTransformScale` | 21904 | function |  | 2 |
| `applyReducedTransformScale` | 21921 | function |  | 2 |
| `applyTransformPrecision` | 21960 | function |  | 2 |
| `updateTransformScalePointer` | 21989 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 22991 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 22996 | function |  | 4 |
| `syncDrawCurlControls` | 23051 | function |  | 5 |
| `handleLiveSurfaceChange` | 23099 | function |  | 1 |
| `applyPresetControl` | 23360 | function |  | 2 |
| `applyCreationToolSettings` | 23381 | function |  | 2 |
| `populateCreationPresetSelect` | 23425 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 23449 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 23482 | function |  | 5 |
| `createCustomCreationPreset` | 23490 | function |  | 3 |
| `createCustomClumpPreset` | 23505 | function |  | 3 |
| `commitCustomCreationPreset` | 23520 | function |  | 2 |
| `openRemoveCreationPreset` | 23581 | function |  | 3 |
| `commitRemoveCreationPreset` | 23594 | function |  | 1 |
| `applyBraidToolPreset` | 23611 | function |  | 2 |
| `selectedBranchChildLock` | 23723 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 23727 | function |  | 2 |
| `initPanelResizeHandles` | 23833 | function |  | 2 |
| `applyWidth` | 23839 | arrow |  | 2 |
| `restoreWidth` | 23846 | arrow |  | 2 |
| `bindResize` | 23854 | arrow |  | 2 |
| `onMove` | 23863 | arrow |  | 0 |
| `onUp` | 23867 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 23884 | function |  | 2 |
| `initFloatingPanelControls` | 23893 | function |  | 2 |
| `detach` | 23902 | arrow |  | 26 |
| `endDrag` | 23940 | arrow |  | 0 |
| `endResize` | 23972 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 23983 | function |  | 3 |
| `selectPatchNotesVersion` | 24117 | function |  | 3 |
| `requestReferenceImage` | 24150 | function |  | 5 |
| `toggleCapsuleGuideTool` | 24354 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 24360 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 24367 | function |  | 1 |
| `deleteLocks` | 24934 | function |  | 10 |
| `disposeCurveObjects` | 25012 | function |  | 4 |
| `resize` | 25127 | function |  | 3 |
| `handleViewportPointerMove` | 25138 | function |  | 1 |
| `blockProportionalSizingEvent` | 25149 | function |  | 1 |
| `updateLightAngleFromInputs` | 25155 | function |  | 2 |
| `startViewSnap` | 25169 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 25199 | function |  | 3 |
| `trackViewportPointerDown` | 25216 | function |  | 1 |
| `trackViewportPointerMove` | 25232 | function |  | 1 |
| `clearViewportPointer` | 25240 | function |  | 1 |
| `updateViewSnap` | 25245 | function |  | 1 |
| `nearestCardinalAxis` | 25281 | function |  | 5 |
| `cardinalAxisKey` | 25295 | function |  | 5 |
| `steppedDragAmount` | 25299 | function |  | 3 |
| `snapCameraToCardinalAxis` | 25305 | function |  | 4 |
| `endViewSnap` | 25321 | function |  | 4 |
| `activateStrandControlPoint` | 25331 | function |  | 2 |
| `refreshStrandControlPointSelection` | 25381 | function |  | 4 |
| `addStrandControlPointSelection` | 25408 | function |  | 2 |
| `removeStrandControlPointSelection` | 25425 | function |  | 3 |
| `sampleStrandPointNormal` | 25439 | function |  | 2 |
| `sampleStrandPointVectors` | 25449 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 25455 | function |  | 2 |
| `resampleStrandCurveData` | 25466 | function |  | 4 |
| `resampleMatchingVectors` | 25472 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 25511 | function |  | 4 |
| `removeStrandCurvePoint` | 25522 | function |  | 2 |
| `closestStrandCurveParameter` | 25535 | function |  | 1 |
| `insertStrandCurvePoint` | 25564 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 25581 | function |  | 2 |
| `selectionModifierCursorAvailable` | 25591 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 25607 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 25614 | function |  | 4 |
| `finishCurvePointInsertion` | 25637 | function |  | 1 |
| `finishPointRemoval` | 25652 | function |  | 1 |
| `isHairCreateTool` | 25671 | function |  | 4 |
| `syncStrandHoverOutline` | 25675 | function |  | 1 |
| `pointerOverTaperEditor` | 25688 | function |  | 2 |
| `updateStrandBrushHover` | 25695 | function |  | 1 |
| `strandControlPointHit` | 25719 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 25723 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 25801 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 25835 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 25875 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 25888 | function |  | 1 |
| `setHoveredControlPoint` | 25927 | function |  | 7 |
| `visibleControlPointHoverTargets` | 25940 | function |  | 2 |
| `updateControlPointHover` | 25976 | function |  | 1 |
| `animate` | 26591 | function |  | 2 |
| `syncCompactSidebarLayout` | 26622 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 26641 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 26647 | function |  | 3 |
| `setAttributeEditorTab` | 26653 | function |  | 6 |

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
