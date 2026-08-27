// commit-encoding-gate.test.mjs —— 钉住「scripts/check-commit-encoding.mjs 确实被
// scripts/round-check.mjs 引用」这条接线。
//
// 为什么需要源码级断言：check-commit-encoding.mjs 本身的判据逻辑已经过变异验证
// （构造「磁盘 CRLF / HEAD LF」的种类翻转场景，它正确报错并 exit 1），但脚本逻辑
// 正确不等于它会被跑到——在接进 round-check 之前，它从未被任何门禁调用过
// （.git/hooks 下只有 .sample，core.hooksPath 未设置，package.json scripts 与
// round-check.mjs 都不含它）。纯粹「脚本存在且逻辑对」测试不出「接线被摘掉」这类
// 回归：round-check.mjs 未来若被重构，很容易在挪动 cmdAll() 的过程中把某个子命令
// 漏掉而不引发任何测试失败。照抄 tests/panel-bone-brush-wiring.test.mjs 的写法：
// 直接读源码文本，断言接线的字面痕迹存在。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const roundCheckSource = readFileSync(
  new URL("../scripts/round-check.mjs", import.meta.url),
  "utf8"
);

test("round-check.mjs 定义了 cmdEncoding 并调用 check-commit-encoding.mjs", () => {
  assert.match(
    roundCheckSource,
    /function cmdEncoding\s*\(/,
    "round-check.mjs 必须定义 cmdEncoding —— 缺了它闸门就没有被接进来"
  );
  assert.match(
    roundCheckSource,
    /check-commit-encoding\.mjs/,
    "cmdEncoding 必须实际引用 scripts/check-commit-encoding.mjs 这个文件路径"
  );
});

test("cmdAll() 的结果集合里包含 encoding，且 dispatcher 里有对应子命令", () => {
  // 接线点①：cmdAll() 里的 results 对象必须有 encoding 键，否则 `npm run check`
  // （不带子命令，走 cmdAll）根本不会跑到 cmdEncoding —— 这正是本闸门最容易被
  // 静默摘掉的地方：函数还在、但调用它的那一行被删了，其余判据全部照常通过。
  const cmdAllBlock = roundCheckSource.slice(
    roundCheckSource.indexOf("function cmdAll()"),
    roundCheckSource.indexOf("function statusWord")
  );
  assert.ok(
    cmdAllBlock.includes("encoding: cmdEncoding()"),
    "cmdAll() 的 results 对象里必须有 encoding: cmdEncoding() —— 否则 `npm run check` 跑不到这条闸门"
  );

  // 接线点②：main() 里的 switch/dispatcher 必须能单独跑 `round-check.mjs encoding`，
  // 这是手工/未来 hook 单独调用这条闸门的入口。
  const mainBlock = roundCheckSource.slice(roundCheckSource.indexOf("function main()"));
  assert.match(
    mainBlock,
    /case "encoding":\s*\n\s*result = cmdEncoding\(\);/,
    "main() 的 dispatcher 里必须有 case \"encoding\" 分支，否则无法单独调用这条闸门"
  );
});
