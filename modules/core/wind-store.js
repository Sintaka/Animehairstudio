// wind-store.js — wind preview (吹风预览) parameters & view state.
// Preference-backed fields load from localStorage via core/preference-storage;
// runtime fields (windPreviewActive / windPlaying / windTime) live in memory only.
import { createSceneStore } from "./scene-store.js";
import { readStoredPreference } from "./preference-storage.js";

// Clamp a stored numeric string into [min, max]; non-finite values fall back
// to `fallback` (the field's default) before clamping.
function clampNumber(fallback, min, max) {
  return (value) => {
    const parsed = Number(value);
    const base = Number.isFinite(parsed) ? parsed : fallback;
    return Math.min(max, Math.max(min, base));
  };
}

export const WIND_PREFERENCE_KEYS = Object.freeze({
  windDirection: "anime-hair-studio-wind-direction",
  windStrength: "anime-hair-studio-wind-strength",
  windFrequency: "anime-hair-studio-wind-frequency",
  windTurbulence: "anime-hair-studio-wind-turbulence",
  windTurbulenceScale: "anime-hair-studio-wind-turbulence-scale",
  windGustStrength: "anime-hair-studio-wind-gust-strength",
  windGustFreq: "anime-hair-studio-wind-gust-freq",
  windRootExponent: "anime-hair-studio-wind-root-exponent",
  windStrandRandom: "anime-hair-studio-wind-strand-random",
  windSeed: "anime-hair-studio-wind-seed"
});

export function createWindStore() {
  const store = createSceneStore({
    windDirection: readStoredPreference(window, WIND_PREFERENCE_KEYS.windDirection, {
      fallback: 0,
      normalize: clampNumber(0, -180, 180)
    }),
    windStrength: readStoredPreference(window, WIND_PREFERENCE_KEYS.windStrength, {
      fallback: 0.6,
      normalize: clampNumber(0.6, 0, 1)
    }),
    windFrequency: readStoredPreference(window, WIND_PREFERENCE_KEYS.windFrequency, {
      fallback: 0.8,
      normalize: clampNumber(0.8, 0.1, 3)
    }),
    windTurbulence: readStoredPreference(window, WIND_PREFERENCE_KEYS.windTurbulence, {
      fallback: 0.5,
      normalize: clampNumber(0.5, 0, 1)
    }),
    windTurbulenceScale: readStoredPreference(window, WIND_PREFERENCE_KEYS.windTurbulenceScale, {
      fallback: 2,
      normalize: clampNumber(2, 0.5, 8)
    }),
    windGustStrength: readStoredPreference(window, WIND_PREFERENCE_KEYS.windGustStrength, {
      fallback: 0.35,
      normalize: clampNumber(0.35, 0, 1)
    }),
    windGustFreq: readStoredPreference(window, WIND_PREFERENCE_KEYS.windGustFreq, {
      fallback: 0.2,
      normalize: clampNumber(0.2, 0.05, 0.5)
    }),
    windRootExponent: readStoredPreference(window, WIND_PREFERENCE_KEYS.windRootExponent, {
      fallback: 2.5,
      normalize: clampNumber(2.5, 1, 4)
    }),
    windStrandRandom: readStoredPreference(window, WIND_PREFERENCE_KEYS.windStrandRandom, {
      fallback: 0.5,
      normalize: clampNumber(0.5, 0, 1)
    }),
    windSeed: readStoredPreference(window, WIND_PREFERENCE_KEYS.windSeed, {
      fallback: 20260817,
      normalize: (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.round(parsed) : 20260817;
      }
    }),
    windPreviewActive: false,
    windPlaying: true,
    windTime: 0
  });
  return { state: store.state, snapshot: store.snapshot, restore: store.restore };
}
