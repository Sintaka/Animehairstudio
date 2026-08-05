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

## JS 改动标注 / JS change annotations

> 记录与原有 JS 的差别/新增功能（对应「开发规范 - JS 改动标注」）。

- **app.js**
  - 新增 Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，浏览器不支持时回退原下载对话框；新增 `saveHairProjectQuickly` 覆盖保存到上次文件；全局 keydown 拦截 Ctrl+S / Ctrl+Shift+S（代替浏览器默认"保存网页"，原快捷键说明不改动，新增内容放在独立「Local Adaptation」分区）。
  - 雕刻笔刷选择遮罩：新增 `sculptBrushSelectionMask`；`sculptBrushUnits` / `updateSculptBrushViabilityPlane` 增加选择过滤（未选中 → 所有可见头发可雕刻；选中 → 仅选中头发可雕刻）。
  - 拖放统一分发（规范化）：新增 FILE_DROP_KINDS / classifyDroppedFile / ileDropKindFromDrag，按扩展名把拖入文件分为 project（.ahs/.animehair.json/.json）/ image / other；**所有文件拖拽都复用原参考图浮动框**（虚线框内的空白区域做判别：图片 → 2D/3D 参考图，项目文件 → 打开，其他 → 忽略并警告；内部 2D ref 快捷选项「前/后/左/右」保持不变），**拖动阶段不再进入 reference 编辑模式**；drop 阶段统一分发（project → openHairProjectFile，image → 添加参考图，其他 → 忽略），后续新增 geo / 附加模型等 drop 类型只需在 classifyDroppedFile 与 drop 分发处扩展。
  - 材质面板：新增删除材质（面板删除按钮 / Delete 键，焦点在材质面板时生效）；被删除材质的头发自动改回默认材质；默认材质不可删除。
  - 浮动面板跟随选择：Strand Profile / Width・Depth Curve 面板打开时切换选中头发，会自动改指向新选中的头发并刷新；show points on mesh 的控制点随雕刻/移动实时更新。
- **index.html**：File 菜单新增 Quick Save（Ctrl+S）与 Save as（Ctrl+Shift+S）快捷键提示；快捷键帮助新增独立「Local Adaptation」分区。
- **modules/localization.js**：新增 "Save as"、"Quick Save"、"Quick Save the project"、"Local Adaptation" 的日语翻译。
  - 新增简体中文（zh）：SUPPORTED_LANGUAGES 增加 `{ id: "zh", label: "简体中文" }`；新增完整 ZH 词典（约 540 条）；translateUiString 改为按语言词典分发（JA / ZH），未收录文案回退英文；3D 专业名词（strand / clump / braid / mesh / shader / UV / lattice / verts / tris 等）保留英文。
- **start-dev-server.cmd**：精简为一行 python 静态服务器启动，并自动在默认浏览器打开 http://127.0.0.1:8080/。

## 本地适配进度 / Local adaptation log

> 记录后续针对本地开发环境做的适配改动。

- [x] 补充本说明文档
- [x] 增加基于 Python 的静态服务器启动脚本
- [x] 在 devlog 中记录开发规范（代码最简化、仅必要注释、优先用已有预设/开源库、减少手搓半成品）
- [x] 在 devlog 中记录分支管理规范（禁止直接 merge 主分支、新功能独立开分支、由主进程处理合并与冲突）
- [x] 在 devlog 中记录 JS 改动标注与快捷键分区规范
- [x] 拖入 .ahs / 项目文件时执行 Open（不再当作参考图添加）
- [x] Save as 增加 Ctrl+Shift+S 快捷键
- [x] 启动脚本（cmd）自动在默认浏览器打开 8080
- [x] Settings Language 增加简体中文（保留 3D 专业名词）
- [x] 在 devlog 中记录：新增说明需添加现有语言支持
- [x] 规范化拖放处理：拖动阶段不再进入 reference 模式；drop 时统一分发（项目 / 参考图 / 其他）；复用原参考图浮动框，虚线内空白区域做判别
- [x] 材质面板支持删除多余材质（剩余头发自动改回默认材质，默认材质不可删除）
- [x] 修复浮动面板指向旧头发与 show points on mesh 不随雕刻/移动更新的问题
- [x] File 菜单新增 **Quick Save (Ctrl+S)**，原 Save 改名 **Save as**
- [x] 雕刻笔刷（Move / Smooth）增加选择遮罩：未选中时只能雕刻可见头发；选中后只能雕刻选中头发
