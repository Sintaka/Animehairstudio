// width-brush.js - Width Brush (sculpt-width) 的纯函数内核：刷发尖 WidthCurve 的**既有**
// 控制点。
//
// 为什么不放进 sculpt-brush.js（刻意不改的原因，standards 第四类注释）：那里是其余 8 个
// 雕刻笔刷的内核，看起来才是本函数的家。但 tests/dom-contract.test.mjs 冻结了 app.js 的
// `sculpt-brush.js?v=20260814-12` 这个具体版本串，而 0.2.110 的教训是「新增 export 的模块，
// 其全部 import 站点都要一起 bump」—— 否则回访用户会用缓存里的旧模块去解析新增的 named
// export，直接 SyntaxError 整个应用打不开。两条约束在 sculpt-brush.js 上正面冲突（改冻结
// 断言不在本轮写集内），所以新内核独立成文件：全新模块没有任何旧缓存，不存在该失效。
// 若将来那条冻结断言随版本 bump 一起更新了，可以把本文件合回 sculpt-brush.js。
//
// 语义（index.html 的 tooltip 即契约）：拖动 = 收窄，Ctrl = 加宽。方向只来自拖动**距离**
// （magnitude），不含相机项、也不含「朝哪边拖」—— 与 sculpt-scale 同一口径，因为宽度不是
// 一个有左右的量：把它绑到 deltaX 的符号会让「从右往左刷」与「从左往右刷」结果相反，而
// 用户刷的是一条边，来回抹动必须持续收窄而不是互相抵消。
//
// ★ 方案 C（用户拍板）：笔刷**不做任何 chain-t → 曲线 position 的换算**。它用与绿色手柄
// **同一个** tipWidthControlPlacement 枚举已暴露的控制点，按**屏幕距离**取最近的一个，然后
// 推它。于是：① remap 问题按构造消失（没有第二套参数空间）；② 笔刷与手柄一致按构造成立
// （同一个 placement 函数，不是靠守卫）；③「只改现有关键点」按构造成立（候选集就是既有
// 控制点，笔刷无法新增位置）。
//
// **刻意继承一个已知 bug**（standards 第四类注释）：placement 读 raw grid t
// （tipWidthControlPlacement → tipWidthEdgePosition 的 tipWidthMultiplierAt(lock, t, …)）而
// 几何读 sampleT（panelPoint → rawPanelPoint 的 panelWidthAt(sampleT, …)），于是
// `panelTipCurve ≠ 0` 或 edgeTrim ≠ 0 时手柄与它控制的几何有错位。用户已知情并要求单独开
// 一轮修。笔刷复用 placement 正是为了**不碰**它 —— 这样笔刷与手柄的错位量恒等，修
// placement 时两者一起修好。若在这里另做一次换算来「绕过」它，就会造出第三种行为，且那一
// 轮修完还得回来拆掉。
import { TIP_WIDTH_VALUE_MAX, TIP_WIDTH_VALUE_MIN } from "../geometry/tip-width-curve.js?v=20260910-9";

export const SCULPT_WIDTH_BRUSH_SCALE = 0.01;

// Drag => shrink. Flip this one constant to reverse the brush globally (Ctrl 仍在此之上取反)。
// **不要**把符号并进 SCULPT_WIDTH_BRUSH_SCALE：scale 可被调用方覆盖，符号藏在里面会被静默
// 恢复（与 sculpt-brush.js 的 TWIST_DIRECTION 同一条理由）。
const WIDTH_DIRECTION = -1;

// 屏幕最近的候选控制点。candidates 每项 { x, y, ... }（**像素**空间，投影由调用方完成 ——
// 本模块刻意不 import three/camera，才能在 node 测试里直接喂像素坐标）。返回原样的那一项 +
// 它的下标与距离；maxDistance 之外一律 null（笔刷的圆形选区语义：光标离所有控制点都远时
// 必须什么都不做，而不是去推一个屏幕外的点）。
// 并列时取**先到**（下标小者）：稳定、可测，且与 setTipWidthCurveValueFrom 的吸附同口径。
export function nearestScreenCandidate(candidates, cursorX, cursorY, maxDistance = Infinity) {
  const list = Array.isArray(candidates) ? candidates : [];
  const rawLimit = Number(maxDistance);
  const limit = Number.isFinite(rawLimit) ? Math.max(0, rawLimit) : Infinity;
  const x0 = Number(cursorX) || 0;
  const y0 = Number(cursorY) || 0;
  let best = null;
  list.forEach((candidate, index) => {
    if (!candidate) return;
    const x = Number(candidate.x);
    const y = Number(candidate.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const distance = Math.hypot(x - x0, y - y0);
    if (distance > limit) return;
    // 严格 `<` ⇒ 并列时保留先到者。
    if (best && distance >= best.distance) return;
    best = { candidate, index, distance };
  });
  return best;
}

// 相对倍率增量：`current × (1 + amount)`，与绿色手柄拖拽的**比例**响应同族（那边是
// startMult × (1 + (ratio − 1) × 0.5)）。刻意用相对而非绝对增量：绝对增量在已经很窄的边上
// 会一步撞到下界、在很宽的边上又几乎看不出来。
export function sculptWidthBrushAmount(strokeDistance, weight, strength, options = {}) {
  // Math.abs：方向只由 WIDTH_DIRECTION 与 reverse 决定，不由拖动朝向决定（见文件头）。
  const distance = Math.abs(Number(strokeDistance) || 0);
  const influence = Math.min(1, Math.max(0, Number(weight) || 0));
  const amount = Number(strength) || 0;
  const scale = Number.isFinite(Number(options.scale)) ? Number(options.scale) : SCULPT_WIDTH_BRUSH_SCALE;
  return WIDTH_DIRECTION * (options.reverse ? -1 : 1) * distance * influence * amount * scale;
}

// 目标倍率。钳位区间**引用** tip-width-curve 的唯一定义点：笔刷若自带一套界，算出的值会被
// 写入侧静默改小，于是「刷到底」与「写入饱和」不在同一点，用户看到的是最后一段刷不动。
// 非有限 / 非正的 current 退化成 1（曲线缺失时的中性宽度），而不是产出 NaN 写进存档。
export function sculptWidthBrushMultiplier(currentMultiplier, strokeDistance, weight, strength, options = {}) {
  const current = Number(currentMultiplier);
  const base = Number.isFinite(current) && current > 0 ? current : 1;
  const next = base * (1 + sculptWidthBrushAmount(strokeDistance, weight, strength, options));
  const min = Number.isFinite(Number(options.min)) ? Number(options.min) : TIP_WIDTH_VALUE_MIN;
  const max = Number.isFinite(Number(options.max)) ? Number(options.max) : TIP_WIDTH_VALUE_MAX;
  return Math.min(max, Math.max(min, next));
}

// ── Shift 临时平滑（Width Brush 特化）的线性标量序列平滑 ─────────────────────────────────
// 用途：sculpt-width 被 Shift 临时切到 sculpt-smooth 时，平滑的是紫色/绿色 WidthCurve 关键点
// 的 value 序列——那是**线性倍率域**（1 = 中性宽度，无环绕语义），不是角度。
//
// 为什么不能复用 sculpt-brush.js 的 smoothSculptTwistDeltas：那个函数内部硬编码了 Math.PI
// 角度 wrap（取「最短角差」），套在线性值上会把跨越某个数值的一对邻居错当成「绕了一圈的
// 角度」去算目标值，产生方向/幅度都错误的结果（对照测试见
// tests/sculpt-brush-shift-smooth-freedom.test.mjs）。
//
// 为什么放在 width-brush.js 而不是 sculpt-brush.js：见本文件头「刻意不改的原因」——
// tests/dom-contract.test.mjs 冻结了 app.js 里 sculpt-brush.js 的具体 `?v=` 版本串，而
// 0.2.110 的教训是"新增 export 的模块，其全部 import 站点都要一起 bump 那个版本号"，否则
// 回访用户会用缓存里的旧模块解析新增的 named export 直接 SyntaxError。width-brush.js 的
// import 站点少（仅 sculpt-geometry.js / bone-interaction.js 两处，且两处的调用方本轮已经在
// 改），风险可控，故新函数落在这里而不是去碰被冻结的 sculpt-brush.js。
//
// 语义与 smoothSculptTwistDeltas 同构（同构不是巧合——两者都是"链上/曲线上相邻元素平均"的
// 同一套平滑算法，唯一区别是要不要 wrap）：逐元素向左右邻居的平均值靠近；首尾各只有一侧
// 邻居时就直接靠近那一侧（不像 smoothSculptPointDeltas/smoothSculptTwistDeltas 把 index 0
// 硬钳成「根节点绝不动」——WidthCurve 没有那个「链根必须锚定」的约定，手动拖拽和真正的
// Width Brush 都允许推动第一个关键点，这里的平滑也不该比手动编辑更保守）。
export function smoothLinearScalarDeltas(values, weights, strength = 1, rate = 0.04) {
  const source = Array.isArray(values) ? values : [];
  const influence = Math.min(1, Math.max(0, Number(strength) || 0));
  const smoothingRate = Math.min(1, Math.max(0, Number(rate) || 0));
  return source.map((value, index) => {
    if (source.length < 2) return 0;
    const weight = Math.min(1, Math.max(0, Number(weights?.[index]) || 0));
    const amount = weight * influence * smoothingRate;
    if (amount <= 0) return 0;
    const previous = index > 0 ? Number(source[index - 1]) || 0 : null;
    const next = index < source.length - 1 ? Number(source[index + 1]) || 0 : null;
    let target;
    if (previous !== null && next !== null) target = (previous + next) * 0.5;
    else target = previous !== null ? previous : next;
    if (target === null) return 0;
    return (target - (Number(value) || 0)) * amount;
  });
}
