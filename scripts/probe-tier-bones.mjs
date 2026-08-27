// probe-tier-bones.mjs —— 诊断探针：选中中间层分组后，逐段 dump
// host.bones 身份 / tipChainFor 取点 / 把手 visible+opacity。
// 用途：定位「中间层没有骨骼给我刷」。这是调查工具，不是验收脚本。
// Run: AHS_CHROME=... node scripts/probe-tier-bones.mjs <file.ahs>
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { extname, join, normalize } from "node:path";

const ahsFile = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!ahsFile) { console.error("usage: node scripts/probe-tier-bones.mjs <file.ahs>"); process.exit(2); }
const CHROME = process.env.AHS_CHROME;
const cdpPort = 9412;
const ROOT = new URL("../", import.meta.url).pathname;
const profileDir = path.join(os.tmpdir(), "ahs-probe-tier-" + cdpPort);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".obj": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".ahs": "application/octet-stream" };
const srv = createServer(async (req, res) => {
  try {
    let p = new URL(req.url, "http://x").pathname;
    if (p === "/") p = "/index.html";
    const rel = normalize(p).replace(/^\/+/, "");
    const buf = await readFile(join(ROOT, rel));
    res.writeHead(200, { "Content-Type": TYPES[extname(rel)] || "application/octet-stream" });
    res.end(buf);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const port = srv.address().port;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connectCDP() {
  const list = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let seq = 0; const pending = new Map(); const events = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    else if (m.method) events.push(m);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((res) => { const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
  return { send, events };
}
async function evalJS(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("EVAL: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}

const PROBE = `(() => {
  const t = window.__ahsTest;
  const lock = t.locks.find((l) => Array.isArray(l.panelSplits) && l.panelSplits.length > 1 && l.mesh);
  if (!lock) return "no split panel lock";
  t.selectLock(lock.id, {});
  return JSON.stringify({ id: lock.id, name: lock.name,
    splits: lock.panelSplits.map((s) => ({ pos: +s.position.toFixed(3), h: +s.height.toFixed(3), lvl: s.boneLevel })) }, null, 1);
})()`;

const ROWS = `(() => Array.from(document.querySelectorAll(".outliner-bone-group-label, .outliner-bone-zipper-label"))
  .map((e, i) => i + ": [" + e.className.replace("outliner-bone-", "") + "] " + e.textContent).join("\\n"))()`;

const CLICK = (label) => `(() => {
  const el = Array.from(document.querySelectorAll(".outliner-bone-group-label"))
    .find((e) => e.textContent.trim() === ${JSON.stringify(label)});
  if (!el) return "row not found";
  el.click();
  return "clicked: " + el.textContent + " pressed=" + el.getAttribute("aria-pressed");
})()`;

const DUMP = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  if (!lock) return "no lock";
  const co = lock.curveObjects || {};
  const per = new Map();
  (co.tipChainHandles || []).forEach((h) => {
    const seg = h.userData.tipSegmentIndex;
    if (!per.has(seg)) per.set(seg, { seg, vis: 0, hidden: 0, pts: [] });
    const rec = per.get(seg);
    if (h.visible) { rec.vis++; rec.pts.push([+h.position.x.toFixed(3), +h.position.y.toFixed(3), +h.position.z.toFixed(3), +h.material.opacity.toFixed(2)]); }
    else rec.hidden++;
  });
  const lines = (co.tipChainLines || []).map((l, i) => i + ": vis=" + l.visible + " op=" + (l.material?.opacity ?? "-").toString().slice(0, 4));
  return JSON.stringify({
    tipSelection: t.sculptState.state.tipSelection,
    panelSegmentIndex: t.sculptState.state.panelSegmentIndex,
    handlesBySegment: [...per.values()],
    chainLines: lines
  }, null, 1);
})()`;

// 中间层写回闭环：直接改 tierBone.tip.points（模拟笔刷的写入目标），再重画把手，
// 看视口取点是否跟着动。动 = 写回与显示同源；不动 = 写进了一个显示侧读不到的地方。
const WRITEBACK = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  const shot = () => (lock.curveObjects.tipChainHandles || [])
    .filter((h) => h.visible)
    .map((h) => +h.position.x.toFixed(3) + "," + +h.position.y.toFixed(3));
  const before = shot();
  // 把光标放在**可见把手**的屏幕位置上：笔刷按屏幕距离掩蔽，落在别处什么都不会动。
  const vis = (lock.curveObjects.tipChainHandles || []).filter((h) => h.visible);
  if (!vis.length) return "no visible tip handles";
  const cam = t.camera();
  const rect = t.renderer.domElement.getBoundingClientRect();
  const p = vis[vis.length - 1].position.clone().project(cam);
  const cx = rect.left + (p.x * 0.5 + 0.5) * rect.width;
  const cy = rect.top + (-p.y * 0.5 + 0.5) * rect.height;
  t.sel.state.activeTool = "sculpt-grab";
  const stroke = { undoCaptured: false, reverse: false, editedLockIds: new Set() };
  const consumed = t.applySubBoneBrushSample(stroke, cx, cy, 26, 14);
  t.updateCurveObjects(lock, { visible: true });
  const after = shot();
  // 写回落点：中间层应写进分组节点的 tip，而不是叶子 bone
  const groupTipLen = (() => {
    const root = lock.panelBoneGroups;
    const walk = (n, d) => n ? [(n.tip?.points || []).length, ...(n.children || []).flatMap((c) => walk(c, d + 1))] : [];
    return walk(root, 0);
  })();
  const leafTipLen = (lock.panelSplitBones || []).map((b) => (b?.tip?.points || []).length);
  return JSON.stringify({ consumed, moved: JSON.stringify(before) !== JSON.stringify(after),
    before, after, groupTipPointCounts: groupTipLen, leafTipPointCounts: leafTipLen }, null, 1);
})()`;

fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) break; } catch {} await sleep(300); }
  const cdp = await connectCDP();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(9000);
  console.log("seam:", await evalJS(cdp, `typeof window.__ahsTest`));

  const data = fs.readFileSync(ahsFile, "base64");
  await evalJS(cdp, `(async () => {
    const bin = atob('${data}'); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const dt = new DataTransfer();
    dt.items.add(new File([new Blob([bytes])], '${path.basename(ahsFile)}'));
    document.body.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
    await new Promise(r => setTimeout(r, 600));
    const dlg = document.querySelector('#dropImportDialog');
    if (dlg && dlg.open) document.querySelector('#confirmDropImport')?.click();
    return true;
  })()`);
  await sleep(7000);
  console.log(await evalJS(cdp, PROBE));
  console.log("--- outliner rows ---");
  console.log(await evalJS(cdp, ROWS));

  console.log("\n=== BASELINE (nothing selected) ===");
  console.log(await evalJS(cdp, DUMP));

  console.log("\n=== after click L2 . Segments 2-3 ===");
  console.log(await evalJS(cdp, CLICK("L2 · Segments 2-3")));
  await sleep(900);
  console.log(await evalJS(cdp, DUMP));

  console.log("\n=== BRUSH on the tier (L2 . Segments 2-3 still selected) ===");
  console.log(await evalJS(cdp, WRITEBACK));

  for (const label of ["L3 · Segment 2", "L3 · Segment 3", "L2 · Segment 1"]) {
    console.log(`\n=== after click ${label} ===`);
    console.log(await evalJS(cdp, CLICK(label)));
    await sleep(900);
    console.log(await evalJS(cdp, DUMP));
  }
} finally {
  chrome.kill(); srv.close();
}


