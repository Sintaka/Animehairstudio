# Bug 修复 / 已知问题

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

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
   - **补充（2.7 排查）**：线框掩码经 quad 重建法确认全部正确（split 发丝 572 quad 0 显示对角线、面板焊接保序）。
   - **0.2.56 已修复（真正根因）**：面板（三片大刘海 Front Bangs 1/2/3 及新拉 panel）线框/拓扑视图显示三角面，根因是 `createPanelStrandGeometry` 结尾绕序翻转（交换三角形 v1/v2）后**未同步交换 `triangleEdgeMasks`**，mask 错位导致 quad 对角线被描边；修复为翻转后同步交换 mask 的 [1]/[2]。附带 0.2.55 清理：`addQuad` 跳过退化（角点重合）与反射折叠（两三角法线点积 < -0.999）的零面积/翻折 quad。原版项目同样存在此问题。
- **0.2.55 排查确认（显示问题，非数据错误）**：Front Bangs 1/2/3 的 `quadFaces`/masks 均正确（maskLen==三角形数，线框不画对角线），OBJ/USDA 导出走 quadFaces 是四边面。三角观感来自面板 Split（拉链）开口处的**非平面折叠 wall quad**：GPU 把每个 quad 沿固定对角线拆成 2 个三角形，折叠 quad 两三角法线差异大（Front Bangs 1 有 16 个 120-180° 近完全折叠、Front Bangs 3 有 12 个 60-120°、Front Bangs 2 较轻微 3 个 ≤7°）→ 着色沿对角线出折痕。纯显示瑕疵，数据/导出/线框均正确；原版同样存在。后续若修：对折叠 quad 选「落在形内」的对角（把折痕变成刻意的折），或细分开口段使 wall quad 更平面。
