// bridge-export.js — pure USD branch-family merge and bridge capture helpers.

const CAPTURE_ARITY = 4;

function sourceMap(sourceIndices = []) {
  const mapped = new Map();
  sourceIndices.forEach((source, index) => {
    const key = Number(source);
    if (!Number.isInteger(key) || key < 0) return;
    if (!mapped.has(key)) mapped.set(key, []);
    mapped.get(key).push(index);
  });
  return mapped;
}

function captureAt(mesh, index) {
  const indices = mesh?.skelIndices?.[index];
  const weights = mesh?.skelWeights?.[index];
  if (!Array.isArray(indices) || !Array.isArray(weights)) return null;
  return { indices, weights };
}

export function normalizedCapture(entries, fallbackIndex = 0, arity = CAPTURE_ARITY) {
  const totals = new Map();
  entries.forEach((entry) => {
    const indices = entry?.indices || [];
    const weights = entry?.weights || [];
    const scale = Number(entry?.scale ?? 1);
    if (!(scale > 0)) return;
    for (let i = 0; i < Math.min(indices.length, weights.length); i += 1) {
      const index = Math.trunc(Number(indices[i]));
      const weight = Number(weights[i]) * scale;
      if (!Number.isInteger(index) || index < 0 || !Number.isFinite(weight) || weight <= 0) continue;
      totals.set(index, (totals.get(index) || 0) + weight);
    }
  });
  const ranked = [...totals.entries()]
    .sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]))
    .slice(0, Math.max(1, Math.floor(arity)));
  const safeFallback = Number.isInteger(fallbackIndex) && fallbackIndex >= 0 ? fallbackIndex : 0;
  if (!ranked.length) {
    return {
      indices: Array.from({ length: Math.max(1, Math.floor(arity)) }, () => safeFallback),
      weights: Array.from({ length: Math.max(1, Math.floor(arity)) }, (_, index) => (index === 0 ? 1 : 0))
    };
  }
  const total = ranked.reduce((sum, [, weight]) => sum + weight, 0) || 1;
  const indices = ranked.map(([index]) => index);
  const weights = ranked.map(([, weight]) => weight / total);
  while (indices.length < arity) {
    indices.push(indices[0] ?? safeFallback);
    weights.push(0);
  }
  return {
    indices,
    weights
  };
}

function inheritedCapture(capture, fallbackIndex) {
  const safeFallback = Number.isInteger(fallbackIndex) && fallbackIndex >= 0 ? fallbackIndex : 0;
  const indices = [];
  const weights = [];
  for (let i = 0; i < CAPTURE_ARITY; i += 1) {
    const index = Math.trunc(Number(capture?.indices?.[i]));
    indices.push(Number.isInteger(index) && index >= 0 ? index : (indices[0] ?? safeFallback));
    const weight = Number(capture?.weights?.[i]);
    weights.push(Number.isFinite(weight) && weight > 0 ? weight : 0);
  }
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (!(total > 0)) return normalizedCapture([capture], safeFallback);
  return { indices, weights: weights.map((weight) => weight / total) };
}

function bridgeGraph(mesh, anchors, availableSources) {
  const graph = new Map();
  const ensure = (source) => {
    if (!Number.isInteger(source) || source < 0 || !availableSources.has(source) || !anchors[source]) return;
    if (!graph.has(source)) graph.set(source, new Set());
  };
  const add = (a, b) => {
    ensure(a);
    ensure(b);
    if (a === b || !graph.has(a) || !graph.has(b)) return;
    graph.get(a).add(b);
    graph.get(b).add(a);
  };
  anchors.forEach((anchor, source) => {
    if (anchor) ensure(source);
  });
  (mesh.faces || []).forEach((face) => {
    for (let i = 0; i < face.length; i += 1) {
      const a = Number(mesh.sourceIndices?.[face[i]]);
      const b = Number(mesh.sourceIndices?.[face[(i + 1) % face.length]]);
      if (Number.isInteger(a) && Number.isInteger(b)) add(a, b);
    }
  });
  return graph;
}

function harmonicChildWeight(mesh, anchors, boundaryParentIndices, availableSources) {
  const graph = bridgeGraph(mesh, anchors, availableSources);
  const sources = [...graph.keys()].sort((a, b) => a - b);
  const pinned = new Map();
  for (let i = 0; i + 1 < (boundaryParentIndices?.length || 0); i += 2) {
    const source = Number(boundaryParentIndices[i]);
    if (graph.has(source)) pinned.set(source, 0);
  }
  sources.forEach((source) => {
    const t = Number(anchors[source]?.t);
    if (!Number.isFinite(t)) return;
    if (t <= 1e-6) pinned.set(source, 1);
    if (t >= 1 - 1e-6) pinned.set(source, 0);
  });
  const values = new Map();
  sources.forEach((source) => {
    const t = Number(anchors[source]?.t);
    values.set(source, pinned.has(source) ? pinned.get(source) : (Number.isFinite(t) ? Math.max(0, Math.min(1, 1 - t)) : 0.5));
  });
  // This is a capture-only uniform Laplacian. Hole and child-root endpoints stay fixed.
  for (let pass = 0; pass < 96; pass += 1) {
    const next = new Map(values);
    sources.forEach((source) => {
      if (pinned.has(source)) return;
      const neighbors = [...(graph.get(source) || [])];
      if (!neighbors.length) return;
      next.set(source, neighbors.reduce((sum, neighbor) => sum + values.get(neighbor), 0) / neighbors.length);
    });
    values.clear();
    next.forEach((value, source) => values.set(source, value));
  }
  return values;
}

function orderedRecords(records) {
  const byId = new Map(records.map((record) => [record.id, record]));
  const children = new Map();
  records.forEach((record) => {
    if (!byId.has(record.parentId) || record.parentId === record.id) return;
    if (!children.has(record.parentId)) children.set(record.parentId, []);
    children.get(record.parentId).push(record);
  });
  const ordered = [];
  const visited = new Set();
  const visit = (record) => {
    if (!record || visited.has(record.id)) return;
    visited.add(record.id);
    ordered.push(record);
    (children.get(record.id) || []).forEach(visit);
  };
  records.forEach((record) => {
    if (!byId.has(record.parentId) || record.parentId === record.id) visit(record);
  });
  records.forEach(visit);
  return { byId, ordered };
}

export function applyBridgeBoneCapture(records = []) {
  const { byId, ordered } = orderedRecords(records);
  ordered.forEach((child) => {
    const parent = byId.get(child.parentId);
    const mesh = child.mesh;
    const anchors = child.bridgeUvAnchors;
    if (!parent || !mesh || !Array.isArray(anchors) || !anchors.length
      || !Array.isArray(mesh.sourceIndices) || !Array.isArray(mesh.skelIndices)
      || !Array.isArray(parent.mesh?.skelIndices)) return;

    const childBySource = sourceMap(mesh.sourceIndices);
    const parentBySource = sourceMap(parent.mesh.sourceIndices);
    const boundary = child.bridgeBoundaryParentIndices || [];
    const boundaryParent = new Map();
    for (let i = 0; i + 1 < boundary.length; i += 2) {
      const childSource = Number(boundary[i]);
      const parentSource = Number(boundary[i + 1]);
      if (childBySource.has(childSource) && parentBySource.has(parentSource)) {
        boundaryParent.set(childSource, parentSource);
      }
    }
    const childMainIndex = Number.isInteger(child.childMainIndex) ? child.childMainIndex : 0;
    const childRootCapture = child.childRootCapture || { indices: [childMainIndex, childMainIndex], weights: [1, 0] };
    const parentCaptureFor = (source) => {
      const anchor = anchors[source];
      const parentSource = boundaryParent.get(source) ?? Number(anchor?.hole);
      const output = parentBySource.get(parentSource)?.[0];
      return Number.isInteger(output) ? captureAt(parent.mesh, output) : null;
    };
    const harmonic = harmonicChildWeight(mesh, anchors, boundary, childBySource);

    childBySource.forEach((outputs, source) => {
      if (!anchors[source]) return;
      const parentCapture = parentCaptureFor(source);
      const h = harmonic.get(source) ?? Math.max(0, Math.min(1, 1 - Number(anchors[source]?.t)));
      const exactBoundary = boundaryParent.has(source);
      const capture = exactBoundary && parentCapture
        ? inheritedCapture(parentCapture, childMainIndex)
        : normalizedCapture([
          { ...parentCapture, scale: 1 - h },
          { ...childRootCapture, scale: h }
        ], childMainIndex);
      outputs.forEach((output) => {
        mesh.skelIndices[output] = [...capture.indices];
        mesh.skelWeights[output] = [...capture.weights];
      });
    });
  });
  return records;
}

function unionFind(size) {
  const parent = Array.from({ length: size }, (_, index) => index);
  const find = (value) => {
    let root = value;
    while (parent[root] !== root) root = parent[root];
    while (parent[value] !== value) {
      const next = parent[value]; parent[value] = root; value = next;
    }
    return root;
  };
  return { find, join: (a, b) => { const ra = find(a); const rb = find(b); if (ra !== rb) parent[rb] = ra; } };
}

function tupleAt(values, index, width) {
  if (!Array.isArray(values) || values.length <= index) return null;
  const value = values[index];
  return Array.isArray(value) && value.length >= width ? [...value] : null;
}

function mergedFamily(records) {
  const offsets = new Map();
  let total = 0;
  records.forEach((record) => { offsets.set(record.id, total); total += record.mesh.points.length; });
  const dsu = unionFind(total);
  const byId = new Map(records.map((record) => [record.id, record]));
  records.forEach((child) => {
    const parent = byId.get(child.parentId);
    if (!parent || !child.bridgeBoundaryParentIndices?.length) return;
    const childSources = sourceMap(child.mesh.sourceIndices);
    const parentSources = sourceMap(parent.mesh.sourceIndices);
    for (let i = 0; i + 1 < child.bridgeBoundaryParentIndices.length; i += 2) {
      const childOutputs = childSources.get(Number(child.bridgeBoundaryParentIndices[i])) || [];
      const parentOutputs = parentSources.get(Number(child.bridgeBoundaryParentIndices[i + 1])) || [];
      if (!childOutputs.length || !parentOutputs.length) continue;
      const seed = offsets.get(parent.id) + parentOutputs[0];
      parentOutputs.forEach((output) => dsu.join(seed, offsets.get(parent.id) + output));
      childOutputs.forEach((output) => dsu.join(seed, offsets.get(child.id) + output));
    }
  });

  const rootToIndex = new Map();
  const pointIndex = new Array(total);
  const merged = { points: [], normals: [], colors: [], tangents: [], gridRowIndices: [], gridColIndices: [], skelIndices: [], skelWeights: [] };
  const allHave = (key) => records.every((record) => Array.isArray(record.mesh[key]) && record.mesh[key].length === record.mesh.points.length);
  const hasNormals = allHave("normals"); const hasColors = allHave("colors"); const hasTangents = allHave("tangents");
  const hasRows = allHave("gridRowIndices"); const hasCols = allHave("gridColIndices");
  const hasSkin = allHave("skelIndices") && allHave("skelWeights");
  records.forEach((record) => {
    const offset = offsets.get(record.id);
    record.mesh.points.forEach((point, local) => {
      const original = offset + local;
      const root = dsu.find(original);
      if (!rootToIndex.has(root)) {
        const index = merged.points.length;
        rootToIndex.set(root, index);
        merged.points.push([...point]);
        if (hasNormals) merged.normals.push(tupleAt(record.mesh.normals, local, 3));
        if (hasColors) merged.colors.push(tupleAt(record.mesh.colors, local, 3));
        if (hasTangents) merged.tangents.push(tupleAt(record.mesh.tangents, local, 4));
        if (hasRows) merged.gridRowIndices.push(Number(record.mesh.gridRowIndices[local]));
        if (hasCols) merged.gridColIndices.push(Number(record.mesh.gridColIndices[local]));
        if (hasSkin) {
          const capture = normalizedCapture([{
            indices: record.mesh.skelIndices[local],
            weights: record.mesh.skelWeights[local]
          }]);
          merged.skelIndices.push(capture.indices);
          merged.skelWeights.push(capture.weights);
        }
      }
      pointIndex[original] = rootToIndex.get(root);
    });
  });
  if (!hasNormals) delete merged.normals;
  if (!hasColors) delete merged.colors;
  if (!hasTangents) delete merged.tangents;
  if (!hasRows) delete merged.gridRowIndices;
  if (!hasCols) delete merged.gridColIndices;
  if (!hasSkin) { delete merged.skelIndices; delete merged.skelWeights; }

  merged.faces = []; merged.uvs = []; merged.uvIndices = []; merged.uvislandValues = [];
  records.forEach((record, recordIndex) => {
    const offset = offsets.get(record.id);
    const uvOffset = merged.uvs.length;
    const sourceUvs = Array.isArray(record.mesh.uvs) ? record.mesh.uvs : [];
    const sourceUvIndices = Array.isArray(record.mesh.uvIndices) ? record.mesh.uvIndices : null;
    let faceVertex = 0;
    sourceUvs.forEach((uv) => merged.uvs.push([...uv]));
    (record.mesh.faces || []).forEach((face, faceIndex) => {
      merged.faces.push(face.map((local) => pointIndex[offset + local]));
      face.forEach((local) => {
        const sourceUv = sourceUvIndices?.[faceVertex];
        const uv = Number.isInteger(sourceUv) && sourceUv >= 0 && sourceUv < sourceUvs.length
          ? sourceUv
          : local;
        merged.uvIndices.push(uvOffset + uv);
        faceVertex += 1;
      });
      const island = record.mesh.uvislandValues?.[faceIndex];
      merged.uvislandValues.push(Number.isInteger(island)
        ? island
        : (Number.isInteger(record.mesh.uvisland) ? record.mesh.uvisland : recordIndex));
    });
  });
  const root = records[0];
  return {
    ...root.mesh,
    ...merged,
    name: root.mesh.name,
    group: root.mesh.group,
    layer: root.mesh.layer,
    skelRootName: root.mesh.skelRootName
  };
}

export function mergeBranchFamilyMeshes(records = []) {
  const { byId } = orderedRecords(records);
  const byParent = new Map();
  records.forEach((record) => {
    const parentId = byId.has(record.parentId) && record.parentId !== record.id ? record.parentId : null;
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId).push(record);
  });
  const output = [];
  const visited = new Set();
  const visit = (record, collected) => {
    if (!record || visited.has(record.id)) return;
    visited.add(record.id);
    collected.push(record);
    (byParent.get(record.id) || []).forEach((child) => visit(child, collected));
  };
  (byParent.get(null) || []).forEach((root) => {
    const family = [];
    visit(root, family);
    if (family.length) output.push(mergedFamily(family));
  });
  records.forEach((record) => {
    if (visited.has(record.id)) return;
    const family = [];
    visit(record, family);
    if (family.length) output.push(mergedFamily(family));
  });
  return output;
}
