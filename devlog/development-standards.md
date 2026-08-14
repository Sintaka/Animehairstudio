# 开发规范 / 持续修改功能 / 许可证

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## 开发规范 / Development guidelines

> 后续所有改动遵循以下原则：

- **所有代码最简化**：能简单就不复杂，避免过度设计。
- **仅必要注释**：只写必要注释，不堆砌说明文字。
- **尽量使用已有的预设、开源库**：优先复用项目内预设与成熟开源库，避免重复造轮子。
- **减少手搓半成品**：少写自制的半成品实现，需要能力时优先引入成熟方案。
- **分支管理**：禁止直接 merge 主分支；每次新功能必须独立 checkout 新分支；合并与冲突处理统一由主进程负责。
- **任务类型分支（2026-08 起）**：不同任务类型的**大更改**（重构 / 新功能 / 修 bug）自动创建独立分支，命名规范 `版本号-操作`（如 `0.2.57-refactor`、`0.2.58-feature`、`0.2.59-bugfix`）。小改动（文档整理、缓存号/版本号、单点修复）可在当前分支直接提交；一旦任务类型变化或进入大更改，立即从当前 HEAD 开新分支，避免把多种任务类型混在同一分支。

- **main 上游更新移植（不 merge）**：main 上游更新一律**分析后按功能移植**，禁止对 main 做简单 `git merge`/`rebase`——本地已按域重构（`modules/<domain>/` 分域 + `app.js` 编排层），与 main 的扁平 `modules/*.js` + 大 app.js 正交，直接合并只会产生大范围冲突。流程：先读 main diff 弄清每个功能/bug 修复的**实现方式与依赖**，再逐功能判断四类处置——①可直接移植（新增模块/纯函数/自包含逻辑）；②需在本地架构上重新接线（功能重叠）；③本地已实现（标 `deprecated` 并删本地实现）；④本地已用不同方案解决（跳过，仅做决策记录）。**bug 修复必须先查本地是否已有/已用别法修复**，再决定是否移植；评估与移植结论写入 `devlog/main-sync-conflicts.md`。
- **JS 改动标注**：所有 .js 修改/新增，需在 devlog「JS 改动标注」中标注与原有 JS 的差别/新增功能。
- **快捷键分区**：新增/修改的快捷键必须放在独立分区（自己的栏），不得改动原有快捷键说明；若与原有快捷键冲突或被代替，需标暗红并指向代替按键。
- **语言支持**：新增说明/文案需要同步添加现有语言支持（EN / JA / ZH）。
- **版本号规范（2026-08 起）**：完整版本号格式 `0.1.5-Sintaka.0.2.<dailybuild>`（当前 `0.1.5-Sintaka.0.2.64`）。`0.1.5` 主版本**与上游保持对齐**（不随本地改动递增）；`Sintaka` 为本地 fork 标记；`0.2` 为分段版本号（功能迭代时更新）；末尾 dailybuild **可直接递增到 5 位数**（如 12 → 13 → … → 12345，分段版本号更新时清零）。版本号写入 `modules/core/app-config.js` 的 `APP_VERSION`，显示在顶栏与 Settings → Version。
- **Codex 子智能体（强制流程，2026-08 起）**：涉及代码修改的任务**默认交给并行 Codex 子智能体执行**（即使只派 1 个也持续此流程），主进程（supervisor）负责深度调研、切分任务、合并审查与最终验证；无需用户每次手动提示。适用：并行调研（多 bug 根因分析、跨分支 diff 对比）、隔离小改动（按文件/子系统边界切分，避免共享文件冲突）。规则：子任务必须文件/子系统不相交；子 agent 产出后主进程统一审查整合并跑回归；关键路径阻塞任务不委托；若需新增/调整此流程约定，直接写入本规范，勿等用户重复说明。**devlog/md 中文更新注意**：含中文文件一律 UTF-8 无 BOM 写入；PowerShell 5.1 无 `utf8NoBOM`，用 .NET `[IO.File]::WriteAllText(path, text, (New-Object Text.UTF8Encoding($false)))` 或 Node 写盘，不要用 PowerShell 管道把中文喂给 node stdin。
- **许可证合规**：保留原作者 LICENSE 与 .github/FUNDING.yml（捐赠链接不得删改）；再分发须附带 LICENSE、标明修改、仅限免费非商业；商用 / 打包分发需作者书面许可；引入第三方代码时确保许可兼容。

## 持续修改功能 / Persistent local adaptations

> 以下本地适配是相对 main 分支的**持续修改**：本地分支大概率不会并入主版本，每次 main 更新后都要**优先同步**这套功能。同步流程：从 main 建新 dev 分支 → 移植上一 dev 分支的改动 → 按下表逐项核对 → **main 已原生支持的功能标记 `deprecated` 并从本地删除对应实现** → 更新「JS 改动标注」与「本地适配进度」→ daily build 序号 +1。

| 功能 | 状态 | 说明 |
|---|---|---|
| 简体中文（zh）语言 | 启用 | main 只有 EN/JA；zh 选项 + ZH 词典 + translateUiString 分发 |
| 4 个自定义雕刻笔刷（Slide / Scale·Cut-Extend / Push / Orient）+ Smooth twist 平滑 | 启用 | 接入 sculpt 管线；Ctrl=反向；ScaleMode 行 |
| Houdini 导航 | 启用 | 并入 Navigation style（Anime Hair Studio / Blender / Houdini） |
| S+左键拖动调节笔刷大小（含雕刻笔刷，拖动时指针固定） | 启用 | main 只有 Draw 等部分笔刷；雕刻笔刷与指针锁定为本地增强 |
| Quick Save / Save as（Ctrl+S / Ctrl+Shift+S） | 启用 | 菜单项 + 全局快捷键 + 独立快捷键分区 |
| Quick Export（Ctrl+Alt+S）复刻上一次导出；导出/保存优先 File System Access API 写盘 | 启用 | 覆盖写同一文件，避免浏览器下载 `(1)` 后缀 |
| Quick Save 记住打开的项目文件 | 启用 | showOpenFilePicker / getAsFileSystemHandle 取可写 handle |
| 浮动面板跟随选中 + 拖动/缩放/右缘吸附；左右面板宽度拖拽；底部笔刷栏自适应 | 启用 | 视口 UI 增强 |
| 材质面板删除材质 | 启用 | 删除按钮 + Delete 键；默认材质不可删 |
| Ctrl+Z 修复 | 启用 | modules/core/shortcut-registry.js 对非文本输入控件放行 |
| start-dev-server.cmd 本地服务器 | 启用 | python -m http.server 8080 |
| 子发片拓扑衔接系统（父发片挖洞 + 低模水密桥接 + Region 选区 + 根骨骼工作流） | 启用 | main 完全没有；`createHairGeometry` 按 `lock.branchRootRegion` 分流（`createBranchChildGeometry` / `buildBranchBridgeGeometry` / `applyBranchRootRegionCarving`，`modules/geometry/branch-connect.js`）；子发片仅支持单发丝默认预设 |
| split 父发片兼容（索引侧 fused 网格） | 启用 | 0.2.49 起父无 gridRows/quadFaces 时子发片退回直接生成；0.2.50–0.2.51 索引侧拼接 `splitFusedGrid`（保留两管渲染）；0.2.54 挖洞后同步裁剪 masks |
| Branch Bridge Smooth（Strength / Detail） | 启用 | 独立 Branch Bridge 面板，仅选中子发片时显示；标准 float+滑杆+重置（0.2.45–0.2.47） |
| Region 同步速度滑块（Sync L/R、Sync U/D） | 启用 | Branch Root Region 面板；默认 L/R 0.45、U/D 1.0；`updateBranchRootRegionCenter` 按速度缩放（0.2.52–0.2.53） |
| 刘海 / 面板线框三角面显示修复 | 启用 | 显示层 masks 修复（0.2.54–0.2.56）；导出数据一直是四边面；详见 bug-fixes.md #3 |
| Panel Split 子骨骼 / 统一骨骼模型（Split Spacing/Trim 重铸） | 启用 | 0.2.59 起：每 split 段一个 `lock.splitBones` 完整变换骨骼（P/orient 四元数/spread + 每段 Width/Depth 曲线，混合持久化）；`createPanelStrandGeometry` 段内局部 u' + 每段曲线 + 相对缩放（根除 crossover），删除 trim/gap 位移；`bonesFor(lock)` 统一骨骼视图；子发片扫掠内核统一（modules/geometry/strand-sweep.js）；0.2.60：发尖（segment）曲线编辑统一为普通 Width Curve 面板（Width/Depth 预设 select + 小铅笔替代大按钮、浮动面板随子发尖切换热刷新、Reset 保持 fork 连续不裂）；0.2.61：Reset 全 1、绿色 spread 手柄（视口拖拽直接写 Segment Spread）、Width Curve 浮动面板中段可编辑 |
| 普通发丝尖端子骨骼普适化（strandTip / strandSplitBones） | 启用 | 0.2.62：普通非 split 发丝单尖端子骨骼（`lock.strandTip`/`lock.strandTipStart`；t-only 权重 + tip 链几何跟随）+ split 发丝两管子骨骼（`lock.strandSplitBones`，相对 spread + 每管 tip 链 + `strandSplitWeights`）；基础 UI：enable / tip start / tip length / reset、Split Tip Length / Reset Split Tips；镜像/快照/保存已接；split tip 视口拖拽已接；每管曲线面板、骨骼 registry、USDA 延后 |
| 状态管理 store 体系（scene-store + 15 个域 store） | 启用 | 全局 let 241→1（仅 camera）；新状态一律进对应 store（清单见 STATE_MANAGEMENT.md）；app.js 不新增全局 let；业务逻辑拆分完成（app.js 39,207→18,401 行，见 APPJS_SPLIT_GUIDE.md） |
| 拖放统一分发 | deprecated | main 0.1.4 已有应用文件拖放确认对话框，本地实现已删除 |
| 雕刻笔刷选择遮罩 | deprecated | main 0.1.4 已有 sculptBrushSelectionAllows，本地实现已删除 |
| 几何导出扫掠 rows/cols 编号（桥接除外，AHS_ primvar） | 启用 | 0.2.69–0.2.70：普通发丝行主序 + 端盖 -1；子发片桥接+端盖 -1；split 发丝 fused 列号（有子发片的主发丝按未挖洞规格）；hair card / curve-surface card 行主序；compound 多发丝基础网格 + 桥接插值 -1；panel/surface 刘海模拟（row=沿曲线、col=全局列 front/back 相邻，经 weld 重映射）；USDA 导出 `int[] primvars:AHS_gridRow`/`AHS_gridCol`（vertex）；poly/braid 预置网格不编号 |
| 导出矩形 UV 展开（AHS grid 驱动） | 启用 | 0.2.71–0.2.72：modules/io/uv-unfold.js 按 gridRow/gridCol 生成归一化矩形 UV（V 负方向=切线，根=1 尖=0；闭合环 seam 复制顶点，开放网格直接重映射；split 双管独立 seam、clip seam 点（col=-1）作为管 seam 双副本）；桥接子发片切缝=**背面**（不面向外的一侧，环 bottom side 中点 ringWidthSegments+1+round(W/2)，0.2.72 纠正——0.2.71 误放正面 top 侧）+ 桥接底带中线切开（中线桥接顶点双副本，左右条带各自插值摊平）；子发片 V 按主发片尺度归一（v=1−洞中心u−row/(R−1)×子长/主长），U 保持独立归一化不与主发片对齐（noise U scale 统一）；USDA/OBJ 导出接线（蒙皮权重随 seam 复制）；每根发丝独立 0-1 tile 允许重叠不打包 |

> 新增本地功能时，应同步在本表补充一行，并说明其「启用 / deprecated」状态与依赖的 main 版本。

## 许可证 / License

> 本项目基于原作者 LuDe (Ludetools) 的 **ANIME HAIR STUDIO SOURCE-AVAILABLE LICENSE v1.2**（自定义许可证，非 OSI 开源许可）。

- **性质**：source-available（源代码可用，但**不是开源**）。仅授权**个人、非商业**的查看与修改；免费、非商业地再分发（须附带 LICENSE、标明修改、保留全部版权声明与作者致谢/捐赠/社交链接）；**禁止商业使用**（出售 / 出租 / 转授权 / 收费访问 / 作为付费或赞助广告支持的产品，需作者书面许可）；禁止移除或替换作者的捐赠链接，也不得添加他人捐赠链接；允许个人用离线打包（Electron 等）但**禁止再分发打包版**；违反即自动终止授权并须删除副本。
- **与 MIT 的区别**：MIT 允许任意使用（含商业），本许可严格得多（个人 + 非商业 + 保留捐赠链接 + 商用需书面许可），更接近 shared-source / source-available 模式。
- **本项目含义**：本仓库保留原作者许可证；本地适配属于修改版，再分发需带 LICENSE、标明修改、保留 .github/FUNDING.yml（作者 Patreon 捐赠链接）；整包或商用需先取得作者书面许可。
