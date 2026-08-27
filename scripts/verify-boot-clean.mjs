// verify-boot-clean.mjs —— 无头 Chrome 打开应用并掠过视口，收集 pageerror /
// console error / 失败请求。零错误 exit 0，有错误打印堆栈并 exit 1。
//
// 为什么需要它：node 单测从不 import app.js，也不执行任何视口代码，所以
// 「启动期运行时异常」这一类缺陷 570 条测试全绿也抓不到。0.2.161-0.2.165 连续四个版本
// 带着 app.js 的语法错误发布、以及 updateTipHighlight 的 undefined 崩溃，都是这样漏过去的。
// 本脚本实测能复现后者：摘掉 updateTipHighlight 的 `if (!lock) return` 守卫后
// 它报出同样的 message 与同样的两帧堆栈，装回守卫即归零。
//
// 沙箱内的一次性准备（无 root 也能做）：
//   1. npm i --no-save puppeteer && npx puppeteer browsers install chrome
//   2. 缺 libXdamage.so.1 时：
//        cd /tmp && mkdir xd && cd xd
//        apt-get download libxdamage1 && dpkg-deb -x *.deb .
//        mkdir -p /tmp/extralib && cp -a usr/lib/x86_64-linux-gnu/libXdamage.so* /tmp/extralib/
//   3. 运行：
//        AHS_CHROME=<上面那个 chrome-headless-shell 路径> \
//        LD_LIBRARY_PATH=/tmp/extralib \
//        node scripts/verify-boot-clean.mjs
//
// Windows 下直接装 puppeteer 即可，不需要 AHS_CHROME / LD_LIBRARY_PATH。
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import puppeteer from "puppeteer";

const ROOT = new URL("../", import.meta.url).pathname;

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".obj": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

const srv = createServer(async (req, res) => {
  try {
    let p = new URL(req.url, "http://x").pathname;
    if (p === "/") p = "/index.html";
    const rel = normalize(p).replace(/^\/+/, "");
    const buf = await readFile(join(ROOT, rel));
    res.writeHead(200, { "Content-Type": TYPES[extname(rel)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404);
    res.end("nf");
  }
});

await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const port = srv.address().port;

// chrome-headless-shell 依赖比完整 chrome 少：这个沙箱里只缺 libXdamage.so.1，
// 已用 `apt-get download libxdamage1` + `dpkg-deb -x` 解到 /tmp/extralib（无需 root），
// 由调用方通过 LD_LIBRARY_PATH 注入。
const browser = await puppeteer.launch({
  headless: "shell",
  executablePath: process.env.AHS_CHROME || undefined,
  args: ["--no-sandbox", "--disable-gpu", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"]
});
const page = await browser.newPage();

const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + (e.stack || e.message)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text());
});
page.on("requestfailed", (r) => {
  errors.push("reqfail: " + r.url() + " " + (r.failure()?.errorText || ""));
});

await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "load", timeout: 30000 });
await page.waitForSelector("canvas", { timeout: 8000 }).catch(() => null);
await new Promise((r) => setTimeout(r, 2500));

// 掠过视口：用户报的 updateTipHighlight 崩溃**只在鼠标移动时**触发
// （updatePanelTipHover 挂在 pointermove 上），不 hover 就抓不到。
const box = await page.$eval("canvas", (c) => {
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
}).catch(() => null);
if (box) {
  for (const [dx, dy] of [[0.5, 0.5], [0.4, 0.35], [0.6, 0.6], [0.5, 0.25], [0.3, 0.7]]) {
    await page.mouse.move(box.x + box.w * dx, box.y + box.h * dy);
    await new Promise((r) => setTimeout(r, 120));
  }
}
await new Promise((r) => setTimeout(r, 800));

console.log("ERRORS:", errors.length);
for (const e of errors) console.log("  " + e.replace(/\n/g, "\n    "));

await browser.close();
srv.close();
process.exit(errors.length ? 1 : 0);
