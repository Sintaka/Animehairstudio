// misc-store.js — leftover tool/UI/fps/braid state (refactor 3c wrap-up).
import { createSceneStore } from "./scene-store.js?v=20260809-1";
export function createMiscStore() {
  const store = createSceneStore({
    braidSegmentTemplate: null,
    braidSegmentBounds: null,
    loftSurfaceDraft: null,
    clumpUpdateInProgress: false,
    toolShortcutPress: null,
    toolRadialGesture: null,
    pendingDroppedApplicationKind: null,
    pendingDroppedApplicationHandle: null,
    fpsFrameCount: 0,
    scaleSensitivity: 0.3,
    toolTipsEnabled: true,
    compactToolButtonsEnabled: false,
    compactSidebarDockActivationWidth: null,
    sideNamingPerspective: "viewport",
    lastHorizontalViewAxis: null,
    toolRadialActions: [],
    groupDefaultsWarningAcknowledged: false,
    groupDefaultsWarningContinuation: null,
    fpsSampleStart: 0,
    previousAnimationTimestamp: 0
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
