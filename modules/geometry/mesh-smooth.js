// mesh-smooth.js — generic iterative Laplacian smooth over quad meshes
// (extracted from branch-bridge.js bridge-interior relax, 0.2.66).
export function smoothMeshVertices(vertices, quads, movable, strength, iterations, positionAt = null) {
  // vertices: flat number[] (3/顶点)，原地修改
  // quads: 四边面数组，每项 [a,b,c,d]（顶点索引）
  // movable: 可移动顶点索引集合（数组或 Set），只更新这些
  // strength: 0..1 每遍混合量；iterations: 整数≥0
  // positionAt: 可选 (idx)=>[x,y,z]|null；缺省读 vertices
  // 逻辑必须与 branch-bridge.js 现有内联块完全一致（邻接表/跳过<2邻居/整批应用/只动 movable）
  const adjacency = new Map();
  quads.forEach((q) => {
    for (let e = 0; e < 4; e += 1) {
      const a = q[e];
      const b = q[(e + 1) % 4];
      if (!adjacency.has(a)) adjacency.set(a, []);
      if (!adjacency.get(a).includes(b)) adjacency.get(a).push(b);
      if (!adjacency.has(b)) adjacency.set(b, []);
      if (!adjacency.get(b).includes(a)) adjacency.get(b).push(a);
    }
  });
  const readAt = positionAt || ((idx) => [vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]]);
  for (let iter = 0; iter < iterations; iter += 1) {
    const targets = new Map();
    movable.forEach((vi) => {
      const neighbors = adjacency.get(vi) || [];
      if (neighbors.length < 2) return;
      let ax = 0; let ay = 0; let az = 0; let count = 0;
      neighbors.forEach((ni) => {
        const p = readAt(ni);
        if (!p) return;
        ax += p[0]; ay += p[1]; az += p[2];
        count += 1;
      });
      if (count < 2) return;
      const ox = vertices[vi * 3];
      const oy = vertices[vi * 3 + 1];
      const oz = vertices[vi * 3 + 2];
      targets.set(vi, [
        ox + (ax / count - ox) * strength,
        oy + (ay / count - oy) * strength,
        oz + (az / count - oz) * strength
      ]);
    });
    targets.forEach((t, vi) => {
      vertices[vi * 3] = t[0];
      vertices[vi * 3 + 1] = t[1];
      vertices[vi * 3 + 2] = t[2];
    });
  }
}
