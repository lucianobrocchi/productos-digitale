/* Portadas en movimiento: la placa 1 de cada carrusel (4:5) y las
   portadas 16:9 para YouTube y el sitio. */
import { carousels, covers, HANDLE } from '../../content.mjs';
import { library } from '../../illus.mjs';

const DUR = 6;
const lineHtml = (arr, goldLast = true) => arr.map((l, i) =>
  `<div class="mask"><span class="line">${goldLast && i === arr.length - 1 ? `<span class="gold">${l}</span>` : l}</span></div>`).join('');

function cover45(c) {
  const s = c.slides[0];
  const id = `portada-${c.id}`;
  const body = `
  <img class="abs" id="${id}-lg" src="../../brand/logo/lockup-oscuro.png" style="left:72px;top:62px;height:64px">
  <div class="abs art" style="left:240px;top:150px;width:600px;height:600px">${library[s.art](`${id}-a`)}</div>
  <div class="abs" style="left:72px;right:72px;bottom:150px">
    <div class="eyebrow k">${s.eyebrow}</div>
    <h1 class="h1" data-fit style="margin-top:26px;font-size:92px">${lineHtml(s.h1)}</h1>
    <div class="rule"></div>
    <p class="lede sub" style="margin-top:28px;max-width:26ch">${s.lede}</p>
  </div>
  <div class="foot" id="${id}-f"><span>${HANDLE}</span><span class="swipe">Deslizá
    <svg class="arr" width="30" height="16" viewBox="0 0 30 16" fill="none"><path d="M2 8h24M20 2l6 6-6 6"
    stroke="#F0E281" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>`;
  const timeline = `
  tw(stage,{'--gx':[${parseFloat(s.gx)},${parseFloat(s.gx) - 5}],'--gy':[${parseFloat(s.gy) + 8},${parseFloat(s.gy)}]},0,${DUR},'sine');
  tw('#${id}-lg',{opacity:[0,1]},0,.5,'out');
  drawArt(document.querySelector('.art svg'),.1,1.6,.05);
  tw('.art',{scale:[.96,1.03]},0,${DUR},'linear');
  tw('.k',{opacity:[0,1],x:[-24,0]},.5,.5,'expo');
  lines('.h1 .line',.7,.14,.7);
  tw('.rule',{sx:[0,1]},1.5,.7,'expo'); document.querySelector('.rule').style.transformOrigin='0 50%';
  tw('.sub',{opacity:[0,1],y:[20,0]},1.9,.7,'out');
  tw('#${id}-f',{opacity:[0,1]},2.3,.6,'out');
  for (let t=2.8;t<${DUR - .5};t+=1.1){ tw('.arr',{x:[0,10]},t,.35,'out'); tw('.arr',{x:[10,0]},t+.35,.45,'inOut'); }`;
  return {
    video: { id, w: 1080, h: 1350, dur: DUR, body, timeline, poster: 4.2, gx: s.gx, gy: s.gy,
      out: `portadas/${id}.mp4` },
    audio: { dur: DUR, sections: [{ t0: 0, t1: DUR, e: 1 }], musicLevel: .45,
      cues: [{ t: .7, type: 'tick', level: .7 }, { t: .84, type: 'hit', level: .35 }] },
  };
}

export function cover169(s, { prefix = "portada-16x9-", out = "portadas" } = {}) {
  const id = `${prefix}${s.id}`;
  const body = `
  <img class="abs" id="${id}-lg" src="../../brand/logo/lockup-oscuro.png" style="left:72px;top:64px;height:62px">
  <div class="abs art" style="right:90px;top:180px;width:720px;height:720px">${library[s.art](`${id}-a`)}</div>
  <div class="abs" style="left:72px;width:1050px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
    <h1 class="h1" data-fit style="font-size:108px">${lineHtml(s.h1)}</h1>
    <div class="rule" style="width:72%"></div>
  </div>`;
  const timeline = `
  tw(stage,{'--gx':[${parseFloat(s.gx)},${parseFloat(s.gx) - 4}],'--gy':[${parseFloat(s.gy) + 6},${parseFloat(s.gy)}]},0,${DUR},'sine');
  tw('#${id}-lg',{opacity:[0,1]},0,.5,'out');
  drawArt(document.querySelector('.art svg'),.2,1.7,.05);
  tw('.art',{scale:[.95,1.02]},0,${DUR},'linear');
  lines('.h1 .line',.6,.16,.75);
  tw('.rule',{sx:[0,1]},1.4,.8,'expo'); document.querySelector('.rule').style.transformOrigin='0 50%';`;
  return {
    video: { id, w: 1920, h: 1080, dur: DUR, body, timeline, poster: 4, gx: s.gx, gy: s.gy,
      out: `${out}/${id}.mp4` },
    audio: { dur: DUR, sections: [{ t0: 0, t1: DUR, e: 1 }], musicLevel: .45,
      cues: [{ t: .6, type: 'hit', level: .4 }, { t: .76, type: 'tick', level: .6 }] },
  };
}

export function jobs() {
  return [...carousels.map(cover45), ...covers.map(cover169)];
}
