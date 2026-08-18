import assert from "node:assert/strict";
import test from "node:test";

import {
  SCULPT_TWIST_BRUSH_SCALE,
  resolveFrozenTwistStrokeWeights,
  sculptTwistBrushAngle,
  sculptTwistBrushDeltas
} from "../modules/sculpt/sculpt-brush.js";

// Mirrors the brush write path: twist deltas are added onto the twist scalars and NOTHING
// else. Positions are passed through untouched so the caller can assert they never move.
function applyTwistBrush(chain, weights, options) {
  const deltas = sculptTwistBrushDeltas(chain.points.length, weights, options);
  return {
    points: chain.points.map((point) => ({ ...point })),
    twists: chain.twists.map((twist, index) => twist + deltas[index]),
    deltas
  };
}

function makeChain(count) {
  return {
    points: Array.from({ length: count }, (_, index) => ({ x: index, y: index * 2, z: index * 3 })),
    twists: new Array(count).fill(0)
  };
}

// A single brushed point at index 2 keeps the H-mode assertions unambiguous.
const singleWeights = [0, 0, 1, 0, 0, 0];

test("twist angle maps the horizontal drag alone, scaled by weight and strength", () => {
  // The scale constant stays a positive MAGNITUDE; the direction is a separate internal term.
  assert.equal(SCULPT_TWIST_BRUSH_SCALE, 0.01);
  assert.equal(sculptTwistBrushAngle(100, 1, 0.5), -(100 * 1 * 0.5 * 0.01));
  assert.equal(sculptTwistBrushAngle(100, 0.5, 0.5), -(100 * 0.5 * 0.5 * 0.01));
  // Sign follows the drag direction only, so it cannot flip when the camera orbits.
  // Drag RIGHT rolls NEGATIVE around the tangent (drag LEFT rolls positive).
  assert.ok(sculptTwistBrushAngle(50, 1, 1) < 0);
  assert.ok(sculptTwistBrushAngle(-50, 1, 1) > 0);
  // Math.abs normalizes IEEE -0: zero drag means zero roll, whatever the sign of the zero.
  assert.equal(Math.abs(sculptTwistBrushAngle(0, 1, 1)), 0);
  // Weight is clamped and non-finite input degrades to zero rather than NaN.
  assert.equal(sculptTwistBrushAngle(100, 5, 1), -(100 * 1 * 1 * 0.01));
  assert.equal(Math.abs(sculptTwistBrushAngle(undefined, 1, 1)), 0);
  // A caller-supplied scale override gets the same direction as the default scale.
  assert.ok(sculptTwistBrushAngle(50, 1, 1, { scale: 0.02 }) < 0);
});

test("twist changes only the twist array and never the positions", () => {
  const chain = makeChain(6);
  const before = chain.points.map((point) => ({ ...point }));
  const result = applyTwistBrush(chain, singleWeights, { deltaX: 40, strength: 0.5, firstIndex: 1 });
  assert.deepEqual(result.points, before);
  assert.deepEqual(chain.points, before);
  assert.notDeepEqual(result.twists, chain.twists);
});

test("hierarchy OFF twists only the cursor-weighted points", () => {
  const chain = makeChain(6);
  const before = chain.points.map((point) => ({ ...point }));
  const weights = [0, 0, 1, 0.5, 0, 0];
  const result = applyTwistBrush(chain, weights, { deltaX: 40, strength: 0.5, firstIndex: 1 });
  // Negative: drag-right (deltaX > 0) rolls negative around the tangent.
  const expected = -(40 * 0.5 * SCULPT_TWIST_BRUSH_SCALE);
  assert.equal(result.twists[2], expected);
  assert.equal(result.twists[3], expected * 0.5);
  // Zero-weight points, including everything downstream, stay put.
  [0, 1, 4, 5].forEach((index) => assert.equal(result.twists[index], 0));
  assert.deepEqual(result.points, before);
});

test("hierarchy ON rolls the whole downstream sub-chain rigidly without moving it", () => {
  const chain = makeChain(6);
  const before = chain.points.map((point) => ({ ...point }));
  const result = applyTwistBrush(chain, singleWeights, {
    deltaX: 40,
    strength: 0.5,
    firstIndex: 1,
    hierarchy: true
  });
  const expected = -(40 * 0.5 * SCULPT_TWIST_BRUSH_SCALE);
  // The brushed index AND every downstream index receive the SAME delta.
  [2, 3, 4, 5].forEach((index) => assert.equal(result.twists[index], expected));
  // Upstream of the brushed point is untouched.
  [0, 1].forEach((index) => assert.equal(result.twists[index], 0));
  // The user's explicit constraint: rotating children must not move them.
  assert.deepEqual(result.points, before);
  assert.deepEqual(chain.points, before);
});

test("hierarchy propagation stays inside the controller point range", () => {
  const chain = makeChain(8);
  const before = chain.points.map((point) => ({ ...point }));
  const weights = [0, 0, 0, 1, 0, 0, 0, 0];
  const result = applyTwistBrush(chain, weights, {
    deltaX: 40,
    strength: 0.5,
    hierarchy: true,
    rangeStart: 2,
    rangeEnd: 6,
    firstIndex: 2
  });
  const expected = -(40 * 0.5 * SCULPT_TWIST_BRUSH_SCALE);
  [3, 4, 5].forEach((index) => assert.equal(result.twists[index], expected));
  // Outside the range nothing rolls, even downstream of the brushed point.
  [0, 1, 2, 6, 7].forEach((index) => assert.equal(result.twists[index], 0));
  assert.deepEqual(result.points, before);
});

test("reverse (Ctrl) negates the twist angle in both hierarchy modes", () => {
  assert.equal(
    sculptTwistBrushAngle(100, 1, 0.5, { reverse: true }),
    -sculptTwistBrushAngle(100, 1, 0.5)
  );
  const options = { deltaX: 40, strength: 0.5, firstIndex: 1 };
  [false, true].forEach((hierarchy) => {
    const forward = sculptTwistBrushDeltas(6, singleWeights, { ...options, hierarchy });
    const reversed = sculptTwistBrushDeltas(6, singleWeights, { ...options, hierarchy, reverse: true });
    // Normalize -0 so the comparison is about magnitude and sign, not IEEE zero identity.
    assert.deepEqual(reversed, forward.map((delta) => (delta === 0 ? 0 : -delta)));
  });
});

// Change 2: the affected point set is frozen at mousedown and must not follow the cursor.
test("twist freezes the stroke's affected point set after the first sample", () => {
  const stroke = {};
  // Each call models a different cursor position, so a live recompute would differ.
  const cursors = [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1]
  ];
  let calls = 0;
  const resolve = () => resolveFrozenTwistStrokeWeights(stroke, "lock-1:0", 5, () => {
    const weights = cursors[Math.min(calls, cursors.length - 1)];
    calls += 1;
    return weights;
  });
  const first = resolve();
  assert.deepEqual(first, [0, 0, 1, 0, 0]);
  assert.equal(calls, 1);
  // A later sample with a MOVED cursor reuses the stroke-start array, byte for byte.
  const second = resolve();
  assert.equal(second, first);
  assert.deepEqual(second, [0, 0, 1, 0, 0]);
  assert.equal(calls, 1, "the frozen weights must not be recomputed mid-stroke");
});

test("a length mismatch forces a twist weight recompute instead of misindexing", () => {
  const stroke = {};
  const five = resolveFrozenTwistStrokeWeights(stroke, "lock-1:0", 5, () => [0, 0, 1, 0, 0]);
  assert.equal(five.length, 5);
  // The tip chain changed mid-stroke: the stale 5-long array must not be reused for 7 points.
  const seven = resolveFrozenTwistStrokeWeights(stroke, "lock-1:0", 7, () => [0, 0, 0, 1, 0, 0, 0]);
  assert.equal(seven.length, 7);
  assert.notEqual(seven, five);
  assert.equal(resolveFrozenTwistStrokeWeights(stroke, "lock-1:0", 7, () => []), seven);
});

test("twist weight freezing is per stroke and per lock+segment, so nothing leaks", () => {
  const strokeA = {};
  const cached = resolveFrozenTwistStrokeWeights(strokeA, "lock-1:0", 4, () => [0, 1, 0, 0]);
  // Same stroke, DIFFERENT tip chain: its own key, its own frozen array.
  const otherSegment = resolveFrozenTwistStrokeWeights(strokeA, "lock-1:1", 4, () => [0, 0, 1, 0]);
  assert.notEqual(otherSegment, cached);
  assert.deepEqual(otherSegment, [0, 0, 1, 0]);
  assert.equal(resolveFrozenTwistStrokeWeights(strokeA, "lock-1:0", 4, () => []), cached);
  // A fresh stroke object (the app builds a new one on every pointerdown) starts empty.
  const strokeB = {};
  const fresh = resolveFrozenTwistStrokeWeights(strokeB, "lock-1:0", 4, () => [0, 0, 0, 1]);
  assert.notEqual(fresh, cached);
  assert.deepEqual(fresh, [0, 0, 0, 1]);
  assert.equal(strokeA.twistTipWeights.get("lock-1:0"), cached);
});

test("the chain root is excluded via firstIndex", () => {
  const rootWeights = [1, 0, 0, 0];
  const deltas = sculptTwistBrushDeltas(4, rootWeights, { deltaX: 40, strength: 0.5, firstIndex: 1 });
  assert.deepEqual(deltas, [0, 0, 0, 0]);
});
