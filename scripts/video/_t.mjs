import { chromium } from 'playwright';
import { preview } from './preview.mjs';
import { compose, BEAT } from '../../src/motion/scenes.mjs';
import { reels } from '../../src/motion/specs/reels.mjs';
import { clases } from '../../src/motion/specs/clases.mjs';
// uso: _t.mjs <id> <W> <H> <escenas: índices, se toma cada una a mitad y al final> [salida]
const [id, W, H, sc, dest] = process.argv.slice(2);
const r = [...reels, ...clases].find(x => x.id === id);
const { video } = compose({ id: id + '-p' + W, w: +W, h: +H, scenes: r.scenes, gx: r.gx, progress: true });
let t = 0; const starts = r.scenes.map(s => { const a = t; t += s.len * BEAT; return a; });
const times = sc.split(',').map(Number).flatMap(i => [starts[i] + r.scenes[i].len * BEAT * .55, starts[i] + r.scenes[i].len * BEAT - .2]);
const b = await chromium.launch();
await preview(b, video, times, dest || '/tmp/claude-0/-home-user-productos-digitale/0692225e-178c-5656-a5c4-430d8ad21b4c/scratchpad/prev.jpg', { thumb: +W > +H ? 470 : 250 });
await b.close();
console.log(id, 'dur', video.dur);
