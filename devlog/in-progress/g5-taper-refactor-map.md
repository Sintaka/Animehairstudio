# taper 曲线编辑器迁出（G5）— 函数引用图 / Refactor Map

> 生成：2026-08-12 · 分支 `0.2.59-refactor` · 仓库 `D:\code\dev\web\Animehairstudio`
> 约束：只读分析，未修改 app.js/modules/*；唯一产出本文档。
> 基线：**committed HEAD baaab62（G4 后）app.js = 31,453 行，MD5 `43E92461C3FC262AE0F0FDE8F3ADB58F`**，与 `devlog/FUNCTION_INDEX.json`（14:45 快照）一致。
> ⚠️ 并发注意：分析期间工作树被并行的 G7 poly 提取改动（未提交，14:51 后 app.js = 30,840 行，MD5 `E67C49608E81C6C68272BE18490B36A6`，且继续变化）。本文全部行号 = committed HEAD 坐标；执行 G5 时须按当时工作树重排（G7 落地后，L15443 之后约 -613 行、L5532-15443 之间约 +51 行）。

## 1. 结论速览（TL;DR）

- **候选 33 个命名条目 = 32 个顶层函数 + 1 个嵌套箭头**（`tipSideForkFor` 在 `renderTaperCurveEditor` 体内），共 **871 行**（含嵌套 9 行）。净减估 **~650 行**（×0.75；计划表 1,180 因「updateSelectedTaperPoint 601 行」过时而偏高，见 §2.4）。
- **app.js 内 `name(` 引用 137 处**（= 32 定义 + 79 模块内调用 + 29 顶层接线 + 30 非 G5 函数内调用）+ **7 处裸绑定/注册**（`addEventListener(..., fn)` 无括号：1966、25342、25425、25426、30714、30747、30827）+ **modules/* 6 处**。
- **迁出后需改接线点共 72 处**：30 处非 G5 函数内调用（18 个函数）+ 36 处顶层接线 + 6 处模块 deps 重填。
- **模块内调用边 79 条**：迁出后为模块内直接调用，无需改。
- **deps 注入清单**：4 个 store（`sculptState`/`sel`/`hairState`/`miscState`，均解包 `.state`）+ 2 个跨模块 api（`branchSweep`/`shapePresets`）+ 30 个 app.js helper + 29 个 DOM 元素 + 10 个共享对象 + 2 个常量（`DEFAULT_PROCEDURAL_BRANCH_*`）。
- **模块级 import（免注入）**：`THREE`；`curve-math.js`（`normalizeTaperCurve`/`sampleTaperCurve`/`twistCurveDisplayRange`/`twistCurveHandleDistancePerDegree`）；`bone-model.js`（`materializeSplitBones`，仅 `activeTaperTarget` 用）；`app-config.js`（`TAPER_VALUE_MAX` 等，视具体体引用补 import 或走 deps）。
- **硬障碍**：`__AHS_TEST_SEAM`（HEAD L31397-31452）引用 `renderTaperCurveEditor`（L31436），须在 seam 重导出；undo/redo 脊柱调用 `renderTaperCurveEditor`（L13330/13347）与 `restoreRefreshes.register("curve-editors", refreshTaperCurveEditorAfterStateRestore)`（L1966）——接线保留 app.js，改 `taperEditorApi.X`；无引导期顶层调用早于批填。
- **建议**：`modules/geometry/taper-editor.js` + `createTaperEditorApi(deps)`；装配点 = 紧跟 `curveSurfaceCreate`（原 L1510 后），批填 = `editTaperCurveButtons`（原 L2727）之后、taper 接线块（L25341）之前。难度 **中**。
- **taper vs 骨骼 B1**：`activeTaperTarget` 随 G5 走（其 segment 分支 = `materializeSplitBones`+下标+curveKey 初始化，是编辑器逻辑，不属骨骼数据层）；**不下沉 bone-model.js**（bone-model 是叶子、只依赖 THREE，不应引入 store）。B1 段控制胶水 5 函数留在 app.js，其中 `openPanelSegmentCurveEditor` 嵌在 G5 簇 A 内，7 处 G5 调用改 `taperEditorApi.*`。

## 2. 边界判定（关键）

### 2.1 Godel 区间修正

- **区间 A L10954–11876（原盘点）≈ 实际 G5 簇 A 的核心段，但起点偏晚**：簇 A 实为 **L10651–11827**；L10954 之前还有 `activeStrandShapeTarget`(10651)/`activeTaperTarget`(10858)/`activeTaperCurve`(10913)/`ensureSecondaryTaperCurve`(10924)/`taperSamples`(10934)/`ensureAsymmetricTaperPreviewElements`(10941) 共 6 个，均属 G5。
- **区间 B L26370–27237（原盘点）整段错位**：该区间是 creation 预设（`applyPresetControl` 26629、`populateCreationPresetSelect` 26694、`createCustom*Preset` 26759-26789、`applyBraidToolPreset` 26880 等）、panel 段控制（`changePanelSplitCount` 26479，B1）、panel resize/floating panel（27102-27209）——**不是 taper 编辑器**。taper 编辑器第二簇（拖拽/编辑）实为 **L25341–25632**（`releaseTaperCurveEditorFieldFocus` 25354 起至 `updateSelectedTaperPoint` 25632），比区间 B 早约 700 行。
- 实际 G5 两簇：**簇 A = L10651–11827（编辑器/预览核心）**；**簇 B = L25341–25632（视口拖拽/字段编辑）+ 顶层接线块 L25341–25723（留在 app.js）**。

### 2.2 区间内非 taper 项（不迁，留 app.js）

簇 A 区间（10550–12000）内的非 G5：
1. `setupShapePresetControls`/`syncShapePresetRemoveButtons`/`syncShapePresetSelects`/`populateShapePresetSelects`/`openSaveShapePreset`/`commitCustomShapePreset`/`openRemoveShapePreset`/`commitRemoveShapePreset`（11012-11153）：shape preset 面板 UI（`shapePresets` 模块的 app.js 侧粘合），不迁；其中 `syncShapePresetSelects`/`openSaveShapePreset` 各 1 处调 `shapeTargetForSelect`（G5）→ 改 api。
2. `openPanelSegmentCurveEditor`（11732-11766）：B1 段控制胶水（计划表 B1 行），但其体 7 处调 G5（`activeTaperTarget`×2/`ensureSecondaryTaperCurve`/`renderTaperPreview`/`setTaperMeshPointsVisible`/`renderTaperCurveEditor`/`updateTaperCurveEditorTargetLabel`）→ 改 `taperEditorApi.*`。
3. `updateViewportStatsVisibility`（11781-11798）：视口 UI 统计，不迁（作为 G5 dep 被 `openTaperCurveEditor`/`closeTaperCurveEditor` 调）。
4. `canvasToProfile`（11800-11812）：sweep profile 编辑器，不迁。
5. `addLock`（11829-…）：脊柱函数，不迁。
6. profile 编辑器块 `activeProfileOffset`/`profileToCanvas`/`renderProfilePreview`/`renderHairCardCoveragePath`（10809-10856）：sweep profile 子系统（非 taper），不迁；`branchSweep` 已通过 deps 引用它们。

### 2.3 taper vs 骨骼（B1/B2）归属建议

- **随 G5**：`activeTaperTarget`（含 segment 分支 `materializeSplitBones`+下标+curveKey/centerAsymmetricProfile 初始化）。理由：`materializeSplitBones` 已在 `modules/geometry/bone-model.js` 导出；G5 模块直接 `import { materializeSplitBones } from "./bone-model.js"` 即可，**不必**把 `activeTaperTarget` 下沉 bone-model（下沉会让 bone-model 依赖 sculptState/locks/shapePresets，破坏「叶子、只依赖 THREE」设计）。这与计划「下沉 bones-data 或随 G5 走」二选一中的后者一致，且更干净。
- **留 B1（app.js 胶水，内部调用改 api）**：`selectedPanelSegment`(20909)/`syncPanelSegmentControls`(20915)/`syncPanelShapeInputs`(20933)/`openPanelSegmentCurveEditor`(11732)/`changePanelSplitCount`(26479)。注意计划表 B1 行号（11828-11863/21925-21975/27556-27705）与现状不符（实测 11732/20909-20975/26479）。
- **B2 交叉**：`updatePanelSplitHandleDrag`（骨骼拖拽，28695）1 处调 `renderTaperCurveEditor` → B2 执行时改 api。
- 段曲线编辑数据落 `lock.splitBones[i]`（live 引用，`activeTaperTarget` 注释已说明不复用深克隆）：数据层在 bone-model，编辑器在 G5，单向依赖成立。

### 2.4 「updateSelectedTaperPoint 601 行」为过时口径

现状（HEAD）`updateSelectedTaperPoint` = **25621-25632，仅 12 行**（含 G4 前 2b24d63 亦为 12 行）。原「601 行」内容现已被拆为：视口拖拽 4 函数（`begin/update/finishTaperMeshPointDrag` + `finishTaperCurveDrag`，共 164 行）+ **顶层接线块 L25341-25723（~383 行，事件绑定，留在 app.js）**。因此 G5 毛行 871（非计划表 ~1,580），净减 ~650（非 ~1,180）。顶层接线块归属 **appjs-slim-remaining-plan 的 B4（taper curve editor 批）**，G5 不应重复迁移（见 §8 建议 3）。

## 3. 待迁函数清单（33 条目 = 32 顶层 + 1 嵌套，按原行号）

| # | 函数 | 行号区间 | 行数 | app.js 外部调用点 | modules 引用 | 职责 |
|---|---|---|---|---|---|---|
| 1 | `activeStrandShapeTarget` | 10651-10653 | 3 | 7 | 0 | 当前 strand 形状目标（profile/panel/taper 共用） |
| 2 | `activeTaperTarget` | 10858-10884 | 27 | 19 | 0 | 段目标解析（含 materializeSplitBones+下标） |
| 3 | `activeTaperCurve` | 10913-10922 | 10 | 14 | 0 | 当前编辑曲线（taper/depth/twist/procedural） |
| 4 | `ensureSecondaryTaperCurve` | 10924-10932 | 9 | 6 | 0 | 非对称副曲线惰性创建 |
| 5 | `taperSamples` | 10934-10939 | 6 | 4 | 1 | 曲线采样点数组 |
| 6 | `ensureAsymmetricTaperPreviewElements` | 10941-10961 | 21 | 1 | 0 | SVG 副曲线/中线元素惰性创建 |
| 7 | `renderTaperPreview` | 10963-10997 | 35 | 16 | 0 | 面板 SVG taper 预览 |
| 8 | `shapeTargetForSelect` | 11002-11005 | 4 | 2 | 1 | select 元素→目标解析（shape-presets 模块用） |
| 9 | `taperPointToCanvas` | 11169-11184 | 16 | 3 | 0 | 曲线点→canvas 坐标 |
| 10 | `canvasToTaperPoint` | 11186-11220 | 35 | 1 | 0 | canvas 事件→曲线点 |
| 11 | `clearTaperMeshPoints` | 11222-11230 | 9 | 1 | 0 | 清 3D 记录点 |
| 12 | `taperMeshPointFrame` | 11232-11240 | 9 | 2 | 1 | 记录点空间 frame（twist/braid/strand 分派） |
| 13 | `taperMeshPointExtentPerValue` | 11245-11280 | 36 | 3 | 2 | 每值像素/世界范围 |
| 14 | `updateTaperMeshPoints` | 11282-11359 | 78 | 4 | 0 | 3D 记录点重建 |
| 15 | `setTaperMeshPointsVisible` | 11361-11377 | 17 | 5 | 0 | 记录点显隐 |
| 16 | `renderTaperCurveEditor` | 11379-11469 | 91 | 12 | 0 | 编辑器主渲染（含嵌套 `tipSideForkFor` 11392-11400） |
| — | `tipSideForkFor`（嵌套箭头） | 11392-11400 | 9 | 0 | 0 | 段曲线 fork 隐藏点 t（仅 renderTaperCurveEditor 内用，随迁） |
| 17 | `updateTaperCurveEditorTargetLabel` | 11471-11483 | 13 | 3 | 0 | 目标标签 |
| 18 | `retargetOpenTaperCurveEditor` | 11485-11499 | 15 | 1 | 0 | 选择变化后重开编辑器 |
| 19 | `refreshTaperCurveEditorAfterStateRestore` | 11501-11530 | 30 | 1(+1 注册) | 0 | undo/redo 后刷新 |
| 20 | `scheduleTaperCurveEdit` | 11533-11540 | 8 | 2 | 0 | 编辑调度 |
| 21 | `flushScheduledTaperCurveEdit` | 11542-11551 | 10 | 5 | 0 | 冲刷调度 |
| 22 | `cancelScheduledTaperCurveEdit` | 11553-11559 | 7 | 1 | 0 | 取消调度 |
| 23 | `applyTaperCurveEdit` | 11561-11685 | 125 | 9 | 0 | 编辑落库（strand/group/creation/segment/procedural） |
| 24 | `openTaperCurveEditor` | 11687-11730 | 44 | 1 | 0 | 打开编辑器 |
| 25 | `closeTaperCurveEditor` | 11768-11779 | 12 | 3(+1 裸绑定) | 2 | 关闭编辑器 |
| 26 | `retargetFloatingStrandEditors` | 11814-11827 | 14 | 1 | 0 | 浮动编辑器重定位（taper+sweep profile） |
| 27 | `releaseTaperCurveEditorFieldFocus` | 25354-25364 | 11 | 2 | 0 | 释放编辑器内焦点 |
| 28 | `finishTaperCurveDrag` | 25418-25424 | 7 | 0(+2 裸绑定) | 0 | canvas 拖拽结束 |
| 29 | `beginTaperMeshPointDrag` | 25461-25540 | 80 | 0(+1 裸绑定) | 0 | 视口记录点拖拽开始 |
| 30 | `updateTaperMeshPointDrag` | 25542-25595 | 54 | 0(+1 裸绑定) | 0 | 视口拖拽更新 |
| 31 | `finishTaperMeshPointDrag` | 25597-25619 | 23 | 5(+1 裸绑定) | 0 | 视口拖拽结束 |
| 32 | `updateSelectedTaperPoint` | 25621-25632 | 12 | 3 | 0 | 字段编辑（value/position/interpolation） |

合计：32 顶层体 871 行（含嵌套 9 行）；净减估 871×0.75 ≈ **650 行**。

## 4. 引用图

### 4.1 模块内调用边（79 条，迁后为直接调用）

```
activeTaperCurve        → activeTaperTarget(10914)
renderTaperPreview      → taperSamples(10971,10972), ensureAsymmetricTaperPreviewElements(10982)
shapeTargetForSelect    → activeStrandShapeTarget(11004)
taperPointToCanvas      → activeTaperCurve(11173)
canvasToTaperPoint      → activeTaperCurve(11190), activeTaperTarget(11193)
updateTaperMeshPoints   → clearTaperMeshPoints(11283), activeTaperTarget(11287), activeTaperCurve(11288),
                          ensureSecondaryTaperCurve(11320), taperMeshPointFrame(11328), taperMeshPointExtentPerValue(11337)
setTaperMeshPointsVisible → updateTaperMeshPoints(11371)
renderTaperCurveEditor  → activeTaperCurve(11380), activeTaperTarget(11382), taperSamples(11412,11421),
                          taperPointToCanvas(11413,11422,11439), ensureSecondaryTaperCurve(11420,11434),
                          tipSideForkFor(11448), updateTaperMeshPoints(11468)
retargetOpenTaperCurveEditor → flushScheduledTaperCurveEdit(11487), finishTaperMeshPointDrag(11488),
                          closeTaperCurveEditor(11493), updateTaperCurveEditorTargetLabel(11497),
                          refreshTaperCurveEditorAfterStateRestore(11498)
refreshTaperCurveEditorAfterStateRestore → activeTaperTarget(11503), closeTaperCurveEditor(11505,11513),
                          activeTaperCurve(11511), renderTaperCurveEditor(11529)
scheduleTaperCurveEdit  → applyTaperCurveEdit(11538)
flushScheduledTaperCurveEdit → applyTaperCurveEdit(11549)
applyTaperCurveEdit     → activeTaperTarget(11566,11594,11598,11602,11609,11622,11674,11678),
                          renderTaperPreview(11579,11592,11600,11620,11676), renderTaperCurveEditor(11587,11683)
openTaperCurveEditor    → activeTaperTarget(11713), ensureSecondaryTaperCurve(11713),
                          updateTaperCurveEditorTargetLabel(11721), setTaperMeshPointsVisible(11722), renderTaperCurveEditor(11727)
closeTaperCurveEditor   → flushScheduledTaperCurveEdit(11769), finishTaperMeshPointDrag(11773), setTaperMeshPointsVisible(11774)
retargetFloatingStrandEditors → renderTaperCurveEditor(11825)
finishTaperCurveDrag    → renderTaperCurveEditor(25423), flushScheduledTaperCurveEdit(25423)
beginTaperMeshPointDrag → releaseTaperCurveEditorFieldFocus(25475), activeTaperCurve(25478),
                          taperMeshPointFrame(25485), taperMeshPointExtentPerValue(25507), renderTaperCurveEditor(25537)
updateTaperMeshPointDrag → activeTaperCurve(25545), finishTaperMeshPointDrag(25549), scheduleTaperCurveEdit(25592)
finishTaperMeshPointDrag → cancelScheduledTaperCurveEdit(25601), activeTaperCurve(25602), applyTaperCurveEdit(25607),
                          flushScheduledTaperCurveEdit(25609), updateTaperMeshPoints(25616)
updateSelectedTaperPoint → activeTaperCurve(25622), applyTaperCurveEdit(25631)
```

### 4.2 外部接线点（迁出后需改 `taperEditorApi.X`）

**A. 非 G5 函数内调用 30 处（18 个函数，均在 app.js）**

| 函数（留 app.js） | 调用点 |
|---|---|
| `openPanelSegmentCurveEditor`（B1） | activeTaperTarget@11753,11761；ensureSecondaryTaperCurve@11753；renderTaperPreview@11759；setTaperMeshPointsVisible@11756；renderTaperCurveEditor@11758；updateTaperCurveEditorTargetLabel@11755 |
| `openSaveShapePreset` | shapeTargetForSelect@11094 |
| `syncShapePresetSelects` | shapeTargetForSelect@11046 |
| `rebuildLockGeometry`（G3 脊柱） | updateTaperMeshPoints@20081 |
| `strandWidthEdgeSample`（G3 几何） | taperMeshPointExtentPerValue@19287 |
| `undoLastAction` | renderTaperCurveEditor@13330 |
| `redoLastAction` | renderTaperCurveEditor@13347 |
| `refreshStrandSelectionConsumers`（selection 粘合） | retargetOpenTaperCurveEditor@20557 |
| `selectLock`（selection 粘合） | retargetFloatingStrandEditors@20642 |
| `updatePanelSplitHandleDrag`（B2 骨骼） | renderTaperCurveEditor@28695 |
| `syncGroupInputs` | renderTaperPreview@20682,20683 |
| `syncCreationShapeInputs` | renderTaperPreview@20860,20861 |
| `syncPanelSegmentControls`（B1） | activeStrandShapeTarget@20915；renderTaperPreview@20929,20930 |
| `syncPanelShapeInputs`（B1） | activeStrandShapeTarget@20933 |
| `syncStrandSplitInputs` | activeStrandShapeTarget@20960 |
| `syncHairCardControls` | activeStrandShapeTarget@20969 |
| `syncProceduralAccessoryEditControls` | renderTaperPreview@21010,21011 |
| `syncInputs` | renderTaperPreview@21379,21380 |

**B. 顶层接线 36 处（事件绑定/注册，留在 app.js）**
- 29 处 `name(`：L25341(openTaperCurveEditor)；25344(flushScheduledTaperCurveEdit)；25345,30779(finishTaperMeshPointDrag)；25346,25352(setTaperMeshPointsVisible)；25366,25380,25704(activeTaperTarget)；25372(ensureSecondaryTaperCurve)；25377,25384,25659,25669,25723(applyTaperCurveEdit)；25391(releaseTaperCurveEditorFieldFocus)；25397,25409,25647,25662,25672(activeTaperCurve)；25404(renderTaperCurveEditor)；25412(canvasToTaperPoint)；25415(scheduleTaperCurveEdit)；25634,25644,25645(updateSelectedTaperPoint)；26522,26530(activeStrandShapeTarget，panel 段 prev/next 按钮)。
- 7 处裸引用：L1966(`restoreRefreshes.register("curve-editors", refreshTaperCurveEditorAfterStateRestore)`)；25342(closeTaperCurveEditor)；25425,25426(finishTaperCurveDrag)；30714(updateTaperMeshPointDrag)；30747(finishTaperMeshPointDrag)；30827(beginTaperMeshPointDrag)。

**C. modules/*.js 引用 6 处（跨批次重接，改 app.js 的 deps 填法）**
- `modules/geometry/branch-sweep.js`：taperSamples@173、taperMeshPointFrame@202、taperMeshPointExtentPerValue@185,186、closeTaperCurveEditor@355（均走 `deps.X`，对应 app.js L9389-9396 `createBranchSweepApi` 批填）。
- `modules/geometry/branch-region-panel.js`：closeTaperCurveEditor@217（走 `deps.X`，对应 app.js L12208-12216 `createBranchRegionApi` 批填）。
- `modules/io/shape-presets.js`：shapeTargetForSelect@60（走 `deps.X`，对应 app.js L10892-10911 `createShapePresetsApi` 批填）。
- 迁移后上述 3 处 app.js 批填改为 `taperSamples: taperEditor.taperSamples` 等（`taperEditorApi` 引用）。

## 5. deps 注入清单

- **store 代理（`.state`）**：`sculptState`、`sel`、`hairState`、`miscState` —— 批填 `sculptState: sculptState.state` 等，模块内 `deps.sculptState.y`（禁止 `.state.state`）。
- **跨模块 api 对象**：`branchSweep`（twist/procedural 分支曲线编辑、renderTwistCurvePreview、closeSweepProfileEditor）、`shapePresets`（taperSecondaryKey/taperAsymmetryKey/cloneShapePresetValue）。
- **共享对象/常量**：`locks`（数组）、`strandGroupDefaults`、`camera`、`renderer`、`raycaster`、`taperMeshPointsGroup`、`taperMeshPointGeometry`、`taperMeshPointMaterial`、`taperMeshPointSelectedMaterial`、`taperMeshPointCenterMaterial`、`DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE`、`DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE`。
- **DOM 元素**：`taperCurveEditor`、`taperCurveTarget`、`taperCurveCanvas`、`taperCurvePath`、`taperCurveSecondaryPath`、`taperCurveBaseAxis`、`taperCurveValueAxis`、`taperCurveCenterLine`、`taperCurvePoints`、`taperCurveOptions`、`taperAsymmetryToggleRow`、`taperAsymmetryToggle`、`centerAsymmetricProfileRow`、`centerAsymmetricProfileToggle`、`taperMeshPointsToggleRow`、`taperMeshPointsToggle`、`taperPointValue`、`taperPointPosition`、`taperPointInterpolation`、`taperPreviewPaths`、`segmentTaperPreview`、`segmentDepthPreview`、`strandTwistCurvePreview`、`proceduralBranchLengthCurvePreview`、`proceduralBranchShapeCurvePreview`、`sweepProfileEditor`、`sweepProfileTarget`、`groupSettingsPanel`、`groupDefaultsWarning`。
- **app.js helper 函数（30）**：`getSelectedLock`、`pushUndoState`、`editSelectedLocks`、`updateLockGeometry`、`rebuildLockGeometry`、`updateCurveObjects`、`updateDrawStrandPreview`、`syncActiveMirror`、`mirrorPartnerFor`、`updateInteractionLocks`、`setActiveTool`、`setHoveredStrandWidthEdge`、`rayFromViewportEvent`、`resize`、`applyGroupDefaultsToExistingStrands`、`activeCreationShapeDefaults`、`creationToolActive`、`syncShapePresetSelects`、`updateViewportStatsVisibility`、`compatibleSelectedLocks`、`strandRegionDisplayLabel`、`clonePanelSplits`、`isPanelGeometry`、`tipWidthSideForkT`、`proceduralGuideForLock`、`strandGeometryFrameAt`、`strandGeometryCurve`、`transportedStrandFrameAt`、`braidFrameAt`、`controlPointRotationAt`。
- **模块级 import（不注入）**：`THREE`；`curve-math.js`（`normalizeTaperCurve`、`sampleTaperCurve`、`twistCurveDisplayRange`、`twistCurveHandleDistancePerDegree`）；`bone-model.js`（`materializeSplitBones`）；`app-config.js`（`TAPER_VALUE_MAX`、`DEFAULT_TAPER_CURVE`、`DEFAULT_DEPTH_CURVE` 等——G5 体内若引用则补 import，顶层接线块内的 `DEFAULT_*`/`STRAIGHT_CUT_PANEL_CURVE` 留在 app.js）。

## 6. api 创建 / 批填时序（引导期审计）

- `taperEditorDeps = {}` + `taperEditor = createTaperEditorApi(taperEditorDeps)`：紧跟 `curveSurfaceCreate` 创建（原 L1510 后）——模块对象先存在。
- 批填 `Object.assign(taperEditorDeps, {...})`：**`editTaperCurveButtons`（原 L2727）之后、taper 接线块（原 L25341）之前**（建议放 ~L2728-2730）。此时全部 deps 已定义（taper DOM const 最后一个是 `taperPointInterpolation` L2726 / `editTaperCurveButtons` L2727；stores、`locks`、helper 函数声明均在前）。
- **引导期无 G5 api 调用早于批填**：L1966 注册只取函数引用不调用；L9389/10892/12208 是 deps 填法引用（改为 api 引用即可，此时模块已存在）；G5 函数体内互调全部发生在用户交互期。最早实际调用 = 接线块 L25341 之后。
- 事件绑定、`restoreRefreshes` 注册、undo/redo 的 `if (taperCurveEditor.open) taperEditorApi.renderTaperCurveEditor()` 均留在 app.js。

## 7. 硬障碍

1. **`__AHS_TEST_SEAM`（HEAD L31397-31452）**：仅引用 `renderTaperCurveEditor`（L31436，`window.__ahsTest.renderTaperCurveEditor`）→ 抽取后必须在 seam 重导出 `taperEditorApi.renderTaperCurveEditor`（或模块挂回）。其余 seam 引用（`syncPanelSegmentControls`/`materializeSplitBones`/`tipWidthSideForkT`/`sampleTaperCurve` 等）非 G5。
2. **undo/snapshot/mirror**：snapshot/restore 只读写曲线数据（`normalizeTaperCurve` 来自 curve-math），**不调用 G5**；`pushUndoState` 由顶层接线与 `beginTaperMeshPointDrag` 调用（后者在模块内走 deps）；undo/redo 脊柱 2 行接线（13330/13347）+ `restoreRefreshes` 注册（1966）改 api。mirror 走 `syncActiveMirror`/`mirrorPartnerFor`（helper deps），`mirrorSplitBones` 已在 bone-model。
3. **跨批次重接**：G3 `rebuildLockGeometry`(20081)/`strandWidthEdgeSample`(19287)、B2 `updatePanelSplitHandleDrag`(28695)、selection 粘合 `selectLock`(20642)/`refreshStrandSelectionConsumers`(20557) 共 5 处；modules 3 处 deps 填法（branch-sweep/branch-region-panel/shape-presets）。
4. **引导期**：无顶层 G5 调用早于批填（§6）；无 import 绑定冲突（G5 模块新 import 与 app.js 现有 import 各自独立）。
5. **并发工作树**：G7 未提交改动正在移动行号（§头部），G5 执行前先以最新工作树重排行号并重跑本清单。

## 8. 建议

1. **模块文件**：`modules/geometry/taper-editor.js`，导出 `createTaperEditorApi(deps)`；模块内 `import { materializeSplitBones } from "./bone-model.js"`、`import { normalizeTaperCurve, sampleTaperCurve, twistCurveDisplayRange, twistCurveHandleDistancePerDegree } from "./curve-math.js"`、`import * as THREE from "three"`。
2. **taper/bones 归属**：`activeTaperTarget` 随 G5（不下沉 bone-model，理由见 §2.3）；B1 5 函数留 app.js 并改 api 引用；B2 `updatePanelSplitHandleDrag` 后续改 api。
3. **与 B4 协同**：G5 只迁函数体（871 行，净 ~650）；顶层接线块 L25341-25723（~383 行）留给 appjs-slim-remaining-plan 的 B4（taper curve editor 批），避免重复计算与双改事件绑定。
4. **难度**：中。与计划一致；主要成本 = 39 helper + 29 DOM/共享对象 deps、`applyTaperCurveEdit`(125)/`updateTaperMeshPoints`(78)/`beginTaperMeshPointDrag`(80) 大函数、72 处接线。
5. **边界存疑点汇总**：① Godel 区间 B 整段错位（taper 拖拽簇在 25341-25632）；② 「601 行大函数」过时（现 12 行 + 顶层接线块）；③ `activeStrandShapeTarget`/`shapeTargetForSelect` 为 profile/panel/taper 共用小助手（建议随 G5，7 行；若留 app.js 则 G5 计数降为 30 顶层 + 1 嵌套 = 31，正好匹配计划「约 31」）；④ `retargetFloatingStrandEditors` 同时服务 sweep profile 编辑器（sweepProfileEditor 依赖），归属 G5 时须把 sweep profile 编辑器 DOM 一并注入；⑤ `renderTaperCurveEditor` 兼渲 twist/procedural 分支曲线（branchSweep 依赖），模块必须注入 branchSweep 且保留这些分支逻辑。


## 9. 执行记录（G5 落地 2026-08-12）

> 工作树基线：G4 baaab62 + G7 adf9e87 已提交，app.js = 30,841 行（split 计数）。本文 §1-8 行号为 committed HEAD baaab62 坐标；实际执行按 30,841 行工作树重排（+51 / -613 位移），§3 映射 32 个函数定义行全部命中。

### 9.1 迁出函数 / 行数

- **33 条目 = 32 顶层函数 + 1 嵌套箭头（tipSideForkFor）= 871 行**，全部迁入 `modules/geometry/taper-editor.js`（新文件，943 行：871 函数体 + 头部 import/注释 + api return）。
- app.js：30,841 → 30,059 行（net -782 = -871 函数体 + ~89 脚手架：import 1 + api 创建 6 + 批填 ~82）。
- 函数体字节级守恒：对模块体做「deps.X → X / deps.NAME. → NAME.state.」逆改写后与原始体逐字节一致（仅 CRLF/LF 行尾差异）。

### 9.2 接线改写（71 行替换 ≈ 73 引用点）

- 非 G5 函数内调用 30 处：openPanelSegmentCurveEditor×7、syncShapePresetSelects、openSaveShapePreset、rebuildLockGeometry、strandWidthEdgeSample、undoLastAction、redoLastAction、refreshStrandSelectionConsumers、selectLock、updatePanelSplitHandleDrag、syncGroupInputs×2、syncCreationShapeInputs×2、syncPanelSegmentControls×3、syncPanelShapeInputs、syncStrandSplitInputs、syncHairCardControls、syncProceduralAccessoryEditControls×2、syncInputs×2。
- 顶层接线 36 处：restoreRefreshes 注册、undo/redo 2、taper 事件块（open/close/cancel/toggles/pointer/字段/增删复位）与视口拖拽 4、panel prev/next 2。
- modules deps 6 处：branch-sweep（closeTaperCurveEditor / taperMeshPointExtentPerValue / taperMeshPointFrame / taperSamples）、branch-region-panel（closeTaperCurveEditor）、shape-presets（shapeTargetForSelect）→ 全部改 `taperEditor.X` 填值。
- seam 重导出 1 处：`renderTaperCurveEditor: taperEditor.renderTaperCurveEditor`（window.__ahsTest）。

### 9.3 deps 注入清单（73 个，比地图 §5 少 2）

- 地图 §5 列出的 `resize`、`groupSettingsPanel` 经逐体扫描确认未被 G5 体引用 → 未注入（模块内零裸引用证明）。
- 其余 73 个全部注入：4 store `.state` 代理（sculptState/sel/hairState/miscState）+ 2 跨模块 api（branchSweep/shapePresets）+ 17 共享对象/常量（locks/strandGroupDefaults/camera/renderer/raycaster/taperMeshPointsGroup/taperMeshPointGeometry/taperMeshPointMaterial/taperMeshPointSelectedMaterial/taperMeshPointCenterMaterial/DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/DEFAULT_PROCEDURAL_BRANCH_SHAPE_CURVE）+ 28 DOM + 22 helper。
- 模块级 import（免注入）：THREE；curve-math（normalizeTaperCurve/sampleScale/sampleTaperCurve/twistCurveDisplayRange/twistRateUnitsFromDegrees）；bone-model（materializeSplitBones）；app-config（DEFAULT_SWEEP_PROFILE/STRAND_GROUPS/TAPER_VALUE_MAX/TWIST_CURVE_DISPLAY_RANGE_DEFAULT/TWIST_CURVE_VALUE_MAX）。

### 9.4 踩坑

1. **批填位置与地图 §6 建议不符（TDZ）**：建议放 ~L2728-2730（HEAD），但 `branchSweep`(9438)/`shapePresets`(10937) 在该点尚未创建，`Object.assign(taperEditorDeps, { branchSweep, shapePresets, ... })` 会 TDZ。实际批填放在 `createShapePresetsApi` 的 `});`（HEAD L10962 / new L10945 Object.assign、生效行 new L11021）之后 —— 仍满足「editTaperCurveButtons 之后、taper 接线块之前」，且为最早安全点。首次运行时调用在接线块（new L24133）之后；批填前 0 次调用（仅函数引用）。
2. **改写 tokenizer 两处 bug（已修复并回归）**：模板字面量 `${` 被翻倍成 `$${`；对象键（`updateCurveObjects: false`）被误改写为 `deps.updateCurveObjects: false`。修复后「逆改写逐字节相等」校验通过。
3. **非 ASCII 经 PowerShell→Node stdin 传输损坏**：插入注释里的 `—`(U+2014) 变 `?`；插入文本全部改 ASCII，中文只来自原始函数体（字节守恒校验 missing=0 / extra=0）。
4. **CRLF 归一化**：生成时插入行缺 `\r`（loneLF=89），已统一 normalize 为纯 CRLF。
5. **NUL 工件**：工作期间产生 0 字节保留名文件 `NUL`，已用 .NET `File.Delete('\\?\…\NUL')` 清除。

### 9.5 7 项验证结果

1. 裸引用静态扫描归零：app.js 内 32 名零裸引用/零 spread（残留 6 处 `NAME: taperEditor.NAME` 均为 deps 填法键或 seam 键）；字符串/注释/模板字面量 `${}` 递归剥离后扫描。
2. store 代理双重 .state：模块内 `deps.X.state` 0 处；批填 4 个 store 均为 `.state` 代理。
3. 引导期时序：taperEditor 创建 new L1528；批填生效行 = `});`（new L11021）；批填前 0 次 `taperEditor.X(` 调用（5 处仅为函数引用：restoreRefreshes + branchSweep 填法 3 行 + shapePresets 填法）。
4. 跨批次重接：branchSweep/branchRegion/shapePresets 填法 6 处改 api；scalpBuilderDeps/guideDeps/curveSurfaceCreateDeps/polyToolsDeps 扫描无 G5 名。
5. 编码：两文件 UTF-8 无 BOM、纯 CRLF；非 ASCII 相对 git HEAD app.js 逐字符守恒（missing=0 / extra=0）。
6. 语法：`node --check app.js` 与 `node --check modules/geometry/taper-editor.js` 均 exit 0。
7. 未运行 verify-smoke / 未改 FUNCTION_INDEX / index.html（任务约束）。

### 9.6 边界存疑点确认

- ① Godel 区间 B 错位：确认 taper 拖拽簇 = HEAD L25341-25632（当前工作树 24741-25019）。
- ② 「601 行大函数」过时：updateSelectedTaperPoint 12 行；顶层接线块留 app.js（B4）。
- ③ activeStrandShapeTarget/shapeTargetForSelect 随 G5（7 行）——按地图建议执行。
- ④ retargetFloatingStrandEditors 已注入 sweepProfileEditor/sweepProfileTarget DOM + branchSweep api。
- ⑤ renderTaperCurveEditor 已注入 branchSweep；twist/procedural 分支逻辑原样保留（逆改写校验通过）。
- 留给后续批次：B1 openPanelSegmentCurveEditor 本体、B2 updatePanelSplitHandleDrag 本体、顶层接线块（B4）、undo/snapshot/mirror 数据管线。