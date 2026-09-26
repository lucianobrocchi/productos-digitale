import { chromium } from 'playwright';
import { preview } from './preview.mjs';
import { compose } from '../../src/motion/scenes.mjs';
import { reels } from '../../src/motion/specs/reels.mjs';
const id = process.argv[2] || 'r1-metodo', W = +(process.argv[3]||1080), H = +(process.argv[4]||1920);
const times = (process.argv[5]||'').split(',').filter(Boolean).map(Number);
const r = reels.find(x => x.id === id);
const { video, audio } = compose({ id: id + (W>H?'-169':''), w: W, h: H, scenes: r.scenes, gx: r.gx });
console.log('duración', video.dur, 's · escenas', r.scenes.length, '· cues', audio.cues.length);
const b = await chromium.launch();
await preview(b, video, times.length ? times : [0.4,1.9,3.9,6.8,9,13,14.5,17,19.5,21.5,23.5,27],
  '/tmp/claude-0/-home-user-productos-digitale/0692225e-178c-5656-a5c4-430d8ad21b4c/scratchpad/prev.jpg', { thumb: W>H?520:300 });
await b.close();
