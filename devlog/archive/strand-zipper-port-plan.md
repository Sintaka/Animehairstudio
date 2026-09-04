# 普通发丝多拉链移植计划 (Strand Multi-Zipper Port Plan)

> **状态（0.2.116）：已全部实施（Phase A–F 落地并合并，Node 267/267 + 真实工程 82/82）。** 本文档保留为设计/踩坑参考；实现摘要见 local-adaptation-log.md / js-change-annotations.md「0.2.116」。
>
> **⚠️ 原「已知未做项」已过期（0.2.124–0.2.126 更新，勿据旧结论重做）**：
>
> | 原列为未做 | 现状 | 权威文档 |
> |---|---|---|
> | per-segment spread UI | **已做**（0.2.125）：段选择器 + 每管 Spread + 每段曲线预览（`#strandSegmentControls`） | [strand-tip-width-ui-port-plan.md](strand-tip-width-ui-port-plan.md) |
> | 发尖 WidthCurve（本文未列但常被问） | **已做**（0.2.125）：共享层 `tip-width-curve.js` + 发丝侧 `strand-tip-width.js` | 同上 |
> | 发尖**选中系统** | **已做**（0.2.126）：`tip-sub-bone-host.js` + `tipSelection`/`tipHover` 键 | [strand-tip-selection-port-plan.md](strand-tip-selection-port-plan.md) |
> | strand 拉链 snap-to-loops | **仍未做**，且判定为**非缺口**：发丝没有纵向 loop 拓扑可吸附 | — |
> | N>2 子发片桥接 | **仍未做**（Phase F 门控禁用） | 本文 Phase F |
>
> **另：本文描述的横向推开规则已在 0.2.124 被替换。** 本文 §1 记的 per-section `direction` 为离散 ±1/0（最左 −1 / 最右 +1 / 中间取中心符号）——该规则会让相邻管拿到同一 direction、一起平移，导致**无论加多少 zipper 只有一条缝张开**。现为单调递增的 `strandSplitDirection(k, N) = (2k − N) / N`，**唯一定义点在 `modules/bones/bone-model.js`**，geometry 与 usda-export 真 import（N=1 仍恒 `[-1, +1]`）。见 bug-fixes.md #17。

一句话摘要：将面板 (panel) 已支持的多拉链机制 (`lock.panelSplits=[{position,height,order}]`) 移植到普通发丝 (normal strand)，使其从单拉链 (`lock.strandSplit*`) 升级为多拉链 (`lock.strandSplits=[...]`)，并完成几何、UV、骨骼、UI、子桥接的适配。

---

## 1. 当前发丝分割几何 (createSplitStrandGeometry)

入口 `createSplitStrandGeometry(lock, curve, profilePoints)`，`modules/geometry/strand-geometry.js:83`。完整链路：

- **profile 采样与 splitX**：`strand-geometry.js:85-97`。用 `radialSegments` + profilePoints 混合采样参数（`:86-91`）生成闭合 `polygon`（`:92`）；取 `minX/maxX`（`:93-94`），`maxX-minX<0.0001` 直接返回 null（`:95`）；`splitPosition=clamp(lock.strandSplitPosition, -0.8, 0.8)`（`:96`），`splitX=lerp(minX,maxX,pos*0.5+0.5)`（`:97`）。**单一 split 位置**。
- **clipStrandProfilePolygon**：`strand-geometry.js:43-64`。Sutherland-Hodgman 式半平面裁剪：`keepLeft` 决定保留 `x<=splitX` 或 `x>=splitX`，穿越边界时在 `x=splitX` 处插入插值点（z 用 lerp，`:52-57`），去重相邻重合点（`:61-63`）。
- **sections（恒为 2）**：`strand-geometry.js:98-102`。`[{points:clip(左), direction:-1},{points:clip(右), direction:1}]`，过滤 `points.length>=3`，`sections.length!==2` 返回 null（`:102`）——**硬编码 2 段**。
- **splitHeight/splitStart**：`:127-128`。`splitHeight=clamp(lock.strandSplitHeight,0.02,0.8)`，`splitStart=1-splitHeight`（切口自 tip 起算深度）。**单一 height**。
- **spread/opening（每管张开）**：`:129-134,:200-205`。`baseWidth=baseWidth??width*widthScale`；`splitBones=strandSplitBonesFor(lock)`；`defaultSplitSpread=clamp(lock.strandSplitGap,0,0.99)`。每管 `tubeSpread=splitBones[sectionIndex].spread ?? defaultSplitSpread`；`opening = t<=splitStart ? 0 : baseWidth*tubeSpread*smoothstep(t,splitStart,1)*section.direction`（`:203-205`）——沿 `frame.x` 按 direction(±1) 反向推开两管。
- **sectionBases**：`:141-153`。每段 `{base, ringSize:points.length, faceBase}`；`sectionVertexBase += (actualLengthSegments+1)*ringSize`，`sectionFaceBase += actualLengthSegments*ringSize`。供 child-bridge 定位每管顶点/面基址。
- **sweep（先侧面，后端盖）**：`:181-234`。逐段逐行逐列 emit 顶点：`strandProfileTopologyAt` warp（`:191-198`），`ringPoint` 由 frame.x/z * warped * factors[row]（曲率收窄）+ `opening` 沿 frame.x（`:206-211`）；tangent（`:212`）、uv=`(column/ringSize, t)`（`:213`，即临时 uv，后由 uv-unfold 覆盖）、color（`:214`）；`strandSplitWeights.push(mainJoint, sectionIndex, tipCaptureWeightAt(...))`（`:215-218`，格式 `[mainJoint, leafIndex=tube, weight]`）。侧面三角在 `:222-233`：每 quad 两三角 `indices.push(a,c,b,b,c,d)`，`triangleEdgeMasks.push([0,1,1],[1,1,0])`，`sideTriangleCount+=2`。
- **平滑与 rest**：`smoothTubeVertices`（`:237-264`，逐段 `smoothSweepChains`）；`splitRestCenters=sweepRingCentroids(vertices,sectionBases,sweepRows)`（`:265`）。
- **tip 子骨骼变形**：`:270-312`。仅当 `splitBones` 存在，每段 `materializeTipChain`（`:277`），按 `tipWeightAt(t,splitStart)` 把顶点 lerp 到 tip 帧空间。
- **quadFaces + 端盖（cap 在所有侧面之后）**：`:313-348`。`quadFaces` 逐段 `[a,c,d,b]`（`:315-328`）；端盖用 `THREE.ShapeUtils.triangulateShape`（`:333-336`）在每段 start/end 生成三角（`pushOrientedTriangle`，`:343-347`），`triangleEdgeMasks.push([1,1,1],[1,1,1])`。注释明确「cap 必须在侧面之后」以满足 carve 的 faces-first 规则（`:329`）。
- **grid metadata（融合网格，child-bridge 用）**：`:350-419`。`fusedCols=polygon.length`（`:355`）；`colToSection[c]`=每个 polygon 列归属哪段（`point.x<=splitX?0:1`）及段内 local col（`:356-366`）；`fusedIndexAt(r,c)`=`sectionBases[section].base + r*ringSize + col`（`:367-372`）；`faceToRendered`：融合面若两列同段→映射真实面 base，跨段（缝合面）→`-1`（`:373-386`）；`splitStartRow=round(splitStart*actualLengthSegments)`（`:387`）。
- **userData 输出**：`:401-439`。`leafWeights`/`strandSplitWeights`（`:398-399`）、`sideTriangleCount`、`triangleEdgeMasks`、`quadFaces`、`gridRows=actualLengthSegments+1`、`gridColumns=fusedCols`、`gridFacesPerRow=fusedCols`、`splitSections=sectionBases`、`strandSplitRestCenters`、`splitFusedGrid={cols,colToSection,faceToRendered,fusedIndexAt,splitStartRow}`（`:413-419`）。
- **AHS_gridRow/gridCol primvar（UV 关键）**：`:420-439`。逐段填 `gridRowIndices[vertexIndex]=floor(offset/ringSize)`，`gridColIndices[vertexIndex]=gridColBase + (offset%ringSize)`，段间 `gridColBase += ringSize`（`:427-437`）——即**每管列号 = 管内 local col + 全局列偏移（前面各管 ringSize 之和）**，管首列(local 0)=clip seam 点。这是 N-tube UV 泛化的核心已有机制。

## 2. 面板多分割几何 (createPanelStrandGeometry)

入口 `createPanelStrandGeometry(lock)`，`modules/geometry/panel-tip-strand.js:705`。这是**已经支持多拉链**的参照实现——但它是 ribbon（front/back 双壳 + 墙），与 strand（闭合环 tube）拓扑不同。

- **splits 归一化**：`:724-727`。`splitEnabled=lock.panelSplitEnabled!==false`；`splits=normalizePanelSplits(lock.panelSplits, lock.panelSplitHeight, widthLoops-1).filter(h>0.005)`。`normalizePanelSplits`（`app.js:1525-1553`）：clamp position∈[-0.88,0.88]、height∈[0,0.78]、补全并去重 `order`、**按 position 排序**，最多 23 条。这是 strand 要 mirror 的数据结构。
- **N boundaries → N+1 段**：`:732`。`boundaries=[-1, ...splits.map(s=>s.position), 1]`。段数=splits.length+1。
- **每段列分配（自适应）**：`:981-993`。每段保底 1 列，剩余列 `remainingColumns` 按段横向 span 比例分配（`floor` + 最大余数优先，`:984-993`）。
- **段循环 + addPatch**：`:994-1020`。每段取 `leftSplit=splits[segment-1]`、`rightSplit=splits[segment]`，`uStart/uEnd` 由段边界 ± `tipWidthSpreadGap`（每段相对 spread，`:1007-1012`），调用 `addPatch(0,lengthLoops,uStart,uEnd,columns,{colBase,capStart,capEnd,leftWallStartRow,rightWallStartRow},bone,segment)`。
- **墙 quad 条带**：addPatch 内 `:955-967`。左墙 `addQuad(front[row][0],back[row][0],...)` 仅当 `globalRow>=leftWallStartRow`（`:961-963`），右墙同理（`:964-966`）。`leftWallStartRow=rowParameters.findIndex(p>=1-leftSplit.height)`（`:1017`）——**每段拉链各有独立 height 决定墙起始行**。这是「多 height」的核心：每条 split 用自己的 height 决定切口深度。
- **caps**：`capStart`（`:968-972`）/`capEnd`（`:973-978`）各用一列 quad 封每段根/尖。
- **snap-to-loops**：`snapPanelSplitHeight(height,lengthLoops)`（`app.js:1559-1563`）= `round(h*loops)/loops` clamp 到 `floor(0.78*loops)/loops`——height 吸附到 loop 行，墙首行落顶点行、无 T 缝。应用在 segment-control.js:49、bone-interaction.js:553 等。
- **colBase +1 预留（bug-fixes.md #8）**：`:1014` `colBase: segmentColumns.slice(0,segment).reduce((sum,count)=>sum+count+1, 0)`。`devlog/bug-fixes.md:92-93` 记录根因：原 colBase 只累加各段列数不为边界预留格子 → 段 k 末列与段 k+1 首列共用同一 (row,col) → 导出重映射时坍缩填缝。修复①每段 +1 预留列（C=46→54=每行顶点数，格子唯一）；②`weldPanelGeometryData` 的 weld key 加入 gridRow/gridCol（`:83-86`），fork 以上位置重合但格子不同的边界链顶点不被焊掉。
- **grid col 编号**：`:940,:947`。front `gridCols=(colBase+column)*2+1`、back `(colBase+column)*2`——ribbon 双壳交错。**strand 无双壳**，这条不能照抄。
- **weld + 法线平滑**：`weldPanelGeometryData`（`:70`，调用 `:1034`）按位置+gridRow/gridCol 桶合并；`smoothCoincidentPanelNormals`（`:1052`）。
- **triangleEdgeMasks + 绕序翻转**：`:1024-1032`，曲线面板整体翻转 v1/v2 并同步 mask。

**可复用 vs panel 专属**：`normalizePanelSplits` 数据模型、每段列分配算法、snap-to-loops、`leftWallStartRow=findIndex(p>=1-height)` 的 per-split-height→墙起始行映射、颜色/weight per-segment 写法——**可复用**。front/back 双壳、墙 quad（strand 是闭合环无 front/back 概念）、`gridCols*2(+1)` 交错编号、`tipWidthSpreadGap`/tip sub-bone 那套 panel WidthCurve——**panel 专属**，strand 侧要换成「闭合环 profile 逐 split 裁剪」+「每管 opening 沿 frame.x 推开」（见 topic 3）。

## 3. 多分割裁剪泛化 (1→2 变 N→N+1)

现状：`clipStrandProfilePolygon(points, splitX, keepLeft)`（`strand-geometry.js:43-64`）是**半平面裁剪**——只保留一侧。当前用 2 次裁剪（左半 `keepLeft=true`、右半 `keepLeft=false`）得到 2 段（`:98-101`）。这天然可泛化为「区间带裁剪」。

**泛化设计（N split → N+1 段）**：

1. **数据**：`strandSplits=[{position,height,order}]`（position∈clamp，按 position 排序，mirror `normalizePanelSplits`）。计算 `splitXs = splits.map(s => lerp(minX,maxX,s.position*0.5+0.5))`，并 `sort`。`boundaryXs = [minX-ε, ...splitXs, maxX+ε]`（N+2 个边界 → N+1 段）。
2. **区间裁剪函数**：把单参数 `clipStrandProfilePolygon` 泛化为 `clipStrandProfileBand(points, lowX, highX)`——保留 `lowX<=x<=highX` 的多边形，两侧各插值一次穿越点。实现 = 现有半平面裁剪串联两次：先 `clip(points, highX, keepLeft=true)` 再 `clip(result, lowX, keepLeft=false)`（两次半平面裁剪 = 一个带）。**复用现有 `clipStrandProfilePolygon`**，零新裁剪算法。
3. **sections（N+1 段）**：`sections = boundaries 相邻对.map((lo,hi,i) => ({ points: clipBand(polygon,lo,hi), direction: 段方向 }))`，过滤 `points.length>=3`。替换 `:98-102` 的硬编码 2 段与 `sections.length!==2` 检查（改为 `!==N+1` 或 `<1`）。
4. **per-section direction/spread（横向推开）**：当前 2 段 direction=-1/+1（`:99-100`），opening 沿 frame.x（`:205,:210`）。泛化：每段的横向推开方向应指向**远离 profile 中心**。用段中心 `centerU=(loBoundaryPos+hiBoundaryPos)*0.5` 的符号或 `centerX`（段几何质心 x 相对 splitX 邻居）决定 direction 与幅度。参照 panel `rawPanelPoint` 的 `centerU=(boundaries[seg]+boundaries[seg+1])*0.5`（`panel-tip-strand.js:838`）：每段绕**自身中心**张开，避免中间段无处可去。中间段可 spread≈0 或按到最近 split 的距离缩放，边缘段向外。每段 spread 取 `splitBones[i].spread ?? defaultSplitSpread`（沿用 `:200-202` 机制，但索引 0..N）。
5. **per-section height（每拉链尖端深度）**：现状单一 `splitStart=1-splitHeight`（`:127-128`），opening 门槛 `t<=splitStart?0:...`（`:203`）。泛化：**每段的开口起始由其两侧相邻 split 的 height 决定**。段 i 左边界=splits[i-1]、右边界=splits[i]。段整体的「开始张开行」应是 `max`（或按侧分别处理）相邻 split 的 `splitStart_k=1-splits[k].height`。最简：段 i 的 `sectionSplitStart = 1 - max(leftSplit?.height, rightSplit?.height)`；更精确（贴合 panel 的 per-side 墙起始）：把 opening 拆成左右两侧沿 profile 列分别按 `1-leftSplit.height` / `1-rightSplit.height` smoothstep。首选先做「段级单一 sectionSplitStart」，验证水密后再做 per-side。
6. **capping（每段封口）**：现有端盖逻辑（`:329-348`，`triangulateShape` 每段 start/end 三角）**天然按 sections 循环**，N+1 段自动各自封口，无需改结构，只随 sections 数量增加。侧面三角（`:222-233`）同样按段循环，自动泛化。
7. **sectionBases**：`:141-153` 已是 `sections.forEach` 累加，N+1 段自动正确。

**结论**：几何裁剪/sweep/cap 的循环骨架已经是「按 sections 遍历」，真正硬编码 2 的只有：`sections` 构造（`:98-102`）、direction（±1）、单一 splitX/splitHeight 读取（`:96-97,:127`）。把这三处换成数组驱动即可。**opening 的 per-section direction 与 per-section height 是唯一需要新逻辑的地方**，其余复用。

## 4. UV 生成 (关键) — 2-tube → N-tube

**重大发现：`unfoldHairMesh` 的 split 分支已经是 N-tube 泛化的**，本质上不需要改。文件 `modules/io/uv-unfold.js`，doc `devlog/uv-unfold.md` §3（0.2.75/0.2.77）。

### 现状 split UV 精确语义

- **网格列布局**：`uv-unfold.md:26` + `uv-unfold.js:130-166`。网格列 = 管局部列 + 全局偏移：管 g 的 local col l(0..ringSize−1，l=0 = clip seam 点即管首列) → 全局 col = `colBase_g + l`，`colBase += ringSize`。**无 −1 网格顶点**（0.2.75 废弃 `colToSection.findIndex`，见 md 踩坑 #4）。这正是 `strand-geometry.js:427-437` 写 `gridColIndices` 的方式。
- **AHS_gridRow/gridCol 语义**：`gridRow`=行主序沿曲线行号；`gridCol`=管局部偏移列（**非 fused 列**，`uv-unfold.md:29`）。
- **每管 U 轴不重叠并排**：`uv-unfold.js:157-165`。管 g 的 `u = (accBase 前管周长累计 + 本管从 seam(l=0) 起累计弧长) / 总周长`。`accBase += tubeCirc`，管 g 排在管 g−1 右侧。总周长 = 各管周长和（含各管 wrap 边）。→ **arc-length per section 已实现**：每管独立算周长 `tubeCirc`（`:151-154`），各管 seam 终点 `seamEndsRaw[g]`（`:162`）。
- **per-section seam 双副本**：`uv-unfold.js:364-387,:535-540`。`rowStride = C + tubeOrder.length`——**每管一个 seam 副本槽**（pos `C+g`，u=`seamEndU[g]`）。填充 `:535-540` 逐管把管首列复制到副本槽。→ **per-section seam 已实现**。
- **wrap quad 保留（管尾↔管首）**：`uv-unfold.js:610-630`。split 分支按 `seamTubeByCol` 判定管首列顶点：face 中另一列若=管尾(`last`)→指向终点副本槽 `C+g`(u=seamEndU[g])，若=管首+1→起点(u=0)。管沿切缝闭合、不丢面。
- **弧长表关键循环**：`gridUvTable` 的 split 分支 `for g<splitSections.length`（`:137-166`）——**已经是 for-N 循环**，读 `userData.splitSections`（即 `sectionBases`）。
- **unfold 主循环**：`:374-387` 建 `tubeCols/tubeOrder/seamTubeByCol` 也是 `for g<splitSections.length`。密度校验 `expectedGridEntries=R*C`、`colBase!==C→null`（`:385,:413`）。

### 扩展到 N tubes 需要做什么

**几乎不用改 uv-unfold.js**——它读 `userData.splitSections`（数组）、`gridColIndices`（全局偏移列），循环上限就是 `splitSections.length`。只要 topic 2/3 让 `createSplitStrandGeometry` 对 N+1 段：①`sectionBases` push N+1 个 `{base,ringSize,faceBase}`；②`gridColIndices` 按 N+1 段累加 `gridColBase`（`strand-geometry.js:427-437` 已是 forEach 循环）——UV 侧自动得到 N 管并排、每管独立弧长、每管独立 seam 副本、每管 wrap 保留。

**需验证/可能微调**：
- `rowStride = C + tubeOrder.length` 随 N 增大自动扩容（`:386`），无硬编码 2。
- `referenceCircumference`/`uScale`/`uOffset` 归一（`:171-191`）对 seamEndsRaw 数组 map，已支持数组。
- U 布局 side-by-side 无重叠：N 管依次 accBase 累加，天然不重叠（`:157-165`）。
- 唯一风险：调用方传入的 `kind:"split"` 判定与 `splitSections` 一致性；以及若某段 clip 后 ringSize<2 会 `return null`（`:139,:376`）——N 段里任一段退化都会使整表回退，需保证 topic 3 的裁剪不产生 <3 点的段（已在 sections 过滤 `>=3`）。

引用路径：`gridUvTable` split 分支 `uv-unfold.js:130-166`；归一 `:171-191`；`unfoldHairMesh` split 布局 `:364-387`；split 填充 `:523-541`；split face 重映射 `:610-630`；写入源 `strand-geometry.js:420-439`；踩坑记录 `uv-unfold.md:64`（#4 findIndex）。

## 5. 数据模型迁移 (strandSplits 数组 + 兼容 legacy)

**提案**：新增 `lock.strandSplits=[{position,height,order}]`（mirror `panelSplits`），保留 `lock.strandSplitEnabled` 作总开关。旧字段 `strandSplitPosition/strandSplitHeight/strandSplitGap` → 加载时迁移成单条 `strandSplits=[{position, height, order:0}]`（gap 单独保留为 `defaultSplitSpread` 或迁进 splitBones spread）。

**迁移函数**：仿 `normalizePanelSplits`（`app.js:1525`）新增 `normalizeStrandSplits(value, legacyPos, legacyHeight, maxCount)`：`value` 缺失时用 `[{position:legacyPos??0, height:legacyHeight??0.3}]` 回退，clamp position∈[-0.8,0.8]、height∈[0.02,0.8]、补 order、按 position 排序。加载点检测：`if (!Array.isArray(base.strandSplits) && base.strandSplitEnabled) 用旧三标量建单条`。

**每个 grep 确认的 strandSplit* 读取点（file:line）——见文末清单**。此处按功能归类：
- **默认值**：`app.js:1458-1461`（strandCreationDefaults）。
- **加载 applyLockData**：`app.js:9071-9077`（`strandSplitEnabled/Position/Height/Gap/Bones` 读取，迁移主入口）。
- **镜像 mirror（快照）**：`app.js:9296-9302`（含 `strandSplitPosition` 取负）。
- **镜像 partner**：`app.js:9466-9472`（含取负）。
- **保存 serialize**：`app.js:9694-9700`。
- **快照恢复**：`app.js:10250-10256`。
- **profile/handle 数据**：`app.js:11188 strandSplitProfileData`、`11201 strandSplitControlPoint`。
- **UI 同步**：`app.js:13152-13156`（gap 输入）、`13219-13220`（splitStart/spread）、`13256-13263`（tip length）。
- **arc 分布**：`app.js:7558`（`useSymmetricArcDistribution=!strandSplitEnabled`）。
- **creation-presets.js**：`:58-61`（复制 4 字段）、`:186`（字段白名单）。
- **clump-brush-presets.js**：`:31-34`（4 字段列表）。
- **draw-flow.js**：`:462`（白名单）、`:663-666`、`:874-877`、`:1047-1050`（描边 stroke 默认/覆盖）。
- **project-files.js**：`:127`（`strandSplitEnabled→kind "split"`）、`:735-736`（bone 导出 forkT）。
- **bone-model.js**：`:315 defaultStrandSplitSpread`、`:318-328 strandSplitForkT`、`:341-372 strandSplitBonesFor/materializeStrandSplitBones`、`:375-403 to/fromData`。
- **bone-view-handles.js**：`:526-565` 及后续（handle 可见性、`strandSplitPosition/Height` 读取）。
- **bone-interaction.js**：`:159-167`、`:243-261`、`:310-331`（拖拽写 `strandSplitPosition/Height`）。
- **usda-export.js**：`:554-564`、`:627-637`、`:695`（split bone/权重导出）。
- **strand-geometry.js**：`:96,:127,:133-135`（几何读取，topic 1/3 已述）。
- **poly-tools.js**：`:654-655`（curveObjects 占位）。

**迁移策略**：加载时把 legacy → `strandSplits`，运行时几何/UI/骨骼/导出统一读 `strandSplits`。保存时同时写 `strandSplits`（新）与单条 legacy 镜像（若 length===1，向后兼容旧版本读取）或仅写新数组 + 版本号。`strandSplitEnabled=false` 时 `strandSplits` 视为空。

## 6. 骨骼 (strandSplitBones 2→N)

现状 `strandSplitBones` 硬编码 length 2（每管一根）。文件 `modules/bones/bone-model.js`。

- **strandSplitBonesFor**：`bone-model.js:341-364`。`stored = strandSplitBones.length===2 ? ... : null`（`:343`）——**硬编码 2**；默认派生 `[0,1].map(...)`（`:348`）——**硬编码 2 管**。
- **materializeStrandSplitBones**：`:367-373`，从派生写回持久字段，随 `strandSplitBonesFor` 自动跟 N。
- **strandSplitBonesFromData**：`:403-406`，`data.length!==2` 返回 null（`:404`）——**硬编码 2**。
- **strandSplitForkT**：`:318-321`，`1 - strandSplitHeight`（单一 height）。多拉链后每管的 fork 应由**其两侧相邻 split 的 height** 决定（仿 panel `splitChainLayout` 的 `1-max(相邻段高)`，见 `usda-export.js:616-619`）。
- **defaultStrandSplitSpread**：`:312-316`，读 `strandSplitGap`。
- **direction 硬编码**：多处 `direction = k===0 ? -1 : 1`（`usda-export.js:565,:638`）——只区分 2 管。N 管需按段中心 u 符号或每段 direction 数组决定。

**泛化方案**：
1. `strandSplitBonesFor`：段数 = `strandSplits.length + 1`（记 N+1）。`stored.length === N+1` 判定，默认派生 `Array.from({length:N+1}, (_,k)=>...)`，每根 `parentParam = 1 - 段k两侧相邻split的max(height)`（或按侧），`spread` 每段独立。
2. `strandSplitBonesFromData`：`data.length !== N+1` → null（N 由 `strandSplits` 长度推）；或放宽为「与当前 strandSplits 匹配则接受，否则重派生」。
3. `strandSplitForkT` → `strandSplitForkTForSegment(lock, segmentIndex)`：读相邻 split height。
4. direction：段中心 `centerU=(boundaries[k]+boundaries[k+1])/2` 的符号（或整段绕自身中心张开，仿 panel `rawPanelPoint:838`）。

**USDA 导出**（`modules/io/usda-export.js`）：
- `splitBoneLayout` 发丝分支 `:554-576`：`splitHeight` 单值（`:556`）、`direction=k===0?-1:1`（`:565`）——改为 per-segment height + per-segment direction。
- `splitChainLayout` 发丝分支 `:627-657`：`forkT=1-strandSplitHeight`（`:630`）、`direction=k===0?-1:1`（`:638`）、`restPointAt` 用单一 splitStart/spread（`:635-646`）——改为按段 k 取相邻 split height 的 forkT（仿同函数 panel 分支 `:616-619` 的 `1-max(相邻段高)`）+ per-segment direction。
- joint orient 发丝分支 `:695-704`：按 chain 逐点，随 N 自动，无需改结构。
- `project-files.js:735-736` bone 导出 forkT 同样单值，需 per-segment 化。

**镜像/序列化**：`mirrorStrandSplitBones`（`:410-424`）、`strandSplitBonesToData`（`:375-401`）按数组 map，天然支持 N，只是长度断言（fromData `:404`）要放开。

**风险**：panel 已有 N 段骨骼的成熟范式（`splitChainLayout` panel 分支就是 per-segment），strand 侧直接对齐该逻辑即可，改动集中在「2→N 的长度断言」和「单 height/direction → per-segment」。

## 7. UI (单拉链手柄 → 多手柄 +/- 控件)

**现状（strand，单拉链）** `index.html:1176-1180`：
- `#strandSplitControls`（`:1176`）容器，`#strandSplitEnabled` 复选（`:1178`）、`#strandSplitGap` 滑块（`:1179`）、`#strandSplitTipLength` 滑块（`:1180`）。**无 segment 选择器、无 +/- 计数器、无 position/height 滑块**（position/height 只能靠视口手柄拖）。
- app.js 绑定：`strandSplitInputs`（`app.js:3323-3325`）只含 enabled/gap；`strandSplitValues`（`:3327-3328`）；`strandSplitTipLengthInput`（`:3340-3341`）；同步 `app.js:13152-13156,:13256-13263`；tip target `:16977-17024`。
- 视口：单手柄 `strandSplitHandle`/`strandSplitLine`（`bone-view-handles.js:179-195,:526-561`），2 个 tip 手柄 `strandSplitTipHandles`（`:197-220,:571-585`）；拖拽写 `strandSplitPosition/Height`（`bone-interaction.js:310-331`）。

**参照（panel，多拉链）** `index.html:1099-1129`：
- `Split Segments` 段选择器：`previousPanelSegment`/`nextPanelSegment` + `#panelSegmentLabel`（`:1100-1107`）、`#panelSegmentSpread` per-segment 滑块（`:1108`）、per-segment Width/Depth Curve 编辑（`:1109-1118`）。
- `Zipper Controls` +/- 计数：`#removePanelSplit`/`#addPanelSplit` + `#panelSplitCount`（`:1122-1129`）、`#panelSplitSnapToLoops`（`:1121`）。
- 逻辑全在 `modules/bones/segment-control.js`：`changePanelSplitCount(delta)`（`:108-152`，+ 时在最大间隙插入、- 时删 order 最大者）、`syncPanelShapeInputs`（`:45-70`，disable +/- 按边界）、`selectedPanelSegment`/`syncPanelSegmentControls`（`:16-43`）、`deleteSelectedPanelSplit`（`:156-175`）。

**移植方案**：
1. index.html 在 `#strandSplitControls` 内新增：`Strand Split Segments` 段选择器（prev/next + label）、`Segment Spread` per-segment 滑块（替代/补充全局 gap）、`Zipper Controls` +/-（`#addStrandSplit`/`#removeStrandSplit`/`#strandSplitCount`）。
2. 新建 `strand-segment-control.js`（或在 segment-control.js 泛化），**直接复用** `changePanelSplitCount`/`syncPanelShapeInputs`/`selectedPanelSegment` 的算法，把 `panelSplits`→`strandSplits`、`panelWidthLoops`→（strand 无 widthLoops 上限，改用固定 max 或 radialSegments 约束）、`splitBonesFor`→`strandSplitBonesFor`。段间隙插入、order 分配、按边界 disable 全部照搬（`segment-control.js:119-139`）。
3. `strandSplitInputs`（`app.js:3323`）扩展为多 handle 绑定；视口 `strandSplitHandle` 单个 → 数组（仿 panel 多 handle），拖拽写回 `strandSplits[i].position/height`（改 `bone-interaction.js:310-331`）。
4. snap-to-loops：strand 用 `lengthSegments` 代替 `panelLengthLoops`，复用 `snapPanelSplitHeight` 思路（可能需 `snapStrandSplitHeight`）。

**复用度高**：panel 的 segment-control.js 逻辑几乎可参数化复用（数据字段名替换 + widthLoops 约束替换），这是本移植 UI 侧的最大杠杆。

## 8. 风险与子桥接 (child-bridge)

**更正**：child-bridge 读 split 父发片融合网格的代码在 `modules/geometry/branch-bridge.js`（不是 branch-connect.js）。两处消费点：

- **applyBranchRootRegionCarving**：`branch-bridge.js:766-784`。读 `splitFused=userData.splitFusedGrid`；若有 `faceToRendered`，按 `fusedCols=splitFused.cols` 遍历融合面，`rendered=faceToRendered[row*fusedCols+c]`，`rendered>=0` 才移除（`-1`=缝合面无渲染面，`:779-780`）。**这段是 section-count 无关的**——它只按 `fusedCols` 遍历并索引数组。
- **branchRootRegionSurface**：`:851-856`。`gridIndexAt = splitFused.fusedIndexAt ?? (r,c)=>r*cols+c`。同样 section-count 无关——只调用 `fusedIndexAt(r,c)`。

**结论：消费方（branch-bridge.js）本身对段数无假设**，它遍历 `fusedCols` 并索引 `faceToRendered`/调用 `fusedIndexAt`。真正的「2 段假设」在**生产方** `strand-geometry.js:356-366` 的 `colToSection` 构造：`section = point.x <= splitX ? 0 : 1`（`:359`）——**二值**、单一 `splitX`。

**N 段泛化 fused grid**（生产方）：
- `colToSection[c]` 的 section 由 polygon 点 x 落在哪个 boundary 区间决定：`section = boundaryXs.findIndex(区间包含 point.x)`（N+1 段），local col 在该段 ring 内匹配（现 `:361-364` 的匹配循环不变）。
- `faceToRendered`（`:373-386`）：`same = colToSection[c].section === colToSection[c2].section`——相邻列同段→映射，跨段→`-1`。逻辑对 N 段天然成立，无需改。
- `fusedIndexAt`（`:367-372`）读 `sectionBases[entry.section]`——N 段自动。
- `splitStartRow`（`:387`）单值→需 per-segment 或取 min（child-bridge 目前只用作单一起始行；若保持单值取所有 split 的最浅 splitStart）。

**风险清单**：
1. **splitStartRow 单值**：`:387,:418` 假设一个切口起始行。N 段有 N 个不同 height，child-bridge 若依赖它需改为数组或保守取 `min(所有 splitStart)`。中/低风险。
2. **fused 面的缝合列增多**：N 段 → N 条缝（faceToRendered=-1 列变多），carve 时被跳过的面变多，验证 carve 结果仍正确。
3. **UV 表回退连锁**：任一段 clip 后 ringSize<2 → `gridUvTable`/`unfoldHairMesh` 整表 return null（`uv-unfold.js:139,:376`）→ 子发片 UV 接线整体关闭（历史踩坑 `uv-unfold.md:64` #4 同类）。必须保证裁剪不产生退化段。
4. **child-bridge 锚点定位精度**：段多、每段窄时，`fusedIndexAt` 定位的父顶点密度变化，桥接锚点可能落在缝合列附近。

**建议门控（Phase F）**：初期把 child-bridge 门控到 `sections<=2`（即 `strandSplits.length<=1` 时才允许子发片桥接到 split 父），N>1 时 child-bridge 回退到非融合路径或禁用桥接并提示。待 N 段 fused grid + splitStartRow 数组化验证水密后再解除门控。判据放在 `branchRootRegionSurface`（检测 `splitFused.cols` 对应段数）与 `applyBranchRootRegionCarving`。

---

## 分阶段实施计划 (Phased Plan)

### Phase A — 数据模型 + 迁移
- **文件**：`app.js`（默认值/加载/保存/镜像/快照/normalize）、`modules/io/creation-presets.js`、`modules/data/clump-brush-presets.js`、`modules/geometry/draw-flow.js`、`modules/io/project-files.js`。
- **关键函数**：新增 `normalizeStrandSplits`/`cloneStrandSplits`（仿 `normalizePanelSplits` `app.js:1525`）；加载时 legacy→`strandSplits` 迁移。
- **验收**：旧 .ahs（含 `strandSplitPosition/Height/Gap`）加载后 `lock.strandSplits` 为单条且几何与旧版一致；保存往返无损；镜像/快照保留 N 条。
- **并行**：可先行且独立；是 B/C/D/E 的前置。**与所有后续 Phase 冲突文件仅 app.js**（读取点集中），建议单独完成合并。

### Phase B — 几何（N 段 clip + sweep + caps）
- **文件**：`modules/geometry/strand-geometry.js`。
- **关键函数**：`createSplitStrandGeometry`（`:83`）：`sections` 构造改数组驱动（`:98-102`）；新增 `clipStrandProfileBand`（复用 `clipStrandProfilePolygon` `:43`）；per-section direction + per-section height opening（`:200-205`）；`colToSection`/`fusedIndexAt`/`faceToRendered` N 段化（`:355-386`）；`gridColIndices` 已 forEach（`:427-437`，验证即可）。
- **验收**：N=2 时与现状逐面一致（回归）；N=3/4 生成 N+1 段，水密（0 NaN、cap 封口）、每段 ringSize>=3。
- **并行**：依赖 A 的 `strandSplits`。与 C 同文件 userData 输出区（`:401-439`）需协调，建议 B 先行。

### Phase C — UV 展开（N 管）
- **文件**：`modules/io/uv-unfold.js`（大概率**只需验证**）、`tests/uv-unfold.test.mjs`。
- **关键函数**：`gridUvTable` split 分支（`:130-166`）、`unfoldHairMesh` split 布局（`:364-387`）——均已 `for g<splitSections.length`。
- **验收**：N 管并排无重叠、每管独立弧长、每管 seam 副本、wrap 面保留；新增 N=3/4 回归用例（周长、偏移列无 -1、每管 seamEndU）。
- **并行**：依赖 B（geometry 产出 N 段 `splitSections`/`gridColIndices`）。改动极小。

### Phase D — 骨骼 + USDA
- **文件**：`modules/bones/bone-model.js`、`modules/io/usda-export.js`、`modules/io/project-files.js`、`modules/bones/bone-view-handles.js`。
- **关键函数**：`strandSplitBonesFor`/`FromData`（2→N+1，`bone-model.js:341-406`）；`strandSplitForkT`→per-segment；`splitBoneLayout`/`splitChainLayout` 发丝分支 per-segment height/direction（`usda-export.js:554-576,:627-657`）。
- **验收**：N 管各有 split bone；USDA 导出关节数=段数、fork 索引正确、镜像对称。
- **并行**：依赖 A、B。与 E 都碰 bone-view-handles.js，需协调。

### Phase E — UI
- **文件**：`index.html`、`app.js`（strandSplitInputs 等）、新建/泛化 `modules/bones/segment-control.js`、`modules/bones/bone-interaction.js`、`modules/bones/bone-view-handles.js`。
- **关键函数**：复用 `changePanelSplitCount`/`syncPanelShapeInputs`（`segment-control.js:108-152,:45-70`）参数化到 strand；多手柄拖拽写 `strandSplits[i]`（`bone-interaction.js:310-331`）。
- **验收**：+/- 增删拉链、段选择、per-segment spread、视口多手柄拖拽即时重建。
- **并行**：依赖 A、B、D。与 D 冲突文件 bone-view-handles.js/bone-interaction.js。

### Phase F — child-bridge 门控
- **文件**：`modules/geometry/branch-bridge.js`。
- **关键函数**：`branchRootRegionSurface`（`:851`）、`applyBranchRootRegionCarving`（`:760`）加 `sections<=2` 门控；后续解除时 `splitStartRow` 数组化。
- **验收**：N>1 split 父发片时子发片桥接安全回退（不产生破面/UV 关闭），N<=1 行为不变。
- **并行**：依赖 B。可最后做。

---

## 面板机制复用表 (Reuse from Panel)

| Panel 机制 | 位置 | Strand 适用性 |
|---|---|---|
| `normalizePanelSplits` 数据结构 `[{position,height,order}]` | `app.js:1525` | **直接复用**：新建 `normalizeStrandSplits`，clamp 范围换成 strand 的 [-0.8,0.8]/[0.02,0.8] |
| N boundaries → N+1 段 | `panel-tip-strand.js:732` | **直接复用**：`boundaries=[-1,...positions,1]` |
| 每段列分配（span 比例 + 最大余数） | `panel-tip-strand.js:981-993` | **概念复用**：strand 按 profile 弧长/段跨度分列（若需可变列）；strand 环拓扑无 widthLoops，约束换 radialSegments |
| per-split-height → 墙起始行 `findIndex(p>=1-height)` | `panel-tip-strand.js:1017-1018` | **复用思路**：strand 每段 opening 起始行由相邻 split height 决定 |
| snap-to-loops `snapPanelSplitHeight` | `app.js:1559` | **复用**：strand 用 lengthSegments 代 panelLengthLoops |
| colBase +1 边界预留（bug #8） | `panel-tip-strand.js:1014` | **注意**：strand 用管局部列+全局偏移（无 fused 重叠问题），已由 `gridColIndices:427-437` 保证唯一，无需 +1；但要确保各管列不撞 |
| weld key 含 gridRow/gridCol | `panel-tip-strand.js:83-86` | strand split 不走 weldPanelGeometryData（strand 用 computeVertexNormals），暂不需要 |
| per-segment split bone（`splitChainLayout` panel 分支） | `usda-export.js:613-626,:686-694` | **直接对齐**：strand 分支照抄 per-segment forkT/orient 逻辑 |
| segment-control.js（+/-、段选、spread） | `segment-control.js` 全文件 | **高杠杆复用**：参数化字段名 panelSplits→strandSplits |
| front/back 双壳 + 墙 quad | `panel-tip-strand.js:955-978` | **不适用**：strand 是闭合环 tube，用 clip 子多边形 + cap（topic 3） |
| `gridCols=(colBase+c)*2(+1)` 交错 | `panel-tip-strand.js:940,947` | **不适用**：strand 无双壳，用管局部偏移列 |
| tip WidthCurve/spreadGap sub-bone 变形 | `panel-tip-strand.js:824-857` | **部分**：strand 已有 tipChain 变形（`strand-geometry.js:270-312`），沿用 strand 自己的 |

---

## Phase A 必须更新的 strandSplit* 读取点清单 (grep 确认)

> grep `strandSplit`（全仓库 230 命中）中**读/写数据字段**、Phase A 迁移必须覆盖的点：

- `app.js:1458-1461` — strandCreationDefaults（strandSplitEnabled/Position/Height/Gap）
- `app.js:7558` — `useSymmetricArcDistribution=!strandSplitEnabled`
- `app.js:9071-9077` — applyLockData 加载（**迁移主入口**，含 strandSplitBones）
- `app.js:9296-9302` — 快照 mirror（strandSplitPosition 取负）
- `app.js:9466-9472` — partner mirror（取负）
- `app.js:9694-9700` — serialize 保存
- `app.js:10250-10256` — 快照恢复
- `app.js:11188-11206` — strandSplitProfileData / strandSplitControlPoint
- `app.js:13152-13156` — gap 输入同步
- `app.js:13219-13220` — splitStart / defaultSpread
- `app.js:13256-13263` — tip length 同步
- `modules/io/creation-presets.js:58-61` — preset 复制 4 字段
- `modules/io/creation-presets.js:186` — 字段白名单
- `modules/data/clump-brush-presets.js:31-34` — 4 字段列表
- `modules/geometry/draw-flow.js:462` — 白名单
- `modules/geometry/draw-flow.js:663-666` — 描边覆盖
- `modules/geometry/draw-flow.js:874-877` — 描边默认
- `modules/geometry/draw-flow.js:1047-1050` — setting 读取
- `modules/io/project-files.js:127` — `strandSplitEnabled → kind "split"`
- `modules/io/project-files.js:735-736` — bone 导出 forkT（`1-strandSplitHeight`）
- `modules/bones/bone-model.js:312-316` — defaultStrandSplitSpread（strandSplitGap）
- `modules/bones/bone-model.js:318-321` — strandSplitForkT（strandSplitHeight）
- `modules/bones/bone-model.js:341-364` — strandSplitBonesFor（**length===2 硬编码**）
- `modules/bones/bone-model.js:367-373` — materializeStrandSplitBones
- `modules/bones/bone-model.js:375-406` — to/fromData（**data.length!==2 硬编码**）
- `modules/bones/bone-view-handles.js:526-565` 及 `:571-608` — handle 可见性 / position/height 读取
- `modules/bones/bone-interaction.js:159-167,:243-261,:310-331` — 拖拽写 strandSplitPosition/Height
- `modules/io/usda-export.js:554-576` — splitBoneLayout 发丝分支（splitHeight/direction）
- `modules/io/usda-export.js:627-657` — splitChainLayout 发丝分支（forkT/direction/spread）
- `modules/io/usda-export.js:695-704` — joint orient 发丝分支
- `modules/geometry/strand-geometry.js:96,:127,:133-135` — 几何读取（splitPosition/Height/Gap/Bones）
