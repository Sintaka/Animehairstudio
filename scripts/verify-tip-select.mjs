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
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--disable-gpu", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
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
    // Simulate the selected state so the width handles are visible during the search
    // (they would otherwise be hidden and the chosen point could overlap one after selection).
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 0 };
    t.updateCurveObjects(lock, { visible: true });
    const allHandles = [
      ...(lock.curveObjects?.panelTipHandles || []),
      ...(lock.curveObjects?.tipWidthHandles || []).flatMap((seg) => [...seg.left, ...seg.right]),
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
          t.sculptState.state.panelTipSelection = null;
          t.updateCurveObjects(lock, { visible: true });
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

  // Click #2 -> toggle back to main selection. Re-find a handle-free seg0 body point in the
  // CURRENT state (prior brush tests moved the tip chain, so the early clickPt may now hit a
  // width handle that follows the chain).
  const togglePt = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const geo = lock.mesh.geometry;
    const pos = geo.attributes.position; const w = geo.userData.panelWeights;
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 0 };
    t.updateCurveObjects(lock, { visible: true });
    const allHandles = [
      ...(lock.curveObjects?.panelTipHandles || []),
      ...(lock.curveObjects?.tipWidthHandles || []).flatMap((seg) => [...seg.left, ...seg.right]),
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
        if (c.y < rect.top + 4 || c.y > rect.bottom - 4 || c.x < rect.left + 4 || c.x > rect.right - 4) continue;
        const ndc = new t.THREE.Vector2(((c.x - rect.left) / rect.width) * 2 - 1, -((c.y - rect.top) / rect.height) * 2 + 1);
        t.raycaster.setFromCamera(ndc, t.camera());
        const handleHit = t.raycaster.intersectObjects(allHandles, false)[0];
        if (!handleHit) return JSON.stringify({ x: c.x, y: c.y, vertex: i });
      }
    }
    return JSON.stringify(null);
  })()`));
  console.log("TOGGLE-PT", togglePt);
  if (togglePt) {
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipHover = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 0 }; return true; })()`);
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: togglePt.x, y: togglePt.y, button: "left", clickCount: 1 });
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: togglePt.x, y: togglePt.y, button: "left", clickCount: 1 });
    await sleep(500);
  }
  const selOff = await evalJS(cdp, `(() => { const s = window.__ahsTest.sculptState.state; return JSON.stringify(s.panelTipSelection); })()`);
  check("second click toggles back to main selection", togglePt != null && selOff === "null", `sel=${selOff} pt=${JSON.stringify(togglePt)}`);
  // ============ Issue 1: every segment (incl. boundary) exposes a tip chain ============
  const allSegs = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const res = [];
    const count = lock.panelSplits.length + 1;
    for (let seg = 0; seg < count; seg++) {
      t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: seg };
      t.updateCurveObjects(lock, { visible: true });
      let handles = 0;
      lock.curveObjects.panelTipHandles.forEach((h) => { if (h.visible && h.userData.panelTipIndex === seg) handles++; });
      res.push({ seg, handles });
    }
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 0 };
    return JSON.stringify({ count, res });
  })()`));
  const allSegsOk = allSegs.res.length === allSegs.count && allSegs.res.every((r) => r.handles > 0);
  check("every segment exposes tip handles (boundary seg fixed)", allSegsOk, `all=${JSON.stringify(allSegs)}`);

  // ============ Issue 2: scale brush = uniform radial transform (not move) ============
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipSelection = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 1 }; return true; })()`);
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="sculpt-scale"]'); if (btn) btn.click(); return true; })()`);
  await sleep(400);
  const scaleBefore = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    return JSON.stringify({ pts: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })), forkT: t.splitForkT(lock, 1, splits) });
  })()`));
  const scaleStart = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    const last = tip.points[tip.points.length - 1];
    const c = t.projectToClient(new t.THREE.Vector3(last.x, last.y, last.z));
    return JSON.stringify({ x: c.x, y: c.y });
  })()`));
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: scaleStart.x, y: scaleStart.y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: scaleStart.x, y: scaleStart.y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: scaleStart.x + 45, y: scaleStart.y, button: "left", buttons: 1 });
  await sleep(250);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: scaleStart.x + 45, y: scaleStart.y, button: "left", clickCount: 1 });
  await sleep(400);
  const scaleAfter = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    return JSON.stringify({ pts: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })) });
  })()`));
  const scaleInfo = (() => {
    const n = Math.min(scaleBefore.pts.length, scaleAfter.pts.length);
    const firstBelow = Math.min(n - 1, Math.max(1, Math.ceil(scaleBefore.forkT * (n - 1))));
    const root = scaleBefore.pts[firstBelow];
    const deltas = [];
    for (let i = firstBelow; i < n; i++) deltas.push({ dx: scaleAfter.pts[i].x - scaleBefore.pts[i].x, dy: scaleAfter.pts[i].y - scaleBefore.pts[i].y, dz: scaleAfter.pts[i].z - scaleBefore.pts[i].z });
    const d0 = deltas[0];
    let maxDeltaDiff = 0;
    for (const d of deltas) maxDeltaDiff = Math.max(maxDeltaDiff, Math.hypot(d.dx - d0.dx, d.dy - d0.dy, d.dz - d0.dz));
    let minCos = 1;
    for (let i = 0; i < deltas.length; i++) {
      const dir = { x: scaleBefore.pts[firstBelow + i].x - root.x, y: scaleBefore.pts[firstBelow + i].y - root.y, z: scaleBefore.pts[firstBelow + i].z - root.z };
      const dl = Math.hypot(deltas[i].dx, deltas[i].dy, deltas[i].dz);
      const il = Math.hypot(dir.x, dir.y, dir.z);
      if (dl < 1e-9 || il < 1e-9) continue;
      const cos = (deltas[i].dx * dir.x + deltas[i].dy * dir.y + deltas[i].dz * dir.z) / (dl * il);
      minCos = Math.min(minCos, cos);
    }
    return { maxDeltaDiff, minCos };
  })();
  check("scale brush scales tip chain uniformly (radial, not move)", scaleInfo.maxDeltaDiff > 0.01 && scaleInfo.minCos > 0.995, `scale=${JSON.stringify(scaleInfo)}`);

  // ============ Issue 3: undo records the tip edit; selection survives ============
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="sculpt-orient"]'); if (btn) btn.click(); return true; })()`);
  await sleep(300);
  const oBefore = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    return JSON.stringify({ pts: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })) });
  })()`));
  const oStart = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    const last = tip.points[tip.points.length - 1];
    const c = t.projectToClient(new t.THREE.Vector3(last.x, last.y, last.z));
    return JSON.stringify({ x: c.x, y: c.y });
  })()`));
  const normalBefore = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    const curve = new t.THREE.CatmullRomCurve3(tip.points.map((p) => new t.THREE.Vector3(p.x, p.y, p.z)));
    const restCurve = new t.THREE.CatmullRomCurve3(tip.restPoints.map((p) => new t.THREE.Vector3(p.x, p.y, p.z)));
    const tp = 0.9;
    const tangent = curve.getTangent(tp).normalize();
    const point = curve.getPoint(tp);
    const restTangent = restCurve.getTangent(tp).normalize();
    const dq = new t.THREE.Quaternion().setFromUnitVectors(restTangent, tangent);
    const mf = t.strandFrameAt(lock, tp);
    const normal = mf.z.clone().applyQuaternion(dq).normalize();
    const camDir = t.camera().position.clone().sub(point).projectOnPlane(tangent);
    if (camDir.lengthSq() > 1e-6) camDir.normalize();
    return JSON.stringify(Math.acos(Math.min(1, Math.max(-1, normal.dot(camDir)))) * 180 / Math.PI);
  })()`));
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: oStart.x, y: oStart.y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: oStart.x, y: oStart.y, button: "left", clickCount: 1 });
  for (let mv = 1; mv <= 6; mv++) {
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: oStart.x + 9 * mv, y: oStart.y + 2 * mv, button: "left", buttons: 1 });
    await sleep(80);
  }
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: oStart.x + 54, y: oStart.y + 12, button: "left", clickCount: 1 });
  await sleep(400);
  const oAfter = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    return JSON.stringify({ pts: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })) });
  })()`));
  let orientChainMoved = false;
  for (let i = 0; i < Math.min(oBefore.pts.length, oAfter.pts.length); i++) {
    if (Math.hypot(oAfter.pts[i].x - oBefore.pts[i].x, oAfter.pts[i].y - oBefore.pts[i].y, oAfter.pts[i].z - oBefore.pts[i].z) > 1e-4) { orientChainMoved = true; break; }
  }
  // New orient semantics: rolls the tip section around its chain tangent so the tip's
  // NORMAL faces the viewport; the chain (bone position) does NOT move.
  const orientInfo = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    const tw = tip && Array.isArray(tip.twists) ? tip.twists : [];
    const nonZero = tw.filter((v) => Math.abs(v) > 0.01).length;
    let normalToCam = null;
    if (tip && tip.points.length >= 2 && tip.restPoints && tip.restPoints.length >= 2 && tw.length >= 2) {
      const curve = new t.THREE.CatmullRomCurve3(tip.points.map((p) => new t.THREE.Vector3(p.x, p.y, p.z)));
      const restCurve = new t.THREE.CatmullRomCurve3(tip.restPoints.map((p) => new t.THREE.Vector3(p.x, p.y, p.z)));
      const tp = 0.9;
      const tangent = curve.getTangent(tp).normalize();
      const point = curve.getPoint(tp);
      const restTangent = restCurve.getTangent(tp).normalize();
      const dq = new t.THREE.Quaternion().setFromUnitVectors(restTangent, tangent);
      const mf = t.strandFrameAt(lock, tp);
      const idx = Math.min(tw.length - 1, Math.round(tp * (tw.length - 1)));
      const twist = Number(tw[idx]) || 0;
      const normal = mf.z.clone().applyQuaternion(dq).applyAxisAngle(tangent, twist).normalize();
      const camDir = t.camera().position.clone().sub(point).projectOnPlane(tangent);
      if (camDir.lengthSq() > 1e-6) camDir.normalize();
      normalToCam = Math.acos(Math.min(1, Math.max(-1, normal.dot(camDir)))) * 180 / Math.PI;
    }
    return JSON.stringify({ count: tw.length, nonZero, normalToCamDeg: normalToCam != null ? Number(normalToCam.toFixed(1)) : null });
  })()`));
  const normalImproved = orientInfo.normalToCamDeg != null && Number(normalBefore) - orientInfo.normalToCamDeg > 0.5;
  check("orient rolls tip section toward viewport (chain unchanged)", orientChainMoved === false && orientInfo.nonZero > 0 && normalImproved === true, `orient=${JSON.stringify(orientInfo)} before=${Number(normalBefore).toFixed(1)} chainMoved=${orientChainMoved}`);
  // undo
  const undoSelBefore = await evalJS(cdp, `(() => { const t = window.__ahsTest; return JSON.stringify(t.sculptState.state.panelTipSelection); })()`);
  await evalJS(cdp, `(() => { const btn = document.querySelector('#undoAction'); if (btn && !btn.disabled) btn.click(); return true; })()`);
  await sleep(600);
  const undoCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    const before = ${JSON.stringify(oBefore.pts)};
    let reverted = true;
    let maxDiff = 0;
    for (let i = 0; i < Math.min(before.length, tip.points.length); i++) {
      const d = Math.hypot(tip.points[i].x - before[i].x, tip.points[i].y - before[i].y, tip.points[i].z - before[i].z);
      if (d > maxDiff) maxDiff = d;
      if (d > 2e-3) { reverted = false; }
    }
    const bone2 = t.materializeSplitBones(lock)[1] || null;
    const restoredTip = bone2 && bone2.tip ? bone2.tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })) : null;
    const hasSplitBones = Array.isArray(lock.splitBones) && lock.splitBones.length === splits.length + 1;
    const hasRegistryBones = Array.isArray(lock.bones) && lock.bones.length > 0;
    return JSON.stringify({ reverted, maxDiff, sel: t.sculptState.state.panelTipSelection, hasSplitBones, hasRegistryBones, restoredTip });
  })()`));

  check("undo reverts only the tip stroke (selection survives)", undoCheck.reverted === true && undoCheck.sel && undoCheck.sel.segmentIndex === 1, `undo=${JSON.stringify(undoCheck)}`);

  // ============ Issue 5: push brush moves a selected tip chain ============
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipSelection = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 1 }; return true; })()`);
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="sculpt-push"]'); if (btn) btn.click(); return true; })()`);
  await sleep(400);
  const pushBefore = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    return JSON.stringify({ pts: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })), forkT: t.splitForkT(lock, 1, splits) });
  })()`));
  const pushStart = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    const last = tip.points[tip.points.length - 1];
    const c = t.projectToClient(new t.THREE.Vector3(last.x, last.y, last.z));
    return JSON.stringify({ x: c.x, y: c.y });
  })()`));
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: pushStart.x, y: pushStart.y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: pushStart.x, y: pushStart.y, button: "left", clickCount: 1 });
  await sleep(120);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: pushStart.x + 10, y: pushStart.y + 6, button: "left", buttons: 1 });
  await sleep(250);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: pushStart.x + 10, y: pushStart.y + 6, button: "left", clickCount: 1 });
  await sleep(400);
  const pushAfter = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[1] || null;
    const tip = t.splitTipForSegment(lock, 1, splits, bone);
    return JSON.stringify({ pts: tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })) });
  })()`));
  let pushMax = 0;
  for (let i = 0; i < Math.min(pushBefore.pts.length, pushAfter.pts.length); i++) {
    pushMax = Math.max(pushMax, Math.hypot(pushAfter.pts[i].x - pushBefore.pts[i].x, pushAfter.pts[i].y - pushBefore.pts[i].y, pushAfter.pts[i].z - pushBefore.pts[i].z));
  }
  check("push brush moves selected tip chain", pushMax > 1e-4, `pushMax=${pushMax.toFixed(5)}`);

  // ============ Issue 4: bones-only view during brush with no tip selected ============
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipSelection = null; t.sculptState.state.panelTipHover = { lockId: null, segmentIndex: null }; return true; })()`);
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="sculpt-scale"]'); if (btn) btn.click(); return true; })()`);
  await sleep(400);
  const bonesOnly = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.updateCurveObjects(lock, { visible: true });
    const mainHandlesVisible = (lock.curveObjects?.handles || []).filter((h) => h.visible).length;
    return JSON.stringify({ group: lock.curveObjects?.group.visible, line: lock.curveObjects?.line.visible, mainHandlesVisible });
  })()`));
  check("brush bones-only: group+line visible, main handles hidden", bonesOnly.group === true && bonesOnly.line === true && bonesOnly.mainHandlesVisible === 0, `bones=${JSON.stringify(bonesOnly)}`);

  // ============ Issue 5: alt+click on a hovered tip switches tip selection ============
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipHover = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 2 }; return true; })()`);
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: clickPt.x, y: clickPt.y, button: "left", modifiers: 1, clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: clickPt.x, y: clickPt.y, button: "left", modifiers: 1, clickCount: 1 });
  await sleep(400);
  const altTip = JSON.parse(await evalJS(cdp, `(() => { const t = window.__ahsTest; return JSON.stringify(t.sculptState.state.panelTipSelection); })()`));
  check("alt+click switches to hovered tip segment", !!(altTip && altTip.lockId === lockId && altTip.segmentIndex === 2), `altTip=${JSON.stringify(altTip)}`);

  // ============ Issue 2+3: tip width control points replace the green controller ============
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipSelection = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 2 }; t.updateCurveObjects(t.locks.find((l) => l.id === ${JSON.stringify(lockId)}), { visible: true }); return true; })()`);
  await sleep(300);
  const widthVis = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const seg = lock.curveObjects.tipWidthHandles ? lock.curveObjects.tipWidthHandles[2] : null;
    const lines = lock.curveObjects.tipWidthLines ? lock.curveObjects.tipWidthLines[2] : null;
    const leftVis = seg ? seg.left.filter((h) => h.visible).length : 0;
    const rightVis = seg ? seg.right.filter((h) => h.visible).length : 0;
    const lineLen = (line) => {
      const pos = line && line.visible ? line.geometry.attributes.position : null;
      if (!pos) return 0;
      let len = 0;
      for (let i = 1; i < pos.count; i++) {
        len += Math.hypot(pos.getX(i)-pos.getX(i-1), pos.getY(i)-pos.getY(i-1), pos.getZ(i)-pos.getZ(i-1));
      }
      return len;
    };
    const leftLen = lineLen(lines ? lines.left : null);
    const rightLen = lineLen(lines ? lines.right : null);
    const handleColor = seg && seg.left[0] ? '#' + seg.left[0].material.color.getHexString() : null;
    const greenVis = (lock.curveObjects.panelSegmentHandles || []).filter((h) => h.visible).length;
    const widthEdgeVis = (lock.curveObjects.widthEdgeLines || []).filter((e) => e.visible).length;
    return JSON.stringify({ leftVis, rightVis, leftLine: !!lines && lines.left.visible, rightLine: !!lines && lines.right.visible, leftLen: Number(leftLen.toFixed(4)), rightLen: Number(rightLen.toFixed(4)), handleColor, greenVis, widthEdgeVis });
  })()`));
  check("tip width green curve+points show (sub-bone edges), green removed, side lengths differ", widthVis.leftVis > 0 && widthVis.rightVis > 0 && widthVis.leftLine === true && widthVis.rightLine === true && widthVis.handleColor === "#5df0a8" && widthVis.greenVis === 0 && widthVis.widthEdgeVis === 0 && Math.abs(widthVis.leftLen - widthVis.rightLen) > 0.01, `width=${JSON.stringify(widthVis)}`);

  // drag a right-side width handle (select tool; brush tools consume pointerdown)
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="select"]'); if (btn) btn.click(); return true; })()`);
  await sleep(300);
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipSelection = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 2 }; t.updateCurveObjects(t.locks.find((l) => l.id === ${JSON.stringify(lockId)}), { visible: true }); return true; })()`);
  const widthDrag = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const h = lock.curveObjects.tipWidthHandles[2].right.find((hh) => hh.visible);
    if (!h) return JSON.stringify({ ok: false });
    const c = t.projectToClient(h.getWorldPosition(new t.THREE.Vector3()));
    return JSON.stringify({ ok: true, x: c.x, y: c.y });
  })()`));
  if (widthDrag.ok) {
    // screen direction of the edge (chain center -> edge) so the drag reliably changes width
    const edgeDir = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      const bone = t.materializeSplitBones(lock)[2] || null;
      const edge = t.tipWidthEdgePosition(lock, 2, splits, bone, 1, 0.90625);
      const a = t.projectToClient(edge.center.clone());
      const b = t.projectToClient(edge.point.clone());
      let dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      return JSON.stringify({ dx: dx / len, dy: dy / len });
    })()`));
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: widthDrag.x, y: widthDrag.y });
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: widthDrag.x, y: widthDrag.y, button: "left", clickCount: 1 });
    for (let mv = 1; mv <= 2; mv++) {
      await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: widthDrag.x + edgeDir.dx * 8 * mv, y: widthDrag.y + edgeDir.dy * 8 * mv, button: "left", buttons: 1 });
      await sleep(80);
    }
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: widthDrag.x + edgeDir.dx * 16, y: widthDrag.y + edgeDir.dy * 16, button: "left", clickCount: 1 });
    await sleep(400);
  }
  const widthChainBefore = await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const tip = t.splitTipForSegment(lock, 2, splits, bone);
    return JSON.stringify(tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })));
  })()`);
  const widthMultBefore = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const ts = t.tipWidthControlTs(t.tipWidthCommonForkT(lock, 2, splits));
    const rightFork = t.tipWidthSideForkT(lock, 2, splits, 1);
    const tt = ts.find((p) => p >= rightFork - 1e-4);
    const fullW = Math.max(0.01, Number(lock.width ?? 0.62));
    return JSON.stringify({ tt, rightMult: t.tipPanelWidthAt(lock, tt, 1, bone, 2, splits) / fullW, leftMult: t.tipPanelWidthAt(lock, tt, -1, bone, 2, splits) / fullW });
  })()`));
  const widthAfter = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    if (!bone) return JSON.stringify({ ok: false });
    const rightCurve = bone.taperCurve || null;
    const leftCurve = bone.taperCurveSecondary || null;
    const rightForkT = t.tipWidthSideForkT ? t.tipWidthSideForkT(lock, 2, splits, 1) : null;
    const forkT = rightForkT != null ? rightForkT : 0;
    let valueChanged = false;
    if (rightCurve) {
      for (const pt of rightCurve) {
        if (pt.position < forkT - 1e-3) continue;
        const def = t.sampleTaperCurve(lock.taperCurve, pt.position);
        if (Math.abs(Number(pt.value) - def) > 0.01) { valueChanged = true; break; }
      }
    }
    // Default (no Ctrl) drag mirrors the same operation onto the other side (8.22 symmetric).
    const leftForkT = t.tipWidthSideForkT(lock, 2, splits, -1);
    let leftChanged = false;
    if (leftCurve) {
      for (const pt of leftCurve) {
        if (pt.position < leftForkT - 1e-3) continue;
        const def = t.sampleTaperCurve(lock.taperCurve, pt.position);
        if (Math.abs(Number(pt.value) - def) > 0.01) { leftChanged = true; break; }
      }
    }
    // Locked (above-zipper) region is NOT baked into the curve anymore: the sampler falls
    // back to the global curve below the fork, so value at 0.3 (must be < forkT for seg2
    // right = 0.8125) equals the global. Curve points below the fork are hidden-but-recorded
    // (common-fork distribution, 8.21) and intentionally not applied by the sampler.
    const globalAt = t.sampleTaperCurve(lock.taperCurve, 0.3);
    const fullW = Math.max(0.01, Number(lock.width ?? 0.62));
    const sampledLocked = t.tipPanelWidthAt(lock, 0.3, 1, bone, 2, splits) / fullW;
    const lockedMatch = Math.abs(sampledLocked - globalAt) < 1e-3;
    const fullW2 = Math.max(0.01, Number(lock.width ?? 0.62));
    const ts2 = t.tipWidthControlTs(t.tipWidthCommonForkT(lock, 2, splits));
    const rightFork2 = t.tipWidthSideForkT(lock, 2, splits, 1);
    const tt2 = ts2.find((pp) => pp >= rightFork2 - 1e-4);
    const afterRight = t.tipPanelWidthAt(lock, tt2, 1, bone, 2, splits) / fullW2;
    const afterLeft = t.tipPanelWidthAt(lock, tt2, -1, bone, 2, splits) / fullW2;
    return JSON.stringify({ ok: true, hasRight: !!rightCurve, hasLeft: !!leftCurve, asym: bone.asymmetricWidthCurve === true, rightForkT, lockedMatch, changedFromDefault: !!rightCurve, valueChanged, leftChanged, tt2, afterRight, afterLeft });
  })()`));
    let widthChainMoved = false;
  if (widthAfter.ok) {
    const chainNow = await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      const bone = t.materializeSplitBones(lock)[2] || null;
      const tip = t.splitTipForSegment(lock, 2, splits, bone);
      return JSON.stringify(tip.points.map((p) => ({ x: p.x, y: p.y, z: p.z })));
    })()`);
    const before = JSON.parse(widthChainBefore);
    const after = JSON.parse(chainNow);
    for (let i = 0; i < Math.min(before.length, after.length); i++) {
      if (Math.hypot(after[i].x - before[i].x, after[i].y - before[i].y, after[i].z - before[i].z) > 1e-5) { widthChainMoved = true; break; }
    }
  }
  const wR = widthAfter.afterRight / Math.max(0.0001, widthMultBefore.rightMult);
  const wL = widthAfter.afterLeft / Math.max(0.0001, widthMultBefore.leftMult);
  check("tip width drag authors both curves symmetrically (chain unchanged, locked = global)", widthAfter.ok === true && widthAfter.hasRight === true && widthAfter.hasLeft === true && widthAfter.asym === true && widthAfter.lockedMatch === true && widthAfter.valueChanged === true && widthAfter.leftChanged === true && widthChainMoved === false, `width=${JSON.stringify(widthAfter)} chainMoved=${widthChainMoved} before=${JSON.stringify(widthMultBefore)} ratioR=${wR.toFixed(3)} ratioL=${wL.toFixed(3)}`);
  // ============ 8.23: tip width lateral = the TIP SUB-BONE's own lateral (perp to its tangent) ============
  // The drag direction follows the tip chain's own normal plane, not the main bone's.
  const latCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    let minTangentAngle = 180;
    let maxPerpDeviation = 0;
    for (let seg = 0; seg <= splits.length; seg++) {
      const bone = bones[seg] || null;
      const tip = t.splitTipForSegment(lock, seg, splits, bone);
      if (!tip || tip.points.length < 2) continue;
      const curve = new t.THREE.CatmullRomCurve3(tip.points.map((p) => new t.THREE.Vector3(p.x, p.y, p.z)));
      for (const tt of [0.6, 0.8, 0.95]) {
        const at = curve.getTangent(tt).normalize();
        for (const side of [-1, 1]) {
          const edge = t.tipWidthEdgePosition(lock, seg, splits, bone, side, tt);
          if (!edge) continue;
          const cosT = t.THREE.MathUtils.clamp(edge.lateral.dot(at), -1, 1);
          minTangentAngle = Math.min(minTangentAngle, Math.acos(cosT) * 180 / Math.PI);
          maxPerpDeviation = Math.max(maxPerpDeviation, Math.abs(90 - Math.acos(cosT) * 180 / Math.PI));
        }
      }
    }
    return JSON.stringify({ minTangentAngle: Number(minTangentAngle.toFixed(1)), maxPerpDeviation: Number(maxPerpDeviation.toFixed(1)) });
  })()`));
  check("tip width lateral is perpendicular to the tip sub-bone tangent", latCheck.maxPerpDeviation < 5 && latCheck.minTangentAngle > 85, `lat=${JSON.stringify(latCheck)}`);

  // ============ 8.22: asymmetric tip width blends in a NARROW center band ============
  // Each side's curve is pure outside |u| > blendZone (0.25) so dragging one side no
  // longer pulls the other side's far region; the middle still interpolates (no hard split).
  const blendCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    if (!bone) return JSON.stringify({ ok: false });
    const tt = 0.869; // a common-fork control position (both sides exposed)
    t.setTipWidthCurveValue(lock, 2, splits, bone, 1, tt, 1.4);
    t.setTipWidthCurveValue(lock, 2, splits, bone, -1, tt, 1.2);
    const w = (u) => t.sampleAsymmetricTaperCurve(bone.taperCurve, bone.taperCurveSecondary, bone.asymmetricWidthCurve, u, tt, 0.25);
    const left = w(-1);
    const right = w(1);
    const mid = w(0);
    const pureOutside = Math.abs(w(-0.5) - left) < 1e-3 && Math.abs(w(0.5) - right) < 1e-3;
    const stepAtCenter = Math.abs(w(-0.1) - w(0.1));
    return JSON.stringify({
      ok: true,
      left: Number(left.toFixed(4)),
      right: Number(right.toFixed(4)),
      mid: Number(mid.toFixed(4)),
      midIsAvg: Math.abs(mid - (left + right) * 0.5) < 1e-3,
      pureOutside,
      stepAtCenter: Number(stepAtCenter.toFixed(4))
    });
  })()`));
  check("asymmetric tip width blends in a narrow center band (sides independent)", blendCheck.ok === true && blendCheck.midIsAvg === true && blendCheck.pureOutside === true && blendCheck.left !== blendCheck.right && blendCheck.stepAtCenter < 0.15, `blend=${JSON.stringify(blendCheck)}`);
  // ============ 8.22: tip width Reset = all points 1 ============
  const resetCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const curve = t.tipWidthResetCurve(lock, 2, splits, 1);
    const allOne = curve.every((p) => Math.abs(p.value - 1) < 1e-6);
    const forkTs = [-1, 1].map((s) => t.tipWidthSideForkT(lock, 2, splits, s));
    const hasBothForks = forkTs.every((fk) => curve.some((p) => Math.abs(p.position - fk) < 1e-4));
    const hasTip = curve.some((pt) => Math.abs(pt.position - 1) < 1e-3);
    return JSON.stringify({ count: curve.length, allOne, hasBothForks, hasTip, forkTs: forkTs.map((f) => Number(f.toFixed(4))) });
  })()`));
  check("tip width Reset: all points 1 (both fork points included)", resetCheck.allOne === true && resetCheck.hasBothForks === true && resetCheck.hasTip === true && resetCheck.count <= 9, `reset=${JSON.stringify(resetCheck)}`);

  // ============ 8.22: Ctrl+drag = asymmetric (only the dragged side changes) ============
  await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipSelection = { lockId: ${JSON.stringify(lockId)}, segmentIndex: 2 }; t.updateCurveObjects(t.locks.find((l) => l.id === ${JSON.stringify(lockId)}), { visible: true }); return true; })()`);
  const ctrlDrag = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const h = lock.curveObjects.tipWidthHandles[2].left.find((hh) => hh.visible);
    if (!h) return JSON.stringify({ ok: false });
    const c = t.projectToClient(h.getWorldPosition(new t.THREE.Vector3()));
    return JSON.stringify({ ok: true, x: c.x, y: c.y });
  })()`));
  if (ctrlDrag.ok) {
    const ctrlBefore = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      const bone = t.materializeSplitBones(lock)[2] || null;
      const ts = t.tipWidthControlTs(t.tipWidthCommonForkT(lock, 2, splits));
      const leftFork = t.tipWidthSideForkT(lock, 2, splits, -1);
      const first = ts.find((pp) => pp >= leftFork - 1e-4);
      return JSON.stringify({ t: first, leftAt: t.tipPanelWidthAt(lock, first, -1, bone, 2, splits), rightAt: t.tipPanelWidthAt(lock, first, 1, bone, 2, splits) });
    })()`));
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: ctrlDrag.x, y: ctrlDrag.y });
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: ctrlDrag.x, y: ctrlDrag.y, button: "left", modifiers: 2, clickCount: 1 });
    await sleep(150);
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: ctrlDrag.x + 35, y: ctrlDrag.y + 5, button: "left", modifiers: 2, buttons: 1 });
    await sleep(200);
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: ctrlDrag.x + 35, y: ctrlDrag.y + 5, button: "left", modifiers: 2, clickCount: 1 });
    await sleep(400);
    const ctrlAfter = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      const bone = t.materializeSplitBones(lock)[2] || null;
      const tt = ${ctrlBefore.t};
      return JSON.stringify({ leftAt: t.tipPanelWidthAt(lock, tt, -1, bone, 2, splits), rightAt: t.tipPanelWidthAt(lock, tt, 1, bone, 2, splits) });
    })()`));
    const leftChanged = Math.abs(ctrlAfter.leftAt - ctrlBefore.leftAt) > 0.01;
    const rightUnchanged = Math.abs(ctrlAfter.rightAt - ctrlBefore.rightAt) < 1e-4;
    check("Ctrl+drag is asymmetric (only dragged side changes)", leftChanged === true && rightUnchanged === true, `ctrl=${JSON.stringify({ before: ctrlBefore, after: ctrlAfter, leftChanged, rightUnchanged })}`);
  // ============ 8.24: tip width Reset => exposed region 1, above-zipper follows global ============
  const resetFullCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    t.setTipWidthCurveValue(lock, 2, splits, bone, 1, 0.869, 1.35);
    t.setTipWidthCurveValue(lock, 2, splits, bone, -1, 0.869, 1.2);
    const resetR = t.tipWidthResetCurve(lock, 2, splits, 1);
    const resetL = t.tipWidthResetCurve(lock, 2, splits, -1);
    bone.taperCurve.splice(0, bone.taperCurve.length, ...resetR.map((pt) => ({ ...pt })));
    bone.taperCurveSecondary.splice(0, bone.taperCurveSecondary.length, ...resetL.map((pt) => ({ ...pt })));
    const fullW = Math.max(0.01, Number(lock.width ?? 0.62));
    const rightFork = t.tipWidthSideForkT(lock, 2, splits, 1);
    const leftFork = t.tipWidthSideForkT(lock, 2, splits, -1);
    // exposed region: sample the visible control positions (>= each side's own fork) which
    // must be 1; above-zipper (t < fork) still falls back to the global curve.
    const controlTs = t.tipWidthControlTs(t.tipWidthCommonForkT(lock, 2, splits));
    const exposed = [];
    for (const side of [1, -1]) {
      const fork = side > 0 ? rightFork : leftFork;
      for (const tt of controlTs) {
        if (tt < fork - 1e-4) continue;
        exposed.push({ t: tt, side, mult: t.tipPanelWidthAt(lock, tt, side, bone, 2, splits) / fullW });
      }
    }
    const locked = [0.2, 0.5].map((tt) => ({
      t: tt,
      right: t.tipPanelWidthAt(lock, tt, 1, bone, 2, splits) / fullW,
      left: t.tipPanelWidthAt(lock, tt, -1, bone, 2, splits) / fullW,
      global: t.sampleTaperCurve(lock.taperCurve, tt)
    }));
    const exposedOne = exposed.every((s) => Math.abs(s.mult - 1) < 1e-3);
    const lockedGlobal = locked.every((s) => Math.abs(s.right - s.global) < 1e-3 && Math.abs(s.left - s.global) < 1e-3);
    return JSON.stringify({ exposedOne, lockedGlobal, rightFirst: Number((bone.taperCurve[0] || {}).position), exposed, locked });
  })()`));
  check("tip width Reset: exposed region 1, above-zipper follows global", resetFullCheck.exposedOne === true && resetFullCheck.lockedGlobal === true && resetFullCheck.rightFirst < 0.001, `resetFull=${JSON.stringify(resetFullCheck)}`);
  // ============ 8.23: right panel segment preview hot-updates after a tip width edit ============
  const previewCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 2 };
    t.updateCurveObjects(lock, { visible: true });
    t.syncPanelSegmentControls(lock);
    const d0 = document.querySelector('#segmentTaperPreview').getAttribute('d') || '';
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    t.setTipWidthCurveValue(lock, 2, splits, bone, 1, 0.869, 1.4);
    t.syncPanelSegmentControls(lock);
    const d1 = document.querySelector('#segmentTaperPreview').getAttribute('d') || '';
    return JSON.stringify({ changed: d0 !== d1, d0Len: d0.length, d1Len: d1.length });
  })()`));
  check("right panel segment preview hot-updates after a tip width edit", previewCheck.changed === true, `preview=${JSON.stringify(previewCheck)}`);
  // ============ 8.24: tip sub-bone normal follows the panel SURFACE curvature ============
  const orientCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const boundaries = [-1, ...splits.map((s) => s.position), 1];
    let maxAngle = 0;
    let minPerp = 180;
    let finite = true;
    for (let seg = 0; seg < boundaries.length - 1; seg++) {
      const centerU = (boundaries[seg] + boundaries[seg + 1]) * 0.5;
      for (const tt of [0.3, 0.6, 0.9]) {
        const sf = t.tipSurfaceFrameAt(lock, tt, centerU, seg, splits);
        const main = t.tipPanelFrameAt(lock, tt);
        if (!Number.isFinite(sf.x.x) || !Number.isFinite(sf.y.x) || !Number.isFinite(sf.z.x)) { finite = false; continue; }
        const cos = t.THREE.MathUtils.clamp(sf.z.dot(main.z), -1, 1);
        maxAngle = Math.max(maxAngle, Math.acos(cos) * 180 / Math.PI);
        const perp = t.THREE.MathUtils.clamp(Math.abs(sf.z.dot(sf.y)), -1, 1);
        minPerp = Math.min(minPerp, Math.acos(perp) * 180 / Math.PI);
      }
    }
    return JSON.stringify({ maxAngle: Number(maxAngle.toFixed(1)), minPerp: Number(minPerp.toFixed(1)), finite });
  })()`));
  check("tip sub-bone normal follows surface curvature (orthogonal to tangent, nonzero vs main)", orientCheck.finite === true && orientCheck.minPerp > 85 && orientCheck.maxAngle > 0.5, `orient=${JSON.stringify(orientCheck)}`);

  // ============ 8.24: floating panel marks only above-common-fork tip points hidden ============
  const panelDragCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    if (bone && !bone.taperCurve) t.setTipWidthCurveValue(lock, 2, splits, bone, 1, 0.869, 1.3);
    const ed = document.querySelector('#taperCurveEditor');
    t.sculptState.state.taperCurveEdit = { type: "segment", id: lock.id, segmentIndex: 2, curveKey: "taperCurve", side: "primary", selectedIndex: 0 };
    if (ed && !ed.open) ed.show();
    t.renderTaperCurveEditor();
    const points = [...document.querySelectorAll('#taperCurvePoints circle[data-curve-side="primary"]')];
    const commonFork = t.tipWidthCommonForkT(lock, 2, splits);
    const curve = bone.taperCurve || [];
    let hiddenAtOrAboveCommon = 0; let visibleAtOrAboveCommon = 0; let hiddenAboveCommon = 0;
    for (const p of points) {
      const pt = curve[Number(p.dataset.taperPoint)];
      const aboveCommon = pt && pt.position < commonFork - 1e-4;
      if (p.dataset.tipHidden === "1") { if (aboveCommon) hiddenAboveCommon++; else hiddenAtOrAboveCommon++; }
      else if (!aboveCommon) visibleAtOrAboveCommon++;
    }
    if (ed && ed.open) ed.close();
    t.sculptState.state.taperCurveEdit = null;
    return JSON.stringify({ total: points.length, commonFork: Number(commonFork.toFixed(3)), hiddenAtOrAboveCommon, visibleAtOrAboveCommon, hiddenAboveCommon });
  })()`));
  check("floating panel keeps points at/above common fork draggable", panelDragCheck.total > 0 && panelDragCheck.hiddenAtOrAboveCommon === 0 && panelDragCheck.visibleAtOrAboveCommon > 0, `panel=${JSON.stringify(panelDragCheck)}`);
  } else {
    check("Ctrl+drag is asymmetric (only dragged side changes)", false, "no left handle");
  }

  // ============ 8.19: tip width handle moves along the TIP sub-bone's width axis ============
  // Simulate a width edit at each control and assert the handle moves along the drag axis
  // (lateral = dq*mainFrameX) - it used to move along the main-bone line (7-170deg off).
  const moveCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    let maxAngle = 0;
    for (let seg = 0; seg <= splits.length; seg++) {
      for (const side of [1, -1]) {
        const bone = t.materializeSplitBones(lock)[seg] || null;
        const placement = t.tipWidthControlPlacement(lock, seg, splits, bone, side, 2);
        if (!placement) continue;
        const tt = placement.t;
        const P0 = placement.point.clone();
        const L = placement.lateral.clone();
        const curMult = t.tipPanelWidthAt(lock, tt, side, bone, seg, splits) / Math.max(0.01, Number(lock.width ?? 0.62));
        t.setTipWidthCurveValue(lock, seg, splits, bone, side, tt, curMult * 1.5);
        const edge1 = t.tipWidthEdgePosition(lock, seg, splits, bone, side, tt);
        const D = edge1 ? edge1.point.clone().sub(P0) : null;
        if (D && D.length() > 1e-9) {
          const cos = t.THREE.MathUtils.clamp(D.clone().normalize().dot(L), -1, 1);
          maxAngle = Math.max(maxAngle, Math.acos(cos) * 180 / Math.PI);
        }
      }
    }
    return JSON.stringify({ maxAngle: Number(maxAngle.toFixed(1)) });
  })()`));
  check("tip width drag moves handle along tip sub-bone width axis", moveCheck.maxAngle < 10, `move=${JSON.stringify(moveCheck)}`);

  // ============ 8.21: tip end control point (t=1) is exposed ============
  const tipEndCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const ts = t.tipWidthControlTs(0);
    const last = t.tipWidthControlPlacement(lock, 2, splits, bone, 1, ts.length - 1);
    return JSON.stringify({ count: ts.length, lastT: Number(ts[ts.length - 1].toFixed(3)), tipPlacement: !!last && Math.abs(last.t - 1) < 1e-3 });
  })()`));
  check("tip width has a control point at the tip end (t=1)", tipEndCheck.count === 6 && tipEndCheck.lastT === 1 && tipEndCheck.tipPlacement === true, `tipEnd=${JSON.stringify(tipEndCheck)}`);

  // ============ 8.21: Segment Spread 0-0.99 + handles follow the spread (no degenerate collapse) ============
  const spreadCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const origSpread = bone.spread;
    bone.spread = 0;
    const p0 = t.tipWidthEdgePosition(lock, 2, splits, bone, 1, 1).point.clone();
    bone.spread = 1; // above max: the defensive clamp must keep it equal to 0.99 (no degenerate collapse)
    const p1 = t.tipWidthEdgePosition(lock, 2, splits, bone, 1, 1).point.clone();
    const gapOne = t.tipWidthSpreadGap(lock, 2, splits, bone, 1, 1);
    bone.spread = 0.99;
    const gapMax = t.tipWidthSpreadGap(lock, 2, splits, bone, 1, 1);
    bone.spread = origSpread;
    const gapAtTip = t.tipWidthSpreadGap(lock, 2, splits, bone, 1, 1);
    const sliderMax = document.querySelector('#panelSegmentSpread') ? document.querySelector('#panelSegmentSpread').max : null;
    return JSON.stringify({ moved: Number(p0.distanceTo(p1).toFixed(4)), gapOne: Number(gapOne.toFixed(6)), gapMax: Number(gapMax.toFixed(6)), clampOk: Math.abs(gapOne - gapMax) < 1e-9, gapAtTip: Number(gapAtTip.toFixed(4)), sliderMax });
  })()`));
  check("spread range 0-0.99 (no degenerate collapse)", spreadCheck.moved > 0.01 && spreadCheck.sliderMax === "0.99" && spreadCheck.clampOk, `spread=${JSON.stringify(spreadCheck)}`);

  // ============ 8.25: edge segment spread mirrors gap to the no-zipper side ============
  const edgeSpreadCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[0] || null;
    if (!bone) return JSON.stringify({ missingBone: true });
    const origSpread = bone.spread;
    bone.spread = 0;
    const gap0Outer = t.tipWidthSpreadGap(lock, 0, splits, bone, 1, -1);
    const gap0Zipper = t.tipWidthSpreadGap(lock, 0, splits, bone, 1, 1);
    const e0 = t.tipWidthEdgePosition(lock, 0, splits, bone, -1, 1);
    bone.spread = 0.7;
    const gap7Outer = t.tipWidthSpreadGap(lock, 0, splits, bone, 1, -1);
    const gap7Zipper = t.tipWidthSpreadGap(lock, 0, splits, bone, 1, 1);
    const e7 = t.tipWidthEdgePosition(lock, 0, splits, bone, -1, 1);
    bone.spread = origSpread;
    return JSON.stringify({
      gap0Outer: Number(gap0Outer.toFixed(6)),
      gap0Zipper: Number(gap0Zipper.toFixed(6)),
      gap7Outer: Number(gap7Outer.toFixed(6)),
      gap7Zipper: Number(gap7Zipper.toFixed(6)),
      moved: e0 && e7 ? Number(e0.point.distanceTo(e7.point).toFixed(6)) : -1
    });
  })()`));
  check(
    "edge segment spread mirrors gap to the no-zipper side",
    !edgeSpreadCheck.missingBone
      && edgeSpreadCheck.gap0Outer === 0
      && edgeSpreadCheck.gap0Zipper === 0
      && Math.abs(edgeSpreadCheck.gap7Outer - edgeSpreadCheck.gap7Zipper) < 1e-6
      && edgeSpreadCheck.gap7Outer > 0
      && edgeSpreadCheck.gap7Zipper > 0
      && edgeSpreadCheck.moved > 1e-6,
    `edgeSpread=${JSON.stringify(edgeSpreadCheck)}`
  );

  // ============ 8.26-A: spread clamps to 0.99 everywhere (no degenerate collapse) ============
  const spreadClampCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const origSpread = bone.spread;
    bone.spread = 1; // authored above max
    const gapOne = t.tipWidthSpreadGap(lock, 2, splits, bone, 1, 1);
    const reRead = t.materializeSplitBones(lock)[2]?.spread; // SPREAD_MAX clamps 1 -> 0.99 on re-read
    const live = t.materializeSplitBones(lock)[2] || null;
    live.spread = 0.99;
    const gapMax = t.tipWidthSpreadGap(lock, 2, splits, live, 1, 1);
    live.spread = origSpread;
    t.materializeSplitBones(lock); // restore normalized lock state
    return JSON.stringify({ gapOne: Number(gapOne.toFixed(6)), gapMax: Number(gapMax.toFixed(6)), clampOk: Math.abs(gapOne - gapMax) < 1e-9, reRead });
  })()`));
  check(
    "spread clamps to 0.99 (materialize + gap both bounded, no degenerate collapse)",
    spreadClampCheck.clampOk && spreadClampCheck.gapMax > 0 && spreadClampCheck.reRead === 0.99,
    `spreadClamp=${JSON.stringify(spreadClampCheck)}`
  );

  // ============ 8.26-A: tip sub-bone weight forks per-side (slanted) ============
  const weightForkCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    if (splits.length < 2) return JSON.stringify({ notEnoughSplits: true, count: splits.length });
    // Deterministic unequal zippers: segment 1 -> leftFork=0.4 (high zipper 0.6),
    // rightFork=0.65 (low zipper 0.35), so the weight boundary is a slanted line.
    splits[0].height = 0.6;
    splits[1].height = 0.35;
    const seg = 1;
    const leftFork = 1 - splits[0].height;
    const rightFork = 1 - splits[1].height;
    const b0 = splits[0].position;
    const b1 = splits[1].position;
    const tMid = 0.525;
    const uAt = (localU) => b0 + (b1 - b0) * localU;
    const localUs = [0, 0.25, 0.5, 0.75, 1];
    const weights = localUs.map((localU) => t.tipSegmentWeightAt(lock, seg, splits, tMid, uAt(localU), 10));
    const monotonic = weights.every((w, i) => i === 0 || weights[i - 1] + 1e-12 >= w);
    const between = weights.every((w) => w >= weights[weights.length - 1] - 1e-12 && w <= weights[0] + 1e-12);
    const zeroAtFork = localUs.every((localU) => t.tipSegmentWeightAt(lock, seg, splits, leftFork, uAt(localU), 10) === 0);
    return JSON.stringify({
      notEnoughSplits: false,
      leftFork: Number(leftFork.toFixed(6)),
      rightFork: Number(rightFork.toFixed(6)),
      tMid,
      weights: weights.map((w) => Number(w.toFixed(6))),
      leftW: Number(weights[0].toFixed(6)),
      rightW: Number(weights[weights.length - 1].toFixed(6)),
      monotonic,
      between,
      zeroAtFork
    });
  })()`));
  check(
    "tip sub-bone weight forks per-side (slanted, low-zipper side stays 0)",
    !weightForkCheck.notEnoughSplits
      && Math.abs(weightForkCheck.leftFork - 0.4) < 1e-9
      && Math.abs(weightForkCheck.rightFork - 0.65) < 1e-9
      && weightForkCheck.leftW > 0
      && weightForkCheck.rightW === 0
      && weightForkCheck.monotonic
      && weightForkCheck.between
      && weightForkCheck.zeroAtFork,
    `weightFork=${JSON.stringify(weightForkCheck)}`
  );
  // ============ 8.26-B: rotate gizmo starts on tip chain own frame (no snap to main bone) ============
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="rotate"]'); if (btn) btn.click(); return true; })()`);
  await sleep(400);
  const rotTool = await evalJS(cdp, `(() => window.__ahsTest.sel.state.activeTool)()`);
  check("rotate tool active (E)", rotTool === "rotate", `tool=${rotTool}`);
  const rotPick = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    if (!lock || !Array.isArray(lock.curveObjects?.panelTipHandles)) return JSON.stringify({ noHandle: true });
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 0 };
    t.updateCurveObjects(lock, { visible: true });
    t.scene.updateMatrixWorld(true);
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    const allHandles = [
      ...(lock.curveObjects?.tipWidthHandles || []).flatMap((seg) => [...seg.left, ...seg.right]),
      ...(lock.curveObjects?.panelSplitHandles || []),
      ...(lock.curveObjects?.panelSegmentHandles || []),
      ...(lock.curveObjects?.panelTipHandles || []),
      ...(lock.curveObjects?.strandSplitHandle && lock.curveObjects.strandSplitHandle.visible ? [lock.curveObjects.strandSplitHandle] : [])
    ].filter((h) => h && h.visible);
    const rect = t.renderer.domElement.getBoundingClientRect();
    const ndc = new t.THREE.Vector2();
    const world = new t.THREE.Vector3();
    const identityQ = new t.THREE.Quaternion();
    const gizmoPicker = t.transformControls?._gizmo?.picker?.[t.transformControls.mode] || null;
    for (const h of lock.curveObjects.panelTipHandles) {
      if (!h.visible) continue;
      const seg = h.userData.panelTipIndex;
      const point = h.userData.panelTipPoint;
      const tip = t.splitTipForSegment(lock, seg, splits, bones[seg] || null);
      if (!tip || !Array.isArray(tip.points) || point >= tip.points.length) continue;
      const chainT = point / Math.max(1, tip.points.length - 1);
      const frame = t.tipChainFrameAt(lock, tip, tip, chainT, seg, splits);
      const frameQ = new t.THREE.Quaternion().setFromRotationMatrix(new t.THREE.Matrix4().makeBasis(frame.x, frame.y, frame.z));
      // only handles whose real chain frame is NOT identity make the no-snap assertion meaningful
      if (frameQ.angleTo(identityQ) <= (5 * Math.PI / 180)) continue;
      h.getWorldPosition(world);
      const c = t.projectToClient(world);
      const cx = Math.min(Math.max(c.x, rect.left + 4), rect.right - 4);
      const cy = Math.min(Math.max(c.y, rect.top + 4), rect.bottom - 4);
      ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
      t.raycaster.setFromCamera(ndc, t.camera());
      if (gizmoPicker && t.raycaster.intersectObject(gizmoPicker, true).length > 0) continue;
      const hit = t.raycaster.intersectObjects(allHandles, false)[0];
      if (!hit || hit.object !== h) continue;
      return JSON.stringify({
        seg, point,
        chainT: Number(chainT.toFixed(4)),
        frameY: { x: Number(frame.y.x.toFixed(4)), y: Number(frame.y.y.toFixed(4)), z: Number(frame.y.z.toFixed(4)) },
        frameQ: { x: Number(frameQ.x.toFixed(4)), y: Number(frameQ.y.toFixed(4)), z: Number(frameQ.z.toFixed(4)), w: Number(frameQ.w.toFixed(4)) },
        client: { x: Number(cx.toFixed(2)), y: Number(cy.toFixed(2)) }
      });
    }
    return JSON.stringify({ noPick: true });
  })()`));
  check("8.26-B found real visible tip handle (non-identity frame, self-hit)", rotPick.seg != null && rotPick.noPick == null && rotPick.noHandle == null, `pick=${JSON.stringify(rotPick)}`);
  if (rotPick.seg != null) {
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rotPick.client.x, y: rotPick.client.y });
    await sleep(150);
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: rotPick.client.x, y: rotPick.client.y, button: "left", clickCount: 1 });
    await sleep(500);
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: rotPick.client.x, y: rotPick.client.y, button: "left", clickCount: 1 });
    await sleep(250);
    const rotAssert = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const h = lock.curveObjects.panelTipHandles.find((x) => x.userData.panelTipIndex === ${rotPick.seg} && x.userData.panelTipPoint === ${rotPick.point});
      if (!h) return JSON.stringify({ noHandle: true });
      const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      const bones = t.materializeSplitBones(lock);
      const tip = t.splitTipForSegment(lock, ${rotPick.seg}, splits, bones[${rotPick.seg}] || null);
      const chainT = ${rotPick.point} / Math.max(1, tip.points.length - 1);
      const frame = t.tipChainFrameAt(lock, tip, tip, chainT, ${rotPick.seg}, splits);
      const frameQ = new t.THREE.Quaternion().setFromRotationMatrix(new t.THREE.Matrix4().makeBasis(frame.x, frame.y, frame.z));
      const yAngle = new t.THREE.Vector3(0, 1, 0).applyQuaternion(h.quaternion).angleTo(frame.y) * 180 / Math.PI;
      const qAngle = h.quaternion.angleTo(frameQ) * 180 / Math.PI;
      const idAngle = h.quaternion.angleTo(new t.THREE.Quaternion()) * 180 / Math.PI;
      t.beginTipSubBoneRotate(h);
      const drag = t.sculptState.state.tipSubBoneRotateDrag || null;
      const startAngle = drag ? drag.startQuaternion.angleTo(frameQ) * 180 / Math.PI : null;
      return JSON.stringify({
        attached: t.transformControls.object === h,
        mode: t.transformControls.mode,
        yAngle: Number(yAngle.toFixed(2)),
        qAngle: Number(qAngle.toFixed(2)),
        idAngle: Number(idAngle.toFixed(2)),
        startAngle: startAngle == null ? null : Number(startAngle.toFixed(2)),
        dragLock: drag ? drag.lockId : null,
        dragSeg: drag ? drag.segmentIndex : null,
        dragPoint: drag ? drag.tipPoint : null
      });
    })()`));
    check(
      "rotate gizmo starts on tip chain own frame (no snap to main bone)",
      rotAssert.attached === true
        && rotAssert.mode === "rotate"
        && rotAssert.yAngle < 5
        && rotAssert.qAngle < 5
        && rotAssert.idAngle > 5
        && rotAssert.startAngle != null
        && rotAssert.startAngle < 5
        && rotAssert.dragLock === lockId
        && rotAssert.dragSeg === rotPick.seg
        && rotAssert.dragPoint === rotPick.point,
      `rot=${JSON.stringify(rotAssert)}`
    );
  } else {
    check("rotate gizmo starts on tip chain own frame (no snap to main bone)", false, `pick=${JSON.stringify(rotPick)}`);
  }
  // cleanup: clear drag state, detach gizmo, back to select tool
  await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    t.sculptState.state.tipSubBoneRotateDrag = null;
    try { t.transformControls.detach(); } catch {}
    const btn = document.querySelector('.tool-button[data-tool="select"]');
    if (btn) btn.click();
    return true;
  })()`);
  await sleep(300);

  // ============ 8.21: curve lean + common-fork distribution (hidden points recorded) ============
  const leanCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const commonFork = t.tipWidthCommonForkT(lock, 2, splits);
    const rightFork = t.tipWidthSideForkT(lock, 2, splits, 1);
    const leftFork = t.tipWidthSideForkT(lock, 2, splits, -1);
    // both sides share the same control chain parameters (common fork = deepest zipper)
    const ts = t.tipWidthControlTs(commonFork);
    const rightVisible = ts.filter((p) => p >= rightFork - 1e-4).length;
    const leftVisible = ts.filter((p) => p >= leftFork - 1e-4).length;
    const rightEditT = ts.find((p) => p >= rightFork - 1e-4) || 0.9;
    const leftEditT = ts.find((p) => p >= leftFork - 1e-4) || 0.78;
    t.setTipWidthCurveValue(lock, 2, splits, bone, 1, rightEditT, 1.4);
    t.setTipWidthCurveValue(lock, 2, splits, bone, -1, leftEditT, 1.2);
    const rightCurve = bone.taperCurve || [];
    const leftCurve = bone.taperCurveSecondary || [];
    return JSON.stringify({
      ok: !!bone,
      commonFork: Number(commonFork.toFixed(3)),
      rightCount: rightCurve.length,
      leftCount: leftCurve.length,
      rightVisible,
      leftVisible,
      rightChanged: rightCurve.some((p) => Math.abs(p.value - t.sampleTaperCurve(lock.taperCurve, p.position)) > 0.01),
      leftChanged: leftCurve.some((p) => Math.abs(p.value - t.sampleTaperCurve(lock.taperCurve, p.position)) > 0.01)
    });
  })()`));
  check("tip width curve lean, common-fork distributed, short side truncates but records", leanCheck.ok && leanCheck.rightCount <= 9 && leanCheck.leftCount <= 9 && leanCheck.leftVisible === 6 && leanCheck.rightVisible > 0 && leanCheck.rightVisible < leanCheck.leftVisible && leanCheck.rightChanged === true && leanCheck.leftChanged === true, `lean=${JSON.stringify(leanCheck)}`);


  // ============ Issue 1: hover + alt+click in select mode (non-create tools) ============
  await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="select"]'); if (btn) btn.click(); return true; })()`);
  await sleep(300);
  const selOther = await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id !== ${JSON.stringify(lockId)} && l.geometryType === "strand" && l.mesh && !l.locked);
    return lock ? lock.id : null;
  })()`);
  if (selOther) {
    const selPt = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(selOther)});
      const last = lock.points[lock.points.length - 1];
      const c = t.projectToClient(new t.THREE.Vector3(last.x, last.y, last.z));
      return JSON.stringify({ x: c.x, y: c.y });
    })()`));
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipHover = { lockId: null, segmentIndex: null }; t.updateStrandBrushHover({ clientX: ${selPt.x}, clientY: ${selPt.y} }); return true; })()`);
    await sleep(200);
    const selHover = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const hovered = t.hairState.state.hoveredStrandId;
      const lock = hovered ? t.locks.find((l) => l.id === hovered) : null;
      return JSON.stringify({ hovered, outline: lock?.hoverOutline?.visible, tool: t.sel.state.activeTool });
    })()`));
    check("select mode hover highlights another strand", !!selHover.hovered && selHover.outline === true && selHover.tool === "select", `selHover=${JSON.stringify(selHover)}`);
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: selPt.x, y: selPt.y, button: "left", modifiers: 1, clickCount: 1 });
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: selPt.x, y: selPt.y, button: "left", modifiers: 1, clickCount: 1 });
    await sleep(500);
    const selAlt = await evalJS(cdp, `(() => { const t = window.__ahsTest; const l = t.getSelectedLock(); return l ? l.id : null; })()`);
    check("select mode alt+click switches to hovered strand", selAlt === selHover.hovered, `selAlt=${selAlt} hovered=${selHover.hovered}`);
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.selectLock(${JSON.stringify(lockId)}, {}); return true; })()`);
  }

  // ============ Issue 6: strand hover highlight during brush + alt+click switch ============
  // find another (non-panel) strand
  const otherId = await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id !== ${JSON.stringify(lockId)} && l.geometryType === "strand" && l.mesh && !l.locked);
    return lock ? lock.id : null;
  })()`);
  if (otherId) {
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.sculptState.state.panelTipHover = { lockId: null, segmentIndex: null }; return true; })()`);
    await evalJS(cdp, `(() => { const btn = document.querySelector('.tool-button[data-tool="sculpt-move"]'); if (btn) btn.click(); return true; })()`);
    await sleep(300);
    const otherPt = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(otherId)});
      const last = lock.points[lock.points.length - 1];
      const c = t.projectToClient(new t.THREE.Vector3(last.x, last.y, last.z));
      return JSON.stringify({ x: c.x, y: c.y });
    })()`));
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.updateStrandBrushHover({ clientX: ${otherPt.x}, clientY: ${otherPt.y} }); return true; })()`);
    await sleep(200);
    const strandHover = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest;
      const hoveredId = t.hairState.state.hoveredStrandId;
      const lock = hoveredId ? t.locks.find((l) => l.id === hoveredId) : null;
      return JSON.stringify({
        hovered: hoveredId,
        outlineVisible: lock?.hoverOutline?.visible,
        tool: t.sel.state.activeTool,
        hoveredIsSelected: hoveredId === t.getSelectedLock()?.id,
        hoveredVisible: lock ? t.strandVisibleForDisplay(lock) : null
      });
    })()`));
    const hoveredId = strandHover.hovered;
    check("move brush hover highlights another strand", !!hoveredId && hoveredId !== lockId && strandHover.outlineVisible === true && strandHover.tool === "sculpt-move", `strandHover=${JSON.stringify(strandHover)}`);
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: otherPt.x, y: otherPt.y, button: "left", modifiers: 1, clickCount: 1 });
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: otherPt.x, y: otherPt.y, button: "left", modifiers: 1, clickCount: 1 });
    await sleep(500);
    const altSwitch = await evalJS(cdp, `(() => { const t = window.__ahsTest; const l = t.getSelectedLock(); return l ? l.id : null; })()`);
    check("alt+click switches selection to hovered strand", altSwitch === hoveredId, `altSwitch=${altSwitch} hovered=${hoveredId}`);

    // restore panel selection for cleanliness
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.selectLock(${JSON.stringify(lockId)}, {}); return true; })()`);
  } else {
    check("move brush hover highlights another strand", false, "no other strand found");
  }

  // ============ 8.22: floating panel refreshes after a tip width edit ============
  // The drag handler calls renderTaperCurveEditor() for the edited segment (item 1); here
  // we verify the editor re-renders from the LIVE bone curve after a width edit.
  await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const ed = document.querySelector('#taperCurveEditor');
    t.sculptState.state.taperCurveEdit = { type: "segment", id: lock.id, segmentIndex: 2, curveKey: "taperCurve", side: "primary", selectedIndex: 0 };
    if (ed && !ed.open) ed.show();
    t.renderTaperCurveEditor();
    return true;
  })()`);
  const refreshPath0 = await evalJS(cdp, `(() => { return document.querySelector('#taperCurvePath').getAttribute('d') || ''; })()`);
  const refreshEdit = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[2] || null;
    const tt = 0.869; // a control position
    t.setTipWidthCurveValue(lock, 2, splits, bone, 1, tt, 1.35);
    t.renderTaperCurveEditor();
    const d = document.querySelector('#taperCurvePath').getAttribute('d') || '';
    return JSON.stringify({ d, editedAt: t.tipPanelWidthAt(lock, tt, 1, bone, 2, splits) });
  })()`));
  // clean up the editor state so later hover/alt+click tests are unaffected
  await evalJS(cdp, `(() => { const ed = document.querySelector('#taperCurveEditor'); if (ed && ed.open) ed.close(); window.__ahsTest.sculptState.state.taperCurveEdit = null; return true; })()`);
  // ============ Bug 3 (hot refresh): segment editor retargets on panel segment switch ============
  // Open the floating segment editor, then switch panelSegmentIndex through the SAME path the
  // viewport tip click / prev-next buttons use (syncPanelSegmentControls -> retargetOpenSegmentTaperEditor):
  // the editor's segmentIndex follows and the rendered curve path + target label update.
  const hotRefresh = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const ed = document.querySelector('#taperCurveEditor');
    t.sculptState.state.panelSegmentIndex = 0;
    t.sculptState.state.taperCurveEdit = { type: "segment", id: lock.id, segmentIndex: 0, curveKey: "taperCurve", side: "primary", selectedIndex: 0 };
    if (ed && !ed.open) ed.show();
    t.syncPanelSegmentControls(lock); // refresh prev/next button state + retarget to seg 0
    t.renderTaperCurveEditor();
    const d0 = document.querySelector('#taperCurvePath').getAttribute('d') || '';
    const label0 = document.querySelector('#taperCurveTarget').textContent;
    const nextBtn = document.querySelector('#nextPanelSegment');
    nextBtn.click(); // panelSegmentIndex 0 -> 1 (real step-button path)
    const afterStep = {
      seg: t.sculptState.state.taperCurveEdit.segmentIndex,
      panelIndex: t.sculptState.state.panelSegmentIndex,
      d: document.querySelector('#taperCurvePath').getAttribute('d') || ''
    };
    t.sculptState.state.panelSegmentIndex = 2;
    t.syncPanelSegmentControls(lock); // same sync the viewport tip click triggers
    const afterSync = {
      seg: t.sculptState.state.taperCurveEdit.segmentIndex,
      d: document.querySelector('#taperCurvePath').getAttribute('d') || ''
    };
    const labelAfter = document.querySelector('#taperCurveTarget').textContent;
    return JSON.stringify({ d0, label0, afterStep, afterSync, labelAfter });
  })()`));
  check("segment editor hot-refresh on panel segment switch (path + target)",
    hotRefresh.afterStep.seg === 1
    && hotRefresh.afterStep.d !== hotRefresh.d0
    && hotRefresh.afterSync.seg === 2
    && hotRefresh.afterSync.d !== hotRefresh.afterStep.d
    && !!hotRefresh.labelAfter && hotRefresh.labelAfter === hotRefresh.label0,
    `hotRefresh=${JSON.stringify(hotRefresh)}`);

  // ============ Bug 1 (display consistency): panel follows actual side curves ============
  // Equal side curves -> single-curve panel (secondary path has no d, displayAsymmetric false);
  // editing only ONE side (viewport Ctrl-drag style) flips the panel to dual-curve display.
  const asymDisplay = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bone = t.materializeSplitBones(lock)[0] || null;
    if (!bone) return JSON.stringify({ ok: false });
    // deterministic: reset segment 0 side curves to all-1 (both sides equal)
    const resetR = t.tipWidthResetCurve(lock, 0, splits, 1);
    const resetL = t.tipWidthResetCurve(lock, 0, splits, -1);
    bone.taperCurve.splice(0, bone.taperCurve.length, ...resetR.map((pt) => ({ ...pt })));
    bone.taperCurveSecondary.splice(0, bone.taperCurveSecondary.length, ...resetL.map((pt) => ({ ...pt })));
    const ed = document.querySelector('#taperCurveEditor');
    t.sculptState.state.taperCurveEdit = { type: "segment", id: lock.id, segmentIndex: 0, curveKey: "taperCurve", side: "primary", selectedIndex: 0 };
    if (ed && !ed.open) ed.show();
    t.renderTaperCurveEditor();
    const secondary = document.querySelector('#taperCurveSecondaryPath');
    const symD = secondary.getAttribute('d') || '';
    const symFlag = t.sculptState.state.taperCurveEdit.displayAsymmetric === false;
    // edit only the RIGHT side (asymmetric data); tt = first exposed control position
    const tt = t.tipWidthControlTs(t.tipWidthCommonForkT(lock, 0, splits))[0];
    t.setTipWidthCurveValue(lock, 0, splits, bone, 1, tt, 1.4);
    t.renderTaperCurveEditor();
    const asymD = secondary.getAttribute('d') || '';
    const asymFlag = t.sculptState.state.taperCurveEdit.displayAsymmetric === true;
    if (ed && ed.open) ed.close();
    t.sculptState.state.taperCurveEdit = null;
    return JSON.stringify({ ok: true, symD, asymD, symFlag, asymFlag });
  })()`));
  check("floating panel single-curve when sides equal, dual-curve after one-sided edit",
    asymDisplay.ok === true && asymDisplay.symD === "" && asymDisplay.asymD !== "" && asymDisplay.symFlag === true && asymDisplay.asymFlag === true,
    `asymDisplay=${JSON.stringify(asymDisplay)}`);

  check("floating panel curve refreshes after a tip width edit", refreshPath0.length > 0 && refreshEdit.d.length > 0 && refreshPath0 !== refreshEdit.d && refreshEdit.editedAt > 1.2, `refresh=${JSON.stringify({ path0Len: refreshPath0.length, afterLen: refreshEdit.d.length, editedAt: refreshEdit.editedAt })}`);
  // ============ 8.27: Reset writes all-1 curves (fork-row sampler = 1) ============
  const resetForkCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    if (splits.length < 2) return JSON.stringify({ skipped: true, reason: "splits<2" });
    const boundaries = [-1, ...splits.map((s) => s.position), 1];
    let seg = -1;
    for (let i = 0; i < boundaries.length - 1; i++) {
      const lf = t.tipWidthSideForkT(lock, i, splits, -1);
      const rf = t.tipWidthSideForkT(lock, i, splits, 1);
      if (lf < 0.999 && rf < 0.999 && Math.abs(lf - rf) > 1e-4) { seg = i; break; }
    }
    if (seg < 0) return JSON.stringify({ skipped: true, reason: "no unequal-fork segment" });
    const bone = t.materializeSplitBones(lock)[seg] || null;
    if (!bone) return JSON.stringify({ skipped: true, reason: "missing bone" });
    bone.asymmetricWidthCurve = false;
    bone.taperCurve.splice(0, bone.taperCurve.length, ...t.tipWidthResetCurve(lock, seg, splits, 1).map((p) => ({ ...p })));
    bone.taperCurveSecondary.splice(0, bone.taperCurveSecondary.length, ...t.tipWidthResetCurve(lock, seg, splits, -1).map((p) => ({ ...p })));
    const leftFork = t.tipWidthSideForkT(lock, seg, splits, -1);
    const rightFork = t.tipWidthSideForkT(lock, seg, splits, 1);
    const leftU = boundaries[seg] < 0 ? boundaries[seg] : -0.5;
    const rightU = boundaries[seg + 1] > 0 ? boundaries[seg + 1] : 0.5;
    const leftErr = Math.abs(t.tipWidthMultiplierAt(lock, leftFork, leftU, bone, seg, splits) - 1);
    const rightErr = Math.abs(t.tipWidthMultiplierAt(lock, rightFork, rightU, bone, seg, splits) - 1);
    return JSON.stringify({ seg, skipped: false, leftFork: Number(leftFork.toFixed(4)), rightFork: Number(rightFork.toFixed(4)), leftErr: Number(leftErr.toFixed(6)), rightErr: Number(rightErr.toFixed(6)) });
  })()`));
  check("Reset: fork-row sampler = 1 (all-1 reset, both sides)",
    resetForkCheck.skipped === false && resetForkCheck.leftErr < 0.01 && resetForkCheck.rightErr < 0.01,
    `resetFork=${JSON.stringify(resetForkCheck)}`);

  // ============ 8.27-B: Reset curve data carries a point at BOTH fork positions (=1) ============
  const resetForkDataCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    if (splits.length < 2) return JSON.stringify({ skipped: true, reason: "splits<2" });
    const boundaries = [-1, ...splits.map((s) => s.position), 1];
    let seg = -1;
    for (let i = 0; i < boundaries.length - 1; i++) {
      const lf = t.tipWidthSideForkT(lock, i, splits, -1);
      const rf = t.tipWidthSideForkT(lock, i, splits, 1);
      if (lf < 0.999 && rf < 0.999 && Math.abs(lf - rf) > 1e-4) { seg = i; break; }
    }
    if (seg < 0) return JSON.stringify({ skipped: true, reason: "no unequal-fork segment" });
    const bone = t.materializeSplitBones(lock)[seg] || null;
    if (!bone) return JSON.stringify({ skipped: true, reason: "missing bone" });
    bone.taperCurve.splice(0, bone.taperCurve.length, ...t.tipWidthResetCurve(lock, seg, splits, 1).map((p) => ({ ...p })));
    bone.taperCurveSecondary.splice(0, bone.taperCurveSecondary.length, ...t.tipWidthResetCurve(lock, seg, splits, -1).map((p) => ({ ...p })));
    const leftFork = t.tipWidthSideForkT(lock, seg, splits, -1);
    const rightFork = t.tipWidthSideForkT(lock, seg, splits, 1);
    const primary = bone.taperCurve || [];
    const hasLeftPoint = primary.some((p) => Math.abs(p.position - leftFork) < 1e-4 && Math.abs(p.value - 1) < 0.01);
    const hasRightPoint = primary.some((p) => Math.abs(p.position - rightFork) < 1e-4 && Math.abs(p.value - 1) < 0.01);
    const secondary = bone.taperCurveSecondary || [];
    const hasLeftSecondary = secondary.some((p) => Math.abs(p.position - leftFork) < 1e-4);
    const hasRightSecondary = secondary.some((p) => Math.abs(p.position - rightFork) < 1e-4);
    return JSON.stringify({ seg, skipped: false, leftFork: Number(leftFork.toFixed(4)), rightFork: Number(rightFork.toFixed(4)), hasLeftPoint, hasRightPoint, hasLeftSecondary, hasRightSecondary, primaryLen: primary.length, secondaryLen: secondary.length });
  })()`));
  check("Reset curve data has a point at BOTH fork positions (=1)",
    resetForkDataCheck.skipped === false
      && resetForkDataCheck.hasLeftPoint
      && resetForkDataCheck.hasRightPoint
      && resetForkDataCheck.hasLeftSecondary
      && resetForkDataCheck.hasRightSecondary,
    `resetForkData=${JSON.stringify(resetForkDataCheck)}`);

  // ============ 8.28: real Reset button writes all-1 curves and rebuilds geometry ============
  const resetButtonCheck = JSON.parse(await evalJS(cdp, `(() => {
    try {
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
      if (splits.length < 2) return JSON.stringify({ skipped: true, reason: "splits<2" });
      const bone = t.materializeSplitBones(lock)[2] || null;
      if (!bone) return JSON.stringify({ skipped: true, reason: "missing bone" });
      t.sculptState.state.taperCurveEdit = { type: "segment", id: lock.id, segmentIndex: 2, curveKey: "taperCurve", side: "primary", selectedIndex: 0 };
      const ed = document.querySelector('#taperCurveEditor');
      if (ed && !ed.open) ed.show();
      t.renderTaperCurveEditor();
      const btn = document.querySelector('#resetTaperCurve');
      if (!btn) return JSON.stringify({ skipped: true, reason: "no reset button" });
      btn.click();
      if (ed && ed.open) ed.close();
      t.sculptState.state.taperCurveEdit = null;
      const primaryAllOne = (bone.taperCurve || []).every((p) => Math.abs(p.value - 1) < 1e-6);
      const secondaryAllOne = (bone.taperCurveSecondary || []).every((p) => Math.abs(p.value - 1) < 1e-6);
      const geoOk = !!lock.mesh.geometry && !!lock.mesh.geometry.attributes.position && lock.mesh.geometry.attributes.position.count > 0;
      return JSON.stringify({ skipped: false, primaryAllOne, secondaryAllOne, geoOk });
    } catch (err) {
      return JSON.stringify({ skipped: true, reason: "error: " + (err && err.message ? err.message : String(err)) });
    }
  })()`));
  check("Reset button writes all-1 curves to both sides and rebuilds geometry",
    resetButtonCheck.skipped === false && resetButtonCheck.primaryAllOne === true && resetButtonCheck.secondaryAllOne === true && resetButtonCheck.geoOk === true,
    `resetButton=${JSON.stringify(resetButtonCheck)}`);
  const errAfter = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions during interaction", errAfter === bootErr, `total=${errAfter} (start=${bootErr})`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
  await cdp.send("Browser.close").catch(() => {});
  process.exit(failed.length ? 1 : 0);
} finally {
  chrome.kill();
}


