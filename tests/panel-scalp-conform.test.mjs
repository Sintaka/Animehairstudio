// panel-scalp-conform.test.mjs — 面板「贴合头皮」Scalp Conform 回归（0.2.136）。
//
// 本文件**替换** panel-hemisphere-deform.test.mjs：那份针对 0.2.134/0.2.135 的
// 「沿面板法线的球冠 + 两侧后移」模型，已被世界空间收缩包裹取代。机械改名会留下
// 「看起来在测新模型、实则断言旧公式」的假绿，故整份重写。
//
// 用户诊断（驱动本次替换）：「可能不能简单根据法线去弯折一个刘海, 因为那终究是单个刘海,
// 而非用户想贴着头皮的前额部分去弯折, 导致刘海会拱起来而且后推的边缘并没有很好的贴近
// 它该有的位置」。根因：旧模型位移是沿 frame.z 的**局部**标量，不知道头皮在世界哪里。
//
// 断言围绕五条不变式：
//   ① amount == 0 ⇒ 顶点逐位守恒（先例：SWEEP_OVERLAP_DEFAULTS「关到 0 逐位守恒」）
//   ② row 0 **永不移动**（UV 红线 + 发根锚在头皮，见 AGENT_QUICKSTART.md §2.4b）
//   ③ amount == 1 ⇒ 顶点**精确**落在「头部代理表面 + gap」上（可独立验证的几何事实，
//      不是复述公式：球代理下就是 |v − center| == radius + gap）
//   ④ **面板厚度守恒** —— 两壳拿同一份 delta（若各自朝表面收，厚度会被压成 0）
//   ⑤ 代理跟随真实头皮（注入的 scalpSurface），不是写死常数
// 期望值一律按被测的同一函数/常量推导，不写死现场数值（development-standards.md
// 「验收脚本与真实存档解耦」）。
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import {
  PANEL_SCALP_CONFORM_DEFAULTS,
  PANEL_SCALP_CONFORM_MAX_RANGE,
  capsuleEndNearestSurface,
  panelScalpConformWeight
} from "../modules/geometry/curve-math.js";

const LENGTH_LOOPS = 10;
const WIDTH_LOOPS = 6;
const PANEL_WIDTH = 0.62;
// 球代理（scaleXYZ 全 1）⇒ 「离表面 gap」可用 |v − center| == radius + gap 独立验证。
const SPHERE_PROXY = { x: 0, y: 0.9, z: 0, radius: 1, scaleX: 1, scaleY: 1, scaleZ: 1 };
// 非均匀椭球：用于验证代理确实跟随 scalpSurface 的每个轴。
const ELLIPSOID_PROXY = { x: 0.1, y: 0.9, z: 0, radius: 1, scaleX: 1.2, scaleY: 0.9, scaleZ: 1.1 };

// 发尖 taper 收到 0 的构型：AGENT_QUICKSTART.md §2.4b 要求 fixture 至少有一个这样的
// 构型，否则「t=1 处几何量退化成一个点」这类 bug 在 node 侧永远绿。
const TAPER_TO_ZERO = [
  { position: 0, value: 1, interpolation: "linear" },
  { position: 1, value: 0, interpolation: "linear" }
];
const CONSTANT_CURVE = [
  { position: 0, value: 1, interpolation: "linear" },
  { position: 1, value: 1, interpolation: "linear" }
];
// 面板放在头前方 z = 1.5（球代理表面在 z = 1）⇒ 起始就在代理**外面** 0.5，收缩必须把它
// 拉回来。这是用户场景的最小复现：「很平的 panel 刘海在额前」。
function panelLock(overrides = {}) {
  return {
    id: "conform-panel",
    geometryType: "panel",
    width: PANEL_WIDTH,
    panelThickness: 0.08,
    panelLengthLoops: LENGTH_LOOPS,
    panelWidthLoops: WIDTH_LOOPS,
    panelCurvature: 0.18,
    panelLeftEdgeTrim: 0,
    panelRightEdgeTrim: 0,
    panelTipCurve: 0,
    panelTipLoops: 0,
    panelSplitEnabled: false,
    panelSplits: [],
    panelSplitHeight: 0.3,
    taperCurve: TAPER_TO_ZERO.map((point) => ({ ...point })),
    taperCurveSecondary: TAPER_TO_ZERO.map((point) => ({ ...point })),
    depthCurve: CONSTANT_CURVE.map((point) => ({ ...point })),
    depthCurveSecondary: CONSTANT_CURVE.map((point) => ({ ...point })),
    points: [
      { x: 0, y: 1.7, z: 1.5 },
      { x: 0, y: 1.2, z: 1.5 },
      { x: 0, y: 0.7, z: 1.5 }
    ],
    ...overrides
  };
}

// 直链 + 固定正交 frame ⇒ frame.z 恒为世界 +Z。收缩位移是**世界向量**（不再是沿 frame.z
// 的标量），所以判据直接看世界坐标，不必反解 frame。
function panelApi(lock, proxy = SPHERE_PROXY) {
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  return createPanelTipStrandApi({
    strandGeometryCurve: () => curve,
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    normalizePanelSplits: (value) => (Array.isArray(value) ? value.map((split) => ({ ...split })) : []),
    clonePanelSplits: (value) => (Array.isArray(value) ? value.map((split) => ({ ...split })) : []),
    // 0.2.136：头部代理来自注入的真实头皮状态（不是几何层写死的常数）。
    scalpSurface: proxy,
    sculptState: {}
  });
}

function buildPanel(lock, proxy = SPHERE_PROXY) {
  const geometry = panelApi(lock, proxy).createPanelStrandGeometry(lock);
  return {
    positions: Array.from(geometry.getAttribute("position").array),
    rows: Array.from(geometry.userData.gridRowIndices),
    cols: Array.from(geometry.userData.gridColIndices),
    count: geometry.getAttribute("position").count
  };
}

const vertexAt = (built, index) => ({
  x: built.positions[index * 3],
  y: built.positions[index * 3 + 1],
  z: built.positions[index * 3 + 2]
});
test("Capsule 一端：y≥0 是半球、中段是圆柱、轴下方又是半球", () => {
  const cylinder = 1;
  // ① y ≥ 0 ⇒ 轴上最近点是原点 ⇒ 单位球面（半球）
  for (const [x, y, z] of [[0, 2, 0], [1, 1, 0], [0, 0.5, 1]]) {
    const near = capsuleEndNearestSurface(x, y, z, cylinder);
    assert.equal(near.axis.y, 0, "y≥0 时轴上最近点必须是原点");
    const r = Math.hypot(near.surface.x, near.surface.y, near.surface.z);
    assert.ok(Math.abs(r - 1) < 1e-12, `半球区表面点必须在单位球上，实测 |v|=${r}`);
  }
  // ② −cylinder < y < 0 ⇒ 圆柱段：表面点与查询点**同 y**，径向只在 xz 内
  //    （这正是"长发直着垂下、不朝下巴底下卷"的几何依据）
  for (const y of [-0.2, -0.5, -0.9]) {
    const near = capsuleEndNearestSurface(0, y, 1.4, cylinder);
    assert.ok(Math.abs(near.axis.y - y) < 1e-12, `圆柱段轴上最近点必须与查询点同 y：y=${y}`);
    assert.ok(Math.abs(near.surface.y - y) < 1e-12, `圆柱段表面点必须与查询点同 y：y=${y}`);
    const rxz = Math.hypot(near.surface.x, near.surface.z);
    assert.ok(Math.abs(rxz - 1) < 1e-12, `圆柱段 xz 半径必须为 1，实测 ${rxz}`);
  }
  // ③ y < −cylinder ⇒ 轴末端 ⇒ 又是半球（下方收口）
  const below = capsuleEndNearestSurface(0, -2, 0.5, cylinder);
  assert.ok(Math.abs(below.axis.y + cylinder) < 1e-12, "轴下方最近点必须钳在轴末端");
  // ④ cylinder = 0 ⇒ 退化为纯球（轴长 0）
  for (const y of [-1, -0.3, 0.5]) {
    assert.equal(capsuleEndNearestSurface(0, y, 1, 0).axis.y, 0, "cylinder=0 必须退化为纯球");
  }
  // ⑤ 点恰在轴上（径向无定义）⇒ 取 +z（面部朝向），不是 NaN
  const degenerate = capsuleEndNearestSurface(0, -0.5, 0, cylinder);
  assert.ok(Number.isFinite(degenerate.surface.x + degenerate.surface.y + degenerate.surface.z));
  assert.ok(Math.abs(degenerate.surface.z - 1) < 1e-12, "轴上退化情形必须朝 +z 推出");
});

test("收缩权重：t==0 恒为 0（UV 红线），随 t 单调不减，range 越小收得越快", () => {
  for (const range of [0.05, 0.1, 0.15, PANEL_SCALP_CONFORM_MAX_RANGE]) {
    assert.equal(panelScalpConformWeight(0, range), 0, `t=0 必须恒为 0：range=${range}`);
    let previous = -Infinity;
    for (let step = 0; step <= 40; step += 1) {
      const value = panelScalpConformWeight(step / 40, range);
      assert.ok(value >= previous - 1e-12, `权重必须单调不减：t=${step / 40}`);
      assert.ok(value >= 0 && value <= 1, `权重必须落在 [0,1]：得到 ${value}`);
      previous = value;
    }
    assert.ok(Math.abs(panelScalpConformWeight(1, range) - 1) < 1e-12, "t=1 必须收满");
  }
  // range 越小 ⇒ 同一 t 处权重越大（收得越快）。负向对照：若忽略 range 则两者相等。
  assert.ok(
    panelScalpConformWeight(0.1, 0.1) > panelScalpConformWeight(0.1, PANEL_SCALP_CONFORM_MAX_RANGE),
    "range 小必须在同一 t 处收得更多"
  );
  // **range 必须被钳到 MAX_RANGE**：超过上限的值（0.2.136 初版上限是 1）会让半张面板停在
  // 部分贴合的中间态、鼓出一个包 —— 这是用户报告的"诡异挤压"的直接成因。
  assert.equal(
    panelScalpConformWeight(0.4, PANEL_SCALP_CONFORM_MAX_RANGE),
    panelScalpConformWeight(0.4, 1),
    "超过 MAX_RANGE 的 range 必须与 MAX_RANGE 等效（已钳位）"
  );
  assert.equal(panelScalpConformWeight(0.4, 0.91), panelScalpConformWeight(0.4, PANEL_SCALP_CONFORM_MAX_RANGE));
});
test("amount == 0 ⇒ 顶点位置逐位守恒（含其余三参数被改动的情况）", () => {
  const baseline = buildPanel(panelLock());
  for (const overrides of [
    {},
    { panelScalpConformRange: 0.2 },
    { panelScalpConformGap: 0.4 },
    { panelScalpConformCylinder: 3 },
    { panelScalpConformRange: 1, panelScalpConformGap: 0.5, panelScalpConformCylinder: 2.5 }
  ]) {
    const probe = buildPanel(panelLock({ panelScalpConformAmount: 0, ...overrides }));
    assert.equal(probe.count, baseline.count);
    for (let i = 0; i < baseline.positions.length; i += 1) {
      assert.ok(
        Object.is(probe.positions[i], baseline.positions[i]),
        `amount=0 必须逐位守恒（${JSON.stringify(overrides)}）：索引 ${i}`
      );
    }
  }
});

test("row 0 顶点对任意参数逐位不动（UV 红线 + 发根锚在头皮）", () => {
  const baseline = buildPanel(panelLock());
  let rowZeroChecked = 0;
  for (const overrides of [
    { panelScalpConformAmount: 1 },
    { panelScalpConformAmount: -1 },
    { panelScalpConformAmount: 1, panelScalpConformRange: 0.05 }, // 最恶劣：立刻收满
    { panelScalpConformAmount: 1, panelScalpConformGap: 0.5, panelScalpConformCylinder: 3 },
    { panelScalpConformAmount: 0.5, panelScalpConformRange: 1 }
  ]) {
    const probe = buildPanel(panelLock(overrides));
    for (let vertex = 0; vertex < baseline.count; vertex += 1) {
      if (baseline.rows[vertex] !== 0) continue;
      for (let axis = 0; axis < 3; axis += 1) {
        const index = vertex * 3 + axis;
        assert.ok(
          Object.is(probe.positions[index], baseline.positions[index]),
          `row 0 必须逐位不动（${JSON.stringify(overrides)}）：顶点 ${vertex} 轴 ${axis}`
        );
      }
      rowZeroChecked += 1;
    }
  }
  assert.ok(rowZeroChecked > 0, "sanity：确实比较过 row 0 顶点");
});

test("amount == 1 ⇒ 发尖行精确落在「球代理表面 + gap」上（独立几何事实）", () => {
  const gap = 0.05;
  // cylinder = 0 ⇒ 代理是**纯球** ⇒ 判据可写成 |v − center| == radius + gap，
  // 这是独立于被测公式的几何事实，不是复述实现。
  const probe = buildPanel(panelLock({
    panelScalpConformAmount: 1,
    panelScalpConformGap: gap,
    panelScalpConformCylinder: 0,
    panelScalpConformRange: PANEL_SCALP_CONFORM_MAX_RANGE
  }));
  const expected = SPHERE_PROXY.radius + gap;
  const center = new THREE.Vector3(SPHERE_PROXY.x, SPHERE_PROXY.y, SPHERE_PROXY.z);
  let checked = 0;
  let worst = 0;
  for (let vertex = 0; vertex < probe.count; vertex += 1) {
    // 只查权重已收满的行（t ≥ range ⇒ weight == 1）。row/LENGTH_LOOPS 是该行的 t。
    if (probe.rows[vertex] / LENGTH_LOOPS < PANEL_SCALP_CONFORM_MAX_RANGE) continue;
    const v = vertexAt(probe, vertex);
    const distance = new THREE.Vector3(v.x, v.y, v.z).sub(center).length();
    worst = Math.max(worst, Math.abs(distance - expected));
    checked += 1;
  }
  assert.ok(checked > 0, "sanity：确实查到了收满的行");
  // Float32 存储 ⇒ 1e-5 绝对容差（半径量级 1.05）。厚度沿代理径向 ⇒ 两壳距离不同，
  // 所以这里只查中面无法做到；改为断言**front 壳**落点，见下一条厚度守恒测试。
  assert.ok(worst < 0.06, `收满行必须贴到 radius+gap 附近，最大偏差 ${worst}`);
});
// 上一条只能给出宽容差（两壳沿代理径向分居厚度两侧）。**中面**才是精确落点，而
// tipMainSectionPoint(shell = 0) 正是暴露出来的中面 API ⇒ 这条是真正的恒等式判据。
test("amount == 1 ⇒ 中面精确落在「球代理表面 + gap」上（恒等式，容差 1e-12）", () => {
  const gap = 0.05;
  const lock = panelLock({
    panelScalpConformAmount: 1,
    panelScalpConformGap: gap,
    panelScalpConformCylinder: 0,
    panelScalpConformRange: PANEL_SCALP_CONFORM_MAX_RANGE
  });
  const api = panelApi(lock);
  const expected = SPHERE_PROXY.radius + gap;
  const center = new THREE.Vector3(SPHERE_PROXY.x, SPHERE_PROXY.y, SPHERE_PROXY.z);
  let worst = 0;
  let checked = 0;
  for (const t of [0.5, 0.65, 0.8, 1]) { // 全部 ≥ range ⇒ weight == 1
    for (const u of [-1, -0.5, 0, 0.5, 1]) {
      const mid = api.tipMainSectionPoint(lock, t, u, 0, null, -1, null);
      worst = Math.max(worst, Math.abs(mid.clone().sub(center).length() - expected));
      checked += 1;
    }
  }
  assert.ok(checked > 0, "sanity：确实采过中面点");
  // 纯 float64 路径（未经 Float32Array 存储）⇒ 这是恒等式，用 1e-12 而非 1e-6。
  assert.ok(worst < 1e-12, `中面必须精确落在 radius+gap 上，最大偏差 ${worst.toExponential(3)}`);
});

// ── 0.2.137：中段不得鼓包（用户报告的"根部附近诡异挤压"的直接回归）──────────────
// **为什么判据是"剖面无内部极大值"而不是"距离在合理区间内"**：位移是 flat 与 target 之间的
// 线性插值，所以鼓包时的 1.42 **本来就落在** flat(1.50) 与 target(1.155) 之间 —— 区间判据
// 抓不到。真正的病征是**形状**：clearance 沿 t 先升到一个峰再落回去（糖纹褶皱），而
// flat 剖面本身是单调的、target 是常数。所以判据 = 方向反转次数不得超过 flat 剖面。
//
// 成因（已修）：`range`（Root Release）曾被设计成"艺术衰减"、上限 1、默认 0.6。ramp 跨度内
// 的行处于**部分贴合**，顶点落在「原始构型」与「裹住头的构型」之间，而两者差异极大 ⇒
// 中间态不在任何光滑曲面上。实测：range 0.91 ⇒ 峰值偏离目标 0.267；range ≤0.25 ⇒ ≤0.093。
test("中段不得鼓包：clearance 超出 gap 的幅度 < flat 跨度的 10%（宽面板，amount=1）", () => {
  // fixture 必须复刻用户 repro 的**三个**关键性质，缺一则鼓包不出现、这条测试就变成空转
  // （本测试初版只满足前两条，实测**在 bug 存在时也通过** —— 用变异测试抓到的）：
  //   ① 很宽（远大于头径）；
  //   ② 授权曲线逐渐远离头部（根部近、发尖远）；
  //   ③ **clearance 的上升是"前重"的** —— 前 1/3 就涨掉大半，之后趋平。
  // ③ 才是鼓包的成因：conformed = flat + (gap − flat)·w，早期 w 还小 ⇒ conformed 跟着
  // flat 猛涨；等 w 追上来才被拽回 gap ⇒ 中途出现一个局部极大。若 flat 匀速上升，
  // 两个效应互相抵消、剖面保持单调，鼓包不会显形。
  // 点位按球坐标构造（头心 (0,0.9,0)、R=1）：φ 从 25° 扫到 115°，clearance 0.02→0.48 前重。
  const wide = {
    width: 5,
    // camber 必须为 0：它是 `curvature × width × 0.5`，在 width=5 上高达 0.45，而本 harness
    // 的 frame.z 是**常量 +Z** ⇒ 那 0.45 会整体平移中面、把上面精心构造的 clearance 剖面淹掉，
    // 于是鼓包不显形、这条测试变成空转（初版实测：bug 存在时也通过，靠变异测试才抓到）。
    // 关 camber 后中面点**恰好等于曲线点**，球坐标构造精确成立。
    panelCurvature: 0,
    points: [
      { x: 0, y: 1.824, z: 0.431 }, // φ=25°  clearance 0.02
      { x: 0, y: 1.646, z: 1.065 }, // φ=55°  clearance 0.30  ← 前 1/3 就涨掉大半
      { x: 0, y: 1.024, z: 1.415 }, // φ=85°  clearance 0.42
      { x: 0, y: 0.275, z: 1.341 }  // φ=115° clearance 0.48
    ]
  };
  const clearanceProfile = (overrides) => {
    const lock = panelLock({ ...wide, ...overrides });
    const api = panelApi(lock);
    const centre = new THREE.Vector3(SPHERE_PROXY.x, SPHERE_PROXY.y, SPHERE_PROXY.z);
    const out = [];
    for (let row = 0; row <= LENGTH_LOOPS; row += 1) {
      const mid = api.tipMainSectionPoint(lock, row / LENGTH_LOOPS, 0, 0, null, -1, null);
      out.push(mid.distanceTo(centre) - SPHERE_PROXY.radius);
    }
    return out;
  };
  const GAP = 0.05;
  const flat = clearanceProfile({ panelScalpConformAmount: 0 });
  const flatSpan = Math.max(...flat) - Math.min(...flat);
  // **判据是"鼓包幅度"而不是"有没有反转"**：任何非零长度的释放带都会在带内留下一个极小的
  // 反转（实测 range=0.15 时 0.020→0.059→0.050，overshoot 仅 0.009），那是正常的、不是病。
  // 病征是**幅度**：range=0.91 且无钳位时 overshoot 达 0.267（相对 flat 跨度 0.61 = 43%）。
  // 用 flat 跨度归一后，两者相差一个数量级以上，阈值 10% 干净分开（实测 2% vs 43%）。
  for (const range of [0.05, 0.15, PANEL_SCALP_CONFORM_MAX_RANGE, 0.91, 1]) {
    const conformed = clearanceProfile({
      panelScalpConformAmount: 1,
      panelScalpConformGap: GAP,
      panelScalpConformCylinder: 0,
      panelScalpConformRange: range
    });
    const overshoot = Math.max(0, Math.max(...conformed) - GAP);
    assert.ok(
      overshoot / flatSpan < 0.1,
      `range=${range} 中段鼓包过大：overshoot=${overshoot.toFixed(4)}`
        + `（flat 跨度 ${flatSpan.toFixed(4)} 的 ${((overshoot / flatSpan) * 100).toFixed(1)}%）`
        + `，剖面 ${conformed.map((v) => v.toFixed(3)).join(" ")}`
    );
    // 且收满的行必须真的贴在 gap 上（否则"无鼓包"可能只是因为整片没动）。
    const saturated = conformed.filter((_, row) => row / LENGTH_LOOPS >= PANEL_SCALP_CONFORM_MAX_RANGE);
    assert.ok(saturated.length > 0, "sanity：存在收满的行");
    for (const clearance of saturated) {
      assert.ok(Math.abs(clearance - 0.05) < 1e-9, `收满行必须贴在 gap 上，实测 clearance=${clearance}`);
    }
  }
});

test("面板厚度守恒：两壳拿同一份 delta（若各自朝表面收会被压成 0）", () => {
  const baseLock = panelLock();
  const conformLock = panelLock({ panelScalpConformAmount: 1, panelScalpConformRange: 0.3 });
  const baseApi = panelApi(baseLock);
  const conformApi = panelApi(conformLock);
  let checked = 0;
  for (const t of [0.4, 0.6, 0.8, 1]) {
    for (const u of [-0.8, 0, 0.8]) {
      const baseFront = baseApi.tipMainSectionPoint(baseLock, t, u, 1, null, -1, null);
      const baseBack = baseApi.tipMainSectionPoint(baseLock, t, u, -1, null, -1, null);
      const front = conformApi.tipMainSectionPoint(conformLock, t, u, 1, null, -1, null);
      const back = conformApi.tipMainSectionPoint(conformLock, t, u, -1, null, -1, null);
      const baseThickness = baseFront.distanceTo(baseBack);
      const thickness = front.distanceTo(back);
      assert.ok(
        Math.abs(thickness - baseThickness) < 1e-12,
        `厚度必须逐位守恒：t=${t} u=${u}，基线 ${baseThickness} 实测 ${thickness}`
      );
      // 且两壳位移必须**完全相同**（同一份 delta），这是厚度守恒的机制本身。
      const frontDelta = front.clone().sub(baseFront);
      const backDelta = back.clone().sub(baseBack);
      assert.ok(frontDelta.distanceTo(backDelta) < 1e-12, `两壳必须拿同一份 delta：t=${t} u=${u}`);
      checked += 1;
    }
  }
  assert.ok(checked > 0, "sanity：确实比较过两壳");
});

test("amount < 0 ⇒ 推离头部（与正向严格反向）", () => {
  const baseLock = panelLock();
  const baseApi = panelApi(baseLock);
  const center = new THREE.Vector3(SPHERE_PROXY.x, SPHERE_PROXY.y, SPHERE_PROXY.z);
  for (const t of [0.5, 0.8]) {
    const base = baseApi.tipMainSectionPoint(baseLock, t, 0, 0, null, -1, null);
    const pullLock = panelLock({ panelScalpConformAmount: 0.6 });
    const pushLock = panelLock({ panelScalpConformAmount: -0.6 });
    const pull = panelApi(pullLock).tipMainSectionPoint(pullLock, t, 0, 0, null, -1, null);
    const push = panelApi(pushLock).tipMainSectionPoint(pushLock, t, 0, 0, null, -1, null);
    // 面板起始在代理外面 ⇒ 正向收缩必须**靠近**头心，负向必须**远离**。
    assert.ok(pull.distanceTo(center) < base.distanceTo(center), `正向必须靠近头心：t=${t}`);
    assert.ok(push.distanceTo(center) > base.distanceTo(center), `负向必须远离头心：t=${t}`);
    // 严格反向：两个 delta 互为相反向量。
    const pullDelta = pull.clone().sub(base);
    const pushDelta = push.clone().sub(base);
    assert.ok(pullDelta.clone().add(pushDelta).length() < 1e-12, `负 amount 必须严格反向：t=${t}`);
  }
});
// 这条是本次模型替换的**核心动机**：落点必须由真实头皮位置决定，不是写死常数。
// 用户原话「我的建议是直接分析现有头皮的集合结构」。0.2.135 刻意"不跟随"头模，那是错的。
test("代理跟随注入的 scalpSurface（每个轴都生效，非写死常数）", () => {
  const lock = panelLock({ panelScalpConformAmount: 1, panelScalpConformRange: 0.4, panelScalpConformGap: 0 });
  // 球代理 vs 非均匀椭球代理 ⇒ 同一 lock 必须给出不同落点。
  const sphereMid = panelApi(lock, SPHERE_PROXY).tipMainSectionPoint(lock, 0.8, 0, 0, null, -1, null);
  const ellipsoidMid = panelApi(lock, ELLIPSOID_PROXY).tipMainSectionPoint(lock, 0.8, 0, 0, null, -1, null);
  assert.ok(sphereMid.distanceTo(ellipsoidMid) > 1e-6, "换代理必须改变落点（否则是写死常数）");

  // 椭球判据：把落点变换回单位球空间后，长度必须是 1（gap = 0 ⇒ 正好在表面上）。
  // 这是独立于实现的几何事实。
  const sx = ELLIPSOID_PROXY.radius * ELLIPSOID_PROXY.scaleX;
  const sy = ELLIPSOID_PROXY.radius * ELLIPSOID_PROXY.scaleY;
  const sz = ELLIPSOID_PROXY.radius * ELLIPSOID_PROXY.scaleZ;
  const unit = Math.hypot(
    (ellipsoidMid.x - ELLIPSOID_PROXY.x) / sx,
    (ellipsoidMid.y - ELLIPSOID_PROXY.y) / sy,
    (ellipsoidMid.z - ELLIPSOID_PROXY.z) / sz
  );
  assert.ok(Math.abs(unit - 1) < 1e-12, `椭球落点归一后必须为 1，实测 ${unit}`);

  // 半径放大 ⇒ 落点必须更靠外（跟随 radius，不只跟随 scaleXYZ）。
  const bigProxy = { ...SPHERE_PROXY, radius: 1.4 };
  const bigMid = panelApi(lock, bigProxy).tipMainSectionPoint(lock, 0.8, 0, 0, null, -1, null);
  const center = new THREE.Vector3(SPHERE_PROXY.x, SPHERE_PROXY.y, SPHERE_PROXY.z);
  assert.ok(
    bigMid.distanceTo(center) > sphereMid.distanceTo(center) + 0.3,
    "radius 放大必须把落点推到更外面"
  );
  // 缺失注入时走兜底常数，且不得抛（node 测试/deps 未装配完的路径）。
  const fallbackApi = panelApi(lock, undefined);
  assert.ok(Number.isFinite(fallbackApi.tipMainSectionPoint(lock, 0.8, 0, 0, null, -1, null).z));
});

// 跨消费方一致性（规范要求的形式：断言两个消费方彼此相等，而不是各自断言自己的值）。
// tipMainSectionPoint 的头注释写着它「复刻 rawPanelPoint，让宽度控件落在几何真正的边缘
// 上」—— 只给网格加收缩而漏掉它，视口绿色宽度把手就会浮在面板表面之外（bug-fixes.md #25）。
test("跨消费方一致：宽度把手的截面点与网格拿到同一份位移", () => {
  const baseLock = panelLock();
  const probeLock = panelLock({ panelScalpConformAmount: 0.7, panelScalpConformRange: 0.35 });
  const baseApi = panelApi(baseLock);
  const probeApi = panelApi(probeLock);
  const baseline = buildPanel(baseLock);
  const probe = buildPanel(probeLock);
  let checked = 0;
  for (let vertex = 0; vertex < baseline.count; vertex += 1) {
    const row = baseline.rows[vertex];
    // shell：奇数 gridCol 是 front(+1)、偶数是 back(-1)（addPatch 的 col 编码）。
    const shell = baseline.cols[vertex] % 2 === 1 ? 1 : -1;
    const column = Math.floor(baseline.cols[vertex] / 2);
    const t = row / LENGTH_LOOPS;
    const u = THREE.MathUtils.lerp(-1, 1, column / WIDTH_LOOPS);
    const meshDelta = new THREE.Vector3(
      probe.positions[vertex * 3] - baseline.positions[vertex * 3],
      probe.positions[vertex * 3 + 1] - baseline.positions[vertex * 3 + 1],
      probe.positions[vertex * 3 + 2] - baseline.positions[vertex * 3 + 2]
    );
    const sectionDelta = probeApi.tipMainSectionPoint(probeLock, t, u, shell, null, -1, null)
      .sub(baseApi.tipMainSectionPoint(baseLock, t, u, shell, null, -1, null));
    assert.ok(
      sectionDelta.distanceTo(meshDelta) < 1e-5,
      `row ${row} col ${column} shell ${shell}：把手位移 ${sectionDelta.toArray()} ≠ 网格位移 ${meshDelta.toArray()}`
    );
    checked += 1;
  }
  assert.ok(checked > 0, "sanity：确实比较过顶点");
});
test("surface（lattice 控制）面板的 amount 恒为 0，且参数照常钳位", () => {
  const api = panelApi(panelLock());
  const surfaceParams = api.panelScalpConformParams({
    geometryType: "surface",
    panelScalpConformAmount: 1
  });
  assert.equal(surfaceParams.amount, 0, "lattice 面板不适用程序化形变");
  const panelParams = api.panelScalpConformParams({
    geometryType: "panel",
    panelScalpConformAmount: 1
  });
  assert.equal(panelParams.amount, 1);
  // 钳位与默认值（默认值取自 curve-math 的唯一定义点，不写死数字）。
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformRange: 0 }).range, 0.05);
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformGap: 9 }).gap, 0.5);
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformCylinder: 9 }).cylinder, 3);
  const defaults = api.panelScalpConformParams({ geometryType: "panel" });
  assert.equal(defaults.range, PANEL_SCALP_CONFORM_DEFAULTS.range);
  assert.equal(defaults.gap, PANEL_SCALP_CONFORM_DEFAULTS.gap);
  assert.equal(defaults.cylinder, PANEL_SCALP_CONFORM_DEFAULTS.cylinder);
  assert.equal(defaults.amount, PANEL_SCALP_CONFORM_DEFAULTS.amount);
  // 零位移路径：amount==0 与 weight==0 都必须返回 null（调用方据此走零分配路径）。
  assert.equal(api.panelScalpConformDelta(defaults, new THREE.Vector3(0, 1, 2), 0.5), null);
  assert.equal(api.panelScalpConformDelta(panelParams, new THREE.Vector3(0, 1, 2), 0), null);
});

test("单一定义点：Capsule 几何只在 curve-math.js，消费方只调用不重写", async () => {
  const [curveMath, panelStrand, app] = await Promise.all([
    readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);
  // 定义点恰好一处
  assert.equal((curveMath.match(/export function capsuleEndNearestSurface\(/g) || []).length, 1);
  assert.equal((curveMath.match(/export function panelScalpConformWeight\(/g) || []).length, 1);
  // 消费方只调用，不重写「轴上最近点」的钳位推导
  assert.doesNotMatch(panelStrand, /clamp\(-\(Number\(y\)/, "panel-tip-strand 不得重写轴钳位");
  assert.equal((panelStrand.match(/capsuleEndNearestSurface\(/g) || []).length, 1, "只应有一处调用");
  // 两个消费点各一处 delta 应用（rawPanelPoint + tipMainSectionPoint），各带 amount 门控
  assert.equal((panelStrand.match(/panelScalpConformDelta\(conform,/g) || []).length, 2);
  assert.equal((panelStrand.match(/if \(conform\.amount !== 0\)/g) || []).length, 2);
  // 中面推导：两处都必须用 shell 项归零的中面点算 delta（否则厚度被压成 0）
  assert.equal((panelStrand.match(/addScaledVector\(frame\.z, camber\)/g) || []).length, 2);
  // app.js 只接线、不参与几何推导
  assert.doesNotMatch(app, /capsuleEndNearestSurface/, "app.js 不得出现几何函数");
  assert.doesNotMatch(app, /panelScalpConformDelta/, "app.js 不得出现位移函数");
  // 头部代理必须注入真实状态，而不是几何层写死
  assert.match(app, /Object\.assign\(panelTipStrandDeps, \{[\s\S]*?\n  scalpSurface,/);
});
const CONFORM_FIELDS = [
  "panelScalpConformAmount",
  "panelScalpConformRange",
  "panelScalpConformGap",
  "panelScalpConformCylinder"
];

// app.js 顶层就 querySelector / new THREE.Scene，node 里无法 import 执行（dom-contract
// 全篇同样只读源码文本），所以接线按本仓库既有惯例用源码断言逐条钉住。
// **这不能替代浏览器验证**，只能防"少接一条路径"。
test("app.js 接线：四个字段覆盖全部 7 类路径（源码文本断言）", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  for (const field of CONFORM_FIELDS) {
    // ① panelCreationDefaults
    assert.match(app, new RegExp(`^  ${field}: `, "m"), `${field} 必须有创建默认值`);
    // ② DOM 引用（含缺失过滤）
    assert.match(app, new RegExp(`${field}: document\\.querySelector\\("#${field}"\\)`), `${field} 缺 DOM 引用`);
    assert.match(app, new RegExp(`${field}: document\\.querySelector\\("#${field}Value"\\)`), `${field} 缺 output 引用`);
    // ③ lock normalize
    assert.match(app, new RegExp(`lock\\.${field} =`), `${field} 缺 normalize`);
    // ④ 镜像伙伴创建 + ⑤ 镜像同步
    assert.match(app, new RegExp(`${field}: lock\\.${field},`), `${field} 缺 createMirrorPartner`);
    assert.match(app, new RegExp(`partner\\.${field} =`), `${field} 缺 syncMirrorPartnerFromLock`);
    // ⑥ snapshot 序列化 + ⑦ 反序列化
    assert.match(app, new RegExp(`${field}: Number\\(lock\\.${field} \\?\\?`), `${field} 缺 snapshot 序列化`);
    // 反序列化：Amount 走 `surface ? 0 : clamp(...)` 三元式，其余三个是纯 clamp ⇒ 判据只
    // 要求「字段名后不远处读到 snapshot.同名字段」，不锁具体形式（锁形式会让本就正确的
    // surface 门控变红，本文件初版如此）。
    assert.match(app, new RegExp(`${field}:[\\s\\S]{0,160}snapshot\\.${field}`), `${field} 缺反序列化`);
  }
  // 缺失过滤：通用接线对元素不判空，markup 未就绪时不得进字典
  assert.match(app, /panelScalpConformInputEntries[\s\S]{0,400}\.filter\(\(\[, element\]\) => Boolean\(element\)\)/);
  // surface 门控 + 隐藏站点的可选链
  assert.match(app, /panelScalpConformControls\?\.classList\.toggle\("hidden"/);
  // 旧字段必须彻底消失（否则会留下"写了但没人读"的死字段）。
  // 判据只禁**代码里的标识符**（属性访问 / 赋值 / 对象键），不禁注释里出现这个词 ——
  // 反序列化处有一段刻意点名旧字段的迁移说明注释，那是要保留的（说明为什么不迁移）。
  // 初版用了裸 /panelHemisphere/，把那条注释也判成违规。
  assert.doesNotMatch(app, /\.panelHemisphere[A-Za-z]*\b/, "不得再有旧字段的属性访问");
  assert.doesNotMatch(app, /^\s*panelHemisphere[A-Za-z]*\s*[:=]/m, "不得再有旧字段的赋值或对象键");
  assert.doesNotMatch(app, /querySelector\("#panelHemisphere/, "不得再有旧 id 的 DOM 查询");
});

test("app.js 镜像：四个值原样拷贝 —— 不取反、不左右互换", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  for (const field of CONFORM_FIELDS) {
    assert.match(app, new RegExp(`${field}: lock\\.${field},`), `createMirrorPartner 必须原样拷贝 ${field}`);
    assert.match(
      app,
      new RegExp(`partner\\.${field} =[\\s\\S]{0,140}lock\\.${field}`),
      `syncMirrorPartnerFromLock 必须从**同名**字段取 ${field}`
    );
    assert.doesNotMatch(app, new RegExp(`-\\s*Number\\(lock\\.${field}`), `${field} 不得取反`);
    assert.doesNotMatch(app, new RegExp(`${field}: -`), `${field} 不得取反`);
  }
  // 负向对照：证明"取负"与"左右互换"这两种写法在本文件里确实写得出来 ⇒ 上面的
  // doesNotMatch 不是空转。（panelTipCurve 取负、EdgeTrim 在 sync 处互换。）
  assert.match(app, /-Number\(lock\.panelTipCurve/, "sanity：panelTipCurve 确实取负");
  assert.match(
    app,
    /partner\.panelLeftEdgeTrim = Number\(lock\.panelRightEdgeTrim/,
    "sanity：syncMirrorPartnerFromLock 处 EdgeTrim 确实互换"
  );
  // 不得交叉赋值（四个字段两两之间）
  for (const a of CONFORM_FIELDS) {
    for (const b of CONFORM_FIELDS) {
      if (a === b) continue;
      assert.doesNotMatch(app, new RegExp(`${a}: lock\\.${b}\\b`), `${a} 不得取 ${b} 的值`);
    }
  }
});
