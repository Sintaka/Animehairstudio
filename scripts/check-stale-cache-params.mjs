// scripts/check-stale-cache-params.mjs — 校验 import ?v=YYYYMMDD-N 是否过期(按被 import 文件的最后提交日期)。
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ROOT: 优先取 git 仓库根，避免在 worktree / 其他 checkout 副本里跑时误扫主树
// （历史坑：曾据硬编码 ROOT 做 baseline vs HEAD 对比，两边都得 57，误判"无变化"，
// 实为同一次扫描重复了两遍，结论无效）。
const ROOT = (() => {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
  } catch {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  }
})();
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) files.push(p);
  }
})(path.join(ROOT, "modules"));
files.push(path.join(ROOT, "app.js"));
files.push(path.join(ROOT, "index.html"));

const lastMod = (file) => {
  try {
    return execSync(`git log -1 --pretty=%ad --date=format:%Y%m%d -- "${file.replace(/\\/g, "/")}"`, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch { return "00000000"; }
};

const stale = [];
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const re = /(["'])(\.\.?\/[^"']+?\.js)\?v=(\d{8})-\d+\1/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const target = path.resolve(path.dirname(file), m[2]);
    const d = lastMod(target);
    if (d && m[3] < d) {
      stale.push(`${path.relative(ROOT, file)}  ->  ${path.relative(ROOT, target)}  ?v=${m[3]}  (target last-mod ${d})`);
    }
  }
}
if (stale.length) {
  console.log("STALE import cache params:");
  stale.forEach((s) => console.log("  " + s));
} else {
  console.log("no stale import cache params");
}
