/* ------------------------------------------------------------------
   Renderizador de video: arma la página, la posiciona frame por frame
   con __seek(t) y le pasa cada captura a ffmpeg por una tubería.
   ------------------------------------------------------------------ */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const BUILD = resolve(ROOT, 'build/video');
export const OUT = resolve(ROOT, 'out/video');

const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
     </filter><rect width="220" height="220" filter="url(#n)"/></svg>`)}`;

/** Fondo de marca: fuga dorada, viñeta, grano animado y polvo. */
export const atmosphere = ({ dust = true } = {}) => `
  <div class="atmo"></div>
  <div class="vignette"></div>
  <div class="grain" style="background-image:url('${GRAIN}');opacity:.07"></div>
  ${dust ? '<canvas class="dust" id="dust"></canvas>' : ''}`;

export function page(spec) {
  const { w, h, fps = 30, body, timeline, css = '', alpha = false, dust = true } = spec;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="../../src/brand.css">
<link rel="stylesheet" href="../../src/motion/motion.css">
<style>html,body{background:${alpha ? 'transparent' : '#000'}}
  .stage{width:${w}px;height:${h}px} ${css}</style>
<script>window.__FPS=${fps}</script>
<script src="../../src/motion/engine.js"></script>
</head><body>
<div class="stage ${alpha ? 'stage--alpha' : ''}" style="--gx:${spec.gx || '86%'};--gy:${spec.gy || '92%'};--gx2:${spec.gx2 || '6%'};--gy2:${spec.gy2 || '40%'}">
  ${alpha ? '' : atmosphere({ dust })}
  ${body}
</div>
<script>
(function(){
  const {tw,set,glitch,drawArt,lines,breathe,setupDust,fit} = PD;
  fit();
  const stage = document.querySelector('.stage');
  ${dust && !alpha ? `setupDust(document.getElementById('dust'), ${JSON.stringify(spec.dustOpts || {})});` : ''}
  ${timeline}
})();
</script></body></html>`;
}

function ffmpeg(args) {
  const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args],
    { stdio: ['pipe', 'inherit', 'pipe'] });
  let err = '';
  p.stderr.on('data', d => (err += d));
  const done = new Promise((res, rej) => p.on('close', c => (c ? rej(new Error(err)) : res())));
  return { p, done };
}

const write = (stream, buf) => new Promise(res => (stream.write(buf) ? res() : stream.once('drain', res)));

/**
 * Renderiza un video. Devuelve la ruta del archivo final.
 * spec: { id, w, h, fps, dur, body, timeline, alpha, poster, out }
 */
export async function render(browser, spec, { log = () => {} } = {}) {
  const fps = spec.fps || 30;
  mkdirSync(BUILD, { recursive: true });
  const html = join(BUILD, `${spec.id}.html`);
  writeFileSync(html, page(spec));

  const pg = await browser.newPage({ viewport: { width: spec.w, height: spec.h }, deviceScaleFactor: 1 });
  const errors = [];
  pg.on('pageerror', e => errors.push(e.message));
  await pg.goto('file://' + html);
  await pg.evaluate(async () => { await document.fonts.ready; });
  await pg.waitForTimeout(150);
  if (errors.length) throw new Error(`${spec.id}: ${errors.join(' | ')}`);

  const dur = spec.dur ?? await pg.evaluate(() => PD.dur);
  const frames = Math.round(dur * fps);
  const dest = resolve(OUT, spec.out || `${spec.id}.mp4`);
  mkdirSync(dirname(dest), { recursive: true });

  const silent = dest.replace(/\.(mp4|mov|webm)$/, '.silent.$1');
  const enc = spec.alpha
    ? ffmpeg(['-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
        // PNG dentro de MOV: sin pérdida, con alfa, y las zonas transparentes casi no pesan
        '-c:v', 'png', '-pix_fmt', 'rgba',
        spec.audio ? silent : dest])
    : ffmpeg(['-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', String(spec.crf ?? 18), '-pix_fmt', 'yuv420p',
        '-profile:v', 'high', '-movflags', '+faststart', '-r', String(fps),
        spec.audio ? silent : dest]);

  const shot = spec.alpha ? { type: 'png', omitBackground: true } : { type: 'jpeg', quality: 93 };
  const posterAt = spec.poster ?? dur * .7;
  let posterDone = false;
  for (let f = 0; f < frames; f++) {
    const t = f / fps;
    await pg.evaluate(tt => window.__seek(tt), t);
    const buf = await pg.screenshot(shot);
    await write(enc.p.stdin, buf);
    if (!posterDone && t >= posterAt) {
      const pdst = dest.replace(/(\.silent)?\.(mp4|mov|webm)$/, '.jpg');
      await pg.screenshot({ path: pdst, type: 'jpeg', quality: 88 });
      posterDone = true;
    }
    if (f % 60 === 0) log(`${spec.id} ${f}/${frames}`);
  }
  enc.p.stdin.end();
  await enc.done;
  await pg.close();

  if (spec.audio) {
    // audio AAC 48 kHz; el master ya viene a -14 LUFS
    const mux = ffmpeg(['-i', silent, '-i', spec.audio,
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
      ...(spec.alpha ? ['-c:a', 'pcm_s16le'] : ['-c:a', 'aac', '-b:a', '192k']),
      '-shortest', ...(spec.alpha ? [] : ['-movflags', '+faststart']), dest]);
    await mux.done;
    (await import('node:fs')).unlinkSync(silent);
  }
  if (spec.webm) {                                    // variante liviana con alfa para la web
    const wb = ffmpeg(['-i', dest, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '32',
      '-row-mt', '1', '-an', dest.replace(/\.mov$/, '.webm')]);
    await wb.done;
  }
  return { dest, frames, bytes: statSync(dest).size };
}

/** Corre una lista de specs con N páginas en paralelo. */
export async function renderAll(browser, specs, n = 3) {
  const queue = [...specs];
  const results = [];
  const t0 = Date.now();
  const worker = async () => {
    while (queue.length) {
      const s = queue.shift();
      const t = Date.now();
      const r = await render(browser, s);
      results.push(r);
      console.log(`  ✓ ${s.id.padEnd(28)} ${String(r.frames).padStart(4)} frames  ` +
        `${(r.bytes / 1e6).toFixed(1).padStart(5)} MB  ${((Date.now() - t) / 1000).toFixed(0)}s`);
    }
  };
  await Promise.all(Array.from({ length: n }, worker));
  console.log(`${results.length} videos en ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  return results;
}

export { existsSync };
