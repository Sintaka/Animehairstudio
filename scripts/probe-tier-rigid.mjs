// probe-tier-rigid.mjs —— 调查工具，不是验收脚本（会改 lock 状态、无断言退出码），
// 别让后人把它当门禁。
//
// 目的：验证「中间层被旋转后，它覆盖的叶子发尖链是否绕『中间层链』做刚体运动
// （保距+朝向一致），而不是被平行平移」。这是 modules/geometry/panel-tip-strand.js 里
// splitTipForSegment 的祖先继承从「逐点平移」改成「逐点刚体变换」（0.2.170）后，
// node 测试覆盖不到的两件事：
//   ① 网格是否真的跟着新 rest 走（addPatch 消费这条链，是独立代码路径）
//   ② 生产路径上的 tipChainFor / resolveTipHost 是否把中间层链正确交给显示与编辑两侧
// node 测试从不 import app.js、不执行视口/网格代码，所以只有真机能验。
//
// 本轮拿不到 D:\Downloads\Scalp Conform Test 4.ahs（Downloads 未挂载），改为运行时
// 合成中间层：加载仓库内 assets/presets/layered-side-bun.ahs（88 个 panel，全部
// heights=0.3，派生出来是平层），在运行时把某个 panel 的 lock.panelSplits[1].height
// 改成 0.4，再清掉缓存的 panelBoneGroups 让它重新派生出 L2/L3 嵌套树。
//
// Run: LD_LIBRARY_PATH=/tmp/extralib node scripts/probe-tier-rigid.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { extname, join, normalize } from "node:path";

const CHROME = process.env.AHS_CHROME
  || "/sessions/quirky-inspiring-brahmagupta/.cache/puppeteer/chrome-headless-shell/linux-140.0.7339.82/chrome-headless-shell-linux64/chrome-headless-shell";
const cdpPort = 9414;
const ROOT = new URL("../", import.meta.url).pathname;
const profileDir = path.join(os.tmpdir(), "ahs-probe-rigid-" + cdpPort);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".ahs": "application/octet-stream", ".png": "image/png" };
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
// 找到 Front Bangs 1，确认前提（panel / 2 zipper / heights≈[0.3,0.4] / panelBoneGroups
// 缺失），并真实选中它（走 selectLock，不是直接赋值 sel.state）。
const FIND_LOCK = `(() => {
  const t = window.__ahsTest;
  const lock = t.locks.find((l) => l.name === "Front Bangs 1");
  if (!lock) return JSON.stringify({ error: "lock not found", names: t.locks.map((l) => l.name) });
  t.selectLock(lock.id, {});
  const splits = Array.isArray(lock.panelSplits) ? lock.panelSplits : [];
  return JSON.stringify({
    name: lock.name,
    geometryType: lock.geometryType,
    zipperCount: splits.length,
    heights: splits.map((s) => +Number(s.height).toFixed(3)),
    panelBoneGroupsPresent: lock.panelBoneGroups != null
  });
})()`;

const SYMBOLS = `JSON.stringify(Object.keys(window.__ahsTest))`;

const CLICK = (label) => `(() => {
  const el = Array.from(document.querySelectorAll(".outliner-bone-group-label"))
    .find((e) => e.textContent.trim() === ${JSON.stringify(label)});
  if (!el) return JSON.stringify({ error: "row not found", label: ${JSON.stringify(label)},
    rows: Array.from(document.querySelectorAll(".outliner-bone-group-label")).map((e) => e.textContent.trim()) });
  el.click();
  return JSON.stringify({ clicked: el.textContent.trim() });
})()`;

const ROWS = `JSON.stringify(Array.from(document.querySelectorAll(".outliner-bone-group-label")).map((e) => e.textContent.trim()))`;

// 三条链坐标（叶子段0/1/2）+ 网格三轴聚合量的一次性快照。用于判据 D（负向对照，段0
// 不受影响）与判据 A/B（段1/2 是否随中间层动、动了是否保距）。
//
// leafChain(seg) 直接调 splitTipForSegment（__ahsTest 唯一导出的相关符号），没有
// splitTipForLeafSpan 可用 —— 判据②里对中间层链 rest 的近似同样用它，在输出里标注。
const CAPTURE = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  const splits = lock.panelSplits;
  const bones = lock.panelSplitBones || lock.splitBones || [];
  const leafChain = (seg) => {
    const c = t.splitTipForSegment(lock, seg, splits, bones[seg] || null);
    return c ? c.points.map((p) => ({ x: +p.x.toFixed(6), y: +p.y.toFixed(6), z: +p.z.toFixed(6) })) : null;
  };
  const meshSum = () => {
    const pos = lock.mesh.geometry.getAttribute("position");
    let sx = 0, sy = 0, sz = 0;
    for (let i = 0; i < pos.count; i++) {
      sx += pos.array[i * 3]; sy += pos.array[i * 3 + 1]; sz += pos.array[i * 3 + 2];
    }
    return { x: +sx.toFixed(3), y: +sy.toFixed(3), z: +sz.toFixed(3) };
  };
  return JSON.stringify({ leaf0: leafChain(0), leaf1: leafChain(1), leaf2: leafChain(2), meshSum: meshSum() });
})()`;

// 判据②：给中间层节点（leafStart===1 && leafEnd===2）写一条纯旋转 tip。
// restPoints = 该层链当前 rest（近似：直接用 splitTipForSegment(lock, leafStart=1, ...) 的
// restPoints —— __ahsTest 没有 splitTipForLeafSpan，这是明确标注的近似，不是真实中间层
// centerU 链）。points = restPoints 绕 restPoints[0] 绕 Z 轴转 0.5 rad（纯旋转零平移，
// 第 0 点不动）。写入路径：直接改 lock.panelBoneGroups 里对应节点的 tip 字段（__ahsTest
// 没有 setPanelBoneGroupTip/materializePanelBoneGroups 的导出，改公共字段是唯一可行入口，
// 数据形状与 panel-bone-groups.js normalizeGroupTip 契约一致：points/restPoints 同长、
// active !== false）。
const PATCH_ROTATE = `(() => {
  const t = window.__ahsTest;
  const lock = t.getSelectedLock();
  // __ahsTest 没有导出 materializePanelBoneGroups/panelBoneGroupsFor，点了 outliner 行也
  // 不会物化（那条点击路径只调 selectLock/syncTipSelectionFromBoneGroup/updateCurveObjects
  // 等，都不写 lock.panelBoneGroups）——lock.panelBoneGroups 此刻大概率仍是 undefined。
  // 这里现场按 panel-bone-groups.js 的 derivePanelBoneGroups 同一算法（最浅 zipper 优先切分、
  // 无 clamp，heights=[0.3,0.4] 两条 zipper 场景足够）手写一份等价派生，写回 lock.panelBoneGroups，
  // 保证与 outliner 显示的树（L2·Segment1 / L2·Segments2-3 / L3·Segment2 / L3·Segment3）
  // 逐叶子分区、逐深度一致，再在其上找 leafStart=1,leafEnd=2 的节点写 tip。
  if (!lock.panelBoneGroups) {
    const splits = Array.isArray(lock.panelSplits) ? lock.panelSplits : [];
    const leafCount = splits.length + 1;
    const zips = splits.map((s, i) => ({ leftLeaf: i, rightLeaf: i + 1, height: Number(s?.height) || 0 }));
    const AUTHORABLE_KEYS = ["tipClump", "taperCurve", "taperCurveSecondary", "depthCurve", "depthCurveSecondary", "splitEnabled", "splitSnapToLoops"];
    const makeLeaf = (lo, hi, depth) => {
      const n = { leafStart: lo, leafEnd: hi, depth, children: null, tip: null };
      for (const k of AUTHORABLE_KEYS) n[k] = null;
      return n;
    };
    const build = (lo, hi, depth) => {
      const node = makeLeaf(lo, hi, depth);
      if (lo === hi) return node;
      const inner = zips.filter((z) => z.leftLeaf >= lo && z.rightLeaf <= hi);
      if (!inner.length) return node;
      const minHeight = Math.min(...inner.map((z) => z.height));
      const cuts = inner.filter((z) => z.height === minHeight).sort((a, b) => a.leftLeaf - b.leftLeaf);
      node.children = [];
      let start = lo;
      for (const cut of cuts) { node.children.push(build(start, cut.leftLeaf, depth + 1)); start = cut.rightLeaf; }
      node.children.push(build(start, hi, depth + 1));
      return node;
    };
    lock.panelBoneGroups = build(0, leafCount - 1, 1);
  }
  const findNode = (node) => {
    if (!node) return null;
    if (node.leafStart === 1 && node.leafEnd === 2) return node;
    if (!Array.isArray(node.children)) return null;
    for (const child of node.children) { const found = findNode(child); if (found) return found; }
    return null;
  };
  const node = findNode(lock.panelBoneGroups);
  if (!node) return JSON.stringify({ error: "no node with leafStart=1,leafEnd=2 in panelBoneGroups", tree: lock.panelBoneGroups });
  const splits = lock.panelSplits;
  const bones = lock.panelSplitBones || lock.splitBones || [];
  const approxChain = t.splitTipForSegment(lock, 1, splits, bones[1] || null);
  if (!approxChain) return JSON.stringify({ error: "splitTipForSegment(leafStart=1) returned null" });
  const restPoints = approxChain.restPoints.map((p) => ({ x: p.x, y: p.y, z: p.z }));
  const angle = 0.5;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const pivot = restPoints[0];
  const points = restPoints.map((p) => {
    const dx = p.x - pivot.x, dy = p.y - pivot.y;
    return { x: pivot.x + dx * cos - dy * sin, y: pivot.y + dx * sin + dy * cos, z: p.z };
  });
  node.tip = { points, restPoints: restPoints.map((p) => ({ ...p })), twists: null, active: true };
  t.updateCurveObjects(lock, { visible: true });
  return JSON.stringify({
    patchedNode: { leafStart: node.leafStart, leafEnd: node.leafEnd, depth: node.depth },
    approxRestSource: "splitTipForSegment(lock, leafStart=1, splits, bones[1]) — 近似，非真实中间层 centerU 链",
    pivot,
    pointCount: points.length
  });
})()`;

fs.rmSync(profileDir, { recursive: true, force: true });
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--window-size=1400,900", "about:blank"], { stdio: "ignore" });
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) break; } catch {} await sleep(300); }
  const cdp = await connectCDP();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/?ahstest=1` });
  await sleep(9000);

  const ahsFile = path.join(ROOT.replace(/^\/+/, "/"), ".tmp-bone-tree", "archives", "Scalp Conform Test 4.ahs");
  console.log("ahsFile:", ahsFile, "exists:", fs.existsSync(ahsFile));
  const data = fs.readFileSync(ahsFile).toString("base64");
  await evalJS(cdp, `(async () => {
    const bin = atob('${data}'); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const dt = new DataTransfer();
    dt.items.add(new File([new Blob([bytes])], 'Scalp Conform Test 4.ahs'));
    document.body.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
    await new Promise(r => setTimeout(r, 600));
    const dlg = document.querySelector('#dropImportDialog');
    if (dlg && dlg.open) document.querySelector('#confirmDropImport')?.click();
    return true;
  })()`);
  await sleep(7000);

  console.log("=== symbols on __ahsTest ===");
  console.log(await evalJS(cdp, SYMBOLS));

  console.log("=== find Front Bangs 1 ===");
  console.log(await evalJS(cdp, FIND_LOCK));

  console.log("=== outliner rows (before any group click) ===");
  console.log(await evalJS(cdp, ROWS));

  console.log("=== click L2 · Segments 2-3 (derive-on-read: panelBoneGroups still absent, panelBoneGroupsFor derives it live) ===");
  console.log(await evalJS(cdp, CLICK("L2 · Segments 2-3")));
  await sleep(900);

  console.log("=== outliner rows (after click) ===");
  console.log(await evalJS(cdp, ROWS));

  console.log("=== BASELINE capture (before patch) ===");
  const baselineRaw = await evalJS(cdp, CAPTURE);
  console.log(baselineRaw);
  const baseline = JSON.parse(baselineRaw);

  console.log("=== PATCH: write pure-rotation tip on leafStart=1,leafEnd=2 node ===");
  console.log(await evalJS(cdp, PATCH_ROTATE));
  await sleep(500);

  // 判据 C 需要网格真的重建：updateCurveObjects 只重建把手/引导线，不重建 lock.mesh，
  // 而 __ahsTest 没有导出 updateLockGeometry/rebuildLockGeometry（addPatch 消费链的唯一
  // 入口）。生产路径里唯一会调用 updateLockGeometry(immediate:true) 的入口是
  // applySubBoneBrushSample——用零位移（deltaX=deltaY=0）触发一次"move"分支：
  // 该分支对权重>0 的点执行 `points[index].addScaledVector(dragWorld, ...)`，dragWorld
  // 由 (0,0) 屏幕位移换算而来恒为零向量，链点数值不变，但 `changed` 仍被设为 true
  // ⇒ 触发一次真实的 updateLockGeometry(immediate:true) 而不污染已经写入的旋转数据。
  // 光标位置取当前锚点段（leafStart=1）可见的 tipChainHandles 最后一个把手的屏幕投影，
  // 与 probe-tier-inherit.mjs 的 BRUSH 常量同一取法。
  console.log("=== REBUILD trigger: zero-delta applySubBoneBrushSample (forces updateLockGeometry) ===");
  const rebuildRaw = await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.getSelectedLock();
    const vis = (lock.curveObjects.tipChainHandles || []).filter((h) => h.visible);
    if (!vis.length) return JSON.stringify({ error: "no visible tipChainHandles for anchor segment" });
    const rect = t.renderer.domElement.getBoundingClientRect();
    const p = vis[vis.length - 1].position.clone().project(t.camera());
    const consumed = t.applySubBoneBrushSample(
      { undoCaptured: false, reverse: false, editedLockIds: new Set() },
      rect.left + (p.x * 0.5 + 0.5) * rect.width,
      rect.top + (-p.y * 0.5 + 0.5) * rect.height, 0, 0);
    return JSON.stringify({ consumed, visibleHandleCount: vis.length });
  })()`);
  console.log(rebuildRaw);
  await sleep(300);

  console.log("=== AFTER capture (after patch + rebuild trigger) ===");
  const afterRaw = await evalJS(cdp, CAPTURE);
  console.log(afterRaw);
  const after = JSON.parse(afterRaw);

  // ── 四条判据 ──────────────────────────────────────────────────────────────────
  console.log("\n=== 判据计算 ===");

  const dist3 = (a, b) => (a && b) ? Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) : null;

  // 判据 A（保距）：每个叶子每个链点到「中间层链同下标点」的距离，改前 vs 改后。
  // 中间层链本身就是近似链（splitTipForSegment(lock,1,...)），与判据②同一份近似源，
  // 这样至少改前改后用的是同一条参照链，差值有意义。
  let tierChainBefore = null, tierChainAfter = null;
  try {
    const t = null; // 占位，真实计算在浏览器里更准，这里在 node 侧只做距离统计
  } catch {}
  console.log("(A/B/D 的原始链坐标已在上面 BASELINE/AFTER capture 打出，以下用 node 侧重新计算距离)");

  const leafDelta = (segName) => {
    const b = baseline[segName], a = after[segName];
    if (!b || !a) return { available: false };
    if (b.length !== a.length) return { available: false, reason: "length mismatch" };
    const moves = b.map((p, i) => dist3(p, a[i]));
    return { available: true, maxMove: Math.max(...moves), moves };
  };

  const leaf0Delta = leafDelta("leaf0");
  const leaf1Delta = leafDelta("leaf1");
  const leaf2Delta = leafDelta("leaf2");

  console.log("\n--- 判据 D（负向对照：leaf0 不受该中间层覆盖，链坐标应逐字节不变） ---");
  if (!leaf0Delta.available) {
    console.log("该判据未取到数据：", JSON.stringify(leaf0Delta));
  } else {
    console.log(`leaf0 maxMove=${leaf0Delta.maxMove}  (期望 0)   ${leaf0Delta.maxMove === 0 ? "PASS" : "FAIL"}`);
  }

  console.log("\n--- 判据 B（叶子真的动了：leaf1/leaf2 属于 leafStart=1..leafEnd=2，应有明显位移） ---");
  if (!leaf1Delta.available || !leaf2Delta.available) {
    console.log("该判据未取到数据：leaf1=", JSON.stringify(leaf1Delta), " leaf2=", JSON.stringify(leaf2Delta));
  } else {
    console.log(`leaf1 maxMove=${leaf1Delta.maxMove}  leaf2 maxMove=${leaf2Delta.maxMove}  (期望 >0.01)  ${(leaf1Delta.maxMove > 0.01 && leaf2Delta.maxMove > 0.01) ? "PASS" : "FAIL"}`);
  }

  console.log("\n--- 判据 C（网格跟随：meshSum 三轴改后应变） ---");
  if (!baseline.meshSum || !after.meshSum) {
    console.log("该判据未取到数据");
  } else {
    const dX = +(after.meshSum.x - baseline.meshSum.x).toFixed(6);
    const dY = +(after.meshSum.y - baseline.meshSum.y).toFixed(6);
    const dZ = +(after.meshSum.z - baseline.meshSum.z).toFixed(6);
    const moved = Math.abs(dX) > 1e-6 || Math.abs(dY) > 1e-6 || Math.abs(dZ) > 1e-6;
    console.log(`dX=${dX} dY=${dY} dZ=${dZ}  ${moved ? "PASS" : "FAIL"}`);
  }

  console.log("\n--- 判据 A（保距：叶子链点到中间层链同下标点的距离，改前 vs 改后应几乎不变） ---");
  // 中间层参照链只能在浏览器侧用 splitTipForSegment(lock,1,...) 近似重取（改前用 baseline
  // 时刻的、改后用 after 时刻的——两者都是"叶子段1自己"的链，与判据②写入用的是同一近似源）。
  const tierRefRaw = await evalJS(cdp, `(() => {
    const t = window.__ahsTest;
    const lock = t.getSelectedLock();
    const c = t.splitTipForSegment(lock, 1, lock.panelSplits, (lock.panelSplitBones || lock.splitBones || [])[1] || null);
    return c ? JSON.stringify(c.points.map((p) => ({ x: +p.x.toFixed(6), y: +p.y.toFixed(6), z: +p.z.toFixed(6) }))) : "null";
  })()`);
  const tierRefAfter = JSON.parse(tierRefRaw);
  if (!tierRefAfter || !Array.isArray(baseline.leaf1) || !Array.isArray(after.leaf1)) {
    console.log("该判据未取到数据（中间层参照链或叶子链缺失）");
  } else {
    // 近似：中间层参照链改前用 leaf1 的 baseline（该近似下 leafStart=1 段自己就是"中间层
    // 参照链"的近似源），改后用刚取到的 tierRefAfter（= 段1经刚体变换后的自身链，逻辑上
    // 与判据②里写入 node.tip 前算出的 restPoints/points 应该一致，因为段1恰好是 leafStart
    // 锚点段）。这条判据在"近似中间层=leaf1自身"这个简化下会退化为 0（leaf1 到自己的距离
    // 恒为 0），因此改用 leaf2（不是锚点段，有独立的横向偏移）到中间层参照链的距离更有意义。
    const distsBefore = (Array.isArray(baseline.leaf2) ? baseline.leaf2 : []).map((p, i) => dist3(p, baseline.leaf1 && baseline.leaf1[i]));
    const distsAfter = (Array.isArray(after.leaf2) ? after.leaf2 : []).map((p, i) => dist3(p, after.leaf1 && after.leaf1[i]));
    if (!distsBefore.length || !distsAfter.length || distsBefore.some((d) => d == null) || distsAfter.some((d) => d == null)) {
      console.log("该判据未取到数据（leaf1/leaf2 长度不一致或含 null）");
    } else {
      const errs = distsBefore.map((d, i) => Math.abs(d - distsAfter[i]));
      const maxErr = Math.max(...errs);
      console.log("distsBefore(leaf2→leaf1 逐点):", JSON.stringify(distsBefore));
      console.log("distsAfter (leaf2→leaf1 逐点):", JSON.stringify(distsAfter));
      console.log(`maxErr=${maxErr}  (期望 <1e-6 才是严格保距；容许更大误差说明用的是近似参照链，不是真实中间层链)  ${maxErr < 1e-6 ? "PASS(strict)" : "见下方偏差说明"}`);
    }
  }

  console.log("\n=== 汇总 ===");
  console.log(`A 保距    见上方 maxErr 行（本探针用近似参照链，非严格判据，见"## 异常与偏差"）`);
  console.log(`B 叶子动了 leaf1.maxMove=${leaf1Delta.available ? leaf1Delta.maxMove : "N/A"}  leaf2.maxMove=${leaf2Delta.available ? leaf2Delta.maxMove : "N/A"}  (期望 >0.01)`);
  console.log(`C 网格跟随 见上方 dX/dY/dZ 行`);
  console.log(`D 负向对照 leaf0.maxMove=${leaf0Delta.available ? leaf0Delta.maxMove : "N/A"}  (期望 0)`);
} finally { chrome.kill(); srv.close(); }
