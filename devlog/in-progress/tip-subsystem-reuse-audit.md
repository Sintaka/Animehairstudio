# 发尖子系统「重复推导规则」审计（0.2.126）

> **性质：只读审计，本轮不改代码。** 目的是把 0.2.124–0.2.126 三轮移植之后**残余**的重复推导站点一次性列清，供后续某一轮 collapse；同时把**刻意保留**的重复与不对称写明，避免后人「顺手统一」而引入回归。
>
> 判定口径来自 development-standards.md：**「一条推导规则只准有一个定义点」**——凡同一条几何/骨骼推导被两处以上消费，必须抽成具名纯函数；跨模块无法 import 时，每个副本处必须写「同规则同步点清单」并互相指向。
>
> **本审计只把「能引用同一个函数却各写一遍公式」计为重复。** 参数化后语义会变的、或抽取成本高于收益的，归入「不建议动」并写明理由。所有断言均已读码核对，公式差异均实测过（见文末「验证方式」）。

## 1. 结论摘要

- **真正可 collapse 的重复推导：8 条** —— fork-T（**7 处**算式，含同文件内两份）、`SPREAD_MAX`（×2 定义 + 8 处内联）、`firstExposedTipChainIndex`（×2 实现）、splits 归一化（×3 副本）、`globalCurve` 按侧选择（×2，**修过真 bug**）、曲线写入序列（×2）、把手 placement 判定序列（×2）、引导线采样序列（×2）。后四条见 §2b。
- **另有 7 个 `(splits, index)` → 共享规则的薄适配器成对重复**（panel/发丝各一份、函数体逐字相同），§2b b1。
- **死代码：2 处确认**（`tipWidthRecordsOppositeFork` 全仓库零引用；`tipWidthControlTs` 别名零读者）+ 3 处「暴露面无读者但本体仍活」，§6。
- **过期/自相矛盾注释：4 条**（最严重的一条把 fork 的定义点数少报一半以上），§6。
- **刻意保留、不建议动：7 项**（详见 §4 与 §2b 末段）。
- **`!isPanelGeometry` 误用作「是发丝」：发尖子系统内 0 处**（§5，0.2.126 的收口是干净的）。
- **dep-bag 漂移：无**（两份 `strandTipWidthGeoDeps` 逐字节同形，§3）。

## 2. findings table

| 规则 | 单一定义点应在哪 | 重复站点（file:line） | 严重性 | 建议处置 |
|---|---|---|---|---|
| ~~**fork-T = `1 − max(左右相邻 zipper 高)`**~~ **（0.2.133 已 collapse，见 §9）** | `tip-width-curve.js:41` `tipWidthCommonForkFromHeights`（高度版，几何无关）；`bone-model.js:448` `strandSplitForkTForSegment` 是它的 **lock 版**（额外做 `strandSplitsFor` 归一化，合理保留） | 全仓库共 **7 处**独立算式：① `tip-width-curve.js:33`（`tipWidthSideForkFromHeights` 内的 `segmentForkT`，与 `:42` 同式）；② `panel-tip-strand.js:182` `splitForkT`；③ `bone-model.js:452`；④ `strand-geometry.js:140` `sectionHeight` + `:145` `1 - sectionHeight`；⑤ `usda-export.js:542` `strandForkTForTube`；⑥ `usda-export.js:591` 与 `:672`（panel，两处）；⑦ `project-files.js:733`（panel）+ `:750`（strand），**同一函数内两份** | **高** | **`strand-tip-width.js:84` 的注释写「三处必须一致，勿新写第四条公式」——实际是 7 处，该注释本身已过期，须一并更正。** 处置：②⑤⑥⑦ 改调 `tipWidthCommonForkFromHeights`；④ 保留（它同时要 `sectionHeight` 供 band 用，改动收益低）；③ 保留（lock 版归一化入口）。**先证等价**（实测见文末）：在全部可达输入上逐值相同；唯一差异是**负高度**（`splitForkT(-0.1,null)`→1.1 vs 共享层→1.0），而两处归一化都把 height 下界钳到 ≥0（`normalizePanelSplits` `[0,0.78]`、`strandSplitsFor` `[0.02,0.8]`）⇒ 不可达。②⑤⑥⑦ 均已具备 import 路径 |
| **最刺眼的一处：同一文件内两份等价 fork** | 同上 | `panel-tip-strand.js:178` `splitForkT` 与 `:230` `tipWidthCommonForkT` **相距 50 行、可证等价**，且后者**无生产调用点**（只被测试读，见 §6） | **高** | 单独列出因为它是**成本最低的一刀**：删 `tipWidthCommonForkT` 或让 `splitForkT` 委托它，无跨模块协调。**注意** `panel-tip-strand.js:186-188` 的段头注释写「以下 tipWidth* 函数全部是薄适配器…勿在此处复制公式」——而 `splitForkT` 就在该注释上方 8 行处复制着公式，注释与代码互相矛盾 |
| **`SPREAD_MAX = 0.99`（spread 定义域上界）** | `bone-model.js:9`（**未导出**，这是重复的直接原因） | `segment-control.js:59` 第二份 `const SPREAD_MAX = 0.99;`，注释自陈「bone-model 未导出该常量，故此处保留副本；改动必须两处同步」 | **中** | `export const SPREAD_MAX` 于 bone-model，`segment-control.js` 改 import（**该文件已 import bone-model**，零新依赖边）。这是成本最低、收益明确的一条 |
| 同上（内联字面量 `0.99`） | 同上 | `app.js:13403`、`app.js:17358`、`bone-interaction.js:599`（`* 0.99` 与 `clamp(…,0,0.99)`）、`bone-view-handles.js:461`（`spread / 0.99`）、`usda-export.js:617`、`usda-export.js:691`、`strand-geometry.js:183`、`panel-tip-strand.js:309` | **中** | 同上导出后逐处替换为常量。**注意**：`taper-editor.js:282/1094` 与 `curve-math.js:988` 的 `0.99`/`0.999` 是**曲线 position 钳位**，与 spread 无关，**不要一起替换**（不同规则同值，替换会把两条规则绑死） |
| **首个暴露发尖链索引 = `clamp(floor(forkT·last), 1, last)`** | `tip-sub-bone.js:97-100` `firstExposedTipChainIndex`（0.2.126 新增，注释已列消费方清单） | `usda-export.js:726` 自写同一表达式（`Math.min(last, Math.max(1, Math.floor(forkT * last)))`）；`usda-export.js:435` `tipChainNearestIndex` 内的 `i0` 第三次自写 | **中** | `usda-export.js` 已 import bone-model，加一条 `tip-sub-bone.js` import 无循环风险（该文件只 import three）。**注意 §4.2**：standards 允许「跨模块无法 import 时留副本 + 同步点注释」，此处副本注释**已存在且互相指向**，故属于**受控**重复而非违规；但 import 可行 ⇒ 建议真 import。**若保留副本，则必须保留跨消费方一致性断言** |
| **strand splits 归一化（sort + clamp position ±0.8 / height 0.02–0.8 + legacy 标量回退）** | `bone-model.js` `strandSplitsFor` | `usda-export.js:528-535` `strandSplitsForExport` 自写；`project-files.js:738-747` 第三份内联（含自带的 `clampSplit`） | **中** | 三处已各自注释「与几何同规则」。usda-export/project-files 均可 import bone-model 的 `strandSplitsFor`。**风险点**：三份的 legacy 回退条件写法不同（一处判 `Array.isArray(...) && length`，另一处判 `strandSplitEnabled`），collapse 时须逐条对齐再改，**不可盲替** |
| **`["panel","surface"].includes(geometryType)`** | `app.js:1524` `isPanelGeometry`（UI 门控）/ `bone-model.js:754` `segmentBoneHost`（数据分派） | `bone-model.js:113/133/174`、`project-files.js:726`、`strand-geometry.js:1149`、`app.js:14101` | **低** | **不建议统一成一个**（见 §4.1）：`bone-model.js:752` 的注释已说明两者是**刻意的双定义**（UI 门控 vs 数据分派，分层不同）。仅建议把 `project-files.js:726` 的 `isPanel` 改为 `segmentBoneHost(lock) === PANEL_SEGMENT_HOST`，因它做的正是**数据分派** |
| **段数 `splits.length + 1`** | `bone-model.js` `PANEL_SEGMENT_HOST.segmentCount` / `STRAND_SEGMENT_HOST.segmentCount:745` | `bone-view-handles.js:230`（panel 创建块）、`bone-view-handles.js:421/424`、`segment-control.js:258/393/439/468/475/514/545/580`、`bone-model.js:69/88/501/785` | **低** | **多数不建议动**：`segment-control.js` 的那些是「刚归一化出的局部 `splits` 变量 + 1」，就地读比绕描述子更直白且同源；`bone-model.js` 内部几处是描述子自身的实现。**唯一值得改**：`bone-view-handles.js:230` 的 panel 创建块（与 L300 的 strand 侧已用 `STRAND_SEGMENT_HOST.segmentCount` **不对称**——同一函数里一侧用描述子、一侧写字面式，是最容易漂移的形态） |
| **发尖链点数下限 `Math.max(2, points.length)`** | `bone-model.js:746` `STRAND_SEGMENT_HOST.tipChainPointCount` | `bone-view-handles.js:750`、`strand-geometry.js:352/1202`、`usda-export.js:707`、`app.js:13347/13425`、`tip-sub-bone.js:38`（`materializeTipChain` 内部，**属实现本体**） | **中** | `tip-sub-bone.js:38` 是规则**本体**（描述子的注释明确指向它），不算副本。其余 6 处应改读 `tipChainPointCount`。**但注意 §4.3**：panel 的下限是 0、发丝是 2，几何侧（strand-geometry）读的恒是发丝语义，改描述子调用时**必须传对 host**，否则 panel 会拿到 2 而非 0 |
| **把手 placement 的「索引完整共享网格」判定序列**（guard `sideForkT>=1` → 索引完整网格 → 越界检查 → 暴露判定 → 委托 EdgePosition） | 应新增于 `tip-width-curve.js`（几何无关，只需 `sideForkT`/`gridTs`/`pointIndex` + 一个 `edgeAt(t)` 回调） | `panel-tip-strand.js:595-616` `tipWidthControlPlacement` 与 `strand-tip-width.js:493-501` `strandTipWidthControlPlacement`：**同一条 5 步判定各写一遍**，差异仅在 fork/grid 来源与 edge 函数 | **中** | **建议抽取**（见 §2b）。两处注释都写着「**不要**改成索引过滤子集：同一 index 的含义会随拉链高度漂移」——即两份副本各自守着**同一条契约**，正是最该单点化的形态 |
| **「本侧此前实际在用的 globalCurve」按侧选择规则** | 应新增于 `tip-width-curve.js`（如 `sideCurvesFor(lock, bone, side) → { globalCurve, current }`） | `panel-tip-strand.js:368-371` 与 `strand-tip-width.js:269-271`：**逐字同构**（右侧恒取 primary；左侧仅在 `asymmetricWidthCurve && taperCurveSecondary` 时取 secondary），差异只有可选链 | **高** | **优先级高于其他抽取**：这条规则**修过一个真 bug**——「右侧一拖就打开 asymmetric，未被拖的左侧从 primary 跳到 secondary」。panel 的注释记着该 bug，发丝的注释写着「panel 侧修过的同一个 bug，发丝侧不得重犯」。**一条修过 bug 的规则现有两份实现 ⇒ 只改一处即回归**，这正是 standards 反复警告的形态 |
| **发尖曲线写入序列**（两侧懒初始化 → 强制 `asymmetricWidthCurve = true` → 写 → null 早退 → **只重建被编辑那侧**） | 同上（可接受 `rebuild(side)` 回调） | `panel-tip-strand.js:384-401` `setTipWidthCurveValue` 与 `strand-tip-width.js:284-299` `setStrandTipWidthCurveValue`：同一 5 步、同一顺序，差异只有发丝多一个 `if (!bone) return;` 与调各自的 `build*` | **中** | 抽取时**保留**发丝的 `!bone` 守卫。注意这条与上一条耦合（重建调用的正是 `build*`），**应与 globalCurve 规则同一轮处置** |
| **暴露区引导线采样（25 点 `lerp(forkT, 1, i/24)` + 丢弃 null）** | 同上，应与 placement 一并抽出 | `panel-tip-strand.js:580-591` `tipWidthEdgePoints` 与 `strand-tip-width.js:505-523` `strandTipWidthEdgePoints` | **中低** | **建议抽取**。采样数 24 是两份副本各写的字面量（strand 侧注释自陈「段数 24 与 panel 相同，纯视觉密度」）——改一处会让两几何的引导线密度不一致，而**引导线必须与把手同源**（`bone-view-handles.js:560` 的注释即要求「引导线画的必须正好是可抓的那段」） |

## 2b. `panel-tip-strand.js` vs `strand-tip-width.js`：还能不能再抽一层？

**能，但只有两个小函数，且都是「判定序列」而非「数学」。** 逐对比较结果：

| panel 侧 | 发丝侧 | 分类 | 依据 |
|---|---|---|---|
| `tipWidthSideForkT:189` | `strandTubeSideForkT:90` | **已共享** | 两者都只是 `tipWidthSideForkFromHeights` 的薄适配器 |
| `tipWidthGridTs`（经 `tipWidthGridFromHeights`） | `strandTubeGridTs`（同） | **已共享** | 同上 |
| `tipWidthResetCurve` / `buildTipWidthCurve` / `setTipWidthCurveValue` | `strandTipWidthResetCurve:235` / `…:253` / `…:271` | **已共享** | 全部委托 `tip-width-curve.js` 的 `*From` 系列 |
| `tipWidthControlPlacement:595` | `strandTipWidthControlPlacement:493` | **⚠ 真重复（判定序列）** | 见下方引用 |
| `tipWidthEdgePoints:580` | `strandTipWidthEdgePoints:505` | **⚠ 真重复（采样序列）** | 见 §2 表 |
| `tipWidthEdgePosition:549` | `strandTipWidthEdgePosition:405` | **不建议抽取** | 数学**根本不同**，见下 |
| `tipPanelWidthAt:358` | `strandTipWidthMultiplierAt:186` | **不建议抽取** | 同上，一个读 ribbon 边缘宽度、一个读管内倍率 |

**⚠ 真重复的证据（两份 5 步判定）**：

`panel-tip-strand.js:595-615`
```js
function tipWidthControlPlacement(lock, segmentIndex, splits, bone, side, pointIndex) {
  const sideForkT = tipWidthSideForkT(lock, segmentIndex, splits, side);
  if (sideForkT >= 1) return null;
  const positions = tipWidthGridTs(lock, segmentIndex, splits);
  if (pointIndex < 0 || pointIndex >= positions.length) return null;
  const t = positions[pointIndex];
  if (!tipWidthSideExposesT(lock, segmentIndex, splits, side, t)) return null;
  const edge = tipWidthEdgePosition(lock, segmentIndex, splits, bone, side, t);
  if (!edge) return null;
  return { point: edge.point, t: edge.t, center: edge.center, lateral: edge.lateral };
}
```

`strand-tip-width.js:493-501`
```js
export function strandTipWidthControlPlacement(geo, lock, splits, tubeIndex, bone, side, pointIndex) {
  const sideForkT = strandTubeSideForkT(splits, tubeIndex, side);
  if (sideForkT >= 1) return null;
  const positions = strandTubeGridTs(splits, tubeIndex);
  if (!(pointIndex >= 0) || pointIndex >= positions.length) return null;
  const t = positions[pointIndex];
  if (!tipWidthSideExposesTAt(sideForkT, t)) return null;
  return strandTipWidthEdgePosition(geo, lock, splits, tubeIndex, bone, side, t);
}
```

同一条规则、同一顺序、同一批 null 语义。**可抽成** `tip-width-curve.js` 的
`tipWidthPlacementAt({ sideForkT, gridTs, pointIndex, edgeAt })`，两侧各传自己的 `edgeAt(t)`。
**收益是真的**：这条判定序列**就是**「按 zipper 高度动态暴露」的实现机制本身（不是安全网），
两处注释都在守同一条「index 索引完整网格、不得改成子集」契约——契约有两份实现即可漂移。
**顺带修掉一处已存在的细微不一致**：panel 写 `pointIndex < 0`、发丝写 `!(pointIndex >= 0)`
（后者额外拦住 `NaN`）。两者对 `NaN` 行为**不同**：panel 会让 `positions[NaN]` → `undefined`
→ 后续判定异常路径，发丝直接 `return null`。抽取时取发丝的写法。

**为何 `tipWidthEdgePosition` 不该抽（category c）**：两者不是「同一公式换个坐标源」，而是**两套几何**：

- panel（`:549-575`）在 **ribbon u 空间**：段边界 `boundaries[segmentIndex]`、`spreadGap` 内缩、`edgeU`/`centerU`、`(edgeU − centerU) × lock.width × multiplier × 0.5` 沿 `tipChainFrameAt.x`。
- 发丝（`:405-486`）在 **profile 多边形空间**：`strandSplitProfileData` 采样 → `strandTubeBandExtents` 求管带 → 按**管内相对坐标符号**选 lowX/highX → `profileTopZAt` 求上表面 z → `strandProfileTopologyAt` warp → `frame.x/z` 组装 → `opening` 平移 → 发尖链再锚定。

共同点只有「返回 `{ point, center, lateral, t }` 同形」——而这**已经**是被刻意维持的契约（让 `bone-interaction.js` 的拖拽数学一行不改）。把它们参数化需要抽象掉「u 空间 vs profile 空间」，那是比重复更大的抽象。**归入不建议动。**

## 3. dep-bag 重复：无漂移

`strandTipWidthGeoDeps()` 存在两份，两处注释互相指向并声明「必须转发同样的四项」：

- `bone-view-handles.js:56-63`（把手放置）
- `bone-interaction.js:39-46`（拖拽基准 / 读值）

**实测两份逐字节同形**，转发同样四项、同样顺序：`strandGeometryCurve`、`strandGeometryFrameAt`、`strandProfileTopologyAt`、`strandSplitProfileData`。**当前无漂移。**

- `tests/split-tip-geometry.test.mjs:2029` 已用正则抓取该函数体做断言，是防漂移的现有护栏。
- **不建议合并成一个共享函数**：两份的 `deps` 来自**各自模块的注入闭包**，合并需要把 deps 容器本身参数化，等于为省 8 行引入一层间接。**建议改为**：保留两份，但让测试断言**两份文本相等**（现在只断言了其中一份的形状），成本一行、收益是漂移必红。
- 另有一处同型 5 项 deps 转发（`bone-interaction.js:54-60` 与 bone-view-handles 侧的 `createTipSubBoneHostApi` 调用），注释同样声明「必须用同样的五项」，**且额外要求五项全部惰性求值**（`deps` 在 app.js 顶部构造时尚未填满，快照会存下 undefined）。同上处置：保留 + 加文本相等断言。

## 4. 已经做对的 / 不建议动

> 本节存在的原因：development-standards.md:76 记过一次教训——「结论类表述必须随实现更新」，一行过期的表格结论曾让 agent 把修复改回去。以下都是**刻意**的，不是遗漏。

### 4.1 `isPanelGeometry` 与 `segmentBoneHost` 的双定义（刻意）

`bone-model.js:752` 的注释已写明：`isPanelGeometry`（app.js，`["panel","surface"]`）是 **UI 门控**，`segmentBoneHost` 是**数据分派**。两者同规则但分层不同，**刻意各留一处**。不要合并成一个跨层函数。

### 4.2 「无法 import 时留副本 + 同步点注释」是规范允许的形态

standards 明确允许跨模块（视口/导出分层）保留副本，条件是**每个副本处写明同步点清单并互相指向**，且回归测试含**跨消费方一致性断言**。`usda-export.js` 的 fork/暴露索引副本**满足**该条件（注释齐全 + `tests/split-tip-geometry.test.mjs` 有跨消费方断言）。所以 §2 里这几条是「可以更好」，**不是**「违规」——排期时优先级低于真正无护栏的重复（`SPREAD_MAX`）。

### 4.3 `tipChainPointCount` 的下限 panel=0 / 发丝=2（刻意不对称，勿统一）

- panel 允许 **0**：主链不足 2 点时整段没有可编辑发尖，`splitTipForSegment` 也返回 null。
- 发丝下限 **2**：对应 `materializeTipChain` 内部的 `Math.max(2, count)`，传 0 会造出与视口不一致的 2 点链。

`tests/split-tip-geometry.test.mjs:2116-2117` 对这两个下限**各有一条断言**（`STRAND…({points:[]}) === 2` / `PANEL…({points:[]}) === 0`，后者注释写着 "panel deliberately allows 0"）。**统一下限会让其中一条必红。**

### 4.4 `usda-export.js` 的两个 tag 保持区分（刻意）

`strandDirectionForTube`（0.2.124 起已委托 `strandSplitDirection`，是薄封装）与 `strandForkTForTube`（仍自写公式）是**两条不同规则**的导出侧封装，**不要因为名字相似而合并**。前者已是单点定义的消费方；后者才是 §2 第一行要处置的对象。`strandDirectionForTube` 之所以仍存在而非直接调用共享函数，是因为它**导出**给跨消费方一致性断言用（`tests/split-tip-geometry.test.mjs:1022`）——**保留该导出**。

### 4.5 `STRAND_TIP_WIDTH_FACTORS_APPROXIMATION = 1`（刻意的近似，不是 bug）

`strand-tip-width.js:301`，消费点 L377。这是发丝侧把手 placement **刻意放弃**复现几何的曲率收窄 `factors[row]`：该值是「全部行 × 全部管」前置 pass 的产物、且经 falloff 在行间扩散，单点放置拿不到。取舍已写在代码里（可见后果：急弯处把手略微浮在表面外侧）。**不要试图"修正"成真实 factors**——那需要把整趟 pass 搬进 placement。同理 UV 红线要求曲率收窄预趟**刻意不传** width override。

### 4.6 `strandTubeForkT` 已正确委托（勿重复计入）

`strand-tip-width.js:85-88` 看似是第四条 fork 公式，实际**已委托** `tipWidthCommonForkFromHeights`。审计中不计为副本。同理 `panel-tip-strand.js:189-192` 的 `tipWidthSideForkT` 已是共享层薄适配器。

### 4.7 `tipWidthRecordsOppositeForkFrom` 守卫必须保留

`tip-width-curve.js:92`。共享网格（0.2.123）**没有**解除它防的那个危险：对侧 fork 是 zipper 高度的连续值、通常不落在共享网格上，落进本侧暴露区时仍是不可抓的「活点」（宽度凹陷来源）。注释已写明。**勿以「共享网格后已无必要」为由删除。**

## 5. `!isPanelGeometry` 作为「是发丝」的误用：发尖子系统内 0 处

逐处核对了全部 `!isPanelGeometry` 出现点，**发尖子系统内没有误用**：

- `bone-view-handles.js:589`：位于 `segmentBoneHost(lock) !== STRAND_SEGMENT_HOST` 的 else 分支内，此时「非发丝」已成立，该判断是**正向的 panel 测试**（等价于 `isPanelGeometry`），语义正确。
- `bone-view-handles.js:216/219/385/454`、`segment-control.js:319/345/381/418/444/459`、`taper-editor.js:306/462`：全部是**正向** panel 门控（panel 专属 UI / panel 专属 drag kind），不是「是发丝」的替身。
- `bone-interaction.js:498`、`segment-control.js:325/352/363/601`、`taper-editor.js:457/774`、`app.js:11906/16385/20296`：已是 `segmentBoneHost(...) === STRAND_SEGMENT_HOST` 的正确写法。
- `tests/split-tip-geometry.test.mjs:2165` 断言笔刷代码里**不含** `isPanelGeometry`，`:2328` 断言高亮/悬停门控走 `segmentBoneHost` —— 现有护栏已覆盖。

**唯一一处形态上是「panel 则 null，否则按发丝处理」的代码在发尖子系统之外**：`app.js:11734` `strandWidthEdgeSample` 的 `if (isPanelGeometry(lock)) return null;`、`app.js:11764` 的 `isPanelGeometry(lock) ? null : strandGeometryCurve(lock)`。这是**主发丝宽度边缘取样**（braid/poly 等也走这条），与段发尖无关；`segmentBoneHost` 在此**不适用**（它对未开启 split 的普通发丝返回 null，而这条路径必须对它们生效）。**不建议改。**

## 6. 死代码 / 过期注释

> ⚠️ 表中 `strand-tip-width.js` 的行号取自**本轮并发改动期间**的文件状态（该文件在审计过程中由另一路从 424 行增至 523 行）。合并后须重新定位；判定本身（哪条注释过期、哪个函数无引用）不受行号影响。

| 项 | 位置 | 判定 |
|---|---|---|
| `strand-tip-width.js:76` 注释「后续阶段：视口把手 placement 与拖拽读值（Phase D，**尚未接入**）」 | `strandTubeSignedCoordinate` 上方 | **过期**：Phase D 已在 0.2.125 接入（`strandTipWidthControlPlacement`/`strandTipWidthEdgePosition` 均在用）。建议删掉「尚未接入」。此类过期注释正是 standards 警告过的形态 |
| `taper-editor.js:455` 注释「这正是 Phase C 暂时把整块门控在 `isPanelGeometry` 的原因」 | 暴露判定块 | **描述历史、但下方代码已分派**（L456-464 已有 strand 分支）。语义不矛盾（它在解释为何曾经门控），但建议补一句「0.2.125 起已补上发丝分支」以免误读为现状 |
| **`strand-tip-width.js:84`「三处必须一致，勿新写第四条公式」** | `strandTubeForkT` 上方 | **数字错误**：实际 7 处（§2 第一行）。且它列出的三处**漏了** `panel-tip-strand.js:182 splitForkT` 与导出侧的三份。**这是本审计发现的最严重过期注释**——它会让读者以为规则已收敛 |
| **`panel-tip-strand.js:186-188`「以下 tipWidth* 函数全部是薄适配器…勿在此处复制公式」** | `splitForkT` 与 `tipWidthSideForkT` 之间 | **与紧邻代码矛盾**：该注释下方的 `tipSegmentForkAt:194`/`tipSegmentWeightAt:211`/`tipSegmentBlendAt:218` 既非 `tipWidth*` 也非适配器（各自拥有 fork-lerp/权重规则）；`tipWidthSpreadGap:299`/`tipWidthMultiplierAt:316`/`buildTipWidthCurve:364`/`setTipWidthCurveValue:384` 都拥有自己的规则。而「勿复制公式」正被上方 8 行的 `splitForkT` 违反 |
| **`strand-tip-width.js:36-38` 的「同步点清单」指向一个并不调用它的函数** | `strandSplitBandXs` 上方 | 清单声称 `strand-geometry.js createSplitStrandGeometry` 是同步点，但该函数**并不调用** `strandSplitBandXs`——它在 `strand-geometry.js:120` 自写同一条 `lerp(minX, maxX, position*0.5+0.5)`。即这是**第 8 条两副本规则**，也是 `strandSplitBandXs` 导出无 importer 的原因 |
| `strand-tip-width.js:4-5` 文件头「本文件只补管内横向坐标推导与 override 组装」 | 文件头 | **范围已扩大**：现还含 `strandTipBlendStartT`（跨管 min）、`profileTopZAt`、发尖链再锚定（`strandTipChainTransformAt`/`applyStrandTipChainTransform`）与世界空间 placement 链。与 `:229-234` 的 Phase D 段头互相不一致 |
| `panel-tip-strand.js:33` 行号引用「bone-view-handles.js **L5** import 这个名字」 | `TIP_WIDTH_CONTROL_POINTS` 上方 | **行号过期**：实际在 `bone-view-handles.js:14`。实质要求（勿改成本地字面量）仍正确 |
| `panel-split-tip-bones.md` 被 3 处文档标为「权威当前状态」 | devlog | **已在本轮修正**（README.md / js-change-annotations.md / 文档自身头部均已加作废清单） |
| 发丝侧导出 | `strand-tip-width.js` | **无死代码**。`strandTubeSideForkT`/`strandTipWidthResetCurve`/`strandTipWidthMultiplierAt`/`strandTipWidthEdgePosition`/`strandTipWidthControlPlacement` 均有生产调用点（app.js / bone-interaction / bone-view-handles / taper-editor），非仅测试可达 |
| **`tipWidthRecordsOppositeFork` 是死代码** | `panel-tip-strand.js:275-280` | **确认死**：它**不在** API 返回对象（`:1073-1104`）里，全仓库（含 tests/ 与 scripts/）**零引用**。它是 `tipWidthRecordsOppositeForkFrom` 的薄适配器，而后者**是活的**——由 `tip-width-curve.js` 内部（`:127`/`:189`）与 `tests/tip-width-curve.test.mjs` 直接调用。**连带**：`panel-tip-strand.js:23` 的 `tipWidthRecordsOppositeForkFrom` import 只为喂这段死代码而存在。**建议删** `:270-280` + 该 import。**注意：被删的是 panel 侧的空壳适配器，不是 §4.7 要求保留的守卫本体** |
| **`tipWidthControlTs` 别名零读者** | `panel-tip-strand.js:228`（`const tipWidthControlTs = sharedTipWidthControlTs`）、API `:1083`、`app.js:20755`（`__ahsTest` seam） | **确认无读者**：无任何代码调 `panelTipStrand.tipWidthControlTs` 或 `t.tipWidthControlTs`；`tests/tip-width-curve.test.mjs:13` 是**直接从 `tip-width-curve.js` import** 的。别名 + 其 2 行注释 + API 条目 + seam 条目可一并删。**但先确认** `scripts/verify-tip-select.mjs` 不经 seam 用它（该脚本目前 47/51，本身待单独一轮修） |
| API / deps 暴露无外部读者（函数本体仍活） | `tipWidthSideExposesT`（`:251`，API `:1085`）、`tipMainSectionPoint`（`:440`，API `:1094`）、`tipWidthCommonForkT` 的 `taperEditorDeps` 接线（`app.js:8660`） | **中低**。三者函数本体均在文件内部被调用（非死代码），但**对外暴露**无人读：`taper-editor.js` 只读 `deps.tipWidthSideForkT`/`deps.tipWidthSideControlTs`。`tipWidthCommonForkT` 的读者仅测试（`split-tip-geometry.test.mjs:496`、`verify-tip-select.mjs:1197`）。清理暴露面时可摘，**函数本体不要删** |
| `strand-tip-width.js` 的 `?v=` 缓存号 | 5 个消费方仍写 `?v=20260829-2` | **需另一路确认**：该文件本轮被并发改动（另一路在修绿色把手跟随），若约定是「内容变即 bump」则该 tag 已过期。仓库有 `scripts/check-stale-cache-params.mjs` 可裁决；**本审计未跑**（该文件不属本轮可动范围） |

## 7. 建议的处置顺序（若后续开一轮）

0. **改注释（零风险，先做）**：更正 `strand-tip-width.js:84` 的「三处」、`panel-tip-strand.js:186-188` 的适配器范围、`strand-tip-width.js:36-38` 的同步点清单、`panel-tip-strand.js:33` 的行号、`strand-tip-width.js:76` 的「Phase D 尚未接入」。**过期注释比重复代码更危险**（standards 有先例：一行过期结论让 agent 把修复改回去）。
1. **删两处死代码**：`tipWidthRecordsOppositeFork`（`panel-tip-strand.js:270-280` + `:23` import）与 `tipWidthControlTs` 别名（`:228` + API `:1083` + `app.js:20755`）。删前 grep 确认 `verify-tip-select.mjs` 不经 seam 用它。
2. **`globalCurve` 按侧选择 + 曲线写入序列 collapse**（§2b b2/b3）。**排在结构类抽取最前**：它是唯一「修过真 bug 却有两份实现」的规则。
3. **`export SPREAD_MAX`** + `segment-control.js` 改 import + 8 处内联字面量替换（**不含**曲线 position 的 0.99）。零语义变化、无新依赖边、护栏已有。
4. **fork-T collapse**。**先从 `panel-tip-strand.js` 内部那两份开始**（同文件、零跨模块协调），再处理 `usda-export.js` ×3 与 `project-files.js` ×2。先跑等价探针（含负高度的不可达性论证），再逐处替换。
5. **7 个 `(splits, index)` 薄适配器上移进 `tip-width-curve.js`**（§2b b1）。机械但触及 panel 侧签名里那个从不读取的 `lock` 参数 ⇒ 需同步改 `taperEditorDeps` / `__ahsTest` / 测试调用点。
3. **`firstExposedTipChainIndex` 真 import** 进 usda-export（两处），保留跨消费方一致性断言。
4. **splits 归一化三副本 collapse**——**最后做**，因三份 legacy 回退条件写法不同，需先逐条对齐。
5. dep-bag：加「两份文本相等」断言（一行）。
6. `bone-view-handles.js:230` panel 创建块改用描述子，消除同函数内的不对称。
7. **`tipWidthPlacementAt` + 引导线采样抽进 `tip-width-curve.js`**（§2b）。**排在最后**：它动的是**用户可见的把手可见性判定**，按 standards「修 bug 不夹带设计变更」应单独一轮、单独确认；抽取时须保留 `tests/split-tip-geometry.test.mjs:1709` 的「placement 非 null ⇔ `tipWidthSideExposesTAt`」双射断言作为验收。

> **本审计未涉及的相邻文件**：`modules/bones/tip-sub-bone-host.js`、`bone-view-handles.js`、`bone-interaction.js`、`strand-tip-width.js`、`tests/split-tip-geometry.test.mjs` 在本轮由另一路改动占用（发丝 WidthCurve 绿色把手跟随拖拽的 bug 修复），本文只读不改；§2/§2b 中涉及这些文件的行号在那轮合并后**需重新定位**。

> **每一步的验收**：`node --test "tests/*.test.mjs"` 全绿（本审计期间基线由 **342/342** 升至 **347/347**——并发的 0.2.127 一路新增 5 条发尖把手跟随断言）+ 对 panel 侧做「改动前 HEAD 逐值对比」探针（0.2.126 的做法：`splitBonesFor` / `mirrorSplitBones` / 索引钳位三组）。**不要只靠套件全绿**——套件里 panel 的发尖断言在 0.2.125 抽取共享层时一条未改仍全绿，真正的证据是逐字节等价探针。

## 8. 验证方式（本审计的证据）

- **fork 三副本等价性**：以 `[]`（N=0）、`[{h:0.4}]` 的管 0/管 1、`[{h:0.4},{h:0.2}]` 的管 1 四组输入，分别跑 `strandSplitForkTForSegment`、`strandTubeForkT`、panel `splitForkT` 的字面复制、`tipWidthCommonForkFromHeights`：**后三者在全部真实用例上逐值相同**（0.6/0.6/0.6）。`bone-model` 版在 N=0 输入上返回 0.7 而非 1，原因是它经 `strandSplitsFor` 走了 **legacy 标量回退**（`strandSplitHeight ?? 0.3` → `1 − 0.3`），属**刻意的归一化**而非公式差异；该输入在 split 发丝上不可达（恒 ≥1 拉链）。
- **dep-bag 无漂移**：两份 `strandTipWidthGeoDeps` 逐行读取比对，四项与顺序一致。
- **store / 键名**：`panelTipSelection`/`panelTipHover` 在**全部生产代码中已归零**，仅存 1 处解释性注释（`sculpt-edit-store.js:15`）与 2 条**负向**测试断言（`tests/strand-segment-ui.test.mjs:423/426`，作用正是钉住改名）。
- **计数**（0.2.126 现场统计，非沿用旧文档）：app.js **20,788** 行；`modules/**/*.js` **104** 文件 / 约 **41,800** 行；`-store.js` **19** 个文件 = 18 域 store + `scene-store` 基类；`sculptState` **79** 键；`tests/*.test.mjs` **16** 个文件。`FUNCTION_INDEX` 重新生成为 **2,293** 函数 / **105** 文件（原 2,154 / 101，且缺 `tip-width-curve.js`/`strand-tip-width.js`/`tip-sub-bone-host.js`/`bridge-export.js` 四个模块）。
- **测试基线**：审计开始时 **342 pass / 0 fail**，结束时 **347 pass / 0 fail**（并发的 0.2.127 一路新增 5 条）。两次均一次跑过，未出现 `uv-pack-async` 的负载 flake。

## 9. fork-T collapse 已完成（0.2.133）

§2 第一行与 §7 步骤 4 **已执行**。审计当时记为 7 处，0.2.132 之后实际为 **9 处**（`usda-export.js`
的 panel 分支拆成 `splitBoneLayout` / `splitChainLayout` 两处、`tip-width-curve.js` 自身含
`tipWidthSideForkFromHeights` 内的回退式）。9 处全部折叠，**逐值/逐字节等价已实测**。

**定义点（`modules/geometry/tip-width-curve.js`）现为两个入口，算术只有一份**：

| 入口 | 缺侧语义 | 消费方 |
|---|---|---|
| `tipWidthCommonForkFromHeights(l, r)` | `?? 0`（缺侧 = 零深拉链） | `tipWidthSideForkFromHeights` 回退式、`strand-tip-width.js` `strandTubeForkT`、`strand-geometry.js` `sectionSplitStart`、`usda-export.js` `strandForkTForTube`、`project-files.js` 发丝分支 |
| `tipWidthCommonForkFromPresentHeights(l, r)` | guard（只让在场高度参与 max，全缺 → 1）；**委托**上一个入口做算术 | `panel-tip-strand.js` `splitForkT`、`usda-export.js` `splitBoneLayout`/`splitChainLayout` 的 panel 分支、`project-files.js` panel 分支 |

**为何必须保留两个入口**（不是疏漏）：两者在**非负**高度上逐值相同，仅在「单侧相邻 zipper
在场且其 `height < 0`」时不同（guard → >1，`?? 0` → 1）。而导出侧/存档蒙皮侧读的是**原始**
`lock.panelSplits` —— `.ahs` 经 `JSON.parse` 进来，loader **不钳** height（`normalizePanelSplits`
的 `[0, 0.78]` 只作用于 app.js 的编辑路径），所以负高度在手改存档上**可达**。0.2.133 刻意
保留该分支语义（重构不夹带行为变化）。该边界由测试钉住。

**刻意未折叠的 2 处**：
1. `bone-model.js` `strandSplitForkTForSegment`（lock 版归一化入口）。`tip-width-curve.js`
   反向 `import { SPREAD_MAX }` 自 `bone-model.js` ⇒ 折叠会造成**循环依赖**。
2. `scripts/verify-skeleton-layout.mjs:47` `forkTFor`。它是校验生产实现的**独立 oracle**，
   改成调用被测代码会让该校验自证、失去判别力。

**验收证据**：
- `node --test "tests/*.test.mjs"`：**364 → 364 pass / 0 fail**（新增 3 条 fork-T 断言后
  367，见下）。
- **逐字节等价探针** `scripts/probe-forkt-equivalence.mjs`（新增，可复跑）：HEAD 与
  collapse 后两份 JSON **SHA-256 完全相同**（398,528 bytes）。覆盖 ① 合成输入全笛卡尔积
  （含负高度 / NaN / 字符串 / null 等**越界**取值）；② 真实 `assets/presets/layered-side-bun.ahs`
  全部 lock × 全部段的 `splitBoneLayout` / `splitChainLayout` 输出；③ `createSplitStrandGeometry`
  的**完整 position / uv / index 数组**（6 组 splits × 3 组 tipClump，全精度写出）。
- `scripts/verify-skeleton-layout.mjs`：**40/41**（与 collapse 前逐条相同；唯一 FAIL 是
  "0 bridge children"，该 preset 无桥接子发片，与本轮无关）。
  ⚠ 该脚本默认路径 `D:/Downloads/Sussurro_v1_0046.ahs` **在本机不存在**，故 130/130 基线
  未能复跑；上述 40/41 是可达替代基线。
- **负对照**：`tests/split-tip-geometry.test.mjs` 的
  "0.2.133 negative control: the fork-T detector actually catches a reintroduced formula"
  先证明检测正则能抓住 6 种历史写法、且不误报 4 种无关 `Math.max` 用法，**然后**才用它断言
  5 个消费方文件不含该公式。这样 `doesNotMatch` 不会因正则写错而假绿。
