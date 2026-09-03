// tip-sub-bone-host.js - 发尖子骨骼「宿主适配器」：panel 段与普通发丝管的单一分派点。
//
// 为什么要这一层（0.2.126）：发尖子骨骼的**选择 / 把手 / gizmo / 笔刷**四条路径原本全部
// 硬绑 panel（clonePanelSplits + materializeSplitBones + panelTipStrand.splitTipForSegment），
// 普通发丝只有「拖最后一点」这一条退化路径。要让两边共用同一套交互，必须先有一个
// 「给我 lock，告我这个几何的段划分 / 段骨骼 / 每段发尖链 / 每段 fork」的适配器，否则每条
// 路径都会各自 if(geometryType) 分叉 —— 那就是 standards 明令禁止的「同一推导多个定义点」。
//
// 与 bone-model.js 的 segmentBoneHost 的分工：那边是**纯数据**分派（段数 / 段骨骼数组 /
// 段索引 store 键），可在 node 里直接用；这里是**几何**分派（发尖链物化、fork、参考法线），
// 必须注入 app.js 的曲线/帧函数，所以单独成层而不是塞进 bone-model。本模块自身仍是
// 「createXxxApi(deps)」形态，不 import app.js。
//
// 消费方（改这里必须回看全部）：
//   - modules/bones/bone-view-handles.js  发尖链把手 / 法线箭头 / 引导线
//   - modules/bones/bone-interaction.js   gizmo attach + rotate/translate 应用 + 视平面拖拽 + 笔刷
import * as THREE from "three";
import {
  materializeSplitBones,
  materializeStrandSplitBones,
  segmentBoneHost,
  splitBonesFor,
  strandSplitBonesFor,
  strandSplitForkTForSegment,
  strandSplitsFor,
  PANEL_SEGMENT_HOST,
  STRAND_SEGMENT_HOST
} from "./bone-model.js?v=20260901-1";
import { tipChainFrameAt } from "../geometry/tip-sub-bone.js?v=20260830-2";
// 中间层 tier 解析所需的两块地基（0.2.157/0.2.159 已落地、未接线）：
//   panel-bone-groups.js —— 分组树本身是纯数据模块，可以直接 import 具名函数
//   （不经 deps），与 bone-model.js 里 segmentBoneHost 等纯数据分派同规格。
//   syntheticSplitsForLeafSpan 同理是 panel-tip-strand.js 顶层的纯函数（不依赖
//   createPanelTipStrandApi 的 deps 闸门），可以直接 import；splitTipForLeafSpan /
//   splitForkT / tipChainFrameAt 三个仍是 deps.panelTipStrand 的 API 方法，走注入。
import {
  materializePanelBoneGroups,
  panelBoneGroupAtPath,
  panelBoneGroupLeafSpan,
  panelBoneGroupTip
} from "./panel-bone-groups.js?v=20260925-13";
import { syntheticSplitsForLeafSpan } from "../geometry/panel-tip-strand.js?v=20260910-21";

// deps: panelTipStrand（panel 侧发尖链/fork/帧）+ clonePanelSplits + currentStrandSplitTipChains
//   + strandGeometryCurve + strandGeometryFrameAt。
// 与 bone-view-handles / bone-interaction 各自的 strandTipWidthGeoDeps 转发同理：两个消费方
// 都从自己的 deps 构造本 API，因此**必须注入同样的五项**，否则把手位置与编辑基准会来自
// 不同变换链（一按下就跳）。
export function createTipSubBoneHostApi(deps) {

// 「当前选中的分组路径」。**由本模块自己向 deps 取**，而不是让六个 resolveTipHost 调用点
// 各自把 groupPath 传进来 —— 那六处分散在 bone-view-handles（把手显示）与 bone-interaction
// （拖拽/笔刷）两个模块里，一旦有一处漏传，就会出现「把手画在中间层、拖拽却写回叶子」
// 这种最难查的读写不同源（本轮已经栽过一次同类：候选点取 lock 层、写入取分组层，
// 表现为「选中中间层却刷到主发片」，548 条测试全绿也没抓到）。
// 收在这一处，读写两侧天然同源；缺这个 dep 时返回 null ⇒ 逐字回落到接线前行为。
const selectedGroupPath = () => {
  const fn = deps.selectedPanelBoneGroupPath;
  if (typeof fn !== "function") return null;
  const path = fn();
  return Array.isArray(path) && path.length ? path : null;
};

// ── 中间层接线（本轮新增，用户原话：「现在只能落在最尖端或者主发丝, 不能落在中间层并
// 修改中间层走向」） ──────────────────────────────────────────────────────────────
//
// resolvePanelTierSpan：groupPath（分组树路径，如 selectedPanelBoneGroup.path）解析出的
// 叶子闭区间。只在两种情况下返回非 null：① groupPath 是非空数组 ② 该路径确实指向一个
// **真中间层**（leafStart < leafEnd，覆盖 ≥2 个叶子）。
//
// ★ 为什么把「叶子节点退化」判在这里而不是留给下游：leafStart === leafEnd 的节点就是
// 今天 `bones` 数组里的某一个叶子段本身，**不是新语义**——如果在这里把它当"中间层"分支
// 处理，反而是给一个已有的东西造第二个定义路径。让它在这里就返回 null，调用方
// resolveTipHost 会因此直接走原有代码（一字未动），退化因此不是"新逻辑的特例分支"，
// 而是"新逻辑压根没被触发"——这是本文件其它函数（如 panel-tip-strand.js 的
// splitTipForLeafSpan）一贯的退化写法，此处照抄同一原则。
// groupPath 为空/非法/panelBoneGroupLeafSpan 找不到路径 ⇒ 同样返回 null（安全回落，
// 不抛异常，行为与"没传 groupPath"一致）。
function resolvePanelTierSpan(lock, groupPath) {
  if (!Array.isArray(groupPath) || !groupPath.length) return null;
  const span = panelBoneGroupLeafSpan(lock, groupPath);
  if (!span || span.leafStart === span.leafEnd) return null;
  return span;
}

// panelTierHost：真中间层（tierSpan.leafStart < tierSpan.leafEnd）命中时的宿主对象。
//
// ★ 为什么 tierSpan 能让「把手显示」与「拖拽写回」自动同源（不需要另写一条同步代码）：
// bone-view-handles.js 遍历 0..segmentCount-1 对每个叶子段各建一套把手，调用
// `host.tipChainFor(segment)` 取链、`host.bones[segment]` 取骨骼；bone-interaction.js 的
// 拖拽写回同样先 `host.bones[segment]` 取 bone 再 `bone.tip = ...` 写。这两条路径过去各自
// 独立按 segment 索引，互不知道对方——因为过去每个 segment 天生对应**唯一**一条叶子链，
// 「同步」这件事从不存在。中间层把同一件事变复杂：一个 tierSpan 覆盖**多个** segment，
// 如果「这几个 segment 该显示哪条链」与「这几个 segment 该写回哪个 bone」分别用两套推导，
// 只要有一处对不齐就会出现"画的是 A、写的是 B"（0.2.160 的笔刷 bug 就是这一类真因）。
// 这里的解法是让两条路径共享同一份**只读闭包变量** `tierBone`：
//   - `bones` 数组里，tierSpan 覆盖的每个 segment 下标全部替换成同一个 `tierBone` 引用
//     （不是各自的深拷贝）——bone-interaction.js 对任意一个覆盖段调用 `writeTipEdit(bone,…)`
//     实质都是 `tierBone.tip = …`，天然写到同一个地方；
//   - `tipChainFor(segment)` 对任意覆盖段都调用同一个
//     `splitTipForLeafSpan(lock, leafStart, leafEnd, splits, tierBone)`，天然读同一份数据。
// 「同一个引用」是同源的根本原因，不是靠额外的一致性校验换来的——两条路径压根没有分岔的
// 机会，因为它们消费的是同一个 JS 对象。
//
// tierBone 的取法分 materialize / 只读两条，与本文件叶子段既有的
// `materializeSplitBones(lock) : splitBonesFor(lock)` 二选一是同一套约定：
//   - materialize=true（编辑路径）：先物化整棵分组树（`materializePanelBoneGroups`，
//     幂等、不冲已创作值），再按 groupPath 取**活引用**节点本身当 bone——分组节点自带
//     `tip` 字段（形状与 splitBone.tip 逐键相同，见 panel-bone-groups.js 的
//     normalizeGroupTip），不需要另外包一层对象，`writeTipEdit` 直接 `node.tip = …` 就是
//     `setPanelBoneGroupTip` 想做的事，只是不必再多导入那一个函数。
//   - materialize=false（只读放置路径，把手位置用）：不物化、不脏 lock，只读
//     `panelBoneGroupTip(lock, groupPath)` 取内容，包一层 `{ tip }` 满足
//     `splitTipForLeafSpan` 的 `groupBone?.tip` 读取契约即可，没有值时 tip=null，
//     `splitTipForLeafSpan` 对 null groupBone 的既有契约是"返回纯 rest 链"（未创作时也能
//     摆出正确位置，只是没有 authored delta），不是错误分支。
//
// forkTFor / chainFrameAt 对覆盖段使用「合成 splits + 虚拟 vIdx」（0.2.157 的
// syntheticSplitsForLeafSpan，与 splitTipForLeafSpan 内部走的是同一份推导）：span 两端
// 真正的边界 zipper 在合成数组里恰好落在 vIdx 两侧，因此 splitForkT / tipChainFrameAt
// 这两个既有函数不需要改一行——喂合成参数后它们各自重算出来的就是"整个 span 的边界"，
// 而不是 span 内部某个叶子自己的边界。这是与 splitTipForSegment 复用的同一条设计原则
// （见 panel-tip-strand.js 对 splitTipForLeafSpan 的说明），此处对 fork/frame 两个下游
// 再次套用，不新写公式。
function panelTierHost(lock, host, splits, bones, tierSpan, groupPath, materialize) {
  const { leafStart, leafEnd } = tierSpan;
  const { splits: synthSplits, vIdx } = syntheticSplitsForLeafSpan(splits, leafStart, leafEnd);
  const tierBone = materialize
    ? (() => {
      const root = materializePanelBoneGroups(lock);
      return root ? panelBoneGroupAtPath(root, groupPath) : null;
    })()
    : { tip: panelBoneGroupTip(lock, groupPath) };
  const coversSegment = (segment) => segment >= leafStart && segment <= leafEnd;
  return {
    host,
    kind: "panel",
    splits,
    // 覆盖段全部指向同一个 tierBone 引用（见函数头注释「自动同源」）；未覆盖段保留各自
    // 原来的叶子 bone，不受影响——一个 lock 上可能同时存在"选中的中间层"与"该层之外仍
    // 按叶子编辑的段"，两者互不干扰。
    bones: bones.map((bone, segment) => (coversSegment(segment) ? tierBone : bone)),
    tierSpan,
    segmentCount: host.segmentCount(lock),
    pointCount: host.tipChainPointCount(lock),
    // 第 6 个实参 groupPath（0.2.168）：让中间层自己也能继承**更浅**的中间层 delta
    // （L3 挂在 L2 下时 L3 的 rest 要被 L2 顶起来）。不传的话嵌套层会各自独立算 rest，
    // 于是刷 L2 带不动 L3 —— 与用户报的「叶层挂在主骨骼下」是同一个缺陷在更深一层的翻版。
    tipChainFor: (segment) => (coversSegment(segment)
      ? deps.panelTipStrand.splitTipForLeafSpan(lock, leafStart, leafEnd, splits, tierBone, groupPath)
      : deps.panelTipStrand.splitTipForSegment(lock, segment, splits, bones[segment] || null)),
    forkTFor: (segment) => (coversSegment(segment)
      ? deps.panelTipStrand.splitForkT(lock, vIdx, synthSplits)
      : deps.panelTipStrand.splitForkT(lock, segment, splits)),
    chainFrameAt: (segment, tip, t) => (coversSegment(segment)
      ? deps.panelTipStrand.tipChainFrameAt(lock, tip, tip, t, vIdx, synthSplits)
      : deps.panelTipStrand.tipChainFrameAt(lock, tip, tip, t, segment, splits))
  };
}

// 解析出「本 lock 的发尖子骨骼宿主」。返回 null = 该几何没有段发尖子骨骼。
// materialize 参数：true 时走 materializeBones（深克隆 + 双写 lock 字段，返回**活引用**，
// 编辑路径必须用它，否则写进去的 bone.tip 会随派生数组一起被丢弃）；false 走 bonesFor
// （只读视图，把手放置用，不脏 lock）。这条区分是 panel 侧既有约定，发丝完全同构。
// groupPath 参数（本轮新增）：分组树路径（如 `selectedPanelBoneGroup.path`），只对 panel
// 宿主生效——发丝没有分组树，groupPath 在发丝分支里从未被读取，传了也不会有任何效果。
// 不传（当前全部既有调用点都不传）⇒ tierSpan 恒为 null ⇒ 直接走下面**一字未改**的原代码，
// 这保证了在中间层接线上线的这一刻，任何尚未更新的调用点行为完全不变。
// groupPath 省略时**自动**取当前选中的分组路径（见 selectedGroupPath 的注释：收在一处
// 才能保证把手显示与拖拽写回同源）。显式传入仍然优先，便于测试注入与将来的特殊调用。
function resolveTipHost(lock, { materialize = false, groupPath } = {}) {
  const host = segmentBoneHost(lock);
  if (!host) return null;
  const effectiveGroupPath = groupPath === undefined ? selectedGroupPath() : groupPath;
  if (host === PANEL_SEGMENT_HOST) {
    if (lock.panelSplitEnabled === false) return null;
    // splits 走 clonePanelSplits（归一化 + legacy 标量回退），与几何/发尖链同真源。
    const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    if (!splits.length) return null;
    const bones = materialize ? materializeSplitBones(lock) : splitBonesFor(lock);
    if (!bones) return null;
    // 真中间层命中：整段提前返回，下面的原有代码保持完全不变（退化路径的字节级依据）。
    // 两处都必须用 effectiveGroupPath，不能用形参 groupPath —— 用后者会让自动取值失效，
    // 而且失效方式是静默的（tierSpan 恒 null ⇒ 永远走叶子路径 ⇒ 中间层又变成不可编辑）。
    const tierSpan = resolvePanelTierSpan(lock, effectiveGroupPath);
    if (tierSpan) return panelTierHost(lock, host, splits, bones, tierSpan, effectiveGroupPath, materialize);
    return {
      host,
      kind: "panel",
      splits,
      bones,
      segmentCount: host.segmentCount(lock),
      pointCount: host.tipChainPointCount(lock),
      // panel 的发尖链由 panel-tip-strand 生成（rest = 段中心线在面板表面上的曲率链）。
      tipChainFor: (segment) => deps.panelTipStrand.splitTipForSegment(
        lock, segment, splits, bones[segment] || null
      ),
      forkTFor: (segment) => deps.panelTipStrand.splitForkT(lock, segment, splits),
      // 段中心的面板表面帧作为参考法线（含 camber/曲率），与 panel 既有 tipChainFrameAt 一致。
      chainFrameAt: (segment, tip, t) => deps.panelTipStrand.tipChainFrameAt(
        lock, tip, tip, t, segment, splits
      )
    };
  }
  if (lock.hairCard) return null;
  const bones = materialize ? materializeStrandSplitBones(lock) : strandSplitBonesFor(lock);
  if (!bones) return null;
  const splits = strandSplitsFor(lock);
  // 发丝侧发尖链**一律**取 currentStrandSplitTipChains：它是 0.2.120 物化空间的真源
  // （rest = 该管扫掠环心 + spread/direction 张开，points = rest + authored delta）。
  // 绝不在本模块自己物化一条链：那会用近似的「主曲线 + 侧向偏移」当 rest，与视口画的管心
  // 不一致，编辑基准一错发尖就会跳。测试用 source-text 负向对照守住这一点。
  const chains = deps.currentStrandSplitTipChains(lock);
  return {
    host,
    kind: "strand",
    splits,
    bones,
    segmentCount: host.segmentCount(lock),
    pointCount: host.tipChainPointCount(lock),
    tipChainFor: (segment) => chains?.[segment] || null,
    // fork 走 bone-model 的 strandSplitForkTForSegment（1 - max(相邻拉链高度)）——
    // 与几何 sectionSplitStart、strand-tip-width strandTubeForkT 同一条推导，勿新写公式。
    forkTFor: (segment) => strandSplitForkTForSegment(lock, segment),
    // 参考法线取该管 fork 以上的发丝几何帧 z（发丝表面外法线），对应 panel 的段表面帧 z。
    // 复用 tip-sub-bone.js 的几何无关 tipChainFrameAt：y=链切线、z=参考法线经 rest→authored
    // 弯曲旋转后正交化、x=横向，与 panel 走的是同一个原语。
    chainFrameAt: (segment, tip, t) => tipChainFrameAt(
      tip,
      tip,
      t,
      deps.strandGeometryFrameAt(lock, deps.strandGeometryCurve(lock), THREE.MathUtils.clamp(t, 0, 1)).z
    )
  };
}

return { resolveTipHost, PANEL_SEGMENT_HOST, STRAND_SEGMENT_HOST };
}
