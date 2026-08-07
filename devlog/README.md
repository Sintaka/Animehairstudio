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
- **版本号规范**：开发版本号采用语义化版本加 daily build，格式 `主版本.次版本.修订版-Sintaka.N`（如 `0.1.4-Sintaka.1`）。`N` 为 daily build 序号：每次构建直接 +1（可累加到 5 位数，如 `-Sintaka.12345`）；主版本号更新后清零重计。版本号写入 `modules/app-config.js` 的 `APP_VERSION`，显示在 Settings → Version。
- **Codex 子智能体**：适当的时候可以直接使用 Codex 子智能体（sub-agent）完成任务（如并行调研、独立的小改动等），无需用户每次手动提示。
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
| Ctrl+Z 修复 | 启用 | modules/shortcut-registry.js 对非文本输入控件放行 |
| start-dev-server.cmd 本地服务器 | 启用 | python -m http.server 8080 |
| 拖放统一分发 | deprecated | main 0.1.4 已有应用文件拖放确认对话框，本地实现已删除 |
| 雕刻笔刷选择遮罩 | deprecated | main 0.1.4 已有 sculptBrushSelectionAllows，本地实现已删除 |

> 新增本地功能时，应同步在本表补充一行，并说明其「启用 / deprecated」状态与依赖的 main 版本。

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
- **快捷导出（Ctrl+Alt+S）**：新增 `exportHairProjectQuickly`，完全复刻上一次导出（`lastExport`：格式 / 文件名 / 导出内容 / 本地标志）。普通导出与快捷导出都优先用 File System Access API 写盘（`writeExportThroughFileSystem`）并记住文件句柄 `quickExportFileHandle`，重复导出直接覆盖同一文件（不再用浏览器下载产生 `(1)` 后缀）；仅在不支持该 API 或取消选择时回退下载。从未导出时快捷导出回退到原导出对话框；File 菜单新增「Quick Export（Ctrl+Alt+S）」；快捷键帮助「Sintaka Fork」分区新增 Ctrl+Alt+S 行。
- **快捷键帮助分区改名**：「Local Adaptation」分区改名为「Sintaka Fork」（专用名词，不随语言翻译）。
- **分支层级解除限制**：`canBranchDrawFromLock` 不再要求 `!branchParentId`，分支可以从分支继续长出（真树结构，默认层级 1 视觉不变）；`updateBranchChildren` 递归更新整棵子树，父级移动会带动所有层级。
- **子发片深度重置 2.4k（2×1 截面 + 根部对齐 + 底部桥接）**：约定"2×1"=宽×高——子截面改为 2:1 矩形（halfDepth = halfWidth×0.5）；父洞保持 2×3（rows9-11×cols2-3）。根部对齐：子环 frame = 父 frame 绕侧轴（X）+90°（切线=父 up、环底部 -up 朝向父末端 +切线），子骨骼"转上来"。桥接只接子环底部（-up 侧 2 段）↔ 父洞底部（靠近父末端、横向 2 边）。验证：Side Left 3 = 223 顶点 / 210 quad，0 报错。
- **子发片深度重置 2.4l（桥接方向修正：洞 bottom 实为横向边）**：定位"桥接到父洞左侧"的根因——父发片剖面带折痕接缝（linear 控制点处有重合列 col3≡col4），holeBoundary 之前按**位置**去重把 10 个洞边界顶点坍缩成 8 个，side 布局错位，"bottom"被算成父洞左侧竖边（x≈-0.77），桥接因此拧到左侧。改为按**网格索引**去重（保留重合列），洞 bottom/top 恢复为横向 2 边、left/right 为竖边。验证：边界恢复 10 顶点；洞 bottom=row12 横向（y≈0.81，朝向父末端），子环 bottom=2×1 中边长 2 的横向侧（y≈0.88），桥接 2 quad（其中 1 个因折痕重合列为零面积不渲染），Side Left 3 = 223 顶点 / 210 quad，0 NaN，0 报错。已存 Sussurro_v1_0027.ahs 供目视确认；若方向仍反，只需把匹配侧从 bottom 换成 top。
- **子发片深度重置 2.4m（桥接另一段改接扫掠行0环 + 消除零面积碎面）**：① 桥接的另一端不再用原始根部（point0 埋在父发片里），改为**扫掠行 0 环**（guideT=0.1，即扫掠起始环），并且**直接复用扫掠顶点**（按索引引用，不再复制一份环），桥接与扫掠无缝衔接；② 洞边界**按位置折叠重合列**（折痕接缝的零长度边不再生成退化面，避免 shader 对零面积三角求 dFdx/fwidth 产生 NaN → 三角碎面）；③ 桥接父侧顶点法线/tangent 按网格索引读父几何的 tangent 属性（原来写死 (1,0,0)），uv/color 补齐；④ 桥接 quad 顺序与三角拆分改为与原发片 sweep 一致的 [a,c,d,b] / (a,c,b),(b,c,d)；⑤ 修复环侧索引偏移（ringStart），桥接正确引用环点 5/6/7（bottom 侧）。验证：Side Left 3 = 219 顶点 / 211 quadFace（2 桥接 quad + 1 接缝三角 + 208 扫掠），0 退化三角，0 NaN，0 零长度法线，maxIndex 218<219。已存 Sussurro_v1_0028.ahs 供目视确认。
- **子发片深度重置 2.4n（桥接 1:1 边映射 + 线框三角化修复）**：① 之前把洞 bottom 按位置折叠成 1 条边，子环两条边都接到同一条父边（扇形）→ 视觉上"都往左、右边空"。改为**保留 2 条网格边做 1:1 映射**：connectSide 检测零长度边（折痕接缝 col3≡col4），边界边坍缩成点时输出**三角面**（父洞左端折痕点 ↔ 子环左底边），实边输出 quad（父洞右侧实底边 ↔ 子环右底边）——不再有退化面、右边也接上了。② 子发片线框/拓扑显示"全三角化"根因：桥接索引被 unshift 到最前，把线框 overlay 的 `triangleIndex % 2` 交替 edgeMask 对齐打乱，每条 quad 的对角线都被描边。改为**扫掠索引在前、桥接索引追加到最后**（sweep 0..415 三角对齐交替掩码，cap/桥接按全边掩码）。验证：Side Left 3 = 220 顶点 / 1305 索引 / 210 quadFace（208 扫掠 + 1 桥接 quad + 1 接缝三角 + 16 cap），0 退化三角，0 NaN，maxIdx 219<220。已存 Sussurro_v1_0029.ahs 供目视确认。
- **子发片深度重置 2.4o（桥接 1:1 实边映射 + 洞边界改用真实网格列）**：用户指出父洞 bottom 还有一条边没用上、桥接仍有三角。根因：区域列(虚拟列 2-3)与父网格实际列不一致——折痕接缝(linear 控制点)让网格第 3 列没有任何面起始，挖洞实际删的是网格列 2 和 4（洞底暴露边延伸到 col5，多一条实边 c4→c5 从未被桥接）。修复：① branchRootRegionSurface 从父 quadFaces 算出跳过的网格列(skipCol)，colMin/colMax 改为**真实网格列**(2→4)，挖洞与洞边界一致；② 挖洞按 toGridCol 映射后再判断（删除结果不变，仍 6 面）；③ 桥接重新折叠相邻重合边界顶点——bottom 侧现在包含 col5，折叠后剩两条实边(c5→c4、c4→c2)，与子环 bottom 两条边 1:1 → **2 个 quad、0 三角**（子环右底边↔父洞右侧实底边 c4→c2，子环左底边↔父洞左侧实底边 c5→c4）。验证：洞边界 12 顶点，Side Left 3 = 220 顶点 / 1308 索引 / 210 quadFace（208 扫掠 + 2 桥接 quad + 16 cap），0 退化三角，0 NaN，maxIdx 219<220。已存 Sussurro_v1_0030.ahs 供目视确认。
- **子发片深度重置 2.4p（桥接显示为四边面：线框掩码 + 平滑法线）**：深挖"桥接部分是三角面"——几何本身是 2 quad，但① 线框 overlay 的 edgeMask 按 sideTriangleCount 交替分配，桥接三角形被追加到索引末尾落入 [1,1,1] 全边掩码，对角线被描边 → 看起来是三角；② 法线不一致：桥接父侧顶点用父法线（朝外）、环侧用子径向法线（朝内），沿 quad 对角线出现明暗接缝 → 渲染也像三角。对比原版发丝：原版也调用 computeVertexNormals 且线框靠 sideTriangleCount（扫掠在最前）。修复：createBranchChildGeometry 生成完整 triangleEdgeMasks（扫掠 [0,1,1]/[1,1,0]，cap [1,1,1]，桥接 quad [0,1,1]/[1,1,0]）+ geometry.computeVertexNormals()。验证：masks=436=三角形数，桥接末 4 掩码 [0,1,1],[1,1,0],[0,1,1],[1,1,0]，桥接顶点法线统一朝 -y（0 NaN / 0 零长度），0 退化三角。已存 Sussurro_v1_0031.ahs 供目视确认。
- **子发片深度重置 2.4q（2×1 截面 + 侧面直接桥接，验收完成）**：① 横截面环从"每边 2 段"（视觉 2×2）改回 **2×1**：6 点环（right-top/top-mid/left-top/left-bottom/bottom-mid/right-bottom，CCW），top/bottom 各 2 段（宽向）、left/right 各 1 段（高向）；② 桥接在 bottom（2 quad，1:1 实边映射）基础上新增**侧面直接桥接**：子环 left/right 各 1 段，顺着两侧拓扑各往下延伸 1 个 quad，接到父洞两侧边底部段（rowMax→rowMax+1，colMin / colMax+1），记录为「侧面直接桥接」与底部桥接区分。桥接 = 2 底 + 1 左 + 1 右 = **4 quad、0 三角**。验证：Side Left 3 = 170 顶点 / 996 索引 / 160 quadFace（156 扫掠 + 4 桥接 + cap fan），0 退化、0 NaN，masks=332 对齐。已存 Sussurro_v1_0032.ahs；**用户验收完成**（动态缩放 / 根骨骼旋转自适应更新正常）。
- **子发片深度重置 2.4r（侧面直接桥接方向修正 + 法线朝外）**：用户反馈新增的侧面桥接在主/子发片反了、出现交叉面片。根因：发带网格列在世界上与子环 left/right 相反（网格 col2 在世界 x≈-0.77 右侧、col5 在 x≈-0.87 左侧，而子环 left 在世界 x≈-0.95 最左、right 在 -0.79 最右），原来 left↔colMin、right↔colMax+1 是按网格名匹配 → 世界位置交叉。修正：left↔colMax+1（世界左侧）、right↔colMin（世界右侧），按世界侧匹配不再交叉；右面位于子曲线 +x 侧，绕序与左面相反，加 flip 翻转绕序使法线朝外（左面法线 -x/+z，右面法线 +x/-z，均背离子曲线中心）。验证：Side Left 3 = 170 顶点 / 996 索引 / 160 quadFace，0 退化、0 NaN，masks=332 对齐。已存 Sussurro_v1_0033.ahs 供目视确认。
- **[TEMP] 子发片桥接顶部补全（2.4s 计划，方向规律 + 三步走）**：方向规律（吸取底部/侧面教训）：
- **子发片深度重置 2.4s（顶部桥接完成：2src↔2dst + 中间分段 + smoothstep）**：按 2.4s 计划三步实现——① 子环 top 2 边 ↔ 洞 top 2 实边（(9,2)(9,3)(9,5)，折痕零边折叠），按世界侧右→左匹配不交叉（方向规律：与底部一样按位、与侧面一样按世界侧）；② 每条桥接列**中间加一行**（等比切分 t=0.5，新增段数=2-1，注释后续投影距离复杂侦测），2 列 × 2 行 = 4 quad；③ 中间行用 **smoothstep** 定位（smoothstep(0.5)=0.5 与等比一致，作为方向平滑框架，后续复杂拓扑再细化）。验证：Side Left 3 = 176 顶点 / 1020 索引 / 164 quadFace（156 扫掠 + 8 桥接 quad + cap fan），顶部 4 quad 法线 -x/+y（朝外），0 退化、0 NaN，masks=340 对齐。已存 Sussurro_v1_0034.ahs 供目视确认。
- **子发片深度重置 2.4s 更新（顶部桥接几何验收通过 + smoothstep 桥接圆滑细化）**：用户确认步骤 1-2 的**几何构建验收通过**（2src↔2dst + 中间分段，拓扑正确）。smoothstep 理解修正：不是**分段位置**（t 的等比），而是**桥接位置**的切线方向平滑过渡（DCC 的 bridge round/smooth 选项）——**中间新增的那一行要往法线负方向凹一点**，依据子发片与主发片两侧法线 + 桥接边位置，沿切线方向平滑过渡。实现：中间行在等比中点基础上，沿"桥接带法线的负方向"按桥接跨度比例位移（round factor，先固定写死，后续可加 control），形成内凹平滑桥接。
- **子发片深度重置 2.4s 更新（smoothstep 桥接圆滑实现）**：按用户修正实现——中间行在等比中点基础上沿**桥接带法线的负方向**位移（round factor=0.2×桥接跨度，先固定写死），使顶部桥接内凹平滑（DCC bridge-round）。验证：中间行位移 ~0.02-0.03（+x 内凹/-y/+z），顶部 4 quad 法线保持 -x/+y 朝外，0 退化、0 NaN。已存 Sussurro_v1_0035.ahs 供目视确认。
- **子发片深度重置 2.4t（侧面桥接收口：每侧 1 三角 + 1 四边）**：完成最后一步——填补顶部桥接与侧面直接桥接之间的剩余洞侧边。规律：**紧邻主发片 top 切边的第一个 poly 是三角形，其余依次是四边形**（矩形挖洞保证这一点）。实现：每侧新增 **1 个三角面 + 1 个四边面**——三角面填 top 切角（(9,c)→(10,c)→top 中间行角点），四边面接洞侧中间段（(10,c)→(11,c)→子环 top 角点→top 中间行角点）；左/右绕序对称（右面 flip），法线朝外（左 -x/+z、右 +x）。桥接 quad 数组现在含 3 顶点三角面，line-wire 掩码对三角面给 [1,1,1]。验证：Side Left 3 = 178 顶点 / 1038 索引 / 168 quadFace（156 扫掠 + 12 桥接面（2 底 + 2 侧直 + 4 顶 + 2 三角 + 2 四边）+ cap fan），0 退化、0 NaN，masks=346 对齐。已存 Sussurro_v1_0036.ahs 供目视确认。
- **[TEMP] 子发片桥接规律总结 + 下一步计划（2.4u）**：
- **子发片深度重置 2.4u（矩形选区控制器 + 子横向拓扑跟随洞口）**：实现 4 点矩形选区控制器——① 数据模型：branchRootRegion 抛弃中心点（新 region 只含 cross.up/down/left/right 4 点，旧文件带 center 兼容）；② 世界点：branchRootRegionWorldPoints 把 4 点吸附到父发片 geo 表层（区域边缘中点网格顶点）；③ 控制器：选中子发片时显示 4 个浅蓝选区点 + 1 个根骨骼点，拖拽时 raycast 父发片表面 → branchSurfaceParamAtWorld 求 (u,v) → setBranchRootRegionPoint 更新并重建/重挖；根骨骼沿父引导线滑动（u only，enforceBranchRootPosition，非 slide 笔刷）；④ 子横向拓扑：createBranchChildGeometry 的 halfWidth 改为由父孔洞横向切面世界跨度决定（region 左右边列距离/2），验证子环宽 0.089≈洞 0.09（原 0.16）。注：桥接 smoothstep 仍不理想、底部桥接按需拓展与侧面 3D 待后续。
- **子发片深度重置 2.4u 更新（控制器方向修正 + 小手柄默认显示）**：① 4 个选区点改**小手柄**（半径 0.02，同 width curve 点，非骨骼关节大）；② **默认直接显示**（不加开关，子发片可见即显示）；③ 横竖方向修正：默认 up=朝根部（较小 u）、down=朝尖端（较大 u）、left=较大 v（世界左）、right=较小 v（世界右），worldPoints 相应 up=rowMin/down=rowMax/left=colMax/right=colMin；branchRootRegionSurface 用 min/max 归一化，旧文件（pre-2.4u 顺序）也能得到正确矩形区域；④ 拖拽条件放宽（不再要求 strand 编辑模式，锁定不可拖）。
- **子发片深度重置 2.4u 更新（撤销修复 + 移除橙色点 + 根骨骼引导线滑动）**：① Ctrl+Z 修复——选区拖拽在**开始拖拽时 pushUndoState 一次**（整个拖拽为一次撤销操作），不再每次移动都 push（否则撤销会直接回到初始加载）；② 删除中间橙色根控制点，改用**子骨骼根部**作为 4 个浅蓝选区点的 parent；③ 根骨骼移动改为**沿父引导线 2D 平面平滑滑动**（enforceBranchRootPosition 从 points[0] 重算最近 guide 参数 u，再吸附到引导线曲线点）。④ 排查：刘海三角面问题经 2.4t worktree 对比确认**不是 2.4u 引入的回归**——Side Bangs Left 5/Right 4 的父级（Left 1/Right 1）是 split 发丝（无 grid），createBranchChildGeometry 一直返回 null（pre-2.4u 亦如此），刘海一直走普通发丝路径。
  - **桥接规律总结（已验收）**：底部按位（洞 bottom 左→右 ↔ 子环 bottom 左→右）；侧面/顶部按**世界侧**匹配（网格 left/right 在世界相反）；顶部 2src↔2dst + 中间分段 + smoothstep 内凹；侧面收口每侧 1 三角 + 1 四边（紧邻 top 切边为三角，其余四边）；法线均朝外。
  - **矩形选区控制器（本次做）**：5 点选区改 **4 点**（抛弃中心橙色 RootCtrl，仅保留 4 个十字浅蓝边界点）；4 点定义父发片表面矩形拓扑（u=沿长度、v=沿宽度），依据主发片走向选择，确保矩形；4 点是 parent→子骨骼 root 的选区控制，**吸附在父发片 geo 表层**；根骨骼控制沿**引导线**滑动（不是 slide 笔刷的多点扭曲逻辑）；子发片横向拓扑（2×1 的 2）直接由父孔洞横向切面决定。
  - **底部桥接按需拓展（后续）**：底部不再定死 2 quad，改成按需桥接操作——阈值：根骨骼附近直接探测，若拓扑对不上（超过 1 个面对不上，如 2×1 对 2×3，底部直接对上则上面有 2×2 面对不上）→ 触发分段桥接 + 额外拓扑操作。
  - **侧面 3D（暂不扩展）**：目前工作在切线二维方向，侧面 3D 扩展待想清楚。
  - **底部桥接（已验收）**：洞 bottom（row12，世界 左→右 c5→c2）↔ 子环 bottom（环点 5/6/7，世界 左→右），按位 1:1，折痕零边折叠。
  - **侧面直接桥接（2.4r 已修正）**：子环 left（世界左）↔ 父 colMax+1（世界左）、right（世界右）↔ colMin（世界右），按**世界侧**匹配（网格 left/right 在世界相反）；右面绕序 flip 朝外。
  - **顶部（本次三步）**：① 洞 top（row9，世界 右→左 col2→col5，折痕零边折叠成 2 实边）↔ 子环 top（环点 0/1/2，世界 右→左），2src↔2dst 直接桥接；② 对桥接边**分段**：观察洞侧面未桥接边数（每侧 2 段）→ 每条桥接边 1 段需增至 2 段（新增 1 段 = 中间等比切分，注释后续复杂侦测）；③ 上部 poly 走向从线性改 **smoothstep 平滑**，完成子→主桥接过渡。
  - 直接桥接概念：把子环边**直接投影**到主发片最接近的面/线段去匹配。
- **子发片深度重置 2.4v（2D 矩形选区编辑器 + 刘海线框三角修复）**：① 坏的 3D 选区手柄（选不中、拖不动）整体删除，改为类似 Width/Depth Curve 的 **2D u/v 平面编辑器**——新增 `#branchRegionEditor` dialog（SVG 画布 520×220，u=沿父发片长度、v=沿宽度）；4 个浅蓝选区点 **up/down 只改 u、left/right 只改 v**（默认位置横竖方向沿用 2.4u 修正：up=朝根部较小 u、down=朝尖端较大 u、left=较大 v 世界左、right=较小 v 世界右）；选中分支子级自动打开、选中普通发片自动关闭（`retargetBranchRegionEditor` 挂入 selectLock）；拖拽开始 `pushUndoState()` 一次（整个拖拽=一次撤销，不再退回初始加载）；Reset 按钮恢复默认区域；新增 CSS `.branch-region-rect`。② **修复 index.html dialog 嵌套 bug**：branchRegionEditor 之前误插在 taperCurveEditor 内并吃掉它的闭合标签，导致其后所有 dialog（UV Inspector / Save / 预设等）全部嵌套进 taperCurveEditor、0 尺寸不可见——已恢复为 BODY 顶级并列，各面板回归正常。③ 刘海 split 发丝线框三角修复见「Bug 修复」。

- **[TEMP] 子发片桥接基础版小结（2.4a→2.4q，验收完成，后续补动态补全）**：当前桥接 = **底部（2 quad）+ 侧面直接桥接（左/右各 1 quad）**，共 4 quad、0 三角（后续补 top 侧 + 动态补全）。约定与注意事项：
  - **src（父侧）与 dst（子侧）**：src = 父发片洞边界（holeBoundary，12 顶点，含折痕列），dst = 子发片扫掠行 0 环（guideT=0.1，**6 点 2×1 环**，**直接复用扫掠顶点**，按索引引用）；桥接 = **bottom（2 quad，1:1 实边）+ 侧面直接桥接（left/right 各 1 quad）**。
  - **坐标方向**：① 洞 bottom = rowMax+1（朝父末端、横向，2 条实边 c2→c3 / c4→c5），top = rowMin，left/right = 竖向；② 子环 bottom = 环点 3/4/5（local z=-hd，宽向 2 段），top = 0/1/2，left = 2/3、right = 5/0（高向 1 段）；③ 匹配方向：src 与 dst 都按同一方向（左→右 / 上→下）排列后按位 1:1（父左实边↔环左底边、父右实边↔环右底边、父侧边底部段↔环左/右侧），不会交叉。
  - **折痕接缝（关键坑）**：linear 控制点让网格某列（col3≡col4）没有任何面起始 → 区域列是"虚拟列"，必须从父 quadFaces 推导 skipCol 映射到真实网格列；挖洞实际删的是 col2 和 col4，洞底暴露边延伸到 col5（两条实边）。
  - **数据一致**：桥接父侧顶点读父几何 normal/tangent（按网格索引）；环侧复用扫掠顶点（含 uv/color/tangent）；**扫掠索引在前、桥接索引在后**，线框用 triangleEdgeMasks（每 quad [0,1,1],[1,1,0]），法线用 computeVertexNormals（与原版发丝一致），否则桥接会显示成三角面。
  - 验证基线：Side Left 3 = 170 顶点 / 996 索引 / 160 quadFace（156 扫掠 + 4 桥接 quad + cap fan），0 退化、0 NaN。文件 Sussurro_v1_0032.ahs。
- **子发片深度重置 2.4i（扫掠起始归一化）**：子发片扫掠不再从根部开始，改为从引导线参数 0.1（写死）到 1.0，归一化回 [0,1] 扫掠；[0,0.1] 根部段留给桥接/连接。验证：Side Left 3 = 223 顶点 / 210 quad（2 桥接 + 208 扫掠 + 端盖），首环 y≈0.88（非根部 0.92），0 报错。
- **子发片深度重置 2.4h（规范化：1×2 区域 + 底部单侧桥接）**：按用户规范化思路——① 区域改为 1×2（up/down=0 → 1 行，左右 2 列）；② 取消根部偏移（applyBranchRootOffset 禁用），RootControl 环对齐父引导线（父级 frame at 附着参数），扫掠偏移暂时归 0；③ 桥接只处理 bottom 侧（2 边 ↔ 子环 2 段），其它三侧先不接。验证：Side Left 3 = 223 顶点 / 210 quad（2 桥接 + 208 扫掠 + 端盖），洞=row10×cols2-3，0 报错。
- **子发片深度重置 2.4g（桥接注意事项 + 重试桥接）**：注意事项——子骨骼根部有 end-cap（截面三角 fan），启用桥接后必须去掉根部 cap（由桥接填充），只保留尖端 cap。桥接重新接入：marching 缝合（quad+接缝三角），桥接顶点法线取父级表面法线（按网格索引查父几何 normal 属性）、环顶点法线取径向；环朝向用父级表面 frame（区域中心）以对齐洞的四边。验证：Side Left 3 = 243 顶点 / 222 quad（12 桥接 quad + 2 接缝三角 + 208 扫掠 + 端盖），根部 cap 已去掉，0 报错。
- **子发片深度重置 2.4f（子几何复刻原版 sweep，定位 shader 碎裂）**：对比原版发丝构建后确认差异——原版用**径向法线**（normals=ring 向量）+ **tangent** + **端盖 cap 三角**，而我的子几何用了 computeVertexNormals 平滑法线且缺 tangent/cap。子几何改为逐行复刻原版（径向法线 + tangent + 端盖，仅剖面换成 8 点方形环）。验证：Side Left 3 = 218 顶点 / 208 quad + 16 cap 三角 / 1296 索引，shader=anime-anisotropic，DoubleSide，0 报错。
- **子发片深度重置 2.4e（暂停对接，隔离子骨骼扫掠渲染）**：对接模块暂时禁用（BRANCH_CONNECTION_ENABLED=false，怀疑对接扰乱了点序/索引导致显示异常），子骨骼先只保留方形环扫掠（1.5 poly 前移偏移、末端归 0）。验证：Side Left 3 = 216 顶点 / 208 quad / 1248 索引，DoubleSide，零长度法线 0，0 报错。待确认扫掠渲染正常后再重新接入对接。
- **子发片深度重置 2.4d（对接改为 marching 缝合）**：连接模块弃用"顶点坍缩"（会产生退化/扭曲 quad），改为逐侧 marching——段数相同纯 quad，段数不同在接缝处插少量三角面（每个错配侧 1 个）；修复 Infinity<=Infinity 死循环并加迭代上限。验证：Side Left 3 = 242 顶点 / 220 quad + 2 三角（12 对接 + 208 扫掠），DoubleSide，0 报错。8 边对 10 边复杂场景可完成对接。
- **子发片深度重置 2.4c（显示/偏移/补全修正）**：① 扫掠起点偏移改为 1.5 个 poly 宽度（子级曲线长度/段数，写死，后续接 control）；② 分支子级网格强制 DoubleSide（避免 quad 两三角形绕序不一致导致的半三角缺面；高亮与主 shader 不再互不补）；③ 根部方形环朝向改用父级表面 frame（区域中心），让方形环贴合洞的方向，补全按当前 orient 近似。验证：Side Left 3 242 顶点 / 216 quad，materialSide=DoubleSide，0 报错。连接条带细节后续迭代。
- **子发片深度重置 2.4b（子几何显示修复 + 扫掠偏移）**：分支子级几何补齐 uv / color 属性（anime 各向异性是裸 ShaderMaterial，缺属性导致每 quad 只渲染一半三角形）+ 法线零长度兜底；扫掠起点沿子级切线前移（branchSweepOffset，默认 0.08）并随 t 平滑过渡到末端 0，为对接留出空间。验证：Side Left 3 242 顶点 / 216 quad，position/normal/uv/color 齐全 0 NaN，0 报错。对接条带（10→8）后续再修。
- **子发片深度重置 2.4a（对接框架）**：新增 modules/branch-connect.js —— 方形横截面环（4 面×2 段=8 点 8 段）、父级洞边界提取（10 段，含各边段数）、逐侧对接（段数多的一侧做顶点坍缩，只出 quad 不出三角面）。分支子级几何改用 createBranchChildGeometry：父洞边界(10) → 方形环(8) 对接条带 + 方形环沿子级曲线扫掠。验证：Side Left 3 拓扑 242 顶点 / 216 quad（8 对接 + 26×8 扫掠），0 报错；拓扑框架已就绪，视觉细节后续迭代。
- **子发片深度重置 2.2b（挖洞索引修复）**：挖洞改为只删除对应面片的 6 个索引，保留两端封口三角形与原作者法线（不再 computeVertexNormals 覆盖），并同步更新 sideTriangleCount，避免 shader/高亮因索引与法线不一致而只渲染每 quad 一半三角形。验证：Side Left 2 index 1584 = 254 面×6 + 60 封口，maxIndex 298，quadFaces 254。
- **子发片深度重置 2.2（程序化挖洞 + 根部偏移）**：.ahs 只存引导参数、加载时程序化重建网格，因此挖洞做成数据驱动、每次重建时重放——父级（有分支子级的发带/发片）按子级 branchRootRegion 的 (u,v) 区域把 quad 网格对应面片删除（面映射按 quadFaces 数组行列位置，兼容剖面缺边/闭合 wrap）；区域默认「左侧 2 格宽 × 上 2 行下 1 行」（BRANCH_ROOT_REGION_DEFAULTS，centerV=0.25）。子级根部（points[0]）偏移到区域中心（applyBranchRootOffset）。恢复存档后统一跑一遍挖洞+偏移（restoreSceneCollectionsForStateRestore）。验证：Sussurro v0012 的 Side Left 2 面数 260→254（删 6 面），Side Left 3 根部已偏移。
- **子发片深度重置 2.1b**：恢复旧存档时，有 branchParentId 但缺 branchRootRegion 的分支子级自动回填根区域（branchRootRegionFromParam）；几何生成器（发带/发片 sweep）输出 gridRows/gridColumns；新增 branchRootRegionSurface() 把 (u,v) 区域映射到父级 quad 网格的 row/col 范围（仅控制点改动时重算，父级移动不碰）。验证：Sussurro v0012 的 Side Left 3 加载后自动获得 region，父级网格 27×11。
- **子发片深度重置 2.1（数据模型）**：子 lock 新增 branchRootRegion（5 个控制点：Center Root 橙色 / 4 个浅蓝十字点，全部用父级毛发表面 (u,v) 参数表达，u=长度、v=宽度）；attachDrawnLocksAsBranches 创建时按附着参数初始化（center=附着点+宽度中线，十字点 ±默认偏移）；快照/恢复/镜像/detach 全链路支持；可选字段，旧版本忽略、旧文件读取为空，保持 .ahs 兼容。表面索引缓存与挖洞/接入几何在 2.2 实现。
- **笔刷大小快捷调节**：原有「S + 左键拖动」只作用于 Draw/Braid/Panel/Scalp 笔刷；现扩展到雕刻栏的修改型笔刷（Move/Smooth/Slide/Push/Scale/Orient）：`activeBrushSizeInput` 在雕刻笔刷下返回 `sculptBrushRadiusInput`，`beginSculptMoveStroke` 在按住 S 时让位给 `beginBrushSizeDrag`，拖动时同步刷新雕刻笔刷光标（`syncSculptBrushControls`）。 拖动过程中把笔刷光标固定在起点并隐藏系统鼠标指针，松开后恢复（大小仍按真实拖拽距离计算）。
- **Quick Save 记住打开的项目**：打开项目时（Open 菜单优先用 `showOpenFilePicker`、拖入优先用 `DataTransferItem.getAsFileSystemHandle`，均拿到可写 handle）把 `quickSaveFileHandle` / `quickSaveFileName` 记成该文件，Quick Save（Ctrl+S）直接覆盖写回、不再重新选择；拿不到 handle 的路径（文件选择框 / 旧浏览器）也会记住文件名，Save As 预填该名称。Quick Save 写盘前先 `requestPermission({mode:"readwrite"})`（打开的文件默认只读，首次授予后记住）。
- **index.html**：File 菜单新增 Quick Save（Ctrl+S）与 Save as（Ctrl+Shift+S）快捷键提示；快捷键帮助新增独立「Local Adaptation」分区。
- **modules/localization.js**：新增 "Save as"、"Quick Save"、"Quick Save the project"、"Local Adaptation" 的日语翻译（含导航模式：Navigation mode / Alt + Middle Mouse 等）。
  - 新增简体中文（zh）：SUPPORTED_LANGUAGES 增加 `{ id: "zh", label: "简体中文" }`；新增完整 ZH 词典（约 540 条）；translateUiString 改为按语言词典分发（JA / ZH），未收录文案回退英文；3D 专业名词（strand / clump / braid / mesh / shader / UV / lattice / verts / tris 等）保留英文。
- **start-dev-server.cmd**：精简为一行 python 静态服务器启动，并自动在默认浏览器打开 http://127.0.0.1:8080/。

## 已知问题 / Known issues

- 拖入文件时浮动 UI 不出现（drop 悬浮提示失效）：待修复（迁移到 main 的拖放处理后在部分情况下不再显示悬浮层）。
## Bug 修复 / Bug fixes

> 对齐 main 分支（原版本）：以下为原始版本中已存在的问题，本地适配中修复。新功能自身的实现问题不列入此节。

1. **拖入 .ahs 项目文件被当作参考图，drop 后被浏览器直接打开**
   - 问题（原版本存在）：.ahs 的 MIME 类型为空，被当成参考图，拖动一开始就切进 reference 编辑模式；drop 后因不是图片而未处理，浏览器直接打开文件（全是字符）。
   - 修复：拖放统一分发——拖动阶段不再切换编辑模式；drop 时按类型分发（.ahs → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略）。

2. **浮动面板指向旧头发；show points on mesh 不更新**
   - 问题（原版本存在）：Strand Profile / Width・Depth Curve 面板打开后切换选中头发，仍编辑旧头发；雕刻/移动后 3D 控制点停留在原地。
   - 修复：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新；`rebuildLockGeometry` 末尾按需刷新 `updateTaperMeshPoints()`。

3. **刘海（split 发丝）线框显示三角面**
   - 问题（原版本存在）：split 发丝（如 Side Bangs Left/Right 1/2）线框/拓扑模式下最后 7~11 个 quad 显示成两个三角。
   - 根因：createHairTopologyGeometry 按三角形序号分配边掩码，假设索引流是 [扫掠][端盖]；createSplitStrandGeometry 实际是两段 [s0扫掠][s0端盖][s1扫掠][s1端盖]，sideTriangleCount 只统计扫掠，第二段扫掠末尾落入 [1,1,1] 全边掩码，quad 对角线被描边 → 看似三角。
   - 修复：createSplitStrandGeometry 生成 authored triangleEdgeMasks（扫掠交替 [0,1,1]/[1,1,0]，端盖 [1,1,1]），createHairTopologyGeometry 优先读 authoredEdgeMasks（原有分支子级已用同机制）。验证：所有 split 刘海 maskCount === 三角形数（如 1180/1180），0 个 quad 画对角线。

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
- [x] 导出改用 File System Access API 写盘（支持时），快捷导出覆盖同一文件，不再产生 (1) 后缀；仅回退下载
- [x] S+左键拖动笔刷大小扩展到雕刻修改型笔刷（Move/Smooth/Slide/Push/Scale/Orient）
- [x] 拖动调笔刷大小时鼠标指针固定在起点（隐藏系统指针），松开后恢复
- [x] Quick Save 记住打开的项目文件（Open/拖入可拿到 handle 时直接覆盖写回，无需再选）
- [x] 快捷键帮助「Local Adaptation」分区改名为「Sintaka Fork」

- [x] 子发片选区控制重写：3D 手柄 → 2D u/v 平面编辑器（4 点，up/down 改 u、left/right 改 v，选中自动开关，整次拖拽=一次撤销）
- [x] 修复刘海（split 发丝）线框三角面：createSplitStrandGeometry 生成 authored edgeMask，0 对角线
- [x] 修复 index.html dialog 嵌套 bug（branchRegionEditor 吃掉 taperCurveEditor 闭合标签，后续 dialog 全部 0 尺寸）
