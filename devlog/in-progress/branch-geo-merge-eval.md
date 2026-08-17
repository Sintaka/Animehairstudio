# 桥接子发片 geo 合并评估（焊接共享边界 + 权重平滑过渡）

## 2026-08-17 实施更新

- 已在 **USDA 导出路径**实施 family 级位置融合：UV 展开后保留每个输出点的 `sourceIndices`，按完整父→子→孙 bridge family 的 `bridgeBoundaryParentIndices` 合并同位 bridge boundary 点。融合只作用于 position/face 索引；`st` 仍是 faceVarying，UV 顶点及其独立 indices 不焊接，故原有 seam/UV 岛流程保持兼容。
- 已实施递归 bridge capture：洞边界严格继承已解析的父 capture；桥内部以洞侧=0、子根侧=1 为固定端点，在桥接图上求仅权重域的调和/Laplacian 过渡，并归一到固定四影响。子发片 `main.0` 仍 parent 到父发片对应的 `main.k`；USDA 输出 `elementSize = 4`。
- 本轮**没有**在融合后对 position 额外执行 Uniform Smooth。位置平滑仍是生成期 branch bridge 的锚定 Uniform Smooth；导出期的 uniform/Laplacian 仅计算 capture 权重，不改几何位置。
- 实机导出：`D:\Downloads\Sussurro_v1_0059.usda` 已验证 46 个 `elementSize = 4` skin prim、0 个 `elementSize = 2`、23 组 `primvars:st:indices`，并确认 `Side_Left_3_0` 挂在 `Side_Left_2_2`。首轮实测发现 family 首点仍为双槽 capture 会把全 mesh arity 写成 2，已在 `mergeBranchFamilyMeshes()` 中统一补齐四槽（见 bug-fixes.md #12）。
- 验证：`bridge-export.test.mjs`、既有 `usda-export.test.mjs` 与 `uv-unfold.test.mjs` 覆盖同位点融合、层级 boundary 继承、四影响、faceVarying UV indices；完整 Node 测试共 261 项通过。

- 状态：**导出路径已部分实施（2026-08-17）**：family 级 position 融合 + bridge capture 已落地；视口每 lock 独立 mesh 与生成期桥接拓扑保持不变。
- 目标：评估「能否在 geo 层面把子发片与主发片对应点合并（焊接共享顶点），并平滑绑定权重（边界环附近从父骨骼权重平滑过渡到子骨骼权重），且必须兼容 UV 生成流程」。
- 结论速览：**有条件可以，但必须分两层**——① 位置同步 + 导出权重 blend（低风险，建议先做）；② 真顶点焊接（单一 BufferGeometry），需要动 UV/导出/打包全链路，建议作为独立后续。详见 §2/§3。
- 下方正文保留为实施前评估；2026-08-17 的实际导出实现与验证见本页顶部更新及 bug-fixes.md #12。

---

## §1 现状梳理

### 1.1 子发片网格构成（扫掠 + 桥接 + 端盖）

子发片（有 `branchRootRegion` 的 lock）几何由 `modules/geometry/strand-geometry.js` 的 `createHairGeometry` 分流（L1007-1024）：父网格可挖洞（`gridRows>=2` 且 `quadFaces` 非空）时走 `deps.branchBridge.createBranchChildGeometry(lock)`（branch-bridge.js L542-758），否则回退 `createBaseHairGeometry`。`createBranchChildGeometry` 组装三部分：

1. **扫掠**：`deps.strandSweep.sweepSide(...)`（branch-bridge.js L603-610），内核在 `modules/geometry/strand-sweep.js` `sweepSide`（L13-155），`startT = branchSweepStartT`（默认 0.1，L561），`seedFrame` 从根骨骼 gizmo 帧重定位（L567-599）。扫掠顶点随后整体并入子几何数组（L636-640）。
2. **桥接**：`buildBranchBridgeGeometry(lock, parent, surface, ringWorld, parent.mesh.geometry)`（L624-626 → L14-540），输出底带 + 侧直桥 + 顶带 + 侧面填充四组面，顶点先于扫掠并入（L627-635，`bridgeVertexCount`）。
3. **端盖**：尖端单点 fan（L641-650）；无桥接时才补根部 cap（L677-693）。

### 1.2 桥接顶点与父洞边界：位置复制、索引分离（核心事实）

- `buildBranchBridgeGeometry` 的洞侧顶点全部经 `pushBoundary`（branch-bridge.js L46-63）**拷贝位置**：`vertices.push(v.x, v.y, v.z)`，`v` 来自 `holeBoundary(...)`（branch-connect.js L36-72，按网格索引去重），即父网格 position 属性的**当前值拷贝**。
- **索引完全分离**：`boundaryParentIndices`（L42、L52，形如 `[childIdx, parentIdx, ...]`）只用于**法线恢复**（L738-755：`computeVertexNormals` 之后把洞侧顶点法线覆写为父网格作者法线），不是索引共享；位置/切线/UV/颜色都是独立副本。
- 环侧顶点则相反：`ringBase` 之后**按索引复用扫掠行 0 环**（L327-328「Ring-side vertices are the sweep's row-0 ring (reused by index, no copies)」，ringWorld 来自扫掠顶点 L619-623）。
- 于是子发片几何里存在两类"同位不同索引"顶点：洞侧 16 个左右（12 洞界 + 侧面填充中间行等）与父网格洞边界顶点**位置相同但索引不同**——这正是"两个独立岛"的由来。**注意一个既有怪癖**：底带的洞侧顶点被 `pushBoundary` 推了**两遍**（L117 写进从未被读取的 `bottomBoundaryBase`，L130 写进 `bottomInfo.holeBase`；grep 证实 `bottomBoundaryBase` 无任何读取点），第一份是死拷贝（占顶点槽位、进 `uvAnchors` 但无面引用）——将来做焊接必须先对此去重（遗留原因未核实）。

### 1.3 gridRowIndices 语义（桥接/端盖 = −1）

`createBranchChildGeometry` 末尾（L697-705）：`gridRowIndices/gridColIndices` 全数组先填 −1，只对扫掠段写入 `row = floor(i/ringCount)`、`col = i%ringCount`。因此：
- 桥接全部顶点、端盖中心顶点 = **row −1 / col −1**。
- `geometry.userData` 另存 `bridgeVertexCount`（L714）、`bridgeUvAnchors`（L731，`uvAnchors` 每桥接顶点 `{ring, hole, t, band}`）、`bridgeBoundaryParentIndices`（L732）、`bridgeSeamCol`（L733）。

−1 语义被下游三处消费：UV 展开（unfold 的 passthrough 机制，见 §4）、USDA 导出蒙皮行参数（`rowTAt` 把 −1 归 0，见 §1.5）、wind preview（`deformVertexData` 对 row<0 顶点跳过不动，wind-preview.js L264-266）。

### 1.4 每 lock 独立 mesh 与每 lock 重建路径

- **每 lock 独立 BufferGeometry / 独立 THREE.Mesh**：父发片与子发片是场景里两个 mesh；父 mesh 的几何被 `applyBranchRootRegionCarving`（branch-bridge.js L760-834）**原地挖洞**（删洞内 quad 的索引 + 同步 `quadFaces/triangleEdgeMasks`，L802-832）；子 mesh 用自己的独立几何填洞。
- **重建入口**：`updateLockGeometry`（app.js L12236-12255，可 defer 到 rAF 队列）→ `rebuildLockGeometry`（app.js L12195-12220）：先关 wind preview（L12198），`lock.mesh.geometry = strandGeometryApi.createHairGeometry(lock)`（L12201）→ `branchBridge.applyBranchRootRegionCarving(lock, lock.mesh.geometry)`（L12202）→ `updateBranchChildren(lock)`（L12218，父重建触发子重建）。
- **父子重建耦合**：`branch-hierarchy.js` `updateBranchChildren`（L48-89）对每个子 lock 用 `branchParentFrame` 重推 `child.points`/`pointSurfaceNormals`（L57-66），然后 `updateLockGeometry(child, {updateBranches:false})`（L83）递归。**挖洞是数据驱动、每次父重建重放**（`applyBranchRootRegionCarving` 每次从完整网格重挖，L806-816 保留原作者法线；devlog/annotations-bridge.md「2.2 程序化挖洞」条目确认"每次重建时重放"）。region 编辑路径（branch-region-panel.js `setBranchRootRegionPoint` L168-200、`updateBranchRootRegionCenter` L52-89、`updateBranchRegionCanvasDrag` 各模式 L556-691）都调用 `rebuildLockGeometry(parent)`。

### 1.5 根骨骼移动的几何传播链与"裂开/凹进去"成因

**传播链**（根骨骼移动 → 几何更新）：
1. `enforceBranchRootPosition`（branch-root-bone.js L183-227）：重算最近 guide 参数 `branchParentParameter`（L187-195）、`across = clamp((points[0]-frame.point)·frame.x, ±halfWidth)`（L206-210）、`v = 0.5 - across/width`（L211）、`updateBranchRootRegionCenter(lock, param, v)`（L213）、`points[0]` 写回（L215）。
2. `updateBranchRootRegionCenter`（branch-region-panel.js L52-89）：平移整个 region（含橙色 center，L75-82）→ `rebuildLockGeometry(parent)`（L85-86）。
3. 父重建 → `updateBranchChildren(parent)`（app.js L12218）→ 子重建（branch-hierarchy.js L83）。
4. 子重建时 `buildBranchBridgeGeometry` 重读**父网格当前 position/normal**（L15-17、L46-63）→ 洞侧跟随父网格最新位置；环侧 = 扫掠行 0 环，跟随根骨骼（经 `branchSweepStartT` 种子帧，L567-599、L619-623）。

**"裂开/凹进去"的几何成因（代码依据）**：

1. **洞侧与环侧是两个独立驱动的端点集**。洞侧 = 父网格位置拷贝（L46-63），环侧 = 随根骨骼连续移动的扫掠行 0 环（L327-328）；带内是 Hermite 插值（L87-99，`m0`/`m1` 弦方向投影到各自切平面，L241-246）。当根骨骼位移/旋转较大时，环相对洞发生**横向剪切 + 扭转**，而带按**列 1:1 映射**（底带 L331-343、侧直桥 L345-354、顶带 L357-372，`column[k]` 环侧 ↔ `column[k+1]` 洞侧），剪切下相邻列弦会交叉 → **quad 反转/零面积**（视觉折叠、背面剔除后凹陷），桥接 smooth（Laplacian，L527-537）以环/洞为固定锚、只松弛带内 mid 顶点，进一步放大"凹进去"。
2. **rootRow 离散 vs 环连续**。`rootRow = clamp(round(centerU·(rows-1)), rowMin, rowMax)`（L77-86，center 来自 `region.center.u`）；顶/底带段数 `topSegments = rootRow-rowMin`、`bottomSegments = rowMax-rootRow`（L210-212 / L121-123）。环位置连续、rootRow 按网格行取整 → 根骨骼在行间移动时带的分段**跳变**（`midCount`/0.3 末端循环 L250-262 / L158-169），桥接带形态突变。
3. **导出蒙皮下必然撕开（"接缝处视觉断裂"最直接成因）**：子发片蒙皮走 `bindBySweepRow`（project-files.js L725-739）——子几何无 `leafWeights`（`createBranchChildGeometry` 不写该字段，strand-geometry.js 的 leafWeights 只在 strand split 时写 L398-402），`rowTAt` 把桥接顶点的 gridRow=−1 **clamp 到 0**（project-files.js L693-696）→ `smoothMainPairIndices(lock, 0)` 绑到**子发片自身 `main.0`/`main.1`**（L698-703、L700-702；`smoothMainPair` 定义在 usda-export.js L397）。父洞边界顶点则绑父发片骨骼。子根骨骼一 pose 偏移，桥接洞侧顶点随子骨骼走、父边界不动 → **接缝撕开 + 带被拉伸**。这解释了为何"根骨骼一动就裂开"：rest pose 下位置恰好重合，一旦 pose 偏离立刻断裂。
4. **法线不连续放大断裂感**：洞侧法线恢复自父网格（L738-755），环侧是子径向法线（strand-sweep.js L106-107）；带内大变形时两侧明暗不一致，接缝更"断"（历史上 2.4p/0.2.39 已为同一问题修过一遍，见 devlog/annotations-bridge.md）。

---

## §2 可行性结论

**结论：有条件可以，但不是单一方案；按三个层面分别判断。**

### 层面 A —— 顶点焊接（合并为一个 BufferGeometry 共享索引）

**有条件可以，但改动面大、风险高，不建议作为第一步。**

- **改动范围**：`createBranchChildGeometry`/`buildBranchBridgeGeometry`（branch-bridge.js）不再产出独立子几何，改为把洞侧顶点替换为父网格顶点槽位（或把父子合并成一个 BufferGeometry）；`applyBranchRootRegionCarving`（L760-834）必须从"删面"改为"删面但保留洞边界顶点"；`rebuildLockGeometry`（app.js L12195-12220）父子重建合并为一次 family 级重建；`createHairGeometry` 分流（strand-geometry.js L1007-1024）与每 lock 独立 mesh 假设（§1.4）全部重构。
- **重建路径影响**：父子重建耦合从"父重建 → 触发子重建"（branch-hierarchy.js L83）变成"一个 family 一次重建"；carving 重算逻辑（L802-816）要改为重放挖洞 + 重焊顶点；region 编辑（branch-region-panel.js 多处 `rebuildLockGeometry(parent)`）与 undo（`pushUndoState`）路径都要覆盖新的耦合。
- **wind preview 影响**：`deformVertexData` 对 gridRow<0 顶点跳过不动（wind-preview.js L264-266）——焊接后若桥接顶点仍标 −1 行为不变；若给它们分配了正 row（为配合 weld 而改语义），wind 会把洞侧顶点也当发丝行去变形，行为改变。焊接后 parent mesh 的 rest 缓存 key/内容都要变（几何不再是纯父网格）。
- **UV 导出影响**：见 §4——每 lock 独立 unfold（project-files.js L173-328）与 family 打包（L333-362）的"顶点归属"会被打破，需要改 unpack/unfold 的粒度。
- **蒙皮导出影响**：每 lock 独立 mesh + 独立 SkelBindingAPI（project-files.js L740-894 每 lock push mesh；usda-export.js meshBlock L102-179）假设被打破——共享顶点会同时出现在父、子两个 mesh（重复导出），必须改为 family 级单 mesh 或明确顶点归属；jointIndices 合并、elementSize、blend 区定义全部要落到合并网格上。

### 层面 B —— 位置同步约束（独立索引但每更新强制位置一致）

**可以，改动最小、无导出影响。**

- **改动范围**：仅在 `buildBranchBridgeGeometry`（branch-bridge.js L14-540）/`updateBranchChildren`（branch-hierarchy.js L48-89）补一条保证：洞侧顶点在每次子重建时显式写父网格**当前** position/normal（现状已是位置拷贝，缺的是"父先重建、子后重建"的**顺序保证 + 一致性校验**，以及 `updateBranchSweepStartDrag`（branch-region-panel.js L716-738）这类只重建子的路径的兜底）。
- **重建路径影响**：无结构变化，只加校验。
- **wind preview / UV / 蒙皮导出影响**：**零影响**——索引仍分离、gridRow=−1 语义不变、unfold/usda 全链路不动。
- **局限**：只保证 rest pose 视口不裂，**解决不了导出 pose 下的撕开**（§1.5 成因 3 与索引无关，是权重绑定问题）。

### 层面 C —— 纯权重平滑（不焊顶点）

**可以，改动集中在导出层，是"pose 下不裂"的唯一低成本路径。**

- **改动范围**：`project-files.js` 蒙皮生成（L725-739 `bindBySweepRow` 对 child 的处理，或 L766-818 的 leafWeights 分支）——给子发片加"blend 区权重"：洞侧桥接顶点（经 `bridgeBoundaryParentIndices`/`bridgeUvAnchors.t` 识别）在 `[父骨骼 main.k, 子骨骼 main.0]` 之间按 t 过渡。
- **重建路径 / wind preview 影响**：零（导出层纯函数）。
- **UV 导出影响**：零（不动 UV）。
- **局限**：视口无蒙皮（靠重建），C 不改变视口行为；且 blend 只解决"撕开"，带内折叠/凹陷仍取决于带形（见 §3 子选项讨论）。

**小结**：三层都可实现；**推荐 B + C 先行、A 缓行**（理由见 §3）。

---

## §3 推荐方案

### 3.1 主推：B（位置同步）+ C（导出权重 blend）先行；A（真焊接）作为独立后续

理由：
1. 用户可见的两种"断裂"分属两个层面：视口/重建下的带折叠（B 只保证不裂，折叠靠 §1.5 成因 1/2 的带形问题，需配合 §3.3 子选项）；**导出 pose 下的接缝撕开**（C 直接消除，成因 3）。B+C 一个低风险批次即可覆盖 export 主诉。
2. A 的收益（显式水密拓扑）在渲染上与"位置拷贝 + 法线恢复"（现状 L738-755）几乎等价，代价却是 UV/打包/蒙皮导出全链路重构（§2 层面 A 清单），风险不成比例。
3. A 的若干前置条件（bottom 带洞侧死拷贝去重，L117 vs L130）在任何方案里都要先做。

### 3.2 焊接点集合（若实施 A）

- **焊点 = 洞边界环全周（holeBoundary 输出顶点，branch-connect.js L36-72）+ 子环 row-0 全环（`ringBase..ringBase+ringCount-1`，branch-bridge.js L327-328）**：即桥接带两侧端点环，一一对应（带列 1:1，L331-372）。焊后两侧共用同一组顶点槽位。
- **不焊**：带内中间行（`emitTopMidRow` L231-249 / `emitBottomMidRow` L132-156 / 侧面填充 mid，L386-514）——Hermite 插值顶点保留独立；端盖中心（L643）；侧面填充的洞侧中间行（`sideHoleVertex` L273-282，是洞界上除 4 角外的顶点，归入洞边界环焊点集合）。
- **前置清理**：底带洞侧死拷贝（L117）去重（§1.2）。
- **焊点数量级**：洞界 12 顶点 + 环 2×W+2（W=ringWidthSegments，默认 2 → 6）→ 单子发片 ~18 个共享顶点（未含填充中间行，视 region 高度而定）。

### 3.3 权重 blend 策略

- **blend 区**：桥接带全部顶点（洞侧 t=1 → 环侧 t=0）+ 子扫掠前 N 行（建议 N=2~3，行 0..N-1）。
- **端点权重**：洞边界环顶点 = **父骨骼权重**（导出时直接继承父网格该顶点的 jointIndices/jointWeights，经 `bridgeBoundaryParentIndices` 反向查）；子扫掠第 0 行 = 子骨骼 100%。
- **过渡函数**：带内按 `uvAnchors.t` 做 smoothstep（`w_child = smoothstep(t)`）；扫掠前 N 行按 `row/N` 线性过渡；**jointIndices 取父/子骨骼索引的 union，逐顶点归一化**（父侧 [父main.k, 父main.k±1]、子侧 [子main.0, 子main.1]，blend 后 2~3 影响，elementSize 由 usda-export.js L127 按 `skelIndices[0].length` 自适应）。
- **根骨骼移动下焊接后的表现——两个子选项**（基于代码的判断）：
  - **子选项 1（保守基线，推荐起步）**：洞边界权重 100% 父骨骼 → 根骨骼移动时洞边界基本不动（除非父骨骼动），**blend 区（带 + 前几行）承担全部形变**。与现状"洞侧锚定"的几何架构一致（§1.2），改动最小；消除撕开，但带在根骨骼大位移下仍可能拉伸（折叠由带形决定，需配合 §1.5 成因 2 的 rootRow 连续化）。
  - **子选项 2（软跟随，针对"凹进去"主诉）**：洞边界权重混入子骨骼（如 0.7 父 / 0.3 子，t=1 处），根骨骼移动时洞边界被**轻微拉动**、接缝"跟随"根骨骼，相对位移减小 → 带不再被拉到极限、凹陷显著缓解。代价：**父网格的洞边界顶点必须出现在子 mesh 的 jointIndices 里**（或反之），即跨 mesh 权重，与"每 lock 独立 mesh + 独立骨架"的导出结构（§2 层面 A 清单）冲突——只能走 family 级合并蒙皮，这是 A 的一部分。**判断**：若用户主诉是"凹进去"，最终需要子选项 2，即 C 的完整版必然牵动 A 的导出结构；若主诉只是"裂开"，子选项 1 即可。

---

## §4 UV 兼容性（逐条对照 uv-unfold 约定）

对照 `modules/io/uv-unfold.js` 与 `modules/io/project-files.js` 的现有约定（devlog/uv-unfold.md §5/§6/§7）：

1. **gridRow/gridCol 矩形密度**：`unfoldHairMesh` 要求 grid 顶点构成无缺无重的矩形（`gridDimensions` L32-44；`gridIndexByRowCol` 唯一 key + `expectedGridEntries = R*C` 校验，L401-413）。**焊接后若把洞侧顶点保留为子网格的 −1 顶点（passthrough，L415-437），完全兼容**；若为配合焊接给桥接顶点分配正 row，会与扫掠行号冲突（同一几何两套行域），必须重新编号——**保持 −1 是唯一零改动路径**。
2. **seam 双副本**：child 的 seam 复制在**扫掠环 seamCol 列**与**桥接底带中线**（`passthroughCopyCount=2`，project-files.js L264-268；`passthroughSide` 判定 L269-291；face 重映射按 face 内另一列的环向序判定起终点，uv-unfold.js L593-609）。该判定**只依赖 col/环向序，不依赖顶点索引唯一性** → 焊接共享顶点**不影响 seam 复制逻辑**。但注意：共享顶点若落在 seamCol 列（环 row-0 的 seam 顶点被双副本），洞侧对应顶点 UV 由 `bridgeUvAt` 给洞侧 u（project-files.js L292-319）——共享顶点在 UV 空间会被切开成两份不同 UV（父侧 u、子侧 u），这是**正确的 UV 岛切分**（材质贴图需要），只要 unfold 输出保持"顶点复制"（3D 顶点可共享、UV 顶点复制）。usda-export `st` 是 faceVarying + indices=faceVertexIndices（usda-export.js L146-148），天然支持。**结论：天然兼容，前提是不合并 UV 数据。**
3. **bridgeUvAnchors / bridgeUvAt**：焊接后桥接顶点的 UV 仍走 `uvAnchors`（branch-bridge.js L45、L731）→ `bridgeUvAt` 插值（project-files.js L292-319，u/v 向洞侧插值、洞侧 u=parent 弧长表 `gridUvAt`）。这套机制**不依赖索引分离**，焊接后原样可用。
4. **childUTopologyScale / U 拓扑对齐**（uv-unfold.js L214-307）：扫掠 U 缩放参考 = 环顶面弧长 ↔ 洞顶 u 跨度，靠锚点的 `ring`/`hole`/`band==="top"` 数据（L249-257、L286-296），同样不依赖索引——**兼容**。
5. **family 打包 / uvisland**：`packUnfoldedUv`（project-files.js L333-362）的 family = 主发片 mesh + 其全部子 mesh；`packFamilies` 按 family 统一缩放 + `uvisland` 每 family 一个岛（uv-pack.js L803-809；usda-export.js L169-176）。**焊接后（A）的冲突点**：若子顶点并入父网格，family 的 meshes 集合不再按 lock 划分（一个合并网格 = 一个 family 单元），打包粒度、`uvisland` 归属、父子 UV 独立缩放（V 用 `childVLength` 子长/父长，project-files.js L204-210）都要重定义；**若保持 B/C（不合并几何），family 结构零改动**。
6. **AHS_gridRow/AHS_gridCol 冲突**（usda-export.js L155-168）：每 mesh 输出自己的 primvar。**A 焊接后**合并网格的 row 号要全局重编号（父行 + 子行偏移），否则两套 row 撞车，DCC 重建拓扑时错乱；**B/C 不受影响**。
7. **leafWeights 随 seam 复制**（uv-unfold.js L639-651）：C 方案若给子发片写 `userData.leafWeights`（blend 三元组），unfold 会按 `sourceOfNew` 映射自动复制——**天然兼容**（现有机制），且 seam 副本会正确携带 blend 权重。

**UV 层小结**：B/C 方案下 uv-unfold.js **一行都不用改**（bridgeUvAt/uvAnchors/passthrough/seam 判定全部索引无关）；A 方案必须改：网格行号重编号（第 6 条）+ family 打包粒度（第 5 条），其余天然兼容。

---

## §5 风险清单（按严重度排序）

| # | 风险 | 严重度 | 说明 |
|---|---|---|---|
| 1 | **导出蒙皮结构冲突** | 高 | A 焊接后"每 lock 独立 mesh + 独立 SkelBindingAPI"（project-files.js L740-894；usda-export.js L102-139）被打破：共享顶点重复导出；子选项 2 的跨 mesh 权重要求父顶点进入子 jointIndices——需要 `buildHairUsda` 重构为 family 级蒙皮。 |
| 2 | **重建路径耦合** | 高 | carving 每次父重建重放（applyBranchRootRegionCarving L760-834）；A 要求"挖洞但保留洞边界顶点"；父子重建顺序（branch-hierarchy.js L83）必须严格父先子后；region 编辑（branch-region-panel.js 多处）与 undo 路径全覆盖；漏一条就出现"子读了旧的父几何"→ 复现裂开。 |
| 3 | **UV/打包一致性** | 中高 | §4 第 5/6 条：A 下 family 粒度、uvisland 归属、AHS_gridRow 全局编号必须重定义；做错会破坏导出 UV 岛/纹素密度一致性（0.2.79 之前同类问题踩坑史见 uv-unfold.md §7）。 |
| 4 | **wind preview** | 中 | `deformVertexData` 对 gridRow<0 跳过（wind-preview.js L264-266）：保持 −1 语义则零影响；若 A 给桥接顶点分配正 row 则行为改变。焊接后父几何顶点数变化，per-lock rest 缓存内容/键要重算（重建时本就强制关闭预览，app.js L12196-12198，无新互斥）。 |
| 5 | **镜像** | 中 | `cloneBranchRootRegion` mirror 只翻 region 的 u/v（branch-region-panel.js L118-144），几何按新 region 重建 → 焊接映射（boundaryParentIndices/uvAnchors）随重建自动重算，天然跟镜像一致；但需验证 L/R 世界侧匹配（2.4r 教训：网格 left/right 与世界相反，branch-bridge.js L173-190）在焊接后不串位。 |
| 6 | **快照恢复 / .ahs 文件格式** | 中 | `.ahs` 不存网格，加载时重建 + 重挖（project-state.js L64-69 整 lock 持久化；annotations-bridge.md「2.2」条目）。焊接/权重 blend 若引入**新持久化字段（如 blend 开关/参数）必须进 store（branchState 等），不得进 lock**（lock 整体序列化，加字段即改文件格式）。纯几何层实现则加载路径天然一致。 |
| 7 | **性能** | 低-中 | 桥接带顶点数小（~几十），A 合并后单次 rebuild 顶点增加有限；C 的 blend 计算 O(V)；真正风险是 A 后"family 级重建"把原本异步/惰性的父子重建变同步，拖慢交互（当前 `updateLockGeometry` 有 defer 队列，app.js L12238-12253）。 |
| 8 | **与 wind preview 互斥** | 低 | 无新互斥：`rebuildLockGeometry` 在 windPreviewActive 时先关闭（app.js L12196-12198），B/C/A 都复用该路径。 |

---

## §6 任务切分（未来实施，文件不相交）

符合仓库"子智能体并行、文件不相交"流程（每个任务 = 一个文件 + 测试），依赖关系如下：

| # | 文件（模块） | 内容 | 依赖 |
|---|---|---|---|
| T1 | `modules/geometry/branch-bridge.js` | B 基础：`buildBranchBridgeGeometry` 输出焊接映射表（洞侧顶点 ↔ 父网格槽位，含 bottom 死拷贝去重 L117/L130）；carving 增加"保留洞边界顶点"模式；rootRow 连续化（消除 §1.5 成因 2 的跳变） | 无 |
| T2 | `modules/geometry/branch-hierarchy.js` | 父先子后重建顺序保证 + 位置一致性校验（读父网格当前 position 兜底） | T1 |
| T3 | `modules/io/project-files.js` | C：子发片 blend 蒙皮（洞侧顶点继承父权重、带内按 `bridgeUvAnchors.t` smoothstep、扫掠前 N 行按 row 过渡；jointIndices union + 归一化）；`bindBySweepRow` 对 child 的分支 | T1（读映射表） |
| T4 | `tests/usda-export.test.mjs` + `tests/uv-unfold.test.mjs` | blend 权重数值断言 + 焊接顶点保持 −1 的 unfold 回归 | T3 |
| T5 | `modules/io/usda-export.js` | （仅当采用子选项 2 / A）family 级蒙皮 mesh 输出、AHS_gridRow 全局编号、elementSize 自适应 | T3 |
| T6 | `modules/io/uv-unfold.js` + `modules/io/project-files.js`（packUnfoldedUv） | （仅当采用 A）family 打包粒度/uvisland 归属重定义 | T5 |
| T7 | `modules/geometry/wind-preview.js` | 验证 −1 语义不回归（保持现状即零改动，仅验证） | T1 |
| T8 | `modules/geometry/branch-region-panel.js` / `branch-root-bone.js` | 重建路径全覆盖验证（region 编辑/undo/镜像/快照恢复冒烟） | T1+T2 |

**建议批次**：第一批 = T1+T2+T3+T4（B+C，一个主线 commit，devlog 记一条）；第二批（可选）= T5+T6（A/子选项 2 的导出结构，独立 commit）；T7/T8 为验证任务随批执行。

---

## §7 参考文献 / 依据（实际读过）

### 代码
| 文件 | 关键位置 |
|---|---|
| `modules/geometry/branch-bridge.js` | L14-540 `buildBranchBridgeGeometry`（L42-45 映射声明、L46-63 `pushBoundary` 位置拷贝、L77-86 rootRow clamp、L87-99 hermite、L116-171 bottom 带（L117/L130 双推）、L173-190 side 直桥、L195-265 top 带、L272-320 洞侧缓存/预推、L327-328 ringBase、L331-372 三带面、L386-514 侧面填充、L527-537 smooth、L539 return）；L542-758 `createBranchChildGeometry`（L603-640 扫掠+桥接合并、L697-705 gridRow −1、L714-733 userData、L734-755 法线恢复）；L760-834 `applyBranchRootRegionCarving`；L836-915 `branchRootRegionSurface`；L917-935 `branchRegionTopEdgeCount` |
| `modules/geometry/branch-connect.js` | L14-29 `squareChildRing`；L36-72 `holeBoundary`（L58-62 按网格索引去重）；L76-139 `connectSide`；L143-162 `connectBoundaryToRing` |
| `modules/geometry/strand-sweep.js` | L13-155 `sweepSide`（L30-31 段数、L62-68 row0=seedFrame、L99-114 pass2 顶点/UV、L116-128 链平滑 pinRows[0]） |
| `modules/geometry/branch-root-bone.js` | L70-103 `applyBranchRigidRootMove`；L133-143 `branchParentFrame`；L155-181 `captureBranchLocalState`；L183-227 `enforceBranchRootPosition`（L206-210 across clamp、L213 区域中心联动） |
| `modules/geometry/branch-region-panel.js` | L52-89 `updateBranchRootRegionCenter`（L85-86 rebuild parent）；L118-144 `cloneBranchRootRegion`（mirror）；L168-200 `setBranchRootRegionPoint`；L556-691 `updateBranchRegionCanvasDrag`；L716-738 `updateBranchSweepStartDrag` |
| `modules/geometry/branch-hierarchy.js` | L33-35 `branchChildrenFor`；L48-89 `updateBranchChildren`（L83 子重建、L84 递归） |
| `modules/geometry/strand-geometry.js` | L1007-1057 `createHairGeometry`（L1008-1024 子发片分流）；L398-402 leafWeights（仅 split）；L425-439/L595-602/L697-704/L960-969/L1205-1212 gridRow 写入 |
| `app.js` | L12195-12220 `rebuildLockGeometry`（L12198 wind 关闭、L12201-12202 重建+挖洞、L12218 子更新）；L12236-12255 `updateLockGeometry`（defer 队列）；L8129-8144 BRANCH_SIDE_FILL/BRANCH_CONNECTION + branchBridge api；L6319/L6418 hierarchy/rootBone api |
| `modules/io/uv-unfold.js` | L32-44 `gridDimensions`；L69-194 `gridUvTable`；L196-207 `gridUvAt`；L214-307 `childUTopologyScale`；L330-664 `unfoldHairMesh`（L401-413 密度校验、L415-437 passthrough、L455-464 childV、L593-609 seam 判定） |
| `modules/io/project-files.js` | L120-128 `kindForLock`；L131-134 `childSeamCol`；L173-328 `buildUnfoldedMeshes`（L204-210 childVLength、L228-247 uOffset/uScale/childVSweepStart、L264-321 passthrough/bridgeUvAt）；L333-362 `packUnfoldedUv`（family=主+子）；L693-696 `rowTAt`（−1→0）；L698-703 `smoothMainPairIndices`；L725-739 `bindBySweepRow`；L740-894 per-lock mesh 导出（L766-818 蒙皮、L816 fallback） |
| `modules/io/usda-export.js` | L95-99 `hasSkinData`；L102-179 `meshBlock`（L112-138 SkelBindingAPI + elementSize、L146-148 st faceVarying、L155-176 AHS_gridRow/gridCol/uvisland）；L397 `smoothMainPair`；L707-717 `bridgeRootParentName`（子 main.0 → 父 main.k） |
| `modules/geometry/wind-preview.js` | L243-319 `deformVertexData`（L264-266 row<0 跳过） |
| `modules/io/project-state.js` | L35-41 `projectSnapshotLocks`；L64-69 `scene.locks = state.locks`（lock 整对象持久化） |

### 文档
- `devlog/annotations-bridge.md`：桥接系统专题（2.4a→2.4t 演进、0.2.39 法线恢复、0.2.43-0.2.44 侧面填充索引 bug、0.2.45 Uniform Smooth、0.2.59 统一扫掠内核）。
- `devlog/uv-unfold.md`：§5 child UV 规则（seam 背面、U 拓扑对齐、V 对齐洞底、childVSweepStart）、§7 踩坑（横缝取消、bottom band 与 side fill 洞底角 UV 连续）。
- `devlog/weight-algorithm.md`：§1 视口权重=扫掠参数化就近分配；§3 `smoothMainPair` 相邻主骨骼线性混合、`rowTAt` 端盖 −1 → 根。
- `devlog/usd-bone-export.md`：§1 单 SkelRoot/每 mesh SkelBindingAPI；§2 子发片 `main.0` 挂父 `main.k`（`bridgeRootParentName`）；§9。
- `devlog/annotations-root-bone.md`：根骨骼移动约束链（tube 约束、region 中心联动、H 刚体）。
- `devlog/BranchSystem.md`：子系统划分与依赖（updateBranchChildren 是跨组 hub）。

### 未核实项
- Houdini 中对当前"子发片 pose 下接缝撕开"的实机复现（本文依据是 project-files.js 的 `rowTAt`/`bindBySweepRow` 代码路径推导，未实机导入验证）。
- `bottomBoundaryBase` 双推（branch-bridge.js L117 vs L130）是否为遗留死代码（grep 证实无读取，历史成因未核实）。
- 根骨骼大位移下带内 quad 反转的临界位移量（未做数值实验，依据为 Hermite 弦切线 + 1:1 列映射的推导）。
