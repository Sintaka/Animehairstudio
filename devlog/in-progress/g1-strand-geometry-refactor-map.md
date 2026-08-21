# 面板/tip strand 几何迁出（G1）— 函数引用图 / Refactor Map

> 生成：2026-08-12 · 分支 `0.2.59-refactor` · 仓库 `D:\code\dev\web\Animehairstudio`
> 约束：仅分析 `app.js`（30,840 行）+ `modules/*.js`，未做任何修改；唯一产出本文档。
> 行号口径：`devlog/FUNCTION_INDEX.json`（2026-08-12 快照，app.js 30,841 行）与当前 app.js 逐函数核对一致；函数体边界用括号配对（跳过参数表、字符串、模板、注释）实测。
> 依据：devlog/archive/geometry-bones-extraction-plan.md 的 G1 行（Godel 盘点区间 L8272–9250、L11488–11566 为 G4/G7 前 32,530 行口径，本表已按当前文件按函数名重定位）。

## 1. 结论速览（TL;DR）

- **候选：26 个顶层函数（连续簇 L8388–9364）+ 10 个嵌套箭头（随父迁），共 36 个函数定义 / 900 行**；另有共享常量 `TIP_WIDTH_CONTROL_POINTS`（L8515）。净减估 **≈675 行**（×0.75，扣 deps 脚手架；计划估 ~620）→ app.js 约 30,840 → ~30,165 行。
- **外部调用点 27 处调用行 / 11 个外部调用者**（10 个命名函数 + 1 个顶层事件绑定 `#resetTaperCurve` click）。
- **已核实无跨批次重接**：G4/G7/guide-system/scalp-builder 及其余 modules/* 对本批 26 个函数名**零引用**；本批函数全部仍留在 app.js，无已被迁走项。
- **硬障碍（唯一大项）：`__AHS_TEST_SEAM`（当前 L30784–30839，任务口径 L31397 已重定位）引用本批 19 个函数** → 迁移后必须 seam 重导出（挂 `g1Api.X`），否则 `verify-tip-select.mjs` 在 `?ahstest=1` 下直接 ReferenceError。
- **建议**：`modules/geometry/panel-tip-strand.js` + `createPanelTipStrandApi(deps)`，单模块（不拆两个）；难度 **中**；与 G2（split）分两批执行。

## 2. 边界判定（关键）

- **归 G1**：L8388–9364 连续簇（`smoothCoincidentPanelNormals` → `createPanelStrandGeometry`，中间夹常量 `TIP_WIDTH_CONTROL_POINTS` L8515）。簇内互调密集（tip 几何函数全被 `createPanelStrandGeometry`/`updateCurveObjects` 消费），不宜再拆两个模块。
- **不归 G1（逐一核实）**：
  1. `tipSideForkFor`（L11443–11451）——是 `renderTaperCurveEditor`（G5）**内部的嵌套闭包**，非顶层函数；随 G5 走，闭包内调用改 `g1Api.tipWidthSideForkT`。
  2. `clipStrandProfilePolygon`（L9366）、`pushOrientedTriangle`（L9389，亦被 G3 用）、`triangulatePolygon3D`（L9400，无调用点=疑似死代码）、`createSplitStrandGeometry`（L9458–9664）→ **G2（split）**。
  3. `createHairCardGeometry`（9664）/ `createConnectedCurveCardGeometry`（9790）/ `createCompoundStrandGeometry`（9873）/ `createBaseHairGeometry`（10221）→ **G3（base/card/compound）**。
  4. `panelSplitControlPoint`（18198）→ strand 控制点编辑簇（未排批），它调用 `surfacePanelPoint`（G1）→ 改 `g1Api`。
  5. `surfaceObjectAnchorPose`（6781）→ surface 对象锚（未排批），它调用 `surfaceLatticeSampleVectors`（G1）→ 改 `g1Api`。
  6. `createCurveObjects`（18380）/ `updateCurveObjects`（18743）/ `syncLockFromCurve`（19413）→ **脊柱保留**，内部 G1 调用改 `g1Api.X`；`syncTipNormalArrow` 是 updateCurveObjects 内嵌闭包，随脊柱。
  7. `beginTipSubBoneRotate`（27754）/ `beginPanelSplitHandleDrag`（27816）/ `updatePanelSplitHandleDrag`（27941）/ `applySubBoneBrushSample`（29342）/ `updatePanelTipHover`（29312）→ **B2（骨骼 UI）**，先由 app.js 调用 `g1Api.X`，B2 迁移时经 deps 注入 g1Api。
  8. `renderTaperCurveEditor`（11430）+ 顶层 `#resetTaperCurve` click（L25058 起）→ **G5（taper 编辑器）**。
- **Godel「约 34 函数」口径差异**：34 ≈ 26 顶层 + 10 嵌套（含函数目录计入的嵌套箭头）− 2 个未计入；Godel 区间上沿混入 G2 的 `clipStrandProfilePolygon`（旧 L9250），下沿 `tipSideForkFor` 实为 G5 闭包。

## 3. 待迁函数清单（26 顶层 + 10 嵌套）

### 3.1 顶层函数（26）

| # | 函数 | 行号区间 | 行数 | 类型 | 职责 |
|---|---|---|---|---|---|
| 1 | `smoothCoincidentPanelNormals` | 8388–8422 | 35 | function | 面板焊点法线平滑（簇内唯一消费者 createPanelStrandGeometry） |
| 2 | `weldPanelGeometryData` | 8424–8468 | 45 | function | 面板顶点焊接（位置/uv/color/weights/quadFaces 重映射） |
| 3 | `surfaceLatticeSampleVectors` | 8470–8483 | 14 | function | surface-lattice 采样包装（点/tangentU/V） |
| 4 | `surfacePanelPoint` | 8485–8506 | 22 | function | 面板表面点（含 shell 厚度偏移，depthCurve 消费） |
| 5 | `splitForkT` | 8508–8513 | 6 | function | 段 fork 参数（zipper 高度） |
| 6 | `tipWidthSideForkT` | 8521–8527 | 7 | function | 单侧宽度 fork |
| 7 | `tipSegmentWeightAt` | 8532–8548 | 17 | function | 发尖子骨骼蒙皮权重（斜线插值） |
| 8 | `tipWidthControlTs` | 8551–8558 | 8 | function | 宽度控制点 t 序列（常量 TIP_WIDTH_CONTROL_POINTS） |
| 9 | `tipWidthCommonForkT` | 8562–8566 | 5 | function | 双侧共用 fork |
| 10 | `tipWidthResetCurve` | 8570–8580 | 11 | function | 段宽度 Reset 曲线 |
| 11 | `tipWidthSpreadGap` | 8588–8599 | 12 | function | 段尖收窄 gap（bone.spread 消费） |
| 12 | `tipWidthMultiplierAt` | 8605–8640 | 36 | function | 宽度采样总入口（bone.taperCurve*/asymmetric 消费） |
| 13 | `tipPanelWidthAt` | 8644–8648 | 5 | function | 视口宽度手柄读同一 multiplier |
| 14 | `buildTipWidthCurve` | 8650–8686 | 37 | function | 侧宽度曲线重建（含 addPoint 嵌套） |
| 15 | `setTipWidthCurveValue` | 8691–8705 | 15 | function | 写入单侧宽度曲线点（编辑入口之一） |
| 16 | `tipPanelFrameAt` | 8710–8739 | 30 | function | 面板并行传输 frame（_tipWidthFrames 缓存） |
| 17 | `tipMainSectionPoint` | 8744–8786 | 43 | function | 段中心表面点（camber/曲率，centerAsymmetric 消费） |
| 18 | `tipSurfaceFrameAt` | 8792–8816 | 25 | function | 发尖子骨骼表面帧（垂直于面板表面） |
| 19 | `tipChainFrameAt` | 8823–8848 | 26 | function | 发尖链自身 frame（rest→authored 旋转） |
| 20 | `tipWidthEdgePosition` | 8854–8881 | 28 | function | 侧边缘点+拖拽轴（tip 链横向） |
| 21 | `tipWidthEdgePoints` | 8885–8896 | 12 | function | 边缘折线点列 |
| 22 | `tipWidthControlPlacement` | 8900–8914 | 15 | function | 宽度手柄视口放置 |
| 23 | `tipHighlightMaterial` | 8916–8936 | 21 | function | 段高亮 overlay 材质（onBeforeCompile） |
| 24 | `updateTipHighlight` | 8938–8993 | 56 | function | 段高亮 overlay 刷新（读 sculptState.state.panelTip*） |
| 25 | `splitTipForSegment` | 8995–9036 | 42 | function | 发尖子骨骼链（rest/authored/twists 消费） |
| 26 | `createPanelStrandGeometry` | 9038–9364 | 327 | function | 面板 strand 几何总入口（splitBones/权重/焊点） |

### 3.2 嵌套箭头（10，随父迁）

| 嵌套函数 | 行号 | 父函数 |
|---|---|---|
| `addPoint` | 8660–8668 | buildTipWidthCurve |
| `segmentWeightAt` | 9069 | createPanelStrandGeometry |
| `addQuad` | 9085–9118 | createPanelStrandGeometry |
| `near` | 9089–9094 | createPanelStrandGeometry（addQuad 内） |
| `panelWidthAt` | 9119–9123 | createPanelStrandGeometry |
| `panelThicknessAt` | 9124–9132 | createPanelStrandGeometry |
| `panelFrameAt` | 9133–9149 | createPanelStrandGeometry |
| `rawPanelPoint` | 9151–9183 | createPanelStrandGeometry |
| `panelPoint` | 9185–9191 | createPanelStrandGeometry |
| `addPatch` | 9193–9296 | createPanelStrandGeometry |

> 另需随迁：顶层常量 `TIP_WIDTH_CONTROL_POINTS`（L8515，仅 tipWidthControlTs 用；但 app.js 脊柱 `createCurveObjects` L18556 也使用 → 模块需 export，app.js import 或保留本地副本）。

## 4. 引用图

### 4.1 模块内互调（迁后为模块内直接调用，无需改）

```
createPanelStrandGeometry → smoothCoincidentPanelNormals(9361), weldPanelGeometryData(9350),
  tipSegmentWeightAt(9069 via segmentWeightAt), splitTipForSegment(9197 via addPatch),
  tipWidthSpreadGap(9325/9328 via uStart/uEnd), tipWidthMultiplierAt(9122 via panelWidthAt),
  surfacePanelPoint(9152 via rawPanelPoint), tipPanelFrameAt(9153 via panelFrameAt)
surfacePanelPoint       → surfaceLatticeSampleVectors(8488)
tipWidthResetCurve      → tipWidthSideForkT(8571), tipWidthCommonForkT(8572), tipWidthControlTs(8575)
tipWidthMultiplierAt    → tipWidthSideForkT(8618)
tipPanelWidthAt         → tipWidthMultiplierAt(8646)
buildTipWidthCurve      → tipWidthSideForkT(8658), tipWidthControlTs(8679), tipWidthCommonForkT(8679)
setTipWidthCurveValue   → buildTipWidthCurve(8692/8693/8703/8704)
tipMainSectionPoint     → tipPanelFrameAt(8745), tipPanelWidthAt(8747/8775x2/8778x2), tipWidthMultiplierAt(8770/8771)
tipSurfaceFrameAt       → tipPanelFrameAt(8793), tipMainSectionPoint(8804/8805/8814)
tipChainFrameAt         → tipPanelFrameAt(8836), tipSurfaceFrameAt(8840)
tipWidthEdgePosition    → splitTipForSegment(8855), tipWidthSpreadGap(8864), tipChainFrameAt(8871), tipWidthMultiplierAt(8873)
tipWidthEdgePoints      → tipWidthSideForkT(8886), tipWidthEdgePosition(8892)
tipWidthControlPlacement→ tipWidthCommonForkT(8901), tipWidthSideForkT(8902), tipWidthControlTs(8907), tipWidthEdgePosition(8911)
updateTipHighlight      → tipHighlightMaterial(8956)
splitTipForSegment      → tipSurfaceFrameAt(9011)
```

### 4.2 外部调用点（27 处调用行 / 11 个调用者，迁后改 `g1Api.X`）

| G1 函数 | 外部调用（行号: 调用者） |
|---|---|
| `createPanelStrandGeometry` | 10229: `createBaseHairGeometry`（G3 入口） |
| `surfaceLatticeSampleVectors` | 6783: `surfaceObjectAnchorPose` |
| `surfacePanelPoint` | 18202: `panelSplitControlPoint` |
| `splitForkT` | 18978: `updateCurveObjects`；29378: `applySubBoneBrushSample`（B2） |
| `tipWidthSideForkT` | 11445: `renderTaperCurveEditor` 内闭包 `tipSideForkFor`（G5） |
| `tipWidthResetCurve` | 25073、25099: 顶层 `#resetTaperCurve` click（G5 UI） |
| `tipPanelWidthAt` | 27903: `beginPanelSplitHandleDrag`（B2） |
| `setTipWidthCurveValue` | 28067、28070、28071: `updatePanelSplitHandleDrag`（B2） |
| `tipChainFrameAt` | 18994: `updateCurveObjects`(→syncTipNormalArrow)；19034: `updateCurveObjects` |
| `tipWidthEdgePosition` | 28041: `updatePanelSplitHandleDrag`（B2） |
| `tipWidthEdgePoints` | 19124: `updateCurveObjects` |
| `tipWidthControlPlacement` | 19091: `updateCurveObjects`；27893: `beginPanelSplitHandleDrag`（B2） |
| `updateTipHighlight` | 19134: `updateCurveObjects`；29316、29339: `updatePanelTipHover`（B2） |
| `splitTipForSegment` | 18975: `updateCurveObjects`；27763: `beginTipSubBoneRotate`（B2）；27881: `beginPanelSplitHandleDrag`（B2）；27998、28039: `updatePanelSplitHandleDrag`（B2）；29359: `applySubBoneBrushSample`（B2） |

> 调用者批次：脊柱 6 处（updateCurveObjects ×6 + syncTipNormalArrow 内 1 处）、B2 5 个函数、G5 2 处、G3 1 处、未排批 2 个（surfaceObjectAnchorPose / panelSplitControlPoint）。

### 4.3 deps 注入清单

**模块级 import（免注入）**：
- `THREE`
- `./curve-math.js`：`sampleArray`（createPanelStrandGeometry）、`sampleTaperCurve`（buildTipWidthCurve）、`sampleAsymmetricTaperCurve`（surfacePanelPoint/tipWidthMultiplierAt/tipMainSectionPoint/createPanelStrandGeometry）、`profileTopologyCenterWeight`（tipMainSectionPoint/createPanelStrandGeometry）
- `./surface-lattice.js`：`sampleSurfaceLattice`（surfaceLatticeSampleVectors）
- `./bone-model.js`：`cloneSplitBones`（createPanelStrandGeometry）

**注入 deps（app.js 顶层函数，7）**：
`clonePanelSplits`（tipWidthMultiplierAt）、`normalizePanelSplits`（createPanelStrandGeometry）、`strandGeometryCurve`（tipPanelFrameAt/createPanelStrandGeometry）、`strandGeometryFrameAt`（tipPanelFrameAt/createPanelStrandGeometry）、`strandInfluenceColor`（createPanelStrandGeometry）、`isPanelGeometry`（updateTipHighlight）、`outwardNormalAtPoint`（tipPanelFrameAt）

**共享对象（1，只读）**：`sculptState`（updateTipHighlight 读 `state.panelTipSelection/panelTipHover`）

**常量**：`TIP_WIDTH_CONTROL_POINTS` → 模块 export，app.js（L18556 createCurveObjects）import 复用

**无**：DOM 输入、locks/curveGroup/renderer/raycaster/undoHistory/lastPointer、hairState/sel（簇内 grep 证实仅 sculptState）。

## 5. 硬障碍检查

1. **`__AHS_TEST_SEAM`（L30784–30839，已重定位）**：引用本批 **19 个函数**（见 §6 清单）——`updateTipHighlight`(30802)、`splitTipForSegment`(30805)、`tipWidthSideForkT`(30807)、`tipSegmentWeightAt`(30808)、`tipWidthCommonForkT`(30809)、`tipWidthControlTs`(30810)、`tipWidthSpreadGap`(30811)、`tipWidthControlPlacement`(30812)、`tipWidthEdgePosition`(30813)、`tipPanelFrameAt`(30814)、`tipSurfaceFrameAt`(30815)、`tipChainFrameAt`(30816)、`tipPanelWidthAt`(30817)、`tipWidthMultiplierAt`(30818)、`tipMainSectionPoint`(30819)、`setTipWidthCurveValue`(30820)、`buildTipWidthCurve`(30821)、`tipWidthResetCurve`(30822)、`splitForkT`(30828)。`verify-tip-select.mjs` 直接调 `t.updateTipHighlight` / `t.splitTipForSegment` 等 → 必须重导出。
2. **undo/snapshot/mirror**：`snapshotState`(12473)/`pushUndoState`(13360)/`restoreLock`(13623)/`syncMirrorPartnerFromLock`(12270) 对本批函数**零调用**；mirror 仅数据级检查 `partner.curveObjects.panelSplitHandles`（L12424）。G1 全部以 lock 对象参数就地读写（含 `lock._tipWidthFrames` 缓存、`bone.taperCurve*` 写入）→ undo/snapshot 行为不变。
3. **curve-objects-core 边界**：`updateCurveObjects`（脊柱）是最大消费者（6 个 G1 函数，L18975/18978/19034/19091/19124/19134）；`createCurveObjects` 只复用常量 `TIP_WIDTH_CONTROL_POINTS`（L18556）；`syncLockFromCurve` 零引用。脊柱保留，调用改 `g1Api.X`。
4. **pointer 事件层（userData.tipSubBoneHandle）**：全 app.js 仅 L27853（`beginPanelSplitHandleDrag`，B2）设置；本批函数零接触 → 事件绑定全部留 app.js，不涉及 G1。
5. **引导期顶层调用**：无（全部调用点深度 ≥1）；仅两处顶层引用 = seam 对象字面量（depth 0，非调用）+ `#resetTaperCurve` click 回调（tipWidthResetCurve）。
6. **modules/* 跨批次引用**：零（对 26 个函数名全量 grep modules/** 无命中）→ 跨批次重接为零。

## 6. 建议

- **模块文件名**：`modules/geometry/panel-tip-strand.js`（单模块；与 G2 split 分 2 批，本批不含 `createSplitStrandGeometry` 等）。不建议拆成 panel-strand / tip-strand 两文件：互调密集（§4.1），拆开需第三个共享模块或环形依赖。
- **api 装配**：`createPanelTipStrandApi(deps)`。装配点建议：簇后（L9365 之后）或与 L9440 一带其它 geometry api（branchSweep/strandSweep/branchBridge）并列；import 加在 app.js L1–11 模块导入块（约定 `?v=YYYYMMDD-N`）。deps 中 `outwardNormalAtPoint` 为函数声明（提升），簇后装配无时序问题。
- **净减**：900 行 ×0.75 ≈ **675 行**（计划估 620；差异来自 createPanelStrandGeometry 327 行大函数）。
- **难度**：**中**（与计划一致）——大函数 createPanelStrandGeometry(327) + seam 19 函数重导出 + updateCurveObjects 6 处改 api。
- **边界存疑点**：
  1. `tipSideForkFor`（L11443）是 G5 闭包，G1 迁移后 `renderTaperCurveEditor` 需 `g1Api.tipWidthSideForkT`（G1→G5 依赖，随 G5 迁移注入）。
  2. `TIP_WIDTH_CONTROL_POINTS` 被脊柱 createCurveObjects（L18556）复用 → 模块 export / app.js import（或保留副本，二选一，避免双源）。
  3. `pushOrientedTriangle` 被 G2+G3 共用，留待 G2/G3 边界处理（本批不涉及）。
  4. `triangulatePolygon3D`（L9400）全文件无调用点（疑似死代码）——G2 批顺带核实。
  5. `surfaceLatticeSampleVectors` 外部消费者 `surfaceObjectAnchorPose`（surface 锚，未排批）依赖本批 → 接线点留 app.js。
- **seam 重导出清单（19）**：`updateTipHighlight`、`splitTipForSegment`、`tipWidthSideForkT`、`tipSegmentWeightAt`、`tipWidthCommonForkT`、`tipWidthControlTs`、`tipWidthSpreadGap`、`tipWidthControlPlacement`、`tipWidthEdgePosition`、`tipPanelFrameAt`、`tipSurfaceFrameAt`、`tipChainFrameAt`、`tipPanelWidthAt`、`tipWidthMultiplierAt`、`tipMainSectionPoint`、`setTipWidthCurveValue`、`buildTipWidthCurve`、`tipWidthResetCurve`、`splitForkT`。seam 块改为 `updateTipHighlight: g1Api.updateTipHighlight` 等（或 seam 直接用顶层 `g1Api`）。
- **回归**：`node --check app.js` + `node --check modules/geometry/panel-tip-strand.js`；`verify-smoke.mjs`（layered-side-bun.ahs，10/11 基线）；`verify-tip-select.mjs`（seam 依赖，必须 ?ahstest=1 跑通）。
## 7. 执行记录（G1 迁移完成 · 2026-08-12）

> 基于本文 §1–6 执行；迁移前 app.js = 30,058 行，迁移后 = 29,099 行（净减 959 行）。所有行号为当前（29,099 行）文件口径。

### 7.1 实际迁出（模块 modules/geometry/panel-tip-strand.js，1,028 行，CRLF/UTF-8 无 BOM）

- **26 个顶层函数**（smoothCoincidentPanelNormals → createPanelStrandGeometry，含中间常量 TIP_WIDTH_CONTROL_POINTS）+ **10 个嵌套箭头**（addPoint / segmentWeightAt / addQuad / near / panelWidthAt / panelThicknessAt / panelFrameAt / rawPanelPoint / panelPoint / addPatch）整体迁出。
- 原簇区间（30,058 行口径）L8395–9371 = 977 行（含注释/空行；函数体括号配对实测 889 行 + 常量 1 行），连同尾随空行 L9372 共从 app.js 移除 978 行；新增 import(1) + api 装配(5) + deps 批填(13) = 19 行 → 净 −959。
- TIP_WIDTH_CONTROL_POINTS 改为模块命名导出；app.js 顶部 import 复用（createCurveObjects L16989 使用，无本地副本，单源）。
- 模块装配：createPanelTipStrandApi(deps)，app.js L1534-1535 早建（deps 空对象），L17756-17768 Object.assign(panelTipStrandDeps, {...}) 批填（生效行 L17768 `});`，最后一个 dep outwardNormalAtPoint 于 L17752 定义完毕）。

### 7.2 deps 清单（注入 8 + 模块 import 4 文件）

- 注入 deps（app.js 顶层函数/共享对象）：clonePanelSplits、normalizePanelSplits、strandGeometryCurve、strandGeometryFrameAt、strandInfluenceColor、isPanelGeometry、outwardNormalAtPoint、sculptState（= sculptState.state 代理）。
- 模块 import：THREE；curve-math.js（profileTopologyCenterWeight / sampleArray / sampleAsymmetricTaperCurve / sampleTaperCurve）；surface-lattice.js（sampleSurfaceLattice）；bone-model.js（cloneSplitBones）。

### 7.3 接线改写（27 处外部/跨批次 + 19 seam 重导出 = 46 处）

- **27 处非 seam 改写**（26 个 app.js 调用点 + 1 处 taperEditorDeps 跨批次）：
  - surfaceObjectAnchorPose L6796（surfaceLatticeSampleVectors）
  - createBaseHairGeometry L9264（createPanelStrandGeometry）
  - panelSplitControlPoint L16635（surfacePanelPoint）
  - updateCurveObjects 7 处：L17408 splitTipForSegment、L17411 splitForkT、L17427 tipChainFrameAt（syncTipNormalArrow）、L17467 tipChainFrameAt、L17524 tipWidthControlPlacement、L17557 tipWidthEdgePoints、L17567 updateTipHighlight
  - taperEditorDeps L10042：tipWidthSideForkT: panelTipStrand.tipWidthSideForkT（G5→G1 依赖）
  - #resetTaperCurve click L23332、L23358（tipWidthResetCurve ×2）
  - beginTipSubBoneRotate L26022（splitTipForSegment）
  - beginPanelSplitHandleDrag L26140/26152/26162（splitTipForSegment / tipWidthControlPlacement / tipPanelWidthAt）
  - updatePanelSplitHandleDrag L26257/26298/26300/26326/26329/26330（splitTipForSegment ×2 / tipWidthEdgePosition / setTipWidthCurveValue ×3）
  - updatePanelTipHover L27575/27598（updateTipHighlight ×2）
  - applySubBoneBrushSample L27618/27637（splitTipForSegment / splitForkT）
- **19 个 seam 重导出**（__AHS_TEST_SEAM，L29060-29087）逐一挂 panelTipStrand.X：updateTipHighlight ✓ splitTipForSegment ✓ tipWidthSideForkT ✓ tipSegmentWeightAt ✓ tipWidthCommonForkT ✓ tipWidthControlTs ✓ tipWidthSpreadGap ✓ tipWidthControlPlacement ✓ tipWidthEdgePosition ✓ tipPanelFrameAt ✓ tipSurfaceFrameAt ✓ tipChainFrameAt ✓ tipPanelWidthAt ✓ tipWidthMultiplierAt ✓ tipMainSectionPoint ✓ setTipWidthCurveValue ✓ buildTipWidthCurve ✓ tipWidthResetCurve ✓ splitForkT ✓

### 7.4 七项验证结果

1. **裸引用静态扫描归零** ✓（app.js 除 import 绑定外仅剩 TIP_WIDTH_CONTROL_POINTS 1 处合法引用；模块内仅定义/互调/return 键；字符串/注释/模板剥离、对象键 `name:` 用 `(?!\s*:)` 排除、qualified `.X` 排除；扫描器需先剥 `\r` 否则 CRLF 注释行误报）。
2. **store 代理双重 .state** ✓（模块内 `deps.sculptState.panelTipSelection/panelTipHover`，app.js 批填 `sculptState: sculptState.state`，无 `deps.sculptState.state`）。
3. **引导期 deps 时序** ✓（批填生效行 L17768 `});`；批填前全 app.js 深度 0 无任何 G1 函数调用或引用；首个运行时消费为 updateCurveObjects/几何重建）。
4. **跨批次重接** ✓（仅 taperEditorDeps 引用 tipWidthSideForkT 已改 g1Api；taper-editor.js 内部 `deps.tipWidthSideForkT` 不变；scalpBuilderDeps/guideDeps/curveSurfaceCreateDeps/polyToolsDeps 对本批零引用）。
5. **编码** ✓（app.js 与模块均 UTF-8 无 BOM、纯 CRLF；中文逐字节守恒：原簇与模块体非 ASCII 92 段/741 字符完全一致）。
6. **语法** ✓（node --check 双文件通过；另以 .mjs 副本做权威解析也通过——本仓库无 package.json，node --check 对 ESM .js 存在静默放行缺陷，见踩坑 1）。
7. **运行时回归** ✓（verify-smoke.mjs 10/11 = 基线；layered-side-bun.ahs 加载 88 锁 0 异常；verify-tip-select.mjs 的 `found split panel lock` 失败为**既有基线**——HEAD 同样失败，bundled .ahs 全为 strand 类型锁；另用 CDP 探针验证 ?ahstest=1 下 seam 对象存在、0 异常、19/19 seam 导出均为 function 且可调用）。

### 7.5 踩坑

1. **node --check 对 ESM .js 静默放行**：本仓库无 package.json，`node --check app.js` 对 ESM 语法错误不报（把非法对象字面量成员简写 `panelTipStrand.tipWidthSideForkT,` 当合法）。taperEditorDeps 简写改写漏写键名即被此坑掩盖，靠 `.mjs` 副本解析（L10042 Unexpected token '.'）才暴露。修复：显式键 `tipWidthSideForkT: panelTipStrand.tipWidthSideForkT`。后续验证语法一律用 `.mjs` 副本。
2. **API return 漏项**：首版模块 return 对象漏了 tipWidthResetCurve（25/26），stub harness 调 `api.tipWidthResetCurve` 时 TypeError 暴露；补齐后 26/26 无缺无余。
3. **裸引用扫描 CRLF**：JS 正则 `.` 不匹配 `\r`、`$` 也不在 `\r` 前匹配，导致 `//` 注释剥离失败、注释行误报；先 `l.replace(/\r$/, '')` 再剥离即可。
4. **verify-tip-select.mjs 数据依赖**：bundled assets/presets/layered-side-bun.ahs 的 88 锁全是 `strand` geometryType，isPanelGeometry（panel/surface）不命中 → 测试在 `found split panel lock` 处中止；与 G1 无关（HEAD 同样）。seam 正确性改由 CDP 探针直接验证 19/19。
5. **行号漂移**：本表 §1–6 基于 30,841 行口径；实际执行在 30,058 行文件上，簇定位为 L8395–9371（+7 偏移），全部按函数名重新定位，未依赖旧行号。