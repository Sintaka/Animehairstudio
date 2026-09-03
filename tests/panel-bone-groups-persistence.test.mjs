// 中间层分组树的持久化契约（0.2.178）
//
// 背景：在 0.2.178 之前，snapshotState() 的 lock 键枚举里没有 panelBoneGroups ⇒ 中间层
// 节点上的全部创作值（4 条曲线 + tip）存盘即蒸发，且每按一次撤销也蒸发
// 一次（该函数同时服务存盘/撤销/重做/崩溃恢复/File>New 五条路径）。
//
// ★ 判据分工（这一段决定了改坏 app.js 时哪条会红，别删）：
// - 「源码断言」那几条是**唯一真正守着 app.js 生产代码**的检查。node 单测从不 import
//   app.js（它依赖 THREE 与浏览器全局），所以行为断言用的是模块侧的真函数、**不会**
//   因为 app.js 漂移而变红。要监视枚举里那个键是否还在，只能靠读源文本。
// - 「行为断言」守的是 modules/bones/panel-bone-groups.js 的归一化口径与深拷贝性质。
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizePanelBoneGroups } from "../modules/bones/panel-bone-groups.js";

const APP_JS = new URL("../app.js", import.meta.url);

// 复刻 app.js 里 snapshotPanelBoneGroupsFor 的语义，供行为断言使用。
// ⚠ 这是复刻品，不监视 app.js —— app.js 侧由下面的源码断言守。
function snapshotLike(lock) {
  const leafCount = (Array.isArray(lock?.panelSplits) ? lock.panelSplits.length : 0) + 1;
  const normalized = normalizePanelBoneGroups(lock?.panelBoneGroups, leafCount);
  return normalized ? JSON.parse(JSON.stringify(normalized)) : null;
}

function makeTree() {
  return {
    leafStart: 0, leafEnd: 2, depth: 1,
    taperCurve: [{ t: 0.25, v: 0.77 }],
    depthCurve: [{ t: 0.5, v: 0.61 }],
    children: [
      { leafStart: 0, leafEnd: 1, depth: 2, taperCurve: [{ t: 0.5, v: 0.33 }], children: null },
      { leafStart: 2, leafEnd: 2, depth: 2, children: null }
    ]
  };
}

function makeLock() {
  return { panelSplits: [{ position: 0.3 }, { position: 0.6 }], panelBoneGroups: makeTree() };
}

test("源码断言：snapshotState 的 lock 键枚举里含 panelBoneGroups", async () => {
  const source = await readFile(APP_JS, "utf8");
  // 键枚举区间 = projectSnapshotLocks(...).map((lock) => ({ … })) 之间。
  // 用 placementFrame 当区间末端锚点（它是枚举里的最后一个原有键）。
  const start = source.indexOf("projectSnapshotLocks(locks");
  assert.ok(start > 0, "找不到 projectSnapshotLocks 锚点，app.js 结构可能已变");
  const end = source.indexOf("referenceImages:", start);
  assert.ok(end > start, "找不到 referenceImages 锚点（枚举区间末端）");
  const enumeration = source.slice(start, end);

  assert.match(enumeration, /panelBoneGroups/,
    "lock 键枚举里没有 panelBoneGroups ⇒ 中间层创作值会存盘即丢、撤销也丢");
  // 正向对照：证明这段切片确实是那个枚举（panelSplits 一定在里面）
  assert.match(enumeration, /panelSplits/, "对照失败：切到的不是 lock 键枚举");
  // 负向对照：假键必须不在，证明 match 不是恒真
  assert.doesNotMatch(enumeration, /ZZZnotARealKey/, "负向对照失败：断言恒真，无分辨力");
});

test("源码断言：写进快照的分组树必须深拷贝（不能只做归一化）", async () => {
  const source = await readFile(APP_JS, "utf8");
  const idx = source.indexOf("function snapshotPanelBoneGroupsFor");
  assert.ok(idx > 0, "找不到 snapshotPanelBoneGroupsFor");
  const body = source.slice(idx, idx + 600);
  // 归一化函数按引用赋值可创作值（曲线数组），而撤销栈存内存对象、不经 JSON 往返
  // ⇒ 少了这次深拷贝，快照会与用户正在编辑的那棵树共享曲线数组。
  assert.match(body, /JSON\.parse\(JSON\.stringify/,
    "缺少深拷贝 ⇒ 快照与实时树共享曲线数组，撤销会拿到已被改过的数据");
});

test("行为：分组树的创作值能活过一次存读往返", () => {
  const snap = snapshotLike(makeLock());
  assert.ok(snap, "快照不该为 null");
  // 用「幅度」而非存在性：这些值都不与种子化默认值撞车
  assert.equal(snap.taperCurve[0].v, 0.77);
  assert.equal(snap.depthCurve[0].v, 0.61);
  assert.equal(snap.children[0].taperCurve[0].v, 0.33);

  const restored = normalizePanelBoneGroups(JSON.parse(JSON.stringify(snap)), 3);
  assert.ok(restored, "读回后不该为 null");
  assert.equal(restored.taperCurve[0].v, 0.77, "存读往返后主曲线值丢失");
  assert.equal(restored.depthCurve[0].v, 0.61, "存读往返后 depthCurve 丢失");
});

test("行为：快照与实时树不共享引用（撤销栈存内存对象，这条是必需的）", () => {
  const lock = makeLock();
  const snap = snapshotLike(lock);

  lock.panelBoneGroups.taperCurve[0].v = 999;
  lock.panelBoneGroups.children[0].taperCurve[0].v = 888;
  lock.panelBoneGroups.depthCurve[0].v = 0.99;

  assert.equal(snap.taperCurve[0].v, 0.77, "快照被实时树的改动污染了（共享引用）");
  assert.equal(snap.children[0].taperCurve[0].v, 0.33, "子节点曲线共享引用");
  assert.equal(snap.depthCurve[0].v, 0.61, "depthCurve 共享引用");

  // 负向对照：只做归一化（不深拷贝）必须能观察到污染，证明上面三条有分辨力
  const naive = normalizePanelBoneGroups(lock.panelBoneGroups, 3);
  assert.equal(naive.taperCurve[0].v, 999,
    "负向对照失效：归一化竟然也深拷贝了，说明上面三条断言无分辨力");
});

test("行为：未物化 / 非法一律返回 null ⇒ 调用处省略整个键", () => {
  assert.equal(snapshotLike({ panelSplits: [{ position: 0.3 }] }), null, "缺字段应为 null");
  assert.equal(snapshotLike({ panelSplits: [], panelBoneGroups: null }), null, "null 应为 null");
  assert.equal(snapshotLike({ panelSplits: [], panelBoneGroups: { junk: 1 } }), null, "垃圾应为 null");
  // 正向对照：合法输入必须非 null，否则上面四条可能是恒真
  assert.ok(snapshotLike(makeLock()), "正向对照失败：合法输入也返回 null");
});

test("行为：leafCount 与树的覆盖区间不符时判非法（不吞坏数据）", () => {
  // 1 个 split ⇒ 2 个叶子，但树的根覆盖 0..2（3 个叶子）⇒ 必须判非法
  const mismatched = { panelSplits: [{ position: 0.3 }], panelBoneGroups: makeTree() };
  assert.equal(snapshotLike(mismatched), null, "区间不符竟然通过了校验");
});
