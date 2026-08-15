# 开发规范 / 持续修改功能 / 许可证

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## 开发规范 / Development guidelines

> 后续所有改动遵循以下原则：

- **所有代码最简化**：能简单就不复杂，避免过度设计。
- **仅必要注释**：只写必要注释，不堆砌说明文字。
- **尽量使用已有的预设、开源库**：优先复用项目内预设与成熟开源库，避免重复造轮子。
- **减少手搓半成品**：少写自制的半成品实现，需要能力时优先引入成熟方案。
- **分支管理（2026-08-21 起，统一 dev 分支）**：统一开发分支 **`DHS/develop`**（自 upstream/main d3358f6 起线性历史，承接全部本地适配）；日常开发与 bug 修复直接在该分支提交；大更改按需开临时 feature 分支（命名 `feat/<描述>`），完成后 merge 回 `DHS/develop` 并**立即删除**临时分支（用后即清，不再长期保留「版本号-操作」类分支）；发布时把 `DHS/develop` fast-forward/merge 进 `branch-deployment`（deployment 分支）并推送 origin；禁止直接 merge main（main=上游镜像，上游更新按功能移植，见下条）；历史分支（0.2.5x–0.2.6x、codex/*、v0.1.4-*）已于 0.2.81 整理：其提交已全部包含在 DHS/develop，仅 4 个已被替代的实验提交（0.2.58 的 tipScale 实验 2 个、codex/bangs-triangle-fix 的任务分支规范文档、v0.1.4-Twist-Fix 的 0.2.43 旧实现）记录后随分支删除。

- **main 上游更新移植（不 merge）**：main 上游更新一律**分析后按功能移植**，禁止对 main 做简单 `git merge`/`rebase`——本地已按域重构（`modules/<domain>/` 分域 + `app.js` 编排层），与 main 的扁平 `modules/*.js` + 大 app.js 正交，直接合并只会产生大范围冲突。流程：先读 main diff 弄清每个功能/bug 修复的**实现方式与依赖**，再逐功能判断四类处置——①可直接移植（新增模块/纯函数/自包含逻辑）；②需在本地架构上重新接线（功能重叠）；③本地已实现（标 `deprecated` 并删本地实现）；④本地已用不同方案解决（跳过，仅做决策记录）。**bug 修复必须先查本地是否已有/已用别法修复**，再决定是否移植；评估与移植结论写入 `devlog/main-sync-conflicts.md`。
- **JS 改动标注**：所有 .js 修改/新增，需在 devlog「JS 改动标注」中标注与原有 JS 的差别/新增功能。
- **快捷键分区**：新增/修改的快捷键必须放在独立分区（自己的栏），不得改动原有快捷键说明；若与原有快捷键冲突或被代替，需标暗红并指向代替按键。
- **语言支持**：新增说明/文案需要同步添加现有语言支持（EN / JA / ZH）。
- **版本号规范（2026-08 起）**：完整版本号格式 `0.1.5-Sintaka.0.2.<dailybuild>`（当前 `0.1.5-Sintaka.0.2.81`）。`0.1.5` 主版本**与上游保持对齐**（不随本地改动递增）；`Sintaka` 为本地 fork 标记；`0.2` 为分段版本号（功能迭代时更新）；末尾 dailybuild **可直接递增到 5 位数**（如 12 → 13 → … → 12345，分段版本号更新时清零）。版本号写入 `modules/core/app-config.js` 的 `APP_VERSION`，显示在顶栏与 Settings → Version。
- **Codex 子智能体（强制流程，2026-08 起）**：涉及代码修改的任务**默认交给并行 Codex 子智能体执行**（即使只派 1 个也持续此流程），主进程（supervisor）负责深度调研、切分任务、合并审查与最终验证；无需用户每次手动提示。适用：并行调研（多 bug 根因分析、跨分支 diff 对比）、隔离小改动（按文件/子系统边界切分，避免共享文件冲突）。规则：子任务必须文件/子系统不相交；子 agent 产出后主进程统一审查整合并跑回归；关键路径阻塞任务不委托；若需新增/调整此流程约定，直接写入本规范，勿等用户重复说明。**devlog/md 中文更新注意**：含中文文件一律 UTF-8 无 BOM 写入；PowerShell 5.1 无 `utf8NoBOM`，用 .NET `[IO.File]::WriteAllText(path, text, (New-Object Text.UTF8Encoding($false)))` 或 Node 写盘，不要用 PowerShell 管道把中文喂给 node stdin。
- **Git 调用约定（2026-08 起，勿再触发 Windows 弹窗）**：pwsh 里调用 git 必须把 `git` 放在**命令的第一个 token**（git 是信任前缀，整条命令不经过文件沙箱、无需审批）；**绝不**给 git 命令附加 `sandbox_permissions` 升级参数——升级重试会弹审批窗打断用户（本仓库 .git 写入在 git 作为首 token 时直接可用，无需升级）；报错由主进程自行消化并换方式重试（如先 `git -C <repo>` 或补 `git config --global --add safe.directory`），不要把错误弹给用户；仓库已配置 `core.autocrlf=true`（工作树 CRLF、入库 LF），不要手改行尾。
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
| Panel Split 子骨骼 / 统一骨骼模型（Split Spacing/Trim 重铸） | 启用 | 0.2.59 起：每 split 段一个 `lock.splitBones` 完整变换骨骼（P/orient 四元数/spread + 每段 Width/Depth 曲线，混合持久化）；`createPanelStrandGeometry` 段内局部 u' + 每段曲线 + 相对缩放（根除 crossover），删除 trim/gap 位移；`bonesFor(lock)` 统一骨骼视图；子发片扫掠内核统一（modules/geometry/strand-sweep.js）；0.2.60：发尖（segment）曲线编辑统一为普通 Width Curve 面板（Width/Depth 预设 select + 小铅笔替代大按钮、浮动面板随子发尖切换热刷新、Reset 保持 fork 连续不裂）；0.2.61：Reset 全 1、绿色 spread 手柄（视口拖拽直接写 Segment Spread）、Width Curve 浮动面板中段可编辑；0.2.80：`tipWidthMultiplierAt` fork 守卫改段内相对符号（修复不跨 0 段「曲线动发丝不动」死区，见 bug-fixes.md #7） |
| 普通发丝尖端子骨骼普适化（strandTip / strandSplitBones） | 启用 | 0.2.62：普通非 split 发丝单尖端子骨骼（`lock.strandTip`/`lock.strandTipStart`；t-only 权重 + tip 链几何跟随）+ split 发丝两管子骨骼（`lock.strandSplitBones`，相对 spread + 每管 tip 链 + `strandSplitWeights`）；基础 UI：enable / tip start / tip length / reset、Split Tip Length / Reset Split Tips；镜像/快照/保存已接；split tip 视口拖拽已接；每管曲线面板、骨骼 registry、USDA 延后 |
| 状态管理 store 体系（scene-store + 15 个域 store） | 启用 | 全局 let 241→1（仅 camera）；新状态一律进对应 store（清单见 STATE_MANAGEMENT.md）；app.js 不新增全局 let；业务逻辑拆分完成（app.js 39,207→18,401 行，见 APPJS_SPLIT_GUIDE.md） |
| 拖放统一分发 | deprecated | main 0.1.4 已有应用文件拖放确认对话框，本地实现已删除 |
| 雕刻笔刷选择遮罩 | deprecated | main 0.1.4 已有 sculptBrushSelectionAllows，本地实现已删除 |
| 几何导出扫掠 rows/cols 编号（桥接除外，AHS_ primvar） | 启用 | 0.2.69–0.2.70：普通发丝行主序 + 端盖 -1；子发片桥接+端盖 -1；split 发丝 fused 列号（有子发片的主发丝按未挖洞规格）；hair card / curve-surface card 行主序；compound 多发丝基础网格 + 桥接插值 -1；panel/surface 刘海模拟（row=沿曲线、col=全局列 front/back 相邻，经 weld 重映射）；USDA 导出 `int[] primvars:AHS_gridRow`/`AHS_gridCol`（vertex）；poly/braid 预置网格不编号；0.2.80：panel 段边界列预留格子（colBase 累加 +1）+ weld key 加 grid cell，根除相邻段边界列共用格子导致的导出缝被填（见 bug-fixes.md #8） |
| 导出矩形 UV 展开（AHS grid 驱动） | 启用 | 0.2.71–0.2.78：modules/io/uv-unfold.js 按 gridRow/gridCol 生成矩形 UV（V 负方向=切线，根=1 尖=0；闭合环 seam 双副本切开、全部 quad 保留、U 按每列弧长累计/参考周长）；**U 布局约定（0.2.78 起明确）**：闭合环（含子发片扫掠）展开后「外侧顶部（背面）poly 在中间、侧面在中间两侧、最两侧是后面（seam 双副本 0/1）」；子发片扫掠 U 围绕洞中心收缩+位移（uOffset=洞中心−1.1×洞半宽、uScale=1.1×洞宽/子周长，宽度≈洞宽×1.1）、V 顶部对齐洞底端下留空隙、扫掠起点再下移 bottom band 跨度（childVSweepStart）；桥接 UV：top/side 向洞侧插值（顶部与侧面顶部对齐主发片），bottom 从中线竖缝切开自然展开（横缝已取消）；split 两管 U 轴排列不重叠（管 1 在管 0 右侧）、网格列=管局部列+全局偏移；USDA/OBJ 导出接线（蒙皮权重随 seam 复制）；每根发丝允许重叠不打包；**0.2.82**：导出最后一步把每「主发片+子发片」family 统一缩放（纹素密度·面积归一）+ shelf-pack 进 UDIM 1001（5px@4096、不旋转只位移）+ USDA `primvars:uvisland` 岛编号；**0.2.83–0.2.84**：打包换规范 MaxRects（不旋转、gap；0.2.84 启发式 BSSF→Contact Point Rule、间隙 5→10px）+ panel 刘海整片纳入（0.2.84 改用原始 uv、width 按 area/length 推导）+ 自适应填充（0.2.84 稠密采样+局部细化，无兜底无重叠）；**0.2.85**：panel 发尖 uv **打直**（发尖 uv 只切缝不位移、用平直 u 不再随 3D 收窄/弯曲，几何位置不变，方便贴图生产）+ 打包 Smart 多策略择优（CP/BSSF × 4 排序取 fillUsed 最高、均值 +2.9%、填平右上角）；**0.2.87**：打包后 fit-to-tile 整包均匀缩放+居中（较长轴填满 [0,1]、较短轴居中，不增 gap）——替代 0.2.86 增 gap 散布（缝隙太大已回退）；**0.2.88**：最后 UV 排列从 MaxRects 换成 alpaca 占位栅格打包（思路复刻 Blender alpaca，MaxRects 注释保留可切回），panel 与发丝混排、右上角不再空；**0.2.89**：新增 column 列主序扫描 + Smart 改「按更方选」（6 套 sort×scan 取 bbox 更方者），fit 后 V 从 ~0.6 填到 ~0.99；**0.2.90**：读源码改 alpaca turbo（L 形 zigzag 维持方形 bbox），整包 U/V 双侧均衡（见 uv-unfold.md §10）（见 uv-unfold.md §10） |

> 新增本地功能时，应同步在本表补充一行，并说明其「启用 / deprecated」状态与依赖的 main 版本。

## 许可证 / License

> 本项目基于原作者 LuDe (Ludetools) 的 **ANIME HAIR STUDIO SOURCE-AVAILABLE LICENSE v1.2**（自定义许可证，非 OSI 开源许可）。

- **性质**：source-available（源代码可用，但**不是开源**）。仅授权**个人、非商业**的查看与修改；免费、非商业地再分发（须附带 LICENSE、标明修改、保留全部版权声明与作者致谢/捐赠/社交链接）；**禁止商业使用**（出售 / 出租 / 转授权 / 收费访问 / 作为付费或赞助广告支持的产品，需作者书面许可）；禁止移除或替换作者的捐赠链接，也不得添加他人捐赠链接；允许个人用离线打包（Electron 等）但**禁止再分发打包版**；违反即自动终止授权并须删除副本。
- **与 MIT 的区别**：MIT 允许任意使用（含商业），本许可严格得多（个人 + 非商业 + 保留捐赠链接 + 商用需书面许可），更接近 shared-source / source-available 模式。
- **本项目含义**：本仓库保留原作者许可证；本地适配属于修改版，再分发需带 LICENSE、标明修改、保留 .github/FUNDING.yml（作者 Patreon 捐赠链接）；整包或商用需先取得作者书面许可。
