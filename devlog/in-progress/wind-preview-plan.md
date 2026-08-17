# 吹风预览系统计划(程序化快速预览 + 后续碰撞路线图)

> 状态:**已复查(0.2.111 准备阶段),暂不执行**——待用户指令后按 §7 任务表派发实施子智能体。
> 版本基准:DHS/develop @ 0.2.110。复查更新:开关入 **Preview 菜单**(§6),依赖 dom-contract 清理先行(0.2.111)。
> 目标:AnimeHairStudio 内实现「根少动、发尖多动」的程序化吹风预览——非物理模拟、非导出动画,
> 纯视口显示层变形;后续碰撞效果另立路线图(见 §8)。
> 调研:子智能体并行调研(噪波/Unity 低成本实现 + 碰撞代理论文/Blender 源码),结论已并入本文。

## 0. 复查记录(0.2.111,未执行)

- **UI 变更**:开关按钮从「视口工具区」改为顶部 **Preview 菜单**(`#previewMenu`,Turntable 同款 menuitem 模式,`#toggleWindPreview` + `#windPreviewMenuState`),参数面板仍为 strands 组滑杆面板(仅开启时显示)——符合用户「暂时加到 preview 菜单中」的要求;
- **前置**:dom-contract 滞后测试清理(0.2.111 并行执行中)——清理后再实施吹风,新 UI 元素可顺势补 dom-contract 断言;
- **代码状态核验(0.2.110)**:计划 §2 的数据模型假设全部仍成立(`gridRowIndices/gridColIndices` 每顶点齐备、`animate()` 在 app.js:19986、`curveFrameAt`/`strandGeometryFrameAt` 可用);导出链路已 async 化,吹风预览不触碰导出管线,无冲突;
- **性能预算不变**:0.44ms/帧 @6.6k 顶点(实测),60fps 余量 >30×;
- 参数集(§5)、碰撞路线图(§8)维持不变。

## 1. 目标与范围 / Goals & Non-goals

- **做**:一个可开关的「Wind Preview」预览模式。开启后视口头发按程序化风场逐帧摆动:
  - 根部几乎不动、发尖摆动最大(幅度 ∝ t^p,根行硬锁);
  - 参数可调:风向、强度、频率、湍流(幅度/尺度/倍频)、阵风、每发丝随机化、种子;
  - 确定性(同 seed 同阵型)、性能 60fps(实测余量巨大,见 §3);
  - **非破坏**:不改 `lock.points` / 骨骼数据 / 几何源数据,只临时变形 `lock.mesh` 的显示 buffer,
    关闭预览逐位恢复(参考 UV checker 预览的「原几何暂存恢复」模式,app.js `setUvCheckerPreview`)。
- **不做(v1)**:
  - 头皮/碰撞(见 §8 路线图);
  - 导出动画(USDA timeSamples 骨骼旋转动画留作远期,架构上不堵路);
  - 物理模拟(弹簧/Verlet/PBD 求解)——预览要的是「程序化摆动」,不是解算。

## 2. 现状数据模型(实现依据,已核验)

- 每发丝 `lock.points`:主链 CatmullRom 控制点(真实项目平均 6.7 点/发丝,rows=lengthSegments≈26);
- 视口网格 `lock.mesh.geometry`(THREE.BufferGeometry,在 `hairGroup`):
  - `userData.gridRowIndices/gridColIndices`:每顶点扫掠行/列(0=根),**吹风逐帧变形的现成 t 来源**;
  - `userData.gridRows` = 行数;
- 帧函数:`curveFrameAt(lock, t)` / `strandGeometryFrameAt(lock, curve, t, prev)`(app.js),返回
  {point, x, y(tangent), z, quaternion, scale} —— 预览期间每帧采样链点与帧;
- 渲染主循环 `animate()`(app.js:19986),`requestAnimationFrame` 驱动,`deltaSeconds` 已有。

## 3. 性能实测(基准,2026-08-17 测量)

| 项 | 数值 |
|---|---|
| Sussurro_v1_0046.ahs 规模 | 26 locks(22 发丝 + 3 子发片父 + 1 panel),主链点 173 |
| 网格顶点总量(估算) | ≈ 6,600(每发丝 ≈ (26+1) 行 × (8+2) 列) |
| 吹风逐帧变形实测 | **0.44 ms/帧**(26 locks × 27 行链采样 + 6.6k 顶点四元数应用,含每帧重建 CatmullRom) |
| 60fps 预算 | 16.6 ms/帧 → 余量 >30×;10 倍密度项目(≈66k 顶点)也仅 ≈4.4 ms |

结论:变形算法怎么简单怎么写,不需要 worker / GPU 化;唯一注意点是**每帧避免 GC**(预分配 Float32Array)。

## 4. 算法设计(调研结论落地)

### 4.1 噪波选型:4D OpenSimplex(单文件 vendor)

- 选 **open-simplex-noise 2.x**(npm `open-simplex-noise`,单文件 ESM,`new OpenSimplexNoise(seed)` 构造即播种,确定性开箱即用,无 Perlin 轴对齐伪影);
- 或备选 **simplex-noise**(`createNoise4D(mulberry32(seed))`,更省、API 差异只在顶面)。
- **vendor 进 `js/vendor/`**(应用目前经 unpkg import map 加载 three;vendor 单文件锁定版本、离线可用、
  无构建——符合「最简化 + 成熟开源库」原则)。许可证 MIT,兼容本项目 license 约束。
- 理由:4D 一次调用同时给「空间相干 + 时间演化」;curl noise 对头发预览属过度设计(流体平流性质用不上,
  贵 ~3×);value noise 有 blob 伪影。

### 4.2 核心公式(调研报告 §6 直接落地)

```
// 每发丝预计算(启用预览时一次):rng = mulberry32(hash(seed, strandId))
phase = rng()*2π; amp = 0.8 + 0.4*rng(); off = (rng()-0.5)*0.6  // x/y/z 空间采样偏移(米)

// 每帧、每行(row t = gridRow/(rows-1),根=0):
p = rootPos + t*chainDir*chainLen + off                       // 世界采样点(发丝空间去同步)
turb = fbm4(n, p*scale, time*freq + phase, octaves=3, lac=2.0, gain=0.5)
gust = 0.5 + 0.5*sin(2π*gustFreq*time + phase*0.5)            // 低频阵风调制(Unity Pulse 心智)
θ(t) = windStrength * amp * gust * turb * pow(t, rootExponent) // rootExponent≈2.5,根行 t<0.02 硬锁

// 应用:绕「垂直风轴」旋转该行(相对发丝根锚点),再沿链累积
axis = normalize(cross(windDir, up)); Q(t) = 累积旋转到该行
pos' = chainPoint(t) + Q(t) * (restPos - chainPoint(t))       // 局部偏移旋转(线性链式,非扫掠)
normal'/tangent' = Q(t) * rest                              // 法线/切线同步旋转
```

- 行间插值:顶点 t 落在两行之间时,对 Q 做 slerp(或对行旋转角 lerp 后重建轴),27 行/发丝粒度足够;
- 根锁:θ(0)=0 + `t^p` 衰减 + 根行硬锁双保险;`windStrength` 平滑过渡(开关 0.2s attack/release,防瞬移);
- 确定性:`seed = 应用 serial`(固定),同模型任意时刻重放同阵型。

### 4.3 变形路径决策:网格原地变形(非重扫掠)

- **选「显示层原地变形」**(§3 已实测 0.44ms):不改 `lock.points`,不触发几何重建/undo/持久化链路;
  缓存每顶点 `t + rest 局部偏移 + rest 法线/切线`,每帧只写 position/normal/tangent buffer;
- **gridRow 覆盖范围**:closed/split/child 扫掠、panel 模拟行均有 `gridRowIndices`(已核验
  strand-geometry.js / branch-bridge.js / panel-tip-strand.js);**row=−1 的非扫掠顶点(端盖中心、
  桥接插值点)保持不动(passthrough)**——预览下桥接区轻微不动可接受,后续可加 parent 链插值;
- 骨骼手柄(可选增强):预览开启时 `bonesFor` 显示链叠加同 Q(t) 旋转(纯视觉,关闭恢复)——让用户
  看到「骨骼在动」,与几何一致;v1 可不做,列为增强项;
- 与现有系统互斥规则:预览开启期间禁用编辑类交互(点击/拖拽/笔刷自动暂停预览,同 UV checker 心智);
  导出/UV checker 不受影响(走源数据)。

## 5. 参数集(面板直接落地,调研 §6 映射)

| 参数 | 类型/范围 | 默认 | 说明 |
|---|---|---|---|
| Wind Direction | 方位角 -180~180° | 0 | 风向(水平);(可选仰角 v1 不做) |
| Wind Strength | 0~1 | 0.6 | 主风强度 |
| Frequency | 0.1~3 Hz | 0.8 | 摆动频率(时间系数) |
| Turbulence | 0~1 | 0.5 | 湍流幅度(乘进 fbm 贡献) |
| Turbulence Scale | 0.5~8 m | 2.0 | 世界空间噪声尺度(小=细碎,大=大波浪) |
| Gust Strength / Gust Freq | 0~1 / 0.05~0.5 Hz | 0.35 / 0.2 | 阵风调制(Unity WindZone Pulse 心智) |
| Root Exponent (p) | 1~4 | 2.5 | t^p 根锁强度 |
| Strand Random | 0~1 | 0.5 | per-strand 相位/幅度/空间偏移随机化强度 |
| Seed | int | 项目固定 | 确定性来源 |
| 预览开关 / 播放暂停 | toggle | 关 | 面板顶部 |

## 6. UI 与接线(0.2.111 复查修订:开关入 Preview 菜单)

- **开关:Preview 菜单**(0.2.111 复查决定,替代「视口工具区按钮」)——顶部菜单栏已有 `#previewMenu`(现只有 Turntable 一项,`#toggleTurntable` 的 `role="menuitem"` + `aria-pressed` + 状态 span 模式),按同一模式新增:
  ```html
  <button id="toggleWindPreview" type="button" role="menuitem" aria-pressed="false">
    <span>Wind Preview</span>
    <span id="windPreviewMenuState" class="app-menu-state">Off</span>
  </button>
  ```
  加在 `#previewMenu` 内 Turntable 之后;`aria-pressed`/菜单状态文本随开关同步(参考 `setTurntableActive` 的菜单联动写法);
- **参数面板** `#windPreviewPanel`(strands 组,`panel-section sliders`,样式同 `#sweepOverlapPanel`):仅预览开启时显示(或选中时显示);slider 复用现有 range + setupEditableSliderControls 模式;面板内放「播放/暂停」与「关闭预览」;
- 新 store `windStore`(modules/core/wind-store.js,scene-store 模式 + readStoredPreference 持久化,
  字段 normalize 同上表;预计算缓存不进 store、仅内存);
- `animate()` 钩子:`if (windState.previewActive) updateWindPreview(deltaSeconds)`(在
  `updatePullGuideVisual()` 附近);几何 buffer 标记 `needsUpdate`;关闭时恢复缓存的原 buffer(逐位);
- 本地化:新文案加 EN 原文 + `loc-zh.js`/`loc-ja.js` 词典(面板 label 自动走 translateUiString);
- 缓存号:按 0.2.110 教训**定点 bump**(index.html→app.js、涉及模块链),不做全局替换;`APP_VERSION` +1。

## 7. 实现拆分(子智能体任务切分,主进程 merge)

| 任务 | 文件(不相交) | 内容 |
|---|---|---|
| T1 纯数学核心 | `modules/geometry/wind-preview.js`(新)+ `js/vendor/open-simplex-noise.js`(vendor 单文件)+ `tests/wind-preview.test.mjs`(新) | fbm4/mulberry32/per-strand 随机化/行旋转累积/网格原地变形(纯函数,可 node 测) |
| T2 状态与 UI | `modules/core/wind-store.js`(新)+ `index.html` + `styles.css` + `modules/data/loc-zh.js`/`loc-ja.js` | windStore(normalize+持久化)+ 面板 DOM + 文案 |
| T3 接线 | `app.js`(windPreviewApi 注入 + animate 钩子 + 开关互斥/恢复) | 与 T1/T2 文件不相交,只 import 接口 |

依赖:T2/T3 依赖 T1 的 API 签名(先定接口,再并行);全部完成后主进程跑
`node --test tests/*.test.mjs` + verify-smoke 回归,更新 devlog。

## 8. 后续:碰撞效果路线图(规划,非本轮实施)

> 原则:预览级碰撞,每帧 <2ms;代理体**预计算**、求解**轻量**;不做完整物理模拟。

### 8.1 方案对比(调研结论)

| 方案 | 一次性成本 | 每帧查询成本 | 精度 | 适合场景 |
|---|---|---|---|---|
| 简化网格+BVH(three-mesh-bvh closestPointToPoint) | 10~50ms | 1~5µs/点 | 高(真实轮廓) | 发量中等、要贴合(只查头包围盒子集) |
| **球/胶囊代理(FPS 最远点采样 + 球拟合)** | **<5ms** | 0.02µs/点 | 中(轮廓圆滑) | **默认方案:发量多、要快、易调** |
| 体素 SDF 64³(CPU 距离变换) | 50~150ms(可 Worker 后台) | 0.5µs/点(三线性查表) | 中高 | 点数极多(数千发丝)、头不动 |
| V-HACD 凸块(vhacd-js WASM) | 数百 ms | 1µs/点 | 中 | 躯干/复杂碰撞体,头部性价比低 |

### 8.2 推荐:Phase A = 球/胶囊代理 + 2 迭代约束投影

1. **代理生成(一次性,<10ms,结果随场景保存)**:
   - 头部 OBJ 加载后:表面 **FPS(最远点采样)24 点** → 每簇**球拟合(质心 + Ritter 最小包围球)**,得 `[{c, r}]`(半径 2~8cm);
   - 颈/肩 2~4 个胶囊;UI 暴露「球数 12/16/24/32」+「整体半径缩放 0.9~1.1」滑杆(松/紧);
   - 备选:`three-simplify-mesh`(QEM)先降到 ~2k 三角再采样(稳定);meshoptimizer(WASM)更快。
2. **每帧求解(Web Worker,SharedArrayBuffer 共享骨骼位置;单 worker 已够,>500 根发丝再分块)**:
   - 积分(风外力 + 重力 + 阻尼)→ **2 次迭代**:`拉伸约束(保长度)` + `碰撞投影`:
     - 球:`d=|p−c|−r<0` → `p += n·(−d)`,法向速度清零、切向 ×(1−摩擦),恢复系数 0.1~0.3;
     - 胶囊 = 线段 + 两端球,公式同上;只查**头包围盒内**骨骼点(省一半);
   - **与吹风叠加顺序**:风(外力)→ 积分 → 碰撞投影 →(可选)球代理加 `wind·k_push·n` 气流推开(吹开刘海);
3. **成本核算**:200 发丝 × 40 点 = 8k 点 × 24 球 × 2 迭代 ≈ **0.3~0.6ms/帧**,总预算 <2ms。
4. **高精度备选(可切换)**:BVH 模式仅查头包围盒子集(≈2.6k 点 × 2µs ≈ 5ms);SDF 模式留给未来数千根发丝规模(64³ 生成 50~150ms 后台 + 每帧查表 4ms)。
5. **自碰撞**:预览级不做(成本 ×N²;Blender 也默认关)。

### 8.3 论文/源码依据(已核验)

- **PBD**(Müller et al. 2007):位置投影约束思想,碰撞=沿法线推出,迭代 1~3 次即可预览 —
  https://matthiasmueller.info/publications/posBasedDyn.pdf ;EG 2015 教程 https://diglib.eg.org/items/89b9a1c0-8722-477c-b221-1765f5f43979/full ;
  JS 参考实现 https://karthikriyer.github.io/blog/2023/hair-sim/
- **Selle et al. 2008**(质量弹簧头发,只碰撞引导发丝再插值 = 「只对骨骼点碰撞」的学术依据)—
  https://dl.acm.org/doi/abs/10.1145/1399504.1360663 ;PDF https://graphics.stanford.edu/papers/hair_springs/ ;
  Choe & Choi 2006 预测-校正碰撞 https://www.semanticscholar.org/paper/3b39f98accd9d6cf4a4632039e6a191f6d20697d
- **游戏引擎先例**:MMD(Bullet 刚体球/胶囊/盒 + 关节)— https://learnmmd.com/http:/learnmmd.com/oomarys-guide-to-mastering-mmd-hair-physics/ ;
  NVIDIA HairWorks(骨骼/皮肤上挂胶囊)— https://docs.nvidia.com/gameworks/content/artisttools/hairworks/1_1/Using_HairWorks.html ;
  AMD TressFX 4(PBD + 碰撞球/胶囊,迭代 4~6)— https://gpuopen.com/news/tressfx-4-simulation-changes/ ;
  Unity DynamicBone/EZPhysicsBone(Verlet + 显式 sphere collider 列表)— https://github.com/Hengle/EZPhysicsBone
- **Blender 源码**:粒子头发动力学在 `particle_hair.c do_hair_dynamics`(弹簧 stiffness/damping + 力场含 wind + 碰撞);
  碰撞用 **BVH(looptri)** 最近点 + 法向推出/弹跳/摩擦(`b604d5ade0` 提交);Collision 修改器 3.5 起支持
  **Static 与 Distance Field 两种模式**(官方自己也是「BVH 逐点 vs 距离场查表」二选一);
  Decimate(QEM)/Remesh(voxel)即代理网格生成思路 —
  https://docs.blender.org/manual/zh-hans/4.3/physics/particles/hair/dynamics.html ;
  https://projects.blender.org/blender/blender/commit/b604d5ade0fde241c84b802b4f7b7426f12d48be
- **代理生成算法**:QEM(Garland & Heckbert 1997)— https://dl.acm.org/doi/10.1145/258734.258849 ;
  球拟合 FPS/IFPS — https://dl.acm.org/doi/epdf/10.1145/3731715.3734423 ;
  SDF 距离场(Xu & Barbič 2014)— https://viterbi-web.usc.edu/~jbarbic/signedDistanceField/XuBarbicSignedDistanceField2014.pdf ;
  V-HACD — https://www.npmjs.com/package/vhacd-js
- **JS 库清单**:three-mesh-bvh https://github.com/gkjohnson/three-mesh-bvh ;
  three-simplify-mesh https://github.com/thejmazz/three-simplify-mesh ;
  meshoptimizer https://github.com/zeux/meshoptimizer ;voxelizer https://github.com/andstor/voxelizer ;
  fast-marching-method https://github.com/thinks/fast-marching-method

### 8.4 落地顺序建议(未来独立任务)

1. T-C1:`generateCollisionProxy(headMesh)`(FPS + 球拟合,<200 行纯 JS 零依赖,node 可测);
2. T-C2:Worker 内 2 迭代 PBD(风 + 拉伸 + 球碰撞),与吹风预览叠加;
3. T-C3(可选):BVH/SDF 高精度模式切换 + 气流推开通道。

## 9. 参考文献(吹风部分,已核验)

- Bridson et al., *Curl-noise for procedural fluid flow*, SIGGRAPH 2007 — https://dl.acm.org/doi/10.1145/1276377.1276435
- NVIDIA GPU Gems 3 Ch.16, *Vegetation Procedural Animation and Shading in Crysis*(顶点摆动+阵风标准教材) — https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-16-vegetation-procedural-animation-and-shading-crysis
- jwagner/simplex-noise.js — https://github.com/jwagner/simplex-noise.js ;API 文档 https://29a.ch/simplex-noise/docs/
- open-simplex-noise(npm)— https://www.npmjs.com/package/open-simplex-noise ;joshforisha/open-simplex-noise-js — https://github.com/joshforisha/open-simplex-noise-js
- Unity Wind Zones(Main/Turbulence/Pulse)— https://docs.unity3d.com/6/Documentation/Manual/class-WindZone.html
- Magica Cloth 2 Wind(Main/Moving/Gust)— https://magicasoft.jp/en/wind-start-2/ 、https://magicasoft.jp/en/mc2_wind_setup/
- VRChat PhysBone(pull/spring/stiffness/gravity/immobile/maxAngle)— https://github.com/vrchat-community/creator-docs/blob/b6e8367c/Docs/docs/avatars/avatar-dynamics/physbones.md
- Dynamic Bone 参数剖析 — https://blog.csdn.net/weixin_30598047/article/details/147603042 ;EZPhysicsBone — https://github.com/Hengle/EZPhysicsBone
- The Book of Shaders — Noise — https://thebookofshaders.com/11/
- Blender Hair Curves Noise(shape/scale/offset/roughness/detail 对照)— https://docs.blender.org/manual/zh-hans/5.3/modeling/geometry_nodes/hair/deformation/hair_curves_noise.html
- GodotGrass(逐草叶 wind + 随机)— https://github.com/2Retr0/GodotGrass

## 10. 备注

- 碰撞部分调研全文已并入 §8(2026-08-17,子智能体报告核验);吹风部分参考见 §9。
- 性能预算按 Sussurro_v1_0046.ahs 实测(26 locks / 6.6k 顶点),见 §3。
