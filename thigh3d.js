// 大腿 3D — 設定檔,實際邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';

initViewer({
  regionName: '大腿',
  modelUrl: 'thigh.glb',
  regionMuscles: ['quads', 'hamstrings', 'adductors', 'glutes'],
  bone: { url: 'femur.glb', toggleId: 'femur-toggle' },
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'back_squat'
});
