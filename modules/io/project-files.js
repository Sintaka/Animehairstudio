// project-files.js — Save / Export subsystem, extracted from app.js (refactor stage 2b).
// All app.js coupling is injected through createProjectSaveApi(deps):
//   state (get/set): currentProjectName, quickSaveFileHandle, quickSaveFileName,
//     projectSaveInProgress, lastExport, quickExportFileHandle, quickExportInProgress, pendingFileAction
//   state (read-only): importedHeadAsset, importedScalpGuideAsset, referenceImages, locks, STRAND_GROUPS
//   functions: snapshotState, strandCurveParameters, curveSurfaceControllerCurves, safelyRememberRecentProject
import * as THREE from "three";
import { leafWeightAt, leafWeightsValid } from "../geometry/leaf-weights.js?v=20260813-1";
import { cleanFileBaseName, fileNameForAction, normalizeExportContents, fileActionFormat } from "./file-actions.js?v=20260814-12";
import { exportCurvePolyline, exportHairFaces, hairFaceIndices } from "./obj-export.js?v=20260814-12";
import { exportAnimeHairUsda } from "./usda-export.js?v=20260815-1";
import { createHairProject } from "./project-schema.js?v=20260814-12";
import { unfoldHairMesh, gridUvTable, gridUvAt, childUTopologyScale } from "./uv-unfold.js?v=20260815-1";
import { packFamilies } from "./uv-pack.js?v=20260815-1";

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

  function flatTuples(flat, itemSize) {
    if (!flat || !flat.length || !itemSize) return [];
    const tuples = [];
    for (let i = 0; i + itemSize <= flat.length; i += itemSize) {
      tuples.push(flat.slice(i, i + itemSize));
    }
    return tuples;
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

  // ---- unfolded UV meshes（导出时把扫掠网格 UV 展开，再统一纹素密度缩放 + 打包进 UDIM 1001）----
  function kindForLock(lock) {
    if (lock.geometryType === "poly" || lock.geometryType === "braid") return null;
    if (lock.branchRootRegion) return "child";
    if (lock.geometryType === "curve-surface") return lock.curveSurfaceCompoundProfile ? "compound" : "open";
    if (lock.geometryType === "panel" || lock.geometryType === "surface") return "open";
    if (lock.geometryType === "strand" && lock.hairCard) return "open";
    if (lock.geometryType === "strand" && lock.strandSplitEnabled) return "split";
    return "closed";
  }

  // child 切缝列：bridgeSeamCol（背面中线）优先，否则 ringWidthSegments+1+round(W/2)。
  function childSeamCol(geometry) {
    const ringWidthSegments = Math.max(1, Math.round(Number(geometry.userData?.ringWidthSegments || 2)));
    return Math.max(0, Math.round(Number(geometry.userData?.bridgeSeamCol ?? (ringWidthSegments + 1 + Math.round(ringWidthSegments / 2)))));
  }

  function buildUnfoldedMeshes() {
    const unfolded = new Map();
    const uvAt = new Map(); // lock.id -> gridUvTable 弧长表（父发片洞查询用）
    deps.locks.forEach((lock) => {
      const geometry = lock.mesh?.geometry;
      if (!geometry) return;
      const kind = kindForLock(lock);
      if (kind !== "closed" && kind !== "child" && kind !== "split") return;
      const seamCol = kind === "child" ? childSeamCol(geometry) : 0; // split 由 colToSection 内部定
      const table = gridUvTable(geometry, kind, seamCol);
      if (table) uvAt.set(lock.id, table);
    });
    deps.locks.forEach((lock) => {
      const geometry = lock.mesh?.geometry;
      const kind = geometry ? kindForLock(lock) : null;
      if (!geometry || !kind) return;
      let options = { kind };
      if (kind === "child") {
        const seamCol = childSeamCol(geometry);
        const anchors = geometry.userData?.bridgeUvAnchors;
        const parent = deps.locks.find((item) => item.id === lock.branchParentId);
        const parentTable = parent ? uvAt.get(parent.id) : null;
        const parentRows = parent?.mesh?.geometry?.userData?.gridRowIndices;
        const parentCols = parent?.mesh?.geometry?.userData?.gridColIndices;
        const childVLength = (() => {
          const startT = Math.min(1, Math.max(0, Number(lock.branchSweepStartT ?? 0.1)));
          const childLen = new THREE.CatmullRomCurve3(lock.points || []).getLength() * (1 - startT);
          const parentLen = parent?.points?.length >= 2 ? new THREE.CatmullRomCurve3(parent.points).getLength() : 0;
          if (!(childLen > 0) || !(parentLen > 0)) return 1;
          return childLen / parentLen;
        })();
        // 扫掠 UV 顶部对齐桥洞最底端（最靠 -V 方向，即 u 最大侧）再往下留一个扫掠行高
        // 的空隙（poly 高度），不强硬贴洞。
        const regionCross = lock.branchRootRegion?.cross || null;
        const holeUpU = Number(regionCross?.up?.u ?? regionCross?.center?.u ?? lock.branchRootRegion?.center?.u ?? 0.5);
        const holeDownU = Number(regionCross?.down?.u ?? regionCross?.center?.u ?? lock.branchRootRegion?.center?.u ?? 0.5);
        const holeBottomU = Math.min(1, Math.max(0, Math.max(holeUpU, holeDownU)));
        const childGridRows = (() => {
          const gr = geometry.userData?.gridRowIndices;
          if (!gr || !gr.length) return 0;
          let rows = 0;
          for (let i = 0; i < gr.length; i += 1) rows = Math.max(rows, Number(gr[i]) + 1);
          return rows;
        })();
        const rowHeight = childGridRows >= 2 ? childVLength / (childGridRows - 1) : 0;
        const childVStart = Math.min(1, Math.max(0, 1 - holeBottomU - rowHeight));
        // 子发片扫掠 U 拓扑对齐缩放：缩放参考 = 环顶面弧长 ↔ 洞顶 u 跨度
        // （childUTopologyScale），替代刚性 1.1 倍洞宽。
        const topoScale = (Array.isArray(anchors) && parentTable && parentRows && parentCols)
          ? childUTopologyScale(geometry, seamCol, parentTable, parentRows, parentCols, anchors)
          : null;
        let uOffset = 0; let uScale = null;
        if (topoScale) { uOffset = topoScale.uOffset; uScale = topoScale.uScale; }
        // U 布局：外侧顶部（背面）poly 在中间、侧面在中间两侧、最两侧是后面（seam 双副本
        // 0/1）；缩放参考 = 环顶面弧长 ↔ 洞顶 u 跨度（环顶点 0 对齐洞顶 uMin、环顶点 W
        // 对齐洞顶 uMax）。
        // bottom band 现与 top/side 相同插值（洞侧对齐 parent uv）；bottomBandSpan 仍用于
        // childVSweepStart：扫掠起点下移 bottomBandSpan 让位，给桥接留空间。
        const bottomBandSpan = childVLength * 0.5;
        options = {
          kind,
          seamCol,
          childVStart,
          childVLength,
          childVSweepStart: Math.max(0, childVStart - bottomBandSpan),
          uOffset,
          uScale
        };
        if (Array.isArray(anchors) && anchors.length && parentTable) {
          // 子发片桥接表：与展开输出同尺度（uOffset/uScale 拓扑对齐，缩放参考 = 环顶面弧长
          // ↔ 洞顶 u 跨度），洞侧 u = parent 弧长 u（同一尺度）。桥接底带仅中线（seam 列）
          // 双副本竖缝切开（横缝已取消：seam±1 不再双副本）。
          const uvTable = gridUvTable(geometry, "child", seamCol, null, uOffset, uScale);
          if (uvTable) {
            const childGridCols = geometry.userData?.gridColIndices;
            // 环列数 C = 子发片主扫掠网格的环向列数（gridColIndices 最大值 + 1）。
            let C = 0;
            if (childGridCols) {
              for (let i = 0; i < childGridCols.length; i += 1) {
                const col = Number(childGridCols[i]);
                if (Number.isFinite(col) && col >= 0 && col + 1 > C) C = col + 1;
              }
            }
            const rPosOf = (ring) => ((ring - seamCol) % C + C) % C;
            options.passthroughCopyCount = (vertexIndex) => {
              const anchor = anchors[vertexIndex];
              if (!anchor || anchor.band !== "bottom") return 1;
              return (anchor.ring === seamCol) ? 2 : 1; // 仅中线（seam 列）双副本竖缝
            };
            options.passthroughSide = (vertexIndex, face) => {
              const anchor = anchors[vertexIndex];
              if (!anchor || anchor.band !== "bottom") return 0;
              if (anchor.ring !== seamCol) return 0; // 中线专用判定
              const rPos = rPosOf(anchor.ring);
              let cx = -1;
              for (const fx of face) {
                const fCol = Number(childGridCols[fx]);
                let ring = -1;
                if (Number.isFinite(fCol) && fCol >= 0) {
                  ring = fCol;
                } else {
                  const fAnchor = anchors[fx];
                  if (fAnchor && Number.isFinite(fAnchor.ring) && fAnchor.ring >= 0) ring = fAnchor.ring;
                }
                if (ring >= 0 && ring !== anchor.ring) { cx = ring; break; }
              }
              if (cx < 0) return 0;
              const cxPos = rPosOf(cx);
              if (cxPos === (rPos + 1) % C) return 0; // 本顶点是起点（环向小侧）
              if (cxPos === (rPos - 1 + C) % C) return 1; // 本顶点是终点
              return 0;
            };
            options.bridgeUvAt = (vertexIndex, side = 0) => {
              const anchor = anchors[vertexIndex];
              if (!anchor || !parentRows || !parentCols) return null;
              const t = Math.min(1, Math.max(0, Number(anchor.t ?? 1)));
              let holeU = 0;
              let holeV = childVStart;
              if (anchor.hole >= 0) {
                const holeUv = gridUvAt(parentTable, parentRows, parentCols, anchor.hole);
                if (holeUv) { holeU = holeUv[0]; holeV = holeUv[1]; }
                else {
                  const parentRow = Number(parentRows[anchor.hole]);
                  if (Number.isFinite(parentRow) && parentRow >= 0) {
                    holeV = parentTable.rows < 2 ? 0.5 : 1 - parentRow / (parentTable.rows - 1);
                  }
                }
              }
              let ringU = 0;
              if (anchor.ring >= 0 && anchor.ring !== seamCol && uvTable.colU.has(anchor.ring)) {
                ringU = uvTable.colU.get(anchor.ring); // seam±1 现为单副本（横缝已取消）
              } else if (anchor.ring === seamCol) {
                // 中线双副本：side1=终点 u=seamEndU，side0=起点 u=colU(seamCol)。
                ringU = side === 1 ? (uvTable.seamEndU ?? 1) : uvTable.colU.get(seamCol);
              } else {
                ringU = holeU; // ring=-1 纯洞侧顶点
              }
              // top / side / bottom（顶部/侧面/底部统一对齐洞）：u/v 向洞侧插值
              return [ringU + (holeU - ringU) * t, childVStart + (holeV - childVStart) * t];
            };
          }
        }
      }
      const mesh = unfoldHairMesh(geometry, options);
      if (mesh) unfolded.set(lock.id, mesh);
    });
    packUnfoldedUv(unfolded, deps.locks, uvAt);
    return unfolded;
  }

  // 导出时 UV 打包：主发片（closed/split）+ 子发片按真实 3D 尺寸统一缩放（统一纹素密度）
  // 后 shelf-pack 进 UDIM 1001（[0,1]²）。原地修改 buildUnfoldedMeshes 产物（unfolded.uvs）。
  function packUnfoldedUv(unfolded, locks, uvAt) {
    const parentOf = new Map(); // child id -> parent id（branchParentId）
    locks.forEach((lock) => {
      if (lock.branchParentId) parentOf.set(lock.id, lock.branchParentId);
    });
    const families = [];
    locks.forEach((lock) => {
      const kind = kindForLock(lock);
      if (kind !== "closed" && kind !== "split") return;
      const meshes = [];
      const mainMesh = unfolded.get(lock.id);
      if (mainMesh) meshes.push(mainMesh);
      locks.forEach((candidate) => {
        if (parentOf.get(candidate.id) !== lock.id) return;
        const childMesh = unfolded.get(candidate.id);
        if (childMesh) meshes.push(childMesh);
      });
      const length = lock.points?.length >= 2 ? new THREE.CatmullRomCurve3(lock.points).getLength() : 0;
      const circumference = uvAt.get(lock.id)?.circumference || 0;
      families.push({ id: lock.id, meshes, length, circumference });
    });
    packFamilies(families); // 返回值可忽略：uvs 原地修改
  }

  function buildHairObj({ includeMesh = true, includeCurves = true } = {}) {
    let obj = "# Anime Hair Studio mesh and center-curve export\n";
    let vertexOffset = 1;
    let uvOffset = 1;
    const unfoldedMeshes = buildUnfoldedMeshes();
    deps.locks.forEach((lock) => {
      const objectName = lock.name.replace(/[^a-zA-Z0-9_.-]+/g, "_");
      if (includeMesh) {
        obj += `o ${objectName}\n`;
        const geometry = lock.mesh.geometry;
        const unfolded = unfoldedMeshes.get(lock.id);
        if (unfolded) {
          // 展开版：矩形 UV（已统一纹素密度缩放 + 打包进 UDIM 1001）。
          const positions = unfolded.positions;
          const uvs = unfolded.uvs;
          for (let i = 0; i < positions.length; i += 3) {
            obj += `v ${positions[i].toFixed(5)} ${positions[i + 1].toFixed(5)} ${positions[i + 2].toFixed(5)}\n`;
          }
          for (let i = 0; i < uvs.length; i += 2) {
            obj += `vt ${uvs[i].toFixed(6)} ${uvs[i + 1].toFixed(6)}\n`;
          }
          unfolded.faces.forEach((face) => {
            obj += `f ${face.map((index) => `${index + vertexOffset}/${index + uvOffset}`).join(" ")}\n`;
          });
          vertexOffset += positions.length / 3;
          uvOffset += uvs.length / 2;
        } else {
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
    const unfoldedMeshes = buildUnfoldedMeshes();
    deps.locks.forEach((lock) => {
      if (includeMesh) {
        const geometry = lock.mesh.geometry;
        const position = geometry.getAttribute("position");
        if (position) {
          const unfolded = unfoldedMeshes.get(lock.id);
          let mesh;
          if (unfolded) {
            // 展开版：矩形 UV（已打包进 UDIM 1001），grid primvar 照挂展开顶点。
            mesh = {
              name: lock.name,
              group: lock.group || "unassigned",
              layer: lock.layer || "mid",
              points: flatTuples(unfolded.positions, 3),
              normals: flatTuples(unfolded.normals, 3),
              uvs: flatTuples(unfolded.uvs, 2),
              colors: flatTuples(unfolded.colors, 3),
              tangents: flatTuples(unfolded.tangents, 4),
              faces: unfolded.faces.map((face) => [...face])
            };
            mesh.gridRowIndices = Array.from(unfolded.gridRows);
            mesh.gridColIndices = Array.from(unfolded.gridCols);
            if (Number.isInteger(unfolded.uvisland)) mesh.uvisland = unfolded.uvisland;
            if (includeBones && typeof deps.bonesFor === "function") {
              const bones = deps.bonesFor(lock, { locks: deps.locks })
                .filter((bone) => !bone.name.startsWith("child."));
              if (bones.length >= 2) {
                const joints = bones.map((bone) => bone.name);
                const mainCount = joints.filter((name) => name.startsWith("main.")).length;
                const leafWeights = unfolded.leafWeights ?? geometry.userData?.leafWeights ?? geometry.userData?.panelWeights;
                if (leafWeightsValid(leafWeights, mesh.points.length)) {
                  const skelIndices = [];
                  const skelWeights = [];
                  for (let vertex = 0; vertex < mesh.points.length; vertex += 1) {
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
          } else {
            const gridRowIndices = geometry.userData?.gridRowIndices;
            const gridColIndices = geometry.userData?.gridColIndices;
            mesh = {
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
            if (gridRowIndices?.length === position.count && gridColIndices?.length === position.count) {
              mesh.gridRowIndices = Array.from(gridRowIndices);
              mesh.gridColIndices = Array.from(gridColIndices);
            }
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
        await deps.clearAcknowledgedRecovery?.();
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
        await deps.clearAcknowledgedRecovery?.();
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
        await deps.clearAcknowledgedRecovery?.();
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
