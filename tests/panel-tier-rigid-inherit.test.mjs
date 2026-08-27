// panel-tier-rigid-inherit.test.mjs — 中间层继承的刚体变换（0.2.170）回归测试。
//
// 背景：0.2.168 的祖先继承是**逐点平移**（leafRest[i] += tier.points[i] − tier.restPoints[i]）。
// 中间层链的 rest 走 span 中心 u，叶子链走自己那片叶子的中心 u，两者天生有横向偏移，
// 于是「把中心线那一点的位移原样加给偏离中心线的叶子」= 叶子被平行搬走，而不是绕轴心划弧。
// 用户原话：「如果我orient中间层, 尖端应该按照中间层的中心骨骼去旋转, 而不是按照自己的
// 尖端骨骼中心旋转」。
//
// 0.2.170 改成逐点刚体变换：p ← tip.points[i] + dq_i · (p − tip.restPoints[i])。
//
// ★ 本文件的判据都取**幅度**而非存在性，且每条都设计成「平移实现下会失败」：
// 光断言「叶子动了」是不够的 —— 平移实现下叶子也会动，只是动错方向。
import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";

// 与 panel-tier-twist-inherit.test.mjs / panel-tip-span-chain.test.mjs 同一份真实数字。
const SPLITS_3LEAF = [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];
const MAIN_COUNT = 6;

function harness() {
  const panel = createPanelTipStrandApi({
    clonePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    normalizePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((p) => new THREE.Vector3(p.x, p.y, p.z))
    ),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    isPanelGeometry: () => true,
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    sculptState: { tipSelection: null, tipHover: null }
  });
  const lock = {
    id: "L",
    geometryType: "panel",
    panelSplitEnabled: true,
    panelSplits: SPLITS_3LEAF,
    width: 0.62,
    panelThickness: 0.08,
    panelCurvature: 0.18,
    panelLengthLoops: 10,
    panelWidthLoops: 6,
    taperCurve: [
      { position: 0, value: 1, interpolation: "linear" },
      { position: 1, value: 0.4, interpolation: "linear" }
    ],
    points: Array.from({ length: MAIN_COUNT }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  };
  return { panel, lock };
}

const leafNode = (a, b, tip = null) => ({ leafStart: a, leafEnd: b, children: null, tip });
const groupNode = (a, b, children, tip = null) => ({ leafStart: a, leafEnd: b, children, tip });
const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z);

// 取某叶子段的「基础 rest 链」（无任何祖先创作时的链）——刚体/平移两种实现的共同输入。
function baseChain(panel, lock, seg) {
  delete lock.panelBoneGroups;
  const c = panel.splitTipForSegment(lock, seg, SPLITS_3LEAF, null);
  assert.ok(c && Array.isArray(c.restPoints), `段 ${seg} 取不到基础链`);
  return c.restPoints.map((p) => ({ x: p.x, y: p.y, z: p.z }));
}

// 构造一个「纯旋转、零平移」的中间层 tip：restPoints = 给定链，points = 绕 restPoints[0]
// 转 angle。第 0 点是轴心故不动 ⇒ 平移量为 0。
// ★ 这是本文件所有判据的分辨力来源：纯平移实现读到的 delta 在第 0 点恒为 0、其余点也只是
// 「中心线自己的位移」，它无法让偏离中心线的叶子绕轴心走；刚体实现会。
function pureRotationTip(chain, angle, axis = new THREE.Vector3(0, 0, 1)) {
  const q = new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), angle);
  const pivot = new THREE.Vector3(chain[0].x, chain[0].y, chain[0].z);
  const points = chain.map((p) => {
    const v = new THREE.Vector3(p.x, p.y, p.z).sub(pivot).applyQuaternion(q).add(pivot);
    return { x: v.x, y: v.y, z: v.z };
  });
  return {
    points,
    restPoints: chain.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    twists: null,
    active: true
  };
}

// 旧的纯平移公式，作为对照基准：leafRest[i] + (tier.points[i] − tier.restPoints[i])。
function translateOnly(base, tip) {
  return base.map((p, i) => ({
    x: p.x + (tip.points[i].x - tip.restPoints[i].x),
    y: p.y + (tip.points[i].y - tip.restPoints[i].y),
    z: p.z + (tip.points[i].z - tip.restPoints[i].z)
  }));
}

// ---------------------------------------------------------------------------
// 1. 退化等价：中间层只平移（未旋转）时，必须与旧平移公式**逐位**相同。
//    这是「存量 .ahs 不迁移」的结构性依据 —— 只拖动过中间层的档输出完全不变。
// ---------------------------------------------------------------------------
test("退化：中间层只平移未旋转 ⇒ 与旧平移公式逐位相同（存量档不变）", () => {
  const { panel, lock } = harness();
  const base = baseChain(panel, lock, 1);
  const shift = { x: 0.13, y: -0.07, z: 0.21 };
  const tierTip = {
    points: base.map((p) => ({ x: p.x + shift.x, y: p.y + shift.y, z: p.z + shift.z })),
    restPoints: base.map((p) => ({ ...p })),
    twists: null,
    active: true
  };
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], tierTip)
  ]);
  const chain = panel.splitTipForSegment(lock, 1, SPLITS_3LEAF, null);
  const expected = translateOnly(base, tierTip);
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    assert.ok(dist(chain.restPoints[i], expected[i]) < 1e-12,
      `第${i}点：纯平移层必须与旧公式相同，实测差 ${dist(chain.restPoints[i], expected[i])}`);
  }
});

// ---------------------------------------------------------------------------
// 2. ★ 核心判据：中间层纯旋转时，叶子必须**绕中间层轴心划弧**而不是被平移。
//    判据取「到轴心的距离是否保持」——刚体保距，平移不保。
// ---------------------------------------------------------------------------
// ★ 判据选的是力臂**方向**是否转过，不是「到轴心的距离是否保持」。
// 后者写过一版，被自己的负向对照否掉了：平移下 p' = p + (a[i] − r[i])，于是
// p' − a[i] = p − r[i] —— 力臂向量逐字相同，距离**恒**保持（实测差 1.39e-17）。
// 也就是说「绕轴心保距」这个判据对两种实现同真，没有分辨力。留着这段说明，免得后人
// 再写一遍那个看起来很对的判据。
test("核心：中间层纯旋转 ⇒ 叶子的力臂方向随之转过（平移实现下方向一动不动）", () => {
  const { panel, lock } = harness();
  const base = baseChain(panel, lock, 2); // 段 2：横向偏离 span 中心，力臂非零
  const tierBase = baseChain(panel, lock, 1);
  const tierTip = pureRotationTip(tierBase, 0.5);
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], tierTip)
  ]);
  const chain = panel.splitTipForSegment(lock, 2, SPLITS_3LEAF, null);
  const translated = translateOnly(base, tierTip);

  // ① 刚体结果与平移结果必须显著不同 —— 这是「实现真的换了」的直接证据。
  let vsTranslate = 0;
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    vsTranslate = Math.max(vsTranslate, dist(chain.restPoints[i], translated[i]));
  }
  assert.ok(vsTranslate > 0.01,
    `刚体输出必须显著区别于平移输出，实测最大差 ${vsTranslate}`);

  // ② 力臂方向确实转过：取夹角，应与该层的旋转角同量级（非零）。
  //    同时验证力臂**长度**不变（刚体不拉伸），这条两种实现都满足，但它保证 ① 的差异
  //    来自旋转而不是长度被改坏了。
  let maxAngle = 0;
  let maxLenErr = 0;
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    const before = new THREE.Vector3(
      base[i].x - tierTip.restPoints[i].x,
      base[i].y - tierTip.restPoints[i].y,
      base[i].z - tierTip.restPoints[i].z
    );
    const after = new THREE.Vector3(
      chain.restPoints[i].x - tierTip.points[i].x,
      chain.restPoints[i].y - tierTip.points[i].y,
      chain.restPoints[i].z - tierTip.points[i].z
    );
    maxLenErr = Math.max(maxLenErr, Math.abs(after.length() - before.length()));
    if (before.lengthSq() > 1e-12 && after.lengthSq() > 1e-12) {
      maxAngle = Math.max(maxAngle, before.angleTo(after));
    }
  }
  assert.ok(maxLenErr < 1e-9, `刚体不应改变力臂长度，实测 ${maxLenErr}`);
  assert.ok(maxAngle > 0.05, `力臂方向必须随该层旋转而转，实测最大夹角 ${maxAngle} rad`);
});

// ---------------------------------------------------------------------------
// 3. 朝向一致：叶子链应等于「把基础链整体按该层旋转搬过去」，不只是保距。
//    保距只约束半径，不约束转到哪个角度；这条钉住方向。
// ---------------------------------------------------------------------------
test("朝向：叶子链 = 基础链按中间层的 dq 逐点变换（保距之外还要方向对）", () => {
  const { panel, lock } = harness();
  const angle = 0.4;
  const base = baseChain(panel, lock, 2);
  const tierBase = baseChain(panel, lock, 1);
  const tierTip = pureRotationTip(tierBase, angle);
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], tierTip)
  ]);
  const chain = panel.splitTipForSegment(lock, 2, SPLITS_3LEAF, null);

  // 期望值用与实现**同源**的切线估计（CatmullRomCurve3），否则会因估计器不同而假红。
  const authoredCurve = new THREE.CatmullRomCurve3(
    tierTip.points.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
  const restCurve = new THREE.CatmullRomCurve3(
    tierTip.restPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
  let maxErr = 0;
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    const t = i / Math.max(1, MAIN_COUNT - 1);
    const at = authoredCurve.getTangent(t).normalize();
    const rt = restCurve.getTangent(t).normalize();
    const dq = new THREE.Quaternion().setFromUnitVectors(rt, at);
    const arm = new THREE.Vector3(base[i].x, base[i].y, base[i].z)
      .sub(new THREE.Vector3(tierTip.restPoints[i].x, tierTip.restPoints[i].y, tierTip.restPoints[i].z))
      .applyQuaternion(dq);
    const want = {
      x: tierTip.points[i].x + arm.x,
      y: tierTip.points[i].y + arm.y,
      z: tierTip.points[i].z + arm.z
    };
    maxErr = Math.max(maxErr, dist(chain.restPoints[i], want));
  }
  assert.ok(maxErr < 1e-9, `叶子链应逐点等于基础链按 dq 变换的结果，实测 maxErr=${maxErr}`);
});

// ---------------------------------------------------------------------------
// 4. twist 纳入刚体变换（用户拍板）：中间层只有 twist、points≡restPoints 时，
//    偏心叶子仍应绕该层切线公转。这条专门覆盖 dq 里的滚转分量。
// ---------------------------------------------------------------------------
test("twist：中间层只写 twists（points≡restPoints）⇒ 偏心叶子仍绕切线公转", () => {
  const { panel, lock } = harness();
  const base = baseChain(panel, lock, 2);
  const tierBase = baseChain(panel, lock, 1);
  const tierTip = {
    points: tierBase.map((p) => ({ ...p })),   // 零位移
    restPoints: tierBase.map((p) => ({ ...p })),
    twists: Array.from({ length: MAIN_COUNT }, () => 0.6),
    active: true
  };
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], tierTip)
  ]);
  const chain = panel.splitTipForSegment(lock, 2, SPLITS_3LEAF, null);
  // 纯平移公式在此输入下 delta 恒为零 ⇒ 叶子一动不动。刚体+滚转会让它绕切线转。
  let maxMove = 0;
  for (let i = 0; i < MAIN_COUNT; i += 1) maxMove = Math.max(maxMove, dist(chain.restPoints[i], base[i]));
  assert.ok(maxMove > 0.01,
    `中间层 twist 必须带动偏心叶子（平移实现下此值为 0），实测 maxMove=${maxMove}`);
});

// ---------------------------------------------------------------------------
// 5. 负向对照：不被该中间层覆盖的叶子 0 必须逐位不变。
// ---------------------------------------------------------------------------
test("负向对照：中间层旋转不影响区间外的叶子0", () => {
  const { panel, lock } = harness();
  const base0 = baseChain(panel, lock, 0);
  const tierBase = baseChain(panel, lock, 1);
  const tierTip = pureRotationTip(tierBase, 0.5);
  lock.panelBoneGroups = groupNode(0, 2, [
    leafNode(0, 0),
    groupNode(1, 2, [leafNode(1, 1), leafNode(2, 2)], tierTip)
  ]);
  const chain0 = panel.splitTipForSegment(lock, 0, SPLITS_3LEAF, null);
  for (let i = 0; i < MAIN_COUNT; i += 1) {
    assert.ok(dist(chain0.restPoints[i], base0[i]) < 1e-12,
      `叶子0第${i}点不该动，实测差 ${dist(chain0.restPoints[i], base0[i])}`);
  }
});
