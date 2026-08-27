// probe-tier-inherit.mjs —— 诊断探针：刷中间层后，叶子链与网格顶点是否跟着动。
// 也 dump 网格高亮覆盖了哪几段（用户报「高亮只有一半」）。
// Run: AHS_CHROME=... node scripts/probe-tier-inherit.mjs <file.ahs>
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { extname, join, normalize } from "node:path";

const ahsFile = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!ahsFile) { console.error("usage: node scripts/probe-tier-inherit.mjs <file.ahs>"); process.exit(2); }
const CHROME = process.env.AHS_CHROME;
const cdpPort = 9413;
const ROOT = new URL("../", import.meta.url).pathname;
const profileDir = path.join(os.tmpdir(), "ahs-probe-inherit-" + cdpPort);

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

const SETUP = `(() => {
  const t = window.__ahsTest;
  const lock = t.locks.find((l) => Array.isArray(l.panelSplits) && l.panelSplits.length > 1 && l.mesh);
  if (!lock) return "no split panel lock";
  t.selectLock(lock.id, {});
  return JSON.stringify({ name: lock.name, splits: lock.panelSplits.map((s) => ({ pos: +s.position.toFixed(3), h: +s.height.toFixed(3) })) });
})()`;

const CLICK = (label) => `(() => {
  const el = Array.from(document.querySelectorAll(".outliner-bone-group-label"))
    .find((e) => e.textContent.trim() === ${JSON.stringify(label)});
  if (!el) return "row not found: " + ${JSON.stringify(label)};
  el.click();
  return "clicked " + el.textContent;
})()`;

// 高亮覆盖了哪几段：直接读 overlay 的 aFade（>0 即被着色），按 leafIndex 归组。
const HILITE = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  const ov = lock.curveObjects?.tipHighlightMesh;
  if (!ov || !ov.visible) return "overlay hidden";
  const fade = ov.geometry.getAttribute("aFade");
  const lw = lock.mesh.geometry.userData.leafWeights || lock.mesh.geometry.userData.panelWeights;
  const per = {};
  for (let v = 0; v < fade.count; v++) {
    if (fade.array[v] <= 0.001) continue;
    const leaf = lw[v * 3 + 1];
    per[leaf] = (per[leaf] || 0) + 1;
  }
  return JSON.stringify({ litVertsByLeafSegment: per });
})()`;
// 刷中间层，然后看：① 叶子链有没有跟着动 ② 网格顶点有没有跟着动
const BRUSH = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  const splits = t.clonePanelSplitsForProbe
    ? t.clonePanelSplitsForProbe(lock.panelSplits, lock.panelSplitHeight)
    : lock.panelSplits;
  const leafChain = (seg) => {
    const c = t.splitTipForSegment(lock, seg, splits, (lock.panelSplitBones || [])[seg] || null);
    return c ? c.points.map((p) => +p.x.toFixed(4)) : null;
  };
  const meshShot = () => {
    const pos = lock.mesh.geometry.getAttribute("position");
    let sx = 0; for (let i = 0; i < pos.count; i++) sx += pos.array[i * 3];
    return +sx.toFixed(3);
  };
  const before = { leaf1: leafChain(1), leaf2: leafChain(2), meshSumX: meshShot() };
  const vis = (lock.curveObjects.tipChainHandles || []).filter((h) => h.visible);
  if (!vis.length) return "no visible tier handles";
  const rect = t.renderer.domElement.getBoundingClientRect();
  const p = vis[vis.length - 1].position.clone().project(t.camera());
  t.sel.state.activeTool = "sculpt-grab";
  const consumed = t.applySubBoneBrushSample(
    { undoCaptured: false, reverse: false, editedLockIds: new Set() },
    rect.left + (p.x * 0.5 + 0.5) * rect.width,
    rect.top + (-p.y * 0.5 + 0.5) * rect.height, 40, 20);
  const after = { leaf1: leafChain(1), leaf2: leafChain(2), meshSumX: meshShot() };
  const chg = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
  return JSON.stringify({
    consumed,
    leaf1_moved: chg(before.leaf1, after.leaf1),
    leaf2_moved: chg(before.leaf2, after.leaf2),
    mesh_moved: before.meshSumX !== after.meshSumX,
    leaf1_before: before.leaf1, leaf1_after: after.leaf1,
    meshSumX: [before.meshSumX, after.meshSumX]
  }, null, 1);
})()`;

const COMPOSE = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  const vis = (lock.curveObjects.tipChainHandles || []).filter((h) => h.visible);
  if (!vis.length) return "no visible leaf handles";
  // 记下刷之前叶子链的位置（此时它已含中间层顶起的量）
  const before = vis.map((h) => +h.position.x.toFixed(4));
  const rect = t.renderer.domElement.getBoundingClientRect();
  const p = vis[vis.length - 1].position.clone().project(t.camera());
  t.sel.state.activeTool = "sculpt-grab";
  t.applySubBoneBrushSample(
    { undoCaptured: false, reverse: false, editedLockIds: new Set() },
    rect.left + (p.x * 0.5 + 0.5) * rect.width,
    rect.top + (-p.y * 0.5 + 0.5) * rect.height, -50, 0);
  const after = (lock.curveObjects.tipChainHandles || []).filter((h) => h.visible)
    .map((h) => +h.position.x.toFixed(4));
  // 中间层的 delta 是否还在：清掉叶子自己的 tip 后，链应回到"中间层顶起的位置"而非基础面板
  const groupTips = [];
  const walk = (n) => { if (!n) return; if (n.tip) groupTips.push((n.tip.points || []).length); (n.children || []).forEach(walk); };
  walk(lock.panelBoneGroups);
  return JSON.stringify({ leafHandles_before: before, leafHandles_after: after,
    leaf_moved: JSON.stringify(before) !== JSON.stringify(after),
    tierTipsStillAuthored: groupTips }, null, 1);
})()`;

fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) break; } catch {} await sleep(300); }
  const cdp = await connectCDP();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(9000);
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
  console.log("setup:", await evalJS(cdp, SETUP));
  console.log("rows:", await evalJS(cdp, `(() => Array.from(document.querySelectorAll(".outliner-bone-group-label")).map((e) => e.textContent.trim()).join(" | "))()`));
  const tier = process.env.AHS_TIER || "L2 · Segments 2-3";
  console.log(await evalJS(cdp, CLICK(tier)));
  await sleep(900);
  console.log("highlight:", await evalJS(cdp, HILITE));
  console.log("brush:", await evalJS(cdp, BRUSH));

  // 叠加性：刷完中间层后再单独刷一个叶子，叶子应在**中间层已顶起的位置上**再叠自己的 delta，
  // 而不是回到基础面板重算（那会把中间层的位移吃掉）。
  console.log("\n--- compose: now brush leaf L3 . Segment 3 on top of the tier edit ---");
  console.log(await evalJS(cdp, CLICK("L3 · Segment 3")));
  await sleep(900);
  console.log(await evalJS(cdp, COMPOSE));
} finally { chrome.kill(); srv.close(); }


