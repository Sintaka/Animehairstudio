# Anime Hair Studio

[English](README_EN.md) | **中文（默认）**

**Anime Hair Studio** 是网页版动漫发片制作工具：在浏览器里直接绘制/雕刻 strand、braid、panel（3D 视口绘制/雕刻），支持头皮引导线、clump、材质、预设，以及 OBJ/USDA 导出。

本项目源自原作者 **Ludetools**（[github.com/Ludetools/Animehairstudio](https://github.com/Ludetools/Animehairstudio)），本仓库保留原作者 LICENSE 与捐赠链接；采用 source-available 许可，仅限个人/非商业用途。

## 本地部署（Python）

1. 安装 Python 3。
2. 在项目根目录运行：`python -m http.server 8080 --bind 127.0.0.1`。
3. 浏览器打开 `http://127.0.0.1:8080/`。
4. 或直接双击 `start-dev-server.cmd`（自动打开浏览器）。
5. 不要用 `file://` 直接打开 `index.html`（浏览器安全限制会阻止模块加载）。

## 本仓库新增功能（摘要）

- **简体中文 UI**（Settings → Language，3D 术语保留英文）
- **Panel Split 子骨骼 + 发尖子骨骼（tip sub-bone）**：每 split 段一个完整变换骨骼（P/orient/spread + 每段 Width/Depth 曲线）、视口 tip 链手柄/高亮/法线箭头、rotate/scale 挂 gizmo、发尖 WidthCurve（绿色控制点，左右独立、zipper 截断、Segment Spread 0–0.99、Reset 全 1）、每顶点蒙皮权重 [mainJoint, segment, weight] + USDA SkelBindingAPI 蒙皮
- **子发片**（低模水密桥接 + 父发片挖洞 + Region 选区 + 根骨骼 gizmo/twist/H 模式 + Bridge Smooth）
- **4 个自定义雕刻笔刷**（Slide / Scale·Cut-Extend / Push / Orient）+ Smooth twist；Ctrl=反向
- **快速保存/导出优化**：Ctrl+S 快速保存（记住最近项目文件句柄）、Ctrl+Shift+S 另存为、Ctrl+Alt+S 快速导出复刻上次导出（优先 File System Access API 直接写盘，避免下载 (1) 后缀）
- **Houdini 导航（默认）**：Alt+左键旋转 / Alt+中键平移 / Alt+右键缩放 / 滚轮缩放
- **S+左键拖动调节笔刷大小**（含雕刻笔刷）；Delete 删除多余材质；Ctrl+Z 撤销修复（非文本输入控件可用）
- **拖放 .ahs/.animehair.json 直接打开项目**；浮动面板跟随选中

## 发尖子骨骼（tip sub-bone）

![发尖子骨骼编辑](devlog/assets/tip-subbone-width-curve.png)

每个 split 段有独立发尖子骨骼；视口选中后显示发尖链手柄/高亮/法线箭头。绿色控制点是该段发尖的 WidthCurve，只影响当前发尖宽度，zipper 上半部分跟随主骨骼（不裂）；Segment Spread 控制尖端聚合 0–0.99（防退化面）；蒙皮权重按两侧 zipper 顶斜线分界，scale 笔刷不会把低 zipper 侧拉裂；旋转（E）/缩放（R）工具下挂变换 gizmo。

快捷键提示：

- **Alt + 左键**：快速切换选中到悬停的发尖子骨骼段（或悬停的发丝），不用先取消当前选中。
- **Ctrl + 左键拖动**（发尖绿色 WidthCurve 控制点）：非对称编辑——只调被拖的一侧；不加 Ctrl 默认等比镜像两侧。
- **Ctrl + 左键拖动**（其它地方）：特殊/反转功能——雕刻笔刷反向（Ctrl=反向）、选择工具 Ctrl+左键从选中移除。
- **快速保存优化**：Ctrl+S 快速保存到最近一次的项目文件（记住文件句柄，覆盖写同一文件）；Ctrl+Shift+S 另存为；Ctrl+Alt+S 快速导出复刻上次导出。
- **其它自定义快捷键**：S+左键拖动调笔刷大小、Houdini 导航（Alt+左/中/右键）、Delete 删多余材质、H 层级编辑（根骨骼工作流）、Ctrl+Z 撤销（含非文本输入控件）。

## 开发文档

- 新 agent 入门：[devlog/AGENT_QUICKSTART.md](devlog/AGENT_QUICKSTART.md)
- 完整 devlog 索引：[devlog/README.md](devlog/README.md)

## 许可说明

source-available（非 OSI 开源）许可：仅限个人/非商业用途；再分发须附带 LICENSE，并保留作者捐赠链接。
