# Anime Hair Studio

[English](README_EN.md) | **中文（默认）**

**Anime Hair Studio** 是网页版动漫发片制作工具：在浏览器里直接绘制/雕刻 strand、braid、panel（3D 视口绘制/雕刻），支持头皮引导线、clump、材质、预设，以及 OBJ/USDA 导出。

本项目源自原作者 **Ludetools**（[github.com/Ludetools/Animehairstudio](https://github.com/Ludetools/Animehairstudio)），本仓库保留原作者 LICENSE 与捐赠链接；采用 source-available 许可，仅限个人/非商业用途。

## 使用本仓库的代码

本仓库是原项目的本地适配版。我的改动通常在 **dev 分支**上（不是 `main`）。无论是 merge 分支还是在此基础上做二次开发，都可以直接使用，**无需额外授权**；我会持续改进这个项目，让它更贴合 Houdini 工作流。

## 本地部署（Python）

1. 安装 Python 3。
2. 在项目根目录运行：`python -m http.server 8080 --bind 127.0.0.1`。
3. 浏览器打开 `http://127.0.0.1:8080/`。
4. 或直接双击 `start-dev-server.cmd`（自动打开浏览器）。
5. 不要用 `file://` 直接打开 `index.html`（浏览器安全限制会阻止模块加载）。

或者（需要 Node.js）：内置静态服务器兼原生保存对话框代理 —— 项目根目录运行 `node server.js`，打开 `http://127.0.0.1:5173/`（改端口：`PORT=xxxx node server.js`，Windows PowerShell 用 `$env:PORT=xxxx; node server.js`）。也可以直接用 npm 通用静态代理 `npx http-server . -p 8080`。

## 本仓库新增功能（摘要）

- **简体中文 UI**（Settings → Language，3D 术语保留英文）
- **5 个自定义雕刻笔刷**（Slide / Scale·Cut-Extend / Push / Orient / **Twist**）+ Smooth twist；Ctrl=反向，例如 Scale 笔刷：默认放大，按住 Ctrl=缩小；Cut·Extend 模式默认延伸、Ctrl=裁剪
- **Twist 笔刷**：绕 strand 切线的手动轴向滚转，方向与相机无关（拖右/拖左反向、Ctrl 再反向）；只转朝向、不移动点；H 模式下子骨骼跟着滚转但位置钉死；按下左键即锁定影响范围
- **Panel Split 子骨骼 + 发尖子骨骼（tip sub-bone）**：每 split 段一个完整变换骨骼（P/orient/spread + 每段 Width/Depth 曲线）、视口 tip 链手柄/高亮/法线箭头、rotate/scale 挂 gizmo、发尖 WidthCurve（绿色控制点，左右独立、zipper 截断、Segment Spread 0–0.99、Reset 全 1）、每顶点蒙皮权重 [mainJoint, segment, weight] + USDA SkelBindingAPI 蒙皮
- **普通 strand 支持多个 zipper**：从单 zipper 升级为多 zipper（N 个 zipper → N+1 根管），strand 面板新增 +/− **Zipper Controls**（最多 8 个），每个 zipper 有独立位置/高度、可在视口直接拖动；几何、UV 展开、骨骼与 USDA 导出全部跟随；旧的单 zipper 存档照常打开
- **zipper 编辑体验**：zipper 带创建顺序，`−` 删**最近添加**的那个（不是最右边那个）；点击 zipper 手柄可选中（高亮），按 **Del** 只删这一个 zipper，拖动不会删；新增 zipper 时被切开的两段**继承原来的发尖姿态**，删除 zipper 后合并段也保持接近原姿态
- **发尖宽度曲线修复**：两个 zipper 高度不同时，浅的那侧原有一个绿色宽度控制点抓不到、导致发尖宽度凹陷；现在两侧控制点都能抓
- **发尖骨骼多暴露一根**：每个 zipper 高度多暴露一根发尖骨骼，骨骼根始终锚在第一个暴露点之下；视口与 USDA 导出对「暴露哪几行」的判断已完全一致
- **笔刷不再把发尖弹回原位**：用笔刷雕刻发尖子骨骼时会跳回编辑前的位置（刚加完 zipper 时最明显），已修复
- **快速保存/导出优化**：Ctrl+S 快速保存（记住最近项目文件句柄）、Ctrl+Shift+S 另存为、Ctrl+Alt+S 快速导出复刻上次导出（优先 File System Access API 直接写盘，避免下载 (1) 后缀）
- File 菜单**移除**了 3 个 Local dev 选项（Local Save / Local Export to OBJ / Local Export to USDA，原走 server.js 本地服务），保存/导出统一为上述三个快捷键。快捷键帮助有独立「Sintaka Fork」分区。
- **子发片**（低模水密桥接 + 父发片挖洞 + Region 选区 + 根骨骼 gizmo/twist/H 模式 + Bridge Smooth）
- **雕刻笔刷选区遮罩**：未选中任何头发时只雕刻可见头发；有选中时只雕刻选中的头发（不可见头发永不被雕刻）
- **视口导航风格**：Anime Hair Studio（默认）/ Blender / Houdini 三种，在 Settings → Preferences → Navigation style 切换
- **S+左键拖动调节笔刷大小**（含雕刻笔刷）；Delete 删除多余材质；Ctrl+Z 撤销修复（非文本输入控件可用）
- **拖放 .ahs/.animehair.json 直接打开项目**；浮动面板跟随选中
- **Wind Preview（吹风预览）**：Preview 菜单打开浮动窗口，10 个参数（风向/强度/频率/湍流/阵风/根部指数/随机度/seed 等）实时预览头发被风吹动的形态，发根不动、尖部摆幅最大；关闭窗口即逐位恢复原状，不写入存档
- **导出 UV 自动布局 + UV Checker 预览**：导出时按 `uvisland` 岛（每「主发片+子发片」family / panel 整片）统一纹素密度缩放后，用 alpaca 占位栅格 L 形扫描打包进 UDIM 1001（方形 bbox、无重叠、等比拉伸不 normalize、不旋转），USDA 输出 `primvars:uvisland`；**UV Checker 窗口顶部 ⟳ 按钮**按一下走同一导出展开流程，在视口棋盘格 + 2D UV Inspector 里预览最终打包布局，不用导入 DCC 确认。打包已多线程化，大工程导出明显更快
- **USDA 骨骼 / 蒙皮导出**：完整 USD Skeleton + SkelBindingAPI 蒙皮绑定，可直接在 Houdini 里 USD Character Import（见下）

## 雕刻笔刷

五个自定义雕刻笔刷说明：

- **Slide（滑动）**：沿曲线轨迹（切线方向）移动控制点，限制在切线/法线平面内滑动，不改变曲线长度比例。
- **Push（推）**：沿局部上方向（法线/垂直表面）推离表面，限制为法线方向移动。
- **Orient（定向）**：绕切线旋转截面，把截面的法线（上方向）转向视口正交方向（改变切线旋转）。
- **Scale（缩放）**：两种模式——**Scale**：以根部为锚点整发片等比缩放（径向、非移动）；**Cut·Extend（裁剪/延伸）**：整发片均匀参数缩放，保持点间距（factor<1 裁剪、factor>1 沿末端切线延伸）。
- **Twist（扭转）**：绕切线轴手动滚转，只改朝向不移动点（详见下节）。

Ctrl=反向说明：所有笔刷按住 Ctrl 为反向——Scale 笔刷默认放大、Ctrl 缩小；Cut·Extend 默认延伸、Ctrl 裁剪。

## Twist 笔刷

Twist 是手动的轴向滚转笔刷：按住左键**左右拖动**，笔刷范围内的 strand 就绕自己的切线方向滚转。用来手工调整发片的朝向/翻面，不改变形状。

使用要点：

- **方向与相机无关**：角度只取自水平拖动量，**拖右和拖左是相反的两个方向**，Ctrl 再反向。这是它与 Orient 的本质区别——Orient 把截面法线转向当前视口方向，所以你环绕视角后同样的拖动会翻方向；Twist 不会，环绕视角后拖右还是同一个滚转方向。
- **只转朝向、绝不移动点**：几何位置全程不变，只有扫掠截面的滚转角在变。
- **H（Hierarchy）模式**：滚转会传播到下游子骨骼，但子骨骼**位置钉死不动**，整条子链只做刚性滚转（这一点和普通的层级旋转不同，层级旋转会带着位置一起绕 pivot 转）。
- **按下即锁定影响范围**：这是唯一一个在起笔时冻结影响点集的笔刷——按下左键的那一刻就确定了哪些点受影响、权重多少，之后拖动光标不会再改变影响范围，直到松开左键。其它笔刷都是实时跟随光标的。

**没有为 Twist 分配快捷键**，只能从左侧工具栏的笔刷按钮进入。

## 发尖子骨骼（tip sub-bone）

![发尖子骨骼编辑](devlog/assets/tip-subbone-width-curve.png)

每个 split 段有独立发尖子骨骼；视口选中后显示发尖链手柄/高亮/法线箭头。绿色控制点是该段发尖的 WidthCurve，只影响当前发尖宽度，zipper 上半部分跟随主骨骼（不裂）；Segment Spread 控制尖端聚合 0–0.99（防退化面）；蒙皮权重按两侧 zipper 顶斜线分界，scale 笔刷不会把低 zipper 侧拉裂；旋转（E）/缩放（R）工具下挂变换 gizmo。

两侧 zipper 高度不同时，绿色控制点**两侧共用同一套参数位置（间距一致）**，但**各侧只暴露落在自己 zipper 以下的那些**——所以 zipper 深的一侧控制点多、浅的一侧少，数量随 zipper 高度动态变化，而不是两边硬凑成一样多。看得见的控制点一定能抓、也一定作用于该侧宽度（旧版本浅 zipper 那侧会漏掉一个抓不到的点、把宽度拽出凹陷）。用笔刷雕刻发尖也不会再跳回编辑前的位置。

## zipper（拉链）编辑

panel 和普通 strand 都支持多个 zipper：**N 个 zipper 会把发片切成 N+1 根管**。在对应面板的 **Zipper Controls** 用 `+` / `−` 增删（strand 最多 8 个），每个 zipper 有自己的位置与高度，可以在视口里直接拖动手柄调整。

- `+` 优先细分**当前选中的那一段**；新切出来的两段都**继承原来那段的发尖姿态**，不会跳回默认值。
- `−` 删除**最近添加**的那个 zipper（不是位置最右的那个），所以精心拖好的 zipper 不会被误删；删除后合并出来的大发尖也保持接近原姿态。
- 点击 zipper 手柄可以**选中**它（手柄放大提亮），按 **Del** 只删这一个 zipper；没有选中 zipper 时 Del 才删整根头发。**拖动手柄本身不会删除**任何东西。
- 每个 zipper 高度会多暴露一根发尖骨骼，骨骼根始终锚在它第一个暴露点之下；视口显示与 USDA 导出对「哪几行被暴露」的判断一致。
- 几何、UV 展开、骨骼与 USDA 导出都会跟着多 zipper 走。旧的单 zipper 存档可以照常打开，行为不变。

## 快捷键提示

- **Alt + 左键**：快速切换选中到悬停的发尖子骨骼段（或悬停的发丝），不用先取消当前选中。——操作习惯与 Zbrush 相同（Alt+点击拾取/快速切换悬停目标）
- **Ctrl + 左键拖动**（发尖绿色 WidthCurve 控制点）：非对称编辑——只调被拖的一侧；不加 Ctrl 默认等比镜像两侧。
- **Ctrl + 左键拖动**（其它地方）：特殊/反转功能——雕刻笔刷反向（Ctrl=反向，例如 Scale 笔刷：默认放大，按住 Ctrl=缩小；Cut·Extend 模式默认延伸、Ctrl=裁剪）、选择工具 Ctrl+左键从选中移除。
- **保存/导出**：Ctrl+S 快速保存到最近一次的项目文件（记住文件句柄，覆盖写同一文件）；Ctrl+Shift+S 另存为；Ctrl+Alt+S 快速导出复刻上次导出。
- **Del**：选中 zipper 时只删该 zipper；材质面板聚焦时删除该材质；否则删除当前选中的头发。
- **其它自定义快捷键**：S+左键拖动调笔刷大小、Delete 删多余材质、H 层级编辑（根骨骼工作流）、Ctrl+Z 撤销（含非文本输入控件）。
- **视口导航**：默认 Anime Hair Studio 风格（Alt+左键旋转 / Alt+右键平移 / 滚轮缩放）；切到 Houdini 风格后为 Alt+左键旋转 / Alt+中键平移 / Alt+右键缩放 / 滚轮缩放。在 Settings → Preferences → Navigation style 切换。
- 完整快捷键列表见应用内 Help → Shortcuts（本仓库新增项集中在「Sintaka Fork」分区）。

## 坐标系与 gizmo 向量

应用使用 Three.js 右手坐标系；曲线/发尖子骨骼 gizmo 使用随链方向变化的**局部坐标系**。

![发尖子骨骼 gizmo 局部坐标系](devlog/assets/tip-gizmo-frame.png)

三个重要向量（颜色对应截图）：**绿色 = 切线（Tangent，Y）**——沿发尖链/曲线方向；**红色 = 副切线（Bitangent，X）**——横向/宽度方向；**蓝色 = 法线（Normal，Z）**——垂直面板/曲线表面。宽度拖拽、旋转轴向、法线箭头都基于这套局部坐标系。

## 子发片（低模水密桥接）

![低模子发片桥接](devlog/assets/lowpoly-child-strand-basemesh.png)

父发片被挖洞打开，子发片通过低模水密桥接（父洞边界 → 子发片根环 → 顶/底带 + 侧边四边形）连接；父表面 Region 选区（2D u/v 面板 + 3D 标记）、直接/间接桥接、均匀平滑（Strength/Detail）；子发片根骨骼工作流（gizmo 携带 twist、H 层级刚性移动、Region 锚定中心）；父发片不使用拓扑连接（如 Split Geometry）时回退直接生成（从根部扫掠）；**UV 布局已解决**（导出时展开 + 按岛打包进 UDIM 1001，见下「导出 UV 布局」）。

## 导出 UV 布局（拆 UV）

![UV Checker 预览（导出打包布局）](devlog/assets/uv-checker.png)

导出（OBJ/USDA）时按扫掠网格的 `gridRow/gridCol` 属性生成矩形 UV（V 负方向 = 发丝切线，头发竖直向下打直），再把每个「主发片 + 子发片 / panel 整片」作为岛（`uvisland` 岛编号）统一纹素密度缩放后，用 **alpaca 占位栅格 L 形扫描** 打包进 UDIM 1001（[0,1]²）：

- **算法**：tile 栅格化（256 格/单位 UV）+ 积分图 O(1) 判空；`scanLine` 逐岛增长维持「方形边界」，两阶段放置（先沿「顶边 + 右边」L 形扫描填内部空隙、再无空位才外扩边界）；打包后整包等比缩放 + 居中（fit-to-tile：保持宽高比、不 normalize、不旋转）。
- **多起点择优**：8 个确定性随机序各跑一遍取最优（比单次贪心填充率约 +7%）。
- **效果**：panel 与普通发丝混排、整包近似方形（U/V 双侧≈填满）、无重叠无兜底、填充率约 0.76~0.81。
- **预览**：UV Checker 窗口顶部 ⟳ 按钮走同一导出流程，在视口棋盘格 + 2D UV Inspector 里预览最终布局，无需导入 DCC。
- **速度**：打包已多线程化（Worker 池），大工程导出时间显著下降；浏览器不支持 Worker 时自动回退单线程，结果完全一致。

参考文献：

- Nöll, T., Stricker, D. (2011). *Efficient Packing of Arbitrary Shaped Charts for Automatic Texture Atlas Generation*. Eurographics. <https://www.semanticscholar.org/paper/Efficient-Packing-of-Arbitrary-Shaped-Charts-for-N%C3%B6ll-Stricker/643267eb8be94784f005a48c9ce1bdb716d1008f>
- TABI (2026). *Tight and Balanced Interactive Atlas Packing*. UBC/NVIDIA. <https://www.cs.ubc.ca/labs/imager/tr/2026/tabi/>
- Jylänki, J. *A Thousand Ways to Pack the Bin — A Practical Approach to Two-Dimensional Rectangle Bin Packing*. <http://clb.demon.fi/projects/more-rectangle-bin-packing>
- jpcy/xatlas — UV atlas library. <https://github.com/jpcy/xatlas>

## USDA 骨骼 / 蒙皮导出

导出 USDA 时勾选 **Bones & Capture Mesh**（默认勾选），输出的是可直接使用的完整 USD 骨架：

- 单个 `def SkelRoot "Character"`，内含一个 `def Skeleton "Hair_Skel"` 与所有蒙皮 mesh —— 在 Houdini 里 `USD Character Import` 填一个 `skelrootpath` 就能一次导入整个角色。
- 一个 `Hair_Root` 空关节作为唯一骨骼根（x=0 正中线、位置取所有发根平均），所有发丝的根关节挂在它下面，构成单一连通骨骼树。
- 每根发丝的关节以**发丝名**为前缀命名（`${发丝名}_${序号}` / `_split_${k}` / `_split_${k}_tip_${j}`），同名发丝自动去重。
- Mesh 施加 `SkelBindingAPI`：`rel skel:skeleton` + `int[] primvars:skel:jointIndices` / `float[] primvars:skel:jointWeights`（带 `elementSize`）；panel 段为双影响、普通发丝为单影响、桥接子发片 family 为 4 影响 capture。
- 同时输出 `int[] primvars:uvisland`（每面一个岛编号），DCC 里可按 `@uvisland==k` 选岛。
- 菜单另有 Path Prefix（root 名持久化、快速导出复用）；OBJ 走同一管线但没有 primvar 机制，不输出骨骼与 uvisland。

该骨架已在 Houdini 中实测验证（关节层级/名称、rest 与 bind 变换、蒙皮关节索引与权重）。

## 已知限制

- **UV**：导出 UV 已展开并打包进 UDIM 1001；当前打包器为贪心（alpaca 占位栅格 L 形扫描 + 多起点 seed 择优），填充率约 0.76~0.81，不旋转（保持发丝各向异性方向）；hairCard / curve-surface 等其它 open/compound 类型本轮不纳入打包。
- **子发片桥接与多 zipper 的组合**：父发片是普通 strand 且被切成 **3 根或更多管**（即 2 个或更多 zipper）时，子发片不再走挖洞水密桥接，而是安全回退为「从根部直接生成」。panel 与最多 2 根管（≤1 个 zipper）的 strand 不受影响。
- **普通 strand 的多 zipper 尚缺两项**：per-segment spread 的 UI，以及 zipper 位置的 snap-to-loops。

## 开发文档

- 新 agent 入门：[devlog/AGENT_QUICKSTART.md](devlog/AGENT_QUICKSTART.md)
- 完整 devlog 索引：[devlog/README.md](devlog/README.md)

## 许可说明

source-available（非 OSI 开源）许可：仅限个人/非商业用途；再分发须附带 LICENSE，并保留作者捐赠链接。

