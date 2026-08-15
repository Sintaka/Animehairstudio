# Anime Hair Studio — Devlog 索引 / Devlog index

> 这是本地适配开发日志的**目录 / 指引字典**。详细内容已拆到各专题文件，按需读取，避免一次性加载全文。
> 新增改动时：把详细条目追加到对应专题文件，并可在下方「最近版本」更新一行。

## 子发片底模（Low-poly child-strand base mesh）

![子发片底模](assets/lowpoly-child-strand-basemesh.png)

> 本 fork 支持 **low-poly 子发片拓扑**：父发片挖洞后，子发片通过低模水密桥接（父孔洞边界 → 子根环 → 顶/底带 + 侧面 quad）与父级衔接。截图是子发片底模部分；**导出 UV 已解决（0.2.69–0.2.79）**：按扫掠 grid 属性生成矩形 UV（规则/理念/踩坑见 [uv-unfold.md](uv-unfold.md)）。

## 本地运行 / How to run locally

> ⚠️ 不要用 `file://` 直接打开 `index.html`。请用静态服务器：

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

访问 <http://127.0.0.1:8080/>；或直接运行 `start-dev-server.cmd`。

## 字典 / Dictionary

| 主题 | 文件 |
|---|---|
| **新 Agent 快速入口（保留代码清单 + 决策总览，先读这个）** | [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md) |
| 重构计划 / 执行状态 | [REFACTOR_PLAN.md](REFACTOR_PLAN.md) |
| **从原版拆分指引（完成，新 agent 必读）** | [APPJS_SPLIT_GUIDE.md](APPJS_SPLIT_GUIDE.md) |
| 函数索引（机器生成，函数名→行号→calls） | [FUNCTION_INDEX.md](FUNCTION_INDEX.md)（`node scripts/gen-function-index.js` 重新生成；0.2.79：2,033 函数 / 96 文件） |
| 全局状态登记表（机器生成，当前 1 个 let=camera，阶段 3 地图） | [GLOBAL_LET_INVENTORY.md](GLOBAL_LET_INVENTORY.md)（`node scripts/gen-let-inventory.js` 重新生成） |
| 状态管理架构（scene-store 模式 / 15 个 store 清单 / 替换验证 9 点） | [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) |
| 子发片系统架构（数据流 / 5 子系统划分 / 依赖清单 / 3d-3 拆分方案） | [BranchSystem.md](BranchSystem.md) |
| **拆 UV 规则 / 实现理念 / 踩坑记录（普通发丝 + 子发片，0.2.69–0.2.79）** | [uv-unfold.md](uv-unfold.md) |
| 迁移方法论（脚本化提取 / 依赖注入 / 模块间 import / 9 点验证清单） | [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) |
| 开发规范 / 持续修改功能（本地适配清单）/ 许可证 | [development-standards.md](development-standards.md) |
| JS 改动标注（索引 + 6 个子系统专题） | [js-change-annotations.md](js-change-annotations.md)（索引）+ [annotations-bridge.md](annotations-bridge.md) / [annotations-region-panel.md](annotations-region-panel.md) / [annotations-root-bone.md](annotations-root-bone.md) / [annotations-split.md](annotations-split.md) / [annotations-display-fixes.md](annotations-display-fixes.md) / [annotations-adapt.md](annotations-adapt.md) |
| **进行中计划 / In-progress plans** | [in-progress/uv-unfold-plan.md](in-progress/uv-unfold-plan.md)（**导出拆 UV：主体已完成 0.2.79，剩余待办 5 项**）+ [in-progress/panel-split-tip-bones.md](in-progress/panel-split-tip-bones.md)（**权威当前状态**：尖端子骨骼实施 + 修复记录 §8.5–§8.30，0.2.65）+ [in-progress/bone-system-roadmap.md](in-progress/bone-system-roadmap.md)（骨骼推进路线 + registry，Phase A/B/C 已落地 §4.5）+ [in-progress/split-bone-refactor-plan.md](in-progress/split-bone-refactor-plan.md)（Split Spacing/Trim → split 子骨骼，P1 已实现）+ [in-progress/unified-bone-model.md](in-progress/unified-bone-model.md)（KineFX 式统一骨骼模型，已实现）+ [in-progress/child-sweep-unification.md](in-progress/child-sweep-unification.md)（子发片=默认扫掠+桥接+根部移动，P2 已实现）+ [in-progress/panel-strand-unify-plan.md](in-progress/panel-strand-unify-plan.md)（0.2.62 已落地：发尖子骨骼普适化 strandTip/strandSplitBones 启用，计划骨架）；完成后归档 [plans/archive/](plans/archive/) |
| 拆分延续计划（已完成） | [in-progress/appjs-slim-remaining-plan.md](in-progress/appjs-slim-remaining-plan.md)（剩余批次 A2/A3/A4/A6/B2/B3/B6/C1 全部完成）+ [in-progress/geometry-bones-extraction-plan.md](in-progress/geometry-bones-extraction-plan.md)（几何 G1-G7 + 骨骼 B0-B3 全部完成）+ 各批 <batch>-refactor-map.md 引用图 |
| Bug 修复 / 已知问题 | [bug-fixes.md](bug-fixes.md) |
| 修改型笔刷开发规范 | [brush-dev-spec.md](brush-dev-spec.md) |
| 本地适配进度 | [local-adaptation-log.md](local-adaptation-log.md) |
| 技术架构分析 & 复刻 DCC 参考 | [AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md](AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md) |
| Main 同步冲突 / 决策记录（Local 选项移除、桥接区合并策略） | [main-sync-conflicts.md](main-sync-conflicts.md) |

## 常用查找 / Quick lookup

- **新 agent 上手**：先读 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（哪些代码必须保留 + 决策 + 关键函数名）。
- **子发片深度重置 / 桥接系列（2.1→2.5，含坐标方向规律、底部/侧面/顶部桥接、选区控制、width curve 联动、sweep 起点）**：annotations-bridge.md（几何/挖洞）+ annotations-region-panel.md（选区）+ annotations-root-bone.md（gizmo/twist）。
- **导出拆 UV（普通发丝 + 子发片扫掠/桥接规则、实现理念、9 条踩坑）**：uv-unfold.md。
- **刘海 / 面板线框三角面修复**：annotations-display-fixes.md + bug-fixes.md #3/#4/#5。
- **快捷键 / 导出 / 笔刷 / 语言 / 导航**：js-change-annotations.md 顶部条目；修改型笔刷规范见 brush-dev-spec.md。
- **本地持久化功能（简体中文、Houdini 导航、Quick Save/Export 等）**：development-standards.md「持续修改功能」。

## 最近版本 / Latest
- 导出 UV：alpaca 占位栅格打包（0.2.88）：最后 UV 排列从 MaxRects 换成占位栅格打包（思路复刻 Blender alpaca，栅格化+空位扫描+scale_to_fit，4 套排序×扫描 Smart 择优），panel 与发丝混排、右上角不再空；MaxRects 注释保留可切回。详见 uv-unfold.md。
- 导出 UV：fit-to-tile 整包填满（0.2.87）：MaxRects 紧排后整包均匀缩放 + 居中（较长轴填满 [0,1]、较短轴居中），不新增 gap——替代 0.2.86 增 gap 散布（缝隙太大）。详见 uv-unfold.md。
- 导出 UV：panel 发尖平直 + 打包 Smart 多策略择优（0.2.85）：① panel 发尖 uv 只切缝不位移（uv 用平直 u、几何不变）；② 打包 6 策略（CP/BSSF × 4 排序）择优，fillUsed 均值 +2.9%、填平右上角。详见 uv-unfold.md。
- 导出 UV 打包优化：panel 原版 UV + CP 启发式 + gap 10px（0.2.84）：① panel/surface 用原始几何 uv（flatPanelMesh），不再 open 展开切中间；② 启发式 BSSF→Contact Point Rule（CP，BSSF 屏蔽保留），填充率均值 0.848→0.863、下限 +6.5%；③ 自适应填充改稠密采样+局部细化；④ 间隙 5px→10px。详见 uv-unfold.md。
- 导出 UV 打包换 MaxRects + panel 刘海纳入 + 自适应填充（0.2.83）：① `uv-pack.js` 从 shelf 换规范 MaxRects（不旋转、BSSF、gap）；② panel/surface（刘海）整片=一个原子 bbox 纳入打包（width 按 area/length 推导），与发丝按真实宽高统一排列；③ 自适应填充：k 在 PACK_FILL 上限内二分 + 验证重试，保证无兜底无重叠、尽量铺满 UDIM 1001（新增 fillUsed）；④ 修复初版 MaxRects 缺 SAT 早退导致自由矩形污染 → 重叠（压力测试 14229 处，已修）。详见 uv-unfold.md。
- 导出 UV 统一缩放 + 打包进 UDIM 1001 + uvisland 岛编号（0.2.82）：① `childUTopologyScale` U 方向中心缩放 0.9（硬编码、中心不变）；② 新增 `modules/io/uv-pack.js` `packFamilies`——每个「主发片+子发片」family 按真实 3D 尺度统一缩放（统一纹素密度·面积归一，k=sqrt(填充率/Σ世界面积)，U 宽=k×周长、V 高=k×长度，不再强制 0-1）后 shelf-pack 进 UDIM 1001（间隙 5px@4096、不旋转只位移、bbox 最小单位）；③ USDA 新增 `primvars:uvisland`（int/uniform）每 bbox 一个岛编号供 DCC 选岛；④ 接线 buildUnfoldedMeshes→packUnfoldedUv（closed/split + 子发片分组）；panel/haircard 本轮不纳入。详见 uv-unfold.md。
- 分支整理 + 统一 dev 分支（0.2.81，分支 DHS/develop）：新建统一开发分支 `DHS/develop`（自 upstream/main d3358f6 起线性 315 提交，承接全部本地适配；origin/main 为旧快照上传、内容分叉，不作变基目标——开发线本就基于合适的 upstream 位置）；历史分支（0.2.5x–0.2.6x、codex/*、v0.1.4-*）提交均已包含在 DHS/develop，4 个被替代的实验提交记录后随分支删除；`branch-deployment` fast-forward 至 DHS/develop 并推送 origin；分支规范改为「DHS/develop 统一开发 + 临时 feature 用后即删 + deployment 发布」（见 development-standards.md「分支管理」）。
- 发尖宽度控制点死区修复 + 导出 panel zipper 缝被填修复（0.2.80，分支 0.2.69-bugfix）：① `tipWidthMultiplierAt` fork 守卫改段内相对符号（不跨 0 的段原先取到另一侧 zipper fork → 视口拖拽写曲线但几何永远回退全局 = 死区，「曲线动发丝不动」）；② panel grid 列号段边界重叠导致 unfold "open" 重映射把缝两侧边界链坍缩、导出缝被填——colBase 预留边界列 + weld key 加 grid cell；③ 87 条过期 import 缓存号全量刷新 20260814-12；④ 新增 headless 复现/回归 scripts/repro-0045-bugs.mjs + check-stale-cache-params.mjs + check-usda-slit.mjs。详见 js-change-annotations.md / bug-fixes.md #7/#8。
- 桥接意外 seam 修复 + U 拓扑对齐缩放（0.2.79，分支 0.2.69-bugfix）：bottom band 与 side fill 洞侧 UV 冲突导致两道意外 seam（一块 poly 被切出去）→ bottom 改回与 top/side 相同插值，洞底整圈连续；扫掠 U 缩放改拓扑对齐（childUTopologyScale：环顶面弧长 ↔ 洞顶 u 跨度，环顶点 0/W 对齐洞顶 uMin/uMax，自然延伸约 1.1×洞宽，替代刚性 1.1）。
- 子发片 UV 微调：U 中心缩放 1.1 + 扫掠下移 + 取消横缝（0.2.78，分支 0.2.69-bugfix）：扫掠 U 围绕洞中心放大 1.1 倍（U 布局保持「外侧顶部（背面）在中间、侧面在中间两侧、最两侧后面」）；扫掠下移给桥接 bottom band 留空间；取消十字横缝（仅保留上下竖缝，修复侧面 UV 切乱/展到下面）。
- split 双管 U 轴排列 + 十字横缝 + 子发片 U 居中（0.2.77，分支 0.2.69-bugfix）：① 主发片 split 两管 UV 不再重叠（管 1 排在管 0 右侧，u=前管周长和+本管弧长，除以总周长）；② 十字横缝修正——底带从中心向左右各 2 条边切开（seam±1 顶点链双副本，side 判定改环向序修复切乱）；③ 子发片扫掠 U 收缩+位移（uOffset=洞中心−半宽、uScale=洞宽/子周长：中心对齐洞中心、宽度≈洞宽、外侧贴洞左右两段），seam 副本槽 u 用 seamEndU。详见 development-standards.md「持续修改功能」。
- 修复子发片 USDA poly 缺失 + 桥接十字切开 + 洞底对齐（0.2.76，分支 0.2.69-bugfix）：wrap quad 丢弃造成几何开口（poly 缺失）→ 恢复顶点复制式切开（seam/管首/桥接中线双副本，全部 quad 保留）；扫掠 UV 顶部对齐桥洞最底端（最靠 -V 侧）再往下留一行空隙；桥接锚点加 band 标记——top/side 向洞插值（顶部与侧面顶部对齐主发片），bottom 从中线切开自然展开（不强硬对齐洞底）；U 保持主发片周长缩放。
- 修复 split 发丝 UV 展开真实几何下整体失效（0.2.75，分支 0.2.69-bugfix）：根因——split 的 gridColIndices 用 colToSection.findIndex 匹配 fused 列，profile x=0 点（splitX=0）被 clip 进两管却只归管 0 → 管 1 每行 2 个 -1 → split 父发片弧长表整体 null → 子发片桥接 UV 接线整个关闭（没切 UV、没对齐洞）；修复：split 网格列改「管局部列 + 全局偏移」（seam=管首列、无 -1），uv-unfold split 分支删除 -1/colToSection 依赖；AHS_gridCol 语义改为管局部偏移列。
- 修复桥接 UV 挤点回归（0.2.74，分支 0.2.69-bugfix）：bridgeUvAt 对 ring=-1 纯洞侧顶点（sideHoleVertex）colU.get(-1) → null → 退回原 uv (0.5,0) 挤成一点；修复：ring 无效时 ringU=洞 u；split 父洞边界 seam 列 col=-1 查表失败兜底 u=0、v 按 parent 行。
- UV 展开重构：单边切缝 + 弧长 U + 周长缩放（0.2.73，分支 0.2.69-bugfix）：闭合环切缝列不再复制双副本（只有一边 u=0，wrap quad 丢弃、管沿切缝开口、不转头连回）；U 按每列弧长（row-0 环向边宽）调整而非等间距；子发片 U 按主发片一圈周长缩放（u 范围=子周长/主周长，noise U scale 统一），桥接洞侧用 parent 弧长表同一尺度；删除桥接中线双副本机制。详见 development-standards.md「持续修改功能」。
- UV 展开修正（0.2.72，分支 0.2.69-bugfix）：① 桥接子发片切缝纠正——旧切缝在环 top 侧中点（正面，方向搞反），纠正为**背面**（不面向外的一侧，环 bottom side 中点）；② 桥接底带中线切开（中线桥接顶点双副本，左右条带各自插值摊平，消除麻花）；③ split 发丝 clip seam 点（col=-1）改为管 seam 槽双副本（原 uv 混入矩形 UV 是麻花根因）；④ 子发片 V 按主发片尺度归一（v=桥接口 v − 子扫掠长/主发片长，U 保持独立归一化不与主发片对齐）。详见 development-standards.md「持续修改功能」。
- 导出矩形 UV 展开（0.2.71，分支 0.2.69-bugfix）：新增 uv-unfold.js——用 AHS grid 属性生成归一化矩形 UV（V 负方向=切线，根 V=1 尖 V=0，头发竖直向下打直；闭合环 seam 复制顶点，开放网格直接重映射，split 双管独立 seam）；桥接子发片从背部中间缝裁切、桥接 UV 在环侧（v=1）与父发片洞边界参数化 UV 之间插值顺滑连接（bridgeUvAnchors 锚点）；USDA/OBJ 均输出展开 UV（蒙皮权重随 seam 复制）；tests/uv-unfold.test.mjs 纯 node 回归。详见 development-standards.md「持续修改功能」。
- 导出编号补全全部几何类型 + AHS_ 前缀（0.2.70，分支 0.2.69-bugfix）：split（fused 列号，有子发片的主发丝按未挖洞规格）/ hair card / curve-surface card / compound 多发丝（桥接 -1）/ panel·surface 刘海（模拟 row=沿曲线、col=全局列 front/back 相邻，weld 重映射）全部补 `gridRowIndices`/`gridColIndices`；USDA primvar 改 `AHS_gridRow`/`AHS_gridCol`；twist 类发丝为普通扫掠已覆盖；poly/braid 不编号。
- 修复 Strand Profile 浮动面板打不开 + 导出扫掠 rows/cols 编号（0.2.69，分支 0.2.69-bugfix）：① branch-sweep.js（3d-3d-b 重构）抽取不完整 → 22 个自由变量，点击铅笔按钮抛 ReferenceError、浮动面板永不弹出；补 import + 22 deps 注入 + 3 处 `branchSweep.branchSweep.activeSweepProfileTarget()` 双重笔误修复。② 几何导出带扫掠网格每顶点 rows/cols 编号（桥接除外），USDA 输出 `int[] primvars:animeHairStudio:gridRow`/`gridCol`。详见 bug-fixes.md 与 development-standards.md「持续修改功能」。
- 文档筛查 + 快捷键修复（0.2.65，分支 0.2.65-bugfix）：数字/日期输入框不再被 1/2/3（workspace）与 q/w/e（工具）快捷键抢占（shortcut-registry 把可键入数值的 input 视为文本输入）；重新生成 FUNCTION_INDEX（2,003 函数 / 94 文件）与 GLOBAL_LET_INVENTORY（1 let），并同步更新 APPJS_SPLIT_GUIDE / AGENT_QUICKSTART / STATE_MANAGEMENT（17 store）等指引字典。
- 发尖控件 4 项修复（0.2.65，分支 0.2.64-panel-tip-curve）：绿色 spread 手柄拖拽热同步 Main 面板 Segment Spread；所有段绿色手柄显示 + 拖非选中段不切换（有意设计，规范化注释）；绿色手柄跟随 tip trim/curve + 切线外推 0.08（不再浮在未 trim 尖端）；W 移动 gizmo 上发尖骨骼 + Pull Strand 按 fork 以下暴露区整体求解（`beginTipSubBoneTranslate`/`solvePulledStrand`）。详见 devlog/in-progress/panel-split-tip-bones.md §8.29。

- 发尖收尾 + Panel Hair Cards 评估（0.2.61，分支 0.2.60-bugfix，代码已改、Hair Cards 仅评估）：Reset curve 全 1（撤销 0.2.60 fork 连续采样）、恢复绿色 spread 手柄（选中发尖时显示，视口拖拽直接写 `bone.spread`）、Width Curve 浮动面板两 zipper 之间的点可编辑（隐藏阈值改公共 fork）；Panel Hair Cards 单面模式评估结论「可行、兼容度高」（几何仅需 front 壳、材质双面已通用），详见 devlog/in-progress/panel-split-tip-bones.md §8.28。
- 深度评估（0.2.61，无代码，仅文档）：① Panel↔普通发丝兼容性与发尖子骨骼迁移——结论「几何扫掠已统一、split/发尖是 panel 专属；迁移分两步：单发丝尖端子骨骼 → split 两管子骨骼，先抽通用 tip 原语」，详见 unified-bone-model.md §6；② app.js 是否再瘦身——结论「已接近编排层地板，再拆主要是伪模块化」，详见 APPJS_SPLIT_GUIDE.md §8。
- 排序决策 + 新分支（0.2.62）：**先统一 panel 和普通发丝（发尖子骨骼普适化），骨骼系统随普适化同步成型**，不单独先建统一骨骼系统；不引入 scale。已删 server.js 原作本地保存死代码（Quick Save 唯一保存路径）。新分支 `0.2.62-panel-strand-unify`，计划骨架见 devlog/in-progress/panel-strand-unify-plan.md。
- Panel split 尖端子骨骼（0.2.59，分支 0.2.58-panel-split-refactor，**已实现 + 本轮进行中**）：程序化权重字段（每顶点 [mainJoint, segment, weight]，`geometry.userData.panelWeights`）、`splitBone.tip` 链（照抄主骨骼拓扑、横向偏移到段中心、rest+delta 保留用户偏移）、每段 tip 手柄/链线/高亮、USDA SkelBindingAPI 蒙皮、`bonesFor` 统一只读骨骼视图、`lock.bones` registry 双写；§8.6–§8.8 修复：点击 toggle 选中 tip + 保持主发丝选中、overlay depthTest:false、双段高亮、笔刷下保留 tip UI、边界段 tip 链长度、orient/scale 统一变换、undo tip 持久化、笔刷 bones-only、alt+点击切换。本轮（0.2.59 进行中）：发丝悬停改柔和橙色高亮、切换主选中清 tip 选中/高亮、alt+点击仅真点击触发、tip 完整切线/副切线/法线帧（orient 旋转几何）、修复选中发尖后 Push 笔刷。§8.10–§8.19 宽度控制收尾：绿色宽度控制点/曲线取代绿色 spread 手柄（左右独立、zipper 截断、锁定区=全局）；8.19 修复发尖 WidthCurve——拖拽方向改用发尖自己 authored 宽度轴（消除 7°~170° 倾斜的梯形手感、控制点落在网格前边缘）、非对称宽度中间线性过渡（u=0=左右均值，不再硬切分）、拖拽去重。8.20 真正根因修复：旧实现复用主面板宽度采样（绝对 u、主中心分界）导致手柄沿主骨骼线运动——改造为 tip-relative（段宽度以段中心为参考、camber 固定全局、rest 链稳定、曲线只含暴露区 7 点全可见、拖拽轴=发尖链→边缘方向），实测全部段/侧 maxAngle=0°。8.21 体验优化 4 项：tip 端 t=1 控制点暴露、Segment Spread 0–1 + 线性聚合、调 spread 绿点/曲线跟随几何、两侧基于最深 zipper 等距分布（短侧截断但数据保留）。8.22 浮动面板 4 项修复：视口拖拽后面板同步刷新、Reset 全 1、非对称混合窄带（拖一侧不再带动另一侧）、非对称改为 Ctrl 触发（默认两侧等比对称 + 面板隐藏开关加 Ctrl 提示）。8.23 深入修复 5 项：Reset 整段全 1、对称拖拽两侧同值（消 2x/延迟）、右侧预览+浮动面板热更新、宽度移动方向与发尖子骨骼自身法线垂直 + 法线箭头、rotate/scale 下 tip 子骨骼挂 gizmo。8.24：面板悬停不穿透高亮、Reset 后未暴露区跟随主骨骼（不裂）、发尖子骨骼 orient 跟随表面曲率（tipSurfaceFrameAt）、浮动面板 segment 曲线可拖动且只拖暴露点。8.25：边缘段 Segment Spread 镜像对侧 zipper 参数（两侧一致收窄、自动补全无 UI）。8.26：spread 上限 0.99（防退化面）、蒙皮权重按两侧 zipper 顶斜线分界（scale 不裂）、旋转 gizmo 起始朝向对齐发尖链自身 frame（不跳）。详见 devlog/in-progress/panel-split-tip-bones.md §8.5–§8.26（权威当前状态）。
- 骨骼系统改造（0.2.59，分支 0.2.58-panel-split-refactor，**已实施**）：`bonesFor(lock,{locks})` 从 scaffold 变为被 app.js 实际消费——USDA 骨骼导出（`exportAnimeHairUsda` 新增 `skeletons`，每锁一个 `SkelRoot` + 嵌套 `SkelJoint`：main 链 + split.*，子发片独立导出；`#exportIncludeBones` 有创作骨骼/子发片时启用）；`bonesFor` 输出 `role`（有 split/children 时 main 链 `"root"` 架空，否则 `"geometry"`）；新增持久化 `lock.bones` 统一创作骨骼注册表（kind=split/child/custom + meta），`splitBonesFor` 活数据优先 → registry → 派生，`materializeSplitBones` 双写，serializer/snapshot/mirror/stroke/creation 全部补齐。验证：0044 导出 26 SkelRoot / 187 SkelJoint（173 main_ + 14 split_）；0041/0042/0044 11/11 smoke。详见 devlog/in-progress/bone-system-roadmap.md。

- Panel Split Zipper 调研与重构计划（0.2.58，分支 0.2.58-panel-split-refactor，仅文档无代码）：Split Spacing（`panelSplitGap`）末端 crossover 根因定位——`splitOpening` 是 u 空间**绝对位移**（非相对缩放），相邻 split 同时打开且 `2*splitGap>段 span` 时 tip 行 `uStart>uEnd` 反转 → 列序倒置 → quad 折叠交叉（Sussurro_v1_0044 Front Bangs 1 实测 span 0.367 / gap 0.19 恰在 t=1 反转）；左右 Trim（`sampleT=t*(1-edgeTrim)`）同为参数位移。决策：**抛弃 Trim + Split Spacing 位移**，重铸为按 split 段的独立 WidthCurve 系统（`panelSegmentCurves`，相对缩放根除反转），**保留 zipper 水密拓扑**（墙 quad / capStart+capEnd 端盖 / snap-to-loops / 退化+反射折叠跳过 / 焊接 / 法线平滑）。调研结论：panel 只有一个主骨骼链（`points`），**无隐藏多骨骼可复用**；zipper 是纯拓扑特征（position/height 标量），段边界可作为未来每段 WidthCurve 的虚拟骨骼骨架（详见 annotations-panel-zipper.md 与 panel-split-refactor-plan.md）。

> 注（0.2.59 更新）：后续实现未采用 `panelSegmentCurves`（每段 WidthCurve override 数组）提案，改走 `lock.splitBones`（每段一个完整变换骨骼：P + orient + 段曲线），见 split-bone-refactor-plan.md 顶部 superseded 标注与 bone-system-roadmap.md §4.5；split 细节最终以代码为准。

- Phase 3 / 3d 收尾（0.2.57，重构 + bug 批次）：全局状态收敛到 15 个 store（app.js 顶层 let 241→1，仅 camera）；3d 拆批把 region-panel / 桥接几何 / root-bone / hierarchy / sweep-profile 迁出 app.js（modules/geometry/branch-*.js）；Bug 批次 2：Ctrl+Z 撤销到加载前真正根因（restoreState 裸 mirrorXEditing 的 store 化漏改 → 改 sculptState.state.mirrorXEditing）、File 菜单 vs 大纲拖拽（styles.css 缓存号从未 bump + server.js Cache-Control: no-cache）、Region 面板 cursor 规范（边点按方向 ns/ew-resize，四角 cursor 全翻转——SVG/Canvas 坐标 y 向下约定，勿再翻回）；Branch Bridge Smooth 两滑杆改为按子发片独立（lock.branchBridgeSmoothStrength/Detail 随 .ahs 序列化）；localization 词典拆数据文件（modules/data/loc-ja.js / loc-zh.js）；版本 0.1.4-Sintaka.0.2.57（详情见 local-adaptation-log.md 与 REFACTOR_PLAN.md）。
- Phase 2.17：子发片封面侧面 4 边面填充（分支 v0.1.4-Side-Topology，在 0.2.42 重写，无 smooth）——间接桥接（至少一条侧边留空）时从直接桥接向洞顶/底 1:1 填 quad 条带，利用 0.3 预留段无三角；版本 0.1.4-Sintaka.0.2.56（0.2.56：面板线框三角面真正修复——绕序翻转后同步交换 triangleEdgeMasks，quad 对角线不再描边。0.2.55：Front Bangs 1-3 视口三角观感修复——跳过退化/反射折叠 quad，最大二面角降至 ≤10.7°。0.2.54：刘海 split 父发片线框三角面修复——挖洞后同步裁剪 triangleEdgeMasks（显示问题，导出一直是四边面）。0.2.53：Sync L/R 默认调低到 0.45（上下仍 1.0）。0.2.52：Region 同步速度可调——Branch Root Region 面板新增 Sync L/R（默认0.45）/ Sync U/D（默认1.0）浮点+滑杆+重置；顺带排查过 H 拖根 2 倍速度问题（同步链路 split/普通父一致，未复现）。0.2.51：split 父发片支持子发片桥接（索引侧拼接——保留两管渲染，fused 网格 gridIndexAt/faceToRendered，非跨缝桥接干净、跨缝暴力粘）。0.2.49：父发片 Split Geometry 时子发片退回直接生成（无网格可挖洞则从根部扫掠，显式守卫 parentSupportsTopologyConnect）。0.2.48：合并 main（d3358f6）——移除三个 Local dev 选项统一用快速保存/导出；吸收马尾/复合发丝预设与 server.js；子发片桥接与 main 几何并存；sculpt 保留本地笔刷 + main preserve-tips。0.2.47：Branch Bridge 两参数改用标准 float+滑动条+重置按钮（range + setupEditableSliderControls 自动升级）；Region 面板按住中键即可平移查看（与 Alt+中键一致）。0.2.46：Region 面板缩放方向反转（右上放大/左下缩小）+ Alt+中键平移 + 滚轮缩放 + 手势按导航预设映射（不再照搬 Houdini）；Ctrl+drag 边点/角点反向镜像；Bridge Smooth 滑杆移到独立 Branch Bridge 面板并仅对子发片显示。0.2.45：桥接 Uniform Smooth（Strength+Detail，仅桥接部分、锚点固定）；Region 面板 Alt+右键局部缩放 + Reset Zoom；4 侧蓝色点不能越过橙色中心；4 角对角缩放。0.2.44：修复多行填充的 ringBase 索引偏移——洞侧中间顶点预推到环索引固定前，顶部桥接不再被扰乱）。
- Phase 2.16：删除子发片后父发片程序化补洞（重建父级重算挖洞）；直接桥接跟随 region 中心（rootRow=中心行，侧面桥接不再消失/顶底不多段）；region 中心橙色控制点（面板 + 3D）；恢复「Show points on mesh」开关并默认打开；根骨骼随用户 twist 1:1 旋转（种子含完整 pointTwists[0]，row0 直接用种子 frame）；版本 0.1.4-Sintaka.0.2.42（0.2.42：已选中骨骼后点击 gizmo 不再被附近骨骼抢选——gizmo 命中即优先。0.2.41：region 橙色中心改为稳定锚点——单边编辑不再移动中心/桥接，Ctrl+拖中心=两侧镜像缩放，面板加提示小字；gizmo 中心万向拾取半径恢复全尺寸。0.2.40：修复左右移动根骨骼后点别处蹦回主发片中心——captureBranchLocalState 保留 across；0.2.39 起：删除子发片补洞、直接桥接跟随 region 中心、橙色中心点、Show points 恢复、根部 twist 释放）。
- Phase 2.15：Region 左右方向修正——回退面板 v 轴翻转（右后方视角下大 v=世界左本应在面板右侧），改修根骨骼 v 符号（0.5 - across/width），根拖动同步 + 选区对应主发片左右均正确；sweep 起点黄色手柄选中修复（stopImmediatePropagation + buttons 兜底）；桥接接缝边界顶点法线恢复父发片法线；版本 0.1.4-Sintaka.0.2.38（根骨骼 gizmo 携带用户 twist：W 重进 move 不再回默认/偏移，根骨骼 up 跟随 gizmo；+ H 模式拖根 gizmo 热更新跟随扫掠，不再「扫掠自己扭」）。
- Phase 2.13：TransformMode 默认 object 并持久化；Branch Root Region 选区顺序归一化（点选不再跳变）；根滑动后选区面板/3D 标记跟随；选区宽度=1 支持（子环 1 宽 + 顶/底直接桥接）；版本 0.1.4-Sintaka.0.2.17（Phase 2.14 修正：上下桥接 smoothstep 双边法线，子环切端平滑衔接）。
