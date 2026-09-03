// 旧档兼容：把已退役的 `twistCurve`（曲线）bake 成 `pointTwists`（逐控制点标量）。
//
// 背景：twistCurve 与 pointTwists 曾是两条独立且相加的贡献源
//   strandTwistAt = controlPointRotationAt(pointTwists)     ← 笔刷写这个
//                 + strandProfileTwistAt(… twistCurve …)     ← 曲线（已下线）
// 曲线编辑 UI 退役后，若只删 UI 保字段，旧档仍在应用 twistCurve 却无法编辑。
// 因此加载旧档时把曲线的贡献并入 pointTwists，运行时不再消费 twistCurve。
//
// ★ 两个不可省的换算细节（写错会静默放大/翻倍）：
//  1) 单位不同：twistCurve 的 value 是**度**（TWIST_CURVE_VALUE_MAX = 4500），
//     而 pointTwists 存的是**弧度**（controlPointRotationAt 不做 degToRad）。
//  2) 语义不同：运行时读曲线走的是 sampleIntegratedEnvelopeCurve（**累积积分**，
//     即「旋转速率」积分成「旋转角」），不是 sampleTaperCurve 直接采样。
//     ⇒ 必须逐点求积分值，**不能直接搬 value 数组**（两者可差 90~180°）。
import { sampleIntegratedEnvelopeCurve } from "../geometry/curve-math.js";

const DEG_TO_RAD = Math.PI / 180;

/** 曲线是否有任何非零贡献。全零（含默认平曲线）时 bake 是恒等操作，可整体跳过。 */
export function twistCurveHasContribution(curve) {
  if (!Array.isArray(curve) || curve.length === 0) return false;
  return curve.some((point) => Number(point?.value || 0) !== 0);
}

/**
 * 逐控制点求 twistCurve 的积分值（弧度），返回要**累加**到 pointTwists 的增量数组。
 * @param {Array} curve twistCurve（value 单位为度）
 * @param {number} count 控制点数；与 lock.points.length 对齐
 * @returns {number[]} 长度为 count 的弧度增量
 */
export function bakedTwistDeltas(curve, count) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  if (total === 0 || !twistCurveHasContribution(curve)) return new Array(total).fill(0);
  const deltas = new Array(total);
  for (let index = 0; index < total; index += 1) {
    const t = total <= 1 ? 0 : index / (total - 1);
    deltas[index] = sampleIntegratedEnvelopeCurve(curve, t) * DEG_TO_RAD;
  }
  return deltas;
}

/**
 * 就地把 lock.twistCurve bake 进 lock.pointTwists，并把曲线归零。
 *
 * ★ 归零是**幂等性**要求，不是清洁癖：快照仍然序列化 twistCurve，
 *   若 bake 后留着原曲线，存盘再打开会二次 bake ⇒ twist 逐次翻倍。
 *
 * @param {object} lock 已完成字段展开的 lock（需 points / pointTwists / twistCurve 就位）
 * @param {Array} flatCurve 归零后写入的平曲线（传 DEFAULT_TWIST_CURVE）
 * @returns {boolean} 是否真的改动了数据（无贡献时返回 false）
 */
export function bakeTwistCurveIntoPointTwists(lock, flatCurve) {
  if (!lock || !twistCurveHasContribution(lock.twistCurve)) return false;
  // 以 pointTwists 的现有长度为准：它已由 restoreLock 按 points 补齐，
  // 直接用它可避免 points 与 pointTwists 长度不一致时越界写入。
  const count = Array.isArray(lock.pointTwists) ? lock.pointTwists.length : 0;
  if (count === 0) return false;
  const deltas = bakedTwistDeltas(lock.twistCurve, count);
  for (let index = 0; index < count; index += 1) {
    lock.pointTwists[index] = Number(lock.pointTwists[index] || 0) + deltas[index];
  }
  lock.twistCurve = (flatCurve || []).map((point) => ({ ...point }));
  return true;
}
