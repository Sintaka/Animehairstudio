# 刘海 / 面板线框三角面显示修复

> 由 devlog/js-change-annotations.md 拆分而来；入口见 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（新 agent 必读）；文档路由表见 [README.md](README.md)。

> 相关函数/关键词：triangleEdgeMasks、createPanelStrandGeometry、createSplitStrandGeometry、addQuad、authoredEdgeMasks、线框/三角面/对角线、0.2.54–0.2.56

> 说明：条目按子系统归类，同一开发阶段（2.x / Phase 2.15 等）的条目可能分散到多个文件，请按关键词跳读。

  - **排查：Front Bangs 1-3（面板/拉链）视口三角观感（0.2.55，无代码改动）**：三片大刘海在视口着色中沿 quad 对角线出折痕呈三角观感，但导出是四边面。确认是**显示（着色）问题，非数据错误**——`quadFaces`/`triangleEdgeMasks` 均正确（maskLen==三角形数，线框不画对角线），导出走 quadFaces。根因：面板 Split（Zipper）开口处的 wall quad 四角不共面（前/后壳在开口处被 splitOpening 横向错位 + camber + 帧扭转），GPU 按固定对角线拆 2 三角，折叠 quad 两三角法线差异大（0043 实测：Front Bangs 1 折叠 22/822（16 个 120-180° 近完全折叠）、Front Bangs 3 折叠 52/332（12 个 60-120°）、Front Bangs 2 仅 3 个 ≤7°）→ 着色折痕。原版同样存在（bug-fixes #3）。若修：折叠 quad 选「形内对角」或细分开口段。

  - **面板（Front Bangs / 新拉 panel）线框显示三角面的真正修复（0.2.56）**：0.2.55 的退化/反射折叠 quad 清理没有改善显示，重新分析发现真正的显示 bug 在 `createPanelStrandGeometry` 结尾的**绕序翻转**：`[indices[i+1], indices[i+2]] = [indices[i+2], indices[i+1]]` 交换了每个三角形的 v1/v2，但**没有同步交换 `triangleEdgeMasks`**——mask 的语义依赖顶点顺序（mask[i] 控制顶点 i 对边），翻转后 mask 错位，quad 的共享对角线被当成「真实边」描出 → 线框/拓扑叠加把所有 panel 显示成三角面（新旧面板都受影响）。修复：翻转后同步交换每个 mask 的 [1]/[2]（`[mask[1], mask[2]] = [mask[2], mask[1]]`）。验证（0043）：Front Bangs 1/2/3 的 quad 对角线描边数 `diagDrawn` 全部为 0（之前错位会画对角线）；masks 仍匹配、0 NaN、0 页面错误。0.2.55 的退化/反射折叠跳过保留（清理无用零面积面，属几何清理而非本显示 bug）。

  - **Front Bangs 1-3 视口三角观感修复（0.2.55，面板退化/反射折叠 quad）**：三片大刘海在视口着色中沿对角线出折痕呈三角观感（原版问题）。排查确认是**显示问题**（quadFaces/masks/导出均正确），根因是 Split（Zipper）开口壁/端盖在面板收尖处产生**退化 quad**：a) 角点重合的零面积 quad（Front Bangs 3 有 12 个，四角全同点）；b) **反射折叠** quad——两三角形近共面但法线相反（Front Bangs 1 有 16 个，二面角 179-180°，面片翻折回来）。修法：`createPanelStrandGeometry` 的 `addQuad` 跳过退化 quad（角点距离 <1e-10）与反射折叠 quad（两三角法线点积 < -0.999）。验证（0041/0043）：Front Bangs 1 822→806（去 16 反射折叠）、Front Bangs 3 332→320（去 12 全退化），三者最大二面角 180/90° → ≤10.7°（余下为正常曲率，不再有三角观感）；masks 仍匹配、0 NaN；全部子发片桥接回归正常；0 页面错误。导出去掉的无用零面积面，仍是四边面。

  - **刘海（split 父发片）线框显示三角面修复（0.2.54，分支 codex/bangs-triangle-fix）**：
    1) 现象/原因：刘海分叉（split 父发片被挖洞后，如 Side Bangs Left 1/Right 1）在 viewport 线框/拓扑视图里显示为三角面，但导出（OBJ/USDA 走 `quadFaces`）是四边面。根因是 `applyBranchRootRegionCarving` 挖洞后**没有同步裁剪 `triangleEdgeMasks`**——split 几何的 masks 按「每侧面 quad 2 条 + 端盖」顺序发射，挖洞删掉侧面 quad 后 masks 数组仍是旧长度（如 1180 vs 三角形 1174），`createHairTopologyGeometry` 按三角形序号读取时错位 → 挖洞区域之后的 quad 对角线被描边 → 看似三角。普通发丝无 authored masks（走 fallback）不受影响；面板（Front Bangs）masks 正常，其三角观感是既有的非平面折叠 quad 着色折痕（bug-fixes #3 已知问题，与本次无关）。
    2) 修复：`applyBranchRootRegionCarving` 重建索引/quadFaces 后同步裁剪 `triangleEdgeMasks`（按被删 face 去掉其 2 条侧面 mask，保留端盖 mask）。验证（0042）：Side Bangs Left 1/Right 1 挖洞后 maskLen==三角形数（1174/1174、1168/1168），线框不再画错误对角线；非挖洞 split（Left 2/Right 2）与面板 masks 不变；0041/0042 全部子发片桥接回归正常（bridgeVC 19/24、0 NaN、0 页面错误）。
    3) 影响评估：该问题**仅影响线框/拓扑显示**，几何索引与导出一直是四边面，不损害拓扑/导出/桥接；对后续「基于单发丝 split 建立多骨骼系统」无结构性影响，但挖洞必须同步裁剪 masks（本次已加），否则多骨骼父发片线框同样会显示三角。面板（Front Bangs）的着色折痕是独立问题（非平面折叠 quad），与 split/多骨骼无关。

> 相关：另见 annotations-split.md（split 父发片挖洞与 masks）。

  - **刘海排查（线框掩码确认正确）**：split 发丝（Side Bangs 1/2）572 个扫掠 quad 用 quad 重建法检查 0 个显示对角线；面板（Front Bangs 1/2/3）掩码经焊接保序、隐藏对角线。但面板在 Split 开口处有折叠 quad（Front Bangs 1 22 个、3 52 个，二面角最高 180°/90°）——着色沿对角线出折痕是"三角面"观感来源（split 开口设计，非线框 bug）。

> 相关：本条目属「子发片深度重置 2.7」阶段，其余条目见 annotations-bridge.md。
