import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("static JavaScript control references exist in the HTML", async () => {
  const [html, source, favicon] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../favicon.svg", import.meta.url), "utf8")
  ]);
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\.\/favicon\.svg" \/>/);
  assert.match(favicon, /<svg[\s\S]*stroke="#58f6ff"/);
  const htmlIds = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = htmlIds.filter((id, index) => htmlIds.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], [], "HTML IDs must be unique");
  const idSet = new Set(htmlIds);
  const referencedIds = [...source.matchAll(/querySelector\(["']#([A-Za-z0-9_-]+)["']\)/g)].map((match) => match[1]);
  const optionalControls = new Set(["curveLatticeToggle"]);
  const missing = [...new Set(referencedIds.filter((id) => !idSet.has(id) && !optionalControls.has(id)))];
  assert.deepEqual(missing, [], `Missing controls: ${missing.join(", ")}`);
});

test("curve surface tool exposes incremental strip controls and confirmation flow", async () => {
  const [html, source, css, projectState, curveSurfaceCreate, strandGeometry] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-surface-create.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/strand-geometry.js", import.meta.url), "utf8")
  ]);
  assert.doesNotMatch(html, /data-tool="curve-surface"[^>]*title="Draw Curve Surface"/);
  assert.match(html, /id="curveSurfaceToolPanel"/);
  assert.match(html, /id="curveSurfaceStripWidth"/);
  assert.doesNotMatch(html, /id="curveSurfaceThickness"/);
  assert.doesNotMatch(html, /id="curveSurfaceSurface"/);
  assert.match(html, /id="drawStrandSurface"/);
  assert.match(html, /id="confirmCurveSurfaceDraft"[^>]*disabled[^>]*>Confirm Shape</);
  assert.match(html, /id="resetCurveSurfaceDraft"/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function beginCurveSurfaceStroke\(event, hit\)/);
  assert.match(html, /Hold Shift to constrain a curve to eight directions while it conforms to the live surface/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function curveSurfaceStrokeEvent\(stroke, event\)[\s\S]*eightWayScreenDelta\([\s\S]*cardinalDirectionKey/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function updateCurveSurfaceStroke\(event\)[\s\S]*curveSurfaceStrokeEvent\(stroke, event\)[\s\S]*drawSurfaceHitFromEvent\(sampleEvent\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function updateCurveSurfacePreview\(\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function unifiedMirroredCurveSurface\(controllerCurves, controllerNormals = \[\], sourceCenterIndex = 0\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /const unifiedPreview = unifiedMirroredCurveSurface\(grid\.orderedCurves, \[\], previewCenterIndex\)/);
  assert.match(source, /if \(sel\.state\.activeTool === "curve-surface"\) curveSurfaceCreate\.updateCurveSurfacePreview\(\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function confirmCurveSurfaceDraft\(\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function curveSurfaceFallbackHit\([\s\S]*surfaceMode = deps\.activeStrokeSurfaceValue\(\)[\s\S]*dynamic = deps\.activeStrokeDynamicEnabled\(surfaceMode\)/);
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerup", curveSurfaceCreate\.finishCurveSurfaceStroke, true\)/);
  assert.match(source, /event\.key === "Enter" && sel\.state\.activeTool === "curve-surface" && curveSurfaceCreate\.commitCurveSurfaceDraft\(event\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function commitCurveSurfaceDraft\(event = null\)[\s\S]*finishCurveSurfaceStroke\(event\)[\s\S]*confirmCurveSurfaceDraft\(\)/);
  assert.match(source, /confirmCurveSurfaceDraftButton\.addEventListener\("click"/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /document\.activeElement\.blur\?\.\(\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /curveSurfaceDraft\.curves\.push\(points\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /const confirmedControlRows = curveSurfaceControlPointCount\(grid\.orderedCurves\)[\s\S]*resampleCurveSurfaceLine\(curve, confirmedControlRows\)[\s\S]*curveSurfaceColumns: controllerCurves\.length[\s\S]*curveSurfaceRows: confirmedControlRows[\s\S]*points: controllerPoints/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function curveSurfaceProfileNormals\(samples\)[\s\S]*sample\.onSurface[\s\S]*strokeSurfaceNormals/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /orderedSourceIndices = grid\.sourceColumns[\s\S]*authoredControllerNormals = orderedSourceIndices\.map[\s\S]*drawClumpSampleNormal[\s\S]*pointSurfaceNormals: controllerNormals\.flat\(\)/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /const renderRows = THREE\.MathUtils\.clamp\([\s\S]*Number\(lock\.lengthSegments\)[\s\S]*geometry\.userData\.actualLengthSegments = Math\.max\(0, grid\.rows - 1\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /candidateGrid\.rejectedCurveIndices\.includes\(candidateIndex\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /lock\.curveSurfaceSource = \{[\s\S]*controllerCurves\.map\(\(curve, index\)[\s\S]*attachment:[\s\S]*column: index/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /const unifiedSurface = unifiedMirroredCurveSurface\([\s\S]*authoredControllerCurves,[\s\S]*authoredControllerNormals,[\s\S]*sourceCenterIndex[\s\S]*curveSurfaceColumns: controllerCurves\.length/);
  assert.doesNotMatch(source, /function confirmCurveSurfaceDraft\(\)[\s\S]*createMirrorPartnerForNewLock\(lock\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /const midlineAligned = event\.shiftKey && Math\.abs\(event\.clientX - viewportMidlineX\) <= 6/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /curveSurfaceSymmetric: deps\.sculptState\.mirrorXEditing/);
  assert.match(source, /function syncUnifiedCurveSurfaceMirror\(lock, sourcePointIndex, tool = sel\.state\.activeTool\)/);
  assert.match(source, /curveSurfaceMirroredPointIndex\(lock, index\)[\s\S]*lock\.points\[mirroredIndex\]\.set\(-point\.x, point\.y, point\.z\)/);
  assert.match(source, /curveSurfaceSymmetric: lock\.geometryType === "curve-surface" && Boolean\(lock\.curveSurfaceSymmetric\)/);
  assert.match(source, /curveSurfaceSymmetric: snapshot\.geometryType === "curve-surface" && Boolean\(snapshot\.curveSurfaceSymmetric\)/);
  assert.match(source, /curveSurfaceSource: curveSurfaceCreate\.curveSurfaceSourceForSnapshot\(lock\)/);
  assert.match(source, /curveSurfaceSource: curveSurfaceCreate\.cloneCurveSurfaceSource\(snapshot\.curveSurfaceSource\)/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /function createConnectedCurveCardGeometry\(lock\)[\s\S]*geometry\.userData\.quadFaces = quadFaces[\s\S]*geometry\.userData\.openSurface = true/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /lock\.geometryType === "curve-surface"[\s\S]*curveSurfaceControllerCurves\(lock\)/);
  assert.match(source, /function createOutlinerCurveSurface\(lock\)[\s\S]*outliner-curve-surface[\s\S]*Curve \$\{controllerIndex \+ 1\}[\s\S]*curveSurfaceControllerIndex: controllerIndex/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function activeCurveSurfaceControllerIndex\(lock\)[\s\S]*selectedCurveSurfaceController/);
  assert.match(source, /activeCurveSurfaceControllerIndex\(lock\)[\s\S]*Math\.floor\(index \/ lock\.curveSurfaceRows\) === controllerIndex/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function curveSurfaceControllerHitFromEvent\(event, lock = deps\.getSelectedLock\(\)\)[\s\S]*raycaster\.intersectObject\(lock\.curveObjects\.line, false\)[\s\S]*curveSurfaceControllerIndexNearPoint/);
  assert.match(source, /curveSurfaceControllerHitFromEvent\(event[\s\S]*curveSurfaceControllerIndex: curveSurfaceControllerHit\.controllerIndex/);
  assert.match(source, /curveSurfaceControllerSegments\(\s*lock\s*\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function sampledCurveSurfaceControllerSides\(lock, rowCount\)[\s\S]*deps\.strandGeometryFrameAt\(controllerLock, curve[\s\S]*frame\.x\.clone\(\)\.negate\(\)/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate, /function curveSurfaceControllerFrameLock\(lock, controllerIndex[\s\S]*curveSurfaceControllerSideDirections\(controllerCurves, side\)[\s\S]*crossVectors\(tangent, localSide\)[\s\S]*pointSurfaceNormals: controllerNormals,[\s\S]*surfaceNormalInfluence: 1/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /buildConnectedCurveCardGrid\(controllers,[\s\S]*controllerSides/);
  assert.match(source, /function curveFrameAtPoint\(lock, pointIndex\)[\s\S]*curveSurfaceControllerFrameLock\(lock, controllerIndex\)[\s\S]*transportedStrandFrameAt/);
  assert.match(source, /unsupportedCurveSurfaceTool[\s\S]*\["scale", "relax"\]\.includes\(tool\)/);
  assert.match(source, /componentEditModeActive\(\)[\s\S]*controllerVisible[\s\S]*lock\.id === sel\.state\.selectedId[\s\S]*\["rotate", "relax"\]\.includes\(sel\.state\.activeTool\)/);
  // moved to modules/io/project-state.js
  assert.match(projectState, /createProjectSelectionSnapshot\(\{[\s\S]*selectedCurveSurfaceController/);
  assert.match(projectState, /selectedCurveSurfaceController: cloneOptionalRecord\(selectedCurveSurfaceController\)/);
  assert.match(css, /\.outliner-curve-surface \.outliner-folder-icon[\s\S]*\.curve-surface-controller-icon/);
});

test("full body mesh import is available in File and Edit Head with seven-head scalp-top fitting", async () => {
  const [html, source, localization, referenceHead, ioTail, scalpBuilder] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/io-tail.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="importFullBodyMeshMenu"[^>]*role="menuitem"[\s\S]*Import Full Body Mesh/);
  assert.match(html, /id="fullBodyMeshFile"[^>]*accept="\.obj,model\/obj,text\/plain"/);
  assert.match(html, /id="headPanel"[\s\S]*id="importFullBodyMesh"[\s\S]*Import Full Body Mesh/);
  assert.match(source, /const FULL_BODY_HEAD_COUNT = 7/);
  assert.match(source, /const FULL_BODY_TARGET_HEIGHT = GUIDE_HEAD_TARGET_HEIGHT \* FULL_BODY_HEAD_COUNT/);
  assert.match(source, /const FULL_BODY_FRAME_BOTTOM_MARGIN = GUIDE_HEAD_TARGET_HEIGHT \* 0\.9/);
  // moved to modules/scene/reference-head.js
  assert.match(
    referenceHead,
    /function installGuideModel\(obj, options = \{\}\)[\s\S]*fullBody \? size\.y[\s\S]*FULL_BODY_TARGET_HEIGHT \/ sourceSize[\s\S]*scalpBounds\.max\.y - \(size\.y \* scale \* 0\.5\)/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /fit: "full-body"/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /project\.headAsset\.fit === "full-body"/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /restoreState\(project\.state\);[\s\S]*realignFullBodyGuideToScalpTop\(\)/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /function fullBodyScalpFocusBounds\(\)[\s\S]*activeScalpSurfaceMesh\(\)[\s\S]*bounds\.min\.y -= deps\.FULL_BODY_FRAME_BOTTOM_MARGIN/
  );
  // moved to modules/io/io-tail.js
  assert.match(
    ioTail,
    /deps\.restoreState\(project\.state\);[\s\S]*deps\.scalpBuilder\.realignFullBodyGuideToScalpTop\(\);[\s\S]*deps\.frameViewportBounds\(deps\.scalpBuilder\.fullBodyScalpFocusBounds\(\)\)/
  );
  assert.match(
    source,
    /function cycleViewportFraming\(\) \{[\s\S]*fullBodyReference[\s\S]*frameViewportBounds\(scalpBuilder\.fullBodyScalpFocusBounds\(\)\)/
  );
  assert.match(source, /importFullBodyMeshMenu\.addEventListener\("click"/);
  assert.match(source, /fullBodyMeshFileInput\.addEventListener\("change"/);
  assert.match(localization, /"Import Full Body Mesh":/);
});

test("Preview menu exposes a transient turntable with contextual speed controls", async () => {
  const [html, source, styles] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="previewMenuToggle"[\s\S]*>Preview<\/button>/);
  assert.match(html, /id="toggleTurntable"[\s\S]*aria-pressed="false"[\s\S]*>[\s\S]*Turntable/);
  assert.match(html, /id="turntablePanel"[^>]*data-attribute-panel="tools"/);
  assert.match(html, /id="turntableSpeed"[^>]*min="0\.1"[^>]*max="3"[^>]*value="1"/);
  assert.match(source, /function setTurntableActive\(enabled\)[\s\S]*turntablePanel\.classList\.toggle\("hidden", !viewportState\.state\.turntableActive\)/);
  assert.match(source, /TURNTABLE_RADIANS_PER_SECOND \* viewportState\.state\.turntableSpeed \* deltaSeconds/);
  assert.match(source, /viewportState\.state\.turntableActive && !sculptState\.state\.altOrbitDrag && !sculptState\.state\.viewSnapDrag/);
  assert.doesNotMatch(source, /turntableActive[\s\S]{0,100}(?:captureState|restoreState|createHairProject)/);
  assert.match(styles, /#turntablePanel\.hidden,[\s\S]*#strandShapePanel\.hidden/);
});

test("strand selection modifiers add with Shift and remove with Ctrl", async () => {
  const [source, selectionState] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/selection-state.js", import.meta.url), "utf8")
  ]);

  assert.match(
    selectionState,
    /selectionMode === "add" \|\| selectionMode === "remove"[\s\S]*selectionMode === "remove"[\s\S]*nextIds\.delete\(id\)[\s\S]*nextIds\.add\(id\)/
  );
  assert.match(
    source,
    /event\.shiftKey && !event\.ctrlKey && !event\.altKey[\s\S]*\? "add"[\s\S]*event\.ctrlKey && !event\.shiftKey && !event\.altKey[\s\S]*\? "remove"/
  );
  assert.match(
    source,
    /const addingSelection = event\.shiftKey[\s\S]*const removingSelection = event\.ctrlKey[\s\S]*beginSelectionMarquee\(event, selectedSurface, addingSelection \? "add" : "remove"\)/
  );
  assert.match(
    source,
    /function beginSelectionMarquee\(event, surface = null, selectionMode = "replace"\)[\s\S]*selectionMode === "add"[\s\S]*selectionMode === "remove"[\s\S]*selectionMode,/
  );
  assert.match(source, /function selectPointsInMarquee\(drag\)[\s\S]*drag\.selectionMode === "add"[\s\S]*drag\.selectionMode === "remove"/);
  assert.match(
    source,
    /function selectObjectsInMarquee\(drag\)[\s\S]*requestedId: matches\[0\]\.id,[\s\S]*requestedIds: matches\.map[\s\S]*selectionMode: drag\.selectionMode/
  );
  assert.doesNotMatch(source, /toggleSelection/);
});

test("strand selection refreshes derived consumers through one coordinator", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(
    source,
    /function refreshStrandSelectionConsumers\(\{[\s\S]*updateGeometry = false[\s\S]*updateTopology = false[\s\S]*syncActiveInputs = false[\s\S]*resetGuideSelectionVisuals\(\)[\s\S]*updateStrandSelectionHighlight\(\)[\s\S]*refreshStrandCurveSelectionVisuals\(\)[\s\S]*transformControls\.detach\(\)[\s\S]*updateLockGeometry\(item\)[\s\S]*renderLockList\(\)[\s\S]*updateAttributeEditorMode\(\)[\s\S]*updateGuideControlsVisibility\(\)[\s\S]*updateSelectedPointLabel\(\)[\s\S]*updateTopologyStats\(\)[\s\S]*refreshRebuildCurveDialog\(\)[\s\S]*rebuildProceduralDuplicatePreview\(\{ updateSources: true \}\)[\s\S]*syncInputs\(lock\)/
  );
  assert.match(
    source,
    /function refreshStrandCurveSelectionVisuals\(\)[\s\S]*sculptState\.state\.viewportEditMode === "strand"[\s\S]*!componentEditModeActive\(\)[\s\S]*!sculptBrushToolActive\(\)[\s\S]*lock\.curveObjects\?\.group[\s\S]*group\.visible = false[\s\S]*updateCurveObjects\(item, \{ visible: item\.id === sel\.state\.selectedId \}\)/
  );
  assert.match(
    source,
    /function selectLock\(id, options = \{\}\)[\s\S]*refreshStrandSelectionConsumers\(\{\s*syncActiveInputs: true\s*\}\)/
  );
  assert.doesNotMatch(source, /function selectLock\(id, options = \{\}\)[\s\S]*?refreshStrandSelectionConsumers\(\{[\s\S]*?updateGeometry: true/);
  assert.match(
    source,
    /function deselectStrands\(\)[\s\S]*refreshStrandSelectionConsumers\(\{ updateTopology: true \}\)/
  );
});

test("strand locks persist and block viewport selection, transforms, and sculpt editing", async () => {
  const [html, source, registry, sculptGeometry, radialMenu] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/shortcut-registry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8")
  ]);

  assert.match(source, /function strandAvailableForViewportInteraction\(lock\) \{[\s\S]*strandVisibleForDisplay\(lock\) && !lock\.locked/);
  assert.match(source, /function selectObjectsInMarquee\(drag\)[\s\S]*strandAvailableForViewportInteraction\(lock\)/);
  assert.match(source, /locks\.filter\(strandAvailableForViewportInteraction\)\.map\(\(lock\) => lock\.mesh\)/);
  assert.match(source, /function attachStrandObjectTransform\(\)[\s\S]*\|\| lock\.locked/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushEditableLock\(lock\)[\s\S]*&& !lock\.locked/);
  assert.match(source, /name: lock\.name,[\s\S]*locked: Boolean\(lock\.locked\)[\s\S]*function restoreLock\(snapshot,[\s\S]*locked: Boolean\(snapshot\.locked\)/);
  assert.match(source, /function lockStrands\(targets\)[\s\S]*pushUndoState\(\)[\s\S]*lock\.locked = true[\s\S]*deselectStrands\(\)/);
  assert.match(source, /function lockSelectedStrands\(\)[\s\S]*selectedLocksInOrder\(\)[\s\S]*lockStrands\(targets\)/);
  assert.match(source, /function unlockStrands\(targets\)[\s\S]*pushUndoState\(\)[\s\S]*lock\.locked = false/);
  assert.match(source, /function unlockAllStrands\(\) \{[\s\S]*unlockStrands\(locks\)/);
  assert.match(source, /event\.key\.toLowerCase\(\) === "l"[\s\S]*selectedLocksInOrder\(\)\.length[\s\S]*lockSelectedStrands\(\)[\s\S]*unlockAllStrands\(\)/);
  assert.match(registry, /APPLICATION_SHORTCUT_KEYS[\s\S]*"l"/);
  assert.match(html, /<kbd>L<\/kbd><span>Lock selected strands; unlock all when none are selected<\/span>/);
  // The Ctrl+H "Hide selected strands" row was removed from the shortcuts dialog;
  // hide/unhide now flows through the strand radial menu (covered by the strand
  // radial menus test) with Ctrl+H handling in app.js.
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /kind === "locking-submenu"[\s\S]*Lock Selected Strands[\s\S]*Unlock All Strands/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /kind === "root"[\s\S]*lockedStrandsExist\(\)[\s\S]*unlock-all-strands/);
  assert.match(source, /function strandViewportBaseColor\(lock\) \{[\s\S]*lock\.locked[\s\S]*strandDisplayColor\(lock\)[\s\S]*0x747780[\s\S]*0\.18/);
  assert.match(source, /function applyLockedStrandPalette\(material\)[\s\S]*ANIME_ANISOTROPIC_SHADER[\s\S]*uShadowColor[\s\S]*uHighlightColor[\s\S]*uRimColor/);
  assert.match(source, /function setStrandSelectionVisual\(lock\)[\s\S]*setAnimeHairBaseColor\(material, strandViewportBaseColor\(lock\)\)[\s\S]*lock\.locked[\s\S]*applyLockedStrandPalette\(material\)/);
  assert.match(source, /function unlockStrands\(targets\)[\s\S]*lock\.locked = false[\s\S]*updateStrandSelectionHighlight\(\)/);
  assert.match(source, /function createHairTopologyOverlay\(sourceGeometry\)[\s\S]*fwidth\(vBarycentric\) \* 1\.25[\s\S]*smoothstep\(vec3\(0\.0\), edgeWidth, vBarycentric\)/);
  assert.match(source, /function syncLockedStrandWireVisual\(lock\)[\s\S]*0xff4fd8[\s\S]*lock\.locked \? 0\.25 : 0\.72[\s\S]*lock\.locked \|\| hairState\.state\.hairTopologyVisible/);
  assert.doesNotMatch(source, /uniform float dotted|uniforms\.dotted/);
  assert.match(html, /id="lockOutlinerAction"[\s\S]*Lock Region/);
  assert.match(source, /function outlinerLockTargets\(target = sel\.state\.outlinerContextTarget\)[\s\S]*target\?\.type === "strand"[\s\S]*strand-region[\s\S]*strand-layer[\s\S]*normalizeHairLayer\(lock\.hairLayer\)/);
  assert.match(source, /header\.addEventListener\("contextmenu"[\s\S]*type: "strand-region"[\s\S]*layerHeader\.addEventListener\("contextmenu"[\s\S]*type: "strand-layer"/);
  assert.match(source, /const unlockTargets = lockTargets\.length > 0 && lockTargets\.every\(\(lock\) => lock\.locked\)[\s\S]*`\$\{lockActionVerb\} Strand`[\s\S]*`\$\{lockActionVerb\} Strands`[\s\S]*`\$\{lockActionVerb\} Layer`[\s\S]*`\$\{lockActionVerb\} Region`/);
  assert.match(source, /lockOutlinerAction\.addEventListener\("click"[\s\S]*outlinerLockTargets\(\)[\s\S]*targets\.every\(\(lock\) => lock\.locked\)[\s\S]*unlockStrands\(targets\)[\s\S]*lockStrands\(targets\)/);
});

test("Layered Side Bun is bundled as a clean human-authored full-hair preset", async () => {
  const [html, source, presetText, preview, presetLibrary] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/presets/layered-side-bun.ahs", import.meta.url), "utf8"),
    readFile(new URL("../assets/presets/layered-side-bun-preview.png", import.meta.url)),
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8")
  ]);
  const preset = JSON.parse(presetText);

  assert.equal(preset.format, "anime-hair-studio-project");
  assert.equal(preset.version, 1);
  assert.equal(preset.metadata.name, "Layered Side Bun");
  assert.equal(preset.metadata.authoredBy, "human");
  assert.equal(preset.state.locks.length, 88);
  assert.deepEqual([...preview.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.match(
    source,
    /\["layered-side-bun", "\.\/assets\/presets\/layered-side-bun\.ahs\?v=20260730-1"\]/
  );
  assert.match(
    source,
    /previewImage: "\.\/assets\/presets\/layered-side-bun-preview\.png\?v=20260730-1"/
  );
  // moved to modules/io/preset-library.js
  assert.match(
    presetLibrary,
    /const presetState = catalogPreset\?\.omitAuthoringAids[\s\S]*referenceImages: \[\], guides: \[\][\s\S]*restoreState\(presetState/
  );
  const presetCatalogSource = source.match(/const presetCatalog = \[([\s\S]*?)\];/)?.[1] || "";
  assert.doesNotMatch(presetCatalogSource, /id: "(?:braided-buns|braided-bob|long-layered-curls|bowl-cut|generated-bangs|front|side|back|twin|ahoge)"/);
  assert.doesNotMatch(html, /id="presetPanel"|id="addLock"/);
});

test("tool presets capture brush settings and persist named records in browser storage", async () => {
  const [html, source, presetLibrary, creationPresets] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/creation-presets.js", import.meta.url), "utf8")
  ]);
  assert.match(
    html,
    /class="creation-preset-row"[\s\S]*id="drawBrushPreset"[\s\S]*id="saveStrandToolPreset"[\s\S]*id="removeStrandToolPreset"[^>]*disabled/
  );
  assert.match(html, /id="removeBraidToolPreset"[^>]*disabled/);
  assert.doesNotMatch(html, /id="strandToolPreset"/);
  assert.doesNotMatch(source, /strandToolPresetInput/);
  // moved to modules/io/preset-library.js
  assert.match(
    presetLibrary,
    /function populateDrawBrushPresetSelect\([\s\S]*Custom Presets[\s\S]*customCreationPresets\.strand/
  );
  assert.match(html, /id="creationPresetDialog"[\s\S]*id="creationPresetName"/);
  assert.match(
    html,
    /id="removeCreationPresetDialog"[\s\S]*id="removeCreationPresetMessage"[\s\S]*id="confirmRemoveCreationPreset"/
  );
  assert.match(source, /CREATION_PRESET_STORAGE_KEY = "anime-hair-studio-creation-presets-v1"/);
  // moved to modules/io/creation-presets.js
  assert.match(
    creationPresets,
    /function creationToolSettingsSnapshot\(type\)[\s\S]*toolSize[\s\S]*smoothing[\s\S]*curveStep[\s\S]*scalpOffset[\s\S]*surfaceNormalInfluence/
  );
  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /toolSettings: deps\.creationPresets\.creationToolSettingsSnapshot\(type\)/);
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /localStorage\.setItem\(deps\.CREATION_PRESET_STORAGE_KEY/);
  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /function syncCreationPresetRemoveButtons\(\)[\s\S]*startsWith\("custom:"\)/);
  // moved to modules/io/preset-library.js
  assert.match(
    presetLibrary,
    /function commitRemoveCreationPreset\(\)[\s\S]*removeToolPreset\([\s\S]*saveCustomCreationPresets\(\)[\s\S]*removeCreationPresetDialog\.close\(\)/
  );
});

test("strand profile, width, and depth curves support browser-persisted custom presets", async () => {
  const [html, source, css, presetLibrary, shapePresets] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/shape-presets.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /data-shape-preset="sweepProfile"/);
  assert.match(html, /data-shape-preset="taperCurve"/);
  assert.match(html, /data-shape-preset="depthCurve"/);
  assert.match(source, /SHAPE_PRESET_STORAGE_KEY = "anime-hair-studio-shape-presets-v1"/);
  // moved to modules/io/preset-library.js
  assert.match(
    presetLibrary,
    /function setupShapePresetControls\(\)[\s\S]*shape-preset-action[\s\S]*openSaveShapePreset\(select\)[\s\S]*openRemoveShapePreset\(select\)/
  );
  // moved to modules/io/preset-library.js
  assert.match(
    presetLibrary,
    /function commitCustomShapePreset\(\)[\s\S]*secondaryValue:[\s\S]*asymmetric:[\s\S]*saveCustomShapePresets\(\)/
  );
  // moved to modules/io/shape-presets.js
  assert.match(
    shapePresets,
    /function applyShapePreset\(select\)[\s\S]*target\[taperSecondaryKey\(key\)\][\s\S]*target\[taperAsymmetryKey\(key\)\]/
  );
  assert.doesNotMatch(html, /id="shapePresetShareDialog"|id="shapePresetPasteText"|id="copyShapePresetShare"/);
  assert.doesNotMatch(source, /openShapePresetShare|serializeShapePresetShareText|parseShapePresetShareText/);
  assert.match(css, /\.shape-preset-picker\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) 30px 30px[\s\S]*gap:\s*5px/);
  assert.match(css, /\.shape-preset-action\s*\{[\s\S]*width:\s*30px;[\s\S]*height:\s*36px;[\s\S]*padding:\s*0;[\s\S]*font-size:\s*18px/);
  assert.doesNotMatch(css, /shape-preset-share|shape-preset-paste/);
});

test("capsule guides expose persistent editable names and colors", async () => {
  const [html, source, guideSystem] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="surfaceGuideToolPanel"[\s\S]*id="surfaceGuideName"[^>]*maxlength="60"[\s\S]*id="surfaceGuideColor"[^>]*type="color"/);
  assert.match(html, /id="surfaceGuideCenterVisibility"[^>]*value="0\.5"[\s\S]*id="surfaceGuideCenterVisibilityValue"[^>]*>0\.50</);
  assert.match(source, /const DEFAULT_CAPSULE_GUIDE_COLOR = "#70b6bd"/);
  assert.match(source, /const surfaceGuideDefaults = \{[\s\S]*centerVisibility: 0\.5/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /guide\.centerVisibility \?\? 0\.5/);
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function addCapsuleGuide\(overrides[\s\S]*name: normalizeCapsuleGuideName\(overrides\.name, fallbackName\)[\s\S]*color: normalizeCapsuleGuideColor\(overrides\.color\)/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function updateCapsuleGuideDisplayColor\(guide\)[\s\S]*guide\.wire\?\.material\.color[\s\S]*guide\.controlWire\?\.material\.color[\s\S]*updateCapsuleGuideHandleColors[\s\S]*refreshCapsuleGuideFillInfluence/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /const base = capsuleGuideAccentColor\(guide\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function syncGuideInputs\(guide\)[\s\S]*surfaceGuideNameInput\.value = guide\.name[\s\S]*surfaceGuideColorInput\.value = normalizeCapsuleGuideColor\(guide\.color\)/
  );
  assert.match(
    source,
    /surfaceGuideNameInput\.addEventListener\("change"[\s\S]*normalizeCapsuleGuideName[\s\S]*renderGuideOutliner\(\)[\s\S]*refreshLiveSurfaceOptions\(\)/
  );
  assert.match(
    source,
    /surfaceGuideColorInput\.addEventListener\("input"[\s\S]*normalizeCapsuleGuideColor[\s\S]*updateCapsuleGuideDisplayColor\(guide\)[\s\S]*renderGuideOutliner\(\)/
  );
  assert.match(source, /name: guide\.name,\s*color: guideApi\.normalizeCapsuleGuideColor\(guide\.color\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /icon\.style\.background = normalizeCapsuleGuideColor\(guide\.color\)/);
});

test("capsule guides can be drawn as curved live-surface cages", async () => {
  const [html, source, guideSystem] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8")
  ]);
  assert.match(html, /id="drawCapsuleGuideMode"[\s\S]*Draw Capsule Guide/);
  assert.match(html, /id="viewportDrawCapsuleGuideTool"[^>]*data-tool="draw-capsule-guide"/);
  assert.match(html, /id="capsuleGuideDrawSettings"[\s\S]*id="capsuleGuideCurveStep"[\s\S]*id="capsuleGuideProfileRoot"[\s\S]*id="capsuleGuideProfileMiddle"[\s\S]*id="capsuleGuideProfileTip"/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function beginCapsuleGuideDrawStroke\(event, hit\)[\s\S]*drawSurfaceHitFromEvent/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function createCapsuleGuideAlongCurve\(samples\)[\s\S]*Math\.ceil\(authoredLength \/ curveStep\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function createCapsuleGuideAlongCurve\(samples\)[\s\S]*curveDeformedCapsulePoints\(\{[\s\S]*radialProfile,[\s\S]*capAtEnd: true[\s\S]*addCapsuleGuide/);
  assert.match(source, /if \(key === "radius"\)[\s\S]*scaleCapsuleRadialLoops\([\s\S]*guide\.controlLoops[\s\S]*updateCapsuleGuideGeometry\(guide, \{ preserveControlPoints: true \}\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function updateCapsuleGuideGeometry\(guide,[\s\S]*const minimumLength = 0\.04;/);
  assert.doesNotMatch(source, /guide\.controlPoints\.forEach\(\(point\) => \{\s*point\.x \*= radiusScale;\s*point\.z \*= radiusScale;/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function finishCapsuleGuideDrawStroke\(event, \{ cancel = false \} = \{\}\)[\s\S]*pushUndoState\(\)[\s\S]*createCapsuleGuideAlongCurve/);
  assert.match(source, /controlPoints: guide\.controlPoints\?\.map\(vectorToData\)[\s\S]*controlFaces: guide\.controlFaces/);
});

test("standalone curve lattice guides are available while surface experiments remain retired", async () => {
  const [html, source, localization, css, guideSystem, drawFlow, scalpBuilder] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="curveLatticeGuideMode"[^>]*role="menuitem"/);
  assert.doesNotMatch(html, /id="curveLatticeGuideMode"[^>]*(?:retired-experiment|hidden|aria-hidden="true")/);
  assert.match(
    html,
    /id="viewportCurveLatticeGuideTool"[^>]*class="tool-button guide-toolbar-tool hidden"[^>]*aria-pressed="false"/
  );
  assert.match(
    html,
    /id="curveLatticeControls"[\s\S]*Horizontal Loops[\s\S]*id="curveLatticeHorizontalLoops"[\s\S]*Vertical Loops[\s\S]*id="curveLatticeVerticalLoops"/
  );
  assert.doesNotMatch(html, /id="curveLatticeControls"[^>]*retired-experiment/);
  assert.doesNotMatch(html, /curveLatticeBottomExtrude|curveLatticeBottomRows|Bottom Extrude|Extrude Loops/);
  assert.match(
    source,
    /function createStandaloneCurveLatticeGuide\(\) \{\s*if \(!CURVE_LATTICE_FEATURE_ENABLED\) return null;[\s\S]*columns = DEFAULT_CURVE_LATTICE_PLANE\.columns[\s\S]*standalone:\s*true/
  );
  assert.match(
    source,
    /function createCurveLatticeGuideFromUi\(\) \{\s*if \(!CURVE_LATTICE_FEATURE_ENABLED\) return;[\s\S]*createStandaloneCurveLatticeGuide\(\)/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function resampleCurveLatticeGuide\([\s\S]*resampleCurveLatticePointData[\s\S]*rebuildCurveLatticeHandles\(guide\)[\s\S]*updateCurveLatticeGeometry\(guide\)/
  );
  assert.doesNotMatch(
    source,
    /curveLatticeBottomExtrude|curveLatticeBottomRows|bottomExtrude|bottomRows|bottomPoints|bottomMesh|bottomWire/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function addCurveLattice\(overrides[\s\S]*standalone = Boolean\(overrides\.standalone\)[\s\S]*standalone \? flatCurveLatticePoints\(columns, rows\)[\s\S]*scalpRegion = standalone \? "unassigned"[\s\S]*outlinerVisible: overrides\.outlinerVisible !== false[\s\S]*\(!CURVE_LATTICE_FEATURE_ENABLED \|\| !deps\.REGION_CURVE_VISUALIZATION_ENABLED\)[\s\S]*&& !guide\.standalone/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function outlinerGuides\(\)[\s\S]*CURVE_LATTICE_FEATURE_ENABLED && guide\.standalone/);
  assert.match(source, /guides: guides\.map\(\(guide\) => guide\.type === "capsule" \? \{[\s\S]*guide\.type === "curve-lattice"[\s\S]*standalone: Boolean\(guide\.standalone\)/);
  // moved to modules/geometry/draw-flow.js
  assert.match(
    drawFlow,
    /function guideSupportsLiveSurface\(guide\)[\s\S]*guide\?\.type === "capsule"[\s\S]*guide\?\.type === "curve-lattice" && guide\.standalone[\s\S]*function liveSurfaceGuide\([\s\S]*guideSupportsLiveSurface\(guide\)/
  );
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /function drawScalpRegionAtEvent\([\s\S]*surfaceGuide[\s\S]*scalpRegionNearestWorldPoint\(surfaceHit\.point\)[\s\S]*curveLatticeId[\s\S]*scalpRegionNearestWorldPoint\(surfaceHit\.point\)/
  );
  assert.match(
    source,
    /function createStrandsFromCurveLattice\(guide\)[\s\S]*const root = points\[0\][\s\S]*scalpRegion: scalpBuilder\.scalpRegionNearestWorldPoint\(root\)/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function createCurveLatticeLoopPickers\(guide\)[\s\S]*curveLatticeLoopAxis = axis[\s\S]*curveLatticeLoopIndex = loopIndex/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function selectCurveLatticeLoop\(guide, axis, loopIndex\)[\s\S]*curveLatticeLoopPointIndices[\s\S]*selectedControlPoints = indices\.map[\s\S]*updateCurveLatticeHandleColors/
  );
  assert.match(
    source,
    /const latticeLoopHit = guideApi\.curveLatticeLoopHitFromEvent\(event, selectedLattice\)[\s\S]*selectCurveLatticeLoop\([\s\S]*latticeLoopHit\.axis[\s\S]*latticeLoopHit\.loopIndex/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function updateCurveLatticeLoopHover\(event\)[\s\S]*hoveredControlPoint[\s\S]*pointerHitsTransformGizmo\(event\)[\s\S]*setCurveLatticeLoopHover\(result\)[\s\S]*"pointer"/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function refreshCurveLatticeLoopHover\(\)[\s\S]*curveLatticeLoopHover\?\.guideId[\s\S]*curveLatticeLoopHover\.axis[\s\S]*picker\.material\.opacity = hovered \? 0\.96 : 0/
  );
  assert.match(
    source,
    /renderer\.domElement\.addEventListener\("pointermove", updateControlPointHover\)[\s\S]*renderer\.domElement\.addEventListener\("pointermove", guideApi\.updateCurveLatticeLoopHover\)/
  );
  assert.match(
    source,
    /function setActiveTool\(tool\)[\s\S]*\["rotate", "scale"\]\.includes\(tool\)[\s\S]*viewportEditMode === "guide"[\s\S]*componentEditModeActive\(\)[\s\S]*getSelectedGuide\(\)\?\.type === "curve-lattice"[\s\S]*tool = "move"/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem,
    /function updateViewportToolVisibility\(\)[\s\S]*viewportCapsuleGuideTool\.classList\.toggle\("hidden", !guideMode\)[\s\S]*viewportCurveLatticeGuideTool\.classList\.toggle\("hidden", !guideMode \|\| !CURVE_LATTICE_FEATURE_ENABLED\)/
  );
  assert.match(
    source,
    /capsuleGuideMode\.addEventListener\("click", toggleCapsuleGuideTool\)[\s\S]*viewportCapsuleGuideTool\.addEventListener\("click", toggleCapsuleGuideTool\)[\s\S]*curveLatticeGuideMode\.addEventListener\("click", createCurveLatticeGuideFromUi\)[\s\S]*viewportCurveLatticeGuideTool\.addEventListener\("click", createCurveLatticeGuideFromUi\)/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function applyCurveLatticeMultiTransform\(handle\)[\s\S]*activeTool !== "move"[\s\S]*transformControls\.mode !== "translate"[\s\S]*target\.copy\(point\)\.add\(delta\)/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /const showCurveLatticeControls = CURVE_LATTICE_FEATURE_ENABLED[\s\S]*guide\?\.type === "curve-lattice"[\s\S]*guide\.standalone[\s\S]*curveLatticeControls\.hidden = !showCurveLatticeControls/
  );
  assert.match(
    source,
    /const REGION_CURVE_VISUALIZATION_ENABLED = false;[\s\S]*if \(REGION_CURVE_VISUALIZATION_ENABLED\) \{[\s\S]*ensureGroupCurveDisplay\(guide\)\.visible = groupCurveVisible;[\s\S]*guide\.groupCurveLine\.visible = false;/
  );
  assert.match(
    source,
    /const latticeVisible = REGION_CURVE_VISUALIZATION_ENABLED[\s\S]*guide\.mesh\.visible = latticeVisible;[\s\S]*guide\.wire\.visible = latticeVisible;[\s\S]*guide\.loopPickersGroup\.visible = latticeVisible;/
  );
  assert.match(
    source,
    /item\.standalone\s*\?\s*item\.viewportGroupVisible !== false\s*:\s*REGION_CURVE_VISUALIZATION_ENABLED/
  );
  assert.match(html, /class="tool-button retired-experiment"[^>]*data-tool="surface"[^>]*hidden/);
  assert.match(html, /class="tool-button retired-experiment"[^>]*data-tool="surface-loft"[^>]*hidden/);
  assert.match(localization, /"Curve Lattice Guide":\s*"カーブラティスガイド"/);
  assert.match(css, /\.guide-outliner-icon\.lattice-guide,[\s\S]*\.icon-curve-lattice-guide/);
});

test("outliner items support inline renaming and guide context deletion", async () => {
  const [html, source, css, localization, clumpProcedural, referenceHead, guideSystem, drawFlow, scalpBuilder] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/clump-procedural.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8")
  ]);
  // moved to modules/scalp/scalp-builder.js
  const scalpRowStart = scalpBuilder.indexOf("function createScalpGuideOutlinerRow()");
  const scalpRowSource = scalpRowStart >= 0 ? scalpBuilder.slice(scalpRowStart, scalpRowStart + 1500) : "";

  assert.match(
    source,
    /function beginOutlinerRename\(label,[\s\S]*outliner-rename-input[\s\S]*pushUndoState\(\)[\s\S]*event\.key === "Enter"[\s\S]*event\.key === "Escape"/
  );
  assert.match(source, /function handleOutlinerRenameClick\(event, options\)[\s\S]*event\.detail >= 2[\s\S]*beginOutlinerRename/);
  assert.match(
    source,
    /function createOutlinerStrandButton[\s\S]*handleOutlinerRenameClick\(event,[\s\S]*lock\.name = nextName/
  );
  // moved to modules/geometry/clump-procedural.js
  assert.match(
    clumpProcedural,
    /function createOutlinerClump[\s\S]*handleOutlinerRenameClick\(event,[\s\S]*clumpLocks\.forEach[\s\S]*lock\.clumpName = nextName/
  );
  // moved to modules/scene/reference-head.js
  assert.match(
    referenceHead,
    /function renderReferenceOutliner[\s\S]*reference-outliner-name[\s\S]*handleOutlinerRenameClick\(event,[\s\S]*reference\.name = nextName/
  );
  // moved to modules/scene/reference-head.js
  assert.match(
    referenceHead,
    /function renderReferenceOutliner[\s\S]*item\.addEventListener\("contextmenu"[\s\S]*type: "reference"[\s\S]*referenceId: reference\.id/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /function renderGuideOutliner[\s\S]*handleOutlinerRenameClick\(event,[\s\S]*guide\.name = nextName[\s\S]*type: "guide"[\s\S]*guideId: guide\.id/
  );
  assert.notEqual(scalpRowStart, -1);
  assert.doesNotMatch(scalpRowSource, /handleOutlinerRenameClick/);
  assert.match(
    source,
    /function showOutlinerContextMenu\(event, target\)[\s\S]*const isGuide = target\.type === "guide"[\s\S]*"Delete guide"[\s\S]*"Guide actions"/
  );
  assert.match(
    html,
    /id=["']clumpContextMenu["'][\s\S]*id=["']promoteLiveSurfaceGuideAction["'][^>]*>Promote to Live Surface Guide<\/button>/
  );
  assert.match(
    source,
    /function showOutlinerContextMenu\(event, target\)[\s\S]*promoteLiveSurfaceGuideAction\.classList\.toggle\("hidden", !strand\)[\s\S]*"Remove from Live Surface Guides"[\s\S]*"Promote to Live Surface Guide"/
  );
  assert.match(
    source,
    /promoteLiveSurfaceGuideAction\.addEventListener\("click"[\s\S]*pushUndoState\(\)[\s\S]*lock\.liveSurfaceGuide = !lock\.liveSurfaceGuide[\s\S]*drawFlowApi\.setActiveStrokeSurfaceValue\(`strand:\$\{lock\.id\}`\)/
  );
  // Behavior changed: promoting a strand to a live surface guide now records undo
  // (pushUndoState moved into the click handler), so the old no-undo assertion is gone.
  // moved to modules/geometry/draw-flow.js
  assert.match(
    drawFlow,
    /function refreshLiveSurfaceOptions\(\)[\s\S]*locks\.filter\(\(lock\) => lock\.liveSurfaceGuide\)[\s\S]*group\.label = "Strand Guides"[\s\S]*option\.value = `strand:\$\{lock\.id\}`/
  );
  assert.match(
    source,
    /liveSurfaceGuide: Boolean\(lock\.liveSurfaceGuide\)[\s\S]*function restoreLock\(snapshot,[\s\S]*liveSurfaceGuide: Boolean\(snapshot\.liveSurfaceGuide\)/
  );
  assert.match(
    source,
    /function createOutlinerStrandButton\(lock,[\s\S]*if \(lock\.liveSurfaceGuide\) \{[\s\S]*button\.classList\.add\("live-surface-guide-item"\)[\s\S]*button\.setAttribute\("aria-label", `\$\{lock\.name\}, live surface guide`\)/
  );
  assert.doesNotMatch(source, /badge\.textContent = "Surface"/);
  assert.match(
    source,
    /deleteOutlinerAction\.addEventListener\("click"[\s\S]*target\?\.type === "guide"[\s\S]*deleteGuide\(guides\.find/
  );
  assert.match(
    source,
    /deleteOutlinerAction\.addEventListener\("click"[\s\S]*target\?\.type === "reference"[\s\S]*selectReferenceImage\(reference\.id\)[\s\S]*deleteSelectedReferenceImage\(\)/
  );
  assert.match(source, /const isReference = target\.type === "reference"[\s\S]*"Delete reference"[\s\S]*"Reference actions"/);
  assert.match(source, /function deleteGuide\(guide\)[\s\S]*removeGuideObjects\(guide\)[\s\S]*disposeGuide\(guide\)/);
  assert.match(source, /type: guide\.type,\s*name: guide\.name/);
  assert.match(source, /referenceImages: referenceImages\.map\(referenceHeadApi\.serializeReferenceImage\)/);
  assert.match(source, /clumpName: lock\.clumpName \|\| null/);
  assert.match(css, /\.outliner-rename-input\s*\{[\s\S]*border:\s*1px solid #e7a95d/);
  assert.match(
    source,
    /function renderLockList\(\)[\s\S]*const groupColor = `#\$\{new THREE\.Color\(SCALP_REGIONS\[group\.id\]\.color\)\.getHexString\(\)\}`[\s\S]*groupElement\.style\.setProperty\("--outliner-region-color", groupColor\)[\s\S]*groupSwatch\.style\.background = groupColor/
  );
  assert.match(
    css,
    /\.outliner-group\s*\{[\s\S]*border-left:\s*2px solid color-mix\(in srgb, var\(--outliner-region-color\) var\(--outliner-folder-border-mix, 58%\), #57515a\)[\s\S]*background:\s*color-mix\(in srgb, var\(--outliner-region-color\) var\(--outliner-folder-background-mix, 11%\), #19181d\)/
  );
  assert.match(css, /\.outliner-group-head\s*\{[\s\S]*min-height:\s*29px;[\s\S]*padding:\s*1px 2px/);
  assert.match(css, /\.outliner-layer-head\s*\{[\s\S]*min-height:\s*24px;[\s\S]*padding:\s*1px 5px 1px 1px/);
  assert.match(css, /\.lock-item\s*\{[\s\S]*min-height:\s*26px;[\s\S]*padding:\s*3px 6px/);
  assert.match(
    css,
    /\.lock-item\.live-surface-guide-item\s*\{[\s\S]*border-color:\s*#58f6ff66;[\s\S]*box-shadow:\s*inset 2px 0 #58f6ff/
  );
  assert.match(localization, /"Delete guide":/);
  assert.match(html, /id="editScalpOutlinerAction"/);
});

test("strand rows can be dragged to another region and receive a unique region name", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  assert.match(
    source,
    /function nextStrandName\(region = "unassigned"\)[\s\S]*usedNumbers\.has\(number\)[\s\S]*return `\$\{group\.label\} \$\{number\}`/
  );
  // Region drag-and-drop (handleOutlinerRegionDrop + region-drop-target) was removed;
  // strands are no longer dragged between region folders in the outliner.
  // Drag now targets clump grouping instead: the outliner strand button keeps its
  // draggable marker for the clump-drag workflow.
  assert.match(
    source,
    /function createOutlinerStrandButton\(lock, options = \{\}\)[\s\S]*button\.draggable = !lock\.clumpGuide/
  );
  // Removed with the region drag-and-drop feature: no outliner dragover/drop wiring
  // and no .region-drop-target styling remain.
});

test("clumps can be saved from the outliner as reusable draw brush presets", async () => {
  const [html, source, localization, presetLibrary, creationPresets, drawFlow] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/creation-presets.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="clumpContextMenu"[\s\S]*id="createClumpPresetAction"[\s\S]*Create preset from clump/);
  assert.match(html, /id="creationPresetDescription"/);
  assert.match(source, /const LEGACY_CLUMP_PRESET_STORAGE_KEY = "anime-hair-studio-clump-presets-v1"/);
  assert.match(source, /clump-brush-presets\.js\?v=20260901-1/);
  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /function createCustomClumpPreset\(guide\)[\s\S]*pendingClumpPresetGuideId = guide\.id[\s\S]*Create Brush Preset[\s\S]*creationPresetDialog\.showModal/);
  // moved to modules/io/preset-library.js
  assert.match(
    presetLibrary,
    /if \(type === "clump"\) \{[\s\S]*snapshotState\(\)[\s\S]*createClumpBrushTemplate\(clumpLocks, guideSnapshot\?\.id\)[\s\S]*customCreationPresets\.strand\.push\(preset\)[\s\S]*saveCustomCreationPresets\(\)[\s\S]*populateDrawBrushPresetSelect\(`custom:\$\{preset\.id\}`\)/
  );
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /function applyCustomCreationPreset\(type, value\)[\s\S]*normalizeClumpBrushTemplate\(preset\.value\.clumpTemplate\)[\s\S]*drawStrandMode = "clump"/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function activeDrawClumpTemplate\(stroke = null\) \{[\s\S]*activeCustomDrawClumpTemplate/);
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /function migrateLegacyClumpPresets\(\)[\s\S]*createClumpBrushTemplate\(locks, guide\.id\)[\s\S]*customCreationPresets\.strand\.push[\s\S]*removeItem\(deps\.LEGACY_CLUMP_PRESET_STORAGE_KEY\)/);
  assert.doesNotMatch(source, /customPresetCatalog|saveCustomClumpPresets|addCustomClumpPreset/);
  assert.match(localization, /"Create preset from clump":/);
  assert.match(localization, /"Save this clump as a reusable Draw Strand brush in this browser\.":/);
});

test("retired clump conform and boolean compound experiments have no entry points", async () => {
  const [html, source, presets, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/clump-brush-presets.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/localization.js", import.meta.url), "utf8")
  ]);

  assert.doesNotMatch(html, /clumpConform|createCompoundFromSelection|compoundBoolean/i);
  assert.doesNotMatch(source, /clumpConform|compoundSourceIds|compoundBoolean/i);
  assert.doesNotMatch(presets, /clumpConform/i);
  assert.doesNotMatch(localization, /Clump Conform|Boolean Match/);
});

test("Chain Links braid preset uses the authored narrow and deep dimensions", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(
    source,
    /"chain-links": \{[\s\S]*?braidMeshPreset: "chain-links",[\s\S]*?braidWidth: 0\.12,[\s\S]*?braidDepth: 0\.65,/
  );
});

test("retired Place Strand tool has no visible or keyboard entry point", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);
  assert.doesNotMatch(html, /data-tool=["']place["']/);
  assert.doesNotMatch(source, /\ba\s*:\s*["']place["']/);
});

test("braid tool uses the supplied simplified SVG icon", async () => {
  const [html, css, icon, server] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/braidtoolicon-simplified.svg", import.meta.url), "utf8"),
    readFile(new URL("../server.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /data-tool=["']braid["'][\s\S]*?class=["']tool-icon icon-braid["']/);
  assert.match(css, /\.icon-braid\s*\{[\s\S]*mask:\s*url\("\.\/assets\/braidtoolicon-simplified\.svg"\)/);
  assert.match(server, /["']\.svg["']:\s*["']image\/svg\+xml["']/);
  assert.doesNotMatch(css, /\.icon-braid::(?:before|after)/);
  assert.match(icon, /<title id=["']title["']>Simplified braid tool icon<\/title>/);
});

test("panel tool uses the supplied split-panel SVG and user-facing name", async () => {
  const [html, source, css, icon, localization, placement] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/splitpaneltool-simplified.svg", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/placement.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /data-tool=["']panel["'][^>]*title=["']Split Panel \(P\)["'][^>]*aria-label=["']Split Panel tool["'][\s\S]*?class=["']tool-icon icon-panel["']/);
  assert.match(html, /id=["']panelStrandToolPanel["'][\s\S]*?<span id=["']panelToolTitle["']>Split Panel Tool<\/span>/);
  assert.match(html, /<kbd>P<\/kbd><span>Split Panel<\/span>/);
  assert.match(css, /\.icon-panel\s*\{[\s\S]*mask:\s*url\("\.\/assets\/splitpaneltool-simplified\.svg"\)/);
  assert.doesNotMatch(css, /\.icon-panel::(?:before|after)/);
  assert.match(icon, /<title id=["']title["']>Simplified split panel tool icon<\/title>/);
  // moved to modules/geometry/placement.js
  assert.match(placement, /message = "Split Panel: draw its center path on the contextual 2D plane\."/);
  assert.doesNotMatch(source, /Draw panel:/);
  assert.match(localization, /"Split Panel":/);
  assert.match(localization, /"Split Panel Tool":/);
  assert.match(localization, /"Split Panel tool":/);
  assert.match(html, /Vertical Loops <input id=["']panelLengthLoops["']/);
  assert.match(html, /Horizontal Loops <input id=["']panelWidthLoops["']/);
  assert.doesNotMatch(html, /Lengthwise Loops|Crosswise Loops/);
  assert.match(localization, /"Vertical Loops":/);
  assert.match(localization, /"Horizontal Loops":/);
  assert.doesNotMatch(localization, /"Lengthwise Loops"|"Crosswise Loops"/);
});

test("split panels expose a persistent signed tip curve control", async () => {
  const [html, source, localization, curveMath] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id=["']panelTipCurve["'][^>]*min=["']-1["'][^>]*max=["']1["'][^>]*value=["']0["']/);
  assert.match(source, /panelTipCurve:\s*0/);
  // moved to modules/geometry/curve-math.js
  assert.match(curveMath, /export function panelTipCurveParameter\(t, u, tipCurve = 0, edgeTrim = 0\)/);
  assert.match(source, /panelTipCurve:\s*Number\(lock\.panelTipCurve \?\? panelCreationDefaults\.panelTipCurve\)/);
  assert.match(source, /panelTipCurve:\s*snapshot\.geometryType === "surface"/);
  assert.match(source, /partner\.panelTipCurve = lock\.geometryType === "surface"/);
  assert.match(localization, /"Tip Curve":/);
});

test("split panels can preserve hard zipper and perimeter edges", async () => {
  // Retired feature: the "Hard Split Edges" zipper/perimeter-edge preservation system
  // (panelHardZipperEdges, hardSplitEdges, duplicateHardEdgeVertex,
  // quad-patches-with-zipper-boundaries topology) was removed from index.html, app.js
  // and the localization dictionaries. What remains is the shared authored-edge-mask
  // topology path (createHairTopologyGeometry) and the panel normal-smoothing helper
  // (now in modules/geometry/panel-tip-strand.js), asserted below.
  const [source, panelTipStrand] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8")
  ]);
  // moved to modules/geometry/panel-tip-strand.js
  assert.match(panelTipStrand, /function smoothCoincidentPanelNormals\(geometry/);
  assert.match(source, /function createHairTopologyGeometry\(sourceGeometry\)[\s\S]*sourceGeometry\.userData\.triangleEdgeMasks[\s\S]*authoredEdgeMasks\?\.\[triangleIndex\]/);
});

test("split panels can add persistent lower-fringe topology density", async () => {
  const [html, source, localization, curveMath] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /Tip Loops <input id=["']panelTipLoops["'][^>]*min=["']0["'][^>]*max=["']16["'][^>]*step=["']1["']/);
  assert.match(source, /panelTipLoops:\s*0/);
  // moved to modules/geometry/curve-math.js
  assert.match(curveMath, /export function panelTipLoopParameters\(baseLoopCount, extraTipLoops = 0, tipStart = 0\.55\)/);
  assert.match(source, /panelTipLoops:\s*Number\(lock\.panelTipLoops \?\? panelCreationDefaults\.panelTipLoops\)/);
  assert.match(source, /panelTipLoops:\s*snapshot\.geometryType === "surface"/);
  assert.match(source, /partner\.panelTipLoops = lock\.geometryType === "surface"/);
  assert.match(localization, /"Tip Loops":/);
});

test("Poly Brush authors persistent quad meshes with click, drag, bridge, and delete gestures", async () => {
  const [html, source, css, topology, polyTools, strandGeometry, projectFiles] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/poly-topology.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/poly-tools.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/strand-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-files.js", import.meta.url), "utf8")
  ]);

  assert.doesNotMatch(html, /data-tool=["']poly["'][^>]*(?:title|aria-label)=["']Poly Brush(?: tool)?["']/);
  assert.match(html, /id=["']polyBrushToolPanel["'][\s\S]*id=["']polyBrushSurfaceOffset["'][\s\S]*id=["']polyBrushWidth["'][\s\S]*id=["']polyBrushSpacing["']/);
  assert.match(css, /\.icon-poly[\s\S]*\.poly-brush-help/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /geometryType:\s*"poly"[\s\S]*polyFaces:\s*\[\]/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /function appendPolyStrokeRow[\s\S]*appendPolyQuad/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /function beginPolyBrushPointer[\s\S]*function updatePolyBrushStroke/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /event\.shiftKey[\s\S]*fillPolyGap[\s\S]*polyFillCandidate/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /event\.shiftKey[\s\S]*target = polyTargetAtEvent\(event\)[\s\S]*kind:\s*"relax"/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /stroke\.kind === "relax"[\s\S]*relaxPolyPoints[\s\S]*projectPolyRelaxPoint[\s\S]*pushUndoState\(\)/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /stroke\?\.kind === "relax"[\s\S]*startPoints[\s\S]*undoHistory\.pop\(\)/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /function polyFillCandidateForEvent[\s\S]*function showPolyFillPreview[\s\S]*function updatePolyFillPreview/);
  assert.match(source, /new THREE\.MeshBasicMaterial\(\{[\s\S]*color:\s*0xff4fd8[\s\S]*depthTest:\s*false/);
  assert.match(source, /window\.addEventListener\("pointermove", polyToolsApi\.updatePolyFillPreview\)/);
  assert.match(source, /event\.key === "Shift"[\s\S]*clearPolyFillPreview\(\)/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /target\?\.type === "vertex"[\s\S]*kind:\s*"vertex"[\s\S]*lock\.points\[stroke\.pointIndex\]\.copy\(sample\.point\)/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /polyBrushSurfaceOffsetInput[\s\S]*addScaledVector\(normal,\s*Number\(deps\.polyBrushSurfaceOffsetInput\.value\)\)/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /event\.altKey[\s\S]*finishPolyAltDelete[\s\S]*deletePolyComponent/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /target\.type === "face"[\s\S]*deletePolyFaceAndOrphans[\s\S]*removePolyPointAttributes/);
  assert.match(source, /polyFaces: lock\.geometryType === "poly" \? lock\.polyFaces\.map\(\(face\) => \[\.\.\.face\]\) : null,[\s\S]*polyFaces: normalizePolyFaces\(snapshot\.points \|\| \[\], snapshot\.polyFaces\)/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /if \(lock\.geometryType === "poly"\) return createPolyGeometry\(lock\)/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /if \(includeCurves && lock\.geometryType !== "poly"\)/);
  assert.match(topology, /export function relaxPolyPoints[\s\S]*export function deletePolyFaceAndOrphans[\s\S]*export function deletePolyVertex[\s\S]*export function polyMeshBuffers/);
});

test("Surface experiment is hidden and guarded while its legacy project path remains load-compatible", async () => {
  const [html, source, css, lattice, curveSurfaceCreate, panelTipStrand, guideSystem] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/surface-lattice.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-surface-create.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/panel-tip-strand.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8")
  ]);

  assert.match(
    html,
    /class="tool-button retired-experiment"[^>]*data-tool="surface"[^>]*hidden[^>]*aria-hidden="true"/
  );
  assert.match(
    html,
    /id=["']surfaceLatticeControls["'][\s\S]*Horizontal Points[\s\S]*id=["']surfaceLatticeColumns["'][^>]*min=["']3["'][^>]*max=["']11["'][^>]*step=["']2["'][\s\S]*Vertical Points[\s\S]*id=["']surfaceLatticeRows["']/
  );
  assert.match(html, /id=["']panelCurvatureControl["'][\s\S]*Horizontal Curvature[\s\S]*id=["']panelCurvature["']/);
  assert.match(css, /\.icon-surface\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*1fr\)/);
  assert.match(
    css,
    /#surfaceLatticeControls\.hidden,\s*#panelCurvatureControl\.hidden\s*\{[\s\S]*display:\s*none !important/
  );
  assert.match(source, /from "\.\/modules\/geometry\/surface-lattice\.js\?v=20260814-12"/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(
    curveSurfaceCreate,
    /function createSurfaceLockFromLattice\(points, options = \{\}\)[\s\S]*geometryType:\s*"surface"[\s\S]*updateLockGeometry\(lock\)/
  );
  assert.doesNotMatch(source, /centerX:\s*mirrorXEditing/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(
    curveSurfaceCreate,
    /function createViewportSurface\(\) \{\s*return null;[\s\S]*createSurfaceLatticePointData\([\s\S]*createSurfaceLockFromLattice\(points/
  );
  assert.match(
    source,
    /if \(button\.dataset\.tool === "surface"\) curveSurfaceCreate\.createViewportSurface\(\)/
  );
  assert.doesNotMatch(source, /createDrawnSurface|createSurfaceLatticeFromStroke|outputType === "surface"/);
  // moved to modules/geometry/curve-surface-create.js
  assert.match(
    curveSurfaceCreate,
    /function resampleSurfaceLock\(lock,\s*nextColumns,\s*nextRows\)[\s\S]*resampleSurfaceLatticePointData\([\s\S]*lock\.surfaceColumns = targetColumns[\s\S]*rebuildCurveObjects\(lock\)[\s\S]*syncActiveMirror\(lock/
  );
  assert.match(
    source,
    /surfaceColumns:\s*lock\.geometryType === "surface"[\s\S]*surfaceRows:\s*lock\.geometryType === "surface"/
  );
  assert.match(
    source,
    /const surfaceColumns = normalizeSurfaceLatticeCount\(snapshot\.surfaceColumns[\s\S]*const surfaceRows = normalizeSurfaceLatticeCount\(snapshot\.surfaceRows/
  );
  assert.match(source, /partner\.surfaceColumns = lock\.surfaceColumns[\s\S]*partner\.surfaceRows = lock\.surfaceRows/);
  assert.match(
    source,
    /function applySurfaceLatticeMirror\(lock,\s*pointIndex\)[\s\S]*mirroredSurfaceLatticePointIndex\([\s\S]*mirroredPoint\.set\(-point\.x,\s*point\.y,\s*point\.z\)/
  );
  // moved to modules/geometry/panel-tip-strand.js
  assert.match(
    panelTipStrand,
    /function createPanelStrandGeometry\(lock\)[\s\S]*const latticeControlled = lock\.geometryType === "surface"[\s\S]*surfacePanelPoint\(/
  );
  // moved to modules/geometry/panel-tip-strand.js
  assert.match(
    panelTipStrand,
    /function surfacePanelPoint\(lock,\s*t,\s*u,\s*shell = 0\)[\s\S]*shell \* thickness \* 0\.5/
  );
  assert.match(
    source,
    /panelCurvatureControl\.classList\.toggle\("hidden", Boolean\(selectedSurface\)\)[\s\S]*selectedSurface\.panelCurvature = 0/
  );
  assert.match(
    source,
    /lock\.panelCurvature = lock\.geometryType === "surface"\s*\?\s*0/
  );
  // moved to modules/geometry/panel-tip-strand.js
  assert.match(
    panelTipStrand,
    /Lattice surfaces already use outward-facing parameter order\.\s*if \(!latticeControlled\) \{[\s\S]*indices\[index \+ 1\], indices\[index \+ 2\]/
  );
  assert.match(source, /new THREE\.LineSegments[\s\S]*surfaceLatticeWireSegments\(\s*lock\.points,\s*lock\.surfaceColumns,\s*lock\.surfaceRows/);
  assert.match(
    source,
    /function updateCurveObjects\(lock[\s\S]*syncLockedStrandWireVisual\(lock\)/
  );
  assert.doesNotMatch(source, /selectedSurfaceQuadPreview|hairTopologyVisible \|\| lock\.geometryType === "surface"/);
  // moved to modules/geometry/panel-tip-strand.js
  assert.match(
    panelTipStrand,
    /indices\.push\(a, c, b, a, d, c\);[\s\S]*triangleEdgeMasks\.push\(\[1, 1, 0\], \[1, 0, 1\]\);[\s\S]*indices\.push\(a, b, c, a, c, d\);[\s\S]*triangleEdgeMasks\.push\(\[1, 0, 1\], \[1, 1, 0\]\)/
  );
  assert.match(
    source,
    /if \(lock\.geometryType === "surface"\) \{[\s\S]*surfaceObjectAnchor = new THREE\.Object3D\(\)[\s\S]*new THREE\.OctahedronGeometry\(0\.072, 0\)[\s\S]*surfaceObjectAnchorHandle\.position\.set\(0, -0\.18, 0\)/
  );
  assert.match(
    source,
    /function surfaceObjectAnchorPose\(lock\)[\s\S]*surfaceLatticeSampleVectors\(lock, 0\.5, 0\)[\s\S]*makeBasis\(x, y, z\)/
  );
  assert.match(
    source,
    /function selectSurfaceObjectAnchor\(lock[\s\S]*selectedSurfaceObjectAnchorId = lock\.id[\s\S]*attachSurfaceObjectAnchorTransform\(lock\)/
  );
  assert.match(
    source,
    /function updateSurfaceObjectTransform\(anchor\)[\s\S]*edit\.points\.forEach\([\s\S]*lock\.points\[index\]\.copy\(transformPoint\(point\)\)[\s\S]*lock\.pointSurfaceNormals = edit\.pointSurfaceNormals\.map\(transformNormal\)[\s\S]*syncActiveMirror\(lock\)/
  );
  // moved to modules/geometry/guide-system.js
  assert.match(
    guideSystem,
    /surfaceAnchorSelected[\s\S]*tool === "relax" \|\| \(!surfaceAnchorSelected && \["rotate", "scale"\]\.includes\(tool\)\)/
  );
  assert.match(
    lattice,
    /function sampleCatmullRomLine\(points,\s*t\)[\s\S]*export function surfaceLatticeWireSegments\([\s\S]*sampleSurfaceLattice\(points/
  );
  assert.match(source, /function isPanelGeometry\(target\)[\s\S]*\["panel", "surface"\]\.includes\(target\?\.geometryType\)/);
});

test("retired lightweight strand collision has no UI or runtime entry point", async () => {
  const [html, source, constraints] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/strand-constraints.js", import.meta.url), "utf8")
  ]);

  assert.doesNotMatch(html, /strandCollisionToggle|lightweight strand collision|icon-collision|collision-button/i);
  assert.doesNotMatch(source, /strandCollision|resolveStrandCollisions|findSpatialCollisionPairs|closestPointsOnSegments/);
  assert.doesNotMatch(constraints, /findSpatialCollisionPairs|closestPointsOnSegments/);
});

test("transform gizmo picker volumes are deflated without shortening axis reach", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /const TRANSFORM_GIZMO_PICKER_DEFLATION = 0\.5;/);
  assert.match(source, /const TRANSFORM_GIZMO_AXIS_PICKER_DEFLATION = 0\.35;/);
  assert.doesNotMatch(source, /TRANSFORM_GIZMO_XZ_PICKER_LENGTH/);
  assert.match(source, /X:\s*\[1,\s*axisFactor,\s*axisFactor\]/);
  assert.match(source, /Y:\s*\[axisFactor,\s*1,\s*axisFactor\]/);
  assert.match(source, /Z:\s*\[axisFactor,\s*axisFactor,\s*1\]/);
  assert.match(source, /ringRadius \+ \(radialDistance - ringRadius\) \* factor/);
  assert.match(source, /geometry\.translate\(-center\.x,\s*-center\.y,\s*-center\.z\)/);
  assert.match(source, /deflateTransformGizmoPickers\(TRANSFORM_GIZMO_PICKER_DEFLATION\)/);
});

test("transform scale drags use restrained axis response and directional uniform response", async () => {
  const [html, source, css, localization, miscStore] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/misc-store.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="transformToolPanel"[\s\S]*id="transformToolTitle"[\s\S]*id="pullMoveSetting"[\s\S]*id="scaleSensitivitySetting"[\s\S]*id="scaleSensitivity"[^>]*min="0\.05"[^>]*max="1"[^>]*value="0\.3"/);
  // moved to modules/core/misc-store.js
  assert.match(miscStore, /scaleSensitivity: 0\.3,/);
  assert.match(source, /function setScaleSensitivity\(value\)[\s\S]*normalizeScaleSensitivity\(value\)[\s\S]*scaleSensitivityValue\.textContent/);
  assert.match(source, /scaleSensitivitySetting\.classList\.toggle\("hidden", sel\.state\.activeTool !== "scale"\)/);
  assert.match(source, /transformControls\.addEventListener\("dragging-changed"[\s\S]*transformScaleDrag = \{[\s\S]*axis: transformControls\.axis,[\s\S]*startScale: transformControls\.object\?\.scale\.clone\(\) \|\| null,[\s\S]*startPointerX: pointerX,[\s\S]*startPointerY: pointerY,[\s\S]*lastPointerX: pointerX,[\s\S]*lastRawScale:[\s\S]*appliedScale:/);
  assert.match(source, /const MIN_UNIFORM_SCALE_RATIO = 0\.05;[\s\S]*const MAX_UNIFORM_SCALE_RATIO = 4;/);
  assert.match(source, /function applyReducedTransformScale\(handle\)[\s\S]*precision = transform\.state\.transformPrecisionHeld \? TRANSFORM_PRECISION_MULTIPLIER : 1[\s\S]*drag\.axis === "XYZ"[\s\S]*horizontalDrag = drag\.pointerX - drag\.lastPointerX[\s\S]*upwardDrag = drag\.lastPointerY - drag\.pointerY[\s\S]*Math\.abs\(horizontalDrag\) >= Math\.abs\(upwardDrag\)[\s\S]*Math\.exp\(screenDrag \* 0\.01 \* miscState\.state\.scaleSensitivity \* precision\)[\s\S]*drag\.appliedScale\.multiplyScalar\(factor\)[\s\S]*adjustedRatio = 1 \+ \(rawRatio - 1\) \* miscState\.state\.scaleSensitivity \* precision/);
  assert.match(source, /function updateTransformScalePointer\(event\)[\s\S]*transformScaleDrag\.axis !== "XYZ"[\s\S]*transformScaleDrag\.pointerX = event\.clientX[\s\S]*transformScaleDrag\.pointerY = event\.clientY/);
  assert.match(source, /window\.addEventListener\("pointermove", updateTransformScalePointer, true\)/);
  assert.match(source, /transformControls\.addEventListener\("objectChange"[\s\S]*applyReducedTransformScale\(handle\)[\s\S]*applyUniformTransformScale\(handle\)/);
  assert.match(css, /#pullMoveSetting\.hidden,[\s\S]*#pullRigiditySetting\.hidden,[\s\S]*#pullCollisionSetting\.hidden,[\s\S]*#moveCurveControlsSetting\.hidden,[\s\S]*#scaleSensitivitySetting\.hidden[\s\S]*display: none !important/);
  assert.match(localization, /"Scale Sensitivity": "スケール感度"/);
  assert.doesNotMatch(source, /SCALE_SENSITIVITY_PREFERENCE_KEY/);
});

test("Move tool exposes independent segmented viewport curve controls and compact shape checkboxes", async () => {
  const [html, source, css, localization, hairStore] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/hair-store.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="moveCurveControlsSetting"[\s\S]*class="move-curve-viewport-options"[\s\S]*class="move-curve-dual-button"[\s\S]*<span>Width<\/span>[\s\S]*id="moveWidthCurveControls" type="checkbox"[\s\S]*id="moveAsymmetricWidthLabel">Sym[\s\S]*id="moveAsymmetricWidth" type="checkbox"[\s\S]*<span>Depth<\/span>[\s\S]*id="moveDepthCurveControls" type="checkbox"[\s\S]*id="moveAsymmetricDepthLabel">Sym[\s\S]*id="moveAsymmetricDepth" type="checkbox"[\s\S]*<span>Twist<\/span>[\s\S]*id="moveTwistCurveControls" type="checkbox"/);
  assert.match(html, /id="moveCenterAsymmetricProfile" type="checkbox"/);
  assert.match(html, /id="moveGrabHandlesSetting"[\s\S]*>Grab Handles<[\s\S]*id="moveWidthGrabHandles" type="checkbox" checked[\s\S]*id="moveDepthGrabHandles" type="checkbox"[\s\S]*id="moveUniformGrabHandles" type="checkbox"/);
  assert.doesNotMatch(html, />Curve Shape<\/div>/);
  assert.doesNotMatch(html, />Asymmetric Width<\/span>|>Asymmetric Depth<\/span>/);
  // moved to modules/core/hair-store.js
  assert.match(hairStore, /moveCurveControlVisibility: \{[\s\S]*taperCurve: false,[\s\S]*depthCurve: false,[\s\S]*twistCurve: false/);
  assert.match(source, /function moveCurveControlsApplicable[\s\S]*activeTool === "move"[\s\S]*componentEditModeActive\(\)/);
  assert.match(source, /function visibleTaperMeshCurveEdits[\s\S]*Object\.entries\(hairState\.state\.moveCurveControlVisibility\)[\s\S]*taperMeshPointsVisible/);
  assert.match(source, /function setSelectedMoveCurveShapeFlag[\s\S]*pushUndoState\(\)[\s\S]*editSelectedLocks[\s\S]*ensureSecondaryTaperCurve\(lock, curveKey\)[\s\S]*lock\[key\] = Boolean\(enabled\)/);
  assert.match(source, /function syncMoveCurveControls[\s\S]*setMixedControl\(control, null, values, Boolean\)/);
  // moved to modules/core/hair-store.js
  assert.match(hairStore, /moveGrabHandleVisibility: \{[\s\S]*width: true,[\s\S]*depth: false,[\s\S]*uniform: false/);
  assert.match(source, /function moveGrabHandleVisible\(dimension\)[\s\S]*hairState\.state\.moveGrabHandleVisibility\.uniform[\s\S]*dimension === "uniform"[\s\S]*function setMoveGrabHandleVisibility/);
  assert.match(source, /function syncMoveCurveControls[\s\S]*moveWidthGrabHandlesInput\.disabled = hairState\.state\.moveGrabHandleVisibility\.uniform[\s\S]*moveDepthGrabHandlesInput\.disabled = hairState\.state\.moveGrabHandleVisibility\.uniform/);
  assert.match(css, /\.move-curve-controls \{[\s\S]*display: grid[\s\S]*gap: 2px/);
  assert.match(css, /\.sliders label\.move-curve-checkbox \{[\s\S]*display: flex[\s\S]*justify-content: space-between[\s\S]*width: 100%[\s\S]*white-space: nowrap[\s\S]*\.sliders label\.move-curve-checkbox input \{[\s\S]*width: 14px[\s\S]*height: 14px/);
  assert.match(css, /\.move-curve-viewport-options \{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)[\s\S]*gap: 4px/);
  assert.match(css, /\.move-curve-dual-button \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) 42px[\s\S]*\.move-curve-dual-button:has\(\.move-curve-control-segment input:checked\) \.move-curve-symmetry-segment[\s\S]*color: #79eef5[\s\S]*\.move-curve-symmetry-segment:has\(input:checked\)[\s\S]*color: #ff7bdf[\s\S]*\.move-curve-dual-button:not\(:has\(\.move-curve-control-segment input:checked\)\) \.move-curve-symmetry-segment[\s\S]*color: #c9c2ca/);
  assert.match(css, /\.sliders \.move-curve-segment \{[\s\S]*grid-template-columns: 1fr[\s\S]*place-items: center[\s\S]*min-height: 22px[\s\S]*margin: 0 !important[\s\S]*\.sliders \.move-curve-segment > span \{[\s\S]*text-align: center[\s\S]*\.sliders \.move-curve-segment:has\(input:checked\)[\s\S]*background: #4b3724/);
  // "Viewport Curve Controls" / "Grab Handles" are no longer localized (labels are
  // authored directly in the HTML), so the dictionary-key assertions are removed.
});

test("Shift provides temporary precision for active transform gizmo drags", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /const TRANSFORM_PRECISION_MULTIPLIER = 0\.2/);
  assert.match(source, /transformControls\.addEventListener\("dragging-changed"[\s\S]*\["translate", "rotate"\]\.includes\(transformControls\.mode\)[\s\S]*transformPrecisionDrag = object[\s\S]*lastRawPosition:[\s\S]*appliedPosition:[\s\S]*lastRawQuaternion:[\s\S]*appliedQuaternion:/);
  assert.match(source, /function applyTransformPrecision\(handle\)[\s\S]*drag\.mode === "translate"[\s\S]*addScaledVector\([\s\S]*precision[\s\S]*drag\.mode !== "rotate"[\s\S]*localRotation = transformControls\.space === "local"[\s\S]*!\["E", "XYZE"\]\.includes\(transformControls\.axis\)[\s\S]*new THREE\.Quaternion\(\)\.slerp\(delta, precision\)/);
  assert.match(source, /transformControls\.addEventListener\("objectChange"[\s\S]*applyTransformPrecision\(handle\)[\s\S]*applyReducedTransformScale\(handle\)/);
  assert.match(source, /if \(event\.key === "Shift" && !event\.repeat\) \{[\s\S]*transformPrecisionHeld = true;[\s\S]*syncNavigationModifierLocks\(\)/);
  assert.match(source, /event\.key === "Shift"[\s\S]*transformDragging[\s\S]*\["translate", "rotate", "scale"\]\.includes\(transformControls\.mode\)[\s\S]*event\.preventDefault\(\)/);
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*event\.key === "Shift"[\s\S]*transformPrecisionHeld = false/);
  assert.match(source, /window\.addEventListener\("blur"[\s\S]*transformPrecisionHeld = false/);
});

test("transform gizmo picker debug overlay and C shortcut are retired", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /transformGizmoPickerOverlayVisible|configureTransformGizmoPickerOverlay/);
  assert.doesNotMatch(source, /TRANSFORM_GIZMO_PICKER_COLORS|debugPickerOverlay/);
  assert.doesNotMatch(source, /event\.key\.toLowerCase\(\) === "c"/);
});

test("move and scale gizmos add visible rods for their negative axes", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /\["translate", "scale"\]\.forEach\(\(mode\)/);
  assert.match(source, /\["X", "Y", "Z"\]\.forEach\(\(axis\)/);
  assert.match(source, /negativeRod\.geometry\.applyMatrix4\(rotation\)/);
  assert.match(source, /negativeRod\.material\.color\.setHex\(TRANSFORM_GIZMO_DARK_AXIS_COLORS\[axis\]\)/);
  assert.match(source, /negativeRod\.userData\.negativeAxisRod = true/);
  assert.match(source, /addNegativeTransformGizmoRods\(\)/);
});

test("rotate gizmo adds dark full-circle axis guides", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /const TRANSFORM_GIZMO_DARK_AXIS_COLORS = Object\.freeze/);
  assert.match(source, /new THREE\.TorusGeometry\(0\.5,\s*0\.0055,\s*3,\s*64\)/);
  assert.match(source, /circle\.userData\.fullRotateAxisCircle = true/);
  assert.match(source, /addFullRotateGizmoAxisCircles\(\)/);
});

test("rotate gizmo removes the grey free-rotation ring and its hidden picker", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /\[transformGizmo\.gizmo\.rotate,\s*transformGizmo\.picker\.rotate\]\.forEach/);
  assert.match(source, /\.filter\(\(handle\) => handle\.name === "XYZE"\)/);
  assert.match(source, /removeRotateFreeAxisRing\(\)/);
  assert.doesNotMatch(source, /XYZE:\s*0x/);
});

test("object-space rotate gizmo keeps its drag-start frame until release", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(
    source,
    /const preserveDraggedObjectRotation = Boolean\([\s\S]*sculptState\.state\.transformDragging[\s\S]*sculptState\.state\.objectSpaceEditing[\s\S]*sel\.state\.activeTool === "rotate"[\s\S]*sculptState\.state\.activeHandleEdit\?\.lockId === lock\.id[\s\S]*transformControls\.object === handle/
  );
  assert.match(
    source,
    /if \(frame\) \{\s*if \(!preserveDraggedObjectRotation\) handle\.quaternion\.copy\(frame\.quaternion\);[\s\S]*\} else \{\s*handle\.quaternion\.identity\(\)/
  );
  assert.match(
    source,
    /transformControls\.addEventListener\("dragging-changed", \(event\) => \{\s*sculptState\.state\.transformDragging = event\.value;[\s\S]*flushPendingLockGeometryUpdates\(\)/
  );
});

test("control point hover is opaque while selected control points are yellow", async () => {
  const [source, guideSystem] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8")
  ]);

  assert.match(source, /const CONTROL_POINT_SELECTED_COLOR = 0xffd84d/);
  assert.match(source, /controlPointHoverOverlay = new THREE\.Mesh\([\s\S]*transparent:\s*false[\s\S]*opacity:\s*1/);
  assert.match(source, /controlPointHoverOverlay\.material\.color\.copy\(guideState\.state\.hoveredControlPoint\.material\.color\)/);
  assert.match(source, /controlPointHoverOverlay\.scale\.setScalar\(1\.06\)/);
  assert.match(source, /controlPointHoverOverlay\.raycast = \(\) => \{\}/);
  assert.match(source, /if \(selectedHandle\) return CONTROL_POINT_SELECTED_COLOR/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /handle\.material\.color\.set\(isSelected \? deps\.CONTROL_POINT_SELECTED_COLOR/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /if \(selected\) handle\.material\.color\.set\(deps\.CONTROL_POINT_SELECTED_COLOR\)/);
  assert.match(source, /if \(pointerHitsTransformGizmo\(event\)\)/);
  assert.match(source, /raycaster\.intersectObjects\(targets,\s*false\)/);
  assert.match(source, /addEventListener\("pointermove",\s*updateControlPointHover\)/);
  assert.match(
    source,
    /addEventListener\("pointerleave",\s*\(\) => \{[\s\S]*setHoveredControlPoint\(null\)[\s\S]*setCurveLatticeLoopHover\(null\)[\s\S]*\}\)/
  );
});

test("Loft Surface experiment is hidden and blocked while its prototype math remains recoverable", async () => {
  const [html, source, css, lattice, curveSurfaceCreate] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/surface-lattice.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-surface-create.js", import.meta.url), "utf8")
  ]);

  assert.match(
    html,
    /class="tool-button retired-experiment"[^>]*data-tool="surface-loft"[^>]*hidden[^>]*aria-hidden="true"/
  );
  assert.match(source, /RETIRED_CURVE_LATTICE_SURFACE_TOOLS = new Set\(\["surface", "surface-loft"\]\)/);
  assert.match(source, /if \(RETIRED_CURVE_LATTICE_SURFACE_TOOLS\.has\(tool\)\) tool = "select"/);
  assert.match(
    html,
    /id="loftSurfaceToolPanel"[\s\S]*id="loftHorizontalStep"[\s\S]*Draw horizontal curve[\s\S]*id="loftVerticalStep"[\s\S]*Draw vertical curve[\s\S]*id="resetLoftSurfaceDraft"/
  );
  assert.match(css, /\.icon-loft-surface::before,[\s\S]*\.loft-surface-steps li\.active/);
  assert.match(
    lattice,
    /export function createLoftSurfaceLatticePointData\([\s\S]*horizontalPoints[\s\S]*verticalPoints[\s\S]*surfaceLatticePointIndex/
  );
  // moved to modules/geometry/curve-surface-create.js
  assert.match(curveSurfaceCreate,
    /function beginLoftSurfaceStroke\(event, hit\)[\s\S]*stage: deps\.miscState\.loftSurfaceDraft\.horizontalPoints \? "vertical" : "horizontal"/
  );
  // moved to modules/geometry/curve-surface-create.js
  assert.match(
    curveSurfaceCreate,
    /function finishLoftSurfaceStroke\(event, options = \{\}\)[\s\S]*createLoftSurfaceLatticePointData\([\s\S]*createSurfaceLockFromLattice\(points,[\s\S]*setActiveTool\("move"\)/
  );
  assert.match(source, /window\.addEventListener\("pointermove", curveSurfaceCreate\.updateLoftSurfaceStroke\)/);
  assert.match(source, /window\.addEventListener\("pointerup", curveSurfaceCreate\.finishLoftSurfaceStroke\)/);
  assert.match(source, /sel\.state\.activeTool === "surface-loft" && curveSurfaceCreate\.cancelLoftSurfaceDraft\(\)/);
  assert.match(
    source,
    /const leavingLoftSurface = sel\.state\.activeTool === "surface-loft" && tool !== "surface-loft";[\s\S]*curveSurfaceCreate\.cancelLoftSurfaceDraft\(\)/
  );
});

test("strand curve control points de-emphasize and support branching hover in Draw Strand", async () => {
  const [source, boneInteraction] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8")
  ]);

  assert.match(source, /const STRAND_CONTROL_POINT_RADIUS_SCALE = 0\.85;/);
  assert.match(source, /const STRAND_CONTROL_POINT_DRAW_TOOL_SCALE = 0\.5;/);
  assert.match(source, /0\.052 \* STRAND_CONTROL_POINT_RADIUS_SCALE/);
  assert.match(
    source,
    /const STRAND_CONTROL_POINT_MIN_PICK_RADIUS = 0\.065;[\s\S]*function strandControlPointRaycast\(raycaster, intersections\)[\s\S]*intersectSphere\([\s\S]*handle\.raycast = strandControlPointRaycast/
  );
  assert.match(
    source,
    /const STRAND_CONTROL_POINT_MIN_PICK_PIXELS = 12;[\s\S]*function strandControlPointHitFromEvent\(event, lock = getSelectedLock\(\)\)[\s\S]*handle\.getWorldPosition\([\s\S]*\.project\(camera\)[\s\S]*screenDistance > STRAND_CONTROL_POINT_MIN_PICK_PIXELS/
  );
  // moved to modules/bones/bone-interaction.js
  assert.match(
    boneInteraction,
    /function prepareCurvePointSelection\(event\)[\s\S]*const hit = deps\.strandControlPointHitFromEvent\(event, selectedLock\)[\s\S]*deps\.activateStrandControlPoint\(hit\.object, event\)/
  );
  assert.match(
    source,
    /function strandControlPointHit\(event, lock = getSelectedLock\(\)\) \{\s*return strandControlPointHitFromEvent\(event, lock\)/
  );
  assert.match(
    source,
    /handle\.raycast = brushDebugVisible\s*\? sculptBrushDebugRaycast\s*:\s*strandControlPointRaycast/
  );
  assert.doesNotMatch(source, /index === 0 \? 0\.065 : 0\.052/);
  assert.match(
    source,
    /const deEmphasizeControlPoints = \["draw", "procedural-draw", "braid", "panel"\]\.includes\(sel\.state\.activeTool\)[\s\S]*controlPointDisplayScale[\s\S]*handle\.scale\.set\([\s\S]*controlPointDisplayScale[\s\S]*handle\.material\.color\.getHSL\(hsl\)[\s\S]*hsl\.s \* 0\.28[\s\S]*deEmphasizeControlPoints[\s\S]*\? 0\.18/
  );
  assert.match(
    source,
    /function visibleControlPointHoverTargets\(\)[\s\S]*lock\?\.curveObjects\?\.group\.visible[\s\S]*sel\.state\.activeTool === "draw"[\s\S]*!\["procedural-draw", "braid", "panel"\]\.includes\(sel\.state\.activeTool\)[\s\S]*targets\.push\(\.\.\.lock\.curveObjects\.handles\)/
  );
  assert.match(
    source,
    /sel\.state\.activeTool = tool;[\s\S]*\["draw", "procedural-draw", "braid", "panel", "curve-surface"\]\.includes\(sel\.state\.activeTool\)[\s\S]*setHoveredControlPoint\(null\)/
  );
  assert.match(
    source,
    /function activateStrandControlPoint\(handle, event\)[\s\S]*selectCurvePoint\(handle\.userData\.lockId, handle\.userData\.pointIndex, preserveMulti\)[\s\S]*attachTransformForCurvePoint\(getSelectedLock\(\), handle\.userData\.pointIndex, handle\)/
  );
  assert.match(
    source,
    /function activateStrandControlPoint\(handle, event\)[\s\S]*selectCurvePoint\([\s\S]*if \(sel\.state\.activeTool === "select"\) \{\s*transformControls\.detach\(\);\s*return true;\s*\}[\s\S]*attachTransformForCurvePoint/
  );
  // moved to modules/bones/bone-interaction.js
  assert.match(
    boneInteraction,
    /function prepareCurvePointSelection\(event\)[\s\S]*\["place", "draw", "procedural-draw", "braid", "panel", "surface-loft", "surface-guide"\]\.includes\(deps\.sel\.activeTool\)[\s\S]*pointRemovalCandidate[\s\S]*deps\.activateStrandControlPoint\(hit\.object, event\)[\s\S]*stopImmediatePropagation\(\)/
  );
  assert.doesNotMatch(
    source,
    /function prepareCurvePointSelection\(event\)[\s\S]{0,700}\["select", "place", "draw"/
  );
  assert.match(
    source,
    /const surfaceAnchorHit = modelingClick && surfaceAnchorHandle && surfaceAnchorHandle\.visible !== false[\s\S]*raycaster\.intersectObject\(surfaceAnchorHandle, false\)/
  );
  assert.doesNotMatch(source, /surfaceAnchorHandle\?\.visible !== false/);
});

test("tapping proportional edit restores transform controls for the selected point", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(
    source,
    /function setProportionalEditing\(enabled\)[\s\S]*refreshCapsuleGuideLoopInfluence\(\);[\s\S]*updateInteractionLocks\(\);[\s\S]*updateAttributeEditorMode\(\)/
  );
  assert.match(
    source,
    /proportionalHotkeyPress = null;[\s\S]*endProportionalSizeEdit\(\);[\s\S]*setProportionalEditing\(!press\.wasEnabled\)/
  );
  assert.match(
    source,
    /function proportionalStrandVisualsActive\(lock\)[\s\S]*sculptState\.state\.proportionalEditing[\s\S]*\["move", "rotate", "scale", "relax"\]\.includes\(sel\.state\.activeTool\)[\s\S]*sel\.state\.selectedPoint\?\.lockId === lock\.id/
  );
  assert.match(
    source,
    /function setActiveTool\(tool\)[\s\S]*const previousTool = sel\.state\.activeTool[\s\S]*proportionalVisualStateChanged[\s\S]*updateLockGeometry\(proportionalLock, \{ immediate: true \}\)/
  );
  assert.match(source, /function strandInfluenceColor\(lock, t\)[\s\S]*!proportionalStrandVisualsActive\(lock\)/);
  // updateProportionalInfluenceColors was removed: proportional coloring now flows
  // through strandInfluenceColor (per-point material colors) instead of a color
  // attribute cache.
  assert.match(
    source,
    /function selectPointsInMarquee\(drag\)[\s\S]*sel\.state\.selectedPoint = null;[\s\S]*locks\.forEach\(\(lock\) => updateCurveObjects\(lock, \{ visible: lock\.id === sel\.state\.selectedId \}\)\)/
  );
  // proportionalInfluenceColorCaches was removed with updateProportionalInfluenceColors.
  assert.match(
    source,
    /function applyProportionalMove\(lock, pointIndex, handle\)[\s\S]*const weight = proportionalWeight\(i, pointIndex\)[\s\S]*lock\.points\[i\]\.copy\(edit\.points\[i\]\)\.add\(delta\.clone\(\)\.multiplyScalar\(weight\)\)/
  );
  assert.match(
    source,
    /function refreshProportionalPreview\(\)[\s\S]*locks\.forEach\(\(lock\) => updateLockGeometry\(lock\)\)[\s\S]*updateCurveObjects\(lock, \{ visible: lock\.id === sel\.state\.selectedId \}\)/
  );
  // refreshProportionalPreview now refreshes per-lock geometry (the earlier
  // no-updateLockGeometry-per-lock contract was reverted), so the old doesNotMatch
  // no longer applies.
  assert.match(
    source,
    /transformControls\.addEventListener\("objectChange", \(\) => \{[\s\S]*syncInputs\(lock\)/
  );
});

test("strand relax independently smooths point positions and authored rotations", async () => {
  const [html, source, localization, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="relaxToolPanel"[\s\S]*id="relaxPosition"[^>]*checked[\s\S]*id="relaxRotation"[^>]*checked/);
  assert.match(source, /relaxToolPanel\.classList\.toggle\("hidden", sel\.state\.activeTool !== "relax"\)/);
  assert.match(css, /#transformToolPanel\.hidden,[\s\S]*#placeStrandToolPanel\.hidden[\s\S]*display:\s*none/);
  assert.match(source, /else if \(sel\.state\.activeTool === "relax"\) panel = relaxToolPanel/);
  assert.match(localization, /"Smooth curve-point positions and their width and depth scales\.":[\s\S]*"Smooth authored curve-point rotations without requiring position relaxation\.":/);

  assert.match(
    source,
    /function beginRelaxEdit\(lock, pointIndex, event\)[\s\S]*relaxPositionInput\.checked[\s\S]*relaxRotationInput\.checked[\s\S]*if \(!relaxPosition && !relaxRotation\) return false[\s\S]*relaxPosition,[\s\S]*relaxRotation/
  );
  assert.match(
    source,
    /function updateRelaxEdit\(event\)[\s\S]*if \(sculptState\.state\.relaxEdit\.relaxPosition\)[\s\S]*curvedRelaxPositionTarget\(sourcePoints, index\)[\s\S]*relaxedPoints\[index\]\.lerp\([\s\S]*if \(sculptState\.state\.relaxEdit\.relaxRotation\)[\s\S]*relaxAngleValue\([\s\S]*if \(sculptState\.state\.relaxEdit\.relaxRotation\) lock\.pointTwists\[index\] = relaxedTwists\[index\]/
  );
  assert.match(
    source,
    /function updateRelaxEdit\(event\)[\s\S]*const weight = sculptState\.state\.proportionalEditing \? proportionalWeight\(index, sculptState\.state\.relaxEdit\.pointIndex\)/
  );
});

test("strand curve root and tip use distinct endpoint colors without a gradient", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /const endpointIndex = lock\.geometryType === "curve-surface"[\s\S]*const endpointCount = lock\.geometryType === "curve-surface"[\s\S]*const endpointColor = endpointIndex === 0[\s\S]*0x8298ff[\s\S]*endpointIndex === endpointCount - 1[\s\S]*0x62edb0[\s\S]*0x58f6ff/);
  assert.match(source, /if \(selectedHandle\) return CONTROL_POINT_SELECTED_COLOR;/);
  assert.match(source, /return endpointColor;/);
});

test("strand control frames preserve authored normal orientation while points move across the world origin", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(
    source,
    /function transportedStrandFrameAt\(lock, curve, t, options = \{\}\)[\s\S]*stepCount[\s\S]*strandGeometryFrameAt\([\s\S]*clampedT \* step \/ stepCount[\s\S]*frame/
  );
  assert.match(
    source,
    /function strandGeometryFrameAt\([\s\S]*makeBasis\(x, tangent, z\)[\s\S]*quaternion: new THREE\.Quaternion\(\)\.setFromRotationMatrix\(matrix\)/
  );
  assert.match(
    source,
    /function curveFrameAtPoint\(lock, pointIndex\)[\s\S]*transportedStrandFrameAt\([\s\S]*new THREE\.CatmullRomCurve3\(lock\.points\)/
  );
  assert.match(
    source,
    /function guidedNormalAt\(lock, point, tangent, t\)[\s\S]*if \(fallback\.dot\(sampled\) < 0\) fallback\.negate\(\)/
  );
  assert.doesNotMatch(
    source,
    /function guidedNormalAt\(lock, point, tangent, t\)[\s\S]{0,900}sampled\.dot\(fallback\)[\s\S]{0,80}sampled\.negate\(\)/
  );
  assert.match(
    source,
    /function twistFromHandle\(lock, pointIndex, handle\)[\s\S]*transportedStrandFrameAt\([\s\S]*twistOverride: 0/
  );
  assert.match(
    source,
    /function beginHandleEdit\(handle = transformControls\.object\)[\s\S]*pointSurfaceNormals: lock\.pointSurfaceNormals\?\.map\(\(normal\) => normal\?\.clone\?\.\(\) \|\| null\)[\s\S]*function applyHierarchicalRotate\(lock, pointIndex, handle\)[\s\S]*rotateGuideNormal[\s\S]*applyQuaternion\(rotation\)\.normalize\(\)[\s\S]*pointIndex === range\.start[\s\S]*lock\.pointTwists\[i\] = edit\.pointTwists\[i\][\s\S]*return;[\s\S]*const deltaTwist/
  );
  assert.match(
    source,
    /function syncUnifiedCurveSurfaceMirror\(lock, sourcePointIndex, tool = sel\.state\.activeTool\)[\s\S]*tool === "rotate"[\s\S]*lock\.points\[index\]\.distanceToSquared\(edit\.points\[index\]\)[\s\S]*controllerRoot[\s\S]*!\(tool === "rotate" && controllerRoot\)/
  );
});

test("rotate and relax tools use compact line-and-cone curve normal indicators", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [boneViewHandles] = await Promise.all([
    readFile(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8"),
  ]);

  // moved to modules/bones/bone-view-handles.js
  assert.match(boneViewHandles,
    /function createCurveNormalIndicator\(\)[\s\S]*new THREE\.Line\([\s\S]*new THREE\.ConeGeometry\(0\.075, 0\.24, 10\)[\s\S]*indicator\.add\(shaft, cone\)/
  );
  assert.match(
    source,
    /const length = 0\.13 \+ scale \* 0\.06;[\s\S]*arrow\.scale\.setScalar\(length\)[\s\S]*arrow\.quaternion\.setFromUnitVectors[\s\S]*\["rotate", "relax"\]\.includes\(sel\.state\.activeTool\)/
  );
  assert.doesNotMatch(source, /createOutlineArrowGeometry/);
});

test("hair card toggle sweeps the upper authored profile arc as an open double-sided quad surface", async () => {
  const [html, source, localization, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [strandGeometry, branchBridge, materialUi, branchSweep] = await Promise.all([
    readFile(new URL("../modules/geometry/strand-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/branch-bridge.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/material/material-ui.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/branch-sweep.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id=["']hairCardControl["'][\s\S]*?id=["']hairCard["'][^>]*type=["']checkbox["']/);
  assert.match(html, /id=["']strandProfileLabel["'][\s\S]*?id=["']hairCardControl["']/);
  assert.match(html, /id=["']strandHairCardCoveragePreview["'][^>]*class=["'][^"']*hair-card-coverage-path/);
  assert.match(html, /id=["']sweepProfileHairCardCoveragePath["'][^>]*class=["'][^"']*hair-card-coverage-path/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /function createHairCardGeometry\(lock, curve, profilePoints\)/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /upperProfileArcIndices\(closedTopology\.samples\.map\(\(sample\) => sample\.point\)\)/);
  assert.match(source, /strandRadiusAt\(lock, t, "x", 1, profile\.x\)/);
  assert.match(source, /strandRadiusAt\(lock, t, "z", 1, profile\.z\)/);
  // moved to modules/geometry/branch-bridge.js
  assert.match(branchBridge, /quadFaces\.push\(\[a, c, d, b\]\)/);
  // moved to modules/geometry/branch-bridge.js
  assert.match(branchBridge, /geometry\.userData\.quadFaces = quadFaces/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /geometry\.userData\.openSurface = true/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /lock\.geometryType === "strand" && lock\.hairCard[\s\S]*createHairCardGeometry\(lock, curve, profilePoints\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function strandUsesDoubleSidedMaterial\(lock\)[\s\S]*lock\?\.hairCard[\s\S]*THREE\.DoubleSide/);
  assert.match(source, /const hairCardIncompatibleControls = \[\s*"#strandSplitControls"\s*\]/);
  assert.match(source, /hairCardIncompatibleControls\.forEach\(\(control\) => control\.classList\.toggle\("hair-card-hidden", enabled\)\)/);
  assert.match(source, /hairCardInput\.addEventListener\("change"/);
  assert.match(source, /function renderHairCardCoveragePath\(path, profile, visible, mapPoint\)/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /deps\.renderHairCardCoveragePath\(\s*deps\.sweepProfileHairCardCoveragePath/);
  assert.match(css, /\.hair-card-coverage-path,[\s\S]*?stroke:\s*#ffd84d/);
  assert.match(localization, /"Hair Card":\s*"\\u30d8\\u30a2\\u30ab\\u30fc\\u30c9"/);
  assert.match(css, /\.hair-card-hidden\s*\{[\s\S]*?display:\s*none !important;/);
});

test("strand split controls expose multi-zipper add/remove stepper", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
  ]);
  // The strand Split Tip controls carry a zipper +/- stepper mirroring the panel one.
  // 0.2.132：锚点从已删除的 #strandSplitGap 改为 #strandSplitTipLength（stepper 之后的下一个
  // 控件）。**必须保留一个后继锚点**：只断言三个 id 的话，stepper 被整段搬到容器外也能通过。
  assert.match(html, /id=["']strandSplitControls["'][\s\S]*?id=["']removeStrandSplit["'][\s\S]*?id=["']strandSplitCount["'][\s\S]*?id=["']addStrandSplit["'][\s\S]*?id=["']strandSplitTipLength["']/);
  // 全局 Split Spacing 滑杆已随「segment separate」语义删除，不得复活。
  assert.doesNotMatch(html, /id=["']strandSplitGap["']/, "the global Split Spacing slider must stay deleted");
  // Multi-zipper cap constant and clone/normalize default to it (not truncated to 1).
  assert.match(source, /const STRAND_SPLIT_MAX = \d+;/);
  assert.match(source, /function normalizeStrandSplits\(value, legacyPosition, legacyHeight, maxCount = STRAND_SPLIT_MAX\)/);
  // Buttons are wired to the segment control api's strand count change.
  assert.match(source, /addStrandSplitButton\?\.addEventListener\("click", \(\) => segmentApi\.changeStrandSplitCount\(1\)\)/);
  assert.match(source, /removeStrandSplitButton\?\.addEventListener\("click", \(\) => segmentApi\.changeStrandSplitCount\(-1\)\)/);
  // Del removes the selected strand zipper before deleting the whole selection.
  assert.match(source, /if \(segmentApi\.deleteSelectedStrandSplit\(\)\) return;/);
});

test("split strands expose a per-segment selector, spread, and curve previews", async () => {
  const [html, source, segmentControl, store] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/segment-control.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/sculpt-edit-store.js", import.meta.url), "utf8"),
  ]);
  // The strand Split Segments block mirrors the panel one: stepper, spread, curve previews.
  assert.match(
    html,
    /id=["']strandSegmentControls["'][\s\S]*?id=["']previousStrandSegment["'][\s\S]*?id=["']strandSegmentLabel["'][\s\S]*?id=["']nextStrandSegment["'][\s\S]*?id=["']strandSegmentSpread["'][\s\S]*?id=["']strandSegmentSpreadValue["']/
  );
  // Spread range matches the SPREAD_MAX clamp the geometry applies (0..0.99).
  assert.match(html, /id=["']strandSegmentSpread["'][^>]*min=["']0["'][^>]*max=["']0\.99["'][^>]*step=["']0\.01["']/);
  // Curve block carries data-segment-curve so the shared preset/pencil dispatch picks it up.
  assert.match(
    html,
    /id=["']strandSegmentCurveControls["'] data-segment-curve=["']1["'][\s\S]*?id=["']strandSegmentTaperPreview["'][\s\S]*?id=["']strandSegmentDepthPreview["']/
  );
  // The block lives inside #strandSplitControls and starts hidden (shown only for split strands).
  assert.match(html, /id=["']strandSplitControls["'][\s\S]*?id=["']strandSegmentControls["'] class=["']draw-shape-controls hidden["']/);
  // New store key is separate from panelSegmentIndex (panel semantics untouched).
  assert.match(store, /panelSegmentIndex: 0, strandSegmentIndex: 0/);
  // Steppers and the spread slider are thin forwards into the segment control api.
  assert.match(source, /previousStrandSegmentButton\?\.addEventListener\("click", \(\) => segmentApi\.stepStrandSegment\(-1\)\)/);
  assert.match(source, /nextStrandSegmentButton\?\.addEventListener\("click", \(\) => segmentApi\.stepStrandSegment\(1\)\)/);
  assert.match(source, /strandSegmentSpread\.addEventListener\("input", \(\) => segmentApi\.applyStrandSegmentSpread\(strandSegmentSpread\.value\)\)/);
  // Pencil buttons resolve the segment target by geometry through one dispatch point.
  assert.match(source, /if \(button\.closest\("\[data-segment-curve\]"\)\) segmentApi\.openSegmentCurveEditor\(button\.dataset\.curveKey\)/);
  // The strand segment block is refreshed from the same entry as the rest of the split inputs.
  assert.match(source, /syncStrandSplitTipInputs\(target\);[\s\S]{0,200}segmentApi\.syncStrandSegmentControls\(target\)/);
  // Tip Clump authoring materializes before writing (materialize-before-authoring rule).
  assert.match(
    segmentControl,
    /function applyStrandSegmentSpread[\s\S]*?materializeStrandSplitBones\(target\)[\s\S]*?bones\[index\]\.tipClump = tipClump/
  );
});

test("the per-segment spread slider is labelled Tip Clump on BOTH geometries, ids unchanged", async () => {
  const [html, zh, ja] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-zh.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
  ]);
  // 0.2.130 rename: the user-facing label became "Tip Clump" on panels AND ordinary strands.
  // 0.2.132: the persisted field followed suit (bone.spread -> bone.tipClump, reads fall back
  // so old .ahs files keep their values). The element ids and the range (0..0.99) are
  // deliberately UNCHANGED — they are this contract's frozen surface.
  for (const id of ["panelSegmentSpread", "strandSegmentSpread"]) {
    assert.match(
      html,
      new RegExp(`>Tip Clump <input id=["']${id}["']`),
      `${id} is labelled "Tip Clump"`
    );
  }
  assert.equal(
    (html.match(/Segment Spread/g) || []).length,
    0,
    "no visible \"Segment Spread\" label survives the rename"
  );
  // Ids / readouts / range still exist exactly as before the rename.
  assert.match(html, /id=["']panelSegmentSpreadValue["']/);
  assert.match(html, /id=["']strandSegmentSpreadValue["']/);
  assert.match(html, /id=["']panelSegmentSpread["'][^>]*max=["']0\.99["']/);
  // Localization: the key follows the English source string, so the old key must be gone
  // and the new one present in both non-English catalogs (otherwise the label falls back
  // to English while every neighbouring control stays translated).
  for (const [name, catalog] of [["loc-zh", zh], ["loc-ja", ja]]) {
    assert.doesNotMatch(catalog, /"Segment Spread":/, `${name} drops the stale key`);
    assert.match(catalog, /"Tip Clump":/, `${name} translates the new label`);
  }
});

test("hair card state propagates through defaults, drawing, mirrors, history, projects, and presets", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [creationPresets, drawFlow] = await Promise.all([
    readFile(new URL("../modules/io/creation-presets.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
  ]);

  assert.match(source, /const strandCreationDefaults = \{[\s\S]*?hairCard: false/);
  assert.match(source, /lock\.hairCard = Boolean\(base\.hairCard\)/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /hairCard: extensionLock\?\.hairCard \?\? Boolean\(deps\.strandCreationDefaults\.hairCard\)/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /hairCard: Boolean\(setting\("hairCard", stroke\.hairCard \?\? deps\.strandCreationDefaults\.hairCard\)\)/);
  assert.match(source, /partner\.hairCard = Boolean\(lock\.hairCard\)/);
  assert.match(source, /hairCard: Boolean\(snapshot\.hairCard\)/);
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /hairCard: Boolean\(source\.hairCard\)/);
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /"profileTrimRoundness", "hairCard"/);
});

test("reference images support viewport overlays and transformable 3D planes with persistence", async () => {
  const [html, source, css, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  const [referenceHead, guideSystem, scalpBuilder] = await Promise.all([
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id=["']referenceMenuToggle["'][\s\S]*?id=["']referenceMenu["'][\s\S]*?id=["']createViewportReferenceMenu["'][\s\S]*?Create 2D Viewport Reference[\s\S]*?id=["']createPlaneReferenceMenu["'][\s\S]*?Create 3D Plane Reference/);
  assert.doesNotMatch(html, /id=["']materialsMenuToggle["']|id=["']materialsMenu["']|id=["']referenceImagesMode["']/);
  assert.match(html, /id=["']referenceImageFile["'][^>]*accept=["'][^"']*image\/png/);
  assert.match(html, /id=["']viewportReferenceImages["'][^>]*class=["']viewport-reference-images["']/);
  assert.match(html, /id=["']referenceImageDropTarget["'][^>]*class=["']reference-image-drop-target["'][\s\S]*?data-reference-drop-target=["']front["'][\s\S]*?data-reference-drop-target=["']back["'][\s\S]*?data-reference-drop-target=["']left["'][\s\S]*?data-reference-drop-target=["']right["'][\s\S]*?id=["']referenceOverlayDropMarker["']/);
  assert.doesNotMatch(html, /reference-image-drop-card[^>]*data-reference-drop-target=["']overlay["']/);
  assert.match(html, /id=["']referenceImagePanel["'][\s\S]*?id=["']addViewportReference["'][\s\S]*?id=["']addPlaneReference["']/);
  assert.match(html, /id=["']strandOutlinerTab["'][\s\S]*?id=["']guideOutlinerTab["'][\s\S]*?id=["']referenceOutlinerTab["'][\s\S]*?id=["']guideOutliner["'][\s\S]*?id=["']referenceOutliner["']/);
  assert.match(html, /id=["']referenceImageType["'][\s\S]*?value=["']overlay["'][\s\S]*?value=["']plane["']/);
  assert.match(html, /<div class=["']toggle-row reference-visibility-row["'][\s\S]*?<input id=["']referenceImageVisible["'][^>]*aria-label=["']Visible["']/);
  assert.doesNotMatch(html, /<label[^>]*for=["']referenceImageVisible["']/);
  assert.match(html, /id=["']referenceImageFlipX["'][^>]*aria-pressed=["']false["'][^>]*>Flip Horizontal<\/button>/);
  assert.doesNotMatch(html, /data-tool=["']crop["']|Crop reference tool/);
  assert.match(html, /id=["']referenceCropHandles["'][^>]*class=["']reference-crop-handles hidden["'][\s\S]*?data-crop-anchor=["']nw["'][\s\S]*?data-crop-anchor=["']ne["'][\s\S]*?data-crop-anchor=["']se["'][\s\S]*?data-crop-anchor=["']sw["']/);
  assert.doesNotMatch(html, /data-crop-anchor=["'](?:n|e|s|w)["']/);
  assert.match(css, /\.reference-crop-handles > span\s*\{[\s\S]*width: 40px[\s\S]*border: 0[\s\S]*background: transparent/);
  assert.doesNotMatch(html, /crop-picker-debug/);
  assert.doesNotMatch(css, /#ff3030|#8fcf00|reference-overlay-scale-handle::after/);
  assert.match(css, /\.reference-crop-handles > span:hover::before\s*\{[\s\S]*border-color: #fff2aa[\s\S]*drop-shadow/);
  assert.match(css, /\[data-crop-anchor="nw"\]\s*\{[\s\S]*translate\(calc\(-100% - 18px\), calc\(-100% - 18px\)\)[\s\S]*\[data-crop-anchor="nw"\]::before[\s\S]*border-right-width: 3px[\s\S]*border-bottom-width: 3px/);
  assert.match(css, /\[data-crop-anchor="se"\]\s*\{[\s\S]*translate\(18px, 18px\)[\s\S]*\[data-crop-anchor="se"\]::before[\s\S]*border-top-width: 3px[\s\S]*border-left-width: 3px/);
  assert.match(html, /id=["']resetReferenceImageCrop["'][^>]*>Reset Crop<\/button>/);
  assert.match(html, /id=["']referenceImageView["'][\s\S]*?value=["']front["'][\s\S]*?value=["']back["'][\s\S]*?value=["']left["'][\s\S]*?value=["']right["']/);
  assert.match(html, /id=["']referenceImageSnappedViewOnlyRow["'][\s\S]*?id=["']referenceImageSnappedViewOnlyLabel["'][\s\S]*?id=["']referenceImageSnappedViewOnly["'][^>]*type=["']checkbox["']/);
  assert.match(html, /<div id=["']referencePlaneInFrontRow["'][^>]*class=["']toggle-row["'][\s\S]*?<input id=["']referencePlaneInFront["'][^>]*checked/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function createReferenceImageRuntime\(reference\)[\s\S]*reference\.type === "overlay"[\s\S]*new THREE\.PlaneGeometry/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /new THREE\.TextureLoader\(\)\.load\(reference\.source\)[\s\S]*applyReferenceImageRuntime\(reference\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /if \(texture\) \{[\s\S]*texture\.needsUpdate = true;/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /new THREE\.MeshBasicMaterial\(\{[\s\S]*map: texture[\s\S]*side: THREE\.DoubleSide[\s\S]*depthWrite: false/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /front: \{ position: \[0, 0\.8, 2\.4\]/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /back: \{ position: \[0, 0\.8, -2\.4\]/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /left: \{ position: \[-2\.4, 0\.8, 0\], rotation: \[0, -Math\.PI \/ 2, 0\]/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /right: \{ position: \[2\.4, 0\.8, 0\], rotation: \[0, Math\.PI \/ 2, 0\]/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /"1,0,0": "right"[\s\S]*"-1,0,0": "left"/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /left: \{ axis: "x", sign: -1 \}[\s\S]*right: \{ axis: "x", sign: 1 \}/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /const planeInFront = snapshot\.planeInFront !== false/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /planeInFront: reference\.planeInFront !== false/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /flipX: Boolean\(snapshot\.flipX\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /flipX: Boolean\(reference\.flipX\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /crop: normalizeReferenceCrop\(snapshot\.crop\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /crop: \{ \.\.\.normalizeReferenceCrop\(reference\.crop\) \}/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /reference\.imageElement\.style\.transform = reference\.flipX \? "scaleX\(-1\)" : "none"/);
  assert.doesNotMatch(source, /createReferencePlaneCropGeometry|updateReferencePlaneCropGeometry/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /texture\.repeat\.x = reference\.flipX \? -1 : 1[\s\S]*texture\.offset\.x = reference\.flipX \? 1 : 0/);
  assert.match(source, /referenceImageFlipX\.addEventListener\("click"[\s\S]*pushUndoState\(\)[\s\S]*reference\.flipX = !reference\.flipX/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function beginReferenceCrop\(event\)[\s\S]*reference\?\.type !== "overlay"/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /const REFERENCE_CROP_ANCHORS = Object\.freeze\(\["nw", "ne", "se", "sw"\]\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /const directAnchor = event\.target\.closest\?\.\("\[data-crop-anchor\]"\)[\s\S]*REFERENCE_CROP_ANCHORS\.includes\(directAnchor\) \? directAnchor : null/);
  assert.doesNotMatch(source, /REFERENCE_CROP_HANDLE_HIT_RADIUS|referenceCropAnchorAtPointer/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function updateReferenceCrop\(event\)[\s\S]*pushUndoState\(\)[\s\S]*reference\.crop = normalizeReferenceCrop/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function finishReferenceCrop\(event, \{ cancel = false \} = \{\}\)[\s\S]*drag\.startCrop/);
  assert.match(source, /resetReferenceImageCrop\.addEventListener\("click"[\s\S]*pushUndoState\(\)[\s\S]*left: 0, top: 0, right: 1, bottom: 1/);
  assert.match(localization, /"Flip Horizontal":\s*"\\u6c34\\u5e73\\u53cd\\u8ee2"/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function setReferencePlaneInFront\(reference, inFront\)[\s\S]*reference\.position\[axis\] = distance \* sign/);
  assert.match(source, /referencePlaneInFront\.addEventListener\("change"[\s\S]*setReferencePlaneInFront/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /if \(Math\.abs\(depthCoordinate\) > 0\.0001\) reference\.planeInFront = depthCoordinate > 0/);
  assert.match(source, /depthTest: true[\s\S]*depthWrite: false/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /mesh\.renderOrder = 0/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function migratedReferencePlanePosition\(snapshot, view, placement\)[\s\S]*isUntouchedLegacySideReferencePlacement/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function migratedReferencePlaneRotation\(snapshot, view, placement\)[\s\S]*isUntouchedLegacySideReferencePlacement[\s\S]*isInwardFacingSideReferencePlacement/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function isInwardFacingSideReferencePlacement\(snapshot, view\)[\s\S]*inwardRotationY/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /planePlacementVersion: 4/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function referencePlanePlacement\(view = "front", inFront = true\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function attachReferenceImageTransform\(\)[\s\S]*\["move", "scale"\]/);
  assert.match(source, /referenceScaleDrag[\s\S]*handle\.scale\.copy\(start\)\.multiplyScalar/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /snappedViewOnly: type === "plane" && Boolean\(snapshot\.snappedViewOnly\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /snappedViewOnly: Boolean\(reference\.snappedViewOnly\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /const newViewportOverlay = type === "overlay"[\s\S]*snapshot\.x == null[\s\S]*snapshot\.y == null/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /snapshot\.x \?\? \(newViewportOverlay \? 2 : 50\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /snapshot\.y \?\? \(newViewportOverlay \? 2 : 50\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /reference\.overlayAnchor === "top-left"[\s\S]*style\.transform = topLeftAnchored \? "none"/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /overlayAnchor: reference\.overlayAnchor/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /overlayConfigured: Boolean\(reference\.overlayConfigured\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /planeConfigured: Boolean\(reference\.planeConfigured\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function setReferenceImageType\(reference, nextType\)[\s\S]*disposeReferenceImageRuntime\(reference\)[\s\S]*createReferenceImageRuntime\(reference\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /selectReferenceImage\(reference\.id\);\s*if \(nextType === "plane"\) deps\.setOrthographicView\(true\)/);
  assert.match(source, /referenceImageType\.addEventListener\("change"[\s\S]*setReferenceImageType/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /reference\.planeScale = reference\.scale/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /reference\.overlayScale = nextScale/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function isSupportedReferenceImageFile\(file\)[\s\S]*png\|jpe\?g\|webp\|gif/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /async function addReferenceImagesFromFiles\([\s\S]*type = "overlay",[\s\S]*\{ view = "front", overlayPosition = null \} = \{\}[\s\S]*Promise\.allSettled[\s\S]*overlayAnchor: "center"[\s\S]*x: overlayPosition\.x[\s\S]*y: overlayPosition\.y/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /if \(type === "plane" && added\.length\) deps\.setOrthographicView\(true\)/);
  // prepareReferenceImageDrop was inlined into the dragenter/dragover handlers in app.js.
  assert.match(source, /window\.addEventListener\("dragenter"[\s\S]*referenceHeadApi\.dragContainsReferenceImage\(event\)[\s\S]*referenceHeadApi\.setReferenceImageDragActive\(true\)[\s\S]*referenceHeadApi\.setReferenceDropHover\(event\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function referenceDropDestination\(event\) \{[\s\S]*\["overlay", "front", "back", "left", "right"\][\s\S]*viewportPanel\.contains\(event\.target\) \? "overlay" : null/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function viewportOverlayDropPosition\(event\) \{[\s\S]*viewport\.getBoundingClientRect\(\)[\s\S]*event\.clientX[\s\S]*event\.clientY/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function setReferenceDropHover\(event = null\) \{[\s\S]*referenceOverlayDropMarker\.classList\.remove\("visible"\)[\s\S]*referenceOverlayDropMarker\.style\.left[\s\S]*referenceOverlayDropMarker\.classList\.add\("visible"\)/);
  assert.match(source, /window\.addEventListener\("dragover"[\s\S]*dropEffect = "copy"/);
  assert.match(source, /window\.addEventListener\("dragenter"[\s\S]*referenceHeadApi\.dragContainsReferenceImage\(event\)[\s\S]*referenceHeadApi\.setReferenceImageDragActive\(true\)/);
  assert.match(source, /window\.addEventListener\("dragover"[\s\S]*referenceHeadApi\.setReferenceImageDragActive\(true\)[\s\S]*referenceHeadApi\.setReferenceDropHover\(event\)/);
  assert.match(source, /window\.addEventListener\("drop"[\s\S]*referenceDropDestination\(event\)[\s\S]*viewportOverlayDropPosition\(event\)[\s\S]*if \(!destination\) return[\s\S]*addReferenceImagesFromFiles\(files, type,[\s\S]*view: type === "plane" \? destination : "front",[\s\S]*overlayPosition/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function snappedReferenceImageView\(\)[\s\S]*!deps\.viewportState\.orthographicView \|\| !snapped[\s\S]*REFERENCE_VIEW_BY_CAMERA_AXIS/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function updateReferencePlaneVisibility\(\)[\s\S]*reference\.view === snappedView/);
  assert.match(source, /referenceImageSnappedViewOnly\.addEventListener\("change"/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /referenceImageSnappedViewOnlyLabel\.textContent = `Only in \$\{viewLabel\} Orthogonal view`/);
  assert.match(source, /updateReferencePlaneVisibility\(\);[\s\S]*updateViewPlaneGrid\(\)/);
  assert.match(source, /referenceImages: referenceImages\.map\(referenceHeadApi\.serializeReferenceImage\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /const REFERENCE_OUTLINER_GROUPS = Object\.freeze\(\[[\s\S]*Viewport Overlays[\s\S]*Front[\s\S]*Left[\s\S]*Right[\s\S]*Back/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function renderReferenceOutliner\(\)[\s\S]*referenceOutlinerGroup\(reference\)[\s\S]*header\.dataset\.referenceDropTarget = group\.id[\s\S]*createOutlinerVisibilityToggle/);
  assert.match(source, /referenceOutlinerTab\.addEventListener\("click"[\s\S]*setOutlinerPanelCollapsed\(false\)[\s\S]*setOutlinerTab\("references"\)/);
  assert.match(source, /guideOutlinerTab\.addEventListener\("click"[\s\S]*setOutlinerPanelCollapsed\(false\)[\s\S]*setOutlinerTab\("guides"\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function requestReferenceImage\(type\) \{[\s\S]*setViewportEditMode\("reference"\)[\s\S]*pendingReferenceImageType = type[\s\S]*referenceImageFile\.click\(\)/);
  assert.match(source, /createViewportReferenceMenu\.addEventListener\("click", \(\) => referenceHeadApi\.requestReferenceImage\("overlay"\)\)/);
  assert.match(source, /createPlaneReferenceMenu\.addEventListener\("click", \(\) => referenceHeadApi\.requestReferenceImage\("plane"\)\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function outlinerGuides\(\)[\s\S]*guide\.type !== "curve-lattice"[\s\S]*guide\.standalone/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /function createScalpGuideOutlinerRow\(\) \{[\s\S]*label: "Scalp Guide"[\s\S]*setScalpGuideVisibility\(!deps\.scalpState\.scalpGuideVisible\)[\s\S]*type: "scalp-guide"/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function renderGuideOutliner\(\)[\s\S]*createScalpGuideOutlinerRow\(\)[\s\S]*guide-outliner-item[\s\S]*selectGuide\(guide\.id\)/);
  assert.match(html, /id=["']clumpContextMenu["'][\s\S]*id=["']editScalpOutlinerAction["'][\s\S]*Edit Scalp/);
  assert.match(source, /function showOutlinerContextMenu\(event, target\) \{[\s\S]*target\.type === "scalp-guide"[\s\S]*editScalpOutlinerAction\.classList\.toggle\("hidden", !isScalpGuide\)/);
  assert.match(source, /editScalpOutlinerAction\.addEventListener\("click"[\s\S]*setViewportEditMode\("guide"\)[\s\S]*setScalpBuilderEditing\(true\)/);
  assert.match(html, /id=["']surfaceGuideFitScalp["'][\s\S]*Create Capsule Guide From Scalp/);
  assert.match(localization, /"Create Capsule Guide From Scalp":/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /thumbnail\.className = "reference-outliner-thumbnail"[\s\S]*thumbnail\.src = reference\.source/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /status\.className = "reference-outliner-status"[\s\S]*"Ortho Only"[\s\S]*"All Views"/);
  assert.match(source, /function createOutlinerVisibilityToggle\([\s\S]*outliner-visibility-toggle[\s\S]*onToggle\(\)/);
  assert.match(source, /function setLocksOutlinerVisibility\(targets, visible\)[\s\S]*lock\.outlinerVisible = Boolean\(visible\)/);
  assert.match(source, /outlinerVisible: lock\.outlinerVisible !== false/);
  assert.match(source, /outlinerVisible: guide\.outlinerVisible !== false/);
  assert.match(source, /return lock\.outlinerVisible !== false[\s\S]*visibleStrandRegions\.has\(region\)/);
  assert.match(css, /\.outliner-tab\.active[\s\S]*\.reference-outliner-group\.open > \.reference-outliner-group-items/);
  assert.match(css, /\.outliner-tabs\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,[\s\S]*border-bottom:\s*1px solid #332e35/);
  // The outliner titlebar (with the Outliner label and collapse toggle) was restored.
  assert.match(html, /class=["']outliner-titlebar["'][\s\S]*<span>Outliner<\/span>[\s\S]*id=["']toggleOutlinerPanel["'][\s\S]*class=["']outliner-tabs["'][\s\S]*id=["']strandOutlinerTab["'][\s\S]*id=["']guideOutlinerTab["'][\s\S]*id=["']referenceOutlinerTab["']/);
  assert.match(css, /\.reference-outliner-thumbnail\s*\{[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.reference-outliner-select\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(72px, 1fr\)/);
  assert.match(css, /\.reference-outliner-status\s*\{[\s\S]*font-size:\s*11px/);
  assert.match(css, /\.outliner-visibility-toggle::before[\s\S]*border-radius:\s*75% 18%[\s\S]*rotate\(45deg\)/);
  assert.match(css, /\.outliner-visibility-toggle\.visible\s*\{[\s\S]*color:\s*#f0d75b/);
  assert.match(localization, /"Viewport Overlays":\s*"\\u30d3\\u30e5\\u30fc\\u30dd\\u30fc\\u30c8/);
  assert.match(source, /restorePlan\.scene\.referenceImages\.forEach\(\(snapshot\) => referenceHeadApi\.addReferenceImage\(snapshot, \{ select: false \}\)\)/);
  assert.match(source, /function disposeAllEditableObjects\(\) \{\s*restoreUvCheckerPreview\(\);\s*referenceHeadApi\.clearReferenceImages\(\)/);
  assert.match(css, /#viewport\s*\{[\s\S]*?z-index:\s*1/);
  assert.match(css, /\.viewport-reference-images\s*\{[\s\S]*?z-index:\s*0[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.reference-image-drop-target\s*\{[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.viewport-panel\.reference-image-drag-active \.reference-image-drop-target\s*\{[\s\S]*opacity:\s*1;[\s\S]*pointer-events:\s*auto/);
  assert.match(css, /\.reference-image-drop-options\s*\{[\s\S]*grid-template-columns:\s*repeat\(4/);
  assert.match(css, /\.reference-image-drop-card\.reference-drop-hover\s*\{[\s\S]*border-style:\s*solid;[\s\S]*transform:\s*scale\(1\.025\)/);
  assert.match(css, /\.reference-outliner-group-head\.reference-drop-hover\s*\{[\s\S]*outline:\s*2px solid #ffdc66/);
  assert.match(css, /\.reference-overlay-drop-marker\s*\{[\s\S]*width:\s*150px;[\s\S]*height:\s*96px;[\s\S]*pointer-events:\s*none/);
  assert.match(css, /\.reference-overlay-drop-marker\.visible\s*\{\s*display:\s*grid/);
  assert.match(css, /body\.reference-image-drag-active \.reference-outliner-group-head\[data-reference-drop-target\]/);
  assert.match(css, /\.reference-image-panel\s*\{[\s\S]*?top:\s*68px;[\s\S]*?max-height:\s*calc\(100% - 86px\)/);
  assert.match(css, /#referencePlaneInFrontRow\.hidden/);
  assert.match(css, /\.viewport-tools\s*\{[\s\S]*?top:\s*100px;[\s\S]*?z-index:\s*3/);
  assert.match(localization, /"Reference Images":\s*"\\u53c2\\u8003\\u753b\\u50cf"/);
  assert.match(localization, /"Create 2D Viewport Reference":/);
  assert.match(localization, /"Create 3D Plane Reference":/);
  assert.match(localization, /"Only in Front Orthogonal view":/);
  assert.match(localization, /"Only in Back Orthogonal view":/);
  assert.match(localization, /"Only in Left Orthogonal view":/);
  assert.match(localization, /"Only in Right Orthogonal view":/);
  assert.match(localization, /"Drop image as reference":/);
  assert.match(localization, /"Drop anywhere in the viewport for a 2D overlay, or choose a 3D plane view\.":/);
  assert.match(localization, /"2D Overlay":/);
  assert.match(localization, /"Viewport Overlay":/);
  assert.match(localization, /"3D Plane":/);
  assert.match(localization, /"In front of mesh":/);
});

test("dropping AHS and OBJ files uses destructive confirmation and explicit OBJ routing", async () => {
  const [html, source, css, localization, fileDrop, recentProjects] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/file-drop.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/recent-projects.js", import.meta.url), "utf8")
  ]);

  const [referenceHead, ioTail, projectFiles] = await Promise.all([
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/io-tail.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-files.js", import.meta.url), "utf8"),
  ]);

  assert.match(fileDrop, /function applicationDropFileKind\(file\)[\s\S]*\\\.ahs\$[\s\S]*return "project"[\s\S]*\\\.obj\$[\s\S]*return "obj"/);
  assert.match(html, /id="recentProjectsMenu"[\s\S]*Recent Projects[\s\S]*id="recentProjectsSubmenu"[\s\S]*No recent projects/);
  assert.match(html, /id="dropImportDialog"[\s\S]*You will lose any unsaved progress in the current project/);
  assert.match(html, /id="dropObjTargetChoices"[\s\S]*value="head" checked[\s\S]*value="body"[\s\S]*value="object" disabled[\s\S]*Not yet supported/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function openDroppedApplicationFilePrompt\(file, \{ handle = null \} = \{\}\)[\s\S]*applicationDropFileKind\(file\)[\s\S]*"Open Dropped Project\?"[\s\S]*"Import Dropped OBJ\?"[\s\S]*deps\.dropImportDialog\.showModal\(\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /async function confirmDroppedApplicationFile\(\)[\s\S]*await openHairProjectFile\(file[\s\S]*objTarget === "body"[\s\S]*deps\.referenceHeadApi\.importFullBodyMeshFile\(file\)[\s\S]*objTarget === "head"[\s\S]*deps\.referenceHeadApi\.importHeadMeshFile\(file\)/);
  assert.match(source, /window\.addEventListener\("dragover"[\s\S]*ioApi\.dragContainsApplicationFile\(event\)[\s\S]*referenceHeadApi\.setReferenceImageDragActive\(false\)[\s\S]*referenceHeadApi\.dragContainsReferenceImage\(event\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function dragContainsReferenceImage\(event\)[\s\S]*SUPPORTED_REFERENCE_IMAGE_TYPES\.has[\s\S]*isSupportedReferenceImageFile\(file\)/);
  assert.match(source, /window\.addEventListener\("drop", async \(event\) => \{[\s\S]*applicationFiles = transferredFiles\.filter\(\(file\) => applicationDropFileKind\(file\)\)[\s\S]*Drop one \.ahs or \.obj file at a time[\s\S]*ioApi\.openDroppedApplicationFilePrompt\(applicationFiles\[0\], \{ handle \}\)[\s\S]*transferredFiles\.filter\(referenceHeadApi\.isSupportedReferenceImageFile\)/);
  assert.match(css, /\.drop-import-dialog[\s\S]*\.drop-obj-target-choices[\s\S]*label:has\(input:checked\)/);
  assert.match(css, /\.app-menu-submenu[\s\S]*left: calc\(100% \+ 5px\)/);
  assert.match(recentProjects, /MAX_RECENT_PROJECTS = 10[\s\S]*indexedDB[\s\S]*rememberRecentProject/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /async function renderRecentProjectsMenu\(\)[\s\S]*listRecentProjects\(\)[\s\S]*openDroppedApplicationFilePrompt/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /async function openHairProjectFile\(file,[\s\S]*safelyRememberRecentProject/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /async function performFileAction[\s\S]*safelyRememberRecentProject/);
  assert.match(localization, /"Open Dropped Project\?":/);
  assert.match(localization, /"Import Dropped OBJ\?":/);
  assert.match(localization, /"Object Mesh":/);
  assert.match(localization, /"Not yet supported\.":/);
  assert.match(localization, /"Recent Projects":/);
  assert.match(localization, /"You will lose any unsaved progress in the current project\.":/);
});

test("viewport display controls can switch between perspective and orthographic projection", async () => {
  const [html, source, css, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id=["']orthographicViewToggle["'][^>]*aria-pressed=["']false["']/);
  assert.match(html, /class=["']viewport-top-controls["'][\s\S]*class=["']bar-actions viewport-display-actions["'][\s\S]*id=["']drawStrandSurface["'][\s\S]*id=["']viewportDrawLayer["'][\s\S]*class=["']viewport-modes["']/);
  assert.doesNotMatch(html, /id=["']resetCamera["']|Reset camera/);
  assert.match(source, /const perspectiveCamera = new THREE\.PerspectiveCamera/);
  assert.match(source, /const orthographicCamera = new THREE\.OrthographicCamera/);
  assert.match(source, /let camera = perspectiveCamera/);
  assert.match(source, /function setOrthographicView\(enabled\)[\s\S]*controls\.object = camera[\s\S]*transformControls\.camera = camera/);
  assert.match(source, /visibleHalfHeight[\s\S]*perspectiveCamera\.position\.copy\(controls\.target\)/);
  assert.match(source, /function updateCameraProjectionForViewport\(\)[\s\S]*orthographicCamera\.left[\s\S]*orthographicCamera\.updateProjectionMatrix/);
  assert.match(source, /orthographicViewToggle\.addEventListener\("click"/);
  assert.match(html, /id=["']multiCameraViewToggle["'][^>]*aria-pressed=["']false["'][^>]*hidden[^>]*aria-hidden=["']true["']/);
  // The dedicated `.viewport-display-actions > button[hidden]` rule was removed; hidden
  // display buttons now rely on the native `hidden` attribute (asserted above).
  assert.match(source, /function setMultiCameraEnabled\(enabled\) \{\s*const nextEnabled = Boolean\(enabled\);\s*if \(nextEnabled && !multiCameraState\.state\.experimentalEnabled\) return;/);
  assert.match(html, /id=["']multiCameraViews["'][^>]*aria-hidden=["']true["'][\s\S]*id=["']multiCameraPerspective["'][^>]*class=["'][^"']*active[^"']*["'][^>]*[\s\S]*?<span>Persp<\/span>[\s\S]*id=["']multiCameraFront["'][\s\S]*id=["']multiCameraRight["'][\s\S]*id=["']multiCameraTop["']/);
  assert.match(source, /function setMultiCameraEnabled\(enabled\)[\s\S]*viewportPanel\.classList\.toggle\("multi-camera-view", multiCameraState\.state\.enabled\)[\s\S]*ensureMultiCameraPreviewRenderers\(\)[\s\S]*resize\(\)/);
  assert.match(source, /function setMultiCameraActiveView\(view,[\s\S]*camera = multiCameraForView\(view\)[\s\S]*controls\.object = camera[\s\S]*transformControls\.camera = camera[\s\S]*container\.classList\.toggle\("active", candidate === view\)/);
  assert.match(source, /function renderNextInactiveMultiCameraPreview\(\)[\s\S]*filter\(\(\[view\]\) => view !== multiCameraState\.state\.activeView\)[\s\S]*multiCameraState\.state\.previewRenderCursor % inactivePreviews\.length[\s\S]*previewRenderer\.render\(scene, multiCameraForView\(view\)\)[\s\S]*function animate[\s\S]*renderer\.render\(scene, camera\)[\s\S]*renderNextInactiveMultiCameraPreview\(\)/);
  assert.doesNotMatch(source, /querySelector\(["']#resetCamera["']\)/);
  assert.match(css, /\.orthographic-view-button\.active\s*\{/);
  assert.match(css, /\.viewport-panel\.multi-camera-view \.multi-camera-views[\s\S]*\.multi-camera-preview\.active > span\s*\{[^}]*color:\s*#58f6ff/);
  assert.match(css, /\.viewport-top-controls\s*\{[^}]*flex-wrap:\s*nowrap[^}]*width:\s*calc\(100% - 24px\)/);
  assert.match(css, /\.viewport-top-controls\s*\{[^}]*gap:\s*4px/);
  assert.match(css, /\.viewport-draw-settings\s*\{[^}]*gap:\s*4px;[^}]*height:\s*38px/);
  assert.match(css, /\.viewport-display-actions\s*\{[^}]*gap:\s*4px;[^}]*height:\s*38px/);
  assert.match(css, /\.viewport-modes\s*\{[^}]*gap:\s*4px;[^}]*height:\s*38px/);
  assert.match(css, /\.viewport-top-controls\.two-row\s*\{[^}]*grid-template-areas:\s*"settings settings"\s*"display modes"[^}]*row-gap:\s*4px[^}]*transform:\s*translateX\(calc\(-50% \+ var\(--viewport-top-controls-overlap-shift, 0px\)\)\)[\s\S]*?\.viewport-top-controls\.two-row \.viewport-draw-settings\s*\{[^}]*grid-area:\s*settings[\s\S]*?\.viewport-top-controls\.two-row \.viewport-display-actions\s*\{[^}]*grid-area:\s*display[\s\S]*?\.viewport-top-controls\.two-row \.viewport-modes\s*\{[^}]*grid-area:\s*modes/);
  assert.match(source, /function syncViewportTopControlRows\(\)[\s\S]*--viewport-top-controls-overlap-shift", "0px"[\s\S]*classList\.remove\("two-row"\)[\s\S]*Math\.min\(\.\.\.groups\.map[\s\S]*const useTwoRows = oneRowLeft - workspaceBounds\.right <= 4[\s\S]*getBoundingClientRect\(\)\.left[\s\S]*Math\.max\(0, workspaceBounds\.right \+ 4 - liveSurfaceLeft\)[\s\S]*--viewport-top-controls-overlap-shift/);
  assert.match(source, /new ResizeObserver\(syncViewportTopControlRows\)\.observe\(viewportPanel\)/);
  // The dedicated `.viewport-display-actions > button, .viewport-modes > .tool-button`
  // square (38px, aspect-ratio 1) rule was removed; the buttons now share the standard
  // tool-button styling inside the top-controls flex rows (asserted above).
  // The `.viewport-display-actions > button:not(.active)` color-mix background rule was
  // removed along with the square-button sizing; display buttons now use the shared
  // tool-button styling.
  assert.match(localization, /"Switch to orthographic view":\s*"\\u6b63\\u6295\\u5f71/);
  assert.doesNotMatch(localization, /"Reset camera":/);
});

test("braid meshes preserve authored quads for viewport topology and OBJ export", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [presetLibrary] = await Promise.all([
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8"),
  ]);

  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /new THREE\.FileLoader\(\)\.load\(path, \(content\) =>/);
  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /annotateBraidObjTopology\(obj, parseObjFaceVertexCounts\(content\)\)/);
  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /faceVertexCounts\.push\(\.\.\.\(/);
  assert.match(source, /sourceFaceVertexCounts\.forEach\(\(faceVertexCount\) =>/);
  assert.match(source, /fanTriangleEdgeMasks\(faceVertexCount\)/);
  assert.match(source, /geometry\.userData\.quadFaces = authoredFaces/);
  assert.match(source, /geometry\.userData\.triangleEdgeMasks = triangleEdgeMasks/);
  assert.match(source, /geometry\.userData\.topology = "authored-polygons"/);
});

test("scalp and strand control points take pointer and hover priority over the transform gizmo", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [scalpBuilder, boneInteraction] = await Promise.all([
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8"),
  ]);

  const [presetLibrary] = await Promise.all([
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8"),
  ]);

  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /function prioritizeScalpBuilderPointSelection\(event\)/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /const pointIndex = hit\.object\.userData\.scalpBuilderLatticeIndex;[\s\S]*selectScalpBuilderCurveLatticePoint\(pointIndex\)/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /if \(pointIndex === deps\.scalpState\.scalpBuilderCurveLattice\.selectedIndex\) return;/);
  assert.match(source, /event\.stopImmediatePropagation\(\)/);
  assert.match(source, /addEventListener\("pointerdown",\s*scalpBuilder\.prioritizeScalpBuilderPointSelection,\s*true\)/);
  assert.match(source, /hoveringSelectedScalpPoint[\s\S]*pointerHitsTransformGizmo\(event\)/);
  assert.match(source, /if \(unselectedScalpPointHasPriority \|\| unselectedStrandPointHasPriority\) transformControls\.axis = null;/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /deps\.raycaster\.intersectObjects\(deps\.scalpState\.scalpBuilderCurveLattice\.handles,\s*false\)/);
  assert.doesNotMatch(source, /SCALP_BUILDER_POINT_PICKER_SCALE|pointPickers|configureScalpBuilderPointPickerOverlay/);
  // moved to modules/bones/bone-interaction.js
  assert.match(
    boneInteraction,
    /function prepareCurvePointSelection\(event\)[\s\S]*const hit = deps\.strandControlPointHitFromEvent\(event, selectedLock\);[\s\S]*deps\.pointerHitsTransformGizmo\(event\)[\s\S]*hit\.object === deps\.transformControls\.object/
  );
  assert.match(
    source,
    /function updateControlPointHover\(event\)[\s\S]*strandPointPriorityActive[\s\S]*unselectedStrandPointHasPriority[\s\S]*transformControls\.axis = null[\s\S]*hoveringAttachedPoint[\s\S]*pointerHitsTransformGizmo\(event\)/
  );
});

test("scalp fine tuning restores editable points while the retired region lattice stays hidden", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [scalpBuilder] = await Promise.all([
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8"),
  ]);

  assert.match(source, /const SCALP_REGION_CURVE_VISUALIZATION_ENABLED = false;/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /function scalpBuilderCurveLatticePointHit\(\) \{\s*if \(!deps\.scalpState\.scalpBuilderEditing \|\| !deps\.scalpState\.scalpBuilderCurveLattice\) return null;/
  );
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /deps\.scalpState\.scalpBuilderCurveLattice\.surface\.visible = deps\.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;[\s\S]*deps\.scalpState\.scalpBuilderCurveLattice\.line\.visible = deps\.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;/
  );
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /line\.renderOrder = 15;\s*line\.visible = deps\.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /surface\.renderOrder = 14;\s*surface\.visible = deps\.SCALP_REGION_CURVE_VISUALIZATION_ENABLED;/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /handle\.visible = deps\.scalpState\.scalpBuilderEditing;/
  );
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /function updateScalpEditingVisibility\(\) \{[\s\S]*deps\.scalpBuilderGroup\.visible = deps\.scalpState\.scalpBuilderEditing;/
  );
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /Select a cyan control point and use the gizmo to fine tune the scalp guide/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(
    scalpBuilder,
    /async function rebuildScalpBuilderTemplateOverlay\(\)[\s\S]*!deps\.SCALP_REGION_CURVE_VISUALIZATION_ENABLED[\s\S]*deps\.scalpBuilderTemplateOverlay\.visible = false;/
  );
});

test("sculpt brushes share brush controls, per-tool strength, and camera-facing clipping debug settings", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [sculptGeometry, placement, referenceHead, boneViewHandles] = await Promise.all([
    readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/placement.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id="sculptBrushDock"[\s\S]*data-tool="sculpt-move"[\s\S]*data-tool="sculpt-smooth"[\s\S]*<\/div>/);
  assert.match(html, /data-tool="sculpt-move"[\s\S]*brush-name">Move<\/span>[\s\S]*brush-suffix"> Brush<\/span>[\s\S]*data-tool="sculpt-smooth"[\s\S]*brush-name">Smooth<\/span>[\s\S]*brush-suffix"> Brush<\/span>/);
  assert.doesNotMatch(html, /data-tool="sculpt-inflate"/);
  assert.doesNotMatch(html.match(/id="sculptBrushDock"[\s\S]*?<\/div>/)?.[0] || "", /sculptBrushRadius|sculptBrushFalloff/);
  assert.match(html, /id="sculptMoveToolPanel"[\s\S]*data-attribute-panel="tools"[\s\S]*id="sculptBrushStrength"[\s\S]*value="0\.2"[\s\S]*>0\.20<\/output>[\s\S]*id="sculptBrushRadius"[\s\S]*id="sculptBrushFalloff"[\s\S]*id="sculptPreserveTipsSetting"[\s\S]*id="sculptPreserveTips"[^>]*checked/);
  const sculptBrushPanel = html.match(/id="sculptMoveToolPanel"[\s\S]*?<\/section>/)?.[0] || "";
  assert.match(sculptBrushPanel, /class="sculpt-brush-debug-settings"[\s\S]*<summary>Debug<\/summary>[\s\S]*id="sculptBrushShowClippingPlane"[\s\S]*id="sculptBrushShowCurves"[\s\S]*id="sculptBrushPlanePosition"[^>]*min="0"[^>]*max="1"[^>]*value="0\.5"/);
  assert.doesNotMatch(sculptBrushPanel, /id="sculptBrushShowClippingPlane"[^>]*checked/);
  assert.doesNotMatch(sculptBrushPanel, /id="sculptBrushShowCurves"[^>]*checked/);
  assert.match(css, /\.sculpt-brush-dock\s*\{[\s\S]*bottom:\s*18px;[\s\S]*transform:\s*translateX\(-50%\)/);
  assert.match(css, /\.sculpt-brush-dock\s*\{[\s\S]*gap:\s*6px;[\s\S]*min-height:\s*38px;[\s\S]*padding:\s*4px 5px;/);
  assert.match(css, /\.sculpt-brush-button\.tool-button\s*\{[\s\S]*min-height:\s*30px;[\s\S]*font-size:\s*11px;/);
  assert.match(css, /\.sculpt-brush-cursor\s*\{[\s\S]*border-radius:\s*50%/);
  assert.match(css, /\.sculpt-brush-debug-settings\s*\{[\s\S]*border-top:/);
  assert.match(source, /cameraFacingPlaneNormal,[\s\S]*inflateSculptPointScale,[\s\S]*pointInCameraFacingHalfSpace,[\s\S]*proportionalSculptWeights,[\s\S]*sculptBrushWeight,[\s\S]*smoothSculptPointDeltas[\s\S]*"\.\/modules\/sculpt\/sculpt-brush\.js\?v=20260814-12"/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function captureSculptMoveStrokeInfluence\([\s\S]*sourceWeights[\s\S]*partnerWeights[\s\S]*influenceBySourceId\.set/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function beginSculptMoveStroke\(event\)[\s\S]*moveInfluence: \["sculpt-move", "sculpt-twist"\]\.includes\(deps\.sel\.activeTool\)[\s\S]*captureSculptMoveStrokeInfluence/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function applySculptMoveStrokeSample\(stroke, clientX, clientY\)[\s\S]*const firstPointIndex = inflateBrushActive \? 0 : 1;[\s\S]*for \(let pointIndex = firstPointIndex; pointIndex < source\.points\.length; pointIndex \+= 1\)/);
  assert.match(source, /const sculptBrushStrengthByTool = \{[\s\S]*"sculpt-move": 0\.2,[\s\S]*"sculpt-smooth": 0\.5,[\s\S]*"sculpt-inflate": 0\.5/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function syncSculptBrushStrengthForActiveTool\(\)[\s\S]*deps\.sculptBrushStrengthByTool\[tool\][\s\S]*deps\.sculptBrushStrengthInput\.value = String/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function updateActiveSculptBrushStrength\(\)[\s\S]*deps\.sculptBrushStrengthByTool\[tool\] = Number\(deps\.sculptBrushStrengthInput\.value\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /const strength = Number\([\s\S]*deps\.sculptBrushStrengthByTool\[deps\.effectiveSculptBrushTool\(\)\][\s\S]*const weight = Math\.max\(sourceWeight, partnerWeight\)[\s\S]*weight \* strength/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /const fixedMoveBrushInfluence = !smoothBrushActive && !inflateBrushActive[\s\S]*initialMoveInfluence = stroke\.moveInfluence\.get\(source\.id\)[\s\S]*initialMoveInfluence\?\.sourceWeights[\s\S]*initialMoveInfluence\?\.partnerWeights/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /const units = sculptBrushUnits\(\)[\s\S]*sculptMoveStroke = \{[\s\S]*units,[\s\S]*function applySculptMoveStrokeSample\(stroke, clientX, clientY\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /stroke\.pendingX = event\.clientX;[\s\S]*requestAnimationFrame\(\(\) => \{[\s\S]*flushSculptMoveStrokeSample\(stroke\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function finishSculptMoveStroke\(event, \{ cancel = false \} = \{\}\)[\s\S]*cancelAnimationFrame\(stroke\.frameRequest\)[\s\S]*if \(!cancel\) flushSculptMoveStrokeSample\(stroke\)/);
  assert.doesNotMatch(source.match(/function applySculptMoveStrokeSample[\s\S]*?function flushSculptMoveStrokeSample/)?.[0] || "", /updateCurveObjects|updateTopologyStats/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /SCULPT_BRUSH_GEOMETRY_FRAME_BUDGET_MS = 6/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function flushSculptBrushGeometryUpdates\(\{ all = false \} = \{\}\)[\s\S]*performance\.now\(\) - startedAt >= SCULPT_BRUSH_GEOMETRY_FRAME_BUDGET_MS/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function syncSculptBrushMirrorPoints\(source, partner\)[\s\S]*partner\.points\[index\]\.set\(-point\.x, point\.y, point\.z\)[\s\S]*partner\.pointScales = source\.pointScales\.map[\s\S]*partner\.pointWidths = \[\.\.\.source\.pointWidths\]/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /syncSculptBrushMirrorPoints\(source, partner\)[\s\S]*queueSculptBrushGeometryUpdate\(source\)[\s\S]*queueSculptBrushGeometryUpdate\(partner\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /flushSculptBrushGeometryUpdates\(\{ all: true \}\)/);
  assert.match(source, /sculptMoveToolPanel\.classList\.toggle\("hidden", !sculptBrushToolActive\(\)\)/);
  assert.match(source, /else if \(sculptBrushToolActive\(\)\) panel = sculptMoveToolPanel/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /sculptBrushPointWeight\(sourcePoint[\s\S]*sculptBrushPointWeight\(partnerPoint/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /sourcePoint\.add\(worldDelta\)[\s\S]*syncSculptBrushMirrorPoints\(source, partner\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function finishSculptMoveStroke\(event, \{ cancel = false \} = \{\}\)[\s\S]*commitClumpMemberRestState\(lock\)/);
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerdown", sculptGeom\.beginSculptMoveStroke, true\)/);
  assert.match(source, /window\.addEventListener\("pointermove", sculptGeom\.updateSculptMoveStroke, true\)/);
  assert.match(source, /window\.addEventListener\("pointerup", sculptGeom\.finishSculptMoveStroke, true\)/);
  assert.match(source, /const sculptBrushPreserveTipsByTool = \{[\s\S]*"sculpt-move": false,[\s\S]*"sculpt-smooth": true/);
  assert.match(source, /function syncSculptBrushToolButtons\(\)[\s\S]*sculptBrushPreserveTipsByTool\[sel\.state\.activeTool\][\s\S]*sculptPreserveTipsInput\.checked = sculptBrushPreserveTipsByTool\[sel\.state\.activeTool\]/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function updateActiveSculptBrushPreserveTips\(\)[\s\S]*deps\.sculptBrushPreserveTipsByTool\[deps\.sel\.activeTool\] = deps\.sculptPreserveTipsInput\.checked/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /const preserveTips = Boolean\(deps\.sculptBrushPreserveTipsByTool\[deps\.sel\.activeTool\]\)[\s\S]*pointIndex === source\.points\.length - 1[\s\S]*preserveTip: preserveTips/);
  assert.match(source, /sculptPreserveTipsInput\.addEventListener\("change", sculptGeom\.updateActiveSculptBrushPreserveTips\)/);
  assert.match(source, /const sculptProportionalToolActive = \["sculpt-move", "sculpt-smooth"\]\.includes\(sel\.state\.activeTool\)[\s\S]*proportionalPanel\.classList\.toggle\([\s\S]*sculptProportionalToolActive[\s\S]*proportionalLockRootRow\.classList\.toggle\([\s\S]*sculptProportionalToolActive/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function captureSculptMoveStrokeInfluence[\s\S]*proportionalEditing[\s\S]*proportionalSculptWeights\(sourceWeights, proportionalRadius, proportionalFalloff\)[\s\S]*proportionalSculptWeights\(partnerWeights, proportionalRadius, proportionalFalloff\)/);
  // moved to modules/geometry/sculpt-geometry.js
  // 判据里的 `&& !shiftSmoothFreedom` 是 Shift 临时平滑特化分派引入的（sculptBrushShiftSmooth
  // FreedomByTool 查表命中时才为真）。用户主动选中 sculpt-smooth 时表里查不到该 key ⇒ 恒
  // undefined ⇒ 这条分支照旧执行，块内行为未变（见 sculpt-geometry.js 该判据旁的注释）。
  assert.match(sculptGeometry, /if \(smoothBrushActive && !shiftSmoothFreedom\) \{[\s\S]*const smoothingWeights = deps\.sculptState\.proportionalEditing[\s\S]*proportionalSculptWeights\([\s\S]*pointWeights[\s\S]*smoothSculptPointDeltas\([\s\S]*smoothingWeights/);
  assert.match(source, /function sculptBrushToolActive\(tool = sel\.state\.activeTool\) \{[\s\S]*"sculpt-move", "sculpt-smooth", "sculpt-inflate"/);
  assert.match(source, /function sculptBrushSelectionMaskActive\(\) \{[\s\S]*sculptBrushToolActive\(\)[\s\S]*selectedStrandIds\.size > 0/);
  assert.match(source, /function sculptBrushSelectionAllows\(lock\) \{[\s\S]*!sculptBrushSelectionMaskActive\(\)[\s\S]*selectedStrandIds\.has\(lock\?\.id\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushMirrorUpdateLock\(lock\) \{[\s\S]*lock\?\.points\?\.length > 1[\s\S]*!\["poly", "surface", "curve-surface"\]\.includes[\s\S]*function sculptBrushEditableLock\(lock\) \{[\s\S]*sculptBrushMirrorUpdateLock\(lock\)[\s\S]*!lock\.locked[\s\S]*sculptBrushSelectionAllows\(lock\)/);
  assert.match(source, /function strandViewportBaseColor\(lock\) \{[\s\S]*sculptBrushSelectionMaskActive\(\)[\s\S]*sculptBrushSelectionAllows\(lock\)[\s\S]*return materialApi\.strandDisplayColor\(lock\)[\s\S]*maskedColor\.multiplyScalar\(0\.28\)/);
  assert.match(source, /activeTool = tool;[\s\S]*updateStrandSelectionHighlight\(\);[\s\S]*updateReferenceSelectionVisuals\(\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /const inflateBrushActive = deps\.effectiveSculptBrushTool\(\) === "sculpt-inflate"[\s\S]*inflateSculptPointScale\([\s\S]*source\.pointScales\[pointIndex\],[\s\S]*weight,[\s\S]*strength,[\s\S]*strokeDistance,[\s\S]*radius[\s\S]*setPointScale\(source, pointIndex, nextScale\.x, nextScale\.z\)[\s\S]*continue;/);
  // moved to modules/geometry/placement.js
  assert.match(placement, /sculptTool === "sculpt-inflate"[\s\S]*Inflate Brush: drag across visible strands to make them wider and thicker/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /snapshots: snapshotLocks\.map[\s\S]*pointScales: lock\.pointScales\.map[\s\S]*pointWidths: \[\.\.\.lock\.pointWidths\][\s\S]*lock\.pointScales = snapshot\.pointScales\.map[\s\S]*lock\.pointWidths = \[\.\.\.snapshot\.pointWidths\]/);
  assert.match(source, /function setSculptBrushShiftSmoothHeld\(held\)[\s\S]*sculptGeom\.syncSculptBrushStrengthForActiveTool\(\)/);
  assert.match(source, /sel\.state\.activeTool = tool;[\s\S]*if \(sculptBrushToolActive\(\)\) sculptGeom\.syncSculptBrushStrengthForActiveTool\(\)/);
  assert.match(source, /event\.key === "Shift"[\s\S]*sculptBrushToolActive\(\)[\s\S]*setSculptBrushShiftSmoothHeld\(true\)/);
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*event\.key === "Shift"[\s\S]*setSculptBrushShiftSmoothHeld\(false\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushDebugCurveVisible\(lock\)[\s\S]*sculptBrushToolActive\(\)[\s\S]*sculptBrushShowCurvesInput\.checked[\s\S]*sculptBrushEditableLock\(lock\)[\s\S]*strandVisibleForDisplay\(lock\)[\s\S]*sculptBrushLockViable\(lock\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushWorkingPlaneNormal\(\)[\s\S]*camera\.getWorldDirection\(sculptBrushCameraFacingNormal\)[\s\S]*sculptBrushCameraFacingNormal\.negate\(\)[\s\S]*cameraFacingPlaneNormal\(sculptBrushCameraFacingNormal\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushPlaneOffset\(\)[\s\S]*\(Number\(deps\.sculptBrushPlanePositionInput\.value\) - 0\.5\) \* 4/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushLockViable\([\s\S]*planeOffset = sculptBrushPlaneOffset\(\)[\s\S]*pointInCameraFacingHalfSpace\(point, planeNormal, planeOffset\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function sculptBrushUnits\(\)[\s\S]*const partner = sculptBrushMirrorUpdateLock\(deps\.mirrorPartnerFor\(lock\)\)[\s\S]*const sourceVisible = sculptBrushEditableLock\(source\)[\s\S]*const partnerVisible = sculptBrushEditableLock\(sourcePartner\)[\s\S]*partner: sculptBrushMirrorUpdateLock\(sourcePartner\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /const units = sculptBrushUnits\(\);[\s\S]*const snapshotLocks = \[\.\.\.new Map\(units\.flatMap[\s\S]*snapshots: snapshotLocks\.map/);
  assert.match(source, /new THREE\.GridHelper\(4\.2, 12, 0xff4fd8, 0xff4fd8\)[\s\S]*new THREE\.PlaneGeometry\(4\.2, 4\.2\)[\s\S]*color: 0xff4fd8/);
  assert.match(source, /const sculptBrushViabilityPlane = new THREE\.GridHelper\(4\.2, 12, 0xff4fd8, 0xff4fd8\)[\s\S]*sculptBrushViabilityPlane\.material\.depthTest = true;[\s\S]*Sculpt Brush Viability Plane \(Debug\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function updateSculptBrushViabilityPlane\(\)[\s\S]*deps\.sculptBrushViabilityPlane\.visible = visible && deps\.sculptBrushShowClippingPlaneInput\.checked[\s\S]*sculptBrushCurveClippingPlane\.constant = -planeOffset[\s\S]*sculptBrushPlaneRight\.set\(1, 0, 0\)\.applyQuaternion\(deps\.camera\.quaternion\)[\s\S]*deps\.sculptBrushViabilityPlane\.position\.copy\(sculptBrushPlaneNormal\)\.multiplyScalar\(planeOffset\)[\s\S]*deps\.sculptBrushViabilityPlane\.quaternion\.setFromRotationMatrix\(sculptBrushPlaneBasis\)[\s\S]*const changedLockIds = new Set[\s\S]*changedLockIds\.has\(lock\.id\)[\s\S]*deps\.updateCurveObjects\(lock/);
  assert.match(source, /function animate\(timestamp[\s\S]*controls\.update\(\);[\s\S]*sculptGeom\.updateSculptBrushViabilityPlane\(\)/);
  assert.match(source, /line\.material\.depthTest = false;[\s\S]*line\.material\.stencilWrite = brushDebugVisible;[\s\S]*line\.material\.stencilFunc = THREE\.NotEqualStencilFunc;[\s\S]*line\.renderOrder = brushDebugVisible \? 50 : 3/);
  assert.match(source, /handle\.material\.depthTest = false;[\s\S]*handle\.material\.stencilWrite = brushDebugVisible;[\s\S]*handle\.material\.stencilFunc = THREE\.NotEqualStencilFunc;[\s\S]*handle\.renderOrder = brushDebugVisible \? 51 : 4/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /child\.material = new THREE\.MeshStandardMaterial\(\{[\s\S]*stencilWrite: true,[\s\S]*stencilFunc: THREE\.AlwaysStencilFunc,[\s\S]*stencilZFail: THREE\.ReplaceStencilOp/);
  assert.match(source, /renderer\.localClippingEnabled = true/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function setSculptBrushMaterialClipping\(material, enabled\)[\s\S]*material\.clippingPlanes = enabled \? sculptBrushCurveClippingPlanes : null/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /sculptBrushCurveClippingPlane\.normal\.copy\(sculptBrushPlaneNormal\);/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function captureSculptMoveStrokeInfluence\([\s\S]*pointInCameraFacingHalfSpace\(sourcePoint, planeNormal, planeOffset\)[\s\S]*pointInCameraFacingHalfSpace\(partnerPoint, planeNormal, planeOffset\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function beginSculptMoveStroke\(event\)[\s\S]*const planeNormal = sculptBrushWorkingPlaneNormal\(\);[\s\S]*const planeOffset = sculptBrushPlaneOffset\(\);[\s\S]*planeNormal,[\s\S]*planeOffset,/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function updateSculptBrushDebugCurve\(lock\)[\s\S]*new THREE\.CatmullRomCurve3\(lock\.points\)\.getPoints\(40\)[\s\S]*group\.visible = true/);
  assert.match(source, /function updateCurveObjects\(lock, options = \{\}\)[\s\S]*const sculptBrushHelpersSuppressed = sculptBrushToolActive\(\)[\s\S]*edge\.visible = lock\.id === sel\.state\.selectedId[\s\S]*!sculptBrushHelpersSuppressed[\s\S]*arrow\.visible = componentEditModeActive\(\)[\s\S]*!sculptBrushHelpersSuppressed/);
  // moved to modules/bones/bone-view-handles.js
  assert.match(boneViewHandles, /curveObjects\.panelSplitHandles\?\.forEach[\s\S]*!sculptBrushHelpersSuppressed[\s\S]*if \(!visible\) \{[\s\S]*if \(line\) line\.visible = false/);
  assert.match(
    source,
    /handle\.raycast = brushDebugVisible\s*\? sculptBrushDebugRaycast\s*:\s*strandControlPointRaycast/
  );
  assert.match(source, /const brushCurveVisibilityAllowed = !sculptBrushToolActive\(\) \|\| sculptBrushShowCurvesInput\.checked;[\s\S]*brushCurveVisibilityAllowed \|\| tipUiActive[\s\S]*options\.visible && componentEditModeActive\(\)[\s\S]*brushDebugVisible/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /syncSculptBrushMirrorPoints\(source, partner\)[\s\S]*updateSculptBrushDebugCurve\(source\)[\s\S]*updateSculptBrushDebugCurve\(partner\)/);
  assert.match(source, /sculptBrushStrengthInput\.addEventListener\("input", sculptGeom\.updateActiveSculptBrushStrength\)/);
  assert.match(source, /sculptBrushShowClippingPlaneInput\.addEventListener\("change", sculptGeom\.updateSculptBrushViabilityPlane\)/);
  assert.match(source, /sculptBrushShowCurvesInput\.addEventListener\("change",[\s\S]*refreshSculptBrushDebugView\(\)/);
  assert.match(source, /sculptBrushPlanePositionInput\.addEventListener\("input",[\s\S]*sculptGeom\.updateSculptBrushViabilityPlane\(\)/);
  assert.match(css, /\.sculpt-inflate-icon\s*\{[\s\S]*border-radius:\s*50%/);
  assert.match(css, /\.sculpt-brush-cursor\.inflate\s*\{[\s\S]*border-color:\s*#ff79cf/);
  assert.match(css, /\.tool-panel > \.active-tool-settings\s*\{[\s\S]*order:\s*-1000\s*!important;[\s\S]*#proportionalPanel\s*\{[\s\S]*order:\s*-999;/);
});

test("Twist Brush is docked as a sculpt brush and rolls strands around the tangent without camera input", async () => {
  const [html, source, css, sculptGeometry, sculptBrush, boneInteraction] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/sculpt/sculpt-brush.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8")
  ]);

  const twistButton = html.match(/<button[^>]*data-tool="sculpt-twist"[^>]*>/)?.[0] || "";
  assert.match(twistButton, /class="tool-button sculpt-brush-button"/);
  assert.match(twistButton, /aria-label="Twist Brush"/);
  assert.match(twistButton, /title="Twist strands around their tangent axis by dragging horizontally"/);
  // Docked after the Orient Brush, with the shared brush-label structure.
  assert.match(html, /data-tool="sculpt-orient"[\s\S]*data-tool="sculpt-twist"[\s\S]*sculpt-twist-icon[\s\S]*brush-name">Twist<\/span><span class="brush-suffix"> Brush<\/span>/);
  assert.match(css, /\.sculpt-twist-icon\s*\{[\s\S]*border-radius:\s*50%/);

  assert.match(source, /const sculptBrushStrengthByTool = \{[\s\S]*"sculpt-orient": 0\.5,\s*"sculpt-twist": 0\.5/);
  // Assert twist is registered in the whitelist, but do NOT pin it to the end of the array:
  // later sculpt brushes append after it (sculpt-width did, 0.2.148+) and this test owns only
  // the twist contract. Mirrors the looser sculptBrushStrengthByTool assertion just above.
  assert.match(source, /function sculptBrushToolActive\([\s\S]*"sculpt-orient", "sculpt-twist"[\s\S]*?\]\.includes\(tool\)/);
  // Same rationale as the whitelist assertion above: assert twist is IN reverseTool without
  // pinning it last, since later brushes append after it. The [^\]]* stays inside the array
  // literal (it cannot cross the closing bracket), so this is still scoped to reverseTool.
  assert.match(sculptGeometry, /const reverseTool = \[[^\]]*"sculpt-twist"[^\]]*\]/);
  assert.match(sculptGeometry, /const twistBrushActive = deps\.effectiveSculptBrushTool\(\) === "sculpt-twist"/);
  // The affected point set is frozen at mousedown: twist takes the stroke-start influence
  // snapshot (like move) instead of live cursor weights, so it must NOT be excluded from
  // fixedMoveBrushInfluence the way orient still is.
  assert.match(
    sculptGeometry,
    /moveInfluence: \["sculpt-move", "sculpt-twist"\]\.includes\(deps\.sel\.activeTool\)\s*\?\s*captureSculptMoveStrokeInfluence\(/
  );
  const fixedInfluence = sculptGeometry.match(/const fixedMoveBrushInfluence = [^;]*;/)?.[0] || "";
  assert.match(fixedInfluence, /!orientBrushActive/);
  assert.doesNotMatch(fixedInfluence, /twistBrushActive/);
  // Tip sub-bone path freezes its own per-sample weights for twist only.
  assert.match(
    boneInteraction,
    /const weights = tool === "sculpt-twist"\s*\?\s*resolveFrozenTwistStrokeWeights\(\s*stroke,\s*`\$\{lock\.id\}:\$\{segmentIndex\}`/
  );
  // Main strand: writes pointTwists only, hierarchy flag drives downstream propagation.
  assert.match(
    sculptGeometry,
    /if \(twistBrushActive[\s\S]*source\.pointTwists\[pointIndex\] = \(Number\(source\.pointTwists\[pointIndex\]\) \|\| 0\) \+ delta/
  );
  assert.match(sculptGeometry, /sculptTwistBrushDeltas\(source\.points\.length, pointWeights, \{[\s\S]*hierarchy: Boolean\(deps\.sculptState\.hierarchyEditing\)/);
  // Tip sub-bone: writes authored.twists, never points.
  assert.match(boneInteraction, /\} else if \(tool === "sculpt-twist"\) \{[\s\S]*twistArr\[index\] \+= delta[\s\S]*authored\.twists = twistArr/);
  assert.doesNotMatch(
    boneInteraction.match(/\} else if \(tool === "sculpt-twist"\) \{[\s\S]*?\n  \} else \{/)?.[0] || "",
    /points\[index\]|deps\.camera/
  );
  // The twist math must stay camera-independent: no camera term anywhere in either branch.
  assert.doesNotMatch(sculptGeometry.match(/if \(twistBrushActive[\s\S]*?\n    \}/)?.[0] || "", /deps\.camera/);
  assert.doesNotMatch(sculptBrush.match(/export function sculptTwistBrushAngle[\s\S]*?\n\}/)?.[0] || "", /camera/i);
});

test("Width Brush is docked as a sculpt brush with its own icon and localized labels", async () => {
  const [html, css, zh, ja] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-zh.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  // Tool id is a fixed contract string other modules dispatch on: "sculpt-width".
  const widthButton = html.match(/<button[^>]*data-tool="sculpt-width"[^>]*>/)?.[0] || "";
  assert.match(widthButton, /class="tool-button sculpt-brush-button"/);
  assert.match(widthButton, /aria-label="Width Brush"/);
  assert.match(widthButton, /title="Drag to shrink the strand width curve; hold Ctrl to grow it"/);
  // Docked after the Twist Brush, with the shared brush-label structure.
  assert.match(html, /data-tool="sculpt-twist"[\s\S]*data-tool="sculpt-width"[\s\S]*sculpt-width-icon[\s\S]*brush-name">Width<\/span><span class="brush-suffix"> Brush<\/span>/);

  // Icon must be its own shape, distinct from every other sculpt-*-icon shown here (no shared
  // border-radius: 50% + before/after "rotate" motif reused verbatim from twist/orient/etc).
  assert.match(css, /\.sculpt-width-icon\s*\{[\s\S]*border-radius:\s*50%/);
  assert.match(css, /\.sculpt-width-icon::before,\s*\n\.sculpt-width-icon::after\s*\{[\s\S]*background:\s*currentColor/);
  const widthIconBlock = css.match(/\.sculpt-width-icon\s*\{[\s\S]*?\.sculpt-width-icon::after\s*\{[\s\S]*?\n\}/)?.[0] || "";
  assert.doesNotMatch(widthIconBlock, /rotate\(/, "width icon must not reuse the rotated-bar/oval motif of other brush icons");

  // Localization: EN source strings above must have zh + ja entries (no silent English fallback).
  for (const [name, catalog] of [["loc-zh", zh], ["loc-ja", ja]]) {
    assert.match(catalog, /"Width Brush":/, `${name} translates the tool label`);
    assert.match(
      catalog,
      /"Drag to shrink the strand width curve; hold Ctrl to grow it":/,
      `${name} translates the tooltip`
    );
  }
  // zh keeps brush *names* in English per this file's existing convention (Move/Inflate/
  // Smooth/Twist Brush are all "X Brush": "X Brush"); only the descriptive tooltip is
  // actually translated to Chinese. ja translates both name and tooltip. Assert the tooltip
  // body is real Chinese/Japanese text, not a re-echoed English string.
  assert.doesNotMatch(
    zh,
    /"Drag to shrink the strand width curve; hold Ctrl to grow it": "Drag to shrink/
  );
});

test("scalp editor keeps transform tools active and places viewport guidance at bottom left", async () => {
  const [source, css, html, scalpBuilder] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8")
  ]);

  assert.match(source, /const scalpBuilderTool = \["select", "move"\]\.includes\(tool\)/);
  assert.match(source, /if \(scalpState\.state\.scalpBuilderEditing && setupTransformTool && !scalpBuilderTool\) return;/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /const usefulInScalpEditor = deps\.scalpState\.scalpBuilderEditing[\s\S]*\["select", "move"\]\.includes\(tool\)/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /if \(\["rotate", "scale"\]\.includes\(deps\.sel\.activeTool\)\) deps\.setActiveTool\("select"\)/);
  assert.match(source, /if \(scalpState\.state\.scalpBuilderEditing && tool === "move"\)/);
  assert.match(source, /scalpState\.state\.scalpBuilderCurveLattice\?\.handles\[scalpState\.state\.scalpBuilderCurveLattice\.selectedIndex\]/);
  assert.doesNotMatch(source, /placementStatus\.classList\.toggle\("bottom-left"/);
  assert.match(
    html,
    /class="viewport-bottom-left-guidance"[\s\S]*id="placementStatus"[\s\S]*id="viewportNavigationTips"/
  );
  assert.doesNotMatch(html, /hierarchyNavigationHint|Navigate curve points/);
  assert.match(
    css,
    /\.viewport-bottom-left-guidance\s*\{[\s\S]*?left:\s*18px;[\s\S]*?bottom:\s*18px;[\s\S]*?flex-direction:\s*column;/
  );
});

test("display visibility filters expose every strand region, layer, character mesh, and guide parent", async () => {
  const [html, source, projectState] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-state.js", import.meta.url), "utf8")
  ]);
  const regions = [...html.matchAll(/data-region-visibility=["']([^"']+)["']/g)].map((match) => match[1]);
  const layers = [...html.matchAll(/data-layer-visibility=["']([^"']+)["']/g)].map((match) => match[1]);

  assert.deepEqual(regions, [
    "bangs",
    "side-bangs-left",
    "side-bangs-right",
    "side-left",
    "side-right",
    "back",
    "unassigned"
  ]);
  assert.deepEqual(layers, ["bottom", "mid", "top", "accent"]);
  assert.match(html, /id=["']allRegionsVisibility["'][^>]*checked/);
  assert.match(html, /id=["']allLayersVisibility["'][^>]*checked/);
  assert.match(html, /id=["']allGuidesVisibility["']/);
  assert.match(html, /id=["']scalpDisplayVisibility["']/);
  assert.match(html, /id=["']capsuleDisplayVisibility["']/);
  assert.match(html, /id=["']curveLatticeDisplayVisibility["']/);
  assert.match(html, /Character Meshes[\s\S]*id=["']headMeshDisplayVisibility["'][^>]*checked[\s\S]*Head Mesh/);
  assert.match(html, /Character Meshes[\s\S]*id=["']bodyMeshDisplayVisibility["'][^>]*checked[\s\S]*Body Mesh/);
  assert.match(source, /function applyCharacterMeshDisplayVisibility\(\)[\s\S]*guideState\.state\.guideModel\.visible = guideState\.state\.guideModel\.userData\.fullBodyReference[\s\S]*\? bodyMeshVisible[\s\S]*: hairState\.state\.headMeshVisible/);
  assert.match(source, /function syncDisplayVisibilityInputs\(\)[\s\S]*headMeshDisplayVisibilityInput\.disabled = !hasCharacterMesh \|\| hasBodyMesh[\s\S]*bodyMeshDisplayVisibilityInput\.disabled = !hasCharacterMesh \|\| !hasBodyMesh/);
  assert.match(source, /headMeshDisplayVisibilityInput\.addEventListener\("change"[\s\S]*bodyMeshDisplayVisibilityInput\.addEventListener\("change"/);
  assert.match(source, /function snapshotState\(\)[\s\S]*curveLatticeGuidesVisible,[\s\S]*headMeshVisible,[\s\S]*bodyMeshVisible,/);
  assert.match(projectState, /curveLatticeGuides: state\.curveLatticeGuidesVisible !== false,[\s\S]*headMesh: state\.headMeshVisible !== false,[\s\S]*bodyMesh: state\.bodyMeshVisible !== false/);
});

test("guide visibility button cycles guide types and exposes a right-click view menu", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [guideSystem] = await Promise.all([
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8"),
  ]);
  assert.match(html, /id="scalpGuideVisibilityToggle"[^>]*aria-haspopup="menu"/);
  assert.match(html, /id="guideViewContextMenu"[\s\S]*data-guide-view-mode="all"[\s\S]*data-guide-view-mode="hide-scalp"[\s\S]*data-guide-view-mode="hide-capsules"[\s\S]*data-guide-view-mode="hide-lattices"[\s\S]*data-guide-view-mode="none"/);
  assert.match(source, /const GUIDE_VIEW_MODES = \[[\s\S]*Scalp Hidden[\s\S]*Capsules Hidden[\s\S]*Lattices Hidden[\s\S]*All Hidden/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function cycleGuideViewMode\(\)[\s\S]*deps\.GUIDE_VIEW_MODES\.findIndex\(\(mode\) => mode\.id === currentGuideViewMode\(\)\?\.id\)[\s\S]*setGuideViewMode\(/);
  assert.match(source, /scalpGuideVisibilityToggle\.addEventListener\("click", guideApi\.cycleGuideViewMode\)[\s\S]*scalpGuideVisibilityToggle\.addEventListener\("contextmenu", guideApi\.showGuideViewContextMenu\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function setGuideViewMode\(modeId\)[\s\S]*capsuleGuidesVisible = mode\.capsules[\s\S]*curveLatticeGuidesVisible = mode\.lattices[\s\S]*setScalpGuideVisibility\(mode\.scalp\)/);
  assert.match(source, /function filterCurveLatticesToGroup[\s\S]*curveLatticeGuidesVisible && guide\.outlinerVisible/);
  assert.match(css, /\.guide-view-context-menu button\.active/);
});

test("file menu exposes online downloads and de-emphasized local exports", async () => {
  const [html, source, server, css, fileActions] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../server.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/file-actions.js", import.meta.url), "utf8")
  ]);

  const [projectFiles, ioTail] = await Promise.all([
    readFile(new URL("../modules/io/project-files.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/io-tail.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id=["']exportObj["']/);
  assert.match(html, /id=["']exportUsda["']/);
  // The "Local Export for Dev purposes" menu items (localExportObj / localExportUsda /
  // exportHairUsdaLocally) were removed: the File menu now only offers the online
  // download path, so those assertions are gone.
  // The server.js export/extensions API (["obj","usda"], save-dialog extension strings,
  // defaultExtension) was removed: server.js is now a plain static file server and the
  // export dialogs use the browser File System Access API instead.
  assert.match(html, /id=["']fileActionDialog["'][\s\S]*?id=["']fileActionName["'][\s\S]*?id=["']fileActionExtension["']/);
  assert.match(html, /id=["']hairProjectFile["'][^>]*accept=["'][^"']*\.ahs[^"']*\.animehair\.json[^"']*\.json/);
  assert.match(html, /id=["']fileActionExtension["'][^>]*>\.ahs</);
  assert.match(fileActions, /extension:\s*"\.ahs"/);
  assert.match(html, /id=["']fileExportContents["'][\s\S]*?id=["']exportIncludeMesh["'][\s\S]*?id=["']exportIncludeCurves["'][\s\S]*?id=["']exportIncludeBones["']/);
  assert.match(html, /id=["']projectSaveContents["'][\s\S]*?Project Contents[\s\S]*?id=["']projectIncludeHeadAsset["'][^>]*checked[\s\S]*?Head \/ Body Mesh[\s\S]*?id=["']projectIncludeReferences["'][^>]*checked[\s\S]*?References/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /function openFileActionDialog\([\s\S]*fileActionFormat\(format\)[\s\S]*fileExportAvailability[\s\S]*fileActionDialog\.showModal\(\)/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /projectSaveContents\.classList\.toggle\("hidden", isExport\)[\s\S]*projectIncludeHeadAssetInput\.checked = true[\s\S]*projectIncludeHeadAssetInput\.disabled = !deps\.importedHeadAsset[\s\S]*projectIncludeReferencesInput\.checked = true[\s\S]*projectIncludeReferencesInput\.disabled = deps\.referenceImages\.length === 0/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /function buildHairProjectFile\(name, \{[\s\S]*includeHeadAsset = true[\s\S]*includeReferences = true[\s\S]*if \(!includeReferences\) state\.referenceImages = \[\][\s\S]*headAsset: includeHeadAsset \? deps\.importedHeadAsset : null/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /headAssetOmitted: Boolean\(deps\.importedHeadAsset && !includeHeadAsset\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /async function openHairProjectFile\(file, \{ handle = null \} = \{\}\)[\s\S]*project\.headAssetOmitted === true[\s\S]*deps\.referenceHeadApi\.disposeGuideModel\(deps\.guideState\.guideModel\)[\s\S]*deps\.guideState\.guideModel = null[\s\S]*importedHeadAsset = null[\s\S]*else if \(project\.headAsset\?\.format === "obj"/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /function performFileAction\(action, baseName, contents\)[\s\S]*buildHairProjectFile\(baseName, \{[\s\S]*includeHeadAsset: contents\.headAsset[\s\S]*includeReferences: contents\.references/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /fileActionForm\.addEventListener\("submit"[\s\S]*action\.format === "project"[\s\S]*headAsset: projectIncludeHeadAssetInput\.checked && !projectIncludeHeadAssetInput\.disabled[\s\S]*references: projectIncludeReferencesInput\.checked && !projectIncludeReferencesInput\.disabled/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /row\.classList\.remove\("hidden"\)[\s\S]*Not supported in \$\{definition\.label\}\. Use USDA to export\./);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /fileActionForm\.addEventListener\("submit"[\s\S]*normalizeExportContents[\s\S]*performFileAction/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /function buildHairObj\(\{\s*includeMesh = true,\s*includeCurves = true\s*\} = \{\}\)[\s\S]*if \(includeMesh\)[\s\S]*if \(includeCurves\)/);
  // moved to modules/io/project-files.js
  assert.match(projectFiles, /function buildHairUsda\(\{[\s\S]*includeMesh = true[\s\S]*includeCurves = true[\s\S]*includeBones = false[\s\S]*includeWeights = false/);
  assert.match(css, /\.file-action-dialog\s*\{[\s\S]*transform:\s*translate\(-50%, -50%\)/);
  assert.match(css, /\.file-export-contents\.hidden,[\s\S]*\.file-export-option\.hidden\s*\{[\s\S]*display:\s*none/);
  assert.doesNotMatch(html, /exportMaya|localExportMaya|Python For Maya/);
  assert.doesNotMatch(source, /buildMayaImportScript|exportHairForMaya|mayaCurveExportData|utf8Base64/);
  assert.doesNotMatch(server, /export-maya|Maya Python Importer|mayaExport/);
});

test("debug menu toggles a labeled UV checker and synchronized UV inspector without replacing authored materials", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [materialUi] = await Promise.all([
    readFile(new URL("../modules/material/material-ui.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id=["']debugMenuToggle["'][\s\S]*?id=["']debugMenu["'][\s\S]*?id=["']toggleUvChecker["'][^>]*aria-pressed=["']false["'][\s\S]*?id=["']uvCheckerMenuState["']/);
  assert.match(html, /id=["']uvInspectorWindow["'][\s\S]*?id=["']uvInspectorDragHandle["'][\s\S]*?id=["']uvInspectorCanvas["'][\s\S]*?id=["']uvInspectorStatus["']/);
  assert.match(source, /function createUvCheckerTexture\(\)[\s\S]*new THREE\.CanvasTexture\(canvas\)[\s\S]*THREE\.RepeatWrapping/);
  assert.match(source, /function ensureUvCheckerForLock\(lock\)[\s\S]*uvCheckerOriginalMaterial[\s\S]*new THREE\.MeshBasicMaterial[\s\S]*userData\.uvChecker = true/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function applyMaterialDefinitionToLock\(lock\)[\s\S]*lock\.mesh\.material === lock\.uvCheckerMaterial[\s\S]*lock\.mesh\.material = lock\.uvCheckerOriginalMaterial[\s\S]*ensureUvCheckerForLock\(lock\)/);
  assert.match(source, /function removeUvCheckerFromLock\(lock\)[\s\S]*lock\.mesh\.material = lock\.uvCheckerOriginalMaterial[\s\S]*checkerMaterial\.dispose\(\)/);
  assert.match(source, /function uvInspectorRecord\(lock\)[\s\S]*uvInspectorRecordCache\.get\(geometry\)[\s\S]*hairFaceIndices\(geometry\)[\s\S]*uvInspectorRecordCache\.set\(geometry/);
  assert.match(source, /function renderUvInspector\([\s\S]*if \(!force && !hairState\.state\.uvInspectorDirty\) return[\s\S]*uvCoordinateBounds\(allPoints\)[\s\S]*uvViewTransform\(bounds[\s\S]*#ff4fd8/);
  assert.match(source, /function setUvCheckerEnabled\(enabled\)[\s\S]*uvInspectorWindow\.show\(\)[\s\S]*uvInspectorWindow\.close\(\)/);
  assert.match(source, /toggleUvCheckerButton\.addEventListener\("click", \(\) => setUvCheckerEnabled\(!hairState\.state\.uvCheckerEnabled\)\)/);
  assert.match(source, /function rebuildLockGeometry\([\s\S]*invalidateUvInspector\(\)/);
  assert.match(source, /function refreshStrandSelectionConsumers\([\s\S]*invalidateUvInspector\(\)/);
  assert.match(source, /new ResizeObserver\(invalidateUvInspector\)\.observe\(uvInspectorWindow\)/);
  assert.match(source, /function animate\([\s\S]*renderUvInspector\(timestamp\)[\s\S]*renderer\.render/);
  assert.doesNotMatch(source, /function animate\([\s\S]*syncUvCheckerMaterials\(\)/);
  assert.match(source, /function disposeAllEditableObjects\(\)[\s\S]*locks\.forEach\(\(lock\) => \{[\s\S]*removeUvCheckerFromLock\(lock\)[\s\S]*lock\.mesh\.material\.dispose\(\)/);
  assert.match(source, /function deleteLocks\([\s\S]*removeUvCheckerFromLock\(item\)[\s\S]*item\.mesh\.material\.dispose\(\)/);
  assert.match(css, /\.app-menu-dropdown button\.active \.app-menu-state\s*\{[\s\S]*color:\s*#83f7fc/);
  assert.match(css, /\.uv-inspector-window\s*\{[\s\S]*resize:\s*both[\s\S]*\.uv-inspector-window\[open\]\s*\{[\s\S]*display:\s*grid/);
});

test("settings menu exposes preferences, language, and app version", async () => {
  const [html, source, css, localization, packageSource, configSource, preferenceStorageSource, uiStore, radialMenu, materialUi, placement] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/app-config.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/preference-storage.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/ui-store.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/material/material-ui.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/placement.js", import.meta.url), "utf8")
  ]);

  const [ioTail] = await Promise.all([
    readFile(new URL("../modules/io/io-tail.js", import.meta.url), "utf8"),
  ]);
  const packageData = JSON.parse(packageSource);

  assert.match(html, /id=["']settingsMenuToggle["']/);
  assert.match(html, /id=["']settingsMenu["'][\s\S]*?id=["']openPreferences["'][\s\S]*?Preferences\.\.\.[\s\S]*?id=["']languageSelect["']/);
  assert.match(html, /id=["']preferencesDialog["'][\s\S]*?class=["']preferences-workspace["'][\s\S]*?class=["']preferences-categories["'][\s\S]*?data-preference-category=["']viewport["'][\s\S]*?data-preference-category=["']materials["'][\s\S]*?data-preference-category=["']experimental["'][\s\S]*?data-preference-category=["']backup["'][\s\S]*?class=["']preferences-content["']/);
  assert.match(html, /data-preference-panel=["']experimental["'][\s\S]*id=["']proceduralDrawExperimentalPreference["']/);
  assert.match(html, /data-preference-panel=["']viewport["'][\s\S]*?id=["']viewportInterface["'][\s\S]*?id=["']radialMenusPreference["'][^>]*checked[\s\S]*?id=["']viewportConventions["'][\s\S]*?data-preference-panel=["']materials["'][\s\S]*?id=["']defaultHairShaderPreference["'][\s\S]*?value=["']standard-anisotropic["'][\s\S]*?value=["']anime-anisotropic["'][\s\S]*?value=["']lambert["']/);
  assert.match(html, /data-preference-anchor=["']viewportDisplay["'][\s\S]*?data-preference-anchor=["']viewportInterface["'][\s\S]*?data-preference-anchor=["']viewportConventions["']/);
  assert.match(html, /id=["']navigationTipsPreference["'][^>]*checked/);
  assert.match(html, /id=["']navigationStylePreference["'][\s\S]*?value=["']anime-hair-studio["']>Anime Hair Studio<[\s\S]*?value=["']blender["']>Blender</);
  assert.match(html, /id=["']cameraSmoothingPreference["'][^>]*type=["']checkbox["'][\s\S]*?id=["']cameraSmoothingStrengthPreference["'][^>]*type=["']range["'][^>]*min=["']0["'][^>]*max=["']1["'][^>]*value=["']0\.5["']/);
  assert.doesNotMatch(html, /id=["']cameraSmoothingPreference["'][^>]*checked/);
  assert.match(html, /id=["']toolTipsPreference["'][^>]*checked/);
  assert.match(html, /id=["']viewportStatisticsPreference["'][^>]*checked/);
  assert.match(html, /id=["']layerColorShiftsPreference["'][^>]*checked/);
  assert.match(html, /id=["']sideNamingPerspectivePreference["'][\s\S]*?value=["']viewport["']>Viewport Perspective<[\s\S]*?value=["']character["']>Character Perspective</);
  assert.match(html, /id=["']viewportBackgroundColorPreference["'][^>]*type=["']color["'][^>]*value=["']#2b2730["']/);
  assert.match(html, /id=["']resetViewportBackgroundColor["'][^>]*class=["']slider-reset-button["'][^>]*aria-label=["']Reset viewport background color["']/);
  assert.match(html, /id="compactToolButtonsPreference"[^>]*type="checkbox"/);
  assert.doesNotMatch(html, /id="compactToolButtonsPreference"[^>]*checked/);
  assert.match(html, /id="sidePanelStylePreference"[\s\S]*value="default">Default Panels<[\s\S]*value="none">No Panels<[\s\S]*value="glass">Glass Panels</);
  assert.match(html, /id="glassPanelColorPreference"[^>]*type="color"[^>]*value="#19181d"[\s\S]*id="resetGlassPanelColor"[^>]*aria-label="Reset glass panel color"/);
  assert.match(html, /id="outlinerFolderColorsPreference"[^>]*type="checkbox"[^>]*checked/);
  assert.match(html, /id="outlinerFolderColorOpacityPreference"[^>]*type="range"[^>]*min="0"[^>]*max="100"[^>]*step="1"[^>]*value="100"/);
  assert.doesNotMatch(html, /sdfStrandFusionPreference|SDF strand fusion/);
  assert.match(html, /data-preference-panel=["']backup["'][\s\S]*?id=["']loadPreferencesAndPresets["'][\s\S]*?Load Preferences &amp; Presets[\s\S]*?id=["']downloadPreferencesAndPresets["'][\s\S]*?Download Preferences &amp; Presets[\s\S]*?id=["']preferencesAndPresetsFile["'][\s\S]*?id=["']preferencesBackupStatus["']/);
  assert.match(html, /data-preference-panel="backup"[\s\S]*id="autosavePreference"[^>]*type="checkbox"[^>]*checked[\s\S]*id="autosaveIntervalPreference"[\s\S]*value="15"[\s\S]*value="30" selected[\s\S]*value="300"/);
  assert.match(html, /id="recoveryDialog"[\s\S]*id="discardRecovery"[\s\S]*id="downloadRecovery"[\s\S]*id="recoverProject"/);
  assert.match(html, /id=["']viewportStats["'][^>]*class=["']viewport-stats["'][\s\S]*?id=["']viewportSelectedStats["'][\s\S]*?id=["']viewportTotalStats["'][\s\S]*?id=["']viewportFps["']/);
  assert.match(html, /class=["']preferences-dialog-head-actions["'][\s\S]*?id=["']cancelPreferences["'][\s\S]*?id=["']savePreferences["'][\s\S]*?id=["']closePreferences["']/);
  assert.doesNotMatch(html, /class=["']preferences-dialog-actions["']/);
  assert.match(html, /id=["']viewportNavigationTips["'][\s\S]*?Alt \+ Left Mouse[\s\S]*?Orbit[\s\S]*?Alt \+ Right Mouse[\s\S]*?Pan[\s\S]*?Scrollwheel[\s\S]*?Zoom[\s\S]*?<kbd>F<\/kbd>[\s\S]*?Cycle selected and full-scene framing/);
  assert.match(html, /data-navigation-style-tip="blender"[\s\S]*Middle Mouse[\s\S]*Shift \+ Middle Mouse[\s\S]*Ctrl \+ Middle Mouse[\s\S]*Scrollwheel[\s\S]*Alt \+ Middle Mouse/);
  assert.match(html, /data-navigation-style-shortcut="anime-hair-studio"[\s\S]*Alt[\s\S]*Left drag[\s\S]*data-navigation-style-shortcut="blender"[\s\S]*Middle Mouse drag[\s\S]*Ctrl \+ Middle Mouse[\s\S]*Zoom the camera[\s\S]*Scrollwheel[\s\S]*Zoom the camera/);
  assert.match(html, /id=["']languageSelect["'][\s\S]*?<option value=["']en["']>English<\/option>/);
  assert.match(html, /id=["']languageSelect["'][\s\S]*?<option value=["']ja["']>日本語<\/option>/);
  assert.match(source, /const RADIAL_MENUS_PREFERENCE_KEY = "anime-hair-studio-radial-menus"/);
  assert.doesNotMatch(source, /LEGACY_RADIAL_MENUS_PREFERENCE_KEY/);
  assert.match(preferenceStorageSource, /function readStoredPreference\([\s\S]*host\.localStorage\.getItem\(key\)[\s\S]*return fallback/);
  assert.match(preferenceStorageSource, /function readStoredBooleanPreference\([\s\S]*value === "true"[\s\S]*value === "false"[\s\S]*Boolean\(fallback\)/);
  assert.match(preferenceStorageSource, /function writeStoredPreference\([\s\S]*host\.localStorage\.setItem\(key, String\(value\)\)[\s\S]*return false/);
  // moved to modules/core/ui-store.js
  assert.match(uiStore, /radialMenusEnabled: readStoredBooleanPreference\(window, UI_PREFERENCE_KEYS\.radialMenus, true\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function setRadialMenusEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*cancelToolShortcutPress\(\)[\s\S]*cancelToolRadialGesture\(\)[\s\S]*cancelStrandRadialGesture\(\)[\s\S]*deps\.saveBooleanPreference\(deps\.RADIAL_MENUS_PREFERENCE_KEY, deps\.ui\.radialMenusEnabled\)/);
  assert.match(source, /function setPreferenceCategory\(category\) \{[\s\S]*dataset\.preferenceCategory[\s\S]*aria-selected[\s\S]*dataset\.preferencePanel[\s\S]*preferencePageTitle\.textContent/);
  assert.match(source, /\["viewport", "materials", "experimental", "backup"\]\.includes\(category\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function downloadPreferencesAndPresets\(\) \{[\s\S]*createPreferencesBackup\(\{[\s\S]*deps\.documentLocalizer\.language[\s\S]*defaultShader: deps\.hairState\.defaultHairShader[\s\S]*presets: deps\.projectState\.state\.customCreationPresets[\s\S]*preferencesBackupFileName\(exportedAt\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function loadPreferencesAndPresets\(file\) \{[\s\S]*normalizePreferencesBackup\(JSON\.parse\(await file\.text\(\)\)\)[\s\S]*setNavigationTipsEnabled[\s\S]*setDefaultHairShader[\s\S]*normalizeCreationPresetLibrary\(backup\.presets\)[\s\S]*saveCustomCreationPresets\(\)/);
  assert.match(source, /loadPreferencesAndPresetsButton\.addEventListener\("click"[\s\S]*preferencesAndPresetsFile\.value = "";[\s\S]*preferencesAndPresetsFile\.click\(\)[\s\S]*preferencesAndPresetsFile\.addEventListener\("change", ioApi\.handlePreferencesAndPresetsFile\)/);
  assert.match(source, /downloadPreferencesAndPresetsButton\.addEventListener\("click", ioApi\.downloadPreferencesAndPresets\)/);
  assert.match(source, /function markProjectChangedForRecovery\(\)[\s\S]*recoveryChangeVersion \+= 1[\s\S]*scheduleRecoveryAutosave\(\)/);
  assert.match(source, /async function flushRecoveryAutosave\(\)[\s\S]*writeRecoverySnapshot\(createRecoveryRecord\(\{[\s\S]*appVersion: APP_VERSION/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /async function openHairProjectFile\(file, \{ handle = null \} = \{\}\)[\s\S]*deps\.undoHistory\.clear\(\); deps\.redoHistory\.clear\(\); deps\.updateHistoryButtons\(\)/);
  assert.match(source, /async function offerRecoverySnapshot\(\)[\s\S]*readRecoverySnapshot\(\)[\s\S]*validateHairProject[\s\S]*recoveryDialog\.showModal\(\)/);
  assert.match(source, /recoverProjectButton\.addEventListener\("click", recoverPendingProject\)[\s\S]*discardRecoveryButton\.addEventListener\("click", discardPendingRecovery\)[\s\S]*downloadRecoveryButton\.addEventListener\("click", downloadPendingRecovery\)/);
  assert.match(source, /const savedVersion = recovery\.state\.recoveryChangeVersion[\s\S]*if \(savedVersion === recovery\.state\.recoveryChangeVersion\) recovery\.state\.recoveryDirty = false;/);
  assert.match(source, /function openPreferencesDialog\(\) \{[\s\S]*preferencesOpenSnapshot[\s\S]*setPreferenceCategory\("viewport"\)[\s\S]*preferencesDialog\.showModal\(\)/);
  assert.match(source, /function savePreferencesDialog\(\) \{[\s\S]*saveBooleanPreference\(RADIAL_MENUS_PREFERENCE_KEY, ui\.state\.radialMenusEnabled\)[\s\S]*saveBooleanPreference\(NAVIGATION_TIPS_PREFERENCE_KEY, viewportState\.state\.navigationTipsEnabled\)[\s\S]*saveBooleanPreference\(TOOL_TIPS_PREFERENCE_KEY, miscState\.state\.toolTipsEnabled\)[\s\S]*saveBooleanPreference\(VIEWPORT_STATISTICS_PREFERENCE_KEY, viewportState\.state\.viewportStatisticsEnabled\)[\s\S]*preferencesDialog\.close\(\)/);
  assert.match(source, /function cancelPreferencesDialog\(\) \{[\s\S]*radialMenuApi\.setRadialMenusEnabled\([\s\S]*persist: false[\s\S]*setNavigationTipsEnabled\([\s\S]*persist: false[\s\S]*setToolTipsEnabled\([\s\S]*persist: false[\s\S]*setViewportStatisticsEnabled\([\s\S]*persist: false[\s\S]*preferencesDialog\.close\(\)/);
  assert.match(source, /radialMenusPreferenceInput\.addEventListener\("change"[\s\S]*setRadialMenusEnabled\(radialMenusPreferenceInput\.checked, \{ persist: false \}\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function beginStrandRadialGesture\(\) \{\s*if \(!deps\.ui\.radialMenusEnabled/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function beginToolRadialGesture\(\) \{\s*if \(!deps\.ui\.radialMenusEnabled/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function beginToolShortcutPress\(key, tool\) \{[\s\S]*deps\.setActiveTool\(tool\);\s*if \(!deps\.ui\.radialMenusEnabled\) return;/);
  assert.match(source, /const NAVIGATION_TIPS_PREFERENCE_KEY = "anime-hair-studio-navigation-tips"/);
  assert.match(source, /const NAVIGATION_STYLE_PREFERENCE_KEY = "anime-hair-studio-navigation-style"/);
  assert.match(source, /const CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY = "anime-hair-studio-camera-smoothing-enabled"/);
  assert.match(source, /const CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY = "anime-hair-studio-camera-smoothing-strength"/);
  assert.match(source, /const VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY = "anime-hair-studio-viewport-background-color"/);
  assert.match(source, /const DEFAULT_VIEWPORT_BACKGROUND_COLOR = "#2b2730"/);
  assert.match(source, /function setViewportBackgroundColor\(value, \{ persist = true \} = \{\}\) \{[\s\S]*--viewport-background-center[\s\S]*--viewport-background-middle[\s\S]*--viewport-background-edge[\s\S]*VIEWPORT_BACKGROUND_COLOR_PREFERENCE_KEY/);
  assert.match(source, /resetViewportBackgroundColorButton\.addEventListener\("click"[\s\S]*setViewportBackgroundColor\(DEFAULT_VIEWPORT_BACKGROUND_COLOR, \{ persist: false \}\)/);
  assert.match(source, /preferenceAnchorButtons\.forEach[\s\S]*setPreferenceCategory\("viewport"\)[\s\S]*scrollIntoView/);
  assert.match(css, /\.preferences-viewport-section[\s\S]*\.viewport-preference-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\)[\s\S]*\.viewport-preference-grid > label[\s\S]*min-height: 42px;[\s\S]*margin: 0/);
  assert.match(css, /\.preference-category-group\.expanded \.preference-subcategories[\s\S]*display: grid/);
  assert.match(css, /--viewport-background-center: #2b2730[\s\S]*--viewport-background-middle: #16151a[\s\S]*--viewport-background-edge: #0c0b0f[\s\S]*var\(--viewport-background-edge\)/);
  assert.match(source, /viewportState\.state\.navigationTipsEnabled = readStoredBooleanPreference\(window, NAVIGATION_TIPS_PREFERENCE_KEY, true\)/);
  assert.match(source, /function setNavigationTipsEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*viewportNavigationTips\.classList\.toggle\("hidden", !viewportState\.state\.navigationTipsEnabled\)[\s\S]*saveBooleanPreference\(NAVIGATION_TIPS_PREFERENCE_KEY, viewportState\.state\.navigationTipsEnabled\)/);
  assert.match(source, /navigationTipsPreferenceInput\.addEventListener\("change"[\s\S]*setNavigationTipsEnabled\(navigationTipsPreferenceInput\.checked, \{ persist: false \}\)/);
  assert.match(source, /viewportState\.state\.navigationStyle = readStoredPreference\(window, NAVIGATION_STYLE_PREFERENCE_KEY, \{[\s\S]*fallback: "anime-hair-studio"[\s\S]*normalize: normalizeNavigationStyle/);
  assert.match(source, /function setNavigationStyle\(value,[\s\S]*navigationStyleTipRows[\s\S]*navigationStyleShortcutRows[\s\S]*configureNavigationMouseButtons\(\)[\s\S]*NAVIGATION_STYLE_PREFERENCE_KEY/);
  assert.match(source, /navigationStylePreferenceInput\.addEventListener\("change"[\s\S]*setNavigationStyle\(navigationStylePreferenceInput\.value, \{ persist: false \}\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function downloadPreferencesAndPresets\(\)[\s\S]*navigationStyle: deps\.viewportState\.navigationStyle,[\s\S]*function loadPreferencesAndPresets\(file\)[\s\S]*deps\.setNavigationStyle\(preferences\.navigationStyle\)/);
  assert.match(source, /function openPreferencesDialog\(\)[\s\S]*navigationStyle,[\s\S]*function savePreferencesDialog\(\)[\s\S]*NAVIGATION_STYLE_PREFERENCE_KEY[\s\S]*function cancelPreferencesDialog\(\)[\s\S]*preferencesOpenSnapshot\.navigationStyle/);
  assert.match(source, /viewportState\.state\.cameraSmoothingEnabled = readStoredBooleanPreference\(window, CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY, false\)/);
  assert.match(source, /viewportState\.state\.cameraSmoothingStrength = readStoredPreference\(window, CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY, \{[\s\S]*fallback: 0\.5[\s\S]*normalize: normalizeCameraSmoothingStrength/);
  assert.match(source, /function applyCameraSmoothingPreference\(\)[\s\S]*controls\.enableDamping = viewportState\.state\.cameraSmoothingEnabled[\s\S]*controls\.dampingFactor = THREE\.MathUtils\.lerp\(0\.12, 0\.01, viewportState\.state\.cameraSmoothingStrength\)[\s\S]*control\.disabled = !viewportState\.state\.cameraSmoothingEnabled/);
  assert.match(source, /cameraSmoothingPreferenceInput\.addEventListener\("change"[\s\S]*setCameraSmoothingEnabled\(cameraSmoothingPreferenceInput\.checked, \{ persist: false \}\)[\s\S]*cameraSmoothingStrengthPreferenceInput\.addEventListener\("input"[\s\S]*setCameraSmoothingStrength\(cameraSmoothingStrengthPreferenceInput\.value, \{ persist: false \}\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function downloadPreferencesAndPresets\(\)[\s\S]*cameraSmoothingEnabled: deps\.viewportState\.cameraSmoothingEnabled,[\s\S]*cameraSmoothingStrength: deps\.viewportState\.cameraSmoothingStrength,[\s\S]*function loadPreferencesAndPresets\(file\)[\s\S]*deps\.setCameraSmoothingEnabled[\s\S]*deps\.setCameraSmoothingStrength/);
  assert.match(source, /function openPreferencesDialog\(\)[\s\S]*cameraSmoothingEnabled,[\s\S]*cameraSmoothingStrength,[\s\S]*function savePreferencesDialog\(\)[\s\S]*CAMERA_SMOOTHING_ENABLED_PREFERENCE_KEY[\s\S]*CAMERA_SMOOTHING_STRENGTH_PREFERENCE_KEY[\s\S]*function cancelPreferencesDialog\(\)[\s\S]*preferencesOpenSnapshot\.cameraSmoothingEnabled[\s\S]*preferencesOpenSnapshot\.cameraSmoothingStrength/);
  assert.match(localization, /"Camera smoothing":[\s\S]*"Smoothing amount":[\s\S]*"Higher values let camera movement glide for longer\.":/);
  assert.match(css, /\.preference-slider\[aria-disabled="true"\]\s*\{[\s\S]*opacity: 0\.55/);
  assert.match(source, /const TOOL_TIPS_PREFERENCE_KEY = "anime-hair-studio-tool-tips"/);
  assert.match(source, /miscState\.state\.toolTipsEnabled = readStoredBooleanPreference\(window, TOOL_TIPS_PREFERENCE_KEY, true\)/);
  assert.match(source, /function setToolTipsEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*placementApi\.updatePlacementStatus\(\)[\s\S]*saveBooleanPreference\(TOOL_TIPS_PREFERENCE_KEY, miscState\.state\.toolTipsEnabled\)/);
  // moved to modules/geometry/placement.js
  assert.match(placement, /function updatePlacementStatus\(\) \{[\s\S]*const hidden = !deps\.miscState\.toolTipsEnabled \|\| !message;[\s\S]*deps\.placementStatus\.classList\.toggle\("hidden", hidden\)/);
  assert.match(source, /toolTipsPreferenceInput\.addEventListener\("change"[\s\S]*setToolTipsEnabled\(toolTipsPreferenceInput\.checked, \{ persist: false \}\)/);
  assert.match(source, /const COMPACT_TOOL_BUTTONS_PREFERENCE_KEY = "anime-hair-studio-compact-tool-buttons"/);
  assert.match(source, /miscState\.state\.compactToolButtonsEnabled = readStoredBooleanPreference\(window, COMPACT_TOOL_BUTTONS_PREFERENCE_KEY, false\)/);
  assert.match(source, /function setCompactToolButtonsEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*document\.body\.classList\.toggle\("compact-tool-buttons", miscState\.state\.compactToolButtonsEnabled\)[\s\S]*saveBooleanPreference\(COMPACT_TOOL_BUTTONS_PREFERENCE_KEY, miscState\.state\.compactToolButtonsEnabled\)/);
  assert.match(source, /compactToolButtonsPreferenceInput\.addEventListener\("change"[\s\S]*setCompactToolButtonsEnabled\(compactToolButtonsPreferenceInput\.checked, \{ persist: false \}\)/);
  assert.match(source, /const SIDE_PANEL_STYLE_PREFERENCE_KEY = "anime-hair-studio-side-panel-style"/);
  assert.match(source, /function normalizeSidePanelStyle\(value\)[\s\S]*value === "transparent"\) return "none";[\s\S]*return value === true \|\| value === "true" \? "none" : "default"/);
  assert.match(source, /miscState\.state\.sidePanelStyle = readStoredPreference\(window, SIDE_PANEL_STYLE_PREFERENCE_KEY, \{[\s\S]*fallback: "default"[\s\S]*normalize: normalizeSidePanelStyle/);
  assert.match(source, /function setSidePanelStyle\(value, \{ persist = true \} = \{\}\) \{[\s\S]*classList\.toggle\("glass-side-panels", miscState\.state\.sidePanelStyle === "glass"\)[\s\S]*classList\.toggle\("no-panels", miscState\.state\.sidePanelStyle === "none"\)[\s\S]*writeStoredPreference\(window, SIDE_PANEL_STYLE_PREFERENCE_KEY, miscState\.state\.sidePanelStyle\)/);
  assert.match(source, /sidePanelStylePreferenceInput\.addEventListener\("change"[\s\S]*setSidePanelStyle\(sidePanelStylePreferenceInput\.value, \{ persist: false \}\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function downloadPreferencesAndPresets\(\)[\s\S]*sidePanelStyle: deps\.miscState\.sidePanelStyle,[\s\S]*function loadPreferencesAndPresets\(file\)[\s\S]*preferences\.sidePanelStyle[\s\S]*deps\.setSidePanelStyle\(preferences\.sidePanelStyle\)/);
  assert.match(source, /function openPreferencesDialog\(\)[\s\S]*sidePanelStyle,[\s\S]*function savePreferencesDialog\(\)[\s\S]*SIDE_PANEL_STYLE_PREFERENCE_KEY[\s\S]*function cancelPreferencesDialog\(\)[\s\S]*preferencesOpenSnapshot\.sidePanelStyle/);
  assert.match(source, /const GLASS_PANEL_COLOR_PREFERENCE_KEY = "anime-hair-studio-glass-panel-color"[\s\S]*const LEGACY_DEFAULT_GLASS_PANEL_COLOR = "#0b0a0e"[\s\S]*const DEFAULT_GLASS_PANEL_COLOR = "#19181d"[\s\S]*miscState\.state\.glassPanelColor = readStoredPreference\(window, GLASS_PANEL_COLOR_PREFERENCE_KEY[\s\S]*glassPanelColor === LEGACY_DEFAULT_GLASS_PANEL_COLOR[\s\S]*DEFAULT_GLASS_PANEL_COLOR/);
  assert.match(source, /function setGlassPanelColor\(value, \{ persist = true \} = \{\}\)[\s\S]*--glass-panel-color[\s\S]*GLASS_PANEL_COLOR_PREFERENCE_KEY/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /preferences:[\s\S]*glassPanelColor: deps\.miscState\.glassPanelColor,[\s\S]*preferences\.glassPanelColor[\s\S]*deps\.setGlassPanelColor\(preferences\.glassPanelColor\)/);
  assert.match(source, /preferencesOpenSnapshot = \{[\s\S]*glassPanelColor: miscState\.state\.glassPanelColor,[\s\S]*GLASS_PANEL_COLOR_PREFERENCE_KEY[\s\S]*preferencesOpenSnapshot\.glassPanelColor/);
  assert.match(source, /glassPanelColorPreferenceInput\.addEventListener\("input"[\s\S]*setGlassPanelColor\(glassPanelColorPreferenceInput\.value, \{ persist: false \}\)[\s\S]*resetGlassPanelColorButton\.addEventListener\("click"[\s\S]*DEFAULT_GLASS_PANEL_COLOR/);
  assert.match(source, /const VIEWPORT_STATISTICS_PREFERENCE_KEY = "anime-hair-studio-viewport-statistics"/);
  assert.match(source, /viewportState\.state\.viewportStatisticsEnabled = readStoredBooleanPreference\(window, VIEWPORT_STATISTICS_PREFERENCE_KEY, true\)/);
  assert.match(source, /function setViewportStatisticsEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*viewportStats\.classList\.toggle\("hidden", !viewportState\.state\.viewportStatisticsEnabled\)[\s\S]*saveBooleanPreference\(VIEWPORT_STATISTICS_PREFERENCE_KEY, viewportState\.state\.viewportStatisticsEnabled\)/);
  assert.match(source, /viewportStatisticsPreferenceInput\.addEventListener\("change"[\s\S]*setViewportStatisticsEnabled\(viewportStatisticsPreferenceInput\.checked, \{ persist: false \}\)/);
  assert.match(source, /const LAYER_COLOR_SHIFTS_PREFERENCE_KEY = "anime-hair-studio-layer-color-shifts"/);
  assert.match(source, /sel\.state\.layerColorShiftsEnabled = readStoredBooleanPreference\(window, LAYER_COLOR_SHIFTS_PREFERENCE_KEY, true\)/);
  assert.match(source, /function setLayerColorShiftsEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*locks\.forEach\(materialApi\.applyMaterialDefinitionToLock\)[\s\S]*drawFlowApi\.updateDrawStrandPreview\(\)[\s\S]*saveBooleanPreference\(LAYER_COLOR_SHIFTS_PREFERENCE_KEY, sel\.state\.layerColorShiftsEnabled\)/);
  assert.match(source, /layerColorShiftsPreferenceInput\.addEventListener\("change"[\s\S]*setLayerColorShiftsEnabled\(layerColorShiftsPreferenceInput\.checked, \{ persist: false \}\)/);
  assert.match(source, /const OUTLINER_FOLDER_COLORS_PREFERENCE_KEY = "anime-hair-studio-outliner-folder-colors"/);
  assert.match(source, /const OUTLINER_FOLDER_COLOR_OPACITY_PREFERENCE_KEY = "anime-hair-studio-outliner-folder-color-opacity"/);
  assert.match(source, /function normalizeOutlinerFolderColorOpacity\(value\)[\s\S]*Math\.min\(100, Math\.max\(0, opacity\)\)[\s\S]*: 100/);
  assert.match(source, /function setOutlinerFolderColorOpacity\(value, \{ persist = true \} = \{\}\)[\s\S]*--outliner-folder-border-mix[\s\S]*--outliner-folder-background-mix[\s\S]*OUTLINER_FOLDER_COLOR_OPACITY_PREFERENCE_KEY/);
  assert.match(source, /outlinerFolderColorOpacityPreferenceInput\.addEventListener\("input"[\s\S]*setOutlinerFolderColorOpacity\(outlinerFolderColorOpacityPreferenceInput\.value, \{ persist: false \}\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /preferences:[\s\S]*outlinerFolderColorOpacity: deps\.miscState\.outlinerFolderColorOpacity,[\s\S]*preferences\.outlinerFolderColorOpacity[\s\S]*deps\.setOutlinerFolderColorOpacity/);
  assert.match(source, /preferencesOpenSnapshot = \{[\s\S]*outlinerFolderColorOpacity: miscState\.state\.outlinerFolderColorOpacity,[\s\S]*setOutlinerFolderColorOpacity\(miscState\.state\.outlinerFolderColorOpacity, \{ persist: false \}\)/);
  assert.match(css, /\.outliner-group \{[\s\S]*var\(--outliner-folder-border-mix, 58%\)[\s\S]*var\(--outliner-folder-background-mix, 11%\)/);
  assert.match(source, /sel\.state\.outlinerFolderColorsEnabled = readStoredBooleanPreference\(window, OUTLINER_FOLDER_COLORS_PREFERENCE_KEY, true\)/);
  assert.match(source, /function setOutlinerFolderColorsEnabled\(enabled, \{ persist = true \} = \{\}\) \{[\s\S]*classList\.toggle\("outliner-folder-colors-disabled", !sel\.state\.outlinerFolderColorsEnabled\)[\s\S]*saveBooleanPreference\(OUTLINER_FOLDER_COLORS_PREFERENCE_KEY, sel\.state\.outlinerFolderColorsEnabled\)/);
  assert.match(source, /outlinerFolderColorsPreferenceInput\.addEventListener\("change"[\s\S]*setOutlinerFolderColorsEnabled\(outlinerFolderColorsPreferenceInput\.checked, \{ persist: false \}\)/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function downloadPreferencesAndPresets\(\)[\s\S]*compactToolButtons: deps\.miscState\.compactToolButtonsEnabled[\s\S]*outlinerFolderColors: deps\.sel\.outlinerFolderColorsEnabled/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /function loadPreferencesAndPresets\(file\)[\s\S]*deps\.setCompactToolButtonsEnabled\([\s\S]*deps\.setOutlinerFolderColorsEnabled\(/);
  assert.match(source, /function openPreferencesDialog\(\)[\s\S]*compactToolButtonsEnabled[\s\S]*outlinerFolderColorsEnabled[\s\S]*preferencesDialog\.showModal/);
  assert.match(source, /function savePreferencesDialog\(\)[\s\S]*COMPACT_TOOL_BUTTONS_PREFERENCE_KEY[\s\S]*OUTLINER_FOLDER_COLORS_PREFERENCE_KEY/);
  assert.match(source, /function cancelPreferencesDialog\(\)[\s\S]*preferencesOpenSnapshot\.compactToolButtonsEnabled[\s\S]*preferencesOpenSnapshot\.outlinerFolderColorsEnabled/);
  assert.match(source, /const SIDE_NAMING_PERSPECTIVE_PREFERENCE_KEY = "anime-hair-studio-side-naming-perspective"[\s\S]*fallback: "viewport"[\s\S]*normalize: normalizeSideNamingPerspective/);
  assert.match(source, /function sideNamingDisplayId\(id\)[\s\S]*"side-bangs-left": "side-bangs-right"[\s\S]*function setSideNamingPerspective\(value,[\s\S]*updateSideNamingLabels\(\)/);
  assert.match(source, /sideNamingPerspectivePreferenceInput\.addEventListener\("change"[\s\S]*setSideNamingPerspective\(sideNamingPerspectivePreferenceInput\.value, \{ persist: false \}\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /const adjustedFactor = deps\.hairState\.showGroupColors[\s\S]*deps\.sel\.layerColorShiftsEnabled \? Number\(MATERIAL_LAYER_COLOR_FACTORS[\s\S]*if \(deps\.hairState\.showGroupColors \|\| deps\.sel\.layerColorShiftsEnabled\)/);
  assert.match(source, /function openPreferencesDialog\(\) \{[\s\S]*layerColorShiftsEnabled[\s\S]*preferencesDialog\.showModal/);
  assert.match(source, /function savePreferencesDialog\(\) \{[\s\S]*saveBooleanPreference\(LAYER_COLOR_SHIFTS_PREFERENCE_KEY, sel\.state\.layerColorShiftsEnabled\)/);
  assert.match(source, /function cancelPreferencesDialog\(\) \{[\s\S]*setLayerColorShiftsEnabled\(ui\.state\.preferencesOpenSnapshot\.layerColorShiftsEnabled, \{ persist: false \}\)/);
  assert.match(source, /const DEFAULT_HAIR_SHADER_PREFERENCE_KEY = "anime-hair-studio-default-hair-shader"[\s\S]*hairState\.state\.defaultHairShader = readStoredPreference\(window, DEFAULT_HAIR_SHADER_PREFERENCE_KEY, \{[\s\S]*fallback: STANDARD_ANISOTROPIC_SHADER[\s\S]*normalize: normalizeHairShader/);
  assert.match(source, /const hairMaterialDefinitions = \[\{[\s\S]*shader: hairState\.state\.defaultHairShader[\s\S]*function setDefaultHairShader\(shader, \{ persist = true \} = \{\}\)/);
  assert.match(source, /function savePreferencesDialog\(\) \{[\s\S]*writeStoredPreference\(window, DEFAULT_HAIR_SHADER_PREFERENCE_KEY, hairState\.state\.defaultHairShader\)/);
  assert.match(source, /function cancelPreferencesDialog\(\) \{[\s\S]*setDefaultHairShader\(ui\.state\.preferencesOpenSnapshot\.defaultHairShader, \{ persist: false \}\)/);
  assert.match(css, /\.preferences-dialog\s*\{[\s\S]*width:\s*min\(780px[\s\S]*height:\s*min\(620px[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.preferences-dialog-shell\s*\{[\s\S]*display:\s*flex[\s\S]*flex-direction:\s*column[\s\S]*height:\s*100%/);
  assert.match(css, /\.preferences-dialog-head-actions\s*\{[\s\S]*display:\s*flex/);
  assert.match(css, /\.preferences-workspace\s*\{[\s\S]*grid-template-columns:\s*170px minmax\(0, 1fr\)/);
  assert.match(css, /\.preferences-content\s*\{[\s\S]*overflow:\s*auto/);
  assert.match(css, /\.preferences-categories button\.active\s*\{[\s\S]*box-shadow:\s*inset 3px 0 #58f6ff/);
  assert.match(css, /\.preference-toggle,[\s\S]*\.preference-select,[\s\S]*\.preference-slider,[\s\S]*\.preference-color,[\s\S]*\.preference-choice\s*\{[\s\S]*justify-content:\s*space-between/);
  assert.match(css, /\.preference-backup-actions\s*\{[\s\S]*display:\s*flex/);
  assert.match(css, /\.preferences-section\s*\{[\s\S]*display:\s*grid;[\s\S]*gap:\s*8px/);
  assert.match(css, /\.viewport-stats\.hidden\s*\{\s*display:\s*none/);
  assert.match(css, /body\.compact-tool-buttons \.viewport-tools \.tool-button,[\s\S]*width:\s*42px;[\s\S]*min-height:\s*34px/);
  assert.match(css, /body\.compact-tool-buttons \.viewport-tools \.tool-button kbd,[\s\S]*display:\s*none/);
  assert.match(css, /body\.outliner-folder-colors-disabled \.outliner-group\s*\{[\s\S]*background:\s*transparent/);
  assert.match(css, /\.viewport-bottom-left-guidance\s*\{[\s\S]*left:\s*18px;[\s\S]*bottom:\s*18px;[\s\S]*flex-direction:\s*column/);
  assert.match(css, /\.viewport-navigation-tips > div\.hidden\s*\{\s*display:\s*none/);
  assert.match(css, /\.shortcut-row\.hidden\s*\{\s*display:\s*none/);
  assert.doesNotMatch(css, /\.viewport-panel\.navigation-tips-visible/);
  assert.match(localization, /"Experimental Features":/);
  assert.match(localization, /"Procedural Draw":/);
  assert.match(localization, /"Layer color and brightness shifts":/);
  assert.match(localization, /"Radial menus":/);
  assert.doesNotMatch(localization, /SDF strand fusion|Preview SDF Fusion|Clear SDF/);
  assert.match(localization, /"Tool tips":/);
  assert.match(localization, /"Compact tool buttons":/);
  assert.match(localization, /"Panel style":[\s\S]*"Default Panels":[\s\S]*"No Panels":[\s\S]*"Glass Panels":[\s\S]*"Glass panel color":[\s\S]*"Set the dark smokey tint used by Glass Panels\.":[\s\S]*"Reset glass panel color":/);
  assert.match(localization, /"Outliner folder colors":/);
  assert.match(localization, /"Default shader":/);
  assert.match(localization, /"Load Preferences & Presets":/);
  assert.match(localization, /"Show contextual modeling guidance in the viewport\.":/);
  assert.match(localization, /"Show selected and total vertex, triangle, and FPS statistics\.":/);
  assert.match(localization, /"Navigation tips":/);
  assert.match(localization, /"Navigation style":/);
  assert.match(localization, /"Middle Mouse":/);
  assert.match(localization, /"Alt \+ Left Mouse":/);
  assert.match(localization, /"Center viewport on selected object":/);
  assert.equal(packageData.version, "0.1.5-Sintaka.0.2.63");
  assert.match(configSource, /APP_VERSION\s*=\s*["']0\.1\.5-Sintaka\.0\.2\.157["']/);
});

test("title bar exposes icon-only Patreon and Ko-fi support links", async () => {
  const [html, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);
  assert.match(
    html,
    /class="patreon-link"[\s\S]*href="https:\/\/www\.patreon\.com\/cw\/animehairstudio"[\s\S]*target="_blank"[\s\S]*rel="noopener noreferrer"[\s\S]*title="Support Anime Hair Studio on Patreon"[\s\S]*aria-label="Support Anime Hair Studio on Patreon"[\s\S]*<svg/
  );
  assert.match(
    html,
    /class="kofi-link"[\s\S]*href="https:\/\/ko-fi\.com\/animehairstudio"[\s\S]*target="_blank"[\s\S]*rel="noopener noreferrer"[\s\S]*title="Support Anime Hair Studio on Ko-fi"[\s\S]*aria-label="Support Anime Hair Studio on Ko-fi"[\s\S]*<svg/
  );
  assert.match(css, /\.patreon-link,[\s\S]*\.kofi-link\s*\{[\s\S]*\.patreon-link\s*\{[\s\S]*margin-left:\s*auto[\s\S]*\.kofi-link\s*\{[\s\S]*margin-left:\s*4px[\s\S]*\.patreon-link:hover,[\s\S]*color:\s*#ff6b4a[\s\S]*\.kofi-link:hover,[\s\S]*color:\s*#54c7ec[\s\S]*\.kofi-link svg\s*\{/);
});

test("help menu exposes a complete keyboard shortcut reference", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  assert.match(html, /id=["']helpMenu["'][\s\S]*?id=["']openShortcuts["'][\s\S]*?id=["']openPatchNotes["'][\s\S]*?Patch Notes[\s\S]*?id=["']joinDiscord["']/);
  assert.match(html, /id=["']shortcutsDialog["'][\s\S]*?Keyboard Shortcuts[\s\S]*?<h3>Tools<\/h3>[\s\S]*?<kbd>Q<\/kbd>[\s\S]*?<kbd>W<\/kbd>[\s\S]*?<kbd>E<\/kbd>[\s\S]*?<kbd>R<\/kbd>[\s\S]*?<kbd>T<\/kbd>[\s\S]*?<kbd>D<\/kbd>[\s\S]*?<kbd>P<\/kbd>[\s\S]*?<kbd>G<\/kbd>[\s\S]*?<h3>Selection<\/h3>[\s\S]*?<h3>Curves<\/h3>[\s\S]*?<h3>Editing<\/h3>[\s\S]*?<h3>General and Viewport<\/h3>/);
  assert.match(html, /id=["']patchNotesDialog["'][\s\S]*?data-patch-notes-version=["']0\.1\.4["'][\s\S]*?<time datetime=["']2026-08-05["']>August 5, 2026<\/time>[\s\S]*?data-patch-notes-version=["']0\.1\.3["'][\s\S]*?<time datetime=["']2026-07-30["']>July 30, 2026<\/time>[\s\S]*?data-patch-notes-version=["']0\.1\.2["'][\s\S]*?<time datetime=["']2026-07-25["']>July 25, 2026<\/time>[\s\S]*?data-patch-notes-version=["']0\.1\.1["'][\s\S]*?<time datetime=["']2026-07-23["']>July 23, 2026<\/time>[\s\S]*?data-patch-notes-panel=["']0\.1\.4["'][\s\S]*?<h3>New tools<\/h3>[\s\S]*?<h3>New features<\/h3>[\s\S]*?<h3>Editing improvements<\/h3>[\s\S]*?<h3>Files and projects<\/h3>[\s\S]*?<h3>UI\/UX<\/h3>[\s\S]*?<h3>Performance<\/h3>[\s\S]*?<h3>Bug fixes<\/h3>[\s\S]*?<h3>Misc<\/h3>[\s\S]*?data-patch-notes-panel=["']0\.1\.3["'][\s\S]*?Anime Hair Studio Version 0\.1\.3 Patch Notes[\s\S]*?data-patch-notes-panel=["']0\.1\.2["'][\s\S]*?<h3>Editing and navigation<\/h3>[\s\S]*?<h3>References and outliner<\/h3>[\s\S]*?<h3>Preferences and shortcuts<\/h3>[\s\S]*?<h3>Experimental radial menus<\/h3>[\s\S]*?<h3>Hair cards<\/h3>[\s\S]*?data-patch-notes-panel=["']0\.1\.1["'][\s\S]*?<h3>New tools<\/h3>[\s\S]*?<h3>Strand editing<\/h3>[\s\S]*?<h3>Visibility and interface<\/h3>[\s\S]*?<h3>Materials<\/h3>[\s\S]*?<h3>Bug fixes<\/h3>/);
  assert.doesNotMatch(html, /0\.1\.4 Draft|Draft notes used to preview patch-note history navigation/);
  assert.match(html, /<h3>Selection<\/h3>[\s\S]*?<kbd>B<\/kbd>[\s\S]*?<kbd>Hold B<\/kbd>[\s\S]*?<h3>Curves<\/h3>/);
  assert.match(html, /<h3>Curves<\/h3>[\s\S]*?<kbd>H<\/kbd>[\s\S]*?<h3>Editing<\/h3>[\s\S]*?<kbd>X<\/kbd><span>Toggle X-axis mirror editing<\/span>/);
  assert.doesNotMatch(html, /Previous curve point in the hierarchy|Next curve point in the hierarchy/);
  assert.match(html, /<h3>Editing<\/h3>[\s\S]*?<kbd>S<\/kbd>[\s\S]*?Adjust the active brush size[\s\S]*?<kbd>Delete<\/kbd>[\s\S]*?<kbd>O<\/kbd>/);
  assert.match(html, /Orbit drag[\s\S]*<kbd>Hold Shift<\/kbd>[\s\S]*Snap the camera to cardinal views[\s\S]*Orbit the camera[\s\S]*<kbd>F<\/kbd>[\s\S]*Cycle selected and full-scene framing[\s\S]*Hold Q \/ W \/ E \/ R[\s\S]*Choose options for that tool[\s\S]*Close the active menu or window/);
  assert.match(source, /openShortcutsButton\.addEventListener\("click", \(\) => shortcutsDialog\.showModal\(\)\)/);
  assert.match(source, /\[closeShortcutsButton, dismissShortcutsButton\][\s\S]*shortcutsDialog\.close\(\)/);
  assert.match(source, /function selectPatchNotesVersion\(version\)[\s\S]*patchNotesPanels\.find[\s\S]*aria-selected[\s\S]*panel\.hidden = panel !== selectedPanel[\s\S]*patchNotesDialogTitle\.textContent[\s\S]*selectedPanel\.scrollTop = 0/);
  assert.match(source, /openPatchNotesButton\.addEventListener\("click"[\s\S]*selectPatchNotesVersion\(patchNotesVersionButtons\[0\][\s\S]*patchNotesDialog\.showModal\(\)/);
  assert.match(source, /\[closePatchNotesButton, dismissPatchNotesButton\][\s\S]*patchNotesDialog\.close\(\)/);
  assert.match(css, /\.shortcuts-dialog\s*\{[\s\S]*width:\s*min\(1180px/);
  assert.match(css, /\.patch-notes-dialog\s*\{[\s\S]*width:\s*min\(1040px[\s\S]*height:\s*calc\(100vh - 32px\)[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.patch-notes-dialog-shell\s*\{[\s\S]*height:\s*100%/);
  assert.match(css, /\.patch-notes-workspace\s*\{[\s\S]*grid-template-columns:\s*150px minmax\(0, 1fr\)/);
  assert.match(css, /\.patch-notes-sidebar button\.active\s*\{[\s\S]*color:\s*#74f5ff/);
  assert.match(css, /\.patch-notes-content\s*\{[\s\S]*overflow:\s*auto/);
  // The global `body { user-select: none }` / `input, textarea { user-select: text }`
  // rules were removed; selection behavior now follows the browser default, so the
  // user-select css assertions are gone.
  assert.match(css, /\.shortcuts-sections\s*\{[\s\S]*grid-template-columns:\s*repeat\(5,/);
  assert.match(css, /@media \(max-width:\s*1000px\)[\s\S]*\.shortcuts-sections\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /\.shortcut-row kbd,[\s\S]*font:\s*700 11px/);
});

test("undo and redo preserve the active mirror editing toggle", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(
    source,
    /function undoLastAction\(\)[\s\S]*restoreState\(state, \{ preserveMirrorMode: true \}\)[\s\S]*undo\.state\.restoringHistory = false[\s\S]*updateHistoryButtons\(\)/
  );
  assert.match(
    source,
    /function redoLastAction\(\)[\s\S]*restoreState\(state, \{ preserveMirrorMode: true \}\)[\s\S]*undo\.state\.restoringHistory = false[\s\S]*updateHistoryButtons\(\)/
  );
  assert.match(
    source,
    /function restoreSharedStateForStateRestore\(state, restorePlan, \{ preserveMirrorMode = false \}[\s\S]*?setMirrorXEditing\(preserveMirrorMode \? sculptState\.state\.mirrorXEditing : Boolean\(state\.mirrorXEditing\)\)/
  );
  assert.match(
    source,
    /function undoLastAction\(\)[\s\S]*try \{[\s\S]*restoreState\(state, \{ preserveMirrorMode: true \}\)[\s\S]*finally \{[\s\S]*undo\.state\.restoringHistory = false[\s\S]*updateHistoryButtons\(\)/
  );
  assert.match(
    source,
    /function redoLastAction\(\)[\s\S]*try \{[\s\S]*restoreState\(state, \{ preserveMirrorMode: true \}\)[\s\S]*finally \{[\s\S]*undo\.state\.restoringHistory = false[\s\S]*updateHistoryButtons\(\)/
  );
  assert.match(
    source,
    /function finalizeStateRestore\(state\) \{[\s\S]*restoreRefreshes\.run\(\{ state \}\)[\s\S]*function restoreState\(state,[\s\S]*undo\.state\.restoringHistory = true;\s*try \{[\s\S]*finalizeStateRestore\(state\);[\s\S]*\} finally \{\s*undo\.state\.restoringHistory = false/
  );
  assert.match(
    source,
    /function resetTransientInteractionsForStateRestore\(\) \{[\s\S]*proceduralDuplicatePreview = null[\s\S]*transformControls\.detach\(\)[\s\S]*duplicatePlacement = null[\s\S]*hideProceduralDuplicateArcPreview\(\)[\s\S]*hideStrandRadialMenu\(\)[\s\S]*hideToolRadialMenu\(\)[\s\S]*placeEdit = null[\s\S]*transformDragging = false[\s\S]*updateInteractionLocks\(\)[\s\S]*function restoreState\(state,[\s\S]*try \{\s*resetTransientInteractionsForStateRestore\(\);\s*resetEditableSceneForStateRestore\(\);\s*restoreSharedStateForStateRestore\(state, restorePlan, \{ preserveMirrorMode \}\);\s*scalpBuilder\.restoreAuthoredScalpForStateRestore\(state, \{ preservePlacement \}\);\s*restoreSceneCollectionsForStateRestore\(restorePlan, \{ deferRootAttachments, preservePlacement \}\);\s*validateSelectionAfterStateRestore\(\);[\s\S]*reapplySelectionAfterStateRestore\(restorePlan\);[\s\S]*finalizeStateRestore\(state\)/
  );
  // The history-preservation machinery (historyStatesShareAuthoredScalp /
  // historyLocksToRebuild / preservedHistoryRuntimeLocks / preservedLocks /
  // historyRootAttachmentCache / preserveScalpGeometry) was removed: state restore is
  // now the simplified transactional path above, and root attachments are rebuilt
  // through restoreLock's remapRootAttachment option.
  assert.doesNotMatch(source, /historyStatesShareAuthoredScalp|historyLocksToRebuild|preservedHistoryRuntimeLocks|historyRootAttachmentCache|preserveScalpGeometry/);
  assert.match(
    source,
    /undo\.state\.historyShortcutHeld = false[\s\S]*event\.key\.toLowerCase\(\) === "z"[\s\S]*event\.repeat \|\| undo\.state\.historyShortcutHeld[\s\S]*undo\.state\.historyShortcutHeld = true[\s\S]*undoLastAction\(\)[\s\S]*event\.key\.toLowerCase\(\) === "y"[\s\S]*event\.repeat \|\| undo\.state\.historyShortcutHeld[\s\S]*undo\.state\.historyShortcutHeld = true[\s\S]*redoLastAction\(\)/
  );
  assert.match(
    source,
    /window\.addEventListener\("keyup", \(event\) => \{[\s\S]*\["z", "y", "control", "meta"\]\.includes\(event\.key\.toLowerCase\(\)\)[\s\S]*undo\.state\.historyShortcutHeld = false/
  );
});

test("holding Spacebar drives a release-to-confirm strand radial menu", async () => {
  const [html, source, css, radialLayout] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-layout.js", import.meta.url), "utf8")
  ]);

  const [radialMenu, drawFlow] = await Promise.all([
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
  ]);

  assert.match(
    html,
    /id=["']strandRadialMenu["'][\s\S]*data-strand-radial-action=["']mirror-selected-strands["'][\s\S]*data-strand-radial-action=["']duplicate["'][\s\S]*data-strand-radial-action=["']delete["']/
  );
  assert.match(html, /<kbd>Hold Spacebar<\/kbd>[\s\S]*Choose from the contextual radial menu/);
  assert.match(css, /\.strand-radial-menu\s*\{[\s\S]*border-radius:\s*50%/);
  assert.match(css, /\.strand-radial-line\s*\{[\s\S]*transform-origin:\s*left center/);
  assert.match(css, /translateX\(var\(--radial-button-radius, calc\(var\(--radial-radius\) \+ var\(--radial-radius-offset, 0px\)\)\)\)/);
  assert.match(css, /\.strand-radial-menu button\.selected/);
  assert.match(css, /> button:not\(\.radial-back\)::before[\s\S]*width:\s*var\(--radial-sector-size, var\(--radial-size\)\)[\s\S]*conic-gradient\([\s\S]*--radial-sector-start[\s\S]*--radial-sector-span[\s\S]*mask:\s*radial-gradient/);
  assert.match(css, /> button:not\(\.radial-back\):not\(\.radial-submenu-option\)::before[\s\S]*--radial-sector-divider-start[\s\S]*rgb\(255 255 255 \/ 20%\) 0 0\.45deg[\s\S]*transparent 0\.45deg 1turn/);
  assert.match(css, /> button\.radial-submenu-option::after[\s\S]*--radial-sector-divider-start[\s\S]*transparent 0\.45deg calc\(var\(--radial-sector-span\) - 0\.45deg\)[\s\S]*rgb\(255 255 255 \/ 20%\) calc\(var\(--radial-sector-span\) - 0\.45deg\) var\(--radial-sector-span\)[\s\S]*mask:\s*radial-gradient/);
  assert.match(css, /> button:not\(\.radial-back\)\.selected::before[\s\S]*radial-gradient\([\s\S]*rgb\(88 246 255 \/ 2%\)[\s\S]*rgb\(88 246 255 \/ 34%\)[\s\S]*conic-gradient\([\s\S]*mask-composite:\s*intersect[\s\S]*rgb\(88 246 255 \/ 16%\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function applyRadialSectorVariables\(button, option, options, menu, geometry = null\)[\s\S]*radialOptionSector\([\s\S]*\{ gap: 0 \}[\s\S]*labelRadius[\s\S]*--radial-button-radius[\s\S]*--radial-sector-size[\s\S]*--radial-sector-start[\s\S]*--radial-sector-divider-start[\s\S]*--radial-sector-center-x/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /const labelRadius = geometry\?\.labelRadius[\s\S]*Math\.min\(optionRadius, size \* 0\.5 - 82\)/);
  assert.match(css, /\.strand-radial-menu button\.has-submenu::after[\s\S]*content:\s*"›"[\s\S]*--submenu-arrow-x[\s\S]*--submenu-arrow-y[\s\S]*--submenu-arrow-angle/);
  assert.match(css, /\.strand-radial-menu button\.has-submenu,[\s\S]*button\.has-submenu\.selected[\s\S]*border-color:\s*transparent[\s\S]*background:\s*transparent[\s\S]*box-shadow:\s*none/);
  // Disabled radial buttons no longer keep the transparent has-submenu look; they now
  // get the explicit disabled styling below.
  assert.match(css, /\.strand-radial-menu button:disabled[\s\S]*border-color:\s*#403b43[\s\S]*background:\s*#211f24[\s\S]*color:\s*#746e78/);
  assert.match(css, /\.strand-radial-menu button\.radial-back,[\s\S]*width:\s*54px[\s\S]*height:\s*54px[\s\S]*border:\s*1px solid rgb\(240 193 90 \/ 50%\)[\s\S]*border-radius:\s*50%[\s\S]*background:\s*rgb\(22 20 26 \/ 96%\)/);
  assert.match(css, /--radial-size:\s*220px[\s\S]*width:\s*var\(--radial-size\)/);
  assert.match(radialLayout, /function radialMenuAngles\(optionCount\)[\s\S]*count === 1[\s\S]*count === 2[\s\S]*count === 3[\s\S]*count === 4[\s\S]*Math\.PI \* 2 \/ count/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function ensureRadialButtonCapacity\([\s\S]*while \(buttons\.length < count\)[\s\S]*menu\.insertBefore\(button, insertBefore\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /--radial-radius-offset[\s\S]*option\.radiusOffset \|\| 0/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function configureRadialSubmenuIndicator\(button, option, kind\)[\s\S]*option\?\.submenu[\s\S]*radialButtonRayExtent\(option\.angle[\s\S]*aria-haspopup[\s\S]*--submenu-arrow-angle/);
  // The submenu indicator no longer uses a separate .radial-submenu-label element:
  // the arrow is now a ::after pseudo-element positioned with --submenu-arrow-x/y and
  // rotated via --submenu-arrow-angle (set in radial-menu.js configureRadialSubmenuIndicator).
  assert.match(radialMenu, /function configureRadialSubmenuIndicator\(button, option, kind\)[\s\S]*const arrowDistance = radialButtonRayExtent\(option\.angle, \{[\s\S]*buttonWidth: buttonDimensions\.width[\s\S]*buttonHeight: buttonDimensions\.height[\s\S]*\}\) \+ 10[\s\S]*--submenu-arrow-x[\s\S]*--submenu-arrow-y[\s\S]*--submenu-arrow-angle/);
  assert.match(css, /\.strand-radial-menu button\.has-submenu::after[\s\S]*content:\s*"›"[\s\S]*--submenu-arrow-x[\s\S]*--submenu-arrow-y[\s\S]*rotate\(var\(--submenu-arrow-angle\)\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function radialButtonDimensions\(kind, option = null\)[\s\S]*option\?\.action === "back-to-main"[\s\S]*width: 54, height: 54/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /button\.classList\.toggle\("radial-back", option\?\.action === "back-to-main"\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function layoutContextualRadialOptions\(kind,[\s\S]*backAngle = Math\.PI \* 0\.5[\s\S]*anchorAction: "back-to-main"[\s\S]*anchorAngle: backAngle[\s\S]*backOption\.radiusOffset = backRadiusOffset/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /partitionRadialOptions\(toolRadialOptions\(\), MAX_RADIAL_OPTIONS\)[\s\S]*layoutRadialOptions\(partitioned\.radialOptions\)[\s\S]*applyRadialMenuDimensions\(deps\.toolRadialMenu, options\.length, sharedRadialFrameDimensions\(\)\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function radialMenuDimensionsForKind\(kind, optionCount\)[\s\S]*\["selection", "clump"\]\.includes\(kind\) \? 8 : 18/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /const MAX_RADIAL_OPTIONS = 8[\s\S]*const MAX_RADIAL_SUBMENU_OPTIONS = 5[\s\S]*const RADIAL_SUBMENU_SLOT_COUNT = 12[\s\S]*const STANDARD_RADIAL_FRAME_DIMENSIONS = radialMenuDimensions\(MAX_RADIAL_OPTIONS,[\s\S]*buttonWidth: 138[\s\S]*buttonHeight: 42[\s\S]*gap: 8/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function sharedRadialFrameDimensions\(\) \{[\s\S]*return \{ \.\.\.STANDARD_RADIAL_FRAME_DIMENSIONS \}/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function layoutContextualRadialOptions\(kind,[\s\S]*partitionRadialOptions\([\s\S]*options,[\s\S]*MAX_RADIAL_OPTIONS,[\s\S]*MAX_RADIAL_SUBMENU_OPTIONS[\s\S]*layoutRadialOptions\(partitioned\.radialOptions[\s\S]*listOptions: partitioned\.listOptions/);
  assert.match(html, /id="strandRadialActionList" class="radial-action-list hidden"[\s\S]*id="toolRadialActionList" class="radial-action-list hidden"/);
  assert.match(css, /\.strand-radial-menu \.radial-action-list\s*\{[\s\S]*top:\s*calc\(100% \+ var\(--radial-action-list-offset, 8px\)\)[\s\S]*width:\s*190px/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function radialListOptionAtPointer\(container, options, event\)[\s\S]*containerBounds = container\.getBoundingClientRect\(\)[\s\S]*buttons = \[\.\.\.container\.querySelectorAll[\s\S]*function updateStrandRadialGesture\(event\)[\s\S]*activeListOptions = gesture\.submenu\?\.listOptions \|\| gesture\.listOptions[\s\S]*radialListOptionAtPointer\(deps\.strandRadialActionList, activeListOptions, event\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function applyRadialMenuDimensions\(menu, optionCount, fixedDimensions = null\)[\s\S]*fixedDimensions\?\.size \|\| dimensions\.size[\s\S]*fixedDimensions\?\.radius \|\| dimensions\.radius/);
  // moved to modules/geometry/radial-menu.js
  assert.match(
    radialMenu,
    /function beginStrandRadialGesture\(\) \{[\s\S]*centerX: deps\.lastPointer\.x[\s\S]*centerY: deps\.lastPointer\.y[\s\S]*frameDimensions: sharedRadialFrameDimensions\(\)[\s\S]*deps\.strandRadialMenu\.classList\.remove\("hidden"\)/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /function updateStrandRadialGesture\(event\) \{[\s\S]*distance <= 34[\s\S]*gesture\.action[\s\S]*strandRadialLine\.style\.transform/
  );
  assert.match(source, /event\.code === "Space"[\s\S]*beginStrandRadialGesture\(\)/);
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*event\.code === "Space"[\s\S]*finishStrandRadialGesture\(\)/);
  assert.doesNotMatch(source, /renderer\.domElement\.addEventListener\("contextmenu"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(
    radialMenu,
    /function performStrandRadialAction\(action, lockId\) \{[\s\S]*action === "mirror-selected-strands"[\s\S]*mirrorSelectionTargets\(deps\.selectedLocksInOrder\(\), deps\.mirrorPartnerFor\)[\s\S]*deps\.createMirrorPartner\(lock, \{ deferUi: true \}\)[\s\S]*action === "decouple-selected-mirrors"[\s\S]*decouple\.forEach\(deps\.decoupleMirrorPartner\)[\s\S]*if \(action === "duplicate"\)[\s\S]*deps\.beginDuplicatePlacement\(lock\)[\s\S]*if \(action === "delete"\)[\s\S]*deps\.deleteLocks\(\[lock\]\)/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /function selectedMirrorRadialOptions\(\)[\s\S]*selectedLocks\.length === 1 \? "Mirror Strand" : "Mirror Strands"[\s\S]*decouple\.length === 1[\s\S]*Decouple Mirror Instance[\s\S]*Decouple \$\{decouple\.length\} Mirror Instances/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /action: "decouple-selected-mirrors",\s*label: decouple\.length === 1[\s\S]*`Decouple \$\{decouple\.length\} Mirror Instances`,\s*list: true\s*\}/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /action: "decouple-mirrored-clump"[\s\S]*list: true/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /kind === "selection"[\s\S]*\.\.\.selectedMirrorRadialOptions\(\)[\s\S]*return \[[\s\S]*\.\.\.selectedMirrorRadialOptions\(\)[\s\S]*Duplicate strand/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /function contextualRadialOptions\(kind\) \{[\s\S]*kind === "root"[\s\S]*open-workspace-submenu[\s\S]*open-live-surface-submenu[\s\S]*open-edit-mode-submenu[\s\S]*kind === "workspace-submenu"[\s\S]*workspace-strand[\s\S]*workspace-guide[\s\S]*workspace-reference[\s\S]*kind === "live-surface-submenu"[\s\S]*activeStrokeSurfaceInput\(\)\.options[\s\S]*toggle-dynamic-surface[\s\S]*kind === "edit-mode-submenu"[\s\S]*edit-mode-component[\s\S]*edit-mode-object/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /option\.dataset\.userCreatedLiveSurface = "true"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /list: option\.dataset\.userCreatedLiveSurface === "true"[\s\S]*action: "toggle-dynamic-surface"[\s\S]*label: deps\.drawFlowApi\.drawSurfaceDynamicEnabled\(\) \? "Disable Dynamic" : "Enable Dynamic"/);
  // moved to modules/geometry/radial-menu.js (the guide/reference radial kinds were
  // retired: with no strand selected but a guide/reference selection present the
  // gesture now returns false instead of opening a guide/reference radial menu).
  assert.match(
    radialMenu,
    /function beginStrandRadialGesture\(\) \{[\s\S]*const lock = deps\.getSelectedLock\(\)[\s\S]*hasOtherSelection = Boolean\(deps\.sel\.selectedStrandGroup \|\| deps\.guideApi\.getSelectedGuide\(\) \|\| deps\.referenceHeadApi\.selectedReferenceImage\(\)\)[\s\S]*if \(!lock && hasOtherSelection\) return false;[\s\S]*const selectedClumpGuide = deps\.sel\.clumpViewportSelection \? deps\.clumpGuideForLock\(lock\) : null[\s\S]*const kind = selectedClumpGuide[\s\S]*\? "clump"[\s\S]*deps\.selectedLocksInOrder\(\)\.length > 1 \? "selection"[\s\S]*lock \? "strand"[\s\S]*"root"[\s\S]*configureContextualRadialMenu\(kind, options, listOptions\)/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function openStrandRadialSubmenu\(option\)[\s\S]*filter\(\(\{ action \}\) => action !== "back-to-main"\)[\s\S]*layoutRadialSubmenuSlots\([\s\S]*option\.angle[\s\S]*slotCount: RADIAL_SUBMENU_SLOT_COUNT[\s\S]*const outerRadius = parentOuterRadius \+ 82[\s\S]*const labelRadius = parentOuterRadius \+ 43[\s\S]*--radial-action-list-offset[\s\S]*outerRadius - parentOuterRadius \+ 8[\s\S]*radial-submenu-option[\s\S]*sectorAngles: slotAngles[\s\S]*sectorIndex: submenuOption\.radialSlotIndex[\s\S]*options: hitOptions/);
  // The duplicate-procedural button no longer has a dedicated 72px / pre-line style
  // (it uses the standard selection radial sizing), and its label no longer embeds a
  // line break.
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /action: "duplicate-procedural", label: "Duplicate Procedural"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function closeStrandRadialSubmenu[\s\S]*removeProperty\("--radial-action-list-offset"\)[\s\S]*renderRadialActionList/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function updateStrandRadialGesture\(event\)[\s\S]*closestCandidate[\s\S]*optionsAtPointer\.reduce[\s\S]*closestCandidate\?\.enabled === false \? null : closestCandidate/);
  // The submenu-entry-distance helpers live in modules/geometry/radial-layout.js;
  // app.js only imports radialButtonEntryDistance (it no longer defines either
  // function inline).
  assert.doesNotMatch(source, /strandRadialSubmenuEntryDistance|function radialButtonEntryDistance/);
  assert.match(source, /radialButtonEntryDistance,/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function updateStrandRadialGesture\(event\)[\s\S]*gesture\.submenu && distance <= 34[\s\S]*closeStrandRadialSubmenu\(\)[\s\S]*distance <= gesture\.submenu\.parentOuterRadius[\s\S]*closestOption\?\.submenu[\s\S]*openStrandRadialSubmenu\(closestOption\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function performStrandRadialAction\(action, lockId\) \{[\s\S]*action === "toggle-dynamic-surface"[\s\S]*deps\.drawFlowApi\.setDrawSurfaceDynamicEnabled\(!deps\.drawFlowApi\.drawSurfaceDynamicEnabled\(\)\)[\s\S]*action\?\.startsWith\("select-live-surface:"\)[\s\S]*setActiveStrokeSurfaceValue[\s\S]*action\?\.startsWith\("workspace-"\)[\s\S]*deps\.setViewportEditMode[\s\S]*action\?\.startsWith\("edit-mode-"\)[\s\S]*deps\.setViewportSelectionMode/);
  // moved to modules/geometry/draw-flow.js
  assert.match(
    drawFlow,
    /function setActiveStrokeSurfaceValue\(value\) \{[\s\S]*activeStrokeSurfaceInput\(\)[\s\S]*input\.value = normalized\.surface[\s\S]*dispatchEvent\(new Event\("change", \{ bubbles: true \}\)\)/
  );
});

test("newly drawn strands create linked mirror instances while X mirror is enabled", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);

  const [drawFlow] = await Promise.all([
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /app\.js\?v=20260910-20/);
  assert.match(html, /id="mirrorInstanceAction"[^>]*>Mirror Strand<\/button>/);
  assert.match(
    source,
    /function showOutlinerContextMenu\(event, target\)[\s\S]*mirrorInstanceAction\.classList\.toggle\("hidden", !strand && !isClump\)[\s\S]*Decouple Mirrored Clump[\s\S]*Mirror Clump[\s\S]*Decouple Mirrored Instance Strand[\s\S]*Mirror Strand/
  );
  assert.match(
    source,
    /mirrorInstanceAction\.addEventListener\("click"[\s\S]*pushUndoState\(\)[\s\S]*mirroredClumpPartners\(guide\)[\s\S]*decoupleMirroredClump\(guide\)[\s\S]*createMirroredClump\(guide\)[\s\S]*mirrorPartnerFor\(lock\)[\s\S]*decoupleMirrorPartner\(lock\)[\s\S]*createMirrorPartner\(lock\)/
  );
  assert.match(
    source,
    /function createMirrorPartnerForNewLock\(lock\) \{[\s\S]*!sculptState\.state\.mirrorXEditing[\s\S]*createMirrorPartner\(lock, \{ deferUi: true \}\)/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /const showMirrorPreview = Boolean\(deps\.mirrorPartnerFor\(extensionLock\)\)[\s\S]*!extensionLock && deps\.sculptState\.mirrorXEditing[\s\S]*drawStrandMirrorPreview\.visible = showMirrorPreview/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function createDrawnBraid\(stroke\) \{[\s\S]*createMirrorPartnerForNewLock\(lock\)[\s\S]*function createDrawnStrand/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function createDrawnStrand\(stroke\) \{[\s\S]*created\.map\(deps\.createMirrorPartnerForNewLock\)/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function finalizeDrawnLockSelection\(lock\) \{[\s\S]*selectLock\(lock\.id, \{ individualClumpMember: true \}\)[\s\S]*rebuildCurveObjects\(lock\)[\s\S]*updateCurveObjects\(lock, \{ visible: true \}\)[\s\S]*function createDrawnBraid[\s\S]*return finalizeDrawnLockSelection\(lock\)[\s\S]*function createDrawnStrand[\s\S]*return finalizeDrawnLockSelection\(created\[0\]\)[\s\S]*function createDrawnPanel[\s\S]*return finalizeDrawnLockSelection\(lock\)/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function createDrawnPanel\(stroke\) \{[\s\S]*createMirrorPartnerForNewLock\(lock\)/
  );
  assert.match(
    source,
    /X axis mirror is active\. New strands create linked mirror instances[\s\S]*Enable X axis mirror\. New strands will create linked mirror instances/
  );
});

test("camera view cube exposes six undo-free cardinal camera snaps", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="cameraViewCube"[\s\S]*data-camera-view="front"[\s\S]*data-camera-view="back"[\s\S]*data-camera-view="left"[\s\S]*data-camera-view="right"[\s\S]*data-camera-view="top"[\s\S]*data-camera-view="bottom"/);
  assert.match(source, /const CAMERA_VIEW_AXES = Object\.freeze\(\{[\s\S]*front: new THREE\.Vector3\(0, 0, 1\)[\s\S]*bottom: new THREE\.Vector3\(0, -1, 0\)/);
  // The old poleOffset/horizontalAxis trick is gone: top/bottom snaps now set the
  // camera-up directly (pole branch) and horizontal snaps record the view axis.
  assert.match(source, /function snapCameraToCardinalAxis\(axis, distance\) \{[\s\S]*camera\.up\.set\(0, 1, 0\)[\s\S]*lastHorizontalViewAxis\.copy\(axis\)[\s\S]*camera\.position\.copy\(controls\.target\)\.addScaledVector\(axis, distance\)[\s\S]*camera\.lookAt\(controls\.target\)/);
  assert.match(source, /camera\.up\.set\(0, 0, axis\.y > 0 \? -1 : 1\)/);
  assert.match(source, /function activateView\(event\)[\s\S]*snapCameraToCardinalAxis\(axis, distance\)[\s\S]*updateCameraViewCube\(\)/);
  assert.match(source, /cameraViewCubeFaces\.forEach\(\(face\) => \{[\s\S]*face\.addEventListener\("click", activateView\)/);
  assert.match(css, /\.camera-view-cube \{[\s\S]*top: 66px;[\s\S]*right: 18px;[\s\S]*perspective: 220px/);
  assert.match(css, /\.camera-view-cube-front[\s\S]*translateZ\(23px\)[\s\S]*\.camera-view-cube-bottom[\s\S]*rotateX\(-90deg\)/);
});

test("linked X-mirror instances reverse asymmetric width-curve sides", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  // Mirror partners no longer bake reversed asymmetric curves into storage: the
  // partner's points are mirrored and syncMirrorPartnerFromLock copies the authored
  // curves verbatim, so the local-side sampling reverses them at render time.
  assert.match(source, /function createMirrorPartner\(lock, options = \{\}\)[\s\S]*points: lock\.points\.map\(mirroredVector\)[\s\S]*syncMirrorPartnerFromLock\(lock, mirrored\)/);
  assert.match(source, /function syncMirrorPartnerFromLock[\s\S]*partner\.taperCurve = lock\.taperCurve\.map\(\(point\) => \(\{ \.\.\.point \}\)\)[\s\S]*partner\.taperCurveSecondary = lock\.taperCurveSecondary\.map\(\(point\) => \(\{ \.\.\.point \}\)\)[\s\S]*partner\.asymmetricWidthCurve = Boolean\(lock\.asymmetricWidthCurve\)/);
  assert.match(source, /partner\.depthCurve = lock\.depthCurve\.map[\s\S]*partner\.depthCurveSecondary = lock\.depthCurveSecondary\.map/);
  // normalizeLegacyMirroredAsymmetricWidthCurves was removed along with the
  // storage-time reversal: restored mirror partners render through the same
  // mirrored-points + local-side sampling path, so no legacy normalization runs.
});

test("project materials select standard, anime anisotropic, and Lambert shaders", async () => {
  const [html, source, config, shaderModule, materialState, localization, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/app-config.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/anime-hair-shaders.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/material/material-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [materialUi, ioTail] = await Promise.all([
    readFile(new URL("../modules/material/material-ui.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/io-tail.js", import.meta.url), "utf8"),
  ]);

  assert.match(
    html,
    /id=["']hairMaterialShader["'][\s\S]*value=["']standard-anisotropic["']>Standard Anisotropic<[\s\S]*value=["']anime-anisotropic["']>Anime Anisotropic<[\s\S]*value=["']lambert["']>Lambert</
  );
  assert.match(html, /app\.js\?v=20260910-20/);
  assert.match(
    html,
    /id=["']hairMaterialAnimeControls["'][\s\S]*id=["']hairMaterialAnimeBaseColor["'][\s\S]*value=["']#dbc2aa["'][\s\S]*id=["']hairMaterialAnimeShadowColor["'][\s\S]*value=["']#99675c["'][\s\S]*id=["']hairMaterialAnimeRimColor["'][\s\S]*value=["']#ffd9cf["'][\s\S]*id=["']hairMaterialAnimeRimStrength["'][\s\S]*value=["']0\.35["'][\s\S]*id=["']hairMaterialAnimeRimWidth["'][\s\S]*value=["']0\.3["'][\s\S]*id=["']hairMaterialAnimeHighlightEdgeSuppression["']/
  );
  assert.match(html, /id=["']hairMaterialGradientEnabled["'][\s\S]*id=["']editHairMaterialGradient["'][\s\S]*id=["']hairMaterialGradientDialog["'][\s\S]*id=["']hairMaterialGradientTrack["'][\s\S]*id=["']addHairMaterialGradientStop["']/);
  assert.match(html, /id=["']hairMaterialPreset["'][\s\S]*id=["']saveHairMaterialPreset["'][\s\S]*id=["']removeHairMaterialPreset["']/);
  assert.doesNotMatch(html, /id=["']shareHairMaterialPreset["']/);
  assert.match(config, /DEFAULT_HAIR_MATERIAL_SETTINGS[\s\S]*shader:\s*"standard-anisotropic"/);
  assert.match(materialState, /function normalizeHairMaterialDefinition\(material = \{\}\) \{[\s\S]*material\.shader = normalizeHairShader\(material\.shader\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function hairMaterialDefinition\(materialId\) \{[\s\S]*resolveHairMaterialDefinition\(deps\.hairMaterialDefinitions, materialId\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function renderHairMaterialOutliner\(\) \{[\s\S]*hairMaterialUsageCounts\(deps\.locks, deps\.hairMaterialDefinitions, DEFAULT_HAIR_MATERIAL_ID\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi,
    /function createHairMaterial\(lock\) \{[\s\S]*definition\.shader === ANIME_ANISOTROPIC_SHADER[\s\S]*createAnimeAnisotropicMaterial\(lock\)[\s\S]*definition\.shader === LAMBERT_SHADER[\s\S]*new THREE\.MeshLambertMaterial[\s\S]*new THREE\.MeshPhysicalMaterial/
  );
  // moved to modules/material/material-ui.js
  assert.match(materialUi,
    /function applyMaterialDefinitionToLock\(lock\) \{[\s\S]*lock\.mesh\.material\.userData\.hairShader !== definition\.shader[\s\S]*previousMaterial\.dispose\(\)/
  );
  // moved to modules/material/material-ui.js
  assert.match(materialUi,
    /hairShader === STANDARD_ANISOTROPIC_SHADER[\s\S]*roughness = definition\.roughness;[\s\S]*else if \(lock\.mesh\.material\.userData\.hairShader === ANIME_ANISOTROPIC_SHADER\)[\s\S]*uniforms\[uniformName\]/
  );
  assert.match(
    source,
    /hairMaterialShaderInput\.addEventListener\("change"[\s\S]*material\.shader = normalizeHairShader[\s\S]*refreshMaterialUsers\(material\.id\)/
  );
  // The hairMaterials snapshot is a shallow spread of each definition now (no
  // per-stop deep copy of baseColorGradientStops).
  assert.match(source, /hairMaterials:\s*hairMaterialDefinitions\.map\(\(material\) => \(\{ \.\.\.material \}\)/);
  assert.match(shaderModule, /uRimColor[\s\S]*uShadowThreshold[\s\S]*uSoftShadowStrength[\s\S]*uRimStrength[\s\S]*uRimWidth[\s\S]*uAnisotropy[\s\S]*uHighlightJaggedness/);
  assert.match(shaderModule, /uBaseGradient[\s\S]*uUseBaseGradient[\s\S]*texture2D\(uBaseGradient, vec2\(0\.5, clamp\(vUv\.y, 0\.0, 1\.0\)\)\)[\s\S]*multipliedShadowColor = authoredBaseColor \* uShadowColor[\s\S]*mix\(multipliedShadowColor, authoredBaseColor, lightBand\)/);
  assert.match(shaderModule, /float shadowMask = 1\.0 - lightBand[\s\S]*float shadowRim =[\s\S]*shadowMask \*[\s\S]*uRimStrength/);
  assert.match(shaderModule, /rimLightenColor = max\(color, uRimColor\)[\s\S]*mix\(color, rimLightenColor, shadowRim\)[\s\S]*highlightLightenColor = max\(color, uHighlightColor\)[\s\S]*mix\(color, highlightLightenColor, litHighlight\)/);
  assert.doesNotMatch(shaderModule, /uSelectionColor|uSelectionStrength/);
  assert.doesNotMatch(source, /uSelectionColor|uSelectionStrength/);
  assert.match(source, /const STRAND_SELECTION_OUTLINE_COLOR = 0xffd45e;/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /uOutlineWidth: \{ value: options\.width \?\? 0\.007 \}/);
  assert.match(source, /function strandViewportBaseColor\(lock\)[\s\S]*proportionalStrandVisualsActive\(lock\)[\s\S]*0x76d4d9[\s\S]*0x5bbec4[\s\S]*STRAND_SELECTION_OUTLINE_COLOR\), 0\.12[\s\S]*STRAND_SELECTION_OUTLINE_COLOR\), 0\.08[\s\S]*strandMirrorPartnerHighlighted\(lock\)[\s\S]*STRAND_MIRROR_OUTLINE_COLOR\), 0\.12[\s\S]*strandDisplayColor\(lock\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function createStrandSelectionOutline\(geometry, options = \{\}\)[\s\S]*position \+ normal \* uOutlineWidth[\s\S]*side: THREE\.BackSide[\s\S]*depthWrite: false[\s\S]*outline\.raycast = \(\) => \{\}/);
  assert.equal((source.match(/lock\.selectionOutline = materialApi\.createStrandSelectionOutline\(lock\.mesh\.geometry\)/g) || []).length, 2);
  assert.match(source, /function strandMirrorPartnerHighlighted\(lock\)[\s\S]*selectedStrandIds\.has\(lock\.id\)[\s\S]*mirrorPartnerFor\(lock\)[\s\S]*selectedStrandIds\.has\(partner\.id\)/);
  assert.match(source, /function syncStrandSelectionOutline\(lock\)[\s\S]*outline\.visible = Boolean\(selected \|\| mirrorPartnerHighlighted\)[\s\S]*STRAND_MIRROR_OUTLINE_COLOR : STRAND_SELECTION_OUTLINE_COLOR/);
  assert.match(source, /function setStrandSelectionVisual\(lock\)[\s\S]*setAnimeHairBaseColor\(material, strandViewportBaseColor\(lock\)\)[\s\S]*material\.emissive\?\.set\(0x000000\)[\s\S]*syncStrandSelectionOutline\(lock\)/);
  // 几何重建必须把**两条**轮廓都重指向新几何。两条由 createStrandSelectionOutline 用同一份
  // geometry 引用创建，而 rebuildLockGeometry 紧接着 dispose 掉旧几何 —— 漏掉任何一条，它就
  // 攥着已 dispose 的旧几何；`dispose()` 只释放 GPU buffer、JS 侧属性仍在，下次渲染重新上传
  // ⇒ **画出旧形状**（不是消失，所以易被误判为"缓存没刷新"）。0.2.138 由用户在 Scalp Conform
  // 上报告（"我拉宽 width 和 Conform, 橙色高亮选择仍然还是原来的很窄的状态"），但任何几何
  // 重建都中招。两条断言分开写：合成一条正则会让漏掉 hoverOutline 时仍然通过。
  assert.match(source, /function rebuildLockGeometry\(lock, options = \{\}\)[\s\S]*lock\.selectionOutline\.geometry = lock\.mesh\.geometry/);
  assert.match(source, /function rebuildLockGeometry\(lock, options = \{\}\)[\s\S]*lock\.hoverOutline\.geometry = lock\.mesh\.geometry/);
  // 且必须在 dispose 之前完成重指向（顺序判据：两条重指向都出现在 previousGeometry.dispose() 前）
  assert.match(
    source,
    /lock\.selectionOutline\.geometry = lock\.mesh\.geometry;\s*\n\s*if \(lock\.hoverOutline\) lock\.hoverOutline\.geometry = lock\.mesh\.geometry;\s*\n\s*previousGeometry\.dispose\(\)/
  );
  assert.doesNotMatch(source, /material\.color\.getLuminance\(\)[\s\S]*contrastTint/);
  assert.match(source, /function updateStrandSelectionHighlightForLock\(item\) \{[\s\S]*setStrandSelectionVisual\(item\)/);
  assert.match(source, /function updateStrandSelectionHighlight\(\) \{[\s\S]*locks\.forEach\(updateStrandSelectionHighlightForLock\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function applyMaterialDefinitionToLock\(lock\)[\s\S]*updateStrandSelectionHighlightForLock\(lock\)/);
  assert.doesNotMatch(source, /activeAttributeTab === "materials"/);
  assert.match(shaderModule, /dFdx\(vWorldPosition\)[\s\S]*uvTangent[\s\S]*litHighlight/);
  assert.match(localization, /"Anime Anisotropic":\s*"アニメ異方性"/);
  assert.match(localization, /"Lambert":\s*"ランバート"/);
  assert.match(css, /#hairMaterialStandardControls\.hidden,[\s\S]*#hairMaterialAnimeControls\.hidden,[\s\S]*#hairMaterialRoughnessControl\.hidden\s*\{[\s\S]*display:\s*none/);
  assert.match(css, /#hairMaterialAnimeControls \.topology-control\.editable-slider-control\s*\{[\s\S]*grid-template-columns:\s*130px minmax\(0, 1fr\)/);
  assert.match(css, /#hairMaterialAnimeControls \.slider-input-row\s*\{[\s\S]*grid-template-columns:\s*minmax\(56px, 1fr\) minmax\(0, 2fr\) 24px[\s\S]*width:\s*100%/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /hairMaterialRoughnessControl\.classList\.toggle\("hidden", definition\.shader !== STANDARD_ANISOTROPIC_SHADER\)/);
  assert.match(materialState, /Object\.assign\(material, normalizeAnimeAnisotropicSettings\(material\)\)/);
  assert.match(materialState, /MAX_HAIR_GRADIENT_STOPS = 8[\s\S]*function normalizeHairGradientStops[\s\S]*material\.baseColorGradientEnabled = Boolean[\s\S]*material\.baseColorGradientStops = normalizeHairGradientStops/);
  assert.match(materialState, /function hairMaterialPresetValue\(material = \{\}\)[\s\S]*color: normalized\.color[\s\S]*baseColorGradientStops:[\s\S]*\.\.\.animeSettings[\s\S]*function normalizeHairMaterialPresetLibrary/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /HAIR_MATERIAL_PRESET_STORAGE_KEY[\s\S]*function loadCustomHairMaterialPresets\(\)[\s\S]*function saveCustomHairMaterialPresets\(\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function applyHairMaterialPreset\(presetId\)[\s\S]*pushUndoState\(\)[\s\S]*Object\.assign\(definition, applied\)[\s\S]*refreshMaterialUsers\(definition\.id\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function commitHairMaterialPreset\(\)[\s\S]*hairMaterialPresetLibrary\(\)\.push\(preset\)[\s\S]*saveCustomHairMaterialPresets\(\)/);
  assert.doesNotMatch(source, /openHairMaterialPresetShare|serializeHairMaterialPresetShareText|parseHairMaterialPresetShareText/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /materialPresets: deps\.projectState\.state\.customHairMaterialPresets[\s\S]*normalizeHairMaterialPresetLibrary\(backup\.materialPresets\)/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function syncHairGradientTexture\(definition\)[\s\S]*new THREE\.DataTexture[\s\S]*texture\.needsUpdate = true/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /function applyHairBaseGradient\(material, lock\)[\s\S]*uUseBaseGradient[\s\S]*material\.map = texture/);
  // moved to modules/material/material-ui.js
  assert.match(materialUi, /hairMaterialGradientEnabledInput\.addEventListener\("change"[\s\S]*refreshMaterialUsers\(material\.id\)/);
  assert.match(css, /\.material-gradient-track\s*\{[\s\S]*\.material-gradient-stop\.active/);
  assert.match(css, /\.creation-preset-dialog\.material-gradient-dialog\s*\{[^}]*width:\s*min\(440px[^}]*overflow:\s*hidden/);
  assert.match(css, /\.material-gradient-dialog \.dialog-actions\s*\{[^}]*flex-wrap:\s*wrap/);
  assert.match(source, /Object\.entries\(hairMaterialAnimeNumericControls\)[\s\S]*refreshMaterialUsers\(material\.id\)/);
});

test("holding a transform shortcut opens its authoritative tool radial menu", async () => {
  const [html, source, css, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/localization.js", import.meta.url), "utf8")
  ]);

  const [radialMenu, referenceHead] = await Promise.all([
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id=["']toolRadialMenu["'][\s\S]*data-tool-radial-index=["']0["'][\s\S]*data-tool-radial-index=["']3["']/);
  assert.match(css, /\.tool-radial-menu button\.hidden\s*\{[\s\S]*display:\s*none/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /function toolRadialOptions\(tool = deps\.sel\.activeTool\) \{[\s\S]*Strand Select[\s\S]*Guide Select[\s\S]*Reference Select[\s\S]*World Space[\s\S]*Object Space[\s\S]*2D Translation[\s\S]*Pull Strand/
  );
  // The "Lock Root"/"Unlock Root" radial entries were retired: proportional root
  // locking is now set only through the proportional panel checkbox.
  assert.match(source, /proportionalLockRootInput\.addEventListener\("change"[\s\S]*sculptState\.state\.proportionalRootLocked = proportionalLockRootInput\.checked/);
  // The "Lock Root"/"Unlock Root" localization keys were retired together with the
  // radial entries (see above).
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /function beginToolShortcutPress\(key, tool\) \{[\s\S]*setActiveTool\(tool\)[\s\S]*window\.setTimeout[\s\S]*beginToolRadialGesture\(\)[\s\S]*180/
  );
  assert.match(
    source,
    /const tool = shortcutToolForKey\(event\.key\)[\s\S]*if \(\["select", "move", "rotate", "scale"\]\.includes\(tool\)\) \{[\s\S]*radialMenuApi\.beginToolShortcutPress\(event\.key\.toLowerCase\(\), tool\)/
  );
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*finishToolShortcutPress\(event\.key\.toLowerCase\(\)\)/);
  assert.doesNotMatch(source, /event\.key === "Control"[\s\S]*beginToolRadialGesture/);
  assert.match(source, /const selectingStrands = sculptState\.state\.viewportEditMode === "strand"/);
  assert.match(source, /const selectingGuides = sculptState\.state\.viewportEditMode === "guide"/);
  assert.match(source, /const referenceSelectionActive = selectionToolSupportsPicking\(\) && sculptState\.state\.viewportEditMode === "reference"/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function referenceOverlayAtPointer\(event\)[\s\S]*reference\.element\.getBoundingClientRect\(\)/);
  assert.match(source, /const overlayReference = sculptState\.state\.viewportEditMode === "reference" \? referenceHeadApi\.referenceOverlayAtPointer\(event\) : null/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function referencePlaneHitFromPointer\(\{ ignoreOcclusion = false \} = \{\}\)[\s\S]*if \(!planeHit \|\| ignoreOcclusion\) return planeHit/
  );
  assert.match(source, /referencePlaneHitFromPointer\(\{[\s\S]*ignoreOcclusion: sculptState\.state\.viewportEditMode === "reference"/);
});

test("Contextual 2D point movement uses Z as a transient control-normal modifier", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /<kbd>Hold Z<\/kbd>[\s\S]*Point drag[\s\S]*Move along the control point normal/);
  assert.match(source, /sculptState\.state\.viewPlaneNormalMoveHeld/);
  assert.match(source, /function viewPlaneMovePointNormal\(lock, latticeGuide, pointIndex\)[\s\S]*pointUpDirection\(lock, pointIndex\)[\s\S]*latticeGuide\.pointNormals/);
  assert.match(source, /function rebaseViewPlaneMoveDrag\(normalMoveActive = sculptState\.state\.viewPlaneNormalMoveHeld\)[\s\S]*drag\.plane\.setFromNormalAndCoplanarPoint\(drag\.planeNormal, drag\.planeOrigin\)[\s\S]*drag\.startPointerY = drag\.lastPointerY/);
  assert.match(source, /function updateViewPlaneMove\(event\)[\s\S]*normalDistance = \(sculptState\.state\.viewPlaneMoveDrag\.startPointerY - event\.clientY\)[\s\S]*addScaledVector\(sculptState\.state\.viewPlaneMoveDrag\.normal, normalDistance\)/);
  assert.match(source, /const viewPlaneNormalGuide = new THREE\.Line\([\s\S]*viewPlaneNormalGuide\.visible = false/);
  assert.match(source, /function updateViewPlaneNormalGuide\(\) \{[\s\S]*drag\?\.normalMoveActive[\s\S]*addScaledVector\(drag\.normal, -extent\)[\s\S]*addScaledVector\(drag\.normal, extent\)/);
  assert.match(source, /event\.key\.toLowerCase\(\) === "z"[\s\S]*activeTool === "move"[\s\S]*viewPlaneMoveActiveForView\(\)[\s\S]*setViewPlaneNormalMoveHeld\(true\)/);
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*event\.key\.toLowerCase\(\) === "z"[\s\S]*setViewPlaneNormalMoveHeld\(false\)/);
});

test("strand radial menus hide the selection and restore hidden strands", async () => {
  const [source, localization, radialMenu] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8")
  ]);

  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function strandVisibilityRadialOptions\(\{[\s\S]*action: "hide-selected-strands", label: "Hide Selected"[\s\S]*action: "unhide-hidden-strands",\s*label: "Unhide Hidden"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /includeHideSelected = true,[\s\S]*unhideAsList = true[\s\S]*hide-selected-strands", label: "Hide Selected"[\s\S]*\.\.\.\(unhideAsList \? \{ list: true \} : \{\}\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /includeHideSelected: false,[\s\S]*unhideAsList: false/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /action: "decouple-selected-mirrors"[\s\S]*list: true/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /MAX_RADIAL_SUBMENU_OPTIONS = 5[\s\S]*partitionRadialOptions\([\s\S]*MAX_RADIAL_SUBMENU_OPTIONS/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /layoutRadialOptions\(partitioned\.radialOptions, \{[\s\S]*reserveBottomForList: true[\s\S]*\}\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /const innerRingOuterRadius = gesture\.submenu\?\.parentOuterRadius[\s\S]*const listCorridorReserved = !listOption[\s\S]*distance > innerRingOuterRadius[\s\S]*radialListCorridorContains\(dx, dy\)[\s\S]*distance <= 34 \|\| listCorridorReserved/);
  assert.match(source, /function hideSelectedStrands\(\)[\s\S]*pushUndoState\(\)[\s\S]*setLocksOutlinerVisibility\(targets, false\)[\s\S]*deselectStrands\(\)/);
  assert.match(source, /function unhideHiddenStrands\(\)[\s\S]*pushUndoState\(\)[\s\S]*setLocksOutlinerVisibility\(targets, true\)/);
  // The Ctrl+H hide/unhide keyboard shortcut was retired: the "h" key now toggles
  // hierarchy editing, and hide/unhide flows only through the strand radial menu.
  assert.match(source, /event\.key\.toLowerCase\(\) === "h"[\s\S]*setHierarchyEditing\(!sculptState\.state\.hierarchyEditing\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function performStrandRadialAction\(action, lockId\)[\s\S]*action === "hide-selected-strands"[\s\S]*hideSelectedStrands\(\)[\s\S]*action === "unhide-hidden-strands"[\s\S]*unhideHiddenStrands\(\)/);
  assert.match(localization, /"Hide Selected":[\s\S]*"Unhide Hidden":/);
});

test("recognized app shortcuts reclaim focus from dropdowns and range sliders", async () => {
  const [source, registry] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/shortcut-registry.js", import.meta.url), "utf8")
  ]);

  assert.match(registry, /const APPLICATION_SHORTCUT_KEYS = new Set\(\[[\s\S]*"s"[\s\S]*"b"[\s\S]*"o"[\s\S]*"h"[\s\S]*"l"[\s\S]*"f"[\s\S]*"x"/);
  assert.doesNotMatch(registry, /^\s*"z",?\s*$/m);
  assert.match(
    registry,
    /export function focusedControlShouldYieldToShortcut\(focused, event\) \{[\s\S]*const yieldsAppShortcuts = !textEntry && \(tag === "select" \|\| tag === "input"\)[\s\S]*event\?\.ctrlKey \|\| event\?\.metaKey[\s\S]*event\?\.key === "Delete" \|\| event\?\.code === "Space" \|\| APPLICATION_SHORTCUT_KEYS\.has\(key\)/
  );
  assert.match(
    source,
    /let editingField = tag === "input"[\s\S]*focusedControlShouldYieldToShortcut\(document\.activeElement, event\)[\s\S]*document\.activeElement\.blur\(\);[\s\S]*editingField = false/
  );
  // The viewport-focus reclaim machinery (focusViewportForHotkeys /
  // returnPointerControlFocusToViewport / renderer.domElement.tabIndex = -1) was
  // retired: focus now simply stays on the viewport and the keydown handler blurs
  // text-entry controls before dispatching app shortcuts (asserted above).
  assert.match(
    registry,
    /function pointerControlShouldReturnViewportFocus\(control\)[\s\S]*\["checkbox", "radio", "range"\][\s\S]*aria-pressed/
  );
  assert.match(
    source,
    /const requestedShortcutTool = !editingField[\s\S]*shortcutToolForKey\(event\.key\)[\s\S]*cancelStrandRadialGesture\(\)[\s\S]*cancelToolShortcutPress\(\)[\s\S]*cancelToolRadialGesture\(\)/
  );
  assert.match(source, /event\.key\.toLowerCase\(\) === "x"[\s\S]*setMirrorXEditing\(!sculptState\.state\.mirrorXEditing\)/);
  assert.doesNotMatch(source, /navigateCurvePointHierarchy|event\.key\.toLowerCase\(\) === "z"[\s\S]*navigateCurvePoint/);
  assert.match(source, /window\.addEventListener\("keydown", \(event\) => \{[\s\S]*\}, true\);/);
});

test("Delete removes the current removable selection but never the scalp guide", async () => {
  const [html, source, localization, referenceHead] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /<kbd>Delete<\/kbd><span>Delete selected strands, guides, or references<\/span>/);
  assert.match(localization, /"Delete selected strands, guides, or references":/);
  assert.match(source, /function deleteSelectedStrands\(\) \{[\s\S]*pushUndoState\(\)[\s\S]*deleteLocks\(selection\)/);
  assert.match(
    source,
    /function deleteGuide\(guide\) \{[\s\S]*pushUndoState\(\)[\s\S]*removeGuideObjects\(guide\)[\s\S]*disposeGuide\(guide\)[\s\S]*drawFlowApi\.refreshLiveSurfaceOptions\(\)[\s\S]*function deleteSelectedGuide\(\) \{\s*return deleteGuide\(guideApi\.getSelectedGuide\(\)\)/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function deleteSelectedReferenceImage\(\) \{[\s\S]*selectedReferenceImage\(\)[\s\S]*pushUndoState\(\)[\s\S]*disposeReferenceImage\(reference\)[\s\S]*referenceImages\.splice/
  );
  assert.match(
    source,
    /function deleteCurrentSelection\(\) \{[\s\S]*selectedReferenceImage\(\)[\s\S]*selectedLocksInOrder\(\)\.length[\s\S]*getSelectedGuide\(\)[\s\S]*permanent scalp guide[\s\S]*return false/
  );
  assert.match(source, /if \(event\.key === "Delete"\) \{[\s\S]*event\.preventDefault\(\)[\s\S]*if \(event\.repeat\) return;[\s\S]*deleteCurrentSelection\(\)/);
  assert.doesNotMatch(source, /event\.key === "Backspace"[\s\S]*deleteCurrentSelection/);
  assert.match(source, /deleteSelectionAction\.addEventListener\("click", \(\) => \{\s*deleteCurrentSelection\(\)/);
});

test("duplicate commands dispatch to strands, guides, and references", async () => {
  const [html, source, radialMenu, proceduralDuplicate] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/procedural-duplicate.js", import.meta.url), "utf8")
  ]);
  // Guide/reference duplication (duplicateSelectedGuide / duplicateSelectedReferenceImage /
  // duplicateCurrentSelection and the outliner "Duplicate Guide"/"Duplicate Reference"
  // entries) was retired: Ctrl+D and the radial duplicate action now dispatch selected
  // strands to beginDuplicatePlacement only, and guide/reference outliner context menus
  // keep Delete-only actions.
  assert.match(
    source,
    /event\.key\.toLowerCase\(\) === "d"[\s\S]*if \(!event\.repeat\) proceduralDuplicateApi\.beginDuplicatePlacement\(selectedLocksInOrder\(\)\)/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /if \(action === "duplicate"\) \{\s*return Boolean\(deps\.beginDuplicatePlacement\(lock\)\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function beginDuplicatePlacement\(sourceOrSources\)[\s\S]*const undoState = deps\.snapshotState\(\)[\s\S]*lockIds: duplicates\.map/);
  assert.match(source, /deleteOutlinerAction\.textContent = isReference[\s\S]*\? "Delete reference"[\s\S]*: isGuide \? "Delete guide"/);
  assert.match(html, /id="deleteReferenceImage" class="reference-image-delete"[^>]*>Delete Reference</);
  assert.match(html, /Ctrl\+D duplicates the selected strand or strands/);
});

test("Curves menu rebuilds one or many selected strand curves", async () => {
  const [html, source, css, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  assert.match(
    html,
    /id="editMenuToggle"[\s\S]*id="curvesMenuToggle"[\s\S]*id="scalpSetupToggle"/
  );
  assert.match(html, /id="openRebuildCurve"[\s\S]*Rebuild Curve\.\.\./);
  assert.match(
    html,
    /id="rebuildCurveDialog"[\s\S]*id="rebuildCurveSelectionNote"[\s\S]*Multiple strands are selected[\s\S]*id="rebuildCurvePointCount"[^>]*min="2"[\s\S]*id="rebuildCurveEvenSpacing"[^>]*checked[\s\S]*id="confirmRebuildCurve"/
  );
  assert.match(
    source,
    /function selectedRebuildableCurves\(\)[\s\S]*!\["poly", "surface", "curve-surface"\]\.includes\(lock\.geometryType\)/
  );
  assert.match(
    source,
    /function refreshRebuildCurveDialog\(\)[\s\S]*selection\.length === 1 && !multipleSelected[\s\S]*String\(selection\[0\]\.points\.length\)[\s\S]*confirmRebuildCurveButton\.disabled = !selection\.length/
  );
  assert.match(
    source,
    /function openRebuildCurveDialog\(\)[\s\S]*rebuildCurveEvenSpacingInput\.checked = true[\s\S]*rebuildCurveDialog\.show\(\)[\s\S]*refreshRebuildCurveDialog\(\)/
  );
  // The radial "Rebuild Curve" options (open-rebuild-curve actions in the strand /
  // clump / selection radial menus) were retired: rebuilding is now exposed only
  // through the Edit > Curves menu button.
  assert.match(source, /openRebuildCurveButton\.addEventListener\("click", openRebuildCurveDialog\)/);
  assert.match(
    source,
    /function rebuildSelectedCurves\(\)[\s\S]*requestedCount < 2[\s\S]*pushUndoState\(\)[\s\S]*curveRebuildParameters\(pointCount, evenlySpaced, cumulativeLengths\)[\s\S]*resampleStrandCurveData\(lock, parameters\)[\s\S]*finishStrandCurveTopologyChange\(lock\)/
  );
  assert.match(source, /renderLockList\(\);\s*refreshRebuildCurveDialog\(\);\s*return true;/);
  assert.match(css, /\.rebuild-curve-dialog\s*\{[\s\S]*inset:\s*54px 372px auto auto;[\s\S]*z-index:\s*19/);
  assert.match(css, /\.rebuild-curve-selection-note\.hidden\s*\{[\s\S]*display:\s*none[\s\S]*\.rebuild-curve-check/);
  assert.match(localization, /"Rebuild Curve":/);
  assert.match(localization, /"Evenly Space Control Points":/);
});

test("Curves menu creates a standalone three-controller compound strand mesh", async () => {
  const [html, source, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  const [materialUi, strandGeometry, compoundStrand, boneInteraction, boneViewHandles] = await Promise.all([
    readFile(new URL("../modules/material/material-ui.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/strand-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/compound-strand.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/bones/bone-view-handles.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id="curvesMenu"[\s\S]*id="createCompoundStrand"[\s\S]*Create Compound Strand/);
  assert.match(
    source,
    /function createCompoundStrand\(\)[\s\S]*const rows = 7[\s\S]*const centerCurve = Array\.from\(\{ length: rows \}[\s\S]*new THREE\.Vector3\(0, 1\.55 - row \* 0\.5, 1\.45\)[\s\S]*const controllerCurves = \[-1, 0, 1\][\s\S]*pushUndoState\(\)[\s\S]*geometryType: "curve-surface"[\s\S]*curveSurfaceColumns: 3[\s\S]*curveSurfaceCompoundProfile: true/
  );
  const compoundConstructor = source.match(
    /function createCompoundStrand\(\)[\s\S]*?\r?\n\}\r?\n\r?\nfunction createDrawnStrand/
  )?.[0] || "";
  assert.doesNotMatch(compoundConstructor, /createCurvePoints|presets\.front/);
  // moved to modules/geometry/strand-geometry.js (mesh) and modules/geometry/compound-strand.js (bridge plan)
  assert.match(
    strandGeometry,
    /function createCompoundStrandGeometry\(lock\)[\s\S]*compoundSide[\s\S]*controller\.pointSurfaceNormals = controller\.points\.map[\s\S]*controllerFrames[\s\S]*controllerSpanInFrame[\s\S]*compoundProfileBridgePlan[\s\S]*geometry\.userData\.openSurface = true/
  );
  // moved to modules/geometry/compound-strand.js
  assert.match(
    compoundStrand,
    /export function compoundProfileBridgePlan\([\s\S]*export function normalizeCompoundBridgeZippers\([\s\S]*export function compoundBridgeSegmentCounts\([\s\S]*export function compoundControllerWidthScales\(/
  );
  const compoundGeometry = strandGeometry.match(
    /function createCompoundStrandGeometry\(lock\)[\s\S]*?\r?\n\}\r?\n\r?\nfunction proceduralBranchGeometryLock/
  )?.[0] || "";
  assert.doesNotMatch(compoundGeometry, /THREE\.ShapeUtils\.triangulateShape/);
  assert.match(compoundGeometry, /geometry\.userData\.compoundConnectedSegmentCount = connectedSegmentCount/);
  assert.match(compoundGeometry, /const connectedSection = row < connectedSegmentCount[\s\S]*bridgePlan\.removedEdges\[controllerIndex\]\.includes\(profileIndex\)/);
  assert.match(compoundGeometry, /geometry\.userData\.compoundIndependentControllerFrames = true/);
  assert.match(compoundGeometry, /bridgeSmoothing[\s\S]*Math\.max\(authoredBridgeLoops, bridgeSmoothing > 0 \? 1 : 0\)/);
  assert.match(compoundGeometry, /compoundBridgeArchWeight\([\s\S]*position\.addScaledVector\(tangent, -bridgeSpan \* 0\.5 \* archWeight\)/);
  assert.match(compoundGeometry, /bridgeVertexIndices[\s\S]*bridgeSegmentCount/);
  assert.match(compoundGeometry, /orientedQuadFace[\s\S]*geometry\.userData\.compoundBridgeEndCapped = true/);
  assert.doesNotMatch(compoundGeometry, /sharedFrameLock|sharedCurve|sharedFrames|sectionCenters/);
  assert.match(html, /id="compoundBridgeLoopsControl"[\s\S]*Bridge Loops[\s\S]*id="compoundBridgeLoops"[^>]*min="0"[^>]*max="8"/);
  assert.match(html, /id="compoundBridgeSmoothingControl"[\s\S]*Bridge Smoothing[\s\S]*id="compoundBridgeSmoothing"[^>]*min="0"[^>]*max="1"/);
  // createCompoundStrand now authors uniform width/depth curves (uniformWidthCurve /
  // uniformDepthCurve) instead of the previous compoundWidthCurve/compoundDepthCurve
  // taper presets.
  assert.match(source, /taperCurve: uniformWidthCurve[\s\S]*depthCurve: uniformDepthCurve/);
  assert.doesNotMatch(source, /function selectedCompoundStrandSources\(/);
  assert.doesNotMatch(source, /function createCompoundStrandFromSelection\(/);
  assert.match(source, /curveSurfaceCompoundProfile: lock\.geometryType === "curve-surface"[\s\S]*Boolean\(lock\.curveSurfaceCompoundProfile\)/);
  assert.match(source, /curveSurfaceCompoundProfile: snapshot\.geometryType === "curve-surface"[\s\S]*Boolean\(snapshot\.curveSurfaceCompoundProfile\)/);
  assert.match(source, /compoundBridgeLoops: lock\.geometryType === "curve-surface"[\s\S]*lock\.curveSurfaceCompoundProfile/);
  assert.match(source, /compoundBridgeLoops: snapshot\.geometryType === "curve-surface"[\s\S]*snapshot\.curveSurfaceCompoundProfile/);
  assert.match(source, /compoundBridgeSmoothing: lock\.geometryType === "curve-surface"[\s\S]*lock\.curveSurfaceCompoundProfile/);
  assert.match(source, /compoundBridgeSmoothing: snapshot\.geometryType === "curve-surface"[\s\S]*snapshot\.curveSurfaceCompoundProfile/);
  // compoundBridgeZippers serialization and the interactive compound-bridge editing
  // handles (createCompoundBridgeControlContext / compoundBridgeControlPoint /
  // compoundBridgeHandles / beginPanelSplitHandleDrag compound mode) were removed:
  // the compound profile is now a fixed authored mesh with only Loops/Smoothing
  // persisted.
  assert.match(source, /lock\.mesh\.material\.side = lock\.branchRootRegion \|\| materialApi\.strandUsesDoubleSidedMaterial\(lock\)/);
  assert.match(source, /const entityLabel = compound \? "Compound Strand" : "Curve Surface"/);
  assert.match(localization, /"Create Compound Strand":/);
  assert.match(localization, /"Bridge Loops":/);
  assert.match(localization, /"Bridge Smoothing":/);
});

test("Hair Shell creates an expanded scalp-fitted quad shell and Draw Strand extrudes connected faces", async () => {
  const [html, source, topology] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/hair-shell.js", import.meta.url), "utf8")
  ]);
  // The Hair Shell creation command (createHairShell), its Draw Strand face-extrusion
  // flow, and the Curves-menu entry were retired: no HTML button, app.js runtime code,
  // or import of modules/geometry/hair-shell.js remains. Only the prototype topology
  // math stays recoverable in the orphaned module.
  assert.doesNotMatch(html, /id="createHairShell"|Create Hair Shell/);
  assert.doesNotMatch(source, /createHairShell|selectHairShellFaceAtEvent|extrudeHairShellFromStroke|hairShellPrimitive|hairShellLockId/);
  assert.doesNotMatch(source, /from "\.\/modules\/geometry\/hair-shell\.js/);
  assert.match(topology, /export function buildHairShellTopology[\s\S]*faces\.push\(\[previousRing\[side\], previousRing\[next\], ring\[next\], ring\[side\]\]\)/);
});

test("Arc Hair Surface creates a persistent procedural quad canopy with contextual controls", async () => {
  const [html, source, generator] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/arc-hair-surface.js", import.meta.url), "utf8")
  ]);
  // The Arc Hair Surface creation command, its arcHairSurfacePanel contextual controls,
  // and the Curves-menu entry were retired: no HTML panel, app.js runtime code, or
  // import of modules/geometry/arc-hair-surface.js remains. Only the prototype grid
  // math stays recoverable in the orphaned module.
  assert.doesNotMatch(html, /id="createArcHairSurface"|id="arcHairSurfacePanel"|Create Arc Hair Surface/);
  assert.doesNotMatch(source, /createArcHairSurface|rebuildArcHairSurface|hairShellPrimitive|arcHairSurfaceSettings/);
  assert.doesNotMatch(source, /from "\.\/modules\/geometry\/arc-hair-surface\.js/);
  assert.match(generator, /export function createArcHairSurfaceGrid[\s\S]*faces\.push\(\[current, nextRow, nextRow \+ 1, current \+ 1\]\)/);
});

test("viewport edit mode synchronizes selection targets, outliner, and contextual editors", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [scalpBuilder, guideSystem, referenceHead, sculptEditStore] = await Promise.all([
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/guide-system.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/sculpt-edit-store.js", import.meta.url), "utf8"),
  ]);

  assert.match(
    html,
    /id=["']viewportEditModeControl["'][\s\S]*id=["']viewportEditMode["'][\s\S]*value=["']strand["'][^>]*selected[\s\S]*value=["']guide["'][\s\S]*value=["']reference["']/
  );
  assert.match(html, /<span>Workspace<\/span>[\s\S]*id="viewportSelectionModeControl"[\s\S]*data-selection-mode="component"[^>]*aria-pressed="true"[\s\S]*data-selection-mode="object"/);
  assert.match(css, /\.viewport-edit-mode\s*\{[^}]*left:\s*18px;[^}]*top:\s*12px;[^}]*flex-direction:\s*column;[^}]*width:\s*244px;[^}]*background:\s*#0b0a0eba/);
  assert.match(css, /\.viewport-edit-mode label\s*\{[^}]*min-height:\s*34px;[^}]*border:\s*0;[^}]*background:\s*transparent/);
  assert.match(css, /\.viewport-selection-mode\s*\{[^}]*min-height:\s*34px;[^}]*border:\s*0;[^}]*background:\s*transparent/);
  assert.match(css, /\.viewport-selection-mode-buttons button\s*\{[^}]*height:\s*28px;[^}]*min-height:\s*28px;[^}]*font-size:\s*11px/);
  assert.match(css, /\.viewport-tools\s*\{[\s\S]*top:\s*100px/);
  assert.match(css, /\.viewport-edit-mode select,[\s\S]*\.viewport-draw-settings select\s*\{[\s\S]*color-scheme:\s*dark/);
  assert.match(css, /\.viewport-edit-mode select option,[\s\S]*\.viewport-draw-settings select optgroup\s*\{[\s\S]*background-color:\s*#0e0c11;[\s\S]*color:\s*#e8e2e9/);
  assert.match(css, /\.viewport-edit-mode select option:checked,[\s\S]*\.viewport-draw-settings select option:checked\s*\{[\s\S]*background-color:\s*#28232d/);
  // moved to modules/edit/sculpt-edit-store.js
  assert.match(sculptEditStore, /viewportEditMode: "strand"/);
  assert.match(
    source,
    /function setViewportEditMode\(mode, options = \{\}\)[\s\S]*if \(nextMode === "guide"\) \{[\s\S]*if \(switchingMode\) setMirrorXEditing\(true\)[\s\S]*setAttributeEditorTab\("main"\)/
  );
  assert.match(
    source,
    /function setViewportEditMode\(mode, options = \{\}\) \{[\s\S]*const switchingMode = nextMode !== sculptState\.state\.viewportEditMode[\s\S]*if \(switchingMode && options\.exitSetupEditors !== false\) exitSetupEditors\(\)[\s\S]*sculptState\.state\.viewportEditMode = nextMode[\s\S]*viewportEditModeInput\.value = nextMode[\s\S]*setOutlinerTab\(nextMode === "strand" \? "strands" : nextMode === "guide" \? "guides" : "references"\)[\s\S]*referenceHeadApi\.setReferenceImagePanelOpen\(nextMode === "reference"\)[\s\S]*if \(activateSelect && sel\.state\.activeTool !== "select"\) setActiveTool\("select"\)/
  );
  assert.match(source, /viewportEditModeInput\.addEventListener\("change", \(\) => setViewportEditMode\(viewportEditModeInput\.value\)\)/);
  assert.match(source, /event\.key === "Tab" && !event\.shiftKey[\s\S]*setViewportSelectionMode\(effectiveViewportSelectionMode\(\) === "component" \? "object" : "component"\)/);
  assert.match(source, /const shortcutWorkspace = workspaceForShortcutKey\(event\.key\)[\s\S]*if \(!event\.repeat\) setViewportEditMode\(shortcutWorkspace\)/);
  assert.match(html, /<kbd>Tab<\/kbd><span>Toggle Component and Object edit mode<\/span>/);
  assert.match(html, /<kbd>1<\/kbd>[\s\S]*<kbd>2<\/kbd>[\s\S]*<kbd>3<\/kbd>[\s\S]*Strands \/ Guides \/ References workspaces/);
  assert.match(source, /strandOutlinerTab\.addEventListener\("click"[\s\S]*setOutlinerPanelCollapsed\(false\)[\s\S]*setOutlinerTab\("strands"\)/);
  assert.match(source, /guideOutlinerTab\.addEventListener\("click"[\s\S]*setOutlinerPanelCollapsed\(false\)[\s\S]*setOutlinerTab\("guides"\)/);
  assert.match(source, /referenceOutlinerTab\.addEventListener\("click"[\s\S]*setOutlinerPanelCollapsed\(false\)[\s\S]*setOutlinerTab\("references"\)/);
  assert.match(html, /id=["']toggleOutlinerPanel["'][^>]*aria-expanded=["']true["'][\s\S]*id=["']toggleAttributeEditorPanel["'][^>]*aria-expanded=["']true["']/);
  assert.match(css, /@media \(min-width: 861px\)[\s\S]*body\.compact-sidebar-docked \.studio-shell[\s\S]*grid-template-columns: minmax\(0, 1fr\) 360px[\s\S]*body\.compact-sidebar-docked \.viewport-panel[\s\S]*grid-row: 2 \/ 4[\s\S]*body\.compact-sidebar-docked \.tool-panel[\s\S]*grid-row: 2[\s\S]*body\.compact-sidebar-docked \.outliner-panel[\s\S]*grid-row: 3/);
  // The floating-side-panels layout system was retired: side panel styling is now
  // body.glass-side-panels (translucent glass over the workspace) and body.no-panels
  // (hide the side panels so the viewport spans the full width).
  assert.match(css, /body\.glass-side-panels \.outliner-panel,[\s\S]*body\.glass-side-panels \.tool-panel \{\s*border-color: #ffffff18;[\s\S]*background: color-mix\(in srgb, var\(--glass-panel-color, #19181d\) 73%, transparent\);[\s\S]*backdrop-filter: blur\(14px\) saturate\(72%\)/);
  assert.match(css, /body\.no-panels \.studio-shell \{\s*grid-template-columns: minmax\(0, 1fr\);\s*\}[\s\S]*body\.no-panels \.outliner-panel,[\s\S]*body\.no-panels \.tool-panel \{\s*display: none/);
  // The attribute-editor-content wrapper was removed: the tool panel now scrolls
  // itself (overflow: auto) with the sticky attribute-editor-tabs bar on top.
  assert.match(html, /class="tool-panel"[\s\S]*class="attribute-editor-tabs"[\s\S]*id="turntablePanel"/);
  assert.match(css, /\.tool-panel\s*\{[\s\S]*overflow: auto;[\s\S]*padding: 14px;[\s\S]*\.attribute-editor-tabs\s*\{[\s\S]*position: sticky;[\s\S]*top: -14px;[\s\S]*order: -2000/);
  assert.match(css, /:root\s*\{[\s\S]*--glass-panel-color: #19181d;[\s\S]*\.outliner-panel\s*\{[\s\S]*background: #19181d;[\s\S]*\.tool-panel\s*\{[\s\S]*background: #1c1a20;/);
  assert.doesNotMatch(source, /function syncResponsiveSidebarDock\(\)[\s\S]*if \(sidePanelStyle !== "default"\)/);
  // The floating-side-panels compact-dock variants were retired with the floating
  // layout system; compact docking now applies to the default/glass/no-panel modes.
  assert.match(css, /body\.compact-sidebar-docked \.outliner-panel \{\s*grid-column: 2;[\s\S]*grid-row: 3;[\s\S]*border-top: 1px solid #312c33;[\s\S]*border-right: 0/);
  assert.match(css, /body\.compact-attribute-collapsed \.studio-shell[\s\S]*grid-template-rows: 36px auto minmax\(0, 1fr\)[\s\S]*body\.compact-attribute-collapsed \.tool-panel > :not\(\.attribute-editor-tabs\)[\s\S]*display: none !important/);
  assert.match(css, /body\.compact-outliner-collapsed \.studio-shell[\s\S]*grid-template-rows: 36px minmax\(0, 1fr\) auto[\s\S]*body\.compact-outliner-collapsed \.outliner-panel \.outliner-content[\s\S]*display: none !important/);
  assert.match(source, /function syncResponsiveSidebarDock\(\)[\s\S]*floatingPanels = document\.body\.classList\.contains\("floating-side-panels"\)[\s\S]*effectiveViewportLeft = viewportBounds\.left \+ \(floatingPanels \? outlinerPanel\.getBoundingClientRect\(\)\.width : 0\)[\s\S]*effectiveViewportRight = viewportBounds\.right - \(floatingPanels \? toolPanel\.getBoundingClientRect\(\)\.width : 0\)[\s\S]*workspaceLeftMargin = workspaceBounds\.left - effectiveViewportLeft[\s\S]*layerRightMargin = effectiveViewportRight - layerBounds\.right[\s\S]*layerRightMargin > workspaceLeftMargin[\s\S]*classList\.add\("compact-sidebar-docked"\)/);
  assert.match(source, /miscState\.state\.compactSidebarDockActivationWidth[\s\S]*viewportWidth > miscState\.state\.compactSidebarDockActivationWidth[\s\S]*classList\.remove\("compact-sidebar-docked"\)/);
  assert.match(source, /function setOutlinerPanelCollapsed\(collapsed\)[\s\S]*compactAttributeEditorCollapsed = false[\s\S]*function setAttributeEditorPanelCollapsed\(collapsed\)[\s\S]*compactOutlinerCollapsed = false/);
  assert.match(source, /function syncViewportDrawSettings\(\) \{[\s\S]*const drawSettingsVisible =[\s\S]*!sculptState\.state\.capsuleGuideEditing;[\s\S]*viewportEditModeControl\.classList\.remove\("hidden"\)[\s\S]*aria-hidden", "false"/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /function setScalpBuilderEditing\(enabled\) \{[\s\S]*if \(enabled && deps\.sculptState\.viewportEditMode !== "guide"\) deps\.setViewportEditMode\("guide"\)/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /function setScalpBuilderEditing\(enabled\) \{[\s\S]*if \(enabled\) \{[\s\S]*setScalpGuideVisibility\(true\)[\s\S]*createScalpBuilderCurveLattice\(\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function setHeadSetupEditing\(enabled\) \{[\s\S]*deps\.sculptState\.headSetupEditing = Boolean\(enabled\)[\s\S]*if \(deps\.sculptState\.headSetupEditing\) \{\s*deps\.scalpBuilder\.setScalpGuideVisibility\(true\);\s*deps\.scalpBuilder\.createScalpBuilderCurveLattice\(\)/);
  // moved to modules/scalp/scalp-builder.js
  assert.match(scalpBuilder, /function updateScalpEditingVisibility\(\) \{[\s\S]*deps\.scalpSurfaceGroup\.visible = deps\.scalpState\.scalpGuideVisible;/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function setCapsuleGuideEditing\(enabled\) \{[\s\S]*if \(enabled && deps\.sculptState\.viewportEditMode !== "guide"\) deps\.setViewportEditMode\("guide"\)/);
  assert.match(source, /function selectLock\(id, options = \{\}\) \{[\s\S]*setViewportEditMode\("strand", \{ clearSelection: false, activateSelect: false \}\)/);
  // moved to modules/geometry/guide-system.js
  assert.match(guideSystem, /function selectGuide\(id\) \{[\s\S]*setViewportEditMode\("guide", \{ clearSelection: false, activateSelect: false \}\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function selectReferenceImage\(id\) \{[\s\S]*setViewportEditMode\("reference", \{ clearSelection: false, activateSelect: false \}\)/);
  assert.match(source, /const selectedGuide = guideApi\.getSelectedGuide\(\);[\s\S]*const editingGuide = sculptState\.state\.viewportEditMode === "guide" && Boolean\(selectedGuide\)/);
  assert.match(source, /guidePanel\.classList\.toggle\("hidden", !editingLegacyGuide\)/);
  assert.match(source, /const canCreateCapsuleGuide = sculptState\.state\.viewportEditMode === "guide"[\s\S]*!selectedGuide[\s\S]*!scalpState\.state\.scalpBuilderEditing/);
  assert.match(source, /surfaceGuideToolPanel\.classList\.toggle\([\s\S]*sel\.state\.activeTool !== "draw-capsule-guide" && !sculptState\.state\.capsuleGuideEditing && !editingCapsuleGuide && !canCreateCapsuleGuide/);
  assert.match(source, /sculptState\.state\.viewportEditMode === "strand"[\s\S]*raycaster\.intersectObjects\([\s\S]*locks\.filter\(strandAvailableForViewportInteraction\)\.map\(\(lock\) => lock\.mesh\)/);
  assert.match(source, /viewportEditMode === "guide"[\s\S]*guides\.flatMap/);
});

test("object and component edit modes share selection while object transforms pivot at strand roots", async () => {
  const [html, source, css, localization, selectionStore] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/selection-store.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="viewportSelectionModeControl"[\s\S]*data-selection-mode="component"[^>]*aria-pressed="true"[\s\S]*data-selection-mode="object"/);
  assert.match(html, /id="strandObjectTransformPanel"[\s\S]*>Translation<[\s\S]*aria-label="Translation X"[\s\S]*data-reset-object-transform="location" data-axis="x"[\s\S]*>Rotation<[\s\S]*data-object-transform="rotation" data-axis="y"[\s\S]*data-reset-object-transform="rotation" data-axis="y"[\s\S]*>Scale<[\s\S]*data-object-transform="scale" data-axis="z"[\s\S]*data-reset-object-transform="scale" data-axis="z"/);
  assert.match(css, /\.strand-object-transform-panel\s*\{[\s\S]*var\(--glass-panel-color[\s\S]*backdrop-filter: blur\(14px\)/);
  assert.match(css, /\.viewport-edit-mode\s*\{[\s\S]*background:\s*#0b0a0eba[\s\S]*\.viewport-selection-mode\s*\{[\s\S]*background:\s*transparent[\s\S]*\.viewport-selection-mode-buttons button\.active\s*\{[\s\S]*color:\s*#58f6ff/);
  // The outliner tabs switched from glass/transparent styling to the solid dark
  // theme (see .outliner-tabs / .outliner-tab.active below).
  assert.match(css, /\.outliner-tabs\s*\{[\s\S]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)[\s\S]*border-bottom:\s*1px solid #332e35[\s\S]*\.outliner-tab\.active\s*\{[\s\S]*border-color:\s*#4d454f[\s\S]*border-bottom-color:\s*#19181d[\s\S]*background:\s*#19181d[\s\S]*color:\s*#fff8ef/);
  // The attribute-editor tabs switched from glass/transparent styling to the solid
  // dark theme (same treatment as .outliner-tabs).
  assert.match(css, /\.attribute-editor-tabs\s*\{[\s\S]*border-bottom:\s*1px solid #332e35[\s\S]*background:\s*#17151a[\s\S]*\.attribute-editor-tabs button\.active\s*\{[\s\S]*border-color:\s*#4d454f[\s\S]*border-bottom-color:\s*#1c1a20[\s\S]*background:\s*#1c1a20[\s\S]*color:\s*#fff8ef/);
  assert.match(css, /:root:lang\(ja\)\s*\{[^}]*font-family:\s*"Yu Gothic UI", "Meiryo UI", "Noto Sans JP"[^}]*font-feature-settings:\s*"palt" 1;[^}]*letter-spacing:\s*-0\.015em/);
  assert.match(css, /:root:lang\(ja\) \.viewport-selection-mode-buttons button\s*\{[^}]*padding-inline:\s*4px;[^}]*font-size:\s*12px/);
  assert.match(localization, /"Workspace":/);
  assert.match(localization, /"Component":/);
  assert.match(localization, /"Toggle Component and Object edit mode":/);
  assert.match(localization, /"Strands \/ Guides \/ References workspaces":/);
  // moved to modules/edit/selection-store.js
  assert.match(selectionStore, /viewportSelectionMode: "component"/);
  assert.match(source, /function effectiveViewportSelectionMode\(\)[\s\S]*sculptState\.state\.viewportEditMode === "reference" \? "object" : sel\.state\.viewportSelectionMode/);
  assert.match(source, /function setViewportSelectionMode\(mode\)[\s\S]*refreshSelectionModeVisuals\(\)/);
  assert.match(source, /lock\.curveObjects\.group\.visible = \(brushCurveVisibilityAllowed \|\| tipUiActive \|\| brushBonesOnly\)[\s\S]*options\.visible && componentEditModeActive\(\)/);
  assert.match(
    source,
    /function selectionToolSupportsPicking[\s\S]*\["select", "move", "rotate", "scale"\][\s\S]*tool === "relax" && sculptState\.state\.viewportEditMode === "strand"/
  );
  assert.match(source, /if \(selectionToolSupportsPicking\(\)\)[\s\S]*beginSelectionMarquee\(event, selectedSurface, addingSelection \? "add" : "remove"\)[\s\S]*beginSelectionMarquee/);
  assert.match(source, /function objectSelectionScreenBounds\(object, viewportRect\)[\s\S]*bounds3d[\s\S]*samples[\s\S]*position\.project\(camera\)[\s\S]*return visibleSamples \? screenBounds : null/);
  assert.match(source, /function objectInsideSelectionMarquee\(object, bounds, viewportRect\)[\s\S]*screenBoundsOverlap\(bounds, objectSelectionScreenBounds\(object, viewportRect\)\)[\s\S]*traverseVisible[\s\S]*triangleIntersectsScreenBounds\(triangle, bounds\)/);
  assert.match(source, /function strandObjectRoot\(lock\)[\s\S]*function attachStrandObjectTransform\(\)[\s\S]*strandObjectTransformHandle\.position\.copy\(root\)/);
  assert.match(source, /function beginStrandObjectTransform\(handle\)[\s\S]*selectedLocksInOrder\(\)[\s\S]*strandObjectTransformSnapshot[\s\S]*previewMeshes/);
  assert.match(source, /function strandObjectTransformOperators\(edit, handle\)[\s\S]*worldMatrixForPivot/);
  assert.match(source, /function strandObjectTransformSnapshot\(lock[\s\S]*curveSurfaceSide: lock\.curveSurfaceSide\?\.clone\(\) \|\| null/);
  assert.match(source, /function strandObjectTransformOperators\(edit, handle\)[\s\S]*const transformDirection = \(direction\)[\s\S]*multiply\(scale\)[\s\S]*transformDirection,[\s\S]*worldMatrixForPivot/);
  const objectPreviewSource = source.slice(
    source.indexOf("function updateStrandObjectTransform(handle)"),
    source.indexOf("function commitStrandObjectTransform(edit, handle)")
  );
  assert.match(objectPreviewSource, /worldMatrixForPivot[\s\S]*applyStrandObjectPreviewMatrix[\s\S]*mirroredDelta/);
  assert.doesNotMatch(objectPreviewSource, /syncLockFromCurve|updateLockGeometry|syncActiveMirror/);
  assert.match(source, /function commitStrandObjectTransform\(edit, handle\)[\s\S]*lock\.pointSurfaceNormals = target\.pointSurfaceNormals\?\.map\(transformNormal\)[\s\S]*lock\.curveSurfaceSide = transformDirection\(target\.curveSurfaceSide\)[\s\S]*syncLockFromCurve\(lock\)[\s\S]*updateLockGeometry\(lock, \{ immediate: true \}\)[\s\S]*syncActiveMirror/);
  assert.match(source, /function finishStrandObjectTransform\(\)[\s\S]*restoreStrandObjectPreviewMeshes\(edit\)[\s\S]*commitStrandObjectTransform\(edit, strandObjectTransformHandle\)/);
  assert.match(source, /EMPTY_STRAND_OBJECT_TRANSFORM[\s\S]*location:[\s\S]*rotation:[\s\S]*scale:/);
  assert.match(source, /function objectTransformPanelLock\(\)[\s\S]*viewportEditMode !== "strand"[\s\S]*componentEditModeActive\(\)[\s\S]*selected\.length !== 1/);
  assert.match(source, /function applyStrandObjectTransformPanelValues\(\)[\s\S]*pushUndoState\(\)[\s\S]*beginStrandObjectTransform\(strandObjectTransformHandle\)[\s\S]*finishStrandObjectTransform\(\)/);
  assert.match(source, /strandObjectTransformResetButtons\.forEach[\s\S]*dataset\.resetObjectTransform[\s\S]*dataset\.axis[\s\S]*strandObjectTransformInputs\.find[\s\S]*input\.value = "0"[\s\S]*applyStrandObjectTransformPanelValues\(\)/);
  assert.match(source, /function commitStrandObjectTransform\(edit, handle\)[\s\S]*lock\.objectTransform = edit\.authoredTransformOverrides[\s\S]*strandObjectTransformValuesAfterHandle/);
  assert.match(source, /objectTransform: normalizeStrandObjectTransform\(lock\.objectTransform\)/);
  assert.match(source, /objectTransform: normalizeStrandObjectTransform\(snapshot\.objectTransform\)/);
  assert.match(source, /function syncMirrorPartnerFromLock[\s\S]*partner\.objectTransform = mirroredStrandObjectTransform\(lock\.objectTransform\)/);
  assert.match(source, /transformControls\.object\?\.userData\.strandObjectTransform[\s\S]*pushUndoState\(\)[\s\S]*beginStrandObjectTransform/);
  assert.match(source, /guideObjectTransformHandle\.userData\.guideObjectTransform = true/);
  assert.match(source, /function attachGuideObjectTransform\(\)[\s\S]*viewportEditMode === "guide"[\s\S]*componentEditModeActive\(\)[\s\S]*transformControls\.attach\(guideObjectTransformHandle\)/);
  assert.match(source, /function guideObjectTransformSnapshot\(guide, handle\)[\s\S]*deformRestPoints[\s\S]*controlWorldPoints[\s\S]*meshWorldMatrix/);
  assert.match(source, /function updateGuideObjectTransform\(handle\)[\s\S]*updateCurveLatticeGeometry\(guide\)[\s\S]*updateCapsuleGuideGeometry\(guide, \{ preserveControlPoints: true \}\)[\s\S]*updateLegacyGuideObjectTransform/);
  assert.match(source, /transformControls\.object\?\.userData\.guideObjectTransform[\s\S]*pushUndoState\(\)[\s\S]*beginGuideObjectTransform/);
  assert.match(source, /function refreshSelectionModeVisuals\(\)[\s\S]*viewportEditMode === "guide"[\s\S]*attachGuideObjectTransform\(\)/);
});

test("selected strands can be isolated from Ctrl+1 or the contextual radial menu", async () => {
  const [html, source, localization, radialMenu] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /<kbd>Ctrl<\/kbd>[\s\S]*?<kbd>1<\/kbd>[\s\S]*?Isolate selected strands/);
  assert.match(source, /sel\.state\.isolatedStrandIds/);
  assert.match(source, /function strandVisibleForDisplay\(lock\)[\s\S]*!sel\.state\.isolatedStrandIds \|\| sel\.state\.isolatedStrandIds\.has\(lock\.id\)/);
  assert.match(source, /function toggleSelectedStrandIsolation\(\)[\s\S]*selectedLocksInOrder\(\)[\s\S]*setStrandIsolation\(selectedIds\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /action: "toggle-isolate-selection"[\s\S]*strandIsolationActive\(\) \? "Exit Isolate" : "Isolate Selected"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /if \(action === "toggle-isolate-selection"\) return deps\.toggleSelectedStrandIsolation\(\)/);
  assert.match(source, /event\.ctrlKey[\s\S]*event\.key === "1"[\s\S]*toggleSelectedStrandIsolation\(\)/);
  // Isolation is transient state: it is cleared on every state restore and never
  // snapshotted, so no preserveIsolation restore path exists anymore.
  assert.match(source, /function resetTransientInteractionsForStateRestore\(\) \{[\s\S]*sel\.state\.isolatedStrandIds = null/);
  assert.match(localization, /"Isolate selected strands":[\s\S]*"Isolate Selected":[\s\S]*"Exit Isolate":/);
});

test("Shift adds, Ctrl removes, and shifted topology gestures take priority over selection", async () => {
  const [html, source, localization, selectionState, projectState, selectionStore] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/selection-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/selection-store.js", import.meta.url), "utf8")
  ]);

  const [boneInteraction, polyTools] = await Promise.all([
    readFile(new URL("../modules/bones/bone-interaction.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/poly-tools.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<h3>Selection<\/h3>[\s\S]*?<kbd>Shift<\/kbd>[\s\S]*?Left click \/ drag[\s\S]*?Add control points or strands to the selection/);
  assert.match(html, /<h3>Selection<\/h3>[\s\S]*?<kbd>Ctrl<\/kbd>[\s\S]*?Left click \/ drag[\s\S]*?Remove selected strands or control points/);
  assert.match(html, /<h3>Curves<\/h3>[\s\S]*?<kbd>Shift<\/kbd>[\s\S]*?<kbd>Alt<\/kbd>[\s\S]*?Left click[\s\S]*?Add a strand control point while preserving the curve/);
  assert.match(html, /<h3>Curves<\/h3>[\s\S]*?<kbd>Shift<\/kbd>[\s\S]*?<kbd>Ctrl<\/kbd>[\s\S]*?Left click[\s\S]*?Remove a strand control point while preserving the curve/);
  assert.match(localization, /"Add a control point or strand to the selection":/);
  assert.match(localization, /"Remove a selected strand or control point":/);
  assert.match(localization, /"Remove a strand control point while preserving the curve":/);
  // moved to modules/edit/selection-store.js
  assert.match(selectionStore, /selectedStrandIds: new Set\(\)/);
  // moved to modules/io/project-state.js
  assert.match(projectState, /createProjectSelectionSnapshot\(\{[\s\S]*selectedStrandIds/);
  assert.match(projectState, /selectedStrandIds: \[\.\.\.selectedStrandIds\]/);
  assert.match(source, /applyStrandSelectionState\(restoreStrandSelection\(restorePlan\.strandSelection\)\)/);
  assert.match(source, /const addingSelection = event\.shiftKey[\s\S]*const removingSelection = event\.ctrlKey[\s\S]*event\.button === 0 && \(addingSelection \|\| removingSelection\)[\s\S]*beginSelectionMarquee\(event, selectedSurface, addingSelection \? "add" : "remove"\)/);
  assert.match(selectionState, /selectionMode === "add" \|\| selectionMode === "remove"[\s\S]*?const primaryId = nextIds\.has\(activeId\)[\s\S]*?selectionMode === "remove"[\s\S]*?nextIds\.delete\(id\)[\s\S]*?nextIds\.add\(id\)[\s\S]*?primaryId && nextIds\.has\(primaryId\)[\s\S]*?nextSelectedIds\[0\]/);
  assert.match(source, /selectLock\(lock\.id, \{[\s\S]*?selectionMode: event\.shiftKey && !event\.ctrlKey && !event\.altKey[\s\S]*?\? "add"[\s\S]*?event\.ctrlKey && !event\.shiftKey && !event\.altKey[\s\S]*?\? "remove"/);
  assert.match(source, /selectedStrandIds\.has\(item\.id\)/);
  assert.match(
    source,
    /function activateStrandControlPoint\(handle, event\)[\s\S]*event\.shiftKey[\s\S]*addStrandControlPointSelection\(handle\)[\s\S]*event\.ctrlKey[\s\S]*removeStrandControlPointSelection/
  );
  assert.match(
    source,
    /function addStrandControlPointSelection\(handle\)[\s\S]*selectedControlPoints\.findIndex[\s\S]*selectionIndex >= 0\) return true[\s\S]*selectedControlPoints\.push/
  );
  assert.match(
    source,
    /function removeStrandControlPointSelection\(lockId, pointIndex\)[\s\S]*selectedControlPoints\.findIndex[\s\S]*selectedControlPoints\.splice[\s\S]*refreshStrandControlPointSelection/
  );
  // moved to modules/bones/bone-interaction.js
  assert.match(boneInteraction,
    /function prepareCurvePointSelection\(event\)[\s\S]*const removingCurvePoint = event\.shiftKey && event\.ctrlKey && !event\.altKey && !event\.metaKey[\s\S]*const insertingCurvePoint = event\.shiftKey && event\.altKey && !event\.ctrlKey && !event\.metaKey[\s\S]*pointRemovalCandidate = \{[\s\S]*if \(removingCurvePoint\) \{/
  );
  // moved to modules/bones/bone-interaction.js
  assert.match(boneInteraction, /if \(removingCurvePoint\) \{[\s\S]*pointRemovalCandidate = \{[\s\S]*pointIndex:/);
  assert.match(
    source,
    /function resampleStrandCurveData\(lock, parameters\)[\s\S]*sampleStrandPointVectors[\s\S]*function finishStrandCurveTopologyChange\(lock\)[\s\S]*rebuildCurveObjects\(lock\)[\s\S]*syncActiveMirror[\s\S]*function removeStrandCurvePoint\(lockId, pointIndex\)[\s\S]*curvePointRemovalPlan\(lock\.points\.length, pointIndex\)[\s\S]*pushUndoState\(\)[\s\S]*resampleStrandCurveData/
  );
  assert.match(source, /candidate\.selectionOnly[\s\S]*removeStrandControlPointSelection[\s\S]*removeStrandCurvePoint\(candidate\.lockId, candidate\.pointIndex\)/);
  assert.match(source, /Math\.hypot\(event\.clientX - candidate\.startX, event\.clientY - candidate\.startY\) >= 4/);
  assert.match(source, /window\.addEventListener\("pointerup", finishCurvePointInsertion, true\)[\s\S]*window\.addEventListener\("pointerup", finishPointRemoval, true\)[\s\S]*window\.addEventListener\("pointerup", endAltOrbit\)/);
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerdown", bonesApi\.prepareCurvePointSelection, true\)[\s\S]*renderer\.domElement\.addEventListener\("pointerdown", beginAltOrbit, true\)/);
  // moved to modules/geometry/poly-tools.js
  assert.match(polyTools, /removingSelectedVertex[\s\S]*polyAltDeleteCandidate = !removingSelectedVertex && target/);
  assert.doesNotMatch(source, /Select strands or control points: left-click replaces the selection/);
});

test("multi-selected strands can become a clump or be deleted from selection actions", async () => {
  const [html, source, css, localization, clumpProcedural, radialMenu] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/clump-procedural.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="clumpContextMenu"[\s\S]*?id="createClumpFromSelectionAction"[\s\S]*?Create Clump from Selection/);
  assert.match(css, /\.strand-radial-menu button\.hidden\s*\{[\s\S]*?display:\s*none/);
  assert.match(css, /\.strand-radial-menu\[data-radial-kind="selection"\] button\s*\{[\s\S]*?width:\s*138px[\s\S]*?min-height:\s*42px/);
  assert.match(localization, /"Create Clump from Selection":/);
  // The bare "Create clump" localization key was retired: the selection radial menu
  // option uses the full "Create Clump from Selection" label.
  assert.match(localization, /"Delete Strands":/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural,
    /function selectionCanBecomeClump\([\s\S]*?selection\.length >= 2[\s\S]*?lock\.geometryType === "strand" && !lock\.clumpId/
  );
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural,
    /function createClumpFromSelection\(\) \{[\s\S]*?pushUndoState\(\)[\s\S]*?createClumpFromLocks\(selection\)[\s\S]*?clumpOpen\.set\(guide\.clumpId, false\)[\s\S]*?selectLock\(guide\.id\)/
  );
  assert.match(
    source,
    /createClumpFromSelectionAction\.classList\.toggle\("hidden", !canCreateSelectionClump\)[\s\S]*?createClumpFromSelectionAction\.addEventListener\("click"[\s\S]*?createClumpFromSelection\(\)/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /if \(kind === "selection"\) \{[\s\S]*?action: "create-clump"[\s\S]*?label: "Create Clump from Selection"[\s\S]*?action: "delete-selection", label: "Delete Strands"/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /strandRadialMenu\.dataset\.radialKind = kind/);
  assert.match(source, /function deleteSelectedStrands\(\) \{[\s\S]*?pushUndoState\(\)[\s\S]*?deleteLocks\(selection\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /if \(action === "create-clump"\) return Boolean\(deps\.createClumpFromSelection\(\)\)/);
  assert.match(radialMenu, /if \(action === "delete-selection"\) return deps\.deleteSelectedStrands\(\)/);
});

test("selection sets are created from contextual menus and recalled from the strand outliner", async () => {
  const [html, source, css, localization, projectState, radialMenu] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="createSelectionSetFromSelectedAction"[^>]*>Create Set from Selected</);
  assert.match(html, /id="addSelectedToSelectionSetAction"[^>]*>Add Selected to Set</);
  assert.match(html, /id="removeSelectedFromSelectionSetAction"[^>]*>Remove Selected from Set</);
  assert.match(source, /function createSelectionSetFromSelection\(\)[\s\S]*createSelectionSetRecord[\s\S]*pushUndoState\(\)[\s\S]*selectionSets\.push/);
  assert.match(source, /function editSelectionSetFromSelection\(selectionSetId, mode\)[\s\S]*updateSelectionSetMembers[\s\S]*pushUndoState\(\)[\s\S]*Object\.assign\(selectionSet, nextSelectionSet\)[\s\S]*selectionSets\.splice/);
  assert.match(source, /canCreateSelectionSet[\s\S]*createSelectionSetFromSelectedAction\.classList\.toggle\("hidden", !canCreateSelectionSet\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /action: "create-selection-set"[\s\S]*label: "Create Selection Set"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function selectionSetRadialMenuOption\(\)[\s\S]*label: "Selection Sets"[\s\S]*selection-set-actions-submenu/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /kind === "selection-set-actions-submenu"[\s\S]*Create Selection Set[\s\S]*selectionSetMembershipRadialOptions\(\)/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /function selectionSetMembershipRadialOptions\(\)[\s\S]*open-add-selection-set-submenu[\s\S]*Add to Selection Set[\s\S]*open-remove-selection-set-submenu[\s\S]*Remove from Selection Set/);
  // The add/remove membership submenus now exist as radial kinds in
  // modules/geometry/radial-menu.js (they were previously inlined in app.js).
  assert.match(radialMenu, /kind === "selection-set-add-submenu" \|\| kind === "selection-set-remove-submenu"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /if \(action === "create-selection-set"\) return Boolean\(deps\.createSelectionSetFromSelection\(\)\)/);
  assert.match(html, /id="selectionSetMembershipDialog"[\s\S]*id="selectionSetMembershipList"[\s\S]*id="cancelSelectionSetMembership"[\s\S]*id="confirmSelectionSetMembership"/);
  assert.match(source, /function openSelectionSetMembershipDialog\(mode\)[\s\S]*selectionSetCanEditFromSelection[\s\S]*selection-set-membership-option[\s\S]*selectionSetMembershipDialog\.showModal\(\)/);
  // The radial open-add/remove-selection-set-dialog actions were replaced by the
  // outliner context-menu buttons, which open the membership dialog directly.
  assert.match(source, /addSelectedToSelectionSetAction\.addEventListener\("click"[\s\S]*openSelectionSetMembershipDialog\("add"\)[\s\S]*removeSelectedFromSelectionSetAction\.addEventListener\("click"[\s\S]*openSelectionSetMembershipDialog\("remove"\)/);
  assert.match(source, /selectionSetMembershipForm\.addEventListener\("submit"[\s\S]*FormData\(selectionSetMembershipForm\)[\s\S]*editSelectionSetFromSelection[\s\S]*closeSelectionSetMembershipDialog/);
  assert.match(source, /function createSelectionSetsOutlinerFolder\(\)[\s\S]*Selection Sets[\s\S]*handleOutlinerRenameClick[\s\S]*selectSelectionSet[\s\S]*type: "selection-set"/);
  // Per-set visibility toggles (selection-set-item-shell + visibleMemberCount) were
  // retired: each selection-set item now carries an inline rename label and the
  // selection-set context menu.
  assert.match(source, /function createSelectionSetsOutlinerFolder\(\)[\s\S]*selectionSetMatchesCurrentSelection\(selectionSet\) \? " active" : ""[\s\S]*handleOutlinerRenameClick\(event, \{[\s\S]*onSelect: \(\) => selectSelectionSet\(selectionSet\)/);
  assert.match(source, /addSelectedToSelectionSetAction\.addEventListener\("click"[\s\S]*editSelectionSetFromSelection\(selectionSetId, "add"\)[\s\S]*removeSelectedFromSelectionSetAction\.addEventListener\("click"[\s\S]*editSelectionSetFromSelection\(selectionSetId, "remove"\)/);
  assert.match(source, /function outlinerLockTargets\(target = sel\.state\.outlinerContextTarget\)[\s\S]*target\?\.type === "selection-set"[\s\S]*selectionSet\.strandIds[\s\S]*memberIds\.has\(lock\.id\)/);
  assert.match(source, /lockOutlinerAction\.classList\.toggle\("hidden", !strand && !isSelectionSet[\s\S]*lockActionVerb[\s\S]*Strands/);
  assert.match(source, /function deleteSelectionSet\(selectionSetId\)[\s\S]*pushUndoState\(\)[\s\S]*selectionSets\.splice[\s\S]*renderLockList\(\)/);
  assert.match(source, /deleteOutlinerAction\.textContent[\s\S]*"Delete Selection Set"[\s\S]*deleteOutlinerAction\.addEventListener\("click"[\s\S]*target\?\.type === "selection-set"[\s\S]*deleteSelectionSet\(target\.selectionSetId\)/);
  assert.match(source, /selectionSets: selectionSets\.map[\s\S]*function resetEditableSceneForStateRestore[\s\S]*selectionSets\.length = 0/);
  assert.match(source, /restorePlan\.scene\.locks\.forEach[\s\S]*selectionSets\.push\(\.\.\.normalizeSelectionSets/);
  assert.match(projectState, /scene:[\s\S]*selectionSets: state\.selectionSets \|\| \[\]/);
  assert.match(css, /\.selection-set-item\.active[\s\S]*box-shadow: inset 2px 0 #53d9e6/);
  assert.match(localization, /"Create Set from Selected":[\s\S]*"Selection Sets":[\s\S]*"Lock Strands":[\s\S]*"Unlock Strands":[\s\S]*"Lock Strand":[\s\S]*"Unlock Strand":[\s\S]*"Delete Selection Set":/);
  assert.match(localization, /"Create Selection Set":[\s\S]*"Add to Set":[\s\S]*"Remove from Set":/);
});

test("retired SDF fusion has no UI, runtime, preference, or localization entry points", async () => {
  const [html, source, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/localization.js", import.meta.url), "utf8")
  ]);

  assert.doesNotMatch(html, /SDF|sdfStrandFusion|previewSdfFusion/);
  assert.doesNotMatch(source, /SDF|Sdf|sdf|MarchingCubes|preview-sdf-fusion/);
  assert.doesNotMatch(localization, /SDF|sdf/);
});

test("whole-clump selection exposes clump lifecycle radial actions", async () => {
  const [source, css, localization, radialMenu, clumpProcedural] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/clump-procedural.js", import.meta.url), "utf8")
  ]);

  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /if \(kind === "clump"\) \{[\s\S]*?create-clump-preset[\s\S]*?Create Brush Preset[\s\S]*?dissolve-clump[\s\S]*?Dissolve clump[\s\S]*?delete-clump[\s\S]*?Delete clump/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /const guide = deps\.sel\.clumpViewportSelection \? deps\.clumpGuideForLock\(deps\.getSelectedLock\(\)\) : null/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /if \(action === "create-clump-preset"\)[\s\S]*?createCustomClumpPreset\(clumpGuide\)[\s\S]*?if \(action === "dissolve-clump"\)[\s\S]*?pushUndoState\(\)[\s\S]*?dissolveClump\(clumpGuide\.clumpId\)[\s\S]*?if \(action === "delete-clump"\)[\s\S]*?outlinerClumpLocks\(clumpGuide\)[\s\S]*?deleteLocks\(targets\)/
  );
  // moved to modules/geometry/clump-procedural.js
  assert.match(
    clumpProcedural,
    /function createMirroredClump\(guide, options = \{\}\)[\s\S]*outlinerClumpLocks\(guide\)[\s\S]*sourceLocks\.some\(\(lock\) => deps\.mirrorPartnerFor\(lock\)\)[\s\S]*deps\.createMirrorPartner\(lock, \{ deferUi: true \}\)[\s\S]*createClumpFromLocks\(mirroredLocks[\s\S]*deps\.syncMirrorPartnerFromLock\(guide, mirroredGuide, \{ updateClump: false \}\)[\s\S]*updateClumpMembers\(mirroredGuide\)/
  );
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu,
    /if \(kind === "clump"\)[\s\S]*clumpMirrorRadialOptions\(guide\)[\s\S]*if \(action === "mirror-clump"\)[\s\S]*createMirroredClump\(clumpGuide\)[\s\S]*if \(action === "decouple-mirrored-clump"\)[\s\S]*decoupleMirroredClump\(clumpGuide\)/
  );
  assert.match(css, /\.strand-radial-menu\[data-radial-kind="clump"\] button\s*\{[\s\S]*?width:\s*138px/);
  assert.match(localization, /"Clump actions":/);
  assert.match(localization, /"Clump":/);
});

test("selected references receive visible non-raycast viewport outlines", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [referenceHead] = await Promise.all([
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
  ]);

  assert.match(css, /\.viewport-reference-frame\.selected-reference\s*\{[\s\S]*outline:\s*1px solid #58f6ff[\s\S]*outline-offset:\s*2px/);
  assert.doesNotMatch(css, /\.viewport-reference-frame\.selected-reference\s*\{[^}]*filter:/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function updateReferenceSelectionVisuals\(\) \{[\s\S]*classList\.toggle\("selected-reference", selected\)[\s\S]*selectionOutline\.visible = selected/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /const selectionOutline = new THREE\.LineSegments\([\s\S]*new THREE\.EdgesGeometry\(geometry\)[\s\S]*color: 0x58f6ff[\s\S]*opacity: 0\.8[\s\S]*depthTest: false/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /selectionOutline\.raycast = \(\) => \{\}/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /function selectReferenceImage\(id\)[\s\S]*updateReferenceSelectionVisuals\(\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function disposeReferenceImageRuntime\(reference\)[\s\S]*reference\.selectionOutline\.geometry\.dispose\(\)[\s\S]*reference\.selectionOutline\.material\.dispose\(\)/
  );
});

test("viewport overlays drag and uniformly scale from corner handles", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [referenceHead] = await Promise.all([
    readFile(new URL("../modules/scene/reference-head.js", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(html, /referenceOverlayX|referenceOverlayY|referenceOverlayScale|referenceOverlayControls/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /\["nw", "ne", "sw", "se"\]\.forEach\(\(corner\) => \{[\s\S]*reference-overlay-scale-handle/);
  assert.match(css, /\.reference-overlay-scale-handle\s*\{[\s\S]*width:\s*10px;[\s\S]*border:\s*2px solid #ffdf54/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function beginReferenceOverlayDrag\(event, reference\) \{[\s\S]*!\["select", "move", "scale"\]\.includes\(deps\.sel\.activeTool\)[\s\S]*const mode = corner \? "scale" : "move"[\s\S]*setPointerCapture/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function setReferenceOverlayScaleHandleHover\(reference, corner = null\)[\s\S]*classList\.toggle\([\s\S]*"picker-hover"/
  );
  assert.match(css, /\.reference-overlay-scale-handle\.picker-hover\s*\{[\s\S]*border-color: #fff2aa[\s\S]*box-shadow/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function updateReferenceOverlayDrag\(event\) \{[\s\S]*pushUndoState\(\)[\s\S]*reference\.x = THREE\.MathUtils\.clamp[\s\S]*reference\.scale = nextScale[\s\S]*reference\.overlayScale = nextScale/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function finishReferenceOverlayDrag\(event, \{ cancel = false \} = \{\}\)[\s\S]*reference\.x = drag\.startX[\s\S]*reference\.scale = drag\.startScale/
  );
  assert.match(source, /window\.addEventListener\("pointermove", referenceHeadApi\.updateReferenceOverlayDrag, true\)/);
  assert.match(source, /window\.addEventListener\("pointerup", referenceHeadApi\.finishReferenceOverlayDrag, true\)/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead, /const REFERENCE_OVERLAY_HANDLE_HIT_RADIUS = 15/);
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /function referenceOverlayAtPointer\(event\) \{[\s\S]*selectedReferenceImage\(\)[\s\S]*referenceOverlayCornerAtPointer[\s\S]*return selectedReference/
  );
  // moved to modules/scene/reference-head.js
  assert.match(referenceHead,
    /Math\.abs\(event\.clientX - point\.x\) <= REFERENCE_OVERLAY_HANDLE_HIT_RADIUS[\s\S]*Math\.abs\(event\.clientY - point\.y\) <= REFERENCE_OVERLAY_HANDLE_HIT_RADIUS/
  );
});

test("duplicate placement supports ordinary copies and windowed procedural batches", async () => {
  const [source, html, css, projectState, proceduralDuplicate, radialMenu] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/procedural-duplicate.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/radial-menu.js", import.meta.url), "utf8")
  ]);

  assert.match(projectState, /!duplicatePlacement\?\.lockIds\?\.includes\(lock\.id\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function beginDuplicatePlacement\(sourceOrSources\) \{[\s\S]*const undoState = deps\.snapshotState\(\)[\s\S]*mirrorPartnerId: null[\s\S]*lockIds: duplicates\.map/);
  assert.match(source, /event\.ctrlKey[\s\S]*event\.key\.toLowerCase\(\) === "d"[\s\S]*proceduralDuplicateApi\.beginDuplicatePlacement\(selectedLocksInOrder\(\)\)/);
  assert.match(html, /id="proceduralDuplicateDialog"[\s\S]*id="proceduralDuplicateCount" type="range" min="1" max="32" step="1" value="1"[\s\S]*Confirm Duplicates/);
  assert.doesNotMatch(html, /proceduralDuplicateRootBlendEnd|Root Blend End/);
  assert.match(html, /id="proceduralDuplicateRootSink" type="range" min="0" max="1" step="0\.01" value="0"/);
  assert.match(html, /id="proceduralDuplicateSecondPointOutward" type="range" min="0" max="1" step="0\.01" value="0"/);
  assert.match(html, /id="proceduralDuplicateSecondPointTowardRoot" type="range" min="0" max="0\.95" step="0\.01" value="0"/);
  assert.match(css, /\.procedural-duplicate-count-control \.slider-input-row\s*\{[\s\S]*margin-top: 6px/);
  assert.match(css, /\.procedural-duplicate-dialog\s*\{[\s\S]*inset: 72px 372px auto auto;[\s\S]*transform: none/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /selectedLocksInOrder\(\)\.length === 2 && deps\.selectedProceduralDuplicateSources\(\)\.length === 2[\s\S]*action: "duplicate-procedural"/);
  // moved to modules/geometry/radial-menu.js
  assert.match(radialMenu, /if \(action === "duplicate-procedural"\) return deps\.openProceduralDuplicateDialog\(\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function openProceduralDuplicateDialog\(\)[\s\S]*proceduralDuplicateWindowSourceIds[\s\S]*proceduralDuplicateDialog\.show\(\)[\s\S]*rebuildProceduralDuplicatePreview\(\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function buildEvenlySpacedProceduralDuplicates\(sources, count, undoState\)[\s\S]*evenlySpacedInteriorAmounts\(count, 32\)[\s\S]*surfaceArcPolylinePointData\([\s\S]*first\.points\[0\][\s\S]*second\.points\[0\][\s\S]*headCenter[\s\S]*count \+ 1[\s\S]*\.slice\(1, -1\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function applyProceduralDuplicateBlend[\s\S]*blendCylindricalPolylinePointData\([\s\S]*rootCorrection[\s\S]*cylindricalPoints\.map/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /automaticRootBlendEnd = Math\.min\(1, 2 \/ lastPointIndex\)[\s\S]*rootCorrectionFalloff\([\s\S]*automaticRootBlendEnd[\s\S]*rootCorrection\.[xyz] \* correctionWeight/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /sourcesAttached[\s\S]*bridgePointCount = Math\.min\(2, lock\.points\.length - 2\)[\s\S]*closestPointOnActiveScalp[\s\S]*signedDistance < minimumSurfaceOffset[\s\S]*addScaledVector\(normal, minimumSurfaceOffset\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /secondPointOutwardDistance[\s\S]*secondPointSurfaceNormal[\s\S]*lock\.points\[1\]\.addScaledVector\(outwardNormal, secondPointOutwardDistance\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /secondPointTowardRoot[\s\S]*lock\.points\[1\]\.lerp\(lock\.points\[0\], secondPointTowardRoot\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function proceduralDuplicateReferencePoints[\s\S]*lowestSharedHorizontalPolylinePointData\(first\.points, second\.points\)\?\.intersections/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function updateProceduralDuplicateArcPreview[\s\S]*horizontalCircleThroughPointData[\s\S]*horizontalCirclePointData[\s\S]*proceduralDuplicateCirclePreview\.visible = true/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function rebuildProceduralDuplicatePreview[\s\S]*previewSources = proceduralDuplicateSourceSnapshots[\s\S]*updateProceduralDuplicateArcPreview\(\{[\s\S]*blendAmount: 0\.5/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function clearProceduralDuplicatePreview\(\)[\s\S]*hideProceduralDuplicateArcPreview\(\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /amounts\.forEach[\s\S]*restoreLock\(proceduralDuplicateCopySnapshot[\s\S]*applyProceduralDuplicateBlend\(duplicate, procedural, placedRoot, amount\)/);
  assert.match(source, /proceduralDuplicateCountInput\.addEventListener\("input"[\s\S]*rebuildProceduralDuplicatePreview\(\)/);
  assert.doesNotMatch(source, /proceduralDuplicateRootBlendEndInput|rootBlendEnd/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /duplicate\.rootScalpOffset = THREE\.MathUtils\.clamp\([\s\S]*Number\(first\.rootScalpOffset[\s\S]*Number\(second\.rootScalpOffset[\s\S]*- rootSink/);
  assert.match(source, /proceduralDuplicateRootSinkInput,[\s\S]*proceduralDuplicateSecondPointOutwardInput,[\s\S]*proceduralDuplicateSecondPointTowardRootInput[\s\S]*rebuildProceduralDuplicatePreview\(\)/);
  assert.match(source, /function refreshStrandSelectionConsumers\([\s\S]*proceduralDuplicateDialog\.open[\s\S]*rebuildProceduralDuplicatePreview\(\{ updateSources: true \}\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function clearProceduralDuplicatePreview\(\)[\s\S]*deleteLocks\(previewLocks\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function confirmProceduralDuplicatePreview\(\)[\s\S]*undoHistory\.push\(preview\.undoState\)[\s\S]*closeProceduralDuplicateDialog\(\{ commit: true \}\)/);
  assert.match(source, /locks: projectSnapshotLocks\(locks, sculptState\.state\.duplicatePlacement\)/);
  assert.match(projectState, /function projectSnapshotLocks\(locks,[\s\S]*!lock\.proceduralDuplicatePreview[\s\S]*duplicatePlacement\?\.lockId/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /createMirrorPartnerForNewLock\(duplicate\)[\s\S]*selectedIds: createdLocks\.map\(\(lock\) => lock\.id\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /function applyProceduralDuplicateBlend\(lock, procedural, placedRoot, explicitBlend = null\)/);
  assert.match(html, /<kbd>Ctrl<\/kbd>[\s\S]*<kbd>D<\/kbd>[\s\S]*Duplicate selected strands/);
  assert.doesNotMatch(html, /Toggle procedural duplicate mode|Alt\+D exits/);
  assert.doesNotMatch(source, /event\.altKey[\s\S]*event\.key\.toLowerCase\(\) === "d"[\s\S]*beginProceduralDuplicatePlacement/);
});

test("F cycles selected and all-scene framing while preserving view direction", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const focusBoundsSource = source.match(
    /function selectedViewportFocusBounds\(\) \{([\s\S]*?)\r?\n\}\r?\n\r?\nfunction frameViewportBounds/
  )?.[1] || "";

  assert.match(focusBoundsSource, /const lock = getSelectedLock\(\)/);
  assert.match(focusBoundsSource, /const guide = guideApi\.getSelectedGuide\(\)/);
  assert.match(focusBoundsSource, /\[guide\.mesh, guide\.rootMesh\]/);
  assert.doesNotMatch(focusBoundsSource, /selectedReferenceImage|referenceImages/);
  assert.match(
    source,
    /function frameViewportBounds\(bounds\) \{[\s\S]*getBoundingSphere[\s\S]*camera\.position\.clone\(\)\.sub\(controls\.target\)[\s\S]*viewDirection\.normalize\(\)[\s\S]*controls\.target\.copy\(center\)/
  );
  assert.match(
    source,
    /if \(camera\.isOrthographicCamera\) \{[\s\S]*camera === orthographicCamera[\s\S]*multiCameraHalfHeight = radius \* 1\.16[\s\S]*camera\.position\.copy\(center\)\.addScaledVector\(viewDirection, currentDistance\)[\s\S]*updateCameraProjectionForViewport\(\)/
  );
  assert.match(
    source,
    /const limitingFov = Math\.min\(verticalFov, horizontalFov\)[\s\S]*Math\.sin\(limitingFov \* 0\.5\)[\s\S]*camera\.position\.copy\(center\)\.addScaledVector\(viewDirection, distance\)/
  );
  assert.match(
    source,
    /function fullSceneFocusBounds\(\) \{[\s\S]*locks\.map\(\(lock\) => lock\.mesh\)[\s\S]*guides\.flatMap\(\(guide\) => \[guide\.mesh, guide\.rootMesh\]\)[\s\S]*activeScalpSurfaceMesh\(\)[\s\S]*headMeshes\(\)[\s\S]*bounds\.expandByObject\(object, true\)/
  );
  assert.match(
    source,
    /function cycleViewportFraming\(\) \{[\s\S]*selectionKey !== sel\.state\.viewportFrameSelectionKey[\s\S]*centerViewportOnSelectedItem\(\)[\s\S]*frameViewportBounds\(fullSceneFocusBounds\(\)\)[\s\S]*% 2/
  );
  assert.match(source, /event\.key\.toLowerCase\(\) === "f"[\s\S]*!event\.repeat[\s\S]*cycleViewportFraming\(\)/);
});

test("navigation styles isolate Anime Hair Studio and Blender viewport gestures", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /controls\.enableDamping = false;/);
  assert.match(source, /controls\.enableRotate = false;/);
  assert.match(source, /function syncNavigationModifierLocks\(\) \{\s*controls\.enablePan = viewportState\.state\.navigationStyle !== "anime-hair-studio"[\s\S]*!transform\.state\.transformPrecisionHeld && !sculptState\.state\.selectionRemoveHeld/);
  assert.match(source, /event\.key === "Shift" && !event\.repeat[\s\S]*transformPrecisionHeld = true;[\s\S]*syncNavigationModifierLocks\(\)/);
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*event\.key === "Shift"[\s\S]*transformPrecisionHeld = false;[\s\S]*syncNavigationModifierLocks\(\)/);
  assert.match(source, /event\.key === "Control" && !event\.repeat[\s\S]*selectionRemoveHeld = true;[\s\S]*event\.key === "Control"[\s\S]*selectionRemoveHeld = false;/);
  assert.match(
    source,
    /function beginAltOrbit\(event\) \{[\s\S]*event\.button !== 0 \|\| !event\.altKey[\s\S]*controls\.enableRotate = true;[\s\S]*event\.preventDefault\(\);/
  );
  assert.match(source, /function beginAltOrbit\(event\) \{[\s\S]*navigationStyle !== "anime-hair-studio"/);
  assert.match(
    source,
    /function beginBlenderNavigation\(event\) \{[\s\S]*navigationStyle !== "blender" \|\| event\.button !== 1[\s\S]*event\.altKey[\s\S]*"snap"[\s\S]*event\.shiftKey[\s\S]*"pan"[\s\S]*event\.ctrlKey[\s\S]*"zoom"[\s\S]*"orbit"/
  );
  assert.match(
    source,
    /modified ROTATE binding into PAN[\s\S]*controls\.mouseButtons\.MIDDLE = action === "zoom"[\s\S]*THREE\.MOUSE\.DOLLY[\s\S]*THREE\.MOUSE\.ROTATE/
  );
  assert.match(source, /action === "snap"[\s\S]*startViewSnap\(event\.pointerId, event\.clientX, event\.clientY\)[\s\S]*stopImmediatePropagation/);
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerdown", beginBlenderNavigation, true\)/);
  assert.match(source, /window\.addEventListener\("pointerup", endBlenderNavigation\)/);
  assert.match(
    source,
    /controls\.enabled = Boolean\(sculptState\.state\.altOrbitDrag\) \|\| \(!miscState\.state\.toolRadialGesture[\s\S]*!sculptState\.state\.duplicatePlacement/
  );
  assert.match(
    source,
    /function endAltOrbit\(event\) \{[\s\S]*altOrbitDrag = null;[\s\S]*controls\.enableRotate = false;/
  );
  assert.match(
    source,
    /function beginViewSnapFromActiveOrbit\(\) \{[\s\S]*!sculptState\.state\.altOrbitDrag[\s\S]*sculptState\.state\.altOrbitDrag\.pointerId !== pointer\.pointerId[\s\S]*startViewSnap\(pointer\.pointerId, pointer\.x, pointer\.y\)/
  );
  assert.match(source, /event\.key === "Shift"[\s\S]*beginViewSnapFromActiveOrbit\(\)/);
  assert.match(source, /navigationStyle === "blender"[\s\S]*event\.key === "Alt"[\s\S]*beginViewSnapFromActiveOrbit\(\)/);
  assert.match(
    source,
    /function startViewSnap\(pointerId, startX, startY\)[\s\S]*currentAxisKey: cardinalAxisKey\(startAxis\)[\s\S]*didDrag: true[\s\S]*ui\.state\.shiftSnappedViewActive = true;[\s\S]*snapCameraToCardinalAxis\(startAxis, sculptState\.state\.viewSnapDrag\.distance\)/
  );
  assert.match(source, /window\.addEventListener\("keyup"[\s\S]*event\.key === "Shift"[\s\S]*endViewSnap\(\)/);
  assert.match(source, /window\.addEventListener\("pointerup", endViewSnap\)/);
  assert.match(
    source,
    /function snapCameraToCardinalAxis\(axis, distance\)[\s\S]*const dampingEnabled = controls\.enableDamping;[\s\S]*controls\.enableDamping = false;[\s\S]*controls\.update\(\);[\s\S]*controls\.enableDamping = dampingEnabled;/
  );
  assert.match(
    source,
    /function updateViewSnap\(event\)[\s\S]*const axisKey = cardinalAxisKey\(axis\);\s*ui\.state\.shiftSnappedViewActive = true;\s*snapCameraToCardinalAxis\(axis, sculptState\.state\.viewSnapDrag\.distance\);\s*sculptState\.state\.viewSnapDrag\.currentAxisKey = axisKey;/
  );
  assert.match(source, /window\.addEventListener\("pointermove", updateViewSnap, true\)/);
  assert.match(
    source,
    /function endViewSnap\(event\)[\s\S]*event\?\.preventDefault\(\);\s*\}/
  );
  assert.doesNotMatch(source, /function beginViewSnap\(event\)/);
  assert.doesNotMatch(source, /addEventListener\("pointerdown", beginViewSnap/);
  assert.match(source, /transformControls\.enabled = !miscState\.state\.toolRadialGesture && !hairState\.state\.strandRadialGesture && !sculptState\.state\.duplicatePlacement && !sculptState\.state\.referenceOverlayDrag && !sculptState\.state\.referenceCropDrag && !sculptState\.state\.altOrbitDrag/);
  assert.doesNotMatch(source, /if \(tool !== "select"\) \{\s*altOrbitDrag = null;/);
});

test("S plus left drag adjusts the active brush without starting a modeling gesture", async () => {
  const [source, sculptGeometry] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8"),
  ]);

  assert.match(
    source,
    /function activeBrushSizeInput\(\) \{[\s\S]*scalpState\.state\.scalpPaintEditing[\s\S]*sculptBrushToolActive\(\)[\s\S]*sculptBrushRadiusInput[\s\S]*\["draw", "procedural-draw"\]\.includes\(sel\.state\.activeTool\)[\s\S]*sel\.state\.activeTool === "braid"[\s\S]*sel\.state\.activeTool === "panel"/
  );
  assert.match(
    source,
    /function beginBrushSizeDrag\(event\) \{[\s\S]*!sculptState\.state\.brushSizeHotkeyHeld[\s\S]*event\.button !== 0[\s\S]*event\.stopImmediatePropagation\(\);/
  );
  assert.match(
    source,
    /function updateBrushSizeDrag\(event\) \{[\s\S]*Math\.exp\(exponent\)[\s\S]*input\.dispatchEvent\(new Event\("input", \{ bubbles: true \}\)\)[\s\S]*refreshActiveBrushSizeScale\(\)/
  );
  assert.match(
    source,
    /function refreshActiveBrushSizeScale\(\) \{[\s\S]*scalpBrushCursor\.scale\.setScalar[\s\S]*setDrawStrandBrushCursorScale\(cursorScale\)/
  );
  assert.match(
    source,
    /function refreshActiveBrushSizeCursor\(event\) \{[\s\S]*sculptBrushToolActive\(\)[\s\S]*sculptGeom\.updateSculptBrushCursor\(event\)/
  );
  assert.match(
    source,
    /function refreshActiveBrushSizeScale\(\) \{[\s\S]*sculptBrushToolActive\(\)[\s\S]*sculptGeom\.syncSculptBrushControls\(\)/
  );
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(
    sculptGeometry,
    /function updateSculptBrushCursor\(event\) \{[\s\S]*brushSizeDrag\?\.input === deps\.sculptBrushRadiusInput[\s\S]*brushSizeDrag\.startX[\s\S]*brushSizeDrag\.startY[\s\S]*style\.left = `\$\{clientX - rect\.left\}px`[\s\S]*style\.top = `\$\{clientY - rect\.top\}px`/
  );
  assert.match(
    source,
    /function finishBrushSizeDrag\(event\) \{[\s\S]*const \{ pointerId, input \} = sculptState\.state\.brushSizeDrag;[\s\S]*sculptState\.state\.brushSizeDrag = null;[\s\S]*input === sculptBrushRadiusInput[\s\S]*sculptGeom\.updateSculptBrushCursor\(event\)/
  );
  assert.match(
    source,
    /const drawStrandBrushCursor = new THREE\.Mesh\(\s*new THREE\.RingGeometry\(0\.91, 1, 48\)/
  );
  assert.match(
    source,
    /function setDrawStrandBrushCursorScale\(scale\) \{[\s\S]*0\.09 \/ Math\.sqrt\(cursorScale\)[\s\S]*0\.05, 0\.24[\s\S]*new THREE\.RingGeometry\(1 - ringThickness, 1, 48\)[\s\S]*previousGeometry\.dispose\(\)[\s\S]*scale\.setScalar\(cursorScale\)/
  );
  assert.doesNotMatch(
    source,
    /drawStrandBrushCursor\.scale\.setScalar\((?!cursorScale\))/
  );
  assert.doesNotMatch(
    source,
    /input\.dispatchEvent\(new Event\("input", \{ bubbles: true \}\)\);\s*refreshActiveBrushSizeCursor\(event\)/
  );
  assert.match(source, /event\.key\.toLowerCase\(\) === "s"[\s\S]*brushSizeHotkeyHeld = true/);
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerdown", beginBrushSizeDrag, true\)/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(
    sculptGeometry,
    /function beginSculptMoveStroke\(event\) \{[\s\S]*!deps\.sculptBrushToolActive\(\)[\s\S]*\|\| deps\.sculptState\.brushSizeHotkeyHeld/
  );
  assert.match(
    source,
    /renderer\.domElement\.addEventListener\("pointerdown", beginBrushSizeDrag, true\);\s*renderer\.domElement\.addEventListener\("pointerdown", sculptGeom\.beginSculptMoveStroke, true\)/
  );
  assert.match(source, /controls\.enabled = [^\n]*!sculptState\.state\.brushSizeDrag/);
  assert.match(source, /transformControls\.enabled = [^\n]*!sculptState\.state\.brushSizeDrag/);
});

test("selected strand grab handles edit width, depth, and uniform dimensions", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [sculptGeometry] = await Promise.all([
    readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8"),
  ]);

  assert.match(
    source,
    /const widthEdgeLines = \[-1, 1\]\.map\(\(side\) => \{[\s\S]*strandWidthEdge = true[\s\S]*createDimensionEdgeLines[\s\S]*depthEdgeLines = createDimensionEdgeLines\("depth"\)[\s\S]*uniformEdgeLines = createDimensionEdgeLines\("uniform"\)/
  );
  assert.match(
    source,
    /edge\.visible = lock\.id === sel\.state\.selectedId[\s\S]*!sel\.state\.clumpViewportSelection[\s\S]*sculptState\.state\.viewportEditMode === "strand"[\s\S]*moveGrabHandleVisible\(dimension\)[\s\S]*\["select", "move"\]\.includes\(sel\.state\.activeTool\)/
  );
  assert.match(
    source,
    /function beginStrandWidthEdgeDrag\(event\) \{[\s\S]*pushUndoState\(\);[\s\S]*setPointerCapture\?\.\(event\.pointerId\)[\s\S]*event\.stopImmediatePropagation\(\)/
  );
  assert.match(
    source,
    /function strandControlPointHit\(event,[\s\S]*strandControlPointHitFromEvent\(event, lock\)[\s\S]*function beginStrandWidthEdgeDrag\(event\)[\s\S]*if \(strandControlPointHit\(event, lock\)\) return;[\s\S]*raycaster\.intersectObjects\(edges, false\)/
  );
  assert.match(
    source,
    /function disposeAllEditableObjects\(\)[\s\S]*setHoveredStrandWidthEdge\(null\)[\s\S]*function beginStrandWidthEdgeDrag\(event\)[\s\S]*edge\.geometry\?\.getAttribute\("position"\)\?\.count[\s\S]*function updateStrandWidthEdgeHover\(event\)[\s\S]*edge\.geometry\?\.getAttribute\("position"\)\?\.count/
  );
  assert.match(
    source,
    /function transportedStrandWidthEdgeFrame\(lock, curve, t\)[\s\S]*strandWidthEdgeFrameAt\(lock, curve, 0\)[\s\S]*strandWidthEdgeFrameAt\(lock, curve, t \* step \/ stepCount, frame\)/
  );
  assert.match(
    source,
    /function strandWidthEdgePoints\(lock, side, dimension = "width"\)[\s\S]*let previousFrame = curve \? strandWidthEdgeFrameAt\(lock, curve, 0\)[\s\S]*strandWidthEdgeFrameAt\(lock, curve, t, previousFrame\)[\s\S]*strandWidthEdgeSample\(lock, t, side, frame, curve, dimension\)[\s\S]*previousFrame = frame/
  );
  // The edge drag now handles only the width dimension: the old combined
  // width+depth+uniform logic (nextDimension/dimensionDelta/uniformScale) was retired;
  // depth and uniform edits flow through the regular depth-curve / uniform-scale
  // inputs instead.
  assert.match(
    source,
    /function updateStrandWidthEdgeDrag\(event\) \{[\s\S]*const widthDelta = nextWidth - drag\.startWidth[\s\S]*sculptGeom\.applyEditableStrandWidth\(target, snapshot\.startWidth \+ widthDelta, snapshot\)[\s\S]*syncLockFromCurve\(target\)[\s\S]*updateLockGeometry\(target, \{ immediate: true \}\)[\s\S]*syncInputs\(lock\)/
  );
  assert.doesNotMatch(source, /nextDimension[^\n]*drag\.side \* worldDelta/);
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry,
    /lock\.geometryType === "surface"[\s\S]*drag\?\.startPoints[\s\S]*const center = drag\.startPoints\[centerIndex\][\s\S]*multiplyScalar\(ratio\)/
  );
  assert.match(
    source,
    /function finishStrandWidthEdgeDrag\(event, \{ cancel = false \} = \{\}\) \{[\s\S]*targetSnapshots\.forEach[\s\S]*Object\.assign\(target, snapshot\.startWidthState\)[\s\S]*releasePointerCapture/
  );
  assert.match(source, /window\.addEventListener\("pointermove", updateStrandWidthEdgeDrag, true\)/);
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerdown", beginStrandWidthEdgeDrag, true\)/);
  assert.match(source, /controls\.enabled = [^\n]*!sculptState\.state\.strandWidthEdgeDrag/);
  assert.match(source, /transformControls\.enabled = [^\n]*!sculptState\.state\.strandWidthEdgeDrag/);
});

test("brush size uniformly scales strand width and depth", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);

  const [drawFlow] = await Promise.all([
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
  ]);

  assert.match(source, /const strandCreationDefaults = \{[\s\S]*width: 0\.16,\s*depth: 0\.24,/);
  assert.match(html, /id="depthScale"[^>]*value="0\.24"[\s\S]*id="depthScaleValue"[^>]*>0\.24</);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function activeStrokeBrushDepth\(\) \{[\s\S]*braidCreationDefaults\.braidDepth[\s\S]*panelCreationDefaults\.panelThickness[\s\S]*strandCreationDefaults\.depth/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /brushSize: activeStrokeBrushSize\(\),\s*brushDepth: activeStrokeBrushDepth\(\)/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /width: extensionLock\?\.width \|\| deps\.sculptState\.drawStrandStroke\.brushSize,\s*depth: extensionLock\?\.depth \?\? deps\.sculptState\.drawStrandStroke\.brushDepth/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /depth: shapeTemplate && clumpTemplate[\s\S]*: stroke\.brushDepth/
  );
  assert.match(
    source,
    /sculptState\.state\.drawStrandStroke\.panelThickness = sculptState\.state\.drawStrandStroke\.brushDepth/
  );
});

test("Shift constrains shared draw-tool strokes to a surface-conformed eight-way direction", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);

  const [drawFlow] = await Promise.all([
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
  ]);

  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function beginDrawStrandStroke\(event,[\s\S]*event\.ctrlKey \|\| event\.altKey \|\| event\.metaKey[\s\S]*startX: event\.clientX[\s\S]*initialFreePlane/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function updateDrawStrandStroke\(event\)[\s\S]*event\.shiftKey[\s\S]*eightWayScreenDelta\([\s\S]*cardinalDirectionKey[\s\S]*drawStrokeSampleAtEvent\(stroke, sampleEvent\)/
  );
  assert.match(
    source,
    /if \(\["draw", "procedural-draw", "braid", "panel"\]\.includes\(sel\.state\.activeTool\)\) \{\s*if \(event\.ctrlKey \|\| event\.altKey \|\| event\.metaKey\) return;/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function drawStrokeSampleAtEvent\(stroke, event\)[\s\S]*drawSurfaceHitFromEvent\(event[\s\S]*drawSampleFromHit\(hit/);
  assert.match(html, /<kbd>Shift<\/kbd>[\s\S]*Draw drag[\s\S]*Draw a surface-conformed strand, braid, or panel in eight directions/);
});

test("Draw Strand creates a dedicated frame-attached branch from a selected control point", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [branchHierarchy, drawFlow, branchRootBone] = await Promise.all([
    readFile(new URL("../modules/geometry/branch-hierarchy.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/branch-root-bone.js", import.meta.url), "utf8"),
  ]);

  // moved to modules/geometry/branch-hierarchy.js
  assert.match(branchHierarchy,
    /function selectedDrawBranchPoint\(event\)[\s\S]*activeTool !== "draw"[\s\S]*canBranchDrawFromLock\(lock\)[\s\S]*strandControlPointHitFromEvent\(event, lock\)[\s\S]*pointIndex[\s\S]*curveFrameAtPoint\(lock, pointIndex\)/
  );
  // moved to modules/geometry/branch-hierarchy.js
  assert.match(branchHierarchy,
    /function canBranchDrawFromLock\(lock\)[\s\S]*lock\?\.geometryType === "strand"[\s\S]*!lock\.clumpId \|\| lock\.clumpGuide/
  );
  assert.match(
    source,
    /const extensionLock = drawFlowApi\.selectedTipContinuationLock\(event\);[\s\S]*const branchStart = extensionLock \? null : branchHierarchy\.selectedDrawBranchPoint\(event\);[\s\S]*const surfaceHit = extensionLock \|\| branchStart \? null : drawFlowApi\.drawSurfaceHitFromEvent\(event, \{ root: true \}\)[\s\S]*drawFlowApi\.beginDrawStrandStroke\(event, surfaceHit, extensionLock, branchStart\)/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function beginDrawStrandStroke\(event, hit, extensionLock = null, branchStart = null\)[\s\S]*branchSourceLockId: branchStart\?\.lock\.id \|\| null[\s\S]*branchSourcePointIndex: branchStart\?\.pointIndex \?\? null/
  );
  // moved to modules/geometry/branch-hierarchy.js
  assert.match(branchHierarchy,
    /function attachDrawnLocksAsBranches\(stroke, created\)[\s\S]*canBranchDrawFromLock\(parent\)[\s\S]*ensureBranchParentNormalField\(parent\)[\s\S]*branchParentId = parent\.id[\s\S]*captureBranchLocalState\(lock\)[\s\S]*updateBranchChildren\(parent\)/
  );
  // moved to modules/geometry/branch-hierarchy.js
  assert.match(branchHierarchy,
    /function updateBranchChildren\(parent\)[\s\S]*deps\.branchParentFrame\(parent, child\.branchParentParameter\)[\s\S]*point\.copy\(frame\.point\)\.add\(deps\.branchWorldVector\(local, frame\)\)[\s\S]*remapEnvelopeCurveRange\(parent\.taperCurve[\s\S]*remapEnvelopeCurveRange\(parent\.depthCurve/
  );
  assert.match(
    source,
    /branchParentId: lock\.branchParentId \|\| null[\s\S]*branchLocalPoints:[\s\S]*branchLocalSurfaceNormals:/
  );
  assert.match(
    source,
    /function beginStrandObjectTransform\(handle\)[\s\S]*selectedTargets\.filter[\s\S]*branchParentId[\s\S]*branchChildrenFor\(lock\)\.forEach\(\(child\) => previewLocks\.add\(child\)\)/
  );
  assert.match(
    source,
    /function updateStrandObjectTransform\(handle\)[\s\S]*branchChildrenFor\(lock\)\.forEach[\s\S]*applyStrandObjectPreviewMatrix\([\s\S]*child[\s\S]*worldDelta/
  );
  assert.match(
    source,
    /function commitStrandObjectTransform\(edit, handle\)[\s\S]*if \(lock\.branchParentId\)[\s\S]*enforceBranchRootPosition\(lock\)[\s\S]*captureBranchLocalState\(lock\)/
  );
  // moved to modules/geometry/branch-root-bone.js
  assert.match(branchRootBone,
    /function enforceBranchRootPosition\(lock\)[\s\S]*const frame = branchParentFrame\(parent, lock\.branchParentParameter\)[\s\S]*new THREE\.Vector3\(\)\.subVectors\(lock\.points\[0\], frame\.point\)\.dot\(frame\.x\)/
  );
  assert.match(
    source,
    /function updateStrandObjectTransform\(handle\)[\s\S]*lock\.branchParentId[\s\S]*worldMatrixForFixedPivot\(target\.pivot\)[\s\S]*applyStrandObjectPreviewMatrix\(lock, worldDelta, previewSnapshot\)/
  );
  assert.match(
    source,
    /function commitStrandObjectTransform\(edit, handle\)[\s\S]*const pointTransform = lock\.branchParentId \? transformPointAroundFixedPivot : transformPoint/
  );
  assert.match(
    source,
    /transformControls\.addEventListener\("objectChange"[\s\S]*enforceBranchRootPosition\(lock\)[\s\S]*syncUnifiedCurveSurfaceMirror/
  );
  // moved to modules/geometry/branch-root-bone.js
  assert.match(branchRootBone,
    /function branchMoveGizmoDisabled\(\)[\s\S]*deps\.selState\.activeTool !== "move"[\s\S]*lock\?\.branchParentId[\s\S]*return !deps\.componentEditModeActive\(\)/
  );
  // moved to modules/geometry/branch-root-bone.js
  assert.match(branchRootBone,
    /function setBranchMoveGizmoVisual\(disabled\)[\s\S]*material\._color\?\.copy[\s\S]*gizmoGroups\.translate[\s\S]*material\._color\?\.setHex\(0x7c7c84\)[\s\S]*material\._opacity = disabledOpacity/
  );
  assert.match(
    source,
    /transformControls\.enabled = [^\n]*!sculptState\.state\.taperMeshPointDrag && !branchMoveDisabled[\s\S]*setBranchMoveGizmoVisual\(branchMoveDisabled\)/
  );
});

test("Procedural Draw creates a round-profile guide with editable accessories and branches", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [drawFlow, clumpProcedural, taperEditor, strandGeometry, drawStore, ioTail] = await Promise.all([
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/clump-procedural.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/taper-editor.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/strand-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/edit/draw-store.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/io-tail.js", import.meta.url), "utf8"),
  ]);
  assert.match(html, /class="tool-button experimental-tool-hidden"[^>]*data-tool="procedural-draw"[^>]*title="Procedural Draw"[^>]*aria-label="Procedural Draw tool"[^>]*hidden[^>]*aria-hidden="true"[^>]*tabindex="-1"/);
  assert.match(html, /data-preference-category="experimental">Experimental<\/button>/);
  assert.match(html, /data-preference-panel="experimental"[\s\S]*id="proceduralDrawExperimentalPreference"[^>]*type="checkbox"/);
  // The compound-strand / hair-shell / arc-hair-surface / floating-tool-settings /
  // hotkey-tool-settings / show-dev-test-features preference system was retired: those
  // preferences, their HTML controls, CSS, and runtime gates no longer exist. The
  // experimental panel now only carries Procedural Draw and Multi-cam View.
  assert.match(html, /data-preference-panel="experimental"[\s\S]*id="proceduralDrawExperimentalPreference"[^>]*type="checkbox"/);
  assert.match(html, /data-preference-panel="experimental"[\s\S]*id="multiCameraExperimentalPreference"[^>]*type="checkbox"/);
  assert.match(source, /const PROCEDURAL_DRAW_EXPERIMENTAL_PREFERENCE_KEY = "anime-hair-studio-experimental-procedural-draw"/);
  // moved to modules/edit/draw-store.js
  assert.match(drawStore, /proceduralDrawExperimentalEnabled: readStoredBooleanPreference\(\s*window,\s*DRAW_PREFERENCE_KEYS\.proceduralDrawExperimental,\s*false/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function setProceduralDrawExperimentalEnabled\(enabled, \{ persist = true \} = \{\}\)[\s\S]*deps\.proceduralDrawToolButton\.classList\.toggle\("experimental-tool-hidden", !deps\.draw\.proceduralDrawExperimentalEnabled\)[\s\S]*deps\.proceduralDrawToolButton\.hidden = !deps\.draw\.proceduralDrawExperimentalEnabled[\s\S]*deps\.sel\.activeTool === "procedural-draw"[\s\S]*deps\.setActiveTool\("draw"\)/);
  assert.match(css, /\.tool-button\.experimental-tool-hidden,[\s\S]*display:\s*none/);
  assert.match(source, /if \(tool === "procedural-draw" && !draw\.state\.proceduralDrawExperimentalEnabled\) tool = "draw"/);
  // moved to modules/io/io-tail.js
  assert.match(ioTail, /proceduralDrawExperimental: deps\.draw\.proceduralDrawExperimentalEnabled/);
  assert.doesNotMatch(html, /id="proceduralDrawAccessorySection"|id="proceduralAccessoryCount"|id="proceduralBranchCount"/);
  assert.match(source, /const PROCEDURAL_DRAW_DEFAULTS = Object\.freeze\([\s\S]*accessoryCount: 0[\s\S]*branchCount: 4/);
  assert.match(css, /\.procedural-draw-accessories\.hidden\s*\{\s*display:\s*none/);
  assert.match(html, /id="proceduralAccessoryEditPanel"[\s\S]*id="proceduralAccessoryEditCount"[^>]*min="0"[^>]*value="0"[\s\S]*id="proceduralAccessoryEditRadius"[\s\S]*id="proceduralAccessoryEditParentVisible"[\s\S]*id="proceduralBranchEditCount"[^>]*max="64"[\s\S]*id="proceduralBranchEditLength"[\s\S]*id="proceduralBranchEditTipOffset"/);
  assert.match(html, /id="proceduralBranchLengthCurvePreview"[\s\S]*data-curve-key="proceduralBranchLengthCurve"/);
  assert.match(html, /id="proceduralBranchShapeCurvePreview"[\s\S]*data-curve-key="proceduralBranchShapeCurve"/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function proceduralDrawClumpTemplate\(stroke = null\)[\s\S]*proceduralAccessoryTemplateData[\s\S]*ROUND_SWEEP_PROFILE/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function drawClumpStrandMaps[\s\S]*Array\.isArray\(strand\.radialOffset\)[\s\S]*parameters = centerPoints\.map[\s\S]*addScaledVector\(targetFrame\.x,[\s\S]*addScaledVector\(targetFrame\.z,/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function drawClumpStrandMaps[\s\S]*proceduralAccessoryTaperScale\(template\.parentShape, t, offsetX, offsetZ\)[\s\S]*offsetX \* taperScale\.x[\s\S]*offsetZ \* taperScale\.z/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /proceduralParentHidden: Boolean\(stroke\.proceduralDraw && isCenter && !stroke\.proceduralParentVisible\)/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function createDrawnStrand\(stroke\)[\s\S]*createClumpFromLocks\(created/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function syncProceduralParentVisibility\(lock\)[\s\S]*lock\.mesh\.material\.visible = !lock\.proceduralParentHidden[\s\S]*syncLockedStrandWireVisual\(lock\)/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function applyProceduralAccessorySettings\(guide,[\s\S]*proceduralAccessoryMapsForGuide[\s\S]*createProceduralAccessoryLock[\s\S]*setProceduralAccessoryGeometry/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function applyProceduralBranchSettings\(guide,[\s\S]*proceduralBranchTemplatesForGuide[\s\S]*guide\.proceduralBranchCount = normalizedCount[\s\S]*updateLockGeometry\(guide/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function applyTaperCurveEdit[\s\S]*proceduralBranchCurveEditing\(\)[\s\S]*guide\[curveKey\][\s\S]*updateLockGeometry\(guide, \{ immediate: true/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function proceduralBranchTemplatesForGuide[\s\S]*lengthCurve: guide\?\.proceduralBranchLengthCurve/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function proceduralBranchTemplatesForGuide[\s\S]*shapeCurve: guide\?\.proceduralBranchShapeCurve/);
  assert.match(source, /proceduralBranchLengthCurve: shapePresets\.cloneShapePresetValue\([\s\S]*lock\.proceduralBranchLengthCurve \|\| DEFAULT_PROCEDURAL_BRANCH_LENGTH_CURVE/);
  // moved to modules/geometry/strand-geometry.js
  assert.match(strandGeometry, /function createHairGeometry\(lock\)[\s\S]*lock\?\.proceduralDrawGuide[\s\S]*proceduralBranchTemplatesForGuide\([\s\S]*proceduralBranchGeometryLock\(lock, template, index\)[\s\S]*mergeGeometries\(geometries, false\)/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function updateDrawStrandPreview\(\)[\s\S]*proceduralDrawGuide: Boolean\(deps\.sculptState\.drawStrandStroke\.proceduralDraw\)[\s\S]*proceduralBranchCount:[\s\S]*proceduralBranchLength:[\s\S]*proceduralBranchTipOffset:/);
  // moved to modules/geometry/clump-procedural.js
  assert.match(clumpProcedural, /function updateClumpMembers\(guide\)[\s\S]*guide\?\.proceduralDrawGuide[\s\S]*proceduralAccessoryMapsForGuide\(guide, count, radius\)/);
  assert.match(source, /proceduralDrawGuide: Boolean\(lock\.proceduralDrawGuide\)[\s\S]*proceduralAccessoryCount:[\s\S]*proceduralAccessoryRadius:[\s\S]*proceduralBranchCount:[\s\S]*proceduralBranchLength:[\s\S]*proceduralBranchTipOffset:/);
});

test("Draw Strand keeps the authored creation profile across standard, coil, and clump brushes", async () => {
  const [drawFlow] = await Promise.all([
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
  ]);

  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function updateDrawStrandPreview\(\)[\s\S]*sweepProfile: extensionLock\?\.sweepProfile \|\| defaults\.sweepProfile/);
  assert.doesNotMatch(drawFlow, /curlEnabled \? ROUND_SWEEP_PROFILE/);
  assert.doesNotMatch(drawFlow, /clumpTemplate\.sweepProfile \|\| previewLock\.sweepProfile/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function createDrawnLock\([\s\S]*sweepProfile: deps\.shapePresets\.cloneShapePresetValue\(setting\("sweepProfile", deps\.strandCreationDefaults\.sweepProfile\)\)/);
  assert.doesNotMatch(drawFlow, /function createDrawnStrand\([\s\S]*ROUND_SWEEP_PROFILE[\s\S]*function extendDrawnStrand/);
  assert.doesNotMatch(drawFlow, /lock\.sweepProfile = cloneShapePresetValue\(ROUND_SWEEP_PROFILE\)/);
});

test("viewport draw settings expose live surface and creation layer outside setup editors", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [drawFlow, presetLibrary, creationPresets] = await Promise.all([
    readFile(new URL("../modules/geometry/draw-flow.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/preset-library.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/creation-presets.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id=["']viewportDrawSettings["'][\s\S]*?id=["']drawStrandSurface["']/);
  assert.match(html, /id=["']drawStrandSurface["'][\s\S]*?<option value=["']head["'] selected>Head Mesh<\/option>[\s\S]*?<option value=["']contextual-plane["']>Contextual 2D Plane<\/option>/);
  assert.match(html, /class=["']viewport-live-surface-control["'][\s\S]*?id=["']drawStrandSurface["'][\s\S]*?<button id=["']drawSurfaceDynamic["'] class=["']viewport-dynamic-toggle["'] type=["']button["'] aria-pressed=["']true["'] data-boolean-control=["']true["'][^>]*>Dynamic<\/button>/);
  assert.match(css, /\.viewport-draw-settings \.viewport-dynamic-toggle\s*\{[^}]*min-height:\s*36px;[^}]*padding:\s*0 10px;[^}]*text-transform:\s*uppercase/);
  assert.match(css, /\.viewport-draw-settings \.viewport-dynamic-toggle\[aria-pressed="true"\]\s*\{[^}]*background:\s*#2c2731;[^}]*color:\s*#58f6ff/);
  assert.doesNotMatch(css, /\.viewport-dynamic-toggle input/);
  assert.doesNotMatch(html, /id=["'](?:braidSurface|panelSurface|curveSurfaceSurface)["']/);
  assert.doesNotMatch(html, /Head Mesh \+ Contextual 2D|Conform to Head Mesh/);
  assert.match(html, /id=["']viewportDrawSettings["'][\s\S]*?id=["']viewportDrawLayer["']/);
  assert.match(html, /id=["']viewportDrawLayer["'][\s\S]*?<option value=["']bottom["']>Bottom<\/option>/);
  assert.match(html, /id=["']viewportDrawLayer["'][\s\S]*?<option value=["']accent["']>Accent<\/option>/);
  assert.match(source, /drawSettingsVisible = !scalpState\.state\.scalpBuilderEditing[\s\S]*!sculptState\.state\.headSetupEditing[\s\S]*!sculptState\.state\.capsuleGuideEditing/);
  assert.match(source, /viewportDrawSettings\.classList\.toggle\(["']hidden["'], !drawSettingsVisible\)/);
  assert.match(source, /strandCreationDefaults\.hairLayer = layerId/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function refreshLiveSurfaceOptions\(\) \{[\s\S]*data-live-surface-guides[\s\S]*group\.label = "Guides"[\s\S]*select\.appendChild\(group\)/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /const surfaceGuides = deps\.guides\.filter\(guideSupportsLiveSurface\);[\s\S]*option\.value = `guide:\$\{guide\.id\}`/
  );
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow,
    /function refreshLiveSurfaceOptions\(\) \{[\s\S]*data-live-surface-strands[\s\S]*locks\.filter\(\(lock\) => lock\.liveSurfaceGuide\)[\s\S]*group\.label = "Strand Guides"/
  );
  assert.doesNotMatch(source, /Strands \+ Contextual 2D/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function activeStrokeSurfaceInput\(\) \{[\s\S]*return deps\.drawStrandSurfaceInput;\s*\}/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function activeStrokeSurfaceValue\(\) \{\s*return activeStrokeSurfaceInput\(\)\.value;\s*\}/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function activeStrokeDynamicEnabled\(surfaceMode = activeStrokeSurfaceValue\(\)\)[\s\S]*surfaceMode !== "contextual-plane" && drawSurfaceDynamicEnabled\(\)/);
  // moved to modules/geometry/draw-flow.js
  assert.match(drawFlow, /function drawSurfaceDynamicEnabled\(\)[\s\S]*aria-pressed[\s\S]*function setDrawSurfaceDynamicEnabled\(enabled\)/);
  assert.match(source, /function handleLiveSurfaceChange\(\)[\s\S]*finishDrawStrandStroke[\s\S]*drawSurfaceDynamicButton\.disabled = drawFlowApi\.activeStrokeSurfaceValue\(\) === "contextual-plane"[\s\S]*drawStrandSurfaceInput\.addEventListener\("change", handleLiveSurfaceChange\)[\s\S]*drawSurfaceDynamicButton\.addEventListener\("click"[\s\S]*drawSurfaceDynamicButton\.addEventListener\("change", handleLiveSurfaceChange\)/);
  // The live-surface history capture (captureLiveSurfaceHistoryState /
  // restoreLiveSurfaceHistoryState and restoreState's preserveLiveSurfaces) was
  // retired: live-surface settings are now transient stroke state, not part of the
  // undo/restore contract.
  assert.doesNotMatch(source, /captureLiveSurfaceHistoryState|restoreLiveSurfaceHistoryState|preserveLiveSurfaces/);
  assert.doesNotMatch(source, /curveSurfaceSurfaceInput|braidSurfaceInput|panelSurfaceInput|synchronizeLiveSurfaceInputs/);
  assert.match(source, /const strokeToolActive = \["draw", "procedural-draw", "braid", "panel", "surface-loft", "curve-surface"\]\.includes\(sel\.state\.activeTool\);[\s\S]*const originPlaneActive = strokeToolActive && drawFlowApi\.activeStrokeSurfaceValue\(\) === "contextual-plane"/);
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /surface: deps\.activeStrokeSurfaceValue\(\)[\s\S]*dynamicSurface: deps\.drawSurfaceDynamicEnabled\(\)/);
  // moved to modules/io/preset-library.js
  assert.match(presetLibrary, /input\.dataset\.booleanControl === "true"[\s\S]*setDrawSurfaceDynamicEnabled\(Boolean\(value\)\)/);
});

test("project restore preserves authored strand and braid points while presets may remap attachments", async () => {
  const [source, projectState, scalpBuilder] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/project-state.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/scalp/scalp-builder.js", import.meta.url), "utf8")
  ]);
  // moved to modules/scalp/scalp-builder.js
  const refreshStart = scalpBuilder.indexOf("function refreshLoadedRootAttachmentsOnAuthoredScalp()");
  // **行尾无关**：磁盘上的行尾取决于 checkout 平台（Windows 给 CRLF、Linux 给 LF），而 git 存的是 LF
  // ⇒ 把 `\r\n` 写死进 indexOf 会让这条断言**只在 CRLF checkout 下成立**，在任何 LF 检出（含 CI）下
  // 静默切出空串、断言空转。`split-tip-geometry.test.mjs:3035` 已为同一个坑留过记录（那里的修法是
  // `\r?\n`）。这里用正则定位到 `}` 本身，两种行尾都对。
  const refreshEndMatch = /\r?\n\}\r?\n\r?\nfunction remapLegacyPresetToActiveScalp/.exec(
    scalpBuilder.slice(refreshStart)
  );
  assert.ok(refreshEndMatch, "未找到 refreshLoadedRootAttachmentsOnAuthoredScalp 的结束边界");
  const refreshEnd = refreshStart + refreshEndMatch.index + refreshEndMatch[0].indexOf("}");
  const refreshSource = scalpBuilder.slice(refreshStart, refreshEnd);

  assert.match(projectState, /function createProjectRestorePlan\(state,[\s\S]*counters:[\s\S]*visibility:[\s\S]*resources:[\s\S]*scene:[\s\S]*strandSelection:[\s\S]*selection:/);
  assert.match(source, /function restoreSharedStateForStateRestore\(state, restorePlan,[\s\S]*restorePlan\.selection\.point/);
  assert.match(source, /function restoreSceneCollectionsForStateRestore\(restorePlan,[\s\S]*restorePlan\.scene\.locks\.forEach[\s\S]*restorePlan\.scene\.guides\.forEach/);
  assert.match(source, /function restoreState\(state,[\s\S]*const restorePlan = createProjectRestorePlan\(state,[\s\S]*restoreSharedStateForStateRestore\(state, restorePlan[\s\S]*restoreSceneCollectionsForStateRestore\(restorePlan/);

  assert.match(
    source,
    /restoreLock\(snapshot,\s*\{\s*deferRootAttachment:\s*deferRootAttachments,\s*remapRootAttachment:\s*preservePlacement\s*\}\)/
  );
  assert.match(
    source,
    /rootAttachmentFromData\(snapshot\.rootAttachment \|\| null,\s*lock,\s*\{\s*resolveSurface:\s*remapRootAttachment\s*\}\)/
  );
  assert.match(source, /if \(remapRootAttachment\) ioApi\.applyRootAttachmentLocalCurves\(lock\)/);
  assert.notEqual(refreshStart, -1);
  assert.match(refreshSource, /deps\.createRootAttachment\(lock,\s*sourcePoint\)/);
  assert.match(refreshSource, /deps\.syncRootAttachmentMetadata\(lock\)/);
  assert.doesNotMatch(refreshSource, /applyRootAttachmentLocalCurves/);
});

test("strand width and depth curve editors expose draggable viewport mesh points", async () => {
  const [html, source, css, localization, taperEditor, sculptGeometry, creationPresets] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/taper-editor.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/sculpt-geometry.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/creation-presets.js", import.meta.url), "utf8")
  ]);

  assert.match(
    html,
    /id="taperMeshPointsToggleRow"[\s\S]*Show points on mesh[\s\S]*id="taperMeshPointsToggle"/
  );
  assert.match(
    html,
    /id="taperCurveSecondaryPath"[\s\S]*id="taperCurveCenterLine"[\s\S]*Asymmetric curve[\s\S]*id="taperAsymmetryToggle"/
  );
  assert.match(
    html,
    /id="centerAsymmetricProfileRow"[\s\S]*Center asymmetric profile[\s\S]*id="centerAsymmetricProfile"/
  );
  assert.match(
    html,
    /class="profile-dialog-actions taper-curve-actions"[\s\S]*id="addTaperPoint"[\s\S]*class="taper-toggle-stack"[\s\S]*id="taperAsymmetryToggle"[\s\S]*id="taperMeshPointsToggle"/
  );
  assert.doesNotMatch(html, /id="taperCurveSide"/);
  assert.match(html, /styles\.css\?v=20260910-20/);
  assert.match(html, /app\.js\?v=20260910-20/);
  // localization.js is now loaded as an ES-module import inside app.js (there is no
  // separate localization script tag anymore).
  assert.match(source, /from "\.\/modules\/data\/localization\.js\?v=20260901-1"/);
  assert.match(source, /new THREE\.SphereGeometry\(0\.016, 12, 8\)/);
  assert.match(source, /color: 0xe62bea/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /const center = new THREE\.Mesh\(deps\.taperMeshPointGeometry, deps\.taperMeshPointCenterMaterial\)[\s\S]*center\.scale\.setScalar\(0\.46\)/
  );
  // Taper mesh points are now shown whenever the taper/depth/twist editor is open on a
  // strand (the old draw-tool auto-switch to select was retired).
  assert.match(source, /hairState\.state\.taperMeshPointsVisible[\s\S]*sculptState\.state\.taperCurveEdit\?\.type === "strand"[\s\S]*\["taperCurve", "depthCurve", "twistCurve"\]\.includes\(sculptState\.state\.taperCurveEdit\.curveKey\)/);
  assert.match(
    source,
    /function rebuildLockGeometry\(lock, options = \{\}\)[\s\S]*taperMeshPointsGroup\.visible && lock\.id === sel\.state\.selectedId[\s\S]*taperEditor\.updateTaperMeshPoints\(\)/
  );
  assert.match(
    source,
    /function beginStrandObjectTransform\(handle\)[\s\S]*taperPreviewLockId[\s\S]*taperMeshPointsPreview:[\s\S]*mesh: taperMeshPointsGroup[\s\S]*function updateStrandObjectTransform\(handle\)[\s\S]*taperMeshPointsPreview\?\.lockId === lock\.id[\s\S]*mesh: taperMeshPointsGroup[\s\S]*function finishStrandObjectTransform\(\)[\s\S]*restoreStrandObjectPreviewMeshes\(edit\)[\s\S]*commitStrandObjectTransform/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function releaseTaperCurveEditorFieldFocus\(\)[\s\S]*deps\.taperCurveEditor\.contains\(focused\)[\s\S]*tag === "input"[\s\S]*focused\.blur\(\)/
  );
  assert.match(source, /taperCurveCanvas\.addEventListener\("pointerdown", \(event\) => \{[\s\S]*taperEditor\.releaseTaperCurveEditorFieldFocus\(\)[\s\S]*pushUndoState\(\)/);
  assert.match(source, /sampleAsymmetricTaperCurve/);
  assert.match(
    source,
    /function selectionModifierCursorAvailable\(\)[\s\S]*sculptState\.state\.viewportEditMode === "strand"[\s\S]*\["select", "move", "rotate", "scale", "relax", "poly"\]\.includes\(sel\.state\.activeTool\)[\s\S]*!sculptState\.state\.altOrbitDrag/
  );
  assert.match(source, /function updateCurvePointTopologyCursor\(event\)/);
  assert.match(
    source,
    /function updateCurvePointTopologyCursor\(event\)[\s\S]*const marqueeAdding = sculptState\.state\.selectionMarqueeDrag\?\.selectionMode === "add"[\s\S]*const marqueeRemoving = sculptState\.state\.selectionMarqueeDrag\?\.selectionMode === "remove"[\s\S]*const inserting = marqueeAdding[\s\S]*event\.shiftKey && !event\.ctrlKey && !event\.altKey && selectionAvailable[\s\S]*event\.shiftKey && !event\.ctrlKey && event\.altKey && topologyAvailable[\s\S]*const removing = marqueeRemoving[\s\S]*event\.ctrlKey && !event\.shiftKey && !event\.altKey && selectionAvailable[\s\S]*event\.shiftKey && event\.ctrlKey && !event\.altKey && topologyAvailable/
  );
  assert.match(
    source,
    /function beginSelectionMarquee\([\s\S]*selectionMarquee\.classList\.add\("hidden"\);[\s\S]*updateCurvePointTopologyCursor\(event\);[\s\S]*function finishSelectionMarquee\([\s\S]*selectionMarqueeDrag = null;[\s\S]*updateCurvePointTopologyCursor\(event\);/
  );
  assert.match(source, /"curve-point-insert-cursor"/);
  assert.match(source, /"curve-point-remove-cursor"/);
  assert.match(source, /window\.addEventListener\("keydown", updateCurvePointTopologyCursor, true\)/);
  assert.match(source, /window\.addEventListener\("keyup", \(event\) => \{[\s\S]*updateCurvePointTopologyCursor\(event\)/);
  assert.match(css, /canvas\.curve-point-insert-cursor[\s\S]*%2B|canvas\.curve-point-insert-cursor[\s\S]*M23 18\.5v8/);
  assert.match(css, /canvas\.curve-point-remove-cursor[\s\S]*M19 22\.5h8/);
  assert.match(
    source,
    /taperCurveSecondary[\s\S]*depthCurveSecondary[\s\S]*asymmetricWidthCurve[\s\S]*asymmetricDepthCurve/
  );
  assert.match(source, /centerAsymmetricProfile:\s*false/);
  assert.match(
    source,
    /taperAsymmetryToggle\.addEventListener\("change"[\s\S]*target\[shapePresets\.taperSecondaryKey\(\)\] = shapePresets\.cloneShapePresetValue/
  );
  assert.match(
    source,
    /centerAsymmetricProfileToggle\.addEventListener\("change"[\s\S]*target\.centerAsymmetricProfile = centerAsymmetricProfileToggle\.checked/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function renderTaperCurveEditor\(\)[\s\S]*visibleCurves[\s\S]*handle\.dataset\.curveSide = side/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function refreshTaperCurveEditorAfterStateRestore\(\)[\s\S]*activeTaperTarget\(\)[\s\S]*taperCurveEdit\.selectedIndex = THREE\.MathUtils\.clamp[\s\S]*renderTaperCurveEditor\(\)/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function retargetOpenTaperCurveEditor\(lock\)[\s\S]*taperCurveEditor\.open[\s\S]*proceduralGuideForLock\(lock\)[\s\S]*taperCurveEdit\.id = nextTarget\.id[\s\S]*updateTaperCurveEditorTargetLabel\(\)[\s\S]*refreshTaperCurveEditorAfterStateRestore\(\)/
  );
  assert.match(
    source,
    /function refreshStrandSelectionConsumers\([\s\S]*const lock = getSelectedLock\(\);[\s\S]*retargetOpenTaperCurveEditor\(lock\)/
  );
  assert.match(
    source,
    /const restoreRefreshes = new RestoreRefreshRegistry\(\)[\s\S]*\.register\("display-visibility", applyDisplayVisibilityFilters\)[\s\S]*\.register\("sculpt-brush-debug", sculptGeom\.refreshSculptBrushDebugAfterStateRestore\)[\s\S]*\.register\("curve-editors", taperEditor\.refreshTaperCurveEditorAfterStateRestore\)[\s\S]*function finalizeStateRestore\(state\)[\s\S]*restoreRefreshes\.run\(\{ state \}\)[\s\S]*function restoreState\(state,[\s\S]*finalizeStateRestore\(state\);[\s\S]*finally/
  );
  // moved to modules/geometry/sculpt-geometry.js
  assert.match(sculptGeometry, /function refreshSculptBrushDebugAfterStateRestore\(\) \{[\s\S]*if \(!deps\.sculptBrushToolActive\(\)\) return;[\s\S]*updateSculptBrushViabilityPlane\(\);[\s\S]*refreshSculptBrushDebugView\(\);/);
  assert.match(source, /taperCurveEdit\.side = event\.target\.dataset\.curveSide === "secondary"/);
  assert.match(css, /\.taper-center-line[\s\S]*stroke: #e62bea/);
  assert.match(css, /\.taper-center-line\.hidden,[\s\S]*\.taper-path-secondary\.hidden[\s\S]*display: none/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function renderTaperPreview\(path, target, curveKey\)[\s\S]*secondaryCurve[\s\S]*previewValueMax[\s\S]*secondaryPath/
  );
  assert.match(css, /\.taper-preview-center[\s\S]*stroke: #e62bea/);
  assert.match(
    css,
    /\.taper-toggle-stack[\s\S]*gap: 4px[\s\S]*\.taper-toggle-stack \.profile-mesh-point-toggle[\s\S]*padding: 5px 8px/
  );
  assert.doesNotMatch(html, /Edit the two sides of this strand dimension independently\./);
  assert.doesNotMatch(html, /Shift interior topology so the profile center follows the mesh midpoint/);
  assert.doesNotMatch(html, /Drag the magenta points across or along the strand/);
  assert.match(
    source,
    /function strandProfileTopologyAt\([\s\S]*profileTopologyCenterWeight\([\s\S]*centerAsymmetricProfile/
  );
  // snapshot copy stays in app.js; the preset source copy moved to
  // modules/io/creation-presets.js
  assert.match(source, /centerAsymmetricProfile[\s\S]*snapshot\.centerAsymmetricProfile/);
  assert.match(creationPresets, /centerAsymmetricProfile: Boolean\(source\.centerAsymmetricProfile\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function addTaperMeshPointsForCurve\(lock, curveKey\)[\s\S]*taperMeshPointFrame[\s\S]*taperMeshPointExtentPerValue[\s\S]*function updateTaperMeshPoints\(\)/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /editingTwist \? "twist" : curveKey === "depthCurve" \? "z" : "x"[\s\S]*target\?\.asymmetricDepthCurve : target\?\.asymmetricWidthCurve[\s\S]*editingTwist \? deps\.branchSweep\.twistMeshGraphAxis\(frame\) : frame\[frameAxis\]/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /nextEdit\.type !== "strand"[\s\S]*function closeTaperCurveEditor/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function beginTaperMeshPointDrag\(event\)[\s\S]*screenExtentPerValue[\s\S]*pushUndoState\(\)/
  );
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor,
    /function updateTaperMeshPointDrag\(event\)[\s\S]*point\.value = THREE\.MathUtils\.clamp[\s\S]*point\.position = THREE\.MathUtils\.clamp[\s\S]*applyTaperCurveEdit\(\)/
  );
  assert.match(source, /renderer\.domElement\.addEventListener\("pointerdown", taperEditor\.beginTaperMeshPointDrag, true\)/);
  assert.match(source, /window\.addEventListener\("pointerup", taperEditor\.finishTaperMeshPointDrag, true\)/);
  assert.match(source, /controls\.enabled = [^\n]*!sculptState\.state\.taperMeshPointDrag/);
  assert.match(source, /transformControls\.enabled = [^\n]*!sculptState\.state\.taperMeshPointDrag/);
  assert.match(css, /\.profile-mesh-point-toggle[\s\S]*accent-color: #58f6ff/);
  assert.match(localization, /"Show points on mesh":/);
  assert.doesNotMatch(localization, /Drag the magenta points across or along the strand/);
  assert.match(localization, /"Asymmetric curve":/);
  assert.doesNotMatch(localization, /Edit the two sides of this strand dimension independently\./);
  assert.doesNotMatch(localization, /Shift interior topology so the profile center follows the mesh midpoint/);
});

test("strand shape exposes a persistent uniform profile rotation", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8")
  ]);

  const [creationPresets] = await Promise.all([
    readFile(new URL("../modules/io/creation-presets.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Rotation <input id="strandRotation" type="range" min="-180" max="180" step="1" value="0" \/><output id="strandRotationValue"/);
  assert.match(source, /const strandCreationDefaults = \{[\s\S]*strandRotation: 0,[\s\S]*twist: 0/);
  assert.match(source, /lock\.strandRotation = THREE\.MathUtils\.clamp\(Number\(base\.strandRotation \?\? 0\), -180, 180\)/);
  assert.match(source, /function strandTwistAt\(lock, t\) \{[\s\S]*degToRad\(Number\(lock\.strandRotation \?\? 0\)\)[\s\S]*Number\(lock\.twist \|\| 0\) \* THREE\.MathUtils\.clamp\(t, 0, 1\)/);
  assert.match(source, /strandRotation: Number\(lock\.strandRotation \?\? 0\),[\s\S]*twist: lock\.twist/);
  assert.match(source, /strandRotation: THREE\.MathUtils\.clamp\(Number\(snapshot\.strandRotation \?\? 0\), -180, 180\)/);
  assert.match(source, /strandRotation: -Number\(lock\.strandRotation \?\? 0\),[\s\S]*twist: -lock\.twist/);
  assert.match(source, /partner\.strandRotation = -Number\(lock\.strandRotation \?\? 0\)/);
  assert.match(source, /setMixedControl\(inputs\.strandRotation, strandRotationValue/);
  assert.match(source, /relativeRotation = Boolean\(lock && key === "strandRotation"\)[\s\S]*currentRotation \+ value - primaryRotation/);
  assert.match(source, /\["widthScale", "depthScale", "profileOffset", "rootScalpOffset", "strandRotation", "twist"/);
  // moved to modules/io/creation-presets.js
  assert.match(creationPresets, /strandRotation: presetNumber\(source\.strandRotation, 0\)/);
});

test("strand shape exposes an undoable signed twist curve envelope", async () => {
  const [html, source, config, curveMath, css, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/core/app-config.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  const [branchSweep, taperEditor, proceduralDuplicate] = await Promise.all([
    readFile(new URL("../modules/geometry/branch-sweep.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/taper-editor.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/procedural-duplicate.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id="twist"[\s\S]*id="strandTwistCurveControl"[\s\S]*data-curve-key="twistCurve"/);
  assert.match(html, /id="strandTwistCurvePreview"/);
  assert.match(config, /DEFAULT_TWIST_CURVE = \[[\s\S]*position: 0, value: 0[\s\S]*position: 1, value: 0/);
  assert.match(config, /TWIST_CURVE_VALUE_MAX = 4500/);
  assert.match(config, /TWIST_CURVE_DISPLAY_RANGE_DEFAULT = 4500/);
  assert.match(curveMath, /export function normalizeEnvelopeCurve\([\s\S]*valueMinimum[\s\S]*valueMaximum/);
  assert.match(curveMath, /export function blendEnvelopeCurves\([\s\S]*sampleTaperCurve/);
  assert.match(source, /lock\.twistCurve = normalizeEnvelopeCurve\([\s\S]*DEFAULT_TWIST_CURVE[\s\S]*-TWIST_CURVE_VALUE_MAX/);
  assert.match(source, /function strandTwistAt\(lock, t\) \{[\s\S]*sampleIntegratedEnvelopeCurve\(lock\.twistCurve \|\| DEFAULT_TWIST_CURVE, t\)/);
  assert.match(source, /function controlPointRotationAt\(lock, t\) \{[\s\S]*sampleArray\(lock\.pointTwists, t\)/);
  assert.match(source, /function strandProfileTwistAt\(lock, t\) \{[\s\S]*sampleIntegratedEnvelopeCurve\(lock\.twistCurve \|\| DEFAULT_TWIST_CURVE, t\)/);
  assert.match(source, /function curveFrameAtPoint\(lock, pointIndex\)[\s\S]*twistAt: \(position\) => controlPointRotationAt\(frameLock, position\)/);
  assert.match(source, /function transportedStrandFrameAt\(lock, curve, t, options = \{\}\)[\s\S]*twistOverrideAt\(clampedT \* step \/ stepCount\)/);
  assert.match(source, /twistCurve: lock\.twistCurve\.map\(\(point\) => \(\{ \.\.\.point, value: -Number\(point\.value \|\| 0\) \}\)\)/);
  assert.match(source, /twistCurve: lock\.twistCurve\.map\(\(point\) => \(\{ \.\.\.point \}\)\)/);
  assert.match(source, /twistCurve: normalizeEnvelopeCurve\([\s\S]*snapshot\.twistCurve/);
  assert.match(curveMath, /export function twistCurveDisplayRange\([\s\S]*defaultRange = 180[\s\S]*authoredMaximum/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /function renderTwistCurvePreview\([\s\S]*twistCurveDisplayRange\([\s\S]*TWIST_CURVE_DISPLAY_RANGE_DEFAULT/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function renderTaperCurveEditor\(\)[\s\S]*editingTwist[\s\S]*taperPointValue\.min = editingTwist[\s\S]*taperPointValue\.max = editingTwist/);
  assert.match(source, /function updateViewportStatsVisibility\(\)[\s\S]*curveEditorOpen = taperCurveEditor\.open[\s\S]*above-curve-editor[\s\S]*editorRect\.top \+ 10/);
  assert.match(css, /\.viewport-stats\.above-curve-editor\s*\{[\s\S]*z-index:\s*41/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function canvasToTaperPoint\([\s\S]*editingTwist[\s\S]*-TWIST_CURVE_VALUE_MAX[\s\S]*TWIST_CURVE_VALUE_MAX/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /taperPointValue\.min = editingTwist \? String\(twistRateUnitsFromDegrees\(-TWIST_CURVE_VALUE_MAX\)\)/);
  assert.match(source, /twistRateDegreesFromUnits\(taperPointValue\.value\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function applyTaperCurveEdit\(\{ interactive = false \} = \{\}\)[\s\S]*item\.twistCurve = deps\.shapePresets\.cloneShapePresetValue\(primaryCurve\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function scheduleTaperCurveEdit\(\)[\s\S]*requestAnimationFrame[\s\S]*applyTaperCurveEdit\(\{ interactive: true \}\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function flushScheduledTaperCurveEdit\(\)[\s\S]*taperCurveEditInteractiveDirty[\s\S]*applyTaperCurveEdit\(\)/);
  assert.match(source, /taperCurveCanvas\.addEventListener\("pointermove", \(event\) => \{[\s\S]*taperEditor\.scheduleTaperCurveEdit\(\)[\s\S]*taperCurveCanvas\.addEventListener\("pointerup", taperEditor\.finishTaperCurveDrag\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /updateTaperMeshPointDrag\(event\)[\s\S]*scheduleTaperCurveEdit\(\)[\s\S]*finishTaperMeshPointDrag[\s\S]*flushScheduledTaperCurveEdit\(\)/);
  assert.match(html, /data-preference-anchor=["']viewportPerformance["'][\s\S]*id=["']viewportPerformance["'][\s\S]*data-twist-curve-preview=["']all["'][^>]*aria-pressed=["']true["'][\s\S]*data-twist-curve-preview=["']active["'][^>]*aria-pressed=["']false["']/);
  assert.match(source, /const TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY = "anime-hair-studio-twist-curve-all-strands-preview"/);
  assert.match(source, /hairState\.state\.twistCurveAllStrandsPreviewEnabled = readStoredBooleanPreference\([\s\S]*TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY,[\s\S]*true[\s\S]*\)/);
  assert.match(source, /function setTwistCurveAllStrandsPreviewEnabled\(enabled,[\s\S]*twistCurvePreviewPreferenceButtons\.forEach[\s\S]*aria-pressed[\s\S]*TWIST_CURVE_ALL_STRANDS_PREVIEW_PREFERENCE_KEY/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /if \(interactive\) \{[\s\S]*if \(deps\.hairState\.twistCurveAllStrandsPreviewEnabled\)[\s\S]*editSelectedLocks[\s\S]*immediate: true[\s\S]*updateTopology: false[\s\S]*\} else \{[\s\S]*deps\.rebuildLockGeometry\(lock/);
  assert.doesNotMatch(source, /gpuTwist|GPU_TWIST|GpuTwist/);
  assert.match(source, /function rebuildLockGeometry\(lock, options = \{\}\)[\s\S]*options\.updateCurveObjects !== false[\s\S]*options\.updateClump !== false/);
  assert.match(source, /taperCurveEdit\.curveKey === "twistCurve"[\s\S]*DEFAULT_TWIST_CURVE/);
  assert.match(source, /taperCurveCanvas\.addEventListener\("pointerdown"[\s\S]*pushUndoState\(\)/);
  // moved to modules/geometry/procedural-duplicate.js
  assert.match(proceduralDuplicate, /blendEnvelopeCurves\([\s\S]*first\.twistCurve[\s\S]*second\.twistCurve/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function taperMeshPointFrame\([\s\S]*curveKey === "twistCurve"[\s\S]*twistAt: \(parameter\) => deps\.controlPointRotationAt\(lock, parameter\)/);
  assert.match(source, /\["taperCurve", "depthCurve", "twistCurve"\]\.includes\(sculptState\.state\.taperCurveEdit\.curveKey\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /editingTwist[\s\S]*target\.twistCurve[\s\S]*sides: \[1\][^\]]*curveSide: "primary"[\s\S]*deps\.branchSweep\.twistMeshPointDistancePerDegree\(lock, point\.position, twistDisplayRange\) \* point\.value/);
  assert.match(source, /sculptState\.state\.taperCurveEdit\.dragDisplayRange = branchSweep\.twistCurveEditing\(\)[\s\S]*TWIST_CURVE_DISPLAY_RANGE_DEFAULT/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /const displayRange = editingTwist[\s\S]*twistCurveDisplayRange\([\s\S]*TWIST_CURVE_DISPLAY_RANGE_DEFAULT/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /valueMinimum: editingTwist \? -TWIST_CURVE_VALUE_MAX : 0,[\s\S]*valueMaximum: editingTwist \? TWIST_CURVE_VALUE_MAX : TAPER_VALUE_MAX/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /point\.value = THREE\.MathUtils\.clamp\([\s\S]*drag\.valueMinimum,[\s\S]*drag\.valueMaximum/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /deps\.taperAsymmetryToggleRow\.classList\.toggle\("hidden", editingTwist \|\| editingProceduralBranch \|\| segmentEditing\)/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /taperMeshPointsToggleRow\.classList\.toggle\([\s\S]*nextEdit\.type !== "strand"/);
  assert.match(source, /const twistMeshCurvePositiveMaterial = new THREE\.LineBasicMaterial\([\s\S]*color: 0x58f6ff/);
  assert.match(source, /const twistMeshCurveNegativeMaterial = new THREE\.LineBasicMaterial\([\s\S]*color: 0xe62bea/);
  assert.match(source, /const twistMeshCurvePositiveFillMaterial = new THREE\.MeshBasicMaterial\([\s\S]*color: 0x176873[\s\S]*opacity: 0\.48/);
  assert.match(source, /const twistMeshCurveNegativeFillMaterial = new THREE\.MeshBasicMaterial\([\s\S]*color: 0x701d62[\s\S]*opacity: 0\.48/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /function addTwistMeshCurvePath\([\s\S]*sampleTaperCurve\(twistCurve, position\)[\s\S]*signedSegments\.positive[\s\S]*signedSegments\.negative/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /function twistMeshGraphAxis\(frame\)[\s\S]*frame\.x\.clone\(\)\.negate\(\)/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /function addTwistMeshCurvePath\([\s\S]*twistMeshGraphAxis\(frame\)[\s\S]*graphAxis/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /const shapeAxis = editingTwist \? deps\.branchSweep\.twistMeshGraphAxis\(frame\) : frame\[axis\]\.clone\(\)[\s\S]*const projectedAxis = shapeAxis\.addScaledVector/);
  assert.doesNotMatch(source, /twistMeshBillboard|updateTwistMeshBillboardForCamera/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /signedFills\.positive[\s\S]*signedFills\.negative[\s\S]*fill\.renderOrder = 33[\s\S]*fill\.raycast = \(\) => \{\}/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /line\.raycast = \(\) => \{\};[\s\S]*line\.userData\.twistMeshCurvePath = sign/);
  assert.match(source, /edge\.visible = lock\.id === sel\.state\.selectedId[\s\S]*hairState\.state\.taperMeshPointsVisible && branchSweep\.twistCurveEditing\(\)[\s\S]*hairState\.state\.moveCurveControlVisibility\.twistCurve/);
  assert.match(css, /\.twist-curve-zero[\s\S]*stroke: #e62bea/);
  assert.match(localization, /"Twist Curve":/);
  assert.match(localization, /"Twist Rate Curve":/);
});

test("dynamic density can add longitudinal loops to support twist curves", async () => {
  const [html, source, curveMath, clumpPresets, localization] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/curve-math.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/clump-brush-presets.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/data/loc-ja.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="groupDynamicDensity"[\s\S]*Twist Density[\s\S]*id="groupTwistDensity"/);
  assert.match(html, /id="strandDynamicDensity"[\s\S]*Twist Density[\s\S]*id="strandTwistDensity"/);
  assert.match(curveMath, /export function adaptiveCurveParameters\([\s\S]*additionalDetailSampler/);
  assert.match(curveMath, /export function twistCurveDensityDetail\([\s\S]*sampleTaperCurve/);
  assert.match(source, /function strandCurveParameters\([\s\S]*twistCurveDensityDetail\([\s\S]*lock\.twistDensity,[\s\S]*segmentLimit/);
  assert.match(source, /const strandCreationDefaults = \{[\s\S]*twistDensity: 0\.5/);
  assert.match(source, /lock\.twistDensity = THREE\.MathUtils\.clamp\(Number\(base\.twistDensity \?\? 0\), 0, 1\)/);
  assert.match(source, /twistDensity: Number\(lock\.twistDensity \?\? 0\)/);
  assert.match(source, /twistDensity: THREE\.MathUtils\.clamp\(Number\(snapshot\.twistDensity \?\? 0\), 0, 1\)/);
  assert.match(source, /partner\.twistDensity = Number\(lock\.twistDensity \?\? 0\)/);
  assert.match(source, /inputs\.twistDensity\.disabled = !strandDynamicDensityInput\.checked/);
  assert.match(source, /groupInputs\.twistDensity\.disabled = !defaults\.dynamicDensity/);
  assert.match(clumpPresets, /"densityAggression",\s*"twistDensity"/);
  assert.match(localization, /"Twist Density":/);
});

test("compatible multi-strand selections share attribute edits", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8")
  ]);

  const [taperEditor, branchSweep, shapePresets] = await Promise.all([
    readFile(new URL("../modules/geometry/taper-editor.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/geometry/branch-sweep.js", import.meta.url), "utf8"),
    readFile(new URL("../modules/io/shape-presets.js", import.meta.url), "utf8"),
  ]);

  assert.match(html, /id="selectedStrandTitle">Selected Strand/);
  assert.match(html, /id="selectedStrandSelectionSummary" class="multi-edit-summary hidden"/);
  assert.match(html, /id="strandShapePanel"[\s\S]*id="strandShapeTitle">Shape<[\s\S]*id="selectedStrandSelectionSummary" class="multi-edit-summary hidden"[\s\S]*id="strandLayerControl"/);
  assert.equal((html.match(/id="selectedStrandSelectionSummary"/g) || []).length, 1);
  assert.match(css, /\.multi-edit-summary\.hidden\s*\{\s*display: none;/);
  assert.match(source, /function compatibleSelectedLocks\(primary = getSelectedLock\(\)\)/);
  assert.match(source, /function selectedEditRoots\(primary = getSelectedLock\(\)\)/);
  assert.match(source, /function editSelectedLocks\(mutator, options = \{\}\)/);
  assert.match(source, /partner && selectedIds\.has\(partner\.id\)[\s\S]*handled\.add\(partner\.id\)/);
  assert.match(source, /function syncMultiStrandInputs\(primary = getSelectedLock\(\)\)/);
  assert.match(source, /Changes apply to all of them/);
  assert.match(source, /inputs\.name\.disabled = multiple/);
  assert.match(source, /function bindLockInput[\s\S]*editSelectedLocks\(applyValue/);
  assert.match(source, /relativeEditValue\(currentDimension, primaryDimension, value/);
  assert.match(source, /relativeDimension = Boolean\(lock && \["widthScale", "depthScale"\]\.includes\(key\)\)/);
  assert.match(source, /dimensionTargets = relativeDimension[\s\S]*selectedLocksInOrder\(\)\.filter\(\(item\) => item\.geometryType !== "poly"\)/);
  assert.match(source, /relativeDimension && key === "widthScale"[\s\S]*setStrandWidthDimension\(item, nextValue\)/);
  assert.match(source, /function setStrandWidthDimension\(target, width\)[\s\S]*target\.baseWidth = nextWidth/);
  assert.match(source, /setMixedControl\([\s\S]*drawStrandBrushSizeInput[\s\S]*values\(\(lock\) => sculptGeom\.editableStrandWidth\(lock\)\)/);
  assert.match(source, /drawStrandBrushSizeInput\.addEventListener\("input"[\s\S]*compatibleSelectedLocks\(selectedLock\)[\s\S]*relativeEditValue\(sculptGeom\.editableStrandWidth\(lock\), primaryWidth, nextWidth[\s\S]*sculptGeom\.applyEditableStrandWidth\(lock, width, null\)[\s\S]*immediate: true, targets/);
  assert.match(source, /function beginStrandWidthEdgeDrag[\s\S]*targetSnapshots: widthTargets\.map/);
  // The edge drag is width-only now (the old dimensionDelta depth/uniform handling was
  // retired); depth edits flow through the depth-curve inputs instead.
  assert.match(source, /function updateStrandWidthEdgeDrag[\s\S]*const widthDelta = nextWidth - drag\.startWidth[\s\S]*sculptGeom\.applyEditableStrandWidth\(target, snapshot\.startWidth \+ widthDelta, snapshot\)/);
  assert.match(source, /function finishStrandWidthEdgeDrag[\s\S]*targetSnapshots\.forEach/);
  assert.match(source, /strandLayerInput\.addEventListener\("change"[\s\S]*editSelectedLocks/);
  assert.match(source, /hairMaterialSelect\.addEventListener\("change"[\s\S]*editSelectedLocks/);
  assert.match(source, /strandDynamicDensityInput\.addEventListener\("change"[\s\S]*editSelectedLocks/);
  // moved to modules/geometry/taper-editor.js
  assert.match(taperEditor, /function applyTaperCurveEdit\(\{ interactive = false \} = \{\}\)[\s\S]*editSelectedLocks/);
  // moved to modules/geometry/branch-sweep.js
  assert.match(branchSweep, /function applySweepProfileEdit\(\)[\s\S]*editSelectedLocks/);
  // moved to modules/io/shape-presets.js
  assert.match(shapePresets, /function applyShapePreset\(select\)[\s\S]*editSelectedLocks/);
  assert.match(source, /Object\.entries\(strandSplitInputs\)[\s\S]*editSelectedLocks/);
  assert.match(source, /hairCardInput\.addEventListener\("change"[\s\S]*editSelectedLocks/);
  assert.match(css, /\.multi-edit-summary[\s\S]*color: #86edf2/);
  assert.match(css, /\.mixed-value[\s\S]*outline:/);
});

test("attached branches draw a persistent projected topology imprint on their parent", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const [branchBridge] = await Promise.all([
    readFile(new URL("../modules/geometry/branch-bridge.js", import.meta.url), "utf8"),
  ]);
  // The projected-profile imprint (projectBranchProfileToParent) and the branch-knife
  // overlay were retired: attached branches now carve a persistent procedural region
  // out of the parent surface mesh (branchBridge.applyBranchRootRegionCarving), which
  // is re-applied on every geometry rebuild and on state restore.
  // moved to modules/geometry/branch-bridge.js
  assert.match(branchBridge, /function applyBranchRootRegionCarving\(lock, geometry\)[\s\S]*const children = deps\.branchChildrenFor\(lock\)[\s\S]*children\.forEach\(\(child\) => \{[\s\S]*branchRootRegionSurface\(child\)/);
  // moved to modules/geometry/branch-bridge.js
  assert.match(branchBridge, /indices\.push\(a, c, b, b, c, d\)[\s\S]*triangleEdgeMasks\.push\(\[0, 1, 1\], \[1, 1, 0\]\)/);
  // Phase F child-bridge gate: multi-zipper (>2 tube) split parents must not attempt
  // fused-grid carving/bridging until the fused grid is validated beyond 2 sections.
  assert.match(
    branchBridge,
    /function applyBranchRootRegionCarving\(lock, geometry\)[\s\S]*splitSectionCount = Array\.isArray\(geometry\?\.userData\?\.splitSections\)[\s\S]*if \(splitSectionCount > 2\) return;/
  );
  assert.match(
    branchBridge,
    /function branchRootRegionSurface\(lock\)[\s\S]*splitSectionCount = Array\.isArray\(geometry\?\.userData\?\.splitSections\)[\s\S]*if \(splitSectionCount > 2\) return null;/
  );
  assert.match(source, /branchBridge\.applyBranchRootRegionCarving\(lock, lock\.mesh\.geometry\)/);
  assert.match(source, /locks\.filter\(\(lock\) => branchHierarchy\.branchChildrenFor\(lock\)\.length\)\.forEach\(\(parent\) => \{[\s\S]*branchBridge\.applyBranchRootRegionCarving\(parent, parent\.mesh\.geometry\)/);
  assert.doesNotMatch(source, /createBranchKnifeOverlayGeometry|syncBranchKnifeOverlay|branchKnifeImprintCount|projectBranchProfileToParent/);
});
