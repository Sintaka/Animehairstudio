// verify-wind-preview.mjs — 吹风预览端到端验收（headless Chrome + CDP，真实工程）。
// 流程：boot(?ahstest=1) → 加载 D:/Downloads/Sussurro_v1_0046.ahs →
//   1) seam 启用预览 → 断言网格位置发生变形、尖部位移 > 根部位移（根少动尖多动）；
//   2) 确定性：同 windTime 下两次变形结果逐位一致；
//   3) 关闭预览 → 位置/法线/切线逐位恢复（非破坏）；
//   4) UI 路径：菜单按钮开窗（不自动启用预览）→ 窗口内启用开关 → seed 滑杆回归
//      （改 seed 预览不卡死/不关闭、改回原值后逐位还原 → bug 修复验证）→
//      关闭按钮 → 窗口关闭 + 预览停 + 位置逐位恢复 rest。
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

  // UI 路径：菜单按钮开窗（不自动启用）→ 窗口内启用开关 → seed 滑杆回归（bug 修复）→ 关闭恢复
  const ui = await evalJS(cdp, `(async () => {
    try {
      const out = {};
      const menuBtn = document.querySelector('#toggleWindPreview');
      const win = document.querySelector('#windPreviewWindow');
      const enableBtn = document.querySelector('#windPreviewEnableButton');
      const enableState = document.querySelector('#windPreviewEnableState');
      const closeBtn = document.querySelector('#windPreviewCloseButton');
      const seedInput = document.querySelector('#windSeedInput');
      const { windPreviewApi, windState, locks } = window.__ahsTest;
      if (!menuBtn || !win || !enableBtn || !enableState || !closeBtn || !seedInput || !windPreviewApi || !windState || !locks) {
        return { ok: false, errors: ['wind UI element or seam missing'] };
      }
      const meshes = locks.filter(l => l.mesh && l.mesh.geometry && l.mesh.geometry.attributes && l.mesh.geometry.attributes.position && l.mesh.geometry.userData && l.mesh.geometry.userData.gridRowIndices).map(l => l.mesh);
      if (!meshes.length) return { ok: false, errors: ['no meshes with gridRowIndices'] };
      const snap = (ms) => ms.map(m => m.geometry.attributes.position.array.slice());
      const posEq = (a, b) => { for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-9) return false; return true; };
      // 起始状态归一：前面的 seam 套件启用过预览（启用会自动开窗），这里重置为
      // 「预览关 + 窗口关」，保证菜单开窗断言不受前置状态影响。
      if (windState.windPreviewActive) windPreviewApi.setWindPreviewActive(false);
      if (win.open) win.close();
      // 初始 rest（此时预览未激活，几何为真实 rest）
      const restP = snap(meshes);
      // 1) 菜单按钮 → 打开浮动窗口；打开不自动启用预览
      menuBtn.click();
      await new Promise(r => setTimeout(r, 300));
      out.windowOpened = win.open;
      out.autoEnabled = windState.windPreviewActive;
      if (!win.open) return { ok: false, errors: ['window not open after menu click'] };
      if (windState.windPreviewActive) return { ok: false, errors: ['preview auto-enabled on window open'] };
      // 2) 窗口内启用开关
      enableBtn.click();
      await new Promise(r => setTimeout(r, 300));
      out.active = windState.windPreviewActive;
      out.pressed = enableBtn.getAttribute('aria-pressed');
      out.stateText = enableState.textContent;
      if (!windState.windPreviewActive || out.pressed !== 'true' || out.stateText !== 'On') {
        return { ok: false, errors: ['enable failed: active=' + out.active + ' pressed=' + out.pressed + ' state=' + out.stateText] };
      }
      // 冻结时间，保证回归断言逐位可比
      windState.windPlaying = false;
      windPreviewApi.tickOnce();
      const snapA = snap(meshes);
      // 3) 回归（bug：预览激活时改 seed → 缓存被删不重建 → 卡死/不恢复/再次开启进一步弯曲）
      const origSeed = seedInput.value;
      seedInput.value = '999';
      seedInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 200));
      out.stillActive = windState.windPreviewActive;
      const snapB = snap(meshes);
      out.shapeChanged = snapB.some((p, i) => !posEq(p, snapA[i]));
      // 改回原值 → 无残留累积，逐位回到 A
      seedInput.value = origSeed;
      seedInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 200));
      const snapC = snap(meshes);
      out.backToA = snapC.every((p, i) => posEq(p, snapA[i]));
      if (!out.stillActive) return { ok: false, errors: ['preview deactivated on seed change (bug regression)'] };
      if (!out.shapeChanged) return { ok: false, errors: ['geometry frozen on seed change (bug regression)'] };
      if (!out.backToA) return { ok: false, errors: ['residual deformation after seed round-trip (bug regression)'] };
      // 4) 关闭按钮 → 窗口关闭 + 预览停 + 位置逐位恢复 rest
      closeBtn.click();
      await new Promise(r => setTimeout(r, 300));
      out.windowClosed = !win.open;
      out.inactive = !windState.windPreviewActive;
      const afterClose = snap(meshes);
      out.restored = afterClose.every((p, i) => posEq(p, restP[i]));
      if (!out.windowClosed || !out.inactive || !out.restored) {
        return { ok: false, errors: ['close failed: closed=' + out.windowClosed + ' inactive=' + out.inactive + ' restored=' + out.restored] };
      }
      out.ok = true;
      return out;
    } catch (e) { return { ok: false, errors: [String(e && e.message || e)] }; }
  })()`);
  check("wind UI flow ok", ui.ok, ui.errors ? ui.errors.join(";") : `window ${ui.windowOpened}->${ui.windowClosed} active=${ui.active}->${ui.inactive} restored=${ui.restored}`);
  if (ui.ok) {
    check("menu opens window without enabling", ui.windowOpened === true && ui.autoEnabled === false);
    check("enable toggle turns preview on", ui.active === true && ui.pressed === "true" && ui.stateText === "On");
    check("seed change keeps preview active (regression)", ui.stillActive === true);
    check("seed change deforms, not frozen (regression)", ui.shapeChanged === true);
    check("seed round-trip restores bit-exact (regression)", ui.backToA === true);
    check("close restores rest bit-exact", ui.restored === true);
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
