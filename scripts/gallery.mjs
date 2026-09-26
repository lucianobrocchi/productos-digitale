/* ------------------------------------------------------------------
   Galería completa: piezas fijas, audiovisual, kit de edición y sonido.
   Se genera desde los mismos datos que las piezas; los archivos se
   publican junto a la página con las mismas rutas que tienen en out/.
   ------------------------------------------------------------------ */
import { carousels, stories, squares, covers, HANDLE } from '../src/content.mjs';
import { reels } from '../src/motion/specs/reels.mjs';
import { plan, notas } from '../src/plan.mjs';
import { clases } from '../src/motion/specs/clases.mjs';
import { relatos } from '../src/motion/specs/relatos.mjs';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'out');

mkdirSync(resolve(OUT, 'marca'), { recursive: true });
copyFileSync(resolve(root, 'brand/logo/lockup-oscuro.png'), resolve(OUT, 'marca/lockup-oscuro.png'));

const ls = (p, ext = '.png') => existsSync(resolve(OUT, p))
  ? readdirSync(resolve(OUT, p)).filter(f => f.endsWith(ext) && !f.includes('.silent')).sort() : [];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ruta publicada → archivo de origen. Por defecto el de out/; las piezas fijas
   se publican como JPG y las clases 16:9 en 720p desde build/web/ (ver
   scripts/web_previews.py): la galería tiene un tope de 256 MB por versión. */
const WEB = resolve(root, 'build/web');
const archivos = new Map([['marca/lockup-oscuro.png', 'out/marca/lockup-oscuro.png']]);
const use = (p, src = `out/${p}`) => { archivos.set(p, src); return p; };
const webImg = p => {                         // carruseles/x/01.png → carruseles/x/01.jpg (vista previa)
  const j = p.replace(/\.png$/, '.jpg');
  return existsSync(resolve(WEB, j)) ? use(j, `build/web/${j}`) : use(p);
};

function dur(p) {
  try {
    const out = execFileSync('ffmpeg', ['-hide_banner', '-i', resolve(OUT, p)], { stdio: ['ignore', 'pipe', 'pipe'] });
    return parse(out.toString());
  } catch (e) { return parse(String(e.stderr || '')); }
  function parse(s) {
    const m = s.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
    if (!m) return '';
    const t = Math.round(+m[1] * 3600 + +m[2] * 60 + +m[3]);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  }
}

const hex = `<svg class="hex" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5 21 6.75v10.5L12 22.5 3 17.25V6.75Z"/></svg>`;

/* --------------------------- componentes --------------------------- */

const pic = (src, cap, ratio, eager = false) => `
  <figure class="pz" style="--r:${ratio}">
    <button class="shot" data-kind="img" data-full="${webImg(src)}" data-cap="${esc(cap)}" aria-label="Ver ${esc(cap)}">
      <img src="${webImg(src)}" alt="${esc(cap)}" ${eager ? '' : 'loading="lazy"'} decoding="async">
    </button>
    <figcaption>${cap}</figcaption>
  </figure>`;

/** Video con sonido: póster + botón; se abre en el visor. */
const vid = (src, cap, ratio, sub = '', from) => {
  const poster = src.replace(/\.(mp4|mov)$/, '.jpg');
  const hasPoster = existsSync(resolve(OUT, poster));
  const d = dur(src);
  return `
  <figure class="pz" style="--r:${ratio}">
    <button class="shot vid" data-kind="video" data-full="${use(src, from)}" data-cap="${esc(cap)}" aria-label="Reproducir ${esc(cap)}">
      ${hasPoster ? `<img src="${use(poster)}" alt="" loading="lazy" decoding="async">` : ''}
      <span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z"/></svg></span>
      ${d ? `<span class="dur">${d}</span>` : ''}
    </button>
    <figcaption>${cap}${sub ? ` <span>· ${sub}</span>` : ''}</figcaption>
  </figure>`;
};

/** Loop mudo que se reproduce solo cuando está a la vista. */
const loop = (src, cap, ratio, alpha = false) => `
  <figure class="pz" style="--r:${ratio}">
    <button class="shot ${alpha ? 'alpha' : ''}" data-kind="video" data-full="${use(src)}" data-cap="${esc(cap)}" aria-label="Ver ${esc(cap)}">
      <video class="auto" src="${src}" muted loop playsinline preload="none"
        ${existsSync(resolve(OUT, src.replace(/\.(mp4|webm)$/, '.jpg'))) ? `poster="${use(src.replace(/\.(mp4|webm)$/, '.jpg'))}"` : ''}></video>
    </button>
    <figcaption>${cap}</figcaption>
  </figure>`;

const aud = (src, cap, meta) => `
  <li class="aud">
    <div><b>${cap}</b><span>${meta}</span></div>
    <audio controls preload="none" src="${use(src)}"></audio>
  </li>`;

const bloque = (n, titulo, meta, inner, cls = 'rejilla', w = '240px') => `
  <section class="bloque">
    <header class="cab">
      <div class="idx">${n}</div>
      <div><h3>${titulo}</h3><p class="meta">${meta}</p></div>
    </header>
    <div class="${cls}" style="--w:${w}">${inner}</div>
  </section>`;

/* ------------------------------ audiovisual ------------------------------ */
const R = 'video/reels';
const reelFiles = ls(R, '.mp4');
const manifiesto169 = reelFiles.find(f => f.includes('16x9'));
const reelsV = reels.map(r => reelFiles.includes(`${r.id}.mp4`)
  ? vid(`${R}/${r.id}.mp4`, r.titulo, '9 / 16') : '').join('');

const logos = ls('video/logo', '.mp4').map(f => vid(`video/logo/${f}`,
  { 'logo-16x9.mp4': '16:9', 'logo-9x16.mp4': '9:16', 'logo-1x1.mp4': '1:1' }[f] || f,
  f.includes('16x9') ? '16 / 9' : f.includes('9x16') ? '9 / 16' : '1 / 1')).join('');

const historiasV = ls('video/historias', '.mp4').map((f, i) =>
  vid(`video/historias/${f}`, `Historia ${i + 1}`, '9 / 16')).join('');

const portadasV = ls('video/portadas', '.mp4');
const port45 = portadasV.filter(f => !f.includes('16x9')).map(f => {
  const c = carousels.find(x => f.includes(x.id));
  return vid(`video/portadas/${f}`, c ? c.titulo : f, '4 / 5');
}).join('');
const port169 = portadasV.filter(f => f.includes('16x9')).map((f, i) =>
  vid(`video/portadas/${f}`, covers[i] ? covers[i].h1.join(' ') : f, '16 / 9')).join('');

const citasV = ls('video/citas', '.mp4').map((f, i) =>
  vid(`video/citas/${f}`, squares[i] ? squares[i].quote.join(' ').replace(/<[^>]+>/g, '') : f, '1 / 1')).join('');
const loopsV = ls('video/loops', '.mp4').map(f => loop(`video/loops/${f}`, f.replace('loop-', '').replace('.mp4', ''), '1 / 1')).join('');

const KIT = {
  'kit-logo-16x9': ['Logo animado', '16:9 · 6 s'],
  'kit-zocalo-16x9': ['Zócalo de nombre', '16:9 · 5 s'],
  'kit-zocalo-9x16': ['Zócalo de nombre', '9:16 · 5 s'],
  'kit-transicion-16x9': ['Transición glitch', '16:9 · 1 s'],
  'kit-transicion-9x16': ['Transición glitch', '9:16 · 1 s'],
  'kit-seguinos-9x16': ['Cierre “Seguinos”', '9:16 · 4 s'],
  'kit-guardalo-9x16': ['“Guardá este video”', '9:16 · 3,5 s'],
};
const kitCard = f => {
  const k = f.replace('.webm', '');
  const [t, m] = KIT[k] || [k, ''];
  return loop(`video/kit/${f}`, `${t} <span>· ${m}</span>`, k.includes('16x9') ? '16 / 9' : '9 / 16', true);
};
const kitH = ls('video/kit', '.webm').filter(f => f.includes('16x9')).map(kitCard).join('');
const kitVt = ls('video/kit', '.webm').filter(f => f.includes('9x16')).map(kitCard).join('');

/* -------------------------------- sonido -------------------------------- */
const musica = ls('audio/musica', '.mp3').map(f => aud(`audio/musica/${f}`,
  { 'base-1-calma.mp3': 'Calma', 'base-2-pulso.mp3': 'Pulso', 'base-3-groove.mp3': 'Groove',
    'base-4-subida.mp3': 'Subida' }[f] || f, `64 s · loop exacto · ${f}`)).join('');
const efectos = ls('audio/efectos', '.mp3').map(f => aud(`audio/efectos/${f}`,
  f.replace('.mp3', '').replace(/-/g, ' '), f)).join('');



/* ------------------------------- relatos ------------------------------- */
const RL = 'video/relatos';
const relV = relatos.map(k => {
  if (!existsSync(resolve(OUT, `${RL}/${k.id}.mp4`))) return '';
  const web = `build/web/${RL}/${k.id}.mp4`;                // vista previa 720 × 1280
  return vid(`${RL}/${k.id}.mp4`, k.titulo, '9 / 16', '', existsSync(resolve(root, web)) ? web : undefined);
}).join('');
let tomasDoc = { relatos: [] };
try { tomasDoc = JSON.parse(readFileSync(resolve(OUT, 'higgsfield/tomas.json'), 'utf8')); } catch (e) { /* sin documento todavía */ }
const tomasHtml = tomasDoc.relatos.map(r => `
  <details class="tomas"><summary><b>${r.titulo}</b> <span>${r.tomas.length} tomas · ${r.dur} s</span></summary>
    <ol>${r.tomas.map(t => `<li><span class="td">${t.dur} s · ${esc(t.camara)}</span>${esc(t.toma)}</li>`).join('')}</ol>
  </details>`).join('');

/* ------------------------------ destacadas ------------------------------ */
const destOrden = ['empeza-aca', 'metodo', 'clases', 'ia', 'ofertas', 'preguntas', 'recursos', 'nosotros'];
const destV = destOrden.filter(k => existsSync(resolve(OUT, `destacadas/${k}.png`)))
  .map(k => pic(`destacadas/${k}.png`, k.replace(/-/g, ' '), '9 / 16')).join('');

/* ------------------------------- clases ------------------------------- */
const K = 'video/clases';
const clasesHtml = clases.map((k, i) => {
  const has = f => existsSync(resolve(OUT, `${K}/${f}`));
  const reel = has(`${k.id}.mp4`) ? vid(`${K}/${k.id}.mp4`, 'Reel 9:16', '9 / 16') : '';
  const web169 = `build/web/${K}/${k.id}-16x9.mp4`;
  const yt = has(`${k.id}-16x9.mp4`) ? vid(`${K}/${k.id}-16x9.mp4`, 'YouTube 16:9', '16 / 9', 'vista previa 720p',
    existsSync(resolve(root, web169)) ? web169 : undefined) : '';
  const mini = has(`miniatura-${k.id}.jpg`) ? pic(`${K}/miniatura-${k.id}.jpg`, 'Miniatura', '16 / 9') : '';
  const slides = ls(`carruseles/${k.id}`).map((f, j, a) =>
    pic(`carruseles/${k.id}/${f}`, `${String(j + 1).padStart(2, '0')} / ${String(a.length).padStart(2, '0')}`, '4 / 5')).join('');
  const d = has(`${k.id}.mp4`) ? dur(`${K}/${k.id}.mp4`) : '';
  return `
  <section class="bloque">
    <header class="cab"><div class="idx">${String(i + 1).padStart(2, '0')}</div>
      <div><h3>${k.titulo}</h3><p class="meta">${d ? d + ' · ' : ''}tema: ${k.tema} · Reel, video para YouTube, miniatura y carrusel</p></div></header>
    <div class="clase">
      <div class="c-reel">${reel}</div>
      <div class="c-h">${yt}${mini}</div>
    </div>
    <div class="tira" style="margin-top:18px">${slides}</div>
  </section>`;
}).join('');

/* ------------------------------ plan ------------------------------ */
const thumbOf = p => p.endsWith('.mp4') ? p.replace('.mp4', '.jpg') : p.endsWith('.png') ? p : `${p}/01.png`;
const SEMANAS = [...new Set(plan.map(x => x.semana))].sort((a, b) => a - b);
const semanas = SEMANAS.map(n => `
  <section class="bloque">
    <header class="cab"><div class="idx">${n}</div><div><h3>Semana ${n}</h3>
      <p class="meta">${plan.filter(x => x.semana === n).length} posteos</p></div></header>
    <div class="posts">${plan.filter(x => x.semana === n).map((x, i) => {
      const th = thumbOf(x.pieza);
      const ok = existsSync(resolve(OUT, th));
      const full = `${x.texto}\n\n${x.tags}`;
      return `<article class="post">
        ${ok ? `<img src="${th.endsWith(".png") ? webImg(th) : use(th)}" alt="" loading="lazy" decoding="async" class="pt ${x.tipo === 'Reel' ? 'v' : ''}">` : ''}
        <div class="pb">
          <div class="pm"><b>${x.dia}</b> · ${x.tipo} · ${esc(x.titulo)}</div>
          <p class="px">${esc(x.texto).replace(/\n/g, '<br>')}</p>
          <p class="ph">${x.tags}</p>
          ${x.historias ? `<p class="ps">Historias: ${esc(x.historias)}</p>` : ''}
          ${x.youtube ? `<p class="ps">YouTube: la versión 16:9, mismo día.</p>` : ''}
          <button class="copy" data-t="${esc(full)}" id="cp-${n}-${i}">Copiar texto</button>
        </div></article>`;
    }).join('')}</div>
  </section>`).join('');

/* ------------------------------ piezas fijas ------------------------------ */
const tiras = carousels.map((c, ci) => {
  const files = ls(`carruseles/${c.id}`);
  return `
  <section class="bloque">
    <header class="cab"><div class="idx">${String(ci + 1).padStart(2, '0')}</div>
      <div><h3>${c.titulo}</h3><p class="meta">${files.length} placas · 1080 × 1350</p></div></header>
    <div class="tira">${files.map((f, i) => pic(`carruseles/${c.id}/${f}`,
      `${String(i + 1).padStart(2, '0')} / ${String(files.length).padStart(2, '0')}`, '4 / 5')).join('')}</div>
  </section>`;
}).join('');
const rej = (dir, ratio) => ls(dir).map(f => pic(`${dir}/${f}`, f.replace('.png', ''), ratio)).join('');

/* -------------------------------- cifras -------------------------------- */
const nFijas = [...carousels, ...clases].reduce((n, c) => n + ls(`carruseles/${c.id}`).length, 0)
  + stories.length + squares.length + covers.length;
const nVideos = reelFiles.length + ls('video/relatos', '.mp4').length + ls('video/clases', '.mp4').filter(f => !f.startsWith('miniatura')).length + ls('video/logo', '.mp4').length + ls('video/historias', '.mp4').length
  + portadasV.length + ls('video/loops', '.mp4').length + ls('video/citas', '.mp4').length;
const nKit = ls('video/kit', '.webm').length;
const nAudio = ls('audio/musica', '.mp3').length + ls('audio/efectos', '.mp3').length;

const paleta = [['#12171E', 'Negro profundo', 'C89 M86 Y68 K68'], ['#A37B3C', 'Dorado', 'C37 M58 Y89 K1'],
  ['#F0E281', 'Dorado claro', 'C10 M12 Y63 K0'], ['#F2F2F2', 'Neutro claro', 'C7 M6 Y5 K0']];

const html = `<title>Piezas Productos Digitales</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<style>
  /* La marca vive en negro y oro: la página se compromete con ese mundo
     y define cada color de forma explícita, sin variante clara. */
  :root{
    color-scheme:dark;
    --bg:#0E0E0E; --bg-2:#131210; --linea:rgba(242,242,242,.10);
    --oro:#F0E281; --oro-hondo:#A37B3C; --papel:#F2F2F2;
    --tenue:rgba(242,242,242,.58); --apagado:rgba(242,242,242,.40);
    --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--papel);font-family:var(--sans);font-size:16px;line-height:1.55;
       -webkit-font-smoothing:antialiased}
  .env{max-width:1240px;margin:0 auto;padding-inline:20px;padding-block:0}

  .hero{position:relative;overflow:hidden;border-bottom:1px solid var(--linea)}
  .hero::before{content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(110% 80% at 88% 100%,rgba(240,226,129,.16) 0%,rgba(163,123,60,.09) 34%,transparent 68%)}
  .hero .env{position:relative;padding-block:48px 52px}
  .marca{height:48px;width:auto;display:block}
  h1{font-size:clamp(36px,6vw,70px);font-weight:900;letter-spacing:-.03em;line-height:1;margin:34px 0 0;
     text-wrap:balance;text-transform:uppercase}
  h1 em{font-style:normal;color:var(--oro)}
  .bajada{margin:20px 0 0;max-width:62ch;color:var(--tenue);font-size:17.5px}
  .cifras{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px;list-style:none;padding:0}
  .cifras li{border:1px solid rgba(240,226,129,.26);border-radius:999px;padding:8px 16px;font-size:14px;
    font-weight:600;color:var(--oro);font-variant-numeric:tabular-nums}

  .feature{margin-top:36px;border-radius:16px;overflow:hidden;border:1px solid rgba(240,226,129,.24);
    background:#000;aspect-ratio:16/9;max-width:100%}
  .feature video{width:100%;height:100%;display:block}

  nav.sec{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:rgba(14,14,14,.9);
    backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
  nav.sec .env{display:flex;gap:6px;overflow-x:auto;padding-block:10px;scrollbar-width:none}
  nav.sec a{flex:0 0 auto;color:var(--tenue);text-decoration:none;font-weight:600;font-size:14px;
    padding:8px 14px;border-radius:999px}
  nav.sec a:hover,nav.sec a:focus-visible{color:var(--oro);background:rgba(240,226,129,.08);outline:none}

  .grupo{padding-block:14px 0}
  h2{font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--oro);
     margin:48px 0 0;scroll-margin-top:70px}
  .bloque{padding-block:36px;border-bottom:1px solid var(--linea)}
  .cab{display:flex;gap:18px;align-items:flex-start;margin-bottom:24px}
  .idx{flex:0 0 auto;width:46px;height:46px;border-radius:13px;display:grid;place-items:center;
    background:linear-gradient(155deg,var(--oro),var(--oro-hondo));color:#12171E;font-weight:800;font-size:17px;
    font-variant-numeric:tabular-nums}
  .hex{width:22px;height:22px;fill:#12171E}
  h3{font-size:clamp(20px,2.5vw,25px);font-weight:700;letter-spacing:-.018em;margin:0;line-height:1.2}
  .meta{margin:4px 0 0;color:var(--apagado);font-size:14px}

  .tira{display:flex;gap:12px;overflow-x:auto;padding-bottom:12px;scroll-snap-type:x mandatory;
    scrollbar-width:thin;scrollbar-color:rgba(240,226,129,.34) transparent}
  .tira .pz{flex:0 0 clamp(150px,21vw,220px);scroll-snap-align:start}
  .rejilla{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(min(var(--w),100%),1fr))}

  .pz{margin:0;min-width:0}
  .shot{position:relative;display:block;width:100%;padding:0;border:1px solid var(--linea);background:var(--bg-2);
    border-radius:12px;overflow:hidden;cursor:pointer;aspect-ratio:var(--r);
    transition:border-color .18s ease,transform .18s ease}
  .shot:hover,.shot:focus-visible{border-color:rgba(240,226,129,.55);transform:translateY(-2px)}
  .shot:focus-visible{outline:2px solid var(--oro);outline-offset:3px}
  .shot img,.shot video{width:100%;height:100%;max-width:100%;object-fit:cover;display:block}
  .shot.alpha{background:repeating-conic-gradient(#2a2a2a 0 25%,#1c1c1c 0 50%) 0 0/28px 28px}
  .shot.alpha video{object-fit:contain}
  .play{position:absolute;inset:0;margin:auto;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;
    background:linear-gradient(145deg,var(--oro),var(--oro-hondo));box-shadow:0 0 40px rgba(240,226,129,.4)}
  .play svg{width:28px;height:28px;fill:#12171E;margin-left:3px}
  .dur{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.72);color:var(--papel);font-size:12px;
    font-weight:600;padding:3px 8px;border-radius:6px;font-variant-numeric:tabular-nums}
  figcaption{margin-top:8px;font-size:13px;color:var(--tenue);font-weight:600}
  figcaption span{color:var(--apagado);font-weight:500}

  .auds{list-style:none;padding:0;margin:0;display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(330px,100%),1fr))}
  .aud{border:1px solid var(--linea);border-radius:14px;background:var(--bg-2);padding:14px 16px;display:flex;
    flex-direction:column;gap:10px}
  .aud b{display:block;font-size:15px;text-transform:capitalize}
  .aud span{display:block;font-size:12.5px;color:var(--apagado);font-family:ui-monospace,Menlo,monospace}
  .aud audio{width:100%;height:36px}
  .aud.logo{border-color:rgba(240,226,129,.4);background:linear-gradient(140deg,rgba(240,226,129,.10),rgba(163,123,60,.04))}

  .swatches{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(min(180px,100%),1fr));list-style:none;padding:0;margin:0}
  .swatches li{border:1px solid var(--linea);border-radius:14px;overflow:hidden;background:var(--bg-2)}
  .chip{height:80px;display:block}
  .swatches .txt{padding:12px 14px}
  .swatches b{display:block;font-size:15px}
  .swatches span{display:block;font-size:12.5px;color:var(--apagado);font-family:ui-monospace,Menlo,monospace;margin-top:3px}
  .notas{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(270px,100%),1fr));margin:30px 0 0;padding:0;list-style:none}
  .notas li{border-left:2px solid rgba(240,226,129,.34);padding-left:16px}
  .notas b{display:block;margin-bottom:6px;font-size:15px}
  .notas p{margin:0;color:var(--tenue);font-size:14.5px}
  footer{padding-block:40px 56px;color:var(--apagado);font-size:14px}
  footer b{color:var(--oro)}

  dialog.visor{border:0;padding:0;background:transparent;max-width:100vw;max-height:100vh;width:100%;height:100%;overflow:hidden}
  dialog.visor::backdrop{background:rgba(5,5,5,.95)}
  .visor .caja{width:100%;height:100%;display:grid;place-items:center;padding:18px 14px 64px}
  .visor img,.visor video{max-width:min(1100px,96vw);max-height:84vh;width:auto;height:auto;border-radius:10px;
    border:1px solid rgba(240,226,129,.26);display:block;background:#000}
  .visor .alpha{background:repeating-conic-gradient(#2a2a2a 0 25%,#1c1c1c 0 50%) 0 0/28px 28px}
  .visor .barra{position:fixed;left:0;right:0;bottom:calc(14px + env(safe-area-inset-bottom,0px));display:flex;
    align-items:center;justify-content:center;gap:10px;padding-inline:14px}
  .visor .pie{color:var(--tenue);font-size:13.5px;text-align:center;flex:1;min-width:0}
  .visor button.nav{flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:1px solid rgba(240,226,129,.35);
    background:rgba(14,14,14,.8);color:var(--oro);font-size:20px;cursor:pointer}
  .visor .cerrar{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:14px;width:44px;height:44px;
    border-radius:50%;border:1px solid rgba(240,226,129,.35);background:rgba(14,14,14,.8);color:var(--oro);font-size:22px;cursor:pointer}

  .clase{display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:16px;align-items:start}
  .c-h{display:grid;gap:16px;grid-template-columns:1fr 1fr}
  @media (max-width:640px){.clase{grid-template-columns:1fr 1fr}.c-reel{grid-row:span 2}.c-h{grid-template-columns:1fr}}
  details.tomas{border:1px solid var(--linea);border-radius:12px;background:var(--bg-2);padding:12px 16px;margin-top:10px}
  details.tomas summary{cursor:pointer;font-size:15px;list-style-position:outside}
  details.tomas summary span{color:var(--apagado);font-size:13px;margin-left:6px}
  details.tomas ol{margin:12px 0 4px;padding-left:22px;display:grid;gap:8px;font-size:14px;color:rgba(242,242,242,.86)}
  details.tomas .td{display:block;font-size:12px;color:var(--oro);letter-spacing:.02em}
  .posts{display:grid;gap:14px}
  .post{display:grid;grid-template-columns:120px 1fr;gap:18px;border:1px solid var(--linea);border-radius:14px;
    background:var(--bg-2);padding:14px}
  .pt{width:120px;aspect-ratio:4/5;object-fit:cover;border-radius:8px;display:block;max-width:100%}
  .pt.v{aspect-ratio:9/16}
  .pm{font-size:13px;color:var(--oro);letter-spacing:.02em}
  .pm b{text-transform:uppercase;letter-spacing:.14em;font-size:12px}
  .px{margin:10px 0 0;font-size:14.5px;color:rgba(242,242,242,.88);max-width:62ch}
  .ph{margin:10px 0 0;font-size:13px;color:var(--oro);opacity:.8}
  .ps{margin:8px 0 0;font-size:12.5px;color:var(--apagado)}
  .copy{margin-top:12px;font:600 13px var(--sans);color:#12171E;background:linear-gradient(140deg,var(--oro),var(--oro-hondo));
    border:0;border-radius:999px;padding:9px 16px;cursor:pointer}
  .copy:focus-visible{outline:2px solid var(--oro);outline-offset:3px}
  @media (max-width:560px){.post{grid-template-columns:84px 1fr;gap:12px}.pt{width:84px}}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<header class="hero">
  <div class="env">
    <img class="marca" src="marca/lockup-oscuro.png" alt="Productos Digitales">
    <h1>Sistema de<br><em>contenido</em></h1>
    <p class="bajada">Piezas fijas, Reels con música propia, logo animado, historias, portadas en movimiento,
      un kit de edición con fondo transparente y la identidad sonora de la marca. Todo construido sobre el
      Manual de Identidad y el logo vectorial oficial. Tocá cualquier pieza para verla, los videos suenan.</p>
    <ul class="cifras">
      <li>${nVideos} videos</li><li>${nFijas} piezas fijas</li><li>${nKit} overlays con alfa</li>
      <li>${nAudio} audios originales</li><li>16 ilustraciones</li>
    </ul>
    ${manifiesto169 ? `<div class="feature"><video controls playsinline preload="metadata"
       poster="${use(`${R}/${manifiesto169.replace('.mp4', '.jpg')}`)}" src="${use(`${R}/${manifiesto169}`)}"></video></div>
       <p class="meta" style="margin-top:10px">Manifiesto de marca · 16:9 · con sonido</p>` : ''}
  </div>
</header>

<nav class="sec" aria-label="Secciones"><div class="env">
  <a href="#relatos">Relatos</a><a href="#clases">Clases</a><a href="#audiovisual">Audiovisual</a><a href="#kit">Kit de edición</a><a href="#destacadas">Destacadas</a><a href="#sonido">Sonido</a><a href="#plan">Plan</a>
  <a href="#fijas">Piezas fijas</a><a href="#marca">De dónde sale</a>
</div></nav>

<main><div class="env">
  <h2 id="relatos">Relatos: historias rápidas para alcance</h2>
  <p class="bajada" style="font-size:15.5px;margin-top:14px">Reels de 15 a 22 segundos con historia: algo en pantalla desde el
    primer cuadro, cortes de un segundo, subtítulo palabra por palabra y un final que empalma con el principio para que se
    vuelvan a ver. Sin testimonios ni resultados inventados: parábolas, historias en segunda persona y la historia de la marca.</p>
  ${bloque(hex, 'Relatos', `${relatos.length} piezas · 1080 × 1920 · el personaje dorado es el protagonista`, relV, 'tira')}
  <section class="bloque">
    <header class="cab"><div class="idx">${hex}</div><div><h3>Listos para Higgsfield</h3>
      <p class="meta">Cada escena tiene su toma escrita. Cuando se genera, el clip entra de fondo solo y el texto queda
        encima: se guarda como assets/tomas/&lt;relato&gt;/&lt;escena&gt;.mp4 y se vuelve a renderizar.</p></div></header>
    ${tomasHtml}
  </section>

  <h2 id="clases">Clases: contenido de valor</h2>
  <p class="bajada" style="font-size:15.5px;margin-top:14px">Piezas largas, de 45 a 65 segundos, sobre los temas de las portadas
    de la marca: Introducción, Mentalidad, Principios del marketing digital y La nueva economía digital. Cada clase sale en
    Reel, en video 16:9 para YouTube con su miniatura, y en carrusel.</p>
  ${clasesHtml}

  <h2 id="audiovisual">Audiovisual</h2>
  ${bloque(hex, 'Reels', `${reelFiles.filter(f => !f.includes('16x9')).length} piezas · 1080 × 1920 · música y sonido originales, sincronizados al pulso`, reelsV, 'tira')}
  ${bloque(hex, 'Logo animado', 'El logo oficial: el hexágono se traza, el glitch barre el monograma, suena la firma', logos, 'rejilla', '220px')}
  ${bloque(hex, 'Historias animadas', '1080 × 1920 · 7 s', historiasV, 'rejilla', '150px')}
  ${bloque(hex, 'Portadas de carrusel en movimiento', '1080 × 1350 · la placa 1 de cada carrusel', port45, 'rejilla', '190px')}
  ${bloque(hex, 'Portadas 16:9', '1920 × 1080 · YouTube, sitio y presentaciones', port169, 'rejilla', '300px')}
  ${bloque(hex, 'Citas animadas', '1080 × 1080 · 7 s · para el feed', citasV, 'rejilla', '220px')}
  ${bloque(hex, 'Ilustraciones en loop', '1080 × 1080 · se trazan solas y vuelven a empezar', loopsV, 'rejilla', '150px')}

  <h2 id="kit">Kit de edición</h2>
  ${bloque(hex, 'Overlays horizontales', 'Para poner encima de videos filmados. Van en .mov (PNG con alfa, con sonido) para Premiere, After Effects, DaVinci y Final Cut, y en .webm para web y editores de celular.', kitH, 'rejilla', '300px')}
  ${bloque(hex, 'Overlays verticales', 'Los mismos, para Reels, TikTok e historias.', kitVt, 'rejilla', '170px')}

  <h2 id="destacadas">Destacadas de Instagram</h2>
  <section class="bloque">
    <header class="cab"><div class="idx">${hex}</div><div><h3>Portadas de historias destacadas</h3>
      <p class="meta">El hexágono oficial en oro, como el badge del logo. Los íconos son provisorios: se reemplazan por los
        de la galería de íconos del manual en cuanto los tengamos.</p></div></header>
    ${existsSync(resolve(OUT, 'destacadas/vista-en-el-perfil.png')) ? `<img src="${webImg('destacadas/vista-en-el-perfil.png')}" alt="Así se ven en el perfil"
      style="width:100%;max-width:100%;border-radius:12px;border:1px solid var(--linea);display:block;margin-bottom:18px">` : ''}
    <div class="rejilla" style="--w:120px">${destV}</div>
  </section>

  <h2 id="sonido">Sonido</h2>
  <section class="bloque">
    <header class="cab"><div class="idx">${hex}</div><div><h3>Identidad sonora</h3>
      <p class="meta">Sintetizada desde cero: sin licencias que pagar ni reclamos de copyright. La menor, 120 BPM.</p></div></header>
    <ul class="auds">
      ${existsSync(resolve(OUT, 'audio/efectos/logo-sonoro.mp3')) ? `<li class="aud logo"><div><b>Logo sonoro</b>
        <span>Impacto grave + campanas La · Mi · La. Cierra cada pieza.</span></div>
        <audio controls preload="none" src="${use('audio/efectos/logo-sonoro.mp3')}"></audio></li>` : ''}
      ${musica}
    </ul>
    <h3 style="margin-top:34px;font-size:18px">Efectos</h3>
    <ul class="auds" style="margin-top:14px">${efectos}</ul>
  </section>

  <h2 id="plan">Plan de publicación</h2>
  <p class="bajada" style="font-size:15.5px;margin-top:14px">${SEMANAS.length} semanas y ${plan.length} posteos, con el texto de cada uno listo para pegar.</p>
  ${semanas}
  <ul class="notas" style="margin-bottom:10px">${notas.map(n => `<li><p>${n}</p></li>`).join('')}</ul>

  <h2 id="fijas">Piezas fijas</h2>
  ${tiras}
  ${bloque(hex, 'Historias', '1080 × 1920', rej('historias', '9 / 16'), 'rejilla', '150px')}
  ${bloque(hex, 'Cuadradas', '1080 × 1080', rej('cuadradas', '1 / 1'), 'rejilla', '220px')}
  ${bloque(hex, 'Portadas y miniaturas', '1920 × 1080', rej('portadas', '16 / 9'), 'rejilla', '300px')}

  <h2 id="marca">De dónde sale</h2>
  <section class="bloque" style="border-bottom:0">
    <ul class="swatches">${paleta.map(([h, n, c]) => `<li><span class="chip" style="background:${h}"></span>
      <div class="txt"><b>${n}</b><span>${h} · ${c}</span></div></li>`).join('')}</ul>
    <ul class="notas">
      <li><b>Logo oficial</b><p>Extraído en vectores del LogosVectorizados.ai: el hexágono, las dos mitades del
        monograma y las 149 franjas del glitch se animan por separado. El degradado metálico está muestreado
        del original.</p></li>
      <li><b>Tipografía</b><p>El manual pide Neue Haas Grotesk Display Pro, de licencia paga. Se usa Inter con el
        interletrado cerrado; se cambia en un solo punto del código.</p></li>
      <li><b>Movimiento</b><p>Todo corre sobre una grilla de 120 BPM: los cortes caen en el tiempo fuerte y el
        sonido se genera con las mismas marcas, así calza al frame.</p></li>
      <li><b>Zonas seguras</b><p>En los Reels el texto evita el 14% de arriba, el 22% de abajo y el borde derecho,
        donde Instagram y TikTok ponen su interfaz.</p></li>
      <li><b>Sonido</b><p>Masterizado a −14 LUFS, el nivel que normalizan Instagram, TikTok y YouTube.</p></li>
      <li><b>Sin humo</b><p>El copy no usa cifras inventadas: el manual pide contar la realidad sin resultados
        inflados.</p></li>
    </ul>
  </section>
</div></main>

<footer><div class="env">Productos Digitales · <b>${HANDLE}</b> — el usuario es un marcador y se cambia en una constante.</div></footer>

<dialog class="visor" aria-label="Visor">
  <button class="cerrar" aria-label="Cerrar">×</button>
  <div class="caja"></div>
  <div class="barra"><button class="nav prev" aria-label="Anterior">‹</button><div class="pie"></div>
    <button class="nav next" aria-label="Siguiente">›</button></div>
</dialog>

<script>
  const visor = document.querySelector('dialog.visor');
  const caja = visor.querySelector('.caja'), pie = visor.querySelector('.pie');
  let lista = [], pos = 0;
  const shots = () => [...document.querySelectorAll('.shot')];

  function mostrar() {
    const b = lista[pos];
    caja.innerHTML = '';
    let el;
    if (b.dataset.kind === 'video') {
      el = document.createElement('video');
      el.controls = true; el.playsInline = true; el.autoplay = true;
      if (b.classList.contains('alpha')) { el.loop = true; el.classList.add('alpha'); }
    } else {
      el = document.createElement('img');
      el.alt = b.dataset.cap;
    }
    el.src = b.dataset.full;
    caja.appendChild(el);
    if (el.play) el.play().catch(() => {});
    pie.innerHTML = b.dataset.cap.replace(/<[^>]+>/g, '') + '  ·  ' + (pos + 1) + ' de ' + lista.length;
  }
  function abrir(b) {
    const grupo = b.closest('.rejilla, .tira');
    lista = grupo ? [...grupo.querySelectorAll('.shot')] : shots();
    pos = lista.indexOf(b);
    mostrar();
    if (!visor.open) visor.showModal();
  }
  function cerrar() { caja.innerHTML = ''; visor.close(); }
  shots().forEach(b => b.addEventListener('click', () => abrir(b)));
  visor.querySelector('.cerrar').addEventListener('click', cerrar);
  visor.addEventListener('close', () => { caja.innerHTML = ''; });
  caja.addEventListener('click', e => { if (e.target === caja) cerrar(); });
  visor.querySelector('.prev').addEventListener('click', () => { pos = (pos - 1 + lista.length) % lista.length; mostrar(); });
  visor.querySelector('.next').addEventListener('click', () => { pos = (pos + 1) % lista.length; mostrar(); });
  document.addEventListener('keydown', e => {
    if (!visor.open) return;
    if (e.key === 'ArrowRight') visor.querySelector('.next').click();
    if (e.key === 'ArrowLeft') visor.querySelector('.prev').click();
  });

  // los loops se reproducen solo mientras están a la vista (cuida la batería del celu)
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
    else v.pause();
  }), { rootMargin: '120px' }) : null;
  document.querySelectorAll('video.auto').forEach(v => io ? io.observe(v) : v.setAttribute('autoplay', ''));

  // copiar el texto del posteo; si el portapapeles no está disponible, se selecciona para copiar a mano
  document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.t;
    const ok = () => { b.textContent = 'Copiado'; setTimeout(() => (b.textContent = 'Copiar texto'), 1600); };
    const manual = () => {
      const px = b.parentElement.querySelector('.px');
      const r = document.createRange(); r.selectNodeContents(px);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      b.textContent = 'Seleccionado: copialo';
    };
    try { navigator.clipboard.writeText(t).then(ok, manual); } catch (e) { manual(); }
  }));

  // un solo audio a la vez
  document.addEventListener('play', e => {
    if (e.target.tagName !== 'AUDIO') return;
    document.querySelectorAll('audio').forEach(a => { if (a !== e.target) a.pause(); });
  }, true);
</script>`;

mkdirSync(resolve(root, 'build'), { recursive: true });
writeFileSync(resolve(root, 'build/galeria.html'), html);

const md = ['# Plan de publicación — Productos Digitales', '',
  `${SEMANAS.length} semanas. Cada posteo con su pieza, el texto listo para pegar y las historias que lo acompañan.`, '',
  ...SEMANAS.flatMap(n => [`## Semana ${n}`, '', ...plan.filter(x => x.semana === n).flatMap(x => [
    `### ${x.dia} · ${x.tipo} · ${x.titulo}`, '', `Pieza: \`out/${x.pieza}\``, '', x.texto, '', x.tags, '',
    ...(x.historias ? [`Historias: ${x.historias}`, ''] : []),
    ...(x.youtube ? [`YouTube: \`out/${x.youtube}\``, ''] : [])])]),
  '## Notas', '', ...notas.map(n => `- ${n}`), ''].join('\n');
writeFileSync(resolve(OUT, 'plan-de-publicacion.md'), md);

// piezas fijas: todas las rutas usadas por pic() ya entraron en `archivos`
const lista = [...archivos].filter(([, src]) => existsSync(resolve(root, src)));
const faltan = [...archivos].filter(([, src]) => !existsSync(resolve(root, src))).map(([p]) => p);
const peso = lista.reduce((n, [, src]) => n + statSync(resolve(root, src)).size, 0);
writeFileSync(resolve(root, 'build/galeria-archivos.json'), JSON.stringify(Object.fromEntries(lista), null, 1));
console.log(`galería · ${nVideos} videos · ${nFijas} fijas · ${nKit} kit · ${nAudio} audios`);
console.log(`${lista.length} archivos · ${(peso / 1e6).toFixed(1)} MB${faltan.length ? ` · faltan ${faltan.length}: ${faltan.slice(0, 5)}` : ''}`);
