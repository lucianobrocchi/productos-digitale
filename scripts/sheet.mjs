/* Hoja de contacto de las ilustraciones, para revisarlas de un vistazo. */
import { chromium } from 'playwright';
import { library } from '../src/illus.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
mkdirSync(resolve(root, 'build'), { recursive: true });

const cells = Object.entries(library).map(([name, fn]) => `
  <figure>
    <div class="box">${fn(name)}</div>
    <figcaption>${name}</figcaption>
  </figure>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../src/brand.css">
<style>
  body{background:#0E0E0E;padding:48px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
  .box{width:100%;aspect-ratio:1;display:grid;place-items:center;
       background:radial-gradient(70% 70% at 50% 50%,#141310,#0E0E0E);
       border:1px solid rgba(240,226,129,.14);border-radius:20px;padding:22px}
  .box svg{width:100%;height:100%}
  figcaption{margin-top:12px;font:600 20px Inter,sans-serif;color:#F0E281;text-align:center}
</style></head><body><div class="grid">${cells}</div></body></html>`;

writeFileSync(resolve(root, 'build/sheet.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(root, 'build/sheet.html'));
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(root, 'build/sheet.png'), fullPage: true });
await browser.close();
console.log('build/sheet.png listo —', Object.keys(library).length, 'ilustraciones');
