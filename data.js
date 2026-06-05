// ============================================================
//  肌群定義 + 動作對照資料
//  - muscles: 每塊肌群的中英文名與所在視圖(front / back / both)
//  - exercises: 每個動作牽涉的肌群與角色(主動 / 協同 / 穩定)
//  資料結構刻意與 UI/框架無關,之後搬到 React 或改成 JSON 都無痛。
// ============================================================

// 肌群角色
export const ROLE = {
  PRIMARY: 'primary',     // 主動肌
  SYNERGIST: 'synergist', // 協同肌
  STABILIZER: 'stabilizer' // 穩定肌
};

export const ROLE_LABEL = {
  primary: '主動肌',
  synergist: '協同肌',
  stabilizer: '穩定肌'
};

// ---- 肌群清單 ----
// id 對應到 SVG 裡 data-muscle 的值
export const muscles = {
  chest:      { zh: '胸大肌',       en: 'Pectoralis Major', views: ['front'] },
  deltoids:   { zh: '三角肌',       en: 'Deltoids',         views: ['front', 'back'] },
  biceps:     { zh: '肱二頭肌',     en: 'Biceps Brachii',   views: ['front'] },
  triceps:    { zh: '肱三頭肌',     en: 'Triceps Brachii',  views: ['front', 'back'] },
  forearm:    { zh: '前臂',         en: 'Forearms',         views: ['front', 'back'] },
  abs:        { zh: '腹直肌',       en: 'Rectus Abdominis', views: ['front'] },
  obliques:   { zh: '腹斜肌',       en: 'Obliques',         views: ['front'] },
  traps:      { zh: '斜方肌',       en: 'Trapezius',        views: ['front', 'back'] },
  lats:       { zh: '背闊肌',       en: 'Latissimus Dorsi', views: ['back'] },
  lower_back: { zh: '豎脊肌(下背)', en: 'Erector Spinae',   views: ['back'] },
  glutes:     { zh: '臀大肌',       en: 'Gluteus Maximus',  views: ['back'] },
  quads:      { zh: '股四頭肌',     en: 'Quadriceps',       views: ['front'] },
  hamstrings: { zh: '腿後肌群',     en: 'Hamstrings',       views: ['back'] },
  calves:     { zh: '小腿(腓腸肌)', en: 'Calves',           views: ['front', 'back'] },
  adductors:  { zh: '內收肌群',     en: 'Adductors',        views: ['front', 'back'] }
};

// ---- 動作清單 ----
// targets: { 肌群id: 角色 }
export const exercises = [
  {
    id: 'bench_press', zh: '槓鈴臥推', en: 'Barbell Bench Press',
    equipment: '槓鈴', pattern: '水平推',
    targets: { chest: ROLE.PRIMARY, deltoids: ROLE.SYNERGIST, triceps: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'back_squat', zh: '槓鈴深蹲', en: 'Barbell Back Squat',
    equipment: '槓鈴', pattern: '蹲',
    targets: { quads: ROLE.PRIMARY, glutes: ROLE.PRIMARY, hamstrings: ROLE.SYNERGIST, adductors: ROLE.SYNERGIST, lower_back: ROLE.SYNERGIST, abs: ROLE.STABILIZER, calves: ROLE.STABILIZER }
  },
  {
    id: 'deadlift', zh: '傳統硬舉', en: 'Conventional Deadlift',
    equipment: '槓鈴', pattern: '髖鉸鏈',
    targets: { glutes: ROLE.PRIMARY, hamstrings: ROLE.PRIMARY, lower_back: ROLE.PRIMARY, quads: ROLE.SYNERGIST, traps: ROLE.SYNERGIST, lats: ROLE.SYNERGIST, forearm: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'pull_up', zh: '引體向上', en: 'Pull-up',
    equipment: '徒手', pattern: '垂直拉',
    targets: { lats: ROLE.PRIMARY, biceps: ROLE.SYNERGIST, deltoids: ROLE.SYNERGIST, traps: ROLE.SYNERGIST, forearm: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'barbell_row', zh: '槓鈴划船', en: 'Barbell Row',
    equipment: '槓鈴', pattern: '水平拉',
    targets: { lats: ROLE.PRIMARY, traps: ROLE.SYNERGIST, deltoids: ROLE.SYNERGIST, biceps: ROLE.SYNERGIST, lower_back: ROLE.STABILIZER }
  },
  {
    id: 'overhead_press', zh: '站姿肩推', en: 'Overhead Press',
    equipment: '槓鈴', pattern: '垂直推',
    targets: { deltoids: ROLE.PRIMARY, triceps: ROLE.SYNERGIST, traps: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'biceps_curl', zh: '啞鈴二頭彎舉', en: 'Dumbbell Biceps Curl',
    equipment: '啞鈴', pattern: '單關節',
    targets: { biceps: ROLE.PRIMARY, forearm: ROLE.SYNERGIST }
  },
  {
    id: 'triceps_pushdown', zh: '三頭下壓', en: 'Triceps Pushdown',
    equipment: '纜繩', pattern: '單關節',
    targets: { triceps: ROLE.PRIMARY, forearm: ROLE.SYNERGIST }
  },
  {
    id: 'lateral_raise', zh: '啞鈴側平舉', en: 'Lateral Raise',
    equipment: '啞鈴', pattern: '單關節',
    targets: { deltoids: ROLE.PRIMARY, traps: ROLE.SYNERGIST }
  },
  {
    id: 'leg_press', zh: '腿推', en: 'Leg Press',
    equipment: '機械', pattern: '蹲',
    targets: { quads: ROLE.PRIMARY, glutes: ROLE.PRIMARY, hamstrings: ROLE.SYNERGIST, adductors: ROLE.SYNERGIST }
  },
  {
    id: 'rdl', zh: '羅馬尼亞硬舉', en: 'Romanian Deadlift',
    equipment: '槓鈴', pattern: '髖鉸鏈',
    targets: { hamstrings: ROLE.PRIMARY, glutes: ROLE.PRIMARY, lower_back: ROLE.SYNERGIST, forearm: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'lat_pulldown', zh: '滑輪下拉', en: 'Lat Pulldown',
    equipment: '纜繩', pattern: '垂直拉',
    targets: { lats: ROLE.PRIMARY, biceps: ROLE.SYNERGIST, deltoids: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'dips', zh: '雙槓臂屈伸', en: 'Dips',
    equipment: '徒手', pattern: '垂直推',
    targets: { chest: ROLE.PRIMARY, triceps: ROLE.PRIMARY, deltoids: ROLE.SYNERGIST, abs: ROLE.STABILIZER }
  },
  {
    id: 'plank', zh: '棒式', en: 'Plank',
    equipment: '徒手', pattern: '核心',
    targets: { abs: ROLE.PRIMARY, obliques: ROLE.SYNERGIST, lower_back: ROLE.SYNERGIST }
  },
  {
    id: 'seated_row', zh: '坐姿滑輪划船', en: 'Seated Cable Row',
    equipment: '纜繩', pattern: '水平拉',
    targets: { lats: ROLE.PRIMARY, traps: ROLE.PRIMARY, biceps: ROLE.SYNERGIST, deltoids: ROLE.SYNERGIST, lower_back: ROLE.STABILIZER }
  },
  {
    id: 'calf_raise', zh: '站姿提踵', en: 'Standing Calf Raise',
    equipment: '機械', pattern: '單關節',
    targets: { calves: ROLE.PRIMARY }
  }
];

// ---- 反查索引:肌群 -> 練到它的動作清單 ----
export function exercisesForMuscle(muscleId) {
  return exercises
    .filter(ex => ex.targets[muscleId])
    .map(ex => ({ exercise: ex, role: ex.targets[muscleId] }));
}
