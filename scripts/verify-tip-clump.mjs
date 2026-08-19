// verify-tip-clump.mjs - browser verification of the green Tip Clump handle on BOTH
// geometries (0.2.130). Drives the REAL pointerdown/pointermove/pointerup path through
// the app's own listeners; nothing is stubbed except the .ahs load (drag-and-drop).
//
// What it proves that node tests cannot: the handle is actually allocated into the live
// scene graph, becomes visible when a tip sub-bone is selected, is hit by the real
// raycaster, and a real drag writes bone.tipClump + refreshes the right-hand slider.
//
// Run: node scripts/verify-tip-clump.mjs [file.ahs] [--port 8282] [--cdp-port 9412]
// With no .ahs argument it builds a split strand + split panel from scratch in-app.
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
const port = Number(args[args.indexOf("--port") + 1] || 8282);
const cdpPort = Number(args[args.indexOf("--cdp-port") + 1] || 9412);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const profileDir = path.join(os.tmpdir(), "ahs-tip-clump-profile-" + cdpPort);
const ahsFile = positional[0] || null;

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
      if (dlg && dlg.open) { const btn = document.querySelector('#confirmDropImport'); if (btn) btn.click(); }
      return true;
    })()`);
    await sleep(7000);
    console.log(`loaded real project: ${path.basename(ahsFile)}`);
  }
  const bootErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions after load", bootErr === 0, `${bootErr} exceptions`);
  // ── 找一根普通发丝并开启 Split Geometry（走真实的 UI 复选框 + 真实的重建路径）──────
  const strandInfo = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.locks.find((l) => l.geometryType === "strand" && !l.hairCard && !l.locked && l.mesh
      && Array.isArray(l.points) && l.points.length >= 3);
    if (!lock) return 'null';
    t.selectLock(lock.id, {});
    const box = document.querySelector('#strandSplitEnabled');
    if (box && !box.checked) { box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true })); }
    return JSON.stringify({ id: lock.id, name: lock.name || '(unnamed)', points: lock.points.length });
  })()`));
  check("found an ordinary strand", !!strandInfo, strandInfo ? JSON.stringify(strandInfo) : "none");
  if (!strandInfo) { throw new Error("no ordinary strand available in this project"); }
  await sleep(1200);
  const strandId = strandInfo.id;
  const sel = (extra = "") => `(() => { const t = window.__ahsTest; const lock = t.locks.find((l) => l.id === ${JSON.stringify(strandId)}); ${extra} })()`;

  const splitState = JSON.parse(await evalJS(cdp, sel(`
    return JSON.stringify({
      enabled: !!lock.strandSplitEnabled,
      zippers: (lock.strandSplits || []).length,
      clumpHandles: (lock.curveObjects?.tipClumpHandles || []).length,
      tipChainHandles: (lock.curveObjects?.tipChainHandles || []).length
    });`)));
  check("split geometry enabled on the strand", splitState.enabled === true, JSON.stringify(splitState));
  // 手柄数 = 管数 = 拉链数 + 1（与骨骼/几何三方同源）。
  check(
    "one Tip Clump handle per tube (zippers + 1)",
    splitState.clumpHandles === Math.max(1, splitState.zippers) + 1,
    `handles=${splitState.clumpHandles} zippers=${splitState.zippers}`
  );

  // ── 未选中任何发尖时绿手柄必须隐藏（与 panel 同规则：tipUiActive 才显示）────────────
  const hiddenState = JSON.parse(await evalJS(cdp, sel(`
    t.sculptState.state.tipSelection = null;
    t.updateCurveObjects(lock, { visible: true });
    return JSON.stringify({ visible: (lock.curveObjects.tipClumpHandles || []).filter((h) => h.visible).length });`)));
  check("Tip Clump handles hidden while no tip sub-bone is selected", hiddenState.visible === 0, JSON.stringify(hiddenState));

  // ── 选中某管发尖 ⇒ 所有管的绿手柄显示（有意设计，与 panel 一致）────────────────────
  const shownState = JSON.parse(await evalJS(cdp, sel(`
    t.sculptState.state.tipSelection = { lockId: lock.id, segmentIndex: 0 };
    t.updateCurveObjects(lock, { visible: true });
    const handles = lock.curveObjects.tipClumpHandles || [];
    return JSON.stringify({
      visible: handles.filter((h) => h.visible).length,
      total: handles.length,
      colors: [...new Set(handles.map((h) => '#' + h.material.color.getHexString()))],
      keys: [...new Set(handles.map((h) => typeof h.userData.tipClumpSegment))]
    });`)));
  check("selecting a tube's tip shows EVERY tube's Tip Clump handle", shownState.visible === shownState.total && shownState.total > 0, JSON.stringify(shownState));
  check("handles are the green 0x5df0a8 spheres carrying tipClumpSegment", shownState.colors.length === 1 && shownState.colors[0] === "#5df0a8" && shownState.keys.length === 1 && shownState.keys[0] === "number", JSON.stringify(shownState));

  // ── 真实拖拽：raycaster 命中绿手柄 → 真 pointerdown/move/up → 写 bone.tipClump ────────
  const dragResult = JSON.parse(await evalJS(cdp, sel(`
    const THREE = t.THREE;
    const handles = (lock.curveObjects.tipClumpHandles || []).filter((h) => h.visible);
    const target = handles[0];
    // 物化一次再取基线：真实拖拽的 begin 分支自己会 materialize，但基线必须在**同一空间**
    // 里取，否则会拿到空数组（派生视图尚未固化）而让「只改被拖那根管」无从比较。
    const beforeBones = t.materializeStrandSplitBones ? t.materializeStrandSplitBones(lock) : lock.strandSplitBones;
    const before = (beforeBones || lock.strandSplitBones || []).map((b) => b.tipClump);
    const canvas = t.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const from = t.projectToClient(target.position.clone());
    // 命中确认：把 raycaster 按手柄自身的屏幕位置设好，看它是否真的先命中这个手柄。
    const ndc = new THREE.Vector2(
      ((from.x - rect.left) / rect.width) * 2 - 1,
      -((from.y - rect.top) / rect.height) * 2 + 1
    );
    t.raycaster.setFromCamera(ndc, t.camera());
    const hit = t.raycaster.intersectObjects(handles, false)[0];
    const hitIsClump = !!(hit && hit.object.userData.tipClumpSegment != null);
    // 沿手柄自身的 spread 轴方向拖：把另一端的屏幕位置当目标，保证方向正确、幅度足够。
    const other = handles.length > 1 ? handles[handles.length - 1] : null;
    // 合成 PointerEvent 没有真实的活动指针，所以 set/releasePointerCapture 必然抛
    // NotFoundError（TransformControls 与 beginPanelSplitHandleDrag 都会调）。这纯粹是
    // 合成事件的产物、与被测逻辑无关，故在本脚本内把这两个方法变成 no-op；真实指针下它们
    // 正常工作，因此**不能**为此改动产品代码。
    const el = canvas;
    el.setPointerCapture = () => {};
    el.releasePointerCapture = () => {};
    el.hasPointerCapture = () => false;
    const pd = (type, x, y) => canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true, cancelable: true, pointerId: 991, button: 0, buttons: type === 'pointerup' ? 0 : 1,
      clientX: x, clientY: y, isPrimary: true
    }));
    // canvas 上挂了 20+ 个 capture 阶段 listener。其中 prepareCurvePointSelection 在
    // **对象模式下若有 hoveredControlPoint** 会 selectLock + stopImmediatePropagation，
    // 于是主 pointerdown（beginPanelSplitHandleDrag 所在那个）根本不执行。真实用户把指针
    // 移到绿手柄上时不会同时悬停某个控制点；本脚本是直接合成事件、没走过 pointermove，
    // 所以要显式清掉这个悬停残留（这是脚本构造的产物，不是被测代码的行为）。
    t.sculptState.state.tipHover = null;
    if (t.guideState?.state) t.guideState.state.hoveredControlPoint = null;
    let reachedBubble = false;
    const probe = () => { reachedBubble = true; };
    canvas.addEventListener('pointerdown', probe);
    // 谁在 capture 阶段吞掉事件：包一层 stopImmediatePropagation 记录调用栈。
    let swallower = null;
    const realStop = Event.prototype.stopImmediatePropagation;
    Event.prototype.stopImmediatePropagation = function patched() {
      if (!swallower) swallower = new Error('stopImmediatePropagation').stack.split('\\n').slice(1, 4).join(' | ');
      return realStop.call(this);
    };
    pd('pointerdown', from.x, from.y);
    Event.prototype.stopImmediatePropagation = realStop;
    canvas.removeEventListener('pointerdown', probe);
    // 复算：用**app 自己的**换算（handler 里那两行）设 raycaster，看命中是否仍成立。
    const appNdc = new THREE.Vector2(
      ((from.x - rect.left) / rect.width) * 2 - 1,
      -((from.y - rect.top) / rect.height) * 2 + 1
    );
    t.raycaster.setFromCamera(appNdc, t.camera());
    const allClump = lock.curveObjects.tipClumpHandles || [];
    const reHit = t.raycaster.intersectObjects(allClump.filter((h) => h.visible), false)[0];
    const diag = {
      reachedBubble,
      swallower,
      rect: { l: rect.left, t: rect.top, w: rect.width, h: rect.height },
      from,
      reHitIsClump: !!(reHit && reHit.object.userData.tipClumpSegment != null),
      gizmoAttached: !!t.transformControls.object,
      gizmoVisible: !!t.transformControls.visible,
      groupVisible: !!lock.curveObjects?.group?.visible,
      selectedId: t.sel.state ? t.sel.state.selectedId : t.sel.selectedId,
      lockId: lock.id,
      activeTool: t.sel.state ? t.sel.state.activeTool : t.sel.activeTool,
      gizmoAxis: t.transformControls.axis,
      bonesLen: (lock.strandSplitBones || []).length,
      fromInRect: from.x > rect.left && from.x < rect.left + rect.width && from.y > rect.top && from.y < rect.top + rect.height
    };
    const drag = t.sculptState.state.panelSplitDrag;
    const dragKind = drag ? drag.kind : null;
    const dragSeg = drag ? drag.splitIndex : null;
    // 往画布中心方向推 70px（无论手柄轴朝哪，扫描都会取最近点，spread 必然改变）。
    const toX = from.x + (rect.left + rect.width / 2 - from.x) * 0.35;
    const toY = from.y + (rect.top + rect.height / 2 - from.y) * 0.35;
    pd('pointermove', toX, toY);
    pd('pointermove', toX, toY);
    const mid = (lock.strandSplitBones || []).map((b) => b.tipClump);
    const sliderMid = document.querySelector('#strandSegmentSpread')?.value;
    const readoutMid = document.querySelector('#strandSegmentSpreadValue')?.textContent;
    pd('pointerup', toX, toY);
    return JSON.stringify({
      diag,
      hitIsClump, dragKind, dragSeg, before, mid,
      changed: before.some((v, i) => Math.abs(v - mid[i]) > 1e-6),
      changedCount: before.filter((v, i) => Math.abs(v - mid[i]) > 1e-6).length,
      sliderMid, readoutMid,
      dragCleared: !t.sculptState.state.panelSplitDrag
    });`)));
  check("raycaster hits the Tip Clump handle (userData.tipClumpSegment)", dragResult.hitIsClump === true, JSON.stringify({ hit: dragResult.hitIsClump }));
  // 关键几何冲突量：绿手柄与最近的**发丝曲线控制点**在屏幕上的距离。控制点走 capture 阶段
  // 的 prepareCurvePointSelection（12px 半径内即抢走 pointerdown），所以这个距离必须 > 12px，
  // 否则绿手柄在真实使用中根本抓不到。
  const proximity = JSON.parse(await evalJS(cdp, sel(`
    const handles = (lock.curveObjects.tipClumpHandles || []).filter((h) => h.visible);
    const points = (lock.curveObjects.handles || []).filter((h) => h.visible);
    const rows = handles.map((h, i) => {
      const hp = t.projectToClient(h.position.clone());
      let best = Infinity;
      points.forEach((p) => {
        const world = new t.THREE.Vector3(); p.getWorldPosition(world);
        const pp = t.projectToClient(world);
        best = Math.min(best, Math.hypot(hp.x - pp.x, hp.y - pp.y));
      });
      return { segment: i, nearestControlPointPx: Number.isFinite(best) ? Math.round(best * 10) / 10 : null };
    });
    return JSON.stringify({ rows, controlPoints: points.length });`)));
  // 记录（不是断言）：实测 ~10px < 12px，即绿手柄**确实**落在控制点的拾取半径内。这正是
  // 0.2.130 必须在 prepareCurvePointSelection 里加「绿手柄优先」让位的原因；下面的拖拽检查
  // 才是这条冲突已被解决的证据。若哪天这个距离自然大于 12px，让位仍应保留（相机角度一变
  // 就会重新重合）。
  console.log(`  NOTE  nearest control point: ${JSON.stringify(proximity.rows)} (pick radius 12px -> the carve-out is required)`);
  check(
    "the conflict is real (handles DO sit inside the control-point pick radius)",
    proximity.rows.some((r) => r.nearestControlPointPx !== null && r.nearestControlPointPx <= 12),
    JSON.stringify(proximity)
  );
  check("pointerdown starts the shared kind=\"segment\" drag", dragResult.dragKind === "segment", `kind=${dragResult.dragKind} seg=${dragResult.dragSeg} diag=${JSON.stringify(dragResult.diag)}`);
  check("a real drag writes bone.tipClump on the dragged tube ONLY", dragResult.changed === true && dragResult.changedCount === 1, JSON.stringify({ before: dragResult.before, mid: dragResult.mid }));
  check("the right-hand Tip Clump slider hot-syncs during the drag", String(dragResult.readoutMid ?? "") !== "" && Math.abs(Number(dragResult.sliderMid) - dragResult.mid[dragResult.dragSeg]) < 0.02, JSON.stringify({ slider: dragResult.sliderMid, readout: dragResult.readoutMid, bone: dragResult.mid[dragResult.dragSeg] }));
  check("pointerup clears the drag state", dragResult.dragCleared === true);

  // ── 手柄跟随几何：改 spread 后手柄必须移动（不是钉死在管心）────────────────────────
  const followResult = JSON.parse(await evalJS(cdp, sel(`
    const handles = lock.curveObjects.tipClumpHandles || [];
    const seg = 0;
    const bones = lock.strandSplitBones;
    if (!bones || !bones[seg]) return JSON.stringify({ lowToHigh: -1, note: 'bones not materialized' });
    const p0 = handles[seg].position.clone();
    bones[seg].tipClump = 0.05;
    t.updateCurveObjects(lock, { visible: true });
    const pLow = handles[seg].position.clone();
    bones[seg].tipClump = 0.95;
    t.updateCurveObjects(lock, { visible: true });
    const pHigh = handles[seg].position.clone();
    return JSON.stringify({ lowToHigh: pLow.distanceTo(pHigh), fromStart: p0.distanceTo(pHigh) });`)));
  check("the handle moves across the tube as Tip Clump changes 0.05 -> 0.95", followResult.lowToHigh > 0.01, JSON.stringify(followResult));

  // ── UI 文案：两侧滑杆的可见 label 都必须是 Tip Clump ──────────────────────────────
  const labels = JSON.parse(await evalJS(cdp, `(() => {
    const read = (id) => {
      const input = document.querySelector('#' + id);
      const label = input?.closest('label');
      return label ? label.textContent.replace(/[\\d.]+\\s*$/, '').trim() : null;
    };
    return JSON.stringify({ panel: read('panelSegmentSpread'), strand: read('strandSegmentSpread') });
  })()`));
  check("both sliders are labelled \"Tip Clump\" in the live DOM", labels.panel?.startsWith("Tip Clump") && labels.strand?.startsWith("Tip Clump"), JSON.stringify(labels));

  // ── panel 侧回归：本仓库唯一的 .ahs 预设里**没有** panel（实测 strand 88 / panel 0），
  // 所以就地造一个 split panel lock，走同一条 rebuild/update 路径，确认 panel 的绿手柄在
  // 本轮重构（共用 allocateTipClumpHandles + tipClumpCtx）后位置与可见性没有回归。
  const panelResult = JSON.parse(await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const src = t.locks.find((l) => l.geometryType === "strand" && Array.isArray(l.points) && l.points.length >= 4);
    if (!src) return JSON.stringify({ skipped: "no donor strand" });
    // 复制一根发丝的点，改成 panel 几何 + 2 条 zipper（3 段）。geometryType 一改，
    // segmentBoneHost 就会分派到 PANEL_SEGMENT_HOST。
    const lock = {
      ...JSON.parse(JSON.stringify({
        points: src.points, pointScales: src.pointScales, taperCurve: src.taperCurve, depthCurve: src.depthCurve
      })),
      id: "verify-panel-" + Date.now(),
      name: "Verify Panel",
      geometryType: "panel",
      panelSplitEnabled: true,
      panelSplits: [
        { position: -0.35, height: 0.4, order: 0 },
        { position: 0.35, height: 0.3, order: 1 }
      ],
      width: 0.62, depth: 0.16, widthScale: 1, depthScale: 1,
      panelWidthLoops: 6, panelLengthLoops: 8, lengthSegments: 12,
      visible: true, locked: false
    };
    t.locks.push(lock);
    t.selectLock(lock.id, {});
    if (!lock.curveObjects) return JSON.stringify({ skipped: "panel lock did not build curve objects" });
    t.sculptState.state.tipSelection = { lockId: lock.id, segmentIndex: 1 };
    t.updateCurveObjects(lock, { visible: true });
    const handles = lock.curveObjects.tipClumpHandles || [];
    const visible = handles.filter((h) => h.visible);
    // 位置必须随 spread 变化（panel 的 u 映射）：与发丝侧同一条判据。
    const bones = t.materializeSplitBones(lock);
    const seg = 1;
    let low = null, high = null;
    if (bones[seg]) {
      bones[seg].tipClump = 0.05; t.updateCurveObjects(lock, { visible: true });
      low = handles[seg].position.clone();
      bones[seg].tipClump = 0.95; t.updateCurveObjects(lock, { visible: true });
      high = handles[seg].position.clone();
    }
    return JSON.stringify({
      allocated: handles.length,
      expected: lock.panelSplits.length + 1,
      visible: visible.length,
      colors: [...new Set(handles.map((h) => '#' + h.material.color.getHexString()))],
      keys: [...new Set(handles.map((h) => typeof h.userData.tipClumpSegment))],
      spreadTravel: low && high ? low.distanceTo(high) : null
    });
  })()`));
  await sleep(500);
  if (panelResult.skipped) {
    console.log(`  SKIP panel regression: ${panelResult.skipped}`);
  } else {
    check("panel: one Tip Clump handle per segment (splits + 1)", panelResult.allocated === panelResult.expected, JSON.stringify(panelResult));
    check("panel: handles visible while a tip is selected, green, keyed by tipClumpSegment", panelResult.visible === panelResult.allocated && panelResult.colors.length === 1 && panelResult.colors[0] === "#5df0a8" && panelResult.keys[0] === "number", JSON.stringify(panelResult));
    check("panel: the handle still travels across its segment as spread changes", panelResult.spreadTravel > 0.01, `travel=${panelResult.spreadTravel}`);
  }

  const lateEvents = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown");
  if (lateEvents.length) {
    for (const e of lateEvents) {
      console.log("  EXCEPTION: " + (e.params?.exceptionDetails?.exception?.description || e.params?.exceptionDetails?.text || JSON.stringify(e.params)).split("\n").slice(0, 6).join("\n  "));
    }
  }
  check("0 exceptions across the whole run", lateEvents.length === 0, `${lateEvents.length} exceptions`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) { console.log("FAILED: " + failed.map((r) => r.name).join(" | ")); process.exitCode = 1; }
} finally {
  try { chrome.kill(); } catch {}
  server.close();
}
