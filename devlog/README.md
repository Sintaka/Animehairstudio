# Anime Hair Studio — Devlog 索引 / Devlog index

> 这是本地适配开发日志的**目录 / 指引字典**。详细内容已拆到各专题文件，按需读取，避免一次性加载全文。
> 新增改动时：把详细条目追加到对应专题文件，并可在下方「最近版本」更新一行。

## 子发片底模（Low-poly child-strand base mesh）

![子发片底模](assets/lowpoly-child-strand-basemesh.png)

> 本 fork 支持 **low-poly 子发片拓扑**：父发片挖洞后，子发片通过低模水密桥接（父孔洞边界 → 子根环 → 顶/底带 + 侧面 quad）与父级衔接。截图是子发片底模部分；**UV 目前还未解决**。

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
| 函数索引（机器生成，函数名→行号→calls） | [FUNCTION_INDEX.md](FUNCTION_INDEX.md)（`node scripts/gen-function-index.js` 重新生成） |
| 全局状态登记表（机器生成，241 个 let 按 refs/子系统排序，阶段 3 地图） | [GLOBAL_LET_INVENTORY.md](GLOBAL_LET_INVENTORY.md)（`node scripts/gen-let-inventory.js` 重新生成） |
| 开发规范 / 持续修改功能（本地适配清单）/ 许可证 | [development-standards.md](development-standards.md) |
| JS 改动标注（索引 + 6 个子系统专题） | [js-change-annotations.md](js-change-annotations.md)（索引）+ [annotations-bridge.md](annotations-bridge.md) / [annotations-region-panel.md](annotations-region-panel.md) / [annotations-root-bone.md](annotations-root-bone.md) / [annotations-split.md](annotations-split.md) / [annotations-display-fixes.md](annotations-display-fixes.md) / [annotations-adapt.md](annotations-adapt.md) |
| Bug 修复 / 已知问题 | [bug-fixes.md](bug-fixes.md) |
| 修改型笔刷开发规范 | [brush-dev-spec.md](brush-dev-spec.md) |
| 本地适配进度 | [local-adaptation-log.md](local-adaptation-log.md) |
| 技术架构分析 & 复刻 DCC 参考 | [AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md](AnimeHairStudio_Tech_Architecture_and_DCC_Reference.md) |
| Main 同步冲突 / 决策记录（Local 选项移除、桥接区合并策略） | [main-sync-conflicts.md](main-sync-conflicts.md) |

## 常用查找 / Quick lookup

- **新 agent 上手**：先读 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（哪些代码必须保留 + 决策 + 关键函数名）。
- **子发片深度重置 / 桥接系列（2.1→2.5，含坐标方向规律、底部/侧面/顶部桥接、选区控制、width curve 联动、sweep 起点）**：annotations-bridge.md（几何/挖洞）+ annotations-region-panel.md（选区）+ annotations-root-bone.md（gizmo/twist）。
- **刘海 / 面板线框三角面修复**：annotations-display-fixes.md + bug-fixes.md #3/#4/#5。
- **快捷键 / 导出 / 笔刷 / 语言 / 导航**：js-change-annotations.md 顶部条目；修改型笔刷规范见 brush-dev-spec.md。
- **本地持久化功能（简体中文、Houdini 导航、Quick Save/Export 等）**：development-standards.md「持续修改功能」。

## 最近版本 / Latest

- Phase 2.17：子发片封面侧面 4 边面填充（分支 v0.1.4-Side-Topology，在 0.2.42 重写，无 smooth）——间接桥接（至少一条侧边留空）时从直接桥接向洞顶/底 1:1 填 quad 条带，利用 0.3 预留段无三角；版本 0.1.4-Sintaka.0.2.56（0.2.56：面板线框三角面真正修复——绕序翻转后同步交换 triangleEdgeMasks，quad 对角线不再描边。0.2.55：Front Bangs 1-3 视口三角观感修复——跳过退化/反射折叠 quad，最大二面角降至 ≤10.7°。0.2.54：刘海 split 父发片线框三角面修复——挖洞后同步裁剪 triangleEdgeMasks（显示问题，导出一直是四边面）。0.2.53：Sync L/R 默认调低到 0.45（上下仍 1.0）。0.2.52：Region 同步速度可调——Branch Root Region 面板新增 Sync L/R（默认0.45）/ Sync U/D（默认1.0）浮点+滑杆+重置；顺带排查过 H 拖根 2 倍速度问题（同步链路 split/普通父一致，未复现）。0.2.51：split 父发片支持子发片桥接（索引侧拼接——保留两管渲染，fused 网格 gridIndexAt/faceToRendered，非跨缝桥接干净、跨缝暴力粘）。0.2.49：父发片 Split Geometry 时子发片退回直接生成（无网格可挖洞则从根部扫掠，显式守卫 parentSupportsTopologyConnect）。0.2.48：合并 main（d3358f6）——移除三个 Local dev 选项统一用快速保存/导出；吸收马尾/复合发丝预设与 server.js；子发片桥接与 main 几何并存；sculpt 保留本地笔刷 + main preserve-tips。0.2.47：Branch Bridge 两参数改用标准 float+滑动条+重置按钮（range + setupEditableSliderControls 自动升级）；Region 面板按住中键即可平移查看（与 Alt+中键一致）。0.2.46：Region 面板缩放方向反转（右上放大/左下缩小）+ Alt+中键平移 + 滚轮缩放 + 手势按导航预设映射（不再照搬 Houdini）；Ctrl+drag 边点/角点反向镜像；Bridge Smooth 滑杆移到独立 Branch Bridge 面板并仅对子发片显示。0.2.45：桥接 Uniform Smooth（Strength+Detail，仅桥接部分、锚点固定）；Region 面板 Alt+右键局部缩放 + Reset Zoom；4 侧蓝色点不能越过橙色中心；4 角对角缩放。0.2.44：修复多行填充的 ringBase 索引偏移——洞侧中间顶点预推到环索引固定前，顶部桥接不再被扰乱）。
- Phase 2.16：删除子发片后父发片程序化补洞（重建父级重算挖洞）；直接桥接跟随 region 中心（rootRow=中心行，侧面桥接不再消失/顶底不多段）；region 中心橙色控制点（面板 + 3D）；恢复「Show points on mesh」开关并默认打开；根骨骼随用户 twist 1:1 旋转（种子含完整 pointTwists[0]，row0 直接用种子 frame）；版本 0.1.4-Sintaka.0.2.42（0.2.42：已选中骨骼后点击 gizmo 不再被附近骨骼抢选——gizmo 命中即优先。0.2.41：region 橙色中心改为稳定锚点——单边编辑不再移动中心/桥接，Ctrl+拖中心=两侧镜像缩放，面板加提示小字；gizmo 中心万向拾取半径恢复全尺寸。0.2.40：修复左右移动根骨骼后点别处蹦回主发片中心——captureBranchLocalState 保留 across；0.2.39 起：删除子发片补洞、直接桥接跟随 region 中心、橙色中心点、Show points 恢复、根部 twist 释放）。
- Phase 2.15：Region 左右方向修正——回退面板 v 轴翻转（右后方视角下大 v=世界左本应在面板右侧），改修根骨骼 v 符号（0.5 - across/width），根拖动同步 + 选区对应主发片左右均正确；sweep 起点黄色手柄选中修复（stopImmediatePropagation + buttons 兜底）；桥接接缝边界顶点法线恢复父发片法线；版本 0.1.4-Sintaka.0.2.38（根骨骼 gizmo 携带用户 twist：W 重进 move 不再回默认/偏移，根骨骼 up 跟随 gizmo；+ H 模式拖根 gizmo 热更新跟随扫掠，不再「扫掠自己扭」）。
- Phase 2.13：TransformMode 默认 object 并持久化；Branch Root Region 选区顺序归一化（点选不再跳变）；根滑动后选区面板/3D 标记跟随；选区宽度=1 支持（子环 1 宽 + 顶/底直接桥接）；版本 0.1.4-Sintaka.0.2.17（Phase 2.14 修正：上下桥接 smoothstep 双边法线，子环切端平滑衔接）。
