# Panel Split 骨骼化重构计划：Split Spacing / Trim → split 子骨骼（统一骨骼模型 P1）

> 分支：0.2.58-panel-split-refactor；目标版本 `0.1.4-Sintaka.0.2.59`。本文件为 P1 **实施规范**（原 `panel-split-refactor-plan.md` 改写迁移至此）。
> **superseded**：旧提案的 `panelSegmentCurves`（每段曲线 override 数组）被 `lock.splitBones`（每段一个完整变换骨骼：P + orient + 段曲线）取代，不再单独实现。
> **✅ 已实现（0.2.59）**：P1 全部落地——`lock.splitBones` 数据/序列化/几何重铸（段内 u' + 每段曲线 + 相对 spread）/UI/视口段手柄/镜像段序，见 bone-system-roadmap.md §4.5；panel 尖端子骨骼（0.2.59 后续）见 panel-split-tip-bones.md §8.5–§8.9。下文 §3/§6 为实现规范，最终细节以代码为准。
> 相关函数/关键词：createPanelStrandGeometry、panelPoint、addPatch、splitOpening、panelSplitControlPoint、normalizePanelSplits、snapPanelSplitHeight、begin/update/endPanelSplitHandleDrag、changePanelSplitCount、syncPanelShapeInputs、lock.splitBones、bonesFor、0.2.55 addQuad 退化/反射跳过、0.2.58 crossover 根因（annotations-split.md 末条）

## 1. 现状与问题（摘要）

- Panel（Front Bangs）只有单主骨骼链 `lock.points` + 每点 `pointWidths/pointScales/pointTwists`；长度宽度曲线 `taperCurve(+secondary)+asymmetricWidthCurve`，厚度 `depthCurve(+secondary)+asymmetricDepthCurve`。
- Trim = `panelPoint` 内 `sampleT = t * (1 - edgeTrim)`：沿曲线向根部的**线性参数位移**（非缩放）。
- Split Spacing = `splitOpening` = `splitGap * smoothstep(...)`：u 空间**绝对加性位移**；相邻两 split 同时打开且 `2*splitGap>段 span` 时 tip 行 `uStart>uEnd` → u 反转 → 列序倒置 → quad 折叠交叉（Sussurro_v1_0044 Front Bangs 1 实测 span 0.367/gap 0.19 恰在 t=1 反转）。
- 决策：**抛弃** trim/gap 位移，**重铸**为按 split 段的**完整变换骨骼**（P/orient 可编辑 + 每段 Width/Depth 曲线），Split Spacing 改为**相对变换**（段 tip 由骨骼 P/orient 相对其根位置局部旋转/平移），根除 crossover。

## 2. 数据模型：lock.splitBones（新增持久化字段，混合策略）

- 每段一个骨骼（段数 = `panelSplits.length + 1`，段序：最左段 0 … 最右段 N），字段：
  ```
  { name: "split.<k>", parent: "main", parentParam: <t 沿主链>,
    p: {x,y,z}, orient: {x,y,z,w},
    taperCurve, taperCurveSecondary, depthCurve, depthCurveSecondary,
    asymmetricWidthCurve, asymmetricDepthCurve }
  ```
  曲线复用现有 `[{position,value,interpolation}]` 结构；缺省时逐字段回退 `lock.taperCurve/taperCurveSecondary/depthCurve/...`。
- 旧档无 `splitBones` → 由 `panelSplits` **派生默认骨骼**（p = 段中心在面板上取点，orient = 该点面板 frame，曲线 = 全局曲线引用），不写回存档、仅内存视图；用户编辑任一段后整体落盘 `splitBones`。
- normalize/clone 函数：`normalizeSplitBones(value, splits, lock)`、`cloneSplitBones(...)`；上限 24 段。
- 接入链路：app.js lock 序列化（~L16969-17088 附近）、快照恢复（~L18339-18463）、镜像复制（~L16767-16832，**段序左右反转** `i ↔ N-1-i` + 曲线 u 符号翻转）、draw-stroke/extension 复制（~L21766/L22405）、`panelCreationDefaults`（~L1258-1269）与 `syncPanelShapeInputs`（~L26234）。

## 3. 几何重铸（createPanelStrandGeometry，app.js L13445）

- 段内局部 `u'` 参数化：段 s 的 u 域 = `[boundary[s], boundary[s+1]]`（boundary 由 splits 排序 + ±1 派生），`u = lerp(boundary[s], boundary[s+1], (u'+1)/2)`；t 仍是全片长度参数 `row/lengthLoops`，所有段共享同一长度轴。
- 段宽度/厚度曲线：`panelWidthAt/panelThicknessAt` 改按段骨骼曲线采样（无 override 回退全局）。
- **Split Spacing → 相对变换**：删除绝对 `splitOpening`；每段根部（其 zipper 起点行）锚定在面板上，段内各行的宽度位置由该段骨骼的 P/orient 相对根位置做局部旋转/平移插值（`openingFraction ∈ [0,1)` 按段自身 span 比例钳制），恒 `uStart ≤ uEnd`。**每段尖端按比例收窄**（相对缩放），不再挤窄失真。
- 删除 `panelLeftEdgeTrim/panelRightEdgeTrim` 位移（`panelPoint` 不再消费 trim）；`panelSplitControlPoint`（L24332）同步去 trim、改读段骨骼，保证 zipper 手柄位置与几何一致。
- 保留（红线）：墙 quad `leftWallStartRow/rightWallStartRow = ceil((1-split.height)*lengthLoops)`、capStart/capEnd、`snapPanelSplitHeight` 吸附、`addQuad` 退化/反射折叠跳过（0.2.55）、`weldPanelGeometryData`、`smoothCoincidentPanelNormals`。

## 4. UI / 视口

- index.html L972-985：删除 Left Edge Trim / Right Edge Trim / Split Spacing 滑杆；Split Tip 区保留 Split Geometry / Snap Zippers to Loops / Zipper Controls。
- 新增 Segment 区：段选择器（左右箭头 / 点击 zipper 手柄选中相邻段）+ 每段 Width/Depth Curve 入口（复用 `taperCurveEditor` index.html L1843、`.shape-preset-select`）；全局 Width/Depth Curve 区保留为基底曲线。
- split 子骨骼 3D 手柄：每段一个可拖手柄（P 拖动 + orient 旋转，复用 transform gizmo / `taperMeshPoint` 机制）；编辑段 s 时在段表面显示控制点；`updateCurveObjects`/`rebuildCurveObjects` 绘制段边界线/手柄。
- 多选/镜像：`syncActiveMirror` 同步段骨骼（段序反转 + u 符号翻转）。
- 文案：新 UI 标签补齐 EN（loc-en 内嵌）/ JA（modules/data/loc-ja.js）/ ZH（modules/data/loc-zh.js）。

## 5. 迁移 / 向后兼容

- `panelSplits` 格式不变、完整保留；`panelSplitEnabled/panelSplitSnapToLoops/panelSplitHeight` 保留。
- `panelLeftEdgeTrim/panelRightEdgeTrim/panelSplitGap`：读取容错（`Number()` 兜底不崩），几何**忽略**（不再消费）；旧档视觉变化在版本说明声明。
- 无 `splitBones` 旧档 → 派生默认骨骼，行为 = 原 taper 曲线下的 split（无 trim/gap 效果）。

## 6. 实施步骤（每步独立 commit + verify-smoke 回归）

| 步骤 | 内容 | 阻塞 |
|---|---|---|
| P1a | `modules/geometry/bone-model.js`（bonesFor 只读视图）+ splitBones normalize/clone + 序列化/快照/镜像/stroke 链路（几何仍走旧路径，零行为变化） | 是 |
| P1b | createPanelStrandGeometry 重铸（段内 u' + 段骨骼曲线 + 相对变换 + 去 trim）；panelSplitControlPoint 同步 | 是 |
| P1c | UI：删 trim/gap 滑杆、段选择器 + 每段曲线入口、EN/JA/ZH | P1a 后可并行 |
| P1d | 视口：split 子骨骼手柄 P/orient 编辑 + 镜像段序 | P1b 后 |

## 7. 风险与红线

- zipper 水密拓扑红线（墙/端盖/吸附/退化跳过/焊接/法线平滑）必须保留。
- 不引入真实矩阵：旋转统一四元数；主链/子链 orient 派生不持久化。
- lattice/surface 面板（geometryType="surface"）零改动；panel 暂不支持桥接类子骨骼（范围外）。
- 遵循开发规范：最简化、复用 taperCurveEditor/transform gizmo、新文案 EN/JA/ZH、任务类型分支由主进程管理。