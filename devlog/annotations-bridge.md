# 子发片桥接几何 / 父发片挖洞

> 由 devlog/js-change-annotations.md 拆分而来；入口见 devlog/README.md。

> 相关函数/关键词：buildBranchBridgeGeometry、createBranchChildGeometry、applyBranchRootRegionCarving、holeBoundary、connectSide、2.4a→2.4t、桥接/挖洞/环形

> 说明：条目按子系统归类，同一开发阶段（2.x / Phase 2.15 等）的条目可能分散到多个文件，请按关键词跳读。

- **子发片深度重置 2.4k（2×1 截面 + 根部对齐 + 底部桥接）**：约定"2×1"=宽×高——子截面改为 2:1 矩形（halfDepth = halfWidth×0.5）；父洞保持 2×3（rows9-11×cols2-3）。根部对齐：子环 frame = 父 frame 绕侧轴（X）+90°（切线=父 up、环底部 -up 朝向父末端 +切线），子骨骼"转上来"。桥接只接子环底部（-up 侧 2 段）↔ 父洞底部（靠近父末端、横向 2 边）。验证：Side Left 3 = 223 顶点 / 210 quad，0 报错。

- **子发片深度重置 2.4l（桥接方向修正：洞 bottom 实为横向边）**：定位"桥接到父洞左侧"的根因——父发片剖面带折痕接缝（linear 控制点处有重合列 col3≡col4），holeBoundary 之前按**位置**去重把 10 个洞边界顶点坍缩成 8 个，side 布局错位，"bottom"被算成父洞左侧竖边（x≈-0.77），桥接因此拧到左侧。改为按**网格索引**去重（保留重合列），洞 bottom/top 恢复为横向 2 边、left/right 为竖边。验证：边界恢复 10 顶点；洞 bottom=row12 横向（y≈0.81，朝向父末端），子环 bottom=2×1 中边长 2 的横向侧（y≈0.88），桥接 2 quad（其中 1 个因折痕重合列为零面积不渲染），Side Left 3 = 223 顶点 / 210 quad，0 NaN，0 报错。已存 Sussurro_v1_0027.ahs 供目视确认；若方向仍反，只需把匹配侧从 bottom 换成 top。

- **子发片深度重置 2.4m（桥接另一段改接扫掠行0环 + 消除零面积碎面）**：① 桥接的另一端不再用原始根部（point0 埋在父发片里），改为**扫掠行 0 环**（guideT=0.1，即扫掠起始环），并且**直接复用扫掠顶点**（按索引引用，不再复制一份环），桥接与扫掠无缝衔接；② 洞边界**按位置折叠重合列**（折痕接缝的零长度边不再生成退化面，避免 shader 对零面积三角求 dFdx/fwidth 产生 NaN → 三角碎面）；③ 桥接父侧顶点法线/tangent 按网格索引读父几何的 tangent 属性（原来写死 (1,0,0)），uv/color 补齐；④ 桥接 quad 顺序与三角拆分改为与原发片 sweep 一致的 [a,c,d,b] / (a,c,b),(b,c,d)；⑤ 修复环侧索引偏移（ringStart），桥接正确引用环点 5/6/7（bottom 侧）。验证：Side Left 3 = 219 顶点 / 211 quadFace（2 桥接 quad + 1 接缝三角 + 208 扫掠），0 退化三角，0 NaN，0 零长度法线，maxIndex 218<219。已存 Sussurro_v1_0028.ahs 供目视确认。

- **子发片深度重置 2.4n（桥接 1:1 边映射 + 线框三角化修复）**：① 之前把洞 bottom 按位置折叠成 1 条边，子环两条边都接到同一条父边（扇形）→ 视觉上"都往左、右边空"。改为**保留 2 条网格边做 1:1 映射**：connectSide 检测零长度边（折痕接缝 col3≡col4），边界边坍缩成点时输出**三角面**（父洞左端折痕点 ↔ 子环左底边），实边输出 quad（父洞右侧实底边 ↔ 子环右底边）——不再有退化面、右边也接上了。② 子发片线框/拓扑显示"全三角化"根因：桥接索引被 unshift 到最前，把线框 overlay 的 `triangleIndex % 2` 交替 edgeMask 对齐打乱，每条 quad 的对角线都被描边。改为**扫掠索引在前、桥接索引追加到最后**（sweep 0..415 三角对齐交替掩码，cap/桥接按全边掩码）。验证：Side Left 3 = 220 顶点 / 1305 索引 / 210 quadFace（208 扫掠 + 1 桥接 quad + 1 接缝三角 + 16 cap），0 退化三角，0 NaN，maxIdx 219<220。已存 Sussurro_v1_0029.ahs 供目视确认。

- **子发片深度重置 2.4o（桥接 1:1 实边映射 + 洞边界改用真实网格列）**：用户指出父洞 bottom 还有一条边没用上、桥接仍有三角。根因：区域列(虚拟列 2-3)与父网格实际列不一致——折痕接缝(linear 控制点)让网格第 3 列没有任何面起始，挖洞实际删的是网格列 2 和 4（洞底暴露边延伸到 col5，多一条实边 c4→c5 从未被桥接）。修复：① branchRootRegionSurface 从父 quadFaces 算出跳过的网格列(skipCol)，colMin/colMax 改为**真实网格列**(2→4)，挖洞与洞边界一致；② 挖洞按 toGridCol 映射后再判断（删除结果不变，仍 6 面）；③ 桥接重新折叠相邻重合边界顶点——bottom 侧现在包含 col5，折叠后剩两条实边(c5→c4、c4→c2)，与子环 bottom 两条边 1:1 → **2 个 quad、0 三角**（子环右底边↔父洞右侧实底边 c4→c2，子环左底边↔父洞左侧实底边 c5→c4）。验证：洞边界 12 顶点，Side Left 3 = 220 顶点 / 1308 索引 / 210 quadFace（208 扫掠 + 2 桥接 quad + 16 cap），0 退化三角，0 NaN，maxIdx 219<220。已存 Sussurro_v1_0030.ahs 供目视确认。

- **子发片深度重置 2.4p（桥接显示为四边面：线框掩码 + 平滑法线）**：深挖"桥接部分是三角面"——几何本身是 2 quad，但① 线框 overlay 的 edgeMask 按 sideTriangleCount 交替分配，桥接三角形被追加到索引末尾落入 [1,1,1] 全边掩码，对角线被描边 → 看起来是三角；② 法线不一致：桥接父侧顶点用父法线（朝外）、环侧用子径向法线（朝内），沿 quad 对角线出现明暗接缝 → 渲染也像三角。对比原版发丝：原版也调用 computeVertexNormals 且线框靠 sideTriangleCount（扫掠在最前）。修复：createBranchChildGeometry 生成完整 triangleEdgeMasks（扫掠 [0,1,1]/[1,1,0]，cap [1,1,1]，桥接 quad [0,1,1]/[1,1,0]）+ geometry.computeVertexNormals()。验证：masks=436=三角形数，桥接末 4 掩码 [0,1,1],[1,1,0],[0,1,1],[1,1,0]，桥接顶点法线统一朝 -y（0 NaN / 0 零长度），0 退化三角。已存 Sussurro_v1_0031.ahs 供目视确认。

- **子发片深度重置 2.4q（2×1 截面 + 侧面直接桥接，验收完成）**：① 横截面环从"每边 2 段"（视觉 2×2）改回 **2×1**：6 点环（right-top/top-mid/left-top/left-bottom/bottom-mid/right-bottom，CCW），top/bottom 各 2 段（宽向）、left/right 各 1 段（高向）；② 桥接在 bottom（2 quad，1:1 实边映射）基础上新增**侧面直接桥接**：子环 left/right 各 1 段，顺着两侧拓扑各往下延伸 1 个 quad，接到父洞两侧边底部段（rowMax→rowMax+1，colMin / colMax+1），记录为「侧面直接桥接」与底部桥接区分。桥接 = 2 底 + 1 左 + 1 右 = **4 quad、0 三角**。验证：Side Left 3 = 170 顶点 / 996 索引 / 160 quadFace（156 扫掠 + 4 桥接 + cap fan），0 退化、0 NaN，masks=332 对齐。已存 Sussurro_v1_0032.ahs；**用户验收完成**（动态缩放 / 根骨骼旋转自适应更新正常）。

- **子发片深度重置 2.4r（侧面直接桥接方向修正 + 法线朝外）**：用户反馈新增的侧面桥接在主/子发片反了、出现交叉面片。根因：发带网格列在世界上与子环 left/right 相反（网格 col2 在世界 x≈-0.77 右侧、col5 在 x≈-0.87 左侧，而子环 left 在世界 x≈-0.95 最左、right 在 -0.79 最右），原来 left↔colMin、right↔colMax+1 是按网格名匹配 → 世界位置交叉。修正：left↔colMax+1（世界左侧）、right↔colMin（世界右侧），按世界侧匹配不再交叉；右面位于子曲线 +x 侧，绕序与左面相反，加 flip 翻转绕序使法线朝外（左面法线 -x/+z，右面法线 +x/-z，均背离子曲线中心）。验证：Side Left 3 = 170 顶点 / 996 索引 / 160 quadFace，0 退化、0 NaN，masks=332 对齐。已存 Sussurro_v1_0033.ahs 供目视确认。

- **[TEMP] 子发片桥接顶部补全（2.4s 计划，方向规律 + 三步走）**：方向规律（吸取底部/侧面教训）：

- **子发片深度重置 2.4s（顶部桥接完成：2src↔2dst + 中间分段 + smoothstep）**：按 2.4s 计划三步实现——① 子环 top 2 边 ↔ 洞 top 2 实边（(9,2)(9,3)(9,5)，折痕零边折叠），按世界侧右→左匹配不交叉（方向规律：与底部一样按位、与侧面一样按世界侧）；② 每条桥接列**中间加一行**（等比切分 t=0.5，新增段数=2-1，注释后续投影距离复杂侦测），2 列 × 2 行 = 4 quad；③ 中间行用 **smoothstep** 定位（smoothstep(0.5)=0.5 与等比一致，作为方向平滑框架，后续复杂拓扑再细化）。验证：Side Left 3 = 176 顶点 / 1020 索引 / 164 quadFace（156 扫掠 + 8 桥接 quad + cap fan），顶部 4 quad 法线 -x/+y（朝外），0 退化、0 NaN，masks=340 对齐。已存 Sussurro_v1_0034.ahs 供目视确认。

- **子发片深度重置 2.4s 更新（顶部桥接几何验收通过 + smoothstep 桥接圆滑细化）**：用户确认步骤 1-2 的**几何构建验收通过**（2src↔2dst + 中间分段，拓扑正确）。smoothstep 理解修正：不是**分段位置**（t 的等比），而是**桥接位置**的切线方向平滑过渡（DCC 的 bridge round/smooth 选项）——**中间新增的那一行要往法线负方向凹一点**，依据子发片与主发片两侧法线 + 桥接边位置，沿切线方向平滑过渡。实现：中间行在等比中点基础上，沿"桥接带法线的负方向"按桥接跨度比例位移（round factor，先固定写死，后续可加 control），形成内凹平滑桥接。

- **子发片深度重置 2.4s 更新（smoothstep 桥接圆滑实现）**：按用户修正实现——中间行在等比中点基础上沿**桥接带法线的负方向**位移（round factor=0.2×桥接跨度，先固定写死），使顶部桥接内凹平滑（DCC bridge-round）。验证：中间行位移 ~0.02-0.03（+x 内凹/-y/+z），顶部 4 quad 法线保持 -x/+y 朝外，0 退化、0 NaN。已存 Sussurro_v1_0035.ahs 供目视确认。

- **子发片深度重置 2.4t（侧面桥接收口：每侧 1 三角 + 1 四边）**：完成最后一步——填补顶部桥接与侧面直接桥接之间的剩余洞侧边。规律：**紧邻主发片 top 切边的第一个 poly 是三角形，其余依次是四边形**（矩形挖洞保证这一点）。实现：每侧新增 **1 个三角面 + 1 个四边面**——三角面填 top 切角（(9,c)→(10,c)→top 中间行角点），四边面接洞侧中间段（(10,c)→(11,c)→子环 top 角点→top 中间行角点）；左/右绕序对称（右面 flip），法线朝外（左 -x/+z、右 +x）。桥接 quad 数组现在含 3 顶点三角面，line-wire 掩码对三角面给 [1,1,1]。验证：Side Left 3 = 178 顶点 / 1038 索引 / 168 quadFace（156 扫掠 + 12 桥接面（2 底 + 2 侧直 + 4 顶 + 2 三角 + 2 四边）+ cap fan），0 退化、0 NaN，masks=346 对齐。已存 Sussurro_v1_0036.ahs 供目视确认。

- **[TEMP] 子发片桥接规律总结 + 下一步计划（2.4u）**：

  - **桥接规律总结（已验收）**：底部按位（洞 bottom 左→右 ↔ 子环 bottom 左→右）；侧面/顶部按**世界侧**匹配（网格 left/right 在世界相反）；顶部 2src↔2dst + 中间分段 + smoothstep 内凹；侧面收口每侧 1 三角 + 1 四边（紧邻 top 切边为三角，其余四边）；法线均朝外。

  - **底部桥接按需拓展（后续）**：底部不再定死 2 quad，改成按需桥接操作——阈值：根骨骼附近直接探测，若拓扑对不上（超过 1 个面对不上，如 2×1 对 2×3，底部直接对上则上面有 2×2 面对不上）→ 触发分段桥接 + 额外拓扑操作。

  - **侧面 3D（暂不扩展）**：目前工作在切线二维方向，侧面 3D 扩展待想清楚。

  - **底部桥接（已验收）**：洞 bottom（row12，世界 左→右 c5→c2）↔ 子环 bottom（环点 5/6/7，世界 左→右），按位 1:1，折痕零边折叠。

  - **侧面直接桥接（2.4r 已修正）**：子环 left（世界左）↔ 父 colMax+1（世界左）、right（世界右）↔ colMin（世界右），按**世界侧**匹配（网格 left/right 在世界相反）；右面绕序 flip 朝外。

  - **顶部（本次三步）**：① 洞 top（row9，世界 右→左 col2→col5，折痕零边折叠成 2 实边）↔ 子环 top（环点 0/1/2，世界 右→左），2src↔2dst 直接桥接；② 对桥接边**分段**：观察洞侧面未桥接边数（每侧 2 段）→ 每条桥接边 1 段需增至 2 段（新增 1 段 = 中间等比切分，注释后续复杂侦测）；③ 上部 poly 走向从线性改 **smoothstep 平滑**，完成子→主桥接过渡。

  - 直接桥接概念：把子环边**直接投影**到主发片最接近的面/线段去匹配。

  - **桥接网格边界守卫**：emitTopMidRow/emitBottomMidRow 对 `i >= holeTop.length / collapsed.length` 跳过——region 拖到网格最末行（u→1，孔洞底边坍缩成少于环点数）不再抛 TypeError 崩溃。

  - **smoothstep 双边法线（2.14 修正）**：上下桥接带的 Hermite 端点切线不再只在主发片端用法线——新增子发片根部环切法线（`strandGeometryFrameAt` 在 branchSweepStartT 的 frame.z），环切端切线 = 弦方向投影到**子发片切平面**、主发片端仍投影到父切平面（底部保留父端折痕），像 B 样条一样两端都平滑衔接。验证：首行中点法向分量 0.0415→0.0293（f=0 处导数为完全切向）；默认/3宽/1宽直连/分段均 0 NaN。版本 0.1.4-Sintaka.0.2.17。

  - **桥接接缝法线平滑（优化项，确认是法线问题）**：桥接父侧边界顶点在子几何里是独立顶点，computeVertexNormals() 只按子几何自身面平均（与父发片法线不一致，极端情况出零长度法线），接缝处着色/颜色不同。修复：buildBranchBridgeGeometry 记录边界顶点「子顶点索引 ↔ 父网格索引」（boundaryParentIndices），createBranchChildGeometry 在 computeVertexNormals 之后把父侧边界顶点法线恢复为父发片该网格顶点的作者法线（tangent 原本就按索引复制，保持一致）。验证：合成父网格 + 真 buildBranchBridgeGeometry，16 个边界顶点修复前 12 个法线不一致（最大 90°，含零长度 [0,0,0]），修复后 0 不一致。

  - **末端循环线按「侧面空隙」判断，顶底分开（0.2.22，修正 0.2.21 的 midCount>0 条件）**：0.2.21 用 midCount>0（分段>1）判断是否发末端 0.3 循环线，把「间接桥接高度==1」也误判成直接桥接而不补。正确判别：**直接桥接** = 根骨骼行贴着区域边缘（顶部 rootRow==rowMin、底部 rootRow==rowMax），桥接面直接与侧面基础填充面对接、无空隙 → 不补末端；**间接桥接** = 侧面存在 >=1 条边空隙（rootRow 在区域内但不在边缘，或 root 在区域外）→ 即使桥接高度==1 也要补末端防三角。修复：顶/底条件分别改为 rootRow !== surface.rowMin / rootRow !== surface.rowMax，直接桥接段 midCount=0（单 quad 直连），其余 midCount = 段数-1+1。验证（Sussurro_v1_0040，SL2 父/SL3 子，W=3）：A 直接顶+填充底 bridgeQuads=10（顶1行+底3行+侧2）；B 间接高度1顶+填充底 =12（顶补末端成2行）；C 当前（顶填充2段+底直接）=10；D 顶/底都间接高度1 =10（两带都补成2行）。

  - **子发片封面侧面 4 边面填充补全（0.2.43，Phase 2.17，分支 v0.1.4-Side-Topology 重写，无 smooth）**：在 0.2.42 基础上重写 buildBranchBridgeGeometry 的侧面填充（0.2.43 旧实现因 smooth 破坏顶/底桥接已回退到旧分支）。逻辑：顶/底分开处理、左右两侧各执行一次——当某条带为间接桥接（顶部 rootRow > rowMin 或底部 rootRow < rowMax，即至少一条侧边留空）时，该侧启用填充；从侧面直接桥接（root 行）出发，主发片孔洞的一条边与顶/底桥接的一条边 1:1 对应，直到接近孔洞顶部/底部，剩余一条桥接边按既有拓扑规律作为侧面收尾 → 全部 4 边面、无三角。利用顶/底带预留的 0.3 末端分段（midCount === 段数）保证 1:1 计数。洞侧中间顶点按需 pushBoundary（缓存去重，与带/直接桥接共享顶点）。

  - **侧面填充法线朝向（0.2.43）**：填充条带发射后用共享边一致性传播（BFS）统一 winding——从左右直接桥接（0.2.42 既有正确朝向）出发，相邻面必须反向遍历共享边，多行条带的内侧 quad（不直接接触环角）也一致；最后按新顺序重写 indices。验证（Sussurro_v1_0041，SL3）：基础区（M=N=1）82 quads、高洞（M=N=2）92 quads、1 行洞 72 quads 不触发填充；0 NaN、0 退化 quad、0 非流形边、全部共享边反向（全局一致 winding）、computeVertexNormals 填充顶点法线长 1 且朝外。未加 smooth（后续再加）。  - **恢复 branch region 面板「Show points on mesh」开关（0.2.39）**：branchRegionEditor 对话框补回 taper-toggle-stack 的 checkbox（id=branchRegionMeshPointsToggle），branchRegionMeshPointsVisible 默认 true（默认打开），change 事件控制 branchRegionMeshPointsGroup 显隐。

  - **修复多行侧面填充扰乱顶部桥接（0.2.44，关键索引 bug）**：拉高顶部选区（顶部缺口 M>1）时侧面填充把顶部拓扑弄乱。根因：ringBase（环起始索引）在带/直接桥接顶点推完后固定，但侧面填充的洞侧中间顶点是在 ringBase 固定之后才 pushBoundary 进 vertices——桥接顶点数组因此增长，而所有带面/填充面里已写入的 ringBase+s 环索引全部偏移了 fillHoleCount，导致环引用错位、整座桥（含顶部带）被破坏。修复：把洞侧中间行的 push 提前到 ringBase 固定之前（预推 + sideHoleCache 预种角点/直接桥接行，填充阶段只读缓存不再新增顶点），ringBase 因此包含全部桥接顶点，环索引保持正确。验证（更新后 Sussurro_v1_0041，SL3，顶部缺口 M=2/底部 N=3）：0 NaN、0 越界索引、0 非流形、环引用全部落在 [bc, bc+ringCount)；fill OFF 的 83 个顶点位置在 fill ON 中 0 缺失（既有几何逐字节不变，fill 仅新增 6 个洞侧顶点 + 10 个 quad）；填充 quad 全部凸、法线一致。  - **根骨骼随用户 twist 旋转（0.2.39，释放根部约束）**：分支子级扫掠种子 previousFrame 的 up 之前只取父切线投影（无 twist）→ 用户 rotate 调 pointTwists[0] 只转 gizmo、根环不动。修复：种子 up 再绕 seedTangent 施加 controlPointRotationAt(lock,0)（保留约束基准=父切线投影，释放旋转=完整用户 twist）；且扫掠 row 0 直接使用种子 frame（不再走 strandGeometryFrameAt 的 24°/ring 平行传输钳制，否则大 twist 下根环被钳到错误方向/跳变）。验证（Sussurro_v1_0041，SL3）：pointTwists[0] 增量 -1.0~+1.0 每 0.25 步，根环绕切线角与增量精确 1:1（-57.3°~+57.3°）；row0=种子（0.01°）、row1+ 继续平行传输（-24°/-48°/-72°）、0 NaN。

- **Phase 2.17 子发片桥接实现详解（已验收，分支 v0.1.4-Side-Topology）**：

  - **整体结构（buildBranchBridgeGeometry）**：子发片 root 环（sweep row0，方形 2:1 截面）通过「底部带 + 侧面直接桥接 + 顶部带 + 侧面 4 边填充」与主发片挖洞边界封闭成水密管。底部/顶部带连接环的底/顶弧到洞的底/顶边（列数 = 环宽），侧面直接桥接把环的左/右 1 边接到洞侧 root 行（rootRow..rootRow+1）。

  - **侧面填充索引规律（顶/底分开、左右各执行一次）**：当某条带为间接桥接（顶部 rootRow > rowMin、底部 rootRow < rowMax，即至少一条侧边留空）时该侧启用填充。从侧面直接桥接出发，主发片孔洞的一条边 ↔ 顶/底带的一条边 1:1 对应，一直索引到洞角；剩余一条带边按既有拓扑规律作为收尾边 → 全部 4 边面、无三角。带的外侧 mid 列（bandEdge：环角 → mid_1..mid_M → 洞角）与洞侧（holePath：环角 → vTop(=rootRow) → ... → 洞角）等长（都 M+2），quad = [bandEdge[i], bandEdge[i+1], holePath[i+2], holePath[i+1]]，i=0..M-1。

  - **0.3 末端预留段的作用**：顶/底带在 parent 端 0.3 处多插一条 mid 行（midCount === 段数），使带边与洞侧计数 1:1 匹配——没有它带边会比洞侧多 1 条边，填充只能出三角。这是「无三角」的关键前提，guard 里用 midCount === M 校验。

  - **顶点共享与水密**：带/直接桥接的角点与直接桥接行（vTop/vBottom）预种到 sideHoleCache；洞侧中间行（rowMin+1..rootRow-1 等）必须在 ringBase 固定前 pushBoundary（否则推后会让环索引整体偏移，破坏整座桥——0.2.44 的关键 bug）。填充只读缓存，不新增顶点。带宽必须等于 ringWidth+1（无折痕列错配），否则该侧保守跳过。

  - **法线朝向（winding）**：填充 quad 发射后用共享边一致性传播（BFS）统一 winding——从左右直接桥接（0.2.42 既有正确朝向）出发，相邻面必须反向遍历共享边（多行条带内侧 quad 也一致），最后重写 indices。

  - **Uniform Smooth（0.2.45）**：对填充/桥接带内侧 mid 顶点做迭代 Laplacian（Bridge Smooth Strength 0~1 + Bridge Smooth Detail 0~8 次），环（sweep row0，位置从 ringWorld 读）与主发片孔洞边界为固定锚点；每次迭代先按邻接平均算目标再整体应用。只移动桥接部分，不动扫掠/父发片。

  - **注意事项**：1) 千万别在 ringBase 固定后再往 vertices 里推顶点（任何 push 都要放在 ringBase 之前或用缓存）；2) 带宽/环宽错配（折痕列）时跳过填充而不是硬填；3) 平滑只动 bridgeVertexCount 内的非 boundaryParentIndices 顶点，且邻接读取用 positionAt（环索引从 ringWorld 解析，否则越界 NaN）；4) 填充/角/边拖拽都要以橙色中心为钳制边界，避免蓝点越界产生非法区。

  - **验证基线**：Sussurro_v1_0041（SL3，区域 rowMin=11/rowMax=14、colMin=2/colMax=3、ringW=2）——基础 66 quads、拉高顶/底后按缺口数量增加；0 NaN、0 退化、0 非流形、全部共享边反向（全局一致 winding）；fill OFF 的顶点位置在 fill ON 中 0 缺失（既有几何不变）。

- **桥接规律总结（供后续写「无子骨骼桥接对比 + 技术要求」md 参考）**：

  - **挖洞**：按 region 的 rowMin/rowMax/colMin/colMax（真实网格列，含折痕 skipCol 列映射）删父发片对应 quad；每次重建父级全新网格再挖一次（幂等，不累积删面）。

  - **桥接带**（buildBranchBridgeGeometry）：子环=2×1 方形截面（宽:高），W 段=父洞口顶部真实边数；扫掠从 branchSweepStartT（默认 0.1，黄色手柄 0.02-0.6）开始，根部环=扫掠行 0 环（复用顶点）。顶带 topSegments=rootRow-rowMin、底带 bottomSegments=rowMax-rootRow，每列 1:1 quad；两端切线分别贴合子环切平面与父表面切平面（Hermite/smoothstep，2.14 双边法线）。侧面直接桥接 left/right 各 1 quad 按世界侧匹配。

  - **末端循环线**：仅间接桥接（侧面存在 ≥1 条边空隙：顶 rootRow!=rowMin、底 rootRow!=rowMax）时，最后一段 0.3 处额外加一行给侧面填充锚点防三角；直接桥接（根贴区域边缘）不加，单 quad 直连。顶/底分开判断。

  - **侧面填充**（triangulatePolygon3D）当前禁用（BRANCH_SIDE_FILL_ENABLED=false）。

  - **法线**：桥接父侧边界顶点在 computeVertexNormals 后恢复父发片作者法线（boundaryParentIndices），接缝平滑、无零长度法线。

  - **线框**：sweep 索引在前、桥接追加在后 + authored triangleEdgeMasks（扫掠交替 [0,1,1]/[1,1,0]、cap/桥接按全边），避免 quad 对角线描边。

  - **选区宽度=1 支持**：`branchRegionTopEdgeCount` 最小 1、`squareChildRing` 允许 widthSegments=1（4 点环）；桥接 top/bottom 带条件 `holeTop/collapsed.length>=3` → `>=2`，`ringTop[2]/holeTop[2]` 固定索引改 last-index（`ringTop[ringWidth]`/`holeTop[length-1]`），1 宽洞口顶部/底部补全与直接桥接可工作；顺带移除 `createBranchChildGeometry` 中已无用的 holeHalfWidth 死代码（Phase 2.12 后 halfWidth 跟随 Width 属性）。验证：left=0.52/right=0.48 → topEdges=1/ringW=1，桥接 8 quad（顶 3+底 3+侧 2），127 顶点 0 NaN。

  - **端点特殊操作补全（2.13 修正）**：顶/底桥接端点 0.3 处额外循环线不再要求 `midCount>0`，单段直连（topSegments/bottomSegments=1）也会触发——否则 1 格直连带的端点在侧面收口时又退化成三角面。验证：1×1 直连 顶2+底2+侧2=6 quad（原 4）；分段/默认情况不变，maskCount=triCount、0 NaN。版本 0.1.4-Sintaka.0.2.15。

  - **Width 滑动条修复**：子发片环宽从被选区洞宽锁定改为跟随自己的 Width 属性（横向 SEGMENT 数仍跟选区拓扑）。验证：Width 0.16->0.3->0.12，子发片根宽 0.147->0.275->0.110。

  - **末端循环线（特殊操作）**：顶/底条带触发桥接补全（段数>1）时，最靠近主发片的最后一段在距主发片 0.3（单 poly 高度比例）处额外划分一行循环线，给侧面填充额外环，避免最后一个侧面成三角面。

  - **子发片横向拓扑扩展**：子环宽度段数由主发片选区顶部真实边数决定（branchRegionTopEdgeCount 去重折痕列）；squareChildRing 支持任意宽度段数（默认 2），桥接按 ringWorld 推导 W 并动态索引。验证：选区加宽（right=0.1/left=0.9）ring 宽 2->6，几何无 NaN、掩码一致。

- **子发片深度重置 2.10（底部段数镜像顶部 + 手柄半径减半）**

  - **底部段数**：bottomSegments 由 rowMax-rootRow+1 改为 rowMax-rootRow（镜像顶部 rootRow-rowMin）。root 位于洞底（rowMax==rootRow）时=1 直连、不触发分段；hole 向下延伸才分段。验证：rootRow=11/rowMax=11 -> bottom 1（直连）；rowMax=14 -> 3、rowMax=17 -> 6；顶部不增。

- **子发片深度重置 2.9（侧面直接桥接接到根部 + 顶部分段修正 + 手柄缩小）**

  - **侧面直接桥接定位**：原 sideSpecs 连到洞底边（rowMax/rowMax+1），会跟着底部上下跑。改为连到**子发片根部所在行**（boundaryAt(rootRow, col) / rootRow+1）——子环 2x1 的 1（侧面）直接桥接到中间被删面的对应边，不随底部移动。

  - **顶部分段多一段修正**：topSegments 原来 rootRow-rowMin+1 恒多一段（像光标在末尾）；改为 rootRow-rowMin（底部 rowMax-rootRow+1 本就对齐洞底边界，不动）。验证：rootRow=11/rowMin=9/rowMax=11 -> top 2、bottom 1；延长底部 -> top 不增、bottom 增。

- **子发片深度重置 2.8（恢复底部桥接：带状复刻顶部逻辑）**

  - 关闭 BRANCH_BRIDGE_DIAGNOSTIC；底部从 connectSide 直连改为与顶部一致的**带状桥接**：ring bottom(3,4,5) <-> 洞底(collapsed)，分段 bottomSegments=rowMax-rootRow+1（root 相对，与顶部对称），Hermite 复用共享的 hermite/rootRow。

  - **底部主发片端折痕**：m1 = 0.5*表面切线 + 0.5*反向父级法线（不顺着底部法线而是反一下、约 0.5 权重，非完全切线）——到达端形成尖锐折痕。

  - **拓扑/分段一致**：底部与顶部同样 2 列 × bottomSegments 行、绕序 [parentRow, childRow, childRow+1, parentRow+1]、掩码 [0,1,1]/[1,1,0]。验证：初始 20 bridge tris（顶 2+底 2 行+侧 2 quad），延长底部 -> 40 tris（底 7 行、顶 2 行不变）；法线全部朝外（dot>0），无 NaN、maskCount=triCount。

  - 侧直接桥接恢复；三角剖分侧填充继续禁用（BRANCH_SIDE_FILL_ENABLED=false，待重做）。

- **子发片深度重置 2.7（smoothstep 主发片端切线 + 面板缩小 + sweep 手柄可见 + 刘海排查）**

  - **顶部桥接主发片端切线修正**：原用弦方向做 Hermite 终点切线（带垂直到达、凸起），再加 sin 外凸更严重。改为 m1=弦方向投影到父级切平面（去掉父级法线分量）——带沿中心线走、到达端平行父级表面切线、不再凸起/凹进；去掉外凸 bow。

- **子发片深度重置 2.6（面板渲染修复 + smoothstep 外凸 + 分段相对 root + devlog 拆分）**

  - **顶部桥接 smoothstep 可见**：中心线 Hermite（两端切线=弦方向）退化成直线。新增沿父级孔洞处 frame.z（朝外法线）投影到带法平面的外凸：中间行 sin(pi*f)*0.3*span，两端为 0，可见且不凹进父级。

  - **桥接分段相对 root**：原 topSegments=完整洞高，延长底部会让顶部条带也加段。改为 topSegments=rootRow-rowMin+1（rootRow 由 branchParentParameter 推算；root 在洞下方时回退全高）。验证：延长底部 5->5 不变，上移顶部 5->6 增加。

- **子发片深度重置 2.5（拖拽修复 + width curve 持久化 + 桥接沿中心线）**

  - **width curve 联动确认 + 持久化**：子发片扫掠已应用 taper/depth curve（相对扫掠起点归一化，根环保持洞口宽）；实测真实 UI 拖拽 width curve（tip 0->0.706）子发片 tip 宽度 0->0.0538 生效。新增 `branchCurvesAuthored`：子发片自身曲线被编辑后标记，updateBranchChildren 不再用父级 remap 覆盖（编辑不再被冲掉）；序列化/恢复。

  - **顶部桥接 Hermite 沿中心线**：原用孔洞顶点表面法线作终点切线，法线方向与桥接带方向(主要 -y)不一致(孔洞法线主要 -z)导致到达端横向摆动凹进主发片；改为两端切线都用 ring->hole 中心弦方向，带沿中心线走（后续可给中心线加 NURBS 控制点细化）。

  - **顶部桥接绕序修复**：通用循环发出的 quad 绕序与原版相反（内翻），FrontSide 线框 overlay 把背面剔除 -> 顶部桥接看不到拓扑；改为 [parentRow, childRow, childRow+1, parentRow+1] 与原版一致。

  - **smoothstep 改 Hermite**：只插值位置会在孔洞处凹进主发片；改为 Hermite 插值——起点切线沿桥接方向、终点切线用主发片表面法线（按跨度缩放），两端位置与法线都匹配，不再内凹。

- **子发片深度重置 2.4y（选区钳制修复 + 桥接诊断模式）**

  - **桥接诊断模式（临时）**：BRANCH_BRIDGE_DIAGNOSTIC=true —— 只输出顶部条带（顶部桥接 + 分段），底部桥接 / 侧面直接桥接 / 侧面三角剖分填充全部禁用，先隔离定位"全乱"。验证：仅顶部条带时 344 tris（扫掠 312 + 双面端盖 12 + 顶部条带 20），无 NaN。

  - 待诊断结论：2.4x 的侧面三角剖分（triangulatePolygon3D）曾测出桥接区 count-4 非流形边（重叠面），为"全乱"最大嫌疑；顶部条带 smoothstep 圆滑（中间行内凹 0.2×跨度）是"整个面凹下去"的候选原因。

- **子发片深度重置 2.4x（桥接动态分段 + 选区归一化 + width curve 联动 + sweep 起点手柄）**

  - **桥接程序化**：buildBranchBridgeGeometry 重写。顶部条带分段数改为洞高度 H(rowMax-rowMin+1) 驱动，不再写死 2 段；中间行用 smoothstep 插值 + 桥接圆滑(0.2 系数、两端为 0 中间最大、随重建实时重算)；侧面填充改为三角剖分(triangulatePolygon3D: Newell 法线 + ShapeUtils.triangulateShape)，任意洞高都水密；底部 connectSide、侧面直接桥接保留。

  - **width curve 联动**：子发片扫掠应用自己的 taper/depth curve(相对扫掠起点归一化，根环保持洞口宽度)；子发片宽度随自身或父级宽度曲线(updateBranchChildren 重映射)变化。

  - 验证：洞变高桥接面数随之增加(动态分段)；tip 宽度随 taper 形状 0.145->0.032->0.195；手柄拖拽 0.1->0.03；无 NaN/索引越界。

- **[TEMP] 子发片桥接基础版小结（2.4a→2.4q，验收完成，后续补动态补全）**：当前桥接 = **底部（2 quad）+ 侧面直接桥接（左/右各 1 quad）**，共 4 quad、0 三角（后续补 top 侧 + 动态补全）。约定与注意事项：

  - **src（父侧）与 dst（子侧）**：src = 父发片洞边界（holeBoundary，12 顶点，含折痕列），dst = 子发片扫掠行 0 环（guideT=0.1，**6 点 2×1 环**，**直接复用扫掠顶点**，按索引引用）；桥接 = **bottom（2 quad，1:1 实边）+ 侧面直接桥接（left/right 各 1 quad）**。

  - **坐标方向**：① 洞 bottom = rowMax+1（朝父末端、横向，2 条实边 c2→c3 / c4→c5），top = rowMin，left/right = 竖向；② 子环 bottom = 环点 3/4/5（local z=-hd，宽向 2 段），top = 0/1/2，left = 2/3、right = 5/0（高向 1 段）；③ 匹配方向：src 与 dst 都按同一方向（左→右 / 上→下）排列后按位 1:1（父左实边↔环左底边、父右实边↔环右底边、父侧边底部段↔环左/右侧），不会交叉。

  - **折痕接缝（关键坑）**：linear 控制点让网格某列（col3≡col4）没有任何面起始 → 区域列是"虚拟列"，必须从父 quadFaces 推导 skipCol 映射到真实网格列；挖洞实际删的是 col2 和 col4，洞底暴露边延伸到 col5（两条实边）。

  - **数据一致**：桥接父侧顶点读父几何 normal/tangent（按网格索引）；环侧复用扫掠顶点（含 uv/color/tangent）；**扫掠索引在前、桥接索引在后**，线框用 triangleEdgeMasks（每 quad [0,1,1],[1,1,0]），法线用 computeVertexNormals（与原版发丝一致），否则桥接会显示成三角面。

  - 验证基线：Side Left 3 = 170 顶点 / 996 索引 / 160 quadFace（156 扫掠 + 4 桥接 quad + cap fan），0 退化、0 NaN。文件 Sussurro_v1_0032.ahs。

- **子发片深度重置 2.4i（扫掠起始归一化）**：子发片扫掠不再从根部开始，改为从引导线参数 0.1（写死）到 1.0，归一化回 [0,1] 扫掠；[0,0.1] 根部段留给桥接/连接。验证：Side Left 3 = 223 顶点 / 210 quad（2 桥接 + 208 扫掠 + 端盖），首环 y≈0.88（非根部 0.92），0 报错。

- **子发片深度重置 2.4h（规范化：1×2 区域 + 底部单侧桥接）**：按用户规范化思路——① 区域改为 1×2（up/down=0 → 1 行，左右 2 列）；② 取消根部偏移（applyBranchRootOffset 禁用），RootControl 环对齐父引导线（父级 frame at 附着参数），扫掠偏移暂时归 0；③ 桥接只处理 bottom 侧（2 边 ↔ 子环 2 段），其它三侧先不接。验证：Side Left 3 = 223 顶点 / 210 quad（2 桥接 + 208 扫掠 + 端盖），洞=row10×cols2-3，0 报错。

- **子发片深度重置 2.4g（桥接注意事项 + 重试桥接）**：注意事项——子骨骼根部有 end-cap（截面三角 fan），启用桥接后必须去掉根部 cap（由桥接填充），只保留尖端 cap。桥接重新接入：marching 缝合（quad+接缝三角），桥接顶点法线取父级表面法线（按网格索引查父几何 normal 属性）、环顶点法线取径向；环朝向用父级表面 frame（区域中心）以对齐洞的四边。验证：Side Left 3 = 243 顶点 / 222 quad（12 桥接 quad + 2 接缝三角 + 208 扫掠 + 端盖），根部 cap 已去掉，0 报错。

- **子发片深度重置 2.4f（子几何复刻原版 sweep，定位 shader 碎裂）**：对比原版发丝构建后确认差异——原版用**径向法线**（normals=ring 向量）+ **tangent** + **端盖 cap 三角**，而我的子几何用了 computeVertexNormals 平滑法线且缺 tangent/cap。子几何改为逐行复刻原版（径向法线 + tangent + 端盖，仅剖面换成 8 点方形环）。验证：Side Left 3 = 218 顶点 / 208 quad + 16 cap 三角 / 1296 索引，shader=anime-anisotropic，DoubleSide，0 报错。

- **子发片深度重置 2.4e（暂停对接，隔离子骨骼扫掠渲染）**：对接模块暂时禁用（BRANCH_CONNECTION_ENABLED=false，怀疑对接扰乱了点序/索引导致显示异常），子骨骼先只保留方形环扫掠（1.5 poly 前移偏移、末端归 0）。验证：Side Left 3 = 216 顶点 / 208 quad / 1248 索引，DoubleSide，零长度法线 0，0 报错。待确认扫掠渲染正常后再重新接入对接。

- **子发片深度重置 2.4d（对接改为 marching 缝合）**：连接模块弃用"顶点坍缩"（会产生退化/扭曲 quad），改为逐侧 marching——段数相同纯 quad，段数不同在接缝处插少量三角面（每个错配侧 1 个）；修复 Infinity<=Infinity 死循环并加迭代上限。验证：Side Left 3 = 242 顶点 / 220 quad + 2 三角（12 对接 + 208 扫掠），DoubleSide，0 报错。8 边对 10 边复杂场景可完成对接。

- **子发片深度重置 2.4c（显示/偏移/补全修正）**：① 扫掠起点偏移改为 1.5 个 poly 宽度（子级曲线长度/段数，写死，后续接 control）；② 分支子级网格强制 DoubleSide（避免 quad 两三角形绕序不一致导致的半三角缺面；高亮与主 shader 不再互不补）；③ 根部方形环朝向改用父级表面 frame（区域中心），让方形环贴合洞的方向，补全按当前 orient 近似。验证：Side Left 3 242 顶点 / 216 quad，materialSide=DoubleSide，0 报错。连接条带细节后续迭代。

- **子发片深度重置 2.4b（子几何显示修复 + 扫掠偏移）**：分支子级几何补齐 uv / color 属性（anime 各向异性是裸 ShaderMaterial，缺属性导致每 quad 只渲染一半三角形）+ 法线零长度兜底；扫掠起点沿子级切线前移（branchSweepOffset，默认 0.08）并随 t 平滑过渡到末端 0，为对接留出空间。验证：Side Left 3 242 顶点 / 216 quad，position/normal/uv/color 齐全 0 NaN，0 报错。对接条带（10→8）后续再修。

- **子发片深度重置 2.4a（对接框架）**：新增 modules/branch-connect.js —— 方形横截面环（4 面×2 段=8 点 8 段）、父级洞边界提取（10 段，含各边段数）、逐侧对接（段数多的一侧做顶点坍缩，只出 quad 不出三角面）。分支子级几何改用 createBranchChildGeometry：父洞边界(10) → 方形环(8) 对接条带 + 方形环沿子级曲线扫掠。验证：Side Left 3 拓扑 242 顶点 / 216 quad（8 对接 + 26×8 扫掠），0 报错；拓扑框架已就绪，视觉细节后续迭代。

- **子发片深度重置 2.2b（挖洞索引修复）**：挖洞改为只删除对应面片的 6 个索引，保留两端封口三角形与原作者法线（不再 computeVertexNormals 覆盖），并同步更新 sideTriangleCount，避免 shader/高亮因索引与法线不一致而只渲染每 quad 一半三角形。验证：Side Left 2 index 1584 = 254 面×6 + 60 封口，maxIndex 298，quadFaces 254。

- **子发片深度重置 2.2（程序化挖洞 + 根部偏移）**：.ahs 只存引导参数、加载时程序化重建网格，因此挖洞做成数据驱动、每次重建时重放——父级（有分支子级的发带/发片）按子级 branchRootRegion 的 (u,v) 区域把 quad 网格对应面片删除（面映射按 quadFaces 数组行列位置，兼容剖面缺边/闭合 wrap）；区域默认「左侧 2 格宽 × 上 2 行下 1 行」（BRANCH_ROOT_REGION_DEFAULTS，centerV=0.25）。子级根部（points[0]）偏移到区域中心（applyBranchRootOffset）。恢复存档后统一跑一遍挖洞+偏移（restoreSceneCollectionsForStateRestore）。验证：Sussurro v0012 的 Side Left 2 面数 260→254（删 6 面），Side Left 3 根部已偏移。
