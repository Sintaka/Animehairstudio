// panel-bone-import-contract.test.mjs —— 钉住 app.js 对 panel-bone-groups.js 的 import 完整性。
//
// 起因（真实踩坑）：阶段 5 写 drillPanelBoneGroupToLeaf 时用了 panelBoneGroupPathForLeaf，
// 但**忘了加进 import 列表**。`node --check` 过、全量 492 条测试全绿 —— 因为纯函数测试根本
// 不执行 app.js 的运行时路径，而这个标识符要到「用户第一次在视口点发尖」才会 undefined 抛错。
// 本仓既有教训原文：「测试全绿不等于 deps 引用正确：纯函数测试碰不到 deps.X，少一个键要到
// 运行时才抛」。这里把它变成静态可查的契约。
//
// 判据是双向的：
//   ① app.js 里出现的每个 panelBoneGroup* / *PanelBoneLevel* 标识符，都必须在 import 列表里；
//   ② import 列表里的每个名字，都必须真的被 panel-bone-groups.js 导出。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const modSource = readFileSync(new URL("../modules/bones/panel-bone-groups.js", import.meta.url), "utf8");

// app.js 里那条 import 语句
const importMatch = appSource.match(/import \{([^}]+)\} from "\.\/modules\/bones\/panel-bone-groups\.js\?v=[^"]+";/);

test("app.js 确实从 panel-bone-groups.js 具名导入（import 语句存在）", () => {
  assert.ok(importMatch, "没找到对 panel-bone-groups.js 的具名 import —— 本契约的前提不成立");
});

const imported = new Set(
  (importMatch?.[1] ?? "").split(",").map((s) => s.trim()).filter(Boolean)
);

const exported = new Set(
  [...modSource.matchAll(/^export (?:function|const) ([A-Za-z0-9_]+)/gm)].map((m) => m[1])
);

test("import 列表里的每个名字都真的被模块导出", () => {
  const missing = [...imported].filter((n) => !exported.has(n));
    assert.deepEqual(missing, [], `这些名字 import 了但模块没导出（运行时会 undefined）：${missing.join(", ")}`);
});

test("app.js 里用到的分组树标识符都在 import 列表里（防「用了但忘了导入」）", () => {
  // 收集 app.js 里所有像分组树 API 的标识符用法。前缀取两族：
  //   panelBoneGroup* / panelBoneGroups*  与  *PanelBoneLevel* / *PanelBoneGroups*
  //
  // ★ 刻意**不剥注释**：在注释里裸写一个已导出的名字会触发假阳性（0.2.173 撞过一次 ——
  // 一句「normalizePanelBoneGroups 会整棵拒绝这棵树」让本条变红，代码其实是对的）。
  // 这是有意保留的取舍：本条是防「用了但忘了 import」的守卫，而那种缺陷要到用户交互时
  // 才 undefined 抛错，`node --check` 与纯函数测试都抓不到 ⇒ **宁可假阳不可假阴**。
  // 剥注释需要处理字符串里的 `//`、模板串、正则字面量等，做错了就是假阴。
  // 撞到时的正确做法是**改注释措辞**（用中文描述那个函数而不是裸写标识符），不是放宽本条。
  const used = new Set();
  for (const m of appSource.matchAll(/\b(panelBoneGroup[A-Za-z0-9_]*|[a-z][A-Za-z0-9_]*PanelBone(?:Level|Levels|Groups)[A-Za-z0-9_]*)\b/g)) {
    used.add(m[1]);
  }
  // 只关心「模块确实导出、因此本该来自 import」的那些；app.js 自己定义的同名函数排除掉。
  const locallyDefined = new Set(
    [...appSource.matchAll(/^(?:function|const|let) ([A-Za-z0-9_]+)/gm)].map((m) => m[1])
  );
  const shouldBeImported = [...used].filter((n) => exported.has(n) && !locallyDefined.has(n));
  const notImported = shouldBeImported.filter((n) => !imported.has(n));
  assert.deepEqual(
    notImported,
    [],
    `这些标识符在 app.js 里被使用、模块也导出了，但没有出现在 import 列表 —— `
    + `运行时会是 undefined 并在用户交互时抛错：${notImported.join(", ")}`
  );
});

test("panel-bone-groups.js 的 ?v= 在全部 import 站点一致", () => {
  // 新增 export 后若只 bump 一处，回访用户会拿缓存旧模块解析新 export ⇒ SyntaxError
  // 整个应用打不开（0.2.110 踩过）。这里断言全仓只有一个版本值。
  const all = [...appSource.matchAll(/panel-bone-groups\.js\?v=([0-9a-z-]+)/g)].map((m) => m[1]);
  const distinct = new Set(all);
  assert.ok(all.length >= 1, "app.js 里应至少有一处带 ?v= 的引用");
  assert.equal(distinct.size, 1, `?v= 不一致：${[...distinct].join(" / ")}`);
});
