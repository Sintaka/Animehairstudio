import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_STRAND_TIP_CLUMP,
  PANEL_SEGMENT_HOST,
  STRAND_SEGMENT_HOST,
  materializeStrandSplitBones,
  resolveSegmentSelection,
  segmentBoneHost,
  strandSplitsFor
} from "../modules/bones/bone-model.js";
import {
  canFitAnotherStrandSplit,
  createSegmentControlApi,
  insertedStrandSplitHeight,
  largestStrandSegmentIndex
} from "../modules/bones/segment-control.js";
import { readFile } from "node:fs/promises";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const segmentSource = await readFile(new URL("../modules/bones/segment-control.js", import.meta.url), "utf8");

// N 个拉链 → N+1 管。position 刻意乱序 + 一个越界值：段数必须取自
// strandSplitsFor 的归一化结果（排序 + 钳制），而不是原始数组的其它属性。
function splitStrand(positions) {
  return {
    id: "strand-1",
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: positions.map((position, order) => ({ position, height: 0.3, order })),
    strandSplitHeight: 0.3,
    taperCurve: [{ position: 0, value: 1 }, { position: 1, value: 1 }],
    depthCurve: [{ position: 0, value: 1 }, { position: 1, value: 1 }]
  };
}

test("segmentBoneHost dispatches per geometry and only for split strands", () => {
  assert.equal(segmentBoneHost({ geometryType: "panel" }), PANEL_SEGMENT_HOST);
  assert.equal(segmentBoneHost({ geometryType: "surface" }), PANEL_SEGMENT_HOST, "surface shares the panel segment model");
  assert.equal(segmentBoneHost(splitStrand([0])), STRAND_SEGMENT_HOST);
  // 未开启分裂的普通发丝没有管段可编；无 host = 消费方整块跳过（UI 也据此隐藏）。
  assert.equal(segmentBoneHost({ geometryType: "strand", strandSplitEnabled: false }), null);
  assert.equal(segmentBoneHost({ geometryType: "poly" }), null);
  assert.equal(segmentBoneHost(null), null);
  // 两种宿主用彼此独立的 store 键：混用会让发丝段号污染 panel 段号。
  assert.notEqual(PANEL_SEGMENT_HOST.segmentIndexKey, STRAND_SEGMENT_HOST.segmentIndexKey);
  assert.equal(STRAND_SEGMENT_HOST.segmentIndexKey, "strandSegmentIndex");
  assert.equal(STRAND_SEGMENT_HOST.bonesField, "strandSplitBones");
});

test("strand segment count is zippers + 1 and the index clamps into range", () => {
  const oneZipper = splitStrand([0]);
  const threeZippers = splitStrand([0.4, -0.4, 0]);
  assert.equal(resolveSegmentSelection(oneZipper, { strandSegmentIndex: 0 }).count, 2, "N=1 -> 2 tubes (legacy case)");
  assert.equal(resolveSegmentSelection(threeZippers, { strandSegmentIndex: 0 }).count, 4, "N=3 -> 4 tubes");
  // legacy 单标量存档（strandSplits 缺失）经 strandSplitsFor 回退成 1 条拉链 → 2 管。
  assert.equal(
    resolveSegmentSelection(
      { geometryType: "strand", strandSplitEnabled: true, strandSplitPosition: 0, strandSplitHeight: 0.3 },
      { strandSegmentIndex: 0 }
    ).count,
    2,
    "legacy scalar fallback still yields 2 tubes"
  );
  // 删掉拉链后残留的旧下标必须被钳回末段，而不是越界读到 undefined 骨骼。
  assert.equal(resolveSegmentSelection(threeZippers, { strandSegmentIndex: 9 }).index, 3);
  assert.equal(resolveSegmentSelection(oneZipper, { strandSegmentIndex: 9 }).index, 1);
  assert.equal(resolveSegmentSelection(oneZipper, { strandSegmentIndex: -3 }).index, 0);
  // 脏值（NaN / 缺失 / 浮点）兜底：NaN→0，浮点取 round。
  assert.equal(resolveSegmentSelection(oneZipper, { strandSegmentIndex: Number.NaN }).index, 0);
  assert.equal(resolveSegmentSelection(oneZipper, {}).index, 0);
  assert.equal(resolveSegmentSelection(threeZippers, { strandSegmentIndex: 1.6 }).index, 2);
  // panel 键不参与发丝解析（分开存的意义）。
  assert.equal(resolveSegmentSelection(threeZippers, { panelSegmentIndex: 3 }).index, 0);
  assert.equal(resolveSegmentSelection({ geometryType: "strand", strandSplitEnabled: false }, {}), null);
});

// 最小 DOM 替身：只需要被 syncSegmentControls / stepSegment 读写的那几个属性。
function fakeElement() {
  const classes = new Set();
  return {
    textContent: "",
    disabled: false,
    value: "",
    classList: {
      toggle: (name, on) => {
        if (on) classes.add(name);
        else classes.delete(name);
      },
      contains: (name) => classes.has(name)
    }
  };
}

function segmentApiHarness(lock) {
  const dom = {
    strandSegmentControls: fakeElement(),
    strandSegmentLabel: fakeElement(),
    previousStrandSegmentButton: fakeElement(),
    nextStrandSegmentButton: fakeElement(),
    strandSegmentSpread: fakeElement(),
    strandSegmentSpreadValue: fakeElement(),
    strandSegmentTaperPreview: fakeElement(),
    strandSegmentDepthPreview: fakeElement()
  };
  const calls = { geometry: 0, curveObjects: 0, mirror: 0, topology: 0, retarget: [] };
  const sculptState = { panelSegmentIndex: 0, strandSegmentIndex: 0 };
  const api = createSegmentControlApi({
    ...dom,
    sculptState,
    sel: {},
    syncShapePresetSelects: () => {},
    taperEditor: {
      activeStrandShapeTarget: () => lock,
      renderTaperPreview: () => {},
      retargetOpenSegmentTaperEditor: (target, index) => calls.retarget.push(index)
    },
    getSelectedLock: () => lock,
    isPanelGeometry: (target) => ["panel", "surface"].includes(target?.geometryType),
    updateLockGeometry: () => { calls.geometry += 1; },
    rebuildCurveObjects: () => { calls.curveObjects += 1; },
    syncActiveMirror: () => { calls.mirror += 1; },
    updateTopologyStats: () => { calls.topology += 1; }
  });
  return { api, dom, sculptState, calls };
}

// changeStrandSplitCount 额外需要的 deps（app.js 侧的拉链归一化/legacy 回写/UI 刷新）。
// cloneStrandSplits 这里只做「排序 + 克隆」：测试用的 splits 本就在钳位区间内，
// 归一化的钳位/order 去重由 app.js 自己的测试覆盖，此处只需要真源的顺序语义。
function splitCountHarness(lock) {
  const base = segmentApiHarness(lock);
  const calls = { ...base.calls, undo: 0, syncInputs: 0 };
  const api = createSegmentControlApi({
    strandSegmentControls: base.dom.strandSegmentControls,
    strandSegmentLabel: base.dom.strandSegmentLabel,
    previousStrandSegmentButton: base.dom.previousStrandSegmentButton,
    nextStrandSegmentButton: base.dom.nextStrandSegmentButton,
    strandSegmentSpread: base.dom.strandSegmentSpread,
    strandSegmentSpreadValue: base.dom.strandSegmentSpreadValue,
    strandSegmentTaperPreview: base.dom.strandSegmentTaperPreview,
    strandSegmentDepthPreview: base.dom.strandSegmentDepthPreview,
    sculptState: base.sculptState,
    sel: {},
    syncShapePresetSelects: () => {},
    taperEditor: {
      activeStrandShapeTarget: () => lock,
      renderTaperPreview: () => {},
      retargetOpenSegmentTaperEditor: () => {}
    },
    getSelectedLock: () => lock,
    isPanelGeometry: () => false,
    updateLockGeometry: () => { calls.geometry += 1; },
    rebuildCurveObjects: () => { calls.curveObjects += 1; },
    syncActiveMirror: () => { calls.mirror += 1; },
    updateTopologyStats: () => { calls.topology += 1; },
    pushUndoState: () => { calls.undo += 1; },
    updateDrawStrandPreview: () => {},
    STRAND_SPLIT_MAX: 8,
    cloneStrandSplits: (value) => (Array.isArray(value) ? value : [])
      .map((split) => ({ ...split }))
      .sort((a, b) => a.position - b.position),
    syncStrandSplitLegacyFields: (target) => {
      if (Array.isArray(target.strandSplits) && target.strandSplits.length) {
        target.strandSplitPosition = target.strandSplits[0].position;
        target.strandSplitHeight = target.strandSplits[0].height;
      }
    },
    syncStrandSplitInputs: () => { calls.syncInputs += 1; }
  });
  return { api, calls, sculptState: base.sculptState };
}

test("strand segment stepper walks the tubes and disables at both ends", () => {
  const lock = splitStrand([0.4, -0.4, 0]); // 3 zippers -> 4 tubes
  const { api, dom, sculptState, calls } = segmentApiHarness(lock);

  api.syncStrandSegmentControls(lock);
  calls.retarget.length = 0; // 只关心步进引起的重定向
  assert.equal(dom.strandSegmentControls.classList.contains("hidden"), false, "split strand shows the block");
  assert.equal(dom.strandSegmentLabel.textContent, "1", "label is 1-based");
  assert.equal(dom.previousStrandSegmentButton.disabled, true, "first segment disables previous");
  assert.equal(dom.nextStrandSegmentButton.disabled, false);

  api.stepStrandSegment(1);
  assert.equal(sculptState.strandSegmentIndex, 1);
  assert.equal(sculptState.panelSegmentIndex, 0, "panel index is untouched by strand stepping");
  assert.equal(dom.strandSegmentLabel.textContent, "2");
  assert.equal(dom.previousStrandSegmentButton.disabled, false);
  assert.deepEqual(calls.retarget, [1], "the open floating curve editor follows the segment");

  api.stepStrandSegment(1);
  api.stepStrandSegment(1);
  assert.equal(sculptState.strandSegmentIndex, 3, "walked to the last tube");
  assert.equal(dom.nextStrandSegmentButton.disabled, true, "last segment disables next");
  // 越界步进不动（钳位），也不会写出 count 之外的下标。
  api.stepStrandSegment(1);
  assert.equal(sculptState.strandSegmentIndex, 3);
  api.stepStrandSegment(-1);
  assert.equal(sculptState.strandSegmentIndex, 2);
  assert.equal(api.selectedStrandSegment(lock).count, 4);
});

test("strand segment block hides for strands without split geometry", () => {
  const plain = { id: "s", geometryType: "strand", strandSplitEnabled: false };
  const { api, dom, sculptState } = segmentApiHarness(plain);
  api.syncStrandSegmentControls(plain);
  assert.equal(dom.strandSegmentControls.classList.contains("hidden"), true);
  // 无段可切时步进必须是 no-op（不写脏索引进 store）。
  api.stepStrandSegment(1);
  assert.equal(sculptState.strandSegmentIndex, 0);
  api.syncStrandSegmentControls(null);
  assert.equal(dom.strandSegmentControls.classList.contains("hidden"), true, "no target also hides the block");
});

test("per-segment spread writes land on the selected tube only", () => {
  const lock = splitStrand([0.4, -0.4, 0]); // 4 tubes
  const { api, sculptState, calls, dom } = segmentApiHarness(lock);
  const baseline = materializeStrandSplitBones(lock).map((bone) => bone.tipClump);

  sculptState.strandSegmentIndex = 2;
  api.applyStrandSegmentSpread(0.42);
  assert.equal(lock.strandSplitBones.length, 4, "materialized to one bone per tube");
  assert.ok(Math.abs(lock.strandSplitBones[2].tipClump - 0.42) < 1e-9, "write hits the selected index");
  [0, 1, 3].forEach((index) => {
    assert.ok(
      Math.abs(lock.strandSplitBones[index].tipClump - baseline[index]) < 1e-9,
      `tube ${index} keeps its own spread`
    );
  });
  assert.equal(dom.strandSegmentSpreadValue.textContent, "0.42");
  // 几何 → 曲线对象 → 镜像 → 统计：与 changeStrandSplitCount 的重建序列一致。
  assert.deepEqual(
    [calls.geometry, calls.curveObjects, calls.mirror, calls.topology],
    [1, 1, 1, 1],
    "spread edits rebuild geometry, curve objects, the mirror partner and the stats"
  );

  // 钳位与 normalizeStrandSplitBone 的 SPREAD_MAX 同界：超过 0.99 会让管尖越过自身宽度。
  api.applyStrandSegmentSpread(5);
  assert.ok(Math.abs(lock.strandSplitBones[2].tipClump - 0.99) < 1e-9, "clamped to SPREAD_MAX");
  api.applyStrandSegmentSpread(-1);
  assert.equal(lock.strandSplitBones[2].tipClump, 0, "clamped at 0");
});

// ── 0.2.132：全局 Split Spacing（segment separate）已整体删除，不得复活 ────────────────
// 本处原有两条测试守「Split Spacing 是全局刷、物化后仍能刷到每根管」（0.2.125 修的 bug
// #20）。该滑杆连同其「整管横向平移」语义已按用户决定删除：发尖聚合改由每管 Tip Clump
// 表达，管的横向分离由 zipper 决定。下面两条改为**删除守卫** —— 全局刷若被重新引入会覆盖
// 每管创作过的 Tip Clump（Tip Clump 现在是逐管创作数据），那是回归而非修复。
test("the deleted global Split Spacing brush stays deleted (no scalar-to-every-tube writer)", () => {
  // 断言**剥掉注释后**的源码：本轮刻意在删除点留了「此处原有 X，已删除，勿复活」的契约注释
  // （standards 第四类：刻意不改/已删除的东西及原因），直接扫全文会匹配到那些注释自身。
  const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  assert.doesNotMatch(
    stripComments(segmentSource),
    /applyStrandSplitGapToTubes/,
    "segment-control must not carry a global spread brush again"
  );
  // app.js 侧：**滑杆及其接线**必须没了。`strandSplitGap` 这个存档字段本身**刻意保留**
  // （见下一条测试：它是 per-tube 默认值的派生来源，与 panel 的 panelSplitGap 同构），
  // 所以这里断言的是「没有 DOM 控件/处理器」，而不是「字段名不出现」。
  assert.doesNotMatch(
    stripComments(appSource),
    /strandSplitGap:\s*document\.querySelector/,
    "the global Split Spacing slider must not be re-bound"
  );
  assert.doesNotMatch(
    stripComments(appSource),
    /strandSplitInputs\.strandSplitGap/,
    "no handler may write the lock-level scalar from a control again"
  );
});

test("every tube's Tip Clump defaults from the legacy gap field, exactly like the panel side", () => {
  const lock = splitStrand([-0.3, 0.3]); // 2 zippers -> 3 tubes
  // 0.2.132 的取舍（与 panel 的 defaultSplitTipClump 读 panelSplitGap 同构）：删掉的是
  // **滑杆与其「整管横向平移」语义**，`lock.strandSplitGap` 这个存档字段保留，仅作 per-tube
  // 默认值的派生来源 —— 旧档打开后每管仍拿到作者当年写下的量级，观感可比。
  lock.strandSplitGap = 0.4;
  assert.deepEqual(
    materializeStrandSplitBones(lock).map((bone) => bone.tipClump),
    [0.4, 0.4, 0.4],
    "an old file's gap seeds every tube's Tip Clump default"
  );
  // 无该字段（新建发丝）时落到常量兜底。
  const fresh = splitStrand([-0.3, 0.3]);
  delete fresh.strandSplitGap;
  assert.deepEqual(
    materializeStrandSplitBones(fresh).map((bone) => bone.tipClump),
    [DEFAULT_STRAND_TIP_CLUMP, DEFAULT_STRAND_TIP_CLUMP, DEFAULT_STRAND_TIP_CLUMP],
    "without the legacy field every tube falls back to the shared constant"
  );
  // per-tube 写入仍是唯一改 Tip Clump 的途径（applyStrandSegmentSpread，上一条测试已覆盖钳位）。
  // 关键回归：创作过的那一管**不得**被 lock 级标量刷掉 —— 这正是删掉全局刷所换来的性质。
  lock.strandSplitBones[1].tipClump = 0.77;
  assert.deepEqual(
    materializeStrandSplitBones(lock).map((bone) => bone.tipClump),
    [0.4, 0.77, 0.4],
    "an authored per-tube Tip Clump must survive (nothing brushes over it anymore)"
  );
});

// ── Bug 2：X 镜像取负后必须重排，否则 legacy 标量写进错误那条拉链的 height ────────────
test("mirrored strandSplits are re-sorted before the legacy scalars are derived", () => {
  // 非对称 height：不排序就会把 0.7（原最左）写成镜像后最左的 height（正确值是 0.25）。
  const source = [{ position: -0.5, height: 0.7, order: 0 }, { position: 0.2, height: 0.25, order: 1 }];
  const mirrored = source
    .map((split) => ({ ...split, position: -split.position }))
    .sort((a, b) => a.position - b.position);
  assert.deepEqual(mirrored.map((split) => split.position), [-0.2, 0.5], "ascending by position");
  assert.equal(mirrored[0].height, 0.25, "sorted-first is the former rightmost zipper");
  // strandSplitsFor（几何/骨骼的归一化真源）与镜像后的数组必须同序，legacy 标量才自洽。
  const partner = { geometryType: "strand", strandSplitEnabled: true, strandSplits: mirrored };
  assert.deepEqual(strandSplitsFor(partner).map((split) => split.height), [0.25, 0.7]);

  // 两处镜像写入都必须 clone → negate → sort（panel 侧同形）。
  const mirrorWrites = appSource.match(
    /cloneStrandSplits\(lock\.strandSplits, lock\.strandSplitPosition, lock\.strandSplitHeight, STRAND_SPLIT_MAX\)\s*\n\s*\.map\(\(split\) => \(\{ \.\.\.split, position: -split\.position \}\)\)\s*\n\s*\.sort\(\(a, b\) => a\.position - b\.position\)/g
  );
  assert.equal(mirrorWrites?.length, 2, "live mirror + createMirrorPartner 快照两处都已修正");
  // 裸 .map 取负（跳过 cloneStrandSplits 的钳位/order 去重/非空回退）必须绝迹。
  assert.equal(
    /strandSplits(:| =) \(lock\.strandSplits \|\| \[\]\)\.map/.test(appSource),
    false,
    "no raw negate-only mirror path remains"
  );
});

// ── Bug 3：+ 按钮的 disabled 必须与插入守卫同判据（不写死 N=7）──────────────────────
test("the add-zipper button disables exactly where insertion is refused", () => {
  // 复现 + 按钮的重复二分：每次在最宽段中点插入。
  const positions = [];
  let refusedAt = null;
  for (let step = 0; step < 12; step += 1) {
    const splits = positions.map((position, order) => ({ position, height: 0.3, order }));
    if (!canFitAnotherStrandSplit(splits)) { refusedAt = splits.length; break; }
    const index = largestStrandSegmentIndex(splits);
    const boundaries = [-0.8, ...positions.slice().sort((a, b) => a - b), 0.8];
    positions.push((boundaries[index] + boundaries[index + 1]) * 0.5);
  }
  assert.equal(typeof refusedAt, "number", "bisection eventually hits the minimum span");
  // N 由判据推导，不写死：断言「拒绝的那一刻按钮就已 disabled」。
  const atRefusal = Array.from({ length: refusedAt }, (_, order) => ({ position: positions[order], height: 0.3, order }));
  assert.equal(canFitAnotherStrandSplit(atRefusal), false, "predicate refuses at the boundary N");
  const beforeRefusal = atRefusal.slice(0, -1);
  assert.equal(canFitAnotherStrandSplit(beforeRefusal), true, "one zipper earlier still fits");

  // app.js 的按钮门控必须消费同一个函数，而不是复制边界/跨度算术。
  assert.match(
    appSource,
    /addStrandSplitButton\.disabled = !enabled\s*\n\s*\|\| splits\.length >= STRAND_SPLIT_MAX\s*\n\s*\|\| !canFitAnotherStrandSplit\(splits\)/,
    "#addStrandSplit 的 disabled 由 canFitAnotherStrandSplit 单点驱动"
  );
});

// ── Bug 4：新拉链继承被细分段的邻居，而不是 strandSplits[0]（用户批准的行为变更）──────
test("a new zipper inherits the subdivided segment's neighbour height", () => {
  // 最左拉链被拖浅（0.05），legacy 标量因 syncStrandSplitLegacyFields 也变成 0.05。
  const splits = [
    { position: -0.7, height: 0.05, order: 0 },
    { position: -0.5, height: 0.6, order: 1 }
  ];
  const target = { strandSplitHeight: 0.05 };
  // 最宽段是右边缘（-0.5 → 0.8）：唯一邻居是 height=0.6 的那条。
  assert.equal(largestStrandSegmentIndex(splits), 2);
  const inherited = insertedStrandSplitHeight(target, splits, 2);
  assert.equal(inherited, 0.6, "edge segment inherits its single neighbour");
  assert.notEqual(inherited, splits[0].height, "老实现在这里取 strandSplits[0]/legacy 标量 0.05");
  assert.notEqual(inherited, target.strandSplitHeight);

  // 内部段：两邻居算术平均（与 position 取段中点同源）。
  assert.equal(insertedStrandSplitHeight(target, splits, 1), (0.05 + 0.6) / 2);
  // 左边缘段：唯一邻居是最左那条。
  assert.equal(insertedStrandSplitHeight(target, splits, 0), 0.05);
  // 乱序输入也要按 position 取邻居（内部按 position 升序解析）。
  assert.equal(insertedStrandSplitHeight(target, splits.slice().reverse(), 2), 0.6);
  // 无邻居（N=0，仅防御）回退旧默认。
  assert.equal(insertedStrandSplitHeight({ strandSplitHeight: 0.31 }, [], 0), 0.31);
  assert.equal(insertedStrandSplitHeight({}, [], 0), 0.3);
});

test("changeStrandSplitCount(+1) applies the neighbour rule end to end", () => {
  const lock = {
    id: "strand-1",
    geometryType: "strand",
    strandSplitEnabled: true,
    strandSplits: [
      { position: -0.7, height: 0.05, order: 0 },
      { position: -0.5, height: 0.6, order: 1 }
    ],
    strandSplitPosition: -0.7,
    strandSplitHeight: 0.05, // legacy 标量已被最左拉链回写成 0.05（正是老 bug 的种子）
    taperCurve: [{ position: 0, value: 1 }, { position: 1, value: 1 }],
    depthCurve: [{ position: 0, value: 1 }, { position: 1, value: 1 }]
  };
  const { api, calls } = splitCountHarness(lock);
  api.changeStrandSplitCount(1);

  assert.equal(lock.strandSplits.length, 3);
  const added = lock.strandSplits.find((split) => split.order === 2);
  assert.ok(added, "new zipper carries the next order");
  // 最宽段是 (-0.5, 0.8)：中点 0.15，唯一邻居 height=0.6。
  assert.ok(Math.abs(added.position - 0.15) < 1e-9, "inserted at the widest segment's midpoint");
  assert.equal(added.height, 0.6, "inherits the subdivided segment's neighbour");
  assert.notEqual(added.height, 0.05, "老实现在这里继承 legacy 标量 0.05");
  assert.equal(lock.strandSplitBones.length, 4, "bones re-materialized to one per tube (3 zippers -> 4 tubes)");
  assert.equal(calls.undo, 1, "insertion pushes exactly one undo entry");
});

// ── 0.2.126：普通发丝的发尖子骨骼选择（tipSelection）的生命周期 ─────────────────────
// 用户报告：普通发丝上「选不到 zipper 分裂出来的子发尖，更没法进一步控制」。根因是选择
// 状态本身只有 panel 有。这组测试守的是「选择能建立 / 能切换 / 能取消 / 删管后不悬空」。

test("tipSelection is one geometry-agnostic key shared by panels and split strands", async () => {
  const storeSource = await readFile(
    new URL("../modules/edit/sculpt-edit-store.js", import.meta.url),
    "utf8"
  );
  // 单键（而非 panelTipSelection + strandTipSelection 两套）是本轮的核心决策：清理路径、
  // 表面高亮、笔刷门控、tipUiActive 因此各自只有一份实现。
  assert.match(storeSource, /\btipSelection: null\b/, "the store exposes the shared tipSelection key");
  assert.match(storeSource, /\btipHover: null\b/, "the store exposes the shared tipHover key");
  // 只查**声明**（`key: null`），不查注释——注释里会提到旧键名以说明改名由来。
  assert.doesNotMatch(storeSource, /\bpanelTipSelection: |\bpanelTipHover: /, "no panel-only tip selection key remains");
  assert.doesNotMatch(storeSource, /\bstrandTipSelection: |\bstrandTipHover: /, "no parallel strand-only tip selection key was added");
  // 全仓库范围：旧键名不得残留在任何消费方（改名必须改全，漏一处就是静默失效的读取）。
  assert.doesNotMatch(appSource, /panelTipSelection|panelTipHover/, "app.js has no stale panel-only tip key reference");
  // 段号仍是两套（panel 与发丝必须能各自停在不同下标，0.2.125 结论）。
  assert.match(storeSource, /panelSegmentIndex: 0/);
  assert.match(storeSource, /strandSegmentIndex: 0/);
});

test("clicking a split strand's body toggles the tube's tip selection (panel's semantics)", () => {
  // app.js 的点击分支耦合 DOM 事件，无法在 node 里执行；按本仓库既有做法用 source-text
  // 断言守住语义，并在下面用纯逻辑复刻同一条 toggle 规则做行为断言。
  // 门控必须是 segmentBoneHost（几何单一分派），而不是 isPanelGeometry。
  assert.match(
    appSource,
    /const tipHost = selectedLockNow && selectedLockNow\.panelSplitEnabled !== false\s*\?\s*segmentBoneHost\(selectedLockNow\)/,
    "body-click selection dispatches on segmentBoneHost, so split strands are included"
  );
  // 「已分裂」判据取 host.segmentCount > 1（panel 原判据 panelSplits.length > 0 的几何无关版）。
  assert.match(
    appSource,
    /const hasSegments = Boolean\(tipHost\) && tipHost\.segmentCount\(selectedLockNow\) > 1/,
    "a single-segment hair has nothing to select, on either geometry"
  );
  // 再点同一处取消（panel 的 toggle 语义），段号写 host.segmentIndexKey。
  assert.match(
    appSource,
    /sculptState\.state\.tipSelection = null; \/\/ click again -> back to main selection/,
    "clicking the same region again clears the selection"
  );
  assert.match(
    appSource,
    /sculptState\.state\[tipHost\.segmentIndexKey\] = hoverSeg/,
    "the current-segment index is written through the host descriptor (panel and strand keep separate indices)"
  );

  // 行为侧：把 toggle 规则复刻成纯函数，断言 3 管发丝上的完整序列。
  const lock = splitStrand([-0.3, 0.3]); // 2 zippers -> 3 tubes
  const host = segmentBoneHost(lock);
  assert.equal(host, STRAND_SEGMENT_HOST);
  assert.equal(host.segmentCount(lock), 3);
  const state = { tipSelection: null, strandSegmentIndex: 0, panelSegmentIndex: 0 };
  const clickTube = (tube) => {
    const cur = state.tipSelection;
    if (cur && cur.lockId === lock.id && cur.segmentIndex === tube) state.tipSelection = null;
    else {
      state.tipSelection = { lockId: lock.id, segmentIndex: tube };
      state[host.segmentIndexKey] = tube;
    }
  };
  clickTube(2);
  assert.deepEqual(state.tipSelection, { lockId: "strand-1", segmentIndex: 2 }, "first click selects tube 2");
  assert.equal(state.strandSegmentIndex, 2, "the UI's current segment follows the selection");
  assert.equal(state.panelSegmentIndex, 0, "the panel index is never touched by a strand selection");
  clickTube(2);
  assert.equal(state.tipSelection, null, "clicking the same tube again clears it");
  assert.equal(state.strandSegmentIndex, 2, "deselecting deliberately does NOT rewind the current segment (panel's feel)");
  clickTube(0);
  clickTube(1);
  assert.deepEqual(state.tipSelection, { lockId: "strand-1", segmentIndex: 1 }, "clicking another tube switches instead of clearing");
});

test("tip selection is dropped when the addressed tube stops existing", () => {
  // 3 拉链 → 4 管；选中最后一根管，然后删到 3 管。
  const lock = splitStrand([-0.4, 0, 0.4]);
  const { api, sculptState } = splitCountHarness(lock);
  sculptState.strandSegmentIndex = 3;
  sculptState.tipSelection = { lockId: lock.id, segmentIndex: 3 };
  assert.equal(STRAND_SEGMENT_HOST.segmentCount(lock), 4);

  api.changeStrandSplitCount(-1);

  assert.equal(STRAND_SEGMENT_HOST.segmentCount(lock), 3, "one zipper removed -> 3 tubes");
  assert.equal(
    sculptState.tipSelection,
    null,
    "a selection addressing tube 3 must be dropped, not left dangling (it would consume every brush sample)"
  );
  // 同一 lock 内仍存在的管不受影响：重新选中管 1，再删一次仍应保留。
  sculptState.tipSelection = { lockId: lock.id, segmentIndex: 1 };
  api.changeStrandSplitCount(-1);
  assert.equal(STRAND_SEGMENT_HOST.segmentCount(lock), 2);
  assert.deepEqual(
    sculptState.tipSelection,
    { lockId: lock.id, segmentIndex: 1 },
    "a still-valid tube keeps its selection across a delete"
  );
});

test("switching locks clears the tip selection through exactly one cleanup path", () => {
  // selectLock 的清理是唯一路径（panel 与发丝共用）——不得为发丝新增第二处。
  assert.match(
    appSource,
    /if \(sculptState\.state\.tipSelection && sculptState\.state\.tipSelection\.lockId !== id\) \{\s*sculptState\.state\.tipSelection = null;/,
    "selectLock drops a tip selection belonging to another lock"
  );
  assert.match(
    appSource,
    /if \(sculptState\.state\.tipHover && sculptState\.state\.tipHover\.lockId !== id\) \{\s*sculptState\.state\.tipHover = null;/,
    "the same path drops a stale hover"
  );
  assert.equal(
    (appSource.match(/sculptState\.state\.tipSelection = null/g) || []).length,
    4,
    "tipSelection is cleared in exactly the 4 known places (selectLock, alt-click toggle, body-click toggle x2)"
  );
});
