# 修改型笔刷开发规范

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## 修改型笔刷开发规范 / Modification brush dev spec

> 修改型笔刷（Move / Smooth 及未来的新笔刷）统一沿用 Move / Smooth 的现有架构：**单一 mask 装配 + 单一数据管线**，不在各笔刷内部各写遮罩判断。

- **架构约定（以 Move / Smooth 为模板）**
  - 入口：`beginSculptMoveStroke` → `sculptBrushUnits()`（唯一的 mask 装配器：可编辑 / 可见 / 可雕半空间 / 选择集，含镜像配对）→ `applySculptMoveStrokeSample`（操作分支）。
  - 状态：共用 `sculptMoveStroke`（units、snapshots、editedLockIds…）。
  - 写回统一走：`syncLockFromCurve → syncSculptBrushMirrorPoints → updateSculptBrushDebugCurve → queueSculptBrushGeometryUpdate`。
  - 新增修改型笔刷只做三件事：加入 `sculptBrushToolActive` 集合、在 `applySculptMoveStrokeSample` 增加操作分支、在 `sculptBrushStrengthByTool` 加默认强度。**不新增独立 mask / 数据代码**。
  - 可选收口（不强制）：`updateSculptBrushViabilityPlane` 复用 `sculptBrushUnits` 的同一谓词；mask 装配若继续扩展可抽成 `modules/brush-mask.js`。

- **反向 / 修饰快捷键约定（已决策）**
  - **Ctrl = 反向**（反向操作：如向根部滑动、缩小）。理由：Shift 已绑定"临时唤出 Smooth"；Alt+鼠标统一为导航（Houdini 模式），不再用于笔刷反向；放弃原版中 Ctrl 控制移动的用法。参考：Zbrush 用 Alt 反向、Houdini Paint SOP 用 Ctrl 反向，选 Ctrl。
  - Alt + 鼠标：统一导航（旋转 / 平移 / 缩放）。
  - Shift：临时唤出 Smooth 笔刷。
  - B：软选择（proportional editing），作为滑动 / 缩放笔刷的"软选范围"开关。

- **坐标系（three.js 右手系，Y 向上）**
  - 世界：Y 向上（camera.up = +Y）；原点 ≈ 头部中心，默认头模顶部 y≈0.05。
  - 发丝局部系（curveFrameAt，右手系）：y = 切线（根→尖）；z = up（剖面顶部/朝外，默认由世界原点径向投影到 ⊥切线，即远离头皮方向，可受表面法线影响）；x = 切线 × z（侧面）。
  - 镜像：沿 X 轴（-x, y, z）。
  - Push 沿 z（up）推离表面；Orient 目标 up = 指向相机方向在 ⊥切线平面的分量（顶部朝向观众），绕 y（切线）单轴旋转。

- **新笔刷（已实现）**
  1. **Sliding 笔刷**：把引导线控制点沿原曲线的 NURBS 轨迹滑动（非自由 3D 位移，这是与 Move 的区别）。
     - 影响范围：未软选 = 笔刷半径内控制点；软选 = 软选部分。
     - 方向：默认朝尖端方向（尖端一开始的方向无限延伸）；**Ctrl+左键 → 朝根部滑动**。
     - 点序不变。
  2. **Scale 笔刷（Scale / Cut·Extend 两种模式）**
     - **Scale 模式**：直接根缩放；或按末端方向伸缩。未软选从发根开始缩放；软选则从"软选最低点序再往前一个点"的位置开始缩放（注意根部判别）；按软选范围移动引导线；**点序不变**。
     - **Cut/Extend 模式**：沿原曲线 NURBS 轨迹滑动控制点（同 Sliding）；未软选 = 整根按当前等间隔比例（保留用户改过的间距）；软选 = 软选部分及其子引导点；末端沿初始方向无限延伸；**Ctrl+左键 → 向根部**。
     （已在 codex/brush-dev 实现：Slide Brush = sculpt-slide，Scale Brush = sculpt-scale，含 Scale / Cut·Extend 模式，Ctrl=反向；遵循上述统一架构。）
     （细化：Slide 按拖拽方向投影到原曲线切线滑动，约束持续实时计算；Cut/Extend 用累计偏移避免抖动；Scale 模式根侧点做头皮碰撞顶出；笔刷名称不汉化；ScaleMode 行仅在选中 Scale Brush 时显示。）
     （后续修正：Slide/Scale 完全移除软选择支持；Scale 与其他修改型笔刷一致不做头皮碰撞；撤销/重做后 Taper 网格控制点重新同步；number 输入框聚焦时 Ctrl+Z 可用。）
     （Ctrl+Z 失效修复：笔刷使用后焦点停在非文本控件（如面板 checkbox/radio）时 editingField 拦截了 Ctrl+Z；现所有非文本输入控件（select/input 非 text 类）都放行 Ctrl+Z/Y/D（blur 后走应用撤销），并在 setActiveTool 重置 historyShortcutHeld；文本输入框仍保留浏览器文本撤销。）
     （其它调整：Smooth 笔刷增加绕切线旋转（twist）平滑，不再只处理位置 P；Scale 默认强度 0.5；导航默认模式改为 Default，默认语言英文（左下角设置提示框已按需移除），日文下笔刷名翻译、中英保持英文；Preview 菜单的 Turntable 点击不关闭菜单可连续 toggle。）
     （新增 Push Brush = sculpt-push：沿本地竖直向上（与旋转同款法线逻辑）推离表面；Orient Brush = sculpt-orient：绕切线单轴旋转，把头发 up（顶部）逐渐转向「指向相机」方向（⊥切线平面分量）；均无需软选择、笔刷名不汉化。）
