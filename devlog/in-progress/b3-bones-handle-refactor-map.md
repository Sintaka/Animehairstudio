# B3 骨骼域迁出 — 视口 handle 函数引用图（骨骼批次）

> 目标：把 createCurveObjects / updateCurveObjects 内的视口 handle 段（panelSplit / panelSegment / panelTip / tipWidth / strandSplit / branchSweepStart handle + tip 法线箭头 + 内嵌 syncTipNormalArrow）从 curve-objects 脊柱迁到 `modules/bones/bone-view-handles.js`（`createBoneViewHandlesApi(deps)`），app.js 只保留 createCurveObjects / updateCurveObjects 骨架、上下文标志计算、返回对象装配与 dispose 接线。
> 执行（分析）：2026-08-12 · 分支 `0.2.59-refactor` · HEAD `71b8a02`（B0 已提交，G1-G7 全落地）· app.js 27,477 行 / FUNCTION_INDEX lineCount 27,478 口径一致 · **只读分析，未改动 app.js/modules/\***。
> 行号口径：**全部为当前 HEAD 实测**。plan（geometry-bones-extraction-plan.md）32,530 行快照区间已重定位：
> - createCurveObjects **L15978-16238**（plan 口径 L20036-20066）、updateCurveObjects **L16295-16748**（plan 口径 L20372-20613）、syncTipNormalArrow **不再是独立函数**——现为 updateCurveObjects 内 panelTipHandles.forEach 的嵌套闭包 **L16537-16551（15 行）**（plan 口径 L20614-20826 的 213 行函数在当前结构不存在）；createCurveNormalIndicator L16750-16771；createSplitControlHandle L3278-3290；disposeCurveObjects L25033-25119；seam __AHS_TEST_SEAM **L27421-27476**。
> - 纠缠总量实测 **487 行（含 dispose 54；不含为 433）**，与 plan 的 ~480 吻合；差异只在函数级拆分口径（plan 把 syncTipNormalArrow 单列为 213 行，当前是 15 行闭包 + 266 行 update 块整体）。

## 0. 边界判定（核心）

- **迁出（B3，共 487 行）**：
  1. **createCurveObjects handle 段** L16084-16215（132 行）：panelSplitHandles/panelSplitLines、panelSegmentHandles、panelTipHandles/panelTipLines/tipNormalArrows（tip sub-bone handle + 法线箭头）、tipWidthHandles/tipWidthLines、strandSplitHandle/strandSplitLine、branchSweepStartHandle 创建 + `lock.panelSplits = clonePanelSplits(...)` 归一化（含 `lock.panelSplits` 就地规范化副作用）。
  2. **updateCurveObjects handle 更新段** L16471-16736（266 行）：splits 缓存、panelSplitHandles/panelSplitLines（zipper）、panelSegmentHandles（splitBonesFor）、tipChains/tipForkTs 缓存、panelTipHandles + **内嵌 syncTipNormalArrow**、panelTipLines、tipWidthHandles、tipWidthLines、`panelTipStrand.updateTipHighlight(lock)`、strandSplit、branchSweepStartHandle。
  3. **createCurveNormalIndicator** L16750-16771（22 行）：B3 tip 箭头 + 脊柱 arrows（L16077）共用 → 整体随迁，脊柱 L16077 改调 `api.createCurveNormalIndicator()`。
  4. **createSplitControlHandle** L3278-3290（13 行）：B3 专属（5 处调用全在 handle 段）→ 随迁。
  5. **disposeCurveObjects B3 尾段** L25047-25100（54 行，**可选**）：dispose 内 B3 对象释放（panelSplit/panelSegment/panelTip/tipWidth/strandSplit/branchSweepStart + tipNormalArrows + **tipHighlightMesh**）。
- **留脊柱（curve-objects-core 本身）**：
  1. createCurveObjects 骨架（129 行）：poly 分支、group/line、widthEdgeLines、surfaceObjectAnchor、handles（控制点）、arrows（点法线）、返回对象装配。
  2. updateCurveObjects 骨架（188 行）：poly 分支、**上下文标志前置块 L16305-16315**（brushDebugVisible / sculptBrushHelpersSuppressed / tipUiActive / brushBonesOnly）、line 材质/几何、surfaceObjectAnchor、widthEdgeLines、handles、arrows、group.visible（L16738-16744）、wireOverlay。
  3. **syncLockFromCurve L17000-17033**：不引用任何 B3 标识符，仅末尾调 updateCurveObjects → 零冲突。
  4. disposeCurveObjects 其余部分（line/handles/arrows/surfaceObjectAnchor/widthEdgeLines/edgePickers 等）。
  5. 共享助手（B3 与脊柱/B2 共用，留 app.js，经 deps 注入）：clonePanelSplits（L1314）、isPanelGeometry（L1298）、panelSplitControlPoint（L15796）、strandSplitControlPoint（L15760）、strandSplitProfileData（L15747）、strandGeometryCurve（L8344）、strandGeometryFrameAt（L8370）。

## 1. 迁出清单（当前 HEAD 行号）

| 段/函数 | 行区间 | 行数 | 说明 |
|---|---|---|---|
| createCurveObjects handle 段 | 16084-16215 | 132 | 6 类 handle + tip 法线箭头创建；随迁闭包外全部局部变量 |
| updateCurveObjects handle 段 | 16471-16736 | 266 | 含内嵌 syncTipNormalArrow（16537-16551，15 行） |
| createCurveNormalIndicator | 16750-16771 | 22 | 完整函数随迁，脊柱 L16077 改调 api |
| createSplitControlHandle | 3278-3290 | 13 | 完整函数随迁（B3 专属） |
| disposeBoneViewHandles（可选） | 25047-25100 | 54 | 含 tipHighlightMesh（panelTipStrand 模块创建） |

**函数总数**：迁出完整顶层函数 2（createCurveNormalIndicator、createSplitControlHandle）+ 新模块 API 函数 2-3（createBoneViewHandles、updateBoneViewHandles、可选 disposeBoneViewHandles）+ 内嵌闭包 syncTipNormalArrow 1（随 update 块整体迁出，不单独计）。涉及的脊柱函数 createCurveObjects / updateCurveObjects / disposeCurveObjects 原地改薄，不迁出。

## 2. 引用图 — 外部调用点（grep 带行号）

- **createCurveObjects**：3 直接调用，0 模块/seam 引用。
  - L9674（addLock，创建路径）、L11436（restoreLock，加载路径）、L11849（rebuildCurveObjects）。
- **updateCurveObjects**：**36 直接 + 7 模块 deps 注入 + 1 seam = 44**（另有 3 处 options passthrough）。
  - 直接（app.js 内，行号→宿主）：4357 selectReferenceImage、4512 refreshSelectionModeVisuals、6049 setActiveTool、6115 setHierarchyEditing、6127 setProportionalEditing、6180 refreshProportionalPreview、6852 finishStrandObjectTransform、6901 selectSurfaceObjectAnchor、6987 finishSurfaceObjectTransform、11163 reapplySelectionAfterStateRestore、11851 rebuildCurveObjects、14543 finalizeDrawnLockSelection、15410 applyAltClickCandidate、15583 selectPointsInMarquee、17050 rebuildLockGeometry、17467 refreshStrandCurveSelectionVisuals、18276 selectStrandGroup、18295 selectCurvePoint、18494 editSelectedLocks、20064 setControlPointDisplaySize、25177 applyTipSubBoneTransform、25219 beginPanelSplitHandleDrag、25301 beginPanelSplitHandleDrag、25342/25384/25439/25482/25521 updatePanelSplitHandleDrag、25534 endPanelSplitHandleDrag、25825 refreshStrandControlPointSelection、26428 applySubBoneBrushSample、26511 beginStrandWidthEdgeDrag、26541 updateStrandWidthEdgeDrag、26577 finishStrandWidthEdgeDrag、27023/27030 updateControlPointHover。
  - 模块注入（7）：L2483 curveSurfaceCreateDeps、L2540 sculptGeomDeps、L3653 scalpBuilderDeps、L5598 guideDeps、L5646 polyToolsDeps、L9190 taperEditorDeps、L9858 branchRegion。
  - seam：L27436（updateCurveObjects 保留脊柱，B3 无需新 seam 重导出）。
  - passthrough（非调用）：L10029 / L18490 / L18501（`updateCurveObjects: options.updateCurveObjects`）。
- **syncTipNormalArrow**：0 外部调用（仅 update 块内 4 处 L16556/16562/16570/16596）。
- **createCurveNormalIndicator**：2（L16077 脊柱 arrows、L16130 B3 tip 箭头）。
- **createSplitControlHandle**：5（L16102/16115/16155/16195/16202，全在 B3 create 段）。
- **disposeCurveObjects**：3 调用（L11213 restoreLock、L11846 rebuildCurveObjects、L25003 removeLocks）+ B3 尾段 L25047-25100。

## 3. deps 清单

**模块级可 import（静态导出，直接 import）**：
| import | 来源 |
|---|---|
| `THREE` | `"three"` |
| `splitBonesFor` | `./bone-model.js?v=...`（同域，B0 已就位） |
| `TIP_WIDTH_CONTROL_POINTS` | `../geometry/panel-tip-strand.js?v=...`（静态常量；迁出后 app.js L6 import 可删该项） |

**createBoneViewHandlesApi(deps) 注入（app.js 批填）**：
| deps | app.js 位置 | 类别 |
|---|---|---|
| `panelTipStrand` | L1537 实例 | 模块实例（splitTipForSegment/splitForkT/tipChainFrameAt/tipWidthControlPlacement/tipWidthEdgePoints/updateTipHighlight） |
| `sculptState: sculptState.state` | L707 | store .state（panelSplitDrag/panelTipSelection/tipSubBoneRotateDrag/branchSweepStartDrag） |
| `sel: sel.state` | L1805 | store .state（selectedId/activeTool） |
| `transformControls` | L505 | DOM/全局对象（tip handle preserveDragRotation L16580） |
| `clonePanelSplits` | L1314 | app.js 顶层 helper |
| `isPanelGeometry` | L1298 | app.js 顶层 helper |
| `panelSplitControlPoint` | L15796 | app.js 顶层 helper（脊柱/B2 共用） |
| `strandSplitControlPoint` | L15760 | app.js 顶层 helper（B2 共用） |
| `strandSplitProfileData` | L15747 | app.js 顶层 helper（B2 共用） |
| `strandGeometryCurve` | L8344 | app.js 顶层 helper |
| `strandGeometryFrameAt` | L8370 | app.js 顶层 helper |

**ctx 参数（不注入，由脊柱前置块 L16305-16315 计算后传入）**：`{ brushDebugVisible, sculptBrushHelpersSuppressed, tipUiActive, brushBonesOnly }`——这 4 个标志同时被脊柱（handles/arrows/group.visible）与 B3 段使用，模块内不重复计算。
**不需要**：sculpt-geometry.js（brushDebugVisible 经 ctx 传入）、curve-math、app-config；create 段无任何 store 依赖。

## 4. 硬障碍检查

1. **`__AHS_TEST_SEAM`（L27421-27476）**：不引用任何 B3 迁出函数名（仅 updateCurveObjects/clonePanelSplits/isPanelGeometry/strandVisibleForDisplay/materializeSplitBones，均留脊柱/模块可用）→ **B3 无需新增 seam 重导出**。但 `scripts/verify-tip-select.mjs` 直接读 `lock.curveObjects.*`（panelTipHandles/tipWidthHandles/panelSplitHandles/panelSegmentHandles/strandSplitHandle）与 userData、并调 `t.updateCurveObjects(lock, {visible:true})` → **回归契约 = curveObjects 字段名 + userData 字段名 + 可见性语义 + seam.updateCurveObjects**，逐字搬移逻辑即满足。
2. **curve-objects-core 边界**：B3 新函数只被脊柱 createCurveObjects/updateCurveObjects 各 1 处调用，不替换任何现有函数名；syncLockFromCurve 零引用；updateCurveObjects 44 个外部触点在脊柱，全部无感。
3. **B1/B2 边界**：B1/B2 只**读** handle 数组 + userData + 调 updateCurveObjects（脊柱），不创建。B3 须保持字段名：curveObjects.{panelSplitHandles,panelSplitLines,panelSegmentHandles,panelTipHandles,panelTipLines,tipNormalArrows,tipWidthHandles,tipWidthLines,strandSplitHandle,strandSplitLine,branchSweepStartHandle}；userData.{panelSplitIndex,panelTipIndex,panelTipPoint,tipWidthSegment,tipWidthSide,tipWidthIndex,strandSplitHandle}（B2 另写 tipSubBoneHandle/panelSegmentIndex，不在 B3 创建）。
4. **引导期**：createCurveObjects/updateCurveObjects 全部调用点都在运行期函数内（addLock L9478 / restoreLock L11221 / rebuildCurveObjects / rebuildLockGeometry 等），**无顶层 boot 直调**；api 实例在 L1548 创建、deps 在 L16889 批填，均早于首次用户交互。无冲突。
5. **跨批次重接**：0 处现有模块需改（B3 函数名全新、只被脊柱调）；B1/B2 落地后契约不变；TIP_WIDTH_CONTROL_POINTS 的 app.js import 项可删（唯一使用点 L16154 随迁）。

## 5. 输出建议

- **模块文件**：`modules/bones/bone-view-handles.js`（`createBoneViewHandlesApi(deps)` 返回 `{ createBoneViewHandles, updateBoneViewHandles, disposeBoneViewHandles?, createCurveNormalIndicator, createSplitControlHandle }`）。
- **装配点**：
  - import：app.js L14（bone-model import）之后加 `import { createBoneViewHandlesApi } from "./modules/bones/bone-view-handles.js?v=..."`。
  - api 实例：L1547 sculptGeom 之后（L1548）：`const boneViewHandles = createBoneViewHandlesApi(boneViewHandlesDeps);`（`boneViewHandlesDeps = {}` 先声明）。
  - deps 批填：L16888 strandGeometryDeps 批之后（L16889）`Object.assign(boneViewHandlesDeps, { ...§3 11 项 });`——所有 deps 此时已定义（panelTipStrand L1537、sel L1805、transformControls L505、各 helper ≤L16750）；早于首次 addLock/restoreLock。
  - 脊柱改薄 3 处：createCurveObjects L16084-16215 → `const boneHandles = boneViewHandles.createBoneViewHandles(lock, group);`（返回对象展开/合并）；updateCurveObjects L16471-16736 → `boneViewHandles.updateBoneViewHandles(lock, { brushDebugVisible, sculptBrushHelpersSuppressed, tipUiActive, brushBonesOnly });`；L16077 arrows 改 `boneViewHandles.createCurveNormalIndicator()`。可选第 4 处：disposeCurveObjects L25047-25100 → `boneViewHandles.disposeBoneViewHandles(lock.curveObjects);`。
- **外部调用点数量**：createCurveObjects 3 + updateCurveObjects 36（直接）+ 7（模块注入）+ 1（seam）= **47 处现有触点**（全部在脊柱，B3 落地后无感）；B3 新函数仅脊柱 3-4 处新调用。
- **净减行估算**：毛行 487（含 dispose）/ 433（不含）；app.js 净减 ≈ **370-410**（扣 ~30 行 import/api/deps/接线脚手架；按 plan ×0.75 口径 ≈ 365）。高于 plan 的 ~250——plan 为旧行号口径且保守（其 ~480 纠缠总量与本批实测 487 一致）。
- **难度**：**中高**（与 plan 一致）。主要难点：上下文标志跨脊柱/B3 共享（ctx 传参）、createCurveNormalIndicator 双调用点、dispose 拆分、verify-tip-select 契约、266 行 update 块内嵌闭包。
- **边界存疑点**：
  1. plan 把 syncTipNormalArrow 当 213 行独立函数——当前实为 15 行闭包；以「update handle 段整体迁出」为准，不单拆。
  2. **branchSweepStartHandle**：非 bone 域（拖拽回调在 geometry 域 branch-region-panel.js），但创建/更新与 handle 段同块且共用 createSplitControlHandle → 建议随 B3 迁，零重接；亦可留脊柱（2 处小段，~27 行）——留则 create 段失去连续性。
  3. **panelSplitHandles/panelSplitLines（zipper）**：panel 域非 bone，但属 B1/B2 报告的 B3 契约且与 tip/segment 段同块连续 → 随迁。
  4. **dispose 段**（54 行）：可随迁 `disposeBoneViewHandles`；其中 tipHighlightMesh 实为 panelTipStrand.updateTipHighlight 创建，理想归属是 panel-tip-strand.js 自释放（跨模块重接，超出本批）——本批先随 B3 dispose 带走。
  5. **createCurveNormalIndicator** 脊柱 L16077 共用：随迁后脊柱须改调 api（1 行），保持单一实现；备选方案是留脊柱经 deps 注入（app.js 净减 -22 行）。
  6. **上下文标志**：若模块内自行重算（需注入 sculptBrushToolActive/componentEditModeActive/strandVisibleForDisplay/sculptGeom）会引入重复计算与更宽 deps 面 → 坚持脊柱算、ctx 传。
- **回归**：`node --check` app.js + bone-view-handles.js + `scripts/verify-smoke.mjs`（layered-side-bun.ahs，10/11 基线）+ **`scripts/verify-tip-select.mjs`（?ahstest=1，B3 契约强相关，必须全过）**。

## 6. 备注（与 B1/B2 报告衔接）

- B1/B2 报告页首「工作区 27,477 行」即当前已提交 HEAD：seam L27421、beginTipSubBoneRotate L25119、updatePanelSplitHandleDrag L25306 等本报告不再偏移。
- B1/B2 落地后（segment-control.js / bone-interaction.js）读 handle 契约不变；B3 不依赖 B1/B2 是否落地，可独立 commit。建议顺序维持 plan：B1 → B2 → B3（或 B3 先于 B2，两者互不阻塞；B3 先做可把 handle 契约收敛进模块，供 B2 引用）。
## 执行记录（B3 落地，2026-08-12 · 分支 0.2.59-refactor · HEAD e9ce330 · app.js 26,761 → 26,288）

### 实际迁出范围（e9ce330 实测行号，毛行 491）

| 段/函数 | 行区间（e9ce330） | 行数 | 去向 |
|---|---|---|---|
| createCurveObjects handle 段 | 16149-16280 | 132 | createBoneViewHandles |
| updateCurveObjects handle 段（含内嵌 syncTipNormalArrow 15 行闭包） | 16536-16801 | 266 | updateBoneViewHandles |
| createCurveNormalIndicator | 16815-16839 | 25 | 完整随迁 |
| createSplitControlHandle | 3288-3301 | 14 | 完整随迁 |
| disposeCurveObjects B3 尾段（含 tipHighlightMesh） | 25026-25079 | 54 | disposeBoneViewHandles |

- 新模块 **modules/bones/bone-view-handles.js（538 行）**：createBoneViewHandlesApi(deps) → createBoneViewHandles（L56）/ updateBoneViewHandles（L204）/ disposeBoneViewHandles（L474）/ createCurveNormalIndicator（L30）/ createSplitControlHandle（L15）；内嵌闭包 syncTipNormalArrow 随 update 段整体迁出（不单拆）。
- app.js **26,761 → 26,288 行**（净减 473；505 删除 − 32 新增）；模块函数体由 e9ce330 逐字节抽取，仅做 X → deps.X 标识符改写（create 2 处、update 11 处、dispose 1 处），字符串/注释不触碰，中文逐字节守恒（5 段非 ASCII 158 字符全部原序保留，app.js 非 ASCII −158 一致）。

### 脊柱改薄点（app.js 现行列号，createCurveObjects/updateCurveObjects/disposeCurveObjects 原地改薄未迁出）

1. **L16133** arrows 内 createCurveNormalIndicator() → boneViewHandles.createCurveNormalIndicator()（脊柱共用，随迁后改调 api 保持单一实现）。
2. **L16140** create handle 段 → const boneHandles = boneViewHandles.createBoneViewHandles(lock, group); 返回对象 L16145 改 ...boneHandles 展开（11 字段名原样，零丢失）。
3. **L16386-16391** update handle 段 → boneViewHandles.updateBoneViewHandles(lock, { brushDebugVisible, sculptBrushHelpersSuppressed, tipUiActive, brushBonesOnly });。
4. **L24606** dispose B3 尾段 → boneViewHandles.disposeBoneViewHandles(lock.curveObjects);。
5. 顶层函数 createSplitControlHandle（旧 L3288-3301）、createCurveNormalIndicator（旧 L16815-16839）从 app.js 删除。

### 装配与 deps 时序

- import：app.js L17（bone-model import 之后）createBoneViewHandlesApi；L6 panel-tip-strand import 删除 TIP_WIDTH_CONTROL_POINTS（唯一使用点随迁）。
- api 实例：L1562-1563（boneViewHandlesDeps / boneViewHandles，bonesApi 之后）。
- deps 批填：L16539 Object.assign(boneViewHandlesDeps, {...})，生效行 L16551 });（strandGeometryDeps 批之后，最后一个 dep strandGeometryFrameAt L8380 已定义）。
- 引导期：createCurveObjects/updateCurveObjects 全部调用点在运行期函数内；模块作用域直调（loadBraidMeshPreset 等）不触 curve-objects；首条 boot 路径 updateAttributeEditorMode() L26227 在批填后。无 TDZ。

### deps 清单

- **模块 import 3**：THREE（three）、splitBonesFor（./bone-model.js）、TIP_WIDTH_CONTROL_POINTS（../geometry/panel-tip-strand.js）。
- **注入 11**：panelTipStrand（实例）、sculptState: sculptState.state、sel: sel.state、transformControls、clonePanelSplits、isPanelGeometry、panelSplitControlPoint、strandSplitControlPoint、strandSplitProfileData、strandGeometryCurve、strandGeometryFrameAt。
- **ctx 4 标志（脊柱算、模块收，不重算）**：{ brushDebugVisible, sculptBrushHelpersSuppressed, tipUiActive, brushBonesOnly }——模块内实际使用前 3 个，brushBonesOnly 传入未用（与 map §3 一致）。

### curveObjects 契约保持确认

- 字段名原样：curveObjects.{panelSplitHandles,panelSplitLines,panelSegmentHandles,panelTipHandles,panelTipLines,tipNormalArrows,tipWidthHandles,tipWidthLines,strandSplitHandle,strandSplitLine,branchSweepStartHandle}（createBoneViewHandles 返回对象 → 脊柱 ...boneHandles 展开）。
- userData 原样：panelSplitIndex/panelTipIndex/panelTipPoint/tipWidthSegment/tipWidthSide/tipWidthIndex/strandSplitHandle/lockId。
- 可见性语义原样：update 段逐字搬移；group.visible 装配留在脊柱。
- tipHighlightMesh：仍由 panelTipStrand.updateTipHighlight 创建，dispose 随 B3 带走（跨模块自释放留后续批次）。
- seam：__AHS_TEST_SEAM 不引用随迁函数名（仅 updateCurveObjects/clonePanelSplits/isPanelGeometry 留脊柱）→ **无新增 seam 重导出**；seam.updateCurveObjects 可用。
- CDP 实测（?ahstest=1 + layered-side-bun.ahs，88 strand locks）：11 字段类型全对（8 数组 / 2 对象 / branchSweepStartHandle=null）、updateCurveObjects×3/lock 0 异常、visible 布尔完好、selectLock+update 路径、strandSplitHandle userData+group 成员、脊柱 arrows（api 调用，Group+2 children）、reload dispose 0 异常——**8/8 PASS**。

### 跨批次重接

- 0 处现有模块需改（B3 函数名全新、只被脊柱调）；panel-tip-strand.js / sculpt-geometry.js / segment-control.js / bone-interaction.js 均无对 B3 函数名的引用。
- B1/B2 只读消费 handle 数组 + userData + 调 updateCurveObjects（脊柱）→ 契约不变。

### 踩坑

1. **模块脚手架重复函数声明行**：初版模板在 createBoneViewHandlesApi 后先打 function createSplitControlHandle() { 再把含声明行的函数数组 spread 进去 → 声明行重复；已删除模板行（函数数组自带声明）。
2. **尾部空行漂移**：迁移脚本 join 后多出一个 EOF 空行；已按原工作树 }\r\n\r\n（HEAD blob }\n\n + autocrlf）修正，round-trip 逐字节精确匹配（重建预期文件 vs 工作文件 EXACT MATCH=true）。
3. **CDP 验证脚本 ROOT 硬编码正斜杠 403**：Windows path.normalize 返回反斜杠路径，与正斜杠 ROOT startsWith 不匹配 → 静态服务器 403 → 页面不 boot（no canvas / no seam / 0 exceptions）；改 path.resolve("D:/code/dev/web/Animehairstudio") 后正常。另：临时脚本放 TEMP 时 import.meta.dirname 解析 ROOT 到 Local 目录，同样导致 404——验证脚本需以 repo 内 path.resolve 为准。
4. **verify-tip-select 环境限制**：layered-side-bun.ahs 无 panel-type lock，found split panel lock 在基线（HEAD）与本次改动**同样 FAIL**（非回归，同 B1/B2 记录）；B3 契约改用自写 CDP 8 项检查（上表）验证。

### 7 项验证结果

1. 裸引用静态扫描归零：app.js createSplitControlHandle/createCurveNormalIndicator 仅 boneViewHandles. 前缀（0 bare）；模块 11 deps 仅 deps. 前缀（0 bare）；TIP_WIDTH_CONTROL_POINTS app.js 0 命中。字符串/注释/模板剥离、对象键 (?!\s*:) 排除、spread/属性访问排除。
2. store 代理双重 .state：app.js 与模块均无 deps.X.state / .state.state；模块只读 deps.sculptState.* / deps.sel.*。
3. 引导期 deps 时序：api L1563 创建、deps 批填 L16551 生效；模块作用域直调（loadBraidMeshPreset 等）不触 curve-objects；首条 boot 路径 updateAttributeEditorMode L26227 在批填后。
4. 跨批次重接：0 处；seam 无新增重导出；TIP_WIDTH_CONTROL_POINTS import 项删除。
5. 编码：app.js / bone-view-handles.js 均 UTF-8 无 BOM、纯 CRLF（app.js 26,288 CRLF/0 bareLF；模块 538 CRLF/0 bareLF）；中文逐字节守恒（5 段非 ASCII 158 原序保留；app.js 非 ASCII 343 → 185，差值恰 −158）。
6. 语法：node --check app.mjs + bone-view-handles.mjs 全 0。
7. 执行记录：本节约定。

### 回归

- verify-smoke（layered-side-bun.ahs）**10/11**（与 B1/B2 基线一致；唯一 FAIL 为数据限制 branch bridge per-lock）。
- verify-tip-select：found split panel lock FAIL（环境限制，基线同 FAIL）；B3 契约 CDP 8/8 PASS（含 0 boot 异常）。
- 结构验证：round-trip（HEAD+预期改动 vs 工作 app.js）EXACT MATCH；模块 5 函数体 vs 原段 逐字节比对全部 match（create/update/dispose 仅 deps 改写、两个顶层函数 verbatim）。
