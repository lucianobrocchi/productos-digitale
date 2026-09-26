/* ------------------------------------------------------------------
   Logo oficial animable, reconstruido desde LogosVectorizados.ai.
   Separa el hexágono, las dos mitades del monograma y las 149 franjas
   del glitch para poder animarlas por separado.
   ------------------------------------------------------------------ */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const P = JSON.parse(readFileSync(resolve(here, 'logo-paths.json'), 'utf8'));

/* Degradado metálico horizontal muestreado del badge oficial. */
const METAL = [
  [0, '#AF7C38'], [.14, '#BD9149'], [.30, '#D1AF5E'], [.50, '#EAD77A'],
  [.70, '#E5C969'], [.86, '#DEB957'], [1, '#DAAE4A'],
];

/**
 * @param id    prefijo único para ids internos
 * @param mono  color del monograma (negro sobre oro, por defecto)
 * @param hex   'oro' | 'ninguno' | 'negro'
 */
export function logoMark(id = 'lg', { mono = '#12171E', hex = 'oro', lineColor = '#F0E281' } = {}) {
  const [vx, vy, vw, vh] = P.viewBox.split(' ').map(Number);
  const pad = 14;                                  // aire para el trazo y el brillo
  const stops = METAL.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  // cada pieza animable va en su propio <g>: la animación mueve el grupo y el
  // path conserva intacta la matriz que trae del .ai
  const lines = P.glitch.map((d, i) =>
    `<g class="gl-line" data-i="${i}"><path transform="${P.glitchT}" d="${d}" fill="${mono}"/></g>`).join('');
  return `<svg class="pd-mark" viewBox="${vx - pad} ${vy - pad} ${vw + pad * 2} ${vh + pad * 2}"
     xmlns="http://www.w3.org/2000/svg" fill="none">
  <defs>
    <linearGradient id="${id}-metal" gradientUnits="userSpaceOnUse" x1="${vx}" y1="0" x2="${vx + vw}" y2="0">${stops}</linearGradient>
    <linearGradient id="${id}-sheen" gradientUnits="userSpaceOnUse" x1="${vx - 200}" y1="0" x2="${vx + 40}" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".5" stop-color="#fff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-hexclip"><path transform="${P.hex.t}" d="${P.hex.d}"/></clipPath>
    <clipPath id="${id}-monoA"><path transform="${P.monoA.t}" d="${P.monoA.d}"/></clipPath>
    <filter id="${id}-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${hex === 'oro' ? `<path class="hex-fill" transform="${P.hex.t}" d="${P.hex.d}" fill="url(#${id}-metal)"/>` : ''}
  ${hex === 'negro' ? `<path class="hex-fill" transform="${P.hex.t}" d="${P.hex.d}" fill="#12171E"/>` : ''}
  <g clip-path="url(#${id}-hexclip)">
    <g class="hex-sheen"><rect x="${vx - 220}" y="${vy}" width="260" height="${vh}" fill="url(#${id}-sheen)"
          transform="skewX(-18)"/></g>
  </g>
  <path class="hex-line" transform="${P.hex.t}" d="${P.hex.d}" stroke="${lineColor}" stroke-width="5"
        stroke-linejoin="round" filter="url(#${id}-glow)"/>
  <g class="mono-b"><path transform="${P.monoB.t}" d="${P.monoB.d}" fill="${mono}"/></g>
  <g class="mono-a" clip-path="url(#${id}-monoA)">${lines}</g>
</svg>`;
}

export const GLITCH_LINES = P.glitch.length;
