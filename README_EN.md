# Anime Hair Studio

**English** | [中文](README.md)

**Anime Hair Studio** is a web-based animated hair-sheet production app for styling anime-style hair — draw and sculpt strands, braids, panels and more directly in the browser (3D viewport, scalp guides, clumps, materials, presets, OBJ/USDA export).

The original project was created by **Ludetools** and lives at [github.com/Ludetools/Animehairstudio](https://github.com/Ludetools/Animehairstudio). This repository keeps the original author's license.

## Using my code

This repository is a local adaptation of the original project. My own code changes usually live on **dev branches** (not `main`) — for example `codex/dev-local-adaptation`. If you want to use my code — whether by merging a branch or building something new on top of it (secondary development) — you can use it directly, **no permission needed**. I am committed to improving this open-source project to adapt it to Houdini workflows.

## What's changed (summary)

- **Quick Save (Ctrl+S) / Save as (Ctrl+Shift+S)** — Ctrl+S re-saves to the last saved project file; Save as picks a new location (File System Access API when available, download fallback otherwise). The File menu **removes** the 3 Local dev options (Local Save / Local Export to OBJ / Local Export to USDA, previously routed through the `server.js` local service), unifying save/export under the three new shortcuts. The File menu **adds** three save/export shortcuts: Ctrl+S Quick Save, Ctrl+Shift+S Save as, Ctrl+Alt+S Quick Export; save/export prefers the File System Access API to write directly to disk (remembered file handle, overwrites the same file, no more download (1) suffixes), falling back to a download/dialog when the browser doesn't support it. The shortcuts help has a dedicated "Sintaka Fork" section.
- **Drag & drop project files** — dragging a `.ahs` / `.animehair.json` project onto the app opens it (no longer treated as a reference image); images still drop as 2D/3D references with the original drop overlay.
- **Sculpt brush selection mask** — with nothing selected, only visible hair can be sculpted; with a selection, only the selected hair is sculpted (invisible hair is never sculpted).
- **Material deletion** — delete extra materials via the panel button or the Delete key; affected hair reverts to the default material, which cannot be deleted.
- **Floating editors follow selection** — Strand Profile / Width-Depth Curve panels retarget to the newly selected strand; "show points on mesh" markers follow sculpting/moving.
- **Viewport navigation modes** — Default and Houdini (default). Houdini: Alt+Left = rotate, Alt+Middle = pan, Alt+Right = zoom (drag, normalized), scroll wheel = zoom.
- **Simplified Chinese (zh) UI** — full Simplified Chinese dictionary in Settings → Language (3D terms kept in English), on top of the original English/Japanese.
- **Low-poly child strands** — draw branch strands off a parent and connect them through a carved parent region + watertight low-poly bridge (root ring, top/bottom bands, side quads) with uniform smoothing; child root-bone gizmo/twist/H-mode workflow; falls back to direct sweep when the parent doesn't use topology connect. UV layout is not solved yet.
- **Panel split tip sub-bones (发尖子骨骼 tip sub-bone)** — each split segment gets a full transform sub-bone (P / orient quaternion / per-segment spread + per-segment Width/Depth curves); viewport tip chain handles + highlight + normal arrows; rotate (E) / scale (R) attach to the transform gizmo; per-side tip WidthCurve (green control points, zipper-truncated, Segment Spread 0–0.99, Reset to all-1); per-vertex skin weights [mainJoint, segment, weight] with USDA SkelBindingAPI skinning.
- **Local dev server** — `start-dev-server.cmd` runs `python -m http.server 8080 --bind 127.0.0.1` and opens the default browser. Don't open `index.html` via `file://` (browser security blocks it).

## Low-poly child strands — base mesh

![Low-poly child strand base mesh](devlog/assets/lowpoly-child-strand-basemesh.png)

> Base-mesh close-up of a low-poly child strand in this fork: the parent hair is carved open and the child is joined by a low-poly watertight bridge (parent-hole boundary → child root ring → top/bottom bands + side quads). This fork supports the low-poly child-strand topology; **UV layout is not solved yet**.

- Parent-surface region selection (2D u/v panel + 3D markers), direct/indirect bridge, uniform smoothing (Strength/Detail).
- Child root-bone workflow: gizmo-carried twist, Hierarchy (H) rigid move with curvature swing, region-anchored center.
- When the parent does not use topology connect (e.g. Split Geometry), the child falls back to direct generation (sweep from its root).
- Detailed notes: `devlog/js-change-annotations.md` (Phase 2.x), `devlog/main-sync-conflicts.md`.

**New agent / developer onboarding:** start with [devlog/AGENT_QUICKSTART.md](devlog/AGENT_QUICKSTART.md) — it lists which code must be preserved and the decisions behind them. See [devlog/README.md](devlog/README.md) for the full devlog index and detailed change annotations.

## Panel split tip sub-bones

![Panel split tip sub-bone editing](devlog/assets/tip-subbone-width-curve.png)

Each split segment gets its own tip sub-bone. Selecting one in the viewport shows that segment's tip chain handles, highlight, and normal arrows. The green control points are the segment's tip WidthCurve — they only affect the width of the current tip; the upper part of the zipper follows the main bone (no splitting). Segment Spread controls how much the tip converges (0–0.99). Skin weights are divided along the top diagonal line of the zipper on each side, so the scale brush doesn't tear the low-zipper side apart. Under rotate (E) / scale (R) tools the tip sub-bone is attached to the transform gizmo.

Shortcuts:

- **Alt + Left-click** — quick-switch selection to the hovered tip sub-bone segment (or hovered strand). — same Alt+click pick / quick-switch habit as Zbrush
- **Ctrl + Left-drag on a green tip WidthCurve handle** — asymmetric width edit (only the dragged side); without Ctrl it mirrors both sides.
- **Ctrl + Left-drag elsewhere** — reverse / special: sculpt brushes act in reverse (Scale brush: default grows (root-anchored uniform), Ctrl shrinks; Cut·Extend default extends, Ctrl cuts); selection Ctrl+click removes from selection.

## Coordinate system & gizmo axes

The app uses Three.js's right-handed coordinate system; the curve / tip sub-bone gizmo uses a **local frame** that follows the chain direction.

![Tip sub-bone gizmo local frame](devlog/assets/tip-gizmo-frame.png)

Three important axes (colors match the screenshot): **Green = Tangent (Y)** — along the tip chain / curve direction; **Red = Bitangent (X)** — lateral / width direction; **Blue = Normal (Z)** — perpendicular to the panel / curve surface. Width drag, rotation axes, and normal arrows all use this local frame.

## Sculpt brushes

Four custom sculpt brushes:

- **Slide** — moves control points along the curve trajectory (tangent direction), restricted to the tangent/normal plane, without changing the curve's length proportion.
- **Push** — pushes along the local up direction (normal / away from the surface), restricted to normal-direction movement.
- **Orient** — rolls the section around the tangent, turning the section's normal (up direction) toward the viewport-orthogonal direction (changes tangent roll).
- **Scale** — two modes: **Scale** — root-anchored uniform radial scaling of the whole hair sheet (no movement); **Cut·Extend** — uniform parameter scaling of the whole sheet preserving point spacing (factor < 1 cuts, factor > 1 extends along the end tangent).

Ctrl = reverse on all brushes: Scale defaults to growing, Ctrl shrinks; Cut·Extend defaults to extending, Ctrl cuts.

## Known limitations

- **UV**: UV layout for child strands / bridge regions is not solved yet (not unwrapped); UVs can also be suboptimal under some panel structures.
- **Export**: USDA export is currently centered on NURBS curves (BasisCurves); **full USD skeletons are not exported yet (Skeleton / SkelBindingAPI skin binding)** — bone/skin data is not yet exported as a usable skeleton.

## Local deployment

1. Install Python 3.
2. In the project root, run `python -m http.server 8080 --bind 127.0.0.1`.
3. Open `http://127.0.0.1:8080/` in your browser.
4. Or just double-click `start-dev-server.cmd` (it opens the browser automatically).
5. Don't open `index.html` directly via `file://` — browser security restrictions block module loading.

Alternatively (requires Node.js): the built-in static server also doubles as a proxy for the native save dialog — run `node server.js` in the project root and open `http://127.0.0.1:5173/` (change the port with `PORT=xxxx node server.js`, or `$env:PORT=xxxx; node server.js` in Windows PowerShell). You can also use the generic npm static server: `npx http-server . -p 8080`.
