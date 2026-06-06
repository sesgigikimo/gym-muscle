// 背 3D — 設定檔,邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';
initViewer({
  regionName: '背',
  modelUrl: 'back.glb',
  regionMuscles: ['lats', 'traps', 'lower_back'],
  bone: { url: 'spine.glb', toggleId: 'bone-toggle' },
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'pull_up'
});
