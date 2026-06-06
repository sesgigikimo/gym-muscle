// 全身 3D — 設定檔,實際邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';

initViewer({
  regionName: '全身',
  modelUrl: 'fullbody.glb',   // Draco 壓縮,15 肌群皆已標 id
  regionMuscles: ['chest', 'deltoids', 'biceps', 'triceps', 'forearm', 'abs', 'obliques',
                  'traps', 'lats', 'lower_back', 'glutes', 'quads', 'hamstrings', 'calves', 'adductors'],
  bone: { url: 'skeleton.glb', toggleId: 'bone-toggle' },   // 全身骨架(lazy load)
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'deadlift'
});
