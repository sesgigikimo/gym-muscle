# 重訓肌群解剖圖 · gym-muscle 💪

一個網頁工具,用解剖學的方式呈現**每個重訓動作牽涉到哪些肌群**——選一個動作,人體圖上把主動肌、協同肌、穩定肌用三色標出;或反過來點某塊肌肉,查出所有練到它的動作。提供 **2D 示意圖** 與 **3D 解剖模型** 兩種檢視。

### 🔗 線上 Demo:[sesgigikimo.github.io/gym-muscle](https://sesgigikimo.github.io/gym-muscle/)

- 2D 雙向查詢:<https://sesgigikimo.github.io/gym-muscle/>
- 全身 3D：<https://sesgigikimo.github.io/gym-muscle/fullbody3d.html>

> 純前端、零建置(no build step):HTML + CSS + ES modules + Three.js。

## ✨ 功能

- **雙向查詢**:動作 → 肌群,或 肌群 → 動作。
- **三色語意**:🔴 主動肌 / 🟠 協同肌 / 🟡 穩定肌。
- **2D 視圖**:前 / 後視圖 SVG 人體,點擊上色、滑鼠懸停顯示中英文名。
- **3D 視圖**(Three.js + 真實解剖模型):
  - **全身**總覽(15 大肌群,Draco 壓縮約 1.6MB)。
  - **區域放大**:大腿、腰部、腰臀(後鏈)——可旋轉、縮放、點擊高亮。
  - **可選骨架**:大腿可疊股骨、腰部可疊脊椎/骨盆,即時切換。
- 共用同一份資料層(`data.js`),2D / 3D / 各區域頁完全一致。

## 🚀 快速開始

因為用到 ES modules 與 `fetch`,需要透過本地伺服器開啟(直接以 `file://` 開會被瀏覽器 CORS 擋下):

```bash
git clone https://github.com/sesgigikimo/gym-muscle.git
cd gym-muscle
python3 -m http.server 8000
# 瀏覽器開 http://localhost:8000
```

- 2D 版:`http://localhost:8000/`
- 全身 3D:`http://localhost:8000/fullbody3d.html`

## 🗂️ 專案結構

```
data.js            # 資料層:16 動作 × 15 肌群對照(角色:主動/協同/穩定)。2D/3D 共用
index.html         # 2D 版主頁
app.js  body.js  style.css   # 2D 版邏輯 / SVG 人體 / 樣式

viewer3d.js        # 通用 3D 檢視器:initViewer(config) —— 旋轉 + 點擊高亮 + 接資料
fullbody3d.*       # 全身(15 肌群)
shoulder3d.*       # 肩（三角肌/斜方肌,可選肩胛・鎖骨・肱骨)
back3d.*           # 背（背闊肌/斜方肌/豎脊肌,可選脊椎)
arm3d.*            # 手臂（二頭/三頭/前臂,可選肱骨・橈尺骨)
waist3d.*          # 腰部（可選脊椎/骨盆）
waistglute3d.*     # 腰臀後鏈（可選脊椎/骨盆）
thigh3d.*          # 大腿 + 臀（可選股骨）
calf3d.*           # 小腿（腓腸肌/比目魚肌,可選脛・腓骨)
*.glb              # 3D 模型(由 Z-Anatomy 離線轉檔篩出,見下;皆 Draco 壓縮)
```

新增一個部位只需:篩出該部位的 `*.glb` + 複製一份約 10 行的設定檔(`*3d.js` / `*3d.html`)。

## 🧩 3D 模型轉檔管線(Blender-free)

3D 肌肉/骨骼來自 [Z-Anatomy](https://github.com/LluisV/Z-Anatomy),全程用命令列處理、不需 Blender:

1. 取得 Z-Anatomy 的 `MuscularSystem100.fbx` / `SkeletalSystem100.fbx`。
2. `assimp` 轉檔:FBX → glb。
3. [`@gltf-transform`](https://gltf-transform.dev/) 腳本:依 mesh 名字篩出目標肌肉、為每個 mesh 寫入 `extras.muscle = <肌群id>`、`prune/dedup/weld`,並以 **Draco** 壓縮。
4. Three.js `GLTFLoader` 載入,透過 `object.userData.muscle` 接回 `data.js`。

## 📜 資料來源與授權

- **3D 模型**:[Z-Anatomy](https://github.com/LluisV/Z-Anatomy) — © Lluís Vinent,**CC BY-SA 4.0**。
- **2D SVG 人體**:[react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter) — © ELABBASSI Hicham,**MIT**。
- **3D 函式庫**:[Three.js](https://threejs.org/) — MIT。

由於本專案內含並改作了 Z-Anatomy 的模型,依其 ShareAlike 條款,**本專案整體以 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 授權**。詳見 [`LICENSE`](LICENSE)。

## ⚠️ 注意

動作與肌群的對照為一般訓練常識整理,**僅供學習參考**,非醫療或專業教練建議。
