// repro-0045-bugs.mjs — 复现 0045 两个 bug（tipWidth 拖拽无响应 + USDA panel zipper 缝）。
// 基于 verify-tip-select.mjs 的 harness（本地静态服务器 + headless Chrome CDP）。
// Run: node scripts/repro-0045-bugs.mjs D:/Downloads/Sussurro_v1_0045.ahs [--port 8281] [--cdp-port 9402] [--dump-usda out.usda]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const VALUE_OPTS = new Set(["--port", "--cdp-port", "--dump-usda"]);
const ahsFiles = [];
let dumpUsda = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--dump-usda") { dumpUsda = args[i + 1]; i++; continue; }
  if (args[i].startsWith("--")) { if (VALUE_OPTS.has(args[i])) i++; continue; }
  ahsFiles.push(args[i]);
}
const argVal = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};
const port = Number(argVal("--port", "8281"));
const cdpPort = Number(argVal("--cdp-port", "9402"));
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const profileDir = path.join(os.tmpdir(), "ahs-repro-profile-" + cdpPort);
const ahsFile = ahsFiles[0];
if (!ahsFile) { console.error("usage: node scripts/repro-0045-bugs.mjs <file.ahs> [--port] [--cdp-port] [--dump-usda out.usda]"); process.exit(2); }

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
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
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

  // ---- 找到 Front Bangs 1 ----
  const fb1 = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.name === "Front Bangs 1" && t.isPanelGeometry(l));
    if (!lock) return 'null';
    return JSON.stringify({ id: lock.id, splits: (lock.panelSplits || []).map((s) => ({ position: s.position, height: s.height })), tipCurve: lock.panelTipCurve, leftTrim: lock.panelLeftEdgeTrim, rightTrim: lock.panelRightEdgeTrim, tipLoops: lock.panelTipLoops, widthLoops: lock.panelWidthLoops, lengthLoops: lock.panelLengthLoops });
  })()`));
  check("found Front Bangs 1", !!fb1, fb1 ? JSON.stringify(fb1) : "none");
  if (!fb1) process.exit(1);
  const lockId = fb1.id;
  const splitsLen = fb1.splits.length;

  // ---- Phase 0（拖拽前）：panel 网格 cell 唯一性 + unfold 重映射是否桥接缝 ----
  const phase0 = JSON.parse(await evalJS(cdp, `(async () => {
    const { unfoldHairMesh } = await import('/modules/io/uv-unfold.js');
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const geo = lock.mesh.geometry;
    const gr = geo.userData.gridRowIndices, gc = geo.userData.gridColIndices;
    const w = geo.userData.panelWeights;
    const pos = geo.attributes.position;
    // 1) cell 统计
    const cellMap = new Map(); // "row:col" -> [vertexIdx...]
    const invalid = [];
    for (let i = 0; i < pos.count; i += 1) {
      const r = gr ? gr[i] : -1, c = gc ? gc[i] : -1;
      if (!Number.isFinite(r) || !Number.isFinite(c) || r < 0 || c < 0) { invalid.push(i); continue; }
      const k = r + ":" + c;
      if (!cellMap.has(k)) cellMap.set(k, []);
      cellMap.get(k).push(i);
    }
    const dups = [...cellMap.entries()].filter(([, v]) => v.length > 1)
      .map(([k, v]) => ({ cell: k, count: v.length, segs: [...new Set(v.map((i) => (w && w.length > i * 3) ? w[i * 3 + 1] : -1))],
        pts: v.map((i) => [pos.getX(i).toFixed(4), pos.getY(i).toFixed(4), pos.getZ(i).toFixed(4)]) }));
    // 2) 视口 quadFaces 的长边（>0.07 视为跨缝嫌疑）
    const qf = geo.userData.quadFaces || [];
    const posOf = (i) => [pos.getX(i), pos.getY(i), pos.getZ(i)];
    const dist = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]);
    const longEdges = (faces) => {
      const out = [];
      faces.forEach((f, fi) => {
        for (let i = 0; i < f.length; i += 1) {
          const d = dist(posOf(f[i]), posOf(f[(i+1)%f.length]));
          if (d > 0.07) out.push({ face: fi, d: +d.toFixed(4), va: f[i], vb: f[(i+1)%f.length] });
        }
      });
      return out;
    };
    const viewportLong = longEdges(qf);
    // 3) unfold 重映射后逐面「边长度多重集」对比:同格式(toFixed(4)排序拼接)。
    //    桥接面会把缝两侧顶点接在一起 → 边集与视口不同 → 精确判定。
    const unfolded = unfoldHairMesh(geo, { kind: "open" });
    let mismatched = [];
    let edgeSetMismatch = 0;
    let unfoldLong = 0;
    if (unfolded) {
      const upos = (i) => [unfolded.positions[i*3], unfolded.positions[i*3+1], unfolded.positions[i*3+2]];
      const faceEdgeSig = (getPos, f) => f.map((vi, k) => {
        const a = getPos(vi); const b = getPos(f[(k+1)%f.length]);
        return Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]).toFixed(4);
      }).sort().join("|");
      unfolded.faces.forEach((f, fi) => {
        const vSig = qf[fi].map((i) => posOf(i).map((x) => x.toFixed(4)).join(",")).sort().join("|");
        const uSig = f.map((i) => upos(i).map((x) => x.toFixed(4)).join(",")).sort().join("|");
        if (vSig !== uSig) mismatched.push({ face: fi });
        if (faceEdgeSig(posOf, qf[fi]) !== faceEdgeSig(upos, f)) edgeSetMismatch += 1;
        if (f.some((vi, k) => { const a = upos(vi); const b = upos(f[(k+1)%f.length]); return Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]) > 0.07; })) unfoldLong += 1;
      });
    }
    return JSON.stringify({
      vertCount: pos.count,
      gridCellCount: cellMap.size,
      invalidCount: invalid.length,
      dupCellCount: dups.length,
      dupCells: dups.slice(0, 12),
      viewportLongEdges: viewportLong.length,
      viewportLongSample: viewportLong.slice(0, 6),
      unfolded: !!unfolded,
      unfoldVertCount: unfolded ? unfolded.positions.length / 3 : 0,
      mismatchedFaces: mismatched.length,
      mismatchedSample: mismatched.slice(0, 6),
      edgeSetMismatch,
      unfoldLongFaces: unfoldLong
    });
  })()`));
  console.log("PHASE 0:", JSON.stringify(phase0, null, 1));
  check("P0: no duplicate grid cells", phase0.dupCellCount === 0, `dupCellCount=${phase0.dupCellCount}`);
  check("P0: no invalid grid vertices", phase0.invalidCount === 0, `invalidCount=${phase0.invalidCount}`);
  check("P0: unfold remap 1:1 (no bridged faces)", phase0.unfolded === true && phase0.mismatchedFaces === 0, `unfolded=${phase0.unfolded} mismatched=${phase0.mismatchedFaces}`);
  check("P0: per-face edge sets identical viewport vs export", phase0.unfolded === true && phase0.edgeSetMismatch === 0, `edgeSetMismatch=${phase0.edgeSetMismatch}`);

  // 页内工具：把 placement 投影到客户端坐标 + 拖拽方向
  const dragInfo = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.selectLock(lock.id, {});
    const tipSplits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    const out = {};
    for (const seg of [1, 3]) {
      const bone = bones[seg];
      const placements = {};
      for (const side of [-1, 1]) {
        for (let idx = 0; idx < 6; idx += 1) {
          const p = t.tipWidthControlPlacement(lock, seg, tipSplits, bone, side, idx);
          if (p) {
            const c = t.projectToClient(new t.THREE.Vector3(p.point.x, p.point.y, p.point.z));
            const lc = t.projectToClient(new t.THREE.Vector3(p.center.x, p.center.y, p.center.z));
            const lpc = t.projectToClient(new t.THREE.Vector3(p.center.x + p.lateral.x * 0.1, p.center.y + p.lateral.y * 0.1, p.center.z + p.lateral.z * 0.1));
            placements[side + ":" + idx] = { t: p.t, x: c.x, y: c.y, dx: lpc.x - lc.x, dy: lpc.y - lc.y };
          }
        }
      }
      out["seg" + seg] = placements;
    }
    return JSON.stringify(out);
  })()`));
  console.log("placements:", JSON.stringify(dragInfo, null, 1));

  // ---- 选段 3，拖拽 side +1 index 1（t≈0.694，band 内唯一暴露侧） ----
  const before = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 3 };
    t.sculptState.state.panelSegmentIndex = 3;
    t.updateCurveObjects(lock, { visible: true });
    const tipSplits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    const bone = bones[3];
    const edge = (side, tt) => { const e = t.tipWidthEdgePosition(lock, 3, tipSplits, bone, side, tt); return e ? { x: +e.point.x.toFixed(5), y: +e.point.y.toFixed(5), z: +e.point.z.toFixed(5) } : null; };
    const meshHash = (() => {
      const a = lock.mesh.geometry.attributes.position.array;
      let s = 0;
      for (let i = 0; i < a.length; i++) s += Math.abs(a[i]) * (i + 1);
      return s.toFixed(6);
    })();
    return JSON.stringify({
      curve: (bone.taperCurve || []).map((p) => ({ p: +p.position.toFixed(4), v: +p.value.toFixed(4) })),
      curve2: (bone.taperCurveSecondary || []).map((p) => ({ p: +p.position.toFixed(4), v: +p.value.toFixed(4) })),
      asymW: bone.asymmetricWidthCurve,
      spread: bone.spread,
      edgeR06: edge(1, 0.60625), edgeR07: edge(1, 0.69375), edgeL07: edge(-1, 0.69375),
      widthR: +t.tipPanelWidthAt(lock, 0.69375, 1, bone, 3, tipSplits).toFixed(5),
      widthL: +t.tipPanelWidthAt(lock, 0.69375, -1, bone, 3, tipSplits).toFixed(5),
      meshHash,
      vertCount: lock.mesh.geometry.attributes.position.count
    });
  })()`));
  console.log("BEFORE seg3:", JSON.stringify(before, null, 1));

  // 按压前即时重算 handle 屏幕坐标（选区设置后布局可能变化），并验证可见性 + 命中。
  const pressInfo = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.updateCurveObjects(lock, { visible: true });
    const h = lock.curveObjects.tipWidthHandles[3].right[1];
    const rect = t.renderer.domElement.getBoundingClientRect();
    const c = t.projectToClient(new t.THREE.Vector3(h.position.x, h.position.y, h.position.z));
    const ndc = new t.THREE.Vector2(((c.x - rect.left) / rect.width) * 2 - 1, -((c.y - rect.top) / rect.height) * 2 + 1);
    t.raycaster.setFromCamera(ndc, t.camera());
    const allHandles = [
      ...(lock.curveObjects.tipWidthHandles || []).flatMap((seg) => [...seg.left, ...seg.right]),
      ...(lock.curveObjects.panelTipHandles || []),
      ...(lock.curveObjects.panelSegmentHandles || []),
      ...(lock.curveObjects.panelSplitHandles || [])
    ];
    const hits = t.raycaster.intersectObjects(allHandles.filter((x) => x.visible), false).slice(0, 3)
      .map((x) => ({ ud: x.object.userData, d: +x.distance.toFixed(4) }));
    return JSON.stringify({
      handleVisible: h.visible,
      groupVisible: lock.curveObjects.group.visible,
      client: { x: c.x, y: c.y },
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      hits,
      visibleTipWidthCount: allHandles.filter((x) => x.visible && x.userData.tipWidthSegment === 3).length
    });
  })()`));
  console.log("PRESS INFO:", JSON.stringify(pressInfo, null, 1));
  const rectR = pressInfo.rect.left + pressInfo.rect.width;
  const rectB = pressInfo.rect.top + pressInfo.rect.height;
  const startX = Math.min(Math.max(pressInfo.client.x, pressInfo.rect.left + 4), rectR - 4);
  const startY = Math.min(Math.max(pressInfo.client.y, pressInfo.rect.top + 4), rectB - 4);
  const pick = dragInfo.seg3["1:1"];
  const dirLen = Math.hypot(pick.dx, pick.dy) || 1;
  const ux = pick.dx / dirLen, uy = pick.dy / dirLen;
  // CDP Input 在本 headless 环境不投递到页面（探针全 0），改用页面内合成 PointerEvent。
  const dragJs = (phase, sx, sy, ctrl = false) => evalJS(cdp, `(() => {
    const t = window.__ahsTest; const el = t.renderer.domElement;
    if (window.__patchedCapture !== true) {
      el.setPointerCapture = () => {}; el.hasPointerCapture = () => false; el.releasePointerCapture = () => {};
      window.__patchedCapture = true;
    }
    const ev = (type, x, y, buttons) => el.dispatchEvent(new PointerEvent(type, {
      bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
      pointerId: 42, pointerType: "mouse", isPrimary: true, view: window, ctrlKey: ${ctrl}
    }));
    ${phase === "down" ? `ev('pointerdown', ${startX}, ${startY}, 1);` : ""}
    ${phase === "move" ? `for (let step = 1; step <= 10; step += 1) ev('pointermove', ${startX} + ${ux} * 9 * step, ${startY} + ${uy} * 9 * step, 1); ev('pointerup', ${startX} + ${ux} * 90, ${startY} + ${uy} * 90, 0);` : ""}
    return true;
  })()`);
  await dragJs("down", startX, startY, false);
  await sleep(200);
  const dragState = JSON.parse(await evalJS(cdp, `(() => { const d = window.__ahsTest.sculptState.state.panelSplitDrag; return JSON.stringify(d ? { kind: d.kind, splitIndex: d.splitIndex, tipWidthSide: d.tipWidthSide, tipWidthIndex: d.tipWidthIndex, tipWidthT: d.tipWidthT } : null); })()`));
  check("drag grabbed as tipWidth", !!dragState && dragState.kind === "tipWidth" && dragState.splitIndex === 3 && dragState.tipWidthSide === 1, `drag=${JSON.stringify(dragState)}`);
  await dragJs("move", startX, startY, false);
  await sleep(500);
  const excCount = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length - bootErr;
  check("0 exceptions during drag", excCount === 0, `${excCount} exceptions`);

  const after = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const tipSplits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    const bone = bones[3];
    const edge = (side, tt) => { const e = t.tipWidthEdgePosition(lock, 3, tipSplits, bone, side, tt); return e ? { x: +e.point.x.toFixed(5), y: +e.point.y.toFixed(5), z: +e.point.z.toFixed(5) } : null; };
    const meshHash = (() => {
      const a = lock.mesh.geometry.attributes.position.array;
      let s = 0;
      for (let i = 0; i < a.length; i++) s += Math.abs(a[i]) * (i + 1);
      return s.toFixed(6);
    })();
    return JSON.stringify({
      curve: (bone.taperCurve || []).map((p) => ({ p: +p.position.toFixed(4), v: +p.value.toFixed(4) })),
      curve2: (bone.taperCurveSecondary || []).map((p) => ({ p: +p.position.toFixed(4), v: +p.value.toFixed(4) })),
      asymW: bone.asymmetricWidthCurve,
      edgeR06: edge(1, 0.60625), edgeR07: edge(1, 0.69375), edgeL07: edge(-1, 0.69375),
      widthR: +t.tipPanelWidthAt(lock, 0.69375, 1, bone, 3, tipSplits).toFixed(5),
      widthL: +t.tipPanelWidthAt(lock, 0.69375, -1, bone, 3, tipSplits).toFixed(5),
      meshHash,
      drag: t.sculptState.state.panelSplitDrag ? "still-dragging" : null
    });
  })()`));
  console.log("AFTER seg3:", JSON.stringify(after, null, 1));
  const curveChanged = JSON.stringify(before.curve) !== JSON.stringify(after.curve) || JSON.stringify(before.curve2) !== JSON.stringify(after.curve2);
  check("curve data changed (panel would follow)", curveChanged);
  check("mesh changed after seg3 +1 drag", before.meshHash !== after.meshHash, `hash ${before.meshHash} -> ${after.meshHash}`);
  check("right edge moved after seg3 +1 drag", JSON.stringify(before.edgeR07) !== JSON.stringify(after.edgeR07), `edgeR07 ${JSON.stringify(before.edgeR07)} -> ${JSON.stringify(after.edgeR07)}`);

  // ---- 对照：seg1 band 内 +1 拖拽（用户称其它发尖正常） ----
  const pressInfo1 = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 1 };
    t.sculptState.state.panelSegmentIndex = 1;
    t.updateCurveObjects(lock, { visible: true });
    const h = lock.curveObjects.tipWidthHandles[1].right[1];
    const rect = t.renderer.domElement.getBoundingClientRect();
    const c = t.projectToClient(new t.THREE.Vector3(h.position.x, h.position.y, h.position.z));
    const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
    return JSON.stringify({ client: { x: c.x, y: c.y }, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, handleVisible: h.visible, meshHash });
  })()`));
  if (pressInfo1 && pressInfo1.handleVisible) {
    const sx = Math.min(Math.max(pressInfo1.client.x, pressInfo1.rect.left + 4), pressInfo1.rect.left + pressInfo1.rect.width - 4);
    const sy = Math.min(Math.max(pressInfo1.client.y, pressInfo1.rect.top + 4), pressInfo1.rect.top + pressInfo1.rect.height - 4);
    const pick1 = dragInfo.seg1["1:1"];
    const dl = Math.hypot(pick1?.dx ?? 1, pick1?.dy ?? 0) || 1;
    const vx = (pick1?.dx ?? 1) / dl, vy = (pick1?.dy ?? 0) / dl;
    const dragJs1 = (phase) => evalJS(cdp, `(() => {
      const t = window.__ahsTest; const el = t.renderer.domElement;
      const ev = (type, x, y, buttons) => el.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
        pointerId: 43, pointerType: "mouse", isPrimary: true, view: window
      }));
      ${phase === "down" ? `ev('pointerdown', ${sx}, ${sy}, 1);` : `for (let step = 1; step <= 10; step += 1) ev('pointermove', ${sx} + ${vx} * 9 * step, ${sy} + ${vy} * 9 * step, 1); ev('pointerup', ${sx} + ${vx} * 90, ${sy} + ${vy} * 90, 0);`}
      return true;
    })()`);
    await dragJs1("down");
    await sleep(200);
    const dragState1 = JSON.parse(await evalJS(cdp, `(() => { const d = window.__ahsTest.sculptState.state.panelSplitDrag; return JSON.stringify(d ? { kind: d.kind, splitIndex: d.splitIndex, tipWidthSide: d.tipWidthSide, tipWidthIndex: d.tipWidthIndex, tipWidthT: d.tipWidthT } : null); })()`));
    check("seg1 drag grabbed as tipWidth +1", !!dragState1 && dragState1.kind === "tipWidth" && dragState1.splitIndex === 1 && dragState1.tipWidthSide === 1, `drag=${JSON.stringify(dragState1)}`);
    await dragJs1("move");
    await sleep(500);
    const after1 = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i]) * (i + 1); return s.toFixed(6); })();
      const b = t.materializeSplitBones(lock)[1];
      return JSON.stringify({ meshHash, tc: (b.taperCurve||[]).map((p)=>[+p.position.toFixed(4),+p.value.toFixed(3)]), tcs: (b.taperCurveSecondary||[]).map((p)=>[+p.position.toFixed(4),+p.value.toFixed(3)]) });
    })()`));
  check("CONTROL: seg1 mesh changed after +1 drag", pressInfo1.meshHash !== after1.meshHash, `hash ${pressInfo1.meshHash} -> ${after1.meshHash} tc=${JSON.stringify(after1.tc)} tcs=${JSON.stringify(after1.tcs)}`);
  } else {
    check("seg1 handle visible for control drag", false, `pressInfo1=${JSON.stringify(pressInfo1)}`);
  }

  // ---- 变体 V1：seg3 +1 index 1 按住 ctrl（非对称）拖拽 ----
  {
    const pinfo = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 3 };
      t.sculptState.state.panelSegmentIndex = 3;
      t.updateCurveObjects(lock, { visible: true });
      const h = lock.curveObjects.tipWidthHandles[3].right[1];
      const rect = t.renderer.domElement.getBoundingClientRect();
      const c = t.projectToClient(new t.THREE.Vector3(h.position.x, h.position.y, h.position.z));
      const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
      return JSON.stringify({ x: c.x, y: c.y, rl: rect.left, rt: rect.top, rw: rect.width, rh: rect.height, meshHash });
    })()`));
    const cx0 = Math.min(Math.max(pinfo.x, pinfo.rl + 4), pinfo.rl + pinfo.rw - 4);
    const cy0 = Math.min(Math.max(pinfo.y, pinfo.rt + 4), pinfo.rt + pinfo.rh - 4);
    const dd = dragInfo.seg3["1:1"];
    const dl2 = Math.hypot(dd.dx, dd.dy) || 1;
    const vvx = dd.dx / dl2, vvy = dd.dy / dl2;
    await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const el = t.renderer.domElement;
      const ev = (type, x, y, buttons, ctrl) => el.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
        pointerId: 44, pointerType: "mouse", isPrimary: true, view: window, ctrlKey: ctrl
      }));
      ev('pointerdown', ${cx0}, ${cy0}, 1, true);
      return true;
    })()`);
    await sleep(200);
    const v1drag = JSON.parse(await evalJS(cdp, `(() => { const d = window.__ahsTest.sculptState.state.panelSplitDrag; return JSON.stringify(d ? { kind: d.kind, splitIndex: d.splitIndex, side: d.tipWidthSide, idx: d.tipWidthIndex, t: d.tipWidthT } : null); })()`));
    check("V1 ctrl down grabs tipWidth", !!v1drag && v1drag.kind === "tipWidth" && v1drag.splitIndex === 3 && v1drag.side === 1, `drag=${JSON.stringify(v1drag)}`);
    await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const el = t.renderer.domElement;
      const ev = (type, x, y, buttons, ctrl) => el.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
        pointerId: 44, pointerType: "mouse", isPrimary: true, view: window, ctrlKey: ctrl
      }));
      for (let step = 1; step <= 10; step += 1) ev('pointermove', ${cx0} - ${vvx} * 9 * step, ${cy0} - ${vvy} * 9 * step, 1, true);
      ev('pointerup', ${cx0} - ${vvx} * 90, ${cy0} - ${vvy} * 90, 0, true);
      return true;
    })()`);
    await sleep(500);
    const res1 = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
      const bones = t.materializeSplitBones(lock); const b = bones[3];
      return JSON.stringify({ meshHash, asymW: b.asymmetricWidthCurve, tc: (b.taperCurve||[]).map((p)=>+p.value.toFixed(3)), tcs: (b.taperCurveSecondary||[]).map((p)=>+p.value.toFixed(3)) });
    })()`));
    check("V1 ctrl-drag seg3 +1 changes mesh", pinfo.meshHash !== res1.meshHash, `hash ${pinfo.meshHash} -> ${res1.meshHash} asymW=${res1.asymW} tc=${JSON.stringify(res1.tc)} tcs=${JSON.stringify(res1.tcs)}`);
  }

  // ---- 变体 V2：seg3 -1 side index 3（t=0.86875，双侧 fork 以下都可见） ----
  {
    const pinfo = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 3 };
      t.updateCurveObjects(lock, { visible: true });
      const h = lock.curveObjects.tipWidthHandles[3].left[3];
      const rect = t.renderer.domElement.getBoundingClientRect();
      const c = t.projectToClient(new t.THREE.Vector3(h.position.x, h.position.y, h.position.z));
      const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
      return JSON.stringify({ x: c.x, y: c.y, rl: rect.left, rt: rect.top, rw: rect.width, rh: rect.height, meshHash, visible: h.visible });
    })()`));
    if (pinfo.visible) {
      const cx0 = Math.min(Math.max(pinfo.x, pinfo.rl + 4), pinfo.rl + pinfo.rw - 4);
      const cy0 = Math.min(Math.max(pinfo.y, pinfo.rt + 4), pinfo.rt + pinfo.rh - 4);
      const dd = dragInfo.seg3["-1:3"];
      const dl2 = Math.hypot(dd.dx, dd.dy) || 1;
      const vvx = dd.dx / dl2, vvy = dd.dy / dl2;
      await evalJS(cdp, `(() => {
        const t = window.__ahsTest; const el = t.renderer.domElement;
        const rect = el.getBoundingClientRect();
        const ndc = new t.THREE.Vector2(((${cx0} - rect.left) / rect.width) * 2 - 1, -((${cy0} - rect.top) / rect.height) * 2 + 1);
        t.raycaster.setFromCamera(ndc, t.camera());
        const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
        const all = [
          ...(lock.curveObjects.tipWidthHandles || []).flatMap((s) => [...s.left, ...s.right]),
          ...(lock.curveObjects.panelTipHandles || []),
          ...(lock.curveObjects.panelSegmentHandles || []),
          ...(lock.curveObjects.panelSplitHandles || [])
        ];
        const hits = t.raycaster.intersectObjects(all.filter((x) => x.visible), false).slice(0, 3).map((x) => ({ ud: x.object.userData, d: +x.distance.toFixed(3) }));
        window.__v2hits = hits;
        const ev = (type, x, y, buttons) => el.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
          pointerId: 45, pointerType: "mouse", isPrimary: true, view: window
        }));
        ev('pointerdown', ${cx0}, ${cy0}, 1);
        return true;
      })()`);
      await sleep(200);
      const v2drag = JSON.parse(await evalJS(cdp, `(() => { const d = window.__ahsTest.sculptState.state.panelSplitDrag; return JSON.stringify({ drag: d ? { kind: d.kind, seg: d.splitIndex, side: d.tipWidthSide, idx: d.tipWidthIndex } : null, hits: window.__v2hits }); })()`));
      check("V2 down grabs tipWidth -1", !!v2drag.drag && v2drag.drag.kind === "tipWidth" && v2drag.drag.seg === 3 && v2drag.drag.side === -1, `v2=${JSON.stringify(v2drag)}`);
      await evalJS(cdp, `(() => {
        const t = window.__ahsTest; const el = t.renderer.domElement;
        const ev = (type, x, y, buttons) => el.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
          pointerId: 45, pointerType: "mouse", isPrimary: true, view: window
        }));
        for (let step = 1; step <= 10; step += 1) ev('pointermove', ${cx0} + ${vvx} * 9 * step, ${cy0} + ${vvy} * 9 * step, 1);
        ev('pointerup', ${cx0} + ${vvx} * 90, ${cy0} + ${vvy} * 90, 0);
        return true;
      })()`);
      await sleep(500);
      const res2 = JSON.parse(await evalJS(cdp, `(() => {
        const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
        const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
        return JSON.stringify({ meshHash });
      })()`));
      check("V2 seg3 -1 side drag changes mesh", pinfo.meshHash !== res2.meshHash, `hash ${pinfo.meshHash} -> ${res2.meshHash}`);
    } else {
      check("V2 seg3 -1 idx3 handle visible", false, "hidden");
    }
  }

  // ---- 变体 V3：seg3 段 spread 手柄（绿色，单段一个） ----
  {
    const pinfo = JSON.parse(await evalJS(cdp, `(() => {
      const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      t.sculptState.state.panelTipSelection = { lockId: lock.id, segmentIndex: 3 };
      t.updateCurveObjects(lock, { visible: true });
      const h = lock.curveObjects.panelSegmentHandles[3];
      const rect = t.renderer.domElement.getBoundingClientRect();
      const c = t.projectToClient(new t.THREE.Vector3(h.position.x, h.position.y, h.position.z));
      const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
      return JSON.stringify({ x: c.x, y: c.y, rl: rect.left, rt: rect.top, rw: rect.width, rh: rect.height, meshHash, visible: h.visible });
    })()`));
    if (pinfo.visible) {
      const cx0 = Math.min(Math.max(pinfo.x, pinfo.rl + 4), pinfo.rl + pinfo.rw - 4);
      const cy0 = Math.min(Math.max(pinfo.y, pinfo.rt + 4), pinfo.rt + pinfo.rh - 4);
      await evalJS(cdp, `(() => {
        const t = window.__ahsTest; const el = t.renderer.domElement;
        const rect = el.getBoundingClientRect();
        const ndc = new t.THREE.Vector2(((${cx0} - rect.left) / rect.width) * 2 - 1, -((${cy0} - rect.top) / rect.height) * 2 + 1);
        t.raycaster.setFromCamera(ndc, t.camera());
        const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
        const all = [
          ...(lock.curveObjects.tipWidthHandles || []).flatMap((s) => [...s.left, ...s.right]),
          ...(lock.curveObjects.panelTipHandles || []),
          ...(lock.curveObjects.panelSegmentHandles || []),
          ...(lock.curveObjects.panelSplitHandles || [])
        ];
        const hits = t.raycaster.intersectObjects(all.filter((x) => x.visible), false).slice(0, 3).map((x) => ({ ud: x.object.userData, d: +x.distance.toFixed(3) }));
        window.__v3hits = hits;
        const ev = (type, x, y, buttons) => el.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
          pointerId: 46, pointerType: "mouse", isPrimary: true, view: window
        }));
        ev('pointerdown', ${cx0}, ${cy0}, 1);
        return true;
      })()`);
      await sleep(200);
      const v3drag = JSON.parse(await evalJS(cdp, `(() => { const d = window.__ahsTest.sculptState.state.panelSplitDrag; return JSON.stringify({ drag: d ? { kind: d.kind, seg: d.splitIndex } : null, hits: window.__v3hits }); })()`));
      check("V3 down grabs spread handle", !!v3drag.drag && v3drag.drag.kind === "segment" && v3drag.drag.seg === 3, `v3=${JSON.stringify(v3drag)}`);
      await evalJS(cdp, `(() => {
        const t = window.__ahsTest; const el = t.renderer.domElement;
        const ev = (type, x, y, buttons) => el.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons,
          pointerId: 46, pointerType: "mouse", isPrimary: true, view: window
        }));
        for (let step = 1; step <= 10; step += 1) ev('pointermove', ${cx0} + 9 * step, ${cy0}, 1);
        ev('pointerup', ${cx0} + 90, ${cy0}, 0);
        return true;
      })()`);
      await sleep(500);
      const res3 = JSON.parse(await evalJS(cdp, `(() => {
        const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
        const meshHash = (() => { const a = lock.mesh.geometry.attributes.position.array; let hsh = 0; for (let i = 0; i < a.length; i++) hsh += Math.abs(a[i]) * (i + 1); return hsh.toFixed(6); })();
        const bones = t.materializeSplitBones(lock);
        return JSON.stringify({ meshHash, spread: bones[3].spread });
      })()`));
      check("V3 seg3 spread-handle drag changes mesh", pinfo.meshHash !== res3.meshHash, `hash ${pinfo.meshHash} -> ${res3.meshHash} spread=${res3.spread}`);
    } else {
      check("V3 seg3 spread handle visible", false, "hidden");
    }
  }

  // ---- FD：死区确定性函数级断言（不依赖指针事件，放在所有拖拽测试之后避免污染） ----
  // seg1（边界 [-0.8067,-0.44]，全负半轴；右 zipper fork=0.5625、左 zipper fork=0.75）
  // band t=0.69375 写 primary 后：右边缘(相对侧=+1)应采样新值(修复前死区恒为全局值)，
  // 左边缘(相对侧=-1, t<0.75 仍在左侧锁定区)应保持全局值。
  const fd = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const splits = t.clonePanelSplits(lock.panelSplits, lock.panelSplitHeight);
    const bones = t.materializeSplitBones(lock);
    const bone = bones[1];
    const m0R = t.tipWidthMultiplierAt(lock, 0.69375, -0.44, bone, 1, splits);
    const m0L = t.tipWidthMultiplierAt(lock, 0.69375, -0.8066, bone, 1, splits);
    t.setTipWidthCurveValue(lock, 1, splits, bone, 1, 0.69375, 2.0);
    const m1R = t.tipWidthMultiplierAt(lock, 0.69375, -0.44, bone, 1, splits);
    const m1L = t.tipWidthMultiplierAt(lock, 0.69375, -0.8066, bone, 1, splits);
    return JSON.stringify({ m0R: +m0R.toFixed(5), m0L: +m0L.toFixed(5), m1R: +m1R.toFixed(5), m1L: +m1L.toFixed(5) });
  })()`));
  console.log("FD dead-band:", JSON.stringify(fd));
  check("FD: seg1 band write now reaches right half", Math.abs(fd.m1R - fd.m0R) > 1e-3 && Math.abs(fd.m1R - 2.0) < 0.05, `mR ${fd.m0R} -> ${fd.m1R}`);
  check("FD: seg1 left half stays locked above its fork", Math.abs(fd.m1L - fd.m0L) < 1e-6, `mL ${fd.m0L} -> ${fd.m1L}`);

  // ---- Phase B: USDA 导出数据（open 展开） vs 视口网格 ----
  const phaseB = JSON.parse(await evalJS(cdp, `(async () => {
    const { unfoldHairMesh } = await import('/modules/io/uv-unfold.js');
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
    const geo = lock.mesh.geometry;
    const unfolded = unfoldHairMesh(geo, { kind: "open" });
    if (!unfolded) return JSON.stringify({ unfolded: false });
    const qf = geo.userData.quadFaces || [];
    // 视口 quadFaces 与展开 faces 是否 1:1（顶点集与顺序）
    let facesSame = qf.length === unfolded.faces.length;
    if (facesSame) {
      for (let i = 0; i < qf.length; i += 1) {
        if (qf[i].length !== unfolded.faces[i].length) { facesSame = false; break; }
      }
    }
    // 展开 faces 中是否出现"跨段桥接"面：face 的两个顶点来自不同的 segment
    // （panelWeights 的 leafIndex）。视口 quadFaces 里也不应有。
    const w = geo.userData.panelWeights;
    const segOf = (v) => (w && w.length > v * 3) ? w[v * 3 + 1] : -1;
    const bridgeCount = (faces) => {
      let n = 0;
      for (const f of faces) {
        const segs = new Set(f.map((v) => segOf(v)).filter((s) => s >= 0));
        if (segs.size > 1) n += 1;
      }
      return n;
    };
    // 展开后的顶点已经过 grid 重排，无法直接用 panelWeights；用位置对照：
    // 取 tip 行（gridRow 最大）的 grid 顶点，看相邻 segment 边界列之间距离（缝宽）。
    const gr = geo.userData.gridRowIndices, gc = geo.userData.gridColIndices;
    let maxRow = 0; for (let i = 0; i < gr.length; i++) maxRow = Math.max(maxRow, gr[i]);
    // 视口原始：找 seg3 右边界列与 seg4 左边界列在 tip 行的位置差
    const posA = geo.attributes.position;
    const tipVertices = [];
    for (let i = 0; i < posA.count; i++) if (gr[i] === maxRow) tipVertices.push({ v: i, col: gc[i], seg: segOf(i), x: posA.getX(i), y: posA.getY(i), z: posA.getZ(i) });
    // 相邻两列（跨 segment 边界）之间的距离代表缝
    tipVertices.sort((a, b) => a.col - b.col);
    const gaps = [];
    for (let i = 1; i < tipVertices.length; i++) {
      const a = tipVertices[i - 1], b = tipVertices[i];
      if (a.seg !== b.seg && a.seg >= 0 && b.seg >= 0 && a.col !== b.col) {
        const d = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
        gaps.push({ segA: a.seg, segB: b.seg, colA: a.col, colB: b.col, dist: +d.toFixed(5) });
      }
    }
    return JSON.stringify({
      unfolded: true,
      quadCount: qf.length, unfoldFaceCount: unfolded.faces.length,
      facesSame,
      bridgeInViewport: bridgeCount(qf),
      unfoldVertCount: unfolded.positions.length / 3,
      viewportVertCount: posA.count,
      tipRow: maxRow,
      crossSegmentGaps: gaps
    });
  })()`));
  console.log("PHASE B:", JSON.stringify(phaseB, null, 1));
  check("unfold produced for panel", phaseB.unfolded === true);
  check("unfold faces 1:1 with viewport quads", phaseB.unfolded === true && phaseB.facesSame === true, `facesSame=${phaseB.facesSame}`);

  if (dumpUsda && phaseB.unfolded) {
    const usdaText = await evalJS(cdp, `(async () => {
      const { unfoldHairMesh } = await import('/modules/io/uv-unfold.js');
      const { exportAnimeHairUsda } = await import('/modules/io/usda-export.js');
      const t = window.__ahsTest;
      const lock = t.locks.find((l) => l.id === ${JSON.stringify(lockId)});
      const geo = lock.mesh.geometry;
      const unfolded = unfoldHairMesh(geo, { kind: "open" });
      const mesh = {
        name: lock.name,
        group: lock.group || "unassigned",
        layer: lock.layer || "mid",
        points: [], faces: []
      };
      for (let i = 0; i < unfolded.positions.length; i += 3) mesh.points.push([unfolded.positions[i], unfolded.positions[i + 1], unfolded.positions[i + 2]]);
      for (let i = 0; i < unfolded.uvs.length; i += 2) {}
      mesh.uvs = []; for (let i = 0; i < unfolded.uvs.length; i += 2) mesh.uvs.push([unfolded.uvs[i], unfolded.uvs[i + 1]]);
      mesh.faces = unfolded.faces.map((f) => [...f]);
      mesh.gridRowIndices = Array.from(unfolded.gridRows);
      mesh.gridColIndices = Array.from(unfolded.gridCols);
      const usda = exportAnimeHairUsda({ meshes: [mesh], curves: [], skeletons: [], rootName: lock.name });
      return btoa(unescape(encodeURIComponent(usda)));
    })()`);
    fs.writeFileSync(path.resolve(ROOT, dumpUsda), Buffer.from(usdaText, "base64"));
    console.log(`USDA dumped to ${dumpUsda}`);
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
} finally {
  chrome.kill();
  server.close();
}
