# Region 选区 / 面板

> 由 devlog/js-change-annotations.md 拆分而来；入口见 devlog/README.md。

> 相关函数/关键词：branchRootRegion、normalizeBranchRootRegion、syncBranchRootRegionOffsets、updateBranchRootRegionCenter、branchRegionNavAction、setBranchRootRegionPoint、选区面板/橙色中心/蓝点

> 说明：条目按子系统归类，同一开发阶段（2.x / Phase 2.15 等）的条目可能分散到多个文件，请按关键词跳读。

- **子发片深度重置 2.4u（矩形选区控制器 + 子横向拓扑跟随洞口）**：实现 4 点矩形选区控制器——① 数据模型：branchRootRegion 抛弃中心点（新 region 只含 cross.up/down/left/right 4 点，旧文件带 center 兼容）；② 世界点：branchRootRegionWorldPoints 把 4 点吸附到父发片 geo 表层（区域边缘中点网格顶点）；③ 控制器：选中子发片时显示 4 个浅蓝选区点 + 1 个根骨骼点，拖拽时 raycast 父发片表面 → branchSurfaceParamAtWorld 求 (u,v) → setBranchRootRegionPoint 更新并重建/重挖；根骨骼沿父引导线滑动（u only，enforceBranchRootPosition，非 slide 笔刷）；④ 子横向拓扑：createBranchChildGeometry 的 halfWidth 改为由父孔洞横向切面世界跨度决定（region 左右边列距离/2），验证子环宽 0.089≈洞 0.09（原 0.16）。注：桥接 smoothstep 仍不理想、底部桥接按需拓展与侧面 3D 待后续。

- **子发片深度重置 2.4u 更新（控制器方向修正 + 小手柄默认显示）**：① 4 个选区点改**小手柄**（半径 0.02，同 width curve 点，非骨骼关节大）；② **默认直接显示**（不加开关，子发片可见即显示）；③ 横竖方向修正：默认 up=朝根部（较小 u）、down=朝尖端（较大 u）、left=较大 v（世界左）、right=较小 v（世界右），worldPoints 相应 up=rowMin/down=rowMax/left=colMax/right=colMin；branchRootRegionSurface 用 min/max 归一化，旧文件（pre-2.4u 顺序）也能得到正确矩形区域；④ 拖拽条件放宽（不再要求 strand 编辑模式，锁定不可拖）。

- **子发片深度重置 2.4u 更新（撤销修复 + 移除橙色点 + 根骨骼引导线滑动）**：① Ctrl+Z 修复——选区拖拽在**开始拖拽时 pushUndoState 一次**（整个拖拽为一次撤销操作），不再每次移动都 push（否则撤销会直接回到初始加载）；② 删除中间橙色根控制点，改用**子骨骼根部**作为 4 个浅蓝选区点的 parent；③ 根骨骼移动改为**沿父引导线 2D 平面平滑滑动**（enforceBranchRootPosition 从 points[0] 重算最近 guide 参数 u，再吸附到引导线曲线点）。④ 排查：刘海三角面问题经 2.4t worktree 对比确认**不是 2.4u 引入的回归**——Side Bangs Left 5/Right 4 的父级（Left 1/Right 1）是 split 发丝（无 grid），createBranchChildGeometry 一直返回 null（pre-2.4u 亦如此），刘海一直走普通发丝路径。

  - **矩形选区控制器（本次做）**：5 点选区改 **4 点**（抛弃中心橙色 RootCtrl，仅保留 4 个十字浅蓝边界点）；4 点定义父发片表面矩形拓扑（u=沿长度、v=沿宽度），依据主发片走向选择，确保矩形；4 点是 parent→子骨骼 root 的选区控制，**吸附在父发片 geo 表层**；根骨骼控制沿**引导线**滑动（不是 slide 笔刷的多点扭曲逻辑）；子发片横向拓扑（2×1 的 2）直接由父孔洞横向切面决定。

- **子发片深度重置 2.14（选区边界不塌缩 + 骨骼点击选中增强）**

  - **选区边界压缩恢复**：region 新增 `edgeOffsets`（center→up/down/left/right 的距离，随点拖拽/恢复/克隆同步）；`updateBranchRootRegionCenter` 与面板矩形整体拖动改为「center ± edgeOffsets」派生 4 点（原先逐点 += delta 并各自 clamp 到 [0,1]），根骨骼拖到边界触发压缩后回到中心时**恢复原始宽高**，不再残留一条窄竖线需要重新拖开。旧文件缺 edgeOffsets → 恢复时由 cross 点计算（兼容）。验证：v 边界 v=1 压缩 vSpan 0.24→0.12，回到 v=0.5 恢复 0.24；u 边界同理。

  - **版本**：0.1.4-Sintaka.0.2.16（dailybuild +1）+ app-config 缓存号 bump。

  - **Region 左右方向修正（0.2.18 翻转面板映射的修复不完整，已回退 + 改修根骨骼 v 符号）**：用户从右后方视角操作——世界左(-X) 在视口右侧，因此原面板映射（大 v = 世界左画在面板右侧）本来就与视口一致，0.2.18 把 v→x 翻转成「面板左 = 世界左」反而让选区与主发片对应左右反了。真正的问题在 `enforceBranchRootPosition` 的 v 符号：实测 Side Left 2 的 frame.x=(0.619, -0.025, -0.785) 指向右后方（较小 v 一侧），原式 `v = 0.5 + across/width` 会让根骨骼往该侧拖时 v 增大、选区反而移向世界左。修复：回退 `branchRegionUVToCanvas`/`branchRegionCanvasToUV` 到 `x = 20 + v*180`（大 v 在面板右侧），并把根骨骼 v 改为 `v = clampRegionParam(0.5 - across/width)`。验证（Sussurro_v1_0040：SL2 父 / SL3 子）：left 点世界 x=-0.8445（世界左）、right 点 x=-0.6838（世界右），面板 left 点 cx=74 右侧 = 视口右侧一致；根骨骼向世界左移 → v 增大 → 选区跟随世界左（面板 cx 增大，右后方视角下同步正确）。

  - **Region 选区记忆（0.2.20）**：编辑选区（拖点/拖矩形）后再移动子骨骼任意骨骼、只要触发根骨骼移动/旋转，enforceBranchRootPosition → updateBranchRootRegionCenter 会把选区中心重新吸附回根骨骼 (u,v)——形状（edgeOffsets）保留但中心回到「编辑前」，用户的手动调整被冲掉。修复：region 新增可选 boneSync（上次同步的根骨骼 u/v），updateBranchRootRegionCenter 用「当前中心 − boneSync」作为相对偏移，骨骼移动后中心 = 新骨骼位置 + 偏移（跟随骨骼但保留用户手动偏移）；首次同步（boneSync 为空）以当前骨骼位置锚定并记录。boneSync 随 clone/mirror/快照/恢复持久化（旧文件缺省为 null → 首次同步锚定），branchRootRegionFromParam（新建/Reset）置 null。验证（Sussurro_v1_0040，SL2 父/SL3 子）：拖 down 点到 u=0.5（center.u 0.43）后移动根骨骼，center 不再吸附回 0.39，保持 0.43 并随后续骨骼移动按偏移跟随。

  - **region 橙色中心改为稳定锚点 + Ctrl 中心镜像缩放 + 面板提示（0.2.41）**：之前橙色中心 = 四边点几何平均，拖任意单边（如只拖底部）中心跟着变。修复：region.center 改为稳定锚点（橙色标记位置、也是直接桥接 rootRow 的位置），syncBranchRootRegionOffsets 只在缺失时初始化一次、不再随单边编辑重算；buildBranchBridgeGeometry 的 rootRow 与 branchRootRegionWorldPoints.center 改用锚点（clamp 进洞内），移动整个 region/骨骼时平移跟随、单边编辑不再移动桥接；updateBranchRootRegionCenter 与面板 move 模式改为对全部边+锚点做纯平移（避免 anchor≠几何中心时用 center+offsets 重建产生偏移），并记录 startCenter 保证拖拽中幂等。新增：按住 Ctrl 拖动橙色中心 = 两侧镜像缩放（围绕固定中心，主导轴上的上下或左右两边对称外扩/收缩）；面板下方新增一行小字提示。验证（Sussurro_v1_0041，SL3）：只拖 down +0.06 → center 保持 (0.36875, 0.4262)；拖中心平移 → 各边+锚点同一 delta 纯平移、形状不变；Ctrl 拖中心 → center 不动、up/down 对称外扩；骨骼移动 → 形状保留平移；bridgeAnchorRow=10（锚点）≠ geomRow=11（单边编辑后）；0 NaN。

  - **子发片桥接 Uniform Smooth + Region 面板增强（0.2.45，Phase 2.17 收尾）**：
    1) **桥接 Uniform Smooth（仅作用于子发片桥接部分）**：右侧 Hierarchy 面板新增「Bridge Smooth Strength」(0~1，默认 0.5) 与「Bridge Smooth Detail」(0~8 次 Laplacian 迭代，默认 1) 两个滑杆（localStorage 持久化 anime-hair-studio-branch-bridge-smooth-{strength,detail}，改动重建分支子级）。算法：对侧面填充/桥接带的内侧 mid 顶点做迭代 Laplacian（detail=迭代次数，strength=每遍强度），环（sweep row0）与主发片孔洞边界保持固定锚点（不移动），每次迭代先按当前邻接平均计算目标再整体应用；只移动桥接部分顶点，不动扫掠/父发片。验证（Sussurro_v1_0041，SL3）：strength 0→1 移动 6 个填充 mid（最大 0.022），strength=1/detail=3 时 0 NaN、0 退化 quad、0 非流形（水密保持）。
    2) **Region 面板局部缩放（Houdini Alt+右键）+ Reset Zoom**：branchRegionCanvas 的 viewBox 支持局部视图缩放——Alt+右键拖拽按 Houdini 导航同款方向逻辑（垂直：上=缩小/下=放大，水平：右=缩小/左=放大；快速模长近似归一化）围绕指针内容点缩放（min 5.5x in / 0.5x out），控制点拖拽的坐标映射同步加 viewBox 原点偏移（缩放后拖点/角仍精确）。对话框新增「Reset Zoom」按钮恢复 220x400 满视图。
    3) **Region 4 侧蓝色控制器不能越过橙色中心**：setBranchRootRegionPoint 对 up/down/left/right 的钳制从只相对对侧边改为相对 region.center（橙色锚点）——up.u <= center.u-0.02、down.u >= center.u+0.02、left.v >= center.v+0.02、right.v <= center.v-0.02，蓝色点无法越过中心进入非法区。
    4) **Region 4 角对角缩放**：面板新增 4 个角手柄（TL/TR/BL/BR，小方块，系统对角缩放光标 nwse/nesw-resize），拖角同时缩放 u 与 v（对角移动，对侧角固定），钳制仍以橙色中心为界；begin 拖拽同时匹配 circle 与 rect 手柄。

> 相关：另见 annotations-bridge.md（Uniform Smooth 算法见「Phase 2.17 实现详解」条目）。

  - **Region 面板导航增强 + Ctrl 镜像 + 桥接滑杆归位（0.2.46，Phase 2.17 收尾）**：
    1) **Region 面板缩放方向反转 + Alt+中键平移 + 滚轮缩放**：Alt+右键拖拽缩放方向反转为「右上角放大、左下角缩小」（垂直：上=放大/下=缩小，水平：右=放大/左=缩小；快速模长近似归一化），仍围绕指针内容点缩放；新增 Alt+中键拖拽平移查看（viewBox.x/y 按 viewBox/画布像素比例随指针位移）；新增滚轮缩放（以指针位置为中心，deltaY<0 放大 / >0 缩小，min 40×80 / max 440×800，与 Reset Zoom 共享钳制）。
    2) **导航预设映射（不再照搬 Houdini）**：面板平移/缩放手势按当前 Navigation style 映射——Houdini：Alt+中键=平移、Alt+右键=缩放；Blender：Shift+中键=平移、Ctrl+中键=缩放；Anime Hair Studio：Alt+右键=平移。Alt+中键平移在任意预设下都可用；滚轮缩放始终可用；非左键按下不再误触发选区编辑（beginBranchRegionCanvasDrag 增加 event.button!==0 守卫，中键/右键只走导航）。
    3) **Ctrl+drag 反向镜像（边点/角点）**：之前只有橙色中心支持 Ctrl 镜像缩放；现在 4 个边点与 4 个角点按住 Ctrl 拖拽时，被拖的点跟随指针、对面的点按相同增量反向移动（围绕成对中点镜像，橙色锚点不动）——up↔down、left↔right 成对；角点同时镜像 u/v 两个方向（对角线缩放），随后 normalizeBranchRootRegion + syncBranchRootRegionOffsets 保持有序与宽高意图。普通（无 Ctrl）边点/角点拖拽行为不变。
    4) **Bridge Smooth 滑杆归位（仅子发片显示）**：Bridge Smooth Strength / Detail 两个滑杆从 hierarchyPanel（只在 H 模式显示）移到独立「Branch Bridge」面板（data-attribute-panel="strands"），当且仅当选中子发片（lock.branchParentId 存在）时显示；Recursive Transform / Branch Root Curve Follow 仍留在 Hierarchy Edit 面板。

> 相关：另见 annotations-bridge.md（Bridge Smooth 滑杆与桥接重建联动）。

  - **Branch Bridge 滑杆换标准形式 + Region 面板中键平移（0.2.47，Phase 2.17 收尾）**：
    1) **Branch Bridge 两参数改用已有的 float+滑动条+重置按钮形式**：Bridge Smooth Strength / Detail 从手写的 `<input type="number">` 改成标准 `topology-control` + `<input type="range">`（面板补上 `sliders` 容器类），由既有 `setupEditableSliderControls()` 自动升级成「数值框 + 滑杆 + ⟲ 重置按钮」一行（重置回到 value 默认 0.5 / 1 并派发 input）。事件从 change 改监听 input（滑杆拖动、数值框输入、重置按钮都能即时触发持久化 + 桥接重建）；启动时恢复存储值后同步自动生成的数值框。
    2) **Region 面板按住中键也能平移**：`branchRegionNavAction` 改为任意导航预设下 `button===1`（中键）都返回 pan（与 Alt+中键一致），不再要求 Alt；Houdini 下 Alt+右键缩放、Blender 下 Shift+中键平移 / Ctrl+中键缩放、Anime Hair Studio 下 Alt+右键平移均保持不变（面板提示文案更新为 MMB / Alt+MMB = pan）。

> 相关：另见 annotations-bridge.md（Branch Bridge 参数与桥接重建）。

  - **Region 同步速度可调（0.2.52）**：新增两个「同步速度」滑杆（用既有 `setupEditableSliderControls` 自动升级为 浮点+滑杆+⟲重置，位于 Branch Root Region 面板 Show points 下方）：**Sync L/R（左右/横向，默认 0.45）** 与 **Sync U/D（上下/沿长度，默认 1.0）**，范围 0.1~2.0、localStorage 持久化（`anime-hair-studio-branch-region-sync-{lateral,vertical}`）。作用：`updateBranchRootRegionCenter` 的 du/dv 分别乘以 `branchRegionSyncVertical`/`branchRegionSyncLateral`（该函数唯一调用方是根骨骼拖动同步，不影响选区手动编辑）。左右默认 0.45（0.2.53 由 0.6 调低）、上下默认 1.0：0.45 使左右跟随明显变慢（更稳地抵消既有 ~1.6-1.9 倍横向比例），上下保持 1:1。验证：bone v 0.5→0.3 时 region v 按 0.6/1.0/0.8 分别移动 -0.12/-0.20/-0.24（精确匹配）；滑杆 type=range 且自动带数值框+重置按钮。

  - **调研：H 模式拖根时 Region 选区「2 倍速度左右同步」排查（0.2.52，无代码改动）**：
    1) 现象：开着 Hierarchy 移动子发片根部时，Region 选区看起来以约 2 倍速度左右同步、容易撞到边界；怀疑是 split 父发片「两根管」导致。
    2) 排查结论：Region 跟随链路（`enforceBranchRootPosition` → `v=0.5-across/width` → `updateBranchRootRegionCenter` → `branchRootRegionSurface.toCol` 弧形映射）对 split 与普通父发片**完全一致**——同一 v 公式、同一 parent.width、同一弧形 toCol、gizmo 手柄位置与骨骼重合（dist=0）。实测（0041 普通父 / 0042 split 父，SL3 子发片，根横向全行程 ±halfW）：两种父发片的 Region 世界位移量基本相同（centerZ 均横跨父发片横向全宽，约 -0.83↔-0.57），均在满行程才到边，**未复现 split 特有的 2 倍/半程撞边**。
    3) 尝试过的修复（均已回退）：把 split 的 v→列改为按「世界 frame.x 横向」或「fused 环 profile.x 横向」直接映射（profileX 曾附加到 splitFusedGrid）。两者在**偏中心选区（v≈0.25）都会产生非连续列区间**（colMin 13/colMax 23），因为 fused 环的列序不是横向单调（环会绕回），会挖错区域 → 回退到弧形映射（连续、桥接正常）。
    4) 结论：感知到的「2 倍」更可能是既有的横向映射特性（普通父发片同样存在），而非 split 两管引入；正确修复需要为 split 做「横向→连续弧形」映射（v 的两条横向边界对应到环上的一段连续前弧），工作量大且风险高，暂不改动以保证拓扑与单发丝兼容。若需继续，请提供可复现的具体操作（.ahs + 拖动方向/步数）以便定位。

> 相关：另见 annotations-split.md（split 父发片横向映射）。

  - **数据模型**：子级 branchRootRegion = 父发片表面 4 点选区（u=沿长度、v=沿宽度；up/down 只改 u、left/right 只改 v；left=较大 v=世界左、right=较小 v=世界右；右后方视角下面板大 v 在右侧）；edgeOffsets=中心到各边距离；boneSync=上次同步的根骨骼 u/v（编辑选区后移动骨骼保留手动偏移）。

> 相关：本条目为「桥接规律总结」的一部分，其余条目见 annotations-bridge.md。

- **子发片深度重置 2.13（Transform 空间持久化 + 选区健壮性 + 宽度=1 支持）**

  - **选区健壮性（修复"点一下选区点跳到另一侧"）**：新增 `normalizeBranchRootRegion`——up.u<down.u、left.v>right.v 顺序归一化 + 最小跨度 0.02；`restoreLock` 恢复存档时统一归一化（旧文件倒置选区不再跳变，洞行列不变），`setBranchRootRegionPoint` 先归一化再钳制，`updateBranchRootRegionCenter` 移位后也归一化。验证：v0040 Side Left 3 加载后 up/down、left/right 顺序正确且洞仍为 row9-11/col1-2；拖 up 点 30px 平滑跟随不跳变。

  - **根滑动跟随面板刷新**：`updateBranchRootRegionCenter` 末尾补 `renderBranchRegionEditor()` + `updateBranchRegionMeshPoints()`（原先只重建几何，浮动面板/3D 标记不更新，拖根后看不到选区跟随）。验证：moveRoot(0.05) 后面板圆点坐标更新。

  - **版本**：0.1.4-Sintaka.0.2.14（dailybuild +1）+ app-config 缓存号 bump。

- **子发片深度重置 2.11（选区整体拖动 + 末端循环线 + 横向拓扑扩展 + 版本 0.2.12）**

  - **选区整体拖动**：Branch Root Region 面板可拖**矩形内部**整体平移选区（4 点同 delta 移动，钳制到 [0,1]），矩形加 move 光标。

  - **版本号**：APP_VERSION 改为 0.2.12-Sintaka.00001（主版本对接 git graph，Sintaka 后 dailybuild 5 位）。

  - **Branch Root Region 面板缩小**：viewBox 220x520->220x400、SVG aspect 11/26->11/20、dialog 宽 280px（原 360）；移除 Show points on mesh toggle；Reset region 精简为 Reset。验证：SVG 254x462（原 334x789）。

  - **Branch Root Region 面板渲染修复**：.branch-region-canvas 的 aspect-ratio 规则写在 .taper-canvas 之前（同优先级后者胜出），SVG 按 26/11 宽渲染、竖长内容被 letterbox，导致左边界跑到中间偏左、右侧超出、拖拽比例错乱。改为 ID 选择器 #branchRegionCanvas 且放在 .taper-canvas 之后。验证：rect aspect 0.423 == viewBox 0.423，拖拽点精确跟手。

  - **2D 面板拖拽漂移修复**：updateBranchRegionCanvasDrag 里指针->SVG 换算硬编码了旧 viewBox(520/220)，面板改竖长后(220/520)换算错误导致点被持续拖偏；改为动态读 `branchRegionCanvas.viewBox.baseVal`。验证：拖 left 点到画布 x=80 -> 点精确落在 x=80、v=0.333，无漂移。

- **子发片深度重置 2.4z（选区显示/映射修正 + 顶部桥接绕序/Hermite + 手柄可见性）**

  - **控制点边界对齐**：branchRootRegionWorldPoints 的 down/left 点改为 rowMax+1 / colMax+1（洞底/洞左真实边界，原来停在最后一个面的边内 1 poly）。

  - **面板竖长**：Branch Root Region SVG 从 520x220 横躺改为 220x520 竖长（viewBox、UV 映射、CSS aspect-ratio 同步）。

  - **v 映射修正（居中）**：父发片截面是闭合环，按列索引线性映射时 v=0.5 落在环的远端（世界左极值）——这就是默认偏右的根因。改为以 probe 行 frame.z（朝外法线）投影最大的 front 列为基准的环向弧映射（v=0.5=front），并把默认 v 跨度 0.06->0.24 让区域有实际宽度；colCount/skipCol 改为构建时固化（gridFacesPerRow/gridSkipCol），不再从已挖洞的 quadFaces 推导（洞变大后曾漂移 10->9）。

  - **控制点越界修复**：setBranchRootRegionPoint 的 MIN_REGION_SPAN 钳制（Math.min/max）结果未再夹到 [0,1]，可产生负值/超 1（右/下点显示到 -1）；现统一用 clampRegionParam 包住；renderBranchRegionEditor 显示层也加钳制兜底（旧文件越界值不再画出画布）。验证：极值拖拽后 u/v 全在 [0,1]，控制点均在画布内。

  - **Branch Root Region 默认值**：centerV 0.25->0.5(面板居中)，u 跨度 0.08->0.16、v 跨度 0.10->0.06(竖长)；setBranchRootRegionPoint 增加归一化钳制(up<=down、left>=right、最小跨度 0.02)，拖拽不再飞出/翻转。

- **子发片深度重置 2.4w（Reset 幂等修复 + 面板精简 + show points on mesh）**：① **Reset 累积删面修复**——根因：setBranchRootRegionPoint 之前只重建子发片、再对父级**已挖洞的旧网格**重复 applyBranchRootRegionCarving；挖洞会改写 quadFaces，重复作用在缩小后的数组上行列映射漂移，每次 Reset/拖拽多删几个碎面且不可恢复。修复：改为重建父级（rebuildLockGeometry(parent)，内部先 createHairGeometry 全新网格再挖洞一次），Reset/拖拽均幂等，多次 Reset 面数恒定。② 面板精简：删除说明文字（u=沿父级…），只留 Reset region 按钮。③ 新增 **Show points on mesh** toggle（同 Width/Depth Curve 面板）：在父发片表面显示 4 个选区点的 3D 标记（branchRegionMeshPointsGroup + branchRootRegionWorldPoints，沿 2D 拖拽实时跟随），关闭或取消选中时隐藏。

> 相关：另见 annotations-bridge.md（Reset 幂等与挖洞重放）。

- **子发片深度重置 2.4v（2D 矩形选区编辑器 + 刘海线框三角修复）**：① 坏的 3D 选区手柄（选不中、拖不动）整体删除，改为类似 Width/Depth Curve 的 **2D u/v 平面编辑器**——新增 `#branchRegionEditor` dialog（SVG 画布 520×220，u=沿父发片长度、v=沿宽度）；4 个浅蓝选区点 **up/down 只改 u、left/right 只改 v**（默认位置横竖方向沿用 2.4u 修正：up=朝根部较小 u、down=朝尖端较大 u、left=较大 v 世界左、right=较小 v 世界右）；选中分支子级自动打开、选中普通发片自动关闭（`retargetBranchRegionEditor` 挂入 selectLock）；拖拽开始 `pushUndoState()` 一次（整个拖拽=一次撤销，不再退回初始加载）；Reset 按钮恢复默认区域；新增 CSS `.branch-region-rect`。② **修复 index.html dialog 嵌套 bug**：branchRegionEditor 之前误插在 taperCurveEditor 内并吃掉它的闭合标签，导致其后所有 dialog（UV Inspector / Save / 预设等）全部嵌套进 taperCurveEditor、0 尺寸不可见——已恢复为 BODY 顶级并列，各面板回归正常。③ 刘海 split 发丝线框三角修复见「Bug 修复」。

> 相关：另见 annotations-display-fixes.md（刘海线框三角修复）。

- **子发片深度重置 2.1b**：恢复旧存档时，有 branchParentId 但缺 branchRootRegion 的分支子级自动回填根区域（branchRootRegionFromParam）；几何生成器（发带/发片 sweep）输出 gridRows/gridColumns；新增 branchRootRegionSurface() 把 (u,v) 区域映射到父级 quad 网格的 row/col 范围（仅控制点改动时重算，父级移动不碰）。验证：Sussurro v0012 的 Side Left 3 加载后自动获得 region，父级网格 27×11。

- **子发片深度重置 2.1（数据模型）**：子 lock 新增 branchRootRegion（5 个控制点：Center Root 橙色 / 4 个浅蓝十字点，全部用父级毛发表面 (u,v) 参数表达，u=长度、v=宽度）；attachDrawnLocksAsBranches 创建时按附着参数初始化（center=附着点+宽度中线，十字点 ±默认偏移）；快照/恢复/镜像/detach 全链路支持；可选字段，旧版本忽略、旧文件读取为空，保持 .ahs 兼容。表面索引缓存与挖洞/接入几何在 2.2 实现。
