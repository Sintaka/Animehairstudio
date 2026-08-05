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

> 以 main 分支（原版本）为基准，记录本地适配的差别/新增功能。

- **app.js**
  - 新增 Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，浏览器不支持时回退原下载对话框；新增 `saveHairProjectQuickly` 覆盖保存到上次文件；全局 keydown 拦截 Ctrl+S / Ctrl+Shift+S（代替浏览器默认"保存网页"，原快捷键说明不改动，新增内容放在独立「Local Adaptation」分区）。
  - 雕刻笔刷选择遮罩：新增 `sculptBrushSelectionMask`；`sculptBrushUnits` / `updateSculptBrushViabilityPlane` 增加选择过滤（未选中 → 所有可见头发可雕刻；选中 → 仅选中头发可雕刻）。
  - 拖放统一分发：任何文件拖拽都接受，drop 时按类型分发（.ahs/.animehair.json/.json → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略并警告）；后续新增 geo / 附加模型等 drop 类型只需在 drop 分发处扩展。
  - 材质面板：新增删除材质（面板删除按钮 / Delete 键，焦点在材质面板时生效）；被删除材质的头发自动改回默认材质；默认材质不可删除。
  - 视口导航模式：新增偏好设置「Navigation mode」（Default / Houdini，默认 Houdini）；Houdini 模式 Alt+左键旋转（不变）、Alt+中键平移、Alt+右键拖拽缩放（同时响应水平+垂直位移，快速模长近似归一化，45° 对角 = 1 倍；方向右上放大、左下缩小），滚轮缩放保持；左下角导航提示随模式更新（Alt + Middle Mouse / Alt + Right Mouse）。
  - 浮动面板跟随选择：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新（见「Bug 修复」）。
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

## 本地适配进度 / Local adaptation log

> 记录相对 main 分支（原版本）的适配改动。

- [x] 本地运行：Python 静态服务器启动脚本（start-dev-server.cmd，自动打开浏览器）
- [x] 文件保存：Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）
- [x] 拖放统一分发：任何文件拖拽接受并恢复原始浮动框视觉；drop 按类型分发（.ahs → 打开项目，图片 → 参考图，其他 → 忽略）
- [x] 雕刻笔刷选择遮罩：未选中只能雕刻可见头发，选中后只能雕刻选中头发
- [x] 材质面板：删除多余材质（剩余头发自动改回默认材质，默认材质不可删除）
- [x] 浮动面板：跟随选中头发；show points on mesh 随雕刻/移动更新
- [x] 视口导航模式：新增 Default / Houdini（默认 Houdini）；Houdini = Alt 左键旋转 / Alt 中键平移 / Alt 右键缩放（同时响应左右/上下并归一化），滚轮缩放保持
- [x] 语言：Settings Language 新增简体中文（保留 3D 专业名词）
- [x] devlog：维护开发规范 / JS 改动标注 / Bug 修复分类
