// radial-menu.js - strand/tool radial menu UI + gesture business layer (refactor batch A2).
// Extracted from app.js; all app.js coupling injected via createRadialMenuApi(deps).
import {
  layoutRadialOptions,
  partitionRadialOptions,
  radialButtonEntryDistance,
  radialListCorridorContains,
  radialButtonRayExtent,
  radialMenuDimensions
} from "./radial-layout.js?v=20260806-14";
import { mirrorSelectionTargets } from "../edit/mirror-selection.js?v=20260805-1";

const MAX_RADIAL_OPTIONS = 8;
const MAX_RADIAL_SUBMENU_OPTIONS = 5;
const STANDARD_RADIAL_FRAME_DIMENSIONS = radialMenuDimensions(MAX_RADIAL_OPTIONS, {
  buttonWidth: 138,
  buttonHeight: 42,
  gap: 8
});

export function createRadialMenuApi(deps) {
  // deps: store .state proxies (hairState/miscState/sculptState/sel/ui; use deps.X.y, never
  // deps.X.state.y), radial DOM elements (strandRadialMenu family/toolRadialMenu family/
  //   radialMenusPreferenceInput/radialShortcutRows/drawSurfaceDynamicButton),
  // shared data (locks/selectionSets/lastPointer), module apis (drawFlowApi/presetLibraryApi/
  //   guideApi/referenceHeadApi), app.js spine + action-dispatch functions (setActiveTool/
  //   updateInteractionLocks/setViewportEditMode/setViewportSelectionMode/hideOutlinerContextMenu/
  //   selection/outliner/duplicate helpers), preference const RADIAL_MENUS_PREFERENCE_KEY.
  // Batch-fill point in app.js: after the referenceHeadApi block (all const/let deps defined)
  // and before the bootstrap init (setRadialMenusEnabled); see
  // devlog/in-progress/radial-menu-refactor-map.md.

function hideStrandRadialMenu() {
  deps.hairState.strandRadialTargetId = null;
  deps.hairState.strandRadialGesture = null;
  deps.strandRadialMenu.classList.add("hidden");
  deps.hairState.strandRadialActions.forEach((button) => button.classList.remove("selected"));
  deps.strandRadialActionList.replaceChildren();
  deps.strandRadialActionList.classList.add("hidden");
  deps.strandRadialLine.style.width = "0px";
  deps.strandRadialLine.style.opacity = "0";
}

function ensureRadialButtonCapacity(menu, buttons, count, attributeName, insertBefore) {
  while (buttons.length < count) {
    const button = document.createElement("button");
    button.className = "hidden";
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.dataset[attributeName] = "";
    menu.insertBefore(button, insertBefore);
    buttons.push(button);
  }
  return buttons;
}

function radialButtonDimensions(kind, option = null) {
  if (option?.action === "back-to-main") return { width: 54, height: 54 };
  const usesWideButtons = ["selection", "clump"].includes(kind);
  return {
    width: usesWideButtons ? 138 : 104,
    height: kind === "selection" ? 42 : 40
  };
}

function radialMenuDimensionsForKind(kind, optionCount) {
  const buttonDimensions = radialButtonDimensions(kind);
  return radialMenuDimensions(optionCount, {
    buttonWidth: buttonDimensions.width,
    buttonHeight: buttonDimensions.height,
    gap: ["selection", "clump"].includes(kind) ? 8 : 18
  });
}


function applyRadialMenuDimensions(menu, optionCount, fixedDimensions = null) {
  const dimensions = radialMenuDimensionsForKind(menu.dataset.radialKind, optionCount);
  menu.style.setProperty("--radial-size", `${fixedDimensions?.size || dimensions.size}px`);
  menu.style.setProperty("--radial-radius", `${fixedDimensions?.radius || dimensions.radius}px`);
}

function strandRadialSubmenuEntryDistance(option) {
  const radius = Number.parseFloat(
    deps.strandRadialMenu.style.getPropertyValue("--radial-radius")
  ) || 82;
  const buttonDimensions = radialButtonDimensions(deps.strandRadialMenu.dataset.radialKind, option);
  return radialButtonEntryDistance(option.angle, {
    radius,
    radiusOffset: option.radiusOffset || 0,
    buttonWidth: buttonDimensions.width,
    buttonHeight: buttonDimensions.height
  });
}

function configureRadialSubmenuIndicator(button, option, kind) {
  const hasSubmenu = Boolean(option?.submenu);
  button.classList.toggle("has-submenu", hasSubmenu);
  if (!hasSubmenu) {
    button.removeAttribute("aria-haspopup");
    button.style.setProperty("--submenu-arrow-x", "0px");
    button.style.setProperty("--submenu-arrow-y", "0px");
    button.style.setProperty("--submenu-arrow-angle", "0rad");
    return;
  }
  const buttonDimensions = radialButtonDimensions(kind, option);
  const arrowDistance = radialButtonRayExtent(option.angle, {
    buttonWidth: buttonDimensions.width,
    buttonHeight: buttonDimensions.height
  }) + 10;
  button.setAttribute("aria-haspopup", "menu");
  button.style.setProperty("--submenu-arrow-x", `${Math.cos(option.angle) * arrowDistance}px`);
  button.style.setProperty("--submenu-arrow-y", `${Math.sin(option.angle) * arrowDistance}px`);
  button.style.setProperty("--submenu-arrow-angle", `${option.angle}rad`);
}

function selectionSetMembershipRadialOptions() {
  return [
    {
      action: "open-add-selection-set-submenu",
      label: "Add to Selection Set",
      submenu: "selection-set-add-submenu",
      enabled: deps.selectionSets.some((selectionSet) => deps.selectionSetCanEditFromSelection(selectionSet, "add"))
    },
    {
      action: "open-remove-selection-set-submenu",
      label: "Remove from Selection Set",
      submenu: "selection-set-remove-submenu",
      enabled: deps.selectionSets.some((selectionSet) => deps.selectionSetCanEditFromSelection(selectionSet, "remove"))
    }
  ];
}

function selectionSetRadialMenuOption() {
  return {
    action: "open-selection-sets-submenu",
    label: "Selection Sets",
    submenu: "selection-set-actions-submenu",
    enabled: deps.selectedLocksInOrder().length >= 2 || deps.selectionSets.length > 0
  };
}

function selectedMirrorRadialOptions() {
  const selectedLocks = deps.selectedLocksInOrder();
  const { mirrorable, decouple } = mirrorSelectionTargets(selectedLocks, deps.mirrorPartnerFor);
  const options = [];
  if (mirrorable.length) {
    options.push({
      action: "mirror-selected-strands",
      label: selectedLocks.length === 1 ? "Mirror Strand" : "Mirror Strands"
    });
  }
  if (decouple.length) {
    options.push({
      action: "decouple-selected-mirrors",
      label: decouple.length === 1
        ? "Decouple Mirror Instance"
        : `Decouple ${decouple.length} Mirror Instances`,
      list: true
    });
  }
  return options;
}

function strandVisibilityRadialOptions({
  includeHideSelected = true,
  unhideAsList = true
} = {}) {
  const options = [];
  if (includeHideSelected && deps.selectedLocksInOrder().some((lock) => lock.outlinerVisible !== false)) {
    options.push({ action: "hide-selected-strands", label: "Hide Selected" });
  }
  if (deps.hiddenStrandsExist()) {
    options.push({
      action: "unhide-hidden-strands",
      label: "Unhide Hidden",
      ...(unhideAsList ? { list: true } : {})
    });
  }
  return options;
}

function clumpMirrorRadialOptions(guide) {
  if (!guide?.clumpGuide) return [];
  return deps.mirroredClumpPartners(guide).length
    ? [{ action: "decouple-mirrored-clump", label: "Decouple Mirrored Clump", list: true }]
    : [{ action: "mirror-clump", label: "Mirror Clump" }];
}

function contextualRadialOptions(kind) {
  if (kind === "root") {
    const options = [
      { action: "open-workspace-submenu", label: "Workspace", submenu: "workspace-submenu" },
      { action: "open-live-surface-submenu", label: "Live Surface", submenu: "live-surface-submenu" },
      { action: "open-edit-mode-submenu", label: "Edit Mode", submenu: "edit-mode-submenu" }
    ];
    if (deps.lockedStrandsExist()) options.push({ action: "unlock-all-strands", label: "Unlock All Strands", list: true });
    options.push(...strandVisibilityRadialOptions({
      includeHideSelected: false,
      unhideAsList: false
    }));
    return options;
  }
  if (kind === "workspace-submenu") {
    return [
      { action: "back-to-main", label: "Back", submenu: "root" },
      { action: "workspace-strand", label: "Strands" },
      { action: "workspace-guide", label: "Guides" },
      { action: "workspace-reference", label: "References" }
    ];
  }
  if (kind === "live-surface-submenu") {
    deps.drawFlowApi.refreshLiveSurfaceOptions();
    return [
      { action: "back-to-main", label: "Back", submenu: "root" },
      ...[...deps.drawFlowApi.activeStrokeSurfaceInput().options]
        .filter((option) => !option.disabled)
        .map((option) => ({
          action: `select-live-surface:${option.value}`,
          label: option.textContent.trim(),
          list: option.dataset.userCreatedLiveSurface === "true"
        })),
      {
        action: "toggle-dynamic-surface",
        label: deps.drawFlowApi.drawSurfaceDynamicEnabled() ? "Disable Dynamic" : "Enable Dynamic"
      }
    ];
  }
  if (kind === "edit-mode-submenu") {
    return [
      { action: "back-to-main", label: "Back", submenu: "root" },
      {
        action: "edit-mode-component",
        label: "Component",
        enabled: deps.sculptState.viewportEditMode !== "reference"
      },
      { action: "edit-mode-object", label: "Object" }
    ];
  }
  if (kind === "selection-set-add-submenu" || kind === "selection-set-remove-submenu") {
    const mode = kind === "selection-set-remove-submenu" ? "remove" : "add";
    return [
      { action: "back-to-main", label: "Back", submenu: "selection" },
      ...deps.selectionSets.map((selectionSet) => ({
        action: `${mode}-selection-to-set:${selectionSet.id}`,
        label: selectionSet.name,
        enabled: deps.selectionSetCanEditFromSelection(selectionSet, mode)
      }))
    ];
  }
  if (kind === "selection-set-actions-submenu") {
    return [
      { action: "back-to-main", label: "Back", submenu: "selection" },
      {
        action: "create-selection-set",
        label: "Create Selection Set",
        enabled: deps.selectedLocksInOrder().length >= 2
      },
      ...selectionSetMembershipRadialOptions()
    ];
  }
  if (kind === "locking-submenu") {
    return [
      { action: "back-to-main", label: "Back", submenu: "selection" },
      {
        action: "lock-selected-strands",
        label: "Lock Selected Strands",
        enabled: deps.selectedLocksInOrder().some((lock) => !lock.locked)
      },
      {
        action: "unlock-all-strands",
        label: "Unlock All Strands",
        enabled: deps.lockedStrandsExist()
      }
    ];
  }
  if (kind === "clump") {
    const guide = deps.sel.clumpViewportSelection ? deps.clumpGuideForLock(deps.getSelectedLock()) : null;
    return [
      ...clumpMirrorRadialOptions(guide),
      { action: "create-clump-preset", label: "Create Brush Preset", list: true },
      selectionSetRadialMenuOption(),
      { action: "open-locking-submenu", label: "Locking", submenu: "locking-submenu" },
      { action: "toggle-isolate-selection", label: deps.strandIsolationActive() ? "Exit Isolate" : "Isolate Selected" },
      ...strandVisibilityRadialOptions(),
      { action: "dissolve-clump", label: "Dissolve clump", list: true },
      { action: "delete-clump", label: "Delete clump", list: true }
    ];
  }
  if (kind === "selection") {
    return [
      ...selectedMirrorRadialOptions(),
      {
        action: "create-clump",
        label: "Create Clump from Selection",
        enabled: deps.selectionCanBecomeClump()
      },
      selectionSetRadialMenuOption(),
      { action: "open-locking-submenu", label: "Locking", submenu: "locking-submenu" },
      ...(deps.selectedLocksInOrder().length === 2 && deps.selectedProceduralDuplicateSources().length === 2
        ? [{ action: "duplicate-procedural", label: "Duplicate Procedural" }]
        : []),
      { action: "toggle-isolate-selection", label: deps.strandIsolationActive() ? "Exit Isolate" : "Isolate Selected" },
      ...strandVisibilityRadialOptions(),
      { action: "delete-selection", label: "Delete Strands", enabled: true }
    ];
  }
  return [
    ...selectedMirrorRadialOptions(),
    { action: "duplicate", label: "Duplicate strand" },
    selectionSetRadialMenuOption(),
    { action: "open-locking-submenu", label: "Locking", submenu: "locking-submenu" },
    { action: "toggle-isolate-selection", label: deps.strandIsolationActive() ? "Exit Isolate" : "Isolate Selected" },
    ...strandVisibilityRadialOptions(),
    { action: "delete", label: "Delete strand" }
  ];
}

function sharedRadialFrameDimensions() {
  return { ...STANDARD_RADIAL_FRAME_DIMENSIONS };
}

function layoutContextualRadialOptions(kind, {
  options = contextualRadialOptions(kind),
  backAngle = Math.PI * 0.5,
  backRadiusOffset = null
} = {}) {
  const partitioned = partitionRadialOptions(
    options,
    MAX_RADIAL_OPTIONS,
    MAX_RADIAL_SUBMENU_OPTIONS
  );
  const laidOutOptions = layoutRadialOptions(partitioned.radialOptions, {
    ...(kind.endsWith("-submenu") ? {
      anchorAction: "back-to-main",
      anchorAngle: backAngle
    } : {}),
    reserveBottomForList: true
  });
  if (Number.isFinite(backRadiusOffset)) {
    const backOption = laidOutOptions.find(({ action }) => action === "back-to-main");
    if (backOption) backOption.radiusOffset = backRadiusOffset;
  }
  return { radialOptions: laidOutOptions, listOptions: partitioned.listOptions };
}

function renderRadialActionList(container, options = []) {
  container.replaceChildren();
  container.classList.toggle("hidden", options.length === 0);
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.dataset.radialListAction = option.action;
    button.textContent = option.label;
    button.disabled = option.enabled === false;
    button.classList.toggle(
      "danger",
      option.action === "delete" || option.action === "delete-selection" || option.action === "delete-clump"
    );
    container.appendChild(button);
  });
}

function radialListOptionAtPointer(container, options, event) {
  const containerBounds = container.getBoundingClientRect();
  if (
    event.clientX < containerBounds.left
    || event.clientX > containerBounds.right
    || event.clientY < containerBounds.top
    || event.clientY > containerBounds.bottom
  ) return null;
  const buttons = [...container.querySelectorAll("[data-radial-list-action]")];
  const button = buttons.find((candidate) => {
    if (candidate.disabled) return false;
    const bounds = candidate.getBoundingClientRect();
    return event.clientX >= bounds.left
      && event.clientX <= bounds.right
      && event.clientY >= bounds.top
      && event.clientY <= bounds.bottom;
  });
  return button
    ? options.find((option) => option.action === button.dataset.radialListAction) || null
    : null;
}

function syncRadialListHighlight(container, action) {
  container.querySelectorAll("[data-radial-list-action]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.radialListAction === action);
  });
}

function configureContextualRadialMenu(kind, options, listOptions = []) {
  const menuLabel = kind === "root"
    ? "Main radial menu"
    : kind === "workspace-submenu" ? "Workspace"
    : kind === "live-surface-submenu" ? "Live Surface"
    : kind === "edit-mode-submenu" ? "Edit Mode"
    : kind === "selection-set-actions-submenu" ? "Selection Sets"
    : kind === "selection-set-add-submenu" ? "Add to Selection Set"
    : kind === "selection-set-remove-submenu" ? "Remove from Selection Set"
    : kind === "locking-submenu" ? "Strand Locking"
    : kind === "clump" ? "Clump actions"
    : kind === "selection" ? "Selection actions"
    : "Strand actions";
  deps.strandRadialMenu.dataset.radialKind = kind;
  deps.strandRadialMenu.setAttribute("aria-label", menuLabel);
  deps.strandRadialCenter.textContent = kind === "root"
    ? "Menu"
    : kind === "workspace-submenu" ? "Workspace"
    : kind === "live-surface-submenu" ? "Live Surface"
    : kind === "edit-mode-submenu" ? "Edit Mode"
    : kind === "selection-set-actions-submenu" ? "Sets"
    : kind === "selection-set-add-submenu" ? "Add to Set"
    : kind === "selection-set-remove-submenu" ? "Remove from Set"
    : kind === "locking-submenu" ? "Locking"
    : kind === "clump" ? "Clump"
    : kind === "selection" ? "Selection"
    : "Strand";
  deps.hairState.strandRadialActions = ensureRadialButtonCapacity(
    deps.strandRadialMenu,
    deps.hairState.strandRadialActions,
    options.length,
    "strandRadialAction",
    deps.strandRadialLine
  );
  renderRadialActionList(deps.strandRadialActionList, listOptions);
  applyRadialMenuDimensions(deps.strandRadialMenu, options.length, deps.hairState.strandRadialGesture?.frameDimensions);
  deps.hairState.strandRadialActions.forEach((button, index) => {
    const option = options[index];
    button.classList.toggle("hidden", !option);
    button.disabled = !option || option.enabled === false;
    button.classList.toggle("radial-back", option?.action === "back-to-main");
    if (!option) {
      button.dataset.strandRadialAction = "";
      button.textContent = "";
      configureRadialSubmenuIndicator(button, null, kind);
      return;
    }
    button.dataset.strandRadialAction = option.action;
    button.textContent = option.label;
    button.style.setProperty("--radial-angle", `${option.angle}rad`);
    button.style.setProperty("--radial-counter-angle", `${-option.angle}rad`);
    button.style.setProperty("--radial-radius-offset", `${option.radiusOffset || 0}px`);
    configureRadialSubmenuIndicator(button, option, kind);
    button.classList.toggle(
      "danger",
      option.action === "delete" || option.action === "delete-selection" || option.action === "delete-clump"
    );
  });
}

function beginStrandRadialGesture() {
  if (!deps.ui.radialMenusEnabled || deps.hairState.strandRadialGesture || deps.sculptState.duplicatePlacement) return false;
  const lock = deps.getSelectedLock();
  const hasOtherSelection = Boolean(deps.sel.selectedStrandGroup || deps.guideApi.getSelectedGuide() || deps.referenceHeadApi.selectedReferenceImage());
  if (!lock && hasOtherSelection) return false;
  const selectedClumpGuide = deps.sel.clumpViewportSelection ? deps.clumpGuideForLock(lock) : null;
  const kind = selectedClumpGuide
    ? "clump"
    : deps.selectedLocksInOrder().length > 1 ? "selection"
    : lock ? "strand"
    : "root";
  const { radialOptions: options, listOptions } = layoutContextualRadialOptions(kind);
  deps.hideOutlinerContextMenu();
  deps.hairState.strandRadialTargetId = lock?.id || null;
  deps.hairState.strandRadialGesture = {
    centerX: deps.lastPointer.x,
    centerY: deps.lastPointer.y,
    action: null,
    kind,
    options,
    listOptions,
    frameDimensions: sharedRadialFrameDimensions()
  };
  configureContextualRadialMenu(kind, options, listOptions);
  deps.strandRadialMenu.classList.remove("hidden");
  deps.strandRadialMenu.style.left = `${deps.lastPointer.x}px`;
  deps.strandRadialMenu.style.top = `${deps.lastPointer.y}px`;
  deps.hairState.strandRadialActions.forEach((button) => button.classList.remove("selected"));
  deps.strandRadialLine.style.width = "0px";
  deps.strandRadialLine.style.opacity = "0";
  deps.updateInteractionLocks();
  return true;
}

function enterStrandRadialSubmenu(option, pointer) {
  const gesture = deps.hairState.strandRadialGesture;
  if (!gesture || !option?.submenu) return false;
  const returningToParent = option.action === "back-to-main";
  let nextMenuOptions;
  if (returningToParent) {
    gesture.centerX = Number.isFinite(pointer?.x) ? pointer.x : gesture.centerX;
    gesture.centerY = Number.isFinite(pointer?.y) ? pointer.y : gesture.centerY;
    nextMenuOptions = layoutContextualRadialOptions(option.submenu);
  } else {
    const previousCenterX = gesture.centerX;
    const previousCenterY = gesture.centerY;
    const currentRadius = Number.parseFloat(
      deps.strandRadialMenu.style.getPropertyValue("--radial-radius")
    ) || 82;
    const optionRadius = currentRadius + (option.radiusOffset || 0);
    gesture.centerX += Math.cos(option.angle) * optionRadius;
    gesture.centerY += Math.sin(option.angle) * optionRadius;
    const backDeltaX = previousCenterX - gesture.centerX;
    const backDeltaY = previousCenterY - gesture.centerY;
    const backDistance = Math.hypot(backDeltaX, backDeltaY);
    const parentKind = gesture.kind;
    const rawOptions = contextualRadialOptions(option.submenu);
    const backOption = rawOptions.find(({ action }) => action === "back-to-main");
    if (backOption) backOption.submenu = parentKind;
    const submenuRadius = gesture.frameDimensions?.radius
      || radialMenuDimensionsForKind(option.submenu, rawOptions.length).radius;
    nextMenuOptions = layoutContextualRadialOptions(option.submenu, {
      options: rawOptions,
      backAngle: Math.atan2(backDeltaY, backDeltaX),
      backRadiusOffset: backDistance - submenuRadius
    });
  }
  gesture.kind = option.submenu;
  gesture.options = nextMenuOptions.radialOptions;
  gesture.listOptions = nextMenuOptions.listOptions;
  gesture.action = null;
  configureContextualRadialMenu(option.submenu, gesture.options, gesture.listOptions);
  deps.strandRadialMenu.style.left = `${gesture.centerX}px`;
  deps.strandRadialMenu.style.top = `${gesture.centerY}px`;
  deps.hairState.strandRadialActions.forEach((button) => button.classList.remove("selected"));
  deps.strandRadialLine.style.width = "0px";
  deps.strandRadialLine.style.opacity = "0";
  return true;
}

function updateStrandRadialGesture(event) {
  const gesture = deps.hairState.strandRadialGesture;
  if (!gesture) return;
  const dx = event.clientX - gesture.centerX;
  const dy = event.clientY - gesture.centerY;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const listOption = radialListOptionAtPointer(deps.strandRadialActionList, gesture.listOptions, event);
  const listCorridorReserved = !listOption
    && gesture.listOptions.length > 0
    && radialListCorridorContains(dx, dy);
  const closestOption = listOption || distance <= 34 || listCorridorReserved
    ? null
    : gesture.options.filter((option) => option.enabled !== false).reduce((closest, option) => {
      const difference = Math.abs(Math.atan2(
        Math.sin(angle - option.angle),
        Math.cos(angle - option.angle)
      ));
      return !closest || difference < closest.difference
        ? { ...option, difference }
        : closest;
    }, null);
  gesture.action = listOption?.action || closestOption?.action || null;
  deps.hairState.strandRadialActions.forEach((button) => {
    button.classList.toggle("selected", button.dataset.strandRadialAction === gesture.action);
  });
  syncRadialListHighlight(deps.strandRadialActionList, gesture.action);
  deps.strandRadialLine.style.width = `${Math.min(distance, 96)}px`;
  deps.strandRadialLine.style.transform = `translateY(-50%) rotate(${angle}rad)`;
  deps.strandRadialLine.style.opacity = !listOption && !listCorridorReserved && distance > 4 ? "1" : "0";
  if (
    closestOption?.submenu
    && distance >= strandRadialSubmenuEntryDistance(closestOption)
  ) {
    enterStrandRadialSubmenu(closestOption, { x: event.clientX, y: event.clientY });
  }
  event.preventDefault();
}

function performStrandRadialAction(action, lockId) {
  if (action === "toggle-dynamic-surface") {
    deps.drawFlowApi.setDrawSurfaceDynamicEnabled(!deps.drawFlowApi.drawSurfaceDynamicEnabled());
    deps.drawSurfaceDynamicButton.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  if (action?.startsWith("select-live-surface:")) {
    return deps.drawFlowApi.setActiveStrokeSurfaceValue(action.slice("select-live-surface:".length));
  }
  if (action?.startsWith("workspace-")) {
    deps.setViewportEditMode(action.slice("workspace-".length));
    return true;
  }
  if (action?.startsWith("edit-mode-")) {
    deps.setViewportSelectionMode(action.slice("edit-mode-".length));
    return true;
  }
  if (action === "create-clump") return Boolean(deps.createClumpFromSelection());
  if (action === "lock-selected-strands") return deps.lockSelectedStrands();
  if (action === "unlock-all-strands") return deps.unlockAllStrands();
  if (action === "hide-selected-strands") return deps.hideSelectedStrands();
  if (action === "unhide-hidden-strands") return deps.unhideHiddenStrands();
  if (action === "create-selection-set") return Boolean(deps.createSelectionSetFromSelection());
  if (action?.startsWith("add-selection-to-set:")) {
    return deps.editSelectionSetFromSelection(action.slice("add-selection-to-set:".length), "add");
  }
  if (action?.startsWith("remove-selection-to-set:")) {
    return deps.editSelectionSetFromSelection(action.slice("remove-selection-to-set:".length), "remove");
  }
  if (action === "duplicate-procedural") return deps.openProceduralDuplicateDialog();
  if (action === "toggle-isolate-selection") return deps.toggleSelectedStrandIsolation();
  if (action === "delete-selection") return deps.deleteSelectedStrands();
  if (action === "mirror-selected-strands") {
    const originalIds = [...deps.sel.selectedStrandIds];
    const { mirrorable } = mirrorSelectionTargets(deps.selectedLocksInOrder(), deps.mirrorPartnerFor);
    if (!mirrorable.length) return false;
    deps.pushUndoState();
    const mirrored = mirrorable
      .map((lock) => deps.createMirrorPartner(lock, { deferUi: true }))
      .filter(Boolean);
    if (!mirrored.length) return false;
    deps.updateCount();
    deps.selectLock(mirrored[0].id, {
      individualClumpMember: true,
      selectedIds: [...originalIds, ...mirrored.map((lock) => lock.id)]
    });
    return true;
  }
  if (action === "decouple-selected-mirrors") {
    const { decouple } = mirrorSelectionTargets(deps.selectedLocksInOrder(), deps.mirrorPartnerFor);
    if (!decouple.length) return false;
    deps.pushUndoState();
    decouple.forEach(deps.decoupleMirrorPartner);
    deps.renderLockList();
    return true;
  }
  const lock = deps.locks.find((item) => item.id === lockId);
  if (!lock || !action) return false;
  const clumpGuide = deps.clumpGuideForLock(lock);
  if (action === "mirror-clump") {
    if (!clumpGuide?.clumpGuide || deps.mirroredClumpPartners(clumpGuide).length) return false;
    deps.pushUndoState();
    const mirroredGuide = deps.createMirroredClump(clumpGuide);
    if (!mirroredGuide) return false;
    deps.selectLock(mirroredGuide.id);
    return true;
  }
  if (action === "decouple-mirrored-clump") {
    if (!clumpGuide?.clumpGuide || !deps.mirroredClumpPartners(clumpGuide).length) return false;
    deps.pushUndoState();
    return deps.decoupleMirroredClump(clumpGuide);
  }
  if (action === "create-clump-preset") {
    if (!clumpGuide) return false;
    deps.presetLibraryApi.createCustomClumpPreset(clumpGuide);
    return true;
  }
  if (action === "dissolve-clump") {
    if (!clumpGuide?.clumpId) return false;
    deps.pushUndoState();
    deps.dissolveClump(clumpGuide.clumpId);
    deps.sel.clumpViewportSelection = false;
    deps.selectLock(clumpGuide.id);
    return true;
  }
  if (action === "delete-clump") {
    const targets = deps.outlinerClumpLocks(clumpGuide);
    if (!targets.length) return false;
    deps.pushUndoState();
    deps.deleteLocks(targets);
    return true;
  }
  if (action === "duplicate") {
    return Boolean(deps.beginDuplicatePlacement(lock));
  }
  if (action === "delete") {
    deps.pushUndoState();
    deps.deleteLocks([lock]);
    return true;
  }
  return false;
}

function finishStrandRadialGesture() {
  if (!deps.hairState.strandRadialGesture) return false;
  const action = deps.hairState.strandRadialGesture.action;
  const lockId = deps.hairState.strandRadialTargetId;
  hideStrandRadialMenu();
  deps.updateInteractionLocks();
  if (action) performStrandRadialAction(action, lockId);
  return true;
}

function cancelStrandRadialGesture() {
  if (!deps.hairState.strandRadialGesture) return false;
  hideStrandRadialMenu();
  deps.updateInteractionLocks();
  return true;
}

function blockPointerDuringStrandRadialGesture(event) {
  if (!deps.hairState.strandRadialGesture && !deps.miscState.toolRadialGesture) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

function toolRadialOptions(tool = deps.sel.activeTool) {
  if (tool === "select") {
    return [
      { action: "select-strand", label: "Strand Select" },
      { action: "select-guide", label: "Guide Select" },
      { action: "select-reference", label: "Reference Select" }
    ];
  }
  if (tool === "move") {
    return [
      { action: "world-space", label: "World Space" },
      { action: "object-space", label: "Object Space" },
      { action: "contextual-2d", label: deps.sculptState.viewPlaneMoveEnabled ? "Disable 2D Translation" : "2D Translation" },
      { action: "pull-strand", label: deps.sculptState.pullMoveEnabled ? "Disable Pull Strand" : "Pull Strand" }
    ];
  }
  if (["rotate", "scale"].includes(tool)) {
    return [
      { action: "world-space", label: "World Space" },
      { action: "object-space", label: "Object Space" }
    ];
  }
  return [];
}

function hideToolRadialMenu() {
  deps.miscState.toolRadialGesture = null;
  deps.toolRadialMenu.classList.add("hidden");
  deps.miscState.toolRadialActions.forEach((button) => {
    button.classList.remove("selected");
    button.classList.add("hidden");
  });
  deps.toolRadialActionList.replaceChildren();
  deps.toolRadialActionList.classList.add("hidden");
  deps.toolRadialLine.style.width = "0px";
  deps.toolRadialLine.style.opacity = "0";
}

function beginToolRadialGesture() {
  if (!deps.ui.radialMenusEnabled || deps.miscState.toolRadialGesture || deps.hairState.strandRadialGesture || deps.sculptState.duplicatePlacement) return false;
  const partitioned = partitionRadialOptions(toolRadialOptions(), MAX_RADIAL_OPTIONS);
  const options = layoutRadialOptions(partitioned.radialOptions);
  const listOptions = partitioned.listOptions;
  if (!options.length) return false;
  deps.miscState.toolRadialActions = ensureRadialButtonCapacity(
    deps.toolRadialMenu,
    deps.miscState.toolRadialActions,
    options.length,
    "toolRadialIndex",
    deps.toolRadialLine
  );
  applyRadialMenuDimensions(deps.toolRadialMenu, options.length, sharedRadialFrameDimensions());
  renderRadialActionList(deps.toolRadialActionList, listOptions);
  options.forEach((option, index) => {
    const button = deps.miscState.toolRadialActions[index];
    button.textContent = option.label;
    button.dataset.toolRadialAction = option.action;
    button.style.setProperty("--radial-angle", `${option.angle}rad`);
    button.style.setProperty("--radial-counter-angle", `${-option.angle}rad`);
    button.style.setProperty("--radial-radius-offset", `${option.radiusOffset || 0}px`);
    button.classList.remove("hidden", "selected");
  });
  deps.miscState.toolRadialActions.slice(options.length).forEach((button) => button.classList.add("hidden"));
  deps.miscState.toolRadialGesture = {
    centerX: deps.lastPointer.x,
    centerY: deps.lastPointer.y,
    action: null,
    options,
    listOptions
  };
  deps.toolRadialCenter.textContent = deps.sel.activeTool[0].toUpperCase() + deps.sel.activeTool.slice(1);
  deps.toolRadialMenu.style.left = `${deps.lastPointer.x}px`;
  deps.toolRadialMenu.style.top = `${deps.lastPointer.y}px`;
  deps.toolRadialMenu.classList.remove("hidden");
  deps.updateInteractionLocks();
  return true;
}

function beginToolShortcutPress(key, tool) {
  if (deps.miscState.toolShortcutPress || deps.miscState.toolRadialGesture || deps.hairState.strandRadialGesture || deps.sculptState.duplicatePlacement) return;
  deps.setActiveTool(tool);
  if (!deps.ui.radialMenusEnabled) return;
  deps.miscState.toolShortcutPress = {
    key,
    tool,
    opened: false,
    holdTimer: window.setTimeout(() => {
      if (!deps.miscState.toolShortcutPress || deps.miscState.toolShortcutPress.key !== key) return;
      deps.miscState.toolShortcutPress.opened = beginToolRadialGesture();
    }, 180)
  };
}

function finishToolShortcutPress(key) {
  if (!deps.miscState.toolShortcutPress || deps.miscState.toolShortcutPress.key !== key) return false;
  const press = deps.miscState.toolShortcutPress;
  deps.miscState.toolShortcutPress = null;
  window.clearTimeout(press.holdTimer);
  if (press.opened) finishToolRadialGesture();
  return true;
}

function cancelToolShortcutPress() {
  if (!deps.miscState.toolShortcutPress) return false;
  window.clearTimeout(deps.miscState.toolShortcutPress.holdTimer);
  deps.miscState.toolShortcutPress = null;
  cancelToolRadialGesture();
  return true;
}

function setRadialMenusEnabled(enabled, { persist = true } = {}) {
  deps.ui.radialMenusEnabled = Boolean(enabled);
  deps.radialMenusPreferenceInput.checked = deps.ui.radialMenusEnabled;
  deps.radialShortcutRows.forEach((row) => row.classList.toggle("hidden", !deps.ui.radialMenusEnabled));
  if (!deps.ui.radialMenusEnabled) {
    cancelToolShortcutPress();
    cancelToolRadialGesture();
    cancelStrandRadialGesture();
  }
  if (persist) deps.saveBooleanPreference(deps.RADIAL_MENUS_PREFERENCE_KEY, deps.ui.radialMenusEnabled);
  deps.updateInteractionLocks();
}

function updateToolRadialGesture(event) {
  const gesture = deps.miscState.toolRadialGesture;
  if (!gesture) return;
  const dx = event.clientX - gesture.centerX;
  const dy = event.clientY - gesture.centerY;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const listOption = radialListOptionAtPointer(deps.toolRadialActionList, gesture.listOptions, event);
  gesture.action = listOption?.action || (distance <= 34
    ? null
    : gesture.options.reduce((closest, option) => {
      const difference = Math.abs(Math.atan2(
        Math.sin(angle - option.angle),
        Math.cos(angle - option.angle)
      ));
      return !closest || difference < closest.difference
        ? { ...option, difference }
        : closest;
    }, null)?.action || null);
  deps.miscState.toolRadialActions.forEach((button) => {
    button.classList.toggle("selected", button.dataset.toolRadialAction === gesture.action);
  });
  syncRadialListHighlight(deps.toolRadialActionList, gesture.action);
  deps.toolRadialLine.style.width = `${Math.min(distance, 96)}px`;
  deps.toolRadialLine.style.transform = `translateY(-50%) rotate(${angle}rad)`;
  deps.toolRadialLine.style.opacity = !listOption && distance > 4 ? "1" : "0";
  event.preventDefault();
}

function performToolRadialAction(action) {
  if (action === "select-strand") deps.setViewportEditMode("strand");
  else if (action === "select-guide") deps.setViewportEditMode("guide");
  else if (action === "select-reference") deps.setViewportEditMode("reference");
  else if (action === "world-space") deps.setObjectSpaceEditing(false);
  else if (action === "object-space") deps.setObjectSpaceEditing(true);
  else if (action === "contextual-2d") deps.setViewPlaneMove(!deps.sculptState.viewPlaneMoveEnabled);
  else if (action === "pull-strand") deps.setPullMoveEnabled(!deps.sculptState.pullMoveEnabled);
}

function finishToolRadialGesture() {
  if (!deps.miscState.toolRadialGesture) return false;
  const action = deps.miscState.toolRadialGesture.action;
  hideToolRadialMenu();
  deps.updateInteractionLocks();
  if (action) performToolRadialAction(action);
  return true;
}

function cancelToolRadialGesture() {
  if (!deps.miscState.toolRadialGesture) return false;
  hideToolRadialMenu();
  deps.updateInteractionLocks();
  return true;
}
  return {
    hideStrandRadialMenu,
    ensureRadialButtonCapacity,
    radialButtonDimensions,
    radialMenuDimensionsForKind,
    applyRadialMenuDimensions,
    strandRadialSubmenuEntryDistance,
    configureRadialSubmenuIndicator,
    selectionSetMembershipRadialOptions,
    selectionSetRadialMenuOption,
    selectedMirrorRadialOptions,
    strandVisibilityRadialOptions,
    clumpMirrorRadialOptions,
    contextualRadialOptions,
    sharedRadialFrameDimensions,
    layoutContextualRadialOptions,
    renderRadialActionList,
    radialListOptionAtPointer,
    syncRadialListHighlight,
    configureContextualRadialMenu,
    beginStrandRadialGesture,
    enterStrandRadialSubmenu,
    updateStrandRadialGesture,
    performStrandRadialAction,
    finishStrandRadialGesture,
    cancelStrandRadialGesture,
    blockPointerDuringStrandRadialGesture,
    toolRadialOptions,
    hideToolRadialMenu,
    beginToolRadialGesture,
    beginToolShortcutPress,
    finishToolShortcutPress,
    cancelToolShortcutPress,
    setRadialMenusEnabled,
    updateToolRadialGesture,
    performToolRadialAction,
    finishToolRadialGesture,
    cancelToolRadialGesture
  };
}
