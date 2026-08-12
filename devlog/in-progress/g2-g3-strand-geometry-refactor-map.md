# G2/G3（split strand + base strand/card/compound 几何）迁出 — 函数引用图 / Refactor Map

> 生成：2026-08-12 · 分支 `0.2.59-refactor` · 仓库 `D:\code\dev\web\Animehairstudio`
> 约束：只读分析 app.js + modules/*.js，未做任何修改；唯一产出本文档。
> 口径（重要）：工作树已包含**未提交的 G1 迁出**（`modules/geometry/panel-tip-strand.js` + app.js +65/−1024，git status 可见）。当前 app.js = 29,099 内容行（`__AHS_TEST_SEAM` 已移至 L29043）。`devlog/FUNCTION_INDEX.json`（07:20 UTC 生成）是 **G1 迁出前**快照，行号全部过时；本文所有行号以 2026-08-12 冻结快照实测（括号配对函数体 + 全量 grep）为准。
> 依据：devlog/in-progress/geometry-bones-extraction-plan.md 的 G2/G3 行；G1 map（devlog/in-progress/g1-strand-geometry-refactor-map.md）确认的边界：clipStrandProfilePolygon/pushOrientedTriangle/triangulatePolygon3D/createSplitStrandGeometry 不属 G1、createBaseHairGeometry 调 G1、pushOrientedTriangle 被 G2+G3 共用、triangulatePolygon3D 疑似死代码（本批顺带核实 ✅）。

## 1. 结论速览（TL;DR）

- **G2 = 5 个顶层函数（连续簇 L8401–8697，281 行）+ 2 个嵌套箭头（inside@8402、fusedIndexAt@8650）**：clipStrandProfilePolygon / pushOrientedTriangle / triangulatePolygon3D / orientedQuadFace / createSplitStrandGeometry。
- **G3 = 7 个顶层函数（L8699–9339，603 行）+ 1 个嵌套箭头（vertexIndex@8993）**：createHairCardGeometry / createPolyGeometry / createConnectedCurveCardGeometry / createCompoundStrandGeometry / proceduralBranchGeometryLock / createHairGeometry / createBaseHairGeometry。计划口径「G3 9 函数」≈ 7 顶层 + orientedQuadFace（物理在 G2 簇、语义归 G3）+ vertexIndex（嵌套），见 §6.2。
- **外部调用点共 5 处，全部是 createHairGeometry**：L2431（G4 deps 接线，非调用）、L10491（addLock）、L12253（restoreLock）、L14812（updateDrawVolumePreview）、L17895（rebuildLockGeometry）。其余 11 个函数外部零引用。
- **triangulatePolygon3D 死代码确认 ✅**：全仓库（app.js / modules/* / scripts/* / index.html）除定义 L8435–8473 外零引用 → 建议随 G2 删除（−39 行）。
- **硬障碍：`__AHS_TEST_SEAM`（当前 L29043–29098）对本批 12 个函数零引用**（G1 已由 panelTipStrand 重导出）→ 无需 seam 重导出；verify-tip-select.mjs 不直接调本批函数。
- **建议**：单模块 `modules/geometry/strand-geometry.js` + `createStrandGeometryApi(deps)`，按 G1 模式装配（api 早建 ~L1535、deps 晚填 ~L17757）；外部改线仅 5 处；净减估 **≈660–690 行**（计划 120+550=670 一致）；难度 **中**。

## 2. 待迁函数清单（12 顶层 + 3 嵌套，884 行）

### 2.1 G2 — split strand 几何（281 行）

| # | 函数 | 行号区间 | 行数 | 类型 | 职责 / 备注 |
|---|---|---|---|---|---|
| 1 | `clipStrandProfilePolygon` | 8401–8422 | 22 | function | 沿 splitX 裁剪截面多边形（嵌套 `inside`@8402） |
| 2 | `pushOrientedTriangle` | 8424–8431 | 8 | function | 有向三角（**G2+G3 共用**：createSplitStrandGeometry / createCompoundStrandGeometry / createBaseHairGeometry） |
| 3 | `triangulatePolygon3D` | 8435–8473 | 39 | function | 3D 多边形三角化（**死代码，零调用点**，见 §6.1） |
| 4 | `orientedQuadFace` | 8485–8491 | 7 | function | 有向四边形（唯一调用者 G3 createCompoundStrandGeometry@9122） |
| 5 | `createSplitStrandGeometry` | 8493–8697 | 205 | function | split 双管 sweep + fused grid（嵌套 `fusedIndexAt`@8650） |

### 2.2 G3 — base strand/card/compound 几何（603 行）

| # | 函数 | 行号区间 | 行数 | 类型 | 职责 / 备注 |
|---|---|---|---|---|---|
| 6 | `createHairCardGeometry` | 8699–8796 | 98 | function | hair-card 开放面（arc profile slots + strandProfileTopologyAt） |
| 7 | `createPolyGeometry` | 8798–8823 | 26 | function | poly 网格（polyMeshBuffers） |
| 8 | `createConnectedCurveCardGeometry` | 8825–8888 | 64 | function | curve-surface 卡（curveSurfaceCreate + buildConnectedCurveCardGrid） |
| 9 | `createCompoundStrandGeometry` | 8908–9157 | 250 | function | compound 多控制器桥接（嵌套 `vertexIndex`@8993；回退 createConnectedCurveCardGeometry@8939/8989） |
| 10 | `proceduralBranchGeometryLock` | 9159–9188 | 30 | function | procedural 分支 lock 生成（branchRootBone.stableBranchBaseNormals） |
| 11 | `createHairGeometry` | 9204–9254 | 51 | function | **外部唯一入口**（branch child / procedural 分支合并 + 调 createBaseHairGeometry） |
| 12 | `createBaseHairGeometry` | 9256–9339 | 84 | function | geometryType 分派：poly/curve-surface/panel/braid/strand(hairCard·split)/默认 sweep |

## 3. 引用图

### 3.1 内部互调（批内，行号实测）

| 调用者 | → 被调（行号） |
|---|---|
| createSplitStrandGeometry | clipStrandProfilePolygon (8509, 8510)、pushOrientedTriangle (8627, 8628) |
| createCompoundStrandGeometry | createConnectedCurveCardGeometry (8939, 8989 回退)、pushOrientedTriangle (9100, 9101)、orientedQuadFace (9122) |
| createHairGeometry | createBaseHairGeometry (9222, 9235)、proceduralBranchGeometryLock (9236) |
| createBaseHairGeometry | createPolyGeometry (9258)、createCompoundStrandGeometry (9261)、createConnectedCurveCardGeometry (9262)、createHairCardGeometry (9273)、createSplitStrandGeometry (9275)、pushOrientedTriangle (9319, 9320) |

> 依赖方向：**G3 → G2**（createBaseHairGeometry 调 createSplitStrandGeometry + pushOrientedTriangle）；pushOrientedTriangle 双向共用；G1 不依赖本批。

### 3.2 外部调用点（批外，app.js 共 5 处，全为 createHairGeometry）

| 行号 | 调用者（所在函数/块） | 类型 |
|---|---|---|
| 2431 | curveSurfaceCreateDeps 批填（G4 模块 deps 接线） | 引用（非调用） |
| 10491 | addLock | 调用（new THREE.Mesh） |
| 12253 | restoreLock | 调用（new THREE.Mesh） |
| 14812 | updateDrawVolumePreview | 调用 |
| 17895 | rebuildLockGeometry（几何重建脊柱单点） | 调用 |

- 其余 11 个函数：**0 外部调用点**（clipStrandProfilePolygon/pushOrientedTriangle/triangulatePolygon3D/orientedQuadFace/createSplitStrandGeometry/createHairCardGeometry/createPolyGeometry/createConnectedCurveCardGeometry/createCompoundStrandGeometry/proceduralBranchGeometryLock/createBaseHairGeometry 全为批内消费）。
- **modules/* 引用**：`modules/geometry/curve-surface-create.js` L675 `deps.createHairGeometry(previewLock)`（G4 → 走 deps 键，模块本身不改）；`modules/geometry/strand-sweep.js` L2 仅注释；`scripts/analyze-deps.js` L41 模式串（dev 工具，非运行时）。
- scripts/verify-smoke.mjs、verify-tip-select.mjs、index.html、server.js：零引用。

### 3.3 deps 清单（app.js 顶层标识符 → 注入 createStrandGeometryApi(deps)）

**api 对象 const（6，按定义行）**：`curveSurfaceCreate`@1519（G4）、`panelTipStrand`@1535（**G1 api**）、`branchRootBone`@6724、`branchSweep`@8475、`strandSweep`@9190、`branchBridge`@9194

**数据（1）**：`locks`@1955（createHairGeometry 找 parent）

**app.js 顶层函数（10，均为 function 声明=提升）**：

| 函数 | 行号 | 消费者 |
|---|---|---|
| strandCurveParameters | 7835 | createSplitStrandGeometry、createHairCardGeometry |
| strandProfileTopologyAt | 7793 | createSplitStrandGeometry、createHairCardGeometry、createCompoundStrandGeometry |
| strandGeometryFrameAt | 8307 | createSplitStrandGeometry、createHairCardGeometry、createCompoundStrandGeometry、createBaseHairGeometry |
| strandInfluenceColor | 7610 | 以上 4 个 + createConnectedCurveCardGeometry |
| strandGeometryCurve | 8281 | createBaseHairGeometry |
| gridProfileSkipCol | 14296 | createHairCardGeometry、createBaseHairGeometry |
| outwardNormalAtPoint | 17742 | createCompoundStrandGeometry |
| proceduralBranchWorldPoints | 14367 | proceduralBranchGeometryLock |
| proceduralBranchTemplatesForGuide | 14355 | createHairGeometry |
| createBraidGeometry | 7933 | createBaseHairGeometry（braid 簇，未排批） |

**deps 注入合计 17 项**（6 api + locks + 10 函数）。

### 3.4 模块级可 import（无需 app.js 注入，模块内直接 import）

| 名字 | 来源 |
|---|---|
| THREE | three |
| mergeGeometries | three/addons/utils/BufferGeometryUtils.js |
| sampleScale、upperProfileArcIndices、remapEnvelopeCurveRange | modules/geometry/curve-math.js |
| buildConnectedCurveCardGrid、DEFAULT_CURVE_SURFACE_ROWS | modules/geometry/curve-surface.js |
| polyMeshBuffers | modules/geometry/poly-topology.js |
| compoundBridgeArchWeight、compoundBridgeParameters、compoundConnectedSegmentCount、compoundProfileBridgePlan | modules/geometry/compound-strand.js |
| ROUND_SWEEP_PROFILE、DEFAULT_SWEEP_PROFILE | modules/core/app-config.js |

## 4. 硬障碍检查

1. **`__AHS_TEST_SEAM`（当前 L29043–29098）**：对本批 12 个函数**零引用**（G1 函数已由 `panelTipStrand.X` 重导出；脊柱 updateCurveObjects 保留）。verify-tip-select.mjs 只经 `t.updateCurveObjects`/getSelectedLock/sculptState 间接触达本批 → **无需 seam 重导出**。
2. **脊柱边界（createCurveObjects/updateCurveObjects/syncLockFromCurve/undo/snapshot）**：三者对本批函数**零直接引用**；几何重建单点 `rebuildLockGeometry`@17893 内 1 处（17895）改 `strandGeometryApi.createHairGeometry`；`restoreLock`@12253、`addLock`@10491、`updateDrawVolumePreview`@14812 各 1 行改 api。snapshotState/pushUndoState/syncMirrorPartnerFromLock 零引用 → undo/snapshot/mirror 数据级行为不变。
3. **G1/G5/guide 依赖方向**：G3 → G1 = `panelTipStrand.createPanelStrandGeometry`@9264（注入 panelTipStrand，方向 G3→G1）；G1 不依赖 G2/G3；G5 taperEditor、polyToolsApi、guideApi、scalpBuilder 对本批零引用。
4. **引导期顶层调用**：无。本批函数唯一顶层引用 = L2431 deps 接线（引用非调用）；boot 序列（renderLockList 等 @~29000）晚于 deps 填充点 → 无时序风险，但 **L2431 先于本批 api 装配** → 必须采用「api 早建 + deps 晚填」模式（见 §5，TDZ 规避）。
5. **跨批次重接**：① app.js L2431 `createHairGeometry,` → `createHairGeometry: strandGeometryApi.createHairGeometry,`（curve-surface-create.js L675 的 deps 键同名，模块不改）；② 若 G2/G3 分两模块：G3 模块需经 deps 注入 `g2Api.{createSplitStrandGeometry, pushOrientedTriangle, orientedQuadFace}`；③ G1 已迁出未提交，本批按 `panelTipStrand` 现状接线（若 G1 先提交则无变化）。

## 5. 建议

- **模块文件名**：**单文件 `modules/geometry/strand-geometry.js`**，导出 `createStrandGeometryApi(deps)`，含全部 12 函数 + 3 嵌套。理由：pushOrientedTriangle 被 G2+G3 共用；createBaseHairGeometry（G3）直接调 createSplitStrandGeometry（G2）；簇连续（8401–9339），拆两文件需 g2Api 重导出 + 双 api 装配。若坚持按计划分两批执行：G2 批先建同文件并暴露子集 api（createSplitStrandGeometry/pushOrientedTriangle/orientedQuadFace），G3 批扩入其余 7 函数（两 commit 落同一文件，或拆 split-strand.js + strand-geometry.js 两文件，后者需 G3 依赖 g2Api，不推荐）。
- **createXxxApi(deps) 装配点（沿用 G1 模式，规避 2431 TDZ）**：
  1. 顶部 import（~L7 模块导入块）：`import { createStrandGeometryApi } from "./modules/geometry/strand-geometry.js?v=20260812-1";`
  2. ~L1534–1535 旁（panelTipStrand 装配同区）：`const strandGeometryDeps = {}; const strandGeometryApi = createStrandGeometryApi(strandGeometryDeps);` → api 在 L2431 之前已初始化（闭包可用，deps 空）。
  3. L2431 改：`createHairGeometry: strandGeometryApi.createHairGeometry,`。
  4. L17753 之后（G1 deps 批填旁，最后一个 dep `outwardNormalAtPoint`@17742 之后）：`Object.assign(strandGeometryDeps, { …17 项 §3.3… });` —— 所有 dep 常量（locks@1955/curveSurfaceCreate@1519/branchRootBone@6724/branchSweep@8475/strandSweep@9190/branchBridge@9194/panelTipStrand@1535）均先于该行定义，函数 dep 全提升 → 一次批填即可，无第二次填充。
- **净减估**：函数 884 行（G2 281 + G3 603）+ 随迁注释 ~14 行（8433–8434 triangulatePolygon3D 头注释、8890–8901 分支子几何注释）≈ **898 毛行** ×0.75 ≈ **≈670–690 净减**（与计划 120+550=670 一致）。若 triangulatePolygon3D 直接删除（建议），app.js 再 −39 行。
- **难度**：**中**。两大复杂函数 createSplitStrandGeometry(205)/createCompoundStrandGeometry(250)；deps 全为提升函数 + 6 个先于填充点的 const api；外部改线仅 5 处；无 seam/undo/mirror 风险。主要风险：L2431 TDZ（早建模式规避）、簇内 3 个 api const 留在 app.js、G1 panelTipStrand dep 方向。
- **回归**：`node --check app.js` + `node --check modules/geometry/strand-geometry.js`；`verify-smoke.mjs`（layered-side-bun.ahs，10/11 基线）；`verify-tip-select.mjs`（?ahstest=1，seam 不受影响）。

## 6. 边界存疑点

1. **triangulatePolygon3D 死代码确认 ✅**（本批顺带核实）：全文件（app.js）+ modules/* + scripts/* + index.html 零调用点，仅定义 L8435–8473 → **建议随 G2 删除**；若求零行为差可移入模块保留。
2. **orientedQuadFace 归属**：物理在 G2 簇（8485–8491，紧邻 branchSweep const@8475 之后），唯一调用者是 G3 createCompoundStrandGeometry@9122 → 归 G2 或 G3 均无行为差异（单模块内）。计划「G3 9 函数」口径 = 7 顶层 + orientedQuadFace + vertexIndex（嵌套），或含 pushOrientedTriangle，与本文枚举差 1–2 个计数，执行以本文 12 顶层为准。
3. **簇内保留块（不可随函数连切）**：`branchSweep` const@8475–8483（位于 triangulatePolygon3D 与 orientedQuadFace 之间）、`strandSweep`@9190–9193、`branchBridge`@9194–9202（位于 proceduralBranchGeometryLock 与 createHairGeometry 之间）、`BRANCH_CONNECTION_ENABLED`@8905 / `BRANCH_SIDE_FILL_ENABLED`@8903（被 branchBridge deps@9200 引用）→ 提取按函数粒度，勿整段剪贴。
4. **G1 已迁出未提交**（panel-tip-strand.js，app.js +65/−1024）：本批 G3 依赖的是 `panelTipStrand` api 对象而非 app.js 顶层函数；若执行本批时 G1 仍未提交，先确认工作树基线（verify-smoke 10/11）。
5. **createBraidGeometry@7933（347 行，braid 簇）是 G3 依赖而非成员**：后续若拆 braid 批，只需改本模块 deps 接线。
6. **FUNCTION_INDEX.json 已过时**（G1 迁出前快照，行号差 −972）：后续批次请以实时 grep 重定位，勿直接引用索引行号。

---

## 7. 执行记录（2026-08-12 · G2+G3 已执行）

> 执行基线：app.js 29,099 行（HEAD=G1 16d3d26，工作树干净）；执行后 28,229 行（净减 **−870** 行：毛删 898 − 脚手架 +28）。

### 7.1 实际迁出

- **新建模块** `modules/geometry/strand-geometry.js`（898 行，UTF-8 无 BOM、CRLF），导出 `createStrandGeometryApi(deps)`，按 G1 模式：api 早建（app.js L1541）+ deps 晚批填（app.js L16874–16895，生效行=`});` L16895）。
- **迁出 11 个顶层函数 + 3 个嵌套箭头，845 行**（原计划 12 函数/884 行 − triangulatePolygon3D 死代码 39 行）：
  - G2（4 函数，242 行）：clipStrandProfilePolygon（22，嵌套 inside）、pushOrientedTriangle（8）、orientedQuadFace（7）、createSplitStrandGeometry（205，嵌套 fusedIndexAt）。
  - G3（7 函数，603 行）：createHairCardGeometry（98）、createPolyGeometry（26）、createConnectedCurveCardGeometry（64）、createCompoundStrandGeometry（250，嵌套 vertexIndex）、proceduralBranchGeometryLock（30）、createHairGeometry（51）、createBaseHairGeometry（84）。
- 函数体与 app.js 原文本 **逐字节一致**（仅把 17 个 dep 自由标识符改写为 `deps.X`；对每函数做「deps. 前缀归一化」后 diff = 0 差异）。
- **模块级 import（14 项）**：THREE、mergeGeometries（three/addons）、sampleScale/upperProfileArcIndices/remapEnvelopeCurveRange（curve-math）、buildConnectedCurveCardGrid/DEFAULT_CURVE_SURFACE_ROWS（curve-surface）、polyMeshBuffers（poly-topology）、compoundBridgeArchWeight/compoundBridgeParameters/compoundConnectedSegmentCount/compoundProfileBridgePlan（compound-strand）、ROUND_SWEEP_PROFILE/DEFAULT_SWEEP_PROFILE（app-config）。
- **app.js 保留**：簇内 3 个 api const（branchSweep/strandSweep/branchBridge）+ BRANCH_BRIDGE_DIAGNOSTIC/BRANCH_SIDE_FILL_ENABLED/BRANCH_CONNECTION_ENABLED + 其头注释（8890–8901 分支子几何注释随 const 保留在 app.js，未迁入模块；纯注释位置决策，零行为影响）。

### 7.2 死代码删除确认 ✅

- `triangulatePolygon3D`（L8435–8473，39 行 + 头注释 2 行）：执行前全仓库（app.js / modules/* / scripts/* / index.html）除定义外**零调用点** → 随 G2 删除，未迁入模块。删除后全仓库 grep 零残留。

### 7.3 外部调用点改写（5 处，全部 createHairGeometry）

| app.js 行号 | 位置 | 改后 |
|---|---|---|
| 2437 | curveSurfaceCreateDeps 批填（G4 deps 接线） | `createHairGeometry: strandGeometryApi.createHairGeometry,` |
| 9599 | addLock（new THREE.Mesh） | `strandGeometryApi.createHairGeometry(lock)` |
| 11361 | restoreLock（new THREE.Mesh） | `strandGeometryApi.createHairGeometry(lock)` |
| 13920 | updateDrawVolumePreview | `strandGeometryApi.createHairGeometry(previewLock)` |
| 17025 | rebuildLockGeometry（几何重建单点） | `strandGeometryApi.createHairGeometry(lock)` |

- modules/geometry/curve-surface-create.js L675 `deps.createHairGeometry(previewLock)` **不改**（deps 键同名，经 L2437 重接自动生效）。strand-sweep.js L2 仅注释、scripts/analyze-deps.js L41 仅模式串，均不动。

### 7.4 deps 注入清单（17 项，批填 app.js L16874–16895）

- api 对象 const（6）：branchBridge@8439、branchRootBone@6730、branchSweep@8407、curveSurfaceCreate@1520、panelTipStrand@1536、strandSweep@8435。
- 数据（1）：locks@1961。
- app.js 顶层函数（10）：createBraidGeometry@7939（braid 簇，未排批，走 deps）、gridProfileSkipCol@13404、outwardNormalAtPoint@16850、proceduralBranchTemplatesForGuide@13463、proceduralBranchWorldPoints@13475、strandCurveParameters@7841、strandGeometryCurve@8287、strandGeometryFrameAt@8313、strandInfluenceColor@7616、strandProfileTopologyAt@7799。

### 7.5 7 项验证结果

1. **裸引用静态扫描归零** ✅：app.js 12 个函数名自由标识符 0 残留（spread/import 绑定/字符串/注释/模板均已剥离；对象键 `name:` 排除）；模块内 17 个 dep 裸标识符 0 残留（全部 `deps.X`）。app.js 仅剩 `createHairGeometry` 的 5 处 `strandGeometryApi.createHairGeometry` + 1 处注释提及。
2. **store 代理双重 .state** ✅：模块零 store 代理引用（sculptState/miscState/sel/projectState 等均 0）；`branch` 3 处为 proceduralBranchGeometryLock 内局部变量，非 branch store。
3. **引导期 deps 时序审计** ✅：api 创建 L1541 < 接线 L2437 < 批填生效 L16895；接线为引用非调用；4 个调用点全在函数体内（缩进确认），引导（renderLockList 等 ~L28100）晚于批填；17 dep 定义行全部早于批填行。
4. **跨批次重接** ✅：curveSurfaceCreateDeps 的 createHairGeometry 已改 `strandGeometryApi.createHairGeometry`；curve-surface-create.js 模块内 deps 键不变；无其它模块引用本批函数名。
5. **编码** ✅：app.js 与 strand-geometry.js 均 UTF-8 无 BOM、CRLF、无 loneLF；非 ASCII（>127）守恒：原簇 0 字符 = 模块 0 字符（本批函数体全 ASCII 注释；中文 em-dash/减号位于保留的 8890–8901 注释，仍在 app.js）。
6. **语法** ✅：`node --check` 双文件通过；另以 .mjs 副本权威解析（node --check app.mjs / strand.mjs）通过，防静默放行。
7. **本执行记录** ✅。

### 7.6 踩坑

- 分析脚本 brace-match 初版把 `lineComment` 状态跨行保留导致扫描提前终止 → 修正为每行重置；与代码无关。
- 非 ASCII 守恒初检误用编辑后行号对照原跨度（假阳性 3 字符）→ 改用 `git show HEAD:app.js` 原文本复核，delta=0。
- map 估「随迁注释 8890–8901」改为保留在 app.js（与 BRANCH_* const 同处，const 被 branchBridge deps 引用）；纯注释，行为零差。
- 净减 −870 行高于 map 估 670–690（map 按毛行×0.75 折算，实际脚手架仅 28 行）。
