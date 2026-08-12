# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1808** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（29100 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 273 | function |  | 3 |
| `saveBooleanPreference` | 301 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 305 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 310 | function |  | 2 |
| `normalizeScaleSensitivity` | 315 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 320 | function |  | 2 |
| `normalizeSideNamingPerspective` | 325 | function |  | 2 |
| `normalizeNavigationStyle` | 329 | function |  | 2 |
| `setupEditableSliderControls` | 344 | function |  | 2 |
| `syncNumberFromRange` | 395 | arrow |  | 0 |
| `applyNumberValue` | 402 | arrow |  | 0 |
| `copyCameraPose` | 508 | function |  | 3 |
| `updateCameraProjectionForViewport` | 514 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 527 | function |  | 3 |
| `setOrthographicView` | 533 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 573 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 602 | function |  | 2 |
| `removeRotateFreeAxisRing` | 628 | function |  | 2 |
| `deflateTransformGizmoPickers` | 640 | function |  | 2 |
| `nextStrandName` | 1035 | function |  | 2 |
| `activeDrawClumpTemplate` | 1120 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1125 | function |  | 3 |
| `drawModeCreatesClump` | 1152 | function |  | 1 |
| `isPanelGeometry` | 1296 | function |  | 49 |
| `normalizePanelSplits` | 1300 | function |  | 2 |
| `clonePanelSplits` | 1312 | function |  | 30 |
| `snapPanelSplitHeight` | 1316 | function |  | 5 |
| `createQuadSphereGeometry` | 1351 | function |  | 2 |
| `vertexIndex` | 1365 | function |  | 11 |
| `addEdge` | 1383 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1554 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1734 | function |  | 2 |
| `currentStrandSelectionState` | 1796 | function |  | 4 |
| `applyStrandSelectionState` | 1800 | function |  | 5 |
| `clearStrandSelectionState` | 1805 | function |  | 6 |
| `disposeGuideModel` | 2857 | function |  | 3 |
| `syncHeadTransformInputs` | 2868 | function |  | 3 |
| `applyHeadTransform` | 2875 | function |  | 4 |
| `resetHeadTransform` | 2895 | function |  | 2 |
| `installGuideModel` | 2910 | function |  | 5 |
| `loadDefaultGuideModel` | 2986 | function |  | 3 |
| `braidTemplateFromEntries` | 3009 | function |  | 4 |
| `braidMeshEntries` | 3041 | function |  | 2 |
| `prepareBraidBodyCache` | 3053 | function |  | 2 |
| `quantize` | 3062 | arrow |  | 21 |
| `sourceNormalAt` | 3074 | arrow |  | 1 |
| `clusterBoundary` | 3077 | arrow |  | 2 |
| `normalBuckets` | 3094 | arrow |  | 2 |
| `applyBucketPair` | 3126 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3157 | function |  | 2 |
| `annotateBraidObjTopology` | 3178 | function |  | 2 |
| `loadBraidMeshPreset` | 3198 | function |  | 3 |
| `createSplitControlHandle` | 3215 | function |  | 6 |
| `frameGuideModel` | 3230 | function |  | 2 |
| `normalizeHairLayer` | 3259 | function |  | 26 |
| `layerOffsetForLock` | 3263 | function |  | 8 |
| `layerRootOffsetFactor` | 3268 | function |  | 12 |
| `layerOffsetWeight` | 3272 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3278 | function |  | 5 |
| `pointsWithLayerOffset` | 3287 | function |  | 3 |
| `layerDirectionForLock` | 3295 | function |  | 2 |
| `applyLayerOffset` | 3306 | function |  | 5 |
| `setLockHairLayer` | 3330 | function |  | 2 |
| `setGroupLayerOffset` | 3345 | function |  | 2 |
| `quadraticWeights` | 3373 | function |  | 1 |
| `setHeadReferenceTransparency` | 3384 | function |  | 4 |
| `trianglePlaneIntersections` | 3396 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3417 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3626 | function |  | 1 |
| `upperContourCurve` | 3643 | function |  | 2 |
| `hermitePoint` | 3678 | function |  | 2 |
| `curveNetworkSection` | 3689 | function |  | 1 |
| `pointAlongSection` | 3718 | function |  | 1 |
| `longestStitchedContour` | 3724 | function |  | 2 |
| `nodeForPoint` | 3732 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3789 | function |  | 1 |
| `exitSetupEditors` | 3809 | function |  | 6 |
| `syncAppMenuVisibility` | 3819 | function |  | 3 |
| `closeAppMenus` | 3825 | function |  | 6 |
| `setAppMenuOpen` | 3836 | function |  | 2 |
| `setTurntableActive` | 3843 | function |  | 3 |
| `selectedReferenceImage` | 3853 | function |  | 20 |
| `normalizeReferenceCrop` | 3859 | function |  | 8 |
| `referenceCropIsFull` | 3867 | function |  | 3 |
| `referencePlaneFrontAxis` | 3872 | function |  | 4 |
| `referencePlanePlacement` | 3881 | function |  | 4 |
| `migratedReferencePlanePosition` | 3896 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3916 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3933 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3949 | function |  | 2 |
| `snappedReferenceImageView` | 3972 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3978 | function |  | 5 |
| `applyReferenceImageRuntime` | 3994 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4037 | function |  | 6 |
| `createReferenceImageRuntime` | 4045 | function |  | 3 |
| `addReferenceImage` | 4114 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4166 | function |  | 3 |
| `disposeReferenceImage` | 4185 | function |  | 2 |
| `clearReferenceImages` | 4189 | function |  | 2 |
| `serializeReferenceImage` | 4196 | function |  | 1 |
| `setReferenceImageType` | 4224 | function |  | 2 |
| `attachReferenceImageTransform` | 4268 | function |  | 6 |
| `selectReferenceImage` | 4282 | function |  | 12 |
| `placeReferencePlane` | 4305 | function |  | 2 |
| `setReferencePlaneInFront` | 4316 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4326 | function |  | 4 |
| `renderReferenceImagePanel` | 4345 | function |  | 20 |
| `setOutlinerTab` | 4392 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4410 | function |  | 4 |
| `componentEditModeActive` | 4414 | function |  | 30 |
| `selectionToolSupportsPicking` | 4418 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4423 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4439 | function |  | 2 |
| `setViewportSelectionMode` | 4469 | function |  | 4 |
| `setViewportEditMode` | 4481 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4523 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4537 | function |  | 8 |
| `normalizeOutlinerName` | 4551 | function |  | 3 |
| `beginOutlinerRename` | 4556 | function |  | 2 |
| `finish` | 4567 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4597 | function |  | 6 |
| `referenceOutlinerGroup` | 4609 | function |  | 2 |
| `renderReferenceOutliner` | 4613 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4730 | function |  | 5 |
| `readReferenceImageFile` | 4735 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4759 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4766 | function |  | 3 |
| `dragContainsReferenceImage` | 4811 | function |  | 3 |
| `setReferenceImageDragActive` | 4822 | function |  | 9 |
| `referenceDropDestination` | 4830 | function |  | 2 |
| `viewportOverlayDropPosition` | 4836 | function |  | 2 |
| `setReferenceDropHover` | 4845 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4863 | function |  | 2 |
| `referenceOverlayAtPointer` | 4883 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4901 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4914 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4960 | function |  | 1 |
| `finishReferenceOverlayDrag` | 5010 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5032 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5043 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5069 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5078 | function |  | 2 |
| `referenceCropCursor` | 5093 | function |  | 3 |
| `updateReferenceCropHandles` | 5099 | function |  | 5 |
| `referenceCropSourcePoint` | 5120 | function |  | 2 |
| `beginReferenceCrop` | 5127 | function |  | 1 |
| `updateReferenceCrop` | 5165 | function |  | 1 |
| `finishReferenceCrop` | 5197 | function |  | 4 |
| `setHeadSetupEditing` | 5215 | function |  | 6 |
| `strandPassesDisplayFilters` | 5241 | function |  | 4 |
| `strandVisibleForDisplay` | 5250 | function |  | 13 |
| `strandAvailableForViewportInteraction` | 5255 | function |  | 3 |
| `lockedStrandsExist` | 5259 | function |  | 3 |
| `hiddenStrandsExist` | 5263 | function |  | 2 |
| `hideSelectedStrands` | 5267 | function |  | 2 |
| `unhideHiddenStrands` | 5277 | function |  | 2 |
| `strandIsolationActive` | 5286 | function |  | 7 |
| `setStrandIsolation` | 5290 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5302 | function |  | 3 |
| `syncVisibilityParent` | 5313 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5320 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5349 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5356 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5379 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5597 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5618 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5637 | function |  | 2 |
| `selectedViewportFocusBounds` | 5735 | function |  | 2 |
| `frameViewportBounds` | 5749 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5779 | function |  | 2 |
| `fullSceneFocusBounds` | 5783 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5798 | function |  | 3 |
| `cycleViewportFraming` | 5807 | function |  | 2 |
| `sculptBrushToolActive` | 5827 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 5831 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5835 | function |  | 3 |
| `effectiveSculptBrushTool` | 5839 | function |  | 15 |
| `updateSculptScaleModeRow` | 5845 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5850 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5872 | function |  | 5 |
| `setActiveTool` | 5881 | function |  | 12 |
| `setDrawStrandMode` | 6019 | function |  | 2 |
| `setObjectSpaceEditing` | 6029 | function |  | 7 |
| `setHierarchyEditing` | 6045 | function |  | 4 |
| `setProportionalEditing` | 6057 | function |  | 5 |
| `beginProportionalSizeEdit` | 6076 | function |  | 3 |
| `updateProportionalSizeEdit` | 6088 | function |  | 2 |
| `endProportionalSizeEdit` | 6099 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6106 | function |  | 2 |
| `refreshProportionalPreview` | 6114 | function |  | 4 |
| `activeBrushSizeInput` | 6124 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6133 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6145 | function |  | 2 |
| `beginBrushSizeDrag` | 6163 | function |  | 1 |
| `updateBrushSizeDrag` | 6190 | function |  | 1 |
| `finishBrushSizeDrag` | 6211 | function |  | 2 |
| `updateInteractionLocks` | 6228 | function |  | 64 |
| `configureTransformControls` | 6239 | function |  | 13 |
| `pullMoveActive` | 6247 | function |  | 9 |
| `updatePullGuideVisual` | 6251 | function |  | 4 |
| `attachTransformForCurvePoint` | 6267 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6291 | function |  | 6 |
| `strandObjectRootIndex` | 6307 | function |  | 3 |
| `strandObjectRoot` | 6316 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6320 | function |  | 2 |
| `attachStrandObjectTransform` | 6325 | function |  | 6 |
| `guideObjectPivot` | 6348 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6359 | function |  | 2 |
| `attachGuideObjectTransform` | 6364 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6383 | function |  | 2 |
| `beginGuideObjectTransform` | 6411 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6418 | function |  | 2 |
| `updateGuideObjectTransform` | 6440 | function |  | 2 |
| `finishGuideObjectTransform` | 6473 | function |  | 2 |
| `clonePlacementFrame` | 6482 | function |  | 2 |
| `cloneOptionalVectors` | 6494 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6498 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6515 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6530 | function |  | 2 |
| `strandObjectTransformOperators` | 6546 | function |  | 4 |
| `transformPoint` | 6554 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6561 | arrow |  | 0 |
| `transformNormal` | 6567 | arrow |  | 10 |
| `transformDirection` | 6577 | arrow |  | 5 |
| `worldMatrixForPivot` | 6589 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6595 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6611 | function |  | 6 |
| `beginStrandObjectTransform` | 6637 | function |  | 2 |
| `updateStrandObjectTransform` | 6675 | function |  | 2 |
| `commitStrandObjectTransform` | 6733 | function |  | 2 |
| `mapPoints` | 6746 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6780 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6794 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6817 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6830 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6845 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6871 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6920 | function |  | 2 |
| `beginHandleEdit` | 6929 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6982 | function |  | 3 |
| `multiPointHandleEditActive` | 6993 | function |  | 7 |
| `applyMultiMove` | 6997 | function |  | 5 |
| `applyMultiRotate` | 7003 | function |  | 2 |
| `applyMultiScale` | 7012 | function |  | 2 |
| `applyHierarchicalMove` | 7021 | function |  | 3 |
| `applySingleMove` | 7033 | function |  | 5 |
| `applySurfaceLatticeMirror` | 7037 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 7054 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 7063 | function |  | 3 |
| `changed` | 7073 | arrow |  | 1 |
| `applyPullMove` | 7115 | function |  | 3 |
| `pullHeadCollisionContext` | 7123 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7142 | function |  | 2 |
| `applyProportionalMove` | 7165 | function |  | 3 |
| `viewPlaneNormal` | 7176 | function |  | 12 |
| `isCameraInSnappedView` | 7180 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7188 | function |  | 9 |
| `updateViewPlaneGrid` | 7192 | function |  | 14 |
| `setViewPlaneMove` | 7249 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7260 | function |  | 2 |
| `rayFromViewportEvent` | 7268 | function |  | 11 |
| `worldUnitsPerViewportPixel` | 7276 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7286 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7297 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7310 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7329 | function |  | 4 |
| `beginViewPlaneMove` | 7336 | function |  | 3 |
| `updateViewPlaneMove` | 7400 | function |  | 1 |
| `endViewPlaneMove` | 7465 | function |  | 7 |
| `applyHierarchicalRotate` | 7484 | function |  | 2 |
| `rotateGuideNormal` | 7491 | arrow |  | 4 |
| `applySingleRotate` | 7529 | function |  | 2 |
| `applyProportionalRotate` | 7533 | function |  | 2 |
| `applyHierarchicalScale` | 7553 | function |  | 2 |
| `applySingleScale` | 7563 | function |  | 2 |
| `applyProportionalScale` | 7567 | function |  | 2 |
| `setPointScale` | 7583 | function |  | 8 |
| `proportionalWeight` | 7592 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7604 | function |  | 5 |
| `strandInfluenceColor` | 7610 | function |  | 11 |
| `beginRelaxEdit` | 7635 | function |  | 3 |
| `updateRelaxEdit` | 7664 | function |  | 1 |
| `endRelaxEdit` | 7724 | function |  | 1 |
| `disposeGuide` | 7734 | function |  | 3 |
| `removeGuideObjects` | 7762 | function |  | 3 |
| `strandRadiusAt` | 7776 | function |  | 5 |
| `strandProfileTopologyAt` | 7793 | function |  | 5 |
| `strandCurveParameters` | 7835 | function |  | 3 |
| `widthProfileAt` | 7845 | arrow |  | 1 |
| `braidFrameAt` | 7883 | function |  | 4 |
| `braidFrameAtExtended` | 7893 | function |  | 2 |
| `createBraidProfileProjector` | 7902 | function |  | 2 |
| `project` | 7918 | arrow |  | 21 |
| `createBraidGeometry` | 7933 | function |  | 2 |
| `deformationAt` | 7968 | function |  | 3 |
| `widthFor` | 7977 | arrow |  | 3 |
| `depthFor` | 7981 | arrow |  | 3 |
| `outputVertex` | 8013 | function |  | 7 |
| `appendAuthoredCap` | 8121 | function |  | 3 |
| `outputCapVertex` | 8128 | arrow |  | 6 |
| `capBoundary` | 8219 | function |  | 3 |
| `strandGeometryCurve` | 8281 | function |  | 9 |
| `strandGeometryFrameAt` | 8307 | function |  | 11 |
| `transportedStrandFrameAt` | 8370 | function |  | 5 |
| `twistOverrideAt` | 8373 | arrow |  | 2 |
| `clipStrandProfilePolygon` | 8401 | function |  | 3 |
| `inside` | 8402 | arrow |  | 2 |
| `pushOrientedTriangle` | 8424 | function |  | 7 |
| `triangulatePolygon3D` | 8435 | function |  | 1 |
| `orientedQuadFace` | 8485 | function |  | 2 |
| `createSplitStrandGeometry` | 8493 | function |  | 2 |
| `fusedIndexAt` | 8650 | arrow |  | 0 |
| `createHairCardGeometry` | 8699 | function |  | 2 |
| `createPolyGeometry` | 8798 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 8825 | function |  | 4 |
| `createCompoundStrandGeometry` | 8908 | function |  | 2 |
| `proceduralBranchGeometryLock` | 9159 | function |  | 2 |
| `createHairGeometry` | 9204 | function |  | 5 |
| `createBaseHairGeometry` | 9256 | function |  | 3 |
| `hairMaterialDefinition` | 9341 | function |  | 4 |
| `materialForLock` | 9345 | function |  | 8 |
| `activeHairMaterialDefinition` | 9349 | function |  | 11 |
| `strandDisplayColor` | 9355 | function |  | 14 |
| `setAnimeHairBaseColor` | 9373 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 9386 | function |  | 2 |
| `createHairMaterial` | 9426 | function |  | 5 |
| `createStrandSelectionOutline` | 9468 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 9503 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 9512 | function |  | 6 |
| `refreshMaterialUsers` | 9539 | function |  | 6 |
| `renderHairMaterialOutliner` | 9548 | function |  | 5 |
| `renderHairMaterialOptions` | 9578 | function |  | 3 |
| `syncHairMaterialEditor` | 9588 | function |  | 9 |
| `createProjectHairMaterial` | 9614 | function |  | 3 |
| `deleteActiveHairMaterial` | 9634 | function |  | 2 |
| `createHairTopologyGeometry` | 9652 | function |  | 4 |
| `createHairTopologyOverlay` | 9673 | function |  | 3 |
| `groupDefaultsFor` | 9720 | function |  | 9 |
| `creationToolActive` | 9727 | function |  | 5 |
| `activeCreationShapeDefaults` | 9731 | function |  | 7 |
| `curvePolylineLength` | 9738 | function |  | 2 |
| `curvePolylineLengths` | 9746 | function |  | 3 |
| `samplePolylineDistance` | 9754 | function |  | 2 |
| `applyProjectedCurveLength` | 9764 | function |  | 4 |
| `clearRegionLengthBaseline` | 9795 | function |  | 2 |
| `ensureRegionLengthBaseline` | 9802 | function |  | 2 |
| `setGroupLengthScale` | 9810 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 9848 | function |  | 3 |
| `requestGroupDefaultsWarning` | 9880 | function |  | 1 |
| `activeProfileOffset` | 9892 | function |  | 3 |
| `profileToCanvas` | 9900 | function |  | 1 |
| `renderProfilePreview` | 9907 | function |  | 7 |
| `renderHairCardCoveragePath` | 9926 | function |  | 2 |
| `setupShapePresetControls` | 10065 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 10090 | function |  | 3 |
| `syncShapePresetSelects` | 10096 | function |  | 5 |
| `populateShapePresetSelects` | 10117 | function |  | 5 |
| `openSaveShapePreset` | 10145 | function |  | 2 |
| `commitCustomShapePreset` | 10170 | function |  | 2 |
| `openRemoveShapePreset` | 10193 | function |  | 2 |
| `commitRemoveShapePreset` | 10206 | function |  | 2 |
| `openPanelSegmentCurveEditor` | 10242 | function |  | 3 |
| `updateViewportStatsVisibility` | 10279 | function |  | 3 |
| `canvasToProfile` | 10298 | function |  | 2 |
| `addLock` | 10313 | function |  | 16 |
| `mirroredVector` | 10525 | function |  | 12 |
| `mirroredPlacementFrame` | 10529 | function |  | 2 |
| `mirrorPartnerFor` | 10542 | function |  | 39 |
| `decoupleMirrorPartner` | 10546 | function |  | 2 |
| `createMirrorPartner` | 10554 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 10650 | function |  | 6 |
| `mirroredClumpPartners` | 10655 | function |  | 6 |
| `createMirroredClump` | 10661 | function |  | 3 |
| `decoupleMirroredClump` | 10683 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 10703 | function |  | 6 |
| `syncActiveMirror` | 10870 | function |  | 29 |
| `setMirrorXEditing` | 10882 | function |  | 5 |
| `snapshotState` | 10906 | function |  | 7 |
| `rootAttachmentFrame` | 11167 | function |  | 3 |
| `rootAttachmentLocalFrame` | 11179 | function |  | 4 |
| `resolveRootAttachment` | 11197 | function |  | 4 |
| `curvePointsToRootLocal` | 11237 | function |  | 2 |
| `curvePointsFromRootLocal` | 11249 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 11257 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 11273 | function |  | 2 |
| `createRootAttachment` | 11304 | function |  | 7 |
| `syncRootAttachmentMetadata` | 11334 | function |  | 3 |
| `rootAttachmentToData` | 11361 | function |  | 2 |
| `rootAttachmentFromData` | 11389 | function |  | 3 |
| `importHeadMeshFile` | 11431 | function |  | 3 |
| `importFullBodyMeshFile` | 11454 | function |  | 3 |
| `downloadPreferencesAndPresets` | 11479 | function |  | 1 |
| `importedBooleanPreference` | 11512 | function |  | 11 |
| `loadPreferencesAndPresets` | 11526 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 11596 | function |  | 1 |
| `openHairProjectFile` | 11640 | function |  | 4 |
| `dragContainsApplicationFile` | 11698 | function |  | 3 |
| `safelyRememberRecentProject` | 11707 | function |  | 2 |
| `renderRecentProjectsMenu` | 11716 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 11748 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 11773 | function |  | 2 |
| `confirmDroppedApplicationFile` | 11777 | function |  | 2 |
| `pushUndoState` | 11793 | function |  | 98 |
| `undoLastAction` | 11800 | function |  | 2 |
| `redoLastAction` | 11817 | function |  | 2 |
| `updateHistoryButtons` | 11834 | function |  | 10 |
| `resetTransientInteractionsForStateRestore` | 11839 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 11859 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 11866 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 11905 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 11931 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 11963 | function |  | 2 |
| `finalizeStateRestore` | 12004 | function |  | 2 |
| `restoreState` | 12011 | function |  | 5 |
| `disposeAllEditableObjects` | 12035 | function |  | 2 |
| `restoreLock` | 12056 | function |  | 4 |
| `restoreGuide` | 12280 | function |  | 2 |
| `vectorToData` | 12341 | function |  | 25 |
| `dataToVector` | 12345 | function |  | 22 |
| `frameToData` | 12349 | function |  | 2 |
| `frameFromData` | 12361 | function |  | 2 |
| `applyPresetSelection` | 12373 | function |  | 2 |
| `drawPresetThumbnail` | 12404 | function |  | 1 |
| `fillHair` | 12419 | arrow |  | 9 |
| `strand` | 12431 | arrow |  | 31 |
| `bun` | 12449 | arrow |  | 2 |
| `braid` | 12484 | arrow |  | 2 |
| `renderPresetLibrary` | 12573 | function |  | 3 |
| `setPresetLibraryOpen` | 12632 | function |  | 6 |
| `average` | 12645 | function |  | 4 |
| `fitPointAttributes` | 12649 | function |  | 7 |
| `rebuildCurveObjects` | 12678 | function |  | 9 |
| `createCurvePoints` | 12690 | function |  | 2 |
| `addGeneratedBangPreset` | 12699 | function |  | 1 |
| `createLongLayeredCurlPoints` | 12793 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 12842 | function |  | 1 |
| `columns` | 12843 | arrow |  | 1 |
| `layer` | 12847 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 13061 | function |  | 2 |
| `addBraidedBobPreset` | 13097 | function |  | 1 |
| `evenColumns` | 13098 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 13314 | function |  | 1 |
| `scalpSeed` | 13337 | arrow |  | 1 |
| `createBowlCutPoints` | 13624 | function |  | 2 |
| `addBowlCutPreset` | 13662 | function |  | 1 |
| `selectedCurveLatticeGuide` | 13730 | function |  | 10 |
| `braidStrokeActive` | 13737 | function |  | 8 |
| `proceduralDrawActive` | 13741 | function |  | 3 |
| `panelStrokeActive` | 13745 | function |  | 5 |
| `activeStrokeSurfaceInput` | 13749 | function |  | 4 |
| `activeStrokeSurfaceValue` | 13753 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 13757 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 13763 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 13767 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 13771 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 13775 | function |  | 3 |
| `liveSurfaceStrandId` | 13785 | function |  | 4 |
| `liveSurfaceStrand` | 13789 | function |  | 2 |
| `liveSurfaceGuideId` | 13794 | function |  | 3 |
| `guideSupportsLiveSurface` | 13798 | function |  | 2 |
| `liveSurfaceGuide` | 13805 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 13812 | function |  | 10 |
| `activeStrokeBrushSize` | 13853 | function |  | 10 |
| `activeStrokeBrushDepth` | 13859 | function |  | 5 |
| `strokeSurfaceIsContextual` | 13865 | function |  | 3 |
| `contextualPlaneAtOrigin` | 13873 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 13883 | function |  | 7 |
| `worldNormalAtHit` | 13922 | function |  | 4 |
| `drawSampleFromHit` | 13931 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 13945 | function |  | 3 |
| `strokeLength` | 13982 | function |  | 8 |
| `resampleDrawStroke` | 13988 | function |  | 2 |
| `processedDrawStroke` | 14020 | function |  | 6 |
| `strokeSurfaceNormals` | 14049 | function |  | 6 |
| `drawClumpFrame` | 14060 | function |  | 4 |
| `nearestCurveParameter` | 14069 | function |  | 2 |
| `drawClumpSampleNormal` | 14083 | function |  | 5 |
| `drawClumpTemplateVector` | 14092 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 14098 | function |  | 3 |
| `drawClumpStrandMaps` | 14114 | function |  | 4 |
| `nextClumpName` | 14169 | function |  | 6 |
| `initializeClumpShape` | 14176 | function |  | 5 |
| `stableClumpVariation` | 14187 | function |  | 3 |
| `createClumpFromLocks` | 14199 | function |  | 7 |
| `addLockToClump` | 14224 | function |  | 4 |
| `pointerToNdc` | 14280 | function |  | 1 |
| `gridProfileSkipCol` | 14296 | function |  | 3 |
| `clumpDirectMembers` | 14320 | function |  | 3 |
| `clumpMembersForGuide` | 14325 | function |  | 6 |
| `clumpGuideForLock` | 14329 | function |  | 13 |
| `proceduralGuideForLock` | 14334 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 14341 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 14348 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 14355 | function |  | 3 |
| `proceduralBranchWorldPoints` | 14367 | function |  | 2 |
| `applyProceduralBranchSettings` | 14380 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 14419 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 14435 | function |  | 3 |
| `createProceduralAccessoryLock` | 14449 | function |  | 2 |
| `applyProceduralAccessorySettings` | 14501 | function |  | 2 |
| `clumpFrameAt` | 14552 | function |  | 5 |
| `commitClumpMemberRestState` | 14560 | function |  | 10 |
| `updateClumpMembers` | 14643 | function |  | 10 |
| `dissolveClump` | 14747 | function |  | 6 |
| `detachLockFromClump` | 14784 | function |  | 4 |
| `updateDrawVolumePreview` | 14810 | function |  | 5 |
| `hideDrawClumpPreviews` | 14834 | function |  | 5 |
| `resetDrawVolumePreview` | 14840 | function |  | 3 |
| `updateDrawStrandPreview` | 14846 | function |  | 22 |
| `continueFromTipEnabled` | 15067 | function |  | 2 |
| `selectedTipContinuationLock` | 15073 | function |  | 3 |
| `beginDrawStrandStroke` | 15088 | function |  | 2 |
| `beginDrawFreePlane` | 15217 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 15231 | function |  | 2 |
| `updateDrawStrandStroke` | 15256 | function |  | 1 |
| `createDrawnLock` | 15302 | function |  | 3 |
| `setting` | 15306 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 15374 | function |  | 4 |
| `createDrawnBraid` | 15382 | function |  | 2 |
| `createDrawnStrand` | 15439 | function |  | 2 |
| `createDrawnPanel` | 15566 | function |  | 2 |
| `extendDrawnStrand` | 15618 | function |  | 2 |
| `finishDrawStrandStroke` | 15651 | function |  | 6 |
| `createPlacedStrand` | 15678 | function |  | 2 |
| `placedPointCount` | 15742 | function |  | 3 |
| `createPlacedPoints` | 15746 | function |  | 3 |
| `pushPointOutsideHead` | 15765 | function |  | 8 |
| `resizePlacedStrand` | 15797 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 15814 | function |  | 5 |
| `beginPlaceEdit` | 15819 | function |  | 2 |
| `updatePlaceEdit` | 15837 | function |  | 1 |
| `updatePlacementLength` | 15851 | function |  | 3 |
| `updatePlacementOrientation` | 15861 | function |  | 3 |
| `endPlaceEdit` | 15879 | function |  | 1 |
| `confirmPendingPlacedStrand` | 15894 | function |  | 1 |
| `pendingPlacedLock` | 15904 | function |  | 2 |
| `beginPlacementPointer` | 15908 | function |  | 3 |
| `finishPlacementPointer` | 15918 | function |  | 2 |
| `confirmPlacementStep` | 15942 | function |  | 2 |
| `finishPlacementFlow` | 15965 | function |  | 6 |
| `updatePlacementStatus` | 15978 | function |  | 53 |
| `deselectStrands` | 16117 | function |  | 11 |
| `beginSelectionMarquee` | 16132 | function |  | 3 |
| `beginAltOrbit` | 16156 | function |  | 1 |
| `beginBlenderNavigation` | 16168 | function |  | 1 |
| `endBlenderNavigation` | 16213 | function |  | 1 |
| `prepareSelectPointerCapture` | 16221 | function |  | 1 |
| `endSelectPointerCapture` | 16227 | function |  | 1 |
| `applyAltClickCandidate` | 16233 | function |  | 2 |
| `finishBrushAltClick` | 16259 | function |  | 1 |
| `endAltOrbit` | 16272 | function |  | 2 |
| `dollyCameraByDrag` | 16279 | function |  | 2 |
| `fastDragMagnitude` | 16302 | function |  | 2 |
| `beginHoudiniZoomDrag` | 16308 | function |  | 1 |
| `updateHoudiniZoomDrag` | 16316 | function |  | 1 |
| `endHoudiniZoomDrag` | 16333 | function |  | 1 |
| `updateSelectionMarquee` | 16341 | function |  | 1 |
| `pointInsideSelectionMarquee` | 16358 | function |  | 3 |
| `selectPointsInMarquee` | 16366 | function |  | 2 |
| `pointKey` | 16392 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 16423 | function |  | 2 |
| `objectInsideSelectionMarquee` | 16460 | function |  | 3 |
| `projectedPoint` | 16477 | arrow |  | 1 |
| `selectObjectsInMarquee` | 16506 | function |  | 2 |
| `finishSelectionMarquee` | 16551 | function |  | 2 |
| `headMeshes` | 16574 | function |  | 6 |
| `strandSplitProfileData` | 16582 | function |  | 4 |
| `strandSplitControlPoint` | 16595 | function |  | 4 |
| `panelSplitControlPoint` | 16631 | function |  | 8 |
| `panelWidthAt` | 16648 | arrow |  | 3 |
| `panelThicknessAt` | 16655 | arrow |  | 3 |
| `strandControlPointRaycast` | 16688 | function |  | 1 |
| `strandControlPointFrame` | 16723 | function |  | 4 |
| `strandControlPointHitFromEvent` | 16755 | function |  | 4 |
| `createCurveObjects` | 16813 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 17075 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 17082 | function |  | 2 |
| `strandWidthEdgeSample` | 17091 | function |  | 3 |
| `strandWidthEdgePoints` | 17114 | function |  | 2 |
| `sculptBrushDebugRaycast` | 17128 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 17132 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 17139 | function |  | 3 |
| `refreshSculptBrushDebugView` | 17151 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 17156 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 17162 | function |  | 3 |
| `updateCurveObjects` | 17176 | function |  | 39 |
| `syncTipNormalArrow` | 17418 | arrow |  | 4 |
| `createCurveNormalIndicator` | 17631 | function |  | 3 |
| `pointUpDirection` | 17657 | function |  | 2 |
| `curveFrameAtPoint` | 17661 | function |  | 4 |
| `curveFrameAt` | 17682 | function |  | 4 |
| `strandTwistAt` | 17702 | function |  | 6 |
| `controlPointRotationAt` | 17707 | function |  | 3 |
| `strandProfileTwistAt` | 17711 | function |  | 2 |
| `strandFrameAt` | 17717 | function |  | 2 |
| `curveFrameAtSnapshot` | 17723 | function |  | 3 |
| `outwardNormalAtPoint` | 17742 | function |  | 9 |
| `sampledSurfaceNormal` | 17767 | function |  | 2 |
| `guidedNormalAt` | 17783 | function |  | 6 |
| `twistFromHandle` | 17802 | function |  | 3 |
| `signedAngleAroundAxis` | 17823 | function |  | 6 |
| `handleColor` | 17830 | function |  | 2 |
| `isAffectedCurvePoint` | 17853 | function |  | 2 |
| `syncLockFromCurve` | 17859 | function |  | 24 |
| `labelForPreset` | 17889 | function |  | 1 |
| `rebuildLockGeometry` | 17893 | function |  | 9 |
| `scheduleSculptBrushGeometryUpdates` | 17920 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 17928 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 17934 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 17956 | function |  | 8 |
| `updateLockGeometry` | 17969 | function |  | 55 |
| `setGroupColorView` | 17990 | function |  | 2 |
| `createUvCheckerTexture` | 18000 | function |  | 3 |
| `ensureUvCheckerForLock` | 18036 | function |  | 4 |
| `removeUvCheckerFromLock` | 18069 | function |  | 3 |
| `invalidateUvInspector` | 18084 | function |  | 7 |
| `uvInspectorRecord` | 18088 | function |  | 1 |
| `uvInspectorRecords` | 18127 | function |  | 2 |
| `drawUvInspectorGrid` | 18131 | function |  | 2 |
| `renderUvInspector` | 18165 | function |  | 3 |
| `setUvCheckerEnabled` | 18224 | function |  | 3 |
| `strandViewportBaseColor` | 18241 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 18276 | function |  | 3 |
| `syncStrandSelectionOutline` | 18282 | function |  | 2 |
| `applyLockedStrandPalette` | 18293 | function |  | 2 |
| `syncLockedStrandWireVisual` | 18302 | function |  | 6 |
| `setStrandSelectionVisual` | 18311 | function |  | 5 |
| `proceduralParentOutlineVisible` | 18327 | function |  | 2 |
| `syncProceduralParentVisibility` | 18334 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 18343 | function |  | 2 |
| `updateStrandSelectionHighlight` | 18347 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 18351 | function |  | 2 |
| `resetGuideSelectionVisuals` | 18364 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 18384 | function |  | 3 |
| `selectLock` | 18417 | function |  | 43 |
| `deselectStrandsForGuideEditor` | 18479 | function |  | 2 |
| `syncGroupInputs` | 18490 | function |  | 2 |
| `topologyStatsForLock` | 18523 | function |  | 4 |
| `formatTopologyStats` | 18531 | function |  | 5 |
| `updateTopologyStats` | 18535 | function |  | 23 |
| `normalizeBraidDimensions` | 18569 | function |  | 3 |
| `normalizeStrandDimensions` | 18582 | function |  | 3 |
| `strandBaseWidth` | 18596 | function |  | 5 |
| `strandWidthDimension` | 18600 | function |  | 5 |
| `strandDepthDimension` | 18608 | function |  | 8 |
| `setStrandWidthDimension` | 18616 | function |  | 2 |
| `setStrandDepthDimension` | 18638 | function |  | 4 |
| `syncShapeDimensionInputs` | 18654 | function |  | 4 |
| `syncCreationShapeInputs` | 18690 | function |  | 3 |
| `syncViewportDrawSettings` | 18728 | function |  | 4 |
| `selectedPanelSegment` | 18742 | function |  | 6 |
| `syncPanelSegmentControls` | 18748 | function |  | 11 |
| `syncPanelShapeInputs` | 18766 | function |  | 6 |
| `syncStrandSplitInputs` | 18793 | function |  | 4 |
| `syncHairCardControls` | 18802 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 18810 | function |  | 3 |
| `updateAttributeEditorMode` | 18849 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 18999 | function |  | 2 |
| `curveLatticeForGroup` | 19022 | function |  | 2 |
| `filterCurveLatticesToGroup` | 19040 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 19085 | function |  | 2 |
| `showCurveLatticeForGroup` | 19102 | function |  | 2 |
| `selectStrandGroup` | 19139 | function |  | 3 |
| `selectCurvePoint` | 19181 | function |  | 10 |
| `updateSelectedPointLabel` | 19195 | function |  | 12 |
| `syncInputs` | 19208 | function |  | 15 |
| `syncClumpGuidePanel` | 19254 | function |  | 3 |
| `getSelectedLock` | 19281 | function |  | 104 |
| `selectedLocksInOrder` | 19285 | function |  | 37 |
| `lockStrands` | 19291 | function |  | 3 |
| `lockSelectedStrands` | 19324 | function |  | 3 |
| `unlockStrands` | 19330 | function |  | 3 |
| `unlockAllStrands` | 19345 | function |  | 3 |
| `strandEditFamily` | 19349 | function |  | 7 |
| `compatibleSelectedLocks` | 19354 | function |  | 4 |
| `selectedEditRoots` | 19361 | function |  | 2 |
| `editSelectedLocks` | 19374 | function |  | 16 |
| `multiEditValuesEqual` | 19407 | function |  | 2 |
| `setMixedControl` | 19416 | function |  | 28 |
| `syncMultiStrandInputs` | 19433 | function |  | 16 |
| `values` | 19449 | arrow |  | 37 |
| `selectedRebuildableCurves` | 19529 | function |  | 5 |
| `createCompoundStrand` | 19536 | function |  | 1 |
| `refreshRebuildCurveDialog` | 19597 | function |  | 8 |
| `openRebuildCurveDialog` | 19610 | function |  | 1 |
| `rebuildSelectedCurves` | 19624 | function |  | 2 |
| `selectionCanBecomeClump` | 19663 | function |  | 4 |
| `createClumpFromSelection` | 19668 | function |  | 3 |
| `cleanSelectionSets` | 19680 | function |  | 2 |
| `createSelectionSetFromSelection` | 19685 | function |  | 3 |
| `selectionSetById` | 19696 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 19700 | function |  | 7 |
| `editSelectionSetFromSelection` | 19709 | function |  | 5 |
| `deleteSelectionSet` | 19729 | function |  | 2 |
| `selectSelectionSet` | 19738 | function |  | 2 |
| `deleteSelectedStrands` | 19748 | function |  | 4 |
| `deleteGuide` | 19756 | function |  | 3 |
| `deleteSelectedGuide` | 19779 | function |  | 3 |
| `deleteSelectedReferenceImage` | 19783 | function |  | 4 |
| `hasDeletableSelection` | 19796 | function |  | 2 |
| `deleteCurrentSelection` | 19804 | function |  | 3 |
| `hideOutlinerContextMenu` | 19812 | function |  | 17 |
| `outlinerLockTargets` | 19817 | function |  | 3 |
| `showOutlinerContextMenu` | 19844 | function |  | 8 |
| `hideStrandRadialMenu` | 19924 | function |  | 4 |
| `ensureRadialButtonCapacity` | 19935 | function |  | 3 |
| `radialButtonDimensions` | 19948 | function |  | 4 |
| `radialMenuDimensionsForKind` | 19957 | function |  | 3 |
| `applyRadialMenuDimensions` | 19974 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 19980 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 19993 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 20014 | function |  | 2 |
| `selectionSetRadialMenuOption` | 20031 | function |  | 4 |
| `selectedMirrorRadialOptions` | 20040 | function |  | 3 |
| `strandVisibilityRadialOptions` | 20062 | function |  | 5 |
| `clumpMirrorRadialOptions` | 20080 | function |  | 2 |
| `contextualRadialOptions` | 20087 | function |  | 3 |
| `sharedRadialFrameDimensions` | 20216 | function |  | 3 |
| `layoutContextualRadialOptions` | 20220 | function |  | 4 |
| `renderRadialActionList` | 20244 | function |  | 3 |
| `radialListOptionAtPointer` | 20262 | function |  | 3 |
| `syncRadialListHighlight` | 20284 | function |  | 3 |
| `configureContextualRadialMenu` | 20290 | function |  | 3 |
| `beginStrandRadialGesture` | 20350 | function |  | 2 |
| `enterStrandRadialSubmenu` | 20384 | function |  | 2 |
| `updateStrandRadialGesture` | 20430 | function |  | 1 |
| `performStrandRadialAction` | 20469 | function |  | 2 |
| `finishStrandRadialGesture` | 20572 | function |  | 2 |
| `cancelStrandRadialGesture` | 20582 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 20589 | function |  | 1 |
| `setPullMoveEnabled` | 20595 | function |  | 3 |
| `toolRadialOptions` | 20603 | function |  | 2 |
| `hideToolRadialMenu` | 20628 | function |  | 4 |
| `beginToolRadialGesture` | 20641 | function |  | 2 |
| `beginToolShortcutPress` | 20681 | function |  | 2 |
| `finishToolShortcutPress` | 20696 | function |  | 2 |
| `cancelToolShortcutPress` | 20705 | function |  | 5 |
| `setRadialMenusEnabled` | 20713 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 20726 | function |  | 5 |
| `setNavigationTipsEnabled` | 20741 | function |  | 5 |
| `configureNavigationMouseButtons` | 20748 | function |  | 3 |
| `syncNavigationModifierLocks` | 20761 | function |  | 7 |
| `setNavigationStyle` | 20766 | function |  | 5 |
| `applyCameraSmoothingPreference` | 20782 | function |  | 4 |
| `setCameraSmoothingEnabled` | 20797 | function |  | 5 |
| `setCameraSmoothingStrength` | 20803 | function |  | 5 |
| `setScaleSensitivity` | 20811 | function |  | 3 |
| `setToolTipsEnabled` | 20819 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 20826 | function |  | 5 |
| `setViewportStatisticsEnabled` | 20835 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 20843 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 20858 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 20867 | function |  | 5 |
| `sideNamingDisplayId` | 20876 | function |  | 3 |
| `referenceViewDisplayLabel` | 20888 | function |  | 6 |
| `strandRegionDisplayLabel` | 20898 | function |  | 7 |
| `updateSideNamingLabels` | 20916 | function |  | 2 |
| `setSideNamingPerspective` | 20943 | function |  | 5 |
| `setControlPointDisplaySize` | 20952 | function |  | 6 |
| `scaleHexColor` | 20964 | function |  | 3 |
| `setViewportBackgroundColor` | 20969 | function |  | 7 |
| `setDefaultHairShader` | 20991 | function |  | 5 |
| `setPreferenceCategory` | 20997 | function |  | 4 |
| `openPreferencesDialog` | 21024 | function |  | 1 |
| `savePreferencesDialog` | 21052 | function |  | 1 |
| `cancelPreferencesDialog` | 21076 | function |  | 3 |
| `updateToolRadialGesture` | 21105 | function |  | 1 |
| `performToolRadialAction` | 21134 | function |  | 2 |
| `finishToolRadialGesture` | 21144 | function |  | 2 |
| `cancelToolRadialGesture` | 21153 | function |  | 5 |
| `duplicatePlacementTarget` | 21160 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 21187 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 21191 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 21201 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 21206 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 21218 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 21229 | function |  | 7 |
| `openProceduralDuplicateDialog` | 21237 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 21254 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 21275 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 21286 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 21292 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 21298 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 21331 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 21486 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 21588 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 21629 | function |  | 2 |
| `updateDuplicatePlacement` | 21656 | function |  | 2 |
| `beginDuplicatePlacement` | 21720 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 21784 | function |  | 2 |
| `confirmDuplicatePlacement` | 21825 | function |  | 1 |
| `cancelDuplicatePlacement` | 21862 | function |  | 4 |
| `outlinerClumpLocks` | 21888 | function |  | 11 |
| `handleOutlinerClumpDrop` | 21892 | function |  | 3 |
| `createOutlinerStrandButton` | 21915 | function |  | 4 |
| `createOutlinerCurveSurface` | 22001 | function |  | 2 |
| `createOutlinerClump` | 22097 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 22179 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 22186 | function |  | 2 |
| `renderLockList` | 22265 | function |  | 61 |
| `updateCount` | 22419 | function |  | 26 |
| `captureInputUndo` | 22428 | function |  | 1 |
| `bindUndoCapture` | 22434 | function |  | 37 |
| `bindLockInput` | 22445 | function |  | 2 |
| `applyValue` | 22462 | arrow |  | 2 |
| `applyUniformTransformScale` | 22781 | function |  | 2 |
| `applyReducedTransformScale` | 22798 | function |  | 2 |
| `applyTransformPrecision` | 22837 | function |  | 2 |
| `updateTransformScalePointer` | 22866 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 23868 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 23873 | function |  | 4 |
| `syncDrawCurlControls` | 23928 | function |  | 5 |
| `handleLiveSurfaceChange` | 23976 | function |  | 1 |
| `changePanelSplitCount` | 24125 | function |  | 3 |
| `applyPresetControl` | 24275 | function |  | 2 |
| `applyCreationToolSettings` | 24296 | function |  | 2 |
| `populateCreationPresetSelect` | 24340 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 24364 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 24397 | function |  | 5 |
| `createCustomCreationPreset` | 24405 | function |  | 3 |
| `createCustomClumpPreset` | 24420 | function |  | 3 |
| `commitCustomCreationPreset` | 24435 | function |  | 2 |
| `openRemoveCreationPreset` | 24496 | function |  | 3 |
| `commitRemoveCreationPreset` | 24509 | function |  | 1 |
| `applyBraidToolPreset` | 24526 | function |  | 2 |
| `selectedBranchChildLock` | 24638 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 24642 | function |  | 2 |
| `initPanelResizeHandles` | 24748 | function |  | 2 |
| `applyWidth` | 24754 | arrow |  | 2 |
| `restoreWidth` | 24761 | arrow |  | 2 |
| `bindResize` | 24769 | arrow |  | 2 |
| `onMove` | 24778 | arrow |  | 0 |
| `onUp` | 24782 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 24799 | function |  | 2 |
| `initFloatingPanelControls` | 24808 | function |  | 2 |
| `detach` | 24817 | arrow |  | 28 |
| `endDrag` | 24855 | arrow |  | 0 |
| `endResize` | 24887 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 24898 | function |  | 3 |
| `selectPatchNotesVersion` | 25032 | function |  | 3 |
| `requestReferenceImage` | 25065 | function |  | 5 |
| `toggleCapsuleGuideTool` | 25269 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 25275 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 25282 | function |  | 1 |
| `deleteLocks` | 25849 | function |  | 10 |
| `disposeCurveObjects` | 25927 | function |  | 4 |
| `beginTipSubBoneRotate` | 26013 | function |  | 2 |
| `applyTipSubBoneTransform` | 26043 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 26075 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 26200 | function |  | 1 |
| `endPanelSplitHandleDrag` | 26421 | function |  | 3 |
| `resize` | 26454 | function |  | 3 |
| `handleViewportPointerMove` | 26465 | function |  | 1 |
| `blockProportionalSizingEvent` | 26476 | function |  | 1 |
| `updateLightAngleFromInputs` | 26482 | function |  | 2 |
| `startViewSnap` | 26496 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 26526 | function |  | 3 |
| `trackViewportPointerDown` | 26543 | function |  | 1 |
| `trackViewportPointerMove` | 26559 | function |  | 1 |
| `clearViewportPointer` | 26567 | function |  | 1 |
| `updateViewSnap` | 26572 | function |  | 1 |
| `nearestCardinalAxis` | 26608 | function |  | 5 |
| `cardinalAxisKey` | 26622 | function |  | 5 |
| `steppedDragAmount` | 26626 | function |  | 3 |
| `snapCameraToCardinalAxis` | 26632 | function |  | 4 |
| `endViewSnap` | 26648 | function |  | 4 |
| `activateStrandControlPoint` | 26658 | function |  | 4 |
| `refreshStrandControlPointSelection` | 26708 | function |  | 4 |
| `addStrandControlPointSelection` | 26735 | function |  | 3 |
| `removeStrandControlPointSelection` | 26752 | function |  | 3 |
| `sampleStrandPointNormal` | 26766 | function |  | 2 |
| `sampleStrandPointVectors` | 26776 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 26782 | function |  | 2 |
| `resampleStrandCurveData` | 26793 | function |  | 4 |
| `resampleMatchingVectors` | 26799 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 26838 | function |  | 4 |
| `removeStrandCurvePoint` | 26849 | function |  | 2 |
| `closestStrandCurveParameter` | 26862 | function |  | 2 |
| `insertStrandCurvePoint` | 26891 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 26908 | function |  | 2 |
| `selectionModifierCursorAvailable` | 26918 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 26934 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 26941 | function |  | 4 |
| `prepareCurvePointSelection` | 26963 | function |  | 1 |
| `finishCurvePointInsertion` | 27074 | function |  | 1 |
| `finishPointRemoval` | 27089 | function |  | 1 |
| `editableStrandWidth` | 27107 | function |  | 6 |
| `editableStrandWidthBounds` | 27119 | function |  | 2 |
| `applyEditableStrandWidth` | 27125 | function |  | 3 |
| `viewportPixelPoint` | 27161 | function |  | 5 |
| `syncSculptBrushControls` | 27169 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 27184 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 27192 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 27200 | function |  | 1 |
| `sculptBrushPlaneOffset` | 27206 | function |  | 5 |
| `setSculptBrushCursorVisible` | 27210 | function |  | 6 |
| `updateSculptBrushCursor` | 27217 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 27239 | function |  | 4 |
| `sculptBrushEditableLock` | 27246 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 27256 | function |  | 5 |
| `sculptBrushLockViable` | 27262 | function |  | 5 |
| `sculptBrushUnits` | 27273 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 27311 | function |  | 4 |
| `sculptBrushPointWeight` | 27361 | function |  | 6 |
| `sculptBrushWorldDelta` | 27371 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 27380 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 27406 | function |  | 2 |
| `beginSculptMoveStroke` | 27464 | function |  | 1 |
| `isHairCreateTool` | 27526 | function |  | 4 |
| `syncStrandHoverOutline` | 27530 | function |  | 1 |
| `pointerOverTaperEditor` | 27543 | function |  | 3 |
| `updateStrandBrushHover` | 27550 | function |  | 1 |
| `updatePanelTipHover` | 27571 | function |  | 1 |
| `applySubBoneBrushSample` | 27601 | function |  | 2 |
| `applySculptMoveStrokeSample` | 27746 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 27984 | function |  | 3 |
| `updateSculptMoveStroke` | 27993 | function |  | 1 |
| `finishSculptMoveStroke` | 28009 | function |  | 3 |
| `strandControlPointHit` | 28057 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 28061 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 28139 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 28173 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 28213 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 28226 | function |  | 1 |
| `setHoveredControlPoint` | 28265 | function |  | 7 |
| `visibleControlPointHoverTargets` | 28278 | function |  | 2 |
| `updateControlPointHover` | 28314 | function |  | 1 |
| `animate` | 28929 | function |  | 2 |
| `syncCompactSidebarLayout` | 28960 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 28979 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 28985 | function |  | 3 |
| `setAttributeEditorTab` | 28991 | function |  | 6 |

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
