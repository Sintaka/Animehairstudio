# Anime Hair Studio — Devlog 索引 / Devlog index

> 这是本地适配开发日志的**目录 / 指引字典**。详细内容已拆到各专题文件，按需读取，避免一次性加载全文。
> 新增改动时：把详细条目追加到对应专题文件，并可在下方「最近版本」更新一行。

## 本地运行 / How to run locally

> ⚠️ 不要用 `file://` 直接打开 `index.html`。请用静态服务器：

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

访问 <http://127.0.0.1:8080/>；或直接运行 `start-dev-server.cmd`。

## 字典 / Dictionary

| 主题 | 文件 |
|---|---|
| 开发规范 / 持续修改功能（本地适配清单）/ 许可证 | [development-standards.md](development-standards.md) |
| JS 改动标注（含子发片深度重置与桥接 2.1→2.5 系列） | [js-change-annotations.md](js-change-annotations.md) |
| Bug 修复 / 已知问题 | [bug-fixes.md](bug-fixes.md) |
| 修改型笔刷开发规范 | [brush-dev-spec.md](brush-dev-spec.md) |
| 本地适配进度 | [local-adaptation-log.md](local-adaptation-log.md) |
| 技术架构分析 & 复刻 DCC 参考 | [技术架构与复刻参考.md](技术架构与复刻参考.md) |

## 常用查找 / Quick lookup

- **子发片深度重置 / 桥接系列（2.1→2.5，含坐标方向规律、底部/侧面/顶部桥接、选区控制、width curve 联动、sweep 起点）**：js-change-annotations.md 中 `2.4q`~`2.5` 条目。
- **刘海（split 发丝）线框显示三角面修复**：bug-fixes.md #3。
- **快捷键 / 导出 / 笔刷 / 语言 / 导航**：js-change-annotations.md 顶部条目；修改型笔刷规范见 brush-dev-spec.md。
- **本地持久化功能（简体中文、Houdini 导航、Quick Save/Export 等）**：development-standards.md「持续修改功能」。

## 最近版本 / Latest

- Phase 2.15：Region 左右方向修正——回退面板 v 轴翻转（右后方视角下大 v=世界左本应在面板右侧），改修根骨骼 v 符号（0.5 - across/width），根拖动同步 + 选区对应主发片左右均正确；sweep 起点黄色手柄选中修复（stopImmediatePropagation + buttons 兜底）；桥接接缝边界顶点法线恢复父发片法线；版本 0.1.4-Sintaka.0.2.33（+ 扫掠沿长度翻转修复：分支子级锚定传输骨骼 up + authored twist，不再向退化法线 roll）。
- Phase 2.13：TransformMode 默认 object 并持久化；Branch Root Region 选区顺序归一化（点选不再跳变）；根滑动后选区面板/3D 标记跟随；选区宽度=1 支持（子环 1 宽 + 顶/底直接桥接）；版本 0.1.4-Sintaka.0.2.17（Phase 2.14 修正：上下桥接 smoothstep 双边法线，子环切端平滑衔接）。
