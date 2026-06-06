// ============================================================
//  通用 3D 肌群檢視器 — Three.js
//
//  各部位頁面(thigh3d.js / waist3d.js …)只要呼叫 initViewer(config):
//    {
//      regionName: '大腿',                         // 面板文字用
//      modelUrl: 'thigh.glb',                      // 肌肉 glb(mesh 帶 userData.muscle)
//      regionMuscles: ['quads','hamstrings',...],  // 本場景聚焦的肌群 id
//      bone: { url: 'femur.glb', toggleId: 'femur-toggle' } | null,  // 可選骨架
//      defaultExerciseId: 'back_squat'             // 預設選的動作
//    }
//
//  模型來源:Z-Anatomy 解剖肌肉/骨骼(CC BY-SA 4.0)。
//  互動:OrbitControls 旋轉 + Raycaster 點擊高亮 + 接上 data.js 動作資料。
// ============================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { muscles, exercises, exercisesForMuscle, ROLE_LABEL } from './data.js';

const COLOR = {
  base: 0x9a5a55,       // 肌肉預設(暗紅)
  dim: 0x44505c,        // 沒被選到時的灰
  selected: 0x4aa3e8,   // 點選肌肉(藍)
  primary: 0xe8453c,
  synergist: 0xf0883e,
  stabilizer: 0xe3c84a
};

export function initViewer(config) {
  const REGION = config.regionName;
  const REGION_MUSCLES = config.regionMuscles;

  // ---------- 場景基本設定 ----------
  const wrap = document.getElementById('canvas-wrap');
  const panel = document.getElementById('panel');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
  camera.position.set(5, 1.5, 6.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  wrap.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.minDistance = 1.2;   // 可拉更近(放更大)
  controls.maxDistance = 20;

  // 燈光
  scene.add(new THREE.HemisphereLight(0xbcd4ff, 0x202024, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(5, 8, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0x88aaff, 0.4); fill.position.set(-6, 2, -4); scene.add(fill);

  // ---------- 載入模型 ----------
  const muscleMeshes = [];

  const muscleMat = () => new THREE.MeshStandardMaterial({
    color: COLOR.base, roughness: 0.6, metalness: 0.0,
    emissive: 0x000000, side: THREE.DoubleSide   // 解剖 mesh 法線可能不一致,雙面避免破洞
  });
  const boneMat = () => new THREE.MeshStandardMaterial({ color: 0xe8e2d0, roughness: 0.85, metalness: 0.0 });

  // 往上找 extras 旗標(node extras 可能落在父層 Group 上)
  const findFlag = (obj, k) => {
    for (let p = obj; p; p = p.parent)
      if (p.userData && p.userData[k] != null) return p.userData[k];
    return null;
  };

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();   // 給 Draco 壓縮的 glb(如 fullbody.glb)用
  dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');
  loader.setDRACOLoader(dracoLoader);      // 對未壓縮的 glb 無影響
  const content = new THREE.Group();   // 原始座標,所有模型掛這裡才會對齊
  const pivot = new THREE.Group();     // 置中/立正/縮放只作用在 pivot
  pivot.add(content);
  scene.add(pivot);

  loader.loadAsync(config.modelUrl).then((model) => {
    // 肌肉
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const id = findFlag(o, 'muscle');
      if (id) {
        o.userData.muscle = id;
        const layer = findFlag(o, 'layer');
        if (layer) o.userData.layer = layer;     // 'superficial' | 'deep'
        o.material = muscleMat();
        muscleMeshes.push(o);
      } else o.visible = false;
    });
    content.add(model.scene);

    // 骨架(可選):lazy load —— 第一次勾選才下載(骨架檔較大,不拖累初始載入)
    if (config.bone) {
      const toggle = document.getElementById(config.bone.toggleId);
      if (toggle) {
        let boneScene = null, loading = false;
        toggle.addEventListener('change', async () => {
          if (toggle.checked && !boneScene && !loading) {
            loading = true;
            toggle.parentElement && toggle.parentElement.classList.add('loading-opt');
            try {
              const g = await loader.loadAsync(config.bone.url);
              boneScene = g.scene;
              boneScene.traverse((o) => { if (o.isMesh) o.material = boneMat(); });
              content.add(boneScene);   // 與肌肉同 content,自動套用相同置中/縮放 → 對齊
            } catch (e) { console.error('骨架載入失敗', e); }
            toggle.parentElement && toggle.parentElement.classList.remove('loading-opt');
            loading = false;
          }
          if (boneScene) boneScene.visible = toggle.checked;
        });
      }
    }

    // 層級切換(可選):勾選「深層」時隱藏表層肌肉,露出底下深層
    if (config.layerToggle) {
      const lt = document.getElementById(config.layerToggle);
      if (lt) {
        const applyLayer = () => {
          for (const m of muscleMeshes)
            if (m.userData.layer === 'superficial') m.visible = !lt.checked;
        };
        lt.addEventListener('change', applyLayer);
        applyLayer();
      }
    }

    // 置中 → 立正(最長軸轉到垂直)→ 縮放(以肌肉範圍為基準)
    const box = new THREE.Box3().setFromObject(model.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    content.position.sub(center);
    if (size.z >= size.y && size.z >= size.x) pivot.rotation.x = -Math.PI / 2;
    else if (size.x >= size.y && size.x >= size.z) pivot.rotation.z = Math.PI / 2;
    pivot.scale.setScalar(5 / Math.max(size.x, size.y, size.z));

    applyColors();   // 預設:全部肌肉顯示原色,不自動選動作
    showIntro();
  }).catch((err) => {
    console.error('模型載入失敗', err);
    panel.innerHTML = `<p class="hint">模型載入失敗,請確認 ${config.modelUrl} 與本頁同目錄。</p>`;
  });

  // ---------- 狀態 ----------
  let selectedMuscle = null;
  let selectedExercise = null;
  let hovered = null;

  function applyColors() {
    for (const mesh of muscleMeshes) {
      const id = mesh.userData.muscle;
      let color = COLOR.base;
      if (selectedExercise) {
        const role = selectedExercise.targets[id];
        color = role ? COLOR[role] : COLOR.dim;
      } else if (selectedMuscle) {
        color = (id === selectedMuscle) ? COLOR.selected : COLOR.dim;
      }
      mesh.material.color.setHex(color);
      mesh.material.emissive.setHex(mesh === hovered ? 0x333333 : 0x000000);
    }
  }

  // 進入時的提示(未選任何動作/肌肉,全部肌肉顯示原色)
  function showIntro() {
    panel.innerHTML = `
      <div class="panel-head"><h2>${REGION}</h2><p class="sub">目前顯示全部肌肉</p></div>
      <p class="hint">💡 點 3D ${REGION}上的肌肉 → 反查練到它的動作;<br>或從上方「選動作」→ 看該動作牽涉哪些肌群。</p>`;
  }

  // ---------- 互動:Raycaster ----------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let tooltip;

  function pickMuscle(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(muscleMeshes, false);
    return hits.length ? hits[0].object : null;
  }

  // hover 節流:只記住最後一次事件,實際 raycast 在 animate 每幀最多做一次
  let pendingMove = null;
  renderer.domElement.addEventListener('pointermove', (e) => { pendingMove = e; });
  renderer.domElement.addEventListener('pointerleave', () => {
    pendingMove = null; hovered = null; hideTooltip(); applyColors();
  });
  function processHover() {
    if (!pendingMove) return;
    const e = pendingMove; pendingMove = null;
    const mesh = pickMuscle(e);
    if (mesh === hovered && mesh) { showTooltip(muscles[mesh.userData.muscle].zh, e); return; }
    hovered = mesh;
    renderer.domElement.style.cursor = mesh ? 'pointer' : 'grab';
    if (mesh) showTooltip(muscles[mesh.userData.muscle].zh, e);
    else hideTooltip();
    applyColors();
  }

  renderer.domElement.addEventListener('click', (e) => {
    const mesh = pickMuscle(e);
    if (mesh) selectMuscle(mesh.userData.muscle);
  });

  function showTooltip(text, e) {
    if (!tooltip) { tooltip = document.createElement('div'); tooltip.id = 'tooltip'; document.body.appendChild(tooltip); }
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top = (e.clientY + 14) + 'px';
  }
  function hideTooltip() { if (tooltip) tooltip.style.display = 'none'; }

  // ---------- 模式一:點肌肉 → 列動作 ----------
  function selectMuscle(id) {
    selectedMuscle = id;
    selectedExercise = null;
    updateStripActive(null);
    applyColors();

    const m = muscles[id];
    const hits = exercisesForMuscle(id).sort((a, b) => weight(a.role) - weight(b.role));
    const rows = hits.map(({ exercise, role }) => `
      <button class="ex-result ${role}" data-id="${exercise.id}">
        <span class="ex-result-name">${exercise.zh}</span>
        <span class="chip ${role}">${ROLE_LABEL[role]}</span>
      </button>`).join('');

    panel.innerHTML = `
      <div class="panel-head"><h2>${m.zh}</h2><p class="sub">${m.en}</p></div>
      <p class="panel-count">共 ${hits.length} 個動作練到這塊肌群:</p>
      <div class="ex-results">${rows}</div>`;

    panel.querySelectorAll('.ex-result').forEach(btn =>
      btn.addEventListener('click', () => {
        const ex = exercises.find(x => x.id === btn.dataset.id);
        if (ex) selectExercise(ex);
      }));
  }

  // ---------- 模式二:選動作 → 標肌群 ----------
  function selectExercise(ex) {
    selectedExercise = ex;
    selectedMuscle = null;
    updateStripActive(ex.id);
    applyColors();

    const here = REGION_MUSCLES.filter(m => ex.targets[m]);
    const other = Object.keys(ex.targets).filter(m => !REGION_MUSCLES.includes(m));
    const chip = (m) => `<span class="chip ${ex.targets[m]}">${muscles[m].zh}</span>`;

    panel.innerHTML = `
      <div class="panel-head"><h2>${ex.zh}</h2>
        <p class="sub">${ex.en} · ${ex.equipment} · ${ex.pattern}</p></div>
      <div class="panel-row">
        <div class="panel-label">本場景(${REGION})肌群</div>
        <div class="chips">${here.length ? here.map(chip).join('') : `<span class="sub">此動作不練${REGION}</span>`}</div>
      </div>
      <div class="panel-row">
        <div class="panel-label">其他部位</div>
        <div class="chips">${other.map(m => `<span class="chip">${muscles[m].zh}</span>`).join('') || '<span class="sub">—</span>'}</div>
      </div>
      <p class="hint">💡 點 3D ${REGION}上的肌肉,可反查練到它的所有動作</p>`;
  }

  const weight = (r) => ({ primary: 0, synergist: 1, stabilizer: 2 }[r]);

  // ---------- 上方動作快選列(只放有練到本部位的動作)----------
  const stripEl = document.getElementById('ex-strip');
  const regionExercises = exercises.filter(ex => REGION_MUSCLES.some(m => ex.targets[m]));
  stripEl.innerHTML = regionExercises.map(ex =>
    `<button data-id="${ex.id}">${ex.zh}</button>`).join('');
  stripEl.querySelectorAll('button').forEach(btn =>
    btn.addEventListener('click', () => {
      const ex = exercises.find(x => x.id === btn.dataset.id);
      if (ex) selectExercise(ex);
    }));
  function updateStripActive(id) {
    stripEl.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.id === id));
  }

  // ---------- 啟動 ----------
  function animate() {
    requestAnimationFrame(animate);
    processHover();
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  });
}
