// tip-width-curve.js - Geometry-agnostic tip WidthCurve math (shared grid + per-side
// dynamic exposure + curve build/reset/write). Extracted from panel-tip-strand.js so the
// panel-segment side and the ordinary-strand side (lock.strandSplits) consume ONE
// definition point per derivation rule instead of two copies.
//
// 参数约定（这是本模块可复用的关键）：一切都以**相邻 zipper 高度 / fork 标量**为入参，
// 不接受 (lock, segmentIndex, splits)。panel 的 lock.panelSplits 与普通发丝的
// lock.strandSplits 字段不同，但条目形状同为 {position, height}、邻居规则同为「段/管 i
// 的左界是 splits[i-1]、右界是 splits[i]」，因此只要调用方先把高度取出来，这里的推导对
// 两侧完全一致。
import * as THREE from "three";
import { sampleTaperCurve } from "./curve-math.js?v=20260813-3";

// Shared tip width control point count: 5 midpoints (common fork) + the tip end (t=1).
// app.js createCurveObjects reuses this constant for the viewport tip width handles
// (re-exported by panel-tip-strand.js / imported by bone-view-handles.js).
export const TIP_WIDTH_CONTROL_POINTS = 5;

// 段/管 i 的相邻 zipper 高度：左界 splits[i-1]、右界 splits[i]，任一侧无 zipper（最外
// 边界）时为 null。所有 fork 推导都从这里取值，调用方不得再自行索引 splits。
export function segmentZipperHeights(splits, segmentIndex) {
  const list = Array.isArray(splits) ? splits : [];
  const left = list[segmentIndex - 1]?.height;
  const right = list[segmentIndex]?.height;
  return { left: left == null ? null : left, right: right == null ? null : right };
}

// Per-side fork for the tip width control: the left edge is exposed below the LEFT
// zipper (splits[segment-1]), the right edge below the RIGHT zipper (splits[segment]).
// Boundary sides without a zipper fall back to the segment fork (bounded by the other
// side's zipper), so left/right control regions can differ.
export function tipWidthSideForkFromHeights(leftHeight, rightHeight, side) {
  const segmentForkT = 1 - Math.max(leftHeight ?? 0, rightHeight ?? 0);
  if (side < 0) return leftHeight != null ? 1 - leftHeight : segmentForkT;
  return rightHeight != null ? 1 - rightHeight : segmentForkT;
}

// The COMMON control fork for a segment: based on the DEEPEST of the two zippers.
// This is the SHARED GRID BASIS: both sides subdivide this one span, so the control
// parameters (and therefore the spacing) are identical on the left and the right.
export function tipWidthCommonForkFromHeights(leftHeight, rightHeight) {
  return 1 - Math.max(leftHeight ?? 0, rightHeight ?? 0);
}

// The raw control grid for a fork: 5 midpoints plus the tip end (t=1). Callers pass the
// COMMON (deepest-zipper) fork so both sides share one grid — see tipWidthGridFromHeights.
export function tipWidthControlTs(forkT) {
  const positions = [];
  for (let i = 0; i < TIP_WIDTH_CONTROL_POINTS; i += 1) {
    positions.push(THREE.MathUtils.lerp(forkT, 1, (i + 0.5) / TIP_WIDTH_CONTROL_POINTS));
  }
  positions.push(1);
  return positions;
}

// THE one shared control grid for a segment: TIP_WIDTH_CONTROL_POINTS midpoints of the
// COMMON (deepest-zipper) fork span plus the tip end (t=1). 两侧共用同一批 chain 参数
// → 间距永远一致；「暴露多少个」才是按各自 zipper 高度动态决定的（见
// tipWidthSideExposesTAt / tipWidthSideControlTsFrom）。Index into this array is the
// stable handle index used by bone-view-handles.js / bone-interaction.js.
export function tipWidthGridFromHeights(leftHeight, rightHeight) {
  return tipWidthControlTs(tipWidthCommonForkFromHeights(leftHeight, rightHeight));
}

// Does THIS side expose the shared-grid parameter t? Only the part of the grid inside
// this side's own exposed region (t >= 本侧 fork) is exposed; the sampler
// (tipWidthMultiplierAt) falls back to the GLOBAL curve below that fork, so anything
// below it must be neither authored into nor grabbable on this side.
// 单一定义点：placement / build / reset / write 全部走这里，避免各自复制判据。
export function tipWidthSideExposesTAt(sideForkT, t) {
  if (sideForkT >= 1) return false;
  return t >= sideForkT - 1e-4;
}

// The tip width control positions THIS side exposes: the subset of the SHARED
// (deepest-fork) grid that lies inside this side's own exposed region. 参数共享（两侧
// 间距一致），数量按本侧 zipper 高度动态变化 —— 深 zipper 侧暴露得多，浅 zipper 侧
// 只暴露靠发尖的几个。
// 不变式（0.2.118 起）：某个参数出现在本侧曲线数据里（因而影响本侧采样宽度）当且
// 仅当本侧为它提供了可抓把手。共享网格不会破坏它，因为低于本侧 fork 的网格位置
// 既不写入本侧曲线（buildTipWidthCurveFrom/tipWidthResetCurveFrom 只遍历本函数的
// 返回值），也不返回视口放置（tipWidthControlPlacement 用同一判据返回 null）。
export function tipWidthSideControlTsFrom(gridTs, sideForkT) {
  return (Array.isArray(gridTs) ? gridTs : []).filter((t) => tipWidthSideExposesTAt(sideForkT, t));
}

// 对侧 fork 记录点是否该写进本侧曲线：只有落在本侧 fork 之下（采样器在该区间回退
// 全局曲线，点不参与本侧宽度）时才写。若对侧 zipper 更浅（对侧 fork 更靠发尖），
// 它会落在本侧暴露区内部 → 成为没有把手却参与采样的「活点」（凹陷来源），必须不写。
// 共享网格（0.2.123）不解除这个危险：对侧 fork 是 zipper 高度的连续值，通常**不在**
// 共享网格上，所以它落进本侧暴露区时依然是一个不可抓的活点 → 守卫必须保留。
export function tipWidthRecordsOppositeForkFrom(ownForkT, oppositeForkT) {
  return oppositeForkT <= ownForkT + 1e-4;
}

// 曲线点累加器：position 钳到 [0,1]、value 钳到 [0.08,2]、同位置（< 1e-4）先到先得。
// reset 与 build 共用同一个累加规则（含去重阈值与钳位区间），避免两处各写一遍后漂移。
function createCurvePoints() {
  const points = [];
  const addPoint = (position, value) => {
    const clampedPosition = THREE.MathUtils.clamp(Number(position) || 0, 0, 1);
    if (points.some((point) => Math.abs(point.position - clampedPosition) < 1e-4)) return;
    points.push({
      position: clampedPosition,
      value: THREE.MathUtils.clamp(Number(value) ?? 0.5, 0.08, 2),
      interpolation: "linear"
    });
  };
  return { points, addPoint };
}

// Reset curve for a tip (segment) width curve: Reset 后整条曲线全 1 (full width value 1)
// across the entire exposed region, including both fork boundary points, so no global
// curve sampling happens after Reset.
export function tipWidthResetCurveFrom({ gridTs, sideForkT, oppositeForkT }) {
  // Reset 后整条曲线全 1: no global curve sampling, every point (both fork boundaries
  // and exposed-region control positions) is at full width value 1. The control
  // positions are the shared grid filtered to THIS side's exposed subset
  // (tipWidthSideControlTsFrom), so the reset curve carries a point at every position
  // this side can actually grab and nothing below its fork — 任何 zipper 高度组合下
  // Reset 都是平直全宽（无凹陷），因为整条曲线上所有点的值都是 1。
  const { points, addPoint } = createCurvePoints();
  addPoint(0, 1);
  // 本侧 fork 边界点（value 1，与控制点一致）；对侧 fork 只在它落在本侧 fork 之下
  // （不参与本侧采样）时作为记录点写入，避免在本侧暴露区留下无把手的活点。
  addPoint(sideForkT, 1);
  if (tipWidthRecordsOppositeForkFrom(sideForkT, oppositeForkT)) {
    addPoint(oppositeForkT, 1);
  }
  for (const position of tipWidthSideControlTsFrom(gridTs, sideForkT)) {
    addPoint(position, 1);
  }
  points.sort((a, b) => a.position - b.position);
  return points;
}

// Snap-and-write one value into an existing side curve; returns the updated array, or
// null when this side has nowhere writable. 只动曲线数组，bone 字段（taperCurve /
// taperCurveSecondary / asymmetricWidthCurve）与写后重建由调用方拥有。
export function setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t, value }) {
  const clamped = THREE.MathUtils.clamp(Number(value) || 0.5, 0.08, 2);
  // 写入位置吸附到本侧**暴露的**控制位置（tipWidthSideControlTsFrom = 共享网格 ∩ 本侧
  // 暴露区）。两侧参数虽同源，暴露的子集却按 zipper 高度不同：对称拖拽
  // （bone-interaction 用同一个 t 写两侧）传来的 t 可能不在本侧的暴露子集里。不吸附
  // 就会写出一个没有把手的点，且随后的 buildTipWidthCurveFrom 重建会把它丢掉（编辑丢失）。
  // 吸附后每个创作点都恰好落在一个可抓位置上。
  const positions = tipWidthSideControlTsFrom(gridTs, sideForkT);
  const requested = THREE.MathUtils.clamp(Number(t) || 0, 0, 1);
  // 本侧锁定区（低于本侧 fork）没有可编辑位置：该侧此处仍跟随主骨骼，跳过写入而不是
  // 把它吸附成一个可见编辑（zipper 更深的一侧才暴露那段）。
  if (requested < sideForkT - 1e-4) return null;
  // 本侧完全锁定（sideForkT >= 1，暴露子集为空）：无处可写。
  if (!positions.length) return null;
  const snapped = positions.reduce(
    (best, position) => (Math.abs(position - requested) < Math.abs(best - requested) ? position : best),
    positions[0]
  );
  // Update the curve point at the snapped control position in place (the fixed control
  // positions are always present in the lean curve, so no points accumulate).
  const existing = curve.find((point) => Math.abs(point.position - snapped) < 1e-3);
  if (existing) existing.value = clamped;
  else curve.push({ position: snapped, value: clamped, interpolation: "linear" });
  curve.sort((a, b) => a.position - b.position);
  return curve;
}

// Rebuild one side's curve. globalCurve = the curve this side effectively used before any
// tip edit (调用方按侧选择，见 panel-tip-strand.js 的适配器)；current = the side's
// existing authored curve (may be null).
export function buildTipWidthCurveFrom({ gridTs, sideForkT, oppositeForkT, globalCurve, current }) {
  const { points, addPoint } = createCurvePoints();
  // The locked (above-zipper) region is no longer baked into the curve: sampling falls
  // back to the global curve below the fork. The boundary point at THIS side's own fork
  // is a DERIVED CONTINUITY JOIN (always the global curve's value there, never a
  // draggable control point) that keeps the curve continuous at the zipper. The control
  // positions are the shared grid filtered to this side's exposed subset
  // (tipWidthSideControlTsFrom), so every AUTHORED point that can influence this side's
  // sampled width has a grabbable handle, and the tip end (t=1) is part of the control
  // array (addPoint dedupes).
  // 保留当前曲线已有的 0 点：Reset 的整段覆盖在后续编辑中持续。
  const zeroPoint = current && current.find((point) => Math.abs(Number(point.position) || 0) < 1e-4);
  if (zeroPoint) addPoint(0, zeroPoint.value);
  addPoint(sideForkT, sampleTaperCurve(globalCurve, sideForkT));
  // 对侧 fork 记录点（值取全局曲线采样）：asymmetricWidthCurve=false 时几何整段只采样
  // primary 曲线，其 fork 位置可能是对侧 fork（segment 全落在 u 一侧），只写本侧 fork
  // 会让对侧 fork 在重建后重新阶跃（zipper 开裂）。但只有当对侧 fork 落在本侧 fork
  // 之下（不参与本侧采样）时才写：若对侧 zipper 更浅，该点会落进本侧暴露区内部，成为
  // 没有把手却影响宽度的活点（正是宽度凹陷的来源）。
  if (tipWidthRecordsOppositeForkFrom(sideForkT, oppositeForkT)) {
    addPoint(oppositeForkT, sampleTaperCurve(globalCurve, oppositeForkT));
  }
  const controlTs = tipWidthSideControlTsFrom(gridTs, sideForkT);
  // 向后兼容：0.2.118 曾按各侧自己的 fork 分布控制点，已有 .ahs 里的曲线点
  // 可能落在现在不再使用的参数上。精确命中优先（正常重建路径，值不变）；否则若当前
  // 曲线已有创作数据，就在新位置上采样旧曲线，把创作形状迁移到可抓位置，而不是丢
  // 回全局默认（避免旧文件在下次编辑时突然跳变或留下凹陷）。空/缺失曲线仍取全局值。
  const hasAuthored = Array.isArray(current) && current.length >= 2;
  for (const position of controlTs) {
    const edited = current && current.find((point) => Math.abs(point.position - position) < 1e-3);
    const migrated = hasAuthored ? sampleTaperCurve(current, position) : null;
    addPoint(
      position,
      edited ? edited.value : (migrated != null ? migrated : sampleTaperCurve(globalCurve, position))
    );
  }
  points.sort((a, b) => a.position - b.position);
  return points;
}
