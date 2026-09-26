/* Arma la galería de revisión: una página con las 52 piezas en orden. */
import { carousels, stories, squares, covers, HANDLE } from '../src/content.mjs';
import { readdirSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'out');

mkdirSync(resolve(OUT, 'marca'), { recursive: true });
copyFileSync(resolve(root, 'brand/logo/lockup-oscuro.png'), resolve(OUT, 'marca/lockup-oscuro.png'));

const ls = p => readdirSync(resolve(OUT, p)).filter(f => f.endsWith('.png')).sort();

const hex = `<svg class="hex" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5 21 6.75v10.5L12 22.5 3 17.25V6.75Z"/></svg>`;

const fig = (src, cap, ratio, eager = false) => `
  <figure class="pz" style="--r:${ratio}">
    <button class="shot" data-full="${src}" data-cap="${cap.replace(/"/g, '&quot;')}">
      <img src="${src}" alt="${cap.replace(/"/g, '&quot;')}" ${eager ? '' : 'loading="lazy"'} decoding="async">
    </button>
    <figcaption>${cap}</figcaption>
  </figure>`;

/* ---- carruseles: una tira por carrusel, en orden de deslizamiento ---- */
const tiras = carousels.map((c, ci) => {
  const files = ls(`carruseles/${c.id}`);
  return `
  <section class="bloque">
    <header class="cab">
      <div class="idx">${String(ci + 1).padStart(2, '0')}</div>
      <div>
        <h3>${c.titulo}</h3>
        <p class="meta">${files.length} placas · 1080 × 1350 · <code>${c.id}</code></p>
      </div>
    </header>
    <div class="tira">
      ${files.map((f, i) => fig(`carruseles/${c.id}/${f}`,
        `${String(i + 1).padStart(2, '0')} / ${String(files.length).padStart(2, '0')}`,
        '4 / 5', ci === 0 && i < 3)).join('')}
    </div>
  </section>`;
}).join('');

const rejilla = (titulo, nota, dir, ratio, ancho) => {
  const files = ls(dir);
  return `
  <section class="bloque">
    <header class="cab">
      <div class="idx">${hex}</div>
      <div><h3>${titulo}</h3><p class="meta">${files.length} piezas · ${nota}</p></div>
    </header>
    <div class="rejilla" style="--w:${ancho}">
      ${files.map(f => fig(`${dir}/${f}`, f.replace('.png', ''), ratio)).join('')}
    </div>
  </section>`;
};

const paleta = [
  ['#12171E', 'Negro profundo', 'C89 M86 Y68 K68'],
  ['#A37B3C', 'Dorado', 'C37 M58 Y89 K1'],
  ['#F0E281', 'Dorado claro', 'C10 M12 Y63 K0'],
  ['#F2F2F2', 'Neutro claro', 'C7 M6 Y5 K0'],
];

const total = ['carruseles'].length && carousels.reduce((n, c) => n + ls(`carruseles/${c.id}`).length, 0)
  + stories.length + squares.length + covers.length;

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
    --tenue:rgba(242,242,242,.56); --apagado:rgba(242,242,242,.38);
    --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  }
  *{box-sizing:border-box}
  body{
    margin:0;background:var(--bg);color:var(--papel);font-family:var(--sans);
    font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;
  }
  .env{max-width:1240px;margin:0 auto;padding-inline:24px;padding-block:0}

  /* ---------------------------- encabezado ---------------------------- */
  .hero{position:relative;overflow:hidden;border-bottom:1px solid var(--linea)}
  .hero::before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(110% 80% at 88% 100%, rgba(240,226,129,.16) 0%,
      rgba(163,123,60,.09) 34%, transparent 68%);
  }
  .hero .env{position:relative;padding-block:56px 60px}
  .marca{height:52px;width:auto;display:block}
  h1{
    font-size:clamp(38px,6.2vw,72px);font-weight:800;letter-spacing:-.028em;
    line-height:1.02;margin:38px 0 0;text-wrap:balance;text-transform:uppercase;
  }
  h1 em{font-style:normal;color:var(--oro)}
  .bajada{margin:22px 0 0;max-width:62ch;color:var(--tenue);font-size:18px}
  .cifras{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px;list-style:none;padding:0}
  .cifras li{
    border:1px solid rgba(240,226,129,.26);border-radius:999px;padding:9px 18px;
    font-size:14px;font-weight:600;color:var(--oro);
    font-variant-numeric:tabular-nums;
  }

  /* ------------------------------ bloques ------------------------------ */
  .bloque{padding-block:56px;border-bottom:1px solid var(--linea)}
  .cab{display:flex;gap:20px;align-items:flex-start;margin-bottom:30px}
  .idx{
    flex:0 0 auto;width:52px;height:52px;border-radius:14px;display:grid;place-items:center;
    background:linear-gradient(155deg,var(--oro),var(--oro-hondo));color:#12171E;
    font-weight:800;font-size:19px;font-variant-numeric:tabular-nums;
  }
  .hex{width:26px;height:26px;fill:#12171E}
  h2{font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
     color:var(--oro);margin:0 0 30px}
  h3{font-size:clamp(21px,2.6vw,27px);font-weight:700;letter-spacing:-.018em;margin:0;line-height:1.2}
  .meta{margin:5px 0 0;color:var(--apagado);font-size:14px}
  code{font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:.92em;color:var(--tenue)}

  /* --------------------------- tiras y rejillas --------------------------- */
  .tira{
    display:flex;gap:14px;overflow-x:auto;padding-bottom:14px;
    scroll-snap-type:x mandatory;scrollbar-width:thin;
    scrollbar-color:rgba(240,226,129,.34) transparent;
  }
  .tira .pz{flex:0 0 clamp(170px,22vw,232px);scroll-snap-align:start}
  .rejilla{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(var(--w),1fr))}

  .pz{margin:0}
  .shot{
    display:block;width:100%;padding:0;border:1px solid var(--linea);background:var(--bg-2);
    border-radius:12px;overflow:hidden;cursor:zoom-in;aspect-ratio:var(--r);
    transition:border-color .18s ease, transform .18s ease;
  }
  .shot:hover,.shot:focus-visible{border-color:rgba(240,226,129,.52);transform:translateY(-2px)}
  .shot:focus-visible{outline:2px solid var(--oro);outline-offset:3px}
  .shot img{width:100%;height:100%;max-width:100%;object-fit:cover;display:block}
  figcaption{margin-top:9px;font-size:12.5px;color:var(--apagado);
             font-variant-numeric:tabular-nums;letter-spacing:.02em}

  /* ------------------------------ paleta ------------------------------ */
  .swatches{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
            list-style:none;padding:0;margin:0}
  .swatches li{border:1px solid var(--linea);border-radius:14px;overflow:hidden;background:var(--bg-2)}
  .chip{height:88px;display:block}
  .swatches .txt{padding:14px 16px}
  .swatches b{display:block;font-size:15px;font-weight:600}
  .swatches span{display:block;font-size:12.5px;color:var(--apagado);
                 font-family:ui-monospace,'SF Mono',Menlo,monospace;margin-top:3px}

  .notas{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));
         margin-top:6px;padding:0;list-style:none}
  .notas li{border-left:2px solid rgba(240,226,129,.34);padding-left:18px}
  .notas b{display:block;margin-bottom:6px;font-size:15px}
  .notas p{margin:0;color:var(--tenue);font-size:14.5px}

  footer{padding-block:44px 60px;color:var(--apagado);font-size:14px}
  footer .arroba{color:var(--oro);font-weight:600}

  /* ------------------------------ visor ------------------------------ */
  dialog.visor{
    border:0;padding:0;background:transparent;max-width:100vw;max-height:100vh;
    width:100%;height:100%;overflow:hidden;
  }
  dialog.visor::backdrop{background:rgba(6,6,6,.93)}
  .visor .caja{width:100%;height:100%;display:grid;place-items:center;padding:28px;cursor:zoom-out}
  .visor img{max-width:min(1100px,94vw);max-height:86vh;width:auto;height:auto;
             border-radius:10px;border:1px solid rgba(240,226,129,.26);display:block}
  .visor .pie{position:fixed;left:0;right:0;bottom:22px;text-align:center;
              color:var(--tenue);font-size:13.5px;letter-spacing:.04em}

  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
  @media (max-width:560px){ .hero .env{padding-block:40px 44px} .bloque{padding-block:40px} }
</style>

<header class="hero">
  <div class="env">
    <img class="marca" src="marca/lockup-oscuro.png" alt="Productos Digitales">
    <h1>${total} piezas de<br><em>contenido</em></h1>
    <p class="bajada">Carruseles, historias, placas de cita y portadas para
      Productos Digitales, construidas sobre el Manual de Identidad de la marca.
      Ilustración vectorial original, dibujada sobre la misma geometría que arma
      el isotipo. Tocá cualquier pieza para verla en tamaño completo.</p>
    <ul class="cifras">
      <li>5 carruseles · 37 placas</li>
      <li>6 historias</li>
      <li>5 cuadradas</li>
      <li>4 portadas</li>
      <li>16 ilustraciones</li>
    </ul>
  </div>
</header>

<main>
  <div class="env">
    <section class="bloque" style="border-bottom:0;padding-bottom:0">
      <h2>Carruseles</h2>
    </section>
    ${tiras}
    <section class="bloque" style="border-bottom:0;padding-bottom:0"><h2>Otros formatos</h2></section>
    ${rejilla('Historias', '1080 × 1920 · 9:16', 'historias', '9 / 16', '180px')}
    ${rejilla('Cuadradas', '1080 × 1080 · 1:1', 'cuadradas', '1 / 1', '250px')}
    ${rejilla('Portadas y miniaturas', '1920 × 1080 · 16:9', 'portadas', '16 / 9', '330px')}

    <section class="bloque">
      <h2>De dónde sale</h2>
      <ul class="swatches">
        ${paleta.map(([h, n, c]) => `<li>
          <span class="chip" style="background:${h}"></span>
          <div class="txt"><b>${n}</b><span>${h} · ${c}</span></div></li>`).join('')}
      </ul>
      <ul class="notas" style="margin-top:34px">
        <li><b>Tipografía</b><p>El manual pide Neue Haas Grotesk Display Pro, de
          licencia paga. Las piezas usan Inter, la grotesca libre más cercana, con
          el interletrado cerrado. Se cambia en un solo punto del código.</p></li>
        <li><b>Logo sobre negro</b><p>El Drive no traía la versión clara que usan
          las portadas. Se reconstruyó respetando las proporciones del original:
          hexágono 267 × 241, texto 862 × 242, separación de 40 px.</p></li>
        <li><b>Ilustración</b><p>Las portadas oficiales usan fotografía y render 3D.
          Acá hay 16 dibujos vectoriales propios, en trazo dorado, todos levantados
          sobre el hexágono regular del isotipo.</p></li>
        <li><b>Tono</b><p>El del manual: transparente y directo, sin humo, cercano,
          profesional y motivador. Español rioplatense.</p></li>
      </ul>
    </section>
  </div>
</main>

<footer><div class="env">Productos Digitales · <span class="arroba">${HANDLE}</span>
  — el usuario es un marcador y se cambia en una sola constante.</div></footer>

<dialog class="visor">
  <div class="caja"><img alt=""></div>
  <div class="pie"></div>
</dialog>

<script>
  const visor = document.querySelector('dialog.visor');
  const grande = visor.querySelector('img');
  const pie = visor.querySelector('.pie');
  let actual = [], pos = 0;

  const abrir = (btn) => {
    actual = [...document.querySelectorAll('.shot')];
    pos = actual.indexOf(btn);
    mostrar();
    if (!visor.open) visor.showModal();
  };
  const mostrar = () => {
    const b = actual[pos];
    grande.src = b.dataset.full;
    grande.alt = b.dataset.cap;
    pie.textContent = b.dataset.cap + '  ·  ' + (pos + 1) + ' de ' + actual.length
      + '  ·  ← → para recorrer, Esc para cerrar';
  };
  document.querySelectorAll('.shot').forEach(b =>
    b.addEventListener('click', () => abrir(b)));
  visor.querySelector('.caja').addEventListener('click', () => visor.close());
  document.addEventListener('keydown', e => {
    if (!visor.open) return;
    if (e.key === 'ArrowRight') { pos = (pos + 1) % actual.length; mostrar(); }
    if (e.key === 'ArrowLeft')  { pos = (pos - 1 + actual.length) % actual.length; mostrar(); }
  });
</script>`;

mkdirSync(resolve(root, 'build'), { recursive: true });
writeFileSync(resolve(root, 'build/galeria.html'), html);

/* Lista de archivos para publicar junto a la página. */
const archivos = [
  'marca/lockup-oscuro.png',
  ...carousels.flatMap(c => ls(`carruseles/${c.id}`).map(f => `carruseles/${c.id}/${f}`)),
  ...ls('historias').map(f => `historias/${f}`),
  ...ls('cuadradas').map(f => `cuadradas/${f}`),
  ...ls('portadas').map(f => `portadas/${f}`),
];
writeFileSync(resolve(root, 'build/galeria-archivos.json'), JSON.stringify(archivos, null, 1));
console.log(`galería lista · ${total} piezas · ${archivos.length} archivos para publicar`);
