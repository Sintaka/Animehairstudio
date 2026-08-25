# Panel 骨骼树：最多 5 层递归分叉（**分组树方案，D1-D11 已全部拍板，待实施**）

> 本轮**只调研与出计划**，未改动任何实现代码、未 bump 版本号、未提交。
> 前置基线：`node --test "tests/*.test.mjs"` 实测 **431 pass / 0 fail / 431 total**（子智能体 D 亲跑，
> `duration_ms 77868.68`）。主脑记忆里的 387 是旧数字，**以 431 为准**。
> HEAD `c0b480a`（0.2.151），分支 `DHS/develop`，版本 `0.1.5-Sintaka.0.2.151`。

## 0. 一句话结论

现状 panel 分叉**根本没有「层」这个概念**，只有「同一层里更多平级 segment」：`segmentCount = panelSplits.length + 1`
（`bone-model.js:778`），`splitBones` 是**扁平数组**、`parent` 字段恒为字符串 `"main"`（`bone-model.js:48`），
选中态 `panelSegmentIndex` 是**单个整数**（`sculpt-edit-store.js:23`）。所以用户抱怨的「一旦主骨骼定下来，
细分到下一级的时候会不好调整」不是调参手感问题，而是**数据模型里没有下一级可细分** —— 想再细分只能往同一个
`panelSplits` 数组里插更多 zipper，几何上被当成「4 段」而非「3 段中的某段再分 2」。

本计划**不**把叶子段改成递归 u 细分树（那条路在全局 u 空间下几何不成立，推导见 §3.0）。
采用的是**分组树**：叶子划分（今天的 `panelSplits`）**一字不动**，另存一份分组结构记录
**哪条 zipper 在哪一层做分隔**，父区间 = 子区间的**并集**（自下而上派生）。
⇒ 改分组不改叶子划分 ⇒ **渲染几何逐字节相同**，用户要的「保持视觉上效果不变」是**构造性成立**的。

根 panel 记为 L1、最深 L5。普通发丝（`STRAND_SEGMENT_HOST`）**完全不动**，靠 `segmentBoneHost()`
（`bone-model.js:797`）这个既有分派点天然隔离；outliner 拖拽再加一道**层级守卫**保证发丝与树杈不混合。

**旧档零迁移代码**：档里没有 `panelBoneGroups` 时按 zipper 的 `height` 一次性派生初始分组（§5.2），
派生只跑一次，之后用户拖过就不再重算（用户明确不要「手动刷新」）。

## 1. 实测证据（主脑亲自复核，非转述子智能体）

### 1.1 扁平性的四个硬证据

| 证据 | 值 | file:line |
|---|---|---|
| 段数唯一定义点 | `Math.max(1, panelSplits.length + 1)` | `bone-model.js:778` |
| `splitBones` 的 parent | `src?.parent \|\| "main"` —— 只能挂根链 | `bone-model.js:48` |
| 无嵌套字段 | `normalizeSplitBones` 产出的 bone 有 13 个字段，**无 `children`/`splits`/`depth`** | `bone-model.js:44-72` |
| 选中态是标量 | `panelSegmentIndex: 0`（整数，非路径数组） | `sculpt-edit-store.js:23` |

`normalizeSplitBones` 的 13 字段全清单（复核确认）：`name, parent, parentParam, p, orient, tip, tipClump,
taperCurve, taperCurveSecondary, depthCurve, depthCurveSecondary, asymmetricWidthCurve, asymmetricDepthCurve`。

### 1.2 关键常量现值（主脑逐个 grep 复核）

| 常量 | 值 | 定义点 |
|---|---|---|
| `MAX_SPLIT_SEGMENTS` | 24（**同层段数上限，不是深度上限**） | `bone-model.js:8` |
| `TIP_WIDTH_CONTROL_POINTS` | 5 | `tip-width-curve.js:30`（`panel-tip-strand.js:62` 再导出） |
| `TAPER_VALUE_MAX` | 1.5（紫色钳位上界） | `app-config.js:96` |
| `SCULPT_WIDTH_BRUSH_VALUE_FLOOR` | 0.02 | `width-brush.js:85` |
| zipper `height` 钳位 | `[0, 0.78]` ⇒ fork T ∈ [0.22, 1.0] | `app.js:1573` |

**全仓库无任何深度上限常量**：`MAX_DEPTH` / `maxDepth` / `branchDepth` 在 `app.js`、`modules/**` 全部零命中
（对照：`MAX_SPLIT_SEGMENTS` 能命中 ⇒ grep 管线有效）。⇒ 5 层上限是**本轮新增**，不是改既有值。

### 1.3 三处「没准备好」的空白（都是主脑亲自加对照命令确认的）

1. **outliner 完全不显示层级**：`renderLockList`（`app.js:15489`）函数体 15489-15641 行内 `branchParentId`
   出现 **0 次**（对照：全 `app.js` 命中 **30 次** ⇒ grep 有效）。⇒ 现有分叉子发片在大纲里是**平级散落**的。
2. **视口拾取丢弃了命中位置**：`hit.uv` / `.uv.y` 在 `app.js` 命中 **0 次**（对照：`intersectObjects`
   命中 **16 次**）。拾取只取 `hit.object.userData.lockId`，`hit.point`/`hit.uv` 全丢。
3. **`?v=` 缓存号真实总数 257**（记忆记的 244/256 都已漂移）。`index.html` 内恰好 **2 处**（L8 styles.css、
   L2421 app.js）。

### 1.4 ★ 版本 bump 是 3 文件 8 处，不是 3 处（子智能体 D 报错，主脑推翻）

子智能体 D 报「真正需要同步的只有 3 处」，**错**。实测 8 处：

| # | 位置 | 当前值 |
|---|---|---|
| 1 | `modules/core/app-config.js:1` | `APP_VERSION = "0.1.5-Sintaka.0.2.151"` |
| 2-3 | `index.html:8` / `:2421` | `?v=20260910-15` |
| 4-7 | `tests/dom-contract.test.mjs:2954 / 3046 / 4581 / 4582` | `20260910-15` 断言 |
| 8 | `tests/dom-contract.test.mjs:2703` | **点被转义**的 `0\.2\.151` 断言 |

第 8 处的隐蔽性已实测复现：`grep -c '0\.2\.151' tests/dom-contract.test.mjs` 返回 **0**，而 L2703 确实含它
（写作 `/APP_VERSION\s*=\s*["']0\.1\.5-Sintaka\.0\.2\.151["']/`）。**按普通 grep 改完会自信地漏掉它，靠测试变红才发现。**
`package.json` 冻在 `0.1.5-Sintaka.0.2.63`（L2702 断言钉住），**刻意不动**。

## 2. 根因：三个「层级不可表达」的结构性单点

### 2.1 段数是从 `panelSplits.length` 算出来的，不是存出来的

```js
// bone-model.js:778
segmentCount: (lock) => Math.max(1, (Array.isArray(lock?.panelSplits) ? lock.panelSplits.length : 0) + 1),
```

这条式子把「段」定义成「zipper 之间的间隔」。它是**一维的**：N 条 zipper 只能表达 N+1 个平级区间，
无法表达「第 2 个区间自己又被切成 3 份」。所有下游（把手分配、链物化、笔刷区间）都读这一处
（`bone-model.js:770-773` 的注释明令「消费方一律读这里，禁止再就地写」）⇒ **这是改造的第一号入口，也是唯一入口。**

### 2.2 `splitBonesFor` 的严格长度校验是迁移头号地雷

```js
// bone-model.js:85-90
export function splitBonesFor(lock) {
  const splits = Array.isArray(lock?.panelSplits) ? lock.panelSplits : [];
  const count = splits.length + 1;
  const stored = Array.isArray(lock?.splitBones) ? lock.splitBones : null;
  if (stored && stored.length === count) return normalizeSplitBones(stored, splits, lock);
  // …否则回落 registry，再否则整体回落派生默认值（不写回）
```

`stored.length === count` 是**全有或全无**：一旦 `count` 的计算方式因树化而改变（例如从「段数」变成
「树节点总数」），**旧档的全部已创作骨骼数据会静默落入默认值分支** —— 不报错、不警告，用户看到的是
「我调过的宽度全没了」。这是本轮**最高风险点**，§8 有专门的变异验收判据钉它。

### 2.3 width brush 的层级判定是两条硬编码互斥分支，没有第三层的插入点

```
applySculptMoveStrokeSample (sculpt-geometry.js:668)
  ├─ deps.applySubBoneBrushSample (bone-interaction.js:856)   ← 判 sculptState.tipSelection 非空 ⇒ 接管并 return true
  │    └─ 写 bone 层：候选点 tipWidthBrushCandidates(:836) → writeTipWidthValueForHost(:799)
  │       → setTipWidthCurveValueFrom (tip-width-curve.js:217)，钳位 [0.08, 2]
  └─ applyWidthCurveBrushSample (sculpt-geometry.js:568)      ← 回落
       └─ 写 lock 层：候选点 taperCurveBrushCandidates (taper-editor.js:426) → point.value 直写
          钳位 [SCULPT_WIDTH_BRUSH_VALUE_FLOOR, TAPER_VALUE_MAX] = [0.02, 1.5]
```

要点三条：
1. **判据是「用户选中了哪个层级的对象」，不是笔刷按空间位置自己判断** —— 这对本计划是好消息：
   §3 的选择模型一改，笔刷分派几乎自动跟着走。
2. `sculptWidthBrushMultiplier`（`width-brush.js:94`）**本身对层级无感知**，是纯函数，钳位区间由调用方传参
   ⇒ 内核不用改，改的是「谁来调它、传哪个区间」。
3. 两条候选点枚举函数（`taperCurveBrushCandidates` / `tipWidthBrushCandidates`）**平行硬编码、互不复用**，
   签名都不接受「层级」参数 ⇒ 树化必须把「从哪个对象取曲线」抽象成参数，否则每加一层就要复制一个函数。

### 2.4 顺带解释了延后的 bug2 为什么必须在本轮之后修

`tip-width-curve.js:260` 的 `addPoint(sideForkT, sampleTaperCurve(globalCurve, sideForkT))` 是**派生连续性锚点**
（注释自称 "DERIVED CONTINUITY JOIN…always the global curve's value there, never a draggable control point"）。
两层结构下 `globalCurve` 是唯一明确的上级曲线，一次父→子交接，无排序问题。**5 层树下它变成一条采样链**：
子层锚点值 = 父层在该 t 的采样值，而父层自己的值可能又来自祖父层 ⇒ **必须按树深度从根到叶严格排序重建**，
否则子层采样到父层重建前的旧快照，产生凹陷/跳变。⇒ bug2 的正确修法依赖本轮先建立「按深度排序重建」的机制，
用户当初「先不修，准备重构成骨骼树」的判断是对的。

另有一条更根本的：`tipWidthRecordsOppositeForkFrom`（`tip-width-curve.js:169`）的「对侧」概念建立在
**二元 `side ∈ {-1, 1}`** 上（多处 `[-1, 1].forEach`，如 `bone-interaction.js:839`）。N 叉分支下「对侧」
要重新定义成「其它所有子分叉中最深的那个」—— 这比锚点采样本身是更大的一处待重新设计的假设，
§9 列为本轮**不**处理。

## 3. 数据模型设计：**分组树**（非 u 细分树）

### 3.0 ★ 模型选定的经过（两轮问答后的转向，必读）

第一轮用户拍板 position 存**全局 u 空间**（不是局部归一化）。这引出一个几何硬矛盾：
`boundaries = [-1, ...positions, 1]`（`panel-tip-strand.js:225`）下**兄弟节点是互不相交的 u 区间**，
段 k 占 `[b_k, b_{k+1}]` ⇒ 「把兄弟 B 拖成兄弟 A 的子节点」**在几何上不成立**，因为 A 的子节点必须是
A 区间的子区间，而 B 根本不在 A 里。第二轮我把这条矛盾摆给用户，用户答（逐字）：

> 「允许重映射 position, 实在不行可以直接整个父子层级关系刷新, 但是要保持视觉上效果不变」

以及撤回同级重排序（逐字）：

> 「撤回，重排交给视口拖 zipper」

**关键在「保持视觉上效果不变」这条不变量**——它比「数字不变」弱，也比「数字不变」更本质。
满足它的最干净模型不是 u 细分树，而是**分组树**：

- **叶子段**继续定义真正的 u 划分 —— 就是**今天的扁平 `panelSplits`，一字不动**。
- 树只记录**哪条 zipper 在哪一层做分隔**。父节点的 u 区间是**其子节点区间的并集**（自下而上派生），
  **不是**自上而下切出来的。
- ⇒ 重挂父级**只改变分组**，叶子划分恒等 ⇒ **渲染几何逐字节相同**。用户的不变量是**构造性成立**的，
  不依赖小心的重映射。

**这个模型同时更贴用户的原始目的**：「用 width brush 调整不同层级的发尖, 而不是全部都是最小单位发尖骨骼」
= 通过一个中间层节点**成组**刷一批发尖 —— 分组语义正是这件事。也解释了「zipper 及其控制选项需要
记录在不同的层中」：**每条 zipper 归属于它作为分隔者的那一层**，三叉刘海的浅 zipper 是 L2，
各分支内部更深的 zipper 是 L3+。

**顺带消掉 §2.2 的头号地雷**：`splitBonesFor` 的 `stored.length === count`（`bone-model.js:87`）
在分组模型下**不需要改** —— 叶子数恒等于 `panelSplits.length + 1`，count 语义不变，旧档零损**天然成立**。

### 3.1 数据形状：叶子数组不动，另存一份分组结构

`lock.panelSplits`（zipper 数组）与 `lock.splitBones`（叶子骨骼数组）**形状与语义完全不变**。
新增**一个**字段描述分组：

```js
// lock.panelBoneGroups：分组树。null / 缺失 = 触发 §5.2 的 load-time 派生。
{
  // 覆盖哪些叶子（连续叶子下标闭区间，从结构上保证并集是连续 u 区间）
  leafStart: 0, leafEnd: 2,      // 覆盖 splitBones[0..2]
  // ↓ 绿框 #panelZipperGroup 内的按层参数（D10，清单见 §6.1）
  tipClump: null,                // null = 继承祖先
  taperCurve: null, taperCurveSecondary: null,
  depthCurve: null, depthCurveSecondary: null,
  splitEnabled: null,            // 对应 panelSplitEnabled
  splitSnapToLoops: null,        // 对应 panelSplitSnapToLoops
  children: null                 // 子分组数组；null = 该节点直接由叶子组成
}
```

**`panelSplits` 仍是叶子层唯一真源**：分组节点**不复制** zipper 数据，只通过 `leafStart/leafEnd`
隐含「该层由哪几条 zipper 分隔」（区间边界上的那几条）。这样 zipper 的 position/height 永远只有一份，
视口拖 zipper 改的还是那一份 ⇒ 不会出现两份数据不同步。

**为什么用「连续叶子下标区间」而不是叶子 id 集合**：u 连续性是几何硬约束（分组必须是连续 u 区间，
否则并集不是一个区间、fork 语义崩塌）。用 `[leafStart, leafEnd]` 表达**从数据结构上就无法**构造出
不连续分组，比事后校验更可靠。

**为什么分组节点也带曲线字段**：这是「不同层级各有 WidthCurve」的落点。取值规则见 §3.3。

### 3.2 深度口径（已拍板）

用户拍板：**根 panel 算第 1 层**。⇒ 根 panel = L1，其 `children` = L2，最深 **L5**。
新增常量 `MAX_PANEL_BONE_DEPTH = 5`。三叉刘海：根 L1 + 三叉 L2，还剩 **3 层**可细分。
分组深度只是**分组层数**，与叶子数无关 ⇒ `MAX_SPLIT_SEGMENTS = 24` 保持不变（用户拍板 D7：
「先保留24, 一般不会到那么高」）。

### 3.3 曲线取值规则：沿分组链向上回落到最近的已创作祖先

叶子采样宽度时，从叶子出发**向上找第一个 `taperCurve` 非 null 的祖先**，最终回落到 `lock.taperCurve`。

**这不是新发明，是补齐既有意图**：`buildTipWidthCurveFrom`（`tip-width-curve.js:247`）今天就已经
在做「segment 无创作数据 ⇒ 回落 `globalCurve`（即 lock 层曲线）」，注释原文
`sampling falls back to the global curve below the fork`。分组模型只是把这条**两级回落**推广成
**沿分组链的多级回落**。⇒ 编辑哪一层，就写那一层的 `taperCurve`；下层未创作的自动跟随。

### 3.4 路径寻址取代整数下标

`panelSegmentIndex`（整数）扩成 `panelSegmentPath`（整数数组）。**向后兼容用「读时升格」**：
读到数字就当成 `[n]`。分组树缺失时，`[n]` 恒等于今天的第 n 段 ⇒ 与现状逐字段等价。

## 4. 候选方案对比

| 方案 | 做法 | 优点 | 代价 | 判决 |
|---|---|---|---|---|
| **A 复用 `branchParentId` 多 lock 链** | 每个分叉是**独立 lock + 独立 mesh**，靠 `branchParentId` 串成树。`updateBranchChildren`（`branch-hierarchy.js:84`）已是**真自递归**、无深度上限 | 递归基础设施已存在且跑过三级；序列化不用改（每 lock 独存字符串引用） | **与用户要求正面冲突** —— 用户明确「以**一个大 panel** 构建」，A 会变成 N 个 mesh、N 个 lock，UV/材质/导出全部按独立发片走，且 zipper 交界连续性彻底失去（不同 mesh 之间没有共享曲线） | **否决** |
| **B `splitBones` 树化** | 在同一 lock 内把扁平 `splitBones` 改成**自上而下 u 细分**的递归树 | 契合「一个大 panel」 | 全局 u 空间下**兄弟互不相交** ⇒ 「降级到兄弟下」几何不成立（§3.0）；`bone-model.js` 核心重写；`stored.length === count` 地雷；4 个测试文件改断言 | **被 B′ 取代** |
| **B′ 分组树（采纳）** | 叶子划分不动（就是今天的 `panelSplits`），另存一份**分组结构**记录哪条 zipper 在哪层分隔；父区间 = 子区间并集（自下而上） | 几何不变量**构造性成立**（V3 可升级为字节级）；旧档零迁移；地雷消失；直接命中「成组刷一批发尖」的原始目的 | 多一个 `panelBoneGroups` 字段；分组连续性需校验 | **采纳** |
| **C 不动数据模型，只加 UI 分组** | 把平级 segment 在 outliner 里按 zipper 深度**假装**分层显示 | 改动最小 | 治标不治本 —— 用户抱怨的是「没有下一级可细分」，假分层后 width brush 拿到的仍是同一套 5 点共享网格，问题原样存在 | **否决** |

**A 与 B 的分野是主脑从用户原话定的，不是猜的**：两个子智能体都把这条列为「需主脑拍板的 A/B」，
但用户原话「在前额的三叉刘海以**一个大panel**构建时」已经排除 A —— A 的每个分叉都是独立 mesh，
不是「一个大 panel」。

## 5. 推荐方案：B′（**分组树** + 路径寻址 + 曲线沿链回落）

> §5 原写作「B：`splitBones` 递归树」，两轮问答后**转向分组模型**（§3.0）。
> 差别是决定性的：**叶子层完全不动** ⇒ 几何不变量构造性成立、旧档零迁移、头号地雷消失。

五个改造面，按依赖顺序：

1. **数据层**（`bone-model.js`）：`splits`/`children` 两字段 + `MAX_PANEL_BONE_DEPTH = 5`；
   `segmentCount` 从「返回一个数」升级为「按路径返回该层的段数」；`splitBonesFor` 的
   `stored.length === count` 校验改成**按层校验**（关键：深度 1 时行为必须与现在逐字段等价）。
2. **遍历层**（`bone-model.js`）：新增唯一的树遍历器（现状全仓库**没有** `forEachBone`/`collectBones`/
   `walkBones` 任何一个，已双向对照确认），并规定**根→叶深度序**，供 §2.4 的锚点采样链使用。
3. **选择层**（`sculpt-edit-store.js` + `app.js`）：`panelSegmentIndex` → `panelSegmentPath`（读时升格）。
4. **outliner**（`app.js:15489` + `styles.css`）：第三层 `layerRoots.forEach`（`app.js:15626`）内改为调用新的
   递归节点渲染器；新增按路径索引的展开状态 Map（**不能**复用现有 `strandGroupOpen`/`strandLayerOpen`/
   `clumpOpen`/`curveSurfaceOpen` 四个，它们各自绑定固定层级语义）。
5. **拾取与笔刷**（`app.js` 拾取段 + `bone-interaction.js`/`sculpt-geometry.js`）：
   拾取补 t 计算（用既有 `closestStrandCurveParameter`，`app.js:19787`，已被
   `bone-interaction.js:1356` 生产验证），按 **t < 0.5 保持母层级 / t ≥ 0.5 钻取下一级** 分派。

### 5.0 ★ 分组模型下，§5 的五个改造面被大幅削减

| 改造面 | 原计划（u 细分树） | 分组模型下 |
|---|---|---|
| 数据层 | `segmentCount` 按路径、`splitBonesFor` 按层校验（**头号地雷**） | **叶子层完全不动**。只加 `panelBoneGroups` 字段 + 分组解析。地雷消失 |
| 遍历层 | 递归遍历 + 根→叶深度序 | 仍需要，但只遍历**分组树**（比遍历几何段轻得多） |
| 选择层 | `panelSegmentIndex` → 路径 | 不变，仍需要 |
| outliner | 递归渲染 + 拖拽 | 不变，仍需要（拖拽语义见 §5.2） |
| 拾取/笔刷 | 按路径取节点 | **大幅简化**：叶子几何不变 ⇒ 拾取仍命中叶子，只需把叶子映射回它所属的分组节点 |
| ~~控制点参数化~~ | ~~3-C：`TIP_WIDTH_CONTROL_POINTS` 按层参数化~~ | **整个删除**，见 §5.3 |

### 5.1 拖拽语义（分组模型下）

拖拽 = **改变分组归属**。因为叶子划分恒等，任何合法分组变更都**不改变渲染几何**（验收 V3 升级为
逐顶点**字节级**相同，比原先的 1e-6 阈值更强）。

- **合法性判据**：目标分组必须使被拖节点的叶子区间与目标的叶子区间**连续相邻**（保证并集仍是连续区间）。
  不相邻 ⇒ 拒绝并提示。这条比原先的「u 区间包含」判据宽松得多，用户想要的「降级到兄弟下」在分组语义下
  **是合法的**（相邻兄弟可以归到同一组）。
- **多选**：用户拍板「仅允许同父同深度」。加上连续性判据 ⇒ 多选必须是**同父的连续相邻兄弟**。
- **同级重排序：用户已撤回**（逐字：「撤回，重排交给视口拖 zipper」）⇒ outliner 拖拽**不做**重排序，
  只做分组归属变更。视口拖 zipper 手柄改 `position` 的既有路径不动。
- **不做别名，直接改造既有拖拽 + 层级拖拽守卫**（用户拍板，逐字）：「相比用别名我更倾向于直接改造,
  然后加层级拖拽守卫, 发丝的拖拽不能和树杈子系统拖拽混合, 原版没有树杈层级系统」。
  ⇒ 直接改 `app.js:15285-15301` 那套 dragstart/dragover/drop，**不**新增并列的 dataTransfer 类型别名。
  必须加一道**层级拖拽守卫**：发丝（strand）拖拽与树杈（panel 分组树）拖拽**互斥，不允许混合**。
  判据 = 拖拽源类别 + 目标类别同时匹配，任一不符即拒绝并提示。
  **注意上游原版没有树杈层级系统** ⇒ 改造不得破坏上游既有的 strand/clump 拖拽路径
  （`handleOutlinerClumpDrop`，`app.js:15300`），该路径是 clump 归属、与层级无关。
- **D9 不做成持久刷新按钮**（用户拍板，逐字）：「需要重新评估是否必要, 因为最终目的是拖拽后的层级结构
  在现有的位置数据上自适应, 这个更偏向代码一次性迁移而非持久支持, 因为我有的时候想提升/降级一个zipper的层级,
  而不应该由用户调整后手动刷新」。⇒ 拆成两件互不相干的事：
  ① **load-time 一次性派生**（§5.2）：旧档按 `height` 推导初始分组；
  ② **拖拽即时生效**：拖完层级结构直接落到位，**没有刷新按钮**，用户不需要手动触发任何重算。

### 5.2 load-time 派生规则：从 `height` 推导初始分组（一次性迁移）

**实测依据（主脑亲跑用户提供的真实档）**：

| 档 | panel | zipper 数 | heights（按 position 序） | 不同 height 档位 |
|---|---|---|---|---|
| `Scalp Conform Test 1.ahs` | Side Bangs Left 1 | 2 | `[0.3, 0.3]` | **1**（全等） |
| `Scalp Conform Test 3.ahs` | Front Bangs 1 | 5 | `[0.53125, 0.21875, 0.3125, 0.4375, 0.5]` | **5**（全不同） |
| `Sussurro_v1_0060.ahs` | Front Bangs 1 | 4 | `[0.375, 0.3125, 0.5625, 0.4375]` | **4**（全不同） |
| `Sussurro_v1_0060.ahs` | Front Bangs 2 | 3 | `[0.3125, 0.0625, 0.1875]` | **3**（全不同） |
| `Sussurro_v1_0060.ahs` | Front Bangs 3 | 4 | `[0.3125, 0.1875, 0.25, 0.125]` | **4**（全不同） |

⇒ **真实档里 height 几乎总是各不相同**，天然携带一个层级序：**height 越大（zipper 越深）= 分离得越晚
= 在树里越深**。所以派生规则是：

1. 取所有 zipper 的**不同** height 值，从**小到大**（浅→深）作为层级档位；
2. 最浅那一档的 zipper 在 **L2** 做分隔（它把根 panel 分成最粗的几块）；
3. 逐档加深，每一档的 zipper 在**它所落入的那个上层分组内部**继续分隔，深度 +1；
4. **height 相同的 zipper 留在同一层做平级兄弟**（不要递归取 max 造出人为的链）——
   `Test 1.ahs` 的 `[0.3, 0.3]` 就必须派生成「L2 上两个平级兄弟」，不能变成两层。
5. 派生深度超过 `MAX_PANEL_BONE_DEPTH = 5` 时，**该层内剩余 zipper 全部平铺在第 5 层**（不报错、不丢数据、
   叶子划分保持完整）。

**★ 层级 ≠ height 全局排名，而是嵌套位置**（主脑实测纠正了本节初稿的错误）：
第一版探针按「height 在全局档位里的排名」定层级，得出 `Sussurro FB1` 的 `3|4` 分隔在 L4。
**错**。正确构造是**递归**的：在每个分组内部，取该组内**最浅**的 separator 切分，深度 = 嵌套层数。
`3|4` 实际嵌套在深度 3。两种算法在同一份数据上给出不同答案 ⇒ **实现必须用递归构造，不能用全局排名**。

**实测派生结果（`.tmp-bone-tree/derive-probe2.mjs`，全部 `leafPartitionIntact=true`）**：

| 档 :: panel | 叶子数 | 派生最大深度 | 钳位是否触发 |
|---|---|---|---|
| `Test 1` :: Side Bangs Left 1 | 3 | **L2**（三个平级兄弟） | 否 |
| `Test 2` :: Front Bangs 1 | 3 | **L2** | 否 |
| `Test 3` :: Front Bangs 1 | 6 | **L5**（恰好到底，未超） | **否** |
| `Sussurro` :: Front Bangs 1 | 5 | **L4** | 否 |
| `Sussurro` :: Front Bangs 2 | 4 | **L3** | 否 |
| `Sussurro` :: Front Bangs 3 | 5 | **L4** | 否 |

**⇒ 四个真实档全都不触发深度钳位**（本节初稿声称 Test 3 会撞上限，**实测推翻**：它嵌套到恰好 L5）。
所以规则 5 **必须用合成用例覆盖**，否则会是一条没被测过的代码路径。已验证的合成用例
（`derive-probe3.mjs`）：**6 条 height 严格递增、层层嵌套的 zipper**（7 叶子）⇒ 名义深度 7，
实测钳位触发、尾部在 L5 平铺成 3 个兄弟、7 个叶子仍连续完整。

**这条规则是一次性的**：派生只在「档里没有 `panelBoneGroups`」时跑。一旦用户拖过，
`panelBoneGroups` 就存在了，**不再重新派生**（否则会冲掉手工层级，正是用户不要的「手动刷新」）。

### 5.3 D4 已拍板：控制点参数化**整个删除**，改用既有的 segment 曲线面板

用户原话（逐字）：

> 「暂不做每层可调, 用户可以通过现有的Main面板中的WidthCurve曲线加, Main面板中的WidthCurve以及depth
> 直接关联当前选中层级的就可以了, 用户要切换别的层级自己通过视口或者outliner切换后main中更新所属即可」

**主脑实测：这个机制已经存在，只是目前只覆盖一级。** `index.html:1132-1138` 已有 *Selected segment*
的 Width Curve / Depth Curve 两块（`#segmentTaperPreview` / `#segmentDepthPreview`），由
`segment-control.js:170-171` 接线、`segment-control.js:182` 经 `resolveSegmentSelection` 解析当前段。
⇒ **`resolveSegmentSelection` 一旦支持路径，这个面板自动跟随选中层级，零新增 UI 控件。**

后果：`TIP_WIDTH_CONTROL_POINTS` 保持无参常量 5，**阶段 3-C 整个删除**；D3「每层可独立设置」
被用户主动收回，D5「新控件落点」随之作废（无新控件）。

### 5.4 已拍板的决策（用户原话逐字留档）

用户对本计划的三问逐字回答：

- **钻取分界**：选 **「固定比例 0.5」**。⇒ `t < 0.5` 保持当前母层级选择，`t ≥ 0.5` 在已选中母层级的状态下
  继续深入下一级。**刻意不用 fork T 锚定** —— 手感稳定可预测优先于几何严格性。
  已知代价（用户已知情接受）：zipper 很深时（fork T = 0.22）`0.22~0.5` 这段**明明已经分叉了却仍选母层级**。
- **层数口径**：选 **「根 panel 算第 1 层」**。
- **控制点密度**：**暂不做每层可调**，改用既有 segment 曲线面板绑定当前选中层级（详见 §5.3）。
- **position 坐标空间**：**全局 u 空间**（沿用现状，不改 `boundaries` 构造）。
- **拖拽**：允许改变分组归属（含降级到相邻兄弟组）；**同级重排序已撤回**，交给视口拖 zipper。
- **多选拖拽**：**仅允许同父同深度**。
- **旧档（D6）**：用户拍板（逐字）「旧档可以转化为新档, panel刘海所有的分层转入主刘海的在一层即可」
  ⇒ 旧档所有叶子平铺进 **L2 一层**，`panelBoneGroups` 留空即等价 ⇒ **零迁移代码**。
- **同层段数上限（D7）**：用户拍板（逐字）「先保留24, 一般不会到那么高」⇒ `MAX_SPLIT_SEGMENTS = 24` 不动。

### 5.6 ★ 层级按钮的一条固有限制（阶段 3 实测，用户已知悉）

`boneLevel` 有一条硬不变量：**存储值恒等于实际嵌套深度**（否则 UI 显示会与真实层级漂移、
按钮变成骗人的）。这条不变量的推论是：**每个分组内部永远至少有一条 zipper 处在该组最浅层** ——
规范化总会把最小 level 拉回「组深度 + 1」。

⇒ **「降级某个分组里唯一的那条切点」在数学上无法满足**。实测后果（`Test 3`，levels `[3,2,3,4,5]`，
zipper1 是唯一 L2 切点）：demote 后变成 `[2,2,2,3,4]` —— zipper1 没变深，反而 zipper0/zipper2
被拉上来当了根切点，**整棵树全局重流**；再 promote 因已在下界 2 而是 no-op ⇒ **加号回不来**。
6 个真实 panel 里 **4 个**中招。

**用户拍板：禁止降级唯一最浅切点**（`canDemote` 返回 false，按钮置灰）。语义上这个操作本来
也不成立 —— 把唯一的主分叉降级等于「这个 panel 没有主分叉了」。

**由此产生的固有限制（实测每组切点数）**：

| 档 :: panel | zipper 数 | 可升 | 可降 | 每组切点数 |
|---|---|---|---|---|
| `Test 1` :: Side Bangs Left 1 | 2 | 0 | **2** | L1:2（两条同层兄弟） |
| `Test 2` :: Front Bangs 1 | 2 | 0 | **2** | L1:2 |
| `Test 3` :: Front Bangs 1 | 5 | 4 | **0** | 全部为 1（纯二叉链） |
| `Sussurro` :: Front Bangs 1 | 4 | 3 | **0** | 全部为 1 |
| `Sussurro` :: Front Bangs 2 | 3 | 2 | **0** | 全部为 1 |
| `Sussurro` :: Front Bangs 3 | 4 | 3 | **0** | 全部为 1 |

⇒ **降级只在「同组有多条同层兄弟切点」时可用**。真实档里 height 各不相同的 panel 会派生成
**纯二叉链**（每组恰好 1 个切点），此时树已经是最深形态、没有可再压深的东西，只能升级（拍平）。
这不是 bug，是数据形状决定的。判据走**树的真实结构**（数同组同深度边界条数）而不是 level 数字，
因为 clampedFlat 那层的子节点深度与父节点相同，纯比数字会误判。

## 6. 决策点

| # | 决策点 | 结论 | 状态 |
|---|---|---|---|
| D1 | 钻取分界锚定方式 | 固定比例 0.5（`t < 0.5` 母层级 / `t ≥ 0.5` 钻取） | **已拍板** |
| D2 | 深度口径 | 根 panel = L1，最深 L5 | **已拍板** |
| D3 | ~~各层控制点密度~~ | **用户收回** —— 改用既有 segment 曲线面板（§5.3） | **作废** |
| D4 | 每层控制点数 | 暂不做每层可调，`TIP_WIDTH_CONTROL_POINTS` 保持 5 | **已拍板** |
| D5 | ~~新增 UI 控件落点~~ | **作废** —— 无新增控件，复用 `#segmentTaperPreview` 路径 | **作废** |
| D6 | 旧档读入策略 | 所有分层转入 L2 一层，`panelBoneGroups` 留空 ⇒ 零迁移代码 | **已拍板** |
| D7 | 同层段数上限 | `MAX_SPLIT_SEGMENTS = 24` 不动 | **已拍板** |
| D8 | position 坐标空间 | 全局 u 空间 | **已拍板** |
| D9 | 「按 zipper 深度重建分组」 | **不做持久按钮** —— 拆成 load-time 一次性派生（§5.2）+ 拖拽即时生效 | **已拍板** |
| D10 | 哪些参数按层归属 | **绿框 `#panelZipperGroup` 内的全部**（发尖系统特有），清单见 §6.1 | **已拍板** |
| D11 | 拖拽实现方式 | 直接改造既有拖拽（不用别名）+ 层级拖拽守卫，发丝与树杈拖拽互斥 | **已拍板** |

### 6.1 D10 拍板明细：按层归属的参数 = 绿框内全部

用户原话（逐字）：

> 「D10 我指的是现有的绿色强调框内的那几个, 都是发尖系统特有的」

主脑实测定位：绿框 = `index.html:1121` 的 `<div id="panelZipperGroup" class="control-emphasis control-emphasis--green">`。
其内容逐项列出（`index.html:1121-1150` 实读）：

| 控件 id | 标签 | 现有存储字段 | 按层归属后 |
|---|---|---|---|
| `panelSegmentLabel` + `previousPanelSegment`/`nextPanelSegment` | Split Segments / Segment 步进 | `panelSegmentIndex`（整数） | → `panelSegmentPath`（路径） |
| `panelSegmentSpread` | Tip Clump | `splitBones[k].tipClump` | 分组节点持有 |
| `segmentTaperPreview`（`#panelSegmentCurveControls`） | Width Curve | `splitBones[k].taperCurve(/Secondary)` | 分组节点持有 |
| `segmentDepthPreview` | Depth Curve | `splitBones[k].depthCurve(/Secondary)` | 分组节点持有 |
| `panelSplitEnabled` | Split Tip / Split Geometry | `lock.panelSplitEnabled` | **按层记录** |
| `panelSplitSnapToLoops` | Snap Zippers to Loops | `lock.panelSplitSnapToLoops` | **按层记录** |
| `panelSplitCount` + `addPanelSplit`/`removePanelSplit` | Zipper Controls 增减 | `lock.panelSplits` 长度 | **按层记录**（该层内的 zipper 数） |

⇒ **这正好落回用户最初那句要求**（逐字）：「zipper及其控制选项需要记录在不同的层中」。
所以 §3.1 的分组节点字段要在原先四条曲线之外**再加** `tipClump`、`splitEnabled`、`splitSnapToLoops`。
`panelSplits` 本身仍是**叶子层的唯一真源**（分组节点只记录「该层由哪些 zipper 分隔」，不复制 zipper 数据）。

**D9/D10/D11 全部已拍板，无待拍板项。**

## 7. 实施阶段与子智能体切分（**文件不相交**）

铁律：同文件修改只交给一个子智能体。下表每个阶段内的子智能体文件集互不重叠；跨阶段串行。

### ✅ 阶段 1 + 1.5 已完成（2026-08-25，主脑复核通过）

产出**三个新文件，零改动既有实现文件**（`git diff -w --numstat` 只有 `.gitignore` 的 +4/-0，是主脑加的
`.tmp-bone-tree/` 忽略规则）：

| 文件 | 行数 | 内容 |
|---|---|---|
| `modules/bones/panel-bone-groups.js` | 251 | 纯函数模块，8 个导出：`MAX_PANEL_BONE_DEPTH=5`、`derivePanelBoneGroups`、`normalizePanelBoneGroups`、`panelBoneGroupsLeafPartition`、`forEachPanelBoneGroup`、`panelBoneGroupAtPath`、`panelBoneGroupPathForLeaf`、`resolvePanelBoneGroupValue` |
| `tests/panel-bone-groups-derive.test.mjs` | 216 | 7 例：派生规则（同高同层 / 嵌套≠排名 / 恰好 L5 / 钳位 / 叶子划分 / 边界） |
| `tests/panel-bone-groups-tree.test.mjs` | 371 | 21 例：遍历序、路径寻址、曲线回落、归一化门禁 |

**测试基线 431 → 459**（主脑亲跑 `node --test "tests/*.test.mjs"`：459 pass / 0 fail）。
算术自校验：**431 + 7 + 21 = 459** ⇒ 新增恰好是这两个文件，既有 431 条一条没动。
三个文件全部 **UTF-8 无 BOM、零 CRLF**，`node --check` 全过。

#### 主脑的独立复核（不采信子智能体数字）

**① 五个变异全部咬中真实模块**（子智能体的变异是对着**它们自己在仓库外写的参考实现**跑的，
只证明测试符合它们的心智模型，**不证明**能咬真实代码 ⇒ 主脑重做）：

| 变异 | 改动 | 结果 |
|---|---|---|
| M1 | 同高 cuts 只留第一条（破坏同层兄弟） | 28 → **27 pass / 1 fail** |
| M2 | 钳位 `>=` 改 `>`（晚一层） | 28 → **27 / 1** |
| M3 | 钳位提前一层 | 28 → **26 / 2** |
| M4 | 取最深 height 而非最浅（反转嵌套） | 28 → **25 / 3** |
| M5 | `value != null` 改真值判断（0/false bug） | 28 → **27 / 1**，失败用例自报名：「0 与 false 是合法创作值」 |

每次变异后 `cp` 还原并用 **sha256 比对**确认还原到位，最终 28/28。

**★ M5 第一次尝试是「假绿」**：主脑猜的正则没匹配上（真实代码是 `if (value != null)`，
在 246 行），脚本打印 `applied: false` 而测试仍 28/28 —— **这是「变异没生效」不是「测试通过」**。
按真实行改写后立刻变红。这正是本仓「空输出/假绿」踩过五次的同一个坑，**引用变异结论前必须确认变异真的应用了**。

**② 真实档交叉核对**（`.tmp-bone-tree/crosscheck.mjs`，主脑独立写，不复用子智能体的 verify 脚本）：
真实模块跑四个真实档的 6 个 panel，**最大深度与树形字符串逐字符匹配** §5.2 的 probe2 实测值，
六个 panel 的 `leafPartitionIntact` 全 true，`0`/`false` 回落守卫实测返回 `0` 与 `false`（非 fallback）。
`TOTAL FAILURES: 0`。

**③ `?v=` 缓存号本阶段无需 bump**（主脑亲自 grep，这条不委派）：`index.html` 对
`panel-bone-groups` 命中 **0**（对照：`index.html` 有 2 处 `?v=`），新模块目前**只被 tests 用 node 直接 import**
（node 不走 `?v=`）。⇒ **阶段 2 首次从 app.js 侧引用它时，必须补 `?v=` 并按 §1.4 的 8 处同步 bump 版本号。**

#### 子智能体主动上报的两处（主脑已确认无害）
- `panelBoneGroupPathForLeaf` 的越界口径：N 个叶子的合法下标是 `0..N-1`，测试用 `leafIndex = N` 作越界样本。口径正确。
- `clampedFlat` 只打在**触发钳位的那个父节点**上，被平铺的子节点不打标记，且子节点 `depth` 与父相同（不 +1）。与 §5.2 的期望输出文本一致。

### 阶段 1：数据层 + 遍历层（原计划，已由上方完成）

| 子智能体 | 文件（独占） | 任务 |
|---|---|---|
| **1-A**（sonnet） | `modules/bones/bone-model.js` | 加 `panelBoneGroups` 归一化（连续叶子区间校验）+ `MAX_PANEL_BONE_DEPTH = 5` + 分组树遍历器（根→叶序）+ 曲线沿链回落解析（§3.3）+ 叶子↔分组节点双向映射。**`splitBonesFor`/`segmentCount`/`normalizeSplitBones` 一字不动** |
| **1-B**（sonnet） | `tests/panel-bone-tree.test.mjs`（**新建**） | 只写测试：分组缺失时与现状逐字段等价、连续性校验拒绝不相邻分组、深度上限 5、曲线回落到最近已创作祖先、round-trip 无损 |

**1-A 与 1-B 并行**（1-B 写新文件，不碰 `bone-model.js`）。1-B 的测试先红后绿是预期的。

### 阶段 1.5：load-time 派生（与阶段 1 同批，文件不相交）

| 子智能体 | 文件（独占） | 任务 |
|---|---|---|
| **1.5-A**（sonnet） | `modules/bones/panel-bone-groups.js`（**新建**） | §5.2 的派生规则纯函数：输入 `panelSplits`，输出分组树。含 height 相同留同层、超 5 层并入第 5 层 |
| **1.5-B**（sonnet） | `tests/panel-bone-group-derive.test.mjs`（**新建**） | 用**真实档的真实数字**做用例（见 §11 表）：`[0.3,0.3]` → L2 两平级兄弟；`Test 3` 的 5 档位 → 撞 5 层上限并入；`Sussurro` 三个 panel 各自的档位数 |

### 阶段 2：选择层 + outliner（阶段 1 全绿后）

| 子智能体 | 文件（独占） | 任务 |
|---|---|---|
| **2-A**（sonnet） | `modules/edit/sculpt-edit-store.js` | `panelSegmentIndex` → `panelSegmentPath`，含读时升格（数字 → `[n]`） |
| **2-B**（sonnet） | `modules/bones/segment-control.js` | 4 处 `panelSegmentIndex` 读点改路径（已 grep 确认恰好 4 处） |
| **2-C**（**opus**） | `app.js`（`renderLockList` 15489-15641 + 展开状态 Map 2390-2394） | outliner 递归渲染器。**派 opus 的理由**：`app.js` 是 2 万行编排层，`renderLockList` 与 4 个展开 Map、3 种渲染分派（strand/curve-surface/clump）交织，改错会打挂整个大纲 |
| **2-D**（sonnet） | `styles.css` | 递归缩进样式（现有 `.clump-child` 在 `styles.css:7016` 可参照） |

### 阶段 3：拾取 + 笔刷分派（阶段 2 全绿后）

| 子智能体 | 文件（独占） | 任务 |
|---|---|---|
| **3-A**（**opus**） | `app.js` 拾取段（20437 / 20666-20843） | 命中点求 t（复用 `closestStrandCurveParameter`:19787）+ 0.5 阈值钻取分派。**派 opus 的理由**：拾取段有 marquee/curve-surface controller/modeling-click 三条互相纠缠的分支 |
| **3-B**（sonnet） | `modules/bones/bone-interaction.js` | `tipWidthBrushCandidates`(:836) / `writeTipWidthValueForHost`(:799) 改为按**分组节点**取曲线（叶子命中 → 映射到当前选中层级的分组节点） |
| ~~3-C~~ | ~~`tip-width-curve.js` + `panel-tip-strand.js`~~ | **整个删除**（D4 已拍板不做参数化，见 §5.3） |

### 阶段 3.5：outliner 多选 + 拖拽分组（阶段 3 全绿后）

| 子智能体 | 文件（独占） | 任务 |
|---|---|---|
| **3.5-A**（**opus**） | `app.js` outliner 拖拽段（15239 / 15285-15301） | **直接改造**既有拖拽（用户拍板不用别名）+ 多选 + 分组归属变更 + **层级拖拽守卫**（发丝与树杈互斥）。**现状实测**：`button.draggable`(15239) 与 dragstart/dragover/drop(15285/15291/15298) 已存在但是**单项**，`dataTransfer` 只带一个裸 `lock.id`(15286)，drop 转给 `handleOutlinerClumpDrop`(15300) 做 **clump 归属**（与层级无关）。改造**不得破坏**这条上游路径 —— 上游原版无树杈层级系统 |
| **3.5-B**（sonnet） | `tests/panel-bone-group-drag.test.mjs`（**新建**） | 连续性校验、同父同深度多选校验、深度上限拒绝、分组变更后叶子划分恒等、**层级守卫：strand 拖到树杈节点必须被拒**、clump 拖拽路径未回归 |

### 阶段 4：UI 控件 + 版本 bump（**主脑亲自做，不派**）

理由：D4/D5 的控件落点是用户可见改动；版本 bump 有 §1.4 的 8 处同步点与转义陷阱，
且记忆明载「子智能体两次都漏了 `?v=` bump」。**主脑必须自己 grep 全部 import 站点。**

### 7.1 派发时必须写进每个子智能体提示的硬约束

- 单次 write ≤150 行/8,000 字符；edit 的 old/new 各 ≤50 行/4,000 字符；超了先写骨架再分块；失败不原样重试。
- 写完长 JS 跑 `node --check`。全仓 UTF-8 无 BOM，含中文优先用 write/edit 工具。
- `git`/`node`/`npm` 必须是命令第一个 token，**不要写 `cd <dir>; node …`**。
- 空 grep 一律加「必然存在的真键 + 必然不存在的假键」双向对照才能下结论。
- **新增 named export 后必须报告**，主脑会自己 grep 全部 import 站点的 `?v=`。
- 遇阻**直接结束对话**并把问题写成主脑能一句话回答的 A/B，**不得使用提问工具**。

## 8. 验收判据（全部**幅度**判据；每条先做变异验证证明它会咬）

| # | 判据 | 变异验证（人为制造错误确认会变红，再还原） |
|---|---|---|
| V1 | `node --test "tests/*.test.mjs"` ≥ **431 pass / 0 fail**（新增测试后总数上升） | 把 `MAX_PANEL_BONE_DEPTH` 改成 4 ⇒ 深度 5 的测试必须红 |
| V2 | **旧档零损**：真实档读入→存出，`splitBones`/`panelSplits` 逐字段 deep-equal | 故意让归一化给 `panelSplits` 补一个默认分组 ⇒ 必须红 |
| V3 | **分组变更后渲染几何逐字节相同**（分组模型的核心不变量，比原先 1e-6 阈值更强）：拖拽改分组前后导出同一档，顶点 buffer `Buffer.compare === 0` | 让分组变更顺带改一个叶子 `position` ⇒ 必须红。**这条是「保持视觉上效果不变」的机械化判据** |
| V3b | 分组树为空 vs 全叶子平铺在 L2：两者几何逐字节相同 | 让空分组走另一条采样路径 ⇒ 必须红 |
| V4 | 遍历序是**根→叶**：构造 3 层树，断言父节点的重建早于子节点 | 把遍历改成叶→根 ⇒ 必须红 |
| V5 | 钻取手感：t=0.3 命中保持母层级、t=0.7 命中进入子层级（各断言一次） | 把阈值改成 0.9 ⇒ t=0.7 的断言必须红 |
| V6 | 普通发丝**完全未受影响**：`STRAND_SEGMENT_HOST` 相关测试全绿且 `strandSplitBones` 序列化字节级不变 | 故意让 `segmentBoneHost` 把 strand 也分派到 panel 宿主 ⇒ 必须红 |
| V7 | 版本 bump 8 处全中（含转义那处） | 只改 7 处（漏 L2703）⇒ dom-contract 必须红 |
| V8 | **层级拖拽守卫**：strand 拖到树杈节点被拒、树杈节点拖到 strand 被拒（各断言一次）。用 `Test 2.ahs`（同档内既有 panel 又有 strand） | 摘掉守卫 ⇒ 两条必须红 |
| V9 | **上游 clump 拖拽未回归**：`handleOutlinerClumpDrop` 路径行为不变 | 让守卫误拦 clump 拖拽 ⇒ 必须红 |
| V10 | **派生规则**（§5.2）三条：`[0.3,0.3]` → L2 两平级兄弟（**不是**两层）；`Test 3` 的 5 档位 → 并入第 5 层不丢数据；已有 `panelBoneGroups` 时**不重新派生** | 让 height 相同也递归分层 ⇒ 第一条必须红 |

**V2/V3 必须用用户提供的真实档**，不要只信 node fixture —— 既有先例：fixture 曾把行交叉低估 2.4 倍。

## 9. 已知未解项（本轮**不**处理，避免夹带）

1. **bug2「panel 与发尖根部交界不平滑」** —— 用户已明确延后。本轮只建立「深度排序重建」机制（§2.4），
   **不修**锚点冻结（`tip-width-curve.js:260`）与派生锚点被钳到 `[0.08, 2]` 这两条独立机制。
2. **N 叉的「对侧」语义** —— `[-1, 1].forEach` 的二元 side 假设（`bone-interaction.js:839` 等多处）
   在真 N 叉下需重新定义。本轮树的每个节点仍按二元 side 处理。
3. **紫色 3D 手柄只枚举 lock 层**（`taper-editor.js` 的 `addTaperMeshPointsForCurve:387-390`）
   —— 树化后深层节点的紫色手柄仍不可见。0.2.151 已刻意留此缺口（用户未要求新增可见控件）。
4. **几何是全量重建，无增量** —— `rebuildLockGeometry`（`app.js:12616`）改一个曲线点也整张 mesh 重算
   （`panel-tip-strand.js:1141` 双重循环）。5 层树会放大这个成本，但本轮**不做**增量优化；
   若真机出现卡顿再单独立项（探针见 §10 P4）。
5. **`branchParentId` 链的深度上限** —— 全仓库无上限校验且**无环检测**。本轮不碰 branch 系统，
   但这是一个独立的既有风险，值得单独立项。
6. **紫色笔刷无 rAF 节流** —— 既有缺口，树化后每笔触及的节点更多，可能恶化。本轮不处理。

## 10. 探针清单（收尾时删除，结论留在正文）

| # | 探针 | 目的 |
|---|---|---|
| P1 | `scripts/probe-bone-tree-depth.mjs` | 构造 L1~L5 树，打印每层 fork T、段数、控制点 t 分布 |
| P2 | `scripts/probe-old-archive-roundtrip.mjs` | 真实旧档读入→存出，逐字段 diff（钉 V2） |
| P3 | `scripts/probe-rebuild-order.mjs` | 打印实际重建顺序，验证根→叶（钉 V4） |
| P4 | `scripts/probe-rebuild-cost.mjs` | 5 层树单次曲线编辑的重建耗时，判断 §9.4 是否需立项 |

## 11. 真机验收素材（**已就位，主脑亲自读过**）

用户授权使用 `D:\Downloads` 下的四个存档（全部 `format: anime-hair-studio-project` / `version: 1`，**旧版档**）。
**临时工程区放在仓库之外**：`.gitignore` 实测**只有一行 `node_modules/`** ⇒ 仓库内建 `.tmp-*`
会变成未跟踪文件污染 `git status`（本仓已有 182 个 CRLF 噪音 M，不要再加噪音），
且加 `.gitignore` 规则属于无关改动。⇒ 临时件一律放**仓库外**的工作目录，仓库保持干净。

| 档 | locks | panel（≥2 zipper） | 用途 |
|---|---|---|---|
| `Scalp Conform Test 1.ahs` | 1 | Side Bangs Left 1：2 zipper `[0.3, 0.3]`（**全等**） | 派生规则的「height 相同留同层」用例；`splitBones` 非空 ⇒ V2 旧档零损 |
| `Scalp Conform Test 2.ahs` | 2 | Front Bangs 1（panel）+ Side Bangs Right 1（**strand**），各 2 zipper | **层级守卫用例**：同档内既有 panel 又有 strand ⇒ 验证两套拖拽互斥 |
| `Scalp Conform Test 3.ahs` | 1 | Front Bangs 1：**5 zipper 5 个不同档位** | **撞 5 层上限**的天然用例（§5.2 规则 5）；`splitBones` 非空 |
| `Sussurro_v1_0060.ahs` | **26** | Front Bangs 1/2/3 各 4/3/4 个不同档位；另有 **3 个 `branchParentId`** | 规模用例 + V3 字节级几何不变；含 branch 链 ⇒ 验证不误伤 branch 系统 |

**四个档全部 `panelSplits` 非空、`splitBones` 多为空**（走运行时派生默认值路径）⇒ 正好覆盖
`splitBonesFor` 的两条分支（stored 命中 / 回落派生）。

**引用这张表的诚实边界**：以上是**存档里的静态数字**，不是跑过几何的结果。V3 的字节级比对必须真的
把档读进应用、导出顶点 buffer 比对，不能只比 JSON。
