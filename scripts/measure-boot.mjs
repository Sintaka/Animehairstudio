// scripts/measure-boot.mjs — 对比本地 fork 与 upstream main 的完整加载耗时（多次取中位数）。
// 用法：node scripts/measure-boot.mjs [--runs 3] [--port 8081] [--cdp-port 9224] [--ahs <path>]
// 本地 :8081，upstream :8082；unpkg three@0.165.0 由 Fetch 拦截改读本地 vendor（离线）。
// 阶段：t_boot = 导航→canvas+readyState complete；t_load = drop .ahs → lock-item 稳定。
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const UPSTREAM = "D:/Downloads/ahs-main-upstream";
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const RUNS = Number(getArg("--runs", "3"));
const PORT = Number(getArg("--port", "8081"));
const CDP_PORT = Number(getArg("--cdp-port", "9224"));
const AHS = getArg("--ahs", "D:/Downloads/Sussurro_v1_0046.ahs");
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".obj": "text/plain", ".usda": "text/plain", ".css": "text/css", ".ahs": "application/octet-stream",
  ".md": "text/plain", ".txt": "text/plain", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff"
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeServer(root, port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(path.normalize(root))) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}

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
  const send = (method, params = {}) => new Promise((res) => {
    const id = ++seq;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
  async function handleFetch(params) {
    const u = params.request?.url || "";
    const m = u.match(/^https:\/\/unpkg\.com\/three@0\.165\.0\/(.+)$/);
    if (!m) { await send("Fetch.continueRequest", { requestId: params.requestId }); return; }
    const file = path.join(THREE_VENDOR, "three", decodeURIComponent(m[1]));
    if (fs.existsSync(file)) {
      const body = fs.readFileSync(file).toString("base64");
      const ct = file.endsWith(".js") || file.endsWith(".mjs") ? "text/javascript" : path.extname(file) === ".json" ? "application/json" : "text/plain";
      await send("Fetch.fulfillRequest", { requestId: params.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: ct }, { name: "Access-Control-Allow-Origin", value: "*" }], body });
    } else {
      await send("Fetch.continueRequest", { requestId: params.requestId });
    }
  }
  return { send, events };
}

async function evalJS(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("eval exception: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}

function waitFor(fn, timeout = 60000, interval = 120) {
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

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

// ---------- main ----------
const servers = [await makeServer(ROOT, PORT), await makeServer(UPSTREAM, PORT + 1)];
const ahsData = fs.existsSync(AHS) ? fs.readFileSync(AHS, "base64") : null;
const profileDir = path.join(os.tmpdir(), "ahs-measure-profile-" + CDP_PORT);
fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, [
  "--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profileDir}`,
  "--no-first-run", "--window-size=1400,900", "about:blank"
], { stdio: "ignore" });

const apps = [
  { name: "LOCAL    ", url: `http://127.0.0.1:${PORT}/`, base: ROOT },
  { name: "UPSTREAM ", url: `http://127.0.0.1:${PORT + 1}/`, base: UPSTREAM }
];
const results = { boot: {}, load: {}, settle: {}, scriptMs: {}, jsBytes: {} };

try {
  await waitFor(async () => {
    try { const l = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`); return l.ok; } catch { return false; }
  }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://unpkg.com/*", requestStage: "Request" }] });
  await cdp.send("Performance.enable");

  for (let run = 1; run <= RUNS; run += 1) {
    for (const app of apps) {
      const label = `${app.name} run ${run}`;
      const t0 = Date.now();
      await cdp.send("Page.navigate", { url: app.url + `?_t=${run}` });
      // 等导航真正开始（页面时间轴重置）
      await waitFor(() => evalJS(cdp, `document.readyState !== "loading"`).catch(() => false), 20000, 100);
      console.log(`${label}: navigating done (${Date.now() - t0}ms)`);
      const boot = await waitFor(() => evalJS(cdp, `(async () => {
        const canvas = document.querySelector('canvas');
        if (!canvas || document.readyState !== 'complete') return null;
        await new Promise(r => setTimeout(r, 400)); // 让首帧/初始化稳定
        const jsBytes = performance.getEntriesByType('resource')
          .filter(e => /\.js(\\?|$)/.test(e.name))
          .reduce((s, e) => s + (e.transferSize || e.decodedBodySize || 0), 0);
        return JSON.stringify({ t: performance.now(), jsBytes });
      })()`).catch((e) => { if (Date.now() - t0 < 20000) console.error("  poll err:", e.message.slice(0, 120)); return null; }), 60000, 100);
      const b = JSON.parse(boot);
      const bootMs = Date.now() - t0;
      results.boot[app.name] = results.boot[app.name] || [];
      results.boot[app.name].push(bootMs);
      results.jsBytes[app.name] = results.jsBytes[app.name] || [];
      results.jsBytes[app.name].push(b.jsBytes);
      console.log(`${label}: boot ${bootMs}ms (canvas), JS ${Math.round(b.jsBytes / 1024)}KB`);

      // 加载项目文件
      if (ahsData) {
        const tLoad = Date.now();
        const dropRes = await evalJS(cdp, `(async () => {
          try {
            const bin = atob('${ahsData}');
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            const file = new File([bytes], 'measure.ahs');
            const dt = new DataTransfer();
            dt.items.add(file);
            document.body.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
            await new Promise(r => setTimeout(r, 700));
            const dlg = document.querySelector('#dropImportDialog');
            if (dlg && dlg.open) document.querySelector('#confirmDropImport')?.click();
            return 'dropped';
          } catch (e) { return 'ERR ' + e.message; }
        })()`);
        const loaded = await waitFor(async () => {
          const v = await evalJS(cdp, `JSON.stringify({ count: document.querySelectorAll('#lockList .lock-item').length, status: (document.querySelector('#presetLibraryStatus')||{}).textContent || '' })`).catch(() => null);
          if (!v) return null;
          const s = JSON.parse(v);
          if (s.count >= 20) return s;
          return null;
        }, 90000, 300);
        const loadMs = Date.now() - tLoad;
        // 静止检测：主线程 ScriptDuration 每 500ms 窗口增量 < 15ms 连续 3 次 → 完全稳定
        const metrics0 = await cdp.send("Performance.getMetrics").catch(() => null);
        const script0 = metrics0 ? Number((metrics0.metrics || []).find((m) => m.name === "ScriptDuration")?.value || 0) : 0;
        let lastScript = script0;
        let quiet = 0;
        const tSettleStart = Date.now();
        while (Date.now() - tSettleStart < 45000) {
          await sleep(500);
          const metrics = await cdp.send("Performance.getMetrics").catch(() => null);
          if (!metrics) continue;
          const scriptNow = Number((metrics.metrics || []).find((m) => m.name === "ScriptDuration")?.value || 0);
          const delta = scriptNow - lastScript;
          lastScript = scriptNow;
          quiet = delta < 15 ? quiet + 1 : 0;
          if (quiet >= 3) break;
        }
        const settleMs = Date.now() - tLoad;
        results.load[app.name] = results.load[app.name] || [];
        results.load[app.name].push(loadMs);
        results.settle[app.name] = results.settle[app.name] || [];
        results.settle[app.name].push(settleMs);
        const lockCount = loaded ? JSON.parse(await evalJS(cdp, `JSON.stringify(document.querySelectorAll('#lockList .lock-item').length)`)) : 0;
        console.log(`${label}: load ${loadMs}ms (locks), settled ${settleMs}ms, locks=${lockCount} (${dropRes})`);
      }
      // 捕获页面异常（仅计数）
      const errCount = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
      if (errCount) console.log(`${label}: ${errCount} page exceptions`);
    }
  }

  console.log("\n=== 汇总（中位数） ===");
  for (const app of apps) {
    const boot = results.boot[app.name] || [];
    const load = results.load[app.name] || [];
    const settle = results.settle[app.name] || [];
    const bytes = results.jsBytes[app.name] || [];
    console.log(`${app.name}: boot ${median(boot)}ms (${boot.join("/")})` +
      (load.length ? `, load ${median(load)}ms (${load.join("/")}), settled ${median(settle)}ms (${settle.join("/")}), JS ${Math.round(median(bytes) / 1024)}KB` : ", load n/a"));
  }
} catch (e) {
  console.error("MEASURE ERROR:", e.message);
} finally {
  chrome.kill();
  for (let i = 0; i < 5; i++) { try { fs.rmSync(profileDir, { recursive: true, force: true }); break; } catch { await sleep(500); } }
  servers.forEach((s) => s.close());
}
