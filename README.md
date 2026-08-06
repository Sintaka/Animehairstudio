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
- **Local dev server** — `start-dev-server.cmd` runs `python -m http.server 8080 --bind 127.0.0.1` and opens the default browser. Don't open `index.html` via `file://` (browser security blocks it).

See `devlog/README.md` for detailed change annotations.
