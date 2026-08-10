# Panel Split 重构计划：抛弃 Trim/Split Spacing 位移，改为按 split 段的独立 WidthCurve 系统

> 分支：0.2.58-panel-split-refactor；目标版本 `0.1.4-Sintaka.0.2.58`。本文件为**调研 + 计划**，不含代码改动。
> 相关函数/关键词：createPanelStrandGeometry、panelPoint、addPatch、splitOpening、panelSplitControlPoint、normalizePanelSplits、snapPanelSplitHeight、begin/update/endPanelSplitHandleDrag、changePanelSplitCount、syncPanelShapeInputs、panelSplits、panelSegmentCurves、0.2.55 addQuad 退化/反射跳过、0.2.58 crossover 根因（见 annotations-split.md 末条）
> 说明：实施完成后按 devlog 规范在 annotations-split.md / js-change-annotations.md 追加条目，并更新 devlog/README.md「最近版本」与本地适配清单。

## 1. 现状与问题

- **单主骨骼链**：Panel（Front Bangs）只有 `lock.points`（6-8 控制点）+ 每点 `pointWidths/pointScales/pointTwists`；长度方向宽度曲线 = `taperCurve`(+`taperCurveSecondary`)+`asymmetricWidthCurve`（`panelWidthAt` app.js L13513），厚度曲线 = `depthCurve`(+`depthCurveSecondary`)+`asymmetricDepthCurve`（L13522）。无隐藏多骨骼——`bones` 只出现在导出选项（app.js L2775 `#exportIncludeBones`）。
- **Trim = 参数位移**：`panelPoint`（L13569）`edgeTrim = lerp(leftEdgeTrim, rightEdgeTrim, (u+1)*0.5)`，`sampleT = clamp(t*(1-edgeTrim), 0, 1)`（L13570-13571）→ 沿曲线向根部的**线性参数位移**，不是缩放；左右 trim 差大时 tip 端盖倾斜、与 taper 叠加易剪穿。
- **Split Spacing = 绝对位移 → crossover**：`splitOpening(split,row)`（L13626）= `splitGap * smoothstep((t-start)/(1-start), 0, 1)`（`start = 1 - split.height`），是 u 空间的**绝对加性位移**；段边界 `uStart = leftSplit.position + opening`（L13650）、`uEnd = rightSplit.position - opening`（L13653），`addPatch` 内 `u = lerp(uStart(row), uEnd(row), column/columns)`（L13582）。
- **crossover 根因**：opening 是绝对位移而非相对缩放。当相邻两 split 同时打开且 `2 * splitGap > 该段 span` 时，tip 行（t=1）`uStart > uEnd` → u 区间反转 → lerp 后列序倒置 → quad 折叠 → 发丝末端交叉。Sussurro_v1_0044.ahs Front Bangs 1 实测（widthLoops=22、4 splits、gap=0.19）：segments 1/3（span≈0.367）t=1 时 `uStart-uEnd = -0.0067`。gap 上限 0.28 ⇒ 任意 span<0.56 的段都可能反转；splits 可聚集，高 gap 常见交叉。即便未反转，opening 也是绝对位移：段尖被绝对偏移挤窄、不按比例缩放，整片轮廓在 tip 被挤压失真。
- **结论**：这两个功能本质都是「位移」，按用户决策**抛弃并重铸**为按 split 段的独立 WidthCurve 系统（每段有自己的宽度/厚度曲线 + 视口调节），体验对齐「同一发丝上的多骨骼」。

## 2. 设计目标

1. **按 split 段独立曲线**：zipper 分割出的每个子段（段数 = `panelSplits.length + 1`）拥有独立的宽度/厚度曲线。
2. **相对缩放而非绝对位移**：段边界在段内归一化参数空间移动，保证 `uStart ≤ uEnd` 恒成立（根除反转）；宽度变化以段内比例 / 曲线值表达，段尖按比例收窄。
3. **视口可调**：3D 手柄（zipper 手柄保留；段曲线控制点直接在段网格上拖）+ 复用现有 taperCurveEditor 曲线编辑器。
4. **保留 zipper 水密拓扑**：墙 quad、capStart/capEnd 端盖、Snap Zippers to Loops、退化/反射折叠跳过、焊接、法线平滑全部保留。

## 3. 数据模型提案

- **保留 `panelSplits`**：`[{ position(u∈[-0.88,0.88]), height(0..0.78，从 tip 起算 start=1-height) }]`，非骨骼、纯拓扑特征；`panelSplitEnabled / panelSplitSnapToLoops / panelSplitHeight` 一并保留。格式与 `normalizePanelSplits`（L1276）/ `snapPanelSplitHeight`（L1292）不变。
- **新增可选字段 `panelSegmentCurves`**：数组，长度 = `panelSplits.length + 1`（段序：最左段 0 … 最右段 N），每项：
  ```
  { taperCurve, taperCurveSecondary, depthCurve, depthCurveSecondary,
    asymmetricWidthCurve, asymmetricDepthCurve }
  ```
  全部复用现有 taperCurve 结构 `[{ position, value, interpolation }]`（见 `STRAIGHT_CUT_PANEL_CURVE` app.js L1131；采样入口 `sampleTaperCurve` / `sampleAsymmetricTaperCurve` modules/geometry/curve-math.js L228）。
- **段内局部参数化**：段 s 的 u 域 = `[boundary[s], boundary[s+1]]`（boundary 由 splits 排序 + ±1 派生，同 L13632）；t 仍是全片长度参数 `row/lengthLoops`——所有段共享同一长度轴，**无需重映射 t**。段内局部坐标 `u' ∈ [-1,1]`：`u = lerp(boundary[s], boundary[s+1], (u'+1)/2)`。
- **段虚拟骨骼**：不新增真实骨骼（`bones` 仅导出选项 L2775）；「虚拟段骨骼」= 由 zipper 位置派生的**不可持久化** bounds `{ uStart, uEnd, span, leftZipper, rightZipper }`，仅几何/UI 读取时计算，不入存档。
- **与全局曲线关系**：`panelSegmentCurves[s]` 缺失或字段缺失时回退 `lock.taperCurve/taperCurveSecondary/depthCurve/...`（全局曲线 = 基底模板，即 index.html L1018-1024 现有面板 Width/Depth Curve 区）；用户编辑某段时写入该段 override。asymmetric 语义沿用 `sampleAsymmetricTaperCurve`（signedCoordinate<0 且 asymmetric 时用 secondary）。

## 4. 几何生成改动（createPanelStrandGeometry，app.js L13445）

- `panelWidthAt/panelThicknessAt`（L13513/L13522）改为接收段曲线：`sampleAsymmetricTaperCurve(seg.taperCurve, seg.taperCurveSecondary, seg.asymmetricWidthCurve, side, t)`；面板 `surface`（latticeControlled）路径走 `surfacePanelPoint`（L13422），无 taperCurve 语义，段曲线对其 no-op、零改动。
- **段内采样**：`addPatch`（L13575）内 `u = lerp(uStart(row), uEnd(row), (u'+1)/2)`；`uStart/uEnd` 由**相对开口**派生：`openingFraction(row) = gapRel * smoothstep((t-start)/(1-start), 0, 1)`（gapRel 为该段自身 span 的比例，钳制 `[0,1)`），段边界 `uEnd(s,row) = boundary[s+1] - 0.5*openingFraction(row)*span`、`uStart(s+1,row) = boundary[s+1] + 0.5*openingFraction(row)*span`。每段按自身 span 钳制 ⇒ `uStart ≤ uEnd` 恒成立，**根除反转**；宽度随 `(1-openingFraction)` 按比例收窄 = 相对缩放。
- **列分配**（L13636-13648 现有按 span 比例 fractional allocation）保持按 span 分配；后续可选按「段 tip 宽度权重」调整（阶段 S5，非阻塞）。
- `panelPoint`（L13569）删除 edgeTrim 位移（不再消费 trim）；`panelSplitControlPoint`（L24332）同步删除 trim 位移、改读段曲线，否则手柄位置与几何不一致。
- **保留项（红线）**：墙 quad `leftWallStartRow/rightWallStartRow = Math.ceil((1-split.height)*lengthLoops)`（L13657-13659）、`capStart/capEnd` 端盖、`snapPanelSplitHeight`（L1292）、`addQuad` 退化/反射折叠跳过（L13479 起，0.2.55 修复）、`weldPanelGeometryData`（L13367）、`smoothCoincidentPanelNormals`（L13331）。

## 5. UI / 视口改动

- **面板 UI**（index.html L972-985）：删除 Left Edge Trim（L972）/ Right Edge Trim（L973）与 Split Spacing（L985）滑杆；Split Tip 区（L975-984）保留 Split Geometry / Snap Zippers to Loops / Zipper Controls 加减（`changePanelSplitCount` app.js L31807）。
- **新增 Segment 区**：段选择器（左右箭头，或点击 zipper 手柄选中相邻段）+ 每段 Width Curve / Depth Curve preset select（复用 `.shape-preset-select` data-shape-preset）+ 编辑按钮（`.edit-shape-curve` data-curve-key）→ 打开现有 `taperCurveEditor`（index.html L1843 起）；`sculptState.state.taperCurveEdit` 增加 `segmentIndex` 路由（renderTaperPreview L15506、taperCurveTarget L15999）。
- **全局 Width/Depth Curve 区**（index.html L1018-1024）保留为基底曲线；override 的段显示独立预览。
- **3D 视口**：zipper 手柄/拖动（begin/update/endPanelSplitHandleDrag L33619/33650/33725）不变；新增段曲线控制点就地编辑——复用 `taperMeshPointFrame`（L15775）/ taperMeshPointDrag 机制，编辑段 s 时在段表面显示可拖点；`updateCurveObjects`（L24888）/ `rebuildCurveObjects`（L18879）绘制段边界线/手柄。
- **多选/镜像**：现有 partner 镜像复制（L16767-16783，复制 trim/gap/splits）改为复制 `panelSegmentCurves` 并**左右反转段序**（段 i ↔ 段 N-1-i，宽度曲线随 u 符号翻转）；`syncActiveMirror`（拖拽路径）同步段曲线。

## 6. 迁移 / 向后兼容

- **`panelSplits`**：格式不变、完整保留（读 + 写）。
- **`panelLeftEdgeTrim / panelRightEdgeTrim / panelSplitGap`**：读取容错（`Number()` 兜底不崩），几何不再消费（**忽略**）。理由：三者是参数位移，映射为曲线值有损且复杂；trim 的「缩短边缘」语义在曲线系统里无自然对应（属范围外的新「tip 长度」功能，本计划不做）。如后续要保留旧外观，可选一次性映射：左右 trim → 最左/最右段 taperCurve tip 值 ×(1-trim)（阶段 S5 可选，默认不做）。
- **存档 schema**：`panelSegmentCurves` 为可选字段；旧 .ahs 无该字段 → 回退全局曲线，行为 = 原版 taper 曲线下的 split（无 trim/gap 效果，视觉变化在版本说明中声明）；新保存写出 `panelSegmentCurves`（有 override 时）。
- **状态链路补齐**：undo/快照恢复（L18339-18355）、stroke/extension 复制（L21766+ / L22405+）、`panelCreationDefaults`（L1258-1269）与 `syncPanelShapeInputs`（L26234）同步处理新字段。
- **版本/文档**：`0.1.4-Sintaka.0.2.58`（modules/core/app-config.js APP_VERSION）；devlog annotations-split.md 追加实施条目；JS 改动标注；新 UI 文案补齐 EN/JA/ZH。

## 7. 实施阶段（每步独立 commit + verify-smoke 回归）

验证基线：`node scripts/verify-smoke.mjs <Sussurro_v1_0044.ahs>`（0 启动异常 + .ahs 加载重建 0 异常）；几何阶段额外断言 Front Bangs 1（widthLoops=22、4 splits、gap=0.19 场景）从「交叉」变正常、0 NaN、无折叠 quad。Sussurro_v1_0044.ahs 不在仓库内（仓库仅有 assets/presets/layered-side-bun.ahs），用主进程提供路径。

| 阶段 | 内容 | 阻塞 | 验证 |
|---|---|---|---|
| S1 数据模型 | `panelSegmentCurves` 字段 + normalize/clone + 缺省回退 + 存档/撤销/镜像/stroke 复制；几何仍走旧路径（零行为变化） | 是 | verify-smoke + 手测几何与 0.2.57 一致 |
| S2 几何重铸 | createPanelStrandGeometry 段内 u' + 相对开口 + 段曲线采样；panelPoint/panelSplitControlPoint 去 trim；临时断言 uStart≤uEnd | 是 | verify-smoke(0044) + 0 NaN + zipper 拓扑逐项核对（墙/盖/吸附/焊接/法线） |
| S3 UI | 删 trim/gap 滑杆、段选择器 + 每段曲线入口；syncPanelShapeInputs 与输入绑定更新；EN/JA/ZH | 否（S1 后可并行） | verify-smoke + 手测面板 UI 联动 |
| S4 视口 | 段曲线 3D 手柄 + 就地编辑 + 镜像段序翻转 | 否（S2 后） | verify-smoke + 手测拖拽/镜像 |
| S5 收尾 | （可选）列分配按 tip 宽度权重；旧字段移出 panelCreationDefaults/序列化（保留容错读）；release notes；FUNCTION_INDEX 重生成 | 否 | verify-smoke 全量 |

> 并行注意：S3 主要改 index.html + modules/data/loc-*.js + app.js UI 绑定区，S2/S4 改 app.js 几何/手柄区；若用子 agent 并行需按文件/区域切分避免 app.js 冲突，关键路径（S1/S2）不委托。

## 8. 风险与红线

- **zipper 拓扑红线（必须保留）**：墙 quad（L13657-13659 起连接 front/back）、capStart/capEnd 端盖、`snapPanelSplitHeight` 吸附到 loop 行（保证 split 内端落在顶点行、水密）、`addQuad` 退化/反射折叠跳过（0.2.55）、`weldPanelGeometryData` 焊接、`smoothCoincidentPanelNormals` 法线平滑。
- **不引入真实骨骼**：panel 无骨骼系统（`bones` 仅导出选项 L2775）；「虚拟段骨骼」纯派生、不持久化；不影响 `createHairGeometry` 分流与 modules/geometry/branch-*.js 子发片系统；**panel 暂不支持桥接类子骨骼（branch child 系统），明确排除在范围外**。
- **lattice/surface 面板**（geometryType="surface"）：段曲线 no-op，lattice 路径零改动，避免破坏既有 lattice 编辑。
- **开发规范**：最简化、不过度设计、少手搓半成品（复用 taperCurveEditor / shape-preset 体系，不新造曲线编辑器）；新文案 EN/JA/ZH；任务类型分支（0.2.58-refactor）由主进程管理；每步独立 commit + verify-smoke 回归。
- **行为变更声明**：旧 .ahs 的 trim/gap 加载后不再生效（忽略），需在版本说明/迁移指引写明，避免用户困惑。