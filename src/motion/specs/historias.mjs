/* Historias animadas: las mismas seis de las estáticas, en movimiento. */
import { stories, HANDLE } from '../../content.mjs';
import { library } from '../../illus.mjs';

const DUR = 7;

export function jobs() {
  return stories.map((s, i) => {
    const id = `historia-${s.id}`;
    const body = `
    <img class="abs" src="../../brand/logo/lockup-oscuro.png" style="left:72px;top:120px;height:60px" id="${id}-lg">
    <div class="abs art" style="left:${540 - 330}px;top:300px;width:660px;height:660px">${library[s.art](`${id}-a`)}</div>
    <div class="abs" style="left:72px;right:130px;top:1010px">
      <div class="kicker k">${s.eyebrow}</div>
      <div class="quote" data-fit style="margin-top:30px;font-size:96px;line-height:1.02">
        ${s.h.map(l => `<div class="mask"><span class="line">${l}</span></div>`).join('')}</div>
      <div class="rule" style="width:62%"></div>
      ${s.lede ? `<p class="lede sub" style="margin-top:28px;font-size:38px;max-width:24ch">${s.lede}</p>` : ''}
      ${s.cta ? `<div style="margin-top:40px"><span class="cta cta--ghost ctab" style="font-size:32px;padding:22px 36px">${s.cta}</span></div>` : ''}
    </div>
    <div class="abs handle" style="left:72px;bottom:118px;font-size:28px" id="${id}-h">${HANDLE}</div>`;
    const timeline = `
    tw(stage,{'--gx':[${parseFloat(s.gx)},${parseFloat(s.gx) - 6}],'--gy':[${parseFloat(s.gy) + 10},${parseFloat(s.gy)}]},0,${DUR},'sine');
    tw('#${id}-lg',{opacity:[0,1]},0,.5,'out');
    drawArt(document.querySelector('.art svg'),.1,1.6,.05);
    tw('.art',{scale:[.95,1.03]},0,${DUR},'linear');
    tw('.k',{opacity:[0,1],x:[-24,0]},.6,.5,'expo');
    lines('.quote .line',.8,.14,.7);
    tw('.rule',{sx:[0,1]},1.7,.7,'expo'); document.querySelector('.rule').style.transformOrigin='0 50%';
    tw('.sub',{opacity:[0,1],y:[20,0]},2.1,.7,'out');
    tw('.ctab',{scale:[.6,1],opacity:[0,1]},2.7,.55,'back');
    tw('#${id}-h',{opacity:[0,1]},2.9,.6,'out');
    tw(stage,{opacity:[1,0]},${DUR - .35},.35,'in');`;
    const cues = [{ t: .8, type: 'tick', level: .8 }];
    s.h.forEach((_, k) => cues.push({ t: .8 + k * .14, type: 'tick', level: .5, freq: 1700 + k * 150 }));
    if (s.cta) cues.push({ t: 2.7, type: 'hit', level: .4 });
    return {
      video: { id, w: 1080, h: 1920, dur: DUR, body, timeline, poster: 4.5, gx: s.gx, gy: s.gy,
        out: `historias/${id}.mp4` },
      audio: { dur: DUR, sections: [{ t0: 0, t1: 2, e: 1 }, { t0: 2, t1: DUR, e: 2 }], cues, musicLevel: .45 },
    };
  });
}
