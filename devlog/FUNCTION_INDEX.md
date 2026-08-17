# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-17），由 `node scripts/gen-function-index.js` 产出。共 **2131** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（20184 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 296 | function |  | 2 |
| `saveBooleanPreference` | 333 | function |  | 23 |
| `normalizeControlPointDisplaySize` | 337 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 342 | function |  | 2 |
| `normalizeScaleSensitivity` | 347 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 352 | function |  | 2 |
| `normalizeOutlinerFolderColorOpacity` | 358 | function |  | 2 |
| `normalizeGlassPanelColor` | 363 | function |  | 2 |
| `normalizeSidePanelStyle` | 368 | function |  | 2 |
| `normalizeSideNamingPerspective` | 374 | function |  | 2 |
| `normalizeNavigationStyle` | 378 | function |  | 2 |
| `setupEditableSliderControls` | 393 | function |  | 2 |
| `syncNumberFromRange` | 444 | arrow |  | 0 |
| `applyNumberValue` | 451 | arrow |  | 0 |
| `copyCameraPose` | 590 | function |  | 3 |
| `updateCameraProjectionForViewport` | 596 | function |  | 4 |
| `syncOrthographicFramingFromDistance` | 612 | function |  | 2 |
| `setOrthographicView` | 618 | function |  | 3 |
| `ensureMultiCameraPreviewRenderers` | 648 | function |  | 3 |
| `multiCameraForView` | 661 | function |  | 3 |
| `multiCameraViewUsesLeftPane` | 665 | function |  | 3 |
| `multiCameraViewPaneWidth` | 669 | function |  | 5 |
| `multiCameraViewProjectionOffsetX` | 673 | function |  | 2 |
| `initializeMultiCameraOrthographicViews` | 679 | function |  | 2 |
| `syncMultiCameraPreviewCameras` | 694 | function |  | 3 |
| `multiCameraOrthographicViewActive` | 709 | function |  | 4 |
| `prioritizeActiveMultiCameraViewport` | 713 | function |  | 3 |
| `renderNextInactiveMultiCameraPreview` | 720 | function |  | 2 |
| `setMultiCameraActiveView` | 736 | function |  | 3 |
| `setMultiCameraEnabled` | 759 | function |  | 3 |
| `setMultiCameraExperimentalEnabled` | 777 | function |  | 4 |
| `multiCameraPaneMetrics` | 790 | function |  | 4 |
| `applyViewportProjectionOffset` | 803 | function |  | 2 |
| `addNegativeTransformGizmoRods` | 820 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 849 | function |  | 2 |
| `removeRotateFreeAxisRing` | 875 | function |  | 2 |
| `deflateTransformGizmoPickers` | 887 | function |  | 2 |
| `nextStrandName` | 1288 | function |  | 2 |
| `isPanelGeometry` | 1517 | function |  | 30 |
| `normalizePanelSplits` | 1521 | function |  | 2 |
| `clonePanelSplits` | 1533 | function |  | 11 |
| `snapPanelSplitHeight` | 1537 | function |  | 3 |
| `createQuadSphereGeometry` | 1572 | function |  | 2 |
| `vertexIndex` | 1586 | function |  | 5 |
| `addEdge` | 1604 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1833 | function |  | 4 |
| `ensureDrawClumpPreviewCount` | 2013 | function |  | 1 |
| `currentStrandSelectionState` | 2075 | function |  | 4 |
| `applyStrandSelectionState` | 2079 | function |  | 5 |
| `clearStrandSelectionState` | 2084 | function |  | 5 |
| `cancelRecoverySchedule` | 2456 | function |  | 5 |
| `recoveryWriteMustWait` | 2468 | function |  | 3 |
| `scheduleRecoveryAutosave` | 2475 | function |  | 7 |
| `markProjectChangedForRecovery` | 2487 | function |  | 4 |
| `queueRecoveryAutosave` | 2493 | function |  | 1 |
| `run` | 2507 | arrow |  | 1 |
| `buildRecoveryProjectContent` | 2520 | function |  | 2 |
| `flushRecoveryAutosave` | 2531 | function |  | 2 |
| `clearAcknowledgedRecovery` | 2556 | function |  | 1 |
| `setAutosaveEnabled` | 2572 | function |  | 5 |
| `setAutosaveInterval` | 2581 | function |  | 5 |
| `offerRecoverySnapshot` | 2591 | function |  | 2 |
| `recoverPendingProject` | 2616 | function |  | 1 |
| `discardPendingRecovery` | 2640 | function |  | 1 |
| `downloadPendingRecovery` | 2652 | function |  | 1 |
| `normalizeHairLayer` | 3597 | function |  | 20 |
| `layerOffsetForLock` | 3601 | function |  | 3 |
| `layerRootOffsetFactor` | 3606 | function |  | 7 |
| `layerOffsetWeight` | 3610 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3616 | function |  | 5 |
| `pointsWithLayerOffset` | 3625 | function |  | 1 |
| `layerDirectionForLock` | 3633 | function |  | 2 |
| `applyLayerOffset` | 3644 | function |  | 5 |
| `setLockHairLayer` | 3668 | function |  | 2 |
| `setGroupLayerOffset` | 3683 | function |  | 2 |
| `quadraticWeights` | 3711 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3912 | function |  | 1 |
| `upperContourCurve` | 3929 | function |  | 2 |
| `hermitePoint` | 3964 | function |  | 2 |
| `curveNetworkSection` | 3975 | function |  | 1 |
| `pointAlongSection` | 4004 | function |  | 1 |
| `longestStitchedContour` | 4010 | function |  | 2 |
| `nodeForPoint` | 4018 | arrow |  | 2 |
| `constructionCurveFromSegments` | 4075 | function |  | 1 |
| `exitSetupEditors` | 4095 | function |  | 6 |
| `syncAppMenuVisibility` | 4105 | function |  | 3 |
| `closeAppMenus` | 4111 | function |  | 5 |
| `setAppMenuOpen` | 4122 | function |  | 2 |
| `setTurntableActive` | 4129 | function |  | 3 |
| `setOutlinerTab` | 4168 | function |  | 7 |
| `effectiveViewportSelectionMode` | 4186 | function |  | 4 |
| `componentEditModeActive` | 4190 | function |  | 31 |
| `selectionToolSupportsPicking` | 4194 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4199 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4215 | function |  | 2 |
| `setViewportSelectionMode` | 4246 | function |  | 3 |
| `setViewportEditMode` | 4258 | function |  | 7 |
| `createOutlinerVisibilityToggle` | 4301 | function |  | 5 |
| `setLocksOutlinerVisibility` | 4315 | function |  | 7 |
| `normalizeOutlinerName` | 4329 | function |  | 3 |
| `beginOutlinerRename` | 4334 | function |  | 2 |
| `finish` | 4345 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4375 | function |  | 4 |
| `strandPassesDisplayFilters` | 4525 | function |  | 4 |
| `strandVisibleForDisplay` | 4534 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 4539 | function |  | 3 |
| `lockedStrandsExist` | 4543 | function |  | 1 |
| `hiddenStrandsExist` | 4547 | function |  | 1 |
| `hideSelectedStrands` | 4551 | function |  | 1 |
| `unhideHiddenStrands` | 4561 | function |  | 1 |
| `strandIsolationActive` | 4570 | function |  | 4 |
| `setStrandIsolation` | 4574 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 4586 | function |  | 2 |
| `syncVisibilityParent` | 4597 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 4604 | function |  | 7 |
| `applyCharacterMeshDisplayVisibility` | 4633 | function |  | 4 |
| `applyStrandDisplayVisibility` | 4640 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 4663 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 4881 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 4902 | function |  | 1 |
| `createStrandsFromCurveLattice` | 4921 | function |  | 2 |
| `selectedViewportFocusBounds` | 5019 | function |  | 2 |
| `frameViewportBounds` | 5033 | function |  | 4 |
| `centerViewportOnSelectedItem` | 5064 | function |  | 2 |
| `fullSceneFocusBounds` | 5068 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5083 | function |  | 3 |
| `cycleViewportFraming` | 5092 | function |  | 2 |
| `sculptBrushToolActive` | 5112 | function |  | 22 |
| `sculptBrushSelectionMaskActive` | 5116 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5120 | function |  | 2 |
| `effectiveSculptBrushTool` | 5124 | function |  | 3 |
| `updateSculptScaleModeRow` | 5130 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5135 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5157 | function |  | 5 |
| `setActiveTool` | 5166 | function |  | 10 |
| `setDrawStrandMode` | 5304 | function |  | 1 |
| `setObjectSpaceEditing` | 5314 | function |  | 5 |
| `setHierarchyEditing` | 5330 | function |  | 4 |
| `setProportionalEditing` | 5342 | function |  | 5 |
| `beginProportionalSizeEdit` | 5361 | function |  | 3 |
| `updateProportionalSizeEdit` | 5373 | function |  | 2 |
| `endProportionalSizeEdit` | 5384 | function |  | 5 |
| `activateProportionalHotkeyHold` | 5391 | function |  | 2 |
| `refreshProportionalPreview` | 5399 | function |  | 4 |
| `activeBrushSizeInput` | 5409 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 5418 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 5430 | function |  | 2 |
| `beginBrushSizeDrag` | 5448 | function |  | 1 |
| `updateBrushSizeDrag` | 5475 | function |  | 1 |
| `finishBrushSizeDrag` | 5496 | function |  | 2 |
| `updateInteractionLocks` | 5513 | function |  | 39 |
| `configureTransformControls` | 5524 | function |  | 11 |
| `pullMoveActive` | 5532 | function |  | 8 |
| `updatePullGuideVisual` | 5536 | function |  | 4 |
| `attachTransformForCurvePoint` | 5552 | function |  | 5 |
| `pointerHitsTransformGizmo` | 5576 | function |  | 5 |
| `strandObjectRootIndex` | 5592 | function |  | 3 |
| `strandObjectRoot` | 5601 | function |  | 5 |
| `normalizeStrandObjectTransform` | 5611 | function |  | 12 |
| `strandObjectTransformQuaternionFromValues` | 5626 | function |  | 4 |
| `strandObjectTransformValuesAfterHandle` | 5636 | function |  | 3 |
| `mirroredStrandObjectTransform` | 5662 | function |  | 2 |
| `objectTransformPanelLock` | 5671 | function |  | 3 |
| `formatStrandObjectTransformValue` | 5678 | function |  | 2 |
| `syncStrandObjectTransformPanel` | 5683 | function |  | 7 |
| `applyStrandObjectTransformPanelValues` | 5709 | function |  | 2 |
| `strandObjectTransformQuaternion` | 5770 | function |  | 3 |
| `attachStrandObjectTransform` | 5775 | function |  | 6 |
| `guideObjectPivot` | 5798 | function |  | 3 |
| `guideObjectTransformQuaternion` | 5809 | function |  | 2 |
| `attachGuideObjectTransform` | 5814 | function |  | 5 |
| `guideObjectTransformSnapshot` | 5833 | function |  | 2 |
| `beginGuideObjectTransform` | 5861 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 5868 | function |  | 2 |
| `updateGuideObjectTransform` | 5890 | function |  | 2 |
| `finishGuideObjectTransform` | 5923 | function |  | 2 |
| `clonePlacementFrame` | 5932 | function |  | 2 |
| `cloneOptionalVectors` | 5944 | function |  | 10 |
| `strandObjectTransformSnapshot` | 5948 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 5966 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 5981 | function |  | 2 |
| `strandObjectTransformOperators` | 5997 | function |  | 4 |
| `transformPoint` | 6005 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6012 | arrow |  | 0 |
| `transformNormal` | 6018 | arrow |  | 10 |
| `transformDirection` | 6028 | arrow |  | 1 |
| `worldMatrixForPivot` | 6040 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6046 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6062 | function |  | 6 |
| `beginStrandObjectTransform` | 6088 | function |  | 3 |
| `updateStrandObjectTransform` | 6126 | function |  | 2 |
| `commitStrandObjectTransform` | 6184 | function |  | 2 |
| `mapPoints` | 6199 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6233 | function |  | 3 |
| `surfaceObjectAnchorPose` | 6248 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6271 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6284 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6299 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6325 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6374 | function |  | 2 |
| `beginHandleEdit` | 6383 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6436 | function |  | 3 |
| `multiPointHandleEditActive` | 6447 | function |  | 7 |
| `applyMultiMove` | 6451 | function |  | 5 |
| `applyMultiRotate` | 6457 | function |  | 2 |
| `applyMultiScale` | 6466 | function |  | 2 |
| `applyHierarchicalMove` | 6475 | function |  | 3 |
| `applySingleMove` | 6487 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6491 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6508 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6517 | function |  | 3 |
| `changed` | 6527 | arrow |  | 1 |
| `applyPullMove` | 6569 | function |  | 3 |
| `pullHeadCollisionContext` | 6577 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 6596 | function |  | 2 |
| `applyProportionalMove` | 6619 | function |  | 3 |
| `viewPlaneNormal` | 6630 | function |  | 4 |
| `isCameraInSnappedView` | 6634 | function |  | 2 |
| `viewPlaneMoveActiveForView` | 6642 | function |  | 9 |
| `updateViewPlaneGrid` | 6646 | function |  | 13 |
| `setViewPlaneMove` | 6703 | function |  | 3 |
| `setViewPlaneMoveSnappedOnly` | 6714 | function |  | 2 |
| `rayFromViewportEvent` | 6722 | function |  | 8 |
| `worldUnitsPerViewportPixel` | 6730 | function |  | 4 |
| `viewPlaneMovePointNormal` | 6740 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 6751 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 6764 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 6783 | function |  | 4 |
| `beginViewPlaneMove` | 6790 | function |  | 3 |
| `updateViewPlaneMove` | 6854 | function |  | 1 |
| `endViewPlaneMove` | 6919 | function |  | 7 |
| `applyHierarchicalRotate` | 6938 | function |  | 2 |
| `rotateGuideNormal` | 6945 | arrow |  | 4 |
| `applySingleRotate` | 6983 | function |  | 2 |
| `applyProportionalRotate` | 6987 | function |  | 2 |
| `applyHierarchicalScale` | 7007 | function |  | 2 |
| `applySingleScale` | 7017 | function |  | 2 |
| `applyProportionalScale` | 7021 | function |  | 2 |
| `setPointScale` | 7037 | function |  | 6 |
| `proportionalWeight` | 7046 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7058 | function |  | 5 |
| `strandInfluenceColor` | 7064 | function |  | 4 |
| `beginRelaxEdit` | 7089 | function |  | 3 |
| `updateRelaxEdit` | 7118 | function |  | 1 |
| `endRelaxEdit` | 7178 | function |  | 1 |
| `disposeGuide` | 7188 | function |  | 3 |
| `removeGuideObjects` | 7216 | function |  | 3 |
| `strandRadiusAt` | 7230 | function |  | 5 |
| `strandProfileTopologyAt` | 7247 | function |  | 2 |
| `strandCurveParameters` | 7289 | function |  | 2 |
| `widthProfileAt` | 7299 | arrow |  | 1 |
| `braidFrameAt` | 7337 | function |  | 4 |
| `braidFrameAtExtended` | 7347 | function |  | 2 |
| `createBraidProfileProjector` | 7356 | function |  | 2 |
| `project` | 7372 | arrow |  | 11 |
| `createBraidGeometry` | 7387 | function |  | 1 |
| `quantize` | 7420 | arrow |  | 19 |
| `deformationAt` | 7422 | function |  | 3 |
| `widthFor` | 7431 | arrow |  | 3 |
| `depthFor` | 7435 | arrow |  | 3 |
| `outputVertex` | 7467 | function |  | 7 |
| `appendAuthoredCap` | 7575 | function |  | 3 |
| `outputCapVertex` | 7582 | arrow |  | 6 |
| `capBoundary` | 7673 | function |  | 3 |
| `strandGeometryCurve` | 7735 | function |  | 8 |
| `strandGeometryFrameAt` | 7761 | function |  | 6 |
| `transportedStrandFrameAt` | 7824 | function |  | 4 |
| `twistOverrideAt` | 7827 | arrow |  | 2 |
| `createHairTopologyGeometry` | 7905 | function |  | 4 |
| `createHairTopologyOverlay` | 7926 | function |  | 3 |
| `groupDefaultsFor` | 7973 | function |  | 7 |
| `creationToolActive` | 7980 | function |  | 5 |
| `activeCreationShapeDefaults` | 7984 | function |  | 6 |
| `curvePolylineLength` | 7991 | function |  | 2 |
| `curvePolylineLengths` | 7999 | function |  | 3 |
| `samplePolylineDistance` | 8007 | function |  | 2 |
| `applyProjectedCurveLength` | 8017 | function |  | 4 |
| `clearRegionLengthBaseline` | 8048 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8055 | function |  | 2 |
| `setGroupLengthScale` | 8063 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 8101 | function |  | 3 |
| `requestGroupDefaultsWarning` | 8133 | function |  | 1 |
| `activeProfileOffset` | 8145 | function |  | 3 |
| `profileToCanvas` | 8153 | function |  | 1 |
| `renderProfilePreview` | 8160 | function |  | 7 |
| `renderHairCardCoveragePath` | 8179 | function |  | 2 |
| `updateViewportStatsVisibility` | 8697 | function |  | 1 |
| `canvasToProfile` | 8716 | function |  | 2 |
| `addLock` | 8731 | function |  | 4 |
| `mirroredVector` | 8953 | function |  | 12 |
| `mirroredPlacementFrame` | 8957 | function |  | 2 |
| `mirrorPartnerFor` | 8970 | function |  | 28 |
| `decoupleMirrorPartner` | 8974 | function |  | 2 |
| `createMirrorPartner` | 8982 | function |  | 3 |
| `createMirrorPartnerForNewLock` | 9088 | function |  | 1 |
| `syncMirrorPartnerFromLock` | 9107 | function |  | 3 |
| `syncActiveMirror` | 9289 | function |  | 22 |
| `setMirrorXEditing` | 9301 | function |  | 5 |
| `snapshotState` | 9325 | function |  | 5 |
| `pushUndoState` | 9676 | function |  | 68 |
| `undoLastAction` | 9684 | function |  | 2 |
| `redoLastAction` | 9703 | function |  | 2 |
| `updateHistoryButtons` | 9722 | function |  | 5 |
| `resetTransientInteractionsForStateRestore` | 9727 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 9747 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 9754 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 9794 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 9820 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 9852 | function |  | 2 |
| `finalizeStateRestore` | 9893 | function |  | 2 |
| `restoreState` | 9900 | function |  | 3 |
| `disposeAllEditableObjects` | 9924 | function |  | 2 |
| `restoreLock` | 9946 | function |  | 2 |
| `restoreGuide` | 10180 | function |  | 2 |
| `vectorToData` | 10241 | function |  | 15 |
| `dataToVector` | 10245 | function |  | 14 |
| `frameToData` | 10275 | function |  | 2 |
| `frameFromData` | 10287 | function |  | 2 |
| `average` | 10299 | function |  | 3 |
| `fitPointAttributes` | 10303 | function |  | 5 |
| `rebuildCurveObjects` | 10332 | function |  | 4 |
| `createCurvePoints` | 10344 | function |  | 2 |
| `deselectStrands` | 10448 | function |  | 9 |
| `beginSelectionMarquee` | 10463 | function |  | 3 |
| `beginAltOrbit` | 10487 | function |  | 1 |
| `beginBlenderNavigation` | 10504 | function |  | 1 |
| `endBlenderNavigation` | 10554 | function |  | 1 |
| `prepareSelectPointerCapture` | 10562 | function |  | 1 |
| `endSelectPointerCapture` | 10568 | function |  | 1 |
| `applyAltClickCandidate` | 10574 | function |  | 2 |
| `finishBrushAltClick` | 10600 | function |  | 1 |
| `endAltOrbit` | 10613 | function |  | 2 |
| `dollyCameraByDrag` | 10620 | function |  | 2 |
| `fastDragMagnitude` | 10643 | function |  | 2 |
| `beginHoudiniZoomDrag` | 10649 | function |  | 1 |
| `updateHoudiniZoomDrag` | 10657 | function |  | 1 |
| `endHoudiniZoomDrag` | 10674 | function |  | 1 |
| `updateSelectionMarquee` | 10682 | function |  | 1 |
| `pointInsideSelectionMarquee` | 10699 | function |  | 3 |
| `selectPointsInMarquee` | 10707 | function |  | 2 |
| `pointKey` | 10733 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 10764 | function |  | 2 |
| `objectInsideSelectionMarquee` | 10801 | function |  | 3 |
| `projectedPoint` | 10818 | arrow |  | 1 |
| `selectObjectsInMarquee` | 10847 | function |  | 2 |
| `finishSelectionMarquee` | 10892 | function |  | 2 |
| `strandSplitProfileData` | 10916 | function |  | 2 |
| `strandSplitControlPoint` | 10929 | function |  | 1 |
| `panelSplitControlPoint` | 10965 | function |  | 3 |
| `panelWidthAt` | 10982 | arrow |  | 3 |
| `panelThicknessAt` | 10989 | arrow |  | 3 |
| `strandControlPointRaycast` | 11022 | function |  | 1 |
| `strandControlPointFrame` | 11057 | function |  | 4 |
| `strandControlPointHitFromEvent` | 11089 | function |  | 3 |
| `createCurveObjects` | 11147 | function |  | 4 |
| `createDimensionEdgeLines` | 11176 | arrow |  | 2 |
| `strandWidthEdgeFrameAt` | 11292 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 11299 | function |  | 2 |
| `strandWidthEdgeSample` | 11308 | function |  | 3 |
| `strandWidthEdgePoints` | 11343 | function |  | 2 |
| `moveCurveControlsApplicable` | 11357 | function |  | 5 |
| `moveGrabHandlesApplicable` | 11367 | function |  | 2 |
| `moveGrabHandleVisible` | 11377 | function |  | 2 |
| `visibleTaperMeshCurveEdits` | 11382 | function |  | 1 |
| `syncMoveCurveControls` | 11403 | function |  | 8 |
| `syncAuthoredCheckbox` | 11418 | arrow |  | 3 |
| `setMoveGrabHandleVisibility` | 11438 | function |  | 4 |
| `setMoveCurveControlVisibility` | 11446 | function |  | 4 |
| `setSelectedMoveCurveShapeFlag` | 11455 | function |  | 4 |
| `sculptBrushDebugRaycast` | 11469 | arrow |  | 0 |
| `updateCurveObjects` | 11471 | function |  | 27 |
| `pointUpDirection` | 11676 | function |  | 2 |
| `curveFrameAtPoint` | 11680 | function |  | 4 |
| `curveFrameAt` | 11701 | function |  | 3 |
| `strandTwistAt` | 11721 | function |  | 6 |
| `controlPointRotationAt` | 11726 | function |  | 3 |
| `strandProfileTwistAt` | 11730 | function |  | 2 |
| `strandFrameAt` | 11736 | function |  | 1 |
| `curveFrameAtSnapshot` | 11742 | function |  | 3 |
| `outwardNormalAtPoint` | 11761 | function |  | 5 |
| `sampledSurfaceNormal` | 11824 | function |  | 2 |
| `guidedNormalAt` | 11840 | function |  | 4 |
| `twistFromHandle` | 11859 | function |  | 3 |
| `signedAngleAroundAxis` | 11880 | function |  | 4 |
| `handleColor` | 11887 | function |  | 2 |
| `isAffectedCurvePoint` | 11910 | function |  | 2 |
| `syncLockFromCurve` | 11916 | function |  | 14 |
| `rebuildLockGeometry` | 11946 | function |  | 18 |
| `flushPendingLockGeometryUpdates` | 11971 | function |  | 6 |
| `updateLockGeometry` | 11984 | function |  | 28 |
| `setGroupColorView` | 12005 | function |  | 2 |
| `createUvCheckerTexture` | 12015 | function |  | 3 |
| `ensureUvCheckerForLock` | 12051 | function |  | 3 |
| `removeUvCheckerFromLock` | 12084 | function |  | 3 |
| `invalidateUvInspector` | 12099 | function |  | 9 |
| `uvInspectorRecord` | 12103 | function |  | 1 |
| `uvInspectorRecords` | 12142 | function |  | 2 |
| `drawUvInspectorGrid` | 12146 | function |  | 2 |
| `renderUvInspector` | 12180 | function |  | 4 |
| `setUvCheckerEnabled` | 12239 | function |  | 3 |
| `buildUvCheckerPreviewGeometry` | 12262 | function |  | 2 |
| `restoreUvCheckerPreview` | 12281 | function |  | 6 |
| `applyUvCheckerPreview` | 12297 | function |  | 2 |
| `refreshUvCheckerPreview` | 12312 | function |  | 1 |
| `strandViewportBaseColor` | 12340 | function |  | 2 |
| `strandMirrorPartnerHighlighted` | 12375 | function |  | 3 |
| `syncStrandSelectionOutline` | 12381 | function |  | 2 |
| `applyLockedStrandPalette` | 12392 | function |  | 2 |
| `syncLockedStrandWireVisual` | 12401 | function |  | 5 |
| `setStrandSelectionVisual` | 12410 | function |  | 4 |
| `updateStrandSelectionHighlightForLock` | 12428 | function |  | 1 |
| `updateStrandSelectionHighlight` | 12432 | function |  | 6 |
| `refreshStrandCurveSelectionVisuals` | 12436 | function |  | 2 |
| `resetGuideSelectionVisuals` | 12449 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 12469 | function |  | 3 |
| `selectLock` | 12504 | function |  | 24 |
| `deselectStrandsForGuideEditor` | 12566 | function |  | 1 |
| `syncGroupInputs` | 12577 | function |  | 2 |
| `topologyStatsForLock` | 12610 | function |  | 4 |
| `formatTopologyStats` | 12618 | function |  | 5 |
| `updateTopologyStats` | 12622 | function |  | 15 |
| `normalizeStrandDimensions` | 12656 | function |  | 3 |
| `strandBaseWidth` | 12670 | function |  | 5 |
| `strandWidthDimension` | 12674 | function |  | 5 |
| `strandDepthDimension` | 12682 | function |  | 8 |
| `setStrandWidthDimension` | 12690 | function |  | 2 |
| `setStrandDepthDimension` | 12712 | function |  | 4 |
| `syncShapeDimensionInputs` | 12728 | function |  | 4 |
| `syncCreationShapeInputs` | 12764 | function |  | 2 |
| `syncViewportDrawSettings` | 12803 | function |  | 4 |
| `syncViewportTopControlRows` | 12818 | function |  | 6 |
| `syncResponsiveSidebarDock` | 12838 | function |  | 2 |
| `syncStrandSplitInputs` | 12871 | function |  | 4 |
| `currentStrandTipChain` | 12881 | function |  | 5 |
| `currentStrandTipLength` | 12888 | function |  | 2 |
| `syncStrandTipInputs` | 12897 | function |  | 4 |
| `currentStrandSplitTipChains` | 12912 | function |  | 4 |
| `restPointAt` | 12931 | arrow |  | 0 |
| `currentStrandSplitTipLength` | 12947 | function |  | 2 |
| `syncStrandSplitTipInputs` | 12958 | function |  | 3 |
| `syncHairCardControls` | 12969 | function |  | 6 |
| `updateAttributeEditorMode` | 12978 | function |  | 10 |
| `pinActiveToolSettingsPanel` | 13133 | function |  | 2 |
| `curveLatticeForGroup` | 13156 | function |  | 2 |
| `filterCurveLatticesToGroup` | 13174 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 13219 | function |  | 2 |
| `showCurveLatticeForGroup` | 13236 | function |  | 2 |
| `selectStrandGroup` | 13273 | function |  | 3 |
| `selectCurvePoint` | 13315 | function |  | 3 |
| `updateSelectedPointLabel` | 13329 | function |  | 12 |
| `syncInputs` | 13342 | function |  | 13 |
| `getSelectedLock` | 13390 | function |  | 99 |
| `selectedLocksInOrder` | 13394 | function |  | 26 |
| `lockStrands` | 13400 | function |  | 3 |
| `lockSelectedStrands` | 13433 | function |  | 2 |
| `unlockStrands` | 13439 | function |  | 3 |
| `unlockAllStrands` | 13454 | function |  | 2 |
| `strandEditFamily` | 13458 | function |  | 7 |
| `compatibleSelectedLocks` | 13463 | function |  | 5 |
| `selectedEditRoots` | 13470 | function |  | 2 |
| `editSelectedLocks` | 13483 | function |  | 18 |
| `multiEditValuesEqual` | 13516 | function |  | 2 |
| `setMixedControl` | 13525 | function |  | 29 |
| `syncMultiStrandInputs` | 13542 | function |  | 18 |
| `values` | 13558 | arrow |  | 35 |
| `selectedRebuildableCurves` | 13639 | function |  | 5 |
| `createCompoundStrand` | 13646 | function |  | 1 |
| `refreshRebuildCurveDialog` | 13707 | function |  | 7 |
| `openRebuildCurveDialog` | 13720 | function |  | 1 |
| `rebuildSelectedCurves` | 13734 | function |  | 2 |
| `cleanSelectionSets` | 13775 | function |  | 2 |
| `createSelectionSetFromSelection` | 13780 | function |  | 2 |
| `selectionSetById` | 13791 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 13795 | function |  | 7 |
| `editSelectionSetFromSelection` | 13804 | function |  | 4 |
| `closeSelectionSetMembershipDialog` | 13824 | function |  | 3 |
| `openSelectionSetMembershipDialog` | 13830 | function |  | 3 |
| `deleteSelectionSet` | 13862 | function |  | 2 |
| `selectSelectionSet` | 13871 | function |  | 2 |
| `deleteSelectedStrands` | 13881 | function |  | 3 |
| `deleteGuide` | 13889 | function |  | 3 |
| `deleteSelectedGuide` | 13912 | function |  | 3 |
| `hasDeletableSelection` | 13917 | function |  | 2 |
| `deleteCurrentSelection` | 13925 | function |  | 3 |
| `hideOutlinerContextMenu` | 13933 | function |  | 16 |
| `outlinerLockTargets` | 13938 | function |  | 3 |
| `showOutlinerContextMenu` | 13965 | function |  | 6 |
| `setPullMoveEnabled` | 14062 | function |  | 2 |
| `setNavigationTipsEnabled` | 14071 | function |  | 4 |
| `configureNavigationMouseButtons` | 14078 | function |  | 3 |
| `syncNavigationModifierLocks` | 14091 | function |  | 7 |
| `setNavigationStyle` | 14096 | function |  | 4 |
| `applyCameraSmoothingPreference` | 14112 | function |  | 4 |
| `setCameraSmoothingEnabled` | 14127 | function |  | 4 |
| `setCameraSmoothingStrength` | 14133 | function |  | 4 |
| `setScaleSensitivity` | 14141 | function |  | 3 |
| `setToolTipsEnabled` | 14149 | function |  | 4 |
| `setCompactToolButtonsEnabled` | 14156 | function |  | 4 |
| `setViewportStatisticsEnabled` | 14165 | function |  | 4 |
| `setTwistCurveAllStrandsPreviewEnabled` | 14173 | function |  | 4 |
| `setLayerColorShiftsEnabled` | 14188 | function |  | 4 |
| `setOutlinerFolderColorsEnabled` | 14197 | function |  | 4 |
| `setSidePanelStyle` | 14207 | function |  | 5 |
| `setGlassPanelColor` | 14225 | function |  | 6 |
| `setOutlinerFolderColorOpacity` | 14235 | function |  | 5 |
| `sideNamingDisplayId` | 14252 | function |  | 2 |
| `strandRegionDisplayLabel` | 14265 | function |  | 6 |
| `updateSideNamingLabels` | 14283 | function |  | 2 |
| `setSideNamingPerspective` | 14310 | function |  | 4 |
| `setControlPointDisplaySize` | 14319 | function |  | 5 |
| `scaleHexColor` | 14331 | function |  | 3 |
| `setViewportBackgroundColor` | 14336 | function |  | 6 |
| `setDefaultHairShader` | 14358 | function |  | 4 |
| `setPreferenceCategory` | 14364 | function |  | 4 |
| `openPreferencesDialog` | 14391 | function |  | 1 |
| `savePreferencesDialog` | 14430 | function |  | 1 |
| `cancelPreferencesDialog` | 14460 | function |  | 3 |
| `createOutlinerStrandButton` | 14500 | function |  | 2 |
| `createOutlinerCurveSurface` | 14586 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 14683 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 14690 | function |  | 2 |
| `renderLockList` | 14769 | function |  | 37 |
| `updateCount` | 14950 | function |  | 10 |
| `captureInputUndo` | 14959 | function |  | 1 |
| `bindUndoCapture` | 14965 | function |  | 41 |
| `bindLockInput` | 14976 | function |  | 2 |
| `applyValue` | 14993 | arrow |  | 2 |
| `applyUniformTransformScale` | 15328 | function |  | 2 |
| `applyReducedTransformScale` | 15345 | function |  | 2 |
| `applyTransformPrecision` | 15384 | function |  | 2 |
| `updateTransformScalePointer` | 15413 | function |  | 1 |
| `syncDrawCurlControls` | 16488 | function |  | 5 |
| `handleLiveSurfaceChange` | 16536 | function |  | 1 |
| `applyStrandTipToTarget` | 16596 | function |  | 5 |
| `strandTipTarget` | 16607 | function |  | 5 |
| `strandSplitTipTarget` | 16680 | function |  | 3 |
| `applyStrandSplitTipToTarget` | 16685 | function |  | 3 |
| `selectedBranchChildLock` | 16977 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 16981 | function |  | 2 |
| `updateSweepOverlapSliderInputs` | 17022 | function |  | 2 |
| `initPanelResizeHandles` | 17189 | function |  | 2 |
| `applyWidth` | 17195 | arrow |  | 2 |
| `restoreWidth` | 17202 | arrow |  | 2 |
| `bindResize` | 17210 | arrow |  | 2 |
| `onMove` | 17219 | arrow |  | 0 |
| `onUp` | 17223 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 17240 | function |  | 2 |
| `initFloatingPanelControls` | 17249 | function |  | 2 |
| `detach` | 17258 | arrow |  | 22 |
| `endDrag` | 17296 | arrow |  | 0 |
| `endResize` | 17328 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 17339 | function |  | 3 |
| `selectPatchNotesVersion` | 17498 | function |  | 3 |
| `toggleCapsuleGuideTool` | 17729 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 17735 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 17742 | function |  | 1 |
| `deleteLocks` | 18310 | function |  | 4 |
| `disposeCurveObjects` | 18389 | function |  | 4 |
| `activateMultiCameraView` | 18436 | arrow |  | 1 |
| `resize` | 18468 | function |  | 6 |
| `handleViewportPointerMove` | 18494 | function |  | 1 |
| `blockProportionalSizingEvent` | 18505 | function |  | 1 |
| `updateLightAngleFromInputs` | 18511 | function |  | 2 |
| `startViewSnap` | 18525 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 18555 | function |  | 3 |
| `trackViewportPointerDown` | 18572 | function |  | 1 |
| `trackViewportPointerMove` | 18588 | function |  | 1 |
| `clearViewportPointer` | 18596 | function |  | 1 |
| `updateViewSnap` | 18601 | function |  | 1 |
| `nearestCardinalAxis` | 18637 | function |  | 6 |
| `cardinalAxisKey` | 18651 | function |  | 6 |
| `steppedDragAmount` | 18655 | function |  | 3 |
| `snapCameraToCardinalAxis` | 18661 | function |  | 5 |
| `endViewSnap` | 18677 | function |  | 4 |
| `updateCameraViewCube` | 18696 | function |  | 3 |
| `activateView` | 18714 | function |  | 1 |
| `activateStrandControlPoint` | 18739 | function |  | 2 |
| `refreshStrandControlPointSelection` | 18789 | function |  | 4 |
| `addStrandControlPointSelection` | 18816 | function |  | 2 |
| `removeStrandControlPointSelection` | 18833 | function |  | 3 |
| `sampleStrandPointNormal` | 18847 | function |  | 2 |
| `sampleStrandPointVectors` | 18857 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 18863 | function |  | 2 |
| `resampleStrandCurveData` | 18874 | function |  | 4 |
| `resampleMatchingVectors` | 18880 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 18919 | function |  | 4 |
| `removeStrandCurvePoint` | 18930 | function |  | 2 |
| `closestStrandCurveParameter` | 18943 | function |  | 1 |
| `insertStrandCurvePoint` | 18972 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 18989 | function |  | 2 |
| `selectionModifierCursorAvailable` | 18999 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 19015 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 19022 | function |  | 4 |
| `finishCurvePointInsertion` | 19045 | function |  | 1 |
| `finishPointRemoval` | 19060 | function |  | 1 |
| `isHairCreateTool` | 19079 | function |  | 4 |
| `syncStrandHoverOutline` | 19083 | function |  | 1 |
| `pointerOverTaperEditor` | 19096 | function |  | 2 |
| `updateStrandBrushHover` | 19103 | function |  | 1 |
| `strandControlPointHit` | 19127 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 19131 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 19209 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 19243 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 19283 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 19296 | function |  | 1 |
| `setHoveredControlPoint` | 19335 | function |  | 7 |
| `visibleControlPointHoverTargets` | 19348 | function |  | 2 |
| `updateControlPointHover` | 19384 | function |  | 1 |
| `animate` | 20003 | function |  | 2 |
| `syncCompactSidebarLayout` | 20039 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 20058 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 20064 | function |  | 3 |
| `setAttributeEditorTab` | 20070 | function |  | 6 |

## modules/bones/bone-interaction.js（867 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBoneInteractionApi` | 22 | function | export | 1 |
| `beginTipSubBoneRotate` | 23 | function |  | 1 |
| `beginTipSubBoneTranslate` | 51 | function |  | 1 |
| `applyTipSubBoneTransform` | 80 | function |  | 1 |
| `beginPanelSplitHandleDrag` | 143 | function |  | 1 |
| `updatePanelSplitHandleDrag` | 291 | function |  | 1 |
| `endPanelSplitHandleDrag` | 558 | function |  | 3 |
| `applySubBoneBrushSample` | 569 | function |  | 1 |
| `updatePanelTipHover` | 714 | function |  | 1 |
| `prepareCurvePointSelection` | 744 | function |  | 1 |

## modules/bones/bone-model.js（541 行）

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
| `normalizeStrandTip` | 266 | function | export | 6 |
| `numPoint` | 268 | arrow |  | 0 |
| `strandTipFor` | 277 | function | export | 2 |
| `strandTipToData` | 281 | function | export | 1 |
| `strandTipFromData` | 293 | function | export | 1 |
| `mirrorStrandTip` | 297 | function | export | 1 |
| `defaultStrandSplitSpread` | 312 | function | export | 3 |
| `normalizeStrandSplitBone` | 318 | function |  | 3 |
| `strandSplitBonesFor` | 330 | function | export | 3 |
| `materializeStrandSplitBones` | 356 | function | export | 1 |
| `strandSplitBonesToData` | 364 | function | export | 1 |
| `strandSplitBonesFromData` | 392 | function | export | 1 |
| `mirrorStrandSplitBones` | 399 | function | export | 1 |
| `normalizeBone` | 422 | function | export | 7 |
| `curve` | 425 | arrow |  | 4 |
| `pick` | 429 | arrow |  | 6 |
| `normalizeBones` | 461 | function | export | 2 |
| `bonesToData` | 468 | function | export | 2 |
| `bonesFromData` | 499 | function | export | 1 |
| `mirrorBones` | 505 | function | export | 1 |
| `registryForSave` | 525 | function | export | 1 |

## modules/bones/bone-view-handles.js（717 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBoneViewHandlesApi` | 18 | function | export | 2 |
| `createSplitControlHandle` | 19 | function |  | 9 |
| `createCurveNormalIndicator` | 34 | function |  | 2 |
| `createBoneViewHandles` | 60 | function |  | 1 |
| `updateBoneViewHandles` | 280 | function |  | 1 |
| `syncTipNormalArrow` | 371 | arrow |  | 4 |
| `disposeBoneViewHandles` | 636 | function |  | 1 |

## modules/bones/segment-control.js（155 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createSegmentControlApi` | 15 | function | export | 1 |
| `selectedPanelSegment` | 16 | function |  | 3 |
| `syncPanelSegmentControls` | 22 | function |  | 2 |
| `syncPanelShapeInputs` | 45 | function |  | 2 |
| `openPanelSegmentCurveEditor` | 72 | function |  | 1 |
| `changePanelSplitCount` | 108 | function |  | 1 |

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

## modules/data/clump-brush-presets.js（144 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneJsonValue` | 1 | arrow |  | 4 |
| `finitePoint` | 46 | function |  | 1 |
| `normalizePoints` | 53 | function |  | 2 |
| `normalizeStrand` | 62 | function |  | 1 |
| `normalizeClumpBrushTemplate` | 82 | function | export | 2 |
| `createClumpBrushTemplate` | 107 | function | export | 1 |

## modules/data/loc-ja.js（759 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/data/loc-zh.js（745 行）

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

## modules/geometry/branch-bridge.js（992 行）

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
| `branchRootRegionSurface` | 836 | function |  | 6 |
| `toGridCol` | 861 | arrow |  | 5 |
| `toRow` | 865 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 917 | function |  | 2 |
| `branchRootRegionWorldPoints` | 937 | function |  | 1 |
| `pointAt` | 943 | arrow |  | 5 |
| `applyBranchRootOffset` | 968 | function |  | 1 |

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

## modules/geometry/panel-tip-strand.js（1077 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `tipChainPointsAsVectors` | 23 | function |  | 4 |
| `createPanelTipStrandApi` | 27 | function | export | 2 |
| `smoothCoincidentPanelNormals` | 34 | function |  | 2 |
| `weldPanelGeometryData` | 70 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 125 | function |  | 2 |
| `surfacePanelPoint` | 140 | function |  | 2 |
| `splitForkT` | 163 | function |  | 1 |
| `tipWidthSideForkT` | 175 | function |  | 8 |
| `tipSegmentWeightAt` | 186 | function |  | 2 |
| `tipWidthControlTs` | 205 | function |  | 4 |
| `tipWidthCommonForkT` | 216 | function |  | 4 |
| `tipWidthResetCurve` | 225 | function |  | 1 |
| `addPoint` | 230 | arrow |  | 7 |
| `tipWidthSpreadGap` | 258 | function |  | 4 |
| `tipWidthMultiplierAt` | 275 | function |  | 8 |
| `tipPanelWidthAt` | 317 | function |  | 6 |
| `buildTipWidthCurve` | 323 | function |  | 5 |
| `setTipWidthCurveValue` | 372 | function |  | 1 |
| `tipPanelFrameAt` | 391 | function |  | 4 |
| `tipMainSectionPoint` | 425 | function |  | 4 |
| `tipOffsetSampleT` | 473 | function |  | 2 |
| `tipSurfaceFrameAt` | 485 | function |  | 3 |
| `tipChainFrameAt` | 517 | function |  | 2 |
| `tipWidthEdgePosition` | 534 | function |  | 3 |
| `tipWidthEdgePoints` | 565 | function |  | 1 |
| `tipWidthControlPlacement` | 580 | function |  | 1 |
| `tipHighlightMaterial` | 596 | function |  | 2 |
| `updateTipHighlight` | 618 | function |  | 1 |
| `splitTipForSegment` | 676 | function |  | 3 |
| `restPointAt` | 689 | arrow |  | 0 |
| `createPanelStrandGeometry` | 694 | function |  | 1 |
| `segmentWeightAt` | 731 | arrow |  | 1 |
| `addQuad` | 749 | arrow |  | 6 |
| `near` | 753 | arrow |  | 6 |
| `panelWidthAt` | 783 | arrow |  | 3 |
| `panelThicknessAt` | 788 | arrow |  | 3 |
| `panelFrameAt` | 797 | arrow |  | 1 |
| `rawPanelPoint` | 817 | arrow |  | 1 |
| `panelPoint` | 851 | arrow |  | 3 |
| `addPatch` | 861 | arrow |  | 1 |
| `uStart` | 999 | arrow |  | 1 |
| `uEnd` | 1002 | arrow |  | 1 |

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

## modules/geometry/strand-geometry.js（1231 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandGeometryApi` | 26 | function | export | 2 |
| `clipStrandProfilePolygon` | 35 | function |  | 3 |
| `inside` | 36 | arrow |  | 2 |
| `pushOrientedTriangle` | 58 | function |  | 7 |
| `orientedQuadFace` | 67 | function |  | 2 |
| `createSplitStrandGeometry` | 75 | function |  | 2 |
| `restPointAt` | 237 | arrow |  | 0 |
| `fusedIndexAt` | 370 | arrow |  | 0 |
| `createHairCardGeometry` | 445 | function |  | 2 |
| `createPolyGeometry` | 608 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 635 | function |  | 4 |
| `createCompoundStrandGeometry` | 711 | function |  | 2 |
| `vertexIndex` | 796 | arrow |  | 6 |
| `proceduralBranchGeometryLock` | 976 | function |  | 2 |
| `createHairGeometry` | 1007 | function |  | 1 |
| `createBaseHairGeometry` | 1059 | function |  | 3 |

## modules/geometry/strand-sweep.js（157 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandSweepApi` | 10 | function | export | 1 |
| `sweepSide` | 13 | function |  | 1 |

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

## modules/geometry/taper-editor.js（1060 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createTaperEditorApi` | 22 | function | export | 2 |
| `activeStrandShapeTarget` | 37 | function |  | 2 |
| `activeTaperTarget` | 40 | function |  | 14 |
| `activeTaperCurve` | 67 | function |  | 9 |
| `ensureSecondaryTaperCurve` | 77 | function |  | 5 |
| `taperSamples` | 86 | function |  | 7 |
| `taperCurvesActuallyDiffer` | 97 | function |  | 2 |
| `taperDisplayAsymmetric` | 111 | function |  | 4 |
| `ensureAsymmetricTaperPreviewElements` | 119 | function |  | 2 |
| `renderTaperPreview` | 140 | function |  | 6 |
| `segmentCurveTarget` | 179 | function |  | 2 |
| `segmentCurveTargetForWrite` | 205 | function |  | 1 |
| `shapeTargetForSelect` | 220 | function |  | 1 |
| `taperPointToCanvas` | 225 | function |  | 4 |
| `canvasToTaperPoint` | 241 | function |  | 1 |
| `clearTaperMeshPoints` | 275 | function |  | 2 |
| `taperMeshPointFrame` | 284 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 293 | function |  | 3 |
| `addTaperMeshPointsForCurve` | 329 | function |  | 2 |
| `updateTaperMeshPoints` | 400 | function |  | 4 |
| `setTaperMeshPointsVisible` | 406 | function |  | 3 |
| `renderTaperCurveEditor` | 423 | function |  | 9 |
| `tipSideForkFor` | 440 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 517 | function |  | 4 |
| `retargetOpenTaperCurveEditor` | 530 | function |  | 1 |
| `retargetOpenSegmentTaperEditor` | 557 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 576 | function |  | 2 |
| `scheduleTaperCurveEdit` | 606 | function |  | 2 |
| `flushScheduledTaperCurveEdit` | 614 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 624 | function |  | 2 |
| `applyTaperCurveEdit` | 631 | function |  | 5 |
| `openTaperCurveEditor` | 764 | function |  | 2 |
| `closeTaperCurveEditor` | 808 | function |  | 4 |
| `retargetFloatingStrandEditors` | 820 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 834 | function |  | 2 |
| `finishTaperCurveDrag` | 845 | function |  | 1 |
| `beginTaperMeshPointDrag` | 852 | function |  | 1 |
| `updateTaperMeshPointDrag` | 932 | function |  | 1 |
| `finishTaperMeshPointDrag` | 986 | function |  | 5 |
| `updateSelectedTaperPoint` | 1009 | function |  | 1 |

## modules/geometry/tip-sub-bone.js（112 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `isValidTip` | 9 | function |  | 2 |
| `pointToData` | 13 | function |  | 5 |
| `toVector3` | 17 | function |  | 1 |
| `cloneTipChain` | 23 | function | export | 2 |
| `materializeTipChain` | 37 | function | export | 1 |
| `tipChainFrameAt` | 63 | function | export | 1 |
| `tipWeightAt` | 87 | function | export | 1 |
| `sampleTipPosition` | 93 | function | export | 1 |
| `mirrorTipChain` | 103 | function | export | 1 |

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

## modules/io/project-files.js（1275 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProjectSaveApi` | 17 | function | export | 2 |
| `downloadTextFile` | 65 | function |  | 4 |
| `downloadProjectFile` | 77 | function |  | 2 |
| `bufferAttributeTuples` | 81 | function |  | 6 |
| `flatTuples` | 88 | function |  | 6 |
| `setProjectSaveButtonsDisabled` | 97 | function |  | 5 |
| `buildHairProjectFile` | 103 | function |  | 4 |
| `kindForLock` | 120 | function |  | 4 |
| `childSeamCol` | 131 | function |  | 3 |
| `flatPanelMesh` | 138 | function |  | 2 |
| `buildUnfoldedMeshes` | 173 | function |  | 3 |
| `childVLength` | 204 | arrow |  | 0 |
| `childGridRows` | 217 | arrow |  | 0 |
| `rPosOf` | 263 | arrow |  | 2 |
| `packUnfoldedUv` | 333 | function |  | 2 |
| `buildHairObj` | 364 | function |  | 3 |
| `buildHairUsda` | 433 | function |  | 3 |
| `jointNameOf` | 449 | arrow |  | 13 |
| `rowsFor` | 680 | arrow |  | 3 |
| `rowTAt` | 693 | arrow |  | 4 |
| `smoothMainPairIndices` | 698 | arrow |  | 3 |
| `tipIdxFor` | 707 | arrow |  | 2 |
| `bindBySweepRow` | 725 | arrow |  | 2 |
| `openFileActionDialog` | 936 | function |  | 4 |
| `performFileAction` | 993 | function |  | 3 |
| `saveHairProjectFile` | 1066 | function |  | 2 |
| `saveHairProjectQuickly` | 1096 | function |  | 1 |
| `exportHairObj` | 1124 | function |  | 1 |
| `exportHairUsda` | 1133 | function |  | 1 |
| `exportHairProjectQuickly` | 1137 | function |  | 1 |
| `writeExportThroughFileSystem` | 1192 | function |  | 3 |

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

## modules/io/shape-presets.js（125 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `cloneShapePresetValue` | 3 | function | export | 9 |
| `createShapePresetsApi` | 7 | function | export | 2 |
| `taperAsymmetryKey` | 14 | function |  | 5 |
| `taperSecondaryKey` | 18 | function |  | 5 |
| `shapeValuesMatch` | 22 | function |  | 1 |
| `shapePresetLabel` | 30 | function |  | 1 |
| `loadCustomShapePresets` | 35 | function |  | 1 |
| `saveCustomShapePresets` | 46 | function |  | 1 |
| `applyShapePreset` | 54 | function |  | 1 |

## modules/io/usda-export.js（718 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `finiteNumber` | 1 | function |  | 20 |
| `formatNumber` | 6 | function |  | 9 |
| `quoteString` | 12 | function |  | 4 |
| `usdIdentifier` | 19 | function | export | 5 |
| `uniqueIdentifier` | 29 | function |  | 4 |
| `tuple` | 41 | function |  | 1 |
| `tupleArray` | 45 | function |  | 5 |
| `numberArray` | 49 | function |  | 7 |
| `flatIntArray` | 54 | function |  | 2 |
| `floatArray` | 64 | function |  | 2 |
| `metadataLines` | 73 | function |  | 3 |
| `primvarLines` | 80 | function |  | 4 |
| `hasSkinData` | 95 | function |  | 3 |
| `meshBlock` | 102 | function |  | 3 |
| `curveBlock` | 181 | function |  | 2 |
| `pointTuple` | 199 | function |  | 1 |
| `quatToMat3` | 205 | function | export | 1 |
| `axesToMat3` | 220 | function | export | 3 |
| `component` | 222 | arrow |  | 9 |
| `mat3ToMat4` | 234 | function |  | 3 |
| `translationMatrix` | 245 | function |  | 3 |
| `matrixMultiply` | 255 | function |  | 3 |
| `mat3Transpose` | 271 | function |  | 2 |
| `mat3Multiply` | 277 | function |  | 2 |
| `rowVecTimesMat3` | 295 | function |  | 2 |
| `orientOf` | 306 | function |  | 4 |
| `matrixTuple` | 311 | function |  | 3 |
| `skeletonBlock` | 333 | function |  | 2 |
| `jointId` | 337 | arrow |  | 2 |
| `fullPathOf` | 341 | arrow |  | 2 |
| `worldOf` | 351 | arrow |  | 6 |
| `localOf` | 364 | arrow |  | 1 |
| `smoothMainPair` | 397 | function | export | 1 |
| `clamp` | 398 | arrow |  | 12 |
| `tipChainNearestIndex` | 408 | function | export | 1 |
| `exportAnimeHairUsda` | 418 | function | export | 1 |
| `splitBoneLayout` | 504 | function | export | 1 |
| `splitChainLayout` | 578 | function | export | 1 |
| `smoothstep` | 624 | arrow |  | 1 |
| `restPointAt` | 628 | arrow |  | 0 |
| `cross` | 660 | arrow |  | 2 |
| `bridgeRootParentName` | 707 | function | export | 1 |

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

## modules/io/uv-unfold.js（665 行）

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
