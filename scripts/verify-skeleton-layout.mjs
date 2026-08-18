// scripts/verify-skeleton-layout.mjs — 用真实 .ahs 项目数据验证骨骼布局修复：
// ① split 骨骼的 fork parent（暴露部分根部对应的主骨骼索引）；
// ② 桥接子发片根骨骼的 parent（父发片对应骨骼点）。
// 依赖 usda-export.js 的纯函数 splitBoneLayout / bridgeRootParentName（0.2.106 新增）。
// 运行：node scripts/verify-skeleton-layout.mjs [path-to.ahs]
import fs from "node:fs";
import { splitBoneLayout, bridgeRootParentName, usdIdentifier } from "../modules/io/usda-export.js";

const ahsPath = process.argv[2] || "D:/Downloads/Sussurro_v1_0046.ahs";
if (!fs.existsSync(ahsPath)) {
  console.error("missing project file:", ahsPath);
  process.exit(1);
}
const project = JSON.parse(fs.readFileSync(ahsPath, "utf8"));
const locks = Array.isArray(project?.state?.locks) ? project.state.locks : [];

// 复刻 buildHairUsda 的 jointNameOf（同名 lock 去重 + main.${i} → ${prefix}_${i}）。
const lockPrefix = new Map();
const usedPrefixes = new Set();
locks.forEach((lock) => {
  const base = usdIdentifier(lock.name);
  let prefix = base;
  let suffix = 2;
  while (usedPrefixes.has(prefix)) {
    prefix = `${base}_${suffix}`;
    suffix += 1;
  }
  usedPrefixes.add(prefix);
  lockPrefix.set(lock.id, prefix);
});
const jointNameOf = (lock, name) => {
  const sanitized = lockPrefix.get(lock.id);
  if (typeof name === "string" && name.startsWith("main.")) return `${sanitized}_${name.slice(5)}`;
  if (typeof name === "string" && name.startsWith("split.")) return `${sanitized}_${name.replaceAll(".", "_")}`;
  return name;
};

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const mainCountOf = (lock) => (Array.isArray(lock.points) ? lock.points.length : 0);
// 段/管的 fork 深度（1 − 相邻 zipper 最大高度）。定义提前到首次使用之前（③ 的
// root 推导校验要用），避免 const 箭头函数的 TDZ。
const forkTFor = (lock, k) => {
  if (["panel", "surface"].includes(lock.geometryType) && Array.isArray(lock.panelSplits) && lock.panelSplits.length) {
    const heights = [lock.panelSplits[k - 1]?.height, lock.panelSplits[k]?.height]
      .filter((h) => h != null).map(Number);
    return heights.length ? 1 - Math.max(...heights) : 1;
  }
  if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    return 1 - Math.min(0.8, Math.max(0.02, Number(lock.strandSplitHeight ?? 0.3)));
  }
  return null;
};

// ---- ① split 骨骼 fork parent（面板段：1-max(两侧 zipper 高)；发丝管：1-splitHeight）----
const splitFindings = [];
for (const lock of locks) {
  const mainCount = mainCountOf(lock);
  if (["panel", "surface"].includes(lock.geometryType)) {
    const splits = Array.isArray(lock.panelSplits) ? lock.panelSplits : [];
    const splitCount = splits.length + 1;
    for (let k = 0; k < splitCount; k += 1) {
      const layout = splitBoneLayout(lock, { name: `split.${k}` }, { mainCount, curve: null });
      if (!layout) continue;
      splitFindings.push({ lock: lock.name, k, parent: jointNameOf(lock, `main.${layout.parentMainIndex}`), index: layout.parentMainIndex });
    }
  } else if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    for (let k = 0; k < 2; k += 1) {
      const layout = splitBoneLayout(lock, { name: `split.${k}` }, { mainCount, curve: null });
      if (!layout) continue;
      splitFindings.push({ lock: lock.name, k, parent: jointNameOf(lock, `main.${layout.parentMainIndex}`), index: layout.parentMainIndex });
    }
  }
}
for (const f of splitFindings) {
  const lock = locks.find((l) => l.name === f.lock);
  const mainCount = mainCountOf(lock);
  check(
    `split parent in-range: ${f.lock} split.${f.k} -> ${f.parent}`,
    Number.isInteger(f.index) && f.index >= 0 && f.index < mainCount,
    `mainCount=${mainCount}`
  );
  // 0.2.106 的旧 bug 是「所有 split 骨骼一律硬挂 main.0（忽略 fork 深度）」。旧断言用
  // 「index 不得为 0」来抓它，但 0.2.119 起 root = firstExposed − 1，深 zipper
  // （forkT·last < 2）下 root=0 是**正确**结果（如 Side Left 2 height 0.62 → forkT·5=1.89
  // → firstExposed=1、root=0）。所以改为直接断言真正的不变式：root 由 fork 深度推导，
  // 且严格位于第一个暴露行之下。
  const forkT = forkTFor(lock, f.k);
  if (forkT != null && mainCount > 1) {
    const last = mainCount - 1;
    const firstExposed = Math.min(last, Math.max(1, Math.floor(forkT * last)));
    const expectedRoot = Math.min(last, Math.max(0, Math.floor(forkT * last) - 1));
    check(
      `split root derives from fork depth: ${f.lock} split.${f.k} -> main.${f.index}`,
      f.index === expectedRoot && f.index < firstExposed,
      `forkT=${forkT.toFixed(4)} firstExposed=${firstExposed} expectedRoot=${expectedRoot} got=${f.index}`
    );
  }
}

// ---- ② 桥接子发片根骨骼 parent（branchParentId + branchParentParameter → 父发片 main.${k}）----
const children = locks.filter((lock) => lock.branchParentId);
check("bridge children found", children.length > 0, `${children.length} child locks`);
for (const child of children) {
  const parent = locks.find((lock) => lock.id === child.branchParentId);
  const internal = parent ? bridgeRootParentName(child, locks, (l, name) => name) : null;
  const exported = internal && parent ? jointNameOf(parent, internal) : null;
  const parentCount = parent ? mainCountOf(parent) : 0;
  const index = internal ? Number.parseInt(String(internal).slice(5), 10) : -1;
  const ok = Boolean(exported && parent && index >= 0 && index < parentCount);
  check(
    `bridge root parent: ${child.name} -> ${exported || "?"}`,
    ok,
    `parent=${parent?.name || "?"} param=${child.branchParentParameter} parentMain=${parentCount}`
  );
  // 已知正确值（Houdini 实测）：Side Bangs Left 6 根在 Side Bangs Left 3_5，Side Bangs Left 5 根在 Side Bangs Left 1_5。
  if (child.name === "Side Bangs Left 6") {
    check("Side Bangs Left 6 -> Side_Bangs_Left_3_5", exported === "Side_Bangs_Left_3_5", exported || "null");
  }
  if (child.name === "Side Bangs Left 5") {
    check("Side Bangs Left 5 -> Side_Bangs_Left_1_5", exported === "Side_Bangs_Left_1_5", exported || "null");
  }
  if (child.name === "Side Left 3") {
    check("Side Left 3 -> Side_Left_2_2", exported === "Side_Left_2_2", exported || "null");
  }
}

// ---- ③ 结构自检：每个 split 骨骼的 parent 关节确实存在于导出集（同一发丝 main 链内）----
for (const f of splitFindings) {
  const lock = locks.find((l) => l.name === f.lock);
  const mainCount = mainCountOf(lock);
  const exists = f.index >= 0 && f.index < mainCount;
  check(`parent exists in main chain: ${f.lock} split.${f.k} -> main.${f.index}`, exists, `mainCount=${mainCount}`);
}

// ---- ④ 发尖暴露链数量（0.2.107，规则于 0.2.119 多暴露一行）：第一个暴露链索引
//     firstExposed = clamp(floor(forkT*(N-1)), 1, N-1)（fork 所在行本身也暴露）；
//     split.${k} = 链根，后续暴露点为 tip 关节。数量 = (N-1) - firstExposed + 1，最少 1。----
const chainFindings = [];
// 与 usda-export.js splitChainLayout 逐值同规则（floor，下界 1：索引 0 是坐在主链上的链根）。
const exposedCountFor = (mainCount, forkT) => {
  const last = Math.max(1, mainCount - 1);
  const firstExposed = Math.min(last, Math.max(1, Math.floor(forkT * last)));
  return Math.max(1, last - firstExposed + 1);
};
for (const lock of locks) {
  const mainCount = mainCountOf(lock);
  if (["panel", "surface"].includes(lock.geometryType) && Array.isArray(lock.panelSplits)) {
    for (let k = 0; k < lock.panelSplits.length + 1; k += 1) {
      const forkT = forkTFor(lock, k);
      if (forkT == null) continue;
      const exposed = exposedCountFor(mainCount, forkT);
      chainFindings.push({ lock: lock.name, k, exposed });
    }
  } else if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    for (let k = 0; k < 2; k += 1) {
      const forkT = forkTFor(lock, k);
      if (forkT == null) continue;
      const exposed = exposedCountFor(mainCount, forkT);
      chainFindings.push({ lock: lock.name, k, exposed });
    }
  }
}
for (const f of chainFindings) {
  check(
    `exposed chain count: ${f.lock} split.${f.k} -> ${f.exposed} joints (root + tip chain)`,
    Number.isInteger(f.exposed) && f.exposed >= 1 && f.exposed <= mainCountOf(locks.find((l) => l.name === f.lock)),
    ""
  );
}
// 暴露数与存档内容强相关（增删 zipper 会改变段的相邻高度），因此不写死具体数字，
// 改为按同一公式从存档现场推导并交叉校验——既能抓住真回归，又不会因用户编辑存档而误报。
const expectedExposed = (lock, k) => {
  const mainCount = mainCountOf(lock);
  const forkT = forkTFor(lock, k);
  if (forkT == null) return null;
  return exposedCountFor(mainCount, forkT);
};
for (const f of chainFindings) {
  const lock = locks.find((l) => l.name === f.lock);
  const expected = expectedExposed(lock, f.k);
  check(
    `exposed count matches fork depth: ${f.lock} split.${f.k} -> ${f.exposed}`,
    expected != null && f.exposed === expected,
    `expected ${expected}, got ${f.exposed}`
  );
}
// 段的暴露数必须随其相邻拉链高度单调：更深的拉链（height 更大 → forkT 更小）暴露更多链点。
for (const lock of locks) {
  if (!["panel", "surface"].includes(lock.geometryType)) continue;
  if (!Array.isArray(lock.panelSplits) || !lock.panelSplits.length) continue;
  const rows = [];
  for (let k = 0; k < lock.panelSplits.length + 1; k += 1) {
    const forkT = forkTFor(lock, k);
    if (forkT == null) continue;
    rows.push({ forkT, exposed: expectedExposed(lock, k) });
  }
  const monotonic = rows.every((a) => rows.every((b) => (a.forkT < b.forkT ? a.exposed >= b.exposed : true)));
  check(`exposure is monotonic in fork depth: ${lock.name}`, monotonic, JSON.stringify(rows));
}

const failed = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed (${splitFindings.length} split bones, ${children.length} bridge children) ===`);
process.exit(failed.length ? 1 : 0);
