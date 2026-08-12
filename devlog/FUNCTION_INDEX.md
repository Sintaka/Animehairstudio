# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-12），由 `node scripts/gen-function-index.js` 产出。共 **1811** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（19956 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 284 | function |  | 3 |
| `saveBooleanPreference` | 312 | function |  | 20 |
| `normalizeControlPointDisplaySize` | 316 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 321 | function |  | 2 |
| `normalizeScaleSensitivity` | 326 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 331 | function |  | 2 |
| `normalizeSideNamingPerspective` | 336 | function |  | 2 |
| `normalizeNavigationStyle` | 340 | function |  | 2 |
| `setupEditableSliderControls` | 355 | function |  | 2 |
| `syncNumberFromRange` | 406 | arrow |  | 0 |
| `applyNumberValue` | 413 | arrow |  | 0 |
| `copyCameraPose` | 519 | function |  | 3 |
| `updateCameraProjectionForViewport` | 525 | function |  | 4 |
| `syncOrthographicFramingFromDistance` | 538 | function |  | 2 |
| `setOrthographicView` | 544 | function |  | 2 |
| `addNegativeTransformGizmoRods` | 584 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 613 | function |  | 2 |
| `removeRotateFreeAxisRing` | 639 | function |  | 2 |
| `deflateTransformGizmoPickers` | 651 | function |  | 2 |
| `nextStrandName` | 1046 | function |  | 2 |
| `isPanelGeometry` | 1272 | function |  | 29 |
| `normalizePanelSplits` | 1276 | function |  | 2 |
| `clonePanelSplits` | 1288 | function |  | 11 |
| `snapPanelSplitHeight` | 1292 | function |  | 3 |
| `createQuadSphereGeometry` | 1327 | function |  | 2 |
| `vertexIndex` | 1341 | function |  | 5 |
| `addEdge` | 1359 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1582 | function |  | 4 |
| `ensureDrawClumpPreviewCount` | 1762 | function |  | 1 |
| `currentStrandSelectionState` | 1824 | function |  | 4 |
| `applyStrandSelectionState` | 1828 | function |  | 5 |
| `clearStrandSelectionState` | 1833 | function |  | 5 |
| `normalizeHairLayer` | 3035 | function |  | 25 |
| `layerOffsetForLock` | 3039 | function |  | 4 |
| `layerRootOffsetFactor` | 3044 | function |  | 8 |
| `layerOffsetWeight` | 3048 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3054 | function |  | 5 |
| `pointsWithLayerOffset` | 3063 | function |  | 1 |
| `layerDirectionForLock` | 3071 | function |  | 2 |
| `applyLayerOffset` | 3082 | function |  | 5 |
| `setLockHairLayer` | 3106 | function |  | 2 |
| `setGroupLayerOffset` | 3121 | function |  | 2 |
| `quadraticWeights` | 3149 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3350 | function |  | 1 |
| `upperContourCurve` | 3367 | function |  | 2 |
| `hermitePoint` | 3402 | function |  | 2 |
| `curveNetworkSection` | 3413 | function |  | 1 |
| `pointAlongSection` | 3442 | function |  | 1 |
| `longestStitchedContour` | 3448 | function |  | 2 |
| `nodeForPoint` | 3456 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3513 | function |  | 1 |
| `exitSetupEditors` | 3533 | function |  | 6 |
| `syncAppMenuVisibility` | 3543 | function |  | 3 |
| `closeAppMenus` | 3549 | function |  | 6 |
| `setAppMenuOpen` | 3560 | function |  | 2 |
| `setTurntableActive` | 3567 | function |  | 3 |
| `setOutlinerTab` | 3606 | function |  | 7 |
| `effectiveViewportSelectionMode` | 3624 | function |  | 4 |
| `componentEditModeActive` | 3628 | function |  | 28 |
| `selectionToolSupportsPicking` | 3632 | function |  | 3 |
| `syncViewportSelectionModeControl` | 3637 | function |  | 4 |
| `refreshSelectionModeVisuals` | 3653 | function |  | 2 |
| `setViewportSelectionMode` | 3683 | function |  | 3 |
| `setViewportEditMode` | 3695 | function |  | 7 |
| `createOutlinerVisibilityToggle` | 3737 | function |  | 6 |
| `setLocksOutlinerVisibility` | 3751 | function |  | 8 |
| `normalizeOutlinerName` | 3765 | function |  | 3 |
| `beginOutlinerRename` | 3770 | function |  | 2 |
| `finish` | 3781 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 3811 | function |  | 5 |
| `strandPassesDisplayFilters` | 3961 | function |  | 4 |
| `strandVisibleForDisplay` | 3970 | function |  | 9 |
| `strandAvailableForViewportInteraction` | 3975 | function |  | 3 |
| `lockedStrandsExist` | 3979 | function |  | 1 |
| `hiddenStrandsExist` | 3983 | function |  | 1 |
| `hideSelectedStrands` | 3987 | function |  | 1 |
| `unhideHiddenStrands` | 3997 | function |  | 1 |
| `strandIsolationActive` | 4006 | function |  | 4 |
| `setStrandIsolation` | 4010 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 4022 | function |  | 2 |
| `syncVisibilityParent` | 4033 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 4040 | function |  | 7 |
| `applyCharacterMeshDisplayVisibility` | 4069 | function |  | 4 |
| `applyStrandDisplayVisibility` | 4076 | function |  | 4 |
| `applyDisplayVisibilityFilters` | 4099 | function |  | 8 |
| `updateGroupCurveLatticeStrands` | 4317 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 4338 | function |  | 1 |
| `createStrandsFromCurveLattice` | 4357 | function |  | 2 |
| `selectedViewportFocusBounds` | 4455 | function |  | 2 |
| `frameViewportBounds` | 4469 | function |  | 5 |
| `centerViewportOnSelectedItem` | 4499 | function |  | 2 |
| `fullSceneFocusBounds` | 4503 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 4518 | function |  | 3 |
| `cycleViewportFraming` | 4527 | function |  | 2 |
| `sculptBrushToolActive` | 4547 | function |  | 22 |
| `sculptBrushSelectionMaskActive` | 4551 | function |  | 3 |
| `sculptBrushSelectionAllows` | 4555 | function |  | 2 |
| `effectiveSculptBrushTool` | 4559 | function |  | 3 |
| `updateSculptScaleModeRow` | 4565 | function |  | 4 |
| `syncSculptBrushToolButtons` | 4570 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 4592 | function |  | 5 |
| `setActiveTool` | 4601 | function |  | 11 |
| `setDrawStrandMode` | 4739 | function |  | 1 |
| `setObjectSpaceEditing` | 4749 | function |  | 5 |
| `setHierarchyEditing` | 4765 | function |  | 4 |
| `setProportionalEditing` | 4777 | function |  | 5 |
| `beginProportionalSizeEdit` | 4796 | function |  | 3 |
| `updateProportionalSizeEdit` | 4808 | function |  | 2 |
| `endProportionalSizeEdit` | 4819 | function |  | 5 |
| `activateProportionalHotkeyHold` | 4826 | function |  | 2 |
| `refreshProportionalPreview` | 4834 | function |  | 4 |
| `activeBrushSizeInput` | 4844 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 4853 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 4865 | function |  | 2 |
| `beginBrushSizeDrag` | 4883 | function |  | 1 |
| `updateBrushSizeDrag` | 4910 | function |  | 1 |
| `finishBrushSizeDrag` | 4931 | function |  | 2 |
| `updateInteractionLocks` | 4948 | function |  | 39 |
| `configureTransformControls` | 4959 | function |  | 11 |
| `pullMoveActive` | 4967 | function |  | 8 |
| `updatePullGuideVisual` | 4971 | function |  | 4 |
| `attachTransformForCurvePoint` | 4987 | function |  | 5 |
| `pointerHitsTransformGizmo` | 5011 | function |  | 5 |
| `strandObjectRootIndex` | 5027 | function |  | 3 |
| `strandObjectRoot` | 5036 | function |  | 4 |
| `strandObjectTransformQuaternion` | 5040 | function |  | 2 |
| `attachStrandObjectTransform` | 5045 | function |  | 6 |
| `guideObjectPivot` | 5068 | function |  | 3 |
| `guideObjectTransformQuaternion` | 5079 | function |  | 2 |
| `attachGuideObjectTransform` | 5084 | function |  | 5 |
| `guideObjectTransformSnapshot` | 5103 | function |  | 2 |
| `beginGuideObjectTransform` | 5131 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 5138 | function |  | 2 |
| `updateGuideObjectTransform` | 5160 | function |  | 2 |
| `finishGuideObjectTransform` | 5193 | function |  | 2 |
| `clonePlacementFrame` | 5202 | function |  | 2 |
| `cloneOptionalVectors` | 5214 | function |  | 10 |
| `strandObjectTransformSnapshot` | 5218 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 5235 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 5250 | function |  | 2 |
| `strandObjectTransformOperators` | 5266 | function |  | 4 |
| `transformPoint` | 5274 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 5281 | arrow |  | 0 |
| `transformNormal` | 5287 | arrow |  | 10 |
| `transformDirection` | 5297 | arrow |  | 5 |
| `worldMatrixForPivot` | 5309 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 5315 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 5331 | function |  | 6 |
| `beginStrandObjectTransform` | 5357 | function |  | 2 |
| `updateStrandObjectTransform` | 5395 | function |  | 2 |
| `commitStrandObjectTransform` | 5453 | function |  | 2 |
| `mapPoints` | 5466 | arrow |  | 4 |
| `finishStrandObjectTransform` | 5500 | function |  | 2 |
| `surfaceObjectAnchorPose` | 5514 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 5537 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 5550 | function |  | 3 |
| `beginSurfaceObjectTransform` | 5565 | function |  | 2 |
| `updateSurfaceObjectTransform` | 5591 | function |  | 2 |
| `finishSurfaceObjectTransform` | 5640 | function |  | 2 |
| `beginHandleEdit` | 5649 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 5702 | function |  | 3 |
| `multiPointHandleEditActive` | 5713 | function |  | 7 |
| `applyMultiMove` | 5717 | function |  | 5 |
| `applyMultiRotate` | 5723 | function |  | 2 |
| `applyMultiScale` | 5732 | function |  | 2 |
| `applyHierarchicalMove` | 5741 | function |  | 3 |
| `applySingleMove` | 5753 | function |  | 5 |
| `applySurfaceLatticeMirror` | 5757 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 5774 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 5783 | function |  | 3 |
| `changed` | 5793 | arrow |  | 1 |
| `applyPullMove` | 5835 | function |  | 3 |
| `pullHeadCollisionContext` | 5843 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 5862 | function |  | 2 |
| `applyProportionalMove` | 5885 | function |  | 3 |
| `viewPlaneNormal` | 5896 | function |  | 4 |
| `isCameraInSnappedView` | 5900 | function |  | 2 |
| `viewPlaneMoveActiveForView` | 5908 | function |  | 9 |
| `updateViewPlaneGrid` | 5912 | function |  | 13 |
| `setViewPlaneMove` | 5969 | function |  | 3 |
| `setViewPlaneMoveSnappedOnly` | 5980 | function |  | 2 |
| `rayFromViewportEvent` | 5988 | function |  | 8 |
| `worldUnitsPerViewportPixel` | 5996 | function |  | 4 |
| `viewPlaneMovePointNormal` | 6006 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 6017 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 6030 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 6049 | function |  | 4 |
| `beginViewPlaneMove` | 6056 | function |  | 3 |
| `updateViewPlaneMove` | 6120 | function |  | 1 |
| `endViewPlaneMove` | 6185 | function |  | 7 |
| `applyHierarchicalRotate` | 6204 | function |  | 2 |
| `rotateGuideNormal` | 6211 | arrow |  | 4 |
| `applySingleRotate` | 6249 | function |  | 2 |
| `applyProportionalRotate` | 6253 | function |  | 2 |
| `applyHierarchicalScale` | 6273 | function |  | 2 |
| `applySingleScale` | 6283 | function |  | 2 |
| `applyProportionalScale` | 6287 | function |  | 2 |
| `setPointScale` | 6303 | function |  | 7 |
| `proportionalWeight` | 6312 | function |  | 8 |
| `proportionalStrandVisualsActive` | 6324 | function |  | 5 |
| `strandInfluenceColor` | 6330 | function |  | 4 |
| `beginRelaxEdit` | 6355 | function |  | 3 |
| `updateRelaxEdit` | 6384 | function |  | 1 |
| `endRelaxEdit` | 6444 | function |  | 1 |
| `disposeGuide` | 6454 | function |  | 3 |
| `removeGuideObjects` | 6482 | function |  | 3 |
| `strandRadiusAt` | 6496 | function |  | 5 |
| `strandProfileTopologyAt` | 6513 | function |  | 2 |
| `strandCurveParameters` | 6555 | function |  | 1 |
| `widthProfileAt` | 6565 | arrow |  | 1 |
| `braidFrameAt` | 6603 | function |  | 4 |
| `braidFrameAtExtended` | 6613 | function |  | 2 |
| `createBraidProfileProjector` | 6622 | function |  | 2 |
| `project` | 6638 | arrow |  | 11 |
| `createBraidGeometry` | 6653 | function |  | 1 |
| `quantize` | 6686 | arrow |  | 19 |
| `deformationAt` | 6688 | function |  | 3 |
| `widthFor` | 6697 | arrow |  | 3 |
| `depthFor` | 6701 | arrow |  | 3 |
| `outputVertex` | 6733 | function |  | 7 |
| `appendAuthoredCap` | 6841 | function |  | 3 |
| `outputCapVertex` | 6848 | arrow |  | 6 |
| `capBoundary` | 6939 | function |  | 3 |
| `strandGeometryCurve` | 7001 | function |  | 6 |
| `strandGeometryFrameAt` | 7027 | function |  | 5 |
| `transportedStrandFrameAt` | 7090 | function |  | 5 |
| `twistOverrideAt` | 7093 | arrow |  | 2 |
| `hairMaterialDefinition` | 7163 | function |  | 4 |
| `materialForLock` | 7167 | function |  | 7 |
| `activeHairMaterialDefinition` | 7171 | function |  | 11 |
| `strandDisplayColor` | 7177 | function |  | 13 |
| `setAnimeHairBaseColor` | 7195 | function |  | 3 |
| `createAnimeAnisotropicMaterial` | 7208 | function |  | 2 |
| `createHairMaterial` | 7248 | function |  | 4 |
| `createStrandSelectionOutline` | 7290 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 7325 | function |  | 6 |
| `applyMaterialDefinitionToLock` | 7334 | function |  | 6 |
| `refreshMaterialUsers` | 7361 | function |  | 6 |
| `renderHairMaterialOutliner` | 7370 | function |  | 5 |
| `renderHairMaterialOptions` | 7400 | function |  | 3 |
| `syncHairMaterialEditor` | 7410 | function |  | 9 |
| `createProjectHairMaterial` | 7436 | function |  | 3 |
| `deleteActiveHairMaterial` | 7456 | function |  | 2 |
| `createHairTopologyGeometry` | 7474 | function |  | 4 |
| `createHairTopologyOverlay` | 7495 | function |  | 3 |
| `groupDefaultsFor` | 7542 | function |  | 7 |
| `creationToolActive` | 7549 | function |  | 5 |
| `activeCreationShapeDefaults` | 7553 | function |  | 6 |
| `curvePolylineLength` | 7560 | function |  | 2 |
| `curvePolylineLengths` | 7568 | function |  | 3 |
| `samplePolylineDistance` | 7576 | function |  | 2 |
| `applyProjectedCurveLength` | 7586 | function |  | 4 |
| `clearRegionLengthBaseline` | 7617 | function |  | 2 |
| `ensureRegionLengthBaseline` | 7624 | function |  | 2 |
| `setGroupLengthScale` | 7632 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 7670 | function |  | 3 |
| `requestGroupDefaultsWarning` | 7702 | function |  | 1 |
| `activeProfileOffset` | 7714 | function |  | 3 |
| `profileToCanvas` | 7722 | function |  | 1 |
| `renderProfilePreview` | 7729 | function |  | 7 |
| `renderHairCardCoveragePath` | 7748 | function |  | 2 |
| `updateViewportStatsVisibility` | 8184 | function |  | 1 |
| `canvasToProfile` | 8203 | function |  | 2 |
| `addLock` | 8218 | function |  | 4 |
| `mirroredVector` | 8430 | function |  | 12 |
| `mirroredPlacementFrame` | 8434 | function |  | 2 |
| `mirrorPartnerFor` | 8447 | function |  | 34 |
| `decoupleMirrorPartner` | 8451 | function |  | 2 |
| `createMirrorPartner` | 8459 | function |  | 5 |
| `createMirrorPartnerForNewLock` | 8555 | function |  | 1 |
| `mirroredClumpPartners` | 8560 | function |  | 3 |
| `createMirroredClump` | 8566 | function |  | 2 |
| `decoupleMirroredClump` | 8588 | function |  | 2 |
| `syncMirrorPartnerFromLock` | 8608 | function |  | 5 |
| `syncActiveMirror` | 8775 | function |  | 19 |
| `setMirrorXEditing` | 8787 | function |  | 5 |
| `snapshotState` | 8811 | function |  | 4 |
| `rootAttachmentFrame` | 9072 | function |  | 3 |
| `rootAttachmentLocalFrame` | 9084 | function |  | 4 |
| `resolveRootAttachment` | 9102 | function |  | 4 |
| `curvePointsToRootLocal` | 9142 | function |  | 2 |
| `curvePointsFromRootLocal` | 9154 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 9162 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 9178 | function |  | 2 |
| `createRootAttachment` | 9209 | function |  | 5 |
| `syncRootAttachmentMetadata` | 9239 | function |  | 3 |
| `rootAttachmentToData` | 9266 | function |  | 2 |
| `rootAttachmentFromData` | 9294 | function |  | 3 |
| `downloadPreferencesAndPresets` | 9339 | function |  | 1 |
| `importedBooleanPreference` | 9372 | function |  | 11 |
| `loadPreferencesAndPresets` | 9420 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 9490 | function |  | 1 |
| `openHairProjectFile` | 9534 | function |  | 4 |
| `dragContainsApplicationFile` | 9592 | function |  | 3 |
| `safelyRememberRecentProject` | 9601 | function |  | 2 |
| `renderRecentProjectsMenu` | 9610 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 9642 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 9667 | function |  | 2 |
| `confirmDroppedApplicationFile` | 9671 | function |  | 2 |
| `pushUndoState` | 9687 | function |  | 71 |
| `undoLastAction` | 9694 | function |  | 2 |
| `redoLastAction` | 9711 | function |  | 2 |
| `updateHistoryButtons` | 9728 | function |  | 6 |
| `resetTransientInteractionsForStateRestore` | 9733 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 9753 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 9760 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 9799 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 9825 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 9857 | function |  | 2 |
| `finalizeStateRestore` | 9898 | function |  | 2 |
| `restoreState` | 9905 | function |  | 4 |
| `disposeAllEditableObjects` | 9929 | function |  | 2 |
| `restoreLock` | 9950 | function |  | 2 |
| `restoreGuide` | 10174 | function |  | 2 |
| `vectorToData` | 10235 | function |  | 25 |
| `dataToVector` | 10239 | function |  | 22 |
| `frameToData` | 10243 | function |  | 2 |
| `frameFromData` | 10255 | function |  | 2 |
| `average` | 10267 | function |  | 3 |
| `fitPointAttributes` | 10271 | function |  | 6 |
| `rebuildCurveObjects` | 10300 | function |  | 5 |
| `createCurvePoints` | 10312 | function |  | 2 |
| `nextClumpName` | 10322 | function |  | 3 |
| `initializeClumpShape` | 10329 | function |  | 5 |
| `stableClumpVariation` | 10340 | function |  | 3 |
| `createClumpFromLocks` | 10352 | function |  | 4 |
| `addLockToClump` | 10377 | function |  | 4 |
| `pointerToNdc` | 10433 | function |  | 1 |
| `gridProfileSkipCol` | 10449 | function |  | 1 |
| `clumpDirectMembers` | 10473 | function |  | 3 |
| `clumpMembersForGuide` | 10478 | function |  | 6 |
| `clumpGuideForLock` | 10482 | function |  | 10 |
| `proceduralGuideForLock` | 10487 | function |  | 6 |
| `proceduralAccessoryMembersForGuide` | 10494 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 10501 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 10508 | function |  | 2 |
| `proceduralBranchWorldPoints` | 10520 | function |  | 1 |
| `applyProceduralBranchSettings` | 10533 | function |  | 2 |
| `proceduralAccessoryMapsForGuide` | 10572 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 10588 | function |  | 3 |
| `createProceduralAccessoryLock` | 10602 | function |  | 2 |
| `applyProceduralAccessorySettings` | 10654 | function |  | 2 |
| `clumpFrameAt` | 10705 | function |  | 5 |
| `commitClumpMemberRestState` | 10713 | function |  | 9 |
| `updateClumpMembers` | 10796 | function |  | 9 |
| `dissolveClump` | 10900 | function |  | 5 |
| `detachLockFromClump` | 10937 | function |  | 4 |
| `deselectStrands` | 10971 | function |  | 9 |
| `beginSelectionMarquee` | 10986 | function |  | 3 |
| `beginAltOrbit` | 11010 | function |  | 1 |
| `beginBlenderNavigation` | 11022 | function |  | 1 |
| `endBlenderNavigation` | 11067 | function |  | 1 |
| `prepareSelectPointerCapture` | 11075 | function |  | 1 |
| `endSelectPointerCapture` | 11081 | function |  | 1 |
| `applyAltClickCandidate` | 11087 | function |  | 2 |
| `finishBrushAltClick` | 11113 | function |  | 1 |
| `endAltOrbit` | 11126 | function |  | 2 |
| `dollyCameraByDrag` | 11133 | function |  | 2 |
| `fastDragMagnitude` | 11156 | function |  | 2 |
| `beginHoudiniZoomDrag` | 11162 | function |  | 1 |
| `updateHoudiniZoomDrag` | 11170 | function |  | 1 |
| `endHoudiniZoomDrag` | 11187 | function |  | 1 |
| `updateSelectionMarquee` | 11195 | function |  | 1 |
| `pointInsideSelectionMarquee` | 11212 | function |  | 3 |
| `selectPointsInMarquee` | 11220 | function |  | 2 |
| `pointKey` | 11246 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 11277 | function |  | 2 |
| `objectInsideSelectionMarquee` | 11314 | function |  | 3 |
| `projectedPoint` | 11331 | arrow |  | 1 |
| `selectObjectsInMarquee` | 11360 | function |  | 2 |
| `finishSelectionMarquee` | 11405 | function |  | 2 |
| `strandSplitProfileData` | 11429 | function |  | 2 |
| `strandSplitControlPoint` | 11442 | function |  | 1 |
| `panelSplitControlPoint` | 11478 | function |  | 3 |
| `panelWidthAt` | 11495 | arrow |  | 3 |
| `panelThicknessAt` | 11502 | arrow |  | 3 |
| `strandControlPointRaycast` | 11535 | function |  | 1 |
| `strandControlPointFrame` | 11570 | function |  | 4 |
| `strandControlPointHitFromEvent` | 11602 | function |  | 3 |
| `createCurveObjects` | 11660 | function |  | 4 |
| `strandWidthEdgeFrameAt` | 11781 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 11788 | function |  | 2 |
| `strandWidthEdgeSample` | 11797 | function |  | 3 |
| `strandWidthEdgePoints` | 11820 | function |  | 2 |
| `sculptBrushDebugRaycast` | 11834 | arrow |  | 0 |
| `updateCurveObjects` | 11836 | function |  | 25 |
| `pointUpDirection` | 12031 | function |  | 2 |
| `curveFrameAtPoint` | 12035 | function |  | 4 |
| `curveFrameAt` | 12056 | function |  | 3 |
| `strandTwistAt` | 12076 | function |  | 6 |
| `controlPointRotationAt` | 12081 | function |  | 3 |
| `strandProfileTwistAt` | 12085 | function |  | 2 |
| `strandFrameAt` | 12091 | function |  | 1 |
| `curveFrameAtSnapshot` | 12097 | function |  | 3 |
| `outwardNormalAtPoint` | 12116 | function |  | 6 |
| `sampledSurfaceNormal` | 12179 | function |  | 2 |
| `guidedNormalAt` | 12195 | function |  | 4 |
| `twistFromHandle` | 12214 | function |  | 3 |
| `signedAngleAroundAxis` | 12235 | function |  | 4 |
| `handleColor` | 12242 | function |  | 2 |
| `isAffectedCurvePoint` | 12265 | function |  | 2 |
| `syncLockFromCurve` | 12271 | function |  | 16 |
| `rebuildLockGeometry` | 12301 | function |  | 8 |
| `flushPendingLockGeometryUpdates` | 12329 | function |  | 6 |
| `updateLockGeometry` | 12342 | function |  | 32 |
| `setGroupColorView` | 12363 | function |  | 2 |
| `createUvCheckerTexture` | 12373 | function |  | 3 |
| `ensureUvCheckerForLock` | 12409 | function |  | 4 |
| `removeUvCheckerFromLock` | 12442 | function |  | 3 |
| `invalidateUvInspector` | 12457 | function |  | 7 |
| `uvInspectorRecord` | 12461 | function |  | 1 |
| `uvInspectorRecords` | 12500 | function |  | 2 |
| `drawUvInspectorGrid` | 12504 | function |  | 2 |
| `renderUvInspector` | 12538 | function |  | 3 |
| `setUvCheckerEnabled` | 12597 | function |  | 3 |
| `strandViewportBaseColor` | 12614 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 12649 | function |  | 3 |
| `syncStrandSelectionOutline` | 12655 | function |  | 2 |
| `applyLockedStrandPalette` | 12666 | function |  | 2 |
| `syncLockedStrandWireVisual` | 12675 | function |  | 6 |
| `setStrandSelectionVisual` | 12684 | function |  | 4 |
| `proceduralParentOutlineVisible` | 12700 | function |  | 2 |
| `syncProceduralParentVisibility` | 12707 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 12716 | function |  | 2 |
| `updateStrandSelectionHighlight` | 12720 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 12724 | function |  | 2 |
| `resetGuideSelectionVisuals` | 12737 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 12757 | function |  | 3 |
| `selectLock` | 12790 | function |  | 27 |
| `deselectStrandsForGuideEditor` | 12852 | function |  | 1 |
| `syncGroupInputs` | 12863 | function |  | 2 |
| `topologyStatsForLock` | 12896 | function |  | 4 |
| `formatTopologyStats` | 12904 | function |  | 5 |
| `updateTopologyStats` | 12908 | function |  | 15 |
| `normalizeStrandDimensions` | 12942 | function |  | 3 |
| `strandBaseWidth` | 12956 | function |  | 5 |
| `strandWidthDimension` | 12960 | function |  | 5 |
| `strandDepthDimension` | 12968 | function |  | 8 |
| `setStrandWidthDimension` | 12976 | function |  | 2 |
| `setStrandDepthDimension` | 12998 | function |  | 4 |
| `syncShapeDimensionInputs` | 13014 | function |  | 4 |
| `syncCreationShapeInputs` | 13050 | function |  | 2 |
| `syncViewportDrawSettings` | 13088 | function |  | 4 |
| `syncStrandSplitInputs` | 13105 | function |  | 4 |
| `syncHairCardControls` | 13114 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 13122 | function |  | 3 |
| `updateAttributeEditorMode` | 13161 | function |  | 10 |
| `pinActiveToolSettingsPanel` | 13311 | function |  | 2 |
| `curveLatticeForGroup` | 13334 | function |  | 2 |
| `filterCurveLatticesToGroup` | 13352 | function |  | 5 |
| `createStandaloneCurveLatticeGuide` | 13397 | function |  | 2 |
| `showCurveLatticeForGroup` | 13414 | function |  | 2 |
| `selectStrandGroup` | 13451 | function |  | 3 |
| `selectCurvePoint` | 13493 | function |  | 3 |
| `updateSelectedPointLabel` | 13507 | function |  | 12 |
| `syncInputs` | 13520 | function |  | 13 |
| `syncClumpGuidePanel` | 13566 | function |  | 3 |
| `getSelectedLock` | 13593 | function |  | 88 |
| `selectedLocksInOrder` | 13597 | function |  | 26 |
| `lockStrands` | 13603 | function |  | 3 |
| `lockSelectedStrands` | 13636 | function |  | 2 |
| `unlockStrands` | 13642 | function |  | 3 |
| `unlockAllStrands` | 13657 | function |  | 2 |
| `strandEditFamily` | 13661 | function |  | 7 |
| `compatibleSelectedLocks` | 13666 | function |  | 4 |
| `selectedEditRoots` | 13673 | function |  | 2 |
| `editSelectedLocks` | 13686 | function |  | 16 |
| `multiEditValuesEqual` | 13719 | function |  | 2 |
| `setMixedControl` | 13728 | function |  | 28 |
| `syncMultiStrandInputs` | 13745 | function |  | 16 |
| `values` | 13761 | arrow |  | 35 |
| `selectedRebuildableCurves` | 13841 | function |  | 5 |
| `createCompoundStrand` | 13848 | function |  | 1 |
| `refreshRebuildCurveDialog` | 13909 | function |  | 7 |
| `openRebuildCurveDialog` | 13922 | function |  | 1 |
| `rebuildSelectedCurves` | 13936 | function |  | 2 |
| `selectionCanBecomeClump` | 13975 | function |  | 3 |
| `createClumpFromSelection` | 13980 | function |  | 2 |
| `cleanSelectionSets` | 13992 | function |  | 2 |
| `createSelectionSetFromSelection` | 13997 | function |  | 2 |
| `selectionSetById` | 14008 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 14012 | function |  | 4 |
| `editSelectionSetFromSelection` | 14021 | function |  | 3 |
| `deleteSelectionSet` | 14041 | function |  | 2 |
| `selectSelectionSet` | 14050 | function |  | 2 |
| `deleteSelectedStrands` | 14060 | function |  | 3 |
| `deleteGuide` | 14068 | function |  | 3 |
| `deleteSelectedGuide` | 14091 | function |  | 3 |
| `hasDeletableSelection` | 14096 | function |  | 2 |
| `deleteCurrentSelection` | 14104 | function |  | 3 |
| `hideOutlinerContextMenu` | 14112 | function |  | 16 |
| `outlinerLockTargets` | 14117 | function |  | 3 |
| `showOutlinerContextMenu` | 14144 | function |  | 7 |
| `setPullMoveEnabled` | 14224 | function |  | 2 |
| `setProceduralDrawExperimentalEnabled` | 14232 | function |  | 5 |
| `setNavigationTipsEnabled` | 14247 | function |  | 5 |
| `configureNavigationMouseButtons` | 14254 | function |  | 3 |
| `syncNavigationModifierLocks` | 14267 | function |  | 7 |
| `setNavigationStyle` | 14272 | function |  | 5 |
| `applyCameraSmoothingPreference` | 14288 | function |  | 4 |
| `setCameraSmoothingEnabled` | 14303 | function |  | 5 |
| `setCameraSmoothingStrength` | 14309 | function |  | 5 |
| `setScaleSensitivity` | 14317 | function |  | 3 |
| `setToolTipsEnabled` | 14325 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 14332 | function |  | 5 |
| `setViewportStatisticsEnabled` | 14341 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 14349 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 14364 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 14373 | function |  | 5 |
| `sideNamingDisplayId` | 14382 | function |  | 2 |
| `strandRegionDisplayLabel` | 14395 | function |  | 6 |
| `updateSideNamingLabels` | 14413 | function |  | 2 |
| `setSideNamingPerspective` | 14440 | function |  | 5 |
| `setControlPointDisplaySize` | 14449 | function |  | 6 |
| `scaleHexColor` | 14461 | function |  | 3 |
| `setViewportBackgroundColor` | 14466 | function |  | 7 |
| `setDefaultHairShader` | 14488 | function |  | 5 |
| `setPreferenceCategory` | 14494 | function |  | 4 |
| `openPreferencesDialog` | 14521 | function |  | 1 |
| `savePreferencesDialog` | 14549 | function |  | 1 |
| `cancelPreferencesDialog` | 14573 | function |  | 3 |
| `outlinerClumpLocks` | 14602 | function |  | 10 |
| `handleOutlinerClumpDrop` | 14606 | function |  | 3 |
| `createOutlinerStrandButton` | 14629 | function |  | 4 |
| `createOutlinerCurveSurface` | 14715 | function |  | 2 |
| `createOutlinerClump` | 14811 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 14893 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 14900 | function |  | 2 |
| `renderLockList` | 14979 | function |  | 47 |
| `updateCount` | 15133 | function |  | 13 |
| `captureInputUndo` | 15142 | function |  | 1 |
| `bindUndoCapture` | 15148 | function |  | 37 |
| `bindLockInput` | 15159 | function |  | 2 |
| `applyValue` | 15176 | arrow |  | 2 |
| `applyUniformTransformScale` | 15495 | function |  | 2 |
| `applyReducedTransformScale` | 15512 | function |  | 2 |
| `applyTransformPrecision` | 15551 | function |  | 2 |
| `updateTransformScalePointer` | 15580 | function |  | 1 |
| `beginProceduralAccessoryEdit` | 16577 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 16582 | function |  | 4 |
| `syncDrawCurlControls` | 16637 | function |  | 5 |
| `handleLiveSurfaceChange` | 16685 | function |  | 1 |
| `selectedBranchChildLock` | 16976 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 16980 | function |  | 2 |
| `initPanelResizeHandles` | 17086 | function |  | 2 |
| `applyWidth` | 17092 | arrow |  | 2 |
| `restoreWidth` | 17099 | arrow |  | 2 |
| `bindResize` | 17107 | arrow |  | 2 |
| `onMove` | 17116 | arrow |  | 0 |
| `onUp` | 17120 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 17137 | function |  | 2 |
| `initFloatingPanelControls` | 17146 | function |  | 2 |
| `detach` | 17155 | arrow |  | 22 |
| `endDrag` | 17193 | arrow |  | 0 |
| `endResize` | 17225 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 17236 | function |  | 3 |
| `selectPatchNotesVersion` | 17370 | function |  | 3 |
| `toggleCapsuleGuideTool` | 17601 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 17607 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 17614 | function |  | 1 |
| `deleteLocks` | 18181 | function |  | 6 |
| `disposeCurveObjects` | 18259 | function |  | 4 |
| `resize` | 18321 | function |  | 3 |
| `handleViewportPointerMove` | 18332 | function |  | 1 |
| `blockProportionalSizingEvent` | 18343 | function |  | 1 |
| `updateLightAngleFromInputs` | 18349 | function |  | 2 |
| `startViewSnap` | 18363 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 18393 | function |  | 3 |
| `trackViewportPointerDown` | 18410 | function |  | 1 |
| `trackViewportPointerMove` | 18426 | function |  | 1 |
| `clearViewportPointer` | 18434 | function |  | 1 |
| `updateViewSnap` | 18439 | function |  | 1 |
| `nearestCardinalAxis` | 18475 | function |  | 5 |
| `cardinalAxisKey` | 18489 | function |  | 4 |
| `steppedDragAmount` | 18493 | function |  | 3 |
| `snapCameraToCardinalAxis` | 18499 | function |  | 4 |
| `endViewSnap` | 18515 | function |  | 4 |
| `activateStrandControlPoint` | 18525 | function |  | 2 |
| `refreshStrandControlPointSelection` | 18575 | function |  | 4 |
| `addStrandControlPointSelection` | 18602 | function |  | 2 |
| `removeStrandControlPointSelection` | 18619 | function |  | 3 |
| `sampleStrandPointNormal` | 18633 | function |  | 2 |
| `sampleStrandPointVectors` | 18643 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 18649 | function |  | 2 |
| `resampleStrandCurveData` | 18660 | function |  | 4 |
| `resampleMatchingVectors` | 18666 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 18705 | function |  | 4 |
| `removeStrandCurvePoint` | 18716 | function |  | 2 |
| `closestStrandCurveParameter` | 18729 | function |  | 1 |
| `insertStrandCurvePoint` | 18758 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 18775 | function |  | 2 |
| `selectionModifierCursorAvailable` | 18785 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 18801 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 18808 | function |  | 4 |
| `finishCurvePointInsertion` | 18831 | function |  | 1 |
| `finishPointRemoval` | 18846 | function |  | 1 |
| `isHairCreateTool` | 18865 | function |  | 4 |
| `syncStrandHoverOutline` | 18869 | function |  | 1 |
| `pointerOverTaperEditor` | 18882 | function |  | 2 |
| `updateStrandBrushHover` | 18889 | function |  | 1 |
| `strandControlPointHit` | 18913 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 18917 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 18995 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 19029 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 19069 | function |  | 8 |
| `updateStrandWidthEdgeHover` | 19082 | function |  | 1 |
| `setHoveredControlPoint` | 19121 | function |  | 7 |
| `visibleControlPointHoverTargets` | 19134 | function |  | 2 |
| `updateControlPointHover` | 19170 | function |  | 1 |
| `animate` | 19785 | function |  | 2 |
| `syncCompactSidebarLayout` | 19816 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 19835 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 19841 | function |  | 3 |
| `setAttributeEditorTab` | 19847 | function |  | 6 |

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

## modules/geometry/procedural-duplicate.js（803 行）

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
| `updateDuplicatePlacement` | 546 | function |  | 2 |
| `beginDuplicatePlacement` | 610 | function |  | 2 |
| `beginProceduralDuplicatePlacement` | 674 | function |  | 2 |
| `confirmDuplicatePlacement` | 715 | function |  | 1 |
| `cancelDuplicatePlacement` | 752 | function |  | 2 |

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

## modules/geometry/radial-menu.js（914 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `createRadialMenuApi` | 21 | function | export | 2 |
| `hideStrandRadialMenu` | 33 | function |  | 3 |
| `ensureRadialButtonCapacity` | 44 | function |  | 3 |
| `radialButtonDimensions` | 57 | function |  | 4 |
| `radialMenuDimensionsForKind` | 66 | function |  | 3 |
| `applyRadialMenuDimensions` | 76 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 82 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 95 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 116 | function |  | 2 |
| `selectionSetRadialMenuOption` | 133 | function |  | 4 |
| `selectedMirrorRadialOptions` | 142 | function |  | 3 |
| `strandVisibilityRadialOptions` | 164 | function |  | 5 |
| `clumpMirrorRadialOptions` | 182 | function |  | 2 |
| `contextualRadialOptions` | 189 | function |  | 3 |
| `sharedRadialFrameDimensions` | 318 | function |  | 3 |
| `layoutContextualRadialOptions` | 322 | function |  | 4 |
| `renderRadialActionList` | 346 | function |  | 3 |
| `radialListOptionAtPointer` | 364 | function |  | 3 |
| `syncRadialListHighlight` | 386 | function |  | 3 |
| `configureContextualRadialMenu` | 392 | function |  | 3 |
| `beginStrandRadialGesture` | 452 | function |  | 1 |
| `enterStrandRadialSubmenu` | 486 | function |  | 2 |
| `updateStrandRadialGesture` | 532 | function |  | 1 |
| `performStrandRadialAction` | 571 | function |  | 2 |
| `finishStrandRadialGesture` | 674 | function |  | 1 |
| `cancelStrandRadialGesture` | 684 | function |  | 2 |
| `blockPointerDuringStrandRadialGesture` | 691 | function |  | 1 |
| `toolRadialOptions` | 697 | function |  | 2 |
| `hideToolRadialMenu` | 722 | function |  | 3 |
| `beginToolRadialGesture` | 735 | function |  | 2 |
| `beginToolShortcutPress` | 775 | function |  | 1 |
| `finishToolShortcutPress` | 790 | function |  | 1 |
| `cancelToolShortcutPress` | 799 | function |  | 2 |
| `setRadialMenusEnabled` | 807 | function |  | 1 |
| `updateToolRadialGesture` | 820 | function |  | 1 |
| `performToolRadialAction` | 849 | function |  | 2 |
| `finishToolRadialGesture` | 859 | function |  | 2 |
| `cancelToolRadialGesture` | 868 | function |  | 3 |

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
