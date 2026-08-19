// organize-modules.js — move remaining flat modules into domain folders (refactor 2c).
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const domain = {
  "app-config.js":"core","preference-storage.js":"core","preferences-backup.js":"core","shortcut-registry.js":"core","history.js":"core",
  "loc-ja.js":"data","loc-zh.js":"data","localization.js":"data","clump-brush-presets.js":"data","shape-presets.js":"data","tool-presets.js":"data",
  "curve-math.js":"geometry","curve-surface.js":"geometry","curve-lattice.js":"geometry","surface-lattice.js":"geometry","poly-topology.js":"geometry","topology.js":"geometry","strand-constraints.js":"geometry","capsule-curve.js":"geometry","branch-connect.js":"geometry","compound-strand.js":"geometry","procedural-draw.js":"geometry","radial-layout.js":"geometry","anime-hair-shaders.js":"geometry","uv-inspector.js":"geometry",
  "selection-state.js":"edit","selection-sets.js":"edit","mirror-selection.js":"edit","multi-edit.js":"edit",
  "sculpt-brush.js":"sculpt",
  "material-state.js":"material"
};

// create domain dirs
const dirs = new Set(Object.values(domain));
for (const d of dirs) fs.mkdirSync(path.join("modules", d), { recursive: true });

// git mv
for (const [name, d] of Object.entries(domain)) {
  const from = path.join("modules", name);
  const to = path.join("modules", d, name);
  execSync(`git mv "${from}" "${to}"`, { stdio: "inherit" });
}
console.log("git mv done:", Object.keys(domain).length, "modules");

// update app.js imports: ./modules/<name>.js?v=... -> ./modules/<domain>/<name>.js?v=...
let app = fs.readFileSync("app.js", "utf8");
for (const [name, d] of Object.entries(domain)) {
  const re = new RegExp(`from "\\./modules/${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\?v=[^"]*)"`, "g");
  app = app.replace(re, `from "./modules/${d}/${name}$1"`);
}
fs.writeFileSync("app.js", app, "utf8");
console.log("app.js imports updated");

// fix module-to-module imports inside material-state.js (now in modules/material/)
let mat = fs.readFileSync("modules/material/material-state.js", "utf8");
mat = mat.replace('from "./app-config.js"', 'from "../core/app-config.js"');
mat = mat.replace('from "./anime-hair-shaders.js"', 'from "../geometry/anime-hair-shaders.js"');
fs.writeFileSync("modules/material/material-state.js", mat, "utf8");
console.log("material-state.js cross-domain imports updated");
