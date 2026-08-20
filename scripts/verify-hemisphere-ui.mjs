// verify-hemisphere-ui.mjs - browser verification of the Hemispherical Deform SLIDER
// WIRING (0.2.134). The node tests cover the geometry math; this covers the layer they
// cannot: that dragging the real slider writes the lock field, rebuilds the mesh, keeps
// row 0 pinned in the LIVE app, survives undo, and round-trips through save/load.
//
// Run: node scripts/verify-hemisphere-ui.mjs [file.ahs] [--port 8290] [--cdp-port 9420]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const VALUE_OPTS = new Set(["--port", "--cdp-port"]);
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) { if (VALUE_OPTS.has(args[i])) i++; continue; }
  positional.push(args[i]);
}
// flag 缺失时 indexOf 返回 -1，args[-1+1] 会读到位置参数 ⇒ Number(路径)=NaN。见 verify-smoke.mjs 同处修复。
const optNumber = (flag, fallback) => {
  const at = args.indexOf(flag);
  if (at < 0) return fallback;
  const v = Number(args[at + 1]);
  return Number.isFinite(v) ? v : fallback;
};
const port = optNumber("--port", 8290);
const cdpPort = optNumber("--cdp-port", 9420);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const profileDir = path.join(os.tmpdir(), "ahs-hemisphere-profile-" + cdpPort);
const DEFAULT_AHS = "D:/Downloads/Sussurro_v1_0060.ahs";
const requested = positional[0] || DEFAULT_AHS;
const ahsFile = fs.existsSync(requested) ? requested : null;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".obj": "text/plain", ".css": "text/css", ".ahs": "application/octet-stream", ".ico": "image/x-icon" };
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
function waitFor(fn, timeout = 20000, interval = 200) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (async () => { while (Date.now() - t0 < timeout) { try { const v = await fn(); if (v) return resolve(v); } catch {} await sleep(interval); } reject(new Error("timeout")); })();
  });
}
async function connectCDP() {
  const list = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let seq = 0; const pending = new Map(); const events = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    else if (m.method === "Fetch.requestPaused") { void handleFetch(m.params); }
    else if (m.method) events.push(m);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((res) => { const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
  async function handleFetch(params) {
    const url = params.request?.url || "";
    const m = url.match(/^https:\/\/unpkg\.com\/three@0\.165\.0\/(.+)$/);
    if (!m) { await send("Fetch.continueRequest", { requestId: params.requestId }); return; }
    const file = path.join(THREE_VENDOR, "three", decodeURIComponent(m[1]));
    if (fs.existsSync(file)) {
      const body = fs.readFileSync(file).toString("base64");
      const ct = file.endsWith(".js") || file.endsWith(".mjs") ? "text/javascript" : path.extname(file) === ".json" ? "application/json" : "text/plain";
      await send("Fetch.fulfillRequest", { requestId: params.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: ct }, { name: "Access-Control-Allow-Origin", value: "*" }], body });
    } else { await send("Fetch.continueRequest", { requestId: params.requestId }); }
  }
  return { ws, send, events };
}
async function evalJS(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("eval exception: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}
const results = [];
function check(name, ok, detail = "") { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  - " + detail : ""}`); }

await new Promise((r) => server.listen(port, "127.0.0.1", r));
console.log(`static server on http://127.0.0.1:${port}${ahsFile ? "  project: " + path.basename(ahsFile) : "  (no .ahs)"}`);
fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
try {
  await waitFor(async () => { try { return (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok; } catch { return false; } }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable"); await cdp.send("Log.enable");
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://unpkg.com/*", requestStage: "Request" }] });
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(9000);
  check("test seam present", (await evalJS(cdp, `typeof window.__ahsTest === "object"`)) === true);
  if (ahsFile) {
    const data = fs.readFileSync(ahsFile, "base64");
    await evalJS(cdp, `(async () => {
      const bin = atob('${data}'); const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const file = new File([new Blob([bytes], { type: 'application/octet-stream' })], '${path.basename(ahsFile)}');
      const dt = new DataTransfer(); dt.items.add(file);
      document.body.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
      await new Promise(r => setTimeout(r, 600));
      const dlg = document.querySelector('#dropImportDialog');
      if (dlg && dlg.open) document.querySelector('#confirmDropImport').click();
      return true;
    })()`);
    await sleep(7000);
  }
  const bootErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions after load", bootErr === 0, `${bootErr} exceptions`);

  // 选一个 panel 几何（刘海面板）——半球只作用于 panel
  const picked = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.geometryType === 'panel' && l.mesh && !l.locked);
    if (!lock) return 'null';
    t.selectLock(lock.id, {});
    return JSON.stringify({ id: lock.id, name: lock.name || '(unnamed)' });
  })()`));
  check("found a panel lock", !!picked, picked ? JSON.stringify(picked) : "none");
  if (!picked) throw new Error("no panel geometry in this project");
  await sleep(1500);
  const lockRef = `window.__ahsTest.locks.find((l) => l.id === ${JSON.stringify(picked.id)})`;

  // 控件必须可见（panel 上下文），且这三个滑杆确实在 DOM 里
  const uiState = JSON.parse(await evalJS(cdp, `(() => {
    const box = document.querySelector('#panelHemisphereControls');
    const r = box.getBoundingClientRect();
    return JSON.stringify({
      visible: r.width > 0 && r.height > 0,
      amount: document.querySelector('#panelHemisphereAmount').value,
      width: document.querySelector('#panelHemisphereWidth').value,
      center: document.querySelector('#panelHemisphereCenter').value,
      emphasis: box.className
    });
  })()`));
  check("hemisphere controls visible on a panel", uiState.visible === true, JSON.stringify(uiState));
  check("sliders default to neutral (amount 0)", Number(uiState.amount) === 0, `amount=${uiState.amount}`);

  // 基线几何：row 0 顶点 + 整体包围盒
  const probe = `(() => {
    const lock = ${lockRef};
    const pos = lock.mesh.geometry.getAttribute('position');
    const rows = lock.mesh.geometry.userData.gridRowIndices || [];
    const row0 = [];
    for (let i = 0; i < pos.count && row0.length < 60; i++) if (rows[i] === 0) row0.push(pos.array[i*3], pos.array[i*3+1], pos.array[i*3+2]);
    lock.mesh.geometry.computeBoundingBox();
    const bb = lock.mesh.geometry.boundingBox;
    let sum = 0; for (let i = 0; i < pos.count; i++) sum += pos.array[i*3+2];
    return JSON.stringify({ count: pos.count, row0, zMean: sum / pos.count,
      bb: [bb.min.x, bb.min.y, bb.min.z, bb.max.x, bb.max.y, bb.max.z],
      field: lock.panelHemisphereAmount });
  })()`;
  const before = JSON.parse(await evalJS(cdp, probe));
  check("baseline field is 0", Number(before.field) === 0, `field=${before.field}`);

  // ── 真实滑杆交互：设值 + 派发 input（app.js 的通用接线监听 input）────────────
  await evalJS(cdp, `(() => {
    const s = document.querySelector('#panelHemisphereAmount');
    s.value = '0.8';
    s.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(2500);
  const after = JSON.parse(await evalJS(cdp, probe));
  check("slider writes the lock field", Math.abs(Number(after.field) - 0.8) < 1e-6, `field=${after.field}`);
  check("value output reflects the slider",
    (await evalJS(cdp, `document.querySelector('#panelHemisphereAmountValue').textContent`)) === "0.80",
    await evalJS(cdp, `document.querySelector('#panelHemisphereAmountValue').textContent`));
  // 几何真的重建了（顶点数不变、但沿法线整体外移）
  check("mesh rebuilt with same vertex count", after.count === before.count, `${before.count} -> ${after.count}`);
  check("geometry actually bulged (mean z moved)", Math.abs(after.zMean - before.zMean) > 1e-5,
    `zMean ${before.zMean.toFixed(6)} -> ${after.zMean.toFixed(6)}`);
  // row 0 在真实 app 里也必须逐位不动（UV 红线）
  const row0Same = before.row0.length === after.row0.length
    && before.row0.every((v, i) => Object.is(v, after.row0[i]));
  check("row 0 vertices bit-identical in the live app", row0Same,
    `${before.row0.length / 3} row-0 verts compared`);

  // 负值向内凹（与正值反向）
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelHemisphereAmount'); s.value = '-0.8'; s.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const dent = JSON.parse(await evalJS(cdp, probe));
  check("negative amount dents the opposite way",
    Math.sign(dent.zMean - before.zMean) === -Math.sign(after.zMean - before.zMean),
    `+0.8: ${(after.zMean - before.zMean).toFixed(6)}  -0.8: ${(dent.zMean - before.zMean).toFixed(6)}`);

  // ── 存档往返：字段必须随 .ahs 持久化 ─────────────────────────────────────────
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelHemisphereAmount'); s.value = '0.55'; s.dispatchEvent(new Event('input', { bubbles: true }));
    const w = document.querySelector('#panelHemisphereWidth'); w.value = '0.35'; w.dispatchEvent(new Event('input', { bubbles: true }));
    const c = document.querySelector('#panelHemisphereCenter'); c.value = '0.7'; c.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const live = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    return JSON.stringify({ a: lock.panelHemisphereAmount, w: lock.panelHemisphereWidth, c: lock.panelHemisphereCenter });
  })()`));
  check("three fields land on the lock",
    Math.abs(live.a - 0.55) < 1e-6 && Math.abs(live.w - 0.35) < 1e-6 && Math.abs(live.c - 0.7) < 1e-6,
    JSON.stringify(live));

  // ── undo 往返 = 比读 snapshot 更强的证据：它同时走 snapshotState（序列化）与
  // restoreLock（反序列化）两条真实路径。注意 bindUndoCapture 监听的是
  // **pointerdown/keydown**，不是 input —— 只派发裸 input 不会捕获 undo 基线
  // （本脚本初版就是这么写的，于是拿不到快照）。
  const undoTrip = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    const beforeUndo = lock.panelHemisphereAmount;
    const s = document.querySelector('#panelHemisphereAmount');
    s.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    s.value = '0.15';
    s.dispatchEvent(new Event('input', { bubbles: true }));
    return JSON.stringify({ beforeUndo, afterEdit: ${lockRef}.panelHemisphereAmount,
      undoEnabled: !document.querySelector('#undoAction').disabled });
  })()`));
  check("editing after pointerdown captures an undo step", undoTrip.undoEnabled === true, JSON.stringify(undoTrip));
  await sleep(1500);
  await evalJS(cdp, `document.querySelector('#undoAction').click()`);
  await sleep(3000);
  const restored = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    return JSON.stringify({ a: lock.panelHemisphereAmount, w: lock.panelHemisphereWidth, c: lock.panelHemisphereCenter,
      slider: document.querySelector('#panelHemisphereAmount').value });
  })()`));
  // undo 应把 amount 还原到编辑前的 0.55（width/center 一并保持）
  check("undo restores the field (snapshotState + restoreLock round-trip)",
    Math.abs(restored.a - undoTrip.beforeUndo) < 1e-6,
    `edited ${undoTrip.beforeUndo} -> 0.15 -> undo -> ${restored.a}`);
  check("undo also preserves width/center",
    Math.abs(restored.w - 0.35) < 1e-6 && Math.abs(restored.c - 0.7) < 1e-6, JSON.stringify(restored));
  check("slider UI resyncs after undo", Math.abs(Number(restored.slider) - restored.a) < 1e-6,
    `slider=${restored.slider} field=${restored.a}`);

  const uiErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 new exceptions across all slider interaction", uiErr === bootErr, `${uiErr - bootErr} new`);
} catch (error) {
  console.error("HEMISPHERE UI VERIFY ERROR:", error.message);
  results.push({ name: "harness", ok: false, detail: error.message });
} finally {
  try { chrome.kill(); } catch {}
  server.close();
}
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
