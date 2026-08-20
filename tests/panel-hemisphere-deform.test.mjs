// panel-hemisphere-deform.test.mjs - 面板「半球隆起」（法线方向球冠）回归。
// 该控件是四个 Trim（Left/Right Edge Trim、Tip Curve、Tip Loops）的**法线方向对位物**：
// 它们重参数化 sampleT（切向），本控件沿面板法线 frame.z 位移。断言围绕四条不变式：
//   ① amount == 0 ⇒ 输出逐位守恒（先例：SWEEP_OVERLAP_DEFAULTS「全部关到 0 时逐位守恒」）
//   ② row 0 顶点**永不移动**（UV 红线 + 发根锚在头皮，见 AGENT_QUICKSTART.md §2.4b）
//   ③ 剖面是真球冠：r ≥ 1 处精确 0、朝顶点单调、amount 取负则内凹
//   ④ 网格与宽度把手（tipMainSectionPoint）拿到**同一份**位移（bug-fixes.md #25 那类漂移）
// 期望值一律按被测的同一公式/常量推导，不写死现场数值（development-standards.md
// 「验收脚本与真实存档解耦」）。
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { createPanelTipStrandApi } from "../modules/geometry/panel-tip-strand.js";
import { panelHemisphereOffset, panelTipCurveParameter } from "../modules/geometry/curve-math.js";

const LENGTH_LOOPS = 10;
const WIDTH_LOOPS = 6;
const PANEL_WIDTH = 0.62;

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

function panelLock(overrides = {}) {
  return {
    id: "hemisphere-panel",
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
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0.5, z: 0 },
      { x: 0, y: 1, z: 0 }
    ],
    ...overrides
  };
}

// 直线主链 + 固定正交 frame ⇒ frame.z 恒为世界 +Z（panelFrameAt 会把注入的 z 对切线
// 投影再正交化，直链上结果仍是 (0,0,1)）。于是「沿法线的位移」== 顶点 z 分量之差，
// 判据不必反解 frame，测试才能对**量值**下断言而不只是"动了"。
function panelApi(lock) {
  const curve = new THREE.CatmullRomCurve3(
    lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
  );
  return createPanelTipStrandApi({
    strandGeometryCurve: () => curve,
    strandGeometryFrameAt: () => ({
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    outwardNormalAtPoint: () => new THREE.Vector3(0, 0, 1),
    strandInfluenceColor: () => new THREE.Color(1, 1, 1),
    normalizePanelSplits: (value) => (Array.isArray(value) ? value.map((split) => ({ ...split })) : []),
    // tipWidthMultiplierAt 在未显式传 splits 时回退到 deps.clonePanelSplits（宽度把手
    // 路径会走到），因此 harness 必须提供它；语义与 normalizePanelSplits 同（浅克隆）。
    clonePanelSplits: (value) => (Array.isArray(value) ? value.map((split) => ({ ...split })) : []),
    sculptState: {}
  });
}

function buildPanel(lock) {
  const geometry = panelApi(lock).createPanelStrandGeometry(lock);
  return {
    positions: Array.from(geometry.getAttribute("position").array),
    rows: Array.from(geometry.userData.gridRowIndices),
    cols: Array.from(geometry.userData.gridColIndices),
    count: geometry.getAttribute("position").count
  };
}

test("剖面是真球冠：r >= 1 精确为 0、朝顶点单调、u 上对称", () => {
  const amount = 0.8;
  const width = 0.5;
  const center = 0.5;
  // r >= 1 处**精确**为 0（不是"接近 0"）：球冠有明确支撑域，域外不得有任何位移。
  assert.equal(panelHemisphereOffset(center + width, 0, amount, width, center), 0, "dt = 1 ⇒ r = 1 ⇒ 0");
  assert.equal(panelHemisphereOffset(center + width * 1.5, 0, amount, width, center), 0);
  assert.equal(panelHemisphereOffset(center, 1, amount, width, center), 0, "|u| = 1 ⇒ r = 1 ⇒ 0");
  assert.equal(panelHemisphereOffset(center, -1, amount, width, center), 0);

  // 顶点处 = amount（sqrt(1-0) = 1，且 center 远离根部守卫带 ⇒ guard = 1）。
  assert.ok(Math.abs(panelHemisphereOffset(center, 0, amount, width, center) - amount) < 1e-12);

  // 朝顶点单调递增（u = 0 剖切线，从支撑域边缘走到顶点）。
  let previous = -Infinity;
  for (let step = 0; step <= 20; step += 1) {
    const t = center - width + (width * step) / 20;
    const value = panelHemisphereOffset(t, 0, amount, width, center);
    assert.ok(value >= previous - 1e-15, `朝顶点必须单调不减：t=${t}`);
    previous = value;
  }

  // u 上是偶函数 —— 镜像伙伴原样拷贝三个值（不取反/不交换）的依据。
  for (const u of [0.25, 0.5, 0.75]) {
    assert.equal(
      panelHemisphereOffset(center, u, amount, width, center),
      panelHemisphereOffset(center, -u, amount, width, center),
      "球冠剖面在 u 上对称 ⇒ X 镜像不改变形状"
    );
  }
});

test("amount 取负 = 向内凹陷（与正向严格反号）", () => {
  for (const t of [0.3, 0.5, 0.7, 0.9]) {
    for (const u of [-0.5, 0, 0.5]) {
      const out = panelHemisphereOffset(t, u, 0.6, 0.5, 0.5);
      const dent = panelHemisphereOffset(t, u, -0.6, 0.5, 0.5);
      assert.equal(dent, -out, `负 amount 必须严格反号：t=${t} u=${u}`);
    }
  }
  assert.ok(panelHemisphereOffset(0.5, 0, -0.6, 0.5, 0.5) < 0, "负 amount 沿法线向内");
});

// 半球关到 0 的档必须与「根本没有这三个字段」的旧档逐位相同 —— 否则每一个存量 .ahs
// 打开后网格都会漂移。先例：SWEEP_OVERLAP_DEFAULTS 的同名不变式。
test("amount == 0 ⇒ 顶点位置逐位守恒（含 width/center 被改动的情况）", () => {
  const baseline = buildPanel(panelLock());
  for (const variant of [
    { panelHemisphereAmount: 0 },
    // width/center 非默认但 amount 仍为 0：早退必须发生在读取这两个值之前生效。
    { panelHemisphereAmount: 0, panelHemisphereWidth: 0.3, panelHemisphereCenter: 0.9 },
    { panelHemisphereAmount: 0, panelHemisphereWidth: 1, panelHemisphereCenter: 0 }
  ]) {
    const probe = buildPanel(panelLock(variant));
    assert.equal(probe.count, baseline.count, "顶点数不得变化");
    for (let index = 0; index < baseline.positions.length; index += 1) {
      assert.equal(
        probe.positions[index],
        baseline.positions[index],
        `amount == 0 必须逐位守恒（分量 ${index}，variant ${JSON.stringify(variant)}）`
      );
    }
  }
});

// UV 红线：uv-unfold 的 U 完全由 row 0 环向弧长决定、V 纯行号 ⇒ row 0 一动，每片面板
// 的 UV 都会被静默重排。外加发根锚在头皮，根部位移物理上就是错的。
test("row 0 顶点对任意 amount/width/center 逐位不动", () => {
  const baseline = buildPanel(panelLock());
  const rowZeroOf = (panel) => panel.positions.filter((_, index) => panel.rows[Math.floor(index / 3)] === 0);
  const baselineRowZero = rowZeroOf(baseline);
  assert.ok(baselineRowZero.length > 0, "sanity：确实取到了 row 0 顶点");

  for (const variant of [
    { panelHemisphereAmount: 1, panelHemisphereWidth: 0.5, panelHemisphereCenter: 0.5 },
    // 最恶劣构型：顶点就压在根部、且球冠半跨度开到最大 —— 守卫必须仍然精确归零。
    { panelHemisphereAmount: 1, panelHemisphereWidth: 1, panelHemisphereCenter: 0 },
    { panelHemisphereAmount: -1, panelHemisphereWidth: 1, panelHemisphereCenter: 0 },
    { panelHemisphereAmount: 0.37, panelHemisphereWidth: 0.05, panelHemisphereCenter: 0 },
    { panelHemisphereAmount: -0.62, panelHemisphereWidth: 0.8, panelHemisphereCenter: 0.15 }
  ]) {
    const probe = buildPanel(panelLock(variant));
    assert.equal(probe.count, baseline.count, "顶点数不得变化（weld key 含 grid cell）");
    const probeRowZero = rowZeroOf(probe);
    assert.deepEqual(
      probeRowZero,
      baselineRowZero,
      `row 0 必须逐位不动：${JSON.stringify(variant)}`
    );
  }
});

// 守卫写在纯函数**内部**（而不是各消费方各写一遍），所以可以直接对函数下断言 ——
// 这比"网格没动"更强：任何将来新增的消费方都自动继承 t == 0 归零。
test("t == 0 时纯函数恒返回 0（守卫在定义点内部，消费方无法绕过）", () => {
  for (const amount of [-1, -0.5, 0.25, 1]) {
    for (const width of [0.05, 0.5, 1]) {
      for (const center of [0, 0.25, 0.5, 1]) {
        for (const u of [-1, -0.5, 0, 0.5, 1]) {
          assert.equal(
            panelHemisphereOffset(0, u, amount, width, center),
            0,
            `t == 0 必须恒为 0：amount=${amount} width=${width} center=${center} u=${u}`
          );
        }
      }
    }
  }
});

// 直链 + 注入的正交 frame ⇒ frame.z 恒为世界 +Z，因此"沿法线的位移"可以直接用顶点
// z 分量之差度量。期望值按被测的同一公式推导（panelHemisphereOffset × fullWidth*0.5），
// 不写死数字。
test("中段行沿面板法线位移 = panelHemisphereOffset × (fullWidth × 0.5)", () => {
  const amount = 0.75;
  const width = 0.45;
  const center = 0.5;
  const baseline = buildPanel(panelLock());
  const probe = buildPanel(panelLock({
    panelHemisphereAmount: amount,
    panelHemisphereWidth: width,
    panelHemisphereCenter: center
  }));
  assert.equal(probe.count, baseline.count);

  const scale = PANEL_WIDTH * 0.5;
  const columns = WIDTH_LOOPS; // 单段（splits 关闭）时全部宽度列都归这一段
  let movedCount = 0;
  let maximumObserved = 0;
  for (let vertex = 0; vertex < baseline.count; vertex += 1) {
    const row = baseline.rows[vertex];
    const column = Math.floor(baseline.cols[vertex] / 2);
    const t = row / LENGTH_LOOPS;
    const u = THREE.MathUtils.lerp(-1, 1, column / columns);
    // Trim 全为 0 ⇒ sampleT == t（走与几何同一个 panelTipCurveParameter，不假设恒等）。
    const sampleT = panelTipCurveParameter(t, u, 0, 0);
    const expected = panelHemisphereOffset(sampleT, u, amount, width, center) * scale;
    const actualDz = probe.positions[vertex * 3 + 2] - baseline.positions[vertex * 3 + 2];
    // position 是 Float32 存储 ⇒ 1e-6 绝对容差（位移量级约 0.23）。
    assert.ok(
      Math.abs(actualDz - expected) < 1e-6,
      `row ${row} col ${column}：期望 dz=${expected}，实测 ${actualDz}`
    );
    // 法线方向以外不得有任何位移：frame.x/y 上的项与半球无关。
    assert.ok(Math.abs(probe.positions[vertex * 3] - baseline.positions[vertex * 3]) < 1e-6, "x 不得移动");
    assert.ok(Math.abs(probe.positions[vertex * 3 + 1] - baseline.positions[vertex * 3 + 1]) < 1e-6, "y 不得移动");
    if (Math.abs(actualDz) > 1e-6) movedCount += 1;
    maximumObserved = Math.max(maximumObserved, Math.abs(actualDz));
  }
  assert.ok(movedCount > 0, "必须真的有中段顶点移动了（否则上面的断言是空转）");
  // 顶点位于 center 处、u = 0 的列上 ⇒ 峰值应达到 amount × scale。默认细分下
  // center=0.5 恰好落在 row 5（t=0.5），u=0 落在 column 3。
  assert.ok(
    Math.abs(maximumObserved - amount * scale) < 1e-6,
    `峰值位移应为 amount × fullWidth × 0.5 = ${amount * scale}，实测 ${maximumObserved}`
  );
});

// 跨消费方一致性（规范要求的形式：断言两个消费方彼此相等，而不是各自断言自己的值）。
// tipMainSectionPoint 的头注释就写着它「复刻 rawPanelPoint，让宽度控件落在几何真正的
// 边缘上」—— 只给网格加隆起而漏掉它，视口绿色宽度把手就会浮在面板表面之外。
// 该 bug 类记录在 devlog/bug-fixes.md #25。
test("跨消费方一致：宽度把手的截面点与网格拿到同一份法线位移", () => {
  const amount = -0.55; // 顺带覆盖内凹方向
  const width = 0.6;
  const center = 0.45;
  const baseLock = panelLock();
  const probeLock = panelLock({
    panelHemisphereAmount: amount,
    panelHemisphereWidth: width,
    panelHemisphereCenter: center
  });
  const baseApi = panelApi(baseLock);
  const probeApi = panelApi(probeLock);
  const baseline = buildPanel(panelLock());
  const probe = buildPanel(panelLock({
    panelHemisphereAmount: amount,
    panelHemisphereWidth: width,
    panelHemisphereCenter: center
  }));

  const scale = PANEL_WIDTH * 0.5;
  let checked = 0;
  for (let vertex = 0; vertex < baseline.count; vertex += 1) {
    const row = baseline.rows[vertex];
    // shell：奇数 gridCol 是 front(+1)、偶数是 back(-1)（addPatch 的 col 编码）。
    const shell = baseline.cols[vertex] % 2 === 1 ? 1 : -1;
    const column = Math.floor(baseline.cols[vertex] / 2);
    const t = row / LENGTH_LOOPS;
    const u = THREE.MathUtils.lerp(-1, 1, column / WIDTH_LOOPS);
    const geometryDz = probe.positions[vertex * 3 + 2] - baseline.positions[vertex * 3 + 2];
    // 同一 (t, u, shell) 上宽度把手截面点的位移。
    const sectionDz = probeApi.tipMainSectionPoint(probeLock, t, u, shell, null, -1, null).z
      - baseApi.tipMainSectionPoint(baseLock, t, u, shell, null, -1, null).z;
    assert.ok(
      Math.abs(sectionDz - geometryDz) < 1e-6,
      `row ${row} col ${column} shell ${shell}：把手位移 ${sectionDz} ≠ 网格位移 ${geometryDz}`
    );
    // 并且两者都等于同一个纯函数的输出 × 同一个世界尺度。
    const expected = panelHemisphereOffset(t, u, amount, width, center) * scale;
    assert.ok(Math.abs(sectionDz - expected) < 1e-6, "把手位移必须来自 panelHemisphereOffset");
    checked += 1;
  }
  assert.ok(checked > 0, "sanity：确实比较过顶点");
});

// geometryType === "surface"（lattice 控制）跳过程序化形变，与 panelTipCurve /
// panelLeftEdgeTrim 的既有先例一致（tipOffsetSampleT 与 createPanelStrandGeometry 都在
// latticeControlled 时把它们强制为 0）。参数解析是单一定义点，故直接对它下断言。
test("surface（lattice 控制）面板的 amount 恒为 0，且世界尺度跟随面板自身宽度", () => {
  const api = panelApi(panelLock());
  const surfaceParams = api.panelHemisphereParams({
    geometryType: "surface",
    width: PANEL_WIDTH,
    panelHemisphereAmount: 1,
    panelHemisphereWidth: 0.5,
    panelHemisphereCenter: 0.5
  });
  assert.equal(surfaceParams.amount, 0, "lattice 面板不参与半球隆起");

  const panelParams = api.panelHemisphereParams({
    geometryType: "panel",
    width: PANEL_WIDTH,
    panelHemisphereAmount: 1
  });
  assert.equal(panelParams.amount, 1);
  // 世界尺度 = 面板半宽 ⇒ 控件与面板尺寸无关（同一滑杆值在大小不同的面板上观感一致）。
  assert.equal(panelParams.scale, PANEL_WIDTH * 0.5);
  const wideParams = api.panelHemisphereParams({ geometryType: "panel", width: PANEL_WIDTH * 3 });
  assert.equal(wideParams.scale, PANEL_WIDTH * 3 * 0.5, "尺度必须正比于面板自身宽度");
  // width 的下限与 UI 滑杆 min 同值；缺字段时回落到中性默认。
  assert.equal(api.panelHemisphereParams({ geometryType: "panel", panelHemisphereWidth: 0 }).width, 0.05);
  assert.equal(api.panelHemisphereParams({ geometryType: "panel" }).width, 0.5);
  assert.equal(api.panelHemisphereParams({ geometryType: "panel" }).center, 0.5);
  assert.equal(api.panelHemisphereParams({ geometryType: "panel" }).amount, 0);
});

// zipper 开启后网格会多走一条路径：addPatch 的 tipTransform（发尖子骨骼链）会把截面
// 整体搬到 authored 链心。半球位移进入 rest 链（splitTipForSegment → tipSurfaceFrameAt →
// tipMainSectionPoint），所以这里独立验一遍 row 0 仍然不动 —— 上面那条只覆盖单段路径。
const SPLIT_LOCK_OVERRIDES = {
  panelSplitEnabled: true,
  panelSplits: [
    { position: -1 / 3, height: 0.4, order: 0 },
    { position: 1 / 3, height: 0.3, order: 1 }
  ]
};

test("zipper（发尖子骨骼链）路径下 row 0 同样逐位不动", () => {
  const baseline = buildPanel(panelLock(SPLIT_LOCK_OVERRIDES));
  const rowZeroOf = (panel) => panel.positions.filter((_, index) => panel.rows[Math.floor(index / 3)] === 0);
  const baselineRowZero = rowZeroOf(baseline);
  assert.ok(baselineRowZero.length > 0, "sanity：确实取到了 row 0 顶点");
  // sanity：确实走到了多段路径（单段时 gridCol 不会出现段间预留列造成的跳号）。
  assert.ok(new Set(baseline.rows).size > 1, "sanity：多行");

  for (const variant of [
    { panelHemisphereAmount: 1, panelHemisphereWidth: 1, panelHemisphereCenter: 0 },
    { panelHemisphereAmount: -1, panelHemisphereWidth: 1, panelHemisphereCenter: 0 },
    { panelHemisphereAmount: 0.8, panelHemisphereWidth: 0.4, panelHemisphereCenter: 0.5 }
  ]) {
    const probe = buildPanel(panelLock({ ...SPLIT_LOCK_OVERRIDES, ...variant }));
    assert.deepEqual(
      rowZeroOf(probe),
      baselineRowZero,
      `zipper 路径下 row 0 必须逐位不动：${JSON.stringify(variant)}`
    );
  }
});

test("zipper 路径下 amount == 0 仍逐位守恒", () => {
  const baseline = buildPanel(panelLock(SPLIT_LOCK_OVERRIDES));
  const probe = buildPanel(panelLock({
    ...SPLIT_LOCK_OVERRIDES,
    panelHemisphereAmount: 0,
    panelHemisphereWidth: 0.3,
    panelHemisphereCenter: 0.85
  }));
  assert.equal(probe.count, baseline.count);
  for (let index = 0; index < baseline.positions.length; index += 1) {
    assert.equal(probe.positions[index], baseline.positions[index], `分量 ${index} 必须逐位守恒`);
  }
});

// 「一条推导规则只准有一个定义点」的源码级守卫：球冠公式只准出现在 curve-math.js。
// 消费方一律调用 panelHemisphereOffset，不得就地重写 sqrt(1 - r²)。
test("单一定义点：球冠公式只在 curve-math.js，消费方只调用不重写", async () => {
  const curveMath = await readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8");
  const panelSource = await readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");
  const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(curveMath, /export function panelHemisphereOffset\(/, "定义点在 curve-math.js");
  // 定义点内部必须自带 t == 0 守卫（契约的机械化检查）。
  assert.match(
    curveMath.slice(curveMath.indexOf("export function panelHemisphereOffset(")),
    /if \(along <= 0\) return 0;/,
    "根部守卫必须写在纯函数内部"
  );

  // 消费方：import 一次 + 两个调用点（rawPanelPoint 与 tipMainSectionPoint）。
  assert.match(panelSource, /^\s*panelHemisphereOffset,$/m, "panel-tip-strand 必须 import 该函数");
  const callSites = panelSource.match(/panelHemisphereOffset\(/g) || [];
  assert.equal(callSites.length, 2, "恰好两个调用点：网格 + 宽度把手截面点");

  // 任何消费方都不得重写球冠表达式（sqrt(1 - r²) 形状）。
  for (const [name, source] of [["panel-tip-strand.js", panelSource], ["app.js", appSource]]) {
    assert.doesNotMatch(
      source,
      /Math\.sqrt\(\s*(?:Math\.max\(\s*0\s*,\s*)?1\s*-\s*\w*[Rr]adius/,
      `${name} 不得就地重写球冠公式`
    );
  }
  // app.js 只做接线：不得自己算半球位移。
  assert.doesNotMatch(appSource, /panelHemisphereOffset/, "app.js 只接线、不参与推导");
});

// 「amount == 0 的空操作路径不得分配任何东西」是**源码级**性质，行为测试逮不到它：
// amount==0 ⇒ strength==0 ⇒ offset 恒为 +0，而 `x + frame.z分量 * 0 === x` 逐位成立，
// 所以就算把两处早退拿掉，输出仍然逐位相同（实测：该变异体是 equivalent mutant）。
// 因此这条不变式只能靠源码断言守住 —— 少了它，将来有人"简化"掉早退不会有任何测试变红，
// 但每次重建面板都会白算一遍球冠并多 clone 一个 Vector3。
test("空操作路径：两处消费点 + 纯函数各自带 amount==0 早退（源码级，行为测不到）", async () => {
  const curveMath = await readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8");
  const panelSource = await readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8");

  // 纯函数：在触碰任何坐标之前早退。
  assert.match(
    curveMath,
    /if \(Math\.abs\(strength\) < 0\.000001\) return 0;/,
    "panelHemisphereOffset 必须在读取 t/u 之前就对 amount==0 早退"
  );
  // 两个消费点（rawPanelPoint 与 tipMainSectionPoint）各自门控，避免无谓的调用与分配。
  const guards = panelSource.match(/hemisphere\.amount !== 0/g) || [];
  assert.equal(guards.length, 2, "两个消费点都必须对 amount==0 门控");
});

// app.js 不是可 import 模块（顶层就 querySelector/new THREE.Scene），所以接线只能按本仓库
// 既有惯例做**源码文本**断言（dom-contract 全篇如此，split-tip-geometry.test.mjs L1471 亦
// 明确写了这条理由）。这不能替代浏览器验证，但能把「三个字段少接了一条路径」钉死 ——
// 少接任何一条，值就活不过 .ahs 存取 / undo / 镜像 / preset 克隆。
const HEMISPHERE_FIELDS = ["panelHemisphereAmount", "panelHemisphereWidth", "panelHemisphereCenter"];

test("app.js 接线：三个字段覆盖全部 7 类路径（源码文本断言）", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");

  // ① panelCreationDefaults：中性默认值（amount 0 ⇒ 新建面板与引入前逐位相同）。
  assert.match(
    app,
    /panelHemisphereAmount: 0,\s*\n\s*panelHemisphereWidth: 0\.5,\s*\n\s*panelHemisphereCenter: 0\.5,/,
    "panelCreationDefaults 必须含三个中性默认值"
  );

  // ② DOM 引用：三个 input + 三个 output + 容器。
  assert.match(app, /const panelHemisphereControls = document\.querySelector\("#panelHemisphereControls"\)/);
  for (const field of HEMISPHERE_FIELDS) {
    assert.match(app, new RegExp(`document\\.querySelector\\("#${field}"\\)`), `缺 #${field} 引用`);
    assert.match(app, new RegExp(`document\\.querySelector\\("#${field}Value"\\)`), `缺 #${field}Value 引用`);
  }
  // markup 缺失时不得进字典（通用接线对元素不判空 ⇒ 会在启动路径抛）。
  assert.match(app, /\.filter\(\(\[, element\]\) => Boolean\(element\)\)/, "DOM 引用必须滤掉缺失元素");
  assert.match(app, /\.\.\.Object\.fromEntries\(panelHemisphereInputEntries\)/, "必须并入 panelShapeInputs");
  assert.match(app, /\.\.\.Object\.fromEntries\(panelHemisphereValueEntries\)/, "必须并入 panelShapeValues");

  // ③ lock normalize：amount 在 surface 上归 0；width/center 按契约范围钳位。
  assert.match(app, /lock\.panelHemisphereAmount = lock\.geometryType === "surface"/);
  assert.match(app, /lock\.panelHemisphereWidth = THREE\.MathUtils\.clamp\(/);
  assert.match(app, /lock\.panelHemisphereCenter = THREE\.MathUtils\.clamp\(/);

  // ④ snapshot 序列化（写盘 / undo 快照）。
  for (const field of HEMISPHERE_FIELDS) {
    assert.match(
      app,
      new RegExp(`${field}: Number\\(lock\\.${field} \\?\\? panelCreationDefaults\\.${field}\\)`),
      `${field} 未进 snapshot 序列化 ⇒ 存不进 .ahs / undo`
    );
  }

  // ⑤ 反序列化（读档 / undo 还原）。
  assert.match(app, /panelHemisphereAmount: snapshot\.geometryType === "surface"/);
  assert.match(app, /panelHemisphereWidth: THREE\.MathUtils\.clamp\(\s*\n\s*Number\(snapshot\.panelHemisphereWidth/);
  assert.match(app, /panelHemisphereCenter: THREE\.MathUtils\.clamp\(\s*\n\s*Number\(snapshot\.panelHemisphereCenter/);

  // ⑥ 隐藏（surface 与 panelTipCurveControl 同规则）＋ 可选链（markup 缺失不得抛）。
  assert.match(app, /panelHemisphereControls\?\.classList\.toggle\("hidden", Boolean\(selectedSurface\)\)/);
  assert.match(app, /if \(panelHemisphereControls\) panelHemisphereControls\.hidden = Boolean\(selectedSurface\)/);
});

// 镜像语义是本轮最容易被将来"顺手统一"改错的一处：邻居 panelTipCurve 取负、
// 左右 EdgeTrim 互换，唯独半球三值原样拷贝。把它钉成断言而不是只写注释。
test("app.js 镜像：三个值原样拷贝 —— 不取反、不左右互换", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  // 用 ok/!ok 而不是 assert.match：app.js 近 1MB，match 失败会把整个文件打进报错。
  const has = (pattern, message) => assert.ok(pattern.test(app), message);
  const lacks = (pattern, message) => assert.ok(!pattern.test(app), message);

  // 两个镜像站点都必须"同名 → 同名"。
  for (const field of HEMISPHERE_FIELDS) {
    has(new RegExp(`${field}: lock\\.${field},`), `createMirrorPartner 必须原样拷贝 ${field}`);
    has(
      new RegExp(`partner\\.${field} =[\\s\\S]{0,120}lock\\.${field}`),
      `syncMirrorPartnerFromLock 必须从**同名**字段取 ${field}`
    );
  }

  // 负向对照：取负是错的。对照 panelTipCurve 确实取负 ⇒ 证明该写法在本文件里"写得出来"，
  // 所以下面三条 lacks 不是空转。
  has(/-Number\(lock\.panelTipCurve/, "sanity：panelTipCurve 确实取负");
  for (const field of HEMISPHERE_FIELDS) {
    lacks(new RegExp(`-\\s*Number\\(lock\\.${field}`), `${field} 不得取反`);
    lacks(new RegExp(`${field}: -`), `${field} 不得取反`);
  }

  // 负向对照：不得左右互换。对照 EdgeTrim 在 syncMirrorPartnerFromLock 处确实互换。
  // 注：createMirrorPartner 那一处 EdgeTrim **未**互换（两个镜像站点本就不一致，见
  // L9491/L9669）—— 那是本控件之前就存在的差异，本轮刻意不动（改它属于设计变更）。
  // 半球三值在**两处都**原样拷贝，本来就没有"左右"可换。
  has(
    /partner\.panelLeftEdgeTrim = Number\(lock\.panelRightEdgeTrim/,
    "sanity：syncMirrorPartnerFromLock 处 EdgeTrim 确实互换"
  );
  lacks(/panelHemisphereWidth: lock\.panelHemisphereCenter/, "不得交叉赋值");
  lacks(/panelHemisphereCenter: lock\.panelHemisphereWidth/, "不得交叉赋值");
  lacks(/partner\.panelHemisphereWidth = [\s\S]{0,80}lock\.panelHemisphereCenter/, "不得交叉赋值");
  lacks(/partner\.panelHemisphereCenter = [\s\S]{0,80}lock\.panelHemisphereWidth/, "不得交叉赋值");
});
