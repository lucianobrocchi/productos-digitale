/* ------------------------------------------------------------------
   Guiones de los Reels. `len` en pulsos (0,5 s a 120 BPM).
   Pensados para verse sin sonido: el texto cuenta la historia completa
   y la música la empuja.
   ------------------------------------------------------------------ */

export const reels = [

/* -------------------------------------------------------------- R0
   Manifiesto: las frases salen del manual de identidad, casi literales. */
{
  id: 'r0-manifiesto', titulo: 'Manifiesto de marca', gx: 78,
  scenes: [
    { t: 'hook', len: 4, lines: ['No hace falta', 'experiencia.'], gold: [1], glitch: false },
    { t: 'hook', len: 4, lines: ['Ni un camino', 'recorrido.'], gold: [1], glitch: false },
    { t: 'hook', len: 6, lines: ['Lo que hace', 'falta es', 'método.'], gold: [2], e: 1 },
    { t: 'statement', len: 8, art: 'ideaSystem', e: 2,
      lines: ['Detectar un dolor.', 'Construir la oferta.', 'Venderla a quien', 'la está buscando.'], gold: [3] },
    { t: 'statement', len: 7, art: 'aiChip', e: 3,
      lines: ['La IA no reemplaza', 'el camino.', 'Lo acelera.'], gold: [2],
      sub: 'Lo que antes tomaba meses, hoy toma horas.' },
    { t: 'statement', len: 7, art: 'hexRoute', e: 3,
      lines: ['Desde la estrategia.', 'No desde el azar.'], gold: [1] },
    { t: 'logo', len: 12 },
  ],
},

/* -------------------------------------------------------------- R1 */
{
  id: 'r1-metodo', titulo: 'No te falta talento', gx: 84,
  scenes: [
    { t: 'hook', len: 4, lines: ['No te falta', 'talento.'], gold: [], glitch: false },
    { t: 'hook', len: 4, lines: ['Te falta', 'método.'], gold: [1] },
    { t: 'statement', len: 8, art: 'shortcut', lines: ['La mayoría no', 'fracasa por', 'no saber.'], gold: [2],
      sub: 'Fracasa por hacer los pasos en el orden equivocado.' },
    { t: 'list', len: 10, title: ['El orden', 'correcto'], items: ['Elegí un dolor', 'Validá la promesa',
      'Construí con IA', 'Armá la oferta', 'Un solo ángulo', 'Vendé todos los días'] },
    { t: 'cta', len: 7, lines: ['Guardalo y', 'empezá por', 'el paso 1.'], pill: 'Seguinos' },
    { t: 'logo', len: 10, tag: false },
  ],
},

/* -------------------------------------------------------------- R2 */
{
  id: 'r2-mentiras', titulo: '5 mentiras sobre vivir de Internet', gx: 88,
  scenes: [
    { t: 'hook', len: 6, kicker: 'Sin humo', lines: ['5 mentiras', 'sobre vivir', 'de Internet'], gold: [2] },
    { t: 'myth', len: 7, n: 1, mito: ['Necesitás miles', 'de seguidores.'],
      verdad: ['Con pocas personas', 'correctas alcanza.', 'Lo que falta es oferta.'] },
    { t: 'myth', len: 7, n: 2, mito: ['Tenés que ser', 'experto.'],
      verdad: ['Alcanza con ir dos pasos', 'adelante de quien', 'te lee.'] },
    { t: 'myth', len: 7, n: 3, mito: ['Ya es tarde,', 'está todo hecho.'],
      verdad: ['Está hecho en general.', 'No para tu caso', 'puntual.'] },
    { t: 'myth', len: 7, n: 4, mito: ['Con la IA', 'cualquiera lo hace.'],
      verdad: ['La IA acelera.', 'Sin criterio, produce', 'rápido lo que nadie compra.'] },
    { t: 'myth', len: 7, n: 5, mito: ['Primero la', 'plataforma perfecta.'],
      verdad: ['Tu primer producto', 'sale con un documento', 'y un link de pago.'] },
    { t: 'cta', len: 7, lines: ['Lo que te frena', 'no es el mercado.', 'Es el relato.'], pill: 'Guardalo' },
    { t: 'logo', len: 10, tag: false },
  ],
},

/* -------------------------------------------------------------- R3 */
{
  id: 'r3-seis-pasos', titulo: 'De cero a tu primer producto', gx: 82,
  scenes: [
    { t: 'hook', len: 6, kicker: 'El método', lines: ['De cero a tu', 'primer producto', 'digital'], gold: [2] },
    { t: 'step', len: 6, n: 1, of: 6, art: 'target', title: ['Elegí un dolor,', 'no un tema'],
      d: 'Un tema da likes. Un dolor da ventas.' },
    { t: 'step', len: 6, n: 2, of: 6, art: 'twoPaths', title: ['Validá antes', 'de producir'],
      d: 'Si nadie la quiere gratis, tampoco la va a querer paga.' },
    { t: 'step', len: 6, n: 3, of: 6, art: 'aiChip', title: ['Construí', 'con IA'],
      d: 'Estructura, guion y materiales en horas.' },
    { t: 'step', len: 6, n: 4, of: 6, art: 'asset', title: ['Armá una oferta,', 'no un archivo'],
      d: 'Nadie paga por un PDF. Pagan por un resultado.' },
    { t: 'step', len: 6, n: 5, of: 6, art: 'funnel', title: ['Contenido con', 'un solo ángulo'],
      d: 'Tres formatos, un mensaje. Repetido hasta que te asocien.' },
    { t: 'step', len: 6, n: 6, of: 6, art: 'income', title: ['Vendé todos', 'los días'], e: 3,
      d: 'Una oferta que no se menciona no existe.' },
    { t: 'cta', len: 7, lines: ['Tu primer producto', 'puede estar listo', 'esta semana.'], pill: 'Guardalo' },
    { t: 'logo', len: 10, tag: false },
  ],
},

/* -------------------------------------------------------------- R4 */
{
  id: 'r4-oferta', titulo: 'Oferta antes que audiencia', gx: 76,
  scenes: [
    { t: 'hook', len: 4, lines: ['No necesitás', 'audiencia.'], gold: [], glitch: false },
    { t: 'hook', len: 4, lines: ['Necesitás', 'oferta.'], gold: [1] },
    { t: 'stat', len: 8, kicker: 'Podés tener', num: 50000, caption: ['seguidores', 'y no facturar un peso.'] },
    { t: 'compare', len: 9, title: 'Los dos caminos',
      a: { h: 'Primero audiencia', items: ['Meses publicando sin rumbo', 'Likes que no se convierten', 'Una oferta al final, sin datos'] },
      b: { h: 'Primero oferta', items: ['Validás en una semana', 'Cada pieza empuja a un lugar', 'Vendés mientras crecés'] } },
    { t: 'statement', len: 6, art: 'funnel', lines: ['Primero la oferta.', 'Después, el ruido.'], gold: [1] },
    { t: 'cta', len: 7, lines: ['¿Qué venderías', 'esta semana?'], pill: 'Contanos', sub: 'Respondelo en comentarios.' },
    { t: 'logo', len: 10, tag: false },
  ],
},

/* -------------------------------------------------------------- R5 */
{
  id: 'r5-ia', titulo: 'La IA acelera, no reemplaza', gx: 86,
  scenes: [
    { t: 'hook', len: 4, lines: ['La IA no', 'reemplaza', 'el camino.'], gold: [], glitch: false, every: .67 },
    { t: 'hook', len: 4, lines: ['Lo', 'acelera.'], gold: [1] },
    { t: 'statement', len: 7, art: 'clock', lines: ['Lo que tomaba', 'meses, hoy', 'toma horas.'], gold: [2] },
    { t: 'list', len: 7, title: ['Usala para'], gold: [0], check: true, items: ['Investigar', 'Estructurar', 'Multiplicar'] },
    { t: 'statement', len: 7, art: 'mindset', lines: ['Pero qué vender', 'y a quién', 'sale de hablar', 'con gente real.'], gold: [3] },
    { t: 'cta', len: 7, lines: ['La IA te da', 'la velocidad.', 'El rumbo, vos.'], pill: 'Seguinos' },
    { t: 'logo', len: 10, tag: false },
  ],
},

/* -------------------------------------------------------------- R6 */
{
  id: 'r6-dolor', titulo: 'El dolor que la gente paga', gx: 80,
  scenes: [
    { t: 'hook', len: 4, lines: ['La gente no', 'compra temas.'], gold: [], glitch: false },
    { t: 'hook', len: 4, lines: ['Compra', 'salidas.'], gold: [1] },
    { t: 'list', len: 8, title: ['Dónde está', 'escrito el dolor'], items: ['Los comentarios de los grandes',
      'Las reseñas de 3 estrellas', 'Lo que ya te preguntan', 'El buscador, en crudo'] },
    { t: 'statement', len: 7, art: 'target', lines: ['Si tres personas', 'te preguntaron', 'lo mismo, hay', 'un producto ahí.'], gold: [3] },
    { t: 'cta', len: 7, lines: ['El mercado ya', 'te dijo qué quiere.', 'Leelo.'], pill: 'Guardalo' },
    { t: 'logo', len: 10, tag: false },
  ],
},
];
