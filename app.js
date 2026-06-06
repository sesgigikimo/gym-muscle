// ============================================================
//  互動邏輯:動作 <-> 肌群 雙向查詢
// ============================================================
import { muscles, exercises, exercisesForMuscle, ROLE_LABEL } from './data.js';
import { BODY_SVG } from './body.js';

let selectedExercise = null;      // 目前選的動作物件
let selectedMuscle = null;        // 目前選的肌群 id(肌群查動作模式)

const $ = (sel) => document.querySelector(sel);
const bodyContainer = $('#body-container');
const panel = $('#panel');
const exerciseList = $('#exercise-list');

// ---------- 渲染人體 SVG(前 / 後視圖並排,不切換)----------
function renderBody() {
  bodyContainer.innerHTML = `
    <div class="figure"><span class="fig-cap">前面</span>${BODY_SVG.front}</div>
    <div class="figure"><span class="fig-cap">背面</span>${BODY_SVG.back}</div>`;
  // 綁定每塊肌肉的點擊事件(前後兩張圖的同名肌肉都會綁到)
  bodyContainer.querySelectorAll('.muscle').forEach(el => {
    el.addEventListener('click', () => selectMuscle(el.dataset.muscle));
    el.addEventListener('mouseenter', () => showMuscleTooltip(el.dataset.muscle));
    el.addEventListener('mouseleave', hideTooltip);
  });
  applyHighlight();
}

// ---------- 依目前選擇,把肌肉上色 ----------
function applyHighlight() {
  bodyContainer.querySelectorAll('.muscle').forEach(el => {
    el.classList.remove('primary', 'synergist', 'stabilizer', 'selected');
  });

  if (selectedExercise) {
    for (const [muscleId, role] of Object.entries(selectedExercise.targets)) {
      bodyContainer
        .querySelectorAll(`.muscle[data-muscle="${muscleId}"]`)
        .forEach(el => el.classList.add(role));
    }
  }

  if (selectedMuscle) {
    bodyContainer
      .querySelectorAll(`.muscle[data-muscle="${selectedMuscle}"]`)
      .forEach(el => el.classList.add('selected'));
  }
}

// ---------- 模式一:選動作 -> 標出肌群 ----------
function selectExercise(ex) {
  selectedExercise = ex;
  selectedMuscle = null;

  // 高亮清單項目
  exerciseList.querySelectorAll('.ex-item').forEach(el =>
    el.classList.toggle('active', el.dataset.id === ex.id));

  applyHighlight();
  renderExercisePanel(ex);
}

function renderExercisePanel(ex) {
  const groups = { primary: [], synergist: [], stabilizer: [] };
  for (const [muscleId, role] of Object.entries(ex.targets)) {
    groups[role].push(muscles[muscleId]);
  }

  const section = (role) => {
    if (!groups[role].length) return '';
    const items = groups[role]
      .map(m => `<span class="chip ${role}">${m.zh}</span>`)
      .join('');
    return `<div class="panel-row">
      <div class="panel-label"><span class="dot ${role}"></span>${ROLE_LABEL[role]}</div>
      <div class="chips">${items}</div>
    </div>`;
  };

  panel.innerHTML = `
    <div class="panel-head">
      <h2>${ex.zh}</h2>
      <p class="sub">${ex.en} · ${ex.equipment} · ${ex.pattern}</p>
    </div>
    ${section('primary')}
    ${section('synergist')}
    ${section('stabilizer')}
    <p class="hint">💡 點左圖的肌肉,可反查「練到它的所有動作」</p>
  `;
}

// ---------- 模式二:點肌群 -> 列出動作 ----------
function selectMuscle(muscleId) {
  selectedMuscle = muscleId;
  selectedExercise = null;
  exerciseList.querySelectorAll('.ex-item').forEach(el => el.classList.remove('active'));

  applyHighlight();

  const m = muscles[muscleId];
  const hits = exercisesForMuscle(muscleId)
    .sort((a, b) => roleWeight(a.role) - roleWeight(b.role));

  const rows = hits.map(({ exercise, role }) => `
    <button class="ex-result ${role}" data-id="${exercise.id}">
      <span class="ex-result-name">${exercise.zh}</span>
      <span class="chip ${role}">${ROLE_LABEL[role]}</span>
    </button>`).join('');

  panel.innerHTML = `
    <div class="panel-head">
      <h2>${m.zh}</h2>
      <p class="sub">${m.en}</p>
    </div>
    <p class="panel-count">共 ${hits.length} 個動作練到這塊肌群:</p>
    <div class="ex-results">${rows || '<p class="hint">目前資料庫還沒有對應動作</p>'}</div>
  `;

  // 點反查結果可跳回動作模式
  panel.querySelectorAll('.ex-result').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = exercises.find(e => e.id === btn.dataset.id);
      if (ex) selectExercise(ex);
    });
  });
}

const roleWeight = (role) => ({ primary: 0, synergist: 1, stabilizer: 2 }[role]);

// ---------- Tooltip ----------
let tooltip;
function showMuscleTooltip(muscleId) {
  const m = muscles[muscleId];
  if (!m) return;
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = `${m.zh} · ${m.en}`;
  tooltip.style.display = 'block';
}
function hideTooltip() { if (tooltip) tooltip.style.display = 'none'; }
document.addEventListener('mousemove', (e) => {
  if (tooltip && tooltip.style.display === 'block') {
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top = (e.clientY + 14) + 'px';
  }
});

// ---------- 建動作清單 ----------
function buildExerciseList() {
  exerciseList.innerHTML = exercises.map(ex => `
    <button class="ex-item" data-id="${ex.id}">
      <span class="ex-name">${ex.zh}</span>
      <span class="ex-meta">${ex.equipment}</span>
    </button>`).join('');

  exerciseList.querySelectorAll('.ex-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = exercises.find(e => e.id === btn.dataset.id);
      if (ex) selectExercise(ex);
    });
  });
}

// ---------- 進入時的提示(預設顯示全部肌肉,不自動選動作)----------
function showIntro() {
  panel.innerHTML = `
    <div class="panel-head">
      <h2>重訓肌群解剖圖</h2>
      <p class="sub">目前顯示全部肌肉</p>
    </div>
    <p class="hint">💡 從左側選一個動作 → 看牽涉的肌群;<br>或點人體圖上的肌肉 → 反查練到它的所有動作。</p>`;
}

// ---------- 初始化 ----------
function init() {
  buildExerciseList();
  renderBody();
  showIntro(); // 預設展示全部肌肉,不自動選動作
}

init();
