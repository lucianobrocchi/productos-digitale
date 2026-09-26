/* ------------------------------------------------------------------
   Kit de edición: overlays con fondo transparente para usar sobre
   videos filmados (Premiere, After Effects, DaVinci, Final Cut, CapCut).
   Cada uno sale en .mov (PNG con alfa, con su sonido) y .webm (VP9 alfa).
   ------------------------------------------------------------------ */
import { logoReveal, LOGO_CUES } from './logo.mjs';
import { logoMark } from '../logo.mjs';
import { HANDLE } from '../../content.mjs';

const kit = (id, w, h, dur, body, timeline, cues, poster) => ({
  video: { id, w, h, dur, body, timeline, alpha: true, webm: true, poster, out: `kit/${id}.mov` },
  audio: { dur, music: false, cues, lufs: -16 },
});

/* zócalo de nombre: badge, placa y dos líneas de texto */
function zocalo(id, w, h, { x, y, s = 1 }) {
  const body = `
  <div class="abs zc" style="left:${x}px;top:${y}px;height:${150 * s}px;display:flex;align-items:center;gap:${26 * s}px">
    <div class="bd" style="position:relative;width:${150 * s}px;height:${134 * s}px;flex:0 0 auto">
      <div class="gl" style="position:absolute;inset:0"><div class="gl-src" style="position:absolute;inset:0">${logoMark(id + 'm')}</div></div>
    </div>
    <div class="plate" style="position:relative;padding:${22 * s}px ${40 * s}px ${22 * s}px ${34 * s}px;border-radius:${18 * s}px;
         background:rgba(14,14,14,.78);border-left:${5 * s}px solid #F0E281">
      <div class="mask"><span class="line nm" style="font-weight:800;font-size:${56 * s}px;letter-spacing:-.02em;color:#F2F2F2">
        Nombre Apellido</span></div>
      <div class="mask"><span class="line rl" style="margin-top:${6 * s}px;font-weight:700;font-size:${26 * s}px;letter-spacing:.18em;
        text-transform:uppercase;color:#F0E281">Fundador · Productos Digitales</span></div>
    </div>
  </div>`;
  const timeline = `
  const svg=document.querySelector('.bd svg');
  tw(svg.querySelector('.hex-line'),{draw:[0,1]},.05,.5,'inOut');
  tw(svg.querySelector('.hex-fill'),{opacity:[0,1]},.3,.3,'out');
  tw(svg.querySelector('.hex-line'),{opacity:[1,0]},.7,.4,'out');
  [...svg.querySelectorAll('.gl-line')].forEach((l,i)=>tw(l,{opacity:[0,1]},.35+i*.0025,.12,'out'));
  tw(svg.querySelector('.mono-b'),{opacity:[0,1],x:[40,0]},.45,.35,'expo');
  tw('.bd',{scale:[.4,1]},0,.55,'back');
  glitch('.bd .gl',.4,.22,${Math.round(18 * s)},3);
  tw('.plate',{clipX:[0,1]},.35,.55,'expo');
  lines('.plate .line',.55,.12,.55);
  tw('.zc',{opacity:[1,0],x:[0,-40]},4.3,.45,'in');`;
  return kit(id, w, h, 5, body, timeline,
    [{ t: .02, type: 'whoosh', len: .5, level: .6 }, { t: .4, type: 'glitch', len: .22, level: .6 }, { t: .55, type: 'tick' },
      { t: 4.28, type: 'whoosh', len: .45, level: .45, up: false }], 2.5);
}

/* transición: desgarro dorado + destello a pantalla completa */
function transicion(id, w, h) {
  const body = `<div class="flash" id="${id}-fl"></div><div class="tear" id="${id}-t">${'<i></i>'.repeat(22)}</div>`;
  const timeline = `
  PD.tear('#${id}-t',.05,.55,9);
  tw('#${id}-fl',{opacity:[0,.9]},.22,.08,'out'); tw('#${id}-fl',{opacity:[.9,0]},.3,.55,'out');`;
  return kit(id, w, h, 1.0, body, timeline,
    [{ t: 0, type: 'whoosh', len: .4, level: .7 }, { t: .05, type: 'glitch', len: .55, level: .8, seed: 4 }], .32);
}

/* cierre: "Seguinos" con el badge y el usuario */
function seguinos(id, w, h) {
  const body = `
  <div class="center" style="top:${h * .52}px;bottom:auto;height:auto;left:0;right:0;flex-direction:column;gap:26px">
    <div class="bd" style="position:relative;width:170px;height:152px">${logoMark(id + 'm')}</div>
    <span class="pill pl">Seguinos
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#12171E" stroke-width="3"
        stroke-linecap="round"/></svg></span>
    <div class="handle hd" style="font-size:40px;color:#F2F2F2;text-shadow:0 2px 18px rgba(0,0,0,.6)">${HANDLE}</div>
  </div>`;
  const timeline = `
  tw('.bd',{scale:[0,1],rot:[-40,0]},0,.6,'back');
  tw('.pl',{scale:[.3,1],opacity:[0,1]},.25,.55,'back');
  tw('.hd',{opacity:[0,1],y:[20,0]},.5,.5,'out');
  for(let t=1.2;t<3.2;t+=.9){ tw('.pl',{scale:[1,1.06]},t,.2,'out'); tw('.pl',{scale:[1.06,1]},t+.2,.35,'inOut'); }
  tw('.center',{opacity:[1,0],y:[0,30]},3.5,.45,'in');`;
  return kit(id, w, h, 4, body, timeline,
    [{ t: 0, type: 'hit', level: .45 }, { t: .25, type: 'tick', freq: 2200 }, { t: 1.2, type: 'tick', level: .5 },
      { t: 2.1, type: 'tick', level: .5 }], 2);
}

/* "Guardá este video": el marcador se dibuja y se llena */
function guardalo(id, w, h) {
  const body = `
  <div class="center" style="top:${h * .56}px;bottom:auto;left:0;right:0;flex-direction:row;gap:26px">
    <svg class="bk" width="110" height="130" viewBox="0 0 110 130" fill="none">
      <path class="bk-l" d="M18 10 h74 a8 8 0 0 1 8 8 v100 l-45 -28 l-45 28 v-100 a8 8 0 0 1 8 -8Z"
            stroke="#F0E281" stroke-width="7" stroke-linejoin="round"/>
      <path class="bk-f" d="M18 10 h74 a8 8 0 0 1 8 8 v100 l-45 -28 l-45 28 v-100 a8 8 0 0 1 8 -8Z" fill="#F0E281"/>
    </svg>
    <div style="text-align:left;background:rgba(14,14,14,.74);padding:22px 34px;border-radius:20px">
      <div class="mask"><span class="line" style="font-weight:900;font-size:58px;letter-spacing:-.02em;color:#F2F2F2">Guardá este video</span></div>
      <div class="mask"><span class="line" style="font-weight:600;font-size:32px;color:#F0E281">para cuando lo necesites</span></div>
    </div>
  </div>`;
  const timeline = `
  tw('.bk-l',{draw:[0,1]},.05,.6,'inOut');
  tw('.bk-f',{opacity:[0,1],scale:[.6,1]},.6,.4,'back');
  tw('.bk',{scale:[1,1.15]},.95,.15,'out'); tw('.bk',{scale:[1.15,1]},1.1,.3,'inOut');
  lines('.center .line',.25,.12,.55);
  tw('.center',{opacity:[1,0],y:[0,30]},3.05,.45,'in');`;
  return kit(id, w, h, 3.5, body, timeline, [{ t: .05, type: 'whoosh', len: .5, level: .5 }, { t: .95, type: 'tick', freq: 2600 }], 1.8);
}

export function jobs() {
  const logo = logoReveal({ id: 'kit-logo-16x9', w: 1920, h: 1080, bh: 200, alpha: true, fadeOut: false });
  return [
    { video: { ...logo, webm: true, out: 'kit/kit-logo-16x9.mov' }, audio: { dur: 6, music: false, cues: LOGO_CUES, lufs: -16 } },
    zocalo('kit-zocalo-16x9', 1920, 1080, { x: 120, y: 790, s: 1 }),
    zocalo('kit-zocalo-9x16', 1080, 1920, { x: 72, y: 1180, s: .82 }),
    transicion('kit-transicion-16x9', 1920, 1080),
    transicion('kit-transicion-9x16', 1080, 1920),
    seguinos('kit-seguinos-9x16', 1080, 1920),
    guardalo('kit-guardalo-9x16', 1080, 1920),
  ];
}
