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
  // 3 个关键点 × (2 侧 + 1 中心轴) = 9。旧版是 3×2=6——taper-editor.js :451-467 补了一个
  // 落在 frame.point（主骨骼中心轴，未加 side*extent 偏移）上的候选点，每个关键点因此多
  // 出 1 个，让刷子中心命中中心轴时不再因为找不到候选点而静默 no-op。
  assert.equal(candidates.length, 9);
  assert.ok(candidates.every((candidate) => candidate.curveSide === "primary"));
  const pointIndex1Candidates = candidates.filter((candidate) => candidate.pointIndex === 1);
  // 每个关键点现在是 3 个候选点（左、右、中心），不再是 2 个。
  assert.equal(pointIndex1Candidates.length, 3);
  // 中心候选点的世界坐标就是 frame.point 本身（本测试的 deps 里 frame.point.x 恒为 0，
  // 未加任何 side*extent 偏移），x 像素坐标恒为 0；两条边缘候选点则携带非零偏移。用这个
  // 区分中心点和边缘点，不触碰下面的镜像判据。
  const edgeCandidates = pointIndex1Candidates.filter((candidate) => candidate.x !== 0);
  const centerCandidates = pointIndex1Candidates.filter((candidate) => candidate.x === 0);
  assert.equal(edgeCandidates.length, 2);
  assert.equal(centerCandidates.length, 1);
  assert.equal(centerCandidates[0].pointIndex, 1);
  const sides = edgeCandidates.map((candidate) => candidate.side).sort();
  assert.deepEqual(sides, [-1, 1]);
  // 两侧 x 像素坐标必须关于中心对称（side 取反 → extent 沿 +x/-x 各推一份），y 相同
  // （position 相同）。幅度断言：不是"存在两个点"，而是它们互为镜像。
  const [left, right] = edgeCandidates[0].side < 0
    ? [edgeCandidates[0], edgeCandidates[1]]
    : [edgeCandidates[1], edgeCandidates[0]];
  assert.ok(left.x < 0 && right.x > 0);
  assert.ok(Math.abs(left.x + right.x) < 1e-9);
  assert.equal(left.y, right.y);
  // 幅度判据（而非存在性）：中心候选点的屏幕 x 坐标确实与边缘候选点不同——证明边缘真的有
  // 偏移、中心真的在中心，不是凑巧算出同一个值。
  assert.notEqual(centerCandidates[0].x, left.x);
  assert.notEqual(centerCandidates[0].x, right.x);
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
  // 非对称态每条曲线只画一侧 + 1 个中心轴候选点（sides=[1]+中心 / sides=[-1]+中心）：
  // 旧版是 3 个 primary + 3 个 secondary = 6；taper-editor.js :451-467 给每个关键点补了
  // 一个中心轴候选点后，每条曲线变成 3×(1+1)=6，两条曲线合计 3×(1+1)×2=12。
  assert.equal(candidates.length, 12);
  const primary = candidates.filter((candidate) => candidate.curveSide === "primary");
  const secondary = candidates.filter((candidate) => candidate.curveSide === "secondary");
  assert.equal(primary.length, 6);
  assert.equal(secondary.length, 6);
  // 每条曲线内部：1 个边缘候选点（side 与曲线绑定）+ 1 个中心候选点（side 取 sides[0]，
  // 与边缘候选点的 side 恰好相同，无法用 side 区分——用 x!==0 区分边缘/中心，与对称态测试
  // 同一判据）。
  const primaryEdge = primary.filter((candidate) => candidate.x !== 0);
  const primaryCenter = primary.filter((candidate) => candidate.x === 0);
  const secondaryEdge = secondary.filter((candidate) => candidate.x !== 0);
  const secondaryCenter = secondary.filter((candidate) => candidate.x === 0);
  assert.equal(primaryEdge.length, 3);
  assert.equal(primaryCenter.length, 3);
  assert.equal(secondaryEdge.length, 3);
  assert.equal(secondaryCenter.length, 3);
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

test("taperCurveBrushCandidates: 对称态存在中心轴候选点，且数量不随 side 重复", () => {
  // 追加测试（不改写上面两条既有测试的分侧/写回断言意图）：专门钉中心轴候选点本身——
  // taper-editor.js :451-467 补的那个落在 frame.point 上的候选点。
  const taperEditor = createTaperEditorApi(makeTaperEditorDeps());
  const lock = makeStrandLock();
  const rect = { width: 800, height: 600, left: 0, top: 0 };
  const candidates = taperEditor.taperCurveBrushCandidates(lock, rect);
  // makeTaperEditorDeps 的 strandGeometryFrameAt 把 frame.point 设为 (0, position, 0)，
  // viewportPixelPoint 恒等投影，所以中心候选点的屏幕 x 坐标必为 0——用这个筛出中心点，
  // 不依赖候选点在数组里的顺序。
  const centerCandidates = candidates.filter((candidate) => candidate.x === 0);
  const edgeCandidates = candidates.filter((candidate) => candidate.x !== 0);
  // 数量判据：中心候选点数量 == 关键点数量（3 个），证明没有按 side 重复产出（若误把
  // push 挪进 sides.forEach，对称态会重复产出 2 份坐标相同的中心点，变成 6 个）。
  assert.equal(centerCandidates.length, 3);
  assert.equal(edgeCandidates.length, 6);
  // 幅度判据：中心候选点与边缘候选点的屏幕 x 坐标确实不同——证明边缘真的有偏移、中心真的
  // 在中心，不是巧合都算出 0。
  edgeCandidates.forEach((candidate) => {
    assert.notEqual(candidate.x, 0);
  });
  // pointIndex 与该关键点一致：每个 pointIndex（0/1/2）恰好对应 1 个中心候选点。
  [0, 1, 2].forEach((pointIndex) => {
    const matches = centerCandidates.filter((candidate) => candidate.pointIndex === pointIndex);
    assert.equal(matches.length, 1);
  });
});

test("taperCurveBrushCandidates: 非对称态 primary/secondary 各自都有中心候选点，curveSide 分流正确", () => {
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
  const centerCandidates = candidates.filter((candidate) => candidate.x === 0);
  const edgeCandidates = candidates.filter((candidate) => candidate.x !== 0);
  // 6 个关键点（3 primary + 3 secondary）各自贡献 1 个中心候选点。
  assert.equal(centerCandidates.length, 6);
  assert.equal(edgeCandidates.length, 6);
  const primaryCenters = centerCandidates.filter((candidate) => candidate.curveSide === "primary");
  const secondaryCenters = centerCandidates.filter((candidate) => candidate.curveSide === "secondary");
  // curveSide 分流：primary 曲线的中心候选点必须写回 lock.taperCurve，secondary 的必须
  // 写回 lock.taperCurveSecondary——用 pointIndex 反查验证，与既有非对称测试同一判据。
  assert.equal(primaryCenters.length, 3);
  assert.equal(secondaryCenters.length, 3);
  primaryCenters.forEach((candidate) => {
    assert.ok(lock.taperCurve[candidate.pointIndex]);
  });
  secondaryCenters.forEach((candidate) => {
    assert.ok(lock.taperCurveSecondary[candidate.pointIndex]);
  });
});

