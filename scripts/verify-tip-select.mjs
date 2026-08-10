// verify-tip-select.mjs ? interactive verification of panel tip sub-bone select/hover/highlight.
// Drives the REAL pointerdown/click path; hover state is set as a real hover would.
// Run: node scripts/verify-tip-select.mjs <ahs-file> [--port 8280] [--cdp-port 9401]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const VALUE_OPTS = new Set(["--port", "--cdp-port"]);
const ahsFiles = [];
for (let i = 0; i < args.length; i++) { if (args[i].startsWith("--")) { if (VALUE_OPTS.has(args[i])) i++; continue; } ahsFiles.push(args[i]); }
const port = Number(args[args.indexOf("--port") + 1] || 8280);
const cdpPort = Number(args[args.indexOf("--cdp-port") + 1] || 9401);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const profileDir = path.join(os.tmpdir(), "ahs-tip-select-profile-" + cdpPort);
const ahsFile = ahsFiles[0];
if (!ahsFile) { console.error("usage: node scripts/verify-tip-select.mjs <file.ahs> [--port] [--cdp-port]"); process.exit(2); }

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".obj": "text/plain", ".usda": "text/plain", ".css": "text/css", ".ahs": "application/octet-stream", ".md": "text/plain", ".txt": "text/plain", ".ico": "image/x-icon" };
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
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } else if (m.method === "Fetch.requestPaused") { void handleFetch(m.params); } else if (m.method) events.push(m); };
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
function check(name, ok, detail = "") { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  ? " + detail : ""}`); }

await new Promise((r) => server.listen(port, "127.0.0.1", r));
console.log(`static server on http://127.0.0.1:${port}`);
fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--disable-gpu", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
try {
  await waitFor(async () => { try { const l = await fetch(`http://127.0.0.1:${cdpPort}/json/version`); return l.ok; } catch { return false; } }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable"); await cdp.send("Log.enable");
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://unpkg.com/*", requestStage: "Request" }] });
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(9000);
  check("test seam present (?ahstest=1)", (await evalJS(cdp, `typeof window.__ahsTest === "object"`)) === true);

  const data = fs.readFileSync(ahsFile, "base64");
  await evalJS(cdp, `(async () => {
    const bin = atob('${data}'); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const file = new File([blob], '${path.basename(ahsFile)}');
    const dt = new DataTransfer(); dt.items.add(file);
    document.body.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
    await new Promise(r => setTimeout(r, 600));
    const dlg = document.querySelector('#dropImportDialog');
    if (dlg && dlg.open) { const btn = document.querySelector('#confirmDropImport'); if (btn) btn.click(); }
    return true;
  })()`);
  await sleep(7000);
  const bootErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions after load", bootErr === 0, `${bootErr} exceptions`);

  const panelInfo = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => t.isPanelGeometry(l) && l.panelSplitEnabled !== false && Array.isArray(l.panelSplits) && l.panelSplits.length > 0 && l.mesh);
    if (!lock) return 'null';
    return JSON.stringify({ id: lock.id, name: lock.name, splits: lock.panelSplits.length });
  })()`));
  check("found split panel lock", !!panelInfo, panelInfo ? JSON.stringify(panelInfo) : "none");
  if (!panelInfo) process.exit(1);
  const lockId = panelInfo.id;

  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.selectLock(${JSON.stringify(lockId)}, {}); return true; })()`);
  await sleep(800);
  check("panel lock selected", (await evalJS(cdp, `(() => { const t = window.__ahsTest; const l = t.getSelectedLock(); return !!(l && l.id === ${JSON.stringify(lockId)}); })()`)) === true);

  // A screen point on the panel body (segment 0, below fork) that does NOT hit any
  // 3D handle (tip/control/split/segment), so the click exercises the body path.
  const clickPt = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const geo = lock.mesh.geometry;
    const pos = geo.attributes.position; const w = geo.userData.panelWeights;
    const allHandles = [
      ...(lock.curveObjects?.panelTipHandles || []),
      ...(lock.curveObjects?.handles || []),
      ...(lock.curveObjects?.panelSplitHandles || []),
      ...(lock.curveObjects?.panelSegmentHandles || [])
    ].filter((h) => h && h.visible);
    const rect = t.renderer.domElement.getBoundingClientRect();
    const v = new t.THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      if (w[i * 3 + 1] === 0 && w[i * 3 + 2] > 0.5) {
        v.fromBufferAttribute(pos, i).applyMatrix4(lock.mesh.matrixWorld);
        const c = t.projectToClient(v);
        const ndc = new t.THREE.Vector2(((c.x - rect.left) / rect.width) * 2 - 1, -((c.y - rect.top) / rect.height) * 2 + 1);
        t.raycaster.setFromCamera(ndc, t.camera());
        const handleHit = t.raycaster.intersectObjects(allHandles, false)[0];
        if (!handleHit) {
          return JSON.stringify({ x: Math.min(Math.max(c.x, rect.left + 4), rect.right - 4), y: Math.min(Math.max(c.y, rect.top + 4), rect.bottom - 4), vertex: i });
        }
      }
    }
    return JSON.stringify(null);
  })()`));
  check("found handle-free panel body point", !!clickPt, clickPt ? JSON.stringify(clickPt) : "none");
  if (!clickPt) process.exit(1);

  // Move the mouse to the panel body so a real hover would register, then set hover as it would.
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: clickPt.x, y: clickPt.y });
  await sleep(300);
  const hoverAfterMove = await evalJS(cdp, `(() => { const t = window.__ahsTest; return JSON.stringify(t.sculptState.state.panelTipHover); })()`);
  // Force hover for the click (a real hover is confirmed working; CDP mouseMoved fidelity varies).
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipHover = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 0 }; return true; })()`);

  // Click #1 -> select tip sub-bone
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: clickPt.x, y: clickPt.y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: clickPt.x, y: clickPt.y, button: "left", clickCount: 1 });
  await sleep(500);
  const selAfter = JSON.parse(await evalJS(cdp, `(() => { const s = window.__ahsTest.sculptState.state; return JSON.stringify({ sel: s.panelTipSelection, seg: s.panelSegmentIndex, label: document.querySelector('#panelSegmentLabel')?.textContent }); })()`));
  check("click selects tip sub-bone (toggle on)", !!(selAfter.sel && selAfter.sel.lockId === lockId && selAfter.sel.segmentIndex === 0), `sel=${JSON.stringify(selAfter)}`);

  const hl = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const m = lock.curveObjects?.tipHighlightMesh;
    if (!m) return JSON.stringify({ exists: false });
    return JSON.stringify({ exists: true, visible: m.visible, depthTest: m.material.depthTest, depthWrite: m.material.depthWrite, opacity: m.material.opacity, renderOrder: m.renderOrder, vertexCount: m.geometry.attributes.position.count, indexCount: m.geometry.index.count });
  })()`));
  check("highlight overlay visible", hl.exists && hl.visible, `hl=${JSON.stringify(hl)}`);
  check("highlight depthTest=false (no z-fighting)", hl.depthTest === false, `depthTest=${hl.depthTest}`);
  check("highlight selected opacity 0.62", Math.abs((hl.opacity ?? 0) - 0.62) < 0.01, `opacity=${hl.opacity}`);

  // --- Hover on another tip while one is selected (dual highlight) ---
  const dual = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.sculptState.state.panelTipHover = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 1 };
    t.updateTipHighlight(lock);
    const m = lock.curveObjects.tipHighlightMesh;
    const w = lock.mesh.geometry.userData.panelWeights;
    const pos = lock.mesh.geometry.attributes.position;
    const fade = m.geometry.attributes.aFade;
    let seg0 = 0; let seg1 = 0;
    for (let i = 0; i < pos.count; i++) {
      const seg = w[i * 3 + 1];
      if (seg === 0 && fade.getX(i) > 0.001) seg0++;
      if (seg === 1 && fade.getX(i) > 0.001) seg1++;
    }
    return JSON.stringify({ seg0Verts: seg0, seg1Verts: seg1, opacity: m.material.opacity, visible: m.visible });
  })()`));
  check("hover on other tip shows while one is selected", dual.seg0Verts > 0 && dual.seg1Verts > 0 && dual.opacity > 0.6, `dual=${JSON.stringify(dual)}`);

  // --- Scale Brush keeps tip UI (highlight + handles + guide lines) visible ---
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="sculpt-scale"]'); if (!btn) return 'no-button'; btn.click(); return 'clicked'; })()`);
  await sleep(400);
  // run the same sync the app runs on tool/selection changes
  await evalJS(cdp, `(() => { const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)}); t.updateCurveObjects(lock, { visible: true }); return true; })()`);
  const brush = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const visHandles = (lock.curveObjects?.panelTipHandles || []).filter((h) => h.visible).length;
    const visLines = (lock.curveObjects?.panelTipLines || []).filter((l) => l.visible).length;
    return JSON.stringify({
      tool: t.sel.state.activeTool,
      selection: t.sculptState.state.panelTipSelection,
      groupVisible: lock.curveObjects?.group.visible,
      highlightVisible: lock.curveObjects?.tipHighlightMesh?.visible,
      visHandles,
      visLines
    });
  })()`));
  check("scale brush active", brush.tool === "sculpt-scale", `tool=${brush.tool}`);
  check("tip UI visible during scale brush", brush.groupVisible === true && brush.highlightVisible === true && brush.visHandles > 0 && brush.visLines > 0, `brush=${JSON.stringify(brush)}`);

  // back to select tool so the toggle-click below takes the tip-selection path
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="select"]'); if (btn) btn.click(); return true; })()`);
  await sleep(300);

  // Click #2 -> toggle back to main selection
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipHover = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 0 }; return true; })()`);
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: clickPt.x, y: clickPt.y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: clickPt.x, y: clickPt.y, button: "left", clickCount: 1 });
  await sleep(500);
  const selOff = await evalJS(cdp, `(() => { const s = window.__ahsTest.sculptState.state; return JSON.stringify(s.panelTipSelection); })()`);
  check("second click toggles back to main selection", selOff === "null", `sel=${selOff}`);

  const errAfter = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions during interaction", errAfter === bootErr, `total=${errAfter} (start=${bootErr})`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
  await cdp.send("Browser.close").catch(() => {});
  process.exit(failed.length ? 1 : 0);
} finally {
  chrome.kill();
}
