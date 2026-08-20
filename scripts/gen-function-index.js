// gen-function-index.js — scan app.js + modules/*.js, emit a machine-readable
// function directory (name / line / kind / exported / call-count) used by agents
// for fast lookup. Run:  node scripts/gen-function-index.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "app.js");
const MODULES = path.join(ROOT, "modules");
const OUT_MD = path.join(ROOT, "devlog", "FUNCTION_INDEX.md");
const OUT_JSON = path.join(ROOT, "devlog", "FUNCTION_INDEX.json");

const fnRe = /^\s*(export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/;
const constArrowRe = /^\s*(export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/;
const constFnRe = /^\s*(export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function\b/;

function scanFile(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const lines = src.split(/\r?\n/);
  const funcs = [];
  const seen = new Set();
  lines.forEach((line, i) => {
    let m, kind = null, exported = false;
    if ((m = line.match(fnRe))) { kind = "function"; exported = !!m[1]; }
    else if ((m = constArrowRe.exec(line))) { kind = "arrow"; exported = !!m[1]; }
    else if ((m = constFnRe.exec(line))) { kind = "const-fn"; exported = !!m[1]; }
    if (!m) return;
    const name = m[2];
    if (seen.has(name)) return; // first definition wins (hoisting/dup guards)
    seen.add(name);
    const calls = (src.match(new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\(", "g")) || []).length;
    funcs.push({ name, line: i + 1, kind, exported, calls });
  });
  return { file: path.relative(ROOT, filePath).replace(/\\/g, "/"), lineCount: lines.length, functions: funcs };
}

function collectJs(dir, out = []) {
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) collectJs(full, out);
    else if (name.endsWith(".js")) out.push(full);
  }
  return out;
}
const files = [];
files.push(scanFile(APP));
for (const full of collectJs(MODULES)) {
  files.push(scanFile(full));
}

const total = files.reduce((n, f) => n + f.functions.length, 0);
function localDate(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
const genDate = localDate(new Date());
const data = {
  generatedAt: new Date().toISOString(),
  totalFunctions: total,
  files,
};

fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2));

// ---- markdown ----
const md = [];
md.push("# 函数索引 / FUNCTION INDEX");
md.push("");
md.push(`> 机器生成（${genDate}），由 \`node scripts/gen-function-index.js\` 产出。共 **${total}** 个函数。`);
md.push("> 用途：agent 先 `Select-String`/`grep` 函数名定位，再跳读对应文件/行号；`calls` 列 = 整个文件内 `name(` 出现次数（hub 指标，越大越核心）。");
md.push("");
for (const f of files) {
  md.push(`## ${f.file}（${f.lineCount} 行）`);
  md.push("");
  md.push("| 函数 | 行号 | 类型 | 导出 | calls |");
  md.push("|---|---|---|---|---|");
  for (const fn of f.functions) {
    md.push(`| \`${fn.name}\` | ${fn.line} | ${fn.kind} | ${fn.exported ? "export" : ""} | ${fn.calls} |`);
  }
  md.push("");
}
fs.writeFileSync(OUT_MD, md.join("\n"));
console.log(`OK: ${total} functions from ${files.length} files -> FUNCTION_INDEX.md + FUNCTION_INDEX.json`);
