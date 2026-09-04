# Panel 骨骼树：交接说明（写于 0.2.156 之后，**待建中间层几何**）

> **本文档的可信度分级**（本仓有过「交接说明本身是假的」的先例，故明确标注）：
> - 【实测】= 本轮会话中我亲自跑过命令并看到真实输出。
> - 【推断】= 由实测事实加上「之后我没有再改代码」推出，**接手时必须自己复验**。
> - 写作本文档时 bash 工具连续 5 次返回空（含一句 `echo hello`），当时无法复验；
>   **工具随后恢复，§1 已全部改为【实测】**（复验命令与真实输出见该节末）。

## 0. 一句话现状

阶段 1-5 已提交（0.2.152 → 0.2.156），分组树的**数据层、outliner 展示、层级按钮、选择同步、
逐级钻取**都已落地。但用户实测发现**缺了一大块：中间层级在几何上根本不存在**，
所以选中 `L2.Segments 2-3` 时没有高亮、笔刷会刷到主骨骼上。下一步就是补这一块，
**方案尚未拍板**（我提问时被用户打断，见 §4）。

## 1. 当前状态【已实测，2026-08-26】

| 项 | 值 |
|---|---|
| 分支 | `DHS/develop` |
| HEAD | `2793c36`（0.2.156，阶段 5） |
| `APP_VERSION` | `0.1.5-Sintaka.0.2.156` |
| `package.json` version | `0.1.5-Sintaka.0.2.63`（**刻意冻结，勿动**） |
| 入口缓存号 | `20260910-19`（index.html 2 处 + dom-contract 4 处） |
| `panel-bone-groups.js?v=` | `20260925-4`（app.js 唯一 import 站点） |
| 全量测试 | **496 pass / 0 fail**【实测】 |
| 工作树 | 干净（`git diff -w --numstat` 空；唯一未跟踪文件是本文档）【实测】 |

实测输出（2026-08-26，工具恢复后逐条跑）：

```
2793c36 0.2.156：Panel 骨骼树阶段 5 —— outliner↔视口选择同步 + 逐级钻取
APP_VERSION 0.1.5-Sintaka.0.2.156
git diff -w --numstat        -> (空)
git status --short | ^??      -> 只有本文档
# tests 496 / # pass 496 / # fail 0
check-commit-encoding.mjs    -> exit 0（静默）
index.html 20260910-19: 2  | ?v= total: 2
panel-bone-groups ?v= distinct: 20260925-4
```

复验命令（逐条跑，别只跑一条）：

```
git log --oneline -3
node -e "console.log(require('fs').readFileSync('modules/core/app-config.js','utf8').match(/APP_VERSION\s*=\s*\"([^\"]+)\"/)[1])"
git diff -w --numstat                 # 期望：空
git status --short | grep '^??'        # 期望：空（.tmp-bone-tree 已 gitignore）
node --test "tests/*.test.mjs" 2>&1 | grep -E '^# (tests|pass|fail)'
node scripts/check-commit-encoding.mjs # 期望：静默 exit 0
```

## 2. 五个阶段各做了什么（都已提交）

| commit | 版本 | 内容 |
|---|---|---|
| `6a75bf2` | 0.2.152 | 阶段 1：`modules/bones/panel-bone-groups.js` 分组树纯函数模块 + 28 条测试 |
| `bee16ef` | 0.2.153 | 阶段 2：outliner 只读展示 L2+ 层级（L1 = 发片行自己） |
| `cec4639` | 0.2.154 | 阶段 3：Zipper Levels 面板（amber 框）+ 层级升降按钮 |
| `a5c9790` | 0.2.155 | 阶段 4：分组行可选 + 笔刷只改选中层 + `scripts/check-commit-encoding.mjs` |
| `2793c36` | 0.2.156 | 阶段 5：outliner↔视口选择同步 + 逐级钻取 + import 完整性契约 |

### 核心不变量（阶段 1-5 的安全地基）

**叶子划分不变量**：分组树只描述「哪些连续叶子归为一组」，**绝不改变叶子划分本身**
（`panelSplits` 与 `splitBones` 一字不动）⇒ 改分组不改渲染几何。
这条让阶段 1-5 全程零几何风险，但**也正是它导致了 §3 的问题** —— 见下。

**boneLevel 恒等于实际嵌套深度**（`normalizePanelBoneLevels` 保证，幂等）。
推论：每组内永远至少有一条 zipper 处在该组最浅层 ⇒ 「降级唯一最浅切点」数学上无法满足，
故 `canDemote` 对这种情况返回 false（用户已拍板接受）。

## 3. ★ 用户实测发现的缺口（下一步要解决的核心问题）

用户原话逐字：

> 「先把选择系统完善, 我现在在大纲里选中L2.Segment 2-3, 视口对应的表现是选中主发片,
> 然后笔刷会刷到主骨骼上, 这不行, 选择系统现在尚有欠缺, 最终表现应该是现在的
> L2.Segment 2-3应该表现成主骨骼的一个发尖, 然后L3.segment 2/3是该层级的叶,
> 当我在大纲中选中L2.Segment 2-3的时候应该改变的是L2.Segment 2-3而不是主骨骼或者叶节点」

> 「这里好像缺了一大块, 因为目前完全没涉及到中间层级的创建, 我只看见了主发片和最尖端的发片」

> 「注意写好选中高亮shader, 现在选中L2.Segment 2-3没有高亮」

### 根因【实测确认，探针 `.tmp-bone-tree/probe-tip-tiers.mjs`，对照键 0 命中】

**几何上只存在两层，没有第三层：**

- `splitBonesFor(lock)` 恒返回 `panelSplits.length + 1` 个 bone —— **每个叶子段一个**
  （`bone-model.js` 的 `PANEL_SEGMENT_HOST.segmentCount`）。
- 每个 bone 携带 `bone.tip`（自己的发尖链），由 `materializeTipChain` 物化
  （`panel-tip-strand.js:1137`，`splitTipForSegment` 在 `:1119`）。
- ⇒ 存在的发尖链只有「每叶一条」。`L2.Segments 2-3` **没有 bone、没有发尖链、没有几何**，
  它纯粹是我的分组树上的一个标签。

三个症状是同一个根因：

1. **没有高亮** —— 没有可高亮的对象。
2. **笔刷刷到主骨骼** —— `widthBrushCurveArray` 因为该分组没有自己的 tip，回落到 `lock.taperCurve`。
3. **「只看见主发片和最尖端的发片」** —— 字面就是事实，几何上只有这两层。

⇒ 我的分组树给的是**创作层级**，且刻意保证不改几何。用户要的是中间层**本身就是一条真发尖**
（一个 bone + 一条跨 segment 2-3 的发尖链），L3 的两条发尖挂在它**下面**。
这就是「缺了一大块」：**中间层 bone/发尖链的创建**，阶段 1-5 全都没做。

## 4. ★ 待拍板的决策（我提问时被用户打断，**动手前必须先问**）

中间层（如 `L2.Segments 2-3`）应该是什么？三个候选：

- **A 真建中间层 bone + 发尖链（我推荐）**：L2 节点拥有自己的 bone 与发尖链（跨 segment 2-3），
  L3 的两条发尖链**以它为父**挂在下面。贴合用户原话「表现成主骨骼的一个发尖，L3 是该层级的叶」。
  代价：发尖链从「每叶一条」变成**每个树节点一条**，`splitBones` 从平铺数组变成树，
  `splitBonesFor` / `bonesFor` / 序列化 / `materializeTipChain` 均需改造。
  **几何会变**（这是必然的，也意味着 §2 的叶子划分不变量在这一步会被打破）。
- **B 不建几何，只做多选代理**：选中 L2 时高亮其下属两条叶发尖链，笔刷同时写这两条。
  改动小、风险低。**代价：与用户「表现成一个发尖」不符** —— 它仍是两条各自弯曲的链；
  也违反用户刚拍的「只改这一层」。
- **C 按需具体化**：L2 节点自己就是一条发尖链；只有当用户钻进 L2 并在其内部真的动过 L3 时，
  L3 才具体化成两条。最接近「逐级解锁」的心智模型，但 zipper 切缝何时生效变成隐式状态，
  **导出/渲染会取决于「你钻到哪一层」**，容易出意外。

**用户已确认我的根因判断正确**（原话：「你的判断是对的」），但**尚未选方案**。

## 5. 已知缺口（与本次交接无关但仍存在）

1. **曲线面板未接分组链**：`taper-editor.js` 的 `segmentCurveTarget`（`:194`）/
   `segmentCurveTargetForWrite`（`:214`）仍是 leaf→lock **两级**回落，没走
   `resolvePanelBoneGroupValue` 的多级链 ⇒ 选中非叶分组时 2D 曲线编辑器显示的是旧口径。
   **用户明确说「曲线先不管」**，故刻意未做。
2. **笔刷无真机视口测试**：只有源码级接线断言 + 数据层交叉核对，没有视口脚手架
   （本仓 width brush 一直有这个缺口）。
3. **N 叉的「对侧」语义**：`tipWidthRecordsOppositeForkFrom`（`tip-width-curve.js:169`）建立在
   二元 `side ∈ {-1,1}` 上（多处 `[-1,1].forEach`）。真 N 叉下需重新定义。
4. **bug2（panel 与发尖根部交界不平滑）**：用户早前主动延后，未处理。
5. **`panelBoneGroupOpen` / `selectedPanelBoneGroup` 无回收**：lock 删除后残留键不清理。
   与既有四个展开 Map 的行为一致（既有约定），非本轮引入。

## 6. 关键文件与函数索引

| 位置 | 作用 |
|---|---|
| `modules/bones/panel-bone-groups.js` | 分组树全部纯函数（20 个导出）。**先读文件头 5 条契约注释** |
| `app.js` `panelBoneGroupOutlinerApplies` | 门控：只对 panel 且真有 L2 生效，复用既有 `segmentBoneHost` |
| `app.js` `createOutlinerPanelBoneGroups` / `createPanelBoneGroupRow` / `createPanelBoneZipperRow` | outliner 递归渲染 |
| `app.js` `syncTipSelectionFromBoneGroup` | **分组选择 → tipSelection 的唯一派生点** |
| `app.js` `drillPanelBoneGroupToLeaf` | 逐级钻取 |
| `app.js` `widthBrushCurveArray` | 笔刷写入目标解析（含首笔播种） |
| `app.js` `panelBoneGroupSelectionCoversSegment` | 视口高亮用的覆盖谓词 |
| `modules/bones/bone-view-handles.js` `tipSelectionCoversSegment` | 高亮判据唯一收敛点（原 4 处重复） |
| `modules/geometry/sculpt-geometry.js` `applyWidthCurveBrushSample` | 经 `deps.widthBrushCurveArray` 取数组 |
| `modules/geometry/panel-tip-strand.js:1119` `splitTipForSegment` | **每叶一条发尖链的生成点（中间层要动这里）** |
| `modules/bones/bone-model.js:774` `PANEL_SEGMENT_HOST` | 段数/发尖链点数的唯一定义点 |
| `scripts/check-commit-encoding.mjs` | 提交前编码闸门（静默通过） |

### 测试文件（本项目新增，共 5 个）

- `tests/panel-bone-groups-derive.test.mjs`（7）派生规则
- `tests/panel-bone-groups-tree.test.mjs`（21）遍历/寻址/回落/归一化
- `tests/panel-bone-levels.test.mjs`（13）层级升降
- `tests/panel-bone-level-wiring.test.mjs`（6）层级改动真的改树
- `tests/panel-bone-materialize.test.mjs`（9）物化 + 只写选中层
- `tests/panel-bone-brush-wiring.test.mjs`（7）笔刷接线
- `tests/panel-bone-import-contract.test.mjs`（4）import 完整性

## 7. 铁律速查（本轮反复用到）

- **版本 bump 是 3 文件 8 处**：`app-config.js` 1 + `index.html` 2 + `dom-contract` 入口断言 4
  + `dom-contract` **点被转义**的版本断言 1（`grep '0.2.156'` **搜不到它**）。
  用 `.tmp-bone-tree/bump.mjs`（**每次重写常量，不要就地 sed 改**）。
- **CRLF 正确判据是「行尾种类未变」**，不是 `-w` 与 plain 的 shortstat 相等 ——
  重缩进会让两者合理地不等（本轮实测 181/17 vs 186/22，查证是 5 行纯缩进）。
- **`tipSelection = null` 只能出现 4 次**（`strand-segment-ui.test.mjs` 契约）。
- **给 app.js 加函数后，grep 它用到的每个外部标识符是否在 import 列表里** ——
  本轮真漏过一次（`panelBoneGroupPathForLeaf`），测试全绿但运行时会抛。
- **子智能体报告必须复核**：grep 声称新增的标识符 + 真键/假键对照；
  变异验证必须确认 `applied: true`，否则「变异没生效」会伪装成「测试通过」。
- 沙箱无 git 身份：`git -c user.name=Sintaka -c user.email=1274174087@qq.com commit`，
  中文提交信息用**单引号**。commit 后用 `git log --oneline -1` + `git show HEAD:<file>` 复核。
