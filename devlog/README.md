# Anime Hair Studio — Devlog

## 这是什么 / What this is

**Anime Hair Studio** 是一个**基于 Web 的动画发片制作 App**（web-based animated hair-sheet / hair-styling production app），由 [Ludetools/Animehairstudio](https://github.com/Ludetools/Animehairstudio) 开发。

它直接在浏览器里运行，用于制作动画角色风格的头发：

- 在 3D 视口中绘制、编辑发片（strand）、编织（braid）、发束面板（panel）等头发几何体
- 提供 Move / Smooth 等雕刻笔刷，以及 Poly Brush、Surface Loft 等建模工具
- 内置头皮区域、发层、束(clump) 等组织方式，支持镜像、比例编辑、径向菜单等
- 支持导入头模/全身网格，导出 `.ahs` 项目文件、OBJ、USDA 等格式

## 本地开发运行方式 / How to run locally

> ⚠️ 不要用 `file://` 直接打开 `index.html`，浏览器安全策略会阻止本地资源/API 正常工作。
> 请用静态服务器代理，例如：

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

然后访问 <http://127.0.0.1:8080/>。

也可以直接运行仓库根目录下的启动脚本（内容就是上面这一行 python 命令）：

- `start-dev-server.cmd`（Windows 命令提示符）

## 开发规范 / Development guidelines

> 后续所有改动遵循以下原则：

- **所有代码最简化**：能简单就不复杂，避免过度设计。
- **仅必要注释**：只写必要注释，不堆砌说明文字。
- **尽量使用已有的预设、开源库**：优先复用项目内预设与成熟开源库，避免重复造轮子。
- **减少手搓半成品**：少写自制的半成品实现，需要能力时优先引入成熟方案。
- **分支管理**：禁止直接 merge 主分支；每次新功能必须独立 checkout 新分支；合并与冲突处理统一由主进程负责。
- **JS 改动标注**：所有 .js 修改/新增，需在 devlog「JS 改动标注」中标注与原有 JS 的差别/新增功能。
- **快捷键分区**：新增/修改的快捷键必须放在独立分区（自己的栏），不得改动原有快捷键说明；若与原有快捷键冲突或被代替，需标暗红并指向代替按键。
- **语言支持**：新增说明/文案需要同步添加现有语言支持（EN / JA / ZH）。
- **许可证合规**：保留原作者 LICENSE 与 .github/FUNDING.yml（捐赠链接不得删改）；再分发须附带 LICENSE、标明修改、仅限免费非商业；商用 / 打包分发需作者书面许可；引入第三方代码时确保许可兼容。

## 许可证 / License

> 本项目基于原作者 LuDe (Ludetools) 的 **ANIME HAIR STUDIO SOURCE-AVAILABLE LICENSE v1.2**（自定义许可证，非 OSI 开源许可）。

- **性质**：source-available（源代码可用，但**不是开源**）。仅授权**个人、非商业**的查看与修改；免费、非商业地再分发（须附带 LICENSE、标明修改、保留全部版权声明与作者致谢/捐赠/社交链接）；**禁止商业使用**（出售 / 出租 / 转授权 / 收费访问 / 作为付费或赞助广告支持的产品，需作者书面许可）；禁止移除或替换作者的捐赠链接，也不得添加他人捐赠链接；允许个人用离线打包（Electron 等）但**禁止再分发打包版**；违反即自动终止授权并须删除副本。
- **与 MIT 的区别**：MIT 允许任意使用（含商业），本许可严格得多（个人 + 非商业 + 保留捐赠链接 + 商用需书面许可），更接近 shared-source / source-available 模式。
- **本项目含义**：本仓库保留原作者许可证；本地适配属于修改版，再分发需带 LICENSE、标明修改、保留 .github/FUNDING.yml（作者 Patreon 捐赠链接）；整包或商用需先取得作者书面许可。

## JS 改动标注 / JS change annotations

> 以 main 分支（原版本）为基准，记录本地适配的差别/新增功能。

- **app.js**
  - 新增 Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，浏览器不支持时回退原下载对话框；新增 `saveHairProjectQuickly` 覆盖保存到上次文件；全局 keydown 拦截 Ctrl+S / Ctrl+Shift+S（代替浏览器默认"保存网页"，原快捷键说明不改动，新增内容放在独立「Local Adaptation」分区）。
  - 雕刻笔刷选择遮罩：新增 `sculptBrushSelectionMask`；`sculptBrushUnits` / `updateSculptBrushViabilityPlane` 增加选择过滤（未选中 → 所有可见头发可雕刻；选中 → 仅选中头发可雕刻）。
  - 拖放统一分发：任何文件拖拽都接受，drop 时按类型分发（.ahs/.animehair.json/.json → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略并警告）；后续新增 geo / 附加模型等 drop 类型只需在 drop 分发处扩展。
  - 材质面板：新增删除材质（面板删除按钮 / Delete 键，焦点在材质面板时生效）；被删除材质的头发自动改回默认材质；默认材质不可删除。
  - 视口导航模式：新增偏好设置「Navigation mode」（Default / Houdini，默认 Houdini）；Houdini 模式 Alt+左键旋转（不变）、Alt+中键平移、Alt+右键拖拽缩放（同时响应水平+垂直位移，快速模长近似归一化，45° 对角 = 1 倍；方向右上放大、左下缩小），滚轮缩放保持；左下角导航提示随模式更新（Alt + Middle Mouse / Alt + Right Mouse）。
  - 浮动面板跟随选择：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新（见「Bug 修复」）。
- **v0.1.4 迁移（codex/branchdev_v0.1.4）**：本地适配整体从旧 main 迁移到 0.1.4 代码库，功能保持一致，冲突与重复实现按 0.1.4 新架构收口。
  - 雕刻笔刷：Slide / Scale（Cut·Extend）/ Push / Orient 四个自定义笔刷接入 0.1.4 雕刻管线（`sculptBrushToolActive` / `sculptBrushStrengthByTool` / `beginSculptMoveStroke` Ctrl=反向 / `applySculptMoveStrokeSample` 新增分支）；Smooth 增加 twist 平滑（`smoothSculptTwistDeltas` 在 modules/sculpt-brush.js）；ScaleMode 行仅 Scale 笔刷显示。
  - 导航：Houdini 并入 0.1.4 已有的 Navigation style（Anime Hair Studio / Blender / Houdini 三选一），不再用独立的 navigationMode；Houdini = Alt+左键旋转 / Alt+中键平移 / Alt+右键拖拽缩放（快速模长近似归一化，右上放大、左下缩小），滚轮缩放；导航提示与快捷键帮助随模式切换（`data-navigation-style-tip` / `data-navigation-style-shortcut` 行）。
  - 浮动面板跟随选择：`retargetFloatingStrandEditors()` 在 `selectLock` 时把打开的 Strand Profile / Width·Depth Curve 面板改指向最新选中的 strand 并刷新；`rebuildLockGeometry` / undo / redo 时刷新 Taper 网格控制点。保留浮动面板拖动 / 右下角缩放 / 右缘吸附属性面板左侧、左右面板宽度拖拽、底部笔刷栏自适应。
  - Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，回退原下载对话框；`saveHairProjectQuickly` 覆盖保存到上次文件；File 菜单新增两项并带快捷键提示（独立「Local Adaptation」分区）。
  - 拖放：采用 0.1.4 自带的应用文件拖放（.ahs/.obj → 确认对话框，图片 → 2D/3D 参考图），移除旧的自定义分发实现（`isProjectFile` / `dragContainsFiles`）。
  - 选择遮罩：0.1.4 已内置雕刻笔刷选择遮罩（`sculptBrushSelectionAllows`），移除 brush-dev 的重复实现 `sculptBrushSelectionMask`。
  - Ctrl+Z 修复迁移到 0.1.4 的 modules/shortcut-registry.js（`focusedControlShouldYieldToShortcut` 对所有非文本输入控件放行 Ctrl+Z/Y/D）；`setActiveTool` 重置 `historyShortcutHeld`。
  - 语言：ZH 词典扩展覆盖 0.1.4 新增文案（导航方式 / 相机平滑 / 最近项目 / 拖放项目确认 / 选择集 / 锁定 / 隔离等，3D 名词保留英文）；JA 补充新笔刷 / ScaleMode / 保存等词条；`translateUiString` 按语言词典分发（JA / ZH），未收录回退英文。
- **快捷导出（Ctrl+Alt+S）**：新增 `exportHairProjectQuickly`，完全复刻上一次导出（`lastExport`：格式 / 文件名 / 导出内容 / 本地标志）——上次是下载则同名重新下载、上次是本地保存则再次本地保存，不再弹文件选择；从未导出时回退到原导出对话框；File 菜单新增「Quick Export（Ctrl+Alt+S）」；快捷键帮助「Sintaka Fork」分区新增 Ctrl+Alt+S 行。
- **快捷键帮助分区改名**：「Local Adaptation」分区改名为「Sintaka Fork」（专用名词，不随语言翻译）。
- **index.html**：File 菜单新增 Quick Save（Ctrl+S）与 Save as（Ctrl+Shift+S）快捷键提示；快捷键帮助新增独立「Local Adaptation」分区。
- **modules/localization.js**：新增 "Save as"、"Quick Save"、"Quick Save the project"、"Local Adaptation" 的日语翻译（含导航模式：Navigation mode / Alt + Middle Mouse 等）。
  - 新增简体中文（zh）：SUPPORTED_LANGUAGES 增加 `{ id: "zh", label: "简体中文" }`；新增完整 ZH 词典（约 540 条）；translateUiString 改为按语言词典分发（JA / ZH），未收录文案回退英文；3D 专业名词（strand / clump / braid / mesh / shader / UV / lattice / verts / tris 等）保留英文。
- **start-dev-server.cmd**：精简为一行 python 静态服务器启动，并自动在默认浏览器打开 http://127.0.0.1:8080/。

## Bug 修复 / Bug fixes

> 对齐 main 分支（原版本）：以下为原始版本中已存在的问题，本地适配中修复。新功能自身的实现问题不列入此节。

1. **拖入 .ahs 项目文件被当作参考图，drop 后被浏览器直接打开**
   - 问题（原版本存在）：.ahs 的 MIME 类型为空，被当成参考图，拖动一开始就切进 reference 编辑模式；drop 后因不是图片而未处理，浏览器直接打开文件（全是字符）。
   - 修复：拖放统一分发——拖动阶段不再切换编辑模式；drop 时按类型分发（.ahs → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略）。

2. **浮动面板指向旧头发；show points on mesh 不更新**
   - 问题（原版本存在）：Strand Profile / Width・Depth Curve 面板打开后切换选中头发，仍编辑旧头发；雕刻/移动后 3D 控制点停留在原地。
   - 修复：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新；`rebuildLockGeometry` 末尾按需刷新 `updateTaperMeshPoints()`。

## 修改型笔刷开发规范 / Modification brush dev spec

> 修改型笔刷（Move / Smooth 及未来的新笔刷）统一沿用 Move / Smooth 的现有架构：**单一 mask 装配 + 单一数据管线**，不在各笔刷内部各写遮罩判断。

- **架构约定（以 Move / Smooth 为模板）**
  - 入口：`beginSculptMoveStroke` → `sculptBrushUnits()`（唯一的 mask 装配器：可编辑 / 可见 / 可雕半空间 / 选择集，含镜像配对）→ `applySculptMoveStrokeSample`（操作分支）。
  - 状态：共用 `sculptMoveStroke`（units、snapshots、editedLockIds…）。
  - 写回统一走：`syncLockFromCurve → syncSculptBrushMirrorPoints → updateSculptBrushDebugCurve → queueSculptBrushGeometryUpdate`。
  - 新增修改型笔刷只做三件事：加入 `sculptBrushToolActive` 集合、在 `applySculptMoveStrokeSample` 增加操作分支、在 `sculptBrushStrengthByTool` 加默认强度。**不新增独立 mask / 数据代码**。
  - 可选收口（不强制）：`updateSculptBrushViabilityPlane` 复用 `sculptBrushUnits` 的同一谓词；mask 装配若继续扩展可抽成 `modules/brush-mask.js`。

- **反向 / 修饰快捷键约定（已决策）**
  - **Ctrl = 反向**（反向操作：如向根部滑动、缩小）。理由：Shift 已绑定"临时唤出 Smooth"；Alt+鼠标统一为导航（Houdini 模式），不再用于笔刷反向；放弃原版中 Ctrl 控制移动的用法。参考：Zbrush 用 Alt 反向、Houdini Paint SOP 用 Ctrl 反向，选 Ctrl。
  - Alt + 鼠标：统一导航（旋转 / 平移 / 缩放）。
  - Shift：临时唤出 Smooth 笔刷。
  - B：软选择（proportional editing），作为滑动 / 缩放笔刷的"软选范围"开关。

- **坐标系（three.js 右手系，Y 向上）**
  - 世界：Y 向上（camera.up = +Y）；原点 ≈ 头部中心，默认头模顶部 y≈0.05。
  - 发丝局部系（curveFrameAt，右手系）：y = 切线（根→尖）；z = up（剖面顶部/朝外，默认由世界原点径向投影到 ⊥切线，即远离头皮方向，可受表面法线影响）；x = 切线 × z（侧面）。
  - 镜像：沿 X 轴（-x, y, z）。
  - Push 沿 z（up）推离表面；Orient 目标 up = 指向相机方向在 ⊥切线平面的分量（顶部朝向观众），绕 y（切线）单轴旋转。

- **新笔刷（已实现）**
  1. **Sliding 笔刷**：把引导线控制点沿原曲线的 NURBS 轨迹滑动（非自由 3D 位移，这是与 Move 的区别）。
     - 影响范围：未软选 = 笔刷半径内控制点；软选 = 软选部分。
     - 方向：默认朝尖端方向（尖端一开始的方向无限延伸）；**Ctrl+左键 → 朝根部滑动**。
     - 点序不变。
  2. **Scale 笔刷（Scale / Cut·Extend 两种模式）**
     - **Scale 模式**：直接根缩放；或按末端方向伸缩。未软选从发根开始缩放；软选则从"软选最低点序再往前一个点"的位置开始缩放（注意根部判别）；按软选范围移动引导线；**点序不变**。
     - **Cut/Extend 模式**：沿原曲线 NURBS 轨迹滑动控制点（同 Sliding）；未软选 = 整根按当前等间隔比例（保留用户改过的间距）；软选 = 软选部分及其子引导点；末端沿初始方向无限延伸；**Ctrl+左键 → 向根部**。
     （已在 codex/brush-dev 实现：Slide Brush = sculpt-slide，Scale Brush = sculpt-scale，含 Scale / Cut·Extend 模式，Ctrl=反向；遵循上述统一架构。）
     （细化：Slide 按拖拽方向投影到原曲线切线滑动，约束持续实时计算；Cut/Extend 用累计偏移避免抖动；Scale 模式根侧点做头皮碰撞顶出；笔刷名称不汉化；ScaleMode 行仅在选中 Scale Brush 时显示。）
     （后续修正：Slide/Scale 完全移除软选择支持；Scale 与其他修改型笔刷一致不做头皮碰撞；撤销/重做后 Taper 网格控制点重新同步；number 输入框聚焦时 Ctrl+Z 可用。）
     （Ctrl+Z 失效修复：笔刷使用后焦点停在非文本控件（如面板 checkbox/radio）时 editingField 拦截了 Ctrl+Z；现所有非文本输入控件（select/input 非 text 类）都放行 Ctrl+Z/Y/D（blur 后走应用撤销），并在 setActiveTool 重置 historyShortcutHeld；文本输入框仍保留浏览器文本撤销。）
     （其它调整：Smooth 笔刷增加绕切线旋转（twist）平滑，不再只处理位置 P；Scale 默认强度 0.5；导航默认模式改为 Default，默认语言英文（左下角设置提示框已按需移除），日文下笔刷名翻译、中英保持英文；Preview 菜单的 Turntable 点击不关闭菜单可连续 toggle。）
     （新增 Push Brush = sculpt-push：沿本地竖直向上（与旋转同款法线逻辑）推离表面；Orient Brush = sculpt-orient：绕切线单轴旋转，把头发 up（顶部）逐渐转向「指向相机」方向（⊥切线平面分量）；均无需软选择、笔刷名不汉化。）

## 本地适配进度 / Local adaptation log

> 记录相对 main 分支（原版本）的适配改动。

- [x] 本地运行：Python 静态服务器启动脚本（start-dev-server.cmd，自动打开浏览器）
- [x] 文件保存：Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）
- [x] 拖放统一分发：任何文件拖拽接受并恢复原始浮动框视觉；drop 按类型分发（.ahs → 打开项目，图片 → 参考图，其他 → 忽略）
- [x] 雕刻笔刷选择遮罩：未选中只能雕刻可见头发，选中后只能雕刻选中头发
- [x] 材质面板：删除多余材质（剩余头发自动改回默认材质，默认材质不可删除）
- [x] 修复删除材质时误删发片：材质 outliner 重渲染后重新聚焦选中项，Delete 保持在材质上下文
- [x] 左侧大纲 / 右侧属性面板支持左右拖拽调宽（宽度持久化到 localStorage）
- [x] 滑杆数值框可随宽度变宽（minmax(56px,1fr)，滑杆占 2fr）
- [x] 浮动面板（Width/Depth Curve、Strand Profile）支持拖动、右下角缩放、右缘吸附到属性面板左侧
- [x] 底部笔刷栏自适应：空间窄隐藏 " Brush" 后缀，更窄只显示图标，不换行
- [x] 浮动面板：跟随选中头发；show points on mesh 随雕刻/移动更新
- [x] 视口导航模式：新增 Default / Houdini（默认 Houdini）；Houdini = Alt 左键旋转 / Alt 中键平移 / Alt 右键缩放（同时响应左右/上下并归一化），滚轮缩放保持
- [x] 语言：Settings Language 新增简体中文（保留 3D 专业名词）
- [x] devlog：维护开发规范 / JS 改动标注 / Bug 修复分类
- [x] devlog 记录修改型笔刷开发规范（沿用 Move/Smooth 架构；Ctrl=反向、Shift=临时 Smooth、B=软选）
- [x] devlog 记录许可证（source-available v1.2，非开源）与合规规范
- [x] 实现 Slide / Scale 修改型笔刷（sculpt-slide / sculpt-scale，Scale·Cut/Extend 模式，Ctrl=反向）
- [x] 笔刷细化：Slide 跟随拖拽方向（原曲线约束实时计算）、Cut/Extend 累计防抖、Scale 头皮碰撞、ScaleMode 仅缩放笔刷显示、笔刷名不汉化
- [x] 笔刷修正：移除软选择；Scale 不做头皮碰撞；撤销后 Taper 控制点重同步；number 输入框 Ctrl+Z 可用
- [x] 修复笔刷使用后 Ctrl+Z 失效（非文本控件放行快捷键 + setActiveTool 重置 historyShortcutHeld）
- [x] Smooth 增加 twist 平滑；Scale 默认强度 0.5；导航默认 Default；Turntable 菜单不关闭
- [x] ScaleMode 行仅 Scale Brush 显示
- [x] 新增 Push / Orient 修改型笔刷（sculpt-push 沿本地 up 推离；sculpt-orient 绕切线单轴旋转，up 转向视口正交方向）
- [x] v0.1.4 迁移：4 个自定义笔刷 / 简体中文 / Houdini 导航 / 浮动面板跟随 / Ctrl+S·Ctrl+Shift+S 保存全部迁移到 0.1.4 代码库（codex/branchdev_v0.1.4）
- [x] Houdini 导航并入 0.1.4 Navigation style（Anime Hair Studio / Blender / Houdini）
- [x] 拖放 / 雕刻选择遮罩改用 0.1.4 内置实现，移除旧重复代码
- [x] ZH 词典扩展覆盖 0.1.4 新增文案（约 107 条）
- [x] 新增 Quick Export（Ctrl+Alt+S）快速重复上一次导出
- [x] Quick Export 与原生导出兼容：完全复刻上次导出（格式 / 文件名 / 内容 / 目标），不再要求重新选择
- [x] 快捷键帮助「Local Adaptation」分区改名为「Sintaka Fork」
