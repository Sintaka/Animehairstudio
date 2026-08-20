// scripts/probe-forkt-equivalence.mjs — fork-T collapse 的**逐值等价探针**。
// 用法：node scripts/probe-forkt-equivalence.mjs > before.json   (在 HEAD 上跑)
//       node scripts/probe-forkt-equivalence.mjs > after.json    (collapse 之后跑)
//       两份必须 **byte-identical**（fc / Compare-Object）。
//
// 覆盖 9 处 fork-T 站点里**每一处可从 node 直接到达的**入口，并**刻意包含**共享层与
// panel guard 形式唯一可能分歧的输入（负高度 / NaN / 字符串），使「等价」是被测出来的
// 而不是被假设的。套件全绿不算证据（0.2.125 抽取共享层时 panel 断言一条未改仍全绿）。
import { strandSplitForkTForSegment, strandSplitsFor } from "../modules/bones/bone-model.js";
import {
  tipWidthSideForkFromHeights,
  tipWidthCommonForkFromHeights,
  tipWidthGridFromHeights,
  segmentZipperHeights
} from "../modules/geometry/tip-width-curve.js";
import { splitBoneLayout, splitChainLayout, tipChainNearestIndex } from "../modules/io/usda-export.js";

// 高度取值集合：正常区间 + 边界 + **越界/异常**（负、>1、NaN、字符串、null、undefined）。
// 负高度是共享层（钳到 1）与 panel guard 形式（可 >1）唯一的分歧点，必须在探针里。
const HEIGHTS = [0, 0.02, 0.2, 0.4, 0.78, 0.8, 1, -0.1, -0.5, 1.5, NaN, "0.3", "", null, undefined];

const out = { sites: {} };

// ── 站点 ①：tip-width-curve.js tipWidthSideForkFromHeights 内的 segmentForkT ──────────
// 以及站点定义点本身 tipWidthCommonForkFromHeights。两侧 side 都扫。
const perSide = [];
for (const left of HEIGHTS) {
  for (const right of HEIGHTS) {
    perSide.push({
      left: String(left),
      right: String(right),
      common: tipWidthCommonForkFromHeights(left, right),
      sideNeg: tipWidthSideForkFromHeights(left, right, -1),
      sidePos: tipWidthSideForkFromHeights(left, right, 1),
      grid: tipWidthGridFromHeights(left, right)
    });
  }
}
out.sites.tipWidthCurve = perSide;

// ── 站点 ③：bone-model strandSplitForkTForSegment（lock 版，审计要求保留）────────────
// 探针仍记录它，因为 collapse 不得改变它的输出（它是 legacy 标量回退的归一化入口）。
const boneModel = [];
for (const splits of [
  null,
  [],
  [{ position: 0, height: 0.4 }],
  [{ position: -0.3, height: 0.4 }, { position: 0.3, height: 0.2 }],
  [{ position: 0, height: -0.1 }],
  [{ position: 0, height: 1.5 }],
  [{ position: 0.5, height: 0.3 }, { position: -0.5, height: 0.7 }]
]) {
  const lock = { strandSplits: splits, strandSplitHeight: 0.3, strandSplitPosition: 0 };
  const normalized = strandSplitsFor(lock);
  const row = { splits: JSON.stringify(splits), normalized: JSON.stringify(normalized), forkTs: [] };
  for (let segment = -1; segment <= (splits?.length ?? 0) + 2; segment += 1) {
    row.forkTs.push({ segment, forkT: strandSplitForkTForSegment(lock, segment) });
  }
  // 同一批 splits 上，共享层直接消费**已归一化**高度时的逐值结果（等价性的核心比对）。
  row.shared = [];
  for (let segment = 0; segment <= normalized.length; segment += 1) {
    const { left, right } = segmentZipperHeights(normalized, segment);
    row.shared.push({ segment, forkT: tipWidthCommonForkFromHeights(left, right) });
  }
  boneModel.push(row);
}
out.sites.boneModel = boneModel;

// ── 站点 ⑥⑦：usda-export splitBoneLayout / splitChainLayout 的 panel guard 形式 ────────
// 这两处读的是**原始** lock.panelSplits（未经 normalizePanelSplits 钳制），所以负高度在
// 理论上可达（手改 .ahs）。探针因此**必须**扫负高度：collapse 后这两处的输出若在负高度
// 上变化，就是语义改变而非重构。
const PANEL_SPLIT_SETS = [
  [{ position: 0, height: 0.4 }],
  [{ position: -1 / 3, height: 0.28 }, { position: 1 / 3, height: 0.28 }],
  [{ position: -1 / 3, height: 0.5 }, { position: 1 / 3, height: 0.1 }],
  [{ position: 0, height: -0.1 }],
  [{ position: -0.3, height: -0.2 }, { position: 0.3, height: -0.4 }],
  [{ position: -0.3, height: 0.3 }, { position: 0.3, height: -0.4 }],
  [{ position: 0, height: 1.5 }],
  [{ position: 0, height: NaN }],
  [{ position: 0, height: null }],
  [{ position: 0 }]
];

const frameAt = () => ({
  x: { x: 1, y: 0, z: 0, clone() { return { ...this }; } },
  y: { x: 0, y: 1, z: 0, clone() { return { ...this }; } },
  z: { x: 0, y: 0, z: 1, clone() { return { ...this }; } }
});
const fakeCurve = {
  getPoint: (t) => ({ x: 0, y: t, z: 0, clone() { return { ...this }; } }),
  getPointAt: (t) => ({ x: 0, y: t, z: 0, clone() { return { ...this }; } })
};

const panelLayout = [];
for (const splits of PANEL_SPLIT_SETS) {
  for (const geometryType of ["panel", "surface"]) {
    for (let k = 0; k <= splits.length + 1; k += 1) {
      const lock = { id: "L", name: "L", geometryType, panelSplits: splits, panelSplitEnabled: true };
      const bone = { name: `split.${k}`, parent: "main" };
      let layout = null;
      let chain = null;
      try {
        layout = splitBoneLayout(lock, bone, { mainCount: 9, curve: fakeCurve, strandGeometryFrameAt: frameAt });
      } catch (error) { layout = `THROW:${error.message}`; }
      try {
        chain = splitChainLayout(lock, bone, { mainCount: 9, curve: fakeCurve, strandGeometryFrameAt: frameAt });
      } catch (error) { chain = `THROW:${error.message}`; }
      panelLayout.push({
        splits: JSON.stringify(splits),
        geometryType,
        k,
        layout: JSON.stringify(layout),
        chain: JSON.stringify(chain)
      });
    }
  }
}
out.sites.panelExportLayout = panelLayout;

// ── 站点 ⑤：usda-export strandForkTForTube（经 splitBoneLayout 的发丝分支到达）────────
const strandLayout = [];
for (const splits of [
  [{ position: 0, height: 0.4 }],
  [{ position: -0.3, height: 0.4 }, { position: 0.3, height: 0.2 }],
  [{ position: 0, height: -0.1 }],
  null
]) {
  for (let k = 0; k <= (splits?.length ?? 1) + 1; k += 1) {
    const lock = {
      id: "S", name: "S", geometryType: "strand", strandSplitEnabled: true,
      strandSplits: splits, strandSplitHeight: 0.3, strandSplitPosition: 0,
      baseWidth: 0.16, widthScale: 1
    };
    const bone = { name: `split.${k}`, parent: "main" };
    let layout = null;
    try {
      layout = splitBoneLayout(lock, bone, { mainCount: 9, curve: fakeCurve, strandGeometryFrameAt: frameAt });
    } catch (error) { layout = `THROW:${error.message}`; }
    strandLayout.push({ splits: JSON.stringify(splits), k, layout: JSON.stringify(layout) });
  }
}
out.sites.strandExportLayout = strandLayout;

// ── 站点 ⑦ 的下游：tipChainNearestIndex（project-files 用它把 forkT 变成关节名）────────
// project-files 的两份 forkT 无法从 node 直接调用（它在 buildHairUsda 的闭包里），但它
// 唯一的下游消费是 tipChainNearestIndex(t, mainCount, forkT)。探针在**全部 forkT 取值**上
// 钉住该映射，于是 project-files 侧 forkT 若变，关节名必变，此表必变。
const nearest = [];
for (const forkT of [0, 0.2, 0.5, 0.6, 0.72, 1, 1.1, 1.5, -0.1, NaN]) {
  for (const mainCount of [1, 2, 5, 9]) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      nearest.push({ forkT: String(forkT), mainCount, t, ...tipChainNearestIndex(t, mainCount, forkT) });
    }
  }
}
out.sites.tipChainNearest = nearest;

// ── panel guard 形式 vs 共享层：**显式**分歧表 ────────────────────────────────────────
// 这不是「站点」，而是把两种形式的差异**列出来**，让 collapse 的正确性可被独立复核。
const divergence = [];
for (const left of HEIGHTS) {
  for (const right of HEIGHTS) {
    // panel guard 形式（4 处 panel 站点的原始写法，逐字复制）
    const heights = [left, right].filter((h) => h != null).map(Number);
    const guardForm = heights.length ? 1 - Math.max(...heights) : 1;
    // 共享层形式
    const sharedForm = tipWidthCommonForkFromHeights(left, right);
    const same = Object.is(guardForm, sharedForm);
    if (!same) divergence.push({ left: String(left), right: String(right), guardForm, sharedForm });
  }
}
out.divergenceGuardVsShared = divergence;

// ── 真实工程数据：assets/presets/layered-side-bun.ahs 的全部 lock × 全部段 ──────────────
// 合成输入证明「公式等价」，真实 .ahs 证明「**可达**输入上导出逐值不变」。两者都要。
const { readFileSync, existsSync } = await import("node:fs");
const presetPath = new URL("../assets/presets/layered-side-bun.ahs", import.meta.url);
if (existsSync(presetPath)) {
  const project = JSON.parse(readFileSync(presetPath, "utf8"));
  const locks = Array.isArray(project?.state?.locks) ? project.state.locks : [];
  const real = [];
  for (const lock of locks) {
    const mainCount = Array.isArray(lock.points) ? lock.points.length : 0;
    const segCount = (Array.isArray(lock.panelSplits) ? lock.panelSplits.length : 0)
      + (Array.isArray(lock.strandSplits) ? lock.strandSplits.length : 0) + 2;
    for (let k = 0; k <= segCount; k += 1) {
      const bone = { name: `split.${k}`, parent: "main" };
      let layout = null;
      let chain = null;
      try { layout = splitBoneLayout(lock, bone, { mainCount, curve: null }); }
      catch (error) { layout = `THROW:${error.message}`; }
      try { chain = splitChainLayout(lock, bone, { mainCount, curve: null }); }
      catch (error) { chain = `THROW:${error.message}`; }
      real.push({
        lock: lock.name,
        geometryType: lock.geometryType,
        k,
        mainCount,
        layout: JSON.stringify(layout),
        chain: JSON.stringify(chain)
      });
    }
  }
  out.sites.realPresetExport = real;
}

// ── 站点 ④：strand-geometry sectionSplitStart（几何顶点逐值）────────────────────────────
// 直接 hash 顶点/UV/法线数组：sectionSplitStart 若变，发尖 WidthCurve 采样与 Tip Clump
// 收窄都会移动顶点 ⇒ hash 必变。这是「几何 byte-identical」的实际证据。
const THREE = await import("three");
const { createStrandGeometryApi } = await import("../modules/geometry/strand-geometry.js");
const geometryApi = createStrandGeometryApi({
  branchSweep: {
    createSmoothSweepProfileCurve: () => null,
    sampleSweepProfile: (points, t) => points[Math.floor(t * points.length) % points.length].clone(),
    trimmedSweepProfile: (points) => points,
    createSweepProfileTopology: () => null
  },
  strandCurveParameters: (lock, curve, segments) => (
    Array.from({ length: segments + 1 }, (_, index) => index / segments)
  ),
  strandGeometryFrameAt: () => ({
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
  }),
  strandProfileTopologyAt: (lock, t, points, scaleX, scaleZ) => (
    points.map((point) => ({ x: point.x * scaleX, z: point.z * scaleZ }))
  ),
  strandInfluenceColor: () => new THREE.Color(1, 1, 1),
  gridProfileSkipCol: () => -1
});
const profile = [
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 0, 0.7),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, 0, -0.7)
];
const geometryRows = [];
for (const splits of [
  null,
  [{ position: 0, height: 0.4 }],
  [{ position: -0.3, height: 0.4 }, { position: 0.3, height: 0.2 }],
  [{ position: -0.5, height: 0.02 }, { position: 0, height: 0.8 }, { position: 0.5, height: 0.5 }],
  [{ position: 0, height: 0.02 }],
  [{ position: 0, height: 0.8 }]
]) {
  for (const tipClump of [0, 0.12, 0.5]) {
    const lock = {
      geometryType: "strand",
      strandSplitEnabled: true,
      strandSplits: splits,
      strandSplitHeight: 0.4,
      strandSplitPosition: 0,
      baseWidth: 0.2,
      widthScale: 1,
      radialSegments: 6,
      lengthSegments: 6,
      points: Array.from({ length: 4 }, (_, index) => ({ x: 0, y: index * 0.5, z: 0 })),
      pointScales: Array.from({ length: 4 }, () => ({ x: 1, z: 1 })),
      strandSplitBones: Array.from({ length: (splits?.length ?? 1) + 1 }, (_, k) => ({
        name: `split.${k}`, parent: "main", tipClump,
        taperCurve: [{ position: 0, value: 1 }, { position: 1, value: 0.4 }],
        taperCurveSecondary: null, asymmetricWidthCurve: false
      }))
    };
    const curve = new THREE.CatmullRomCurve3(
      lock.points.map((point) => new THREE.Vector3(point.x, point.y, point.z))
    );
    let row;
    try {
      const geometry = geometryApi.createSplitStrandGeometry(lock, curve, profile);
      row = geometry
        ? {
          splits: JSON.stringify(splits),
          tipClump,
          // 全精度写出（不 toFixed）：任何一 bit 变化都必须体现在这份 JSON 里。
          position: Array.from(geometry.getAttribute("position").array),
          uv: Array.from(geometry.getAttribute("uv")?.array ?? []),
          index: Array.from(geometry.getIndex()?.array ?? [])
        }
        : { splits: JSON.stringify(splits), tipClump, geometry: null };
    } catch (error) {
      row = { splits: JSON.stringify(splits), tipClump, error: error.message };
    }
    geometryRows.push(row);
  }
}
out.sites.strandGeometry = geometryRows;

// 直接写文件（不依赖 shell 重定向：sandbox 下 pwsh 的 stdout 重定向不总可用）。
const target = process.argv[2];
const text = JSON.stringify(out, null, 2) + "\n";
if (target) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(target, text, "utf8");
  console.log(`wrote ${target} (${Buffer.byteLength(text, "utf8")} bytes)`);
  console.log(`divergence rows (guard form vs shared form): ${divergence.length}`);
  if (divergence.length) console.log(JSON.stringify(divergence, null, 2));
} else {
  process.stdout.write(text);
}

