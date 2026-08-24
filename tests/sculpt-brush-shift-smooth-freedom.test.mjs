// sculpt-brush-shift-smooth-freedom.test.mjs - Shift 临时平滑按笔刷自由度分派（用户拍板）。
//
// 背景（见 app.js sculptBrushShiftSmoothFreedomByTool 定义处注释）：Width Brush 按下 Shift
// 临时切到 smooth 时应该平滑宽度而不动位置；orient/push/slide/twist 应该在各自的关节特殊
// 自由度上平滑而不动默认的链点位置。★最重要的约束：sculpt-smooth 作为用户主动选中的独立
// 工具时，行为一个字节不能变——新路径只在「Shift 临时平滑」且「底层选中的工具是那几个特化
// 笔刷」时才走（判据是 sculptBrushShiftSmoothHeld === true 且 sel.activeTool 命中分派表，
// 不是 effectiveSculptBrushTool() === "sculpt-smooth"，后者分不清两种情况）。
//
// 本文件只测**纯函数与分派表**本身（smoothLinearScalarDeltas 的无 wrap 语义、分派表的查表
// 结果、投影语义），不构造 DOM/three.js 场景去跑完整的 applySculptMoveStrokeSample —— 那需要
// 渲染器/相机等大量脚手架，其它 sculpt 笔刷测试（如 width-brush-purple.test.mjs）同样选择
// 测纯函数层。加法性质（sculpt-smooth 独立工具时的分派结果）用查表本身来验证：表里没有
// "sculpt-smooth" 这个 key，Object 查找返回 undefined，与"整体位置平滑"的默认路径等价。
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { smoothLinearScalarDeltas } from "../modules/sculpt/width-brush.js";
import { smoothSculptTwistDeltas } from "../modules/sculpt/sculpt-brush.js";
import * as THREE from "three";

// 复刻 app.js sculptBrushShiftSmoothFreedomByTool 的表内容（该表是纯数据字面量，无法从
// app.js 里 import——app.js 不是一个导出模块，这里按规格独立声明一份用于测分派逻辑；源码层
// 面的存在性校验见文末的 source-inspection 测试，钉住 app.js 真的定义了同名同值的表）。
const FREEDOM_TABLE = {
  "sculpt-width": "width",
  "sculpt-twist": "twist",
  "sculpt-orient": "twist",
  "sculpt-push": "axis",
  "sculpt-slide": "axis"
};

test("smoothLinearScalarDeltas: 线性邻居平均，不做角度 wrap（幅度判据，与 twist 版对照）", () => {
  // 跨越 π 的值序列：twist 版会把 [0, 3.2] 之间的 gap 当成"绕了一圈更短"去走反方向；
  // 线性版必须原样取算术平均。
  const values = [0, 3.2, 0];
  const weights = [1, 1, 1];
  const linearDeltas = smoothLinearScalarDeltas(values, weights, 1, 1);
  const twistDeltas = smoothSculptTwistDeltas(values, weights, 1, 1);

  // 线性版：index 1 的目标 = (values[0] + values[2]) / 2 = 0，delta = (0 - 3.2) * amount。
  // amount = weight(1) * strength(1) * rate(1) = 1 ⇒ delta = -3.2。
  assert.ok(Math.abs(linearDeltas[1] - -3.2) < 1e-9, `linear delta expected -3.2, got ${linearDeltas[1]}`);

  // twist 版：wrap 会把 0→3.2 的 diff 折成最短路径（3.2 - 2π ≈ -3.083），target = previous +
  // diff/2，与线性版的目标（0）不同，delta 也必然不同——这就是"对照"要证明的东西。
  assert.notEqual(
    twistDeltas[1],
    linearDeltas[1],
    "linear (no-wrap) and twist (wrap) deltas must differ on a value pair straddling π"
  );

  // 方向判据（比"存在差异"更强）：wrap 让 twist 版认为 0 与 3.2 之间「绕另一边更近」，走出
  // 一个正向 delta（把 3.2 往更大的方向推，趋近 2π 那一侧的等价角）；线性版没有环绕概念，
  // 只会把 3.2 往它的算术邻居平均值（0）拉，走出一个负向 delta。两者符号相反，这正是
  // "线性 vs 环绕"语义分歧的可观测判据。
  assert.ok(linearDeltas[1] < 0, `linear delta must move toward the arithmetic mean (negative), got ${linearDeltas[1]}`);
  assert.ok(twistDeltas[1] > 0, `wrapped twist delta must move the OPPOSITE direction (positive) due to angle wrap, got ${twistDeltas[1]}`);

  // 首尾只有单侧邻居：直接靠近那一侧，同样不做 wrap。
  const edgeValues = [0, 3.2];
  const edgeDeltas = smoothLinearScalarDeltas(edgeValues, [1, 1], 1, 1);
  assert.ok(Math.abs(edgeDeltas[0] - 3.2) < 1e-9, "index 0 with only a right neighbor moves straight toward it");
  assert.ok(Math.abs(edgeDeltas[1] - -3.2) < 1e-9, "last index with only a left neighbor moves straight toward it");
});

test("按笔刷自由度分派表：width/twist/orient/push/slide 命中，move/inflate/scale/sculpt-smooth 落回默认", () => {
  assert.equal(FREEDOM_TABLE["sculpt-width"], "width");
  assert.equal(FREEDOM_TABLE["sculpt-twist"], "twist");
  assert.equal(FREEDOM_TABLE["sculpt-orient"], "twist");
  assert.equal(FREEDOM_TABLE["sculpt-push"], "axis");
  assert.equal(FREEDOM_TABLE["sculpt-slide"], "axis");
  // 未登记的工具落回默认（位置平滑）——查表结果为 undefined。
  assert.equal(FREEDOM_TABLE["sculpt-move"], undefined);
  assert.equal(FREEDOM_TABLE["sculpt-inflate"], undefined);
  assert.equal(FREEDOM_TABLE["sculpt-scale"], undefined);
  // ★加法性质核心：sculpt-smooth 本身不在表里。用户主动选中它作为工具时，
  // sel.activeTool === "sculpt-smooth"，查表结果同样是 undefined ⇒ 与"从未按下 Shift"的
  // 默认路径产生完全相同的分派结果（都是"整体位置平滑"）。这正是加法约束要求的：
  // 判据只看 sel.activeTool 是否命中特化表，不看 effectiveSculptBrushTool() 的返回值——
  // 后者在用户主动选 smooth 时也会返回 "sculpt-smooth" 字符串，两种情况在那个函数的输出上
  // 无法区分，只有直接查 sel.activeTool 才能区分。
  assert.equal(FREEDOM_TABLE["sculpt-smooth"], undefined);
});

test("投影语义：delta 投影到 axis 后与 axis 平行，垂直分量为 0", () => {
  const axis = new THREE.Vector3(0, 1, 0).normalize();
  const delta = new THREE.Vector3(3, 4, 5);
  const projected = axis.clone().multiplyScalar(delta.dot(axis));

  // 投影结果必须与 axis 平行（叉积模长为 0，即方向一致或反向一致）。
  const cross = projected.clone().cross(axis);
  assert.ok(cross.length() < 1e-9, `projected vector must be parallel to axis, cross product length = ${cross.length()}`);

  // 垂直分量（delta - projected 在 axis 平面内的分量）必须恰好等于 delta 减去投影：
  // perpendicular = delta - projected，其在 axis 方向上的分量必须为 0。
  const perpendicular = delta.clone().sub(projected);
  assert.ok(
    Math.abs(perpendicular.dot(axis)) < 1e-9,
    `perpendicular component must have zero projection onto axis, got ${perpendicular.dot(axis)}`
  );

  // 幅度判据：投影分量的模长不能超过原 delta 的模长（勾股定理的必然结果，用来堵"投影算成
  // 全量施加"的变体实现——如果直接施加原 delta，projected.length() 会等于 delta.length()
  // 而不是更短，除非 delta 恰好与 axis 平行，这里选的 axis=(0,1,0) 与 delta=(3,4,5) 不平行，
  // 所以严格判 <）。
  assert.ok(
    projected.length() < delta.length(),
    `projected magnitude (${projected.length()}) must be strictly less than the original delta's magnitude (${delta.length()}) for a non-parallel axis`
  );
});

test("app.js 源码层面：sculptBrushShiftSmoothFreedomByTool 表的存在性与内容（防止表被改掉/漂移）", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(
    source,
    /const sculptBrushShiftSmoothFreedomByTool = \{\s*\n\s*"sculpt-width": "width",\s*\n\s*"sculpt-twist": "twist",\s*\n\s*"sculpt-orient": "twist",\s*\n\s*"sculpt-push": "axis",\s*\n\s*"sculpt-slide": "axis"\s*\n\s*\};/,
    "sculptBrushShiftSmoothFreedomByTool must define exactly these five entries"
  );
  // 必须转发给两个消费文件的 deps（否则表存在但用不到）。
  const sculptGeomAssignBlock = source.match(/Object\.assign\(sculptGeomDeps, \{[\s\S]*?\n\}\);/)?.[0] || "";
  assert.match(sculptGeomAssignBlock, /sculptBrushShiftSmoothFreedomByTool,/, "sculptGeomDeps must forward the freedom table");
  const boneInteractionAssignBlock = source.match(/Object\.assign\(boneInteractionDeps, \{[\s\S]*?\n\}\);/)?.[0] || "";
  assert.match(boneInteractionAssignBlock, /sculptBrushShiftSmoothFreedomByTool,/, "boneInteractionDeps must forward the freedom table");
});

test("sculpt-geometry.js 源码层面：加法判据 —— smoothBrushActive 主分支多了 !shiftSmoothFreedom", async () => {
  const source = await readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8");
  // shiftSmoothFreedom 的定义必须要求 sculptBrushShiftSmoothHeld 为真——否则用户没按 Shift
  // 时也会误查表（哪怕表查不到值也不该是"正确地什么都不做"，而应该是"从不查表"）。
  assert.match(
    source,
    /const shiftSmoothFreedom = deps\.sculptState\.sculptBrushShiftSmoothHeld\s*\n\s*\? deps\.sculptBrushShiftSmoothFreedomByTool\[deps\.sel\.activeTool\]\s*\n\s*: undefined;/,
    "shiftSmoothFreedom must only consult the table when Shift is actually held"
  );
  // 原有分支必须收窄为 `smoothBrushActive && !shiftSmoothFreedom`（加法：多了这半句，块内
  // 逐字未改，见上面 dom-contract 测试对块内容的校验）。
  assert.match(source, /if \(smoothBrushActive && !shiftSmoothFreedom\) \{/);
  // 三个新分支必须都以 `smoothBrushActive && shiftSmoothFreedom === "..."` 为判据（不是单独
  // 判 shiftSmoothFreedom，避免在用户根本没有激活 smooth 笔刷时意外触发）。
  assert.match(source, /smoothBrushActive && shiftSmoothFreedom === "twist"/);
  assert.match(source, /smoothBrushActive && shiftSmoothFreedom === "width"/);
  assert.match(source, /smoothBrushActive && shiftSmoothFreedom === "axis"/);
});

test("bone-interaction.js 源码层面：发尖侧同样的加法分派 + bug 1 双侧宽度修复仍在", async () => {
  const source = await readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8");
  assert.match(source, /tool === "sculpt-smooth" && shiftSmoothFreedom === "twist"/);
  assert.match(source, /tool === "sculpt-smooth" && shiftSmoothFreedom === "width"/);
  assert.match(source, /tool === "sculpt-smooth" && shiftSmoothFreedom === "axis"/);
  // 原有"纯位置平滑"分支必须仍然存在且不带任何自由度限定（回落默认路径，一个字节不变）。
  assert.match(source, /\} else if \(tool === "sculpt-smooth"\) \{\s*\n\s*const smoothDeltas = smoothSculptPointDeltas\(points, weights, strength, 0\.04\);/);
  // bug 1 的双侧宽度修复必须还在（本任务不许覆盖掉它）。
  assert.match(source, /\[target\.side, -target\.side\]\.forEach/);
  // width 自由度分支必须双侧循环 [1, -1]，同一约定。
  assert.match(source, /\[1, -1\]\.forEach\(\(side\) => \{/);
});

