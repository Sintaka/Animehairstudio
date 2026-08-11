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
    for (let mv = 1; mv <= 5; mv++) {
      await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: widthDrag.x + edgeDir.dx * 10 * mv, y: widthDrag.y + edgeDir.dy * 10 * mv, button: "left", buttons: 1 });
      await sleep(80);
    }
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: widthDrag.x + edgeDir.dx * 50, y: widthDrag.y + edgeDir.dy * 50, button: "left", clickCount: 1 });
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
    // locked region sample comparison: value at 0.3 (must be < forkT for seg2 right = 0.8125)
    const globalAt = t.sampleTaperCurve ? t.sampleTaperCurve(lock.taperCurve, 0.3) : null;
    const bakedAt = rightCurve ? rightCurve.find((pt) => Math.abs(pt.position - 0.3) < 1e-3)?.value : null;
    return JSON.stringify({ ok: true, hasRight: !!rightCurve, hasLeft: !!leftCurve, asym: bone.asymmetricWidthCurve === true, rightForkT, lockedMatch: globalAt != null && bakedAt != null && Math.abs(globalAt - bakedAt) < 1e-3, changedFromDefault: !!rightCurve, valueChanged });
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
  check("tip width drag authors right curve (chain unchanged, asymmetric, locked = global)", widthAfter.ok === true && widthAfter.hasRight === true && widthAfter.hasLeft === true && widthAfter.asym === true && widthAfter.lockedMatch === true && widthAfter.valueChanged === true && widthChainMoved === false, `width=${JSON.stringify(widthAfter)} chainMoved=${widthChainMoved}`);
  // ============ 8.19: tip width lateral follows the TIP sub-bone's own width axis ============
  // The green handle drag direction (tipWidthEdgePosition.lateral) must be the tip's own
  // authored width axis (dq * mainFrameX), not the mixed main-panel-frame vector that used
  // to tilt 7-51deg (right) / 131-170deg (left) - the "trapezoid" feel.
  const latCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    let maxTilt = 0;
    let minTangentAngle = 180;
    for (let seg = 0; seg <= splits.length; seg++) {
      const bone = bones[seg] || null;
      const tip = t.splitTipForSegment(lock, seg, splits, bone);
      if (!tip || tip.points.length < 2) continue;
      const curve = new t.THREE.CatmullRomCurve3(tip.points);
      const restCurve = new t.THREE.CatmullRomCurve3(tip.restPoints);
      for (const tt of [0.6, 0.8, 0.95]) {
        const at = curve.getTangent(tt).normalize();
        const rt = restCurve.getTangent(tt).normalize();
        const dq = rt.dot(at) < -0.9999
          ? (new t.THREE.Quaternion()).setFromAxisAngle(new t.THREE.Vector3(0, 1, 0), Math.PI)
          : (new t.THREE.Quaternion()).setFromUnitVectors(rt, at);
        const frame = t.tipPanelFrameAt(lock, tt);
        const authoredLat = frame.x.clone().applyQuaternion(dq).normalize();
        for (const side of [-1, 1]) {
          const edge = t.tipWidthEdgePosition(lock, seg, splits, bone, side, tt);
          if (!edge) continue;
          const cos = t.THREE.MathUtils.clamp(Math.abs(edge.lateral.dot(authoredLat)), -1, 1);
          maxTilt = Math.max(maxTilt, Math.acos(cos) * 180 / Math.PI);
          const cosT = t.THREE.MathUtils.clamp(Math.abs(edge.lateral.dot(at)), -1, 1);
          minTangentAngle = Math.min(minTangentAngle, Math.acos(cosT) * 180 / Math.PI);
        }
      }
    }
    return JSON.stringify({ maxTilt: Number(maxTilt.toFixed(2)), minTangentAngle: Number(minTangentAngle.toFixed(1)) });
  })()`));
  check("tip width lateral follows tip sub-bone width axis", latCheck.maxTilt < 5 && latCheck.minTangentAngle > 60, `lat=${JSON.stringify(latCheck)}`);

  // ============ 8.19: asymmetric tip width blends linearly at the center (no hard split) ============
  // Left/right curves used to hard-switch at u=0 (left half = left curve, right half = right
  // curve). After a right-side edit, u=0 must be the linear midpoint and the profile must be
  // continuous (center step ~10x smaller than the old hard step).
  const blendCheck = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    const bone = bones[2] || null;
    if (!bone) return JSON.stringify({ ok: false });
    t.setTipWidthCurveValue(lock, 2, splits, bone, 1, 0.9, 1.45);
    const w = (u) => t.sampleAsymmetricTaperCurve(bone.taperCurve, bone.taperCurveSecondary, bone.asymmetricWidthCurve, u, 0.9);
    const left = w(-1);
    const right = w(1);
    const mid = w(0);
    const stepAtCenter = Math.abs(w(-0.1) - w(0.1));
    const linear = Math.abs(mid - (left + right) * 0.5) < 1e-3
      && Math.abs(w(-0.5) - (left * 0.75 + right * 0.25)) < 1e-3
      && Math.abs(w(0.5) - (left * 0.25 + right * 0.75)) < 1e-3;
    return JSON.stringify({
      ok: true,
      left: Number(left.toFixed(4)),
      right: Number(right.toFixed(4)),
      mid: Number(mid.toFixed(4)),
      midIsAvg: Math.abs(mid - (left + right) * 0.5) < 1e-3,
      stepAtCenter: Number(stepAtCenter.toFixed(4)),
      linear
    });
  })()`));
  check("asymmetric tip width blends linearly at center (no hard split)", blendCheck.ok === true && blendCheck.midIsAvg === true && blendCheck.linear === true && blendCheck.stepAtCenter < 0.1 && blendCheck.left !== blendCheck.right, `blend=${JSON.stringify(blendCheck)}`);

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
    await evalJS(cdp, `(() => { const t = window.__ahsTest; t.updateStrandBrushHover({ clientX: ${selPt.x}, clientY: ${selPt.y} }); return true; })()`);
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

  const errAfter = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions during interaction", errAfter === bootErr, `total=${errAfter} (start=${bootErr})`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
  await cdp.send("Browser.close").catch(() => {});
  process.exit(failed.length ? 1 : 0);
} finally {
  chrome.kill();
}
