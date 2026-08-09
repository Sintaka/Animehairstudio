# 新 Agent 快速入口 / AGENT QUICKSTART

> 目的：让一个新 agent（或新开发者）在几分钟内知道「本 fork 改了哪些代码、哪些**必须保留**、当时的**决策**是什么」，避免从头通读 1.7MB 的 `app.js` 或 106KB 的 `js-change-annotations.md`。
> 维护：功能分支合入 / daily build +1 时，如涉及本页列出的保留代码或决策，请同步更新本页；详细条目仍按主题追加到各专题文件，本页只做摘要与指针。

## 0. 先读什么（建议顺序）

1. **本页** —— 保留代码 + 决策总览（读完约 2 分钟）
2. `devlog/README.md` —— devlog 索引字典（各专题文件入口）
3. `devlog/development-standards.md` —— 开发规范 + 「持续修改功能」清单（main 更新后要优先同步的本地功能）+ 许可证
4. `devlog/main-sync-conflicts.md` —— 与 main 合并的全部决策（Local 选项移除、桥接区与 compound 并存策略、17 处冲突分类）
5. 按需跳读：`devlog/js-change-annotations.md`（子系统索引表 + 指向 6 个 `annotations-*.md` 专题文件）、`devlog/FUNCTION_INDEX.md`（机器生成的函数目录）、`devlog/STATE_MANAGEMENT.md`（**状态管理架构：15 个 store 清单 + 替换验证 9 点**）、`devlog/bug-fixes.md`、`devlog/local-adaptation-log.md`（版本时间线）

## 1. 仓库结构速览

- `app.js`（≈1.7MB 单体）—— 主逻辑；子发片系统的桥接 / 挖洞 / Region 面板 / 根骨骼 gizmo 全部在这里。
- `modules/*.js` —— 按域分目录（core/data/geometry/io/edit/sculpt/material/branch/scalp）；**全局状态已收敛到 15 个 store**（见 `devlog/STATE_MANAGEMENT.md`），不要再新增 app.js 全局 let。
- `index.html` / `styles.css` —— UI。
- `server.js` —— main 带来的静态文件服务；`/api/save-project` 已是**死代码**（三个 Local 选项已移除，勿再调用）。
- `devlog/` —— 全部开发记录（本页所在）。

## 2. 必须保留的本地代码（Keep list）

> 相对 main 的持续修改/新增。**main 更新后优先同步这些，不要被 main 覆盖**；main 已原生支持的标 `deprecated`。清单与状态见 `development-standards.md`「持续修改功能」，判定依据见 `main-sync-conflicts.md`。

### 2.1 子发片拓扑衔接系统（本 fork 最大特性，main 完全没有）
- **入口分流**：`createHairGeometry` → `if (lock.branchRootRegion && parentSupportsTopologyConnect) createBranchChildGeometry`，否则 `createBaseHairGeometry`（退回直接扫掠）。
- **父发片挖洞**：`applyBranchRootRegionCarving`（程序化删面 + **同步裁剪 `triangleEdgeMasks`**）。
- **桥接几何**：`buildBranchBridgeGeometry`（≈751 行）+ `modules/branch-connect.js`（`squareChildRing` / `holeBoundary` / `connectSide` / `connectBoundaryToRing`）。
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
| 版本号 | `0.1.4-Sintaka.0.2.<dailybuild>`；主版本与上游对齐 | 避免与上游版本误判 | development-standards.md |

## 4. 工作方式（省 token 且合规）

- **分支**：新功能必须独立 checkout 新分支；禁止直接 merge main；合并/冲突处理由主进程负责。
- **查代码**：先用 `Select-String` / `git grep` 按函数名定点搜（第 2 节已列关键函数名），**不要整文件读**。
- **记 devlog**：每 commit 一句话 + 指向详细文件；新条目追加到对应专题文件，不重复全文。
- **验证**：Playwright headless + 静态服务器 `127.0.0.1:8080` + `D:/Downloads/Sussurro_v1_004*.ahs`（当前常用 0043）；不要用 `file://` 打开。
- **版本/缓存号**：改 `modules/app-config.js` 的 `APP_VERSION` 与 `index.html` 缓存号 `?v=YYYYMMDD-N`，与 devlog「最近版本」保持一致。

## 5. 常见坑（吸取过的教训）

- 桥接 masks 与三角形绕序必须**同步交换**，否则线框画 quad 对角线（0.2.54 / 0.2.56 两次踩坑）。
- 不要直接把 main 的多发丝预设（马尾/复合发丝）当子发片：索引与段数对不上会出错误拓扑；子发片目前只走单发丝默认预设。
- 根骨骼 gizmo 热更新只作**起始基准**，用户手调 diff 必须保留（offset 记忆），否则 W 重进 / H 开关会跳变。
- 删除子发片要**重算挖洞**（程序化流程 + 文件保存数据都要处理）；直接桥接要跟随 region 中心（rootRow=round((rowMin+rowMax)/2)）。
- 浮动面板 / 3D 选区标记对 null surface（split 父回退时）必须安全。
