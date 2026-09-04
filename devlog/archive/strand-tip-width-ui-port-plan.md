# 发尖 WidthCurve UI 移植到普通发丝：实施计划

> **状态**：**已落地（0.2.125）**，2026-09-04 归档。原头部写「实施中」已滞后。本文档供新对话直接照做——目标是把 panel 的发尖 WidthCurve 系统（绿色控制点 + 共享网格按侧动态暴露）移植到普通发丝（ordinary strand），要求**适配发丝自身的生成行为**、**最大化代码复用**、**不破坏 UV**。
>
> **⚠️ 实施期修正（0.2.125 主进程实测）**：§1.1 原写「按 profile 点的 `x` 符号判定左右侧」——**这条是错的**，照做会产生死区。管的 profile 被 `clipStrandProfileBand` 裁成子多边形后，**每根管的 raw `x` 只有一个符号**（实测圆形 profile + 拉链 ±0.4：管 0 的 x 全为负、管 2 全为正，只有中间管跨 0）。若用 raw `x` 当 `signedCoordinate`，边缘管会整管只采到一侧曲线、另一侧曲线永不生效——与 panel 在 0.2.80 修掉的「不跨 0 段曲线动了发丝不动」**是同一类 bug**。正确做法与 panel 修复后完全同构：用**管内相对坐标** `(x − tubeCenterX) / tubeHalfSpan ∈ [-1, 1]`（tubeCenter/HalfSpan 取该管**裁剪后实际** x 极值，边缘管的 ±Infinity 边界要先与 profile 的 minX/maxX 取交）。详见 §4 Phase B。
>
> **前置事实**：0.2.116 已把 zipper 移植到普通发丝（N 拉链→N+1 管），0.2.124 修掉了「只有一条缝张开」。0.2.117 骨骼重映射 / 0.2.119 每段 fork / 0.2.120 物化空间 **strand 侧已具备，勿重复移植**。当前唯一缺口就是本文档要做的 WidthCurve UI。

## 0. 一句话结论（先读这条）

**这不是从零造功能，而是把 panel 的「每段骨骼曲线覆盖全局曲线」语义接到发丝已有的 `strandRadiusAt` 采样链上。** 发丝早已支持「按行、按侧」调宽（全局 taper + `asymmetricWidthCurve`），移植的本质是让**每段（每管）的 bone 曲线在该段 fork 以上覆盖 lock 级曲线**。UV 经核实**天然安全**（见 §3），不需要为 UV 做任何特殊处理。

## 1. 两边几何的本质差异（决定移植语义）

| | panel（已实现） | ordinary strand（要移植） |
|---|---|---|
| 形态 | **扁平 ribbon**，横向由 `u ∈ [-1,1]` 参数化 | **闭合管**，profile 多边形被 zipper 在 x 处裁成 N+1 个子多边形后各自扫掠 |
| 「宽度」含义 | 左右**边缘 u 位置**（`tipWidthEdgePosition`），曲线直接决定 ribbon 的横向延展 | profile 多边形在 **x 方向的缩放**（`strandProfileTopologyAt` 里 `profile.x * strandRadiusAt(...)`） |
| 每段是否已有独立曲线 | 有：`bone.taperCurve` / `bone.taperCurveSecondary`（每 split 段一套） | **有数据层没 UI**：`strandSplitBones[i]` 由 `remapSegmentBonesOnInsert/Delete` 维护，字段含 `taperCurve`/`taperCurveSecondary`/`asymmetricWidthCurve`，但**几何完全没读**（见 §2.1） |
| 采样入口 | `tipWidthMultiplierAt(lock, t, u, bone, segmentIndex, splits)` | `strandRadiusAt(lock, t, axis, radiusScale, signedCoordinate)`（app.js L7554） |

**关键结构对应（复用的支点）**：`strandRadiusAt` 内部就是
```js
sampleAsymmetricTaperCurve(shapeCurve, secondaryCurve, asymmetric, signedCoordinate, t)
```
（app.js L7555-7565），与 panel 的 `tipWidthMultiplierAt` 末尾调用**同一个函数、同一套语义**（`signedCoordinate` 的符号即左右侧）。所以移植不需要新的数学，只需要**在该处按段替换曲线来源**。

### 1.1 推荐的移植语义（管的「每侧宽度」）

发丝的管是闭合截面，「左右侧」按 profile 点在**该管内**的相对横向位置判定（`(x − tubeCenterX)/tubeHalfSpan`，见上方「实施期修正」——**不是** raw `x` 符号）。语义定为：

> 对管 `i` 的顶点，在 `t > sectionSplitStart_i`（该段 fork 以上，即已张开的发尖部分）时，`x` 方向的半径改由 **`strandSplitBones[i]` 的曲线**采样；`t <= fork` 时仍用 lock 级全局曲线。

理由（三条，缺一不可）：
1. **与 panel 语义同构**：panel 的 `tipWidthMultiplierAt` 正是「`t < 本侧 fork` 回退全局曲线，否则用 bone 曲线」（panel-tip-strand.js L358-360 附近）。同构才能共用曲线构建/暴露/编辑器逻辑。
2. **拓扑零变化**：只改 `warped.x` 的数值，不动 `section.points.length`（ringSize）、不动段数、不动索引流 → 满足 §3 的 UV 契约。
3. **在 fork 处天然连续**：fork 处 bone 曲线的 fork 锚点值取自全局曲线采样（panel 的 `buildTipWidthCurve` 已如此做），所以切换点不跳变、zipper 不开裂。

**⚠️ 不要做的两件事**：
- **不要**去改 zipper 的 seam 边（裁剪产生的那条竖直边）的 x 位置。那会改变管的截面形状与相邻管的贴合关系，且 seam 列是 `uv-unfold` 计算 U 的**起点**（`l=0` 即 clip seam 点，uv-unfold.js L142-143）。宽度只应缩放 profile，不应移动裁剪边界。
- **不要**把宽度做成整管平移（那是 `direction`/`opening` 的职责，0.2.124 刚修过）。宽度是**缩放**，张开是**平移**，两者必须分开。

## 2. 现状盘点（移植要碰的每一处）

### 2.1 几何侧（核心，改动最小）

| 位置 | 现状 | 要做什么 |
|---|---|---|
| `app.js` L7554 `strandRadiusAt` | 只读 `lock.taperCurve`/`taperCurveSecondary`/`asymmetricWidthCurve` | 增加可选的「曲线覆盖」入参（见 §4 Phase B），**默认行为逐字节不变** |
| `app.js` L7571 `strandProfileTopologyAt` | 调 `strandRadiusAt` 得到 x/z 半径；已读 `lock.asymmetricWidthCurve`（L7593） | 需要能把「当前是哪一段 + 该段 bone」传进去 |
| `strand-geometry.js` L235 调用点 | `deps.strandProfileTopologyAt(lock, t, section.points, scaleX, scaleZ, polygon)` | 补传 `sectionIndex` / `bone` / `sectionSplitStart`（该函数已在段循环内，信息现成） |
| `strand-geometry.js` L244-250 | 已按段取 `splitBones[sectionIndex].spread` 与 `section.sectionSplitStart` | **这就是证明**：段级 bone 与 fork 在几何里已经可得，宽度只是多用一个字段 |

> **重要**：`strandSplitBones[i]` 的 `taperCurve`/`taperCurveSecondary` 字段**已经存在并已参与持久化与重映射**（bone-model 的 `cloneSegmentBone` 深克隆它们）。所以 Phase A 的「数据层」几乎是空的——不需要新字段、不需要迁移。

### 2.2 视口把手（照 panel 镜像）

`modules/bones/bone-view-handles.js`（747 行）：
- **创建**：L143-181。每段 × 每侧固定分配 `TIP_WIDTH_CONTROL_POINTS + 1` 个把手（对应**完整共享网格**），`userData` 打 `tipWidthSegment` / `tipWidthSide` / `tipWidthIndex`（L163-165）；`tipWidthLines` 每段每侧一条（L175-176）。
- **更新**：L485-517。可见性门控当前含 `deps.isPanelGeometry(lock)`；位置取自 `tipWidthControlPlacement`，返回 null 即隐藏（**这就是「按侧动态暴露」的机制**）。
- **释放**：L700-707。

移植要点：把手数组结构**完全可复用**（同样是「段 × 侧 × 完整网格索引」）；改动集中在**门控条件**（panel → panel 或 strand）与**取 placement 的函数**（panel 版 → 按类型分派）。

### 2.3 拖拽（照 panel 镜像）

`modules/bones/bone-interaction.js`（939 行）：
- 命中与起始状态：L197-238，`tipWidthStartMult` 由 `tipPanelWidthAt(...) / fullWidth` 得到（L238），`edgeU` 取段边界（L236）。
- drag 状态字段：L277-282（`tipWidthSide` / `tipWidthIndex` / `tipWidthT` / `tipWidthStartMult` / `tipWidthStartWorld` / `tipWidthStartLatOffset` / `tipWidthStartClientX/Y` / `tipWidthStartEdgeScreenDist` / `tipWidthBones`）。
- 写入：L446-489。**默认对称写两侧**（L488-489 同时写 `side` 与 `-side`），**Ctrl 才只写被拖那侧**；下限 `floorMult`（L481）。

移植要点：`tipPanelWidthAt` 是 panel 专用（返回 ribbon 边缘宽度），发丝需要一个等价的「当前该侧宽度倍率」读取函数（见 §4 Phase B 的 `strandTipWidthMultiplierAt`）。其余拖拽数学（屏幕距离比 → 倍率）与 Ctrl 语义**原样复用**。

### 2.4 浮动曲线编辑器

`modules/geometry/taper-editor.js`（1080 行）：`taperCurveEdit = { type:"segment", id, segmentIndex, curveKey, side }`；锁定点规则 `tipPointLocked(curveSide, position)` 已在 0.2.123 改为「非本侧暴露网格位置即锁定」，内部走 `deps.tipWidthSideControlTs`。primary=右侧、secondary=左侧。

移植要点：该锁定规则**与几何无关**，只要 `tipWidthSideControlTs` 能对发丝返回正确子集即可复用；`openPanelSegmentCurveEditor`（segment-control.js）需要一个发丝版入口。

### 2.5 发丝侧 UI 缺口

`index.html` `#strandSplitControls`（L1186-1196 附近）当前只有：`#strandSplitEnabled`、`#strandSplitGap`（Split Spacing，全局）、`#strandSplitTipLength`、`#resetStrandSplitTips`、+/− Zipper Controls（`#addStrandSplit`/`#strandSplitCount`/`#removeStrandSplit`）。

**缺**（panel 有而发丝没有）：段选择器（`#previousPanelSegment`/`#nextPanelSegment`/`#panelSegmentLabel` 的等价物）、每段 Spread 滑杆、`#panelSegmentCurveControls` 那组曲线预览 + 编辑铅笔 + 形状预设下拉。**没有段选择器 ⇒ 无法指定要编辑哪一段的曲线**，所以段选择器是本移植的**硬前置**。

## 3. UV 契约（已实测核验，结论是「天然安全」）

> 这一节的结论由主进程**直接读 uv-unfold.js 求证**，不是推测。移植时不需要为 UV 做任何补偿，但**必须**守住下面的不变量。

**U 轴**：`gridUvTable` 的 `split` 分支（uv-unfold.js L130-166）按**管**累计弧长：对每根管取 **row 0**（`gridIndexByRowCol.get("0:" + (colBase + l))`，L146）的环上顶点，逐边累加 `dist()` 得到 `colU`。即 **U 完全由「根部那一行」的顶点位置决定**。

**V 轴**：`gridUvAt`（L205）为 `v = 1 - row / (rows - 1)` —— **纯索引，与顶点位置无关**。

**由此得到的契约**：

| 项 | 允许改动？ | 理由 |
|---|---|---|
| `t > fork` 处顶点的横向位置（发尖段） | ✅ **允许** | U 只看 row 0；V 只看行号。发尖宽度曲线**不会改变任何 UV 值** |
| row 0 环上顶点位置 | ❌ **禁止** | 会改 U。发尖曲线在 fork 以上生效、fork 恒 > 0，故天然不触碰 row 0 |
| `ringSize`（每管环上点数） | ❌ 禁止 | `splitSections[g].ringSize` 是 U 表的结构基础 |
| 段数 / `splitSections` 长度 | ❌ 禁止 | 决定管的排布与 seam 副本数 |
| `gridRowIndices` / `gridColIndices` 赋值 | ❌ 禁止 | U/V 查表键 |
| `quadFaces` / 索引流顺序 / 端盖结构 | ❌ 禁止 | face remap 与 wrap 面依赖 |
| clip seam 边（`l=0` 列）的 x 位置 | ⚠️ 不要动 | 它是每管 U 的起点；移动它会重排 U 起算点 |

**先例（强证据）**：发丝**现有**的全局 taper 已经在做同类顶点位移——`strandProfileTopologyAt` 里 `profile.x * strandRadiusAt(...)`（app.js L7581）逐行缩放 profile，且 `asymmetricWidthCurve` 已被读取（L7593）。也就是说「按行、按侧缩放 x」是**既有且已验证**的行为，本移植只是把曲线来源换成段级 bone，**不引入任何新的 UV 风险类别**。

**验收断言（必须写进测试）**：对同一 lock，分别在「段曲线全 1」与「段曲线被改成非 1」两种状态下生成几何，断言 `unfoldHairMesh(geometry, {kind:"split"})` 的 `uvs` **逐值相等**（因为宽度只动 fork 以上、U 只看 row 0、V 只看行号）。这条断言把整个 UV 契约钉死。

## 4. 分阶段实施计划

> 每阶段独立可验证、可单独提交。Phase A/B 是地基，C/D 是 UI，E 是打磨。**建议顺序执行**（A→B→C→D→E），因为 UI 阶段依赖几何阶段的采样函数存在。

### Phase A — 共享层抽取（无行为变化）

**目标**：把 panel 的 WidthCurve 逻辑里「与几何无关」的部分抽成共享模块，供两边共用。这是「代码复用」要求的落点。

**新建** `modules/geometry/tip-width-curve.js`（纯函数，不 import three 之外的东西）：从 `panel-tip-strand.js` 迁出下列**几何无关**函数（原处改为 re-export 或直接 import，保持 panel 行为逐字节不变）：
- `TIP_WIDTH_CONTROL_POINTS`、`tipWidthControlTs(forkT)`
- `tipWidthGridTs(forks)` — 改为接收「该段两侧 fork」而非 `lock/splits`（去掉 panel 依赖）
- `tipWidthSideExposesT(sideForkT, t)` — 改为接收标量 fork
- `tipWidthSideControlTs(gridTs, sideForkT)` — 改为「网格 + 标量 fork」
- `tipWidthRecordsOppositeFork(ownForkT, oppositeForkT)`
- `buildTipWidthCurve` / `tipWidthResetCurve` / `setTipWidthCurveValue` 的**曲线数学部分**（参数化为：网格、两侧 fork、全局曲线、当前曲线）

**验收**：`node --test "tests/*.test.mjs"` 全绿且 panel 相关断言**一条不改**（证明纯搬迁）；新模块被 `panel-tip-strand.js` import。

**为什么先做这步**：`panel-tip-strand.js` 已 1132 行且混着 ribbon 几何 + 曲线数学 + 视口放置。不先抽，发丝分支会让它继续膨胀且两类逻辑缠死（违反规范「一条推导规则只准有一个定义点」）。

### Phase B — 发丝几何读段级曲线（无 UI，可测）

1. `app.js` `strandRadiusAt`（L7554）增加**可选覆盖**参数，例如第 6 个参数 `curveOverride = null`：
   ```js
   const shapeCurve = curveOverride?.curve ?? (axis === "z" ? lock.depthCurve : lock.taperCurve);
   const secondaryCurve = curveOverride?.secondary ?? (...);
   const asymmetric = curveOverride?.asymmetric ?? (...);
   ```
   **默认 null ⇒ 行为逐字节不变**（现有全部调用点不动）。**注**：override 还必须能替换 `signedCoordinate` 与 `blendZone`——见下条第 3 点，管内相对坐标不是 `profile.x`，且 panel 的发尖采样用 `blendZone = 0.25`（`tipWidthMultiplierAt` 末参），发丝要同构就得一起传。
2. `strandProfileTopologyAt`（L7571）增加可选 `widthOverride`，透传给 `strandRadiusAt`（仅 x 轴；depth 本轮不做）。**注意 L7593 的 `centerAsymmetricProfile` 分支**：它按 `boundsTransformed` 的 x 极值重新居中 profile，那是**整管平移**——发尖宽度必须只做缩放（§6 红线 4），所以 override 生效时不得让它把管重新居中，否则宽度改动会变成位移、缝会被推开。
3. `strand-geometry.js` L235 调用点：在段循环内已有 `sectionIndex` / `splitBones` / `section.sectionSplitStart`，据此构造 override —— **仅当 `t > sectionSplitStart` 且该段 bone 有 `taperCurve` 时**才传，否则传 null。**每管的 `signedCoordinate` 必须是管内相对坐标**：`(profile.x − tubeCenterX) / tubeHalfSpan`，其中 `tubeCenterX`/`tubeHalfSpan` 由该管**裁剪后 points 的实际 x 极值**求得（边缘管的 ±Infinity 边界先与 polygon 的 minX/maxX 取交）。理由见文首「实施期修正」：raw `x` 在边缘管只有一个符号 → 一侧曲线永不生效（= panel 0.2.80 死区同类 bug）。该「管内相对坐标」是新的推导规则，**必须单点定义**（纯函数，几何与把手 placement、拖拽读值三处共用）。
4. 新增 `strandTipWidthMultiplierAt(lock, t, signedX, bone, sectionIndex, splits)`（放共享模块或 strand 侧）：供拖拽读「当前该侧宽度倍率」，对应 panel 的 `tipPanelWidthAt`。
5. **fork 连续性自检**：bone 曲线在 fork 锚点取全局曲线采样值（`buildTipWidthCurve` 已如此），故切换点连续；但 **Reset 后曲线整段为 1**，若全局曲线在 fork 处 ≠ 1，fork 上下会出现宽度阶跃。panel 侧是既有权衡（同一套 `tipWidthResetCurve`），发丝管是闭合截面、阶跃更容易看成「缝口错位」——实施时必须在真实工程上目视确认一次，若明显则单独提出（属**设计变更**，不得夹带进本移植）。

**验收**：
- 段曲线为空/全 1 时，几何与改动前**逐字节一致**（deepEqual positions）；
- 段曲线改非 1 时，只有 `t > fork` 的顶点 x 变化，`row 0` 顶点**完全不变**；
- **UV 不变断言**（§3 那条）通过；
- N=1 legacy 与 N=3 水密测试仍绿。

### Phase C — 发丝段选择器（UI 硬前置）

`index.html` 的 `#strandSplitControls` 内新增（镜像 panel 的 Split Segments 行）：段选择器 `#previousStrandSegment` / `#strandSegmentLabel` / `#nextStrandSegment`，并把 `sculptState` 的段索引状态**复用**（`panelSegmentIndex` 改名为通用，或新增 `strandSegmentIndex`——建议**新增**，避免动 panel 既有语义）。

`segment-control.js` 的 `selectedPanelSegment` / `syncPanelSegmentControls` 参数化出发丝版（该文件已同时承载 panel 与 strand 的 +/− 逻辑，模式现成）。

顺带（可选，用户曾标记为「已知未做」）：每段 Spread 滑杆——数据层 `strandSplitBones[i].spread` 已被几何读取（strand-geometry.js L244-246），只缺 UI。

**验收**：切换段时 label 正确、边界按钮禁用正确；`dom-contract` 新增断言。

### Phase D — 视口把手 + 拖拽 + 曲线编辑器

1. **把手**：`bone-view-handles.js` L143-181 的创建块与 L485-517 的更新块，门控从 `isPanelGeometry(lock)` 扩为「panel 或 split strand」；`tipWidthControlPlacement` 按 `lock.geometryType` 分派到 panel/strand 实现。**把手数组结构与 `userData` 键完全不变**（段 × 侧 × 完整网格索引）。
   - ⚠️ 沿用 0.2.123 的**方案 (a)**：`tipWidthIndex` 索引**完整共享网格**，未暴露位置返回 null 由视口隐藏。**不要**改成索引过滤后的子集（同一 index 含义会随 zipper 高度漂移）。
2. **strand 版 placement**：需要「管的某侧边缘在世界空间的位置」。发丝没有 panel 的 `u` 边缘概念，取**该管 profile 在 `x` 方向的极值点**（左侧取 minX 点、右侧取 maxX 点），经 `warped` + `frame` + `opening` 变换后即把手位置——与几何用的是同一条变换链，保证把手贴在真实表面上。
3. **拖拽**：`bone-interaction.js` 的 `tipWidth` 分支，把 `tipPanelWidthAt` 换成按类型分派（发丝走 `strandTipWidthMultiplierAt`）；其余（屏幕距离比 → 倍率、`floorMult`、默认对称 / Ctrl 非对称）**原样复用**。
4. **曲线编辑器**：`taper-editor.js` 的 `tipPointLocked` 已是「非本侧暴露网格位置即锁定」，只要发丝能提供 `tipWidthSideControlTs` 等价数据即可复用；新增发丝版 `openStrandSegmentCurveEditor`。

**验收**：两侧 zipper 高度不同时，深侧把手多、浅侧少、间距一致（0.2.123 的不变式，对发丝重新断言）；每个可见把手都能抓且都影响该侧宽度；拖拽后 Reset 回全 1 平坦无凹陷。

### Phase E — 打磨与文档

- EN/JA/ZH 词条（新增 UI 文案）。
- `scripts/verify-tip-select.mjs` 增加发丝段（puppeteer，需真实浏览器跑）。
- README 双语补一句（发丝也有发尖 WidthCurve 了）。
- devlog：`local-adaptation-log.md` / `js-change-annotations.md` / 规范表行（把「strand 侧尚无 WidthCurve」改掉）。
- 版本号 + 缓存号 + `dom-contract` 冻结断言（5 条，见规范 bump 清单）。

## 5. 代码拆分建议

> 规范未硬性规定文件行数上限，但「app.js 编排层 + `modules/<domain>/` 分域」是既有架构原则。下列拆分**只有 P0 是本移植的必要前提**，其余按需。

| 优先级 | 拆分 | 现状 | 拆什么 | 留什么 | 接缝 | 风险 |
|---|---|---|---|---|---|---|
| **P0（必做）** | `modules/geometry/tip-width-curve.js` | `panel-tip-strand.js` **1132 行**，混 ribbon 几何 + 曲线数学 + 视口放置 | 网格/暴露判据/曲线构建/Reset/写入 的**纯数学**（见 Phase A 清单），参数化掉 `lock`/`splits` | ribbon 专属：`tipWidthEdgePosition`、`tipPanelWidthAt`、`panelPoint` 相关、`tipWidthSpreadGap` | 纯函数导出，panel 与 strand 各自组装参数 | 低（纯搬迁，测试可证行为不变） |
| P1（建议） | `modules/bones/tip-width-handles.js` | `bone-view-handles.js` **747 行** | 发尖宽度把手的创建/更新/释放三块 | 其余把手（zipper、段、tip 链、法线箭头） | 导出 `createTipWidthHandles(lock, group, deps)` / `updateTipWidthHandles(lock, deps)` / `disposeTipWidthHandles(curveObjects)` | 中（要理清与 `curveObjects` 生命周期的耦合） |
| P2（可选） | `modules/geometry/strand-tip-width.js` | 新增代码的落点 | 发丝专属：strand 版 placement、`strandTipWidthMultiplierAt`、override 组装 | — | 与 panel 版并列，共用 P0 模块 | 低 |

**不建议拆**：`taper-editor.js`（1080 行，但发丝改动只是判据参数化，几行）、`bone-interaction.js`（939 行，改动是分派一行）、`strand-geometry.js`（1238 行，改动是透传参数）。为几行改动做大拆分反而增加风险。

## 6. 风险与红线

1. **红线：不得改 row 0 顶点位置**（会改 U）。发尖曲线在 fork 以上生效、fork 恒 > 0，天然满足；但若将来有人把「宽度」扩展到整条发丝，必须重新评估 UV。
2. **红线：不得改 ringSize / 段数 / 网格索引 / 索引流**（§3 表）。
3. **索引方案不得退化**：`tipWidthIndex` 必须索引完整共享网格（0.2.123 结论），否则 zipper 高度一变、把手存的索引就指向别的参数。
4. **不要把宽度和张开混在一起**：宽度是 profile 缩放，张开是整管平移（`direction`/`opening`，0.2.124 刚修）。混淆会同时破坏两个功能。
5. **规范约束**：涉及跨文件同规则（如暴露判据同时被 placement/build/reset/write 消费）必须**单点定义**；修 bug 不得夹带设计变更；含中文文件 UTF-8 无 BOM 用 `write`/`edit` 工具写。
6. **验收缺口（历次遗留）**：视口把手渲染与拖拽手感**始终只有 node 级验证**，`verify-tip-select.mjs` 需真实浏览器。本移植完成后建议实跑一次该脚本。

## 6.5 顺带修的普通发丝 bug（本轮，与移植分开提交）

> 主进程实测确认，非推测。这些是 0.2.116 N-泛化的遗留，与 WidthCurve 移植无关，但同属「普通发丝小 bug」范围。

| # | 症状 | 位置 | 根因 | 判定 |
|---|---|---|---|---|
| 1 | N≥2 拉链（≥3 管）时，**第 3 根管及以后没有发尖把手**（黄色 tip 手柄 + 引导线），用户无法拖动它们的发尖 | `modules/bones/bone-view-handles.js` **L210**（创建）与 **L606**（更新）均为 `for (let tubeIndex = 0; tubeIndex < 2; ...)` 写死 2 | 0.2.116 把管数泛化成 N+1，但这两个循环仍是 2 管时代的字面量；注释也还写着「one per tube (0/1)」 | **真 bug（P1）**。写入侧 `strandSplitTipLength`/`resetStrandSplitTips`（app.js L17103/L17128）已按 `chains.forEach` 全管泛化 → 数据能改、把手看不见，属纯遗漏，修它**不改任何用户可见设计**（只是让本该存在的把手出现） |

修法：两处循环上限改为 `strandSplitBonesFor(lock)`/`lock.curveObjects.strandSplitTipHandles` 的实际长度（与 `strandSplitBonesFor` 的管数同源，勿再写字面量）。回归用 source-text 断言（`tests/split-tip-geometry.test.mjs` L173/L183 已有同类模式）+ N=3 时把手数 = 管数的断言。

## 6.6 遗留待办（0.2.125 实施后**仍未**解决，勿当成已完成）

| # | 项 | 状态 | 说明 |
|---|---|---|---|
| 1 | **fork 连续性目视确认**（§4 Phase B item 5） | **未做，需真实浏览器** | Reset 把整条段曲线置 1；若 lock 级全局宽度曲线在 fork 处 ≠ 1，fork 上下会出现宽度**阶跃**。panel 侧是既有权衡（两边共用 `tipWidthResetCurveFrom`），但发丝管是**闭合截面**，阶跃更容易被看成「缝口错位」。node 级测试判不了（只能断言数值、不能判断观感）。**若确认明显，修它属设计变更**（要动 Reset 语义或 fork 锚点取值），必须单独提出确认，**不得夹带**。 |
| 2b | **`verify-tip-select.mjs` 有 4 条断言钉的是 0.2.123 之前的旧模型，需改写**（0.2.126 定位） | **未做，需单独一轮** | 该脚本现为 **47/51**。4 条失败（`hasBothForks` / `lockedGlobal` / `hasRightSecondary` / 浮动面板刷新）要求**每侧在自己的 fork 处都有一个曲线点**——那正是 0.2.118 的 per-side 模型，**0.2.123 已明确推翻**（改为「一套共享网格 + 按侧动态暴露」）。主进程用真实导出函数独立核实：heights 0.5/0.3125 时共享网格 = `0.55/0.65/0.75/0.85/0.95/1`（由**最深** fork 生成），两侧各自的 fork（0.5 / 0.6875）**都不在网格上**；而 0.2.123 语义完好——深侧暴露 6、浅侧暴露 4、Reset 全 1。更关键：满足该脚本会**重新引入凹陷 bug**（`tipWidthRecordsOppositeFork` 守卫存在的理由就是「对侧 fork 落进本侧暴露区会成为无把手活点」，见 bug-fixes.md #14）。**结论：这 4 条是脚本过时，不是回归**；0.2.126 只做了必要的机械改名（`panelTipSelection`→`tipSelection`、`panelTipHandles`→`tipChainHandles`，37 增 37 删、判据逻辑未动），刻意不顺手改写断言（属上一轮 Phase D/E 的收尾，混进来违反「修 bug 不夹带设计变更」）。 |
| 2 | `scripts/verify-tip-select.mjs` 增加发丝段 | 未做（但**已有替代性浏览器验收**） | 该脚本本身未扩展。不过 0.2.125 用 `scripts/verify-uv-pack-real.mjs`（headless Chrome + CDP）跑通了真实工程 `Sussurro_v1_0060.ahs` 的**端到端**验收：**7/7**（app boot / 26 locks 加载 / 完整导出展开+打包管线 ×3 计时 474-450ms 且逐位确定 / 78 meshes·31467 uvs·23 islands·U∈[0,1] V∈[0.0151,0.9849] / UV checker 刷新 / **0 page exceptions**）。**「0 异常」这条恰好覆盖了本轮最大的机械风险**：它在真实浏览器里跑通了整个 module graph，任何一个 `?v=` 缓存号写错（本轮改了 12 处导入边）都会表现为 import 失败 → page exception。**仍缺的是「把手渲染与拖拽手感」的目视确认**（绿色控制点在管表面的位置是否贴合、拖拽是否顺手），这需要人眼，脚本判不了。 |
| 3 | strand 拉链 snap-to-loops | 未做（可能长期不做） | 发丝无纵向 loop 拓扑可吸附 → 判定为**非缺口**而非欠账。 |
| 4 | N>2 子发片桥接 | 门控禁用 | 与本移植无关，见 0.2.116 F 阶段。 |

## 7. 每阶段验收清单（0.2.125 实施结果）

- [x] **A**：全量测试绿；panel 断言一条未改；新模块被 panel 侧 import。**另加证**：36 用例（6 组 zipper 高度 × 3 段 × 2 侧）适配器输出与 `git show HEAD:` **逐字节相同（496,518 字节）**
- [x] **B**：未创作曲线时几何 deepEqual 不变（对照 harness **丢弃第 7 参**，即真正的改动前输出）；改非 1 时仅 fork 以上位移、**row 0 逐位不变**；**UV 逐值不变**（主进程独立探针复核：910 个 uv 值全同、54 个 fork 以上顶点位移）；N=1 legacy + N=3 水密仍绿。**边缘管双侧可达**（死区回归，raw x 实现会失败此条——实测确认）
- [x] **C**：段选择器切换/禁用正确；`dom-contract` 新断言 1 条 + `strand-segment-ui.test.mjs` 5 条
- [ ] **D**：深侧把手多/浅侧少/间距一致；每个可见把手可抓且影响该侧；Reset 后两侧全暴露区恒 1（无凹陷）；拖拽默认对称、Ctrl 非对称 —— **进行中**
- [ ] **E**：三语词条 ✅；README 双语 ✅；devlog ✅（bug-fixes #18–#21 / 规范表两行 + 作废旧结论 / 时间线 / devlog README / AGENT_QUICKSTART）；**版本号 + 缓存号 + 冻结断言待 Phase D 完成后一并做**（缓存号必须定点、且 9 个被改模块的 `?v=` 都要过一遍）；真实工程 `verify-skeleton-layout` 130/130 ✅
- [x] **全程**：`node --test "tests/*.test.mjs"` 全绿 —— 基线 293/293 → **当前 331/331**（本文档原写的 293 已是历史值）+ 真实 `D:\Downloads\Sussurro_v1_0060.ahs` **130/130** + **真实浏览器端到端 7/7**（`verify-uv-pack-real.mjs`，headless Chrome，含 0 page exceptions ⇒ 12 处 `?v=` 改动的 module graph 全部加载成功）
- ⚠️ **测试注意**：`tests/uv-pack-async.test.mjs` 是**负载相关 flake**（Worker 池单条最慢约 14s），并行跑子智能体时可能超时报**恰好 1 条** fail，重跑即绿。本轮实测复现一次（317/318 → 318/318）。

## 8. 参考坐标（实施时直接跳）

| 内容 | 位置 |
|---|---|
| 发丝半径采样（**移植支点**） | `app.js` L7554 `strandRadiusAt` |
| 发丝 profile 逐行 warp | `app.js` L7571 `strandProfileTopologyAt`（L7581 x 缩放、L7593 已读 asymmetric） |
| 发丝段循环（bone/fork 现成） | `modules/geometry/strand-geometry.js` L228-256 |
| panel 曲线数学（待抽取） | `modules/geometry/panel-tip-strand.js` L215-311（网格/暴露/Reset）、L384-478（build/write）。**注**：本表行号为 0.2.124 时点，实施前请先 grep 函数名核对（文件仍在演进） |
| panel 宽度采样 | 同上 L336（`tipWidthMultiplierAt`）、L378（`tipPanelWidthAt`） |
| panel 把手 placement | 同上 L670 `tipWidthControlPlacement`（ribbon 边缘 L624 `tipWidthEdgePosition`） |
| 把手创建 / 更新 / 释放 | `modules/bones/bone-view-handles.js` L143-181 / L485-517 / L700-707 |
| 拖拽起始 + 写入 | `modules/bones/bone-interaction.js` L197-238 / L277-282 / L446-489 |
| 曲线编辑器锁定判据 | `modules/geometry/taper-editor.js` L436-475 |
| UV：U 由 row 0 弧长 | `modules/io/uv-unfold.js` L130-166（L144-161 取 row 0） |
| UV：V 纯索引 | 同上 L205 |
| 发丝现有 UI 块 | `index.html` `#strandSplitControls`（**L1180** 起） |
| panel 段选择器（镜像对象） | `index.html` **L1103** 起「Split Segments」块 |
| `createPanelTipStrandApi` 构造 + deps 批 | `app.js` L1859-1860、L12126-12135 |
| deps seam（三处，Phase A 抽取后要过一遍） | `app.js` L8626-8628（taper-editor）、L20638-20667（把手/交互）、L10003-10004（mirror） |
| 外部调用点总量 | `grep "panelTipStrand\."` → 56 处；`tipWidthSpreadGap` 仅 3 个内部调用（L634 `tipWidthEdgePosition`、L1094/L1097 几何 `uStart`/`uEnd`）+ 1 处 dep 导出（L20650），**无测试直接调用** |
| 现有测试覆盖的宽度函数 | `tests/split-tip-geometry.test.mjs` L447-506（网格/暴露/placement）、L589（Reset） |
