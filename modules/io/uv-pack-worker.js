// uv-pack-worker.js — UV 打包「采样 / 细化」任务的 module worker。
// 双环境：浏览器 dedicated module worker（self）+ node worker_threads（parentPort）。
// 零依赖：只 import 本目录 ./uv-pack.js（不带 ?v= 后缀；node worker_threads 不识别 query string，
// uv-pack.js 纯函数零依赖，无 import map 问题）。
//
// 依赖契约（并行 agent 正在重构 uv-pack.js，以下导出 merge 后可用）：
//   sampleMaxK(boxUnit, totalArea, fill, gap, resolution, order, kFrom, kTo) → number
//     （返回采样索引 [kFrom,kTo] 内最后一个放得下的 k，无则 0；order 为放置序数组）
//   refineMaxK(boxUnit, totalArea, fill, gap, resolution, order, bestK) → number
//     （24 次二分细化，返回 lo*0.999999 —— 与 findMaxKAlpaca 语义逐位一致，否则异步与同步
//       择优结果不一致）
// 未落地时用下方 local* 回退实现（基于 uv-pack.js 已导出的 alpacaPackOccupancy，语义与
// findMaxKAlpaca 相同）；merge 后特性检测优先用真实导出。
//
// 消息协议（结构化克隆，不 transfer；id 为池内路由扩展字段）：
//   入 {type:'sample', id, boxes, order, totalArea, fill, gap, resolution, kMax, kFrom, kTo}
//     → 出 {type:'sample', id, k}
//   入 {type:'refine', id, boxes, order, totalArea, fill, gap, resolution, kMax, bestK}
//     → 出 {type:'refine', id, k}
//   异常 → {type:'error', id, error}
// boxes: Float64Array（每岛 width,height 平铺）。注意：契约草案写 Float32Array，但 Float32
// 相对误差 ~6e-8 会让占位栅格 ceil((w*k+gap)/cell) 在边界翻转 fitsAt 布尔值 → 采样 k 离散跳变，
// 破坏与同步 packFamilies 的逐位一致；Float64 与主线程 boxUnit 逐位相同。
// order: Int32Array（放置序索引，直接传给 sampleMaxK/refineMaxK，typed array 可直接迭代）。

import * as pack from "./uv-pack.js";

const SAMPLES = 128;        // 稠密采样点数（与 uv-pack.js findMaxKAlpaca 一致）
const REFINE_ITERATIONS = 24;

// boxes（任意 typed array / 数组，width,height 平铺）→ boxUnit 轻量对象数组
function decodeBoxes(boxes) {
  const out = new Array(boxes.length >> 1);
  for (let i = 0; i < boxes.length; i += 2) {
    const island = i >> 1;
    out[island] = { id: island, island, width: boxes[i], height: boxes[i + 1] };
  }
  return out;
}

// ---- 契约回退实现（并行 agent merge 前使用）----
function fitsAt(boxUnit, k, gap, resolution, order) {
  if (typeof pack.alpacaPackOccupancy !== "function") {
    throw new Error("uv-pack-worker: uv-pack.js 缺少 alpacaPackOccupancy（依赖契约未落地）");
  }
  const r = pack.alpacaPackOccupancy(
    boxUnit.map((box) => ({
      id: box.id, island: box.island,
      width: box.width * k, height: box.height * k
    })),
    { gap, resolution, order }
  );
  return !r.overflow; // bbox 装进 [0,1]² 即放得下
}
function localSampleMaxK(boxUnit, totalArea, fill, gap, resolution, order, kFrom, kTo) {
  if (!(fill > 0) || !(totalArea > 0)) return 0;
  const kMax = Math.sqrt(fill / totalArea);
  let bestK = 0;
  for (let i = kFrom; i <= kTo; i += 1) {
    const k = kMax * i / SAMPLES;
    if (fitsAt(boxUnit, k, gap, resolution, order)) bestK = k;
  }
  return bestK;
}
function localRefineMaxK(boxUnit, totalArea, fill, gap, resolution, order, bestK) {
  if (!(fill > 0) || !(totalArea > 0)) return 0;
  const kMax = Math.sqrt(fill / totalArea);
  let lo = bestK;
  let hi = Math.min(kMax, bestK + kMax / SAMPLES);
  for (let i = 0; i < REFINE_ITERATIONS; i += 1) {
    const mid = (lo + hi) / 2;
    if (fitsAt(boxUnit, mid, gap, resolution, order)) lo = mid;
    else hi = mid;
  }
  if (!(lo > 0)) return 0;
  return lo * 0.999999; // 留极小余量，防浮点贴边兜底（与 findMaxKAlpaca 一致）
}
const sampleMaxK = typeof pack.sampleMaxK === "function" ? pack.sampleMaxK : localSampleMaxK;
const refineMaxK = typeof pack.refineMaxK === "function" ? pack.refineMaxK : localRefineMaxK;

function handle(data) {
  try {
    if (!data || (data.type !== "sample" && data.type !== "refine")) {
      post({ type: "error", id: data && data.id, error: "uv-pack-worker: unknown message type: " + (data && data.type) });
      return;
    }
    const boxUnit = decodeBoxes(data.boxes);
    if (data.type === "sample") {
      const k = sampleMaxK(boxUnit, data.totalArea, data.fill, data.gap, data.resolution, data.order, data.kFrom, data.kTo);
      post({ type: "sample", id: data.id, k });
    } else {
      const k = refineMaxK(boxUnit, data.totalArea, data.fill, data.gap, data.resolution, data.order, data.bestK);
      post({ type: "refine", id: data.id, k });
    }
  } catch (err) {
    post({ type: "error", id: data && data.id, error: String(err && err.stack ? err.stack : err) });
  }
}

// 环境分支：node worker_threads 无 self / 无全局 postMessage → 用 parentPort；
// 浏览器 module worker 用 self.onmessage。
let post = null;
function setupBrowser() {
  post = (msg) => self.postMessage(msg);
  self.onmessage = (ev) => handle(ev.data);
}
function setupNode(parentPort) {
  post = (msg) => parentPort.postMessage(msg);
  parentPort.on("message", (data) => handle(data));
}
if (typeof process !== "undefined" && process.versions && process.versions.node) {
  import("node:worker_threads").then(({ parentPort }) => setupNode(parentPort));
} else {
  setupBrowser();
}
