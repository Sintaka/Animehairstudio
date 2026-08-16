// scripts/export-verify.mjs — 浏览器端真实导出验证（任务 1/2）：
// 加载本地 app → drop .ahs → 勾 Bones、去勾 Mesh/Curve → 导出 USDA（showSaveFilePicker
// 打补丁为 undefined → 走下载路径，Page.setDownloadBehavior 接盘）→ 保存到指定目录。
// 用法：node scripts/export-verify.mjs [--port 8081] [--cdp-port 9224] [--out <dir>] [--ahs <path>]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const args = process.argv.slice(2);
const getArg = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const PORT = Number(getArg("--port", "8081"));
const CDP_PORT = Number(getArg("--cdp-port", "9231"));
const OUT_DIR = getArg("--out", "C:/Users/Administrator/AppData/Local/Temp/ahs-export-out");
const AHS = getArg("--ahs", "D:/Downloads/Sussurro_v1_0046.ahs");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".css": "text/css", ".png": "image/png", ".usda": "text/plain", ".ahs": "application/octet-stream" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const profileDir = path.join(os.tmpdir(), "ahs-export-profile-" + CDP_PORT);
fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, [
  "--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profileDir}`,
  "--no-first-run", "--window-size=1400,900", "about:blank"
], { stdio: "ignore" });

async function connectCDP() {
  const list = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let seq = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    else if (m.method === "Fetch.requestPaused") { void handleFetch(m.params); }
    else if (m.method) events.push(m);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((res) => { const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
  async function handleFetch(params) {
    const u = params.request?.url || "";
    const m = u.match(/^https:\/\/unpkg\.com\/three@0\.165\.0\/(.+)$/);
    if (!m) { await send("Fetch.continueRequest", { requestId: params.requestId }); return; }
    const file = path.join(THREE_VENDOR, "three", decodeURIComponent(m[1]));
    if (fs.existsSync(file)) {
      const body = fs.readFileSync(file).toString("base64");
      const ct = file.endsWith(".js") || file.endsWith(".mjs") ? "text/javascript" : "text/plain";
      await send("Fetch.fulfillRequest", { requestId: params.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: ct }, { name: "Access-Control-Allow-Origin", value: "*" }], body });
    } else {
      await send("Fetch.continueRequest", { requestId: params.requestId });
    }
  }
  return { send, events };
}
const evalJS = async (cdp, expression) => {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("eval exception: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
};
function waitFor(fn, timeout = 90000, interval = 200) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (async () => {
      while (Date.now() - t0 < timeout) {
        try { const v = await fn(); if (v) return resolve(v); } catch {}
        await sleep(interval);
      }
      reject(new Error("timeout"));
    })();
  });
}

try {
  await waitFor(async () => { try { const l = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`); return l.ok; } catch { return false; } }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://unpkg.com/*", requestStage: "Request" }] });
  // showSaveFilePicker → undefined：导出走下载路径；anchor click 被劫持捕获 blob URL，
  // 之后在页面内 fetch blob 拿文本（绕开 headless 下载落盘）。
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `Object.defineProperty(window, 'showSaveFilePicker', { value: undefined, configurable: true });
    window.__capturedDownload = null;
    window.__lastAlert = null;
    window.__errors = [];
    window.__blobUrls = 0;
    const __origAlert = window.alert.bind(window);
    window.alert = (m) => { window.__lastAlert = String(m); };
    const __origErr = console.error.bind(console);
    console.error = (...a) => { window.__errors.push(a.map(String).join(' ')); __origErr(...a); };
    const __origBlob = URL.createObjectURL.bind(URL);
    window.__blobMap = new Map();
    URL.createObjectURL = (b) => { const u = __origBlob(b); window.__blobMap.set(u, b); window.__blobUrls += 1; return u; };
    const __origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download && this.href) window.__capturedDownload = { name: this.download, href: this.href };
      return __origClick.apply(this, arguments);
    };`
  });

  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${PORT}/` });
  await waitFor(() => evalJS(cdp, `!!document.querySelector('canvas') && document.readyState === 'complete'`).catch(() => false), 60000, 150);

  // drop .ahs
  const ahsData = fs.readFileSync(AHS, "base64");
  await evalJS(cdp, `(async () => {
    const bin = atob('${ahsData}');
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const file = new File([bytes], 'export-verify.ahs');
    const dt = new DataTransfer();
    dt.items.add(file);
    document.body.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
    await new Promise(r => setTimeout(r, 700));
    const dlg = document.querySelector('#dropImportDialog');
    if (dlg && dlg.open) document.querySelector('#confirmDropImport')?.click();
    return 'dropped';
  })()`);
  await waitFor(() => evalJS(cdp, `document.querySelectorAll('#lockList .lock-item').length >= 20`).catch(() => false), 90000, 300);
  await sleep(2500); // 几何重建 + 静止

  // 导出：USDA，勾 Bones，去勾 Mesh/Curves（验证空 Scope 消失 + 权重）
  const exportRes = await evalJS(cdp, `(async () => {
    document.querySelector('#exportUsda').click();
    await new Promise(r => setTimeout(r, 400));
    const dlg = document.querySelector('#fileActionDialog');
    if (!dlg || !dlg.open) return 'dialog-not-open';
    document.querySelector('#fileActionName').value = 'ahs-export-verify';
    document.querySelector('#exportIncludeMesh').checked = false;
    document.querySelector('#exportIncludeCurves').checked = false;
    document.querySelector('#exportIncludeBones').checked = true;
    const form = document.querySelector('#fileActionName').closest('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 500));
    return JSON.stringify({ closed: !(document.querySelector('#fileActionDialog')||{}).open, status: (document.querySelector('#fileActionStatus')||{}).textContent || '' });
  })()`);
  console.log("export:", exportRes);
  console.log("showSaveFilePicker:", await evalJS(cdp, `typeof window.showSaveFilePicker`).catch(() => "?"));
  await sleep(4000);
  const diag = await evalJS(cdp, `JSON.stringify({
    status: (document.querySelector('#fileActionStatus')||{}).textContent || '',
    alert: window.__lastAlert || '',
    errors: (window.__errors || []).slice(-5),
    blobUrls: window.__blobUrls || 0,
    dialogOpen: (document.querySelector('#fileActionDialog')||{}).open ?? null
  })`).catch(() => "eval-fail");
  console.log("diag:", diag);
  const errs = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown");
  for (const e of errs.slice(-4)) {
    const d = e.params?.exceptionDetails || {};
    console.log("  [exception]", (d.exception?.description || d.text || "").slice(0, 400));
  }
  const logs = cdp.events.filter((e) => e.method === "Log.entryAdded" && e.params?.entry?.level === "error");
  for (const l of logs.slice(-4)) console.log("  [log]", (l.params.entry.text || "").slice(0, 300));

  // 捕获 blob → 存盘（buildHairUsda 全量导出，最多等 120s；轮询延迟反映主线程忙）
  let file = null;
  for (let i = 0; i < 240; i += 1) {
    const t0p = Date.now();
    await sleep(500);
    const cap = await evalJS(cdp, `JSON.stringify(window.__capturedDownload)`).catch(() => "null");
    const pollMs = Date.now() - t0p;
    if (pollMs > 800 && i % 5 === 0) console.log(`  [busy] poll ${i}: eval took ${pollMs}ms`);
    if (cap && cap !== "null") {
      const c = JSON.parse(cap);
      if (c?.href && String(c.name || "").endsWith(".usda")) {
        const text = await evalJS(cdp, `(async () => {
          const c = window.__capturedDownload;
          const blob = window.__blobMap.get(c.href);
          if (!blob) return null;
          return await blob.text();
        })()`).catch(() => null);
        if (text) {
          file = path.join(OUT_DIR, "ahs-export-verify.usda");
          fs.writeFileSync(file, text, "utf8");
          break;
        }
      }
    }
  }
  if (!file) { console.error("NO USDA CAPTURED"); process.exit(1); }
  console.log("usda:", file, Math.round(fs.statSync(file).size / 1024) + "KB");
} catch (e) {
  console.error("EXPORT VERIFY ERROR:", e.message);
  process.exit(1);
} finally {
  chrome.kill();
  for (let i = 0; i < 5; i++) { try { fs.rmSync(profileDir, { recursive: true, force: true }); break; } catch { await sleep(500); } }
  server.close();
}
