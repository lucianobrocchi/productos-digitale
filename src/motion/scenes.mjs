/* ------------------------------------------------------------------
   Escenas para Reels y piezas largas.

   Cada escena devuelve { html, js, cues } a partir de su instante de
   inicio. El compositor las encadena sobre una grilla de pulsos a 120 BPM
   (un pulso = 0,5 s): los cortes caen en el tiempo fuerte y la música,
   que se genera con las mismas marcas, calza sin ajustes.

   Zonas seguras 9:16: la interfaz de Reels/TikTok tapa ~14% arriba,
   ~22% abajo y ~120 px a la derecha. El contenido vive dentro de eso.
   ------------------------------------------------------------------ */
import { library, iconYes, iconNo, hexPath } from '../illus.mjs';
import { logoReveal, LOGO_CUES } from './specs/logo.mjs';

export const BPM = 120;
export const BEAT = 60 / BPM;

const safe = (w, h) => h > w
  ? { V: true, l: 90, r: 150, t: 300, b: 460 }
  : { V: false, l: 150, r: 150, t: 140, b: 140 };

/** Titular en líneas con máscara. `gold` = índices en dorado (con glitch si se pide). */
function headline(lines, { gold = [], glitchGold = false, cls = '' } = {}) {
  return lines.map((ln, i) => {
    const g = gold.includes(i);
    const inner = g
      ? (glitchGold
        ? `<span class="gl" style="display:inline-block;position:relative"><span class="gold">${ln}</span></span>`
        : `<span class="gold">${ln}</span>`)
      : ln;
    return `<div class="mask"><span class="line ${cls}">${inner}</span></div>`;
  }).join('');
}

const hexBadge = (label, size = 120, id = '') => `
  <div class="hexnum" ${id ? `id="${id}"` : ''} style="width:${size}px;height:${size * .9}px;font-size:${size * .5}px">
    <svg viewBox="0 0 120 108"><defs><linearGradient id="hb${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#AF7C38"/><stop offset=".5" stop-color="#EAD77A"/><stop offset="1" stop-color="#DAAE4A"/>
    </linearGradient></defs><path d="${hexPath(60, 54, 58, .2)}" fill="url(#hb${id})"/></svg>
    <span>${label}</span></div>`;

/* ============================== escenas ============================== */

/** Gancho: tipografía gigante, una línea por pulso, la dorada con glitch. */
function hook(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const gold = s.gold ?? [s.lines.length - 1];
  const size = s.size ?? (V ? 150 : 132);
  const html = `
  <div class="abs" style="left:${l}px;right:${V ? r : c.w * .3}px;top:0;bottom:${V ? 180 : 0}px;
       display:flex;flex-direction:column;justify-content:center">
    ${s.kicker ? `<div class="kicker k" style="margin-bottom:34px">${s.kicker}</div>` : ''}
    <div class="quote" data-fit style="font-size:${size}px;line-height:.98;text-transform:uppercase;font-weight:900;
         letter-spacing:-.03em">${headline(s.lines, { gold, glitchGold: s.glitch !== false })}</div>
    ${s.rule !== false ? '<div class="rule" style="width:46%;margin-top:40px"></div>' : ''}
  </div>`;
  const every = s.every ?? 1;
  const js = `
  ${s.kicker ? `tw(S+' .k',{opacity:[0,1],x:[-30,0]},T0,.5,'expo');` : ''}
  [...document.querySelectorAll(S+' .line')].forEach((ln,i)=>{
    tw(ln,{yp:[115,0],opacity:[0,1],blur:[12,0]},T0+${s.kicker ? .15 : 0}+i*B*${every},.55,'expo');
  });
  tw(S+' .rule',{sx:[0,1]},T0+${s.lines.length * every}*B-.1,.6,'expo');
  document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  ${s.glitch !== false ? gold.map(i => `glitch(document.querySelectorAll(S+' .gl')[${gold.indexOf(i)}],T0+${i * every}*B+.08,.34,34,${i + 3});`).join('') : ''}
  tw(S+' .quote',{scale:[1,1.035]},T0,${c.len}*B,'linear');`;
  const cues = s.lines.map((_, i) => gold.includes(i)
    ? { t: i * every * BEAT, type: 'hit', level: .55 }
    : { t: i * every * BEAT, type: 'tick', level: .9, freq: 1800 });
  if (s.glitch !== false) gold.forEach(i => cues.push({ t: i * every * BEAT + .08, type: 'glitch', seed: i + 2 }));
  return { html, js, cues, e: s.e ?? 1 };
}

/** Afirmación con ilustración que se dibuja. */
function statement(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const A = V ? 560 : 640;
  const art = library[s.art](`${c.sid}-a`);
  const html = V ? `
  <div class="abs art" style="left:${(c.w - r + l) / 2 - A / 2}px;top:300px;width:${A}px;height:${A}px">${art}</div>
  <div class="abs" style="left:${l}px;right:${r}px;top:${300 + A + 50}px">
    <div class="quote" data-fit style="font-size:${s.size ?? 84}px;line-height:1.02">${headline(s.lines, { gold: s.gold ?? [] })}</div>
    <div class="rule rule--short" style="margin-top:32px"></div>
    ${s.sub ? `<p class="lede sub" style="margin-top:28px;font-size:36px;max-width:30ch">${s.sub}</p>` : ''}
  </div>` : `
  <div class="abs art" style="right:${r}px;top:${(c.h - A) / 2}px;width:${A}px;height:${A}px">${art}</div>
  <div class="abs" style="left:${l}px;width:${c.w - l - r - A - 80}px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
    <div class="quote" data-fit style="font-size:${s.size ?? 92}px;line-height:1.02">${headline(s.lines, { gold: s.gold ?? [] })}</div>
    <div class="rule rule--short" style="margin-top:32px"></div>
    ${s.sub ? `<p class="lede sub" style="margin-top:28px;font-size:34px;max-width:32ch">${s.sub}</p>` : ''}
  </div>`;
  const js = `
  drawArt(document.querySelector(S+' .art svg'),T0+.05,1.5,.05);
  lines(S+' .line',T0+B*1.5,.13,.7);
  tw(S+' .rule',{sx:[0,1]},T0+B*1.5+${s.lines.length}*.13+.2,.6,'expo');
  document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  ${s.sub ? `tw(S+' .sub',{opacity:[0,1],y:[24,0]},T0+B*3,.7,'out');` : ''}
  tw(S+' .art',{scale:[.96,1.02]},T0,${c.len}*B,'linear');`;
  return { html, js, cues: [{ t: BEAT * 1.5, type: 'tick', level: .7 }], e: s.e ?? 2 };
}

/** Paso numerado. */
function step(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const A = V ? 470 : 600;
  const art = library[s.art](`${c.sid}-a`);
  const text = `
    <div style="display:flex;align-items:center;gap:26px">
      ${hexBadge(s.n, V ? 118 : 110, `${c.sid}-hb`)}
      <div class="kicker k">Paso ${s.n}${s.of ? ` de ${s.of}` : ''}</div>
    </div>
    <div class="quote" data-fit style="margin-top:36px;font-size:${V ? 88 : 84}px;line-height:1;text-transform:uppercase;
         font-weight:800">${headline(s.title)}</div>
    <div class="rule rule--short" style="margin-top:30px"></div>
    <p class="lede sub" style="margin-top:28px;font-size:${V ? 37 : 33}px;max-width:30ch">${s.d}</p>`;
  const html = V ? `
  <div class="abs art" style="left:${(c.w - r + l) / 2 - A / 2}px;top:290px;width:${A}px;height:${A}px">${art}</div>
  <div class="abs" style="left:${l}px;right:${r}px;top:${290 + A + 40}px">${text}</div>` : `
  <div class="abs art" style="right:${r}px;top:${(c.h - A) / 2}px;width:${A}px;height:${A}px">${art}</div>
  <div class="abs" style="left:${l}px;width:${c.w - l - r - A - 80}px;top:0;bottom:0;display:flex;
       flex-direction:column;justify-content:center">${text}</div>`;
  const js = `
  tw('#${c.sid}-hb',{scale:[0,1],rot:[-30,0]},T0,.55,'back');
  tw(S+' .k',{opacity:[0,1],x:[-24,0]},T0+.15,.5,'expo');
  drawArt(document.querySelector(S+' .art svg'),T0+.1,1.3,.045);
  lines(S+' .line',T0+B,.12,.65);
  tw(S+' .rule',{sx:[0,1]},T0+B*2,.6,'expo');
  document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  tw(S+' .sub',{opacity:[0,1],y:[22,0]},T0+B*2.2,.7,'out');`;
  return {
    html, js, e: s.e ?? 2,
    cues: [{ t: 0, type: 'tick', level: 1, freq: 1600 + s.n * 120 }, { t: BEAT, type: 'tick', level: .6 }],
  };
}

/** Mito tachado y lo que pasa de verdad. */
function myth(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const W = c.w - l - r;
  const html = `
  <div class="abs" style="left:${l}px;right:${r}px;top:${V ? 300 : 120}px;bottom:${V ? 440 : 120}px;display:flex;
       flex-direction:column;justify-content:center">
    <div style="display:flex;align-items:center;gap:18px" class="mk">
      <span style="width:56px;height:56px">${iconNo}</span>
      <span class="kicker" style="color:rgba(242,242,242,.5)">Mito ${s.n}</span>
    </div>
    <div class="gl mito" style="position:relative;margin-top:26px;width:${W}px">
      <div class="quote" data-fit style="font-size:${V ? 76 : 70}px;line-height:1.05;color:rgba(242,242,242,.9)">
        ${s.mito.map((x, i, a) => `<div class="mask"><span class="line" style="position:relative">${
          (i === 0 ? '“' : '') + x + (i === a.length - 1 ? '”' : '')}<i class="strike" style="top:50%"></i></span></div>`).join('')}
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:18px;margin-top:${V ? 110 : 70}px" class="vk">
      <span style="width:56px;height:56px">${iconYes}</span>
      <span class="kicker">Lo que pasa</span>
    </div>
    <div class="quote verdad" data-fit style="margin-top:26px;font-size:${V ? 62 : 56}px;line-height:1.14;
         font-weight:700;letter-spacing:-.015em">${headline(s.verdad)}</div>
  </div>`;
  const js = `
  tw(S+' .mk',{opacity:[0,1],x:[-24,0]},T0,.45,'expo');
  lines(S+' .mito .line',T0+.12,.1,.55);
  [...document.querySelectorAll(S+' .strike')].forEach((k,i)=>tw(k,{sx:[0,1]},T0+B*2+i*.1,.3,'expo'));
  glitch(S+' .mito',T0+B*2+.05,.3,30,${s.n + 11});
  tw(S+' .mito .quote',{opacity:[1,.32]},T0+B*2+.2,.4,'out');
  tw(S+' .vk',{opacity:[0,1],x:[-24,0]},T0+B*3,.45,'expo');
  lines(S+' .verdad .line',T0+B*3+.12,.12,.6);`;
  return {
    html, js, e: s.e ?? 2,
    cues: [{ t: 0, type: 'tick', level: .8, freq: 1500 }, { t: BEAT * 2, type: 'glitch', seed: s.n },
      { t: BEAT * 3, type: 'hit', level: .4 }],
  };
}

/** Cifra que cuenta hasta su valor. */
function stat(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const html = `
  <div class="abs" style="left:${l}px;right:${V ? r : c.w * .25}px;top:0;bottom:${V ? 160 : 0}px;display:flex;
       flex-direction:column;justify-content:center">
    <div class="kicker k">${s.kicker}</div>
    <div class="gold num" data-fmt="${s.fmt || 'int'}" style="font-weight:900;font-size:${V ? 230 : 250}px;line-height:1;
         letter-spacing:-.045em;margin-top:18px;font-variant-numeric:tabular-nums">0</div>
    <div class="quote" style="margin-top:22px;font-size:${V ? 60 : 58}px;line-height:1.1;font-weight:700">
      ${headline(s.caption)}</div>
  </div>`;
  const js = `
  tw(S+' .k',{opacity:[0,1],y:[20,0]},T0,.5,'expo');
  tw(S+' .num',{count:[0,${s.num}],opacity:[0,1],scale:[.9,1]},T0+.2,1.6,'expo');
  document.querySelector(S+' .num').style.transformOrigin='0 60%';
  lines(S+' .line',T0+B*4,.12,.6);`;
  const cues = [];
  for (let k = 0; k < 9; k++) cues.push({ t: .2 + 1.6 * (1 - Math.pow(1 - k / 9, 2.2)) * .72, type: 'tick', level: .5, freq: 2000 + k * 90 });
  cues.push({ t: BEAT * 4, type: 'hit', level: .5 });
  return { html, js, cues, e: s.e ?? 3 };
}

/** Lista que entra de a un ítem por pulso. */
function list(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const html = `
  <div class="abs" style="left:${l}px;right:${r}px;top:${V ? 300 : 120}px;bottom:${V ? 440 : 120}px;display:flex;
       flex-direction:column;justify-content:center">
    <div class="quote" data-fit style="font-size:${V ? 96 : 78}px;line-height:1;text-transform:uppercase;font-weight:800">
      ${headline(s.title, { gold: s.gold ?? [s.title.length - 1] })}</div>
    <div class="rule rule--short" style="margin-top:28px"></div>
    <div style="margin-top:${V ? 70 : 44}px;display:flex;flex-direction:column;gap:${V ? (s.items.length > 4 ? 34 : 48) : 22}px">
      ${s.items.map((it, i) => `
      <div class="it" style="display:flex;align-items:center;gap:28px">
        ${hexBadge(s.check ? '✓' : i + 1, V ? 104 : 80, `${c.sid}-i${i}`)}
        <span style="font-weight:700;font-size:${V ? (s.items.length > 4 ? 54 : 60) : 46}px;letter-spacing:-.015em;line-height:1.12">${it}</span>
      </div>`).join('')}
    </div>
  </div>`;
  const js = `
  lines(S+' .quote .line',T0,.12,.6);
  tw(S+' .rule',{sx:[0,1]},T0+.4,.6,'expo');
  document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  [...document.querySelectorAll(S+' .it')].forEach((it,i)=>{
    tw(it,{opacity:[0,1],x:[-40,0]},T0+B*(2+i*${s.every ?? 1}),.5,'expo');
    tw(it.querySelector('.hexnum'),{scale:[.3,1]},T0+B*(2+i*${s.every ?? 1}),.5,'back');
  });`;
  const cues = s.items.map((_, i) => ({ t: BEAT * (2 + i * (s.every ?? 1)), type: 'tick', level: .9, freq: 1500 + i * 180 }));
  return { html, js, cues, e: s.e ?? 2 };
}

/** Dos caminos, uno apagado y uno encendido. */
function compare(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const card = (k, x, on) => `
    <div class="cmp ${k}" style="flex:1;display:flex;flex-direction:column;justify-content:center;border-radius:26px;padding:${V ? '40px 42px' : '38px'};
      background:linear-gradient(180deg,rgba(242,242,242,${on ? .07 : .03}),rgba(242,242,242,.015));
      border:1.5px solid ${on ? 'rgba(240,226,129,.45)' : 'rgba(242,242,242,.12)'};
      ${on ? 'box-shadow:0 0 70px rgba(240,226,129,.14)' : ''}">
      <div style="display:flex;align-items:center;gap:18px">
        <span style="width:52px;height:52px;flex:0 0 auto">${on ? iconYes : iconNo}</span>
        <span style="font-weight:800;font-size:${V ? 42 : 38}px;color:${on ? '#F0E281' : 'rgba(242,242,242,.6)'}">${x.h}</span>
      </div>
      <div style="margin-top:22px;display:flex;flex-direction:column;gap:14px">
        ${x.items.map(t => `<div class="ci" style="font-size:${V ? 36 : 32}px;line-height:1.3;
          color:${on ? 'rgba(242,242,242,.94)' : 'rgba(242,242,242,.5)'}">— ${t}</div>`).join('')}
      </div>
    </div>`;
  const html = `
  <div class="abs" style="left:${l}px;right:${r}px;top:${V ? 320 : 130}px;bottom:${V ? 470 : 110}px;display:flex;
       flex-direction:column;gap:28px">
    <div class="quote" style="font-size:${V ? 70 : 66}px;text-transform:uppercase;font-weight:800">${headline([s.title])}</div>
    <div style="flex:1;display:flex;flex-direction:${V ? 'column' : 'row'};gap:26px">
      ${card('ca', s.a, false)}${card('cb', s.b, true)}
    </div>
  </div>`;
  const js = `
  lines(S+' .quote .line',T0,0,.6);
  tw(S+' .ca',{opacity:[0,1],x:[-60,0]},T0+B,.6,'expo');
  [...document.querySelectorAll(S+' .ca .ci')].forEach((e,i)=>tw(e,{opacity:[0,1]},T0+B*1.5+i*.2,.4,'out'));
  tw(S+' .cb',{opacity:[0,1],x:[60,0]},T0+B*4,.6,'expo');
  [...document.querySelectorAll(S+' .cb .ci')].forEach((e,i)=>tw(e,{opacity:[0,1],x:[-16,0]},T0+B*4.5+i*.22,.45,'out'));
  tw(S+' .ca',{opacity:[1,.45]},T0+B*4,.6,'out');`;
  return {
    html, js, e: s.e ?? 2,
    cues: [{ t: BEAT, type: 'whoosh', len: .5, level: .6 }, { t: BEAT * 4, type: 'hit', level: .45 }],
  };
}

/** Cierre con llamada a la acción. */
function cta(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const html = `
  <div class="abs" style="left:${l}px;right:${V ? r : c.w * .28}px;top:0;bottom:${V ? 200 : 0}px;display:flex;
       flex-direction:column;justify-content:center">
    <div class="quote" data-fit style="font-size:${V ? 96 : 96}px;line-height:1;text-transform:uppercase;font-weight:900;
         letter-spacing:-.03em">${headline(s.lines, { gold: [s.lines.length - 1] })}</div>
    <div class="rule" style="width:60%;margin-top:36px"></div>
    ${s.sub ? `<p class="lede sub" style="margin-top:28px;font-size:${V ? 38 : 34}px;max-width:26ch">${s.sub}</p>` : ''}
    <div style="margin-top:44px"><span class="pill">${s.pill}
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="#12171E"
        stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
    <div class="handle" style="margin-top:30px">${s.handle || '@productosdigitales'}</div>
  </div>`;
  const js = `
  lines(S+' .quote .line',T0,.14,.6);
  tw(S+' .rule',{sx:[0,1]},T0+B*1.6,.6,'expo');
  document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  ${s.sub ? `tw(S+' .sub',{opacity:[0,1],y:[20,0]},T0+B*2,.6,'out');` : ''}
  tw(S+' .pill',{scale:[.5,1],opacity:[0,1]},T0+B*3,.55,'back');
  tw(S+' .handle',{opacity:[0,1]},T0+B*3.5,.6,'out');`;
  return { html, js, e: s.e ?? 1, cues: [{ t: BEAT * 3, type: 'hit', level: .45 }] };
}

/** Cierre de marca: el revelado del logo, dentro de la pieza. */
function logo(s, c) {
  const { V } = safe(c.w, c.h);
  const bh = V ? 150 : 170;
  const spec = logoReveal({ id: c.sid + 'L', w: c.w, h: c.h, bh, dur: c.len * BEAT, fadeOut: false,
    embedded: true, tag: s.tag !== false });
  return { html: spec.body, js: shiftTimes(spec.timeline), cues: LOGO_CUES, e: 0, musicEnd: true };
}

/* El timeline del logo viene escrito con tiempos desde 0. Dentro de una pieza
   se corre en una función que le suma T0 a cada llamada (vía PD, para no
   caer en la zona muerta de las const que la sombrean). */
function shiftTimes(js) {
  return `(function(){
    const tw=(a,b,s,d,e)=>PD.tw(a,b,s+T0,d,e);
    const glitch=(a,s,d,m,z)=>PD.glitch(a,s+T0,d,m,z);
    const lines=(a,s,st,d)=>PD.lines(a,s+T0,st,d);
    ${js}
  })();`;
}


/* ======================= escenas de clase (valor) ======================= */

const pad2 = n => String(n).padStart(2, '0');

/** Punto de una clase: número, título, explicación y ejemplo concreto. */
function point(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const art = s.art ? library[s.art](`${c.sid}-a`) : '';
  const text = `
    <div style="display:flex;align-items:center;gap:24px" class="hd">
      ${hexBadge(s.n, V ? 104 : 116, `${c.sid}-hb`)}
      <div class="kicker k">${s.label || 'Punto'} ${s.n}${s.of ? ` de ${s.of}` : ''}</div>
    </div>
    <div class="quote" data-fit style="margin-top:34px;font-size:${V ? 90 : 104}px;line-height:1;text-transform:uppercase;
         font-weight:800">${headline(s.title, { gold: s.gold ?? [s.title.length - 1] })}</div>
    <div class="rule rule--short" style="margin-top:28px"></div>
    <p class="body" style="margin:28px 0 0;font-size:${V ? 42 : 46}px;line-height:1.38;color:rgba(242,242,242,.88);
       font-weight:500;max-width:${V ? '30ch' : '32ch'}">${s.body}</p>
    ${s.ex ? `<div class="ex" style="margin-top:${V ? 40 : 30}px;border-left:5px solid #F0E281;padding:20px 28px;
         background:linear-gradient(90deg,rgba(240,226,129,.10),rgba(240,226,129,.02));border-radius:0 18px 18px 0">
      <div class="kicker" style="font-size:${V ? 22 : 24}px">${s.exLabel || 'Ejemplo'}</div>
      <div style="margin-top:10px;font-size:${V ? 36 : 40}px;font-weight:600;line-height:1.34">${s.ex}</div></div>` : ''}`;
  const html = V ? `
  ${art ? `<div class="abs art" style="right:-150px;bottom:-40px;width:700px;height:700px;opacity:.2">${art}</div>` : ''}
  <div class="abs" style="left:${l}px;right:${r}px;top:280px;bottom:440px;display:flex;flex-direction:column;
       justify-content:center">${text}</div>` : `
  ${art ? `<div class="abs art" style="right:${r}px;top:${(c.h - 560) / 2}px;width:560px;height:560px">${art}</div>` : ''}
  <div class="abs" style="left:${l}px;width:${c.w - l - r - (art ? 640 : 200)}px;top:120px;bottom:120px;display:flex;
       flex-direction:column;justify-content:center">${text}</div>`;
  const js = `
  tw('#${c.sid}-hb',{scale:[0,1],rot:[-30,0]},T0,.55,'back');
  tw(S+' .k',{opacity:[0,1],x:[-24,0]},T0+.12,.5,'expo');
  ${art ? `drawArt(document.querySelector(S+' .art svg'),T0+.3,2.2,.06);` : ''}
  lines(S+' .quote .line',T0+.25,.12,.6);
  tw(S+' .rule',{sx:[0,1]},T0+.9,.6,'expo');
  document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  tw(S+' .body',{opacity:[0,1],y:[26,0]},T0+B*2.4,.7,'out');
  ${s.ex ? `tw(S+' .ex',{opacity:[0,1],x:[-40,0]},T0+B*${s.exAt ?? 6},.6,'expo');` : ''}`;
  return {
    html, js, e: s.e ?? 2,
    cues: [{ t: 0, type: 'tick', level: .9, freq: 1500 + s.n * 110 }, { t: BEAT * 2.4, type: 'tick', level: .45 },
      ...(s.ex ? [{ t: BEAT * (s.exAt ?? 6), type: 'whoosh', len: .35, level: .35 }] : [])],
  };
}

/** Prompt de IA que se escribe en pantalla, listo para copiar. */
function prompt(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const chars = s.prompt.length;
  const typeDur = Math.min(4.2, Math.max(1.6, chars / 48));
  const html = `
  <div class="abs" style="left:${V ? l : c.w * .1}px;right:${V ? r : c.w * .1}px;top:${V ? 280 : 100}px;bottom:${V ? 440 : 100}px;
       display:flex;flex-direction:column;justify-content:center">
    <div style="display:flex;align-items:center;gap:22px" class="hd">
      ${hexBadge(s.n, V ? 96 : 84, `${c.sid}-hb`)}
      <div><div class="kicker k" style="font-size:${V ? 24 : 22}px">Prompt ${s.n}${s.of ? ` de ${s.of}` : ''}</div>
        <div class="quote" style="margin-top:6px;font-size:${V ? 58 : 68}px;font-weight:800;line-height:1.05">
          ${headline([s.title])}</div></div>
    </div>
    <div class="card-p" style="margin-top:${V ? 40 : 30}px;border-radius:26px;border:1.5px solid rgba(240,226,129,.34);
         background:linear-gradient(180deg,rgba(26,24,18,.96),rgba(16,15,12,.96));box-shadow:0 0 80px rgba(240,226,129,.10)">
      <div style="display:flex;align-items:center;gap:10px;padding:18px 26px;border-bottom:1px solid rgba(242,242,242,.08)">
        <i style="width:14px;height:14px;border-radius:50%;background:#A37B3C"></i>
        <i style="width:14px;height:14px;border-radius:50%;background:#D8BC66"></i>
        <i style="width:14px;height:14px;border-radius:50%;background:#F0E281"></i>
        <span style="margin-left:auto;font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:rgba(242,242,242,.4);
              font-weight:700">Copialo</span>
      </div>
      <div style="padding:${V ? '30px 32px 36px' : '28px 34px 32px'};font-family:'DejaVu Sans Mono',ui-monospace,monospace;
           font-size:${V ? 36 : 38}px;line-height:1.5;color:#F2F2F2;min-height:${V ? 380 : 260}px">
        <span class="gold" style="text-shadow:none">&gt;</span> <span class="tp">${s.prompt}</span><span class="cur"
          style="display:inline-block;width:.55em;height:1.05em;vertical-align:-.15em;background:#F0E281;margin-left:4px"></span>
      </div>
    </div>
    ${s.note ? `<p class="note" style="margin:26px 0 0;font-size:${V ? 32 : 34}px;color:rgba(242,242,242,.6);font-weight:500">${s.note}</p>` : ''}
  </div>`;
  const t0 = BEAT * 2;
  const js = `
  tw('#${c.sid}-hb',{scale:[0,1]},T0,.5,'back');
  tw(S+' .k',{opacity:[0,1],x:[-20,0]},T0+.1,.45,'expo');
  lines(S+' .hd .line',T0+.15,0,.55);
  tw(S+' .card-p',{opacity:[0,1],y:[40,0]},T0+.35,.6,'expo');
  tw(S+' .tp',{type:[0,1]},T0+${t0},${typeDur},'linear');
  for (let t=T0; t<T0+${c.len}*B; t+=.5){ tw(S+' .cur',{opacity:[1,1]},t,0,'linear'); tw(S+' .cur',{opacity:[0,0]},t+.25,0,'linear'); }
  ${s.note ? `tw(S+' .note',{opacity:[0,1],y:[16,0]},T0+${t0 + typeDur + .3},.6,'out');` : ''}`;
  const cues = [{ t: 0, type: 'tick', level: .8, freq: 1700 }];
  const R = mulberry(s.n * 97 + 3);
  for (let t = 0; t < typeDur; t += .075 + R() * .05) cues.push({ t: t0 + t, type: 'tick', level: .16 + R() * .1, freq: 2600 + R() * 1400 });
  return { html, js, cues, e: s.e ?? 2 };
}

function mulberry(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Plantilla: una frase con huecos que se completan con un ejemplo. */
function template(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  let k = 0;
  const parts = [];
  s.parts.forEach(p => {                        // ". , ;" se pegan al hueco anterior
    if (typeof p === 'string' && /^[.,;:!?]+$/.test(p) && parts.length && typeof parts.at(-1) === 'object')
      parts.at(-1).tail = p;
    else parts.push(typeof p === 'string' ? p : { ...p });
  });
  const sentence = parts.map(p => typeof p === 'string' ? p
    : `${p.tail ? '<span style="white-space:nowrap">' : ''}<span class="blank" data-i="${k++}" style="display:inline-grid;vertical-align:baseline;border-bottom:4px dashed rgba(240,226,129,.55);
         padding:0 6px;margin:0 2px"><span class="ph" style="grid-area:1/1;color:rgba(242,242,242,.35);font-weight:600">[${p.b}]</span>
         <span class="fl gold" style="grid-area:1/1;opacity:0">${p.f}</span></span>${p.tail ? `${p.tail}</span>` : ''}`).join('');
  const html = `
  <div class="abs" style="left:${l}px;right:${V ? r : c.w * .2}px;top:${V ? 280 : 100}px;bottom:${V ? 440 : 100}px;display:flex;
       flex-direction:column;justify-content:center">
    <div class="kicker k">${s.kicker || 'Plantilla'}</div>
    <div class="quote" data-fit style="margin-top:22px;font-size:${V ? 84 : 96}px;line-height:1;text-transform:uppercase;font-weight:800">
      ${headline(s.title, { gold: [s.title.length - 1] })}</div>
    <div class="rule rule--short" style="margin-top:26px"></div>
    <p class="sen" style="margin:44px 0 0;font-size:${V ? 56 : 66}px;line-height:1.55;font-weight:700;letter-spacing:-.01em">${sentence}</p>
    ${s.note ? `<p class="note" style="margin:34px 0 0;font-size:${V ? 32 : 34}px;color:rgba(242,242,242,.6)">${s.note}</p>` : ''}
  </div>`;
  const js = `
  tw(S+' .k',{opacity:[0,1],x:[-20,0]},T0,.45,'expo');
  lines(S+' .quote .line',T0+.1,.12,.6);
  tw(S+' .rule',{sx:[0,1]},T0+.7,.6,'expo'); document.querySelectorAll(S+' .rule').forEach(e=>e.style.transformOrigin='0 50%');
  tw(S+' .sen',{opacity:[0,1],y:[24,0]},T0+B*2,.7,'out');
  [...document.querySelectorAll(S+' .blank')].forEach((b,i)=>{
    const at=T0+B*(4+i*2);
    tw(b.querySelector('.ph'),{opacity:[1,0]},at,.25,'out');
    tw(b.querySelector('.fl'),{opacity:[0,1],y:[18,0]},at+.05,.45,'expo');
  });
  ${s.note ? `tw(S+' .note',{opacity:[0,1]},T0+B*${4 + k * 2},.6,'out');` : ''}`;
  const cues = Array.from({ length: k }, (_, i) => ({ t: BEAT * (4 + i * 2), type: 'tick', level: .85, freq: 1800 + i * 200 }));
  return { html, js, cues, e: s.e ?? 2 };
}

/** Línea de tiempo: etapas que se encienden de a una. */
function timeline(s, c) {
  const { l, r, V } = safe(c.w, c.h);
  const every = s.every ?? 3;
  const items = s.items.map((it, i) => V ? `
    <div class="ti" style="position:relative;display:flex;gap:30px;align-items:flex-start">
      ${hexBadge(i + 1, 92, `${c.sid}-t${i}`)}
      <div style="padding-top:4px">
        <div class="kicker" style="font-size:22px">${it.k}</div>
        <div style="font-weight:800;font-size:52px;letter-spacing:-.02em;line-height:1.05;margin-top:6px">${it.t}</div>
        <div style="font-size:31px;line-height:1.36;color:rgba(242,242,242,.66);margin-top:10px;max-width:24ch">${it.d}</div>
      </div>
    </div>` : `
    <div class="ti" style="flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:18px">
      ${hexBadge(i + 1, 92, `${c.sid}-t${i}`)}
      <div class="kicker" style="font-size:24px">${it.k}</div>
      <div style="font-weight:800;font-size:58px;letter-spacing:-.02em;line-height:1.05">${it.t}</div>
      <div style="font-size:34px;line-height:1.38;color:rgba(242,242,242,.66)">${it.d}</div>
    </div>`).join('');
  const html = `
  <div class="abs" style="left:${l}px;right:${r}px;top:${V ? 280 : 110}px;bottom:${V ? 400 : 110}px;display:flex;
       flex-direction:column;justify-content:center">
    <div class="quote" data-fit style="font-size:${V ? 84 : 100}px;line-height:1;text-transform:uppercase;font-weight:800">
      ${headline(s.title, { gold: [s.title.length - 1] })}</div>
    <div style="position:relative;margin-top:${V ? 56 : 70}px;display:flex;flex-direction:${V ? 'column' : 'row'};gap:${V ? 44 : 40}px">
      <div class="tline" style="position:absolute;${V ? 'left:45px;top:40px;bottom:60px;width:4px' : 'left:46px;right:60px;top:44px;height:4px'};
           background:linear-gradient(${V ? '180deg' : '90deg'},#F0E281,#A37B3C);transform-origin:${V ? '50% 0' : '0 50%'};
           box-shadow:0 0 20px rgba(240,226,129,.4)"></div>
      ${items}
    </div>
  </div>`;
  const n = s.items.length;
  const js = `
  lines(S+' .quote .line',T0,.12,.6);
  tw(S+' .tline',{${V ? 'sy' : 'sx'}:[0,1]},T0+B*2,B*${every * (n - 1)}+.3,'linear');
  [...document.querySelectorAll(S+' .ti')].forEach((e,i)=>{
    const at=T0+B*(2+i*${every});
    tw(e,{opacity:[0,1],${V ? 'x:[-40,0]' : 'y:[40,0]'}},at,.55,'expo');
    tw(e.querySelector('.hexnum'),{scale:[.3,1]},at,.5,'back');
  });`;
  const cues = s.items.map((_, i) => ({ t: BEAT * (2 + i * every), type: 'tick', level: .9, freq: 1500 + i * 220 }));
  cues.push({ t: BEAT * (2 + (n - 1) * every), type: 'hit', level: .35 });
  return { html, js, cues, e: s.e ?? 2 };
}

export const SCENES = { hook, statement, step, myth, stat, list, compare, cta, logo, point, prompt, template, timeline };

/* ============================ compositor ============================ */

/**
 * Encadena escenas. Cada escena lleva `t` (tipo) y `len` en pulsos.
 * Devuelve el spec de video y el spec de audio sincronizado.
 */
export function compose({ id, w, h, scenes, handle, persistentLogo = true, gx, gy, progress = false }) {
  const { V } = safe(w, h);
  let T = 0;
  const html = [], js = [], cues = [], sections = [];
  let musicEnd = null;
  scenes.forEach((s, i) => {
    const sid = `${id}-s${i}`;
    const len = s.len;
    const r = SCENES[s.t]({ ...s, handle }, { w, h, sid, len });
    const T0 = +(T).toFixed(3), T1 = +(T + len * BEAT).toFixed(3);
    html.push(`<div class="scene" id="${sid}"><div class="cam">${r.html}</div></div>`);
    const last = i === scenes.length - 1;
    js.push(`{ const S='#${sid}', T0=${T0}, B=${BEAT};
      tw(S,{opacity:[0,1]},T0,0,'linear'); ${last ? '' : `tw(S,{opacity:[1,0]},${T1},0,'linear');`}
      tw(S+' > .cam',{scale:[1.07,1],blur:[14,0]},T0,.5,'expo');
      ${last ? '' : `tw(S+' > .cam',{opacity:[1,0],scale:[1,.97]},${T1}-.16,.16,'in');`}
      ${r.js}
    }`);
    // corte: destello + barrido de aire que llega justo al tiempo fuerte
    if (i > 0) {
      js.push(`tw('#${id}-flash',{opacity:[.55,0]},${T0},.45,'out');`);
      cues.push({ t: Math.max(0, T0 - .32), type: 'whoosh', len: .45, level: .55 });
      if (s.t === 'hook' || s.t === 'logo' || i % 3 === 0) {
        js.push(`PD.tear('#${id}-tear',${T0}-.04,.2,${i * 7 + 1});`);
        cues.push({ t: T0 - .04, type: 'glitch', len: .2, seed: i, level: .7 });
      }
    }
    r.cues.forEach(q => cues.push({ ...q, t: +(q.t + T0).toFixed(3) }));
    sections.push({ t0: T0, t1: T1, e: r.e });
    if (r.musicEnd) musicEnd = T0;
    T += len * BEAT;
  });

  // subida antes del primer salto de energía (de 0–1 a 2–3)
  for (let i = 1; i < sections.length; i++) {
    if (sections[i - 1].e <= 1 && sections[i].e >= 2) {
      cues.push({ t: Math.max(0, sections[i].t0 - 2), type: 'riser', len: 2, level: .75 });
      cues.push({ t: sections[i].t0, type: 'hit', level: .55 });
      break;
    }
  }

  const dur = +T.toFixed(3);
  const logoAt = musicEnd ?? dur;
  const body = `
  <div class="flash" id="${id}-flash"></div>
  <div class="tear" id="${id}-tear">${'<i></i>'.repeat(16)}</div>
  ${progress ? `<div class="abs" id="${id}-pg" style="left:${V ? 90 : 150}px;right:${V ? 150 : 150}px;top:${V ? 150 : 40}px;height:5px;
      border-radius:3px;background:rgba(242,242,242,.14);overflow:hidden"><b style="position:absolute;inset:0;border-radius:3px;
      background:linear-gradient(90deg,#A37B3C,#F0E281);transform-origin:0 50%;box-shadow:0 0 14px rgba(240,226,129,.5)"></b></div>` : ''}
  ${persistentLogo ? `<img id="${id}-pl" class="abs" src="../../brand/logo/lockup-oscuro.png"
      style="left:${V ? 90 : 150}px;top:${V ? 190 : 70}px;height:${V ? 58 : 54}px">` : ''}
  ${html.join('\n')}`;
  const timeline = `
  tw(stage,{'--gx':[${gx ?? 80},${gx ? gx + 8 : 90}],'--gy':[108,86]},0,${dur},'sine');
  ${persistentLogo ? `tw('#${id}-pl',{opacity:[0,1]},.1,.6,'out'); tw('#${id}-pl',{opacity:[1,0]},${logoAt}-.3,.3,'out');` : ''}
  ${progress ? `tw('#${id}-pg b',{sx:[0,1]},0,${logoAt},'linear'); tw('#${id}-pg',{opacity:[1,0]},${logoAt}-.3,.3,'out');` : ''}
  ${js.join('\n')}`;

  return {
    video: { id, w, h, dur, body, timeline, poster: posterTime(scenes), gx: '80%', gy: '100%' },
    audio: { dur, bpm: BPM, sections, cues: cues.sort((a, b) => a.t - b.t), musicEnd, musicLevel: .5 },
  };
}

function posterTime(scenes) {
  // el poster es el final del primer gancho: la frase ya armada
  let t = 0;
  for (const s of scenes) {
    if (s.t === 'hook') return t + s.len * BEAT - .15;
    t += s.len * BEAT;
  }
  return 1.5;
}
