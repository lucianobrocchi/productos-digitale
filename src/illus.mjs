/* ------------------------------------------------------------------
   Ilustraciones originales para Productos Digitales.
   Todas dibujadas sobre la misma geometría que construye el isotipo:
   hexágono regular de vértices a 0°,60°,…,300° y esquinas redondeadas.
   Trazo dorado sobre negro, viewBox unificado 0 0 400 400.
   ------------------------------------------------------------------ */

const TAU = Math.PI * 2;

/** Hexágono regular con esquinas redondeadas (puntas a izquierda y derecha). */
export function hexPath(cx, cy, r, round = 0.18) {
  const v = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * TAU) / 6;
    v.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const side = 2 * r * Math.sin(Math.PI / 6);   // longitud de lado = r
  const k = Math.min(round, 0.5) * side;        // recorte en cada vértice
  let d = '';
  for (let i = 0; i < 6; i++) {
    const p = v[i], prev = v[(i + 5) % 6], next = v[(i + 1) % 6];
    const toPrev = norm(prev, p), toNext = norm(next, p);
    const a = [p[0] + toPrev[0] * k, p[1] + toPrev[1] * k];
    const b = [p[0] + toNext[0] * k, p[1] + toNext[1] * k];
    d += (i === 0 ? `M${f(a)}` : `L${f(a)}`) + `Q${f(p)} ${f(b)}`;
  }
  return d + 'Z';
}
const norm = (a, b) => { const dx = a[0] - b[0], dy = a[1] - b[1], m = Math.hypot(dx, dy) || 1; return [dx / m, dy / m]; };
const f = p => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

/** defs compartidos: degradados dorados y resplandor. */
export function defs(id = 'a') {
  return `
  <defs>
    <linearGradient id="g-${id}" gradientUnits="userSpaceOnUse" x1="90" y1="30" x2="230" y2="380">
      <stop offset="0"   stop-color="#F0E281"/>
      <stop offset=".55" stop-color="#D8BC66"/>
      <stop offset="1"   stop-color="#A37B3C"/>
    </linearGradient>
    <!-- userSpaceOnUse: un degradado objectBoundingBox degenera en trazos
         de ancho o alto cero (líneas rectas) y no pinta nada. -->
    <linearGradient id="gh-${id}" gradientUnits="userSpaceOnUse" x1="40" y1="40" x2="360" y2="360">
      <stop offset="0" stop-color="#F6EFB4"/>
      <stop offset="1" stop-color="#A37B3C"/>
    </linearGradient>
    <linearGradient id="fade-${id}" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="340">
      <stop offset="0"   stop-color="#F0E281" stop-opacity=".55"/>
      <stop offset="1"   stop-color="#F0E281" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="halo-${id}" cx=".5" cy=".5" r=".5">
      <stop offset="0"   stop-color="#F0E281" stop-opacity=".30"/>
      <stop offset=".55" stop-color="#A37B3C" stop-opacity=".10"/>
      <stop offset="1"   stop-color="#A37B3C" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow-${id}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft-${id}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
  </defs>`;
}

/** Envoltorio: crea el <svg> con defs y estilo de trazo común. */
function svg(id, body, { halo = true } = {}) {
  return `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  ${halo ? `<circle cx="200" cy="200" r="196" fill="url(#halo-${id})"/>` : ''}
  <g stroke="url(#g-${id})" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"
     filter="url(#glow-${id})">
    ${body}
  </g>
</svg>`;
}

/* ============================ piezas ============================ */

/** Ruta de hexágonos ascendente: el método, paso a paso. */
export const hexRoute = (id = 'r') => {
  const nodes = [[62, 318], [158, 252], [252, 174], [344, 96]];
  let d = '';
  nodes.forEach(([x, y], i) => { d += `${i ? 'L' : 'M'}${x} ${y}`; });
  const hexes = nodes.map(([x, y], i) =>
    `<path d="${hexPath(x, y, i === 3 ? 40 : 28)}" ${i === 3
      ? `fill="url(#g-${id})" stroke="none"`
      : `fill="rgba(240,226,129,.07)"`} stroke-width="4.5"/>`).join('');
  return svg(id, `
    <path d="${d}" stroke-dasharray="2 16" stroke-width="5" opacity=".75"/>
    ${hexes}
    <path d="M330 84 l14 -14 14 14" stroke-width="5" opacity=".9"/>
    <path d="M344 70 v34" stroke-width="5" opacity=".9"/>
    <circle cx="62"  cy="318" r="6" fill="url(#g-${id})" stroke="none"/>
    <circle cx="158" cy="252" r="6" fill="url(#g-${id})" stroke="none"/>
    <circle cx="252" cy="174" r="6" fill="url(#g-${id})" stroke="none"/>`);
};

/** Cabeza de perfil con red interna: mentalidad / criterio. */
export const mindset = (id = 'm') => svg(id, `
  <path d="M138 356 v-78
           C104 254 96 196 108 156
           C124 100 172 68 222 72
           C282 77 318 122 318 172
           C318 196 312 214 330 232
           C338 240 334 250 322 252
           L300 256
           C300 282 292 300 262 304
           L238 307 V356"
        fill="rgba(240,226,129,.05)"/>
  <path d="M300 256 c-14 6 -26 6 -38 0" stroke-width="3.4" opacity=".55"/>
  <path d="${hexPath(206, 168, 58)}" fill="rgba(240,226,129,.07)" stroke-width="3.4" opacity=".9"/>
  <path d="M206 120 v96 M164 144 l84 48 M248 144 l-84 48" stroke-width="3.2" opacity=".75"/>
  <circle cx="206" cy="120" r="8"  fill="url(#g-${id})" stroke="none"/>
  <circle cx="164" cy="144" r="6.5" fill="url(#g-${id})" stroke="none"/>
  <circle cx="248" cy="144" r="6.5" fill="url(#g-${id})" stroke="none"/>
  <circle cx="164" cy="192" r="6.5" fill="url(#g-${id})" stroke="none"/>
  <circle cx="248" cy="192" r="6.5" fill="url(#g-${id})" stroke="none"/>
  <circle cx="206" cy="216" r="9"  fill="url(#g-${id})" stroke="none"/>`);

/** Cohete saliendo del hexágono: el lanzamiento. */
export const launch = (id = 'l') => svg(id, `
  <path d="M200 58 c40 42 60 90 60 140 l0 36 -120 0 0 -36 c0 -50 20 -98 60 -140Z"
        fill="rgba(240,226,129,.07)"/>
  <circle cx="200" cy="164" r="26" fill="rgba(14,14,14,.9)"/>
  <path d="M140 202 l-34 46 34 -8Z" fill="rgba(240,226,129,.12)"/>
  <path d="M260 202 l34 46 -34 -8Z" fill="rgba(240,226,129,.12)"/>
  <path d="M170 266 c10 30 20 46 30 52 10 -6 20 -22 30 -52" fill="url(#g-${id})" stroke="none" opacity=".9"/>
  <path d="M200 330 v34" stroke-width="5"/>
  <path d="M158 320 v22 M242 320 v22" stroke-width="4" opacity=".6"/>
  <path d="M96 128 l18 10 -18 10" stroke-width="3.4" opacity=".55"/>
  <path d="M304 128 l-18 10 18 10" stroke-width="3.4" opacity=".55"/>`);

/** Escalera continua: se sube por método, no por suerte. */
export const stairs = (id = 's') => {
  const W = 66, R = 52, x0 = 56, y0 = 328;          // ancho de huella / alto de contrahuella
  let d = `M${x0} ${y0}`;
  for (let i = 0; i < 4; i++) d += ` v-${R} h${W}`;  // contrahuella + huella
  const outline = `${d} V${y0} Z`;
  return svg(id, `
    <path d="${outline}" fill="rgba(240,226,129,.07)" stroke-width="5"/>
    ${[0, 1, 2, 3].map(i =>
      `<path d="M${x0 + i * W} ${y0 - (i + 1) * R} h${W}" stroke-width="5"
             stroke="url(#gh-${id})" opacity=".95"/>`).join('')}
    <path d="M${x0} ${y0} h${W * 4}" opacity=".3" stroke-width="3.4"/>
    <path d="${hexPath(x0 + W * 4 + 24, y0 - 4 * R - 34, 30)}" fill="url(#g-${id})" stroke="none"/>
    <path d="M${x0 + W * 4 + 24} ${y0 - 4 * R - 76} v-26 M${x0 + W * 4 + 6} ${y0 - 4 * R - 86}
             l18 -18 18 18" stroke-width="4.4" opacity=".75"/>`);
};

/** Embudo: tráfico → oferta → venta. */
export const funnel = (id = 'f') => svg(id, `
  <path d="M74 86 h252 l-92 118 v104 l-68 32 v-136Z" fill="rgba(240,226,129,.06)"/>
  <path d="M74 86 h252" stroke-width="5"/>
  <path d="M110 140 h180" opacity=".4" stroke-width="3.4"/>
  <path d="M146 194 h108" opacity=".4" stroke-width="3.4"/>
  <circle cx="122" cy="52" r="9" fill="url(#g-${id})" stroke="none" opacity=".8"/>
  <circle cx="200" cy="40" r="9" fill="url(#g-${id})" stroke="none"/>
  <circle cx="278" cy="52" r="9" fill="url(#g-${id})" stroke="none" opacity=".8"/>
  <path d="M122 62 v16 M200 50 v28 M278 62 v16" stroke-width="3.4" opacity=".55"/>
  <path d="${hexPath(200, 346, 30)}" fill="url(#g-${id})" stroke="none"/>`);

/** Monedas apiladas con hexágono: ingresos reales. */
export const income = (id = 'c') => {
  const coin = (y, o) => `
    <ellipse cx="200" cy="${y}" rx="96" ry="30" fill="rgba(240,226,129,${o})"/>
    <ellipse cx="200" cy="${y}" rx="96" ry="30"/>`;
  return svg(id, `
    <path d="M104 306 v-96 M296 306 v-96" stroke-width="4.5"/>
    ${coin(306, .05)}${coin(262, .07)}${coin(218, .09)}
    <ellipse cx="200" cy="174" rx="96" ry="30" fill="url(#g-${id})" stroke="none"/>
    <path d="${hexPath(200, 174, 22, .2)}" fill="rgba(14,14,14,.85)" stroke="none"/>
    <path d="M200 96 v-46 M170 80 l30 -30 30 30" stroke-width="5"/>
    <path d="M200 140 v-26" stroke-width="4" opacity=".5" stroke-dasharray="2 10"/>`);
};

/** Bombilla con filamento hexagonal: la idea que ya tenés, hecha sistema. */
export const ideaSystem = (id = 'i') => svg(id, `
  <path d="M200 52 c-56 0 -100 42 -100 96 c0 36 20 60 36 80 c10 12 14 22 14 34 h100
           c0 -12 4 -22 14 -34 c16 -20 36 -44 36 -80 c0 -54 -44 -96 -100 -96Z"
        fill="rgba(240,226,129,.06)"/>
  <path d="${hexPath(200, 148, 44)}" fill="rgba(240,226,129,.10)" stroke-width="3.6"/>
  <path d="M176 176 c0 -22 12 -34 24 -34 c12 0 24 12 24 34" stroke-width="4" opacity=".8"/>
  <path d="M150 288 h100 M154 312 h92 M166 336 h68" stroke-width="9" stroke="url(#gh-${id})"/>
  <path d="M96 60 l20 20 M304 60 l-20 20 M62 150 h26 M312 150 h26 M110 236 l-20 18 M290 236 l20 18"
        stroke-width="4" opacity=".45"/>`);

/** Chip con hexágono: la IA como acelerador. */
export const aiChip = (id = 'ai') => {
  const pins = [];
  for (let i = 0; i < 4; i++) {
    const p = 126 + i * 50;
    pins.push(`<path d="M${p} 104 v-46" stroke-width="7" stroke="url(#gh-${id})" opacity=".85"/>`);
    pins.push(`<path d="M${p} 296 v46" stroke-width="7" stroke="url(#gh-${id})" opacity=".85"/>`);
    pins.push(`<path d="M104 ${p} h-46" stroke-width="7" stroke="url(#gh-${id})" opacity=".85"/>`);
    pins.push(`<path d="M296 ${p} h46" stroke-width="7" stroke="url(#gh-${id})" opacity=".85"/>`);
  }
  return svg(id, `
    ${pins.join('')}
    <path d="M104 104 h192 v192 h-192Z" fill="rgba(240,226,129,.05)" stroke-width="5"/>
    <path d="M140 140 h120 v120 h-120Z" stroke-width="3" opacity=".3"/>
    <path d="${hexPath(200, 200, 48)}" fill="url(#g-${id})" stroke="none"/>
    <path d="${hexPath(200, 200, 24, .2)}" fill="rgba(14,14,14,.92)" stroke="none"/>`);
};

/** Pantalla de móvil con el producto digital dentro. */
export const product = (id = 'p') => svg(id, `
  <path d="M130 44 h140 a18 18 0 0 1 18 18 v276 a18 18 0 0 1 -18 18 h-140 a18 18 0 0 1 -18 -18
           v-276 a18 18 0 0 1 18 -18Z" fill="rgba(240,226,129,.05)"/>
  <path d="M176 44 h48" stroke-width="5" opacity=".7"/>
  <path d="${hexPath(200, 146, 44)}" fill="url(#g-${id})" stroke="none"/>
  <path d="M148 220 h104 M148 254 h104 M148 288 h64" stroke-width="6" opacity=".45"/>
  <path d="M258 322 a22 22 0 1 0 .1 0Z" fill="url(#g-${id})" stroke="none" opacity=".9"/>
  <path d="M250 322 l6 7 12 -14" stroke="#0E0E0E" stroke-width="4"/>`);

/** Curva de crecimiento con hitos. */
export const growth = (id = 'gr') => svg(id, `
  <path d="M64 330 h288" opacity=".35" stroke-width="3.4"/>
  <path d="M64 330 v-268" opacity=".35" stroke-width="3.4"/>
  <path d="M64 306 C132 300 168 268 202 216 C236 164 272 116 348 96" stroke-width="6"/>
  <path d="M64 306 C132 300 168 268 202 216 C236 164 272 116 348 96 L348 330 L64 330Z"
        fill="url(#fade-${id})" stroke="none" opacity=".55"/>
  <circle cx="132" cy="300" r="8" fill="url(#g-${id})" stroke="none" opacity=".75"/>
  <circle cx="202" cy="216" r="9" fill="url(#g-${id})" stroke="none"/>
  <path d="${hexPath(348, 96, 26)}" fill="url(#g-${id})" stroke="none"/>
  <path d="M100 96 h74 M100 132 h44" stroke-width="4" opacity=".3"/>`);

/** Reloj: el tiempo comprimido por el método. */
export const clock = (id = 'k') => {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * TAU - Math.PI / 2;
    const r1 = 116, r2 = i % 3 === 0 ? 96 : 104;
    return `<path d="M${(200 + r1 * Math.cos(a)).toFixed(1)} ${(200 + r1 * Math.sin(a)).toFixed(1)}
      L${(200 + r2 * Math.cos(a)).toFixed(1)} ${(200 + r2 * Math.sin(a)).toFixed(1)}"
      stroke-width="${i % 3 === 0 ? 6 : 3.4}" opacity="${i % 3 === 0 ? .9 : .45}"/>`;
  }).join('');
  return svg(id, `
    <circle cx="200" cy="200" r="140" fill="rgba(240,226,129,.05)"/>
    ${ticks}
    <path d="M200 200 v-72" stroke-width="7"/>
    <path d="M200 200 l58 34" stroke-width="6" opacity=".8"/>
    <circle cx="200" cy="200" r="10" fill="url(#g-${id})" stroke="none"/>
    <path d="M200 60 a140 140 0 0 1 121 70" stroke-width="7" stroke-linecap="round"/>`);
};

/** Imán: atraer al público correcto, no a todos. */
export const magnet = (id = 'mg') => svg(id, `
  <path d="M120 300 v-104 a80 80 0 0 1 160 0 v104" fill="rgba(240,226,129,.05)"/>
  <path d="M120 300 h56 v-104 a24 24 0 0 1 48 0 v104 h56" stroke-width="5"/>
  <path d="M120 300 h56 v40 h-56Z" fill="url(#g-${id})" stroke="none"/>
  <path d="M224 300 h56 v40 h-56Z" fill="url(#g-${id})" stroke="none"/>
  <circle cx="200" cy="96"  r="9" fill="url(#g-${id})" stroke="none"/>
  <circle cx="132" cy="128" r="7" fill="url(#g-${id})" stroke="none" opacity=".7"/>
  <circle cx="268" cy="128" r="7" fill="url(#g-${id})" stroke="none" opacity=".7"/>
  <path d="M200 96 v-44 M132 128 l-26 -30 M268 128 l26 -30" stroke-width="3.4"
        opacity=".5" stroke-dasharray="2 10"/>`);

/** Diana: la oferta que da en el dolor exacto. */
export const target = (id = 't') => svg(id, `
  <circle cx="190" cy="212" r="132" fill="rgba(240,226,129,.04)"/>
  <circle cx="190" cy="212" r="132"/>
  <circle cx="190" cy="212" r="88"  opacity=".65"/>
  <circle cx="190" cy="212" r="44"  opacity=".8"/>
  <path d="${hexPath(190, 212, 20, .2)}" fill="url(#g-${id})" stroke="none"/>
  <path d="M190 212 L340 62" stroke-width="6"/>
  <path d="M340 62 l-4 34 34 -4Z" fill="url(#g-${id})" stroke="none"/>
  <path d="M300 62 h40 v40" stroke-width="3.6" opacity=".4"/>`);

/** Laberinto contra línea recta: el azar frente al sistema. */
export const shortcut = (id = 'sc') => svg(id, `
  <path d="M60 336 h52 v-52 h-52 v-84 h104 v-52 h-52 v-52 h156"
        stroke-width="5" opacity=".38" stroke-dasharray="14 10"/>
  <path d="M60 336 C150 336 250 250 340 96" stroke-width="7"/>
  <path d="M340 96 l-32 6 12 30Z" fill="url(#g-${id})" stroke="none"/>
  <path d="${hexPath(60, 336, 22)}" fill="rgba(240,226,129,.10)"/>
  <path d="${hexPath(340, 96, 30)}" fill="url(#g-${id})" stroke="none"/>
  <circle cx="200" cy="230" r="7" fill="url(#g-${id})" stroke="none" opacity=".8"/>`);

/** Documento/curso: el producto digital terminado. */
export const asset = (id = 'as') => svg(id, `
  <path d="M116 56 h120 l68 68 v220 h-188Z" fill="rgba(240,226,129,.05)"/>
  <path d="M236 56 v68 h68" stroke-width="4.4" opacity=".7"/>
  <path d="M148 186 h124 M148 222 h124 M148 258 h80" stroke-width="6" opacity=".45"/>
  <path d="${hexPath(292, 290, 52)}" fill="url(#g-${id})" stroke="none"/>
  <path d="M270 290 l14 16 26 -30" stroke="#0E0E0E" stroke-width="6"/>`);

/** Dos caminos: empezar con audiencia o empezar con oferta. */
export const twoPaths = (id = 'tp') => svg(id, `
  <path d="${hexPath(200, 330, 30)}" fill="rgba(240,226,129,.10)"/>
  <path d="M200 300 C200 240 116 226 116 166" stroke-width="5" opacity=".35" stroke-dasharray="12 10"/>
  <path d="M200 300 C200 240 284 226 284 166" stroke-width="7"/>
  <path d="${hexPath(116, 120, 40)}" fill="rgba(240,226,129,.05)"/>
  <path d="M100 120 h32 M116 104 v32" stroke-width="4" opacity=".45"/>
  <path d="${hexPath(284, 120, 46)}" fill="url(#g-${id})" stroke="none"/>
  <path d="M266 120 l12 14 24 -26" stroke="#0E0E0E" stroke-width="6"/>
  <path d="M284 66 v-22" stroke-width="4" opacity=".5"/>`);

export const library = {
  hexRoute, mindset, launch, stairs, funnel, income, ideaSystem,
  aiChip, product, growth, clock, magnet, target, shortcut, asset, twoPaths,
};

/* ---- iconos pequeños para listas (✓ / ✕) ---- */

export const iconYes = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="iy" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#F0E281"/><stop offset="1" stop-color="#A37B3C"/>
  </linearGradient></defs>
  <path d="M24 3 L41.6 13.5 V34.5 L24 45 L6.4 34.5 V13.5 Z" fill="url(#iy)"/>
  <path d="M16 24 l6 6 11 -13" stroke="#12171E" stroke-width="4.4"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

export const iconNo = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 3 L41.6 13.5 V34.5 L24 45 L6.4 34.5 V13.5 Z"
        fill="rgba(242,242,242,.05)" stroke="rgba(242,242,242,.30)" stroke-width="2.4"/>
  <path d="M17 17 l14 14 M31 17 l-14 14" stroke="rgba(242,242,242,.45)" stroke-width="4"
        stroke-linecap="round"/>
</svg>`;
