// strand-geometry.js - Split strand + base strand/card/compound geometry (refactor 3d batches G2+G3).
// Extracted from app.js; coupling injected via createStrandGeometryApi(deps).
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  remapEnvelopeCurveRange,
  sampleScale,
  smoothSweepChains,
  sweepCurvatureResponse,
  upperProfileArcIndices
} from "./curve-math.js?v=20260813-2";
import { buildConnectedCurveCardGrid, DEFAULT_CURVE_SURFACE_ROWS } from "./curve-surface.js?v=20260731-8";
import { polyMeshBuffers } from "./poly-topology.js?v=20260728-3";
import {
  compoundBridgeArchWeight,
  compoundBridgeParameters,
  compoundConnectedSegmentCount,
  compoundProfileBridgePlan
} from "./compound-strand.js?v=20260806-6";
import { DEFAULT_SWEEP_PROFILE, ROUND_SWEEP_PROFILE } from "../core/app-config.js?v=20260809-2";
import { strandSplitBonesFor, strandTipFor } from "../bones/bone-model.js?v=20260813-1";
import { materializeTipChain, tipChainFrameAt, tipWeightAt, sampleTipPosition } from "./tip-sub-bone.js?v=20260813-1";
import { SWEEP_OVERLAP_DEFAULTS } from "./strand-sweep.js?v=20260813-2";

export function createStrandGeometryApi(deps) {
  // deps: api objects (branchSweep/strandSweep/branchBridge/curveSurfaceCreate/panelTipStrand/
  // branchRootBone) + locks data + app.js helper functions (strandCurveParameters/
  // strandProfileTopologyAt/strandGeometryFrameAt/strandInfluenceColor/strandGeometryCurve/
  // gridProfileSkipCol/outwardNormalAtPoint/proceduralBranchWorldPoints/
  // proceduralBranchTemplatesForGuide/createBraidGeometry); full list:
  // devlog/in-progress/g2-g3-strand-geometry-refactor-map.md section 3.3.
  // Batch-fill point in app.js: after outwardNormalAtPoint (next to the G1 deps batch).

function clipStrandProfilePolygon(points, splitX, keepLeft) {
  const inside = (point) => keepLeft ? point.x <= splitX + 0.000001 : point.x >= splitX - 0.000001;
  const output = [];
  points.forEach((current, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const currentInside = inside(current);
    const previousInside = inside(previous);
    if (currentInside !== previousInside) {
      const denominator = current.x - previous.x;
      const amount = Math.abs(denominator) < 0.000001 ? 0 : (splitX - previous.x) / denominator;
      output.push(new THREE.Vector3(
        splitX,
        0,
        THREE.MathUtils.lerp(previous.z, current.z, amount)
      ));
    }
    if (currentInside) output.push(current.clone());
  });
  return output.filter((point, index, values) => (
    index === 0 || point.distanceToSquared(values[index - 1]) > 0.00000001
  ));
}

function pushOrientedTriangle(indices, vertices, a, b, c, outward) {
  const pointA = new THREE.Vector3(vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2]);
  const pointB = new THREE.Vector3(vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]);
  const pointC = new THREE.Vector3(vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]);
  const normal = pointB.sub(pointA).cross(pointC.sub(pointA));
  if (normal.dot(outward) < 0) indices.push(a, c, b);
  else indices.push(a, b, c);
}

function orientedQuadFace(vertices, a, b, c, d, outward) {
  const pointA = new THREE.Vector3(vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2]);
  const pointB = new THREE.Vector3(vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]);
  const pointC = new THREE.Vector3(vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]);
  const normal = pointB.sub(pointA).cross(pointC.sub(pointA));
  return normal.dot(outward) < 0 ? [a, d, c, b] : [a, b, c, d];
}

function createSplitStrandGeometry(lock, curve, profilePoints) {
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 6, 32);
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const sampleParameters = [
    ...Array.from({ length: radialSegments }, (_, index) => index / radialSegments),
    ...profilePoints.map((_, index) => index / profilePoints.length)
  ].sort((a, b) => a - b).filter((value, index, values) => (
    index === 0 || Math.abs(value - values[index - 1]) > 0.00001
  ));
  const polygon = sampleParameters.map((t) => deps.branchSweep.sampleSweepProfile(profilePoints, t, profileCurve));
  const minX = Math.min(...polygon.map((point) => point.x));
  const maxX = Math.max(...polygon.map((point) => point.x));
  if (!Number.isFinite(minX) || maxX - minX < 0.0001) return null;
  const splitPosition = THREE.MathUtils.clamp(Number(lock.strandSplitPosition ?? 0), -0.8, 0.8);
  const splitX = THREE.MathUtils.lerp(minX, maxX, splitPosition * 0.5 + 0.5);
  const sections = [
    { points: clipStrandProfilePolygon(polygon, splitX, true), direction: -1 },
    { points: clipStrandProfilePolygon(polygon, splitX, false), direction: 1 }
  ].filter((section) => section.points.length >= 3);
  if (sections.length !== 2) return null;

  const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
  const lengthSegments = THREE.MathUtils.clamp(Math.max(Math.round(lock.lengthSegments || 26), curlSegments), 4, 256);
  const curveParameters = deps.strandCurveParameters(lock, curve, lengthSegments);
  const actualLengthSegments = curveParameters.length - 1;
  const strength = THREE.MathUtils.clamp(Number(lock.sweepOverlapStrength ?? SWEEP_OVERLAP_DEFAULTS.strength), 0, 1);
  const safety = Math.max(0.01, Number(lock.sweepOverlapThreshold ?? SWEEP_OVERLAP_DEFAULTS.threshold));
  const overlapFalloff = Math.max(0, Math.min(8, Math.floor(Number(lock.sweepOverlapFalloff ?? SWEEP_OVERLAP_DEFAULTS.falloff) || 0)));
  const edgeSmooth = THREE.MathUtils.clamp(Number(lock.sweepEdgeSmooth ?? SWEEP_OVERLAP_DEFAULTS.edgeSmooth), 0, 1);
  const frames = [];
  let previousFrame = null;
  curveParameters.forEach((t) => {
    const frame = deps.strandGeometryFrameAt(lock, curve, t, previousFrame);
    frames.push(frame);
    previousFrame = frame;
  });

  const vertices = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const triangleEdgeMasks = [];
  const splitHeight = THREE.MathUtils.clamp(Number(lock.strandSplitHeight ?? 0.3), 0.02, 0.8);
  const splitStart = 1 - splitHeight;
  // Route 2: per-tube spread comes from each split bone (relative semantics); the
  // legacy absolute splitGap only derives the default spread so old files keep the
  // same look (default 0.12 -> spread 0.12; opening = baseWidth * spread).
  const baseWidth = Number(lock.baseWidth ?? lock.width ?? 0.16) * Number(lock.widthScale ?? 1);
  const splitBones = strandSplitBonesFor(lock);
  const defaultSplitSpread = THREE.MathUtils.clamp(Number(lock.strandSplitGap ?? 0.12), 0, 0.99);
  const strandSplitWeights = splitBones ? [] : null;
  // Per-vertex leaf weights use the unified [mainJoint, leafIndex, weight] format;
  // mainJoint indexes the main strand bone point nearest to the vertex row (leaf = tube).
  const mainPointCount = Math.max(0, Array.isArray(lock.points) ? lock.points.length : 0);
  let sideTriangleCount = 0;

  // Per-section vertex/face bases so the child-strand bridge can address each tube.
  const sectionBases = [];
  let sectionVertexBase = 0;
  let sectionFaceBase = 0;
  sections.forEach((section) => {
    sectionBases.push({
      base: sectionVertexBase,
      ringSize: section.points.length,
      faceBase: sectionFaceBase
    });
    sectionVertexBase += (actualLengthSegments + 1) * section.points.length;
    sectionFaceBase += actualLengthSegments * section.points.length;
  });

  // Curvature-aware narrowing: per-row spine center + max profile radius feed the
  // shared overlap response; factors narrow the warped offsets in the sweep below.
  const centers = [];
  const radii = [];
  curveParameters.forEach((t) => {
    centers.push(curve.getPoint(t));
    const scaleX = sampleScale(lock.pointScales, t, "x");
    const scaleZ = sampleScale(lock.pointScales, t, "z");
    let rowRadius = 0;
    sections.forEach((section) => {
      const warpedSection = deps.strandProfileTopologyAt(lock, t, section.points, scaleX, scaleZ, polygon);
      for (let column = 0; column < section.points.length; column += 1) {
        const warped = warpedSection[column];
        rowRadius = Math.max(rowRadius, Math.abs(warped.x), Math.abs(warped.z));
      }
    });
    radii.push(rowRadius);
  });
  const { factors, heat } = sweepCurvatureResponse(centers, radii, { strength, safety, falloff: overlapFalloff });

  // Sweep the two tubes (unchanged rendering), but emit ALL side faces before the
  // end caps so quadFaces occupy the front of the index stream (carve-friendly).
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    curveParameters.forEach((t, row) => {
      const point = curve.getPoint(t);
      const frame = frames[row];
      const scaleX = sampleScale(lock.pointScales, t, "x");
      const scaleZ = sampleScale(lock.pointScales, t, "z");
      const warpedSection = deps.strandProfileTopologyAt(
        lock,
        t,
        section.points,
        scaleX,
        scaleZ,
        polygon
      );
      const color = deps.strandInfluenceColor(lock, t);
      const tubeSpread = splitBones
        ? (splitBones[sectionIndex]?.spread ?? defaultSplitSpread)
        : defaultSplitSpread;
      const opening = t <= splitStart
        ? 0
        : baseWidth * tubeSpread * THREE.MathUtils.smoothstep(t, splitStart, 1) * section.direction;
      section.points.forEach((profile, column) => {
        const warped = warpedSection[column];
        const ringPoint = frame.x.clone().multiplyScalar(warped.x * factors[row]);
        ringPoint.add(frame.z.clone().multiplyScalar(warped.z * factors[row]));
        ringPoint.addScaledVector(frame.x, opening);
        vertices.push(point.x + ringPoint.x, point.y + ringPoint.y, point.z + ringPoint.z);
        tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
        uvs.push(column / ringSize, t);
        colors.push(color.r, color.g, color.b);
        const mainJoint = mainPointCount ? Math.round(t * (mainPointCount - 1)) : -1;
        if (strandSplitWeights) strandSplitWeights.push(mainJoint, sectionIndex, tipWeightAt(t, splitStart));
      });
    });

    for (let row = 0; row < actualLengthSegments; row += 1) {
      for (let column = 0; column < ringSize; column += 1) {
        const next = (column + 1) % ringSize;
        const a = sectionStart + row * ringSize + column;
        const b = sectionStart + row * ringSize + next;
        const c = sectionStart + (row + 1) * ringSize + column;
        const d = sectionStart + (row + 1) * ringSize + next;
        indices.push(a, c, b, b, c, d);
        sideTriangleCount += 2;
        triangleEdgeMasks.push([0, 1, 1], [1, 1, 0]);
      }
    }
  });

  // Route 2: per-tube tip sub-bones (strand split). Each tube's rest chain follows its
  // own center line (curve + frame.x * spread opening); authored bone.tip deltas are
  // re-applied by materializeTipChain, then each swept ring blends toward the tip
  // chain's own frame by the t-only tip weight (0 before splitStart, 1 at the strand
  // end). Vertex indices/faces are unchanged (only positions move).
  let tipChains = null;
  if (splitBones) {
    tipChains = sections.map((section, sectionIndex) => {
      const bone = splitBones[sectionIndex] || null;
      const tubeSpread = bone?.spread ?? defaultSplitSpread;
      const direction = section.direction;
      const restPointAt = (t) => {
        let row = 0;
        let bestDistance = Infinity;
        for (let r = 0; r < curveParameters.length; r += 1) {
          const distance = Math.abs(curveParameters[r] - t);
          if (distance < bestDistance) {
            bestDistance = distance;
            row = r;
          }
        }
        const frame = frames[row];
        const point = curve.getPoint(t);
        const opening = t <= splitStart
          ? 0
          : baseWidth * tubeSpread * THREE.MathUtils.smoothstep(t, splitStart, 1) * direction;
        return point.addScaledVector(frame.x, opening);
      };
      const tipCount = Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2);
      return materializeTipChain(bone?.tip || null, restPointAt, tipCount);
    });
    sections.forEach((section, sectionIndex) => {
      const tipChain = tipChains[sectionIndex];
      const ringSize = section.points.length;
      const sectionStart = sectionBases[sectionIndex].base;
      for (let row = 0; row <= actualLengthSegments; row += 1) {
        const t = curveParameters[row];
        const w = tipWeightAt(t, splitStart);
        if (w <= 0) continue;
        const referenceZ = frames[row].z.clone();
        const tipFrame = tipChainFrameAt(tipChain, tipChain, t, referenceZ);
        const tipCenter = sampleTipPosition(tipChain, t);
        const scaleX = sampleScale(lock.pointScales, t, "x");
        const scaleZ = sampleScale(lock.pointScales, t, "z");
        const warpedSection = deps.strandProfileTopologyAt(lock, t, section.points, scaleX, scaleZ, polygon);
        for (let column = 0; column < ringSize; column += 1) {
          const idx = sectionStart + row * ringSize + column;
          const original = new THREE.Vector3(
            vertices[idx * 3],
            vertices[idx * 3 + 1],
            vertices[idx * 3 + 2]
          );
          const warped = warpedSection[column];
          const target = new THREE.Vector3(tipCenter.x, tipCenter.y, tipCenter.z)
            .addScaledVector(tipFrame.x, warped.x)
            .addScaledVector(tipFrame.z, warped.z);
          const final = original.clone().lerp(target, w);
          vertices[idx * 3] = final.x;
          vertices[idx * 3 + 1] = final.y;
          vertices[idx * 3 + 2] = final.z;
        }
      }
    });
  }
  // Edge smoothing: per-tube longitudinal Laplacian over the emitted rings, using
  // curvature heat as per-vertex weights; the root row stays pinned.
  const sweepRows = actualLengthSegments + 1;
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    const sectionVertexStart = sectionStart * 3;
    const sectionVertexEnd = (sectionStart + sweepRows * ringSize) * 3;
    const weights = new Array(sweepRows * ringSize);
    for (let row = 0; row < sweepRows; row += 1) {
      for (let column = 0; column < ringSize; column += 1) {
        weights[row * ringSize + column] = heat[row];
      }
    }
    const sectionVertices = vertices.slice(sectionVertexStart, sectionVertexEnd);
    smoothSweepChains(sectionVertices, sweepRows, ringSize, {
      strength: edgeSmooth,
      iterations: 2,
      weights,
      pinRows: new Set([0])
    });
    for (let i = 0; i < sectionVertices.length; i += 1) {
      vertices[sectionVertexStart + i] = sectionVertices[i];
    }
  });

  const sideFaceCount = sectionFaceBase;
  const quadFaces = [];
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    for (let row = 0; row < actualLengthSegments; row += 1) {
      for (let column = 0; column < ringSize; column += 1) {
        const next = (column + 1) % ringSize;
        const a = sectionStart + row * ringSize + column;
        const b = sectionStart + row * ringSize + next;
        const c = sectionStart + (row + 1) * ringSize + column;
        const d = sectionStart + (row + 1) * ringSize + next;
        quadFaces.push([a, c, d, b]);
      }
    }
  });
  // End caps (triangles) come AFTER every side face so the carve's "faces first" rule holds.
  sections.forEach((section, sectionIndex) => {
    const ringSize = section.points.length;
    const sectionStart = sectionBases[sectionIndex].base;
    const capTriangles = THREE.ShapeUtils.triangulateShape(
      section.points.map((point) => new THREE.Vector2(point.x, point.z)),
      []
    );
    const endOffset = sectionStart + actualLengthSegments * ringSize;
    const startOutward = frames[0].y.clone().negate();
    const tipChain = tipChains ? tipChains[sectionIndex] : null;
    const endOutward = tipChain
      ? tipChainFrameAt(tipChain, tipChain, 1, frames[actualLengthSegments].z.clone()).y
      : frames[actualLengthSegments].y;
    capTriangles.forEach(([a, b, c]) => {
      pushOrientedTriangle(indices, vertices, sectionStart + a, sectionStart + b, sectionStart + c, startOutward);
      pushOrientedTriangle(indices, vertices, endOffset + a, endOffset + b, endOffset + c, endOutward);
      triangleEdgeMasks.push([1, 1, 1], [1, 1, 1]);
    });
  });

  // Fused grid metadata (index-side splice for the child-strand bridge): expose the
  // two tubes as ONE connected quad grid (rows x fusedCols) without touching the
  // rendered two-tube geometry. Each fused column maps to the section that owns that
  // profile point (left -> section0, right -> section1); fused faces crossing from one
  // section to the next are the glued seam quads (faceToRendered = -1).
  const fusedCols = polygon.length;
  const colToSection = [];
  for (let c = 0; c < fusedCols; c += 1) {
    const point = polygon[c];
    const section = point.x <= splitX ? 0 : 1;
    const ring = sections[section].points;
    let col = -1;
    for (let k = 0; k < ring.length; k += 1) {
      if (Math.abs(ring[k].x - point.x) < 1e-4 && Math.abs(ring[k].z - point.z) < 1e-4) { col = k; break; }
    }
    colToSection.push({ section, col: col < 0 ? 0 : col });
  }
  const fusedIndexAt = (r, c) => {
    const entry = colToSection[c];
    const base = sectionBases[entry.section].base;
    const ringSize = sectionBases[entry.section].ringSize;
    return base + r * ringSize + entry.col;
  };
  const faceToRendered = [];
  for (let row = 0; row < actualLengthSegments; row += 1) {
    for (let c = 0; c < fusedCols; c += 1) {
      const c2 = (c + 1) % fusedCols;
      const same = colToSection[c].section === colToSection[c2].section;
      if (same) {
        const section = colToSection[c].section;
        const localCol = colToSection[c].col;
        faceToRendered.push(sectionBases[section].faceBase + row * sectionBases[section].ringSize + localCol);
      } else {
        faceToRendered.push(-1);
      }
    }
  }
  const splitStartRow = Math.max(0, Math.min(actualLengthSegments, Math.round(splitStart * actualLengthSegments)));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  if (strandSplitWeights) {
    // Unified per-vertex leaf weight format [mainJoint, leafIndex, weight] (stride 3);
    // strandSplitWeights stays as a backward-compatible alias of the same array.
    geometry.userData.leafWeights = new Float32Array(strandSplitWeights);
    geometry.userData.strandSplitWeights = geometry.userData.leafWeights;
  }
  geometry.userData.sideTriangleCount = sideTriangleCount;
  geometry.userData.triangleEdgeMasks = triangleEdgeMasks;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.gridRows = actualLengthSegments + 1;
  geometry.userData.gridColumns = fusedCols;
  geometry.userData.gridFacesPerRow = fusedCols;
  geometry.userData.gridSkipCol = -1;
  geometry.userData.splitSections = sectionBases;
  geometry.userData.splitFusedGrid = {
    cols: fusedCols,
    colToSection,
    faceToRendered,
    fusedIndexAt,
    splitStartRow
  };
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createHairCardGeometry(lock, curve, profilePoints) {
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 4, 24);
  const closedTopology = deps.branchSweep.createSweepProfileTopology(profilePoints, radialSegments, profileCurve);
  const arcIndices = upperProfileArcIndices(closedTopology.samples.map((sample) => sample.point));
  const arcSamples = arcIndices.map((index) => closedTopology.samples[index]);
  const arcDistances = [0];
  for (let index = 1; index < arcSamples.length; index += 1) {
    arcDistances.push(arcDistances.at(-1) + arcSamples[index - 1].point.distanceTo(arcSamples[index].point));
  }
  const arcLength = Math.max(0.0001, arcDistances.at(-1));
  let profileVertexCount = 0;
  const profileSamples = arcSamples.map((sample, index) => {
    const interiorHardPoint = sample.hard && index > 0 && index < arcSamples.length - 1;
    const incomingSlot = profileVertexCount++;
    const outgoingSlot = interiorHardPoint ? profileVertexCount++ : incomingSlot;
    return {
      ...sample,
      u: arcDistances[index] / arcLength,
      incomingSlot,
      outgoingSlot
    };
  });
  const profileSlots = Array(profileVertexCount);
  profileSamples.forEach((sample) => {
    profileSlots[sample.incomingSlot] = sample;
    profileSlots[sample.outgoingSlot] = sample;
  });
  const profileEdges = profileSamples.slice(0, -1).map((sample, index) => ({
    start: sample.outgoingSlot,
    end: profileSamples[index + 1].incomingSlot
  }));
  const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
  const lengthSegments = THREE.MathUtils.clamp(
    Math.max(Math.round(lock.lengthSegments || 26), curlSegments),
    4,
    256
  );
  const curveParameters = deps.strandCurveParameters(lock, curve, lengthSegments);
  const actualLengthSegments = curveParameters.length - 1;
  const strength = THREE.MathUtils.clamp(Number(lock.sweepOverlapStrength ?? SWEEP_OVERLAP_DEFAULTS.strength), 0, 1);
  const safety = Math.max(0.01, Number(lock.sweepOverlapThreshold ?? SWEEP_OVERLAP_DEFAULTS.threshold));
  const overlapFalloff = Math.max(0, Math.min(8, Math.floor(Number(lock.sweepOverlapFalloff ?? SWEEP_OVERLAP_DEFAULTS.falloff) || 0)));
  const edgeSmooth = THREE.MathUtils.clamp(Number(lock.sweepEdgeSmooth ?? SWEEP_OVERLAP_DEFAULTS.edgeSmooth), 0, 1);
  const vertices = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const quadFaces = [];
  const profileSlotPoints = profileSlots.map((profileSample) => profileSample.point);
  let previousFrame = null;

  // Curvature-aware narrowing: per-row spine center + max profile radius feed the
  // shared overlap response; factors narrow the warped offsets in the sweep below.
  const centers = [];
  const radii = [];
  curveParameters.forEach((t) => {
    centers.push(curve.getPoint(t));
    const scaleX = sampleScale(lock.pointScales, t, "x");
    const scaleZ = sampleScale(lock.pointScales, t, "z");
    const warpedProfile = deps.strandProfileTopologyAt(lock, t, profileSlotPoints, scaleX, scaleZ);
    let rowRadius = 0;
    for (let index = 0; index < profileSlots.length; index += 1) {
      const warped = warpedProfile[index];
      rowRadius = Math.max(rowRadius, Math.abs(warped.x), Math.abs(warped.z));
    }
    radii.push(rowRadius);
  });
  const { factors, heat } = sweepCurvatureResponse(centers, radii, { strength, safety, falloff: overlapFalloff });

  curveParameters.forEach((t, row) => {
    const point = curve.getPoint(t);
    const frame = deps.strandGeometryFrameAt(lock, curve, t, previousFrame);
    previousFrame = frame;
    const scaleX = sampleScale(lock.pointScales, t, "x");
    const scaleZ = sampleScale(lock.pointScales, t, "z");
    const warpedProfile = deps.strandProfileTopologyAt(lock, t, profileSlotPoints, scaleX, scaleZ);
    const color = deps.strandInfluenceColor(lock, t);
    profileSlots.forEach((profileSample, index) => {
      const warped = warpedProfile[index];
      const vertex = point.clone()
        .addScaledVector(frame.x, warped.x * factors[row])
        .addScaledVector(frame.z, warped.z * factors[row]);
      vertices.push(vertex.x, vertex.y, vertex.z);
      tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
      uvs.push(profileSample.u, t);
      colors.push(color.r, color.g, color.b);
    });
  });

  // Edge smoothing: longitudinal Laplacian over the emitted rings, using curvature
  // heat as per-vertex weights; the root row stays pinned.
  const sweepRows = actualLengthSegments + 1;
  const weights = new Array(sweepRows * profileVertexCount);
  for (let row = 0; row < sweepRows; row += 1) {
    for (let column = 0; column < profileVertexCount; column += 1) {
      weights[row * profileVertexCount + column] = heat[row];
    }
  }
  smoothSweepChains(vertices, sweepRows, profileVertexCount, {
    strength: edgeSmooth,
    iterations: 2,
    weights,
    pinRows: new Set([0])
  });

  for (let row = 0; row < actualLengthSegments; row += 1) {
    profileEdges.forEach((edge) => {
      const a = row * profileVertexCount + edge.start;
      const b = row * profileVertexCount + edge.end;
      const c = (row + 1) * profileVertexCount + edge.start;
      const d = (row + 1) * profileVertexCount + edge.end;
      indices.push(a, c, b, b, c, d);
      quadFaces.push([a, c, d, b]);
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.sideTriangleCount = actualLengthSegments * profileEdges.length * 2;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.gridRows = actualLengthSegments + 1;
  geometry.userData.gridColumns = profileVertexCount;
  geometry.userData.gridFacesPerRow = profileEdges.length;
  geometry.userData.gridSkipCol = deps.gridProfileSkipCol(profileEdges, profileVertexCount);
  geometry.userData.openSurface = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createPolyGeometry(lock) {
  const buffers = polyMeshBuffers(lock.points, lock.polyFaces);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(buffers.positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(buffers.uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(
    Array.from({ length: lock.points.length }, () => [1, 1, 1]).flat(),
    3
  ));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(
    Array.from({ length: lock.points.length }, () => [1, 0, 0, 1]).flat(),
    4
  ));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(
    Array.from({ length: lock.points.length }, () => [0, 1, 0]).flat(),
    3
  ));
  geometry.setIndex(buffers.indices);
  geometry.userData.quadFaces = buffers.quadFaces;
  geometry.userData.triangleQuadIds = buffers.triangleQuadIds;
  geometry.userData.openSurface = true;
  if (buffers.indices.length) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createConnectedCurveCardGeometry(lock) {
  const renderRows = THREE.MathUtils.clamp(
    Math.max(
      Math.round(Number(lock.lengthSegments) || 26) + 1,
      Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS)
    ),
    5,
    257
  );
  const controllers = deps.curveSurfaceCreate.sampledCurveSurfaceControllerCurves(lock, renderRows);
  const controllerSides = deps.curveSurfaceCreate.sampledCurveSurfaceControllerSides(lock, renderRows);
  const grid = buildConnectedCurveCardGrid(controllers, {
    rows: renderRows,
    stripWidth: lock.curveSurfaceStripWidth,
    side: lock.curveSurfaceSide || { x: 1, y: 0, z: 0 },
    controllerSides
  });
  const positions = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const quadFaces = [];
  grid.points.forEach((point, index) => {
    const row = Math.floor(index / Math.max(1, grid.columns));
    const column = index % Math.max(1, grid.columns);
    const previousRow = Math.max(0, row - 1);
    const nextRow = Math.min(grid.rows - 1, row + 1);
    const previous = grid.points[previousRow * grid.columns + column] || point;
    const next = grid.points[nextRow * grid.columns + column] || point;
    const tangent = new THREE.Vector3(next.x - previous.x, next.y - previous.y, next.z - previous.z);
    if (tangent.lengthSq() < 0.000001) tangent.set(0, 1, 0);
    tangent.normalize();
    const color = deps.strandInfluenceColor(lock, row / Math.max(1, grid.rows - 1));
    positions.push(point.x, point.y, point.z);
    tangents.push(tangent.x, tangent.y, tangent.z, 1);
    uvs.push(column / Math.max(1, grid.columns - 1), row / Math.max(1, grid.rows - 1));
    colors.push(color.r, color.g, color.b);
  });
  for (let row = 0; row < grid.rows - 1; row += 1) {
    for (let column = 0; column < grid.columns - 1; column += 1) {
      const a = row * grid.columns + column;
      const b = (row + 1) * grid.columns + column;
      const c = (row + 1) * grid.columns + column + 1;
      const d = row * grid.columns + column + 1;
      indices.push(a, b, c, a, c, d);
      quadFaces.push([a, b, c, d]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.openSurface = true;
  geometry.userData.curveSurfaceControllerCount = grid.controllerCurves.length;
  geometry.userData.actualLengthSegments = Math.max(0, grid.rows - 1);
  if (indices.length) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createCompoundStrandGeometry(lock) {
  const controllerCount = Math.max(1, Math.round(Number(lock.curveSurfaceColumns) || 1));
  const controlRows = Math.max(2, Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS));
  const compoundSide = lock.curveSurfaceSide?.clone?.() || new THREE.Vector3(
    Number(lock.curveSurfaceSide?.x || 1),
    Number(lock.curveSurfaceSide?.y || 0),
    Number(lock.curveSurfaceSide?.z || 0)
  );
  if (compoundSide.lengthSq() < 0.0001) compoundSide.set(1, 0, 0);
  compoundSide.normalize();
  const controllerLocks = Array.from({ length: controllerCount }, (_, index) => (
    deps.curveSurfaceCreate.curveSurfaceControllerFrameLock(lock, index)
  ));
  controllerLocks.forEach((controller, controllerIndex) => {
    const authoredStart = controllerIndex * controlRows;
    controller.pointSurfaceNormals = controller.points.map((point, pointIndex) => {
      const authored = lock.pointSurfaceNormals?.[authoredStart + pointIndex];
      if (authored?.lengthSq?.() > 0.0001) return authored.clone().normalize();
      const previous = controller.points[Math.max(0, pointIndex - 1)] || point;
      const next = controller.points[Math.min(controller.points.length - 1, pointIndex + 1)] || point;
      const tangent = next.clone().sub(previous).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, compoundSide).normalize();
      return normal.lengthSq() > 0.0001 ? normal : deps.outwardNormalAtPoint(point, tangent);
    });
  });
  const controllerCurves = controllerLocks.map((controller) => new THREE.CatmullRomCurve3(
    controller.points,
    false,
    "centripetal",
    0.5
  ));
  if (controllerCurves.length !== 3) return createConnectedCurveCardGeometry(lock);

  const profilePoints = deps.branchSweep.trimmedSweepProfile(
    (lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE)
      .map((point) => ({ ...point, z: point.z + Number(lock.profileOffset || 0) })),
    lock
  );
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 4, 24);
  const profileTopology = deps.branchSweep.createSweepProfileTopology(profilePoints, radialSegments, profileCurve);
  const profileSamples = profileTopology.samples.map((sample) => sample.point);

  const renderRows = THREE.MathUtils.clamp(
    Math.max(
      Math.round(Number(lock.lengthSegments) || 26) + 1,
      Math.round(Number(lock.curveSurfaceRows) || DEFAULT_CURVE_SURFACE_ROWS)
    ),
    5,
    257
  );
  const vertices = [];
  const tangents = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const quadFaces = [];
  const controllerFrames = controllerCurves.map(() => []);
  const previousControllerFrames = controllerCurves.map(() => null);
  for (let row = 0; row < renderRows; row += 1) {
    const t = row / Math.max(1, renderRows - 1);
    controllerCurves.forEach((curve, controllerIndex) => {
      const controllerFrame = deps.strandGeometryFrameAt(
        controllerLocks[controllerIndex],
        curve,
        t,
        previousControllerFrames[controllerIndex]
      );
      controllerFrames[controllerIndex].push(controllerFrame);
      previousControllerFrames[controllerIndex] = controllerFrame;
    });
  }

  const controllerSpanInFrame = controllerFrames[controllerCount - 1][0].point
    .clone()
    .sub(controllerFrames[0][0].point)
    .dot(controllerFrames[0][0].x);
  const bridgeProfileSamples = controllerSpanInFrame >= 0
    ? profileSamples
    : profileSamples.map((point) => ({ x: -point.x, z: point.z }));
  const bridgePlan = compoundProfileBridgePlan(bridgeProfileSamples, controllerCount);
  if (!bridgePlan) return createConnectedCurveCardGeometry(lock);

  const profileCount = profileSamples.length;
  const connectedSegmentCount = compoundConnectedSegmentCount(renderRows - 1);
  const vertexIndex = (row, controllerIndex, profileIndex) => (
    (row * controllerCount + controllerIndex) * profileCount + profileIndex
  );
  for (let row = 0; row < renderRows; row += 1) {
    const t = row / Math.max(1, renderRows - 1);
    const warpedProfiles = controllerLocks.map((controller) => deps.strandProfileTopologyAt(
      controller,
      t,
      profileSamples,
      sampleScale(controller.pointScales, t, "x"),
      sampleScale(controller.pointScales, t, "z")
    ));
    const color = deps.strandInfluenceColor(lock, t);
    warpedProfiles.forEach((profile, controllerIndex) => {
      const frame = controllerFrames[controllerIndex][row];
      const center = frame.point;
      profile.forEach((point, profileIndex) => {
        const vertex = center.clone()
          .addScaledVector(frame.x, point.x)
          .addScaledVector(frame.z, point.z);
        vertices.push(vertex.x, vertex.y, vertex.z);
        tangents.push(frame.y.x, frame.y.y, frame.y.z, 1);
        uvs.push((controllerIndex + profileIndex / profileCount) / controllerCount, t);
        colors.push(color.r, color.g, color.b);
      });
    });
  }

  const bridgeSmoothing = THREE.MathUtils.clamp(Number(lock.compoundBridgeSmoothing) || 0, 0, 1);
  const authoredBridgeLoops = THREE.MathUtils.clamp(
    Math.round(Number(lock.compoundBridgeLoops) || 0),
    0,
    8
  );
  const bridgeParameters = compoundBridgeParameters(
    Math.max(authoredBridgeLoops, bridgeSmoothing > 0 ? 1 : 0)
  );
  const bridgeSegmentCount = bridgeParameters.length - 1;
  const bridgeVertexIndices = bridgePlan.bridges.map((bridge) => (
    Array.from({ length: connectedSegmentCount + 1 }, (_, row) => {
      const leftIndex = vertexIndex(row, bridge.leftController, bridge.leftProfileIndex);
      const rightIndex = vertexIndex(row, bridge.rightController, bridge.rightProfileIndex);
      return bridgeParameters.map((parameter, parameterIndex) => {
        if (parameterIndex === 0) return leftIndex;
        if (parameterIndex === bridgeParameters.length - 1) return rightIndex;
        const leftPosition = new THREE.Vector3(
          vertices[leftIndex * 3],
          vertices[leftIndex * 3 + 1],
          vertices[leftIndex * 3 + 2]
        );
        const rightPosition = new THREE.Vector3(
          vertices[rightIndex * 3],
          vertices[rightIndex * 3 + 1],
          vertices[rightIndex * 3 + 2]
        );
        const tangent = controllerFrames[bridge.leftController][row].y.clone()
          .lerp(controllerFrames[bridge.rightController][row].y, parameter)
          .normalize();
        const bridgeSpan = leftPosition.distanceTo(rightPosition);
        const position = leftPosition.clone().lerp(rightPosition, parameter);
        const archWeight = compoundBridgeArchWeight(
          parameter,
          row / Math.max(1, connectedSegmentCount),
          bridgeSmoothing
        );
        position.addScaledVector(tangent, -bridgeSpan * 0.5 * archWeight);
        const t = row / Math.max(1, renderRows - 1);
        const color = deps.strandInfluenceColor(lock, t);
        const leftU = (bridge.leftController + bridge.leftProfileIndex / profileCount) / controllerCount;
        const rightU = (bridge.rightController + bridge.rightProfileIndex / profileCount) / controllerCount;
        const index = vertices.length / 3;
        vertices.push(position.x, position.y, position.z);
        tangents.push(tangent.x, tangent.y, tangent.z, 1);
        uvs.push(THREE.MathUtils.lerp(leftU, rightU, parameter), t);
        colors.push(color.r, color.g, color.b);
        return index;
      });
    })
  ));

  for (let row = 0; row < renderRows - 1; row += 1) {
    const connectedSection = row < connectedSegmentCount;
    for (let controllerIndex = 0; controllerIndex < controllerCount; controllerIndex += 1) {
      for (let profileIndex = 0; profileIndex < profileCount; profileIndex += 1) {
        if (connectedSection && bridgePlan.removedEdges[controllerIndex].includes(profileIndex)) continue;
        const nextProfile = (profileIndex + 1) % profileCount;
        const a = vertexIndex(row, controllerIndex, profileIndex);
        const b = vertexIndex(row, controllerIndex, nextProfile);
        const c = vertexIndex(row + 1, controllerIndex, profileIndex);
        const d = vertexIndex(row + 1, controllerIndex, nextProfile);
        indices.push(a, c, b, b, c, d);
        quadFaces.push([a, c, d, b]);
      }
    }
    if (connectedSection) {
      bridgePlan.bridges.forEach((bridge, bridgeIndex) => {
        const outward = controllerFrames[bridge.leftController][row].z.clone()
          .add(controllerFrames[bridge.rightController][row].z);
        if (outward.lengthSq() < 0.0001) {
          outward.copy(controllerFrames[bridge.leftController][row].z);
        }
        outward.normalize().multiplyScalar(bridge.surface === "upper" ? 1 : -1);
        for (let segment = 0; segment < bridgeSegmentCount; segment += 1) {
          const a = bridgeVertexIndices[bridgeIndex][row][segment];
          const b = bridgeVertexIndices[bridgeIndex][row][segment + 1];
          const c = bridgeVertexIndices[bridgeIndex][row + 1][segment];
          const d = bridgeVertexIndices[bridgeIndex][row + 1][segment + 1];
          pushOrientedTriangle(indices, vertices, a, c, b, outward);
          pushOrientedTriangle(indices, vertices, b, c, d, outward);
          quadFaces.push([a, c, d, b]);
        }
      });
    }
  }

  for (let seam = 0; seam < controllerCount - 1; seam += 1) {
    const upperBridgeIndex = seam * 2;
    const lowerBridgeIndex = upperBridgeIndex + 1;
    const capOutward = controllerFrames[seam][connectedSegmentCount].y.clone()
      .add(controllerFrames[seam + 1][connectedSegmentCount].y);
    if (capOutward.lengthSq() < 0.0001) {
      capOutward.copy(controllerFrames[seam][connectedSegmentCount].y);
    }
    capOutward.normalize();
    for (let segment = 0; segment < bridgeSegmentCount; segment += 1) {
      const upperLeft = bridgeVertexIndices[upperBridgeIndex][connectedSegmentCount][segment];
      const upperRight = bridgeVertexIndices[upperBridgeIndex][connectedSegmentCount][segment + 1];
      const lowerRight = bridgeVertexIndices[lowerBridgeIndex][connectedSegmentCount][segment + 1];
      const lowerLeft = bridgeVertexIndices[lowerBridgeIndex][connectedSegmentCount][segment];
      const face = orientedQuadFace(
        vertices,
        upperLeft,
        upperRight,
        lowerRight,
        lowerLeft,
        capOutward
      );
      indices.push(face[0], face[1], face[2], face[0], face[2], face[3]);
      quadFaces.push(face);
    }
  }
  const sideTriangleCount = indices.length / 3;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.quadFaces = quadFaces;
  geometry.userData.sideTriangleCount = sideTriangleCount;
  geometry.userData.curveSurfaceControllerCount = controllerCount;
  geometry.userData.actualLengthSegments = renderRows - 1;
  geometry.userData.compoundStrand = true;
  geometry.userData.compoundConnectedSegmentCount = connectedSegmentCount;
  geometry.userData.compoundIndependentControllerFrames = true;
  geometry.userData.compoundBridgeLoops = authoredBridgeLoops;
  geometry.userData.compoundBridgeSmoothing = bridgeSmoothing;
  geometry.userData.compoundBridgeEndCapped = true;
  geometry.userData.openSurface = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function proceduralBranchGeometryLock(parent, template, index) {
  const points = deps.proceduralBranchWorldPoints(parent, template);
  const start = THREE.MathUtils.clamp(Number(template.parameter), 0, 1);
  const width = Math.max(0.02, Number(parent.baseWidth ?? parent.width) * 0.28);
  const branch = {
    ...parent,
    id: `${parent.id || "procedural"}-generated-branch-${index}`,
    proceduralDrawGuide: false,
    proceduralBranchCount: 0,
    points,
    pointSurfaceNormals: [],
    pointScales: points.map(() => ({ x: 1, z: 1 })),
    pointWidths: points.map(() => 1),
    pointTwists: points.map(() => 0),
    baseWidth: width,
    width,
    depth: Math.max(0.02, Number(parent.depth ?? parent.width) * 0.28),
    length: new THREE.CatmullRomCurve3(points).getLength(),
    sweepProfile: ROUND_SWEEP_PROFILE,
    hairCard: false,
    strandSplitEnabled: false,
    surfaceNormalInfluence: 1,
    taperCurve: remapEnvelopeCurveRange(parent.taperCurve, start, 1),
    depthCurve: remapEnvelopeCurveRange(parent.depthCurve, start, 1),
    taperCurveSecondary: remapEnvelopeCurveRange(parent.taperCurveSecondary || parent.taperCurve, start, 1),
    depthCurveSecondary: remapEnvelopeCurveRange(parent.depthCurveSecondary || parent.depthCurve, start, 1)
  };
  branch.pointSurfaceNormals = deps.branchRootBone.stableBranchBaseNormals(branch);
  return branch;
}

function createHairGeometry(lock) {
  if (lock.branchRootRegion) {
    const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
    const parentGeometry = parent?.mesh?.geometry;
    // Topology connect needs a carveable parent grid (normal strand sweep exposing
    // quadFaces/gridRows). Split geometry / hair-card parents have no grid to carve,
    // so the child falls back to direct generation: sweep straight from its root.
    const parentSupportsTopologyConnect = Boolean(
      parentGeometry
      && Number(parentGeometry.userData?.gridRows || 0) >= 2
      && Array.isArray(parentGeometry.userData?.quadFaces)
      && parentGeometry.userData.quadFaces.length > 0
    );
    if (parentSupportsTopologyConnect) {
      const branchChildGeometry = deps.branchBridge.createBranchChildGeometry(lock);
      if (branchChildGeometry) return branchChildGeometry;
    }
  }
  const baseGeometry = createBaseHairGeometry(lock);
  if (!lock?.proceduralDrawGuide || Number(lock.proceduralBranchCount || 0) <= 0 || lock.points?.length < 3) {
    return baseGeometry;
  }
  const templates = deps.proceduralBranchTemplatesForGuide(
    lock,
    lock.proceduralBranchCount,
    lock.proceduralBranchLength,
    lock.proceduralBranchTipOffset
  );
  if (!templates.length) return baseGeometry;
  const geometries = [
    baseGeometry,
    ...templates.map((template, index) => createBaseHairGeometry(
      proceduralBranchGeometryLock(lock, template, index)
    ))
  ];
  const geometry = mergeGeometries(geometries, false);
  if (!geometry) {
    geometries.slice(1).forEach((item) => item.dispose());
    return baseGeometry;
  }
  const sideTriangleCount = geometries.reduce(
    (total, item) => total + Number(item.userData.sideTriangleCount || 0),
    0
  );
  geometries.forEach((item) => item.dispose());
  geometry.userData.sideTriangleCount = sideTriangleCount;
  geometry.userData.proceduralBranchCount = templates.length;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createBaseHairGeometry(lock) {

  if (lock.geometryType === "poly") return createPolyGeometry(lock);
  if (lock.geometryType === "curve-surface") {
    return lock.curveSurfaceCompoundProfile
      ? createCompoundStrandGeometry(lock)
      : createConnectedCurveCardGeometry(lock);
  }
  if (["panel", "surface"].includes(lock.geometryType)) return deps.panelTipStrand.createPanelStrandGeometry(lock);
  if (lock.geometryType === "braid") {
    const braidGeometry = deps.createBraidGeometry(lock);
      if (braidGeometry) return braidGeometry;
  }
  const curve = deps.strandGeometryCurve(lock);
  const baseProfilePoints = (lock.sweepProfile?.length >= 4 ? lock.sweepProfile : DEFAULT_SWEEP_PROFILE)
    .map((point) => ({ ...point, z: point.z + Number(lock.profileOffset || 0) }));
  const profilePoints = deps.branchSweep.trimmedSweepProfile(baseProfilePoints, lock);
  if (lock.geometryType === "strand" && lock.hairCard) return createHairCardGeometry(lock, curve, profilePoints);
  if (lock.geometryType === "strand" && lock.strandSplitEnabled) {
    const splitGeometry = createSplitStrandGeometry(lock, curve, profilePoints);
    if (splitGeometry) return splitGeometry;
  }
  const profileCurve = deps.branchSweep.createSmoothSweepProfileCurve(profilePoints);
  const radialSegments = THREE.MathUtils.clamp(Math.round(lock.radialSegments || 10), 4, 24);
  const profileTopology = deps.branchSweep.createSweepProfileTopology(profilePoints, radialSegments, profileCurve);
  const profileVertexCount = profileTopology.slots.length;
  const profileSlotPoints = profileTopology.slots.map((profileSample) => profileSample.point);
  // Shared sweep kernel: default strand path uses absolute taper scaling from t=0.
  const sweep = deps.strandSweep.sweepSide({
    lock,
    curve,
    profilePoints: profileSlotPoints,
    profileEdges: profileTopology.edges,
    startT: 0,
    seedFrame: null,
    rootRelative: false
  });
  const { vertices, normals, tangents, uvs, colors, indices, quadFaces, actualLengthSegments } = sweep;

  // Route 1: regular-strand single tip sub-bone (strandTip). When strandTip is null
  // (or a row's tip weight is <= 0) the whole path stays identical to the base sweep.
  const authoredStrandTip = (lock.geometryType === "strand" && !lock.strandSplitEnabled) ? strandTipFor(lock) : null;
  const strandTip = authoredStrandTip && authoredStrandTip.active !== false ? authoredStrandTip : null;
  const tipStart = strandTip ? THREE.MathUtils.clamp(Number(lock.strandTipStart ?? 0.75), 0.2, 0.95) : null;
  let tipChain = null;
  let tipFrames = null;
  if (strandTip) {
    // Same lengthSegments derivation as the shared sweep kernel, so the re-projection
    // rows align 1:1 with the swept vertices (tipCurveParameters.length ===
    // actualLengthSegments + 1; both call deps.strandCurveParameters on the same curve).
    const curlSegments = lock.curlEnabled ? Math.ceil(Number(lock.curlCount ?? 4) * 14) : 0;
    const tipLengthSegments = THREE.MathUtils.clamp(Math.max(Math.round(lock.lengthSegments || 26), curlSegments), 4, 256);
    const tipCurveParameters = deps.strandCurveParameters(lock, curve, tipLengthSegments);
    tipFrames = [];
    let tipPrevFrame = null;
    for (let row = 0; row <= actualLengthSegments; row += 1) {
      tipPrevFrame = deps.strandGeometryFrameAt(lock, curve, tipCurveParameters[row], tipPrevFrame);
      tipFrames.push(tipPrevFrame);
    }
    // Tip chain: rest runs along the strand's own center line (curve.getPoint); the
    // authored lock.strandTip deltas are re-applied over that rest by materializeTipChain.
    const tipCount = Math.max(2, Array.isArray(lock.points) ? lock.points.length : 2);
    tipChain = materializeTipChain(strandTip, (t) => curve.getPoint(t), tipCount);
    // Re-project tip rows: blend each swept ring toward the tip chain's own frame by
    // the t-only tip weight (0 before tipStart, 1 at the strand end). Vertex
    // indices/faces are unchanged.
    for (let row = 0; row <= actualLengthSegments; row += 1) {
      const t = tipCurveParameters[row];
      const w = tipWeightAt(t, tipStart);
      if (w <= 0) continue;
      const frame = tipFrames[row];
      const referenceZ = frame.z.clone();
      const tipFrame = tipChainFrameAt(tipChain, tipChain, t, referenceZ);
      const tipCenter = sampleTipPosition(tipChain, t);
      const scaleX = sampleScale(lock.pointScales, t, "x");
      const scaleZ = sampleScale(lock.pointScales, t, "z");
      const warped = deps.strandProfileTopologyAt(lock, t, profileSlotPoints, scaleX, scaleZ);
      for (let column = 0; column < profileVertexCount; column += 1) {
        const idx = row * profileVertexCount + column;
        const original = new THREE.Vector3(vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]);
        const target = new THREE.Vector3(tipCenter.x, tipCenter.y, tipCenter.z)
          .addScaledVector(tipFrame.x, warped[column].x)
          .addScaledVector(tipFrame.z, warped[column].z);
        const final = original.clone().lerp(target, w);
        vertices[idx * 3] = final.x;
        vertices[idx * 3 + 1] = final.y;
        vertices[idx * 3 + 2] = final.z;
      }
    }
  }

  const startPoint = curve.getPoint(0);
  let endPoint = curve.getPoint(1);
  const startCenter = vertices.length / 3;
  vertices.push(startPoint.x, startPoint.y, startPoint.z);
  normals.push(0, 1, 0);
  const startFrame = deps.strandGeometryFrameAt(lock, curve, 0);
  tangents.push(startFrame.x.x, startFrame.x.y, startFrame.x.z, 1);
  uvs.push(0.5, 0);
  const startColor = deps.strandInfluenceColor(lock, 0);
  colors.push(startColor.r, startColor.g, startColor.b);
  const endCenter = vertices.length / 3;
  let endFrame = deps.strandGeometryFrameAt(lock, curve, 1);
  // Tip end cap: the cap center and outward follow the tip chain end (length edits
  // may extend past the rest curve end). startPoint/startFrame stay on the rest curve.
  if (strandTip && tipFrames && tipChain) {
    const tipEndReferenceZ = tipFrames[actualLengthSegments].z.clone();
    const tipEndFrame = tipChainFrameAt(tipChain, tipChain, 1, tipEndReferenceZ);
    const tipEndPoint = sampleTipPosition(tipChain, 1);
    endPoint = new THREE.Vector3(tipEndPoint.x, tipEndPoint.y, tipEndPoint.z);
    endFrame = tipEndFrame;
  }
  vertices.push(endPoint.x, endPoint.y, endPoint.z);
  normals.push(0, -1, 0);
  tangents.push(endFrame.x.x, endFrame.x.y, endFrame.x.z, 1);
  uvs.push(0.5, 1);
  const endColor = deps.strandInfluenceColor(lock, 1);
  colors.push(endColor.r, endColor.g, endColor.b);

  profileTopology.edges.forEach((edge) => {
    const a = edge.start;
    const b = edge.end;
    const c = actualLengthSegments * profileVertexCount + edge.start;
    const d = actualLengthSegments * profileVertexCount + edge.end;
    pushOrientedTriangle(indices, vertices, startCenter, a, b, startFrame.y.clone().negate());
    pushOrientedTriangle(indices, vertices, endCenter, c, d, endFrame.y);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("tangent", new THREE.Float32BufferAttribute(tangents, 4));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.userData.sideTriangleCount = actualLengthSegments * profileTopology.edges.length * 2;
  geometry.userData.actualLengthSegments = actualLengthSegments;
  geometry.userData.gridRows = actualLengthSegments + 1;
  geometry.userData.gridColumns = profileTopology.slots.length;
  geometry.userData.gridFacesPerRow = profileTopology.edges.length;
  geometry.userData.gridSkipCol = deps.gridProfileSkipCol(profileTopology.edges, profileTopology.slots.length);
  geometry.userData.quadFaces = quadFaces;
  geometry.computeVertexNormals();
  return geometry;
}

  return {
    clipStrandProfilePolygon,
    pushOrientedTriangle,
    orientedQuadFace,
    createSplitStrandGeometry,
    createHairCardGeometry,
    createPolyGeometry,
    createConnectedCurveCardGeometry,
    createCompoundStrandGeometry,
    proceduralBranchGeometryLock,
    createHairGeometry,
    createBaseHairGeometry
  };
}
