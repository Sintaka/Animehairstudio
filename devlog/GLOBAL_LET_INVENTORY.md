# 全局状态登记表 / GLOBAL LET INVENTORY

> 机器生成（2026-08-09），由 `node scripts/gen-let-inventory.js` 产出。共 **20** 个顶层 `let`（app.js 全局可变状态）。
> 用途：阶段 3（全局状态收敛）的地图——按 refs 排序找最核心状态，按 bucket 找子系统边界。`refs`=读写点总数，`span`=首末引用行距。

## 按子系统桶（bucket）汇总

| bucket | 数量 | 核心状态（refs 前 5） |
|---|---|---|
| (unclassified) | 19 | `loftSurfaceDraft`(26) `sideNamingPerspective`(12) `toolRadialGesture`(12) `toolTipsEnabled`(11) `compactToolButtonsEnabled`(11) |
| camera/viewport | 1 | `camera`(68) |

## 全量清单（按 refs 降序）

| let | 定义行 | refs | 读 | 写 | span | bucket |
|---|---|---|---|---|---|---|
| `camera` | 477 | 68 | 63 | 5 | 38049 | camera/viewport |
| `loftSurfaceDraft` | 2126 | 26 | 23 | 3 | 35793 | (unclassified) |
| `sideNamingPerspective` | 2164 | 12 | 10 | 2 | 36446 | (unclassified) |
| `toolRadialGesture` | 2282 | 12 | 9 | 3 | 33490 | (unclassified) |
| `toolTipsEnabled` | 2142 | 11 | 9 | 2 | 32784 | (unclassified) |
| `compactToolButtonsEnabled` | 2143 | 11 | 9 | 2 | 32784 | (unclassified) |
| `toolShortcutPress` | 2129 | 10 | 6 | 4 | 28412 | (unclassified) |
| `scaleSensitivity` | 2141 | 8 | 7 | 1 | 32784 | (unclassified) |
| `clumpUpdateInProgress` | 2127 | 7 | 1 | 6 | 25655 | (unclassified) |
| `toolRadialActions` | 2640 | 6 | 5 | 1 | 28317 | (unclassified) |
| `groupDefaultsWarningContinuation` | 2985 | 5 | 0 | 5 | 29890 | (unclassified) |
| `groupDefaultsWarningAcknowledged` | 2984 | 4 | 3 | 1 | 29881 | (unclassified) |
| `pendingDroppedApplicationKind` | 2533 | 3 | 0 | 3 | 30902 | (unclassified) |
| `pendingDroppedApplicationHandle` | 2535 | 3 | 1 | 2 | 30901 | (unclassified) |
| `fpsFrameCount` | 38496 | 3 | 1 | 2 | 11 | (unclassified) |
| `lastHorizontalViewAxis` | 2175 | 2 | 2 | 0 | 34315 | (unclassified) |
| `fpsSampleStart` | 38497 | 2 | 0 | 2 | 11 | (unclassified) |
| `previousAnimationTimestamp` | 38498 | 2 | 1 | 1 | 4 | (unclassified) |
| `braidSegmentTemplate` | 2067 | 1 | 0 | 1 | 1386 | (unclassified) |
| `braidSegmentBounds` | 2068 | 1 | 0 | 1 | 1386 | (unclassified) |