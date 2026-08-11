# 函数索引 / FUNCTION INDEX

> 机器生成（2026-08-11），由 `node scripts/gen-function-index.js` 产出。共 **1801** 个函数。
> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。

## app.js（35058 行）

| 函数 | 行号 | 类型 | 导出 | calls |
|---|---|---|---|---|
| `saveLanguage` | 268 | function |  | 3 |
| `saveBooleanPreference` | 296 | function |  | 21 |
| `normalizeControlPointDisplaySize` | 300 | function |  | 2 |
| `normalizeCameraSmoothingStrength` | 305 | function |  | 2 |
| `normalizeScaleSensitivity` | 310 | function |  | 2 |
| `normalizeViewportBackgroundColor` | 315 | function |  | 2 |
| `normalizeSideNamingPerspective` | 320 | function |  | 2 |
| `normalizeNavigationStyle` | 324 | function |  | 2 |
| `setupEditableSliderControls` | 339 | function |  | 2 |
| `syncNumberFromRange` | 390 | arrow |  | 0 |
| `applyNumberValue` | 397 | arrow |  | 0 |
| `copyCameraPose` | 503 | function |  | 3 |
| `updateCameraProjectionForViewport` | 509 | function |  | 5 |
| `syncOrthographicFramingFromDistance` | 522 | function |  | 3 |
| `setOrthographicView` | 528 | function |  | 4 |
| `addNegativeTransformGizmoRods` | 568 | function |  | 2 |
| `addFullRotateGizmoAxisCircles` | 597 | function |  | 2 |
| `removeRotateFreeAxisRing` | 623 | function |  | 2 |
| `deflateTransformGizmoPickers` | 635 | function |  | 2 |
| `nextStrandName` | 1030 | function |  | 2 |
| `activeDrawClumpTemplate` | 1115 | function |  | 5 |
| `proceduralDrawClumpTemplate` | 1120 | function |  | 3 |
| `drawModeCreatesClump` | 1147 | function |  | 1 |
| `isPanelGeometry` | 1291 | function |  | 51 |
| `normalizePanelSplits` | 1295 | function |  | 3 |
| `clonePanelSplits` | 1307 | function |  | 32 |
| `snapPanelSplitHeight` | 1311 | function |  | 5 |
| `createQuadSphereGeometry` | 1346 | function |  | 2 |
| `vertexIndex` | 1360 | function |  | 11 |
| `addEdge` | 1378 | function |  | 5 |
| `setDrawStrandBrushCursorScale` | 1523 | function |  | 8 |
| `ensureDrawClumpPreviewCount` | 1703 | function |  | 2 |
| `currentStrandSelectionState` | 1765 | function |  | 4 |
| `applyStrandSelectionState` | 1769 | function |  | 5 |
| `clearStrandSelectionState` | 1774 | function |  | 7 |
| `guideHeadBounds` | 2765 | function |  | 3 |
| `disposeGuideModel` | 2776 | function |  | 3 |
| `syncHeadTransformInputs` | 2787 | function |  | 3 |
| `applyHeadTransform` | 2794 | function |  | 4 |
| `resetHeadTransform` | 2814 | function |  | 2 |
| `installGuideModel` | 2829 | function |  | 5 |
| `loadDefaultGuideModel` | 2905 | function |  | 3 |
| `braidTemplateFromEntries` | 2928 | function |  | 4 |
| `braidMeshEntries` | 2960 | function |  | 2 |
| `prepareBraidBodyCache` | 2972 | function |  | 2 |
| `quantize` | 2981 | arrow |  | 21 |
| `sourceNormalAt` | 2993 | arrow |  | 1 |
| `clusterBoundary` | 2996 | arrow |  | 2 |
| `normalBuckets` | 3013 | arrow |  | 2 |
| `applyBucketPair` | 3045 | arrow |  | 2 |
| `registerBraidMeshPreset` | 3076 | function |  | 2 |
| `annotateBraidObjTopology` | 3097 | function |  | 2 |
| `loadBraidMeshPreset` | 3117 | function |  | 3 |
| `createSplitControlHandle` | 3134 | function |  | 6 |
| `frameGuideModel` | 3149 | function |  | 2 |
| `normalizeHairLayer` | 3178 | function |  | 27 |
| `layerOffsetForLock` | 3182 | function |  | 8 |
| `layerRootOffsetFactor` | 3187 | function |  | 12 |
| `layerOffsetWeight` | 3191 | function |  | 4 |
| `applyLayerOffsetDeltaToPoints` | 3197 | function |  | 5 |
| `pointsWithLayerOffset` | 3206 | function |  | 3 |
| `layerDirectionForLock` | 3214 | function |  | 2 |
| `applyLayerOffset` | 3225 | function |  | 5 |
| `setLockHairLayer` | 3249 | function |  | 2 |
| `setGroupLayerOffset` | 3264 | function |  | 2 |
| `quadraticWeights` | 3292 | function |  | 1 |
| `setHeadReferenceTransparency` | 3303 | function |  | 4 |
| `trianglePlaneIntersections` | 3315 | function |  | 3 |
| `headPlaneIntersectionSegments` | 3336 | function |  | 1 |
| `templatePlaneIntersectionSegments` | 3545 | function |  | 1 |
| `upperContourCurve` | 3562 | function |  | 2 |
| `hermitePoint` | 3597 | function |  | 2 |
| `curveNetworkSection` | 3608 | function |  | 1 |
| `pointAlongSection` | 3637 | function |  | 1 |
| `longestStitchedContour` | 3643 | function |  | 2 |
| `nodeForPoint` | 3651 | arrow |  | 2 |
| `constructionCurveFromSegments` | 3708 | function |  | 1 |
| `exitSetupEditors` | 3728 | function |  | 7 |
| `setCapsuleGuideEditing` | 3737 | function |  | 5 |
| `syncAppMenuVisibility` | 3765 | function |  | 3 |
| `closeAppMenus` | 3771 | function |  | 6 |
| `setAppMenuOpen` | 3782 | function |  | 2 |
| `setTurntableActive` | 3789 | function |  | 3 |
| `selectedReferenceImage` | 3799 | function |  | 20 |
| `normalizeReferenceCrop` | 3805 | function |  | 8 |
| `referenceCropIsFull` | 3813 | function |  | 3 |
| `referencePlaneFrontAxis` | 3818 | function |  | 4 |
| `referencePlanePlacement` | 3827 | function |  | 4 |
| `migratedReferencePlanePosition` | 3842 | function |  | 2 |
| `isUntouchedLegacySideReferencePlacement` | 3862 | function |  | 3 |
| `migratedReferencePlaneRotation` | 3879 | function |  | 2 |
| `isInwardFacingSideReferencePlacement` | 3895 | function |  | 2 |
| `snappedReferenceImageView` | 3918 | function |  | 2 |
| `updateReferencePlaneVisibility` | 3924 | function |  | 5 |
| `applyReferenceImageRuntime` | 3940 | function |  | 15 |
| `updateReferenceSelectionVisuals` | 3983 | function |  | 6 |
| `createReferenceImageRuntime` | 3991 | function |  | 3 |
| `addReferenceImage` | 4060 | function |  | 3 |
| `disposeReferenceImageRuntime` | 4112 | function |  | 3 |
| `disposeReferenceImage` | 4131 | function |  | 2 |
| `clearReferenceImages` | 4135 | function |  | 2 |
| `serializeReferenceImage` | 4142 | function |  | 1 |
| `setReferenceImageType` | 4170 | function |  | 2 |
| `attachReferenceImageTransform` | 4214 | function |  | 6 |
| `selectReferenceImage` | 4228 | function |  | 12 |
| `placeReferencePlane` | 4251 | function |  | 2 |
| `setReferencePlaneInFront` | 4262 | function |  | 2 |
| `syncReferenceImageFromMesh` | 4272 | function |  | 4 |
| `renderReferenceImagePanel` | 4291 | function |  | 20 |
| `setOutlinerTab` | 4338 | function |  | 9 |
| `effectiveViewportSelectionMode` | 4356 | function |  | 4 |
| `componentEditModeActive` | 4360 | function |  | 37 |
| `selectionToolSupportsPicking` | 4364 | function |  | 3 |
| `syncViewportSelectionModeControl` | 4369 | function |  | 4 |
| `refreshSelectionModeVisuals` | 4385 | function |  | 2 |
| `setViewportSelectionMode` | 4415 | function |  | 4 |
| `setViewportEditMode` | 4427 | function |  | 16 |
| `createOutlinerVisibilityToggle` | 4469 | function |  | 9 |
| `setLocksOutlinerVisibility` | 4483 | function |  | 8 |
| `outlinerGuides` | 4495 | function |  | 3 |
| `guideOutlinerLabel` | 4502 | function |  | 2 |
| `normalizeOutlinerName` | 4512 | function |  | 4 |
| `beginOutlinerRename` | 4517 | function |  | 2 |
| `finish` | 4528 | arrow |  | 3 |
| `handleOutlinerRenameClick` | 4558 | function |  | 7 |
| `renderGuideOutliner` | 4569 | function |  | 8 |
| `referenceOutlinerGroup` | 4627 | function |  | 2 |
| `renderReferenceOutliner` | 4631 | function |  | 4 |
| `setReferenceImagePanelOpen` | 4748 | function |  | 5 |
| `readReferenceImageFile` | 4753 | function |  | 2 |
| `isSupportedReferenceImageFile` | 4777 | function |  | 2 |
| `addReferenceImagesFromFiles` | 4784 | function |  | 3 |
| `dragContainsReferenceImage` | 4829 | function |  | 3 |
| `setReferenceImageDragActive` | 4840 | function |  | 9 |
| `referenceDropDestination` | 4848 | function |  | 2 |
| `viewportOverlayDropPosition` | 4854 | function |  | 2 |
| `setReferenceDropHover` | 4863 | function |  | 4 |
| `referencePlaneHitFromPointer` | 4881 | function |  | 2 |
| `referenceOverlayAtPointer` | 4901 | function |  | 2 |
| `referenceOverlayCornerAtPointer` | 4919 | function |  | 4 |
| `beginReferenceOverlayDrag` | 4932 | function |  | 2 |
| `updateReferenceOverlayDrag` | 4978 | function |  | 1 |
| `finishReferenceOverlayDrag` | 5028 | function |  | 5 |
| `setReferenceOverlayScaleHandleHover` | 5050 | function |  | 6 |
| `updateReferenceOverlayCursor` | 5061 | function |  | 1 |
| `referenceCropAnchorCoordinates` | 5087 | function |  | 2 |
| `referenceCropAnchorScreenPositions` | 5096 | function |  | 2 |
| `referenceCropCursor` | 5111 | function |  | 3 |
| `updateReferenceCropHandles` | 5117 | function |  | 5 |
| `referenceCropSourcePoint` | 5138 | function |  | 2 |
| `beginReferenceCrop` | 5145 | function |  | 1 |
| `updateReferenceCrop` | 5183 | function |  | 1 |
| `finishReferenceCrop` | 5215 | function |  | 4 |
| `setHeadSetupEditing` | 5233 | function |  | 6 |
| `currentGuideViewMode` | 5253 | function |  | 3 |
| `updateGuideViewToggle` | 5261 | function |  | 4 |
| `setGuideViewMode` | 5277 | function |  | 3 |
| `cycleGuideViewMode` | 5288 | function |  | 1 |
| `hideGuideViewContextMenu` | 5293 | function |  | 6 |
| `showGuideViewContextMenu` | 5297 | function |  | 1 |
| `strandPassesDisplayFilters` | 5310 | function |  | 4 |
| `strandVisibleForDisplay` | 5319 | function |  | 14 |
| `strandAvailableForViewportInteraction` | 5324 | function |  | 3 |
| `lockedStrandsExist` | 5328 | function |  | 3 |
| `hiddenStrandsExist` | 5332 | function |  | 2 |
| `hideSelectedStrands` | 5336 | function |  | 2 |
| `unhideHiddenStrands` | 5346 | function |  | 2 |
| `strandIsolationActive` | 5355 | function |  | 7 |
| `setStrandIsolation` | 5359 | function |  | 3 |
| `toggleSelectedStrandIsolation` | 5371 | function |  | 3 |
| `syncVisibilityParent` | 5382 | function |  | 4 |
| `syncDisplayVisibilityInputs` | 5389 | function |  | 9 |
| `applyCharacterMeshDisplayVisibility` | 5418 | function |  | 5 |
| `applyStrandDisplayVisibility` | 5425 | function |  | 4 |
| `applyCapsuleGuideDisplayVisibility` | 5445 | function |  | 8 |
| `applyOtherGuideDisplayVisibility` | 5468 | function |  | 2 |
| `applyCurveLatticeGuideDisplayVisibility` | 5476 | function |  | 5 |
| `applyDisplayVisibilityFilters` | 5483 | function |  | 9 |
| `defaultCurveLatticePoints` | 5497 | function |  | 2 |
| `flatCurveLatticePoints` | 5523 | function |  | 4 |
| `createCurveLatticeGuideSet` | 5534 | function |  | 2 |
| `curveLatticeControlPoint` | 5549 | function |  | 9 |
| `circularArcTangent` | 5553 | function |  | 4 |
| `arcLengthTo` | 5584 | arrow |  | 2 |
| `defaultCurveLatticeFrames` | 5596 | function |  | 3 |
| `sampleHermiteCurve` | 5635 | function |  | 10 |
| `sampleCurveLattice` | 5652 | function |  | 6 |
| `curveLatticeNormal` | 5671 | function |  | 1 |
| `createCurveLatticeGeometry` | 5682 | function |  | 3 |
| `createCurveLatticeLineGeometry` | 5711 | function |  | 3 |
| `appendCurve` | 5713 | arrow |  | 4 |
| `sample` | 5715 | arrow |  | 4 |
| `curveLatticeLoopPickerGeometry` | 5742 | function |  | 2 |
| `createCurveLatticeLoopPickers` | 5758 | function |  | 3 |
| `addPicker` | 5760 | arrow |  | 2 |
| `rebuildCurveLatticeLoopPickers` | 5799 | function |  | 2 |
| `curveLatticeHasRootExtension` | 5812 | function |  | 4 |
| `defaultCurveLatticeRootPoints` | 5816 | function |  | 3 |
| `curveLatticeEditablePoint` | 5834 | function |  | 13 |
| `curveLatticePointSection` | 5841 | function |  | 3 |
| `curveLatticeRestPoint` | 5852 | function |  | 7 |
| `editingCurveLatticeDeformation` | 5858 | function |  | 7 |
| `curveLatticeRootColumns` | 5864 | function |  | 3 |
| `curveTangentsForPoints` | 5871 | function |  | 6 |
| `createCurveLatticeRootGeometry` | 5883 | function |  | 3 |
| `createCurveLatticeRootLineGeometry` | 5920 | function |  | 3 |
| `rebuildCurveLatticeHandles` | 5946 | function |  | 2 |
| `resampleCurveLatticeGuide` | 5963 | function |  | 3 |
| `resampleGrid` | 5973 | arrow |  | 2 |
| `controlPointIsSelected` | 6000 | function |  | 7 |
| `clearMultiPointSelection` | 6008 | function |  | 9 |
| `createCurveLatticeHandles` | 6012 | function |  | 4 |
| `addCurveLattice` | 6034 | function |  | 6 |
| `updateCurveLatticeGeometry` | 6143 | function |  | 9 |
| `mirroredCurveLatticePointIndex` | 6174 | function |  | 2 |
| `mirroredCurveLatticeTarget` | 6180 | function |  | 4 |
| `updateCurveLatticeHandleColors` | 6219 | function |  | 1 |
| `curveLatticeLoopHitFromEvent` | 6240 | function |  | 4 |
| `refreshCurveLatticeLoopHover` | 6257 | function |  | 3 |
| `setCurveLatticeLoopHover` | 6266 | function |  | 5 |
| `updateCurveLatticeLoopHover` | 6273 | function |  | 1 |
| `selectCurveLatticeLoop` | 6292 | function |  | 3 |
| `selectCurveLatticePoint` | 6321 | function |  | 4 |
| `updateCurveLatticeFromHandle` | 6336 | function |  | 3 |
| `beginCurveLatticeMultiEdit` | 6378 | function |  | 3 |
| `applyCurveLatticeMultiTransform` | 6399 | function |  | 3 |
| `curveLatticeColumnPoints` | 6442 | function |  | 3 |
| `groupCurveControlIndices` | 6451 | function |  | 4 |
| `groupCurveControlPoints` | 6457 | function |  | 2 |
| `updateGroupCurveDisplay` | 6463 | function |  | 3 |
| `ensureGroupCurveDisplay` | 6473 | function |  | 2 |
| `groupCurveDeformationPairs` | 6495 | function |  | 2 |
| `curveLatticeDeformationPairs` | 6502 | function |  | 2 |
| `appendPairs` | 6504 | arrow |  | 2 |
| `groupLatticeOffsetAtPoint` | 6515 | function |  | 2 |
| `updateGroupCurveLatticeStrands` | 6534 | function |  | 2 |
| `updateBoundCurveLatticeStrands` | 6555 | function |  | 2 |
| `createStrandsFromCurveLattice` | 6574 | function |  | 2 |
| `capsuleGuideCapHeight` | 6608 | function |  | 3 |
| `hideCapsuleGuideDrawPreview` | 6612 | function |  | 2 |
| `currentCapsuleGuideDrawProfile` | 6617 | function |  | 3 |
| `updateCapsuleGuideProfilePreview` | 6621 | function |  | 3 |
| `capsuleGuideDrawPoints` | 6633 | function |  | 4 |
| `updateCapsuleGuideDrawPreview` | 6649 | function |  | 3 |
| `beginCapsuleGuideDrawStroke` | 6655 | function |  | 2 |
| `updateCapsuleGuideDrawStroke` | 6681 | function |  | 2 |
| `createCapsuleGuideAlongCurve` | 6711 | function |  | 2 |
| `finishCapsuleGuideDrawStroke` | 6765 | function |  | 4 |
| `createCapsuleGuideGeometry` | 6786 | function |  | 7 |
| `vertex` | 6800 | function |  | 3 |
| `addFace` | 6806 | function |  | 3 |
| `addRing` | 6824 | function |  | 3 |
| `capsuleGuideTopologyFeature` | 6879 | function |  | 3 |
| `retopologizeCapsuleGuide` | 6889 | function |  | 2 |
| `resizeCapsuleGuideCylinder` | 6954 | function |  | 2 |
| `capsuleControlDataFromGeometry` | 7000 | function |  | 7 |
| `capsuleControlGeometryFromData` | 7013 | function |  | 2 |
| `capsuleGuidePointWorldPosition` | 7034 | function |  | 3 |
| `capsuleGuidePointDistances` | 7039 | function |  | 3 |
| `capsuleGuideHorizontalLoopsFromTopology` | 7060 | function |  | 4 |
| `capsuleGuideLoopCenter` | 7080 | function |  | 4 |
| `normalizeCapsuleGuideColor` | 7085 | function |  | 8 |
| `normalizeCapsuleGuideName` | 7091 | function |  | 3 |
| `capsuleGuideAccentColor` | 7096 | function |  | 8 |
| `updateCapsuleGuideDisplayColor` | 7101 | function |  | 5 |
| `updateCapsuleGuideLoopLines` | 7112 | function |  | 3 |
| `rebuildCapsuleGuideLoopLines` | 7124 | function |  | 2 |
| `createCapsuleGuideHandles` | 7156 | function |  | 2 |
| `rebuildCapsuleGuideHandles` | 7179 | function |  | 2 |
| `syncCapsuleGuideHandles` | 7198 | function |  | 4 |
| `capsuleGuideMirrorMap` | 7205 | function |  | 4 |
| `mirrorCapsuleGuidePointEdits` | 7221 | function |  | 3 |
| `updateCapsuleGuideHandleColors` | 7238 | function |  | 9 |
| `updateCapsuleGuideFromHandle` | 7253 | function |  | 2 |
| `beginCapsuleGuideHandleEdit` | 7290 | function |  | 2 |
| `selectCapsuleGuidePoint` | 7306 | function |  | 2 |
| `capsuleGuideLoopTransformGuide` | 7323 | function |  | 3 |
| `attachCapsuleGuideLoopTransform` | 7329 | function |  | 3 |
| `selectCapsuleGuideLoop` | 7356 | function |  | 2 |
| `beginCapsuleGuideLoopTransform` | 7368 | function |  | 2 |
| `updateCapsuleGuideLoopTransform` | 7387 | function |  | 2 |
| `refreshCapsuleGuideFillInfluence` | 7432 | function |  | 4 |
| `refreshCapsuleGuideLoopInfluence` | 7467 | function |  | 7 |
| `setCapsuleGuideLoopHover` | 7481 | function |  | 5 |
| `capsuleGuideLoopHitFromEvent` | 7487 | function |  | 3 |
| `updateCapsuleGuideLoopHover` | 7504 | function |  | 2 |
| `beginCapsuleGuideLoopDrag` | 7515 | function |  | 2 |
| `updateCapsuleGuideLoopDrag` | 7526 | function |  | 1 |
| `endCapsuleGuideLoopDrag` | 7556 | function |  | 1 |
| `createSubdividedQuadGeometry` | 7566 | function |  | 3 |
| `createEmphasizedSubdivisionEdges` | 7607 | function |  | 3 |
| `createQuadCageGeometry` | 7623 | function |  | 3 |
| `updateCapsuleGuideGeometry` | 7649 | function |  | 13 |
| `createCapsuleGuideMaterial` | 7702 | function |  | 2 |
| `updateCapsuleGuideWireOpacity` | 7740 | function |  | 6 |
| `updateCapsuleGuideFresnelMaterial` | 7750 | function |  | 4 |
| `addCapsuleGuide` | 7758 | function |  | 3 |
| `addGuide` | 7827 | function |  | 1 |
| `createGuideGeometry` | 7888 | function |  | 4 |
| `selectGuide` | 7943 | function |  | 17 |
| `updateGuideControlsVisibility` | 8011 | function |  | 10 |
| `updateViewportToolVisibility` | 8028 | function |  | 6 |
| `getSelectedGuide` | 8067 | function |  | 34 |
| `selectedViewportFocusBounds` | 8071 | function |  | 2 |
| `frameViewportBounds` | 8085 | function |  | 6 |
| `centerViewportOnSelectedItem` | 8115 | function |  | 2 |
| `fullSceneFocusBounds` | 8119 | function |  | 2 |
| `currentViewportFrameSelectionKey` | 8134 | function |  | 3 |
| `cycleViewportFraming` | 8143 | function |  | 2 |
| `syncGuideInputs` | 8161 | function |  | 4 |
| `updateGuideGeometry` | 8204 | function |  | 3 |
| `sculptBrushToolActive` | 8225 | function |  | 29 |
| `sculptBrushSelectionMaskActive` | 8229 | function |  | 3 |
| `sculptBrushSelectionAllows` | 8233 | function |  | 3 |
| `effectiveSculptBrushTool` | 8237 | function |  | 15 |
| `updateSculptScaleModeRow` | 8243 | function |  | 4 |
| `syncSculptBrushToolButtons` | 8248 | function |  | 3 |
| `setSculptBrushShiftSmoothHeld` | 8270 | function |  | 5 |
| `setActiveTool` | 8279 | function |  | 18 |
| `setDrawStrandMode` | 8417 | function |  | 2 |
| `setObjectSpaceEditing` | 8427 | function |  | 7 |
| `setHierarchyEditing` | 8443 | function |  | 4 |
| `setProportionalEditing` | 8455 | function |  | 5 |
| `beginProportionalSizeEdit` | 8474 | function |  | 3 |
| `updateProportionalSizeEdit` | 8486 | function |  | 2 |
| `endProportionalSizeEdit` | 8497 | function |  | 5 |
| `activateProportionalHotkeyHold` | 8504 | function |  | 2 |
| `refreshProportionalPreview` | 8512 | function |  | 4 |
| `activeBrushSizeInput` | 8522 | function |  | 2 |
| `refreshActiveBrushSizeCursor` | 8531 | function |  | 3 |
| `refreshActiveBrushSizeScale` | 8543 | function |  | 2 |
| `beginBrushSizeDrag` | 8561 | function |  | 1 |
| `updateBrushSizeDrag` | 8588 | function |  | 1 |
| `finishBrushSizeDrag` | 8609 | function |  | 2 |
| `updateInteractionLocks` | 8626 | function |  | 83 |
| `configureTransformControls` | 8637 | function |  | 16 |
| `pullMoveActive` | 8645 | function |  | 9 |
| `updatePullGuideVisual` | 8649 | function |  | 4 |
| `attachTransformForCurvePoint` | 8665 | function |  | 5 |
| `pointerHitsTransformGizmo` | 8689 | function |  | 7 |
| `strandObjectRootIndex` | 8705 | function |  | 3 |
| `strandObjectRoot` | 8714 | function |  | 4 |
| `strandObjectTransformQuaternion` | 8718 | function |  | 2 |
| `attachStrandObjectTransform` | 8723 | function |  | 6 |
| `guideObjectPivot` | 8746 | function |  | 3 |
| `guideObjectTransformQuaternion` | 8757 | function |  | 2 |
| `attachGuideObjectTransform` | 8762 | function |  | 6 |
| `guideObjectTransformSnapshot` | 8781 | function |  | 2 |
| `beginGuideObjectTransform` | 8809 | function |  | 2 |
| `updateLegacyGuideObjectTransform` | 8816 | function |  | 2 |
| `updateGuideObjectTransform` | 8838 | function |  | 2 |
| `finishGuideObjectTransform` | 8871 | function |  | 2 |
| `clonePlacementFrame` | 8880 | function |  | 2 |
| `cloneOptionalVectors` | 8892 | function |  | 10 |
| `strandObjectTransformSnapshot` | 8896 | function |  | 2 |
| `strandObjectPreviewMeshSnapshot` | 8913 | function |  | 2 |
| `restoreStrandObjectPreviewMeshes` | 8928 | function |  | 2 |
| `strandObjectTransformOperators` | 8944 | function |  | 4 |
| `transformPoint` | 8952 | arrow |  | 12 |
| `transformPointAroundFixedPivot` | 8959 | arrow |  | 0 |
| `transformNormal` | 8965 | arrow |  | 10 |
| `transformDirection` | 8975 | arrow |  | 5 |
| `worldMatrixForPivot` | 8987 | arrow |  | 2 |
| `worldMatrixForFixedPivot` | 8993 | arrow |  | 1 |
| `applyStrandObjectPreviewMatrix` | 9009 | function |  | 6 |
| `beginStrandObjectTransform` | 9035 | function |  | 2 |
| `updateStrandObjectTransform` | 9073 | function |  | 2 |
| `commitStrandObjectTransform` | 9131 | function |  | 2 |
| `mapPoints` | 9144 | arrow |  | 4 |
| `finishStrandObjectTransform` | 9178 | function |  | 2 |
| `surfaceObjectAnchorPose` | 9192 | function |  | 2 |
| `attachSurfaceObjectAnchorTransform` | 9215 | function |  | 5 |
| `selectSurfaceObjectAnchor` | 9228 | function |  | 3 |
| `beginSurfaceObjectTransform` | 9243 | function |  | 2 |
| `updateSurfaceObjectTransform` | 9269 | function |  | 2 |
| `finishSurfaceObjectTransform` | 9318 | function |  | 2 |
| `beginHandleEdit` | 9327 | function |  | 5 |
| `updateGroupLatticeBaseFromHandleEdit` | 9380 | function |  | 3 |
| `multiPointHandleEditActive` | 9391 | function |  | 7 |
| `applyMultiMove` | 9395 | function |  | 5 |
| `applyMultiRotate` | 9401 | function |  | 2 |
| `applyMultiScale` | 9410 | function |  | 2 |
| `applyHierarchicalMove` | 9419 | function |  | 3 |
| `applySingleMove` | 9431 | function |  | 5 |
| `applySurfaceLatticeMirror` | 9435 | function |  | 3 |
| `curveSurfaceMirroredPointIndex` | 9452 | function |  | 2 |
| `syncUnifiedCurveSurfaceMirror` | 9461 | function |  | 3 |
| `changed` | 9471 | arrow |  | 1 |
| `applyPullMove` | 9513 | function |  | 3 |
| `pullHeadCollisionContext` | 9521 | function |  | 2 |
| `constrainPullPointsOutsideHead` | 9540 | function |  | 2 |
| `applyProportionalMove` | 9563 | function |  | 3 |
| `viewPlaneNormal` | 9574 | function |  | 20 |
| `isCameraInSnappedView` | 9578 | function |  | 3 |
| `viewPlaneMoveActiveForView` | 9586 | function |  | 10 |
| `updateViewPlaneGrid` | 9590 | function |  | 14 |
| `setViewPlaneMove` | 9647 | function |  | 4 |
| `setViewPlaneMoveSnappedOnly` | 9658 | function |  | 2 |
| `rayFromViewportEvent` | 9666 | function |  | 21 |
| `worldUnitsPerViewportPixel` | 9674 | function |  | 4 |
| `viewPlaneMovePointNormal` | 9684 | function |  | 2 |
| `updateViewPlaneNormalGuide` | 9695 | function |  | 5 |
| `rebaseViewPlaneMoveDrag` | 9708 | function |  | 3 |
| `setViewPlaneNormalMoveHeld` | 9727 | function |  | 4 |
| `beginViewPlaneMove` | 9734 | function |  | 3 |
| `updateViewPlaneMove` | 9798 | function |  | 1 |
| `endViewPlaneMove` | 9863 | function |  | 7 |
| `applyHierarchicalRotate` | 9882 | function |  | 2 |
| `rotateGuideNormal` | 9889 | arrow |  | 4 |
| `applySingleRotate` | 9927 | function |  | 2 |
| `applyProportionalRotate` | 9931 | function |  | 2 |
| `applyHierarchicalScale` | 9951 | function |  | 2 |
| `applySingleScale` | 9961 | function |  | 2 |
| `applyProportionalScale` | 9965 | function |  | 2 |
| `setPointScale` | 9981 | function |  | 8 |
| `proportionalWeight` | 9990 | function |  | 8 |
| `proportionalStrandVisualsActive` | 10002 | function |  | 5 |
| `strandInfluenceColor` | 10008 | function |  | 12 |
| `beginRelaxEdit` | 10033 | function |  | 3 |
| `updateRelaxEdit` | 10062 | function |  | 1 |
| `endRelaxEdit` | 10122 | function |  | 1 |
| `disposeGuide` | 10132 | function |  | 3 |
| `removeGuideObjects` | 10160 | function |  | 3 |
| `strandRadiusAt` | 10174 | function |  | 5 |
| `strandProfileTopologyAt` | 10191 | function |  | 5 |
| `strandCurveParameters` | 10233 | function |  | 3 |
| `widthProfileAt` | 10243 | arrow |  | 1 |
| `braidFrameAt` | 10281 | function |  | 5 |
| `braidFrameAtExtended` | 10291 | function |  | 2 |
| `createBraidProfileProjector` | 10300 | function |  | 2 |
| `project` | 10316 | arrow |  | 21 |
| `createBraidGeometry` | 10331 | function |  | 2 |
| `deformationAt` | 10366 | function |  | 3 |
| `widthFor` | 10375 | arrow |  | 3 |
| `depthFor` | 10379 | arrow |  | 3 |
| `outputVertex` | 10411 | function |  | 7 |
| `appendAuthoredCap` | 10519 | function |  | 3 |
| `outputCapVertex` | 10526 | arrow |  | 6 |
| `capBoundary` | 10617 | function |  | 3 |
| `strandGeometryCurve` | 10679 | function |  | 13 |
| `strandGeometryFrameAt` | 10705 | function |  | 15 |
| `transportedStrandFrameAt` | 10768 | function |  | 6 |
| `twistOverrideAt` | 10771 | arrow |  | 2 |
| `smoothCoincidentPanelNormals` | 10799 | function |  | 2 |
| `weldPanelGeometryData` | 10835 | function |  | 2 |
| `surfaceLatticeSampleVectors` | 10881 | function |  | 3 |
| `surfacePanelPoint` | 10896 | function |  | 3 |
| `splitForkT` | 10919 | function |  | 3 |
| `tipWidthSideForkT` | 10932 | function |  | 7 |
| `tipSegmentWeightAt` | 10943 | function |  | 2 |
| `tipWidthControlTs` | 10962 | function |  | 4 |
| `tipWidthCommonForkT` | 10973 | function |  | 4 |
| `tipWidthResetCurve` | 10981 | function |  | 3 |
| `tipWidthSpreadGap` | 10999 | function |  | 4 |
| `tipWidthMultiplierAt` | 11016 | function |  | 8 |
| `tipPanelWidthAt` | 11055 | function |  | 7 |
| `buildTipWidthCurve` | 11061 | function |  | 5 |
| `addPoint` | 11071 | arrow |  | 3 |
| `setTipWidthCurveValue` | 11102 | function |  | 4 |
| `tipPanelFrameAt` | 11121 | function |  | 4 |
| `tipMainSectionPoint` | 11155 | function |  | 4 |
| `tipSurfaceFrameAt` | 11203 | function |  | 3 |
| `tipChainFrameAt` | 11234 | function |  | 4 |
| `tipWidthEdgePosition` | 11265 | function |  | 4 |
| `tipWidthEdgePoints` | 11296 | function |  | 2 |
| `tipWidthControlPlacement` | 11311 | function |  | 3 |
| `tipHighlightMaterial` | 11327 | function |  | 2 |
| `updateTipHighlight` | 11349 | function |  | 4 |
| `splitTipForSegment` | 11406 | function |  | 9 |
| `createPanelStrandGeometry` | 11449 | function |  | 2 |
| `segmentWeightAt` | 11480 | arrow |  | 1 |
| `addQuad` | 11496 | arrow |  | 6 |
| `near` | 11500 | arrow |  | 6 |
| `panelWidthAt` | 11530 | arrow |  | 6 |
| `panelThicknessAt` | 11535 | arrow |  | 6 |
| `panelFrameAt` | 11544 | arrow |  | 1 |
| `rawPanelPoint` | 11562 | arrow |  | 1 |
| `panelPoint` | 11596 | arrow |  | 3 |
| `addPatch` | 11604 | arrow |  | 1 |
| `uStart` | 11735 | arrow |  | 1 |
| `uEnd` | 11738 | arrow |  | 1 |
| `clipStrandProfilePolygon` | 11777 | function |  | 3 |
| `inside` | 11778 | arrow |  | 2 |
| `pushOrientedTriangle` | 11800 | function |  | 7 |
| `triangulatePolygon3D` | 11811 | function |  | 1 |
| `orientedQuadFace` | 11861 | function |  | 2 |
| `createSplitStrandGeometry` | 11869 | function |  | 2 |
| `fusedIndexAt` | 12026 | arrow |  | 0 |
| `createHairCardGeometry` | 12075 | function |  | 2 |
| `createPolyGeometry` | 12174 | function |  | 2 |
| `curveSurfaceControllerCurves` | 12201 | function |  | 4 |
| `curveSurfaceControllerFrameLock` | 12210 | function |  | 6 |
| `sampledCurveSurfaceControllerCurves` | 12257 | function |  | 4 |
| `sampledCurveSurfaceControllerSides` | 12265 | function |  | 2 |
| `activeCurveSurfaceControllerIndex` | 12281 | function |  | 5 |
| `curveSurfaceControllerPointRange` | 12290 | function |  | 4 |
| `curveSurfaceControllerPreviewRows` | 12301 | function |  | 3 |
| `curveSurfaceControllerSegments` | 12309 | function |  | 2 |
| `curveSurfaceControllerIndexNearPoint` | 12319 | function |  | 2 |
| `curveSurfaceControllerHitFromEvent` | 12339 | function |  | 3 |
| `createConnectedCurveCardGeometry` | 12362 | function |  | 4 |
| `createCompoundStrandGeometry` | 12445 | function |  | 2 |
| `proceduralBranchGeometryLock` | 12696 | function |  | 2 |
| `createHairGeometry` | 12741 | function |  | 6 |
| `createBaseHairGeometry` | 12793 | function |  | 3 |
| `hairMaterialDefinition` | 12878 | function |  | 4 |
| `materialForLock` | 12882 | function |  | 8 |
| `activeHairMaterialDefinition` | 12886 | function |  | 11 |
| `strandDisplayColor` | 12892 | function |  | 14 |
| `setAnimeHairBaseColor` | 12910 | function |  | 4 |
| `createAnimeAnisotropicMaterial` | 12923 | function |  | 2 |
| `createHairMaterial` | 12963 | function |  | 5 |
| `createStrandSelectionOutline` | 13005 | function |  | 5 |
| `strandUsesDoubleSidedMaterial` | 13040 | function |  | 7 |
| `applyMaterialDefinitionToLock` | 13049 | function |  | 6 |
| `refreshMaterialUsers` | 13076 | function |  | 6 |
| `renderHairMaterialOutliner` | 13085 | function |  | 5 |
| `renderHairMaterialOptions` | 13115 | function |  | 3 |
| `syncHairMaterialEditor` | 13125 | function |  | 9 |
| `createProjectHairMaterial` | 13151 | function |  | 3 |
| `deleteActiveHairMaterial` | 13171 | function |  | 2 |
| `createHairTopologyGeometry` | 13189 | function |  | 4 |
| `createHairTopologyOverlay` | 13210 | function |  | 3 |
| `groupDefaultsFor` | 13257 | function |  | 9 |
| `creationToolActive` | 13264 | function |  | 7 |
| `activeCreationShapeDefaults` | 13268 | function |  | 9 |
| `activeStrandShapeTarget` | 13274 | function |  | 8 |
| `curvePolylineLength` | 13278 | function |  | 2 |
| `curvePolylineLengths` | 13286 | function |  | 3 |
| `samplePolylineDistance` | 13294 | function |  | 2 |
| `applyProjectedCurveLength` | 13304 | function |  | 4 |
| `clearRegionLengthBaseline` | 13335 | function |  | 2 |
| `ensureRegionLengthBaseline` | 13342 | function |  | 2 |
| `setGroupLengthScale` | 13350 | function |  | 2 |
| `applyGroupDefaultsToExistingStrands` | 13388 | function |  | 4 |
| `requestGroupDefaultsWarning` | 13420 | function |  | 1 |
| `activeProfileOffset` | 13432 | function |  | 3 |
| `profileToCanvas` | 13440 | function |  | 1 |
| `renderProfilePreview` | 13447 | function |  | 7 |
| `renderHairCardCoveragePath` | 13466 | function |  | 2 |
| `activeTaperTarget` | 13481 | function |  | 20 |
| `activeTaperCurve` | 13536 | function |  | 15 |
| `ensureSecondaryTaperCurve` | 13547 | function |  | 7 |
| `taperSamples` | 13557 | function |  | 5 |
| `ensureAsymmetricTaperPreviewElements` | 13564 | function |  | 2 |
| `renderTaperPreview` | 13586 | function |  | 17 |
| `shapeTargetForSelect` | 13625 | function |  | 3 |
| `setupShapePresetControls` | 13635 | function |  | 2 |
| `syncShapePresetRemoveButtons` | 13660 | function |  | 3 |
| `syncShapePresetSelects` | 13666 | function |  | 6 |
| `populateShapePresetSelects` | 13687 | function |  | 5 |
| `openSaveShapePreset` | 13715 | function |  | 2 |
| `commitCustomShapePreset` | 13740 | function |  | 2 |
| `openRemoveShapePreset` | 13763 | function |  | 2 |
| `commitRemoveShapePreset` | 13776 | function |  | 2 |
| `taperPointToCanvas` | 13792 | function |  | 4 |
| `canvasToTaperPoint` | 13809 | function |  | 2 |
| `clearTaperMeshPoints` | 13845 | function |  | 2 |
| `taperMeshPointFrame` | 13855 | function |  | 3 |
| `taperMeshPointExtentPerValue` | 13868 | function |  | 4 |
| `updateTaperMeshPoints` | 13905 | function |  | 5 |
| `setTaperMeshPointsVisible` | 13984 | function |  | 6 |
| `renderTaperCurveEditor` | 14002 | function |  | 13 |
| `tipSideForkFor` | 14015 | arrow |  | 1 |
| `updateTaperCurveEditorTargetLabel` | 14094 | function |  | 4 |
| `retargetOpenTaperCurveEditor` | 14108 | function |  | 2 |
| `refreshTaperCurveEditorAfterStateRestore` | 14124 | function |  | 2 |
| `scheduleTaperCurveEdit` | 14156 | function |  | 3 |
| `flushScheduledTaperCurveEdit` | 14165 | function |  | 6 |
| `cancelScheduledTaperCurveEdit` | 14176 | function |  | 2 |
| `applyTaperCurveEdit` | 14184 | function |  | 10 |
| `openTaperCurveEditor` | 14310 | function |  | 3 |
| `openPanelSegmentCurveEditor` | 14355 | function |  | 3 |
| `closeTaperCurveEditor` | 14391 | function |  | 4 |
| `updateViewportStatsVisibility` | 14404 | function |  | 5 |
| `canvasToProfile` | 14423 | function |  | 2 |
| `retargetFloatingStrandEditors` | 14437 | function |  | 2 |
| `addLock` | 14452 | function |  | 19 |
| `mirroredVector` | 14664 | function |  | 12 |
| `mirroredPlacementFrame` | 14668 | function |  | 2 |
| `mirrorPartnerFor` | 14681 | function |  | 40 |
| `decoupleMirrorPartner` | 14685 | function |  | 2 |
| `createMirrorPartner` | 14693 | function |  | 6 |
| `createMirrorPartnerForNewLock` | 14789 | function |  | 6 |
| `mirroredClumpPartners` | 14794 | function |  | 6 |
| `createMirroredClump` | 14800 | function |  | 3 |
| `decoupleMirroredClump` | 14822 | function |  | 3 |
| `syncMirrorPartnerFromLock` | 14842 | function |  | 6 |
| `syncActiveMirror` | 15009 | function |  | 31 |
| `setMirrorXEditing` | 15021 | function |  | 5 |
| `snapshotState` | 15045 | function |  | 7 |
| `rootAttachmentFrame` | 15306 | function |  | 3 |
| `rootAttachmentLocalFrame` | 15318 | function |  | 4 |
| `resolveRootAttachment` | 15336 | function |  | 4 |
| `curvePointsToRootLocal` | 15376 | function |  | 2 |
| `curvePointsFromRootLocal` | 15388 | function |  | 2 |
| `syncRootAttachmentLocalCurves` | 15396 | function |  | 2 |
| `applyRootAttachmentLocalCurves` | 15412 | function |  | 2 |
| `createRootAttachment` | 15443 | function |  | 7 |
| `syncRootAttachmentMetadata` | 15473 | function |  | 3 |
| `rootAttachmentToData` | 15500 | function |  | 2 |
| `rootAttachmentFromData` | 15528 | function |  | 3 |
| `importHeadMeshFile` | 15570 | function |  | 3 |
| `importFullBodyMeshFile` | 15593 | function |  | 3 |
| `downloadPreferencesAndPresets` | 15618 | function |  | 1 |
| `importedBooleanPreference` | 15651 | function |  | 11 |
| `loadPreferencesAndPresets` | 15665 | function |  | 2 |
| `handlePreferencesAndPresetsFile` | 15735 | function |  | 1 |
| `openHairProjectFile` | 15779 | function |  | 4 |
| `dragContainsApplicationFile` | 15837 | function |  | 3 |
| `safelyRememberRecentProject` | 15846 | function |  | 2 |
| `renderRecentProjectsMenu` | 15855 | function |  | 4 |
| `openDroppedApplicationFilePrompt` | 15887 | function |  | 3 |
| `closeDroppedApplicationFilePrompt` | 15912 | function |  | 2 |
| `confirmDroppedApplicationFile` | 15916 | function |  | 2 |
| `pushUndoState` | 15932 | function |  | 110 |
| `undoLastAction` | 15939 | function |  | 2 |
| `redoLastAction` | 15956 | function |  | 2 |
| `updateHistoryButtons` | 15973 | function |  | 12 |
| `resetTransientInteractionsForStateRestore` | 15978 | function |  | 2 |
| `resetEditableSceneForStateRestore` | 15998 | function |  | 2 |
| `restoreSharedStateForStateRestore` | 16005 | function |  | 2 |
| `restoreSceneCollectionsForStateRestore` | 16044 | function |  | 2 |
| `validateSelectionAfterStateRestore` | 16070 | function |  | 2 |
| `reapplySelectionAfterStateRestore` | 16102 | function |  | 2 |
| `finalizeStateRestore` | 16143 | function |  | 2 |
| `restoreState` | 16150 | function |  | 5 |
| `disposeAllEditableObjects` | 16174 | function |  | 2 |
| `restoreLock` | 16195 | function |  | 4 |
| `restoreGuide` | 16419 | function |  | 2 |
| `vectorToData` | 16480 | function |  | 29 |
| `dataToVector` | 16484 | function |  | 30 |
| `frameToData` | 16488 | function |  | 2 |
| `frameFromData` | 16500 | function |  | 2 |
| `applyPresetSelection` | 16512 | function |  | 2 |
| `drawPresetThumbnail` | 16543 | function |  | 1 |
| `fillHair` | 16558 | arrow |  | 9 |
| `strand` | 16570 | arrow |  | 31 |
| `bun` | 16588 | arrow |  | 2 |
| `braid` | 16623 | arrow |  | 2 |
| `renderPresetLibrary` | 16712 | function |  | 3 |
| `setPresetLibraryOpen` | 16771 | function |  | 6 |
| `average` | 16784 | function |  | 4 |
| `fitPointAttributes` | 16788 | function |  | 9 |
| `rebuildCurveObjects` | 16817 | function |  | 10 |
| `createCurvePoints` | 16829 | function |  | 2 |
| `addGeneratedBangPreset` | 16838 | function |  | 1 |
| `createLongLayeredCurlPoints` | 16932 | function |  | 2 |
| `addLongLayeredCurlsPreset` | 16981 | function |  | 1 |
| `columns` | 16982 | arrow |  | 1 |
| `layer` | 16986 | arrow |  | 31 |
| `createBraidedBobShellPoints` | 17200 | function |  | 2 |
| `addBraidedBobPreset` | 17236 | function |  | 1 |
| `evenColumns` | 17237 | arrow |  | 12 |
| `addBraidedBobPresetV2` | 17453 | function |  | 1 |
| `scalpSeed` | 17476 | arrow |  | 1 |
| `createBowlCutPoints` | 17763 | function |  | 2 |
| `addBowlCutPreset` | 17801 | function |  | 1 |
| `selectedCurveLatticeGuide` | 17869 | function |  | 12 |
| `braidStrokeActive` | 17876 | function |  | 8 |
| `proceduralDrawActive` | 17880 | function |  | 3 |
| `panelStrokeActive` | 17884 | function |  | 5 |
| `activeStrokeSurfaceInput` | 17888 | function |  | 4 |
| `activeStrokeSurfaceValue` | 17892 | function |  | 23 |
| `normalizedLiveSurfaceSelection` | 17896 | function |  | 4 |
| `activeStrokeDynamicEnabled` | 17902 | function |  | 11 |
| `drawSurfaceDynamicEnabled` | 17906 | function |  | 6 |
| `setDrawSurfaceDynamicEnabled` | 17910 | function |  | 6 |
| `setActiveStrokeSurfaceValue` | 17914 | function |  | 3 |
| `liveSurfaceStrandId` | 17924 | function |  | 4 |
| `liveSurfaceStrand` | 17928 | function |  | 3 |
| `liveSurfaceGuideId` | 17933 | function |  | 3 |
| `guideSupportsLiveSurface` | 17937 | function |  | 2 |
| `liveSurfaceGuide` | 17944 | function |  | 3 |
| `refreshLiveSurfaceOptions` | 17951 | function |  | 12 |
| `activeStrokeBrushSize` | 17992 | function |  | 10 |
| `activeStrokeBrushDepth` | 17998 | function |  | 5 |
| `strokeSurfaceIsContextual` | 18004 | function |  | 7 |
| `contextualPlaneAtOrigin` | 18012 | function |  | 9 |
| `drawSurfaceHitFromEvent` | 18022 | function |  | 13 |
| `worldNormalAtHit` | 18061 | function |  | 6 |
| `selectedPolyMesh` | 18069 | function |  | 10 |
| `addPolyLock` | 18074 | function |  | 2 |
| `ensurePolyMesh` | 18093 | function |  | 3 |
| `polySurfaceSample` | 18097 | function |  | 4 |
| `polyTargetAtEvent` | 18108 | function |  | 6 |
| `refreshPolyMesh` | 18134 | function |  | 10 |
| `ensurePolyFillPreview` | 18143 | function |  | 2 |
| `clearPolyFillPreview` | 18180 | function |  | 17 |
| `polyFillCandidateForEvent` | 18185 | function |  | 3 |
| `showPolyFillPreview` | 18205 | function |  | 2 |
| `updatePolyFillPreview` | 18231 | function |  | 2 |
| `refreshPolyFillPreviewFromLastPointer` | 18256 | function |  | 5 |
| `fillPolyGap` | 18266 | function |  | 2 |
| `polyRelaxSurfaceObjects` | 18277 | function |  | 2 |
| `projectPolyRelaxPoint` | 18297 | function |  | 2 |
| `removePolyPointAttributes` | 18341 | function |  | 3 |
| `deletePolyComponent` | 18350 | function |  | 2 |
| `addPolyPoint` | 18373 | function |  | 4 |
| `appendPolyStrokeRow` | 18382 | function |  | 4 |
| `beginPolyBrushPointer` | 18402 | function |  | 1 |
| `finishPolyAltDelete` | 18488 | function |  | 1 |
| `updatePolyBrushStroke` | 18502 | function |  | 1 |
| `finishPolyBrushStroke` | 18592 | function |  | 4 |
| `drawSampleFromHit` | 18630 | function |  | 3 |
| `updateDrawStrandBrushCursor` | 18644 | function |  | 3 |
| `strokeLength` | 18681 | function |  | 9 |
| `resampleDrawStroke` | 18687 | function |  | 2 |
| `processedDrawStroke` | 18719 | function |  | 8 |
| `strokeSurfaceNormals` | 18748 | function |  | 7 |
| `drawClumpFrame` | 18759 | function |  | 4 |
| `nearestCurveParameter` | 18768 | function |  | 2 |
| `drawClumpSampleNormal` | 18782 | function |  | 6 |
| `drawClumpTemplateVector` | 18791 | function |  | 1 |
| `applyDrawClumpTemplateSettings` | 18797 | function |  | 3 |
| `drawClumpStrandMaps` | 18813 | function |  | 4 |
| `nextClumpName` | 18868 | function |  | 6 |
| `initializeClumpShape` | 18875 | function |  | 5 |
| `stableClumpVariation` | 18886 | function |  | 3 |
| `createClumpFromLocks` | 18898 | function |  | 7 |
| `addLockToClump` | 18923 | function |  | 4 |
| `pointerToNdc` | 18979 | function |  | 1 |
| `gridProfileSkipCol` | 18995 | function |  | 3 |
| `clumpDirectMembers` | 19019 | function |  | 3 |
| `clumpMembersForGuide` | 19024 | function |  | 6 |
| `clumpGuideForLock` | 19028 | function |  | 13 |
| `proceduralGuideForLock` | 19033 | function |  | 10 |
| `proceduralAccessoryMembersForGuide` | 19040 | function |  | 5 |
| `proceduralBranchMembersForGuide` | 19047 | function |  | 3 |
| `proceduralBranchTemplatesForGuide` | 19054 | function |  | 3 |
| `proceduralBranchWorldPoints` | 19066 | function |  | 2 |
| `applyProceduralBranchSettings` | 19079 | function |  | 3 |
| `proceduralAccessoryMapsForGuide` | 19118 | function |  | 3 |
| `setProceduralAccessoryGeometry` | 19134 | function |  | 3 |
| `createProceduralAccessoryLock` | 19148 | function |  | 2 |
| `applyProceduralAccessorySettings` | 19200 | function |  | 2 |
| `clumpFrameAt` | 19251 | function |  | 5 |
| `commitClumpMemberRestState` | 19259 | function |  | 10 |
| `updateClumpMembers` | 19342 | function |  | 10 |
| `dissolveClump` | 19446 | function |  | 6 |
| `detachLockFromClump` | 19483 | function |  | 4 |
| `updateDrawVolumePreview` | 19509 | function |  | 5 |
| `hideDrawClumpPreviews` | 19533 | function |  | 5 |
| `resetDrawVolumePreview` | 19539 | function |  | 3 |
| `updateDrawStrandPreview` | 19545 | function |  | 23 |
| `continueFromTipEnabled` | 19766 | function |  | 2 |
| `selectedTipContinuationLock` | 19772 | function |  | 3 |
| `beginDrawStrandStroke` | 19787 | function |  | 2 |
| `beginDrawFreePlane` | 19916 | function |  | 3 |
| `drawStrokeSampleAtEvent` | 19930 | function |  | 2 |
| `updateDrawStrandStroke` | 19955 | function |  | 1 |
| `createDrawnLock` | 20001 | function |  | 3 |
| `setting` | 20005 | arrow |  | 29 |
| `finalizeDrawnLockSelection` | 20073 | function |  | 4 |
| `createDrawnBraid` | 20081 | function |  | 2 |
| `createDrawnStrand` | 20138 | function |  | 2 |
| `createDrawnPanel` | 20265 | function |  | 2 |
| `surfaceLatticeNormal` | 20317 | function |  | 2 |
| `createSurfaceLockFromLattice` | 20332 | function |  | 3 |
| `createViewportSurface` | 20397 | function |  | 2 |
| `loftSurfaceProfilePoints` | 20426 | function |  | 6 |
| `hideLoftSurfacePreviews` | 20432 | function |  | 4 |
| `updateLoftSurfaceDraftUi` | 20439 | function |  | 4 |
| `updateLoftSurfacePreview` | 20448 | function |  | 5 |
| `resetLoftSurfaceDraft` | 20480 | function |  | 5 |
| `cancelLoftSurfaceDraft` | 20496 | function |  | 3 |
| `cloneCurveSurfaceSource` | 20514 | function |  | 5 |
| `curveSurfaceSourceForSnapshot` | 20536 | function |  | 2 |
| `mirroredCurveSurfaceSource` | 20562 | function |  | 3 |
| `curveSurfaceProfilePoints` | 20572 | function |  | 3 |
| `curveSurfaceProfileNormals` | 20576 | function |  | 2 |
| `curveSurfacePreviewLock` | 20585 | function |  | 2 |
| `curveSurfaceCardWireSegments` | 20608 | function |  | 2 |
| `hideCurveSurfacePreview` | 20624 | function |  | 5 |
| `curveSurfaceCurveAverageX` | 20636 | function |  | 5 |
| `curveSurfaceCurvesMatch` | 20641 | function |  | 2 |
| `unifiedMirroredCurveSurface` | 20650 | function |  | 3 |
| `curveSurfaceSideVector` | 20688 | function |  | 4 |
| `curveSurfaceDraftCurves` | 20701 | function |  | 2 |
| `curveSurfaceFallbackHit` | 20709 | function |  | 4 |
| `updateCurveSurfaceDraftUi` | 20722 | function |  | 5 |
| `updateCurveSurfacePreview` | 20742 | function |  | 6 |
| `resetCurveSurfaceDraft` | 20804 | function |  | 4 |
| `cancelCurveSurfaceDraft` | 20826 | function |  | 3 |
| `beginCurveSurfaceStroke` | 20841 | function |  | 2 |
| `curveSurfaceStrokeEvent` | 20889 | function |  | 3 |
| `updateCurveSurfaceStroke` | 20924 | function |  | 1 |
| `finishCurveSurfaceStroke` | 20956 | function |  | 5 |
| `confirmCurveSurfaceDraft` | 21014 | function |  | 2 |
| `commitCurveSurfaceDraft` | 21091 | function |  | 3 |
| `loftSurfaceSampleFromHit` | 21096 | function |  | 8 |
| `beginLoftSurfaceStroke` | 21105 | function |  | 2 |
| `beginLoftSurfaceFreePlane` | 21139 | function |  | 2 |
| `updateLoftSurfaceStroke` | 21150 | function |  | 1 |
| `finishLoftSurfaceStroke` | 21180 | function |  | 2 |
| `extendDrawnStrand` | 21237 | function |  | 2 |
| `finishDrawStrandStroke` | 21270 | function |  | 7 |
| `createPlacedStrand` | 21297 | function |  | 2 |
| `placedPointCount` | 21361 | function |  | 3 |
| `createPlacedPoints` | 21365 | function |  | 3 |
| `pushPointOutsideHead` | 21384 | function |  | 8 |
| `resizePlacedStrand` | 21416 | function |  | 5 |
| `applyPlacedStrandScaleProfile` | 21433 | function |  | 5 |
| `beginPlaceEdit` | 21438 | function |  | 2 |
| `updatePlaceEdit` | 21456 | function |  | 1 |
| `updatePlacementLength` | 21470 | function |  | 3 |
| `updatePlacementOrientation` | 21480 | function |  | 3 |
| `endPlaceEdit` | 21498 | function |  | 1 |
| `confirmPendingPlacedStrand` | 21513 | function |  | 1 |
| `pendingPlacedLock` | 21523 | function |  | 2 |
| `beginPlacementPointer` | 21527 | function |  | 3 |
| `finishPlacementPointer` | 21537 | function |  | 2 |
| `confirmPlacementStep` | 21561 | function |  | 2 |
| `finishPlacementFlow` | 21584 | function |  | 7 |
| `updatePlacementStatus` | 21597 | function |  | 72 |
| `deselectStrands` | 21736 | function |  | 11 |
| `beginSelectionMarquee` | 21751 | function |  | 3 |
| `beginAltOrbit` | 21775 | function |  | 1 |
| `beginBlenderNavigation` | 21787 | function |  | 1 |
| `endBlenderNavigation` | 21832 | function |  | 1 |
| `prepareSelectPointerCapture` | 21840 | function |  | 1 |
| `endSelectPointerCapture` | 21846 | function |  | 1 |
| `applyAltClickCandidate` | 21852 | function |  | 2 |
| `finishBrushAltClick` | 21878 | function |  | 1 |
| `endAltOrbit` | 21891 | function |  | 2 |
| `dollyCameraByDrag` | 21898 | function |  | 2 |
| `fastDragMagnitude` | 21921 | function |  | 2 |
| `beginHoudiniZoomDrag` | 21927 | function |  | 1 |
| `updateHoudiniZoomDrag` | 21935 | function |  | 1 |
| `endHoudiniZoomDrag` | 21952 | function |  | 1 |
| `updateSelectionMarquee` | 21960 | function |  | 1 |
| `pointInsideSelectionMarquee` | 21977 | function |  | 3 |
| `selectPointsInMarquee` | 21985 | function |  | 2 |
| `pointKey` | 22011 | arrow |  | 2 |
| `objectSelectionScreenBounds` | 22042 | function |  | 2 |
| `objectInsideSelectionMarquee` | 22079 | function |  | 3 |
| `projectedPoint` | 22096 | arrow |  | 1 |
| `selectObjectsInMarquee` | 22125 | function |  | 2 |
| `finishSelectionMarquee` | 22170 | function |  | 2 |
| `headMeshes` | 22193 | function |  | 7 |
| `strandSplitProfileData` | 22201 | function |  | 4 |
| `strandSplitControlPoint` | 22214 | function |  | 4 |
| `panelSplitControlPoint` | 22250 | function |  | 8 |
| `strandControlPointRaycast` | 22307 | function |  | 1 |
| `strandControlPointFrame` | 22342 | function |  | 4 |
| `strandControlPointHitFromEvent` | 22374 | function |  | 4 |
| `createCurveObjects` | 22432 | function |  | 4 |
| `polyEdgeKey` | 22694 | function |  | 2 |
| `polyMeshEdges` | 22698 | function |  | 2 |
| `populatePolyEditObjects` | 22712 | function |  | 3 |
| `createPolyEditObjects` | 22776 | function |  | 2 |
| `rebuildPolyEditObjects` | 22784 | function |  | 2 |
| `strandWidthEdgeFrameAt` | 22798 | function |  | 5 |
| `transportedStrandWidthEdgeFrame` | 22805 | function |  | 2 |
| `strandWidthEdgeSample` | 22814 | function |  | 3 |
| `strandWidthEdgePoints` | 22837 | function |  | 2 |
| `sculptBrushDebugRaycast` | 22851 | arrow |  | 0 |
| `setSculptBrushMaterialClipping` | 22855 | function |  | 3 |
| `sculptBrushDebugCurveVisible` | 22862 | function |  | 3 |
| `refreshSculptBrushDebugView` | 22874 | function |  | 3 |
| `refreshSculptBrushDebugAfterStateRestore` | 22879 | function |  | 1 |
| `updateSculptBrushDebugCurve` | 22885 | function |  | 3 |
| `updateCurveObjects` | 22899 | function |  | 43 |
| `syncTipNormalArrow` | 23141 | arrow |  | 4 |
| `createCurveNormalIndicator` | 23354 | function |  | 3 |
| `pointUpDirection` | 23380 | function |  | 2 |
| `curveFrameAtPoint` | 23384 | function |  | 4 |
| `curveFrameAt` | 23405 | function |  | 4 |
| `strandTwistAt` | 23425 | function |  | 6 |
| `controlPointRotationAt` | 23430 | function |  | 4 |
| `strandProfileTwistAt` | 23434 | function |  | 2 |
| `strandFrameAt` | 23440 | function |  | 2 |
| `curveFrameAtSnapshot` | 23446 | function |  | 3 |
| `outwardNormalAtPoint` | 23465 | function |  | 12 |
| `sampledSurfaceNormal` | 23477 | function |  | 2 |
| `guidedNormalAt` | 23493 | function |  | 6 |
| `twistFromHandle` | 23512 | function |  | 3 |
| `signedAngleAroundAxis` | 23533 | function |  | 6 |
| `handleColor` | 23540 | function |  | 2 |
| `isAffectedCurvePoint` | 23563 | function |  | 2 |
| `syncLockFromCurve` | 23569 | function |  | 24 |
| `labelForPreset` | 23599 | function |  | 1 |
| `rebuildLockGeometry` | 23603 | function |  | 10 |
| `scheduleSculptBrushGeometryUpdates` | 23630 | function |  | 3 |
| `queueSculptBrushGeometryUpdate` | 23638 | function |  | 3 |
| `flushSculptBrushGeometryUpdates` | 23644 | function |  | 3 |
| `flushPendingLockGeometryUpdates` | 23666 | function |  | 8 |
| `updateLockGeometry` | 23679 | function |  | 62 |
| `setGroupColorView` | 23700 | function |  | 2 |
| `createUvCheckerTexture` | 23710 | function |  | 3 |
| `ensureUvCheckerForLock` | 23746 | function |  | 4 |
| `removeUvCheckerFromLock` | 23779 | function |  | 3 |
| `invalidateUvInspector` | 23794 | function |  | 7 |
| `uvInspectorRecord` | 23798 | function |  | 1 |
| `uvInspectorRecords` | 23837 | function |  | 2 |
| `drawUvInspectorGrid` | 23841 | function |  | 2 |
| `renderUvInspector` | 23875 | function |  | 3 |
| `setUvCheckerEnabled` | 23934 | function |  | 3 |
| `strandViewportBaseColor` | 23951 | function |  | 3 |
| `strandMirrorPartnerHighlighted` | 23986 | function |  | 3 |
| `syncStrandSelectionOutline` | 23992 | function |  | 2 |
| `applyLockedStrandPalette` | 24003 | function |  | 2 |
| `syncLockedStrandWireVisual` | 24012 | function |  | 6 |
| `setStrandSelectionVisual` | 24021 | function |  | 6 |
| `proceduralParentOutlineVisible` | 24037 | function |  | 2 |
| `syncProceduralParentVisibility` | 24044 | function |  | 7 |
| `updateStrandSelectionHighlightForLock` | 24053 | function |  | 2 |
| `updateStrandSelectionHighlight` | 24057 | function |  | 7 |
| `refreshStrandCurveSelectionVisuals` | 24061 | function |  | 2 |
| `resetGuideSelectionVisuals` | 24074 | function |  | 2 |
| `refreshStrandSelectionConsumers` | 24094 | function |  | 3 |
| `selectLock` | 24127 | function |  | 47 |
| `deselectStrandsForGuideEditor` | 24189 | function |  | 3 |
| `syncGroupInputs` | 24200 | function |  | 2 |
| `topologyStatsForLock` | 24233 | function |  | 4 |
| `formatTopologyStats` | 24241 | function |  | 5 |
| `updateTopologyStats` | 24245 | function |  | 25 |
| `normalizeBraidDimensions` | 24279 | function |  | 3 |
| `normalizeStrandDimensions` | 24292 | function |  | 3 |
| `strandBaseWidth` | 24306 | function |  | 5 |
| `strandWidthDimension` | 24310 | function |  | 5 |
| `strandDepthDimension` | 24318 | function |  | 8 |
| `setStrandWidthDimension` | 24326 | function |  | 2 |
| `setStrandDepthDimension` | 24348 | function |  | 4 |
| `syncShapeDimensionInputs` | 24364 | function |  | 4 |
| `syncCreationShapeInputs` | 24400 | function |  | 3 |
| `syncViewportDrawSettings` | 24438 | function |  | 4 |
| `selectedPanelSegment` | 24452 | function |  | 6 |
| `syncPanelSegmentControls` | 24458 | function |  | 11 |
| `syncPanelShapeInputs` | 24476 | function |  | 6 |
| `syncStrandSplitInputs` | 24503 | function |  | 4 |
| `syncHairCardControls` | 24512 | function |  | 6 |
| `syncProceduralAccessoryEditControls` | 24520 | function |  | 3 |
| `updateAttributeEditorMode` | 24559 | function |  | 15 |
| `pinActiveToolSettingsPanel` | 24709 | function |  | 2 |
| `curveLatticeForGroup` | 24732 | function |  | 2 |
| `filterCurveLatticesToGroup` | 24750 | function |  | 8 |
| `createStandaloneCurveLatticeGuide` | 24795 | function |  | 2 |
| `showCurveLatticeForGroup` | 24812 | function |  | 2 |
| `selectStrandGroup` | 24849 | function |  | 3 |
| `selectCurvePoint` | 24891 | function |  | 10 |
| `updateSelectedPointLabel` | 24905 | function |  | 14 |
| `syncInputs` | 24918 | function |  | 15 |
| `syncClumpGuidePanel` | 24964 | function |  | 3 |
| `getSelectedLock` | 24991 | function |  | 111 |
| `selectedLocksInOrder` | 24995 | function |  | 37 |
| `lockStrands` | 25001 | function |  | 3 |
| `lockSelectedStrands` | 25034 | function |  | 3 |
| `unlockStrands` | 25040 | function |  | 3 |
| `unlockAllStrands` | 25055 | function |  | 3 |
| `strandEditFamily` | 25059 | function |  | 7 |
| `compatibleSelectedLocks` | 25064 | function |  | 5 |
| `selectedEditRoots` | 25071 | function |  | 2 |
| `editSelectedLocks` | 25084 | function |  | 19 |
| `multiEditValuesEqual` | 25117 | function |  | 2 |
| `setMixedControl` | 25126 | function |  | 28 |
| `syncMultiStrandInputs` | 25143 | function |  | 16 |
| `values` | 25159 | arrow |  | 38 |
| `selectedRebuildableCurves` | 25239 | function |  | 5 |
| `createCompoundStrand` | 25246 | function |  | 1 |
| `refreshRebuildCurveDialog` | 25307 | function |  | 9 |
| `openRebuildCurveDialog` | 25320 | function |  | 1 |
| `rebuildSelectedCurves` | 25334 | function |  | 2 |
| `selectionCanBecomeClump` | 25373 | function |  | 4 |
| `createClumpFromSelection` | 25378 | function |  | 3 |
| `cleanSelectionSets` | 25390 | function |  | 2 |
| `createSelectionSetFromSelection` | 25395 | function |  | 3 |
| `selectionSetById` | 25406 | function |  | 5 |
| `selectionSetCanEditFromSelection` | 25410 | function |  | 7 |
| `editSelectionSetFromSelection` | 25419 | function |  | 5 |
| `deleteSelectionSet` | 25439 | function |  | 2 |
| `selectSelectionSet` | 25448 | function |  | 2 |
| `deleteSelectedStrands` | 25458 | function |  | 4 |
| `deleteGuide` | 25466 | function |  | 3 |
| `deleteSelectedGuide` | 25489 | function |  | 3 |
| `deleteSelectedReferenceImage` | 25493 | function |  | 4 |
| `hasDeletableSelection` | 25506 | function |  | 2 |
| `deleteCurrentSelection` | 25514 | function |  | 3 |
| `hideOutlinerContextMenu` | 25522 | function |  | 17 |
| `outlinerLockTargets` | 25527 | function |  | 3 |
| `showOutlinerContextMenu` | 25554 | function |  | 9 |
| `hideStrandRadialMenu` | 25634 | function |  | 4 |
| `ensureRadialButtonCapacity` | 25645 | function |  | 3 |
| `radialButtonDimensions` | 25658 | function |  | 4 |
| `radialMenuDimensionsForKind` | 25667 | function |  | 3 |
| `applyRadialMenuDimensions` | 25684 | function |  | 3 |
| `strandRadialSubmenuEntryDistance` | 25690 | function |  | 2 |
| `configureRadialSubmenuIndicator` | 25703 | function |  | 3 |
| `selectionSetMembershipRadialOptions` | 25724 | function |  | 2 |
| `selectionSetRadialMenuOption` | 25741 | function |  | 4 |
| `selectedMirrorRadialOptions` | 25750 | function |  | 3 |
| `strandVisibilityRadialOptions` | 25772 | function |  | 5 |
| `clumpMirrorRadialOptions` | 25790 | function |  | 2 |
| `contextualRadialOptions` | 25797 | function |  | 3 |
| `sharedRadialFrameDimensions` | 25926 | function |  | 3 |
| `layoutContextualRadialOptions` | 25930 | function |  | 4 |
| `renderRadialActionList` | 25954 | function |  | 3 |
| `radialListOptionAtPointer` | 25972 | function |  | 3 |
| `syncRadialListHighlight` | 25994 | function |  | 3 |
| `configureContextualRadialMenu` | 26000 | function |  | 3 |
| `beginStrandRadialGesture` | 26060 | function |  | 2 |
| `enterStrandRadialSubmenu` | 26094 | function |  | 2 |
| `updateStrandRadialGesture` | 26140 | function |  | 1 |
| `performStrandRadialAction` | 26179 | function |  | 2 |
| `finishStrandRadialGesture` | 26282 | function |  | 2 |
| `cancelStrandRadialGesture` | 26292 | function |  | 6 |
| `blockPointerDuringStrandRadialGesture` | 26299 | function |  | 1 |
| `setPullMoveEnabled` | 26305 | function |  | 3 |
| `toolRadialOptions` | 26313 | function |  | 2 |
| `hideToolRadialMenu` | 26338 | function |  | 4 |
| `beginToolRadialGesture` | 26351 | function |  | 2 |
| `beginToolShortcutPress` | 26391 | function |  | 2 |
| `finishToolShortcutPress` | 26406 | function |  | 2 |
| `cancelToolShortcutPress` | 26415 | function |  | 5 |
| `setRadialMenusEnabled` | 26423 | function |  | 5 |
| `setProceduralDrawExperimentalEnabled` | 26436 | function |  | 5 |
| `setNavigationTipsEnabled` | 26451 | function |  | 5 |
| `configureNavigationMouseButtons` | 26458 | function |  | 3 |
| `syncNavigationModifierLocks` | 26471 | function |  | 7 |
| `setNavigationStyle` | 26476 | function |  | 5 |
| `applyCameraSmoothingPreference` | 26492 | function |  | 4 |
| `setCameraSmoothingEnabled` | 26507 | function |  | 5 |
| `setCameraSmoothingStrength` | 26513 | function |  | 5 |
| `setScaleSensitivity` | 26521 | function |  | 3 |
| `setToolTipsEnabled` | 26529 | function |  | 5 |
| `setCompactToolButtonsEnabled` | 26536 | function |  | 5 |
| `setViewportStatisticsEnabled` | 26545 | function |  | 5 |
| `setTwistCurveAllStrandsPreviewEnabled` | 26553 | function |  | 5 |
| `setLayerColorShiftsEnabled` | 26568 | function |  | 5 |
| `setOutlinerFolderColorsEnabled` | 26577 | function |  | 5 |
| `sideNamingDisplayId` | 26586 | function |  | 3 |
| `referenceViewDisplayLabel` | 26598 | function |  | 6 |
| `strandRegionDisplayLabel` | 26608 | function |  | 9 |
| `updateSideNamingLabels` | 26626 | function |  | 2 |
| `setSideNamingPerspective` | 26653 | function |  | 5 |
| `setControlPointDisplaySize` | 26662 | function |  | 6 |
| `scaleHexColor` | 26674 | function |  | 3 |
| `setViewportBackgroundColor` | 26679 | function |  | 7 |
| `setDefaultHairShader` | 26701 | function |  | 5 |
| `setPreferenceCategory` | 26707 | function |  | 4 |
| `openPreferencesDialog` | 26734 | function |  | 1 |
| `savePreferencesDialog` | 26762 | function |  | 1 |
| `cancelPreferencesDialog` | 26786 | function |  | 3 |
| `updateToolRadialGesture` | 26815 | function |  | 1 |
| `performToolRadialAction` | 26844 | function |  | 2 |
| `finishToolRadialGesture` | 26854 | function |  | 2 |
| `cancelToolRadialGesture` | 26863 | function |  | 5 |
| `duplicatePlacementTarget` | 26870 | function |  | 2 |
| `proceduralDuplicateSourceSnapshots` | 26897 | function |  | 4 |
| `proceduralDuplicateEligibleLock` | 26901 | function |  | 1 |
| `selectedProceduralDuplicateSources` | 26911 | function |  | 4 |
| `updateProceduralDuplicateSpacingNote` | 26916 | function |  | 3 |
| `clearProceduralDuplicatePreview` | 26928 | function |  | 3 |
| `closeProceduralDuplicateDialog` | 26939 | function |  | 7 |
| `openProceduralDuplicateDialog` | 26947 | function |  | 2 |
| `proceduralDuplicateCopySnapshot` | 26964 | function |  | 2 |
| `proceduralDuplicateHeadCenter` | 26985 | function |  | 4 |
| `hideProceduralDuplicateArcPreview` | 26996 | function |  | 8 |
| `proceduralDuplicateReferencePoints` | 27002 | function |  | 2 |
| `updateProceduralDuplicateArcPreview` | 27008 | function |  | 4 |
| `applyProceduralDuplicateBlend` | 27041 | function |  | 3 |
| `buildEvenlySpacedProceduralDuplicates` | 27196 | function |  | 2 |
| `rebuildProceduralDuplicatePreview` | 27298 | function |  | 5 |
| `confirmProceduralDuplicatePreview` | 27339 | function |  | 2 |
| `updateDuplicatePlacement` | 27366 | function |  | 2 |
| `beginDuplicatePlacement` | 27430 | function |  | 4 |
| `beginProceduralDuplicatePlacement` | 27494 | function |  | 2 |
| `confirmDuplicatePlacement` | 27535 | function |  | 1 |
| `cancelDuplicatePlacement` | 27572 | function |  | 4 |
| `outlinerClumpLocks` | 27598 | function |  | 11 |
| `handleOutlinerClumpDrop` | 27602 | function |  | 3 |
| `createOutlinerStrandButton` | 27625 | function |  | 4 |
| `createOutlinerCurveSurface` | 27711 | function |  | 2 |
| `createOutlinerClump` | 27807 | function |  | 2 |
| `selectionSetMatchesCurrentSelection` | 27889 | function |  | 2 |
| `createSelectionSetsOutlinerFolder` | 27896 | function |  | 2 |
| `renderLockList` | 27975 | function |  | 67 |
| `updateCount` | 28129 | function |  | 33 |
| `captureInputUndo` | 28138 | function |  | 1 |
| `bindUndoCapture` | 28144 | function |  | 37 |
| `bindLockInput` | 28155 | function |  | 2 |
| `applyValue` | 28172 | arrow |  | 2 |
| `applyUniformTransformScale` | 28491 | function |  | 2 |
| `applyReducedTransformScale` | 28508 | function |  | 2 |
| `applyTransformPrecision` | 28547 | function |  | 2 |
| `updateTransformScalePointer` | 28576 | function |  | 1 |
| `releaseTaperCurveEditorFieldFocus` | 28897 | function |  | 3 |
| `finishTaperCurveDrag` | 28961 | function |  | 1 |
| `beginTaperMeshPointDrag` | 29004 | function |  | 1 |
| `updateTaperMeshPointDrag` | 29085 | function |  | 1 |
| `finishTaperMeshPointDrag` | 29140 | function |  | 6 |
| `updateSelectedTaperPoint` | 29164 | function |  | 4 |
| `beginProceduralAccessoryEdit` | 29765 | function |  | 4 |
| `updateSelectedProceduralAccessories` | 29770 | function |  | 4 |
| `syncDrawCurlControls` | 29825 | function |  | 5 |
| `handleLiveSurfaceChange` | 29873 | function |  | 1 |
| `scaleSurfaceLatticeWidth` | 29955 | function |  | 3 |
| `resampleSurfaceLock` | 29970 | function |  | 2 |
| `changePanelSplitCount` | 30083 | function |  | 3 |
| `applyPresetControl` | 30233 | function |  | 2 |
| `applyCreationToolSettings` | 30254 | function |  | 2 |
| `populateCreationPresetSelect` | 30298 | function |  | 5 |
| `populateDrawBrushPresetSelect` | 30322 | function |  | 6 |
| `syncCreationPresetRemoveButtons` | 30355 | function |  | 5 |
| `createCustomCreationPreset` | 30363 | function |  | 3 |
| `createCustomClumpPreset` | 30378 | function |  | 3 |
| `commitCustomCreationPreset` | 30393 | function |  | 2 |
| `openRemoveCreationPreset` | 30454 | function |  | 3 |
| `commitRemoveCreationPreset` | 30467 | function |  | 1 |
| `applyBraidToolPreset` | 30484 | function |  | 2 |
| `selectedBranchChildLock` | 30596 | function |  | 4 |
| `updateBranchBridgeSliderInputs` | 30600 | function |  | 2 |
| `initPanelResizeHandles` | 30706 | function |  | 2 |
| `applyWidth` | 30712 | arrow |  | 2 |
| `restoreWidth` | 30719 | arrow |  | 2 |
| `bindResize` | 30727 | arrow |  | 2 |
| `onMove` | 30736 | arrow |  | 0 |
| `onUp` | 30740 | arrow |  | 0 |
| `updateSnappedFloatingPanels` | 30757 | function |  | 2 |
| `initFloatingPanelControls` | 30766 | function |  | 2 |
| `detach` | 30775 | arrow |  | 38 |
| `endDrag` | 30813 | arrow |  | 0 |
| `endResize` | 30845 | arrow |  | 0 |
| `updateSculptBrushDockCompact` | 30856 | function |  | 3 |
| `selectPatchNotesVersion` | 30990 | function |  | 3 |
| `requestReferenceImage` | 31023 | function |  | 5 |
| `toggleCapsuleGuideTool` | 31227 | function |  | 1 |
| `activateCapsuleGuideDrawTool` | 31233 | function |  | 1 |
| `createCurveLatticeGuideFromUi` | 31240 | function |  | 1 |
| `deleteLocks` | 31807 | function |  | 10 |
| `disposeCurveObjects` | 31885 | function |  | 4 |
| `beginTipSubBoneRotate` | 31971 | function |  | 2 |
| `applyTipSubBoneTransform` | 32001 | function |  | 2 |
| `beginPanelSplitHandleDrag` | 32033 | function |  | 2 |
| `updatePanelSplitHandleDrag` | 32158 | function |  | 1 |
| `endPanelSplitHandleDrag` | 32379 | function |  | 3 |
| `resize` | 32412 | function |  | 3 |
| `handleViewportPointerMove` | 32423 | function |  | 1 |
| `blockProportionalSizingEvent` | 32434 | function |  | 1 |
| `updateLightAngleFromInputs` | 32440 | function |  | 2 |
| `startViewSnap` | 32454 | function |  | 3 |
| `beginViewSnapFromActiveOrbit` | 32484 | function |  | 3 |
| `trackViewportPointerDown` | 32501 | function |  | 1 |
| `trackViewportPointerMove` | 32517 | function |  | 1 |
| `clearViewportPointer` | 32525 | function |  | 1 |
| `updateViewSnap` | 32530 | function |  | 1 |
| `nearestCardinalAxis` | 32566 | function |  | 5 |
| `cardinalAxisKey` | 32580 | function |  | 5 |
| `steppedDragAmount` | 32584 | function |  | 3 |
| `snapCameraToCardinalAxis` | 32590 | function |  | 4 |
| `endViewSnap` | 32606 | function |  | 4 |
| `activateStrandControlPoint` | 32616 | function |  | 4 |
| `refreshStrandControlPointSelection` | 32666 | function |  | 4 |
| `addStrandControlPointSelection` | 32693 | function |  | 3 |
| `removeStrandControlPointSelection` | 32710 | function |  | 3 |
| `sampleStrandPointNormal` | 32724 | function |  | 2 |
| `sampleStrandPointVectors` | 32734 | function |  | 3 |
| `remapStrandPointSelectionAfterRemoval` | 32740 | function |  | 2 |
| `resampleStrandCurveData` | 32751 | function |  | 4 |
| `resampleMatchingVectors` | 32757 | arrow |  | 3 |
| `finishStrandCurveTopologyChange` | 32796 | function |  | 4 |
| `removeStrandCurvePoint` | 32807 | function |  | 2 |
| `closestStrandCurveParameter` | 32820 | function |  | 2 |
| `insertStrandCurvePoint` | 32849 | function |  | 2 |
| `curvePointTopologyCursorAvailable` | 32866 | function |  | 2 |
| `selectionModifierCursorAvailable` | 32876 | function |  | 3 |
| `clearCurvePointTopologyCursor` | 32892 | function |  | 6 |
| `updateCurvePointTopologyCursor` | 32899 | function |  | 4 |
| `prepareCurvePointSelection` | 32921 | function |  | 1 |
| `finishCurvePointInsertion` | 33032 | function |  | 1 |
| `finishPointRemoval` | 33047 | function |  | 1 |
| `editableStrandWidth` | 33065 | function |  | 6 |
| `editableStrandWidthBounds` | 33077 | function |  | 2 |
| `applyEditableStrandWidth` | 33083 | function |  | 3 |
| `viewportPixelPoint` | 33119 | function |  | 5 |
| `syncSculptBrushControls` | 33127 | function |  | 6 |
| `syncSculptBrushStrengthForActiveTool` | 33142 | function |  | 3 |
| `updateActiveSculptBrushStrength` | 33150 | function |  | 1 |
| `updateActiveSculptBrushPreserveTips` | 33158 | function |  | 1 |
| `sculptBrushPlaneOffset` | 33164 | function |  | 5 |
| `setSculptBrushCursorVisible` | 33168 | function |  | 7 |
| `updateSculptBrushCursor` | 33175 | function |  | 4 |
| `sculptBrushMirrorUpdateLock` | 33197 | function |  | 4 |
| `sculptBrushEditableLock` | 33204 | function |  | 6 |
| `sculptBrushWorkingPlaneNormal` | 33214 | function |  | 5 |
| `sculptBrushLockViable` | 33220 | function |  | 5 |
| `sculptBrushUnits` | 33231 | function |  | 2 |
| `updateSculptBrushViabilityPlane` | 33269 | function |  | 4 |
| `sculptBrushPointWeight` | 33319 | function |  | 6 |
| `sculptBrushWorldDelta` | 33329 | function |  | 7 |
| `syncSculptBrushMirrorPoints` | 33338 | function |  | 2 |
| `captureSculptMoveStrokeInfluence` | 33364 | function |  | 2 |
| `beginSculptMoveStroke` | 33422 | function |  | 1 |
| `isHairCreateTool` | 33484 | function |  | 4 |
| `syncStrandHoverOutline` | 33488 | function |  | 1 |
| `pointerOverTaperEditor` | 33501 | function |  | 3 |
| `updateStrandBrushHover` | 33508 | function |  | 1 |
| `updatePanelTipHover` | 33529 | function |  | 1 |
| `applySubBoneBrushSample` | 33559 | function |  | 2 |
| `applySculptMoveStrokeSample` | 33704 | function |  | 2 |
| `flushSculptMoveStrokeSample` | 33942 | function |  | 3 |
| `updateSculptMoveStroke` | 33951 | function |  | 1 |
| `finishSculptMoveStroke` | 33967 | function |  | 3 |
| `strandControlPointHit` | 34015 | function |  | 3 |
| `beginStrandWidthEdgeDrag` | 34019 | function |  | 1 |
| `updateStrandWidthEdgeDrag` | 34097 | function |  | 1 |
| `finishStrandWidthEdgeDrag` | 34131 | function |  | 2 |
| `setHoveredStrandWidthEdge` | 34171 | function |  | 9 |
| `updateStrandWidthEdgeHover` | 34184 | function |  | 1 |
| `setHoveredControlPoint` | 34223 | function |  | 7 |
| `visibleControlPointHoverTargets` | 34236 | function |  | 2 |
| `updateControlPointHover` | 34272 | function |  | 1 |
| `animate` | 34887 | function |  | 2 |
| `syncCompactSidebarLayout` | 34918 | function |  | 4 |
| `setOutlinerPanelCollapsed` | 34937 | function |  | 5 |
| `setAttributeEditorPanelCollapsed` | 34943 | function |  | 3 |
| `setAttributeEditorTab` | 34949 | function |  | 6 |

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
