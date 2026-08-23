# 根骨骼 gizmo / twist / H 模式

> 由 devlog/js-change-annotations.md 拆分而来；入口见 [AGENT_QUICKSTART.md](AGENT_QUICKSTART.md)（新 agent 必读）；文档路由表见 [README.md](README.md)。

> 相关函数/关键词：captureBranchLocalState、pointerHitsTransformGizmo、branchRootGizmoFrame、strandControlPointFrame、applyBranchRigidRootMove、扫掠起始手柄、twist / H 模式

> 说明：条目按子系统归类，同一开发阶段（2.x / Phase 2.15 等）的条目可能分散到多个文件，请按关键词跳读。

  - **骨骼点击选中增强（接近高亮 = 在范围内）**：`strandControlPointHitFromEvent` 对当前 `hoveredControlPoint`（高亮控制点）用 2 倍拾取半径（24px）优先命中——点击高亮骨骼不再因 12px 固定半径不中而落到宽度拖动条或父发片；`prepareCurvePointSelection` 在非 component 模式下点击高亮控制点也 selectLock 其所属发片并阻止穿透（不再误选到父发片）。验证：hover 命中 18px 处骨骼 → handle:true；30px 外 → false。

- **Phase 2.15（Region 选区左右方向修正 + 选区记忆 + sweep 手柄选中 + 桥接接缝法线）**：版本 0.1.4-Sintaka.0.2.37（按用户要求重写并清理：扫掠从根 gizmo 链式绑定 + 完整 twist）。

  - **扫掠 up 乱转根因 + 圆柱体 up 方案（0.2.35）**：回退 0.2.33/0.2.34（twist 绝对值/增量方案都引入偏移）。深挖根因：分支子级法线与切线天然近平行（退化），strandGeometryFrameAt 每帧向「退化法线+twist」的 desiredZ 做 roll（±24°/环），累积把 up 转到与骨骼 up 约 140° 反向（用户看到 ~120° CCW 偏移），拖动（尤其右后上侧对角）时 up 乱转；种子只定初始方向、第一帧就被 roll 带偏。**正确方案**：up 直接用圆柱体模型 —— cross(bitangent, normal) = -父切线（种子已提供），沿子级曲线**纯平行传输**，分支子级不再向退化法线做任何 roll、也不施加 authored twist。验证（保存的 0041，SL3）：静止态 sweepUp 与 boneUp 夹角 1.2°（原 140°）；对角拖动（+x+y-z / -x+y+z / +x-y+z / -x-y-z）下 sweepUp 稳定在 (0.0x, 0.07, -0.03) 不乱转、沿长度 y 始终为正。注：authored twist 目前不作用于分支子级扫掠（up 由圆柱体决定），如需恢复 twist 再说。

  - **扫掠链式绑定 gizmo + 完整 twist + 清理（0.2.37，按用户三条要求重写）**：① 扫掠 twist **完全遵循子骨骼**（完整 authored twist 施加在传输的未加twist up 上）；② **gizmo 热更新不动**（strandControlPointFrame / syncBranchRootHandleFrame 未改）；③ 扫掠从**根骨骼 gizmo 帧链式(平行传输)绑定**——种子 = strandControlPointFrame(lock,0) 的 up 重定位到扫掠起点切线，每帧把未加twist 的 up 平行传输、再完整施加 twist，扫掠起始控制器同链；④ **清理代码**——去掉 untwistedX/cross(refX,tangent) 那套，改为干净的 untwistedZ 链。验证（保存的 0041，SL3）：sweepUp=(-0.075,0.026,0.008) 相对 gizmo up 转 ~75°（= authored twist 保留），对角拖动时 sweepUp 稳定在 (-0.06~-0.075, 0.03~0.08, ±0.04) 不乱转、与 gizmo 一起旋转（sweepUpBoneAngle 同类拖动保持 74.7°）。

  - **扫掠 up 完整保留 twist + 不乱转（0.2.36，按用户方案重写）**：按用户设计——up = cross(父圆柱体副切线 X=frame.x, 子骨骼切线) + **完整 authored twist**（绕子级切线旋转，用户用旋转工具控制）。种子 X 用父 frame.x（横向分量，非父切线），扫掠每帧把副切线平行传输、z = cross(传输X, 子切线) 再 applyAxisAngle(tangent, twist)。子骨骼自身退化法线完全弃用。验证（保存的 0041，SL3）：静止态 sweepUp=(-0.077,0,0.02)（= cross(X,子切线) 转 -67° 完整 twist）；对角拖动时 sweepUp 稳定在 (-0.07,±0.06,±0.03) 不乱转；sweepUpBoneAngle 变化源于 boneUp 随拖动变化，sweepUp 本身稳定跟随子骨骼。

  - **sweep 起点黄色手柄选中/拖拽修复**：黄色手柄与粉色 WidthCurve 控制点重叠时，beginBranchSweepStartDrag（capture 最前）命中手柄后只 stopPropagation（不阻止同元素其它监听），beginTaperMeshPointDrag 仍同时启动——按下先控宽度、松开时 taper 的 finishTaperMeshPointDrag 用 stopImmediatePropagation 吞掉 pointerup，黄色 endBranchSweepStartDrag 不再执行 → branchSweepStartDrag 残留，之后不按鼠标也能拖动黄色手柄。修复：命中后改 stopImmediatePropagation（阻止宽度拖动同时启动）；updateBranchSweepStartDrag 增加 event.buttons 主键检测（无按键不移动，兜底残留状态）。

  - **根骨骼移动手感：H 开启时子骨骼刚体跟随 + 0.5 曲率摆动（0.2.23）**：之前移动根骨骼（W）只移动根（H 关闭），H 开启时 applyHierarchicalMove 平移整条骨骼但末端不随父发片曲率摆动。修复：beginHandleEdit 在拖根骨骼（pointIndex===0 且有 branchParentId）时记录 branchRigid（父曲线连续 frame 四元数 frameQuat + 子骨骼相对根的世界形状 deltas）；移动路径（TransformControls objectChange 与 viewPlaneMove）在 enforceBranchRootPosition 后调 applyBranchRigidRootMove——用「新 frame 相对旧 frame 的相对旋转」（新·旧⁻¹）与 identity（完全平直）按 0.5 slerp，把记录的世界形状绕新根旋转后放置，子骨骼保持刚体形状、末端随曲面曲率轻微摆动（先写死 BRANCH_RIGID_CURVATURE_BLEND=0.5）。注意：必须用连续曲线 frame（curveFrameAt）而非 branchParentFrame（离散控制点 frame，参数跨控制点会跳变）；相对旋转而非绝对 frame 朝向（绝对朝向会让末端被父 frame 的世界姿态甩飞）。验证（Sussurro_v1_0040，SL3）：拖根 0.06 后所有点跟随根位移（≈0.017/0.036/-0.016），末端额外轻微摆动（末点 0.026/0.021/-0.011）。

  - **左右拖动摆动不明显 → 引入椭圆横截面横向法线（0.2.24）**：之前 applyBranchRigidRootMove 只用了连续 guide frame（curveFrameAt，只随 u 变），横向（v/across）拖动时 frame 不变 → 末端不摆。修复：新增 branchSurfaceFrameQuat(parent, param, across)——在 curveFrameAt 基础上按父发片 width/depth 构造临时椭圆截面（a=width/2, b=depth/2，法线 ∝ (s/a², z/b²)，z=b·√(1-(s/a)²)，s=clamp(across,-a,a)），把横向法线倾角叠进表面 frame；记录（beginHandleEdit）与移动时（applyBranchRigidRootMove）都用它，新旧表面 frame 的相对旋转再 0.5 blend，横向拖动末端随之摆动。验证（Sussurro_v1_0040，SL2 width=0.1755/depth=0.2808，SL3）：横向拖根 0.06 → 根位移 0.026、末端摆 0.38（绕切线约 15°）；纵向/斜向不受影响（u 曲率 + 横向倾角叠加）。

  - **根骨骼切线方向平滑滑动（0.2.25）**：branchParentFrame 之前把 parameter 四舍五入到父引导线**控制点索引**（离散层级），上下（切线方向）拖根会被吸附到控制点行、跨中点时跳变。修复：branchParentFrame 改用**连续参数 + curveFrameAt**（frame.point = CatmullRom 曲线 getPoint(t)），根骨骼在控制点之间平滑滑动，同时保留「横向吸附」——rootPoint 仍是 frame.point + frame.x·across（沿引导线横向对齐），左右拖动不受影响。实测 curveFrameAt 与 curveFrameAtPoint 在控制点处朝向完全一致（0°），改连续只平滑插值、不改变朝向。验证（Sussurro_v1_0040，SL3）：dy=-0.1/-0.2/-0.3 → 参数 0.48/0.59/0.77，根平滑下滑 0.11/0.19/0.29（无跳变），几何 0 NaN；横向仍摆末端 0.38。

  - **切换 Hierarchy(H) 时子发片跳变修复（0.2.26）**：切换 H 会 locks.forEach(updateLockGeometry)，父发片重建触发 updateBranchChildren 用 branchLocalPoints 重推子级点位；而存档里的 branchLocalPoints 是相对旧离散 frame 捕获的，0.2.25 把 branchParentFrame 改连续后与新 frame 不一致 → 子发片被重推到另一处（根骨骼不动、其余点闪动）。修复：restoreSceneCollectionsForStateRestore 在恢复完所有 lock 后对每个分支子级重新 captureBranchLocalState（用当前连续 frame 从恢复的引导点重推 branchLocalPoints），使局部状态与 frame 一致，重建不再跳。验证（Sussurro_v1_0040，SL3）：切换 H 前后 points 完全一致（不再跳变），拖动后切换也稳定。

  - **拖动 Region 时子发片根部扫掠改变修复（0.2.27，与 H 跳变同源）**：拖动 Region → setBranchRootRegionPoint → 重建父级 → updateBranchChildren 会从 branchLocalSurfaceNormals 重推子发片 pointSurfaceNormals；而 captureBranchLocalState 之前用 stableBranchBaseNormals（无 twist 的基础法线）捕获，与子发片真实法线（扫掠 frame 用的）不一致 → 重推后法线被覆盖 → guidedNormalAt/扫掠 frame 朝向改变 → 根部扫掠闪动。修复：captureBranchLocalState 改用子发片**真实的 pointSurfaceNormals**（缺失时回退 stableBranchBaseNormals）捕获 branchLocalSurfaceNormals，updateBranchChildren 在父 frame 不变时逐点还原、不改变扫掠。验证（Sussurro_v1_0040，SL3）：移根后拖 Region，pointSurfaceNormals 全程不变、扫掠环 ring 与移根后完全一致（仅 bridgeCount 随洞口变化，属预期）。

  - **根骨骼移到边缘时 up 翻转修复（0.2.28）**：分支子级沿父发片法线生长，其 pointSurfaceNormals 与子级切线近平行（dot≈0.87），guidedNormalAt 投影退化、退到径向 fallback（依赖世界原点）→ 根骨骼移到边缘时扫掠 frame 的 up 整体 180° 翻到下面。修复：createBranchChildGeometry 扫掠前用**父发片根部切线**（指向父根部，即 -parentFrame.y 投影到子级切线平面）构造种子 previousFrame（z=up 垂直于子级切线），平行传输稳定整条扫掠；分支子级 ring 的 up 本来就 ≈ -父切线（实测 dot -0.848），所以初始外观不变、只是不再翻转。验证（Sussurro_v1_0040/0041，SL3）：横向拖根 0.05/0.12/0.20、纵向 -0.25，ring up 始终 +y 不再翻到 -y；初始 ring 与修复前完全一致。

  - **根骨骼横向拖动不再飞出（tube 约束，0.2.29）**：用 TransformControls 的 X 轴横向拖根时 across（横向偏移）无界增长（0.05→0.85，半宽仅 0.088）→ 根骨骼飞出主发片。架构判断：tube 代理（数学化扫掠椭圆管）是正确模型，现有代码已具备大部分拼图——连续 frame 锁切线（0.2.25）、扫掠种子锁法线/up（0.2.28）、椭圆截面算朝向（0.2.24），缺的只是把横向偏移夹到管宽范围。修复：enforceBranchRootPosition 里 across = clamp(···, -halfWidth, halfWidth)（depth 只用于 frame 朝向，不参与夹紧），根骨骼沿横向线滑动、到边缘即停，不再飞出。验证（Sussurro_v1_0041，SL3）：dx=0.05/0.1/0.2/0.4/0.6 → across 始终 ≤0.088，根不飞出；横向边缘 0.05~0.25 下扫掠环 up 始终 +y。注：根骨骼仍保持在 frame.point 横向线（z=0），未放到管表面（z=b≈0.14），避免存档外观整体外移；若后续要「贴表面滑动」可再做。

  - **H 模式刚性旋转摆幅上限（0.2.30，防 up 翻转/轴乱飞）**：H 开启拖根时 applyBranchRigidRootMove 把整个子发片按「新旧 surface frame 相对旋转 × blend」旋转。横向移动时父发片椭圆截面法线倾角可达 ~90°（窄管 a=0.088<b=0.14），blend=1.0 时子发片整体转 90° → 轴乱飞、up 翻转。架构确认：旋转补偿**已经是数学 tube**（连续 frame + 椭圆宽深），不是实时查主发片网格；缺的是总摆幅限制。修复：applyBranchRigidRootMove 对 relative 旋转角做上限（BRANCH_RIGID_SWING_LIMIT_DEG=60，先写死），超过则向 identity 缩到上限，再乘 blend——即使 blend=1.0 也不会 90°+ 乱甩/翻转。验证（Sussurro_v1_0041，SL3）：blend=1.0 横向 dx=0.05/0.1/0.2/0.4 → 旋转角 26°/48°/52°/61°（封顶），扫掠环 up 始终 +y。注：骨骼箭头/gizmo 用的原始 frame（curveFrameAtPoint 退化法线投影）在极端位移下仍可能翻转，若仍可见再单独处理。

  - **分支根骨骼手柄/gizmo frame 稳定化（0.2.31，修 H 模式绿轴 120° 旋转）**：gizmo 的手柄 frame 之前用 curveFrameAtPoint（子发片自身退化法线：法线与切线近平行），X/Z 轴会翻转、四元数跳变（如 (0.84,-0.21,-0.14,-0.48)→(-0.19,-0.53,0.82,0.10)），视觉上绿轴(切线)整体狂转（用户实测顺时针 120°）。修复：新增 strandControlPointFrame(lock, index)——分支子级根手柄（index 0 且有 branchParentId）用稳定 frame（y=子级曲线切线、z=父根部切线投影、x=cross），与扫掠种子同源；其余手柄照旧。updateCurveObjects 三处（手柄/重建手柄/法线箭头）改用该函数。验证（Sussurro_v1_0041，SL3）：H 模式横向拖根 0.05/0.12/0.25/0.5、纵向 -0.25、斜向，绿轴单步转角 17-30°（平滑），不再 120° 突跳；根手柄初始朝向仅变化 ~11°。

  - **H 模式拖根时 gizmo 热更新跟随扫掠（0.2.32）**：gizmo（TransformControls 手柄）四元数在拖拽开始时被冻结，而 H 模式的刚性旋转让扫掠（子发片几何）跟着转，拖拽中 gizmo 停在原地、扫掠转过去 → 看起来「扫掠不跟随骨骼/扫掠自己扭」。修复：新增 syncBranchRootHandleFrame(lock)，在两条 H 模式移动路径（TransformControls objectChange + viewPlaneMove）的 applyBranchRigidRootMove 之后，把根手柄四元数更新为 strandControlPointFrame(lock, 0) 的稳定 frame —— 拖动中 gizmo 与扫掠同步跟随骨骼。实测（Sussurro_v1_0041，SL3）：扫掠环 up 与骨骼 up 方向差仅 ~8°（扫掠环在 guideT=0.1、骨骼在 t=0 的位置差导致），拖到边缘时两者一起平滑转动，无独立扭动。

  - **根骨骼 gizmo 携带用户 twist + 根骨骼跟随 gizmo（0.2.38，Phase 2.15 收尾）**：0.2.32 的热更新用 strandControlPointFrame（无 twist 的管基准），用户用 rotate 工具手调过根点 twist（pointTwists[0]）后，再次按 W 进 move（setActiveTool → updateCurveObjects 重建手柄）会把 gizmo 拉回无 twist 基准 → 出现偏移/回绕；且根骨骼 up 仍取管基准/旧法线（用户看到始终朝上），不跟随 gizmo。修复：新增 branchRootGizmoFrame(lock) = strandControlPointFrame(lock,0)（width/depth 管模型基准）+ controlPointRotationAt(lock,0)（用户完整 twist 绕切线旋转），再 x=cross(y,z)、z=cross(x,y) 正交化；syncBranchRootHandleFrame 与 updateCurveObjects 三处（建手柄/刷新手柄/法线箭头）统一改用该 frame，并把 pointSurfaceNormals[0]/rootSurfaceNormal 同步为 frame.z。效果：W 重建手柄与热更新拿到同一 frame（不再回默认/偏移，「热更新只作开始基准、用户手调 diff 作为 offset 保留」由 pointTwists[0] 承担）；根骨骼 up 直接跟随用户手调的 gizmo（不再强势跟随无 twist 热更新）。验证（Sussurro_v1_0041，SL3）：twist=-1.168 时 updateCurveObjects 重建前后手柄四元数逐位一致且 == branchRootGizmoFrame；改 pointTwists[0]=0.5 后 H 拖根，gizmoUp==pointSurfaceNormals0、twist 保持 0.5 不被覆盖、扫掠环 up 稳定、0 NaN。版本 0.1.4-Sintaka.0.2.38。

- **Phase 2.16（删除子发片补洞 + 直接桥接跟随 region 中心 + 橙色中心控制点 + Show points 恢复 + 根部 twist 释放）**：版本 0.1.4-Sintaka.0.2.39。

> 相关：另见 annotations-bridge.md（0.2.39 补洞 / 0.2.43–0.2.44 侧面填充）、annotations-region-panel.md（0.2.41 橙色中心锚点）。

  - **左右移动根骨骼后点别处蹦回主发片中心修复（0.2.40）**：captureBranchLocalState 之前把 points[0] 直接 copy 到 frame.point（父引导线中心）并把 branchLocalPoints[0] 置零——该函数在拖拽结束（commitClumpMemberRestState）、父级重建、H 切换/恢复存档时都会跑，但只改数据不重建网格，所以横向移动根骨骼后看不出问题，直到「点别的地方」触发一次重建（选中其它发片/重进工具/父级重建）才蹦回中心、子发片轨迹被拉直扭曲。修复：capture 时先求根骨骼相对当前 frame 的横向偏移 across = (points[0]-frame.point)·frame.x，points[0] 改为 frame.point + frame.x·across（保留横向位置），branchLocalPoints[0] = {x: across, y:0, z:0}，与 enforceBranchRootPosition 的约定一致。验证（Sussurro_v1_0041，SL3）：H 模式横向拖根 0.12 → across=0.0748；commit（拖拽结束）后仍 0.0748；selectLock 父级 + 重建子级仍 0.0748；父级 rebuildLockGeometry（updateBranchChildren 重推）仍 0.0748；几何根环位置与拖后一致、0 NaN。  - **删除子发片后父发片补洞（0.2.39）**：父发片网格是程序化挖洞的（applyBranchRootRegionCarving 按存活的 branchChildrenFor 每次重建时重新挖），但 deleteLocks 删除子级后没有重建父级 → 孔洞残留。修复：deleteLocks 先收集被删分支子级的父级 id，删除完成后再对仍存活（locks 中存在）的父级 updateLockGeometry({ immediate: true }) 重建 → 挖洞按现存子级重算、孔洞闭合。文件保存只存引导参数（不存网格），加载时重建+重挖，因此存档天然无孔洞数据（程序化流程与保存数据一致）。验证（Sussurro_v1_0041，SL2 父/SL3 子）：父级 quadFaces 删除前 254（挖 6），删除后 260=满格（gridRows-1)×facesPerRow。

  - **gizmo 中心（万向自由移动）拾取半径恢复（0.2.41）**：deflateTransformGizmoPickers 把所有非圆柱/环 picker 缩到 0.5x，translate 模式中心 XYZ（OctahedronGeometry）拾取只有可见大小的一半，子发片大/相机远时点不到中心万向移动。修复：对 name 为 XYZ 的中心拾取几何跳过 deflation（保持全尺寸与可见 gizmo 一致），轴 picker 仍 deflate 保证精确抓轴。验证（Sussurro_v1_0041，SL3）：gizmo 中心可点半径由 ±8px 提升到 ±20px，mousedown 后 axis=XYZ、dragging=true。  - **直接桥接选区跟随 region 中心（0.2.39）**：buildBranchBridgeGeometry 的 rootRow 之前用 lock.branchParentParameter（父骨骼位置）折算行号，region 在面板里移动（中心偏移、骨骼不动）时直接桥接不跟随 → 骨骼行落在洞外时侧面直接桥接的 boundaryAt(rootRow, col) 越界找不到顶点 → 侧面桥接消失、顶/底带按全高+补末端（rootRow≠rowMin/rowMax）多出段数。修复：rootRow 改取 region 中心行 round((rowMin+rowMax)/2)（永远在洞内），侧面直接桥接与顶/底直接桥接判定都随 region 中心更新。验证（Sussurro_v1_0041，SL3）：region 中心下移 0.05（骨骼参数 0.3906 不动）→ rootRow 10→11、rowMin 9→10、rowMax 11→12，左右 side bridge 均存在，bridgeVertexCount 19 稳定。

  - **已选中骨骼后点击 gizmo 不再被附近骨骼抢选（0.2.42）**：prepareCurvePointSelection 之前的 gizmo 优先条件要求 `(!hit || attachedPointHit)`——当点击落在 gizmo 拾取范围内但同时又命中了附近一个未选中骨骼（相机拉远后骨骼在屏幕上变近，或 gizmo 拾取与相邻骨骼重叠）时，会落到 activateStrandControlPoint → 把选中抢到相邻骨骼并 detach/重挂 gizmo，用户点 gizmo 中心却点到骨骼。修复：只要 `pointerHitsTransformGizmo(event)` 为真就提前 return（保留 remove/insert 曲线点模式对点的优先权），即骨骼已选中（gizmo 已挂载）时 gizmo 总是赢，点 gizmo 中心/附近不再抢选到相邻骨骼；点远处骨骼仍正常选中。验证（Sussurro_v1_0041，SL3）：拉远相机使点0/点1 屏幕距 16.5px，在 gizmo 中心朝点1 70% 处点击（gizmoHit=true、最近手柄=点1）→ 修复后 selPoint 保持点0/attached=0 不抢选；点 gizmo 中心 → axis=XYZ、dragging=true；点远处点3 → 正常选中并挂载。  - **region 中心橙色控制点（0.2.39）**：浮动面板 renderBranchRegionEditor 新增橙色（#ff9a3c）中心圆点（data-region-point="center"），拖动它 = 整体平移 region（复用 rect body 的 move 模式：startU/V=中心、startRegion=当前 cross 拷贝）；3D 视口 branchRootRegionWorldPoints 新增 center（rowC,colC），updateBranchRegionMeshPoints 用橙色材质 branchRegionCenterMeshPointMaterial + 1.6 倍尺寸渲染（面板 5 点、3D group 5 个 marker，颜色 8fd8ff×4 + ff9a3c）。

  - **根骨骼移动**：约束在父表面滑动（enforceBranchRootPosition 重算最近 guide 参数 u + across→v，v=0.5-across/width）；H 开启拖根时整条子骨骼刚体跟随 + 0.5 曲率摆动（applyBranchRigidRootMove）。

- **子发片深度重置 2.12（体验优化 + Width 跟随 + RootCtrl 解锁）**

  - **RootCtrl 解锁**：子骨骼根关节 W 可移动（不再灰色），约束在主骨骼 Width 平面滑动（保留 frame.x 分量、投影回表面）；移动时更新 branchParentParameter、选区面板相对位置（u/v 中心跟随）、直接桥接区域（重挖洞）。

  - **sweep 手柄半径减半**：scale 1.2 -> 0.6。

  - **sweep 手柄缩小**：scale 1.8 -> 1.2（用户确认好用易拖，只是太大）。

  - **sweep 起始手柄可见**：手柄沿子发片 guide 的 frame.z（朝外法线）偏移 0.06 摆到毛发表面外，不再埋在根部截面里。

  - **sweep 手柄可见性**：放大 1.8x、renderOrder 40、depthTest false（原本被其它头发遮挡看不到）。

  - **sweep 起点手柄**：子发片曲线对象新增黄色 branchSweepStartHandle(沿子引导线根->尾滑动，控制 branchSweepStartT 0.02-0.6，默认 0.1)；createBranchChildGeometry 用 branchSweepStartT 替代写死 0.1；指针拖拽(注册到 capture 最前，避免被其它 pointerdown 吞掉)+ 序列化/恢复 + 撤销。
