// tier-depth-curve-wiring.test.mjs — depth 恒读第 0 层（lock 级）的接线断言
// （0.2.183 对 0.2.175 的刻意收回）。
//
// 背景：0.2.175 曾把 depthCurve/depthCurveSecondary 接进 panelTierCurve 的三级回落
// （叶子自己的值 → 沿分组链向上找第一个非 null 祖先 → lock[key] 全局曲线），理由是
// 「taperCurve（宽度）接了这条链，depthCurve（深度）没接会显得错位」。
//
// 0.2.183 判定那个前提本身不对，**刻意收回**：用户拍板原话逐字——
// 「DepthCurve可以仅主骨骼(第0层)拥有(特殊判别), 剩下的保持现状即可」
// 「曲线保持原状, 扫掠横截面整体直接由层0决定」
// ⇒ 深度是**整片发片的属性**，宽度才是分段的；两者「接不接链」本该不同，不是同一件事
// 的两半。panelThicknessAt（网格侧，约 :1682）与 tipMainSectionPoint（把手侧，约 :921，
// 它是「给把手复刻网格用的」）现在都**直读 `lock.depthCurve` / `lock.depthCurveSecondary`**，
// 不再调用 panelTierCurve。
//
// ⚠ 本文件现在守的是这个新口径，且**专门挡「修复回去」**：下一轮如果有人觉得「中间层
// 创作了 depthCurve 却没生效」是 bug 想把它接回三级回落 —— 那正是 0.2.175 的旧口径，
// 已被用户拍板否决，不要「修好」它。数据侧没有变：depthCurve/depthCurveSecondary 仍在
// AUTHORABLE_KEYS 白名单里，叶子的 bone.depthCurve 也不删（「曲线保持原状」）——只是
// 横截面消费点不再看它们。
//
// 本文件照抄 tests/tier-width-curve-wiring.test.mjs 的 harness（taperCurve 走三级回落
// 的那份测试），把断言对象换成 tipMainSectionPoint / createPanelStrandGeometry 里
// 读 depthCurve 的两个点（发尖把手 / 网格厚度），但断言方向与它相反：taperCurve 那份
// 测的是「必须走链」，这里测的是「必须不走链、恒读第 0 层」。
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
// 1. ★ 核心：即使中间层创作了 depthCurve，tipMainSectionPoint（发尖把手的厚度采样点）
//    也必须读 lock 级（第 0 层）的曲线值，不能穿透到中间层创作值——0.2.183 拍板深度
//    恒由第 0 层决定，中间层创作 depthCurve 不应改变横截面厚度。
//
//    ⚠ 分辨力要求：若 lock.depthCurve 是平直曲线（乘数恒为 1），厚度会等于
//    baseThickness 默认值——那与「读错层」的失效模式（读到中间层创作值）在很多 t 上
//    可能撞在一起，判据会退化。所以这里给 lock 级设一条与中间层创作值不同、有梯度的
//    ramp 曲线（理由见文件头 :33-35 的注释），断言厚度等于 lock ramp 的值，且与中间层
//    ramp 的值在采样点上显著不同。
// ---------------------------------------------------------------------------
test("核心：中间层创作 depthCurve 后，把手采样仍恒读 lock 级曲线，不落到中间层创作值", () => {
  const { panel, lock } = harness();
  const splits = SPLITS();
  // lock 级设一条有梯度的 ramp（不是平直曲线），与中间层创作值区分开。
  lock.depthCurve = ramp(0.2, 1.0);
  lock.depthCurveSecondary = ramp(0.2, 1.0);
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  assert.ok(tier, "fixture 必须有覆盖叶 1..2 的中间层");

  // 叶 1 段（segmentIndex = 1）：中间层创作一条与 lock 级不同的 ramp。
  setPanelBoneGroupValue(lock, tier, "depthCurve", ramp(0.2, 1.8));
  setPanelBoneGroupValue(lock, tier, "depthCurveSecondary", ramp(0.2, 1.8));

  const t = 0.7;
  const front = panel.tipMainSectionPoint(lock, t, 0, 1, null, 1, splits);
  const back = panel.tipMainSectionPoint(lock, t, 0, -1, null, 1, splits);
  const thicknessFromHandles = front.distanceTo(back);

  const lockMultiplier = 0.2 + 0.7 * 0.8; // lock ramp(0.2,1.0) 在 t=0.7 处的值 = 0.76
  const tierMultiplier = 0.2 + 0.7 * 1.6; // 中间层 ramp(0.2,1.8) 在 t=0.7 处的值 = 1.32
  const expectedThickness = Number(lock.panelThickness) * lockMultiplier;
  const wrongThickness = Number(lock.panelThickness) * tierMultiplier;
  assert.ok(
    Math.abs(thicknessFromHandles - expectedThickness) < 1e-6,
    `把手厚度应等于 lock 级曲线值 ${expectedThickness}（乘数 ${lockMultiplier}），实测 ${thicknessFromHandles}`
  );
  assert.ok(
    Math.abs(thicknessFromHandles - wrongThickness) > 1e-3,
    `把手厚度不应落到中间层创作值 ${wrongThickness}（乘数 ${tierMultiplier}），实测 ${thicknessFromHandles} 与它太接近`
  );

  // sanity：两个乘数本身必须显著不同，否则本判据没有分辨力（撞在一起分不出读的是哪一层）。
  assert.ok(
    Math.abs(lockMultiplier - tierMultiplier) > 0.1,
    `sanity：lock 级乘数 ${lockMultiplier} 与中间层创作乘数 ${tierMultiplier} 必须显著不同，否则本判据无分辨力`
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
//    （tipMainSectionPoint）走同一口径——即使中间层创作了 depthCurve，网格顶点厚度
//    也必须由 lock 级曲线决定，中间层覆盖段与未覆盖段的厚度应**相同**（都是 lock 值）。
//    本测试直接量网格顶点厚度（front/back 壳间距），不经过把手侧的任何代码。
// ---------------------------------------------------------------------------
test("网格路径：createPanelStrandGeometry 的段厚度恒由 lock 级 depthCurve 决定，不读中间层创作值", () => {
  const { panel, lock } = harness();
  lock.panelLengthLoops = 4;
  lock.panelWidthLoops = 6;
  // lock 级设一条有梯度的 ramp，避免常量曲线掩盖「用错了层」这类失效模式。
  lock.depthCurve = ramp(0.2, 1.0);
  lock.depthCurveSecondary = ramp(0.2, 1.0);
  materializePanelBoneGroups(lock);
  const tier = tierPathFor(lock, 1, 2);
  assert.ok(tier, "fixture 必须有覆盖叶 1..2 的中间层");
  setPanelBoneGroupValue(lock, tier, "depthCurve", ramp(0.2, 1.8));
  setPanelBoneGroupValue(lock, tier, "depthCurveSecondary", ramp(0.2, 1.8));

  const geometry = panel.createPanelStrandGeometry(lock);
  const positions = geometry.getAttribute("position").array;
  const rows = geometry.userData.gridRowIndices;
  const cols = geometry.userData.gridColIndices;
  const weights = geometry.userData.panelWeights;
  const count = geometry.getAttribute("position").count;
  const lengthLoops = lock.panelLengthLoops;

  // 叶 1（中间层 [1,2] 覆盖的段之一）在最后一行（t=1）附近找一对同 (row, logicalColumn)
  // 的 front/back 顶点，量它们的间距，并用 panelWeights 的 segmentIndex 分辨该顶点属于
  // 哪一段——覆盖段（segIdx 1，中间层创作过 depthCurve）与未覆盖段（segIdx 0，叶子从未
  // 创作过）在这个口径下厚度必须相同（都由 lock 级曲线决定），这就是 sanity：既要真的
  // 找到了中间层覆盖段的顶点对（防止循环空转导致断言假绿），也要证明它没有被单独放大。
  const front = new Map();
  const back = new Map();
  const segAt = new Map();
  for (let vertex = 0; vertex < count; vertex += 1) {
    const row = rows[vertex];
    if (row < 0) continue;
    const key = `${row}:${Math.floor(cols[vertex] / 2)}`;
    (cols[vertex] % 2 === 1 ? front : back).set(key, new THREE.Vector3(
      positions[vertex * 3], positions[vertex * 3 + 1], positions[vertex * 3 + 2]
    ));
    segAt.set(key, weights[vertex * 3 + 1]);
  }
  const targetRow = lengthLoops; // t = 1 ⇒ lock ramp(0.2,1.0) = 1.0
  const expectedLock = Number(lock.panelThickness) * 1.0;
  const wrongTierAuthored = Number(lock.panelThickness) * 1.8; // 中间层创作值在 t=1 处
  let tierSegChecked = 0;
  let otherSegChecked = 0;
  for (const [key, f] of front) {
    if (!key.startsWith(`${targetRow}:`)) continue;
    const b = back.get(key);
    if (!b) continue;
    const separation = f.distanceTo(b);
    const seg = segAt.get(key);
    // 容差用 1e-4：网格路径经过 BufferAttribute（Float32Array）与逐行插值，精度低于
    // tipMainSectionPoint 的 float64 直算（同类容差先例见 panel-scalp-conform.test.mjs）。
    assert.ok(
      Math.abs(separation - expectedLock) < 1e-4,
      `row ${targetRow} seg ${seg} 顶点厚度 ${separation} 应等于 lock 级曲线值 ${expectedLock}`
    );
    assert.ok(
      Math.abs(separation - wrongTierAuthored) > 1e-3,
      `row ${targetRow} seg ${seg} 顶点厚度 ${separation} 不应落到中间层创作值 ${wrongTierAuthored}`
    );
    if (seg === 1) tierSegChecked += 1; else otherSegChecked += 1;
  }
  assert.ok(tierSegChecked > 0, "sanity：确实找到了中间层覆盖段（叶 1，segIdx 1）的顶点对");
  assert.ok(otherSegChecked > 0, "sanity：确实找到了未被中间层覆盖的段（叶 0，segIdx 0）的顶点对");
});

// ---------------------------------------------------------------------------
// ★ 接线断言（源码级，反转）：两个读取点都**不得**调用三级取值入口 panelTierCurve(...,
// "depthCurve")，必须直读 lock.depthCurve / lock.depthCurveSecondary——0.2.183 刻意把
// depth 从三级回落收回到恒读第 0 层。这条钉住两处调用点的源码文本，防的是「下一轮
// 又有人把 depth 接回三级回落」（0.2.175 的旧口径，已被用户拍板否决）。
//
// ⚠ 匹配陷阱：panelThicknessAt 上方有一段长注释，字面出现了 `panelTierCurve` 这个词
// （警告「把这里改回 panelTierCurve 会让…」）——正则若不排除注释会在当前文件上假阳性
// 命中。做法：先剥掉每行的 `//` 行注释再匹配。下面对当前文件与旧写法各跑一次，两个
// 方向都要验证：对当前文件必须「不命中」，对旧写法必须「命中」。
// ---------------------------------------------------------------------------
test("接线：tipMainSectionPoint 与 panelThicknessAt 两处都必须直读 lock.depthCurve，不得调用 panelTierCurve", () => {
  const src = readFileSync(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");
  // 剥掉行注释（// 开头到行尾），避免警告注释里字面出现的 panelTierCurve 造成假阳性。
  const stripLineComments = (text) => text.split("\n").map((line) => line.replace(/\/\/.*$/, "")).join("\n");

  const sectionAt = src.indexOf("function tipMainSectionPoint(");
  assert.notEqual(sectionAt, -1, "找不到 tipMainSectionPoint");
  const sectionBody = stripLineComments(src.slice(sectionAt, src.indexOf("\n}", sectionAt)));
  assert.doesNotMatch(
    sectionBody,
    /panelTierCurve\(lock,\s*bone,\s*segmentIndex,\s*"depthCurve"\)/,
    "tipMainSectionPoint 不得再把 depthCurve 接到三级回落入口 panelTierCurve"
  );
  assert.doesNotMatch(
    sectionBody,
    /panelTierCurve\(lock,\s*bone,\s*segmentIndex,\s*"depthCurveSecondary"\)/,
    "tipMainSectionPoint 不得再把 depthCurveSecondary 接到三级回落入口 panelTierCurve"
  );
  assert.match(
    sectionBody,
    /lock\.depthCurve\b/,
    "tipMainSectionPoint 必须直读 lock.depthCurve"
  );
  assert.match(
    sectionBody,
    /lock\.depthCurveSecondary\b/,
    "tipMainSectionPoint 必须直读 lock.depthCurveSecondary"
  );

  const thicknessAt = src.indexOf("const panelThicknessAt = ");
  assert.notEqual(thicknessAt, -1, "找不到 panelThicknessAt");
  const thicknessBody = stripLineComments(src.slice(thicknessAt, src.indexOf("\n  };", thicknessAt)));
  assert.doesNotMatch(
    thicknessBody,
    /panelTierCurve\(lock,\s*bone,\s*segment,\s*"depthCurve"\)/,
    "panelThicknessAt（网格路径）不得再把 depthCurve 接到三级回落入口 panelTierCurve"
  );
  assert.doesNotMatch(
    thicknessBody,
    /panelTierCurve\(lock,\s*bone,\s*segment,\s*"depthCurveSecondary"\)/,
    "panelThicknessAt（网格路径）不得再把 depthCurveSecondary 接到三级回落入口 panelTierCurve"
  );
  assert.match(
    thicknessBody,
    /lock\.depthCurve\b/,
    "panelThicknessAt 必须直读 lock.depthCurve"
  );
  assert.match(
    thicknessBody,
    /lock\.depthCurveSecondary\b/,
    "panelThicknessAt 必须直读 lock.depthCurveSecondary"
  );
});

// ---------------------------------------------------------------------------
// ★ 双向验证（针对上面这条正则本身）：证明它对当前文件确实「不命中」、对旧写法
// （0.2.175 的三级回落写法）确实「命中」——否则正则本身可能写错而从未真正生效。
// 这条不是测生产代码，是测上面那条断言用的正则/剥注释逻辑本身。
// ---------------------------------------------------------------------------
test("双向验证：源码断言的正则对当前文件不命中、对旧写法（panelTierCurve）命中", () => {
  const src = readFileSync(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");
  const stripLineComments = (text) => text.split("\n").map((line) => line.replace(/\/\/.*$/, "")).join("\n");
  const reTierPrimary = (varName) => new RegExp(`panelTierCurve\\(lock,\\s*bone,\\s*${varName},\\s*"depthCurve"\\)`);
  const reTierSecondary = (varName) => new RegExp(`panelTierCurve\\(lock,\\s*bone,\\s*${varName},\\s*"depthCurveSecondary"\\)`);

  const sectionAt = src.indexOf("function tipMainSectionPoint(");
  const sectionBody = stripLineComments(src.slice(sectionAt, src.indexOf("\n}", sectionAt)));
  const thicknessAt = src.indexOf("const panelThicknessAt = ");
  const thicknessBody = stripLineComments(src.slice(thicknessAt, src.indexOf("\n  };", thicknessAt)));

  // 方向一：对当前文件必须不命中。
  assert.doesNotMatch(sectionBody, reTierPrimary("segmentIndex"), "当前文件的 section 不应命中旧写法正则");
  assert.doesNotMatch(thicknessBody, reTierPrimary("segment"), "当前文件的 thickness 不应命中旧写法正则");

  // 方向二：对旧写法（0.2.175 的三级回落）合成文本必须命中。
  const oldSectionSynthetic = stripLineComments(`function tipMainSectionPoint(lock, t, u, shell, bone, segmentIndex = -1, splits = null) {
    const thickness = Math.max(0.0001, Number(lock.panelThickness ?? 0.08) * sampleAsymmetricTaperCurve(
      panelTierCurve(lock, bone, segmentIndex, "depthCurve"),
      panelTierCurve(lock, bone, segmentIndex, "depthCurveSecondary"),
      bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve,
      shell,
      t
    ));
  }`);
  const oldThicknessSynthetic = stripLineComments(`const panelThicknessAt = (t, side, bone, segment = -1) => {
    return Math.max(0.0001, baseThickness * sampleAsymmetricTaperCurve(
      panelTierCurve(lock, bone, segment, "depthCurve"),
      panelTierCurve(lock, bone, segment, "depthCurveSecondary"),
      bone?.asymmetricDepthCurve ?? lock.asymmetricDepthCurve,
      side,
      t
    ));
  };`);
  assert.match(oldSectionSynthetic, reTierPrimary("segmentIndex"), "旧写法合成文本必须命中正则（否则正则从未真正生效）");
  assert.match(oldSectionSynthetic, reTierSecondary("segmentIndex"), "旧写法合成文本必须命中 secondary 正则");
  assert.match(oldThicknessSynthetic, reTierPrimary("segment"), "旧写法合成文本必须命中正则（否则正则从未真正生效）");
  assert.match(oldThicknessSynthetic, reTierSecondary("segment"), "旧写法合成文本必须命中 secondary 正则");
});
