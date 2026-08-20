# clump/procedural 迁出 — 函数引用图（批次 B6）

> 只读盘点：2026-08-12 · 分支 `0.2.59-refactor` · **工作区 app.js 22,689 行**（FUNCTION_INDEX.json 快照 23,071 行已过时——B2-2 placement.js 正在工作区迁出未提交；本表已按当前工作区逐函数名重新锚定）。未改动 app.js/modules/*。
> 口径：行号全部为当前工作区实测；毛行 = 函数体大括号精确匹配（含行内注释/空行，不含夹层）。

## 0. 边界判定（核实结果）

- **已迁走（不在 app.js）**：`modules/geometry/procedural-draw.js`（proceduralAccessoryTaperScale/proceduralAccessoryTemplateData/proceduralBranchTemplateData 纯函数）；`modules/io/preset-library.js`（createCustomClumpPreset，B3 已迁）；`modules/data/clump-brush-presets.js`（createClumpBrushTemplate/normalizeClumpBrushTemplate）；**B2-2 placement**（updatePlacementStatus/applyPlacedStrandScaleProfile/pushPointOutsideHead/finishPlacementFlow 等 → `modules/geometry/placement.js`，工作区未提交）。
- **属 B2-2 放置**：placement 簇 18 函数已迁出；B6b 程序化复制簇内 7 处调用已改写为 `placementApi.updatePlacementStatus()`（L17064/17094/17156/17222/17263/17289/17326）→ B6b 需注入 `placementApi`。
- **属脊柱（留 app.js，经 deps 注入）**：addLock/updateLockGeometry/rebuildCurveObjects/updateCurveObjects/pushUndoState/snapshotState/restoreLock/selectLock/getSelectedLock/deleteLocks/renderLockList/updateCount/updateInteractionLocks/updateHistoryButtons/syncActiveMirror/mirrorPartnerFor/createMirrorPartner/syncMirrorPartnerFromLock/decoupleMirrorPartner/createMirrorPartnerForNewLock/selectedLocksInOrder/layerOffsetForLock/layerRootOffsetFactor/fitPointAttributes/setPointScale/flushPendingLockGeometryUpdates/outwardNormalAtPoint/transportedStrandFrameAt/rayFromViewportEvent/viewPlaneNormal/syncLockFromCurve/saveBooleanPreference/setActiveTool 等。
- **不迁移（留 app.js）**：`ensureDrawClumpPreviewCount`（L1747-1763，draw 笔刷 clump 预览计数，B2-1 的 drawFlowDeps 注入项，非 clump 成员逻辑）。
- **已核实无遗漏**：app.js 全部 `function *clump|procedural*` 顶层函数（40 个命中）+ 无名字含 clump/procedural 但属本域的相邻函数（pointerToNdc/gridProfileSkipCol/clumpFrameAt 等）均已纳入，合计 64 个候选；脚本/verify-* 与 seam 均无引用。

## 1. 迁出函数清单（63 个；建议拆 2 子批）

> 列：函数 | 当前 L 范围 | 毛行 | 批内互调 | ext（保留函数内调用） | top（deps 注入/监听/init） | 模块 deps 引用。
> 合计：**B6a = 41 函数 / 833 毛行 / 外部调用点 74（ext 40 + top 34）**；**B6b = 22 函数 / 706 毛行 / 外部调用点 20（ext 7 + top 13）**。

### clump_core — clump 核心（clump 工具/成员）（25 函数 / 555 毛行 / ext 16 / top 20 / 模块 deps 19）

| 函数 | L 范围 | 毛行 | 批内互调 | ext | top | 模块 deps |
|---|---|---|---|---|---|---|
| nextClumpName | L11445-11450 | 6 | — | 0 | 1 | modules/geometry/draw-flow.js:1183;modules/geometry/draw-flow.js:1218;modules/geometry/draw-flow.js:1241 |
| initializeClumpShape | L11452-11461 | 10 | — | 0 | 0 | — |
| stableClumpVariation | L11463-11473 | 11 | — | 0 | 0 | — |
| createClumpFromLocks | L11475-11498 | 24 | initializeClumpShape,nextClumpName | 0 | 1 | modules/geometry/draw-flow.js:1184;modules/geometry/draw-flow.js:1217;modules/geometry/draw-flow.js:1240 |
| addLockToClump | L11500-11516 | 17 | detachLockFromClump,updateClumpMembers | 0 | 0 | — |
| pointerToNdc | L11556-11562 | 7 | — | 0 | 1 | modules/geometry/branch-region-panel.js:705;modules/geometry/branch-region-panel.js:722 |
| gridProfileSkipCol | L11572-11579 | 8 | — | 0 | 1 | modules/geometry/strand-geometry.js:367;modules/geometry/strand-geometry.js:879 |
| clumpDirectMembers | L11596-11599 | 4 | — | 0 | 0 | — |
| clumpMembersForGuide | L11601-11603 | 3 | clumpDirectMembers | 0 | 0 | — |
| clumpGuideForLock | L11605-11608 | 4 | — | 5 | 2 | — |
| proceduralGuideForLock | L11610-11615 | 6 | clumpGuideForLock | 0 | 1 | modules/geometry/taper-editor.js:460;modules/geometry/taper-editor.js:530;modules/geometry/taper-editor.js:538;modules/geometry/taper-editor.js:654 |
| proceduralAccessoryMembersForGuide | L11617-11622 | 6 | clumpMembersForGuide | 0 | 0 | — |
| proceduralBranchMembersForGuide | L11624-11629 | 6 | — | 0 | 0 | — |
| proceduralBranchTemplatesForGuide | L11631-11641 | 11 | — | 0 | 1 | modules/geometry/strand-geometry.js:770 |
| proceduralBranchWorldPoints | L11643-11654 | 12 | — | 0 | 1 | modules/geometry/strand-geometry.js:718 |
| applyProceduralBranchSettings | L11656-11693 | 38 | proceduralBranchMembersForGuide,proceduralBranchTemplatesForGuide,proceduralGuideForLock | 0 | 1 | modules/geometry/draw-flow.js:1260 |
| proceduralAccessoryMapsForGuide | L11695-11709 | 15 | — | 0 | 0 | — |
| setProceduralAccessoryGeometry | L11711-11723 | 13 | — | 0 | 0 | — |
| createProceduralAccessoryLock | L11725-11775 | 51 | addLockToClump | 0 | 0 | — |
| applyProceduralAccessorySettings | L11777-11826 | 50 | addLockToClump,createProceduralAccessoryLock,proceduralAccessoryMapsForGuide,proceduralAccessoryMembersForGuide,proceduralGuideForLock,setProceduralAccessoryGeometry,syncProceduralParentVisibility | 0 | 0 | — |
| clumpFrameAt | L11828-11834 | 7 | — | 0 | 0 | — |
| commitClumpMemberRestState | L11836-11917 | 82 | clumpFrameAt,clumpGuideForLock,initializeClumpShape,stableClumpVariation | 6 | 4 | modules/geometry/sculpt-geometry.js:841 |
| updateClumpMembers | L11919-12021 | 103 | clumpFrameAt,clumpMembersForGuide,initializeClumpShape,proceduralAccessoryMapsForGuide,proceduralAccessoryMembersForGuide,setProceduralAccessoryGeometry,stableClumpVariation | 2 | 5 | modules/geometry/draw-flow.js:1211 |
| dissolveClump | L12023-12058 | 36 | — | 2 | 1 | — |
| detachLockFromClump | L12060-12084 | 25 | clumpGuideForLock,clumpMembersForGuide,dissolveClump | 1 | 0 | — |

### clump_ui — clump UI/选择/outliner（7 函数 / 153 毛行 / ext 12 / top 2 / 模块 deps 0）

| 函数 | L 范围 | 毛行 | 批内互调 | ext | top | 模块 deps |
|---|---|---|---|---|---|---|
| syncClumpGuidePanel | L14696-14721 | 26 | clumpGuideForLock,clumpMembersForGuide,initializeClumpShape | 1 | 0 | — |
| selectionCanBecomeClump | L15105-15108 | 4 | — | 2 | 0 | — |
| createClumpFromSelection | L15110-15120 | 11 | createClumpFromLocks,selectionCanBecomeClump | 1 | 1 | — |
| clumpMirrorRadialOptions | L15522-15527 | 6 | mirroredClumpPartners | 1 | 0 | — |
| outlinerClumpLocks | L17330-17332 | 3 | — | 5 | 1 | — |
| handleOutlinerClumpDrop | L17334-17355 | 22 | addLockToClump,clumpGuideForLock,createClumpFromLocks,detachLockFromClump | 1 | 0 | — |
| createOutlinerClump | L17539-17619 | 81 | clumpDirectMembers,handleOutlinerClumpDrop,outlinerClumpLocks,syncClumpGuidePanel | 1 | 0 | — |

### proc_ui — 程序化分支/配件 UI（6 函数 / 91 毛行 / ext 7 / top 9 / 模块 deps 0）

| 函数 | L 范围 | 毛行 | 批内互调 | ext | top | 模块 deps |
|---|---|---|---|---|---|---|
| proceduralParentOutlineVisible | L13830-13835 | 6 | — | 1 | 0 | — |
| syncProceduralParentVisibility | L13837-13844 | 8 | — | 4 | 0 | — |
| syncProceduralAccessoryEditControls | L14252-14289 | 38 | proceduralAccessoryMembersForGuide,proceduralBranchMembersForGuide,proceduralGuideForLock | 1 | 0 | — |
| setProceduralDrawExperimentalEnabled | L16168-16181 | 14 | — | 1 | 3 | — |
| beginProceduralAccessoryEdit | L19305-19309 | 5 | — | 0 | 3 | — |
| updateSelectedProceduralAccessories | L19310-19329 | 20 | applyProceduralAccessorySettings,applyProceduralBranchSettings,proceduralGuideForLock,syncProceduralAccessoryEditControls | 0 | 3 | — |

### dup_core — procedural duplicate 核心（17 函数 / 493 毛行 / ext 6 / top 8 / 模块 deps 0）

| 函数 | L 范围 | 毛行 | 批内互调 | ext | top | 模块 deps |
|---|---|---|---|---|---|---|
| proceduralDuplicateSourceSnapshots | L16629-16631 | 3 | — | 0 | 0 | — |
| proceduralDuplicateEligibleLock | L16633-16641 | 9 | — | 0 | 0 | — |
| selectedProceduralDuplicateSources | L16643-16646 | 4 | proceduralDuplicateEligibleLock | 1 | 0 | — |
| updateProceduralDuplicateSpacingNote | L16648-16658 | 11 | — | 0 | 1 | — |
| clearProceduralDuplicatePreview | L16660-16669 | 10 | hideProceduralDuplicateArcPreview | 0 | 0 | — |
| closeProceduralDuplicateDialog | L16671-16677 | 7 | clearProceduralDuplicatePreview,hideProceduralDuplicateArcPreview | 2 | 4 | — |
| openProceduralDuplicateDialog | L16679-16694 | 16 | rebuildProceduralDuplicatePreview,selectedProceduralDuplicateSources,updateProceduralDuplicateSpacingNote | 1 | 0 | — |
| proceduralDuplicateCopySnapshot | L16696-16715 | 20 | — | 0 | 0 | — |
| proceduralDuplicateHeadCenter | L16717-16726 | 10 | — | 0 | 0 | — |
| hideProceduralDuplicateArcPreview | L16728-16732 | 5 | — | 1 | 0 | — |
| proceduralDuplicateReferencePoints | L16734-16738 | 5 | — | 0 | 0 | — |
| updateProceduralDuplicateArcPreview | L16740-16771 | 32 | hideProceduralDuplicateArcPreview,proceduralDuplicateHeadCenter,proceduralDuplicateReferencePoints | 0 | 0 | — |
| applyProceduralDuplicateBlend | L16773-16926 | 154 | proceduralDuplicateHeadCenter | 0 | 0 | — |
| buildEvenlySpacedProceduralDuplicates | L16928-17028 | 101 | applyProceduralDuplicateBlend,proceduralDuplicateCopySnapshot,proceduralDuplicateHeadCenter,proceduralDuplicateSourceSnapshots | 0 | 0 | — |
| rebuildProceduralDuplicatePreview | L17030-17069 | 40 | buildEvenlySpacedProceduralDuplicates,clearProceduralDuplicatePreview,proceduralDuplicateEligibleLock,proceduralDuplicateSourceSnapshots,selectedProceduralDuplicateSources,updateProceduralDuplicateArcPreview | 1 | 2 | — |
| confirmProceduralDuplicatePreview | L17071-17096 | 26 | closeProceduralDuplicateDialog | 0 | 1 | — |
| beginProceduralDuplicatePlacement | L17226-17265 | 40 | beginDuplicatePlacement,cancelDuplicatePlacement,proceduralDuplicateSourceSnapshots,updateProceduralDuplicateArcPreview | 0 | 0 | — |

### dup_place — duplicate 放置（5 函数 / 213 毛行 / ext 1 / top 5 / 模块 deps 0）

| 函数 | L 范围 | 毛行 | 批内互调 | ext | top | 模块 deps |
|---|---|---|---|---|---|---|
| duplicatePlacementTarget | L16602-16627 | 26 | — | 0 | 0 | — |
| updateDuplicatePlacement | L17098-17160 | 63 | applyProceduralDuplicateBlend,duplicatePlacementTarget,hideProceduralDuplicateArcPreview,updateProceduralDuplicateArcPreview | 0 | 1 | — |
| beginDuplicatePlacement | L17162-17224 | 63 | — | 1 | 1 | — |
| confirmDuplicatePlacement | L17267-17302 | 36 | beginProceduralDuplicatePlacement,hideProceduralDuplicateArcPreview,updateDuplicatePlacement | 0 | 1 | — |
| cancelDuplicatePlacement | L17304-17328 | 25 | hideProceduralDuplicateArcPreview | 0 | 2 | — |

### uncertain — 边界存疑（4 函数 / 51 毛行 / ext 5 / top 4 / 模块 deps 1）

| 函数 | L 范围 | 毛行 | 批内互调 | ext | top | 模块 deps |
|---|---|---|---|---|---|---|
| ensureDrawClumpPreviewCount | L1747-1763 | 17 | — | 0 | 1 | modules/geometry/draw-flow.js:742 |
| mirroredClumpPartners | L9638-9642 | 5 | outlinerClumpLocks | 3 | 1 | — |
| createMirroredClump | L9644-9664 | 21 | createClumpFromLocks,nextClumpName,outlinerClumpLocks,updateClumpMembers | 1 | 1 | — |
| decoupleMirroredClump | L9666-9673 | 8 | outlinerClumpLocks | 1 | 1 | — |

## 2. 外部调用点明细（当前行号）

> 标注：〔ext〕保留函数内调用（迁出后改 `api.X`）；〔top〕deps 注入行 / 顶层监听 / init 调用（同改 `api.X`）。
### B6a

- **nextClumpName**（L11445-11450）ext(0): —
  top(1): L9172〔nextClumpName,〕
- **initializeClumpShape**（L11452-11461）ext(0): —
  top(0): —
- **stableClumpVariation**（L11463-11473）ext(0): —
  top(0): —
- **createClumpFromLocks**（L11475-11498）ext(0): —
  top(1): L9173〔createClumpFromLocks,〕
- **addLockToClump**（L11500-11516）ext(0): —
  top(0): —
- **pointerToNdc**（L11556-11562）ext(0): —
  top(1): L9677〔resize, pointerToNdc, closeSweepProfileEditor:〕
- **gridProfileSkipCol**（L11572-11579）ext(0): —
  top(1): L13279〔gridProfileSkipCol,〕
- **clumpDirectMembers**（L11596-11599）ext(0): —
  top(0): —
- **clumpMembersForGuide**（L11601-11603）ext(0): —
  top(0): —
- **clumpGuideForLock**（L11605-11608）ext(5): L3184(setLockHairLayer) L13924(selectLock) L15617(contextualRadialOptions) L15797(beginStrandRadialGesture) L15969(performStrandRadialAction)
  top(2): L18041〔const guide = clumpGuideForLock(lock);〕 L18063〔const guide = clumpGuideForLock(getSelectedLoc〕
- **proceduralGuideForLock**（L11610-11615）ext(0): —
  top(1): L8988〔proceduralGuideForLock,〕
- **proceduralAccessoryMembersForGuide**（L11617-11622）ext(0): —
  top(0): —
- **proceduralBranchMembersForGuide**（L11624-11629）ext(0): —
  top(0): —
- **proceduralBranchTemplatesForGuide**（L11631-11641）ext(0): —
  top(1): L13283〔proceduralBranchTemplatesForGuide,〕
- **proceduralBranchWorldPoints**（L11643-11654）ext(0): —
  top(1): L13284〔proceduralBranchWorldPoints,〕
- **applyProceduralBranchSettings**（L11656-11693）ext(0): —
  top(1): L9175〔applyProceduralBranchSettings〕
- **proceduralAccessoryMapsForGuide**（L11695-11709）ext(0): —
  top(0): —
- **setProceduralAccessoryGeometry**（L11711-11723）ext(0): —
  top(0): —
- **createProceduralAccessoryLock**（L11725-11775）ext(0): —
  top(0): —
- **applyProceduralAccessorySettings**（L11777-11826）ext(0): —
  top(0): —
- **clumpFrameAt**（L11828-11834）ext(0): —
  top(0): —
- **commitClumpMemberRestState**（L11836-11917）ext(6): L7312(endViewPlaneMove) L7313(endViewPlaneMove) L7570(endRelaxEdit) L7571(endRelaxEdit) L8780(setGroupLengthScale) L21440(finishStrandCurveTopologyChange)
  top(4): L865〔commitClumpMemberRestState(editedLock);〕 L866〔commitClumpMemberRestState(mirrorPartnerFor(ed〕 L2500〔commitClumpMemberRestState,〕 L6568〔commitClumpMemberRestState, componentEditModeA〕
- **updateClumpMembers**（L11919-12021）ext(2): L3185(setLockHairLayer) L13453(rebuildLockGeometry)
  top(5): L9174〔updateClumpMembers,〕 L18045〔updateClumpMembers(guide);〕 L18047〔if (mirroredGuide?.clumpGuide) updateClumpMemb〕 L18069〔updateClumpMembers(guide);〕 L18071〔if (mirroredGuide?.clumpGuide) updateClumpMemb〕
- **dissolveClump**（L12023-12058）ext(2): L15991(performStrandRadialAction) L20927(deleteLocks)
  top(1): L18134〔dissolveClump(guide.clumpId);〕
- **detachLockFromClump**（L12060-12084）ext(1): L20928(deleteLocks)
  top(0): —
- **syncClumpGuidePanel**（L14696-14721）ext(1): L14684(syncInputs)
  top(0): —
- **selectionCanBecomeClump**（L15105-15108）ext(2): L15305(showOutlinerContextMenu) L15635(contextualRadialOptions)
  top(0): —
- **createClumpFromSelection**（L15110-15120）ext(1): L15928(performStrandRadialAction)
  top(1): L18084〔createClumpFromSelection();〕
- **clumpMirrorRadialOptions**（L15522-15527）ext(1): L15619(contextualRadialOptions)
  top(0): —
- **outlinerClumpLocks**（L17330-17332）ext(5): L15997(performStrandRadialAction) L17717(renderLockList) L17788(renderLockList) L17792(renderLockList) L17809(renderLockList)
  top(1): L18195〔const targets = outlinerClumpLocks(guide);〕
- **handleOutlinerClumpDrop**（L17334-17355）ext(1): L17437(createOutlinerStrandButton)
  top(0): —
- **createOutlinerClump**（L17539-17619）ext(1): L17848(renderLockList)
  top(0): —
- **proceduralParentOutlineVisible**（L13830-13835）ext(1): L13811(syncLockedStrandWireVisual)
  top(0): —
- **syncProceduralParentVisibility**（L13837-13844）ext(4): L9497(addLock) L11293(restoreLock) L13446(rebuildLockGeometry) L13826(setStrandSelectionVisual)
  top(0): —
- **syncProceduralAccessoryEditControls**（L14252-14289）ext(1): L14334(updateAttributeEditorMode)
  top(0): —
- **setProceduralDrawExperimentalEnabled**（L16168-16181）ext(1): L16521(cancelPreferencesDialog)
  top(3): L10571〔setProceduralDrawExperimentalEnabled(importedB〕 L19797〔setProceduralDrawExperimentalEnabled(draw.stat〕 L20018〔setProceduralDrawExperimentalEnabled(procedura〕
- **beginProceduralAccessoryEdit**（L19305-19309）ext(0): —
  top(3): L19339〔beginProceduralAccessoryEdit();〕 L19342〔beginProceduralAccessoryEdit();〕 L19347〔beginProceduralAccessoryEdit();〕
- **updateSelectedProceduralAccessories**（L19310-19329）ext(0): —
  top(3): L19343〔updateSelectedProceduralAccessories();〕 L19348〔updateSelectedProceduralAccessories();〕 L19362〔updateSelectedProceduralAccessories();〕

### B6b

- **proceduralDuplicateSourceSnapshots**（L16629-16631）ext(0): —
  top(0): —
- **proceduralDuplicateEligibleLock**（L16633-16641）ext(0): —
  top(0): —
- **selectedProceduralDuplicateSources**（L16643-16646）ext(1): L15639(contextualRadialOptions)
  top(0): —
- **updateProceduralDuplicateSpacingNote**（L16648-16658）ext(0): —
  top(1): L20299〔updateProceduralDuplicateSpacingNote();〕
- **clearProceduralDuplicatePreview**（L16660-16669）ext(0): —
  top(0): —
- **closeProceduralDuplicateDialog**（L16671-16677）ext(2): L10818(undoLastAction) L10835(redoLastAction)
  top(4): L20314〔button.addEventListener("click", closeProcedur〕 L20317〔if (event.target === proceduralDuplicateDialog〕 L20321〔closeProceduralDuplicateDialog();〕 L20593〔closeProceduralDuplicateDialog();〕
- **openProceduralDuplicateDialog**（L16679-16694）ext(1): L15940(performStrandRadialAction)
  top(0): —
- **proceduralDuplicateCopySnapshot**（L16696-16715）ext(0): —
  top(0): —
- **proceduralDuplicateHeadCenter**（L16717-16726）ext(0): —
  top(0): —
- **hideProceduralDuplicateArcPreview**（L16728-16732）ext(1): L10865(resetTransientInteractionsForStateRestore)
  top(0): —
- **proceduralDuplicateReferencePoints**（L16734-16738）ext(0): —
  top(0): —
- **updateProceduralDuplicateArcPreview**（L16740-16771）ext(0): —
  top(0): —
- **applyProceduralDuplicateBlend**（L16773-16926）ext(0): —
  top(0): —
- **buildEvenlySpacedProceduralDuplicates**（L16928-17028）ext(0): —
  top(0): —
- **rebuildProceduralDuplicatePreview**（L17030-17069）ext(1): L13913(refreshStrandSelectionConsumers)
  top(2): L20300〔rebuildProceduralDuplicatePreview();〕 L20307〔input.addEventListener("input", () => rebuildP〕
- **confirmProceduralDuplicatePreview**（L17071-17096）ext(0): —
  top(1): L20311〔confirmProceduralDuplicatePreview();〕
- **beginProceduralDuplicatePlacement**（L17226-17265）ext(0): —
  top(0): —
- **duplicatePlacementTarget**（L16602-16627）ext(0): —
  top(0): —
- **updateDuplicatePlacement**（L17098-17160）ext(0): —
  top(1): L21955〔window.addEventListener("pointermove", updateD〕
- **beginDuplicatePlacement**（L17162-17224）ext(1): L16004(performStrandRadialAction)
  top(1): L20676〔if (!event.repeat) beginDuplicatePlacement(sel〕
- **confirmDuplicatePlacement**（L17267-17302）ext(0): —
  top(1): L22065〔renderer.domElement.addEventListener("pointerd〕
- **cancelDuplicatePlacement**（L17304-17328）ext(0): —
  top(2): L20597〔if (event.key === "Escape" && cancelDuplicateP〕 L20898〔cancelDuplicatePlacement();〕

### 边界存疑（建议 B6a）

- **ensureDrawClumpPreviewCount**（L1747-1763）ext(0): —
  top(1): L9153〔ensureDrawClumpPreviewCount,〕
- **mirroredClumpPartners**（L9638-9642）ext(3): L15301(showOutlinerContextMenu) L15971(performStrandRadialAction) L15979(performStrandRadialAction)
  top(1): L18155〔if (mirroredClumpPartners(guide).length) {〕
- **createMirroredClump**（L9644-9664）ext(1): L15973(performStrandRadialAction)
  top(1): L18159〔const mirroredGuide = createMirroredClump(guid〕
- **decoupleMirroredClump**（L9666-9673）ext(1): L15981(performStrandRadialAction)
  top(1): L18156〔decoupleMirroredClump(guide);〕

### 模块内 deps.X 消费者（模块不改，只改 app.js 注入行）

- `draw-flow.js`（B2）：deps.nextClumpName ×3（L1183/1218/1241）、deps.createClumpFromLocks ×3（L1184/1217/1240）、deps.updateClumpMembers ×1（L1211）、deps.applyProceduralBranchSettings ×1（L1260）、deps.ensureDrawClumpPreviewCount ×1（L742，留 app.js）
- `strand-geometry.js`（G1）：deps.gridProfileSkipCol ×2（L367/879）、deps.proceduralBranchTemplatesForGuide ×1（L770）、deps.proceduralBranchWorldPoints ×1（L718）
- `taper-editor.js`（G5）：deps.proceduralGuideForLock ×4（L460/530/538/654）
- `sculpt-geometry.js`（G6）：deps.commitClumpMemberRestState ×1（L841）
- `branch-region-panel.js`：deps.pointerToNdc ×2（L705/722）
- `branch-root-bone.js`：**仅注释**提及 commitClumpMemberRestState（L7/160），无实际 deps 调用 → app.js L6568 注入疑似死 dep，重接时核实可删

## 3. deps 清单

### B6a（clump-procedural.js）
- **模块级可 import**：`THREE`；`curve-math.js`（clumpMemberGuideParameter / remapEnvelopeCurveRange / normalizeTaperCurve）；`procedural-draw.js`（proceduralBranchTemplateData）。
- **注入模块 api**：drawFlowApi（proceduralDrawClumpTemplate / drawClumpStrandMaps / createDrawnLock）、branchRootBone（branchWorldVector / captureBranchLocalState）、taperEditor（renderTaperPreview，仅 syncProceduralAccessoryEditControls）。
- **store .state ??**?sel / sculptState / draw / miscState?
- **app.js ????????**?pushUndoState / updateLockGeometry / rebuildCurveObjects / renderLockList / updateCount / selectLock / getSelectedLock / deleteLocks / syncActiveMirror / syncLockFromCurve / mirrorPartnerFor / createMirrorPartner / syncMirrorPartnerFromLock / decoupleMirrorPartner / fitPointAttributes / setPointScale / outwardNormalAtPoint / transportedStrandFrameAt / saveBooleanPreference / setActiveTool / strandVisibleForDisplay / syncLockedStrandWireVisual / selectedLocksInOrder / setLocksOutlinerVisibility / createOutlinerStrandButton / createOutlinerVisibilityToggle / handleOutlinerRenameClick / showOutlinerContextMenu?
- **app.js const/共享对象（注入）**：locks / renderer / clumpOpen（Map）/ DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE / DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE / PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY / clumpGuidePanel / clumpGuideStatus / clumpInfluenceControl / clumpInfluenceInput / clumpInfluenceValue / clumpShapeControls / clumpShapeInputs / clumpShapeValues / proceduralAccessoryEditPanel / proceduralAccessoryEditCountInput / proceduralAccessoryEditCountValue / proceduralAccessoryEditRadiusInput / proceduralAccessoryEditRadiusValue / proceduralAccessoryEditParentVisibleInput / proceduralBranchEditCountInput / proceduralBranchEditCountValue / proceduralBranchEditLengthInput / proceduralBranchEditLengthValue / proceduralBranchEditTipOffsetInput / proceduralBranchEditTipOffsetValue / proceduralBranchLengthCurvePreview / proceduralBranchShapeCurvePreview / proceduralDrawExperimentalPreferenceInput / proceduralDrawToolButton。

### B6b（procedural-duplicate.js）
- **模块级可 import**：`THREE`；`curve-math.js`（blendDirectionPointData / blendSurfaceOrientedPolylinePointData / blendCylindricalPolylinePointData / blendSampleArrays / blendTaperCurves / blendEnvelopeCurves / horizontalCircleThroughPointData / horizontalCirclePointData / surfaceArcPolylinePointData / evenlySpacedInteriorAmounts / proximityCurveBlendAmount / lowestSharedHorizontalPolylinePointData / sampleArray）；`app-config.js`（ROOT_SCALP_OFFSET_DISTANCE / DEFAULT_TWIST_CURVE / TWIST_CURVE_VALUE_MAX）。
- **注入模块 api**：drawFlowApi（worldNormalAtHit，仅 duplicatePlacementTarget）、placementApi（updatePlacementStatus ×7）、scalpBuilder（activeScalpSurfaceMesh / rootScalpOffsetDistance / scalpTriangleRegion / scalpBuilderHeadMeshes / closestPointOnActiveScalp）。
- **store .state 代理**：sculptState（duplicatePlacement 状态）+ undoHistory / redoHistory。
- **app.js 顶层函数（注入）**：snapshotState / restoreLock / selectLock / deleteLocks / renderLockList / updateCount / updateInteractionLocks / updateHistoryButtons / createMirrorPartnerForNewLock / syncActiveMirror / syncLockFromCurve / updateLockGeometry / flushPendingLockGeometryUpdates / createRootAttachment / layerOffsetForLock / layerRootOffsetFactor / rayFromViewportEvent / viewPlaneNormal / selectedLocksInOrder。
- **app.js const/共享对象（注入）**：locks / raycaster / placementStatus / proceduralDuplicateDialog / proceduralDuplicateCountInput / proceduralDuplicateRootSinkInput / proceduralDuplicateSecondPointOutwardInput / proceduralDuplicateSecondPointTowardRootInput / proceduralDuplicateSpacingNote / proceduralDuplicateStatus / proceduralDuplicateArcPreview / proceduralDuplicateCirclePreview / proceduralDuplicateArcMarker（THREE 对象）。

## 4. 硬障碍检查

- **__AHS_TEST_SEAM**：当前 L22633-22686；已程序化核对 **无任何本批函数引用**（verify-tip-select.mjs 亦无）→ B6 迁移不影响 seam 契约，仅行号上移。
- **引导期顶层调用**：无 boot 期 B6 调用早于 deps 批填点。首个运行时调用链 = L22628 `updateAttributeEditorMode()` → syncInputs → **syncClumpGuidePanel**；批填点（建议 L9226 后）远早于它，无时序风险。
- **跨批次重接（app.js 6 处模块 deps 注入改指 clumpProceduralApi.X / proceduralDuplicateApi.X）**：sculptGeomDeps L2500（commitClumpMemberRestState）、branchRootBoneDeps L6568（commitClumpMemberRestState，疑似死 dep）、taperEditorDeps L8988（proceduralGuideForLock）、drawFlowDeps L9172-9175（nextClumpName/createClumpFromLocks/updateClumpMembers/applyProceduralBranchSettings）、branchRegionDeps L9677（pointerToNdc）、strandGeometryDeps L13279/13283/13284（gridProfileSkipCol/proceduralBranchTemplatesForGuide/proceduralBranchWorldPoints）。
- **B6→B2 反向边**：proceduralAccessoryMapsForGuide / createProceduralAccessoryLock / duplicatePlacementTarget 消费 drawFlowApi.*（注入，无静态 import，无环）。
- **B6b→B2-2**：7 处 placementApi.updatePlacementStatus（注入）；placement.js 读 sculptState.duplicatePlacement.procedural 状态（共享状态耦合，非函数边）。
- **B2→B6（drawFlowDeps 4 个 B6 函数）**：draw-flow.js 内 deps.X 调用零改动，仅 app.js L9172-9175 注入行改指新 api。

## 5. 装配点与批次建议

- **模块文件（建议 2 个，可拆 2 批独立 commit）**：`modules/geometry/clump-procedural.js`（B6a，导出 `createClumpProceduralApi(deps)`）+ `modules/geometry/procedural-duplicate.js`（B6b，导出 `createProceduralDuplicateApi(deps)`）。两子批零互调（dup 不调 clump，clump 不调 dup），独立可测。
- **装配点**：import 随现有模块区（≈L22-24）；api 创建紧跟 placementApi（≈L1505）；**deps 批填紧跟 placementDeps 批填块（≈L9226 之后）**——所有 const/DOM deps 均在 L2865（proceduralDrawToolButton）前定义，批填先于 L9622 branchRegionDeps / L13279 strandGeometryDeps / L22628 boot。
- **净减估算**：B6a 833 毛行 − ~100 脚手架 ≈ **730-770 净减**；B6b 706 − ~100 ≈ **600-650 净减**；合计约 **1,330-1,420**（与计划 B6 ~690 + A3 ~580 ≈ 1,270 同量级，差异来自本表按函数体精确计数）。
- **难度**：B6a **中**（56 个顶层 helper dep、6 处模块 deps 注入重接、clump 镜像/outliner 边界）；B6b **低-中**（自洽 22 函数、外部点 20、但依赖 restoreLock/snapshotState 等脊柱 + 2 个 capture 监听 L21955/L22065）。
- **执行顺序**：推荐 **B6b 先、B6a 后**（B6b 外部点少、自洽、风险低，即计划 A3 行；B6a 即计划 B6 行）。顺序也可互换（互不阻塞）。
- **回归**：`node --check` 三文件 + verify-smoke 基线 10/11 + verify-tip-select（?ahstest=1，seam 无 B6 引用故不受影响）；编码 UTF-8 无 BOM / CRLF / 中文逐字节守恒。

## 6. 边界存疑点

1. **pointerToNdc / gridProfileSkipCol 非 clump 专属**（通用视口 NDC / 网格跳列助手，仅被 branchRegionDeps / strandGeometryDeps 消费）：因物理位于 clump 簇内归 B6a（draw-creation 图已定）；保守可留 app.js 注入，二选一，建议 B6a。
2. **clump 镜像三函数**（mirroredClumpPartners/createMirroredClump/decoupleMirroredClump，L9638-9673，34 毛行）vs 计划「mirror/serialize 留 app.js」：三函数是 clump 专属镜像胶水（调 createClumpFromLocks/updateClumpMembers/nextClumpName/outlinerClumpLocks），**建议随 B6a**（通用 mirror 助手注入）；保守则留 app.js（B6a 降为 38 函数/799 行/外部 ~70）。
3. **createOutlinerClump（81 行）拉入 outliner UI 助手**（createOutlinerStrandButton/createOutlinerVisibilityToggle/setLocksOutlinerVisibility/handleOutlinerRenameClick/showOutlinerContextMenu）+ outliner DOM：B6a 与 UI 层边界；可整体迁（注入 UI 助手）或留 app.js（仅注入 clump core），建议整体迁（clump 专属）。
4. **branchRootBoneDeps.commitClumpMemberRestState（L6568）**：branch-root-bone.js 仅注释提及、无实际调用 → 疑似死 dep，重接时核实可删。
5. **syncProceduralAccessoryEditControls** 依赖 taperEditor.renderTaperPreview + 两条 procedural 分支曲线 canvas（proceduralBranchLengthCurvePreview/ShapeCurvePreview）：跨模块 UI，归 B6a（注入 taperEditor）。
6. **setProceduralDrawExperimentalEnabled** 是偏好/工具开关（PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY + draw store + proceduralDrawToolButton）：proc_ui 组归 B6a；被 loadPreferencesAndPresets（L10571）/cancelPreferencesDialog（L16521）调用，重接。
7. **工作区并发**：B2-2（placement.js）与 reference-head（A4 地图）未提交；本表基于当前工作区（22,689 行）锚定。执行前若 B2-2/A4 提交，行号会再漂移（本次 clump core +53、其后者 −382），**须按函数名重锚定**（本表函数名→行号可直接 grep）。
8. **是否拆 2 批**：**建议拆**。B6b（=计划 A3，22 函数）先落（低难度、外部点 20、独立自洽）；B6a（=计划 B6，41 函数含镜像）后落（中难度、外部点 74、6 处模块注入重接）。两批互不阻塞。

---

## 执行记录 B6b（2026-08-12 · 分支 0.2.59-refactor · HEAD c70883d 之后未提交）

### 实际迁出（22 函数 / 706 毛行，按当前工作区 20,631 行重新锚定）

| 函数 | 原 L 范围（app.js） | 毛行 |
|---|---|---|
| duplicatePlacementTarget | L14550-14575 | 26 |
| proceduralDuplicateSourceSnapshots | L14577-14579 | 3 |
| proceduralDuplicateEligibleLock | L14581-14589 | 9 |
| selectedProceduralDuplicateSources | L14591-14594 | 4 |
| updateProceduralDuplicateSpacingNote | L14596-14606 | 11 |
| clearProceduralDuplicatePreview | L14608-14617 | 10 |
| closeProceduralDuplicateDialog | L14619-14625 | 7 |
| openProceduralDuplicateDialog | L14627-14642 | 16 |
| proceduralDuplicateCopySnapshot | L14644-14663 | 20 |
| proceduralDuplicateHeadCenter | L14665-14674 | 10 |
| hideProceduralDuplicateArcPreview | L14676-14680 | 5 |
| proceduralDuplicateReferencePoints | L14682-14686 | 5 |
| updateProceduralDuplicateArcPreview | L14688-14719 | 32 |
| applyProceduralDuplicateBlend | L14721-14874 | 154 |
| buildEvenlySpacedProceduralDuplicates | L14876-14976 | 101 |
| rebuildProceduralDuplicatePreview | L14978-15017 | 40 |
| confirmProceduralDuplicatePreview | L15019-15044 | 26 |
| updateDuplicatePlacement | L15046-15108 | 63 |
| beginDuplicatePlacement | L15110-15172 | 63 |
| beginProceduralDuplicatePlacement | L15174-15213 | 40（本表原记 40，实际 37+签名 3） |
| confirmDuplicatePlacement | L15215-15250 | 36 |
| cancelDuplicatePlacement | L15252-15276 | 25 |

合计 706 毛行（含函数间 21 空行共 727 行整体移除）。新模块 `modules/geometry/procedural-duplicate.js`（802 行：706 函数 + 头注释/imports/脚手架/return）。

### 接线（app.js）
- import：L25 `import { createProceduralDuplicateApi } from "./modules/geometry/procedural-duplicate.js?v=20260812-3";`
- api 创建：L1509-1513（紧跟 placementApi；`const proceduralDuplicateDeps = {}; const proceduralDuplicateApi = createProceduralDuplicateApi(proceduralDuplicateDeps);`）
- deps 批填：L8102-8145 `Object.assign(proceduralDuplicateDeps, {...})`（紧跟 placementDeps 批填之后，38 个 key：sculptState .state 代理 + undoHistory/redoHistory + locks/raycaster + 13 const/DOM + drawFlowApi/placementApi/scalpBuilder + 19 脊柱 helper）。
- 外部调用点改写 17 处（app.js）：undoLastAction/redoLastAction 各 1（closeProceduralDuplicateDialog）、resetTransientInteractionsForStateRestore 1（hideProceduralDuplicateArcPreview）、refreshStrandSelectionConsumers 1（rebuildProceduralDuplicatePreview）、proceduralDuplicate 对话框 UI 块 7（spacing note/rebuild×2/confirm/close×3）、Escape close 1、Escape cancel 1、Ctrl+D begin 1、blur cancel 1、pointermove 1、pointerdown 1。
- **radialMenuDeps 重接 3 项**（A2 待办落实）：selectedProceduralDuplicateSources / openProceduralDuplicateDialog / beginDuplicatePlacement → `proceduralDuplicateApi.X`（radial-menu.js 模块内 deps.* 引用未动）。其余 deps 批填（sculptGeomDeps/branchRootBoneDeps/taperEditorDeps/drawFlowDeps/branchRegionDeps/strandGeometryDeps/placementDeps/scalpBuilderDeps 等）经全仓扫描确认无本批函数名引用。

### 模块 deps 清单（实际）
- 模块级 import：THREE；curve-math.js 15 个（blendDirectionPointData/blendCylindricalPolylinePointData/blendEnvelopeCurves/blendSampleArrays/blendSurfaceOrientedPolylinePointData/blendTaperCurves/evenlySpacedInteriorAmounts/horizontalCirclePointData/horizontalCircleThroughPointData/lowestSharedHorizontalPolylinePointData/proximityCurveBlendAmount/rootCorrectionFalloff/sampleArray/surfaceArcBlendAmount/surfaceArcPolylinePointData）；app-config.js 3 个（DEFAULT_TWIST_CURVE/ROOT_SCALP_OFFSET_DISTANCE/TWIST_CURVE_VALUE_MAX）。
  - **踩坑/存疑：本表 §3 B6b curve-math 清单漏了 `surfaceArcBlendAmount` 与 `rootCorrectionFalloff`**（applyProceduralDuplicateBlend 实际使用，均为 curve-math.js 导出）——本批已补 import。
- 注入模块 api：drawFlowApi（worldNormalAtHit ×1）、placementApi（updatePlacementStatus ×7）、scalpBuilder（activeScalpSurfaceMesh/rootScalpOffsetDistance/scalpTriangleRegion/scalpBuilderHeadMeshes/closestPointOnActiveScalp）。
- store .state 代理：sculptState（39 处 `sculptState.state.X` → `deps.sculptState.X`，无双重 .state）+ undoHistory/redoHistory。
- app.js 脊柱 19：snapshotState/restoreLock/selectLock/deleteLocks/renderLockList/updateCount/updateInteractionLocks/updateHistoryButtons/createMirrorPartnerForNewLock/syncActiveMirror/syncLockFromCurve/updateLockGeometry/flushPendingLockGeometryUpdates/createRootAttachment/layerOffsetForLock/layerRootOffsetFactor/rayFromViewportEvent/viewPlaneNormal/selectedLocksInOrder。
- app.js const/DOM 13：locks/raycaster/placementStatus/proceduralDuplicateDialog/proceduralDuplicateCountInput/proceduralDuplicateRootSinkInput/proceduralDuplicateSecondPointOutwardInput/proceduralDuplicateSecondPointTowardRootInput/proceduralDuplicateSpacingNote/proceduralDuplicateStatus/proceduralDuplicateArcPreview/proceduralDuplicateCirclePreview/proceduralDuplicateArcMarker。

### 回归验证（7 项）
1. 裸引用静态扫描归零：模块内自由标识符与 app.js 顶层函数/const/let 名碰撞 0；与 app.js import 绑定未解析引用 0；app.js 内 22 名残留 20 处全部为 `proceduralDuplicateApi.X`。
2. store 双重 .state：模块 `deps.sculptState.state` 0 处；`deps.sculptState` 39 处（= 原 39 处 `sculptState.state`）。
3. 引导期时序：批填生效行 L8145 `});`；api 创建 L1513 早于 radialMenuDeps（L2931）仅存值引用；全部 api.X 调用点在 L9695+（函数体内，运行时）与 L17565+/L19221/L19331（监听注册，均在 L8145 后）；无 boot 期调用早于批填。
4. 跨批次重接：radialMenuDeps 3 项已改；其它 deps 批填与 placement/draw-flow/scalp-builder/preset-library/reference-head 无本批函数名引用；radial-menu.js 模块内 deps.* 未动。
5. 编码：UTF-8 无 BOM、CRLF（app.js 19,955 行 / 模块 802 行全 CRLF）；非 ASCII 守恒 183 = 182 + 1（唯一 em dash「Live preview —」随块迁移，逐字节一致）。
6. 语法：`node --check` 双文件 .mjs 副本均通过（exit 0）。
7. 本记录已写入本文件。

### 边界存疑点
- 本表 §3 B6b curve-math 清单漏 surfaceArcBlendAmount/rootCorrectionFalloff（已补，见上）。
- beginProceduralDuplicatePlacement 毛行：本表 40 行 vs 当前 37 行（行号锚定漂移所致，函数体一致）。
- `undoState.locks.find`（proceduralDuplicateSourceSnapshots / beginDuplicatePlacement 各 1 处）是 undoState 参数属性访问，非全局 locks，未改写（扫描已区分）。
- app.js 净减：20,631 → 19,955（-676 行；模块 802 行含脚手架，净减略高于本表 600-650 估，因 728 行移除 + 52 行脚手架）。
- 未 commit、未动 index.html / FUNCTION_INDEX / verify-smoke / 其它批次产物。

---

## 执行记录 B6a（2026-08-12 · 分支 0.2.59-refactor · HEAD a82ffe4）

### 实际迁出（40 函数 / 827 毛行，按当前工作区 19,955 行重新锚定）

> 本表 §1 B6a 清单 41 函数中 clumpMirrorRadialOptions 已于 A2（radial-menu.js L182）迁出、不在 app.js，故本批实际 40 函数 / 827 毛行（= 833 − 6）。

| 函数 | 原 L 范围（app.js） | 毛行 |
|---|---|---|
| mirroredClumpPartners | L8560-8564 | 5 |
| createMirroredClump | L8566-8586 | 21 |
| decoupleMirroredClump | L8588-8595 | 8 |
| nextClumpName | L10322-10327 | 6 |
| initializeClumpShape | L10329-10338 | 10 |
| stableClumpVariation | L10340-10350 | 11 |
| createClumpFromLocks | L10352-10375 | 24 |
| addLockToClump | L10377-10393 | 17 |
| pointerToNdc | L10433-10439 | 7 |
| gridProfileSkipCol | L10449-10456 | 8 |
| clumpDirectMembers | L10473-10476 | 4 |
| clumpMembersForGuide | L10478-10480 | 3 |
| clumpGuideForLock | L10482-10485 | 4 |
| proceduralGuideForLock | L10487-10492 | 6 |
| proceduralAccessoryMembersForGuide | L10494-10499 | 6 |
| proceduralBranchMembersForGuide | L10501-10506 | 6 |
| proceduralBranchTemplatesForGuide | L10508-10518 | 11 |
| proceduralBranchWorldPoints | L10520-10531 | 12 |
| applyProceduralBranchSettings | L10533-10570 | 38 |
| proceduralAccessoryMapsForGuide | L10572-10586 | 15 |
| setProceduralAccessoryGeometry | L10588-10600 | 13 |
| createProceduralAccessoryLock | L10602-10652 | 51 |
| applyProceduralAccessorySettings | L10654-10703 | 50 |
| clumpFrameAt | L10705-10711 | 7 |
| commitClumpMemberRestState | L10713-10794 | 82 |
| updateClumpMembers | L10796-10898 | 103 |
| dissolveClump | L10900-10935 | 36 |
| detachLockFromClump | L10937-10961 | 25 |
| proceduralParentOutlineVisible | L12700-12705 | 6 |
| syncProceduralParentVisibility | L12707-12714 | 8 |
| syncProceduralAccessoryEditControls | L13122-13159 | 38 |
| syncClumpGuidePanel | L13566-13591 | 26 |
| selectionCanBecomeClump | L13975-13978 | 4 |
| createClumpFromSelection | L13980-13990 | 11 |
| setProceduralDrawExperimentalEnabled | L14232-14245 | 14 |
| outlinerClumpLocks | L14602-14604 | 3 |
| handleOutlinerClumpDrop | L14606-14627 | 22 |
| createOutlinerClump | L14811-14891 | 81 |
| beginProceduralAccessoryEdit | L16577-16581 | 5 |
| updateSelectedProceduralAccessories | L16582-16601 | 20 |

### 装配与接线
- 新模块：modules/geometry/clump-procedural.js（949 行含脚手架，导出 createClumpProceduralApi(deps)）。
- app.js：import 插入 L26（createClumpProceduralApi?v=20260812-1）；api 创建 L1519-1520（紧跟 proceduralDuplicateApi）；deps 批填 L8157-8223（}); 生效行 L8223，紧跟 proceduralDuplicateDeps 批填之后）。
- 模块级 import：THREE；curve-math.js（clumpMemberGuideParameter/remapEnvelopeCurveRange/normalizeTaperCurve）；procedural-draw.js（proceduralBranchTemplateData）。
- 注入模块 api：drawFlowApi（proceduralDrawClumpTemplate/drawClumpStrandMaps/createDrawnLock）、branchRootBone（branchWorldVector/captureBranchLocalState）、taperEditor（renderTaperPreview）。
- store .state 代理：sel（4 处）/ sculptState（2 处）/ draw（8 处）/ miscState（2 处），模块内全部 deps.X.y，双重 .state 0 处。
- app.js 注入：locks/renderer/clumpOpen + DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE/PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY + 27 个 clump/procedural DOM + 29 个脊柱 helper（pushUndoState/updateLockGeometry/rebuildCurveObjects/renderLockList/updateCount/selectLock/getSelectedLock/deleteLocks/syncActiveMirror/syncLockFromCurve/mirrorPartnerFor/createMirrorPartner/syncMirrorPartnerFromLock/decoupleMirrorPartner/fitPointAttributes/setPointScale/outwardNormalAtPoint/transportedStrandFrameAt/saveBooleanPreference/setActiveTool/strandVisibleForDisplay/syncLockedStrandWireVisual/selectedLocksInOrder/setLocksOutlinerVisibility/createOutlinerStrandButton/createOutlinerVisibilityToggle/handleOutlinerRenameClick/showOutlinerContextMenu）。

### 跨批次重接（app.js 模块 deps 注入行改指 clumpProceduralApi.X）
- drawFlowDeps 4 项：nextClumpName/createClumpFromLocks/updateClumpMembers/applyProceduralBranchSettings（L8056-8059；draw-flow.js 模块内 deps.* 未动）。
- radialMenuDeps 8 项：mirroredClumpPartners/clumpGuideForLock/selectionCanBecomeClump/createClumpFromSelection/createMirroredClump/decoupleMirroredClump/dissolveClump/outlinerClumpLocks（L2978-3004）。
- sculptGeomDeps 1 项：commitClumpMemberRestState（L2522）。
- branchRootBoneDeps 1 项：commitClumpMemberRestState（L5452，行内多条目行）。
- taperEditorDeps 1 项：proceduralGuideForLock（L7872）。
- branchRegionDeps 1 项：pointerToNdc（L8643）。
- strandGeometryDeps 3 项：gridProfileSkipCol/proceduralBranchTemplatesForGuide/proceduralBranchWorldPoints（L11638-11643）。
- 外部调用点改写共 70 处 = deps 批填 19 项 + 运行时调用 51 处。deps 批填 19：sculptGeomDeps 1（commitClumpMemberRestState）、radialMenuDeps 8（mirroredClumpPartners/clumpGuideForLock/selectionCanBecomeClump/createClumpFromSelection/createMirroredClump/decoupleMirroredClump/dissolveClump/outlinerClumpLocks）、branchRootBoneDeps 1（commitClumpMemberRestState）、taperEditorDeps 1（proceduralGuideForLock）、drawFlowDeps 4（nextClumpName/createClumpFromLocks/updateClumpMembers/applyProceduralBranchSettings）、branchRegionDeps 1（pointerToNdc）、strandGeometryDeps 3（gridProfileSkipCol/proceduralBranchTemplatesForGuide/proceduralBranchWorldPoints）。运行时 51：commitClumpMemberRestState×8、clumpGuideForLock×4、updateClumpMembers×6、syncProceduralParentVisibility×4、setProceduralDrawExperimentalEnabled×4、beginProceduralAccessoryEdit×3、updateSelectedProceduralAccessories×3、mirroredClumpPartners×2、dissolveClump×2、outlinerClumpLocks×5、proceduralParentOutlineVisible×1、syncProceduralAccessoryEditControls×1、syncClumpGuidePanel×1、selectionCanBecomeClump×1、handleOutlinerClumpDrop×1、createOutlinerClump×1、createClumpFromSelection×1、decoupleMirroredClump×1、createMirroredClump×1、detachLockFromClump×1。

### 回归验证（7 项）
1. 裸引用静态扫描归零：app.js 40 名全部只以 clumpProceduralApi.X / DOM 变量名（dissolveClumpAction/createClumpFromSelectionAction）出现；模块内 29 helper + 30 const/DOM + 3 api 全部 deps.X 化，自由标识符与 app.js 顶层名/import 绑定碰撞 0。
2. store 双重 .state：模块 deps.X.state 0 处。
3. 引导期时序：批填生效行 L8223；api 创建 L1519 早于 sculptGeomDeps（L2522）等全部引用；首运行时调用 = boot L19145 updateAttributeEditorMode() → syncProceduralAccessoryEditControls，远晚于 L8223；无 boot 期调用早于批填。
4. 跨批次重接：上述 7 个 deps 批填 19 项全部改指 clumpProceduralApi.X；draw-flow/radial-menu/taper-editor/strand-geometry/branch-region-panel/sculpt-geometry/branch-root-bone 模块内 deps.* 引用未动；branch-root-bone.js 对 commitClumpMemberRestState 仍仅注释提及（死 dep，已改指 clumpProceduralApi 保留结构）。
5. 编码：UTF-8 无 BOM、CRLF（app.js 19,207 行 / 模块 949 行全 CRLF）；非 ASCII 守恒 182 = 181 + 1（唯一 ° 随 syncClumpGuidePanel 迁移，逐字节一致）。
6. 语法：node --check 双文件 .mjs 副本均通过（exit 0）。
7. 本记录已写入本文件。

### 边界存疑点
- 本表 §1 B6a 含 clumpMirrorRadialOptions（L15522-15527，旧锚定），实际已随 A2 radial-menu.js 迁出，不在本批（径向菜单镜像选项保持 radial-menu.js 内，经 deps.mirroredClumpPartners 消费）。
- branchRootBoneDeps.commitClumpMemberRestState 为死 dep（branch-root-bone.js 仅注释提及），按任务要求改指 clumpProceduralApi 保留结构，未删。
- app.js 净减：19,955 → 19,207（−748 行；模块 949 行含脚手架，毛行 827 + 脚手架 ~122）。
- 未 commit、未动 index.html / FUNCTION_INDEX / verify-smoke / 已提交模块（draw-flow.js/procedural-duplicate.js/radial-menu.js 等）与其它批次产物。