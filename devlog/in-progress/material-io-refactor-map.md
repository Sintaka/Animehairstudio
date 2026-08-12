# material + IO 收尾（rootAttachment + createProjectSaveApi 收敛）重构引用图

> 只读盘点（2026-08-12，分支 0.2.59-refactor）。依据 devlog/FUNCTION_INDEX.json（generatedAt 2026-08-12，app.js 21,401 行 / 673 函数）与 Select-String 实扫。
> 对应 devlog/in-progress/appjs-slim-remaining-plan.md 的 A6（material）与 C1（IO 遗留 + rootAttachment）。
> Godel 旧区间 L10351-10661 / L12779-13973（32,530 行口径）已按当前 21,400 行重定位为下方表格行号（与 app.js 实际函数行一致，已逐个 Select-String 核对）。
> 未修改 app.js / modules/*；本文件为唯一新增/可写文件。

## 0. 结论速览

| 批次 | 函数数 | 毛行 | 外部引用行 | 宿主函数/批数 | 净减估 | 难度 |
|---|---|---|---|---|---|---|
| A6 material | 16 + 2 常量 | L7076-7386 = 311 | ~62（app.js 内部 ~56 + draw-flow.js 6） | ~18 | ~285 | 低 |
| C1 IO+rootAttachment | 22 + 1 常量 | 545（A 组 267 + B 组 278，剔除区间内留守 wiring） | ~26 | ~17 | ~510 | 低 |

- 建议模块：**modules/material/material-ui.js**（A6）+ **modules/io/io-tail.js**（C1 全部，含 rootAttachment；亦可把 rootAttachment 拆到 modules/geometry/root-attachment.js，见 §4）。
- 装配模式沿用 createXxxApi(deps)：deps 传 .state 代理 + 引用；模块内不得 deps.X.state.y。
- createProjectSaveApi(deps) 已收敛 8 个 getter/setter 到 project-store；剩余 10 个散装 deps 不建议再并入 store（§4.6）。

## 1. 待迁函数枚举

### 1.1 A6 material（L7076-7386，311 行）

| 函数 | 行 | 类型 | 内部互调 | 外部引用行（区外） |
|---|---|---|---|---|
| hairMaterialDefinition | 7076 | 薄封装 | resolveHairMaterialDefinition(material-state) | —（仅区内 7081/7085/7320） |
| materialForLock | 7080 | 薄封装 | hairMaterialDefinition | drawFlowDeps 7949；draw-flow.js 533 |
| activeHairMaterialDefinition | 7084 | 薄封装 | hairMaterialDefinition | UI 绑定 17104/17110/17116/17122/17129/17137 |
| strandDisplayColor | 7090 | 显示色 | materialForLock、normalizeHairLayer | drawFlowDeps 7946；draw-flow.js 716；strandViewportBaseColor 12484/12489/12490/12500/12505/12510/12514；outliner 16105/16542 |
| setAnimeHairBaseColor | 7108 | 材质写入 | — | drawFlowDeps 7950；draw-flow.js 543；setStrandSelectionVisual 12558 |
| createAnimeAnisotropicMaterial | 7121 | 材质构建 | materialForLock、strandDisplayColor | —（仅 7164） |
| createHairMaterial | 7161 | 材质构建 | materialForLock、strandDisplayColor、createAnimeAnisotropicMaterial | drawFlowDeps 7948；draw-flow.js 536；addLock 8265；restoreLock 10016 |
| createStrandSelectionOutline | 7203 | 选中描边网格 | — | addLock 8270/8272；restoreLock 10021/10023 |
| strandUsesDoubleSidedMaterial | 7238 | 判定 | — | drawFlowDeps 7947；draw-flow.js 547；addLock 8267；restoreLock 10018；rebuildLockGeometry 12180；ensureUvCheckerForLock 12298 |
| applyMaterialDefinitionToLock | 7247 | 应用 | materialForLock、createHairMaterial、strandUsesDoubleSidedMaterial、setAnimeHairBaseColor、strandViewportBaseColor、ensureUvCheckerForLock、updateStrandSelectionHighlightForLock | syncMirrorPartnerFromLock 8633；setLayerColorShiftsEnabled 15029；UI 绑定 17074 |
| refreshMaterialUsers | 7274 | 批量刷新 | applyMaterialDefinitionToLock、drawFlowApi.updateDrawStrandPreview、updateStrandSelectionHighlight、renderLockList | UI 绑定 17112/17118/17125/17131/17141 |
| renderHairMaterialOutliner | 7283 | UI | hairMaterialUsageCounts(material-state)、activeHairMaterialDefinition | UI 绑定 17107/17119/17132 |
| renderHairMaterialOptions | 7313 | UI | hairMaterialDefinition | UI 绑定 17106 |
| syncHairMaterialEditor | 7323 | UI 同步 | activeHairMaterialDefinition、materialForLock、getSelectedLock、renderHairMaterialOptions、renderHairMaterialOutliner | reapplySelectionAfterStateRestore 9747；syncInputs 13391；UI 绑定 17076/17091/17113；boot 21337 |
| createProjectHairMaterial | 7349 | 增材质 | getSelectedLock、pushUndoState、materialForLock、activeHairMaterialDefinition、normalizeHairMaterialDefinition、editSelectedLocks、applyMaterialDefinitionToLock、syncHairMaterialEditor、renderLockList | UI 绑定 17082/17085 |
| deleteActiveHairMaterial | 7369 | 删材质 | activeHairMaterialDefinition、pushUndoState、applyMaterialDefinitionToLock、syncActiveMirror、syncHairMaterialEditor、renderLockList | UI 绑定 17086；keydown(Delete) 19496 |
| STRAND_SELECTION_OUTLINE_COLOR | 7200 | 常量 | — | setStrandSelectionVisual 12501/12506/12530 |
| STRAND_MIRROR_OUTLINE_COLOR | 7201 | 常量 | — | setStrandSelectionVisual 12511/12530 |

> createHairMaterial 归属核实：draw-flow.js 仅经 drawFlowDeps 使用（L536 预览网格），非 draw-flow 私有；app.js 内 addLock(8265)/restoreLock(10016) 也用。归属 A6 无争议，但跨批次重接需改 drawFlowDeps 为 materialApi.createHairMaterial。
> 常量 7200/7201 另被脊柱选区视觉（strandViewportBaseColor/setStrandSelectionVisual 12482-12558）使用，需保留在 app.js 或由模块导出后 app.js import，不可只随模块走。### 1.2 C1a IO-rootAttachment（L8940-9206，267 行）

| 函数 | 行 | 类型 | 内部互调 | 外部引用行（区外） |
|---|---|---|---|---|
| rootAttachmentFrame | 8940 | 帧计算 | — | —（仅 9086/9120） |
| rootAttachmentLocalFrame | 8952 | 局部帧 | scalpBuilder.activeScalpSurfaceMesh | —（仅 9087/9123/9184） |
| resolveRootAttachment | 8970 | 解析 | scalpBuilder | —（仅 9032/9050/9191） |
| ROOT_LOCAL_CURVE_FIELDS | 9003 | 常量 | — | — |
| curvePointsToRootLocal | 9010 | 纯函数 | — | —（仅 9041） |
| curvePointsFromRootLocal | 9022 | 纯函数 | — | —（仅 9062） |
| syncRootAttachmentLocalCurves | 9030 | 同步 | resolveRootAttachment、curvePointsToRootLocal | —（仅 9130） |
| applyRootAttachmentLocalCurves | 9046 | 应用 | resolveRootAttachment、curvePointsFromRootLocal、scalpBuilder.rootScalpOffsetDistance、layerOffsetForLock、layerRootOffsetFactor | restoreLock 10010 |
| createRootAttachment | 9077 | 创建 | rootAttachmentFrame、rootAttachmentLocalFrame、scalpBuilder.closestPointOnActiveScalp | scalpBuilderDeps 3118；syncMirrorPartnerFromLock 8598；syncLockFromCurve 12154；buildEvenlySpacedProceduralDuplicates 15728；updateDuplicatePlacement 15864；scalp-builder.js 2929/2970 |
| syncRootAttachmentMetadata | 9107 | 元数据同步 | createRootAttachment、rootAttachmentFrame、rootAttachmentLocalFrame、syncRootAttachmentLocalCurves、normalizeHairLayer | scalpBuilderDeps 3219；snapshotState 8864；syncLockFromCurve 12161；scalp-builder.js 2933 |
| rootAttachmentToData | 9134 | 序列化 | vectorToData、normalizeHairLayer | snapshotState 8864 |
| rootAttachmentFromData | 9162 | 反序列化 | createRootAttachment、resolveRootAttachment、rootAttachmentLocalFrame、vectorToData、dataToVector、normalizeHairLayer | addLock 8251；restoreLock 10004 |

> 已迁出核实：strand-geometry.js 不含 rootAttachment 代码（仅 branch-hierarchy/branch-root-bone 置 null、curve-surface-create 置默认字段）；rootAttachment 真正模块消费者只有 scalp-builder.js（经 scalpBuilderDeps，L466/2929/2933/2970）。

### 1.3 C1b IO-preferences / project / recent（候选段 278 行）

| 函数 | 行 | 类型 | 内部互调 | 外部引用行（区外） |
|---|---|---|---|---|
| downloadPreferencesAndPresets | 9207 | 下载 | fileApi.downloadProjectFile、createPreferencesBackup(preferences-backup)、preferencesBackupFileName | 按钮绑定 18723（index.html #downloadPreferencesAndPresets） |
| importedBooleanPreference | 9240 | 纯函数 | — | —（仅区内 9291-9316） |
| loadPreferencesAndPresets | 9288 | 加载 | importedBooleanPreference + 十余个 setXxx（见 §2.2） | —（仅 9363） |
| handlePreferencesAndPresetsFile | 9358 | 事件处理 | loadPreferencesAndPresets | change 绑定 18722 |
| openHairProjectFile | 9402 | 打开 | validateHairProject、referenceHeadApi、scalpBuilder、restoreState、safelyRememberRecentProject、undoHistory/redoHistory/updateHistoryButtons、frameViewportBounds、presetLibraryApi | 菜单 17550；input change 17561（9548 为区内 confirm... 调用） |
| dragContainsApplicationFile | 9460 | 判定 | applicationDropFileKind(file-drop)、SUPPORTED_REFERENCE_IMAGE_TYPES | window dragenter/dragover 18866/18877 |
| safelyRememberRecentProject | 9469 | 记忆 | rememberRecentProject(recent-projects)、renderRecentProjectsMenu | fileApi deps 9399（project-files.js 经 deps 使用）；openHairProjectFile 9451（区内） |
| renderRecentProjectsMenu | 9478 | UI | listRecentProjects(recent-projects)、openDroppedApplicationFilePrompt、closeAppMenus | fileMenu 18491；recentProjectsMenu click 18500（9472 区内） |
| openDroppedApplicationFilePrompt | 9510 | 弹窗 | applicationDropFileKind | window drop 18910（9501 区内） |
| closeDroppedApplicationFilePrompt | 9535 | 弹窗 | — | 弹窗按钮 17596（9546 区内） |
| confirmDroppedApplicationFile | 9539 | 确认 | openHairProjectFile、referenceHeadApi | dropImportForm submit 17593 |

> C1 区间内留守（不随函数移动）：presetLibraryDeps Object.assign 批（9248-9277，含 boot 调用 9274-9276 loadBraidMeshPreset x2 / setupShapePresetUi）与 const fileApi = createProjectSaveApi({...}) 批（9374-9401）。迁移后这些行留在原处，仅把其中 safelyRememberRecentProject 引用改为 ioApi.safelyRememberRecentProject。## 2. deps 清单

### 2.1 A6 material — deps（app.js 注入）

- 数据/引用：hairMaterialDefinitions（L1038，共享可变数组；snapshotState 8691、restoreSharedStateForStateRestore 9640-9652 也直接引用，故留在 app.js 经 deps 传引用）、locks（L1967）、animeAnisotropicLightDirection（L982，render loop 19803 更新，须留 app.js 传引用）、hairState.state（activeHairMaterialId/hairMaterialIndex/showGroupColors/uvCheckerEnabled）、sel.state（layerColorShiftsEnabled）、sculptState.state（drawStrandStroke）。
- DOM：hairMaterialSelect 2030 / newHairMaterialButton 2031 / addProjectHairMaterialButton 2032 / hairMaterialOutliner 2033 / deleteProjectHairMaterialButton 2034 / hairMaterialNameInput 2035 / hairMaterialShaderInput 2036 / hairMaterialStandardControls 2037 / hairMaterialAnimeControls 2038 / hairMaterialColorInput 2039 / hairMaterialRoughnessControl 2040 / hairMaterialRoughnessInput 2041 / hairMaterialRoughnessValue 2042 / hairMaterialAnimeColorInputs 2043 / hairMaterialAnimeNumericControls 2050。
- 脊柱/UI 函数（留 app.js，经 deps）：pushUndoState(9555)、getSelectedLock(13461)、editSelectedLocks(13554)、renderLockList(16424)、syncActiveMirror(8643)、updateStrandSelectionHighlight(12588)、updateStrandSelectionHighlightForLock(12584)、ensureUvCheckerForLock(12277)、strandViewportBaseColor(12482)、normalizeHairLayer(2948)、drawFlowApi(1500，updateDrawStrandPreview)。
- 模块级可直接 import：THREE；./modules/geometry/anime-hair-shaders.js（ANIME_ANISOTROPIC_FRAGMENT_SHADER / ANIME_ANISOTROPIC_NUMERIC_FIELDS / ANIME_ANISOTROPIC_SHADER / ANIME_ANISOTROPIC_VERTEX_SHADER / LAMBERT_SHADER / normalizeHairShader / STANDARD_ANISOTROPIC_SHADER）；./modules/material/material-state.js（hairMaterialUsageCounts / normalizeHairMaterialDefinition / resolveHairMaterialDefinition）；./modules/core/app-config.js（DEFAULT_HAIR_MATERIAL_ID / HAIR_LAYERS / SCALP_REGIONS / MATERIAL_LAYER_COLOR_FACTORS / LAYER_HUE_SHIFTS / DEFAULT_HAIR_MATERIAL_SETTINGS）。

### 2.2 C1 — deps（app.js 注入）

- rootAttachment 组：scalpBuilder(1402)、layerOffsetForLock(2952)、layerRootOffsetFactor(2957)、normalizeHairLayer(2948)、vectorToData(10103)、dataToVector(10107)。
- preferences 组：fileApi(9373)、documentLocalizer(351)、projectState.state、hairState.state、sel.state、ui.state、draw.state、miscState.state、guideState.state、viewportState.state、creationPresets(9277)、shapePresets(7683)、presetLibraryApi(1536)、saveLanguage(282)、languageSelect、braidCreationDefaults(1236)、braidToolPresetInput、DOM：preferencesAndPresetsFile(2130)/preferencesBackupStatus(2131)/loadPreferencesAndPresetsButton(2128)/downloadPreferencesAndPresetsButton(2129)。
- project/recent 组：restoreState(9773)、referenceHeadApi(2918)、scalpBuilder(1402)、scalpState(1393)、head(2911 head store)、guideState(1783)、presetLibraryApi(1536)、undoHistory(1990)/redoHistory(1991)/updateHistoryButtons(9596)、frameViewportBounds(4382)、closeAppMenus(3462)、SUPPORTED_REFERENCE_IMAGE_TYPES(3740)、hairProjectFileInput(2238)、presetLibraryStatus、DOM：recentProjectsSubmenu(2240)/dropImportDialog(2243)/dropImportForm(2244)/dropImportDialogTitle(2245)/dropImportDescription(2246)/dropImportFileName(2247)/dropImportWarning(2248)/dropObjTargetChoices(2249)/closeDropImportDialog(2250)/cancelDropImport(2251)/confirmDropImport(2252)。
- 模块级可直接 import：THREE、./modules/io/file-actions.js（cleanFileBaseName）、./modules/io/recent-projects.js（rememberRecentProject / listRecentProjects）、./modules/io/preferences-backup.js（createPreferencesBackup / normalizePreferencesBackup / preferencesBackupFileName）、./modules/io/project-schema.js（validateHairProject）、./modules/io/file-drop.js（applicationDropFileKind）。

## 3. 硬障碍检查

1. __AHS_TEST_SEAM：当前 L21344（app.js 尾）。不引用本批任何函数（仅 getSelectedLock/selectLock/updateCurveObjects/sel/hairState/undoHistory 等脊柱与既有模块 api）。两批迁移不触碰该区，无需重定位；批次验收勿动该对象。
2. 脊柱边界（留 app.js，经 api 重接）：
   - A6 触点：snapshotState(8679, hairMaterialDefinitions)、restoreSharedStateForStateRestore(9640-9652, 同数组 + normalizeHairMaterialDefinition)、restoreLock(10016/10018/10021/10023)、addLock(8251/8265/8267/8270/8272)、syncMirrorPartnerFromLock(8633)、syncLockFromCurve(12180)、rebuildLockGeometry(12180)、ensureUvCheckerForLock(12298)、strandViewportBaseColor(12482-12514)、setStrandSelectionVisual(12558)、setLayerColorShiftsEnabled(15029)、reapplySelectionAfterStateRestore(9747)、syncInputs(13391)。
   - C1 触点：snapshotState(8864)、restoreLock(10004/10010)、addLock(8251)、syncMirrorPartnerFromLock(8598)、syncLockFromCurve(12154/12161)、restoreState(9773，openHairProjectFile 调用)、buildEvenlySpacedProceduralDuplicates(15728)、updateDuplicatePlacement(15864)。
   - 这些脊柱函数不迁；迁移后把函数名替换为 materialApi.X / ioApi.X 即可（函数体不变）。
3. 引导期顶层调用与装配时序：
   - A6：materialApi = createMaterialUiApi(materialDeps) 须在 import 区后尽早创建（同 scalpBuilderApi 模式，deps 空对象先行）；Object.assign(materialDeps, {...}) 批填须放在最后一个 deps 定义之后——最晚 deps 为 renderLockList(16424)，故批填点建议紧邻其后（或与其它 Object.assign 批对齐）。boot 调用 syncHairMaterialEditor()(21337) 与 UI 绑定块(17068-17145) 在批填之后，天然满足；drawFlowDeps 批(7879) 改引 materialApi.*，运行时才取值，无时序风险。
   - C1：ioApi = createIoTailApi(ioDeps) 同样早期创建；批填须在 fileApi(9374) 与 restoreState(9773) 之后（openHairProjectFile 依赖二者），建议放在 restoreState 定义后。scalpBuilderDeps 批(3101) 改引 ioApi.createRootAttachment / ioApi.syncRootAttachmentMetadata（api 对象已存在，运行时取值）。9274-9276 presetLibrary boot 调用与 21337 boot 调用均不受影响。
4. 跨批次重接：drawFlowDeps 5 项（strandDisplayColor/strandUsesDoubleSidedMaterial/createHairMaterial/materialForLock/setAnimeHairBaseColor）改为 materialApi；scalpBuilderDeps 2 项（createRootAttachment/syncRootAttachmentMetadata）改为 ioApi；fileApi deps 1 项（safelyRememberRecentProject）改为 ioApi；presetLibraryDeps 批（9248-9277）留守不改。
5. 区间交错：C1 候选函数与 presetLibraryDeps 批、fileApi 批物理交错（9248-9277 / 9374-9401），迁移时只搬函数定义块，不搬这两批；行号会因此重排，回归需以 verify-smoke 为准。
6. 常量归属：STRAND_SELECTION_OUTLINE_COLOR / STRAND_MIRROR_OUTLINE_COLOR 被 setStrandSelectionVisual(12501-12530) 使用——要么随 material 模块导出并在 app.js import，要么留 app.js 经 deps 传入；建议留 app.js 经 deps 传入（与 hairMaterialDefinitions 同策略，避免 app.js 反向 import 新模块的视觉常量）。## 4. 输出建议

### 4.1 模块划分
- A6 -> modules/material/material-ui.js，导出 createMaterialUiApi(deps)。返回 16 个函数 + 2 常量（若常量留 app.js 则只返回函数）。归属明确（material-state.js 同目录已有纯函数底座）。
- C1 -> modules/io/io-tail.js，导出 createIoTailApi(deps)，返回 22 个函数。rootAttachment 组与 preferences/project/recent 组同批（贴合 plan C1 单批单 commit）。可选拆分：rootAttachment -> modules/geometry/root-attachment.js（几何语义更纯，io 不依赖 scalpBuilder），但需多一个 api + 多一次批填，收益一般，默认不拆。

### 4.2 装配点
- A6：const materialDeps = {}; const materialApi = createMaterialUiApi(materialDeps); 置于 import 区后；Object.assign(materialDeps, {...}) 置于 renderLockList(16424) 定义后（最后一 deps）。UI 事件绑定块(17068-17145) 留 app.js，把函数引用改为 materialApi.X。
- C1：const ioDeps = {}; const ioApi = createIoTailApi(ioDeps); 置于 import 区后；Object.assign(ioDeps, {...}) 置于 restoreState(9773) 定义后。fileApi 批(9374-9401) 留守，仅改 safelyRememberRecentProject 为 ioApi 引用。

### 4.3 外部调用点汇总
- A6：62 个外部引用行 / ~18 个宿主（drawFlowDeps 批、draw-flow.js 5 处、addLock、restoreLock、syncMirrorPartnerFromLock、syncLockFromCurve、rebuildLockGeometry、ensureUvCheckerForLock、strandViewportBaseColor、setStrandSelectionVisual、setLayerColorShiftsEnabled、outliner 2 处、UI 绑定块、reapplySelectionAfterStateRestore、syncInputs、keydown、boot）。
- C1：26 个外部引用行 / ~17 个宿主（scalpBuilderDeps 批、scalp-builder.js 4 处、snapshotState、restoreLock、addLock、syncMirrorPartnerFromLock、syncLockFromCurve、buildEvenlySpacedProceduralDuplicates、updateDuplicatePlacement、fileApi 批、UI 绑定 8 处、boot）。

### 4.4 净减行估算
- A6：迁出 311 行 - 新模块 import/封装约 26 行 = ~285（plan 估 250，略高因含 2 常量行）。
- C1：迁出 545 行 - 新模块 import/封装约 35 行 = ~510（plan 估 490，基本一致）。
- 两批合计净减 ~795 行；迁移后 app.js 约 20.6k 行。

### 4.5 难度与风险
- A6：低。耦合面集中在 hairMaterialDefinitions 共享数组 与 选区视觉常量/strandViewportBaseColor 反向依赖，其余为 UI/脊柱注入。
- C1：低（rootAttachment 纯数学 + scalpBuilder deps 已就位）；preferences/project 组低-中，风险点是 8 个 store 代理 + 多个 DOM + fileApi/restoreState 时序 + 区间内留守批的交错。
- 回归：node --check 双文件 + verify-smoke（基线 10/11）；迁移后 FUNCTION_INDEX 重跑核对函数计数（app.js -38 函数）。

### 4.6 createProjectSaveApi(deps) 收敛评估：不值得单独做
- 现状：18 个 deps 中，8 个 getter/setter（currentProjectName/quickSaveFileHandle/quickSaveFileName/projectSaveInProgress/lastExport/quickExportFileHandle/quickExportInProgress/pendingFileAction）已收敛到 project-store.js（createProjectStore，L2253 装配），收敛已部分完成。
- 剩余 10 个：importedHeadAsset(存于 head store)、importedScalpGuideAsset(scalpState)、referenceImages/locks(场景活数组)、STRAND_GROUPS(静态配置)、snapshotState(脊柱序列化函数)、strandCurveParameters(B1 未迁几何函数)、curveSurfaceControllerCurves/bonesFor(模块函数)、safelyRememberRecentProject(C1 待迁)。
- 结论：这些本质是 函数 + 活数组 + 跨 store 数据，并入 project-store 会造成重复持有或跨 store 引用环；真正收益只是随 C1 把 safelyRememberRecentProject 换为 ioApi 引用（1 行）。建议维持 getter/setter 注入形态，不做单 store 大收敛；若求整洁，仅把 STRAND_GROUPS 挪入 app-config.js（低风险可选）。

### 4.7 边界存疑点（留给实施者确认）
1. hairMaterialDefinitions 是否改存 store：建议维持 app.js 顶层数组 + deps 传引用（snapshot/restore 脊柱直接引用，改动最小）。
2. 选区常量 7200/7201 归属：建议留 app.js deps 注入（§3.6）。
3. material UI 绑定块（17068-17145，约 78 行）是否随模块搬走：plan 保留 UI 绑定在 app.js，建议留守（需 bindUndoCapture/CSS.escape/syncMultiStrandInputs 等大量脊柱依赖，搬走收益低）。
4. preferences 对话框 UI（open/save/cancelPreferencesDialog 15156-15235）不在 C1 候选（plan 未列）；建议留守，仅迁 4 个纯 IO 函数。
5. C1 候选 22 函数 vs plan 26 函数：差异来自 plan 按 Godel 旧区间毛估（含交错 wiring 与可能计入的对话框函数）；按当前代码精确枚举为 22 函数 / 545 行。
6. index.html 无内联 JS 引用（仅 DOM id），事件全在 app.js addEventListener，迁移后无需改 index.html。
---

## 执行记录 A6+C1（2026-08-12，已实施）

> 由 Codex 在本仓库分支 0.2.59-refactor 上执行，基于本文档 §1-§4 的引用图。app.js 起点 19,206 行（HEAD 937d4c9），终点 **18,401 行**（净减 805 行）。未 commit（按约束）。

### 1. 迁出统计（实际，按 19,206 行状态重定位）

| 批次 | 模块 | 迁出内容 | 行数 | 外部引用行改写 |
|---|---|---|---|---|
| A6 | modules/material/material-ui.js（新建） | 16 函数（hairMaterialDefinition/materialForLock/activeHairMaterialDefinition/strandDisplayColor/setAnimeHairBaseColor/createAnimeAnisotropicMaterial/createHairMaterial/createStrandSelectionOutline/strandUsesDoubleSidedMaterial/applyMaterialDefinitionToLock/refreshMaterialUsers/renderHairMaterialOutliner/renderHairMaterialOptions/syncHairMaterialEditor/createProjectHairMaterial/deleteActiveHairMaterial） | 函数体 308 行（原 L7170-7479，310 行区间中 **2 个常量留守 app.js**） | 55 处（含 drawFlowDeps 批 5 项、addLock 4、restoreLock 4、strandViewportBaseColor 7、UI 绑定块 ~23、setStrandSelectionVisual/syncMirrorPartnerFromLock/rebuildLockGeometry/ensureUvCheckerForLock/setLayerColorShiftsEnabled/reapplySelectionAfterStateRestore/syncInputs/createOutlinerStrandButton/renderLockList/keydown/boot 各 1） |
| C1 | modules/io/io-tail.js（新建） | 22 函数 + 1 常量 ROOT_LOCAL_CURVE_FIELDS（rootAttachment 组 11 + preferences/project/recent 组 11） | 函数体 523 行（模块内含分隔空行 534） | 22 处（scalpBuilderDeps 批 2、proceduralDuplicateDeps 批 1、addLock/syncMirrorPartnerFromLock/snapshotState/restoreLock(2)/syncLockFromCurve(2)/fileApi 批 1、UI 绑定 10） |

- A6 常量处理：STRAND_SELECTION_OUTLINE_COLOR / STRAND_MIRROR_OUTLINE_COLOR **留在 app.js**（L7169-7170，原 L7294-7295），经 materialDeps 注入模块（createStrandSelectionOutline 只用 STRAND_SELECTION_OUTLINE_COLOR，故 materialDeps 只注入这一个；STRAND_MIRROR_OUTLINE_COLOR 仅 app.js setStrandSelectionVisual 使用）。
- draw-flow.js / scalp-builder.js / procedural-duplicate.js / project-files.js 均经各自 deps 引用，**模块文件零改动**（只改 app.js 的批填映射）。

### 2. 接线（app.js）

- 新 import：`createMaterialUiApi`（modules/material/material-ui.js?v=20260812-1）、`createIoTailApi`（modules/io/io-tail.js?v=20260812-1），置于 import 区末尾。
- 早期创建（import 区后）：`const materialDeps = {}; const materialApi = createMaterialUiApi(materialDeps);` + `const ioDeps = {}; const ioApi = createIoTailApi(ioDeps);`。
- **materialDeps 批填**：Object.assign(materialDeps, {...}) 置于 renderLockList 定义后（最晚 deps，原 L14407 → 新 L13584）。deps = hairMaterialDefinitions/animeAnisotropicLightDirection/hairState.state/sel.state/sculptState.state/STRAND_SELECTION_OUTLINE_COLOR + 脊柱（pushUndoState/getSelectedLock/editSelectedLocks/renderLockList/syncActiveMirror/updateStrandSelectionHighlight/updateStrandSelectionHighlightForLock/ensureUvCheckerForLock/strandViewportBaseColor/normalizeHairLayer/drawFlowApi）+ 15 个 DOM。
- **ioDeps 批填**：Object.assign(ioDeps, {...}) 置于 **dataToVector 定义后**（新 L9442，原 L10285）。说明：参考图 §4.2 建议「restoreState 定义后」，但 vectorToData/dataToVector（原 L10279/10283）在 restoreState（原 L9949）之后才定义，若紧贴 restoreState 会 TDZ；故批填点取「dataToVector 之后」= 同时满足 fileApi/restoreState/vectorToData/dataToVector 均已定义。deps = rootAttachment 组（scalpBuilder/layerOffsetForLock/layerRootOffsetFactor/normalizeHairLayer/vectorToData/dataToVector）+ preferences 组（fileApi/documentLocalizer/saveLanguage/languageSelect/braidCreationDefaults/braidToolPresetInput/creationPresets/shapePresets + 8 个 store（projectState 为完整 store，hairState/sel/ui/draw/miscState/guideState/viewportState 为 .state 代理，scalpState/head 为完整 store）+ radialMenuApi/clumpProceduralApi/presetLibraryApi/referenceHeadApi + 脊柱（restoreState/undoHistory/redoHistory/updateHistoryButtons/frameViewportBounds/closeAppMenus/SUPPORTED_REFERENCE_IMAGE_TYPES + 14 个 setXxx）+ 13 个 DOM）。
- boot 调用 `materialApi.syncHairMaterialEditor()`（原 L19143 → 新 L18338）与 UI 绑定块均在批填之后。

### 3. 重接（app.js 内改引）

- drawFlowDeps 5 项 → `materialApi.strandDisplayColor/strandUsesDoubleSidedMaterial/createHairMaterial/materialForLock/setAnimeHairBaseColor`。
- scalpBuilderDeps 2 项 → `ioApi.createRootAttachment/ioApi.syncRootAttachmentMetadata`。
- proceduralDuplicateDeps 1 项 → `ioApi.createRootAttachment`（喂给 procedural-duplicate.js 的 buildEvenlySpacedProceduralDuplicates/updateDuplicatePlacement，模块文件不改）。
- fileApi 批 1 项 → `safelyRememberRecentProject: ioApi.safelyRememberRecentProject`。
- 脊柱触点（函数体留 app.js，仅换名）：snapshotState、restoreLock、addLock、syncMirrorPartnerFromLock、syncLockFromCurve、rebuildLockGeometry、ensureUvCheckerForLock、strandViewportBaseColor、setStrandSelectionVisual、setLayerColorShiftsEnabled、reapplySelectionAfterStateRestore、syncInputs、createOutlinerStrandButton、renderLockList、keydown(Delete)、boot。
- app.js 同时移除不再使用的 import：OBJLoader、polygonOnlyObjSource、cleanFileBaseName、listRecentProjects/rememberRecentProject、validateHairProject（保留 createHairProject）、createPreferencesBackup/normalizePreferencesBackup/preferencesBackupFileName（保留 fileActionFormat 等既有死 import 不动）。

### 4. 踩坑

1. **全局替换破坏 deps 批填简写**：初版用 `\bname\b → materialApi.name` 全局替换，把 drawFlowDeps/scalpBuilderDeps/proceduralDuplicateDeps/fileApi 批里的简写属性 `name,` 变成 `materialApi.name,`（对象字面量非法）。**教训：node --check 对 .js 文件因模块检测不报错，必须以 .mjs 副本权威解析**（`.codex-tmp/app-check.mjs` 立刻抓到）。修复为 `name: materialApi.name,` 显式键值。
2. **全局替换污染 DOM 字符串**：`document.querySelector("#downloadPreferencesAndPresets")` 被替换成 `"#ioApi.downloadPreferencesAndPresets"`（`#` 前字符不是词字符，lookbehind 放行）。逐行扫「引号内含 materialApi./ioApi.」抓出并修复。
3. **ioDeps 批填点**：不能照抄 §4.2「restoreState 定义后」——vectorToData/dataToVector 在 restoreState 之后，批填需在二者之后（取 dataToVector 后），否则模块顶层求值 TDZ。
4. **C1 区间留守批**：presetLibraryDeps 批 + creationPresets（原 L9420-9462）与 fileApi 批（原 L9549-9576）物理交错在 C1 区间内，只搬函数定义块，留守批原样保留；迁移后收缩了留守批上下的空行（12→2、4→2）。
5. **模块生成脚本的换行泄漏**：通过 PowerShell here-string 生成的 .mjs 生成器里，模板字符串行尾是 LF，导致模块 header/tail 混入 bareLF；已用 `\r\n` 归一化（两模块现全 CRLF、无 BOM）。
6. **函数体保真**：material-ui.js / io-tail.js 的函数体与 app.js 原函数体做「替换归一化 diff」：io-tail 逐字节一致；material-ui 仅尾部分隔空行差异（308 函数行全一致）。
7. **常量归属**：按 §3.6/§4.7.2 建议把两个选区描边常量留 app.js 经 deps 注入，避免 app.js 反向 import 新模块视觉常量；STRAND_MIRROR_OUTLINE_COLOR 模块未使用故未注入。
8. **__AHS_TEST_SEAM**：未触碰（L18345，与迁移前逐字节一致）。