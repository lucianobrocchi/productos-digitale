/* ------------------------------------------------------------------
   Copy de las piezas. Tono del manual: transparente y directo, sin humo,
   cercano, profesional y claro, motivador y firme. Español rioplatense.
   ------------------------------------------------------------------ */

export const HANDLE = '@productosdigitales';

/* ============================== CARRUSELES ============================== */

export const carousels = [

/* ---------------------------------------------------------------- C1 */
{
  id: 'c1-metodo',
  titulo: 'El método de 6 pasos',
  slides: [
    { t: 'cover', eyebrow: 'El método', h1: ['De cero a tu primer', 'producto digital'],
      lede: 'Seis pasos. Sin audiencia previa. Sin experiencia.', art: 'hexRoute', gx: '86%', gy: '88%' },

    { t: 'statement', h: ['No te falta talento.', 'Te falta <em>método</em>.'],
      lede: 'El 90% no fracasa por no saber. Fracasa por hacer los pasos en el orden equivocado.',
      art: 'shortcut' },

    { t: 'step', n: 1, titulo: 'Elegí un dolor, no un tema',
      d: 'Un tema da likes. Un dolor da ventas. Escribí el problema exacto que resolvés, con las palabras de quien lo sufre.',
      art: 'target' },

    { t: 'step', n: 2, titulo: 'Validá antes de producir',
      d: 'Vendé la promesa antes de grabar una sola clase. Si nadie la quiere gratis, tampoco la va a querer paga.',
      art: 'twoPaths' },

    { t: 'step', n: 3, titulo: 'Construí con IA, no sin ella',
      d: 'Estructura, guion y materiales en horas. La IA no inventa tu criterio: multiplica tu velocidad.',
      art: 'aiChip' },

    { t: 'step', n: 4, titulo: 'Armá una oferta, no un archivo',
      d: 'Nadie paga por un PDF. Pagan por un resultado con fecha, camino y prueba de que funciona.',
      art: 'asset' },

    { t: 'step', n: 5, titulo: 'Contenido con un solo ángulo',
      d: 'Tres formatos, un mensaje. Repetir el mismo ángulo hasta que te asocien a ese problema.',
      art: 'funnel' },

    { t: 'step', n: 6, titulo: 'Vendé todos los días',
      d: 'Una oferta que no se menciona no existe. La venta es una rutina, no un evento.',
      art: 'income' },

    { t: 'cta', h: ['Tu primer producto', 'puede estar listo', 'esta semana'],
      lede: 'Guardá este carrusel y empezá por el paso 1 hoy.',
      cta: 'Seguinos para el paso a paso', art: 'launch' },
  ],
},

/* ---------------------------------------------------------------- C2 */
{
  id: 'c2-mentiras',
  titulo: '5 mentiras que te frenan',
  slides: [
    { t: 'cover', eyebrow: 'Sin humo', h1: ['5 mentiras sobre', 'vivir de Internet'],
      lede: 'Las que más repiten. Y lo que pasa de verdad.', art: 'mindset', gx: '90%', gy: '18%' },

    { t: 'myth', n: 1, mito: 'Necesitás miles de seguidores',
      verdad: 'Con 300 personas correctas alcanza. Lo que falta casi nunca es audiencia: es oferta.',
      art: 'magnet' },

    { t: 'myth', n: 2, mito: 'Tenés que ser experto',
      verdad: 'Alcanza con ir dos pasos adelante de quien te lee. Nadie le pide un doctorado a su guía.',
      art: 'stairs' },

    { t: 'myth', n: 3, mito: 'Es tarde, ya está todo hecho',
      verdad: 'Está todo hecho en general y nada hecho para tu caso puntual. El nicho es el espacio.',
      art: 'target' },

    { t: 'myth', n: 4, mito: 'Con la IA cualquiera lo hace',
      verdad: 'La IA acelera el camino, no lo reemplaza. Sin criterio, produce más rápido lo que nadie compra.',
      art: 'aiChip' },

    { t: 'myth', n: 5, mito: 'Primero la plataforma perfecta',
      verdad: 'La herramienta no vende. Tu primer producto puede salir con un documento y un link de pago.',
      art: 'product' },

    { t: 'cta', h: ['Lo que te frena', 'no es el mercado.', 'Es el relato.'],
      lede: '¿Cuál de estas cinco te estabas creyendo? Contanos en comentarios.',
      cta: 'Guardalo para releerlo', art: 'shortcut' },
  ],
},

/* ---------------------------------------------------------------- C3 */
{
  id: 'c3-oferta',
  titulo: 'Oferta antes que audiencia',
  slides: [
    { t: 'cover', eyebrow: 'Prioridades', h1: ['No necesitás audiencia.', 'Necesitás oferta.'],
      lede: 'Por qué crecer primero es el error más caro.', art: 'twoPaths', gx: '12%', gy: '90%' },

    { t: 'statement', h: ['Audiencia sin oferta', 'es una <em>tribuna vacía</em>.'],
      lede: 'Podés juntar 50.000 seguidores y no facturar un peso. Pasa todos los días.',
      art: 'magnet' },

    { t: 'step', n: 1, titulo: 'La oferta ordena todo',
      d: 'Cuando sabés qué vendés y a quién, el contenido deja de ser azar: cada pieza empuja al mismo lugar.',
      art: 'funnel' },

    { t: 'step', n: 2, titulo: 'Se valida con 10 conversaciones',
      d: 'Diez charlas reales te dicen más que diez mil impresiones. Preguntá qué intentaron y qué falló.',
      art: 'target' },

    { t: 'step', n: 3, titulo: 'El precio es parte del mensaje',
      d: 'Un precio bajo no baja la objeción: la cambia. Cobrá por el resultado, no por las horas de video.',
      art: 'income' },

    { t: 'compare', titulo: 'Los dos caminos',
      a: { h: 'Empezar por audiencia', items: ['Meses publicando sin rumbo', 'Likes que no se convierten', 'Ofrecés algo al final, sin datos'] },
      b: { h: 'Empezar por oferta',   items: ['Validás en una semana', 'Cada pieza empuja a un lugar', 'Vendés mientras crecés'] } },

    { t: 'cta', h: ['Primero la oferta.', 'Después, el ruido.'],
      lede: 'Si tuvieras que vender algo esta semana, ¿qué sería?',
      cta: 'Respondelo en comentarios', art: 'asset' },
  ],
},

/* ---------------------------------------------------------------- C4 */
{
  id: 'c4-dolor',
  titulo: 'Encontrar el dolor que se paga',
  slides: [
    { t: 'cover', eyebrow: 'Investigación', h1: ['Encontrá el dolor', 'que la gente paga'],
      lede: 'Cuatro lugares donde ya está escrito lo que tenés que vender.', art: 'target', gx: '88%', gy: '92%' },

    { t: 'statement', h: ['La gente no compra temas.', 'Compra <em>salidas</em>.'],
      lede: 'Nadie busca “aprender marketing”. Buscan dejar de depender de un solo cliente.',
      art: 'shortcut' },

    { t: 'step', n: 1, titulo: 'Los comentarios de los grandes',
      d: 'Mirá qué preguntan debajo de las cuentas más grandes de tu tema. Ahí está el hueco que nadie llena.',
      art: 'funnel' },

    { t: 'step', n: 2, titulo: 'Las reseñas de 3 estrellas',
      d: 'Ni fans ni enojados: gente que explica con detalle qué le faltó. Es un brief gratis.',
      art: 'asset' },

    { t: 'step', n: 3, titulo: 'Lo que ya te preguntan a vos',
      d: 'Revisá tus mensajes. Si tres personas te preguntaron lo mismo, hay un producto ahí.',
      art: 'product' },

    { t: 'step', n: 4, titulo: 'El buscador, en crudo',
      d: 'Escribí tu tema y leé las sugerencias. Son las palabras exactas con las que se busca una salida.',
      art: 'mindset' },

    { t: 'cta', h: ['El mercado ya te', 'dijo qué quiere.', 'Solo hay que leerlo.'],
      lede: 'Dedicale 30 minutos hoy a uno de los cuatro lugares.',
      cta: 'Guardá el carrusel', art: 'growth' },
  ],
},

/* ---------------------------------------------------------------- C5 */
{
  id: 'c5-ia',
  titulo: 'La IA acelera, no reemplaza',
  slides: [
    { t: 'cover', eyebrow: 'Inteligencia artificial', h1: ['La IA no reemplaza', 'el camino. Lo acelera.'],
      lede: 'Lo que antes tomaba meses, hoy toma horas. El criterio sigue siendo tuyo.',
      art: 'aiChip', gx: '86%', gy: '14%' },

    { t: 'statement', h: ['Sin criterio, la IA', 'produce <em>más rápido</em>', 'lo que nadie compra.'],
      lede: 'La velocidad sin dirección es solo ruido en alta definición.', art: 'clock' },

    { t: 'step', n: 1, titulo: 'Usala para investigar',
      d: 'Resumí cien comentarios en cinco dolores concretos. El trabajo de una semana, en una tarde.',
      art: 'target' },

    { t: 'step', n: 2, titulo: 'Usala para estructurar',
      d: 'Del desorden al índice: módulos, orden lógico y qué va en cada clase.',
      art: 'hexRoute' },

    { t: 'step', n: 3, titulo: 'Usala para multiplicar',
      d: 'Una idea buena, quince piezas. Mismo ángulo, distintos formatos.',
      art: 'funnel' },

    { t: 'step', n: 4, titulo: 'No la uses para decidir',
      d: 'Qué vender, a quién y a qué precio sale de hablar con gente real. Eso no se delega.',
      art: 'mindset' },

    { t: 'cta', h: ['La IA te da', 'la velocidad.', 'El rumbo lo ponés vos.'],
      lede: '¿Para qué la estás usando hoy?',
      cta: 'Contanos en comentarios', art: 'launch' },
  ],
},
];

/* ============================== HISTORIAS ============================== */

export const stories = [
  { id: 's1', eyebrow: 'Recordatorio', h: ['No te falta', 'talento.', 'Te falta <em>método</em>.'],
    lede: 'El orden de los pasos define el resultado.', art: 'shortcut', gx: '82%', gy: '86%' },

  { id: 's2', eyebrow: 'Pregunta', h: ['¿Qué te', 'frena hoy?'],
    lede: 'Respondé con una palabra. Leemos todas.', art: 'mindset',
    cta: 'Deslizá hacia arriba', gx: '18%', gy: '82%' },

  { id: 's3', eyebrow: 'Dato', h: ['Con <em>300</em>', 'personas', 'correctas', 'alcanza.'],
    lede: 'La audiencia masiva es una consecuencia, no un requisito.', art: 'magnet', gx: '86%', gy: '20%' },

  { id: 's4', eyebrow: 'Hoy', h: ['Validá antes', 'de producir.'],
    lede: 'Si nadie la quiere gratis, tampoco la va a querer paga.', art: 'twoPaths', gx: '14%', gy: '88%' },

  { id: 's5', eyebrow: 'Nuevo carrusel', h: ['De cero a tu', 'primer producto', 'digital'],
    lede: 'Seis pasos, sin audiencia previa.', art: 'hexRoute',
    cta: 'Mirá el carrusel', gx: '88%', gy: '90%' },

  { id: 's6', eyebrow: 'Mentalidad', h: ['Fe en el', 'proceso.', '<em>Foco</em> en el', 'siguiente paso.'],
    lede: '', art: 'stairs', gx: '84%', gy: '84%' },
];

/* ============================== CUADRADAS ============================== */

export const squares = [
  { id: 'q1', quote: ['Un tema da likes.', 'Un <em>dolor</em> da ventas.'], art: 'target' },
  { id: 'q2', quote: ['Nadie paga por un PDF.', 'Pagan por un <em>resultado</em>.'], art: 'asset' },
  { id: 'q3', quote: ['La IA te da velocidad.', 'El <em>rumbo</em> lo ponés vos.'], art: 'aiChip' },
  { id: 'q4', quote: ['Audiencia sin oferta', 'es una <em>tribuna vacía</em>.'], art: 'magnet' },
  { id: 'q5', quote: ['Una oferta que no', 'se menciona', '<em>no existe</em>.'], art: 'income' },
];

/* ============================== PORTADAS 16:9 ============================== */

export const covers = [
  { id: 'p1', h1: ['Cómo crear tu', 'primer producto digital'], art: 'hexRoute', gx: '84%', gy: '92%' },
  { id: 'p2', h1: ['Oferta antes', 'que audiencia'],            art: 'twoPaths', gx: '88%', gy: '16%' },
  { id: 'p3', h1: ['Vender con', 'inteligencia artificial'],    art: 'aiChip',   gx: '86%', gy: '90%' },
  { id: 'p4', h1: ['El dolor que la', 'gente paga por resolver'], art: 'target', gx: '90%', gy: '20%' },
];
