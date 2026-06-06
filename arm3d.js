// 手臂 3D — 設定檔,邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';
initViewer({
  regionName: '手臂',
  modelUrl: 'arm.glb',
  regionMuscles: ['biceps', 'triceps', 'forearm'],
  bone: { url: 'arm_bone.glb', toggleId: 'bone-toggle' },
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'biceps_curl'
});
