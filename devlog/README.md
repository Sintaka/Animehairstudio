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

也可以直接运行仓库根目录下的启动脚本（自动调用上面的命令并打开浏览器）：

- `start-dev-server.cmd`（Windows 命令提示符）
- `start-dev-server.ps1`（Windows PowerShell）

## 本地适配进度 / Local adaptation log

> 记录后续针对本地开发环境做的适配改动。

- [x] 补充本说明文档
- [x] 增加基于 Python 的静态服务器启动脚本
- [x] File 菜单新增 **Quick Save (Ctrl+S)**，原 Save 改名 **Save as**
- [x] 雕刻笔刷（Move / Smooth）增加选择遮罩：未选中时只能雕刻可见头发；选中后只能雕刻选中头发
