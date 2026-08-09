// branch-store.js — child-strand (子发片) parameters & view state (refactor 3c).
// Preference-backed fields load from localStorage via core/preference-storage.
import * as THREE from "three";
import { createSceneStore } from "../core/scene-store.js?v=20260809-1";
import { readStoredPreference } from "../core/preference-storage.js?v=20260728-1";

export const BRANCH_PREFERENCE_KEYS = Object.freeze({
  rigidCurvatureBlend: "anime-hair-studio-branch-rigid-curvature-blend",
  bridgeSmoothStrength: "anime-hair-studio-branch-bridge-smooth-strength",
  bridgeSmoothDetail: "anime-hair-studio-branch-bridge-smooth-detail",
  regionSyncLateral: "anime-hair-studio-branch-region-sync-lateral",
  regionSyncVertical: "anime-hair-studio-branch-region-sync-vertical"
});

export function createBranchStore() {
  const store = createSceneStore({
    branchUpdateInProgress: false,
    regionLengthUpdateInProgress: false,
    branchRigidCurvatureBlend: readStoredPreference(window, BRANCH_PREFERENCE_KEYS.rigidCurvatureBlend, {
      fallback: 0.5,
      normalize: (value) => THREE.MathUtils.clamp(Number(value), 0, 1)
    }),
    branchBridgeSmoothStrength: readStoredPreference(window, BRANCH_PREFERENCE_KEYS.bridgeSmoothStrength, {
      fallback: 0.5,
      normalize: (value) => THREE.MathUtils.clamp(Number(value), 0, 1)
    }),
    branchBridgeSmoothDetail: readStoredPreference(window, BRANCH_PREFERENCE_KEYS.bridgeSmoothDetail, {
      fallback: 1,
      normalize: (value) => THREE.MathUtils.clamp(Math.round(Number(value) || 1), 0, 8)
    }),
    branchRegionSyncLateral: readStoredPreference(window, BRANCH_PREFERENCE_KEYS.regionSyncLateral, {
      fallback: 0.45,
      normalize: (value) => THREE.MathUtils.clamp(Number(value) || 0.45, 0.1, 2)
    }),
    branchRegionSyncVertical: readStoredPreference(window, BRANCH_PREFERENCE_KEYS.regionSyncVertical, {
      fallback: 1,
      normalize: (value) => THREE.MathUtils.clamp(Number(value) || 1, 0.1, 2)
    }),
    branchRegionView: { x: 0, y: 0, w: 220, h: 400 }
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
