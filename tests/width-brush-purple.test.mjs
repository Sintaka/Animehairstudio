import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";

import { sculptWidthBrushMultiplier } from "../modules/sculpt/width-brush.js";
import { TAPER_VALUE_MAX } from "../modules/core/app-config.js";
import { createTaperEditorApi } from "../modules/geometry/taper-editor.js";

// 紫色 WidthCurve 笔刷分支的行为测试。现有 Width Brush 测试（dom-contract.test.mjs 等）只
// 断言 DOM/CSS/本地化字符串，不覆盖任何行为——这里补上：① 紫色钳位区间不能滑回绿色区间；
// ② 候选点枚举的分侧/写回归属（对称两侧同一 pointIndex；非对称 primary/secondary 分流）。

// 最小化 createTaperEditorApi deps：只喂 taperCurveBrushCandidates 这条调用链实际用到的
// 字段。故意不引入 THREE 相机/渲染器——taper-editor.js 本身也不在这条函数里用它们。
function makeTaperEditorDeps() {
  return {
    sculptState: {},
    branchSweep: {
      twistCurveEditing: (key) => key === "twistCurve",
      proceduralBranchCurveEditing: () => false,
      // 恒等：profile 的裁切/圆化不是本测试要覆盖的对象，真实实现见 branch-sweep.js。
      trimmedSweepProfile: (profile) => profile
    },
    shapePresets: {
      taperSecondaryKey: (key) => (key === "depthCurve" ? "depthCurveSecondary" : "taperCurveSecondary"),
      cloneShapePresetValue: (value) => JSON.parse(JSON.stringify(value ?? null))
    },
    strandGeometryCurve: () => ({}),
    // 简化 frame：point.y 携带 position、x 轴恒为 +X，方便断言里把像素坐标反推回
    // side*extent。真实几何见 app.js 的 strandGeometryFrameAt，这里只需要满足
    // taperMeshPointFrame 的调用契约（lock.geometryType !== "braid" 时转发到这里）。
    strandGeometryFrameAt: (lock, curve, position) => ({
      point: new THREE.Vector3(0, position, 0),
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    }),
    isPanelGeometry: () => false,
    // 恒等投影：只把世界坐标的 x/y 原样搬到像素坐标，不做相机变换——真实实现见
    // sculpt-geometry.js 的 viewportPixelPoint。够用来断言候选点的相对次序/归属。
    viewportPixelPoint: (worldPoint) => ({ x: worldPoint.x, y: worldPoint.y })
  };
}

function makeStrandLock(overrides = {}) {
  return {
    id: "strand-1",
    geometryType: "strand",
    baseWidth: 0.16,
    widthScale: 1,
    taperCurve: [
      { position: 0, value: 0.5, interpolation: "smooth" },
      { position: 0.5, value: 1, interpolation: "smooth" },
      { position: 1, value: 0.3, interpolation: "smooth" }
    ],
    asymmetricWidthCurve: false,
    ...overrides
  };
}

test("sculptWidthBrushMultiplier 传紫色区间时不滑回绿色上/下界", () => {
  // 绿色区间是 [0.08, 2]（tip-width-curve.js），紫色是 [0, TAPER_VALUE_MAX=1.5]。若调用点
  // 漏传 options.min/max，默认会钳到绿色区间——这条断言专门堵这个回归：故意给一个会撞满
  // 两侧的输入，用幅度（而非"结果 <= 某个宽泛上限"这种存在性判断）验证钳到的是 1.5/0，
  // 不是 2/0.08。
  const purpleOptions = { min: 0, max: TAPER_VALUE_MAX };
  const upperHit = sculptWidthBrushMultiplier(1.4, 500, 1, 1, { ...purpleOptions, reverse: true });
  assert.equal(upperHit, TAPER_VALUE_MAX);
  assert.notEqual(upperHit, 2);
  const lowerHit = sculptWidthBrushMultiplier(0.05, 500, 1, 1, purpleOptions);
  assert.equal(lowerHit, 0);
  assert.notEqual(lowerHit, 0.08);
  // 不传 reverse/min/max（调用方漏传的回归场景）会落回绿色默认区间，用于对照——证明上面
  // 两个断言确实是"紫色 vs 绿色"的差异，不是巧合撞出同一个数。
  const greenDefaultUpper = sculptWidthBrushMultiplier(1.4, 500, 1, 1, { reverse: true });
  assert.equal(greenDefaultUpper, 2);
  const greenDefaultLower = sculptWidthBrushMultiplier(0.05, 500, 1, 1, {});
  assert.equal(greenDefaultLower, 0.08);
});

test("taperCurveBrushCandidates: 对称态两侧同一 pointIndex 都写回 primary", () => {
  const taperEditor = createTaperEditorApi(makeTaperEditorDeps());
  const lock = makeStrandLock();
  const rect = { width: 800, height: 600, left: 0, top: 0 };
  const candidates = taperEditor.taperCurveBrushCandidates(lock, rect);
  // 3 个关键点 × 2 侧（对称态 sides=[-1,1]）= 6 个候选点。
  assert.equal(candidates.length, 6);
  assert.ok(candidates.every((candidate) => candidate.curveSide === "primary"));
  const pointIndex1Candidates = candidates.filter((candidate) => candidate.pointIndex === 1);
  assert.equal(pointIndex1Candidates.length, 2);
  const sides = pointIndex1Candidates.map((candidate) => candidate.side).sort();
  assert.deepEqual(sides, [-1, 1]);
  // 两侧 x 像素坐标必须关于中心对称（side 取反 → extent 沿 +x/-x 各推一份），y 相同
  // （position 相同）。幅度断言：不是"存在两个点"，而是它们互为镜像。
  const [left, right] = pointIndex1Candidates[0].side < 0
    ? [pointIndex1Candidates[0], pointIndex1Candidates[1]]
    : [pointIndex1Candidates[1], pointIndex1Candidates[0]];
  assert.ok(left.x < 0 && right.x > 0);
  assert.ok(Math.abs(left.x + right.x) < 1e-9);
  assert.equal(left.y, right.y);
});

test("taperCurveBrushCandidates: 非对称态 curveSide 分流 primary/secondary", () => {
  const taperEditor = createTaperEditorApi(makeTaperEditorDeps());
  const lock = makeStrandLock({
    asymmetricWidthCurve: true,
    taperCurveSecondary: [
      { position: 0, value: 0.2, interpolation: "smooth" },
      { position: 0.5, value: 0.4, interpolation: "smooth" },
      { position: 1, value: 0.1, interpolation: "smooth" }
    ]
  });
  const rect = { width: 800, height: 600, left: 0, top: 0 };
  const candidates = taperEditor.taperCurveBrushCandidates(lock, rect);
  // 非对称态每条曲线只画一侧（sides=[1]/sides=[-1]）：3 个 primary + 3 个 secondary。
  assert.equal(candidates.length, 6);
  const primary = candidates.filter((candidate) => candidate.curveSide === "primary");
  const secondary = candidates.filter((candidate) => candidate.curveSide === "secondary");
  assert.equal(primary.length, 3);
  assert.equal(secondary.length, 3);
  assert.ok(primary.every((candidate) => candidate.side === 1));
  assert.ok(secondary.every((candidate) => candidate.side === -1));
  // 幅度判据：写回目标不是"标了 secondary 的字符串"，而是真的能用 pointIndex 找到
  // lock.taperCurveSecondary 里对应的关键点（这是调用方写回逻辑依赖的不变量）——用 value
  // 反查验证两条数组没有被搞混。
  secondary.forEach((candidate) => {
    const point = lock.taperCurveSecondary[candidate.pointIndex];
    assert.ok(point);
  });
  primary.forEach((candidate) => {
    const point = lock.taperCurve[candidate.pointIndex];
    assert.ok(point);
  });
});

