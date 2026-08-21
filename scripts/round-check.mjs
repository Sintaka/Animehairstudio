#!/usr/bin/env node
// scripts/round-check.mjs
//
// 目的：把主进程每轮手工重复做的机械核对固化成脚本，避免两类风险：
// 「假绿」（判据从未被真正证伪过一次，看似能用实则从未测出过问题）与
// 「假红」（判据本身与仓库实际结构冲突，导致永久误报，等同狼来了）。
//
// 各子命令对应的真实故障：
// - comment-only：核实"声称的纯注释改动"是否真的不影响可执行语义（export 集合不变、
//   无非注释增删行）。故障对应：把带真实代码改动的 commit 误标"仅注释"，绕过了应有的回归测试。
// - exports：新增 export 的模块，若其全部 import 站点的 ?v= 缓存号没有同步刷新，回访用户的
//   浏览器会用缓存的旧模块版本去解析新增的 named export —— ESM 是链接期解析，直接抛
//   SyntaxError，整个应用白屏。这是唯一真正会让用户打不开应用的缓存问题（其余"旧文件 import
//   旧依赖"的组合是自洽的，只是浏览器多留一份旧模块，不会崩）。
// - hygiene：合并前工作树里残留的探针/临时文件如果被误合并进主干，会污染仓库（脏树）。
// - version：APP_VERSION / index.html 缓存号 / dom-contract 冻结断言三处如果互相脱节，
//   说明某次 bump 只改了一部分，容易造成"看似已发布新版本，测试却锁死旧号"的假绿。
//
// ROOT 从 git 仓库根或脚本自身位置推导，绝不硬编码绝对路径（历史教训见
// scripts/check-stale-cache-params.mjs 的硬编码 ROOT 坑）。

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function findRoot() {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
  } catch {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  }
}
const ROOT = findRoot();

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf8" });
}
function gitOrEmpty(cmd) {
  try {
    return git(cmd);
  } catch {
    return "";
  }
}

const EXPORT_RE = /^export (?:function|const|class|let)\s+([A-Za-z0-9_]+)/gm;
function extractExports(source) {
  const out = [];
  let m;
  EXPORT_RE.lastIndex = 0;
  while ((m = EXPORT_RE.exec(source)) !== null) out.push(m[1]);
  return out;
}

// ---------------------------------------------------------------------------
// comment-only [--rev <rev>] <path...>
// ---------------------------------------------------------------------------
function cmdCommentOnly(args) {
  let rev = "HEAD";
  const paths = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--rev") rev = args[++i];
    else paths.push(args[i]);
  }
  if (paths.length === 0) {
    console.log("[FAIL] comment-only: 未提供 <path...>");
    return false;
  }

  let overallNonComment = 0;
  let overallExportMismatch = false;

  for (const rawPath of paths) {
    const rel = rawPath.replace(/\\/g, "/");
    const diff = gitOrEmpty(`diff -U0 ${rev} -- "${rel}"`);
    const lines = diff.length ? diff.split("\n") : [];

    let totalChanged = 0;
    let nonComment = 0;
    const nonCommentLines = [];
    for (const line of lines) {
      if (/^\+\+\+/.test(line) || /^---/.test(line)) continue;
      if (!/^[+-]/.test(line)) continue;
      totalChanged++;
      const content = line.slice(1).trim();
      if (content === "") continue;
      if (content.startsWith("//")) continue;
      nonComment++;
      nonCommentLines.push(line);
    }

    console.log(`--- ${rel} (rev=${rev}) ---`);
    console.log(`totalChanged=${totalChanged}`);
    if (totalChanged === 0) {
      console.log(`WARN: diff 为空——无法据此判定"纯注释"，请确认路径/rev 正确`);
    }
    console.log(`nonComment=${nonComment}`);
    if (nonComment > 0) {
      console.log("非注释改动行:");
      nonCommentLines.forEach((l) => console.log("  " + l));
    }
    overallNonComment += nonComment;

    const headContent = gitOrEmpty(`show "${rev}:${rel}"`);
    let nowContent = "";
    try {
      nowContent = fs.readFileSync(path.join(ROOT, rel), "utf8");
    } catch {
      nowContent = "";
    }
    const headExports = extractExports(headContent).sort();
    const nowExports = extractExports(nowContent).sort();
    const identical = JSON.stringify(headExports) === JSON.stringify(nowExports);
    const added = nowExports.filter((x) => !headExports.includes(x));
    const removed = headExports.filter((x) => !nowExports.includes(x));

    console.log(`exports: ${rev}=${headExports.length}, now=${nowExports.length}, identical=${identical}`);
    if (added.length) console.log(`  added: ${added.join(", ")}`);
    if (removed.length) console.log(`  removed: ${removed.join(", ")}`);
    if (!identical) overallExportMismatch = true;
  }

  const fail = overallNonComment > 0 || overallExportMismatch;
  console.log(
    fail
      ? `[FAIL] comment-only: nonComment=${overallNonComment}, exportMismatch=${overallExportMismatch}`
      : `[PASS] comment-only: 纯注释改动，export 集合未变`
  );
  return !fail;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// exports [--rev <rev>]
// ---------------------------------------------------------------------------
function gitGrepLiteral(literal, globs) {
  const globArgs = globs.map((g) => `"${g}"`).join(" ");
  try {
    // 仓库内文件混用 CRLF/LF；统一去掉行尾 \r，否则 "$" 锁定的正则在 CRLF 行上永远不命中
    // （曾据此漏检 curve-math.js 15 处 import 站点里的 14 处，只剩 1 处 LF 文件被找到）。
    const raw = execSync(`git grep -n -I -F -- "${literal}" ${globArgs}`, { cwd: ROOT, encoding: "utf8" });
    return raw.replace(/\r\n/g, "\n");
  } catch {
    return ""; // git grep exits 1 when no match found
  }
}

function findImportSites(moduleBasename) {
  const raw = gitGrepLiteral(moduleBasename, ["*.js", "*.mjs", "*.html"]);
  if (!raw) return [];
  const importLineRe = new RegExp(
    `from\\s+["']([^"']*${escapeRegExp(moduleBasename)})(\\?v=(\\d{8}-\\d+))?["']`
  );
  const sites = [];
  for (const line of raw.split("\n")) {
    if (!line) continue;
    const m = line.match(/^([^:]+):(\d+):(.*)$/);
    if (!m) continue;
    const [, file, lineNo, content] = m;
    const im = content.match(importLineRe);
    if (!im) continue;
    sites.push({ file, lineNo, currentVal: im[3] || null });
  }
  return sites;
}

function extractModuleVersionFromContent(content, moduleBasename) {
  const re = new RegExp(
    `from\\s+["']([^"']*${escapeRegExp(moduleBasename)})(\\?v=(\\d{8}-\\d+))?["']`
  );
  const m = content.match(re);
  return m ? m[3] || null : undefined; // undefined = no import found at all
}

function cmdExports(args) {
  let rev = "HEAD";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--rev") rev = args[++i];
  }

  const changed = gitOrEmpty(`diff --name-only ${rev}`)
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s && (/^modules\/.*\.js$/.test(s) || s === "app.js"));

  const modulesWithNewExports = [];
  for (const rel of changed) {
    const headContent = gitOrEmpty(`show "${rev}:${rel}"`);
    let nowContent = "";
    try {
      nowContent = fs.readFileSync(path.join(ROOT, rel), "utf8");
    } catch {
      continue; // file deleted
    }
    const headExports = extractExports(headContent);
    const nowExports = extractExports(nowContent);
    const added = nowExports.filter((x) => !headExports.includes(x));
    if (added.length) {
      modulesWithNewExports.push({ file: rel, basename: path.basename(rel), added });
    }
  }

  if (modulesWithNewExports.length === 0) {
    console.log("no new exports; cache bump not required on this ground");
    console.log("[PASS] exports: 无新增 export");
    return true;
  }

  let fail = false;
  for (const mod of modulesWithNewExports) {
    console.log(`--- module ${mod.file} 新增 export: ${mod.added.join(", ")} ---`);
    const sites = findImportSites(mod.basename);
    if (sites.length === 0) {
      console.log("  (未找到 import 站点)");
      continue;
    }
    const unchanged = [];
    const changedVals = new Set();
    for (const site of sites) {
      const oldContent = gitOrEmpty(`show "${rev}:${site.file}"`);
      const fileIsNewAtRev = oldContent === "" && !gitTryShow(rev, site.file);
      const oldVal = fileIsNewAtRev ? undefined : extractModuleVersionFromContent(oldContent, mod.basename);
      const newVal = site.currentVal;
      const updated = oldVal === undefined ? true : oldVal !== newVal;
      if (!updated) unchanged.push(site);
      else changedVals.add(newVal);
      console.log(
        `  ${site.file}:${site.lineNo}  old=${oldVal === undefined ? "N/A(new)" : oldVal ?? "(none)"} now=${newVal ?? "(none)"}  ${updated ? "updated" : "UNCHANGED"}`
      );
    }
    const uniformNewValue = changedVals.size <= 1;
    const moduleOk = unchanged.length === 0 && uniformNewValue;
    if (!moduleOk) {
      fail = true;
      console.log(`  [FAIL] ${mod.basename}: 未更新站点数=${unchanged.length}, 新值是否统一=${uniformNewValue}`);
      if (unchanged.length) {
        console.log("  未更新站点列表:");
        unchanged.forEach((s) => console.log(`    ${s.file}:${s.lineNo}`));
      }
    } else {
      console.log(`  [PASS] ${mod.basename}: 全部 import 站点已同步更新到统一新值`);
    }
  }

  console.log(
    fail
      ? "[FAIL] exports: 存在新增 export 但未同步 bump 缓存号的 import 站点，回访用户可能白屏"
      : "[PASS] exports: 全部新增 export 的模块 import 站点已同步更新"
  );
  return !fail;
}

function gitTryShow(rev, rel) {
  try {
    execSync(`git show "${rev}:${rel}"`, { cwd: ROOT, encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// version
// ---------------------------------------------------------------------------
// 冻结断言只有 5 条（规范原文）：APP_VERSION 1 条 + app.js 缓存号 3 条 + styles.css
// 缓存号 1 条。tests/dom-contract.test.mjs 里这些断言本身是"正则字面量文本"，即
// 源码里写的是 /app\.js\?v=.../，文件内容里 `.` 前有真实的反斜杠字符——所以用来
// 扫描该文件的正则必须匹配那个字面反斜杠，否则会一条都扫不到（同时又会平凡通过
// "全部相等"检查，因为空集恒真——这正是判据①要单独断言计数的原因）。
function findLinesInText(text, re) {
  const hits = [];
  text.split("\n").forEach((line, idx) => {
    const trimmed = line.trim();
    // 跳过整行被注释掉的断言（trim 后以 // 开头）——commenting-out 是让一条冻结
    // 断言"消失"的常见手法，字面量文本仍在，但它已不再被 node 的测试运行器执行。
    // 若不跳过，计数判据①会对"断言被注释掉"这种真实回归视而不见（naive 子串扫描
    // 会把注释里的正则字面量文本也当活跃断言算进去）。
    if (trimmed.startsWith("//")) return;
    const lineRe = new RegExp(re.source, "g");
    let m;
    while ((m = lineRe.exec(line)) !== null) {
      hits.push({ line: idx + 1, text: trimmed, captured: m[1] });
    }
  });
  return hits;
}

function cmdVersion() {
  const appConfig = fs.readFileSync(path.join(ROOT, "modules/core/app-config.js"), "utf8");
  const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const domContract = fs.readFileSync(path.join(ROOT, "tests/dom-contract.test.mjs"), "utf8");

  const appVersionMatch = appConfig.match(/APP_VERSION\s*=\s*["']([^"']+)["']/);
  const appVersion = appVersionMatch ? appVersionMatch[1] : null;

  const cssMatch = indexHtml.match(/styles\.css\?v=([\w.-]+)/);
  const appJsMatch = indexHtml.match(/app\.js\?v=([\w.-]+)/);
  const cssV = cssMatch ? cssMatch[1] : null;
  const appJsV = appJsMatch ? appJsMatch[1] : null;

  // dom-contract 里的三类冻结断言：正则字面量文本，`.`/`?` 前带真实反斜杠。
  // 被扫描的目标文本是"正则字面量的源码"，其中的 `\.` 只是对字面量里 `.` 字符的
  // 常规转义，与真实版本号/缓存号本身无关——比较前要把这层转义还原掉，否则
  // 会把 "0\.1\.5-..." 误判成与 "0.1.5-..." 不一致。
  const unescapeDots = (s) => (s == null ? s : s.replace(/\\\./g, "."));

  const domAppVersionHits = findLinesInText(
    domContract,
    /APP_VERSION\\s\*=\\s\*\["'\]([^"']+)\["'\]/
  ).map((h) => ({ ...h, captured: unescapeDots(h.captured) }));
  const domAppJsHits = findLinesInText(domContract, /app\\\.js\\\?v=([\w-]+)/);
  const domStylesCssHits = findLinesInText(domContract, /styles\\\.css\\\?v=([\w-]+)/);

  console.log(`APP_VERSION (app-config.js): ${appVersion}`);
  console.log(`index.html styles.css?v=: ${cssV}`);
  console.log(`index.html app.js?v=: ${appJsV}`);
  console.log(
    `dom-contract 冻结断言：APP_VERSION ${domAppVersionHits.length} 处 / app.js?v= ${domAppJsHits.length} 处 / styles.css?v= ${domStylesCssHits.length} 处`
  );
  domAppVersionHits.forEach((h) => console.log(`  [APP_VERSION] L${h.line}: captured=${h.captured}  (${h.text})`));
  domAppJsHits.forEach((h) => console.log(`  [app.js]       L${h.line}: captured=${h.captured}  (${h.text})`));
  domStylesCssHits.forEach((h) => console.log(`  [styles.css]   L${h.line}: captured=${h.captured}  (${h.text})`));
  console.log(
    "注意：modules/** 下各模块自己的 ?v= 缓存号（如 20260730-1 / 20260901-1 / 20260814-12 等）刻意排除在一致性判断之外——" +
      "本仓库规范要求这些缓存号按模块定点刷新，本来就应该与入口 app.js/styles.css 不同，不是本判据的比对对象。"
  );

  // 判据①：数量断言，恰好 1 / 3 / 1，缺一不可（否则"全部相等"在空集上恒真）。
  const countsOk =
    domAppVersionHits.length === 1 && domAppJsHits.length === 3 && domStylesCssHits.length === 1;
  console.log(
    `[判据①-数量] APP_VERSION=${domAppVersionHits.length}(期望1) app.js=${domAppJsHits.length}(期望3) styles.css=${domStylesCssHits.length}(期望1)  ${countsOk ? "OK" : "FAIL"}`
  );

  // 判据②：一致性。
  const cssAppMatch = cssV !== null && cssV === appJsV;
  console.log(`[判据②-index.html 内部一致] styles.css?v=${cssV} vs app.js?v=${appJsV}  ${cssAppMatch ? "OK" : "FAIL"}`);

  const appVersionMismatches = domAppVersionHits.filter((h) => h.captured !== appVersion);
  const appJsMismatches = domAppJsHits.filter((h) => h.captured !== appJsV);
  const stylesCssMismatches = domStylesCssHits.filter((h) => h.captured !== cssV);
  const consistencyOk =
    appVersionMismatches.length === 0 && appJsMismatches.length === 0 && stylesCssMismatches.length === 0;

  console.log(
    `[判据②-dom-contract 与源头一致] APP_VERSION 不一致=${appVersionMismatches.length} app.js 不一致=${appJsMismatches.length} styles.css 不一致=${stylesCssMismatches.length}  ${consistencyOk ? "OK" : "FAIL"}`
  );
  appVersionMismatches.forEach((h) => console.log(`  APP_VERSION 不一致 L${h.line}: captured=${h.captured} expected=${appVersion}`));
  appJsMismatches.forEach((h) => console.log(`  app.js 不一致 L${h.line}: captured=${h.captured} expected=${appJsV}`));
  stylesCssMismatches.forEach((h) => console.log(`  styles.css 不一致 L${h.line}: captured=${h.captured} expected=${cssV}`));

  const ok = countsOk && cssAppMatch && consistencyOk;
  console.log(
    ok
      ? "[PASS] version: APP_VERSION / index.html / dom-contract 5 条冻结断言数量与取值一致"
      : "[FAIL] version: 数量断言或一致性判据未通过（见上方差异列表）"
  );
  return ok;
}

// ---------------------------------------------------------------------------
// hygiene
// ---------------------------------------------------------------------------
function listDirTmp(dir, prefix) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.name.startsWith(prefix))
    .map((e) => path.join(dir, e.name).replace(/\\/g, "/"));
}

function findMutantPaths() {
  const hits = [];
  (function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      const p = path.join(dir, e.name);
      if (p.includes(".MUTANT.")) hits.push(path.relative(ROOT, p).replace(/\\/g, "/"));
      if (e.isDirectory()) walk(p);
    }
  })(ROOT);
  return hits;
}

function cmdHygiene() {
  const status = gitOrEmpty("status --porcelain");
  console.log("git status --porcelain:");
  console.log(status ? status.replace(/\n$/, "") : "(空)");

  const tmpHits = [
    ...listDirTmp("scripts", "tmp-"),
    ...listDirTmp("tests", "tmp-"),
    ...listDirTmp(".", "tmp-"),
    ...findMutantPaths(),
  ];

  const branch = gitOrEmpty("rev-parse --abbrev-ref HEAD").trim();
  const sb = gitOrEmpty("status -sb").split("\n")[0] || "";
  const aheadMatch = sb.match(/ahead (\d+)/);
  const ahead = aheadMatch ? aheadMatch[1] : "0";

  console.log(`branch: ${branch}`);
  console.log(`status -sb: ${sb}  (ahead=${ahead})`);

  if (status) {
    console.log("注意：工作树非空（不计入失败，仅提示）");
  }

  if (tmpHits.length) {
    console.log(`残留临时文件 (${tmpHits.length} 个):`);
    tmpHits.forEach((h) => console.log(`  ${h}`));
  }

  const fail = tmpHits.length > 0;
  console.log(
    fail
      ? "[FAIL] hygiene: 存在残留临时/mutant 文件"
      : "[PASS] hygiene: 无残留临时文件"
  );
  return !fail;
}

// ---------------------------------------------------------------------------
// dispatcher
// ---------------------------------------------------------------------------
function cmdAll() {
  console.log("=== version ===");
  const v = cmdVersion();
  console.log("\n=== exports ===");
  const e = cmdExports([]);
  console.log("\n=== hygiene ===");
  const h = cmdHygiene();
  console.log("\n=== summary ===");
  console.log(`version:${v ? "PASS" : "FAIL"}  exports:${e ? "PASS" : "FAIL"}  hygiene:${h ? "PASS" : "FAIL"}`);
  const ok = v && e && h;
  console.log(ok ? "[PASS] all" : "[FAIL] all");
  return ok;
}

function main() {
  const [, , sub, ...rest] = process.argv;
  let ok;
  switch (sub) {
    case "comment-only":
      ok = cmdCommentOnly(rest);
      break;
    case "exports":
      ok = cmdExports(rest);
      break;
    case "version":
      ok = cmdVersion();
      break;
    case "hygiene":
      ok = cmdHygiene();
      break;
    case "all":
    case undefined:
      ok = cmdAll();
      break;
    default:
      console.error(`未知子命令: ${sub}`);
      process.exit(2);
  }
  process.exit(ok ? 0 : 1);
}

main();

