// panel-bone-groups.js — Panel 分叉「分组树」纯函数模块（阶段 1.5-A）。
//
// 契约（四类不得省略的注释：同步点 / 易错点 / 钳位理由 / 刻意不改的坐标空间——全部在此）。
//
// 【1. 叶子划分不变量】本模块只描述「哪些连续叶子被分到同一组」，绝不触碰叶子本身。
// 叶子 = 今天的 lock.panelSplits（zipper 数组，长度 N）划出的 N+1 个平级段，这套划分的
// 唯一真源仍是 app.js 的 normalizePanelSplits；本模块不 import 它、不复制其钳位逻辑，
// 只接受已按 position 升序排好的 zipper 数组作为输入。任何本模块的操作（派生 / 归一化 /
// 寻址 / 回落）都不得改变叶子的连续覆盖关系——这是分组树在几何上「零风险」的根本原因
// （devlog/in-progress/panel-bone-tree-plan.md §3.0、验收判据 V3：分组变更不改变渲染几何）。
// zipper i 分隔叶子 i 与 i+1（zipper 数组下标即左叶子下标）。leafStart/leafEnd 是叶子的
// 整数下标闭区间，**不是** u 坐标、不是 zipper 的 position——坐标空间刻意保持整数下标，
// 因为分组树只描述拓扑归属，u 坐标仍完全由 panelSplits 单点持有（§3.1）。
//
// 【2. 层级 = 嵌套位置，不是 height 全局排名（本轮最容易犯的错）】派生算法必须递归构造：
// 在当前节点的叶子区间内部，取「最浅」的 zipper 切分，深度 = 递归层数，而不是把所有
// zipper 的 height 放到全局里统一排名再分层。两种算法在真实数据上给出不同答案——计划
// 文档 §5.2 记录过反例：全局排名会把 Sussurro Front Bangs 1 的某处分隔误判到 L4，正确
// 的递归构造给出 L3。height 相同的 zipper 必须留在同一层做平级兄弟，不能为了造出一条
// 唯一路径而强行分成两层（Test 1 的 `[0.3, 0.3]` 必须是 L2 下三个平级兄弟，不是两层嵌套）。
//
// 【3. 深度钳位（clampedFlat）】depth 达到 MAX_PANEL_BONE_DEPTH 时不再加深：该节点内部
// 剩余的全部 zipper 在同一层铺平成兄弟（每个兄弟 depth 仍等于当前节点的 depth，不再 +1），
// 并打 `clampedFlat: true` 标记。这样做的理由：宁可在深度上限处让多条 zipper 挤在同一层
// 平铺，也不能丢数据或报错——叶子划分必须保持完整（每个 zipper 仍然是某个兄弟的边界），
// 这是「不报错、不丢数据」这条硬约束在代码里的落点。
//
// 【4. 派生只在缺失时跑】本模块的 derivePanelBoneGroups 是「一次性迁移」用的纯函数，
// 不持有任何状态、不知道「是否已经派生过」——是否要调用它由上层（bone-model.js /
// 存档读取路径）决定：只有当 lock.panelBoneGroups 缺失时才调用一次，用户拖拽过之后
// 产生的分组树要原样保留、绝不能被本模块的派生结果覆盖（devlog §5.2「一次性」）。
//
// 【5. 跨文件同步点】本模块不 import three.js、不 import 任何既有模块（bone-model.js /
// tip-width-curve.js 等），是纯函数、无副作用、可独立单测。它与 bone-model.js 的
// 唯一耦合点是「叶子数 = panelSplits.length + 1」这条既有规则的复述（normalizePanelBoneGroups
// 的 leafCount 参数由调用方按这条规则算好传入，本模块不重新推导）。曲线回落规则
// （resolvePanelBoneGroupValue）是把 tip-width-curve.js 的 buildTipWidthCurveFrom 里
// 「segment 无创作数据 ⇒ 回落 lock 层曲线」这条既有两级回落（注释原文 "sampling falls
// back to the global curve below the fork"）推广成沿分组链的多级回落，本模块只提供
// 通用的链上查找，不知道具体是哪一条曲线字段。

// 分组树最大深度：根 panel = L1（用户拍板），最深 L5。与 MAX_SPLIT_SEGMENTS（同层段数
// 上限，bone-model.js:8）是两条独立的轴：一条限制「多深」，一条限制「多宽」，互不影响。
export const MAX_PANEL_BONE_DEPTH = 5;

// 分组节点的 7 个「可创作」字段：派生出的节点里全部为 null（表示「继承祖先，未创作」），
// 归一化时缺失的字段也补齐为 null。字段清单与含义见计划文档 §3.1 / §6.1（绿框
// #panelZipperGroup 内的全部控件对应字段）。
const AUTHORABLE_KEYS = [
  "tipClump",
  "taperCurve",
  "taperCurveSecondary",
  "depthCurve",
  "depthCurveSecondary",
  "splitEnabled",
  "splitSnapToLoops"
];

// ── 中间层骨骼载体：tip（发尖链）───────────────────────────────────────────────
// 用户拍板：像 `L2.Segments 2-3` 这种覆盖多个叶子的中间层分组，笔刷应该刷「这一层自己的
// 发尖链」而不是刷到主发片上——因为目前几何上只有「主发片链」+「每叶子一条发尖链」两层，
// 中间层没有承载体。本模块负责让分组节点能挂一条自己的发尖链，几何生成是另一个子智能体
// 的工作，这里只管数据形状与读写语义。
//
// ★ tip 为什么绝不能塞进 AUTHORABLE_KEYS：那个白名单是给「沿链回落的标量/曲线」用的——
// resolvePanelBoneGroupValue 会从 path 指向的节点往根方向找第一个非 null 的祖先，语义是
// 「这一层没创作就继承上一层」。tip（发尖链）不是这种东西：它是「这一层是否存在一条属于
// 自己的发尖骨骼」，要么这一层自己有、要么没有，**绝不能从祖先或子孙借用**——L2 没有发尖链
// 不代表应该拿 L1（主发片）或某个 L3 叶子的发尖链顶替，那样几何上会长错位置。如果误把 tip
// 塞进 AUTHORABLE_KEYS，setPanelBoneGroupValue/resolvePanelBoneGroupValue 会把它当成可继承
// 值处理，読取时会出现「L2 自己没创作却显示了别层的发尖链」这种语义错误。所以 tip 单独用
// 三个专用导出（panelBoneGroupTip / setPanelBoneGroupTip / clearPanelBoneGroupTip）管理，
// 不经过白名单、不参与链上回落。
function makeLeafNode(leafStart, leafEnd, depth) {
  const node = { leafStart, leafEnd, depth, children: null, tip: null };
  for (const key of AUTHORABLE_KEYS) node[key] = null;
  return node;
}

// 递归构造一个分组节点。zips 是 { leftLeaf, rightLeaf, height } 的数组（leftLeaf/rightLeaf
// 是该 zipper 分隔的两个相邻叶子下标，height 是 zipper 的既有 height 字段）。
// lo/hi 是当前节点覆盖的叶子闭区间，depth 是当前节点的深度（根 = 1）。
function buildGroupNode(zips, lo, hi, depth) {
  const node = makeLeafNode(lo, hi, depth);
  if (lo === hi) return node; // 规则 3：单叶子恒为叶节点
  // 只取「落在本区间内部」的 zipper：leftLeaf/rightLeaf 都必须落在 [lo, hi] 以内，
  // 边界外的 zipper 属于祖先层，已经在更上层被消费掉了。
  const inner = zips.filter((z) => z.leftLeaf >= lo && z.rightLeaf <= hi);
  if (!inner.length) return node; // 区间内部没有可切的 zipper ⇒ 叶节点
  if (depth >= MAX_PANEL_BONE_DEPTH) {
    // 规则 5：撞深度上限，本层内部剩余 zipper 全部铺平成同层兄弟，不再递归加深。
    const sorted = inner.slice().sort((a, b) => a.leftLeaf - b.leftLeaf);
    node.children = [];
    let start = lo;
    for (const z of sorted) {
      node.children.push(makeLeafNode(start, z.leftLeaf, depth));
      start = z.rightLeaf;
    }
    node.children.push(makeLeafNode(start, hi, depth));
    node.clampedFlat = true;
    return node;
  }
  // 规则 4：本层内部「最浅」的 zipper（height 最小）负责切分；height 相同的一起在
  // 本层做平级兄弟，绝不递归造出人为的链。
  const minHeight = Math.min(...inner.map((z) => z.height));
  const cuts = inner.filter((z) => z.height === minHeight).sort((a, b) => a.leftLeaf - b.leftLeaf);
  node.children = [];
  let start = lo;
  for (const cut of cuts) {
    node.children.push(buildGroupNode(zips, start, cut.leftLeaf, depth + 1));
    start = cut.rightLeaf;
  }
  node.children.push(buildGroupNode(zips, start, hi, depth + 1));
  return node;
}

// ── 阶段 3：zipper 层级可显式存储 + 按钮升/降 ─────────────────────────────────────────
// 合法层级：整数，且落在 [2, MAX_PANEL_BONE_DEPTH]（根恒为 1，是 panel 本体，不是任何一条
// zipper 能取到的层级，故 zipper 的层级下界是 2——最浅的子节点深度）。
function isValidBoneLevel(value) {
  return Number.isInteger(value) && value >= 2 && value <= MAX_PANEL_BONE_DEPTH;
}

// 从一棵已经建好的分组树反推「每条 zipper 的实际嵌套深度」：zipper i 分隔叶子 i 与 i+1，
// 对应树上某个节点的第 k 个子节点与第 k+1 个子节点之间的边界，边界处的深度 = 该子节点自身
// 的 depth（clampedFlat 时子节点深度与父节点相同、正常时子节点深度是父节点+1，两种情况
// 这里都不用关心——直接读子节点已经算好的 depth 即可，不重新推导一遍钳位规则）。
// 这是 materialize / normalize 共用的核心：「层级」永远以树的真实结构为准，不是别的算法。
function computeZipperDepths(root, count) {
  const depths = new Array(count).fill(null);
  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) return;
    const kids = node.children;
    for (let i = 0; i < kids.length; i += 1) {
      if (i < kids.length - 1) depths[kids[i].leafEnd] = kids[i].depth;
      walk(kids[i]);
    }
  };
  walk(root);
  return depths;
}

// 与 buildGroupNode 结构完全对称，唯一差异：切分依据从 height 换成显式 boneLevel（取本层
// 内部「最小 boneLevel」的 zipper 切分，而不是最浅 height）。深度钳位分支与 buildGroupNode
// 逐字复制——撞 MAX_PANEL_BONE_DEPTH 时的「不报错、不丢数据」这条约束对两条建树路径必须
// 是同一份规则，不能各写一套后来慢慢长歪。
function buildGroupNodeFromLevels(zips, lo, hi, depth) {
  const node = makeLeafNode(lo, hi, depth);
  if (lo === hi) return node;
  const inner = zips.filter((z) => z.leftLeaf >= lo && z.rightLeaf <= hi);
  if (!inner.length) return node;
  if (depth >= MAX_PANEL_BONE_DEPTH) {
    const sorted = inner.slice().sort((a, b) => a.leftLeaf - b.leftLeaf);
    node.children = [];
    let start = lo;
    for (const z of sorted) {
      node.children.push(makeLeafNode(start, z.leftLeaf, depth));
      start = z.rightLeaf;
    }
    node.children.push(makeLeafNode(start, hi, depth));
    node.clampedFlat = true;
    return node;
  }
  const minLevel = Math.min(...inner.map((z) => z.level));
  const cuts = inner.filter((z) => z.level === minLevel).sort((a, b) => a.leftLeaf - b.leftLeaf);
  node.children = [];
  let start = lo;
  for (const cut of cuts) {
    node.children.push(buildGroupNodeFromLevels(zips, start, cut.leftLeaf, depth + 1));
    start = cut.rightLeaf;
  }
  node.children.push(buildGroupNodeFromLevels(zips, start, hi, depth + 1));
  return node;
}

// §5.2 派生：从 panelSplits（已按 position 升序）推导初始分组树。只在 lock.panelBoneGroups
// 缺失时由上层调用一次；本函数本身不知道、也不关心「是否已经派生过」。
export function derivePanelBoneGroups(panelSplits) {
  const splits = Array.isArray(panelSplits) ? panelSplits : [];
  const leafCount = splits.length + 1;
  if (leafCount <= 1) return makeLeafNode(0, 0, 1);
  const zips = splits.map((split, index) => ({
    leftLeaf: index,
    rightLeaf: index + 1,
    height: Number(split?.height) || 0
  }));
  return buildGroupNode(zips, 0, leafCount - 1, 1);
}

// 有效分组树：已创作的 lock.panelBoneGroups 优先，否则按 panelSplits 现场派生。
// **与 bone-model.js 的 splitBonesFor 同构**（stored 命中 → 否则派生默认值、且都**不写回**），
// 刻意照抄那条既有约定，好让「读取永远有值、落盘只在用户真的编辑过时发生」这条语义在两处一致。
//
// 为什么放在本文件而不是 bone-model.js：给 bone-model.js 新增 export 会迫使它的
// **13 个 import 站点**全部同步 bump `?v=`（实测 13 处，全部 `?v=20260901-1`），
// 而回访用户若拿到缓存的旧 bone-model 却解析新 export，会 SyntaxError 整个应用打不开
// （0.2.110 踩过）。本函数只读 lock.panelSplits / lock.panelBoneGroups 两个字段，
// 不需要 bone-model 的任何内部实现 ⇒ 放这里可以让 bone-model.js 一字不改。
// 优先级（三级回落，从「最明确的创作意图」到「纯派生」）：
//   ① lock.panelBoneGroups —— 完整的已创作分组树，最明确，直接用；
//   ② panelSplits 上的 boneLevel —— 用户用 Zipper Levels 面板调过层级（阶段 3），按显式
//      level 建树；
//   ③ 都没有 ⇒ 按 height 现场派生（一次性迁移路径）。
//
// ★ ② 这一级是**必须**的，漏了它 = 层级按钮失效：阶段 3 曾漏写，症状是 outliner 里 zipper
// 的层级标签会从 L2 变 L3、但下面的段分组**一动不动**（按钮只改了个数字）。实测证据：
// 同一份 splits 带 boneLevel [3,2] 时，derivePanelBoneGroups 给出「根下三个平级 L2」，
// 而 panelBoneGroupsFromLevels 给出「L2[0..1] 内含两个 L3 + L2[2..2]」—— 两棵树不同，
// 而当时这里返回的是前者。**改层级的唯一可见效果就是分组变化，这一级不能省。**
export function panelBoneGroupsFor(lock) {
  const splits = Array.isArray(lock?.panelSplits) ? lock.panelSplits : [];
  const leafCount = splits.length + 1;
  const stored = normalizePanelBoneGroups(lock?.panelBoneGroups, leafCount);
  if (stored) return stored;
  if (splits.length && splits.every((split) => isValidBoneLevel(split?.boneLevel))) {
    return panelBoneGroupsFromLevels(splits);
  }
  return derivePanelBoneGroups(splits);
}

// 校验 + 归一化外部数据（读档路径用）。value 非法/缺失 ⇒ 返回 null（由调用方决定要不要
// 走 derivePanelBoneGroups 派生——本函数刻意不在这里自动派生，宁可让调用方看到明确的
// null 再决定，也不要在这里悄悄吞掉一份坏数据装作什么都没发生）。
export function normalizePanelBoneGroups(value, leafCount) {
  const totalLeaves = Number(leafCount);
  if (!Number.isFinite(totalLeaves) || totalLeaves < 1) return null;
  if (value == null || typeof value !== "object") return null;
  const root = normalizeNodeAt(value, 0, totalLeaves - 1, 1);
  if (!root) return null;
  return root;
}

// 校验并深拷贝一条发尖链；形状不合法 ⇒ null（「局部降级」的落点，理由见调用处注释）。
function normalizeGroupTip(raw) {
  if (raw == null || typeof raw !== "object") return null;
  if (!Array.isArray(raw.points) || !Array.isArray(raw.restPoints)) return null;
  if (raw.points.length !== raw.restPoints.length) return null;
  const toVec = (p) => ({ x: Number(p?.x) || 0, y: Number(p?.y) || 0, z: Number(p?.z) || 0 });
  return {
    points: raw.points.map(toVec),
    restPoints: raw.restPoints.map(toVec),
    twists: Array.isArray(raw.twists) ? raw.twists.map((v) => Number(v) || 0) : null,
    active: raw.active !== false
  };
}

function normalizeNodeAt(raw, expectedStart, expectedEnd, depth) {
  if (raw == null || typeof raw !== "object") return null;
  const leafStart = Number(raw.leafStart);
  const leafEnd = Number(raw.leafEnd);
  if (!Number.isInteger(leafStart) || !Number.isInteger(leafEnd)) return null;
  if (leafStart !== expectedStart || leafEnd !== expectedEnd || leafStart > leafEnd) return null;
  if (depth > MAX_PANEL_BONE_DEPTH) return null;
  const node = { leafStart, leafEnd, depth, children: null };
  for (const key of AUTHORABLE_KEYS) {
    node[key] = raw[key] === undefined ? null : raw[key];
  }
  // tip 的归一化选择「局部降级」而不是「整棵树判非法」：一条发尖链形状坏了（比如存档被
  // 手改或旧版本写出了长度不等的 points/restPoints），只丢这一层的发尖链，不该连累整棵
  // 分组树——分组树描述的是叶子划分这一份更重要的不变量，不能因为某一层的发尖链数据坏了
  // 就让 normalizePanelBoneGroups 整体返回 null（那样用户连基本的段划分都会丢，代价远大于
  // 丢一层发尖链）。校验规则：必须是对象、points 是数组、restPoints 也是数组且与 points
  // 等长（呼应 bone-model.js normalizeSplitBones 里 tip.points/restPoints 的既有形状约定，
  // 但这里不像那边一样「restPoints 缺失时允许 null」——分组层 tip 若要携带 delta 语义，
  // points 与 restPoints 必须成对出现，缺一即视为非法）。
  node.tip = normalizeGroupTip(raw.tip);
  const rawChildren = raw.children;
  if (rawChildren == null) {
    return node; // 叶节点
  }
  if (!Array.isArray(rawChildren) || !rawChildren.length) return null;
  const clampedFlat = raw.clampedFlat === true;
  if (clampedFlat) node.clampedFlat = true;
  // 子节点必须连续、无缝、恰好覆盖父节点自身的叶子区间——不满足视为非法（宁可回落派生，
  // 不要吞掉错误数据装作没事）。clampedFlat 的子节点深度与父节点相同，否则子深度 = 父深度+1。
  const childDepth = clampedFlat ? depth : depth + 1;
  const children = [];
  let cursor = leafStart;
  for (const rawChild of rawChildren) {
    const childStart = Number(rawChild?.leafStart);
    if (!Number.isInteger(childStart) || childStart !== cursor) return null;
    const childEndCandidate = Number(rawChild?.leafEnd);
    if (!Number.isInteger(childEndCandidate) || childEndCandidate < childStart || childEndCandidate > leafEnd) {
      return null;
    }
    const child = normalizeNodeAt(rawChild, childStart, childEndCandidate, childDepth);
    if (!child) return null;
    children.push(child);
    cursor = childEndCandidate + 1;
  }
  if (cursor !== leafEnd + 1) return null; // 未恰好覆盖到父节点右端 ⇒ 非法
  node.children = children;
  return node;
}

// 叶子划分：返回 [[start, end], ...]，按叶子下标升序、连续无缝。用于断言「分组变更前后
// 叶子划分未变」（验收判据 V3 的机械化前提）。
export function panelBoneGroupsLeafPartition(root) {
  const partition = [];
  const walk = (node) => {
    if (!node) return;
    if (!Array.isArray(node.children)) {
      partition.push([node.leafStart, node.leafEnd]);
      return;
    }
    for (const child of node.children) walk(child);
  };
  walk(root);
  return partition;
}

// 遍历，根→叶顺序（父必先于子），供依赖「祖先先重建」的锚点采样链使用（计划 §2.4）。
export function forEachPanelBoneGroup(root, visit) {
  if (!root || typeof visit !== "function") return;
  const walk = (node, path) => {
    visit(node, path);
    if (!Array.isArray(node.children)) return;
    node.children.forEach((child, index) => walk(child, [...path, index]));
  };
  walk(root, []);
}

// 路径寻址：path 是整数数组，如 [1,0] = 根的第 1 个子的第 0 个子。path 为空数组 ⇒ 根节点。
// path 本身非数组（null/字符串等）视为非法路径 ⇒ null，不与「空数组=根」混淆。
export function panelBoneGroupAtPath(root, path) {
  if (!root) return null;
  if (!Array.isArray(path)) return null;
  if (!path.length) return root;
  let node = root;
  for (const index of path) {
    if (!Number.isInteger(index) || index < 0) return null;
    if (!node || !Array.isArray(node.children)) return null;
    const child = node.children[index];
    if (!child) return null;
    node = child;
  }
  return node;
}

// 某个叶子下标所在的最深节点路径（即该叶子对应的叶节点路径）。
export function panelBoneGroupPathForLeaf(root, leafIndex) {
  if (!root) return null;
  const target = Number(leafIndex);
  if (!Number.isInteger(target)) return null;
  if (target < root.leafStart || target > root.leafEnd) return null;
  const path = [];
  let node = root;
  while (Array.isArray(node.children)) {
    const index = node.children.findIndex((child) => target >= child.leafStart && target <= child.leafEnd);
    if (index < 0) return null;
    path.push(index);
    node = node.children[index];
  }
  return path;
}

// 某条 zipper 归属的「拥有这条切缝」的分组节点路径——outliner 里点某条 zipper 行时应该
// 选中的父层。zipper i 分隔叶子 i 与 i+1（文件头规则 1），outliner 用 child.leafEnd（左子
// 节点的右边界）作为这一行的下标（见 app.js 两处调用点）。「拥有」的定义：存在相邻子节点
// 对 children[k]、children[k+1]，使 children[k].leafEnd === zipperIndex——这条切缝正是
// 在这个节点内部把它的子节点分开的那一刀，故这个节点是它的所有者。
//
// 遍历骨架照抄 isSoleShallowestCutInGroup（同文件内）：都是「走到某节点，看它 children 数组
// 里相邻两个的边界是否等于目标下标」，唯一差异是那边只返回布尔、这里收集并返回 path。
// 不新发明遍历方式，避免这里长出第二套结构判断逻辑。
//
// ★ 返回值语义（[] 与 null 不同，调用方必须能区分）：
//   - 找到 ⇒ 返回拥有该切缝的节点的 path（数组）。切缝恰好是 root 自己拥有（即 root 的
//     children 数组里就含有这个边界）⇒ 返回**空数组 []**，代表根节点——[] 是「根拥有它」
//     这个明确答案，不是"没找到"。
//   - 找不到（zipperIndex 越界、root 为 null/undefined、root 是单叶子树没有 children、
//     或 zipperIndex 根本不是整数）⇒ 返回 **null**，且不抛异常——安全回落是本模块既有约定
//     （normalizePanelBoneGroups / panelBoneGroupAtPath 等都遵循「非法输入返回 null」而不是
//     抛错）。切勿把 [] 与 null 混用：`if (result)` 足够区分两者（[] 是 truthy），但
//     `assert.ok(result)` 这类真值判断在测试里无法区分 [] 与非空数组，写断言时要用
//     `deepStrictEqual` 显式比较。
//
// ★ 为什么不能与 panelBoneGroupPathForLeaf 合并成一个函数：那个函数回答的是「叶子下标 →
// 覆盖它的最深叶节点路径」，永远沿着"包含该叶子"的分支一路走到底（children===null 才停）。
// 本函数回答的是完全不同的问题——「哪个节点内部的子节点边界正好卡在这条 zipper 上」，命中
// 点必然是某个**有 children 的中间/根节点**，绝不会是叶节点（叶节点没有子节点边界可言）。
// 两者在同一个 zipperIndex 上通常给出不同的路径（叶子路径更深、切缝路径更浅），语义方向
// 相反，合并会让调用方必须靠额外参数分辨「我要哪种」，反而更容易用错。
export function panelBoneGroupPathForZipper(root, zipperIndex) {
  if (!root) return null;
  const target = Number(zipperIndex);
  if (!Number.isInteger(target)) return null;
  const walk = (node, path) => {
    if (!node || !Array.isArray(node.children)) return null;
    const kids = node.children;
    for (let i = 0; i < kids.length - 1; i += 1) {
      if (kids[i].leafEnd === target) return path;
    }
    for (let i = 0; i < kids.length; i += 1) {
      const found = walk(kids[i], [...path, i]);
      if (found) return found;
    }
    return null;
  };
  return walk(root, []);
}

// ── 层级继承：某个叶子的「祖先中间层」链 ──────────────────────────────────────────────
// 返回从根到该叶子路径上、**严格介于根与叶子之间**的节点数组（由浅到深）。
//
// 为什么两头都排除：
//   - 根（path 为空）**就是主骨骼**（同 panelBoneGroupTierNodes 的注释）。主骨骼已经通过
//     tipSurfaceFrameAt 决定了整条 rest 链，把它当作"祖先 delta"会把主骨骼的位移叠加两次。
//   - 叶子自己的 delta 由它自己的 bone.tip 承担（materializeTipChain 那一层），不属于"继承"。
// 于是返回的正是「用户在 outliner 里能选中、且位于该叶子之上的那些中间层」。
//
// 用途：叶子链的 rest 必须先被祖先各层的 delta 顶起来，否则刷中间层带不动叶层
// （0.2.168 用户报「L3.Segments 2/3 应该挂在这个中间骨骼下, 而不是挂在主骨骼下」）。
// 纯函数、只读，不物化：与 panelBoneGroupTip 同一个套路，直接在传入的 root 上走。
export function panelBoneGroupAncestorsForLeaf(root, leafIndex) {
  const path = panelBoneGroupPathForLeaf(root, leafIndex);
  if (!path || path.length < 2) return [];
  const out = [];
  let node = root;
  // 走到倒数第二个下标为止：最后一个下标指向叶子本身，刻意不含它。
  for (let i = 0; i < path.length - 1; i += 1) {
    node = node.children?.[path[i]];
    if (!node) return out;
    out.push(node);
  }
  return out;
}

// §3.3：曲线/参数沿分组链向上回落到最近的「已创作」（非 null）祖先。path 指向的节点出发，
// 向上查找第一个 key 非 null 的祖先（含自身），都为 null ⇒ 返回 fallback。
// 这不是新发明：tip-width-curve.js 的 buildTipWidthCurveFrom 已经在做「segment 无创作
// 数据 ⇒ 回落 lock 层曲线」的两级回落，本函数把它推广成沿链多级回落。
export function resolvePanelBoneGroupValue(root, path, key, fallback) {
  if (!root || !Array.isArray(path)) return fallback;
  const chain = [root];
  let node = root;
  for (const index of path) {
    if (!node || !Array.isArray(node.children)) break;
    const child = node.children[index];
    if (!child) break;
    chain.push(child);
    node = child;
  }
  for (let i = chain.length - 1; i >= 0; i -= 1) {
    const value = chain[i]?.[key];
    if (value != null) return value;
  }
  return fallback;
}

// 物化：把每条 zipper 的「实际嵌套深度」写成显式 boneLevel，供按钮升/降级使用。
// 已有合法 boneLevel 的条目保留原值不覆盖——物化只补全缺失的，不篡改用户已经拍过的意图
// （与 materializeSplitBones 的「先取已存在值，缺失才补默认」是同一套语义）。
// 返回全新数组（每条浅拷贝 + boneLevel），绝不原地改入参：入参可能是 lock.panelSplits 的
// 直接引用，上层随时可能在别处仍持有旧引用做比较（例如变异测试要做深拷贝对照）。
export function materializePanelBoneLevels(panelSplits) {
  const splits = Array.isArray(panelSplits) ? panelSplits : [];
  const root = derivePanelBoneGroups(splits);
  const depths = computeZipperDepths(root, splits.length);
  return splits.map((split, index) => {
    const existing = split?.boneLevel;
    const boneLevel = isValidBoneLevel(existing) ? existing : depths[index];
    return { ...split, boneLevel };
  });
}

// 用显式 boneLevel 建树：所有条目都有合法 boneLevel（整数、2..MAX_PANEL_BONE_DEPTH）才生效，
// 否则回落 derivePanelBoneGroups——缺失/非法数据宁可回落到既有派生规则，也不要在这里悄悄
// 编造一个层级装作合法（呼应 normalizePanelBoneGroups 的既有取向）。
export function panelBoneGroupsFromLevels(panelSplits) {
  const splits = Array.isArray(panelSplits) ? panelSplits : [];
  const leafCount = splits.length + 1;
  if (leafCount <= 1) return makeLeafNode(0, 0, 1);
  const allValid = splits.every((s) => isValidBoneLevel(s?.boneLevel));
  if (!allValid) return derivePanelBoneGroups(splits);
  const zips = splits.map((split, index) => ({
    leftLeaf: index,
    rightLeaf: index + 1,
    level: split.boneLevel
  }));
  return buildGroupNodeFromLevels(zips, 0, leafCount - 1, 1);
}

// 规范化（本模块最关键的不变量）：level 只是「意图」，真正决定几何/树形的是嵌套深度，两者
// 会漂移——例：三条 zipper 全部 boneLevel=5，根内部「最小 level」就是 5，于是恰恰在这里切，
// 子节点的实际深度是 2 而不是 5。若不做这一步，UI 直接显示存储值会出现「按钮点了、数字变了、
// 树没变」的假象。规范化用 panelBoneGroupsFromLevels 建树后，把每条 zipper 的实际嵌套深度
// 写回它的 boneLevel，使「显示值 === 实际深度」恒成立。必须幂等：第二次规范化时树已经和
// 第一次算出的 level 自洽，深度不会再变，写回的值与已存的值相同。
export function normalizePanelBoneLevels(panelSplits) {
  const splits = Array.isArray(panelSplits) ? panelSplits : [];
  const root = panelBoneGroupsFromLevels(splits);
  const depths = computeZipperDepths(root, splits.length);
  return splits.map((split, index) => ({ ...split, boneLevel: depths[index] }));
}

// 升级（变浅，更早分隔）/ 降级（变深，更晚分隔）。zipperIndex 与叶子下标同一套口径（按
// position 升序的下标）。流程：先物化补全全部 level，改目标条目，再规范化——规范化会把
// 钳位后仍然越界的意图拉回真实深度，同时保证返回值的 level 立刻就是「显示值 = 实际深度」，
// 调用方不需要再额外调一次 normalize。
function shiftPanelBoneLevel(panelSplits, zipperIndex, delta) {
  const splits = Array.isArray(panelSplits) ? panelSplits : [];
  const materialized = materializePanelBoneLevels(splits);
  const index = Number(zipperIndex);
  if (!Number.isInteger(index) || index < 0 || index >= materialized.length) {
    return normalizePanelBoneLevels(splits);
  }
  // ★ 禁止降级「它所在分组里唯一的最浅切点」（用户拍板）。
  //
  // 为什么必须单独拦这一种：本模块有一条硬不变量「存储的 boneLevel 恒等于实际嵌套深度」
  // （否则 UI 显示值会与真实层级漂移、按钮变成骗人的）。这条不变量意味着**每个分组内部
  // 永远至少有一条 zipper 处在该组的最浅层**——规范化总会把最小 level 拉回到组深度+1。
  // 所以「把唯一的最浅切点再降一级」这个意图在数学上无法被满足：规范化只能反过来把它的
  // 同组兄弟全部拉浅一级。实测后果（Test 3，levels [3,2,3,4,5]，zipper1 是唯一 L2 切点）：
  // demote 之后变成 [2,2,2,3,4] —— zipper1 没变深，反而是 zipper0/zipper2 被拉上来当了
  // 根切点，整棵树全局重流；再 promote 因为已在下界 2 而是 no-op ⇒ **加号回不来**。
  // 6 个真实 panel 里 4 个中招。
  //
  // 语义上这个操作本来也不成立：把唯一的主分叉降级，等于「这个 panel 没有主分叉了」。
  // 所以这里直接拒绝并返回规范化后的原状（no-op，不抛异常），canDemote 会一致地返回 false
  // 让按钮置灰。**这不是钳位边界**（level 可能远未到 MAX），是结构性约束，故与下面的
  // THREE_clamp 分开判断。
  if (delta > 0 && isSoleShallowestCutInGroup(materialized, index)) {
    return normalizePanelBoneLevels(materialized);
  }
  const current = materialized[index].boneLevel;
  // 钳位：level 恒在 [2, MAX_PANEL_BONE_DEPTH]。已到边界时不抛异常，直接返回与入参
  // 深相等的新数组（no-op）——按钮在边界应当置灰，但即便被误触也不能报错或产生副作用。
  const next = THREE_clamp(current + delta, 2, MAX_PANEL_BONE_DEPTH);
  materialized[index] = { ...materialized[index], boneLevel: next };
  return normalizePanelBoneLevels(materialized);
}

// 本模块刻意不 import three.js（文件头注释已声明），这里只需要一个整数钳位，没有必要为此
// 破例引入依赖，手写等价逻辑即可。
function THREE_clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// 目标 zipper 是否是「它所在分组内唯一的最浅切点」。
// 判据走**树的真实结构**而不是 level 数字：找到该 zipper 对应的那条分组边界，看它所在的
// 父分组里、与它同深度的边界一共有几条。只有它自己一条 ⇒ 它是该组唯一的最浅切点。
// 用结构而不是数字，是因为 clampedFlat 那一层的子节点深度与父节点相同，纯比数字会误判。
function isSoleShallowestCutInGroup(materialized, index) {
  const root = panelBoneGroupsFromLevels(materialized);
  let sole = false;
  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) return;
    const kids = node.children;
    // 本组内部的切点：相邻子节点之间的边界，边界标识用左子节点的 leafEnd（= zipper 下标）。
    const cuts = [];
    for (let i = 0; i < kids.length - 1; i += 1) cuts.push(kids[i].leafEnd);
    if (cuts.includes(index) && cuts.length === 1) sole = true;
    for (const kid of kids) walk(kid);
  };
  walk(root);
  return sole;
}

export function promotePanelBoneLevel(panelSplits, zipperIndex) {
  return shiftPanelBoneLevel(panelSplits, zipperIndex, -1);
}

export function demotePanelBoneLevel(panelSplits, zipperIndex) {
  return shiftPanelBoneLevel(panelSplits, zipperIndex, 1);
}

// 判据必须与「跑一遍会不会真的变化」完全一致，不能只比 level 数字——规范化会把越界意图拉回
// 实际深度，数字可能变了但树没变（或数字没变但……不会发生，因为 promote/demote 是纯移动
// 意图后重新规范化）。这里直接跑一遍目标操作，比较结果树的叶子深度分布，用事实回答，不用
// 推断。深度分布用 forEachPanelBoneGroup 走一遍叶节点采集，比逐字段深比较更直接也更便宜。
function leafDepthSignature(panelSplits) {
  const root = panelBoneGroupsFromLevels(panelSplits);
  const sig = [];
  forEachPanelBoneGroup(root, (node) => {
    if (!Array.isArray(node.children)) sig.push(`${node.leafStart}:${node.leafEnd}:${node.depth}`);
  });
  return sig.join("|");
}

function wouldChangeTree(panelSplits, zipperIndex, delta) {
  const splits = Array.isArray(panelSplits) ? panelSplits : [];
  const before = leafDepthSignature(materializePanelBoneLevels(splits));
  const after = leafDepthSignature(shiftPanelBoneLevel(splits, zipperIndex, delta));
  return before !== after;
}

export function canPromotePanelBoneLevel(panelSplits, zipperIndex) {
  return wouldChangeTree(panelSplits, zipperIndex, -1);
}

export function canDemotePanelBoneLevel(panelSplits, zipperIndex) {
  return wouldChangeTree(panelSplits, zipperIndex, 1);
}

// ── 阶段 1.5-B：物化 + 按路径创作单个节点 ─────────────────────────────────────────
// 与 materializeSplitBones（bone-model.js）同一套语义：派生树是临时对象、不落盘，
// 用户要在某个分组节点上创作曲线之前，必须先把当前有效树「固化」成 lock.panelBoneGroups
// 上真正可写的结构，否则创作值无处安放（写完下一次读取又会被派生结果盖掉）。

// 深拷贝一棵分组树：物化写入 lock 前必须拷贝，不能让 lock.panelBoneGroups 与
// panelBoneGroupsFor 返回的临时对象共享引用——派生路径（buildGroupNode 等）每次都新建
// 节点，看似安全，但 stored 命中分支会直接返回 normalizePanelBoneGroups 建的树，那棵树
// 内部节点全是新对象，可以直接复用；为了不依赖「哪条分支返回了什么」这种脆弱假设，统一
// deep clone 一遍，语义上更安全也更好读。
function cloneGroupTree(node) {
  if (!node) return node;
  const copy = { leafStart: node.leafStart, leafEnd: node.leafEnd, depth: node.depth, children: null };
  for (const key of AUTHORABLE_KEYS) copy[key] = node[key] === undefined ? null : node[key];
  copy.tip = cloneGroupTip(node.tip);
  if (node.clampedFlat === true) copy.clampedFlat = true;
  if (Array.isArray(node.children)) copy.children = node.children.map(cloneGroupTree);
  return copy;
}

// 深拷贝一条发尖链（或 null）。与 normalizeGroupTip 分开：normalizeGroupTip 还要做形状校验，
// 这里假定输入已经合法（cloneGroupTree 只用在已经归一化过的树上），只负责不共享引用。
function cloneGroupTip(tip) {
  if (!tip) return null;
  const toVec = (p) => ({ x: p.x, y: p.y, z: p.z });
  return {
    points: tip.points.map(toVec),
    restPoints: tip.restPoints.map(toVec),
    twists: Array.isArray(tip.twists) ? tip.twists.slice() : null,
    active: tip.active !== false
  };
}

// 物化分组树：把 panelBoneGroupsFor 算出的「当前有效树」（可能是三级回落里任意一级，包括
// 纯派生的临时对象）固化写进 lock.panelBoneGroups，并返回写入后的根节点。
//
// 幂等是硬要求：调用方（width brush 落笔前）可能对同一个 lock 反复调用——例如刷了一笔又刷
// 一笔，每笔落笔前都会物化一次「确保可写」。若物化不做幂等检查、每次都用派生默认值重新
// 覆盖，第二笔物化时会把第一笔已经写好的创作值（比如某节点的 taperCurve）冲掉，用户刚
// 刷完的一笔在下一笔落笔的瞬间就消失了。所以：已经物化过、且合法（能通过 normalize 校验）
// 时，直接返回归一化后的既有树，不重新派生、不覆盖任何字段。
export function materializePanelBoneGroups(lock) {
  if (!lock) return null;
  const splits = Array.isArray(lock.panelSplits) ? lock.panelSplits : [];
  const leafCount = splits.length + 1;
  // 无 panelSplits ⇒ 不是 panel 数据，物化没有意义；不在 lock 上写任何字段，原样返回 null。
  if (!Array.isArray(lock.panelSplits)) return null;
  const existing = normalizePanelBoneGroups(lock.panelBoneGroups, leafCount);
  if (existing) {
    // 已物化且合法：只做归一化回写（修掉可能缺失的字段/depth 重算之类的表面差异），
    // 绝不用派生结果覆盖——这是幂等的核心，保护住已经存在的创作数据。
    lock.panelBoneGroups = existing;
    return existing;
  }
  const effective = panelBoneGroupsFor(lock);
  const materialized = cloneGroupTree(effective);
  lock.panelBoneGroups = materialized;
  return materialized;
}

// 按路径写一个字段——本模块最容易写错的一处，必须先把语义钉死在注释里：
//
// ★ 只写 path 指向的那一个节点自己的字段，绝不递归写子孙节点。用户原话：「笔刷仅可改变
// 选中的这一层, 而不是所有叶后代也一起刷」。子孙若自己是 null，读取时会经
// resolvePanelBoneGroupValue 自动沿链回落到这个新值——但那是**读取期**的效果，写入期
// 不做任何遍历、不touch 任何 children。子孙若已经有自己的创作值，那个值原样保留，因为
// 它比祖先的回落值更明确，不该被祖先的一次编辑悄悄抹掉。
//
// value === null 是合法输入，语义是「清除这一层的创作、恢复继承」，不是「非法值被拒绝」。
// ── 改层级后重建分组树（0.2.171）──────────────────────────────────────────────
//
// ★ 修的缺陷：`panelBoneGroupsFor` 的回落链是「stored → 按 boneLevel 建树 → 按 height 派生」，
// stored 优先。而改层级只写 `panelSplits[i].boneLevel`，不碰 `lock.panelBoneGroups` ⇒ 一旦这个
// lock 被物化过，改层级就**只变数字不变树**，层级按钮静默失效。
// 物化并不需要用户刻意做什么：`resolveTipHost`（tip-sub-bone-host.js）在**显示中间层把手**时
// 就会调 materializePanelBoneGroups ⇒ 用户只要用过一次中间层功能，按钮从此失效。
// 四个真实档（Test 3 / Test 4 / Sussurro 的两个 panel）全部复现。
//
// 为什么不能直接 `delete lock.panelBoneGroups` 让它重新派生：那会把**中间层节点上的全部创作
// 数据**（tip 发尖链、taperCurve/depthCurve 等 AUTHORABLE_KEYS）一起丢掉。用户刷过的中间层
// 曲线、拖过的中间层骨骼都会凭空消失。
//
// 所以做法是「重建 + 移植」：按新 boneLevel 建一棵干净的树，再把旧树上的创作值按
// **leafStart..leafEnd 相同**这个键搬到新树的对应节点上。
//
// ★ 为什么用 leaf span 而不是 path 做匹配键：path（如 [1,0]）是**结构位置**，改层级恰恰就是
// 在改结构 ⇒ 同一个 path 在新旧树里可能指着完全不同的区间。而 leaf span 是**语义身份**
// （「这一层管哪几片叶子」），用户心里的「那个中间层」指的就是这个。span 相同的节点在用户
// 看来就是同一层，创作值理应跟着走。
//
// 旧树里某个 span 在新树里不存在时，它的创作值**会丢失**，这是改层级的固有代价而非缺陷：
// 该层级已经不存在了，没有节点能承载它的值。（例：把唯一的 L3 拍平成 L2 后，原 L3 那一层
// 连同它的曲线一起消失。）刻意不做「找最接近的 span」这种模糊匹配——猜错了会把值搬到用户
// 没预期的层上，比明确丢失更难排查。
export function rebuildPanelBoneGroupsFromLevels(lock) {
  if (!lock || !Array.isArray(lock.panelSplits)) return null;
  const leafCount = lock.panelSplits.length + 1;
  // 未物化 ⇒ 无需重建：panelBoneGroupsFor 本来就会现场按 boneLevel 建树，已经是对的。
  // 这里返回 null 而不是建一棵树，保持「没物化过的 lock 不因为改层级而被物化」——
  // 物化会把树写进存档，凭空增大 .ahs 且让后续派生失效，不该由改层级这个动作触发。
  const stored = normalizePanelBoneGroups(lock.panelBoneGroups, leafCount);
  if (!stored) return null;

  const rebuilt = normalizePanelBoneGroups(panelBoneGroupsFromLevels(lock.panelSplits), leafCount);
  if (!rebuilt) return null;

  // 旧树按 span 建索引。同一个 span 在一棵合法树里只会出现一次（区间树的性质），所以
  // 不需要处理冲突。
  const bySpan = new Map();
  forEachPanelBoneGroup(stored, (node) => {
    bySpan.set(`${node.leafStart}:${node.leafEnd}`, node);
  });

  let moved = 0;
  let dropped = 0;
  const seen = new Set();
  forEachPanelBoneGroup(rebuilt, (node) => {
    const key = `${node.leafStart}:${node.leafEnd}`;
    seen.add(key);
    const old = bySpan.get(key);
    if (!old) return;
    for (const authorKey of AUTHORABLE_KEYS) {
      if (old[authorKey] != null) {
        node[authorKey] = old[authorKey];
        moved += 1;
      }
    }
    if (old.tip != null) {
      node.tip = old.tip;
      moved += 1;
    }
  });
  // 收集**消失了且带创作值**的层，连同它的 span 与创作值一起交给调用方。
  // 结构上消失但本来就空的层不算损失，不收。
  //
  // ★ 为什么返回节点而不只返回计数（0.2.172）：中间层消失时它的 WidthCurve 应该按各叶子
  // 自己的网格重采样后**写回叶子**，让视觉保持不变（用户拍板的「销毁时写回」）。但重采样
  // 需要 forkT/grid，那条推导链在 panel-tip-strand.js（几何侧），而本模块是纯拓扑模块、
  // 刻意不 import 任何几何 —— 所以本函数只负责**告诉调用方哪些层消失了、带着什么值**，
  // 由持有几何 API 的一侧去做重采样与写回。职责边界与本模块「不 import three.js」的既有
  // 约定一致，不为了少一次回调而把几何依赖拉进来。
  const droppedTiers = [];
  for (const [key, node] of bySpan) {
    if (seen.has(key)) continue;
    const hadValue = node.tip != null || AUTHORABLE_KEYS.some((k) => node[k] != null);
    if (!hadValue) continue;
    dropped += 1;
    // 只有覆盖 ≥2 个叶子的**真中间层**才有「写回各叶子」这回事；leafStart === leafEnd
    // 的节点就是叶子本身，它的值消失没有别的叶子可以承接。
    if (node.leafStart < node.leafEnd) {
      const values = {};
      for (const k of AUTHORABLE_KEYS) if (node[k] != null) values[k] = node[k];
      droppedTiers.push({ leafStart: node.leafStart, leafEnd: node.leafEnd, values });
    }
  }

  lock.panelBoneGroups = rebuilt;
  return { root: rebuilt, movedValues: moved, droppedNodes: dropped, droppedTiers };
}

// ── 增删 zipper 时保全分组树（0.2.173）────────────────────────────────────────
//
// ★ 修的缺陷：增删 zipper 改变 leafCount，而 `panelBoneGroupsFor` 里
// `normalizePanelBoneGroups(stored, leafCount)` 对 leafCount 不匹配的树**整棵拒绝** ⇒ 回落
// 现场派生 ⇒ **全部中间层创作值一起蒸发**（实测：2 个带值的中间层，增加一条 zipper 后有效树
// 里的创作值总数 0）。旧值其实还留在 `lock.panelBoneGroups` 上，只是读不到 —— 所以在改动
// 那一刻还能抢救，这是本函数存在的前提。
//
// 比改层级（0.2.171）更严重：那里存活的 span 还能保住值，这里是整棵树连同一切被丢弃。
//
// span 重映射公式（由「旧叶下标 → 新叶下标」推导，与 remapSegmentBonesOnInsert/OnDelete
// 的下标约定逐字对齐：insertIndex = 被一分为二的那个段；deleteIndex = 与其右邻合并的那个段）：
//   插入 i：a' = a<=i ? a : a+1     b' = b<i  ? b : b+1
//   删除 i：a' = a<=i ? a : a-1     b' = b<=i ? b : b-1
// 插入时若 i 落在 [a,b] 内，该层多管一片叶子（b+1）——这是对的：被细分的段仍属于这一层，
// 分成两半后两半都还属于它。删除时若两片被合并的叶子都在层内，该层少管一片。
//
// 退化：重映射后 a' === b' 的层只剩一片叶子，**不再是中间层**（与 resolvePanelTierSpan /
// bakeTierWidthCurve 的退化判据同一口径）。它的创作值没有「多个叶子」可以继续承载 ⇒ 连同
// span 一起报告给调用方，由持有几何 API 的一侧把曲线重采样写回那片叶子（同 0.2.172 的
// droppedTiers 通路，理由相同：重采样需要 forkT/grid，本模块刻意不 import 几何）。
export function remapPanelBoneGroupsForSplitChange(lock, kind, index, prevLeafCount) {
  if (!lock) return null;
  const stored = lock.panelBoneGroups;
  if (!stored) return null;                       // 未物化 ⇒ 无值可保全，现场派生本来就对
  const prev = normalizePanelBoneGroups(stored, prevLeafCount);
  if (!prev) return null;                         // 改动前就已不合法 ⇒ 无从保全
  const at = Math.floor(Number(index));
  if (!Number.isInteger(at) || at < 0) return null;
  const insert = kind === "insert";
  const nextLeafCount = insert ? prevLeafCount + 1 : prevLeafCount - 1;
  if (nextLeafCount < 1) return null;

  const mapStart = (a) => (insert ? (a <= at ? a : a + 1) : (a <= at ? a : a - 1));
  const mapEnd = (b) => (insert ? (b < at ? b : b + 1) : (b <= at ? b : b - 1));

  // 收集旧树上「带创作值的节点」按新 span 归档。根节点不收：它恒覆盖全部叶子，
  // 重映射后仍是根，值由 normalize 自己带过去。
  const carried = new Map();
  const pending = [];   // 候选：映射后仍是多叶区间的，等新树建好再看它还在不在
  const orphaned = [];  // 确定要写回叶子的（退化成单叶 / 或新树里没有这个 span）
  forEachPanelBoneGroup(prev, (node, path) => {
    if (!path.length) return;
    const values = {};
    let hasValue = false;
    for (const k of AUTHORABLE_KEYS) {
      if (node[k] != null) { values[k] = node[k]; hasValue = true; }
    }
    const tip = node.tip != null ? node.tip : null;
    if (!hasValue && !tip) return;
    const a = mapStart(node.leafStart);
    const b = mapEnd(node.leafEnd);
    if (a > b || a < 0 || b >= nextLeafCount) return;         // 映射出界 ⇒ 丢弃
    if (a === b) {
      // 退化成单叶：不再是中间层。只有原本是真中间层的才需要写回（原本就是叶子的
      // 节点其值本来就属于那片叶子，normalize 会照常带过去，不算「转移」）。
      if (node.leafStart < node.leafEnd) orphaned.push({ leafStart: a, leafEnd: a, values });
      return;
    }
    carried.set(`${a}:${b}`, { values, tip });
    pending.push({ key: `${a}:${b}`, leafStart: a, leafEnd: b, values });
  });

  // 按新 leafCount 派生一棵干净树，再把归档值贴回 span 相同的节点。
  // 用现场派生（按 height）而不是按 boneLevel：增删 zipper 之后 boneLevel 与实际结构的
  // 对应关系已被打断（新 zipper 没有 boneLevel、被删的那条带走了它的层级），
  // 此时 height 派生才是唯一自洽的重建依据。
  const rebuilt = normalizePanelBoneGroups(derivePanelBoneGroups(lock.panelSplits), nextLeafCount);
  if (!rebuilt) return null;

  let moved = 0;
  const landed = new Set();
  forEachPanelBoneGroup(rebuilt, (node, path) => {
    if (!path.length) return;
    const key = `${node.leafStart}:${node.leafEnd}`;
    const hit = carried.get(key);
    if (!hit) return;
    for (const [k, v] of Object.entries(hit.values)) { node[k] = v; moved += 1; }
    if (hit.tip != null) { node.tip = hit.tip; moved += 1; }
    landed.add(key);
  });

  // ★ 映射后仍是多叶区间、但新树里**不存在这个 span** 的层，同样要写回叶子。
  // 实测例子（3 zipper、heights 递增、在末段插一条）：旧树的 [2..3] 映射成 [2..4]，
  // 而按新 height 派生出来的树里只有 [1..3] / [2..3]，没有 [2..4] ⇒ 该层的曲线既没被
  // 移植、又不满足「退化成单叶」⇒ 第一版实现里它**既没保住也没写回**，静默丢失。
  // 这与 0.2.171 的 droppedNodes 是同一类缺口，所以两种情形统一按「叶子区间」写回。
  for (const p of pending) {
    if (landed.has(p.key)) continue;
    orphaned.push({ leafStart: p.leafStart, leafEnd: p.leafEnd, values: p.values });
  }

  lock.panelBoneGroups = rebuilt;
  return { root: rebuilt, movedValues: moved, orphanedTiers: orphaned };
}

export function setPanelBoneGroupValue(lock, path, key, value) {
  if (!AUTHORABLE_KEYS.includes(key)) return null;
  const root = materializePanelBoneGroups(lock);
  if (!root) return null;
  const node = panelBoneGroupAtPath(root, path);
  if (!node) return null;
  node[key] = value === undefined ? null : value;
  return root;
}

// 有效值：沿分组链回落后的结果，直接复用既有 resolvePanelBoneGroupValue——本函数只是把
// 「先拿到当前有效树」这一步一起做掉，方便 UI 调用方不用自己先取 root。
export function panelBoneGroupEffectiveValue(lock, path, key, fallback) {
  const root = panelBoneGroupsFor(lock);
  if (!root) return fallback;
  return resolvePanelBoneGroupValue(root, path, key, fallback);
}

// 该节点自己是否创作过（区别于「继承来的」），给 UI 做灰/斜体展示用。
// 判据用 `!= null`，不能用真值判断——0 与 false 都是合法的创作值（本模块 resolvePanelBoneGroupValue
// 的既有注释已经声明过这条：splitEnabled 可以被显式创作成 false，taperCurve 的某个数值
// 字段可以被显式创作成 0，两者都必须算作「自己创作过」，不能因为它们是假值就被判定成
// 「未创作」而被真值判断吞掉。）
export function panelBoneGroupHasOwnValue(lock, path, key) {
  if (!AUTHORABLE_KEYS.includes(key)) return false;
  const root = panelBoneGroupsFor(lock);
  if (!root) return false;
  const node = panelBoneGroupAtPath(root, path);
  if (!node) return false;
  return node[key] != null;
}

// ── 中间层骨骼载体：读写单层的发尖链 ───────────────────────────────────────────────
// 只读，不物化：panelBoneGroupTip 直接用 panelBoneGroupsFor 算出的「当前有效树」（可能是
// 三级回落里任意一级的临时对象），不写 lock、不改变任何状态——与 panelBoneGroupHasOwnValue
// 同一个只读套路。tip 不参与链上回落（见文件头 makeLeafNode 处的大段注释），所以这里只看
// path 指向节点自己的 tip，找不到节点或该层没创作过就返回 null。
export function panelBoneGroupTip(lock, path) {
  const root = panelBoneGroupsFor(lock);
  if (!root) return null;
  const node = panelBoneGroupAtPath(root, path);
  if (!node) return null;
  return node.tip ?? null;
}

// 写入该层自己的发尖链：先物化（同 setPanelBoneGroupValue 的既有套路——创作前必须先把当前
// 有效树固化成 lock.panelBoneGroups 上真正可写的结构），再只改 path 指向的这一个节点，绝不
// 触碰子孙（子孙若已有自己的 tip，原样保留；子孙若没有，也不会因为祖先这次写入而"继承"到
// 什么——tip 不回落，这条规则在写入侧的体现就是"只写这一层，不碰任何 children"）。
// tip 参数会先经过 normalizeGroupTip 校验形状，非法输入会被存成 null（与归一化路径的
// "局部降级"是同一份校验函数，不能两处各写一套）。
export function setPanelBoneGroupTip(lock, path, tip) {
  const root = materializePanelBoneGroups(lock);
  if (!root) return null;
  const node = panelBoneGroupAtPath(root, path);
  if (!node) return null;
  node.tip = normalizeGroupTip(tip);
  return root;
}

// 清除该层自己的发尖链，恢复"未创作"状态（tip = null）。同样只物化 + 只写这一层。
export function clearPanelBoneGroupTip(lock, path) {
  const root = materializePanelBoneGroups(lock);
  if (!root) return null;
  const node = panelBoneGroupAtPath(root, path);
  if (!node) return null;
  node.tip = null;
  return root;
}

// path 指向节点覆盖的叶子闭区间。几何侧用它算 centerU / forkT：中间层没有自己的 u 坐标，
// 只有「覆盖哪几个叶子」这条拓扑信息，叶子对应的 u 坐标仍完全由 panelSplits 持有（文件头
// 规则 1），本函数只读不物化，直接在 panelBoneGroupsFor 算出的当前有效树上找节点。
export function panelBoneGroupLeafSpan(lock, path) {
  const root = panelBoneGroupsFor(lock);
  if (!root) return null;
  const node = panelBoneGroupAtPath(root, path);
  if (!node) return null;
  return { leafStart: node.leafStart, leafEnd: node.leafEnd };
}

// 「当前应该显示/编辑哪一串骨骼」：返回 path 指向节点的**同层兄弟节点数组**（含自己），
// 按 leafStart 升序——用户要求 outliner 选中某个分组时，笔刷/视口只显示这一层的骨骼，不多
// 不少。根节点（path 为空数组）没有"同层兄弟"这个概念，根本身就是主骨骼，所以约定返回
// null，交给调用方去处理"显示主骨骼"这条分支——这里不返回 [root]，因为 [root] 会让调用方
// 误以为主骨骼也是"某一层的分组节点数组"之一，从而尝试给它取 tip/leafSpan 之类的分组语义。
export function panelBoneGroupTierNodes(lock, path) {
  if (!Array.isArray(path) || !path.length) return null;
  const root = panelBoneGroupsFor(lock);
  if (!root) return null;
  const parentPath = path.slice(0, -1);
  const parent = panelBoneGroupAtPath(root, parentPath);
  if (!parent || !Array.isArray(parent.children)) return null;
  return parent.children.slice().sort((a, b) => a.leafStart - b.leafStart);
}

// 分组行的标签：叶节点标它覆盖的 segment 下标（与「Segment 步进器」同一套 1-based 编号），
// 分组节点标区间。clampedFlat 的节点加一个提示，说明该层因为撞上 MAX_PANEL_BONE_DEPTH
// 被拍平（不是数据坏了）。
// ★ 从 app.js 挪到本模块（阶段 6，Segment 步进器要在枚举表上走，标签同样要在这里用）：
// 本函数是纯函数、只读 node 自身的 leafStart/leafEnd/depth/clampedFlat 四个字段，不依赖
// app.js 的任何状态，挪过来不改变任何调用点的行为，只是把「谁能读到它」的范围扩大到本模块
// 的其它导出（下面的 panelTierEnumeration 不需要它，但 segment-control.js 的步进器标签需要）。
export function panelBoneGroupNodeLabel(node) {
  const from = Number(node.leafStart) + 1;
  const to = Number(node.leafEnd) + 1;
  const span = from === to ? `Segment ${from}` : `Segments ${from}-${to}`;
  return `L${node.depth} · ${span}`;
}

// ── 阶段 6：Panel 步进器改走「分组树枚举表」──────────────────────────────────────
//
// 背景：用户要「Segment 步进器」在按 +/- 时能停在中间层（如 L2·Segments 2-3），不再只在
// 叶子之间跳。之前一版方案想改 resolveSegmentSelection 的 index 语义（叶子数组下标 →
// 枚举表行号），已被主脑否决：taper-editor.js 的 segmentCurveTargetForWrite 有
// `stored.length === count` 长度守卫（写入路径），把 count 改成枚举表长度会让该守卫恒假，
// 每次都落到 materializeBones 再用行号去索引叶子数组 —— 静默写错段（数据损坏级）。另有
// 7 处同样把 selection.index 当叶子数组下标用。resolveSegmentSelection 的语义**保持不变**，
// 步进器改走的是完全独立的一条路径：枚举表 → selectedPanelBoneGroup，不经过 index/count。
//
// 本函数返回分组树的扁平枚举表：前序遍历（父先于子，同父按 leafStart 升序），**跳过根**
// （L1 = 发片行自己，用户拍板不单独出行——与 outliner 的既有约定一致，见 app.js
// createOutlinerPanelBoneGroups 的「L1 是发片行自己 ⇒ 从根的子节点开始渲染」）。
//
// ★ 顺序必须与 outliner 渲染顺序逐位一致：outliner 走
// createOutlinerPanelBoneGroups → createPanelBoneGroupRow 的递归，对每个节点先渲染它自己
// 这一行，再递归它的 children（也是前序）；本函数照抄同一遍历顺序，否则步进顺序会与
// outliner 里视觉排列的顺序错位（用户按下一步却跳到视觉上不相邻的一行）。
//
// 返回 [{ path, node }, ...]，path 是可直接喂给 panelBoneGroupAtPath / setPanelBoneGroupValue
// 等既有函数的路径数组（根路径除外——根被跳过，不会出现在结果里）。
export function panelTierEnumeration(root) {
  const rows = [];
  if (!root || !Array.isArray(root.children)) return rows;
  const walk = (node, path) => {
    rows.push({ path, node });
    if (Array.isArray(node.children)) {
      node.children.forEach((child, index) => walk(child, [...path, index]));
    }
  };
  root.children.forEach((child, index) => walk(child, [index]));
  return rows;
}

