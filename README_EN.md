# Anime Hair Studio

**English** | [中文](README.md)

**Anime Hair Studio** is a web-based anime hair-sheet production tool: draw and sculpt strands, braids and panels straight in the browser (3D viewport drawing/sculpting), with scalp guides, clumps, materials, presets, and OBJ/USDA export.

This project comes from the original author **Ludetools** ([github.com/Ludetools/Animehairstudio](https://github.com/Ludetools/Animehairstudio)). This repository keeps the original author's LICENSE and donation links; it is source-available and limited to personal / non-commercial use.

## Using my code

This repository is a local adaptation of the original project. My own changes usually live on **dev branches** (not `main`). Whether you merge a branch or build something new on top of it (secondary development), you can use it directly, **no permission needed**; I keep improving this project to fit Houdini workflows better.

## Local deployment (Python)

1. Install Python 3, run `python -m http.server 8080 --bind 127.0.0.1` in the project root, and open `http://127.0.0.1:8080/` in your browser.
2. Or just double-click `start-dev-server.cmd` (it opens the browser automatically).
3. Don't open `index.html` directly via `file://` — browser security restrictions block module loading.

Alternatively (requires Node.js): the built-in static server also doubles as a proxy for the native save dialog — run `node server.js` in the project root and open `http://127.0.0.1:5173/` (change the port with `PORT=xxxx node server.js`, or `$env:PORT=xxxx; node server.js` in Windows PowerShell). You can also use the generic npm static server: `npx http-server . -p 8080`.

## What's new in this repository (summary)

### Tip system

- **Tip Clump (tip narrowing, panel/strand semantics unified in 0.2.132)** — drag the slider (or the little green ball in the viewport) to narrow the tip as a fraction of its own width, ramping linearly from 0 at the zipper to the full value at the tip. Combined with a zipper this gives a simple fork: the zipper decides the seam, Tip Clump gathers the tip so the seam opens, and the green width control points move with it. The old Split Spacing slider (overlapped the zipper's job) is gone; existing files' old values seed each tube's initial Tip Clump.
- **Panel split sub-bones + tip sub-bones** — each split segment gets a full transform bone (P / orient / Tip Clump + per-segment Width/Depth curves), tip chain handles / highlight / normal arrows, rotate/scale attached to the gizmo, tip WidthCurve (independent per side, zipper-truncated, Tip Clump 0–0.99, Reset to all-1), per-vertex skin weights + USDA SkelBindingAPI skinning.
- **Ordinary-strand sub-tips selectable and controllable (0.2.126)** — mirrors panel exactly: click to select / click again to deselect, hover to highlight, a handle on every chain point, normal arrows in rotate mode, W/E/R gizmo, brush sculpts only the selected tube, alt+click quick-switch, automatic cleanup on selection change; segment index and selection state stay independent. The same release also added the Split Segments stepper + per-tube Tip Clump (formerly Segment Spread) + Width/Depth Curve editing (0.2.125, appears only with Split Geometry on), plus the tip WidthCurve ported to ordinary strands: above its own zipper each tube uses its own curve, below it the global curve applies (continuous at the switch), both sides share one parameter grid with exposed-point count following each side's zipper height, affecting only the tip's width, not UVs.
- **Assorted tip / zipper fixes** — the panel tip gizmo jump (0.2.126, dragging W/E jumped once the rest chain had moved, same root cause as the 0.2.120 brush jump), 3+ tubes with no tip handle from the third on, mirroring applying tip poses to the wrong tube with unsorted zippers, and an unreachable control point on the shallower side when zipper heights differ — all fixed; each zipper height exposes one more tip bone with the root anchored below its first exposed point; sculpting a tip no longer snaps back to its pre-edit position.

### Child strands & bridging

- **Child strands** (low-poly watertight bridge + carved parent + Region selection + root-bone gizmo/twist/H mode + Bridge Smooth).

### Geometry & deformation

- **Multiple zippers on ordinary strands** — upgraded from a single zipper to many (N zippers → N+1 tubes); the strand panel gains +/− Zipper Controls (up to 8), see "Zipper editing" below for the interaction model; geometry, UV unwrapping, bones and USDA export all follow, and existing single-zipper files open unchanged.

### UV & export

- **Export UV auto-layout + UV Checker preview** — on export, each island is scaled to uniform texel density and packed into UDIM 1001; the UV Checker window can preview the final layout, see "Export UV layout" below.
- **USDA skeleton / skin export** — a complete USD Skeleton plus SkelBindingAPI skin binding, ready for USD Character Import in Houdini, see "USDA skeleton / skin export" below.

### UI & interaction

- **Simplified Chinese UI** (Settings → Language, 3D terms kept in English); **five custom sculpt brushes** (Slide / Scale·Cut-Extend / Push / Orient / Twist) + Smooth twist, see "Sculpt brushes" below; sculpt brush selection mask — with nothing selected, only visible hair is sculpted, with a selection, only the selected hair is sculpted.
- **Quick Save / Export** — Ctrl+S quick-saves to the last project file (remembered file handle), Ctrl+Shift+S saves as, Ctrl+Alt+S quick-exports a replay of the last export (prefers the File System Access API to write directly to disk, avoiding download "(1)" suffixes); the File menu removes the 3 Local dev options that used to route through `server.js`, and the shortcuts help has a dedicated "Sintaka Fork" section.
- **Viewport navigation styles** — Anime Hair Studio (default) / Blender / Houdini, switchable in Settings → Preferences → Navigation style; S + left-drag to resize the brush; Delete removes extra materials; Ctrl+Z undo fixed (works outside text inputs); drag & drop a .ahs/.animehair.json file to open the project; floating panels follow the selection.
- **Wind Preview** — open the floating window from the Preview menu; 10 parameters (direction / strength / frequency / turbulence / gust / root exponent / per-strand randomness / seed and more) preview wind-blown hair live, with roots pinned and the largest sway at the tips. Closing the window restores the hair bit-for-bit and nothing is written to the project file.

## Sculpt brushes

Five custom sculpt brushes:

- **Slide** — moves control points along the curve tangent direction, restricted to the tangent/normal plane, without changing the curve's length proportion.
- **Push** — pushes along the local normal direction, restricted to normal-direction movement.
- **Orient** — rolls the section around the tangent, turning the section's normal toward the viewport-orthogonal direction.
- **Scale** — two modes: **Scale** — root-anchored uniform radial scaling of the whole hair sheet (no movement); **Cut·Extend** — uniform parameter scaling of the whole sheet preserving point spacing (factor < 1 cuts, factor > 1 extends along the end tangent).
- **Twist** — manual roll around the tangent axis; it changes orientation only and never moves points (see the next section).

Ctrl = reverse on all brushes: Scale defaults to growing, Ctrl shrinks; Cut·Extend defaults to extending, Ctrl cuts.

### Twist

A manual axial-roll brush: hold the left button and drag left or right, and the strands inside the brush roll around their own tangent direction. Use it to hand-tune how a hair sheet faces without changing its shape.

- **Camera-independent** — the angle comes from the horizontal drag only, so dragging right and dragging left are two opposite directions and Ctrl reverses them again. That is the real difference from Orient: Orient rolls the section normal toward the current viewport direction, so the same drag flips once you orbit; Twist does not.
- **Rotates orientation only, never moves points** — geometry positions stay put; only the roll angle of the swept section changes.
- **Hierarchy (H) mode** — the roll carries to downstream child bones, but their positions stay pinned; the whole sub-chain rolls rigidly (unlike an ordinary hierarchical rotate, which swings positions around a pivot as well).
- **Affected point set is locked at mouse-down** — this is the only brush that freezes its influence at the start of the stroke: the moment you press the left button, which points are affected and how strongly is fixed, and moving the cursor no longer changes the range until you release. Every other brush follows the cursor live.

**No hotkey is assigned to Twist** — it is reachable only from its brush button in the tool dock.

## Tip sub-bones

![Panel split tip sub-bone editing](devlog/assets/tip-subbone-width-curve.png)

Each split segment gets its own tip sub-bone. Selecting one in the viewport shows that segment's tip chain handles, highlight, and normal arrows. The green control points are the segment's tip WidthCurve — they only affect the width of the current tip; the upper part of the zipper follows the main bone (no splitting). Segment Spread controls how much the tip converges (0–0.99, which also prevents degenerate faces). Skin weights are divided along the top diagonal of the zipper on each side, so the Scale brush doesn't tear the low-zipper side apart. Under rotate (E) / scale (R) the tip sub-bone is attached to the transform gizmo.

When the two zippers have different heights, the green control points share one set of parameter positions across both sides (identical spacing), but each side only exposes the ones below its own zipper — the deeper zipper's side has more control points, the shallower side fewer, following the zipper heights dynamically. Every visible control point can be grabbed and does affect that side's width (older versions left one unreachable point on the shallower side, causing a dent, now fixed).

## Zipper editing

Both panels and ordinary strands support multiple zippers: **N zippers cut the sheet into N+1 tubes**. Add and remove them with `+` / `−` under Zipper Controls in the matching panel (up to 8 on a strand). Each zipper has its own position and height and its handle can be dragged directly in the viewport.

- `+` subdivides the currently selected segment first, taking the height of the zipper next to the segment being subdivided (since 0.2.125, before it always took the left-most zipper's height); both halves it creates inherit the original segment's tip pose. Deleting one keeps the merged segment close to its existing pose.
- `−` removes the most recently added zipper (not the right-most one), so a carefully placed zipper doesn't get deleted by accident; dragging a handle never deletes anything. Click a zipper handle to select it (the handle grows and brightens), then press **Del** to delete just that zipper; Del only deletes the whole hair when no zipper is selected.
- Each zipper height exposes one more tip bone, and the bone root always anchors below its first exposed point; the viewport and the USDA export agree on which rows are exposed.
- Geometry, UV unwrapping, bones and USDA export all follow the multi-zipper setup. Existing single-zipper files open unchanged.

## Scalp Conform (latitude axis + fitted ellipsoid)

![Front fringe fitted to the scalp hemisphere](devlog/assets/scalp-conform-fringe-hemisphere-fit.png)

A single front fringe panel wrapped onto the scalp hemisphere: green/purple is the scalp proxy cage, and the cyan row lines show how the panel follows the fitted ellipsoid's latitudes — every row bends around a **vertical** axis, so the edges sweep backwards along the scalp instead of curling over the crown.

Bends a flat panel onto the scalp while **preserving arc length** — the panel keeps its authored width instead of collapsing. The main use case is building **the anime trident forehead fringe as one single panel**: widen it, dial in some Conform, and the whole sheet wraps back across the forehead and temples; then cut the trident partings with zippers. No hand-tuning edge curves, no assembling three separate panels.

### Mathematical model

The bend does **not** rotate around the panel's own tangent (that curls the edges of forehead-tilted rows into the scalp). Instead the bend axis is derived per row from a **fitted ellipsoid**:

- Slice the ellipsoid with a horizontal plane to get that row's **latitude ellipse**: semi-axes `A = ax·c`, `B = az·c`, where `c = √(1 − h²)` and `h = (P.y − center.y) / ay`. The **latitude centre rises with height and always stays in its horizontal cross-section** (offset toward the north pole).
- Take the **osculating circle centre** `O_osc` of that latitude ellipse at the row's azimuth and run a **vertical** bend axis through it; `Reff = |P − O_osc|`, curvature `k = amount / (Reff + gap)`.
- A permanently vertical axis means vertices only move within their horizontal plane, so edges **sweep backwards** rather than curling downwards — long hair still hangs straight.
- Arc length is preserved by **per-segment length preservation** (each segment is only rotated, never rescaled), so material off the neutral surface is not stretched either.

When the ellipsoid degenerates to a sphere the osculating centre lands exactly on the latitude centre (a circle's osculating centre *is* its centre), so results are **bit-identical to the previous version on the default head**.

### Controls

| Control | Range | Effect |
|---|---|---|
| **Conform** | −1 … 1 | Conform strength. 0 = no bend (bit-identical to flat), 1 = fully rolled onto the `Reff + gap` arc, negative curls the other way. **Per panel.** |
| **Scalp Gap** | 0 … 0.5 | Grows the bend radius in world units. Prevents z-fighting and doubles as the looser/tighter knob. **Per panel.** |
| **Fit Width** | 0.5 … 1.5 | Left-right half-axis of the fitted ellipsoid. **Global** (shared by every panel). |
| **Fit Depth** | 0.5 … 1.5 | Front-back half-axis of the fitted ellipsoid. **Global.** |

Fit Width / Fit Depth are **deliberately independent** of the visible scalp proxy's size sliders: the visible scalp also carries lattice and segmented shaping, so the best-fit ellipsoid never equals those slider values anyway — keeping them separate is what makes the approximation tunable. The ellipsoid is only an **approximation**; it does not try to match the lattice-deformed scalp mesh.

### Known limitations

- In a spherical configuration (Fit Width == Fit Depth) the head's **overall size and height do not affect** conform — a circle's osculating centre is independent of its radius, so both cancel algebraically. Use Scalp Gap for wrap tightness and the scalp proxy's Center X/Z to move the vertical axis.
- In a **non-spherical** configuration (Fit Width ≠ Fit Depth) "edges stay outside the scalp" is no longer guaranteed by construction (the ellipse's horizontal radius at other azimuths can exceed `Reff`), and front-versus-side wrap tightness becomes uneven, flipping direction with the relative size of the two half-axes. Spherical configurations are unaffected.
- At Conform **1.0** the edges of a cambered panel penetrate the scalp slightly; the practical range is **≤ 0.87**.
- Lattice-driven surface panels are excluded (their shape comes straight from the control cage).

## Shortcuts

- **Alt + Left-click** — quick-switch the selection to the hovered tip sub-bone segment (or hovered strand) without deselecting first. Same habit as ZBrush.
- **Ctrl + Left-drag** — on a green tip WidthCurve control point, asymmetric edit (only the dragged side moves; without Ctrl both sides mirror equally); elsewhere, sculpt brushes act in reverse (Scale grows by default and shrinks with Ctrl; Cut·Extend extends by default and cuts with Ctrl), and the select tool removes from the selection.
- **Save / export** — Ctrl+S quick-saves to the last project file (remembered handle, overwrites the same file); Ctrl+Shift+S saves as; Ctrl+Alt+S quick-exports a replay of the last export.
- **Del** — deletes only the selected zipper when one is selected; deletes the focused material when the material panel has focus; otherwise deletes the current hair selection.
- **Other custom shortcuts** — S + left-drag to resize the brush, Delete to remove extra materials, H for hierarchy editing (root-bone workflow), Ctrl+Z undo (works outside text inputs).
- **Viewport navigation** — the default Anime Hair Studio style is Alt+Left to orbit / Alt+Right to pan / scroll wheel to zoom; the Houdini style is Alt+Left to orbit / Alt+Middle to pan / Alt+Right to zoom / scroll wheel to zoom, switchable in Settings → Preferences → Navigation style. The full list lives in the app under Help → Shortcuts (everything added by this repository is grouped in the "Sintaka Fork" section).

## Coordinate system & gizmo axes

The app uses Three.js's right-handed coordinate system; the curve / tip sub-bone gizmo uses a **local frame** that follows the chain direction.

![Tip sub-bone gizmo local frame](devlog/assets/tip-gizmo-frame.png)

Three important axes (colors match the screenshot): **Green = Tangent (Y)** — along the tip chain / curve direction; **Red = Bitangent (X)** — lateral / width direction; **Blue = Normal (Z)** — perpendicular to the panel / curve surface. Width drag, rotation axes, and normal arrows all use this local frame.

## Child strands (low-poly watertight bridge)

![Low-poly child strand base mesh](devlog/assets/lowpoly-child-strand-basemesh.png)

The parent sheet is carved open and the child is joined through a low-poly watertight bridge (parent-hole boundary → child root ring → top/bottom bands + side quads): parent-surface Region selection (2D u/v panel + 3D markers), direct/indirect bridging, uniform smoothing (Strength/Detail); a child root-bone workflow (gizmo-carried twist, rigid Hierarchy (H) moves, region-anchored center). When the parent does not use topology connect (e.g. Split Geometry), the child falls back to direct generation. **UV layout is solved** (export-time unwrap + island packing into UDIM 1001, see "Export UV layout" below).

## Export UV layout (unwrapping)

![UV Checker preview (export packed layout)](devlog/assets/uv-checker.png)

On export (OBJ/USDA), rectangular UVs are generated from the sweep grid's `gridRow/gridCol` attributes (V-negative = hair tangent, so hair runs straight down), then each "parent + child / whole panel sheet" is treated as an island (`uvisland` index), scaled to uniform texel density, and packed into UDIM 1001 ([0,1]²) with an **alpaca occupancy-grid L-shape scan**:

- **Algorithm**: rasterize the tile (256 cells per UV unit) + integral-image O(1) occupancy test; a growing `scanLine` keeps a square frontier, with two-phase placement (first an L-shape scan to fill interior gaps, then expand the frontier only when nothing fits); then fit-to-tile (uniform scale + center, no normalize, no rotation). 8 deterministic shuffled orders pick the best (≈+7% fill vs a single greedy pass), giving panels and ordinary strands packed together, near-square bbox, no overlap and no fallback, ~0.76–0.81 fill.
- **Preview & speed**: the ⟳ button at the top of the UV Checker window runs the same export pipeline to preview the final layout in the viewport checker + 2D UV Inspector, no DCC import needed; packing is multi-threaded (worker pool), cutting export time substantially on large projects, and browsers without worker support fall back to single-threaded automatically with identical results.

References:

- Nöll, T., Stricker, D. (2011). *Efficient Packing of Arbitrary Shaped Charts for Automatic Texture Atlas Generation*. Eurographics. <https://www.semanticscholar.org/paper/Efficient-Packing-of-Arbitrary-Shaped-Charts-for-N%C3%B6ll-Stricker/643267eb8be94784f005a48c9ce1bdb716d1008f>
- TABI (2026). *Tight and Balanced Interactive Atlas Packing*. UBC/NVIDIA. <https://www.cs.ubc.ca/labs/imager/tr/2026/tabi/>
- Jylänki, J. *A Thousand Ways to Pack the Bin — A Practical Approach to Two-Dimensional Rectangle Bin Packing*. <http://clb.demon.fi/projects/more-rectangle-bin-packing>
- jpcy/xatlas — UV atlas library. <https://github.com/jpcy/xatlas>

## USDA skeleton / skin export

Tick **Bones & Capture Mesh** in the USDA export dialog (on by default) and you get a complete, usable USD rig:

- A single `def SkelRoot "Character"` holding one `def Skeleton "Hair_Skel"` and all skinned meshes — in Houdini, one `skelrootpath` in `USD Character Import` brings in the whole character at once; one empty `Hair_Root` joint is the single skeleton root (x = 0 centerline, positioned at the average of all hair roots), every strand's root joint hangs under it forming one connected joint tree, and joints are named after **the strand** (`${strandName}_${index}` / `_split_${k}` / `_split_${k}_tip_${j}`) with automatic de-duplication for same-named strands.
- Meshes carry `SkelBindingAPI`: `rel skel:skeleton` + `int[] primvars:skel:jointIndices` / `float[] primvars:skel:jointWeights` (with `elementSize`); panel segments use two influences, ordinary strands one, and bridged child-strand families 4-influence capture. `int[] primvars:uvisland` is written alongside (one island id per face, so a DCC can select islands by `@uvisland==k`).
- The dialog also offers a Path Prefix (the root name persists and is reused by quick export). OBJ shares the same pipeline but has no primvar mechanism, so it carries neither bones nor uvisland.

This rig has been validated in Houdini (joint hierarchy and names, rest vs bind transforms, skinned joint indices and weights).

## Known limitations

- **UV**: the packer is greedy (alpaca occupancy-grid L-shape scan + multi-start seed selection), fill ~0.76–0.81, no rotation (keeps the strand anisotropy direction); hairCard / curve-surface and other open/compound types are not packed yet.
- **Child bridging combined with multiple zippers**: when the parent is an ordinary strand cut into 3 or more tubes (2 or more zippers), the child no longer uses the carved watertight bridge and safely falls back to direct generation. Panels and strands with at most 2 tubes (≤1 zipper) are unaffected.
- **Still missing for multi-zipper strands**: snap-to-loops for zipper positions (a strand has no lengthwise loop topology to snap to, so this may stay unimplemented). The per-segment spread UI and the tip WidthCurve shipped in 0.2.125 and are no longer gaps.
- **Tip WidthCurve after Reset**: Reset makes the whole curve 1, so if the strand's global width curve is not 1 at the fork, a width step appears where the curve takes over. On a closed tube that can read as slight seam misalignment. Panels have always had the same tradeoff; changing it would be a design decision, so it is left as-is.

## Developer documentation

- New agent onboarding: [devlog/AGENT_QUICKSTART.md](devlog/AGENT_QUICKSTART.md); full devlog index: [devlog/README.md](devlog/README.md)

## License

Source-available (not OSI open source): personal / non-commercial use only; redistribution must include the LICENSE and retain the author's donation links.

