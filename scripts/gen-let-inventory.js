// gen-let-inventory.js — inventory of app.js top-level `let` (global mutable state):
// name / defineLine / readRefs / writeRefs / span / keyword bucket.
// Emits devlog/GLOBAL_LET_INVENTORY.md + .json. Run: node scripts/gen-let-inventory.js
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const lines = src.split(/\r?\n/);

const lets = [];
lines.forEach((l, i) => {
  const m = l.match(/^let\s+([A-Za-z_$][\w$]*)/);
  if (m) lets.push({ name: m[1], line: i + 1 });
});

const buckets = [
  ["selection/outliner", /select|isolated|lockIndex|activeTool|outliner|layerColor/i],
  ["scalp", /scalp/i],
  ["sculpt/edit", /sculpt|brush|stroke|transformDragging|proportional|handleEdit|drag|edit/i],
  ["camera/viewport", /camera|viewport|orthographic|turntable|navigation|altOrbit|blenderNavigation/i],
  ["guide/curve", /guide|capsule|curveLattice|lattice|controlPoint/i],
  ["ui/panel", /panel|dock|toolbar|input|dialog|menu|snap|outlinerContext/i],
  ["hair/mesh", /hair|strand|mesh|material|color|uv|geometry/i],
  ["reference", /reference|image/i],
  ["draw/poly", /draw|poly|stroke/i],
  ["save/project", /project|save|export|file|name|preset/i],
  ["branch/sub", /branch|region|root|sweep|twist|bridge/i],
  ["undo/history", /undo|history|restore|snapshot/i],
  ["gizmo/transform", /transform|gizmo|scaleDrag/i],
  ["head/body", /head|body/i],
];

function bucketFor(name) {
  for (const [b, re] of buckets) if (re.test(name)) return b;
  return "(unclassified)";
}

const inv = lets.map(({ name, line }) => {
  const re = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
  let writeRefs = 0, readRefs = 0, lastLine = line;
  lines.forEach((l, i) => {
    if (i + 1 === line) return;
    re.lastIndex = 0;
    if (re.test(l)) {
      // crude: a bare assignment `name =` (or +=,=, etc.) counts as write
      if (new RegExp("\\b" + name + "\\s*(?:\\+=|-=|\\*=|/=|&&=|\\|\\|=|\\?\\?=|=>|[=;])").test(l)) writeRefs++;
      else readRefs++;
      lastLine = i + 1;
    }
  });
  return { name, line, readRefs, writeRefs, refs: readRefs + writeRefs, span: lastLine - line, bucket: bucketFor(name) };
});

inv.sort((a, b) => b.refs - a.refs);
function localDate(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
const genDate = localDate(new Date());
const data = { generatedAt: new Date().toISOString(), total: inv.length, lets: inv };
fs.writeFileSync(path.join(ROOT, "devlog", "GLOBAL_LET_INVENTORY.json"), JSON.stringify(data, null, 2));

// bucket summary
const byBucket = {};
for (const x of inv) (byBucket[x.bucket] ||= []).push(x);
const md = [];
md.push("# 全局状态登记表 / GLOBAL LET INVENTORY");
md.push("");
md.push(`> 机器生成（${genDate}），由 \`node scripts/gen-let-inventory.js\` 产出。共 **${inv.length}** 个顶层 \`let\`（app.js 全局可变状态）。`);
md.push("> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。");
md.push("");
md.push("## 按子系统桶（bucket）汇总");
md.push("");
md.push("| bucket | 数量 | 核心状态（refs 前 5） |");
md.push("|---|---|---|");
for (const [b, arr] of Object.entries(byBucket).sort((a,b2)=>b2[1].length-a[1].length)) {
  const top = arr.slice(0,5).map(x=>`\`${x.name}\`(${x.refs})`).join(" ");
  md.push(`| ${b} | ${arr.length} | ${top} |`);
}
md.push("");
md.push("## 全量清单（按 refs 降序）");
md.push("");
md.push("| let | 定义行 | refs | 读 | 写 | span | bucket |");
md.push("|---|---|---|---|---|---|---|");
for (const x of inv) {
  md.push(`| \`${x.name}\` | ${x.line} | ${x.refs} | ${x.readRefs} | ${x.writeRefs} | ${x.span} | ${x.bucket} |`);
}
fs.writeFileSync(path.join(ROOT, "devlog", "GLOBAL_LET_INVENTORY.md"), md.join("\n"));
console.log(`OK: ${inv.length} lets -> GLOBAL_LET_INVENTORY.md/.json`);
// print top 20
for (const x of inv.slice(0, 20)) console.log(`${x.refs}\t${x.name}\t@${x.line}\t${x.bucket}`);
