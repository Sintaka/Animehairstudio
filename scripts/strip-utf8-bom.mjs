// strip-utf8-bom.mjs — 一次性/可复跑：去掉全部 tracked 文本文件的 UTF-8 BOM。
// 为什么要去：UTF-8 无字节序问题，BOM 纯冗余（Unicode 标准 "not recommended"）。
// 本仓库全部消费方都已显式声明编码 —— ES module 按规范强制 UTF-8、index.html 有
// <meta charset>、server.js 发 charset=utf-8、Node 读文件显式 "utf8" —— 没有一处需要 BOM。
// 反面成本实测：JSON.parse 遇 BOM 直接抛；/^<!doctype/ 匹配失败；write/edit 工具每次写入
// 都会静默剥掉它（0.2.130 实测 pwsh7 也修不了，那是工具层行为），于是每次改动都要人工
// 字节级复验，0.2.125–0.2.130 为此损耗 8 次。去掉后该不变式消失，不需要纪律维护。
// 例外：给 Excel 吃的 CSV 需要 BOM（Excel 靠它判 UTF-8）——本仓库目前没有，将来若加，
// 在 tests 的守卫里显式白名单并写明原因。
// Run: node scripts/strip-utf8-bom.mjs [--check]
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const checkOnly = process.argv.includes("--check");
const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n").map((s) => s.trim()).filter(Boolean);

const hit = [];
for (const f of files) {
  let buf;
  try { buf = readFileSync(f); } catch { continue; }
  if (buf.length < 3) continue;
  if (buf[0] !== 0xEF || buf[1] !== 0xBB || buf[2] !== 0xBF) continue;
  hit.push(f);
  if (!checkOnly) writeFileSync(f, buf.subarray(3));
}

if (checkOnly) {
  console.log(hit.length === 0 ? "OK: no tracked file carries a UTF-8 BOM" : `FAIL: ${hit.length} file(s) carry a BOM`);
  for (const f of hit) console.log("  " + f);
  process.exit(hit.length === 0 ? 0 : 1);
}
console.log(`stripped BOM from ${hit.length} file(s)`);
for (const f of hit) console.log("  " + f);
