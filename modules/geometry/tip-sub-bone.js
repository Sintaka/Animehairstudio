// tip-sub-bone.js - strand-agnostic tip sub-bone chain/frame/weight primitives (Route 1).
// Pure helpers shared by panel and regular-strand tip sub-bones (single-tip sub-bone);
// no app state or lock access, only three. Regular strands use a t-only weight ramp
// (tipStart -> 1) and the tip chain follows the strand's own center line as rest.
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;

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

// t-only tip weight: 0 before tipStart, ramping linearly to 1 at the strand end.
export function tipWeightAt(t, tipStart) {
  return clamp((Number(t) - Number(tipStart)) / Math.max(0.0001, 1 - Number(tipStart)), 0, 1);
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