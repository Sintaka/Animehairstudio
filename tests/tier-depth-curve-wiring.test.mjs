// tier-depth-curve-wiring.test.mjs — 中间层 depthCurve 的层级回落接线（0.2.175）。
//
// 背景（用户报「中间态的发尖只有 WidthCurve 绿色控制线生效，TipClump 以及剩下的属性
// 看不到」）：panelTierCurveFallback 是通用三级回落（叶子自己的值 → 沿分组链向上找
// 第一个非 null 祖先 → lock[key] 全局曲线），但只有 taperCurve/taperCurveSecondary 接了
// 这条链，depthCurve/depthCurveSecondary 一直只有两级回落（bone?.depthCurve || lock.depthCurve），
// 完全跳过分组树 —— 于是中间层选中并创作深度曲线时，宽度会跟着变、深度不会。
//
// 本文件照抄 tests/tier-width-curve-wiring.test.mjs 的 harness（它测的就是 taperCurve
// 走同一条链），把断言对象换成 tipMainSectionPoint / createPanelStrandGeometry 里
// 读 depthCurve 的两个点（发尖把手 / 网格厚度）。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import {
  materializePanelBoneGroups,
  setPanelBoneGroupValue,
  panelBoneGroupPathForLeaf,
  panelBoneGroupsFor
} from "../modules/bones/panel-bone-groups.js";

// 3 叶（2 zipper，height 不同 ⇒ 派生出 L2[0..0] / L2[1..2]{L3,L3}），与真实档 Test 4 同构，
// 与 tier-width-curve-wiring.test.mjs 的 fixture 逐字节相同（同一条分组树结构）。
const SPLITS = () => [
  { position: -0.3333333333333333, height: 0.3, order: 0 },
  { position: 0.36666666666666675, height: 0.4, order: 1 }
];
const MAIN_COUNT = 6;
const flat = (v) => [{ position: 0, value: v, interpolation: "linear" },
  { position: 1, value: v, interpolation: "linear" }];
// ★ 有梯度的 ramp 曲线：本项目踩过常量曲线的坑（在任何网格/任何段上采样都同值，
// 把「用错了曲线」这个失效模式完全遮蔽掉）。ramp 保证「叶子自己的值」「祖先中间层的值」
// 「lock 全局值」三者在 t 的同一采样点上给出彼此不同的数字，才有分辨力。
const ramp = (lo, hi) => [
  { position: 0, value: lo, interpolation: "linear" },
  { position: 1, value: hi, interpolation: "linear" }
];

function harness() {
  const panel = createPanelTipStrandApi({
    clonePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    normalizePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    strandGeometryCurve: (lock) => new THREE.CatmullRomCurve3(
      lock.points.map((p) => new THREE.Vector3(p.x, p.y, p.z))),
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1) }),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    isPanelGeometry: () => true,
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    sculptState: { tipSelection: null, tipHover: null }
  });
  const lock = {
    id: "L", geometryType: "panel", panelSplitEnabled: true, panelSplits: SPLITS(),
    width: 0.62, panelThickness: 0.08, panelCurvature: 0.18,
    panelLengthLoops: 10, panelWidthLoops: 6,
    taperCurve: flat(1), taperCurveSecondary: flat(1),
    depthCurve: flat(1), depthCurveSecondary: flat(1),
    points: Array.from({ length: MAIN_COUNT }, (_, i) => ({ x: 0, y: 1.7 - i * 0.25, z: 0 }))
  };
  return { panel, lock };
}

// 找覆盖 leafStart..leafEnd 的那个中间层路径（与 tier-width-curve-wiring.test.mjs 同一实现）。
function tierPathFor(lock, leafStart, leafEnd) {
  const root = panelBoneGroupsFor(lock);
  let found = null;
  const walk = (n, path = []) => {
    if (!n || found) return;
    if (n.leafStart === leafStart && n.leafEnd === leafEnd && Array.isArray(n.children)) { found = path; return; }
    (n.children || []).forEach((c, i) => walk(c, [...path, i]));
  };
  walk(root);
  return found;
}

// ---------------------------------------------------------------------------
// 1. ★ 核心：叶子各自设不同 depthCurve，选中覆盖它们的中间层并创作深度曲线 ⇒
//    tipMainSectionPoint（发尖把手的厚度采样点）必须读到中间层自己创作的值，
//    不能穿透中间层直接落到 lock 全局曲线（那正是接线前的 bug）。
// ---------------------------------------------------------------------------
test("核心：中间层创作 depthCurve 后，把手采样走链上回落，不再落到 lock 全局曲线", () => {
  const { panel, lock } = harness();
  const splits = SPLITS();
  // 全局曲线保持平直：任何厚度差异只可能来自 depthCurve 的链上回落。
  lock.depthCurve = flat(1);
  lock.depthCurveSecondary = flat(1);
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  assert.ok(tier, "fixture 必须有覆盖叶 1..2 的中间层");

  // 叶 1 段（segmentIndex = 1）：bone 自己不创作（null），只能靠链上回落。
  setPanelBoneGroupValue(lock, tier, "depthCurve", ramp(0.2, 1.8));
  setPanelBoneGroupValue(lock, tier, "depthCurveSecondary", ramp(0.2, 1.8));

  const t = 0.7; // 有梯度曲线上 t=0.7 处 ramp(0.2,1.8) = 0.2 + 0.7*1.6 = 1.32
  const front = panel.tipMainSectionPoint(lock, t, 0, 1, null, 1, splits);
  const back = panel.tipMainSectionPoint(lock, t, 0, -1, null, 1, splits);
  const thicknessFromHandles = front.distanceTo(back);

  const expectedMultiplier = 0.2 + 0.7 * 1.6; // ramp(0.2,1.8) 在 t=0.7 处的值
  const expectedThickness = Number(lock.panelThickness) * expectedMultiplier;
  assert.ok(
    Math.abs(thicknessFromHandles - expectedThickness) < 1e-6,
    `把手厚度应等于中间层创作值 ${expectedThickness}，实测 ${thicknessFromHandles}`
  );

  // 负向对照：若仍走接线前的两级回落（bone?.depthCurve || lock.depthCurve），
  // bone 为 null、lock.depthCurve 是平直的 1 ⇒ 应得乘数 1，与中间层创作值 1.32 的
  // 乘数显著不同——比较乘数而不是最终厚度，因为 panelThickness 是个很小的缩放系数
  // （0.08），会把乘数上的显著差异压成一个看起来很小的绝对厚度差。
  assert.ok(
    Math.abs(expectedMultiplier - 1) > 0.1,
    "sanity：中间层创作值对应的乘数必须与旧两级回落的默认乘数 1 显著不同，否则本判据无分辨力"
  );
});

// ---------------------------------------------------------------------------
// 2. 退化等价：无中间层创作值时，panelTierCurveFallback 必须回落到与改动前逐字节相同
//    的结果 —— bone?.depthCurve || lock.depthCurve。
// ---------------------------------------------------------------------------
test("退化等价：无中间层创作时，把手厚度与改前的两级回落 bone?.depthCurve||lock.depthCurve 逐字节相同", () => {
  const { panel, lock } = harness();
  const splits = SPLITS();
  lock.depthCurve = ramp(0.3, 1.7);
  lock.depthCurveSecondary = ramp(0.3, 1.7);
  materializePanelBoneGroups(lock); // 分组树存在，但没有任何节点创作过 depthCurve

  for (const t of [0.1, 0.4, 0.7, 0.95]) {
    for (const segmentIndex of [0, 1, 2]) {
      const withFallback = panel.tipMainSectionPoint(lock, t, 0, 1, null, segmentIndex, splits);
      // 手工按“改前”的公式重算一份期望值：bone?.depthCurve || lock.depthCurve（bone=null）。
      const legacyMultiplierFront = sampleFlatOrRamp(lock.depthCurve, t);
      const legacyThickness = Number(lock.panelThickness) * legacyMultiplierFront;
      const back = panel.tipMainSectionPoint(lock, t, 0, -1, null, segmentIndex, splits);
      const actualThickness = withFallback.distanceTo(back);
      assert.ok(
        Math.abs(actualThickness - legacyThickness) < 1e-6,
        `segment=${segmentIndex} t=${t}：退化等价应给出 ${legacyThickness}，实测 ${actualThickness}`
      );
    }
  }
});

// 手工复刻 sampleTaperCurve 的线性两点插值（本文件只用得上两点线性 ramp/flat，不必
// import 被测模块之外的实现——避免测试的期望值计算复用被测代码的同一份公式）。
function sampleFlatOrRamp(curve, t) {
  const clamped = Math.min(1, Math.max(0, t));
  const [p0, p1] = curve;
  return p0.value + (p1.value - p0.value) * clamped;
}

// ---------------------------------------------------------------------------
// 3. ★ 网格路径（createPanelStrandGeometry 内部的 panelThicknessAt）必须与把手侧
//    （tipMainSectionPoint）走同一条回落——两处必须同步改，否则会出现「把手用了层级值、
//    网格没用」的新错位（比接线前的旧 bug 更隐蔽：肉眼看把手对了，网格却还是旧值）。
//    本测试直接量网格顶点厚度（front/back 壳间距），不经过把手侧的任何代码。
// ---------------------------------------------------------------------------
test("网格路径：createPanelStrandGeometry 的段厚度也读到中间层创作的 depthCurve", () => {
  const { panel, lock } = harness();
  lock.panelLengthLoops = 4;
  lock.panelWidthLoops = 6;
  lock.depthCurve = flat(1);
  lock.depthCurveSecondary = flat(1);
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  assert.ok(tier, "fixture 必须有覆盖叶 1..2 的中间层");
  setPanelBoneGroupValue(lock, tier, "depthCurve", ramp(0.2, 1.8));
  setPanelBoneGroupValue(lock, tier, "depthCurveSecondary", ramp(0.2, 1.8));

  const geometry = panel.createPanelStrandGeometry(lock);
  const positions = geometry.getAttribute("position").array;
  const rows = geometry.userData.gridRowIndices;
  const cols = geometry.userData.gridColIndices;
  const count = geometry.getAttribute("position").count;
  const lengthLoops = lock.panelLengthLoops;

  // 叶 1（中间层 [1,2] 覆盖的段之一）在最后一行（t=1，ramp(0.2,1.8) 处应为 1.8）附近
  // 找一对同 (row, logicalColumn) 的 front/back 顶点，量它们的间距。segment 0（不在
  // 中间层覆盖范围内）应保持 lock 全局值 1，用作负向对照——两段厚度必须不同，否则
  // 本判据无法区分「只有部分段接了链」这类漏改。
  const front = new Map();
  const back = new Map();
  for (let vertex = 0; vertex < count; vertex += 1) {
    const row = rows[vertex];
    if (row < 0) continue;
    const key = `${row}:${Math.floor(cols[vertex] / 2)}`;
    (cols[vertex] % 2 === 1 ? front : back).set(key, new THREE.Vector3(
      positions[vertex * 3], positions[vertex * 3 + 1], positions[vertex * 3 + 2]
    ));
  }
  const targetRow = lengthLoops; // t = 1 ⇒ ramp(0.2,1.8) = 1.8
  const expectedTier = Number(lock.panelThickness) * 1.8;
  const expectedUnaffected = Number(lock.panelThickness) * 1; // segment 0：lock 全局值
  let tierChecked = 0;
  let controlChecked = 0;
  for (const [key, f] of front) {
    if (!key.startsWith(`${targetRow}:`)) continue;
    const b = back.get(key);
    if (!b) continue;
    const separation = f.distanceTo(b);
    // 容差用 1e-4：网格路径经过 BufferAttribute（Float32Array）与逐行插值，精度低于
    // tipMainSectionPoint 的 float64 直算（同类容差先例见 panel-scalp-conform.test.mjs）。
    if (Math.abs(separation - expectedTier) < 1e-4) {
      tierChecked += 1;
    } else if (Math.abs(separation - expectedUnaffected) < 1e-4) {
      controlChecked += 1;
    } else {
      assert.fail(`row ${targetRow} 顶点厚度 ${separation} 既不等于中间层创作值 ${expectedTier} 也不等于对照值 ${expectedUnaffected}`);
    }
  }
  assert.ok(tierChecked > 0, "sanity：确实找到了中间层覆盖段（叶 1/2）的顶点对，厚度应为创作值");
  assert.ok(controlChecked > 0, "sanity：确实找到了未被中间层覆盖的段（叶 0）的顶点对，厚度应保持 lock 全局值——负向对照");
});

// ---------------------------------------------------------------------------
// ★ 接线断言（源码级）：两个读取点都必须走 panelTierCurveFallback，不能只改一处。
// 只改一处会造成「把手用了层级值、网格没用」（或反过来）的新错位——这条直接钉住两处
// 调用点的源码文本，比数值判据更早发现「漏改一处」这类回归。
// ---------------------------------------------------------------------------
test("接线：tipMainSectionPoint 与 panelThicknessAt 两处都必须调用 panelTierCurveFallback(..., \"depthCurve\")", () => {
  const src = readFileSync(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");

  const sectionAt = src.indexOf("function tipMainSectionPoint(");
  assert.notEqual(sectionAt, -1, "找不到 tipMainSectionPoint");
  const sectionBody = src.slice(sectionAt, src.indexOf("\n}", sectionAt));
  assert.match(
    sectionBody,
    /bone\?\.depthCurve \|\| panelTierCurveFallback\(lock, segmentIndex, "depthCurve"\)/,
    "tipMainSectionPoint 必须把 depthCurve 接到 panelTierCurveFallback"
  );
  assert.match(
    sectionBody,
    /bone\?\.depthCurveSecondary \|\| panelTierCurveFallback\(lock, segmentIndex, "depthCurveSecondary"\)/,
    "tipMainSectionPoint 必须把 depthCurveSecondary 接到 panelTierCurveFallback"
  );

  const thicknessAt = src.indexOf("const panelThicknessAt = ");
  assert.notEqual(thicknessAt, -1, "找不到 panelThicknessAt");
  const thicknessBody = src.slice(thicknessAt, src.indexOf("\n  };", thicknessAt));
  assert.match(
    thicknessBody,
    /bone\?\.depthCurve \|\| panelTierCurveFallback\(lock, segment, "depthCurve"\)/,
    "panelThicknessAt（网格路径）必须把 depthCurve 接到 panelTierCurveFallback"
  );
  assert.match(
    thicknessBody,
    /bone\?\.depthCurveSecondary \|\| panelTierCurveFallback\(lock, segment, "depthCurveSecondary"\)/,
    "panelThicknessAt（网格路径）必须把 depthCurveSecondary 接到 panelTierCurveFallback"
  );
});
