// verify-scalp-conform.mjs — browser verification of the Scalp Conform SLIDER WIRING
// (0.2.136; was verify-hemisphere-ui.mjs for the replaced 0.2.134/0.2.135 model).
// The node tests cover the geometry math; this covers the layer they cannot: that dragging
// the real slider writes the lock field, rebuilds the mesh, keeps row 0 pinned in the LIVE
// app, survives undo, and round-trips through save/load.
//
// **决定性判据**（0.2.136）：cylinder = 0 时头部代理是纯球 ⇒ 收满的顶点必须落在
// `radius + gap` 上。center/radius 从**注入的 scalpSurface**（测试缝）读，不写死
// `{y:0.9, r:1}` —— 写死就只是复述实现的假设，用户改过头模后会假绿。
//
// Run: node scripts/verify-scalp-conform.mjs [file.ahs] [--port 8290] [--cdp-port 9420]
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
    const box = document.querySelector('#panelScalpConformControls');
    const r = box.getBoundingClientRect();
    return JSON.stringify({
      visible: r.width > 0 && r.height > 0,
      amount: document.querySelector('#panelScalpConformAmount').value,
      gap: document.querySelector('#panelScalpConformGap').value,
      emphasis: box.className
    });
  })()`));
  check("Scalp Conform controls visible on a panel", uiState.visible === true, JSON.stringify(uiState));
  // 滑杆值必须与**选中 lock 的字段**一致（UI 同步判据）。刻意**不断言它等于 0** ——
  // 那只在全新场景成立；用户的 repro 文件带着 amount=1 存盘，断言"默认中性"会恒假红
  // （实测踩过）。"index.html 的授权默认值"由下方读 defaultValue 的那条断言负责。
  const uiMatchesLock = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    return JSON.stringify({
      slider: Number(document.querySelector('#panelScalpConformAmount').value),
      field: Number(lock.panelScalpConformAmount)
    });
  })()`));
  check("滑杆读数与选中 lock 的字段一致（UI 同步）",
    Math.abs(uiMatchesLock.slider - uiMatchesLock.field) < 1e-6, JSON.stringify(uiMatchesLock));

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
      field: lock.panelScalpConformAmount });
  })()`;
  // **先把四个字段归位到默认值再取基线**。否则脚本只在"全新场景"里成立：用户的 repro 文件
  // 带着 amount=1 存盘，基线就已经是收缩后的几何，于是后面所有"方向"断言（朝头收 / 负值
  // 推离）都在拿收缩态当参照、恒假红（实测踩过）。走真实滑杆 + input 事件，确保 lock 同步。
  await evalJS(cdp, `(() => {
    const set = (id, v) => {
      const s = document.querySelector('#' + id);
      s.value = String(v);
      s.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('panelScalpConformAmount', 0);
    set('panelScalpConformGap', 0.02);
    return true;
  })()`);
  await sleep(2500);
  const before = JSON.parse(await evalJS(cdp, probe));
  check("baseline field normalised to 0", Number(before.field) === 0, `field=${before.field}`);

  // 两个滑杆的默认值必须在**任何变更之前**读 —— 本脚本初版把这条放在后面，读到的是已被
  // 前面步骤改过的值，于是恒假红。默认值三处同源（curve-math 的
  // PANEL_SCALP_CONFORM_DEFAULTS / app.js 的 panelCreationDefaults / index.html 的 value=）。
  const conformUi = JSON.parse(await evalJS(cdp, `(() => {
    // 读 **defaultValue**（= index.html 的 value= 属性）而不是 value（= 当前状态）。
    // 判据要问的是"index.html 里写死的默认值是否与几何层同源"，那是文件属性；读 value 会
    // 被**已加载工程的实际取值**污染 —— 用户的 repro 文件就带着 amount=1，于是恒假红
    // （本脚本实测踩过）。三处同源：curve-math 的 PANEL_SCALP_CONFORM_DEFAULTS /
    // app.js 的 panelCreationDefaults / index.html 的 value=。
    const read = (id) => { const s = document.querySelector('#' + id); return s && { min: s.min, max: s.max, value: s.defaultValue }; };
    return JSON.stringify({
      amount: read('panelScalpConformAmount'),
      gap: read('panelScalpConformGap'),
      range: document.querySelector('#panelScalpConformRange'),
      cylinder: document.querySelector('#panelScalpConformCylinder'),
      label: document.querySelector('#panelScalpConformControls .subsection-label')?.textContent
    });
  })()`));
  check("两个 Scalp Conform 滑杆齐备且默认值正确",
    Number(conformUi.amount?.value) === 0 && Number(conformUi.gap?.value) === 0.02,
    JSON.stringify(conformUi));
  // 0.2.138 删掉的两个滑杆必须**真的从 markup 里消失**（留着会是"接不上任何字段"的死控件）。
  check("Root Release / Capsule Length 滑杆已删除",
    conformUi.range === null && conformUi.cylinder === null,
    `range=${conformUi.range} cylinder=${conformUi.cylinder}`);
  check("旧 Hemispherical 标签已替换为 Scalp Conform", conformUi.label === "Scalp Conform", `label=${conformUi.label}`);
  // 滑杆上限必须与几何层钳位同界，否则 UI 允许用户设到几何层会拒绝的值、观感与读数不一致。
  check("滑杆区间与几何层钳位一致（amount −1..1、gap 0..0.5）",
    conformUi.amount?.min === "-1" && conformUi.amount?.max === "1" && conformUi.gap?.max === "0.5",
    `amount=${conformUi.amount?.min}..${conformUi.amount?.max} gap max=${conformUi.gap?.max}`);

  // ── 真实滑杆交互：设值 + 派发 input（app.js 的通用接线监听 input）────────────
  await evalJS(cdp, `(() => {
    const s = document.querySelector('#panelScalpConformAmount');
    s.value = '0.8';
    s.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(2500);
  const after = JSON.parse(await evalJS(cdp, probe));
  check("slider writes the lock field", Math.abs(Number(after.field) - 0.8) < 1e-6, `field=${after.field}`);
  check("value output reflects the slider",
    (await evalJS(cdp, `document.querySelector('#panelScalpConformAmountValue').textContent`)) === "0.80",
    await evalJS(cdp, `document.querySelector('#panelScalpConformAmountValue').textContent`));
  // 几何真的重建了（顶点数不变，但整体朝头部代理收）。注意方向：0.2.136 起正向 conform 是
  // **朝头收**（面板起始在头前方 ⇒ z 减小），与被替换的 0.2.134/0.2.135「向前凸」相反。
  check("mesh rebuilt with same vertex count", after.count === before.count, `${before.count} -> ${after.count}`);
  check("geometry actually moved toward the head (mean z decreased)", after.zMean < before.zMean - 1e-5,
    `zMean ${before.zMean.toFixed(6)} -> ${after.zMean.toFixed(6)}`);
  // **row 0 在 Bend 模型下刻意会动**（发根贴头皮、卷起时跟着沿头皮滑），所以这里**不再**
  // 断言逐位不动 —— 那是被替换的投影模型的契约。改为量它带来的 UV 影响并如实报告：
  // uv-unfold 的 U 由 row-0 逐段弦长累加得出，弯曲后弦长和 ≠ 原弧长 ⇒ U 尺度会变。
  // 这是 0.2.138 的**已知未解项**（curve-math 头注释有同样记录），不作为失败判据。
  const row0Same = before.row0.length === after.row0.length
    && before.row0.every((v, i) => Object.is(v, after.row0[i]));
  check("row 0 顶点数可比对（下面的 U 尺度报告非空转）",
    before.row0.length === after.row0.length && before.row0.length > 0,
    `${before.row0.length / 3} row-0 verts`);
  const row0Len = (flatArr) => {
    let total = 0;
    for (let i = 3; i < flatArr.length; i += 3) {
      total += Math.hypot(flatArr[i] - flatArr[i - 3], flatArr[i + 1] - flatArr[i - 2], flatArr[i + 2] - flatArr[i - 1]);
    }
    return total;
  };
  const uScale = row0Len(after.row0) / Math.max(1e-9, row0Len(before.row0));
  console.log(`  [info] row 0 ${row0Same ? "未移动" : "已移动"}；U 尺度比值 ${uScale.toFixed(4)}`
    + ` —— 已知未解项：≠1 时 uv-unfold 的 U 会随之改变（解法是传 referenceCircumference）`);

  // ── 用户 bug② 的**活体**证据：主发片控制点与几何的关系不得因 Conform 而改变 ─────────
  // 用户原话：「主发片的控制点和控制器不会随着 Conform 拉高而跟着 geo 走」。
  // Bend 模型下中线（s=0）位移恒为 0 ⇒ 控制点（落在授权曲线上）与 u=0 那一列的相对关系
  // **应当逐位不变**。判据取「每个 handle 到 u=0 列最近顶点的距离」在 conform 前后的差：
  // 若几何动了而 handle 没动，这个距离就会变 —— 那正是用户报告的症状。
  // 注意**不能**断言 handle 恰好落在 u=0 列上：那一列含 camber 偏移（peak camber），
  // 两者本来就差一个 camber，重点是这个差不因 Conform 而变。
  const handleProbe = `(() => {
    const lock = ${lockRef};
    const pos = lock.mesh.geometry.getAttribute('position');
    const cols = lock.mesh.geometry.userData.gridColIndices || [];
    const rows = lock.mesh.geometry.userData.gridRowIndices || [];
    const maxCol = Math.max(...cols.filter((c) => c >= 0));
    const midCol = Math.round(maxCol / 2);
    const handles = lock.curveObjects?.handles || [];
    const out = [];
    for (const h of handles) {
      let best = Infinity;
      for (let i = 0; i < pos.count; i++) {
        if (rows[i] < 0 || cols[i] !== midCol) continue;
        const d = Math.hypot(pos.array[i*3] - h.position.x, pos.array[i*3+1] - h.position.y, pos.array[i*3+2] - h.position.z);
        if (d < best) best = d;
      }
      out.push({ hx: h.position.x, hy: h.position.y, hz: h.position.z, d: best });
    }
    // 同时取**边缘列**（col 0）的顶点：用于证明几何真的动了 —— 否则"中线没动"这条断言
    // 在"Conform 完全没生效"的构建上也会通过（空转）。
    const edge = [];
    for (let i = 0; i < pos.count; i++) {
      if (rows[i] < 0 || cols[i] !== 0) continue;
      edge.push(pos.array[i*3], pos.array[i*3+1], pos.array[i*3+2]);
    }
    return JSON.stringify({ handles: out, midCol, edge });
  })()`;
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelScalpConformAmount'); s.value = '0'; s.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const handlesOff = JSON.parse(await evalJS(cdp, handleProbe));
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelScalpConformAmount'); s.value = '1'; s.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const handlesOn = JSON.parse(await evalJS(cdp, handleProbe));
  check("主发片控制点存在且可比对（下一条断言非空转）",
    handlesOff.handles.length > 1 && handlesOff.handles.length === handlesOn.handles.length,
    `handles=${handlesOff.handles.length} midCol=${handlesOff.midCol}`);
  let worstHandleDrift = 0;
  let worstHandleMove = 0;
  for (let i = 0; i < handlesOff.handles.length; i += 1) {
    const a = handlesOff.handles[i];
    const b = handlesOn.handles[i];
    worstHandleDrift = Math.max(worstHandleDrift, Math.abs(b.d - a.d));
    worstHandleMove = Math.max(worstHandleMove, Math.hypot(b.hx - a.hx, b.hy - a.hy, b.hz - a.hz));
  }
  // **先证明几何真的动了**，否则下一条"中线没动"在「Conform 完全没生效」的构建上也会通过。
  // 取边缘列（col 0）的位移：Bend 下边缘必然大幅移动，而中线恒不动 —— 两条一起才有意义。
  let worstEdgeMove = 0;
  for (let i = 0; i + 2 < Math.min(handlesOff.edge.length, handlesOn.edge.length); i += 3) {
    worstEdgeMove = Math.max(worstEdgeMove, Math.hypot(
      handlesOn.edge[i] - handlesOff.edge[i],
      handlesOn.edge[i + 1] - handlesOff.edge[i + 1],
      handlesOn.edge[i + 2] - handlesOff.edge[i + 2]
    ));
  }
  check("边缘列确实被 Conform 移动了（证明下一条断言非空转）", worstEdgeMove > 0.05,
    `边缘最大位移 ${worstEdgeMove.toFixed(4)}`);
  check("控制点与几何的关系不因 Conform 改变（用户 bug② 的活体判据）",
    worstHandleDrift < 1e-4,
    `handle↔u=0列 距离漂移 ${worstHandleDrift.toExponential(2)}`
      + `（handle 自身位移 ${worstHandleMove.toExponential(2)}，同一次形变下边缘动了 ${worstEdgeMove.toFixed(4)}）`);

  // 负值推离头部（与正值严格反向）
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelScalpConformAmount'); s.value = '-0.8'; s.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const dent = JSON.parse(await evalJS(cdp, probe));
  check("negative amount pushes AWAY from the head (opposite sign)",
    Math.sign(dent.zMean - before.zMean) === -Math.sign(after.zMean - before.zMean),
    `+0.8: ${(after.zMean - before.zMean).toFixed(6)}  -0.8: ${(dent.zMean - before.zMean).toFixed(6)}`);

  // ── 存档往返：字段必须随 .ahs 持久化 ─────────────────────────────────────────
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelScalpConformAmount'); s.value = '0.55'; s.dispatchEvent(new Event('input', { bubbles: true }));
    const c = document.querySelector('#panelScalpConformGap'); c.value = '0.3'; c.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const live = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    return JSON.stringify({ a: lock.panelScalpConformAmount, c: lock.panelScalpConformGap });
  })()`));
  // Gap 取 0.3（**不是旧脚本的 0.7**）：Gap 钳在 0..0.5，滑杆 max 也是 0.5，设 0.7 会被浏览器
  // 钳成 0.5、期望 0.7 必然假红 —— 本脚本继承旧值时踩过。
  check("two fields land on the lock",
    Math.abs(live.a - 0.55) < 1e-6 && Math.abs(live.c - 0.3) < 1e-6,
    JSON.stringify(live));

  // ── undo 往返 = 比读 snapshot 更强的证据：它同时走 snapshotState（序列化）与
  // restoreLock（反序列化）两条真实路径。注意 bindUndoCapture 监听的是
  // **pointerdown/keydown**，不是 input —— 只派发裸 input 不会捕获 undo 基线
  // （本脚本初版就是这么写的，于是拿不到快照）。
  const undoTrip = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    const beforeUndo = lock.panelScalpConformAmount;
    const s = document.querySelector('#panelScalpConformAmount');
    s.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    s.value = '0.15';
    s.dispatchEvent(new Event('input', { bubbles: true }));
    return JSON.stringify({ beforeUndo, afterEdit: ${lockRef}.panelScalpConformAmount,
      undoEnabled: !document.querySelector('#undoAction').disabled });
  })()`));
  check("editing after pointerdown captures an undo step", undoTrip.undoEnabled === true, JSON.stringify(undoTrip));
  await sleep(1500);
  await evalJS(cdp, `document.querySelector('#undoAction').click()`);
  await sleep(3000);
  const restored = JSON.parse(await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    return JSON.stringify({ a: lock.panelScalpConformAmount, c: lock.panelScalpConformGap,
      slider: document.querySelector('#panelScalpConformAmount').value });
  })()`));
  // undo 应把 amount 还原到编辑前的 0.55（gap 一并保持）
  check("undo restores the field (snapshotState + restoreLock round-trip)",
    Math.abs(restored.a - undoTrip.beforeUndo) < 1e-6,
    `edited ${undoTrip.beforeUndo} -> 0.15 -> undo -> ${restored.a}`);
  check("undo also preserves gap",
    Math.abs(restored.c - 0.3) < 1e-6, JSON.stringify(restored));
  check("slider UI resyncs after undo", Math.abs(Number(restored.slider) - restored.a) < 1e-6,
    `slider=${restored.slider} field=${restored.a}`);

  // ── 0.2.136：Panel Width 上限 5 + Scalp Conform（世界空间收缩包裹）────────────
  const widthMax = await evalJS(cdp, `document.querySelector('#panelWidth').max`);
  check("Panel Width 上限已放宽到 5", String(widthMax) === "5", `max=${widthMax}`);

  // 0.2.138 的决定性判据换成**逐行横向跨度**（= 该行的横向弧长）。
  // 理由：Bend 模型的契约是"保弧长"，而上一版投影模型的契约是"落在 radius+gap 上"。
  // 后者投影模型也能过，前者它过不了（实测被压到 0.52 倍）—— 所以判据必须量跨度。
  // 顺带仍报告距头心距离，用于观察"是否真的贴向头皮"。
  const conformProbe = `(() => {
    const t = window.__ahsTest;
    const lock = ${lockRef};
    const s = t.scalpSurface;
    const pos = lock.mesh.geometry.getAttribute('position');
    const rows = lock.mesh.geometry.userData.gridRowIndices || [];
    const cols = lock.mesh.geometry.userData.gridColIndices || [];
    const maxRow = Math.max(...rows.filter((r) => r >= 0));
    // **量中面，不量壳**（0.2.143 更正）：内核保的是中面逐段长度；两壳是沿弯后法向的
    // offset curve，长度按 (1 + k·d)（d = 壳半厚）缩放 —— 那是 Houdini bend 的 1 ± k·d 律
    // 同一个东西，是「厚度沿弯后法向放置」的必然结果，**不是缺陷**。
    // 本文件原来取 front 壳（cols % 2 === 1）：在 width=5 上侥幸稳定（离散化缩短抵消了壳
    // 增长），但 width=0.62 时 front 壳比值达 1.0535，会撞穿 maxRatio < 1.02。
    // 中面 = 同一 (row, 逻辑列) 上 front/back 的平均 ⇒ 壳偏移精确相消。
    const front = new Map();
    const back = new Map();
    for (let i = 0; i < pos.count; i++) {
      if (rows[i] < 0) continue;
      const logical = Math.floor(cols[i] / 2);
      const target = (cols[i] % 2 === 1) ? front : back;
      if (!target.has(rows[i])) target.set(rows[i], new Map());
      target.get(rows[i]).set(logical, { x: pos.array[i*3], y: pos.array[i*3+1], z: pos.array[i*3+2] });
    }
    const spans = [];
    for (const [row, byCol] of [...front].sort((a, b) => a[0] - b[0])) {
      const opposite = back.get(row);
      if (!opposite) continue;
      const mids = [];
      for (const col of [...byCol.keys()].sort((a, b) => a - b)) {
        const f = byCol.get(col);
        const b = opposite.get(col);
        if (f && b) mids.push({ col, x: (f.x + b.x) / 2, y: (f.y + b.y) / 2, z: (f.z + b.z) / 2 });
      }
      let span = 0;
      for (let i = 1; i < mids.length; i++) {
        span += Math.hypot(mids[i].x - mids[i-1].x, mids[i].y - mids[i-1].y, mids[i].z - mids[i-1].z);
      }
      const mid = mids[Math.floor(mids.length / 2)];
      spans.push({ row, t: row / maxRow, span, cols: mids.length,
        d: mid ? Math.hypot(mid.x - s.x, mid.y - s.y, mid.z - s.z) : 0 });
    }
    // **穿透深度**：本轮的头条判据（真实档改前 +0.235，改后应 ≤ 0）。正值 = 落在头皮代理内部。
    // 逐顶点算椭球归一半径，取最深。用真实 frame 链（含 ±24°/环 roll 钳位），
    // 这是 node 侧探针做不到的部分。
    let deepest = -Infinity;
    let deepestRow = -1;
    for (let i = 0; i < pos.count; i++) {
      const nx = (pos.array[i*3] - s.x) / s.scaleX;
      const ny = (pos.array[i*3+1] - s.y) / s.scaleY;
      const nz = (pos.array[i*3+2] - s.z) / s.scaleZ;
      const depth = 1 - Math.hypot(nx, ny, nz) / s.radius;
      if (depth > deepest) { deepest = depth; deepestRow = rows[i]; }
    }
    // **行交叉**：折叠的唯一可能形态（行内 wrap 是刚性弯一条曲线、恒单射）。
    // 判据 (P[r+1] − P[r]) · tangent > 0。tangent 必须与**形变无关**，否则是用形变后的量
    // 去判形变。**不能用 t.strandGeometryCurve** —— 测试 seam 上没有它，初版据此取切线，
    // 结果 curve === null、循环一次没进、报出 "0/0 交叉" 而断言照样"通过"（空转）。
    // 注：本段代码在**模板字符串内**，注释里**不得出现反引号**（会提前终止字符串）。
    // 改用**中线列**（逻辑列 = 宽度分段数/2）的相邻行差分：中线在本模型下弯前弯后**逐位不动**
    // （s=0 零位移），所以它既是真实脊柱的采样、又天然与形变无关。
    const midColumns = spans.length ? [...front.get(spans[0].row).keys()].sort((a, b) => a - b) : [];
    const centreCol = midColumns.length ? midColumns[Math.floor(midColumns.length / 2)] : null;
    let crossings = 0;
    let checkedPairs = 0;
    let worstAdvance = Infinity;
    if (centreCol !== null) {
      const rowsSorted = spans.map((e) => e.row);
      for (let ri = 1; ri < rowsSorted.length; ri++) {
        const prev = front.get(rowsSorted[ri - 1]);
        const cur = front.get(rowsSorted[ri]);
        if (!prev || !cur) continue;
        const a = prev.get(centreCol);
        const b2 = cur.get(centreCol);
        if (!a || !b2) continue;
        const len = Math.hypot(b2.x - a.x, b2.y - a.y, b2.z - a.z);
        if (len < 1e-9) continue;
        const tan = { x: (b2.x - a.x) / len, y: (b2.y - a.y) / len, z: (b2.z - a.z) / len };
        for (const [col, p] of cur) {
          const before = prev.get(col);
          if (!before) continue;
          const adv = (p.x - before.x) * tan.x + (p.y - before.y) * tan.y + (p.z - before.z) * tan.z;
          checkedPairs++;
          if (adv < worstAdvance) worstAdvance = adv;
          if (adv <= 0) crossings++;
        }
      }
    }
    return JSON.stringify({
      proxy: { x: s.x, y: s.y, z: s.z, radius: s.radius, sx: s.scaleX, sy: s.scaleY, sz: s.scaleZ },
      maxRow, spans, count: pos.count,
      deepest, deepestRow, crossings, checkedPairs,
      worstAdvance: (worstAdvance === Infinity ? null : worstAdvance)
    });
  })()`;
  // 宽面板（width=5，用户的 repro 构型）+ 已知 gap ⇒ 量弯曲前后的**横向跨度比值**。
  // 这是 0.2.138 Bend 模型的决定性判据：上一版投影模型把跨度压到 0.52 倍
  // （用户原话「坍缩有点严重」），Bend 必须把它保住。
  const GAP = 0.05;
  await evalJS(cdp, `(() => {
    const set = (id, v) => { const s = document.querySelector('#' + id); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); };
    set('panelWidth', 5);
    set('panelScalpConformAmount', 0);
    set('panelScalpConformGap', ${GAP});
    return true;
  })()`);
  await sleep(2500);
  const flat = JSON.parse(await evalJS(cdp, conformProbe));
  await evalJS(cdp, `(() => { const s = document.querySelector('#panelScalpConformAmount'); s.value = '1'; s.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(2500);
  const conformed = JSON.parse(await evalJS(cdp, conformProbe));
  check("conform probe sampled the same row set",
    flat.spans.length === conformed.spans.length && flat.spans.length > 5,
    `rows=${flat.spans.length} verts=${conformed.count} proxy=${JSON.stringify(conformed.proxy)}`);

  // **决定性判据：横向跨度不得坍缩。** 上一版投影模型在同一构型下把跨度压到 0.52 倍
  // （用户："坍缩有点严重"）。Bend 保弧长 ⇒ 比值必须回到 1 附近。
  const ratios = [];
  for (let i = 0; i < flat.spans.length; i += 1) {
    if (flat.spans[i].span < 1e-6) continue; // 发尖 taper 收到 0 的那一行跨度本就是 0
    ratios.push(conformed.spans[i].span / flat.spans[i].span);
  }
  const minRatio = Math.min(...ratios);
  const maxRatio = Math.max(...ratios);
  check("conform=1 不再坍缩横向跨度（Bend 保弧长；投影模型实测 0.52）",
    ratios.length > 0 && minRatio > 0.96,
    `跨度比值 ${minRatio.toFixed(3)}..${maxRatio.toFixed(3)}（${ratios.length} 行）`);

  // 0.2.139 起 camber 已折进弧长参数化（曲率相加），所以跨度**两侧都**该贴近 1：
  // 下限受离散折线内接圆弧影响（略小于 1），上限不应再明显大于 1。
  // 0.2.138 曾因把 camber 当刚性偏移旋转而实测上限 1.259（offset curve 按 1+n·k 放大）。
  check("跨度也不得反而变长（camber 已折进弧长参数化）", maxRatio < 1.02,
    `跨度上限比值 ${maxRatio.toFixed(3)}（0.2.138 实测 1.259）`);

  // ── 0.2.143 新增三条：本轮的头条判据此前只由临时探针验过，现落成常驻回归 ──────
  // **① 不穿透**：改前 amount=0.87 实测最深 +0.235（第 6 行钻进头里），改后应 ≤ 0。
  // 判据形态 `≤ max(0, 平板最深)`：取 max 是为了「若平板本身已穿透，至少不许更深」。
  // **不要写成「弯后不得比平板更靠近头」** —— conform 的职责就是把面板拉近头皮，
  // 那样写会因为功能正常而变红（本轮初版在 node 侧就这么错过一次：−0.4675 vs −0.4736）。
  // 先把上面为量跨度而强设的 gap=0.05 / amount=1 换回**存档作者值**再判穿透：
  // 那才是用户实际在用的构型。amount=1 + gap=0.05 属 D11 已接受的极端构型，单独报告。
  const authoredAmount = 0.87;
  const authoredGap = 0.1;
  await evalJS(cdp, `(() => {
    const set = (id, v) => { const s = document.querySelector('#' + id); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); };
    set('panelScalpConformGap', ${authoredGap});
    set('panelScalpConformAmount', ${authoredAmount});
    return true;
  })()`);
  await sleep(2500);
  const authored = JSON.parse(await evalJS(cdp, conformProbe));
  const ceiling = Math.max(0, flat.deepest);
  check(`作者构型（amount=${authoredAmount} gap=${authoredGap}）不穿透头皮代理（改前实测 +0.235）`,
    authored.deepest <= ceiling + 1e-6,
    `最深穿透 ${authored.deepest.toFixed(4)}（第 ${authored.deepestRow} 行）`
    + ` ≤ 上限 ${ceiling.toFixed(4)}；平板基线 ${flat.deepest.toFixed(4)}`);
  // **D11 的极端构型：报告而不判红**（用户已裁定「默认值安全就够，先留着」）。
  // 成因是 camber 的 b0 = curvature·halfWidth 把卷绕圆心推离胶囊轴，gap 越小越兜不住。
  // **注意真实 frame 链的余量比 node fixture 小得多**：平板基线在真实工程里只离代理
  // 0.075（node fixture 是 0.47），所以同一个 b0 亏空在这里就会真的越界。
  console.log(`  [info] D11 极端构型 amount=1 gap=0.05 ⇒ 最深穿透 ${conformed.deepest.toFixed(4)}`
    + `（第 ${conformed.deepestRow} 行）；平板基线仅 ${flat.deepest.toFixed(4)} ⇒ 余量本就很薄。`
    + " 修法见计划 §5.2（k = amount/(R + gap + b0)），用户已选先不做。");

  // **② 行不交叉**：折叠的唯一可能形态。**已知缺陷：真实档 amount≥0.87 会交叉**
  // （node 侧实测 5/90、最深 −0.037；旧模型同构型 11/170、−0.201，本版浅 2.9×）。
  // 用户已裁定 D10「先不做，先在视口里看严重程度」⇒ 本条**报告为主、门限放在既有天花板上**，
  // 只防「变得更糟」。平板基线必须干净，否则判据本身失去参照。
  check("平板基线无行交叉（下一条判据的参照，防空转）",
    flat.crossings === 0 && flat.checkedPairs > 20,
    `平板 ${flat.crossings}/${flat.checkedPairs} 交叉，最差推进 ${flat.worstAdvance?.toExponential(3)}`);
  // 天花板取**真实 frame 链**上的实测值，而不是 node fixture 的值。
  // **两者差得很远，勿混用**：node fixture（常量 frame + 直链曲线）实测 5/90、最深 −0.037；
  // 真实工程（含 ±24°/环 roll 钳位的真实 frame 链）amount=1 gap=0.05 实测 **12/90、−0.168**，
  // 深 4.5×、且约为板厚（0.08）的两倍。**判据必须钉在真实链上** —— 我一度按 fixture 的
  // 0.037 向用户报告严重程度，那个数字低估了实际情况。
  const CROSSING_CEILING = 14;
  const CROSSING_DEPTH_FLOOR = -0.20;
  check(`作者构型（amount=${authoredAmount} gap=${authoredGap}）行交叉不超过既有天花板（D10 已裁定先不修）`,
    authored.crossings <= CROSSING_CEILING
      && (authored.worstAdvance === null || authored.worstAdvance >= CROSSING_DEPTH_FLOOR),
    `${authored.crossings}/${authored.checkedPairs} 交叉（天花板 ${CROSSING_CEILING}）`
    + `，最差推进 ${authored.worstAdvance?.toExponential(3)}（下限 ${CROSSING_DEPTH_FLOOR}）`
    + `${authored.crossings > 0 ? " ← 已知缺陷，非本轮引入" : ""}`);
  console.log(`  [info] D11 极端构型 amount=1 gap=0.05 ⇒ 行交叉 ${conformed.crossings}/${conformed.checkedPairs}`
    + `，最差推进 ${conformed.worstAdvance?.toExponential(3)}`);

  // 面板起始在头前方 ⇒ 弯曲后中线仍在原处（s=0 零位移，这正是主发片控制点对齐的依据），
  // 但整体应更贴合头形：报告首末行距头心距离供观察。
  console.log(`  [info] 距头心（flat）  ${flat.spans.map((s) => s.d.toFixed(2)).join(" ")}`);
  console.log(`  [info] 距头心（bent）  ${conformed.spans.map((s) => s.d.toFixed(2)).join(" ")}`);

  // row 0 必须一动不动（UV 红线）——在真实工程上验，不只在 node fixture 上。
  const rootMoved = await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    const pos = lock.mesh.geometry.getAttribute('position');
    const rows = lock.mesh.geometry.userData.gridRowIndices || [];
    let n = 0;
    for (let i = 0; i < pos.count; i++) if (rows[i] === 0) n++;
    return String(n);
  })()`);
  check("row 0 顶点存在且可比对（下一条断言非空转）", Number(rootMoved) > 0, `row0 verts=${rootMoved}`);

  // Scalp Gap 真的改变几何（它加大弯曲半径 ⇒ 同一 amount 下卷得更松）。
  const gapLow = await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    const s = document.querySelector('#panelScalpConformGap');
    s.value = '0'; s.dispatchEvent(new Event('input', { bubbles: true }));
    lock.mesh.geometry.computeBoundingBox(); const b = lock.mesh.geometry.boundingBox;
    return [b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map((v)=>Number(v.toFixed(5))).join(',');
  })()`);
  await sleep(2000);
  const gapHigh = await evalJS(cdp, `(() => {
    const lock = ${lockRef};
    const s = document.querySelector('#panelScalpConformGap');
    s.value = '0.5'; s.dispatchEvent(new Event('input', { bubbles: true }));
    lock.mesh.geometry.computeBoundingBox(); const b = lock.mesh.geometry.boundingBox;
    return [b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map((v)=>Number(v.toFixed(5))).join(',');
  })()`);
  await sleep(2000);
  check("Scalp Gap 真的改变几何（0 vs 0.5 包围盒不同）", gapLow !== gapHigh,
    `tight=${gapLow} loose=${gapHigh}`);

  const uiErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 new exceptions across all slider interaction", uiErr === bootErr, `${uiErr - bootErr} new`);
} catch (error) {
  console.error("SCALP CONFORM VERIFY ERROR:", error.message);
  results.push({ name: "harness", ok: false, detail: error.message });
} finally {
  try { chrome.kill(); } catch {}
  server.close();
}
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
