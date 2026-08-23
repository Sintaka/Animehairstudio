# curve-surface / surface-lattice 创建层迁出 — 函数引用图（几何域批次 G4）

> 目标：把 app.js 中 curve-surface（loft surface / controller curve）与 surface-lattice（格子面）的「创建/编辑/装配」层业务函数迁到 `modules/geometry/curve-surface-create.js`（`createCurveSurfaceCreateApi(deps)` 依赖注入），app.js 只保留初始化 + store 装配 + 事件绑定 + 脊柱接线。
> 执行：2026-08-12 · 分支 `0.2.59-refactor` · app.js 32,530 → 31,453 行（净减 1,077 行）
> 行号口径：`devlog/FUNCTION_INDEX.json`（2026-08-11 快照）+ Select-String 对当前 app.js 复核；本文「原行号」= 迁移前 app.js 行号。

## 0. 边界判定（关键）

- **迁移 50 个函数（1,092 行）**，按主题归为 3 个连续块 + 1 个同簇函数：
  - 块 A（controller curve 几何助手）：L9674-9833（10 个）
  - 块 B（curve-surface / loft / surface-lattice 创建与草稿流）：L17790-18708（39 个；`surfaceLatticeNormal` 在盘点区间外 L17790，但被 `createSurfaceLockFromLattice` 直接调用，判定同簇一并迁出）
  - 块 C（surface-lattice 编辑）：L27428-27487（2 个；`scaleSurfaceLatticeWidth` + `resampleSurfaceLock`，两者之间及之后为顶层事件绑定，绑定留 app.js）
- **不迁移（边界存疑，留在 app.js，报回）**：
  1. `createStrandsFromCurveLattice`（L5508-5540）：由 curve-lattice guide 生成 strand locks，属 strand 创建（G1/G3 或 draw B2），非 curve-surface/surface-lattice 创建；Godel 行区间 L5508-5605 计入它，判定不属 G4。
  2. `extendDrawnStrand` / `finishDrawStrandStroke`（L18710/18743）：strand draw 流程（Godel 区间 L17805-18769 的下沿混入），非 G4。
  3. `handleLiveSurfaceChange`（L27346）：纯 UI 事件粘合（draw 光标/动态按钮/scalpBuilder），事件绑定留在 app.js，判定不迁。
  4. `createOutlinerCurveSurface`（L25184-25278）：outliner 渲染（selection-edit / UI 保留区），只改内部对 `activeCurveSurfaceControllerIndex` 的调用为 api 引用。
- **Godel「约 54 个函数」口径差异**：54 = 块 A 10 + 区间 L17805-18769 内 39（含 2 个 strand draw 误计入）+ 块 C 3（含 1 个 UI 粘合误计入）+ `createStrandsFromCurveLattice` 1 + `createOutlinerCurveSurface` 1；净迁出 50，边界存疑 5 个留在 app.js（其中 surfaceLatticeNormal 补入）。

## 1. 迁出函数清单（50，按原行号）

| # | 函数 | 原行号 | 类型 |
|---|---|---|---|
| 1 | curveSurfaceControllerCurves | 9674-9681 | function |
| 2 | curveSurfaceControllerFrameLock | 9683-9728 | function |
| 3 | sampledCurveSurfaceControllerCurves | 9730-9736 | function |
| 4 | sampledCurveSurfaceControllerSides | 9738-9752 | function |
| 5 | activeCurveSurfaceControllerIndex | 9754-9761 | function |
| 6 | curveSurfaceControllerPointRange | 9763-9772 | function |
| 7 | curveSurfaceControllerPreviewRows | 9774-9780 | function |
| 8 | curveSurfaceControllerSegments | 9782-9790 | function |
| 9 | curveSurfaceControllerIndexNearPoint | 9792-9810 | function |
| 10 | curveSurfaceControllerHitFromEvent | 9812-9833 | function |
| 11 | surfaceLatticeNormal | 17790-17803 | function |
| 12 | createSurfaceLockFromLattice | 17805-17868 | function |
| 13 | createViewportSurface | 17870-17897 | function（已退役 stub，return null；体内引用全在不可达代码，deps 照常注入） |
| 14 | loftSurfaceProfilePoints | 17899-17903 | function |
| 15 | hideLoftSurfacePreviews | 17905-17910 | function |
| 16 | updateLoftSurfaceDraftUi | 17912-17919 | function |
| 17 | updateLoftSurfacePreview | 17921-17951 | function |
| 18 | resetLoftSurfaceDraft | 17953-17967 | function |
| 19 | cancelLoftSurfaceDraft | 17969-17985 | function |
| 20 | cloneCurveSurfaceSource | 17987-18007 | function |
| 21 | curveSurfaceSourceForSnapshot | 18009-18033 | function |
| 22 | mirroredCurveSurfaceSource | 18035-18043 | function |
| 23 | curveSurfaceProfilePoints | 18045-18047 | function |
| 24 | curveSurfaceProfileNormals | 18049-18056 | function |
| 25 | curveSurfacePreviewLock | 18058-18079 | function |
| 26 | curveSurfaceCardWireSegments | 18081-18095 | function |
| 27 | hideCurveSurfacePreview | 18097-18107 | function |
| 28 | curveSurfaceCurveAverageX | 18109-18112 | function |
| 29 | curveSurfaceCurvesMatch | 18114-18121 | function |
| 30 | unifiedMirroredCurveSurface | 18123-18159 | function |
| 31 | curveSurfaceSideVector | 18161-18172 | function |
| 32 | curveSurfaceDraftCurves | 18174-18180 | function |
| 33 | curveSurfaceFallbackHit | 18182-18193 | function |
| 34 | updateCurveSurfaceDraftUi | 18195-18213 | function |
| 35 | updateCurveSurfacePreview | 18215-18275 | function |
| 36 | resetCurveSurfaceDraft | 18277-18297 | function |
| 37 | cancelCurveSurfaceDraft | 18299-18312 | function |
| 38 | beginCurveSurfaceStroke | 18314-18360 | function |
| 39 | curveSurfaceStrokeEvent | 18362-18395 | function |
| 40 | updateCurveSurfaceStroke | 18397-18427 | function |
| 41 | finishCurveSurfaceStroke | 18429-18485 | function |
| 42 | confirmCurveSurfaceDraft | 18487-18562 | function |
| 43 | commitCurveSurfaceDraft | 18564-18567 | function |
| 44 | loftSurfaceSampleFromHit | 18569-18576 | function |
| 45 | beginLoftSurfaceStroke | 18578-18610 | function |
| 46 | beginLoftSurfaceFreePlane | 18612-18621 | function |
| 47 | updateLoftSurfaceStroke | 18623-18651 | function |
| 48 | finishLoftSurfaceStroke | 18653-18708 | function |
| 49 | scaleSurfaceLatticeWidth | 27428-27441 | function |
| 50 | resampleSurfaceLock | 27443-27487 | function |

## 2. 外部调用点改写（54 处，均改 `curveSurfaceCreate.X`）

| 原行号 | 函数 | 说明 |
|---|---|---|
| 5408 / 5409 | loftSurfaceProfilePoints / loftSurfaceSampleFromHit | guideDeps 批填：改为 `X: curveSurfaceCreate.X`（跨批次重接，guide-system.js 内 `deps.loftSurfaceProfilePoints`/`deps.loftSurfaceSampleFromHit` 不变） |
| 13247 | curveSurfaceControllerCurves | createProjectSaveApi deps（project-files.js 内 `deps.curveSurfaceControllerCurves` 不变）：改 `curveSurfaceControllerCurves: curveSurfaceCreate.curveSurfaceControllerCurves` |
| 5767/5768/5831/5832 | cancelLoftSurfaceDraft/cancelCurveSurfaceDraft/resetLoftSurfaceDraft/resetCurveSurfaceDraft | setActiveTool 内 |
| 7039/7359/7414 | curveSurfaceControllerPointRange | applyProportionalMove / applyHierarchicalRotate / applyProportionalRotate |
| 9844/9845 | sampledCurveSurfaceControllerCurves / Sides | createConnectedCurveCardGeometry |
| 9929 | curveSurfaceControllerFrameLock | createCompoundStrandGeometry |
| 12036 | cloneCurveSurfaceSource | 同步/恢复数据管线 |
| 12194/12382 | mirroredCurveSurfaceSource | mirror 数据管线（脊柱留 app.js，改调 api） |
| 12502 | updateCurveSurfacePreview | setMirrorXEditing |
| 12600 | curveSurfaceSourceForSnapshot | snapshotState（脊柱留 app.js） |
| 13732 | cloneCurveSurfaceSource | restoreLock（脊柱留 app.js） |
| 20415 | curveSurfaceControllerSegments | updateCurveObjects |
| 20466/20539 | activeCurveSurfaceControllerIndex | updateCurveObjects |
| 20863/20925/20991 | curveSurfaceControllerFrameLock | curveFrameAtPoint / curveFrameAtSnapshot / twistFromHandle |
| 21805 | scaleSurfaceLatticeWidth | setStrandWidthDimension |
| 25190 | activeCurveSurfaceControllerIndex | createOutlinerCurveSurface（函数本身不迁，仅调用改 api） |
| 27100 | createViewportSurface | 工具按钮 handler |
| 27117/27119/27121/27124 | resetLoftSurfaceDraft/commitCurveSurfaceDraft/resetCurveSurfaceDraft/updateCurveSurfacePreview | updateSelectedTaperPoint 内事件绑定（值引用/调用） |
| 27348/27349 | resetCurveSurfaceDraft/resetLoftSurfaceDraft | handleLiveSurfaceChange（函数不迁，调用改 api） |
| 27496 | resampleSurfaceLock | surfaceLatticeColumns/Rows input handler |
| 27540 | scaleSurfaceLatticeWidth | panelShapeInputs handler |
| 28988/28990/28994/28995/28999 | cancelLoftSurfaceDraft/resetLoftSurfaceDraft/finishCurveSurfaceStroke/cancelCurveSurfaceDraft/commitCurveSurfaceDraft | createCurveLatticeGuideFromUi 键盘 handler |
| 31810/31813 | updateCurveSurfaceStroke/updateLoftSurfaceStroke | 顶层 pointermove 绑定（值引用） |
| 31836/31837/31840 | finishLoftSurfaceStroke/finishCurveSurfaceStroke | 顶层 pointerup 绑定 |
| 31872/31873/31874 | finishLoftSurfaceStroke/finishCurveSurfaceStroke | 顶层 pointercancel 绑定 |
| 32137/32139/32144 | curveSurfaceFallbackHit/beginCurveSurfaceStroke/beginLoftSurfaceStroke | handleViewportPointerDown |
| 32185/32285 | curveSurfaceControllerHitFromEvent | handleViewportPointerDown（选择分支） |

## 3. deps 注入清单（55）

- **store 代理（`.state`）**：`sculptState`、`miscState`、`sel` —— app.js 批填 `sculptState: sculptState.state` / `miscState: miscState.state` / `sel: sel.state`，模块内 `deps.X.y`（禁止 `deps.X.state.y`）。
- **共享对象/常量**：`renderer`、`raycaster`、`panelCreationDefaults`、`scalpBuilder`（整个 api 对象，模块内 `deps.scalpBuilder.scalpRegionNearestWorldPoint(...)`）、`STRAIGHT_CUT_PANEL_CURVE`。
- **DOM 元素**：`curveSurfaceDraftGroup`、`curveSurfaceDraftMesh`、`curveSurfaceDraftStatus`、`curveSurfaceStripWidthInput`、`loftHorizontalPreview`、`loftHorizontalStep`、`loftSurfaceGridPreview`、`loftVerticalPreview`、`loftVerticalStep`、`confirmCurveSurfaceDraftButton`、`resetCurveSurfaceDraftButton`、`resetLoftSurfaceDraftButton`。
- **app.js helper 函数（39）**：`activeStrokeDynamicEnabled`、`activeStrokeSurfaceValue`、`addLock`、`contextualPlaneAtOrigin`、`createHairGeometry`、`drawClumpSampleNormal`、`drawSurfaceHitFromEvent`、`getSelectedLock`、`outwardNormalAtPoint`、`processedDrawStroke`、`pushUndoState`、`rayFromViewportEvent`、`rebuildCurveObjects`、`renderLockList`、`selectLock`、`setActiveTool`、`strandGeometryFrameAt`、`strokeLength`、`strokeSurfaceIsContextual`、`strokeSurfaceNormals`、`syncActiveMirror`、`updateAttributeEditorMode`、`updateCount`、`updateCurveObjects`、`updateInteractionLocks`、`updateLockGeometry`、`updatePlacementStatus`、`updateTopologyStats`、`vectorToData`、`viewPlaneNormal`、`worldNormalAtHit` + createViewportSurface 不可达代码内的 4 个（`exitSetupEditors`、`finishDrawStrandStroke`、`finishPlacementFlow`、`setViewportEditMode`）。
- **模块级 import（不注入）**：`THREE`；`curve-surface.js`（`buildConnectedCurveCardGrid`、`buildCurveSurfaceGrid`、`curveSurfaceControllerSideDirections`、`curveSurfaceControlPointCount`、`curveSurfaceLineLength`、`DEFAULT_CURVE_SURFACE_ROWS`、`DEFAULT_CURVE_SURFACE_STRIP_WIDTH`、`resampleCurveSurfaceLine`）；`surface-lattice.js`（`createLoftSurfaceLatticePointData`、`createSurfaceLatticePointData`、`DEFAULT_SURFACE_LATTICE_COLUMNS`、`DEFAULT_SURFACE_LATTICE_ROWS`、`normalizeSurfaceLatticeCount`、`resampleSurfaceLatticePointData`、`surfaceLatticePointIndex`、`surfaceLatticeWireSegments`）；`curve-math.js`（`eightWayScreenDelta`）；`app-config.js`（`DEFAULT_HAIR_COLOR`）。

## 4. api 创建 / 批填时序（引导期审计）

- `curveSurfaceCreateDeps = {}` + `curveSurfaceCreate = createCurveSurfaceCreateApi(curveSurfaceCreateDeps)`：紧跟 guideApi 创建（原 L1510 后）。
- 批填 `Object.assign(curveSurfaceCreateDeps, {...})`：紧跟 `resetLoftSurfaceDraftButton`（原 L2397 后）——**批填生效行 = `});`（现 L2462）**，此时所有 dep 已定义（最后一个是 `resetLoftSurfaceDraftButton`）。
- 引导期无 G4 api 调用早于批填：app.js 内最早 `curveSurfaceCreate.` 引用为现 L5473（guideDeps 批填），其后为 fileApi（现 L13151）、顶层 pointer 绑定（现 L30733+）、boot 调用 `applyDisplayVisibilityFilters()`（现 L30712，→renderLockList→createOutlinerCurveSurface→`curveSurfaceCreate.activeCurveSurfaceControllerIndex`）与 `renderLockList()`（现 L31391）。全部在 2462 之后。
- 函数声明（hoist）使批填引用 helper 函数值安全；DOM/const 均在 2397 前定义。

## 5. 跨批次重接

- guide-system.js：`deps.loftSurfaceProfilePoints`（L1293）、`deps.loftSurfaceSampleFromHit`（L1309/1335）——app.js guideDeps 改填 `curveSurfaceCreate.X`。
- project-files.js：`deps.curveSurfaceControllerCurves`（L136/219）——app.js fileApi deps 改填 `curveSurfaceCreate.curveSurfaceControllerCurves`。
- scalp-builder.js / strand-sweep.js / branch-* 等其它模块：扫描无 G4 函数名引用。

## 6. 踩坑记录（批次 4/5 教训的 G4 复现）

1. **spread `...name` 是裸引用**：`[...sculptState.state.curveSurfaceDraft.curves, ...]` 中 `sculptState` 前是 `..`，首版转换器误判为属性访问漏改，产生 `deps.X.state` 双代理隐患；修复：标识符前两字符为 `..` 时按裸引用处理。
2. **模板字符串插值 `${...}` 是代码**：`lock.name = \`... ${sel.state.lockIndex}\`` 中插值内 `sel.state` 需改写为 `deps.sel`；且插值花括号深度必须从 `${` 的 `{` 起算（首版深度 +1 后把闭合 `}` 算成 1 层导致吞掉后续整段代码）。
3. **三元 `?` 不是可选链**：`cond ? drawClumpSampleNormal(...) : ...` 中 `?` 后标识符被误判为 `?.` 属性访问而漏改；可选链只需检查标识符前一字符是否为 `.`。
4. **FUNCTION_INDEX 陈旧条目**：索引含 `columns`（实为 `addLongLayeredCurlsPreset` 内局部箭头 const，L14455），静态扫描报 1 个「全局泄漏」为误报；已人工核对该名在模块内均为局部（param/const），非真实裸引用。
5. **模块生成必须基于迁移前原 app.js**：spread 修复后误用已删块的 app.js 重新生成导致错位（span 指向其它函数）；改为从 git HEAD 提取原文件生成，round-trip 50/50 逐字节一致。

## 7. 验证结果

1. 裸引用静态扫描：模块内每个 app.js 顶层函数/const/let + import 绑定名 → **0 真实裸引用**（唯一命中 `columns` 为陈旧索引误报，见 §6.4）。
2. app.js import 绑定扫描：模块所需的纯模块名（curve-surface.js / surface-lattice.js / curve-math.js / app-config.js）全部模块级 import；无漏。
3. store 代理 .state：模块内无 `deps.X.state` 残留；`...deps.sculptState...` spread 用例正确。
4. 时序审计：批填生效行 2462，早于全部 `curveSurfaceCreate.` 引用（最早 5473）与 boot 调用（30712/31391）。
5. 跨批次重接：guideDeps（5408/5409→5473/5474）、fileApi（13247→13151）两处改 `curveSurfaceCreate.X`。
6. 编码：app.js / 新模块均 UTF-8 无 BOM、CRLF；中文逐字节守恒（app.js 非 ASCII 1476→1476，模块 0）。
7. 语法：`node --check` app.js 与新模块均通过；round-trip 50/50 与原函数逐字节一致（正向转换后）。