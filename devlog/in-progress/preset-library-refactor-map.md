# preset library（含 hair 生成器）迁出 — 函数引用图（批次 B3）

> 目标：把 app.js 中「预设库 UI/渲染/保存/应用 + hair 生成器」业务层迁到 `modules/io/preset-library.js`（`createPresetLibraryApi(deps)` 依赖注入），app.js 只保留初始化 + store 装配 + 事件绑定 + 脊柱接线。
> 只读盘点：2026-08-12 · 分支 `0.2.59-refactor` · **app.js 快照 26,288 行**（FUNCTION_INDEX.json 生成于 08:30、口径 26,762 行，已过期）
> ⚠️ 并发修改警告：盘点期间 app.js 从 26,761 → 26,288 行（`git status` 显示 `M app.js`，-506 行，并行 G7/bones 迁出进行中）。**所有行号以本报告快照为准，执行前必须重新 grep 锚定函数名**（函数名稳定，行号在动）。
> 范围对照：appjs-slim-remaining-plan.md B3 行（Godel 旧区间 L2925-3114 / L13985-15349 / L27706-28069，32,530 行口径）→ 当前三个簇 = L3088-3293 / L11594-12950 / L22940-23302，外加 shape-preset UI 簇 L9321-9499。

## 0. 边界判定（关键）

- **迁出 39 个顶层函数（~1,982 行）+ ~17 个内联箭头**，按主题 5 个物理簇：
  - 簇 A braid mesh preset 数据/加载：L3088-3293（6 个）
  - 簇 D shape preset UI：L9321-9499（8 个）
  - 簇 B preset library 核心：L11594-11865（4 个）+ hair 生成器 L11920-12950（8 个）
  - misc：`labelForPreset` L16675-16678、`normalizeBraidDimensions` L17320-17332（2 个）
  - 簇 C creation preset UI：L22940-23302（11 个，`applyBraidToolPreset` 真实体 ~L23191-23245，其后为事件绑定区）
- **不迁移（夹在簇 B 区间内，留在 app.js）**：
  1. `vectorToData` L11562 / `dataToVector` L11566 / `frameToData` L11570 / `frameFromData` L11582 — serialize/snapshot/restore 数据管线（`snapshotState`/`restoreLock`/`restoreGuide`/`rootAttachmentToData` 使用），属计划「不值得拆」的 undo/restore/serialize 组。
  2. `average` L11866、`fitPointAttributes` L11870、`rebuildCurveObjects` L11899、`createCurvePoints` L11911 — 通用/脊柱：`fitPointAttributes` 被 `addLock` 直接调用，`createCurvePoints` 仅被 `addLock` 调用，`rebuildCurveObjects` 属 curve-objects-core。
  3. `syncHairCardControls` L17505 — hair-card UI 同步（B1/selection-edit，非 B3）。
  4. `presets`（front/side/back/twin/ahoge 放置预设 const，L~2894）— `addLock` 使用，留。
  5. `braidMeshPresetInput` change 绑定（L23274+）— 事件绑定留 app.js。
  6. `downloadPreferencesAndPresets` L10700 / `loadPreferencesAndPresets` L10747 / `handlePreferencesAndPresetsFile` L10817 — preferences+presets 文件 IO（计划 C1「IO 遗留」域，非 B3）；但它们调用本批 `populateShapePresetSelects/populateDrawBrushPresetSelect/populateCreationPresetSelect`，B3 迁出后改为 api 引用。
- **7 个死函数**：`addGeneratedBangPreset`、`addLongLayeredCurlsPreset`、`addBraidedBobPreset`、`addBraidedBobPresetV2`、`addBowlCutPreset`、`drawPresetThumbnail`、`labelForPreset` — 全仓（app.js/modules/index.html/scripts）无调用点。任务口径为「随 B3 迁入保留」；若一并删除可再省 ~660 行（建议保留，另列待确认）。
- **计划「62 函数」口径差异**：62 ≈ 本批 39 顶层 + ~17 内联箭头 + 8 个夹层非本批函数（vectorToData 等，判定不迁）+ 部分 IO 误计。净迁出 39 顶层 + 17 内联。

## 1. 迁出函数清单（39，按快照行号）

### 簇 A — braid mesh preset（L3088-3293，6 函数 ~206 行）
| # | 函数 | 行号 | 类型 | 外部调用（函数体外） |
|---|---|---|---|---|
| 1 | braidTemplateFromEntries | 3088-3119 | function | 3243/3244/3245（内部：registerBraidMeshPreset） |
| 2 | braidMeshEntries | 3120-3131 | function | 3237（内部） |
| 3 | prepareBraidBodyCache | 3132-3235 | function | 3246（内部；含 5 内联箭头 quantize/sourceNormalAt/clusterBoundary/normalBuckets/applyBucketPair） |
| 4 | registerBraidMeshPreset | 3236-3256 | function | 3282（内部：loadBraidMeshPreset） |
| 5 | annotateBraidObjTopology | 3257-3276 | function | 3281（内部） |
| 6 | loadBraidMeshPreset | 3277-3293 | function | **3292/3293（boot 调用 ×2）** |

### 簇 D — shape preset UI（L9321-9499，8 函数 ~179 行）
| # | 函数 | 行号 | 类型 | 外部调用 |
|---|---|---|---|---|
| 7 | setupShapePresetControls | 9321-9345 | function | 9474（boot 装配） |
| 8 | syncShapePresetRemoveButtons | 9346-9351 | function | 9370/9443（内部） |
| 9 | syncShapePresetSelects | 9352-9372 | function | 8469（branchSweep deps）、9128（shapePresets deps）、9202（taperEditorDeps）、9397（内部）、17271/17475/17944（app.js 同步函数） |
| 10 | populateShapePresetSelects | 9373-9400 | function | 9441/9467（内部）、9475（boot）、10789（loadPreferencesAndPresets） |
| 11 | openSaveShapePreset | 9401-9425 | function | 9341（内部：setupShapePresetControls） |
| 12 | commitCustomShapePreset | 9426-9448 | function | 23101（跨簇内部：commitCustomCreationPreset） |
| 13 | openRemoveShapePreset | 9449-9461 | function | 9342（内部） |
| 14 | commitRemoveShapePreset | 9462-9499 | function | 23175（跨簇内部：commitRemoveCreationPreset） |

### 簇 B — preset library 核心 + hair 生成器（L11594-12950，12 函数 ~1,303 行）
| # | 函数 | 行号 | 类型 | 外部调用 |
|---|---|---|---|---|
| 15 | applyPresetSelection | 11594-11624 | async function | 11839（内部：renderPresetLibrary 卡片点击） |
| 16 | drawPresetThumbnail | 11625-11793 | function | 无（死代码；169 行纯 canvas，含 fillHair/strand/bun/braid 内联箭头） |
| 17 | renderPresetLibrary | 11794-11852 | function | 11860（内部：setPresetLibraryOpen）、22200（filter 按钮事件绑定） |
| 18 | setPresetLibraryOpen | 11853-11865 | function | 10909（openHairProjectFile）、11841（内部）、22082/22083（toggle/close 事件绑定）、24323（Escape 键） |
| 19 | addGeneratedBangPreset | 11920-12013 | function | 无（死代码） |
| 20 | createLongLayeredCurlPoints | 12014-12062 | function | 12231（内部：addLongLayeredCurlsPreset） |
| 21 | addLongLayeredCurlsPreset | 12063-12281 | function | 无（死代码；含 columns/layer 内联箭头） |
| 22 | createBraidedBobShellPoints | 12282-12317 | function | 12401（内部：addBraidedBobPreset） |
| 23 | addBraidedBobPreset | 12318-12534 | function | 无（死代码；含 evenColumns/layer 内联箭头） |
| 24 | addBraidedBobPresetV2 | 12535-12844 | function | 无（死代码；含 scalpSeed/addPanel 内联箭头） |
| 25 | createBowlCutPoints | 12845-12882 | function | 12921（内部：addBowlCutPreset） |
| 26 | addBowlCutPreset | 12883-12950 | function | 无（死代码；含 evenColumns/layer 内联箭头） |

### misc（2 函数 ~17 行）
| # | 函数 | 行号 | 类型 | 外部调用 |
|---|---|---|---|---|
| 27 | labelForPreset | 16675-16678 | function | 无（死代码） |
| 28 | normalizeBraidDimensions | 17320-17332 | function | 10740（creationPresets deps 装配）、17409/17410（syncShapeDimensionInputs） |

### 簇 C — creation preset UI（L22940-23302，11 函数 ~363 行）
| # | 函数 | 行号 | 类型 | 外部调用 |
|---|---|---|---|---|
| 29 | applyPresetControl | 22940-22960 | function | 22995（内部：applyCreationToolSettings） |
| 30 | applyCreationToolSettings | 22961-23004 | function | 10741（creationPresets deps 装配）、23210（内部：applyBraidToolPreset） |
| 31 | populateCreationPresetSelect | 23005-23028 | function | 10791（loadPreferencesAndPresets）、23153/23182（内部）、23230（boot） |
| 32 | populateDrawBrushPresetSelect | 23029-23061 | function | 10790（loadPreferencesAndPresets）、23129/23155/23185（内部）、23229（boot） |
| 33 | syncCreationPresetRemoveButtons | 23062-23069 | function | 23026/23059（内部）、23239/23249（draw/braid 工具 change 事件绑定） |
| 34 | createCustomCreationPreset | 23070-23084 | function | 23252/23253（saveStrand/saveBraid 按钮事件绑定） |
| 35 | createCustomClumpPreset | 23085-23099 | function | 19246（clump 上下文菜单 action）、21405（outliner 上下文菜单） |
| 36 | commitCustomCreationPreset | 23100-23160 | function | 23258（creationPresetForm submit 事件绑定） |
| 37 | openRemoveCreationPreset | 23161-23173 | function | 23254/23255（remove 按钮事件绑定） |
| 38 | commitRemoveCreationPreset | 23174-23190 | function | 23269（confirmRemoveCreationPresetButton 事件绑定） |
| 39 | applyBraidToolPreset | 23191-23302 | function | 23247（braidToolPresetInput change 事件绑定；真实体 ~23191-23245） |

## 2. 外部调用点统计

- **函数名级引用点（app.js 函数体外 + 模块 deps 注入）≈ 64 处**；其中批内互调 ≈ 24 处，真正跨模块/脊柱 ≈ 40 处（含 4 个已迁模块的 deps 注入 5 处 + app.js 残留调用 ~35 处）。
- 留在 app.js 的**事件绑定/装配调用点**（迁出后改 api 引用）：
  - L3292-3293（loadBraidMeshPreset boot ×2）
  - L9474-9476（shapePresets.loadCustomShapePresets / setupShapePresetControls / populateShapePresetSelects + L9477 change 绑定）
  - L10789-10791（loadPreferencesAndPresets 内 populate*×3）
  - L10909（openHairProjectFile 内 setPresetLibraryOpen(false)）
  - L22082-22083（presetLibraryToggle/closePresetLibrary 绑定）
  - L22200（presetFilterButtons click → renderPresetLibrary）
  - L23229-23230（populateDrawBrushPresetSelect/populateCreationPresetSelect boot）
  - L23239/23249/23252-23255/23258/23269（creation preset 事件绑定组）
  - L24323（Escape 键处理）

## 3. deps 清单（createPresetLibraryApi(deps)）

### 模块级可 import（不注入）
- `THREE`（three）、`OBJLoader`（three/addons/loaders/OBJLoader.js）、`mergeGeometries`（three/addons/utils/BufferGeometryUtils.js）
- `parseObjFaceVertexCounts`（./geometry/topology.js）
- `cloneShapePresetValue`（./io/shape-presets.js）
- `createClumpBrushTemplate`、`normalizeClumpBrushTemplate`（./data/clump-brush-presets.js）
- `removeToolPreset`（./data/tool-presets.js）、`removeShapePreset`（./data/shape-presets.js）
- app-config 常量：`DEFAULT_BRAID_MESH_PRESET`、`DEFAULT_HAIR_COLOR`、`DEFAULT_SWEEP_PROFILE`（./core/app-config.js）

### deps 注入
- 数据/常量：`presetCatalog`、`authoredPresetProjects`、`braidMeshPresets`（Map，建议留 app.js）、`SHAPE_PRESETS`、`BRAID_TOOL_PRESETS`、`braidCreationDefaults`、`strandCreationDefaults`
- store 代理：`projectState`、`sculptState`、`sel`、`hairState`、`guideState`、`draw`、`miscState`、`undoHistory`、`redoHistory`（注意：deps 传 `.state` 代理，模块内用 `deps.X.y` 而非 `deps.X.state.y`）
- 已迁模块 api：`shapePresets`（io/shape-presets.js）、`creationPresets`（io/creation-presets.js）、`scalpBuilder`（scalp/scalp-builder.js）、`taperEditor`（geometry/taper-editor.js，仅 shapeTargetForSelect）
- 脊柱函数（留 app.js，经 deps）：`addLock`、`updateLockGeometry`、`getSelectedLock`、`selectLock`、`selectCurvePoint`、`renderLockList`、`updateCount`、`pushUndoState`、`restoreState`、`snapshotState`、`updateHistoryButtons`、`updatePlacementStatus`、`editSelectedLocks`、`syncMultiStrandInputs`、`syncCreationShapeInputs`、`updateViewportStatsVisibility`、`updateDrawStrandPreview`、`setDrawStrandMode`、`setDrawStrandBrushCursorScale`、`activeStrokeBrushSize`、`normalizedLiveSurfaceSelection`、`drawSurfaceDynamicEnabled`、`setDrawSurfaceDynamicEnabled`、`pushPointOutsideHead`、`groupDefaultsFor`、`clonePanelSplits`
- DOM：`presetLibrary`、`presetLibraryToggle`、`presetLibraryGrid`、`presetLibraryStatus`、`presetFilterButtons`、`shapePresetSelects`、`shapePresetButtons`（Map）、`drawBrushPresetInput`、`braidToolPresetInput`、`saveStrandToolPresetButton`、`saveBraidToolPresetButton`、`removeStrandToolPresetButton`、`removeBraidToolPresetButton`、`creationPresetDialog`、`creationPresetForm`、`creationPresetDialogTitle`、`creationPresetDescription`、`creationPresetNameInput`、`closeCreationPresetDialogButton`、`cancelCreationPresetButton`、`removeCreationPresetDialog`、`removeCreationPresetDialogTitle`、`removeCreationPresetMessage`、`cancelRemoveCreationPresetButton`、`confirmRemoveCreationPresetButton`、`braidToolSizeInput`、`braidSmoothingInput`、`braidCurveStepInput`、`braidScalpOffsetInput`、`braidAutoShowScalpInput`、`braidContinueFromTipInput`、`drawToolSizeInput`、`drawStrandSmoothingInput`、`drawStrandCurveStepInput`、`drawStrandScalpOffsetInput`、`drawSurfaceNormalInfluenceInput`、`drawStrandSurfaceInput`、`drawSurfaceDynamicButton`、`drawAutoShowScalpInput`、`drawContinueFromTipInput`、`scalpSurfaceGroup`

## 4. 硬障碍检查

1. **`__AHS_TEST_SEAM`**：当前 L26232（26,288 行口径）。钩子对象引用 sculptState/THREE/locks/getSelectedLock/selectLock/updateCurveObjects/clonePanelSplits/panelTipStrand/bonesApi 等，**不含任何本批函数** → 无直接冲突，无需改 seam。
2. **脊柱/undo 边界**：`addLock` 本体、`pushUndoState`、`restoreState`、`snapshotState`、`updateLockGeometry`、`getSelectedLock`、`editSelectedLocks` 等全部留 app.js，本批经 deps 调用。`applyPresetSelection` 直接调 `restoreState`（脊柱）→ deps.restoreState；`commitCustomCreationPreset` 调 `snapshotState`（快照脊柱）→ deps.snapshotState；undo 历史清空逻辑（undoHistory.clear/redoHistory.clear/updateHistoryButtons）随函数迁入，但 History 实例与 `undo` store 留 app.js。
3. **引导期顶层调用（boot 时序）**：
   - `loadBraidMeshPreset` ×2（L3292-3293）紧跟函数定义执行；回调 `registerBraidMeshPreset` 依赖 `locks/miscState/updateLockGeometry/updatePlacementStatus`（L1809/1814/17131 附近/15208）→ **不可在模块 import 期执行**，须在 app.js 装配点调用 `api.loadBraidMeshPreset(...)`。
   - shape preset UI 装配 L9474-9476：须在 `shapePresets` api（L9114）之后。
   - creation preset UI 装配 L23229-23230 + 绑定 L23239-23275：须在 `creationPresets` api（L10737）之后。
   - `renderPresetLibrary`/`setPresetLibraryOpen` **无 boot 期调用**（renderPresetLibrary 仅 11860 内部 + 22200 用户点击；setPresetLibraryOpen 的 10909 在 openHairProjectFile 用户动作内）→ 无 boot 时序风险。
4. **`defaultBraidToolSettings` 顶层 const（L23004，`creationPresets.creationToolSettingsSnapshot("braid")`）**：被 `applyBraidToolPreset` 引用，且 creationPresets 依赖本批的 `applyCreationToolSettings/normalizeBraidDimensions` → **存在装配依赖环**（presetLibraryApi 需 creationPresets 生成 defaultBraidToolSettings；creationPresets 需 presetLibraryApi 的 2 个函数）。解法：`defaultBraidToolSettings` 改为模块内延迟计算（applyBraidToolPreset 内联调用 deps.creationPresets.creationToolSettingsSnapshot），装配顺序改为「presetLibraryApi 先建 → creationPresets 后建（注入 presetLibraryApi.applyCreationToolSettings/normalizeBraidDimensions）」。或维持现状把两个函数留 app.js 薄包装（不推荐）。
5. **`braidMeshPresets` Map（L1809）**：被本批注册、被 `createBraidGeometry`（B1 几何脊柱，L8007-8008）与 `createDrawnBraid`（B2，L14613-14614）读取 → 建议 **Map 留 app.js，经 deps.braidMeshPresets 注入**（改动最小）；若迁入模块则需为 B1/B2 提供 getter。
6. **跨批次重接（已迁模块对本批的依赖）**：
   - modules/io/creation-presets.js：`deps.normalizeBraidDimensions`（L197）、`deps.applyCreationToolSettings`（L207）；app.js 装配 L10737-10746 传参 → 改为 `presetLibraryApi.*` 引用。
   - modules/io/shape-presets.js：`deps.syncShapePresetSelects`（L88）；app.js 装配 L9114-9131 → api 引用。
   - modules/geometry/branch-sweep.js：`deps.syncShapePresetSelects`（L341）；app.js 装配 ~L8469 → api 引用。
   - modules/geometry/taper-editor.js：`deps.syncShapePresetSelects`（L648）；app.js 装配 ~L9202 → api 引用。
   - 反向：本批依赖 `shapePresets`/`creationPresets`/`scalpBuilder`/`taperEditor` 模块 api（经 deps）→ 装配时已有，无环（除第 4 点）。
7. **夹层函数避让**：簇 B 区间内 vectorToData/dataToVector/frameToData/frameFromData/average/fitPointAttributes/rebuildCurveObjects/createCurvePoints（8 个，~86 行）不迁，迁移时按函数名切块，勿按行区间整块剪贴。

## 5. 装配点建议

- **模块文件**：`modules/io/preset-library.js`（与 io/shape-presets.js、io/creation-presets.js 同域；仓库无 modules/ui 目录，不建议新建）。导出 `createPresetLibraryApi(deps)`。
- **api 创建装配点**：紧跟 `creationPresets` 装配（现 L10737-10746）**之前**（因 creationPresets deps 需要本批的 normalizeBraidDimensions/applyCreationToolSettings）；`defaultBraidToolSettings` 按第 4.4 点延迟化后无环。
- **UI/事件装配**：建议 api 提供 `setupShapePresetControls()`、`setupCreationPresetControls()`、`setupPresetLibraryEvents()`（内部完成 L9474-9477 / L23229-23275 / L22082-22083+22200 的绑定），app.js 在现绑定位置调用；`openHairProjectFile`（L10909）、`loadPreferencesAndPresets`（L10789-10791）、Escape（L24323）保持 app.js 内改为 `presetLibraryApi.*` 引用。
- **boot 调用**：`api.loadBraidMeshPreset(DEFAULT_BRAID_MESH_PRESET, ...)` 与 `api.loadBraidMeshPreset("chain-links", ...)` 移到 app.js 装配点（现 L3292-3293 位置或 api 创建后立即）。

## 6. 估算与难度

- **净减**：迁出 ~1,982 毛行（39 顶层 + 17 内联），加模块 wrapper/import ~40-60 行 → **净减 ~1,900 行**（保守 ~1,600，与计划一致；若删除 7 个死函数可再减 ~660 行）。
- **难度**：中。5 个物理簇分散（3088-3293 / 9321-9499 / 11594-12950 / 16675+17320 / 22940-23302），8 个夹层函数需避让，4 个已迁模块 deps 重接，1 个装配依赖环（defaultBraidToolSettings），7 个死函数待确认，3 组 boot 装配时序。
- **外部调用点数**：函数名级 ~64（含批内互调 ~24）；真正跨模块/脊柱 ~40（含模块 deps 注入 5 处 + app.js 残留 ~35）。

## 7. 边界存疑点（执行前确认）

1. **7 个死函数**去留（随迁保留 vs 删除）：addGeneratedBangPreset/addLongLayeredCurlsPreset/addBraidedBobPreset/addBraidedBobPresetV2/addBowlCutPreset/drawPresetThumbnail/labelForPreset。
2. **`normalizeBraidDimensions`** 归 B3（推荐，随 creationPresets 域）还是留 app.js（仅作 deps 注入值）。
3. **`applyCreationToolSettings`/`applyPresetControl`**：与 B2 draw/creation 流程相邻，当前仅被 creation-presets 模块与 braid tool preset 使用 → 归 B3，但 B2 若后续涉及需重接。
4. **preferences 文件 IO**（downloadPreferencesAndPresets/loadPreferencesAndPresets/handlePreferencesAndPresetsFile）不随 B3，但其对 populate* 的调用改为 api 引用；是否并入 C1 一并迁出待定。
5. **`braidMeshPresets` Map 归属**：留 app.js（推荐，deps 注入）vs 迁模块（需给 B1/B2 getter）。
6. **事件绑定归属**：本批 3 组 UI 绑定建议随 api 迁入（setup* 方法）；若坚持「事件绑定留 app.js」，则这些绑定行的函数引用改 api 调用，净减少 ~40 行。
## 执行记录（2026-08-12 · 批次 B3 完成 · 分支 0.2.59-refactor · HEAD 0befdf2）

### 实际迁出

- 新模块 **modules/io/preset-library.js**（980 行，UTF-8 无 BOM/CRLF；`createPresetLibraryApi(deps)` 依赖注入，与 io/shape-presets.js、io/creation-presets.js 同域）。
- 迁出 **32 个顶层函数（839 毛行）**，含 5 个随迁内联箭头（prepareBraidBodyCache 的 quantize/sourceNormalAt/clusterBoundary/normalBuckets/applyBucketPair）；其余内联箭头随 7 个死函数一并删除：
  - 簇 A braid mesh preset（6）：braidTemplateFromEntries / braidMeshEntries / prepareBraidBodyCache / registerBraidMeshPreset / annotateBraidObjTopology / loadBraidMeshPreset
  - 簇 D shape preset UI（8）：setupShapePresetControls / syncShapePresetRemoveButtons / syncShapePresetSelects / populateShapePresetSelects / openSaveShapePreset / commitCustomShapePreset / openRemoveShapePreset / commitRemoveShapePreset
  - 簇 B preset library 核心（3）：applyPresetSelection / renderPresetLibrary / setPresetLibraryOpen
  - hair 生成器纯点构建器（3，随 B3 迁入保留）：createLongLayeredCurlPoints / createBraidedBobShellPoints / createBowlCutPoints
  - misc（1）：normalizeBraidDimensions
  - 簇 C creation preset UI（11）：applyPresetControl / applyCreationToolSettings / populateCreationPresetSelect / populateDrawBrushPresetSelect / syncCreationPresetRemoveButtons / createCustomCreationPreset / createCustomClumpPreset / commitCustomCreationPreset / openRemoveCreationPreset / commitRemoveCreationPreset / applyBraidToolPreset
- app.js 26,288 → **24,308 行（净减 1,980 行）**：迁出 839 + 死函数删除 1,072 + 装配/注释新增 ~80。
- 夹层 8 个非本批函数（vectorToData/dataToVector/frameToData/frameFromData/average/fitPointAttributes/rebuildCurveObjects/createCurvePoints）留在 app.js，未迁。

### 死函数删除（先独立核实全仓零调用，随本批删除）

addGeneratedBangPreset（L11920-12013）、addLongLayeredCurlsPreset（L12063-12281）、addBraidedBobPreset（L12318-12534）、addBraidedBobPresetV2（L12535-12844）、addBowlCutPreset（L12883-12950）、drawPresetThumbnail（L11625-11793）、labelForPreset（L16675-16678）——全仓（app.js/modules/index.html/scripts）仅定义、零调用点（grep 确认），同 G2+G3 triangulatePolygon3D 先例。

### 装配顺序（引导期 deps 时序）

1. **L1552-1556**：`const presetLibraryDeps = {}; const presetLibraryApi = createPresetLibraryApi(presetLibraryDeps);`（早期创建，紧邻其它 api const；deps 为空对象，运行期才读取）。
2. **L8265 / L8914 / L8939**：branchSweep、shapePresets、taperEditorDeps 批填改为 `syncShapePresetSelects: presetLibraryApi.syncShapePresetSelects`（引用 api 方法，无 TDZ）。
3. **L10385-10412**：presetLibraryDeps 批填（Object.assign，78 项）+ boot 调用 `loadBraidMeshPreset(DEFAULT_BRAID_MESH_PRESET, "./assets/braid-segment.obj?v=20260720-1")`、`loadBraidMeshPreset("chain-links", "./assets/chainlinks.obj?v=20260720-1", { authoredCaps: true })`、`setupShapePresetUi()`。
4. **L10414-10422**：`const creationPresets = createCreationPresetsApi({ ... normalizeBraidDimensions: presetLibraryApi.normalizeBraidDimensions, applyCreationToolSettings: presetLibraryApi.applyCreationToolSettings ... })`（先建 presetLibraryApi 再建 creationPresets，解装配环）。
5. **L10423**：`presetLibraryDeps.creationPresets = creationPresets;`（就地填充，运行期才读取）。
6. **L20440**：`presetLibraryApi.setupPresetLibraryEvents()`（原 presetLibraryToggle/closePresetLibrary/presetFilterButtons 三处绑定收敛）。
7. **L21293**：`presetLibraryApi.setupCreationPresetUi()`（原 creation preset boot + 事件绑定区；`braidMeshPresetInput` change 绑定留在 app.js，未迁）。

### 外部调用点改写

- 3 组 UI/事件绑定收敛为 api setup* 方法（setupShapePresetUi / setupCreationPresetUi / setupPresetLibraryEvents）。
- app.js 残留调用改 `presetLibraryApi.*`（20 处）：populateShapePresetSelects×1、populateDrawBrushPresetSelect×1、populateCreationPresetSelect×1、setPresetLibraryOpen×2（openHairProjectFile + Escape）、syncShapePresetSelects×3（syncShapeDimensionInputs 等）、normalizeBraidDimensions×2（syncShapeDimensionInputs）、createCustomClumpPreset×2（clump 上下文菜单 + outliner）。
- 跨批次重接（4 个已迁模块 deps）：shapePresets（syncShapePresetSelects）、branchSweep（syncShapePresetSelects）、taperEditorDeps（syncShapePresetSelects）、creationPresets（normalizeBraidDimensions / applyCreationToolSettings）。
- **defaultBraidToolSettings 顶层 const 删除**，改模块内延迟计算：`applyCreationToolSettings("braid", deps.creationPresets.creationToolSettingsSnapshot("braid"))`（任务口径：模块内延迟计算以解环；原为 boot 期快照，现为首次 applyBraidToolPreset 时快照——对内置 braid 预设点击不再回滚工具控件到 boot 期值，属既定口径）。

### deps 清单（createPresetLibraryApi，78 项全部批填/就地填充）

- 数据/常量：presetCatalog、authoredPresetProjects、braidMeshPresets（Map 留 app.js 注入）、SHAPE_PRESETS、BRAID_TOOL_PRESETS、braidCreationDefaults、strandCreationDefaults
- store：projectState（store 对象，用 deps.projectState.state.*）、sculptState/hairState/guideState/drawState/miscState（.state 代理，用 deps.X.y）、undoHistory/redoHistory（History 实例）、locks
- 模块 api：shapePresets、creationPresets（L10423 就地填充）、scalpBuilder、taperEditor
- 脊柱（留 app.js 经 deps）：updateLockGeometry、getSelectedLock、updatePlacementStatus、restoreState、snapshotState、updateHistoryButtons、pushUndoState、updateDrawStrandPreview、syncCreationShapeInputs、setDrawStrandMode、setDrawStrandBrushCursorScale、activeStrokeBrushSize、normalizedLiveSurfaceSelection、drawSurfaceDynamicEnabled、setDrawSurfaceDynamicEnabled、pushPointOutsideHead、updateViewportStatsVisibility
- DOM（~46）：presetLibrary/presetLibraryToggle/presetLibraryGrid/presetLibraryStatus/presetFilterButtons、shapePresetSelects/shapePresetButtons、drawBrushPresetInput/braidToolPresetInput、saveStrand/saveBraid/removeStrand/removeBraid 按钮、creationPresetDialog 系 5（dialog/form/title/description/nameInput/close/cancel）、removeCreationPresetDialog 系 5（dialog/title/message/cancel/confirm）、braidTool* 6、drawTool*/drawStrand*/drawSurface* 13、scalpSurfaceGroup
- 模块级 import（不注入）：THREE、OBJLoader、mergeGeometries、parseObjFaceVertexCounts（../geometry/topology.js）、createClumpBrushTemplate/normalizeClumpBrushTemplate（../data/clump-brush-presets.js）、removeToolPreset（../data/tool-presets.js）、removeShapePreset（../data/shape-presets.js）、DEFAULT_BRAID_MESH_PRESET（../core/app-config.js）

### 踩坑

1. **相对路径**：新模块在 modules/io/，跨目录 import 必须 `../`（初版误写 `./` 导致模块图 5 个子模块 404，整页 app.js 静默不执行；verify-smoke 从 10/11 掉到 7/11，probe 抓 HTTP>=400 定位）。
2. **静态扫描 tokenizer 行注释**：skipCode 对 `//` 必须跳到行尾而非串尾，否则首个注释后全部代码被吞（漏替换 200+ 处）。
3. **模板字符串 ${} 内裸引用**：`Remove ${shapePresets.shapePresetLabel(key)} Preset` 中的 shapePresets 需替换——tokenizer 需递归扫描模板表达式（scanTemplateExpr）。
4. **spread `...name` 与对象键/三元区分**：`...creationPresets.creationPresetSnapshot(...)`、`[...drawBrushPresetInput.options]` 是裸引用（标识符前两字符 `..`）；`? braidToolPresetInput :` 不是对象键（prev 为 `?` 而非 `{`/`,`）。
5. **store 代理双重 .state**：sculptState/hairState/guideState/drawState/miscState 经 deps 传 .state 代理，模块内用 deps.X.y；projectState 传 store 对象，用 deps.projectState.state.y（与 shape-presets/creation-presets 一致）。
6. **Windows PowerShell Set-Content -Encoding UTF8 会写 BOM**：修 import 后需按字节剥离 EF BB BF（app.js 与模块均复现一次）。
7. **boot 期 loadBraidMeshPreset 移动**：由 L3291-3292 移到 deps 批填之后（L10411-10412），registerBraidMeshPreset 回调依赖 locks/miscState/updateLockGeometry/updatePlacementStatus 均已在批填就绪；异步加载语义不变。

### 验证结果（7 项）

1. **裸引用静态扫描归零**：模块内 0 泄漏（唯一命中为自身导出 createPresetLibraryApi）；app.js 无残留定义/裸调用（32 迁出 + 7 死函数名全查）。
2. **store 代理双重 .state**：0（五个代理均 deps.X.y；projectState 走 deps.projectState.state.*）。
3. **引导期 deps 时序**：见上「装配顺序」；loadBraidMeshPreset boot 调用在批填之后、setup* 全部在对应 api 创建之后。
4. **跨批次重接**：4 个已迁模块 deps 全改 presetLibraryApi.X 引用，模块侧使用点不变（shape-presets L88 / branch-sweep L341 / taper-editor L648 / creation-presets L197+L207）。
5. **编码**：两文件 UTF-8 无 BOM、CRLF、非 ASCII 186 vs HEAD 185（+1 = 新模块头注释 em dash；moved 的 U+2212 − 逐字节保留，±1 内）。
6. **语法**：node --check 双文件通过（.mjs 副本权威解析）。
7. **回归**：verify-smoke（assets/presets/layered-side-bun.ahs）10/11，与 HEAD 基线一致（唯一失败为 branch-bridge 内容相关，属已知；修复相对路径前曾为 7/11，定位后恢复）。
