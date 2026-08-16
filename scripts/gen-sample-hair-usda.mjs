// scripts/gen-sample-hair-usda.mjs — 生成含「发丝切线朝向 orient」的样例，验证骨骼朝向非单位矩阵。
import fs from "node:fs";
import { exportAnimeHairUsda } from "../modules/io/usda-export.js";

// 发丝从 (0,1.7,0) 向下到 (0,0.7,0)，切线 (0,-1,0)。让骨骼 +Y 对齐切线（向下）→ 绕 X 轴 180°。
const DOWN = [1, 0, 0, 0, -1, 0, 0, 0, -1]; // X轴180° 3x3（+Y→-Y）
const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const joints = [
  { name: "Hair_Root", parent: null, p: [0, 1.7, 0], orient: I3 },
  { name: "Front_1_0", parent: "Hair_Root", p: [0, 1.7, 0], orient: DOWN },
  { name: "Front_1_1", parent: "Front_1_0", p: [0, 1.2, 0], orient: DOWN },
  { name: "Front_1_2", parent: "Front_1_1", p: [0, 0.7, 0], orient: DOWN }
];

const mesh = {
  name: "Front_1",
  points: [[-0.1, 1.7, 0], [0.1, 1.7, 0], [0.1, 0.7, 0], [-0.1, 0.7, 0]],
  faces: [[0, 1, 2, 3]],
  skelRootName: "Hair_Skel",
  skelIndices: [[1, 1], [1, 1], [3, 3], [3, 3]],
  skelWeights: [[1, 0], [1, 0], [1, 0], [1, 0]]
};

const usda = exportAnimeHairUsda({ meshes: [mesh], skeletons: [{ name: "Hair_Skel", joints }], rootName: "Sussurro_v1_0048" });
fs.writeFileSync("D:/code/dev/web/Animehairstudio/sample-hair.usda", usda, "utf8");
// 检查 bindTransforms 里是否有非单位旋转矩阵
const bindLine = usda.split("\n").find((l) => l.includes("bindTransforms"));
console.log("bindTransforms 含非单位旋转（X轴180°）:", bindLine.includes("(0, -1, 0, 0)"));
console.log("Character 下 def Mesh 数:", usda.split("def Mesh").length - 1);
