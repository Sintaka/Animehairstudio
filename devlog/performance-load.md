# 加载性能对比：本地 fork vs upstream main（0.2.108 测量）

> 用户反馈：改版（sintaka.github.io）完全冲刷加载比原版（ludetools.github.io）慢很多。
> 本文给出受控离线测量结果与成因分析。测量脚本：`scripts/measure-boot.mjs`。

## 1. 测量方法

- **环境**：本机 headless Chrome（`--headless=new --no-sandbox`），本地静态服务器，unpkg 的
  three@0.165.0 由 Fetch 拦截改读本地 vendor（**完全离线**，消除网络误差）；
- **对照**：本地 fork（DHS/develop，0.2.108）vs upstream main（d3358f6，本地 fork 的基线原版）；
- **载荷**：完全冲刷加载（`?_t=N` + `Cache-Control: no-store`）→ 记录 boot（canvas+readyState
  complete）；随后 drop 同一个 `Sussurro_v1_0046.ahs` → 记录 load（`#lockList .lock-item` ≥ 20）
  与 settled（CDP ScriptDuration 每 500ms 增量 < 15ms 连续 3 次）；
- **次数**：各 3 次，取中位数（local/upstream 交替，消除顺序偏差）。

## 2. 结果（中位数，3 次）

| 阶段 | LOCAL | UPSTREAM | 差 |
|---|---|---|---|
| boot（canvas） | 560ms (649/547/560) | 547ms (547/547/542) | **+13ms** |
| load（lock-item ≥ 20） | 1098ms (1215/1098/1097) | 1026ms (1026/1035/1026) | **+72ms** |
| settled（主线程静止） | 2622ms (2736/2620/2622) | 2557ms (2550/2557/2560) | **+65ms** |
| JS 传输量 | **2776KB** | 1838KB | **+938KB (+51%)** |

（另测，**文件数随版本增长,此处为当时快照**：本地 JS 98 个文件 / 2.55MB（0.2.129 实测已达 104 个）；原版 38 个文件 / 1.73MB；本地 app.js 906KB + 模块 1.65MB，
原版 app.js 1533KB + 模块 ~200KB。deployment 分支无大体积二进制资产，最大文件 121KB。）

## 3. 结论：受控环境下本地只慢 ~70ms，"多很多"主要来自环境因素

1. **传输/网络（最大项）**：每次完全冲刷（?v= 缓存破坏）本地要多传 **938KB JS（+51%）**。
   按带宽估算：10MB/s ≈ +0.1s；5MB/s ≈ +0.2s；1MB/s ≈ +1s；慢速移动网络可到 +3-5s。
   GitHub Pages 冷缓存（sintaka.github.io 首次访问）会再放大。
2. **解析/编译**：+938KB 源码在慢速 CPU 上 V8 解析编译可再 +0.2-0.5s（本机快，几乎无感）。
3. **加载重建**：本地 fork 的几何重建（26 锁：split/panel/桥接/挖洞/UV grid/weld）比原版重，
   但受控测量里只多 **~65-72ms**——不是主因。
4. 原版/改版站点本身：同一 GitHub Pages，无部署配置差异（两边都无预压缩 .gz，JS 均走 CDN gzip）。

## 4. 建议（按收益排序）

1. **JS 瘦身 / 按需加载**：2.55MB 里大块为 app.js(906KB) + 几何模块（guide-system 121KB、
   draw-flow 72KB、curve-surface-create 52KB、curve-math 56KB 等）。长期方向：把仅在特定工具
   使用时才需要的模块（curve-surface、guide、clump、preset-library…）改成动态 import；
   短期可做「首屏只用到的模块静态、其余 defer」。
2. **部署预压缩**：GitHub Pages 支持同名 `.gz`/`.br` 文件（服务端按 Accept-Encoding 直发）——
   发布脚本对 .js/.css/.html 生成预压缩副本可再省 60-70% 传输（938KB → ~250KB）。
3. **缓存策略**：`?v=` 缓存破坏保证正确性，但每次发布全部模块换号 = 全量重传；可按模块分批
   换号，未改模块沿用旧 `?v=`（已有 check-stale-cache-params.mjs 可辅助审计）。
4. 用户侧复测口径：同一浏览器 profile、先访问一次暖缓存后，比较「冷加载（清缓存刷新）」与
   「热加载（普通刷新）」两个数字——若热加载差距 <100ms 而冷加载差距大，则确认是传输主导。

## 5. 复测命令

```powershell
node scripts/measure-boot.mjs --runs 5 --port 8081 --cdp-port 9224 --ahs "D:\Downloads\Sussurro_v1_0046.ahs"
```
