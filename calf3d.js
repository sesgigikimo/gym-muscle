// 小腿 3D — 設定檔,邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';
initViewer({
  regionName: '小腿',
  modelUrl: 'calf.glb',
  regionMuscles: ['calves'],
  bone: { url: 'calf_bone.glb', toggleId: 'bone-toggle' },
  layerToggle: 'layer-toggle',
  defaultExerciseId: 'calf_raise'
});
