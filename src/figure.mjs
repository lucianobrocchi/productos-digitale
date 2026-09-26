/* ------------------------------------------------------------------
   Personaje de los relatos: un pictograma dorado, sin cara ni género,
   para que cualquiera se vea ahí. Se dibuja por articulaciones (cabeza,
   cuello, cadera, codos, manos, rodillas, pies), así cada pose es solo
   una lista de puntos. Mismo viewBox y misma luz que las ilustraciones.
   ------------------------------------------------------------------ */
import { hexPath } from './illus.mjs';

/* poses: [x,y] por articulación. h=cabeza n=cuello p=cadera
   e/h = codo/mano, k/f = rodilla/pie, L/R = izquierda/derecha del dibujo */
const POSES = {
  parado: { h: [200, 92], n: [200, 142], p: [200, 250],
    eL: [172, 198], hL: [166, 248], eR: [228, 198], hR: [234, 248],
    kL: [186, 304], fL: [180, 360], kR: [214, 304], fR: [220, 360] },
  pensando: { h: [200, 92], n: [200, 142], p: [200, 250],
    eL: [172, 198], hL: [166, 248], eR: [242, 204], hR: [214, 132],
    kL: [186, 304], fL: [180, 360], kR: [214, 304], fR: [220, 360] },
  celular: { h: [196, 96], n: [200, 144], p: [200, 250],
    eL: [172, 198], hL: [166, 248], eR: [238, 206], hR: [226, 166],
    kL: [186, 304], fL: [180, 360], kR: [214, 304], fR: [220, 360] },
  camina: { h: [204, 92], n: [202, 142], p: [196, 250],
    eL: [186, 198], hL: [168, 240], eR: [220, 194], hR: [240, 232],
    kL: [224, 300], fL: [244, 356], kR: [178, 306], fR: [156, 350] },
  festeja: { h: [200, 96], n: [200, 144], p: [200, 250],
    eL: [166, 118], hL: [146, 70], eR: [234, 118], hR: [254, 70],
    kL: [182, 304], fL: [170, 360], kR: [218, 304], fR: [230, 360] },
  duda: { h: [200, 94], n: [200, 144], p: [200, 250],
    eL: [158, 186], hL: [126, 164], eR: [242, 186], hR: [274, 164],
    kL: [186, 304], fL: [180, 360], kR: [214, 304], fR: [220, 360] },
  cansado: { h: [212, 118], n: [204, 160], p: [200, 256],
    eL: [184, 212], hL: [190, 262], eR: [222, 212], hR: [226, 262],
    kL: [188, 308], fL: [182, 360], kR: [214, 308], fR: [220, 360] },
  sube: { h: [230, 70], n: [222, 118], p: [204, 214],
    eL: [198, 166], hL: [186, 206], eR: [246, 160], hR: [266, 192],
    kL: [248, 230], fL: [254, 272], kR: [194, 268], fR: [182, 316] },
  compu: { h: [214, 104], n: [208, 152], p: [184, 252],
    eL: [236, 206], hL: [282, 214], eR: [244, 204], hR: [290, 208],
    kL: [256, 258], fL: [258, 340], kR: [250, 262], fR: [252, 340] },
};

/* objetos que acompañan a algunas poses */
const PROPS = {
  celular: `<rect x="212" y="138" width="26" height="42" rx="6" fill="rgba(14,14,14,.9)" stroke-width="5"/>
            <path d="M219 146 h12" stroke-width="3" opacity=".6"/>`,
  duda: `<path d="M252 44 c0 -18 30 -18 30 0 c0 12 -15 12 -15 26" stroke-width="7" fill="none"/>
         <circle cx="267" cy="86" r="4.5" stroke="none" fill="url(#fg-G)"/>`,
  festeja: `<path d="M110 70 l-16 -10 M104 100 l-20 0 M290 70 l16 -10 M296 100 l20 0 M200 32 v-18"
            stroke-width="5" opacity=".7"/>`,
  cansado: `<path d="M252 70 h16 l-16 18 h16 M278 44 h11 l-11 12 h11" stroke-width="4" opacity=".6"/>`,
  sube: `<path d="M96 362 h64 v-44 h64 v-44 h64 v-44 h64" stroke-width="6" opacity=".55"/>`,
  compu: `<path d="M154 262 h66 M160 262 l-6 98 M214 262 v98" stroke-width="7" opacity=".55"/>
          <path d="M270 222 h120 M372 222 v138" stroke-width="7" opacity=".55"/>
          <path d="M290 220 l24 -64 h58 l-18 64Z" fill="rgba(240,226,129,.10)" stroke-width="6"/>
          <path d="${hexPath(334, 188, 11, .2)}" stroke="none" fill="url(#fg-G)"/>`,
  pensando: `<circle cx="262" cy="60" r="5" stroke="none" fill="url(#fg-G)" opacity=".7"/>
             <circle cx="280" cy="40" r="8" stroke="none" fill="url(#fg-G)" opacity=".85"/>`,
};

/**
 * @param pose  nombre de la pose
 * @param id    prefijo único
 * @param tono  'oro' (protagonista) | 'apagado' (el otro camino, el "antes")
 */
export function figure(pose = 'parado', id = 'f', { tono = 'oro', halo = true } = {}) {
  const P = POSES[pose] || POSES.parado;
  const G = `fg-${id}`;
  const seg = (a, b, w) => `<path class="fg-seg" d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke-width="${w}"/>`;
  const limb = (a, b, c, w = 20) => `<path class="fg-seg" d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}" stroke-width="${w}"/>`;
  // gris sólido: con alfa, los trazos se suman en las articulaciones y quedan manchas
  const stroke = tono === 'oro' ? `url(#${G})` : '#57544D';
  const props = (PROPS[pose] || '').replaceAll('fg-G', G);
  return `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="fig fig-${pose}">
  <defs>
    <linearGradient id="${G}" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="280" y2="380">
      <stop offset="0" stop-color="#F6EFB4"/><stop offset=".5" stop-color="#E4C66A"/><stop offset="1" stop-color="#A37B3C"/>
    </linearGradient>
    <radialGradient id="${G}-h" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#F0E281" stop-opacity=".26"/><stop offset="1" stop-color="#A37B3C" stop-opacity="0"/>
    </radialGradient>
    <filter id="${G}-g" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${tono === 'oro' ? 8 : 0}" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${halo && tono === 'oro' ? `<circle cx="200" cy="210" r="190" fill="url(#${G}-h)"/>` : ''}
  ${['sube', 'compu'].includes(pose) ? '' : `<path d="M130 372 h140" stroke="${tono === 'oro' ? 'rgba(240,226,129,.35)' : 'rgba(242,242,242,.14)'}"
        stroke-width="4" stroke-linecap="round"/>`}
  <g stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" filter="url(#${G}-g)">
    ${props}
    ${limb(P.p, P.kL, P.fL, 22)}${limb(P.p, P.kR, P.fR, 22)}
    ${seg(P.n, P.p, 30)}
    ${limb(P.n, P.eL, P.hL, 18)}${limb(P.n, P.eR, P.hR, 18)}
    <circle class="fg-head" cx="${P.h[0]}" cy="${P.h[1]}" r="30" fill="${stroke}" stroke="none"/>
  </g>
</svg>`;
}

export const POSE_NAMES = Object.keys(POSES);
