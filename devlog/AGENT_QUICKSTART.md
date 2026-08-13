# 新 Agent 快速入口 / AGENT QUICKSTART

> 目的：让一个新 agent（或新开发者）在几分钟内知道「本 fork 改了哪些代码、哪些**必须保留**、当时的**决策**是什么」，避免从头通读 1.7MB 的 `app.js` 或 106KB 的 `js-change-annotations.md`。
> 维护：功能分支合入 / daily build +1 时，如涉及本页列出的保留代码或决策，请同步更新本页；详细条目仍按主题追加到各专题文件，本页只做摘要与指针。

## 0. 先读什么（建议顺序）

1. **本页** —— 保留代码 + 决策总览（读完约 2 分钟）
2. `devlog/README.md` —— devlog 索引字典（各专题文件入口）
3. `devlog/development-standards.md` —— 开发规范 + 「持续修改功能」清单（main 更新后要优先同步的本地功能）+ 许可证
4. `devlog/main-sync-conflicts.md` —— 与 main 合并的全部决策（Local 选项移除、桥接区与 compound 并存策略、17 处冲突分类）
5. 按需跳读：`devlog/APPJS_SPLIT_GUIDE.md`（**从原版拆分指引**：历程/当前架构/拆分模式/每批执行模板/踩坑/定位字典，新 agent 必读）、`devlog/js-change-annotations.md`（子系统索引表 + 指向 6 个 `annotations-*.md` 专题文件）、`devlog/FUNCTION_INDEX.md`（机器生成的函数目录）、`devlog/STATE_MANAGEMENT.md`（**状态管理架构：15 个 store 清单 + 替换验证 9 点**）、`devlog/bug-fixes.md`、`devlog/local-adaptation-log.md`（版本时间线）

## 1. 仓库结构速览

- `app.js`（≈20k 行，编排层）—— 主逻辑；子发片系统的桥接 / 挖洞 / Region 面板 / 根骨骼 gizmo 等业务逻辑已按子系统迁入 modules（见 `APPJS_SPLIT_GUIDE.md` §2）。
- `modules/*.js` —— 按域分目录（core/data/geometry/io/edit/sculpt/material/branch/scalp/bones/scene，共 94 个文件）；**全局状态已收敛到 17 个 store，全局 let 只剩 camera**（main 0.1.5 移植新增 multiCameraState/recovery，见 `devlog/STATE_MANAGEMENT.md`），不要再新增 app.js 全局 let。
- `index.html` / `styles.css` —— UI。
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

- **分支**：新功能必须独立 checkout 新分支；禁止直接 merge main；合并/冲突处理由主进程负责。
- **查代码**：先用 `Select-String` / `git grep` 按函数名定点搜（第 2 节已列关键函数名），**不要整文件读**。
- **记 devlog**：每 commit 一句话 + 指向详细文件；新条目追加到对应专题文件，不重复全文。
- **验证**：`node scripts/verify-smoke.mjs assets/presets/layered-side-bun.ahs`（10/11 基线，唯一失败 branch-bridge 为内容相关）；或 Playwright headless + 静态服务器 `127.0.0.1:8080` + `D:/Downloads/Sussurro_v1_004*.ahs`（当前常用 0043）；不要用 `file://` 打开。
- **版本/缓存号**：改 `modules/core/app-config.js` 的 `APP_VERSION` 与 `index.html` 缓存号 `?v=YYYYMMDD-N`，与 devlog「最近版本」保持一致。

## 5. 常见坑（吸取过的教训）

- 桥接 masks 与三角形绕序必须**同步交换**，否则线框画 quad 对角线（0.2.54 / 0.2.56 两次踩坑）。
- 不要直接把 main 的多发丝预设（马尾/复合发丝）当子发片：索引与段数对不上会出错误拓扑；子发片目前只走单发丝默认预设。
- 根骨骼 gizmo 热更新只作**起始基准**，用户手调 diff 必须保留（offset 记忆），否则 W 重进 / H 开关会跳变。
- 删除子发片要**重算挖洞**（程序化流程 + 文件保存数据都要处理）；直接桥接要跟随 region 中心（rootRow=round((rowMin+rowMax)/2)）。
- 浮动面板 / 3D 选区标记对 null surface（split 父回退时）必须安全。
