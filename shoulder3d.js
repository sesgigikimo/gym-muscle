// 肩 3D — 設定檔,邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';
initViewer({
  regionName: '肩',
  modelUrl: 'shoulder.glb',
  regionMuscles: ['deltoids', 'traps'],
  bone: { url: 'shoulder_bone.glb', toggleId: 'bone-toggle' },
  defaultExerciseId: 'overhead_press'
});
