# radial menu（径向菜单）迁出 — 函数引用图（批次 A2）

> 目标：把 app.js 中「径向菜单 UI/交互（打开/关闭、按钮布局、指针命中、拖拽选择、工具/设置分配、菜单项构建）」业务层迁到 `modules/geometry/radial-menu.js`（`createRadialMenuApi(deps)` 依赖注入），app.js 只保留初始化 + store 装配 + 事件绑定 + 脊柱接线。
> 只读盘点：2026-08-12 · 分支 `0.2.59-refactor` · **app.js 快照 22,689 行**（FUNCTION_INDEX.json 生成 2026-08-12T10:43Z、口径 22,690 行，一致；git status 无 app.js 改动）。本报告行号以 FUNCTION_INDEX + 直接 grep 为准。
> 范围对照：appjs-slim-remaining-plan.md A2 行（Godel 旧区间 L23107-24336，32,530 行口径）→ 当前两个物理簇 = **L15366-16600**（strand radial L15366-16035 + tool radial L16045-16600 与 L16547-16600），夹层 L16037-16043 `setPullMoveEnabled` 与 L16168-16546 preferences 簇**不迁**。

## 0. 边界判定（关键）

- **迁出 37 个顶层函数 + 3 个顶层 const（~850 毛行）**，全部自洽、无模块侧引用：
  - 簇 S strand radial（26）：L15366-16035（hideStrandRadialMenu → blockPointerDuringStrandRadialGesture）
  - 簇 T tool radial（11）：L16045-16166（toolRadialOptions → setRadialMenusEnabled）+ L16547-16600（updateToolRadialGesture → cancelToolRadialGesture）
  - const：`MAX_RADIAL_OPTIONS` L15408、`MAX_RADIAL_SUBMENU_OPTIONS` L15409、`STANDARD_RADIAL_FRAME_DIMENSIONS` L15410-15414
- **不迁移（夹在区间内，留在 app.js）**：
  1. `setPullMoveEnabled` L16037-16043 — 设置/脊柱（touch `pullMoveInput` DOM + `transformControls` + `setActiveTool("move")`），被 L19216 pullMoveInput change 绑定直接调用，本批仅 `performToolRadialAction` 调用 → 作 deps 注入。
  2. preferences 簇 L16168-16546（setProceduralDrawExperimentalEnabled → cancelPreferencesDialog，~378 行）— 与 radial 同排但属「prefs-appconfig」域，计划不拆；其中 `cancelPreferencesDialog` L16520 反向调用 `setRadialMenusEnabled` → 迁出后改 api 引用。
  3. `strandRadialMenu`/`toolRadialMenu` 等 DOM const（L2351-2360）与初始化 L2352/L2357（`hairState.state.strandRadialActions = [...strandRadialMenu.querySelectorAll(...)]` 等）— 留在 app.js 作为 deps 注入（L18215/18218 外点判定仍需 DOM 引用）。
- **已迁走核实**：radial-layout.js 6 个纯函数（layoutRadialOptions/partitionRadialOptions/radialButtonEntryDistance/radialListCorridorContains/radialButtonRayExtent/radialMenuDimensions）已迁出，本批直接 import；hair-store.js/misc-store.js/ui-store.js 已含 `strandRadialGesture/strandRadialActions/strandRadialTargetId/toolRadialGesture/toolRadialActions/toolShortcutPress/radialMenusEnabled` 状态字段，无需新增 store。
- **脊柱边界**：`setActiveTool`（beginToolShortcutPress 调用）、`updateInteractionLocks`（开/关/取消手势 6 处调用）、`setViewportEditMode/setViewportSelectionMode`（tool/strand radial action 分派）均为 app.js 脊柱，作 deps 注入，不随本批。pointer 事件层（keydown/keyup/blur/pointermove/pointerdown 监听）全部留 app.js，内部改 `radialMenuApi.*`。

## 1. 迁出函数清单（37，按快照行号）

### 簇 S — strand radial（L15366-16035，26 函数）
| # | 函数 | 行号 | 外部调用（函数体外） |
|---|---|---|---|
| 1 | hideStrandRadialMenu | 15366-15375 | 10866（resetTransientInteractionsForStateRestore）、16018/16026（内部 finish/cancel） |
| 2 | ensureRadialButtonCapacity | 15377-15388 | 15759/16089（内部） |
| 3 | radialButtonDimensions | 15390-15397 | 15400/15426/15445（内部） |
| 4 | radialMenuDimensionsForKind | 15399-15406 | 15417/15852（内部） |
| 5 | applyRadialMenuDimensions | 15416-15420 | 15767/16096（内部） |
| 6 | strandRadialSubmenuEntryDistance | 15422-15433 | 15904（内部） |
| 7 | configureRadialSubmenuIndicator | 15435-15454 | 15776/15784（内部） |
| 8 | selectionSetMembershipRadialOptions | 15456-15471 | 15598（内部） |
| 9 | selectionSetRadialMenuOption | 15473-15480 | 15621/15637/15650（内部） |
| 10 | selectedMirrorRadialOptions | 15482-15502 | 15631/15648（内部） |
| 11 | strandVisibilityRadialOptions | 15504-15520 | 15537/15624/15643/15653（内部） |
| 12 | clumpMirrorRadialOptions | 15522-15527 | 15619（内部） |
| 13 | contextualRadialOptions | 15529-15656 | 15663/15848（内部） |
| 14 | sharedRadialFrameDimensions | 15658-15660 | 15813/16096（内部） |
| 15 | layoutContextualRadialOptions | 15662-15684 | 15803/15834/15853（内部） |
| 16 | renderRadialActionList | 15686-15702 | 15766/16097（内部） |
| 17 | radialListOptionAtPointer | 15704-15724 | 15879/16554（内部，跨簇共用） |
| 18 | syncRadialListHighlight | 15726-15730 | 15898/16569（内部，跨簇共用） |
| 19 | configureContextualRadialMenu | 15732-15790 | 15815/15863（内部） |
| 20 | beginStrandRadialGesture | 15792-15824 | **20793（Space keydown）** |
| 21 | enterStrandRadialSubmenu | 15826-15870 | 15906（内部） |
| 22 | updateStrandRadialGesture | 15872-15909 | **21953（window pointermove 监听）** |
| 23 | performStrandRadialAction | 15911-16012 | 16020（内部） |
| 24 | finishStrandRadialGesture | 16014-16022 | **20871（Space keyup）** |
| 25 | cancelStrandRadialGesture | 16024-16029 | 16162（内部 setRadialMenusEnabled）、**18216/20601/20642/20896** |
| 26 | blockPointerDuringStrandRadialGesture | 16031-16035 | **22064（renderer pointerdown 监听）** |

### 簇 T — tool radial（L16045-16600，11 函数）
| # | 函数 | 行号 | 外部调用（函数体外） |
|---|---|---|---|
| 27 | toolRadialOptions | 16045-16068 | 16085（内部） |
| 28 | hideToolRadialMenu | 16070-16081 | **10867**（resetTransientInteractionsForStateRestore）、16589/16597（内部） |
| 29 | beginToolRadialGesture | 16083-16121 | 16133（内部 beginToolShortcutPress） |
| 30 | beginToolShortcutPress | 16123-16136 | **20841（keydown）** |
| 31 | finishToolShortcutPress | 16138-16145 | **20866（keyup）** |
| 32 | cancelToolShortcutPress | 16147-16153 | 16160（内部）、**20605/20643/20897** |
| 33 | setRadialMenusEnabled | 16155-16166 | **10570**（loadPreferencesAndPresets）、**16520**（cancelPreferencesDialog）、**19796**（bootstrap）、**20015**（radialMenusPreferenceInput change） |
| 34 | updateToolRadialGesture | 16547-16574 | **21954（window pointermove 监听）** |
| 35 | performToolRadialAction | 16576-16584 | 16591（内部） |
| 36 | finishToolRadialGesture | 16586-16593 | 16143（内部 finishToolShortcutPress） |
| 37 | cancelToolRadialGesture | 16595-16600 | 16151/16161（内部）、**18219/20644** |

> 附：3 个顶层 const `MAX_RADIAL_OPTIONS`(15408)/`MAX_RADIAL_SUBMENU_OPTIONS`(15409)/`STANDARD_RADIAL_FRAME_DIMENSIONS`(15410-15414) 随模块迁出。

## 2. 内部互调图（簇内/跨簇）

- 布局/尺寸：radialMenuDimensionsForKind→radialButtonDimensions；applyRadialMenuDimensions→radialMenuDimensionsForKind；strandRadialSubmenuEntryDistance→radialButtonDimensions；configureRadialSubmenuIndicator→radialButtonDimensions；sharedRadialFrameDimensions→(STANDARD_RADIAL_FRAME_DIMENSIONS)；layoutContextualRadialOptions→contextualRadialOptions + import(partitionRadialOptions/layoutRadialOptions)
- 菜单项构建：contextualRadialOptions→selectionSetRadialMenuOption/clumpMirrorRadialOptions/selectedMirrorRadialOptions/strandVisibilityRadialOptions/selectionSetMembershipRadialOptions
- 渲染/命中：configureContextualRadialMenu→ensureRadialButtonCapacity/renderRadialActionList/applyRadialMenuDimensions/configureRadialSubmenuIndicator；updateStrandRadialGesture→radialListOptionAtPointer/syncRadialListHighlight/strandRadialSubmenuEntryDistance/enterStrandRadialSubmenu；updateToolRadialGesture→radialListOptionAtPointer/syncRadialListHighlight（跨簇共用）
- 手势生命周期：beginStrandRadialGesture→layoutContextualRadialOptions/sharedRadialFrameDimensions/configureContextualRadialMenu；enterStrandRadialSubmenu→contextualRadialOptions/layoutContextualRadialOptions/radialMenuDimensionsForKind/configureContextualRadialMenu；finishStrandRadialGesture→hideStrandRadialMenu/performStrandRadialAction；cancelStrandRadialGesture→hideStrandRadialMenu
- tool：beginToolRadialGesture→toolRadialOptions/ensureRadialButtonCapacity/applyRadialMenuDimensions/sharedRadialFrameDimensions/renderRadialActionList + import(partitionRadialOptions/layoutRadialOptions)；beginToolShortcutPress→setActiveTool/beginToolRadialGesture；finishToolShortcutPress→finishToolRadialGesture；cancelToolShortcutPress→cancelToolRadialGesture；setRadialMenusEnabled→cancelToolShortcutPress/cancelToolRadialGesture/cancelStrandRadialGesture；finishToolRadialGesture→hideToolRadialMenu/performToolRadialAction；cancelToolRadialGesture→hideToolRadialMenu

## 3. 外部调用点（22 处，全部在 app.js 事件层/初始化/脊柱，迁出后改 `radialMenuApi.X`）

| 行号 | 函数 | 所在上下文 |
|---|---|---|
| 10570 | setRadialMenusEnabled | loadPreferencesAndPresets（preferences 导入恢复） |
| 10866 | hideStrandRadialMenu | resetTransientInteractionsForStateRestore |
| 10867 | hideToolRadialMenu | resetTransientInteractionsForStateRestore |
| 16520 | setRadialMenusEnabled | cancelPreferencesDialog（快照回滚） |
| 18216 | cancelStrandRadialGesture | document pointerdown（菜单外点击） |
| 18219 | cancelToolRadialGesture | document pointerdown（菜单外点击） |
| 19796 | setRadialMenusEnabled | bootstrap 初始化 |
| 20015 | setRadialMenusEnabled | radialMenusPreferenceInput change 绑定 |
| 20601 | cancelStrandRadialGesture | window keydown Escape |
| 20605 | cancelToolShortcutPress | window keydown Escape |
| 20642 | cancelStrandRadialGesture | window keydown 快捷键切换前 |
| 20643 | cancelToolShortcutPress | window keydown 快捷键切换前 |
| 20644 | cancelToolRadialGesture | window keydown 快捷键切换前 |
| 20793 | beginStrandRadialGesture | window keydown Space |
| 20841 | beginToolShortcutPress | window keydown 工具快捷键（select/move/rotate/scale） |
| 20866 | finishToolShortcutPress | window keyup |
| 20871 | finishStrandRadialGesture | window keyup Space |
| 20896 | cancelStrandRadialGesture | window blur |
| 20897 | cancelToolShortcutPress | window blur |
| 21953 | updateStrandRadialGesture | window pointermove 监听（capture） |
| 21954 | updateToolRadialGesture | window pointermove 监听（capture） |
| 22064 | blockPointerDuringStrandRadialGesture | renderer.domElement pointerdown 监听（capture） |

> 附：L20650 `if (miscState.state.toolRadialGesture)`、L18215/18218 菜单外点击判定读 `strandRadialMenu/toolRadialMenu` DOM —— 为 state/DOM 直读，store 代理与 DOM const 留 app.js，无需重接。模块侧（modules/*）对本批函数名**零引用**（已全量 grep），无跨模块重接负担。

## 4. deps 清单（createRadialMenuApi 注入）

### 模块级可直接 import（不注入）
- `./radial-layout.js`：layoutRadialOptions、partitionRadialOptions、radialButtonEntryDistance、radialListCorridorContains、radialButtonRayExtent、radialMenuDimensions（6 个，与 app.js 现 import 相同）
- `./mirror-selection.js`：mirrorSelectionTargets（app.js 现 import；selectedMirrorRadialOptions/performStrandRadialAction 使用）
- 无 THREE / app-config 依赖（本批函数体未引用）。

### store .state 代理（5 个）
- hairState.state（strandRadialGesture/strandRadialActions/strandRadialTargetId）
- miscState.state（toolRadialGesture/toolRadialActions/toolShortcutPress）
- sel.state（activeTool/selectedStrandGroup/clumpViewportSelection/selectedStrandIds）
- sculptState.state（duplicatePlacement/viewPlaneMoveEnabled/pullMoveEnabled/viewportEditMode）
- ui.state（radialMenusEnabled）

### 数据数组 / 可变对象
- locks（performStrandRadialAction）、selectionSets（菜单项构建）
- lastPointer（L1964，beginStrandRadialGesture/beginToolRadialGesture 用 `{x,y}`）

### DOM 元素（10 个）
- strandRadialMenu/strandRadialActionList/strandRadialLine/strandRadialCenter
- toolRadialMenu/toolRadialActionList/toolRadialLine/toolRadialCenter
- radialMenusPreferenceInput、radialShortcutRows（setRadialMenusEnabled）、drawSurfaceDynamicButton（performStrandRadialAction 触发 change）

### 已迁模块 api 对象（3 个，传整对象）
- drawFlowApi：refreshLiveSurfaceOptions/activeStrokeSurfaceInput/drawSurfaceDynamicEnabled/setDrawSurfaceDynamicEnabled/setActiveStrokeSurfaceValue
- presetLibraryApi：createCustomClumpPreset
- guideApi：getSelectedGuide

### app.js 顶层函数（43 个，函数声明已提升，可提前注入）
- 菜单项判定：selectionSetCanEditFromSelection(15142)、selectedLocksInOrder(14727)、mirrorPartnerFor(9525)、hiddenStrandsExist(5106)、mirroredClumpPartners(9638)、lockedStrandsExist(5102)、clumpGuideForLock(11605)、getSelectedLock(14723)、strandIsolationActive(5129)、selectionCanBecomeClump(15105)、selectedProceduralDuplicateSources(16643)、selectedReferenceImage(3696)
- 手势/脊柱：hideOutlinerContextMenu(15254)、updateInteractionLocks(6071)、setViewportEditMode(4324)、setViewportSelectionMode(4312)、setActiveTool(5724)
- action 分派（performStrandRadialAction）：createClumpFromSelection(15110)、lockSelectedStrands(14766)、unlockAllStrands(14787)、hideSelectedStrands(5110)、unhideHiddenStrands(5120)、createSelectionSetFromSelection(15127)、editSelectionSetFromSelection(15151)、openProceduralDuplicateDialog(16679)、toggleSelectedStrandIsolation(5145)、deleteSelectedStrands(15190)、pushUndoState(10810)、createMirrorPartner(9537)、updateCount(17861)、selectLock(13920)、decoupleMirrorPartner(9529)、renderLockList(17707)、createMirroredClump(9644)、decoupleMirroredClump(9666)、dissolveClump(12023)、outlinerClumpLocks(17330)、deleteLocks(20915)、beginDuplicatePlacement(17162)
- tool radial action（performToolRadialAction）：setObjectSpaceEditing(5872)、setViewPlaneMove(7092)、setPullMoveEnabled(16037)
- 偏好：saveBooleanPreference(309)

### 常量（1 个）
- RADIAL_MENUS_PREFERENCE_KEY（L285，setRadialMenusEnabled persist 用）

> 注：deps 传 `.state` 代理（`hairState: hairState.state` 等），模块内 `deps.hairState.strandRadialGesture`，禁止 `deps.hairState.state.x`（模板第 4 条）。

## 5. 硬障碍 / 边界存疑点

1. **__AHS_TEST_SEAM（当前 L22633-22688）**：暴露的钩子与本批函数**零交集**（无任何 radial 函数），不构成障碍；移除本批 ~850 行后行号前移 ~850，执行时需重新锚定（verify-tip-select.mjs 不引用本批）。
2. **脊柱边界**：`setActiveTool`/`updateInteractionLocks`/`setViewportEditMode`/`setViewportSelectionMode` 留 app.js 注入；**不要**把 pointer 大 handler（keydown L20565+、keyup L20847、blur L20886、pointermove L21950+、renderer pointerdown L22056+）迁入模块——含大量非 radial 分支（reference/scalp/poly/brush 等）。
3. **draw-flow 边界**：`drawFlowApi` 方法均已存在（draw-flow.js L1403-1415 导出），本批只传对象不重接；`drawSurfaceDynamicButton` 另被 drawFlowDeps L9111 / presetLibraryDeps L10526 / L14228/L19418-19429 使用，留 app.js。
4. **placement 边界**：`beginDuplicatePlacement`(17162) 仍为 app.js 函数（placement.js 已迁的只是放置流程），作 deps 注入；`sculptState.state.duplicatePlacement` 直接读 state，双方手势互斥判定（beginStrand/beginTool 内）随模块走。
5. **引导期时序**：`createRadialMenuApi` 提前创建（空 deps），Object.assign 批填必须在最后依赖 const 定义后（`drawSurfaceDynamicButton` L2568 之后）且早于 bootstrap `setRadialMenusEnabled` L19796；函数声明已提升无 TDZ。
6. **跨批次重接（待办，非本批阻塞）**：
   - A3 procedural duplicate 迁出后：`openProceduralDuplicateDialog`(16679)/`selectedProceduralDuplicateSources`(16643) → 改 proceduralDuplicateApi.*；
   - A4 reference+head 迁出后：`selectedReferenceImage`(3696) → 改 referenceApi.*（reference-head-refactor-map.md 第 20 行已列 selectedReferenceImage 为 R1 迁出）；
   - 夹层 selection/outliner 脊柱（setViewportEditMode/setViewportSelectionMode）明确不迁，保持注入。
7. **存疑点**：
   - `setRadialMenusEnabled` 既做偏好持久化（saveBooleanPreference/RADIAL_MENUS_PREFERENCE_KEY）又做菜单状态（radialShortcutRows DOM + 取消手势）——随本批迁出，app.js 保留 4 个外部调用点改 api；偏好初始化 L10570/L19796/L20015 不拆。
   - `beginToolShortcutPress/finishToolShortcutPress/cancelToolShortcutPress` 3 函数是否并入本批：它们由 tool 快捷键 hold 触发 tool radial，与 beginToolRadialGesture/finishToolRadialGesture/cancelToolRadialGesture 强耦合，**建议并入**（本报告按并入计，37 函数）；若坚持只迁「菜单」本身则少 3 函数、但外部调用点仍为 22（20841/20866/20605/20643/20897 改回直调 app.js 内三函数，不划算）。
   - 行数口径：毛行 ~850（函数体 804 + const 7 + 行间空行），app.js 净减 ~800（扣模块样板 ~50）；计划 A2 估 36 函数/~830/净减 ~650 为 32.5k 行旧口径，差异在统计方式，非漏项。
   - 全部 37 函数体已用括号配对提取核对，无内联箭头缺漏（FUNCTION_INDEX 只列顶层函数；本批无顶层 const 箭头函数）。

## 6. 建议

- **模块文件名**：`modules/geometry/radial-menu.js`（与 radial-layout.js 同目录、直接相对 import；沿用 draw-flow.js/placement.js「UI 模块放 geometry/」惯例）。备选 `modules/ui/radial-menu.js`（新目录，无既有先例，需同步 organize-modules.js）。
- **装配点**：
  - 创建：在既有 api const 群（L1503-1543 附近，placementApi 之后）加 `const radialMenuDeps = {}; const radialMenuApi = createRadialMenuApi(radialMenuDeps);`
  - 批填：放在 `drawSurfaceDynamicButton`（L2568）之后、bootstrap 调用 L19796 之前，Object.assign(radialMenuDeps, { 见 §4 });
  - 22 个外部调用点改 `radialMenuApi.X`；事件绑定/初始化/脊柱代码留 app.js。
- **难度**：低。极低耦合、自洽、零模块侧引用、无测试 seam 依赖；主要工作量 = 22 处改 api 引用 + deps 批填（43 函数 + 5 store 代理 + 10 DOM + 3 api 对象）。
- **净减行估算**：app.js -850 毛行 / 净减 ~800；模块 +~900（含 createApi 样板 ~50）。
- **回归**：node --check 双文件 + verify-smoke（基线 10/11）+ 手工冒烟（Space 呼出 strand radial、按住 select/move/rotate/scale 快捷键呼出 tool radial、Esc/blur/菜单外点击取消、Preferences 开关）。

---

## 执行记录（2026-08-12 · 批次 A2 完成）

> 基于 21,400 行 app.js 实际执行（bb16d15 之后）。行号按当前文件重新定位，与上文快照 22,689 行不同。

### 1. 实际迁出内容

- **37 个顶层函数**（簇 S strand radial 26 + 簇 T tool radial 11）+ **3 个顶层 const**（MAX_RADIAL_OPTIONS/MAX_RADIAL_SUBMENU_OPTIONS/STANDARD_RADIAL_FRAME_DIMENSIONS）迁到 `modules/geometry/radial-menu.js`（913 行）。
- 实际摘取区间（1-based，按执行时 app.js）：
  - 簇 S：L14092-14761（hideStrandRadialMenu → blockPointerDuringStrandRadialGesture，670 行，含 3 const 于 L14134-14140）
  - 簇 T 前段：L14771-14892（toolRadialOptions → setRadialMenusEnabled，122 行）
  - 簇 T 后段：L15264-15317（updateToolRadialGesture → cancelToolRadialGesture，54 行）
  - 合计 846 行函数/const 代码 + 3 行前导空行 = 849 行移除。
- **app.js：21,400 → 20,631 行（净减 769）**：-849（移除）+80（import 1 + api 创建 5+空行 1 + deps 批填 72+空行 1）。
- 夹层 `setPullMoveEnabled`（原 L14763-14769）与 preferences 簇（setProceduralDrawExperimentalEnabled → cancelPreferencesDialog）**未迁**，留在 app.js。
- 模块导出仅 `createRadialMenuApi(deps)`，无 seam 重导出；模块侧零 THREE/app-config 依赖（直接 import radial-layout.js 6 纯函数 + mirror-selection.js mirrorSelectionTargets）。

### 2. 22 处外部调用点改写（→ radialMenuApi.X）

| 原行(22,689 快照) | 执行时行 | 函数 | 上下文 |
|---|---|---|---|
| 10570 | 9395 | setRadialMenusEnabled | loadPreferencesAndPresets |
| 10866 | 9691 | hideStrandRadialMenu | resetTransientInteractionsForStateRestore |
| 10867 | 9692 | hideToolRadialMenu | resetTransientInteractionsForStateRestore |
| 16520 | 14523 | setRadialMenusEnabled | cancelPreferencesDialog（preferences 簇留 app.js，反向调用改 api） |
| 18216 | 16164 | cancelStrandRadialGesture | document pointerdown 菜单外点击 |
| 18219 | 16167 | cancelToolRadialGesture | document pointerdown 菜单外点击 |
| 19796 | 17744 | setRadialMenusEnabled | bootstrap 初始化（顶层 init） |
| 20015 | 17963 | setRadialMenusEnabled | radialMenusPreferenceInput change |
| 20601 | 18543 | cancelStrandRadialGesture | window keydown Escape |
| 20605 | 18547 | cancelToolShortcutPress | window keydown Escape |
| 20642 | 18584 | cancelStrandRadialGesture | window keydown 快捷键切换前 |
| 20643 | 18585 | cancelToolShortcutPress | window keydown 快捷键切换前 |
| 20644 | 18586 | cancelToolRadialGesture | window keydown 快捷键切换前 |
| 20793 | 18735 | beginStrandRadialGesture | window keydown Space |
| 20841 | 18783 | beginToolShortcutPress | window keydown 工具快捷键 |
| 20866 | 18808 | finishToolShortcutPress | window keyup |
| 20871 | 18813 | finishStrandRadialGesture | window keyup Space |
| 20896 | 18838 | cancelStrandRadialGesture | window blur |
| 20897 | 18839 | cancelToolShortcutPress | window blur |
| 21953 | 19895 | updateStrandRadialGesture | window pointermove（capture） |
| 21954 | 19896 | updateToolRadialGesture | window pointermove（capture） |
| 22064 | 20006 | blockPointerDuringStrandRadialGesture | renderer.domElement pointerdown（capture） |

> 全文件裸引用静态扫描确认：app.js 内 37 函数名仅剩 22 处 `radialMenuApi.X` + 1 处注释（batch-fill 注释提 setRadialMenusEnabled）+ import/创建/批填，零裸引用、零重复定义。

### 3. deps 清单（实际 66 项，模块引用 66 = 批填 66，精确匹配）

- store .state 代理（5）：hairState / miscState / sculptState / sel / ui
- DOM（11）：strandRadialMenu / strandRadialActionList / strandRadialLine / strandRadialCenter / toolRadialMenu / toolRadialActionList / toolRadialLine / toolRadialCenter / radialMenusPreferenceInput / radialShortcutRows / drawSurfaceDynamicButton
- 数据（3）：locks / selectionSets / lastPointer
- 已迁模块 api 对象（4）：drawFlowApi / presetLibraryApi / guideApi / **referenceHeadApi**（A4 后 beginStrandRadialGesture 用 referenceHeadApi.selectedReferenceImage()，故比地图 §4 多一个 api 对象、少一个函数 dep）
- app.js 顶层函数（42，均为函数声明已提升）：hideOutlinerContextMenu / updateInteractionLocks / setViewportEditMode / setViewportSelectionMode / setActiveTool / selectionSetCanEditFromSelection / selectedLocksInOrder / mirrorPartnerFor / hiddenStrandsExist / mirroredClumpPartners / lockedStrandsExist / clumpGuideForLock / getSelectedLock / strandIsolationActive / selectionCanBecomeClump / selectedProceduralDuplicateSources / createClumpFromSelection / lockSelectedStrands / unlockAllStrands / hideSelectedStrands / unhideHiddenStrands / createSelectionSetFromSelection / editSelectionSetFromSelection / openProceduralDuplicateDialog / toggleSelectedStrandIsolation / deleteSelectedStrands / pushUndoState / createMirrorPartner / updateCount / selectLock / decoupleMirrorPartner / renderLockList / createMirroredClump / decoupleMirroredClump / dissolveClump / outlinerClumpLocks / deleteLocks / beginDuplicatePlacement / setObjectSpaceEditing / setViewPlaneMove / setPullMoveEnabled / saveBooleanPreference
- 常量（1）：RADIAL_MENUS_PREFERENCE_KEY

### 4. A3/A4 跨批次重接处理

- **A4（已完成）**：`selectedReferenceImage` 在模块内为 `deps.referenceHeadApi.selectedReferenceImage()`（app.js 原 beginStrandRadialGesture 已用 referenceHeadApi，A4 迁出时已接好），未再注入 `selectedReferenceImage` 函数 dep。
- **A3（待办，记录）**：`openProceduralDuplicateDialog`(16679→15396) 与 `selectedProceduralDuplicateSources`(16643→15360) 当前仍是 app.js 函数、作 deps 注入。A3 procedural duplicate 迁出后，需把 radialMenuDeps 批填里这两项改为 `openProceduralDuplicateDialog: proceduralDuplicateApi.openProceduralDuplicateDialog` 与 `selectedProceduralDuplicateSources: proceduralDuplicateApi.selectedProceduralDuplicateSources`（模块内引用处 `deps.openProceduralDuplicateDialog()` / `deps.selectedProceduralDuplicateSources()` 不变）。
- 模块侧（modules/*）对本批 37 函数名零引用（全量 grep 复核），无其它跨模块重接负担。

### 5. 装配点（实际）

- 创建：api const 群内 placementApi 之后（原 L1505 后）加 `const radialMenuDeps = {}; const radialMenuApi = createRadialMenuApi(radialMenuDeps);`。
- 批填：`referenceHeadApi` const（原 L2918，最后依赖 const）之后、bootstrap init（原 L18513 setRadialMenusEnabled）之前；Object.assign 生效行 = `});` 行（原 L2931 起，执行时 L3000 结束）。
- 引导期时序：唯一顶层直接调用为 L17744（bootstrap init setRadialMenusEnabled），晚于批填；pointermove/pointerdown 为 addEventListener 传函数引用（注册时函数已存在，回调运行在批填后）；resetTransientInteractionsForStateRestore/loadPreferencesAndPresets 均为用户动作触发，非引导期。

### 6. 踩坑

1. **spread `...name` 正则漏配**：初版 deps 替换用 `(?<![\w$.])NAME\b` 负向环视，`...selectionSets.map` / `...drawFlowApi.activeStrokeSurfaceInput()` 因名字前是第二个 `.` 被误判为属性访问而漏配；用「spread 感知」扫描（连续两个 `.` 后的标识符视作裸引用）抓出 2 处并手工修正。
2. **多行插入串行尾**：Node 脚本以 `\n` join 的插入块（api 创建/deps 批填）写入 CRLF 文件后残留 75 个裸 LF；统一 `\r\n|\r|\n → \r\n` 归一后归零。
3. **行号漂移**：地图快照 22,689 行 → 执行 21,400 行，全部按当前文件重新锚定（函数定位用 `^function NAME` 精确匹配，外部调用点用全名 grep 重新枚举，得 22 处与地图一致）。

### 7. 验证结果

1. 裸引用静态扫描归零：模块 66 deps 引用 + 37 本地函数 + 3 本地 const + 7 import + JS 内建/全局，无未知自由标识符（12 个余留名均为回调参数/解构局部，逐一核验）；app.js 内 37 函数名零裸引用。
2. store 代理双重 .state 检查：模块内 `deps.X.y`，无 `deps.X.state.y`（仅 deps 文档注释提及）；批填传 `hairState: hairState.state` 等代理。
3. 引导期 deps 时序审计：批填（L2931）早于全部 22 处 radialMenuApi 调用点（最早 L9395，且在函数内）；唯一顶层调用 L17744 晚于批填。
4. 跨批次重接：A4 selectedReferenceImage 经 referenceHeadApi 注入；A3 两函数仍为 app.js deps（待办已记录）。
5. 编码：两文件 UTF-8 无 BOM、CRLF 全量（app.js 20,631 CRLF / 0 bareLF；radial-menu.js 913 CRLF / 0 bareLF）；非 ASCII 逐字节守恒（app.js 541→541，模块 0）。
6. 语法：node --check 通过（app.js 直检 + .mjs 副本权威解析双文件）。
7. 回归：verify-smoke（layered-side-bun.ahs）**10/11 = 基线**，唯一失败 branch-bridge smooth is per-lock（内容相关，与基线一致）；boot 0 异常、zh/ja/en 翻译、ahs 加载重建、undo/export/save/selection store 全 PASS。