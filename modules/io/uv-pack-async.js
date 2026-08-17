// uv-pack-async.js — packFamilies 的 Worker 池并行版（浏览器 dedicated module worker /
// node worker_threads 双环境）。零构建 ES module。
//
// 依赖契约（并行 agent 正在重构 uv-pack.js，将新增以下导出；本文件以它们为唯一依赖，
// 未落地时按契约用下方 fallback* 实现，merge 后经动态 import 特性检测优先用真实导出）：
//   preparePack(families, {gap, fill}) → { valid, totalArea, boxUnit, orders, kMax }
//     （valid=有效 family 列表；boxUnit=单位尺度 UV 包围盒；orders=8 个放置序 number[]；
//       kMax=sqrt(fill/totalArea)）
//   sampleMaxK(boxUnit, totalArea, fill, gap, resolution, order, kFrom, kTo) → number
//   refineMaxK(boxUnit, totalArea, fill, gap, resolution, order, bestK) → number
//     （24 次二分细化，含 *0.999999 余量 —— 与 findMaxKAlpaca 逐位一致，否则异步≠同步）
//   applyPackResult(families, valid, kFinal, order, gap) → {k,totalArea,fillUsed,packed,gap}
//     （主线程原地改 uvs：最终缩放+验证重试+平移+fit-to-tile）
//   packFamilies(families, {gap,fill})（同步版，回退）／ PACK_GAP / PACK_FILL
//
// 并行化策略（与同步 packFamilies 的择优逐位一致）：
//   阶段 1：SEEDS(8) × 8 块（每块 16 个采样索引 1-16…113-128）= 64 个 sample 任务按空闲
//     worker 分发；每 seed bestK = max(块结果)；
//   阶段 2：8 个 refine 任务（每 seed 一个，输入该 seed bestK，bestK=0 也照跑 —— 与同步
//     findMaxKAlpaca 的 [0, kMax/128] 二分一致）；
//   合并：全局 best = k 最大者、并列取 seed 更小（seed 0 优先）；k<=0 的 seed 视为 -1
//     （与同步 findMaxKAlpaca 的 -1 语义对齐）；kFinal = best.k>0 ? best.k : -1。
// 确定性：LCG/order 全部来自 preparePack，worker 内不产生随机；boxes 用 Float64Array 传输
// 保证 worker 内 fitsAt 与同步逐位相同（Float32 会在栅格 ceil 边界翻转布尔值，见 worker 头注释）。
//
// 错误语义：任务异常/超时 → reject 并 dispose 池；调用方 catch 后自行回退同步 packFamilies。
// 输入守卫：preparePack 在内部克隆上执行（克隆=preparePack+applyPackResult 的工作副本），
// 成功后才把最终 uvs/uvisland 拷回调用方 families（原地改值，保持数组身份）——因此 reject
// 时调用方输入完全未被修改，回退同步路径安全。totalArea<=0 → 返回与 packFamilies 相同的
// 空结果 {k:null, totalArea:0, fillUsed:0, packed:[]} 且不动 uvs。
//
// 回退：无自定义 createWorker 且环境无 Worker（如 node 下默认单例）→ resolve 同步
// packFamilies 结果；池创建失败同样回退。Worker 存在但任务失败 → reject（不静默回退）。

import { packFamilies, PACK_GAP, PACK_FILL } from "./uv-pack.js";

const SAMPLES = 128; // 稠密采样点数（与 uv-pack.js findMaxKAlpaca 一致）
const BLOCK = 16;    // 每块采样索引数（1-16, 17-32, …, 113-128 → 8 块）
const SEEDS = 8;     // 择优 seed 数（与 uv-pack.js 一致；实际以 preparePack.orders.length 为准）

// ---- 确定性 PRNG / 几何辅助（与 uv-pack.js 逐字一致，preparePack 回退用）----
function makeLCG(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}
function shuffle(array, rand) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}
function triangleArea(a, b, c) {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const abz = b[2] - a[2];
  const acx = c[0] - a[0];
  const acy = c[1] - a[1];
  const acz = c[2] - a[2];
  const cx = aby * acz - abz * acy;
  const cy = abz * acx - abx * acz;
  const cz = abx * acy - aby * acx;
  return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
}
function meshSurfaceArea(mesh) {
  if (!mesh || !Array.isArray(mesh.positions) || !Array.isArray(mesh.faces)) return 0;
  const positions = mesh.positions;
  let area = 0;
  for (const face of mesh.faces) {
    if (!Array.isArray(face) || face.length < 3) continue;
    const a0 = face[0] * 3;
    if (!Number.isInteger(face[0]) || face[0] < 0 || a0 + 2 >= positions.length) continue;
    const a = [positions[a0], positions[a0 + 1], positions[a0 + 2]];
    for (let i = 1; i + 1 < face.length; i += 1) {
      const bi = face[i] * 3;
      const ci = face[i + 1] * 3;
      if (!Number.isInteger(face[i]) || face[i] < 0 || bi + 2 >= positions.length) continue;
      if (!Number.isInteger(face[i + 1]) || face[i + 1] < 0 || ci + 2 >= positions.length) continue;
      area += triangleArea(a,
        [positions[bi], positions[bi + 1], positions[bi + 2]],
        [positions[ci], positions[ci + 1], positions[ci + 2]]);
    }
  }
  return area;
}
function uvBounds(meshes) {
  let minU = Infinity;
  let minV = Infinity;
  let maxU = -Infinity;
  let maxV = -Infinity;
  let found = false;
  for (const mesh of meshes || []) {
    const uvs = mesh && mesh.uvs;
    if (!uvs) continue;
    for (let i = 0; i + 1 < uvs.length; i += 2) {
      const u = Number(uvs[i]);
      const v = Number(uvs[i + 1]);
      if (!Number.isFinite(u) || !Number.isFinite(v)) continue;
      found = true;
      if (u < minU) minU = u;
      if (u > maxU) maxU = u;
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
  }
  if (!found) return { minU: 0, minV: 0, maxU: 0, maxV: 0, width: 0, height: 0 };
  return { minU, minV, maxU, maxV, width: maxU - minU, height: maxV - minV };
}

// ---- 契约回退实现（与当前 packFamilies 内部逻辑逐字一致；merge 后不生效）----
// packFamilies 步骤 1-4 + orders + kMax：面积/width/island → 单位缩放（uvs *= (width,length)、
// 写 uvisland）→ boxUnit → 8 个放置序（seed 0=maxSide，1..7=LCG 打乱）。
function fallbackPreparePack(families, { gap = PACK_GAP, fill = PACK_FILL } = {}) {
  const valid = [];
  let totalArea = 0;
  for (const family of families || []) {
    const length = Number(family.length);
    if (!(Number.isFinite(length) && length > 0)) continue;
    const area = (family.meshes || []).reduce((sum, mesh) => sum + meshSurfaceArea(mesh), 0);
    if (!(area > 0)) continue;
    const explicitWidth = Number(family.width);
    const width = (Number.isFinite(explicitWidth) && explicitWidth > 0)
      ? explicitWidth
      : area / length;
    if (!(width > 0)) continue;
    valid.push({ family, area, width, length, island: valid.length });
    totalArea += area;
  }
  const kMax = fill > 0 && totalArea > 0 ? Math.sqrt(fill / totalArea) : 0;
  for (const { family, width, length, island } of valid) {
    for (const mesh of family.meshes || []) {
      mesh.uvisland = island;
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        uvs[i] *= width;
        uvs[i + 1] *= length;
      }
    }
  }
  const boxUnit = valid.map(({ family, island }) => ({ family, island, ...uvBounds(family.meshes) }));
  const maxSideOrder = boxUnit
    .map((box, index) => ({ index, key: Math.max(box.width, box.height) }))
    .sort((a, b) => b.key - a.key)
    .map((entry) => entry.index);
  const orders = [maxSideOrder];
  for (let s = 1; s < SEEDS; s += 1) {
    orders.push(shuffle(maxSideOrder.slice(), makeLCG(s)));
  }
  return { valid, totalArea, boxUnit, orders, kMax };
}

// packFamilies 步骤 6-10：最终缩放 + alpacaPackOccupancy 验证重试（overflow 则 kFinal*=0.999）
// → 按 placements 平移 → fit-to-tile 均匀缩放居中 → 返回。packNs 为 uv-pack.js 模块命名空间
// （取其 alpacaPackOccupancy；不静态 import，避免 merge 后该导出被重构改名导致链接失败）。
function fallbackApplyPackResult(families, valid, kFinal, order, gap, packNs) {
  const totalArea = valid.reduce((sum, v) => sum + v.area, 0);
  let boxFinal = null;
  let placements = null;
  let applied = 1; // uvs 当前累计缩放（相对单位尺度；重试时按比例重缩放）
  for (;;) {
    const factor = kFinal / applied;
    for (const { family } of valid) {
      for (const mesh of family.meshes || []) {
        const uvs = mesh && mesh.uvs;
        if (!uvs) continue;
        for (let i = 0; i + 1 < uvs.length; i += 2) {
          uvs[i] *= factor;
          uvs[i + 1] *= factor;
        }
      }
    }
    applied = kFinal;
    boxFinal = valid.map(({ family, island }) => ({ family, island, ...uvBounds(family.meshes) }));
    const packed2 = packNs.alpacaPackOccupancy(
      boxFinal.map((box) => ({ id: box.family.id, island: box.island, width: box.width, height: box.height })),
      { gap, resolution: 256, order: order || undefined }
    );
    if (!packed2.overflow) {
      placements = packed2.placements;
      break;
    }
    kFinal *= 0.999;
  }
  const placedBy = new Map(placements.map((entry) => [entry.id, entry]));
  const packed = [];
  for (const box of boxFinal) {
    const pos = placedBy.get(box.family.id);
    if (!pos) continue;
    const dx = pos.x - box.minU;
    const dy = pos.y - box.minV;
    for (const mesh of box.family.meshes || []) {
      const uvs = mesh && mesh.uvs;
      if (!uvs) continue;
      for (let i = 0; i + 1 < uvs.length; i += 2) {
        uvs[i] += dx;
        uvs[i + 1] += dy;
      }
    }
    packed.push({ id: box.family.id, island: box.island, x: pos.x, y: pos.y, width: box.width, height: box.height });
  }
  // fit-to-tile：整包均匀缩放 + 居中（较长轴填满 [0,1]、较短轴居中）
  let bMinU = Infinity;
  let bMinV = Infinity;
  let bMaxU = -Infinity;
  let bMaxV = -Infinity;
  for (const entry of packed) {
    bMinU = Math.min(bMinU, entry.x);
    bMinV = Math.min(bMinV, entry.y);
    bMaxU = Math.max(bMaxU, entry.x + entry.width);
    bMaxV = Math.max(bMaxV, entry.y + entry.height);
  }
  if (bMaxU > bMinU && bMaxV > bMinV) {
    const spanU = bMaxU - bMinU;
    const spanV = bMaxV - bMinV;
    const s = Math.min(1 / spanU, 1 / spanV);
    const centerU = (bMinU + bMaxU) / 2;
    const centerV = (bMinV + bMaxV) / 2;
    for (const { family } of valid) {
      for (const mesh of family.meshes || []) {
        const uvs = mesh && mesh.uvs;
        if (!uvs) continue;
        for (let i = 0; i + 1 < uvs.length; i += 2) {
          uvs[i] = (uvs[i] - centerU) * s + 0.5;
          uvs[i + 1] = (uvs[i + 1] - centerV) * s + 0.5;
        }
      }
    }
    for (const entry of packed) {
      entry.x = (entry.x - centerU) * s + 0.5;
      entry.y = (entry.y - centerV) * s + 0.5;
      entry.width *= s;
      entry.height *= s;
    }
  }
  return { k: kFinal, totalArea, fillUsed: kFinal * kFinal * totalArea, packed, gap };
}

// 动态 import + 特性检测：uv-pack.js 已导出契约函数则直接用，否则用回退
let contractPromise = null;
function getContract() {
  if (!contractPromise) {
    contractPromise = import("./uv-pack.js").then((mod) => ({
      preparePack: typeof mod.preparePack === "function" ? mod.preparePack : fallbackPreparePack,
      applyPackResult: typeof mod.applyPackResult === "function"
        ? mod.applyPackResult
        : (families, valid, kFinal, order, gap) => fallbackApplyPackResult(families, valid, kFinal, order, gap, mod)
    }));
  }
  return contractPromise;
}

// 深拷贝（保留 NaN/Infinity/typed-array 不可用场景；structuredClone 优先）
function deepClone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  if (Array.isArray(value)) return value.map(deepClone);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) out[key] = deepClone(value[key]);
    return out;
  }
  return value;
}

// 成功后才把工作副本的最终 uvs/uvisland 拷回调用方 families（原地改值，保持数组身份）
function copyBackFamilies(original, worked, valid) {
  for (const { island } of valid) {
    const src = worked[island];
    const dst = original[island];
    if (!src || !dst) continue;
    for (let m = 0; m < src.meshes.length; m += 1) {
      const s = src.meshes[m];
      const d = dst.meshes[m];
      if (!s || !d) continue;
      if (s.uvisland !== undefined) d.uvisland = s.uvisland;
      else if ("uvisland" in d) delete d.uvisland;
      if (s.uvs && d.uvs) {
        for (let i = 0; i < s.uvs.length; i += 1) d.uvs[i] = s.uvs[i];
      }
    }
  }
}

// createPackAsync({ createWorker, workers, timeoutMs }) → { packFamiliesAsync, dispose }
//   createWorker: (workerUrl) => Worker 实例；缺省 `new Worker(url, {type:'module'})`。
//   workers:      池大小（默认 min(hardwareConcurrency||4, 16)，最少 1；创建时生效）。
//   timeoutMs:    单任务超时（默认 60s），超时 → reject 并 dispose 池。
// 池懒创建：首次 packFamiliesAsync 调用才建；后续复用；dispose() 终止所有 worker。
export function createPackAsync({ createWorker, workers: poolWorkers, timeoutMs = 60000 } = {}) {
  const workerUrl = new URL("./uv-pack-worker.js", import.meta.url);
  const customCreateWorker = typeof createWorker === "function";
  const makeWorker = customCreateWorker
    ? createWorker
    : (url) => new Worker(url, { type: "module" });
  let pool = null;

  function buildPool(sizeOverride) {
    const hw = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4;
    const count = Math.max(1, Math.min(sizeOverride ?? poolWorkers ?? hw, 16));
    const slots = [];
    const pending = [];
    let disposed = false;

    const failPool = (err) => {
      if (disposed) return;
      disposed = true;
      for (const slot of slots) {
        try { if (slot.worker && typeof slot.worker.terminate === "function") slot.worker.terminate(); } catch { /* ignore */ }
      }
      for (const task of pending) {
        if (task.timer) clearTimeout(task.timer);
        task.reject(err);
      }
      pending.length = 0;
    };
    const pump = (slot) => {
      if (disposed || slot.busy) return;
      const task = slot.queue.shift();
      if (!task) return;
      slot.busy = task;
      task.timer = setTimeout(() => failPool(new Error("uv-pack worker task timeout (" + timeoutMs + "ms)")), timeoutMs);
      try { slot.worker.postMessage(task.msg); } catch (err) { failPool(err); }
    };
    const bind = (slot) => {
      const onMessage = (data) => {
        const task = slot.busy;
        slot.busy = null;
        if (task) {
          if (task.timer) clearTimeout(task.timer);
          task.resolve(data);
        }
        pump(slot);
      };
      const onError = (err) => failPool(err instanceof Error ? err : new Error("uv-pack worker error: " + String(err)));
      if (typeof slot.worker.on === "function") { // node worker_threads EventEmitter 风格
        slot.worker.on("message", onMessage);
        slot.worker.on("error", onError);
      } else { // 浏览器 Worker
        slot.worker.onmessage = (ev) => onMessage(ev && ev.data);
        slot.worker.onerror = (ev) => onError(ev && ev.error ? ev.error : ev);
      }
    };

    try {
      for (let i = 0; i < count; i += 1) {
        const slot = { worker: null, busy: null, queue: [] };
        slot.worker = makeWorker(workerUrl);
        bind(slot);
        slots.push(slot);
      }
    } catch (err) {
      for (const slot of slots) {
        try { if (slot.worker && typeof slot.worker.terminate === "function") slot.worker.terminate(); } catch { /* ignore */ }
      }
      throw err;
    }

    const request = (msg) => new Promise((resolve, reject) => {
      if (disposed) { reject(new Error("uv-pack worker pool disposed")); return; }
      const task = { msg, resolve, reject, timer: null };
      pending.push(task);
      let best = slots[0];
      let bestLoad = Infinity;
      for (const slot of slots) {
        const load = slot.queue.length + (slot.busy ? 1 : 0);
        if (load < bestLoad) { bestLoad = load; best = slot; }
      }
      best.queue.push(task);
      pump(best);
    });
    const dispose = () => failPool(new Error("uv-pack worker pool disposed"));
    return { request, dispose };
  }

  function ensurePool(sizeOverride) {
    if (pool) return pool;
    pool = buildPool(sizeOverride);
    return pool;
  }

  function dispose() {
    if (pool) {
      try { pool.dispose(); } catch { /* ignore */ }
      pool = null;
    }
  }

  async function packFamiliesAsync(families, { gap = PACK_GAP, fill = PACK_FILL, workers } = {}) {
    // 回退：无自定义 createWorker 且环境无 Worker（如 node 默认单例）→ 同步结果
    if (!customCreateWorker && typeof Worker === "undefined") {
      await Promise.resolve();
      return packFamilies(families, { gap, fill });
    }
    let contract;
    try {
      contract = await getContract();
    } catch {
      await Promise.resolve();
      return packFamilies(families, { gap, fill });
    }
    // 工作副本：preparePack/applyPackResult 都在副本上改 uvs，成功后才拷回 → reject 时输入未动。
    // totalArea<=0 守卫放在副本上：valid 为空时 preparePack 不产生任何修改（不动 uvs），
    // 返回与 packFamilies 相同的空结果。
    const worked = deepClone(families);
    const prepWorked = contract.preparePack(worked, { gap, fill });
    if (!(prepWorked.totalArea > 0)) return { k: null, totalArea: 0, fillUsed: 0, packed: [] };

    let p;
    try {
      p = ensurePool(workers);
    } catch {
      p = null;
    }
    if (!p) {
      await Promise.resolve();
      return packFamilies(families, { gap, fill });
    }

    try {
      const N = prepWorked.boxUnit.length;
      const boxes = new Float64Array(N * 2);
      for (let i = 0; i < N; i += 1) {
        boxes[i * 2] = prepWorked.boxUnit[i].width;
        boxes[i * 2 + 1] = prepWorked.boxUnit[i].height;
      }
      const seeds = prepWorked.orders.length;
      const orderT = prepWorked.orders.map((order) => Int32Array.from(order));

      // 阶段 1：64 个 sample 任务（8 seed × 8 块）
      const sampleTasks = [];
      let seq = 0;
      for (let s = 0; s < seeds; s += 1) {
        for (let b = 0; b < SAMPLES / BLOCK; b += 1) {
          sampleTasks.push({
            id: seq, type: "sample", seed: s,
            boxes, order: orderT[s],
            totalArea: prepWorked.totalArea, fill, gap, resolution: 256, kMax: prepWorked.kMax,
            kFrom: b * BLOCK + 1, kTo: (b + 1) * BLOCK
          });
          seq += 1;
        }
      }
      const sampleReplies = await Promise.all(sampleTasks.map((t) => poolRequest(p, t)));
      const bestKs = new Array(seeds).fill(0);
      for (let i = 0; i < sampleTasks.length; i += 1) {
        const s = sampleTasks[i].seed;
        if (sampleReplies[i].k > bestKs[s]) bestKs[s] = sampleReplies[i].k;
      }

      // 阶段 2：8 个 refine 任务（bestK=0 也照跑，与同步 [0, kMax/128] 二分语义一致）
      const refineTasks = [];
      for (let s = 0; s < seeds; s += 1) {
        refineTasks.push({
          id: seq, type: "refine", seed: s,
          boxes, order: orderT[s],
          totalArea: prepWorked.totalArea, fill, gap, resolution: 256, kMax: prepWorked.kMax,
          bestK: bestKs[s]
        });
        seq += 1;
      }
      const refineReplies = await Promise.all(refineTasks.map((t) => poolRequest(p, t)));

      // 合并：k 最大者，并列取 seed 更小（seed 0 优先）；k<=0 视为 -1（同步 findMaxKAlpaca 语义）
      let best = { k: -1, order: null };
      for (let s = 0; s < seeds; s += 1) {
        const kS = refineReplies[s].k > 0 ? refineReplies[s].k : -1;
        if (kS > best.k) {
          best.k = kS;
          best.order = prepWorked.orders[s];
        }
      }
      const kFinal = best.k > 0 ? best.k : -1;

      const result = contract.applyPackResult(worked, prepWorked.valid, kFinal, best.order, gap);
      copyBackFamilies(families, worked, prepWorked.valid);
      return result;
    } catch (err) {
      dispose();
      throw err;
    }
  }

  return { packFamiliesAsync, dispose };
}

function poolRequest(pool, task) {
  return pool.request(task).then((reply) => {
    if (!reply || reply.type === "error") {
      throw new Error((reply && reply.error) || "uv-pack worker task failed");
    }
    return reply;
  });
}

// 默认导出单例：懒创建池（首次调用才建，后续复用）；dispose 不暴露于默认单例，避免误用。
const defaultAsync = createPackAsync();
export const packFamiliesAsync = defaultAsync.packFamiliesAsync;
