# 拆 UV 规则 / 实现理念 / 踩坑记录（0.2.69–0.2.79，分支 0.2.69-bugfix）

> 本文记录**导出时**给扫掠发丝生成矩形 UV 的完整规则与踩坑。入口见 README.md 索引；
> 版本时间线见 local-adaptation-log.md 0.2.69–0.2.79 条目，bug 编号见 bug-fixes.md。

## 1. 实现理念 / Goals

- **导出时展开，不影响视口渲染**：视口仍用原 UV（材质各向异性方向），展开只在 USDA/OBJ 导出时进行（`modules/io/uv-unfold.js` + `modules/io/project-files.js` 的 `buildUnfoldedMeshes`）。
- **V 负方向 = 切线方向**：根（row=0）→ V=1，尖（row=R−1）→ V=0。切线对齐 V 负方向，DCC 中头发**竖直向下打直**。
- **U 沿列、按弧长**：u(列) = 从切缝沿环向累计弧长 / 参考周长——每列按自己的实际宽度（row-0 环向欧氏边宽）调整，**不是等间距**（noise 纹理 U scale 统一，纹理密度与真实弧长成比例）。
- **闭合环用顶点复制切开，不丢面**：seam 列展开成 u=起点/u=终点两份（双副本），所有 quad（含 wrap quad）全部保留——管子沿切缝闭合、无 poly 缺失。
- **允许 UV 重叠，不做打包**：每根发丝独立展开；只有子发片可以与主发片重叠（落在其桥洞附近）。
- **主发片为尺度参考**：子发片 V 按主发片长度归一（v 区间长度 = 子长/主长），U 按拓扑对齐主发片桥洞（见 §6.4）。
- **驱动数据**：`geometry.userData.gridRowIndices / gridColIndices`（每顶点扫掠行/列，非扫掠顶点 −1）——由 0.2.69–0.2.70 写入各几何生成函数；USDA 同时导出 `AHS_gridRow`/`AHS_gridCol` primvars。

## 2. 普通发丝（closed）拆 UV 规则

- 切缝列 = **第一列**（seamCol=0，Houdini 式：以第一列切开生成扫掠 UV，不回头连）。
- 每行 C+1 个展开顶点：pos 0..C−1 = 列按环向从 seam 排列（u=弧长 colU），pos C = seam 列副本（u = seamEndU，默认 1）。
- wrap quad（列 C−1 → seam）保留：seam 端指向 u=seamEndU 副本，quad 宽度 = wrap 边弧长/周长。
- face 重映射的 seam 起/终点判定：face 中另一列 cx 的环向序 = 本列+1 → 起点（pos 0）；= 本列−1 → 终点（pos C）。
- 端盖中心（col=−1）为 passthrough（保留原 uv；quadFaces 不含端盖 fan，故不参与展开）。

## 3. split 发丝拆 UV 规则（0.2.75 / 0.2.77）

- **网格列 = 管局部列 + 全局偏移**：管 g 的 local col l（0..ringSize−1，local col 0 = clip seam 点）→ 全局 col = colBase_g + l。**无 −1 网格顶点**（弃用 colToSection.findIndex，见踩坑 #5）。
- **两管 U 轴排列不重叠**：管 g 的 u = (前管周长累计 accBase + 本管从 seam 起累计弧长) / 总周长（总周长 = 两管周长和，含各管 wrap 边）。管 1 排在管 0 右侧。
- 每管一个副本槽（pos C+g，u = seamEndU[g]），wrap quad 保留（管尾↔管首，seam 端指向副本槽）。
- AHS_gridCol 语义 = 管局部偏移列（非 fused 列）。

## 4. 开放网格（panel / surface / hair card / curve-surface card / compound）

- 无 seam 复制：u = col/(C−1)（等距），v = 1−row/(R−1)。
- panel/surface：col 为全局列（front/back 相邻），经 `weldPanelGeometryData` 重映射。
- compound：基础网格行主序编号；桥接插值顶点（col=−1）passthrough 保留原 uv。
- poly/braid（预置网格）：不展开（无 grid 数据）。

## 5. 子发片（child）拆 UV 规则

### 5.1 扫掠部分
- 切缝 = **背面**（不面向外的一侧）：环 bottom side（z=−hd，顶点 ringWidth+1..2·ringWidth+1）中点，`bridgeSeamCol = ringWidthSegments + 1 + round(ringWidthSegments/2)`。
- U 布局约定：**外侧顶部（背面相对面）poly 在中间、侧面在中间两侧、最两侧是后面（seam 双副本 0/seamEndU）**。
- **U 拓扑对齐缩放**（0.2.79，`childUTopologyScale`）：缩放参考 = **环顶面**（非侧面非底面，环顶点 0..W）弧长 ↔ **顶部桥接洞侧顶点**的 parent u 跨度；`uScale = 洞顶 u 跨度 / 环顶面弧长`，`uOffset` 使环顶点 0 对齐洞顶 uMin、环顶点 W 对齐洞顶 uMax——扫掠整体沿中心线自然延伸（约 1.1×洞宽），而非刚性倍率或严格贴洞左右边界。
- **V 对齐洞底**：扫掠顶（环）= 洞最底端（最靠 −V 侧，cross.down.u 最大）再往下留一个扫掠行高的空隙：`childVStart = 1 − down.u − rowHeight`。
- **扫掠起点下移**（0.2.78）：`childVSweepStart = childVStart − bottomBandSpan`（bottomBandSpan = 0.5×childVLength），给桥接 bottom band 留独占空间；V 向下按 `childVLength = 子扫掠弧长/主发片长` 延伸。

### 5.2 桥接部分
- 锚点（branch-bridge.js 每桥接顶点）：`{ ring, hole, t, band }`——ring=环局部顶点索引、hole=父发片顶点索引、t=0 环侧/1 洞侧、band ∈ top/bottom/side（8 处 pushBoundary 标记）。
- **上下竖缝**（仅此，横缝已取消）：环 seam 双副本 + 桥接底带中线（ring===seamCol 且 band=bottom）顶点链双副本（passthroughCopyCount=2）；中线 side1（终点侧）u_ring=seamEndU、side0（起点侧）u_ring=colU(seamCol)。side 判定：face 中另一环列 cx 的环向序 = rPos+1 → 起点 side0、= rPos−1 → 终点 side1。
- **top / side / bottom 统一向洞侧插值**（0.2.79）：u = lerp(u_ring, holeU, t)、v = lerp(childVStart, holeV, t)——洞底整圈（bottom band + side fill）洞侧 = parent uv，UV 连续（见踩坑 #8）。
- 洞侧 u = parent 弧长表（`gridUvAt`，同一尺度）；ring=−1 的纯洞侧顶点（sideHoleVertex）u=洞 u；洞侧查询失败兜底 u=0、v 按 parent 行。

## 6. 导出接线（project-files.js）

- `buildUnfoldedMeshes()` 两遍：第一遍每 lock 建弧长表（`gridUvTable`，供父发片洞查询）；第二遍每 lock 调 `unfoldHairMesh`（child 传 seamCol/childVStart/childVLength/childVSweepStart/uOffset/uScale/bridgeUvAt/passthroughCopyCount/passthroughSide），失败回退原几何。
- USDA/OBJ 统一走展开数据（positions/uvs/faces/normals/tangents/colors）；`AHS_gridRow/gridCol` primvar 随展开顶点复制；蒙皮权重 leafWeights（stride 3）随 seam 复制。
- `gridUvTable` 支持 `referenceCircumference`（旧）与 `uOffset/uScale`（新：u = uOffset + 弧长×uScale）两种归一；返回 `seamEndU`（closed/child 单值，split 数组）。

## 7. 踩坑记录（按时间，全部已修）

1. **切缝方向搞反（0.2.71 → 0.2.72）**：seam 误放环 top 侧中点（z=+hd，沿 child frame.z=父法线**向外**=正面）；背面 = 不面向外的一侧（z=−hd，bottom side）。纠正为 `ringWidthSegments+1+round(W/2)`。
2. **wrap quad 丢弃 → poly 缺失（0.2.73 → 0.2.76）**：单边切缝用「丢 wrap quad」实现，几何开口。改回**顶点复制式切开**（seam 双副本、quad 全保留）。
3. **桥接 UV 挤点（0.2.74）**：bridgeUvAt 对 ring=−1 纯洞侧顶点 `colU.get(−1)`=undefined → null → 退回原 uv (0.5,0)。修复：ring 无效时 ringU=洞 u。
4. **split 父表整体 null（0.2.75）**：0.2.70 的 gridColIndices 用 colToSection.findIndex 匹配 fused 列——profile x=0 点（splitX=0）被 clip 进两管却只归管 0 → 管 1 每行 2 个 −1 → split 弧长表整体失效 → 子发片桥接 UV 接线整个关闭（0.2.71/0.2.72 用等距 parametricGridUv 容错所以症状只在 0.2.73 起显现）。修复：管局部列 + 全局偏移，彻底弃 findIndex。
5. **十字横缝切乱（0.2.77 → 0.2.78 取消）**：seam±1 顶点链双副本的 side 判定错乱 + 侧面 UV 展到下面。横缝取消，仅保留上下竖缝。
6. **桥接底部意外 seam（0.2.79）**：bottom band「自然展开」（洞侧 u=环侧 u）与 side fill「对齐洞」（洞侧 u=parent u）在洞底角共享顶点处 UV 不连续 → 两道意外 seam、一块 poly 被切出去。修复：bottom band 改回与 top/side 相同插值，洞底整圈连续。
7. **刚性 1.1 倍缩放不对（0.2.79）**：刚性倍率不是用户本意——改为**拓扑对齐**（环顶面弧长 ↔ 洞顶 u 跨度，端点对齐），自然延伸约 1.1×洞宽。
8. **Number(null)===0 陷阱（0.2.77）**：`uScale` 默认 null 会被 `Number.isFinite` 判真——用 `uScale != null && Number.isFinite(...)` 守卫。
9. **U 布局正反面命名**：环 top side（z=+hd）= 面向外（正面/外侧顶部），bottom side（z=−hd）= 背面（不面向外）；切缝在背面，展开后「外侧顶部在中间、侧面在两侧、最两侧是后面」。

## 8. 待办 / 后续

- 桥接侧面 UV 排布进一步优化（顺切线方向自然桥接扫掠与孔洞，取消横缝后的实际效果待用户验证）。
- 桥接 UV 平滑操作（用户曾提「直接平滑 uv，不是几何体」）。
- 十字横缝（左右各 2 条边）按新理解重新设计（如需）。
- split 父发片的 AHS_gridCol 语义从 fused 列改为管局部偏移列（已在 devlog 记录，下游如需旧语义另议）。

## 9. 关键文件

| 文件 | 内容 |
|---|---|
| `modules/io/uv-unfold.js` | 纯函数展开核心：gridDimensions / gridUvTable / gridUvAt / childUTopologyScale / unfoldHairMesh |
| `modules/io/project-files.js` | 导出接线：kindForLock / childSeamCol / buildUnfoldedMeshes / buildHairObj / buildHairUsda |
| `modules/geometry/branch-bridge.js` | 桥接 UV 锚点（{ring,hole,t,band}）+ bridgeUvAnchors / bridgeSeamCol / bridgeBoundaryParentIndices |
| `modules/geometry/strand-geometry.js` | 各几何类型的 gridRowIndices/gridColIndices 写入（含 split 偏移列） |
| `modules/geometry/panel-tip-strand.js` | panel 模拟 row/col（经 weld 重映射） |
| `tests/uv-unfold.test.mjs` | 纯 node 回归（closed/split/open/compound/child/回退/childUTopologyScale） |
