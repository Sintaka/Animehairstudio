# UV 排列(Layout)多线程化评估与实施计划

> 状态:评估完成 + 计划(未实施)。版本基准:DHS/develop @ 0.2.107。
> 任务范围:**只优化 layout/打包**,不动 UV 生成(扫掠数学展开,`uv-unfold.js`,保持现状)。
> 目标:把 `packFamilies`(现单线程)改造成多线程吃满多核;评估开源加速后端库的引入价值。
> 调研:子智能体专项调研(Worker 并行 / xatlas / Blender uv_pack.cc / WASM 落地),结论已并入。

## 1. 现状与瓶颈(实测,2026-08-17)

- 打包器:`modules/io/uv-pack.js` `packFamilies`(纯函数零依赖,导出/UV checker 共用):
  - `SEEDS=8` 个确定性放置序(seed 0 = maxSide 基线 + 7 个 LCG Fisher-Yates 打乱);
  - 每 seed 跑 `findMaxKAlpaca`:**128 个稠密 k 采样 + 24 次二分细化**,每次 k 调
    `alpacaPackOccupancy`(256² 占位栅格 + 积分图 O(1) 判空;每岛放置后 **O(R²)=65k 次重建积分图**);
  - 每导出 pack 调用次数 = 8 × (128+24) = **1,216 次**;每次 pack new 两个 64KB+66KB 数组
    → 总分配 ≈158MB,GC 压力不小;
- **实测耗时(合成数据,模拟真实发型宽长比,5 次均值)**:

| 岛数 | packFamilies(SEEDS=8) | 单 seed findMaxKAlpaca |
|---|---|---|
| 10 | 1.28 s | 0.163 s |
| **23(≈ Sussurro 量级)** | **4.01 s** | 0.525 s |
| 50 | 9.33 s | 1.06 s |
| 100 | 20.0 s | 2.02 s |
| 200 | 42.1 s | 3.78 s |

- 脚本:`scripts/bench-uv-pack.mjs`(本轮新增,可复跑)。真实项目 Sussurro_v1_0046.ahs ≈ 23 个 family
  → **导出 / UV checker 刷新各等 ~4s**,是导出链路的实际瓶颈(0.2.88/0.2.89 时代记录过 2.9~4.7s,一直没解决)。
- 基线:`node --test tests/uv-pack.test.mjs` 全绿(1 test 文件,~11s 含压力回归)。

## 2. 并行化可行性(结论:完全可行,收益巨大)

- **三个独立并行维度,全部纯函数、确定性**:
  1. **seed 维度**:8 个放置序互不依赖;择优 = 取 k 最大者(并列 seed 0 优先);
  2. **k 采样维度**:`fitsAt(k)` 是纯函数,128 个采样点互不依赖;采样点按 k 升序、bestK = 最后一个
     放得下的采样点 → **分块后各块取「块内最大放得下 k」再取 max 即全局正确**(fitsAt 非单调不影响);
  3. **二分细化(24 次)**:依赖采样结果,放第二阶段(每 seed 一个任务,或主线程收尾,优化后 ms 级);
- **worker 输入极小**:只需拍平的 `Float32Array(n×2)`(岛宽高)+ `Int32Array(order)` + gap/fill/resolution/k,
  结构化克隆 ~µs 级;返回一个 float;最终 uv 缩放/平移/fit-to-tile(写回)由主线程做(6.6k 顶点,亚毫秒);
- **浏览器 Worker 上限**:Chrome 桌面实际 ≈ 16 worker/页(历史硬上限,64 核机器也只给 ~16)→
  **池大小 = min(hardwareConcurrency, 16),任务数 ≈ 池数 × 2~4**,预期加速 **~8~14×(不是 64×)**;
  若未来 Node CLI 导出则不受限,可真 64 核;
- **任务粒度**:推荐「(seed × k 段)」≈ 64 稠密 + 8 细化 = **72 任务**(每任务 16 个 k);
  不要 1 k/任务(1216 任务 → 消息调度开销 12~60ms,反超计算量);不要 1 seed/任务(只用 8 核)。

## 3. 方案设计(推荐,三阶段)

### Phase 0 —— 单线程微优化(保输出,先做,半天)

> 调研结论:当前瓶颈是**算法问题**(O(R²) 积分图重建)不是语言问题;先优化再并行,worker 任务才会小到毫秒级。

1. **行区间表替代积分图(保输出,收益最大 5~8×)**:保留 256 栅格语义与 L 形扫描,把
   「Uint8Array + 积分图」换成「每行一个已占 x-区间排序表」——判空 = 该行区间表二分查重叠 O(log),
   标记 = 往 ch 行各插一个区间 O(ch·log)。查询/标记从 O(R²) → O(R·log),**栅格量化逐格一致 → 输出逐位不变**;
2. **消除热路径分配(保输出,10~30%)**:每次 pack new 的 64KB/66KB 数组改为调用方传入可复用 buffer
   (worker 版顺带解决);
3. `tests/uv-pack.test.mjs` 回归确认逐位一致。
预期:23 岛 4.0s → **0.5~0.8s**(单线程)。

### Phase 1 —— Worker 池并行(保输出,叠加 8~14×,1~2 天)

```
packFamiliesAsync(families, {gap, fill, workers = min(hardwareConcurrency, 16)})
  主线程:步骤 1-4 照旧(valid/area/width/boxUnit,便宜)+ 预计算 8 个 orders[](LCG, Int32Array)
  阶段 1(并行):任务 = seed × 采样块(8 × 8 = 64 任务,每任务 16 个 k)
      worker 对块内每个 k 跑 fitsAt(输入拍平 Float32Array/Int32Array,本地复用栅格 buffer)
      返回 {seed, 段内最大放得下 k};合并:每 seed bestK = max(段结果)
  阶段 2(并行 8 任务或主线程):对每 seed 的 [bestK, bestK+Δ] 区间二分 24 次,取全局最优
      (k 最大、并列 seed 更早)
  主线程:最终缩放 × kFinal + alpacaPackOccupancy 验证重试(同现有逻辑)+ 平移 + fit-to-tile
```

- **确定性**:任务纯函数 + 固定合并规则 → 与现单线程**逐位一致**(同 LCG、同 seed 序列,seed 0 基线不动);
- **常驻 worker 池(模块级单例)**:跨导出复用,消除 worker 启动开销与 GC;Worker 不可用时同步回退 `packFamilies`;
- 异步接线:`packUnfoldedUv` 增加 async 路径 → `buildUnfoldedMeshes` async 化或新增
  `buildUnfoldedMeshesAsync`;调用方 `buildHairObj/buildHairUsda/exportHairProjectQuickly`(已是 async 流程)
  与 UV checker 刷新(app.js:12313,改为 async + 「packing…」状态提示);
- 预期:23 岛 → **~2~6ms 计算 + 主线程写回**,导出主线程不卡(64 核桌面)。

### Phase 2 —— 可选实验(输出会变,再 10~100× 或质量提升)

1. **去栅格直接 AABB 重叠**(n≤60 时用浮点 AABB 两两重叠 + 已放置列表早退):单 pack 从 O(n·R²)≈3.9M
   → O(n²)≈3.6k 比较级,消除量化误差;代价:placement 与现输出不完全一致,需回归对比质量;
2. 或 128 栅格粗筛 + 256 终验(粗筛量化更松会高估 k,**必须保留 256 终验**);
3. 未来若出现任意形状岛/千岛需求,再评估 xatlas(见 §4),届时需解决 dev server COOP/COEP 头。

## 4. 开源加速后端库评估结论(调研核验)

| 候选 | 许可证 | 结论 |
|---|---|---|
| jpcy/xatlas | MIT | **不引入**。面向**任意形状 chart** 打包、打包阶段**单线程**、面向几百~几万 chart 大输入;与「AABB 不旋转 + 逐位兼容」不匹配;20~60 岛不会更优;仅在千岛/任意形状岛需求出现时是正确选择(现成 wasm 封装:PetterGs/xatlas-three、xatlas-wasm) |
| Blender uv_pack.cc | GPL-2.0-or-later | **代码不可用**(传染),思路已复刻(alpaca L 形扫描 = `find_best_fit_for_island` / Nöll & Stricker 2011);其打包核心也**单线程**(UVPackmaster 以多线程为卖点反证) |
| rectpack2D / texture_packer(Rust) | MIT | AABB 矩形打包符合形状需求,但**无「k 自适应缩放找最大填充」层、无现成 wasm 分发、输出不兼容**,当前不值得自建 |
| uvgen(rg3d) | MIT | 三角形 UV 打包,不匹配 AABB 岛 |
| WASM 整体 | — | 单线程 wasm 相对 JIT typed-array JS 只省 2~5× 常数,而瓶颈是算法级;wasm-threads 需 COOP/COEP(当前 python http.server 不发),是部署问题不是性能问题;SIMD 2024 覆盖 ~95% 仍需回退构建。**结论:不引入** |

**总判断:「算法微优化(Phase 0)+ Worker 并行(Phase 1)」两条免费路径已能拿到 50~150×,WASM 反而背上构建链 + 跨域隔离 + SIMD 回退三座大山。**

## 5. 风险与对策

| 风险 | 对策 |
|---|---|
| Worker 不可用/被 CSP 禁 | 同步回退 packFamilies(逐位一致) |
| 消息开销吃掉收益(任务太碎) | 任务粒度 ≥ 8 采样/任务(推荐 16);实测 4/8/16 三档 |
| 与单线程结果不一致(回归) | 确定性 LCG 不动;Phase 0 行区间表逐格一致;tests/uv-pack.test.mjs 全量回归 + 压力逐位断言 |
| 浏览器 worker 上限(~16) | 池 = min(hardwareConcurrency,16),任务 72 个流水线吃满 |
| 导出流程变 async 引入竞态 | 预览/导出互斥(同 UV checker 心智);busy 时禁用按钮 |
| Phase 2 输出变化影响纹理生产 | 只在 Phase 2 发生;默认保持 Phase 0+1 保输出路径,Phase 2 实验分支注释保留可切回 |

## 6. 实施切分(子智能体任务,文件不相交,主进程 merge)

| 任务 | 文件 | 内容 |
|---|---|---|
| T0 Phase 0 微优化 | `modules/io/uv-pack.js`(行区间表 + buffer 复用,旧实现注释保留)+ `tests/uv-pack.test.mjs`(逐位回归) | 保输出,先落地 |
| T1 Phase 1 Worker 池 | `modules/io/uv-pack-worker.js`(新,worker 脚本)+ `modules/io/uv-pack-async.js`(新,池/任务切分/确定性合并/同步回退)+ `scripts/bench-uv-pack.mjs`(更新对比) | 依赖 T0 的 API |
| T2 导出接线 async | `modules/io/project-files.js` | packUnfoldedUv async 路径、buildUnfoldedMeshes async、导出流程 await |
| T3 UV checker 预览 async | `app.js`(uvChecker 刷新块) | 预览按钮 async + 「packing…」状态 |
| T4 Phase 2 实验(可选) | `modules/io/uv-pack.js`(实验分支注释保留) | AABB 去栅格 / 128 粗筛,与 T0 串行 |

依赖:T0 → T1 → (T2 ‖ T3);T4 最后。主进程合并后跑 `node --test tests/*.test.mjs` +
verify-smoke + 真实项目导出逐位对比,更新 devlog(0.2.108)。

## 7. 验收标准

- 23 岛 pack:Phase 0 后 ≤0.8s(现 4.0s),Phase 1 后 ≤0.1s 计算(导出主线程不卡);100 岛 Phase 1 ≤0.5s(现 20s);
- `node --test tests/uv-pack.test.mjs` 全绿(Phase 0/1 逐位一致,无 seed 顺序回归);
- 真实项目 Sussurro 导出全流程冒烟(UV checker 预览 + USDA/OBJ 导出结果与旧版逐位一致);
- 单核/Worker 不可用环境自动退化为同步路径,行为不变。

## 8. 参考文献(调研核验)

- xatlas(MIT)— https://github.com/jpcy/xatlas ;PackOptions https://docs.rs/xatlas-rs-v2/0.1.4/xatlas_rs_v2/struct.PackOptions.html ;TABI 打包对比论文 https://www.cs.ubc.ca/labs/imager/tr/2026/tabi/
- Blender uv_pack.cc(alpaca_turbo 注释)— https://gitlab.com/Linaro/windowsonarm/forks/blender/-/blob/a0c5467b7da9f042cb13a426e245af9269050ef0/source/blender/geometry/intern/uv_pack.cc ;alpaca O(n log n) 提交 https://projects.blender.org/blender/blender/commit/b33db266b12f98a65cb81d65554d11253d97fcc9 ;Blender xatlas strategy https://projects.blender.org/blender/blender/commit/e0d05da8262d84d21a0a1bfb0c7a48d9c29a216c ;Chris Blackbourn 笔记 https://archive.blender.org/wiki/2024/wiki/User:Chris_Blackbourn/BlogDraft.html
- Nöll & Stricker 2011《Efficient Packing of Arbitrary-Shaped Charts…》— https://diglib.eg.org/handle/10.1111/j.1467-8659.2011.01976.x
- rectpack2D — https://github.com/tvaira/rectpack2D ;texture_packer — https://github.com/PistonDevelopers/texture_packer ;uvgen — https://github.com/mrDIMAS/uvgen
- xatlas wasm 封装 — https://github.com/PetterGs/xatlas-three 、https://www.npmjs.com/package/xatlas-wasm
- Chrome worker 上限历史 — https://codereview.chromium.org/125242/patch/3005/3018 ;Transferable 性能 https://developer.chrome.com/blog/transferable-objects-lightning-fast
- cross-origin isolation 前置 — https://unswdb.github.io/kuzu-wasm/guide/prerequisite.html ;mujoco COOP/COEP PR https://github.com/google-deepmind/mujoco/pull/3130 ;Safari 16.4 SIMD https://platform.uno/blog/safari-16-4-support-for-webassembly-fixed-width-simd-how-to-use-it-with-c/ ;caniuse wasm-simd https://caniuse.com/wasm-simd
