# draw/creation 流程迁出 — 函数引用图（批次 B2）

> 目标：把 app.js 中「绘制发丝笔刷流程 + live-surface 交互 + 放置流程 + 创建入口（addLock 前置）」业务层迁到 `modules/geometry/draw-flow.js`（`createDrawFlowApi(deps)` 依赖注入），app.js 只保留初始化 + store 装配 + 事件绑定 + 脊柱接线。
> 只读盘点：2026-08-12 · 分支 `0.2.59-refactor` · **app.js 快照 26,288 行**（FUNCTION_INDEX.json 生成于 08:55、口径 26,289 行；本次已逐函数名 grep 重新锚定，98 个候选函数行号与索引一致、无位移）。
> 范围对照：appjs-slim-remaining-plan.md B2 行（Godel 旧区间 L1116-1148 / L15342-19208，32,530 行口径）→ 当前 = L1125-1157（draw clump 模板 3 个）+ **L12951-15337**（draw/live-surface/放置主簇，其中 poly 工具已随 G7 迁出、curve-surface/surface-lattice 创建已随 G4 迁出）。
> 口径说明：Godel「68 函数 / ~2,040 毛行」含相邻函数行距的夹层注释/空行；本次按**函数体大括号精确匹配**重新计数 = **73 函数 / 1,698 净体行**（毛行口径 1,854）。

## 0. 边界判定（关键）

- **迁出 73 个顶层函数（1,698 净体行 / 1,854 毛行）**，按物理位置 7 簇：
  - 簇 T draw clump 模板：L1125-1157（3 个）
  - 簇 A draw/live-surface 状态与命中：L12958-13164（23 个，含 47 个模块引用，外部调用面最宽）
  - 簇 B 笔刷游标/stroke 处理/draw-clump 映射：L13166-13389（11 个）
  - 簇 C draw 预览（含 updateDrawStrandPreview 220 行）：L14031-14307（6 个）
  - 簇 D draw stroke 流程（begin/update/finishDrawStrandStroke + 创建入口 createDrawn*）：L14309-14898（11 个）
  - 簇 E 放置流程：L14899-15337（18 个，updatePlacementStatus 138 行、外部引用最密）
  - 灰区 G selectedCurveLatticeGuide：L12951（1 个，guide-system 边界，建议随本批迁出）
- **不迁移（留在 app.js）**：
  1. `addLock`（L9534 本体）、`updateLockGeometry`（L16720）、`rebuildCurveObjects`（L11899）、`updateCurveObjects`（L16210）— curve-objects-core 脊柱，本批经 deps 注入（本批 5 个创建入口调用 addLock、7 个调用 updateLockGeometry）。
  2. `pushUndoState`（L11014）/ `snapshotState`（L10127）/ `restoreLock`（L11277）— undo/restore/serialize 数据管线，本批仅 finishPlacementPointer 调用 pushUndoState。
  3. `selectLock`（L17168）/ `getSelectedLock`（L17984）/ selection 系 — selection-edit 粘合层。
  4. `createMirrorPartnerForNewLock`（L9871）/ `mirrorPartnerFor` / `syncMirrorPartnerFromLock` — mirror/serialize 组，本批 4 个创建入口使用。
  5. **B6 clump/procedural 25 个函数（L13390-14030，555 行）**：nextClumpName/initializeClumpShape/stableClumpVariation/createClumpFromLocks/addLockToClump/pointerToNdc/gridProfileSkipCol/clumpDirectMembers/clumpMembersForGuide/clumpGuideForLock/proceduralGuideForLock/proceduralAccessoryMembersForGuide/proceduralBranchMembersForGuide/proceduralBranchTemplatesForGuide/proceduralBranchWorldPoints/applyProceduralBranchSettings/proceduralAccessoryMapsForGuide/setProceduralAccessoryGeometry/createProceduralAccessoryLock/applyProceduralAccessorySettings/clumpFrameAt/commitClumpMemberRestState/updateClumpMembers/dissolveClump/detachLockFromClump — 归 B6（clump/procedural）批次；仅与 B2 有 4 条 B2→B6 + 3 条 B6→B2 交叉边（见 §3.1），不阻塞本批。
  6. `placeReferencePlane`（L4369）/ `referencePlanePlacement` 等 — 是**参考图系统（A4 批次）**，不是本批「放置流程」；本批放置流程 = 簇 E（createPlacedStrand/beginPlacementPointer/…/updatePlacementStatus）。
  7. `handleLiveSurfaceChange`（L22679）/ `syncDrawCurlControls`（L22631）— draw 面板 UI 事件胶水（12/55 行），留 app.js，内部调用改 api.X。
- **已迁走核实**：
  - `curve-surface-create.js` **没有** finishDrawStrandStroke 副本，仅在 L279 经 `deps.finishDrawStrandStroke(null,{cancel:true})` 调用 app.js 的 L14872 本体（G4 迁移时注入）；B2 迁出后该 deps 改接 drawFlowApi。
  - `strand-geometry.js` 的 `createHairGeometry(lock)`（模块内 L748，G1 已迁）是**几何构建器**（lock→THREE.Geometry），与本批创建入口 `createDrawnStrand`（stroke→lock）是两层，不冲突；B2 依赖 `strandGeometryApi.createHairGeometry` 仅出现在 updateDrawVolumePreview。
- **7 个死函数核实**：簇 T/A/E 内无死函数；addGeneratedBangPreset 等 7 个死函数属 B3（preset-library），与本批无关。## 1. 迁出函数清单（73，按当前行号）

> 列：行号 / 净体行 / 批内互调（只列本批 73 个候选内的调用）/ app.js 外部调用点数 / 模块 deps 引用数。批内互调详见 §3.1。

### 簇 T — draw clump 模板（L1125-1157，3 函数 33 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 1 | activeDrawClumpTemplate | 1125 | 4 | proceduralDrawClumpTemplate | 0 | 0 |
| 2 | proceduralDrawClumpTemplate | 1130 | 26 | — | 0 | 0 |
| 3 | drawModeCreatesClump | 1157 | 3 | activeDrawClumpTemplate | 0 | 0 |

### 灰区 — selectedCurveLatticeGuide（L12951，1 函数 6 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 4 | selectedCurveLatticeGuide | 12951 | 6 | — | 8 | 2 |

### 簇 A — draw/live-surface 状态与命中（L12958-13164，23 函数 180 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 5 | braidStrokeActive | 12958 | 3 | — | 2 | 1 |
| 6 | proceduralDrawActive | 12962 | 3 | — | 0 | 0 |
| 7 | panelStrokeActive | 12966 | 3 | — | 1 | 1 |
| 8 | activeStrokeSurfaceInput | 12970 | 3 | — | 1 | 0 |
| 9 | activeStrokeSurfaceValue | 12974 | 3 | activeStrokeSurfaceInput | 9 | 14 |
| 10 | normalizedLiveSurfaceSelection | 12978 | 5 | — | 1 | 0 |
| 11 | activeStrokeDynamicEnabled | 12984 | 3 | activeStrokeSurfaceValue,drawSurfaceDynamicEnabled | 3 | 4 |
| 12 | drawSurfaceDynamicEnabled | 12988 | 3 | — | 5 | 3 |
| 13 | setDrawSurfaceDynamicEnabled | 12992 | 3 | — | 3 | 0 |
| 14 | setActiveStrokeSurfaceValue | 12996 | 9 | activeStrokeSurfaceInput,normalizedLiveSurfaceSelection,setDrawSurfaceDynamicEnabled | 2 | 0 |
| 15 | liveSurfaceStrandId | 13006 | 3 | activeStrokeSurfaceValue | 0 | 0 |
| 16 | liveSurfaceStrand | 13010 | 4 | liveSurfaceStrandId,locks 查表 | 2 | 2 |
| 17 | liveSurfaceGuideId | 13015 | 3 | activeStrokeSurfaceValue | 0 | 0 |
| 18 | guideSupportsLiveSurface | 13019 | 6 | — | 0 | 0 |
| 19 | liveSurfaceGuide | 13026 | 6 | liveSurfaceGuideId,guideSupportsLiveSurface | 9 | 2 |
| 20 | refreshLiveSurfaceOptions | 13033 | 39 | normalizedLiveSurfaceSelection,setDrawSurfaceDynamicEnabled,guideSupportsLiveSurface | 10 | 2 |
| 21 | activeStrokeBrushSize | 13074 | 5 | braidStrokeActive,panelStrokeActive | 6 | 0 |
| 22 | activeStrokeBrushDepth | 13080 | 5 | braidStrokeActive,panelStrokeActive | 2 | 0 |
| 23 | strokeSurfaceIsContextual | 13086 | 4 | activeStrokeSurfaceValue,activeStrokeDynamicEnabled | 2 | 4 |
| 24 | contextualPlaneAtOrigin | 13094 | 9 | viewPlaneNormal(dep) | 3 | 6 |
| 25 | drawSurfaceHitFromEvent | 13104 | 38 | activeStrokeSurfaceValue,liveSurfaceStrand,liveSurfaceGuide,liveSurfaceGuideId,liveSurfaceStrandId,contextualPlaneAtOrigin,selectedCurveLatticeGuide | 7 | 6 |
| 26 | worldNormalAtHit | 13143 | 7 | — | 3 | 2 |
| 27 | drawSampleFromHit | 13152 | 13 | worldNormalAtHit,activeStrokeBrushSize,activeCreationShapeDefaults(dep) | 0 | 0 |

### 簇 B — 游标/stroke 处理/draw-clump 映射（L13166-13389，11 函数 209 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 28 | updateDrawStrandBrushCursor | 13166 | 36 | selectedTipContinuationLock,braidStrokeActive,drawSurfaceHitFromEvent,worldNormalAtHit,activeStrokeBrushSize | 1 | 0 |
| 29 | strokeLength | 13203 | 5 | — | 1 | 1 |
| 30 | resampleDrawStroke | 13209 | 31 | — | 0 | 0 |
| 31 | processedDrawStroke | 13241 | 24 | strokeLength,resampleDrawStroke | 1 | 2 |
| 32 | strokeSurfaceNormals | 13270 | 10 | — | 1 | 1 |
| 33 | drawClumpFrame | 13281 | 8 | — | 0 | 0 |
| 34 | nearestCurveParameter | 13290 | 13 | — | 0 | 0 |
| 35 | drawClumpSampleNormal | 13304 | 8 | — | 1 | 1 |
| 36 | drawClumpTemplateVector | 13313 | 5 | — | 0 | 0 |
| 37 | applyDrawClumpTemplateSettings | 13319 | 15 | shapePresets(dep) | 0 | 0 |
| 38 | drawClumpStrandMaps | 13335 | 54 | drawClumpFrame,nearestCurveParameter,drawClumpSampleNormal,drawClumpTemplateVector,applyDrawClumpTemplateSettings,activeDrawClumpTemplate | 0 | 0 |

### 簇 C — draw 预览（L14031-14307，6 函数 270 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 39 | updateDrawVolumePreview | 14031 | 23 | — | 0 | 0 |
| 40 | hideDrawClumpPreviews | 14055 | 5 | updateDrawVolumePreview | 0 | 0 |
| 41 | resetDrawVolumePreview | 14061 | 5 | — | 0 | 0 |
| 42 | updateDrawStrandPreview | 14067 | 220 | processedDrawStroke,strokeLength,strokeSurfaceNormals,drawClumpStrandMaps,applyDrawClumpTemplateSettings,activeDrawClumpTemplate,updateDrawVolumePreview,hideDrawClumpPreviews | 21 | 5 |
| 43 | continueFromTipEnabled | 14288 | 5 | braidStrokeActive | 0 | 0 |
| 44 | selectedTipContinuationLock | 14294 | 12 | continueFromTipEnabled,braidStrokeActive,getSelectedLock(dep) | 1 | 0 |### 簇 D — draw stroke 流程 + 创建入口（L14309-14898，11 函数 579 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 45 | beginDrawStrandStroke | 14309 | 128 | selectedTipContinuationLock,braidStrokeActive,updateDrawStrandBrushCursor,updateDrawStrandPreview,beginDrawFreePlane,drawStrokeSampleAtEvent,drawSampleFromHit,processedDrawStroke,activeStrokeBrushSize,activeStrokeBrushDepth,createDrawnLock,proceduralDrawActive | 1 | 0 |
| 46 | beginDrawFreePlane | 14438 | 13 | viewPlaneNormal(dep) | 0 | 0 |
| 47 | drawStrokeSampleAtEvent | 14452 | 24 | drawSurfaceHitFromEvent,activeStrokeDynamicEnabled,liveSurfaceStrand,strokeSurfaceIsContextual | 0 | 0 |
| 48 | updateDrawStrandStroke | 14477 | 45 | updateDrawStrandBrushCursor,drawStrokeSampleAtEvent,updateDrawStrandPreview | 1 | 0 |
| 49 | createDrawnLock | 14523 | 71 | addLock(dep),applyPlacedStrandScaleProfile,updateLockGeometry(dep) | 0 | 0 |
| 50 | finalizeDrawnLockSelection | 14595 | 7 | selectLock(dep),rebuildCurveObjects(dep),updateCurveObjects(dep) | 0 | 0 |
| 51 | createDrawnBraid | 14603 | 56 | processedDrawStroke,strokeLength,createDrawnLock,updateLockGeometry(dep),createMirrorPartnerForNewLock(dep) | 0 | 0 |
| 52 | createDrawnStrand | 14660 | 126 | processedDrawStroke,strokeLength,strokeSurfaceNormals,activeDrawClumpTemplate,drawClumpStrandMaps,createDrawnLock,nextClumpName(B6),createClumpFromLocks(B6),updateClumpMembers(B6),applyProceduralBranchSettings(B6),createDrawnBraid,createDrawnPanel,createMirrorPartnerForNewLock(dep),syncMirrorPartnerFromLock(dep) | 0 | 0 |
| 53 | createDrawnPanel | 14787 | 51 | processedDrawStroke,strokeLength,strokeSurfaceNormals,createDrawnLock | 0 | 0 |
| 54 | extendDrawnStrand | 14839 | 32 | updateLockGeometry(dep),rebuildCurveObjects(dep),selectLock(dep),syncLockFromCurve(dep),syncActiveMirror(dep) | 0 | 0 |
| 55 | finishDrawStrandStroke | 14872 | 26 | resetDrawVolumePreview,strokeLength,extendDrawnStrand,createDrawnStrand,pushUndoState(dep),updatePlacementStatus | 7 | 1 |

### 簇 E — 放置流程（L14899-15337，18 函数 421 行）
| # | 函数 | 行号 | 行数 | 批内互调 | app外 | 模块 |
|---|---|---|---|---|---|---|
| 56 | createPlacedStrand | 14899 | 63 | applyPlacedStrandScaleProfile,addLock(dep),updateLockGeometry(dep),createMirrorPartnerForNewLock(dep),renderLockList(dep),selectCurvePoint(dep) | 0 | 0 |
| 57 | placedPointCount | 14963 | 3 | — | 0 | 0 |
| 58 | createPlacedPoints | 14967 | 18 | placedPointCount,pushPointOutsideHead | 0 | 0 |
| 59 | pushPointOutsideHead | 14986 | 31 | — | 6 | 0 |
| 60 | resizePlacedStrand | 15018 | 16 | — | 0 | 0 |
| 61 | applyPlacedStrandScaleProfile | 15035 | 4 | — | 2 | 0 |
| 62 | beginPlaceEdit | 15040 | 17 | updatePlacementStatus | 0 | 0 |
| 63 | updatePlaceEdit | 15058 | 13 | updatePlacementLength,updatePlacementOrientation,updatePlacementStatus | 1 | 0 |
| 64 | updatePlacementLength | 15072 | 9 | resizePlacedStrand,updatePlacementStatus | 0 | 0 |
| 65 | updatePlacementOrientation | 15082 | 17 | camera(dep) | 0 | 0 |
| 66 | endPlaceEdit | 15100 | 14 | confirmPendingPlacedStrand,updateInteractionLocks(dep) | 2 | 0 |
| 67 | confirmPendingPlacedStrand | 15115 | 9 | finishPlacementFlow | 0 | 0 |
| 68 | pendingPlacedLock | 15125 | 3 | — | 1 | 0 |
| 69 | beginPlacementPointer | 15129 | 9 | pendingPlacedLock | 2 | 0 |
| 70 | finishPlacementPointer | 15139 | 23 | confirmPlacementStep,pushUndoState(dep),updatePlacementStatus | 1 | 0 |
| 71 | confirmPlacementStep | 15163 | 22 | createPlacedPoints,pushPointOutsideHead,createPlacedStrand,beginPlaceEdit,updatePlacementStatus | 0 | 0 |
| 72 | finishPlacementFlow | 15186 | 12 | confirmPendingPlacedStrand,updatePlacementStatus | 4 | 1 |
| 73 | updatePlacementStatus | 15199 | 138 | getSelectedLock(dep),componentEditModeActive(dep),sculptBrushToolActive(dep),effectiveSculptBrushTool(dep),pullMoveActive(dep) | 50 | 31 |

## 2. deps 清单（73 函数并集）

### 2.1 store 代理（经 deps 注入 .state，模块内一律 deps.X.y）
- sel.state（9 函数）、sculptState.state（12）、hairState.state（3）、scalpState.state（1）、miscState.state（1）、draw.state（1，activeDrawClumpTemplate 读 activeCustomDrawClumpTemplate）。
- 注意：不涉及 branch.state/guideState/undo.state/viewportState.state（本批只读，未用）；**双重 .state 检查点**：deps 传 .state 代理后模块内禁止再 .state。

### 2.2 顶层函数 deps（app.js 残留，经 deps 注入；curated 去伪）
- 创建/脊柱：addLock、updateLockGeometry、rebuildCurveObjects、updateCurveObjects、selectLock、getSelectedLock、selectCurvePoint、renderLockList、updateCount、pushUndoState、updateInteractionLocks、updateAttributeEditorMode。
- mirror/serialize：createMirrorPartnerForNewLock、mirrorPartnerFor、syncMirrorPartnerFromLock、syncActiveMirror、syncLockFromCurve。
- scalp/表面：scalpBuilder（模块 api，deps 注入）、activeCreationShapeDefaults、outwardNormalAtPoint、viewPlaneNormal、updateViewPlaneGrid、rayFromViewportEvent、headMeshes（drawSurfaceHitFromEvent 内）。
- 笔刷/材料/图层：setDrawStrandBrushCursorScale、ensureDrawClumpPreviewCount、groupDefaultsFor、pointsWithLayerOffset、normalizeHairLayer、strandDisplayColor、strandUsesDoubleSidedMaterial、createHairMaterial、materialForLock、setAnimeHairBaseColor、clonePanelSplits。
- 状态判定：componentEditModeActive、sculptBrushToolActive、effectiveSculptBrushTool、pullMoveActive。
- 伪阳性剔除：`project`（Vector3.project 方法）、`setting`（createDrawnLock 内联箭头局部变量）、`setPointScale`/`transportedStrandFrameAt`（仅 B6）。

### 2.3 顶层常量/DOM deps（经 deps 注入）
- 常量：DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE、DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE、DRAW_CLUMP_TEMPLATE、DRAW_CLUMP_TEMPLATES、PROCEDURAL_DRAW_DEFAULTS、braidMeshPresets（Map，建议留 app.js 经 deps 注入）、braidCreationDefaults、strandCreationDefaults、panelCreationDefaults。
- DOM：drawStrandSurfaceInput、drawSurfaceDynamicButton、drawStrandSmoothingInput、drawStrandCurveStepInput、braidSmoothingInput、braidCurveStepInput、panelSmoothingInput、panelCurveStepInput、drawToolSizeInput、braidToolSizeInput、panelToolSizeInput、drawContinueFromTipInput、braidContinueFromTipInput、placeStrandScalpOffsetInput、braidMeshPresetInput、drawSurfaceNormalInfluenceInput、panelSurfaceNormalInfluenceInput、placementStatus、drawStrandPreview、drawStrandMirrorPreview、drawStrandVolumePreview、drawStrandMirrorVolumePreview、drawStrandClumpVolumePreviews、drawStrandClumpMirrorPreviews、drawStrandBrushCursor。
- 场景/全局：camera、renderer、raycaster（worldNormalAtHit 内）、locks、guides、scalpSurfaceGroup、scalpSurfaceMesh。

### 2.4 模块级可 import（新模块直接 import，不走 deps）
- THREE（36 个函数用到，`import * as THREE from "three"`）。
- curve-math.js：sampleArray（createDrawnLock/updateDrawStrandPreview）、eightWayScreenDelta（updateDrawStrandStroke）、normalizeTaperCurve（createDrawnStrand/applyProceduralBranchSettings-B6）、clumpMemberGuideParameter/remapEnvelopeCurveRange（B6 用）。
- procedural-draw.js：proceduralAccessoryTemplateData（proceduralDrawClumpTemplate）、proceduralBranchTemplateData（B6）、proceduralAccessoryTaperScale（drawClumpStrandMaps）。
- app-config.js：ROOT_SCALP_OFFSET_DISTANCE、DEFAULT_HAIR_COLOR、DEFAULT_BRAID_MESH_PRESET、DEFAULT_HAIR_MATERIAL_ID、ROUND_SWEEP_PROFILE、CURVE_LATTICE_FEATURE_ENABLED、GROUP_CURVE_FEATURE_ENABLED。
- anime-hair-shaders.js：STANDARD_ANISOTROPIC_SHADER（updateDrawVolumePreview）。
- bone-model.js：bonesToData、bonesFromData、splitBonesToData、splitBonesFromData（updateDrawStrandPreview / beginDrawStrandStroke / createDrawnPanel 的 split-bone 拷贝）。
- 已迁 api 模块（经 deps 注入，不走裸 import）：scalpBuilder、shapePresets、strandGeometryApi（createHairGeometry）、branchHierarchy（selectedDrawBranchPoint/attachDrawnLocksAsBranches）、curveSurfaceCreate（仅 app.js 侧调用，本批不直接依赖）。## 3. 外部调用点

### 3.1 批内互调
- B2 内部互调边（73 候选内）：**132 条**（见 §1 各表「批内互调」列）。
- 跨批边：**B2→B6 4 条**（createDrawnStrand → nextClumpName / createClumpFromLocks / updateClumpMembers / applyProceduralBranchSettings）；**B6→B2 3 条**（proceduralAccessoryMapsForGuide → drawClumpStrandMaps / proceduralDrawClumpTemplate；createProceduralAccessoryLock → createDrawnLock）。
  - 含义：B2 先迁 → B2 模块把 4 个 B6 函数作为 deps（当前指 app.js 本体）；B6 迁出时改接 drawFlowApi/clumpApi 双向。

### 3.2 app.js 外部调用点：184 处（= 37 处 deps 注入行 + 147 处真实调用）
- **deps 注入行 37**：curveSurfaceCreateDeps L2452-2506（13）、scalpBuilderDeps L3536-3658（5）、guideDeps L5517-5601（6）、polyToolsDeps L5615-5654（8）、taperEditorDeps L9192/9209（2）、segmentControlDeps L9246（1）、strandGeometryDeps L16523-16528（3）→ 迁出后全部改 `drawFlowApi.X`。
- **事件绑定/指针层（模块作用域，~67 处）**：
  - L25566 pointermove→updateDrawStrandStroke；L25590/L25627 pointerup/cancel→endPlaceEdit；L25628 pointercancel→finishDrawStrandStroke(cancel)；L25646 pointerup→finishPlacementPointer；L25649 placementPointer 清理。
  - renderer pointerdown 大 handler L25839-25930：draw/braid/panel 分派（selectedTipContinuationLock→beginDrawStrandStroke→drawSurfaceHitFromEvent）、curve-surface/surface-loft 分派（drawSurfaceHitFromEvent/activeStrokeSurfaceValue/activeStrokeDynamicEnabled 喂给 curveSurfaceCreate）、place 分派（beginPlacementPointer/pendingPlacedLock/finishPlacementFlow/selectedCurveLatticeGuide）。
  - 其余模块作用域 ~55 处：boot 初始化 + 各 UI input 监听 + addEventListener 参数（updatePlacementStatus 等）。
- **保留函数内调用（~80 处 / 67 个保留函数）**：updateTransformScalePointer（15，数值输入管线脊柱）、applyValue（数值输入）、handleLiveSurfaceChange（3）、setActiveTool（3）、contextualRadialOptions/performStrandRadialAction（radial）、applyBraidToolPreset（B3，2）、createCurveLatticeGuideFromUi（1）、refreshActiveBrushSizeScale/refreshActiveBrushSizeCursor（3）、setDrawStrandMode（2）、applyCreationToolSettings（B3，2）等。
- **注意伪引用**：addLock/snapshotState/restoreLock 中的 `liveSurfaceGuide` 是 lock **数据属性**（L9575/10176/11287），非本批函数调用，不改。

### 3.3 模块外部调用点：92 处（10 个模块，全部 `deps.X`，无裸引用、无 index.html 引用）
| 模块 | 引用函数 |
|---|---|
| modules/geometry/curve-surface-create.js (13) | activeStrokeDynamicEnabled, activeStrokeSurfaceValue, contextualPlaneAtOrigin, drawClumpSampleNormal, drawSurfaceHitFromEvent, finishDrawStrandStroke, finishPlacementFlow, processedDrawStroke, strokeLength, strokeSurfaceIsContextual, strokeSurfaceNormals, updatePlacementStatus, worldNormalAtHit |
| modules/geometry/guide-system.js (8) | activeStrokeDynamicEnabled, activeStrokeSurfaceValue, contextualPlaneAtOrigin, drawSurfaceHitFromEvent, refreshLiveSurfaceOptions, selectedCurveLatticeGuide, strokeSurfaceIsContextual, updatePlacementStatus |
| modules/geometry/poly-tools.js (8) | activeStrokeSurfaceValue, contextualPlaneAtOrigin, drawSurfaceHitFromEvent, liveSurfaceGuide, liveSurfaceStrand, selectedCurveLatticeGuide, updatePlacementStatus, worldNormalAtHit |
| modules/scalp/scalp-builder.js (6) | activeStrokeSurfaceValue, braidStrokeActive, liveSurfaceGuide, liveSurfaceStrand, panelStrokeActive, updatePlacementStatus |
| modules/io/creation-presets.js (3) | activeStrokeSurfaceValue, drawSurfaceDynamicEnabled, updatePlacementStatus |
| modules/geometry/strand-geometry.js (3) | gridProfileSkipCol, proceduralBranchTemplatesForGuide, proceduralBranchWorldPoints |
| modules/geometry/taper-editor.js (2) | proceduralGuideForLock, updateDrawStrandPreview |
| modules/bones/segment-control.js (1) | updateDrawStrandPreview |
| modules/geometry/branch-sweep.js (1) | updateDrawStrandPreview |
| modules/geometry/branch-root-bone.js (1) | commitClumpMemberRestState |
| modules/geometry/branch-region-panel.js (1) | pointerToNdc |
| modules/geometry/sculpt-geometry.js (1) | commitClumpMemberRestState |

> B6 专属 7 处（strand-geometry 3 / taper-editor 1 / branch-root-bone 1 / branch-region-panel 1 / sculpt-geometry 1）不随本批；本批模块引用 = 92 - 7 = 85 处。跨批次重接：curveSurfaceCreateDeps/guideDeps/polyToolsDeps/scalpBuilderDeps/creationPresets 内联 deps/taperEditorDeps/segmentControlDeps/branchSweep 内联 deps 全部改 drawFlowApi.X。

## 4. 硬障碍检查

1. **`__AHS_TEST_SEAM`（现 L26232）**：区块仅暴露 sculptState/THREE/locks/scene/camera/renderer/raycaster/selection/bonesApi/panelTipStrand/taperEditor/segmentApi 及 sampleTaperCurve/strandFrameAt 等（含 updateStrandBrushHover/syncStrandHoverOutline——属 B1/selection 域）。**不含任何本批函数**，无需重定位；唯一留意：若 B2 迁出后 app.js 行号上移，seam 行号随之漂移（函数名锚定即可）。
2. **pointer 事件层绑定**：全部留在 app.js（§3.2），改 `drawFlowApi.*` 引用；不把 renderer pointerdown 大 handler（L25709-25940）迁入模块（含 reference/scalp/panel-split/alt-click 等非 B2 分支）。
3. **脊柱边界**：addLock/updateLockGeometry/rebuildCurveObjects/updateCurveObjects/pushUndoState/snapshotState/restoreLock/selection 全部留 app.js，经 deps 注入；本批无 restoreLock/snapshotState 调用（仅 lock 数据属性 liveSurfaceGuide 同名，勿误改）。
4. **preset library（B3 在迁）**：creationPresets 内联 deps（L10737-10746）当前注入 activeStrokeSurfaceValue/drawSurfaceDynamicEnabled/updatePlacementStatus + B6 的 createClumpBrushTemplate——B3 迁移若先于 B2 落地，其对这些函数的引用改为 drawFlowApi；B2 先落地则保持现状由 B3 重接（两者互不阻塞，建议 B2 先、B3 收尾重接）。
5. **guide-system 分派**：guide-system.js（已迁）经 guideDeps 注入 8 个本批函数（含 drawSurfaceHitFromEvent 用于 capsule guide 画到表面、selectedCurveLatticeGuide、refreshLiveSurfaceOptions 等）→ 重接 drawFlowApi；同时 selectedCurveLatticeGuide 被 app.js 5 处（L15596/22251/25493/25918/25970/26013）与 poly-tools 使用，属双向边界。
6. **引导期顶层调用**：本批无模块作用域**执行**调用（仅事件监听注册 + 各函数体内调用）；drawFlowApi 可先建空 deps、Object.assign 批填放在最后一个 dep 定义（约 L15338 后 / 或聚类批填）之后、底部事件绑定（L25531+）之前即可。
7. **跨批次重接汇总**：§3.3 表 12 处模块 deps 注入 + app.js 保留胶水（setActiveTool/applyValue/updateTransformScalePointer/handleLiveSurfaceChange/applyBraidToolPreset 等）改 api.X。

## 5. 装配点建议

- **模块文件**：`modules/geometry/draw-flow.js`，导出 `createDrawFlowApi(deps)`（与 draw-store.js 同域可选 modules/edit/draw-flow.js，但 geometry 域已有 procedural-draw.js/curve-surface-create.js 且本批大量依赖 geometry——**建议 modules/geometry/draw-flow.js**；若拆 2 子批则 draw-stroke+live-surface → draw-flow.js，放置 → modules/geometry/placement-flow.js）。
- **api 创建装配点**：紧跟 `curveSurfaceCreate`（L1524）附近创建 `const drawFlowApi = createDrawFlowApi(drawFlowDeps)`（先空对象）；**Object.assign(drawFlowDeps, {...}) 批填点**放在最后一个 dep（约 L15338 之后，`deselectStrands` 之前或紧随簇 E 之后），须在 L25531 事件绑定区之前生效。
- **UI/事件装配**：建议提供 `drawFlowApi.updatePreview()`（= updateDrawStrandPreview）、`drawFlowApi.refreshLiveSurfaceOptions()`、`drawFlowApi.updatePlacementStatus()`、`drawFlowApi.setActiveStrokeSurfaceValue()` 等薄壳，app.js 保留 handleLiveSurfaceChange/syncDrawCurlControls/updateControlPointHover 内部调用改 api.X。
- **boot 调用**：无顶层 boot 执行调用（§3.1），无需搬 boot 行；`refreshLiveSurfaceOptions()` 的 10 处保留函数内调用改 api 引用。
- **子批划分（推荐 2 子批，均独立可提交）**：
  - **子批 B2-1 draw-stroke + live-surface**：簇 T + 灰区 + A + B + C + D（56 函数 / 1,277 行 / app 外 ~118 处 / 模块 60 处）。含 updateDrawStrandPreview、begin/update/finishDrawStrandStroke、创建入口 createDrawn*、drawSurfaceHitFromEvent；B6 交叉边 4 条以 deps 注入 app.js 本体。
  - **子批 B2-2 放置流程**：簇 E（18 函数 / 421 行 / app 外 66 处 / 模块 33 处）。updatePlacementStatus 是最大引用面（app 50 + 模块 31），独立提交可把 diff 切成可审块。
  - 若再拆第三段：簇 A（live-surface 状态/命中）可先行（模块引用 47 处是其它模块最大的 B2 依赖面）。

## 6. 估算与难度

- **净减**：73 函数 / 1,698 净体行（毛行 1,854）迁出，加模块 wrapper/import ~80-120 行 → **净减 ~1,600-1,750 行**（保守 ~1,600，与计划一致）。
- **难度**：中高（与计划一致）。粘合面宽：app.js 外部 184 处（其中 37 处 deps 注入行 + ~67 处事件/模块作用域 + ~80 处保留函数）、模块 85 处（10 个模块）；12 处跨模块 deps 重接；B6 4+3 条跨批边；3 个 store 代理 + 41 个顶层函数 dep + 53 个常量/DOM dep；大函数 updateDrawStrandPreview(220)/updatePlacementStatus(138)/beginDrawStrandStroke(128)/createDrawnStrand(126)/createDrawnLock(71)。
- **外部调用点数（报告口径）**：函数名级 276（app.js 184 + 模块 92）；真正跨模块/脊柱 = 85 模块 deps + app.js 残留 ~110（事件/胶水/保留函数）。
- **回归**：node --check 双文件 + verify-smoke（基线 10/11）+ 新增 draw/place 手工回归点（pointerdown 分派、live-surface 下拉、放置状态栏）。

## 7. 边界存疑点（执行前确认）

1. **selectedCurveLatticeGuide（灰区）**：归 B2（推荐，drawSurfaceHitFromEvent 的 lattice 表面模式 + 模块 2 处引用）还是留 app.js 仅作 deps 值（它同时被 curve-lattice UI 5 处使用）。
2. **簇 T（activeDrawClumpTemplate/proceduralDrawClumpTemplate/drawModeCreatesClump）**：归 B2（推荐，仅被本批 draw 流程 + updatePlacementStatus 使用）还是归 B6（clump 域）。
3. **draw clump 映射函数（drawClumpFrame/nearestCurveParameter/drawClumpSampleNormal/drawClumpTemplateVector/applyDrawClumpTemplateSettings/drawClumpStrandMaps + 簇 C 的 updateDrawVolumePreview/hideDrawClumpPreviews/resetDrawVolumePreview）**：归 B2（推荐，draw 笔刷预览专属）vs B6；B6 的 proceduralAccessoryMapsForGuide 反向调用 drawClumpStrandMaps/proceduralDrawClumpTemplate（3 条 B6→B2 边）。
4. **updateDrawStrandPreview 的 split-bone 拷贝**（bonesToData/bonesFromData/splitBonesToData/splitBonesFromData）——bone-model.js 已迁，模块直接 import 即可；确认 bones 版本参数（`?v=20260812-1`）同步。
5. **braidMeshPresets Map 归属**：留 app.js 经 deps 注入（推荐，与 B3 报告一致；B1 createBraidGeometry 与 B2 createDrawnBraid 均读它）vs 迁模块（需给 B1/B2 getter）。
6. **fitPointAttributes**：B3 报告判为脊柱（addLock 直接调用）；本批 drawSampleFromHit 等不调用它——确认无漏网后不注入。
7. **creationPresets（B3 在迁）**与 B2 的先后：B2 先迁 → creationPresets 内联 deps 改 drawFlowApi；B3 先迁 → 本批报告 §3.3 按 B3 后的名字重接。两者互不阻塞，建议按「B2 先、B3 收尾」推进。
8. **`setting` 内联箭头**（createDrawnLock L14527）为函数内局部，随 createDrawnLock 一并迁出，不单独成函数；FUNCTION_INDEX 曾将其误记为顶层 arrow，迁移切块按函数名勿按行距。
9. **updateControlPointHover / updateTransformScalePointer / applyValue 保留**：这三者合计 ~45 处本批调用留在 app.js（pointer 事件 + 数值输入管线脊柱），只改 api.X 引用，不迁。

## ???? B2-1?draw-stroke + live-surface ???????

> 2026-08-12 ? ?? `0.2.59-refactor` ? ???? 584f48f?preset library?? ??? commit?
> ?? app.js ?? 24,308 ? ? ??? 23,072 ???? 1,237 ???

### ????
- **55 ?????**?? ?1 ????? T 3 + ?? selectedCurveLatticeGuide 1 + ? A 23 + ? B 11 + ? C 6 + ? D 11??????56 ????????? `createDrawFlowApi` ????????? 56 ? function??
- **1,284 ??**??????? + ?? `}` ???1 ??????? T33/gray6/A183/B213/C270/D579??
- ??? `modules/geometry/draw-flow.js`?1,453 ??`export function createDrawFlowApi(deps)`??? 55 ? api?
- app.js ????????**116 ?**??? deps ???? 40 + B6?B2 ??? 3 + ????/??/pointerdown ??? 73????? `drawFlowApi.X`?????? `liveSurfaceGuide`?lock ?????9 ????

### ????? ?5 ?????????????
- api ???`const drawFlowApi = createDrawFlowApi(drawFlowDeps);` ?? `curveSurfaceCreate`?? L1525 ???
- **?????? `Object.assign(boneInteractionDeps, {...});` ???? L9105 ? / ? L9079-9170?**???????????? E ???? ~L15338???
  - preset-library boot?? L10411 `loadBraidMeshPreset` ? ??? `updatePlacementStatus()` ? `selectedCurveLatticeGuide()`??? `sel.state.activeTool` ?? `select`???? E ??????**??**?? drawFlowApi?deps ??????
  - ?????? const/let deps ??? L9105 ????????? shapePresets L8914 / branchHierarchy L6489 / draw DOM inputs ?L2659????? deps ? function ????? TDZ?
- ??????????????`});`?? L9170???????????? drawFlowApi?? scalpBuilder/presetLibrary boot ???????????????? L22349+?? boot?renderLockList L24246?? L23009????????

### 12 ?????????app.js ???? drawFlowApi.X??????????
| deps ? | ?????? | ?? |
|---|---|---|
| curveSurfaceCreateDeps | activeStrokeDynamicEnabled/activeStrokeSurfaceValue/contextualPlaneAtOrigin/drawClumpSampleNormal/drawSurfaceHitFromEvent/finishDrawStrandStroke/processedDrawStroke/strokeLength/strokeSurfaceIsContextual/strokeSurfaceNormals/worldNormalAtHit?11?finishPlacementFlow/updatePlacementStatus ? E? | ? |
| scalpBuilderDeps | activeStrokeSurfaceValue/braidStrokeActive/liveSurfaceGuide/liveSurfaceStrand/panelStrokeActive?5?updatePlacementStatus ? E? | ? |
| guideDeps | activeStrokeDynamicEnabled/activeStrokeSurfaceValue/contextualPlaneAtOrigin/drawSurfaceHitFromEvent/refreshLiveSurfaceOptions/selectedCurveLatticeGuide/strokeSurfaceIsContextual?7?updatePlacementStatus ? E?guideDeps ? worldNormalAtHit? | ? |
| polyToolsDeps | activeStrokeSurfaceValue/contextualPlaneAtOrigin/drawSurfaceHitFromEvent/liveSurfaceGuide/liveSurfaceStrand/selectedCurveLatticeGuide/worldNormalAtHit?7?updatePlacementStatus ? E? | ? |
| branchSweep ?? deps | updateDrawStrandPreview?1? | ? |
| taperEditorDeps | updateDrawStrandPreview?1?proceduralGuideForLock ? B6 ??? | ? |
| segmentControlDeps | updateDrawStrandPreview?1? | ? |
| presetLibraryDeps | updateDrawStrandPreview/activeStrokeBrushSize/normalizedLiveSurfaceSelection/drawSurfaceDynamicEnabled/setDrawSurfaceDynamicEnabled?5? | ? |
| creationPresets ?? deps | activeStrokeSurfaceValue/drawSurfaceDynamicEnabled?2?updatePlacementStatus ? E? | ? |
| strandGeometryDeps | ?? B6?gridProfileSkipCol/proceduralBranchTemplatesForGuide/proceduralBranchWorldPoints?????? | ? ??? |
| branch-root-bone / branch-region-panel / sculpt-geometry | ?? B6?commitClumpMemberRestState/pointerToNdc?????? | ? ??? |

### ??????
- B2?B6??? deps ?? app.js ????createDrawnStrand ? `deps.nextClumpName` / `deps.createClumpFromLocks` / `deps.updateClumpMembers` / `deps.applyProceduralBranchSettings`?
- B6?B2?app.js ?? drawFlowApi.X??proceduralAccessoryMapsForGuide ? `drawFlowApi.proceduralDrawClumpTemplate` / `drawFlowApi.drawClumpStrandMaps`?createProceduralAccessoryLock ? `drawFlowApi.createDrawnLock`?

### deps ????????? 86 ???? 86 ??????
- store ???sel/sculptState/hairState/draw???? `deps.X.y`?? `deps.X.state`??
- ?????41??addLock/updateLockGeometry/rebuildCurveObjects/updateCurveObjects/selectLock/getSelectedLock/renderLockList/updateCount/pushUndoState/updateInteractionLocks/updateAttributeEditorMode/createMirrorPartnerForNewLock/mirrorPartnerFor/syncMirrorPartnerFromLock/syncActiveMirror/syncLockFromCurve/setDrawStrandBrushCursorScale/ensureDrawClumpPreviewCount/groupDefaultsFor/pointsWithLayerOffset/normalizeHairLayer/strandDisplayColor/strandUsesDoubleSidedMaterial/createHairMaterial/materialForLock/setAnimeHairBaseColor/clonePanelSplits/mirroredVector/viewPlaneNormal/updateViewPlaneGrid/rayFromViewportEvent/headMeshes/outwardNormalAtPoint/activeCreationShapeDefaults/updatePlacementStatus/applyPlacedStrandScaleProfile?
- ??/DOM/???~45??DRAW_CLUMP_TEMPLATE/DRAW_CLUMP_TEMPLATES/PROCEDURAL_DRAW_DEFAULTS/DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE/braidMeshPresets/braidCreationDefaults/strandCreationDefaults/panelCreationDefaults + 23 ? draw DOM + camera/renderer/raycaster/locks/guides/viewPlaneFill/viewPlaneGrid + scalpBuilder/branchHierarchy/strandGeometryApi/shapePresets?
- ??? import??? deps??THREE?sampleArray/eightWayScreenDelta/normalizeTaperCurve?curve-math??proceduralAccessoryTemplateData/proceduralAccessoryTaperScale?procedural-draw??STANDARD_ANISOTROPIC_SHADER?anime-hair-shaders??bonesToData/bonesFromData/splitBonesToData/splitBonesFromData?bone-model `?v=20260812-1`??ROOT_SCALP_OFFSET_DISTANCE/DEFAULT_HAIR_COLOR/DEFAULT_BRAID_MESH_PRESET/DEFAULT_HAIR_MATERIAL_ID/ROUND_SWEEP_PROFILE/CURVE_LATTICE_FEATURE_ENABLED/GROUP_CURVE_FEATURE_ENABLED?app-config??

### ??
1. **Object.assign ??????? E ??**?preset-library boot ?? E ???? updatePlacementStatus?selectedCurveLatticeGuide?????? boneInteractionDeps ?????????
2. **?? `? a : b` ???? `{ a: ... }` ???**??????? `? braidCreationDefaults :` ?????????????? `{`/`,` ?? `:` ????????
3. **spread `...name` ????**?`[...drawStrandClumpVolumePreviews, ...]` ????????? `.` ???????? `.`??? `obj.name` ???`prev2 !== "."`??
4. **??????????**?`activeStrokeBrushSize() * (braidStrokeActive() ? ?)`?`setDrawSurfaceDynamicEnabled(!drawSurfaceDynamicEnabled())` ????????? `drawFlowApi.`?
5. **guideDeps ? worldNormalAtHit**??3.3 ? guide ??????????? `name: drawFlowApi.name: drawFlowApi.name` ????????? guide/poly ???????
6. ????addLock/snapshotState/restoreLock ? `liveSurfaceGuide` ? lock ?????L9219/9820/10965 ? 9 ??????`__AHS_TEST_SEAM` ??????????

### 7 ?????
1. ??????????app.js ? 55 ?????????? `drawFlowApi.X` / ??? / deps ????????? 4 ????????????????
2. store ???? .state ???draw-flow.js ? `deps.X.state`?app.js ?? `sel: sel.state` ???????
3. ??? deps ???????????`});`????????? drawFlowApi?????/boot ???????
4. ???????? 12 ??????strandGeometry/branch-root-bone/branch-region/sculpt-geometry 4 ?? B6 ????????
5. ?????? UTF-8 ? BOM?CRLF?? ASCII ???app.js ???? 184 ? ASCII ???????? 0 ? ASCII???
6. ???`node --check` ????.mjs ??????????verify-smoke 10/11 = ??????? branch-bridge ?????? HEAD ?????
7. ??????????


## 执行记录 B2-2 — 放置流程迁出（2026-08-12）

> 分支 `0.2.59-refactor` · 基 3f6d102 · app.js 23,071 行（工作树 CRLF）→ 迁出后 22,689 行。

### 迁出（实际）
- 簇 E 18 个放置函数全部迁出到 `modules/geometry/placement.js`（`createPlacementApi(deps)`，481 行，独立模块，未并入已提交的 draw-flow.js）：
  createPlacedStrand/placedPointCount/createPlacedPoints/pushPointOutsideHead/resizePlacedStrand/applyPlacedStrandScaleProfile/beginPlaceEdit/updatePlaceEdit/updatePlacementLength/updatePlacementOrientation/endPlaceEdit/confirmPendingPlacedStrand/pendingPlacedLock/beginPlacementPointer/finishPlacementPointer/confirmPlacementStep/finishPlacementFlow/updatePlacementStatus。
- 原 app.js L12037-12474（438 行）删除，置换为 B2-2 提取注释（三行）。
- 净减：app.js 23,071 → 22,689（-382； git diff 口径 -502/+120）。
- 注：`confirmPendingPlacedStrand` 在全仓库无任何调用点（仅定义），属死函数，随簇 E 一并迁出（保持行为不变）。

### 接线（app.js）
- 导入 `createPlacementApi`（`./modules/geometry/placement.js?v=20260812-1`）。
- L1504 创建 `const placementDeps = {}; const placementApi = createPlacementApi(placementDeps);`（紧随 drawFlowApi）。
- L9181 `Object.assign(placementDeps, {...})` 批填（在 drawFlowDeps 批后、preset-library boot L10530 前）：store .state 代理 5（sel/sculptState/scalpState/hairState/miscState）+ 场景 6（camera/renderer/locks/guides/scalpSurfaceGroup/scalpSurfaceMesh）+ 模块 api 3（scalpBuilder/shapePresets/drawFlow=drawFlowApi）+ 常量/DOM 7（strandCreationDefaults/braidMeshPresets/placementStatus/placeStrandScalpOffsetInput/proportionalRadiusInput/braidMeshPresetInput）+ app.js 函数 21（addLock/updateLockGeometry/rebuildCurveObjects/updateCount/renderLockList/selectLock/getSelectedLock/selectCurvePoint/pushUndoState/updateInteractionLocks/createMirrorPartnerForNewLock/syncLockFromCurve/syncActiveMirror/syncInputs/fitPointAttributes/deselectStrands/pullMoveActive/componentEditModeActive/sculptBrushToolActive/effectiveSculptBrushTool/strandRegionDisplayLabel）。
- updatePlacementStatus 内原 `drawFlowApi.X` 改 `deps.drawFlow.X`（selectedCurveLatticeGuide/activeStrokeSurfaceValue/activeStrokeDynamicEnabled）；DEFAULT_HAIR_COLOR 直接 import app-config（与 draw-flow.js 同例）。

### 重接（app.js 外部调用点改写 64 处行）
- deps 批填 10 处改 placementApi.*：curveSurfaceCreateDeps（finishPlacementFlow/updatePlacementStatus）、scalpBuilderDeps、guideDeps、polyToolsDeps、drawFlowDeps（updatePlacementStatus/applyPlacedStrandScaleProfile）、presetLibraryDeps（updatePlacementStatus/pushPointOutsideHead）、creationPresets 内联 deps（updatePlacementStatus）。
- 事件/胶水：restoreRefreshes.register、createStrandsFromCurveLattice 内 applyPlacedStrandScaleProfile(lock)、setActiveTool 内 finishPlacementFlow、pointer 监听（updatePlaceEdit/endPlaceEdit×2/finishPlacementPointer/beginPlacementPointer×2/pendingPlacedLock/finishPlacementFlow×2）、updatePlacementStatus() 50 处。
- 模块侧零改动：所有模块经 deps.X 引用，无需改模块文件。
- B6→B2 交叉边核对：drawFlowDeps 仍注入 nextClumpName/createClumpFromLocks/updateClumpMembers/applyProceduralBranchSettings（app.js 本体，B6 批前不变）；本批无 B2→B6 新增。
- `__AHS_TEST_SEAM` 不含本批函数，无 seam 重导出。

### 踩坑
1. deps 批填里的简写键 `updatePlacementStatus,` 被全局重接后变成 `placementApi.updatePlacementStatus,`（对象成员简写不允许）→ 改 `updatePlacementStatus: placementApi.updatePlacementStatus,` 共 10 处。
2. `scalpActiveVertexIndices` 在 app.js 原为裸引用（仅 `scalpState.state.scalpActiveVertexIndices` 存在）——原代码潜在 ReferenceError 分支；迁出时改 `deps.scalpState.scalpActiveVertexIndices`（实时读 store），经 deps 接线后该分支可用（行为修正，见报告边界存疑点）。
3. PowerShell→node stdin 管道丢中文（`执行记录` 变 `????`）→ 记录与注释改用 ASCII 或 \uXXXX 编码写入。
4. 批填点必须早于 preset-library boot（loadBraidMeshPreset→registerBraidMeshPreset→updatePlacementStatus，L10530），故 placementDeps 批放在 drawFlowDeps 批后（L9181）、boot 前；时序审计 batch(9181)<boot(10530)<restoreRefreshes.run(11025)<指针监听(21966)。
5. 验证全过（简要）：裸引用扫描零；store 双重 .state 零；跨批重接 10 处 deps + 54 处胶水；UTF-8 无 BOM、CRLF、非 ASCII 守恒 184→184；node --check 双文件通过。