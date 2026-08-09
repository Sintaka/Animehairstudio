// branch-root-bone.js — child root-bone gizmo / parent-frame / rigid move (refactor 3d-3c).
// Extracted from app.js; coupling injected via createBranchRootBoneApi(deps).
import * as THREE from "three";
import { clampRegionParam } from "./branch-region-panel.js";

export function createBranchRootBoneApi(deps) {
  // deps: commitClumpMemberRestState, componentEditModeActive, controlPointRotationAt,
  //   curveFrameAt, curveFrameAtPoint, getSelectedLock, strandControlPointFrame,
  //   transportedStrandFrameAt, updateBranchChildren, locks,
  //   branchState, selState, sculptState (store .state proxies)

function branchMoveGizmoDisabled() {
  // Branch children can move their root bone in the parent's width plane; the
  // position is constrained back onto the parent surface in enforceBranchRootPosition.
  if (deps.selState.activeTool !== "move" || deps.sculptState.viewportEditMode !== "strand") return false;
  const lock = deps.getSelectedLock();
  if (!lock?.branchParentId) return false;
  return !deps.componentEditModeActive();
}

function setBranchMoveGizmoVisual(disabled) {
  const gizmoGroups = deps.transformControls._gizmo?.gizmo;
  if (!gizmoGroups) return;
  const restoreMaterials = new Set();
  Object.values(gizmoGroups).forEach((group) => group.traverse((item) => {
    const materials = Array.isArray(item.material) ? item.material : [item.material];
    materials.filter(Boolean).forEach((material) => restoreMaterials.add(material));
  }));
  restoreMaterials.forEach((material) => {
    material.userData.branchMoveColor ||= material._color?.clone() || material.color?.clone() || null;
    material.userData.branchMoveOpacity ??= Number(material._opacity ?? material.opacity);
    if (material.userData.branchMoveColor) {
      material._color?.copy(material.userData.branchMoveColor);
      material.color?.copy(material.userData.branchMoveColor);
    }
    material._opacity = material.userData.branchMoveOpacity;
    material.opacity = material.userData.branchMoveOpacity;
  });
  if (!disabled) return;
  gizmoGroups.translate?.traverse((item) => {
    const materials = Array.isArray(item.material) ? item.material : [item.material];
    materials.filter(Boolean).forEach((material) => {
      const disabledOpacity = Math.min(Number(material.userData.branchMoveOpacity ?? 1), 0.42);
      material._color?.setHex(0x7c7c84);
      material.color?.setHex(0x7c7c84);
      material._opacity = disabledOpacity;
      material.opacity = disabledOpacity;
    });
  });
}

function branchSurfaceFrameQuat(parent, parameter, across) {
  const base = deps.curveFrameAt(parent, parameter);
  const width = Math.max(0.0001, Number(parent.width ?? parent.baseWidth ?? 0.16));
  const depth = Math.max(0.0001, Number(parent.depth ?? 0.16));
  const a = width * 0.5;
  const b = depth * 0.5;
  const s = THREE.MathUtils.clamp(Number(across) || 0, -a, a);
  const zSurf = b * Math.sqrt(Math.max(0, 1 - (s / a) * (s / a)));
  // Outward normal of the ellipse x^2/a^2 + z^2/b^2 = 1 at (s, zSurf).
  const nx = s / (a * a);
  const nz = zSurf / (b * b);
  const len = Math.sqrt(nx * nx + nz * nz) || 1;
  const z = base.z.clone().multiplyScalar(nz / len).addScaledVector(base.x, nx / len).normalize();
  const y = base.y.clone();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

function applyBranchRigidRootMove(lock) {
  const rigid = deps.sculptState.activeHandleEdit?.branchRigid;
  if (!rigid?.deltas?.length || !rigid?.frameQuat || lock.points.length !== rigid.deltas.length) return;
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (!parent || !lock.points.length) return;
  const rootFrame = branchParentFrame(parent, lock.branchParentParameter);
  const across = new THREE.Vector3().subVectors(lock.points[0], rootFrame.point).dot(rootFrame.x);
  const frame = branchSurfaceFrameQuat(parent, lock.branchParentParameter, across);
  // Relative rotation from the recorded surface frame to the new surface frame
  // (guide curvature + lateral cross-section tilt), then blend halfway with identity
  // (= fully straight, no rotation). The child's world shape is only rotated by this
  // relative swing, never by the parent frame's absolute orientation.
  const relative = frame.clone().multiply(rigid.frameQuat.clone().invert());
  // Cap the total swing: the parent's lateral surface normal can tilt up to ~90 deg
  // at the strand edge, which as a full rigid rotation reads as "axis wild / up
  // flip" in Hierarchy mode. Clamp the relative rotation so the child never swings
  // past the limit even at blend 1.0.
  const identityQuat = new THREE.Quaternion();
  const relAngle = relative.angleTo(identityQuat);
  const maxSwing = THREE.MathUtils.degToRad(BRANCH_RIGID_SWING_LIMIT_DEG);
  const cappedRelative = relAngle > maxSwing
    ? relative.clone().slerp(identityQuat, 1 - maxSwing / relAngle)
    : relative;
  const rotation = new THREE.Quaternion().slerpQuaternions(
    identityQuat,
    cappedRelative,
    deps.branchState.branchRigidCurvatureBlend
  );
  const root = lock.points[0];
  lock.points.forEach((point, index) => {
    if (index === 0) return;
    point.copy(root).add(rigid.deltas[index].clone().applyQuaternion(rotation));
  });
}

function syncBranchRootHandleFrame(lock) {
  const handle = lock?.curveObjects?.handles?.[0];
  if (!handle || !lock?.branchParentId) return;
  // Gizmo = tube-model baseline + the user's root twist (kept across hot-updates),
  // and the same orientation is applied to the root bone so it follows the gizmo.
  const frame = branchRootGizmoFrame(lock);
  handle.quaternion.copy(frame.quaternion);
  if (lock.pointSurfaceNormals) lock.pointSurfaceNormals[0] = frame.z.clone();
  lock.rootSurfaceNormal = frame.z.clone();
}

function stableBranchBaseNormals(lock) {
  if (!lock?.points?.length) return [];
  const curve = new THREE.CatmullRomCurve3(lock.points);
  return lock.points.map((point, index) => deps.transportedStrandFrameAt(
    lock,
    curve,
    index / Math.max(1, lock.points.length - 1),
    { twistOverride: 0 }
  ).z.clone().normalize());
}

function ensureBranchParentNormalField(parent) {
  if (!parent?.points?.length) return;
  parent.pointSurfaceNormals = stableBranchBaseNormals(parent);
  parent.surfaceNormalInfluence = 1;
}

function branchParentFrame(parent, parameter) {
  // Continuous parent-surface frame along the guide: the child root slides smoothly
  // between guide control points (no discrete row snapping / jumps) while staying
  // laterally aligned to the guide line (across along frame.x is preserved in
  // enforceBranchRootPosition). Orientation matches deps.curveFrameAtPoint at each
  // control point, so this only smooths the interpolation.
  const t = THREE.MathUtils.clamp(Number(parameter ?? 0), 0, 1);
  const frame = deps.curveFrameAt(parent, t);
  frame.point = new THREE.CatmullRomCurve3(parent.points).getPoint(t);
  return frame;
}

function branchLocalVector(vector, frame) {
  return new THREE.Vector3(vector.dot(frame.x), vector.dot(frame.y), vector.dot(frame.z));
}

function branchWorldVector(vector, frame) {
  return frame.x.clone().multiplyScalar(vector.x)
    .addScaledVector(frame.y, vector.y)
    .addScaledVector(frame.z, vector.z);
}

function captureBranchLocalState(lock) {
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (!parent || !lock?.points?.length) return false;
  const frame = branchParentFrame(parent, lock.branchParentParameter);
  // Preserve the root's lateral (across-width) offset instead of snapping it back to
  // the parent guide-line center: capture runs at drag end (deps.commitClumpMemberRestState)
  // and on parent rebuilds, and zeroing it makes the root pop to the center on the next
  // rebuild (click elsewhere / select another strand), distorting the child strand.
  const across = new THREE.Vector3().subVectors(lock.points[0], frame.point).dot(frame.x);
  lock.points[0].copy(frame.point).addScaledVector(frame.x, across);
  // Preserve the child's actual surface normals (the sweep frames read them) so
  // deps.updateBranchChildren round-trips them unchanged when the parent frame is the
  // same; recomputed stable normals would override them and swing the root sweep.
  const childNormals = lock.pointSurfaceNormals?.some(Boolean)
    ? lock.pointSurfaceNormals
    : stableBranchBaseNormals(lock);
  lock.branchLocalPoints = lock.points.map((point, index) => (
    index === 0
      ? new THREE.Vector3(across, 0, 0)
      : branchLocalVector(point.clone().sub(frame.point), frame)
  ));
  lock.branchLocalSurfaceNormals = childNormals.map((normal) => (
    normal ? branchLocalVector(normal, frame).normalize() : null
  ));
  lock.surfaceNormalInfluence = 1;
  return true;
}

function enforceBranchRootPosition(lock) {
  const parent = deps.locks.find((item) => item.id === lock?.branchParentId);
  if (!parent || !lock?.points?.length) return null;
  const curve = new THREE.CatmullRomCurve3(parent.points);
  let bestT = THREE.MathUtils.clamp(Number(lock.branchParentParameter ?? 0), 0, 1);
  let bestDist = Infinity;
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64;
    const p = curve.getPoint(t);
    const d = p.distanceToSquared(lock.points[0]);
    if (d < bestDist) { bestDist = d; bestT = t; }
  }
  lock.branchParentParameter = clampRegionParam(bestT);
  const frame = branchParentFrame(parent, lock.branchParentParameter);
  // The root slides in the parent's width plane: keep the across-width (frame.x)
  // component of the drag and project back onto the parent surface.
  const width = Math.max(0.0001, Number(parent.baseWidth ?? parent.width ?? 0.16));
  // Tube proxy constraint: the parent is a swept tube (guide curve + width), so the
  // root slides along the lateral (frame.x) line but is clamped to the tube's half
  // width. Dragging an arbitrary gizmo axis (e.g. the local X) can no longer push
  // the root past the parent's edge / fly off the hair piece. The depth feeds the
  // surface-frame orientation (branchSurfaceFrameQuat / sweep seed), not the clamp.
  const halfWidth = width * 0.5;
  const across = THREE.MathUtils.clamp(
    new THREE.Vector3().subVectors(lock.points[0], frame.point).dot(frame.x),
    -halfWidth,
    halfWidth
  );
  const v = clampRegionParam(0.5 - across / width);
  // Follow the selection region with the root (u and v centers).
  deps.updateBranchRootRegionCenter(lock, lock.branchParentParameter, v);
  const rootPoint = frame.point.clone().addScaledVector(frame.x, across);
  lock.points[0].copy(rootPoint);
  if (lock.groupLatticeBasePoints?.[0]) lock.groupLatticeBasePoints[0].copy(rootPoint);
  lock.rootSurfacePoint = rootPoint.clone();
  lock.rootSurfaceNormal = frame.z.clone();
  lock.rootAttachment = null;
  // Keep the local root offset in sync so deps.updateBranchChildren holds it on the surface.
  if (Array.isArray(lock.branchLocalPoints) && lock.branchLocalPoints[0]) {
    lock.branchLocalPoints[0].x = across;
    lock.branchLocalPoints[0].y = 0;
    lock.branchLocalPoints[0].z = 0;
  }
  return frame;
}

function branchRootGizmoFrame(lock) {
  const base = deps.strandControlPointFrame(lock, 0);
  const twist = deps.controlPointRotationAt(lock, 0);
  const z = base.z.clone().applyAxisAngle(base.y, twist).normalize();
  const x = new THREE.Vector3().crossVectors(base.y, z).normalize();
  const zz = new THREE.Vector3().crossVectors(x, base.y).normalize();
  return {
    x,
    y: base.y.clone(),
    z: zz,
    quaternion: new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(x, base.y, zz)
    ),
    point: base.point,
    scale: base.scale
  };
}
  return {
    branchMoveGizmoDisabled, setBranchMoveGizmoVisual, branchSurfaceFrameQuat,
    applyBranchRigidRootMove, syncBranchRootHandleFrame, stableBranchBaseNormals,
    ensureBranchParentNormalField, branchParentFrame, branchLocalVector, branchWorldVector,
    captureBranchLocalState, enforceBranchRootPosition, branchRootGizmoFrame
  };
}
