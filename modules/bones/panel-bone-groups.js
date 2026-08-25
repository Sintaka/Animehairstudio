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

function makeLeafNode(leafStart, leafEnd, depth) {
  const node = { leafStart, leafEnd, depth, children: null };
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

