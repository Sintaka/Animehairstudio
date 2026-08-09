// branch-hierarchy.js — child-strand hierarchy tree (refactor 3d-3d).
// Extracted from app.js; coupling injected via createBranchHierarchyApi(deps).
import * as THREE from "three";

export function createBranchHierarchyApi(deps) {
  // deps: curveFrameAtPoint, getSelectedLock, strandControlPointHitFromEvent,
  //   syncLockFromCurve, updateLockGeometry, locks, branchState, selState,
  //   branchRootRegionFromParam, applyBranchRootOffset, captureBranchLocalState,
  //   ensureBranchParentNormalField, branchParentFrame, branchWorldVector

function attachDrawnLocksAsBranches(stroke, created) {
  const parent = deps.locks.find((lock) => lock.id === stroke.branchSourceLockId);
  if (!canBranchDrawFromLock(parent) || !created.length) return null;
  branchRootBone.deps.ensureBranchParentNormalField(parent);
  const parameter = THREE.MathUtils.clamp(
    Number(stroke.branchSourcePointIndex || 0) / Math.max(1, parent.points.length - 1),
    0,
    1
  );
  created.forEach((lock) => {
    lock.branchParentId = parent.id;
    lock.branchParentParameter = parameter;
    delete lock.clumpShapeCurveInheritance;
    lock.branchRootRegion = branchRegion.deps.branchRootRegionFromParam(parameter);
    branchRootBone.deps.captureBranchLocalState(lock);
  });
  updateBranchChildren(parent);
  return parent;
}

function branchChildrenFor(parent) {
  return parent ? deps.locks.filter((lock) => lock.branchParentId === parent.id) : [];
}

function detachBranch(lock) {
  if (!lock) return;
  delete lock.branchParentId;
  delete lock.branchParentParameter;
  delete lock.branchLocalPoints;
  delete lock.branchLocalSurfaceNormals;
  delete lock.branchRootRegion;
  delete lock.proceduralBranch;
  delete lock.proceduralBranchIndex;
}

function updateBranchChildren(parent) {
  const children = branchChildrenFor(parent);
  if (!children.length || !parent?.points?.length) return;
  deps.branchState.branchUpdateInProgress = true;
  try {
    children.forEach((child) => {
      if (!child.branchLocalPoints?.length || !child.branchLocalSurfaceNormals?.length) {
        branchRootBone.deps.captureBranchLocalState(child);
      }
      const frame = branchRootBone.deps.branchParentFrame(parent, child.branchParentParameter);
      child.pointSurfaceNormals ||= [];
      child.points.forEach((point, index) => {
        const local = child.branchLocalPoints?.[index] || child.branchLocalPoints?.at(-1) || new THREE.Vector3();
        point.copy(frame.point).add(branchRootBone.deps.branchWorldVector(local, frame));
        const localNormal = child.branchLocalSurfaceNormals?.[index];
        if (localNormal) {
          child.pointSurfaceNormals[index] = branchRootBone.deps.branchWorldVector(localNormal, frame).normalize();
        }
      });
      const start = THREE.MathUtils.clamp(Number(child.branchParentParameter ?? 0), 0, 1);
      if (!child.branchCurvesAuthored) {
        child.taperCurve = remapEnvelopeCurveRange(parent.taperCurve, start, 1);
        child.depthCurve = remapEnvelopeCurveRange(parent.depthCurve, start, 1);
        child.taperCurveSecondary = remapEnvelopeCurveRange(parent.taperCurveSecondary || parent.taperCurve, start, 1);
        child.depthCurveSecondary = remapEnvelopeCurveRange(parent.depthCurveSecondary || parent.depthCurve, start, 1);
        child.asymmetricWidthCurve = Boolean(parent.asymmetricWidthCurve);
        child.asymmetricDepthCurve = Boolean(parent.asymmetricDepthCurve);
        child.centerAsymmetricProfile = Boolean(parent.centerAsymmetricProfile);
      }
      child.surfaceNormalInfluence = 1;
      child.rootSurfacePoint = frame.point.clone();
      child.rootSurfaceNormal = frame.z.clone();
      child.rootAttachment = null;
      deps.syncLockFromCurve(child);
      branchBridge.deps.applyBranchRootOffset(child);
      deps.updateLockGeometry(child, { updateBranches: false });
      updateBranchChildren(child);
    });
  } finally {
    deps.branchState.branchUpdateInProgress = false;
  }
}

function canBranchDrawFromLock(lock) {
  return Boolean(
    lock?.geometryType === "strand"
    && (!lock.clumpId || lock.clumpGuide)
  );
}

function selectedDrawBranchPoint(event) {
  if (deps.selState.activeTool !== "draw") return null;
  const lock = deps.getSelectedLock();
  if (!canBranchDrawFromLock(lock) || lock.locked || lock.points.length < 2) return null;
  const hit = deps.strandControlPointHitFromEvent(event, lock);
  const pointIndex = hit?.object?.userData?.pointIndex;
  if (!Number.isInteger(pointIndex) || !lock.points[pointIndex]) return null;
  const frame = deps.curveFrameAtPoint(lock, pointIndex);
  return {
    lock,
    pointIndex,
    point: lock.points[pointIndex].clone(),
    normal: frame.z.clone().normalize(),
    tangent: frame.y.clone().normalize()
  };
}
  return {
    attachDrawnLocksAsBranches, branchChildrenFor, detachBranch, updateBranchChildren,
    canBranchDrawFromLock, selectedDrawBranchPoint
  };
}
