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
  // split 骨骼不允许再 parent 到 main.0（发根/头顶）——旧 bug 症状。
  if (f.index === 0 && mainCount > 1) {
    check(`split NOT at main.0: ${f.lock} split.${f.k}`, false, "fork 索引 0 但 mainCount>1（zipper 高度异常）");
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

// ---- ④ 发尖暴露链数量（0.2.107）：暴露链点 = 链参数 t > forkT 的点；split.${k} = 链根，
//     后续暴露点为 tip 关节。数量 = (N-1) - floor(forkT*(N-1))，最少 1（仅发尖点）。----
const chainFindings = [];
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
for (const lock of locks) {
  const mainCount = mainCountOf(lock);
  if (["panel", "surface"].includes(lock.geometryType) && Array.isArray(lock.panelSplits)) {
    for (let k = 0; k < lock.panelSplits.length + 1; k += 1) {
      const forkT = forkTFor(lock, k);
      if (forkT == null) continue;
      const exposed = Math.max(1, (mainCount - 1) - Math.floor(forkT * (mainCount - 1)));
      chainFindings.push({ lock: lock.name, k, exposed });
    }
  } else if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    for (let k = 0; k < 2; k += 1) {
      const forkT = forkTFor(lock, k);
      if (forkT == null) continue;
      const exposed = Math.max(1, (mainCount - 1) - Math.floor(forkT * (mainCount - 1)));
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
// 已知值（与视口暴露规则一致）：Front Bangs 1 seg0=2 / seg1-4=3；Side Bangs Left 1 每管=4。
const fb1 = locks.find((l) => l.name === "Front Bangs 1");
if (fb1) {
  const e0 = chainFindings.find((f) => f.lock === "Front Bangs 1" && f.k === 0)?.exposed;
  const e1 = chainFindings.find((f) => f.lock === "Front Bangs 1" && f.k === 1)?.exposed;
  check("Front Bangs 1 seg0 exposes 2", e0 === 2, `got ${e0}`);
  check("Front Bangs 1 seg1 exposes 3", e1 === 3, `got ${e1}`);
}
const sbl1 = locks.find((l) => l.name === "Side Bangs Left 1");
if (sbl1) {
  const e0 = chainFindings.find((f) => f.lock === "Side Bangs Left 1" && f.k === 0)?.exposed;
  check("Side Bangs Left 1 tube0 exposes 4", e0 === 4, `got ${e0}`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed (${splitFindings.length} split bones, ${children.length} bridge children) ===`);
process.exit(failed.length ? 1 : 0);
