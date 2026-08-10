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
      tip: src?.tip && Array.isArray(src.tip.points)
        ? {
          points: src.tip.points.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })),
          restPoints: Array.isArray(src.tip.restPoints) ? src.tip.restPoints.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })) : null,
          active: src.tip.active !== false
        }
        : null,
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

// Effective split bones for a lock: the live authored splitBones take precedence
// (they are what the panel segment editor/spread/handles mutate), then the unified
// registry (lock.bones kind="split", e.g. files written by a newer build), then
// derived defaults (not written back).
export function splitBonesFor(lock) {
  const splits = Array.isArray(lock?.panelSplits) ? lock.panelSplits : [];
  const count = splits.length + 1;
  const stored = Array.isArray(lock?.splitBones) ? lock.splitBones : null;
  if (stored && stored.length === count) return normalizeSplitBones(stored, splits, lock);
  const registry = Array.isArray(lock?.bones) ? lock.bones : null;
  if (registry) {
    const kindSplit = registry.filter((bone) => (bone?.kind || "split") === "split");
    if (kindSplit.length === count) return normalizeSplitBones(kindSplit, splits, lock);
  }
  return normalizeSplitBones(null, splits, lock);
}

// Materialize derived defaults into the persisted fields (call before authoring an edit).
// Dual-write: lock.splitBones stays the live panel-split data (editors mutate it) and
// lock.bones keeps the same entries tagged kind="split" for the unified registry.
export function materializeSplitBones(lock) {
  if (!lock) return null;
  const splitBones = cloneSplitBones(splitBonesFor(lock), lock.panelSplits, lock);
  lock.splitBones = splitBones;
  const splits = Array.isArray(lock.panelSplits) ? lock.panelSplits : [];
  const count = splits.length + 1;
  const extras = Array.isArray(lock.bones)
    ? lock.bones.filter((bone) => (bone?.kind || "split") !== "split")
    : [];
  lock.bones = [
    ...extras.map((bone) => normalizeBone(bone, null, lock)),
    ...splitBones.slice(0, count).map((bone) => ({ ...bone, kind: "split" }))
  ];
  return lock.splitBones;
}

// Unified read-only bone view (KineFX-style hierarchy). Split bones carry persisted
// p/orient; main/child orient is geometry-derived by the caller or left null here.
export function bonesFor(lock, options = {}) {
  const bones = [];
  const points = Array.isArray(lock?.points) ? lock.points : [];
  const mainCount = points.length;
  const locks = Array.isArray(options.locks) ? options.locks : [];
  const children = locks.filter((child) => child?.branchParentId === lock?.id && Array.isArray(child.points));
  // "架空" semantics: when the strand has sub-bones (split segments or branch
  // children), the main chain is the hierarchy root and geometry is driven by the
  // leaves; with neither, the main chain drives the sweep directly.
  const hasSubBones = children.length > 0
    || (["panel", "surface"].includes(lock?.geometryType)
      && lock.panelSplitEnabled !== false
      && Array.isArray(lock.panelSplits)
      && lock.panelSplits.length > 0)
    || (Array.isArray(lock?.bones) && lock.bones.length > 0);
  const mainRole = hasSubBones ? "root" : "geometry";
  for (let i = 0; i < mainCount; i += 1) {
    const p = points[i];
    bones.push({
      name: `main.${i}`,
      parent: i === 0 ? null : `main.${i - 1}`,
      parentParam: i / Math.max(1, mainCount - 1),
      p: p ? { x: p.x, y: p.y, z: p.z } : null,
      orient: null,
      scale: null,
      role: mainRole
    });
  }
  if (["panel", "surface"].includes(lock?.geometryType)) {
    const splitBones = splitBonesFor(lock);
    splitBones.forEach((bone, k) => {
      const name = bone.name || `split.${k}`;
      bones.push({ ...bone, name, kind: "split", role: "leaf" });
      if (bone.tip && Array.isArray(bone.tip.points) && bone.tip.points.length) {
        bone.tip.points.forEach((p, i) => {
          bones.push({
            name: `${name}.tip.${i}`,
            parent: name,
            parentParam: i / Math.max(1, bone.tip.points.length - 1),
            p: p ? { x: Number(p.x), y: Number(p.y), z: Number(p.z) } : null,
            orient: null,
            scale: null,
            kind: "tip",
            role: "leaf"
          });
        });
      }
    });
  }
  if (Array.isArray(lock?.bones)) {
    lock.bones.forEach((bone) => {
      if ((bone?.kind || "split") === "split") return; // split handled above
      bones.push({ ...normalizeBone(bone, null, lock), role: "leaf" });
    });
  }
  children.forEach((child) => {
    child.points.forEach((p, i) => {
      bones.push({
        name: `child.${child.id}.${i}`,
        parent: i === 0 ? "main" : `child.${child.id}.${i - 1}`,
        parentParam: i === 0 ? THREE.MathUtils.clamp(Number(child.branchParentParameter ?? 0), 0, 1) : null,
        p: p ? { x: p.x, y: p.y, z: p.z } : null,
        orient: null,
        scale: null,
        role: "leaf"
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
    if (bone.tip && Array.isArray(bone.tip.points)) {
      bone.tip = {
        ...bone.tip,
        points: bone.tip.points.map((p) => ({ x: -p.x, y: p.y, z: p.z })),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: -p.x, y: p.y, z: p.z })) : null
      };
    }
  });
  return mirrored;
}

// ---- unified authored-bone registry (lock.bones) ----
// Registry entries are the split-bone shape + kind ("split" | "child" | "custom")
// + optional meta. Main chain (points) and child chains (points/branchLocalPoints)
// stay derived and are NOT stored in the registry.

const REGISTRY_KINDS = new Set(["split", "child", "custom"]);

export function normalizeBone(value, fallback = null, lock = null) {
  const src = value && typeof value === "object" ? value : {};
  const fb = fallback && typeof fallback === "object" ? fallback : {};
  const curve = (key) => {
    const base = Array.isArray(src[key]) ? src[key] : (Array.isArray(fb[key]) ? fb[key] : null);
    return base ? base.map((p) => ({ ...p })) : null;
  };
  const pick = (key) => (src[key] == null ? (fb[key] == null ? null : fb[key]) : src[key]);
  const kind = REGISTRY_KINDS.has(src.kind) ? src.kind : (REGISTRY_KINDS.has(fb.kind) ? fb.kind : "split");
  return {
    name: src.name || fb.name || "bone",
    parent: src.parent || fb.parent || "main",
    parentParam: THREE.MathUtils.clamp(Number(pick("parentParam") ?? 0.5), 0, 1),
    p: src.p ? { x: Number(src.p.x), y: Number(src.p.y), z: Number(src.p.z) }
      : (fb.p ? { x: Number(fb.p.x), y: Number(fb.p.y), z: Number(fb.p.z) } : null),
    orient: src.orient ? { x: Number(src.orient.x), y: Number(src.orient.y), z: Number(src.orient.z), w: Number(src.orient.w ?? 1) }
      : (fb.orient ? { x: Number(fb.orient.x), y: Number(fb.orient.y), z: Number(fb.orient.z), w: Number(fb.orient.w ?? 1) } : null),
    scale: src.scale ? { x: Number(src.scale.x), z: Number(src.scale.z) }
      : (fb.scale ? { x: Number(fb.scale.x), z: Number(fb.scale.z) } : null),
    kind,
    meta: src.meta ? { ...src.meta } : (fb.meta ? { ...fb.meta } : null),
    tip: src.tip && Array.isArray(src.tip.points)
      ? {
        points: src.tip.points.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })),
        restPoints: Array.isArray(src.tip.restPoints) ? src.tip.restPoints.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })) : null,
        active: src.tip.active !== false
      }
      : (fb.tip && Array.isArray(fb.tip.points) ? { ...fb.tip } : null),
    spread: THREE.MathUtils.clamp(Number(pick("spread") ?? defaultSplitSpread(lock)), 0, 0.9),
    taperCurve: curve("taperCurve"),
    taperCurveSecondary: curve("taperCurveSecondary"),
    depthCurve: curve("depthCurve"),
    depthCurveSecondary: curve("depthCurveSecondary"),
    asymmetricWidthCurve: pick("asymmetricWidthCurve") == null ? null : Boolean(pick("asymmetricWidthCurve")),
    asymmetricDepthCurve: pick("asymmetricDepthCurve") == null ? null : Boolean(pick("asymmetricDepthCurve"))
  };
}

export function normalizeBones(value, count, lock = null) {
  const list = Array.isArray(value) ? value : [];
  const out = [];
  for (let index = 0; index < count; index += 1) out.push(normalizeBone(list[index], null, lock));
  return out;
}

export function bonesToData(bones) {
  if (!Array.isArray(bones) || !bones.length) return null;
  return bones.map((bone) => {
    const data = {
      name: bone.name,
      parent: bone.parent,
      parentParam: Number(bone.parentParam ?? 0.5),
      kind: bone.kind || "split",
      p: bone.p ? { x: bone.p.x, y: bone.p.y, z: bone.p.z } : null,
      orient: bone.orient ? { x: bone.orient.x, y: bone.orient.y, z: bone.orient.z, w: bone.orient.w } : null,
      scale: bone.scale ? { x: bone.scale.x, z: bone.scale.z } : null,
      spread: Number(bone.spread ?? 0.5),
      taperCurve: bone.taperCurve ? bone.taperCurve.map((p) => ({ ...p })) : null,
      taperCurveSecondary: bone.taperCurveSecondary ? bone.taperCurveSecondary.map((p) => ({ ...p })) : null,
      depthCurve: bone.depthCurve ? bone.depthCurve.map((p) => ({ ...p })) : null,
      depthCurveSecondary: bone.depthCurveSecondary ? bone.depthCurveSecondary.map((p) => ({ ...p })) : null,
      asymmetricWidthCurve: bone.asymmetricWidthCurve == null ? null : Boolean(bone.asymmetricWidthCurve),
      asymmetricDepthCurve: bone.asymmetricDepthCurve == null ? null : Boolean(bone.asymmetricDepthCurve)
    };
    if (bone.meta) data.meta = { ...bone.meta };
    if (bone.tip && Array.isArray(bone.tip.points)) {
      data.tip = {
        points: bone.tip.points.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })) : null,
        active: bone.tip.active !== false
      };
    }
    return data;
  });
}

export function bonesFromData(data, lock = null) {
  return Array.isArray(data) && data.length ? normalizeBones(data, data.length, lock) : null;
}

// Mirror authored registry bones: flip lateral p; reverse the split-segment block
// (segment k <-> N-1-k) when the registry is entirely split bones.
export function mirrorBones(bones) {
  if (!Array.isArray(bones) || !bones.length) return null;
  const mirrored = bones.map((bone) => normalizeBone({
    ...bone,
    p: bone.p ? { ...bone.p, x: -bone.p.x } : null,
    tip: bone.tip && Array.isArray(bone.tip.points)
      ? {
        ...bone.tip,
        points: bone.tip.points.map((p) => ({ x: -p.x, y: p.y, z: p.z })),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: -p.x, y: p.y, z: p.z })) : null
      }
      : null
  }, null, null));
  if (mirrored.every((bone) => bone.kind === "split")) mirrored.reverse();
  return mirrored;
}

// Registry written on save: authored extras (non-split) + the live panel split bones
// (from lock.splitBones, falling back to kind="split" registry entries).
export function registryForSave(lock) {
  const extras = Array.isArray(lock?.bones)
    ? lock.bones.filter((bone) => (bone?.kind || "split") !== "split")
    : [];
  const splits = Array.isArray(lock?.panelSplits) ? lock.panelSplits : [];
  const splitBones = Array.isArray(lock?.splitBones)
    ? lock.splitBones
    : (Array.isArray(lock?.bones) ? lock.bones.filter((bone) => (bone?.kind || "split") === "split") : null);
  const validSplits = splitBones && splitBones.length === splits.length + 1;
  if (!extras.length && !validSplits) return null;
  return bonesToData([
    ...extras.map((bone) => normalizeBone(bone, null, lock)),
    ...(validSplits ? splitBones.slice(0, splits.length + 1).map((bone) => ({ ...bone, kind: "split" })) : [])
  ]);
}

