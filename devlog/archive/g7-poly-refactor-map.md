# poly 拓扑工具迁出（G7）— 函数引用图 / Refactor Map

> 生成：2026-08-12 · 分支 `0.2.59-refactor` · 仓库 `D:\code\dev\web\Animehairstudio`
> 约束：仅分析 `app.js`（32,530 行）+ `modules/*.js`，未做任何修改；唯一产出本文档。
> 行号口径：`devlog/FUNCTION_INDEX.json`（2026-08-11 快照，app.js 32,531 行）与当前 app.js 逐函数核对一致（selectedPolyMesh@15542 等 28 个定义行全部匹配）；函数体边界用括号配对（跳过参数表 `{}`、字符串/注释）实测。
> 依据：devlog/archive/geometry-bones-extraction-plan.md 的 G7 行 + REFACTOR_PLAN 3b/3c 替换验证清单。

## 1. 结论速览（TL;DR）

- **候选函数：28 个，共 636 行**（L15542–16100 共 23 个 / 537 行 + L20167–20269 共 5 个 / 99 行），净减估 **~477 行**（×0.75，扣 deps 脚手架），与计划 ~500 吻合 → app.js 约 32,530 → ~32,050 行。
- **app.js 内 `name(` 引用合计 103 处**（= 28 定义 + 59 模块内调用 + 16 外部调用点），与计划「103 处」完全一致。
- **外部接线点 22 处**（迁出后需改 `polyToolsApi.X`）：16 个调用点 + 6 处事件绑定裸引用（`addEventListener(..., fn)`）。
- **模块内调用边 59 条**：迁出后为模块内直接调用，无需改。
- **deps 注入清单**：4 个 store（`sel`/`draw`/`sculptState`/`hairState`，均解包 `.state`）+ 8 个共享对象 + 24 个 app.js helper + 4 个 DOM 输入 + `guideApi`（跨模块，仅 `controlPointIsSelected` 一处）。
- **模块级 import（免注入）**：`THREE` + `./poly-topology.js`（8 个纯函数，app.js 已 import，见 §5）。
- **无硬障碍**：`__AHS_TEST_SEAM` 不引用本批；无引导期顶层调用；modules/*.js 对本批函数零引用（跨批次重接为零）。
- **建议**：`modules/geometry/poly-tools.js` + `createPolyToolsApi(deps)`，难度 **低-中**。

## 2. 待迁函数清单（28）

| # | 函数 | 行号区间 | 行数 | 外部接线点 | 职责 |
|---|---|---|---|---|---|
| 1 | `selectedPolyMesh` | 15542–15545 | 4 | 0 | 当前 poly lock 选择 |
| 2 | `addPolyLock` | 15547–15564 | 18 | 0 | 创建 poly lock（含 hairState/width 初值） |
| 3 | `ensurePolyMesh` | 15566–15568 | 3 | 0 | 选择或新建 poly lock |
| 4 | `polySurfaceSample` | 15570–15579 | 10 | 0 | 命中 live surface 取点/法线 |
| 5 | `polyTargetAtEvent` | 15581–15605 | 25 | 0 | 顶点/边/面 组件拾取 |
| 6 | `refreshPolyMesh` | 15607–15614 | 8 | 0 | 规范化 faces + 重建几何/编辑对象 |
| 7 | `ensurePolyFillPreview` | 15616–15651 | 36 | 0 | fill 预览 group 惰性创建 |
| 8 | `clearPolyFillPreview` | 15653–15656 | 4 | 7 调用 | 清 fill 预览（多子系统共用） |
| 9 | `polyFillCandidateForEvent` | 15658–15676 | 19 | 0 | fill/bridge 候选计算 |
| 10 | `showPolyFillPreview` | 15678–15702 | 25 | 0 | 渲染候选面预览 |
| 11 | `updatePolyFillPreview` | 15704–15727 | 24 | 1 绑定 | pointermove 预览刷新 |
| 12 | `refreshPolyFillPreviewFromLastPointer` | 15729–15737 | 9 | 4 调用 | 按 lastPointer 重刷预览 |
| 13 | `fillPolyGap` | 15739–15748 | 10 | 0 | Shift-click 提交 fill/bridge |
| 14 | `polyRelaxSurfaceObjects` | 15750–15768 | 19 | 0 | relax 投影目标面 |
| 15 | `projectPolyRelaxPoint` | 15770–15812 | 43 | 0 | 点投影到 live surface |
| 16 | `removePolyPointAttributes` | 15814–15821 | 8 | 0 | 删除点后裁剪属性数组 |
| 17 | `deletePolyComponent` | 15823–15844 | 22 | 0 | Alt-click 删顶点/边/面 |
| 18 | `addPolyPoint` | 15846–15853 | 8 | 0 | 追加顶点 + 法线 |
| 19 | `appendPolyStrokeRow` | 15855–15873 | 19 | 0 | 画刷行 append quad |
| 20 | `beginPolyBrushPointer` | 15875–15959 | 85 | 1 绑定 | poly 画刷 pointerdown |
| 21 | `finishPolyAltDelete` | 15961–15973 | 13 | 1 绑定 | Alt 删除提交 |
| 22 | `updatePolyBrushStroke` | 15975–16063 | 89 | 1 绑定 | 画刷 pointermove（draw/vertex/relax） |
| 23 | `finishPolyBrushStroke` | 16065–16100 | 36 | 3 调用 + 2 绑定 | 画刷 pointerup/cancel |
| 24 | `polyEdgeKey` | 20167–20169 | 3 | 0 | 边规范化 key |
| 25 | `polyMeshEdges` | 20171–20183 | 13 | 0 | 边 + boundary 枚举 |
| 26 | `populatePolyEditObjects` | 20185–20247 | 63 | 0 | 编辑对象（线/手柄/edgePickers）构建 |
| 27 | `createPolyEditObjects` | 20249–20255 | 7 | 1 调用 | createCurveObjects poly 分支 |
| 28 | `rebuildPolyEditObjects` | 20257–20269 | 13 | 1 调用 | updateCurveObjects poly 分支 |

合计：636 行；外部接线点 22（16 调用 + 6 绑定）。

## 3. 引用图

### 3.1 模块内调用（59 条，迁后为模块内直接调用）

```
selectedPolyMesh → ensurePolyMesh, polySurfaceSample, polyTargetAtEvent,
                   polyFillCandidateForEvent, deletePolyComponent, beginPolyBrushPointer(×4)
addPolyLock      → ensurePolyMesh
ensurePolyMesh   → updatePolyBrushStroke, finishPolyBrushStroke
polySurfaceSample→ polyFillCandidateForEvent, beginPolyBrushPointer, updatePolyBrushStroke
polyTargetAtEvent→ updatePolyFillPreview, deletePolyComponent, beginPolyBrushPointer(×3)
refreshPolyMesh  → fillPolyGap, deletePolyComponent, updatePolyBrushStroke(×4), finishPolyBrushStroke(×3)
ensurePolyFillPreview → showPolyFillPreview
clearPolyFillPreview  → showPolyFillPreview, updatePolyFillPreview(×3), fillPolyGap,
                        deletePolyComponent, beginPolyBrushPointer(×3)
polyFillCandidateForEvent → updatePolyFillPreview, fillPolyGap
showPolyFillPreview → updatePolyFillPreview
updatePolyFillPreview → refreshPolyFillPreviewFromLastPointer
fillPolyGap      → beginPolyBrushPointer
polyRelaxSurfaceObjects → projectPolyRelaxPoint
projectPolyRelaxPoint  → updatePolyBrushStroke
removePolyPointAttributes → deletePolyComponent(×2)
deletePolyComponent → finishPolyAltDelete
addPolyPoint     → appendPolyStrokeRow(×2), finishPolyBrushStroke
appendPolyStrokeRow → updatePolyBrushStroke(×3)
polyEdgeKey      → polyMeshEdges
polyMeshEdges    → populatePolyEditObjects
populatePolyEditObjects → createPolyEditObjects, rebuildPolyEditObjects
```

### 3.2 外部接线点（22 处，迁后改 `polyToolsApi.X`）

| 函数 | 位置 | 类型 | 上下文（app.js，均保留） |
|---|---|---|---|
| `clearPolyFillPreview` | L5810 | 调用 | `setActiveTool`：切出 poly 工具时清预览 |
| `clearPolyFillPreview` | L13649 | 调用 | `disposeAllEditableObjects` |
| `clearPolyFillPreview` | L19282 | 调用 | `beginBlenderNavigation`（pan 时清） |
| `clearPolyFillPreview` | L29221 | 调用 | 顶层 keyup（Shift 释放） |
| `clearPolyFillPreview` | L29259 | 调用 | 顶层 blur |
| `clearPolyFillPreview` | L31928 / L31937 | 调用 | 顶层 pointerleave ×2 |
| `updatePolyFillPreview` | L31811 | 绑定 | `window.addEventListener("pointermove", …)` |
| `refreshPolyFillPreviewFromLastPointer` | L27199 / L27203 / L27207 | 调用 | 顶层 polyBrush 三输入 `input` 监听（offset/width/spacing） |
| `refreshPolyFillPreviewFromLastPointer` | L29085 | 调用 | 顶层 keydown（Shift 按下，poly 工具） |
| `beginPolyBrushPointer` | L31912 | 绑定 | `renderer.domElement.addEventListener("pointerdown", …, true)` |
| `finishPolyAltDelete` | L31847 | 绑定 | `window.addEventListener("pointerup", …, true)` |
| `updatePolyBrushStroke` | L31812 | 绑定 | `window.addEventListener("pointermove", …, true)` |
| `finishPolyBrushStroke` | L5809 | 调用 | `setActiveTool`：切出 poly 时 cancel |
| `finishPolyBrushStroke` | L28979 | 调用 | 顶层 keydown（Escape cancel） |
| `finishPolyBrushStroke` | L29275 | 调用 | 顶层 blur cancel |
| `finishPolyBrushStroke` | L31835 / L31862 | 绑定 | pointerup / pointercancel（capture） |
| `createPolyEditObjects` | L19906 | 调用 | `createCurveObjects` poly 分支（curve-objects 脊柱） |
| `rebuildPolyEditObjects` | L20375 | 调用 | `updateCurveObjects` poly 分支（curve-objects 脊柱） |

> 另有顶层 `pointercancel` 内联（L31863、L29276）直接写 `draw.state.polyAltDeleteCandidate = null`——不引用函数，仅走 deps.draw，无需改。

## 4. deps 注入清单

### 4.1 模块级 import（免注入）
- `import * as THREE from "three"`（ensurePolyFillPreview / projectPolyRelaxPoint / updatePolyBrushStroke / populatePolyEditObjects 等）。
- `./poly-topology.js`：`normalizePolyFaces, appendPolyQuad, deletePolyVertex, deletePolyEdge, deletePolyFaceAndOrphans, polyFillCandidate, relaxPolyPoints, polyMeshBuffers`（refreshPolyMesh / polyMeshEdges / deletePolyComponent / appendPolyStrokeRow / polyFillCandidateForEvent / updatePolyBrushStroke / createPolyGeometry(若迁)）。全部 8 个已被 app.js L255-263 import，迁移不新增依赖面。

### 4.2 注入 deps（解包后的 .state 代理）
**stores（4）**：`sel`（=sel.state）、`draw`（=draw.state）、`sculptState`（=sculptState.state）、`hairState`（=hairState.state，仅 addPolyLock 的 `activeHairMaterialId`）。

**共享对象（8）**：`locks`、`curveGroup`、`renderer`、`raycaster`、`undoHistory`、`lastPointer`、`polyRelaxProjectionRaycaster`、`guideApi`（仅 `beginPolyBrushPointer` 的 `guideApi.controlPointIsSelected`）。

**app.js helper（24）**：

| helper | 使用方 |
|---|---|
| `getSelectedLock` | selectedPolyMesh |
| `addLock` / `normalizeHairLayer` / `selectLock` / `updateCount` | addPolyLock |
| `renderLockList` | addPolyLock, refreshPolyMesh |
| `drawSurfaceHitFromEvent` / `worldNormalAtHit` | polySurfaceSample |
| `rayFromViewportEvent` | polyTargetAtEvent |
| `fitPointAttributes` | refreshPolyMesh, addPolyPoint |
| `updateLockGeometry` / `updateCurveObjects` | refreshPolyMesh（curve-objects 脊柱反向调用） |
| `updateTopologyStats` | refreshPolyMesh |
| `pushUndoState` | fillPolyGap, deletePolyComponent, updatePolyBrushStroke, finishPolyBrushStroke |
| `updateHistoryButtons` | finishPolyBrushStroke |
| `updateInteractionLocks` / `updatePlacementStatus` | beginPolyBrushPointer, finishPolyBrushStroke |
| `activeStrokeSurfaceValue` | polyRelaxSurfaceObjects, projectPolyRelaxPoint |
| `liveSurfaceGuide` / `liveSurfaceStrand` / `selectedCurveLatticeGuide` / `headMeshes` | polyRelaxSurfaceObjects |
| `contextualPlaneAtOrigin` | projectPolyRelaxPoint |
| `strandVisibleForDisplay` | rebuildPolyEditObjects |

**DOM（4，顶层 const）**：`viewportDrawLayerInput`（addPolyLock）、`polyBrushWidthInput`（addPolyLock / polyFillCandidateForEvent / appendPolyStrokeRow / updatePolyBrushStroke / projectPolyRelaxPoint）、`polyBrushSpacingInput`（polyFillCandidateForEvent / updatePolyBrushStroke）、`polyBrushSurfaceOffsetInput`（polySurfaceSample / projectPolyRelaxPoint）。`polyBrush*Value` 三元素只在 app.js 顶层 input 监听里读写，不注入。

## 5. 硬障碍检查

1. **`__AHS_TEST_SEAM`（L32474–32529）**：仅挂 tip/bone/strand 函数（beginTipSubBoneRotate、tipWidthEdgePosition、strandFrameAt 等），**不引用本批 28 个函数** → 无需 seam 重导出。
2. **curve-objects-core 边界**：`createCurveObjects`（L19905）/`updateCurveObjects`（L20372）/`updateLockGeometry`（L21152）/`syncLockFromCurve`（L21042）/`rebuildLockGeometry`（L21076）全部留在 app.js。G7 只做两件事：(a) `refreshPolyMesh` 反向调用 `deps.updateLockGeometry/updateCurveObjects`；(b) 脊柱在 L19906/L20375 改调 `polyToolsApi.createPolyEditObjects/rebuildPolyEditObjects`。无函数需要跨批移动。
3. **undo/snapshot 边界**：本批不触碰快照序列化（polyFaces 的序列化/恢复在 app.js 脊柱 L12087/12577/12701/13680/13709/13777/13863，保留）。undo 交互仅经 `deps.pushUndoState` / `deps.undoHistory.pop` / `deps.updateHistoryButtons`，undo-store 耦合为零。
4. **引导时序**：28 个函数在 app.js **无任何顶层调用**（无 `name(`、无裸引用除事件绑定外）→ 不存在 bootstrap 期 api 调用；deps 可一次性 `Object.assign` 批量填充，无需渐进填充。
5. **跨批次重接**：`modules/*.js` 对本批 28 个函数名**零引用**（Select-String 全模块扫描无命中）→ 迁移不破坏其它模块。`guideApi.controlPointIsSelected` 经 deps 注入，不产生模块间静态 import。
6. **3b/3c 替换验证清单要点**（执行时逐项扫）：(1) `.state` 双重替换——本批函数体直接写 `sel.state/draw.state/sculptState.state/hairState.state`，迁入模块后统一改 `deps.sel/…`，对象属性名（如 `lock.geometryType`、`stroke.pointIndex`）**不得**被替换；(2) 裸引用归零——迁后 app.js 只允许 22 处 `polyToolsApi.X`；(3) 无 spread 用法（已验证）；(4) `obj.name(` 属性调用（如 `renderer.domElement.setPointerCapture`、`geometry.setAttribute`）不受影响；(5) app.js 的 poly-topology import（L255-263）**必须保留**（L12087/13680 的 `normalizePolyFaces`、L9648 的 `polyMeshBuffers` 仍在 app.js 用）。

## 6. 边界存疑点

1. **`createPolyGeometry`（L9647–9672，26 行）**：poly 几何构建（用 `polyMeshBuffers`），但位于两个已知区间之外、夹在 G4（curve-surface）代码中间，唯一调用点是 `createBaseHairGeometry`（L10268，G3 分发器）。**建议**：随 G7 迁出可选（仅 1 处接线），或留待 G4 批次一并处理；本报告按「不迁、留待 G4」计数。
2. **`drawSampleFromHit`（L16103）/`updateDrawStrandBrushCursor`（L16117）**：draw strand 笔刷子系统（不是 poly），**不迁**。
3. **`strandWidthEdgeFrameAt`（L20271）/`transportedStrandWidthEdgeFrame`/`strandWidthEdgeSample`/`strandWidthEdgePoints`（L20278–20310+）**：strand 宽度边几何（strand 子系统），**不迁**——G7 区间 L20167–20270 恰在其前截止。
4. **poly 数据脊柱**：`polyFaces`/`pointSurfaceNormals`/`geometryType:"poly"` 在 app.js 的 import/快照/统计/导出/选择修饰分支（L12009/12087/12101/12577/12701/12886/13680/13709/13777/13863/21718/22047/22080/22193/25685/30352/30415/30446/31526 等）全部保留；模块只持有 lock 引用并读写其字段。
5. **工具系统分支**：`setActiveTool` 的 poly 分支（L5794/5808/5812/5848）、polyBrushToolPanel 显隐（L22080/22193）、状态栏文案（L19129）——app.js UI/工具层，不迁。

## 7. 建议装配点

- **模块**：`modules/geometry/poly-tools.js`（约 640 行），导出 `export function createPolyToolsApi(deps)`，顶部直接 `import * as THREE from "three"` + `import { … } from "./poly-topology.js"`（版本号后缀 `?v=…` 遵循现有约定）。
- **api 创建**：仿 `guideDeps` 模式——`const polyToolsDeps = {}; const polyToolsApi = createPolyToolsApi(polyToolsDeps);` 置于 app.js **L1510 附近**（guideApi 创建之后）。本批无引导期调用，可延后到任意位置，但须在 L31811 事件绑定之前（顶层求值顺序天然满足）。
- **deps 批量填充**：`Object.assign(polyToolsDeps, { … })` 放在最后一个依赖定义之后——DOM const（polyBrush*，L2381-2387）已全，推荐紧邻 guideDeps 填充处（L5362）或 L2400 附近；函数 helper 声明提升无时序依赖。
- **接线改造（22 处）**：事件绑定 6 处（L31811/31812/31835/31847/31862/31912）改 `polyToolsApi.*`；调用点 16 处按 §3.2 表改 `polyToolsApi.*`；polyBrush 输入监听（L27197-27207）内 `refreshPolyFillPreviewFromLastPointer()` 改 `polyToolsApi.refreshPolyFillPreviewFromLastPointer()`。
- **模块内 59 条调用**直接同名调用；**不导出**给 app.js 的模块级内部函数。
- **回归**：`node --check app.js` + `node --check modules/geometry/poly-tools.js` + `verify-smoke`（layered-side-bun.ahs，10/11 基线）对比 HEAD；重点手测 poly 画刷 draw/vertex/relax、Shift fill 预览、Alt 删除、Escape cancel、切工具/pointerleave/blur 清预览。
- **估算**：净减 ~477 行；难度 **低-中**（自洽工具集、外部接线点少、无引导/无 seam/无跨模块引用，唯一注意点是 §5.6 的替换陷阱与 curve-objects 两处接线）。

---

## 8. ?????G7 ?????2026-08-12?

> ????Codex??? 0.2.59-refactor?HEAD=baaab62 G4?????????? commit??????/????**????? app.js?31,453 ??**?????? ?2 ?????32,530 ???? G4 ????????????????????????

### 8.1 ????
- **???**?`modules/geometry/poly-tools.js`?714 ??? 28 ?? 663 ???? + ?/?? 51 ????? `createPolyToolsApi(deps)`?
- **????/??**?28 ? / 636 ??L15446?16004 ? 23 ? / 537 ? + L19151?19253 ? 5 ? / 99 ???? ?2 ???????
- **???**????? + deps ???4 store ?? .state?8 ?????24 helper?4 DOM ???????? 1 ???????? `Poly Mesh ${sel.state.lockIndex}` ?????????? import?`THREE` + `./poly-topology.js`?7 ??normalizePolyFaces/appendPolyQuad/deletePolyVertex/deletePolyEdge/deletePolyFaceAndOrphans/polyFillCandidate/relaxPolyPoints?**??** polyMeshBuffers????? app.js ? createPolyGeometry ???
- **???????**?22 ??16 ?? + 6 ????????? `polyToolsApi.X`?app.js ??????
- **app.js ??**?31,453 ? 30,841?-636 ?? -2 ?? +51 ??/import/batch??
- **deps ???40?**?stores 4?sel/draw/sculptState/hairState ? .state ???+ ?? 8?locks/curveGroup/renderer/raycaster/undoHistory/lastPointer/polyRelaxProjectionRaycaster/guideApi?+ helper 24 + DOM 4?viewportDrawLayerInput/polyBrushWidthInput/polyBrushSpacingInput/polyBrushSurfaceOffsetInput??Object.assign(polyToolsDeps, {...}) ?? guideDeps ?????? L5527 ????????? 40/40 ????????
- **??**?`import { createPolyToolsApi } ... ?v=20260812-1`?L4??`const polyToolsDeps = {}; const polyToolsApi = createPolyToolsApi(polyToolsDeps);`?L1521-1522?curveSurfaceCreate ?????? L5537-5578?

### 8.2 ?????? ?6 ???
- `createPolyGeometry`?app.js L9763?**??**?? G4 ??/strand ????????? createBaseHairGeometry ???
- `drawSampleFromHit` / `updateDrawStrandBrushCursor` / `strandWidthEdge*` **??**?
- `__AHS_TEST_SEAM` ????? 28 ?? ? ? seam ????
- modules/*.js ??? 28 ?????? ? ????????scalpBuilderDeps/guideDeps/curveSurfaceCreateDeps ??????

### 8.3 ???7 ??
1. **?????????**?app.js ? 28 ? `(?<![A-Za-z0-9_$.])name(?![A-Za-z0-9_$])` ?? 0 ???`polyToolsApi.` ? 22 ?????/??? tokenizer ?????? 59 ????????
2. **store ?? .state**??? `deps.(sel|draw|sculptState|hairState).state` ?? 0???? `draw: draw.state` ??????
3. **????**?L1?5536?????? 28 ? + polyToolsApi ???? L1522 ? api ?????22 ???????? ? ? L5874??? L5527 ???? ???? api ????? Object.assign ???
4. **?????**?modules/*.js ???? 28 ? 0 ???app.js ?? deps ?????????
5. **??**?app.js ? poly-tools.js ? UTF-8 ? BOM?CRLF?0 ? LF??? ASCII ??? HEAD=??=1476????? 0 ? ASCII????????
6. **??**?`node --check app.js` ? `node --check modules/geometry/poly-tools.js` ????
7. **??**?`node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs --port 8091 --cdp-port 9229` ? **10/11 PASS**?? G4 ??????? FAIL ??? "branch bridge smooth is per-lock"??????ahs ?? 88 locks?selection PASS?0 ???

### 8.4 ??
- ?????? G4 ? 32,530 ?????? HEAD ?? G4 ? ??? app.js ???? 28 ???15446-16004 / 19151-19253????????? ?2 ??? 636 ????
- ????? ``Poly Mesh ${sel.state.lockIndex}`` ????????????????? ? ?? `${...}` ?????????
- poly-topology import ?? 7 ?????????polyMeshBuffers ?? app.js?createPolyGeometry ????
- verify-smoke ?? --port ??? NaN??? bug??8080/9223 ??? ? ? 8091/9229?
