/* Captura frames sueltos de un spec y los junta en una hoja, para revisar
   la animación sin renderizar el video entero. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { page, BUILD, ROOT } from './core.mjs';

export async function preview(browser, spec, times, dest, { thumb = 480 } = {}) {
  mkdirSync(BUILD, { recursive: true });
  const html = join(BUILD, `${spec.id}.preview.html`);
  writeFileSync(html, page(spec));
  const pg = await browser.newPage({ viewport: { width: spec.w, height: spec.h }, deviceScaleFactor: 1 });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + html);
  await pg.evaluate(async () => { await document.fonts.ready; });
  await pg.waitForTimeout(150);
  if (errs.length) throw new Error(errs.join(' | '));
  const shots = [];
  for (const t of times) {
    await pg.evaluate(tt => window.__seek(tt), t);
    shots.push({ t, b64: (await pg.screenshot({ type: 'jpeg', quality: 80 })).toString('base64') });
  }
  await pg.close();
  // hoja: miniaturas con la marca de tiempo
  const tw = thumb, th = Math.round(thumb * spec.h / spec.w);
  const cols = Math.min(times.length, spec.w >= spec.h ? 3 : 5);
  const sheet = `<!doctype html><body style="margin:0;background:#222;font:600 15px sans-serif;color:#F0E281">
    <div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:10px;padding:10px">
    ${shots.map(s => `<div><img src="data:image/jpeg;base64,${s.b64}" style="width:${tw}px;height:${th}px;display:block">
      <div style="padding:3px 0">${s.t.toFixed(2)} s</div></div>`).join('')}</div></body>`;
  const sp = await browser.newPage({ viewport: { width: cols * (tw + 10) + 10, height: 400 } });
  await sp.setContent(sheet);
  await sp.screenshot({ path: dest, fullPage: true, type: 'jpeg', quality: 85 });
  await sp.close();
  return dest;
}

export { ROOT };
