# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1810** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（27478 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 275 | function |  | 3 |
| `saveBooleanPreference` | 303 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 307 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 312 | function |  | 2 |
| `normalizeScaleSensitivity` | 317 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 322 | function |  | 2 |
| `normalizeSideNamingPerspective` | 327 | function |  | 2 |
| `normalizeNavigationStyle` | 331 | function |  | 2 |
| `setupEditableSliderControls` | 346 | function |  | 2 |
| `syncNumberFromRange` | 397 | arrow |  | 0 |
| `applyNumberValue` | 404 | arrow |  | 0 |
| `copyCameraPose` | 510 | function |  | 3 |
| `updateCameraProjectionForViewport` | 516 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 529 | function |  | 3 |
| `setOrthographicView` | 535 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 575 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 604 | function |  | 2 |
| `removeRotateFreeAxisRing` | 630 | function |  | 2 |
| `deflateTransformGizmoPickers` | 642 | function |  | 2 |
| `nextStrandName` | 1037 | function |  | 2 |
| `activeDrawClumpTemplate` | 1122 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1127 | function |  | 3 |
| `drawModeCreatesClump` | 1154 | function |  | 1 |
| `isPanelGeometry` | 1298 | function |  | 46 |
| `normalizePanelSplits` | 1302 | function |  | 2 |
| `clonePanelSplits` | 1314 | function |  | 30 |
| `snapPanelSplitHeight` | 1318 | function |  | 5 |
| `createQuadSphereGeometry` | 1353 | function |  | 2 |
| `vertexIndex` | 1367 | function |  | 5 |
| `addEdge` | 1385 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1566 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1746 | function |  | 2 |
| `currentStrandSelectionState` | 1808 | function |  | 4 |
| `applyStrandSelectionState` | 1812 | function |  | 5 |
| `clearStrandSelectionState` | 1817 | function |  | 6 |
| `disposeGuideModel` | 2920 | function |  | 3 |
| `syncHeadTransformInputs` | 2931 | function |  | 3 |
| `applyHeadTransform` | 2938 | function |  | 4 |
| `resetHeadTransform` | 2958 | function |  | 2 |
| `installGuideModel` | 2973 | function |  | 5 |
| `loadDefaultGuideModel` | 3049 | function |  | 3 |
| `braidTemplateFromEntries` | 3072 | function |  | 4 |
| `braidMeshEntries` | 3104 | function |  | 2 |
| `prepareBraidBodyCache` | 3116 | function |  | 2 |
| `quantize` | 3125 | arrow |  | 21 |
| `sourceNormalAt` | 3137 | arrow |  | 1 |
| `clusterBoundary` | 3140 | arrow |  | 2 |
| `normalBuckets` | 3157 | arrow |  | 2 |
| `applyBucketPair` | 3189 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3220 | function |  | 2 |
| `annotateBraidObjTopology` | 3241 | function |  | 2 |
| `loadBraidMeshPreset` | 3261 | function |  | 3 |
| `createSplitControlHandle` | 3278 | function |  | 6 |
| `frameGuideModel` | 3293 | function |  | 2 |
| `normalizeHairLayer` | 3322 | function |  | 26 |
| `layerOffsetForLock` | 3326 | function |  | 8 |
| `layerRootOffsetFactor` | 3331 | function |  | 12 |
| `layerOffsetWeight` | 3335 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3341 | function |  | 5 |
| `pointsWithLayerOffset` | 3350 | function |  | 3 |
| `layerDirectionForLock` | 3358 | function |  | 2 |
| `applyLayerOffset` | 3369 | function |  | 5 |
| `setLockHairLayer` | 3393 | function |  | 2 |
| `setGroupLayerOffset` | 3408 | function |  | 2 |
| `quadraticWeights` | 3436 | function |  | 1 |
| `setHeadReferenceTransparency` | 3447 | function |  | 4 |
| `trianglePlaneIntersections` | 3459 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3480 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3689 | function |  | 1 |
| `upperContourCurve` | 3706 | function |  | 2 |
| `hermitePoint` | 3741 | function |  | 2 |
| `curveNetworkSection` | 3752 | function |  | 1 |
| `pointAlongSection` | 3781 | function |  | 1 |
| `longestStitchedContour` | 3787 | function |  | 2 |
| `nodeForPoint` | 3795 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3852 | function |  | 1 |
| `exitSetupEditors` | 3872 | function |  | 6 |
| `syncAppMenuVisibility` | 3882 | function |  | 3 |
| `closeAppMenus` | 3888 | function |  | 6 |
| `setAppMenuOpen` | 3899 | function |  | 2 |
| `setTurntableActive` | 3906 | function |  | 3 |
| `selectedReferenceImage` | 3916 | function |  | 20 |
| `normalizeReferenceCrop` | 3922 | function |  | 8 |
| `referenceCropIsFull` | 3930 | function |  | 3 |
| `referencePlaneFrontAxis` | 3935 | function |  | 4 |
| `referencePlanePlacement` | 3944 | function |  | 4 |
| `migratedReferencePlanePosition` | 3959 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3979 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3996 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 4012 | function |  | 2 |
| `snappedReferenceImageView` | 4035 | function |  | 2 |
| `updateReferencePlaneVisibility` | 4041 | function |  | 5 |
| `applyReferenceImageRuntime` | 4057 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 4100 | function |  | 6 |
| `createReferenceImageRuntime` | 4108 | function |  | 3 |
| `addReferenceImage` | 4177 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4229 | function |  | 3 |
| `disposeReferenceImage` | 4248 | function |  | 2 |
| `clearReferenceImages` | 4252 | function |  | 2 |
| `serializeReferenceImage` | 4259 | function |  | 1 |
| `setReferenceImageType` | 4287 | function |  | 2 |
| `attachReferenceImageTransform` | 4331 | function |  | 6 |
| `selectReferenceImage` | 4345 | function |  | 12 |
| `placeReferencePlane` | 4368 | function |  | 2 |
| `setReferencePlaneInFront` | 4379 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4389 | function |  | 4 |
| `renderReferenceImagePanel` | 4408 | function |  | 20 |
| `setOutlinerTab` | 4455 | function |  | 8 |
| `effectiveViewportSelectionMode` | 4473 | function |  | 4 |
| `componentEditModeActive` | 4477 | function |  | 30 |
| `selectionToolSupportsPicking` | 4481 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4486 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4502 | function |  | 2 |
| `setViewportSelectionMode` | 4532 | function |  | 4 |
| `setViewportEditMode` | 4544 | function |  | 13 |
| `createOutlinerVisibilityToggle` | 4586 | function |  | 8 |
| `setLocksOutlinerVisibility` | 4600 | function |  | 8 |
| `normalizeOutlinerName` | 4614 | function |  | 3 |
| `beginOutlinerRename` | 4619 | function |  | 2 |
| `finish` | 4630 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4660 | function |  | 6 |
| `referenceOutlinerGroup` | 4672 | function |  | 2 |
| `renderReferenceOutliner` | 4676 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4793 | function |  | 5 |
| `readReferenceImageFile` | 4798 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4822 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4829 | function |  | 3 |
| `dragContainsReferenceImage` | 4874 | function |  | 3 |
| `setReferenceImageDragActive` | 4885 | function |  | 9 |
| `referenceDropDestination` | 4893 | function |  | 2 |
| `viewportOverlayDropPosition` | 4899 | function |  | 2 |
| `setReferenceDropHover` | 4908 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4926 | function |  | 2 |
| `referenceOverlayAtPointer` | 4946 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4964 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4977 | function |  | 2 |
| `updateReferenceOverlayDrag` | 5023 | function |  | 1 |
| `finishReferenceOverlayDrag` | 5073 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5095 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5106 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5132 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5141 | function |  | 2 |
| `referenceCropCursor` | 5156 | function |  | 3 |
| `updateReferenceCropHandles` | 5162 | function |  | 5 |
| `referenceCropSourcePoint` | 5183 | function |  | 2 |
| `beginReferenceCrop` | 5190 | function |  | 1 |
| `updateReferenceCrop` | 5228 | function |  | 1 |
| `finishReferenceCrop` | 5260 | function |  | 4 |
| `setHeadSetupEditing` | 5278 | function |  | 6 |
| `strandPassesDisplayFilters` | 5304 | function |  | 4 |
| `strandVisibleForDisplay` | 5313 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 5318 | function |  | 3 |
| `lockedStrandsExist` | 5322 | function |  | 3 |
| `hiddenStrandsExist` | 5326 | function |  | 2 |
| `hideSelectedStrands` | 5330 | function |  | 2 |
| `unhideHiddenStrands` | 5340 | function |  | 2 |
| `strandIsolationActive` | 5349 | function |  | 7 |
| `setStrandIsolation` | 5353 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5365 | function |  | 3 |
| `syncVisibilityParent` | 5376 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5383 | function |  | 8 |
| `applyCharacterMeshDisplayVisibility` | 5412 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5419 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 5442 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5660 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5681 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5700 | function |  | 2 |
| `selectedViewportFocusBounds` | 5798 | function |  | 2 |
| `frameViewportBounds` | 5812 | function |  | 6 |
| `centerViewportOnSelectedItem` | 5842 | function |  | 2 |
| `fullSceneFocusBounds` | 5846 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5861 | function |  | 3 |
| `cycleViewportFraming` | 5870 | function |  | 2 |
| `sculptBrushToolActive` | 5890 | function |  | 23 |
| `sculptBrushSelectionMaskActive` | 5894 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5898 | function |  | 2 |
| `effectiveSculptBrushTool` | 5902 | function |  | 6 |
| `updateSculptScaleModeRow` | 5908 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5913 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5935 | function |  | 5 |
| `setActiveTool` | 5944 | function |  | 12 |
| `setDrawStrandMode` | 6082 | function |  | 2 |
| `setObjectSpaceEditing` | 6092 | function |  | 7 |
| `setHierarchyEditing` | 6108 | function |  | 4 |
| `setProportionalEditing` | 6120 | function |  | 5 |
| `beginProportionalSizeEdit` | 6139 | function |  | 3 |
| `updateProportionalSizeEdit` | 6151 | function |  | 2 |
| `endProportionalSizeEdit` | 6162 | function |  | 5 |
| `activateProportionalHotkeyHold` | 6169 | function |  | 2 |
| `refreshProportionalPreview` | 6177 | function |  | 4 |
| `activeBrushSizeInput` | 6187 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 6196 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 6208 | function |  | 2 |
| `beginBrushSizeDrag` | 6226 | function |  | 1 |
| `updateBrushSizeDrag` | 6253 | function |  | 1 |
| `finishBrushSizeDrag` | 6274 | function |  | 2 |
| `updateInteractionLocks` | 6291 | function |  | 62 |
| `configureTransformControls` | 6302 | function |  | 13 |
| `pullMoveActive` | 6310 | function |  | 9 |
| `updatePullGuideVisual` | 6314 | function |  | 4 |
| `attachTransformForCurvePoint` | 6330 | function |  | 5 |
| `pointerHitsTransformGizmo` | 6354 | function |  | 6 |
| `strandObjectRootIndex` | 6370 | function |  | 3 |
| `strandObjectRoot` | 6379 | function |  | 4 |
| `strandObjectTransformQuaternion` | 6383 | function |  | 2 |
| `attachStrandObjectTransform` | 6388 | function |  | 6 |
| `guideObjectPivot` | 6411 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6422 | function |  | 2 |
| `attachGuideObjectTransform` | 6427 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6446 | function |  | 2 |
| `beginGuideObjectTransform` | 6474 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6481 | function |  | 2 |
| `updateGuideObjectTransform` | 6503 | function |  | 2 |
| `finishGuideObjectTransform` | 6536 | function |  | 2 |
| `clonePlacementFrame` | 6545 | function |  | 2 |
| `cloneOptionalVectors` | 6557 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6561 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6578 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6593 | function |  | 2 |
| `strandObjectTransformOperators` | 6609 | function |  | 4 |
| `transformPoint` | 6617 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6624 | arrow |  | 0 |
| `transformNormal` | 6630 | arrow |  | 10 |
| `transformDirection` | 6640 | arrow |  | 5 |
| `worldMatrixForPivot` | 6652 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6658 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6674 | function |  | 6 |
| `beginStrandObjectTransform` | 6700 | function |  | 2 |
| `updateStrandObjectTransform` | 6738 | function |  | 2 |
| `commitStrandObjectTransform` | 6796 | function |  | 2 |
| `mapPoints` | 6809 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6843 | function |  | 2 |
| `surfaceObjectAnchorPose` | 6857 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6880 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6893 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6908 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6934 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6983 | function |  | 2 |
| `beginHandleEdit` | 6992 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 7045 | function |  | 3 |
| `multiPointHandleEditActive` | 7056 | function |  | 7 |
| `applyMultiMove` | 7060 | function |  | 5 |
| `applyMultiRotate` | 7066 | function |  | 2 |
| `applyMultiScale` | 7075 | function |  | 2 |
| `applyHierarchicalMove` | 7084 | function |  | 3 |
| `applySingleMove` | 7096 | function |  | 5 |
| `applySurfaceLatticeMirror` | 7100 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 7117 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 7126 | function |  | 3 |
| `changed` | 7136 | arrow |  | 1 |
| `applyPullMove` | 7178 | function |  | 3 |
| `pullHeadCollisionContext` | 7186 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 7205 | function |  | 2 |
| `applyProportionalMove` | 7228 | function |  | 3 |
| `viewPlaneNormal` | 7239 | function |  | 12 |
| `isCameraInSnappedView` | 7243 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 7251 | function |  | 9 |
| `updateViewPlaneGrid` | 7255 | function |  | 14 |
| `setViewPlaneMove` | 7312 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 7323 | function |  | 2 |
| `rayFromViewportEvent` | 7331 | function |  | 11 |
| `worldUnitsPerViewportPixel` | 7339 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7349 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7360 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7373 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7392 | function |  | 4 |
| `beginViewPlaneMove` | 7399 | function |  | 3 |
| `updateViewPlaneMove` | 7463 | function |  | 1 |
| `endViewPlaneMove` | 7528 | function |  | 7 |
| `applyHierarchicalRotate` | 7547 | function |  | 2 |
| `rotateGuideNormal` | 7554 | arrow |  | 4 |
| `applySingleRotate` | 7592 | function |  | 2 |
| `applyProportionalRotate` | 7596 | function |  | 2 |
| `applyHierarchicalScale` | 7616 | function |  | 2 |
| `applySingleScale` | 7626 | function |  | 2 |
| `applyProportionalScale` | 7630 | function |  | 2 |
| `setPointScale` | 7646 | function |  | 7 |
| `proportionalWeight` | 7655 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7667 | function |  | 5 |
| `strandInfluenceColor` | 7673 | function |  | 4 |
| `beginRelaxEdit` | 7698 | function |  | 3 |
| `updateRelaxEdit` | 7727 | function |  | 1 |
| `endRelaxEdit` | 7787 | function |  | 1 |
| `disposeGuide` | 7797 | function |  | 3 |
| `removeGuideObjects` | 7825 | function |  | 3 |
| `strandRadiusAt` | 7839 | function |  | 5 |
| `strandProfileTopologyAt` | 7856 | function |  | 2 |
| `strandCurveParameters` | 7898 | function |  | 1 |
| `widthProfileAt` | 7908 | arrow |  | 1 |
| `braidFrameAt` | 7946 | function |  | 4 |
| `braidFrameAtExtended` | 7956 | function |  | 2 |
| `createBraidProfileProjector` | 7965 | function |  | 2 |
| `project` | 7981 | arrow |  | 18 |
| `createBraidGeometry` | 7996 | function |  | 1 |
| `deformationAt` | 8031 | function |  | 3 |
| `widthFor` | 8040 | arrow |  | 3 |
| `depthFor` | 8044 | arrow |  | 3 |
| `outputVertex` | 8076 | function |  | 7 |
| `appendAuthoredCap` | 8184 | function |  | 3 |
| `outputCapVertex` | 8191 | arrow |  | 6 |
| `capBoundary` | 8282 | function |  | 3 |
| `strandGeometryCurve` | 8344 | function |  | 8 |
| `strandGeometryFrameAt` | 8370 | function |  | 6 |
| `transportedStrandFrameAt` | 8433 | function |  | 5 |
| `twistOverrideAt` | 8436 | arrow |  | 2 |
| `hairMaterialDefinition` | 8506 | function |  | 4 |
| `materialForLock` | 8510 | function |  | 8 |
| `activeHairMaterialDefinition` | 8514 | function |  | 11 |
| `strandDisplayColor` | 8520 | function |  | 14 |
| `setAnimeHairBaseColor` | 8538 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 8551 | function |  | 2 |
| `createHairMaterial` | 8591 | function |  | 5 |
| `createStrandSelectionOutline` | 8633 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 8668 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 8677 | function |  | 6 |
| `refreshMaterialUsers` | 8704 | function |  | 6 |
| `renderHairMaterialOutliner` | 8713 | function |  | 5 |
| `renderHairMaterialOptions` | 8743 | function |  | 3 |
| `syncHairMaterialEditor` | 8753 | function |  | 9 |
| `createProjectHairMaterial` | 8779 | function |  | 3 |
| `deleteActiveHairMaterial` | 8799 | function |  | 2 |
| `createHairTopologyGeometry` | 8817 | function |  | 4 |
| `createHairTopologyOverlay` | 8838 | function |  | 3 |
| `groupDefaultsFor` | 8885 | function |  | 9 |
| `creationToolActive` | 8892 | function |  | 5 |
| `activeCreationShapeDefaults` | 8896 | function |  | 7 |
| `curvePolylineLength` | 8903 | function |  | 2 |
| `curvePolylineLengths` | 8911 | function |  | 3 |
| `samplePolylineDistance` | 8919 | function |  | 2 |
| `applyProjectedCurveLength` | 8929 | function |  | 4 |
| `clearRegionLengthBaseline` | 8960 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8967 | function |  | 2 |
| `setGroupLengthScale` | 8975 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 9013 | function |  | 3 |
| `requestGroupDefaultsWarning` | 9045 | function |  | 1 |
| `activeProfileOffset` | 9057 | function |  | 3 |
| `profileToCanvas` | 9065 | function |  | 1 |
| `renderProfilePreview` | 9072 | function |  | 7 |
| `renderHairCardCoveragePath` | 9091 | function |  | 2 |
| `setupShapePresetControls` | 9230 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 9255 | function |  | 3 |
| `syncShapePresetSelects` | 9261 | function |  | 5 |
| `populateShapePresetSelects` | 9282 | function |  | 5 |
| `openSaveShapePreset` | 9310 | function |  | 2 |
| `commitCustomShapePreset` | 9335 | function |  | 2 |
| `openRemoveShapePreset` | 9358 | function |  | 2 |
| `commitRemoveShapePreset` | 9371 | function |  | 2 |
| `openPanelSegmentCurveEditor` | 9407 | function |  | 3 |
| `updateViewportStatsVisibility` | 9444 | function |  | 3 |
| `canvasToProfile` | 9463 | function |  | 2 |
| `addLock` | 9478 | function |  | 16 |
| `mirroredVector` | 9690 | function |  | 12 |
| `mirroredPlacementFrame` | 9694 | function |  | 2 |
| `mirrorPartnerFor` | 9707 | function |  | 36 |
| `decoupleMirrorPartner` | 9711 | function |  | 2 |
| `createMirrorPartner` | 9719 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 9815 | function |  | 6 |
| `mirroredClumpPartners` | 9820 | function |  | 6 |
| `createMirroredClump` | 9826 | function |  | 3 |
| `decoupleMirroredClump` | 9848 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 9868 | function |  | 6 |
| `syncActiveMirror` | 10035 | function |  | 29 |
| `setMirrorXEditing` | 10047 | function |  | 5 |
| `snapshotState` | 10071 | function |  | 7 |
| `rootAttachmentFrame` | 10332 | function |  | 3 |
| `rootAttachmentLocalFrame` | 10344 | function |  | 4 |
| `resolveRootAttachment` | 10362 | function |  | 4 |
| `curvePointsToRootLocal` | 10402 | function |  | 2 |
| `curvePointsFromRootLocal` | 10414 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 10422 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 10438 | function |  | 2 |
| `createRootAttachment` | 10469 | function |  | 7 |
| `syncRootAttachmentMetadata` | 10499 | function |  | 3 |
| `rootAttachmentToData` | 10526 | function |  | 2 |
| `rootAttachmentFromData` | 10554 | function |  | 3 |
| `importHeadMeshFile` | 10596 | function |  | 3 |
| `importFullBodyMeshFile` | 10619 | function |  | 3 |
| `downloadPreferencesAndPresets` | 10644 | function |  | 1 |
| `importedBooleanPreference` | 10677 | function |  | 11 |
| `loadPreferencesAndPresets` | 10691 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 10761 | function |  | 1 |
| `openHairProjectFile` | 10805 | function |  | 4 |
| `dragContainsApplicationFile` | 10863 | function |  | 3 |
| `safelyRememberRecentProject` | 10872 | function |  | 2 |
| `renderRecentProjectsMenu` | 10881 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 10913 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 10938 | function |  | 2 |
| `confirmDroppedApplicationFile` | 10942 | function |  | 2 |
| `pushUndoState` | 10958 | function |  | 91 |
| `undoLastAction` | 10965 | function |  | 2 |
| `redoLastAction` | 10982 | function |  | 2 |
| `updateHistoryButtons` | 10999 | function |  | 9 |
| `resetTransientInteractionsForStateRestore` | 11004 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 11024 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 11031 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 11070 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 11096 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 11128 | function |  | 2 |
| `finalizeStateRestore` | 11169 | function |  | 2 |
| `restoreState` | 11176 | function |  | 5 |
| `disposeAllEditableObjects` | 11200 | function |  | 2 |
| `restoreLock` | 11221 | function |  | 4 |
| `restoreGuide` | 11445 | function |  | 2 |
| `vectorToData` | 11506 | function |  | 25 |
| `dataToVector` | 11510 | function |  | 22 |
| `frameToData` | 11514 | function |  | 2 |
| `frameFromData` | 11526 | function |  | 2 |
| `applyPresetSelection` | 11538 | function |  | 2 |
| `drawPresetThumbnail` | 11569 | function |  | 1 |
| `fillHair` | 11584 | arrow |  | 9 |
| `strand` | 11596 | arrow |  | 31 |
| `bun` | 11614 | arrow |  | 2 |
| `braid` | 11649 | arrow |  | 2 |
| `renderPresetLibrary` | 11738 | function |  | 3 |
| `setPresetLibraryOpen` | 11797 | function |  | 6 |
| `average` | 11810 | function |  | 3 |
| `fitPointAttributes` | 11814 | function |  | 7 |
| `rebuildCurveObjects` | 11843 | function |  | 9 |
| `createCurvePoints` | 11855 | function |  | 2 |
| `addGeneratedBangPreset` | 11864 | function |  | 1 |
| `createLongLayeredCurlPoints` | 11958 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 12007 | function |  | 1 |
| `columns` | 12008 | arrow |  | 1 |
| `layer` | 12012 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 12226 | function |  | 2 |
| `addBraidedBobPreset` | 12262 | function |  | 1 |
| `evenColumns` | 12263 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 12479 | function |  | 1 |
| `scalpSeed` | 12502 | arrow |  | 1 |
| `createBowlCutPoints` | 12789 | function |  | 2 |
| `addBowlCutPreset` | 12827 | function |  | 1 |
| `selectedCurveLatticeGuide` | 12895 | function |  | 10 |
| `braidStrokeActive` | 12902 | function |  | 8 |
| `proceduralDrawActive` | 12906 | function |  | 3 |
| `panelStrokeActive` | 12910 | function |  | 5 |
| `activeStrokeSurfaceInput` | 12914 | function |  | 4 |
| `activeStrokeSurfaceValue` | 12918 | function |  | 17 |
| `normalizedLiveSurfaceSelection` | 12922 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 12928 | function |  | 7 |
| `drawSurfaceDynamicEnabled` | 12932 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 12936 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 12940 | function |  | 3 |
| `liveSurfaceStrandId` | 12950 | function |  | 4 |
| `liveSurfaceStrand` | 12954 | function |  | 2 |
| `liveSurfaceGuideId` | 12959 | function |  | 3 |
| `guideSupportsLiveSurface` | 12963 | function |  | 2 |
| `liveSurfaceGuide` | 12970 | function |  | 2 |
| `refreshLiveSurfaceOptions` | 12977 | function |  | 10 |
| `activeStrokeBrushSize` | 13018 | function |  | 10 |
| `activeStrokeBrushDepth` | 13024 | function |  | 5 |
| `strokeSurfaceIsContextual` | 13030 | function |  | 3 |
| `contextualPlaneAtOrigin` | 13038 | function |  | 3 |
| `drawSurfaceHitFromEvent` | 13048 | function |  | 7 |
| `worldNormalAtHit` | 13087 | function |  | 4 |
| `drawSampleFromHit` | 13096 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 13110 | function |  | 3 |
| `strokeLength` | 13147 | function |  | 8 |
| `resampleDrawStroke` | 13153 | function |  | 2 |
| `processedDrawStroke` | 13185 | function |  | 6 |
| `strokeSurfaceNormals` | 13214 | function |  | 6 |
| `drawClumpFrame` | 13225 | function |  | 4 |
| `nearestCurveParameter` | 13234 | function |  | 2 |
| `drawClumpSampleNormal` | 13248 | function |  | 5 |
| `drawClumpTemplateVector` | 13257 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 13263 | function |  | 3 |
| `drawClumpStrandMaps` | 13279 | function |  | 4 |
| `nextClumpName` | 13334 | function |  | 6 |
| `initializeClumpShape` | 13341 | function |  | 5 |
| `stableClumpVariation` | 13352 | function |  | 3 |
| `createClumpFromLocks` | 13364 | function |  | 7 |
| `addLockToClump` | 13389 | function |  | 4 |
| `pointerToNdc` | 13445 | function |  | 1 |
| `gridProfileSkipCol` | 13461 | function |  | 1 |
| `clumpDirectMembers` | 13485 | function |  | 3 |
| `clumpMembersForGuide` | 13490 | function |  | 6 |
| `clumpGuideForLock` | 13494 | function |  | 13 |
| `proceduralGuideForLock` | 13499 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 13506 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 13513 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 13520 | function |  | 2 |
| `proceduralBranchWorldPoints` | 13532 | function |  | 1 |
| `applyProceduralBranchSettings` | 13545 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 13584 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 13600 | function |  | 3 |
| `createProceduralAccessoryLock` | 13614 | function |  | 2 |
| `applyProceduralAccessorySettings` | 13666 | function |  | 2 |
| `clumpFrameAt` | 13717 | function |  | 5 |
| `commitClumpMemberRestState` | 13725 | function |  | 9 |
| `updateClumpMembers` | 13808 | function |  | 10 |
| `dissolveClump` | 13912 | function |  | 6 |
| `detachLockFromClump` | 13949 | function |  | 4 |
| `updateDrawVolumePreview` | 13975 | function |  | 5 |
| `hideDrawClumpPreviews` | 13999 | function |  | 5 |
| `resetDrawVolumePreview` | 14005 | function |  | 3 |
| `updateDrawStrandPreview` | 14011 | function |  | 22 |
| `continueFromTipEnabled` | 14232 | function |  | 2 |
| `selectedTipContinuationLock` | 14238 | function |  | 3 |
| `beginDrawStrandStroke` | 14253 | function |  | 2 |
| `beginDrawFreePlane` | 14382 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 14396 | function |  | 2 |
| `updateDrawStrandStroke` | 14421 | function |  | 1 |
| `createDrawnLock` | 14467 | function |  | 3 |
| `setting` | 14471 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 14539 | function |  | 4 |
| `createDrawnBraid` | 14547 | function |  | 2 |
| `createDrawnStrand` | 14604 | function |  | 2 |
| `createDrawnPanel` | 14731 | function |  | 2 |
| `extendDrawnStrand` | 14783 | function |  | 2 |
| `finishDrawStrandStroke` | 14816 | function |  | 6 |
| `createPlacedStrand` | 14843 | function |  | 2 |
| `placedPointCount` | 14907 | function |  | 3 |
| `createPlacedPoints` | 14911 | function |  | 3 |
| `pushPointOutsideHead` | 14930 | function |  | 8 |
| `resizePlacedStrand` | 14962 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 14979 | function |  | 5 |
| `beginPlaceEdit` | 14984 | function |  | 2 |
| `updatePlaceEdit` | 15002 | function |  | 1 |
| `updatePlacementLength` | 15016 | function |  | 3 |
| `updatePlacementOrientation` | 15026 | function |  | 3 |
| `endPlaceEdit` | 15044 | function |  | 1 |
| `confirmPendingPlacedStrand` | 15059 | function |  | 1 |
| `pendingPlacedLock` | 15069 | function |  | 2 |
| `beginPlacementPointer` | 15073 | function |  | 3 |
| `finishPlacementPointer` | 15083 | function |  | 2 |
| `confirmPlacementStep` | 15107 | function |  | 2 |
| `finishPlacementFlow` | 15130 | function |  | 6 |
| `updatePlacementStatus` | 15143 | function |  | 53 |
| `deselectStrands` | 15282 | function |  | 11 |
| `beginSelectionMarquee` | 15297 | function |  | 3 |
| `beginAltOrbit` | 15321 | function |  | 1 |
| `beginBlenderNavigation` | 15333 | function |  | 1 |
| `endBlenderNavigation` | 15378 | function |  | 1 |
| `prepareSelectPointerCapture` | 15386 | function |  | 1 |
| `endSelectPointerCapture` | 15392 | function |  | 1 |
| `applyAltClickCandidate` | 15398 | function |  | 2 |
| `finishBrushAltClick` | 15424 | function |  | 1 |
| `endAltOrbit` | 15437 | function |  | 2 |
| `dollyCameraByDrag` | 15444 | function |  | 2 |
| `fastDragMagnitude` | 15467 | function |  | 2 |
| `beginHoudiniZoomDrag` | 15473 | function |  | 1 |
| `updateHoudiniZoomDrag` | 15481 | function |  | 1 |
| `endHoudiniZoomDrag` | 15498 | function |  | 1 |
| `updateSelectionMarquee` | 15506 | function |  | 1 |
| `pointInsideSelectionMarquee` | 15523 | function |  | 3 |
| `selectPointsInMarquee` | 15531 | function |  | 2 |
| `pointKey` | 15557 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 15588 | function |  | 2 |
| `objectInsideSelectionMarquee` | 15625 | function |  | 3 |
| `projectedPoint` | 15642 | arrow |  | 1 |
| `selectObjectsInMarquee` | 15671 | function |  | 2 |
| `finishSelectionMarquee` | 15716 | function |  | 2 |
| `headMeshes` | 15739 | function |  | 6 |
| `strandSplitProfileData` | 15747 | function |  | 4 |
| `strandSplitControlPoint` | 15760 | function |  | 4 |
| `panelSplitControlPoint` | 15796 | function |  | 8 |
| `panelWidthAt` | 15813 | arrow |  | 3 |
| `panelThicknessAt` | 15820 | arrow |  | 3 |
| `strandControlPointRaycast` | 15853 | function |  | 1 |
| `strandControlPointFrame` | 15888 | function |  | 4 |
| `strandControlPointHitFromEvent` | 15920 | function |  | 4 |
| `createCurveObjects` | 15978 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 16240 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 16247 | function |  | 2 |
| `strandWidthEdgeSample` | 16256 | function |  | 3 |
| `strandWidthEdgePoints` | 16279 | function |  | 2 |
| `sculptBrushDebugRaycast` | 16293 | arrow |  | 0 |
| `updateCurveObjects` | 16295 | function |  | 37 |
| `syncTipNormalArrow` | 16537 | arrow |  | 4 |
| `createCurveNormalIndicator` | 16750 | function |  | 3 |
| `pointUpDirection` | 16776 | function |  | 2 |
| `curveFrameAtPoint` | 16780 | function |  | 4 |
| `curveFrameAt` | 16801 | function |  | 3 |
| `strandTwistAt` | 16821 | function |  | 6 |
| `controlPointRotationAt` | 16826 | function |  | 3 |
| `strandProfileTwistAt` | 16830 | function |  | 2 |
| `strandFrameAt` | 16836 | function |  | 2 |
| `curveFrameAtSnapshot` | 16842 | function |  | 3 |
| `outwardNormalAtPoint` | 16861 | function |  | 8 |
| `sampledSurfaceNormal` | 16908 | function |  | 2 |
| `guidedNormalAt` | 16924 | function |  | 5 |
| `twistFromHandle` | 16943 | function |  | 3 |
| `signedAngleAroundAxis` | 16964 | function |  | 5 |
| `handleColor` | 16971 | function |  | 2 |
| `isAffectedCurvePoint` | 16994 | function |  | 2 |
| `syncLockFromCurve` | 17000 | function |  | 20 |
| `labelForPreset` | 17030 | function |  | 1 |
| `rebuildLockGeometry` | 17034 | function |  | 8 |
| `flushPendingLockGeometryUpdates` | 17062 | function |  | 7 |
| `updateLockGeometry` | 17075 | function |  | 55 |
| `setGroupColorView` | 17096 | function |  | 2 |
| `createUvCheckerTexture` | 17106 | function |  | 3 |
| `ensureUvCheckerForLock` | 17142 | function |  | 4 |
| `removeUvCheckerFromLock` | 17175 | function |  | 3 |
| `invalidateUvInspector` | 17190 | function |  | 7 |
| `uvInspectorRecord` | 17194 | function |  | 1 |
| `uvInspectorRecords` | 17233 | function |  | 2 |
| `drawUvInspectorGrid` | 17237 | function |  | 2 |
| `renderUvInspector` | 17271 | function |  | 3 |
| `setUvCheckerEnabled` | 17330 | function |  | 3 |
| `strandViewportBaseColor` | 17347 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 17382 | function |  | 3 |
| `syncStrandSelectionOutline` | 17388 | function |  | 2 |
| `applyLockedStrandPalette` | 17399 | function |  | 2 |
| `syncLockedStrandWireVisual` | 17408 | function |  | 6 |
| `setStrandSelectionVisual` | 17417 | function |  | 5 |
| `proceduralParentOutlineVisible` | 17433 | function |  | 2 |
| `syncProceduralParentVisibility` | 17440 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 17449 | function |  | 2 |
| `updateStrandSelectionHighlight` | 17453 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 17457 | function |  | 2 |
| `resetGuideSelectionVisuals` | 17470 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 17490 | function |  | 3 |
| `selectLock` | 17523 | function |  | 43 |
| `deselectStrandsForGuideEditor` | 17585 | function |  | 2 |
| `syncGroupInputs` | 17596 | function |  | 2 |
| `topologyStatsForLock` | 17629 | function |  | 4 |
| `formatTopologyStats` | 17637 | function |  | 5 |
| `updateTopologyStats` | 17641 | function |  | 22 |
| `normalizeBraidDimensions` | 17675 | function |  | 3 |
| `normalizeStrandDimensions` | 17688 | function |  | 3 |
| `strandBaseWidth` | 17702 | function |  | 5 |
| `strandWidthDimension` | 17706 | function |  | 5 |
| `strandDepthDimension` | 17714 | function |  | 8 |
| `setStrandWidthDimension` | 17722 | function |  | 2 |
| `setStrandDepthDimension` | 17744 | function |  | 4 |
| `syncShapeDimensionInputs` | 17760 | function |  | 4 |
| `syncCreationShapeInputs` | 17796 | function |  | 3 |
| `syncViewportDrawSettings` | 17834 | function |  | 4 |
| `selectedPanelSegment` | 17848 | function |  | 6 |
| `syncPanelSegmentControls` | 17854 | function |  | 11 |
| `syncPanelShapeInputs` | 17872 | function |  | 6 |
| `syncStrandSplitInputs` | 17899 | function |  | 4 |
| `syncHairCardControls` | 17908 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 17916 | function |  | 3 |
| `updateAttributeEditorMode` | 17955 | function |  | 12 |
| `pinActiveToolSettingsPanel` | 18105 | function |  | 2 |
| `curveLatticeForGroup` | 18128 | function |  | 2 |
| `filterCurveLatticesToGroup` | 18146 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 18191 | function |  | 2 |
| `showCurveLatticeForGroup` | 18208 | function |  | 2 |
| `selectStrandGroup` | 18245 | function |  | 3 |
| `selectCurvePoint` | 18287 | function |  | 10 |
| `updateSelectedPointLabel` | 18301 | function |  | 12 |
| `syncInputs` | 18314 | function |  | 14 |
| `syncClumpGuidePanel` | 18360 | function |  | 3 |
| `getSelectedLock` | 18387 | function |  | 103 |
| `selectedLocksInOrder` | 18391 | function |  | 37 |
| `lockStrands` | 18397 | function |  | 3 |
| `lockSelectedStrands` | 18430 | function |  | 3 |
| `unlockStrands` | 18436 | function |  | 3 |
| `unlockAllStrands` | 18451 | function |  | 3 |
| `strandEditFamily` | 18455 | function |  | 7 |
| `compatibleSelectedLocks` | 18460 | function |  | 4 |
| `selectedEditRoots` | 18467 | function |  | 2 |
| `editSelectedLocks` | 18480 | function |  | 16 |
| `multiEditValuesEqual` | 18513 | function |  | 2 |
| `setMixedControl` | 18522 | function |  | 28 |
| `syncMultiStrandInputs` | 18539 | function |  | 16 |
| `values` | 18555 | arrow |  | 36 |
| `selectedRebuildableCurves` | 18635 | function |  | 5 |
| `createCompoundStrand` | 18642 | function |  | 1 |
| `refreshRebuildCurveDialog` | 18703 | function |  | 8 |
| `openRebuildCurveDialog` | 18716 | function |  | 1 |
| `rebuildSelectedCurves` | 18730 | function |  | 2 |
| `selectionCanBecomeClump` | 18769 | function |  | 4 |
| `createClumpFromSelection` | 18774 | function |  | 3 |
| `cleanSelectionSets` | 18786 | function |  | 2 |
| `createSelectionSetFromSelection` | 18791 | function |  | 3 |
| `selectionSetById` | 18802 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 18806 | function |  | 7 |
| `editSelectionSetFromSelection` | 18815 | function |  | 5 |
| `deleteSelectionSet` | 18835 | function |  | 2 |
| `selectSelectionSet` | 18844 | function |  | 2 |
| `deleteSelectedStrands` | 18854 | function |  | 4 |
| `deleteGuide` | 18862 | function |  | 3 |
| `deleteSelectedGuide` | 18885 | function |  | 3 |
| `deleteSelectedReferenceImage` | 18889 | function |  | 4 |
| `hasDeletableSelection` | 18902 | function |  | 2 |
| `deleteCurrentSelection` | 18910 | function |  | 3 |
| `hideOutlinerContextMenu` | 18918 | function |  | 17 |
| `outlinerLockTargets` | 18923 | function |  | 3 |
| `showOutlinerContextMenu` | 18950 | function |  | 8 |
| `hideStrandRadialMenu` | 19030 | function |  | 4 |
| `ensureRadialButtonCapacity` | 19041 | function |  | 3 |
| `radialButtonDimensions` | 19054 | function |  | 4 |
| `radialMenuDimensionsForKind` | 19063 | function |  | 3 |
| `applyRadialMenuDimensions` | 19080 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 19086 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 19099 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 19120 | function |  | 2 |
| `selectionSetRadialMenuOption` | 19137 | function |  | 4 |
| `selectedMirrorRadialOptions` | 19146 | function |  | 3 |
| `strandVisibilityRadialOptions` | 19168 | function |  | 5 |
| `clumpMirrorRadialOptions` | 19186 | function |  | 2 |
| `contextualRadialOptions` | 19193 | function |  | 3 |
| `sharedRadialFrameDimensions` | 19322 | function |  | 3 |
| `layoutContextualRadialOptions` | 19326 | function |  | 4 |
| `renderRadialActionList` | 19350 | function |  | 3 |
| `radialListOptionAtPointer` | 19368 | function |  | 3 |
| `syncRadialListHighlight` | 19390 | function |  | 3 |
| `configureContextualRadialMenu` | 19396 | function |  | 3 |
| `beginStrandRadialGesture` | 19456 | function |  | 2 |
| `enterStrandRadialSubmenu` | 19490 | function |  | 2 |
| `updateStrandRadialGesture` | 19536 | function |  | 1 |
| `performStrandRadialAction` | 19575 | function |  | 2 |
| `finishStrandRadialGesture` | 19678 | function |  | 2 |
| `cancelStrandRadialGesture` | 19688 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 19695 | function |  | 1 |
| `setPullMoveEnabled` | 19701 | function |  | 3 |
| `toolRadialOptions` | 19709 | function |  | 2 |
| `hideToolRadialMenu` | 19734 | function |  | 4 |
| `beginToolRadialGesture` | 19747 | function |  | 2 |
| `beginToolShortcutPress` | 19787 | function |  | 2 |
| `finishToolShortcutPress` | 19802 | function |  | 2 |
| `cancelToolShortcutPress` | 19811 | function |  | 5 |
| `setRadialMenusEnabled` | 19819 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 19832 | function |  | 5 |
| `setNavigationTipsEnabled` | 19847 | function |  | 5 |
| `configureNavigationMouseButtons` | 19854 | function |  | 3 |
| `syncNavigationModifierLocks` | 19867 | function |  | 7 |
| `setNavigationStyle` | 19872 | function |  | 5 |
| `applyCameraSmoothingPreference` | 19888 | function |  | 4 |
| `setCameraSmoothingEnabled` | 19903 | function |  | 5 |
| `setCameraSmoothingStrength` | 19909 | function |  | 5 |
| `setScaleSensitivity` | 19917 | function |  | 3 |
| `setToolTipsEnabled` | 19925 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 19932 | function |  | 5 |
| `setViewportStatisticsEnabled` | 19941 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 19949 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 19964 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 19973 | function |  | 5 |
| `sideNamingDisplayId` | 19982 | function |  | 3 |
| `referenceViewDisplayLabel` | 19994 | function |  | 6 |
| `strandRegionDisplayLabel` | 20004 | function |  | 7 |
| `updateSideNamingLabels` | 20022 | function |  | 2 |
| `setSideNamingPerspective` | 20049 | function |  | 5 |
| `setControlPointDisplaySize` | 20058 | function |  | 6 |
| `scaleHexColor` | 20070 | function |  | 3 |
| `setViewportBackgroundColor` | 20075 | function |  | 7 |
| `setDefaultHairShader` | 20097 | function |  | 5 |
| `setPreferenceCategory` | 20103 | function |  | 4 |
| `openPreferencesDialog` | 20130 | function |  | 1 |
| `savePreferencesDialog` | 20158 | function |  | 1 |
| `cancelPreferencesDialog` | 20182 | function |  | 3 |
| `updateToolRadialGesture` | 20211 | function |  | 1 |
| `performToolRadialAction` | 20240 | function |  | 2 |
| `finishToolRadialGesture` | 20250 | function |  | 2 |
| `cancelToolRadialGesture` | 20259 | function |  | 5 |
| `duplicatePlacementTarget` | 20266 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 20293 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 20297 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 20307 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 20312 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 20324 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 20335 | function |  | 7 |
| `openProceduralDuplicateDialog` | 20343 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 20360 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 20381 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 20392 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 20398 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 20404 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 20437 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 20592 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 20694 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 20735 | function |  | 2 |
| `updateDuplicatePlacement` | 20762 | function |  | 2 |
| `beginDuplicatePlacement` | 20826 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 20890 | function |  | 2 |
| `confirmDuplicatePlacement` | 20931 | function |  | 1 |
| `cancelDuplicatePlacement` | 20968 | function |  | 4 |
| `outlinerClumpLocks` | 20994 | function |  | 11 |
| `handleOutlinerClumpDrop` | 20998 | function |  | 3 |
| `createOutlinerStrandButton` | 21021 | function |  | 4 |
| `createOutlinerCurveSurface` | 21107 | function |  | 2 |
| `createOutlinerClump` | 21203 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 21285 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 21292 | function |  | 2 |
| `renderLockList` | 21371 | function |  | 61 |
| `updateCount` | 21525 | function |  | 26 |
| `captureInputUndo` | 21534 | function |  | 1 |
| `bindUndoCapture` | 21540 | function |  | 37 |
| `bindLockInput` | 21551 | function |  | 2 |
| `applyValue` | 21568 | arrow |  | 2 |
| `applyUniformTransformScale` | 21887 | function |  | 2 |
| `applyReducedTransformScale` | 21904 | function |  | 2 |
| `applyTransformPrecision` | 21943 | function |  | 2 |
| `updateTransformScalePointer` | 21972 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 22974 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 22979 | function |  | 4 |
| `syncDrawCurlControls` | 23034 | function |  | 5 |
| `handleLiveSurfaceChange` | 23082 | function |  | 1 |
| `changePanelSplitCount` | 23231 | function |  | 3 |
| `applyPresetControl` | 23381 | function |  | 2 |
| `applyCreationToolSettings` | 23402 | function |  | 2 |
| `populateCreationPresetSelect` | 23446 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 23470 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 23503 | function |  | 5 |
| `createCustomCreationPreset` | 23511 | function |  | 3 |
| `createCustomClumpPreset` | 23526 | function |  | 3 |
| `commitCustomCreationPreset` | 23541 | function |  | 2 |
| `openRemoveCreationPreset` | 23602 | function |  | 3 |
| `commitRemoveCreationPreset` | 23615 | function |  | 1 |
| `applyBraidToolPreset` | 23632 | function |  | 2 |
| `selectedBranchChildLock` | 23744 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 23748 | function |  | 2 |
| `initPanelResizeHandles` | 23854 | function |  | 2 |
| `applyWidth` | 23860 | arrow |  | 2 |
| `restoreWidth` | 23867 | arrow |  | 2 |
| `bindResize` | 23875 | arrow |  | 2 |
| `onMove` | 23884 | arrow |  | 0 |
| `onUp` | 23888 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 23905 | function |  | 2 |
| `initFloatingPanelControls` | 23914 | function |  | 2 |
| `detach` | 23923 | arrow |  | 28 |
| `endDrag` | 23961 | arrow |  | 0 |
| `endResize` | 23993 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 24004 | function |  | 3 |
| `selectPatchNotesVersion` | 24138 | function |  | 3 |
| `requestReferenceImage` | 24171 | function |  | 5 |
| `toggleCapsuleGuideTool` | 24375 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 24381 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 24388 | function |  | 1 |
| `deleteLocks` | 24955 | function |  | 10 |
| `disposeCurveObjects` | 25033 | function |  | 4 |
| `beginTipSubBoneRotate` | 25119 | function |  | 2 |
| `applyTipSubBoneTransform` | 25149 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 25181 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 25306 | function |  | 1 |
| `endPanelSplitHandleDrag` | 25527 | function |  | 3 |
| `resize` | 25560 | function |  | 3 |
| `handleViewportPointerMove` | 25571 | function |  | 1 |
| `blockProportionalSizingEvent` | 25582 | function |  | 1 |
| `updateLightAngleFromInputs` | 25588 | function |  | 2 |
| `startViewSnap` | 25602 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 25632 | function |  | 3 |
| `trackViewportPointerDown` | 25649 | function |  | 1 |
| `trackViewportPointerMove` | 25665 | function |  | 1 |
| `clearViewportPointer` | 25673 | function |  | 1 |
| `updateViewSnap` | 25678 | function |  | 1 |
| `nearestCardinalAxis` | 25714 | function |  | 5 |
| `cardinalAxisKey` | 25728 | function |  | 5 |
| `steppedDragAmount` | 25732 | function |  | 3 |
| `snapCameraToCardinalAxis` | 25738 | function |  | 4 |
| `endViewSnap` | 25754 | function |  | 4 |
| `activateStrandControlPoint` | 25764 | function |  | 4 |
| `refreshStrandControlPointSelection` | 25814 | function |  | 4 |
| `addStrandControlPointSelection` | 25841 | function |  | 3 |
| `removeStrandControlPointSelection` | 25858 | function |  | 3 |
| `sampleStrandPointNormal` | 25872 | function |  | 2 |
| `sampleStrandPointVectors` | 25882 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 25888 | function |  | 2 |
| `resampleStrandCurveData` | 25899 | function |  | 4 |
| `resampleMatchingVectors` | 25905 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 25944 | function |  | 4 |
| `removeStrandCurvePoint` | 25955 | function |  | 2 |
| `closestStrandCurveParameter` | 25968 | function |  | 2 |
| `insertStrandCurvePoint` | 25997 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 26014 | function |  | 2 |
| `selectionModifierCursorAvailable` | 26024 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 26040 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 26047 | function |  | 4 |
| `prepareCurvePointSelection` | 26069 | function |  | 1 |
| `finishCurvePointInsertion` | 26180 | function |  | 1 |
| `finishPointRemoval` | 26195 | function |  | 1 |
| `isHairCreateTool` | 26214 | function |  | 4 |
| `syncStrandHoverOutline` | 26218 | function |  | 1 |
| `pointerOverTaperEditor` | 26231 | function |  | 3 |
| `updateStrandBrushHover` | 26238 | function |  | 1 |
| `updatePanelTipHover` | 26259 | function |  | 1 |
| `applySubBoneBrushSample` | 26289 | function |  | 1 |
| `strandControlPointHit` | 26435 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 26439 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 26517 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 26551 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 26591 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 26604 | function |  | 1 |
| `setHoveredControlPoint` | 26643 | function |  | 7 |
| `visibleControlPointHoverTargets` | 26656 | function |  | 2 |
| `updateControlPointHover` | 26692 | function |  | 1 |
| `animate` | 27307 | function |  | 2 |
| `syncCompactSidebarLayout` | 27338 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 27357 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 27363 | function |  | 3 |
| `setAttributeEditorTab` | 27369 | function |  | 6 |

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
