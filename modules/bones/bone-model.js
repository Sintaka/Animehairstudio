// bone-model.js — KineFX-style unified bone view + split sub-bone data model (0.2.59).
// Bones are ordinary named points: { name, parent, parentParam, p, orient }. No matrices:
// only P (position) + rotation (quaternion). Hybrid persistence: only split sub-bones
// (lock.splitBones) are persisted; the main chain (lock.points) and child chains
// (branchParentId / child points) stay in their existing fields and are derived here.
import * as THREE from "three";

const MAX_SPLIT_SEGMENTS = 24;
// spread（UI 名 Tip Clump）的定义域上界：超过 1 会让段/管尖越过自身宽度、产生 crossover
// （panel 的 segmentRamp 与 strand-geometry 的 per-section opening 都钳在同一界）。
// **唯一定义点**（0.2.130 起导出）：此前 segment-control.js 保留了一份「bone-model 未导出该
// 常量，故此处保留副本」的字面量，视口滑杆与拖拽路径还各自内联 0.99。消费方一律 import。
export const SPREAD_MAX = 0.99;

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
          twists: Array.isArray(src.tip.twists) ? src.tip.twists.map((v) => Number(v) || 0) : null,
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
  const strandTip = strandTipFor(lock);
  const strandSplitBones = strandSplitBonesFor(lock);
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
    || (Array.isArray(lock?.bones) && lock.bones.length > 0)
    || !!strandTip
    || !!strandSplitBones;
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
  if (strandSplitBones) {
    strandSplitBones.forEach((bone, k) => {
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
  if (strandTip && mainCount > 0 && !["panel", "surface"].includes(lock?.geometryType) && !strandSplitBones) {
    const tipName = `main.${mainCount - 1}.tip`;
    strandTip.points.forEach((p, i) => {
      bones.push({
        name: `${tipName}.${i}`,
        parent: `main.${mainCount - 1}`,
        parentParam: strandTip.points.length > 1 ? i / (strandTip.points.length - 1) : 0,
        p: p ? { x: Number(p.x), y: Number(p.y), z: Number(p.z) } : null,
        orient: null,
        scale: null,
        kind: "tip",
        role: "leaf"
      });
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
    asymmetricDepthCurve: bone.asymmetricDepthCurve == null ? null : Boolean(bone.asymmetricDepthCurve),
    kind: bone.kind || "split",
    meta: bone.meta ? { ...bone.meta } : null,
    tip: bone.tip && Array.isArray(bone.tip.points)
      ? {
        points: bone.tip.points.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })) : null,
        twists: Array.isArray(bone.tip.twists) ? bone.tip.twists.map((v) => Number(v) || 0) : null,
        active: bone.tip.active !== false
      }
      : null
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
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: -p.x, y: p.y, z: p.z })) : null,
        twists: Array.isArray(bone.tip.twists) ? bone.tip.twists.map((v) => -Number(v)) : null
      };
    }
  });
  return mirrored;
}

// ---- 分段骨骼重映射（增删拉链时的一次性骨骼数据搬迁） ----
// 段 = 排序后拉链之间的间隔：N 个拉链 → N+1 段，段 k 跨越边界 k..k+1。
// splitBones / strandSplitBones 是 index-keyed 数组，只改 splits 数组会让骨骼整体
// 错位（用户的发尖位移“跑到下一个发尖”）。下面两个纯函数把骨骼数据搬到正确的段上，
// 并让被细分 / 合并出来的段继承来源段的姿态：tip 的 authored delta 会由
// materializeTipChain 在新段自己的 rest 链上自动重新叠加，无需改动几何管线。

// 深克隆单个分段骨骼（tip / 曲线数组全部不共享引用）。
// name 与 parentParam 故意丢弃：两者都由下标派生（name → `split.k`，
// parentParam → panel 回退 0.5 / strand 回退 strandSplitForkTForSegment），
// 继承旧值会让名字重复、并把叉口深度停留在旧的段边界上。
function cloneSegmentBone(bone) {
  if (!bone || typeof bone !== "object") return null;
  const point = (p) => (p ? { x: Number(p.x), y: Number(p.y), z: Number(p.z) } : null);
  const curve = (key) => (Array.isArray(bone[key]) ? bone[key].map((p) => ({ ...p })) : null);
  return {
    name: null,
    parent: bone.parent || "main",
    parentParam: null,
    p: point(bone.p),
    orient: bone.orient
      ? {
        x: Number(bone.orient.x),
        y: Number(bone.orient.y),
        z: Number(bone.orient.z),
        w: Number(bone.orient.w ?? 1)
      }
      : null,
    scale: bone.scale ? { x: Number(bone.scale.x), z: Number(bone.scale.z) } : null,
    tip: bone.tip && Array.isArray(bone.tip.points)
      ? {
        points: bone.tip.points.map(point),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map(point) : null,
        twists: Array.isArray(bone.tip.twists) ? bone.tip.twists.map((v) => Number(v) || 0) : null,
        active: bone.tip.active !== false
      }
      : null,
    spread: bone.spread == null ? null : Number(bone.spread),
    taperCurve: curve("taperCurve"),
    taperCurveSecondary: curve("taperCurveSecondary"),
    depthCurve: curve("depthCurve"),
    depthCurveSecondary: curve("depthCurveSecondary"),
    asymmetricWidthCurve: bone.asymmetricWidthCurve == null ? null : Boolean(bone.asymmetricWidthCurve),
    asymmetricDepthCurve: bone.asymmetricDepthCurve == null ? null : Boolean(bone.asymmetricDepthCurve),
    kind: bone.kind || "split",
    meta: bone.meta ? { ...bone.meta } : null
  };
}

// 合并时选留哪一段的姿态：显式 survivorIndex 优先；否则按 span 取更宽的那段
// （更宽 = 更接近合并后的几何，发尖姿态最接近现状）；都没有则取左段。
function resolveMergeSurvivor(bones, deleteIndex, options) {
  const explicit = Number(options?.survivorIndex);
  if (Number.isFinite(explicit)) {
    return THREE.MathUtils.clamp(Math.round(explicit), 0, Math.max(0, bones.length - 1));
  }
  const spans = Array.isArray(options?.spans) ? options.spans : null;
  if (spans) {
    const left = Number(spans[deleteIndex]);
    const right = Number(spans[deleteIndex + 1]);
    if (Number.isFinite(left) && Number.isFinite(right) && right > left) return deleteIndex + 1;
  }
  return deleteIndex;
}

// 插入：在排序下标 insertIndex 新增一个拉链，把段 insertIndex 一分为二。
// 返回长度 +1 的新数组：段 0..insertIndex-1 原样；段 insertIndex 与 insertIndex+1
// 都从来源段 insertIndex 深克隆（两半都继承被细分段的姿态）；其后整体后移一格。
// 缺失的来源写入 null，交由 normalize 派生默认值。输入不被修改。
export function remapSegmentBonesOnInsert(bones, insertIndex) {
  const list = Array.isArray(bones) ? bones : [];
  const at = THREE.MathUtils.clamp(
    Math.floor(Number(insertIndex) || 0),
    0,
    Math.max(0, list.length - 1)
  );
  const out = [];
  for (let k = 0; k < list.length + 1; k += 1) {
    // k <= at：两半都取来源段 at；k > at：来源整体后移一格（BUG 1 的错位修正）
    const sourceIndex = k <= at ? Math.min(k, at) : k - 1;
    out.push(cloneSegmentBone(list[sourceIndex]));
  }
  return out;
}

// 删除：移除排序下标 deleteIndex 的拉链，把段 deleteIndex 与 deleteIndex+1 合并为一段。
// 返回长度 -1 的新数组：段 0..deleteIndex-1 原样；段 deleteIndex 取 survivor 的深克隆；
// 其后从 bones[deleteIndex+2..] 前移一格。输入不被修改。
export function remapSegmentBonesOnDelete(bones, deleteIndex, options = {}) {
  const list = Array.isArray(bones) ? bones : [];
  const outCount = Math.max(0, list.length - 1);
  if (!outCount) return [];
  const at = THREE.MathUtils.clamp(Math.floor(Number(deleteIndex) || 0), 0, outCount - 1);
  const survivor = THREE.MathUtils.clamp(
    resolveMergeSurvivor(list, at, options),
    0,
    Math.max(0, list.length - 1)
  );
  const out = [];
  for (let k = 0; k < outCount; k += 1) {
    const sourceIndex = k < at ? k : (k === at ? survivor : k + 1);
    out.push(cloneSegmentBone(list[sourceIndex]));
  }
  return out;
}

// ---- strand tip sub-bone data model (Route 1: regular-strand single tip) ----
// lock.strandTip is optional; old files without it derive defaults in the geometry
// layer (rest chain from the strand's own curve), never written back here.

export function normalizeStrandTip(value) {
  if (!value || !Array.isArray(value.points) || value.points.length < 2) return null;
  const numPoint = (p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) });
  return {
    points: value.points.map(numPoint),
    restPoints: Array.isArray(value.restPoints) ? value.restPoints.map(numPoint) : null,
    twists: Array.isArray(value.twists) ? value.twists.map((v) => Number(v) || 0) : null,
    active: value.active !== false
  };
}

export function strandTipFor(lock) {
  return Array.isArray(lock?.strandTip?.points) ? normalizeStrandTip(lock.strandTip) : null;
}

export function strandTipToData(tip) {
  const normalized = normalizeStrandTip(tip);
  if (!normalized) return null;
  const numPoint = (p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) });
  return {
    points: normalized.points.map(numPoint),
    restPoints: Array.isArray(normalized.restPoints) ? normalized.restPoints.map(numPoint) : null,
    twists: Array.isArray(normalized.twists) ? normalized.twists.map(Number) : null,
    active: normalized.active !== false
  };
}

export function strandTipFromData(data, lock = null) {
  return normalizeStrandTip(data);
}

export function mirrorStrandTip(tip) {
  const normalized = normalizeStrandTip(tip);
  if (!normalized) return null;
  return {
    ...normalized,
    points: normalized.points.map((p) => ({ ...p, x: -p.x })),
    restPoints: normalized.restPoints ? normalized.restPoints.map((p) => ({ ...p, x: -p.x })) : null,
    twists: normalized.twists ? normalized.twists.map((v) => -Number(v)) : null
  };
}

// ---- strand split sub-bone data model (Route 2: split-strand per-tube tips) ----
// lock.strandSplitBones is optional (length = 拉链数 N + 1，kind="split"); old files
// without it derive that many default bones (spread = strandSplitGap, tip = null) in
// memory. 长度不再是 2：0.2.116 起普通发丝是 N 拉链 → N+1 管（N=1 时仍为 2，即 legacy）。

export function defaultStrandSplitSpread(lock) {
  // Relative per-tube tip spread fraction; derived from the legacy absolute gap so
  // old files keep a comparable look (default 0.12), clamped so tubes never invert.
  return THREE.MathUtils.clamp(Number(lock?.strandSplitGap ?? 0.12), 0, SPREAD_MAX);
}

export function strandSplitForkT(lock) {
  const height = THREE.MathUtils.clamp(Number(lock?.strandSplitHeight ?? 0.3), 0.02, 0.8);
  return 1 - height;
}

// Sorted, clamped split list matching createSplitStrandGeometry exactly (the same
// legacy single-scalar fallback), so bone layout and geometry agree on N and heights.
export function strandSplitsFor(lock) {
  const rawSplits = Array.isArray(lock?.strandSplits) && lock.strandSplits.length
    ? lock.strandSplits
    : [{ position: Number(lock?.strandSplitPosition ?? 0), height: Number(lock?.strandSplitHeight ?? 0.3) }];
  return rawSplits
    .map((split) => ({
      position: THREE.MathUtils.clamp(Number(split?.position ?? 0), -0.8, 0.8),
      height: THREE.MathUtils.clamp(Number(split?.height ?? 0.3), 0.02, 0.8)
    }))
    .sort((a, b) => a.position - b.position);
}

// Per-tube fork parameter (opening start along the main chain). Section k opens where
// its adjacent split(s) are deepest, matching the geometry's sectionSplitStart:
// 1 - max(splits[k-1].height, splits[k].height). Edge sections use their single
// adjacent split. At N=1 both tubes reduce to 1 - strandSplitHeight (legacy value).
export function strandSplitForkTForSegment(lock, segmentIndex) {
  const splits = strandSplitsFor(lock);
  const leftHeight = splits[segmentIndex - 1]?.height ?? 0;
  const rightHeight = splits[segmentIndex]?.height ?? 0;
  return 1 - Math.max(leftHeight, rightHeight);
}

// ---- 管 k 的横向推开方向：本仓库唯一定义点（standards「一处派生」） ----
// 规则：沿管下标**单调递增**地从 -1 线性插到 +1（splitCount = 拉链数 N，管数 N+1）：
//   direction(k) = (2k - N) / N，k = 0..N
// 单调性是关键：缝 k|k+1 只有在两管**相向分离**（direction[k+1] > direction[k]）时才会
// 张开。旧规则用离散的 ±1/0（最左 -1、最右 +1、中间取两侧拉链中点符号），N=2 时得到
// [-1,-1,+1] —— 管 0 与管 1 同向平移、缝 0 永远闭合，所以「加了多个 zipper 只有一条缝
// 打开」。新规则下相邻差恒为 2/N > 0，N 条缝全部张开；中间管位移量小于外侧管，因此
// 总横向张开幅度不会随 N 膨胀。N=1 时退化为 -1/+1，与旧版逐值相同。
// 消费方（必须与本函数保持一致，改这里就要看那两处）：
//   - modules/geometry/strand-geometry.js  createSplitStrandGeometry（per-section direction）
//   - modules/io/usda-export.js            strandDirectionForTube
export function strandSplitDirection(segmentIndex, splitCount) {
  const count = Math.max(0, Math.floor(Number(splitCount) || 0));
  if (count <= 0) return 0; // 0 拉链 = 单管，无处可推（split 发丝恒 ≥1 拉链，此处只防除零）
  const k = THREE.MathUtils.clamp(Math.floor(Number(segmentIndex) || 0), 0, count);
  return (2 * k - count) / count;
}

// lock 版包装：按几何一致的归一化（strandSplitsFor：排序 + 钳制 + legacy 单标量回退）
// 取出拉链数，再套用上面的唯一规则。
export function strandSplitDirectionForSegment(lock, segmentIndex) {
  return strandSplitDirection(segmentIndex, strandSplitsFor(lock).length);
}

function normalizeStrandSplitBone(bone, lock, index) {
  const normalized = normalizeBone(bone, null, lock);
  normalized.name = bone?.name || `split.${index}`;
  normalized.parent = bone?.parent || "main";
  normalized.parentParam = THREE.MathUtils.clamp(
    Number(bone?.parentParam ?? strandSplitForkTForSegment(lock, index)),
    0,
    1
  );
  if (bone?.spread == null) normalized.spread = defaultStrandSplitSpread(lock);
  normalized.tip = normalizeStrandTip(bone?.tip);
  normalized.kind = "split";
  return normalized;
}

// Effective strand split bones for a split-strand lock: one per tube, left-to-right in
// strandSplitDirection order, taken from the authored lock.strandSplitBones when present,
// otherwise derived defaults (not written back). Returns null for any non-split-strand lock.
export function strandSplitBonesFor(lock) {
  if (lock?.geometryType !== "strand" || !lock.strandSplitEnabled) return null;
  // Tube count = number of zippers + 1 (N splits -> N+1 sections). Derived the same way
  // as the geometry so bones and tubes always agree. At N=1 this is exactly 2.
  const tubeCount = strandSplitsFor(lock).length + 1;
  const stored = Array.isArray(lock?.strandSplitBones) && lock.strandSplitBones.length === tubeCount
    ? lock.strandSplitBones
    : null;
  if (stored) return stored.map((bone, k) => normalizeStrandSplitBone(bone, lock, k));
  const spread = defaultStrandSplitSpread(lock);
  return Array.from({ length: tubeCount }, (_, k) => ({
    name: `split.${k}`,
    parent: "main",
    parentParam: strandSplitForkTForSegment(lock, k),
    p: null,
    orient: null,
    tip: null,
    spread,
    taperCurve: null,
    taperCurveSecondary: null,
    depthCurve: null,
    depthCurveSecondary: null,
    asymmetricWidthCurve: null,
    asymmetricDepthCurve: null,
    kind: "split"
  }));
}

// Materialize derived defaults into the persisted field (call before authoring an edit).
export function materializeStrandSplitBones(lock) {
  if (!lock) return null;
  const bones = strandSplitBonesFor(lock);
  if (!bones) return null;
  lock.strandSplitBones = bones.map((bone) => ({ ...bone }));
  return lock.strandSplitBones;
}

export function strandSplitBonesToData(bones) {
  if (!Array.isArray(bones) || !bones.length) return null;
  return bones.map((bone) => ({
    name: bone.name,
    parent: bone.parent,
    parentParam: Number(bone.parentParam ?? 0.5),
    p: bone.p ? { x: bone.p.x, y: bone.p.y, z: bone.p.z } : null,
    orient: bone.orient ? { x: bone.orient.x, y: bone.orient.y, z: bone.orient.z, w: bone.orient.w } : null,
    spread: Number(bone.spread ?? 0.12),
    taperCurve: bone.taperCurve ? bone.taperCurve.map((p) => ({ ...p })) : null,
    taperCurveSecondary: bone.taperCurveSecondary ? bone.taperCurveSecondary.map((p) => ({ ...p })) : null,
    depthCurve: bone.depthCurve ? bone.depthCurve.map((p) => ({ ...p })) : null,
    depthCurveSecondary: bone.depthCurveSecondary ? bone.depthCurveSecondary.map((p) => ({ ...p })) : null,
    asymmetricWidthCurve: bone.asymmetricWidthCurve == null ? null : Boolean(bone.asymmetricWidthCurve),
    asymmetricDepthCurve: bone.asymmetricDepthCurve == null ? null : Boolean(bone.asymmetricDepthCurve),
    kind: bone.kind || "split",
    meta: bone.meta ? { ...bone.meta } : null,
    tip: bone.tip && Array.isArray(bone.tip.points)
      ? {
        points: bone.tip.points.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z) })) : null,
        twists: Array.isArray(bone.tip.twists) ? bone.tip.twists.map((v) => Number(v) || 0) : null,
        active: bone.tip.active !== false
      }
      : null
  }));
}

export function strandSplitBonesFromData(data, lock = null) {
  // Empty / invalid arrays -> null. Otherwise the array is length-agnostic: it maps as-is
  // (N+1 tubes). When a lock is supplied we still accept it, whether or not its length
  // matches the lock's current tube count, so both a legacy 2-length file (N=1) and an
  // N+1-length file round-trip. Length literals are intentionally gone.
  if (!Array.isArray(data) || !data.length) return null;
  return data.map((bone, k) => normalizeStrandSplitBone(bone, lock, k));
}

// Mirror strand split bones: reverse tube order (tube k <-> N-k) and flip lateral p/tip x
// + negate twists per tube. 与 mirrorSplitBones（panel 侧，L243）同规则。
// **必须 reverse**，理由绑在 strandSplitDirection（本文件唯一定义点）的单调性上：
// direction(k, N) = (2k - N) / N 沿管下标从 -1 单调递增到 +1，即下标 = 从左到右的横向
// 次序。绕 X 镜像把最左管映到最右管，所以源管 k 的创作数据在镜像体里属于下标 N-k；
// 不 reverse 就等于把「最左管的发尖姿态」贴到镜像体的最左管上 —— 而那一管几何上对应
// 源的最右管，用户看到的是每根管的发尖位移全都串到了错误的管。
// （旧注释称「两管左右对称所以保持顺序」：仅在 N=1 且两管姿态恰好互为镜像时看不出来，
// 一旦任一管被单独创作、或 N≥2，下标就必须反转。）
// 派生字段：name 置 null，交由 normalizeStrandSplitBone 按**新**下标重派生
// （`split.${index}`），与 cloneSegmentBone 的处置一致——继承旧名会让下标 k 的骨骼叫
// `split.${N-k}`，USDA 关节名与按下标排布的骨骼层级就此错位。
// parentParam 刻意**保留**（不置 null）：它在 reverse 下恒等成立——
// 镜像体的 splits 是源 splits 取反 position 后重新按 position 排序，等价于 heights 数组
// 整体反转，于是 forkT'(k) = 1 - max(h'[k-1], h'[k]) = 1 - max(h[N-k], h[N-1-k]) = forkT(N-k)，
// 正是下标 N-k 的源骨骼携带的值。而置 null 反而有害：镜像伴生体的 strandSplitBones 被
// 直接赋值、不经 materializeStrandSplitBones（app.js syncActiveMirror），保存时
// strandSplitBonesToData 会把 null 写成硬编码 0.5，把正确的叉口深度永久损坏。
export function mirrorStrandSplitBones(bones) {
  if (!Array.isArray(bones) || !bones.length) return null;
  return bones.slice().reverse().map((bone) => ({
    ...bone,
    name: null,
    p: bone.p ? { ...bone.p, x: -bone.p.x } : null,
    tip: bone.tip && Array.isArray(bone.tip.points)
      ? {
        ...bone.tip,
        points: bone.tip.points.map((p) => ({ x: -p.x, y: p.y, z: p.z })),
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: -p.x, y: p.y, z: p.z })) : null,
        twists: Array.isArray(bone.tip.twists) ? bone.tip.twists.map((v) => -Number(v)) : null
      }
      : null
  }));
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
        twists: Array.isArray(src.tip.twists) ? src.tip.twists.map((v) => Number(v) || 0) : null,
        active: src.tip.active !== false
      }
      : (fb.tip && Array.isArray(fb.tip.points) ? { ...fb.tip } : null),
    spread: THREE.MathUtils.clamp(Number(pick("spread") ?? defaultSplitSpread(lock)), 0, SPREAD_MAX),
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
        restPoints: Array.isArray(bone.tip.restPoints) ? bone.tip.restPoints.map((p) => ({ x: -p.x, y: p.y, z: p.z })) : null,
        twists: Array.isArray(bone.tip.twists) ? bone.tip.twists.map((v) => -Number(v)) : null
      }
      : null
  }, null, null));
  if (mirrored.every((bone) => bone.kind === "split")) mirrored.reverse();
  return mirrored;
}

// ── 段骨骼「宿主」描述子：panel 段与普通发丝管的唯一分派点 ────────────────────
// 两种几何都按「段下标 = 身份」存 per-segment 创作数据（spread / 每段 Width-Depth
// 曲线），字段名与段数推导方式不同。凡消费方需要「当前几何的段数 / 段骨骼数组 /
// 选中段索引」，一律经此处取描述子，禁止在消费方就地重写 `panelSplits.length + 1`
// 之类的表达式（standards「一条推导规则只准有一个定义点」）。
// 消费方清单（改这里必须回看这几处）：
//   - modules/bones/segment-control.js  段选择器 / per-segment spread / 曲线编辑入口
//   - modules/geometry/taper-editor.js  segment 类型的编辑目标与热刷新重定向
//   - modules/io/shape-presets.js       段曲线预设写入后的「是否仍在编辑同一段」判定
// segmentCount 刻意各自委托给几何真源：panel 直接数 panelSplits（几何同规则），
// strand 走 strandSplitsFor（排序 + 钳制 + legacy 单标量回退），不得改成读原始数组。
// tipChainPointCount = 该几何的发尖子骨骼链点数，**唯一定义点**（0.2.126 新增）：两种几何
// 的发尖链都复刻主链拓扑（同点数），但下限不同 —— panel 的把手分配允许 0（主链不足 2 点时
// 整段没有可编辑发尖，splitTipForSegment 也返回 null），发丝的 materializeTipChain 恒需
// >= 2 点（它内部 Math.max(2, count)，传 0 会造出与视口不一致的 2 点链）。消费方一律读这里，
// 禁止再就地写 `lock.points.length` / `Math.max(2, ...)`：把手分配、链物化、笔刷区间三处
// 一旦不同源，就会出现「手柄比链点多/少」而越界或漏点。
export const PANEL_SEGMENT_HOST = Object.freeze({
  kind: "panel",
  bonesField: "splitBones",
  segmentIndexKey: "panelSegmentIndex",
  segmentCount: (lock) => Math.max(1, (Array.isArray(lock?.panelSplits) ? lock.panelSplits.length : 0) + 1),
  tipChainPointCount: (lock) => (Array.isArray(lock?.points) ? lock.points.length : 0),
  bonesFor: splitBonesFor,
  materializeBones: materializeSplitBones
});

export const STRAND_SEGMENT_HOST = Object.freeze({
  kind: "strand",
  bonesField: "strandSplitBones",
  segmentIndexKey: "strandSegmentIndex",
  segmentCount: (lock) => strandSplitsFor(lock).length + 1,
  tipChainPointCount: (lock) => Math.max(2, Array.isArray(lock?.points) ? lock.points.length : 2),
  bonesFor: strandSplitBonesFor,
  materializeBones: materializeStrandSplitBones
});

// 几何 → 宿主。panel/surface 走 panel 段；开启分裂的普通发丝走管段；其余无段骨骼。
// 与 app.js 的 isPanelGeometry(["panel","surface"]) 同规则——那边是 UI 门控、这里是
// 数据分派，两处都改才算改完。
export function segmentBoneHost(lock) {
  if (["panel", "surface"].includes(lock?.geometryType)) return PANEL_SEGMENT_HOST;
  if (lock?.geometryType === "strand" && lock.strandSplitEnabled) return STRAND_SEGMENT_HOST;
  return null;
}

// 选中段的解析：钳位用 round（步进按钮与视口点击写的都是整数下标，round 只在读到
// 脏值/浮点时兜底），count-1 上限保证删段后残留的旧下标不会越界。
// host 可显式传入：panel 的创建默认值对象没有 geometryType，无法经 segmentBoneHost
// 分派，但它的段语义与 panel lock 完全相同。
export function resolveSegmentSelection(lock, sculptState, host = segmentBoneHost(lock)) {
  if (!host) return null;
  const count = Math.max(1, host.segmentCount(lock));
  const index = THREE.MathUtils.clamp(
    Math.round(Number(sculptState?.[host.segmentIndexKey] ?? 0)) || 0,
    0,
    count - 1
  );
  return { host, index, count };
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

