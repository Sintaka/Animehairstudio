const TOOL_SHORTCUT_ENTRIES = Object.freeze([
  ["q", "select"],
  ["w", "move"],
  ["e", "rotate"],
  ["r", "scale"],
  ["t", "relax"],
  ["d", "draw"],
  ["p", "panel"],
  ["g", "braid"]
]);

const WORKSPACE_SHORTCUT_ENTRIES = Object.freeze([
  ["1", "strand"],
  ["2", "guide"],
  ["3", "reference"]
]);

const APPLICATION_SHORTCUT_KEYS = new Set([
  ...TOOL_SHORTCUT_ENTRIES.map(([key]) => key),
  ...WORKSPACE_SHORTCUT_ENTRIES.map(([key]) => key),
  "tab",
  "s",
  "b",
  "o",
  "h",
  "l",
  "f",
  "x"
]);

export const TOOL_SHORTCUTS = Object.freeze(Object.fromEntries(TOOL_SHORTCUT_ENTRIES));
export const WORKSPACE_SHORTCUTS = Object.freeze(Object.fromEntries(WORKSPACE_SHORTCUT_ENTRIES));

export function shortcutToolForKey(key) {
  return TOOL_SHORTCUTS[String(key || "").toLowerCase()] || null;
}

export function workspaceForShortcutKey(key) {
  return WORKSPACE_SHORTCUTS[String(key || "").toLowerCase()] || null;
}

export function pointerControlShouldReturnViewportFocus(control) {
  const tag = control?.tagName?.toLowerCase();
  if (tag === "input") {
    return ["checkbox", "radio", "range"].includes(String(control.type || "").toLowerCase());
  }
  return tag === "button" && control?.getAttribute?.("aria-pressed") !== null;
}

export function focusedControlShouldYieldToShortcut(focused, event) {
  const tag = focused?.tagName?.toLowerCase();
  const textEntry = tag === "textarea"
    || focused?.isContentEditable === true
    // 可键入数值的输入框（number/date/time…）按文本输入处理，不 yield 给应用快捷键
    || (tag === "input" && ["text", "search", "email", "password", "url", "tel", "number", "date", "datetime-local", "time", "month", "week"].includes(focused.type));
  const yieldsAppShortcuts = !textEntry && (tag === "select" || tag === "input");
  if (!yieldsAppShortcuts) return false;
  const key = String(event?.key || "").toLowerCase();
  if (event?.ctrlKey || event?.metaKey) return key === "z" || key === "y" || key === "d" || key === "h";
  if (event?.altKey) return key === "d";
  return event?.key === "Delete" || event?.code === "Space" || APPLICATION_SHORTCUT_KEYS.has(key);
}
