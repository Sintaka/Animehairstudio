# reference + head/body 迁出 — 函数引用图（批次 A4）

> 目标：把 app.js 中「参考图（导入/放置/裁剪/变换/可见性/UI）」+「头部/身体网格（导入/变换/材质/可见性）」业务层迁到 `modules/scene/reference-head.js`（`createReferenceHeadApi(deps)` 依赖注入），app.js 只保留初始化 + store 装配 + 事件绑定 + 脊柱接线。
> 只读盘点：2026-08-12 · 分支 `0.2.59-refactor` · **app.js 快照 24,308 行**（ReadAllLines 口径；FUNCTION_INDEX.json 生成于 10:05、app.js lineCount=24,309）。本次按函数名逐一 grep 重新锚定，行号与 FUNCTION_INDEX 一致。
> 范围对照：appjs-slim-remaining-plan.md A4 行（Godel 旧区间 L2773-3333 / L3769-5130 / L13043-13091，32,530 行口径）→ 当前：**L2942-3305**（head 簇）+ **L3717-5095**（reference 主簇）+ 散点 L10296-10341 / L14170 / L16844 / L17949 / L21750。
> 口径说明：Godel「74 函数 / ~1,720 毛行」含相邻函数行距的夹层注释/空行；本次按**函数体大括号精确匹配**重新计数 = **70 函数 / 1,381 净体行**（毛行口径 ~1,450-1,500；reference 56 / head 14），与计划 ~74 的差 = 夹层 selection/outliner 脊柱 14 个（§0-4）未计入本批。

## 0. 边界判定（关键）

- **迁出 70 个顶层函数（1,381 净体行）**，按物理位置 8 簇：
  - 簇 H1 guideModel/headTransform：L2942-3122（7 个：disposeGuideModel/syncHeadTransformInputs/applyHeadTransform/resetHeadTransform/installGuideModel/loadDefaultGuideModel/frameGuideModel）
  - 簇 H2 头部可见性与截面：L3248-3305（3 个：setHeadReferenceTransparency/trianglePlaneIntersections/headPlaneIntersectionSegments）
  - 簇 H3 head-setup 模式：L5079-5093（1 个：setHeadSetupEditing）
  - 簇 H4 头部/身体网格导入：L10296-10341（2 个：importHeadMeshFile/importFullBodyMeshFile）
  - 簇 H5 headMeshes：L14170-14176（1 个）
  - 簇 R1 参考图核心：L3717-4246（26 个：selectedReferenceImage → renderReferenceImagePanel）
  - 簇 R2 参考图 UI/拖放/裁剪：L4473-5095（27 个：referenceOutlinerGroup → finishReferenceCrop）
  - 簇 R3 散点：L16844 deleteSelectedReferenceImage / L17949 referenceViewDisplayLabel / L21750 requestReferenceImage（3 个）
- **不迁移（留在 app.js）**：
  1. **undo/restore/快照**：pushUndoState/snapshotState/restoreLock 系数据管线。本批仅经 deps 调用（updateReferenceOverlayDrag/updateReferenceCrop/deleteSelectedReferenceImage/addReferenceImagesFromFiles 等 5 处调 pushUndoState）；快照 L9975 serializeReferenceImage、恢复 L10827 addReferenceImage、清理 L10935 clearReferenceImages 是保留调用点，改 api.X。
  2. **curve-objects-core**：createCurveObjects/updateCurveObjects（selectReferenceImage 调 updateCurveObjects，deps 注入）。
  3. **selection-edit**：selectLock/getSelectedLock/clearStrandSelectionState/setStrandSelectionVisual/updateAttributeEditorMode/renderLockList/refreshRebuildCurveDialog。
  4. **夹层 selection/outliner 脊柱（L4256-4472，14 个）**：setOutlinerTab/effectiveViewportSelectionMode/componentEditModeActive/selectionToolSupportsPicking/syncViewportSelectionModeControl/refreshSelectionModeVisuals/setViewportSelectionMode/setViewportEditMode/createOutlinerVisibilityToggle/setLocksOutlinerVisibility/normalizeOutlinerName/beginOutlinerRename/finish(内联 arrow)/handleOutlinerRenameClick —— 被 strand/guide/outliner 侧大量使用（setOutlinerTab 8 外点、createOutlinerVisibilityToggle 6 外点、setViewportEditMode 13 外点、componentEditModeActive 29 点）。反向边 setOutlinerTab→renderReferenceOutliner、setViewportEditMode→renderReferenceImagePanel/updateReferenceSelectionVisuals/finishReferenceCrop/finishReferenceOverlayDrag 等改 api.X。
  5. **layer-hair**（normalizeHairLayer L3123-3209 / layerOffsetForLock 等 12 个）：位于旧区间 L2773-3333 内但不属 head/body（计划「不值得拆」条目）。
  6. **templatePlaneIntersectionSegments（L3490）**：scalp 模板截面，scalp-builder deps 在用，留 app.js；内部调用 trianglePlaneIntersections 改 api.trianglePlaneIntersections。
  7. **UI 事件绑定/初始化 + render loop**：reference 面板/拖放/指针/裁剪事件区 L21750-21901、指针/裁剪全局监听 L23575-23768、animate L24159-24160 —— 保留，内部调用改 api.X（约 97+30 处，见 §3.1）。
- **已迁走核实**：scalp-builder.js 已有 `scalpBuilderHeadMeshes`/`fullBodyScalpFocusBounds`/`realignFullBodyGuideToScalpTop`（head 相关 3 个，不重迁）；guide-system.js 无本批函数副本；head-store.js/reference-store.js 仅状态 store（已迁）；`guideApi.guideHeadBounds` 来自 guide-system.js（本批 installGuideModel/frameGuideModel 经 deps 使用）；`sel.state.selectedReferenceImageId` 在 selection-store.js 已序列化。
- **死函数核实**：70 个候选全部有外部调用点，无死函数（`syncNumberFromRange` 等 7 个死函数属 B3 preset-library，与本批无关）。

## 1. 迁出函数清单（70，按当前行号）

> 列：行号 / 净体行（def..end 含定义行）/ 批内互调（只列本批 70 个候选内的调用）/ **app外**（函数名级出现数，剔除本批候选函数体内出现，含事件绑定与 deps 注入行）。

### 簇 H1 — guideModel / headTransform（L2942-3122，7 函数 168 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 1 | disposeGuideModel | 2942 | 10 | — | 1 |
| 2 | syncHeadTransformInputs | 2953 | 6 | — | 2 |
| 3 | applyHeadTransform | 2960 | 17 | — | 3 |
| 4 | resetHeadTransform | 2980 | 13 | syncHeadTransformInputs, applyHeadTransform | 1 |
| 5 | installGuideModel | 2995 | 75 | disposeGuideModel, resetHeadTransform, frameGuideModel, setHeadReferenceTransparency | 1 |
| 6 | loadDefaultGuideModel | 3071 | 18 | installGuideModel | 2（含 boot L3090） |
| 7 | frameGuideModel | 3094 | 29 | — | 0（仅 installGuideModel 调用） |

### 簇 H2 — 头部可见性与截面（L3248-3305，3 函数 54 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 8 | setHeadReferenceTransparency | 3248 | 9 | — | 2 |
| 9 | trianglePlaneIntersections | 3260 | 20 | — | 2 |
| 10 | headPlaneIntersectionSegments | 3281 | 25 | trianglePlaneIntersections | 1 |

### 簇 H3 — head-setup 模式（L5079-5093，1 函数 15 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 11 | setHeadSetupEditing | 5079 | 15 | setHeadReferenceTransparency | 5 |

### 簇 H4 — 头部/身体网格导入（L10296-10341，2 函数 45 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 12 | importHeadMeshFile | 10296 | 22 | installGuideModel | 2 |
| 13 | importFullBodyMeshFile | 10319 | 23 | installGuideModel | 2 |

### 簇 H5 — headMeshes（L14170-14176，1 函数 7 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 14 | headMeshes | 14170 | 7 | — | 6 |

### 簇 R1 — 参考图核心（L3717-4246，26 函数 496 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 15 | selectedReferenceImage | 3717 | 3 | — | 12 |
| 16 | normalizeReferenceCrop | 3723 | 7 | — | 0 |
| 17 | referenceCropIsFull | 3731 | 4 | normalizeReferenceCrop | 1 |
| 18 | referencePlaneFrontAxis | 3736 | 8 | — | 0 |
| 19 | referencePlanePlacement | 3745 | 14 | referencePlaneFrontAxis | 0 |
| 20 | migratedReferencePlanePosition | 3760 | 19 | isUntouchedLegacySideReferencePlacement | 0 |
| 21 | isUntouchedLegacySideReferencePlacement | 3780 | 16 | — | 0 |
| 22 | migratedReferencePlaneRotation | 3797 | 15 | isUntouchedLegacySideReferencePlacement, isInwardFacingSideReferencePlacement | 0 |
| 23 | isInwardFacingSideReferencePlacement | 3813 | 15 | — | 0 |
| 24 | snappedReferenceImageView | 3836 | 5 | — | 0 |
| 25 | updateReferencePlaneVisibility | 3842 | 15 | snappedReferenceImageView, attachReferenceImageTransform | 3 |
| 26 | applyReferenceImageRuntime | 3858 | 42 | normalizeReferenceCrop, updateReferencePlaneVisibility | 5 |
| 27 | updateReferenceSelectionVisuals | 3901 | 7 | — | 2 |
| 28 | createReferenceImageRuntime | 3909 | 68 | applyReferenceImageRuntime, updateReferenceSelectionVisuals | 0 |
| 29 | addReferenceImage | 3978 | 51 | normalizeReferenceCrop, referencePlanePlacement, migratedReferencePlanePosition, migratedReferencePlaneRotation, createReferenceImageRuntime, selectReferenceImage, renderReferenceImagePanel | 1 |
| 30 | disposeReferenceImageRuntime | 4030 | 18 | — | 0 |
| 31 | disposeReferenceImage | 4049 | 3 | disposeReferenceImageRuntime | 0 |
| 32 | clearReferenceImages | 4053 | 6 | disposeReferenceImage, renderReferenceImagePanel | 1 |
| 33 | serializeReferenceImage | 4060 | 27 | normalizeReferenceCrop | 1 |
| 34 | setReferenceImageType | 4088 | 43 | referencePlanePlacement, createReferenceImageRuntime, disposeReferenceImageRuntime, selectReferenceImage, syncReferenceImageFromMesh | 1 |
| 35 | attachReferenceImageTransform | 4132 | 13 | selectedReferenceImage | 1 |
| 36 | selectReferenceImage | 4146 | 22 | updateReferenceSelectionVisuals, attachReferenceImageTransform, renderReferenceImagePanel | 5 |
| 37 | placeReferencePlane | 4169 | 10 | referencePlanePlacement, applyReferenceImageRuntime, attachReferenceImageTransform | 1 |
| 38 | setReferencePlaneInFront | 4180 | 9 | referencePlaneFrontAxis, applyReferenceImageRuntime, attachReferenceImageTransform | 1 |
| 39 | syncReferenceImageFromMesh | 4190 | 18 | referencePlaneFrontAxis | 2 |
| 40 | renderReferenceImagePanel | 4209 | 38 | selectedReferenceImage, referenceCropIsFull, selectReferenceImage, renderReferenceOutliner, referenceViewDisplayLabel | 10 |

### 簇 R2 — 参考图 UI / 拖放 / 裁剪（L4473-5095，27 函数 569 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 41 | referenceOutlinerGroup | 4473 | 3 | — | 0 |
| 42 | renderReferenceOutliner | 4477 | 116 | applyReferenceImageRuntime, selectReferenceImage, renderReferenceImagePanel, referenceOutlinerGroup, setReferenceImagePanelOpen, referenceViewDisplayLabel | 1 |
| 43 | setReferenceImagePanelOpen | 4594 | 4 | renderReferenceImagePanel | 2 |
| 44 | readReferenceImageFile | 4599 | 16 | — | 0 |
| 45 | isSupportedReferenceImageFile | 4623 | 6 | — | 1 |
| 46 | addReferenceImagesFromFiles | 4630 | 45 | — | 2 |
| 47 | dragContainsReferenceImage | 4675 | 10 | isSupportedReferenceImageFile | 2 |
| 48 | setReferenceImageDragActive | 4686 | 7 | setReferenceDropHover | 8 |
| 49 | referenceDropDestination | 4694 | 5 | — | 1 |
| 50 | viewportOverlayDropPosition | 4700 | 8 | — | 1 |
| 51 | setReferenceDropHover | 4709 | 17 | — | 2 |
| 52 | referencePlaneHitFromPointer | 4727 | 17 | headMeshes（H5） | 1 |
| 53 | referenceOverlayAtPointer | 4747 | 17 | selectedReferenceImage, referenceOverlayCornerAtPointer | 1 |
| 54 | referenceOverlayCornerAtPointer | 4765 | 12 | — | 0 |
| 55 | beginReferenceOverlayDrag | 4778 | 45 | referenceOverlayCornerAtPointer | 1 |
| 56 | updateReferenceOverlayDrag | 4824 | 49 | applyReferenceImageRuntime | 1 |
| 57 | finishReferenceOverlayDrag | 4874 | 21 | applyReferenceImageRuntime, renderReferenceImagePanel, setReferenceOverlayScaleHandleHover | 5 |
| 58 | setReferenceOverlayScaleHandleHover | 4896 | 10 | — | 2 |
| 59 | updateReferenceOverlayCursor | 4907 | 23 | selectedReferenceImage, referenceOverlayCornerAtPointer, setReferenceOverlayScaleHandleHover | 1 |
| 60 | referenceCropAnchorCoordinates | 4933 | 8 | — | 0 |
| 61 | referenceCropAnchorScreenPositions | 4942 | 14 | normalizeReferenceCrop, referenceCropAnchorCoordinates | 0 |
| 62 | referenceCropCursor | 4957 | 5 | — | 0 |
| 63 | updateReferenceCropHandles | 4963 | 20 | selectedReferenceImage, referenceCropAnchorScreenPositions, referenceCropCursor | 2 |
| 64 | referenceCropSourcePoint | 4984 | 6 | — | 0 |
| 65 | beginReferenceCrop | 4991 | 37 | selectedReferenceImage, normalizeReferenceCrop, referenceCropCursor | 2 |
| 66 | updateReferenceCrop | 5029 | 31 | normalizeReferenceCrop, applyReferenceImageRuntime, updateReferenceCropHandles, referenceCropSourcePoint | 1 |
| 67 | finishReferenceCrop | 5061 | 17 | applyReferenceImageRuntime, renderReferenceImagePanel, updateReferenceCropHandles | 4 |

### 簇 R3 — 散点（3 函数 27 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 |
|---|---|---|---|---|---|
| 68 | deleteSelectedReferenceImage | 16844 | 12 | selectedReferenceImage, disposeReferenceImage, selectReferenceImage, renderReferenceImagePanel | 3 |
| 69 | referenceViewDisplayLabel | 17949 | 9 | — | 2 |
| 70 | requestReferenceImage | 21750 | 6 | — | 4 |

> 随迁常量（位于簇内，仅本批函数使用）：`MIN_REFERENCE_CROP_SPAN`(L3721)、`REFERENCE_VIEW_BY_CAMERA_AXIS`(L3829)、`REFERENCE_OUTLINER_GROUPS`(L4248)、`SUPPORTED_REFERENCE_IMAGE_TYPES`(L4616)、`REFERENCE_OVERLAY_HANDLE_HIT_RADIUS`(L4745)、`REFERENCE_CROP_ANCHORS`(L4931)。注意 `SUPPORTED_REFERENCE_IMAGE_TYPES` 另被 app.js `dragContainsApplicationFile`(L10602) 使用（§4.4）。

## 2. deps 清单（70 函数并集）

### 2.1 store 代理（经 deps 注入 .state，模块内一律 deps.X.y，禁双重 .state）
- `sel.state`（selectedReferenceImage/updateReferencePlaneVisibility/updateReferenceSelectionVisuals/selectReferenceImage/attachReferenceImageTransform/renderReferenceImagePanel/renderReferenceOutliner/updateReferenceOverlayCursor/beginReferenceOverlayDrag/deleteSelectedReferenceImage）
- `sculptState.state`（updateReferenceOverlayCursor/beginReferenceOverlayDrag/updateReferenceOverlayDrag/finishReferenceOverlayDrag/updateReferenceCropHandles/beginReferenceCrop/updateReferenceCrop/finishReferenceCrop/setHeadSetupEditing）
- `guideState.state`（disposeGuideModel/applyHeadTransform/installGuideModel/frameGuideModel/headMeshes/setHeadReferenceTransparency）
- `head.state`（loadDefaultGuideModel/importHeadMeshFile/importFullBodyMeshFile/renderReferenceOutliner）
- `scalpState.state`（loadDefaultGuideModel/setHeadSetupEditing）
- `ref.state`（addReferenceImage/requestReferenceImage）
- `transform.state`（applyReferenceImageRuntime/renderReferenceOutliner）
- 只读：`viewportState.state`（snappedReferenceImageView/frameGuideModel）、`miscState`/`hairState` 不涉及。

### 2.2 顶层函数 deps（app.js 残留，经 deps 注入）
- 脊柱/编辑：pushUndoState、updateCurveObjects、updateInteractionLocks、updateAttributeEditorMode、renderLockList、refreshRebuildCurveDialog、clearStrandSelectionState、setStrandSelectionVisual、deselectStrandsForGuideEditor、updatePlacementStatus。
- 视图/相机：setOrthographicView、viewPlaneNormal、isCameraInSnappedView、cardinalAxisKey、resize、frameViewportBounds、updateCameraProjectionForViewport、syncOrthographicFramingFromDistance、configureTransformControls。
- 模式/outliner：setViewportEditMode、setOutlinerTab、createOutlinerVisibilityToggle、handleOutlinerRenameClick、showOutlinerContextMenu、sideNamingDisplayId。
- 显示可见性（L5184/L5213，函数声明可提升）：syncDisplayVisibilityInputs、applyCharacterMeshDisplayVisibility。
- 模块 api：scalpBuilder（createScalpBuilderApi）、guideApi（createGuideSystemApi）。
- 伪阳性剔除：`project`（Vector3.project 方法）、`start`（局部变量）、`controls`（OrbitControls 实例经 deps，非函数）。

### 2.3 顶层常量/DOM deps（经 deps 注入）
- 常量：MIN_REFERENCE_CROP_SPAN、REFERENCE_VIEW_BY_CAMERA_AXIS、REFERENCE_OUTLINER_GROUPS、SUPPORTED_REFERENCE_IMAGE_TYPES、REFERENCE_OVERLAY_HANDLE_HIT_RADIUS、REFERENCE_CROP_ANCHORS、GUIDE_HEAD_REFERENCE_SIZE、GUIDE_HEAD_TARGET_HEIGHT、FULL_BODY_TARGET_HEIGHT、FULL_BODY_FRAME_BOTTOM_MARGIN、FULL_BODY_HEAD_COUNT。
- DOM：referenceImageList/referenceImageEmpty/referenceImageControls/referenceImageType/referenceImageVisible/referenceImageOpacity/referenceImageOpacityValue/referenceImageFlipX/resetReferenceImageCrop/referenceImageViewRow/referenceImageView/referencePlaneInFrontRow/referencePlaneInFront/referenceImageSnappedViewOnlyRow/referenceImageSnappedViewOnlyLabel/referenceImageSnappedViewOnly/referencePlaneHint/referenceImagePanel/referenceOutliner/referenceImageDropTarget/referenceOverlayDropMarker/referenceCropHandles/referenceCropHandleElements/viewportReferenceImages/referenceImageFile/headMeshFileInput/fullBodyMeshFileInput/headTransform/headTransformInputs/headTransformValues/scalpBuilderTransparentHeadInput（head 相关）。
- 场景/全局：scene、viewport、viewportPanel、renderer、raycaster、locks、guides、referenceImages、referenceImageGroup、scalpSurfaceGroup、camera、controls、transformControls、ui。

### 2.4 模块级可 import（新模块直接 import，不走 deps）
- `THREE`（`import * as THREE from "three"`，全部函数）。
- `OBJLoader`（three/addons/loaders/OBJLoader.js，installGuideModel/loadDefaultGuideModel/importHeadMeshFile/importFullBodyMeshFile）。
- `mergeVertices`（three/addons/utils/BufferGeometryUtils.js，installGuideModel）。
- `createHeadStore`/`createReferenceStore` 不 import（状态已在 app.js 装配，经 deps 注入）。

## 3. 外部调用点

### 3.1 app.js 残留调用点（改 api.X；函数名级：reference 97 处 / head 30 处，共 127 处，去重行 126）
- **head（30）**：boot L3090 loadDefaultGuideModel；openHairProjectFile L10544/10552/10561；dropImport L10688-10689；import 事件 L20518/20534/20519/20535；headSetupMode 事件 L21951/21982；透明度事件 L21991；headTransform 事件 L22118/22125/22130/22131；scalpBuilderDeps 注入行 L3339/3362/3364/3438/3446/3451；polyDeps 注入行 L5425；fullSceneFocusBounds L5653；raycaster 命中 L11503/11507/11515；exitSetupEditors L3677。
- **reference（97）**：transformControls dragging/objectChange L566/766/768/884/885；setActiveTool L5753/5810/5811/5842/5843；setViewportEditMode L4356/4357/4370/4371/4376；setOutlinerTab L4271；updateSideNamingLabels L17981/17985/17995；snapshot L9975、restore L10827/10866、disposeAllEditableObjects L10935；hasOtherSelection L17414；deleteSelectionAction L16859/16866、keydown L19804/22207、blur L22514；reference 面板/拖放事件区 L21750-21901（约 46 处：requestReferenceImage 4、setReferenceImagePanelOpen 1、addReferenceImagesFromFiles 2、drag/setActive/drop 约 13、面板控件 约 18、delete 1、selectedReferenceImage 8）；指针/裁剪全局监听 L23575-23768（约 20 处：beginReferenceCrop 2、updateReferenceCrop 1、finishReferenceCrop 2、updateReferenceOverlayDrag 1、finishReferenceOverlayDrag 2、updateReferenceOverlayCursor 1、setReferenceOverlayScaleHandleHover 2、referenceOverlayAtPointer 1、beginReferenceOverlayDrag 1、referencePlaneHitFromPointer 1、selectReferenceImage 3）；resize L22681；animate L24159/24160。

### 3.2 跨模块重接（已迁模块 deps 引用本批函数名 → 改 api.X）
- **scalp-builder.js（6 个名字 / 17 处）**：`deps.applyHeadTransform`(L439,3021)、`deps.syncHeadTransformInputs`(L3020)、`deps.headPlaneIntersectionSegments`(L879,1364,1799,1910,2321,2324,2326,2454)、`deps.setHeadReferenceTransparency`(L2494,2698,2722)、`deps.headMeshes`(L867,2132)、`deps.trianglePlaneIntersections`(L1336)。`deps.templatePlaneIntersectionSegments`(L2341) 指向 app.js 保留函数，不动。
- **poly-tools.js（1 处）**：`deps.headMeshes`(L246)。
- 重接方式：app.js 内 scalpBuilderDeps/polyDeps 的 Object.assign（L3330-3455 / L5425）把裸函数名换成 `referenceHeadApi.X`（对 scalp-builder 传模块引用，或对 scalpBuilderApi 的 deps 直接注入 `referenceHeadApi` 整体）。
- **app.js 内 deps 注入行**：L3339/3362/3364/3438/3446/3451（scalpBuilderDeps）+ L5425（polyDeps）共 7 行。

### 3.3 跨批次边界
- 与 **B2 draw/creation**（在迁）：drawSurfaceHitFromEvent 等已按 draw-flow 处理；本批不触碰。`updatePlacementStatus`（B2 簇 E 候选）被 setHeadSetupEditing 调用 —— 若 B2-2 先迁，setHeadSetupEditing 的 deps 改为 drawFlowApi.updatePlacementStatus；本批先迁则反之（deps 注入 app.js 本体）。**两批互不阻塞**。
- 与 **B3 preset-library**（已迁）：无交集（preset-library.js L396 把 referenceImages 置空只是保存状态裁剪）。
- 与 **scalp（已迁）**：head 簇是 scalp-builder 的最大 deps 提供方（17 处），重接是本批主要工作量之一。
- 与 **B6 clump/procedural**：无交叉边。

## 4. 硬障碍

1. **boot 顶层调用（关键）**：`loadDefaultGuideModel().catch(...)` 在 **L3090 顶层执行**（异步加载 ./assets/headplusfeatures.obj）。模块 api 须在 L3090 前存在：建议在 head store（L2931）之后、L3090 之前 `const referenceHeadDeps = {}; const referenceHeadApi = createReferenceHeadApi(referenceHeadDeps);`。deps 触达时点为 OBJLoader 回调（installGuideModel 内 deps.applyCharacterMeshDisplayVisibility/syncDisplayVisibilityInputs 等），回调必然晚于整份脚本同步求值完成，故**批填 Object.assign 放 L3455（scalpBuilderDeps 之后）即安全**；稳妥起见也可把 boot 行移到批填之后（异步调用，行为不变）。其它候选函数均无 boot 调用。
2. **__AHS_TEST_SEAM（L24252-24307）**：逐行核对，仅暴露 sculptState/THREE/locks/scene/camera/renderer/raycaster/getSelectedLock/selectLock/sel/hairState/undoHistory/updateCurveObjects/transformControls 及 bones/panelTip/taper/segment 模块函数，**无本批函数引用**，无需改。
3. **脊柱边界**：本批无脊柱候选；依赖侧全部在 app.js 保留（pushUndoState/updateCurveObjects/selection/outliner/transform gizmo），经 deps 注入即可。
4. **SUPPORTED_REFERENCE_IMAGE_TYPES 共享**：被 app.js `dragContainsApplicationFile`(L10602) 使用。方案 A（推荐）：常量留 app.js，随 deps 注入模块；方案 B：常量随模块迁，app.js `import { SUPPORTED_REFERENCE_IMAGE_TYPES } from ...`。
5. **GUIDE_HEAD_* / FULL_BODY_* 常量（L2933-2937）**：仅 head 簇 + scalpBuilderDeps(L3331 FULL_BODY_FRAME_BOTTOM_MARGIN) 使用。推荐留 app.js 经 deps 注入（避免 import 链）；或随模块迁、app.js 仅 import FULL_BODY_FRAME_BOTTOM_MARGIN 供 scalpBuilderDeps。
6. **与 scalp-builder 的 head/scalp 耦合**：headPlaneIntersectionSegments 经 `scalpBuilder.scalpBuilderHeadMeshes()` 取头部网格（模块 api 可 deps 注入）；installGuideModel 写 scalpSurfaceGroup/guideState.guideModel 供 scalp-builder 读 —— 双写同一 guideState，边界为「head 簇写 guideModel、scalp-builder 只读」。迁移后保持经 deps 的单向依赖即可。
7. **renderReferenceOutliner 与 outliner 脊柱互调**：renderReferenceOutliner 依赖 createOutlinerVisibilityToggle/handleOutlinerRenameClick/showOutlinerContextMenu（app.js 保留，deps 注入）；setOutlinerTab（保留）调用 api.renderReferenceOutliner —— 一条跨边界反向边，已计入 §3.1。

## 5. 装配点与批次划分

- **模块文件（推荐合成）**：`modules/scene/reference-head.js`（新增 scene 目录），导出 `createReferenceHeadApi(deps)`。理由：referencePlaneHitFromPointer(R2)→headMeshes(H5) 与 setHeadReferenceTransparency（H2，被 scalp-builder/setHeadSetupEditing/installGuideModel 三方用）横跨两组；两组共享同一批填时序与 boot 约束（L3090），单文件一次装配、一次 verify-smoke。体量 70 函数 / ~1,450 毛行，与 guide-system.js(129 函数) 同级可管理。
- **api 创建装配点**：紧跟 `head = createHeadStore()`（L2931）之后（约 L2939）创建 `const referenceHeadDeps = {}; const referenceHeadApi = createReferenceHeadApi(referenceHeadDeps);`（先空对象）。
- **Object.assign(referenceHeadDeps, {...}) 批填点**：紧跟 scalpBuilderDeps 批填（L3330-3455）之后（约 L3457），须在 boot L3090 回调触达前生效（异步回调晚于脚本求值完成，安全；若求稳可把 L3090 boot 行移到 L3457 后）。
- **boot 行改写**：L3090 `loadDefaultGuideModel()` → `referenceHeadApi.loadDefaultGuideModel()`。
- **跨模块重接**：scalpBuilderDeps L3339/3362/3364/3438/3446/3451、polyDeps L5425 改 `referenceHeadApi.X`；scalp-builder.js/poly-tools.js 本体不改（仍走 deps）。
- **UI/事件装配**：提供薄壳即可（api 已含全部函数名）；app.js 保留 L21750-21901 / L23575-23768 事件绑定，内部调用改 `referenceHeadApi.X`；transformControls dragging/objectChange、setActiveTool、setViewportEditMode、setOutlinerTab、openHairProjectFile、snapshot/restore、resize、animate 内调用同样改 api.X（127 处）。
- **批次划分（推荐 1 批；若需 2 子批）**：
  - **单批（推荐）**：70 函数 / 1,381 净体行 / app 外 127 处 / 模块 18 处，一次 commit + verify-smoke。
  - **子批 A4-1 head（14 函数 / 289 行）**：先迁（含 boot 改写 + scalpBuilder/poly 重接，块小但时序敏感）。
  - **子批 A4-2 reference（56 函数 / 1,092 行）**：后迁（自洽、无模块依赖，最大块是事件绑定改 api.X）。
  - 两子批各自独立可提交；交叉依赖仅 referencePlaneHitFromPointer→headMeshes（子批 1 先迁则 api.headMeshes 已就位）。

## 6. 估算与难度

- **净减**：70 函数 / 1,381 净体行（毛行 ~1,450-1,500），加模块 wrapper/import ~60-90 行 → **净减 ~1,350-1,450 行**（与计划 ~1,400 一致）。
- **难度**：低中（与计划一致）。app.js 外部 127 处（其中 7 处 deps 注入行 + ~90 处事件/胶水/保留函数 + ~30 处脊柱调用）、模块 18 处（scalp-builder 17 + poly-tools 1）；deps：6 store 代理 + ~28 顶层函数 + ~34 常量/DOM + 5 head 常量；大函数 renderReferenceOutliner(116)/installGuideModel(75)/createReferenceImageRuntime(68)/addReferenceImage(51)/updateReferenceOverlayDrag(49)。
- **外部调用点数（报告口径）**：函数名级 127（app.js 97 ref + 30 head）；去重后独立调用行 126；真正跨模块 = 18 处（scalp-builder/poly-tools）+ app.js 残留 ~109 处。
- **回归**：node --check 双文件 + verify-smoke（基线 10/11）+ 新增 reference/head 手工回归点（参考图导入/放置/裁剪、拖放入口、head/body OBJ 导入、head transform 面板、boot 默认头）。

## 7. 边界存疑点（执行前确认）

1. **loadDefaultGuideModel boot 行 L3090**：保持原位（靠异步回调晚于批填保证安全）vs 移到批填后（L3457+）——建议保持原位并加注释，二次核对 OBJLoader 回调时序。
2. **SUPPORTED_REFERENCE_IMAGE_TYPES 归属**：留 app.js 经 deps 注入（推荐，dragContainsApplicationFile L10602 共用）vs 迁模块再 import。
3. **GUIDE_HEAD_* / FULL_BODY_* 5 常量**：留 app.js 经 deps 注入（推荐）vs 随模块迁（需 app.js import FULL_BODY_FRAME_BOTTOM_MARGIN 给 scalpBuilderDeps）。
4. **templatePlaneIntersectionSegments（L3490）**：留 app.js（推荐，scalp 模板域，仅 scalp-builder 使用）——确认不随 head 簇误迁；其内部 trianglePlaneIntersections 调用改为 api 引用。
5. **夹层 outliner/selection 脊柱（L4256-4472）**：明确不迁；确认 setOutlinerTab/setViewportEditMode 反向调 api.renderReferenceOutliner/renderReferenceImagePanel/updateReferenceSelectionVisuals/finishReference* 的 9 处改写清单无漏。
6. **setHeadSetupEditing 与 updatePlacementStatus**：updatePlacementStatus 属 B2 簇 E 候选；本批先迁则 deps 注入 app.js 本体，B2-2 迁后再改 drawFlowApi —— 记录顺序依赖，避免双向等待。
7. **referenceViewDisplayLabel 的 sideNamingDisplayId（L17937）**：留在 app.js（preference 域），模块经 deps 注入；确认 updateSideNamingLabels（保留）内部 3 处改 api。
8. **head 簇对 scalpBuilder 的依赖方向**：installGuideModel 写 scalpSurfaceGroup/guideModel、headPlaneIntersectionSegments 读 scalpBuilder.scalpBuilderHeadMeshes() —— 迁移后 head 模块经 deps 持 scalpBuilder 引用，保持单向，勿反向注入。
9. **毛行口径差**：计划 ~74 函数/1,720 毛行 vs 本次 70/1,381 净体行（毛行 ~1,450-1,500）——差为夹层 14 个 outliner/selection 脊柱 + 相邻行距；按本次口径执行，不补迁。
---

## 执行记录（2026-08-12 · 分支 0.2.59-refactor · commit 59bd4c0 之后，未提交）

> 按本图执行批次 A4 单批迁出。**行号基于当前 app.js 22,689 行状态重新锚定**（本图原为 24,308 行快照），
> 实际锚定：H1 L2921-3096 / H2 L3227-3284 / H3 L5058-5072 / H4 L10414-10459 / H5 L12551-12557 /
> R1 L3696-4225 / R2 L4452-5056 / R3 L15225-15236 + L16330-16338 + L20131-20136。

### 实际迁出

- **70 函数 / 1,375 净体行**（本次重锚定按函数体大括号精确计数；与本图 1,381 之差 = 快照差异：
  frameGuideModel 24 vs 29、addReferenceImagesFromFiles 44 vs 45，共 6 行）。
- 随迁常量 5 个：MIN_REFERENCE_CROP_SPAN / REFERENCE_VIEW_BY_CAMERA_AXIS / REFERENCE_OUTLINER_GROUPS /
  REFERENCE_OVERLAY_HANDLE_HIT_RADIUS / REFERENCE_CROP_ANCHORS（模块级 const）。
- 留在 app.js 经 deps 注入：SUPPORTED_REFERENCE_IMAGE_TYPES（dragContainsApplicationFile 共用）+
  GUIDE_HEAD_REFERENCE_SIZE / GUIDE_HEAD_TARGET_HEIGHT / FULL_BODY_TARGET_HEIGHT。
- 模块文件：`modules/scene/reference-head.js`（新增 scene 目录；1,568 行，含 header/import/常量/包裹层）。
- app.js：22,689 → 21,401 行（净减 1,288）。

### 外部调用点改写

- app.js 残留调用点：**123 行 / 124 处函数名级引用**改 `referenceHeadApi.X`（去重 123 独立行；
  50 个函数名在 app.js 外部被引用；仅 L20506 `button.dataset.resetHeadTransform` 为属性访问不改写）。
- 其中 deps 注入行 8 处：scalpBuilderDeps 6（applyHeadTransform / headMeshes / headPlaneIntersectionSegments /
  setHeadReferenceTransparency / syncHeadTransformInputs / trianglePlaneIntersections）+
  polyDeps 1（headMeshes）+ **drawFlowDeps 1（headMeshes，L9167 本图 §3.2 未列，扫描发现并补改）**。
- **跨模块重接 18 处**（模块本体不改，仍走 deps.X）：scalp-builder.js 17 处
  （applyHeadTransform 2 / syncHeadTransformInputs 1 / headPlaneIntersectionSegments 8 /
  setHeadReferenceTransparency 3 / headMeshes 2 / trianglePlaneIntersections 1）+ poly-tools.js 1 处
  （headMeshes）。draw-flow.js 另有 deps.headMeshes 3 处经 drawFlowDeps 注入行改接。

### boot 处理（时序审计）

- api 创建：紧跟 `const head = createHeadStore()`（L2911）之后 L2917-2918
  `const referenceHeadDeps = {}; const referenceHeadApi = createReferenceHeadApi(referenceHeadDeps);`，
  先于 boot 调用 L2939（`referenceHeadApi.loadDefaultGuideModel().catch(...)`）。
- deps 批填 `Object.assign(referenceHeadDeps, {...})`（85 项）放置在 **SUPPORTED_REFERENCE_IMAGE_TYPES
  常量之后（当前 L3749）**，不在 scalpBuilderDeps 批填后（旧图 L3457 建议位）：
  **verify-smoke 首次运行捕获 TDZ `Cannot access 'SUPPORTED_REFERENCE_IMAGE_TYPES' before initialization`**
  ——该常量定义（当前 L3740）晚于 scalpBuilderDeps 批填位，批填引用它必 TDZ；移至其定义之后即通过。
- OBJLoader 异步回调晚于整份脚本求值，boot 保持原位安全（与旧图判断一致）。

### deps 清单（85 项）

- store 代理 8：sel / sculptState / guideState / head / scalpState / ref / viewportState / ui（均 `X: X.state`，模块内 deps.X.y）。
- 场景/对象 13：referenceImages / locks / guides / scene / viewport / viewportPanel / renderer / raycaster /
  transformControls / camera / controls / scalpSurfaceGroup / referenceImageGroup。
- 模块 api 3：scalpBuilder / guideApi / placementApi。
- 顶层函数 26：pushUndoState / updateInteractionLocks / setOrthographicView / setViewportEditMode /
  configureTransformControls / syncOrthographicFramingFromDistance / updateCameraProjectionForViewport /
  frameViewportBounds / deselectStrandsForGuideEditor / applyCharacterMeshDisplayVisibility / syncDisplayVisibilityInputs /
  createOutlinerVisibilityToggle / handleOutlinerRenameClick / showOutlinerContextMenu / sideNamingDisplayId /
  isCameraInSnappedView / cardinalAxisKey / viewPlaneNormal / clearStrandSelectionState / setStrandSelectionVisual /
  updateCurveObjects / setOutlinerTab / renderLockList / updateAttributeEditorMode / refreshRebuildCurveDialog /
  strandVisibleForDisplay。
- 常量 4：SUPPORTED_REFERENCE_IMAGE_TYPES / GUIDE_HEAD_REFERENCE_SIZE / GUIDE_HEAD_TARGET_HEIGHT / FULL_BODY_TARGET_HEIGHT。
- DOM 31：headTransform / headTransformInputs / headTransformValues / referenceImage* / referencePlane* / referenceOutliner /
  referenceGroupOpen / referenceImageDropTarget / referenceOverlayDropMarker / referenceCropHandles /
  referenceCropHandleElements / viewportReferenceImages / referenceImageFile / headMeshFileInput / fullBodyMeshFileInput。
- 模块级 import 5：THREE / OBJLoader / mergeVertices / polygonOnlyObjSource（../io/obj-import.js）/
  applicationDropFileKind（../io/file-drop.js）。

### 验证（7 项全部通过）

1. **裸引用静态扫描归零**：模块内 0 处 app.js 顶层名裸引用（含 spread `...name`、属性/键位、字符串/注释/模板剥离）。
   踩坑：首版生成器把 `...locks` / `...guides` / `[...referenceImages]` 误判为属性访问漏改写（spread 前两字符 `..`），
   修正 prev2 判定后复扫归零；referencePlaneHitFromPointer / referenceOverlayAtPointer 4 处 spread 已改 deps。
2. **store 代理双重 .state 检查**：模块内 0 处 `deps.X.state`；app.js 0 处。
3. **引导期 deps 时序审计**：api 早建于 L2918；boot L2939 调用；批填 L3749 在全部 const deps 之后
   （最晚 SUPPORTED_REFERENCE_IMAGE_TYPES L3740）；OBJLoader 回调异步晚于求值。
4. **跨批次重接**：scalpBuilderDeps 6 名 17 处 + polyDeps 1 处 + drawFlowDeps 1 处改 referenceHeadApi.X；
   scalp-builder / poly-tools / draw-flow 本体未改（仍走 deps.X）；scalp-builder 的 templatePlaneIntersectionSegments
   （1 处）仍指向 app.js 保留函数，未动。
5. **编码**：app.js 与 reference-head.js 均 UTF-8 无 BOM、CRLF；app.js 非 ASCII 184→183（-1 = 迁出 `·`），
   模块内 2（header 破折号 + `·`）；70 函数体逐字节比对 0 差异（除 deps.X 改写外）。
6. **语法**：node --check 双文件（.mjs 副本）通过。
7. **回归**：verify-smoke（assets/presets/layered-side-bun.ahs）**10/11 = 基线**（唯一失败 branch-bridge smooth
   为已知基线项）；boot 0 异常，ahs load+rebuild 0 异常。

### 踩坑记录

- **TDZ**：批填引用晚定义常量 SUPPORTED_REFERENCE_IMAGE_TYPES → 批填移至该常量之后（旧图建议位 L3457 在 24,308
  行快照下同样晚于该常量，实际不可用；以当前文件为准）。
- **spread 漏改写**：`...name` 被属性判定吞掉，需 prev2 判定。
- **Object.assign 简写**：deps 批填内 `applyHeadTransform,` 简写改 `applyHeadTransform: referenceHeadApi.applyHeadTransform,`
  （成员表达式不能作简写键）。
- **行尾混用**：模块生成时 header/注释模板串为 LF，函数体为 CRLF → 统一归一 CRLF。
- **drawFlowDeps 也引 headMeshes**（本图 §3.2 未列）→ 补改 L9167（新文件 7956 行附近）。
