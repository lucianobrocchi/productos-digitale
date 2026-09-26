/* ------------------------------------------------------------------
   Portadas de historias destacadas de Instagram.

   El manual (p. 24 y 26) dice que la galería de íconos de la marca se usa
   para las destacadas. Salen dos juegos: out/destacadas/manual/ con los
   íconos de esa galería (redibujados en src/iconos.mjs) y out/destacadas/
   con una propuesta propia en la misma lógica. Los dos, dentro del
   hexágono oficial en oro metálico, como el badge del logo.

   Instagram recorta la portada en un círculo al centro: todo lo importante
   vive dentro de ese círculo.
   ------------------------------------------------------------------ */
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { logoMark } from '../src/motion/logo.mjs';
import { ICONOS_MANUAL } from '../src/iconos.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'out/destacadas');
mkdirSync(OUT, { recursive: true });
const P = JSON.parse(readFileSync(resolve(ROOT, 'src/motion/logo-paths.json'), 'utf8'));

/* íconos provisorios, 100×100, trazo del color del monograma */
const ICONOS = {
  'empeza-aca': { nombre: 'Empezá acá', svg: '<path d="M38 26 L74 50 L38 74 Z" fill="#12171E" stroke="#12171E" stroke-width="6" stroke-linejoin="round"/>' },
  metodo: { nombre: 'Método', svg: '<path d="M18 78 H36 V62 H54 V46 H72 V30" stroke-width="8"/><path d="M64 24 L74 16 L84 24 M74 16 V40" stroke-width="7"/>' },
  clases: { nombre: 'Clases', svg: '<rect x="16" y="24" width="68" height="46" rx="8" stroke-width="7"/><path d="M44 36 L60 47 L44 58 Z" fill="#12171E" stroke-width="4"/><path d="M38 82 H62" stroke-width="7"/>' },
  ia: { nombre: 'IA', svg: '<rect x="28" y="28" width="44" height="44" rx="8" stroke-width="7"/><path d="M40 16 V26 M60 16 V26 M40 74 V84 M60 74 V84 M16 40 H26 M16 60 H26 M74 40 H84 M74 60 H84" stroke-width="6"/><path d="M50 40 L59 45 V55 L50 60 L41 55 V45 Z" fill="#12171E"/>' },
  ofertas: { nombre: 'Ofertas', svg: '<path d="M50 16 H82 V48 L48 82 L16 50 Z" stroke-width="7"/><circle cx="68" cy="30" r="5" fill="#12171E"/>' },
  preguntas: { nombre: 'Preguntas', svg: '<path d="M20 30 a10 10 0 0 1 10 -10 h40 a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 h-22 l-14 14 v-14 h-4 a10 10 0 0 1 -10 -10 Z" stroke-width="7"/><path d="M42 34 c0 -9 17 -9 17 0 c0 7 -8.5 7 -8.5 14" stroke-width="6.5"/><circle cx="50.5" cy="56" r="3.8" fill="#12171E"/>' },
  recursos: { nombre: 'Recursos', svg: '<path d="M50 16 V58 M34 44 L50 60 L66 44" stroke-width="8"/><path d="M20 62 V80 H80 V62" stroke-width="8"/>' },
  nosotros: { nombre: 'Nosotros', svg: null },   // el badge oficial, tal cual
};

/* el mismo juego de destacadas con los íconos de la galería del manual (p. 26) */
const MANUAL = { 'empeza-aca': 'progreso', metodo: 'engranaje', clases: 'formacion', ia: 'trabajo-online',
  ofertas: 'ventas', preguntas: 'consultas', recursos: 'guias', nosotros: 'comunidad' };
const iconoManual = k => ICONOS_MANUAL.find(i => i.key === MANUAL[k]);

const [vx, vy, vw, vh] = P.viewBox.split(' ').map(Number);
const METAL = '<stop offset="0" stop-color="#AF7C38"/><stop offset=".14" stop-color="#BD9149"/><stop offset=".3" stop-color="#D1AF5E"/>' +
  '<stop offset=".5" stop-color="#EAD77A"/><stop offset=".7" stop-color="#E5C969"/><stop offset=".86" stop-color="#DEB957"/><stop offset="1" stop-color="#DAAE4A"/>';

function portada(key, manual = false) {
  const ic = ICONOS[key];
  const im = manual && iconoManual(key);
  const badge = im ? `<svg width="780" height="705" viewBox="${vx} ${vy} ${vw} ${vh}">
        <defs><linearGradient id="m" gradientUnits="userSpaceOnUse" x1="${vx}" y1="0" x2="${vx + vw}" y2="0">${METAL}</linearGradient></defs>
        <path transform="${P.hex.t}" d="${P.hex.d}" fill="url(#m)"/>
        <g transform="translate(${vx + vw / 2 - 135} ${vy + vh / 2 - 135}) scale(2.7)" style="color:#12171E">${im.svg('dm-' + key)}</g>
      </svg>`
    : ic.svg === null
    ? `<div style="width:780px;height:705px">${logoMark('n')}</div>`
    : `<svg width="780" height="705" viewBox="${vx} ${vy} ${vw} ${vh}">
        <defs><linearGradient id="m" gradientUnits="userSpaceOnUse" x1="${vx}" y1="0" x2="${vx + vw}" y2="0">${METAL}</linearGradient></defs>
        <path transform="${P.hex.t}" d="${P.hex.d}" fill="url(#m)"/>
        <g transform="translate(${vx + vw / 2 - 130} ${vy + vh / 2 - 130}) scale(2.6)" fill="none" stroke="#12171E"
           stroke-linecap="round" stroke-linejoin="round">${ic.svg}</g>
      </svg>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;background:#0E0E0E}
    .p{width:1080px;height:1920px;position:relative;overflow:hidden;display:grid;place-items:center;
       background:radial-gradient(60% 40% at 50% 50%,rgba(240,226,129,.22),rgba(163,123,60,.08) 45%,transparent 70%),#0E0E0E}
    .b{filter:drop-shadow(0 0 60px rgba(240,226,129,.35))}
    .b svg{display:block}
  </style></head><body><div class="p"><div class="b">${badge}</div></div></body></html>`;
}

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
mkdirSync(resolve(OUT, 'manual'), { recursive: true });
for (const k of Object.keys(ICONOS)) {
  await pg.setContent(portada(k));
  await pg.screenshot({ path: resolve(OUT, `${k}.png`) });
  await pg.setContent(portada(k, true));
  await pg.screenshot({ path: resolve(OUT, `manual/${k}.png`) });
}
// vista de cómo se ven en el perfil: círculos chicos con el nombre abajo
for (const dir of ['', 'manual/']) {
  const fila = Object.entries(ICONOS).map(([k, v]) => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:150px">
      <div style="width:128px;height:128px;border-radius:50%;padding:5px;border:2px solid #3a3a3a">
        <div style="width:100%;height:100%;border-radius:50%;background:url('data:image/png;base64,${
          readFileSync(resolve(OUT, `${dir}${k}.png`)).toString('base64')}') center/100% auto no-repeat"></div></div>
      <div style="font:500 22px -apple-system,Inter,sans-serif;color:#F2F2F2">${v.nombre}</div></div>`).join('');
  await pg.setViewportSize({ width: 1300, height: 260 });
  await pg.setContent(`<body style="margin:0;background:#000;padding:40px 30px;display:flex;gap:6px">${fila}</body>`);
  await pg.screenshot({ path: resolve(OUT, `${dir}vista-en-el-perfil.png`) });
  await pg.setViewportSize({ width: 1080, height: 1920 });
}
await browser.close();
console.log(`${Object.keys(ICONOS).length} portadas en out/destacadas/ y otras tantas con los íconos del manual en out/destacadas/manual/`);
