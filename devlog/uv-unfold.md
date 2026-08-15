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
10. **panel 段边界列重叠 → 导出缝被填（0.2.80）**：panel 的 grid 列号 `(colBase+column)*2(+1)` 中 colBase 只累加各段列数、不为边界预留格子——段 k 最后一列与段 k+1 第一列共用同一 (row,col) 格子；zipper 开口以下两侧边界链是独立顶点（缝），unfold "open" 重映射按格子槽位把两个顶点坍缩到同一槽位 → 导出面被接到对侧、缝被填（点位置不变，USDA/OBJ 同样中招；0.2.70 之前 panel 无 grid primvar 走原始回退所以旧导出正常）。修复：colBase 累加改 `sum + count + 1`（每段边界预留 1 列，C=2×(Σcolumns+段数) 恰为每行顶点数，格子唯一）；`weldPanelGeometryData` 的 weld key 加入 gridRow/gridCol（fork 以上位置重合但格子不同的边界链顶点不再被焊掉，避免格子空洞）。回归：headless repro Phase 0 断言 dupCell=0 / 重映射 1:1 / 逐面边集一致（见 scripts/repro-0045-bugs.mjs）。

## 8. 待办 / 后续

- 桥接侧面 UV 排布进一步优化（顺切线方向自然桥接扫掠与孔洞，取消横缝后的实际效果待用户验证）。
- 桥接 UV 平滑操作（用户曾提「直接平滑 uv，不是几何体」）。
- 十字横缝（左右各 2 条边）按新理解重新设计（如需）。
- split 父发片的 AHS_gridCol 语义从 fused 列改为管局部偏移列（已在 devlog 记录，下游如需旧语义另议）。
- **panel 与普通发丝混排**（0.2.87 记录，**0.2.88 已用 alpaca 占位栅格尝试**）：原 MaxRects 按 sort（maxSide 优先）先排大宽扁 panel（底部横排）、再排高瘦普通发丝（左侧竖排），右上角留空；0.2.88 换成 alpaca 占位栅格（scanline/spiral 空位扫描）后 panel 与发丝混排、右上角已填上（23 岛 bbox u[0,1]×v[0.013,0.987]）。占位栅格分辨率 128 较粗（gap 10px 被量化到约 1 格），后续可提分辨率或加「非 AABB 形状/更优扫描序」进一步压实填充率。

## 9. 关键文件

| 文件 | 内容 |
|---|---|
| `modules/io/uv-unfold.js` | 纯函数展开核心：gridDimensions / gridUvTable / gridUvAt / childUTopologyScale / unfoldHairMesh |
| `modules/io/project-files.js` | 导出接线：kindForLock / childSeamCol / buildUnfoldedMeshes / buildHairObj / buildHairUsda |
| `modules/geometry/branch-bridge.js` | 桥接 UV 锚点（{ring,hole,t,band}）+ bridgeUvAnchors / bridgeSeamCol / bridgeBoundaryParentIndices |
| `modules/geometry/strand-geometry.js` | 各几何类型的 gridRowIndices/gridColIndices 写入（含 split 偏移列） |
| `modules/geometry/panel-tip-strand.js` | panel 模拟 row/col（经 weld 重映射） |
| `tests/uv-unfold.test.mjs` | 纯 node 回归（closed/split/open/compound/child/回退/childUTopologyScale） |

## 10. 导出后打包（0.2.82–0.2.84，modules/io/uv-pack.js + `primvars:uvisland`）

- `unfoldHairMesh` 仍输出每根发丝独立（或子发片对齐主发片）的矩形 UV；**导出最后一步**新增打包：把每个「主发片 + 其子发片 / panel 整片」family 按真实 3D 尺度统一缩放后 **MaxRects** 打包进 UDIM 1001（[0,1]²）——§1「允许重叠、不做打包」只在 unfold 层成立，导出层已打包。
- **统一纹素密度·面积归一**：每 family U 宽 = k×横向宽度、V 高 = k×曲线长（CatmullRom）——strand 的横向宽度=环周长（`gridUvTable.circumference`），panel/surface 的横向宽度按 `area / length` 推导（width 不传）；保持真实宽高比、UV 面积∝世界面积、纹理密度全局一致，**不再强制 U/V 归一到 0-1**。
- **自适应填充（0.2.83–0.2.84）**：k 在 `PACK_FILL=0.8` 上限（`kMax=sqrt(fill/totalArea)`）内找「所有 bbox 放得下」的最大值，再「真实打包验证 + overflow 缩小重试」（贪心对 k 非单调，lo 邻域有「拟合岛/失败带」交错）——保证最终**无兜底、无重叠**、尽量铺满 UDIM 1001；返回 `fillUsed = k²·totalArea`（≤ fill）。0.2.84 起纯二分改**128 点稠密采样 + 邻区间二分局部细化**（非单调下更接近真最大值，下限提升 +6.5%）。
- **布局（MaxRects，0.2.83 起；启发式 0.2.84 换 CP）**：规范 MaxRects（Jukka Jylänki MaxRectsBinPack，不旋转、SplitFreeNode SAT 交叠早退 + PruneFreeList），启发式 **Contact Point Rule (CP)**（接触越多越好，BSSF 注释屏蔽保留），按 family 缩放后 UV bbox（子发片可略外露，直接包进 bbox）打包，间隙 `PACK_GAP = 10/4096`（0.2.84 起 5→10px）；**不旋转、只位移**，bbox 为最小单位整体平移、不动内部 UV 结构。panel 整片 = 一个原子 bbox。
- **`primvars:uvisland`**：每个 bbox（family）一个稳定岛编号 0..N-1（有效 family 密集编号、sort 前固定），USDA 以 `int[] primvars:uvisland` + `interpolation="uniform"`（每面一个值）输出，DCC 按 `@uvisland==k` 选岛；OBJ 无 primvar 机制不输出。
- **范围**：closed/split 主发片 + 其子发片（child）+ panel/surface（刘海）；hairCard / curve-surface 等其它 open/compound 本轮不纳入打包。**0.2.84**：panel/surface 改用**原始几何 uv**（`flatPanelMesh` 直接拷贝 position/uv/quadFaces，不再走 unfoldHairMesh 的 open 展开 → 中间不再被切开），bbox/缩放/layout 后处理保留。**0.2.85**：panel 发尖 uv **平直**——`createPanelStrandGeometry` 的 uv 用 `boundaries` 平直 u（不含 `tipWidthSpreadGap` 收窄，只切缝不位移），几何位置仍含收窄（只改 uv 不改几何）。
- **Smart 多策略择优（0.2.85）**：`maxRectsPack` 参数化 `heuristic`（contactPoint/bssf）× `sort`（maxSide/area/height/width）；`packFamilies` 对 6 套策略各自适应找最大 k，取 `fillUsed` 最高者（随机压力均值 0.8525→0.8769，area/width 排序填平右上角）。
- **fit-to-tile 整包填满（0.2.87）**：`packFamilies` 在 MaxRects 紧排（gap=PACK_GAP）后做**整包均匀缩放 + 居中**（绕整包 bbox 中心等比缩放 `s=min(1/spanU,1/spanV)` 再平移到 tile 中心 0.5）——较长轴填满 [0,1]、较短轴居中；不新增岛间 gap、不改岛间相对布局（相似变换）。替代 0.2.86 的「增 gap 散布」（缝隙太大已回退）。**等比拉伸**：s 为单值均匀缩放（保持长宽比），**不强行非等比 normalize**——较长轴填满 [0,1]，较短轴按原宽高比留边（非撑满）。
- **alpaca 占位栅格打包（0.2.88，方案 2 实验）**：`packFamilies` 的最后 UV 排列从 MaxRects 换成**占位栅格打包**（思路复刻 Blender alpaca，非 GPL 源码）——`alpacaPack`（`ALPACA_RESOLUTION=128` 栅格 + 积分图 O(1) 空位判断 + scanline/spiral 空位扫描）+ `findMaxKAlpaca`（128 采样 + 24 细化二分找最大无兜底 k = scale_to_fit），Smart 择优改 4 套「排序(maxSide/area)×扫描(scanline/spiral)」；原 MaxRects 三块（Smart 择优 + maxRectsPack + 平移）**注释保留不删**，可随时切回；fit-to-tile 居中保留。效果：panel 与普通发丝混排、右上角不再空（见 §8 待办）。**0.2.89**：新增 `scan:"column"`（列主序，先填 V）+ Smart 择优改「按更方选」（6 套 sort×scan，各算整包 bbox 取 `min(spanU,spanV)/max(...)` 最大者，加 `k≥0.9×kMax` 过滤防 spiral 低填充胜出）——fit 后 V 从 ~0.6 填到 ~0.99（spanV 0.9878、fillUsed 0.8）。**0.2.90**：读 Blender 源码确认 alpaca=L-packer，改为 `alpacaPackTurbo`（L 形 zigzag：顶边水平条带 + 右边竖直条带，`zigzag = nextU1 < nextV1` 切换方向维持方形 bbox）——整包 bbox 双侧均衡（U/V 都接近 1），代价是 L 形缺口使 fillUsed 降到 ~0.5。**0.2.91**：改 `alpacaPackOccupancy`（占位栅格 + scanLine 方形边界 + 两阶段 L 形扫描填缺口）——「方形 + 高填充」兼得（fillUsed 0.50→0.76、方形度 0.91→0.99）。
- **关键函数**：`packFamilies(families, {gap, fill})`（uv-pack.js，纯函数零依赖，返回 `{k, totalArea, fillUsed, packed:[{id,island,x,y,width,height}], gap}`）；当前打包器 `alpacaPackOccupancy` + `findMaxKAlpaca`；注释保留的旧实现 `maxRectsPack`/`findMaxK`/`alpacaPackTurbo`/`alpacaPack`；接线 project-files.js `packUnfoldedUv`；`tests/uv-pack.test.mjs` 纯 node 回归（含确定性压力回归 + fit-to-tile + 方形断言）。

## 11. 最终 UV 布局实现（0.2.91）+ 参考文献

### 11.1 最终算法（alpaca 占位栅格 L 形扫描）

- `alpacaPackOccupancy`（uv-pack.js）：把 UDIM 1001（[0,1]²）栅格化（`resolution=256` 格/单位 UV），用**积分图 O(1) 判空**；`scanLine` 逐岛增长代表「方形边界」（bbox = scanLine×scanLine），两阶段放置：
  - **阶段 1**（填内部空隙）：L 形扫描——先沿顶边水平（y=sl-ch、x 0→sl-cw）、再沿右边竖直（x=sl-cw、y 0→sl-ch），扫 `[minSL, scanLine]` 全部候选，`need ≤ scanLine` 即不增长边界；
  - **阶段 2**（外扩）：无内部空位才 `scanLine` 逐格增长，第一个可行位置放置。
- `findMaxKAlpaca`：128 稠密采样 + 24 细化二分，找「整包 bbox 装进 [0,1]²」的最大**等比**缩放 k（= scale_to_fit）。
- `fit-to-tile`：打包后整包相似变换（等比缩放 s=min(1/spanU,1/spanV) + 平移到 0.5 居中），较长轴填满 [0,1]、较短轴按原宽高比留边。
- **参数/常量**：`PACK_GAP=10/4096`（岛间间距，10px@4096）、`PACK_FILL=0.8`（填充率上限）、`resolution=256`（栅格分辨率：越大越紧越慢，测试耗时随 R² 增长）、`sort`（默认 maxSide；可选 area/height/width）。
- **特性**：panel 与普通发丝混排；整包 bbox 近似方形（U/V 双侧≈填满，方形度 0.99）；fillUsed 0.76~0.81；等比拉伸不 normalize；禁止旋转；无重叠无兜底；确定性的（无随机 seed）。

### 11.2 参考文献

- **Nöll, T., Stricker, D. (2011). "Efficient Packing of Arbitrary Shaped Charts for Automatic Texture Atlas Generation." Eurographics (Computer Graphics Forum).** —— 「栅格化岛 + 扫描空位 + 缩放」的原始出处；Houdini UV Layout SOP / Blender / xatlas 的算法源头。
- **TABI (2026). "Tight and Balanced Interactive Atlas Packing."** —— 「紧 + 方形均衡」目标（即本实现追求的方形 bbox + 高填充）。
- **Jukka Jylänki. "A Thousand Ways to Pack the Bin — A Practical Approach to Two-Dimensional Rectangle Bin Packing."** —— MaxRects（当前注释保留的旧打包器）。
- **Blender 源码 `source/blender/geometry/intern/uv_pack.cc`（`GEO_uv_pack.hh`）** —— `pack_islands_alpaca_turbo`（L-packer）、`find_best_fit_for_island` / `pack_island_xatlas`（占位 L 形扫描）的实现参考。
- **jpcy/xatlas（https://github.com/jpcy/xatlas）** —— UV atlas 库（chart 打包）。
