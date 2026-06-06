// 腰臀(後鏈)3D — 設定檔,實際邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';

initViewer({
  regionName: '腰臀',
  modelUrl: 'waistglute.glb',
  regionMuscles: ['lower_back', 'obliques', 'abs', 'glutes'],
  bone: { url: 'spine.glb', toggleId: 'bone-toggle' },
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'deadlift'
});
