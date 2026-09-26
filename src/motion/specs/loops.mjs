/* Biblioteca de ilustraciones en movimiento: cada dibujo se traza solo,
   respira y se apaga, listo para repetirse en loop. */
import { library } from '../../illus.mjs';

const DUR = 4.5;

export function jobs() {
  return Object.keys(library).map(name => {
    const id = `loop-${name}`;
    const body = `<div class="abs art" style="left:160px;top:160px;width:760px;height:760px">${library[name](`${id}-a`)}</div>`;
    const timeline = `
    tw(stage,{'--gx':[50,54],'--gy':[108,98]},0,${DUR},'sine');
    drawArt(document.querySelector('.art svg'),.15,1.5,.05);
    tw('.art',{scale:[.97,1.02]},0,${DUR - .45},'sine');
    tw('.art',{opacity:[1,0],scale:[1.02,1.05]},${DUR - .45},.45,'in');`;
    return {
      video: { id, w: 1080, h: 1080, dur: DUR, body, timeline, poster: 3.2, gx: '50%', gy: '104%',
        dustOpts: { n: 40 }, out: `loops/${id}.mp4`, crf: 20 },
    };
  });
}
