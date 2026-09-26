/* ------------------------------------------------------------------
   Galería de íconos del Manual de Identidad (p. 26), redibujada en vector.

   Se tomó de una foto de la página: los 20 íconos, en el mismo orden y con
   la misma mezcla del original (unos llenos, otros de línea). Cada ícono
   vive en una caja de 100 × 100 y usa `currentColor`, así el mismo dibujo
   sale en tinta sobre claro (como en el manual) o en oro sobre negro
   (el estilo de las piezas). Los calados (la cruz del pin, el signo $ de la
   bolsa, el círculo de la casa) son huecos reales, hechos con máscara:
   dejan ver el fondo que haya detrás.
   ------------------------------------------------------------------ */

const L = (d, w = 4.5) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const F = d => `<path d="${d}" fill="currentColor"/>`;
/* forma llena con calados: `holes` se dibuja en negro dentro de la máscara */
const M = (uid, shapes, holes) => `<mask id="${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
    <rect width="100" height="100" fill="#fff"/>${holes}</mask><g mask="url(#${uid})" fill="currentColor">${shapes}</g>`;
const person = (x, y, s = 1) => `<circle cx="${x}" cy="${y - 8 * s}" r="${5.4 * s}" fill="currentColor"/>
  <path d="M${x - 10 * s} ${y + 9 * s} v-2 a${10 * s} ${9 * s} 0 0 1 ${20 * s} 0 v2 Z" fill="currentColor"/>`;

function gear(cx, cy, R, r, n, hole) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, tw = Math.PI / n * .46, bw = Math.PI / n * .7;
    const p = (ang, rad) => `${(cx + rad * Math.cos(ang)).toFixed(2)} ${(cy + rad * Math.sin(ang)).toFixed(2)}`;
    d += `${i ? 'L' : 'M'}${p(a - bw, r)} L${p(a - tw, R)} A${R} ${R} 0 0 1 ${p(a + tw, R)} L${p(a + bw, r)} A${r} ${r} 0 0 1 ${p(a + Math.PI * 2 / n - bw, r)} `;
  }
  d += 'Z';
  if (hole) d += ` M${cx + hole} ${cy} A${hole} ${hole} 0 1 0 ${cx - hole} ${cy} A${hole} ${hole} 0 1 0 ${cx + hole} ${cy} Z`;
  return d;
}

export const ICONOS_MANUAL = [
  { key: 'maletin', nombre: 'Maletín', svg: () =>
    `<rect x="15" y="34" width="70" height="47" rx="8" fill="currentColor"/>${L('M38 34 V27 a5 5 0 0 1 5 -5 h14 a5 5 0 0 1 5 5 V34', 5)}` },

  { key: 'servicio', nombre: 'Servicio', svg: () => L(
    'M42 44 V30 A12 12 0 0 1 40 7.5 V16 H50 V7.5 A12 12 0 0 1 48 30 V44 ' +          // llave
    'M24 46 H64 a5.5 5.5 0 0 1 0 11 H62 ' +                                            // pulgar
    'M62 57 h7 a5.5 5.5 0 0 1 0 11 h-7 M62 68 h6 a5 5 0 0 1 0 10 h-6 M62 78 h4 a4.5 4.5 0 0 1 0 9 H34 ' + // dedos
    'M34 46 V87 M34 87 L24 90', 4.4) },
  { key: 'piramide', nombre: 'Pirámide', svg: () => {
    const b = t => `M${50 - 32 * t} ${16 + 56 * t} L50 ${16 + 68 * t} L${50 + 32 * t} ${16 + 56 * t}`;
    return L(`M50 16 L18 72 L50 84 L82 72 Z M50 16 V84 ${b(.42)} ${b(.66)}`, 4.2);
  } },

  { key: 'ubicacion', nombre: 'Ubicación', svg: uid => M(uid,
    `<path d="M50 6 a26 26 0 0 1 26 26 c0 16 -15 27 -26 50 c-11 -23 -26 -34 -26 -50 a26 26 0 0 1 26 -26 Z"/>
     <ellipse cx="50" cy="82" rx="37" ry="12"/>`,
    `<path d="M44.5 17 h11 v9 h9 v11 h-9 v9 h-11 v-9 h-9 v-11 h9 Z" fill="none" stroke="#000" stroke-width="3.8" stroke-linejoin="round"/>
     <path d="M35 70 L50 88 L65 70" fill="none" stroke="#000" stroke-width="4.5"/>`) },
  { key: 'comunidad', nombre: 'Comunidad', svg: () => `${person(50, 19, 1.15)}${person(19, 62, 1.15)}${person(81, 62, 1.15)}
    ${L('M35 18 A34 34 0 0 0 19 40 M65 18 A34 34 0 0 1 81 40 M30 84 A36 36 0 0 0 70 84', 4)}
    <path d="${gear(50, 51, 11, 7.5, 8, 3.8)}" fill="currentColor" fill-rule="evenodd"/>` },
  { key: 'engranaje', nombre: 'Engranaje', svg: () =>
    `<path d="${gear(50, 50, 36, 27, 8, 13)}" fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>` },

  { key: 'trabajo-online', nombre: 'Trabajo online', svg: () => `
    <circle cx="36" cy="24" r="8.5" fill="currentColor"/>
    ${F('M24 70 V47 a13 13 0 0 1 13 -13 h1 a8 8 0 0 1 7 4 L54 52 H66 a3.5 3.5 0 0 1 0 7 H47 V63 H38 V70 Z')}
    ${L('M52 64 H76 L84 40', 5)}
    <rect x="14" y="70" width="72" height="8" rx="2" fill="currentColor"/>` },
  { key: 'laboratorio', nombre: 'Laboratorio', svg: () => L(
    'M31 30 V12 H68 V19 ' +
    'M23 30 H39 V38 H23 Z M19 46 H43 M25 38 V46 M37 38 V46 M24 46 L17 86 M38 46 L45 86 M21 64 H41 ' +
    'M55 19 H81 L75 27 H61 Z M63 27 V38 H73 V27 M68 60 L58 86 M68 60 L78 86', 6) +
    `<circle cx="68" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="6"/>` },
  { key: 'consultas', nombre: 'Consultas', svg: () => L(
    'M26 70 A28 28 0 0 1 16 48 V44 A26 26 0 0 1 42 18 H58 A26 26 0 0 1 84 44 V52 A26 26 0 0 1 58 78 H16 Z', 4.8) +
    L('M42 56 V52 M50 56 V47 M58 56 V42', 4.6) },
  { key: 'diagnostico', nombre: 'Diagnóstico', svg: () => L(
    'M28 10 c-5 1 -7 4 -7 9 V36 a18 18 0 0 0 36 0 V19 c0 -5 -2 -8 -7 -9 ' +
    'M39 54 V67 a15 15 0 0 0 30 0 V59', 5.2) +
    `<circle cx="69" cy="51" r="7.5" fill="none" stroke="currentColor" stroke-width="5.2"/>` },
  { key: 'formacion', nombre: 'Formación', svg: () =>
    F('M50 24 L88 40 L50 56 L12 40 Z') + F('M28 49 L50 58 L72 49 V63 C72 70 62 75 50 75 C38 75 28 70 28 63 Z') +
    L('M19 43 V66', 3.6) + `<rect x="16" y="64" width="6" height="11" rx="1.5" fill="currentColor"/>` },

  { key: 'producto', nombre: 'Producto', svg: () =>
    F('M22 40 L50 28 L78 40 L50 52 Z') +
    L('M22 40 L50 28 L40 16 L12 29 Z M50 28 L78 40 L88 29 L60 16 Z M22 40 L50 52 L41 63 L12 51 Z M50 52 L78 40 L88 51 L59 63 Z ' +
      'M22 44 V70 L50 84 L78 70 V44 M50 56 V84', 3.8) },

  { key: 'atencion', nombre: 'Atención', svg: () => `
    <rect x="14" y="30" width="32" height="24" rx="3" fill="currentColor"/><rect x="27" y="53" width="6" height="7" fill="currentColor"/>
    <circle cx="68" cy="25" r="10" fill="currentColor"/>
    ${F('M51 60 V52 a17 16 0 0 1 34 0 V60 Z')}
    ${F('M12 60 H88 V75 H12 Z')}` },
  { key: 'equipo', nombre: 'Equipo', svg: () => {
    const arm = a => `<g transform="rotate(${a} 50 50)">
      <rect x="40" y="3" width="20" height="10" rx="3.5" fill="none" stroke="currentColor" stroke-width="3.4"/>
      ${L('M43 13 L45 27 M57 13 L55 27', 3.4)}</g>`;
    return [45, 135, 225, 315].map(arm).join('') +
      `<rect x="33" y="40" width="34" height="20" rx="9" transform="rotate(-32 50 50)" fill="none" stroke="currentColor" stroke-width="3.2"/>
       <rect x="33" y="40" width="34" height="20" rx="9" transform="rotate(32 50 50)" fill="none" stroke="currentColor" stroke-width="3.2"/>` +
      L('M41 47 L57 39 M42 53 L60 45 M45 58 L62 51', 2.6);
  } },
  { key: 'crecimiento', nombre: 'Crecimiento', svg: () => `
    <rect x="16" y="48" width="18" height="36" rx="9" fill="currentColor"/>
    <rect x="41" y="38" width="18" height="46" rx="9" fill="currentColor"/>
    <rect x="66" y="48" width="18" height="36" rx="9" fill="currentColor"/>
    ${L('M25 34 L50 16 L75 34', 4.4)}
    <circle cx="25" cy="34" r="5.5" fill="currentColor"/><circle cx="50" cy="16" r="5.5" fill="currentColor"/><circle cx="75" cy="34" r="5.5" fill="currentColor"/>` },
  { key: 'progreso', nombre: 'Progreso', svg: () => L('M22 72 L40 44 L57 70 L76 42', 7) +
    [[22, 72], [40, 44], [57, 70], [76, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8.5" fill="currentColor"/>`).join('') },

  { key: 'guias', nombre: 'Guías', svg: uid => L('M17 34 V80 H47 M83 34 V80 H53', 3.4) +
    M(uid, '<path d="M22 27 Q36 25 47 31 V77 Q36 71 22 73 Z"/><path d="M53 31 Q64 25 78 27 V73 Q64 71 53 77 Z"/>',
      '<path d="M65 26 H72 V41 L68.5 37 L65 41 Z" fill="#000"/>') },

  { key: 'ventas', nombre: 'Ventas', svg: uid => M(uid,
    `<path d="M50 40 C30 40 17 60 19 72 C20 81 30 86 50 86 C70 86 80 81 81 72 C83 60 70 40 50 40 Z"/>
     <rect x="39" y="31" width="22" height="7" rx="3"/>
     <path d="M36 17 Q43 22 50 18 Q57 22 64 17 L60 28 H40 Z"/>`,
    `<path d="M57.5 56 C55 51 43 51 43 57.5 C43 64 57.5 61.5 57.5 68.5 C57.5 75 45 75 42.5 70.5 M50 48.5 V53 M50 74 V78.5"
       fill="none" stroke="#000" stroke-width="4.2" stroke-linecap="round"/>`) },

  { key: 'hogar-salud', nombre: 'Hogar y salud', svg: uid => M(uid,
    '<path d="M50 14 L80 34 V86 H20 V34 Z"/>',
    '<circle cx="50" cy="58" r="17" fill="#000"/>') +
    F('M46.5 48 h7 v6.5 h6.5 v7 h-6.5 v6.5 h-7 v-6.5 h-6.5 v-7 h6.5 Z') },

  { key: 'bienestar', nombre: 'Bienestar', svg: () =>
    L('M50 82 L20 52 A16 16 0 0 1 50 30 A16 16 0 0 1 80 52 Z', 5) + L('M50 45 V63 M41 54 H59', 5) },
];
