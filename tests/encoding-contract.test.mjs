// encoding-contract.test.mjs — 仓库编码不变式（0.2.131 起）。
// 背景：0.2.125–0.2.130 期间，`write`/`edit` 工具每次写入都会静默剥掉 UTF-8 BOM，
// 而当时有 30 个文件带 BOM，于是每轮改动都要人工字节级复验，实测损耗 8 次。
// 0.2.130 实测确认：换 pwsh 7 只修好了 PowerShell 侧的**误报**（`>` 不再伪造 UTF-16
// 前缀、`-AsByteStream` 不再吞 BOM），工具层的剥离行为**不受影响**（对照实验：写入带
// BOM 的临时文件 → 跑一次 edit → BOM 消失）。因此结论是**消灭这个不变式**而不是靠纪律
// 维护它：全仓库统一 UTF-8 无 BOM，本测试守住它。
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { execFileSync } from "node:child_process";

// 允许带 BOM 的白名单：目前为空。
// 唯一正当理由是「给 Excel 吃的 CSV」——Excel 靠 BOM 判 UTF-8，没 BOM 中文会按本地
// 代码页解成乱码（简中 Win11 实测 ACP=936）。将来若新增此类导出文件，在这里登记并写明
// 原因；除此之外不要往白名单里加东西。
const BOM_ALLOWED = new Set([]);

test("no tracked text file carries a UTF-8 BOM (except the documented allow-list)", async () => {
  const files = execFileSync("git", ["ls-files"], { encoding: "utf8", maxBuffer: 1 << 28 })
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const offenders = [];
  for (const f of files) {
    let buf;
    try { buf = await readFile(f); } catch { continue; }
    if (buf.length < 3) continue;
    const hasBom = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    if (hasBom && !BOM_ALLOWED.has(f)) offenders.push(f);
  }
  assert.deepEqual(
    offenders,
    [],
    `these files regained a UTF-8 BOM — run 'node scripts/strip-utf8-bom.mjs'. `
    + `BOM 是冗余的（UTF-8 无字节序问题），且会让 JSON.parse 抛异常、/^<!doctype/ 匹配失败`
  );
});

test("every tracked text file is valid strict UTF-8 (no GBK/legacy leftovers)", async () => {
  // 简中 Win11 的系统 ANSI 代码页仍是 936（0.2.130 实测），所以任何被 ANSI 路径写过的
  // 文件都可能带 GBK 字节。严格解码能把它们揪出来：非法 UTF-8 会抛。
  const strict = new TextDecoder("utf-8", { fatal: true });
  const files = execFileSync("git", ["ls-files"], { encoding: "utf8", maxBuffer: 1 << 28 })
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const bad = [];
  for (const f of files) {
    let buf;
    try { buf = await readFile(f); } catch { continue; }
    if (buf.includes(0)) continue; // 二进制（png/ico 等）跳过
    try { strict.decode(buf); } catch { bad.push(f); }
  }
  assert.deepEqual(bad, [], "non-UTF-8 bytes found (likely written through a GBK/ANSI code path)");
});
