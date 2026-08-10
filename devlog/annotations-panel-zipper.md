# Panel（Front Bangs）zipper 拓扑调研

> 调研记录（0.2.58，分支 0.2.58-panel-split-refactor；仅产出本文档，无代码改动）。入口见 devlog/README.md。

> 相关函数/关键词：createPanelStrandGeometry、addQuad、addPatch、splitOpening、snapPanelSplitHeight、weldPanelGeometryData、smoothCoincidentPanelNormals、panelSplitControlPoint、beginPanelSplitHandleDrag / updatePanelSplitHandleDrag / endPanelSplitHandleDrag、strandGeometryCurve、panelSplits、Front Bangs、Sussurro_v1_0044

> 说明：条目式，每条带版本标签；行号以仓库 app.js / index.html 为准。

## A. Panel 只有一个主骨骼：zipper 是末端拓扑游戏，不是骨骼

- **数据层证据（Sussurro_v1_0044.ahs，state.locks 共 25 条，panel 3 条）(0.2.58)**：每条 panel（Front Bangs 1/2/3）只有单个 `points` 数组（6/6/8 个 `{x,y,z}` 控制点单链），配套 `pointWidths/pointScales/pointTwists` 与 points 等长（每点一个标量/分量）；**没有第二组控制点，也没有 `bones` 字段**（3 条 panel 均无 bones，全存档 25 条 lock 均无 bones 数组）。`panelSplits` 只是 `[{position,height}]`：position∈[-0.88,0.88]（横向 u）、height∈[0,0.78]（自 tip 起算）。实测 Front Bangs 1（panelLengthLoops=16）4 条 split 的 height 全为 1/16 整数倍（0.25/0.4375/0.1875/0.4375）——正是 `snapPanelSplitHeight` 吸附后的形态（见 B.4）。
- **`bones` 只出现在导出选项 (0.2.58)**：app.js L2775 `bones: document.querySelector("#exportIncludeBones")` —— 骨骼数据仅作为导出可选项（#exportIncludeBones），与 zipper 拓扑生成无关。
- **几何生成证据 (0.2.58)**：`createPanelStrandGeometry(lock)`（app.js L13445）非 lattice 路径只用 `strandGeometryCurve(lock)`（L13447）；`strandGeometryCurve`（L13211）由 `new THREE.CatmullRomCurve3(lock.points)` 建**单条**曲线 → 整条 panel 只有一个「主骨骼」式引导链，与普通 strand 同构。
- **结论 A (0.2.58)**：panel 发丝**只有一个主骨骼**（points 单链），不存在「只暴露主骨骼的隐藏多骨骼」可复用；split zipper 是**纯拓扑特征**（panelSplits 只是 position/height 标量数组），在末端玩拓扑游戏：按 position 把 ribbon 横向切开、按 height 决定切口在 tip 侧内端多深、再用墙条带把切口封成水密（见 B）。
- **「能否复用」顺带结论 (0.2.58)**：不能直接复用既有骨骼（根本没有第二套骨骼）；但每个 split 的 position 天然把面板划分成「段」，段边界 + 每段列数（B.3）可作为未来「每段 WidthCurve 虚拟骨骼」的骨架锚点——与重构计划衔接，此处不展开。

## B. Zipper 如何保证末端 quad 布线 + 拓扑自适应

- **B.1 段划分：每段一个闭合 patch (0.2.58)**：`boundaries=[-1,...splits.map(s=>s.position),1]`（L13632），每段 `addPatch(0,lengthLoops,uStart,uEnd,columns,{capStart:true,capEnd:true,leftWallStartRow,rightWallStartRow})`（L13656-13660）；`uStart/uEnd` 由相邻 split 位置 ± `splitOpening` 得出，addPatch 内按列插值 `lerp(uStart(row),uEnd(row),column/columns)`（L13585）。
- **B.2 墙 quad 条带：切口内端封水密（不用三角扇）(0.2.58)**：addPatch 内对每个 globalRow 自 `leftWallStartRow`/`rightWallStartRow` 起，左墙 `addQuad(front[row][0],back[row][0],back[row+1][0],front[row+1][0])`（L13606-13608）、右墙 `addQuad(front[row][columns],front[row+1][columns],back[row+1][columns],back[row][columns])`（L13609-13611）；`leftWallStartRow=Math.ceil((1-leftSplit.height)*lengthLoops)`（L13659，右墙同理 L13660）。即从 split 起点行到 tip（t=1），切口内端两侧各用一串 quad 条带连接 front/back，**零三角扇、零退化填缝**；split 起点以下（未切开段）墙不起始，ribbon 仍为整管。
- **B.3 端盖 + 段内列分配（每段 ribbon 自闭合）(0.2.58)**：`capStart`（L13613-13616）/`capEnd`（L13618-13622）各用一列 quad 封住每段根端/tip 端。段列数自适应：每段保底 1 列，剩余列按段横向跨度比例分配（L13634-13647，最大余数优先）；并约束 `panelWidthLoops>=panelSplits.length+1`（L16427-16430、L26241-26243）——split 再多也保证每段至少一列、不塌成零宽段。
- **B.4 snap-to-loops：墙起点对齐顶点行（导出水密关键）(0.2.58)**：`snapPanelSplitHeight(height,lengthLoops)`（L1292）= `round(height*loops)/loops`，clamp 到 [0,floor(0.78*loops)/loops]；height 吸附到 loop 行后 `ceil((1-height)*lengthLoops)` 恰落顶点行，墙条带首行与段内 quad 行完全对齐 → 无半格错位/T 型接缝。应用点：锁重建（L16434-16436）、面板形状输入同步（L26237-26239）、快照恢复（L18351-18353）、拖拽（L33713-33714）；关闭时 index.html L1759 `panelSplitSnapWarning` 明示「may create uneven or non-watertight geometry when exported」。
- **B.5 拓扑自适应（0.2.55 修复，必须保留）(0.2.58)**：`addQuad`（L13479）内两层跳过——① 退化 quad（角点重合 <1e-10，L13483-13492）：尖端收拢成 sliver 时墙/cap quad 塌成点/零面积，跳过避免「两三角法线相反」的破三角；② 反射折叠 quad（两三角法线点积 < -0.999，L13493-13512）：开口墙在 sliver 处近乎共面但位于共享对角两侧的「翻折 flap」，跳过避免着色折痕。效果：最大二面角 180/90° → ≤10.7°（见 bug-fixes.md #4），tip 收拢时「不生成坏面」而非生成后再修——真正的自适应。
- **B.6 焊接 + 法线平滑（水密与接缝观感）(0.2.58)**：生成末尾 `weldPanelGeometryData(positions,uvs,colors,indices,quadFaces)`（调用 L13676，实现 L13367，容差 1e-5 按位置合并顶点并 remap indices/quadFaces）→ 相邻 patch 共享边界顶点合并，单一网格水密；`smoothCoincidentPanelNormals(geometry)`（调用 L13686，实现 L13331）按位置桶 + 法线方向簇（dot>0.25）分组平均，接缝法线平滑、无棱线。
- **B.7 视口手柄/拖拽 (0.2.58)**：`panelSplitControlPoint(lock,split)`（L24332）由 `t=1-split.height`、`u=split.position` 取点；手柄线从 `startT=1-split.height` 画到 t=1（L25076-25079，12 段折线）；拖拽 `beginPanelSplitHandleDrag`（L33619）/`updatePanelSplitHandleDrag`（L33650，在 t∈[0.22,1]×u∈[-0.88,0.88] 上暴力投影搜索 42×48 步取最近点，L33687-33701）/`endPanelSplitHandleDrag`（L33725），并做最小间距约束（L33708-33710）防止 split 重叠。

## C. 结论：为什么这套 zipper 逻辑优秀、重构必须保留

- **单一网格水密 (0.2.58)**：墙 quad 条带 + capStart/capEnd + 顶点焊接 → 切口内端纯 quad 封口、无三角扇，导出是单一水密网格。
- **无三角、无破面 (0.2.58)**：0.2.55 退化/反射折叠跳过让 tip sliver 收拢时不产生破三角/折痕；0.2.56 triangleEdgeMasks 绕序同步让线框不描 quad 对角线（L13666-13673）。
- **导出稳定 (0.2.58)**：snap-to-loops 保证 split 起点对齐 loop 行，配合焊接/法线平滑，任意 height/position 组合几何稳定、0 NaN、四边面保持。
- **自适应而非硬编码 (0.2.58)**：退化面跳过、段列数按跨度分配、吸附对齐——都是「按当前拓扑决定局部行为」，与固定三角化方案的本质区别。
- **与重构衔接 (0.2.58)**：zipper 现状整体保留；其「段」边界可作为未来每段 WidthCurve 虚拟骨骼骨架（A 结论一句带过）。
- **已知边界（交叉问题，不属本模块保留范围）(0.2.58)**：splitGap 大而段 span 小时，tip 行会出现 uStart>uEnd、段尖反转交叉——见 annotations-split.md「0.2.58 调研」条目；那是「opening 绝对位移」方案的固有边界，与本文所述的 quad 布线机制正交（重铸时按比例缩放段尖即可）。
