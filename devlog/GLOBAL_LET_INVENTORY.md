# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-13），由 `node scripts/gen-let-inventory.js` 产出。共 **1** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| camera/viewport | 1 | `camera`(70) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `camera` | 564 | 70 | 61 | 9 | 19400 | camera/viewport |