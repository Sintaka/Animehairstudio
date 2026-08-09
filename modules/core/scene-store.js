// scene-store.js — minimal mutable-state container with change-trace hooks.
// The convergence target for app.js global `let` state (refactor stage 3).
// `state` is a Proxy so assignments can be traced/middlewared; snapshot/restore
// support project save/load and undo.
export function createSceneStore(initial = {}) {
  const state = { ...initial };
  const listeners = [];
  const proxy = new Proxy(state, {
    get(target, key) { return target[key]; },
    set(target, key, value) {
      const previous = target[key];
      target[key] = value;
      if (previous !== value) {
        for (const fn of listeners) fn(key, value, previous);
      }
      return true;
    },
    deleteProperty(target, key) {
      const previous = target[key];
      delete target[key];
      for (const fn of listeners) fn(key, undefined, previous);
      return true;
    }
  });
  return {
    state: proxy,
    snapshot() { return { ...state }; },
    restore(values) { Object.assign(state, values); },
    subscribe(fn) {
      listeners.push(fn);
      return () => {
        const i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    }
  };
}
