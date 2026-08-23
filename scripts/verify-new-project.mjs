// verify-new-project.mjs - browser verification of File > New (0.2.134).
// Drives the REAL menu item + confirm dialog through the app's own listeners; nothing is
// stubbed except the .ahs load (drag-and-drop), exactly like verify-tip-clump.mjs.
//
// What it proves that node tests cannot: the pristine snapshot captured at boot really
// restores an empty scene, the Cancel path changes nothing, and the highest-risk item —
// the Quick Save / Quick Export file handles — are actually forgotten, so a post-New
// Ctrl+S cannot silently overwrite the previously opened project file.
//
// Run: node scripts/verify-new-project.mjs [file.ahs] [--port 8284] [--cdp-port 9414]
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
// 取值型参数必须先判断 flag 是否存在：indexOf 缺失时返回 -1，`args[-1 + 1]` 会读到
// **第一个位置参数**（即 .ahs 路径），Number(路径) = NaN ⇒ listen 抛 ERR_SOCKET_BAD_PORT。
// verify-smoke.mjs 原本就有这个 bug（本轮一并修掉），新脚本勿再复制旧写法。
const optNumber = (flag, fallback) => {
  const at = args.indexOf(flag);
  if (at < 0) return fallback;
  const value = Number(args[at + 1]);
  return Number.isFinite(value) ? value : fallback;
};
const port = optNumber("--port", 8284);
const cdpPort = optNumber("--cdp-port", 9414);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THREE_VENDOR = path.join(os.tmpdir(), "ahs-verify-three", "vendor");
const profileDir = path.join(os.tmpdir(), "ahs-new-project-profile-" + cdpPort);
// 默认用真实工程：New 必须在"有内容"的场景上验证才有意义（空场景上清空是平凡真）。
const DEFAULT_AHS = "D:/Downloads/Sussurro_v1_0060.ahs";
const requested = positional[0] || DEFAULT_AHS;
const ahsFile = fs.existsSync(requested) ? requested : null;

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

// 读一份"场景规模 + 项目身份"快照：New 前后各取一次做对照。
// 项目身份一律从 projectState store 读 —— **不要走 fileApi**：它只导出函数，那些
// currentProjectName / quickSaveFileHandle getter 在传进 createProjectSaveApi 的 deps
// 对象上、不在返回值上，从 fileApi 读会得到 undefined、写会凭空造出同名属性，
// 于是「句柄被忘掉」这类断言会假绿（本脚本初版实测：14/17 里的 3 条失败全是这个原因）。
const SCENE_PROBE = `(() => {
  const t = window.__ahsTest;
  const p = t.projectState.state;
  return JSON.stringify({
    locks: t.locks.length,
    meshes: t.locks.filter((l) => l.mesh).length,
    projectName: p.currentProjectName ?? null,
    hasQuickSaveHandle: !!p.quickSaveFileHandle,
    hasQuickSaveName: !!p.quickSaveFileName,
    hasLastExport: !!p.lastExport,
    hasQuickExportHandle: !!p.quickExportFileHandle,
    hasPristineBaseline: typeof p.pristineProjectSnapshot === 'string' && p.pristineProjectSnapshot.length > 0,
    undoDisabled: document.querySelector('#undoAction').disabled,
    redoDisabled: document.querySelector('#redoAction').disabled,
    // 发丝行只在分组展开时才渲染，所以行数**不能**单独当判据（初版用它，26 根发丝时
    // 也是 0 行 ⇒ 断言恒真）。这里连同真实场景图里的 Mesh 数一起读，后者才是用户看得见的东西。
    lockRows: document.querySelectorAll('#lockList .lock-item').length,
    sceneMeshes: (() => { let n = 0; t.scene.traverse((o) => { if (o.isMesh) n += 1; }); return n; })()
  });
})()`;

await new Promise((r) => server.listen(port, "127.0.0.1", r));
console.log(`static server on http://127.0.0.1:${port}${ahsFile ? "  project: " + path.basename(ahsFile) : "  (no .ahs; empty-scene run)"}`);
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

  // 装出"有快速保存/导出目标"的现场：New 必须把这些全部忘掉。写进 projectState store
  // （不是 fileApi —— 见 SCENE_PROBE 上方的说明）。
  await evalJS(cdp, `(() => {
    const p = window.__ahsTest.projectState.state;
    p.quickSaveFileHandle = { name: 'pretend-handle.ahs' };
    p.quickSaveFileName = 'pretend-handle';
    p.lastExport = { format: 'usda', fileName: 'pretend.usda', contents: {} };
    p.quickExportFileHandle = { name: 'pretend-export.usda' };
    return true;
  })()`);
  const before = JSON.parse(await evalJS(cdp, SCENE_PROBE));
  check("scene has content before New", before.locks > 0, `locks=${before.locks} meshes=${before.meshes}`);
  // boot 时抓的空场景基准必须存在，否则 startNewProject 会直接 return false（静默失败）。
  check("pristine baseline captured at boot", before.hasPristineBaseline === true);
  check(
    "quick save/export targets are set before New",
    before.hasQuickSaveHandle && before.hasLastExport && before.hasQuickExportHandle
  );

  // ── Cancel 路径：必须什么都不改 ────────────────────────────────────────────────
  await evalJS(cdp, `document.querySelector('#newHairProject').click()`);
  await sleep(400);
  check("confirm dialog opens from the File > New item", (await evalJS(cdp, `document.querySelector('#newProjectWarning').open`)) === true);
  await evalJS(cdp, `document.querySelector('#cancelNewProject').click()`);
  await sleep(600);
  const cancelled = JSON.parse(await evalJS(cdp, SCENE_PROBE));
  check("dialog closed after Cancel", (await evalJS(cdp, `document.querySelector('#newProjectWarning').open`)) === false);
  check(
    "Cancel changes nothing",
    cancelled.locks === before.locks && cancelled.sceneMeshes === before.sceneMeshes
      && cancelled.projectName === before.projectName
      && cancelled.hasQuickSaveHandle === true && cancelled.hasLastExport === true
      && cancelled.hasQuickExportHandle === true,
    JSON.stringify(cancelled)
  );

  // ── Confirm 路径：真正重置 ────────────────────────────────────────────────────
  await evalJS(cdp, `document.querySelector('#newHairProject').click()`);
  await sleep(300);
  await evalJS(cdp, `document.querySelector('#confirmNewProject').click()`);
  await sleep(4000);
  const after = JSON.parse(await evalJS(cdp, SCENE_PROBE));
  check("scene is empty after New", after.locks === 0 && after.meshes === 0, JSON.stringify(after));
  check("outliner has no strand rows after New", after.lockRows === 0, `rows=${after.lockRows}`);
  // 场景图里的发丝 Mesh 必须真的少掉（不是只清了数组）：New 前后对照，且不得为 0 前提。
  check(
    "hair meshes actually removed from the scene graph",
    before.sceneMeshes > after.sceneMeshes,
    `before=${before.sceneMeshes} after=${after.sceneMeshes}`
  );
  // 最高风险项：句柄没忘 ⇒ New 之后 Ctrl+S 会静默覆盖上一个项目文件。
  check("Quick Save handle forgotten", after.hasQuickSaveHandle === false);
  check("Quick Save name forgotten", after.hasQuickSaveName === false);
  check("Quick Export target forgotten", after.hasLastExport === false);
  check("Quick Export handle forgotten", after.hasQuickExportHandle === false);
  check("project name reset to default", after.projectName === "Untitled Hair Project", after.projectName);
  // New 是新的 undo 基准，不是可撤销步骤：撤销栈必须空，否则 Ctrl+Z 会拖回半个已 dispose 的场景。
  check("undo history cleared", after.undoDisabled === true && after.redoDisabled === true,
    `undoDisabled=${after.undoDisabled} redoDisabled=${after.redoDisabled}`);
  const newErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions after New", newErr === bootErr, `${newErr - bootErr} new exceptions`);

  // ── 幂等：第二次 New 必须同样干净（基准存 JSON 字符串就是为了这条）─────────────
  await evalJS(cdp, `document.querySelector('#newHairProject').click()`);
  await sleep(300);
  await evalJS(cdp, `document.querySelector('#confirmNewProject').click()`);
  await sleep(3000);
  const twice = JSON.parse(await evalJS(cdp, SCENE_PROBE));
  check("second New is still clean (baseline not polluted)", twice.locks === 0 && twice.meshes === 0, JSON.stringify(twice));
  const twiceErr = cdp.events.filter((e) => e.method === "Runtime.exceptionThrown").length;
  check("0 exceptions after second New", twiceErr === bootErr, `${twiceErr - bootErr} new exceptions`);

  // New 之后仍能正常建几何（证明场景不是"被清成不可用状态"）。
  const rebuilt = await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const before = t.locks.length;
    document.querySelector('#newHairProject');
    return JSON.stringify({ before, tools: !!document.querySelector('#attributeMainTab') });
  })()`);
  check("app still responsive after New", !!JSON.parse(rebuilt).tools, rebuilt);
} catch (error) {
  console.error("NEW PROJECT VERIFY ERROR:", error.message);
  results.push({ name: "harness", ok: false, detail: error.message });
} finally {
  try { chrome.kill(); } catch {}
  server.close();
}
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
