# 本地适配进度

<!-- 本文件由 devlog 拆分而来；入口见 README.md 索引 -->

## 本地适配进度 / Local adaptation log

> 记录相对 main 分支（原版本）的适配改动。

- [x] 吹风预览系统（0.2.112，分支 DHS/develop）：① 新增 `modules/geometry/wind-preview.js`（纯函数零依赖，node 可测）——`mulberry32`（确定性 PRNG）/ `perStrandWind(seed, strandId, intensity)`（phase/amp/offset 随机化，intensity=windStrandRandom 缩放：0 时全发丝一致、1 时全强度向后兼容）/ `fbm4`（octaves=3/lac=2/gain=0.5 归一化）/ `windAngleAt`（θ=strength·amp·gust·(1+turb·fbm)·t^p，gust=0.5+0.5·sin(2π·gustFreq·t+phase/2)，t<0.02 根行硬锁）/ `windAxis`（normalize(cross(windDir,up))）/ `windRowQuats`（根到尖累积世界旋转四元数 Float64Array）/ `slerpQuat`/`rotateVec3`/`deformVertexData`（原地变形，row=−1/NaN 顶点 passthrough）；② `js/vendor/simplex-noise.js`（新，simplex-noise 4.0.3 MIT ESM 单文件，`createNoise4D(mulberry32(seed))` 确定性；注：open-simplex-noise 是 CJS 不适用）；③ 新增 `modules/core/wind-store.js`（scene-store 模式：10 持久化参数 windDirection/Strength/Frequency/Turbulence/TurbulenceScale/GustStrength/GustFreq/RootExponent/StrandRandom/Seed + 运行时 windPreviewActive/windPlaying/windTime）；④ UI：Preview 菜单 `#toggleWindPreview`（Turntable 同款 menuitem + `#windPreviewMenuState`）+ `#windPreviewPanel`（strands 组 10 滑杆 + Pause/Close，hidden 由 app.js 切换）+ loc-zh/loc-ja 各 +13 key；⑤ app.js 接线（+283）：`windPreviewCache` WeakMap（不入 .ahs 序列化）、`windNoiseCache`（seed 失效重建）、`buildWindPreviewCache`（rest 快照 + 链点由 CatmullRomCurve3 采样——curveFrameAt 不暴露 point）、`windPreviewTick`（animate 钩子；windPlaying 才推进 windTime；tick 先复位再变形防每帧旋转复合累积）、`setWindPreviewActive`（启用建缓存/关闭逐位恢复）、编辑互斥 3 点（beginHandleEdit/rebuildLockGeometry/resetEditableSceneForStateRestore）、滑杆接线（seed/strandRandom 变更清缓存）、`__ahsTest.windPreviewApi`+`windState`；⑥ 实测（scripts/verify-wind-preview.mjs，headless Chrome + CDP + 离线 three vendor 拦截 unpkg）：Sussurro_v1_0046.ahs 26 locks/9685 顶点，启用后 9091 顶点变形、**根行位移 0 尖部主导**（root=0 tip=573）、暂停逐位确定、关闭逐位恢复、菜单/面板切换正常、0 页面异常 — **11/11**；测试 wind-preview 12/12（确定性/值域/根少动尖多动/intensity/−1 passthrough）；⑦ 版本 0.2.112。踩坑：`npm install --no-save` 会剪除 package.json 未声明依赖（three 被删→已重装 three@0.165.0）；PowerShell `@(@('a','b'))` 单元素嵌套数组被展开成字符串对、`$p[0]` 取首字符 `.` → index.html 全文件 `.`→`/` 替换（git checkout 恢复 + 重放 UI 改动；写文件勿用数组下标取对）；unpkg 部分时段 DNS 不可达 → 验收脚本本地 vendor three（Fetch 拦截，verify-smoke 同款）
- [x] UV 打包多线程化（0.2.110，分支 DHS/develop）：① `uv-pack.js` 两段式重构——新增导出 `preparePack`/`sampleMaxK`/`refineMaxK`/`applyPackResult`（采样/细化/应用拆开供并行用），同步 `packFamilies` 重写为 prepare → 每 seed sample+refine → apply，输出逐位不变（冻结回归 fixtures/uv-pack-reference.json，k=0.7383176101460982 精确命中）；② `alpacaPackOccupancy` 内部换**行区间表**（每行已占 x-闭开区间二分判空 + 插入合并，替代 Uint8Array 栅格+积分图+每岛放置后 O(256²) 全量重建；fitsAt 跨调用复用 rows），差分验证 2 万次随机 mark/query + 160 组完整打包与旧实现**逐位一致**；同步 23 岛 4.0s→1.6s（2.5×）；③ 新增 `uv-pack-async.js`（`createPackAsync({createWorker,workers})` + 懒建单例 `packFamiliesAsync`：阶段 1 = 8 seed×8 块 64 个 sample 任务（每任务 16 采样索引）、阶段 2 = 8 个 refine 任务，确定性合并 = 每 seed 块 max → 全局 k 最大、seed 并列取早，与同步**逐位一致**；boxes 用 Float64Array 传输防 Float32 精度在栅格 ceil 边界翻转 fitsAt；克隆工作副本、成功才拷回 uvs/uvisland → 失败零污染可安全回退；无 Worker/池创建失败自动回退同步；任务失败 reject + dispose）与 `uv-pack-worker.js`（module worker 零依赖 import uv-pack.js，浏览器 self / node worker_threads 双环境，sample/refine 消息协议）；④ 导出链路异步化：`packUnfoldedUv`/`buildUnfoldedMeshes`/`buildHairObj`/`buildHairUsda` 全 async，调用点 4 处 await（performFileAction / exportHairProjectQuickly / UV checker）；UV checker 刷新按钮 disabled + 「Packing…」防重入 + finally 恢复；`?ahstest=1` seam 暴露 `fileApi`；⑤ 实测：node bench（16 workers，64 核）23 岛 1642→341ms（4.8×，对原始 4.0s 共 11.8×）、50 岛 5.1s→736ms、100 岛 10.3s→1.6s；**真实工程 Sussurro_v1_0046.ahs 端到端（scripts/verify-uv-pack-real.mjs，headless Chrome + CDP）buildUnfoldedMeshes 三次 450~458ms（原 ≈4s，≈9×）、78 meshes/31467 uvs/23 岛、U[0,1] V[0.015,0.985]、跨次逐位确定、UV checker 刷新按钮走通、0 页面异常，7/7**；⑥ 新增验证工具 scripts/check-uv-bitidentity.mjs（5 组输入位一致性 + fixture）、diff-occupancy.mjs（行区间表 vs 旧栅格差分）、smoke-async-contract.mjs（worker 池与同步逐位一致）；测试 uv-pack 9/9（+冻结回归 +sample/refine 一致性）、uv-pack-async 8/8（worker_threads 真实池 4 worker ≥72 消息、回退路径、dispose）；⑦ 版本 0.2.110，缓存号定点刷新（uv-pack/uv-pack-async←project-files、project-files←app.js、app.js←index.html 为 20260817-1，其余保持 HEAD 原值以免破坏 dom-contract 冻结模式）。已知基线（HEAD 同款）：dom-contract 89/105 滞后失败、verify-smoke 9/11
- [x] 导出 UV 多起点 seed 择优 + UV checker 刷新预览（0.2.92，分支 DHS/develop）：① `packFamilies` 加多起点 seed 择优——`SEEDS=8` 个确定性 LCG 打乱序（seed 0 = maxSide 基线，其余 Fisher-Yates 打乱）各跑一遍 findMaxKAlpaca 取 k 最大者（并列取基线，同 seed 恒同序列），fillUsed 实测 +7.3%（0.677→0.727）；② UV checker 加 ⟳ 刷新按钮——按一下走完整导出展开流程（`buildUnfoldedMeshes` 已从 fileApi 暴露，与 exportHairObj/Usda 同管线）把视口 mesh 几何临时换成打包 UV 预览几何，棋盘格按导出布局显示、2D Inspector 同步画打包拓扑；关闭/重建/删除/undo 恢复时换回原几何（不泄漏、构建不受影响）
- [x] 导出 UV：占位栅格 L 形扫描（0.2.91，分支 DHS/develop）：参考 Blender xatlas `find_best_fit_for_island` + Nöll & Stricker 2011 论文，新增 `alpacaPackOccupancy`（R=256 占位栅格 + 积分图 O(1) 判空 + scanLine 方形边界 + 两阶段 L 形扫描：阶段1 扫 [minSL,scanLine] 填内部空隙、阶段2 增长边界），替换 turbo——「方形 + 高填充」兼得（23 岛 fillUsed 0.50→**0.76**、方形度 0.91→**0.987~1.0**；40 矩形 fill **0.81**）；turbo/MaxRects/scanline 均注释保留可切回
- [x] 导出 UV：alpaca turbo L 形 zigzag（0.2.90，分支 DHS/develop）：读 Blender `uv_pack.cc` 确认 alpaca=L-packer，核心是填「L」形（顶边水平条带 + 右边竖直条带）并用 `zigzag = nextU1 < nextV1` 切换方向把 bbox 维持在方形——替换掉 scanline/column 纯单方向扫描（那才是「U 满 V 空 / V 满 U 空」绕圈的根因）。新增 `alpacaPackTurbo`（O(n log n)、永远无重叠无溢出，返回 extentU/extentV），`findMaxKAlpaca` 改判 bbox ≤ [0,1]²；占位栅格 + MaxRects 均注释保留可切回。效果：整包 bbox 双侧均衡（23 岛 U=1.0/V=0.91、14 高瘦岛 V 填 96%）、测试 55ms；代价是 L 形缺口使 fillUsed 0.8→0.5（下一步可上 xatlas 占位 L 形扫描补缺口）
- [x] 导出 UV：alpaca 填满 V 方向（0.2.89，分支 DHS/develop）：新增第三种扫描序 `column`（列主序，先填 V 一列再换列）；Smart 择优从「取 max k」改为「按更方选」——6 套「排序(maxSide/area)×扫描(scanline/column/spiral)」各自求 k 后再跑一次 alpacaPack 算整包 bbox，取 `min(spanU,spanV)/max(spanU,spanV)` 最大者（越接近 1 越方），并加 `k ≥ 0.9×kMax` 过滤防 spiral 中心聚拢以低填充胜出；fit 后 V 从 ~0.6 填到 ~0.99（23 岛 spanV 0.9878、fillUsed 0.8、测试 4.7s）
- [x] 导出 UV：alpaca 占位栅格打包（0.2.88，分支 DHS/develop，方案 2 实验）：思路复刻 Blender alpaca——`packFamilies` 的最后 UV 排列从 MaxRects 换成**占位栅格打包**（新增 `alpacaPack`：resolution=128 栅格 + 积分图 O(1) 空位扫描 + scanline/spiral 放置；新增 `findMaxKAlpaca` 二分找最大无兜底 k = scale_to_fit），Smart 择优改 4 套「排序(maxSide/area)×扫描(scanline/spiral)」；**原 MaxRects 三块已注释保留不删**（可随时切回）；fit-to-tile 居中保留。效果：panel 与普通发丝混排、右上角不再空（23 岛实测 bbox u[0,1]×v[0.013,0.987]、中心 0.5、gap 10px、fillUsed 0.79、测试 2.9s）
- [x] 导出 UV：fit-to-tile 整包填满（0.2.87，分支 DHS/develop）：打包后**不再增 gap**（0.2.86 的增 gap 散布缝隙太大已回退），改为**整包均匀缩放 + 居中**——`packFamilies` 在 MaxRects 紧排（gap=PACK_GAP）后，按整包 UV 包围盒做相似变换（绕 bbox 中心等比缩放 `s=min(1/spanU,1/spanV)` 再平移到 tile 中心 0.5），较长轴填满 [0,1]、较短轴居中；不新增岛间 gap、不改岛间相对布局、不破坏无重叠；单岛同样 fit（较长轴填满居中）；tests/uv-pack.test.mjs 新增 fit-to-tile 用例（较长轴≈1、居中≈0.5、不重叠）
- [x] 导出 UV：panel 发尖平直 + 打包 Smart 多策略择优（0.2.85，分支 DHS/develop）：① panel/surface 发尖 UV 平直——`createPanelStrandGeometry` 的 uv 改用平直 u（`boundaries[segment]`/`boundaries[segment+1]` 插值、不含 `tipWidthSpreadGap` 收窄），几何位置仍用含收窄的 u（只改 uv 不改几何，视口几何不变）；② 打包 Smart 多策略择优——`uv-pack.js` 的 `maxRectsPack` 参数化（`heuristic`: contactPoint/bssf × `sort`: maxSide/area/height/width），`packFamilies` 对 6 套策略各自适应找最大 k 取 `fillUsed` 最高者（随机压力 fillUsed 均值 0.8525→0.8769，+2.9%；area/width 排序显著填平右上角）；③ 保留 CP/BSSF 可回退，无兜底、无重叠、不旋转、只位移不变；tests/uv-pack.test.mjs 新增 Smart≥单CP sanity
- [x] 导出 UV 打包优化：panel 原版 UV 回归 + CP 启发式 + gap 10px（0.2.84，分支 DHS/develop）：① panel/surface（刘海）改用**原始几何 uv**（`flatPanelMesh` 直接拷贝 position/uv/quadFaces，不再走 unfoldHairMesh 的 open 展开 → 中间不再被切开），后处理（bbox→统一缩放→UV layout）保留；② 打包启发式从 BSSF 换成 **Contact Point Rule (CP)**（RectangleBinPack 成熟最优启发式，接触越多越好，BSSF 注释屏蔽保留），随机压力下填充率下限 0.789→0.840、均值 0.848→0.863；③ 自适应填充纯二分改「128 点稠密采样 + 邻区间二分局部细化」（fitsAt 对 k 非单调，稠密采样找更接近真最大值）；④ 间隙 PACK_GAP 5px→10px（@4096）；tests/uv-pack.test.mjs 压力回归 fillUsed sanity 提到 >0.6
- [x] 导出 UV 打包换 MaxRects + panel 刘海纳入 + 自适应填充（0.2.83，分支 DHS/develop）：① `uv-pack.js` 打包算法从 shelf 换成规范 **MaxRects**（Jukka Jylänki MaxRectsBinPack，不旋转、BSSF 选位、padding=gap、SplitFreeNode SAT 交叠早退 + PruneFreeList）；② **panel/surface（刘海）整片纳入打包**——整片=一个原子 bbox（内部 open 展开不切缝、无 5px 约束），width 不传、由 packFamilies 按 area/length 推导（统一纹素密度），与 closed/split 主发片+子发片一起按真实宽高排列；③ **自适应填充**——k 在 PACK_FILL 上限内二分（约 40 次）找「所有 bbox 放得下」的最大值，再「真实打包验证 + overflow 缩小重试」（BSSF 贪心对 k 非单调，lo 邻域有拟合岛/失败带交错），保证最终**无兜底、无重叠**、尽量铺满 UDIM 1001，返回新增 `fillUsed`；④ 修复初版 MaxRects 的 splitFreeNode 缺 SAT 早退导致自由矩形列表污染 → 大量重叠（主进程随机压力测试复现 14229 处，已修）；tests/uv-pack.test.mjs 新增确定性压力回归（LCG seed、40 随机矩形、无兜底/无重叠/间距≥gap/在[0,1]）
- [x] 导出 UV 统一缩放 + 打包进 UDIM 1001 + uvisland 岛编号（0.2.82，分支 DHS/develop）：① `childUTopologyScale` 末尾硬编码 U 方向中心缩放 0.9（span 围绕中心缩到 0.9、中心不变）；② 新增 `modules/io/uv-pack.js`（纯函数零依赖 `packFamilies(families,{gap,fill})`）——导出最后一步把每个「主发片 + 其子发片」family 按真实 3D 尺度统一缩放（统一纹素密度·面积归一：全局 k=sqrt(PACK_FILL/Σ世界表面积)、每 family U 宽=k×周长(gridUvTable.circumference)、V 高=k×曲线长(CatmullRom)，保持真实宽高比、不再强制 U/V 归一到 0-1），再按 bbox shelf-pack 进 UDIM 1001（间隙 PACK_GAP=5px@4096、不旋转只平移、bbox 为最小单位整体位移、不动内部 UV 结构）；③ USDA 新增 `primvars:uvisland`（int、interpolation=uniform 每面一个值）——每个 bbox 一个稳定岛编号 0..N-1，供 DCC 按 `@uvisland==k` 选岛；OBJ 无 primvar 机制不输出；④ 接线 `buildUnfoldedMeshes` → 新增 `packUnfoldedUv`（closed/split 主发片 + branchParentId 子发片分组，length=CatmullRom 曲线长、circumference=gridUvTable）；panel/haircard 等 open 类本轮不纳入打包；新增 tests/uv-pack.test.mjs 纯 node 回归（面积/缩放/不重叠/退化守卫/uvisland）
- [x] 分支整理 + 统一 dev 分支（0.2.81）：新建 `DHS/develop`（自 upstream/main d3358f6 起线性 315 提交；origin/main 为旧快照上传、内容分叉，不作变基目标）；删除已合并的历史本地分支（0.2.57–0.2.69、codex/*、v0.1.4-*），4 个被替代实验提交记录后丢弃（0.2.58 tipScale 实验 60ea078/471cc93、codex/bangs-triangle-fix 分支规范文档 4f00851、v0.1.4-Twist-Fix 0.2.43 旧实现 7ec806c）；`branch-deployment` fast-forward 至 DHS/develop 并推送 origin；分支规范更新为「DHS/develop 统一开发 + 临时 feat 分支用后即删 + deployment 发布」；版本 0.2.81

- [x] 修复发尖宽度控制点「死区」+ USDA/OBJ 导出 panel zipper 缝被填（0.2.80，0.2.69-bugfix）：① `tipWidthMultiplierAt` 的 fork 守卫由绝对 u 符号改段内相对符号 `(u - centerU) < 0 ? -1 : 1`——不跨 0 的段原先整段被绝对符号判成同一侧、守卫取到另一侧 zipper 的 fork，t ∈ [本侧 fork, 另一侧 fork) 的视口拖拽写入了 bone 曲线（右侧曲线面板跟随）但几何永远走回退全局曲线分支（死区）；修复后死区消除（函数级断言 mR 1.192→2.0、mL 锁定区不变）；② panel 网格 grid 列号在段边界重叠（colBase 累加未预留边界列，相邻段边界列共用同一 (row,col) 格子，Front Bangs 1 实测 42 个重复 cell）→ 导出 unfold "open" 重映射把缝两侧边界链坍缩到同一槽位、面被桥接到对侧、缝被填（USDA/OBJ 同病；0.2.70 前 panel 无 grid primvar 走原始回退所以旧导出正常）——修复：addPatch colBase 累加改 `sum + count + 1`（C=46→54 恰为每行顶点数，格子唯一）+ `weldPanelGeometryData` weld key 加入 gridRow/gridCol（位置重合但格子不同的顶点不合并）；③ 全量刷新 87 条过期 import 缓存号到 20260814-12 + 新增 `scripts/check-stale-cache-params.mjs`；④ 新增 headless 复现/回归 `scripts/repro-0045-bugs.mjs`（真实指针拖拽 + Phase 0 导出网格断言 + 死区函数级断言）与 `scripts/check-usda-slit.mjs`；回归：core-math 118/118、uv-unfold 全绿、repro 22/24（2 项为指针合成抖动、由函数级断言覆盖）、verify-smoke 11/11

- [x] 桥接意外 seam 修复 + U 拓扑对齐缩放（0.2.79，0.2.69-bugfix）：① 修复桥接底部两道意外 UV seam（一块 poly 被切出去）——根因 bottom band「自然展开」（洞侧 u=环侧 u）与 side fill「对齐洞」（洞侧 u=parent u）在洞底角共享顶点处 UV 不连续；修复：bottom band 改为与 top/side 相同插值（u/v 向洞侧 lerp），洞底整圈 UV 连续；② 扫掠 U 缩放改「拓扑对齐」（替代刚性 1.1 倍）——新增纯函数 childUTopologyScale：缩放参考 = 环顶面（非侧面非底面，环顶点 0..W）弧长 ↔ 顶部桥接洞侧顶点 parent u 跨度；uScale=洞顶跨度/环顶面弧长、uOffset=洞顶 uMin−环顶点 0 自 seam 环向弧长×uScale（环顶点 0 对齐洞顶 uMin、顶点 W 对齐洞顶 uMax，扫掠整体自然延伸约 1.1×洞宽而非严格贴洞边界）；tests 直测（uScale/uOffset、端点对齐、数据缺失回退 null）
- [x] 子发片 UV 微调：U 中心缩放 1.1 + 扫掠下移 + 取消横缝（0.2.78，0.2.69-bugfix）：① 扫掠 U 围绕洞中心横向放大 1.1 倍（span×1.1，中心不变）——U 布局保持「外侧顶部（背面）poly 在中间、侧面在中间两侧、最两侧是后面（seam 双副本 0/1）」；② 新增 childVSweepStart（= childVStart − bottomBandSpan），扫掠下移给桥接 bottom band 留出独占空间（bottom band v∈[childVStart−0.5·childVLength, childVStart]，扫掠在其下方）；③ **取消十字横缝**（seam±1 双副本回退到仅桥接中线竖缝双副本——侧面切缝错误、侧面 UV 展到下面），上下竖缝保留（环 seam + 桥接中线）；tests 增补（span×1.1 中心不变、childVSweepStart）
- [x] split 双管 U 轴排列 + 十字横缝 + 子发片 U 居中（0.2.77，0.2.69-bugfix）：① 主发片 split 两管 UV 不再重叠——管 g 的 u = (前管周长累计 accBase + 本管累计弧长) / 总周长（管 1 排在管 0 右侧）；只有子发片可与主发片重叠；② 十字横缝修正——桥接底带从中心向左右各 2 条边切开（seam±1 顶点链双副本，passthroughSide 改环向序判定修复「切乱」：cxPos=rPos+1→起点 side0、cxPos=rPos−1→终点 side1），中线 side1 u_ring=seamEndU、side0=colU(seamCol)，seam±1 左右副本同值（UV 连续、拓扑分离）——**0.2.78 已取消横缝**（侧面切缝错误），仅保留上下竖缝；③ 子发片扫掠 U 收缩+位移——gridUvTable 新增 uOffset/uScale（colU=uOffset+弧长×uScale），接线按锚点 hole 顶点 parent u 的 min/max 算 uOffset=洞中心−洞半宽、uScale=洞宽/子周长（中心对齐洞中心、宽度≈洞宽、外侧列贴洞左右两段）；seam 副本槽 u 改用 uvTable.seamEndU（不再写死 1）；tests 增补（split 管排列 u 区间、uOffset/uScale、seamEndU）
- [x] 修复子发片 USDA poly 缺失 + 桥接十字切开 + 洞底对齐（0.2.76，0.2.69-bugfix）：① 0.2.73 的「wrap quad 丢弃」造成几何开口（poly 缺失）——恢复**顶点复制式切开**（seam 双副本 u=0/u=1、split 每管一个副本槽、桥接中线双副本 side0/1，**全部 quad 保留**，叠加 0.2.75 弧长 u 与偏移列）；② 扫掠 UV 顶部对齐桥洞最底端（最靠 -V 侧 = cross.down.u 最大）再往下留一个扫掠行高空隙（childVStart=1−down.u−rowHeight）；③ 桥接锚点加 band 标记（branch-bridge.js 8 处）——top/side 向洞侧插值（顶部与侧面顶部对齐主发片洞），bottom 从中线切开自然展开（u 保持环侧、v=childVStart−t×0.5·childVLength 延伸，不强硬对齐洞底）；U 保持主发片周长缩放（用户确认适中）；tests 重写（双副本、quad 全保留、中线 side0/1）
- [x] 修复 split 发丝 UV 展开真实几何下整体失效（0.2.75，0.2.69-bugfix）：根因——0.2.70 的 split gridColIndices 用 `colToSection.findIndex` 按坐标匹配 fused 列：DEFAULT_SWEEP_PROFILE 有 x=0 点且 splitX=0 时 x=0 点被 clip 进两管、colToSection 只归管 0 → 管 1 每行 2 个 findIndex=-1（x=0 副本 + seam 点，实测复现）→ gridUvTable/unfoldHairMesh 的 split 分支「每行每管恰好 1 个 -1」校验失败 → **split 父发片弧长表整体 null → 子发片桥接 UV 接线（bridgeUvAt）整个关闭**（桥接没切 UV、没对齐洞，split 父自身也无展开 UV）；修复：split 网格列改为**管局部列 + 全局偏移**（管 g local col l → colBase+l，local col 0 = clip seam 点即管首列，无 -1），uv-unfold split 分支删除 -1/seam 扫描与 colToSection 依赖（直接读 splitSections），wrap quad 丢弃按「管尾↔管首」col 对判定；AHS_gridCol 语义随之为管局部偏移列（原 fused 列）；tests 重写（偏移列 0..7 无 -1、周长 18、wrap 丢弃、弧长比例）
- [x] 修复桥接 UV 挤点回归（0.2.74，0.2.69-bugfix）：0.2.73 的 bridgeUvAt 对无环侧锚点（sideHoleVertex ring=-1 等纯洞侧顶点，t=1）`colU.get(-1)` 返回 undefined → null → 桥接顶点退回原 uv (0.5,0) 挤成一点（回到最初模样）；修复：ring 无效（-1/不在表）时 ringU=洞 u（t=1 时即洞侧 UV 本身）；split 父发片洞边界上的管 seam 列顶点（col=-1）查 parent 表为 null 时兜底 u=0、v 按 parent 行号；tests 增补 ring=-1 用例（b3 纯洞侧断言 u=洞 u、v=1）且「子 u<0.4」断言收窄为扫掠环顶点（桥接为环↔洞插值可到 parent 尺度）
- [x] UV 展开重构：单边切缝 + 弧长 U + 子发片周长缩放（0.2.73，0.2.69-bugfix）：① 闭合环切缝列不再复制双副本（旧 u=0/u=1 造成「同一列从最左连到最右」）——切缝只有一边（u=0 单边），列按环向从切缝线性排列，**wrap quad 丢弃**（管沿切缝开口，不转头连回；含环自身与桥接跨切缝 quad）；② U 按每列平均宽度（row-0 环向欧氏边宽弧长）调整，u=累计弧长/参考周长（非等间距）；③ 子发片 U 按主发片尺度：referenceCircumference=父发片一圈周长，子发片 u 范围=子周长/主周长（noise U scale 统一）；桥接洞侧 u=parent 弧长表 gridUvAt（同一尺度）、环侧 u_ring=子发片弧长表（ref=主周长重算，中线单副本 u_ring=0）；④ 新增 gridUvTable/gridUvAt 替换 parametricGridUv；⑤ 删除桥接中线双副本机制（wrap quad 丢弃后中线顶点只被右半引用）；split 两管共享周长、wrap quad（seam↔管尾 fused col）丢弃；tests 重写（弧长 u 比例、wrap 丢弃、周长缩放、桥接单副本）全绿
- [x] UV 展开修正（0.2.72，0.2.69-bugfix）：① 桥接子发片切缝纠正——旧值在环 top 侧中点（z=+hd 沿 frame.z=父法线向外=**正面**）方向搞反；纠正为**背面**（不面向外的一侧 = z=-hd 环 bottom side 顶点 ringWidth+1..2ringWidth+1 中点，bridgeSeamCol=ringWidthSegments+1+round(W/2)）；② 桥接底带中线切开——中线（anchor.ring===seamCol）桥接顶点展开时双副本（左 side0 u_ring=0 / 右 side1 u_ring=1，与环 seam 双副本对齐），左右条带各自插值摊平（左半 u∈[u_hole,1]、右半 u∈[0,u_hole]），洞侧左右延伸由每带独立插值到自身洞 u 保证，消除麻花/0↔1 跳变；③ split 发丝麻花根因修复——clip seam 点（splitX 处，colToSection 匹配不到 → col=-1）原 uv 混入矩形 UV；现 seam 点按 splitSections 定位为管 seam 槽（pos 0 u=0 / pos Cg+1 u=1 双副本，u=(k+1)/(Cg+1) 等宽），fused col → 管内序号+1；④ 子发片 V 按主发片尺度归一——v=childVStart−(row/(R−1))×childVLength，childVStart=1−洞中心 center.u、childVLength=子扫掠弧长/主发片长（CatmullRom），从桥接口向下打直延展；U 保持独立归一化 [0,1]（不与主发片对齐，noise U scale 统一）；tests/uv-unfold.test.mjs 增补 split seam / 桥接中线双副本 / childV 归一用例
- [x] 导出矩形 UV 展开（0.2.71，0.2.69-bugfix）：新增 modules/io/uv-unfold.js——按 AHS grid 属性把扫掠网格切成归一化矩形 UV（V 负方向=切线方向：根 V=1、尖 V=0，DCC 中头发竖直向下打直；U 沿列，闭合环在接缝列复制顶点 u=0/u=1 双副本，开放网格直接重映射；每根发丝独立 0-1 tile 允许重叠不打包）；split 两管独立 seam、compound 桥接顶点保留原 uv、panel/hair card/card 开放重映射；桥接子发片从背部中间缝（round(ringWidthSegments/2)，环 far side 中点）裁切 + 桥接顶点 UV 经 {ring,hole,t} 锚点在环侧（v=1）与父发片洞边界参数化 UV 之间插值保证顺滑（branch-bridge.js 记录 bridgeUvAnchors/bridgeSeamCol/bridgeBoundaryParentIndices）；USDA/OBJ 导出接线（project-files.js，蒙皮权重 leafWeights 随 seam 复制）；tests/uv-unfold.test.mjs 纯 node 回归
- [x] 导出扫掠 rows/cols 编号补全全部几何类型 + primvar 前缀 AHS_（0.2.70，0.2.69-bugfix）：split 发丝（段内 local col 经 colToSection 映射回 fused 列号，有子发片的主发丝按未挖洞规格）、hair card / curve-surface card（行主序）、compound 多发丝（基础网格行主序 + 桥接插值顶点 -1）、panel/surface 刘海（像扫掠模拟：row=沿曲线行、col=全局列 front/back 相邻，gridRowsArr/gridColsArr 经 weldPanelGeometryData 重映射）；USDA primvar 改名 `AHS_gridRow`/`AHS_gridCol`；twist 类发丝走普通扫掠已覆盖；poly/braid 预置网格不编号
- [x] 修复 Strand Profile 浮动面板打不开 + 导出扫掠 rows/cols 编号（0.2.69，0.2.69-bugfix）：① branch-sweep.js（0.2.57 3d-3d-b 重构抽取不完整）22 个 DOM/共享/THREE 自由变量既未声明也未注入 deps，点击铅笔按钮 `openSweepProfileEditor` 首处命中 `taperCurveEditor` 裸引用抛 ReferenceError、浮动面板永不弹出——补 import（sampleTaperCurve/twistCurveHandleDistancePerDegree/cloneShapePresetValue，shapePresets 改直接 import 避开 TDZ）+ 22 deps 注入 + app.js 3 处 `branchSweep.branchSweep.activeSweepProfileTarget()` 双重笔误修复。② 几何导出带扫掠网格每顶点 rows/cols 编号（普通发丝前 gridRows×gridCols 顶点行主序，子发片桥接+端盖顶点 -1 除外）：createBaseHairGeometry/createBranchChildGeometry 写 `geometry.userData.gridRowIndices/gridColIndices`，USDA 导出 `int[] primvars:animeHairStudio:gridRow/gridCol`（vertex）；node --check 全绿
- [x] Sweep 切线平滑 + 镜像同步（0.2.68，codex/0.2.68-sweep-tangent-mirror）：`smoothSweepFrames` 按曲率热度后处理每环 frame 切线并重新正交化（脊柱不动、根/尖端 pin）；新增 `lock.sweepTangentSmooth`（0–1 默认 0.3）+ `#sweepOverlapPanel` 第 5 滑块 + ZH/JA +1 key；5 个平滑参数（Strength/Threshold/EdgeSmooth/Falloff/TangentSmooth）接入镜像系统（createMirrorPartner 透传 + syncMirrorPartnerFromLock clamp 复制 + 5 个滑块监听器 syncActiveMirror）；core-math 118 / verify-smoke 10/11=基线
- [x] Sweep 收窄扩散（0.2.67，codex/0.2.67-sweep-falloff）：`sweepCurvatureResponse` 新增 `falloff` 沿脊柱三角加权扩散收窄系数/heat（端点钉死，falloff=0 逐位守恒），修复急弯处被处理环与相邻未收窄环宽度硬跳变/缺口；`#sweepOverlapPanel` 新增 Falloff 滑块（0–8 默认 3）+ ZH/JA 各 +1 key；core-math 116 / verify-smoke 10/11=基线
- [x] Sweep 转角过大修复（0.2.66，codex/0.2.66-sweep-corner-smooth）：曲率感知环收窄（`sweepCurvatureResponse`，Elber 1997 / Maekawa 1999 判据 scale=min(1,safety·ρ/r)）+ 转角边缘平滑（`smoothSweepChains` 纵向链 Laplacian，heat 加权/根环 pinned）；接入 `strand-sweep.js` sweepSide + `createSplitStrandGeometry` + `createHairCardGeometry`；branch-bridge 内联 Laplacian 抽到 `mesh-smooth.js`（`smoothMeshVertices`，逐位一致）；新增 `#sweepOverlapPanel` 3 滑块（Strength 0.7 / Threshold 0.6 / Edge Smooth 0.3）+ ZH/JA 词典各 +3 key；默认参数 `SWEEP_OVERLAP_DEFAULTS` 单源导出；关闭时逐位守恒；core-math 114 / verify-smoke 10/11=基线
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
- [x] 重构：localization 词典拆数据文件（0.2.57）：JA/ZH 词典从 modules/data/localization.js 拆到 modules/data/loc-ja.js / loc-zh.js（export default Object.freeze），localization.js 改 import 两词典，逻辑零改动；拆分前后 key 数一致（JA 667 / ZH 653）；verify-smoke.mjs 6/6 通过（页面加载 0 异常、zh/ja/en 翻译正常、0043.ahs 加载重建无异常）
- [x] Region 面板 cursor 规范（0.2.57）：边点 move→按方向 ns-resize（up/down）/ew-resize（left/right）；四角 cursor 翻转（topleft=nesw / topright=nwse / bottomleft=nwse / bottomright=nesw）——**SVG/Canvas 坐标 y 向下（左上原点），角点对角线 cursor 按「拖拽角相对对角点的实际位移方向」约定，与部分 DCC（y 向上）直觉相反**，此为项目规范（勿再翻回）；踩坑：上轮 CRLF 导致按行替换未生效（边点仍 move）
- [x] Bug 修复批次 2（0.2.57，子智能体并行深挖）：
  - Ctrl+Z 真正根因：restoreState L18028 裸 `mirrorXEditing`（store 化漏改，undo/redo 恢复崩溃→空场景）→ 改 sculptState.state.mirrorXEditing；undo/redo restore 包 try/catch（失败提示不静默空场景）；applyPresetSelection 同样加固（删 push + 加载后清栈）；verify 加「加载后 undo 栈空」回归（14/14）
  - File 菜单 vs 大纲拖拽没生效根因：**styles.css 缓存号从未 bump**（浏览器用旧 CSS）→ bump styles.css?v=20260810-102 + server.js 加 Cache-Control: no-cache + .panel-resize-handle z-index 30→15（菜单天然压住）+ 防御 cursor/highlight
  - Region 面板 cursor：角点 cursor 被迁移误伤成 `nwse-deps.resize`（无效）→ 修回 nwse-resize/nesw-resize；边点 move→按方向 ns-resize/ew-resize；中键平移/滚轮缩放代码已支持（capture nav + passive:false，缓存修复后生效）
- [x] 重构：material + IO 收尾迁出（0.2.60 前，A6+C1，**appjs-slim-remaining-plan 完成**）：A6 16 函数/308 行 → modules/material/material-ui.js（createMaterialUiApi，drawFlowDeps 5 项重接）；C1 22 函数+ROOT_LOCAL_CURVE_FIELDS/523 行 → modules/io/io-tail.js（createIoTailApi 含 rootAttachment；scalpBuilderDeps 2/proceduralDuplicateDeps 1/fileApi 1 重接；createProjectSaveApi 收敛判定不值得做——引用环+1 行收益）；app.js 19,206→18,401 行；无 BOM/CRLF/非 ASCII 守恒 536=536；verify-smoke 10/11=基线；引用图 devlog/in-progress/material-io-refactor-map.md
- [x] 重构：clump/procedural 迁出（0.2.60 前，B6a）：40 函数/827 行 → modules/geometry/clump-procedural.js，createClumpProceduralApi(deps)；70 处接线（19 deps 批填+51 运行时）；7 个 deps 批重接（drawFlowDeps 4/radialMenuDeps 8/sculptGeom 1/branchRootBone 1/taperEditor 1/branchRegion 1/strandGeometry 3）；clumpMirrorRadialOptions 已随 A2 迁出；app.js 19,955→19,206 行；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/clump-procedural-refactor-map.md
- [x] 重构：procedural duplicate 迁出（0.2.60 前，A3/B6b）：22 函数/706 行 → modules/geometry/procedural-duplicate.js，createProceduralDuplicateApi(deps)（38 注入；curve-math 15 个含 surfaceArcBlendAmount/rootCorrectionFalloff 补 import）；20 处接线（app.js 17 + radialMenuDeps 3：selectedProceduralDuplicateSources/openProceduralDuplicateDialog/beginDuplicatePlacement）；app.js 20,631→19,955 行（破 2 万）；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/clump-procedural-refactor-map.md
- [x] 重构：radial menu 迁出（0.2.60 前，A2）：37 顶层函数+3 常量/846 行 → modules/geometry/radial-menu.js，createRadialMenuApi(deps)（66 注入；radial-layout.js 6 纯函数+mirror-selection 直接 import）；22 处接线；A4 selectedReferenceImage 经 referenceHeadApi；A3 待办记录；app.js 21,400→20,631 行；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/radial-menu-refactor-map.md
- [x] 重构：reference+head/body 迁出（0.2.60 前，A4）：70 函数/1,375 行 + 5 常量 → modules/scene/reference-head.js（新建 scene 域），createReferenceHeadApi(deps)（85 注入）；124 处接线；18 处跨模块重接（scalp-builder 17 + poly-tools 1 + drawFlowDeps 1 headMeshes 补改）；boot loadDefaultGuideModel 改 api；app.js 22,689→21,400 行；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/reference-head-refactor-map.md
- [x] 重构：放置流程迁出（0.2.60 前，B2-2，draw/creation 收尾）：18 放置函数/421 行 → modules/geometry/placement.js，createPlacementApi(deps)（批填放 drawFlowDeps 后、preset boot 前）；64 处接线 + 10 处 deps 批重接（drawFlowDeps updatePlacementStatus/applyPlacedStrandScaleProfile）；顺带修复潜伏 bug scalpActiveVertexIndices 裸引用→deps.scalpState（分支由崩溃变可用）；app.js 23,071→22,689 行；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/draw-creation-refactor-map.md
- [x] 重构：draw-stroke+live-surface 迁出（0.2.60 前，B2-1）：55 业务函数/1,284 毛行 → modules/geometry/draw-flow.js，createDrawFlowApi(deps)（86 注入；批填放 boneInteractionDeps 后避 preset-library boot 时序）；116 处接线（40 deps 填值+3 B6→B2+73 保留）；12 处跨模块重接确认；B2-2 放置簇 E 18 函数留 app.js；app.js 24,309→23,071 行；非 ASCII 守恒/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/draw-creation-refactor-map.md
- [x] 重构：preset library 迁出（0.2.60 前，B3）：32 顶层函数+5 内联箭头 / 839 毛行 → modules/io/preset-library.js，createPresetLibraryApi(deps)（78 注入；3 组 UI 绑定收敛为 setup* 方法）；**删除 7 个死函数（1,072 行）**；装配顺序 presetLibraryApi→creationPresets（defaultBraidToolSettings 延迟计算）；20 处 app.js 接线 + 5 处跨模块 deps 重接；app.js 26,288→24,308 行；无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/preset-library-refactor-map.md
- [x] 重构：骨骼视口 handle 迁出（0.2.60 前，骨骼 B3，骨骼域收尾）：createBoneViewHandles/updateBoneViewHandles/disposeBoneViewHandles/createCurveNormalIndicator/createSplitControlHandle 5 段 / 491 行 → modules/bones/bone-view-handles.js（createBoneViewHandlesApi(deps) 11 注入 + ctx 4 标志由脊柱算好传入）；脊柱 createCurveObjects/updateCurveObjects/disposeCurveObjects 原地改薄 5 点；curveObjects 契约（11 字段+userData+可见性）CDP 8/8 保持；无新增 seam；app.js 26,761→26,288 行；非 ASCII 守恒 343=185+158/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/b3-bones-handle-refactor-map.md
- [x] 重构：骨骼 UI 迁出（0.2.60 前，骨骼 B1+B2）：B1 段控制胶水 5 函数/121 行 → modules/bones/segment-control.js（createSegmentControlApi）；B2 骨骼 gizmo/拖拽/笔刷 8 函数/695 行 → modules/bones/bone-interaction.js（createBoneInteractionApi）；28 处接线（25+3 seam：beginTipSubBoneRotate/applySubBoneBrushSample/syncPanelSegmentControls）；B2↔G6 双向边经 deps（sculptGeomDeps.applySubBoneBrushSample→bonesApi）；app.js 27,477→26,761 行；非 ASCII 守恒 621=343+278/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/b1-b2-bones-refactor-map.md
- [x] 重构：骨骼数据层落地 modules/bones/（0.2.60 前，B0）：bone-model.js 从 modules/geometry/ 移入 modules/bones/，更新 3 处 import（app.js/panel-tip-strand/taper-editor）；纯移动零行为；verify-smoke 10/11=基线
- [x] 重构：sculpt 几何迁出（0.2.60 前，几何 G6，几何域收尾）：34 函数/769 行 + 9 常量 → modules/geometry/sculpt-geometry.js，createSculptGeometryApi(deps)（48 注入）；41 处 app.js 接线 + guideDeps setSculptBrushCursorVisible 重接；G6↔B2 双向边处理（B2 内 sculptGeom.X / G6 注入 applySubBoneBrushSample dep）；app.js 28,230→27,478 行；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/g6-sculpt-geometry-refactor-map.md
- [x] 重构：split/base strand 几何迁出（0.2.60 前，几何 G2+G3）：11 顶层函数+3 嵌套 / 845 行 → modules/geometry/strand-geometry.js，createStrandGeometryApi(deps)（17 注入，6 api const + 10 helper）；**删除死代码 triangulatePolygon3D（全仓库零调用，−39 行）**；5 处 createHairGeometry 接线改写（curveSurfaceCreateDeps/addLock/restoreLock/updateDrawVolumePreview/rebuildLockGeometry）；app.js 29,099→28,229 行；无 BOM/CRLF/非 ASCII 守恒；verify-smoke 10/11=基线；引用图 devlog/in-progress/g2-g3-strand-geometry-refactor-map.md
- [x] 重构：面板/tip strand 几何迁出（0.2.60 前，几何 G1）：26 顶层函数+TIP_WIDTH_CONTROL_POINTS 常量+10 嵌套箭头 / 978 行 → modules/geometry/panel-tip-strand.js，createPanelTipStrandApi(deps)（8 注入+4 模块 import）；46 处接线（27 非 seam+19 seam）改 panelTipStrand.X；TIP_WIDTH_CONTROL_POINTS 单源 export/import；G5→G1 依赖经 taperEditorDeps 重接；app.js 30,058→29,099 行；非 ASCII 守恒 1362=621+741（tip UI 中文入模块）/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/g1-strand-geometry-refactor-map.md
- [x] 重构：taper 编辑器迁出（0.2.60 前，几何 G5）：32 顶层函数+1 嵌套箭头 / 871 行 → modules/geometry/taper-editor.js，createTaperEditorApi(deps)（73 注入+12 模块 import；branchSweep/shapePresets 跨模块 api 注入，批填放 createShapePresetsApi 之后避 TDZ）；71 处接线改写；seam 重导出 renderTaperCurveEditor；跨模块重接 6 处（branch-sweep×4/branch-region-panel×1/shape-presets×1）；app.js 30,841→30,059 行；中文守恒（非 ASCII 1476=1362+114）/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/g5-taper-refactor-map.md
- [x] 重构：poly 拓扑工具迁出（0.2.60 前，几何 G7）：28 个 poly 工具函数 → modules/geometry/poly-tools.js，createPolyToolsApi(deps)（40 项批填，含 guideApi 注入）；22 处外部接线（16 调用+6 事件绑定）改 polyToolsApi.X；app.js 31,453→30,841 行；中文逐字节一致/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/g7-poly-refactor-map.md
- [x] 重构：curve-surface/surface-lattice 创建层迁出（0.2.59→0.2.60，几何 G4）：50 个创建/装配函数 → modules/geometry/curve-surface-create.js，createCurveSurfaceCreateApi(deps)（55 项批填）；跨模块重接 3 处（guideDeps loftSurfaceProfilePoints/loftSurfaceSampleFromHit、fileApi curveSurfaceControllerCurves）；app.js 32,530→31,453 行；中文逐字节一致/无 BOM/CRLF；verify-smoke 10/11=基线；引用图 devlog/in-progress/g4-refactor-map.md
- [x] 重构：curve/guide 系统迁出（0.2.59，3d 批次 5）：129 个 curve/guide 业务函数（createCurveLatticeGuideSet/resampleCurveLatticeGuide/capsule-guide/guide UI 等）→ modules/geometry/guide-system.js，createGuideSystemApi(deps)（99 项，Object.assign 批 L5362-5462）；strand-bridge 3 函数留 app.js；scalp 耦合 8 函数经 deps 注入；跨批次重接 scalpBuilderDeps 7 项（addCapsuleGuide/defaultCurveLatticePoints/guideHeadBounds/renderGuideOutliner/syncGuideInputs/updateGuideViewToggle/updateViewportToolVisibility → guideApi.X）；踩坑：**双重 .state**（deps.sculptState.state.X 应为 deps.sculptState.X，165 处，verify-smoke 启动 TypeError——REFACTOR_PLAN 3b/3c 清单"双重替换"教训复现，静态扫描需含 store 代理检查）；app.js 35,057→32,530 行；中文逐字节一致/无 BOM/CRLF；verify-smoke 10/11 与基线一致（.ahs 加载 88 locks、selection PASS）；引用图 devlog/in-progress/curve-guide-refactor-map.md
- [x] 重构：scalp 系统迁出（0.2.59，3d 批次 4）：120 个 scalp 业务函数（createAuthoredScalpGeometry/paintScalpAt/createScalpLattice 等）→ modules/scalp/scalp-builder.js，createScalpBuilderApi(deps) 依赖注入 + 渐进填充（引导期就地填充 + Object.assign 批填）；踩坑与修复：deps 改写漏网（SCALP_SEGMENTS/scalpState/scalpBuilderPlanePositions/scalpBuilderGroup/guideState/sel 等裸引用，verify-smoke 启动 ReferenceError → 静态裸引用扫描清零）、spread 展开裸引用（...scalpLatticeHandles，扫描需区分 ...name 与 obj.name）、引导期 deps 时序（scalpSurfaceGroup/scalpArtistShape 需在 createScalpLattice 前就地填充）、项目加载恢复路径 DEFAULT_LAYER_OFFSETS 未 import（restoreAuthoredScalpForStateRestore ReferenceError → 补 app-config import）；app.js 37,914→35,050 行；中文逐字节一致/无 BOM/CRLF；verify-smoke 10/11 与基线一致（.ahs 加载 88 locks、selection PASS）；引用图 devlog/in-progress/scalp-refactor-map.md
- [x] Bug 修复批次（0.2.57，5 个，子智能体并行调研 + 主进程修复）：
  - Ctrl+Z：加载前 pushUndoState 压入空场景且加载后不清栈（撤销会回到加载前）→ 删除加载前 push + restore 后清 undo/redo；恢复路径清 branchRegionEdit + branchRegionMeshPointsGroup（选区标记不再残留）
  - 画子发片不触发桥接：branch-hierarchy/branch-root-bone 迁移残留 `xxx.deps.*` 跨模块裸引用（ReferenceError）→ 统一改 deps.*；remapEnvelopeCurveRange import from curve-math；子发片默认 Topology-Along Curve 26→6（attachDrawnLocksAsBranches 设 lock.lengthSegments=6）
  - 扫掠起始控制器优先级：beginBranchSweepStartDrag 无修饰键过滤 + stopImmediatePropagation 抢在 Alt 导航前 → 加 `button!==0 || alt/shift/ctrl/meta` 放行（与 beginPanelSplitHandleDrag 惯例一致）
  - File 菜单 vs 大纲拖拽：.panel-resize-handle z-index:30 盖过菜单（topbar z-index:20）+ 无菜单守卫 → syncAppMenuVisibility 切 body.app-menu-open 类 + CSS `pointer-events:none` + bindResize 菜单守卫
  - Region 面板选区拖不动：openBranchRegionEditor 引用未注入 DOM（sweepProfileEditor/taperCurveEditor）+ branchRootRegionFromParam 用未注入常量 BRANCH_ROOT_REGION_DEFAULTS → deps 注入 + 常量移入模块；顺删 restoreLock 重复 branchRootRegion 键
  - 验证：13/13 通过
- [x] 验证增强：verify-smoke 本地 three（0.2.57）：CDP Fetch 拦截 unpkg→%TEMP%\ahs-verify-three\vendor（含 CORS 头），验证不再依赖外网；3d-3 全量 13/13 通过（4 个 .ahs status opened）
- [x] 3d 第七批：sweep-profile 迁出（0.2.57，3d-3d-b）：20 个函数 → modules/geometry/branch-sweep.js；import curve-math（symmetricClosedCurveParameters/twistCurveDisplayRange）+ 3 常量注入；踩坑：api deps 非法简写（closeSweepProfileEditor）、restore 报错 twistCurveDisplayRange 未注入（已修）；app.js 36,409→36,058；子发片系统迁出完成；验证受 unpkg 网络中断影响（真机验证）
- [x] 3d 第六批：hierarchy 迁出（0.2.57，3d-3d-a）：6 函数（attachDrawnLocksAsBranches/updateBranchChildren hub 等）→ modules/geometry/branch-hierarchy.js；惰性闭包 deps（branchRegion/branchBridge/branchRootBone 的 6 函数）；踩坑：api deps 非法简写 a.b（已修）；app.js 36,491→36,409；verify 13/13
- [x] 3d 第五批：root-bone 迁出（0.2.57，3d-3c）：13 函数 → modules/geometry/branch-root-bone.js；惰性闭包 updateBranchRootRegionCenter + transformControls 注入；app.js 36,704→36,491；verify 13/13
- [x] 3d 第四批：桥接几何迁出（0.2.57，3d-3b）：7 函数 → modules/geometry/branch-bridge.js；import branch-connect + clampRegionParam；顶层常量注入（BRANCH_CONNECTION/SIDE_FILL_ENABLED）；局部/属性误伤修复（const toGridCol 等）；app.js 37,681→36,704；verify 13/13
- [x] 3d 第三批：region-panel 迁出（0.2.57，3d-3a）：31 个 Branch Root Region 面板/选区函数 → modules/geometry/branch-region-panel.js（createBranchRegionApi(deps)，脚本提取+依赖替换生成）；踩坑：调用点替换误伤 resetBranchRegionZoom 选择器（已修）；app.js 38,386→37,681；verify 13/13
- [x] 3d 第二批：shape preset 系统迁出（0.2.57）：8 个核心逻辑 → modules/io/shape-presets.js；cloneShapePresetValue 改模块级导出（creation-presets 改模块间 import，去 deps 注入）；踩坑：deps 项被批量替换误伤 + 模块导出缺失（已修）；app.js 38,437→38,386 行；verify 13/13
- [x] 3d 第一批：creation preset 系统迁出（0.2.57）：10 个核心逻辑函数 → modules/io/creation-presets.js（createCreationPresetsApi(deps) 依赖注入）；app.js 38,605→38,437 行；踩坑：async function 前缀被替换破坏（已修）；verify 13/13
- [x] 重构：misc store（0.2.57，3c 收尾）：modules/core/misc-store.js 收敛 19 个杂项（tool/radial/偏好/fps/braid/重复放置参数）；全局 let 20→1（仅 camera）；阶段 3 全部完成；verify 13/13
- [x] 重构：sculpt/edit store（0.2.57，3c 大块收尾）：modules/edit/sculpt-edit-store.js 收敛 72 个状态（雕刻/编辑/拖拽/工具/重复放置/分支面板拖拽）；objectSpaceEditing 偏好保留原位；踩坑：viewportEditMode/pullRigidity 选择器字符串误伤（已修）；全局 let 92→20；verify 13/13
- [x] 重构：selection 剩余（0.2.57，3c 大块）：activeTool/lockIndex/outliner 等 12 个并入 sel store（扩展 selection-store）；踩坑：裸 `store.state.X,` 对象简写补齐（括号上下文判断）已入库；全局 let 104→92；verify 13/13
- [x] 重构：scalp store（0.2.57，3c 大块）：modules/scalp/scalp-store.js 收敛 35 个 let；踩坑：数组/对象展开 `...name`（name 前是展开符点）被 (?<!\.) 误排除漏替换（snapshotState 多处），已修并加进清单第 9 点；store 创建误入 try 块（块作用域）已移出；全局 let 139→104；verify 13/13
- [x] 重构：save/project store（0.2.57，3c 第六批）：modules/io/project-store.js 收敛 17 个 let（自定义预设、当前项目名、8 个 IO deps 状态）；fileApi 的 getter/setter 改为读写 store；踩坑：批量脚本 lines.join 覆盖丢失替换（重跑修正）；全局 let 156→139；verify 13/13
- [x] 重构：camera/guide/hair store（0.2.57，3c 第五批）：modules/core/camera-store.js（12，camera 对象保留全局）+ guide-store.js（10）+ hair-store.js（20）；踩坑：无逗号/带逗号简写修复误伤函数调用参数（strandRadialActions、三目 activeHairMaterialId 漏替换）——已修并把括号上下文判断加进验证清单第 8 点；全局 let 198→156；verify 13/13
- [x] 重构：undo/transform/head store（0.2.57，3c 第四批）：modules/core/undo-store.js（restoringHistory/historyShortcutHeld）+ transform-store.js（precision/activeSurfaceObjectTransform/recursiveHierarchyTransforms）+ head-store.js（importedHeadAsset 等 3 个）；fileApi 的 importedHeadAsset getter 改用 head.state；踩坑：getter 方法名被误替换（已修 + 验证清单补第 7 点）；全局 let 206→198；verify 13/13
- [x] 重构：reference + ui-panel store（0.2.57，3c 第三批）：modules/edit/reference-store.js（2 let）+ modules/core/ui-store.js（7 let：radial menus、preferences 快照、view 吸附、undo 标志、panel split 警告含 localStorage 持久化）；踩坑：替换误伤 querySelector 选择器字符串（已修 + 验证清单补第 6 点）；全局 let 215→204；verify 13/13
- [x] 重构：draw/poly store（0.2.57，3c 第二批）：modules/edit/draw-store.js 收敛 6 个 let（poly 填充/删除候选、shift preview、clump 模板、procedural draw 实验开关含持久化）；踩坑：对象简写跨行残留致 SyntaxError（已修 + 验证清单入库）；全局 let 221→215；verify 13/13
- [x] 修复：Branch Bridge Smooth 按子发片独立（0.2.57）：滑杆读写当前选中子发片的 lock.branchBridgeSmoothStrength/Detail（无选中写全局默认作新子发片默认值）；面板选中变化时 updateBranchBridgeSliderInputs 刷新；几何侧 L15074 本就支持 lock 覆盖；lock 字段随 .ahs 直接序列化持久化；verify 新增 per-lock 测试
- [x] 重构：branch/sub store（0.2.57，3c 第一批）：modules/branch/branch-store.js 收敛 8 个 let（smooth strength/detail、sync 速度、rigid blend、region view、更新中标志），5 个偏好字段持久化；替换排除 lock.branchBridgeSmoothStrength 等对象属性；全局 let 229→221；verify 12/12
- [x] 重构：核心场景 store（选择集，0.2.57）：modules/core/scene-store.js（Proxy 可变状态容器 + snapshot/restore/subscribe）+ modules/edit/selection-store.js（选择集 12 状态 + selectionSnapshot 对接 project-state 快照）；app.js 全局 let 241→229；verify-smoke 12/12（4 .ahs 加载 + 选择交互 + IO 对话框）
- [x] 重构：全部模块按域归组（0.2.57）：core(5)/data(6)/edit(4)/geometry(14)/material(1)/sculpt(1) + io(9)，扁平模块归零；material-state 跨域 import 改相对路径；verify-smoke 8/8（脚本路径同步更新到 data/）
- [x] 重构：IO 域落地 + IO 子系统拆出（0.2.57）：modules/io/ 收纳 8 个现有模块（file-actions/file-drop/obj-export/obj-import/usda-export/project-schema/project-state/recent-projects，纯路径改动）；从 app.js 拆出 save/export + 文件对话框到 modules/io/project-files.js（依赖注入：snapshotState/strandCurveParameters/curveSurfaceControllerCurves/safelyRememberRecentProject 4 函数 + 8 个状态 getter/setter；downloadProjectFile 仍经 fileApi 供 downloadPreferencesAndPresets 调用）；app.js 39,207→38,785 行；verify-smoke 8/8（新增导出/保存对话框打开检查）
- [x] 文档检索重构（0.2.57）：js-change-annotations 195 条目按 6 子系统拆分（annotations-bridge/region-panel/root-bone/split/display-fixes/adapt，原文件改为索引）；bug-fixes #3 拆 #3/#4/#5；新增 FUNCTION_INDEX.md/.json（node scripts/gen-function-index.js 机器生成）、REFACTOR_PLAN.md、scripts/verify-smoke.mjs（自包含浏览器冒烟验证）
