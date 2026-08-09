# 本地适配进度

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## 本地适配进度 / Local adaptation log

> 记录相对 main 分支（原版本）的适配改动。

- [x] 本地运行：Python 静态服务器启动脚本（start-dev-server.cmd，自动打开浏览器）
- [x] 文件保存：Quick Save（Ctrl+S）/ Save as（Ctrl+Shift+S）
- [x] 拖放统一分发：任何文件拖拽接受并恢复原始浮动框视觉；drop 按类型分发（.ahs → 打开项目，图片 → 参考图，其他 → 忽略）
- [x] 雕刻笔刷选择遮罩：未选中只能雕刻可见头发，选中后只能雕刻选中头发
- [x] 材质面板：删除多余材质（剩余头发自动改回默认材质，默认材质不可删除）
- [x] 修复删除材质时误删发片：材质 outliner 重渲染后重新聚焦选中项，Delete 保持在材质上下文
- [x] 左侧大纲 / 右侧属性面板支持左右拖拽调宽（宽度持久化到 localStorage）
- [x] 滑杆数值框可随宽度变宽（minmax(56px,1fr)，滑杆占 2fr）
- [x] 浮动面板（Width/Depth Curve、Strand Profile）支持拖动、右下角缩放、右缘吸附到属性面板左侧
- [x] 底部笔刷栏自适应：空间窄隐藏 " Brush" 后缀，更窄只显示图标，不换行
- [x] 浮动面板：跟随选中头发；show points on mesh 随雕刻/移动更新
- [x] 视口导航模式：新增 Default / Houdini（默认 Houdini）；Houdini = Alt 左键旋转 / Alt 中键平移 / Alt 右键缩放（同时响应左右/上下并归一化），滚轮缩放保持
- [x] 语言：Settings Language 新增简体中文（保留 3D 专业名词）
- [x] devlog：维护开发规范 / JS 改动标注 / Bug 修复分类
- [x] devlog 记录修改型笔刷开发规范（沿用 Move/Smooth 架构；Ctrl=反向、Shift=临时 Smooth、B=软选）
- [x] devlog 记录许可证（source-available v1.2，非开源）与合规规范
- [x] 实现 Slide / Scale 修改型笔刷（sculpt-slide / sculpt-scale，Scale·Cut/Extend 模式，Ctrl=反向）
- [x] 笔刷细化：Slide 跟随拖拽方向（原曲线约束实时计算）、Cut/Extend 累计防抖、Scale 头皮碰撞、ScaleMode 仅缩放笔刷显示、笔刷名不汉化
- [x] 笔刷修正：移除软选择；Scale 不做头皮碰撞；撤销后 Taper 控制点重同步；number 输入框 Ctrl+Z 可用
- [x] 修复笔刷使用后 Ctrl+Z 失效（非文本控件放行快捷键 + setActiveTool 重置 historyShortcutHeld）
- [x] Smooth 增加 twist 平滑；Scale 默认强度 0.5；导航默认 Default；Turntable 菜单不关闭
- [x] ScaleMode 行仅 Scale Brush 显示
- [x] 新增 Push / Orient 修改型笔刷（sculpt-push 沿本地 up 推离；sculpt-orient 绕切线单轴旋转，up 转向视口正交方向）
- [x] v0.1.4 迁移：4 个自定义笔刷 / 简体中文 / Houdini 导航 / 浮动面板跟随 / Ctrl+S·Ctrl+Shift+S 保存全部迁移到 0.1.4 代码库（codex/branchdev_v0.1.4）
- [x] Houdini 导航并入 0.1.4 Navigation style（Anime Hair Studio / Blender / Houdini）
- [x] 拖放 / 雕刻选择遮罩改用 0.1.4 内置实现，移除旧重复代码
- [x] ZH 词典扩展覆盖 0.1.4 新增文案（约 107 条）
- [x] 新增 Quick Export（Ctrl+Alt+S）快速重复上一次导出
- [x] Quick Export 与原生导出兼容：完全复刻上次导出（格式 / 文件名 / 内容 / 目标），不再要求重新选择
- [x] 导出改用 File System Access API 写盘（支持时），快捷导出覆盖同一文件，不再产生 (1) 后缀；仅回退下载
- [x] S+左键拖动笔刷大小扩展到雕刻修改型笔刷（Move/Smooth/Slide/Push/Scale/Orient）
- [x] 拖动调笔刷大小时鼠标指针固定在起点（隐藏系统指针），松开后恢复
- [x] Quick Save 记住打开的项目文件（Open/拖入可拿到 handle 时直接覆盖写回，无需再选）
- [x] 快捷键帮助「Local Adaptation」分区改名为「Sintaka Fork」

- [x] 子发片选区控制重写：3D 手柄 → 2D u/v 平面编辑器（4 点，up/down 改 u、left/right 改 v，选中自动开关，整次拖拽=一次撤销）
- [x] 修复刘海（split 发丝）线框三角面：createSplitStrandGeometry 生成 authored edgeMask，0 对角线
- [x] 修复 index.html dialog 嵌套 bug（branchRegionEditor 吃掉 taperCurveEditor 闭合标签，后续 dialog 全部 0 尺寸）

- [x] 子发片选区面板：Reset 幂等（不再累积删面）、移除说明文字、新增 Show points on mesh toggle（3D 标记跟随 2D 拖拽）

- [x] 桥接程序化：顶部条带分段=洞高 H、smoothstep+圆滑重算、侧面填充三角剖分(水密)
- [x] 选区默认值居中竖长 + 拖拽归一化钳制(不飞出/翻转)
- [x] 子发片 width/depth curve 联动(相对扫掠起点归一化，根环保持洞口宽)
- [x] sweep 起点手柄：黄色控制点沿子引导线根->尾滑动，控制扫掠起始(0.02-0.6)

- [x] 选区控制点越界修复（u/v 钳制到 [0,1] + 显示层兜底）
- [x] 桥接诊断模式：仅顶部条带（BRANCH_BRIDGE_DIAGNOSTIC=true），底部/侧面/填充禁用

- [x] 控制点边界对齐（down/left -> 洞真实边界）+ 面板竖长化
- [x] v 映射：front 列居中环向弧映射（默认选区居中）+ 构建时固化 grid 元数据
- [x] 顶部桥接绕序修复（线框可见）+ Hermite 平滑（主发片法线参与，不内凹）
- [x] sweep 手柄放大/置顶（可见性）

- [x] 2D 选区面板拖拽换算修复（动态 viewBox，不再漂移）
- [x] width curve 联动确认 + branchCurvesAuthored 持久化
- [x] 顶部桥接 Hermite 沿中心线（去除表面法线摆动）

- [x] Branch Root Region 面板渲染修复（SVG aspect 正确、拖拽精确跟手）
- [x] 顶部桥接 smoothstep 外凸可见 + 分段相对 root（延长底部不影响顶部段数）
- [x] 刘海线框掩码核对（v0040 全对）+ devlog 拆分为索引字典

- [x] 顶部桥接 smoothstep：主发片端平行表面切线到达（去掉法线分量，不凸不凹）
- [x] Branch Root Region 面板缩小 + 移除 toggle + Reset 精简
- [x] sweep 起始手柄偏移出毛发表面（可见）
- [x] 刘海线框掩码确认正确（quad 重建法）；面板 split 开口折叠 quad 为着色折痕来源

- [x] 恢复底部桥接：带状复刻顶部（分段相对 root、Hermite、反向法线 0.5 折痕、绕序朝外）
- [x] 刘海三角掩码记录为已知问题（原版同样存在，暂不处理）

- [x] 侧面直接桥接接到根部中间面（不再随底部上下跑）
- [x] 顶部分段去掉多余一段（rootRow-rowMin）
- [x] sweep 手柄缩小到 1.2

- [x] 底部段数镜像顶部（root 在洞底时直连不分段）
- [x] sweep 手柄半径减半（0.6）

- [x] 选区面板：拖动矩形整体平移选区
- [x] 顶/底桥接补全：末端 0.3 处额外循环线（避免侧面三角）
- [x] 子发片横向拓扑跟随主发片选区宽度（squareChildRing 动态宽度段）

- [x] TransformMode 默认 object；Width Curve Show Points on Mesh 默认开
- [x] 子发片宽度跟随 Width 属性（横向拓扑仍跟选区）
- [x] RootCtrl 解锁：主骨骼 Width 平面滑动 + 选区/桥接区域跟随
- [x] TransformMode 默认 object 并持久化（anime-hair-studio-transform-space）；启动不再强制 world
- [x] Branch Root Region 选区顺序归一化（旧文件倒置不再跳变）；根滑动后浮动面板/3D 标记跟随
- [x] 选区宽度=1：子发片横向拓扑 1、顶部/底部直接桥接与补全可工作
- [x] 顶/底桥接端点 0.3 额外循环线对单段直连也触发（避免侧面三角面）
- [x] 选区边界压缩后回到中心恢复原始宽高（edgeOffsets 保留意图尺寸）
- [x] 骨骼点击选中增强：高亮控制点 2 倍拾取半径优先命中，object 模式点击骨骼选中其发片
- [x] 上下桥接 smoothstep 双边法线（子环切端 + 父孔洞端），B 样条式平滑衔接

- [x] Region 选区左右方向修正：回退面板 v 轴翻转（右后方视角下大 v=世界左本应在面板右侧），改修根骨骼 v 符号（0.5 - across/width），根拖动同步与选区对应主发片左右均正确
- [x] sweep 起点黄色手柄选中修复：命中手柄后 stopImmediatePropagation（不再同时启动 WidthCurve 拖动）；mouse 无按键 pointermove 不移动（兜底残留拖拽状态）
- [x] 桥接接缝法线平滑：父侧边界顶点法线恢复为父发片作者法线（computeVertexNormals 后回写），接缝处颜色/着色与父发片一致
- [x] Region 选区记忆：编辑选区后移动子骨骼不再把中心吸附回根骨骼（boneSync 记录相对偏移，跟随骨骼时保留用户手动位置）
- [x] 末端循环线按侧面空隙判断（顶/底分开）：直接桥接（根贴区域边缘）不补，间接桥接含高度1也补
- [x] 末端循环线按侧面空隙判断（顶/底分开）：直接桥接（根骨骼贴区域边缘，无侧面空隙）不补末端；间接桥接（侧面>=1条边空隙）含高度==1也补，防三角面
- [x] 根骨骼移动手感：H 开启拖根时子骨骼刚体跟随 + 0.5 曲率摆动（记录移动前相对朝向/世界形状，相对旋转 0.5 blend）
- [x] 根骨骼左右拖动也摆动：branchSurfaceFrameQuat 用父发片 width/depth 椭圆截面算横向法线倾角，与 u 曲率合成相对旋转后 0.5 blend
- [x] 根骨骼切线方向平滑滑动：branchParentFrame 改连续 frame（curveFrameAt），保留横向（across）吸附，上下拖根不再吸附到控制点层级/跳变
- [x] 切换 H 不再跳变：恢复存档后按当前 frame 重新捕获分支子级 branchLocalPoints，避免与旧 frame 不一致导致重建闪动
- [x] 拖 Region 不再闪根部扫掠：captureBranchLocalState 保存真实 pointSurfaceNormals（回退 stable 法线），updateBranchChildren 重推时不再覆盖导致扫掠 frame 改变
- [x] 根骨骼移到边缘 up 翻转修复：扫掠用父发片切线种子 previousFrame 平行传输稳定（分支子级法线与切线天然平行）
- [x] 根骨骼旋转补偿可调：Hierarchy 面板 Branch Root Curve Follow（0~1，默认 0.5，localStorage 持久化）
- [x] 根骨骼横向拖动 tube 约束：across 夹到半宽（width 代理椭圆管），X 轴拖动不再飞出主发片
- [x] H 模式刚性旋转摆幅上限（60°）：横向椭圆法线倾角大导致子发片 90° 乱甩/up 翻转，封顶后稳定
- [x] 分支根手柄/gizmo frame 稳定化：strandControlPointFrame 用父切线投影做 up，绿轴不再 120° 突跳
- [x] H 模式拖根 gizmo 热更新：syncBranchRootHandleFrame 让手柄/gizmo 跟随骨骼与扫掠，拖动中不再分离
- [x] 扫掠 up 圆柱体方案：cross(bitangent, normal) 纯平行传输，分支子级不向退化法线 roll、不施加 authored twist（修 120° 偏移与乱转）
- [x] 扫掠 up = cross(父副切线, 子切线) + 完整 authored twist：保留 twist 且不乱转（弃用退化法线）
- [x] 扫掠链式绑定根 gizmo + 完整 twist：种子=根 gizmo up，每帧平行传输 + 完整 authored twist，清理 untwistedX 杂乱代码
- [x] 根骨骼 gizmo 携带用户 twist（0.2.38）：branchRootGizmoFrame = 管基准 + 完整用户 twist；W 重建手柄不再回默认/偏移；根骨骼 up 跟随 gizmo，热更新只作基准、用户手调 diff 保留
- [x] 删除子发片后父发片补洞（0.2.39）：deleteLocks 重建存活父级，程序化挖洞按现存子级重算
- [x] 直接桥接跟随 region 中心（0.2.39）：rootRow=round((rowMin+rowMax)/2)，侧面桥接不消失、顶/底不多段
- [x] region 中心橙色控制点（0.2.39）：面板橙色圆点可拖动整体平移；3D 橙色 marker 定位
- [x] 恢复 branch region 面板「Show points on mesh」开关并默认打开（0.2.39）
- [x] 根骨骼随用户 twist 旋转（0.2.39）：种子含完整 pointTwists[0]，row0 直接用种子 frame，根环 1:1 跟随
- [x] 左右移动根骨骼后点别处蹦回主发片中心修复（0.2.40）：captureBranchLocalState 保留根骨骼横向偏移 across（branchLocalPoints[0].x），不再置零
- [x] region 橙色中心改为稳定锚点（0.2.41）：单边编辑不再移动中心/桥接；拖中心平移、Ctrl+拖中心镜像缩放；面板加提示小字
- [x] gizmo 中心万向拾取恢复全尺寸（0.2.41）：translate XYZ 中心 picker 不再 deflate，可点半径 ±8px→±20px
- [x] 已选中骨骼后点击 gizmo 不再被附近骨骼抢选（0.2.42）：pointerHitsTransformGizmo 为真即提前 return，点 gizmo 中心/附近不抢选到相邻骨骼
- [x] 子发片封面侧面 4 边面填充（0.2.43，v0.1.4-Side-Topology 重写）：间接桥接时从直接桥接向洞顶/底 1:1 填 quad 条带（利用 0.3 预留段无三角），共享边一致性传播统一 winding；无 smooth
- [x] 修复多行侧面填充扰乱顶部桥接（0.2.44）：洞侧中间顶点预推到 ringBase 固定前，环索引不再偏移；A/B 验证既有几何逐字节不变
- [x] 桥接 Uniform Smooth（0.2.45）：Strength+Detail 滑杆，仅桥接部分、环/孔洞锚点固定
- [x] Region 面板 Alt+右键局部缩放 + Reset Zoom（0.2.45）；4 侧蓝点不能越过橙色中心；4 角对角缩放

- [x] Region 面板导航增强（0.2.46）：缩放方向反转（右上放大/左下缩小）、Alt+中键平移、滚轮缩放、Reset Zoom 共享钳制；手势按导航预设映射（Houdini Alt+MMB 平移/Alt+RMB 缩放，Blender Shift+MMB 平移/Ctrl+MMB 缩放，Anime Hair Studio Alt+RMB 平移），不再照搬 Houdini
- [x] Region 面板 Ctrl+drag 反向镜像（0.2.46）：边点/角点按住 Ctrl 时被拖点跟随指针、对面点反向联动（成对镜像，橙色锚点不动），普通拖拽行为不变
- [x] Bridge Smooth 滑杆归位（0.2.46）：Strength/Detail 移到独立 Branch Bridge 面板，仅选中子发片时显示（不再只在 H 模式）
- [x] Branch Bridge 滑杆标准形式（0.2.47）：Strength/Detail 改用 range + 数值框 + 重置按钮（setupEditableSliderControls 自动升级），事件监听 input，重置回到默认并即时重建
- [x] Region 面板中键平移（0.2.47）：任意导航预设下按住中键拖拽即可平移查看（与 Alt+中键一致）
- [x] main 合并（0.2.48）：移除三个 Local dev 选项（Local Save / Local Export OBJ/USDA），统一用快速保存/快速导出；吸收马尾/复合发丝预设；子发片桥接与 main 几何并存（createHairGeometry 按 branchRootRegion 分流）；sculpt 保留本地笔刷 + main preserve-tips；材质双面条件合并
- [x] 父发片 Split Geometry 时子发片退回直接生成（0.2.49）：显式守卫 parentSupportsTopologyConnect，无 gridRows/quadFaces 的父（split/hairCard）不再走桥接，子发片从根部直接扫掠；0041 桥接与 0042 回退均验证通过
- [x] split 父发片支持子发片桥接（0.2.51，索引侧拼接）：保留两管渲染，索引把两管拼成 fused 网格（gridIndexAt 读位置 + faceToRendered 挖洞映射 + 跨缝面=粘缝），非跨缝选区桥接干净、跨缝可桥接（顶部带少量重叠边，暴力粘第一版）
- [x] 调研：H 拖根 Region 2 倍速度左右同步（0.2.52，无代码改动）——同步链路对 split/普通父完全一致，未复现 split 特有 2 倍；两种横向映射修复均因 fused 环列非横向单调产生非连续选区而回退
- [x] Region 同步速度可调（0.2.52）：Branch Root Region 面板新增 Sync L/R（默认0.45，0.2.53 由 0.6 调低）与 Sync U/D（默认1.0）滑杆（浮点+滑杆+重置），updateBranchRootRegionCenter 的 du/dv 按速度缩放
- [x] 刘海 split 父发片线框三角面修复（0.2.54）：applyBranchRootRegionCarving 挖洞后同步裁剪 triangleEdgeMasks（按被删面去 2 条侧面 mask、保留端盖），线框不再画错误对角线；导出一直是四边面不受影响
- [x] Front Bangs 1-3 视口三角观感修复（0.2.55）：createPanelStrandGeometry 的 addQuad 跳过退化（角点重合）与反射折叠（两三角法线相反）quad，最大二面角 180/90° → ≤10.7°；导出一直是四边面不受影响
- [x] 面板线框三角面真正修复（0.2.56）：绕序翻转后同步交换 triangleEdgeMasks 的 [1]/[2]，quad 对角线不再被描边；0.2.55 的退化/反射折叠清理保留
- [x] 重构：localization 词典拆数据文件（0.2.57）：JA/ZH 词典从 modules/localization.js 拆到 modules/loc-ja.js / loc-zh.js（export default Object.freeze），localization.js 改 import 两词典，逻辑零改动；拆分前后 key 数一致（JA 667 / ZH 653）；verify-smoke.mjs 6/6 通过（页面加载 0 异常、zh/ja/en 翻译正常、0043.ahs 加载重建无异常）
- [x] 重构：reference + ui-panel store（0.2.57，3c 第三批）：modules/edit/reference-store.js（2 let）+ modules/core/ui-store.js（7 let：radial menus、preferences 快照、view 吸附、undo 标志、panel split 警告含 localStorage 持久化）；踩坑：替换误伤 querySelector 选择器字符串（已修 + 验证清单补第 6 点）；全局 let 215→204；verify 13/13
- [x] 重构：draw/poly store（0.2.57，3c 第二批）：modules/edit/draw-store.js 收敛 6 个 let（poly 填充/删除候选、shift preview、clump 模板、procedural draw 实验开关含持久化）；踩坑：对象简写跨行残留致 SyntaxError（已修 + 验证清单入库）；全局 let 221→215；verify 13/13
- [x] 修复：Branch Bridge Smooth 按子发片独立（0.2.57）：滑杆读写当前选中子发片的 lock.branchBridgeSmoothStrength/Detail（无选中写全局默认作新子发片默认值）；面板选中变化时 updateBranchBridgeSliderInputs 刷新；几何侧 L15074 本就支持 lock 覆盖；lock 字段随 .ahs 直接序列化持久化；verify 新增 per-lock 测试
- [x] 重构：branch/sub store（0.2.57，3c 第一批）：modules/branch/branch-store.js 收敛 8 个 let（smooth strength/detail、sync 速度、rigid blend、region view、更新中标志），5 个偏好字段持久化；替换排除 lock.branchBridgeSmoothStrength 等对象属性；全局 let 229→221；verify 12/12
- [x] 重构：核心场景 store（选择集，0.2.57）：modules/core/scene-store.js（Proxy 可变状态容器 + snapshot/restore/subscribe）+ modules/edit/selection-store.js（选择集 12 状态 + selectionSnapshot 对接 project-state 快照）；app.js 全局 let 241→229；verify-smoke 12/12（4 .ahs 加载 + 选择交互 + IO 对话框）
- [x] 重构：全部模块按域归组（0.2.57）：core(5)/data(6)/edit(4)/geometry(14)/material(1)/sculpt(1) + io(9)，扁平模块归零；material-state 跨域 import 改相对路径；verify-smoke 8/8（脚本路径同步更新到 data/）
- [x] 重构：IO 域落地 + IO 子系统拆出（0.2.57）：modules/io/ 收纳 8 个现有模块（file-actions/file-drop/obj-export/obj-import/usda-export/project-schema/project-state/recent-projects，纯路径改动）；从 app.js 拆出 save/export + 文件对话框到 modules/io/project-files.js（依赖注入：snapshotState/strandCurveParameters/curveSurfaceControllerCurves/safelyRememberRecentProject 4 函数 + 8 个状态 getter/setter；downloadProjectFile 仍经 fileApi 供 downloadPreferencesAndPresets 调用）；app.js 39,207→38,785 行；verify-smoke 8/8（新增导出/保存对话框打开检查）
- [x] 文档检索重构（0.2.57）：js-change-annotations 195 条目按 6 子系统拆分（annotations-bridge/region-panel/root-bone/split/display-fixes/adapt，原文件改为索引）；bug-fixes #3 拆 #3/#4/#5；新增 FUNCTION_INDEX.md/.json（node scripts/gen-function-index.js 机器生成）、REFACTOR_PLAN.md、scripts/verify-smoke.mjs（自包含浏览器冒烟验证）
