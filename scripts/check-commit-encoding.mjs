// check-commit-encoding.mjs —— 提交前的编码闸门：BOM + 行尾翻转。
//
// 用法：
//   node scripts/check-commit-encoding.mjs            # 检查当前已 staged 的文件
//   node scripts/check-commit-encoding.mjs <file...>   # 检查指定文件
//
// **静默通过**：没问题时不输出任何内容、exit 0；有问题才打印并 exit 1。
// 与 tests/encoding-contract.test.mjs 的分工：那个测试守「全仓不得有 BOM / 必须是合法
// UTF-8」这条**长期不变式**；本脚本守「我这一次提交会不会把行尾翻掉」这条**即时风险**，
// 两者判据不同，不要合并。
//
// 【为什么行尾判据是「与 HEAD 比」而不是「禁止 CRLF」】本仓实测（2026-08-26）：262 个
// 跟踪的文本文件里 **213 个磁盘上是 CRLF**、46 个纯 LF，且其中 **171 个的磁盘 CR 数与
// HEAD blob 不一致**（git 存 LF、磁盘是 CRLF）。这是既有噪音，不是本轮引入的，所以
// 「禁止 CRLF」会把两百多个文件全判成违规、毫无用处。
// 真正会出事的是：**把一个「磁盘 CRLF 而 git 存 LF」的文件 git add 进去** —— 提交会把
// 整个文件的行尾一起翻成 CRLF，commit 规模虚高并污染历史（实测踩过：638 行真实改动被
// 记成 10878 插入 / 10265 删除）。所以判据是「本次要提交的文件，磁盘 CR 数是否等于
// HEAD blob 的 CR 数」，只对**本次涉及的文件**收紧，不管仓库其余部分。
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const countByte = (buf, byte) => {
  let n = 0;
  for (let i = 0; i < buf.length; i += 1) if (buf[i] === byte) n += 1;
  return n;
};

// 行尾种类：none（无换行）/ LF / CRLF / MIXED（同一文件里两种混用）。
// MIXED 单独成一类而不是归进 CRLF：混用是真问题（多半是不同工具轮流写过同一个文件），
// 一旦从 MIXED 提交出去，diff 会出现大量看不出原因的整行改动。
const eolKind = (buf) => {
  const cr = countByte(buf, 13);
  const lf = countByte(buf, 10);
  if (lf === 0) return "none";
  if (cr === 0) return "LF";
  return cr === lf ? "CRLF" : "MIXED";
};

// stderr 必须 "ignore"：新增文件在 HEAD 里不存在，`git show HEAD:<f>` 会往 stderr 打
// 一行 `fatal: path ... exists on disk, but not in 'HEAD'`。try/catch 只吞异常、**不吞子
// 进程的 stderr**，于是暂存任何新文件都会破坏「静默通过」这条要求（实测踩到）。
const git = (args) => execFileSync("git", args, { maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });

const argv = process.argv.slice(2);
let files = argv.filter((a) => !a.startsWith("-"));
if (!files.length) {
  files = git(["diff", "--cached", "--name-only", "--diff-filter=ACM"])
    .toString("utf8").split("\n").map((s) => s.trim()).filter(Boolean);
}

const bomOffenders = [];
const eolOffenders = [];

for (const f of files) {
  let disk;
  try { disk = readFileSync(f); } catch { continue; }        // 已删除的路径：跳过
  if (disk.includes(0)) continue;                             // 二进制：不适用

  if (disk.length >= 3 && disk[0] === 0xEF && disk[1] === 0xBB && disk[2] === 0xBF) {
    bomOffenders.push(f);
  }

  // HEAD 里没有这个文件（新增文件）⇒ 没有「翻转」风险，跳过行尾比对。
  let head;
  try { head = git(["show", `HEAD:${f}`]); } catch { continue; }
  // 判据比的是**行尾种类**，不是 CR 的绝对条数。
  // 第一版比条数，结果一改 CRLF 文件就误报：sculpt-geometry.js 在 HEAD 里本来就是纯 CRLF
  // （CR=1187、LF=1187），我加了 5 行 CRLF 之后 CR=1192 —— 种类没变、提交也不会翻转任何
  // 既有行，但条数判据把这种**完全正常的新增**判成违规。真正要拦的是「种类变了」：
  // git 存 LF 而磁盘变成 CRLF（或反之），那才会让整个文件的行尾在提交时翻面。
  if (eolKind(disk) !== eolKind(head)) {
    eolOffenders.push({ f, disk: eolKind(disk), head: eolKind(head) });
  }
}

if (!bomOffenders.length && !eolOffenders.length) process.exit(0);

if (bomOffenders.length) {
  console.error("UTF-8 BOM 违规（本仓要求全部无 BOM）：");
  for (const f of bomOffenders) console.error(`  ${f}`);
}
if (eolOffenders.length) {
  console.error("行尾翻转风险：磁盘 CR 数 != HEAD blob 的 CR 数。");
  console.error("直接提交会把整个文件的行尾翻掉，commit 规模虚高且污染历史。");
  console.error("修法：把这些文件的 \\r\\n 还原成 \\n 后重新 git add，再跑本脚本确认静默。");
  for (const o of eolOffenders) console.error(`  ${o.f}  disk=${o.disk}  HEAD=${o.head}`);
}
process.exit(1);
