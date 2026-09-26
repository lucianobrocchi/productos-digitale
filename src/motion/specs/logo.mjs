/* ------------------------------------------------------------------
   Revelado del logo: el hexágono se traza, se llena de oro, las franjas
   del glitch barren el monograma, golpe, y el lockup se arma con el lema.
   ------------------------------------------------------------------ */
import { logoMark, GLITCH_LINES } from '../logo.mjs';

/* proporciones del lockup oficial (medidas en el export de 288 dpi) */
const HEX_RATIO = 534 / 478;        // ancho / alto del hexágono
const GAP = 163 / 961;              // separación / alto del badge
const WORD = 3446 / 963;            // ancho / alto del wordmark
const PAD = 14 / 478;               // aire del viewBox del svg

export const LOGO_CUES = [
  { t: 0.0, type: 'riser', len: 2.0 },
  { t: 1.1, type: 'glitch' },
  { t: 2.0, type: 'logo' },
  { t: 2.45, type: 'whoosh', len: .8 },
  { t: 3.55, type: 'tick' },
];

/**
 * @param bh  alto del hexágono en el lockup final
 * @param tag si lleva el lema debajo
 */
export function logoReveal({ id, w, h, bh, alpha = false, tag = true, dur = 6, t0 = 0, fadeOut = true, embedded = false }) {
  const hw = bh * HEX_RATIO, gap = bh * GAP, ww = bh * WORD;
  const total = hw + gap + ww;
  const left = (w - total) / 2;
  const top = (h - bh) / 2 - (tag ? bh * .28 : 0);
  const big = Math.min(2.1, (h * .42) / bh);                       // escala del badge solo, al centro
  const dx = w / 2 - (left + hw / 2), dy = h / 2 - (top + bh / 2);
  const pad = bh * PAD;
  const tagSize = Math.round(bh * .27);
  const T = x => +(x + t0).toFixed(3);

  const body = `
  <div class="flash" id="${id}-flash"></div>
  <div class="abs" id="${id}-mk" style="left:${left}px;top:${top}px;width:${hw}px;height:${bh}px">
    <div id="${id}-pop" style="position:absolute;inset:0">
      <div class="gl" id="${id}-gl" style="position:absolute;inset:0">
        <div class="gl-src" style="position:absolute;inset:${-pad}px">${logoMark(id)}</div>
      </div>
    </div>
  </div>
  <img class="abs" id="${id}-wm" src="../../brand/logo/wordmark-oficial-claro.png"
       style="left:${left + hw + gap}px;top:${top}px;height:${bh}px;width:${ww}px">
  ${tag ? `<div class="abs" id="${id}-tag" style="left:0;right:0;top:${top + bh + bh * .42}px;text-align:center;
       font-weight:600;font-size:${tagSize}px;letter-spacing:-.01em;color:rgba(242,242,242,.78)">
    <span class="mask" style="display:inline-block"><span class="line" style="display:inline-block">
      Lo que hace falta es <span class="gold" style="font-weight:800">método</span>.</span></span>
  </div>` : ''}`;

  const timeline = `
  const q = s => document.querySelector(s);
  const svg = q('#${id}-gl .gl-src svg');
  const hexLine = svg.querySelector('.hex-line'), hexFill = svg.querySelector('.hex-fill');
  const monoB = svg.querySelector('.mono-b'), sheen = svg.querySelector('.hex-sheen');
  const gl = [...svg.querySelectorAll('.gl-line')];

  // estado inicial: badge solo, grande y al centro
  tw('#${id}-mk', { x:[${dx},${dx}], y:[${dy},${dy}], scale:[${big},${big}] }, 0, 0);
  ${!alpha && !embedded ? `tw(stage, { '--gy':[112,94], '--gx':[70,86] }, ${T(0)}, ${dur}, 'sine');` : ''}

  // 1 · el hexágono se traza
  tw(hexLine, { draw:[0,1], opacity:[1,1] }, ${T(.1)}, 1.1, 'inOut');
  tw(hexFill, { opacity:[0,1] }, ${T(.95)}, .55, 'out');
  tw(hexLine, { opacity:[1,.0] }, ${T(1.7)}, .6, 'out');

  // 2 · las franjas del glitch barren el monograma
  const R = PD.rand(11);
  gl.forEach((l, i) => {
    const s = ${T(1.05)} + (i / ${GLITCH_LINES}) * .45 + R() * .06;
    tw(l, { opacity:[0,1], x:[(R() - .5) * 60, 0] }, s, .22, 'expo');
  });
  glitch('#${id}-gl', ${T(1.1)}, .38, ${Math.round(bh * .18)}, 5);
  tw(monoB, { opacity:[0,1], x:[70,0] }, ${T(1.35)}, .5, 'expo');

  // 3 · golpe: brillo metálico y destello
  tw('#${id}-pop', { scale:[1.1,1] }, ${T(2.0)}, .55, 'back');
  tw('#${id}-flash', { opacity:[0,.85] }, ${T(1.96)}, .08, 'out');
  tw('#${id}-flash', { opacity:[.85,0] }, ${T(2.04)}, .7, 'out');
  tw(sheen, { x:[0,900] }, ${T(1.9)}, .9, 'inOut');

  // 4 · se arma el lockup
  tw('#${id}-mk', { x:[${dx},0], y:[${dy},0], scale:[${big},1] }, ${T(2.4)}, .85, 'inOut');
  tw('#${id}-wm', { clipX:[0,1], x:[-${Math.round(bh * .15)},0], opacity:[0,1] }, ${T(2.78)}, .75, 'expo');
  ${tag ? `lines('#${id}-tag .line', ${T(3.5)}, 0, .8);` : ''}
  tw(sheen, { x:[0,900] }, ${T(3.9)}, 1.1, 'inOut');

  ${fadeOut ? `tw(stage, { opacity:[1,0] }, ${T(dur - .4)}, .4, 'in');` : ''}
  `;

  return { id, w, h, dur: dur + t0, body, timeline, alpha, poster: t0 + 4.6, gx: '50%', gy: '100%' };
}
