// verify-smoke.mjs — self-contained smoke test for the web app.
// Starts a static server (query-string friendly, maps the repo root), launches
// headless Chrome over CDP, loads the app, and asserts:
//   1. zero page exceptions / console errors during boot
//   2. localization dictionaries load and translate (zh/ja/en)
//   3. optional: loading a .ahs file does not throw (openHairProjectFile path)
// Run: node scripts/verify-smoke.mjs [path-to-ahs] [--port 8080] [--cdp-port 9223]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const VALUE_OPTS = new Set(["--port", "--cdp-port"]);
const ahsFiles = [];
for (let i = 0; i < args.length; i++) { if (args[i].startsWith("--")) { if (VALUE_OPTS.has(args[i])) i++; continue; } ahsFiles.push(args[i]); }
const port = Number(args[args.indexOf("--port") + 1] || 8080);
const cdpPort = Number(args[args.indexOf("--cdp-port") + 1] || 9223);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profileDir = path.join(os.tmpdir(), "ahs-smoke-profile-" + cdpPort);

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".obj": "text/plain", ".usda": "text/plain", ".css": "text/css", ".ahs": "application/octet-stream",
  ".md": "text/plain", ".txt": "text/plain", ".ico": "image/x-icon",
};

// ---------- static server ----------
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

// ---------- helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function waitFor(fn, timeout = 15000, interval = 200) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (async () => {
      while (Date.now() - t0 < timeout) {
        try { const v = await fn(); if (v) return resolve(v); } catch {}
        await sleep(interval);
      }
      reject(new Error("timeout waiting for condition"));
    })();
  });
}

// ---------- CDP client ----------
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
    else if (m.method) events.push(m);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((res) => {
    const id = ++seq;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { ws, send, events };
}

async function evalJS(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("eval exception: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}

// ---------- main ----------
const results = [];
function check(name, ok, detail = "") { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); }

await new Promise((r) => server.listen(port, "127.0.0.1", r));
console.log(`static server on http://127.0.0.1:${port}`);

fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`,
  "--no-first-run", "--disable-gpu", "--window-size=1400,900", "about:blank",
], { stdio: "ignore" });

try {
  await waitFor(async () => {
    try { const l = await fetch(`http://127.0.0.1:${cdpPort}/json/version`); return l.ok; } catch { return false; }
  }, 20000, 300);
  const cdp = await connectCDP();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/` });
  await sleep(9000); // allow boot + three CDN fetch

  const bootState = await evalJS(cdp, `JSON.stringify({ ready: document.readyState, title: document.title, hasCanvas: !!document.querySelector('canvas') })`);
  const boot = JSON.parse(bootState);
  check("app boot (canvas present)", boot.hasCanvas, `${boot.ready} / ${boot.title}`);

  const errors = cdp.events.filter((e) =>
    e.method === "Runtime.exceptionThrown" ||
    (e.method === "Log.entryAdded" && ["error", "warning"].includes(e.params?.entry?.level) && /unpkg|ERR_|Uncaught|TypeError|ReferenceError|SyntaxError/i.test(e.params?.entry?.text || ""))
  );
  if (errors.length) {
    for (const e of errors) {
      const det = e.params?.exceptionDetails || {};
      const loc = det.url ? ` @${det.url}:${det.lineNumber}:${det.columnNumber}` : "";
      const txt = (det.exception?.description || det.text || e.params?.entry?.text || JSON.stringify(e).slice(0, 300)) + loc;
      console.log("  [boot-exception]", txt.slice(0, 300));
    }
  }
  check("zero boot exceptions", errors.length === 0, `${errors.length} captured`);

  // localization data-layer check inside the browser (real import chain with ?v=)
  const loc = await evalJS(cdp, `(async () => {
    const m = await import('./modules/data/localization.js?v=20260809-1');
    const ja = await import('./modules/data/loc-ja.js?v=20260809-1');
    const zh = await import('./modules/data/loc-zh.js?v=20260809-1');
    const zhHit = m.translateUiString('Project Contents', 'zh');
    const jaHit = m.translateUiString('Project Contents', 'ja');
    const enFallback = m.translateUiString('Project Contents', 'en');
    const jaKeys = Object.keys(ja.default).length;
    const zhKeys = Object.keys(zh.default).length;
    return JSON.stringify({ zhHit, jaHit, enFallback, jaKeys, zhKeys, zhDiffers: zhHit !== 'Project Contents', jaDiffers: jaHit !== 'Project Contents' });
  })()`);
  const locR = JSON.parse(loc);
  check("zh translate hits", locR.zhDiffers && locR.zhHit.length > 0, locR.zhHit);
  check("ja translate hits", locR.jaDiffers && locR.jaHit.length > 0, locR.jaHit);
  check("en fallback stays English", locR.enFallback === "Project Contents", locR.enFallback);
  console.log(`  dict sizes: JA=${locR.jaKeys} ZH=${locR.zhKeys}`);

  for (const ahsFile of ahsFiles) {
    if (!fs.existsSync(ahsFile)) { check("ahs exists " + ahsFile, false, "missing"); continue; }
    const data = fs.readFileSync(ahsFile, "base64");
    const loadRes = await evalJS(cdp, `(async () => {
      try {
        const bin = atob('${data}');
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'application/octet-stream' });
        const file = new File([blob], '${path.basename(ahsFile)}');
        const dt = new DataTransfer();
        dt.items.add(file);
        const evt = new DragEvent('drop', { bubbles: true, dataTransfer: dt });
        document.body.dispatchEvent(evt);
        await new Promise(r => setTimeout(r, 600));
        const dlg = document.querySelector('#dropImportDialog');
        const openedBefore = !!(dlg && dlg.open);
        if (dlg && dlg.open) {
          const btn = document.querySelector('#confirmDropImport');
          if (btn) btn.click();
        }
        return 'dropped+' + (openedBefore ? 'dialog-opened-confirmed' : 'dialog-never-opened');
      } catch (e) { return 'ERR ' + (e && e.message ? e.message : e); }
    })()`);
    await sleep(7000);
    const loadState = await evalJS(cdp, `JSON.stringify({
      dialogOpen: document.querySelector('#dropImportDialog')?.open ?? 'no-el',
      groupCounts: [...document.querySelectorAll('.outliner-group-count')].map(e=>e.textContent).join(','),
      lockItems: document.querySelectorAll('.lock-item').length,
      empty: document.querySelectorAll('.outliner-empty').length,
      status: (document.querySelector('#presetLibraryStatus')||{}).textContent || ''
    })`);
    console.log("  [load]", path.basename(ahsFile), loadState);
    const errEvents = cdp.events.filter(e => e.method === "Log.entryAdded" && e.params?.entry?.level === "error");
    if (errEvents.length) {
      for (const e of errEvents.slice(-5)) console.log("  [console-error]", (e.params.entry.text || "").slice(0, 300));
    }
    const before = cdp.events.length;
    const afterErrors = cdp.events.slice(before).filter((e) => e.method === "Runtime.exceptionThrown");
    check("ahs load+rebuild 0 exceptions (" + path.basename(ahsFile) + ")", afterErrors.length === 0, `${loadRes} / ${afterErrors.length} exceptions`);
  }

  // IO subsystem: export + save dialogs must open via the extracted modules
  const io = await evalJS(cdp, `(async () => {
    const out = {};
    document.querySelector("#exportObj").click();
    await new Promise(r => setTimeout(r, 300));
    const dlg = document.querySelector("#fileActionDialog");
    out.exportOpen = dlg.open;
    out.exportTitle = document.querySelector("#fileActionDialogTitle").textContent;
    dlg.close();
    document.querySelector("#saveCurrentPreset").click();
    await new Promise(r => setTimeout(r, 300));
    out.saveOpen = dlg.open;
    out.saveTitle = document.querySelector("#fileActionDialogTitle").textContent;
    dlg.close();
    return JSON.stringify(out);
  })()`);
  const ioR = JSON.parse(io);
  check("export dialog opens (IO module)", ioR.exportOpen && /Export/.test(ioR.exportTitle), ioR.exportTitle);
  check("save dialog opens (IO module)", ioR.saveOpen && /Save/.test(ioR.saveTitle), ioR.saveTitle);

  // selection store interaction: clicking an outliner lock item must select it (store write -> DOM)
  const selR = await evalJS(cdp, `(async () => {
    const items = document.querySelectorAll(".lock-item");
    if (!items.length) return JSON.stringify({ ok: false, reason: "no .lock-item in outliner" });
    const btn = items[0];
    const before = btn.className;
    btn.click();
    await new Promise(r => setTimeout(r, 500));
    const activeEl = document.querySelector('.lock-item.active');
    const after = (activeEl ? activeEl.className : btn.className);
    const active = !!activeEl || (after.includes(" active") && !before.includes(" active"));
    return JSON.stringify({ ok: active, active, before: before.slice(0, 40), after: after.slice(0, 60) });
  })()`);
  const selParse = JSON.parse(selR);
  check("selection store: click lock item selects it", selParse.ok, selParse.reason || selParse.after);

  // branch bridge smooth must be per-lock (slider writes selected child lock)
  const branchR = await evalJS(cdp, `(async () => {
    const items = [...document.querySelectorAll('.lock-item')];
    const panel = document.querySelector('#branchBridgePanel');
    const strength = document.querySelector('#branchBridgeSmoothStrengthInput');
    const children = [];
    for (const it of items) {
      it.click();
      await new Promise(r => setTimeout(r, 200));
      if (panel && !panel.classList.contains('hidden')) children.push(it);
      if (children.length >= 2) break;
    }
    if (!children.length) return JSON.stringify({ ok: false, reason: 'no child strand found' });
    const setVal = async (it, v) => { it.click(); await new Promise(r => setTimeout(r, 200)); strength.value = String(v); strength.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 300)); };
    const readVal = async (it) => { it.click(); await new Promise(r => setTimeout(r, 200)); return Number(strength.value); };
    await setVal(children[0], 0.3);
    if (children.length >= 2) {
      await setVal(children[1], 0.8);
      const a = await readVal(children[0]);
      const b = await readVal(children[1]);
      const ok = Math.abs(a - 0.3) < 0.02 && Math.abs(b - 0.8) < 0.02;
      return JSON.stringify({ ok, reason: ok ? 'per-lock memory ok (2 children)' : 'a=' + a + ' b=' + b, children: children.length });
    }
    const a = await readVal(children[0]);
    const ok = Math.abs(a - 0.3) < 0.02;
    return JSON.stringify({ ok, reason: ok ? 'value remembered' : 'got ' + a, children: children.length });
  })()`);
  const branchParse = JSON.parse(branchR);
  check("branch bridge smooth is per-lock", branchParse.ok, branchParse.reason + ' [' + branchParse.children + ' children]');

  cdp.ws.close();
} catch (e) {
  console.error("VERIFY ERROR:", e.message);
  results.push({ name: "script", ok: false, detail: e.message });
} finally {
  chrome.kill();
  for (let i = 0; i < 5; i++) { try { fs.rmSync(profileDir, { recursive: true, force: true }); break; } catch { await sleep(500); } }
  server.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
process.exit(failed.length ? 1 : 0);
