// tip-sub-bone.js - strand-agnostic tip sub-bone chain/frame/weight primitives (Route 1).
// Pure helpers shared by panel and regular-strand tip sub-bones (single-tip sub-bone);
// no app state or lock access, only three. Regular strands use a t-only weight ramp
// (tipStart -> 1) and the tip chain follows the strand's own center line as rest.
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;

// 绿色 Tip Clump 手柄沿尖端切线方向的外推距离（世界单位）：让手柄落在 trim/curve 适配后的
// 最尖端稍前方，避免与粉色/黄色发尖子骨骼手柄重合而难以拖拽。
// **唯一定义点**（0.2.130 起）：此前只是 bone-view-handles.js 的一个模块局部常量，够用是
// 因为 panel 的拖拽扫描刻意**不**含这个偏移（扫描基线在 panelSplitControlPoint 上）。发丝把
// 偏移烘进了共享的 tipClumpAxis（绘制与扫描同一条线段，见 strand-tip-width.js），于是
// 常量被两个模块消费 —— 放到几何原语层，两边都 import，不留第二份字面量。
export const TIP_CLUMP_HANDLE_TANGENT_OFFSET = 0.08;

function isValidTip(tip) {
  return Boolean(tip) && Array.isArray(tip.points) && tip.points.length >= 2;
}

function pointToData(p) {
  return { x: Number(p?.x ?? 0), y: Number(p?.y ?? 0), z: Number(p?.z ?? 0) };
}

function toVector3(p) {
  return new THREE.Vector3(Number(p?.x ?? 0), Number(p?.y ?? 0), Number(p?.z ?? 0));
}

// Deep clone a tip chain { points, restPoints, twists, active } with numeric values.
// Invalid tips (no points array of length >= 2) return null.
export function cloneTipChain(tip) {
  if (!isValidTip(tip)) return null;
  return {
    points: tip.points.map(pointToData),
    restPoints: Array.isArray(tip.restPoints) ? tip.restPoints.map(pointToData) : null,
    twists: Array.isArray(tip.twists) ? tip.twists.map((v) => Number(v) || 0) : null,
    active: tip.active !== false
  };
}

// Materialize a tip chain from an authored tip (optional) over a derived rest chain:
// restPoints come from restPointAt(t) at count evenly spaced params; when the authored
// tip carries matching points/restPoints, its per-point delta is re-applied on the new
// rest chain (rest may have changed); otherwise points equal the rest chain.
export function materializeTipChain(authored, restPointAt, count) {
  const n = Math.max(2, Math.floor(Number(count) || 0));
  const restPoints = Array.from({ length: n }, (_, i) => pointToData(restPointAt(i / Math.max(1, n - 1))));
  const authoredValid = Boolean(authored)
    && Array.isArray(authored.points)
    && Array.isArray(authored.restPoints)
    && authored.points.length === n
    && authored.restPoints.length === n;
  const points = authoredValid
    ? restPoints.map((rest, i) => {
      const a = authored.points[i];
      const r = authored.restPoints[i];
      const delta = new THREE.Vector3(a.x - r.x, a.y - r.y, a.z - r.z);
      return pointToData(new THREE.Vector3(rest.x, rest.y, rest.z).add(delta));
    })
    : restPoints.map((p) => ({ ...p }));
  const twists = Array.isArray(authored?.twists)
    ? restPoints.map((_, i) => Number(authored.twists[i]) || 0)
    : restPoints.map(() => 0);
  const active = authored?.active !== false;
  return { restPoints, points, twists, active };
}

// Local frame of a tip chain at t: y = authored chain tangent, z = reference normal
// rotated by the rest->authored bend (Gram-Schmidt against y, fallback to the raw
// reference normal), x = lateral (binormal). Mirrors panel tipChainFrameAt.
export function tipChainFrameAt(restTip, tip, t, referenceFrame) {
  const tc = clamp(t, 0, 1);
  // Chain points may be plain {x,y,z} (materializeTipChain) or THREE.Vector3; the
  // CatmullRomCurve3 needs real Vector3 points, so normalize them here.
  const curve = new THREE.CatmullRomCurve3(tip.points.map(toVector3));
  const restCurve = new THREE.CatmullRomCurve3(restTip.restPoints.map(toVector3));
  const authoredTangent = curve.getTangent(tc).normalize();
  const restTangent = restCurve.getTangent(tc).normalize();
  const dq = restTangent.dot(authoredTangent) < -0.9999
    ? new THREE.Quaternion().setFromAxisAngle(
      Math.abs(restTangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0),
      Math.PI
    )
    : new THREE.Quaternion().setFromUnitVectors(restTangent, authoredTangent);
  const y = authoredTangent;
  const z = referenceFrame.clone().applyQuaternion(dq);
  z.addScaledVector(y, -z.dot(y));
  if (z.lengthSq() < 1e-8) z.copy(referenceFrame);
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return { x, y, z };
}

// 「发尖链第一个暴露点」的**唯一定义点**（standards「一条推导规则只准有一个定义点」）。
// floor 而非 round/ceil：fork 那一行本身属于暴露子链（0.2.119 结论，比旧的严格 t > forkT
// 多一行），round 在 frac>0.5 时会让骨骼根落到自己第一个暴露子节点之上（6 个常见 zipper
// 高度里 4 个会错）。下限钳到 1：index 0 是链根、钉在主链上，永远不能变成可编辑子骨骼点；
// 上限钳到 count-1 保证 fork≥1（本侧完全锁死）时不越界，此时暴露区只剩末点。
// 本函数替代了此前散在四处的同一表达式（视口把手 / 引导线 / gizmo translate / 笔刷），
// 消费方清单（改这里必须回看全部）：
//   - modules/bones/bone-view-handles.js  发尖链把手可见性 + 引导线切片
//   - modules/bones/bone-interaction.js   gizmo translate 求解根 + 笔刷影响区间
//   - modules/io/usda-export.js           splitChainLayout / splitParentMainIndex（同规则，
//     那边按导出结构自行实现，行号见 development-standards 0.2.119 行；数值必须一致）
export function firstExposedTipChainIndex(forkT, pointCount) {
  const last = Math.max(1, Math.floor(Number(pointCount) || 0) - 1);
  return Math.min(last, Math.max(1, Math.floor(Number(forkT) * last)));
}

// t-only geometry blend: 0 before tipStart, ramping linearly to 1 at the strand end.
// This is intentionally separate from capture ownership: the render mesh may blend
// through the fork while the exported skin binding is already fully owned by the tip.
export function tipWeightAt(t, tipStart) {
  return clamp((Number(t) - Number(tipStart)) / Math.max(0.0001, 1 - Number(tipStart)), 0, 1);
}

// Tip capture ownership: fork-adjacent vertices stay on the main chain, while every
// exposed vertex is fully owned by its tip/split child chain. Keep the strict boundary
// convention aligned with splitChainLayout (t > fork).
export function tipCaptureWeightAt(t, tipStart) {
  return Number(t) > Number(tipStart) + 0.000001 ? 1 : 0;
}

// Arithmetic centers of swept tube rings. The geometry layer uses these exact centers
// as split-tip rest positions, so control chains follow the tube they actually drive
// rather than an approximate offset from the unsplit main curve.
export function sweepRingCentroids(vertices, sections, rowCount) {
  if (!Array.isArray(vertices) || !Array.isArray(sections) || rowCount < 1) return [];
  return sections.map((section) => {
    const base = Math.max(0, Math.floor(Number(section?.base) || 0));
    const ringSize = Math.max(0, Math.floor(Number(section?.ringSize) || 0));
    if (!ringSize) return [];
    return Array.from({ length: rowCount }, (_, row) => {
      const center = new THREE.Vector3();
      for (let column = 0; column < ringSize; column += 1) {
        const offset = (base + row * ringSize + column) * 3;
        center.x += Number(vertices[offset] || 0);
        center.y += Number(vertices[offset + 1] || 0);
        center.z += Number(vertices[offset + 2] || 0);
      }
      return pointToData(center.multiplyScalar(1 / ringSize));
    });
  });
}

// Sample a centerline authored at arbitrary sweep parameters. The split sweep can use
// adaptive curve parameters, so index-based sampling would drift controls off the mesh.
export function sampleCenterlinePoint(points, parameters, t) {
  if (!Array.isArray(points) || !points.length) return null;
  if (points.length === 1 || !Array.isArray(parameters) || parameters.length !== points.length) {
    return pointToData(points[0]);
  }
  const parameter = clamp(Number(t), 0, 1);
  if (parameter <= Number(parameters[0])) return pointToData(points[0]);
  const last = points.length - 1;
  if (parameter >= Number(parameters[last])) return pointToData(points[last]);
  for (let index = 1; index < points.length; index += 1) {
    const upper = Number(parameters[index]);
    if (parameter > upper) continue;
    const lower = Number(parameters[index - 1]);
    const alpha = clamp((parameter - lower) / Math.max(0.000001, upper - lower), 0, 1);
    return pointToData(toVector3(points[index - 1]).lerp(toVector3(points[index]), alpha));
  }
  return pointToData(points[last]);
}

// Sample the tip chain at t (clamped); returns the first point when the chain is too
// short to form a curve, null when there is no point at all.
export function sampleTipPosition(tip, t) {
  if (!tip || !Array.isArray(tip.points)) return null;
  if (tip.points.length < 2) {
    const p = tip.points[0];
    return p ? pointToData(p) : null;
  }
  return pointToData(new THREE.CatmullRomCurve3(tip.points.map(toVector3)).getPoint(clamp(t, 0, 1)));
}

// Mirror a tip chain across the X axis (x negated, twists negated); invalid -> null.
export function mirrorTipChain(tip) {
  const cloned = cloneTipChain(tip);
  if (!cloned) return null;
  return {
    ...cloned,
    points: cloned.points.map((p) => ({ ...p, x: -p.x })),
    restPoints: cloned.restPoints ? cloned.restPoints.map((p) => ({ ...p, x: -p.x })) : null,
    twists: cloned.twists ? cloned.twists.map((v) => -v) : null
  };
}
