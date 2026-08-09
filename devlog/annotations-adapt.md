# 日常适配（保存/导出、语言、导航、笔刷、拖放、材质、快捷键等）

> 由 devlog/js-change-annotations.md 拆分而来；入口见 devlog/README.md。

> 相关函数/关键词：saveHairProjectQuickly、exportHairProjectQuickly、File System Access API、localization.js、Navigation style、sculpt-brush.js、server.js、快捷键

> 说明：条目按子系统归类，同一开发阶段（2.x / Phase 2.15 等）的条目可能分散到多个文件，请按关键词跳读。

- **app.js**

  - 新增 Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，浏览器不支持时回退原下载对话框；新增 `saveHairProjectQuickly` 覆盖保存到上次文件；全局 keydown 拦截 Ctrl+S / Ctrl+Shift+S（代替浏览器默认"保存网页"，原快捷键说明不改动，新增内容放在独立「Local Adaptation」分区）。

  - 雕刻笔刷选择遮罩：新增 `sculptBrushSelectionMask`；`sculptBrushUnits` / `updateSculptBrushViabilityPlane` 增加选择过滤（未选中 → 所有可见头发可雕刻；选中 → 仅选中头发可雕刻）。

  - 拖放统一分发：任何文件拖拽都接受，drop 时按类型分发（.ahs/.animehair.json/.json → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略并警告）；后续新增 geo / 附加模型等 drop 类型只需在 drop 分发处扩展。

  - 材质面板：新增删除材质（面板删除按钮 / Delete 键，焦点在材质面板时生效）；被删除材质的头发自动改回默认材质；默认材质不可删除。

  - 视口导航模式：新增偏好设置「Navigation mode」（Default / Houdini，默认 Houdini）；Houdini 模式 Alt+左键旋转（不变）、Alt+中键平移、Alt+右键拖拽缩放（同时响应水平+垂直位移，快速模长近似归一化，45° 对角 = 1 倍；方向右上放大、左下缩小），滚轮缩放保持；左下角导航提示随模式更新（Alt + Middle Mouse / Alt + Right Mouse）。

  - 浮动面板跟随选择：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新（见「Bug 修复」）。

- **v0.1.4 迁移（codex/branchdev_v0.1.4）**：本地适配整体从旧 main 迁移到 0.1.4 代码库，功能保持一致，冲突与重复实现按 0.1.4 新架构收口。

  - 雕刻笔刷：Slide / Scale（Cut·Extend）/ Push / Orient 四个自定义笔刷接入 0.1.4 雕刻管线（`sculptBrushToolActive` / `sculptBrushStrengthByTool` / `beginSculptMoveStroke` Ctrl=反向 / `applySculptMoveStrokeSample` 新增分支）；Smooth 增加 twist 平滑（`smoothSculptTwistDeltas` 在 modules/sculpt/sculpt-brush.js）；ScaleMode 行仅 Scale 笔刷显示。

  - 导航：Houdini 并入 0.1.4 已有的 Navigation style（Anime Hair Studio / Blender / Houdini 三选一），不再用独立的 navigationMode；Houdini = Alt+左键旋转 / Alt+中键平移 / Alt+右键拖拽缩放（快速模长近似归一化，右上放大、左下缩小），滚轮缩放；导航提示与快捷键帮助随模式切换（`data-navigation-style-tip` / `data-navigation-style-shortcut` 行）。

  - 浮动面板跟随选择：`retargetFloatingStrandEditors()` 在 `selectLock` 时把打开的 Strand Profile / Width·Depth Curve 面板改指向最新选中的 strand 并刷新；`rebuildLockGeometry` / undo / redo 时刷新 Taper 网格控制点。保留浮动面板拖动 / 右下角缩放 / 右缘吸附属性面板左侧、左右面板宽度拖拽、底部笔刷栏自适应。

  - Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，回退原下载对话框；`saveHairProjectQuickly` 覆盖保存到上次文件；File 菜单新增两项并带快捷键提示（独立「Local Adaptation」分区）。

  - 拖放：采用 0.1.4 自带的应用文件拖放（.ahs/.obj → 确认对话框，图片 → 2D/3D 参考图），移除旧的自定义分发实现（`isProjectFile` / `dragContainsFiles`）。

  - 选择遮罩：0.1.4 已内置雕刻笔刷选择遮罩（`sculptBrushSelectionAllows`），移除 brush-dev 的重复实现 `sculptBrushSelectionMask`。

  - Ctrl+Z 修复迁移到 0.1.4 的 modules/core/shortcut-registry.js（`focusedControlShouldYieldToShortcut` 对所有非文本输入控件放行 Ctrl+Z/Y/D）；`setActiveTool` 重置 `historyShortcutHeld`。

  - 语言：ZH 词典扩展覆盖 0.1.4 新增文案（导航方式 / 相机平滑 / 最近项目 / 拖放项目确认 / 选择集 / 锁定 / 隔离等，3D 名词保留英文）；JA 补充新笔刷 / ScaleMode / 保存等词条；`translateUiString` 按语言词典分发（JA / ZH），未收录回退英文。

- **快捷导出（Ctrl+Alt+S）**：新增 `exportHairProjectQuickly`，完全复刻上一次导出（`lastExport`：格式 / 文件名 / 导出内容 / 本地标志）。普通导出与快捷导出都优先用 File System Access API 写盘（`writeExportThroughFileSystem`）并记住文件句柄 `quickExportFileHandle`，重复导出直接覆盖同一文件（不再用浏览器下载产生 `(1)` 后缀）；仅在不支持该 API 或取消选择时回退下载。从未导出时快捷导出回退到原导出对话框；File 菜单新增「Quick Export（Ctrl+Alt+S）」；快捷键帮助「Sintaka Fork」分区新增 Ctrl+Alt+S 行。

- **快捷键帮助分区改名**：「Local Adaptation」分区改名为「Sintaka Fork」（专用名词，不随语言翻译）。

- **分支层级解除限制**：`canBranchDrawFromLock` 不再要求 `!branchParentId`，分支可以从分支继续长出（真树结构，默认层级 1 视觉不变）；`updateBranchChildren` 递归更新整棵子树，父级移动会带动所有层级。

  - **main 合并（0.2.48，codex/branchdev_v0.1.4 ← main d3358f6）**：
    1) **移除三个 Local dev 选项**：Local Save / Local Export to OBJ / Local Export to USDA（原走 server.js 的 `/api/save-project` 本地服务）全部删除，保存/导出统一用快速保存（Ctrl+S）/ Save as（Ctrl+Shift+S）/ 快速导出（Ctrl+Alt+S）（File System Access API 直写盘、覆盖写同文件、无 `(1)` 后缀）；`server.js` 保留作静态文件服务，其保存端点成为死代码。
    2) **吸收 main 新预设**：`PONYTAIL_CLUMP_TEMPLATE`（马尾 clump，12 strands）与 `createCompoundStrandGeometry`（复合发丝，多控制器 + 控制器间桥接带）、`procedural-draw.js` 程序化分支模板、`modules/geometry/compound-strand.js`、`server.js`、`favicon.svg` 全部并入；`createHairGeometry` 重构为 `createBaseHairGeometry`（按 compound 分派）。
    3) **子发片桥接与 main 并存**：约 1000 行冲突实为同一插入点（`createConnectedCurveCardGeometry` 之后）各自新增——本地 `buildBranchBridgeGeometry`+`createBranchChildGeometry`（751 行）vs main `createCompoundStrandGeometry`（230 行），无功能重叠，两侧保留；`createHairGeometry` 入口先判 `lock.branchRootRegion` 走本地桥接，否则走 main 的 `createBaseHairGeometry`+程序化分支。子发片仍只支持单发丝默认预设（多发丝预设直接当子发片会有拓扑 bug，未做适配）。
    4) **sculpt 笔刷融合**：Move/Smooth 采用 main 的 preserve-tips 重构（`sculptBrushPreserveTipsByTool`、`#sculptPreserveTips` 重命名），本地新增的 Slide/Scale/Push/Orient 笔刷分支保留（`activeBrushSizeInput` 等仍走 `sculptBrushToolActive()` 超集）；Scale Mode 行保留。
    5) **材质双面判定**：合并为 `lock.branchRootRegion || strandUsesDoubleSidedMaterial(lock)`（覆盖子发片 + braid/poly/hairCard + compound），4 处调用点统一。验证（Sussurro_v1_0041，SL2/SL3）：子发片桥接 66 quads / 0 NaN（与基线一致）；普通发丝 `createBaseHairGeometry` 0 NaN；马尾预设存在（12 strands）；preserve-tips 按工具生效；App 启动 0 页面错误。

  - **TransformMode 持久化**：新增偏好键 `anime-hair-studio-transform-space`（默认 object=true）；`setObjectSpaceEditing` 写回 localStorage，启动 `setObjectSpaceEditing(objectSpaceEditing)` 应用存储值（不再强制 world）。旧版本无该键 → 默认 object，保持 localStorage 兼容。验证：切 world → 刷新仍是 world；默认加载为 object。

  - **体验**：TransformMode（O 快捷键）默认从 world 改为 object；Width/Depth Curve 的 Show Points on Mesh 默认打开（twist 除外）。

  - **devlog 整理**：README 拆成索引字典（约 2KB）+ 5 个专题文件（development-standards / js-change-annotations / bug-fixes / brush-dev-spec / local-adaptation-log），按需读取降 token。

- **笔刷大小快捷调节**：原有「S + 左键拖动」只作用于 Draw/Braid/Panel/Scalp 笔刷；现扩展到雕刻栏的修改型笔刷（Move/Smooth/Slide/Push/Scale/Orient）：`activeBrushSizeInput` 在雕刻笔刷下返回 `sculptBrushRadiusInput`，`beginSculptMoveStroke` 在按住 S 时让位给 `beginBrushSizeDrag`，拖动时同步刷新雕刻笔刷光标（`syncSculptBrushControls`）。 拖动过程中把笔刷光标固定在起点并隐藏系统鼠标指针，松开后恢复（大小仍按真实拖拽距离计算）。

- **Quick Save 记住打开的项目**：打开项目时（Open 菜单优先用 `showOpenFilePicker`、拖入优先用 `DataTransferItem.getAsFileSystemHandle`，均拿到可写 handle）把 `quickSaveFileHandle` / `quickSaveFileName` 记成该文件，Quick Save（Ctrl+S）直接覆盖写回、不再重新选择；拿不到 handle 的路径（文件选择框 / 旧浏览器）也会记住文件名，Save As 预填该名称。Quick Save 写盘前先 `requestPermission({mode:"readwrite"})`（打开的文件默认只读，首次授予后记住）。

- **index.html**：File 菜单新增 Quick Save（Ctrl+S）与 Save as（Ctrl+Shift+S）快捷键提示；快捷键帮助新增独立「Local Adaptation」分区。

- **modules/data/localization.js**：新增 "Save as"、"Quick Save"、"Quick Save the project"、"Local Adaptation" 的日语翻译（含导航模式：Navigation mode / Alt + Middle Mouse 等）。

  - 新增简体中文（zh）：SUPPORTED_LANGUAGES 增加 `{ id: "zh", label: "简体中文" }`；新增完整 ZH 词典（约 540 条）；translateUiString 改为按语言词典分发（JA / ZH），未收录文案回退英文；3D 专业名词（strand / clump / braid / mesh / shader / UV / lattice / verts / tris 等）保留英文。

- **start-dev-server.cmd**：精简为一行 python 静态服务器启动，并自动在默认浏览器打开 http://127.0.0.1:8080/。
