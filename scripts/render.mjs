/* ------------------------------------------------------------------
   Genera todas las piezas y las exporta como PNG.
   Se renderiza al doble de escala y se reduce después: da un antialias
   mucho más limpio en tipografía grande y en los trazos con glow.
   ------------------------------------------------------------------ */

import { chromium } from 'playwright';
import { library, iconYes, iconNo } from '../src/illus.mjs';
import { carousels, stories, squares, covers, HANDLE } from '../src/content.mjs';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const BUILD = resolve(root, 'build/pages');
const OUT = resolve(root, 'out');
const SCALE = 2;

rmSync(BUILD, { recursive: true, force: true });
mkdirSync(BUILD, { recursive: true });

const art = (name, id) => library[name] ? library[name](id) : '';

/** Compone un titular en líneas fijas; la última va en dorado. */
const lines = (arr, { goldLast = true } = {}) => arr.map((t, i) =>
  `<span class="line">${goldLast && i === arr.length - 1 ? `<span class="gold">${t}</span>` : t}</span>`
).join('');

/** Reduce el cuerpo del titular hasta que la línea más ancha entra en la caja. */
const FIT = `<script>
  window.__fit = () => {
    document.querySelectorAll('[data-fit]').forEach(el => {
      const box = el.getBoundingClientRect().width;
      const ln = [...el.querySelectorAll('.line')];
      if (!ln.length) return;
      const widest = () => Math.max(...ln.map(l => l.getBoundingClientRect().width));
      let size = parseFloat(getComputedStyle(el).fontSize), guard = 0;
      while (widest() > box && size > 14 && guard++ < 300) {
        size -= 1; el.style.fontSize = size + 'px';
      }
    });
  };
<\/script>`;

/* --------------------------- fondo y textura --------------------------- */

const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
     </filter><rect width="220" height="220" filter="url(#n)"/></svg>`)}`;

/** Retícula hexagonal tenue, guiño a la construcción del isotipo. */
const MESH = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="104" viewBox="0 0 120 104">
     <g fill="none" stroke="%23F0E281" stroke-width="1" opacity="0.5">
       <path d="M30 0 L90 0 L120 52 L90 104 L30 104 L0 52 Z"/>
     </g></svg>`).replace(/%2523/g, '%23')}`;

function shell({ kind, gx = '86%', gy = '92%', gx2 = '4%', gy2 = '48%', logo = 'lockup-oscuro',
                 mesh = false, body, foot = '' }) {
  return `
<div class="piece piece--${kind}" style="--gx:${gx};--gy:${gy};--gx2:${gx2};--gy2:${gy2}">
  <div class="atmo"></div>
  ${mesh ? `<div class="mesh" style="background-image:url('${MESH}');background-size:240px 208px"></div>` : ''}
  <div class="vignette"></div>
  <div class="grain" style="background-image:url('${GRAIN}')"></div>
  <img class="logo" src="../../brand/logo/${logo}.png" alt="">
  ${body}
  ${foot}
</div>`;
}

const foot = (left, right) => `<div class="foot"><span>${left}</span>${right}</div>`;
const pager = (i, n) => `<span class="pager"><b>${String(i).padStart(2, '0')}</b> / ${String(n).padStart(2, '0')}</span>`;
const swipe = `<span class="swipe">Deslizá <svg width="30" height="16" viewBox="0 0 30 16" fill="none">
  <path d="M2 8h24M20 2l6 6-6 6" stroke="#F0E281" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

/* ============================ plantillas ============================ */

/** Portada de carrusel — la composición firma de la marca. */
const tCover = (s, i, n, id) => shell({
  kind: '45', gx: s.gx, gy: s.gy, mesh: true,
  body: `
  <div class="stack pad" style="flex:1;padding-top:170px;padding-bottom:150px">
    <div style="flex:1;display:grid;place-items:center">
      <div class="art" style="position:relative;width:600px;height:600px">${art(s.art, id)}</div>
    </div>
    <div>
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="h1" data-fit style="margin-top:26px;font-size:92px">${lines(s.h1)}</h1>
      <div class="rule"></div>
      <p class="lede" style="margin-top:28px;max-width:26ch">${s.lede}</p>
    </div>
  </div>`,
  foot: foot(HANDLE, swipe),
});

/** Afirmación grande: el golpe conceptual. */
const tStatement = (s, i, n, id) => shell({
  kind: '45', gx: '14%', gy: '16%', gx2: '92%', gy2: '88%',
  body: `
  <div class="stack pad" style="flex:1;padding-top:170px;padding-bottom:150px">
    <div style="flex:1;display:grid;place-items:center">
      <div class="art" style="position:relative;width:470px;height:470px;opacity:.95">${art(s.art, id)}</div>
    </div>
    <div>
      <div class="quote" data-fit>${lines(s.h, { goldLast: false })}</div>
      <div class="rule rule--short"></div>
      ${s.lede ? `<p class="lede" style="margin-top:26px;max-width:28ch">${s.lede}</p>` : ''}
    </div>
  </div>`,
  foot: foot(HANDLE, pager(i, n)),
});

/** Paso numerado del método. */
const tStep = (s, i, n, id) => shell({
  kind: '45', gx: '90%', gy: '10%', gx2: '6%', gy2: '92%',
  body: `
  <div class="stack pad" style="flex:1;padding-top:170px;padding-bottom:150px">
    <div style="flex:1;display:grid;place-items:center">
      <div class="art" style="position:relative;width:440px;height:440px">${art(s.art, id)}</div>
    </div>
    <div>
      <div style="display:flex;align-items:center;gap:20px">
        <span class="card__n" style="width:64px;height:64px;font-size:30px;border-radius:16px">${s.n}</span>
        <span class="eyebrow" style="font-size:21px">Paso ${s.n}</span>
      </div>
      <h3 class="h3" style="margin-top:28px">${s.titulo}</h3>
      <div class="rule rule--short"></div>
      <p class="lede" style="margin-top:26px;max-width:30ch;font-size:31px">${s.d}</p>
    </div>
  </div>`,
  foot: foot(HANDLE, pager(i, n)),
});

/** Mito / lo que pasa de verdad. */
const tMyth = (s, i, n, id) => shell({
  kind: '45', gx: '88%', gy: '90%', gx2: '8%', gy2: '12%',
  body: `
  <div class="stack pad" style="flex:1;padding-top:170px;padding-bottom:150px">
    <div style="flex:1;display:grid;place-items:center">
      <div class="art" style="position:relative;width:470px;height:470px">${art(s.art, id)}</div>
    </div>
    <div>
      <div class="tf" style="align-items:flex-start">
        <span class="tf__i">${iconNo}</span>
        <div>
          <div class="eyebrow" style="font-size:19px;color:rgba(242,242,242,.42)">Mito ${s.n}</div>
          <div class="tf__t" style="margin-top:10px;color:rgba(242,242,242,.52);font-size:35px">“${s.mito}”</div>
        </div>
      </div>
      <div class="tf" style="align-items:flex-start;margin-top:6px">
        <span class="tf__i">${iconYes}</span>
        <div>
          <div class="eyebrow" style="font-size:19px">Lo que pasa</div>
          <div class="tf__t" style="margin-top:10px;font-size:33px">${s.verdad}</div>
        </div>
      </div>
    </div>
  </div>`,
  foot: foot(HANDLE, pager(i, n)),
});

/** Comparativa a dos columnas. */
const tCompare = (s, i, n) => {
  const col = (c, gold) => `
    <div style="flex:1;border-radius:24px;padding:38px 34px;
         display:flex;flex-direction:column;
         background:linear-gradient(180deg,rgba(242,242,242,${gold ? '.06' : '.03'}),rgba(242,242,242,.015));
         border:1px solid ${gold ? 'rgba(240,226,129,.32)' : 'rgba(242,242,242,.10)'}">
      <div style="display:flex;align-items:center;gap:14px">
        <span style="width:38px;height:38px;flex:0 0 auto">${gold ? iconYes : iconNo}</span>
        <div style="font-weight:800;font-size:30px;letter-spacing:-.01em;
             color:${gold ? '#F0E281' : 'rgba(242,242,242,.55)'}">${c.h}</div>
      </div>
      <div style="margin-top:30px;flex:1;display:flex;flex-direction:column;justify-content:center;gap:28px">
        ${c.items.map(t => `<div style="display:flex;gap:14px;align-items:flex-start">
          <span style="width:8px;height:8px;border-radius:50%;margin-top:12px;flex:0 0 auto;
                background:${gold ? '#F0E281' : 'rgba(242,242,242,.32)'}"></span>
          <span style="font-size:26px;line-height:1.36;
                color:${gold ? 'rgba(242,242,242,.92)' : 'rgba(242,242,242,.50)'}">${t}</span>
        </div>`).join('')}
      </div>
    </div>`;
  return shell({
    kind: '45', gx: '50%', gy: '100%', gx2: '50%', gy2: '0%',
    body: `
    <div class="stack pad" style="flex:1;padding-top:180px;padding-bottom:150px">
      <h3 class="h3" data-fit style="font-size:64px"><span class="line">${s.titulo}</span></h3>
      <div class="rule rule--short"></div>
      <div style="flex:1;display:flex;gap:24px;align-items:stretch;margin-top:44px;max-height:760px">
        ${col(s.a, false)}${col(s.b, true)}
      </div>
    </div>`,
    foot: foot(HANDLE, pager(i, n)),
  });
};

/** Cierre con llamada a la acción. */
const tCta = (s, i, n, id) => shell({
  kind: '45', gx: '50%', gy: '108%', gx2: '50%', gy2: '-8%',
  body: `
  <div class="stack pad" style="flex:1;padding-top:170px;padding-bottom:150px">
    <div style="flex:1;display:grid;place-items:center">
      <div class="art" style="position:relative;width:440px;height:440px">${art(s.art, id)}</div>
    </div>
    <div>
      <h2 class="h2" data-fit style="font-size:72px">${lines(s.h)}</h2>
      <div class="rule"></div>
      <p class="lede" style="margin-top:26px;max-width:28ch">${s.lede}</p>
      <div class="cta" style="margin-top:38px">${s.cta}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h13M13 6l6 6-6 6" stroke="#12171E" stroke-width="2.8"
                stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
  </div>`,
  foot: foot(HANDLE, pager(i, n)),
});

/** Historia 9:16. */
const tStory = (s, id) => shell({
  kind: '916', gx: s.gx, gy: s.gy, mesh: true,
  body: `
  <div class="stack pad" style="flex:1;padding-top:240px;padding-bottom:260px">
    <div style="flex:1;display:grid;place-items:center">
      <div class="art" style="position:relative;width:620px;height:620px">${art(s.art, id)}</div>
    </div>
    <div>
      <div class="eyebrow">${s.eyebrow}</div>
      <div class="quote" data-fit style="margin-top:30px;font-size:88px">${lines(s.h, { goldLast: false })}</div>
      <div class="rule"></div>
      ${s.lede ? `<p class="lede" style="margin-top:28px;max-width:24ch">${s.lede}</p>` : ''}
      ${s.cta ? `<div class="cta cta--ghost" style="margin-top:40px">${s.cta}</div>` : ''}
    </div>
  </div>`,
  foot: foot(HANDLE, ''),
});

/** Cuadrada 1:1 — cita. La ilustración entra en la composición, no de adorno. */
const tSquare = (s, id) => shell({
  kind: '11', gx: '94%', gy: '90%', gx2: '4%', gy2: '14%',
  body: `
  <div class="art" style="right:-120px;bottom:-130px;width:640px;height:640px;opacity:.52">
    ${art(s.art, id)}
  </div>
  <div class="stack pad" style="flex:1;padding-top:180px;padding-bottom:140px;justify-content:center">
    <svg width="76" height="66" viewBox="0 0 76 66" fill="none" style="margin-bottom:34px">
      <path d="M17 4 L31 12 V28 L17 36 L3 28 V12 Z M55 4 L69 12 V28 L55 36 L41 28 V12 Z"
            fill="rgba(240,226,129,.16)" stroke="#F0E281" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M17 36 v10 a10 10 0 0 1 -10 10 M55 36 v10 a10 10 0 0 1 -10 10"
            stroke="#F0E281" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
    </svg>
    <div class="quote" data-fit style="font-size:74px">${lines(s.quote, { goldLast: false })}</div>
    <div class="rule rule--short" style="margin-top:34px"></div>
  </div>`,
  foot: foot(HANDLE, ''),
});

/** Portada 16:9 — misma composición que las portadas oficiales. */
const tCoverWide = (s, id) => shell({
  kind: '169', gx: s.gx, gy: s.gy, gx2: '2%', gy2: '50%',
  body: `
  <div class="art" style="right:70px;top:50%;transform:translateY(-50%);width:720px;height:720px">
    ${art(s.art, id)}
  </div>
  <div class="stack" style="flex:1;justify-content:center;padding:0 72px;max-width:1120px">
    <h1 class="h1" data-fit style="font-size:108px">${lines(s.h1)}</h1>
    <div class="rule" style="width:72%"></div>
  </div>`,
});

/* ============================== armado ============================== */

const TPL = { cover: tCover, statement: tStatement, step: tStep, myth: tMyth, compare: tCompare, cta: tCta };

const page = inner => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="../../src/brand.css">${FIT}</head><body>${inner}</body></html>`;

const jobs = [];

for (const c of carousels) {
  c.slides.forEach((s, k) => {
    const i = k + 1, n = c.slides.length;
    const id = `${c.id}-${i}`;
    jobs.push({ name: `carruseles/${c.id}/${String(i).padStart(2, '0')}`, kind: '45',
                html: page(TPL[s.t](s, i, n, id)) });
  });
}
stories.forEach(s => jobs.push({ name: `historias/${s.id}`, kind: '916', html: page(tStory(s, s.id)) }));
squares.forEach(s => jobs.push({ name: `cuadradas/${s.id}`, kind: '11', html: page(tSquare(s, s.id)) }));
covers.forEach(s => jobs.push({ name: `portadas/${s.id}`, kind: '169', html: page(tCoverWide(s, s.id)) }));

const SIZE = { '45': [1080, 1350], '11': [1080, 1080], '916': [1080, 1920], '169': [1920, 1080] };

// solo las carpetas de las piezas fijas: out/ también guarda video y audio
for (const d of ['carruseles', 'historias', 'cuadradas', 'portadas', 'hojas-de-contacto'])
  rmSync(resolve(OUT, d), { recursive: true, force: true });

const browser = await chromium.launch();
for (const j of jobs) {
  const file = join(BUILD, j.name.replace(/\//g, '__') + '.html');
  writeFileSync(file, j.html);
  const [w, h] = SIZE[j.kind];
  const page_ = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: SCALE });
  await page_.goto('file://' + file);
  await page_.evaluate(async () => { await document.fonts.ready; window.__fit(); });
  await page_.waitForTimeout(120);
  const dest = join(OUT, j.name + '.png');
  mkdirSync(dirname(dest), { recursive: true });
  await page_.screenshot({ path: dest });
  await page_.close();
  process.stdout.write('.');
}
await browser.close();
console.log(`\n${jobs.length} piezas renderizadas en out/ (a ${SCALE}x, pendiente reducir)`);
