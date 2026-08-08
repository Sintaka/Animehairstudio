# Anime Hair Studio

**Anime Hair Studio** is a web-based animated hair-sheet production app for styling anime-style hair — draw and sculpt strands, braids, panels and more directly in the browser (3D viewport, scalp guides, clumps, materials, presets, OBJ/USDA export).

The original project was created by **Ludetools** and lives at [github.com/Ludetools/Animehairstudio](https://github.com/Ludetools/Animehairstudio). This repository keeps the original author's license.

## Using my code

This repository is a local adaptation of the original project. My own code changes usually live on **dev branches** (not `main`) — for example `codex/dev-local-adaptation`. If you want to use my code — whether by merging a branch or building something new on top of it (secondary development) — you can use it directly, **no permission needed**. I am committed to improving this open-source project to adapt it to Houdini workflows.

## What's changed (summary)

- **Quick Save (Ctrl+S) / Save as (Ctrl+Shift+S)** — Ctrl+S re-saves to the last saved project file; Save as picks a new location (File System Access API when available, download fallback otherwise).
- **Drag & drop project files** — dragging a `.ahs` / `.animehair.json` project onto the app opens it (no longer treated as a reference image); images still drop as 2D/3D references with the original drop overlay.
- **Sculpt brush selection mask** — with nothing selected, only visible hair can be sculpted; with a selection, only the selected hair is sculpted (invisible hair is never sculpted).
- **Material deletion** — delete extra materials via the panel button or the Delete key; affected hair reverts to the default material, which cannot be deleted.
- **Floating editors follow selection** — Strand Profile / Width-Depth Curve panels retarget to the newly selected strand; "show points on mesh" markers follow sculpting/moving.
- **Viewport navigation modes** — Default and Houdini (default). Houdini: Alt+Left = rotate, Alt+Middle = pan, Alt+Right = zoom (drag, normalized), scroll wheel = zoom.
- **Simplified Chinese (zh) UI** — full Simplified Chinese dictionary in Settings → Language (3D terms kept in English), on top of the original English/Japanese.
- **Low-poly child strands (子发片)** — draw branch strands off a parent and connect them through a carved parent region + watertight low-poly bridge (root ring, top/bottom bands, side quads) with uniform smoothing; child root-bone gizmo/twist/H-mode workflow; falls back to direct sweep when the parent doesn't use topology connect. UV layout is not solved yet.
- **Local dev server** — `start-dev-server.cmd` runs `python -m http.server 8080 --bind 127.0.0.1` and opens the default browser. Don't open `index.html` via `file://` (browser security blocks it).

## Low-poly child strands (子发片) — base mesh

![Low-poly child strand base mesh](devlog/assets/lowpoly-child-strand-basemesh.png)

> Base-mesh close-up of a child strand (子发片) in this fork: the parent hair is carved open and the child is joined by a low-poly watertight bridge (parent-hole boundary → child root ring → top/bottom bands + side quads). This fork supports the low-poly child-strand topology; **UV layout is not solved yet**.

- Parent-surface region selection (2D u/v panel + 3D markers), direct/indirect bridge, uniform smoothing (Strength/Detail).
- Child root-bone workflow: gizmo-carried twist, Hierarchy (H) rigid move with curvature swing, region-anchored center.
- When the parent does not use topology connect (e.g. Split Geometry), the child falls back to direct generation (sweep from its root).
- Detailed notes: `devlog/js-change-annotations.md` (Phase 2.x), `devlog/main-sync-conflicts.md`.

See `devlog/README.md` for detailed change annotations.
