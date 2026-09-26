/* ------------------------------------------------------------------
   Galería de íconos del manual (p. 26), redibujada en vector.

   Salidas en out/iconos/:
   - svg/tinta/*.svg   tinta #12171E, como en el manual (web, documentos)
   - svg/oro/*.svg     oro metálico de la marca, para fondos oscuros
   - png/oro/*.png     512 × 512 con transparencia
   - png/tinta/*.png   512 × 512 con transparencia
   - galeria-de-iconos.png         la página del manual, en el estilo de las piezas
   - galeria-de-iconos-claro.png   la misma página en claro, como el original
   ------------------------------------------------------------------ */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ICONOS_MANUAL } from '../src/iconos.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'out/iconos');
for (const d of ['svg/tinta', 'svg/oro', 'png/tinta', 'png/oro']) mkdirSync(resolve(OUT, d), { recursive: true });

const ORO = `<linearGradient id="oro" gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="90" y2="90">
  <stop offset="0" stop-color="#FFF3C4"/><stop offset=".35" stop-color="#F0E281"/><stop offset=".7" stop-color="#D6AE58"/>
  <stop offset="1" stop-color="#A37B3C"/></linearGradient>`;

/* un SVG suelto: el color queda escrito (currentColor no siempre lo respetan Figma o Illustrator) */
const standalone = (ic, color) => {
  const body = ic.svg(`m-${ic.key}`).replaceAll('currentColor', color === 'oro' ? 'url(#oro)' : color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <title>${ic.nombre} — Productos Digitales</title>${color === 'oro' ? `<defs>${ORO}</defs>` : ''}
  ${body}
</svg>
`;
};

for (const ic of ICONOS_MANUAL) {
  writeFileSync(resolve(OUT, `svg/tinta/${ic.key}.svg`), standalone(ic, '#12171E'));
  writeFileSync(resolve(OUT, `svg/oro/${ic.key}.svg`), standalone(ic, 'oro'));
}

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 512, height: 512 } });
for (const ic of ICONOS_MANUAL) {
  for (const [kind, color] of [['oro', 'oro'], ['tinta', '#12171E']]) {
    await pg.setContent(`<body style="margin:0;background:transparent">
      ${standalone(ic, color).replace('width="100" height="100"', 'width="512" height="512"')}</body>`);
    await pg.screenshot({ path: resolve(OUT, `png/${kind}/${ic.key}.png`), omitBackground: true });
  }
}

/* la página del manual, en 1920 × 1080: columna de texto + grilla de 5 × 4 */
const texto = `Los íconos están inspirados en las características que tiene el logotipo. Estos se podrán usar en sitios webs
  e íconos de historias destacadas de Instagram.`;
function lamina(oscuro) {
  const ink = oscuro ? '#F2F2F2' : '#12171E', line = oscuro ? 'rgba(240,226,129,.22)' : 'rgba(18,23,30,.22)';
  const cells = ICONOS_MANUAL.map((ic, i) => `
    <div style="display:grid;place-items:center;border-right:1.5px solid ${line};border-bottom:1.5px solid ${line};position:relative">
      <svg viewBox="0 0 100 100" width="118" height="118" style="color:${oscuro ? 'transparent' : '#12171E'};overflow:visible;
        ${oscuro ? 'filter:drop-shadow(0 0 18px rgba(240,226,129,.35))' : ''}">
        ${oscuro ? `<defs>${ORO.replace('id="oro"', `id="oro${i}"`)}</defs>` : ''}
        ${oscuro ? ic.svg(`g${i}`).replaceAll('currentColor', `url(#oro${i})`) : ic.svg(`g${i}`)}</svg>
      <span style="position:absolute;left:16px;bottom:12px;font:600 15px Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;
        color:${oscuro ? 'rgba(242,242,242,.38)' : 'rgba(18,23,30,.42)'}">${ic.nombre}</span>
    </div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${ROOT}/src/brand.css"></head>
  <body style="margin:0;width:1920px;height:1080px;overflow:hidden;background:${oscuro
    ? 'radial-gradient(70% 60% at 85% 100%,rgba(240,226,129,.16),rgba(163,123,60,.07) 40%,transparent 70%),#0E0E0E' : '#F2F2F2'};
    color:${ink};font-family:Inter,sans-serif;display:grid;grid-template-columns:520px 1fr">
    <div style="padding:90px 70px;display:flex;flex-direction:column;border-right:1.5px solid ${line}">
      <div style="font-weight:600;font-size:18px;opacity:.55;line-height:1.4">Manual de identidad<br>de Productos Digitales</div>
      <div style="margin-top:auto">
        <div style="font-weight:700;font-size:22px;letter-spacing:.22em;color:${oscuro ? '#F0E281' : '#A37B3C'}">07. ICONOGRAFÍA</div>
        <div style="margin-top:22px;font-weight:800;font-size:72px;letter-spacing:-.03em;line-height:1">Galería<br>de íconos</div>
        <p style="margin:34px 0 0;font-size:24px;line-height:1.5;opacity:.75;max-width:22ch">${texto}</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(4,1fr);border-left:0">${cells}</div>
  </body></html>`;
}
await pg.setViewportSize({ width: 1920, height: 1080 });
for (const [f, osc] of [['galeria-de-iconos.png', true], ['galeria-de-iconos-claro.png', false]]) {
  const tmp = resolve(ROOT, 'build/pages/_iconos.html');
  mkdirSync(dirname(tmp), { recursive: true });
  writeFileSync(tmp, lamina(osc));
  await pg.goto('file://' + tmp);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: resolve(OUT, f) });
}
await browser.close();
console.log(`${ICONOS_MANUAL.length} íconos en out/iconos/`);
