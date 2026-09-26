/* ------------------------------------------------------------------
   Orquestador de las piezas audiovisuales.

     node scripts/video/build.mjs [grupos…]     (logo reels historias portadas loops kit)

   1. arma los specs de cada grupo,
   2. genera todas las bandas sonoras en un solo lote de Python,
   3. renderiza los videos en paralelo y los mezcla con su audio.
   ------------------------------------------------------------------ */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderAll, ROOT } from './core.mjs';
import { compose } from '../../src/motion/scenes.mjs';
import { reels } from '../../src/motion/specs/reels.mjs';
import { logoReveal, LOGO_CUES } from '../../src/motion/specs/logo.mjs';
import { clases } from '../../src/motion/specs/clases.mjs';
import { cover169 } from '../../src/motion/specs/portadas.mjs';
import { relatos, ESTILO_TOMAS } from '../../src/motion/specs/relatos.mjs';
import { compose2 } from '../../src/motion/scenes2.mjs';
import { existsSync } from 'node:fs';

const want = process.argv.slice(2);
const only = process.env.ONLY?.split(',');           // ONLY=h1-dos-personas,h2-origen → solo esos
const has = g => !want.length || want.includes(g);
const AUD = resolve(ROOT, 'build/audio');
mkdirSync(AUD, { recursive: true });

const jobs = [];          // { video, audio? }

/* ------------------------------ logo ------------------------------ */
if (has('logo')) {
  const f = [
    ['logo-16x9', 1920, 1080, 200], ['logo-9x16', 1080, 1920, 150], ['logo-1x1', 1080, 1080, 150],
  ];
  for (const [id, w, h, bh] of f) {
    jobs.push({
      video: { ...logoReveal({ id, w, h, bh }), out: `logo/${id}.mp4` },
      audio: { dur: 6, music: false, cues: LOGO_CUES },
    });
  }
}

/* ------------------------------ reels ------------------------------ */
if (has('reels')) {
  for (const r of reels) {
    const { video, audio } = compose({ id: r.id, w: 1080, h: 1920, scenes: r.scenes, gx: r.gx });
    jobs.push({ video: { ...video, out: `reels/${r.id}.mp4` }, audio });
  }
  // el manifiesto también en horizontal, para YouTube y la web
  const m = reels.find(r => r.id === 'r0-manifiesto');
  const { video, audio } = compose({ id: 'r0-manifiesto-16x9', w: 1920, h: 1080, scenes: m.scenes, gx: m.gx });
  jobs.push({ video: { ...video, out: 'reels/r0-manifiesto-16x9.mp4' }, audio });
}

/* ------------------------------ clases ------------------------------
   Cada clase sale en Reel 9:16, en video 16:9 para YouTube y con su portada
   animada 16:9 (el póster de la portada sirve de miniatura). */
if (has('clases')) {
  for (const k of clases) {
    for (const [w, h, suf] of [[1080, 1920, ''], [1920, 1080, '-16x9']]) {
      const { video, audio } = compose({ id: k.id + suf, w, h, scenes: k.scenes, gx: k.gx, progress: true });
      // CRF 20: las clases duran ~1 min; a 18 pasan los 15 MB por archivo que admite la
      // galería, y la diferencia medida es imperceptible (SSIM 0,999)
      jobs.push({ video: { ...video, crf: 20, out: `clases/${k.id}${suf}.mp4` }, audio });
    }
    const art = (k.scenes.find(s => s.art) || {}).art || 'hexRoute';
    jobs.push(cover169({ id: k.id, h1: k.mini, art, gx: `${k.gx}%`, gy: '90%' },
      { prefix: 'miniatura-', out: 'clases' }));
  }
}

/* ------------------------------ relatos ------------------------------
   Motion v2 (scenes2.mjs): desenfoque de movimiento por subcuadros (MB=5),
   ritmo rápido, contenido desde el primer cuadro y final en loop.
   Tomas generadas (Higgsfield u otra): si existe assets/tomas/<relato>/<NN>.mp4,
   entra de fondo en la escena NN sin tocar el guion. */
if (has('relatos')) {
  const doc = [];
  for (const k of relatos) {
    const scenes = k.scenes.map((s, i) => {
      const clip = `assets/tomas/${k.id}/${String(i + 1).padStart(2, '0')}.mp4`;
      return existsSync(resolve(ROOT, clip)) ? { ...s, bg: clip } : s;
    });
    const { video, audio } = compose2({ id: k.id, scenes, mb: +(process.env.MB || 5) });
    if (!only || only.includes(k.id)) jobs.push({ video: { ...video, out: `relatos/${k.id}.mp4` }, audio });
    doc.push({ id: k.id, titulo: k.titulo, dur: video.dur, tomas: video.shots,
      conClip: video.bgs.length });
  }
  writeTomas(doc);
}

/** Documento de tomas para generar con Higgsfield: un .md para leer y un .json para automatizar. */
function writeTomas(doc) {
  const dir = resolve(ROOT, 'out/higgsfield');
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'tomas.json'), JSON.stringify({ estilo: ESTILO_TOMAS, formato: '9:16, 1080×1920, 30 fps',
    relatos: doc }, null, 1));
  const md = ['# Tomas para generar — Relatos', '',
    'Cada escena de los Relatos tiene su toma. Al generarla, guardala como',
    '`assets/tomas/<relato>/<NN>.mp4` (NN = número de escena, con dos cifras) y corré',
    '`node scripts/video/build.mjs relatos`: el clip entra de fondo solo, con el texto encima.', '',
    `**Estilo común (sumalo a cada prompt):** ${ESTILO_TOMAS}`, '',
    '**Formato:** vertical 9:16, 1080×1920. La duración de cada toma está en la tabla; generá un poco más larga.', '',
    ...doc.flatMap(r => [`## ${r.titulo}`, '', `\`${r.id}\` · ${r.dur} s · ${r.tomas.length} tomas`, '',
      '| # | Duración | Toma | Cámara |', '|---|---|---|---|',
      ...r.tomas.map(t => `| ${String(t.escena).padStart(2, '0')} | ${t.dur} s | ${t.toma} | ${t.camara} |`), ''])].join('\n');
  writeFileSync(resolve(dir, 'tomas.md'), md);
  console.log(`🎬 ${doc.reduce((n, r) => n + r.tomas.length, 0)} tomas documentadas en out/higgsfield/`);
}

/* ----------------------------- el resto ----------------------------- */
for (const g of ['historias', 'portadas', 'citas', 'loops', 'kit']) {
  if (!has(g)) continue;
  try {
    const mod = await import(`../../src/motion/specs/${g}.mjs`);
    for (const j of mod.jobs()) jobs.push(j);
  } catch (e) {
    if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
  }
}

/* --------------------------- bandas sonoras --------------------------- */
const batch = jobs.filter(j => j.audio).map(j => ({ spec: j.audio, out: resolve(AUD, `${j.video.id}.wav`) }));
if (batch.length) {
  writeFileSync(resolve(AUD, 'lote.json'), JSON.stringify(batch));
  console.log(`♪ ${batch.length} bandas sonoras`);
  const r = spawnSync('python3', [resolve(ROOT, 'scripts/audio/synth.py'), resolve(AUD, 'lote.json')], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
  jobs.forEach(j => { if (j.audio) j.video.audio = resolve(AUD, `${j.video.id}.wav`); });
}

/* ------------------------------- video ------------------------------- */
console.log(`▶ ${jobs.length} videos`);
const browser = await chromium.launch();
await renderAll(browser, jobs.map(j => j.video), +(process.env.JOBS || 3));
await browser.close();
