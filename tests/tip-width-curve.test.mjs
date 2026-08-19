// tip-width-curve.test.mjs - 共享发尖 WidthCurve 纯数学模块（modules/geometry/tip-width-curve.js）。
// 本模块是 panel 段与普通发丝管**共用**的单一定义点，因此断言全部围绕「共享网格 +
// 按侧动态暴露」不变式写，不涉及 lock/骨骼/视口。panel 侧的端到端断言在
// split-tip-geometry.test.mjs（那批断言在本次抽取中逐字未改，是纯重构的证明）。
import test from "node:test";
import assert from "node:assert/strict";
import {
  TIP_WIDTH_CONTROL_POINTS,
  buildTipWidthCurveFrom,
  segmentZipperHeights,
  setTipWidthCurveValueFrom,
  tipWidthCommonForkFromHeights,
  tipWidthControlTs,
  tipWidthGridFromHeights,
  tipWidthRecordsOppositeForkFrom,
  tipWidthResetCurveFrom,
  tipWidthSideControlTsFrom,
  tipWidthSideExposesTAt,
  tipWidthSideForkFromHeights
} from "../modules/geometry/tip-width-curve.js";

// 非对称 zipper：左深（height 0.5 → fork 0.5）、右浅（height 0.2 → fork 0.8）。
// 与 split-tip-geometry.test.mjs 的 tipWidthHarness 同一组高度，便于两侧结论互相印证。
const SPLITS = [
  { position: -0.3, height: 0.5 },
  { position: 0.3, height: 0.2 }
];
const SEGMENT = 1;

function forks(splits = SPLITS, segmentIndex = SEGMENT) {
  const { left, right } = segmentZipperHeights(splits, segmentIndex);
  return {
    left,
    right,
    leftFork: tipWidthSideForkFromHeights(left, right, -1),
    rightFork: tipWidthSideForkFromHeights(left, right, 1),
    gridTs: tipWidthGridFromHeights(left, right)
  };
}

test("segmentZipperHeights：段 i 的左界 splits[i-1]、右界 splits[i]，最外边界为 null", () => {
  assert.deepEqual(segmentZipperHeights(SPLITS, 1), { left: 0.5, right: 0.2 });
  // 段 0 无左 zipper、段 N 无右 zipper —— 普通发丝管沿用同一邻居规则。
  assert.deepEqual(segmentZipperHeights(SPLITS, 0), { left: null, right: 0.5 });
  assert.deepEqual(segmentZipperHeights(SPLITS, 2), { left: 0.2, right: null });
  assert.deepEqual(segmentZipperHeights(null, 1), { left: null, right: null });
});

test("边界段无 zipper 的一侧回退段 fork（由对侧 zipper 界定）", () => {
  // 段 0：左无 zipper → 回退 1 - max(0, 0.5) = 0.5，与右侧 fork 相同。
  assert.equal(tipWidthSideForkFromHeights(null, 0.5, -1), 0.5);
  assert.equal(tipWidthSideForkFromHeights(null, 0.5, 1), 0.5);
  // 完全无 zipper（无 split 发丝）：两侧 fork 恒为 1 = 全锁定。
  assert.equal(tipWidthSideForkFromHeights(null, null, -1), 1);
  assert.equal(tipWidthSideForkFromHeights(null, null, 1), 1);
});

test("共享网格：两侧同一批参数、间距一致（不得按各侧 fork 各自等分）", () => {
  const { left, right, leftFork, rightFork, gridTs } = forks();
  assert.equal(tipWidthCommonForkFromHeights(left, right), leftFork, "公共 fork = 最深 zipper 侧的 fork");
  assert.ok(rightFork > leftFork + 1e-6, "右侧是浅 zipper 侧：本侧 fork 更靠发尖");

  assert.equal(gridTs.length, TIP_WIDTH_CONTROL_POINTS + 1, "共享网格 = N 中点 + 发尖端");
  assert.ok(Math.abs(gridTs.at(-1) - 1) < 1e-12, "最后一个位置是发尖端 t=1");
  const spacings = gridTs.slice(1, TIP_WIDTH_CONTROL_POINTS)
    .map((position, index) => position - gridTs[index]);
  spacings.forEach((spacing) => {
    assert.ok(Math.abs(spacing - spacings[0]) < 1e-12, "中点间距均匀");
  });

  // 关键回归（0.2.118 曾破坏）：两侧暴露位置都是同一网格的子集 → 数值逐位相同，
  // 因此间距必然一致；浅侧是深侧的**子集**而不是另一套等分。
  const leftPositions = tipWidthSideControlTsFrom(gridTs, leftFork);
  const rightPositions = tipWidthSideControlTsFrom(gridTs, rightFork);
  [...leftPositions, ...rightPositions].forEach((position) => {
    assert.ok(
      gridTs.some((candidate) => Math.abs(candidate - position) < 1e-12),
      `暴露位置 ${position} 必须取自共享网格`
    );
  });
  assert.deepEqual(
    rightPositions,
    leftPositions.filter((position) => rightPositions.some((c) => Math.abs(c - position) < 1e-12)),
    "浅侧暴露位置是深侧的子集（同参数同间距）"
  );
  // 网格只由公共 fork 决定：交换左右高度得到同一批参数（对称性）。
  assert.deepEqual(tipWidthGridFromHeights(right, left), gridTs);
  assert.deepEqual(tipWidthControlTs(tipWidthCommonForkFromHeights(left, right)), gridTs);
});

test("暴露子集随本侧 zipper 变浅而收缩（数量非对称、判据单调）", () => {
  const { leftFork, rightFork, gridTs } = forks();
  const leftPositions = tipWidthSideControlTsFrom(gridTs, leftFork);
  const rightPositions = tipWidthSideControlTsFrom(gridTs, rightFork);
  assert.equal(leftPositions.length, TIP_WIDTH_CONTROL_POINTS + 1, "深侧暴露整套共享网格");
  assert.ok(rightPositions.length < leftPositions.length, "浅侧暴露更少");
  assert.equal(rightPositions.length, gridTs.filter((t) => t >= rightFork - 1e-4).length);

  // 单调性（不依赖具体高度的交叉校验）：同一网格上 fork 越靠发尖，暴露数不增。
  let previous = Infinity;
  for (const forkT of [0, 0.2, 0.4, 0.5, 0.7, 0.85, 0.95, 1]) {
    const count = tipWidthSideControlTsFrom(gridTs, forkT).length;
    assert.ok(count <= previous, `fork ${forkT} 的暴露数不应多于更深的 fork`);
    previous = count;
  }
  // 全锁定侧（fork >= 1）暴露子集为空 —— 判据本身短路，不靠过滤结果推断。
  assert.equal(tipWidthSideExposesTAt(1, 1), false);
  assert.deepEqual(tipWidthSideControlTsFrom(gridTs, 1), []);
  // fork 边界点自身暴露（0.2.119 的「多暴露一行」同源判据：>= fork - 1e-4）。
  assert.equal(tipWidthSideExposesTAt(0.5, 0.5), true);
  assert.equal(tipWidthSideExposesTAt(0.5, 0.5 - 1e-5), true, "1e-4 容差内仍暴露");
  assert.equal(tipWidthSideExposesTAt(0.5, 0.4), false);
});

test("对侧 fork 记录点：只在落于本侧 fork 之下时写入（避免无把手活点）", () => {
  const { leftFork, rightFork } = forks();
  // 深侧（左，fork 0.5）：对侧 fork 0.8 落在本侧暴露区内部 → 不得记录。
  assert.equal(tipWidthRecordsOppositeForkFrom(leftFork, rightFork), false);
  // 浅侧（右，fork 0.8）：对侧 fork 0.5 在本侧锁定区（回退全局曲线）→ 记录。
  assert.equal(tipWidthRecordsOppositeForkFrom(rightFork, leftFork), true);
  // 两侧等深：互相记录（同一位置，addPoint 去重）。
  assert.equal(tipWidthRecordsOppositeForkFrom(0.5, 0.5), true);
});

test("Reset 曲线：整条全 1（含 fork 边界点），且不含本侧 fork 之下的活点", () => {
  const { leftFork, rightFork, gridTs } = forks();
  for (const [sideForkT, oppositeForkT] of [[leftFork, rightFork], [rightFork, leftFork]]) {
    const curve = tipWidthResetCurveFrom({ gridTs, sideForkT, oppositeForkT });
    curve.forEach((point) => {
      assert.equal(point.value, 1, `Reset 后 ${point.position} 必须是全宽 1（否则出现凹陷）`);
      assert.equal(point.interpolation, "linear");
    });
    assert.ok(curve.some((point) => Math.abs(point.position) < 1e-12), "含 position 0 起点");
    assert.ok(
      curve.some((point) => Math.abs(point.position - sideForkT) < 1e-12),
      "含本侧 fork 边界点"
    );
    assert.ok(curve.some((point) => Math.abs(point.position - 1) < 1e-12), "含发尖端 t=1");
    // 排序不变式（采样器依赖升序）。
    curve.forEach((point, index) => {
      if (index > 0) assert.ok(point.position > curve[index - 1].position, "position 严格升序");
    });
    // 除 0 与（允许的）对侧 fork 记录点外，不得出现本侧 fork 之下的点。
    const records = tipWidthRecordsOppositeForkFrom(sideForkT, oppositeForkT);
    curve.forEach((point) => {
      if (Math.abs(point.position) < 1e-12) return;
      if (records && Math.abs(point.position - oppositeForkT) < 1e-12) return;
      assert.ok(
        tipWidthSideExposesTAt(sideForkT, point.position),
        `${point.position} 必须落在本侧暴露区（否则是无把手活点）`
      );
    });
  }
});

// 全局宽度曲线故意非平直：任何误回退到全局曲线的采样都会偏离创作值而被断言抓到。
const GLOBAL_CURVE = [
  { position: 0, value: 1, interpolation: "linear" },
  { position: 1, value: 0.4, interpolation: "linear" }
];

test("buildTipWidthCurveFrom：暴露位置上的创作值逐位保留，缺曲线时取全局采样", () => {
  const { leftFork, rightFork, gridTs } = forks();
  const controlTs = tipWidthSideControlTsFrom(gridTs, leftFork);

  // 无当前曲线：控制点取全局曲线采样（非全 1，证明确实采了全局）。
  const fresh = buildTipWidthCurveFrom({
    gridTs,
    sideForkT: leftFork,
    oppositeForkT: rightFork,
    globalCurve: GLOBAL_CURVE,
    current: null
  });
  controlTs.forEach((position) => {
    const point = fresh.find((candidate) => Math.abs(candidate.position - position) < 1e-12);
    assert.ok(point, `新建曲线必须含暴露位置 ${position}`);
    assert.ok(point.value < 1 - 1e-6, "全局曲线在 fork 之后已收窄 → 取到的不是 1");
  });

  // 已创作曲线：精确命中优先，值逐位不变（正常重建路径不得改动创作数据）。
  const authored = controlTs.map((position, index) => ({
    position,
    value: 0.5 + index * 0.1,
    interpolation: "linear"
  }));
  const rebuilt = buildTipWidthCurveFrom({
    gridTs,
    sideForkT: leftFork,
    oppositeForkT: rightFork,
    globalCurve: GLOBAL_CURVE,
    current: authored
  });
  authored.forEach((point) => {
    const kept = rebuilt.find((candidate) => Math.abs(candidate.position - point.position) < 1e-12);
    assert.ok(kept, `创作点 ${point.position} 应保留`);
    assert.equal(kept.value, point.value, `创作值在重建后必须不变（${point.position}）`);
  });
  // 重建后曲线上的点（0 与对侧 fork 记录点除外）都必须有把手 = 落在暴露子集里。
  rebuilt.forEach((point) => {
    if (Math.abs(point.position) < 1e-12) return;
    assert.ok(
      tipWidthSideExposesTAt(leftFork, point.position),
      `重建后 ${point.position} 必须可抓`
    );
  });
});

test("buildTipWidthCurveFrom：位置迁移时按旧曲线采样搬运创作形状（不丢回全局默认）", () => {
  // 旧文件（0.2.118）的创作点落在**旧** fork 的等分位置上；新网格位置不同。
  const oldGrid = tipWidthGridFromHeights(0.35, 0.35);
  const authored = tipWidthSideControlTsFrom(oldGrid, tipWidthCommonForkFromHeights(0.35, 0.35))
    .map((position, index) => ({ position, value: 0.6 + index * 0.05, interpolation: "linear" }));

  const { leftFork, rightFork, gridTs } = forks();
  const migrated = buildTipWidthCurveFrom({
    gridTs,
    sideForkT: leftFork,
    oppositeForkT: rightFork,
    globalCurve: GLOBAL_CURVE,
    current: authored
  });
  const newControlTs = tipWidthSideControlTsFrom(gridTs, leftFork);
  // 位置确实移动了（否则本测试没在测迁移分支）。
  assert.ok(
    newControlTs.some((position) => !authored.some((p) => Math.abs(p.position - position) < 1e-3)),
    "新网格必须含旧曲线没有的位置，才走迁移分支"
  );
  newControlTs.forEach((position) => {
    const point = migrated.find((candidate) => Math.abs(candidate.position - position) < 1e-12);
    assert.ok(point, `迁移后必须含新位置 ${position}`);
    const globalValue = 1 + (0.4 - 1) * position; // GLOBAL_CURVE 的线性采样
    const exact = authored.find((p) => Math.abs(p.position - position) < 1e-3);
    if (!exact) {
      assert.ok(
        Math.abs(point.value - globalValue) > 1e-6,
        `${position} 应取旧曲线采样值，而不是回退全局默认 ${globalValue}`
      );
      assert.ok(point.value >= 0.6 - 1e-9, "迁移值落在旧创作曲线的值域内");
    }
  });
});

test("setTipWidthCurveValueFrom：吸附到最近的**已暴露**位置并就地更新", () => {
  const { leftFork, rightFork, gridTs } = forks();
  const sideForkT = rightFork; // 浅侧：暴露子集是共享网格的真子集
  const positions = tipWidthSideControlTsFrom(gridTs, sideForkT);
  const curve = tipWidthResetCurveFrom({ gridTs, sideForkT, oppositeForkT: leftFork });
  const before = curve.length;

  // 传入一个略偏离网格的 t（对称拖拽的典型情形）：必须吸附到最近暴露位置，不新增点。
  const target = positions[1];
  const written = setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t: target + 0.013, value: 1.5 });
  assert.ok(written, "暴露区内的写入必须成功");
  assert.equal(written, curve, "就地更新同一数组（调用方持有 bone 上的引用）");
  assert.equal(curve.length, before, "吸附到已有控制位置 → 不得累积新点");
  const updated = curve.find((point) => Math.abs(point.position - target) < 1e-12);
  assert.equal(updated.value, 1.5, "值写在吸附后的位置上");

  // 吸附取**最近**：t 落在两个暴露位置之间偏向后者时写后者。
  const mid = (positions[1] + positions[2]) * 0.5;
  setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t: mid + 1e-3, value: 0.7 });
  assert.equal(
    curve.find((point) => Math.abs(point.position - positions[2]) < 1e-12).value,
    0.7,
    "偏向后一个位置 → 吸附到后者"
  );
  assert.equal(
    curve.find((point) => Math.abs(point.position - positions[1]) < 1e-12).value,
    1.5,
    "前一个位置的值不受影响"
  );

  // 吸附目标只从**本侧暴露**子集里取：深侧独有的位置不得被浅侧写中。
  const deepOnly = tipWidthSideControlTsFrom(gridTs, leftFork)
    .filter((position) => !positions.some((candidate) => Math.abs(candidate - position) < 1e-12));
  assert.ok(deepOnly.length, "构造前提：深侧确有浅侧不暴露的位置");
  // 值钳位到 [0.08, 2]（与面板/几何共用的宽度倍率区间）。
  setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t: 1, value: 99 });
  assert.equal(curve.at(-1).value, 2, "value 上钳位到 2");
  setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t: 1, value: -5 });
  assert.equal(curve.at(-1).value, 0.08, "value 下钳位到 0.08");
});

test("setTipWidthCurveValueFrom：本侧 fork 之下与全锁定侧一律拒写（返回 null）", () => {
  const { leftFork, rightFork, gridTs } = forks();
  const sideForkT = rightFork;
  const curve = tipWidthResetCurveFrom({ gridTs, sideForkT, oppositeForkT: leftFork });
  const snapshot = JSON.stringify(curve);

  // 本侧锁定区（该段仍跟随主骨骼）：跳过写入而不是吸附成一个可见编辑。
  assert.equal(
    setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t: sideForkT - 0.05, value: 1.7 }),
    null
  );
  assert.equal(JSON.stringify(curve), snapshot, "拒写时曲线逐位不变");
  // 边界容差：恰好 fork - 1e-4 之内仍可写。
  assert.ok(setTipWidthCurveValueFrom({ curve, gridTs, sideForkT, t: sideForkT, value: 1.2 }));

  // 全锁定侧（fork >= 1，暴露子集为空）：无处可写。
  const locked = [];
  assert.equal(
    setTipWidthCurveValueFrom({ curve: locked, gridTs, sideForkT: 1, t: 1, value: 1.2 }),
    null
  );
  assert.equal(locked.length, 0, "全锁定侧不得写出任何点");
});
