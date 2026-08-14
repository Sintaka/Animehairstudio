# 导出拆 UV 计划 / UV Unfold Plan（0.2.69–0.2.79）

> 状态：**主体已完成**（普通发丝 / split / panel / 子发片扫掠 + 桥接的矩形 UV 展开与导出接线）。
> 规则、理念、9 条踩坑全集见 [../uv-unfold.md](../uv-unfold.md)；版本时间线见 [../local-adaptation-log.md](../local-adaptation-log.md) 0.2.69–0.2.79。

## 已完成（P1–P9）

| 阶段 | 内容 | 版本 |
|---|---|---|
| P1 | 每顶点扫掠编号 `gridRowIndices/gridColIndices`（普通发丝/子发片/split/hair card/card/compound/panel，桥接+端盖 −1）+ USDA `AHS_gridRow/gridCol` primvars | 0.2.69–0.2.70 |
| P2 | `modules/io/uv-unfold.js` 展开核心 + USDA/OBJ 接线；V 负方向=切线（根 V=1 尖 V=0）；闭合环 seam 复制切开；桥接锚点 `{ring,hole,t}` 插值 | 0.2.71 |
| P3 | 切缝纠正到背面（bottom side 中点）；桥接中线双副本；split seam 槽；子发片 V 按主发片长度归一 | 0.2.72 |
| P4 | 单边切缝 + 弧长 U（row-0 环向边宽累计）+ 子发片 U 按主周长缩放（后被 P7/P9 替代） | 0.2.73 |
| P5 | split 网格列改「管局部列 + 全局偏移」（弃 colToSection.findIndex，修复 x=0 共享点父表失效） | 0.2.75 |
| P6 | 恢复顶点复制式切开（seam/管首/桥接中线双副本，quad 全保留，修复 poly 缺失）+ 扫掠 V 洞底对齐 + 桥接 band 标记（top/side 插值、bottom 自然展开） | 0.2.76 |
| P7 | split 两管 U 轴排列不重叠 + 子发片 U 收缩居中（uOffset/uScale）+ seamEndU | 0.2.77 |
| P8 | U 中心缩放 ×1.1 + 扫掠下移（childVSweepStart）+ 取消横缝（仅上下竖缝） | 0.2.78 |
| P9 | bottom band 改回插值（修复意外 seam）+ U 拓扑对齐缩放（childUTopologyScale：环顶面弧长 ↔ 洞顶 u 跨度） | 0.2.79 |

## 剩余待办（下一阶段候选）

- [ ] 桥接侧面 UV 排布进一步优化：顺切线方向自然桥接扫掠与孔洞（取消横缝后的实际效果待用户验证）。
- [ ] 桥接 UV 平滑操作（用户曾提「直接平滑 uv，不是几何体」）——可对桥接顶点 UV 做 Laplacian 平滑（洞侧/环侧锚点固定）。
- [ ] 十字横缝（左右各 2 条边）按新理解重新设计（如需）。
- [ ] split 父发片 AHS_gridCol 语义（管局部偏移列 vs fused 列）如影响下游 Cyl1nder 消费则另议。
- [ ] braid 预置网格的模拟 UV（如需）。
