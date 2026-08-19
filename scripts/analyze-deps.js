// analyze-deps.js — module import graph + app.js subsystem coupling stats.
// Run: node scripts/analyze-deps.js
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const MOD = path.join(ROOT, "modules");

// ---- 1) module import graph ----
const files = fs.readdirSync(MOD).filter(f => f.endsWith(".js")).sort();
const graph = {};
for (const f of files) {
  const src = fs.readFileSync(path.join(MOD, f), "utf8");
  const deps = new Set();
  for (const m of src.matchAll(/from\s+"\.\/([A-Za-z0-9_-]+\.js)(?:\?v=[^"]*)?"/g)) deps.add(m[1]);
  for (const m of src.matchAll(/import\("\.\/([A-Za-z0-9_-]+\.js)(?:\?v=[^"]*)?"\)/g)) deps.add(m[1]);
  graph[f] = [...deps].sort();
}
console.log("=== module -> imports ===");
for (const f of files) if (graph[f].length) console.log(`${f}: ${graph[f].join(", ")}`);

// ---- 2) app.js: subsystem regions (from earlier knowledge) + global-state use ----
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const lines = appSrc.split(/\r?\n/);
// collect top-level let names (global mutable state)
const globalLets = [];
for (const l of lines) {
  const m = l.match(/^let\s+([A-Za-z_$][\w$]*)/);
  if (m) globalLets.push(m[1]);
}
console.log(`\n=== global let count: ${globalLets.length} ===`);

// candidate subsystems: name -> [keyword regexes used to find function regions]
const subsystems = {
  "sub-bridge": [/buildBranchBridgeGeometry|createBranchChildGeometry|applyBranchRootRegionCarving|branchRootRegion|holeBoundary|squareChildRing/],
  "sub-rootbone": [/captureBranchLocalState|pointerHitsTransformGizmo|transformDragging|branchGizmo|strandControlPointFrame/],
  "sub-saveexport": [/saveHairProject|exportHairProject|exportAnimeHair|writeExportThroughFileSystem|quickExportFileHandle/],
  "sub-sculpt": [/sculptBrush|beginSculptMoveStroke|applySculptMoveStrokeSample|sculptMoveStroke/],
  "sub-camera": [/OrbitControls|updateCameraProjectionForViewport|orthographicView|turntable/],
  "sub-scalp": [/scalp[A-Z]|createAuthoredScalpGeometry|scalpQuadEdges/],
  "sub-panel": [/createPanelStrandGeometry|panelSplits|isPanelGeometry/],
  "sub-split": [/createSplitStrandGeometry|splitFusedGrid|splitOpening/],
};

for (const [name, res] of Object.entries(subsystems)) {
  const regions = [];
  lines.forEach((l, i) => { for (const re of res) if (re.test(l)) regions.push(i + 1); });
  if (!regions.length) { console.log(`${name}: no anchor lines`); continue; }
  const span = regions[regions.length - 1] - regions[0];
  console.log(`${name}: ${regions.length} anchors, first=${regions[0]} last=${regions[regions.length-1]} span=${span} lines`);
}
