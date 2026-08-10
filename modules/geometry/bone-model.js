// bone-model.js — KineFX-style unified bone view + split sub-bone data model (0.2.59).
// Bones are ordinary named points: { name, parent, parentParam, p, orient }. No matrices:
// only P (position) + rotation (quaternion). Hybrid persistence: only split sub-bones
// (lock.splitBones) are persisted; the main chain (lock.points) and child chains
// (branchParentId / child points) stay in their existing fields and are derived here.
import * as THREE from "three";

const MAX_SPLIT_SEGMENTS = 24;
const SPREAD_MAX = 0.9;

export function defaultSplitSpread(lock) {
  // Relative per-segment tip gap fraction; derived from the legacy absolute gap so old
  // files keep a comparable look, clamped so geometry never inverts (no crossover).
  return THREE.MathUtils.clamp(Number(lock?.panelSplitGap ?? 0.07) * 2, 0, SPREAD_MAX);
}

export function normalizeSplitBones(value, splits, lock) {
  const count = THREE.MathUtils.clamp(
    Math.max(1, (Array.isArray(splits) ? splits.length : 0) + 1),
    1,
    MAX_SPLIT_SEGMENTS
  );
  const fallbackSpread = defaultSplitSpread(lock);
  const bones = [];
  for (let k = 0; k < count; k += 1) {
    const src = Array.isArray(value) ? value[k] : null;
    const srcCurve = (key) => (Array.isArray(src?.[key]) ? src[key].map((p) => ({ ...p })) : null);
    bones.push({
      name: src?.name || `split.${k}`,
      parent: src?.parent || "main",
      parentParam: THREE.MathUtils.clamp(Number(src?.parentParam ?? 0.5), 0, 1),
      p: src?.p ? { x: Number(src.p.x), y: Number(src.p.y), z: Number(src.p.z) } : null,
      orient: src?.orient ? {
        x: Number(src.orient.x),
        y: Number(src.orient.y),
        z: Number(src.orient.z),
        w: Number(src.orient.w ?? 1)
      } : null,
      spread: THREE.MathUtils.clamp(Number(src?.spread ?? fallbackSpread), 0, SPREAD_MAX),
      taperCurve: srcCurve("taperCurve"),
      taperCurveSecondary: srcCurve("taperCurveSecondary"),
      depthCurve: srcCurve("depthCurve"),
      depthCurveSecondary: srcCurve("depthCurveSecondary"),
      asymmetricWidthCurve: src?.asymmetricWidthCurve == null ? null : Boolean(src.asymmetricWidthCurve),
      asymmetricDepthCurve: src?.asymmetricDepthCurve == null ? null : Boolean(src.asymmetricDepthCurve)
    });
  }
  return bones;
}

export function cloneSplitBones(value, splits, lock) {
  return normalizeSplitBones(value, splits, lock).map((bone) => ({ ...bone }));
}

// Effective split bones for a lock: persisted if valid (array length == segments),
// otherwise derived defaults (not written back).
export function splitBonesFor(lock) {
  const splits = Array.isArray(lock?.panelSplits) ? lock.panelSplits : [];
  const stored = Array.isArray(lock?.splitBones) ? lock.splitBones : null;
  const valid = stored && stored.length === splits.length + 1;
  return normalizeSplitBones(valid ? stored : null, splits, lock);
}

// Materialize derived defaults into the persisted field (call before authoring an edit).
export function materializeSplitBones(lock) {
  if (!lock) return null;
  lock.splitBones = cloneSplitBones(splitBonesFor(lock), lock.panelSplits, lock);
  return lock.splitBones;
}

// Unified read-only bone view (KineFX-style hierarchy). Split bones carry persisted
// p/orient; main/child orient is geometry-derived by the caller or left null here.
export function bonesFor(lock, options = {}) {
  const bones = [];
  const points = Array.isArray(lock?.points) ? lock.points : [];
  const mainCount = points.length;
  for (let i = 0; i < mainCount; i += 1) {
    const p = points[i];
    bones.push({
      name: `main.${i}`,
      parent: i === 0 ? null : `main.${i - 1}`,
      parentParam: i / Math.max(1, mainCount - 1),
      p: p ? { x: p.x, y: p.y, z: p.z } : null,
      orient: null,
      scale: null
    });
  }
  if (["panel", "surface"].includes(lock?.geometryType)) {
    const splitBones = splitBonesFor(lock);
    splitBones.forEach((bone, k) => {
      bones.push({ ...bone, name: bone.name || `split.${k}` });
    });
  }
  const locks = Array.isArray(options.locks) ? options.locks : [];
  locks.forEach((child) => {
    if (child?.branchParentId !== lock?.id || !Array.isArray(child.points)) return;
    child.points.forEach((p, i) => {
      bones.push({
        name: `child.${child.id}.${i}`,
        parent: i === 0 ? "main" : `child.${child.id}.${i - 1}`,
        parentParam: i === 0 ? THREE.MathUtils.clamp(Number(child.branchParentParameter ?? 0), 0, 1) : null,
        p: p ? { x: p.x, y: p.y, z: p.z } : null,
        orient: null,
        scale: null
      });
    });
  });
  return bones;
}

export function splitBonesToData(bones) {
  if (!Array.isArray(bones) || !bones.length) return null;
  return bones.map((bone) => ({
    name: bone.name,
    parent: bone.parent,
    parentParam: Number(bone.parentParam ?? 0.5),
    p: bone.p ? { x: bone.p.x, y: bone.p.y, z: bone.p.z } : null,
    orient: bone.orient ? { x: bone.orient.x, y: bone.orient.y, z: bone.orient.z, w: bone.orient.w } : null,
    spread: Number(bone.spread ?? 0.5),
    taperCurve: bone.taperCurve ? bone.taperCurve.map((p) => ({ ...p })) : null,
    taperCurveSecondary: bone.taperCurveSecondary ? bone.taperCurveSecondary.map((p) => ({ ...p })) : null,
    depthCurve: bone.depthCurve ? bone.depthCurve.map((p) => ({ ...p })) : null,
    depthCurveSecondary: bone.depthCurveSecondary ? bone.depthCurveSecondary.map((p) => ({ ...p })) : null,
    asymmetricWidthCurve: bone.asymmetricWidthCurve == null ? null : Boolean(bone.asymmetricWidthCurve),
    asymmetricDepthCurve: bone.asymmetricDepthCurve == null ? null : Boolean(bone.asymmetricDepthCurve)
  }));
}

export function splitBonesFromData(data, splits, lock) {
  return normalizeSplitBones(data, splits, lock);
}

// Mirror helper: reverse segment order (segment k <-> N-1-k) and flip lateral p.
export function mirrorSplitBones(bones) {
  if (!Array.isArray(bones) || !bones.length) return null;
  const mirrored = bones.map((bone) => ({ ...bone }));
  mirrored.reverse();
  mirrored.forEach((bone) => {
    if (bone.p) bone.p = { x: -bone.p.x, y: bone.p.y, z: bone.p.z };
  });
  return mirrored;
}