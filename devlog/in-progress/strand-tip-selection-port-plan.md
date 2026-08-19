# 发尖子骨骼「选中系统」移植到普通发丝：实施计划

> **状态**：实施中（0.2.126 起）。用户报告「选不中普通发丝 zipper 分出的子发尖，更别说进一步控制」，并明确决定：**以 panel 的操作方式为准**（开发期主要在 panel 上工作，导致普通发丝进度大幅落后），**一批做完**。
>
> **本文档的定位**：0.2.125 的 `strand-tip-width-ui-port-plan.md` 移植的是「发尖**宽度曲线**」；本文档移植的是「发尖**选中与控制**」——两者正交。上一轮 Phase D **刻意没做**选中状态（只复用 `strandSegmentIndex` 做 WidthCurve 把手的可见性门控），本轮就是补这个缺口。

## 0. 一句话结论

**这不是造新功能，而是把只写在 panel 分支里的选中系统抽成几何无关的单点定义。** 根因与 0.2.124 的 `strandSplitDirection`（被复制三份）同类：**发尖选中逻辑当初只写在 panel 分支里、没抽成单点定义，所以发丝侧永远追不上**。

## 1. 主进程实测核实的缺口（非推测）

| 能力 | panel | 发丝管（split tube） |
|---|---|---|
| 独立选中状态 | `sculptState.panelTipSelection = {lockId, segmentIndex}`，与主选中并存、再点一次退回主选中 | **无** |
| 悬停状态 + 表面高亮 | `panelTipHover` + `panel-tip-strand.js` `updateTipHighlight` | **无** |
| 每链点把手 | 每段 `lock.points.length` 个（`bone-view-handles.js` 每链点一个 + 法线箭头） | **只有 1 个**（管尖端） |
| 旋转模式法线箭头 | 每个暴露链点一个 `createCurveNormalIndicator` | **无** |
| gizmo 挂接（move/rotate/scale） | `bone-interaction.js` `panelTipIndex` 分支：挂 `transformControls`，增量走 `applyTipSubBoneTransform` | **无**，只能视平面拖最后一个点 |
| 笔刷雕刻子骨骼 | `applySubBoneBrushSample`，**硬门控 panel**（`isPanelGeometry` + `clonePanelSplits`） | **无** |
| alt+点快切到悬停子发尖 | `app.js` 有 | **无** |
| 点本体切换选中（toggle） | `app.js` 有 | **无** |
| 切换 lock 时清理悬空选中 | `app.js` 有 | n/a |

## 2. 关键有利事实（**已实测**，让本移植成为「放宽门控」而非「造新机制」）

主进程写探针直接跑真实几何管线验证，**不是读代码推测**：

1. **`createSplitStrandGeometry` 已经输出 `leafWeights`**，与 panel **同格式**（stride-3 `[mainJoint, leafIndex, weight]`，`strand-geometry.js` 里同时别名为 `strandSplitWeights`）。实测（16 点圆 profile + 拉链 ±0.4，3 管）：
   - `leafWeightsValid(lw, position.count)` → **true**
   - 长度 `1248 === position.count * 3` → **true**
   - `leafIndexAt` 在全部顶点上返回的 distinct 值 = `{0, 1, 2}`，**恰好覆盖 3 根管**，越界数 **0**
   - 结论：**悬停命中测试（`leafIndexAt`）在发丝上开箱可用**。
2. **`updateTipHighlight` 读 `leafWeights` 是泛化的**，只有函数开头的 `deps.isPanelGeometry(lock)` 把发丝挡在外面。

⇒ 悬停、表面高亮、点本体 toggle 三块**放宽门控即可**，不需要新的命中测试机制。

## 3. 硬约束（都是本仓库踩过的坑，违反会复发已修 bug）

1. **0.2.120 物化空间规则**：任何读取发尖绝对位置的编辑路径（拖拽、笔刷、gizmo、求解器）**必须**从物化链取值（`currentStrandSplitTipChains` / `materializeTipChain` 的 `points`），**不得**读 `authored.points`。读 authored 再把 `restPoints` 重基准 = 销毁 delta，症状是**发尖一动就跳回原位、跳回量恰等于 rest 位移**（bug-fixes.md #16 的原样复发）。**必须配负向对照测试**。
2. **绝不对发丝调 `clonePanelSplits`**：它会回退出一套与真实拉链无关的**假 panelSplits**（两条 position ±1/3 + panel 默认 height）。本轮已因此踩过两次（Phase C 的曲线暴露判定、Reset 按钮）。发丝一律走 `strandSplitsFor`（排序 + 钳制 + legacy 单标量回退，与几何段划分同真源）。
3. **不得新增第二条 fork / 暴露 / 管内坐标 / 段数规则**。既有单点定义：`strandSplitForkTForSegment`（bone-model）、`strandTubeForkT`/`strandTubeSideForkT`/`strandTubeSignedCoordinate`（strand-tip-width）、`tipWidthSideExposesTAt`（tip-width-curve）、`resolveSegmentSelection`/`segmentBoneHost`（bone-model）。
4. **管的左右侧不得用 raw `profile.x` 判定**（0.2.125 实施期修正）：裁剪后每根管 raw x 只有一个符号，用它会让一侧永不生效 = panel 0.2.80 死区同类。用 `strandTubeSignedCoordinate`。
5. **panel 行为必须逐值不变**，既有 panel 断言一条不改即为证明。

## 3.5 `applyTipSubBoneTransform` 必须泛化（主进程已核实，非推测）

gizmo 挂接后的增量应用走 `bone-interaction.js` 的 `applyTipSubBoneTransform`（唯一调用点：`app.js` 的 `objectChange`）。它**三处 panel 专有**，直接复用会对发丝错得很隐蔽：

| 位置 | panel 写法 | 发丝对应物（已存在，勿另写） |
|---|---|---|
| 读 userData | `handle.userData.panelTipIndex` / `panelTipPoint` | 发丝把手的键（本移植新增，须与 panel 同形以便共用命中/拖拽路径） |
| 取 splits | `deps.clonePanelSplits(...)` ← **对发丝是禁用路径**（造假 panelSplits） | `strandSplitsFor(lock)` |
| 取骨骼 | `materializeSplitBones(lock)` | `materializeStrandSplitBones(lock)` |
| 取 fork | `deps.panelTipStrand.splitForkT(lock, segment, splits)` | `strandSplitForkTForSegment(lock, tubeIndex)` 或 `strandTubeForkT(splits, tubeIndex)` |

`firstBelow` 的 `floor` 取整 + 下界钳 1（链根钉在主链上、永不被拉）是 0.2.119 的既定规则，**两侧必须同规则**——发丝侧不得改成 `ceil` 或去掉钳位（`tipChainNearestIndex` 不同步会让蒙皮绑到不存在的关节，bug-fixes.md #15）。translate 分支用 `solvePulledStrand` 把暴露子链整体求解、根点钉在 fork 处，这套数学与几何无关，**原样复用**。

## 4. 选中状态的两种方案（实施者须明确选择并在注释里论证）

- **(a) 新增 `strandTipSelection`**，形状照抄 panel。改动局部，但**清理路径 / 高亮路径 / 笔刷门控各要写两份**——正是本移植要消除的那类重复。
- **(b) 把 `panelTipSelection` 泛化成几何无关的单一键**，两侧共用。清理、高亮、笔刷门控各只有一份（符合「一条推导规则只准有一个定义点」），代价是触及全部既有 panel 消费方，**必须**用未修改的 panel 断言证明行为不变。

无论选哪个，都要说清「**选中的子发尖**」与「**当前段号**（Phase C 的 `strandSegmentIndex`，驱动右侧面板）」在两侧各自的关系——它们语义不同，混用会让切换对象时段号互相污染。

### 4.1 实施结论：选了 (b)（0.2.126，主进程已核实落地）

`panelTipSelection` / `panelTipHover` **改名为几何无关的 `tipSelection` / `tipHover`**（`modules/edit/sculpt-edit-store.js`），形状恒为 `{ lockId, segmentIndex } | null`，其中 `segmentIndex` 在 panel 上是段号、在普通发丝上是管号，**含义由 `segmentBoneHost` 决定**。

选 (b) 的理由（写在 store 的定义处）：清理路径（`selectLock`）、表面高亮（`updateTipHighlight`）、笔刷门控（`applySubBoneBrushSample`）与 `tipUiActive` **各自只有一份实现**；若用两套 panel/strand 键，这四处都会长出 `if(几何)` 分叉——正是本移植要消除的那类重复。

**与段号的关系（必须记住，两者极易混淆）**：

| | `tipSelection` | `panelSegmentIndex` / `strandSegmentIndex` |
|---|---|---|
| 语义 | 视口里**选中了哪个发尖子骨骼** | 右侧面板**当前显示哪一段** |
| 可否为 null | 可（null = 未选中；点同一处再点即取消） | 否，恒非 null 且被 `resolveSegmentSelection` 钳位 |
| 联动 | 选中发尖会顺带把对应段号指过去 | 取消选中**刻意不**回退段号（沿用 panel 既有手感） |

**另新增单点定义 `tipChainPointCount`**（加进 `PANEL_SEGMENT_HOST` / `STRAND_SEGMENT_HOST` 描述子）：发尖链点数。两种几何的发尖链都复刻主链拓扑（同点数），但**下限不同**——panel 允许 0（主链不足 2 点时整段没有可编辑发尖，`splitTipForSegment` 也返回 null），发丝的 `materializeTipChain` 内部是 `Math.max(2, count)`、传 0 会造出与视口不一致的 2 点链。把手分配、链物化、笔刷区间三处一旦不同源就会「手柄比链点多/少」→ 越界或漏点，故统一读此处，禁止就地写 `lock.points.length` / `Math.max(2, ...)`。

## 4.2 「panel 行为不变」的独立证据（主进程自跑，不只信子智能体报告）

把 `panelTipSelection` 泛化成 `tipSelection`、把把手分配改成两几何共用，触及了全部既有 panel 消费方，所以「panel 不变」必须**拿证据**而非依赖套件全绿。主进程写探针把**改动前 HEAD** 的 `bone-model.js` 拉出来（放进仓库树内才能解析裸 `three` 导入）与当前版本逐项对比：

| 检查项 | 结果 |
|---|---|
| `splitBonesFor(lock)` 输出（4 种 panel 形态：无 split / 1 split / 2 split / `surface`） | **逐值相同** |
| 新的 `segmentBoneHost().segmentCount()` vs HEAD 的内联规则 `panelSplits.length + 1` | **恒等**（1/2/3/2） |
| `mirrorSplitBones` | **逐值相同** |
| `resolveSegmentSelection` 的 panel 索引钳位（喂 `-3 / 0 / 1 / 2 / 99 / 1.6 / NaN`） | 全部落在 `[0, count-1]` 内 |

**注意**：`segmentBoneHost` / `resolveSegmentSelection` 在 HEAD **并不存在**（本会话 Phase C 才引入），所以对它们无法做「改动前 vs 改动后」对比——只能验证它们**复现** HEAD 当时的内联规则。这一点写在这里，避免后人误以为做过更强的对比。

## 4.3 顺带发现并修掉的 **panel 侧潜伏 bug**（0.2.126，非本移植目标，但同属 #16 类）

实施 gizmo 分派时发现：**panel 自己的 gizmo rotate/translate 一直把 `bone.tip.points` 当拖拽种子**，而 `handle.position` 与 gizmo 增量都在**物化空间**。`authored.points` 是**旧 rest 基准**下的陈旧绝对坐标，只要 rest 自上次创作后动过（主链编辑 / zipper 位置或高度 / spread / 面板宽度 / 发丝 Split Spacing 都会动 rest），两者混用就会**一按下即跳**，跳量恰等于 rest 位移 —— 与 bug-fixes.md #16（笔刷）**同一类**，只是当年只修了笔刷、没查 gizmo。

修法：把取种子/写回集中成 `tipDragSnapshot(tip)` / `writeTipEdit(bone, points, restPoints)` 两个单点定义，`startPoints`/`restPoints` **成对取自同一次物化**，写回时 `points` = 物化空间编辑结果、`restPoints` = 同批 rest（两行必须成对，单独改 `points` 会让 delta 相对旧 rest 被重新解释）。

**主进程独立验证了「对既有 panel 工程无影响」这条关键论断**（探针直接调 `materializeTipChain`）：

| 场景 | 结果 |
|---|---|
| rest **未动** | 物化值与 `authored.points` **逐值相同**（max 差 = `0.000000000000`）⇒ 种子切换是**恒等**，既有工程行为不变 |
| rest 移动 y+0.2 | 物化值与 authored 的偏差 **在全部 4 个链点上恰为 (0, 0.200000, 0)** ⇒ 正是旧写法会产生的跳变量 |
| 创作 delta（点 2 的 +0.5 x） | rest 移动后**仍被保留** |

这条同时解释了为什么该 bug 长期没被发现：**只有在 rest 动过之后才复现**，而单独调 gizmo 不动 rest。

## 4.4 收口清单：本轮改动的模块与待 bump 的 `?v=` 边（主进程审计脚本产出）

主进程用解析式审计脚本（反转义 dom-contract 的冻结正则 + 收集全树实际 tag + 按 mtime 判定「本轮是否改过」）得到下表。**审计脚本不可省**：朴素 `Select-String "foo.js?v="` 匹配不到测试里的转义写法 `foo\.js\?v=`，上一轮差点因此漏掉一条真实冻结断言、让套件变红。

**本轮（0.2.126）改过的模块，其导入边需定点 bump**：
`bone-interaction.js`、`bone-model.js`、`bone-view-handles.js`、`segment-control.js`、`sculpt-edit-store.js`、`draw-flow.js`、`panel-tip-strand.js`、`poly-tools.js`、`strand-geometry.js`、`taper-editor.js`、`tip-sub-bone.js`、`project-files.js`、`usda-export.js`，外加**新增**模块 `tip-sub-bone-host.js`。

**刻意不动**（本轮未改，mtime 早于本轮）：`app-config.js`（只改 APP_VERSION 常量本身）、`loc-ja/zh.js`、`localization.js`、`shape-presets.js`。

**两处「同名多 tag」经核实均属正常，不是半途 bump**：
- `shape-presets.js` —— `modules/io/shape-presets.js` 与 `modules/data/shape-presets.js` 是**两个不同文件**恰好同基名。
- `usda-export.js` —— 双 tag 自本轮之前即存在（0.2.125 已核实 HEAD 即如此），不顺手改。

## 5. 验收基线

- Node 全量：**332/332**（0.2.125 收口值）
- 真实工程 `D:\Downloads\Sussurro_v1_0060.ahs`：**130/130**（24 split 骨骼 / 3 桥接子发片）
- 真实浏览器 `scripts/verify-uv-pack-real.mjs`：**7/7**，含 **0 page exceptions**（这条同时守 `?v=` 缓存号：改错任一处会表现为 import 失败）
- ⚠️ `tests/uv-pack-async.test.mjs` 是**负载相关 flake**（Worker 池单条最慢约 14s），并行跑子智能体时可能报**恰好 1 条** fail，重跑即绿——**先重跑再怀疑代码**。

### 5.1 实施后实测（0.2.126 落地值）

| 项 | 结果 |
|---|---|
| Node 全量 `node --test "tests/*.test.mjs"` | **342/342**（332 基线 + 本轮 10 条新用例），0 fail，未出现 flake |
| 真实工程 `verify-skeleton-layout.mjs` | **130/130**（24 split 骨骼 / 3 桥接子发片），与基线一致 |
| 真实浏览器 `verify-uv-pack-real.mjs` | **7/7**，**0 page exceptions** ⇒ 本轮 24 条 `?v=` 边全部解析成功 |
| 自守卫负向对照 | **12/12 全部被抓**（逐条还原实现后跑套件，见下表） |
| 真实浏览器 `verify-tip-select.mjs` | **47/51**，0 page exceptions；4 条失败经查证为**上一轮（0.2.125）留下的过期断言**，见 §5.2 |

**负向对照明细**（每条都是「把实现改回错的写法 → 确认对应断言变红 → 还原」）：

| # | 还原的实现 | 被哪条断言抓住 |
|---|---|---|
| G1 | 暴露判据 `floor` → `round` | `frac 0.8 still floors down` + 深浅非对称断言（2 条） |
| G2 | 暴露判据下限 `1` → `0`（链根变可编辑） | `fork at the root still keeps index 0 pinned` |
| G3 | 发丝链点数去掉 `>= 2` 下限 | `tipChainPointCount({points: []}) === 2` |
| G4 | 笔刷门控改回 panel-only | `the brush gate dispatches through the tip host` |
| G5 | 拖拽种子改回 `bone.tip.points`（0.2.120 违规） | `the drag snapshot takes points AND rest from the same materialization` |
| G6 | 高亮门控改回 `isPanelGeometry` | `updateTipHighlight gates on segmentBoneHost` |
| G7 | 悬停门控改回 panel-only | `updatePanelTipHover gates on the tip host` |
| G8 | 删掉发丝删管路径的悬空选择清理 | `a selection addressing tube 3 must be dropped` |
| G9 | 发丝把手退回「每管 1 个」 | `strand chain length from the host` |
| G10 | 管数退回就地 `lock.strandSplits.length + 1` | `creation must size ... by the host tube count` |
| G11 | 引导线自写一份 floor 暴露表达式 | `handle visibility and the guide line slice both call the single exposure function` |
| G12 | 重新引入平行键 `strandTipSelection` | `no parallel strand-only tip selection key was added` |

**测试用例本身的一处教训**（写进这里以免复发）：仓库 `core.autocrlf=true` ⇒ 工作树 CRLF。用正则切函数块时，**前导** `\n\}` 安全（`\r` 被 `[\s\S]*?` 吃掉），但结尾再跟一个 `\n` 必须写 `\r?\n` —— 否则 `\r\n}\r\n` 里 `}` 后是 `\r`，整条 match 返回 `null`，`?? ""` 让负向对照对空串做 `doesNotMatch` **恒过**（本轮实测踩过一次，已改为同时断言抓到的块行数 > 150）。既有 4 处只用前导 `\n\}` 的写法经核实**均正常**，不是同类问题。

### 5.2 `verify-tip-select.mjs` 的 4 条失败：过期断言，非本轮回归（已查证，非推测）

**先说本轮真正抓到的 bug**：该脚本第一次跑时 **6 条**失败，其中 3 条（scale / orient / push 三支笔刷全部「位移为 0」）+ 1 条 page exception 是**本轮引入的真 bug**：

> `createTipSubBoneHostApi({ panelTipStrand: deps.panelTipStrand, ... })` 把 `deps.panelTipStrand` **急切快照**了下来。但 `createBoneViewHandlesApi` / `createBoneInteractionApi` 在 `app.js` **顶部**就被构造，`deps` 要到后面的 `Object.assign` 批次才填满 —— 于是快照到 `undefined`，`chainFrameAt` 一调用即 `TypeError`。修法：五项全部惰性（函数用箭头包一层、对象用 getter）。**node 测试抓不到这类时序 bug**（不执行视口代码），这条完全靠真实浏览器暴露 —— 记在这里作为「浏览器验收不可省」的实证。

修完后剩 4 条，全部落在**发尖宽度 Reset / 浮动曲线编辑器**，与选中系统无关。主进程写探针直接调 `tip-width-curve.js` 的真实函数复核（真实档 Front Bangs 1 段 1 现场值：两侧 fork = 0.6875 / 0.5）：

```
shared grid:        [0.55, 0.65, 0.75, 0.85, 0.95, 1]
side -1 exposed ts: [0.75, 0.85, 0.95, 1]        (浅侧 4 个)
side +1 exposed ts: [0.55, 0.65, 0.75, 0.85, 0.95, 1]  (深侧 6 个)
reset 曲线位置:      [0, 0.5]
本侧(0.5) 有点 -> true      另一侧(0.6875) 有点 -> false
```

⇒ 共享网格按**最深** fork span 细分，**刻意不保证**浅侧自己的 fork 位置上有控制点。而脚本的
`hasBothForks = forkTs.every(fk => curve.some(p => |p.position − fk| < 1e-4))` 要求**每侧各自 fork 上都有点**——那正是 **0.2.118 的旧模型**，已在 0.2.123 被明确推翻（规范表「发尖 WidthCurve 共享网格」行写着「勿改回」）。同理 `lockedGlobal` 那条：`t = 0.5` 恰是右侧 fork，0.2.119 起 **fork 行本身属于暴露区**（`>= sideForkT − 1e-4`），所以该点取 bone 曲线（Reset 后 = 1）而非全局曲线——脚本仍按 0.2.119 之前的严格不等号期望。

**归属证据**（三条独立）：① 这 4 条依赖的 reset/grid 数学全在 `modules/geometry/tip-width-curve.js`，该文件是上一轮新增的**未跟踪**文件，mtime 早于本会话、本轮从未打开；② 本轮对 `panel-tip-strand.js` 的改动只有 `updateTipHighlight` 的门控 + `segmentBoneHost` 导入 + 缓存号，`taper-editor.js` 只改了缓存号；③ 脚本自身上次更新在 **0.2.123**（`cde3fd8`），上一轮计划文档 §7 明确记着 Phase D「进行中」、Phase E 的 `verify-tip-select.mjs` 扩展「未做」——即这 4 条自 0.2.125 起就未被跑过。

**处置：刻意不改这 4 条断言**。它们属于上一轮 Phase D/E 的收口范围（把断言更新到共享网格模型），本轮若顺手改就是把「修 bug」和「改别人未完成阶段的验收口径」夹带在一起，违反规范「修 bug 不夹带设计变更」。**已上报主进程决定**。

### 5.3 本轮同批改到的验收脚本（键名改名的连带项）

`scripts/verify-tip-select.mjs`（41 处）与 `scripts/repro-0045-bugs.mjs`（8 处）直接经 CDP 读写 `window.__ahsTest` 的 store 与 `curveObjects`，键名漏改会**静默失效**（读到 `undefined` 而非报错，断言变成对 `undefined` 求值）。因此六组键名与实现同批改：`panelTipSelection→tipSelection`、`panelTipHover→tipHover`、`panelTipHandles→tipChainHandles`、`panelTipLines→tipChainLines`、`panelTipIndex→tipSegmentIndex`、`panelTipPoint→tipChainPoint`。

## 6. 仍需人眼验收（脚本判不了）

- 选中/悬停高亮的观感、每链点把手的可抓性与遮挡、gizmo 在发尖上的手感。
- **本轮新增的一条设计判断需人眼确认**：选中发丝发尖后，该发丝的 zipper 手柄（粉球）会隐藏，取消选中即恢复 —— 这是**照 panel 同规则**加的（panel 早有 `!tipUiActive`），理由是新增的每链点把手与宽度控制点会与 zipper 球抢拖拽。若实际手感上更希望 zipper 常显，这条要单独提出（属设计变更）。
- 0.2.125 遗留：Reset 后 fork 处的宽度阶跃在闭合管上是否观感明显（见 `strand-tip-width-ui-port-plan.md` §6.6）。
