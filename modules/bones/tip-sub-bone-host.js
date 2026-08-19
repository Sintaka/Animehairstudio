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
import { tipChainFrameAt } from "../geometry/tip-sub-bone.js?v=20260830-1";

// deps: panelTipStrand（panel 侧发尖链/fork/帧）+ clonePanelSplits + currentStrandSplitTipChains
//   + strandGeometryCurve + strandGeometryFrameAt。
// 与 bone-view-handles / bone-interaction 各自的 strandTipWidthGeoDeps 转发同理：两个消费方
// 都从自己的 deps 构造本 API，因此**必须注入同样的五项**，否则把手位置与编辑基准会来自
// 不同变换链（一按下就跳）。
export function createTipSubBoneHostApi(deps) {

// 解析出「本 lock 的发尖子骨骼宿主」。返回 null = 该几何没有段发尖子骨骼。
// materialize 参数：true 时走 materializeBones（深克隆 + 双写 lock 字段，返回**活引用**，
// 编辑路径必须用它，否则写进去的 bone.tip 会随派生数组一起被丢弃）；false 走 bonesFor
// （只读视图，把手放置用，不脏 lock）。这条区分是 panel 侧既有约定，发丝完全同构。
function resolveTipHost(lock, { materialize = false } = {}) {
  const host = segmentBoneHost(lock);
  if (!host) return null;
  if (host === PANEL_SEGMENT_HOST) {
    if (lock.panelSplitEnabled === false) return null;
    // splits 走 clonePanelSplits（归一化 + legacy 标量回退），与几何/发尖链同真源。
    const splits = deps.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    if (!splits.length) return null;
    const bones = materialize ? materializeSplitBones(lock) : splitBonesFor(lock);
    if (!bones) return null;
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
