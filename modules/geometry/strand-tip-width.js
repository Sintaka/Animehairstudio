// strand-tip-width.js - Ordinary-strand (closed tube) per-tube tip WidthCurve sampling.
// 与 panel 的 tipWidthMultiplierAt 语义**同构**：管 i 的顶点在该管 fork 以上（t > fork）
// 用 strandSplitBones[i] 自己的曲线，fork 以下回退 lock 级全局曲线。曲线网格 / 每侧 fork /
// 暴露判据全部来自共享模块 tip-width-curve.js（几何无关的那半边），本文件只补**发丝管
// 特有的横向坐标推导**与 override 组装。
//
// 坐标空间（standards 第三类注释）：本文件的 x / centerX / halfSpan 全部是**profile 局部
// 空间**（clipStrandProfileBand 裁剪后的 2D 截面多边形，尚未经 scaleX/frame/opening 变换）。
// signedCoordinate 是由它派生的**管内归一化**标量 ∈ [-1, 1]，不是世界空间量。
import * as THREE from "three";
import { defaultStrandTipClump, SPREAD_MAX } from "../bones/bone-model.js?v=20260901-1";
import { sampleAsymmetricTaperCurve, sampleScale } from "./curve-math.js?v=20260813-3";
import {
  buildTipWidthCurveFrom,
  segmentZipperHeights,
  setTipWidthCurveValueFrom,
  tipClumpNarrowFraction,
  tipWidthCommonForkFromHeights,
  tipWidthGridFromHeights,
  tipWidthResetCurveFrom,
  tipWidthSideControlTsFrom,
  tipWidthSideExposesTAt,
  tipWidthSideForkFromHeights
} from "./tip-width-curve.js?v=20260901-1";
// 发尖子骨骼链的几何无关原语（与 strand-geometry.js 的「Route 2」再锚定趟用**同一批**
// 函数）：把手必须跟随被拖动的发尖链，见文件下方 strandTipChainTransformAt。
import {
  sampleTipPosition,
  tipChainFrameAt,
  tipWeightAt,
  TIP_CLUMP_HANDLE_TANGENT_OFFSET
} from "./tip-sub-bone.js?v=20260830-1";

// panel 的发尖采样混合带宽（tipWidthMultiplierAt 末参 0.25）。发丝要与之同构就必须用同一
// 个值：带宽决定「离管中心多远算完全属于该侧」，两边不同会让同一条曲线在 panel 与发丝上
// 表现不一致。单点定义在此，override 组装与 strandTipWidthMultiplierAt 共用。
export const STRAND_TIP_WIDTH_BLEND_ZONE = 0.25;

// 拉链在 profile 局部 x 上的落点：THREE.MathUtils.lerp(minX, maxX, position * 0.5 + 0.5)。
// 几何用它裁剪，本模块用它求管的 band 边界，两处必须同规则，否则 signedCoordinate 会相对
// 错误的管中心归一化。
// **已知重复（不要读成「同步点清单」）**：strand-geometry.js createSplitStrandGeometry
// （~L120 的 splitXs）**并不调用本函数**，而是自写同一条 lerp —— 即这条规则目前有两副本，
// 也正是本导出在仓库里没有外部 importer 的原因。收敛跟踪于
// devlog/in-progress/tip-subsystem-reuse-audit.md，勿在改本文件时顺手合并。
// 实际调用方只有一处：本文件 strandTubeBandExtents 的缺省分支（几何段循环里已算好 splitXs
// 时会直接传入，避免第二次求值 —— 那条路径下两边用的是**同一批**数值，不是两次求值）。
export function strandSplitBandXs(splits, minX, maxX) {
  return (Array.isArray(splits) ? splits : []).map((split) => (
    THREE.MathUtils.lerp(minX, maxX, (Number(split?.position) || 0) * 0.5 + 0.5)
  ));
}

// 管 tubeIndex 的**实际** x 跨度。边界数组是 [-Infinity, ...splitXs, Infinity]（与几何
// 完全一致），外侧管的 ±Infinity 必须先与多边形自身的 minX/maxX 取交，否则 centerX 会是
// ±Infinity、halfSpan 会是 Infinity，归一化坐标恒为 0（= 永远采不到任何一侧）。
// splitXs 可由调用方传入（几何段循环里已算好，避免第二次求值）；缺省时按上面的同一公式推导。
export function strandTubeBandExtents(polygon, splits, tubeIndex, splitXs = null) {
  const points = Array.isArray(polygon) ? polygon : [];
  if (!points.length) return null;
  const minX = Math.min(...points.map((point) => Number(point?.x) || 0));
  const maxX = Math.max(...points.map((point) => Number(point?.x) || 0));
  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return null;
  const bandXs = Array.isArray(splitXs) ? splitXs : strandSplitBandXs(splits, minX, maxX);
  const boundaryXs = [-Infinity, ...bandXs, Infinity];
  const index = Math.max(0, Math.min(bandXs.length, Math.floor(Number(tubeIndex) || 0)));
  const lowX = Math.max(boundaryXs[index], minX);
  const highX = Math.min(boundaryXs[index + 1], maxX);
  const centerX = (lowX + highX) * 0.5;
  // 退化管（拉链贴到 profile 极值）会让 halfSpan → 0；钳到 1e-6 而不是返回 null，因为
  // 几何此时仍会扫掠该管（clipStrandProfileBand 只在 < 3 点时才被上游丢弃），除零会
  // 把顶点写成 NaN。钳位后该管整体归一化到同一侧，行为退化但有限。
  const halfSpan = Math.max(1e-6, (highX - lowX) * 0.5);
  return { lowX, highX, centerX, halfSpan };
}

// **管内相对坐标的唯一定义点**（standards「一条推导规则只准有一个定义点」）。
// 为什么不能用 raw profile.x：profile 被 clipStrandProfileBand 裁成子多边形后，**每根管的
// raw x 只有一个符号**（实测圆形 profile + 拉链 ±0.4：管 0 全负、管 2 全正，只有中间管跨 0）。
// 拿 raw x 当左右判据 → 边缘管整管只采到一侧曲线、另一侧永不生效 = panel 在 0.2.80 修掉的
// 「不跨 0 段曲线动了发丝不动」死区同类 bug。归一化到管中心后每根管都覆盖 [-1, 1]。
// 消费方（改这里就要看这几处）：
//   - modules/geometry/strand-geometry.js createSplitStrandGeometry（几何采样）
//   - 本文件 strandTipWidthProfileOverride / strandTipWidthMultiplierAt
//   - 本文件 strandTipWidthEdgePosition（把手落点选边 + 拖拽轴朝向，两处都按本坐标的符号判定）
//   - modules/bones/bone-view-handles.js  视口把手 placement / 引导线
//     （strandTipWidthControlPlacement / strandTipWidthEdgePoints）
//   - modules/bones/bone-interaction.js   拖拽起始读值
//     （strandTipWidthControlPlacement + strandTipWidthMultiplierAt，被拖那侧的极值恒为 ±1）
export function strandTubeSignedCoordinate(x, centerX, halfSpan) {
  const span = Math.max(1e-6, Number(halfSpan) || 0);
  return ((Number(x) || 0) - (Number(centerX) || 0)) / span;
}

// 管 tubeIndex 的 fork：**共用** tip-width-curve 的 tipWidthCommonForkFromHeights，与
// bone-model.js 的 strandSplitForkTForSegment、strand-geometry.js 的 sectionSplitStart
// 是同一条推导（1 - max(左右拉链高度)，缺侧记 0）。本函数**不自算**，只做「相邻拉链高度 →
// 共享模块」的翻译。
// 现状警告（勿按旧注释的「三处」理解）：这条规则目前在**全仓库 9 处**各自计算了一遍 ——
//   bone-model.js:452、panel-tip-strand.js:182、tip-width-curve.js:33、tip-width-curve.js:42、
//   project-files.js:733、project-files.js:750、usda-export.js:542、usda-export.js:591、
//   usda-export.js:672
// 本模块是**已经**收敛到共享定义点的那一侧；收敛其余各处是独立任务，跟踪于
// devlog/in-progress/tip-subsystem-reuse-audit.md，**不要**在改本文件时顺手动它们。
export function strandTubeForkT(splits, tubeIndex) {
  const { left, right } = segmentZipperHeights(splits, tubeIndex);
  return tipWidthCommonForkFromHeights(left, right);
}

// 发尖链几何混合的起点 splitStart：**全部管里最浅的那个 fork**，不是某一管自己的 fork。
// 与 strand-geometry.js 的
//   const splitStart = Math.min(...sections.map((section) => section.sectionSplitStart));
// 可证同值：几何的 sectionSplitStart 就是 strandTubeForkT(splits, i)（同一条
// tipWidthCommonForkFromHeights = 1 - max(相邻高度)，见上一个函数的注释），而 sections 的
// 数量恒为 splits.length + 1（N 拉链 → N+1 管，几何在 sections.length !== splitCount + 1
// 时直接 bail）。所以对全部管取 min 逐值等于几何对全部 section 取 min。
// **必须**用这个全局值：tipWeightAt(t, splitStart) 是几何对**每一管**统一使用的权重，拿本管
// 自己的（更深的）fork 去算会把混合起点推后、权重整体偏小，把手就会落在网格内侧。
export function strandTipBlendStartT(splits) {
  const count = (Array.isArray(splits) ? splits : []).length + 1;
  let start = Infinity;
  for (let tubeIndex = 0; tubeIndex < count; tubeIndex += 1) {
    start = Math.min(start, strandTubeForkT(splits, tubeIndex));
  }
  return Number.isFinite(start) ? start : 1;
}

// 管 tubeIndex 在 side（<0 左 / >=0 右）上的 fork：直接走共享的
// tipWidthSideForkFromHeights（发丝的邻居规则与 panel 完全相同：管 i 左界 splits[i-1]、
// 右界 splits[i]），**不在本文件另写一条 fork 公式**。
export function strandTubeSideForkT(splits, tubeIndex, side) {
  const { left, right } = segmentZipperHeights(splits, tubeIndex);
  return tipWidthSideForkFromHeights(left, right, side);
}

// ── Tip Clump（bone.tipClump）在发丝管上的收窄：profile x 绕**本管 band 中心**相对缩放 ─────
// 0.2.132 的语义统一（用户决定）：Tip Clump 只做「发尖相对自身宽度收窄」，与 panel 完全同义。
// panel 侧把共享比例乘上段自身**半跨度**得到 u 空间 gap（tipWidthSpreadGap）；发丝侧把同一个
// 比例乘上**管内半跨度**、沿 profile x 向管中心收 —— 于是同一个 Tip Clump 数值在两种几何上
// 收掉的都是「自身宽度的同一比例」。
//
// 坐标空间：入参与返回值都在 **profile 局部空间**（clipStrandProfileBand 的裁剪结果，尚未经
// scaleX/frame 变换），与 band.centerX / band.halfSpan 同空间。
//
// 为什么必须在 warp **之前**收窄（不是 warp 之后再缩）：panel 是先把列的 u 收进 [uStart,uEnd]
// 再用该 u 采样宽度曲线，发尖 WidthCurve 因此采在**收窄后**的坐标上。发丝要同构就必须同序 ——
// 收窄后的 x 会经 strandTubeSignedCoordinate 归一化成 override 的 signedCoordinate，取值范围
// 随收窄从 ±1 缩到 ±(1 − 比例)，与 panel 逐字对应。收窄是绕 centerX 的纯缩放，**不改符号**，
// 所以 usesBoneCurveAt 的左右侧判定不受影响。
//
// **刻意不参与曲率收窄预趟**（与发尖 WidthCurve override 同样的三条理由，见 strand-geometry.js
// 那段注释）：预趟产出的 factors[row] 全行全管共享，且经 falloff 会把发尖处的变细传播到
// row 0 → row 0 顶点位移 → 破 UV 契约（红线）。所以预趟传 section.points 原样、sweep 趟才收窄。
//
// tipClump 为 0（或 t 未过本侧 zipper）时返回**入参数组本身**：调用方零分配、逐字节等于旧路径。
export function strandTipClumpNarrowedProfile(points, band, tipClump, t, leftHeight, rightHeight) {
  const list = Array.isArray(points) ? points : [];
  if (!band || !list.length) return list;
  const clamped = THREE.MathUtils.clamp(Number(tipClump) || 0, 0, SPREAD_MAX);
  if (!(clamped > 0)) return list;
  // 两侧比例分开算：相邻 zipper 高度不同时斜坡起点不同（panel 既有行为）。
  const leftFraction = tipClumpNarrowFraction(leftHeight, clamped, t);
  const rightFraction = tipClumpNarrowFraction(rightHeight, clamped, t);
  if (!(leftFraction > 0) && !(rightFraction > 0)) return list;
  return list.map((profile) => {
    const x = Number(profile?.x) || 0;
    // 按**管内相对坐标的符号**选边（单一定义点 strandTubeSignedCoordinate）：裁剪后边缘管的
    // raw x 只有一个符号，按 raw x 选边会让一侧永不收窄（= 0.2.80 死区同类）。
    const signed = strandTubeSignedCoordinate(x, band.centerX, band.halfSpan);
    const fraction = signed < 0 ? leftFraction : rightFraction;
    if (!(fraction > 0)) return profile;
    return { ...profile, x: band.centerX + (x - band.centerX) * (1 - fraction) };
  });
}

// 该管该点当前是否应改用段级曲线：本侧 fork 之上才用，之下（含本侧完全锁定 fork >= 1）
// 回退全局曲线。判据与 panel 的 tipWidthMultiplierAt 守卫逐字对应（含 1e-4 容差：曲线点
// 位置本身是浮点 lerp 结果，严格比较会让 fork 锚点行随机落到两侧）。
function usesBoneCurveAt(splits, tubeIndex, signedCoordinate, t) {
  const side = Number(signedCoordinate) < 0 ? -1 : 1;
  const sideForkT = strandTubeSideForkT(splits, tubeIndex, side);
  if (sideForkT >= 1) return false;
  return Number(t) >= sideForkT - 1e-4;
}

// strandRadiusAt 的 curveOverride 载荷（形状见 app.js strandRadiusAt 注释）。
// bone 曲线缺失时逐字段回退 lock 级曲线，与 panel 的 tipWidthMultiplierAt 末段一致。
//
// centerX（profile 局部空间的**管中心**，0.2.128 加）：app.js strandProfileTopologyAt 用它
// 当缩放**中心**。不传（或非有限值）时那边退回绕全局 x = 0 缩放 —— 那正是 0.2.128 修掉的
// 不对称 bug（位移正比于 |raw x| ⇒ N = 1 时缝侧恒不动），所以**几何路径必须传**。
// 纯读值路径（strandTipWidthMultiplierAt）只取 curve/asymmetric/signedCoordinate/blendZone，
// 与缩放中心无关，故那条路径刻意不带 band、centerX 为 undefined。
function boneCurveOverride(lock, bone, signedCoordinate, centerX = null) {
  return {
    curve: bone?.taperCurve || lock?.taperCurve,
    secondary: bone?.taperCurveSecondary || lock?.taperCurveSecondary,
    asymmetric: bone?.asymmetricWidthCurve ?? lock?.asymmetricWidthCurve,
    signedCoordinate,
    blendZone: STRAND_TIP_WIDTH_BLEND_ZONE,
    centerX
  };
}

// 「本管本行是否可能有覆盖」——与横向坐标**无关**的那部分判据，单点定义在此，
// 逐点入口（strandTipWidthOverrideAt）与整行入口（strandTipWidthProfileOverride）
// 共用；否则两处各写一遍必然漂移（standards「一条推导规则只准有一个定义点」）。
// 返回 fork 标量（可用）或 null（不可用），顺带把 fork 交给调用方复用。
function tipWidthEligibleForkT(bone, splits, tubeIndex, t, sectionSplitStart) {
  if (!bone) return null;
  // 「创作过」的判据 = taperCurve 至少 2 点（曲线采样本身要求 >= 2，1 点曲线等价于无）。
  // 只看 primary：secondary 单独存在时几何也只在 asymmetric 打开后才会用到它，而
  // buildTipWidthCurveFrom 永远先写 primary，所以 primary 缺失即「本段从未创作」。
  // 这条判据是 byte-identity 的**唯一**保证：曲线来源虽逐字段回退 lock，但 override 会把
  // 采样坐标换成管内相对坐标、blendZone 换成 0.25，所以「未创作」必须完全不进 override。
  if (!(Array.isArray(bone.taperCurve) && bone.taperCurve.length >= 2)) return null;
  // sectionSplitStart 由几何传入（它自己算过一次）；缺省时用共享的 common fork 推导 ——
  // 两者可证同值（同一条 1 - max(高度)），传入只是免掉重复求值。
  const forkT = sectionSplitStart == null ? strandTubeForkT(splits, tubeIndex) : Number(sectionSplitStart);
  if (Number(t) <= forkT) return null;
  return forkT;
}

// 单点 override：返回 null ⇒ 调用方走全局曲线路径（逐字节等于改动前）。
// 四种 null：无 bone / 未创作 taperCurve / t 在段 fork 之下 / t 在**本侧** fork 之下。
export function strandTipWidthOverrideAt({
  bone,
  splits,
  tubeIndex,
  t,
  signedCoordinate,
  lock,
  sectionSplitStart = null,
  // profile 局部空间的管中心，几何路径必读（见 boneCurveOverride 的注释）。
  centerX = null
}) {
  if (tipWidthEligibleForkT(bone, splits, tubeIndex, t, sectionSplitStart) == null) return null;
  // 本侧 fork（可比段 fork 更浅）单独再判一次：浅 zipper 侧在两个 fork 之间仍跟随全局
  // 曲线，与 panel 的 tipWidthMultiplierAt 守卫同构。
  if (!usesBoneCurveAt(splits, tubeIndex, signedCoordinate, t)) return null;
  return boneCurveOverride(lock, bone, signedCoordinate, centerX);
}

// 几何真正消费的入口：返回 strandProfileTopologyAt 的 widthOverride 回调
// （(profile, index) => override | null），或 null 表示「本行本管不可能有覆盖」——
// 后者让常规路径（今天所有真实工程）一个对象都不分配、走原样代码。
export function strandTipWidthProfileOverride({
  lock,
  bone,
  splits,
  tubeIndex,
  t,
  sectionSplitStart,
  band
}) {
  if (!band) return null;
  // 与横向坐标无关的判据走共享的 tipWidthEligibleForkT（勿在此复制），逐点的本侧 fork
  // 判据留给下面的 strandTipWidthOverrideAt —— 它才知道每个点落在管的哪一侧。
  const forkT = tipWidthEligibleForkT(bone, splits, tubeIndex, t, sectionSplitStart);
  if (forkT == null) return null;
  return (profile) => strandTipWidthOverrideAt({
    bone,
    splits,
    tubeIndex,
    t,
    // 管内相对坐标：单一定义点 strandTubeSignedCoordinate（勿在此内联算式）。
    signedCoordinate: strandTubeSignedCoordinate(profile?.x, band.centerX, band.halfSpan),
    lock,
    sectionSplitStart: forkT,
    // 缩放中心：**必须**是本管中心。少了它 app.js 会退回绕全局 x = 0 缩放，同一个对称
    // multiplier 在两侧产生不等位移（N = 1 时缝侧恒不动）= 0.2.128 修掉的 bug。
    centerX: band.centerX
  });
}

// 该管该侧当前的宽度倍率（panel 侧对应 tipPanelWidthAt 用的 tipWidthMultiplierAt）：
// 供后续阶段的视口把手放置与拖拽起始读值使用，保证「读到的」与「几何画出的」同源。
// signedCoordinate 必须已是管内相对坐标（strandTubeSignedCoordinate 的返回值）。
export function strandTipWidthMultiplierAt(lock, t, signedCoordinate, bone, tubeIndex, splits) {
  const override = strandTipWidthOverrideAt({ bone, splits, tubeIndex, t, signedCoordinate, lock });
  if (override) {
    return sampleAsymmetricTaperCurve(
      override.curve,
      override.secondary,
      override.asymmetric,
      override.signedCoordinate,
      t,
      override.blendZone
    );
  }
  // 回退路径与 strandRadiusAt 的默认（无 override）分支同构：lock 级曲线 + 默认 blendZone 1。
  return sampleAsymmetricTaperCurve(
    lock?.taperCurve,
    lock?.taperCurveSecondary,
    lock?.asymmetricWidthCurve,
    signedCoordinate,
    t
  );
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Phase D：视口把手 / 拖拽 / 浮动编辑器所需的发丝侧适配层。
// 这一段全部是 tip-width-curve.js 的**薄适配器**（与 panel-tip-strand.js 的
// tipWidth* 适配器一一对应）：本文件只负责把「管 i 的相邻拉链高度」翻译成共享模块要的
// 标量，网格 / 暴露判据 / 曲线构建 / Reset / 写入吸附的规则本体一律在共享模块里，
// 发丝侧**没有**第二份（standards「一条推导规则只准有一个定义点」）。
// ─────────────────────────────────────────────────────────────────────────────────────

// 管 tubeIndex 的**完整共享网格**（最深拉链 span 的 5 个中点 + 发尖 t=1）。
// tipWidthIndex 索引的就是这个数组（0.2.123 方案 (a)），两侧共用 → 间距恒等。
export function strandTubeGridTs(splits, tubeIndex) {
  const { left, right } = segmentZipperHeights(splits, tubeIndex);
  return tipWidthGridFromHeights(left, right);
}

// 管 tubeIndex 在 side 上**暴露**的网格子集：共享网格 ∩ 本侧暴露区。
// 「曲线里有 ⇔ 有把手」的不变式靠它成立：placement（strandTipWidthControlPlacement）、
// 曲线构建 / Reset / 写入吸附（共享模块内部）、浮动编辑器的锁定点判定
// （taper-editor.js tipDraggablePositions 的 strand 分支）全部消费本函数。
export function strandTubeSideControlTs(splits, tubeIndex, side) {
  return tipWidthSideControlTsFrom(
    strandTubeGridTs(splits, tubeIndex),
    strandTubeSideForkT(splits, tubeIndex, side)
  );
}

// Reset：整条曲线全 1（两侧暴露区都无凹陷）。规则本体在 tipWidthResetCurveFrom。
export function strandTipWidthResetCurve(splits, tubeIndex, side) {
  return tipWidthResetCurveFrom({
    gridTs: strandTubeGridTs(splits, tubeIndex),
    sideForkT: strandTubeSideForkT(splits, tubeIndex, side),
    oppositeForkT: strandTubeSideForkT(splits, tubeIndex, -side)
  });
}

// 重建某一侧曲线。globalCurve 的按侧选择与 panel 的 buildTipWidthCurve 逐字同构：
// 右侧恒取 primary；左侧只有在 asymmetric 已打开且 secondary 存在时才取 secondary，
// 否则也取 primary —— 否则「右侧一拖就打开 asymmetric」会让未被拖的左侧从 primary
// 跳到 secondary（panel 侧修过的同一个 bug，发丝侧不得重犯）。
export function buildStrandTipWidthCurve(lock, splits, tubeIndex, bone, side) {
  const globalCurve = side < 0
    ? ((lock?.asymmetricWidthCurve && lock?.taperCurveSecondary) ? lock.taperCurveSecondary : lock?.taperCurve)
    : lock?.taperCurve;
  return buildTipWidthCurveFrom({
    gridTs: strandTubeGridTs(splits, tubeIndex),
    sideForkT: strandTubeSideForkT(splits, tubeIndex, side),
    oppositeForkT: strandTubeSideForkT(splits, tubeIndex, -side),
    globalCurve,
    current: side < 0 ? bone?.taperCurveSecondary : bone?.taperCurve
  });
}

// 写一个宽度值进管 tubeIndex 的 side 侧曲线，然后只重建被改的那一侧。
// 与 panel 的 setTipWidthCurveValue 逐字同构（含 asymmetricWidthCurve = true 与
// 「返回 null ⇒ 跳过写入、不重建」的语义）；吸附规则本体在 setTipWidthCurveValueFrom。
export function setStrandTipWidthCurveValue(lock, splits, tubeIndex, bone, side, t, value) {
  if (!bone) return;
  if (!bone.taperCurve) bone.taperCurve = buildStrandTipWidthCurve(lock, splits, tubeIndex, bone, 1);
  if (!bone.taperCurveSecondary) bone.taperCurveSecondary = buildStrandTipWidthCurve(lock, splits, tubeIndex, bone, -1);
  bone.asymmetricWidthCurve = true;
  const written = setTipWidthCurveValueFrom({
    curve: side < 0 ? bone.taperCurveSecondary : bone.taperCurve,
    gridTs: strandTubeGridTs(splits, tubeIndex),
    sideForkT: strandTubeSideForkT(splits, tubeIndex, side),
    t,
    value
  });
  if (!written) return;
  if (side < 0) bone.taperCurveSecondary = buildStrandTipWidthCurve(lock, splits, tubeIndex, bone, -1);
  else bone.taperCurve = buildStrandTipWidthCurve(lock, splits, tubeIndex, bone, 1);
}

// ── 把手放置：管的「某侧边缘在世界空间的位置」──────────────────────────────────────
// 坐标空间（standards 第三类注释）：入参 t 是主链参数；band/profile 量在 **profile 局部
// 空间**；返回的 point/center/lateral 在**世界空间**。
//
// geo = 视口侧注入的几何 dep 组（bone-view-handles / bone-interaction 各自转发自己的
// deps，node 测试直接构造）：{ strandGeometryCurve, strandGeometryFrameAt,
// strandProfileTopologyAt, strandSplitProfileData, strandSplitTipChains }。
// strandSplitTipChains 转发的是 app.js 的 currentStrandSplitTipChains —— 0.2.120 物化空间的
// 唯一真源（rest = 该管扫掠环心，points = rest + authored delta）。**刻意不在本模块调用
// materializeTipChain**：那会用近似 rest，与视口画的管心不一致 = 一按下就跳（见
// tip-sub-bone-host.js 文件头同一条禁令）。
//
// **变换链**（与 createSplitStrandGeometry 的 sweep 同构，逐项对照）：
//   ⓪ Tip Clump 收窄 = strandTipClumpNarrowedProfile(...)  ← 与几何**同一函数**、同一入参
//   ① warped = strandProfileTopologyAt(...)  ← 与几何同一函数、同一 widthOverride
//   ② ringPoint = frame.x·warped.x + frame.z·warped.z
//   ③ 曲率收窄 factors[row]：**无法复现，刻意省略**（见下方 FACTORS 说明）
// 0.2.132 前链末还有一项「④ ringPoint += frame.x · opening」（整管横向平移）；该语义已随
// segment separate 一起删除，几何侧也不再有这一项，两边仍逐项对应。
// ③ 之所以不能复现：factors 来自 sweepCurvatureResponse(centers, radii, …)，而 radii 是
// 对**全部行 × 全部管**先跑一遍 strandProfileTopologyAt 的前置 pass 的产物，并且经
// falloff 在行间扩散——单点放置拿不到它，重算一遍等于把整条 sweep 复制进视口层。
// 后果是有效的曲率收窄区（急弯发丝）把手会略微浮在真实表面**外侧**，方向正确、量级为
// 收窄比例。这与既有 zipper 把手（strandSplitControlPoint，app.js）的取舍完全一致——
// 它同样不算 factors，并额外沿 frame.z 推 0.012 让把手浮出表面。**刻意不在这里补
// 0.012**：本把手的 lateral 是拖拽轴，额外的法向偏移会让 startLatOffset 混入非横向
// 分量，把拖拽比例算歪。
const STRAND_TIP_WIDTH_FACTORS_APPROXIMATION = 1;

// profile 局部空间里 x = profileX 处的**上表面** z（多边形边与竖直线 x=profileX 的交点
// 取最大 z）。同规则同步点：app.js strandSplitControlPoint 的 profileZ 求解（zipper 把手）
// ——两处都要让把手落在管的可见上表面，改一处必须回看另一处。
// 取 max（不是 min/平均）：z 正向是 frame.z 外侧法向，最大 z = 朝向相机侧的表面。
function profileTopZAt(samples, profileX) {
  let profileZ = -Infinity;
  samples.forEach((current, index) => {
    const next = samples[(index + 1) % samples.length];
    if ((profileX < current.x && profileX < next.x) || (profileX > current.x && profileX > next.x)) return;
    const denominator = next.x - current.x;
    const amount = Math.abs(denominator) < 0.000001 ? 0 : (profileX - current.x) / denominator;
    profileZ = Math.max(profileZ, THREE.MathUtils.lerp(current.z, next.z, amount));
  });
  if (Number.isFinite(profileZ)) return profileZ;
  return samples.reduce(
    (best, point) => (Math.abs(point.x - profileX) < Math.abs(best.x - profileX) ? point : best),
    samples[0]
  ).z;
}

// ── 发尖子骨骼链再锚定：把手必须跟着被拖动的发尖走 ─────────────────────────────────
// 几何在 createSplitStrandGeometry 的「Route 2」趟里，对每个顶点做：
//   w        = tipWeightAt(t, splitStart)                     ← splitStart 是**全局最浅** fork
//   tipFrame = tipChainFrameAt(tipChain, tipChain, t, frames[row].z)
//   offset   = original − restCenter(t)
//   target   = tipCenter(t) + tipFrame.x·(offset·frame.x) + tipFrame.z·(offset·frame.z)
//   final    = lerp(original, target, w)
// 本函数返回那条变换所需的全部量，供 point / center / lateral **同一次**复用。
// 返回 null ⇒ 无发尖链或权重为 0 ⇒ 调用方必须走「与改动前逐字节相同」的老路径。
//
// restCenter 的取值口径（brief 要求显式说明）：用**物化链自己的 restPoints**，并且用与
// tipCenter 完全相同的采样器（sampleTipPosition，即 CatmullRom over 点列）。
//   - 为什么不用主曲线 curve.getPoint(t)：那是**主脊柱**，不是管心；几何用的是
//     splitRestCenters[sectionIndex]（该管扫掠环心）。差一个 opening 平移就会整体偏。
//   - 为什么等于几何的值：app.js currentStrandSplitTipChains 的 restPointAt 在
//     lock.mesh.geometry.userData.strandSplitRestCenters 可用时直接 sampleCenterlinePoint
//     那份**几何写出来的** splitRestCenters（否则按同一条 opening 公式派生），因此物化链的
//     restPoints 就是几何 restCenter 在链参数上的重采样。
//   - 为什么两边都用 sampleTipPosition：中性链（未拖动，points === restPoints）时
//     tipCenter(t) 与 restCenter(t) 逐值相等 ⇒ 平移项恒等消掉 ⇒ 选中但未拖动时把手不动
//     （若 restCenter 换用另一个插值器，中性链也会产生残余位移 = 一按下就跳）。
function strandTipChainTransformAt(geo, lock, splits, tubeIndex, bone, t, mainFrame) {
  // 几何的门控逐字对应（`if (!bone?.tip || bone.tip.active === false) return null;`）：
  // 物化链对「无 authored tip」也会返回一条等于 rest 的链，所以不能只看链是否存在。
  if (!bone?.tip || bone.tip.active === false) return null;
  const chain = geo?.strandSplitTipChains?.(lock)?.[tubeIndex];
  if (!chain || !Array.isArray(chain.points) || !Array.isArray(chain.restPoints)) return null;
  if (chain.points.length < 2 || chain.restPoints.length < 2) return null;
  if (chain.active === false) return null;
  const w = tipWeightAt(t, strandTipBlendStartT(splits));
  if (!(w > 0)) return null;
  const tipCenter = sampleTipPosition(chain, t);
  const restCenter = sampleTipPosition({ points: chain.restPoints }, t);
  if (!tipCenter || !restCenter) return null;
  const tipFrame = tipChainFrameAt(chain, chain, t, mainFrame.z.clone());
  return {
    w,
    tipFrame,
    tipCenter: new THREE.Vector3(tipCenter.x, tipCenter.y, tipCenter.z),
    restCenter: new THREE.Vector3(restCenter.x, restCenter.y, restCenter.z)
  };
}

// 把一个「主帧世界点」（= 几何 sweep 趟写出的 original 顶点）按上面的链变换搬过去。
function applyStrandTipChainTransform(transform, mainFrame, worldPoint) {
  const offset = worldPoint.clone().sub(transform.restCenter);
  return worldPoint.clone().lerp(
    transform.tipCenter.clone()
      .addScaledVector(transform.tipFrame.x, offset.dot(mainFrame.x))
      .addScaledVector(transform.tipFrame.z, offset.dot(mainFrame.z)),
    transform.w
  );
}

// 管 tubeIndex 在 side 侧、主链参数 t 处的边缘世界位置 + 拖拽基准。
// 返回 { point, center, lateral, t } —— 与 panel 的 tipWidthEdgePosition 同形，
// 所以 bone-interaction 的拖拽数学一行都不用改。
export function strandTipWidthEdgePosition(geo, lock, splits, tubeIndex, bone, side, t) {
  const profileData = geo?.strandSplitProfileData?.(lock);
  const samples = profileData?.samples;
  if (!Array.isArray(samples) || samples.length < 3) return null;
  const band = strandTubeBandExtents(samples, splits, tubeIndex);
  if (!band) return null;
  // 取哪个 x 极值：**必须**按管内相对坐标的符号判定，不得看 raw x 的符号。
  // 边缘管裁剪后 raw x 只有一个符号（管 0 全负 / 末管全正），按 raw x 选边会让某一侧
  // 永远选不到自己的极值 = 0.2.80 死区同类 bug（见文首实施期修正）。
  // 退化管（拉链贴到 profile 极值 ⇒ halfSpan 被钳到 1e-6、lowX == highX == centerX）时
  // lowSign 为 0，本式会把两侧选反 —— 无害，因为两个极值本就是同一个点。
  const lowSign = strandTubeSignedCoordinate(band.lowX, band.centerX, band.halfSpan);
  const wantLow = (side < 0) === (lowSign < 0);
  const edgeX = wantLow ? band.lowX : band.highX;
  const edgeZ = profileTopZAt(samples, edgeX);
  // 边缘点与管中心点**同一次** strandProfileTopologyAt 调用：两点必须落在同一 bounds
  // 与同一 override 语义下，否则 center 与 point 的差不再是纯横向量。center 用与边缘
  // 相同的 z，使 point − center 只含 frame.x 分量（拖拽 dot(lateral) 才是纯横向距离）。
  const widthOverride = strandTipWidthProfileOverride({
    lock,
    bone,
    splits,
    tubeIndex,
    t,
    sectionSplitStart: null,
    band
  });
  // Tip Clump 收窄必须在这里也先施加、且用**与几何同一个函数**（strandTipClumpNarrowedProfile）：
  // 绿色宽度把手要落在真实网格边缘上，而几何的发尖已被收窄。0.2.132 前这里加的是 opening
  // （整管平移），与当时的几何同构；语义换成收窄后，两边必须一起换，否则把手会浮在网格外。
  // 管中心点与边缘点走**同一次**收窄 + 同一次 warp：中心恰在 centerX 上，收窄对它是恒等
  // （x − centerX = 0），所以 point − center 仍是纯横向量、拖拽基准不变。
  const { left, right } = segmentZipperHeights(splits, tubeIndex);
  const clumped = strandTipClumpNarrowedProfile(
    [{ x: edgeX, z: edgeZ }, { x: band.centerX, z: edgeZ }],
    band,
    bone?.tipClump ?? defaultStrandTipClump(lock),
    t,
    // 无 zipper 的外侧镜像对侧（与 createSplitStrandGeometry 的 leftClumpHeight/
    // rightClumpHeight 同规则；两处不同源会让把手与网格边缘错开）。
    left ?? right ?? null,
    right ?? left ?? null
  );
  const warped = geo.strandProfileTopologyAt(
    lock,
    t,
    clumped,
    sampleScale(lock?.pointScales, t, "x"),
    sampleScale(lock?.pointScales, t, "z"),
    samples,
    widthOverride
  );
  if (!warped?.length) return null;
  const curve = geo.strandGeometryCurve(lock);
  const frame = geo.strandGeometryFrameAt(lock, curve, t, null);
  const spine = curve.getPoint(t);
  // 0.2.132：这里原本还要把几何的 opening（整管沿 frame.x 平移）加回来。该平移已随
  // 「segment separate」语义整体删除 —— 几何只做收窄，所以世界组装恰好是 warp 结果
  // 乘曲率 factors，与 createSplitStrandGeometry 的 ringPoint 逐项对应。
  const factors = STRAND_TIP_WIDTH_FACTORS_APPROXIMATION;
  const toWorld = (warpedPoint) => spine.clone()
    .addScaledVector(frame.x, warpedPoint.x * factors)
    .addScaledVector(frame.z, warpedPoint.z * factors);
  const point = toWorld(warped[0]);
  const center = toWorld(warped[1]);
  // 拖拽轴 = 该管自身横向、朝本侧外翻。frame.x 是 profile x 增大的世界方向，所以
  // 「本侧的外侧」= frame.x × 本侧相对坐标的符号（同样不看 raw x）。
  const lateralSign = strandTubeSignedCoordinate(edgeX, band.centerX, band.halfSpan) < 0 ? -1 : 1;
  // 发尖子骨骼链再锚定（0.2.127 修）：几何把 fork 以上的顶点按发尖链搬走了，把手若继续
  // 只锚在主脊柱上，拖发尖时网格动、绿把手不动（用户报告的 bug）。point / center / lateral
  // 三者**必须走同一次**变换：bone-interaction 用 (point − center)·lateral 当拖拽基准，
  // 只搬一个会让基准歪掉、拖拽灵敏度错。
  const tipTransform = strandTipChainTransformAt(geo, lock, splits, tubeIndex, bone, t, frame);
  if (!tipTransform) {
    // 无发尖链 / 链非 active / 权重 0（t <= 全局最浅 fork）⇒ 与改动前逐字节相同。
    return { point, center, lateral: frame.x.clone().multiplyScalar(lateralSign), t };
  }
  // 横向轴也要一起旋进发尖帧：否则拖拽会沿**旧**的主帧横向走，而表面已经转开了。
  // 用与位置相同的 w 做 lerp 再归一化 —— 这样 (point − center)·lateral 仍恰等于两点距离
  // （point − center 本身就是 lerp(mainFrame.x·d, tipFrame.x·d, w)，与该 lerp 方向共线）。
  const lateral = frame.x.clone().lerp(tipTransform.tipFrame.x, tipTransform.w);
  // 退化保护：主帧横向与发尖帧横向恰好反向且 w = 0.5 时 lerp 会退化成零向量。
  if (lateral.lengthSq() < 1e-12) lateral.copy(frame.x);
  lateral.normalize().multiplyScalar(lateralSign);
  return {
    point: applyStrandTipChainTransform(tipTransform, frame, point),
    center: applyStrandTipChainTransform(tipTransform, frame, center),
    lateral,
    t
  };
}

// 视口放置：pointIndex 索引**完整共享网格**（0.2.123 方案 (a)），本侧未暴露 → 返回 null
// 由更新阶段隐藏。**不要**改成索引过滤后的子集：同一 index 的含义会随拉链高度漂移。
// 与 panel 的 tipWidthControlPlacement 是同一套判据（tipWidthSideExposesTAt 单一定义
// 点），因此「曲线里有 ⇔ 有把手」在发丝侧同样构造性成立。
export function strandTipWidthControlPlacement(geo, lock, splits, tubeIndex, bone, side, pointIndex) {
  const sideForkT = strandTubeSideForkT(splits, tubeIndex, side);
  if (sideForkT >= 1) return null;
  const positions = strandTubeGridTs(splits, tubeIndex);
  if (!(pointIndex >= 0) || pointIndex >= positions.length) return null;
  const t = positions[pointIndex];
  if (!tipWidthSideExposesTAt(sideForkT, t)) return null;
  return strandTipWidthEdgePosition(geo, lock, splits, tubeIndex, bone, side, t);
}

// 该侧暴露区（本侧 fork → 发尖）的引导线采样点。段数 24 与 panel 的 tipWidthEdgePoints
// 相同，纯视觉密度，无几何含义。
export function strandTipWidthEdgePoints(geo, lock, splits, tubeIndex, bone, side) {
  const forkT = strandTubeSideForkT(splits, tubeIndex, side);
  if (forkT >= 1) return [];
  const points = [];
  const count = 24;
  for (let i = 0; i <= count; i += 1) {
    const edge = strandTipWidthEdgePosition(
      geo,
      lock,
      splits,
      tubeIndex,
      bone,
      side,
      THREE.MathUtils.lerp(forkT, 1, i / count)
    );
    if (edge) points.push(edge.point);
  }
  return points;
}

// ── 绿色 Tip Clump 手柄：管 tubeIndex 在发尖处的「tipClump → 世界位置」线段 ────────────
// panel 侧的对应量（bone-view-handles.js panelTipClumpHandlePoint + bone-interaction.js
// kind==="segment"）是**段自身 u 跨度上的一个分数**：
//   handleU = boundaries[seg] + (tipClump / SPREAD_MAX) * span，把手取该 u 处的段表面点。
// 即「tipClump = 把手在本段自身横向跨度里的归一化位置」。发丝用**同一句话**，横向跨度换成
// 「该管在发尖处的两侧边缘之间」：
//   point(tipClump) = lerp(左边缘, 右边缘, tipClump / SPREAD_MAX)
// 两侧边缘都取 t = 1（发尖端），由既有单一定义点 strandTipWidthEdgePosition 求值 —— 于是
// 绿色手柄与该管的绿色 WidthCurve 手柄、发尖链手柄共用同一条变换链（含发尖子骨骼再锚定），
// 拖发尖时三者一起走。
//
// **跨度基准必须与 taper 无关**（0.2.132 实测踩过的坑，勿「优化」回去）：跨度取该管的
// **标称**横向范围 —— band 的 profile 极值 × baseWidth（含 widthScale 与该行的 pointScales.x），
// 而不是 t = 1 处真实网格边缘。理由是**默认 taper 曲线在 t = 1 的值恰为 0**
// （app-config.js DEFAULT_TAPER_CURVE 末点 value: 0，真实工程 layered-side-bun 亦然）：
//   - 真实边缘在那里全部收缩到脊柱同一点 ⇒ 左右边缘距离恒为 0 ⇒ 线段退化 ⇒ **手柄拖不动**
//     （实测 scripts/verify-tip-clump.mjs 报 lowToHigh = 0；node 测试的 fixture 用的是恒 1 的
//     FLAT_CURVE，所以掩盖了这一点）。
//   - 每根管的中心也会一起塌到脊柱 ⇒ N+1 个手柄重叠成一个，无法分辨在拖哪根管。
// 与 panel 同构：panel 的 handleU 建在**段边界**（u 空间，与 panel 宽度曲线无关）上，同样不随
// taper 收缩；发丝的 band 极值就是它的对应量。taper 恒 1 时标称跨度与真实边缘重合。
//
// 仿射性（拖拽端 49 探针反演的前提，测试 "axis is AFFINE in Tip Clump" 钉住）：两端点都**不含
// tipClump**，它只作为 lerp 系数出现 ⇒ point(tipClump) 严格线性。这也是为什么这里**不**调用
// strandTipWidthEdgePosition —— 那个函数已按 tipClump 收窄，用它当端点会得到二次轨迹。
//
// 发尖链再锚定与 WidthCurve 手柄**共用同一条变换链**（applyStrandTipChainTransform），所以拖
// 发尖时绿手柄、宽度手柄、发尖链手柄一起走。
//
// tangentOffset：沿发尖切线外推，避免与该管发尖链末点手柄（黄色）重合。**烘进本函数**是
// 刻意的 —— 绘制与拖拽扫描必须落在**同一条**线段上，否则指针与球心恒有偏差（panel 侧就
// 有这个已知偏差：它的扫描基线是 panelSplitControlPoint、不含偏移；发丝不复制该缺陷）。
//
// 返回 null = 该管没有可放置的发尖边缘（profile 退化 / 无 splits）。
export function strandTipClumpAxis(geo, lock, splits, tubeIndex, bone) {
  const profileData = geo?.strandSplitProfileData?.(lock);
  const samples = profileData?.samples;
  if (!Array.isArray(samples) || samples.length < 3) return null;
  const band = strandTubeBandExtents(samples, splits, tubeIndex);
  if (!band) return null;
  const curve = geo?.strandGeometryCurve?.(lock);
  if (!curve) return null;
  const frame = geo.strandGeometryFrameAt(lock, curve, 1, null);
  const spine = curve.getPoint(1);
  // profile x → 世界横向的标称比例（与 strandRadiusAt 的非曲线因子逐项相同：baseWidth ×
  // widthScale × 该行 pointScales.x；**刻意不含** taper 采样值，见上方说明）。
  const nominalWidth = Number(lock?.baseWidth ?? lock?.width ?? 0.16)
    * Number(lock?.widthScale ?? 1)
    * sampleScale(lock?.pointScales, 1, "x");
  const worldAt = (profileX) => spine.clone().addScaledVector(frame.x, profileX * nominalWidth);
  // 端点按**管内相对坐标的符号**定左右（单一定义点 strandTubeSignedCoordinate），与
  // strandTipWidthEdgePosition 的选边判据同源：tipClump = 0 落在本管左侧、SPREAD_MAX 落在右侧。
  const lowIsLeft = strandTubeSignedCoordinate(band.lowX, band.centerX, band.halfSpan) < 0;
  const leftPoint = worldAt(lowIsLeft ? band.lowX : band.highX);
  const rightPoint = worldAt(lowIsLeft ? band.highX : band.lowX);
  // 切线取该管发尖链自身 y 轴（与法线箭头/gizmo 同一个 tipChainFrameAt 原语）；无链时回退
  // 主几何帧 y。两者都是「发尖前进方向」。
  const tangent = tipClumpTangent(geo, lock, tubeIndex);
  // 发尖子骨骼链再锚定：与 WidthCurve 手柄同一条变换链（拖发尖时三者一起走）。
  const tipTransform = strandTipChainTransformAt(geo, lock, splits, tubeIndex, bone, 1, frame);
  const anchored = (point) => (
    tipTransform ? applyStrandTipChainTransform(tipTransform, frame, point) : point
  );
  const start = anchored(leftPoint).addScaledVector(tangent, TIP_CLUMP_HANDLE_TANGENT_OFFSET);
  const end = anchored(rightPoint).addScaledVector(tangent, TIP_CLUMP_HANDLE_TANGENT_OFFSET);
  return {
    start,
    end,
    // tipClump → 世界位置（仿射，见上方推导）。钳在定义域内，越界探针不会跑到管外。
    pointAt: (tipClump) => start.clone().lerp(
      end,
      SPREAD_MAX <= 0 ? 0 : THREE.MathUtils.clamp(Number(tipClump) || 0, 0, SPREAD_MAX) / SPREAD_MAX
    )
  };
}

// 发尖切线：优先该管物化发尖链在 t = 1 的帧 y（跟随被拖动的发尖），无链则退回主几何帧 y。
function tipClumpTangent(geo, lock, tubeIndex) {
  const curve = geo?.strandGeometryCurve?.(lock);
  const mainFrame = curve ? geo.strandGeometryFrameAt(lock, curve, 1, null) : null;
  const chain = geo?.strandSplitTipChains?.(lock)?.[tubeIndex];
  if (chain && Array.isArray(chain.points) && chain.points.length >= 2 && chain.active !== false && mainFrame) {
    return tipChainFrameAt(chain, chain, 1, mainFrame.z.clone()).y;
  }
  if (mainFrame) return mainFrame.y.clone();
  return new THREE.Vector3(0, 1, 0);
}
