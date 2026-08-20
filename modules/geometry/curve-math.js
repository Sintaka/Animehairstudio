// 曲率感知环收窄（Elber 1997 / Maekawa 1999，scale=min(1,safety·ρ/r)）
function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

export function clumpMemberGuideParameter(amount, start = 0, end = 1) {
  const normalizedStart = clamp(Number(start) || 0, 0, 1);
  const normalizedEnd = clamp(Number(end ?? 1), normalizedStart, 1);
  return lerp(normalizedStart, normalizedEnd, clamp(Number(amount) || 0, 0, 1));
}

export function relaxAngleValue(current, before, after, strength) {
  const value = Number(current) || 0;
  const angularDelta = (target) => {
    const delta = (Number(target) || 0) - value;
    return Math.atan2(Math.sin(delta), Math.cos(delta));
  };
  const beforeAngle = Number(before) || 0;
  const afterAngle = Number(after) || 0;
  const meanX = Math.cos(beforeAngle) + Math.cos(afterAngle);
  const meanY = Math.sin(beforeAngle) + Math.sin(afterAngle);
  const neighborDelta = meanX * meanX + meanY * meanY > 0.00000001
    ? angularDelta(Math.atan2(meanY, meanX))
    : (angularDelta(beforeAngle) + angularDelta(afterAngle)) * 0.5;
  return value + neighborDelta * clamp(Number(strength) || 0, 0, 1);
}

export function curvedRelaxPositionTarget(points, index) {
  const before = points?.[index - 1];
  const current = points?.[index];
  const after = points?.[index + 1];
  if (!before || !current || !after) return null;
  const midpoint = {
    x: (Number(before.x) + Number(after.x)) * 0.5,
    y: (Number(before.y) + Number(after.y)) * 0.5,
    z: (Number(before.z) + Number(after.z)) * 0.5
  };
  const outerBefore = points[index - 2];
  const outerAfter = points[index + 2];
  const axisTarget = (axis) => {
    if (outerBefore && outerAfter) {
      const beforeCurvature = Number(before[axis])
        - (Number(outerBefore[axis]) + Number(current[axis])) * 0.5;
      const afterCurvature = Number(after[axis])
        - (Number(current[axis]) + Number(outerAfter[axis])) * 0.5;
      return midpoint[axis] + (beforeCurvature + afterCurvature) * 0.5;
    }
    if (outerAfter) {
      return Number(before[axis]) / 3 + Number(after[axis]) - Number(outerAfter[axis]) / 3;
    }
    if (outerBefore) {
      return Number(before[axis]) + Number(after[axis]) / 3 - Number(outerBefore[axis]) / 3;
    }
    return midpoint[axis];
  };
  return { x: axisTarget("x"), y: axisTarget("y"), z: axisTarget("z") };
}

function smoothstep(value, minimum, maximum) {
  const amount = clamp((value - minimum) / (maximum - minimum), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

export function legacyTaperCurve(shape = {}) {
  const rootTaper = clamp(Number(shape.rootTaper ?? 0), 0, 1);
  const rootEnd = clamp(Number(shape.rootTaperEnd ?? 0.2), 0.02, 0.6);
  const tipTaper = clamp(Number(shape.taper ?? 1), 0, 1);
  const tipStart = clamp(Number(shape.taperStart ?? 0.42), rootEnd, 0.95);
  return [
    { position: 0, value: 1 - rootTaper, interpolation: "smooth" },
    { position: rootEnd, value: 1, interpolation: "smooth" },
    { position: tipStart, value: 1, interpolation: "smooth" },
    { position: 1, value: 1 - tipTaper, interpolation: "smooth" }
  ];
}

export function normalizeTaperCurve(curve, fallback = {}, valueMaximum = 1.5) {
  const source = curve?.length >= 2 ? curve : legacyTaperCurve(fallback);
  const points = source.map((point) => ({
    position: clamp(Number(point.position), 0, 1),
    value: clamp(Number(point.value), 0, valueMaximum),
    interpolation: ["linear", "smooth", "constant"].includes(point.interpolation) ? point.interpolation : "smooth"
  })).sort((left, right) => left.position - right.position);
  points[0].position = 0;
  points.at(-1).position = 1;
  return points;
}

export function normalizeEnvelopeCurve(curve, fallback, valueMinimum, valueMaximum) {
  const source = curve?.length >= 2 ? curve : fallback;
  const minimum = Number(valueMinimum);
  const maximum = Number(valueMaximum);
  const points = source.map((point) => ({
    position: clamp(Number(point.position), 0, 1),
    value: clamp(Number(point.value), minimum, maximum),
    interpolation: ["linear", "smooth", "constant"].includes(point.interpolation) ? point.interpolation : "smooth"
  })).sort((left, right) => left.position - right.position);
  points[0].position = 0;
  points.at(-1).position = 1;
  return points;
}

const tangentCache = new WeakMap();

export function smoothTaperTangents(curve) {
  const signature = curve.map((point) => `${point.position}:${point.value}`).join("|");
  const cached = tangentCache.get(curve);
  if (cached?.signature === signature) return cached.tangents;
  const intervals = curve.slice(0, -1).map((point, index) => Math.max(0.0001, curve[index + 1].position - point.position));
  const slopes = intervals.map((interval, index) => (curve[index + 1].value - curve[index].value) / interval);
  const tangents = curve.map((point, index) => {
    if (index === 0) return slopes[0] || 0;
    if (index === curve.length - 1) return slopes.at(-1) || 0;
    const before = slopes[index - 1];
    const after = slopes[index];
    if (!before || !after || Math.sign(before) !== Math.sign(after)) return 0;
    const beforeWeight = 2 * intervals[index] + intervals[index - 1];
    const afterWeight = intervals[index] + 2 * intervals[index - 1];
    return (beforeWeight + afterWeight) / (beforeWeight / before + afterWeight / after);
  });
  tangentCache.set(curve, { signature, tangents });
  return tangents;
}

export function sampleTaperCurve(curve, t) {
  if (!curve?.length) return 1;
  const clampedT = clamp(t, 0, 1);
  const rightIndex = curve.findIndex((point) => point.position >= clampedT);
  if (rightIndex <= 0) return curve[0].value;
  if (rightIndex < 0) return curve.at(-1).value;
  const left = curve[rightIndex - 1];
  const right = curve[rightIndex];
  const span = Math.max(0.0001, right.position - left.position);
  let amount = clamp((clampedT - left.position) / span, 0, 1);
  if (left.interpolation === "constant") amount = 0;
  if (left.interpolation === "smooth") {
    const tangents = smoothTaperTangents(curve);
    const amount2 = amount * amount;
    const amount3 = amount2 * amount;
    const value = (2 * amount3 - 3 * amount2 + 1) * left.value
      + (amount3 - 2 * amount2 + amount) * span * tangents[rightIndex - 1]
      + (-2 * amount3 + 3 * amount2) * right.value
      + (amount3 - amount2) * span * tangents[rightIndex];
    return clamp(value, Math.min(left.value, right.value), Math.max(left.value, right.value));
  }
  return lerp(left.value, right.value, amount);
}

export function remapEnvelopeCurveRange(curve, start = 0, end = 1) {
  if (!curve?.length) return [];
  const normalizedStart = clamp(Number(start) || 0, 0, 1);
  const normalizedEnd = clamp(Number(end ?? 1), normalizedStart, 1);
  const span = normalizedEnd - normalizedStart;
  if (span <= 0.000001) {
    const value = sampleTaperCurve(curve, normalizedStart);
    return [
      { position: 0, value, interpolation: "smooth" },
      { position: 1, value, interpolation: "smooth" }
    ];
  }
  const interpolationAt = (position) => {
    const rightIndex = curve.findIndex((point) => Number(point.position) > position + 0.000001);
    const leftIndex = rightIndex < 0 ? curve.length - 1 : Math.max(0, rightIndex - 1);
    const interpolation = curve[leftIndex]?.interpolation;
    return ["linear", "smooth", "constant"].includes(interpolation) ? interpolation : "smooth";
  };
  const remapped = [{
    position: 0,
    value: sampleTaperCurve(curve, normalizedStart),
    interpolation: interpolationAt(normalizedStart)
  }];
  curve.forEach((point) => {
    const position = Number(point.position);
    if (position <= normalizedStart + 0.000001 || position >= normalizedEnd - 0.000001) return;
    remapped.push({
      position: (position - normalizedStart) / span,
      value: Number(point.value),
      interpolation: ["linear", "smooth", "constant"].includes(point.interpolation)
        ? point.interpolation
        : "smooth"
    });
  });
  remapped.push({
    position: 1,
    value: sampleTaperCurve(curve, normalizedEnd),
    interpolation: interpolationAt(normalizedEnd)
  });
  return remapped;
}

const integratedEnvelopeCache = new WeakMap();

export const TWIST_RATE_DEGREES_PER_UNIT = 90;

export function twistRateUnitsFromDegrees(value) {
  return Number(value || 0) / TWIST_RATE_DEGREES_PER_UNIT;
}

export function twistRateDegreesFromUnits(value) {
  return Number(value || 0) * TWIST_RATE_DEGREES_PER_UNIT;
}

export function sampleIntegratedEnvelopeCurve(curve, t, sampleCount = 128) {
  if (!curve?.length) return 0;
  const count = Math.max(16, Math.round(Number(sampleCount) || 128));
  const signature = `${count}|${curve.map((point) => (
    `${point.position}:${point.value}:${point.interpolation}`
  )).join("|")}`;
  let cached = integratedEnvelopeCache.get(curve);
  if (cached?.signature !== signature) {
    const cumulative = [0];
    let previous = sampleTaperCurve(curve, 0);
    for (let index = 1; index <= count; index += 1) {
      const current = sampleTaperCurve(curve, index / count);
      cumulative.push(cumulative.at(-1) + (previous + current) * 0.5 / count);
      previous = current;
    }
    cached = { signature, cumulative };
    integratedEnvelopeCache.set(curve, cached);
  }
  const scaled = clamp(Number(t), 0, 1) * count;
  const index = Math.floor(scaled);
  const nextIndex = Math.min(count, index + 1);
  return lerp(
    cached.cumulative[index],
    cached.cumulative[nextIndex],
    scaled - index
  );
}

export function sampleAsymmetricTaperCurve(
  primaryCurve,
  secondaryCurve,
  asymmetric,
  signedCoordinate,
  t,
  blendZone = 1
) {
  // 非对称时： signedCoordinate 超过 ±blendZone 完全用对应侧曲线，中间线性过渡；
  // blendZone=1 为整段混合（默认），更小的带宽让每侧曲线在外部独立（发尖非对称拖动不带动另一侧）。
  if (asymmetric && secondaryCurve?.length >= 2) {
    const primaryValue = sampleTaperCurve(primaryCurve, t);
    const secondaryValue = sampleTaperCurve(secondaryCurve, t);
    const coordinate = Number(signedCoordinate);
    if (!Number.isFinite(coordinate)) return primaryValue;
    const zone = Math.max(0.0001, Number(blendZone) || 1);
    const alpha = clamp((coordinate + zone) / (2 * zone), 0, 1);
    return lerp(secondaryValue, primaryValue, alpha);
  }
  return sampleTaperCurve(primaryCurve, t);
}

export function mirroredAsymmetricTaperCurves(primaryCurve, secondaryCurve, asymmetric) {
  const cloneCurve = (curve, fallback) => (curve?.length >= 2 ? curve : fallback || [])
    .map((point) => ({ ...point }));
  const primary = cloneCurve(primaryCurve, secondaryCurve);
  const secondary = cloneCurve(secondaryCurve, primaryCurve);
  return asymmetric
    ? { primary: secondary, secondary: primary }
    : { primary, secondary };
}

export function profileTopologyCenterWeight(coordinate, minimum, maximum) {
  const value = Number(coordinate);
  const min = Number(minimum);
  const max = Number(maximum);
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) return 0;
  if (value < 0) return min < -0.000001 ? clamp(1 - value / min, 0, 1) : 0;
  if (value > 0) return max > 0.000001 ? clamp(1 - value / max, 0, 1) : 0;
  return 1;
}

export function panelTipCurveParameter(t, u, tipCurve = 0, edgeTrim = 0) {
  const along = clamp(Number(t) || 0, 0, 1);
  const lateral = clamp(Number(u) || 0, -1, 1);
  const strength = clamp(Number(tipCurve) || 0, -1, 1);
  const availableLength = 1 - clamp(Number(edgeTrim) || 0, 0, 0.75);
  if (Math.abs(strength) < 0.000001) return along * availableLength;

  const edgeWeight = lateral * lateral;
  const bowWeight = strength > 0 ? edgeWeight : 1 - edgeWeight;
  const featherAmount = clamp((along - 0.5) / 0.5, 0, 1);
  const feather = featherAmount * featherAmount * (3 - 2 * featherAmount);
  const maximumTipLoss = availableLength * 0.3;
  return clamp(
    along * availableLength - Math.abs(strength) * bowWeight * maximumTipLoss * feather,
    0,
    1
  );
}

// 根部守卫带宽：收缩权重在 t < 该值的区间内被 smoothstep 压回 0，t == 0 处恒为 0。
// 取 0.05 ≈ 默认 panelLengthLoops(10) 行距 0.1 的一半 —— 在默认细分下只有 row 0
// 落进守卫带，row 1(t=0.1) 已拿到完整权重，所以形变不会被"抹平在根部附近"；
// 同时用 smoothstep 而非硬阶跃，让连续采样的消费方（发尖 rest 链、
// tipSurfaceFrameAt 的差分求法线）不会在 t→0 处读到跳变而算出错误法线。
const PANEL_SCALP_CONFORM_ROOT_GUARD = 0.05;

// Scalp Conform 的四个参数默认值 —— **本文件是唯一定义点**，app.js 的
// panelCreationDefaults 与 index.html 的 value= 都必须与此同值（不同源会让"没动过滑杆"
// 的面板与默认几何不一致，这类三处漂移在本仓库有先例）。
// amount 0 = 关闭（输出与引入前逐位相同）；range 0.6 = 从根部 60% 处收满；
// gap 0.02 = 离头皮的世界空间余量（防止与头模 z-fighting）；
// cylinder 0.5 = Capsule 圆柱段向下延伸的长度（单位球空间），让长刘海直着垂下来。
export const PANEL_SCALP_CONFORM_DEFAULTS = Object.freeze({
  amount: 0,
  range: 0.15,
  gap: 0.02,
  cylinder: 0.5
});

// range（Root Release）的上限 —— **刻意很小，这是几何约束不是审美选择**。
// 0.2.136 初版把它当"艺术衰减"、上限 1、默认 0.6，实测是个陷阱：ramp 跨度内的行处于
// **部分贴合**状态，顶点落在「原始构型」与「裹住头的构型】之间，而这两者差异极大 ⇒
// 中间态不在任何光滑曲面上，表现为整片在根部到中段之间**鼓出一个包再收回去**
// （用户报告的"诡异的挤压"）。实测（width=5 的夸张 panel、目标距头心 1.155）：
//   range 0.91 ⇒ 各行距离 1.17→1.42→1.24，最大偏离目标 0.267（鼓包）
//   range 0.40 ⇒ 跨度序列出现 3 次方向反转（原始形状只有 1 次）＝ 褶皱
//   range 0.15 ⇒ 距离几乎恒定 1.17→1.24，最大偏离 0.083，反转次数与原始形状相同
// 上限 **0.25 是扫出来的边界、不是拍的**（同一 panel 细扫 0.05→0.30）：
//   0.05..0.25 ⇒ 跨度序列方向反转 1 次（与 conform 关闭时的原始形状相同）、最大偏离 ≤0.093
//   0.30       ⇒ 反转跳到 3 次、最大偏离 0.104  ← 褶皱在此出现
// 该边界与细分有关（默认 panelLengthLoops=10 ⇒ 行距 0.1，0.25 约等于"放开两行"），
// 所以它是**经验上限**而非普适常数；改细分默认值时应重扫。
// 它的职责只是**把根部那一两行平滑地放开**（row 0 被 UV 红线钉死，不给过渡会在根部留
// 一个台阶），不是让半张面板长期停在中间态。
export const PANEL_SCALP_CONFORM_MAX_RANGE = 0.25;

// ── 面板「贴合头皮」Scalp Conform：世界空间收缩包裹（shrink-wrap）──────────────
//
// 0.2.136 **替换**了 0.2.134/0.2.135 的「沿面板法线偏移」模型。用户诊断原文：
// 「可能不能简单根据法线去弯折一个刘海, 因为那终究是单个刘海, 而非用户想贴着头皮的
// 前额部分去弯折, 导致刘海会拱起来而且后推的边缘并没有很好的贴近它该有的位置」。
//
// **根因确凿**：旧模型的位移是沿**面板自己的 frame.z** 的标量偏移 —— 纯局部量，
// 完全不知道头皮在世界空间的哪里。边缘只是"沿自己法线退了一段公式算出来的距离"，
// 落点与头皮实际位置无关；拱起同理（面板相对自己弯，而不是去贴一个外部曲面）。
// 旁证：app.js 现有的 `outwardNormalAtPoint` 也只是「以世界原点为心的径向」，
// 连 `scalpSurface` 的 y=0.9 都没用上 —— 旧模型建立在同一套错误认知上。
//
// **新模型**：每个顶点朝**真实头部代理表面**收敛，落点由几何决定而非公式。
//   delta = (target − point) · amount · weight(t)
// amount = 1 ⇒ 顶点**精确**落到 target（可测的恒等式）；amount < 0 ⇒ 推离头皮。
//
// **头部代理 = Capsule 的一端**（用户建议）：单位球空间里 y ≥ 0 是半球、y < 0 是圆柱段。
// 为什么不用纯球：长刘海垂到下巴时，纯球在赤道以下会让顶点**朝内卷**（往下巴底下收），
// Capsule 的圆柱段让它直着垂下来 —— 这是纯球模型解决不了的。
//
// **本函数组不再需要 u**：形状来自头部几何，不来自"沿宽度方向的公式"。这是相对
// 0.2.135 的实质简化（那时 cap/recede 都是 u 的函数）。
// 沿 t 的收缩权重。**契约：t == 0 处恒为 0**，两条独立理由，缺一不可：
// ① UV 红线：modules/io/uv-unfold.js 的 U 完全由 row 0 的环向弧长决定、V 纯行号，
//    所以任何触到 t == 0 的位移都会改变 row 0 顶点、静默重排每一片面板的 UV
//    （见 AGENT_QUICKSTART.md §2.4b「UV 红线」）。
// ② 物理：面板根锚在头皮上 —— 发根那一圈**本来就贴着头**，无需再收；真正需要往回收的
//    是往下走、绕过颅侧的部分。
// 守卫写在本函数**内部**，任何消费方都无法忘记它。
//
// range = 根部释放带宽度（0.05..PANEL_SCALP_CONFORM_MAX_RANGE）。**刻意只能很短** ——
// 它的职责是把被 UV 红线钉死的 row 0 平滑放开，不是"艺术衰减"。ramp 跨度内的行处于
// 部分贴合状态，而部分贴合的顶点不在任何光滑曲面上（详见 MAX_RANGE 常量处的实测数据）。
// 用 smoothstep 而非线性：两端一阶导为 0，避免在"刚收满"那一行出现折痕
// （tipSurfaceFrameAt 靠差分求法线，折痕会让它算出错误法线）。
export function panelScalpConformWeight(t, range = PANEL_SCALP_CONFORM_DEFAULTS.range) {
  const along = clamp(Number(t) || 0, 0, 1);
  if (along <= 0) return 0;
  const span = clamp(Number(range) || 0, 0.05, PANEL_SCALP_CONFORM_MAX_RANGE);
  const guardAmount = clamp(along / PANEL_SCALP_CONFORM_ROOT_GUARD, 0, 1);
  const guard = guardAmount * guardAmount * (3 - 2 * guardAmount);
  const ramp = clamp(along / span, 0, 1);
  return guard * ramp * ramp * (3 - 2 * ramp);
}

// Capsule 一端的最近表面点（**单位球空间**：椭球已被调用方按 radius·scaleXYZ 归一）。
// 轴 = 从原点沿 −y 到 (0, −cylinder, 0) 的线段；对轴上最近点取径向、外推单位半径。
// y ≥ 0 ⇒ 轴上最近点是原点 ⇒ 退化为半球（头顶）；
// y < −cylinder ⇒ 最近点是轴末端 ⇒ 又是半球（下巴以下的收口）；
// 中间 ⇒ 最近点在轴内部 ⇒ 圆柱段：径向只在 xz 平面内 ⇒ **顶点不朝内卷、直着垂下来**。
// 返回 { surface, axis }：surface 用于定位，axis 用于让调用方算径向（世界空间的 gap 方向）。
// 纯函数、只吃数字，故可在无场景图的 node 测试里直接验证。
export function capsuleEndNearestSurface(x, y, z, cylinder) {
  const depth = Math.max(0, Number(cylinder) || 0);
  // 轴上最近点：沿 −y 方向的行程钳在 [0, depth]，即 axisY = −clamp(−y, 0, depth)。
  // **`travel === 0` 时必须回 +0 而不是 `-0`**：`-clamp(...)` 在 clamp 得 0 时产出负零，
  // 对位置无影响（x + -0 === x），但 `Object.is(-0, 0) === false` 会让「y≥0 时轴上最近点
  // 恰为原点」这类精确断言失败，也会让将来任何按符号分流的消费方产生歧义。
  // （本仓库同一类坑有先例：0.2.134 的球冠 strength 为负时 `strength * … * 0` 得 -0。）
  const travel = clamp(-(Number(y) || 0), 0, depth);
  const axisY = travel === 0 ? 0 : -travel;
  const dx = (Number(x) || 0) - 0;
  const dy = (Number(y) || 0) - axisY;
  const dz = (Number(z) || 0) - 0;
  const length = Math.hypot(dx, dy, dz);
  // 点恰在轴上时径向无定义 —— 取 +z（面部朝向）而不是任意轴，让退化情形仍朝脸前方推出。
  const nx = length < 0.000001 ? 0 : dx / length;
  const ny = length < 0.000001 ? 0 : dy / length;
  const nz = length < 0.000001 ? 1 : dz / length;
  return {
    surface: { x: nx, y: axisY + ny, z: nz },
    axis: { x: 0, y: axisY, z: 0 }
  };
}

export function panelTipLoopParameters(baseLoopCount, extraTipLoops = 0, tipStart = 0.55) {
  const baseLoops = Math.max(1, Math.round(Number(baseLoopCount) || 1));
  const extraLoops = Math.max(0, Math.min(16, Math.round(Number(extraTipLoops) || 0)));
  const start = clamp(Number(tipStart) || 0.55, 0, 0.95);
  const parameters = Array.from({ length: baseLoops + 1 }, (_, index) => index / baseLoops);

  for (let addition = 0; addition < extraLoops; addition += 1) {
    let bestIndex = -1;
    let bestStart = start;
    let bestLength = -1;
    for (let index = 0; index < parameters.length - 1; index += 1) {
      const intervalStart = Math.max(start, parameters[index]);
      const intervalEnd = parameters[index + 1];
      const intervalLength = intervalEnd - intervalStart;
      if (intervalLength > bestLength) {
        bestIndex = index;
        bestStart = intervalStart;
        bestLength = intervalLength;
      }
    }
    if (bestIndex < 0 || bestLength <= 0.000001) break;
    parameters.splice(bestIndex + 1, 0, bestStart + bestLength * 0.5);
  }
  return parameters;
}

export function uniformCurveParameters(segmentCount, start = 0, end = 1) {
  return Array.from({ length: segmentCount + 1 }, (_, index) => lerp(start, end, index / segmentCount));
}

export function eightWayScreenDelta(deltaX, deltaY) {
  const x = Number(deltaX) || 0;
  const y = Number(deltaY) || 0;
  const distance = Math.hypot(x, y);
  if (distance <= 0.000001) return { x: 0, y: 0 };
  const step = Math.PI / 4;
  const angle = Math.round(Math.atan2(y, x) / step) * step;
  const snappedX = Math.cos(angle) * distance;
  const snappedY = Math.sin(angle) * distance;
  return {
    x: Math.abs(snappedX) < 0.000001 ? 0 : snappedX,
    y: Math.abs(snappedY) < 0.000001 ? 0 : snappedY
  };
}

export function symmetricClosedCurveParameters(
  segmentCount,
  symmetryAxisParameter = 0,
  requiredParameters = []
) {
  const count = Math.max(3, Math.round(segmentCount));
  const wrap = (value) => ((Number(value) % 1) + 1) % 1;
  const axis = wrap(symmetryAxisParameter);
  const parameters = Array.from({ length: count }, (_, index) => wrap(axis + index / count));
  requiredParameters.forEach((value) => {
    const parameter = wrap(value);
    parameters.push(parameter, wrap(axis * 2 - parameter));
  });
  return parameters
    .sort((a, b) => a - b)
    .filter((value, index, values) => (
      index === 0 || Math.abs(value - values[index - 1]) > 0.00001
    ));
}

export function curveRebuildParameters(pointCount, evenlySpaced = true, cumulativeLengths = []) {
  const count = Math.max(2, Math.floor(Number(pointCount) || 2));
  const uniform = Array.from({ length: count }, (_, index) => index / (count - 1));
  if (!evenlySpaced || cumulativeLengths.length < 2) return uniform;

  const lengths = cumulativeLengths.map(Number);
  const totalLength = lengths.at(-1);
  if (
    !Number.isFinite(totalLength)
    || totalLength <= 0
    || lengths.some((length, index) => !Number.isFinite(length) || (index > 0 && length < lengths[index - 1]))
  ) return uniform;

  const divisions = lengths.length - 1;
  return uniform.map((amount, pointIndex) => {
    if (pointIndex === 0 || pointIndex === count - 1) return amount;
    const targetLength = totalLength * amount;
    let upperIndex = 1;
    while (upperIndex < lengths.length - 1 && lengths[upperIndex] < targetLength) upperIndex += 1;
    const lowerIndex = upperIndex - 1;
    const span = Math.max(0.0000001, lengths[upperIndex] - lengths[lowerIndex]);
    const intervalAmount = (targetLength - lengths[lowerIndex]) / span;
    return (lowerIndex + intervalAmount) / divisions;
  });
}

function pointDistance(first, second) {
  return Math.hypot(
    Number(second.x) - Number(first.x),
    Number(second.y) - Number(first.y),
    Number(second.z) - Number(first.z)
  );
}

function interpolatePoint(first, second, amount) {
  return {
    x: lerp(Number(first.x), Number(second.x), amount),
    y: lerp(Number(first.y), Number(second.y), amount),
    z: lerp(Number(first.z), Number(second.z), amount)
  };
}

export function resamplePolylinePointData(points, pointCount) {
  const source = Array.isArray(points) ? points : [];
  const count = Math.max(2, Math.floor(Number(pointCount) || 2));
  if (!source.length) return Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 }));
  if (source.length === 1) {
    return Array.from({ length: count }, () => ({
      x: Number(source[0].x),
      y: Number(source[0].y),
      z: Number(source[0].z)
    }));
  }

  const cumulativeLengths = [0];
  for (let index = 1; index < source.length; index += 1) {
    cumulativeLengths.push(cumulativeLengths.at(-1) + pointDistance(source[index - 1], source[index]));
  }
  const totalLength = cumulativeLengths.at(-1);
  if (totalLength <= 0.0000001) {
    return Array.from({ length: count }, () => ({
      x: Number(source[0].x),
      y: Number(source[0].y),
      z: Number(source[0].z)
    }));
  }

  return Array.from({ length: count }, (_, outputIndex) => {
    const targetLength = totalLength * (outputIndex / (count - 1));
    let upperIndex = 1;
    while (upperIndex < cumulativeLengths.length - 1 && cumulativeLengths[upperIndex] < targetLength) {
      upperIndex += 1;
    }
    const lowerIndex = upperIndex - 1;
    const span = Math.max(0.0000001, cumulativeLengths[upperIndex] - cumulativeLengths[lowerIndex]);
    return interpolatePoint(
      source[lowerIndex],
      source[upperIndex],
      (targetLength - cumulativeLengths[lowerIndex]) / span
    );
  });
}

export function polylineMidpointPointData(points) {
  return resamplePolylinePointData(points, 3)[1];
}

export function blendRelativePolylinePointData(firstPoints, secondPoints, amount, pointCount = null) {
  const count = Math.max(
    2,
    Math.floor(Number(pointCount) || Math.max(firstPoints?.length || 0, secondPoints?.length || 0, 2))
  );
  const first = resamplePolylinePointData(firstPoints, count);
  const second = resamplePolylinePointData(secondPoints, count);
  const firstRoot = first[0];
  const secondRoot = second[0];
  const blend = clamp(Number(amount), 0, 1);
  return first.map((point, index) => ({
    x: lerp(point.x - firstRoot.x, second[index].x - secondRoot.x, blend),
    y: lerp(point.y - firstRoot.y, second[index].y - secondRoot.y, blend),
    z: lerp(point.z - firstRoot.z, second[index].z - secondRoot.z, blend)
  }));
}

function normalizedPointData(point, fallback = { x: 0, y: 0, z: 1 }) {
  const x = Number(point?.x);
  const y = Number(point?.y);
  const z = Number(point?.z);
  const length = Math.hypot(x, y, z);
  if (!Number.isFinite(length) || length <= 0.0000001) return { ...fallback };
  return { x: x / length, y: y / length, z: z / length };
}

export function blendDirectionPointData(first, second, amount) {
  const firstDirection = normalizedPointData(first);
  const secondDirection = normalizedPointData(second, firstDirection);
  const blend = clamp(Number(amount), 0, 1);
  return normalizedPointData({
    x: lerp(firstDirection.x, secondDirection.x, blend),
    y: lerp(firstDirection.y, secondDirection.y, blend),
    z: lerp(firstDirection.z, secondDirection.z, blend)
  }, firstDirection);
}

function rotatePointDataBetweenNormals(point, sourceNormal, targetNormal) {
  const from = normalizedPointData(sourceNormal);
  const to = normalizedPointData(targetNormal, from);
  const dot = clamp(from.x * to.x + from.y * to.y + from.z * to.z, -1, 1);
  if (dot > 0.999999) return { x: point.x, y: point.y, z: point.z };
  if (dot < -0.999999) {
    const axis = Math.abs(from.x) < 0.8
      ? normalizedPointData({ x: 0, y: from.z, z: -from.y })
      : normalizedPointData({ x: -from.z, y: 0, z: from.x });
    const projection = point.x * axis.x + point.y * axis.y + point.z * axis.z;
    return {
      x: 2 * projection * axis.x - point.x,
      y: 2 * projection * axis.y - point.y,
      z: 2 * projection * axis.z - point.z
    };
  }
  const cross = {
    x: from.y * to.z - from.z * to.y,
    y: from.z * to.x - from.x * to.z,
    z: from.x * to.y - from.y * to.x
  };
  const inverseLength = 1 / Math.hypot(cross.x, cross.y, cross.z, 1 + dot);
  const q = {
    x: cross.x * inverseLength,
    y: cross.y * inverseLength,
    z: cross.z * inverseLength,
    w: (1 + dot) * inverseLength
  };
  const t = {
    x: 2 * (q.y * point.z - q.z * point.y),
    y: 2 * (q.z * point.x - q.x * point.z),
    z: 2 * (q.x * point.y - q.y * point.x)
  };
  return {
    x: point.x + q.w * t.x + q.y * t.z - q.z * t.y,
    y: point.y + q.w * t.y + q.z * t.x - q.x * t.z,
    z: point.z + q.w * t.z + q.x * t.y - q.y * t.x
  };
}

function tangentDirectionPointData(point, normal) {
  const axis = normalizedPointData(normal);
  const projection = point.x * axis.x + point.y * axis.y + point.z * axis.z;
  const tangent = {
    x: point.x - axis.x * projection,
    y: point.y - axis.y * projection,
    z: point.z - axis.z * projection
  };
  const length = Math.hypot(tangent.x, tangent.y, tangent.z);
  return length <= 0.0000001
    ? null
    : { x: tangent.x / length, y: tangent.y / length, z: tangent.z / length };
}

function rotatePointDataAroundAxis(point, axis, angle) {
  const direction = normalizedPointData(axis);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const projection = point.x * direction.x + point.y * direction.y + point.z * direction.z;
  return {
    x: point.x * cosine
      + (direction.y * point.z - direction.z * point.y) * sine
      + direction.x * projection * (1 - cosine),
    y: point.y * cosine
      + (direction.z * point.x - direction.x * point.z) * sine
      + direction.y * projection * (1 - cosine),
    z: point.z * cosine
      + (direction.x * point.y - direction.y * point.x) * sine
      + direction.z * projection * (1 - cosine)
  };
}

export function blendSurfaceOrientedPolylinePointData(
  firstPoints,
  secondPoints,
  firstNormal,
  secondNormal,
  targetNormal,
  amount,
  pointCount = null
) {
  const count = Math.max(
    2,
    Math.floor(Number(pointCount) || Math.max(firstPoints?.length || 0, secondPoints?.length || 0, 2))
  );
  const first = resamplePolylinePointData(firstPoints, count);
  const second = resamplePolylinePointData(secondPoints, count);
  const firstRoot = first[0];
  const secondRoot = second[0];
  const blend = clamp(Number(amount), 0, 1);
  const targetAxis = normalizedPointData(targetNormal);
  const firstMidpoint = polylineMidpointPointData(first);
  const secondMidpoint = polylineMidpointPointData(second);
  const firstDirection = tangentDirectionPointData(rotatePointDataBetweenNormals({
    x: firstMidpoint.x - firstRoot.x,
    y: firstMidpoint.y - firstRoot.y,
    z: firstMidpoint.z - firstRoot.z
  }, firstNormal, targetNormal), targetAxis);
  const secondDirection = tangentDirectionPointData(rotatePointDataBetweenNormals({
    x: secondMidpoint.x - secondRoot.x,
    y: secondMidpoint.y - secondRoot.y,
    z: secondMidpoint.z - secondRoot.z
  }, secondNormal, targetNormal), targetAxis);
  let firstDirectionRotation = 0;
  let secondDirectionRotation = 0;
  if (firstDirection && secondDirection) {
    const cross = {
      x: firstDirection.y * secondDirection.z - firstDirection.z * secondDirection.y,
      y: firstDirection.z * secondDirection.x - firstDirection.x * secondDirection.z,
      z: firstDirection.x * secondDirection.y - firstDirection.y * secondDirection.x
    };
    const signedAngle = Math.atan2(
      cross.x * targetAxis.x + cross.y * targetAxis.y + cross.z * targetAxis.z,
      clamp(
        firstDirection.x * secondDirection.x
          + firstDirection.y * secondDirection.y
          + firstDirection.z * secondDirection.z,
        -1,
        1
      )
    );
    firstDirectionRotation = signedAngle * blend;
    secondDirectionRotation = -signedAngle * (1 - blend);
  }
  return first.map((point, index) => {
    const firstOffset = rotatePointDataAroundAxis(rotatePointDataBetweenNormals({
      x: point.x - firstRoot.x,
      y: point.y - firstRoot.y,
      z: point.z - firstRoot.z
    }, firstNormal, targetNormal), targetAxis, firstDirectionRotation);
    const secondOffset = rotatePointDataAroundAxis(rotatePointDataBetweenNormals({
      x: second[index].x - secondRoot.x,
      y: second[index].y - secondRoot.y,
      z: second[index].z - secondRoot.z
    }, secondNormal, targetNormal), targetAxis, secondDirectionRotation);
    return {
      x: lerp(firstOffset.x, secondOffset.x, blend),
      y: lerp(firstOffset.y, secondOffset.y, blend),
      z: lerp(firstOffset.z, secondOffset.z, blend)
    };
  });
}

export function proximityCurveBlendAmount(point, firstRoot, secondRoot) {
  const firstDistance = pointDistance(point, firstRoot);
  const secondDistance = pointDistance(point, secondRoot);
  const totalDistance = firstDistance + secondDistance;
  return totalDistance <= 0.0000001 ? 0.5 : firstDistance / totalDistance;
}

export function evenlySpacedInteriorAmounts(count, maximum = 64) {
  const total = Math.min(
    Math.max(1, Math.round(Number(maximum) || 64)),
    Math.max(0, Math.round(Number(count) || 0))
  );
  return Array.from({ length: total }, (_, index) => (index + 1) / (total + 1));
}

export function surfaceArcBlendAmount(point, firstRoot, secondRoot, center) {
  const origin = center || { x: 0, y: 0, z: 0 };
  const direction = (value) => normalizedPointData({
    x: Number(value?.x) - Number(origin.x || 0),
    y: Number(value?.y) - Number(origin.y || 0),
    z: Number(value?.z) - Number(origin.z || 0)
  });
  const targetDirection = direction(point);
  const firstDirection = direction(firstRoot);
  const secondDirection = direction(secondRoot);
  const angleToFirst = Math.acos(clamp(
    targetDirection.x * firstDirection.x
      + targetDirection.y * firstDirection.y
      + targetDirection.z * firstDirection.z,
    -1,
    1
  ));
  const angleToSecond = Math.acos(clamp(
    targetDirection.x * secondDirection.x
      + targetDirection.y * secondDirection.y
      + targetDirection.z * secondDirection.z,
    -1,
    1
  ));
  const totalAngle = angleToFirst + angleToSecond;
  return totalAngle <= 0.0000001
    ? proximityCurveBlendAmount(point, firstRoot, secondRoot)
    : angleToFirst / totalAngle;
}

export function surfaceArcPolylinePointData(
  firstRoot,
  secondRoot,
  center,
  segmentCount = 48,
  constantAxis = null
) {
  const origin = center || { x: 0, y: 0, z: 0 };
  const relative = (point) => ({
    x: Number(point?.x) - Number(origin.x || 0),
    y: Number(point?.y) - Number(origin.y || 0),
    z: Number(point?.z) - Number(origin.z || 0)
  });
  const firstRelative = relative(firstRoot);
  const secondRelative = relative(secondRoot);
  const firstRadius = Math.hypot(firstRelative.x, firstRelative.y, firstRelative.z);
  const secondRadius = Math.hypot(secondRelative.x, secondRelative.y, secondRelative.z);
  const firstDirection = normalizedPointData(firstRelative);
  const secondDirection = normalizedPointData(secondRelative, firstDirection);
  const dot = clamp(
    firstDirection.x * secondDirection.x
      + firstDirection.y * secondDirection.y
      + firstDirection.z * secondDirection.z,
    -1,
    1
  );
  const count = Math.max(1, Math.round(Number(segmentCount) || 48));
  let oppositeAxis = null;
  if (dot < -0.999999) {
    oppositeAxis = Math.abs(firstDirection.x) < 0.8
      ? normalizedPointData({ x: 0, y: firstDirection.z, z: -firstDirection.y })
      : normalizedPointData({ x: -firstDirection.z, y: 0, z: firstDirection.x });
  }
  const angle = Math.acos(dot);
  const sine = Math.sin(angle);
  return Array.from({ length: count + 1 }, (_, index) => {
    const amount = index / count;
    let direction;
    if (dot > 0.999999) {
      direction = normalizedPointData({
        x: lerp(firstDirection.x, secondDirection.x, amount),
        y: lerp(firstDirection.y, secondDirection.y, amount),
        z: lerp(firstDirection.z, secondDirection.z, amount)
      }, firstDirection);
    } else if (oppositeAxis) {
      direction = {
        x: firstDirection.x * Math.cos(Math.PI * amount) + oppositeAxis.x * Math.sin(Math.PI * amount),
        y: firstDirection.y * Math.cos(Math.PI * amount) + oppositeAxis.y * Math.sin(Math.PI * amount),
        z: firstDirection.z * Math.cos(Math.PI * amount) + oppositeAxis.z * Math.sin(Math.PI * amount)
      };
    } else {
      const firstWeight = Math.sin((1 - amount) * angle) / sine;
      const secondWeight = Math.sin(amount * angle) / sine;
      direction = {
        x: firstDirection.x * firstWeight + secondDirection.x * secondWeight,
        y: firstDirection.y * firstWeight + secondDirection.y * secondWeight,
        z: firstDirection.z * firstWeight + secondDirection.z * secondWeight
      };
    }
    const radius = lerp(firstRadius, secondRadius, amount);
    const arcPoint = {
      x: Number(origin.x || 0) + direction.x * radius,
      y: Number(origin.y || 0) + direction.y * radius,
      z: Number(origin.z || 0) + direction.z * radius
    };
    if (["x", "y", "z"].includes(constantAxis)) {
      arcPoint[constantAxis] = (
        (Number(firstRoot?.[constantAxis]) || 0)
        + (Number(secondRoot?.[constantAxis]) || 0)
      ) * 0.5;
    }
    return arcPoint;
  });
}

export function horizontalCircleThroughPointData(firstPoint, secondPoint, preferredCenter) {
  const firstX = Number(firstPoint?.x) || 0;
  const firstZ = Number(firstPoint?.z) || 0;
  const secondX = Number(secondPoint?.x) || 0;
  const secondZ = Number(secondPoint?.z) || 0;
  const midpointX = (firstX + secondX) * 0.5;
  const midpointZ = (firstZ + secondZ) * 0.5;
  const chordX = secondX - firstX;
  const chordZ = secondZ - firstZ;
  const chordLength = Math.hypot(chordX, chordZ);
  const preferredX = Number(preferredCenter?.x) || 0;
  const preferredZ = Number(preferredCenter?.z) || 0;
  let centerX = preferredX;
  let centerZ = preferredZ;
  if (chordLength > 0.000001) {
    const perpendicularX = -chordZ / chordLength;
    const perpendicularZ = chordX / chordLength;
    const offset = (preferredX - midpointX) * perpendicularX
      + (preferredZ - midpointZ) * perpendicularZ;
    centerX = midpointX + perpendicularX * offset;
    centerZ = midpointZ + perpendicularZ * offset;
  }
  const radius = Math.hypot(firstX - centerX, firstZ - centerZ);
  const firstAngle = Math.atan2(firstZ - centerZ, firstX - centerX);
  const secondAngle = Math.atan2(secondZ - centerZ, secondX - centerX);
  const angleDelta = Math.atan2(
    Math.sin(secondAngle - firstAngle),
    Math.cos(secondAngle - firstAngle)
  );
  return {
    center: {
      x: centerX,
      y: lerp(Number(firstPoint?.y) || 0, Number(secondPoint?.y) || 0, 0.5),
      z: centerZ
    },
    radius,
    startAngle: firstAngle,
    angleDelta,
    firstY: Number(firstPoint?.y) || 0,
    secondY: Number(secondPoint?.y) || 0
  };
}

export function horizontalCirclePointData(circle, amount) {
  const blend = clamp(Number(amount), 0, 1);
  const angle = Number(circle?.startAngle || 0) + Number(circle?.angleDelta || 0) * blend;
  const radius = Math.max(0, Number(circle?.radius) || 0);
  return {
    x: Number(circle?.center?.x || 0) + Math.cos(angle) * radius,
    y: lerp(Number(circle?.firstY) || 0, Number(circle?.secondY) || 0, blend),
    z: Number(circle?.center?.z || 0) + Math.sin(angle) * radius
  };
}

export function rootCorrectionFalloff(amount, blendEnd = 0) {
  const endValue = Number(blendEnd);
  const end = clamp(Number.isFinite(endValue) ? endValue : 0, 0, 1);
  const position = clamp(Number(amount), 0, 1);
  if (end <= 0.000001) return position <= 0.000001 ? 1 : 0;
  const t = clamp(position / end, 0, 1);
  return (Math.cos(Math.PI * t) + 1) * 0.5;
}

export function cylindricalArcPointData(firstPoint, secondPoint, center, amount) {
  return horizontalCirclePointData(
    horizontalCircleThroughPointData(firstPoint, secondPoint, center),
    amount
  );
}

function truncatePolylinePointDataAtY(points, limitY) {
  const source = Array.isArray(points) ? points : [];
  if (!source.length) return [];
  const result = [{
    x: Number(source[0]?.x) || 0,
    y: Number(source[0]?.y) || 0,
    z: Number(source[0]?.z) || 0
  }];
  const targetY = Number(limitY) || 0;
  for (let index = 1; index < source.length; index += 1) {
    const previous = source[index - 1];
    const current = source[index];
    const previousY = Number(previous?.y) || 0;
    const currentY = Number(current?.y) || 0;
    if (previousY >= targetY && currentY <= targetY) {
      const span = currentY - previousY;
      const amount = Math.abs(span) <= 0.000001
        ? 1
        : clamp((targetY - previousY) / span, 0, 1);
      result.push({
        x: lerp(Number(previous?.x) || 0, Number(current?.x) || 0, amount),
        y: targetY,
        z: lerp(Number(previous?.z) || 0, Number(current?.z) || 0, amount)
      });
      return result;
    }
    if (currentY > targetY) {
      result.push({
        x: Number(current?.x) || 0,
        y: currentY,
        z: Number(current?.z) || 0
      });
    }
  }
  const lowest = source.reduce((best, point) => (
    (Number(point?.y) || 0) < (Number(best?.y) || 0) ? point : best
  ), source[0]);
  result.push({
    x: Number(lowest?.x) || 0,
    y: Number(lowest?.y) || 0,
    z: Number(lowest?.z) || 0
  });
  return result;
}

export function lowestSharedHorizontalPolylinePointData(firstPoints, secondPoints) {
  const first = Array.isArray(firstPoints) ? firstPoints : [];
  const second = Array.isArray(secondPoints) ? secondPoints : [];
  if (!first.length || !second.length) return null;
  const minimumY = (points) => points.reduce(
    (minimum, point) => Math.min(minimum, Number(point?.y) || 0),
    Number.POSITIVE_INFINITY
  );
  const limitY = Math.max(minimumY(first), minimumY(second));
  const firstLimited = truncatePolylinePointDataAtY(first, limitY);
  const secondLimited = truncatePolylinePointDataAtY(second, limitY);
  return {
    limitY,
    first: firstLimited,
    second: secondLimited,
    intersections: [
      firstLimited[firstLimited.length - 1],
      secondLimited[secondLimited.length - 1]
    ]
  };
}

export function blendCylindricalPolylinePointData(
  firstPoints,
  secondPoints,
  center,
  amount,
  pointCount = null
) {
  const count = Math.max(
    2,
    Math.floor(Number(pointCount) || Math.max(firstPoints?.length || 0, secondPoints?.length || 0, 2))
  );
  const shared = lowestSharedHorizontalPolylinePointData(firstPoints, secondPoints);
  const first = resamplePolylinePointData(shared?.first || firstPoints, count);
  const second = resamplePolylinePointData(shared?.second || secondPoints, count);
  return first.map((point, index) => cylindricalArcPointData(
    point,
    second[index],
    center,
    amount
  ));
}

export function blendSampleArrays(firstValues, secondValues, amount, sampleCount = null, fallback = 0) {
  const count = Math.max(
    1,
    Math.floor(Number(sampleCount) || Math.max(firstValues?.length || 0, secondValues?.length || 0, 1))
  );
  const blend = clamp(Number(amount), 0, 1);
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    return lerp(
      Number(sampleArray(firstValues, t, fallback)),
      Number(sampleArray(secondValues, t, fallback)),
      blend
    );
  });
}

export function blendTaperCurves(firstCurve, secondCurve, amount) {
  const first = normalizeTaperCurve(firstCurve);
  const second = normalizeTaperCurve(secondCurve);
  const positions = [...new Set([
    ...first.map((point) => point.position),
    ...second.map((point) => point.position)
  ])].sort((left, right) => left - right);
  const blend = clamp(Number(amount), 0, 1);
  return positions.map((position) => ({
    position,
    value: lerp(sampleTaperCurve(first, position), sampleTaperCurve(second, position), blend),
    interpolation: blend < 0.5
      ? first.findLast((point) => point.position <= position)?.interpolation || "smooth"
      : second.findLast((point) => point.position <= position)?.interpolation || "smooth"
  }));
}

export function blendEnvelopeCurves(firstCurve, secondCurve, amount, fallback, valueMinimum, valueMaximum) {
  const first = normalizeEnvelopeCurve(firstCurve, fallback, valueMinimum, valueMaximum);
  const second = normalizeEnvelopeCurve(secondCurve, fallback, valueMinimum, valueMaximum);
  const positions = [...new Set([
    ...first.map((point) => point.position),
    ...second.map((point) => point.position)
  ])].sort((left, right) => left - right);
  const blend = clamp(Number(amount), 0, 1);
  return positions.map((position) => ({
    position,
    value: lerp(sampleTaperCurve(first, position), sampleTaperCurve(second, position), blend),
    interpolation: blend < 0.5
      ? first.findLast((point) => point.position <= position)?.interpolation || "smooth"
      : second.findLast((point) => point.position <= position)?.interpolation || "smooth"
  }));
}

export function curvePointRemovalPlan(pointCount, pointIndex, neighborRadius = 2) {
  const count = Math.max(0, Math.floor(Number(pointCount)));
  const index = Math.floor(Number(pointIndex));
  if (count <= 2 || index <= 0 || index >= count) return null;

  const parameters = Array.from(
    { length: count - 1 },
    (_, outputIndex) => (outputIndex < index ? outputIndex : outputIndex + 1) / (count - 1)
  );
  if (index === count - 1) {
    return { removedIndex: index, shortenedTip: true, parameters };
  }

  const radius = Math.max(1, Math.floor(Number(neighborRadius) || 2));
  const sourceStart = Math.max(0, index - radius);
  const sourceEnd = Math.min(count - 1, index + radius);
  const outputStart = sourceStart;
  const outputEnd = sourceEnd - 1;
  const outputSpan = Math.max(1, outputEnd - outputStart);
  for (let outputIndex = outputStart; outputIndex <= outputEnd; outputIndex += 1) {
    parameters[outputIndex] = lerp(
      sourceStart / (count - 1),
      sourceEnd / (count - 1),
      (outputIndex - outputStart) / outputSpan
    );
  }
  return { removedIndex: index, shortenedTip: false, parameters };
}

export function curvePointInsertionPlan(pointCount, parameter) {
  const count = Math.max(0, Math.floor(Number(pointCount)));
  const t = clamp(Number(parameter), 0.001, 0.999);
  if (count < 2 || !Number.isFinite(t)) return null;

  const segmentIndex = Math.min(count - 2, Math.floor(t * (count - 1)));
  const insertionIndex = segmentIndex + 1;
  const parameters = Array.from({ length: count }, (_, index) => index / (count - 1));
  parameters.splice(insertionIndex, 0, t);

  const previousIndex = insertionIndex - 1;
  if (previousIndex > 0) {
    parameters[previousIndex] = lerp(parameters[previousIndex - 1], t, 0.5);
  }
  const nextIndex = insertionIndex + 1;
  if (nextIndex < parameters.length - 1) {
    parameters[nextIndex] = lerp(t, parameters[nextIndex + 1], 0.5);
  }
  return { insertionIndex, parameter: t, parameters };
}

export function adaptiveCurveParameters(
  sampler,
  segmentLimit,
  aggression,
  start = 0,
  end = 1,
  minimumSegments = 4,
  profileSampler = null,
  symmetricDistribution = false,
  additionalDetailSampler = null
) {
  const maximum = Math.max(minimumSegments, Math.round(segmentLimit));
  const amount = clamp(Number(aggression ?? 0.5), 0, 1);
  if (
    (amount <= 0.001 || maximum <= minimumSegments)
    && !additionalDetailSampler
  ) return uniformCurveParameters(maximum, start, end);
  const probeCount = Math.max(48, maximum * 4);
  const interval = (end - start) / probeCount;
  const baseWeights = [];
  const additionalWeights = [];
  let baseDetailTotal = 0;
  let additionalDetailTotal = 0;
  const sampleProfile = (t) => {
    const value = Number(profileSampler?.(t));
    return Number.isFinite(value) ? value : 0;
  };
  for (let index = 0; index < probeCount; index += 1) {
    const beforeT = start + interval * index;
    const afterT = start + interval * (index + 1);
    const before = sampler.getTangent(beforeT).normalize();
    const after = sampler.getTangent(afterT).normalize();
    const angleRate = before.angleTo(after) / Math.max(0.0001, interval);
    const curvature = smoothstep(angleRate, 0.2, 3.2);
    let profileDetail = 0;
    if (profileSampler) {
      const middleT = (beforeT + afterT) * 0.5;
      const beforeProfile = sampleProfile(beforeT);
      const middleProfile = sampleProfile(middleT);
      const afterProfile = sampleProfile(afterT);
      const slope = Math.abs(afterProfile - beforeProfile) / Math.max(0.0001, interval);
      const bend = Math.abs(afterProfile - middleProfile * 2 + beforeProfile)
        / Math.max(0.0001, interval * interval);
      profileDetail = Math.max(
        smoothstep(slope, 0.25, 3),
        smoothstep(bend, 0.5, 12)
      );
    }
    const middleT = (beforeT + afterT) * 0.5;
    const additionalDetail = Math.max(
      0,
      Number(additionalDetailSampler?.(beforeT, middleT, afterT, interval)) || 0
    );
    baseDetailTotal += Math.max(curvature, profileDetail);
    additionalDetailTotal += additionalDetail;
    baseWeights.push(
      lerp(1, 0.1, amount)
      + curvature * (0.5 + amount * 4.5)
      + profileDetail * (0.4 + amount * 4)
    );
    additionalWeights.push(additionalDetail);
  }
  const averageDetail = baseDetailTotal / probeCount;
  const retainedRatio = lerp(1, 0.22 + Math.sqrt(averageDetail) * 0.5, amount);
  const baseSegmentCount = clamp(Math.round(maximum * retainedRatio), minimumSegments, maximum);
  const additionalSegmentCount = Math.max(0, Math.ceil(additionalDetailTotal - 0.000001));
  let distributionWeights = baseWeights;
  if (additionalSegmentCount > 0 && additionalDetailTotal > 0.000001) {
    const featherRadius = Math.max(3, Math.round(probeCount * 0.06));
    let featheredAdditionalWeights = additionalWeights.map((weight, index) => {
      let weightedTotal = 0;
      let kernelTotal = 0;
      for (let offset = -featherRadius; offset <= featherRadius; offset += 1) {
        const sampleIndex = index + offset;
        if (sampleIndex < 0 || sampleIndex >= additionalWeights.length) continue;
        const kernelWeight = featherRadius + 1 - Math.abs(offset);
        weightedTotal += additionalWeights[sampleIndex] * kernelWeight;
        kernelTotal += kernelWeight;
      }
      return weightedTotal / Math.max(1, kernelTotal);
    });
    const featheredTotal = featheredAdditionalWeights.reduce((total, weight) => total + weight, 0);
    const featherScale = additionalDetailTotal / Math.max(0.0001, featheredTotal);
    featheredAdditionalWeights = featheredAdditionalWeights.map((weight) => weight * featherScale);
    const symmetricBaseWeights = symmetricDistribution
      ? baseWeights.map((weight, index) => (
        (weight + baseWeights[baseWeights.length - 1 - index]) * 0.5
      ))
      : baseWeights;
    const baseWeightTotal = symmetricBaseWeights.reduce((total, weight) => total + weight, 0);
    distributionWeights = symmetricBaseWeights.map((weight, index) => (
      weight / Math.max(0.0001, baseWeightTotal) * baseSegmentCount
      + featheredAdditionalWeights[index]
    ));
  }
  const segmentCount = baseSegmentCount + additionalSegmentCount;
  const weightedParameter = (weights, fraction) => {
    const cumulative = [0];
    weights.forEach((weight) => cumulative.push(cumulative.at(-1) + weight));
    const target = cumulative.at(-1) * fraction;
    let probeIndex = 1;
    while (probeIndex < cumulative.length - 1 && cumulative[probeIndex] < target) probeIndex += 1;
    const beforeWeight = cumulative[probeIndex - 1];
    const span = Math.max(0.0001, cumulative[probeIndex] - beforeWeight);
    const alpha = (target - beforeWeight) / span;
    return lerp(start, end, (probeIndex - 1 + alpha) / probeCount);
  };
  const parameters = [
    start,
    ...Array.from(
      { length: Math.max(0, segmentCount - 1) },
      (_, index) => weightedParameter(distributionWeights, (index + 1) / segmentCount)
    ),
    end
  ];
  if (symmetricDistribution && additionalSegmentCount === 0) {
    const midpoint = (start + end) * 0.5;
    for (let index = 1; index < Math.floor(parameters.length / 2); index += 1) {
      const oppositeIndex = parameters.length - 1 - index;
      const pairedDistance = (
        (parameters[index] - start)
        + (end - parameters[oppositeIndex])
      ) * 0.5;
      parameters[index] = start + pairedDistance;
      parameters[oppositeIndex] = end - pairedDistance;
    }
    if (parameters.length % 2 === 1) parameters[Math.floor(parameters.length / 2)] = midpoint;
  }
  return parameters;
}

export function twistCurveDensityDetail(
  curve,
  beforeT,
  middleT,
  afterT,
  strength = 1,
  referenceSegmentCount = 1
) {
  const influence = clamp(Number(strength) || 0, 0, 1);
  if (influence <= 0.0001 || !curve?.length) return 0;
  const before = sampleTaperCurve(curve, beforeT);
  const middle = sampleTaperCurve(curve, middleT);
  const after = sampleTaperCurve(curve, afterT);
  const span = Math.max(0, Number(afterT) - Number(beforeT));
  const averageMagnitude = (
    Math.abs(before)
    + Math.abs(middle) * 4
    + Math.abs(after)
  ) / 6;
  const referenceDensity = Math.max(1, Number(referenceSegmentCount) || 1);
  const normalizedMagnitude = averageMagnitude / 180;
  const softenedMagnitude = normalizedMagnitude <= 1
    ? Math.sqrt(normalizedMagnitude)
    : normalizedMagnitude;
  const supplementalDensityRatio = softenedMagnitude * 2;
  return influence * supplementalDensityRatio * referenceDensity * span;
}

export function twistCurveDisplayRange(curve, defaultRange = 180, maximumRange = 720) {
  const baseline = Math.max(1, Math.abs(Number(defaultRange) || 180));
  const maximum = Math.max(baseline, Math.abs(Number(maximumRange) || 720));
  const authoredMaximum = Array.isArray(curve)
    ? curve.reduce((largest, point) => Math.max(largest, Math.abs(Number(point?.value) || 0)), 0)
    : 0;
  return clamp(Math.max(baseline, authoredMaximum), baseline, maximum);
}

export function twistCurveHandleDistancePerDegree(referenceExtent, displayRange = 180) {
  const extent = Math.max(0.04, Math.abs(Number(referenceExtent) || 0));
  const range = Math.max(1, Math.abs(Number(displayRange) || 180));
  return extent * 0.625 / range;
}

export function sampleArray(values, t, fallback = 0) {
  if (!values?.length) return fallback;
  if (values.length === 1) return values[0];
  const scaled = clamp(t, 0, 1) * (values.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(values.length - 1, index + 1);
  return lerp(values[index], values[next], scaled - index);
}

export function sampleScale(scales, t, axis) {
  if (!scales?.length) return 1;
  if (scales.length === 1) return scales[0][axis] || 1;
  const scaled = clamp(t, 0, 1) * (scales.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(scales.length - 1, index + 1);
  return lerp(scales[index][axis] || 1, scales[next][axis] || 1, scaled - index);
}

export function upperProfileArcIndices(points) {
  if (!points?.length) return [];
  if (points.length === 1) return [0];

  let leftIndex = 0;
  let rightIndex = 0;
  points.forEach((point, index) => {
    const x = Number(point.x);
    const height = Number(point.z ?? point.y ?? 0);
    const leftX = Number(points[leftIndex].x);
    const leftHeight = Number(points[leftIndex].z ?? points[leftIndex].y ?? 0);
    const rightX = Number(points[rightIndex].x);
    const rightHeight = Number(points[rightIndex].z ?? points[rightIndex].y ?? 0);
    if (x < leftX || (x === leftX && height < leftHeight)) leftIndex = index;
    if (x > rightX || (x === rightX && height < rightHeight)) rightIndex = index;
  });
  if (leftIndex === rightIndex) return points.map((_, index) => index);

  const cyclicPath = (start, end, step) => {
    const indices = [start];
    let index = start;
    while (index !== end && indices.length <= points.length) {
      index = (index + step + points.length) % points.length;
      indices.push(index);
    }
    return indices;
  };
  const forward = cyclicPath(rightIndex, leftIndex, 1);
  const backward = cyclicPath(rightIndex, leftIndex, -1);
  const averageHeight = (indices) => indices.reduce(
    (total, index) => total + Number(points[index].z ?? points[index].y ?? 0),
    0
  ) / indices.length;
  return averageHeight(forward) >= averageHeight(backward) ? forward : backward;
}

// 局部曲率半径 ρ 取相邻三点外接圆半径；折角处 ρ/r 小 → 环按曲率收窄。
// 收窄系数沿脊柱扩散，避免急弯过渡硬跳变/缺口。
export function sweepCurvatureResponse(centers, radii, options = {}) {
  const strength = clamp(Number(options.strength ?? 1), 0, 1);
  const safety = Number(options.safety ?? 0.6);
  const minScale = Number(options.minScale ?? 0.05);
  const falloff = Number(options.falloff ?? 0);
  const count = centers.length;
  const factors = new Array(count).fill(1);
  const heat = new Array(count).fill(0);
  if (count < 3) return { factors, heat };
  for (let i = 1; i < count - 1; i += 1) {
    const r = Number(radii?.[i]) || 0;
    const p0 = centers[i - 1];
    const p1 = centers[i];
    const p2 = centers[i + 1];
    const abx = p1.x - p0.x;
    const aby = p1.y - p0.y;
    const abz = p1.z - p0.z;
    const acx = p2.x - p0.x;
    const acy = p2.y - p0.y;
    const acz = p2.z - p0.z;
    const crossMagnitude = Math.hypot(
      aby * acz - abz * acy,
      abz * acx - abx * acz,
      abx * acy - aby * acx
    );
    const rho = crossMagnitude < 1e-12
      ? Infinity
      : (
        Math.hypot(abx, aby, abz)
        * Math.hypot(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
        * Math.hypot(acx, acy, acz)
      ) / (2 * crossMagnitude);
    const ratio = r > 0 ? safety * rho / r : Infinity;
    heat[i] = clamp(1 - ratio, 0, 1);
    factors[i] = r <= 1e-6
      ? 1
      : Math.max(minScale, 1 - (1 - Math.min(1, ratio)) * strength);
  }
  if (falloff >= 1 && count >= 3) {
    const window = Math.min(Math.floor(falloff), count - 1);
    const blurredFactors = new Array(count);
    const blurredHeat = new Array(count);
    for (let i = 0; i < count; i += 1) {
      const start = Math.max(0, i - window);
      const end = Math.min(count - 1, i + window);
      let weightSum = 0;
      let factorSum = 0;
      let heatSum = 0;
      for (let j = start; j <= end; j += 1) {
        const weight = 1 - Math.abs(i - j) / (window + 1);
        weightSum += weight;
        factorSum += factors[j] * weight;
        heatSum += heat[j] * weight;
      }
      blurredFactors[i] = factorSum / weightSum;
      blurredHeat[i] = heatSum / weightSum;
    }
    blurredFactors[0] = 1;
    blurredFactors[count - 1] = 1;
    blurredHeat[0] = 0;
    blurredHeat[count - 1] = 0;
    return { factors: blurredFactors, heat: blurredHeat };
  }
  return { factors, heat };
}

// 沿行链（纵向）的 Jacobi 平滑：先算目标再统一应用，pinRows 锚点不动。
export function smoothSweepChains(vertices, rowCount, columnCount, options = {}) {
  const strength = clamp(Number(options.strength ?? 1), 0, 1);
  const iterations = Math.max(0, Math.floor(Number(options.iterations) || 0));
  const weights = options.weights ?? null;
  const pinRows = options.pinRows ?? null;
  const rowCountValue = Math.max(0, Math.floor(Number(rowCount) || 0));
  const columnCountValue = Math.max(0, Math.floor(Number(columnCount) || 0));
  if (!vertices?.length || rowCountValue < 2 || columnCountValue < 1 || strength <= 0 || iterations < 1) {
    return vertices;
  }
  const weightAt = (row, column) => {
    const weight = weights?.[row * columnCountValue + column];
    return weight === undefined ? 1 : clamp(Number(weight), 0, 1);
  };
  for (let iter = 0; iter < iterations; iter += 1) {
    const targets = new Array(vertices.length);
    for (let column = 0; column < columnCountValue; column += 1) {
      for (let row = 0; row < rowCountValue; row += 1) {
        if (pinRows?.has(row)) continue;
        const effective = strength * weightAt(row, column);
        if (effective <= 0) continue;
        const base = (row * columnCountValue + column) * 3;
        let ax = 0;
        let ay = 0;
        let az = 0;
        let neighborCount = 0;
        if (row > 0) {
          const index = ((row - 1) * columnCountValue + column) * 3;
          ax += vertices[index];
          ay += vertices[index + 1];
          az += vertices[index + 2];
          neighborCount += 1;
        }
        if (row < rowCountValue - 1) {
          const index = ((row + 1) * columnCountValue + column) * 3;
          ax += vertices[index];
          ay += vertices[index + 1];
          az += vertices[index + 2];
          neighborCount += 1;
        }
        if (neighborCount === 0) continue;
        const ox = vertices[base];
        const oy = vertices[base + 1];
        const oz = vertices[base + 2];
        targets[base] = ox + (ax / neighborCount - ox) * effective;
        targets[base + 1] = oy + (ay / neighborCount - oy) * effective;
        targets[base + 2] = oz + (az / neighborCount - oz) * effective;
      }
    }
    for (let i = 0; i < targets.length; i += 1) {
      const value = targets[i];
      if (value !== undefined) vertices[i] = value;
    }
  }
  return vertices;
}
// 切线按曲率后处理平滑，弯折处环朝向渐变，脊柱不动。
export function smoothSweepFrames(frames, heat, options = {}) {
  const strength = clamp(Number(options.strength ?? 0.5), 0, 1);
  const iterations = Math.max(0, Math.floor(Number(options.iterations) || 0));
  const pinRows = options.pinRows ?? null;
  const count = Array.isArray(frames) ? frames.length : 0;
  if (count < 3 || strength <= 0 || iterations < 1) return frames;
  const vectorAt = (row, axis) => {
    const value = frames[row]?.[axis];
    return value ? { x: Number(value.x), y: Number(value.y), z: Number(value.z) } : null;
  };
  const writeBack = (frame, axis, value) => {
    const target = frame?.[axis];
    if (!target) return;
    if (typeof target.set === "function") target.set(value.x, value.y, value.z);
    else {
      target.x = value.x;
      target.y = value.y;
      target.z = value.z;
    }
  };
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
  const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  const scale = (a, factor) => ({ x: a.x * factor, y: a.y * factor, z: a.z * factor });
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const cross = (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  });
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const tangents = new Array(count);
    for (let i = 1; i < count - 1; i += 1) {
      if (pinRows?.has(i)) continue;
      const heatValue = Number(heat?.[i]) || 0;
      if (heatValue <= 0) continue;
      const before = vectorAt(i - 1, "y");
      const current = vectorAt(i, "y");
      const after = vectorAt(i + 1, "y");
      if (!before || !current || !after) continue;
      const target = add(current, scale(subtract(scale(add(before, after), 0.5), current), strength * heatValue));
      const length = Math.hypot(target.x, target.y, target.z);
      if (length < 1e-12) continue;
      tangents[i] = { x: target.x / length, y: target.y / length, z: target.z / length };
    }
    for (let i = 0; i < count; i += 1) {
      const tangent = tangents[i];
      if (!tangent) continue;
      const frame = frames[i];
      const z = vectorAt(i, "z");
      if (!z) continue;
      const projectedZ = {
        x: z.x - dot(z, tangent) * tangent.x,
        y: z.y - dot(z, tangent) * tangent.y,
        z: z.z - dot(z, tangent) * tangent.z
      };
      const zLength = Math.hypot(projectedZ.x, projectedZ.y, projectedZ.z);
      const zTarget = zLength < 1e-8
        ? z
        : { x: projectedZ.x / zLength, y: projectedZ.y / zLength, z: projectedZ.z / zLength };
      writeBack(frame, "y", tangent);
      writeBack(frame, "z", zTarget);
      writeBack(frame, "x", cross(tangent, zTarget));
    }
  }
  return frames;
}

