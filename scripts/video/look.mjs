/* Revisión rápida: node scripts/video/look.mjs <grupo> <id|índice> t1,t2,… [salida.jpg] */
import { chromium } from 'playwright';
import { preview } from './preview.mjs';
const [g, which, ts, dest] = process.argv.slice(2);
const mod = await import(`../../src/motion/specs/${g}.mjs`);
const all = mod.jobs();
const j = all.find(x => x.video.id === which) || all[+which];
const b = await chromium.launch();
const v = { ...j.video, id: j.video.id + '-look', css: (j.video.css || '') + (j.video.alpha ? 'html,body{background:#4a4a4a !important}' : '') };
await preview(b, v, ts.split(',').map(Number),
  dest || '/tmp/claude-0/-home-user-productos-digitale/0692225e-178c-5656-a5c4-430d8ad21b4c/scratchpad/look.jpg',
  { thumb: v.w > v.h ? 560 : (v.w === v.h ? 380 : 300) });
await b.close();
console.log(j.video.id, v.w + 'x' + v.h, 'dur', j.video.dur);
