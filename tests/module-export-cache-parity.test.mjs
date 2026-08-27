// module-export-cache-parity.test.mjs
//
// 约束：同一个模块的 ?v= 在全仓必须唯一。
//
// 为什么：浏览器按 URL（含 ?v=）缓存模块。同一模块出现两个 ?v= 时会被当成两份不同资源，
// 其中一份可能是缺少新 export 的旧缓存 ⇒ import 失败 ⇒ SyntaxError ⇒ 整个应用白屏。
// 本仓栽过两次：0.2.110；以及 0.2.157 给 panel-bone-groups 加了 5 个 export 却没 bump ?v=，
// 到 0.2.161 才被 tip-sub-bone-host 的新 import 引爆（用户报「刷新后加载失败」）。
//
// node 测试天然抓不到这类问题（node 不走 HTTP 缓存），所以只能用源码级断言。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const ROOT = new URL("../", import.meta.url);
const rd = (p) => readFileSync(new URL(p, ROOT), "utf8");

// 只扫 git 跟踪的文件：.tmp-* 备份副本会带旧 ?v= 污染成"多值"
// （本轮真被这样误导过，先以为 -3/-4 并存是 bug，实为我自己的备份文件）。
function collectVersions() {
  // 排除 scripts/：那是构建期工具（如 split-localization.js），把版本串当**数据**持有
  // （实测它一处就含 app/loc-ja/loc-zh/localization 的 6 个历史 ?v=），浏览器根本不加载它，
  // 不构成缓存危害。只扫真正会被浏览器 import 的运行时代码。
  const files = execSync("git ls-files '*.js' '*.html'", { encoding: "utf8", cwd: ROOT, maxBuffer: 1 << 28 })
    .split("\n").map((s) => s.trim()).filter(Boolean)
    .filter((f) => !f.startsWith("scripts/"));
  const map = new Map();
  for (const f of files) {
    let src;
    try { src = rd(f); } catch { continue; }
    // 键必须是**从仓库根解析出来的规范路径**，两个原因：
    // ① 不能用 basename —— 本仓有两个同名不同目录的模块（modules/io/shape-presets.js 与
    //    modules/data/shape-presets.js），按 basename 归并会报假阳性（第一版这么误报过）。
    // ② 必须**相对导入方所在目录**解析 —— app.js 写 "./modules/bones/panel-bone-groups.js"，
    //    而 modules/bones/tip-sub-bone-host.js 写 "./panel-bone-groups.js"；只strip前缀
    //    会得到两个不同的键，于是真正的多值（本轮那个加载失败）反而检不出来
    //    （第二版这么假绿过：变异 applied: true 但测试仍通过）。
    const dirOf = f.includes("/") ? f.slice(0, f.lastIndexOf("/")) : "";
    for (const m of src.matchAll(/["']([^"']*?)([A-Za-z0-9._-]+)\.js\?v=([0-9a-z-]+)["']/g)) {
      const spec = (m[1] || "") + m[2] + ".js";
      // 用 URL 以 dirOf 为基准做真正的路径解析（含 ../ 回退）
      const resolved = new URL(spec, `file:///${dirOf ? dirOf + "/" : ""}`).pathname.replace(/^\/+/, "");
      const key = resolved.replace(/\.js$/, "");
      if (!map.has(key)) map.set(key, new Set());
      map.get(key).add(m[3]);
    }
  }
  return map;
}

test("每个模块的 ?v= 在全仓唯一", () => {
  const map = collectVersions();
  assert.ok(map.size > 10, "扫到的模块太少，收集逻辑坏了（假绿防护）");
  const bad = [...map.entries()]
    .filter(([, set]) => set.size > 1)
    .map(([k, v]) => `${k}: ${[...v].join(" / ")}`);
  assert.deepEqual(bad, [], "有模块存在多个 ?v= 取值");
});
