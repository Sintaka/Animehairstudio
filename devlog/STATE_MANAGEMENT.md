# 状态管理架构 / STATE MANAGEMENT

> 阶段 3（全局状态收敛）的成果与规范。app.js 原有 241 个顶层 `let`（全局可变状态）已收敛到 **17 个 store**（main 0.1.5 移植新增 multiCameraState/recovery），剩余 1 个（camera 渲染核心对象，保留全局）。
> 目的：让新 agent 知道「状态在哪、怎么读写、怎么加新状态」，避免再往 app.js 堆全局 let。

## 1. 核心模式：scene-store

`modules/core/scene-store.js` 提供 `createSceneStore(initial)`，返回：
- `state`：Proxy 包装的可变状态对象（赋值可被 subscribe 追踪）
- `snapshot()`：浅拷贝全部状态
- `restore(values)`：批量覆盖
- `subscribe(fn)`：状态变化回调，返回取消函数

各域 store 通过 `createXxxStore()` 封装 scene-store，统一返回 `{ state, snapshot, restore }`。

## 2. Store 清单（17 个）

| store 变量 | 文件 | 覆盖 | 说明 |
|---|---|---|---|
| —（基类） | core/scene-store.js | — | Proxy 状态容器 |
| `sel` | edit/selection-store.js | 24 | 选择集 + outliner/工具（selectedId、activeTool、lockIndex…） |
| `sculptState` | edit/sculpt-edit-store.js | 72 | 雕刻/编辑/拖拽/工具/重复放置/分支面板拖拽 |
| `hairState` | core/hair-store.js | 20 | 发丝/材质/拓扑显示、radial 菜单 |
| `projectState` | io/project-store.js | 17 | 保存/导出/预设/项目名（含 8 个 IO deps） |
| `scalpState` | scalp/scalp-store.js | 35 | 头皮引导/构建/绘制 |
| `viewportState` | core/camera-store.js | 12 | 相机/视口 UI（camera 对象本身保留全局） |
| `guideState` | core/guide-store.js | 10 | 引导/格线/控制点 |
| `branch` | branch/branch-store.js | 8 | 子发片桥接参数/同步速度/region 视图 |
| `ui` | core/ui-store.js | 7 | 面板/偏好快照/吸附/undo 标志 |
| `draw` | edit/draw-store.js | 6 | 绘制/poly 填充状态 |
| `undo` | core/undo-store.js | 2 | undo/redo 标志 |
| `ref` | edit/reference-store.js | 2 | 参考图索引 |
| `transform` | core/transform-store.js | 3 | gizmo 精度/层级 |
| `head` | core/head-store.js | 3 | 头部模型资产 |
| `miscState` | core/misc-store.js | 20 | 工具/radial/fps/braid/杂项状态（camera 保留全局） |
| `multiCameraState` | core/multi-camera-store.js | 6 | 多相机四视图（main 0.1.5 移植，实验性，运行时状态不入档） |
| `recovery` | io/recovery-store.js | 11 | 自动保存/崩溃恢复调度状态（main 0.1.5 移植） |

## 3. 剩余全局 let（仅 1 个，app.js）

- `camera`（渲染核心对象，1533 处属性访问，保留全局）
- 新增状态一律进对应 store，不新增全局 let。

## 4. 偏好字段初始化

偏好（读 localStorage）的初始化分两种：
1. **normalize 函数在 app.js 的**（normalizeNavigationStyle 等）：`let X = readStoredPreference(...)` 保留原位，改为 `store.state.X = readStoredPreference(...)`（避免 TDZ/重复逻辑）。
2. **纯常量 normalize**（THREE.MathUtils.clamp 内联）：直接在 store 默认值里 `readStoredPreference(window, KEY, {...})`（如 branch-store）。

## 5. 批量替换验证清单（9 点，替换后逐项扫）

1. 双重替换 `.store.state.`（对象属性名被误替换 → 曾致项目加载静默失败）
2. 函数参数/绑定位置（`function f(store.state.x)`）
3. 对象简写（含跨行 `{ x,\n store.state.y,`、无逗号、带逗号——按括号上下文：`{` 内补 key、`(` 内保留）
4. 对象属性访问 `obj.name`（用 `(?<!\.)` 排除，但展开符例外见 9）
5. `name:` key 位置（用 `(?!\s*:)` 排除）
6. 字符串/选择器字面量（`querySelector("#name")` 曾被误改）
7. getter/setter 方法名（`get name()` 对象字面量里）
8. 裸引用扫描（替换后 `(?<![\w.])name\b` 应归零，仅 getter 方法名/选择器字符串可留）
9. 数组/对象展开 `...name`（name 前是展开符 `.`，`(?<!\.)` 会误排除 → 先替换 `...name` 再替换普通引用）

## 6. 状态序列化（.ahs 保存）

- `snapshotState()`（app.js）负责项目数据序列化，显式列出字段（读各 store）。
- lock 对象直接序列化（含 branchBridgeSmoothStrength 等 per-lock 字段）。
- UI 临时状态（各 store 的非快照字段）**不**进 .ahs，仅运行时存在。
