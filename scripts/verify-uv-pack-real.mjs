// verify-uv-pack-real.mjs — 真实工程端到端验证 UV 打包异步化（worker 池）。
// 流程：静态服务器 + headless Chrome(CDP) → 加载 D:/Downloads/Sussurro_v1_0046.ahs →
//   1) fileApi.buildUnfoldedMeshes()（真实导出展开+打包管线）计时 ×3、逐位确定性、uvs 合法性/uvisland；
//   2) UV checker 刷新按钮（#refreshUvChecker）走同管线，断言无异常；
// 依赖：app.js 的 ?ahstest=1 测试 seam 暴露 window.__ahsTest.fileApi（0.2.110 新增）。
// Run: node scripts/verify-uv-pack-real.mjs [--port 8080] [--cdp-port 9223] [--ahs D:/Downloads/Sussurro_v1_0046.ahs]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const VALUE_OPTS = new Set(["--port", "--cdp-port", "--ahs"]);
let ahsFile = null;
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) { if (VALUE_OPTS.has(args[i])) { if (args[i] === "--ahs") ahsFile = args[i + 1]; i++; } continue; }
}
const port = Number(args[args.indexOf("--port") + 1] || 8080);
const cdpPort = Number(args[args.indexOf("--cdp-port") + 1] || 9224);
ahsFile = ahsFile || "D:/Downloads/Sussurro_v1_0046.ahs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profileDir = path.join(os.tmpdir(), "ahs-uvprofile-" + cdpPort);

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".css": "text/css", ".ahs": "application/octet-stream", ".md": "text/plain",
};

// ---------- static server ----------
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function waitFor(fn, timeout = 30000, interval = 200) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (async () => {
      while (Date.now() - t0 < timeout) {
        try { const v = await fn(); if (v) return resolve(v); } catch {}
        await sleep(interval);
      }
      reject(new Error("timeout waiting for condition"));
    })();
  });
}

// ---------- CDP client ----------
async function connectCDP() {
  const list = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let seq = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    else if (m.method) events.push(m);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((res) => {
    const id = ++seq;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { ws, send, events };
}

async function evalJS(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("eval exception: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}

// ---------- main ----------
const results = [];
function check(name, ok, detail = "") { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); }

if (!fs.existsSync(ahsFile)) { console.error("missing project:", ahsFile); process.exit(2); }
await new Promise((r) => server.listen(port, "127.0.0.1", r));
console.log(`static server on http://127.0.0.1:${port}  project: ${ahsFile}`);

fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, [
  "--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`,
  "--no-first-run", "--window-size=1400,900", "about:blank",
], { stdio: "ignore" });

try {
  await waitFor(async () => {
    try { const l = await fetch(`http://127.0.0.1:${cdpPort}/json/version`); return l.ok; } catch { return false; }
  }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("DOM.enable");

  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(10000); // allow boot + three CDN fetch
  check("app boot (canvas present)", await evalJS(cdp, `!!document.querySelector('canvas')`));
  const diag = await evalJS(cdp, `JSON.stringify({
    ready: document.readyState,
    search: location.search,
    hasTest: typeof window.__ahsTest,
    fileApi: (window.__ahsTest && typeof window.__ahsTest.fileApi) || 'missing',
    locks: (window.__ahsTest && window.__ahsTest.locks) ? window.__ahsTest.locks.length : -1
  })`);
  console.log("  [diag]", diag);

  // 加载真实工程：CDP DOM.setFileInputFiles 直接喂 #hairProjectFile（比合成 drop 可靠）
  const domDoc = await cdp.send("DOM.getDocument", { depth: -1 });
  const q = await cdp.send("DOM.querySelector", { nodeId: domDoc.root.nodeId, selector: "#hairProjectFile" });
  if (q.nodeId) {
    await cdp.send("DOM.setFileInputFiles", { nodeId: q.nodeId, files: [ahsFile] });
  } else {
    check("file input found", false, "#hairProjectFile");
  }
  await sleep(9000);
  const lockCount = await evalJS(cdp, `(window.__ahsTest && window.__ahsTest.locks) ? window.__ahsTest.locks.length : -1`);
  check(`project loaded (locks=${lockCount})`, Number(lockCount) > 0);

  // 主验证：真实管线 buildUnfoldedMeshes（unfold + worker 打包）
  const suite = await evalJS(cdp, `(async () => {
    const out = { ok: true, errors: [] };
    try {
      const f = window.__ahsTest.fileApi;
      if (!f || typeof f.buildUnfoldedMeshes !== 'function') return { ok: false, errors: ['fileApi.buildUnfoldedMeshes missing'] };
      // 预热一次（worker 池冷启动）
      await f.buildUnfoldedMeshes();
      const times = [];
      let prev = null;
      let identical = true;
      let sanity = { meshes: 0, uvs: 0, minU: 1e9, maxU: -1e9, minV: 1e9, maxV: -1e9, islands: new Set(), badUv: 0 };
      for (let run = 0; run < 3; run++) {
        const t0 = performance.now();
        const unfolded = await f.buildUnfoldedMeshes();
        const dt = performance.now() - t0;
        times.push(Math.round(dt));
        const snap = [];
        for (const [id, mesh] of unfolded) {
          sanity.meshes++;
          const uv = mesh.uvs;
          snap.push({ id, uvs: uv.slice() });
          for (let i = 0; i + 1 < uv.length; i += 2) {
            const u = uv[i], v = uv[i + 1];
            if (!Number.isFinite(u) || !Number.isFinite(v) || u < -1e-9 || u > 1 + 1e-9 || v < -1e-9 || v > 1 + 1e-9) sanity.badUv++;
            sanity.uvs++;
            if (u < sanity.minU) sanity.minU = u;
            if (u > sanity.maxU) sanity.maxU = u;
            if (v < sanity.minV) sanity.minV = v;
            if (v > sanity.maxV) sanity.maxV = v;
          }
          if (mesh.uvisland !== undefined) sanity.islands.add(mesh.uvisland);
        }
        if (prev) {
          if (prev.length !== snap.length) identical = false;
          else for (let m = 0; m < snap.length && identical; m++) {
            const a = prev[m].uvs, b = snap[m].uvs;
            if (a.length !== b.length) { identical = false; break; }
            for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-12) { identical = false; break; }
          }
        }
        prev = snap;
      }
      out.times = times;
      out.identical = identical;
      out.sanity = { meshes: sanity.meshes, uvs: sanity.uvs, minU: +sanity.minU.toFixed(4), maxU: +sanity.maxU.toFixed(4), minV: +sanity.minV.toFixed(4), maxV: +sanity.maxV.toFixed(4), badUv: sanity.badUv, islands: sanity.islands.size };
    } catch (e) { out.ok = false; out.errors.push(String(e && e.message || e)); }
    return out;
  })()`);
  check("suite ok", suite.ok, suite.errors.join("; ") || "");
  if (suite.times) console.log("  buildUnfoldedMeshes ×3:", suite.times.join(" / "), "ms");
  if (suite.sanity) {
    const s = suite.sanity;
    check("uvs in [0,1] + finite", s.badUv === 0, `${s.meshes} meshes / ${s.uvs} uvs / U[${s.minU},${s.maxU}] V[${s.minV},${s.maxV}] / islands=${s.islands}`);
  }
  check("deterministic across runs", suite.identical === true);

  // UV checker 刷新按钮（真实 UI 路径）
  const ui = await evalJS(cdp, `(async () => {
    try {
      const toggle = document.querySelector('#toggleUvChecker');
      if (toggle && toggle.getAttribute('aria-pressed') !== 'true') toggle.click();
      await new Promise(r => setTimeout(r, 300));
      const btn = document.querySelector('#refreshUvChecker');
      if (!btn) return { ok: false, errors: ['#refreshUvChecker missing'] };
      btn.click();
      await new Promise(r => setTimeout(r, 4000));
      return { ok: true, state: document.querySelector('#uvCheckerMenuState')?.textContent || '' };
    } catch (e) { return { ok: false, errors: [String(e && e.message || e)] }; }
  })()`);
  check("UV checker refresh button ok", ui.ok, ui.errors ? ui.errors.join(";") : ui.state);
  const exceptions = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("zero page exceptions", exceptions === 0, `${exceptions} captured`);

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exitCode = failed ? 1 : 0;
} finally {
  chrome.kill();
  server.close();
}
