# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-19），由 `node scripts/gen-function-index.js` 产出。共 **2293** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（20788 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 302 | function |  | 2 |
| `saveBooleanPreference` | 339 | function |  | 23 |
| `normalizeControlPointDisplaySize` | 343 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 348 | function |  | 2 |
| `normalizeScaleSensitivity` | 353 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 358 | function |  | 2 |
| `normalizeOutlinerFolderColorOpacity` | 364 | function |  | 2 |
| `normalizeGlassPanelColor` | 369 | function |  | 2 |
| `normalizeSidePanelStyle` | 374 | function |  | 2 |
| `normalizeSideNamingPerspective` | 380 | function |  | 2 |
| `normalizeNavigationStyle` | 384 | function |  | 2 |
| `setupEditableSliderControls` | 399 | function |  | 2 |
| `syncNumberFromRange` | 450 | arrow |  | 0 |
| `applyNumberValue` | 457 | arrow |  | 0 |
| `copyCameraPose` | 597 | function |  | 3 |
| `updateCameraProjectionForViewport` | 603 | function |  | 4 |
| `syncOrthographicFramingFromDistance` | 619 | function |  | 2 |
| `setOrthographicView` | 625 | function |  | 3 |
| `ensureMultiCameraPreviewRenderers` | 655 | function |  | 3 |
| `multiCameraForView` | 668 | function |  | 3 |
| `multiCameraViewUsesLeftPane` | 672 | function |  | 3 |
| `multiCameraViewPaneWidth` | 676 | function |  | 5 |
| `multiCameraViewProjectionOffsetX` | 680 | function |  | 2 |
| `initializeMultiCameraOrthographicViews` | 686 | function |  | 2 |
| `syncMultiCameraPreviewCameras` | 701 | function |  | 3 |
| `multiCameraOrthographicViewActive` | 716 | function |  | 4 |
| `prioritizeActiveMultiCameraViewport` | 720 | function |  | 3 |
| `renderNextInactiveMultiCameraPreview` | 727 | function |  | 2 |
| `setMultiCameraActiveView` | 743 | function |  | 3 |
| `setMultiCameraEnabled` | 766 | function |  | 3 |
| `setMultiCameraExperimentalEnabled` | 784 | function |  | 4 |
| `multiCameraPaneMetrics` | 797 | function |  | 4 |
| `applyViewportProjectionOffset` | 810 | function |  | 2 |
| `addNegativeTransformGizmoRods` | 827 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 856 | function |  | 2 |
| `removeRotateFreeAxisRing` | 882 | function |  | 2 |
| `deflateTransformGizmoPickers` | 894 | function |  | 2 |
| `nextStrandName` | 1295 | function |  | 2 |
| `isPanelGeometry` | 1524 | function |  | 24 |
| `normalizePanelSplits` | 1528 | function |  | 2 |
| `clonePanelSplits` | 1558 | function |  | 10 |
| `normalizeStrandSplits` | 1566 | function |  | 2 |
| `cloneStrandSplits` | 1601 | function |  | 7 |
| `syncStrandSplitLegacyFields` | 1606 | function |  | 3 |
| `snapPanelSplitHeight` | 1613 | function |  | 3 |
| `createQuadSphereGeometry` | 1648 | function |  | 2 |
| `vertexIndex` | 1662 | function |  | 5 |
| `addEdge` | 1680 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1909 | function |  | 4 |
| `ensureDrawClumpPreviewCount` | 2089 | function |  | 1 |
| `currentStrandSelectionState` | 2152 | function |  | 4 |
| `applyStrandSelectionState` | 2156 | function |  | 5 |
| `clearStrandSelectionState` | 2161 | function |  | 5 |
| `cancelRecoverySchedule` | 2560 | function |  | 5 |
| `recoveryWriteMustWait` | 2572 | function |  | 3 |
| `scheduleRecoveryAutosave` | 2579 | function |  | 7 |
| `markProjectChangedForRecovery` | 2591 | function |  | 4 |
| `queueRecoveryAutosave` | 2597 | function |  | 1 |
| `run` | 2611 | arrow |  | 1 |
| `buildRecoveryProjectContent` | 2624 | function |  | 2 |
| `flushRecoveryAutosave` | 2635 | function |  | 2 |
| `clearAcknowledgedRecovery` | 2660 | function |  | 1 |
| `setAutosaveEnabled` | 2676 | function |  | 5 |
| `setAutosaveInterval` | 2685 | function |  | 5 |
| `offerRecoverySnapshot` | 2695 | function |  | 2 |
| `recoverPendingProject` | 2720 | function |  | 1 |
| `discardPendingRecovery` | 2744 | function |  | 1 |
| `downloadPendingRecovery` | 2756 | function |  | 1 |
| `normalizeHairLayer` | 3713 | function |  | 20 |
| `layerOffsetForLock` | 3717 | function |  | 3 |
| `layerRootOffsetFactor` | 3722 | function |  | 7 |
| `layerOffsetWeight` | 3726 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3732 | function |  | 5 |
| `pointsWithLayerOffset` | 3741 | function |  | 1 |
| `layerDirectionForLock` | 3749 | function |  | 2 |
| `applyLayerOffset` | 3760 | function |  | 5 |
| `setLockHairLayer` | 3784 | function |  | 2 |
| `setGroupLayerOffset` | 3799 | function |  | 2 |
| `quadraticWeights` | 3827 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 4028 | function |  | 1 |
| `upperContourCurve` | 4045 | function |  | 2 |
| `hermitePoint` | 4080 | function |  | 2 |
| `curveNetworkSection` | 4091 | function |  | 1 |
| `pointAlongSection` | 4120 | function |  | 1 |
| `longestStitchedContour` | 4126 | function |  | 2 |
| `nodeForPoint` | 4134 | arrow |  | 2 |
| `constructionCurveFromSegments` | 4191 | function |  | 1 |
| `exitSetupEditors` | 4211 | function |  | 6 |
| `syncAppMenuVisibility` | 4221 | function |  | 3 |
| `closeAppMenus` | 4227 | function |  | 5 |
| `setAppMenuOpen` | 4238 | function |  | 2 |
| `setTurntableActive` | 4245 | function |  | 3 |
| `windStrandSeedFor` | 4279 | function |  | 2 |
| `windStrandIndexFor` | 4288 | function |  | 2 |
| `windChainPointsFor` | 4295 | function |  | 2 |
| `windChainPointAt` | 4308 | function |  | 2 |
| `windParamsFromState` | 4315 | function |  | 2 |
| `windNoiseForSeed` | 4328 | function |  | 2 |
| `buildWindPreviewCache` | 4339 | function |  | 3 |
| `windRestoreLockGeometry` | 4368 | function |  | 3 |
| `windPreviewTick` | 4391 | function |  | 5 |
| `setWindPreviewActive` | 4441 | function |  | 8 |
| `setOutlinerTab` | 4499 | function |  | 7 |
| `effectiveViewportSelectionMode` | 4517 | function |  | 4 |
| `componentEditModeActive` | 4521 | function |  | 31 |
| `selectionToolSupportsPicking` | 4525 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4530 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4546 | function |  | 2 |
| `setViewportSelectionMode` | 4577 | function |  | 3 |
| `setViewportEditMode` | 4589 | function |  | 7 |
| `createOutlinerVisibilityToggle` | 4632 | function |  | 5 |
| `setLocksOutlinerVisibility` | 4646 | function |  | 7 |
| `normalizeOutlinerName` | 4660 | function |  | 3 |
| `beginOutlinerRename` | 4665 | function |  | 2 |
| `finish` | 4676 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4706 | function |  | 4 |
| `strandPassesDisplayFilters` | 4856 | function |  | 4 |
| `strandVisibleForDisplay` | 4865 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 4870 | function |  | 3 |
| `lockedStrandsExist` | 4874 | function |  | 1 |
| `hiddenStrandsExist` | 4878 | function |  | 1 |
| `hideSelectedStrands` | 4882 | function |  | 1 |
| `unhideHiddenStrands` | 4892 | function |  | 1 |
| `strandIsolationActive` | 4901 | function |  | 4 |
| `setStrandIsolation` | 4905 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 4917 | function |  | 2 |
| `syncVisibilityParent` | 4928 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 4935 | function |  | 7 |
| `applyCharacterMeshDisplayVisibility` | 4964 | function |  | 4 |
| `applyStrandDisplayVisibility` | 4971 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 4994 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 5212 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 5233 | function |  | 1 |
| `createStrandsFromCurveLattice` | 5252 | function |  | 2 |
| `selectedViewportFocusBounds` | 5350 | function |  | 2 |
| `frameViewportBounds` | 5364 | function |  | 4 |
| `centerViewportOnSelectedItem` | 5395 | function |  | 2 |
| `fullSceneFocusBounds` | 5399 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5414 | function |  | 3 |
| `cycleViewportFraming` | 5423 | function |  | 2 |
| `sculptBrushToolActive` | 5443 | function |  | 22 |
| `sculptBrushSelectionMaskActive` | 5447 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5451 | function |  | 2 |
| `effectiveSculptBrushTool` | 5455 | function |  | 3 |
| `updateSculptScaleModeRow` | 5461 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5466 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5488 | function |  | 5 |
| `setActiveTool` | 5497 | function |  | 10 |
| `setDrawStrandMode` | 5635 | function |  | 1 |
| `setObjectSpaceEditing` | 5645 | function |  | 5 |
| `setHierarchyEditing` | 5661 | function |  | 4 |
| `setProportionalEditing` | 5673 | function |  | 5 |
| `beginProportionalSizeEdit` | 5692 | function |  | 3 |
| `updateProportionalSizeEdit` | 5704 | function |  | 2 |
| `endProportionalSizeEdit` | 5715 | function |  | 5 |
| `activateProportionalHotkeyHold` | 5722 | function |  | 2 |
| `refreshProportionalPreview` | 5730 | function |  | 4 |
| `activeBrushSizeInput` | 5740 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 5749 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 5761 | function |  | 2 |
| `beginBrushSizeDrag` | 5779 | function |  | 1 |
| `updateBrushSizeDrag` | 5806 | function |  | 1 |
| `finishBrushSizeDrag` | 5827 | function |  | 2 |
| `updateInteractionLocks` | 5844 | function |  | 39 |
| `configureTransformControls` | 5855 | function |  | 11 |
| `pullMoveActive` | 5863 | function |  | 8 |
| `updatePullGuideVisual` | 5867 | function |  | 4 |
| `attachTransformForCurvePoint` | 5883 | function |  | 5 |
| `pointerHitsTransformGizmo` | 5907 | function |  | 5 |
| `strandObjectRootIndex` | 5923 | function |  | 3 |
| `strandObjectRoot` | 5932 | function |  | 5 |
| `normalizeStrandObjectTransform` | 5942 | function |  | 12 |
| `strandObjectTransformQuaternionFromValues` | 5957 | function |  | 4 |
| `strandObjectTransformValuesAfterHandle` | 5967 | function |  | 3 |
| `mirroredStrandObjectTransform` | 5993 | function |  | 2 |
| `objectTransformPanelLock` | 6002 | function |  | 3 |
| `formatStrandObjectTransformValue` | 6009 | function |  | 2 |
| `syncStrandObjectTransformPanel` | 6014 | function |  | 7 |
| `applyStrandObjectTransformPanelValues` | 6040 | function |  | 2 |
| `strandObjectTransformQuaternion` | 6101 | function |  | 3 |
| `attachStrandObjectTransform` | 6106 | function |  | 6 |
| `guideObjectPivot` | 6129 | function |  | 3 |
| `guideObjectTransformQuaternion` | 6140 | function |  | 2 |
| `attachGuideObjectTransform` | 6145 | function |  | 5 |
| `guideObjectTransformSnapshot` | 6164 | function |  | 2 |
| `beginGuideObjectTransform` | 6192 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 6199 | function |  | 2 |
| `updateGuideObjectTransform` | 6221 | function |  | 2 |
| `finishGuideObjectTransform` | 6254 | function |  | 2 |
| `clonePlacementFrame` | 6263 | function |  | 2 |
| `cloneOptionalVectors` | 6275 | function |  | 10 |
| `strandObjectTransformSnapshot` | 6279 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 6297 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 6312 | function |  | 2 |
| `strandObjectTransformOperators` | 6328 | function |  | 4 |
| `transformPoint` | 6336 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6343 | arrow |  | 0 |
| `transformNormal` | 6349 | arrow |  | 10 |
| `transformDirection` | 6359 | arrow |  | 1 |
| `worldMatrixForPivot` | 6371 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6377 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6393 | function |  | 6 |
| `beginStrandObjectTransform` | 6419 | function |  | 3 |
| `updateStrandObjectTransform` | 6457 | function |  | 2 |
| `commitStrandObjectTransform` | 6515 | function |  | 2 |
| `mapPoints` | 6530 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6564 | function |  | 3 |
| `surfaceObjectAnchorPose` | 6579 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6602 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6615 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6630 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6656 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6705 | function |  | 2 |
| `beginHandleEdit` | 6714 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6770 | function |  | 3 |
| `multiPointHandleEditActive` | 6781 | function |  | 7 |
| `applyMultiMove` | 6785 | function |  | 5 |
| `applyMultiRotate` | 6791 | function |  | 2 |
| `applyMultiScale` | 6800 | function |  | 2 |
| `applyHierarchicalMove` | 6809 | function |  | 3 |
| `applySingleMove` | 6821 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6825 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6842 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6851 | function |  | 3 |
| `changed` | 6861 | arrow |  | 1 |
| `applyPullMove` | 6903 | function |  | 3 |
| `pullHeadCollisionContext` | 6911 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 6930 | function |  | 2 |
| `applyProportionalMove` | 6953 | function |  | 3 |
| `viewPlaneNormal` | 6964 | function |  | 4 |
| `isCameraInSnappedView` | 6968 | function |  | 2 |
| `viewPlaneMoveActiveForView` | 6976 | function |  | 9 |
| `updateViewPlaneGrid` | 6980 | function |  | 13 |
| `setViewPlaneMove` | 7037 | function |  | 3 |
| `setViewPlaneMoveSnappedOnly` | 7048 | function |  | 2 |
| `rayFromViewportEvent` | 7056 | function |  | 8 |
| `worldUnitsPerViewportPixel` | 7064 | function |  | 4 |
| `viewPlaneMovePointNormal` | 7074 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 7085 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 7098 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 7117 | function |  | 4 |
| `beginViewPlaneMove` | 7124 | function |  | 3 |
| `updateViewPlaneMove` | 7188 | function |  | 1 |
| `endViewPlaneMove` | 7253 | function |  | 7 |
| `applyHierarchicalRotate` | 7272 | function |  | 2 |
| `rotateGuideNormal` | 7279 | arrow |  | 4 |
| `applySingleRotate` | 7317 | function |  | 2 |
| `applyProportionalRotate` | 7321 | function |  | 2 |
| `applyHierarchicalScale` | 7341 | function |  | 2 |
| `applySingleScale` | 7351 | function |  | 2 |
| `applyProportionalScale` | 7355 | function |  | 2 |
| `setPointScale` | 7371 | function |  | 6 |
| `proportionalWeight` | 7380 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7392 | function |  | 5 |
| `strandInfluenceColor` | 7398 | function |  | 4 |
| `beginRelaxEdit` | 7423 | function |  | 3 |
| `updateRelaxEdit` | 7452 | function |  | 1 |
| `endRelaxEdit` | 7512 | function |  | 1 |
| `disposeGuide` | 7522 | function |  | 3 |
| `removeGuideObjects` | 7550 | function |  | 3 |
| `strandRadiusAt` | 7574 | function |  | 5 |
| `strandProfileTopologyAt` | 7596 | function |  | 2 |
| `overrideAt` | 7606 | arrow |  | 1 |
| `strandCurveParameters` | 7643 | function |  | 2 |
| `widthProfileAt` | 7653 | arrow |  | 1 |
| `braidFrameAt` | 7691 | function |  | 4 |
| `braidFrameAtExtended` | 7701 | function |  | 2 |
| `createBraidProfileProjector` | 7710 | function |  | 2 |
| `project` | 7726 | arrow |  | 11 |
| `createBraidGeometry` | 7741 | function |  | 1 |
| `quantize` | 7774 | arrow |  | 19 |
| `deformationAt` | 7776 | function |  | 3 |
| `widthFor` | 7785 | arrow |  | 3 |
| `depthFor` | 7789 | arrow |  | 3 |
| `outputVertex` | 7821 | function |  | 7 |
| `appendAuthoredCap` | 7929 | function |  | 3 |
| `outputCapVertex` | 7936 | arrow |  | 6 |
| `capBoundary` | 8027 | function |  | 3 |
| `strandGeometryCurve` | 8089 | function |  | 8 |
| `strandGeometryFrameAt` | 8115 | function |  | 6 |
| `transportedStrandFrameAt` | 8178 | function |  | 4 |
| `twistOverrideAt` | 8181 | arrow |  | 2 |
| `createHairTopologyGeometry` | 8259 | function |  | 4 |
| `createHairTopologyOverlay` | 8280 | function |  | 3 |
| `groupDefaultsFor` | 8327 | function |  | 7 |
| `creationToolActive` | 8334 | function |  | 5 |
| `activeCreationShapeDefaults` | 8338 | function |  | 6 |
| `curvePolylineLength` | 8345 | function |  | 2 |
| `curvePolylineLengths` | 8353 | function |  | 3 |
| `samplePolylineDistance` | 8361 | function |  | 2 |
| `applyProjectedCurveLength` | 8371 | function |  | 4 |
| `clearRegionLengthBaseline` | 8402 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8409 | function |  | 2 |
| `setGroupLengthScale` | 8417 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 8455 | function |  | 3 |
| `requestGroupDefaultsWarning` | 8487 | function |  | 1 |
| `activeProfileOffset` | 8499 | function |  | 3 |
| `profileToCanvas` | 8507 | function |  | 1 |
| `renderProfilePreview` | 8514 | function |  | 7 |
| `renderHairCardCoveragePath` | 8533 | function |  | 2 |
| `updateViewportStatsVisibility` | 9081 | function |  | 1 |
| `canvasToProfile` | 9100 | function |  | 2 |
| `addLock` | 9115 | function |  | 4 |
| `mirroredVector` | 9340 | function |  | 12 |
| `mirroredPlacementFrame` | 9344 | function |  | 2 |
| `mirrorPartnerFor` | 9357 | function |  | 28 |
| `decoupleMirrorPartner` | 9361 | function |  | 2 |
| `createMirrorPartner` | 9369 | function |  | 3 |
| `createMirrorPartnerForNewLock` | 9480 | function |  | 1 |
| `syncMirrorPartnerFromLock` | 9499 | function |  | 3 |
| `syncActiveMirror` | 9691 | function |  | 22 |
| `setMirrorXEditing` | 9703 | function |  | 5 |
| `snapshotState` | 9727 | function |  | 5 |
| `pushUndoState` | 10079 | function |  | 68 |
| `undoLastAction` | 10087 | function |  | 2 |
| `redoLastAction` | 10106 | function |  | 2 |
| `updateHistoryButtons` | 10125 | function |  | 5 |
| `resetTransientInteractionsForStateRestore` | 10130 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 10150 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 10160 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 10200 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 10226 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 10258 | function |  | 2 |
| `finalizeStateRestore` | 10299 | function |  | 2 |
| `restoreState` | 10306 | function |  | 3 |
| `disposeAllEditableObjects` | 10330 | function |  | 2 |
| `restoreLock` | 10352 | function |  | 2 |
| `restoreGuide` | 10592 | function |  | 2 |
| `vectorToData` | 10653 | function |  | 15 |
| `dataToVector` | 10657 | function |  | 14 |
| `frameToData` | 10687 | function |  | 2 |
| `frameFromData` | 10699 | function |  | 2 |
| `average` | 10711 | function |  | 3 |
| `fitPointAttributes` | 10715 | function |  | 5 |
| `rebuildCurveObjects` | 10744 | function |  | 4 |
| `createCurvePoints` | 10756 | function |  | 2 |
| `deselectStrands` | 10860 | function |  | 9 |
| `beginSelectionMarquee` | 10877 | function |  | 3 |
| `beginAltOrbit` | 10901 | function |  | 1 |
| `beginBlenderNavigation` | 10918 | function |  | 1 |
| `endBlenderNavigation` | 10968 | function |  | 1 |
| `prepareSelectPointerCapture` | 10976 | function |  | 1 |
| `endSelectPointerCapture` | 10982 | function |  | 1 |
| `applyAltClickCandidate` | 10988 | function |  | 2 |
| `finishBrushAltClick` | 11019 | function |  | 1 |
| `endAltOrbit` | 11032 | function |  | 2 |
| `dollyCameraByDrag` | 11039 | function |  | 2 |
| `fastDragMagnitude` | 11062 | function |  | 2 |
| `beginHoudiniZoomDrag` | 11068 | function |  | 1 |
| `updateHoudiniZoomDrag` | 11076 | function |  | 1 |
| `endHoudiniZoomDrag` | 11093 | function |  | 1 |
| `updateSelectionMarquee` | 11101 | function |  | 1 |
| `pointInsideSelectionMarquee` | 11118 | function |  | 3 |
| `selectPointsInMarquee` | 11126 | function |  | 2 |
| `pointKey` | 11152 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 11183 | function |  | 2 |
| `objectInsideSelectionMarquee` | 11220 | function |  | 3 |
| `projectedPoint` | 11237 | arrow |  | 1 |
| `selectObjectsInMarquee` | 11266 | function |  | 2 |
| `finishSelectionMarquee` | 11311 | function |  | 2 |
| `strandSplitProfileData` | 11335 | function |  | 2 |
| `strandSplitControlPoint` | 11348 | function |  | 1 |
| `panelSplitControlPoint` | 11384 | function |  | 3 |
| `panelWidthAt` | 11401 | arrow |  | 3 |
| `panelThicknessAt` | 11408 | arrow |  | 3 |
| `strandControlPointRaycast` | 11441 | function |  | 1 |
| `strandControlPointFrame` | 11476 | function |  | 4 |
| `strandControlPointHitFromEvent` | 11508 | function |  | 3 |
| `createCurveObjects` | 11566 | function |  | 4 |
| `createDimensionEdgeLines` | 11595 | arrow |  | 2 |
| `strandWidthEdgeFrameAt` | 11711 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 11718 | function |  | 2 |
| `strandWidthEdgeSample` | 11727 | function |  | 3 |
| `strandWidthEdgePoints` | 11762 | function |  | 2 |
| `moveCurveControlsApplicable` | 11776 | function |  | 5 |
| `moveGrabHandlesApplicable` | 11786 | function |  | 2 |
| `moveGrabHandleVisible` | 11796 | function |  | 2 |
| `visibleTaperMeshCurveEdits` | 11801 | function |  | 1 |
| `syncMoveCurveControls` | 11822 | function |  | 8 |
| `syncAuthoredCheckbox` | 11837 | arrow |  | 3 |
| `setMoveGrabHandleVisibility` | 11857 | function |  | 4 |
| `setMoveCurveControlVisibility` | 11865 | function |  | 4 |
| `setSelectedMoveCurveShapeFlag` | 11874 | function |  | 4 |
| `sculptBrushDebugRaycast` | 11888 | arrow |  | 0 |
| `updateCurveObjects` | 11890 | function |  | 27 |
| `pointUpDirection` | 12099 | function |  | 2 |
| `curveFrameAtPoint` | 12103 | function |  | 4 |
| `curveFrameAt` | 12124 | function |  | 3 |
| `strandTwistAt` | 12144 | function |  | 6 |
| `controlPointRotationAt` | 12149 | function |  | 3 |
| `strandProfileTwistAt` | 12153 | function |  | 2 |
| `strandFrameAt` | 12159 | function |  | 1 |
| `curveFrameAtSnapshot` | 12165 | function |  | 3 |
| `outwardNormalAtPoint` | 12184 | function |  | 5 |
| `sampledSurfaceNormal` | 12252 | function |  | 2 |
| `guidedNormalAt` | 12268 | function |  | 4 |
| `twistFromHandle` | 12287 | function |  | 3 |
| `signedAngleAroundAxis` | 12308 | function |  | 4 |
| `handleColor` | 12315 | function |  | 2 |
| `isAffectedCurvePoint` | 12338 | function |  | 2 |
| `syncLockFromCurve` | 12344 | function |  | 14 |
| `rebuildLockGeometry` | 12374 | function |  | 18 |
| `flushPendingLockGeometryUpdates` | 12402 | function |  | 6 |
| `updateLockGeometry` | 12415 | function |  | 28 |
| `setGroupColorView` | 12436 | function |  | 2 |
| `createUvCheckerTexture` | 12446 | function |  | 3 |
| `ensureUvCheckerForLock` | 12482 | function |  | 3 |
| `removeUvCheckerFromLock` | 12515 | function |  | 3 |
| `invalidateUvInspector` | 12530 | function |  | 9 |
| `uvInspectorRecord` | 12534 | function |  | 1 |
| `uvInspectorRecords` | 12573 | function |  | 2 |
| `drawUvInspectorGrid` | 12577 | function |  | 2 |
| `renderUvInspector` | 12611 | function |  | 4 |
| `setUvCheckerEnabled` | 12670 | function |  | 3 |
| `buildUvCheckerPreviewGeometry` | 12693 | function |  | 2 |
| `restoreUvCheckerPreview` | 12712 | function |  | 6 |
| `applyUvCheckerPreview` | 12728 | function |  | 2 |
| `refreshUvCheckerPreview` | 12743 | function |  | 1 |
| `strandViewportBaseColor` | 12771 | function |  | 2 |
| `strandMirrorPartnerHighlighted` | 12806 | function |  | 3 |
| `syncStrandSelectionOutline` | 12812 | function |  | 2 |
| `applyLockedStrandPalette` | 12823 | function |  | 2 |
| `syncLockedStrandWireVisual` | 12832 | function |  | 5 |
| `setStrandSelectionVisual` | 12841 | function |  | 4 |
| `updateStrandSelectionHighlightForLock` | 12859 | function |  | 1 |
| `updateStrandSelectionHighlight` | 12863 | function |  | 6 |
| `refreshStrandCurveSelectionVisuals` | 12867 | function |  | 2 |
| `resetGuideSelectionVisuals` | 12880 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 12900 | function |  | 3 |
| `selectLock` | 12935 | function |  | 24 |
| `deselectStrandsForGuideEditor` | 13007 | function |  | 1 |
| `syncGroupInputs` | 13018 | function |  | 2 |
| `topologyStatsForLock` | 13051 | function |  | 4 |
| `formatTopologyStats` | 13059 | function |  | 5 |
| `updateTopologyStats` | 13063 | function |  | 15 |
| `normalizeStrandDimensions` | 13097 | function |  | 3 |
| `strandBaseWidth` | 13111 | function |  | 5 |
| `strandWidthDimension` | 13115 | function |  | 5 |
| `strandDepthDimension` | 13123 | function |  | 8 |
| `setStrandWidthDimension` | 13131 | function |  | 2 |
| `setStrandDepthDimension` | 13153 | function |  | 4 |
| `syncShapeDimensionInputs` | 13169 | function |  | 4 |
| `syncCreationShapeInputs` | 13205 | function |  | 2 |
| `syncViewportDrawSettings` | 13244 | function |  | 4 |
| `syncViewportTopControlRows` | 13259 | function |  | 6 |
| `syncResponsiveSidebarDock` | 13279 | function |  | 2 |
| `syncStrandSplitInputs` | 13312 | function |  | 4 |
| `syncStrandSplitControls` | 13327 | function |  | 2 |
| `currentStrandTipChain` | 13344 | function |  | 5 |
| `currentStrandTipLength` | 13351 | function |  | 2 |
| `syncStrandTipInputs` | 13360 | function |  | 4 |
| `currentStrandSplitTipChains` | 13375 | function |  | 4 |
| `restPointAt` | 13410 | arrow |  | 0 |
| `currentStrandSplitTipLength` | 13430 | function |  | 2 |
| `syncStrandSplitTipInputs` | 13441 | function |  | 3 |
| `syncHairCardControls` | 13452 | function |  | 6 |
| `updateAttributeEditorMode` | 13461 | function |  | 10 |
| `pinActiveToolSettingsPanel` | 13616 | function |  | 2 |
| `curveLatticeForGroup` | 13639 | function |  | 2 |
| `filterCurveLatticesToGroup` | 13657 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 13702 | function |  | 2 |
| `showCurveLatticeForGroup` | 13719 | function |  | 2 |
| `selectStrandGroup` | 13756 | function |  | 3 |
| `selectCurvePoint` | 13798 | function |  | 3 |
| `updateSelectedPointLabel` | 13812 | function |  | 12 |
| `syncInputs` | 13825 | function |  | 13 |
| `getSelectedLock` | 13873 | function |  | 97 |
| `selectedLocksInOrder` | 13877 | function |  | 26 |
| `lockStrands` | 13883 | function |  | 3 |
| `lockSelectedStrands` | 13916 | function |  | 2 |
| `unlockStrands` | 13922 | function |  | 3 |
| `unlockAllStrands` | 13937 | function |  | 2 |
| `strandEditFamily` | 13941 | function |  | 7 |
| `compatibleSelectedLocks` | 13946 | function |  | 5 |
| `selectedEditRoots` | 13953 | function |  | 2 |
| `editSelectedLocks` | 13966 | function |  | 18 |
| `multiEditValuesEqual` | 13999 | function |  | 2 |
| `setMixedControl` | 14008 | function |  | 29 |
| `syncMultiStrandInputs` | 14025 | function |  | 18 |
| `values` | 14041 | arrow |  | 35 |
| `selectedRebuildableCurves` | 14122 | function |  | 5 |
| `createCompoundStrand` | 14129 | function |  | 1 |
| `refreshRebuildCurveDialog` | 14190 | function |  | 7 |
| `openRebuildCurveDialog` | 14203 | function |  | 1 |
| `rebuildSelectedCurves` | 14217 | function |  | 2 |
| `cleanSelectionSets` | 14258 | function |  | 2 |
| `createSelectionSetFromSelection` | 14263 | function |  | 2 |
| `selectionSetById` | 14274 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 14278 | function |  | 7 |
| `editSelectionSetFromSelection` | 14287 | function |  | 4 |
| `closeSelectionSetMembershipDialog` | 14307 | function |  | 3 |
| `openSelectionSetMembershipDialog` | 14313 | function |  | 3 |
| `deleteSelectionSet` | 14345 | function |  | 2 |
| `selectSelectionSet` | 14354 | function |  | 2 |
| `deleteSelectedStrands` | 14364 | function |  | 3 |
| `deleteGuide` | 14372 | function |  | 3 |
| `deleteSelectedGuide` | 14395 | function |  | 3 |
| `hasDeletableSelection` | 14400 | function |  | 2 |
| `deleteCurrentSelection` | 14408 | function |  | 3 |
| `hideOutlinerContextMenu` | 14416 | function |  | 16 |
| `outlinerLockTargets` | 14421 | function |  | 3 |
| `showOutlinerContextMenu` | 14448 | function |  | 6 |
| `setPullMoveEnabled` | 14545 | function |  | 2 |
| `setNavigationTipsEnabled` | 14554 | function |  | 4 |
| `configureNavigationMouseButtons` | 14561 | function |  | 3 |
| `syncNavigationModifierLocks` | 14574 | function |  | 7 |
| `setNavigationStyle` | 14579 | function |  | 4 |
| `applyCameraSmoothingPreference` | 14595 | function |  | 4 |
| `setCameraSmoothingEnabled` | 14610 | function |  | 4 |
| `setCameraSmoothingStrength` | 14616 | function |  | 4 |
| `setScaleSensitivity` | 14624 | function |  | 3 |
| `setToolTipsEnabled` | 14632 | function |  | 4 |
| `setCompactToolButtonsEnabled` | 14639 | function |  | 4 |
| `setViewportStatisticsEnabled` | 14648 | function |  | 4 |
| `setTwistCurveAllStrandsPreviewEnabled` | 14656 | function |  | 4 |
| `setLayerColorShiftsEnabled` | 14671 | function |  | 4 |
| `setOutlinerFolderColorsEnabled` | 14680 | function |  | 4 |
| `setSidePanelStyle` | 14690 | function |  | 5 |
| `setGlassPanelColor` | 14708 | function |  | 6 |
| `setOutlinerFolderColorOpacity` | 14718 | function |  | 5 |
| `sideNamingDisplayId` | 14735 | function |  | 2 |
| `strandRegionDisplayLabel` | 14748 | function |  | 6 |
| `updateSideNamingLabels` | 14766 | function |  | 2 |
| `setSideNamingPerspective` | 14793 | function |  | 4 |
| `setControlPointDisplaySize` | 14802 | function |  | 5 |
| `scaleHexColor` | 14814 | function |  | 3 |
| `setViewportBackgroundColor` | 14819 | function |  | 6 |
| `setDefaultHairShader` | 14841 | function |  | 4 |
| `setPreferenceCategory` | 14847 | function |  | 4 |
| `openPreferencesDialog` | 14874 | function |  | 1 |
| `savePreferencesDialog` | 14913 | function |  | 1 |
| `cancelPreferencesDialog` | 14943 | function |  | 3 |
| `createOutlinerStrandButton` | 14983 | function |  | 2 |
| `createOutlinerCurveSurface` | 15069 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 15166 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 15173 | function |  | 2 |
| `renderLockList` | 15252 | function |  | 37 |
| `updateCount` | 15433 | function |  | 10 |
| `captureInputUndo` | 15442 | function |  | 1 |
| `bindUndoCapture` | 15448 | function |  | 42 |
| `bindLockInput` | 15459 | function |  | 2 |
| `applyValue` | 15476 | arrow |  | 2 |
| `applyUniformTransformScale` | 15811 | function |  | 2 |
| `applyReducedTransformScale` | 15828 | function |  | 2 |
| `applyTransformPrecision` | 15867 | function |  | 2 |
| `updateTransformScalePointer` | 15896 | function |  | 1 |
| `segmentWidthResetCurveFor` | 16384 | arrow |  | 2 |
| `syncDrawCurlControls` | 16978 | function |  | 5 |
| `handleLiveSurfaceChange` | 17026 | function |  | 1 |
| `writeTo` | 17076 | arrow |  | 1 |
| `applyStrandTipToTarget` | 17096 | function |  | 5 |
| `strandTipTarget` | 17107 | function |  | 5 |
| `strandSplitTipTarget` | 17180 | function |  | 3 |
| `applyStrandSplitTipToTarget` | 17185 | function |  | 3 |
| `selectedBranchChildLock` | 17469 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 17473 | function |  | 2 |
| `updateSweepOverlapSliderInputs` | 17514 | function |  | 2 |
| `initPanelResizeHandles` | 17734 | function |  | 2 |
| `applyWidth` | 17740 | arrow |  | 2 |
| `restoreWidth` | 17747 | arrow |  | 2 |
| `bindResize` | 17755 | arrow |  | 2 |
| `onMove` | 17764 | arrow |  | 0 |
| `onUp` | 17768 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 17785 | function |  | 2 |
| `initFloatingPanelControls` | 17794 | function |  | 2 |
| `detach` | 17803 | arrow |  | 22 |
| `endDrag` | 17841 | arrow |  | 0 |
| `endResize` | 17873 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 17884 | function |  | 3 |
| `selectPatchNotesVersion` | 18043 | function |  | 3 |
| `toggleCapsuleGuideTool` | 18274 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 18280 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 18287 | function |  | 1 |
| `deleteLocks` | 18892 | function |  | 4 |
| `disposeCurveObjects` | 18971 | function |  | 4 |
| `activateMultiCameraView` | 19018 | arrow |  | 1 |
| `resize` | 19050 | function |  | 6 |
| `handleViewportPointerMove` | 19076 | function |  | 1 |
| `blockProportionalSizingEvent` | 19087 | function |  | 1 |
| `updateLightAngleFromInputs` | 19093 | function |  | 2 |
| `startViewSnap` | 19107 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 19137 | function |  | 3 |
| `trackViewportPointerDown` | 19154 | function |  | 1 |
| `trackViewportPointerMove` | 19170 | function |  | 1 |
| `clearViewportPointer` | 19178 | function |  | 1 |
| `updateViewSnap` | 19183 | function |  | 1 |
| `nearestCardinalAxis` | 19219 | function |  | 6 |
| `cardinalAxisKey` | 19233 | function |  | 6 |
| `steppedDragAmount` | 19237 | function |  | 3 |
| `snapCameraToCardinalAxis` | 19243 | function |  | 5 |
| `endViewSnap` | 19259 | function |  | 4 |
| `updateCameraViewCube` | 19278 | function |  | 3 |
| `activateView` | 19296 | function |  | 1 |
| `activateStrandControlPoint` | 19321 | function |  | 2 |
| `refreshStrandControlPointSelection` | 19371 | function |  | 4 |
| `addStrandControlPointSelection` | 19398 | function |  | 2 |
| `removeStrandControlPointSelection` | 19415 | function |  | 3 |
| `sampleStrandPointNormal` | 19429 | function |  | 2 |
| `sampleStrandPointVectors` | 19439 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 19445 | function |  | 2 |
| `resampleStrandCurveData` | 19456 | function |  | 4 |
| `resampleMatchingVectors` | 19462 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 19501 | function |  | 4 |
| `removeStrandCurvePoint` | 19512 | function |  | 2 |
| `closestStrandCurveParameter` | 19525 | function |  | 1 |
| `insertStrandCurvePoint` | 19554 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 19571 | function |  | 2 |
| `selectionModifierCursorAvailable` | 19581 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 19597 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 19604 | function |  | 4 |
| `finishCurvePointInsertion` | 19627 | function |  | 1 |
| `finishPointRemoval` | 19642 | function |  | 1 |
| `isHairCreateTool` | 19661 | function |  | 4 |
| `syncStrandHoverOutline` | 19665 | function |  | 1 |
| `pointerOverTaperEditor` | 19678 | function |  | 2 |
| `updateStrandBrushHover` | 19685 | function |  | 1 |
| `strandControlPointHit` | 19709 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 19713 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 19791 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 19825 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 19865 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 19878 | function |  | 1 |
| `setHoveredControlPoint` | 19917 | function |  | 7 |
| `visibleControlPointHoverTargets` | 19930 | function |  | 2 |
| `updateControlPointHover` | 19966 | function |  | 1 |
| `animate` | 20597 | function |  | 2 |
| `syncCompactSidebarLayout` | 20634 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 20653 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 20659 | function |  | 3 |
| `setAttributeEditorTab` | 20665 | function |  | 6 |

## modules/bones/bone-interaction.js（1023 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBoneInteractionApi` | 35 | function | export | 1 |
| `strandTipWidthGeoDeps` | 39 | function |  | 3 |
| `tipEditContext` | 69 | function |  | 4 |
| `tipDragSnapshot` | 93 | function |  | 3 |
| `writeTipEdit` | 102 | function |  | 4 |
| `selectTipSubBone` | 118 | function |  | 5 |
| `beginTipSubBoneRotate` | 126 | function |  | 1 |
| `beginTipSubBoneTranslate` | 139 | function |  | 1 |
| `applyTipSubBoneTransform` | 152 | function |  | 1 |
| `beginPanelSplitHandleDrag` | 213 | function |  | 1 |
| `updatePanelSplitHandleDrag` | 406 | function |  | 1 |
| `materializeBones` | 505 | arrow |  | 1 |
| `writeWidth` | 545 | arrow |  | 3 |
| `endPanelSplitHandleDrag` | 651 | function |  | 3 |
| `applySubBoneBrushSample` | 662 | function |  | 1 |
| `computeCursorWeights` | 722 | arrow |  | 1 |
| `updatePanelTipHover` | 866 | function |  | 1 |
| `prepareCurvePointSelection` | 900 | function |  | 1 |

## modules/bones/bone-model.js（793 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `defaultSplitSpread` | 11 | function | export | 3 |
| `normalizeSplitBones` | 17 | function | export | 6 |
| `srcCurve` | 27 | arrow |  | 4 |
| `cloneSplitBones` | 59 | function | export | 2 |
| `splitBonesFor` | 67 | function | export | 3 |
| `materializeSplitBones` | 83 | function | export | 1 |
| `bonesFor` | 101 | function | export | 1 |
| `splitBonesToData` | 211 | function | export | 1 |
| `splitBonesFromData` | 239 | function | export | 1 |
| `mirrorSplitBones` | 244 | function | export | 1 |
| `cloneSegmentBone` | 273 | function |  | 3 |
| `point` | 275 | arrow |  | 1 |
| `curve` | 276 | arrow |  | 8 |
| `resolveMergeSurvivor` | 313 | function |  | 2 |
| `remapSegmentBonesOnInsert` | 331 | function | export | 1 |
| `remapSegmentBonesOnDelete` | 350 | function | export | 1 |
| `normalizeStrandTip` | 372 | function | export | 6 |
| `numPoint` | 374 | arrow |  | 0 |
| `strandTipFor` | 383 | function | export | 2 |
| `strandTipToData` | 387 | function | export | 1 |
| `strandTipFromData` | 399 | function | export | 1 |
| `mirrorStrandTip` | 403 | function | export | 1 |
| `defaultStrandSplitSpread` | 419 | function | export | 3 |
| `strandSplitForkT` | 425 | function | export | 1 |
| `strandSplitsFor` | 432 | function | export | 5 |
| `strandSplitForkTForSegment` | 448 | function | export | 3 |
| `strandSplitDirection` | 466 | function | export | 2 |
| `strandSplitDirectionForSegment` | 475 | function | export | 1 |
| `normalizeStrandSplitBone` | 479 | function |  | 3 |
| `strandSplitBonesFor` | 497 | function | export | 3 |
| `materializeStrandSplitBones` | 526 | function | export | 1 |
| `strandSplitBonesToData` | 534 | function | export | 1 |
| `strandSplitBonesFromData` | 562 | function | export | 1 |
| `mirrorStrandSplitBones` | 589 | function | export | 1 |
| `normalizeBone` | 613 | function | export | 7 |
| `pick` | 620 | arrow |  | 6 |
| `normalizeBones` | 652 | function | export | 2 |
| `bonesToData` | 659 | function | export | 2 |
| `bonesFromData` | 690 | function | export | 1 |
| `mirrorBones` | 696 | function | export | 1 |
| `segmentBoneHost` | 754 | function | export | 2 |
| `resolveSegmentSelection` | 764 | function | export | 1 |
| `registryForSave` | 777 | function | export | 1 |

## modules/bones/bone-view-handles.js（851 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBoneViewHandlesApi` | 35 | function | export | 2 |
| `strandTipWidthGeoDeps` | 56 | function |  | 2 |
| `createSplitControlHandle` | 65 | function |  | 8 |
| `createCurveNormalIndicator` | 80 | function |  | 2 |
| `allocateTipChainHandles` | 126 | function |  | 3 |
| `allocateTipWidthHandles` | 163 | function |  | 3 |
| `createBoneViewHandles` | 201 | function |  | 1 |
| `updateBoneViewHandles` | 373 | function |  | 1 |
| `tipChainCtx` | 433 | arrow |  | 0 |
| `syncTipNormalArrow` | 491 | arrow |  | 4 |
| `tipWidthCtx` | 587 | arrow |  | 0 |
| `disposeBoneViewHandles` | 778 | function |  | 1 |

## modules/bones/segment-control.js（624 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `strandSplitBoundaries` | 33 | function |  | 4 |
| `largestStrandSegmentIndex` | 41 | function | export | 3 |
| `canFitAnotherStrandSplit` | 51 | function | export | 2 |
| `applyStrandSplitGapToTubes` | 73 | function | export | 1 |
| `insertedStrandSplitHeight` | 92 | function | export | 2 |
| `fitSegmentBones` | 107 | function |  | 5 |
| `segmentSpans` | 113 | function |  | 7 |
| `hasOrder` | 119 | function |  | 3 |
| `createSegmentControlApi` | 134 | function | export | 1 |
| `dropDanglingPanelSplitSelection` | 135 | function |  | 2 |
| `dropDanglingStrandSplitSelection` | 141 | function |  | 2 |
| `dropDanglingTipSelection` | 157 | function |  | 5 |
| `segmentUi` | 167 | function |  | 3 |
| `syncSegmentControls` | 194 | function |  | 3 |
| `selectedPanelSegment` | 223 | function |  | 2 |
| `selectedStrandSegment` | 230 | function |  | 1 |
| `syncPanelSegmentControls` | 235 | function |  | 3 |
| `syncStrandSegmentControls` | 245 | function |  | 2 |
| `syncPanelShapeInputs` | 249 | function |  | 3 |
| `openSegmentCurveEditor` | 279 | function |  | 3 |
| `openPanelSegmentCurveEditor` | 318 | function |  | 1 |
| `openStrandSegmentCurveEditor` | 323 | function |  | 1 |
| `stepSegment` | 334 | function |  | 3 |
| `stepPanelSegment` | 342 | function |  | 1 |
| `stepStrandSegment` | 349 | function |  | 1 |
| `applyStrandSegmentSpread` | 361 | function |  | 1 |
| `changePanelSplitCount` | 379 | function |  | 1 |
| `deleteSelectedPanelSplit` | 455 | function |  | 1 |
| `strandSplitTarget` | 486 | function |  | 2 |
| `isStrandLock` | 498 | function |  | 4 |
| `changeStrandSplitCount` | 502 | function |  | 1 |
| `deleteSelectedStrandSplit` | 567 | function |  | 1 |
| `syncSegmentControlsForLock` | 599 | function |  | 1 |

## modules/bones/tip-sub-bone-host.js（104 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createTipSubBoneHostApi` | 36 | function | export | 1 |
| `resolveTipHost` | 42 | function |  | 1 |

## modules/branch/branch-store.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchStore` | 15 | function | export | 1 |

## modules/core/app-config.js（97 行）

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

## modules/core/hair-store.js（38 行）

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

## modules/core/misc-store.js（28 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createMiscStore` | 3 | function | export | 1 |

## modules/core/multi-camera-store.js（26 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createMultiCameraStore` | 11 | function | export | 1 |

## modules/core/preference-storage.js（33 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `readStoredPreference` | 1 | function | export | 2 |
| `readStoredBooleanPreference` | 14 | function | export | 1 |
| `writeStoredPreference` | 25 | function | export | 1 |

## modules/core/preferences-backup.js（80 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPreferencesBackup` | 4 | function | export | 1 |
| `normalizePreferencesBackup` | 33 | function | export | 1 |
| `preferencesBackupFileName` | 73 | function | export | 1 |

## modules/core/scene-store.js（38 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSceneStore` | 5 | function | export | 1 |

## modules/core/shortcut-registry.js（63 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `shortcutToolForKey` | 34 | function | export | 1 |
| `workspaceForShortcutKey` | 38 | function | export | 1 |
| `pointerControlShouldReturnViewportFocus` | 42 | function | export | 1 |
| `focusedControlShouldYieldToShortcut` | 50 | function | export | 1 |

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

## modules/core/wind-store.js（81 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clampNumber` | 9 | function |  | 10 |
| `createWindStore` | 30 | function | export | 1 |

## modules/data/clump-brush-presets.js（145 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneJsonValue` | 1 | arrow |  | 4 |
| `finitePoint` | 47 | function |  | 1 |
| `normalizePoints` | 54 | function |  | 2 |
| `normalizeStrand` | 63 | function |  | 1 |
| `normalizeClumpBrushTemplate` | 83 | function | export | 2 |
| `createClumpBrushTemplate` | 108 | function | export | 1 |

## modules/data/loc-ja.js（784 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/data/loc-zh.js（770 行）

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

## modules/edit/sculpt-edit-store.js（36 行）

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

## modules/geometry/anime-hair-shaders.js（292 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeHairShader` | 5 | function | export | 1 |
| `normalizedHexColor` | 52 | function |  | 6 |
| `normalizeAnimeAnisotropicSettings` | 56 | function | export | 1 |

## modules/geometry/arc-hair-surface.js（86 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `finiteNumber` | 11 | function |  | 8 |
| `clamp` | 16 | function |  | 8 |
| `normalizeArcHairSurfaceSettings` | 20 | function | export | 2 |
| `arcCrossSection` | 32 | function |  | 2 |
| `createArcHairSurfaceGrid` | 57 | function | export | 1 |

## modules/geometry/branch-bridge.js（996 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchBridgeApi` | 8 | function | export | 2 |
| `buildBranchBridgeGeometry` | 14 | function |  | 2 |
| `pushBoundary` | 46 | arrow |  | 8 |
| `boundaryAt` | 65 | arrow |  | 3 |
| `hermite` | 87 | arrow |  | 2 |
| `emitBottomMidRow` | 132 | arrow |  | 2 |
| `emitTopMidRow` | 231 | arrow |  | 2 |
| `sideHoleVertex` | 273 | arrow |  | 4 |
| `cachedSideHoleVertex` | 322 | arrow |  | 2 |
| `emitFillStrip` | 393 | arrow |  | 2 |
| `fillSide` | 404 | arrow |  | 0 |
| `directBridgeQuadIndex` | 448 | arrow |  | 2 |
| `edgeDirection` | 472 | arrow |  | 1 |
| `createBranchChildGeometry` | 542 | function |  | 1 |
| `applyBranchRootRegionCarving` | 760 | function |  | 1 |
| `branchRootRegionSurface` | 838 | function |  | 6 |
| `toGridCol` | 865 | arrow |  | 5 |
| `toRow` | 869 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 921 | function |  | 2 |
| `branchRootRegionWorldPoints` | 941 | function |  | 1 |
| `pointAt` | 947 | arrow |  | 5 |
| `applyBranchRootOffset` | 972 | function |  | 1 |

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

## modules/geometry/branch-knife.js（42 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 2 |
| `distance` | 5 | function |  | 4 |
| `resampleClosedProfilePoints` | 9 | function | export | 1 |

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

## modules/geometry/branch-sweep.js（410 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchSweepApi` | 7 | function | export | 2 |
| `activeSweepProfile` | 21 | function |  | 3 |
| `activeSweepProfileTarget` | 28 | function |  | 3 |
| `trimmedSweepProfile` | 35 | function |  | 2 |
| `roundedLeft` | 44 | arrow |  | 1 |
| `roundedRight` | 50 | arrow |  | 1 |
| `mirroredSweepProfileIndex` | 67 | function |  | 1 |
| `createSmoothSweepProfileCurve` | 84 | function |  | 5 |
| `sampleSweepProfile` | 93 | function |  | 4 |
| `createSweepProfileTopology` | 114 | function |  | 1 |
| `twistCurveEditing` | 156 | function |  | 1 |
| `proceduralBranchLengthCurveEditing` | 160 | function |  | 2 |
| `proceduralBranchShapeCurveEditing` | 164 | function |  | 2 |
| `proceduralBranchCurveEditing` | 168 | function |  | 1 |
| `renderTwistCurvePreview` | 172 | function |  | 1 |
| `twistMeshPointDistancePerDegree` | 190 | function |  | 2 |
| `twistMeshGraphAxis` | 198 | function |  | 2 |
| `addTwistMeshCurvePath` | 202 | function |  | 1 |
| `appendSegment` | 223 | arrow |  | 1 |
| `appendFill` | 226 | arrow |  | 1 |
| `appendSignedSection` | 232 | arrow |  | 3 |
| `renderSweepProfileEditor` | 281 | function |  | 3 |
| `applySweepProfileEdit` | 324 | function |  | 1 |
| `openSweepProfileEditor` | 351 | function |  | 1 |
| `closeSweepProfileEditor` | 386 | function |  | 1 |
| `finishSweepProfileDrag` | 395 | function |  | 1 |

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

## modules/geometry/clump-procedural.js（949 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createClumpProceduralApi` | 12 | function | export | 2 |
| `nextClumpName` | 39 | function |  | 3 |
| `initializeClumpShape` | 46 | function |  | 5 |
| `stableClumpVariation` | 57 | function |  | 3 |
| `createClumpFromLocks` | 69 | function |  | 4 |
| `addLockToClump` | 94 | function |  | 4 |
| `pointerToNdc` | 112 | function |  | 1 |
| `gridProfileSkipCol` | 120 | function |  | 1 |
| `clumpDirectMembers` | 129 | function |  | 3 |
| `clumpMembersForGuide` | 134 | function |  | 6 |
| `clumpGuideForLock` | 138 | function |  | 6 |
| `proceduralGuideForLock` | 143 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 150 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 157 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 164 | function |  | 2 |
| `proceduralBranchWorldPoints` | 176 | function |  | 1 |
| `applyProceduralBranchSettings` | 189 | function |  | 2 |
| `proceduralAccessoryMapsForGuide` | 228 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 244 | function |  | 3 |
| `createProceduralAccessoryLock` | 258 | function |  | 2 |
| `applyProceduralAccessorySettings` | 310 | function |  | 2 |
| `clumpFrameAt` | 361 | function |  | 5 |
| `commitClumpMemberRestState` | 369 | function |  | 1 |
| `updateClumpMembers` | 452 | function |  | 3 |
| `dissolveClump` | 556 | function |  | 3 |
| `detachLockFromClump` | 593 | function |  | 3 |
| `mirroredClumpPartners` | 619 | function |  | 1 |
| `createMirroredClump` | 625 | function |  | 1 |
| `decoupleMirroredClump` | 647 | function |  | 1 |
| `syncClumpGuidePanel` | 656 | function |  | 2 |
| `selectionCanBecomeClump` | 683 | function |  | 2 |
| `createClumpFromSelection` | 688 | function |  | 1 |
| `outlinerClumpLocks` | 700 | function |  | 5 |
| `handleOutlinerClumpDrop` | 704 | function |  | 2 |
| `createOutlinerClump` | 727 | function |  | 1 |
| `proceduralParentOutlineVisible` | 809 | function |  | 1 |
| `syncProceduralParentVisibility` | 816 | function |  | 3 |
| `syncProceduralAccessoryEditControls` | 825 | function |  | 2 |
| `setProceduralDrawExperimentalEnabled` | 864 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 879 | function |  | 1 |
| `updateSelectedProceduralAccessories` | 885 | function |  | 1 |

## modules/geometry/compound-strand.js（159 行）

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
| `normalizeCompoundBridgeZippers` | 132 | function | export | 3 |
| `compoundBridgeSegmentCounts` | 141 | function | export | 1 |
| `compoundControllerWidthScales` | 149 | function | export | 1 |

## modules/geometry/curve-lattice.js（102 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `flatCurveLatticePointData` | 11 | function | export | 1 |
| `interpolatePoint` | 37 | function |  | 5 |
| `resampleCurveLatticePointData` | 45 | function | export | 1 |
| `resampleCurveLatticeLineData` | 79 | function | export | 1 |
| `curveLatticeLoopPointIndices` | 90 | function | export | 1 |

## modules/geometry/curve-math.js（1428 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 2 | function |  | 58 |
| `lerp` | 6 | function |  | 37 |
| `clumpMemberGuideParameter` | 10 | function | export | 1 |
| `relaxAngleValue` | 16 | function | export | 1 |
| `angularDelta` | 18 | arrow |  | 3 |
| `curvedRelaxPositionTarget` | 32 | function | export | 1 |
| `axisTarget` | 44 | arrow |  | 3 |
| `smoothstep` | 63 | function |  | 4 |
| `legacyTaperCurve` | 68 | function | export | 2 |
| `normalizeTaperCurve` | 81 | function | export | 3 |
| `normalizeEnvelopeCurve` | 93 | function | export | 3 |
| `smoothTaperTangents` | 109 | function | export | 2 |
| `sampleTaperCurve` | 129 | function | export | 16 |
| `remapEnvelopeCurveRange` | 153 | function | export | 1 |
| `interpolationAt` | 165 | arrow |  | 2 |
| `twistRateUnitsFromDegrees` | 199 | function | export | 1 |
| `twistRateDegreesFromUnits` | 203 | function | export | 1 |
| `sampleIntegratedEnvelopeCurve` | 207 | function | export | 1 |
| `sampleAsymmetricTaperCurve` | 235 | function | export | 1 |
| `mirroredAsymmetricTaperCurves` | 257 | function | export | 1 |
| `cloneCurve` | 258 | arrow |  | 2 |
| `profileTopologyCenterWeight` | 267 | function | export | 1 |
| `panelTipCurveParameter` | 277 | function | export | 1 |
| `panelTipLoopParameters` | 296 | function | export | 1 |
| `uniformCurveParameters` | 322 | function | export | 2 |
| `eightWayScreenDelta` | 326 | function | export | 1 |
| `symmetricClosedCurveParameters` | 341 | function | export | 1 |
| `wrap` | 347 | arrow |  | 4 |
| `curveRebuildParameters` | 361 | function | export | 1 |
| `pointDistance` | 387 | function |  | 4 |
| `interpolatePoint` | 395 | function |  | 2 |
| `resamplePolylinePointData` | 403 | function | export | 8 |
| `polylineMidpointPointData` | 444 | function | export | 3 |
| `blendRelativePolylinePointData` | 448 | function | export | 1 |
| `normalizedPointData` | 465 | function |  | 17 |
| `blendDirectionPointData` | 474 | function | export | 1 |
| `rotatePointDataBetweenNormals` | 485 | function |  | 5 |
| `tangentDirectionPointData` | 525 | function |  | 3 |
| `rotatePointDataAroundAxis` | 539 | function |  | 3 |
| `blendSurfaceOrientedPolylinePointData` | 557 | function | export | 1 |
| `proximityCurveBlendAmount` | 628 | function | export | 2 |
| `evenlySpacedInteriorAmounts` | 635 | function | export | 1 |
| `surfaceArcBlendAmount` | 643 | function | export | 1 |
| `direction` | 645 | arrow |  | 3 |
| `surfaceArcPolylinePointData` | 673 | function | export | 1 |
| `relative` | 681 | arrow |  | 2 |
| `horizontalCircleThroughPointData` | 748 | function | export | 2 |
| `horizontalCirclePointData` | 791 | function | export | 2 |
| `rootCorrectionFalloff` | 802 | function | export | 1 |
| `cylindricalArcPointData` | 811 | function | export | 2 |
| `truncatePolylinePointDataAtY` | 818 | function |  | 3 |
| `lowestSharedHorizontalPolylinePointData` | 863 | function | export | 2 |
| `minimumY` | 867 | arrow |  | 2 |
| `blendCylindricalPolylinePointData` | 885 | function | export | 1 |
| `blendSampleArrays` | 907 | function | export | 1 |
| `blendTaperCurves` | 923 | function | export | 1 |
| `blendEnvelopeCurves` | 940 | function | export | 1 |
| `curvePointRemovalPlan` | 957 | function | export | 1 |
| `curvePointInsertionPlan` | 986 | function | export | 1 |
| `adaptiveCurveParameters` | 1007 | function | export | 1 |
| `sampleProfile` | 1030 | arrow |  | 3 |
| `weightedParameter` | 1103 | arrow |  | 1 |
| `twistCurveDensityDetail` | 1138 | function | export | 1 |
| `twistCurveDisplayRange` | 1166 | function | export | 1 |
| `twistCurveHandleDistancePerDegree` | 1175 | function | export | 1 |
| `sampleArray` | 1181 | function | export | 3 |
| `sampleScale` | 1190 | function | export | 1 |
| `upperProfileArcIndices` | 1199 | function | export | 1 |
| `cyclicPath` | 1217 | arrow |  | 2 |
| `averageHeight` | 1228 | arrow |  | 2 |
| `sweepCurvatureResponse` | 1237 | function | export | 1 |
| `smoothSweepChains` | 1304 | function | export | 1 |
| `weightAt` | 1314 | arrow |  | 1 |
| `smoothSweepFrames` | 1361 | function | export | 1 |
| `vectorAt` | 1367 | arrow |  | 4 |
| `writeBack` | 1371 | arrow |  | 3 |
| `add` | 1381 | arrow |  | 2 |
| `subtract` | 1382 | arrow |  | 1 |
| `scale` | 1383 | arrow |  | 2 |
| `dot` | 1384 | arrow |  | 3 |
| `cross` | 1385 | arrow |  | 1 |

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

## modules/geometry/draw-flow.js（1456 行）

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
| `continueFromTipEnabled` | 787 | function |  | 2 |
| `selectedTipContinuationLock` | 793 | function |  | 2 |
| `beginDrawStrandStroke` | 806 | function |  | 1 |
| `beginDrawFreePlane` | 936 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 950 | function |  | 2 |
| `updateDrawStrandStroke` | 975 | function |  | 1 |
| `createDrawnLock` | 1021 | function |  | 2 |
| `setting` | 1025 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 1094 | function |  | 4 |
| `createDrawnBraid` | 1102 | function |  | 2 |
| `createDrawnStrand` | 1159 | function |  | 2 |
| `createDrawnPanel` | 1286 | function |  | 2 |
| `extendDrawnStrand` | 1338 | function |  | 2 |
| `finishDrawStrandStroke` | 1371 | function |  | 1 |

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

## modules/geometry/hair-shell.js（167 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `vector` | 1 | function |  | 8 |
| `add` | 9 | function |  | 7 |
| `subtract` | 13 | function |  | 7 |
| `scale` | 17 | function |  | 11 |
| `dot` | 21 | function |  | 4 |
| `cross` | 25 | function |  | 5 |
| `normalize` | 33 | function |  | 7 |
| `average` | 38 | function |  | 2 |
| `rotateBetween` | 42 | function |  | 2 |
| `hairShellFaceCenter` | 62 | function | export | 2 |
| `hairShellFaceNormal` | 66 | function | export | 2 |
| `hairShellFacesShareEdge` | 73 | function | export | 2 |
| `canExtrudeHairShellFace` | 79 | function | export | 1 |
| `sampledCurvePoints` | 88 | function |  | 2 |
| `buildHairShellTopology` | 112 | function | export | 1 |

## modules/geometry/leaf-weights.js（33 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `leafWeightAt` | 10 | function | export | 3 |
| `leafIndexAt` | 20 | function | export | 1 |
| `leafWeightValueAt` | 25 | function | export | 1 |
| `leafWeightsValid` | 30 | function | export | 1 |

## modules/geometry/mesh-smooth.js（51 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `smoothMeshVertices` | 3 | function | export | 1 |

## modules/geometry/panel-tip-strand.js（1106 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `tipChainPointsAsVectors` | 38 | function |  | 4 |
| `createPanelTipStrandApi` | 42 | function | export | 2 |
| `smoothCoincidentPanelNormals` | 49 | function |  | 2 |
| `weldPanelGeometryData` | 85 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 140 | function |  | 2 |
| `surfacePanelPoint` | 155 | function |  | 2 |
| `splitForkT` | 178 | function |  | 1 |
| `tipWidthSideForkT` | 189 | function |  | 13 |
| `tipSegmentForkAt` | 194 | function |  | 3 |
| `tipSegmentWeightAt` | 211 | function |  | 2 |
| `tipSegmentBlendAt` | 218 | function |  | 2 |
| `tipWidthCommonForkT` | 230 | function |  | 1 |
| `tipWidthGridTs` | 240 | function |  | 6 |
| `tipWidthSideExposesT` | 251 | function |  | 2 |
| `tipWidthSideControlTs` | 263 | function |  | 1 |
| `tipWidthRecordsOppositeFork` | 275 | function |  | 1 |
| `tipWidthResetCurve` | 285 | function |  | 1 |
| `tipWidthSpreadGap` | 299 | function |  | 4 |
| `tipWidthMultiplierAt` | 316 | function |  | 8 |
| `tipPanelWidthAt` | 358 | function |  | 6 |
| `buildTipWidthCurve` | 364 | function |  | 5 |
| `setTipWidthCurveValue` | 384 | function |  | 1 |
| `tipPanelFrameAt` | 406 | function |  | 4 |
| `tipMainSectionPoint` | 440 | function |  | 4 |
| `tipOffsetSampleT` | 488 | function |  | 2 |
| `tipSurfaceFrameAt` | 500 | function |  | 3 |
| `tipChainFrameAt` | 532 | function |  | 2 |
| `tipWidthEdgePosition` | 549 | function |  | 3 |
| `tipWidthEdgePoints` | 580 | function |  | 1 |
| `tipWidthControlPlacement` | 595 | function |  | 1 |
| `tipHighlightMaterial` | 618 | function |  | 2 |
| `updateTipHighlight` | 640 | function |  | 1 |
| `splitTipForSegment` | 704 | function |  | 3 |
| `restPointAt` | 717 | arrow |  | 0 |
| `createPanelStrandGeometry` | 722 | function |  | 1 |
| `segmentWeightAt` | 754 | arrow |  | 1 |
| `segmentBlendAt` | 755 | arrow |  | 1 |
| `addQuad` | 773 | arrow |  | 6 |
| `near` | 777 | arrow |  | 6 |
| `panelWidthAt` | 807 | arrow |  | 3 |
| `panelThicknessAt` | 812 | arrow |  | 3 |
| `panelFrameAt` | 821 | arrow |  | 1 |
| `rawPanelPoint` | 841 | arrow |  | 1 |
| `panelPoint` | 875 | arrow |  | 3 |
| `addPatch` | 885 | arrow |  | 1 |
| `uStart` | 1024 | arrow |  | 1 |
| `uEnd` | 1027 | arrow |  | 1 |

## modules/geometry/placement.js（482 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createPlacementApi` | 7 | function | export | 2 |
| `createPlacedStrand` | 22 | function |  | 2 |
| `placedPointCount` | 86 | function |  | 3 |
| `createPlacedPoints` | 90 | function |  | 3 |
| `pushPointOutsideHead` | 109 | function |  | 2 |
| `resizePlacedStrand` | 141 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 158 | function |  | 3 |
| `beginPlaceEdit` | 163 | function |  | 2 |
| `updatePlaceEdit` | 181 | function |  | 1 |
| `updatePlacementLength` | 195 | function |  | 3 |
| `updatePlacementOrientation` | 205 | function |  | 3 |
| `endPlaceEdit` | 223 | function |  | 1 |
| `confirmPendingPlacedStrand` | 238 | function |  | 1 |
| `pendingPlacedLock` | 248 | function |  | 1 |
| `beginPlacementPointer` | 252 | function |  | 1 |
| `finishPlacementPointer` | 262 | function |  | 1 |
| `confirmPlacementStep` | 286 | function |  | 2 |
| `finishPlacementFlow` | 309 | function |  | 3 |
| `updatePlacementStatus` | 322 | function |  | 7 |

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

## modules/geometry/procedural-duplicate.js（805 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProceduralDuplicateApi` | 28 | function | export | 2 |
| `duplicatePlacementTarget` | 50 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 77 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 81 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 91 | function |  | 3 |
| `updateProceduralDuplicateSpacingNote` | 96 | function |  | 2 |
| `clearProceduralDuplicatePreview` | 108 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 119 | function |  | 2 |
| `openProceduralDuplicateDialog` | 127 | function |  | 1 |
| `proceduralDuplicateCopySnapshot` | 144 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 165 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 176 | function |  | 7 |
| `proceduralDuplicateReferencePoints` | 182 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 188 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 221 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 376 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 478 | function |  | 2 |
| `confirmProceduralDuplicatePreview` | 519 | function |  | 1 |
| `updateDuplicatePlacement` | 547 | function |  | 2 |
| `beginDuplicatePlacement` | 611 | function |  | 2 |
| `beginProceduralDuplicatePlacement` | 675 | function |  | 2 |
| `confirmDuplicatePlacement` | 716 | function |  | 1 |
| `cancelDuplicatePlacement` | 754 | function |  | 2 |

## modules/geometry/radial-layout.js（253 行）

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
| `positiveAngleDifference` | 170 | function |  | 3 |
| `radialOptionSector` | 175 | function | export | 1 |
| `layoutRadialSubmenuSlots` | 208 | function | export | 1 |
| `radialSubmenuTravelAngle` | 241 | function | export | 1 |

## modules/geometry/radial-menu.js（1001 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createRadialMenuApi` | 24 | function | export | 2 |
| `hideStrandRadialMenu` | 38 | function |  | 3 |
| `ensureRadialButtonCapacity` | 52 | function |  | 4 |
| `radialButtonDimensions` | 65 | function |  | 3 |
| `radialMenuDimensionsForKind` | 74 | function |  | 2 |
| `applyRadialMenuDimensions` | 84 | function |  | 3 |
| `applyRadialSectorVariables` | 90 | function |  | 4 |
| `configureRadialSubmenuIndicator` | 123 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 144 | function |  | 2 |
| `selectionSetRadialMenuOption` | 161 | function |  | 4 |
| `selectedMirrorRadialOptions` | 170 | function |  | 3 |
| `strandVisibilityRadialOptions` | 192 | function |  | 5 |
| `clumpMirrorRadialOptions` | 210 | function |  | 2 |
| `contextualRadialOptions` | 217 | function |  | 3 |
| `sharedRadialFrameDimensions` | 346 | function |  | 3 |
| `layoutContextualRadialOptions` | 350 | function |  | 2 |
| `renderRadialActionList` | 374 | function |  | 5 |
| `radialListOptionAtPointer` | 392 | function |  | 3 |
| `syncRadialListHighlight` | 414 | function |  | 3 |
| `configureContextualRadialMenu` | 420 | function |  | 2 |
| `beginStrandRadialGesture` | 481 | function |  | 1 |
| `closeStrandRadialSubmenu` | 516 | function |  | 3 |
| `openStrandRadialSubmenu` | 530 | function |  | 3 |
| `updateStrandRadialGesture` | 594 | function |  | 1 |
| `performStrandRadialAction` | 657 | function |  | 2 |
| `finishStrandRadialGesture` | 760 | function |  | 1 |
| `cancelStrandRadialGesture` | 770 | function |  | 2 |
| `blockPointerDuringStrandRadialGesture` | 777 | function |  | 1 |
| `toolRadialOptions` | 783 | function |  | 2 |
| `hideToolRadialMenu` | 808 | function |  | 3 |
| `beginToolRadialGesture` | 821 | function |  | 2 |
| `beginToolShortcutPress` | 862 | function |  | 1 |
| `finishToolShortcutPress` | 877 | function |  | 1 |
| `cancelToolShortcutPress` | 886 | function |  | 2 |
| `setRadialMenusEnabled` | 894 | function |  | 1 |
| `updateToolRadialGesture` | 907 | function |  | 1 |
| `performToolRadialAction` | 936 | function |  | 2 |
| `finishToolRadialGesture` | 946 | function |  | 2 |
| `cancelToolRadialGesture` | 955 | function |  | 3 |

## modules/geometry/sculpt-geometry.js（928 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSculptGeometryApi` | 23 | function | export | 2 |
| `setSculptBrushMaterialClipping` | 40 | function |  | 1 |
| `sculptBrushDebugCurveVisible` | 47 | function |  | 2 |
| `refreshSculptBrushDebugView` | 59 | function |  | 2 |
| `refreshSculptBrushDebugAfterStateRestore` | 64 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 70 | function |  | 3 |
| `scheduleSculptBrushGeometryUpdates` | 87 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 95 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 101 | function |  | 3 |
| `editableStrandWidth` | 123 | function |  | 1 |
| `editableStrandWidthBounds` | 135 | function |  | 2 |
| `applyEditableStrandWidth` | 141 | function |  | 1 |
| `viewportPixelPoint` | 177 | function |  | 1 |
| `syncSculptBrushControls` | 185 | function |  | 3 |
| `syncSculptBrushStrengthForActiveTool` | 200 | function |  | 1 |
| `updateActiveSculptBrushStrength` | 208 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 216 | function |  | 1 |
| `sculptBrushPlaneOffset` | 222 | function |  | 5 |
| `setSculptBrushCursorVisible` | 226 | function |  | 4 |
| `updateSculptBrushCursor` | 233 | function |  | 2 |
| `sculptBrushMirrorUpdateLock` | 255 | function |  | 4 |
| `sculptBrushEditableLock` | 262 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 272 | function |  | 5 |
| `sculptBrushLockViable` | 278 | function |  | 5 |
| `sculptBrushUnits` | 289 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 327 | function |  | 2 |
| `sculptBrushPointWeight` | 377 | function |  | 5 |
| `sculptBrushWorldDelta` | 387 | function |  | 4 |
| `syncSculptBrushMirrorPoints` | 396 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 422 | function |  | 2 |
| `beginSculptMoveStroke` | 480 | function |  | 1 |
| `applySculptMoveStrokeSample` | 546 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 818 | function |  | 3 |
| `updateSculptMoveStroke` | 827 | function |  | 1 |
| `finishSculptMoveStroke` | 843 | function |  | 1 |

## modules/geometry/strand-constraints.js（120 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 1 | function |  | 3 |
| `solvePulledStrand` | 5 | function | export | 1 |

## modules/geometry/strand-geometry.js（1313 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandGeometryApi` | 35 | function | export | 2 |
| `clipStrandProfilePolygon` | 44 | function |  | 3 |
| `inside` | 45 | arrow |  | 2 |
| `clipStrandProfileBand` | 71 | function |  | 2 |
| `pushOrientedTriangle` | 78 | function |  | 7 |
| `orientedQuadFace` | 87 | function |  | 2 |
| `createSplitStrandGeometry` | 95 | function |  | 2 |
| `smoothTubeVertices` | 313 | arrow |  | 1 |
| `restPointAt` | 351 | arrow |  | 0 |
| `fusedIndexAt` | 449 | arrow |  | 0 |
| `createHairCardGeometry` | 527 | function |  | 2 |
| `createPolyGeometry` | 690 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 717 | function |  | 4 |
| `createCompoundStrandGeometry` | 793 | function |  | 2 |
| `vertexIndex` | 878 | arrow |  | 6 |
| `proceduralBranchGeometryLock` | 1058 | function |  | 2 |
| `createHairGeometry` | 1089 | function |  | 1 |
| `createBaseHairGeometry` | 1141 | function |  | 3 |

## modules/geometry/strand-sweep.js（157 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandSweepApi` | 10 | function | export | 1 |
| `sweepSide` | 13 | function |  | 1 |

## modules/geometry/strand-tip-width.js（425 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `strandSplitBandXs` | 36 | function | export | 2 |
| `strandTubeBandExtents` | 46 | function | export | 2 |
| `strandTubeSignedCoordinate` | 74 | function | export | 4 |
| `strandTubeForkT` | 82 | function | export | 3 |
| `strandTubeSideForkT` | 90 | function | export | 10 |
| `usesBoneCurveAt` | 98 | function |  | 2 |
| `boneCurveOverride` | 107 | function |  | 2 |
| `tipWidthEligibleForkT` | 121 | function |  | 3 |
| `strandTipWidthOverrideAt` | 138 | function | export | 3 |
| `strandTipWidthProfileOverride` | 157 | function | export | 2 |
| `strandTipWidthMultiplierAt` | 186 | function | export | 1 |
| `strandTubeGridTs` | 218 | function | export | 6 |
| `strandTubeSideControlTs` | 227 | function | export | 1 |
| `strandTipWidthResetCurve` | 235 | function | export | 1 |
| `buildStrandTipWidthCurve` | 247 | function | export | 5 |
| `setStrandTipWidthCurveValue` | 263 | function | export | 1 |
| `profileTopZAt` | 307 | function |  | 2 |
| `strandTipWidthEdgePosition` | 326 | function | export | 3 |
| `toWorld` | 378 | arrow |  | 2 |
| `strandTipWidthControlPlacement` | 394 | function | export | 1 |
| `strandTipWidthEdgePoints` | 406 | function | export | 1 |

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

## modules/geometry/taper-editor.js（1140 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createTaperEditorApi` | 31 | function | export | 2 |
| `activeStrandShapeTarget` | 47 | function |  | 2 |
| `activeTaperTarget` | 50 | function |  | 14 |
| `activeTaperCurve` | 80 | function |  | 9 |
| `ensureSecondaryTaperCurve` | 90 | function |  | 5 |
| `taperSamples` | 99 | function |  | 7 |
| `taperCurvesActuallyDiffer` | 110 | function |  | 2 |
| `taperDisplayAsymmetric` | 124 | function |  | 4 |
| `ensureAsymmetricTaperPreviewElements` | 132 | function |  | 2 |
| `renderTaperPreview` | 153 | function |  | 6 |
| `segmentCurveTarget` | 193 | function |  | 2 |
| `segmentCurveTargetForWrite` | 214 | function |  | 1 |
| `selectedSegmentIndex` | 228 | function |  | 1 |
| `shapeTargetForSelect` | 231 | function |  | 1 |
| `taperPointToCanvas` | 236 | function |  | 4 |
| `canvasToTaperPoint` | 252 | function |  | 1 |
| `clearTaperMeshPoints` | 286 | function |  | 2 |
| `taperMeshPointFrame` | 295 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 304 | function |  | 3 |
| `addTaperMeshPointsForCurve` | 340 | function |  | 2 |
| `updateTaperMeshPoints` | 411 | function |  | 4 |
| `setTaperMeshPointsVisible` | 417 | function |  | 3 |
| `renderTaperCurveEditor` | 434 | function |  | 9 |
| `sideOfCurve` | 469 | arrow |  | 4 |
| `tipSideForkFor` | 470 | arrow |  | 1 |
| `tipDraggablePositions` | 495 | arrow |  | 1 |
| `tipPointLocked` | 514 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 590 | function |  | 4 |
| `retargetOpenTaperCurveEditor` | 603 | function |  | 1 |
| `retargetOpenSegmentTaperEditor` | 630 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 651 | function |  | 2 |
| `scheduleTaperCurveEdit` | 681 | function |  | 2 |
| `flushScheduledTaperCurveEdit` | 689 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 699 | function |  | 2 |
| `applyTaperCurveEdit` | 706 | function |  | 5 |
| `openTaperCurveEditor` | 843 | function |  | 2 |
| `closeTaperCurveEditor` | 887 | function |  | 4 |
| `retargetFloatingStrandEditors` | 899 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 913 | function |  | 2 |
| `finishTaperCurveDrag` | 924 | function |  | 1 |
| `beginTaperMeshPointDrag` | 931 | function |  | 1 |
| `updateTaperMeshPointDrag` | 1011 | function |  | 1 |
| `finishTaperMeshPointDrag` | 1065 | function |  | 5 |
| `updateSelectedTaperPoint` | 1088 | function |  | 1 |

## modules/geometry/tip-sub-bone.js（181 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `isValidTip` | 9 | function |  | 2 |
| `pointToData` | 13 | function |  | 11 |
| `toVector3` | 17 | function |  | 3 |
| `cloneTipChain` | 23 | function | export | 2 |
| `materializeTipChain` | 37 | function | export | 1 |
| `tipChainFrameAt` | 63 | function | export | 1 |
| `firstExposedTipChainIndex` | 97 | function | export | 1 |
| `tipWeightAt` | 105 | function | export | 1 |
| `tipCaptureWeightAt` | 112 | function | export | 1 |
| `sweepRingCentroids` | 119 | function | export | 1 |
| `sampleCenterlinePoint` | 140 | function | export | 1 |
| `sampleTipPosition` | 161 | function | export | 1 |
| `mirrorTipChain` | 171 | function | export | 1 |

## modules/geometry/tip-width-curve.js（209 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `segmentZipperHeights` | 21 | function | export | 1 |
| `tipWidthSideForkFromHeights` | 32 | function | export | 1 |
| `tipWidthCommonForkFromHeights` | 41 | function | export | 2 |
| `tipWidthControlTs` | 47 | function | export | 2 |
| `tipWidthGridFromHeights` | 61 | function | export | 1 |
| `tipWidthSideExposesTAt` | 70 | function | export | 2 |
| `tipWidthSideControlTsFrom` | 83 | function | export | 4 |
| `tipWidthRecordsOppositeForkFrom` | 92 | function | export | 3 |
| `createCurvePoints` | 98 | function |  | 3 |
| `addPoint` | 100 | arrow |  | 8 |
| `tipWidthResetCurveFrom` | 115 | function | export | 1 |
| `setTipWidthCurveValueFrom` | 140 | function | export | 1 |
| `buildTipWidthCurveFrom` | 170 | function | export | 1 |

## modules/geometry/topology.js（90 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `parseObjFaceVertexCounts` | 1 | function | export | 1 |
| `fanTriangleEdgeMasks` | 10 | function | export | 1 |
| `triangleAreaSquared` | 22 | function |  | 3 |
| `quadCellTopology` | 38 | function | export | 1 |
| `triangleEdgeMasksFromFaces` | 66 | function | export | 1 |
| `edgeKey` | 69 | arrow |  | 4 |

## modules/geometry/uv-inspector.js（43 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `uvCoordinateBounds` | 1 | function | export | 1 |
| `uvViewTransform` | 23 | function | export | 1 |

## modules/geometry/wind-preview.js（320 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `axis` | 24 | function |  | 7 |
| `num` | 30 | function |  | 10 |
| `mulberry32` | 38 | function | export | 5 |
| `perStrandWind` | 58 | function | export | 1 |
| `fbm4` | 80 | function | export | 2 |
| `windAngleAt` | 104 | function | export | 3 |
| `windAxis` | 144 | function | export | 3 |
| `windRowQuats` | 165 | function | export | 1 |
| `slerpQuat` | 201 | function | export | 2 |
| `rotateVec3` | 230 | function | export | 4 |
| `deformVertexData` | 256 | function | export | 1 |

## modules/io/bridge-export.js（353 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `sourceMap` | 5 | function |  | 5 |
| `captureAt` | 16 | function |  | 2 |
| `normalizedCapture` | 23 | function | export | 4 |
| `inheritedCapture` | 60 | function |  | 2 |
| `bridgeGraph` | 75 | function |  | 2 |
| `ensure` | 77 | arrow |  | 3 |
| `add` | 81 | arrow |  | 5 |
| `harmonicChildWeight` | 101 | function |  | 2 |
| `orderedRecords` | 135 | function |  | 3 |
| `visit` | 145 | arrow |  | 4 |
| `applyBridgeBoneCapture` | 158 | function | export | 1 |
| `parentCaptureFor` | 181 | arrow |  | 1 |
| `unionFind` | 209 | function |  | 2 |
| `find` | 211 | arrow |  | 3 |
| `tupleAt` | 222 | function |  | 4 |
| `mergedFamily` | 228 | function |  | 3 |
| `allHave` | 252 | arrow |  | 7 |
| `mergeBranchFamilyMeshes` | 324 | function | export | 1 |

## modules/io/creation-presets.js（234 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createCreationPresetsApi` | 6 | function | export | 2 |
| `presetNumber` | 33 | function |  | 23 |
| `clonePresetShape` | 38 | function |  | 7 |
| `creationPresetSnapshot` | 47 | function |  | 3 |
| `creationToolSettingsSnapshot` | 96 | function |  | 2 |
| `normalizeCreationPresetLibrary` | 123 | function |  | 2 |
| `loadCustomCreationPresets` | 130 | function |  | 1 |
| `saveCustomCreationPresets` | 140 | function |  | 2 |
| `migrateLegacyClumpPresets` | 148 | function |  | 1 |
| `applyCreationPresetSnapshot` | 184 | function |  | 2 |
| `applyCustomCreationPreset` | 201 | function |  | 1 |

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

## modules/io/io-tail.js（624 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createIoTailApi` | 21 | function | export | 2 |
| `rootAttachmentFrame` | 36 | function |  | 3 |
| `rootAttachmentLocalFrame` | 48 | function |  | 4 |
| `resolveRootAttachment` | 66 | function |  | 4 |
| `curvePointsToRootLocal` | 106 | function |  | 2 |
| `curvePointsFromRootLocal` | 118 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 126 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 142 | function |  | 1 |
| `createRootAttachment` | 173 | function |  | 3 |
| `syncRootAttachmentMetadata` | 203 | function |  | 1 |
| `rootAttachmentToData` | 230 | function |  | 1 |
| `rootAttachmentFromData` | 258 | function |  | 1 |
| `downloadPreferencesAndPresets` | 297 | function |  | 1 |
| `importedBooleanPreference` | 336 | function |  | 12 |
| `loadPreferencesAndPresets` | 340 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 429 | function |  | 1 |
| `openHairProjectFile` | 443 | function |  | 2 |
| `dragContainsApplicationFile` | 504 | function |  | 1 |
| `safelyRememberRecentProject` | 513 | function |  | 2 |
| `renderRecentProjectsMenu` | 522 | function |  | 2 |
| `openDroppedApplicationFilePrompt` | 554 | function |  | 2 |
| `closeDroppedApplicationFilePrompt` | 579 | function |  | 2 |
| `confirmDroppedApplicationFile` | 583 | function |  | 1 |

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

## modules/io/project-files.js（1329 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProjectSaveApi` | 18 | function | export | 2 |
| `downloadTextFile` | 66 | function |  | 4 |
| `downloadProjectFile` | 78 | function |  | 2 |
| `bufferAttributeTuples` | 82 | function |  | 6 |
| `flatTuples` | 89 | function |  | 6 |
| `setProjectSaveButtonsDisabled` | 98 | function |  | 5 |
| `buildHairProjectFile` | 104 | function |  | 4 |
| `kindForLock` | 121 | function |  | 4 |
| `childSeamCol` | 132 | function |  | 3 |
| `flatPanelMesh` | 139 | function |  | 2 |
| `buildUnfoldedMeshes` | 175 | function |  | 3 |
| `childVLength` | 206 | arrow |  | 0 |
| `childGridRows` | 219 | arrow |  | 0 |
| `rPosOf` | 265 | arrow |  | 2 |
| `packUnfoldedUv` | 335 | function |  | 2 |
| `descendantsOf` | 342 | arrow |  | 1 |
| `visit` | 345 | arrow |  | 2 |
| `buildHairObj` | 381 | function |  | 3 |
| `buildHairUsda` | 450 | function |  | 3 |
| `jointNameOf` | 467 | arrow |  | 15 |
| `rowsFor` | 698 | arrow |  | 3 |
| `rowTAt` | 711 | arrow |  | 4 |
| `smoothMainPairIndices` | 716 | arrow |  | 3 |
| `tipIdxFor` | 725 | arrow |  | 2 |
| `clampSplit` | 738 | arrow |  | 2 |
| `bindBySweepRow` | 757 | arrow |  | 2 |
| `openFileActionDialog` | 990 | function |  | 4 |
| `performFileAction` | 1047 | function |  | 3 |
| `saveHairProjectFile` | 1120 | function |  | 2 |
| `saveHairProjectQuickly` | 1150 | function |  | 1 |
| `exportHairObj` | 1178 | function |  | 1 |
| `exportHairUsda` | 1187 | function |  | 1 |
| `exportHairProjectQuickly` | 1191 | function |  | 1 |
| `writeExportThroughFileSystem` | 1246 | function |  | 3 |

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

## modules/io/recovery-storage.js（85 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizeAutosaveInterval` | 7 | function | export | 1 |
| `normalizeRecoveryRecord` | 14 | function | export | 3 |
| `createRecoveryRecord` | 30 | function | export | 2 |
| `openRecoveryDatabase` | 41 | function |  | 2 |
| `runRecoveryTransaction` | 55 | function |  | 4 |
| `readRecoverySnapshot` | 71 | function | export | 1 |
| `writeRecoverySnapshot` | 76 | function | export | 1 |
| `clearRecoverySnapshot` | 82 | function | export | 1 |

## modules/io/recovery-store.js（23 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createRecoveryStore` | 7 | function | export | 1 |

## modules/io/shape-presets.js（128 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneShapePresetValue` | 3 | function | export | 9 |
| `createShapePresetsApi` | 7 | function | export | 2 |
| `taperAsymmetryKey` | 15 | function |  | 5 |
| `taperSecondaryKey` | 19 | function |  | 5 |
| `shapeValuesMatch` | 23 | function |  | 1 |
| `shapePresetLabel` | 31 | function |  | 1 |
| `loadCustomShapePresets` | 36 | function |  | 1 |
| `saveCustomShapePresets` | 47 | function |  | 1 |
| `applyShapePreset` | 55 | function |  | 1 |

## modules/io/usda-export.js（794 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `finiteNumber` | 6 | function |  | 20 |
| `formatNumber` | 11 | function |  | 9 |
| `quoteString` | 17 | function |  | 4 |
| `usdIdentifier` | 24 | function | export | 5 |
| `uniqueIdentifier` | 34 | function |  | 4 |
| `tuple` | 46 | function |  | 1 |
| `tupleArray` | 50 | function |  | 5 |
| `numberArray` | 54 | function |  | 7 |
| `flatIntArray` | 59 | function |  | 2 |
| `floatArray` | 69 | function |  | 2 |
| `metadataLines` | 78 | function |  | 3 |
| `primvarLines` | 85 | function |  | 4 |
| `hasSkinData` | 100 | function |  | 3 |
| `meshBlock` | 107 | function |  | 3 |
| `curveBlock` | 201 | function |  | 2 |
| `pointTuple` | 219 | function |  | 1 |
| `quatToMat3` | 225 | function | export | 1 |
| `axesToMat3` | 240 | function | export | 3 |
| `component` | 242 | arrow |  | 9 |
| `mat3ToMat4` | 254 | function |  | 3 |
| `translationMatrix` | 265 | function |  | 3 |
| `matrixMultiply` | 275 | function |  | 3 |
| `mat3Transpose` | 291 | function |  | 2 |
| `mat3Multiply` | 297 | function |  | 2 |
| `rowVecTimesMat3` | 315 | function |  | 2 |
| `orientOf` | 326 | function |  | 4 |
| `matrixTuple` | 331 | function |  | 3 |
| `skeletonBlock` | 353 | function |  | 2 |
| `jointId` | 357 | arrow |  | 2 |
| `fullPathOf` | 361 | arrow |  | 2 |
| `worldOf` | 371 | arrow |  | 6 |
| `localOf` | 384 | arrow |  | 1 |
| `smoothMainPair` | 417 | function | export | 1 |
| `clamp` | 418 | arrow |  | 14 |
| `tipChainNearestIndex` | 430 | function | export | 1 |
| `exportAnimeHairUsda` | 440 | function | export | 1 |
| `strandSplitsForExport` | 524 | function |  | 3 |
| `strandForkTForTube` | 539 | function |  | 3 |
| `strandDirectionForTube` | 549 | function | export | 3 |
| `splitParentMainIndex` | 560 | function | export | 3 |
| `splitBoneLayout` | 572 | function | export | 1 |
| `splitChainLayout` | 646 | function | export | 1 |
| `smoothstep` | 693 | arrow |  | 1 |
| `restPointAt` | 697 | arrow |  | 0 |
| `cross` | 735 | arrow |  | 2 |
| `bridgeRootParentName` | 782 | function | export | 1 |

## modules/io/uv-pack-async.js（503 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `makeLCG` | 42 | function |  | 2 |
| `shuffle` | 49 | function |  | 2 |
| `triangleArea` | 58 | function |  | 2 |
| `meshSurfaceArea` | 70 | function |  | 2 |
| `uvBounds` | 91 | function |  | 3 |
| `fallbackPreparePack` | 118 | function |  | 1 |
| `fallbackApplyPackResult` | 161 | function |  | 2 |
| `getContract` | 246 | function |  | 2 |
| `deepClone` | 259 | function |  | 3 |
| `copyBackFamilies` | 271 | function |  | 2 |
| `createPackAsync` | 294 | function | export | 3 |
| `buildPool` | 302 | function |  | 2 |
| `failPool` | 309 | arrow |  | 4 |
| `pump` | 321 | arrow |  | 2 |
| `bind` | 329 | arrow |  | 1 |
| `onMessage` | 330 | arrow |  | 1 |
| `onError` | 339 | arrow |  | 1 |
| `request` | 363 | arrow |  | 1 |
| `dispose` | 376 | arrow |  | 4 |
| `ensurePool` | 380 | function |  | 2 |
| `packFamiliesAsync` | 393 | function |  | 1 |
| `poolRequest` | 491 | function |  | 3 |

## modules/io/uv-pack-worker.js（116 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `decodeBoxes` | 32 | function |  | 2 |
| `fitsAt` | 42 | function |  | 3 |
| `localSampleMaxK` | 55 | function |  | 1 |
| `localRefineMaxK` | 65 | function |  | 1 |
| `handle` | 81 | function |  | 3 |
| `setupBrowser` | 103 | function |  | 2 |
| `setupNode` | 107 | function |  | 2 |

## modules/io/uv-pack.js（1060 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `makeLCG` | 16 | function |  | 2 |
| `shuffle` | 25 | function |  | 2 |
| `triangleArea` | 44 | function |  | 2 |
| `meshSurfaceArea` | 58 | function |  | 2 |
| `uvBounds` | 81 | function |  | 4 |
| `maxRectsPack` | 114 | function |  | 3 |
| `sortKey` | 123 | arrow |  | 4 |
| `splitFreeNode` | 136 | arrow |  | 1 |
| `pruneFreeList` | 149 | arrow |  | 1 |
| `commonIntervalLength` | 166 | arrow |  | 2 |
| `contactScore` | 169 | arrow |  | 1 |
| `findMaxK` | 250 | function | export | 3 |
| `fitsAt` | 253 | arrow |  | 6 |
| `spiralCells` | 298 | function |  | 2 |
| `alpacaPack` | 320 | function | export | 1 |
| `rebuildIntegral` | 325 | arrow |  | 2 |
| `regionEmpty` | 338 | arrow |  | 5 |
| `markOccupied` | 342 | arrow |  | 5 |
| `alpacaPackTurbo` | 436 | function | export | 1 |
| `makeRows` | 532 | function |  | 5 |
| `rowOverlaps` | 541 | function |  | 2 |
| `insertRowInterval` | 554 | function |  | 2 |
| `alpacaPackOccupancyCore` | 584 | function |  | 4 |
| `tryTop` | 638 | arrow |  | 2 |
| `tryRight` | 650 | arrow |  | 2 |
| `alpacaPackOccupancy` | 690 | function | export | 2 |
| `findMaxKAlpaca` | 698 | function | export | 1 |
| `alpacaFitsAt` | 738 | function |  | 3 |
| `sampleMaxK` | 755 | function | export | 5 |
| `refineMaxK` | 768 | function | export | 3 |
| `preparePack` | 788 | function | export | 2 |
| `applyPackResult` | 839 | function | export | 2 |
| `packFamilies` | 944 | function | export | 1 |

## modules/io/uv-unfold.js（666 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `gridDimensions` | 32 | function | export | 4 |
| `attributeComponent` | 50 | function |  | 22 |
| `gridUvTable` | 69 | function | export | 2 |
| `posOf` | 81 | arrow |  | 3 |
| `dist` | 86 | arrow |  | 8 |
| `gridUvAt` | 198 | function | export | 2 |
| `childUTopologyScale` | 214 | function | export | 1 |
| `unfoldHairMesh` | 330 | function | export | 1 |
| `copyCountOf` | 418 | arrow |  | 1 |
| `vForRow` | 460 | arrow |  | 3 |
| `fillVertex` | 466 | arrow |  | 6 |

## modules/material/material-state.js（115 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `normalizedGradientColor` | 24 | function |  | 3 |
| `normalizeHairGradientStops` | 30 | function | export | 2 |
| `normalizeHairMaterialDefinition` | 49 | function | export | 3 |
| `resolveHairMaterialDefinition` | 66 | function | export | 2 |
| `hairMaterialUsageCounts` | 72 | function | export | 1 |
| `hairMaterialPresetValue` | 82 | function | export | 2 |
| `normalizeHairMaterialPresetLibrary` | 100 | function | export | 1 |
| `removeHairMaterialPreset` | 111 | function | export | 1 |

## modules/material/material-ui.js（825 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createMaterialUiApi` | 34 | function | export | 2 |
| `hairMaterialPresetLibrary` | 58 | function |  | 8 |
| `hairMaterialDefinition` | 65 | function |  | 4 |
| `materialForLock` | 69 | function |  | 9 |
| `activeHairMaterialDefinition` | 73 | function |  | 16 |
| `strandDisplayColor` | 79 | function |  | 4 |
| `strandGradientTintColor` | 97 | function |  | 5 |
| `hairGradientCss` | 113 | function |  | 3 |
| `sampleHairGradientColor` | 119 | function |  | 3 |
| `syncHairGradientTexture` | 131 | function |  | 6 |
| `hairMaterialGradientActive` | 157 | function |  | 8 |
| `applyHairBaseGradient` | 161 | function |  | 2 |
| `setAnimeHairBaseColor` | 175 | function |  | 2 |
| `createAnimeAnisotropicMaterial` | 188 | function |  | 2 |
| `createHairMaterial` | 230 | function |  | 2 |
| `createStrandSelectionOutline` | 272 | function |  | 1 |
| `strandUsesDoubleSidedMaterial` | 307 | function |  | 2 |
| `applyMaterialDefinitionToLock` | 316 | function |  | 4 |
| `refreshMaterialUsers` | 347 | function |  | 3 |
| `renderHairMaterialOutliner` | 356 | function |  | 6 |
| `renderHairMaterialOptions` | 390 | function |  | 2 |
| `syncHairMaterialEditor` | 400 | function |  | 6 |
| `createProjectHairMaterial` | 430 | function |  | 1 |
| `deleteActiveHairMaterial` | 451 | function |  | 1 |
| `captureGradientInputUndo` | 470 | function |  | 3 |
| `updateHairMaterialGradientDefinition` | 476 | function |  | 6 |
| `syncHairMaterialGradientEditor` | 487 | function |  | 4 |
| `openHairMaterialGradientEditor` | 520 | function |  | 1 |
| `setActiveHairGradientStopPosition` | 526 | function |  | 4 |
| `finishHairGradientStopDrag` | 539 | function |  | 1 |
| `setupHairMaterialGradientUi` | 548 | function |  | 1 |
| `loadCustomHairMaterialPresets` | 642 | function |  | 2 |
| `saveCustomHairMaterialPresets` | 653 | function |  | 3 |
| `populateHairMaterialPresetSelect` | 661 | function |  | 5 |
| `markHairMaterialPresetCustom` | 678 | function |  | 12 |
| `openSaveHairMaterialPreset` | 685 | function |  | 1 |
| `commitHairMaterialPreset` | 699 | function |  | 2 |
| `applyHairMaterialPreset` | 716 | function |  | 2 |
| `openRemoveHairMaterialPreset` | 737 | function |  | 1 |
| `commitRemoveHairMaterialPreset` | 748 | function |  | 2 |
| `clearHairMaterialPresetPending` | 762 | function |  | 1 |
| `setupHairMaterialPresetUi` | 767 | function |  | 1 |

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

## modules/scene/reference-head.js（1568 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createReferenceHeadApi` | 34 | function | export | 2 |
| `disposeGuideModel` | 51 | function |  | 2 |
| `syncHeadTransformInputs` | 62 | function |  | 2 |
| `applyHeadTransform` | 69 | function |  | 2 |
| `resetHeadTransform` | 87 | function |  | 2 |
| `installGuideModel` | 101 | function |  | 4 |
| `loadDefaultGuideModel` | 177 | function |  | 1 |
| `frameGuideModel` | 196 | function |  | 2 |
| `setHeadReferenceTransparency` | 221 | function |  | 3 |
| `trianglePlaneIntersections` | 231 | function |  | 2 |
| `headPlaneIntersectionSegments` | 252 | function |  | 1 |
| `setHeadSetupEditing` | 278 | function |  | 1 |
| `importHeadMeshFile` | 294 | function |  | 1 |
| `importFullBodyMeshFile` | 317 | function |  | 1 |
| `headMeshes` | 341 | function |  | 2 |
| `selectedReferenceImage` | 349 | function |  | 8 |
| `normalizeReferenceCrop` | 353 | function |  | 8 |
| `referenceCropIsFull` | 361 | function |  | 2 |
| `referencePlaneFrontAxis` | 366 | function |  | 4 |
| `referencePlanePlacement` | 375 | function |  | 4 |
| `migratedReferencePlanePosition` | 390 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 410 | function |  | 3 |
| `migratedReferencePlaneRotation` | 427 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 443 | function |  | 2 |
| `snappedReferenceImageView` | 459 | function |  | 2 |
| `updateReferencePlaneVisibility` | 465 | function |  | 2 |
| `applyReferenceImageRuntime` | 481 | function |  | 11 |
| `updateReferenceSelectionVisuals` | 524 | function |  | 4 |
| `createReferenceImageRuntime` | 532 | function |  | 3 |
| `addReferenceImage` | 601 | function |  | 2 |
| `disposeReferenceImageRuntime` | 653 | function |  | 3 |
| `disposeReferenceImage` | 672 | function |  | 2 |
| `clearReferenceImages` | 676 | function |  | 1 |
| `serializeReferenceImage` | 683 | function |  | 1 |
| `setReferenceImageType` | 711 | function |  | 1 |
| `attachReferenceImageTransform` | 755 | function |  | 5 |
| `selectReferenceImage` | 769 | function |  | 7 |
| `placeReferencePlane` | 792 | function |  | 1 |
| `setReferencePlaneInFront` | 803 | function |  | 1 |
| `syncReferenceImageFromMesh` | 813 | function |  | 2 |
| `renderReferenceImagePanel` | 832 | function |  | 10 |
| `referenceOutlinerGroup` | 871 | function |  | 2 |
| `renderReferenceOutliner` | 875 | function |  | 3 |
| `setReferenceImagePanelOpen` | 992 | function |  | 3 |
| `readReferenceImageFile` | 997 | function |  | 2 |
| `isSupportedReferenceImageFile` | 1014 | function |  | 2 |
| `addReferenceImagesFromFiles` | 1021 | function |  | 1 |
| `dragContainsReferenceImage` | 1066 | function |  | 1 |
| `setReferenceImageDragActive` | 1077 | function |  | 1 |
| `referenceDropDestination` | 1085 | function |  | 1 |
| `viewportOverlayDropPosition` | 1091 | function |  | 1 |
| `setReferenceDropHover` | 1100 | function |  | 2 |
| `referencePlaneHitFromPointer` | 1118 | function |  | 1 |
| `referenceOverlayAtPointer` | 1136 | function |  | 1 |
| `referenceOverlayCornerAtPointer` | 1154 | function |  | 4 |
| `beginReferenceOverlayDrag` | 1167 | function |  | 1 |
| `updateReferenceOverlayDrag` | 1213 | function |  | 1 |
| `finishReferenceOverlayDrag` | 1263 | function |  | 1 |
| `setReferenceOverlayScaleHandleHover` | 1285 | function |  | 4 |
| `updateReferenceOverlayCursor` | 1296 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 1320 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 1329 | function |  | 2 |
| `referenceCropCursor` | 1344 | function |  | 3 |
| `updateReferenceCropHandles` | 1350 | function |  | 3 |
| `referenceCropSourcePoint` | 1371 | function |  | 2 |
| `beginReferenceCrop` | 1378 | function |  | 1 |
| `updateReferenceCrop` | 1416 | function |  | 1 |
| `finishReferenceCrop` | 1448 | function |  | 1 |
| `deleteSelectedReferenceImage` | 1466 | function |  | 1 |
| `referenceViewDisplayLabel` | 1479 | function |  | 4 |
| `requestReferenceImage` | 1489 | function |  | 1 |

## modules/sculpt/sculpt-brush.js（194 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `sculptBrushWeight` | 1 | function | export | 1 |
| `smoothSculptPointDeltas` | 13 | function | export | 1 |
| `proportionalSculptWeights` | 40 | function | export | 1 |
| `cameraFacingPlaneNormal` | 69 | function | export | 2 |
| `inflateSculptPointScale` | 82 | function | export | 1 |
| `pointInCameraFacingHalfSpace` | 97 | function | export | 1 |
| `sculptTwistBrushAngle` | 121 | function | export | 2 |
| `sculptTwistBrushDeltas` | 134 | function | export | 1 |
| `resolveFrozenTwistStrokeWeights` | 161 | function | export | 1 |
| `compute` | 163 | arrow |  | 2 |
| `smoothSculptTwistDeltas` | 176 | function | export | 1 |
