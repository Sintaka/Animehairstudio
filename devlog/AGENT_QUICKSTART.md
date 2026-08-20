# 新 Agent 快速入口 / AGENT QUICKSTART

> 目的：让一个新 agent（或新开发者）在几分钟内知道「本 fork 改了哪些代码、哪些**必须保留**、当时的**决策**是什么」，避免从头通读 ≈0.9MB（**约 2 万行；具体值现场统计,勿引用本页数字**）的 `app.js` 或 52KB 的 `js-change-annotations.md`（索引 + 6 个 `annotations-*.md` 专题）。
> 维护：功能分支合入 / daily build +1 时，如涉及本页列出的保留代码或决策，请同步更新本页；详细条目仍按主题追加到各专题文件，本页只做摘要与指针。
> 版本基准：0.2.129（DHS/develop）。**行数/文件数/store 数一律现场统计**（`node scripts/gen-function-index.js` 会顺带刷新 app.js 行数与文件数），本页历史上写死过 3 组过期计数。

## 0. 先读什么（建议顺序）

1. **本页** —— 保留代码 + 决策总览（读完约 2 分钟）
2. `devlog/README.md` —— devlog 索引字典（各专题文件入口）
3. `devlog/development-standards.md` —— 开发规范 + 「持续修改功能」清单（main 更新后要优先同步的本地功能）+ 许可证
4. `devlog/main-sync-conflicts.md` —— 与 main 合并的全部决策（Local 选项移除、桥接区与 compound 并存策略、17 处冲突分类）
5. 按需跳读：`devlog/APPJS_SPLIT_GUIDE.md`（**从原版拆分指引**：历程/当前架构/拆分模式/每批执行模板/踩坑/定位字典，新 agent 必读）、`devlog/js-change-annotations.md`（子系统索引表 + 指向 6 个 `annotations-*.md` 专题文件）、`devlog/FUNCTION_INDEX.md`（机器生成，0.2.126 重新生成：2,293 函数 / 105 文件；**过期就跑 `node scripts/gen-function-index.js`**，勿手改）、`devlog/STATE_MANAGEMENT.md`（**状态管理架构：18 个 store 清单 + 发尖选中键 §2.1 + 替换验证 9 点**）、`devlog/bug-fixes.md`、`devlog/local-adaptation-log.md`（版本时间线）、`devlog/in-progress/wind-preview-plan.md`（**吹风预览已实施；仅碰撞路线图未实施**）、`devlog/in-progress/uv-pack-parallel-plan.md`（UV 打包并行，0.2.110 已实施，Phase 2 未做）

## 1. 仓库结构速览

- `app.js`（≈0.9MB，编排层；行数现场统计）—— 主逻辑；子发片系统的桥接 / 挖洞 / Region 面板 / 根骨骼 gizmo 等业务逻辑已按子系统迁入 modules（见 `APPJS_SPLIT_GUIDE.md` §2）。**原版 main 是 39,207 行的扁平大文件，本地已拆分（约 −47%），不要在 app.js 里堆业务逻辑，新逻辑进 modules/<domain>/ 后经 createXxxApi 注入**。
- `modules/*.js` —— 按域分目录（core/data/geometry/io/edit/sculpt/material/branch/scalp/bones/scene，0.2.129 实测 104 个文件、42,120 行，app.js 计入则 105；**这两个数字每轮都在变,引用前请现场统计**）；**全局状态已收敛到 18 个 store，全局 let 只剩 camera**（main 0.1.5 移植新增 multiCameraState/recovery，0.2.112 新增 windState，见 `devlog/STATE_MANAGEMENT.md`），不要再新增 app.js 全局 let。
- `index.html` / `styles.css` —— UI（顶部菜单栏含 Preview 菜单 `#previewMenu`，Turntable 等预览开关在此；缓存号 `?v=` 定点刷新，**不要全局替换**，见 §5 坑）。
- `server.js` —— main 带来的静态文件服务；`/api/save-project` 已是**死代码**（三个 Local 选项已移除，勿再调用）。
- `devlog/` —— 全部开发记录（本页所在）。

## 2. 必须保留的本地代码（Keep list）

> 相对 main 的持续修改/新增。**main 更新后优先同步这些，不要被 main 覆盖**；main 已原生支持的标 `deprecated`。清单与状态见 `development-standards.md`「持续修改功能」，判定依据见 `main-sync-conflicts.md`。

### 2.1 子发片拓扑衔接系统（本 fork 最大特性，main 完全没有）
- **入口分流**：`createHairGeometry` → `if (lock.branchRootRegion && parentSupportsTopologyConnect) createBranchChildGeometry`，否则 `createBaseHairGeometry`（退回直接扫掠）。
- **父发片挖洞**：`applyBranchRootRegionCarving`（程序化删面 + **同步裁剪 `triangleEdgeMasks`**）。
- **桥接几何**：`buildBranchBridgeGeometry`（≈751 行）+ `modules/geometry/branch-connect.js`（`squareChildRing` / `holeBoundary` / `connectSide` / `connectBoundaryToRing`）。
- **Region 选区**：`branchRootRegion`（u/v 数据模型）、`normalizeBranchRootRegion` / `syncBranchRootRegionOffsets` / `updateBranchRootRegionCenter` / `branchRootRegionSurface` / `branchRootRegionFromParam`（旧档回填）、`branchRegionNavAction`（面板导航）。
- **根骨骼工作流**：`captureBranchLocalState`（记住横向偏移）、H 模式刚性移动 + 曲率摆动、gizmo 携带 twist、sweep 起始黄色手柄。
- **Region 同步速度**：Sync L/R（默认 0.45）/ Sync U/D（默认 1.0）滑杆。

### 2.2 split（Split Geometry）父发片兼容
- **0.2.49**：父无 `gridRows`/`quadFaces` → 子发片退回直接生成（`parentSupportsTopologyConnect` 守卫），父发片不挖洞。
- **0.2.50–0.2.51**：索引侧拼接 `splitFusedGrid`（`geometry.userData.splitFusedGrid`，`gridIndexAt`/`faceToRendered`），**保留两管渲染**；非跨缝桥接干净、跨缝「暴力粘」（顶部带少量重叠边，可接受）。
- **0.2.54**：挖洞后同步裁剪 masks（与 2.1 同一类坑）。

### 2.3 刘海 / 面板线框三角面修复（显示层，导出数据一直是四边面）
- `createSplitStrandGeometry` 生成 authored `triangleEdgeMasks`；`createHairTopologyGeometry` 优先读 authoredEdgeMasks。
- `createPanelStrandGeometry` **绕序翻转后必须同步交换 masks [1]/[2]**（0.2.56 真正根因）。
- `addQuad` 跳过退化（角点重合）/反射折叠（两三角法线点积 < -0.999）quad（0.2.55）——**保留**（防 NaN/翻折）。

### 2.4b 发尖子系统：panel 与普通发丝共用（0.2.123 共享网格 / 0.2.125 WidthCurve / 0.2.126 选中系统）
- **共享层** `modules/geometry/tip-width-curve.js`（0.2.125 新增，纯函数）：控制网格、按侧暴露判据、build/reset/write 的曲线数学。**签名以「相邻 zipper 高度 / fork 标量」为入参，不接受 `(lock, segmentIndex, splits)`** —— panel 的 `panelSplits` 与发丝的 `strandSplits` 字段名不同但条目形状与邻居规则相同，参数化掉 lock 才能真正共用一份。改这里要同时看 panel 与发丝两侧的适配器。
- **panel 侧** `panel-tip-strand.js`：ribbon 专属部分（`tipWidthEdgePosition`/`tipPanelWidthAt`/`tipWidthControlPlacement`/`tipWidthSpreadGap`）留在此处，曲线数学改为薄适配器委托共享层。0.2.125 抽取经 36 用例逐字节等价验证。
- **发丝侧** `modules/geometry/strand-tip-width.js`（0.2.125 新增）：**管内相对坐标 `strandTubeSignedCoordinate` 是本模块的核心，也是唯一定义点**。⚠️ **不要用 raw `profile.x` 判定管的左右侧**：`clipStrandProfileBand` 裁剪后每根管的 raw x 只有一个符号（边缘管全负/全正），用它当判据会让一侧曲线永不生效——这正是 panel 在 0.2.80 修掉的死区。
- **选中系统共享层** `modules/bones/tip-sub-bone-host.js`（0.2.126 新增）：`resolveTipHost(lock, {materialize})` 一次分派出该几何的发尖链 / splits / 骨骼 / fork / 帧，替代此前「`clonePanelSplits` + `materializeSplitBones` + `splitTipForSegment`」的 panel 专用三连。状态键 `panelTipSelection`/`panelTipHover` 已改名为几何无关的 **`tipSelection`/`tipHover`**（单键，见 STATE_MANAGEMENT.md §2.1）。
- **几何门控一律用 `segmentBoneHost(lock) === STRAND_SEGMENT_HOST`，不要写 `!isPanelGeometry`**（0.2.126 定论）：后者会把「既非 panel 也非 split 发丝」的几何一并卷入。`segmentBoneHost` 对未开启 split 的发丝返回 null。
- **`clonePanelSplits` 红线**：发丝路径**绝不**调它——会造出与真实 zipper 无关的假 `panelSplits`，段数/fork 全错（0.2.126 之前已踩过两次）。
- **单点定义速查**（禁止就地重写这些表达式）：fork `strandSplitForkTForSegment`(bone-model) / `strandTubeForkT`(strand-tip-width) / `tipWidthSideForkFromHeights`(tip-width-curve)；**Tip Clump 收窄比例 `tipClumpNarrowFraction`**(tip-width-curve，panel 与发丝共用)；**管中心 `strandSplitTubeCenter`**(bone-model)；管内相对坐标 `strandTubeSignedCoordinate`；按侧暴露 `tipWidthSideExposesTAt`；首个暴露链索引 `firstExposedTipChainIndex`(tip-sub-bone)；段数/索引钳位 `resolveSegmentSelection`；链长 `tipChainPointCount`。**残余重复站点与处置建议见 `in-progress/tip-subsystem-reuse-audit.md`。**
- **Tip Clump（0.2.132）**：字段是 **`bone.tipClump`**（不是 `spread` —— 那是 main 的**发丝聚簇**参数，同名不同物；读取回退只在 normalize 层做一次）。语义 = 发尖相对**自身宽度**的整体收窄，panel 与发丝**同义**。「整管横向平移分离」（segment separate / 全局 Split Spacing 滑杆）**已删除**，分离靠拉 zipper。术语对照见 `APPJS_SPLIT_GUIDE.md §7.2b`。
- **UV 红线**：发尖宽度只准缩放 `t > fork` 的顶点。**row 0 顶点位置不得改变**（`uv-unfold` 的 U 完全由 row 0 环向弧长决定，V 纯行号）。因此曲率收窄预趟**刻意不传** width override **与 Tip Clump 收窄**（其 factors 全行共享且经 falloff 会把位移传到 row 0），`strandProfileTopologyAt` 的 `centerAsymmetricProfile` 重居中分支在 override 生效时也**刻意跳过**（重居中 = 整管平移，宽度只能缩放）。这几处不对称是**有意的，勿"顺手统一"**。
- **发尖处的 taper 通常是 0**（`DEFAULT_TAPER_CURVE` 末点 `value: 0`，真实工程亦然）：任何「取 t = 1 处几何量」的把手/放置逻辑都会在那里退化成一个点。手柄跨度基准必须与 taper 无关（见 `strandTipClumpAxis` 的标称管宽，与 bug-fixes.md #25）。**测试 fixture 至少要有一个 taper 收到 0 的构型**，否则这类退化在 node 侧永远绿。

### 2.5 Panel Split 子骨骼 / 统一骨骼模型（0.2.59 起）
- `lock.splitBones`：每 split 段一个完整变换骨骼（P/orient 四元数/spread + 每段 Width/Depth 曲线）；**混合持久化**——旧档无字段时内存派生、编辑后整体落盘；镜像段序反转 mirrorSplitBones。
- `modules/bones/bone-model.js`：`bonesFor(lock)` 统一骨骼视图（main/split/child 命名空间，主骨骼有子骨骼才架空）；`splitBonesFor`/`materializeSplitBones`。
- `createPanelStrandGeometry`：段内局部 u' + 每段曲线 + **相对缩放**（恒 uStart≤uEnd 根除 crossover），删除 trim/gap 位移；**zipper 水密拓扑保留**（墙 quad/端盖/snap-to-loops/退化跳过/焊接/法线平滑）。
- 子发片扫掠统一：`modules/geometry/strand-sweep.js`（`sweepSide`），`createBranchChildGeometry` = 默认扫掠 + 桥接 + 根部移动优化。
- **0.2.60**：发尖（segment）宽度/深度曲线编辑统一到普通曲线 UI——右侧面板 Width/Depth Curve 预设 select + 右上角小铅笔（替代 Edit Segment Width Curve/Depth Curve 大按钮），预设作用于当前段 split bone；浮动面板随子发尖切换热刷新；浮动面板非对称显示跟随两侧曲线实际差异（默认对称、Ctrl 视口拖拽=非对称）；Reset 保持 fork 连续（zipper 端点不裂）。


### 2.6 Sweep 转角收窄 + 边缘平滑（0.2.66）

- 转角过大时 sweep 自相交（穿插）：`curve-math.js` `sweepCurvatureResponse`（局部曲率半径 ρ = 相邻三点外接圆半径，factor = max(minScale, 1−(1−min(1, safety·ρ/r))·strength)，Elber 1997 / Maekawa 1999）；接入 `strand-sweep.js` `sweepSide` + `createSplitStrandGeometry` + `createHairCardGeometry`，脊柱不动、仅剖面按曲率收窄。
- 转角不平滑：`smoothSweepChains`（纵向链 Laplacian，heat 加权、根环 pinned）；桥接内联平滑抽到 `mesh-smooth.js` `smoothMeshVertices`（通用网格 Laplacian）。
- UI：`#sweepOverlapPanel`（Strength / Threshold / Edge Smooth 三个滑块，strands 组），per-lock 字段随 .ahs 持久化，默认参数 `SWEEP_OVERLAP_DEFAULTS`（strand-sweep.js 导出，单源）；全部关到 0 时输出逐位守恒。
- 0.2.67：急弯过渡扩散——`sweepCurvatureResponse` 新增 `falloff`（默认 3），收窄系数沿脊柱传播（`#sweepOverlapPanel` 第 4 个滑块 Sweep Overlap Falloff 0–8），消除被处理边附近未收缩环的突兀/缺口。
- 0.2.68：`smoothSweepFrames` 切线后处理平滑（按曲率热度，`#sweepOverlapPanel` 第 5 个滑块 Sweep Tangent Smooth，默认 0.3）；5 个平滑参数（Strength/Threshold/EdgeSmooth/Falloff/TangentSmooth）已接入镜像系统（createMirrorPartner + syncMirrorPartnerFromLock + 滑块 syncActiveMirror），左右对称对象自动同步。

### 2.7 导出拆 UV（0.2.69–0.2.79 规则；**0.2.110 打包多线程化**）
- `modules/io/uv-unfold.js`：导出时按 `geometry.userData.gridRowIndices/gridColIndices` 生成矩形 UV 的纯函数核心——`gridDimensions` / `gridUvTable`（弧长表：row-0 环向边宽累计 u + referenceCircumference/uOffset·uScale 两种归一 + seamEndU）/ `gridUvAt` / `childUTopologyScale`（子发片 U 拓扑对齐缩放：环顶面弧长↔洞顶 u 跨度）/ `unfoldHairMesh`（closed/split/open/compound/child 五类展开，seam 双副本不丢面、passthrough 多副本、leafWeights 复制）。
- `modules/io/uv-pack.js`（0.2.82 起；**0.2.110 两段式重构**）：`packFamilies` 纯函数 + 新增 `preparePack`/`sampleMaxK`/`refineMaxK`/`applyPackResult` 导出（并行择优拆开）；`alpacaPackOccupancy` 内部**行区间表**（替代栅格+积分图，逐格等价，同步 2.5×）；`PACK_GAP=10/4096`、不旋转只位移、`uvisland` 岛编号；旧实现 `maxRectsPack`/`alpacaPackTurbo`/`alpacaPack` 注释保留可切回。算法细节与参考文献见 `uv-unfold.md` §10–§11。
- **`modules/io/uv-pack-async.js` + `uv-pack-worker.js`（0.2.110 新增，导出/UV checker 默认走这里）**：`packFamiliesAsync` Worker 池并行（8 seed×8 块 sample + 8 refine 任务，与同步**逐位一致**，Float64Array 传 boxes，无 Worker 自动回退同步）；`buildUnfoldedMeshes`/`buildHairObj`/`buildHairUsda`/`packUnfoldedUv` **全部 async**（调用点必须 await）；真实工程实测 4.0s→约 456ms（≈9×）。验证工具：`scripts/verify-uv-pack-real.mjs`（headless Chrome + CDP 端到端）、`check-uv-bitidentity.mjs`、`diff-occupancy.mjs`。
- `modules/io/project-files.js`：`kindForLock` / `childSeamCol` / `buildUnfoldedMeshes`（两遍：父表 + 展开；child 传 seamCol/childVStart/childVLength/childVSweepStart/uOffset/uScale/bridgeUvAt/passthroughCopyCount/passthroughSide；末尾 `packUnfoldedUv` 打包）；buildHairObj/buildHairUsda 走展开数据；USDA 输出 `primvars:uvisland`（usda-export.js）。
- `modules/geometry/branch-bridge.js`：桥接 UV 锚点（每桥接顶点 `{ring,hole,t,band}`，8 处 pushBoundary）+ `userData.bridgeUvAnchors/bridgeSeamCol/bridgeBoundaryParentIndices`。
- `modules/geometry/strand-geometry.js`：各几何类型 gridRow/gridCol 写入（split 用**管局部列+全局偏移**、无 −1；弃 colToSection.findIndex）。
- `modules/geometry/panel-tip-strand.js`：panel 模拟 row/col（gridRowsArr/gridColsArr 经 weldPanelGeometryData 重映射）。
- 规则/理念/踩坑全集：`devlog/uv-unfold.md`（**必读**，9 条踩坑含「wrap quad 丢弃→poly 缺失」「split x=0 共享点→父表 null」「bottom 自然展开与 side fill 冲突→意外 seam」）。

### 2.4 日常本地适配
- ZH 语言、Houdini 导航、自定义雕刻笔刷（Slide/Scale·Cut-Extend/Push/Orient + Smooth twist）、S+左键调笔刷大小、Quick Save/Save as/Quick Export（File System Access API 直写盘）、浮动面板跟随、材质删除、Ctrl+Z 修复、`start-dev-server.cmd`。
- `deprecated`：拖放统一分发、雕刻笔刷选择遮罩（main 0.1.4 已内置，本地实现已删除）。

## 3. 关键决策（Decisions & Why）

| 决策 | 内容 | 为什么 | 详见 |
|---|---|---|---|
| 桥接坐标方向 | 底部按位；侧面/顶部按**世界侧**（网格 left/right 在世界相反）；顶部 2src↔2dst + 中间分段 + smoothstep | 2.4l/2.4r 两次方向反了的教训 | annotations-bridge.md（2.4l / 2.4r） |
| 折痕接缝 | 区域列是**虚拟列**，需从父 `quadFaces` 推导 skipCol 映射到真实网格列 | linear 控制点让某列重合、无面起始 | annotations-bridge.md（2.4o / 2.4q） |
| 直接 vs 间接桥接 | 直接：直接封闭、无需侧面填充；间接：侧面填充从直接桥接向洞顶/底 1:1 填 quad 条带 | 避免三角面；顶/底分开处理互不干扰 | 2.4t / 2.4u、0.2.43–0.2.44 |
| split 父退回直接生成 | 父无拓扑衔接能力时子发片从根部扫掠 | 避免无效挖洞 | 0.2.49 |
| main 合并策略 | 桥接区**保留本地** + 按需吸收 main 预设；`createHairGeometry` 按 branchRootRegion 分流；材质双面条件合并 | 两套代码同插入点但无功能重叠（约 1000 行大冲突=误读） | main-sync-conflicts.md |
| Local 选项移除 | 三个 Local dev 选项删除，统一快速保存/导出 | 功能等价且本地方案更优 | main-sync-conflicts.md |
| 版本号 | `0.1.5-Sintaka.0.2.<dailybuild>`；主版本与上游对齐 | 避免与上游版本误判 | development-standards.md |

## 4. 工作方式（省 token 且合规）

- **分支**：统一开发分支 `DHS/develop`（日常开发/修复直接提交）；大更改开临时 `feat/<描述>` 分支，merge 回 `DHS/develop` 后**立即删除**；发布时 `DHS/develop` merge 进 `branch-deployment`；禁止直接 merge main（上游镜像，更新按功能移植）；合并/冲突处理由主进程负责。
- **查代码**：先用 `Select-String` / `git grep` 按函数名定点搜（第 2 节已列关键函数名），**不要整文件读**。
- **记 devlog**：每 commit 一句话 + 指向详细文件；新条目追加到对应专题文件，不重复全文。
- **验证**：`node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs`（当前基线 9/11：export 对话框标题 + branch-bridge 数据依赖为已知环境差异）；`node --test tests/*.test.mjs`（dom-contract 0.2.111 起应全绿；其余测试以输出为准）。⚠️ **`uv-pack-async` 是负载相关 flake**：Worker 池单条最慢约 14s、该文件约 35s，并行跑多个子智能体时可能超时报出**恰好 1 条** `fail`，单独跑与降载重跑都绿——见到这种形态**先重跑**再怀疑代码（0.2.125 实测复现过一次）；真实工程 UV 打包端到端用 `node scripts/verify-uv-pack-real.mjs`（headless Chrome + CDP，加载 `D:/Downloads/Sussurro_v1_0046.ahs`，7/7 基线）；或静态服务器 `127.0.0.1:8080` + `D:/Downloads/Sussurro_v1_004*.ahs`（当前常用 0046）；不要用 `file://` 打开。
- **版本/缓存号**：改 `modules/core/app-config.js` 的 `APP_VERSION` 与 `index.html` 缓存号 `?v=YYYYMMDD-N`，与 devlog「最近版本」保持一致。

## 5. 常见坑（吸取过的教训）

- 桥接 masks 与三角形绕序必须**同步交换**，否则线框画 quad 对角线（0.2.54 / 0.2.56 两次踩坑）。
- 拆 UV 的坑（详见 uv-unfold.md §7）：闭合环切开**必须用顶点复制（seam 双副本）而非丢 wrap quad**（丢面=USDA poly 缺失）；split 网格列不要用 colToSection.findIndex（x=0 共享点会产出多余 −1 → 父表整体 null → 桥接 UV 接线全关）；桥接底部不要用「自然展开」与 side fill 混用洞侧 UV（洞底角冲突 → 意外 seam）；子发片 U 缩放用**拓扑对齐**（环顶面弧长↔洞顶 u 跨度）而非刚性倍率。
- 不要直接把 main 的多发丝预设（马尾/复合发丝）当子发片：索引与段数对不上会出错误拓扑；子发片目前只走单发丝默认预设。
- 根骨骼 gizmo 热更新只作**起始基准**，用户手调 diff 必须保留（offset 记忆），否则 W 重进 / H 开关会跳变。
- 删除子发片要**重算挖洞**（程序化流程 + 文件保存数据都要处理）；直接桥接要跟随 region 中心（rootRow=round((rowMin+rowMax)/2)）。
- 浮动面板 / 3D 选区标记对 null surface（split 父回退时）必须安全。
- **UV 打包 Worker 坑（0.2.110）**：worker 传 boxes 必须用 **Float64Array**——Float32 相对误差 ~6e-8 会让占位栅格 `ceil((w·k+gap)/cell)` 在边界翻转 fitsAt 布尔值 → 采样 k 整步跳变，破坏「异步与同步逐位一致」；node 测试注入 worker_threads 必须传 **URL 对象**（`file://` 字符串抛 ERR_WORKER_PATH，会静默走回退路径让测试假绿，加「池真实使用」断言防）。
- **?v= 缓存号必须定点刷新，不要全局替换（0.2.110 教训）**：dom-contract 测试冻结了 app.js/index.html 里的具体版本串，全局刷新会一次打挂 89 条断言。只在本次改动链上 bump（如 project-files→uv-pack/uv-pack-async、app.js→project-files、index.html→app.js）。
