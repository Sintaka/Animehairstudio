# 开发规范 / 持续修改功能 / 许可证

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

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
- **版本号规范（2026-08 起）**：完整版本号格式 `0.1.4-Sintaka.0.2.<dailybuild>`（当前 `0.1.4-Sintaka.0.2.12`）。`0.1.4` 主版本**与上游保持对齐**（不随本地改动递增）；`Sintaka` 为本地 fork 标记；`0.2` 为分段版本号（功能迭代时更新）；末尾 dailybuild **可直接递增到 5 位数**（如 12 → 13 → … → 12345，分段版本号更新时清零）。版本号写入 `modules/app-config.js` 的 `APP_VERSION`，显示在顶栏与 Settings → Version。
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
