// 胸 3D — 設定檔,邏輯在 viewer3d.js
import { initViewer } from './viewer3d.js';
initViewer({
  regionName: '胸',
  modelUrl: 'chest.glb',
  regionMuscles: ['chest'],
  bone: { url: 'chest_bone.glb', toggleId: 'bone-toggle' },
  defaultExerciseId: 'bench_press'
});
