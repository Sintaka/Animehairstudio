# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-11），由 `node scripts/gen-function-index.js` 产出。共 **1802** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（32531 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 269 | function |  | 3 |
| `saveBooleanPreference` | 297 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 301 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 306 | function |  | 2 |
| `normalizeScaleSensitivity` | 311 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 316 | function |  | 2 |
| `normalizeSideNamingPerspective` | 321 | function |  | 2 |
| `normalizeNavigationStyle` | 325 | function |  | 2 |
| `setupEditableSliderControls` | 340 | function |  | 2 |
| `syncNumberFromRange` | 391 | arrow |  | 0 |
| `applyNumberValue` | 398 | arrow |  | 0 |
| `copyCameraPose` | 504 | function |  | 3 |
| `updateCameraProjectionForViewport` | 510 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 523 | function |  | 3 |
| `setOrthographicView` | 529 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 569 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 598 | function |  | 2 |
| `removeRotateFreeAxisRing` | 624 | function |  | 2 |
| `deflateTransformGizmoPickers` | 636 | function |  | 2 |
| `nextStrandName` | 1031 | function |  | 2 |
| `activeDrawClumpTemplate` | 1116 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1121 | function |  | 3 |
| `drawModeCreatesClump` | 1148 | function |  | 1 |
| `isPanelGeometry` | 1292 | function |  | 51 |
| `normalizePanelSplits` | 1296 | function |  | 3 |
| `clonePanelSplits` | 1308 | function |  | 32 |
| `snapPanelSplitHeight` | 1312 | function |  | 5 |
| `createQuadSphereGeometry` | 1347 | function |  | 2 |
| `vertexIndex` | 1361 | function |  | 11 |
| `addEdge` | 1379 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1529 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1709 | function |  | 2 |
| `currentStrandSelectionState` | 1771 | function |  | 4 |
| `applyStrandSelectionState` | 1775 | function |  | 5 |
| `clearStrandSelectionState` | 1780 | function |  | 6 |
| `disposeGuideModel` | 2773 | function |  | 3 |
| `syncHeadTransformInputs` | 2784 | function |  | 3 |
| `applyHeadTransform` | 2791 | function |  | 4 |
| `resetHeadTransform` | 2811 | function |  | 2 |
| `installGuideModel` | 2826 | function |  | 5 |
| `loadDefaultGuideModel` | 2902 | function |  | 3 |
| `braidTemplateFromEntries` | 2925 | function |  | 4 |
| `braidMeshEntries` | 2957 | function |  | 2 |
| `prepareBraidBodyCache` | 2969 | function |  | 2 |
| `quantize` | 2978 | arrow |  | 21 |
| `sourceNormalAt` | 2990 | arrow |  | 1 |
| `clusterBoundary` | 2993 | arrow |  | 2 |
| `normalBuckets` | 3010 | arrow |  | 2 |
| `applyBucketPair` | 3042 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3073 | function |  | 2 |
| `annotateBraidObjTopology` | 3094 | function |  | 2 |
| `loadBraidMeshPreset` | 3114 | function |  | 3 |
| `createSplitControlHandle` | 3131 | function |  | 6 |
| `frameGuideModel` | 3146 | function |  | 2 |
| `normalizeHairLayer` | 3175 | function |  | 27 |
| `layerOffsetForLock` | 3179 | function |  | 8 |
| `layerRootOffsetFactor` | 3184 | function |  | 12 |
| `layerOffsetWeight` | 3188 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3194 | function |  | 5 |
| `pointsWithLayerOffset` | 3203 | function |  | 3 |
| `layerDirectionForLock` | 3211 | function |  | 2 |
| `applyLayerOffset` | 3222 | function |  | 5 |
| `setLockHairLayer` | 3246 | function |  | 2 |
| `setGroupLayerOffset` | 3261 | function |  | 2 |
| `quadraticWeights` | 3289 | function |  | 1 |
| `setHeadReferenceTransparency` | 3300 | function |  | 4 |
| `trianglePlaneIntersections` | 3312 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3333 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3542 | function |  | 1 |
| `upperContourCurve` | 3559 | function |  | 2 |
| `hermitePoint` | 3594 | function |  | 2 |
| `curveNetworkSection` | 3605 | function |  | 1 |
| `pointAlongSection` | 3634 | function |  | 1 |
| `longestStitchedContour` | 3640 | function |  | 2 |
| `nodeForPoint` | 3648 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3705 | function |  | 1 |
| `exitSetupEditors` | 3725 | function |  | 7 |
| `syncAppMenuVisibility` | 3735 | function |  | 3 |
| `closeAppMenus` | 3741 | function |  | 6 |
| `setAppMenuOpen` | 3752 | function |  | 2 |
| `setTurntableActive` | 3759 | function |  | 3 |
| `selectedReferenceImage` | 3769 | function |  | 20 |
| `normalizeReferenceCrop` | 3775 | function |  | 8 |
| `referenceCropIsFull` | 3783 | function |  | 3 |
| `referencePlaneFrontAxis` | 3788 | function |  | 4 |
| `referencePlanePlacement` | 3797 | function |  | 4 |
| `migratedReferencePlanePosition` | 3812 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3832 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3849 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3865 | function |  | 2 |
| `snappedReferenceImageView` | 3888 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3894 | function |  | 5 |
| `applyReferenceImageRuntime` | 3910 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 3953 | function |  | 6 |
| `createReferenceImageRuntime` | 3961 | function |  | 3 |
| `addReferenceImage` | 4030 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4082 | function |  | 3 |
| `disposeReferenceImage` | 4101 | function |  | 2 |
| `clearReferenceImages` | 4105 | function |  | 2 |
| `serializeReferenceImage` | 4112 | function |  | 1 |
| `setReferenceImageType` | 4140 | function |  | 2 |
| `attachReferenceImageTransform` | 4184 | function |  | 6 |
| `selectReferenceImage` | 4198 | function |  | 12 |
| `placeReferencePlane` | 4221 | function |  | 2 |
| `setReferencePlaneInFront` | 4232 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4242 | function |  | 4 |
| `renderReferenceImagePanel` | 4261 | function |  | 20 |
| `setOutlinerTab` | 4308 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4326 | function |  | 4 |
| `componentEditModeActive` | 4330 | function |  | 30 |
| `selectionToolSupportsPicking` | 4334 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4339 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4355 | function |  | 2 |
| `setViewportSelectionMode` | 4385 | function |  | 4 |
| `setViewportEditMode` | 4397 | function |  | 14 |
| `createOutlinerVisibilityToggle` | 4439 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4453 | function |  | 8 |
| `normalizeOutlinerName` | 4467 | function |  | 3 |
| `beginOutlinerRename` | 4472 | function |  | 2 |
| `finish` | 4483 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4513 | function |  | 6 |
| `referenceOutlinerGroup` | 4525 | function |  | 2 |
| `renderReferenceOutliner` | 4529 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4646 | function |  | 5 |
| `readReferenceImageFile` | 4651 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4675 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4682 | function |  | 3 |
| `dragContainsReferenceImage` | 4727 | function |  | 3 |
| `setReferenceImageDragActive` | 4738 | function |  | 9 |
| `referenceDropDestination` | 4746 | function |  | 2 |
| `viewportOverlayDropPosition` | 4752 | function |  | 2 |
| `setReferenceDropHover` | 4761 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4779 | function |  | 2 |
| `referenceOverlayAtPointer` | 4799 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4817 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4830 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4876 | function |  | 1 |
| `finishReferenceOverlayDrag` | 4926 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 4948 | function |  | 6 |
| `updateReferenceOverlayCursor` | 4959 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 4985 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 4994 | function |  | 2 |
| `referenceCropCursor` | 5009 | function |  | 3 |
| `updateReferenceCropHandles` | 5015 | function |  | 5 |
| `referenceCropSourcePoint` | 5036 | function |  | 2 |
| `beginReferenceCrop` | 5043 | function |  | 1 |
| `updateReferenceCrop` | 5081 | function |  | 1 |
| `finishReferenceCrop` | 5113 | function |  | 4 |
| `setHeadSetupEditing` | 5131 | function |  | 6 |
| `strandPassesDisplayFilters` | 5157 | function |  | 4 |
| `strandVisibleForDisplay` | 5166 | function |  | 14 |
| `strandAvailableForViewportInteraction` | 5171 | function |  | 3 |
| `lockedStrandsExist` | 5175 | function |  | 3 |
| `hiddenStrandsExist` | 5179 | function |  | 2 |
| `hideSelectedStrands` | 5183 | function |  | 2 |
| `unhideHiddenStrands` | 5193 | function |  | 2 |
| `strandIsolationActive` | 5202 | function |  | 7 |
| `setStrandIsolation` | 5206 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5218 | function |  | 3 |
| `syncVisibilityParent` | 5229 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5236 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5265 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5272 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5295 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5468 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5489 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5508 | function |  | 2 |
| `selectedViewportFocusBounds` | 5606 | function |  | 2 |
| `frameViewportBounds` | 5620 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5650 | function |  | 2 |
| `fullSceneFocusBounds` | 5654 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5669 | function |  | 3 |
| `cycleViewportFraming` | 5678 | function |  | 2 |
| `sculptBrushToolActive` | 5698 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 5702 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5706 | function |  | 3 |
| `effectiveSculptBrushTool` | 5710 | function |  | 15 |
| `updateSculptScaleModeRow` | 5716 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5721 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5743 | function |  | 5 |
| `setActiveTool` | 5752 | function |  | 16 |
| `setDrawStrandMode` | 5890 | function |  | 2 |
| `setObjectSpaceEditing` | 5900 | function |  | 7 |
| `setHierarchyEditing` | 5916 | function |  | 4 |
| `setProportionalEditing` | 5928 | function |  | 5 |
| `beginProportionalSizeEdit` | 5947 | function |  | 3 |
| `updateProportionalSizeEdit` | 5959 | function |  | 2 |
| `endProportionalSizeEdit` | 5970 | function |  | 5 |
| `activateProportionalHotkeyHold` | 5977 | function |  | 2 |
| `refreshProportionalPreview` | 5985 | function |  | 4 |
| `activeBrushSizeInput` | 5995 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6004 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6016 | function |  | 2 |
| `beginBrushSizeDrag` | 6034 | function |  | 1 |
| `updateBrushSizeDrag` | 6061 | function |  | 1 |
| `finishBrushSizeDrag` | 6082 | function |  | 2 |
| `updateInteractionLocks` | 6099 | function |  | 80 |
| `configureTransformControls` | 6110 | function |  | 13 |
| `pullMoveActive` | 6118 | function |  | 9 |
| `updatePullGuideVisual` | 6122 | function |  | 4 |
| `attachTransformForCurvePoint` | 6138 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6162 | function |  | 6 |
| `strandObjectRootIndex` | 6178 | function |  | 3 |
| `strandObjectRoot` | 6187 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6191 | function |  | 2 |
| `attachStrandObjectTransform` | 6196 | function |  | 6 |
| `guideObjectPivot` | 6219 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6230 | function |  | 2 |
| `attachGuideObjectTransform` | 6235 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6254 | function |  | 2 |
| `beginGuideObjectTransform` | 6282 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6289 | function |  | 2 |
| `updateGuideObjectTransform` | 6311 | function |  | 2 |
| `finishGuideObjectTransform` | 6344 | function |  | 2 |
| `clonePlacementFrame` | 6353 | function |  | 2 |
| `cloneOptionalVectors` | 6365 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6369 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6386 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6401 | function |  | 2 |
| `strandObjectTransformOperators` | 6417 | function |  | 4 |
| `transformPoint` | 6425 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6432 | arrow |  | 0 |
| `transformNormal` | 6438 | arrow |  | 10 |
| `transformDirection` | 6448 | arrow |  | 5 |
| `worldMatrixForPivot` | 6460 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6466 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6482 | function |  | 6 |
| `beginStrandObjectTransform` | 6508 | function |  | 2 |
| `updateStrandObjectTransform` | 6546 | function |  | 2 |
| `commitStrandObjectTransform` | 6604 | function |  | 2 |
| `mapPoints` | 6617 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6651 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6665 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6688 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6701 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6716 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6742 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6791 | function |  | 2 |
| `beginHandleEdit` | 6800 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6853 | function |  | 3 |
| `multiPointHandleEditActive` | 6864 | function |  | 7 |
| `applyMultiMove` | 6868 | function |  | 5 |
| `applyMultiRotate` | 6874 | function |  | 2 |
| `applyMultiScale` | 6883 | function |  | 2 |
| `applyHierarchicalMove` | 6892 | function |  | 3 |
| `applySingleMove` | 6904 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6908 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6925 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6934 | function |  | 3 |
| `changed` | 6944 | arrow |  | 1 |
| `applyPullMove` | 6986 | function |  | 3 |
| `pullHeadCollisionContext` | 6994 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7013 | function |  | 2 |
| `applyProportionalMove` | 7036 | function |  | 3 |
| `viewPlaneNormal` | 7047 | function |  | 19 |
| `isCameraInSnappedView` | 7051 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7059 | function |  | 9 |
| `updateViewPlaneGrid` | 7063 | function |  | 14 |
| `setViewPlaneMove` | 7120 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7131 | function |  | 2 |
| `rayFromViewportEvent` | 7139 | function |  | 19 |
| `worldUnitsPerViewportPixel` | 7147 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7157 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7168 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7181 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7200 | function |  | 4 |
| `beginViewPlaneMove` | 7207 | function |  | 3 |
| `updateViewPlaneMove` | 7271 | function |  | 1 |
| `endViewPlaneMove` | 7336 | function |  | 7 |
| `applyHierarchicalRotate` | 7355 | function |  | 2 |
| `rotateGuideNormal` | 7362 | arrow |  | 4 |
| `applySingleRotate` | 7400 | function |  | 2 |
| `applyProportionalRotate` | 7404 | function |  | 2 |
| `applyHierarchicalScale` | 7424 | function |  | 2 |
| `applySingleScale` | 7434 | function |  | 2 |
| `applyProportionalScale` | 7438 | function |  | 2 |
| `setPointScale` | 7454 | function |  | 8 |
| `proportionalWeight` | 7463 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7475 | function |  | 5 |
| `strandInfluenceColor` | 7481 | function |  | 12 |
| `beginRelaxEdit` | 7506 | function |  | 3 |
| `updateRelaxEdit` | 7535 | function |  | 1 |
| `endRelaxEdit` | 7595 | function |  | 1 |
| `disposeGuide` | 7605 | function |  | 3 |
| `removeGuideObjects` | 7633 | function |  | 3 |
| `strandRadiusAt` | 7647 | function |  | 5 |
| `strandProfileTopologyAt` | 7664 | function |  | 5 |
| `strandCurveParameters` | 7706 | function |  | 3 |
| `widthProfileAt` | 7716 | arrow |  | 1 |
| `braidFrameAt` | 7754 | function |  | 5 |
| `braidFrameAtExtended` | 7764 | function |  | 2 |
| `createBraidProfileProjector` | 7773 | function |  | 2 |
| `project` | 7789 | arrow |  | 21 |
| `createBraidGeometry` | 7804 | function |  | 2 |
| `deformationAt` | 7839 | function |  | 3 |
| `widthFor` | 7848 | arrow |  | 3 |
| `depthFor` | 7852 | arrow |  | 3 |
| `outputVertex` | 7884 | function |  | 7 |
| `appendAuthoredCap` | 7992 | function |  | 3 |
| `outputCapVertex` | 7999 | arrow |  | 6 |
| `capBoundary` | 8090 | function |  | 3 |
| `strandGeometryCurve` | 8152 | function |  | 13 |
| `strandGeometryFrameAt` | 8178 | function |  | 15 |
| `transportedStrandFrameAt` | 8241 | function |  | 6 |
| `twistOverrideAt` | 8244 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 8272 | function |  | 2 |
| `weldPanelGeometryData` | 8308 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 8354 | function |  | 3 |
| `surfacePanelPoint` | 8369 | function |  | 3 |
| `splitForkT` | 8392 | function |  | 3 |
| `tipWidthSideForkT` | 8405 | function |  | 7 |
| `tipSegmentWeightAt` | 8416 | function |  | 2 |
| `tipWidthControlTs` | 8435 | function |  | 4 |
| `tipWidthCommonForkT` | 8446 | function |  | 4 |
| `tipWidthResetCurve` | 8454 | function |  | 3 |
| `tipWidthSpreadGap` | 8472 | function |  | 4 |
| `tipWidthMultiplierAt` | 8489 | function |  | 8 |
| `tipPanelWidthAt` | 8528 | function |  | 7 |
| `buildTipWidthCurve` | 8534 | function |  | 5 |
| `addPoint` | 8544 | arrow |  | 3 |
| `setTipWidthCurveValue` | 8575 | function |  | 4 |
| `tipPanelFrameAt` | 8594 | function |  | 4 |
| `tipMainSectionPoint` | 8628 | function |  | 4 |
| `tipSurfaceFrameAt` | 8676 | function |  | 3 |
| `tipChainFrameAt` | 8707 | function |  | 4 |
| `tipWidthEdgePosition` | 8738 | function |  | 4 |
| `tipWidthEdgePoints` | 8769 | function |  | 2 |
| `tipWidthControlPlacement` | 8784 | function |  | 3 |
| `tipHighlightMaterial` | 8800 | function |  | 2 |
| `updateTipHighlight` | 8822 | function |  | 4 |
| `splitTipForSegment` | 8879 | function |  | 9 |
| `createPanelStrandGeometry` | 8922 | function |  | 2 |
| `segmentWeightAt` | 8953 | arrow |  | 1 |
| `addQuad` | 8969 | arrow |  | 6 |
| `near` | 8973 | arrow |  | 6 |
| `panelWidthAt` | 9003 | arrow |  | 6 |
| `panelThicknessAt` | 9008 | arrow |  | 6 |
| `panelFrameAt` | 9017 | arrow |  | 1 |
| `rawPanelPoint` | 9035 | arrow |  | 1 |
| `panelPoint` | 9069 | arrow |  | 3 |
| `addPatch` | 9077 | arrow |  | 1 |
| `uStart` | 9208 | arrow |  | 1 |
| `uEnd` | 9211 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 9250 | function |  | 3 |
| `inside` | 9251 | arrow |  | 2 |
| `pushOrientedTriangle` | 9273 | function |  | 7 |
| `triangulatePolygon3D` | 9284 | function |  | 1 |
| `orientedQuadFace` | 9334 | function |  | 2 |
| `createSplitStrandGeometry` | 9342 | function |  | 2 |
| `fusedIndexAt` | 9499 | arrow |  | 0 |
| `createHairCardGeometry` | 9548 | function |  | 2 |
| `createPolyGeometry` | 9647 | function |  | 2 |
| `curveSurfaceControllerCurves` | 9674 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 9683 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 9730 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 9738 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 9754 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 9763 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 9774 | function |  | 3 |
| `curveSurfaceControllerSegments` | 9782 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 9792 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 9812 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 9835 | function |  | 4 |
| `createCompoundStrandGeometry` | 9918 | function |  | 2 |
| `proceduralBranchGeometryLock` | 10169 | function |  | 2 |
| `createHairGeometry` | 10214 | function |  | 6 |
| `createBaseHairGeometry` | 10266 | function |  | 3 |
| `hairMaterialDefinition` | 10351 | function |  | 4 |
| `materialForLock` | 10355 | function |  | 8 |
| `activeHairMaterialDefinition` | 10359 | function |  | 11 |
| `strandDisplayColor` | 10365 | function |  | 14 |
| `setAnimeHairBaseColor` | 10383 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 10396 | function |  | 2 |
| `createHairMaterial` | 10436 | function |  | 5 |
| `createStrandSelectionOutline` | 10478 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 10513 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 10522 | function |  | 6 |
| `refreshMaterialUsers` | 10549 | function |  | 6 |
| `renderHairMaterialOutliner` | 10558 | function |  | 5 |
| `renderHairMaterialOptions` | 10588 | function |  | 3 |
| `syncHairMaterialEditor` | 10598 | function |  | 9 |
| `createProjectHairMaterial` | 10624 | function |  | 3 |
| `deleteActiveHairMaterial` | 10644 | function |  | 2 |
| `createHairTopologyGeometry` | 10662 | function |  | 4 |
| `createHairTopologyOverlay` | 10683 | function |  | 3 |
| `groupDefaultsFor` | 10730 | function |  | 9 |
| `creationToolActive` | 10737 | function |  | 7 |
| `activeCreationShapeDefaults` | 10741 | function |  | 9 |
| `activeStrandShapeTarget` | 10747 | function |  | 8 |
| `curvePolylineLength` | 10751 | function |  | 2 |
| `curvePolylineLengths` | 10759 | function |  | 3 |
| `samplePolylineDistance` | 10767 | function |  | 2 |
| `applyProjectedCurveLength` | 10777 | function |  | 4 |
| `clearRegionLengthBaseline` | 10808 | function |  | 2 |
| `ensureRegionLengthBaseline` | 10815 | function |  | 2 |
| `setGroupLengthScale` | 10823 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 10861 | function |  | 4 |
| `requestGroupDefaultsWarning` | 10893 | function |  | 1 |
| `activeProfileOffset` | 10905 | function |  | 3 |
| `profileToCanvas` | 10913 | function |  | 1 |
| `renderProfilePreview` | 10920 | function |  | 7 |
| `renderHairCardCoveragePath` | 10939 | function |  | 2 |
| `activeTaperTarget` | 10954 | function |  | 20 |
| `activeTaperCurve` | 11009 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 11020 | function |  | 7 |
| `taperSamples` | 11030 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 11037 | function |  | 2 |
| `renderTaperPreview` | 11059 | function |  | 17 |
| `shapeTargetForSelect` | 11098 | function |  | 3 |
| `setupShapePresetControls` | 11108 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 11133 | function |  | 3 |
| `syncShapePresetSelects` | 11139 | function |  | 6 |
| `populateShapePresetSelects` | 11160 | function |  | 5 |
| `openSaveShapePreset` | 11188 | function |  | 2 |
| `commitCustomShapePreset` | 11213 | function |  | 2 |
| `openRemoveShapePreset` | 11236 | function |  | 2 |
| `commitRemoveShapePreset` | 11249 | function |  | 2 |
| `taperPointToCanvas` | 11265 | function |  | 4 |
| `canvasToTaperPoint` | 11282 | function |  | 2 |
| `clearTaperMeshPoints` | 11318 | function |  | 2 |
| `taperMeshPointFrame` | 11328 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 11341 | function |  | 4 |
| `updateTaperMeshPoints` | 11378 | function |  | 5 |
| `setTaperMeshPointsVisible` | 11457 | function |  | 6 |
| `renderTaperCurveEditor` | 11475 | function |  | 13 |
| `tipSideForkFor` | 11488 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 11567 | function |  | 4 |
| `retargetOpenTaperCurveEditor` | 11581 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 11597 | function |  | 2 |
| `scheduleTaperCurveEdit` | 11629 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 11638 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 11649 | function |  | 2 |
| `applyTaperCurveEdit` | 11657 | function |  | 10 |
| `openTaperCurveEditor` | 11783 | function |  | 3 |
| `openPanelSegmentCurveEditor` | 11828 | function |  | 3 |
| `closeTaperCurveEditor` | 11864 | function |  | 4 |
| `updateViewportStatsVisibility` | 11877 | function |  | 5 |
| `canvasToProfile` | 11896 | function |  | 2 |
| `retargetFloatingStrandEditors` | 11910 | function |  | 2 |
| `addLock` | 11925 | function |  | 19 |
| `mirroredVector` | 12137 | function |  | 12 |
| `mirroredPlacementFrame` | 12141 | function |  | 2 |
| `mirrorPartnerFor` | 12154 | function |  | 40 |
| `decoupleMirrorPartner` | 12158 | function |  | 2 |
| `createMirrorPartner` | 12166 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 12262 | function |  | 6 |
| `mirroredClumpPartners` | 12267 | function |  | 6 |
| `createMirroredClump` | 12273 | function |  | 3 |
| `decoupleMirroredClump` | 12295 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 12315 | function |  | 6 |
| `syncActiveMirror` | 12482 | function |  | 31 |
| `setMirrorXEditing` | 12494 | function |  | 5 |
| `snapshotState` | 12518 | function |  | 7 |
| `rootAttachmentFrame` | 12779 | function |  | 3 |
| `rootAttachmentLocalFrame` | 12791 | function |  | 4 |
| `resolveRootAttachment` | 12809 | function |  | 4 |
| `curvePointsToRootLocal` | 12849 | function |  | 2 |
| `curvePointsFromRootLocal` | 12861 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 12869 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 12885 | function |  | 2 |
| `createRootAttachment` | 12916 | function |  | 7 |
| `syncRootAttachmentMetadata` | 12946 | function |  | 3 |
| `rootAttachmentToData` | 12973 | function |  | 2 |
| `rootAttachmentFromData` | 13001 | function |  | 3 |
| `importHeadMeshFile` | 13043 | function |  | 3 |
| `importFullBodyMeshFile` | 13066 | function |  | 3 |
| `downloadPreferencesAndPresets` | 13091 | function |  | 1 |
| `importedBooleanPreference` | 13124 | function |  | 11 |
| `loadPreferencesAndPresets` | 13138 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 13208 | function |  | 1 |
| `openHairProjectFile` | 13252 | function |  | 4 |
| `dragContainsApplicationFile` | 13310 | function |  | 3 |
| `safelyRememberRecentProject` | 13319 | function |  | 2 |
| `renderRecentProjectsMenu` | 13328 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 13360 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 13385 | function |  | 2 |
| `confirmDroppedApplicationFile` | 13389 | function |  | 2 |
| `pushUndoState` | 13405 | function |  | 108 |
| `undoLastAction` | 13412 | function |  | 2 |
| `redoLastAction` | 13429 | function |  | 2 |
| `updateHistoryButtons` | 13446 | function |  | 12 |
| `resetTransientInteractionsForStateRestore` | 13451 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 13471 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 13478 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 13517 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 13543 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 13575 | function |  | 2 |
| `finalizeStateRestore` | 13616 | function |  | 2 |
| `restoreState` | 13623 | function |  | 5 |
| `disposeAllEditableObjects` | 13647 | function |  | 2 |
| `restoreLock` | 13668 | function |  | 4 |
| `restoreGuide` | 13892 | function |  | 2 |
| `vectorToData` | 13953 | function |  | 28 |
| `dataToVector` | 13957 | function |  | 22 |
| `frameToData` | 13961 | function |  | 2 |
| `frameFromData` | 13973 | function |  | 2 |
| `applyPresetSelection` | 13985 | function |  | 2 |
| `drawPresetThumbnail` | 14016 | function |  | 1 |
| `fillHair` | 14031 | arrow |  | 9 |
| `strand` | 14043 | arrow |  | 31 |
| `bun` | 14061 | arrow |  | 2 |
| `braid` | 14096 | arrow |  | 2 |
| `renderPresetLibrary` | 14185 | function |  | 3 |
| `setPresetLibraryOpen` | 14244 | function |  | 6 |
| `average` | 14257 | function |  | 4 |
| `fitPointAttributes` | 14261 | function |  | 9 |
| `rebuildCurveObjects` | 14290 | function |  | 10 |
| `createCurvePoints` | 14302 | function |  | 2 |
| `addGeneratedBangPreset` | 14311 | function |  | 1 |
| `createLongLayeredCurlPoints` | 14405 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 14454 | function |  | 1 |
| `columns` | 14455 | arrow |  | 1 |
| `layer` | 14459 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 14673 | function |  | 2 |
| `addBraidedBobPreset` | 14709 | function |  | 1 |
| `evenColumns` | 14710 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 14926 | function |  | 1 |
| `scalpSeed` | 14949 | arrow |  | 1 |
| `createBowlCutPoints` | 15236 | function |  | 2 |
| `addBowlCutPreset` | 15274 | function |  | 1 |
| `selectedCurveLatticeGuide` | 15342 | function |  | 11 |
| `braidStrokeActive` | 15349 | function |  | 8 |
| `proceduralDrawActive` | 15353 | function |  | 3 |
| `panelStrokeActive` | 15357 | function |  | 5 |
| `activeStrokeSurfaceInput` | 15361 | function |  | 4 |
| `activeStrokeSurfaceValue` | 15365 | function |  | 22 |
| `normalizedLiveSurfaceSelection` | 15369 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 15375 | function |  | 10 |
| `drawSurfaceDynamicEnabled` | 15379 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 15383 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 15387 | function |  | 3 |
| `liveSurfaceStrandId` | 15397 | function |  | 4 |
| `liveSurfaceStrand` | 15401 | function |  | 3 |
| `liveSurfaceGuideId` | 15406 | function |  | 3 |
| `guideSupportsLiveSurface` | 15410 | function |  | 2 |
| `liveSurfaceGuide` | 15417 | function |  | 3 |
| `refreshLiveSurfaceOptions` | 15424 | function |  | 10 |
| `activeStrokeBrushSize` | 15465 | function |  | 10 |
| `activeStrokeBrushDepth` | 15471 | function |  | 5 |
| `strokeSurfaceIsContextual` | 15477 | function |  | 6 |
| `contextualPlaneAtOrigin` | 15485 | function |  | 8 |
| `drawSurfaceHitFromEvent` | 15495 | function |  | 12 |
| `worldNormalAtHit` | 15534 | function |  | 6 |
| `selectedPolyMesh` | 15542 | function |  | 10 |
| `addPolyLock` | 15547 | function |  | 2 |
| `ensurePolyMesh` | 15566 | function |  | 3 |
| `polySurfaceSample` | 15570 | function |  | 4 |
| `polyTargetAtEvent` | 15581 | function |  | 6 |
| `refreshPolyMesh` | 15607 | function |  | 10 |
| `ensurePolyFillPreview` | 15616 | function |  | 2 |
| `clearPolyFillPreview` | 15653 | function |  | 17 |
| `polyFillCandidateForEvent` | 15658 | function |  | 3 |
| `showPolyFillPreview` | 15678 | function |  | 2 |
| `updatePolyFillPreview` | 15704 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 15729 | function |  | 5 |
| `fillPolyGap` | 15739 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 15750 | function |  | 2 |
| `projectPolyRelaxPoint` | 15770 | function |  | 2 |
| `removePolyPointAttributes` | 15814 | function |  | 3 |
| `deletePolyComponent` | 15823 | function |  | 2 |
| `addPolyPoint` | 15846 | function |  | 4 |
| `appendPolyStrokeRow` | 15855 | function |  | 4 |
| `beginPolyBrushPointer` | 15875 | function |  | 1 |
| `finishPolyAltDelete` | 15961 | function |  | 1 |
| `updatePolyBrushStroke` | 15975 | function |  | 1 |
| `finishPolyBrushStroke` | 16065 | function |  | 4 |
| `drawSampleFromHit` | 16103 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 16117 | function |  | 3 |
| `strokeLength` | 16154 | function |  | 9 |
| `resampleDrawStroke` | 16160 | function |  | 2 |
| `processedDrawStroke` | 16192 | function |  | 8 |
| `strokeSurfaceNormals` | 16221 | function |  | 7 |
| `drawClumpFrame` | 16232 | function |  | 4 |
| `nearestCurveParameter` | 16241 | function |  | 2 |
| `drawClumpSampleNormal` | 16255 | function |  | 6 |
| `drawClumpTemplateVector` | 16264 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 16270 | function |  | 3 |
| `drawClumpStrandMaps` | 16286 | function |  | 4 |
| `nextClumpName` | 16341 | function |  | 6 |
| `initializeClumpShape` | 16348 | function |  | 5 |
| `stableClumpVariation` | 16359 | function |  | 3 |
| `createClumpFromLocks` | 16371 | function |  | 7 |
| `addLockToClump` | 16396 | function |  | 4 |
| `pointerToNdc` | 16452 | function |  | 1 |
| `gridProfileSkipCol` | 16468 | function |  | 3 |
| `clumpDirectMembers` | 16492 | function |  | 3 |
| `clumpMembersForGuide` | 16497 | function |  | 6 |
| `clumpGuideForLock` | 16501 | function |  | 13 |
| `proceduralGuideForLock` | 16506 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 16513 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 16520 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 16527 | function |  | 3 |
| `proceduralBranchWorldPoints` | 16539 | function |  | 2 |
| `applyProceduralBranchSettings` | 16552 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 16591 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 16607 | function |  | 3 |
| `createProceduralAccessoryLock` | 16621 | function |  | 2 |
| `applyProceduralAccessorySettings` | 16673 | function |  | 2 |
| `clumpFrameAt` | 16724 | function |  | 5 |
| `commitClumpMemberRestState` | 16732 | function |  | 10 |
| `updateClumpMembers` | 16815 | function |  | 10 |
| `dissolveClump` | 16919 | function |  | 6 |
| `detachLockFromClump` | 16956 | function |  | 4 |
| `updateDrawVolumePreview` | 16982 | function |  | 5 |
| `hideDrawClumpPreviews` | 17006 | function |  | 5 |
| `resetDrawVolumePreview` | 17012 | function |  | 3 |
| `updateDrawStrandPreview` | 17018 | function |  | 23 |
| `continueFromTipEnabled` | 17239 | function |  | 2 |
| `selectedTipContinuationLock` | 17245 | function |  | 3 |
| `beginDrawStrandStroke` | 17260 | function |  | 2 |
| `beginDrawFreePlane` | 17389 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 17403 | function |  | 2 |
| `updateDrawStrandStroke` | 17428 | function |  | 1 |
| `createDrawnLock` | 17474 | function |  | 3 |
| `setting` | 17478 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 17546 | function |  | 4 |
| `createDrawnBraid` | 17554 | function |  | 2 |
| `createDrawnStrand` | 17611 | function |  | 2 |
| `createDrawnPanel` | 17738 | function |  | 2 |
| `surfaceLatticeNormal` | 17790 | function |  | 2 |
| `createSurfaceLockFromLattice` | 17805 | function |  | 3 |
| `createViewportSurface` | 17870 | function |  | 2 |
| `loftSurfaceProfilePoints` | 17899 | function |  | 5 |
| `hideLoftSurfacePreviews` | 17905 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 17912 | function |  | 4 |
| `updateLoftSurfacePreview` | 17921 | function |  | 5 |
| `resetLoftSurfaceDraft` | 17953 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 17969 | function |  | 3 |
| `cloneCurveSurfaceSource` | 17987 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 18009 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 18035 | function |  | 3 |
| `curveSurfaceProfilePoints` | 18045 | function |  | 3 |
| `curveSurfaceProfileNormals` | 18049 | function |  | 2 |
| `curveSurfacePreviewLock` | 18058 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 18081 | function |  | 2 |
| `hideCurveSurfacePreview` | 18097 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 18109 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 18114 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 18123 | function |  | 3 |
| `curveSurfaceSideVector` | 18161 | function |  | 4 |
| `curveSurfaceDraftCurves` | 18174 | function |  | 2 |
| `curveSurfaceFallbackHit` | 18182 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 18195 | function |  | 5 |
| `updateCurveSurfacePreview` | 18215 | function |  | 6 |
| `resetCurveSurfaceDraft` | 18277 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 18299 | function |  | 3 |
| `beginCurveSurfaceStroke` | 18314 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 18362 | function |  | 3 |
| `updateCurveSurfaceStroke` | 18397 | function |  | 1 |
| `finishCurveSurfaceStroke` | 18429 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 18487 | function |  | 2 |
| `commitCurveSurfaceDraft` | 18564 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 18569 | function |  | 6 |
| `beginLoftSurfaceStroke` | 18578 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 18612 | function |  | 2 |
| `updateLoftSurfaceStroke` | 18623 | function |  | 1 |
| `finishLoftSurfaceStroke` | 18653 | function |  | 2 |
| `extendDrawnStrand` | 18710 | function |  | 2 |
| `finishDrawStrandStroke` | 18743 | function |  | 7 |
| `createPlacedStrand` | 18770 | function |  | 2 |
| `placedPointCount` | 18834 | function |  | 3 |
| `createPlacedPoints` | 18838 | function |  | 3 |
| `pushPointOutsideHead` | 18857 | function |  | 8 |
| `resizePlacedStrand` | 18889 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 18906 | function |  | 5 |
| `beginPlaceEdit` | 18911 | function |  | 2 |
| `updatePlaceEdit` | 18929 | function |  | 1 |
| `updatePlacementLength` | 18943 | function |  | 3 |
| `updatePlacementOrientation` | 18953 | function |  | 3 |
| `endPlaceEdit` | 18971 | function |  | 1 |
| `confirmPendingPlacedStrand` | 18986 | function |  | 1 |
| `pendingPlacedLock` | 18996 | function |  | 2 |
| `beginPlacementPointer` | 19000 | function |  | 3 |
| `finishPlacementPointer` | 19010 | function |  | 2 |
| `confirmPlacementStep` | 19034 | function |  | 2 |
| `finishPlacementFlow` | 19057 | function |  | 7 |
| `updatePlacementStatus` | 19070 | function |  | 67 |
| `deselectStrands` | 19209 | function |  | 11 |
| `beginSelectionMarquee` | 19224 | function |  | 3 |
| `beginAltOrbit` | 19248 | function |  | 1 |
| `beginBlenderNavigation` | 19260 | function |  | 1 |
| `endBlenderNavigation` | 19305 | function |  | 1 |
| `prepareSelectPointerCapture` | 19313 | function |  | 1 |
| `endSelectPointerCapture` | 19319 | function |  | 1 |
| `applyAltClickCandidate` | 19325 | function |  | 2 |
| `finishBrushAltClick` | 19351 | function |  | 1 |
| `endAltOrbit` | 19364 | function |  | 2 |
| `dollyCameraByDrag` | 19371 | function |  | 2 |
| `fastDragMagnitude` | 19394 | function |  | 2 |
| `beginHoudiniZoomDrag` | 19400 | function |  | 1 |
| `updateHoudiniZoomDrag` | 19408 | function |  | 1 |
| `endHoudiniZoomDrag` | 19425 | function |  | 1 |
| `updateSelectionMarquee` | 19433 | function |  | 1 |
| `pointInsideSelectionMarquee` | 19450 | function |  | 3 |
| `selectPointsInMarquee` | 19458 | function |  | 2 |
| `pointKey` | 19484 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 19515 | function |  | 2 |
| `objectInsideSelectionMarquee` | 19552 | function |  | 3 |
| `projectedPoint` | 19569 | arrow |  | 1 |
| `selectObjectsInMarquee` | 19598 | function |  | 2 |
| `finishSelectionMarquee` | 19643 | function |  | 2 |
| `headMeshes` | 19666 | function |  | 7 |
| `strandSplitProfileData` | 19674 | function |  | 4 |
| `strandSplitControlPoint` | 19687 | function |  | 4 |
| `panelSplitControlPoint` | 19723 | function |  | 8 |
| `strandControlPointRaycast` | 19780 | function |  | 1 |
| `strandControlPointFrame` | 19815 | function |  | 4 |
| `strandControlPointHitFromEvent` | 19847 | function |  | 4 |
| `createCurveObjects` | 19905 | function |  | 4 |
| `polyEdgeKey` | 20167 | function |  | 2 |
| `polyMeshEdges` | 20171 | function |  | 2 |
| `populatePolyEditObjects` | 20185 | function |  | 3 |
| `createPolyEditObjects` | 20249 | function |  | 2 |
| `rebuildPolyEditObjects` | 20257 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 20271 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 20278 | function |  | 2 |
| `strandWidthEdgeSample` | 20287 | function |  | 3 |
| `strandWidthEdgePoints` | 20310 | function |  | 2 |
| `sculptBrushDebugRaycast` | 20324 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 20328 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 20335 | function |  | 3 |
| `refreshSculptBrushDebugView` | 20347 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 20352 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 20358 | function |  | 3 |
| `updateCurveObjects` | 20372 | function |  | 42 |
| `syncTipNormalArrow` | 20614 | arrow |  | 4 |
| `createCurveNormalIndicator` | 20827 | function |  | 3 |
| `pointUpDirection` | 20853 | function |  | 2 |
| `curveFrameAtPoint` | 20857 | function |  | 4 |
| `curveFrameAt` | 20878 | function |  | 4 |
| `strandTwistAt` | 20898 | function |  | 6 |
| `controlPointRotationAt` | 20903 | function |  | 4 |
| `strandProfileTwistAt` | 20907 | function |  | 2 |
| `strandFrameAt` | 20913 | function |  | 2 |
| `curveFrameAtSnapshot` | 20919 | function |  | 3 |
| `outwardNormalAtPoint` | 20938 | function |  | 12 |
| `sampledSurfaceNormal` | 20950 | function |  | 2 |
| `guidedNormalAt` | 20966 | function |  | 6 |
| `twistFromHandle` | 20985 | function |  | 3 |
| `signedAngleAroundAxis` | 21006 | function |  | 6 |
| `handleColor` | 21013 | function |  | 2 |
| `isAffectedCurvePoint` | 21036 | function |  | 2 |
| `syncLockFromCurve` | 21042 | function |  | 24 |
| `labelForPreset` | 21072 | function |  | 1 |
| `rebuildLockGeometry` | 21076 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 21103 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 21111 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 21117 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 21139 | function |  | 8 |
| `updateLockGeometry` | 21152 | function |  | 62 |
| `setGroupColorView` | 21173 | function |  | 2 |
| `createUvCheckerTexture` | 21183 | function |  | 3 |
| `ensureUvCheckerForLock` | 21219 | function |  | 4 |
| `removeUvCheckerFromLock` | 21252 | function |  | 3 |
| `invalidateUvInspector` | 21267 | function |  | 7 |
| `uvInspectorRecord` | 21271 | function |  | 1 |
| `uvInspectorRecords` | 21310 | function |  | 2 |
| `drawUvInspectorGrid` | 21314 | function |  | 2 |
| `renderUvInspector` | 21348 | function |  | 3 |
| `setUvCheckerEnabled` | 21407 | function |  | 3 |
| `strandViewportBaseColor` | 21424 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 21459 | function |  | 3 |
| `syncStrandSelectionOutline` | 21465 | function |  | 2 |
| `applyLockedStrandPalette` | 21476 | function |  | 2 |
| `syncLockedStrandWireVisual` | 21485 | function |  | 6 |
| `setStrandSelectionVisual` | 21494 | function |  | 5 |
| `proceduralParentOutlineVisible` | 21510 | function |  | 2 |
| `syncProceduralParentVisibility` | 21517 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 21526 | function |  | 2 |
| `updateStrandSelectionHighlight` | 21530 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 21534 | function |  | 2 |
| `resetGuideSelectionVisuals` | 21547 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 21567 | function |  | 3 |
| `selectLock` | 21600 | function |  | 47 |
| `deselectStrandsForGuideEditor` | 21662 | function |  | 2 |
| `syncGroupInputs` | 21673 | function |  | 2 |
| `topologyStatsForLock` | 21706 | function |  | 4 |
| `formatTopologyStats` | 21714 | function |  | 5 |
| `updateTopologyStats` | 21718 | function |  | 25 |
| `normalizeBraidDimensions` | 21752 | function |  | 3 |
| `normalizeStrandDimensions` | 21765 | function |  | 3 |
| `strandBaseWidth` | 21779 | function |  | 5 |
| `strandWidthDimension` | 21783 | function |  | 5 |
| `strandDepthDimension` | 21791 | function |  | 8 |
| `setStrandWidthDimension` | 21799 | function |  | 2 |
| `setStrandDepthDimension` | 21821 | function |  | 4 |
| `syncShapeDimensionInputs` | 21837 | function |  | 4 |
| `syncCreationShapeInputs` | 21873 | function |  | 3 |
| `syncViewportDrawSettings` | 21911 | function |  | 4 |
| `selectedPanelSegment` | 21925 | function |  | 6 |
| `syncPanelSegmentControls` | 21931 | function |  | 11 |
| `syncPanelShapeInputs` | 21949 | function |  | 6 |
| `syncStrandSplitInputs` | 21976 | function |  | 4 |
| `syncHairCardControls` | 21985 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 21993 | function |  | 3 |
| `updateAttributeEditorMode` | 22032 | function |  | 13 |
| `pinActiveToolSettingsPanel` | 22182 | function |  | 2 |
| `curveLatticeForGroup` | 22205 | function |  | 2 |
| `filterCurveLatticesToGroup` | 22223 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 22268 | function |  | 2 |
| `showCurveLatticeForGroup` | 22285 | function |  | 2 |
| `selectStrandGroup` | 22322 | function |  | 3 |
| `selectCurvePoint` | 22364 | function |  | 10 |
| `updateSelectedPointLabel` | 22378 | function |  | 12 |
| `syncInputs` | 22391 | function |  | 15 |
| `syncClumpGuidePanel` | 22437 | function |  | 3 |
| `getSelectedLock` | 22464 | function |  | 109 |
| `selectedLocksInOrder` | 22468 | function |  | 37 |
| `lockStrands` | 22474 | function |  | 3 |
| `lockSelectedStrands` | 22507 | function |  | 3 |
| `unlockStrands` | 22513 | function |  | 3 |
| `unlockAllStrands` | 22528 | function |  | 3 |
| `strandEditFamily` | 22532 | function |  | 7 |
| `compatibleSelectedLocks` | 22537 | function |  | 5 |
| `selectedEditRoots` | 22544 | function |  | 2 |
| `editSelectedLocks` | 22557 | function |  | 19 |
| `multiEditValuesEqual` | 22590 | function |  | 2 |
| `setMixedControl` | 22599 | function |  | 28 |
| `syncMultiStrandInputs` | 22616 | function |  | 16 |
| `values` | 22632 | arrow |  | 38 |
| `selectedRebuildableCurves` | 22712 | function |  | 5 |
| `createCompoundStrand` | 22719 | function |  | 1 |
| `refreshRebuildCurveDialog` | 22780 | function |  | 8 |
| `openRebuildCurveDialog` | 22793 | function |  | 1 |
| `rebuildSelectedCurves` | 22807 | function |  | 2 |
| `selectionCanBecomeClump` | 22846 | function |  | 4 |
| `createClumpFromSelection` | 22851 | function |  | 3 |
| `cleanSelectionSets` | 22863 | function |  | 2 |
| `createSelectionSetFromSelection` | 22868 | function |  | 3 |
| `selectionSetById` | 22879 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 22883 | function |  | 7 |
| `editSelectionSetFromSelection` | 22892 | function |  | 5 |
| `deleteSelectionSet` | 22912 | function |  | 2 |
| `selectSelectionSet` | 22921 | function |  | 2 |
| `deleteSelectedStrands` | 22931 | function |  | 4 |
| `deleteGuide` | 22939 | function |  | 3 |
| `deleteSelectedGuide` | 22962 | function |  | 3 |
| `deleteSelectedReferenceImage` | 22966 | function |  | 4 |
| `hasDeletableSelection` | 22979 | function |  | 2 |
| `deleteCurrentSelection` | 22987 | function |  | 3 |
| `hideOutlinerContextMenu` | 22995 | function |  | 17 |
| `outlinerLockTargets` | 23000 | function |  | 3 |
| `showOutlinerContextMenu` | 23027 | function |  | 8 |
| `hideStrandRadialMenu` | 23107 | function |  | 4 |
| `ensureRadialButtonCapacity` | 23118 | function |  | 3 |
| `radialButtonDimensions` | 23131 | function |  | 4 |
| `radialMenuDimensionsForKind` | 23140 | function |  | 3 |
| `applyRadialMenuDimensions` | 23157 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 23163 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 23176 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 23197 | function |  | 2 |
| `selectionSetRadialMenuOption` | 23214 | function |  | 4 |
| `selectedMirrorRadialOptions` | 23223 | function |  | 3 |
| `strandVisibilityRadialOptions` | 23245 | function |  | 5 |
| `clumpMirrorRadialOptions` | 23263 | function |  | 2 |
| `contextualRadialOptions` | 23270 | function |  | 3 |
| `sharedRadialFrameDimensions` | 23399 | function |  | 3 |
| `layoutContextualRadialOptions` | 23403 | function |  | 4 |
| `renderRadialActionList` | 23427 | function |  | 3 |
| `radialListOptionAtPointer` | 23445 | function |  | 3 |
| `syncRadialListHighlight` | 23467 | function |  | 3 |
| `configureContextualRadialMenu` | 23473 | function |  | 3 |
| `beginStrandRadialGesture` | 23533 | function |  | 2 |
| `enterStrandRadialSubmenu` | 23567 | function |  | 2 |
| `updateStrandRadialGesture` | 23613 | function |  | 1 |
| `performStrandRadialAction` | 23652 | function |  | 2 |
| `finishStrandRadialGesture` | 23755 | function |  | 2 |
| `cancelStrandRadialGesture` | 23765 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 23772 | function |  | 1 |
| `setPullMoveEnabled` | 23778 | function |  | 3 |
| `toolRadialOptions` | 23786 | function |  | 2 |
| `hideToolRadialMenu` | 23811 | function |  | 4 |
| `beginToolRadialGesture` | 23824 | function |  | 2 |
| `beginToolShortcutPress` | 23864 | function |  | 2 |
| `finishToolShortcutPress` | 23879 | function |  | 2 |
| `cancelToolShortcutPress` | 23888 | function |  | 5 |
| `setRadialMenusEnabled` | 23896 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 23909 | function |  | 5 |
| `setNavigationTipsEnabled` | 23924 | function |  | 5 |
| `configureNavigationMouseButtons` | 23931 | function |  | 3 |
| `syncNavigationModifierLocks` | 23944 | function |  | 7 |
| `setNavigationStyle` | 23949 | function |  | 5 |
| `applyCameraSmoothingPreference` | 23965 | function |  | 4 |
| `setCameraSmoothingEnabled` | 23980 | function |  | 5 |
| `setCameraSmoothingStrength` | 23986 | function |  | 5 |
| `setScaleSensitivity` | 23994 | function |  | 3 |
| `setToolTipsEnabled` | 24002 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 24009 | function |  | 5 |
| `setViewportStatisticsEnabled` | 24018 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 24026 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 24041 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 24050 | function |  | 5 |
| `sideNamingDisplayId` | 24059 | function |  | 3 |
| `referenceViewDisplayLabel` | 24071 | function |  | 6 |
| `strandRegionDisplayLabel` | 24081 | function |  | 8 |
| `updateSideNamingLabels` | 24099 | function |  | 2 |
| `setSideNamingPerspective` | 24126 | function |  | 5 |
| `setControlPointDisplaySize` | 24135 | function |  | 6 |
| `scaleHexColor` | 24147 | function |  | 3 |
| `setViewportBackgroundColor` | 24152 | function |  | 7 |
| `setDefaultHairShader` | 24174 | function |  | 5 |
| `setPreferenceCategory` | 24180 | function |  | 4 |
| `openPreferencesDialog` | 24207 | function |  | 1 |
| `savePreferencesDialog` | 24235 | function |  | 1 |
| `cancelPreferencesDialog` | 24259 | function |  | 3 |
| `updateToolRadialGesture` | 24288 | function |  | 1 |
| `performToolRadialAction` | 24317 | function |  | 2 |
| `finishToolRadialGesture` | 24327 | function |  | 2 |
| `cancelToolRadialGesture` | 24336 | function |  | 5 |
| `duplicatePlacementTarget` | 24343 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 24370 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 24374 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 24384 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 24389 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 24401 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 24412 | function |  | 7 |
| `openProceduralDuplicateDialog` | 24420 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 24437 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 24458 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 24469 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 24475 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 24481 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 24514 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 24669 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 24771 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 24812 | function |  | 2 |
| `updateDuplicatePlacement` | 24839 | function |  | 2 |
| `beginDuplicatePlacement` | 24903 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 24967 | function |  | 2 |
| `confirmDuplicatePlacement` | 25008 | function |  | 1 |
| `cancelDuplicatePlacement` | 25045 | function |  | 4 |
| `outlinerClumpLocks` | 25071 | function |  | 11 |
| `handleOutlinerClumpDrop` | 25075 | function |  | 3 |
| `createOutlinerStrandButton` | 25098 | function |  | 4 |
| `createOutlinerCurveSurface` | 25184 | function |  | 2 |
| `createOutlinerClump` | 25280 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 25362 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 25369 | function |  | 2 |
| `renderLockList` | 25448 | function |  | 66 |
| `updateCount` | 25602 | function |  | 30 |
| `captureInputUndo` | 25611 | function |  | 1 |
| `bindUndoCapture` | 25617 | function |  | 37 |
| `bindLockInput` | 25628 | function |  | 2 |
| `applyValue` | 25645 | arrow |  | 2 |
| `applyUniformTransformScale` | 25964 | function |  | 2 |
| `applyReducedTransformScale` | 25981 | function |  | 2 |
| `applyTransformPrecision` | 26020 | function |  | 2 |
| `updateTransformScalePointer` | 26049 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 26370 | function |  | 3 |
| `finishTaperCurveDrag` | 26434 | function |  | 1 |
| `beginTaperMeshPointDrag` | 26477 | function |  | 1 |
| `updateTaperMeshPointDrag` | 26558 | function |  | 1 |
| `finishTaperMeshPointDrag` | 26613 | function |  | 6 |
| `updateSelectedTaperPoint` | 26637 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 27238 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 27243 | function |  | 4 |
| `syncDrawCurlControls` | 27298 | function |  | 5 |
| `handleLiveSurfaceChange` | 27346 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 27428 | function |  | 3 |
| `resampleSurfaceLock` | 27443 | function |  | 2 |
| `changePanelSplitCount` | 27556 | function |  | 3 |
| `applyPresetControl` | 27706 | function |  | 2 |
| `applyCreationToolSettings` | 27727 | function |  | 2 |
| `populateCreationPresetSelect` | 27771 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 27795 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 27828 | function |  | 5 |
| `createCustomCreationPreset` | 27836 | function |  | 3 |
| `createCustomClumpPreset` | 27851 | function |  | 3 |
| `commitCustomCreationPreset` | 27866 | function |  | 2 |
| `openRemoveCreationPreset` | 27927 | function |  | 3 |
| `commitRemoveCreationPreset` | 27940 | function |  | 1 |
| `applyBraidToolPreset` | 27957 | function |  | 2 |
| `selectedBranchChildLock` | 28069 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 28073 | function |  | 2 |
| `initPanelResizeHandles` | 28179 | function |  | 2 |
| `applyWidth` | 28185 | arrow |  | 2 |
| `restoreWidth` | 28192 | arrow |  | 2 |
| `bindResize` | 28200 | arrow |  | 2 |
| `onMove` | 28209 | arrow |  | 0 |
| `onUp` | 28213 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 28230 | function |  | 2 |
| `initFloatingPanelControls` | 28239 | function |  | 2 |
| `detach` | 28248 | arrow |  | 28 |
| `endDrag` | 28286 | arrow |  | 0 |
| `endResize` | 28318 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 28329 | function |  | 3 |
| `selectPatchNotesVersion` | 28463 | function |  | 3 |
| `requestReferenceImage` | 28496 | function |  | 5 |
| `toggleCapsuleGuideTool` | 28700 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 28706 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 28713 | function |  | 1 |
| `deleteLocks` | 29280 | function |  | 10 |
| `disposeCurveObjects` | 29358 | function |  | 4 |
| `beginTipSubBoneRotate` | 29444 | function |  | 2 |
| `applyTipSubBoneTransform` | 29474 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 29506 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 29631 | function |  | 1 |
| `endPanelSplitHandleDrag` | 29852 | function |  | 3 |
| `resize` | 29885 | function |  | 3 |
| `handleViewportPointerMove` | 29896 | function |  | 1 |
| `blockProportionalSizingEvent` | 29907 | function |  | 1 |
| `updateLightAngleFromInputs` | 29913 | function |  | 2 |
| `startViewSnap` | 29927 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 29957 | function |  | 3 |
| `trackViewportPointerDown` | 29974 | function |  | 1 |
| `trackViewportPointerMove` | 29990 | function |  | 1 |
| `clearViewportPointer` | 29998 | function |  | 1 |
| `updateViewSnap` | 30003 | function |  | 1 |
| `nearestCardinalAxis` | 30039 | function |  | 5 |
| `cardinalAxisKey` | 30053 | function |  | 5 |
| `steppedDragAmount` | 30057 | function |  | 3 |
| `snapCameraToCardinalAxis` | 30063 | function |  | 4 |
| `endViewSnap` | 30079 | function |  | 4 |
| `activateStrandControlPoint` | 30089 | function |  | 4 |
| `refreshStrandControlPointSelection` | 30139 | function |  | 4 |
| `addStrandControlPointSelection` | 30166 | function |  | 3 |
| `removeStrandControlPointSelection` | 30183 | function |  | 3 |
| `sampleStrandPointNormal` | 30197 | function |  | 2 |
| `sampleStrandPointVectors` | 30207 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 30213 | function |  | 2 |
| `resampleStrandCurveData` | 30224 | function |  | 4 |
| `resampleMatchingVectors` | 30230 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 30269 | function |  | 4 |
| `removeStrandCurvePoint` | 30280 | function |  | 2 |
| `closestStrandCurveParameter` | 30293 | function |  | 2 |
| `insertStrandCurvePoint` | 30322 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 30339 | function |  | 2 |
| `selectionModifierCursorAvailable` | 30349 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 30365 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 30372 | function |  | 4 |
| `prepareCurvePointSelection` | 30394 | function |  | 1 |
| `finishCurvePointInsertion` | 30505 | function |  | 1 |
| `finishPointRemoval` | 30520 | function |  | 1 |
| `editableStrandWidth` | 30538 | function |  | 6 |
| `editableStrandWidthBounds` | 30550 | function |  | 2 |
| `applyEditableStrandWidth` | 30556 | function |  | 3 |
| `viewportPixelPoint` | 30592 | function |  | 5 |
| `syncSculptBrushControls` | 30600 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 30615 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 30623 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 30631 | function |  | 1 |
| `sculptBrushPlaneOffset` | 30637 | function |  | 5 |
| `setSculptBrushCursorVisible` | 30641 | function |  | 6 |
| `updateSculptBrushCursor` | 30648 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 30670 | function |  | 4 |
| `sculptBrushEditableLock` | 30677 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 30687 | function |  | 5 |
| `sculptBrushLockViable` | 30693 | function |  | 5 |
| `sculptBrushUnits` | 30704 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 30742 | function |  | 4 |
| `sculptBrushPointWeight` | 30792 | function |  | 6 |
| `sculptBrushWorldDelta` | 30802 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 30811 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 30837 | function |  | 2 |
| `beginSculptMoveStroke` | 30895 | function |  | 1 |
| `isHairCreateTool` | 30957 | function |  | 4 |
| `syncStrandHoverOutline` | 30961 | function |  | 1 |
| `pointerOverTaperEditor` | 30974 | function |  | 3 |
| `updateStrandBrushHover` | 30981 | function |  | 1 |
| `updatePanelTipHover` | 31002 | function |  | 1 |
| `applySubBoneBrushSample` | 31032 | function |  | 2 |
| `applySculptMoveStrokeSample` | 31177 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 31415 | function |  | 3 |
| `updateSculptMoveStroke` | 31424 | function |  | 1 |
| `finishSculptMoveStroke` | 31440 | function |  | 3 |
| `strandControlPointHit` | 31488 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 31492 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 31570 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 31604 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 31644 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 31657 | function |  | 1 |
| `setHoveredControlPoint` | 31696 | function |  | 7 |
| `visibleControlPointHoverTargets` | 31709 | function |  | 2 |
| `updateControlPointHover` | 31745 | function |  | 1 |
| `animate` | 32360 | function |  | 2 |
| `syncCompactSidebarLayout` | 32391 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 32410 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 32416 | function |  | 3 |
| `setAttributeEditorTab` | 32422 | function |  | 6 |

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
