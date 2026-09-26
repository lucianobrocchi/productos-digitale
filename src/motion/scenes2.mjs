/* ------------------------------------------------------------------
   Motion v2 — lenguaje de movimiento de los Relatos.

   Lo que cambia respecto de la primera versión:
   - Cada escena es un plano con su propia luz (fondo opaco), así los cortes
     se sienten como cortes de cámara y las transiciones pueden mover el
     cuadro entero: barrido (whip), zoom a través, iris hexagonal, láminas
     doradas (las franjas del glitch del isotipo) y empuje vertical.
   - Tipografía cinética por letra: cada línea se ajusta al ancho del cuadro
     como un afiche, las letras suben desde una máscara con resorte y las
     palabras doradas son metal con un barrido de luz.
   - Golpes con peso: el fondo se vuelve oro, la palabra cae desde la cámara,
     sacude el plano, se abre en separación de color y suelta una onda
     hexagonal.
   - El personaje es un muñeco articulado: camina, cambia de pose con
     resorte y respira. La cabeza es el hexágono de la marca.
   - Todo se renderiza con desenfoque de movimiento real (subcuadros) y un
     brillo suave en las luces altas (ver core.mjs).
   ------------------------------------------------------------------ */
import { hexPath } from '../illus.mjs';
import { rigFigure, POSES } from '../figure.mjs';
import { logoReveal, LOGO_CUES } from './specs/logo.mjs';
import { BPM, BEAT } from './scenes.mjs';

const W = 1080, H = 1920;
const SAFE = { l: 90, r: 150, t: 300, b: 440 };      // interfaz de Reels/TikTok
const BOX = W - SAFE.l - SAFE.r;

/* luz principal de cada plano (x %, y %): varía para que cada corte cambie de ambiente */
const LIGHTS = [[80, 14], [16, 26], [86, 84], [14, 80], [50, 6], [70, 50], [24, 58], [50, 96]];

const darkBg = ([x, y]) => `background:
  radial-gradient(70% 48% at ${x}% ${y}%, rgba(240,226,129,.22), rgba(163,123,60,.11) 36%, transparent 68%),
  radial-gradient(60% 40% at ${100 - x}% ${100 - y}%, rgba(163,123,60,.10), transparent 70%),
  linear-gradient(180deg,#101010,#0B0B0B)`;
const GOLD_BG = `background:
  radial-gradient(90% 60% at 30% 20%, #FFF6CF 0%, rgba(255,246,207,0) 55%),
  linear-gradient(160deg,#F0E281 0%,#E3C46B 38%,#C99A4A 72%,#A37B3C 100%)`;

export const CSS2 = `
.sc2 .cam,.sc2 .ent,.sc2 .drift{position:absolute;inset:0;transform-origin:50% 50%}
.sc2 .sbg{position:absolute;inset:-5%}
.kl{display:block;overflow:hidden;white-space:nowrap;line-height:.9;padding:.22em 0 .07em;margin:-.14em 0 -.05em}
.kli{display:inline-block;white-space:nowrap}
.kw{display:inline-block}
.kc{display:inline-block;transform-origin:0 100%}
.ks{display:inline-block;width:.24em}
.m{background:linear-gradient(100deg,#9C7236 0%,#D6B25E 24%,#F0E281 40%,#FFF9DD 48%,#F0E281 56%,#CFA14F 76%,#9C7236 100%);
   background-size:320% 100%;background-position:var(--sw,100%) 50%;-webkit-background-clip:text;background-clip:text;color:transparent}
.kc.m{padding-top:.3em;margin-top:-.3em}   /* el metal tiene que cubrir las tildes de las mayúsculas */
.dim{color:#7C776C}
.glow{filter:drop-shadow(0 0 26px rgba(240,226,129,.32))}
.echo{position:absolute;white-space:nowrap;font-weight:900;line-height:1;letter-spacing:-.05em;text-transform:uppercase;
   color:transparent;-webkit-text-stroke:2px rgba(240,226,129,.13)}
.tr-bars{position:absolute;inset:0;z-index:18;pointer-events:none;display:flex;flex-direction:column}
.tr-bars i{display:block;width:100%;transform:translateX(-110%)}
.tr-ring{position:absolute;left:${W / 2 - 100}px;top:${H / 2 - 100}px;width:200px;height:200px;z-index:18;opacity:0;pointer-events:none}
.vig2{position:absolute;inset:0;pointer-events:none;z-index:15;
   background:radial-gradient(130% 95% at 50% 45%,transparent 50%,rgba(0,0,0,.6) 100%)}
.grain2{position:absolute;inset:0;pointer-events:none;z-index:16;mix-blend-mode:overlay;opacity:.09}
.dust2{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:14;mix-blend-mode:screen}
.pill2{display:inline-flex;align-items:center;gap:14px;padding:22px 36px;border-radius:999px;font-weight:800;font-size:36px;
   color:#12171E;background:linear-gradient(140deg,#F0E281,#C9A24E);box-shadow:0 0 50px rgba(240,226,129,.35)}
`;

const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise"
   baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="240" height="240" filter="url(#n)"/></svg>`)}`;

/* ------------------------------ texto ------------------------------ */

/** "Dos personas | arrancan | *el mismo día.*" → líneas de palabras; *…* = oro. */
function beats(text) {
  return text.split('|').map(b => b.trim()).filter(Boolean).map(b => {
    const words = [];
    let gold = false;
    for (const raw of b.split(/\s+/)) {
      let w = raw;
      if (w.startsWith('*')) { gold = true; w = w.slice(1); }
      const close = /\*[.,!?:;…"”]*$/.test(w);
      w = w.replace(/\*(?=[.,!?:;…"”]*$)/, '');
      words.push({ w, gold });
      if (close) gold = false;
    }
    return words;
  });
}

const letters = (words, dim = false) => words.map(w =>
  `<span class="kw">${[...w.w].map(ch => `<span class="kc${w.gold ? (dim ? ' dim' : ' m') : ''}">${ch}</span>`).join('')}</span>`)
  .join('<span class="ks"></span>');

const kline = (words, { max = 240, min = 56, box = BOX, cls = '', dim = false } = {}) =>
  `<div class="kl ${cls}" data-fitw="${box}" data-max="${max}" data-min="${min}"><span class="kli ${words.some(w => w.gold) && !dim ? 'glow' : ''}">${letters(words, dim)}</span></div>`;

/* JS: revela las letras de una línea con resorte; devuelve el fin */
const revealJs = (sel, at, { instant = false, st = .016, dur = .55, ease = 'springSoft', sweep = true } = {}) => instant ? `
  document.querySelectorAll(${JSON.stringify(sel)}).forEach(k=>tw(k,{yp:[0,0]},${at},0,'linear'));` : `
  (()=>{ const ks=[...document.querySelectorAll(${JSON.stringify(sel)})], st=Math.min(${st},.24/Math.max(1,ks.length));
    ks.forEach((k,j)=>{ tw(k,{yp:[112,0],rot:[8,0]},${at}+j*st,${dur},'${ease}');
      ${sweep ? `if(k.classList.contains('m')) tw(k,{'--sw':[140,-40]},${at}+.28+j*.022,1.1,'inOut');` : ''} }); })();`;

const hideJs = (sel, at) => `
  (()=>{ const ks=[...document.querySelectorAll(${JSON.stringify(sel)})];
    ks.forEach((k,j)=>tw(k,{yp:[0,-160]},${at}+j*.005,.17,'expoIn')); })();`;

/* ----------------------------- personaje ----------------------------- */

/** fig: { pose, tono, keys:[[t,pose,ease?,dur?]], walk:[t0,t1], x:[a,b,t0?,dur?], celular } (tiempos relativos a la escena) */
function figHtml(f, id, { left, top, size }) {
  return `<div class="abs fgw" id="${id}" style="left:${left}px;top:${top}px;width:${size}px;height:${size}px">
    ${rigFigure(id + 'r', { tono: f.tono || 'oro', pose: f.pose || 'parado', celular: !!f.celular })}</div>`;
}
function figJs(f, id, { instant = false, len } = {}) {
  const keys = [{ t: 'T0', pose: f.pose || 'parado' }, ...(f.keys || []).map(([t, p, e, d]) =>
    ({ t: `T0+${t}`, pose: p, ease: e || 'springSoft', dur: d ?? .4 }))];
  const walks = (f.walk ? [f.walk] : []).map(([a, b, c]) => `{t0:T0+${a},t1:T0+${b},cadence:${c ?? 1.15}}`);
  return `
  PD.rig('#${id} svg',{poses:POSES,keys:[${keys.map(k => `{t:${k.t},pose:'${k.pose}'${k.ease ? `,ease:'${k.ease}'` : ''}${k.dur ? `,dur:${k.dur}` : ''}}`).join(',')}],walks:[${walks.join(',')}]});
  ${instant ? '' : `tw('#${id}',{opacity:[0,1]},T0,.25,'out'); tw('#${id}',{y:[60,0]},T0,.6,'springSoft');`}
  ${f.x ? `tw('#${id}',{x:[${f.x[0]},${f.x[1]}]},T0+${f.x[2] ?? 0},${f.x[3] ?? 'B*' + len},'${f.xe || 'linear'}');` : ''}
  ${f.flip ? `tw('#${id} svg',{sx:[-1,-1]},0,0,'linear');` : ''}`;
}

/* ============================== escenas ============================== */

/** Tipografía cinética. mode 'stack' (las líneas se apilan como afiche) o 'swap' (una por vez, gigante). */
function kin(s, c) {
  const bs = beats(s.text);
  const mode = s.mode || 'stack';
  const F = s.figSize ?? 600;
  const hasFig = !!s.fig;
  const top = s.top ?? (hasFig ? 230 + F - 30 : SAFE.t);
  const max = s.max ?? (mode === 'swap' ? 300 : 230);
  const dim = s.tone === 'apagado';
  const lines = bs.map((b, i) => kline(b, { max, cls: `b${i}`, dim })).join('');
  const goldWord = s.echoWord || bs.flat().filter(x => x.gold).at(-1)?.w || bs.at(-1).at(-1).w;
  const html = `
  ${s.echo === false ? '' : `<div class="echo" style="left:-30px;top:${hasFig ? 1300 : 1180}px;font-size:${s.echoSize ?? 440}px">${goldWord.replace(/[.,!?¿¡:;"“”]/g, '')}</div>`}
  ${hasFig ? figHtml(s.fig, `${c.sid}-f`, { left: (W - F) / 2 - 20 + (s.fig.dx || 0), top: 230, size: F }) : ''}
  <div class="abs" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${top}px;bottom:${SAFE.b}px;display:flex;flex-direction:column;
       justify-content:${hasFig || s.valign === 'top' ? 'flex-start' : 'center'}">
    ${s.num ? `<div style="perspective:700px;margin-bottom:34px"><div class="hbig" style="position:relative;width:170px;height:153px;display:grid;place-items:center">
      <svg viewBox="0 0 120 108" style="position:absolute;inset:0;filter:drop-shadow(0 0 30px rgba(240,226,129,.4))"><defs><linearGradient id="hg${c.sid}" x1="0" x2="1">
        <stop offset="0" stop-color="#AF7C38"/><stop offset=".5" stop-color="#EAD77A"/><stop offset="1" stop-color="#DAAE4A"/></linearGradient></defs>
        <path d="${hexPath(60, 54, 57, .22)}" fill="url(#hg${c.sid})"/></svg>
      <span style="position:relative;font-weight:900;font-size:78px;letter-spacing:-.04em;color:#12171E">${String(s.num).padStart(2, '0')}</span></div></div>` : ''}
    ${s.kicker ? `<div class="kicker k2" style="margin-bottom:22px;font-size:28px">${s.kicker}</div>` : ''}
    ${mode === 'stack'
      ? `<div style="font-weight:900;letter-spacing:-.045em;${s.upper === false ? '' : 'text-transform:uppercase;'}">${lines}</div>`
      : `<div style="display:grid;align-items:center;font-weight:900;letter-spacing:-.045em;${s.upper === false ? '' : 'text-transform:uppercase;'}">
           ${bs.map((b, i) => `<div style="grid-area:1/1">${kline(b, { max, cls: `b${i}`, dim })}</div>`).join('')}</div>`}
    ${s.sub ? `<div class="sub2" style="margin-top:30px;font-weight:600;font-size:40px;line-height:1.3;color:rgba(242,242,242,.72);max-width:24ch">${s.sub}</div>` : ''}
  </div>`;
  const n = bs.length;
  const span = s.len * BEAT;
  const rate = s.rate ?? Math.min(.5, Math.max(.2, span * .6 / n));
  const at = i => (c.instant && i === 0 ? 0 : (c.instant ? 0 : .06) + i * rate);
  let js = `
  ${s.num ? `tw(S+' .hbig',{ry:[${c.instant ? 0 : -180},0],scale:[${c.instant ? 1 : .4},1]},T0,.8,'springSoft');` : ''}
  ${s.kicker ? `tw(S+' .k2',{opacity:[${c.instant ? 1 : 0},1],x:[${c.instant ? 0 : -30},0]},T0,.4,'expo');` : ''}
  ${s.echo === false ? '' : `tw(S+' .echo',{x:[80,-220]},T0,${span + .4},'linear'); tw(S+' .echo',{opacity:[0,1]},T0,.5,'out');`}
  ${hasFig ? figJs(s.fig, `${c.sid}-f`, { instant: c.instant, len: s.len }) : ''}`;
  bs.forEach((b, i) => {
    js += revealJs(`#${c.sid} .b${i} .kc`, `T0+${at(i)}`, { instant: c.instant && i === 0 });
    if (mode === 'swap' && i < n - 1) js += hideJs(`#${c.sid} .b${i} .kc`, `T0+${at(i + 1) - .12}`);
  });
  if (s.sub) js += `tw(S+' .sub2',{opacity:[0,1],y:[24,0]},T0+${at(n - 1) + .3},.5,'expo');`;
  const cues = bs.map((b, i) => b.some(x => x.gold)
    ? { t: at(i), type: 'tick', level: .55, freq: 2200 }
    : { t: at(i), type: 'tick', level: .22, freq: 3100 - (i % 3) * 250 });
  bs.forEach((b, i) => { if (b.some(x => x.gold)) cues.push({ t: at(i) + .28, type: 'shimmer', level: .22 }); });
  return { html, js, cues, e: s.e ?? 2 };
}

/** Golpe: fondo oro, la palabra cae desde la cámara y sacude el plano. */
function impact(s, c) {
  const ls = (Array.isArray(s.text) ? s.text : [s.text]).map(t => beats(t)[0]);
  const block = (cls, st = '') => `<div class="${cls}" style="grid-area:1/1;display:flex;flex-direction:column;align-items:center;${st}">
      ${ls.map(b => `<div class="kl" data-fitw="${BOX}" data-max="${s.max ?? 330}" data-min="80" style="text-align:center">
        <span class="kli">${b.map(x => x.w).join(' ')}</span></div>`).join('')}</div>`;
  const hx = hexPath(100, 100, 92, .22);
  const html = `
  <svg class="abs ring2" viewBox="0 0 200 200" style="left:${W / 2 - 100 - 30}px;top:${H / 2 - 190}px;width:200px;height:200px;overflow:visible;opacity:0">
    <path d="${hx}" fill="none" stroke="#12171E" stroke-width="3"/></svg>
  <div class="abs pz" style="left:${SAFE.l}px;right:${SAFE.r}px;top:0;bottom:180px;display:flex;flex-direction:column;
       align-items:center;justify-content:center;text-align:center">
    <div class="slam" style="display:grid;width:100%;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;line-height:.9">
      ${block('rgbA', 'color:#A37B3C;opacity:0')}
      ${block('rgbB', 'color:#FFFBE6;opacity:0')}
      <div class="gl pw" style="grid-area:1/1;position:relative">${block('pt', 'color:#12171E')}</div>
    </div>
    ${s.sub ? `<div class="sub2" style="margin-top:40px;font-weight:900;font-size:72px;letter-spacing:-.03em;text-transform:uppercase;color:#12171E">${s.sub}</div>` : ''}
  </div>`;
  const land = c.instant ? 0 : .12;
  const js = `
  ${c.instant ? '' : `tw(S+' .slam',{scale:[2.6,1]},T0,${land},'expoIn'); tw(S+' .slam',{opacity:[0,1]},T0,.04,'linear');`}
  tw(S+' .rgbA',{x:[-30,0],opacity:[1,0]},T0+${land},.4,'expo');
  tw(S+' .rgbB',{x:[30,0],opacity:[1,0]},T0+${land},.4,'expo');
  PD.shake('${c.cam}',T0+${land},.5,30,${c.i + 3},1.4);
  glitch(S+' .pw',T0+${land}+.03,.2,44,${c.i * 7 + 5});
  tw(S+' .ring2',{scale:[.3,5.5],opacity:[.85,0]},T0+${land},.7,'expo');
  tw(S+' .pz',{scale:[1,1.08]},T0+${land},${s.len * BEAT},'linear');
  ${s.sub ? `tw(S+' .sub2',{opacity:[0,1],y:[30,0]},T0+${land}+.3,.5,'springSoft');` : ''}`;
  return {
    html, js, bg: 'gold', e: s.e ?? 3,
    cues: [{ t: 0, type: 'swish', level: .5 }, { t: land, type: 'hit', level: .75 }, { t: land, type: 'sub', level: .9 },
      { t: land + .03, type: 'glitch', len: .2, level: .45, seed: c.i + 2 }],
  };
}

/** Pantalla partida: el mismo punto de partida, dos caminos. */
function split(s, c) {
  const PW = (BOX - 26) / 2, PH = s.ph ?? 840, top = s.title ? 640 : 330;
  const title = s.title ? beats(s.title) : [];
  const panel = (x, k, oro) => `
    <div class="abs pnl ${k}" style="left:${k === 'pa' ? 0 : PW + 26}px;top:${top - SAFE.t}px;width:${PW}px;height:${PH}px;border-radius:30px;overflow:hidden;
      background:${oro ? 'radial-gradient(90% 60% at 50% 30%,rgba(240,226,129,.20),rgba(163,123,60,.06) 60%,transparent),linear-gradient(180deg,#17140d,#0f0e0b)'
        : 'linear-gradient(180deg,#161616,#101010)'};
      border:1.5px solid ${oro ? 'rgba(240,226,129,.5)' : 'rgba(242,242,242,.10)'};${oro ? 'box-shadow:0 0 70px rgba(240,226,129,.16)' : ''}">
      ${figHtml(x, `${c.sid}-${k}`, { left: (PW - 440) / 2, top: 40, size: 440 })}
      <div style="position:absolute;left:30px;right:30px;bottom:44px">
        <div class="kicker" style="font-size:24px;${oro ? '' : 'color:rgba(242,242,242,.45)'}">${x.label}</div>
        <div style="margin-top:12px;font-weight:800;font-size:46px;line-height:1.08;letter-spacing:-.02em;${oro ? 'color:#F2F2F2' : 'color:rgba(242,242,242,.55)'}">${x.text}</div>
      </div>
      ${oro ? '<div class="swp" style="position:absolute;inset:-20% -60%;background:linear-gradient(100deg,transparent 40%,rgba(255,249,221,.22) 50%,transparent 60%);transform:translateX(-80%)"></div>' : ''}
    </div>`;
  const html = `
  <div class="abs" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${SAFE.t}px;height:${top - SAFE.t - 20}px;display:flex;flex-direction:column;justify-content:flex-end;
       font-weight:900;letter-spacing:-.045em;text-transform:uppercase">${title.map((b, i) => kline(b, { max: 150, cls: `b${i}` })).join('')}</div>
  <div class="abs" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${SAFE.t}px;bottom:0;perspective:1600px">
    ${panel(s.a, 'pa', false)}${panel(s.b, 'pb', true)}
  </div>`;
  const bAt = s.bAt ?? 1.2;
  let js = title.map((b, i) => revealJs(`#${c.sid} .b${i} .kc`, `T0+${c.instant ? 0 : i * .14}`, { instant: c.instant && i === 0 })).join('');
  js += `
  tw(S+' .pa',{y:[${c.instant ? 0 : -80},0],ry:[${c.instant ? 0 : 18},0]},T0+.08,.7,'springSoft'); tw(S+' .pa',{opacity:[${c.instant ? 1 : 0},1]},T0+.08,.2,'out');
  tw(S+' .pb',{y:[140,0],ry:[-22,0]},T0+${bAt},.75,'springSoft'); tw(S+' .pb',{opacity:[0,1]},T0+${bAt},.2,'out');
  tw(S+' .pa',{bright:[1,.5]},T0+${bAt},.5,'out');
  tw(S+' .swp',{xp:[-80,90]},T0+${bAt}+.3,.9,'inOut');
  ${figJs(s.a, `${c.sid}-pa`, { instant: true, len: s.len })}
  ${figJs(s.b, `${c.sid}-pb`, { instant: true, len: s.len })}`;
  return { html, js, e: s.e ?? 2,
    cues: [{ t: .08, type: 'swish', level: .3 }, { t: bAt, type: 'whip', level: .4 }, { t: bAt + .1, type: 'hit', level: .35 },
      { t: bAt + .35, type: 'shimmer', level: .3 }] };
}

/** Contador de días: los números ruedan como un odómetro y el tiempo avanza en una barra. */
function odo(s, c) {
  const [a, b] = Array.isArray(s.day) ? s.day : [s.day, s.day];
  const max = s.max ?? 60;
  const fs = s.size ?? (String(b).length > 2 ? 250 : 330), rh = Math.round(fs * .8);
  const dim = s.tone === 'apagado';
  const rows = [];
  for (let d = a; d <= b; d++) rows.push(`<div class="${dim ? 'dim' : 'm'}" style="height:${rh}px;line-height:${rh}px">${String(d).padStart(2, '0')}</div>`);
  const cap = beats(s.text);
  const F = s.figSize ?? 520;
  const left = s.side === 'left';                   // personaje a la izquierda, número a la derecha
  const html = `
  <div class="abs" style="${left ? `right:${SAFE.r}px;flex-direction:row-reverse` : `left:${SAFE.l}px`};top:${SAFE.t + 10}px;display:flex;align-items:flex-end;gap:18px">
    <div class="kicker dk" style="font-size:34px;margin-bottom:${rh * .12}px;${dim ? 'color:#7C776C' : ''}">Día</div>
    <div class="odo ${dim ? '' : 'glow'}" style="height:${rh}px;overflow:hidden;font-weight:900;font-size:${fs}px;letter-spacing:-.06em;font-variant-numeric:tabular-nums">
      <div class="strip">${rows.join('')}</div></div>
  </div>
  ${s.fig ? figHtml(s.fig, `${c.sid}-f`, { left: left ? SAFE.l - 110 : W - SAFE.r - F + 110, top: SAFE.t - 40, size: F }) : ''}
  <div class="abs" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${SAFE.t + rh + 190}px;font-weight:900;letter-spacing:-.04em;${s.upper === false ? '' : 'text-transform:uppercase'}">
    ${cap.map((l, i) => kline(l, { max: s.capMax ?? 140, cls: `b${i}`, dim })).join('')}
  </div>
  <div class="abs trk" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${H - SAFE.b - 60}px;height:10px">
    <div style="position:absolute;inset:0;border-radius:6px;background:rgba(242,242,242,.10)"></div>
    <div class="fill" style="position:absolute;inset:0;border-radius:6px;background:${dim ? '#57544D' : 'linear-gradient(90deg,#A37B3C,#F0E281)'};transform-origin:0 50%;
         ${dim ? '' : 'box-shadow:0 0 18px rgba(240,226,129,.5)'}"></div>
    ${Array.from({ length: max / 5 + 1 }, (_, k) => `<i style="position:absolute;left:${k * 5 / max * 100}%;top:-14px;width:2px;height:${k % 2 ? 10 : 18}px;
       background:rgba(242,242,242,${k % 2 ? .18 : .32})"></i>`).join('')}
    <div class="mk" style="position:absolute;left:0;top:-22px;width:0;height:0">
      <svg viewBox="0 0 60 54" style="position:absolute;left:-26px;top:0;width:52px;height:47px"><path d="${hexPath(30, 27, 27, .25)}" fill="${dim ? '#7C776C' : '#F0E281'}"/></svg></div>
    <div style="position:absolute;right:0;top:30px;font-weight:700;font-size:24px;letter-spacing:.2em;color:rgba(242,242,242,.4)">DÍA ${max}</div>
  </div>`;
  const roll = s.roll ?? (a === b ? 0 : Math.min(1.1, .35 + (b - a) * .03));
  const f0 = a / max, f1 = b / max;
  const js = `
  ${c.instant ? '' : `tw(S+' .odo',{scale:[1.3,1]},T0,.5,'springSoft'); tw(S+' .odo',{opacity:[0,1]},T0,.12,'out');`}
  document.querySelector(S+' .odo').style.transformOrigin='${left ? '100%' : '0'} 100%';
  tw(S+' .strip',{y:[0,${-(b - a) * rh}]},T0+.05,${roll || .01},'expoInOut');
  tw(S+' .dk',{opacity:[${c.instant ? 1 : 0},1]},T0,.3,'out');
  tw(S+' .fill',{sx:[${f0},${f1}]},T0+.05,${roll || .3},'expoInOut');
  tw(S+' .mk',{x:[${f0 * BOX},${f1 * BOX}]},T0+.05,${roll || .3},'expoInOut');
  ${cap.map((l, i) => revealJs(`#${c.sid} .b${i} .kc`, `T0+${(c.instant ? 0 : .1) + Math.min(roll * .25, .2) + i * .12}`)).join('')}
  ${s.fig ? figJs(s.fig, `${c.sid}-f`, { instant: c.instant, len: s.len }) : ''}`;
  const cues = [{ t: 0, type: 'tick', level: .6, freq: 1700 }];
  const nt = Math.min(14, b - a);
  for (let k = 0; k < nt; k++) cues.push({ t: .05 + roll * (.1 + .8 * Math.pow(k / Math.max(1, nt), 1.6)), type: 'tick', level: .28, freq: 2400 + k * 70 });
  if (a !== b) cues.push({ t: .05 + roll, type: 'hit', level: .3 });
  return { html, js, cues, e: s.e ?? 2 };
}

/** Chat en un celular en 3D: escribe, aparece la burbuja con resorte. */
function chat(s, c) {
  const PW = 700, PH = 1160, every = s.every ?? 1.2;
  const html = `
  <div class="abs" style="left:${(W - PW) / 2 - 30}px;top:${SAFE.t - 10}px;width:${PW}px;height:${PH}px;perspective:1900px">
    <div class="ph" style="position:absolute;inset:0;border-radius:86px;padding:16px;background:linear-gradient(150deg,#2a261c,#0c0c0c 40%,#16130c);
         box-shadow:0 60px 120px rgba(0,0,0,.6),0 0 0 2px rgba(240,226,129,.35),0 0 80px rgba(240,226,129,.12)">
      <div style="position:relative;width:100%;height:100%;border-radius:72px;overflow:hidden;
           background:radial-gradient(90% 50% at 70% 0%,rgba(240,226,129,.10),transparent 60%),linear-gradient(180deg,#15130e,#0c0c0c)">
        <div style="position:absolute;left:50%;top:22px;width:190px;height:52px;margin-left:-95px;border-radius:30px;background:#000"></div>
        <div style="position:absolute;left:0;right:0;top:92px;padding:0 44px 26px;display:flex;align-items:center;gap:20px;border-bottom:1px solid rgba(242,242,242,.08)">
          <svg viewBox="0 0 60 54" style="width:74px;height:66px"><path d="${hexPath(30, 27, 27, .25)}" fill="url(#ph${c.sid})"/>
            <defs><linearGradient id="ph${c.sid}" x1="0" x2="1"><stop offset="0" stop-color="#A37B3C"/><stop offset="1" stop-color="#F0E281"/></linearGradient></defs></svg>
          <div><div style="font-weight:800;font-size:38px">${s.header || 'Chat'}</div>
            <div style="font-size:26px;color:rgba(242,242,242,.45);margin-top:4px">${s.status || 'en línea'}</div></div>
        </div>
        <div class="vis" style="position:absolute;left:0;right:0;top:214px;bottom:30px;overflow:hidden">
        <div class="msgs" style="position:absolute;left:34px;right:34px;top:16px;display:flex;flex-direction:column;gap:22px">
          ${s.lines.map((ln, i) => `
          <div class="slot" style="position:relative;align-self:${ln.a === 'vos' ? 'flex-end' : 'flex-start'};max-width:84%">
            <div class="bb b${i}" style="padding:24px 32px;border-radius:${ln.a === 'vos' ? '36px 36px 10px 36px' : '36px 36px 36px 10px'};
              font-weight:700;font-size:40px;line-height:1.2;opacity:0;transform-origin:${ln.a === 'vos' ? '100% 100%' : '0 100%'};
              ${ln.a === 'vos' ? 'background:linear-gradient(140deg,#F0E281,#C9A24E);color:#12171E;font-weight:800' : 'background:rgba(242,242,242,.10);border:1.5px solid rgba(242,242,242,.12);color:#F2F2F2'}">${ln.t}</div>
            <div class="ty t${i}" style="position:absolute;${ln.a === 'vos' ? 'right' : 'left'}:0;top:0;padding:26px 30px;border-radius:30px;opacity:0;display:flex;gap:10px;
              background:${ln.a === 'vos' ? 'rgba(240,226,129,.25)' : 'rgba(242,242,242,.10)'}">
              ${[0, 1, 2].map(d => `<i class="d${d}" style="width:14px;height:14px;border-radius:50%;background:rgba(242,242,242,.7);display:block"></i>`).join('')}</div>
          </div>`).join('')}
        </div></div>
        <div class="glr" style="position:absolute;inset:-30%;background:linear-gradient(115deg,transparent 42%,rgba(255,249,221,.07) 50%,transparent 58%)"></div>
      </div>
    </div>
  </div>`;
  const t0 = c.instant ? 0 : .35;
  let js = `
  tw(S+' .ph',{ry:[-24,-8],rx:[10,4],rot:[2,.5]},T0,${s.len * BEAT + .3},'out');
  ${c.instant ? '' : `tw(S+' .ph',{y:[260,0]},T0,.8,'springSoft'); tw(S+' .ph',{opacity:[0,1]},T0,.2,'out');`}
  tw(S+' .glr',{xp:[-30,30]},T0,${s.len * BEAT},'linear');`;
  const cues = [];
  s.lines.forEach((ln, i) => {
    const typ = i === 0 && c.instant ? 0 : .38;
    const at = t0 + i * every;
    if (typ) {
      js += `tw(S+' .t${i}',{opacity:[0,1],scale:[.6,1]},T0+${at},.2,'springSoft'); tw(S+' .t${i}',{opacity:[1,0]},T0+${at + typ},.06,'linear');
      [0,1,2].forEach(d=>{ for(let q=0;q<3;q++) tw(S+' .t${i} .d'+d,{y:[0,-10]},T0+${at}+q*.13+d*.05,.065,'sine'),tw(S+' .t${i} .d'+d,{y:[-10,0]},T0+${at}+q*.13+d*.05+.065,.065,'sine'); });`;
      cues.push({ t: at, type: 'tick', level: .12, freq: 3400 });
    }
    js += `tw(S+' .b${i}',{opacity:[0,1]},T0+${at + typ},.05,'linear'); tw(S+' .b${i}',{scale:[.3,1]},T0+${at + typ},.5,'springHard');`;
    cues.push({ t: at + typ, type: 'pop', level: .5, freq: ln.a === 'vos' ? 900 : 620 });
  });
  // si los mensajes no entran, la conversación sube como en un chat real
  js += `
  PD.ready(()=>{ const box=document.querySelector(S+' .msgs'), vis=document.querySelector(S+' .vis').clientHeight-20;
    let prev=0; [...box.children].forEach((sl,i)=>{ const need=Math.max(0, sl.offsetTop+sl.offsetHeight+16-vis);
      if(need>prev){ tw(box,{y:[-prev,-need]},T0+${t0}+i*${every}+${c.instant ? 0 : .38},.5,'springSoft'); prev=need; } }); });`;
  return { html, js, cues, e: s.e ?? 1 };
}

/** Escenario: el personaje en un piso hexagonal en perspectiva, con un haz de luz. */
function stage(s, c) {
  const figs = s.figs || [s.fig];
  const F = s.figSize ?? 700;
  const cap = s.text ? beats(s.text) : [];
  const hexTile = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="156" height="90">
    <path d="M0 45 L26 0 H78 L104 45 L78 90 H26 Z M104 45 H156" fill="none" stroke="rgba(240,226,129,.55)" stroke-width="2"/></svg>`)}`;
  const html = `
  <div class="abs" style="left:-600px;right:-600px;top:${H * .6}px;height:${H * .5}px;perspective:700px;perspective-origin:50% 0%">
    <div class="flr" data-unit="px" style="position:absolute;left:0;right:0;top:0;height:2400px;transform-origin:50% 0;transform:rotateX(74deg);
      background-image:url('${hexTile}');background-size:156px 90px;background-position:0 var(--fy,0px);
      -webkit-mask-image:radial-gradient(40% 40% at 50% 12%,#000 20%,transparent 75%);mask-image:radial-gradient(40% 40% at 50% 12%,#000 20%,transparent 75%);opacity:.5"></div>
  </div>
  <div class="abs beam" style="left:${W / 2 - 420}px;top:-200px;width:840px;height:${H * .95}px;
       background:linear-gradient(180deg,rgba(255,246,207,.20),rgba(240,226,129,.06) 70%,transparent);clip-path:polygon(38% 0,62% 0,100% 100%,0 100%);filter:blur(18px)"></div>
  ${figs.map((f, k) => figHtml(f, `${c.sid}-f${k}`, { left: (W - F) / 2 + (f.dx || 0), top: H * .6 - F * .9, size: F })).join('')}
  <div class="abs" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${SAFE.t}px;font-weight:900;letter-spacing:-.045em;${s.upper === false ? '' : 'text-transform:uppercase'}">
    ${s.kicker ? `<div class="kicker k2" style="margin-bottom:18px;font-size:28px">${s.kicker}</div>` : ''}
    ${cap.map((l, i) => kline(l, { max: s.max ?? 150, cls: `b${i}` })).join('')}
  </div>`;
  const rate = s.rate ?? .22;
  let js = `
  ${s.scroll ? `tw(S+' .flr',{'--fy':[0,${s.scroll}]},T0,${s.len * BEAT + .4},'linear');` : ''}
  tw(S+' .beam',{opacity:[.75,1]},T0,${s.len * BEAT},'sine');
  ${s.kicker ? `tw(S+' .k2',{opacity:[${c.instant ? 1 : 0},1]},T0,.3,'out');` : ''}
  ${figs.map((f, k) => figJs(f, `${c.sid}-f${k}`, { instant: c.instant, len: s.len })).join('')}`;
  cap.forEach((l, i) => { js += revealJs(`#${c.sid} .b${i} .kc`, `T0+${(c.instant ? 0 : .1) + i * rate}`, { instant: c.instant && i === 0 }); });
  return { html, js, e: s.e ?? 2, cues: cap.map((l, i) => ({ t: .1 + i * rate, type: 'tick', level: .25, freq: 2800 })) };
}

/** Lista: tarjetas que entran con sesgo y un número hexagonal que gira. */
function listx(s, c) {
  const title = beats(s.title);
  const every = s.every ?? .5;
  const html = `
  <div class="abs" style="left:${SAFE.l}px;right:${SAFE.r}px;top:${SAFE.t}px;bottom:${SAFE.b}px;display:flex;flex-direction:column;justify-content:center">
    <div style="font-weight:900;letter-spacing:-.045em;text-transform:uppercase">${title.map((b, i) => kline(b, { max: 200, cls: `b${i}` })).join('')}</div>
    <div style="margin-top:50px;display:flex;flex-direction:column;gap:26px">
      ${s.items.map((it, i) => `
      <div class="cd c${i}" style="display:flex;align-items:center;gap:28px;padding:26px 30px;border-radius:26px;
           background:linear-gradient(90deg,rgba(240,226,129,.12),rgba(242,242,242,.03));border:1.5px solid rgba(240,226,129,.22)">
        <div style="perspective:600px;flex:0 0 auto"><div class="hb" style="position:relative;width:96px;height:86px;display:grid;place-items:center">
          <svg viewBox="0 0 120 108" style="position:absolute;inset:0"><path d="${hexPath(60, 54, 56, .22)}" fill="#F0E281"/></svg>
          <span style="position:relative;font-weight:900;font-size:46px;color:#12171E">${i + 1}</span></div></div>
        <div style="font-weight:800;font-size:${s.items.length > 3 ? 48 : 54}px;line-height:1.1;letter-spacing:-.02em">${it}</div>
      </div>`).join('')}
    </div>
  </div>`;
  let js = title.map((b, i) => revealJs(`#${c.sid} .b${i} .kc`, `T0+${c.instant ? 0 : i * .12}`, { instant: c.instant && i === 0 })).join('');
  s.items.forEach((_, i) => {
    const at = .45 + i * every;
    js += `tw(S+' .c${i}',{x:[420,0],skx:[-16,0]},T0+${at},.65,'springSoft'); tw(S+' .c${i}',{opacity:[0,1]},T0+${at},.15,'out');
    tw(S+' .c${i} .hb',{ry:[180,0]},T0+${at}+.1,.7,'springSoft');`;
  });
  return { html, js, e: s.e ?? 2, cues: s.items.map((_, i) => ({ t: .45 + i * every, type: 'swish', level: .28 })) };
}

/** Cierre de marca: el revelado oficial del logo, dentro de la pieza. */
function logo2(s, c) {
  const spec = logoReveal({ id: c.sid + 'L', w: W, h: H, bh: 150, dur: s.len * BEAT, fadeOut: false, embedded: true, tag: s.tag !== false });
  const js = `(function(){
    const tw=(a,b,s,d,e)=>PD.tw(a,b,s+T0,d,e);
    const glitch=(a,s,d,m,z)=>PD.glitch(a,s+T0,d,m,z);
    const lines=(a,s,st,d)=>PD.lines(a,s+T0,st,d);
    ${spec.timeline}
  })();`;
  return { html: spec.body, js, cues: LOGO_CUES, e: 0, musicEnd: true, noLogo: true };
}

export const SCENES2 = { kin, impact, split, odo, chat, stage, listx, logo: logo2 };

/* ============================ transiciones ============================ */
/* Cada una devuelve { pre, post, js, cues }: `pre` = cuánto antes del corte
   aparece el plano que entra; `post` = cuánto después sigue el que sale. */
const TRANS = {
  cut: ({ id }) => ({ pre: 0, post: 0, js: `tw('#${id}-flash',{opacity:[.5,0]},T0,.3,'out');`, cues: [] }),

  whip: ({ O, I, dir = 1 }) => ({
    pre: .14, post: .2,
    js: `tw('${O} > .cam',{x:[0,${-dir * 1180}]},T0-.14,.34,'expoInOut'); tw('${I} > .cam',{x:[${dir * 1180},0]},T0-.14,.34,'expoInOut');`,
    cues: [{ t: -.2, type: 'whip', level: .5 }],
  }),

  zoom: ({ O, I, id }) => ({
    pre: 0, post: .02,
    js: `tw('${O} > .cam',{scale:[1,2.8]},T0-.16,.18,'expoIn'); tw('${O} > .cam',{bright:[1,2.2]},T0-.16,.18,'in');
         tw('${I} .ent',{scale:[.58,1]},T0,.5,'expo'); tw('${I} .ent',{blur:[16,0]},T0,.3,'out');
         tw('#${id}-flash',{opacity:[.55,0]},T0,.35,'out');`,
    cues: [{ t: -.35, type: 'whoosh', len: .4, level: .45 }, { t: 0, type: 'tick', level: .5, freq: 1600 }],
  }),

  hex: ({ O, I, id }) => ({
    pre: 0, post: .55,
    js: `tw('${I}',{hex:[0,1]},T0,.55,'expo'); tw('${O} > .cam',{scale:[1,1.14],bright:[1,.45]},T0,.55,'out');
         tw('#${id}-ring',{scale:[0,12.8]},T0,.55,'expo'); tw('#${id}-ring',{opacity:[1,0]},T0+.2,.35,'out');`,
    cues: [{ t: -.05, type: 'whoosh', len: .45, level: .35 }, { t: 0, type: 'shimmer', level: .4 }],
  }),

  bars: ({ id }) => ({
    pre: 0, post: 0,
    js: `[...document.querySelectorAll('#${id}-bars i')].forEach((b,i)=>{
           tw(b,{xp:[-112,0]},T0-.24+i*.012,.24-i*.012,'expoIn'); tw(b,{xp:[0,112]},T0+i*.014,.3,'expo'); });`,
    cues: [{ t: -.24, type: 'swish', level: .45 }, { t: .02, type: 'swish', level: .35 }],
  }),

  push: ({ O, I }) => ({
    pre: .12, post: .22,
    js: `tw('${O} > .cam',{y:[0,${-H}]},T0-.12,.34,'expoInOut'); tw('${I} > .cam',{y:[${H},0]},T0-.12,.34,'expoInOut');`,
    cues: [{ t: -.18, type: 'whip', level: .45 }],
  }),

  glitch: ({ id, i }) => ({
    pre: 0, post: 0,
    js: `PD.tear('#${id}-tear',T0-.05,.22,${i * 7 + 1}); tw('#${id}-flash',{opacity:[.6,0]},T0,.3,'out');`,
    cues: [{ t: -.05, type: 'glitch', len: .22, seed: i, level: .6 }],
  }),
};

function autoTr(scenes, i, n) {
  const s = scenes[i], prev = scenes[i - 1];
  if (s.t === 'impact') return 'cut';
  if (s.t === 'logo') return 'hex';
  if (prev.t === 'impact') return ['zoom', 'glitch'][n % 2];
  return ['whip', 'bars', 'zoom', 'push', 'hex'][n % 5];
}

/* ============================ compositor ============================ */

export function compose2({ id, w = W, h = H, scenes, gx, mb = 5 }) {
  const html = [], js = [], cues = [], sections = [], shots = [], bgs = [];
  let musicEnd = null, T = 0, auto = 0;
  const times = scenes.map(s => { const a = T; T += s.len * BEAT; return [+a.toFixed(3), +T.toFixed(3)]; });
  const trs = scenes.map((s, i) => {
    if (!i) return null;
    const type = s.tr || autoTr(scenes, i, auto++);
    return TRANS[type]({ O: `#${id}-s${i - 1}`, I: `#${id}-s${i}`, id, i, dir: i % 2 ? 1 : -1 });
  });
  const cam = `#${id}-cam`;
  const noLogo = [];
  scenes.forEach((s, i) => {
    const sid = `${id}-s${i}`;
    const [T0, T1] = times[i];
    const r = SCENES2[s.t](s, { sid, len: s.len, instant: i === 0, cam, i });
    const bg = r.bg === 'gold' ? GOLD_BG : darkBg(s.light || LIGHTS[i % LIGHTS.length]);
    // toma generada (Higgsfield u otra): entra de fondo, oscurecida para que el texto se lea
    const clip = s.bg && r.bg !== 'gold' ? (bgs.push({ id: sid, src: s.bg, t0: T0 - (trs[i]?.pre ?? 0), dur: s.len * BEAT + .6 }), `
      <img class="bgseq" data-id="${sid}" data-t0="${+(T0 - (trs[i]?.pre ?? 0)).toFixed(3)}" alt="" style="position:absolute;inset:-5%;width:110%;height:110%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,11,.62),rgba(11,11,11,.35) 40%,rgba(11,11,11,.82))"></div>`) : '';
    html.push(`<div class="scene sc2" id="${sid}"><div class="cam"><div class="sbg" style="${bg}"></div>${clip}
      <div class="ent"><div class="drift">${r.html}</div></div></div></div>`);
    const pre = trs[i]?.pre ?? 0, post = trs[i + 1]?.post ?? 0;
    const last = i === scenes.length - 1;
    const dx = i % 2 ? 14 : -14;
    js.push(`{ const S='#${sid}', T0=${T0}, T1=${T1}, B=${BEAT};
      tw(S,{opacity:[0,1]},${+(T0 - pre).toFixed(3)},0,'linear'); ${last ? '' : `tw(S,{opacity:[1,0]},${+(T1 + post).toFixed(3)},0,'linear');`}
      tw(S+' .drift',{scale:[1,${s.push ?? 1.05}],x:[${dx},${-dx}]},T0,${+(T1 - T0 + post).toFixed(3)},'linear');
      tw(S+' .sbg',{x:[${-dx * 2},${dx * 2}]},${+(T0 - pre).toFixed(3)},${+(T1 - T0 + pre + post).toFixed(3)},'linear');
      ${r.js}
    }`);
    if (trs[i]) {
      js.push(`{ const T0=${T0}; ${trs[i].js} }`);
      trs[i].cues.forEach(q => cues.push({ ...q, t: Math.max(0, +(q.t + T0).toFixed(3)) }));
    }
    if (s.shot) shots.push({ escena: i + 1, tipo: s.t, t0: T0, dur: +(s.len * BEAT).toFixed(2), toma: s.shot, camara: s.cam || '' });
    r.cues.forEach(q => cues.push({ ...q, t: +(q.t + T0).toFixed(3) }));
    sections.push({ t0: T0, t1: T1, e: r.e });
    if (r.musicEnd) musicEnd = T0;
    if (r.bg === 'gold' || r.noLogo) noLogo.push([T0, T1]);
  });
  for (let i = 1; i < sections.length; i++) {           // subida antes del primer salto de energía
    if (sections[i - 1].e <= 1 && sections[i].e >= 2) {
      cues.push({ t: Math.max(0, sections[i].t0 - 2), type: 'riser', len: 2, level: .6 });
      break;
    }
  }
  const dur = +T.toFixed(3);
  const barsH = [140, 90, 260, 60, 180, 120, 300, 70, 220, 160, 110, 260];
  const tot = barsH.reduce((a, b) => a + b, 0);
  const body = `
  <div id="${id}-cam" style="position:absolute;inset:0">${html.join('\n')}</div>
  <canvas class="dust2" id="${id}-dust"></canvas>
  <div class="vig2"></div>
  <div class="grain grain2" style="background-image:url('${GRAIN}')"></div>
  <div class="flash" id="${id}-flash"></div>
  <div class="tear" id="${id}-tear">${'<i></i>'.repeat(16)}</div>
  <svg class="tr-ring" id="${id}-ring" viewBox="0 0 200 200" style="overflow:visible"><path d="${hexPath(100, 100, 100, .2)}" fill="none"
    stroke="#F0E281" stroke-width="1.4" style="filter:drop-shadow(0 0 6px rgba(240,226,129,.8))"/></svg>
  <div class="tr-bars" id="${id}-bars">${barsH.map((b, k) => `<i style="height:${(b / tot * 100).toFixed(3)}%;background:${k % 3 === 1
    ? '#12171E' : 'linear-gradient(90deg,#A37B3C,#F0E281 45%,#FFF6CF 55%,#E3C46B 70%,#A37B3C)'}"></i>`).join('')}</div>
  <img id="${id}-pl" class="abs" src="../../brand/logo/lockup-oscuro.png" style="left:90px;top:190px;height:58px;z-index:17">`;
  const timeline = `
  const POSES=${JSON.stringify(POSES)};
  PD.setupDust(document.getElementById('${id}-dust'),{n:60,seed:5,rise:30});
  tw('#${id}-pl',{opacity:[0,1]},.1,.5,'out');
  ${noLogo.map(([a, b]) => `tw('#${id}-pl',{opacity:[1,0]},${a},.08,'linear'); tw('#${id}-pl',{opacity:[0,1]},${b},.25,'out');`).join('\n')}
  ${musicEnd != null ? `tw('#${id}-pl',{opacity:[1,0]},${musicEnd},.1,'linear');` : ''}
  ${js.join('\n')}`;
  return {
    video: { id, w, h, dur, body, timeline, css: CSS2, dust: false, mb, bloom: .3, shots, bgs,
      poster: Math.max(.5, times[0][1] - .2) },
    audio: { dur, bpm: BPM, sections, cues: cues.sort((a, b) => a.t - b.t), musicEnd, musicLevel: .5 },
  };
}
