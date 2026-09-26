/* Citas animadas 1:1: las cinco cuadradas de las piezas fijas, en movimiento. */
import { squares, HANDLE } from '../../content.mjs';
import { library } from '../../illus.mjs';

const DUR = 7;

export function jobs() {
  return squares.map((q, n) => {
    const id = `cita-${q.id}`;
    const body = `
    <img class="abs" id="${id}-lg" src="../../brand/logo/lockup-oscuro.png" style="left:72px;top:62px;height:64px">
    <div class="abs art" style="right:-120px;bottom:-130px;width:640px;height:640px;opacity:.55">${library[q.art](`${id}-a`)}</div>
    <div class="abs" style="left:72px;right:72px;top:180px;bottom:140px;display:flex;flex-direction:column;justify-content:center">
      <svg class="qm" width="76" height="66" viewBox="0 0 76 66" fill="none" style="margin-bottom:34px">
        <path class="qm-h" d="M17 4 L31 12 V28 L17 36 L3 28 V12 Z M55 4 L69 12 V28 L55 36 L41 28 V12 Z"
              fill="rgba(240,226,129,.16)" stroke="#F0E281" stroke-width="2.4" stroke-linejoin="round"/>
        <path class="qm-t" d="M17 36 v10 a10 10 0 0 1 -10 10 M55 36 v10 a10 10 0 0 1 -10 10"
              stroke="#F0E281" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
      </svg>
      <div class="quote" data-fit style="font-size:74px">
        ${q.quote.map(l => `<div class="mask"><span class="line">${l}</span></div>`).join('')}</div>
      <div class="rule rule--short" style="margin-top:34px"></div>
    </div>
    <div class="foot" id="${id}-f"><span>${HANDLE}</span><span></span></div>`;
    const timeline = `
    tw(stage,{'--gx':[94,88],'--gy':[96,84]},0,${DUR},'sine');
    tw('#${id}-lg',{opacity:[0,1]},0,.5,'out');
    tw('.qm-h',{draw:[0,1]},.1,.7,'inOut'); tw('.qm-t',{draw:[0,1]},.5,.4,'out');
    tw('.qm',{scale:[.6,1]},.1,.6,'back');
    lines('.quote .line',.6,.18,.75);
    tw('.rule',{sx:[0,1]},${.6 + q.quote.length * .18 + .3},.7,'expo');
    document.querySelector('.rule').style.transformOrigin='0 50%';
    drawArt(document.querySelector('.art svg'),.9,2.2,.06);
    tw('.art',{scale:[.96,1.03],rot:[-2,2]},0,${DUR},'linear');
    tw('#${id}-f',{opacity:[0,1]},2,.6,'out');
    tw(stage,{opacity:[1,0]},${DUR - .35},.35,'in');`;
    const cues = q.quote.map((_, k) => ({ t: .6 + k * .18, type: 'tick', level: .55, freq: 1700 + k * 160 }));
    cues.push({ t: .6 + (q.quote.length - 1) * .18, type: 'hit', level: .35 });
    return {
      video: { id, w: 1080, h: 1080, dur: DUR, body, timeline, poster: 4.5, gx: '94%', gy: '90%',
        out: `citas/${id}.mp4` },
      audio: { dur: DUR, sections: [{ t0: 0, t1: 2, e: 0 }, { t0: 2, t1: DUR, e: 1 }], cues, musicLevel: .45 },
    };
  });
}
