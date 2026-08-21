// scripts/check-devlog-debt.mjs — devlog 结构性负债扫描（体积 + 归档信号 + 加粗密度）。
//
// 为什么需要它：主脑的复盘机制只数「机械劳动次数」，感知不到「文档体积」这类结构性负债，
// 于是 devlog/in-progress/ 一路长到 904KB 而每轮复盘都"通过"。大文档不只占 token ——
// 它还会诱导主脑打开后顺着旧清单偏题。这个脚本把「到线了」变成机械提示，不依赖主脑记得去想。
//
// 退出码约定（与 round-check.mjs 一致）：
//   0 = 未触线（静默，除 --verbose）
//   1 = 触线（打印超线项）
//   2 = VACUOUS：扫不到任何 .md，基准集为空，不构成通过（始终打印）
//   3 = 工具自身失败（读不到目录等），不是负债结论
//
// 判据不是"这份文档还有必要吗"（那是判断题，主脑也答不好），而是三条机械线：
//   ① 体积线：in-progress 文件数 / 总 KB / 单文件 KB
//   ② 归档信号：文件自己写了状态注记（已完成/已实施/已取代/已废弃）且无未完成残留
//   ③ 加粗密度：入口链文档的 **加粗** 每行密度（加粗过密时它不再表示强调，只是多花 token）
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");

const IN_PROGRESS = "devlog/in-progress";
const ARCHIVE = "devlog/archive";
// 机器生成、可随时重跑重建的文件不算负债（体积不代表阅读成本，它们不该被人读）。
const REGENERABLE = new Set(["devlog/FUNCTION_INDEX.md"]);
const ENTRY_CHAIN = [
  "devlog/AGENT_QUICKSTART.md",
  "devlog/development-standards.md",
  "devlog/README.md",
  "devlog/APPJS_SPLIT_GUIDE.md",
  "devlog/agent-retrospective.md",
  "devlog/SUBAGENT_BRIEF.md"
];

// 阈值。改这里就改了判据，不要散落在别处。
const MAX_FILES = 20;
const MAX_TOTAL_KB = 400;
const MAX_SINGLE_KB = 50;
const MAX_BOLD_PER_LINE = 0.35;

const kbOf = (p) => Math.round(fs.statSync(p).size / 1024);
const boldPairs = (t) => (t.match(/\*\*[^*\n]+\*\*/g) || []).length;

// 归档信号：文件自称完成，且没有未完成残留。两者都要 —— 只看前者会误搬活文档。
const DONE_RE = /已实施|已完成|已收口|已落地|已取代|已废弃|方案已取消/;
// OPEN_RE 的词表是从本仓库真实文档里 grep 出来的，不是我凭印象列的。
// 第一版漏了「仍未解 / 先不做 / 待用户 / 先不管 / 未勾选的 - [ ]」这几种本仓库最常用的说法，
// 于是把 scalp-conform-bend-v4-plan.md（D10/D11 正等用户裁决的活文档）判成了可归档；
// 当时唯一救下它的是"路线图"二字 —— 判对纯属碰巧。归档误判会让后续 agent 找不到活文档，
// 所以这条只能宽、不能窄：任何一个疑似未完成的信号都足以否掉归档。
const OPEN_RE = /未做|待办|待定|待裁决|待用户|待验证|待确认|尚未|仍未解|先不做|先不管|先留着|路线图|Phase\s*2|TODO|-\s*\[\s*\]/i;

const findings = { oversize: [], archivable: [], dense: [], bulky: [] };
let scanned = 0;

try {
  if (fs.existsSync(IN_PROGRESS)) {
    const files = fs.readdirSync(IN_PROGRESS).filter((f) => f.endsWith(".md"));
    scanned += files.length;
    let totalKb = 0;
    for (const f of files) {
      const p = path.join(IN_PROGRESS, f).replace(/\\/g, "/");
      const kb = kbOf(p);
      totalKb += kb;
      const full = fs.readFileSync(p, "utf8");
      if (kb > MAX_SINGLE_KB) findings.oversize.push({ p, kb });
      // 「自称完成」只看开头（状态注记按惯例写在头部），但「未完成残留」必须扫全文 ——
      // 第一版两者都只扫前 6000 字，而真实的未完成标记往往写在文档中后段的裁决小节里。
      if (DONE_RE.test(full.slice(0, 6000)) && !OPEN_RE.test(full)) findings.archivable.push({ p, kb });
    }
    if (files.length > MAX_FILES) {
      findings.oversize.unshift({ p: `${IN_PROGRESS}/ 文件数 ${files.length}`, kb: 0, note: `> ${MAX_FILES}` });
    }
    if (totalKb > MAX_TOTAL_KB) {
      findings.oversize.unshift({ p: `${IN_PROGRESS}/ 总体积 ${totalKb}KB`, kb: 0, note: `> ${MAX_TOTAL_KB}KB` });
    }
  }

  // devlog 根下那些既不在 in-progress、也不在入口链里的文件 —— 第一版完全没扫，
  // 实测那是 728KB / 23 份、占 devlog 体积 40%（含最大的 local-adaptation-log 150KB、
  // js-change-annotations 116KB）。扫描器报"10 项触线"却对最大的一块视而不见，
  // 那是我自己工具的盲区，不是这些文件的问题。它们多是「事后记录」，本不该开工时读，
  // 所以只按体积报、不判归档（归档信号对追加式日志没有意义：它永远既有完成也有未完成）。
  if (fs.existsSync("devlog")) {
    for (const f of fs.readdirSync("devlog").filter((n) => n.endsWith(".md"))) {
      const p = `devlog/${f}`;
      if (ENTRY_CHAIN.includes(p) || REGENERABLE.has(p)) continue;
      scanned += 1;
      const kb = kbOf(p);
      if (kb > MAX_SINGLE_KB) findings.bulky.push({ p, kb });
    }
  }

  for (const p of ENTRY_CHAIN) {
    if (!fs.existsSync(p)) continue;
    scanned += 1;
    const t = fs.readFileSync(p, "utf8");
    const lines = t.split(/\r?\n/).length;
    const b = boldPairs(t);
    const perLine = b / Math.max(lines, 1);
    if (perLine > MAX_BOLD_PER_LINE) {
      findings.dense.push({ p, bold: b, lines, perLine: perLine.toFixed(2) });
    }
  }
} catch (err) {
  console.log(`[ERROR] devlog-debt 扫描失败：${err.message}`);
  console.log("这不是负债结论——工具自身没跑起来。");
  process.exit(3);
}

// 空集防护：扫不到任何 .md 时不能报"通过"。本仓库四次栽在"空输出被当成干净"。
if (scanned === 0) {
  console.log("[VACUOUS] devlog-debt: 未扫到任何 .md（基准集为空），不构成通过。");
  console.log(`  检查路径是否正确：${IN_PROGRESS}/ 与入口链 ${ENTRY_CHAIN.length} 份`);
  process.exit(2);
}

const hit = findings.oversize.length + findings.archivable.length
  + findings.dense.length + findings.bulky.length;

if (hit === 0) {
  if (verbose) console.log(`[PASS] devlog-debt: 扫描 ${scanned} 份 .md，四条线均未触及。`);
  process.exit(0);
}

console.log(`[WARN] devlog-debt: 扫描 ${scanned} 份 .md，${hit} 项触线。`);
if (findings.oversize.length) {
  console.log("\n① 体积线：");
  for (const f of findings.oversize.sort((a, b) => b.kb - a.kb).slice(0, 12)) {
    console.log(`   ${f.note ? f.p + "  " + f.note : String(f.kb).padStart(4) + "KB  " + f.p + `  > ${MAX_SINGLE_KB}KB`}`);
  }
}
if (findings.archivable.length) {
  console.log(`\n② 归档信号（文件自称完成且无未完成残留 ⇒ 可 git mv 进 ${ARCHIVE}/）：`);
  for (const f of findings.archivable.sort((a, b) => b.kb - a.kb)) {
    console.log(`   ${String(f.kb).padStart(4)}KB  ${f.p}`);
  }
}
if (findings.dense.length) {
  console.log(`\n③ 加粗密度（入口链，> ${MAX_BOLD_PER_LINE}/行）：`);
  for (const f of findings.dense.sort((a, b) => b.perLine - a.perLine)) {
    console.log(`   ${f.perLine}/行  ${String(f.bold).padStart(4)} 对 / ${f.lines} 行  ${f.p}`);
  }
}
if (findings.bulky.length) {
  console.log(`\n④ devlog 根下的大文件（既不在 in-progress 也不在入口链，> ${MAX_SINGLE_KB}KB）：`);
  for (const f of findings.bulky.sort((a, b) => b.kb - a.kb).slice(0, 12)) {
    console.log(`   ${String(f.kb).padStart(4)}KB  ${f.p}`);
  }
  console.log("   这些多是事后记录，本不该开工时读。处置方式是在入口链里标成「C 层：从不开工时读」，");
  console.log("   或按滚动窗口把旧章节搬进归档 —— 不是删。机器生成的文件已豁免（可随时重跑重建）。");
}
console.log("\n触线不等于必须马上搬——搬哪个要人判断。这条只负责让「到线了」不依赖主脑记性。");
// 结构性负债是提示而非故障：默认不阻断流程。要当门禁用加 --strict。
process.exit(args.includes("--strict") ? 1 : 0);
