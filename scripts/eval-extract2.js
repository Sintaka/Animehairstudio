const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const lines = src.split(/\r?\n/);
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "devlog", "FUNCTION_INDEX.json"), "utf8"));
const appFuncs = idx.files.find(f => f.file === "app.js").functions;
const byLine = [...appFuncs].sort((a,b)=>a.line-b.line);
const globalLets = []; for (const l of lines) { const m = l.match(/^let\s+([A-Za-z_$][\w$]*)/); if (m) globalLets.push(m[1]); }
const globalConsts = []; for (const l of lines) { const m = l.match(/^const\s+([A-Za-z_$][\w$]*)/); if (m) globalConsts.push(m[1]); }

function profile(name) {
  const f = appFuncs.find(g => g.name === name);
  if (!f) return console.log(`${name}: NOT FOUND`);
  const i = byLine.findIndex(g => g.name === name);
  const next = byLine[i + 1];
  const end = next ? Math.min(next.line - 1, f.line + 600) : lines.length;
  const body = lines.slice(f.line - 1, end).join("\n");
  const usedLets = globalLets.filter(g => new RegExp("\\b" + g + "\\b").test(body));
  const calls = appFuncs.filter(g => g !== f && new RegExp("\\b" + g.name + "\\s*\\(").test(body)).map(g=>g.name);
  console.log(`${name} @${f.line} (${end-(f.line-1)} lines) lets[${usedLets.length}]: ${usedLets.join(",") || "-"}`);
  console.log(`  calls[${calls.length}]: ${calls.join(", ")}`);
}
["buildHairProjectFile", "buildHairObj", "buildHairUsda", "openFileActionDialog", "downloadTextFile", "setProjectSaveButtonsDisabled"].forEach(profile);
