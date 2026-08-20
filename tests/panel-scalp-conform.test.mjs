// panel-scalp-conform.test.mjs — 面板「贴合头皮」Scalp Conform 回归（0.2.138 Bend 模型）。
//
// **本文件是第三版**。前两版随模型一起被替换，原因留档（避免第四次重犯）：
//   0.2.134/135「沿面板法线的球冠 + 两侧后移」：位移是沿 frame.z 的局部标量，
//     不知道头皮在世界空间哪里 ⇒ 边缘落点与头皮无关、还会拱起。
//   0.2.136/137「朝头部代理表面收缩」（逐顶点找最近表面点）：那是**投影**，
//     **不保弧长** —— 实测 width=5 的面板横向跨度被压 5.0 → 2.4（ratio 0.52）。
//     用户原话：「我们现在的实现是不保持长度的, 坍缩有点严重」。
//
// **本版模型（用户指定）**：「按照头的中心那里有个竖着的 tube 把平面的 panel 卷成圆柱的
// 轨迹, 不是直接 ray 投射而是弯曲变形, 类似 bend, 这个是保持长度的」。
//   θ = k·s,  k = amount / bendRadius
//   P(s) = base + (sin θ / k)·T − ((1 − cos θ)/k)·N
//
// 断言围绕五条不变式：
//   ① **保弧长**：每一行的横向跨度在 conform 前后逐值守恒（这正是上一版的病根，
//      也是本版存在的理由 —— 判据必须直接量它）
//   ② amount == 0 ⇒ 顶点逐位守恒（先例：SWEEP_OVERLAP_DEFAULTS「关到 0 逐位守恒」）
//   ③ 中线（s == 0）**零位移** ⇒ 主发片控制点天然对齐（用户 bug #2 的结构性修复）
//   ④ 厚度守恒：两壳沿**旋转后**的法向分居，不被剪切成斜的
//   ⑤ 跨消费方一致：宽度把手的截面点与网格拿到同一份弯曲
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import {
  PANEL_SCALP_CONFORM_DEFAULTS,
  panelBendCoefficients
} from "../modules/geometry/curve-math.js";

const LENGTH_LOOPS = 10;
const WIDTH_LOOPS = 6;
const PANEL_WIDTH = 0.62;
const SPHERE_PROXY = { x: 0, y: 0.9, z: 0, radius: 1, scaleX: 1, scaleY: 1, scaleZ: 1 };
// 非均匀椭球：验证弯曲半径确实跟随 scalpSurface（用户选了"弧半径参考头皮半径"）。
const ELLIPSOID_PROXY = { x: 0.1, y: 0.9, z: 0, radius: 1, scaleX: 1.4, scaleY: 0.9, scaleZ: 1.6 };

// 发尖 taper 收到 0：AGENT_QUICKSTART.md §2.4b 要求 fixture 至少有一个这样的构型，
// 否则「t=1 处几何量退化成一个点」这类 bug 在 node 侧永远绿。
const TAPER_TO_ZERO = [
  { position: 0, value: 1, interpolation: "linear" },
  { position: 1, value: 0, interpolation: "linear" }
];
const CONSTANT_CURVE = [
  { position: 0, value: 1, interpolation: "linear" },
  { position: 1, value: 1, interpolation: "linear" }
];
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

// 直链 + 固定正交 frame ⇒ frame.x 恒为世界 +X、frame.z 恒为世界 +Z。弯曲发生在
// (frame.x, frame.z) 平面内，所以判据可以直接看世界坐标，不必反解 frame。
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
    isPanelGeometry: (item) => item?.geometryType === "panel" || item?.geometryType === "surface",
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

const vertexAt = (built, index) => new THREE.Vector3(
  built.positions[index * 3],
  built.positions[index * 3 + 1],
  built.positions[index * 3 + 2]
);

// 逐行横向跨度（同一行相邻顶点距离之和 = 该行的横向弧长）。**保弧长判据的核心量**。
function rowSpans(built) {
  const byRow = new Map();
  for (let vertex = 0; vertex < built.count; vertex += 1) {
    const row = built.rows[vertex];
    if (row < 0) continue;
    // 只取 front 壳（奇数 gridCol）以拿到一条干净的横向折线。
    if (built.cols[vertex] % 2 !== 1) continue;
    if (!byRow.has(row)) byRow.set(row, []);
    byRow.get(row).push({ col: built.cols[vertex], point: vertexAt(built, vertex) });
  }
  const spans = new Map();
  for (const [row, entries] of byRow) {
    entries.sort((a, b) => a.col - b.col);
    let total = 0;
    for (let i = 1; i < entries.length; i += 1) total += entries[i - 1].point.distanceTo(entries[i].point);
    spans.set(row, total);
  }
  return spans;
}
test("panelBendCoefficients：k→0 精确退化为平板、保弧长、奇偶性正确", () => {
  // k == 0 必须**逐位**返回 (s, 0)：amount==0 的逐位守恒契约建立在这上面。
  for (const s of [-2.5, -0.31, 0, 0.31, 2.5]) {
    const flat = panelBendCoefficients(s, 0);
    assert.ok(Object.is(flat.along, s), `k=0 必须逐位返回 s：s=${s} 得到 ${flat.along}`);
    assert.ok(Object.is(flat.inward, 0), `k=0 必须逐位返回 inward=+0：s=${s}`);
  }
  // 保弧长：|dP/ds|² = cos²θ + sin²θ = 1。用差分核验（这是本模型存在的理由）。
  const k = 1 / 1.02;
  const h = 1e-6;
  for (const s of [0, 0.5, 1.5, 2.5]) {
    const a = panelBendCoefficients(s - h, k);
    const b = panelBendCoefficients(s + h, k);
    const speed = Math.hypot((b.along - a.along) / (2 * h), (b.inward - a.inward) / (2 * h));
    assert.ok(Math.abs(speed - 1) < 1e-6, `|dP/ds| 必须恒为 1（保弧长）：s=${s} 得到 ${speed}`);
  }
  // along 在 s 上是奇函数、inward 是偶函数 —— 镜像原样拷贝的推导依据。
  for (const s of [0.4, 1.1, 2.5]) {
    const plus = panelBendCoefficients(s, k);
    const minus = panelBendCoefficients(-s, k);
    assert.ok(Math.abs(plus.along + minus.along) < 1e-12, `along 必须是奇函数：s=${s}`);
    assert.ok(Math.abs(plus.inward - minus.inward) < 1e-12, `inward 必须是偶函数：s=${s}`);
  }
  // 曲率插值：amount 减半 == 半径加倍（"中间态仍是光滑圆柱"的形式依据）。
  const half = panelBendCoefficients(1.2, k * 0.5);
  const doubled = panelBendCoefficients(1.2, 1 / 2.04);
  assert.ok(Math.abs(half.along - doubled.along) < 1e-12, "amount 减半必须等价于半径加倍");
});

// ── 本版存在的理由：保弧长 ────────────────────────────────────────────────────
// 上一版（逐顶点投影）把 width=5 的面板横向跨度压到 0.52 倍，用户报告"坍缩有点严重"。
// **判据直接量每一行的横向跨度**，而不是量"离头皮多远"—— 后者上一版也能过。
test("保弧长：每一行的横向跨度在 conform 前后守恒（宽面板，amount=1）", () => {
  const WIDE = 5;
  const flat = buildPanel(panelLock({ width: WIDE }));
  const bent = buildPanel(panelLock({ width: WIDE, panelScalpConformAmount: 1 }));
  assert.equal(bent.count, flat.count);
  const flatSpans = rowSpans(flat);
  const bentSpans = rowSpans(bent);
  let worstRatio = 1;
  for (const [row, flatSpan] of flatSpans) {
    if (flatSpan < 1e-6) continue; // 发尖 taper 收到 0 的那一行跨度本就是 0
    const ratio = bentSpans.get(row) / flatSpan;
    worstRatio = Math.min(worstRatio, ratio);
  }
  // **容差有推导，不是拍的**：网格是内接折线，弯曲后折线弦长比真实弧长短
  // ratio = 2·sin(Δθ/2)/Δθ。width=5、bendRadius≈1.02、amount=1 ⇒ 半跨 θ=2.45 rad，
  // 6 个宽度分段 ⇒ Δθ≈0.816 ⇒ 理论下限 2·sin(0.408)/0.816 ≈ 0.973。
  // 所以 0.96 是"离散化误差之内"，而上一版的 0.52 差了一个数量级 —— 判据能分开两者。
  assert.ok(worstRatio > 0.96, `横向跨度必须守恒（保弧长），最差比值 ${worstRatio.toFixed(4)}`);
  assert.ok(worstRatio < 1.001, `跨度不得反而变长，最差比值 ${worstRatio.toFixed(4)}`);
});

test("amount == 0 ⇒ 顶点位置逐位守恒（含 gap 被改动的情况）", () => {
  const baseline = buildPanel(panelLock());
  for (const overrides of [{}, { panelScalpConformGap: 0.4 }, { panelScalpConformGap: 0 }]) {
    const probe = buildPanel(panelLock({ panelScalpConformAmount: 0, ...overrides }));
    assert.equal(probe.count, baseline.count);
    for (let i = 0; i < baseline.positions.length; i += 1) {
      assert.ok(
        Object.is(probe.positions[i], baseline.positions[i]),
        `amount==0 必须逐位守恒：索引 ${i}（${probe.positions[i]} vs ${baseline.positions[i]}）`
      );
    }
  }
});

// ── 用户 bug #2 的**结构性**修复 ──────────────────────────────────────────────
// 用户："主发片的控制点和控制器不会随着 Conform 拉高而跟着 geo 走"。
// Bend 模型下中线（s == 0）位移恒为 0 ⇒ 主发片控制点（落在授权曲线上）**本来就对齐**，
// 不需要给控制器另加补偿。这条把该性质钉死：中线列必须逐位不动。
test("中线（u == 0）逐位不动 ⇒ 主发片控制点天然对齐", () => {
  const baseline = buildPanel(panelLock());
  for (const amount of [-1, -0.4, 0.3, 1]) {
    const bent = buildPanel(panelLock({ panelScalpConformAmount: amount }));
    let checked = 0;
    for (let vertex = 0; vertex < baseline.count; vertex += 1) {
      const column = Math.floor(baseline.cols[vertex] / 2);
      // u == 0 的列（WIDTH_LOOPS 为偶数 ⇒ 正中间那一列）
      if (column * 2 !== WIDTH_LOOPS) continue;
      for (let axis = 0; axis < 3; axis += 1) {
        const index = vertex * 3 + axis;
        assert.ok(
          Object.is(bent.positions[index], baseline.positions[index]),
          `中线顶点必须逐位不动：amount=${amount} 索引 ${index}`
        );
      }
      checked += 1;
    }
    assert.ok(checked > 0, "sanity：确实找到了中线列的顶点");
  }
});
// 厚度必须沿**旋转后**的法向分居。若实现漏乘 cos θ / sin θ（即厚度仍沿原 frame.z 加），
// 两壳间距会随 |s| 增大而被剪切成斜的、边缘处厚度被压扁。
test("厚度守恒：两壳间距沿弯曲后的法向保持，不被剪切", () => {
  const THICKNESS = 0.08;
  const lock = panelLock({ width: 5, panelThickness: THICKNESS, panelScalpConformAmount: 1 });
  const api = panelApi(lock);
  let worst = 0;
  let checked = 0;
  for (const t of [0.2, 0.5, 0.8]) {
    for (const u of [-1, -0.5, 0, 0.5, 1]) {
      const front = api.tipMainSectionPoint(lock, t, u, 1, null, -1, null);
      const back = api.tipMainSectionPoint(lock, t, u, -1, null, -1, null);
      worst = Math.max(worst, Math.abs(front.distanceTo(back) - THICKNESS));
      checked += 1;
    }
  }
  assert.ok(checked > 0, "sanity：确实比较过截面点");
  assert.ok(worst < 1e-9, `两壳间距必须恒为 thickness，最大偏差 ${worst.toExponential(3)}`);
});

// 跨消费方一致性（规范要求的形式：断言两个消费方彼此相等，而不是各自断言自己的值）。
// tipMainSectionPoint 的头注释写着它「复刻 rawPanelPoint，让宽度控件落在几何真正的边缘上」
// —— 只给网格加弯曲而漏掉它，视口绿色宽度把手就会浮在面板表面之外（bug-fixes.md #25）。
test("跨消费方一致：宽度把手的截面点与网格拿到同一份弯曲", () => {
  const baseLock = panelLock({ width: 5 });
  const probeLock = panelLock({ width: 5, panelScalpConformAmount: 0.8, panelScalpConformGap: 0.05 });
  const baseApi = panelApi(baseLock);
  const probeApi = panelApi(probeLock);
  const baseline = buildPanel(baseLock);
  const probe = buildPanel(probeLock);
  assert.equal(probe.count, baseline.count);
  let checked = 0;
  for (let vertex = 0; vertex < baseline.count; vertex += 1) {
    const row = baseline.rows[vertex];
    const shell = baseline.cols[vertex] % 2 === 1 ? 1 : -1;
    const column = Math.floor(baseline.cols[vertex] / 2);
    const t = row / LENGTH_LOOPS;
    const u = THREE.MathUtils.lerp(-1, 1, column / WIDTH_LOOPS);
    const meshDelta = vertexAt(probe, vertex).sub(vertexAt(baseline, vertex));
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

// 用户明确选了"弧半径参考头皮半径"，所以弯曲半径必须**跟随注入的 scalpSurface**，
// 不能是几何层写死的常数。判据：换非均匀椭球代理必须改变弯曲量。
test("弯曲半径跟随注入的 scalpSurface（水平轴，非写死常数）", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1, panelScalpConformGap: 0 });
  const sphere = panelApi(lock, SPHERE_PROXY).panelScalpConformParams(lock);
  const ellipsoid = panelApi(lock, ELLIPSOID_PROXY).panelScalpConformParams(lock);
  // 球代理：bendRadius == radius + gap == 1
  assert.ok(Math.abs(sphere.bendRadius - 1) < 1e-12, `球代理弯曲半径应为 1，得到 ${sphere.bendRadius}`);
  // 椭球：取**水平**平均 (scaleX + scaleZ)/2 = (1.4 + 1.6)/2 = 1.5 —— 竖直缩放 scaleY
  // 刻意不参与（弯曲轴是竖直的，竖直缩放与卷绕无关）。
  assert.ok(
    Math.abs(ellipsoid.bendRadius - 1.5) < 1e-12,
    `椭球弯曲半径应取水平平均 1.5，得到 ${ellipsoid.bendRadius}`
  );
  // scaleY 改变不得影响弯曲半径（负向对照：若实现误用三轴平均，这条会红）
  const tallerY = panelApi(lock, { ...ELLIPSOID_PROXY, scaleY: 3 }).panelScalpConformParams(lock);
  assert.ok(
    Math.abs(tallerY.bendRadius - ellipsoid.bendRadius) < 1e-12,
    "竖直缩放不得影响弯曲半径（弯曲轴是竖直的）"
  );
  // gap 直接加到半径上
  const gapped = panelApi(panelLock({ panelScalpConformGap: 0.25 }), SPHERE_PROXY)
    .panelScalpConformParams(panelLock({ panelScalpConformGap: 0.25 }));
  assert.ok(Math.abs(gapped.bendRadius - 1.25) < 1e-12, `gap 必须加到弯曲半径上，得到 ${gapped.bendRadius}`);
  // 几何层实际输出也必须不同（不只是参数不同）
  const sphereMid = panelApi(lock, SPHERE_PROXY).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  const ellipsoidMid = panelApi(lock, ELLIPSOID_PROXY).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  assert.ok(sphereMid.distanceTo(ellipsoidMid) > 1e-6, "换代理必须改变边缘落点");
});
test("surface（lattice 控制）面板的 amount 恒为 0，参数默认值取自唯一定义点", () => {
  const api = panelApi(panelLock());
  assert.equal(api.panelScalpConformParams({ geometryType: "surface", panelScalpConformAmount: 1 }).amount, 0);
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformAmount: 1 }).amount, 1);
  const defaults = api.panelScalpConformParams({ geometryType: "panel" });
  assert.equal(defaults.amount, PANEL_SCALP_CONFORM_DEFAULTS.amount);
  assert.equal(defaults.gap, PANEL_SCALP_CONFORM_DEFAULTS.gap);
  // gap 钳位
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformGap: 9 }).gap, 0.5);
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformGap: -9 }).gap, 0);
  // amount 钳位
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformAmount: 9 }).amount, 1);
  assert.equal(api.panelScalpConformParams({ geometryType: "panel", panelScalpConformAmount: -9 }).amount, -1);
});

test("单一定义点：弯曲公式只在 curve-math.js，消费方只调用不重写", async () => {
  const [curveMath, panelTip, app] = await Promise.all([
    readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);
  assert.equal((curveMath.match(/export function panelBendCoefficients\(/g) || []).length, 1);
  // 消费方不得自己写 sin/cos 的弯曲式（那会变成第二个定义点）
  assert.doesNotMatch(panelTip, /Math\.sin\([^)]*\)\s*\/\s*k/, "panel-tip-strand 不得重写弯曲公式");
  assert.doesNotMatch(panelTip, /1\s*-\s*Math\.cos\(/, "panel-tip-strand 不得重写弯曲公式");
  assert.doesNotMatch(app, /panelBendCoefficients/, "app.js 不得参与几何推导");
  // 两个消费点（几何 + 宽度把手复刻）各调一次 panelScalpConformOffsets
  assert.equal((panelTip.match(/panelScalpConformOffsets\(conform,/g) || []).length, 2);
  // 被删的三代旧 API 不得复活
  for (const dead of ["capsuleEndNearestSurface", "panelScalpConformWeight", "panelHemisphereOffset"]) {
    assert.doesNotMatch(curveMath, new RegExp(`export function ${dead}\\(`), `${dead} 必须已删除`);
  }
});

const CONFORM_FIELDS = ["panelScalpConformAmount", "panelScalpConformGap"];

// app.js 顶层就 querySelector / new THREE.Scene，node 里无法 import 执行（dom-contract 全篇
// 同样只读源码文本），所以接线按本仓库既有惯例用源码断言逐条钉住。
// **这不能替代浏览器验证**，只能防"少接一条路径"。
test("app.js 接线：两个字段覆盖全部 7 类路径（源码文本断言）", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  for (const field of CONFORM_FIELDS) {
    assert.match(app, new RegExp(`^  ${field}: PANEL_SCALP_CONFORM_DEFAULTS\\.`, "m"), `${field} 缺创建默认值`);
    assert.match(app, new RegExp(`${field}: document\\.querySelector\\("#${field}"\\)`), `${field} 缺 DOM 引用`);
    assert.match(app, new RegExp(`${field}: document\\.querySelector\\("#${field}Value"\\)`), `${field} 缺读数引用`);
    assert.match(app, new RegExp(`lock\\.${field} =`), `${field} 缺 normalize`);
    assert.match(app, new RegExp(`${field}: lock\\.${field}`), `${field} 缺 createMirrorPartner`);
    assert.match(app, new RegExp(`partner\\.${field} =`), `${field} 缺 syncMirrorPartnerFromLock`);
    assert.match(app, new RegExp(`${field}: Number\\(lock\\.${field}`), `${field} 缺 snapshot 序列化`);
    assert.match(app, new RegExp(`${field}:[\\s\\S]{0,200}snapshot\\.${field}`), `${field} 缺反序列化`);
  }
  // 被删的两个字段不得残留代码引用（注释里点名是允许的 —— 反序列化处有迁移说明）
  for (const dead of ["panelScalpConformRange", "panelScalpConformCylinder"]) {
    assert.doesNotMatch(app, new RegExp(`\\.${dead}\\b`), `不得再有 ${dead} 的属性访问`);
    assert.doesNotMatch(app, new RegExp(`^\\s*${dead}\\s*[:=]`, "m"), `不得再有 ${dead} 的赋值或对象键`);
  }
  assert.match(app, /Object\.assign\(panelTipStrandDeps, \{[\s\S]*?\n  scalpSurface,/);
  // 弯曲发生在面板自己的 (frame.x, frame.z) 平面 ⇒ 两个消费点都用 offsets 的一对系数
  const offsetUses = (app.match(/offsets \? offsets\./g) || []).length;
  assert.equal(offsetUses, 0, "app.js 不参与几何，offsets 只应出现在 panel-tip-strand");
});

test("app.js 镜像：两个值原样拷贝 —— 不取反、不左右互换", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  for (const field of CONFORM_FIELDS) {
    assert.match(app, new RegExp(`${field}: lock\\.${field},`), `${field} 必须原样拷贝`);
    assert.doesNotMatch(app, new RegExp(`${field}: -Number\\(lock\\.${field}`), `${field} 不得取负`);
  }
  // 负向对照：证明"取负"与"左右互换"两种写法在本文件里确实写得出来 ⇒ 上面的断言非空转
  assert.match(app, /clamp\(-Number\(lock\.panelTipCurve/, "sanity：panelTipCurve 确实取负");
  assert.match(app, /partner\.panelLeftEdgeTrim = Number\(lock\.panelRightEdgeTrim/, "sanity：EdgeTrim 确实互换");
  assert.doesNotMatch(app, /panelScalpConformAmount: lock\.panelScalpConformGap/, "不得交叉赋值");
  assert.doesNotMatch(app, /panelScalpConformGap: lock\.panelScalpConformAmount/, "不得交叉赋值");
});
