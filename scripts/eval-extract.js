// evaluate extractability of candidate subsystems: functions in app.js,
// their body size, referenced global lets, referenced other functions.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const lines = src.split(/\r?\n/);
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "devlog", "FUNCTION_INDEX.json"), "utf8"));
const appFuncs = idx.files.find(f => f.file === "app.js").functions;
const byName = new Map(appFuncs.map(f => [f.name, f]));

const globalLets = [];
for (const l of lines) { const m = l.match(/^let\s+([A-Za-z_$][\w$]*)/); if (m) globalLets.push(m[1]); }
const globalConsts = [];
for (const l of lines) { const m = l.match(/^const\s+([A-Za-z_$][\w$]*)/); if (m) globalConsts.push(m[1]); }
const globalSet = new Set([...globalLets, ...globalConsts]);

// candidate: save/export family
const cand = appFuncs.filter(f => /save|export|FileSystem|fileHandle|writeThrough/i.test(f.name));
console.log("=== save/export family functions ===");
for (const f of cand) {
  // body = from function line to next top-level def (approx)
  const start = f.line - 1;
  const next = appFuncs.filter(g => g.line > f.line).sort((a,b)=>a.line-b.line)[0];
  const end = next ? Math.min(next.line - 1, start + 400) : lines.length;
  const body = lines.slice(start, end).join("\n");
  const usedLets = globalLets.filter(g => new RegExp("\\b" + g + "\\b").test(body));
  const calls = appFuncs.filter(g => g !== f && new RegExp("\\b" + g.name + "\\s*\\(").test(body)).map(g=>g.name);
  console.log(`${f.name} @${f.line} (${end-start} lines) lets[${usedLets.length}]: ${usedLets.join(",") || "-"} calls[${calls.length}]: ${calls.slice(0,8).join(",") || "-"}`);
}
