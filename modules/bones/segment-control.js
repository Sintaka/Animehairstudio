// segment-control.js - Panel segment control glue (refactor bones B1).
// Extracted from app.js; coupling injected via createXxxApi(deps).
import * as THREE from "three";
import {
  splitBonesFor,
  materializeSplitBones,
  strandSplitBonesFor,
  materializeStrandSplitBones,
  remapSegmentBonesOnInsert,
  remapSegmentBonesOnDelete,
  PANEL_SEGMENT_HOST,
  SPREAD_MAX,
  STRAND_SEGMENT_HOST,
  resolveSegmentSelection,
  segmentBoneHost
} from "./bone-model.js?v=20260901-1";
// 阶段 6：Segment 步进器改走「分组树枚举表」。直接 import 而不是走 deps —— panel-bone-groups.js
// 是零 import 的纯函数模块（文件头已声明），与 tip-sub-bone-host.js 对它的既有引用方式同规格，
// 不需要为此另开一条 deps 通道。
import {
  panelBoneGroupsFor,
  panelBoneGroupAtPath,
  panelTierEnumeration,
  panelBoneGroupNodeLabel
} from "./panel-bone-groups.js?v=20260925-12";

// 新拉链需要的最小段跨度：段太窄就放不下一条不退化的拉链。
const MINIMUM_PANEL_SEGMENT_SPAN = 0.02;

// ── 普通发丝拉链的「插得下吗」判据：本仓库唯一定义点（standards「一条推导规则一个定义点」）──
// 消费方（改这里必须同时看这两处）：
//   - changeStrandSplitCount（本文件）：+ 分支的插入守卫
//   - app.js syncStrandSplitControls：#addStrandSplit 按钮的 disabled 状态
// 曾经只有守卫、没有门控：N=7 时最大段跨度恰好降到 0.2 < 0.24，按钮仍是 enabled，点下去
// 在 pushUndoState 之前就 return —— 看着能点、既不改数据也不留撤销记录的静默 no-op。
// 相邻拉链最小间距；新拉链落在段中点，故段跨度必须 ≥ 2×（左右各留一份）。
const MINIMUM_STRAND_SPLIT_SEPARATION = 0.12;
// 发丝拉链的位置定义域端点：与 createSplitStrandGeometry 的分段边界、normalizeStrandSplits
// 的 position 钳位区间同为 ±0.8。段 = 排序后拉链之间的间隔（N 拉链 → N+1 管）。
const STRAND_SPLIT_BOUND = 0.8;

// 段边界（N+2 项 → N+1 段）。splits 可能未排序：边界必须按 position 升序，否则跨度出负值。
function strandSplitBoundaries(splits) {
  const positions = (Array.isArray(splits) ? splits : [])
    .map((split) => Number(split?.position) || 0)
    .sort((a, b) => a - b);
  return [-STRAND_SPLIT_BOUND, ...positions, STRAND_SPLIT_BOUND];
}

// 最宽段的下标：+ 按钮细分的目标段，也是「插得下吗」的判据对象。
export function largestStrandSegmentIndex(splits) {
  const spans = segmentSpans(strandSplitBoundaries(splits));
  let largest = 0;
  for (let index = 1; index < spans.length; index += 1) {
    if (spans[index] > spans[largest]) largest = index;
  }
  return largest;
}

// 最宽段还能不能容纳一条新拉链（不产生退化段、保持水密）。
export function canFitAnotherStrandSplit(splits) {
  const spans = segmentSpans(strandSplitBoundaries(splits));
  return spans[largestStrandSegmentIndex(splits)] >= MINIMUM_STRAND_SPLIT_SEPARATION * 2;
}

// 0.2.132：此处原有 applyStrandSplitGapToTubes —— 全局 Split Spacing 滑杆的「刷进每一根管」
// 写入器。滑杆与其「segment separate / 整管横向平移」语义已按用户决定整体删除，发尖聚合改由
// 每管 Tip Clump（applyStrandSegmentSpread，见下方）单独表达，故本函数一并删除。
// 勿重新引入「全局刷」：它会覆盖每管创作过的 Tip Clump，而 Tip Clump 现在是逐管创作数据。

// ── 新拉链的 height 继承规则（0.2.124 用户批准的行为变更，不是顺手改的）───────────────
// 旧规则取 `target.strandSplitHeight`，但 syncStrandSplitLegacyFields 会持续把
// strandSplits[0].height 回写到该标量（legacy 标量是 N=1 的真源），于是「把最左侧拉链拖浅」
// 之后每一条新增拉链都继承那个值 —— 与被细分的段毫无关系。panel 侧没这个病：
// panelSplitHeight 从不被数组回写，segment-control 读到的是真正的默认值。
// 新规则：继承**被细分段**的相邻拉链。
//   - 内部段（左右都有拉链）：取两者算术平均。理由与 position 取段中点同源——新拉链落在段
//     正中，深度也居中才不会凭空偏向某一侧；两值都在 [0.02,0.8] 内，平均值必然也在界内。
//   - 边缘段（只有一侧有拉链）：取那一侧（唯一有语义关联的邻居）。
//   - 无邻居（N=0，split 发丝理论上不会出现，仅防御）：回退旧默认 strandSplitHeight ?? 0.3。
export function insertedStrandSplitHeight(target, splits, segmentIndex) {
  // 邻居按 position 升序取：段 i 的左邻是 sorted[i-1]、右邻是 sorted[i]，与
  // strandSplitBoundaries 的边界排列一一对应。
  const sorted = (Array.isArray(splits) ? splits : []).slice().sort((a, b) => (Number(a?.position) || 0) - (Number(b?.position) || 0));
  const left = sorted[segmentIndex - 1];
  const right = sorted[segmentIndex];
  const heights = [left, right]
    .filter((split) => split && Number.isFinite(Number(split.height)))
    .map((split) => Number(split.height));
  if (!heights.length) return Number(target?.strandSplitHeight ?? 0.3);
  return heights.reduce((sum, height) => sum + height, 0) / heights.length;
}

// 把段骨骼数组对齐到给定段数（多余截断、缺失补 null 交由 normalize 派生默认值）。
// splits 被 maxCount 截断时，骨骼数组长度可能与段数不一致，重映射前先对齐。
function fitSegmentBones(bones, count) {
  const list = Array.isArray(bones) ? bones : [];
  return Array.from({ length: Math.max(1, Math.round(count)) }, (_, k) => list[k] ?? null);
}

// 相邻边界之间的段跨度：boundaries 有 N+2 项时得到 N+1 段。
function segmentSpans(boundaries) {
  return boundaries.slice(0, -1).map((value, index) => boundaries[index + 1] - value);
}

// 选中的 zipper 已不存在时清掉选择（order 是稳定身份）。悬空选择会让 Del 穿透到
// deleteCurrentSelection() 误删整根头发，因此增删拉链后必须校验。
function hasOrder(splits, order) {
  return Array.isArray(splits) && splits.some((split) => Number(split.order) === Number(order));
}

// deps: store .state proxies (sculptState/sel) + module instances (taperEditor/shapePresets/
//   branchSweep) + DOM elements (panelSegmentLabel/previousPanelSegmentButton/nextPanelSegmentButton/
//   panelSegmentSpread/panelSegmentSpreadValue/panelShapeInputs/panelShapeValues/panelSplitCountValue/
//   addPanelSplitButton/removePanelSplitButton/segmentTaperPreview/segmentDepthPreview/
//   strandSegmentControls/strandSegmentLabel/previousStrandSegmentButton/nextStrandSegmentButton/
//   strandSegmentSpread/strandSegmentSpreadValue/strandSegmentTaperPreview/strandSegmentDepthPreview/
//   sweepProfileEditor/taperMeshPointsToggleRow/taperCurveEditor) + app.js helper functions
//   (getSelectedLock/isPanelGeometry/pushUndoState/updateDrawStrandPreview/updateLockGeometry/
//   rebuildCurveObjects/syncActiveMirror/updateTopologyStats/updateViewportStatsVisibility/
//   clonePanelSplits/snapPanelSplitHeight) + panelCreationDefaults. document is a browser global.
//   阶段 6 新增两项（panel 步进器走分组树枚举表）：
//   selectedPanelBoneGroupPath —— 读当前选中的分组路径（与 tip-sub-bone-host.js 的
//     `deps.selectedPanelBoneGroupPath` 同一个注入函数，读写两侧同源）；
//   setSelectedPanelBoneGroup(target, path) —— 写入新的分组选择，内部必须调用既有的
//     syncTipSelectionFromBoneGroup（否则 panelSegmentIndex 不会跟着分组选择联动，
//     见 stepSegment 处的大段说明）。
// Batch-fill point in app.js: after the taperEditorDeps batch (all deps defined).
export function createSegmentControlApi(deps) {
function dropDanglingPanelSplitSelection(target, splits) {
  const selection = deps.sculptState.panelSplitSelection;
  if (!selection || selection.lockId !== target?.id) return;
  if (!hasOrder(splits, selection.order)) deps.sculptState.panelSplitSelection = null;
}

function dropDanglingStrandSplitSelection(target, splits) {
  const selection = deps.sculptState.strandSplitSelection;
  if (!selection || selection.lockId !== target?.id) return;
  if (!hasOrder(splits, selection.order)) deps.sculptState.strandSplitSelection = null;
}

// 段数缩小后清掉越界的发尖子骨骼选择（0.2.126，panel 与发丝共用一份）。
// 为什么必须显式清而不能只靠 resolveSegmentSelection 的钳位：那个钳位管的是
// panelSegmentIndex / strandSegmentIndex（"面板当前显示哪一段"），而 tipSelection 是独立
// 状态、不经过它。删掉最后一段/最后一根管后若不清，tipSelection 会指向一个已不存在的段：
// 视口既没有该段的把手（按新段数分配），笔刷的 applySubBoneBrushSample 又会因为
// "有选择"而**消费掉**每一笔（return true），表现为「选中了看不见的东西，主发丝也刷不动」。
// 刻意**不**改成钳到最后一段：删段是用户主动收缩，回退到"未选中"比静默改选目标更可预期
// （与 panelSplitSelection / strandSplitSelection 删除后置 null 的既有语义一致）。
// 调用点（四条增删路径，改这里要看全部）：changePanelSplitCount / deleteSelectedPanelSplit /
// changeStrandSplitCount / deleteSelectedStrandSplit。
function dropDanglingTipSelection(target, segmentCount) {
  const selection = deps.sculptState.tipSelection;
  if (!selection || selection.lockId !== target?.id) return;
  if (!(Number(selection.segmentIndex) < Number(segmentCount))) deps.sculptState.tipSelection = null;
}

// ── 段 UI 的宿主描述子（几何无关的段选择器/spread/曲线预览逻辑只写一遍）──────────
// bone-model 的 *_SEGMENT_HOST 负责「数据侧」推导（段数、骨骼数组、索引键），这里补上
// 「DOM 侧」绑定。container 只有发丝侧有：panel 那组控件由 #strandShapePanel.panel-context
// 的 CSS 整块显隐，发丝侧则要按「已开启分裂」逐块 toggle。
function segmentUi(host) {
  if (host === STRAND_SEGMENT_HOST) {
    return {
      container: deps.strandSegmentControls,
      label: deps.strandSegmentLabel,
      previousButton: deps.previousStrandSegmentButton,
      nextButton: deps.nextStrandSegmentButton,
      // 描述子键名跟随**字段名** tipClump（0.2.132），不跟随控件 id：id `#strandSegmentSpread`
      // 属 dom-contract 冻结面（改它要同步 index.html + 多条断言 + 用户存档无关的 UI 契约），
      // 而键名是本模块内部的东西，让它与 bone.tipClump 一致才不会再把读写指向错的概念。
      tipClumpInput: deps.strandSegmentSpread,
      tipClumpValue: deps.strandSegmentSpreadValue,
      taperPreview: deps.strandSegmentTaperPreview,
      depthPreview: deps.strandSegmentDepthPreview
    };
  }
  return {
    container: null,
    label: deps.panelSegmentLabel,
    previousButton: deps.previousPanelSegmentButton,
    nextButton: deps.nextPanelSegmentButton,
    tipClumpInput: deps.panelSegmentSpread,
    tipClumpValue: deps.panelSegmentSpreadValue,
    taperPreview: deps.segmentTaperPreview,
    depthPreview: deps.segmentDepthPreview
  };
}

// 段选择器 + per-segment Tip Clump + 每段曲线预览的共用同步体。panel 与 strand 只在
// 描述子（host + segmentUi）上不同，逻辑一份。
// panel 宿主且当前选中了某个分组路径时，标签显示该分组的 L 记号（如「L2 · Segments 2-3」），
// 让用户能看出步进器停在了中间层而不是某个具体叶子；否则**逐字保持**原来的 1-based 叶子
// 编号（`String(index + 1)`）——发丝宿主、以及「panel 但没有分组选择/分组树不适用」两种情况
// 都落到这一支，字面行为与改动前一致。
// 不读 resolveSegmentSelection 的 index 语义变化（那个语义没变，见 stepSegment 处的大段说明），
// 只是在它之外叠加一层「如果当前选中的是中间层，标签换个说法」的展示逻辑。
function panelSegmentControlLabel(target, host, index) {
  if (host === PANEL_SEGMENT_HOST) {
    const path = deps.selectedPanelBoneGroupPath?.();
    if (Array.isArray(path) && path.length) {
      const root = panelBoneGroupsFor(target);
      const node = root ? panelBoneGroupAtPath(root, path) : null;
      if (node) return panelBoneGroupNodeLabel(node);
    }
  }
  return String(index + 1);
}

function syncSegmentControls(target, host) {
  // Refresh the width/depth curve preset selects (segment selects included) on every sync,
  // including when no panel target is selected (resets the selects).
  deps.syncShapePresetSelects();
  const ui = segmentUi(host);
  const selection = target ? resolveSegmentSelection(target, deps.sculptState, host) : null;
  const bones = selection ? host.bonesFor(target) : null;
  // 发丝侧：未开启分裂（bonesFor 返回 null）或非发丝目标时整块隐藏，与
  // #strandSplitControls 自身的显隐同源（都只对「已分裂的普通发丝」暴露）。
  ui.container?.classList.toggle("hidden", !bones);
  if (!selection || !bones) return;
  const { index, count } = selection;
  const bone = bones[index] || null;
  if (ui.label) ui.label.textContent = panelSegmentControlLabel(target, host, index);
  if (ui.previousButton) ui.previousButton.disabled = index === 0;
  if (ui.nextButton) ui.nextButton.disabled = index >= count - 1;
  if (ui.tipClumpInput) ui.tipClumpInput.value = String(bone?.tipClump ?? 0);
  if (ui.tipClumpValue) ui.tipClumpValue.textContent = (bone?.tipClump ?? 0).toFixed(2);
  const previewTarget = {
    ...(bone || {}),
    taperCurve: bone?.taperCurve || target.taperCurve,
    depthCurve: bone?.depthCurve || target.depthCurve
  };
  deps.taperEditor.renderTaperPreview(ui.taperPreview, previewTarget, "taperCurve");
  deps.taperEditor.renderTaperPreview(ui.depthPreview, previewTarget, "depthCurve");
  // 浮动面板开着且正在编辑同一 lock 的子发尖曲线时，同步到当前段（热刷新）。
  deps.taperEditor.retargetOpenSegmentTaperEditor?.(target, index);
}

function selectedPanelSegment(lock) {
  const { index, count } = resolveSegmentSelection(lock, deps.sculptState, PANEL_SEGMENT_HOST);
  return { index, count };
}

// 段数 = 拉链数 + 1，经 strandSplitsFor 归一化（与几何同真源）；未开启分裂时返回
// count=1/index=0，调用方靠 bonesFor 为 null 判断「没有段可编」。
function selectedStrandSegment(lock) {
  const { index, count } = resolveSegmentSelection(lock, deps.sculptState, STRAND_SEGMENT_HOST);
  return { index, count };
}

function syncPanelSegmentControls(target = deps.taperEditor.activeStrandShapeTarget()) {
  // panel 的创建默认值没有 geometryType（无法经 segmentBoneHost 分派），但段语义相同，
  // 所以这里恒用 PANEL_SEGMENT_HOST，不走几何分派。
  if (!target) {
    deps.syncShapePresetSelects();
    return;
  }
  syncSegmentControls(target, PANEL_SEGMENT_HOST);
}

function syncStrandSegmentControls(target = deps.taperEditor.activeStrandShapeTarget()) {
  syncSegmentControls(target, STRAND_SEGMENT_HOST);
}

function syncPanelShapeInputs(target = deps.taperEditor.activeStrandShapeTarget()) {
  if (!target) return;
  const splits = deps.clonePanelSplits(target.panelSplits, target.panelSplitHeight);
  if (target.panelSplitSnapToLoops !== false) {
    splits.forEach((split) => { split.height = deps.snapPanelSplitHeight(split.height, target.panelLengthLoops); });
  }
  target.panelSplits = splits;
  target.panelWidthLoops = THREE.MathUtils.clamp(Math.max(
    Math.round(Number(target.panelWidthLoops ?? deps.panelCreationDefaults.panelWidthLoops)),
    splits.length + 1
  ), 3, 24);
  Object.entries(deps.panelShapeInputs).forEach(([key, input]) => {
    if (input.type === "checkbox") input.checked = target[key] !== false;
    else input.value = Number(target[key] ?? deps.panelCreationDefaults[key]);
  });
  Object.entries(deps.panelShapeValues).forEach(([key, output]) => {
    const value = Number(target[key] ?? deps.panelCreationDefaults[key]);
    output.textContent = ["panelLengthLoops", "panelWidthLoops", "panelTipLoops"].includes(key)
      ? String(Math.round(value))
      : value.toFixed(2);
  });
  if (deps.panelSplitCountValue) deps.panelSplitCountValue.textContent = String(splits.length);
  if (deps.removePanelSplitButton) deps.removePanelSplitButton.disabled = splits.length === 0;
  if (deps.addPanelSplitButton) deps.addPanelSplitButton.disabled = splits.length >= Math.min(23, target.panelWidthLoops - 1);
  syncPanelSegmentControls(target);
}

// 打开浮动曲线编辑器，目标 = 当前几何当前段的段骨骼。panel 与发丝共用一份实现：
// 唯一差异是宿主描述子（哪个字段存段骨骼、用哪个索引键、预览 SVG 是哪两个），
// 由 segmentBoneHost 单点分派——铅笔按钮不再按容器 id 分流。
function openSegmentCurveEditor(curveKey = "taperCurve") {
  const selectedLock = deps.getSelectedLock();
  const host = segmentBoneHost(selectedLock);
  if (!host) return;
  const selection = resolveSegmentSelection(selectedLock, deps.sculptState, host);
  const bones = host.materializeBones(selectedLock);
  const bone = bones?.[selection.index];
  if (!bone) return;
  const ui = segmentUi(host);
  // ★ 0.2.180（缺陷③）：选中真中间层时**不要**给叶子播种。
  // 播种本身会在叶子上凭空造出一条曲线；而下面 taperCurveEdit 设好之后，
  // deps.taperEditor.activeTaperTarget() 已经是中间层优先的（0.2.180），真正该拿到曲线的是
  // 分组树节点。这里若照旧先写叶子，就会留下一条用户没创作过的叶子曲线，且因为采样侧
  // 「bone 自己的值优先」，它会把中间层的值盖掉 —— 表现为「铅笔打开的是中间层，但改完没效果」。
  // 判据只认**真**中间层（覆盖 ≥2 个叶子）；叶子节点路径 leafStart===leafEnd 时 span 为 null，
  // 逐字走原来的播种，退化行为不变。
  const tierPath = deps.selectedPanelBoneGroupPath?.();
  const tierNode = (Array.isArray(tierPath) && tierPath.length)
    ? (() => {
      const root = panelBoneGroupsFor(selectedLock);
      const node = root ? panelBoneGroupAtPath(root, tierPath) : null;
      return (node && node.leafStart < node.leafEnd
        && selection.index >= node.leafStart && selection.index <= node.leafEnd) ? node : null;
    })()
    : null;
  if (!tierNode && (!Array.isArray(bone[curveKey]) || !bone[curveKey].length)) {
    bone[curveKey] = deps.shapePresets.cloneShapePresetValue(selectedLock[curveKey]);
  }
  if (deps.sweepProfileEditor.open) deps.branchSweep.closeSweepProfileEditor();
  deps.sculptState.taperCurveEdit = {
    type: "segment",
    id: selectedLock.id,
    segmentIndex: selection.index,
    curveKey,
    side: "primary",
    selectedIndex: 0,
    dragPointerId: null,
    dragDisplayRange: null
  };
  deps.taperEditor.ensureSecondaryTaperCurve(deps.taperEditor.activeTaperTarget(), curveKey);
  document.querySelector("#taperCurveTitle").textContent = curveKey === "depthCurve" ? "Depth Curve" : "Width Curve";
  deps.taperEditor.updateTaperCurveEditorTargetLabel();
  deps.taperEditor.setTaperMeshPointsVisible(false);
  deps.taperMeshPointsToggleRow.classList.add("hidden");
  deps.taperEditor.renderTaperCurveEditor();
  deps.taperEditor.renderTaperPreview(
    curveKey === "depthCurve" ? ui.depthPreview : ui.taperPreview,
    deps.taperEditor.activeTaperTarget(),
    curveKey
  );
  deps.taperCurveEditor.show();
  deps.updateViewportStatsVisibility();
}

// 保留具名入口：panel 侧调用点（视口 alt 点击等）语义不变，只是走同一份实现。
function openPanelSegmentCurveEditor(curveKey = "taperCurve") {
  if (!deps.isPanelGeometry(deps.getSelectedLock())) return;
  openSegmentCurveEditor(curveKey);
}

function openStrandSegmentCurveEditor(curveKey = "taperCurve") {
  const selected = deps.getSelectedLock();
  if (segmentBoneHost(selected) !== STRAND_SEGMENT_HOST) return;
  openSegmentCurveEditor(curveKey);
}

// ── 阶段 6：panel 步进器改走「分组树枚举表」──────────────────────────────────────
//
// ★ 为什么不动 resolveSegmentSelection（也不动它 8 处把 index 当叶子数组下标用的调用点）：
// 前一版方案想把 index 语义从「叶子数组下标」改成「枚举表行号」，已被主脑复核否决——
// taper-editor.js 的 segmentCurveTargetForWrite（**写入路径**）有 `stored.length === count`
// 长度守卫：写入前先判断已物化的骨骼数组长度是否与 count 相等，相等就直接用那个 live 数组，
// 否则才重新 materializeBones。若把 count 改成枚举表长度（4 行 vs 3 个叶子），这个守卫会
// 恒假 ⇒ 每次写入都落到 materializeBones 拿到的叶子数组，再用「行号」去索引它 ⇒ 行号 1
// （L2·Segments 2-3）会被当成叶子数组下标 1（叶子 2）—— 两者在有中间层时数值不同，
// 于是曲线会静默写到错误的叶子上（数据损坏级，且没有任何报错）。除 segmentCurveTargetForWrite
// 外还有 7 处同样把 selection.index 当叶子数组下标消费（activeTaperTarget /
// selectedSegmentIndex / openSegmentCurveEditor 等），逐一改风险远大于收益。
//
// ★ 为什么写 selectedPanelBoneGroup 就够、不需要碰 resolveSegmentSelection：
// syncTipSelectionFromBoneGroup（app.js）的最后一行本来就是
// `if (anchorSegment !== null && host) sculptState.state[host.segmentIndexKey] = anchorSegment`
// —— 也就是说 panelSegmentIndex **本来就是**由「当前选中的分组节点」派生出来的
// （取 node.leafStart 这个叶子下标）。所以步进器只需要在分组树的枚举表上移动一行、把新的
// path 写进 selectedPanelBoneGroup、再调用既有的 syncTipSelectionFromBoneGroup，
// resolveSegmentSelection 依然按老规矩钳位读到的 panelSegmentIndex（叶子口径不变），
// 曲线面板 / 笔刷 / 视口把手 / Width Curve tier 采样这些既有派生链全部自动跟上，不需要
// 逐一改造。
//
// deps.setSelectedPanelBoneGroup 由 app.js 注入，内部写 selectedPanelBoneGroup 后必须调用
// syncTipSelectionFromBoneGroup（见 deps 注入处的注释）——本函数不直接改 selectedPanelBoneGroup
// 这个 app.js 内部变量（跨模块没有引用），只能通过注入的 setter 间接改。
//
// 定位当前行：优先用注入的「当前分组路径」（deps.selectedPanelBoneGroupPath），在枚举表里
// findIndex；找不到就用当前 panelSegmentIndex 反查「叶子下标恰好等于它」的那一行——枚举表里
// 每个叶子下标唯一对应一个 leafStart===leafEnd 的行（叶子划分是不重叠的整数分区，见
// panel-bone-groups.js 文件头规则 1），这就是「包含该叶子的最深叶节点」那一行。
function panelTierEnumerationRows(target) {
  const root = panelBoneGroupsFor(target);
  return panelTierEnumeration(root);
}

function stepPanelTierSegment(delta, target) {
  // selectedPanelBoneGroup 的存储键是 lockId（app.js 的 `{ lockId, path }`），没有稳定 id 的
  // 目标（panelCreationDefaults——draw 工具激活时的创建默认值，从不进 outliner、也从没有
  // 分组选择可寻址）无法参与这套机制 ⇒ 视为「分组树不适用」，回落原来的逐叶步进。
  // 创建默认值的默认 panelSplits 两条 zipper 等高，派生出的分组树本来就是三个平级叶子
  // （没有真中间层），所以回落到逐叶步进不会有任何可观察的行为差异。
  if (target?.id == null) return false;
  const rows = panelTierEnumerationRows(target);
  if (!rows.length) return false; // 分组树不适用（单段 panel 等）⇒ 回落原来的逐叶步进
  const currentPath = deps.selectedPanelBoneGroupPath?.();
  let cur = Array.isArray(currentPath) && currentPath.length
    ? rows.findIndex((row) => row.path.length === currentPath.length && row.path.every((v, i) => v === currentPath[i]))
    : -1;
  if (cur < 0) {
    // 当前没有分组选择（或选择已失效）：用 panelSegmentIndex 反查叶子行作为起点。
    const { index: leafIndex } = resolveSegmentSelection(target, deps.sculptState, PANEL_SEGMENT_HOST);
    cur = rows.findIndex((row) => row.node.leafStart === leafIndex && row.node.leafEnd === leafIndex);
  }
  if (cur < 0) cur = 0; // 反查也失败（不应发生，防御性兜底）：从表头开始。
  const next = THREE.MathUtils.clamp(cur + Math.sign(delta), 0, rows.length - 1);
  deps.setSelectedPanelBoneGroup?.(target, rows[next].path);
  return true;
}

// 段步进：把索引写回 store 后重新同步控件。panel 与发丝只差宿主描述子与「目标 lock
// 怎么取」，逻辑一份（app.js 只负责转发点击）。
// 浮动面板的热刷新由 syncSegmentControls 末尾的 retargetOpenSegmentTaperEditor 负责，
// 这里刻意不再补一次：旧 panel 处理器在 sync 之后又 retarget 一遍，同一次点击把曲线
// 面板渲染两次。retarget 幂等，去掉只是省功，行为不变。
//
// panel 宿主改走 stepPanelTierSegment（枚举表，见上方大段说明）；分组树不适用时
// （panelBoneGroupsFor 派生不出 children，如单段 panel）该函数返回 false，逐字回落到
// 下面的叶子步进——与改动前行为一致。发丝宿主（STRAND_SEGMENT_HOST）分支逐字不变，
// 从不查分组树。
function stepSegment(delta, target, host, syncControls) {
  if (!target) return;
  if (host === PANEL_SEGMENT_HOST && stepPanelTierSegment(delta, target)) {
    syncControls(target);
    return;
  }
  const { index, count } = resolveSegmentSelection(target, deps.sculptState, host);
  const next = THREE.MathUtils.clamp(index + Math.sign(delta), 0, count - 1);
  deps.sculptState[host.segmentIndexKey] = next;
  syncControls(target);
}

function stepPanelSegment(delta) {
  const selected = deps.getSelectedLock();
  // panel 未选中时回退到创建默认值目标（步进对「新建 panel 的默认段」同样生效）。
  const target = deps.isPanelGeometry(selected) ? selected : deps.taperEditor.activeStrandShapeTarget();
  stepSegment(delta, target, PANEL_SEGMENT_HOST, syncPanelSegmentControls);
}

function stepStrandSegment(delta) {
  const selected = deps.getSelectedLock();
  // 只有「已分裂的普通发丝」有管段可切；其余情况这块 UI 本就隐藏，不做无效写入。
  if (segmentBoneHost(selected) !== STRAND_SEGMENT_HOST) return;
  stepSegment(delta, selected, STRAND_SEGMENT_HOST, syncStrandSegmentControls);
}

// per-tube Tip Clump 写入：先 materialize 再创作（standards「物化后再创作」），钳到
// [0, SPREAD_MAX] 与 normalizeSplitBones / normalizeStrandSplitBone 同界（bone-model 单点定义）
// ——超过 1 会让管尖越过自身宽度、产生 crossover。
// 同规则同步点：panel 侧的滑杆处理在 app.js（panelSegmentSpread 的 input 监听），
// 它还要额外维护 draw 预览的 splitBones，故未并入本函数。
// 函数名保留 applyStrandSegmentSpread（未随字段改名）：它是 DOM 控件 #strandSegmentSpread 的
// 处理器名，与该 id 成对；id 属 dom-contract 冻结面，改名要同步动 index.html 与多条断言，
// 而本轮的目标是**字段名与 UI 名一致**，控件 id 不在其中。
function applyStrandSegmentSpread(value) {
  const target = deps.getSelectedLock();
  if (segmentBoneHost(target) !== STRAND_SEGMENT_HOST) return;
  const bones = materializeStrandSplitBones(target);
  if (!bones) return;
  const { index } = resolveSegmentSelection(target, deps.sculptState, STRAND_SEGMENT_HOST);
  const tipClump = THREE.MathUtils.clamp(Number(value) || 0, 0, SPREAD_MAX);
  if (!bones[index]) return;
  bones[index].tipClump = tipClump;
  if (deps.strandSegmentSpreadValue) deps.strandSegmentSpreadValue.textContent = tipClump.toFixed(2);
  // 与 changeStrandSplitCount 的重建序列一致：几何 → 曲线对象（视口手柄依赖新管位置）
  // → 镜像 → 拓扑统计。
  deps.updateLockGeometry(target, { immediate: true });
  deps.rebuildCurveObjects(target);
  deps.syncActiveMirror(target, { deferGeometry: false });
  deps.updateTopologyStats();
}

function changePanelSplitCount(delta) {
  const selected = deps.getSelectedLock();
  const target = deps.isPanelGeometry(selected)
    ? deps.getSelectedLock()
    : deps.sel.activeTool === "panel" ? deps.panelCreationDefaults : null;
  if (!target) return;
  const widthLoops = THREE.MathUtils.clamp(Math.round(Number(target.panelWidthLoops ?? 6)), 3, 24);
  const splits = deps.clonePanelSplits(target.panelSplits, target.panelSplitHeight, widthLoops - 1);
  if (delta > 0 && splits.length >= widthLoops - 1) return;
  if (delta < 0 && !splits.length) return;
  // 段 = 排序后拉链之间的间隔（N 拉链 → N+1 段）；边界与 splitTipForSegment 的段划分一致。
  const boundaries = [-0.88, ...splits.map((split) => split.position), 0.88];
  const spans = segmentSpans(boundaries);
  // 骨骼重映射的输入：按当前段数对齐的有效骨骼（authored 优先，其次注册表，再默认）。
  const previousBones = fitSegmentBones(splitBonesFor(target), splits.length + 1);
  let insertIndex = -1;
  let deleteIndex = -1;
  if (delta > 0) {
    // 优先细分“当前选中的段”（+ 按钮所见即所得）；选中段放不下新拉链时回退到最大间隙段。
    const { index: selectedIndex, count: selectedCount } = selectedPanelSegment(target);
    let largestGapIndex = 0;
    for (let index = 1; index < spans.length; index += 1) {
      if (spans[index] > spans[largestGapIndex]) largestGapIndex = index;
    }
    const selectionUsable = selectedCount === spans.length
      && selectedIndex >= 0
      && selectedIndex < spans.length
      && spans[selectedIndex] >= MINIMUM_PANEL_SEGMENT_SPAN;
    // 方案 B（0.2.148，用户拍板）：+ 也认「当前选中的 zipper」（panelSplitSelection），优先级
    // 高于上面的 panelSegmentIndex 段选中——拖 zipper 手柄（bone-interaction.js
    // beginPanelSplitHandleDrag）只写 panelSplitSelection，从不写 panelSegmentIndex，两套选中
    // 状态本是独立的（0.2.117/0.2.126 设计，sculpt-edit-store.js 注释），点了 zipper 就按 +
    // 却要求「先选中前一个段」才生效，正是这条同步缺口。刻意不去同步 panelSegmentIndex（方案
    // A）：那会带动右侧面板段标签/Prev-Next 可用性/Tip Clump 值/Width-Depth 曲线预览随手一拖
    // 就变，浮动曲线编辑器开着还会热切换到另一段（retargetOpenSegmentTaperEditor）、预设下拉框
    // 写入目标也被带走（segmentCurveTargetForWrite）——用户只是想拖 zipper，不该有这些连带跳变。
    const zipperSelection = deps.sculptState.panelSplitSelection;
    let zipperIndex = -1;
    if (zipperSelection && zipperSelection.lockId === target?.id) {
      // 按 order 反查下标（62fbd31 的写法，跟 dropDanglingPanelSplitSelection 同源）：splits
      // 已按 position 升序，选中的 zipper j 落在 boundaries[j+1]，其右侧是段 j+1。插在右侧
      // （k+1 而非 k）：与「点了这个 zipper 再按 + 期望紧接着多一条」的直觉一致——新拉链出现在
      // 其后，重复点同一颗 zipper 连按 + 会朝同一方向连续细分。若选 k（插左侧）则新拉链会出现
      // 在被点 zipper 之前，效果是对称但方向相反，同样合法，只是与「往后加」的手感不一致。
      const zipperOrderIndex = splits.findIndex((split) => Number(split.order) === Number(zipperSelection.order));
      if (zipperOrderIndex >= 0) zipperIndex = zipperOrderIndex + 1;
    }
    const zipperUsable = zipperIndex >= 0 && zipperIndex < spans.length && spans[zipperIndex] >= MINIMUM_PANEL_SEGMENT_SPAN;
    // 陈旧/不匹配的 panelSplitSelection（lockId 不符、order 查不到、段放不下）静默回落到原有
    // 「选中段 → 最大间隙段」两级链，不抛错、不改变原有回落路径的逐位行为。
    insertIndex = zipperUsable ? zipperIndex : (selectionUsable ? selectedIndex : largestGapIndex);
    // 选中段与回退段都放不下最小跨度时放弃（与既有守卫同义：不产生退化段）。
    if (!(spans[insertIndex] >= MINIMUM_PANEL_SEGMENT_SPAN)) return;
  } else {
    // 删除 order 最大者（最近创建的），而非数组末尾（位置最右者）
    let maxIndex = 0;
    for (let index = 1; index < splits.length; index += 1) {
      if ((Number(splits[index].order) || 0) > (Number(splits[maxIndex].order) || 0)) maxIndex = index;
    }
    deleteIndex = maxIndex;
  }
  if (deps.isPanelGeometry(target)) deps.pushUndoState();
  if (delta > 0) {
    const position = (boundaries[insertIndex] + boundaries[insertIndex + 1]) * 0.5;
    // 分配创建序号：取当前最大 order + 1，保证单调递增、不复用
    const nextOrder = splits.length ? Math.max(...splits.map((s) => Number(s.order) || 0)) + 1 : 0;
    splits.push({ position, height: Number(target.panelSplitHeight ?? 0.28), order: nextOrder });
    splits.sort((a, b) => a.position - b.position);
    // 被细分的段一分为二：两半都继承来源段姿态，其后段整体后移（修正骨骼错位）。
    target.splitBones = remapSegmentBonesOnInsert(previousBones, insertIndex);
  } else {
    splits.splice(deleteIndex, 1);
    // 两段合并为一段：保留跨度更大的那段姿态（最接近合并后的几何），其后段整体前移。
    target.splitBones = remapSegmentBonesOnDelete(previousBones, deleteIndex, { spans });
  }
  target.panelSplits = splits;
  // ★ 0.2.173：分组树的 span 也要跟着重映射，否则 leafCount 变了之后
  // normalizePanelBoneGroups 会整棵拒绝这棵树 ⇒ 全部中间层创作值蒸发（实测 2 → 0）。
  // 必须在 target.panelSplits 已经是新值**之后**调（重建按新 splits 派生），而
  // prevLeafCount 取的是改动**之前**的段数。缺这个 dep 时静默跳过，行为与接线前逐位一致。
  deps.onPanelSplitCountChanged?.(target, {
    kind: delta > 0 ? "insert" : "delete",
    index: delta > 0 ? insertIndex : deleteIndex,
    prevLeafCount: previousBones.length
  });
  // 双写 lock.splitBones + lock.bones（kind="split"）；此时长度已与新段数一致，重映射不被覆盖。
  materializeSplitBones(target);
  // 选中的 zipper 可能刚被 - 删掉：清掉悬空选择，否则下次按 Del 会因 order 找不到而
  // 穿透到 deleteCurrentSelection() 直接删掉整根头发。
  dropDanglingPanelSplitSelection(target, splits);
  // 段数 = zipper 数 + 1（与 PANEL_SEGMENT_HOST.segmentCount 同规则；此处 splits 已是最终值）。
  dropDanglingTipSelection(target, splits.length + 1);
  if (deps.sculptState.drawStrandStroke?.outputType === "panel" && target === deps.panelCreationDefaults) {
    deps.sculptState.drawStrandStroke.panelSplits = deps.clonePanelSplits(splits, target.panelSplitHeight, widthLoops - 1);
    deps.updateDrawStrandPreview();
  }
  if (deps.isPanelGeometry(target)) {
    deps.updateLockGeometry(target, { immediate: true });
    deps.rebuildCurveObjects(target);
    deps.syncActiveMirror(target, { refreshUi: true });
    deps.updateTopologyStats();
  }
  syncPanelShapeInputs(target);
}

// 删除当前被选中的 zipper（按 order 匹配），沿用与 changePanelSplitCount 相同的重建路径。
// 返回 true 表示确实删除并重建；false 表示无可删除项。
function deleteSelectedPanelSplit() {
  const selection = deps.sculptState.panelSplitSelection;
  if (!selection) return false;
  const target = deps.getSelectedLock();
  if (!deps.isPanelGeometry(target) || target.id !== selection.lockId) return false;
  const widthLoops = THREE.MathUtils.clamp(Math.round(Number(target.panelWidthLoops ?? 6)), 3, 24);
  const splits = deps.clonePanelSplits(target.panelSplits, target.panelSplitHeight, widthLoops - 1);
  const index = splits.findIndex((split) => Number(split.order) === Number(selection.order));
  if (index < 0) return false;
  deps.pushUndoState();
  // 与 changePanelSplitCount 的删除分支同构：先按段身份重映射骨骼，再改 splits。
  const boundaries = [-0.88, ...splits.map((split) => split.position), 0.88];
  const spans = segmentSpans(boundaries);
  const previousBones = fitSegmentBones(splitBonesFor(target), splits.length + 1);
  splits.splice(index, 1);
  // 两段合并为一段：保留跨度更大的那段姿态（最接近合并后的几何），其后段整体前移。
  target.splitBones = remapSegmentBonesOnDelete(previousBones, index, { spans });
  target.panelSplits = splits;
  // ★ 0.2.173：与 changePanelSplitCount 的删除分支同构（见那边的说明）。
  deps.onPanelSplitCountChanged?.(target, {
    kind: "delete",
    index,
    prevLeafCount: previousBones.length
  });
  materializeSplitBones(target);
  deps.sculptState.panelSplitSelection = null;
  dropDanglingTipSelection(target, splits.length + 1);
  deps.updateLockGeometry(target, { immediate: true });
  deps.rebuildCurveObjects(target);
  deps.syncActiveMirror(target, { refreshUi: true });
  deps.updateTopologyStats();
  syncPanelShapeInputs(target);
  return true;
}

// ── 普通发丝多拉链（strand）：mirror 面板的 +/- 与 Del 删除逻辑 ───────────────
// target = 选中的分裂发丝 lock，或 draw 工具激活时的 strandCreationDefaults。
function strandSplitTarget() {
  const selected = deps.getSelectedLock();
  if (selected?.geometryType === "strand" && selected.strandSplitEnabled) return selected;
  // draw 工具画普通发丝且默认开启分裂时，作用于创建默认值
  if (deps.sel.activeTool === "draw"
    && deps.strandCreationDefaults?.strandSplitEnabled
    && deps.sculptState.drawStrandStroke?.outputType !== "panel") {
    return deps.strandCreationDefaults;
  }
  return null;
}

function isStrandLock(target) {
  return target?.geometryType === "strand";
}

function changeStrandSplitCount(delta) {
  const target = strandSplitTarget();
  if (!target) return;
  const splits = deps.cloneStrandSplits(target.strandSplits, target.strandSplitPosition, target.strandSplitHeight, deps.STRAND_SPLIT_MAX);
  if (delta > 0 && splits.length >= deps.STRAND_SPLIT_MAX) return;
  // 分裂发丝至少保留 1 个拉链（>=2 管）；归零请用 Split Geometry 开关。
  if (delta < 0 && splits.length <= 1) return;
  // 段边界/最宽段/「插得下吗」全部取自模块顶部的单一定义点，app.js 的按钮门控消费同一组
  // 函数——过去两边各算一遍，边界值漂移就会出现「能点但不生效」。
  const boundaries = strandSplitBoundaries(splits);
  const spans = segmentSpans(boundaries);
  // 骨骼重映射的输入：按当前管数对齐的有效骨骼（authored 优先，其次派生默认）。
  const previousBones = fitSegmentBones(strandSplitBonesFor(target), splits.length + 1);
  const largestGapIndex = largestStrandSegmentIndex(splits);
  // 间隙不足以容纳一个最小间距的新拉链时放弃（保持水密、不产生退化段）。
  if (delta > 0 && !canFitAnotherStrandSplit(splits)) return;
  let deleteIndex = 0;
  if (delta < 0) {
    // 删除 order 最大者（最近创建的），mirror 面板行为。
    for (let index = 1; index < splits.length; index += 1) {
      if ((Number(splits[index].order) || 0) > (Number(splits[deleteIndex].order) || 0)) deleteIndex = index;
    }
  }
  if (isStrandLock(target)) deps.pushUndoState();
  if (delta > 0) {
    // 在最大间隙插入，position 落在间隙中点；order 取当前最大 +1（单调、不复用）。
    const position = (boundaries[largestGapIndex] + boundaries[largestGapIndex + 1]) * 0.5;
    const nextOrder = splits.length ? Math.max(...splits.map((s) => Number(s.order) || 0)) + 1 : 0;
    splits.push({ position, height: insertedStrandSplitHeight(target, splits, largestGapIndex), order: nextOrder });
    splits.sort((a, b) => a.position - b.position);
    // 被细分的管一分为二：两半都继承来源管姿态，其后管整体后移（修正骨骼错位）。
    target.strandSplitBones = remapSegmentBonesOnInsert(previousBones, largestGapIndex);
  } else {
    splits.splice(deleteIndex, 1);
    // 两管合并为一管：保留跨度更大的那管姿态（最接近合并后的几何），其后管整体前移。
    target.strandSplitBones = remapSegmentBonesOnDelete(previousBones, deleteIndex, { spans });
  }
  target.strandSplits = splits;
  deps.syncStrandSplitLegacyFields(target);
  // 双写持久字段：此时长度已与新管数一致，重映射不被覆盖。
  materializeStrandSplitBones(target);
  dropDanglingStrandSplitSelection(target, splits);
  // 管数 = 拉链数 + 1（与 STRAND_SEGMENT_HOST.segmentCount 同规则；splits 已是最终值）。
  dropDanglingTipSelection(target, splits.length + 1);
  if (deps.sculptState.drawStrandStroke?.outputType === "strand" && target === deps.strandCreationDefaults) {
    deps.sculptState.drawStrandStroke.strandSplits = splits.map((s) => ({ ...s }));
    deps.sculptState.drawStrandStroke.strandSplitPosition = target.strandSplitPosition;
    deps.sculptState.drawStrandStroke.strandSplitHeight = target.strandSplitHeight;
    deps.updateDrawStrandPreview();
  }
  if (isStrandLock(target)) {
    deps.updateLockGeometry(target, { immediate: true });
    deps.rebuildCurveObjects(target);
    deps.syncActiveMirror(target, { refreshUi: true });
    deps.updateTopologyStats();
  }
  deps.syncStrandSplitInputs(target);
}

// 删除当前被选中的 strand zipper（按 order 匹配），沿用与 changeStrandSplitCount 相同的重建路径。
// 分裂发丝至少保留 1 个拉链：删到只剩 1 时拒绝（返回 false）。
// 刻意不套 insertedStrandSplitHeight：删除只移除条目、从不新建拉链，没有「该继承谁」的问题；
// 存活拉链各自保留自己的 height（合并段的姿态由 remapSegmentBonesOnDelete 处理）。
// 同理 draw 预览路径（下方 drawStrandStroke.strandSplits = splits.map(...)）只是把已经算好的
// 数组复制给预览，height 来源仍是本函数与 changeStrandSplitCount，无需第二份规则。
function deleteSelectedStrandSplit() {
  const selection = deps.sculptState.strandSplitSelection;
  if (!selection) return false;
  const target = deps.getSelectedLock();
  if (!isStrandLock(target) || !target.strandSplitEnabled || target.id !== selection.lockId) return false;
  const splits = deps.cloneStrandSplits(target.strandSplits, target.strandSplitPosition, target.strandSplitHeight, deps.STRAND_SPLIT_MAX);
  if (splits.length <= 1) return false;
  const index = splits.findIndex((split) => Number(split.order) === Number(selection.order));
  if (index < 0) return false;
  deps.pushUndoState();
  // 与 changeStrandSplitCount 的删除分支同构：先按段身份重映射骨骼，再改 splits。
  const boundaries = [-0.8, ...splits.map((split) => split.position), 0.8];
  const spans = segmentSpans(boundaries);
  const previousBones = fitSegmentBones(strandSplitBonesFor(target), splits.length + 1);
  splits.splice(index, 1);
  // 两管合并为一管：保留跨度更大的那管姿态（最接近合并后的几何），其后管整体前移。
  target.strandSplitBones = remapSegmentBonesOnDelete(previousBones, index, { spans });
  target.strandSplits = splits;
  deps.syncStrandSplitLegacyFields(target);
  materializeStrandSplitBones(target);
  deps.sculptState.strandSplitSelection = null;
  dropDanglingTipSelection(target, splits.length + 1);
  deps.updateLockGeometry(target, { immediate: true });
  deps.rebuildCurveObjects(target);
  deps.syncActiveMirror(target, { refreshUi: true });
  deps.updateTopologyStats();
  deps.syncStrandSplitInputs(target);
  return true;
}

// 按几何把「段控件同步」分派到对应实现。段曲线预设写入后（shape-presets）需要刷新
// 当前几何那一块控件，这里是唯一分派点。
function syncSegmentControlsForLock(lock) {
  const host = segmentBoneHost(lock);
  if (host === STRAND_SEGMENT_HOST) syncStrandSegmentControls(lock);
  else if (host === PANEL_SEGMENT_HOST) syncPanelSegmentControls(lock);
}

  return {
    selectedPanelSegment,
    selectedStrandSegment,
    syncPanelSegmentControls,
    syncStrandSegmentControls,
    syncSegmentControlsForLock,
    syncPanelShapeInputs,
    openSegmentCurveEditor,
    openPanelSegmentCurveEditor,
    openStrandSegmentCurveEditor,
    stepPanelSegment,
    stepStrandSegment,
    applyStrandSegmentSpread,
    changePanelSplitCount,
    deleteSelectedPanelSplit,
    changeStrandSplitCount,
    deleteSelectedStrandSplit,
  };
}
