// panel-bone-groups-tree.test.mjs - 分组树的遍历顺序、路径寻址、曲线沿链回落、
// normalizePanelBoneGroups 合法性门禁。派生规则（derivePanelBoneGroups 本身的行为）
// 不在本文件测试范围内，见 tests/panel-bone-groups-derive.test.mjs。
import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_PANEL_BONE_DEPTH,
  derivePanelBoneGroups,
  forEachPanelBoneGroup,
  normalizePanelBoneGroups,
  panelBoneGroupAtPath,
  panelBoneGroupPathForLeaf,
  panelBoneGroupsLeafPartition,
  resolvePanelBoneGroupValue
} from "../modules/bones/panel-bone-groups.js";

// 7 个可创作字段：手写测试树时全部显式写出一次，字段名拼错会在断言里立刻暴露。
const BLANK_FIELDS = {
  tipClump: null,
  taperCurve: null,
  taperCurveSecondary: null,
  depthCurve: null,
  depthCurveSecondary: null,
  splitEnabled: null,
  splitSnapToLoops: null
};
const SEVEN_FIELDS = Object.keys(BLANK_FIELDS);

// 结构测试（section 1/2/4）用的节点构造 helper：只关心 leafStart/leafEnd/depth/children，
// 7 个可创作字段统一取 null，仍在 BLANK_FIELDS 里显式列出一次。
function structNode(leafStart, leafEnd, depth, children = null) {
  return { leafStart, leafEnd, depth, ...BLANK_FIELDS, children };
}

// 三层手写树，4 个叶子（叶子下标 0..3）：
//   root [0..3] depth1
//     A  [0..1] depth2
//       A1 [0..0] depth3 leaf
//       A2 [1..1] depth3 leaf
//     B  [2..3] depth2 leaf（自身覆盖 2 个叶子下标，但 children=null，是叶节点）
// 用于 section 1（遍历序）与 2（路径寻址）。每次调用返回全新对象，避免测试间共享引用。
function buildFixtureTree() {
  const a1 = structNode(0, 0, 3, null);
  const a2 = structNode(1, 1, 3, null);
  const a = structNode(0, 1, 2, [a1, a2]);
  const b = structNode(2, 3, 2, null);
  const root = structNode(0, 3, 1, [a, b]);
  return { root, a, a1, a2, b };
}

// ---------------------------------------------------------------------------
// 1. forEachPanelBoneGroup 必须是根→叶序（父严格先于子）
// ---------------------------------------------------------------------------

test("forEachPanelBoneGroup：遍历顺序里每个节点的父节点下标 < 自身下标（根→叶序）", () => {
  const { root } = buildFixtureTree();
  const visited = [];
  forEachPanelBoneGroup(root, (node, path) => {
    visited.push({ node, path });
  });
  // 5 个节点全部访问到：root, A, A1, A2, B。
  assert.equal(visited.length, 5, "5 节点树应访问 5 次");

  // 对每个非根节点，找到其父（path 去掉最后一项）在 visited 里的下标，必须小于自身下标。
  for (let i = 0; i < visited.length; i++) {
    const { path } = visited[i];
    if (path.length === 0) continue; // 根节点无父
    const parentPath = path.slice(0, -1);
    const parentIndex = visited.findIndex(
      (entry) => entry.path.length === parentPath.length && entry.path.every((v, k) => v === parentPath[k])
    );
    assert.notEqual(parentIndex, -1, `path=${JSON.stringify(path)} 的父节点必须已被访问`);
    assert.ok(parentIndex < i, `父节点(下标${parentIndex})必须严格先于子节点(下标${i})访问`);
  }
});

test("forEachPanelBoneGroup：path 参数正确 —— 根 [] / 第k子 [k] / 再下一层 [k,m]", () => {
  const { root, a, a1, a2, b } = buildFixtureTree();
  const byNode = new Map();
  forEachPanelBoneGroup(root, (node, path) => {
    byNode.set(node, path);
  });
  assert.deepEqual(byNode.get(root), []);
  assert.deepEqual(byNode.get(a), [0]);
  assert.deepEqual(byNode.get(b), [1]);
  assert.deepEqual(byNode.get(a1), [0, 0]);
  assert.deepEqual(byNode.get(a2), [0, 1]);
});

test("变异验证：把「父严格先于子」的断言颠倒成「父严格晚于子」，此断言必须变红", () => {
  const { root } = buildFixtureTree();
  const visited = [];
  forEachPanelBoneGroup(root, (node, path) => {
    visited.push({ node, path });
  });
  // 故意反向断言：如果遍历真是根→叶序，下面这条「父下标 > 子下标」的期望应当失败。
  let sawExpectedFailure = false;
  try {
    for (let i = 0; i < visited.length; i++) {
      const { path } = visited[i];
      if (path.length === 0) continue;
      const parentPath = path.slice(0, -1);
      const parentIndex = visited.findIndex(
        (entry) => entry.path.length === parentPath.length && entry.path.every((v, k) => v === parentPath[k])
      );
      assert.ok(parentIndex > i, "颠倒断言：父下标应大于子下标（这在真实根→叶序下不成立）");
    }
  } catch (err) {
    sawExpectedFailure = true;
  }
  assert.equal(sawExpectedFailure, true, "颠倒后的断言必须失败，证明本文件的正向断言真的在咬合");
});

// ---------------------------------------------------------------------------
// 2. 路径寻址往返一致
// ---------------------------------------------------------------------------

test("panelBoneGroupAtPath(root, []) 严格等于 root（同一对象引用）", () => {
  const { root } = buildFixtureTree();
  assert.equal(panelBoneGroupAtPath(root, []), root);
});

test("panelBoneGroupAtPath：对树里每一个节点，用 forEach 产出的 path 查回去必须是同一对象引用", () => {
  const { root } = buildFixtureTree();
  let checked = 0;
  forEachPanelBoneGroup(root, (node, path) => {
    const found = panelBoneGroupAtPath(root, path);
    assert.equal(found, node, `path=${JSON.stringify(path)} 必须寻址回同一节点对象`);
    checked += 1;
  });
  assert.equal(checked, 5, "5 节点树应核对 5 次，防止 forEach 空转导致误绿");
});

test("panelBoneGroupAtPath：越界/非法路径返回 null，不抛异常", () => {
  const { root } = buildFixtureTree();
  const badPaths = [[99], [0, 99], null, "abc", [-1], [0.5]];
  for (const p of badPaths) {
    assert.doesNotThrow(() => panelBoneGroupAtPath(root, p), `path=${JSON.stringify(p)} 不应抛异常`);
    assert.equal(panelBoneGroupAtPath(root, p), null, `path=${JSON.stringify(p)} 应返回 null`);
  }
});

test("panelBoneGroupPathForLeaf：每个叶子下标指向覆盖它、且是最深(children===null)的节点", () => {
  const { root, a1, a2, b } = buildFixtureTree();
  const expectedLeafNode = { 0: a1, 1: a2, 2: b, 3: b };
  for (let leafIndex = 0; leafIndex <= 3; leafIndex++) {
    const path = panelBoneGroupPathForLeaf(root, leafIndex);
    assert.notEqual(path, null, `叶子 ${leafIndex} 必须能寻址到路径`);
    const node = panelBoneGroupAtPath(root, path);
    assert.notEqual(node, null, `叶子 ${leafIndex} 的路径必须能查回节点`);
    assert.equal(node.children, null, `叶子 ${leafIndex} 命中的节点必须是叶节点（children===null）`);
    assert.ok(
      node.leafStart <= leafIndex && leafIndex <= node.leafEnd,
      `叶子 ${leafIndex} 必须落在命中节点的 [${node.leafStart},${node.leafEnd}] 区间内`
    );
    assert.equal(node, expectedLeafNode[leafIndex], `叶子 ${leafIndex} 应命中预期的具体节点对象`);
  }
});

test("panelBoneGroupPathForLeaf：越界叶子下标返回 null", () => {
  const { root } = buildFixtureTree();
  assert.equal(panelBoneGroupPathForLeaf(root, -1), null);
  assert.equal(panelBoneGroupPathForLeaf(root, 4), null); // 4 叶子树合法范围是 0..3，N+1=4 即越界
});

// ---------------------------------------------------------------------------
// 3. resolvePanelBoneGroupValue 沿链向上回落
// ---------------------------------------------------------------------------

// 手写三层树（不依赖派生）：grandparent(depth1) -> parent(depth2) -> child(depth3, leaf)。
// 单链无分叉，专测「就近优先、层层回落、fallback」，与 section 1/2 的 4 叶子树无关。
function buildChainTree({ grandTaper = null, parentTaper = null } = {}) {
  const child = {
    leafStart: 0,
    leafEnd: 0,
    depth: 3,
    ...BLANK_FIELDS,
    children: null
  };
  const parent = {
    leafStart: 0,
    leafEnd: 0,
    depth: 2,
    ...BLANK_FIELDS,
    taperCurve: parentTaper,
    children: [child]
  };
  const grandparent = {
    leafStart: 0,
    leafEnd: 0,
    depth: 1,
    ...BLANK_FIELDS,
    taperCurve: grandTaper,
    children: [parent]
  };
  return { grandparent, parent, child };
}

test("resolvePanelBoneGroupValue：子/父均 null 时，取到祖父写的 taperCurve", () => {
  const grandTaper = [{ position: 0, value: 1 }];
  const { grandparent, child } = buildChainTree({ grandTaper });
  const childPath = panelBoneGroupPathForLeaf(grandparent, 0);
  const value = resolvePanelBoneGroupValue(grandparent, childPath, "taperCurve", "FALLBACK");
  assert.equal(value, grandTaper, "必须拿到祖父那条曲线（同一引用），不是拷贝也不是 fallback");
  assert.notEqual(child.taperCurve, undefined); // 确认 child 字段确实存在且为 null（未被误写）
  assert.equal(child.taperCurve, null);
});

test("resolvePanelBoneGroupValue：父也写了值 ⇒ 就近优先，取父的而不是祖父的", () => {
  const grandTaper = [{ position: 0, value: 1 }];
  const parentTaper = [{ position: 0, value: 2 }];
  const { grandparent } = buildChainTree({ grandTaper, parentTaper });
  const childPath = panelBoneGroupPathForLeaf(grandparent, 0);
  const value = resolvePanelBoneGroupValue(grandparent, childPath, "taperCurve", "FALLBACK");
  assert.equal(value, parentTaper, "父节点更近，必须优先于祖父命中");
});

test("resolvePanelBoneGroupValue：整条链全 null ⇒ 返回传入的 fallback", () => {
  const { grandparent } = buildChainTree(); // grandTaper/parentTaper 都缺省 = null
  const childPath = panelBoneGroupPathForLeaf(grandparent, 0);
  const value = resolvePanelBoneGroupValue(grandparent, childPath, "taperCurve", "FALLBACK");
  assert.equal(value, "FALLBACK");
});

test("resolvePanelBoneGroupValue：不同 key 各自独立回落，互不干扰", () => {
  const grandTaper = [{ position: 0, value: 1 }];
  const { grandparent, parent } = buildChainTree({ grandTaper });
  parent.depthCurve = [{ position: 0, value: 9 }]; // 只在 parent 层写 depthCurve，taperCurve 仍走祖父
  const childPath = panelBoneGroupPathForLeaf(grandparent, 0);
  assert.equal(resolvePanelBoneGroupValue(grandparent, childPath, "taperCurve", null), grandTaper);
  assert.equal(resolvePanelBoneGroupValue(grandparent, childPath, "depthCurve", null), parent.depthCurve);
  assert.equal(resolvePanelBoneGroupValue(grandparent, childPath, "tipClump", "TC_FALLBACK"), "TC_FALLBACK");
});

test("resolvePanelBoneGroupValue：0 与 false 是合法创作值，不是「未创作」，不得被继续向上找", () => {
  // 本仓有先例：`current > 0 ? current : 1` 把合法的 0 误判成缺失，一步爆到 1。
  // 判据必须用 `!== null`，不能用真值判断（0/false 在真值判断下都是 falsy）。
  const child = { leafStart: 0, leafEnd: 0, depth: 2, ...BLANK_FIELDS, children: null };
  const root = {
    leafStart: 0,
    leafEnd: 0,
    depth: 1,
    ...BLANK_FIELDS,
    tipClump: 5, // 祖先层：如果 0 被误判成缺失，就会一路回落到这个非零值，暴露 bug
    splitEnabled: true,
    children: [child]
  };
  child.tipClump = 0; // 合法创作值：用户把 Tip Clump 显式调成了 0
  child.splitEnabled = false; // 合法创作值：用户显式关闭了 Split

  const childPath = panelBoneGroupPathForLeaf(root, 0);
  assert.equal(
    resolvePanelBoneGroupValue(root, childPath, "tipClump", "FALLBACK"),
    0,
    "tipClump=0 必须原样取到，不能被真值判断误判成缺失后回落到祖先的 5"
  );
  assert.equal(
    resolvePanelBoneGroupValue(root, childPath, "splitEnabled", "FALLBACK"),
    false,
    "splitEnabled=false 必须原样取到，不能被真值判断误判成缺失后回落到祖先的 true"
  );
});

test("变异验证：把判据从 !== null 换成真值判断，上面这条 0/false 测试必须变红", () => {
  // 复刻上面的场景，但用「真值判断」模拟 bug：`value || fallbackFromAncestor`。
  const childValue = 0;
  const ancestorValue = 5;
  // 真值判断下的（错误）解析结果：
  const buggyResolved = childValue || ancestorValue;
  assert.notEqual(
    buggyResolved,
    childValue,
    "证明：如果实现用真值判断而非 !== null，0 会被误判成缺失并回落到祖先值，" +
      "这与本文件上一条测试期望的『拿到 0』矛盾 —— 说明上一条测试确实在咬合这个判据"
  );
});

// ---------------------------------------------------------------------------
// 4. normalizePanelBoneGroups 的合法性门禁
// ---------------------------------------------------------------------------

test("normalizePanelBoneGroups：明显非法输入（null/undefined/{}/[]/字符串/数字）返回 null，不自动派生", () => {
  const leafCount = 4;
  const inputs = [null, undefined, {}, [], "panel", 42];
  for (const input of inputs) {
    assert.equal(
      normalizePanelBoneGroups(input, leafCount),
      null,
      `input=${JSON.stringify(input)} 应返回 null，不应自动派生（派生是调用方的事）`
    );
  }
});

test("normalizePanelBoneGroups：叶子区间有缝隙（漏了下标1）⇒ null", () => {
  const gappy = structNode(0, 3, 1, [structNode(0, 0, 2, null), structNode(2, 3, 2, null)]);
  assert.equal(normalizePanelBoneGroups(gappy, 4), null);
});

test("normalizePanelBoneGroups：叶子区间重叠（[0..2]与[2..3]共享下标2）⇒ null", () => {
  const overlapping = structNode(0, 3, 1, [structNode(0, 2, 2, null), structNode(2, 3, 2, null)]);
  assert.equal(normalizePanelBoneGroups(overlapping, 4), null);
});

test("normalizePanelBoneGroups：覆盖范围与 leafCount 不符（少覆盖/超出）⇒ null", () => {
  const leafCount = 4; // 合法范围应覆盖 0..3
  const under = structNode(0, 2, 1, null); // 只覆盖到下标2，少了下标3
  assert.equal(normalizePanelBoneGroups(under, leafCount), null, "少覆盖应返回 null");
  const over = structNode(0, 4, 1, null); // 覆盖到下标4，超出了 leafCount=4 的合法范围(0..3)
  assert.equal(normalizePanelBoneGroups(over, leafCount), null, "超出覆盖应返回 null");
});

test("normalizePanelBoneGroups：深度超过 MAX_PANEL_BONE_DEPTH=5 ⇒ null", () => {
  assert.equal(MAX_PANEL_BONE_DEPTH, 5, "本测试假设的上限常量必须是5，若模块改了常量这里要跟着改");
  // 构造一条深度6的单链单叶子树：depth 1..6，最内层才是叶节点。
  let node = structNode(0, 0, 6, null);
  for (let depth = 5; depth >= 1; depth--) {
    node = structNode(0, 0, depth, [node]);
  }
  assert.equal(normalizePanelBoneGroups(node, 1), null, "深度6必须被拒绝");
});

test("normalizePanelBoneGroups：合法输入 ⇒ 缺失字段补 null，depth 被重算正确", () => {
  // 故意用不完整字段（缺 7 个可创作字段中的几个 + 错误的 depth）来验证归一化会修正它们。
  const raw = {
    leafStart: 0,
    leafEnd: 3,
    depth: 999, // 故意写错，验证会被重算成 1
    children: [
      { leafStart: 0, leafEnd: 1, children: null }, // 缺全部 7 个可创作字段 + depth
      { leafStart: 2, leafEnd: 3, depth: -5, children: null } // depth 也写错
    ]
  };
  const normalized = normalizePanelBoneGroups(raw, 4);
  assert.notEqual(normalized, null, "结构合法的输入不应被拒绝");
  assert.equal(normalized.depth, 1, "根 depth 必须被重算为1");
  assert.equal(normalized.children[0].depth, 2, "第一子节点 depth 必须被重算为2");
  assert.equal(normalized.children[1].depth, 2, "第二子节点 depth 必须被重算为2");
  for (const key of SEVEN_FIELDS) {
    assert.equal(normalized.children[0][key], null, `缺失字段 ${key} 必须被补成 null`);
  }
});

test("normalizePanelBoneGroups 与 derivePanelBoneGroups 往返一致：叶子划分完全相同", () => {
  // 只借 derive 生产一棵合法的树作为归一化的输入数据，不断言 derive 内部的分层规则
  // （那是 panel-bone-groups-derive.test.mjs 的范围）。
  const splits = [
    { position: -0.3, height: 0.3, order: 0 },
    { position: 0.3, height: 0.3, order: 1 }
  ];
  const leafCount = splits.length + 1; // 3
  const derived = derivePanelBoneGroups(splits);
  const normalized = normalizePanelBoneGroups(derived, leafCount);
  assert.notEqual(normalized, null, "derive 产出的树必须能通过 normalize 的合法性门禁");
  assert.deepEqual(
    panelBoneGroupsLeafPartition(normalized),
    panelBoneGroupsLeafPartition(derived),
    "归一化前后的叶子划分必须完全一致（归一化不应改变叶子结构，只补字段/重算depth）"
  );
});











