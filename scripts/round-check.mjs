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
//
// ---------------------------------------------------------------------------
// 默认静默（原话，来自另一仓库的实测结论，照抄进本注释）：
// 「这个检查每轮收尾都要跑，通过时它的输出对主脑毫无信息量，只是白烧上下文。
// 有问题就报，没问题不吭声——退出码是给机器看的，文字是给人看的，通过时没有
// 人需要读任何东西。」
// 因此：默认模式下全部判据通过 ⇒ 标准输出零字节，exit 0；只在失败时打印失败
// 条目。传 --verbose 才恢复完整明细输出。
//
// VACUOUS 空集防护（原话，来自本仓库这一轮的实测教训，照抄进本注释）：
// 「空集比对永远返回"没问题"。校验脚本必须先断言基准集非空。」
// 本仓库这一轮已经四次栽在"判据因错误的原因变绿"上，其中就包括"空输出被
// 误读为干净"。因此每个子命令都先断言自己的基准集非空；基准集为空时报
// VACUOUS，即使在静默模式下也必须打印——"什么都没检查到"不构成通过。
//
// 四态 exit code 约定：
//   0 = 干净（静默）
//   1 = 发现问题（打印问题）
//   2 = VACUOUS，基准集为空，不构成通过（始终打印）
//   3 = 工具自身失败（git 没跑起来、文件读不到、用法错误等），这不是卫生结论
//       （始终打印）
// ---------------------------------------------------------------------------

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
// Result helpers：每个子命令不再直接 console.log，而是把结构化结果收集起来，
// 由 main()/renderResult() 统一决定"到底要不要打印、打印哪些行"。
//   verboseLines  — --verbose 下打印的完整明细（等价于改造前的全部输出）
//   problemLines  — 默认模式下失败(code=1)时才打印的定位信息子集
//   alwaysLines   — VACUOUS(2) / ERROR(3) 的公告，默认模式与 --verbose 下都打印
//   warnLines     — 不改变 exit code 的主动提示（目前只有 hygiene 的体积触发线），
//                   默认模式与 --verbose 下都打印
// ---------------------------------------------------------------------------
function passResult(verboseLines) {
  return { code: 0, ok: true, verboseLines, problemLines: [], alwaysLines: [], warnLines: [] };
}
function failResult(verboseLines, problemLines) {
  return { code: 1, ok: false, verboseLines, problemLines, alwaysLines: [], warnLines: [] };
}
function vacuousResult(message, verboseLines = []) {
  return { code: 2, ok: false, verboseLines, problemLines: [], alwaysLines: [`[VACUOUS] ${message}`], warnLines: [] };
}
function errorResult(message) {
  return { code: 3, ok: false, verboseLines: [], problemLines: [], alwaysLines: [`[ERROR] ${message}`], warnLines: [] };
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
    // 用法错误：连基准集都没法建立，这是工具自身失败，不是卫生结论。
    return errorResult("comment-only: 未提供 <path...>");
  }

  let overallTotalChanged = 0;
  let overallNonComment = 0;
  let overallExportMismatch = false;
  const verboseLines = [];
  const problemLines = [];

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

    verboseLines.push(`--- ${rel} (rev=${rev}) ---`);
    verboseLines.push(`totalChanged=${totalChanged}`);
    if (totalChanged === 0) {
      verboseLines.push(`WARN: diff 为空——无法据此判定"纯注释"，请确认路径/rev 正确`);
    }
    verboseLines.push(`nonComment=${nonComment}`);
    if (nonComment > 0) {
      verboseLines.push("非注释改动行:");
      nonCommentLines.forEach((l) => verboseLines.push("  " + l));
      problemLines.push(`${rel}: 非注释改动 ${nonComment} 行 (rev=${rev})`);
      nonCommentLines.forEach((l) => problemLines.push(`  ${rel}: ${l}`));
    }
    overallTotalChanged += totalChanged;
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

    verboseLines.push(`exports: ${rev}=${headExports.length}, now=${nowExports.length}, identical=${identical}`);
    if (added.length) verboseLines.push(`  added: ${added.join(", ")}`);
    if (removed.length) verboseLines.push(`  removed: ${removed.join(", ")}`);
    if (!identical) {
      overallExportMismatch = true;
      problemLines.push(
        `${rel}: export 集合不一致 (rev=${rev}) added=[${added.join(", ")}] removed=[${removed.join(", ")}]`
      );
    }
  }

  // VACUOUS：基准集（改动行总数）为空——空 diff 恒真地"看起来没问题"，必须先拦截。
  if (overallTotalChanged === 0) {
    return vacuousResult(
      `comment-only: 相对 ${rev} 的 diff 改动行总数为 0（paths=${paths.join(", ")}），无法据此判定"纯注释"`,
      verboseLines
    );
  }

  const fail = overallNonComment > 0 || overallExportMismatch;
  verboseLines.push(
    fail
      ? `[FAIL] comment-only: nonComment=${overallNonComment}, exportMismatch=${overallExportMismatch}`
      : `[PASS] comment-only: 纯注释改动，export 集合未变`
  );
  return fail ? failResult(verboseLines, problemLines) : passResult(verboseLines);
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

function gitTryShow(rev, rel) {
  try {
    execSync(`git show "${rev}:${rel}"`, { cwd: ROOT, encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
}

function cmdExports(args) {
  let rev = "HEAD";
  let revExplicit = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--rev") { rev = args[++i]; revExplicit = true; }
  }

  const changed = gitOrEmpty(`diff --name-only ${rev}`)
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s && (/^modules\/.*\.js$/.test(s) || s === "app.js"));

  // 「零改动」在这里是正常状态，不是 VACUOUS —— 主脑当初的规格写错了，已更正：
  // exports 是一次**扫描**（"这轮有没有新增 export 而漏 bump 缓存号"），干净树上答案就是
  // "没有"，那是合法通过。若把它判成 VACUOUS，收尾命令在正常状态下每次都报非零，
  // 而一个在正常状态下喊狼来了的判据必然被忽略 —— 与"不咬的判据"一样坏。
  // 真正的 VACUOUS 只有一种：调用方**显式**传了 --rev，却取不到任何改动文件
  // ——那多半是 rev 给错了，此时"没发现问题"确实不能当结论。
  if (changed.length === 0) {
    if (revExplicit) {
      return vacuousResult(`exports: 显式指定 --rev ${rev}，但相对它有改动的 .js 文件数为 0（rev 是否给错？）`);
    }
    return passResult([`exports: 相对 ${rev} 无 .js 改动 ⇒ 无新增 export，缓存号无需 bump`]);
  }

  const verboseLines = [];
  const problemLines = [];
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
    verboseLines.push("no new exports; cache bump not required on this ground");
    verboseLines.push("[PASS] exports: 无新增 export");
    return passResult(verboseLines);
  }

  let fail = false;
  for (const mod of modulesWithNewExports) {
    verboseLines.push(`--- module ${mod.file} 新增 export: ${mod.added.join(", ")} ---`);
    const sites = findImportSites(mod.basename);
    if (sites.length === 0) {
      verboseLines.push("  (未找到 import 站点)");
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
      verboseLines.push(
        `  ${site.file}:${site.lineNo}  old=${oldVal === undefined ? "N/A(new)" : oldVal ?? "(none)"} now=${newVal ?? "(none)"}  ${updated ? "updated" : "UNCHANGED"}`
      );
    }
    const uniformNewValue = changedVals.size <= 1;
    const moduleOk = unchanged.length === 0 && uniformNewValue;
    if (!moduleOk) {
      fail = true;
      verboseLines.push(`  [FAIL] ${mod.basename}: 未更新站点数=${unchanged.length}, 新值是否统一=${uniformNewValue}`);
      problemLines.push(
        `${mod.file} 新增 export [${mod.added.join(", ")}]: 未更新站点数=${unchanged.length}, 新值是否统一=${uniformNewValue}`
      );
      if (unchanged.length) {
        verboseLines.push("  未更新站点列表:");
        unchanged.forEach((s) => {
          verboseLines.push(`    ${s.file}:${s.lineNo}`);
          problemLines.push(`  未更新: ${s.file}:${s.lineNo}`);
        });
      }
    } else {
      verboseLines.push(`  [PASS] ${mod.basename}: 全部 import 站点已同步更新到统一新值`);
    }
  }

  verboseLines.push(
    fail
      ? "[FAIL] exports: 存在新增 export 但未同步 bump 缓存号的 import 站点，回访用户可能白屏"
      : "[PASS] exports: 全部新增 export 的模块 import 站点已同步更新"
  );
  return fail ? failResult(verboseLines, problemLines) : passResult(verboseLines);
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
  let appConfig, indexHtml, domContract;
  try {
    appConfig = fs.readFileSync(path.join(ROOT, "modules/core/app-config.js"), "utf8");
    indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    domContract = fs.readFileSync(path.join(ROOT, "tests/dom-contract.test.mjs"), "utf8");
  } catch (e) {
    // 三个源文件本身读不到：工具自身失败，不是卫生结论。
    return errorResult(`version: 读取源文件失败: ${e && e.message ? e.message : e}`);
  }

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

  // VACUOUS：dom-contract.test.mjs 整个文件匹配到 0 行（三类断言合计为 0），说明
  // 该文件读不到有效内容或结构已彻底变样，无法作为基准集，不构成"数量判据 FAIL"。
  if (domAppVersionHits.length === 0 && domAppJsHits.length === 0 && domStylesCssHits.length === 0) {
    return vacuousResult(
      "version: tests/dom-contract.test.mjs 中未匹配到任何冻结断言（APP_VERSION/app.js/styles.css 合计 0 行），基准集为空"
    );
  }

  const verboseLines = [];
  const problemLines = [];

  verboseLines.push(`APP_VERSION (app-config.js): ${appVersion}`);
  verboseLines.push(`index.html styles.css?v=: ${cssV}`);
  verboseLines.push(`index.html app.js?v=: ${appJsV}`);
  verboseLines.push(
    `dom-contract 冻结断言：APP_VERSION ${domAppVersionHits.length} 处 / app.js?v= ${domAppJsHits.length} 处 / styles.css?v= ${domStylesCssHits.length} 处`
  );
  domAppVersionHits.forEach((h) => verboseLines.push(`  [APP_VERSION] L${h.line}: captured=${h.captured}  (${h.text})`));
  domAppJsHits.forEach((h) => verboseLines.push(`  [app.js]       L${h.line}: captured=${h.captured}  (${h.text})`));
  domStylesCssHits.forEach((h) => verboseLines.push(`  [styles.css]   L${h.line}: captured=${h.captured}  (${h.text})`));
  verboseLines.push(
    "注意：modules/** 下各模块自己的 ?v= 缓存号（如 20260730-1 / 20260901-1 / 20260814-12 等）刻意排除在一致性判断之外——" +
      "本仓库规范要求这些缓存号按模块定点刷新，本来就应该与入口 app.js/styles.css 不同，不是本判据的比对对象。"
  );

  // 判据①：数量断言，恰好 1 / 3 / 1，缺一不可（否则"全部相等"在空集上恒真）。
  const countsOk =
    domAppVersionHits.length === 1 && domAppJsHits.length === 3 && domStylesCssHits.length === 1;
  verboseLines.push(
    `[判据①-数量] APP_VERSION=${domAppVersionHits.length}(期望1) app.js=${domAppJsHits.length}(期望3) styles.css=${domStylesCssHits.length}(期望1)  ${countsOk ? "OK" : "FAIL"}`
  );
  if (!countsOk) {
    problemLines.push(
      `判据①-数量 FAIL: APP_VERSION=${domAppVersionHits.length}(期望1) app.js=${domAppJsHits.length}(期望3) styles.css=${domStylesCssHits.length}(期望1)`
    );
  }

  // 判据②：一致性。
  const cssAppMatch = cssV !== null && cssV === appJsV;
  verboseLines.push(`[判据②-index.html 内部一致] styles.css?v=${cssV} vs app.js?v=${appJsV}  ${cssAppMatch ? "OK" : "FAIL"}`);
  if (!cssAppMatch) {
    problemLines.push(`判据②-index.html 内部一致 FAIL: styles.css?v=${cssV} vs app.js?v=${appJsV}`);
  }

  const appVersionMismatches = domAppVersionHits.filter((h) => h.captured !== appVersion);
  const appJsMismatches = domAppJsHits.filter((h) => h.captured !== appJsV);
  const stylesCssMismatches = domStylesCssHits.filter((h) => h.captured !== cssV);
  const consistencyOk =
    appVersionMismatches.length === 0 && appJsMismatches.length === 0 && stylesCssMismatches.length === 0;

  verboseLines.push(
    `[判据②-dom-contract 与源头一致] APP_VERSION 不一致=${appVersionMismatches.length} app.js 不一致=${appJsMismatches.length} styles.css 不一致=${stylesCssMismatches.length}  ${consistencyOk ? "OK" : "FAIL"}`
  );
  appVersionMismatches.forEach((h) => {
    verboseLines.push(`  APP_VERSION 不一致 L${h.line}: captured=${h.captured} expected=${appVersion}`);
    problemLines.push(`tests/dom-contract.test.mjs:${h.line}: APP_VERSION captured=${h.captured} expected=${appVersion}`);
  });
  appJsMismatches.forEach((h) => {
    verboseLines.push(`  app.js 不一致 L${h.line}: captured=${h.captured} expected=${appJsV}`);
    problemLines.push(`tests/dom-contract.test.mjs:${h.line}: app.js?v= captured=${h.captured} expected=${appJsV}`);
  });
  stylesCssMismatches.forEach((h) => {
    verboseLines.push(`  styles.css 不一致 L${h.line}: captured=${h.captured} expected=${cssV}`);
    problemLines.push(`tests/dom-contract.test.mjs:${h.line}: styles.css?v= captured=${h.captured} expected=${cssV}`);
  });

  const ok = countsOk && cssAppMatch && consistencyOk;
  verboseLines.push(
    ok
      ? "[PASS] version: APP_VERSION / index.html / dom-contract 5 条冻结断言数量与取值一致"
      : "[FAIL] version: 数量断言或一致性判据未通过（见上方差异列表）"
  );
  return ok ? passResult(verboseLines) : failResult(verboseLines, problemLines);
}

// ---------------------------------------------------------------------------
// hygiene
// ---------------------------------------------------------------------------
// 残留临时/探针文件扫描：统一基于 `git ls-files --others --exclude-standard`
// 取"未跟踪文件"清单再过滤，而不是像早期实现那样只手工枚举 scripts/tmp-*、
// tests/tmp-*、./tmp-* 几个固定目录。
//
// 实测教训（本轮真实发现的判据缺口）：并行子智能体在仓库**根目录**留下的
// `count-bold.mjs` 不落在 scripts/ 下，旧实现只扫那几个固定目录，完全漏检——
// `hygiene` 会在根目录正躺着一堆探针脚本时仍报"无残留临时文件"，属于典型的
// "判据因错误的原因变绿"。改用 `git ls-files --others` 是因为它天然只返回未跟踪
// 文件：已提交/已跟踪的正常交付物（如本脚本自身 scripts/round-check.mjs、以及
// scripts/check-devlog-debt.mjs）永远不会出现在这份清单里，不需要额外白名单。
//
// 三条规则（对应用户验收要求）：
//   1. 仓库根目录一层（不递归）的未跟踪 *.mjs/*.cjs/*.js —— 本仓库脚本都在
//      scripts/ 下，根目录出现新散装脚本本身就是残留信号。
//   2. 任何位置（含子目录，不限于 scripts/tests/根目录）的未跟踪文件，只要
//      路径任一段以 "tmp-" 开头，或整个相对路径包含 ".MUTANT."。
//   3. 只看未跟踪文件；已跟踪文件天然被排除，不会被误报。
function findResidualUntrackedFiles(untrackedPaths) {
  const hits = [];
  for (const raw of untrackedPaths) {
    const rel = raw.replace(/\\/g, "/").trim();
    if (!rel) continue;
    const segments = rel.split("/");
    const basename = segments[segments.length - 1];
    const isRootLevel = segments.length === 1;
    const isLooseRootScript = isRootLevel && /\.(mjs|cjs|js)$/i.test(basename);
    const hasTmpSegment = segments.some((seg) => seg.startsWith("tmp-"));
    const isMutant = rel.includes(".MUTANT.");
    if (isLooseRootScript || hasTmpSegment || isMutant) hits.push(rel);
  }
  return hits;
}

// in-progress 体积触发线：文件数 > 20 或总 KB > 400 或单文件 > 50KB ⇒ WARN。
// 只是主动提示"到线了"，具体该不该搬/搬哪个由人判断，因此不改变 exit code。
// 目录若不存在（例如正被并行子智能体清空/重命名过程中的一个瞬间状态），跳过，
// 不报错、不 VACUOUS——这条检查本身是可选的体积提示，不是必须存在的基准集。
// 这三个数字是量出来的，不是拍的。第一版取 20 / 400 / 50，而实测 in-progress 的不可压缩
// 地板是 19 份 / 675KB —— 那 19 份被 modules/*.js 与 app.js 的代码注释直接引用（"完整 deps
// 清单在哪查"的活指针），只要引用还在就不能归档。也就是说第一版的线永远满足不了、每轮必报，
// 而永远报警的线等于装饰，会被忽略（同一缺陷本轮已在下方 exports 上犯过一次）。
// 现在把线设在地板之上留余量，让它对增长报警而非对稳态报警。与 check-devlog-debt.mjs 同源，
// 改一处要改两处；若将来代码注释被清掉、地板下降，应把线一起下调。
// 拍错两次的留档：20/400 低于被代码钉住的 19 份/675KB；25/800 仍低于真实稳态 —— 实测当前
// 29 份里 28 份搬不走（12 份既被钉住又有未收口项、7 份仅被钉住、9 份仅有未收口项），
// 稳态是 839.6KB。两次同一个错：拿"理想状态"当地板，而不是拿"今天实际搬不走的量"当地板。
// 第三次调整（0.2.145，与 check-devlog-debt.mjs 同步）：地板真的降了——钉住 15 份
// refactor-map 的 32 处代码注释指针被清掉（27 处纯冗余、5 处已内联），15 份归档进
// devlog/archive/。实测新地板：15 份 / 416KB，单份最大 74.86KB。按同一余量比例拍线：
// 文件数 15→20、总量 416→480KB、单份 75→90KB。
// 现按实测稳态 + 余量。改完必须确认三条当前都不触发，否则它又在报稳态。
const IN_PROGRESS_FILE_COUNT_LIMIT = 20;
const IN_PROGRESS_TOTAL_KB_LIMIT = 480;
const IN_PROGRESS_SINGLE_FILE_KB_LIMIT = 90;

function checkInProgressVolume() {
  const dir = "devlog/in-progress";
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return { warnLines: [] };

  let entries;
  try {
    entries = fs.readdirSync(abs, { withFileTypes: true }).filter((e) => e.isFile());
  } catch {
    return { warnLines: [] };
  }

  const files = entries.map((e) => {
    const p = path.join(abs, e.name);
    let sizeKb = 0;
    try {
      sizeKb = fs.statSync(p).size / 1024;
    } catch {
      sizeKb = 0;
    }
    return { name: e.name, sizeKb };
  });

  const fileCount = files.length;
  const totalKb = files.reduce((sum, f) => sum + f.sizeKb, 0);
  const oversizedSingle = files.some((f) => f.sizeKb > IN_PROGRESS_SINGLE_FILE_KB_LIMIT);

  const triggered =
    fileCount > IN_PROGRESS_FILE_COUNT_LIMIT ||
    totalKb > IN_PROGRESS_TOTAL_KB_LIMIT ||
    oversizedSingle;

  if (!triggered) return { warnLines: [] };

  const warnLines = [];
  warnLines.push(
    `[WARN] hygiene: devlog/in-progress/ 已到体积触发线 —— 文件数=${fileCount}(线${IN_PROGRESS_FILE_COUNT_LIMIT})`
    + ` 总KB=${totalKb.toFixed(1)}(线${IN_PROGRESS_TOTAL_KB_LIMIT})`
    + ` 单文件超${IN_PROGRESS_SINGLE_FILE_KB_LIMIT}KB=${oversizedSingle}`
  );
  const top = files
    .slice()
    .sort((a, b) => b.sizeKb - a.sizeKb)
    .slice(0, 10);
  top.forEach((f) => warnLines.push(`  ${dir}/${f.name}  ${f.sizeKb.toFixed(1)}KB`));
  return { warnLines };
}

function cmdHygiene() {
  let filesListed;
  try {
    filesListed = git("ls-files").split("\n").filter(Boolean);
  } catch (e) {
    return errorResult(`hygiene: git ls-files 失败: ${e && e.message ? e.message : e}`);
  }

  // VACUOUS：git ls-files 返回的受版本控制文件总数为 0（或扫描的文件总数为 0），
  // 说明这不是一个正常仓库工作树，卫生检查在空集上无意义。
  if (filesListed.length === 0) {
    return vacuousResult("hygiene: git ls-files 返回文件总数为 0，基准集为空");
  }

  const verboseLines = [];
  const problemLines = [];

  const status = gitOrEmpty("status --porcelain");
  verboseLines.push("git status --porcelain:");
  verboseLines.push(status ? status.replace(/\n$/, "") : "(空)");

  const untracked = gitOrEmpty("ls-files --others --exclude-standard")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const tmpHits = findResidualUntrackedFiles(untracked);

  const branch = gitOrEmpty("rev-parse --abbrev-ref HEAD").trim();
  const sb = gitOrEmpty("status -sb").split("\n")[0] || "";
  const aheadMatch = sb.match(/ahead (\d+)/);
  const ahead = aheadMatch ? aheadMatch[1] : "0";

  verboseLines.push(`branch: ${branch}`);
  verboseLines.push(`status -sb: ${sb}  (ahead=${ahead})`);

  if (status) {
    verboseLines.push("注意：工作树非空（不计入失败，仅提示）");
  }

  if (tmpHits.length) {
    verboseLines.push(`残留临时文件 (${tmpHits.length} 个):`);
    tmpHits.forEach((h) => verboseLines.push(`  ${h}`));
    tmpHits.forEach((h) => problemLines.push(`残留临时/mutant 文件: ${h}`));
  }

  const fail = tmpHits.length > 0;
  verboseLines.push(
    fail
      ? "[FAIL] hygiene: 存在残留临时/mutant 文件"
      : "[PASS] hygiene: 无残留临时文件"
  );

  const { warnLines } = checkInProgressVolume();
  verboseLines.push(...warnLines);

  const result = fail ? failResult(verboseLines, problemLines) : passResult(verboseLines);
  result.warnLines = warnLines;
  return result;
}

// ---------------------------------------------------------------------------
// dispatcher
// ---------------------------------------------------------------------------
function cmdAll() {
  const results = {
    version: cmdVersion(),
    exports: cmdExports([]),
    hygiene: cmdHygiene(),
  };

  // all 的合成规则：任一子命令 code=3(ERROR) 优先冒泡；否则任一 code=2(VACUOUS)
  // 冒泡；否则任一 code=1(FAIL) 冒泡；否则 0。
  const codes = Object.values(results).map((r) => r.code);
  const code = codes.includes(3) ? 3 : codes.includes(2) ? 2 : codes.includes(1) ? 1 : 0;

  const verboseLines = [];
  const problemLines = [];
  const alwaysLines = [];
  const warnLines = [];
  for (const [name, r] of Object.entries(results)) {
    verboseLines.push(`=== ${name} ===`);
    verboseLines.push(...r.verboseLines);
    verboseLines.push("");
    if (r.problemLines.length) {
      problemLines.push(`--- ${name} ---`);
      problemLines.push(...r.problemLines);
    }
    if (r.alwaysLines.length) {
      alwaysLines.push(`--- ${name} ---`);
      alwaysLines.push(...r.alwaysLines);
    }
    if (r.warnLines && r.warnLines.length) {
      warnLines.push(...r.warnLines);
    }
  }
  const summary = `version:${statusWord(results.version)}  exports:${statusWord(results.exports)}  hygiene:${statusWord(results.hygiene)}`;
  verboseLines.push("=== summary ===");
  verboseLines.push(summary);

  return { code, ok: code === 0, verboseLines, problemLines, alwaysLines, warnLines };
}

function statusWord(r) {
  if (r.code === 3) return "ERROR";
  if (r.code === 2) return "VACUOUS";
  if (r.code === 1) return "FAIL";
  return "PASS";
}

// ---------------------------------------------------------------------------
// 统一渲染：默认模式(problem+always+warn) vs --verbose(verbose+always+warn)
// ---------------------------------------------------------------------------
function renderAndExit(result, verbose) {
  const lines = [];
  if (verbose) {
    lines.push(...result.verboseLines);
  } else if (result.code === 1) {
    lines.push(...result.problemLines);
  }
  // alwaysLines（VACUOUS/ERROR 公告）与 warnLines（体积触发线）无论静默与否都打印。
  lines.push(...result.alwaysLines);
  if (!verbose) lines.push(...result.warnLines);
  const text = lines.filter((l) => l !== undefined).join("\n");
  if (text.length) {
    if (result.code === 0) {
      // 只有 warnLines 时（PASS + WARN）走标准输出即可，不是问题。
      console.log(text);
    } else {
      console.error(text);
    }
  }
  process.exit(result.code);
}

function main() {
  const argv = process.argv.slice(2);
  const verbose = argv.includes("--verbose");
  const rest = argv.filter((a) => a !== "--verbose");
  const [sub, ...tail] = rest;

  let result;
  switch (sub) {
    case "comment-only":
      result = cmdCommentOnly(tail);
      break;
    case "exports":
      result = cmdExports(tail);
      break;
    case "version":
      result = cmdVersion();
      break;
    case "hygiene":
      result = cmdHygiene();
      break;
    case "all":
    case undefined:
      result = cmdAll();
      break;
    default:
      console.error(`未知子命令: ${sub}`);
      process.exit(3);
      return;
  }
  renderAndExit(result, verbose);
}

main();

