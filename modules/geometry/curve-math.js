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

// Scalp Conform 的参数默认值 —— **本文件是唯一定义点**，app.js 的 panelCreationDefaults
// 与 index.html 的 value= 都必须与此同值（不同源会让"没动过滑杆"的面板与默认几何不一致，
// 这类三处漂移在本仓库有先例）。
// amount 0 = 不弯（输出与引入前逐位相同）、1 = 完整卷到头皮半径的圆柱上；
// gap = 弯曲半径相对头皮半径的外扩量（世界单位），既防 z-fighting 又让用户微调贴合松紧。
// **0.2.138 删掉了 range 与 cylinder**：Bend 模型下前者无意义（曲率插值本身处处光滑，
// 不需要"根部释放带"），后者被竖直弯曲轴取代（竖直轴天然让长发直垂、不朝下巴底下卷）。
export const PANEL_SCALP_CONFORM_DEFAULTS = Object.freeze({
  amount: 0,
  gap: 0.02
});


// ── 面板「贴合头皮」Scalp Conform：绕竖直轴的 Bend 变形（**保弧长**）─────────────
//
// 0.2.138 **第三次**重写该模型。前两版都被用户驳回，原因值得留档：
//   0.2.134/135「沿面板法线的球冠 + 两侧后移」：位移是沿 frame.z 的**局部标量**，
//     不知道头皮在世界空间哪里 ⇒ 边缘落点与头皮无关、还会拱起。
//   0.2.136/137「朝头部代理表面收缩」（逐顶点找最近表面点）：那是**投影**，
//     投影**不保弧长** —— 实测 width=5 的面板横向跨度被压 5.0 → 2.4（ratio 0.52），
//     用户原话「我们现在的实现是不保持长度的, 坍缩有点严重」。
//
// **本版模型（用户指定）**：「大概按照头的中心那里有个竖着的 tube 把平面的 panel 卷成
// 圆柱的轨迹, 不是直接 ray 投射而是弯曲变形, 类似 bend, 这个是保持长度的」。
// 即绕**通过头心的竖直轴**、把面板沿宽度方向卷到半径 R 的圆柱上：
//   θ = k·s,  k = amount / R      （s = 沿宽度方向的弧长坐标，中线处 s = 0）
//   P(s) = base + (sin θ / k)·T − ((1 − cos θ)/k)·N
// T = 面板宽度方向单位向量，N = 由竖直轴指向 base 的**水平**径向（弯曲朝头心一侧）。
//
// 三条由构造保证的性质（都有测试钉住）：
// ① **保弧长**：|dP/ds| ≡ 1（下方推导），所以 width 不会被压缩 —— 这正是上一版的病根。
// ② **k → 0 精确退化为平板**：sin(ks)/k → s、(1−cos ks)/k → 0，所以 amount=0 时逐位守恒。
// ③ **插值的是曲率而非位置**：amount=0.5 就是"半径加倍的圆柱"，**中间态本身仍是光滑
//    曲面** ⇒ 0.2.137 那种"部分贴合导致中段鼓包"的问题在本模型里不存在，因此
//    `range`（Root Release）与 `cylinder`（Capsule Length）两个参数被**删除**。
//
// **row 0 会移动**：发根贴在头皮上，卷起来时根部跟着沿头皮滑 —— 几何上这是对的。
// **但由此带来一个已知未解项（0.2.138 实测，勿据旧注释以为安全）**：uv-unfold 的 U 由 row 0
// 的**逐段弦长累加**得出，而弯曲后弦长和≠原弧长（离散折线内接于圆弧，且 camber 偏移会按
// (1+n·k) 放大）。真实工程实测 row-0 跨度比值 **1.046** —— 即 U 尺度变了 4.6%，不是 1.000。
// 我曾在此断言"保弧长正好给出 UV 不变"，那是**错的**：连续意义上保弧长 ≠ 离散弦长和不变。
// 可行的解法是给 uv-unfold 传**未弯曲**的 row-0 周长作 referenceCircumference（该参数已存在
// 于 gridUvTable 签名里），把"几何动"与"UV 变"解耦；尚未实现，需先与用户确认观感取舍。
// 单一定义点：本函数是弯曲公式的唯一实现，几何与控制器都必须经它取位移。

// Bend 的两个系数：把「沿宽度方向的弧长坐标 s」变成「沿 T 走多少 + 朝 N 收多少」。
//   along  = sin(k·s) / k   （k → 0 时 → s）
//   inward = (1 − cos(k·s)) / k   （k → 0 时 → 0）
// 调用方：`P = base + along·T − inward·N`。返回系数而不是直接返回点，是为了让几何层与
// 控制器层共用同一个公式却各自用自己的 T/N（纯函数、可在无场景图的 node 测试里验证）。
//
// **保弧长的推导**（这是本模型存在的理由，必须能复核）：
//   dP/ds = cos(k·s)·T − sin(k·s)·N，而 T ⟂ N 且都是单位向量
//   ⇒ |dP/ds|² = cos² + sin² = 1  ⇒ 弧长按 s 逐一对应，不被压缩。
//
// `k` 极小时走**解析退化分支**而不是硬算：`sin(k·s)/k` 在 k→0 时是 0/0，浮点上会先
// 损失精度再放大。阈值 1e-9 远小于任何真实曲率（R=1、amount=1e-6 时 k=1e-6），
// 所以正常参数永远走主分支；该分支只为「amount 恰好为 0」与极端小值兜底，
// 且**必须逐位返回 s / 0**，否则 amount=0 的逐位守恒契约会破。
export function panelBendCoefficients(s, curvature) {
  const arc = Number(s) || 0;
  const k = Number(curvature) || 0;
  if (Math.abs(k) < 1e-9) return { along: arc, inward: 0 };
  const theta = k * arc;
  return {
    along: Math.sin(theta) / k,
    inward: (1 - Math.cos(theta)) / k
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

