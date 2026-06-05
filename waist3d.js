// 腰部 3D — 設定檔,實際邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';

initViewer({
  regionName: '腰部',
  modelUrl: 'waist.glb',
  regionMuscles: ['lower_back', 'obliques', 'abs'],
  bone: { url: 'spine.glb', toggleId: 'bone-toggle' },
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'deadlift'
});
