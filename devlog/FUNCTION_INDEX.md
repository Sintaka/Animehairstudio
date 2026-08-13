# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-13），由 `node scripts/gen-function-index.js` 产出。共 **2007** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（20053 行）

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
| `cancelRecoverySchedule` | 2455 | function |  | 5 |
| `recoveryWriteMustWait` | 2467 | function |  | 3 |
| `scheduleRecoveryAutosave` | 2474 | function |  | 7 |
| `markProjectChangedForRecovery` | 2486 | function |  | 4 |
| `queueRecoveryAutosave` | 2492 | function |  | 1 |
| `run` | 2506 | arrow |  | 1 |
| `buildRecoveryProjectContent` | 2519 | function |  | 2 |
| `flushRecoveryAutosave` | 2530 | function |  | 2 |
| `clearAcknowledgedRecovery` | 2555 | function |  | 1 |
| `setAutosaveEnabled` | 2571 | function |  | 5 |
| `setAutosaveInterval` | 2580 | function |  | 5 |
| `offerRecoverySnapshot` | 2590 | function |  | 2 |
| `recoverPendingProject` | 2615 | function |  | 1 |
| `discardPendingRecovery` | 2639 | function |  | 1 |
| `downloadPendingRecovery` | 2651 | function |  | 1 |
| `normalizeHairLayer` | 3596 | function |  | 20 |
| `layerOffsetForLock` | 3600 | function |  | 3 |
| `layerRootOffsetFactor` | 3605 | function |  | 7 |
| `layerOffsetWeight` | 3609 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3615 | function |  | 5 |
| `pointsWithLayerOffset` | 3624 | function |  | 1 |
| `layerDirectionForLock` | 3632 | function |  | 2 |
| `applyLayerOffset` | 3643 | function |  | 5 |
| `setLockHairLayer` | 3667 | function |  | 2 |
| `setGroupLayerOffset` | 3682 | function |  | 2 |
| `quadraticWeights` | 3710 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3911 | function |  | 1 |
| `upperContourCurve` | 3928 | function |  | 2 |
| `hermitePoint` | 3963 | function |  | 2 |
| `curveNetworkSection` | 3974 | function |  | 1 |
| `pointAlongSection` | 4003 | function |  | 1 |
| `longestStitchedContour` | 4009 | function |  | 2 |
| `nodeForPoint` | 4017 | arrow |  | 2 |
| `constructionCurveFromSegments` | 4074 | function |  | 1 |
| `exitSetupEditors` | 4094 | function |  | 6 |
| `syncAppMenuVisibility` | 4104 | function |  | 3 |
| `closeAppMenus` | 4110 | function |  | 5 |
| `setAppMenuOpen` | 4121 | function |  | 2 |
| `setTurntableActive` | 4128 | function |  | 3 |
| `setOutlinerTab` | 4167 | function |  | 7 |
| `effectiveViewportSelectionMode` | 4185 | function |  | 4 |
| `componentEditModeActive` | 4189 | function |  | 31 |
| `selectionToolSupportsPicking` | 4193 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4198 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4214 | function |  | 2 |
| `setViewportSelectionMode` | 4245 | function |  | 3 |
| `setViewportEditMode` | 4257 | function |  | 7 |
| `createOutlinerVisibilityToggle` | 4300 | function |  | 5 |
| `setLocksOutlinerVisibility` | 4314 | function |  | 7 |
| `normalizeOutlinerName` | 4328 | function |  | 3 |
| `beginOutlinerRename` | 4333 | function |  | 2 |
| `finish` | 4344 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4374 | function |  | 4 |
| `strandPassesDisplayFilters` | 4524 | function |  | 4 |
| `strandVisibleForDisplay` | 4533 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 4538 | function |  | 3 |
| `lockedStrandsExist` | 4542 | function |  | 1 |
| `hiddenStrandsExist` | 4546 | function |  | 1 |
| `hideSelectedStrands` | 4550 | function |  | 1 |
| `unhideHiddenStrands` | 4560 | function |  | 1 |
| `strandIsolationActive` | 4569 | function |  | 4 |
| `setStrandIsolation` | 4573 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 4585 | function |  | 2 |
| `syncVisibilityParent` | 4596 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 4603 | function |  | 7 |
| `applyCharacterMeshDisplayVisibility` | 4632 | function |  | 4 |
| `applyStrandDisplayVisibility` | 4639 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 4662 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 4880 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 4901 | function |  | 1 |
| `createStrandsFromCurveLattice` | 4920 | function |  | 2 |
| `selectedViewportFocusBounds` | 5018 | function |  | 2 |
| `frameViewportBounds` | 5032 | function |  | 4 |
| `centerViewportOnSelectedItem` | 5063 | function |  | 2 |
| `fullSceneFocusBounds` | 5067 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 5082 | function |  | 3 |
| `cycleViewportFraming` | 5091 | function |  | 2 |
| `sculptBrushToolActive` | 5111 | function |  | 22 |
| `sculptBrushSelectionMaskActive` | 5115 | function |  | 3 |
| `sculptBrushSelectionAllows` | 5119 | function |  | 2 |
| `effectiveSculptBrushTool` | 5123 | function |  | 3 |
| `updateSculptScaleModeRow` | 5129 | function |  | 4 |
| `syncSculptBrushToolButtons` | 5134 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 5156 | function |  | 5 |
| `setActiveTool` | 5165 | function |  | 10 |
| `setDrawStrandMode` | 5303 | function |  | 1 |
| `setObjectSpaceEditing` | 5313 | function |  | 5 |
| `setHierarchyEditing` | 5329 | function |  | 4 |
| `setProportionalEditing` | 5341 | function |  | 5 |
| `beginProportionalSizeEdit` | 5360 | function |  | 3 |
| `updateProportionalSizeEdit` | 5372 | function |  | 2 |
| `endProportionalSizeEdit` | 5383 | function |  | 5 |
| `activateProportionalHotkeyHold` | 5390 | function |  | 2 |
| `refreshProportionalPreview` | 5398 | function |  | 4 |
| `activeBrushSizeInput` | 5408 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 5417 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 5429 | function |  | 2 |
| `beginBrushSizeDrag` | 5447 | function |  | 1 |
| `updateBrushSizeDrag` | 5474 | function |  | 1 |
| `finishBrushSizeDrag` | 5495 | function |  | 2 |
| `updateInteractionLocks` | 5512 | function |  | 39 |
| `configureTransformControls` | 5523 | function |  | 11 |
| `pullMoveActive` | 5531 | function |  | 8 |
| `updatePullGuideVisual` | 5535 | function |  | 4 |
| `attachTransformForCurvePoint` | 5551 | function |  | 5 |
| `pointerHitsTransformGizmo` | 5575 | function |  | 5 |
| `strandObjectRootIndex` | 5591 | function |  | 3 |
| `strandObjectRoot` | 5600 | function |  | 5 |
| `normalizeStrandObjectTransform` | 5610 | function |  | 12 |
| `strandObjectTransformQuaternionFromValues` | 5625 | function |  | 4 |
| `strandObjectTransformValuesAfterHandle` | 5635 | function |  | 3 |
| `mirroredStrandObjectTransform` | 5661 | function |  | 2 |
| `objectTransformPanelLock` | 5670 | function |  | 3 |
| `formatStrandObjectTransformValue` | 5677 | function |  | 2 |
| `syncStrandObjectTransformPanel` | 5682 | function |  | 7 |
| `applyStrandObjectTransformPanelValues` | 5708 | function |  | 2 |
| `strandObjectTransformQuaternion` | 5769 | function |  | 3 |
| `attachStrandObjectTransform` | 5774 | function |  | 6 |
| `guideObjectPivot` | 5797 | function |  | 3 |
| `guideObjectTransformQuaternion` | 5808 | function |  | 2 |
| `attachGuideObjectTransform` | 5813 | function |  | 5 |
| `guideObjectTransformSnapshot` | 5832 | function |  | 2 |
| `beginGuideObjectTransform` | 5860 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 5867 | function |  | 2 |
| `updateGuideObjectTransform` | 5889 | function |  | 2 |
| `finishGuideObjectTransform` | 5922 | function |  | 2 |
| `clonePlacementFrame` | 5931 | function |  | 2 |
| `cloneOptionalVectors` | 5943 | function |  | 10 |
| `strandObjectTransformSnapshot` | 5947 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 5965 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 5980 | function |  | 2 |
| `strandObjectTransformOperators` | 5996 | function |  | 4 |
| `transformPoint` | 6004 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 6011 | arrow |  | 0 |
| `transformNormal` | 6017 | arrow |  | 10 |
| `transformDirection` | 6027 | arrow |  | 1 |
| `worldMatrixForPivot` | 6039 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 6045 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 6061 | function |  | 6 |
| `beginStrandObjectTransform` | 6087 | function |  | 3 |
| `updateStrandObjectTransform` | 6125 | function |  | 2 |
| `commitStrandObjectTransform` | 6183 | function |  | 2 |
| `mapPoints` | 6198 | arrow |  | 4 |
| `finishStrandObjectTransform` | 6232 | function |  | 3 |
| `surfaceObjectAnchorPose` | 6247 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 6270 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 6283 | function |  | 3 |
| `beginSurfaceObjectTransform` | 6298 | function |  | 2 |
| `updateSurfaceObjectTransform` | 6324 | function |  | 2 |
| `finishSurfaceObjectTransform` | 6373 | function |  | 2 |
| `beginHandleEdit` | 6382 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 6435 | function |  | 3 |
| `multiPointHandleEditActive` | 6446 | function |  | 7 |
| `applyMultiMove` | 6450 | function |  | 5 |
| `applyMultiRotate` | 6456 | function |  | 2 |
| `applyMultiScale` | 6465 | function |  | 2 |
| `applyHierarchicalMove` | 6474 | function |  | 3 |
| `applySingleMove` | 6486 | function |  | 5 |
| `applySurfaceLatticeMirror` | 6490 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 6507 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 6516 | function |  | 3 |
| `changed` | 6526 | arrow |  | 1 |
| `applyPullMove` | 6568 | function |  | 3 |
| `pullHeadCollisionContext` | 6576 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 6595 | function |  | 2 |
| `applyProportionalMove` | 6618 | function |  | 3 |
| `viewPlaneNormal` | 6629 | function |  | 4 |
| `isCameraInSnappedView` | 6633 | function |  | 2 |
| `viewPlaneMoveActiveForView` | 6641 | function |  | 9 |
| `updateViewPlaneGrid` | 6645 | function |  | 13 |
| `setViewPlaneMove` | 6702 | function |  | 3 |
| `setViewPlaneMoveSnappedOnly` | 6713 | function |  | 2 |
| `rayFromViewportEvent` | 6721 | function |  | 8 |
| `worldUnitsPerViewportPixel` | 6729 | function |  | 4 |
| `viewPlaneMovePointNormal` | 6739 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 6750 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 6763 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 6782 | function |  | 4 |
| `beginViewPlaneMove` | 6789 | function |  | 3 |
| `updateViewPlaneMove` | 6853 | function |  | 1 |
| `endViewPlaneMove` | 6918 | function |  | 7 |
| `applyHierarchicalRotate` | 6937 | function |  | 2 |
| `rotateGuideNormal` | 6944 | arrow |  | 4 |
| `applySingleRotate` | 6982 | function |  | 2 |
| `applyProportionalRotate` | 6986 | function |  | 2 |
| `applyHierarchicalScale` | 7006 | function |  | 2 |
| `applySingleScale` | 7016 | function |  | 2 |
| `applyProportionalScale` | 7020 | function |  | 2 |
| `setPointScale` | 7036 | function |  | 6 |
| `proportionalWeight` | 7045 | function |  | 8 |
| `proportionalStrandVisualsActive` | 7057 | function |  | 5 |
| `strandInfluenceColor` | 7063 | function |  | 4 |
| `beginRelaxEdit` | 7088 | function |  | 3 |
| `updateRelaxEdit` | 7117 | function |  | 1 |
| `endRelaxEdit` | 7177 | function |  | 1 |
| `disposeGuide` | 7187 | function |  | 3 |
| `removeGuideObjects` | 7215 | function |  | 3 |
| `strandRadiusAt` | 7229 | function |  | 5 |
| `strandProfileTopologyAt` | 7246 | function |  | 2 |
| `strandCurveParameters` | 7288 | function |  | 2 |
| `widthProfileAt` | 7298 | arrow |  | 1 |
| `braidFrameAt` | 7336 | function |  | 4 |
| `braidFrameAtExtended` | 7346 | function |  | 2 |
| `createBraidProfileProjector` | 7355 | function |  | 2 |
| `project` | 7371 | arrow |  | 11 |
| `createBraidGeometry` | 7386 | function |  | 1 |
| `quantize` | 7419 | arrow |  | 19 |
| `deformationAt` | 7421 | function |  | 3 |
| `widthFor` | 7430 | arrow |  | 3 |
| `depthFor` | 7434 | arrow |  | 3 |
| `outputVertex` | 7466 | function |  | 7 |
| `appendAuthoredCap` | 7574 | function |  | 3 |
| `outputCapVertex` | 7581 | arrow |  | 6 |
| `capBoundary` | 7672 | function |  | 3 |
| `strandGeometryCurve` | 7734 | function |  | 8 |
| `strandGeometryFrameAt` | 7760 | function |  | 6 |
| `transportedStrandFrameAt` | 7823 | function |  | 4 |
| `twistOverrideAt` | 7826 | arrow |  | 2 |
| `createHairTopologyGeometry` | 7899 | function |  | 4 |
| `createHairTopologyOverlay` | 7920 | function |  | 3 |
| `groupDefaultsFor` | 7967 | function |  | 7 |
| `creationToolActive` | 7974 | function |  | 5 |
| `activeCreationShapeDefaults` | 7978 | function |  | 6 |
| `curvePolylineLength` | 7985 | function |  | 2 |
| `curvePolylineLengths` | 7993 | function |  | 3 |
| `samplePolylineDistance` | 8001 | function |  | 2 |
| `applyProjectedCurveLength` | 8011 | function |  | 4 |
| `clearRegionLengthBaseline` | 8042 | function |  | 2 |
| `ensureRegionLengthBaseline` | 8049 | function |  | 2 |
| `setGroupLengthScale` | 8057 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 8095 | function |  | 3 |
| `requestGroupDefaultsWarning` | 8127 | function |  | 1 |
| `activeProfileOffset` | 8139 | function |  | 3 |
| `profileToCanvas` | 8147 | function |  | 1 |
| `renderProfilePreview` | 8154 | function |  | 7 |
| `renderHairCardCoveragePath` | 8173 | function |  | 2 |
| `updateViewportStatsVisibility` | 8691 | function |  | 1 |
| `canvasToProfile` | 8710 | function |  | 2 |
| `addLock` | 8725 | function |  | 4 |
| `mirroredVector` | 8947 | function |  | 12 |
| `mirroredPlacementFrame` | 8951 | function |  | 2 |
| `mirrorPartnerFor` | 8964 | function |  | 28 |
| `decoupleMirrorPartner` | 8968 | function |  | 2 |
| `createMirrorPartner` | 8976 | function |  | 3 |
| `createMirrorPartnerForNewLock` | 9077 | function |  | 1 |
| `syncMirrorPartnerFromLock` | 9096 | function |  | 3 |
| `syncActiveMirror` | 9273 | function |  | 17 |
| `setMirrorXEditing` | 9285 | function |  | 5 |
| `snapshotState` | 9309 | function |  | 5 |
| `pushUndoState` | 9657 | function |  | 68 |
| `undoLastAction` | 9665 | function |  | 2 |
| `redoLastAction` | 9684 | function |  | 2 |
| `updateHistoryButtons` | 9703 | function |  | 5 |
| `resetTransientInteractionsForStateRestore` | 9708 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 9728 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 9735 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 9775 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 9801 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 9833 | function |  | 2 |
| `finalizeStateRestore` | 9874 | function |  | 2 |
| `restoreState` | 9881 | function |  | 3 |
| `disposeAllEditableObjects` | 9905 | function |  | 2 |
| `restoreLock` | 9926 | function |  | 2 |
| `restoreGuide` | 10160 | function |  | 2 |
| `vectorToData` | 10221 | function |  | 15 |
| `dataToVector` | 10225 | function |  | 14 |
| `frameToData` | 10255 | function |  | 2 |
| `frameFromData` | 10267 | function |  | 2 |
| `average` | 10279 | function |  | 3 |
| `fitPointAttributes` | 10283 | function |  | 5 |
| `rebuildCurveObjects` | 10312 | function |  | 4 |
| `createCurvePoints` | 10324 | function |  | 2 |
| `deselectStrands` | 10428 | function |  | 9 |
| `beginSelectionMarquee` | 10443 | function |  | 3 |
| `beginAltOrbit` | 10467 | function |  | 1 |
| `beginBlenderNavigation` | 10484 | function |  | 1 |
| `endBlenderNavigation` | 10534 | function |  | 1 |
| `prepareSelectPointerCapture` | 10542 | function |  | 1 |
| `endSelectPointerCapture` | 10548 | function |  | 1 |
| `applyAltClickCandidate` | 10554 | function |  | 2 |
| `finishBrushAltClick` | 10580 | function |  | 1 |
| `endAltOrbit` | 10593 | function |  | 2 |
| `dollyCameraByDrag` | 10600 | function |  | 2 |
| `fastDragMagnitude` | 10623 | function |  | 2 |
| `beginHoudiniZoomDrag` | 10629 | function |  | 1 |
| `updateHoudiniZoomDrag` | 10637 | function |  | 1 |
| `endHoudiniZoomDrag` | 10654 | function |  | 1 |
| `updateSelectionMarquee` | 10662 | function |  | 1 |
| `pointInsideSelectionMarquee` | 10679 | function |  | 3 |
| `selectPointsInMarquee` | 10687 | function |  | 2 |
| `pointKey` | 10713 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 10744 | function |  | 2 |
| `objectInsideSelectionMarquee` | 10781 | function |  | 3 |
| `projectedPoint` | 10798 | arrow |  | 1 |
| `selectObjectsInMarquee` | 10827 | function |  | 2 |
| `finishSelectionMarquee` | 10872 | function |  | 2 |
| `strandSplitProfileData` | 10896 | function |  | 2 |
| `strandSplitControlPoint` | 10909 | function |  | 1 |
| `panelSplitControlPoint` | 10945 | function |  | 3 |
| `panelWidthAt` | 10962 | arrow |  | 3 |
| `panelThicknessAt` | 10969 | arrow |  | 3 |
| `strandControlPointRaycast` | 11002 | function |  | 1 |
| `strandControlPointFrame` | 11037 | function |  | 4 |
| `strandControlPointHitFromEvent` | 11069 | function |  | 3 |
| `createCurveObjects` | 11127 | function |  | 4 |
| `createDimensionEdgeLines` | 11156 | arrow |  | 2 |
| `strandWidthEdgeFrameAt` | 11272 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 11279 | function |  | 2 |
| `strandWidthEdgeSample` | 11288 | function |  | 3 |
| `strandWidthEdgePoints` | 11323 | function |  | 2 |
| `moveCurveControlsApplicable` | 11337 | function |  | 5 |
| `moveGrabHandlesApplicable` | 11347 | function |  | 2 |
| `moveGrabHandleVisible` | 11357 | function |  | 2 |
| `visibleTaperMeshCurveEdits` | 11362 | function |  | 1 |
| `syncMoveCurveControls` | 11383 | function |  | 8 |
| `syncAuthoredCheckbox` | 11398 | arrow |  | 3 |
| `setMoveGrabHandleVisibility` | 11418 | function |  | 4 |
| `setMoveCurveControlVisibility` | 11426 | function |  | 4 |
| `setSelectedMoveCurveShapeFlag` | 11435 | function |  | 4 |
| `sculptBrushDebugRaycast` | 11449 | arrow |  | 0 |
| `updateCurveObjects` | 11451 | function |  | 27 |
| `pointUpDirection` | 11656 | function |  | 2 |
| `curveFrameAtPoint` | 11660 | function |  | 4 |
| `curveFrameAt` | 11681 | function |  | 3 |
| `strandTwistAt` | 11701 | function |  | 6 |
| `controlPointRotationAt` | 11706 | function |  | 3 |
| `strandProfileTwistAt` | 11710 | function |  | 2 |
| `strandFrameAt` | 11716 | function |  | 1 |
| `curveFrameAtSnapshot` | 11722 | function |  | 3 |
| `outwardNormalAtPoint` | 11741 | function |  | 5 |
| `sampledSurfaceNormal` | 11804 | function |  | 2 |
| `guidedNormalAt` | 11820 | function |  | 4 |
| `twistFromHandle` | 11839 | function |  | 3 |
| `signedAngleAroundAxis` | 11860 | function |  | 4 |
| `handleColor` | 11867 | function |  | 2 |
| `isAffectedCurvePoint` | 11890 | function |  | 2 |
| `syncLockFromCurve` | 11896 | function |  | 14 |
| `rebuildLockGeometry` | 11926 | function |  | 16 |
| `flushPendingLockGeometryUpdates` | 11950 | function |  | 6 |
| `updateLockGeometry` | 11963 | function |  | 28 |
| `setGroupColorView` | 11984 | function |  | 2 |
| `createUvCheckerTexture` | 11994 | function |  | 3 |
| `ensureUvCheckerForLock` | 12030 | function |  | 3 |
| `removeUvCheckerFromLock` | 12063 | function |  | 3 |
| `invalidateUvInspector` | 12078 | function |  | 7 |
| `uvInspectorRecord` | 12082 | function |  | 1 |
| `uvInspectorRecords` | 12121 | function |  | 2 |
| `drawUvInspectorGrid` | 12125 | function |  | 2 |
| `renderUvInspector` | 12159 | function |  | 3 |
| `setUvCheckerEnabled` | 12218 | function |  | 3 |
| `strandViewportBaseColor` | 12235 | function |  | 2 |
| `strandMirrorPartnerHighlighted` | 12270 | function |  | 3 |
| `syncStrandSelectionOutline` | 12276 | function |  | 2 |
| `applyLockedStrandPalette` | 12287 | function |  | 2 |
| `syncLockedStrandWireVisual` | 12296 | function |  | 5 |
| `setStrandSelectionVisual` | 12305 | function |  | 4 |
| `updateStrandSelectionHighlightForLock` | 12323 | function |  | 1 |
| `updateStrandSelectionHighlight` | 12327 | function |  | 6 |
| `refreshStrandCurveSelectionVisuals` | 12331 | function |  | 2 |
| `resetGuideSelectionVisuals` | 12344 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 12364 | function |  | 3 |
| `selectLock` | 12399 | function |  | 24 |
| `deselectStrandsForGuideEditor` | 12461 | function |  | 1 |
| `syncGroupInputs` | 12472 | function |  | 2 |
| `topologyStatsForLock` | 12505 | function |  | 4 |
| `formatTopologyStats` | 12513 | function |  | 5 |
| `updateTopologyStats` | 12517 | function |  | 15 |
| `normalizeStrandDimensions` | 12551 | function |  | 3 |
| `strandBaseWidth` | 12565 | function |  | 5 |
| `strandWidthDimension` | 12569 | function |  | 5 |
| `strandDepthDimension` | 12577 | function |  | 8 |
| `setStrandWidthDimension` | 12585 | function |  | 2 |
| `setStrandDepthDimension` | 12607 | function |  | 4 |
| `syncShapeDimensionInputs` | 12623 | function |  | 4 |
| `syncCreationShapeInputs` | 12659 | function |  | 2 |
| `syncViewportDrawSettings` | 12698 | function |  | 4 |
| `syncViewportTopControlRows` | 12713 | function |  | 6 |
| `syncResponsiveSidebarDock` | 12733 | function |  | 2 |
| `syncStrandSplitInputs` | 12766 | function |  | 4 |
| `currentStrandTipChain` | 12776 | function |  | 5 |
| `currentStrandTipLength` | 12783 | function |  | 2 |
| `syncStrandTipInputs` | 12792 | function |  | 4 |
| `currentStrandSplitTipChains` | 12807 | function |  | 4 |
| `restPointAt` | 12826 | arrow |  | 0 |
| `currentStrandSplitTipLength` | 12842 | function |  | 2 |
| `syncStrandSplitTipInputs` | 12853 | function |  | 3 |
| `syncHairCardControls` | 12864 | function |  | 6 |
| `updateAttributeEditorMode` | 12873 | function |  | 10 |
| `pinActiveToolSettingsPanel` | 13028 | function |  | 2 |
| `curveLatticeForGroup` | 13051 | function |  | 2 |
| `filterCurveLatticesToGroup` | 13069 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 13114 | function |  | 2 |
| `showCurveLatticeForGroup` | 13131 | function |  | 2 |
| `selectStrandGroup` | 13168 | function |  | 3 |
| `selectCurvePoint` | 13210 | function |  | 3 |
| `updateSelectedPointLabel` | 13224 | function |  | 12 |
| `syncInputs` | 13237 | function |  | 13 |
| `getSelectedLock` | 13285 | function |  | 98 |
| `selectedLocksInOrder` | 13289 | function |  | 26 |
| `lockStrands` | 13295 | function |  | 3 |
| `lockSelectedStrands` | 13328 | function |  | 2 |
| `unlockStrands` | 13334 | function |  | 3 |
| `unlockAllStrands` | 13349 | function |  | 2 |
| `strandEditFamily` | 13353 | function |  | 7 |
| `compatibleSelectedLocks` | 13358 | function |  | 5 |
| `selectedEditRoots` | 13365 | function |  | 2 |
| `editSelectedLocks` | 13378 | function |  | 18 |
| `multiEditValuesEqual` | 13411 | function |  | 2 |
| `setMixedControl` | 13420 | function |  | 29 |
| `syncMultiStrandInputs` | 13437 | function |  | 18 |
| `values` | 13453 | arrow |  | 35 |
| `selectedRebuildableCurves` | 13534 | function |  | 5 |
| `createCompoundStrand` | 13541 | function |  | 1 |
| `refreshRebuildCurveDialog` | 13602 | function |  | 7 |
| `openRebuildCurveDialog` | 13615 | function |  | 1 |
| `rebuildSelectedCurves` | 13629 | function |  | 2 |
| `cleanSelectionSets` | 13670 | function |  | 2 |
| `createSelectionSetFromSelection` | 13675 | function |  | 2 |
| `selectionSetById` | 13686 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 13690 | function |  | 7 |
| `editSelectionSetFromSelection` | 13699 | function |  | 4 |
| `closeSelectionSetMembershipDialog` | 13719 | function |  | 3 |
| `openSelectionSetMembershipDialog` | 13725 | function |  | 3 |
| `deleteSelectionSet` | 13757 | function |  | 2 |
| `selectSelectionSet` | 13766 | function |  | 2 |
| `deleteSelectedStrands` | 13776 | function |  | 3 |
| `deleteGuide` | 13784 | function |  | 3 |
| `deleteSelectedGuide` | 13807 | function |  | 3 |
| `hasDeletableSelection` | 13812 | function |  | 2 |
| `deleteCurrentSelection` | 13820 | function |  | 3 |
| `hideOutlinerContextMenu` | 13828 | function |  | 16 |
| `outlinerLockTargets` | 13833 | function |  | 3 |
| `showOutlinerContextMenu` | 13860 | function |  | 6 |
| `setPullMoveEnabled` | 13957 | function |  | 2 |
| `setNavigationTipsEnabled` | 13966 | function |  | 4 |
| `configureNavigationMouseButtons` | 13973 | function |  | 3 |
| `syncNavigationModifierLocks` | 13986 | function |  | 7 |
| `setNavigationStyle` | 13991 | function |  | 4 |
| `applyCameraSmoothingPreference` | 14007 | function |  | 4 |
| `setCameraSmoothingEnabled` | 14022 | function |  | 4 |
| `setCameraSmoothingStrength` | 14028 | function |  | 4 |
| `setScaleSensitivity` | 14036 | function |  | 3 |
| `setToolTipsEnabled` | 14044 | function |  | 4 |
| `setCompactToolButtonsEnabled` | 14051 | function |  | 4 |
| `setViewportStatisticsEnabled` | 14060 | function |  | 4 |
| `setTwistCurveAllStrandsPreviewEnabled` | 14068 | function |  | 4 |
| `setLayerColorShiftsEnabled` | 14083 | function |  | 4 |
| `setOutlinerFolderColorsEnabled` | 14092 | function |  | 4 |
| `setSidePanelStyle` | 14102 | function |  | 5 |
| `setGlassPanelColor` | 14120 | function |  | 6 |
| `setOutlinerFolderColorOpacity` | 14130 | function |  | 5 |
| `sideNamingDisplayId` | 14147 | function |  | 2 |
| `strandRegionDisplayLabel` | 14160 | function |  | 6 |
| `updateSideNamingLabels` | 14178 | function |  | 2 |
| `setSideNamingPerspective` | 14205 | function |  | 4 |
| `setControlPointDisplaySize` | 14214 | function |  | 5 |
| `scaleHexColor` | 14226 | function |  | 3 |
| `setViewportBackgroundColor` | 14231 | function |  | 6 |
| `setDefaultHairShader` | 14253 | function |  | 4 |
| `setPreferenceCategory` | 14259 | function |  | 4 |
| `openPreferencesDialog` | 14286 | function |  | 1 |
| `savePreferencesDialog` | 14325 | function |  | 1 |
| `cancelPreferencesDialog` | 14355 | function |  | 3 |
| `createOutlinerStrandButton` | 14395 | function |  | 2 |
| `createOutlinerCurveSurface` | 14481 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 14578 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 14585 | function |  | 2 |
| `renderLockList` | 14664 | function |  | 37 |
| `updateCount` | 14845 | function |  | 10 |
| `captureInputUndo` | 14854 | function |  | 1 |
| `bindUndoCapture` | 14860 | function |  | 41 |
| `bindLockInput` | 14871 | function |  | 2 |
| `applyValue` | 14888 | arrow |  | 2 |
| `applyUniformTransformScale` | 15223 | function |  | 2 |
| `applyReducedTransformScale` | 15240 | function |  | 2 |
| `applyTransformPrecision` | 15279 | function |  | 2 |
| `updateTransformScalePointer` | 15308 | function |  | 1 |
| `syncDrawCurlControls` | 16383 | function |  | 5 |
| `handleLiveSurfaceChange` | 16431 | function |  | 1 |
| `applyStrandTipToTarget` | 16491 | function |  | 5 |
| `strandTipTarget` | 16502 | function |  | 5 |
| `strandSplitTipTarget` | 16575 | function |  | 3 |
| `applyStrandSplitTipToTarget` | 16580 | function |  | 3 |
| `selectedBranchChildLock` | 16872 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 16876 | function |  | 2 |
| `updateSweepOverlapSliderInputs` | 16917 | function |  | 2 |
| `initPanelResizeHandles` | 17061 | function |  | 2 |
| `applyWidth` | 17067 | arrow |  | 2 |
| `restoreWidth` | 17074 | arrow |  | 2 |
| `bindResize` | 17082 | arrow |  | 2 |
| `onMove` | 17091 | arrow |  | 0 |
| `onUp` | 17095 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 17112 | function |  | 2 |
| `initFloatingPanelControls` | 17121 | function |  | 2 |
| `detach` | 17130 | arrow |  | 22 |
| `endDrag` | 17168 | arrow |  | 0 |
| `endResize` | 17200 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 17211 | function |  | 3 |
| `selectPatchNotesVersion` | 17370 | function |  | 3 |
| `toggleCapsuleGuideTool` | 17601 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 17607 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 17614 | function |  | 1 |
| `deleteLocks` | 18181 | function |  | 4 |
| `disposeCurveObjects` | 18259 | function |  | 4 |
| `activateMultiCameraView` | 18306 | arrow |  | 1 |
| `resize` | 18338 | function |  | 6 |
| `handleViewportPointerMove` | 18364 | function |  | 1 |
| `blockProportionalSizingEvent` | 18375 | function |  | 1 |
| `updateLightAngleFromInputs` | 18381 | function |  | 2 |
| `startViewSnap` | 18395 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 18425 | function |  | 3 |
| `trackViewportPointerDown` | 18442 | function |  | 1 |
| `trackViewportPointerMove` | 18458 | function |  | 1 |
| `clearViewportPointer` | 18466 | function |  | 1 |
| `updateViewSnap` | 18471 | function |  | 1 |
| `nearestCardinalAxis` | 18507 | function |  | 6 |
| `cardinalAxisKey` | 18521 | function |  | 6 |
| `steppedDragAmount` | 18525 | function |  | 3 |
| `snapCameraToCardinalAxis` | 18531 | function |  | 5 |
| `endViewSnap` | 18547 | function |  | 4 |
| `updateCameraViewCube` | 18566 | function |  | 3 |
| `activateView` | 18584 | function |  | 1 |
| `activateStrandControlPoint` | 18609 | function |  | 2 |
| `refreshStrandControlPointSelection` | 18659 | function |  | 4 |
| `addStrandControlPointSelection` | 18686 | function |  | 2 |
| `removeStrandControlPointSelection` | 18703 | function |  | 3 |
| `sampleStrandPointNormal` | 18717 | function |  | 2 |
| `sampleStrandPointVectors` | 18727 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 18733 | function |  | 2 |
| `resampleStrandCurveData` | 18744 | function |  | 4 |
| `resampleMatchingVectors` | 18750 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 18789 | function |  | 4 |
| `removeStrandCurvePoint` | 18800 | function |  | 2 |
| `closestStrandCurveParameter` | 18813 | function |  | 1 |
| `insertStrandCurvePoint` | 18842 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 18859 | function |  | 2 |
| `selectionModifierCursorAvailable` | 18869 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 18885 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 18892 | function |  | 4 |
| `finishCurvePointInsertion` | 18915 | function |  | 1 |
| `finishPointRemoval` | 18930 | function |  | 1 |
| `isHairCreateTool` | 18949 | function |  | 4 |
| `syncStrandHoverOutline` | 18953 | function |  | 1 |
| `pointerOverTaperEditor` | 18966 | function |  | 2 |
| `updateStrandBrushHover` | 18973 | function |  | 1 |
| `strandControlPointHit` | 18997 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 19001 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 19079 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 19113 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 19153 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 19166 | function |  | 1 |
| `setHoveredControlPoint` | 19205 | function |  | 7 |
| `visibleControlPointHoverTargets` | 19218 | function |  | 2 |
| `updateControlPointHover` | 19254 | function |  | 1 |
| `animate` | 19873 | function |  | 2 |
| `syncCompactSidebarLayout` | 19909 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 19928 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 19934 | function |  | 3 |
| `setAttributeEditorTab` | 19940 | function |  | 6 |

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

## modules/core/hair-store.js（36 行）

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

## modules/data/loc-ja.js（758 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|

## modules/data/loc-zh.js（744 行）

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

## modules/geometry/branch-bridge.js（962 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createBranchBridgeApi` | 8 | function | export | 2 |
| `buildBranchBridgeGeometry` | 14 | function |  | 2 |
| `pushBoundary` | 43 | arrow |  | 5 |
| `boundaryAt` | 61 | arrow |  | 3 |
| `hermite` | 83 | arrow |  | 2 |
| `emitBottomMidRow` | 128 | arrow |  | 2 |
| `emitTopMidRow` | 227 | arrow |  | 2 |
| `sideHoleVertex` | 269 | arrow |  | 4 |
| `cachedSideHoleVertex` | 318 | arrow |  | 2 |
| `emitFillStrip` | 389 | arrow |  | 2 |
| `fillSide` | 400 | arrow |  | 0 |
| `directBridgeQuadIndex` | 444 | arrow |  | 2 |
| `edgeDirection` | 468 | arrow |  | 1 |
| `createBranchChildGeometry` | 538 | function |  | 1 |
| `applyBranchRootRegionCarving` | 730 | function |  | 1 |
| `branchRootRegionSurface` | 806 | function |  | 6 |
| `toGridCol` | 831 | arrow |  | 5 |
| `toRow` | 835 | arrow |  | 2 |
| `branchRegionTopEdgeCount` | 887 | function |  | 2 |
| `branchRootRegionWorldPoints` | 907 | function |  | 1 |
| `pointAt` | 913 | arrow |  | 5 |
| `applyBranchRootOffset` | 938 | function |  | 1 |

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

## modules/geometry/curve-math.js（1360 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `clamp` | 2 | function |  | 57 |
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

## modules/geometry/panel-tip-strand.js（1049 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `tipChainPointsAsVectors` | 23 | function |  | 4 |
| `createPanelTipStrandApi` | 27 | function | export | 2 |
| `smoothCoincidentPanelNormals` | 34 | function |  | 2 |
| `weldPanelGeometryData` | 70 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 116 | function |  | 2 |
| `surfacePanelPoint` | 131 | function |  | 2 |
| `splitForkT` | 154 | function |  | 1 |
| `tipWidthSideForkT` | 166 | function |  | 8 |
| `tipSegmentWeightAt` | 177 | function |  | 2 |
| `tipWidthControlTs` | 196 | function |  | 4 |
| `tipWidthCommonForkT` | 207 | function |  | 4 |
| `tipWidthResetCurve` | 216 | function |  | 1 |
| `addPoint` | 221 | arrow |  | 7 |
| `tipWidthSpreadGap` | 249 | function |  | 4 |
| `tipWidthMultiplierAt` | 266 | function |  | 8 |
| `tipPanelWidthAt` | 305 | function |  | 6 |
| `buildTipWidthCurve` | 311 | function |  | 5 |
| `setTipWidthCurveValue` | 360 | function |  | 1 |
| `tipPanelFrameAt` | 379 | function |  | 4 |
| `tipMainSectionPoint` | 413 | function |  | 4 |
| `tipOffsetSampleT` | 461 | function |  | 2 |
| `tipSurfaceFrameAt` | 473 | function |  | 3 |
| `tipChainFrameAt` | 505 | function |  | 2 |
| `tipWidthEdgePosition` | 522 | function |  | 3 |
| `tipWidthEdgePoints` | 553 | function |  | 1 |
| `tipWidthControlPlacement` | 568 | function |  | 1 |
| `tipHighlightMaterial` | 584 | function |  | 2 |
| `updateTipHighlight` | 606 | function |  | 1 |
| `splitTipForSegment` | 664 | function |  | 3 |
| `restPointAt` | 677 | arrow |  | 0 |
| `createPanelStrandGeometry` | 682 | function |  | 1 |
| `segmentWeightAt` | 719 | arrow |  | 1 |
| `addQuad` | 735 | arrow |  | 6 |
| `near` | 739 | arrow |  | 6 |
| `panelWidthAt` | 769 | arrow |  | 3 |
| `panelThicknessAt` | 774 | arrow |  | 3 |
| `panelFrameAt` | 783 | arrow |  | 1 |
| `rawPanelPoint` | 803 | arrow |  | 1 |
| `panelPoint` | 837 | arrow |  | 3 |
| `addPatch` | 847 | arrow |  | 1 |
| `uStart` | 978 | arrow |  | 1 |
| `uEnd` | 981 | arrow |  | 1 |

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

## modules/geometry/strand-geometry.js（1140 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createStrandGeometryApi` | 25 | function | export | 2 |
| `clipStrandProfilePolygon` | 34 | function |  | 3 |
| `inside` | 35 | arrow |  | 2 |
| `pushOrientedTriangle` | 57 | function |  | 7 |
| `orientedQuadFace` | 66 | function |  | 2 |
| `createSplitStrandGeometry` | 74 | function |  | 2 |
| `restPointAt` | 229 | arrow |  | 0 |
| `fusedIndexAt` | 362 | arrow |  | 0 |
| `createHairCardGeometry` | 417 | function |  | 2 |
| `createPolyGeometry` | 554 | function |  | 2 |
| `createConnectedCurveCardGeometry` | 581 | function |  | 4 |
| `createCompoundStrandGeometry` | 646 | function |  | 2 |
| `vertexIndex` | 731 | arrow |  | 6 |
| `proceduralBranchGeometryLock` | 897 | function |  | 2 |
| `createHairGeometry` | 928 | function |  | 1 |
| `createBaseHairGeometry` | 980 | function |  | 3 |

## modules/geometry/strand-sweep.js（146 行）

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

## modules/io/project-files.js（571 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createProjectSaveApi` | 14 | function | export | 2 |
| `downloadTextFile` | 65 | function |  | 4 |
| `downloadProjectFile` | 77 | function |  | 2 |
| `bufferAttributeTuples` | 81 | function |  | 6 |
| `setProjectSaveButtonsDisabled` | 88 | function |  | 5 |
| `buildHairProjectFile` | 94 | function |  | 4 |
| `buildHairObj` | 110 | function |  | 3 |
| `buildHairUsda` | 160 | function |  | 3 |
| `openFileActionDialog` | 271 | function |  | 5 |
| `performFileAction` | 316 | function |  | 2 |
| `saveHairProjectFile` | 385 | function |  | 2 |
| `saveHairProjectQuickly` | 415 | function |  | 1 |
| `exportHairObj` | 443 | function |  | 1 |
| `exportHairUsda` | 447 | function |  | 1 |
| `exportHairProjectQuickly` | 451 | function |  | 1 |
| `writeExportThroughFileSystem` | 503 | function |  | 3 |

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
