// panel-scalp-conform.test.mjs — 面板「贴合头皮」Scalp Conform 回归（0.2.143 逐行同心胶囊 wrap）。
//
// **本文件是第四版**。前三版随模型一起被替换，原因留档（避免第五次重犯）：
//   0.2.134/135「沿面板法线的球冠 + 两侧后移」：位移是沿 frame.z 的局部标量，
//     不知道头皮在世界空间哪里 ⇒ 边缘落点与头皮无关、还会拱起。
//   0.2.136/137「朝头部代理表面收缩」（逐顶点找最近表面点）：那是**投影**、**不保弧长**
//     —— 实测 width=5 的横向跨度被压 5.0 → 2.4（0.52）。用户：「不保持长度, 坍缩有点严重」。
//     **事后诊断**：0.52 恰是测地极坐标的周向压缩系数 sin(ρ/R)/(ρ/R)（ρ/R≈1.7–2.2 ⇒ 0.41–0.53）
//     —— 那一版其实是在做等距映射该做的压缩，只是压在了用户不接受的方向上。
//   0.2.138–0.2.142「绕竖直轴的 Bend + 全局 bendRadius + k·cos²α」：**本版取代的就是它**。
//     两条根因（探针实测，见 devlog/in-progress/scalp-conform-bend-v4-plan.md §1）：
//     ① 弯曲做在面板自己的 (frame.x, frame.z) 平面内 = 绕 **frame.y（曲线切线）** 转，
//        前额切线斜向下 ~20° ⇒「竖直 tube」跟着倾斜，边缘被卷进头里、与下方竖直段打架。
//        `k·cos²α`（0.2.142）是对**错误轴**的症状补偿，本版**删除**。
//     ② `bendRadius` 是**单一全局标量**（1.1），而各行到头心真实距离是 1.021–1.440
//        ⇒ 外侧行过度卷绕。实测 amount=0.87 时第 3–8 行**钻进头皮内部**，最深 **+0.235**
//        （平板时全部在外：−0.079…−0.817），同列行进从 0.189 塌到 0.076（0.40×）。
//
// **本版模型**：逐行绕**头部胶囊轴**的同心 wrap —— 轴与半径**都从头部代理现场推**：
//   A = (C.x, min(C.y, P.y), C.z)          胶囊轴最近点（中心高度以上=球冠，以下=圆柱）
//   R = |P − A|,  k = amount / (R + gap)   **逐行**曲率
//   平面 = (x̂_t, n̂)，x̂_t = 宽度方向投影到该同心面的切平面，n̂ = 径向（按 frame.z 定向）
//   弯曲轴 â = x̂_t × n̂ —— **完全由头部几何决定，与切线无关**
// 这一对 (n̂, x̂_t) 正是头皮的 Darboux frame 的 (n, g)，所以本版是「产线通用做法」的最小侵入版。
//
// 断言围绕八条不变式（新增 ⑥⑦⑧）：
//   ① **保弧长**：每一行的横向跨度在 conform 前后逐值守恒（0.2.136/137 的病根，判据直接量它）
//   ② amount == 0 ⇒ 顶点逐位守恒（先例：SWEEP_OVERLAP_DEFAULTS「关到 0 逐位守恒」）
//   ③ 中线（u == 0）**零位移** ⇒ 主发片控制点天然对齐（用户 bug #2 的结构性修复）
//   ④ 厚度守恒：两壳沿**弯后**法向分居，不被剪切成斜的
//   ⑤ 跨消费方一致：宽度把手的截面点与网格拿到同一份弯曲
//   ⑥ **不穿透**：amount=1 不得比平板基线更深地进入头部代理（0.2.138–142 的病根）
//   ⑦ **轴与切线无关、与头心有关**（取代 cos²α 那条；正反两条都要，否则 stub 也能过）
//   ⑧ **逐行半径**：不同距离的行必须拿到不同曲率（负向对照：全局标量会让它们相同）
//
// **第五版契约更新（子智能体 γ）**：模型从「胶囊轴」（`A = (C.x, min(C.y,P.y), C.z)`，
// 球冠/圆柱二分）换成「纬线 + 椭球密切圆心」（见 modules/geometry/panel-tip-strand.js
// 的 panelScalpConformOffsets 头注释「第五版」小节）。球构型（`ax == az`，含默认全 1）下
// 纬线截面退化为圆，密切圆心精确等于纬线圆心 `(C.x, P.y, C.z)`，代数上 `C.y`、`ay`、
// 整体半径对结果的影响恰好为 0（不是"很小"，是浮点精确的 0）——下面 ⑦/⑧/头心 三条
// 原本断言"移动头心必改变结果"的地方据此拆成"C.x/C.z 必变、C.y 在球构型下不变"两条。
// 「胶囊轴」「球冠区/圆柱区」的旧二分已废除，⑧ 的用例名与断言随之改写。新增用例覆盖
// 拟合椭球参与度、`ay` 写死为 1、NaN 防护（h 钳位）、弯曲轴恒竖直、默认值与三语覆盖。
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import {
  PANEL_SCALP_CONFORM_DEFAULTS,
  panelBendCrossSection
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

// 直链 + 固定正交 frame ⇒ 注入的 z 恒为世界 +Z（注意 `panelFrameAt` 只从这里取 z，
// 切线 y 始终来自 `curve.getTangent`）。
//
// **本 fixture 的一条载荷性质（invariant ⑧ 依赖它，勿"顺手简化"曲线）**：曲线点
// y = 1.7 → 0.7 而头心在 y = 0.9，所以各行到胶囊轴的距离 R 实测 **1.700 → 1.500**，
// 且 t=1 那一行落到中心高度**以下** ⇒ 进入**圆柱**区（A 跟着 P.y 走）。
// 即本 fixture 同时覆盖球冠区与圆柱区，而且行半径**确实不同** —— 若实现退回全局标量
// bendRadius，逐行判据才咬得住。
// `fit` = deps.scalpConformFit 注入（第五版拟合椭球半轴，{fitScaleX, fitScaleZ}）。
// 省略时走 panelScalpConformParams 内部的 PANEL_SCALP_CONFORM_DEFAULTS 回退（全 1，球构型）。
function panelApi(lock, proxy = SPHERE_PROXY, fit = undefined) {
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
    scalpConformFit: fit,
    sculptState: {}
  });
}

function buildPanel(lock, proxy = SPHERE_PROXY) {
  const geometry = panelApi(lock, proxy).createPanelStrandGeometry(lock);
  const index = geometry.getIndex();
  return {
    positions: Array.from(geometry.getAttribute("position").array),
    rows: Array.from(geometry.userData.gridRowIndices),
    cols: Array.from(geometry.userData.gridColIndices),
    count: geometry.getAttribute("position").count,
    indices: index ? Array.from(index.array) : []
  };
}

// 授权曲线（与 panelApi 内部构造同规则）—— 交叉判据要用**未形变**的切线。
const authoredCurve = (lock) => new THREE.CatmullRomCurve3(
  lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
);

const vertexAt = (built, index) => new THREE.Vector3(
  built.positions[index * 3],
  built.positions[index * 3 + 1],
  built.positions[index * 3 + 2]
);

// 逐行横向跨度 = 该行的横向弧长。**保弧长判据的核心量**。
//
// **必须量中面，不能量壳（本函数初版量的是 front 壳，那是错的，导致测试"因错误的原因变绿"）**：
// 内核积分保的是**中面**截面的逐段长度；两壳是沿弯后法向的 **offset curve**，其长度按
// `(1 + k·d)`（d = thickness/2）缩放 —— 那正是 §1.5 在 Houdini 上实测到的同一条律，
// 是「厚度沿弯后法向放置」的必然结果，**不是缺陷**。
// 实测对照（amount=1）：
//   width=0.62 ⇒ front 壳 1.0535..，back 壳 1.0324..，**中面 0.9994..1.0000**
//   width=5    ⇒ front 壳 0.9925..，back 壳 0.9840..，**中面 0.9875..1.0000**
// 即壳在窄面板上**增长 5.3%**（k 大 ⇒ offset 效应强），在宽面板上被离散化缩短抵消掉。
// 初版恰好只测 width=5 ⇒ 抵消掉了 ⇒ 绿。中面取「同一 (row, 逻辑列) 上 front/back 的平均」，
// 这样壳偏移**精确相消**（两壳沿同一法向、等距反向）。
function rowSpans(built) {
  const front = new Map();
  const back = new Map();
  for (let vertex = 0; vertex < built.count; vertex += 1) {
    const row = built.rows[vertex];
    if (row < 0) continue;
    const logicalColumn = Math.floor(built.cols[vertex] / 2);
    const target = built.cols[vertex] % 2 === 1 ? front : back;
    if (!target.has(row)) target.set(row, new Map());
    target.get(row).set(logicalColumn, vertexAt(built, vertex));
  }
  const spans = new Map();
  for (const [row, byColumn] of front) {
    const opposite = back.get(row);
    if (!opposite) continue;
    const columns = [...byColumn.keys()].sort((a, b) => a - b);
    const midPoints = [];
    for (const column of columns) {
      const f = byColumn.get(column);
      const b = opposite.get(column);
      if (f && b) midPoints.push(f.clone().add(b).multiplyScalar(0.5));
    }
    let total = 0;
    for (let i = 1; i < midPoints.length; i += 1) total += midPoints[i - 1].distanceTo(midPoints[i]);
    spans.set(row, total);
  }
  return spans;
}
// 折线弧长（沿 [0, u] 采 n 段）—— 判据用的量，与被测函数内部的累计方式一致。
function polylineArc(sample, u, n = 64) {
  let total = 0;
  let previous = sample(0);
  for (let i = 1; i <= n; i += 1) {
    const current = sample((u * i) / n);
    total += Math.hypot(current.lateral - previous.lateral, current.normal - previous.normal);
    previous = current;
  }
  return total;
}

test("panelBendCrossSection：k→0 逐位退化、**保弧长**（含 camber 的弯截面）、奇偶性", () => {
  // 直截面（camber ≡ 0）与抛物截面（camber ≠ 0）两种都测 —— 后者正是 0.2.138 失守的场景。
  const straight = (v) => ({ lateral: v * 2.5, normal: 0 });
  const cambered = (v) => ({ lateral: v * 2.5, normal: 0.45 * (1 - v * v) });

  // k == 0 必须**逐位**返回 sample(u)：amount==0 的逐位守恒契约建立在这上面。
  for (const sample of [straight, cambered]) {
    for (const u of [-1, -0.37, 0, 0.37, 1]) {
      const flat = panelBendCrossSection(sample, u, 0);
      const expected = sample(u);
      assert.ok(Object.is(flat.lateral, expected.lateral), `k=0 必须逐位返回 lateral：u=${u}`);
      assert.ok(Object.is(flat.normal, expected.normal), `k=0 必须逐位返回 normal：u=${u}`);
      assert.ok(Object.is(flat.angle, 0), `k=0 必须逐位返回 angle=+0：u=${u}`);
    }
  }

  // **核心判据：弯后折线长度 == 弯前折线长度**。0.2.138 在 cambered 上实测 +26.5%，
  // 因为它把 camber 当刚性偏移旋转（offset curve 的弧长按 1+n·k 放大）。
  const k = 1 / 1.05;
  for (const [name, sample] of [["straight", straight], ["cambered", cambered]]) {
    for (const u of [0.5, 1]) {
      const flatArc = polylineArc(sample, u, 16);
      // 用与被测函数同样的 16 段，累加弯后各段长度
      let bentArc = 0;
      let previous = panelBendCrossSection(sample, 0, k, 16);
      for (let i = 1; i <= 16; i += 1) {
        const current = panelBendCrossSection(sample, (u * i) / 16, k, 16);
        bentArc += Math.hypot(current.lateral - previous.lateral, current.normal - previous.normal);
        previous = current;
      }
      const ratio = bentArc / flatArc;
      assert.ok(
        Math.abs(ratio - 1) < 0.02,
        `${name} u=${u}：弯后弧长必须守恒，实测比值 ${ratio.toFixed(4)}`
      );
    }
  }

  // lateral 在 u 上是奇函数、normal 是偶函数（直截面）—— 镜像原样拷贝的推导依据。
  for (const u of [0.4, 1]) {
    const plus = panelBendCrossSection(straight, u, k);
    const minus = panelBendCrossSection(straight, -u, k);
    assert.ok(Math.abs(plus.lateral + minus.lateral) < 1e-12, `lateral 必须是奇函数：u=${u}`);
    assert.ok(Math.abs(plus.normal - minus.normal) < 1e-12, `normal 必须是偶函数：u=${u}`);
  }

  // 弯曲方向：正 k 必须朝 −normal（贴向头皮）一侧收。
  assert.ok(panelBendCrossSection(straight, 1, k).normal < -1e-6, "正 k 必须朝 −normal 弯");
});

// ── 本版存在的理由：保弧长 ────────────────────────────────────────────────────
// 上一版（逐顶点投影）把 width=5 的面板横向跨度压到 0.52 倍，用户报告"坍缩有点严重"。
// **判据直接量每一行的横向跨度**，而不是量"离头皮多远"—— 后者上一版也能过。
// **本条初版"因错误的原因变绿"，三处都要留档（0.2.143 教训，与仓库既有"回归测试写完必须
// 用变异测试确认它咬"同一条，只是这次是子智能体在复核中抓到的）**：
//   ① 量的是 **front 壳**而非中面 —— 壳是 offset curve，长度按 `(1 + k·d)` 缩放；
//   ② `min` 与 `max` 两个界**都断在 `worstRatio`（= min）上** ⇒ `< 1.001` 近乎恒真；
//   ③ 只建了 **width=5** —— 恰好是离散化缩短抵消掉壳增长的那个宽度。
// 实测：width=0.62 时 front 壳 min 就是 **1.0535**，初版的 `< 1.001` 本该**变红**。
// 现改为：量**中面**、**min/max 分别断言**、**两个宽度都建**。
test("保弧长：逐行中面横向跨度在 conform 前后守恒（min/max 双侧，两个宽度）", () => {
  for (const width of [PANEL_WIDTH, 5]) {
    const flat = buildPanel(panelLock({ width }));
    const bent = buildPanel(panelLock({ width, panelScalpConformAmount: 1 }));
    assert.equal(bent.count, flat.count);
    const flatSpans = rowSpans(flat);
    const bentSpans = rowSpans(bent);
    let lowest = Infinity;
    let highest = -Infinity;
    let checked = 0;
    for (const [row, flatSpan] of flatSpans) {
      // 发尖 taper 收到 0 的那一行跨度本就是 0（比值无意义，实测会到 800×）。
      // 判据用**相对**门限而不是绝对 1e-6：宽度不同则跨度量级不同。
      if (flatSpan < 1e-3 * width) continue;
      const ratio = bentSpans.get(row) / flatSpan;
      lowest = Math.min(lowest, ratio);
      highest = Math.max(highest, ratio);
      checked += 1;
    }
    assert.ok(checked >= 8, `sanity：width=${width} 应比较到多行，实测仅 ${checked} 行`);
    // **下界容差有推导，不是拍的**：网格是内接折线，弯曲后弦长比真实弧长短
    // `ratio = 2·sin(Δθ/2)/Δθ`。width=5、R≈1.5、amount=1 ⇒ 半跨 θ≈1.65 rad，
    // 6 个宽度分段 ⇒ Δθ≈0.55 ⇒ 理论下限 `2·sin(0.275)/0.55 ≈ 0.987`。
    // 取 0.96 留余量；被驳回的投影模型是 0.52，差一个数量级 ⇒ 判据能分开两者。
    assert.ok(lowest > 0.96, `width=${width}：中面跨度不得被压缩，最小比值 ${lowest.toFixed(6)}`);
    // **上界断在 max 上**（初版断在 min 上，等于没断）。中面弯曲**不会**变长 ——
    // 逐段保长 + 内接折线只可能变短，所以 1.001 是紧的。
    assert.ok(highest < 1.001, `width=${width}：中面跨度不得变长，最大比值 ${highest.toFixed(6)}`);
  }
});

// 壳跨度按 `(1 + k·d)` 增长是**设计的一部分**（厚度沿弯后法向放置的必然结果，
// 与 §1.5 在 Houdini 上实测的 offset-curve 律同源），不是缺陷。
// 本条把它**显式钉住**，这样：① 上一条改量中面后，壳的行为仍有测试覆盖；
// ② 谁要是"顺手把壳也弄成保长"，会立刻变红并读到这段说明。
test("壳跨度按 offset-curve 律增长（设计如此，非缺陷）", () => {
  const shellSpans = (built) => {
    const byRow = new Map();
    for (let vertex = 0; vertex < built.count; vertex += 1) {
      const row = built.rows[vertex];
      if (row < 0 || built.cols[vertex] % 2 !== 1) continue; // front 壳
      if (!byRow.has(row)) byRow.set(row, new Map());
      byRow.get(row).set(Math.floor(built.cols[vertex] / 2), vertexAt(built, vertex));
    }
    const out = new Map();
    for (const [row, byColumn] of byRow) {
      const ordered = [...byColumn.keys()].sort((a, b) => a - b).map((c) => byColumn.get(c));
      let total = 0;
      for (let i = 1; i < ordered.length; i += 1) total += ordered[i - 1].distanceTo(ordered[i]);
      out.set(row, total);
    }
    return out;
  };
  // 窄面板：R 小 ⇒ k 大 ⇒ offset 效应最明显，实测 front 壳最小比值 1.0535。
  const flat = shellSpans(buildPanel(panelLock({ width: PANEL_WIDTH })));
  const bent = shellSpans(buildPanel(panelLock({ width: PANEL_WIDTH, panelScalpConformAmount: 1 })));
  let lowest = Infinity;
  for (const [row, flatSpan] of flat) {
    if (flatSpan < 1e-3 * PANEL_WIDTH) continue;
    lowest = Math.min(lowest, bent.get(row) / flatSpan);
  }
  // 壳**必须**比中面长（`1 + k·d`，d = thickness/2 = 0.04 > 0）。
  // 若有人把壳也做成保长，这条会变红 —— 那时要改的是本注释，而不是把它删掉。
  assert.ok(
    lowest > 1.001,
    `窄面板 front 壳跨度应按 offset-curve 律增长（实测应约 1.05），最小比值 ${lowest.toFixed(6)}`
  );
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
    // **跳过发尖那一行（t == 1）**，成因是**退化截面的切向无定义**（0.2.141 实测更正了归因）：
    // TAPER_TO_ZERO 让 t=1 处宽度收成 0 ⇒ 截面退化成一个点 ⇒「弯后切向 angle」没有定义。
    // 网格侧得 angle=0（逐段循环一次都没进），把手侧得非零值，于是壳厚被放到不同方向上。
    // 实测拆解：中面**都恰好落在 1.5（一致）**，只有半程壳厚不同（网格 ±0.0400 / 把手 ±0.0379，
    // 比值 0.9475 = cos(18.8°)）。**曾误记为「tipPanelWidthAt 与 panelWidthAt 取值不同」，
    // 那是错的** —— 两者是同一公式、同一 fullWidth；`splits=null` vs `[]` 也实测无差别。
    // 修它要给退化截面定义一个确定切向（如沿用上一行的 angle），属独立改动。
    if (row >= LENGTH_LOOPS) continue;
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

// ── ⑦ 弯曲轴与切线无关、与头心有关 ────────────────────────────────────────────
// **取代 0.2.142 的 `k·cos²α` 测试**（那条断言「宽度方向越竖直、弯曲越弱」，是对**错误轴**
// 的症状补偿；本版把轴换成头部几何后，该性质不再成立也不该成立）。
//
// 判据取**纯函数层**并且**正反两条都要**：只断言「转切线不变」的话，一个恒返回 null 的 stub
// 也能过；只断言「移头心会变」的话，旧模型（轴来自 frame）也能过 —— 因为 params 里含 center。
// 两条合起来才唯一地钉住「轴来自头、不来自面板 frame」。
// **第五版改写**：「移头心必变」在球构型下不再成立（`C.y` 被纬线密切圆代数消掉，见文件头
// 「第五版契约更新」）。原用例名与"必变"断言只在球构型下测过，实为对旧「胶囊轴」模型的
// 误判——现拆成三条：① 转切线不变（原样保留）；② 移 `C.x`/`C.z` 必变（任何构型都成立）；
// ③ 移 `C.y` 在球构型（`ax==az`）下不变、在各向异性（`ax≠az`）下必变（双向，唯一钉死语义）。
test("⑦ 弯曲轴取自头部几何：转切线不变、移 C.x/C.z 必变、移 C.y 仅各向异性下变", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1 });
  const api = panelApi(lock);
  const params = api.panelScalpConformParams(lock);
  // camber ≡ 0：让判据只看弯曲本身，不掺 camber 投影到弯曲轴上的残余分量。
  const sample = (v) => ({ lateral: v * 2.5, normal: 0 });
  // 固定 point 与宽度方向，只转 frame.z（面板法向）绕 frame.x 转。
  // **角度刻意限在 ±60°**：实现按 `frame.z · r̂` 的符号给径向定向，转过 90° 会翻符号 ——
  // 那是设计行为（面板翻面则弯曲方向也翻），不是本条要测的东西。
  const point = new THREE.Vector3(0, 1.7, 1.5);
  const bendAt = (degrees) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    const frame = {
      point,
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, -Math.cos(radians), Math.sin(radians)),
      z: new THREE.Vector3(0, Math.sin(radians), Math.cos(radians))
    };
    return api.panelScalpConformOffsets(params, sample, 1, 0, null, null, frame);
  };
  const upright = bendAt(0);
  assert.ok(upright, "sanity：amount=1 必须给出非 null 位移");
  assert.ok(upright.length() > 0.1, `sanity：位移量级应显著，实测 ${upright.length()}`);
  for (const degrees of [-60, -30, 30, 60]) {
    const rotated = bendAt(degrees);
    assert.ok(
      rotated.distanceTo(upright) < 1e-9,
      `切线/法向转 ${degrees}° 不得改变弯曲（轴取自头，不取自 frame）：偏差 ${rotated.distanceTo(upright)}`
    );
  }
  const uprightFrame = { point, x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1) };
  const offsetsAt = (proxy, fit) => {
    const moved = panelApi(lock, proxy, fit);
    return moved.panelScalpConformOffsets(moved.panelScalpConformParams(lock), sample, 1, 0, null, null, uprightFrame);
  };
  // 移动 C.x 或 C.z：任何构型下都必须改变结果（水平位置直接改变每一行的 dx/dz）。
  const movedX = offsetsAt({ ...SPHERE_PROXY, x: 0.3 });
  assert.ok(movedX.distanceTo(upright) > 1e-3, `移动 C.x 必须改变弯曲，偏差仅 ${movedX.distanceTo(upright)}`);
  const movedZ = offsetsAt({ ...SPHERE_PROXY, z: -0.2 });
  assert.ok(movedZ.distanceTo(upright) > 1e-3, `移动 C.z 必须改变弯曲，偏差仅 ${movedZ.distanceTo(upright)}`);
  // 移动 C.y，球构型（默认 fit 全 1，ax==az）：代数上精确不变（h/A/B 随 P.y-C.y 变化，
  // 但纬线是圆时密切圆心恰好落回 (C.x, P.y, C.z)，与 C.y 无关）—— 断言 maxDiff === 0。
  const movedYSphere = offsetsAt({ ...SPHERE_PROXY, y: 0.2 });
  assert.equal(
    movedYSphere.distanceTo(upright), 0,
    `球构型下移动 C.y 不得改变弯曲（代数消掉），实测偏差 ${movedYSphere.distanceTo(upright)}`
  );
  // 各向异性（ax≠az）：移动 C.y 现在必须改变结果，否则"仅各向异性下变"是空话。
  const anisoFit = { fitScaleX: 1.4, fitScaleZ: 0.9 };
  const anisoUpright = offsetsAt(SPHERE_PROXY, anisoFit);
  const anisoMovedY = offsetsAt({ ...SPHERE_PROXY, y: 0.2 }, anisoFit);
  assert.ok(
    anisoMovedY.distanceTo(anisoUpright) > 1e-3,
    `各向异性下移动 C.y 必须改变弯曲，偏差仅 ${anisoMovedY.distanceTo(anisoUpright)}`
  );
});

// ── ⑧ 逐行半径（负向对照：全局标量会让两行拿到同一曲率）────────────────────────
// 这是 0.2.138–142 根因 B 的回归：`bendRadius` 曾是单一全局标量 1.1，而真实档各行到头心
// 距离是 1.021–1.440 ⇒ 外侧行过度卷绕、边缘扎进头里（实测最深 +0.235）。
//
// **第五版改写（用例名去掉"胶囊轴"）**：旧断言「球冠区与圆柱区必须给出不同曲率」
// （`bendAtRadius(1.4,1.5)` vs `bendAtRadius(0.5,1.5)`）测的是已废除的球冠/圆柱二分——
// 纬线轴下同一水平距离的两行 `Reff` 恒等（球构型下密切圆心恒为 `(C.x,P.y,C.z)`，
// 见文件头「第五版契约更新」），该断言现在恒假。反过来钉：同一水平距离、不同高度
// ⇒ **`Reff` 相同 ⇒ 位移相同**，这正是纬线模型的核心不变式（取代原来"必须不同"）。
test("⑧ 曲率逐行取自该行到纬线轴的真实水平距离", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1, panelScalpConformGap: 0 });
  const api = panelApi(lock);
  const params = api.panelScalpConformParams(lock);
  assert.ok(params.center instanceof THREE.Vector3, "params 必须暴露 center（世界坐标头心）");
  assert.equal(params.bendRadius, undefined, "bendRadius 必须已删除（根因 B）");
  const sample = (v) => ({ lateral: v * 2.5, normal: 0 });
  // **判据量必须是「相对平板的位移」，不是 |offset|**（初版写错，实测证伪）：
  // `|offset| = √(along² + inward²)`，而 `along = sin(ks)/k → s` 当 `k → 0`。所以**越平**的
  // wrap 给出**越大**的 |offset|（趋近 s=2.5），方向与"曲率越大位移越大"相反。
  // 手算核对：s=2.5 时 R=1.5 ⇒ |offset|=2.2206、R=2.5 ⇒ 2.3970（实测 2.2246 / 2.3987，
  // 差异来自默认 gap=0.02）—— 代码是对的，是我的断言方向反了。
  const FLAT_AT_U1 = new THREE.Vector3(2.5, 0, 0); // sample(1) 在该 frame 下的平板偏移
  const bendAtRadius = (y, z) => {
    const point = new THREE.Vector3(0, y, z);
    const offsets = api.panelScalpConformOffsets(params, sample, 1, 0, null, null, {
      point,
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, 1)
    });
    return offsets.clone().sub(FLAT_AT_U1);
  };
  // 同一水平距离 z=1.5，三个不同高度（含头心以上与以下）：球构型下 Reff 恒为 1.5，
  // 位移必须逐值相同——这正是纬线模型取代"球冠/圆柱二分"的核心不变式。
  const highY = bendAtRadius(1.4, 1.5);
  const midY = bendAtRadius(0.9, 1.5);
  const lowY = bendAtRadius(0.5, 1.5);
  assert.ok(
    Math.abs(highY.length() - midY.length()) < 1e-9 && Math.abs(midY.length() - lowY.length()) < 1e-9,
    `同一水平距离、不同高度必须给出相同位移（纬线轴，球构型）：${highY.length()} / ${midY.length()} / ${lowY.length()}`
  );
  // 不同水平距离（z=1.5 vs z=2.5，同高度 y=0.9）：曲率逐行取自到轴的真实水平距离，位移必须不同。
  const near = bendAtRadius(0.9, 1.5);
  const far = bendAtRadius(0.9, 2.5);
  // 半径越大 ⇒ 曲率越小 ⇒ 相对平板的位移越小。全局标量会让两者相等。
  assert.ok(
    far.length() < near.length() - 1e-6,
    `半径 2.5 的行位移必须小于半径 1.5 的行（逐行曲率）：${far.length()} vs ${near.length()}`
  );
  // gap 加在半径上 ⇒ 曲率变小 ⇒ 相对平板的位移变小（同上，量的是位移不是 |offset|）
  const gappedLock = panelLock({ width: 5, panelScalpConformAmount: 1, panelScalpConformGap: 0.4 });
  const gappedApi = panelApi(gappedLock);
  const gapped = gappedApi.panelScalpConformOffsets(
    gappedApi.panelScalpConformParams(gappedLock),
    sample,
    1,
    0,
    null,
    null,
    { point: new THREE.Vector3(0, 0.9, 1.5), x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1) }
  ).sub(FLAT_AT_U1);
  assert.ok(
    gapped.length() < near.length() - 1e-6,
    `gap 必须加到弯曲半径上（位移变小）：${gapped.length()} vs ${near.length()}`
  );
});

// 头心必须**跟随注入的 scalpSurface**，不能是几何层写死的常数。
// **与 0.2.138–142 的差别**：那版把 `bendRadius` 由 `(radius·scaleX + radius·scaleZ)/2 + gap`
// 算成一个全局标量，于是 `scaleX/scaleZ` 直接进半径、`scaleY` 刻意排除。本版**没有**这个标量
// —— 卷绕半径是该行到纬线密切圆心的真实距离，所以三个 scale 只通过「面板相对 center 落在哪」
// 间接影响结果。因此本条只钉 `center`，并要求几何输出确实随 center 改变。
// **第五版改写**：「移动头心必须改变边缘落点」在球构型（默认 fit 全 1）下现在必然为假
// （`C.y` 被纬线密切圆代数消掉，见文件头「第五版契约更新」；`C.x`/`C.z` 仍必变）。
test("头心跟随注入的 scalpSurface（非写死常数）", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1, panelScalpConformGap: 0 });
  const sphere = panelApi(lock, SPHERE_PROXY).panelScalpConformParams(lock);
  assert.ok(
    sphere.center.distanceTo(new THREE.Vector3(SPHERE_PROXY.x, SPHERE_PROXY.y, SPHERE_PROXY.z)) < 1e-12,
    `center 必须等于代理位置，得到 ${sphere.center.toArray()}`
  );
  const offCentre = panelApi(lock, ELLIPSOID_PROXY).panelScalpConformParams(lock);
  assert.ok(
    offCentre.center.distanceTo(new THREE.Vector3(ELLIPSOID_PROXY.x, ELLIPSOID_PROXY.y, ELLIPSOID_PROXY.z)) < 1e-12,
    `center 必须跟随代理的 x/y/z，得到 ${offCentre.center.toArray()}`
  );
  // 几何层实际输出也必须随 C.x/C.z 改变（不只是参数字段不同）——任何构型都成立。
  const here = panelApi(lock, SPHERE_PROXY).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  const thereX = panelApi(lock, { ...SPHERE_PROXY, x: 0.3 }).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  assert.ok(here.distanceTo(thereX) > 1e-6, "移动 C.x 必须改变边缘落点");
  const thereZ = panelApi(lock, { ...SPHERE_PROXY, z: -0.2 }).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  assert.ok(here.distanceTo(thereZ) > 1e-6, "移动 C.z 必须改变边缘落点");
  // 移动 C.y：球构型（默认 fit 全 1）下不得改变边缘落点——代数上精确消掉。
  const thereY = panelApi(lock, { ...SPHERE_PROXY, y: 0.2 }).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  assert.equal(here.distanceTo(thereY), 0, `球构型下移动 C.y 不得改变边缘落点，实测偏差 ${here.distanceTo(thereY)}`);
  // 各向异性拟合椭球（ax≠az）下，移动 C.y 现在必须改变边缘落点（否则上面那条断言空转）。
  const anisoFit = { fitScaleX: 1.4, fitScaleZ: 0.9 };
  const hereAniso = panelApi(lock, SPHERE_PROXY, anisoFit).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  const thereAniso = panelApi(lock, { ...SPHERE_PROXY, y: 0.2 }, anisoFit).tipMainSectionPoint(lock, 0.6, 1, 0, null, -1, null);
  assert.ok(
    hereAniso.distanceTo(thereAniso) > 1e-6,
    `各向异性下移动 C.y 必须改变边缘落点（否则球构型下不变这条断言空转），实测偏差 ${hereAniso.distanceTo(thereAniso)}`
  );
  // 缺省代理（deps.scalpSurface 未注入）必须走 fallback 而不是崩
  const bare = createPanelTipStrandApi({
    strandGeometryCurve: () => new THREE.CatmullRomCurve3(lock.points.map((p) => new THREE.Vector3(p.x, p.y, p.z))),
    strandGeometryFrameAt: () => ({ x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1) }),
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    normalizePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    clonePanelSplits: (v) => (Array.isArray(v) ? v.map((s) => ({ ...s })) : []),
    isPanelGeometry: (i) => i?.geometryType === "panel" || i?.geometryType === "surface",
    sculptState: {}
  });
  assert.ok(bare.panelScalpConformParams(lock).center instanceof THREE.Vector3, "缺省代理必须给出 fallback center");
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
  assert.equal((curveMath.match(/export function panelBendCrossSection\(/g) || []).length, 1);
  // 消费方不得自己写 sin/cos 的弯曲式（那会变成第二个定义点）
  assert.doesNotMatch(panelTip, /Math\.sin\([^)]*\)\s*\/\s*k/, "panel-tip-strand 不得重写弯曲公式");
  assert.doesNotMatch(panelTip, /1\s*-\s*Math\.cos\(/, "panel-tip-strand 不得重写弯曲公式");
  assert.doesNotMatch(app, /panelBendCrossSection/, "app.js 不得参与几何推导");
  // 两个消费点（几何 + 宽度把手复刻）各调一次 panelScalpConformOffsets。
  // 正则**不锁参数写法**：0.2.141 给几何侧那处加了 memo 参数、换成多行调用，旧的
  // `panelScalpConformOffsets\(conform,` 单行式因此漏掉一处（实测 1 ≠ 2）。判据要问的是
  // 「有几个消费点」，不是「参数怎么排版」，所以只匹配函数名 + 左括号。
  // 负向 lookbehind 排除**定义**那一处，其余即调用点。两版错误的写法留档：
  // `…\(conform,` 漏掉多行调用；`…\(\s` 反过来漏掉单行调用（`(conform` 后无空白）。
  assert.equal((panelTip.match(/(?<!function )panelScalpConformOffsets\(/g) || []).length, 2);
  // 被删的四代旧 API 不得复活
  for (const dead of ["capsuleEndNearestSurface", "panelScalpConformWeight", "panelHemisphereOffset"]) {
    assert.doesNotMatch(curveMath, new RegExp(`export function ${dead}\\(`), `${dead} 必须已删除`);
  }
  // 0.2.143 删掉的两个东西不得残留（根因 A 的 cos²α 补偿、根因 B 的全局标量）
  assert.doesNotMatch(panelTip, /horizontality/, "k·cos²α 的 horizontality 必须已删除（对错误轴的补偿）");
  assert.doesNotMatch(panelTip, /bendRadius/, "全局标量 bendRadius 必须已删除（根因 B）");
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
  // 0.2.143 起 offsets 是**世界空间 Vector3**（弯曲平面由头部几何决定，不再是面板的
  // (frame.x, frame.z)），但这条断言的意图不变：app.js 完全不参与几何推导。
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

// ── ⑥ 不穿透：0.2.138–142 的病根，本版存在的首要理由 ──────────────────────────
// 判据取**幅度**：amount=1 不得比平板基线更深地进入头部代理。
// 真实档实测（改动前）：平板全部在外（−0.079…−0.817），amount=0.87 时第 3–8 行钻进去、
// 最深 **+0.235**。构造保证：中线恒在距轴 R 处，弧半径 (R+gap)/amount ≥ R ⇒ 边缘只会更外。
function deepestPenetration(built, proxy = SPHERE_PROXY) {
  const centre = new THREE.Vector3(proxy.x, proxy.y, proxy.z);
  let worst = -Infinity;
  let worstRow = -1;
  for (let vertex = 0; vertex < built.count; vertex += 1) {
    const local = vertexAt(built, vertex).sub(centre);
    const normalised = Math.hypot(
      local.x / proxy.scaleX,
      local.y / proxy.scaleY,
      local.z / proxy.scaleZ
    ) / proxy.radius;
    const depth = 1 - normalised;
    if (depth > worst) {
      worst = depth;
      worstRow = built.rows[vertex];
    }
  }
  return { worst, worstRow };
}

test("⑥ 不穿透：amount=1 不得比平板基线更深地进入头部代理", () => {
  for (const width of [PANEL_WIDTH, 5]) {
    const flat = deepestPenetration(buildPanel(panelLock({ width })));
    for (const amount of [0.5, 0.87, 1, -1]) {
      const bent = deepestPenetration(buildPanel(panelLock({ width, panelScalpConformAmount: amount })));
      // **判据是「不穿透」，不是「不得比平板更靠近头」**（初版写成后者，实测证伪）：
      // conform 的**职责**就是把面板拉近头皮，所以「离头更近」是功能而非缺陷 —— 实测
      // 平板 −0.4736 → 弯后 −0.4675，两者**都在头外**却被判红。
      // 正确形式：`≤ max(0, 平板最深)`。取 max 是为了「若平板本身已穿透，至少不许更深」。
      const ceiling = Math.max(0, flat.worst);
      assert.ok(
        bent.worst <= ceiling + 1e-6,
        `width=${width} amount=${amount}：穿透 ${bent.worst.toFixed(4)}（第 ${bent.worstRow} 行）`
        + ` 不得超过上限 ${ceiling.toFixed(4)}（平板基线 ${flat.worst.toFixed(4)}）`
      );
    }
  }
});

// ── ⑥b 行不交叉 + 面积比 ─────────────────────────────────────────────────────
// **本条替换了初版的「最小行进 ≥ 0.6× 基线」** —— 那个阈值是我**拍的不是推的**，实测真实档
// 只有 0.295×（经几何 API）/ 0.114×（从零复现模型），根本不可达；而且「最小行进」是**极值**
// 判据，一个致密格子就主宰它，**分不开「一处紧」与「整片塌」**。
// 宽度精确 ⇒ 由 Gauss 定理畸变必然落到行距上，压缩是设计而非缺陷（见计划 §3）。
//
// 真正的折叠判据：行内 wrap 是刚性弯一条曲线、**恒单射**，所以唯一可能的折叠是
// 「第 r+1 行沿脊柱**退到**第 r 行后面」⇒ `(P[r+1] − P[r]) · tangent > 0`。
// tangent 取**授权曲线**的切线（与形变无关，避免用形变后的量去判形变）。
function rowCrossings(built, curve, amount) {
  const byRow = new Map();
  for (let vertex = 0; vertex < built.count; vertex += 1) {
    if (built.cols[vertex] % 2 !== 1) continue; // front 壳，取一条干净的纵向链
    const row = built.rows[vertex];
    if (row < 0) continue;
    if (!byRow.has(row)) byRow.set(row, new Map());
    byRow.get(row).set(built.cols[vertex], vertexAt(built, vertex));
  }
  const rows = [...byRow.keys()].sort((a, b) => a - b);
  let crossings = 0;
  let checked = 0;
  let worst = Infinity;
  for (let index = 1; index < rows.length; index += 1) {
    const tangent = curve.getTangent(rows[index] / LENGTH_LOOPS).normalize();
    const previous = byRow.get(rows[index - 1]);
    for (const [col, point] of byRow.get(rows[index])) {
      const before = previous.get(col);
      if (!before) continue;
      const advance = point.clone().sub(before).dot(tangent);
      checked += 1;
      worst = Math.min(worst, advance);
      if (advance <= 0) crossings += 1;
    }
  }
  return { crossings, checked, worst, amount };
}

const totalArea = (built) => {
  let area = 0;
  for (let face = 0; face < built.indices.length; face += 3) {
    const a = vertexAt(built, built.indices[face]);
    const b = vertexAt(built, built.indices[face + 1]);
    const c = vertexAt(built, built.indices[face + 2]);
    area += new THREE.Vector3().crossVectors(b.sub(a), c.sub(a)).length() * 0.5;
  }
  return area;
};

// **本条的断言形态是实测定的，不是推的** —— 我先后错了两次，留档以免第三次：
//   错 1「shrinking taper ⇒ 不可能交叉」：实测本 fixture 在 0.87 处交叉 6/70。
//   错 2「camber 残余沿 â 泄漏到脊柱方向所致」：把 `panelCurvature` 设 0 后交叉**变多**
//        （8/70 vs 6/70 @1.0、2/70 vs 0/70 @0.5）⇒ camber 其实略微**帮忙**，假设被证伪。
// **真正的机理（手算核对过）**：`n̂`（径向）与脊柱切线**不垂直**（本 fixture 实测
// `â·tangent` 从 0.88 升到 1.00），所以「朝内卷」的位移 `(1−cos θ)/k` 有一个**沿脊柱**的分量；
// 而该位移随 halfW 变化 ⇒ 逐行不等。amount=1 时第 0 行沿脊柱被推 +0.714、第 2 行 +0.423，
// 差 0.145/行 > 行本身的推进 0.1/行 ⇒ 净推进为负 = 交叉。
// **即：wrap 会沿脊柱重参数化。** 只要 (a) n̂ 不垂直于切线、(b) wrap 量沿脊柱变化，就会发生 ——
// 两条都是通例，所以这是模型的**固有限制**，不是某个档的巧合。既存缺陷、非本轮引入
// （旧模型同构型更差：0.5 处旧 4/170 vs 新 0/170，1.0 处最差点积旧 −0.217 vs 新 −0.088）。
test("⑥b 行交叉：amount ≤ 0.5 不得交叉；更高 amount 记录天花板防回归", () => {
  const curve = authoredCurve(panelLock());
  const flat = rowCrossings(buildPanel(panelLock({ width: 5 })), curve, 0);
  assert.ok(flat.checked > 0, "sanity：确实比较过行对");
  assert.equal(flat.crossings, 0, `平板基线不得有交叉，实测 ${flat.crossings}/${flat.checked}`);
  // 中等 amount 必须干净 —— 这是本轮相对旧模型的**实际改善**（旧模型 0.5 处已交叉 4/170）。
  for (const amount of [0.5, -0.5, -1]) {
    const bent = rowCrossings(buildPanel(panelLock({ width: 5, panelScalpConformAmount: amount })), curve, amount);
    assert.equal(
      bent.crossings,
      0,
      `amount=${amount} 不得交叉，实测 ${bent.crossings}/${bent.checked}（最差推进 ${bent.worst.toExponential(3)}）`
    );
  }
  // 高 amount：**记录实测天花板**而不是假装为零。数字放宽一档留离散化余量。
  // **变异测试实测（把逐行半径退回全局标量 1.1 = 根因 B）**：交叉数 6 → **10**（超天花板 8
  // ⇒ 变红，**这一半会咬**）；但最差推进 −0.044 → **−0.029**（反而更浅 ⇒ 仍在 −0.06 之内
  // ⇒ **深度那一半不咬这个变异**）。留档以免高估该断言：交叉**数**是判别量，
  // **深度**只防「更少但更深」的另一类退化，两者职责不同、不可互相替代。
  const CEILING = { 0.87: { crossings: 8, worst: -0.05 }, 1: { crossings: 8, worst: -0.06 } };
  for (const [key, limit] of Object.entries(CEILING)) {
    const amount = Number(key);
    const bent = rowCrossings(buildPanel(panelLock({ width: 5, panelScalpConformAmount: amount })), curve, amount);
    assert.ok(
      bent.crossings <= limit.crossings,
      `amount=${amount} 交叉数不得超过既有天花板 ${limit.crossings}，实测 ${bent.crossings}/${bent.checked}`
    );
    assert.ok(
      bent.worst >= limit.worst,
      `amount=${amount} 交叉深度不得超过既有天花板 ${limit.worst}，实测 ${bent.worst.toExponential(3)}`
    );
  }
});

// ── ⑥d camber 会削弱「不穿透」，把当前边界钉住 ──────────────────────────────
// **这条记录的是一个真实限制，不是一条保证**。计划 §5.2 原本无条件断言「不穿透由构造保证」，
// 那是**错的**（已更正）：弯曲积分器从 `sample(0)` 起步，而该点的法向分量
// `b0 = panelCurvature · halfWidth` 不为 0 ⇒ 卷绕圆的圆心被推离胶囊轴 b0，
// 弧的近侧只到 `R + 2·gap − b0`。实测 `min(边缘到轴距离 − R)`（gap=0.1、amount=1、等宽 taper）：
//   curvature=0    ⇒ −0.040000（= 壳半厚，弯曲本身贡献 0）
//   width=5 c=0.18 ⇒ −0.309851（代理穿透 −0.1901，仍在头外）
//   width=5 c=0.36 ⇒ −0.628973（代理穿透 **+0.1290，真的进头里**）
// **已验证的修法**：半径从截面自己的中心量起（`k = amount/(R + gap + b0)`）⇒ 每种构型都回到
// −0.040000。**未采用**：它改变含 camber 面板的曲率语义 = 设计变更，需用户确认。
// 本测试因此断言「默认 curvature 安全」+「极端 curvature 会穿透」，两条都是**当前事实**；
// 若将来采用修法，第二条会变红 —— 那时**应当**更新它，而不是当作回归。
// **⚠️ 本条的"安全"只在本 fixture 的余量下成立，勿外推到真实工程**（CDP 扫描实测更正）：
// 常量 frame 的 fixture 把面板 seat 在距代理 **0.47** 处，而真实 frame 链（含 ±24°/环 roll
// 钳位）只有 **0.075** —— 同一个 `b0` 亏空在这里兜得住、在真实工程里兜不住。
// 真实链实测（gap=0.1、curvature=0.18 默认）：amount ≤ 0.87 时最深 −0.021（安全），
// 但 **amount = 1.0 时穿透 +0.249**。所以「默认 curvature 安全」这句话**只覆盖到 0.87**。
// 真实档的把关在 `scripts/verify-scalp-conform.mjs`（按存档作者值判），本条只守纯函数不变式。
test("⑥d camber 边界：默认 curvature 不穿透；极端 curvature 会（当前已知限制）", () => {
  const equalWidth = {
    taperCurve: CONSTANT_CURVE.map((point) => ({ ...point })),
    taperCurveSecondary: CONSTANT_CURVE.map((point) => ({ ...point }))
  };
  const safe = deepestPenetration(buildPanel(panelLock({
    width: 5, panelCurvature: 0.18, panelScalpConformAmount: 1, panelScalpConformGap: 0.1, ...equalWidth
  })));
  assert.ok(safe.worst < 0, `默认 curvature 0.18 不得穿透，实测 ${safe.worst.toFixed(4)}`);
  const extreme = deepestPenetration(buildPanel(panelLock({
    width: 5, panelCurvature: 0.36, panelScalpConformAmount: 1, panelScalpConformGap: 0.1, ...equalWidth
  })));
  // 负向对照性质：把它钉成「> 0」而不是「随便什么值」，这样一旦采用 b0 修法就会立刻变红，
  // 强制有人来更新本注释与计划，而不是让一个已修掉的限制继续伪装成"已知问题"。
  assert.ok(
    extreme.worst > 0,
    `curvature 0.36 + width 5 目前**会**穿透（已知限制）。实测 ${extreme.worst.toFixed(4)}；`
    + "若已 > 0 变成 <= 0，说明 b0 修法被采用了 —— 请更新本测试与计划 §5.2，勿当回归。"
  );
  assert.ok(
    extreme.worst > safe.worst,
    `camber 越大穿透越深（单调）：0.36 ⇒ ${extreme.worst.toFixed(4)} 应深于 0.18 ⇒ ${safe.worst.toFixed(4)}`
  );
});

// ── ⑥e 厚度守恒（**网格路径 / 带缓存**）──────────────────────────────────────
// **为什么已有的厚度测试不够**：那条走 `tipMainSectionPoint`（`cache=null`、且返回的是
// float64），而**几何路径共用一份 per-build memo**，key 是 `(sampleT, u, segment, bone)`
// —— **两个壳共享同一条缓存记录**（shellOffset 在缓存之外才叠加）。若哪天把「已叠加壳厚的
// 向量」写进缓存，front 的值就会被 back 复用 ⇒ **两壳塌到同一张面上、厚度归零**，
// 而已有测试完全看不见（它压根不走缓存）。本条直接量**网格顶点**，把该失效模式钉住。
//
// **容差必须是 1e-6，不能是 1e-9**：`BufferAttribute` 是 Float32Array，|p|≈2 处相对精度
// ~2.4e-7。**负向对照**（`amount=0`，根本不进弯曲路径）实测同样落在 1e-7 量级 ⇒ 证明这点
// 残差是**存储精度**而非 conform 引入。这正是计划 §8 判据 6 那条「跨路径比较用 1e-6，
// 逐位断言只用于同一条代码路径同一个值」。
test("⑥e 厚度守恒（网格路径，带缓存）：两壳不得塌到一起", () => {
  const THICKNESS = 0.08;
  const deviations = [];
  for (const amount of [0, 0.5, 0.87, 1, -1]) {
    const built = buildPanel(panelLock({ width: 5, panelThickness: THICKNESS, panelScalpConformAmount: amount }));
    const front = new Map();
    const back = new Map();
    for (let vertex = 0; vertex < built.count; vertex += 1) {
      const row = built.rows[vertex];
      if (row < 0) continue;
      const key = `${row}:${Math.floor(built.cols[vertex] / 2)}`;
      (built.cols[vertex] % 2 === 1 ? front : back).set(key, vertexAt(built, vertex));
    }
    let worst = 0;
    let coincident = 0;
    let pairs = 0;
    for (const [key, f] of front) {
      const b = back.get(key);
      if (!b) continue;
      pairs += 1;
      const separation = f.distanceTo(b);
      worst = Math.max(worst, Math.abs(separation - THICKNESS));
      // 塌到一起 = 缓存泄漏的直接症状。门限取 thickness 的一半，远离浮点噪声。
      if (separation < THICKNESS * 0.5) coincident += 1;
    }
    assert.ok(pairs > 50, `sanity：amount=${amount} 应比较到足够多的壳对，实测 ${pairs}`);
    assert.equal(coincident, 0, `amount=${amount}：有 ${coincident}/${pairs} 对两壳塌到一起（疑似缓存把壳厚写进了共享记录）`);
    assert.ok(
      worst < 1e-6,
      `amount=${amount}：网格上两壳间距应恒为 thickness，最大偏差 ${worst.toExponential(3)}（容差 1e-6，float32 存储精度）`
    );
    deviations.push({ amount, worst });
  }
  // **负向对照的用法**：弯曲各档的偏差必须与 `amount=0`（不进弯曲路径）**同量级**。
  // 若 conform 真的剪切了厚度，弯曲档会比对照高出一个数量级，这条就会红。
  const control = deviations.find((entry) => entry.amount === 0).worst;
  for (const entry of deviations) {
    if (entry.amount === 0) continue;
    assert.ok(
      entry.worst < Math.max(control * 8, 1e-6),
      `amount=${entry.amount} 的偏差 ${entry.worst.toExponential(3)} 应与对照 ${control.toExponential(3)} 同量级`
    );
  }
});

test("⑥c 面积比：抓坍缩而非固有行距损失（门限 0.75，被驳回的投影模型约 0.5）", () => {
  const flat = totalArea(buildPanel(panelLock({ width: 5 })));
  assert.ok(flat > 0, "sanity：平板面积必须为正");
  for (const amount of [0.5, 0.87, 1]) {
    const ratio = totalArea(buildPanel(panelLock({ width: 5, panelScalpConformAmount: amount }))) / flat;
    // 门限刻意宽松：它的职责是抓**坍缩**（0.2.136/137 逐顶点投影会掉到 ≈0.5），
    // 不是去管「宽度精确 ⇒ 行距压缩」那部分固有损失（真实档实测 0.80）。
    assert.ok(ratio >= 0.75, `amount=${amount} 面积比 ${ratio.toFixed(4)} 低于 0.75，疑似坍缩`);
  }
});

// ── 镜像：位移本身在 X 镜像下必须严格反对称 ──────────────────────────────────
// 现有测试只断言了 app.js 的**源码文本**（两值原样拷贝），没有断言**几何**真的镜像。
//
// **为什么这条必须在纯函数层做**：`panelLock` 的曲线整条位于 x=0 平面上，把 points 的 x 取负
// 得到的是**同一条曲线**；而 harness 注入的是**常量 frame**，也不会跟着镜像。所以走
// `buildPanel` 的"镜像"实为自比，断言 `|a.x + b.x| < 1e-6` 会要求每个顶点 x≈0 —— 但面板宽度
// 5 时 x 跨 ±2.5，于是**因为错误的原因变红**。我初版就是这么写的，改成在这里手工镜像 frame。
//
// 符号推导（M(v) = (−v.x, v.y, v.z)，头心在 x=0 上）：r⃗ ↦ M(r⃗) ⇒ n̂ ↦ M(n̂)、x̂_t ↦ M(x̂_t)；
// 叉积在反射下变号 ⇒ â ↦ −M(â)，而 residual = d⃗·â ↦ −residual，两个负号相消。
// 弯曲平面内的一对坐标 (d⃗·x̂_t, d⃗·n̂) **完全不变**、k 也不变（R 相同）⇒ world ↦ M(world)。
// 即：同一个 u 处，位移严格镜像 —— 这正是「两值原样拷贝、不取反不互换」的推导依据。
test("镜像：同一 u 处的位移在 X 镜像下严格反对称", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 0.87 });
  const api = panelApi(lock);
  const params = api.panelScalpConformParams(lock);
  const sample = (v) => ({ lateral: v * 2.5, normal: 0.45 * (1 - v * v) }); // camber ≠ 0：让 residual 非零
  const offsetFor = (mirror) => {
    const sign = mirror ? -1 : 1;
    return api.panelScalpConformOffsets(params, sample, 0.7, 0.03, null, null, {
      point: new THREE.Vector3(sign * 0.6, 1.7, 1.5),
      x: new THREE.Vector3(sign * 1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, 1)
    });
  };
  const source = offsetFor(false);
  const partner = offsetFor(true);
  assert.ok(source && partner, "sanity：两侧都必须给出非 null 位移");
  assert.ok(source.length() > 0.05, `sanity：位移量级应显著，实测 ${source.length()}`);
  // 容差 1e-9：这里是纯 float64 运算（未经 BufferAttribute 的 float32 存储），
  // 但跨符号路径仍不宜逐位断言（AGENT_QUICKSTART.md §5 探针容差那条）。
  const worst = Math.max(
    Math.abs(source.x + partner.x),
    Math.abs(source.y - partner.y),
    Math.abs(source.z - partner.z)
  );
  assert.ok(worst < 1e-9, `X 镜像下位移必须严格反对称，最大偏差 ${worst.toExponential(3)}`);
  // **第五版改写 sanity 前置条件**：旧断言「camber 必须在弯曲轴上留下非零残余分量」
  // （`|source.y| > 1e-9`）在新模型下**结构性恒为 0**——弯曲轴 â 恒竖直（0,±1,0），
  // camber 位移落在水平面内，residual = d⃗·â 沿竖直轴，而这里的 d⃗（camber 贡献）没有
  // 竖直分量，所以该 sanity 已不适用（不是"用户没测到"，是"这个量本来就该是 0"）。
  // 换成两条在本版下确实有意义、非空转的前置：
  // ① â 恒竖直：world offset 没有绕轴分量泄漏出竖直以外的方向——用 offset.y === 0 直接钉住
  //   「â=(0,±1,0)」这条文件头声明的不变式（否则镜像断言可能是在一个退化到 0 的分量上空转）。
  assert.equal(source.y, 0, `sanity：弯曲轴 â 恒竖直 ⇒ world offset 的 y 分量必须精确为 0，实测 ${source.y}`);
  // ② camber 确实参与了这份位移（把 camber 关掉，位移必须变化）——防止"看似非零其实是
  //   flat 分支在空转"：若 camber 被静默丢弃，下式会恒等于 0。
  const flatSample = (v) => ({ lateral: v * 2.5, normal: 0 });
  const noCamber = api.panelScalpConformOffsets(params, flatSample, 0.7, 0.03, null, null, {
    point: new THREE.Vector3(0.6, 1.7, 1.5),
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, -1, 0),
    z: new THREE.Vector3(0, 0, 1)
  });
  assert.ok(
    source.distanceTo(noCamber) > 1e-6,
    `sanity：camber 必须实际改变这份位移（否则镜像断言可能在退化输入上空转），差异 ${source.distanceTo(noCamber)}`
  );
});

// ── 第五版新增 1：拟合椭球确实参与 conform（deps.scalpConformFit） ────────────────
// **变异验证**：把 `panelApi` 的 `fit` 参数固定传 `undefined`（即恒回退到默认全 1），
// 会让 `fitScaleX≠fitScaleZ` 那组断言的 `maxDiff` 变成 0 ⇒ 变红。已在改写本文件过程中
// 用独立探针脚本手工验证过这条会抓（临时脚本已删）。
test("第五版：拟合椭球 fitScaleX/fitScaleZ 确实参与 conform", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1 });
  const point = new THREE.Vector3(0, 1.7, 1.5);
  const frame = { point, x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, -1, 0), z: new THREE.Vector3(0, 0, 1) };
  const sample = (v) => ({ lateral: v * 2.5, normal: 0 });
  const offsetsWith = (fit) => {
    const api = panelApi(lock, SPHERE_PROXY, fit);
    return api.panelScalpConformOffsets(api.panelScalpConformParams(lock), sample, 1, 0, null, null, frame);
  };
  // fitScaleX ≠ fitScaleZ ⇒ 几何必须改变。
  const iso = offsetsWith({ fitScaleX: 1, fitScaleZ: 1 });
  const aniso = offsetsWith({ fitScaleX: 1.4, fitScaleZ: 0.9 });
  assert.ok(
    iso.distanceTo(aniso) > 1e-6,
    `fitScaleX≠fitScaleZ 必须改变几何，实测偏差 ${iso.distanceTo(aniso)}`
  );
  // 两者相等时，把 fitScaleX+fitScaleZ 一起改到同一个新值（仍是球构型）⇒ 恰好不变（maxDiff===0）。
  const isoScaled = offsetsWith({ fitScaleX: 1.3, fitScaleZ: 1.3 });
  assert.equal(
    iso.distanceTo(isoScaled), 0,
    `fitScaleX==fitScaleZ 时改变到同一新值不得改变几何（球构型代数消掉），实测偏差 ${iso.distanceTo(isoScaled)}`
  );
});

// ── 第五版新增 2：ay 写死为 1，ax/az 来自 fitScale 并被钳位到 [0.5, 1.5] ──────────
// **变异验证**：若把 `ay` 改回读取某个可调字段（如误接 fitScaleY），本条会因 `params.ay !== 1`
// 直接变红；若钳位改错范围（如钳到 [0,2]），下面两条超界探针会变红。
test("第五版：panelScalpConformParams 的 ay 写死为 1，ax/az 钳位到 [0.5,1.5]", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1 });
  const api = panelApi(lock, SPHERE_PROXY, { fitScaleX: 1.2, fitScaleZ: 0.7 });
  const params = api.panelScalpConformParams(lock);
  assert.equal(params.ay, 1, `ay 必须写死为 1，实测 ${params.ay}`);
  assert.equal(params.ax, THREE.MathUtils.clamp(1.2, 0.5, 1.5), `ax 必须等于钳位后的 fitScaleX，实测 ${params.ax}`);
  assert.equal(params.az, THREE.MathUtils.clamp(0.7, 0.5, 1.5), `az 必须等于钳位后的 fitScaleZ，实测 ${params.az}`);
  // 钳位探针：超界值必须被夹住，不是原样传递（负向对照）。
  const clampedApi = panelApi(lock, SPHERE_PROXY, { fitScaleX: 9, fitScaleZ: -9 });
  const clampedParams = clampedApi.panelScalpConformParams(lock);
  assert.equal(clampedParams.ax, 1.5, `fitScaleX=9 必须被钳到 1.5，实测 ${clampedParams.ax}`);
  assert.equal(clampedParams.az, 0.5, `fitScaleZ=-9 必须被钳到 0.5，实测 ${clampedParams.az}`);
});

// ── 第五版新增 3：防 NaN（本轮修的真实缺陷）───────────────────────────────────
// **本条断言在防什么**：椭球顶点在 `y = C.y + ay`（球构型 `ay=1`）处，纬线椭圆的两个半轴
// `A = ax·c`、`B = az·c` 都随 `c = sqrt(1-h²)` 趋于 0（`h = (P.y-C.y)/ay → 1`）。密切圆曲率半径
// `rho = (...)^1.5/(A·B)` 在 `A=B=0` 处是 `0/0 = NaN`。而 `panelBendCrossSection` 首行
// `Number(curvature) || 0` 把 `NaN` 当 falsy 静默改写成 `0` ⇒ 该行悄悄摊平成直线、不报错、
// 不被旧的 `radius < 1e-6` 守卫抓到（`NaN < 1e-6` 恒为 false）。本条直接构造一行 `P.y ≥ C.y + ay`
// 的输入（`C.y=0.9, ay=1 ⇒ P.y=1.95`，恰好落在椭球顶点之上一点点），断言结果依然有限、非零。
// **变异验证**：把 `panel-tip-strand.js` 里的 `THREE.MathUtils.clamp((P.y - C.y) / ay, -(1 - 1e-3), 1 - 1e-3)`
// 手工改成不钳位的 `(P.y - C.y) / ay`（临时改，验证后已还原，见报告），复跑本条：
// `k` 变成 `NaN`，位移退化为 `sample(1) = (2.5, 0, 0)`（被摊平成直线，长度仍是 2.5 但已不再弯曲，
// 与钳位版本的真实弯曲结果 1.4958.. 不同）——`length()>0` 这一断言本身不会变红（摊平后长度非零），
// 但配合下方的 `!== FLAT_LENGTH_AT_U1` 精确比较会变红，证明该断言确实咬住了"被摊平"这个失效模式。
test("第五版新增：防 NaN——P.y ≥ C.y+ay 时 k 必须有限、位移非零（未被静默摊平）", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1, panelScalpConformGap: 0 });
  const api = panelApi(lock); // 默认 fit 全 1 ⇒ ay=1，C.y=0.9（SPHERE_PROXY）⇒ 椭球顶点在 y=1.9
  const params = api.panelScalpConformParams(lock);
  const sample = (v) => ({ lateral: v * 2.5, normal: 0 });
  // P.y = 1.95 > C.y(0.9) + ay(1) = 1.9：越过椭球顶点，h 若不钳位会 > 1。
  const frame = {
    point: new THREE.Vector3(0, 1.95, 1.5),
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, -1, 0),
    z: new THREE.Vector3(0, 0, 1)
  };
  const offsets = api.panelScalpConformOffsets(params, sample, 1, 0, null, null, frame);
  assert.ok(offsets, "sanity：越过椭球顶点的行不得返回 null（钳位后 Reff 仍有限）");
  assert.ok(Number.isFinite(offsets.length()), `位移必须有限，实测 ${offsets.length()}`);
  // 摊平成直线时 sample(1)=(2.5,0,0) 的世界化结果长度恰为 2.5（frame.x 方向）；真实弯曲后的
  // 位移长度必须与之不同（若相同，说明该行其实被摊平了，只是数值上凑巧非零）。
  const FLAT_LENGTH_AT_U1 = 2.5;
  assert.ok(
    Math.abs(offsets.length() - FLAT_LENGTH_AT_U1) > 1e-6,
    `该行必须仍在弯（不得被静默摊平成平板长度 ${FLAT_LENGTH_AT_U1}），实测 ${offsets.length()}`
  );
});

// ── 第五版新增 4：弯曲轴恒竖直 + 边缘点相对 P 的 Δy 恒为 0 ───────────────────────
// **变异验证**：若把 `axisHat`（= `lateralHat × normalHat`）算错成非竖直方向（例如漏乘某个
// 分量），`offsets.y` 会随构型出现非零值，下面多高度探针中至少一档会变红。已用独立探针脚本
// （现已删除）核对当前实现在多个高度下 `offsets.y` 恒为 0。
test("第五版新增：弯曲轴恒竖直，边缘点相对 P 的 Δy 恒为 0（多高度，含 P.y>C.y 与 P.y<C.y）", () => {
  const lock = panelLock({ width: 5, panelScalpConformAmount: 1 });
  const api = panelApi(lock);
  const params = api.panelScalpConformParams(lock);
  const sample = (v) => ({ lateral: v * 2.5, normal: 0.3 * (1 - v * v) }); // camber ≠ 0：更严格的探针
  for (const y of [0.5, 0.9, 1.4, 1.89]) { // 含 P.y < C.y(0.9) 与 P.y > C.y 两侧
    const frame = {
      point: new THREE.Vector3(0, y, 1.5),
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, 1)
    };
    const offsets = api.panelScalpConformOffsets(params, sample, 1, 0, null, null, frame);
    assert.ok(offsets, `sanity：y=${y} 必须给出非 null 位移`);
    assert.equal(offsets.y, 0, `弯曲轴恒竖直 ⇒ 边缘点相对 P 的 Δy 必须精确为 0，y=${y} 实测 ${offsets.y}`);
  }
});

// ── 第五版新增 5：默认值唯一定义点（PANEL_SCALP_CONFORM_DEFAULTS + index.html 滑杆同值） ──
// 照本文件既有"源码文本断言"风格（参考「单一定义点」与「app.js 接线」两个用例）。
// **变异验证**：把 index.html 里 `scalpConformFitScaleX` 的 `value="1"` 手工改成 `value="1.1"`
// 复跑，本条会因 `htmlValueX !== PANEL_SCALP_CONFORM_DEFAULTS.fitScaleX` 变红（已手工验证后还原）。
test("第五版新增：默认值唯一定义点——PANEL_SCALP_CONFORM_DEFAULTS 与 index.html 滑杆同值", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.equal(PANEL_SCALP_CONFORM_DEFAULTS.fitScaleX, 1, "sanity：fitScaleX 默认值必须是 1");
  assert.equal(PANEL_SCALP_CONFORM_DEFAULTS.fitScaleZ, 1, "sanity：fitScaleZ 默认值必须是 1");
  const matchX = html.match(/id="scalpConformFitScaleX"[^>]*value="([^"]+)"/);
  const matchZ = html.match(/id="scalpConformFitScaleZ"[^>]*value="([^"]+)"/);
  assert.ok(matchX, "index.html 必须有 #scalpConformFitScaleX 滑杆");
  assert.ok(matchZ, "index.html 必须有 #scalpConformFitScaleZ 滑杆");
  assert.equal(
    Number(matchX[1]), PANEL_SCALP_CONFORM_DEFAULTS.fitScaleX,
    `#scalpConformFitScaleX 的 value 必须与 PANEL_SCALP_CONFORM_DEFAULTS.fitScaleX 同值，实测 ${matchX[1]}`
  );
  assert.equal(
    Number(matchZ[1]), PANEL_SCALP_CONFORM_DEFAULTS.fitScaleZ,
    `#scalpConformFitScaleZ 的 value 必须与 PANEL_SCALP_CONFORM_DEFAULTS.fitScaleZ 同值，实测 ${matchZ[1]}`
  );
});

// ── 第五版新增 6：app.js 接线——scalpConformFit 出现在定义/注入/存档快照三处，
// scalp-builder.js 里有存档恢复 ───────────────────────────────────────────────
// 照现有源码文本断言风格（参考「app.js 接线：两个字段覆盖全部 7 类路径」）。
// **变异验证**：把下面任一正则的关键字改成不存在的字符串（如 `scalpConformFitXXX`）复跑，
// 对应断言必然变红（已逐条手工核对，见报告逐条记录；核对后未修改文件本体，只在本地临时
// 改字符串测试变红即还原，未落盘）。
test("第五版新增：app.js/scalp-builder.js 接线——scalpConformFit 定义/注入/快照/恢复四处", async () => {
  const [app, scalpBuilder] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8")
  ]);
  // ① 定义：app.js 顶层声明 scalpConformFit 这个纯数据对象。
  assert.match(app, /const scalpConformFit = \{/, "app.js 必须定义 scalpConformFit 对象");
  // ② 注入：panelTipStrandDeps（Object.assign 批次）里必须包含 scalpConformFit。
  assert.match(
    app, /Object\.assign\(panelTipStrandDeps, \{[\s\S]*?\n  scalpConformFit,/,
    "panelTipStrandDeps 的 Object.assign 批次必须注入 scalpConformFit"
  );
  // ③ 存档快照：snapshotState 里必须把 scalpConformFit 写进去。
  assert.match(app, /scalpConformFit: \{ \.\.\.scalpConformFit \}/, "snapshotState 必须序列化 scalpConformFit");
  // ④ 存档恢复：scalp-builder.js 里必须有 state.scalpConformFit 的恢复逻辑。
  assert.match(
    scalpBuilder, /if \(state\.scalpConformFit\) Object\.assign\(deps\.scalpConformFit, state\.scalpConformFit\);/,
    "scalp-builder.js 必须从存档 state.scalpConformFit 恢复 deps.scalpConformFit"
  );
});

// ── 第五版新增 7：三语覆盖——Fit Width / Fit Depth 在中文与日文本地化表里都有条目 ──
test("第五版新增：Fit Width / Fit Depth 在 loc-zh.js 与 loc-ja.js 均有本地化条目", async () => {
  const [locZh, locJa] = await Promise.all([
    readFile(new URL("../modules/data/loc-zh.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);
  for (const [label, source] of [["loc-zh.js", locZh], ["loc-ja.js", locJa]]) {
    assert.match(source, /"Fit Width":\s*"[^"]+"/, `${label} 必须有 "Fit Width" 条目`);
    assert.match(source, /"Fit Depth":\s*"[^"]+"/, `${label} 必须有 "Fit Depth" 条目`);
  }
});
