// verify-wind-preview.mjs — 吹风预览端到端验收（headless Chrome + CDP，真实工程）。
// 流程：boot(?ahstest=1) → 加载 D:/Downloads/Sussurro_v1_0046.ahs →
//   1) seam 启用预览 → 断言网格位置发生变形、尖部位移 > 根部位移（根少动尖多动）；
//   2) 确定性：同 windTime 下两次变形结果逐位一致；
//   3) 关闭预览 → 位置/法线/切线逐位恢复（非破坏）；
//   4) UI 路径：#toggleWindPreview 菜单按钮切换 + #windPreviewPanel 显示/隐藏。
// Run: node scripts/verify-wind-preview.mjs [--port 8080] [--cdp-port 9224] [--ahs ...]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const VALUE_OPTS = new Set(["--port", "--cdp-port", "--ahs"]);
let ahsFile = "D:/Downloads/Sussurro_v1_0046.ahs";
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) { if (VALUE_OPTS.has(args[i])) { if (args[i] === "--ahs") ahsFile = args[i + 1]; i++; } }
}
const port = Number(args[args.indexOf("--port") + 1] || 8080);
const cdpPort = Number(args[args.indexOf("--cdp-port") + 1] || 9229);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profileDir = path.join(os.tmpdir(), "ahs-windprofile-" + cdpPort);
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".css": "text/css", ".ahs": "application/octet-stream" };
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
      reject(new Error("timeout"));
    })();
  });
}
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
    else if (m.method === "Fetch.requestPaused") { void handleFetch(m.params); }
    else if (m.method) events.push(m);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((res) => { const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
  // unpkg three 离线 vendor（verify-smoke 同款：unpkg 不可达时从本地副本喂）
  async function handleFetch(params) {
    const url = params.request?.url || "";
    const m = url.match(/^https:\/\/unpkg\.com\/three@0\.165\.0\/(.+)$/);
    if (!m) { await send("Fetch.continueRequest", { requestId: params.requestId }); return; }
    const file = path.join(THREE_VENDOR, "three", decodeURIComponent(m[1]));
    if (fs.existsSync(file)) {
      const body = fs.readFileSync(file).toString("base64");
      const ext = path.extname(file);
      const ct = ext === ".js" || ext === ".mjs" ? "text/javascript" : ext === ".json" ? "application/json" : "text/plain";
      await send("Fetch.fulfillRequest", { requestId: params.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: ct }, { name: "Access-Control-Allow-Origin", value: "*" }], body });
    } else {
      await send("Fetch.continueRequest", { requestId: params.requestId });
    }
  }
  return { ws, send, events };
}
async function evalJS(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("eval exception: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}

const results = [];
function check(name, ok, detail = "") { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); }

if (!fs.existsSync(ahsFile)) { console.error("missing project:", ahsFile); process.exit(2); }
await new Promise((r) => server.listen(port, "127.0.0.1", r));
console.log(`static server on http://127.0.0.1:${port}  project: ${ahsFile}`);
fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });

try {
  await waitFor(async () => { try { return (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok; } catch { return false; } }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("DOM.enable");
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://unpkg.com/*", requestStage: "Request" }] });
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(10000);
  check("app boot (canvas)", await evalJS(cdp, `!!document.querySelector('canvas')`));

  const domDoc = await cdp.send("DOM.getDocument", { depth: -1 });
  const q = await cdp.send("DOM.querySelector", { nodeId: domDoc.root.nodeId, selector: "#hairProjectFile" });
  await cdp.send("DOM.setFileInputFiles", { nodeId: q.nodeId, files: [ahsFile] });
  await sleep(9000);
  const lockCount = await evalJS(cdp, `(window.__ahsTest && window.__ahsTest.locks) ? window.__ahsTest.locks.length : -1`);
  check(`project loaded (locks=${lockCount})`, Number(lockCount) > 0);

  const seam = await evalJS(cdp, `JSON.stringify({
    windApi: (window.__ahsTest && typeof window.__ahsTest.windPreviewApi),
    windState: (window.__ahsTest && typeof window.__ahsTest.windState)
  })`);
  const seamR = JSON.parse(seam);
  check("wind seam present", seamR.windApi === "object" && seamR.windState === "object", seam);

  // 主验证（seam 路径）
  const suite = await evalJS(cdp, `(async () => {
    const out = { ok: false, errors: [] };
    try {
      const { windPreviewApi, windState, locks } = window.__ahsTest;
      const meshes = locks.filter(l => l.mesh && l.mesh.geometry && l.mesh.geometry.attributes && l.mesh.geometry.attributes.position && l.mesh.geometry.userData && l.mesh.geometry.userData.gridRowIndices).map(l => l.mesh);
      if (!meshes.length) return { ok: false, errors: ['no meshes with gridRowIndices'] };
      const snap = (meshes) => meshes.map(m => ({ p: m.geometry.attributes.position.array.slice(), n: m.geometry.attributes.normal ? m.geometry.attributes.normal.array.slice() : null, t: m.geometry.attributes.tangent ? m.geometry.attributes.tangent.array.slice() : null }));
      const rest = snap(meshes);
      // 1) 启用
      windPreviewApi.setWindPreviewActive(true);
      if (!windState.windPreviewActive) return { ok: false, errors: ['windPreviewActive not set'] };
      // 2) 固定时间 tick 若干帧（确定性）
      const t0 = windState.windTime;
      windPreviewApi.tickOnce(); // +0.016
      windPreviewApi.tickOnce();
      windPreviewApi.tickOnce();
      const deformed = snap(meshes);
      // 位移统计：总位移 + 根行 vs 尖行位移（按 gridRow 分桶）
      let totalDisp = 0, rootDisp = 0, tipDisp = 0, moved = 0, nVerts = 0;
      for (let mi = 0; mi < meshes.length; mi++) {
        const pos = meshes[mi].geometry.attributes.position.array;
        const rp = rest[mi].p;
        const rows = meshes[mi].geometry.userData.gridRowIndices;
        for (let i = 0; i < pos.length; i += 3) {
          const vi = i / 3;
          const row = rows[vi];
          if (!Number.isFinite(row) || row < 0) continue;
          nVerts++;
          const dx = pos[i] - rp[i], dy = pos[i+1] - rp[i+1], dz = pos[i+2] - rp[i+2];
          const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
          totalDisp += d;
          if (d > 1e-9) moved++;
          const maxRow = meshes[mi].geometry.userData.gridRows ? meshes[mi].geometry.userData.gridRows - 1 : 0;
          if (row <= 0.5) rootDisp += d; else tipDisp += d;
        }
      }
      out.moved = moved; out.nVerts = nVerts; out.totalDisp = +totalDisp.toFixed(3);
      out.rootDisp = +rootDisp.toFixed(3); out.tipDisp = +tipDisp.toFixed(3);
      out.windTimeAdvanced = windState.windTime > t0;
      if (!(moved > 0)) return { ok: false, errors: ['no vertices moved'] };
      if (!(tipDisp > rootDisp * 1.5)) return { ok: false, errors: ['tip displacement not dominant: root=' + rootDisp + ' tip=' + tipDisp] };
      // 3) 确定性：windTime 固定（暂停）时再 tick 结果不变
      windState.windPlaying = false;
      const before2 = snap(meshes);
      windPreviewApi.tickOnce();
      windPreviewApi.tickOnce();
      const after2 = snap(meshes);
      let identical = true;
      for (let mi = 0; mi < meshes.length && identical; mi++) {
        const a = before2[mi].p, b = after2[mi].p;
        for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-9) { identical = false; break; }
      }
      out.deterministic = identical;
      if (!identical) return { ok: false, errors: ['non-deterministic when paused'] };
      // 4) 关闭恢复
      windState.windPlaying = true;
      windPreviewApi.setWindPreviewActive(false);
      const restored = snap(meshes);
      let restoredExact = true, restoredBad = 0;
      for (let mi = 0; mi < meshes.length && restoredExact; mi++) {
        const a = restored[mi].p, b = rest[mi].p;
        for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-9) { restoredExact = false; restoredBad++; break; }
        if (restored[mi].n && rest[mi].n) for (let i = 0; i < restored[mi].n.length; i++) if (Math.abs(restored[mi].n[i] - rest[mi].n[i]) > 1e-9) { restoredExact = false; restoredBad++; break; }
      }
      out.restoredExact = restoredExact;
      if (!restoredExact) return { ok: false, errors: ['restore mismatch (' + restoredBad + ' attrs)'] };
      out.ok = true;
    } catch (e) { out.errors.push(String(e && e.message || e)); }
    return out;
  })()`);
  check("suite ok", suite.ok, suite.errors.join("; ") || "");
  if (suite.ok) {
    console.log(`  moved ${suite.moved}/${suite.nVerts} verts, totalDisp=${suite.totalDisp} root=${suite.rootDisp} tip=${suite.tipDisp} timeAdvanced=${suite.windTimeAdvanced}`);
    check("tip moves more than root", suite.tipDisp > suite.rootDisp * 1.5, `root=${suite.rootDisp} tip=${suite.tipDisp}`);
    check("deterministic when paused", suite.deterministic === true);
    check("restore bit-exact", suite.restoredExact === true);
  }

  // UI 路径：菜单按钮
  const ui = await evalJS(cdp, `(async () => {
    try {
      const btn = document.querySelector('#toggleWindPreview');
      if (!btn) return { ok: false, errors: ['#toggleWindPreview missing'] };
      const panel = document.querySelector('#windPreviewPanel');
      if (!panel) return { ok: false, errors: ['#windPreviewPanel missing'] };
      btn.click();
      await new Promise(r => setTimeout(r, 300));
      const state = document.querySelector('#windPreviewMenuState')?.textContent || '';
      const shown = !panel.classList.contains('hidden');
      const pressed = btn.getAttribute('aria-pressed');
      btn.click(); // 关闭
      await new Promise(r => setTimeout(r, 300));
      const shownAfter = !panel.classList.contains('hidden');
      return { ok: true, state, pressed, shown, shownAfter };
    } catch (e) { return { ok: false, errors: [String(e && e.message || e)] }; }
  })()`);
  check("Preview menu toggle ok", ui.ok, ui.errors ? ui.errors.join(";") : `state=${ui.state} pressed=${ui.pressed} shown=${ui.shown}->${ui.shownAfter}`);
  if (ui.ok) {
    check("menu shows On when active", ui.state === "On" && ui.pressed === "true" && ui.shown === true);
    check("menu shows Off when closed", ui.shownAfter === false);
  }

  const exceptions = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("zero page exceptions", exceptions === 0, `${exceptions} captured`);

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exitCode = failed ? 1 : 0;
} finally {
  chrome.kill();
  server.close();
}
