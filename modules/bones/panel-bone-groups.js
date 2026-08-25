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

