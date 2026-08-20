# 迁移方法论 / MIGRATION GUIDE

> 从 3d 阶段（app.js 瘦身：creation/shape preset + 子发片系统 5 模块）总结的迁移小技巧与注意事项。
> 适用：从 app.js 单体把函数迁到 modules/ 时。

## 1. 迁移小技巧

1. **脚本化提取**：按「函数名 + 括号深度」提取函数体（含嵌套函数），比手写复制省 token、低笔误。`const x = () => {}` 嵌套定义会随外层一起提取。
2. **依赖注入模式**：`createXxxApi(deps)` 统一出口，deps 传 app.js 函数/常量/store/全局对象。模块内部 DOM 用 `document.querySelector`（DOM 就绪时创建）。
3. **模块间 import（优先于 deps）**：同域模块直接互引（`branch-region-panel` 导出 `clampRegionParam`，`branch-bridge` import 它；`branch-connect`/`curve-math` 的纯函数同理）。比 deps 注入更干净、无时序问题。
4. **惰性闭包解决 api 创建时序**：A 模块需 B 模块函数，但 A 先创建（调用点更早）——deps 传 `(...a) => bApi.fn(...a)`，闭包运行时才解析 bApi（已初始化）。
5. **依赖扫描要精确**：`FUNCTION_INDEX` 会把嵌套 const（缩进的 `const x =`）误报为顶层——用「行首无缩进的 `^(function|const|let) name`」验证是否真顶层。局部同名（`const toGridCol`）会 shadow 外部，迁移后使用点必须指局部。
6. **顶层常量/全局对象显式注入**：`BRANCH_CONNECTION_ENABLED` 等 const、`locks`/`camera`/`renderer`/`raycaster`/`transformControls` 等全局，迁移函数引用它们时 deps 注入。
7. **已模块化的纯函数直接 import**：`symmetricClosedCurveParameters`/`twistCurveDisplayRange` 在 curve-math.js——迁移时直接 import，别 deps 注入。

## 2. 注意事项（踩过的坑）

1. **对象字面量简写 `a.b` 非法**：deps 注入值若不是裸标识符（如 `branchBridge.fn`），必须 `name: branchBridge.fn`，不能 `branchBridge.fn,`（SyntaxError）。
2. **api 创建块的 deps 会被调用点替换误伤**：先做「调用点替换」，再插入 api 创建（闭包/完整引用不受替换影响）。
3. **字符串/选择器误伤**：`document.querySelector("#name")` 里的名字会被批量替换——替换后必扫字符串字面量。
4. **迁移后 restore 链路**：加载 .ahs 时 snapshotState/restoreLock 会调用被迁函数——缺依赖（如 `twistCurveDisplayRange`）会导致 "Could not open project file"（被 catch 吞）。迁移后必跑 verify（4 个 .ahs status 应 "opened"）。
5. **验证不依赖外网**：verify-smoke 用 CDP Fetch 把 `https://unpkg.com/three@0.165.0/*` 拦截到 `%TEMP%\ahs-verify-three\vendor`（含 CORS 头）——unpkg 断网也能验证。
6. **每批独立 commit + verify 13/13**；删函数用「括号深度匹配」避免误删；调用点替换用词边界 + 排除 `.name`（属性访问）。

## 3. 9 点替换验证清单（替换后逐项扫）

1. 双重替换 `.store.state.`（对象属性名被误替换 → 曾致项目加载静默失败）
2. 函数参数/绑定位置（`function f(store.state.x)`）
3. 对象简写（跨行/无逗号/带逗号；按括号上下文：`{` 内补 key、`(` 内保留；值不是裸标识符时用 `key: value`）
4. 对象属性访问 `obj.name`（`(?<!\.)` 排除，但 `...name` 展开例外见 9）
5. `name:` key 位置（`(?!\s*:)` 排除）
6. 字符串/选择器字面量
7. getter/setter 方法名
8. 裸引用扫描（替换后 `(?<![\w.])name\b` 应归零，仅 getter 方法名/选择器可留）
9. 数组/对象展开 `...name`（先替换 `...name` 再普通引用）
