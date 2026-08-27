// check-esm-syntax.mjs -- 把运行时 JS 当 ES module 检查语法。静默通过，有问题 exit 1。
// 为什么不能直接 node --check app.js：app.js 与 modules 下都是 ESM（顶层 import），
// 但 package.json 无 type 字段，node 按 CommonJS 解析 .js，会漏掉真实语法错误。
// 实测同一份文件（含一行裸省略标记）：当 .js 检查 exit 0，复制成 .mjs 检查 exit 1。
// 0.2.162 就是这样把语法错误提交进仓库，直到用户刷新时白屏才发现。
import { execSync } from "node:child_process";
import { copyFileSync, unlinkSync } from "node:fs";

const TMP = "/tmp/ahs-esm-check.mjs";

const files = execSync("git ls-files 'app.js' 'modules/**/*.js'", { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\n").map((s) => s.trim()).filter(Boolean);

const offenders = [];

for (const file of files) {
  copyFileSync(file, TMP);
  try {
    execSync(`node --check ${TMP}`, { stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    const msg = String(err.stderr || err.message).split("\n").slice(0, 4).join(" ").trim();
    offenders.push({ file, msg });
  }
}
try { unlinkSync(TMP); } catch { /* 已不存在则忽略 */ }

if (!offenders.length) process.exit(0);
console.error("ESM syntax check failed:");
for (const o of offenders) console.error(`  ${o.file}\n    ${o.msg}`);
process.exit(1);
