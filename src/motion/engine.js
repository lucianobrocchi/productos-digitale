/* ------------------------------------------------------------------
   Motor de animación de Productos Digitales.

   Todo es determinista: el renderizador llama a __seek(t) frame por frame
   y la página se dibuja exactamente igual cada vez. Nada depende del reloj
   real, así el audio (que se genera aparte con las mismas marcas de tiempo)
   calza al frame.
   ------------------------------------------------------------------ */
(function () {
  const FPS = window.__FPS || 30;

  /* ---------------------------- curvas ---------------------------- */
  const EASE = {
    linear: t => t,
    in: t => t * t * t,
    out: t => 1 - Math.pow(1 - t, 3),
    inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    expo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    expoIn: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    quint: t => 1 - Math.pow(1 - t, 5),
    back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    backSoft: t => { const c1 = .9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  };

  /* PRNG con semilla: el glitch y el polvo son "aleatorios" pero repetibles. */
  const rand = seed => {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const els = t => typeof t === 'string' ? [...document.querySelectorAll(t)]
    : (t instanceof Element ? [t] : [...t]);

  /* --------------------------- pistas --------------------------- */
  const tracks = new Map();   // elemento -> { prop -> [tweens] }
  let DUR = 0;

  /** Agrega una interpolación: tw(sel, {opacity:[0,1], y:[40,0]}, inicio, duración, curva) */
  function tw(target, props, start, dur = .6, ease = 'out') {
    const e = typeof ease === 'function' ? ease : (EASE[ease] || EASE.out);
    for (const el of els(target)) {
      let m = tracks.get(el);
      if (!m) { m = {}; tracks.set(el, m); }
      for (const [p, v] of Object.entries(props)) {
        (m[p] ||= []).push({ from: v[0], to: v[1], start, dur, ease: e });
        m[p].sort((a, b) => a.start - b.start);
      }
    }
    DUR = Math.max(DUR, start + dur);
  }

  /** Cambio instantáneo de un valor en un instante dado. */
  const set = (target, props, at) =>
    tw(target, Object.fromEntries(Object.entries(props).map(([k, v]) => [k, [v, v]])), at, 0, 'linear');

  function valueAt(list, t) {
    let cur = null;
    for (const w of list) { if (t >= w.start) cur = w; else break; }
    if (!cur) return list[0].from;
    const k = cur.dur <= 0 ? 1 : Math.min(1, (t - cur.start) / cur.dur);
    return cur.from + (cur.to - cur.from) * cur.ease(k);
  }

  const fmt = {
    int: v => Math.round(v).toLocaleString('es-AR'),
    pct: v => Math.round(v) + '%',
    usd: v => 'US$ ' + Math.round(v).toLocaleString('es-AR'),
    dec1: v => v.toFixed(1).replace('.', ','),
  };

  function apply(el, m, t) {
    const v = {};
    for (const p in m) v[p] = valueAt(m[p], t);
    const s = el.style;

    if ('opacity' in v) s.opacity = v.opacity;

    const tf = [];
    if ('x' in v || 'y' in v) tf.push(`translate(${v.x || 0}px,${v.y || 0}px)`);
    if ('xp' in v || 'yp' in v) tf.push(`translate(${v.xp || 0}%,${v.yp || 0}%)`);
    if ('rot' in v) tf.push(`rotate(${v.rot}deg)`);
    if ('scale' in v) tf.push(`scale(${v.scale})`);
    if ('sx' in v || 'sy' in v) tf.push(`scale(${'sx' in v ? v.sx : 1},${'sy' in v ? v.sy : 1})`);
    if (tf.length) s.transform = tf.join(' ');

    const fl = [];
    if ('blur' in v && v.blur > .01) fl.push(`blur(${v.blur}px)`);
    if ('bright' in v) fl.push(`brightness(${v.bright})`);
    if (fl.length || 'blur' in v || 'bright' in v) s.filter = fl.join(' ') || 'none';

    if ('clipX' in v) s.clipPath = `inset(-20% ${(1 - v.clipX) * 100}% -20% -2%)`;
    if ('clipXr' in v) s.clipPath = `inset(-20% -2% -20% ${(1 - v.clipXr) * 100}%)`;
    if ('clipY' in v) s.clipPath = `inset(${(1 - v.clipY) * 100}% -10% -10% -10%)`;
    if ('circle' in v) s.clipPath = `circle(${v.circle}% at 50% 50%)`;

    if ('draw' in v) {
      if (el.__len === undefined) {
        el.__len = el.getTotalLength ? el.getTotalLength() : 0;
        s.strokeDasharray = `${el.__len} ${el.__len}`;
      }
      s.strokeDashoffset = el.__len * (1 - v.draw);
    }
    if ('fo' in v) s.fillOpacity = v.fo;
    if ('count' in v) el.textContent = (fmt[el.dataset.fmt] || fmt.int)(v.count);
    if ('type' in v) {                      // máquina de escribir
      const full = el.__full ?? (el.__full = el.textContent);
      el.textContent = full.slice(0, Math.round(v.type * full.length));
    }
    for (const p in v) if (p.startsWith('--')) s.setProperty(p, v[p] + (el.dataset.unit || '%'));
    if ('fn' in m) { /* reservado */ }
  }

  /* ----------------------------- glitch ----------------------------- */
  /* El manual describe una "distorsión glitch sobre el cruce" del monograma.
     Acá se vuelve lenguaje de movimiento: franjas horizontales desplazadas,
     con una copia dorada y otra clara, durante ventanas cortas. */
  const glitches = [];

  function glitch(target, start, dur = .35, amp = 26, seed = 7) {
    for (const el of els(target)) {
      if (!el.__slices) {
        el.style.position ||= 'relative';
        const src = el.firstElementChild;
        const placed = getComputedStyle(src).position !== 'static';
        el.__slices = [];
        for (let i = 0; i < 6; i++) {
          const c = src.cloneNode(true);
          c.removeAttribute('id');
          c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
          c.classList.add('gl-slice');
          // si el original ya está posicionado, el clon hereda su caja tal cual
          c.style.cssText += (placed ? '' : ';position:absolute;left:0;top:0;width:100%')
            + ';pointer-events:none;opacity:0';
          c.dataset.tint = i % 2 ? 'gold' : 'paper';
          el.appendChild(c);
          el.__slices.push(c);
        }
        el.__src = src;
      }
      glitches.push({ el, start, dur, amp, seed });
      DUR = Math.max(DUR, start + dur);
    }
  }

  function applyGlitches(t) {
    const frame = Math.round(t * FPS);
    const active = new Map();
    for (const g of glitches) if (t >= g.start && t < g.start + g.dur) active.set(g.el, g);
    const seen = new Set();
    for (const g of glitches) {
      if (seen.has(g.el)) continue;
      seen.add(g.el);
      const a = active.get(g.el);
      if (!a) {
        g.el.__slices.forEach(s => (s.style.opacity = 0));
        g.el.__src.style.transform = '';
        continue;
      }
      const r = rand(a.seed * 9973 + frame * 131);
      const k = (t - a.start) / a.dur;
      const env = Math.sin(Math.PI * Math.min(1, k)) ** .6;          // entra y sale
      a.el.__src.style.transform = `translateX(${(r() - .5) * a.amp * .5 * env}px)`;
      a.el.__slices.forEach((s, i) => {
        if (r() < .28) { s.style.opacity = 0; return; }               // parpadeo
        const top = r() * 92, h = 2 + r() * 16;
        s.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`;
        s.style.transform = `translateX(${(r() - .5) * 2 * a.amp * env}px)`;
        s.style.opacity = (.55 + r() * .45) * env;
        s.style.filter = s.dataset.tint === 'gold'
          ? 'sepia(1) saturate(3.2) hue-rotate(8deg) brightness(1.15)'
          : 'grayscale(1) brightness(1.6)';
        s.style.mixBlendMode = 'screen';
      });
    }
  }

  /* ------------------------ polvo dorado ------------------------ */
  let dust = null;
  function setupDust(canvas, { n = 70, seed = 3, rise = 26, color = '240,226,129' } = {}) {
    const W = canvas.width = canvas.clientWidth, H = canvas.height = canvas.clientHeight;
    const r = rand(seed);
    const ps = Array.from({ length: n }, () => ({
      x: r() * W, y: r() * H, vx: (r() - .5) * 10, vy: -(6 + r() * rise),
      s: .7 + r() * 2.6, ph: r() * 6.28, sp: .6 + r() * 1.8, a: .25 + r() * .6,
      bokeh: r() < .12,
    }));
    dust = { ctx: canvas.getContext('2d'), W, H, ps, color };
  }
  function drawDust(t) {
    if (!dust) return;
    const { ctx, W, H, ps, color } = dust;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      const x = ((p.x + p.vx * t) % W + W) % W;
      const y = ((p.y + p.vy * t) % H + H) % H;
      const a = p.a * (.45 + .55 * Math.sin(p.ph + t * p.sp)) ** 2;
      const rad = p.bokeh ? p.s * 7 : p.s;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad * 2.2);
      g.addColorStop(0, `rgba(${color},${a * (p.bokeh ? .22 : 1)})`);
      g.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, rad * 2.2, 0, 6.2832); ctx.fill();
    }
  }

  /* ------------------------- ayudantes ------------------------- */

  /** Dibuja una ilustración: los trazos se dibujan, los rellenos aparecen al final. */
  function drawArt(svg, start, dur = 1.4, stagger = .07, ease = 'inOut') {
    const root = typeof svg === 'string' ? document.querySelector(svg) : svg;
    if (!root) return start;
    const halo = root.querySelector(':scope > circle');
    if (halo) tw(halo, { opacity: [0, 1], scale: [.6, 1] }, start, dur * 1.2, 'out');
    const geos = [...root.querySelectorAll('g path, g circle, g ellipse, g rect, g line, g polyline')];
    let end = start;
    geos.forEach((g, i) => {
      const s = start + i * stagger;
      const solid = g.getAttribute('stroke') === 'none';
      const dashed = g.hasAttribute('stroke-dasharray');
      if (solid) {
        tw(g, { opacity: [0, 1], scale: [.4, 1] }, s + dur * .55, .5, 'back');
        end = Math.max(end, s + dur * .55 + .5);
      } else if (dashed) {
        tw(g, { opacity: [0, 1] }, s + dur * .3, dur * .6, 'out');
      } else {
        tw(g, { draw: [0, 1] }, s, dur, ease);
        if (g.getAttribute('fill') && g.getAttribute('fill') !== 'none')
          tw(g, { fo: [0, 1] }, s + dur * .7, .5, 'out');
        end = Math.max(end, s + dur);
      }
    });
    return end;
  }

  /** Revela líneas de titular desde una máscara, una por una. */
  function lines(target, start, stagger = .12, dur = .7) {
    let i = 0;
    for (const el of els(target)) {
      tw(el, { yp: [110, 0], opacity: [0, 1], blur: [10, 0] }, start + i * stagger, dur, 'expo');
      i++;
    }
    return start + (i - 1) * stagger + dur;
  }

  /** Respiración lenta: el resplandor sube y baja para que nada quede quieto. */
  function breathe(target, start, end, period = 2, lo = .82, hi = 1) {
    for (let t = start; t < end; t += period) {
      tw(target, { opacity: [lo, hi] }, t, period / 2, 'sine');
      tw(target, { opacity: [hi, lo] }, t + period / 2, period / 2, 'sine');
    }
  }

  /** Desgarro digital: franjas doradas y claras que saltan por el cuadro
      durante un corte. Se precalcula frame a frame con semilla. */
  function tear(sel, start, dur = .2, seed = 1) {
    const box = document.querySelector(sel);
    if (!box) return;
    const bars = [...box.children], H = box.clientHeight, W = box.clientWidth;
    const R = rand(seed * 7717 + 3);
    bars.forEach(b => { if (!b.__init) { tw(b, { opacity: [0, 0] }, 0, 0, 'linear'); b.__init = true; } });
    const n = Math.max(1, Math.round(dur * FPS));
    for (let f = 0; f < n; f++) {
      const t = start + f / FPS;
      bars.forEach(b => {
        const on = R() < .55, o = on ? .25 + R() * .75 : 0;
        const y = R() * H, hh = 2 + R() * R() * 70, x = (R() - .5) * W * .35;
        tw(b, { opacity: [o, o], y: [y, y], sy: [hh, hh], x: [x, x] }, t, 0, 'linear');
      });
    }
    bars.forEach(b => tw(b, { opacity: [0, 0] }, start + n / FPS, 0, 'linear'));
  }

  /** Reduce el cuerpo de cada titular [data-fit] hasta que su línea más ancha entra. */
  function fit(root = document) {
    root.querySelectorAll('[data-fit]').forEach(el => {
      const box = el.getBoundingClientRect().width;
      const ln = [...el.querySelectorAll('.line')];
      if (!ln.length) return;
      const widest = () => Math.max(...ln.map(l => l.getBoundingClientRect().width));
      let size = parseFloat(getComputedStyle(el).fontSize), g = 0;
      while (widest() > box && size > 14 && g++ < 400) { size -= 1; el.style.fontSize = size + 'px'; }
    });
  }

  /* ---------------------------- seek ---------------------------- */
  /* El grano se mueve cada frame: quieto parece suciedad en la lente. */
  function applyGrain(t) {
    const r = rand(Math.round(t * FPS) * 7919 + 1);
    document.querySelectorAll('.grain').forEach(g =>
      (g.style.backgroundPosition = `${Math.floor(r() * 220)}px ${Math.floor(r() * 220)}px`));
  }

  function seek(t) {
    for (const [el, m] of tracks) apply(el, m, t);
    applyGlitches(t);
    applyGrain(t);
    drawDust(t);
  }

  window.PD = { tw, set, glitch, setupDust, drawArt, lines, breathe, rand, EASE, fit, tear,
                get dur() { return DUR; } };
  window.__seek = seek;
})();
