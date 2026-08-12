// project-files.js — Save / Export subsystem, extracted from app.js (refactor stage 2b).
// All app.js coupling is injected through createProjectSaveApi(deps):
//   state (get/set): currentProjectName, quickSaveFileHandle, quickSaveFileName,
//     projectSaveInProgress, lastExport, quickExportFileHandle, quickExportInProgress, pendingFileAction
//   state (read-only): importedHeadAsset, importedScalpGuideAsset, referenceImages, locks, STRAND_GROUPS
//   functions: snapshotState, strandCurveParameters, curveSurfaceControllerCurves, safelyRememberRecentProject
import * as THREE from "three";
import { leafWeightAt, leafWeightsValid } from "../geometry/leaf-weights.js?v=20260813-1";
import { cleanFileBaseName, fileNameForAction, normalizeExportContents, fileActionFormat } from "./file-actions.js?v=20260728-1";
import { exportCurvePolyline, exportHairFaces, hairFaceIndices } from "./obj-export.js?v=20260726-1";
import { exportAnimeHairUsda } from "./usda-export.js?v=20260806-4";
import { createHairProject } from "./project-schema.js?v=20260728-2";

export function createProjectSaveApi(deps) {
  // ---- dialog UI elements (document is ready when this runs; app.js loads at body end) ----
  const fileActionDialog = document.querySelector("#fileActionDialog");
  const fileActionForm = document.querySelector("#fileActionForm");
  const fileActionDialogTitle = document.querySelector("#fileActionDialogTitle");
  const fileActionDescription = document.querySelector("#fileActionDescription");
  const fileActionNameInput = document.querySelector("#fileActionName");
  const fileActionExtension = document.querySelector("#fileActionExtension");
  const fileExportContents = document.querySelector("#fileExportContents");
  const projectSaveContents = document.querySelector("#projectSaveContents");
  const projectIncludeHeadAssetInput = document.querySelector("#projectIncludeHeadAsset");
  const projectIncludeReferencesInput = document.querySelector("#projectIncludeReferences");
  const fileActionStatus = document.querySelector("#fileActionStatus");
  const closeFileActionDialogButton = document.querySelector("#closeFileActionDialog");
  const cancelFileActionButton = document.querySelector("#cancelFileAction");
  const confirmFileActionButton = document.querySelector("#confirmFileAction");
  const exportContentInputs = {
    mesh: document.querySelector("#exportIncludeMesh"),
    curves: document.querySelector("#exportIncludeCurves"),
    bones: document.querySelector("#exportIncludeBones"),
    weights: document.querySelector("#exportIncludeWeights")
  };

  const fileExportAvailability = Object.freeze({
    mesh: true,
    curves: true,
    // Bone export is available when the scene has any authored skeleton: authored
    // split sub-bones, authored registry bones, or child-strand (branch) relationships.
    get bones() {
      return deps.locks.some((lock) => (
        (Array.isArray(lock.splitBones) && lock.splitBones.length > 0)
        || (Array.isArray(lock.bones) && lock.bones.length > 0)
        || deps.locks.some((candidate) => candidate.branchParentId === lock.id)
      ));
    },
    weights: false
  });
  const fileExportDescriptions = Object.freeze({
    mesh: "Rendered strand and panel geometry",
    curves: "Editable strand center curves",
    bones: "Available when the scene contains an authored skeleton",
    weights: "Available when mesh skin weights have been authored"
  });
  const fileExportLabels = Object.freeze({
    mesh: "Mesh",
    curves: "Curves",
    bones: "Bones",
    weights: "Weights"
  });

  // ---- pure helpers ----
  function downloadTextFile(content, suggestedName, mimeType = "text/plain;charset=utf-8") {
    const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = suggestedName;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadProjectFile(content, suggestedName) {
    downloadTextFile(content, suggestedName, "application/json;charset=utf-8");
  }

  function bufferAttributeTuples(attribute, itemSize = attribute?.itemSize || 3) {
    if (!attribute) return [];
    return Array.from({ length: attribute.count }, (_, index) => (
      Array.from({ length: itemSize }, (__, component) => Number(attribute.array[(index * attribute.itemSize) + component]))
    ));
  }

  function setProjectSaveButtonsDisabled(disabled) {
    document.querySelector("#saveCurrentPreset").disabled = disabled;
    document.querySelector("#quickSaveProject").disabled = disabled;
  }

  // ---- builders ----
  function buildHairProjectFile(name, {
    includeHeadAsset = true,
    includeReferences = true
  } = {}) {
    const state = deps.snapshotState();
    if (!includeReferences) state.referenceImages = [];
    return createHairProject({
      name,
      state,
      strandGroups: deps.STRAND_GROUPS,
      headAsset: includeHeadAsset ? deps.importedHeadAsset : null,
      headAssetOmitted: Boolean(deps.importedHeadAsset && !includeHeadAsset),
      scalpGuideAsset: deps.importedScalpGuideAsset
    });
  }

  function buildHairObj({ includeMesh = true, includeCurves = true } = {}) {
    let obj = "# Anime Hair Studio mesh and center-curve export\n";
    let vertexOffset = 1;
    let uvOffset = 1;
    deps.locks.forEach((lock) => {
      const objectName = lock.name.replace(/[^a-zA-Z0-9_.-]+/g, "_");
      if (includeMesh) {
        obj += `o ${objectName}\n`;
        const geometry = lock.mesh.geometry;
        const positions = geometry.getAttribute("position");
        const uvs = geometry.getAttribute("uv");
        for (let i = 0; i < positions.count; i += 1) {
          obj += `v ${positions.getX(i).toFixed(5)} ${positions.getY(i).toFixed(5)} ${positions.getZ(i).toFixed(5)}\n`;
        }
        if (uvs) {
          for (let i = 0; i < uvs.count; i += 1) {
            obj += `vt ${uvs.getX(i).toFixed(6)} ${uvs.getY(i).toFixed(6)}\n`;
          }
        }
        obj += exportHairFaces(geometry, vertexOffset, uvOffset);
        vertexOffset += positions.count;
        if (uvs) uvOffset += uvs.count;
      }

      if (includeCurves) {
        if (lock.geometryType !== "poly") {
          const sourceCurves = lock.geometryType === "curve-surface"
            ? deps.curveSurfaceControllerCurves(lock)
            : [lock.points];
          sourceCurves.forEach((points, curveIndex) => {
            if (points.length < 2) return;
            const centerCurve = new THREE.CatmullRomCurve3(points);
            const curveSegmentCount = THREE.MathUtils.clamp(
              Math.max(Number(lock.lengthSegments || 26), points.length * 4),
              8,
              256
            );
            const curveParameters = deps.strandCurveParameters(lock, centerCurve, curveSegmentCount);
            const curvePoints = curveParameters.map((t) => centerCurve.getPoint(t));
            const curveExport = exportCurvePolyline(curvePoints, vertexOffset);
            const suffix = sourceCurves.length > 1 ? `_curve_${curveIndex + 1}` : "_curve";
            obj += `o ${objectName}${suffix}\n${curveExport.text}`;
            vertexOffset += curveExport.vertexCount;
          });
        }
      }
    });
    return obj;
  }

  function buildHairUsda({
    includeMesh = true,
    includeCurves = true,
    includeBones = false,
    includeWeights = false,
    rootName = deps.currentProjectName
  } = {}) {
    const meshes = [];
    const curves = [];
    const skeletons = [];
    deps.locks.forEach((lock) => {
      if (includeMesh) {
        const geometry = lock.mesh.geometry;
        const position = geometry.getAttribute("position");
        if (position) {
          const mesh = {
            name: lock.name,
            group: lock.group || "unassigned",
            layer: lock.layer || "mid",
            points: bufferAttributeTuples(position, 3),
            normals: bufferAttributeTuples(geometry.getAttribute("normal"), 3),
            uvs: bufferAttributeTuples(geometry.getAttribute("uv"), 2),
            colors: bufferAttributeTuples(geometry.getAttribute("color"), 3),
            tangents: bufferAttributeTuples(geometry.getAttribute("tangent"), 4),
            faces: hairFaceIndices(geometry)
          };
          if (includeBones && typeof deps.bonesFor === "function") {
            const bones = deps.bonesFor(lock, { locks: deps.locks })
              .filter((bone) => !bone.name.startsWith("child."));
            if (bones.length >= 2) {
              const joints = bones.map((bone) => bone.name);
              const mainCount = joints.filter((name) => name.startsWith("main.")).length;
              const leafWeights = geometry.userData?.leafWeights || geometry.userData?.panelWeights;
              if (leafWeightsValid(leafWeights, position.count)) {
                const skelIndices = [];
                const skelWeights = [];
                for (let vertex = 0; vertex < position.count; vertex += 1) {
                  const w = leafWeightAt(leafWeights, vertex);
                  const main = Math.round(w.mainJoint);
                  const segment = Math.round(w.leafIndex);
                  const weight = Number(w.weight) || 0;
                  if (segment >= 0 && weight > 0.0001) {
                    skelIndices.push([main, mainCount + segment]);
                    skelWeights.push([1 - weight, weight]);
                  } else {
                    skelIndices.push([main]);
                    skelWeights.push([1]);
                  }
                }
                mesh.skelRootName = (lock.name || "Hair") + " Skeleton";
                mesh.skelJoints = joints;
                mesh.skelIndices = skelIndices;
                mesh.skelWeights = skelWeights;
              }
            }
          }
          meshes.push(mesh);
        }
      }
      if (includeCurves && lock.geometryType !== "poly") {
        const sourceCurves = lock.geometryType === "curve-surface"
          ? deps.curveSurfaceControllerCurves(lock)
          : [lock.points];
        sourceCurves.forEach((points, curveIndex) => {
          if (points.length < 2) return;
          const centerCurve = new THREE.CatmullRomCurve3(points);
          const curveSegmentCount = THREE.MathUtils.clamp(
            Math.max(Number(lock.lengthSegments || 26), points.length * 4),
            8,
            256
          );
          const curveParameters = deps.strandCurveParameters(lock, centerCurve, curveSegmentCount);
          curves.push({
            name: sourceCurves.length > 1 ? `${lock.name} Curve ${curveIndex + 1}` : lock.name,
            group: lock.group || "unassigned",
            layer: lock.layer || "mid",
            width: Math.max(0.001, Number(lock.width || 0.01) * 0.06),
            points: curveParameters.map((t) => centerCurve.getPoint(t).toArray())
          });
        });
      }
    });
    if (includeBones && typeof deps.bonesFor === "function") {
      // One SkelRoot per lock: the lock's own main chain + split sub-bones (child
      // strands export their own skeleton as separate locks).
      deps.locks.forEach((lock) => {
        const bones = deps.bonesFor(lock, { locks: deps.locks })
          .filter((bone) => !bone.name.startsWith("child."));
        if (bones.length < 2) return;
        const firstMain = bones.find((bone) => bone.name.startsWith("main."));
        skeletons.push({
          name: (lock.name || "Hair") + " Skeleton",
          joints: bones.map((bone) => ({
            name: bone.name,
            parent: bone.parent === "main" && firstMain ? firstMain.name : bone.parent,
            p: bone.p ? [bone.p.x, bone.p.y, bone.p.z] : null,
            orient: bone.orient ? [bone.orient.w, bone.orient.x, bone.orient.y, bone.orient.z] : null
          }))
        });
      });
    }
    void includeWeights;
    return exportAnimeHairUsda({
      meshes,
      curves,
      skeletons,
      rootName: rootName || "Anime Hair Studio"
    });
  }

  // ---- dialog ----
  function openFileActionDialog({ format }) {
    const definition = fileActionFormat(format);
    const isExport = definition.exportContents.length > 0;
    deps.pendingFileAction = { format };
    fileActionDialogTitle.textContent = isExport ? `Export ${definition.label}` : "Save Project";
    fileActionDescription.textContent = "Choose the file name and location for the export.";
    fileActionNameInput.value = cleanFileBaseName(
      deps.currentProjectName,
      isExport ? "anime-hair" : "Untitled Hair Project"
    );
    fileActionExtension.textContent = definition.extension;
    fileExportContents.classList.toggle("hidden", !isExport);
    projectSaveContents.classList.toggle("hidden", isExport);
    projectIncludeHeadAssetInput.checked = true;
    projectIncludeHeadAssetInput.disabled = !deps.importedHeadAsset;
    projectIncludeReferencesInput.checked = true;
    projectIncludeReferencesInput.disabled = deps.referenceImages.length === 0;
    fileActionStatus.textContent = "";
    confirmFileActionButton.textContent = isExport ? "Export" : "Save";

    Object.entries(exportContentInputs).forEach(([key, input]) => {
      const row = input.closest("[data-export-content]");
      const supported = definition.exportContents.includes(key);
      const label = row.querySelector("strong");
      const description = row.querySelector("small");
      row.classList.remove("hidden");
      input.disabled = !supported || fileExportAvailability[key] === false;
      input.checked = supported && fileExportAvailability[key] !== false && (key === "mesh" || key === "curves");
      const objPolyline = format === "obj" && key === "curves";
      label.textContent = objPolyline ? "Export Curve as Polyline" : fileExportLabels[key];
      description.textContent = objPolyline
        ? "Not supported in Maya."
        : supported
          ? fileExportDescriptions[key]
          : `Not supported in ${definition.label}. Use USDA to export.`;
      row.title = input.disabled ? description.textContent : "";
    });

    fileActionDialog.showModal();
    requestAnimationFrame(() => {
      fileActionNameInput.focus();
      fileActionNameInput.select();
    });
  }

  async function performFileAction(action, baseName, contents) {
    if (action.format === "project") {
      if (deps.projectSaveInProgress) return;
      deps.projectSaveInProgress = true;
      setProjectSaveButtonsDisabled(true);
      const suggestedName = fileNameForAction(baseName, "project", "Untitled Hair Project");
      const content = `${JSON.stringify(buildHairProjectFile(baseName, {
        includeHeadAsset: contents.headAsset,
        includeReferences: contents.references
      }))}\n`;
      try {
        downloadProjectFile(content, suggestedName);
        deps.currentProjectName = baseName;
        await deps.safelyRememberRecentProject(suggestedName, content);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error(error);
          window.alert("The project could not be saved. Please try again.");
        }
      } finally {
        deps.projectSaveInProgress = false;
        setProjectSaveButtonsDisabled(false);
      }
      return;
    }

    const suggestedName = fileNameForAction(baseName, action.format);
    const content = action.format === "obj"
      ? buildHairObj({ includeMesh: contents.mesh, includeCurves: contents.curves })
      : buildHairUsda({
        includeMesh: contents.mesh,
        includeCurves: contents.curves,
        includeBones: contents.bones,
        includeWeights: contents.weights,
        rootName: baseName
      });
    try {
      let savedName = suggestedName;
      const handle = await writeExportThroughFileSystem(content, suggestedName, action.format);
      if (handle) {
        deps.quickExportFileHandle = handle;
        savedName = fileNameForAction(handle.name, action.format);
      } else {
        downloadTextFile(
          content,
          suggestedName,
          action.format === "usda" ? "model/vnd.usda;charset=utf-8" : "text/plain;charset=utf-8"
        );
      }
      deps.lastExport = {
        format: action.format,
        fileName: savedName,
        contents: {
          mesh: contents.mesh,
          curves: contents.curves,
          bones: contents.bones,
          weights: contents.weights
        }
      };
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(error);
        window.alert(`The ${action.format.toUpperCase()} export could not be written. Please try again.`);
      }
    }
  }

  // ---- save / export entry points ----
  async function saveHairProjectFile() {
    const baseName = cleanFileBaseName(deps.quickSaveFileName || deps.currentProjectName, "Untitled Hair Project");
    const suggestedName = fileNameForAction(baseName, "project", "Untitled Hair Project");
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{
            description: "Anime Hair Studio Project",
            accept: { "application/json": [".ahs", ".animehair.json", ".json"] }
          }]
        });
        const content = `${JSON.stringify(buildHairProjectFile(baseName))}\n`;
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        deps.quickSaveFileHandle = handle;
        const savedName = cleanFileBaseName(handle.name, "Untitled Hair Project");
        deps.quickSaveFileName = savedName;
        deps.currentProjectName = savedName;
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.error("Save as could not write to the chosen file, falling back to download.", error);
      }
    }
    openFileActionDialog({ format: "project" });
  }

  async function saveHairProjectQuickly() {
    if (deps.projectSaveInProgress) return;
    if (deps.quickSaveFileHandle) {
      const baseName = cleanFileBaseName(deps.quickSaveFileName || deps.currentProjectName, "Untitled Hair Project");
      const content = `${JSON.stringify(buildHairProjectFile(baseName))}\n`;
      deps.projectSaveInProgress = true;
      setProjectSaveButtonsDisabled(true);
      try {
        const permission = await deps.quickSaveFileHandle.requestPermission?.({ mode: "readwrite" });
        if (permission === "denied") throw new Error("Write permission was denied.");
        const writable = await deps.quickSaveFileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        deps.currentProjectName = baseName;
        return;
      } catch (error) {
        console.error("Quick Save could not overwrite the last saved file, opening Save As instead.", error);
        deps.quickSaveFileHandle = null;
        deps.quickSaveFileName = null;
      } finally {
        deps.projectSaveInProgress = false;
        setProjectSaveButtonsDisabled(false);
      }
    }
    await saveHairProjectFile();
  }

  function exportHairObj() {
    openFileActionDialog({ format: "obj" });
  }

  function exportHairUsda() {
    openFileActionDialog({ format: "usda" });
  }

  async function exportHairProjectQuickly() {
    if (!deps.lastExport) {
      openFileActionDialog({ format: "obj" });
      return;
    }
    if (deps.quickExportInProgress) return;
    const format = deps.lastExport.format;
    const baseName = cleanFileBaseName(deps.currentProjectName, "anime-hair");
    const suggestedName = deps.lastExport.fileName || fileNameForAction(baseName, format);
    const contents = deps.lastExport.contents || Object.fromEntries(
      Object.entries(exportContentInputs).map(([key, input]) => [key, input.checked])
    );
    const content = format === "obj"
      ? buildHairObj({ includeMesh: contents.mesh, includeCurves: contents.curves })
      : buildHairUsda({
        includeMesh: contents.mesh,
        includeCurves: contents.curves,
        includeBones: contents.bones,
        includeWeights: contents.weights,
        rootName: baseName
      });
    if (deps.quickExportFileHandle) {
      deps.quickExportInProgress = true;
      try {
        const writable = await deps.quickExportFileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return;
      } catch (error) {
        console.error("Quick Export could not overwrite the last export file, choosing a new file instead.", error);
        deps.quickExportFileHandle = null;
      } finally {
        deps.quickExportInProgress = false;
      }
    }
    const handle = await writeExportThroughFileSystem(content, suggestedName, format);
    if (handle) {
      deps.quickExportFileHandle = handle;
      deps.lastExport = {
        format,
        fileName: fileNameForAction(handle.name, format),
        contents
      };
      return;
    }
    downloadTextFile(
      content,
      suggestedName,
      format === "usda" ? "model/vnd.usda;charset=utf-8" : "text/plain;charset=utf-8"
    );
  }

  async function writeExportThroughFileSystem(content, suggestedName, format) {
    if (!window.showSaveFilePicker) return null;
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{
          description: format === "obj" ? "Wavefront OBJ" : "Universal Scene Description",
          accept: format === "obj" ? { "text/plain": [".obj"] } : { "model/vnd.usda": [".usda"] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return handle;
    } catch (error) {
      if (error?.name === "AbortError") return null;
      console.error("Export could not write to the chosen file, falling back to download.", error);
      return null;
    }
  }

  // ---- dialog event wiring (runs once) ----
  fileActionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!deps.pendingFileAction) return;
    const action = deps.pendingFileAction;
    const definition = fileActionFormat(action.format);
    const baseName = cleanFileBaseName(
      fileActionNameInput.value,
      action.format === "project" ? "Untitled Hair Project" : "anime-hair"
    );
    const requested = Object.fromEntries(
      Object.entries(exportContentInputs).map(([key, input]) => [key, input.checked])
    );
    const contents = action.format === "project"
      ? {
          headAsset: projectIncludeHeadAssetInput.checked && !projectIncludeHeadAssetInput.disabled,
          references: projectIncludeReferencesInput.checked && !projectIncludeReferencesInput.disabled
        }
      : normalizeExportContents(action.format, requested, fileExportAvailability);
    if (definition.exportContents.length && !Object.values(contents).some(Boolean)) {
      fileActionStatus.textContent = "Select at least one available item to export.";
      return;
    }
    fileActionDialog.close();
    await performFileAction(action, baseName, contents);
  });

  [closeFileActionDialogButton, cancelFileActionButton].forEach((button) => {
    button.addEventListener("click", () => fileActionDialog.close());
  });
  fileActionDialog.addEventListener("close", () => {
    deps.pendingFileAction = null;
    fileActionStatus.textContent = "";
  });

  return {
    saveHairProjectFile,
    saveHairProjectQuickly,
    exportHairObj,
    exportHairUsda,
    exportHairProjectQuickly,
    setProjectSaveButtonsDisabled,
    openFileActionDialog,
    downloadTextFile,
    downloadProjectFile
  };
}
