# JS 改动标注

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## JS 改动标注 / JS change annotations

> 以 main 分支（原版本）为基准，记录本地适配的差别/新增功能。

- **app.js**
  - 新增 Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，浏览器不支持时回退原下载对话框；新增 `saveHairProjectQuickly` 覆盖保存到上次文件；全局 keydown 拦截 Ctrl+S / Ctrl+Shift+S（代替浏览器默认"保存网页"，原快捷键说明不改动，新增内容放在独立「Local Adaptation」分区）。
  - 雕刻笔刷选择遮罩：新增 `sculptBrushSelectionMask`；`sculptBrushUnits` / `updateSculptBrushViabilityPlane` 增加选择过滤（未选中 → 所有可见头发可雕刻；选中 → 仅选中头发可雕刻）。
  - 拖放统一分发：任何文件拖拽都接受，drop 时按类型分发（.ahs/.animehair.json/.json → openHairProjectFile，图片 → 2D/3D 参考图，其他 → 忽略并警告）；后续新增 geo / 附加模型等 drop 类型只需在 drop 分发处扩展。
  - 材质面板：新增删除材质（面板删除按钮 / Delete 键，焦点在材质面板时生效）；被删除材质的头发自动改回默认材质；默认材质不可删除。
  - 视口导航模式：新增偏好设置「Navigation mode」（Default / Houdini，默认 Houdini）；Houdini 模式 Alt+左键旋转（不变）、Alt+中键平移、Alt+右键拖拽缩放（同时响应水平+垂直位移，快速模长近似归一化，45° 对角 = 1 倍；方向右上放大、左下缩小），滚轮缩放保持；左下角导航提示随模式更新（Alt + Middle Mouse / Alt + Right Mouse）。
  - 浮动面板跟随选择：新增 `retargetFloatingStrandEditors()`，selectLock 时把打开的面板改指向新选中头发并刷新（见「Bug 修复」）。
- **v0.1.4 迁移（codex/branchdev_v0.1.4）**：本地适配整体从旧 main 迁移到 0.1.4 代码库，功能保持一致，冲突与重复实现按 0.1.4 新架构收口。
  - 雕刻笔刷：Slide / Scale（Cut·Extend）/ Push / Orient 四个自定义笔刷接入 0.1.4 雕刻管线（`sculptBrushToolActive` / `sculptBrushStrengthByTool` / `beginSculptMoveStroke` Ctrl=反向 / `applySculptMoveStrokeSample` 新增分支）；Smooth 增加 twist 平滑（`smoothSculptTwistDeltas` 在 modules/sculpt-brush.js）；ScaleMode 行仅 Scale 笔刷显示。
  - 导航：Houdini 并入 0.1.4 已有的 Navigation style（Anime Hair Studio / Blender / Houdini 三选一），不再用独立的 navigationMode；Houdini = Alt+左键旋转 / Alt+中键平移 / Alt+右键拖拽缩放（快速模长近似归一化，右上放大、左下缩小），滚轮缩放；导航提示与快捷键帮助随模式切换（`data-navigation-style-tip` / `data-navigation-style-shortcut` 行）。
  - 浮动面板跟随选择：`retargetFloatingStrandEditors()` 在 `selectLock` 时把打开的 Strand Profile / Width·Depth Curve 面板改指向最新选中的 strand 并刷新；`rebuildLockGeometry` / undo / redo 时刷新 Taper 网格控制点。保留浮动面板拖动 / 右下角缩放 / 右缘吸附属性面板左侧、左右面板宽度拖拽、底部笔刷栏自适应。
  - Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）：`saveHairProjectFile` 优先用 File System Access API 写盘并记住文件句柄，回退原下载对话框；`saveHairProjectQuickly` 覆盖保存到上次文件；File 菜单新增两项并带快捷键提示（独立「Local Adaptation」分区）。
  - 拖放：采用 0.1.4 自带的应用文件拖放（.ahs/.obj → 确认对话框，图片 → 2D/3D 参考图），移除旧的自定义分发实现（`isProjectFile` / `dragContainsFiles`）。
  - 选择遮罩：0.1.4 已内置雕刻笔刷选择遮罩（`sculptBrushSelectionAllows`），移除 brush-dev 的重复实现 `sculptBrushSelectionMask`。
  - Ctrl+Z 修复迁移到 0.1.4 的 modules/shortcut-registry.js（`focusedControlShouldYieldToShortcut` 对所有非文本输入控件放行 Ctrl+Z/Y/D）；`setActiveTool` 重置 `historyShortcutHeld`。
  - 语言：ZH 词典扩展覆盖 0.1.4 新增文案（导航方式 / 相机平滑 / 最近项目 / 拖放项目确认 / 选择集 / 锁定 / 隔离等，3D 名词保留英文）；JA 补充新笔刷 / ScaleMode / 保存等词条；`translateUiString` 按语言词典分发（JA / ZH），未收录回退英文。
- **快捷导出（Ctrl+Alt+S）**：新增 `exportHairProjectQuickly`，完全复刻上一次导出（`lastExport`：格式 / 文件名 / 导出内容 / 本地标志）。普通导出与快捷导出都优先用 File System Access API 写盘（`writeExportThroughFileSystem`）并记住文件句柄 `quickExportFileHandle`，重复导出直接覆盖同一文件（不再用浏览器下载产生 `(1)` 后缀）；仅在不支持该 API 或取消选择时回退下载。从未导出时快捷导出回退到原导出对话框；File 菜单新增「Quick Export（Ctrl+Alt+S）」；快捷键帮助「Sintaka Fork」分区新增 Ctrl+Alt+S 行。
- **快捷键帮助分区改名**：「Local Adaptation」分区改名为「Sintaka Fork」（专用名词，不随语言翻译）。
- **分支层级解除限制**：`canBranchDrawFromLock` 不再要求 `!branchParentId`，分支可以从分支继续长出（真树结构，默认层级 1 视觉不变）；`updateBranchChildren` 递归更新整棵子树，父级移动会带动所有层级。
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
- **子发片深度重置 2.4u（矩形选区控制器 + 子横向拓扑跟随洞口）**：实现 4 点矩形选区控制器——① 数据模型：branchRootRegion 抛弃中心点（新 region 只含 cross.up/down/left/right 4 点，旧文件带 center 兼容）；② 世界点：branchRootRegionWorldPoints 把 4 点吸附到父发片 geo 表层（区域边缘中点网格顶点）；③ 控制器：选中子发片时显示 4 个浅蓝选区点 + 1 个根骨骼点，拖拽时 raycast 父发片表面 → branchSurfaceParamAtWorld 求 (u,v) → setBranchRootRegionPoint 更新并重建/重挖；根骨骼沿父引导线滑动（u only，enforceBranchRootPosition，非 slide 笔刷）；④ 子横向拓扑：createBranchChildGeometry 的 halfWidth 改为由父孔洞横向切面世界跨度决定（region 左右边列距离/2），验证子环宽 0.089≈洞 0.09（原 0.16）。注：桥接 smoothstep 仍不理想、底部桥接按需拓展与侧面 3D 待后续。
- **子发片深度重置 2.4u 更新（控制器方向修正 + 小手柄默认显示）**：① 4 个选区点改**小手柄**（半径 0.02，同 width curve 点，非骨骼关节大）；② **默认直接显示**（不加开关，子发片可见即显示）；③ 横竖方向修正：默认 up=朝根部（较小 u）、down=朝尖端（较大 u）、left=较大 v（世界左）、right=较小 v（世界右），worldPoints 相应 up=rowMin/down=rowMax/left=colMax/right=colMin；branchRootRegionSurface 用 min/max 归一化，旧文件（pre-2.4u 顺序）也能得到正确矩形区域；④ 拖拽条件放宽（不再要求 strand 编辑模式，锁定不可拖）。
- **子发片深度重置 2.4u 更新（撤销修复 + 移除橙色点 + 根骨骼引导线滑动）**：① Ctrl+Z 修复——选区拖拽在**开始拖拽时 pushUndoState 一次**（整个拖拽为一次撤销操作），不再每次移动都 push（否则撤销会直接回到初始加载）；② 删除中间橙色根控制点，改用**子骨骼根部**作为 4 个浅蓝选区点的 parent；③ 根骨骼移动改为**沿父引导线 2D 平面平滑滑动**（enforceBranchRootPosition 从 points[0] 重算最近 guide 参数 u，再吸附到引导线曲线点）。④ 排查：刘海三角面问题经 2.4t worktree 对比确认**不是 2.4u 引入的回归**——Side Bangs Left 5/Right 4 的父级（Left 1/Right 1）是 split 发丝（无 grid），createBranchChildGeometry 一直返回 null（pre-2.4u 亦如此），刘海一直走普通发丝路径。
  - **桥接规律总结（已验收）**：底部按位（洞 bottom 左→右 ↔ 子环 bottom 左→右）；侧面/顶部按**世界侧**匹配（网格 left/right 在世界相反）；顶部 2src↔2dst + 中间分段 + smoothstep 内凹；侧面收口每侧 1 三角 + 1 四边（紧邻 top 切边为三角，其余四边）；法线均朝外。
  - **矩形选区控制器（本次做）**：5 点选区改 **4 点**（抛弃中心橙色 RootCtrl，仅保留 4 个十字浅蓝边界点）；4 点定义父发片表面矩形拓扑（u=沿长度、v=沿宽度），依据主发片走向选择，确保矩形；4 点是 parent→子骨骼 root 的选区控制，**吸附在父发片 geo 表层**；根骨骼控制沿**引导线**滑动（不是 slide 笔刷的多点扭曲逻辑）；子发片横向拓扑（2×1 的 2）直接由父孔洞横向切面决定。
  - **底部桥接按需拓展（后续）**：底部不再定死 2 quad，改成按需桥接操作——阈值：根骨骼附近直接探测，若拓扑对不上（超过 1 个面对不上，如 2×1 对 2×3，底部直接对上则上面有 2×2 面对不上）→ 触发分段桥接 + 额外拓扑操作。
  - **侧面 3D（暂不扩展）**：目前工作在切线二维方向，侧面 3D 扩展待想清楚。
  - **底部桥接（已验收）**：洞 bottom（row12，世界 左→右 c5→c2）↔ 子环 bottom（环点 5/6/7，世界 左→右），按位 1:1，折痕零边折叠。
  - **侧面直接桥接（2.4r 已修正）**：子环 left（世界左）↔ 父 colMax+1（世界左）、right（世界右）↔ colMin（世界右），按**世界侧**匹配（网格 left/right 在世界相反）；右面绕序 flip 朝外。
  - **顶部（本次三步）**：① 洞 top（row9，世界 右→左 col2→col5，折痕零边折叠成 2 实边）↔ 子环 top（环点 0/1/2，世界 右→左），2src↔2dst 直接桥接；② 对桥接边**分段**：观察洞侧面未桥接边数（每侧 2 段）→ 每条桥接边 1 段需增至 2 段（新增 1 段 = 中间等比切分，注释后续复杂侦测）；③ 上部 poly 走向从线性改 **smoothstep 平滑**，完成子→主桥接过渡。
  - 直接桥接概念：把子环边**直接投影**到主发片最接近的面/线段去匹配。
- **子发片深度重置 2.8（恢复底部桥接：带状复刻顶部逻辑）**
  - 关闭 BRANCH_BRIDGE_DIAGNOSTIC；底部从 connectSide 直连改为与顶部一致的**带状桥接**：ring bottom(3,4,5) <-> 洞底(collapsed)，分段 bottomSegments=rowMax-rootRow+1（root 相对，与顶部对称），Hermite 复用共享的 hermite/rootRow。
  - **底部主发片端折痕**：m1 = 0.5*表面切线 + 0.5*反向父级法线（不顺着底部法线而是反一下、约 0.5 权重，非完全切线）——到达端形成尖锐折痕。
  - **拓扑/分段一致**：底部与顶部同样 2 列 × bottomSegments 行、绕序 [parentRow, childRow, childRow+1, parentRow+1]、掩码 [0,1,1]/[1,1,0]。验证：初始 20 bridge tris（顶 2+底 2 行+侧 2 quad），延长底部 -> 40 tris（底 7 行、顶 2 行不变）；法线全部朝外（dot>0），无 NaN、maskCount=triCount。
  - 侧直接桥接恢复；三角剖分侧填充继续禁用（BRANCH_SIDE_FILL_ENABLED=false，待重做）。

- **子发片深度重置 2.7（smoothstep 主发片端切线 + 面板缩小 + sweep 手柄可见 + 刘海排查）**
  - **顶部桥接主发片端切线修正**：原用弦方向做 Hermite 终点切线（带垂直到达、凸起），再加 sin 外凸更严重。改为 m1=弦方向投影到父级切平面（去掉父级法线分量）——带沿中心线走、到达端平行父级表面切线、不再凸起/凹进；去掉外凸 bow。
  - **Branch Root Region 面板缩小**：viewBox 220x520->220x400、SVG aspect 11/26->11/20、dialog 宽 280px（原 360）；移除 Show points on mesh toggle；Reset region 精简为 Reset。验证：SVG 254x462（原 334x789）。
  - **sweep 起始手柄可见**：手柄沿子发片 guide 的 frame.z（朝外法线）偏移 0.06 摆到毛发表面外，不再埋在根部截面里。
  - **刘海排查（线框掩码确认正确）**：split 发丝（Side Bangs 1/2）572 个扫掠 quad 用 quad 重建法检查 0 个显示对角线；面板（Front Bangs 1/2/3）掩码经焊接保序、隐藏对角线。但面板在 Split 开口处有折叠 quad（Front Bangs 1 22 个、3 52 个，二面角最高 180°/90°）——着色沿对角线出折痕是"三角面"观感来源（split 开口设计，非线框 bug）。

- **子发片深度重置 2.6（面板渲染修复 + smoothstep 外凸 + 分段相对 root + devlog 拆分）**
  - **Branch Root Region 面板渲染修复**：.branch-region-canvas 的 aspect-ratio 规则写在 .taper-canvas 之前（同优先级后者胜出），SVG 按 26/11 宽渲染、竖长内容被 letterbox，导致左边界跑到中间偏左、右侧超出、拖拽比例错乱。改为 ID 选择器 #branchRegionCanvas 且放在 .taper-canvas 之后。验证：rect aspect 0.423 == viewBox 0.423，拖拽点精确跟手。
  - **顶部桥接 smoothstep 可见**：中心线 Hermite（两端切线=弦方向）退化成直线。新增沿父级孔洞处 frame.z（朝外法线）投影到带法平面的外凸：中间行 sin(pi*f)*0.3*span，两端为 0，可见且不凹进父级。
  - **桥接分段相对 root**：原 topSegments=完整洞高，延长底部会让顶部条带也加段。改为 topSegments=rootRow-rowMin+1（rootRow 由 branchParentParameter 推算；root 在洞下方时回退全高）。验证：延长底部 5->5 不变，上移顶部 5->6 增加。
  - **devlog 整理**：README 拆成索引字典（约 2KB）+ 5 个专题文件（development-standards / js-change-annotations / bug-fixes / brush-dev-spec / local-adaptation-log），按需读取降 token。

- **子发片深度重置 2.5（拖拽修复 + width curve 持久化 + 桥接沿中心线）**
  - **2D 面板拖拽漂移修复**：updateBranchRegionCanvasDrag 里指针->SVG 换算硬编码了旧 viewBox(520/220)，面板改竖长后(220/520)换算错误导致点被持续拖偏；改为动态读 `branchRegionCanvas.viewBox.baseVal`。验证：拖 left 点到画布 x=80 -> 点精确落在 x=80、v=0.333，无漂移。
  - **width curve 联动确认 + 持久化**：子发片扫掠已应用 taper/depth curve（相对扫掠起点归一化，根环保持洞口宽）；实测真实 UI 拖拽 width curve（tip 0->0.706）子发片 tip 宽度 0->0.0538 生效。新增 `branchCurvesAuthored`：子发片自身曲线被编辑后标记，updateBranchChildren 不再用父级 remap 覆盖（编辑不再被冲掉）；序列化/恢复。
  - **顶部桥接 Hermite 沿中心线**：原用孔洞顶点表面法线作终点切线，法线方向与桥接带方向(主要 -y)不一致(孔洞法线主要 -z)导致到达端横向摆动凹进主发片；改为两端切线都用 ring->hole 中心弦方向，带沿中心线走（后续可给中心线加 NURBS 控制点细化）。

- **子发片深度重置 2.4z（选区显示/映射修正 + 顶部桥接绕序/Hermite + 手柄可见性）**
  - **控制点边界对齐**：branchRootRegionWorldPoints 的 down/left 点改为 rowMax+1 / colMax+1（洞底/洞左真实边界，原来停在最后一个面的边内 1 poly）。
  - **面板竖长**：Branch Root Region SVG 从 520x220 横躺改为 220x520 竖长（viewBox、UV 映射、CSS aspect-ratio 同步）。
  - **v 映射修正（居中）**：父发片截面是闭合环，按列索引线性映射时 v=0.5 落在环的远端（世界左极值）——这就是默认偏右的根因。改为以 probe 行 frame.z（朝外法线）投影最大的 front 列为基准的环向弧映射（v=0.5=front），并把默认 v 跨度 0.06->0.24 让区域有实际宽度；colCount/skipCol 改为构建时固化（gridFacesPerRow/gridSkipCol），不再从已挖洞的 quadFaces 推导（洞变大后曾漂移 10->9）。
  - **顶部桥接绕序修复**：通用循环发出的 quad 绕序与原版相反（内翻），FrontSide 线框 overlay 把背面剔除 -> 顶部桥接看不到拓扑；改为 [parentRow, childRow, childRow+1, parentRow+1] 与原版一致。
  - **smoothstep 改 Hermite**：只插值位置会在孔洞处凹进主发片；改为 Hermite 插值——起点切线沿桥接方向、终点切线用主发片表面法线（按跨度缩放），两端位置与法线都匹配，不再内凹。
  - **sweep 手柄可见性**：放大 1.8x、renderOrder 40、depthTest false（原本被其它头发遮挡看不到）。

- **子发片深度重置 2.4y（选区钳制修复 + 桥接诊断模式）**
  - **控制点越界修复**：setBranchRootRegionPoint 的 MIN_REGION_SPAN 钳制（Math.min/max）结果未再夹到 [0,1]，可产生负值/超 1（右/下点显示到 -1）；现统一用 clampRegionParam 包住；renderBranchRegionEditor 显示层也加钳制兜底（旧文件越界值不再画出画布）。验证：极值拖拽后 u/v 全在 [0,1]，控制点均在画布内。
  - **桥接诊断模式（临时）**：BRANCH_BRIDGE_DIAGNOSTIC=true —— 只输出顶部条带（顶部桥接 + 分段），底部桥接 / 侧面直接桥接 / 侧面三角剖分填充全部禁用，先隔离定位"全乱"。验证：仅顶部条带时 344 tris（扫掠 312 + 双面端盖 12 + 顶部条带 20），无 NaN。
  - 待诊断结论：2.4x 的侧面三角剖分（triangulatePolygon3D）曾测出桥接区 count-4 非流形边（重叠面），为"全乱"最大嫌疑；顶部条带 smoothstep 圆滑（中间行内凹 0.2×跨度）是"整个面凹下去"的候选原因。

- **子发片深度重置 2.4x（桥接动态分段 + 选区归一化 + width curve 联动 + sweep 起点手柄）**
  - **桥接程序化**：buildBranchBridgeGeometry 重写。顶部条带分段数改为洞高度 H(rowMax-rowMin+1) 驱动，不再写死 2 段；中间行用 smoothstep 插值 + 桥接圆滑(0.2 系数、两端为 0 中间最大、随重建实时重算)；侧面填充改为三角剖分(triangulatePolygon3D: Newell 法线 + ShapeUtils.triangulateShape)，任意洞高都水密；底部 connectSide、侧面直接桥接保留。
  - **Branch Root Region 默认值**：centerV 0.25->0.5(面板居中)，u 跨度 0.08->0.16、v 跨度 0.10->0.06(竖长)；setBranchRootRegionPoint 增加归一化钳制(up<=down、left>=right、最小跨度 0.02)，拖拽不再飞出/翻转。
  - **width curve 联动**：子发片扫掠应用自己的 taper/depth curve(相对扫掠起点归一化，根环保持洞口宽度)；子发片宽度随自身或父级宽度曲线(updateBranchChildren 重映射)变化。
  - **sweep 起点手柄**：子发片曲线对象新增黄色 branchSweepStartHandle(沿子引导线根->尾滑动，控制 branchSweepStartT 0.02-0.6，默认 0.1)；createBranchChildGeometry 用 branchSweepStartT 替代写死 0.1；指针拖拽(注册到 capture 最前，避免被其它 pointerdown 吞掉)+ 序列化/恢复 + 撤销。
  - 验证：洞变高桥接面数随之增加(动态分段)；tip 宽度随 taper 形状 0.145->0.032->0.195；手柄拖拽 0.1->0.03；无 NaN/索引越界。

- **子发片深度重置 2.4w（Reset 幂等修复 + 面板精简 + show points on mesh）**：① **Reset 累积删面修复**——根因：setBranchRootRegionPoint 之前只重建子发片、再对父级**已挖洞的旧网格**重复 applyBranchRootRegionCarving；挖洞会改写 quadFaces，重复作用在缩小后的数组上行列映射漂移，每次 Reset/拖拽多删几个碎面且不可恢复。修复：改为重建父级（rebuildLockGeometry(parent)，内部先 createHairGeometry 全新网格再挖洞一次），Reset/拖拽均幂等，多次 Reset 面数恒定。② 面板精简：删除说明文字（u=沿父级…），只留 Reset region 按钮。③ 新增 **Show points on mesh** toggle（同 Width/Depth Curve 面板）：在父发片表面显示 4 个选区点的 3D 标记（branchRegionMeshPointsGroup + branchRootRegionWorldPoints，沿 2D 拖拽实时跟随），关闭或取消选中时隐藏。

- **子发片深度重置 2.4v（2D 矩形选区编辑器 + 刘海线框三角修复）**：① 坏的 3D 选区手柄（选不中、拖不动）整体删除，改为类似 Width/Depth Curve 的 **2D u/v 平面编辑器**——新增 `#branchRegionEditor` dialog（SVG 画布 520×220，u=沿父发片长度、v=沿宽度）；4 个浅蓝选区点 **up/down 只改 u、left/right 只改 v**（默认位置横竖方向沿用 2.4u 修正：up=朝根部较小 u、down=朝尖端较大 u、left=较大 v 世界左、right=较小 v 世界右）；选中分支子级自动打开、选中普通发片自动关闭（`retargetBranchRegionEditor` 挂入 selectLock）；拖拽开始 `pushUndoState()` 一次（整个拖拽=一次撤销，不再退回初始加载）；Reset 按钮恢复默认区域；新增 CSS `.branch-region-rect`。② **修复 index.html dialog 嵌套 bug**：branchRegionEditor 之前误插在 taperCurveEditor 内并吃掉它的闭合标签，导致其后所有 dialog（UV Inspector / Save / 预设等）全部嵌套进 taperCurveEditor、0 尺寸不可见——已恢复为 BODY 顶级并列，各面板回归正常。③ 刘海 split 发丝线框三角修复见「Bug 修复」。

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
- **子发片深度重置 2.1b**：恢复旧存档时，有 branchParentId 但缺 branchRootRegion 的分支子级自动回填根区域（branchRootRegionFromParam）；几何生成器（发带/发片 sweep）输出 gridRows/gridColumns；新增 branchRootRegionSurface() 把 (u,v) 区域映射到父级 quad 网格的 row/col 范围（仅控制点改动时重算，父级移动不碰）。验证：Sussurro v0012 的 Side Left 3 加载后自动获得 region，父级网格 27×11。
- **子发片深度重置 2.1（数据模型）**：子 lock 新增 branchRootRegion（5 个控制点：Center Root 橙色 / 4 个浅蓝十字点，全部用父级毛发表面 (u,v) 参数表达，u=长度、v=宽度）；attachDrawnLocksAsBranches 创建时按附着参数初始化（center=附着点+宽度中线，十字点 ±默认偏移）；快照/恢复/镜像/detach 全链路支持；可选字段，旧版本忽略、旧文件读取为空，保持 .ahs 兼容。表面索引缓存与挖洞/接入几何在 2.2 实现。
- **笔刷大小快捷调节**：原有「S + 左键拖动」只作用于 Draw/Braid/Panel/Scalp 笔刷；现扩展到雕刻栏的修改型笔刷（Move/Smooth/Slide/Push/Scale/Orient）：`activeBrushSizeInput` 在雕刻笔刷下返回 `sculptBrushRadiusInput`，`beginSculptMoveStroke` 在按住 S 时让位给 `beginBrushSizeDrag`，拖动时同步刷新雕刻笔刷光标（`syncSculptBrushControls`）。 拖动过程中把笔刷光标固定在起点并隐藏系统鼠标指针，松开后恢复（大小仍按真实拖拽距离计算）。
- **Quick Save 记住打开的项目**：打开项目时（Open 菜单优先用 `showOpenFilePicker`、拖入优先用 `DataTransferItem.getAsFileSystemHandle`，均拿到可写 handle）把 `quickSaveFileHandle` / `quickSaveFileName` 记成该文件，Quick Save（Ctrl+S）直接覆盖写回、不再重新选择；拿不到 handle 的路径（文件选择框 / 旧浏览器）也会记住文件名，Save As 预填该名称。Quick Save 写盘前先 `requestPermission({mode:"readwrite"})`（打开的文件默认只读，首次授予后记住）。
- **index.html**：File 菜单新增 Quick Save（Ctrl+S）与 Save as（Ctrl+Shift+S）快捷键提示；快捷键帮助新增独立「Local Adaptation」分区。
- **modules/localization.js**：新增 "Save as"、"Quick Save"、"Quick Save the project"、"Local Adaptation" 的日语翻译（含导航模式：Navigation mode / Alt + Middle Mouse 等）。
  - 新增简体中文（zh）：SUPPORTED_LANGUAGES 增加 `{ id: "zh", label: "简体中文" }`；新增完整 ZH 词典（约 540 条）；translateUiString 改为按语言词典分发（JA / ZH），未收录文案回退英文；3D 专业名词（strand / clump / braid / mesh / shader / UV / lattice / verts / tris 等）保留英文。
- **start-dev-server.cmd**：精简为一行 python 静态服务器启动，并自动在默认浏览器打开 http://127.0.0.1:8080/。
