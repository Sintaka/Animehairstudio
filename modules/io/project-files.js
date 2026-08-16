// project-files.js — Save / Export subsystem, extracted from app.js (refactor stage 2b).
// All app.js coupling is injected through createProjectSaveApi(deps):
//   state (get/set): currentProjectName, quickSaveFileHandle, quickSaveFileName,
//     projectSaveInProgress, lastExport, quickExportFileHandle, quickExportInProgress, pendingFileAction
//   state (read-only): importedHeadAsset, importedScalpGuideAsset, referenceImages, locks, STRAND_GROUPS
//   functions: snapshotState, strandCurveParameters, curveSurfaceControllerCurves, safelyRememberRecentProject
import * as THREE from "three";
import { leafWeightAt, leafWeightsValid } from "../geometry/leaf-weights.js?v=20260813-1";
import { cleanFileBaseName, fileNameForAction, normalizeExportContents, fileActionFormat } from "./file-actions.js?v=20260816-13";
import { exportCurvePolyline, exportHairFaces, hairFaceIndices } from "./obj-export.js?v=20260814-12";
import { exportAnimeHairUsda, usdIdentifier, quatToMat3, axesToMat3, splitBoneLayout, bridgeRootParentName } from "./usda-export.js?v=20260816-17";
import { createHairProject } from "./project-schema.js?v=20260814-12";
import { unfoldHairMesh, gridUvTable, gridUvAt, childUTopologyScale } from "./uv-unfold.js?v=20260815-1";
import { packFamilies } from "./uv-pack.js?v=20260816-7";

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
    bones: document.querySelector("#exportIncludeBones")
  };
  const exportPathPrefixInput = document.querySelector("#exportPathPrefix");

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
    }
  });
  const fileExportDescriptions = Object.freeze({
    mesh: "Rendered strand and panel geometry",
    curves: "Editable strand center curves",
    bones: "Skeleton and captured skin mesh"
  });
  const fileExportLabels = Object.freeze({
    mesh: "Mesh",
    curves: "Curves",
    bones: "Bones & Capture Mesh"
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

  // panel/surface 用原始几何（含原始 uv）拼成与 unfoldHairMesh 同构的平铺 mesh：
  // 不重算 UV（open 展开会把 panel 中间切开），只做 bbox/缩放/layout 后处理。
  function flatPanelMesh(geometry) {
    const position = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");
    const normal = geometry.getAttribute("normal");
    const color = geometry.getAttribute("color");
    const tangent = geometry.getAttribute("tangent");
    const count = position ? position.count : 0;
    const positions = new Array(count * 3);
    const uvs = new Array(count * 2);
    const normals = normal ? new Array(count * 3) : null;
    const colors = color ? new Array(count * 3) : null;
    const tangents = tangent ? new Array(count * 4) : null;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = position.getX(i);
      positions[i * 3 + 1] = position.getY(i);
      positions[i * 3 + 2] = position.getZ(i);
      uvs[i * 2] = uv ? uv.getX(i) : 0;
      uvs[i * 2 + 1] = uv ? uv.getY(i) : 0;
      if (normals) { normals[i * 3] = normal.getX(i); normals[i * 3 + 1] = normal.getY(i); normals[i * 3 + 2] = normal.getZ(i); }
      if (colors) { colors[i * 3] = color.getX(i); colors[i * 3 + 1] = color.getY(i); colors[i * 3 + 2] = color.getZ(i); }
      if (tangents) { tangents[i * 4] = tangent.getX(i); tangents[i * 4 + 1] = tangent.getY(i); tangents[i * 4 + 2] = tangent.getZ(i); tangents[i * 4 + 3] = tangent.getW(i); }
    }
    return {
      positions,
      uvs,
      faces: (geometry.userData?.quadFaces || []).map((face) => [...face]),
      normals,
      colors,
      tangents,
      gridRows: geometry.userData?.gridRowIndices || null,
      gridCols: geometry.userData?.gridColIndices || null,
      leafWeights: null
    };
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
      // panel/surface 用原始 uv 进 unfolded（不重算 UV，避免 open 展开把 panel 中间切开），
      // 后续 packUnfoldedUv 打包、buildHairObj/buildHairUsda 导出都走这条平铺 mesh。
      if (kind === "open" && (lock.geometryType === "panel" || lock.geometryType === "surface")) {
        const mesh = flatPanelMesh(geometry);
        if (mesh && mesh.positions.length) unfolded.set(lock.id, mesh);
        return;
      }
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

  // 导出时 UV 打包：主发片（closed/split）+ 子发片 + panel/surface（刘海）整片按真实 3D
  // 尺寸统一缩放（统一纹素密度）后 MaxRects 打包进 UDIM 1001（[0,1]²）。原地修改
  // buildUnfoldedMeshes 产物（unfolded.uvs）。
  function packUnfoldedUv(unfolded, locks, uvAt) {
    const parentOf = new Map(); // child id -> parent id（branchParentId）
    locks.forEach((lock) => {
      if (lock.branchParentId) parentOf.set(lock.id, lock.branchParentId);
    });
    const families = [];
    locks.forEach((lock) => {
      const kind = kindForLock(lock);
      if (kind === "closed" || kind === "split") {
        const meshes = [];
        const mainMesh = unfolded.get(lock.id);
        if (mainMesh) meshes.push(mainMesh);
        locks.forEach((candidate) => {
          if (parentOf.get(candidate.id) !== lock.id) return;
          const childMesh = unfolded.get(candidate.id);
          if (childMesh) meshes.push(childMesh);
        });
        const length = lock.points?.length >= 2 ? new THREE.CatmullRomCurve3(lock.points).getLength() : 0;
        const width = uvAt.get(lock.id)?.circumference || 0;
        families.push({ id: lock.id, meshes, length, width });
      } else if (kind === "open" && (lock.geometryType === "panel" || lock.geometryType === "surface")) {
        // panel/surface（刘海）：整片 = 一个原子 bbox（内部 UV 整体展开，不切缝、无 5px 约束），
        // 按真实宽高与其它发丝统一缩放排列；width 不传，由 packFamilies 按 area/length 推导。
        // panel 无子发片，不分组。hairCard / curve-surface 等其它 open/compound 本轮仍不纳入。
        const length = lock.points?.length >= 2 ? new THREE.CatmullRomCurve3(lock.points).getLength() : 0;
        families.push({ id: lock.id, meshes: [unfolded.get(lock.id)].filter(Boolean), length, width: undefined });
      }
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
    // 内部骨骼名（main./split.，来自 bonesFor）→ 发丝名前缀导出关节名：
    //   main.${i}        → ${sanitized}_${i}
    //   split.${k}       → ${sanitized}_split_${k}
    //   split.${k}.tip.${j} → ${sanitized}_split_${k}_tip_${j}
    //   registry custom 骨骼（不以 main./split. 开头）保持原名。
    const jointNameOf = (lock, name) => {
      const sanitized = lockPrefix.get(lock.id);
      if (typeof name === "string" && name.startsWith("main.")) return `${sanitized}_${name.slice(5)}`;
      if (typeof name === "string" && name.startsWith("split.")) return `${sanitized}_${name.replaceAll(".", "_")}`;
      return name;
    };
    // 同名 lock 去重：为每个 lock 生成唯一关节名前缀（同名依次 _2/_3），
    // 合并成一个 Skeleton 后同名 lock 的关节名（${sanitized}_0 等）不再冲突。
    const lockPrefix = new Map();
    const usedPrefixes = new Set();
    deps.locks.forEach((lock) => {
      const base = usdIdentifier(lock.name);
      let prefix = base;
      let suffix = 2;
      while (usedPrefixes.has(prefix)) {
        prefix = `${base}_${suffix}`;
        suffix += 1;
      }
      usedPrefixes.add(prefix);
      lockPrefix.set(lock.id, prefix);
    });
    // 统一 Skeleton：单个 Skeleton "Hair_Skel" + 空关节 "Hair_Root"（x=0 正中线，
    // y/z 取所有发根平均）作为所有发丝的根，main.0 全部 parent 到 Hair_Root。
    const SKEL_NAME = "Hair_Skel";
    const HAIR_ROOT_NAME = "Hair_Root";
    // 收集所有发丝的骨骼（bonesFor 输出，过滤 child.*），存映射后的关节名。
    const lockBoneData = [];
    let allJoints = [{ name: HAIR_ROOT_NAME, parent: null, p: [0, 0, 0], orient: null }];
    if (typeof deps.bonesFor === "function") {
      deps.locks.forEach((lock) => {
        let bones;
        try {
          bones = deps.bonesFor(lock, { locks: deps.locks })
            .filter((bone) => !bone.name.startsWith("child."));
        } catch (error) {
          console.error("bonesFor 失败（跳过该发丝）:", lock.name, error);
          return;
        }
        if (!Array.isArray(bones) || bones.length < 2) return;
        const firstMain = bones.find((bone) => bone.name.startsWith("main."));
        lockBoneData.push({
          lock,
          bones,
          nameMap: new Map(bones.map((bone) => [bone.name, jointNameOf(lock, bone.name)])),
          firstMainName: firstMain ? jointNameOf(lock, firstMain.name) : null
        });
      });
      // Hair_Root 空关节：x=0 正中线，y/z 取所有发根（main.0）平均。
      let rootY = 0;
      let rootZ = 0;
      let rootCount = 0;
      lockBoneData.forEach(({ bones }) => {
        const root = bones.find((bone) => bone.name.startsWith("main."));
        if (root && root.p) { rootY += root.p.y; rootZ += root.p.z; rootCount += 1; }
      });
      allJoints = [{
        name: HAIR_ROOT_NAME,
        parent: null,
        p: rootCount > 0 ? [0, rootY / rootCount, rootZ / rootCount] : [0, 0, 0],
        orient: null
      }];
      // 每个发丝的 main/split/tip 关节，main.0 parent 到 Hair_Root。
      lockBoneData.forEach(({ lock, bones, nameMap, firstMainName }) => {
        // main 链骨骼 orient 由发丝 frame 派生（bonesFor 里 main.0..N 的 orient 是 null，
        // 注释 "geometry-derived by the caller"；这里在导出层从 strandGeometryFrameAt 派生）。
        // 目标轴约定（row-vector，行 = 基向量，scale 恒 1）：z = tangent（向前）、y = up、
        // x = up × tangent（右手系）；split/tip 骨骼用 p 差分 tangent + 父级 up 继承。
        const curve = Array.isArray(lock.points) && lock.points.length >= 2
          ? new THREE.CatmullRomCurve3(lock.points)
          : null;
        const mainCount = bones.filter((bone) => bone.name.startsWith("main.")).length;
        bones.forEach((bone) => {
          const isSplitBone = bone.name.startsWith("split.") && !bone.name.includes(".tip.");
          let parent = null;
          let derivedP = null;
          if (isSplitBone) {
            // split 骨骼：fork parent（暴露部分根部对应的主骨骼）+ 派生位置（段尖/管尖）。
            const layout = splitBoneLayout(lock, bone, {
              mainCount,
              curve,
              strandGeometryFrameAt: deps.strandGeometryFrameAt,
              splitTipForSegment: deps.splitTipForSegment
            });
            if (layout) {
              parent = jointNameOf(lock, `main.${layout.parentMainIndex}`);
              derivedP = layout.p || null;
            }
          }
          if (!parent && bone.name === "main.0" && lock.branchParentId) {
            // 桥接子发片根骨骼：parent 到父发片对应骨骼点（branchParentParameter），不再直接挂 Hair_Root。
            const parentEntry = lockBoneData.find((entry) => entry.lock.id === lock.branchParentId);
            const internalParent = bridgeRootParentName(lock, deps.locks, jointNameOf);
            if (internalParent && parentEntry?.nameMap.has(internalParent)) {
              parent = parentEntry.nameMap.get(internalParent);
            }
          }
          if (!parent) {
            if (bone.parent === "main") parent = firstMainName;      // split 骨骼 parent 到发根 main.0（兜底）
            else if (bone.parent) parent = nameMap.get(bone.parent) ?? bone.parent;
            else parent = HAIR_ROOT_NAME;                            // main.0 parent 到 Hair_Root
          }
          let boneP = bone.p ? [bone.p.x, bone.p.y, bone.p.z] : null;
          if (!boneP && derivedP) boneP = derivedP; // 未创作的 split 骨骼用派生位置（段尖/管尖）
          let orient = bone.orient
            ? quatToMat3([bone.orient.w, bone.orient.x, bone.orient.y, bone.orient.z])
            : null;
          if (!orient) {
            if (bone.name.startsWith("main.") && curve && typeof deps.strandGeometryFrameAt === "function") {
              // main 链：frame.y = tangent（向前，z 轴）、frame.z = up（向上，y 轴），
              // x = up × tangent = -frame.x（frame.x = tangent × up）。
              try {
                const index = Number.parseInt(bone.name.slice(5), 10) || 0;
                const t = mainCount > 1 ? THREE.MathUtils.clamp(index / (mainCount - 1), 0, 1) : 0;
                const frame = deps.strandGeometryFrameAt(lock, curve, t);
                if (frame && frame.y && frame.z) {
                  const tangent = frame.y;
                  const up = frame.z;
                  orient = axesToMat3(
                    {
                      x: up.y * tangent.z - up.z * tangent.y,
                      y: up.z * tangent.x - up.x * tangent.z,
                      z: up.x * tangent.y - up.y * tangent.x
                    },
                    up,
                    tangent
                  );
                }
              } catch (error) {
                // strandGeometryFrameAt 对某些 lock（如 compound/curve-surface）可能抛异常，
                // 派生失败时跳过（orient 保持 identity），不让整个导出失败。
                console.error("骨骼 orient 派生失败（跳过）:", lock.name, error);
              }
            } else {
              // split/tip/其他：p - parent.p 差分 tangent（normalize），up 优先继承父级
              // orient 的 y 轴（9 值矩阵行 1，即 orient[3..5]），父级 orient 为 null 时用
              // 世界 up (0,1,0)；up 投影到 tangent 平面再 normalize（退化时改用 (0,0,1)
              // 投影），保证输出是正交旋转矩阵；x = up × tangent。父级先 push，按导出的
              // parent 名在 allJoints 里查（parent 名在上面已算出）。
              const parentJoint = parent ? allJoints.find((joint) => joint.name === parent) : null;
              const parentP = parentJoint && parentJoint.p ? parentJoint.p : null;
              if (boneP && parentP) {
                const dx = boneP[0] - parentP[0];
                const dy = boneP[1] - parentP[1];
                const dz = boneP[2] - parentP[2];
                const tangentLength = Math.hypot(dx, dy, dz);
                if (tangentLength >= 1e-9) {
                  const tangent = { x: dx / tangentLength, y: dy / tangentLength, z: dz / tangentLength };
                  // up 候选：父级 orient 行 1（y 轴），否则世界 up (0,1,0)。
                  let upX = 0;
                  let upY = 1;
                  let upZ = 0;
                  const parentOrient = parentJoint && parentJoint.orient ? parentJoint.orient : null;
                  if (parentOrient) {
                    upX = parentOrient[3];
                    upY = parentOrient[4];
                    upZ = parentOrient[5];
                  }
                  // 投影到 tangent 平面并 normalize；退化（up ∥ tangent，长度 < 1e-9）
                  // 时改用 (0,0,1) 投影。
                  let projX = upX - (upX * tangent.x + upY * tangent.y + upZ * tangent.z) * tangent.x;
                  let projY = upY - (upX * tangent.x + upY * tangent.y + upZ * tangent.z) * tangent.y;
                  let projZ = upZ - (upX * tangent.x + upY * tangent.y + upZ * tangent.z) * tangent.z;
                  let projLength = Math.hypot(projX, projY, projZ);
                  if (projLength < 1e-9) {
                    const dotZ = tangent.z; // 世界 up (0,1,0) 与 tangent 平行（罕见）
                    projX = -dotZ * tangent.x;
                    projY = -dotZ * tangent.y;
                    projZ = 1 - dotZ * tangent.z;
                    projLength = Math.hypot(projX, projY, projZ);
                  }
                  if (projLength >= 1e-9) {
                    const up = { x: projX / projLength, y: projY / projLength, z: projZ / projLength };
                    orient = axesToMat3(
                      {
                        x: up.y * tangent.z - up.z * tangent.y,
                        y: up.z * tangent.x - up.x * tangent.z,
                        z: up.x * tangent.y - up.y * tangent.x
                      },
                      up,
                      tangent
                    );
                  }
                }
              }
              // 退化（无父级 p / p 差分 < 1e-9 / up 投影失败）→ orient 保持 null（identity 兜底）。
            }
          }
          allJoints.push({
            name: nameMap.get(bone.name),
            parent,
            p: boneP,
            orient
          });
        });
      });
    }
    const globalJointIndex = new Map(allJoints.map((joint, index) => [joint.name, index]));
    // 普通发丝/权重缺失兜底蒙皮：按扫掠行号绑定 main 关节（单影响 [main, 0 权重]）。
    // 无 leafWeights 的普通发丝、或面板 leafWeights 缺失/截断时不再整片放弃蒙皮——
    // 每个顶点都拿到有效 boneCapture，mesh 才能进 Character SkelRoot（usda-export.js
    // 按 hasSkinData 分流）。
    const bindBySweepRow = (mesh, lock, bones, pointCount, gridRowIndices, gridRows) => {
      const mainCount = bones.filter((bone) => bone.name.startsWith("main.")).length;
      let rows = Number(gridRows) || 0;
      if (rows < 2 && gridRowIndices) {
        let maxRow = -1;
        for (let i = 0; i < gridRowIndices.length; i += 1) {
          const row = Number(gridRowIndices[i]);
          if (Number.isFinite(row) && row > maxRow) maxRow = row;
        }
        rows = maxRow + 1; // 面板等无 gridRows 数时退回 gridRowIndices 最大值 + 1
      }
      const skelIndices = [];
      const skelWeights = [];
      for (let vertex = 0; vertex < pointCount; vertex += 1) {
        const row = Math.max(0, gridRowIndices ? Number(gridRowIndices[vertex]) : 0);
        const t = rows >= 2 ? row / (rows - 1) : 0;
        const mainJoint = mainCount > 0
          ? Math.min(mainCount - 1, Math.round(t * (mainCount - 1)))
          : 0;
        const mainIdx = globalJointIndex.get(jointNameOf(lock, `main.${mainJoint}`)) ?? 0;
        skelIndices.push([mainIdx, mainIdx]);
        skelWeights.push([1, 0]);
      }
      mesh.skelRootName = SKEL_NAME;
      mesh.skelIndices = skelIndices;
      mesh.skelWeights = skelWeights;
    };
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
            if (unfolded.gridRows && unfolded.gridCols) {
              mesh.gridRowIndices = Array.from(unfolded.gridRows);
              mesh.gridColIndices = Array.from(unfolded.gridCols);
            }
            if (Number.isInteger(unfolded.uvisland)) mesh.uvisland = unfolded.uvisland;
            if (includeBones && typeof deps.bonesFor === "function") {
              const bones = deps.bonesFor(lock, { locks: deps.locks })
                .filter((bone) => !bone.name.startsWith("child."));
              if (bones.length >= 2) {
                const splitBones = bones.filter((bone) => bone.kind === "split");
                const leafWeights = unfolded.leafWeights ?? geometry.userData?.leafWeights ?? geometry.userData?.panelWeights;
                if (leafWeightsValid(leafWeights, mesh.points.length)) {
                  const skelIndices = [];
                  const skelWeights = [];
                  for (let vertex = 0; vertex < mesh.points.length; vertex += 1) {
                    const w = leafWeightAt(leafWeights, vertex);
                    const main = Math.round(w.mainJoint);
                    const segment = Math.round(w.leafIndex);
                    const weight = Number(w.weight) || 0;
                    // 按名字查全局关节索引：split 之后还有 split.*.tip.* 尖端子骨骼，
                    // 不能用 mainCount + segment 算术定位（名字已映射为发丝名前缀）。
                    const mainIdx = globalJointIndex.get(jointNameOf(lock, `main.${main}`)) ?? 0;
                    const splitName = splitBones[segment] ? jointNameOf(lock, splitBones[segment].name) : null;
                    const splitIdx = splitName ? (globalJointIndex.get(splitName) ?? mainIdx) : mainIdx;
                    if (segment >= 0 && splitName && weight > 0.0001) {
                      skelIndices.push([mainIdx, splitIdx]);
                      skelWeights.push([1 - weight, weight]);
                    } else {
                      skelIndices.push([mainIdx, mainIdx]); // 统一 2 影响，多余权重为 0
                      skelWeights.push([1, 0]);
                    }
                  }
                  mesh.skelRootName = SKEL_NAME;
                  mesh.skelIndices = skelIndices;
                  mesh.skelWeights = skelWeights;
                } else {
                  // 面板/发丝权重缺失或截断：按扫掠行号兜底绑定 main 关节，不放弃蒙皮。
                  bindBySweepRow(mesh, lock, bones, mesh.points.length, mesh.gridRowIndices, geometry.userData?.gridRows);
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
                const splitBones = bones.filter((bone) => bone.kind === "split");
                const leafWeights = geometry.userData?.leafWeights || geometry.userData?.panelWeights;
                if (leafWeightsValid(leafWeights, position.count)) {
                  const skelIndices = [];
                  const skelWeights = [];
                  for (let vertex = 0; vertex < position.count; vertex += 1) {
                    const w = leafWeightAt(leafWeights, vertex);
                    const main = Math.round(w.mainJoint);
                    const segment = Math.round(w.leafIndex);
                    const weight = Number(w.weight) || 0;
                    // 按名字查全局关节索引：split 之后还有 split.*.tip.* 尖端子骨骼，
                    // 不能用 mainCount + segment 算术定位（名字已映射为发丝名前缀）。
                    const mainIdx = globalJointIndex.get(jointNameOf(lock, `main.${main}`)) ?? 0;
                    const splitName = splitBones[segment] ? jointNameOf(lock, splitBones[segment].name) : null;
                    const splitIdx = splitName ? (globalJointIndex.get(splitName) ?? mainIdx) : mainIdx;
                    if (segment >= 0 && splitName && weight > 0.0001) {
                      skelIndices.push([mainIdx, splitIdx]);
                      skelWeights.push([1 - weight, weight]);
                    } else {
                      skelIndices.push([mainIdx, mainIdx]); // 统一 2 影响，多余权重为 0
                      skelWeights.push([1, 0]);
                    }
                  }
                  mesh.skelRootName = SKEL_NAME;
                  mesh.skelIndices = skelIndices;
                  mesh.skelWeights = skelWeights;
                } else {
                  // 面板/发丝权重缺失或截断：按扫掠行号兜底绑定 main 关节，不放弃蒙皮。
                  bindBySweepRow(mesh, lock, bones, position.count, gridRowIndices, geometry.userData?.gridRows);
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
    if (includeBones && typeof deps.bonesFor === "function" && allJoints.length > 1) {
      // 统一 Skeleton：所有发丝的关节（main 链 + split.* + Hair_Root 根）合成一棵
      // 连通骨骼树（Hair_Root 为唯一根，所有 main.0 parent 到它），导出进单个
      // SkelRoot "Character"，Houdini 导入后是一棵完整骨架而非散的 root 树。
      skeletons.push({ name: SKEL_NAME, joints: allJoints });
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
    if (exportPathPrefixInput) {
      // 前缀留空时显示灰色 placeholder（= 文件名），输入后隐藏；上次导出有自定义前缀则回填。
      exportPathPrefixInput.value = deps.lastExport?.rootName || "";
      exportPathPrefixInput.placeholder = cleanFileBaseName(deps.currentProjectName, "anime-hair");
    }
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
      input.checked = supported && fileExportAvailability[key] !== false && (key === "mesh" || key === "curves" || key === "bones");
      label.textContent = fileExportLabels[key];
      description.textContent = supported
        ? fileExportDescriptions[key]
        : `Not supported in ${definition.label}. Use USDA to export.`;
      row.title = input.disabled ? description.textContent : "";
    });
    // "Bones & Capture Mesh" 勾选时 Mesh 灰掉（蒙皮已含捕获网格，避免重复导出）：
    // 上次导出勾选过 bones（且本格式支持）时恢复勾选态，并同步初始禁用 Mesh。
    const bonesInput = exportContentInputs.bones;
    if (bonesInput.checked || (!bonesInput.disabled && deps.lastExport?.contents?.bones)) {
      bonesInput.checked = true;
      exportContentInputs.mesh.disabled = true;
      exportContentInputs.mesh.checked = false;
    }

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
    // rootName = SkelRoot path 前缀（可自定义，默认 = 文件名）。
    const rootName = cleanFileBaseName(exportPathPrefixInput?.value || baseName, baseName);
    try {
      const content = action.format === "obj"
        ? buildHairObj({ includeMesh: contents.mesh, includeCurves: contents.curves })
        : buildHairUsda({
          // Bones & Capture Mesh 隐含包含 mesh（勾 Bones 时 Mesh 复选框灰掉但仍导出）。
          includeMesh: contents.mesh || contents.bones,
          includeCurves: contents.curves,
          includeBones: contents.bones,
          rootName
        });
      let savedName = suggestedName;
      const result = await writeExportThroughFileSystem(content, suggestedName, action.format);
      if (result.handle) {
        deps.quickExportFileHandle = result.handle;
        savedName = fileNameForAction(result.handle.name, action.format);
      } else if (!result.cancelled) {
        downloadTextFile(
          content,
          suggestedName,
          action.format === "usda" ? "model/vnd.usda;charset=utf-8" : "text/plain;charset=utf-8"
        );
      } else {
        return; // 用户取消导出：不下载、不更新 lastExport
      }
      deps.lastExport = {
        format: action.format,
        fileName: savedName,
        rootName,
        contents: {
          mesh: contents.mesh,
          curves: contents.curves,
          bones: contents.bones
        }
      };
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(error);
        window.alert(`The ${action.format.toUpperCase()} export failed: ${error?.message || error}`);
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
    // OBJ 只导出 Mesh：不打开对话框，直接用当前项目名走一次导出。
    performFileAction(
      { format: "obj" },
      cleanFileBaseName(deps.currentProjectName, "anime-hair"),
      { mesh: true, curves: false }
    );
  }

  function exportHairUsda() {
    openFileActionDialog({ format: "usda" });
  }

  async function exportHairProjectQuickly() {
    if (!deps.lastExport) {
      openFileActionDialog({ format: "usda" });
      return;
    }
    if (deps.quickExportInProgress) return;
    const format = deps.lastExport.format;
    const baseName = cleanFileBaseName(deps.currentProjectName, "anime-hair");
    const rootName = deps.lastExport.rootName || baseName;
    const suggestedName = deps.lastExport.fileName || fileNameForAction(baseName, format);
    const contents = deps.lastExport.contents || Object.fromEntries(
      Object.entries(exportContentInputs).map(([key, input]) => [key, input.checked])
    );
    const content = format === "obj"
      ? buildHairObj({ includeMesh: contents.mesh, includeCurves: contents.curves })
      : buildHairUsda({
        includeMesh: contents.mesh || contents.bones,
        includeCurves: contents.curves,
        includeBones: contents.bones,
        rootName
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
    const result = await writeExportThroughFileSystem(content, suggestedName, format);
    if (result.handle) {
      deps.quickExportFileHandle = result.handle;
      deps.lastExport = {
        format,
        fileName: fileNameForAction(result.handle.name, format),
        rootName,
        contents
      };
      return;
    }
    if (!result.cancelled) {
      downloadTextFile(
        content,
        suggestedName,
        format === "usda" ? "model/vnd.usda;charset=utf-8" : "text/plain;charset=utf-8"
      );
    }
  }

  async function writeExportThroughFileSystem(content, suggestedName, format) {
    if (!window.showSaveFilePicker) return { handle: null, cancelled: false };
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
      return { handle, cancelled: false };
    } catch (error) {
      // 用户取消（AbortError）：cancelled=true，调用方不再 fallback 下载。
      if (error?.name === "AbortError") return { handle: null, cancelled: true };
      console.error("Export could not write to the chosen file, falling back to download.", error);
      return { handle: null, cancelled: false };
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
  // "Bones & Capture Mesh" 勾选时 Mesh 自动灰掉（一次性绑定；勾选保留到下次打开，
  // openFileActionDialog 里的初始同步处理跨对话框状态）。
  exportContentInputs.bones.addEventListener("change", () => {
    const bonesInput = exportContentInputs.bones;
    const meshInput = exportContentInputs.mesh;
    if (bonesInput.checked) {
      meshInput.disabled = true;
      meshInput.checked = false;
    } else {
      meshInput.disabled = false;
      meshInput.checked = true; // 取消勾选后恢复 Mesh 可用并默认勾选
    }
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
    downloadProjectFile,
    buildUnfoldedMeshes
  };
}
