/* ------------------------------------------------------------------
   Plan de publicación: cuatro semanas, qué pieza sale cada día y el
   texto del posteo listo para pegar. Tono del manual: directo, sin humo,
   cercano. Sin emojis de relleno: la marca es sobria.
   ------------------------------------------------------------------ */

const TAGS = {
  base: ['#productosdigitales', '#emprendimientodigital'],
  ia: ['#inteligenciaartificial', '#ia'],
  venta: ['#negociosonline', '#ventasonline'],
  contenido: ['#marketingdigital', '#creadoresdecontenido'],
};
const tags = (...k) => [...TAGS.base, ...k.flatMap(x => TAGS[x])].join(' ');

export const plan = [
  /* ------------------------------ semana 1 ------------------------------ */
  { semana: 1, dia: 'Lunes', tipo: 'Reel', pieza: 'video/reels/r0-manifiesto.mp4', titulo: 'Manifiesto',
    texto: `No hace falta experiencia. No hace falta un camino recorrido. Lo que hace falta es método.

Productos Digitales nace para mostrar que vender productos digitales no es suerte ni un secreto de pocos: es un sistema. Y con inteligencia artificial, lo que antes tomaba meses hoy toma horas.

Si arrancás de cero, este es tu lugar.`,
    tags: tags('ia'), historias: 'historia-s1 (animada) + encuesta: "¿Ya vendiste algo digital? Sí / Todavía no"' },

  { semana: 1, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/c1-metodo', titulo: 'El método de 6 pasos',
    texto: `De cero a tu primer producto digital, en seis pasos.

La mayoría no fracasa por no saber. Fracasa por hacer los pasos en el orden equivocado: produce antes de validar, publica antes de tener oferta.

Deslizá, guardalo y empezá hoy por el paso 1.`,
    tags: tags('venta'), historias: 'historia-s5 (animada) llevando al carrusel' },

  { semana: 1, dia: 'Viernes', tipo: 'Reel', pieza: 'video/reels/r1-metodo.mp4', titulo: 'No te falta talento',
    texto: `No te falta talento. Te falta el orden.

1. Elegí un dolor, no un tema
2. Validá antes de producir
3. Construí con IA
4. Armá una oferta, no un archivo
5. Contenido con un solo ángulo
6. Vendé todos los días

Guardalo para cuando lo necesites.`,
    tags: tags('contenido'), historias: 'historia-s2: caja de preguntas "¿Qué te frena hoy?"' },

  /* ------------------------------ semana 2 ------------------------------ */
  { semana: 2, dia: 'Lunes', tipo: 'Reel', pieza: 'video/reels/r2-mentiras.mp4', titulo: '5 mentiras',
    texto: `Cinco ideas que frenan a casi todos los que quieren vivir de Internet.

Ninguna es un problema de mercado. Son problemas de relato: lo que te contaron sobre cómo funciona esto.

¿Cuál de las cinco te estabas creyendo? Contanos en comentarios.`,
    tags: tags('venta') },

  { semana: 2, dia: 'Miércoles', tipo: 'Cuadrada', pieza: 'cuadradas/q1.png', titulo: 'Un dolor da ventas',
    texto: `Un tema da likes. Un dolor da ventas.

"Marketing" es un tema. "No sé qué publicar y no me escribe nadie" es un dolor. Escribí el problema con las palabras exactas de quien lo sufre y tu oferta se escribe sola.`,
    tags: tags('contenido'), historias: 'historia-s3 (animada)' },

  { semana: 2, dia: 'Viernes', tipo: 'Carrusel', pieza: 'carruseles/c2-mentiras', titulo: '5 mentiras (carrusel)',
    texto: `Las cinco mentiras más repetidas sobre vivir de Internet, y lo que pasa de verdad.

Guardalo para releerlo el día que dudes.`,
    tags: tags('venta') },

  /* ------------------------------ semana 3 ------------------------------ */
  { semana: 3, dia: 'Lunes', tipo: 'Reel', pieza: 'video/reels/r4-oferta.mp4', titulo: 'Oferta antes que audiencia',
    texto: `Podés tener 50.000 seguidores y no facturar un peso. Pasa todos los días.

Audiencia sin oferta es una tribuna vacía. Primero definí qué vendés y a quién; después cada pieza de contenido empuja al mismo lugar.

Si tuvieras que vender algo esta semana, ¿qué sería?`,
    tags: tags('venta'), historias: 'historia-s4 (animada)' },

  { semana: 3, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/c3-oferta', titulo: 'Oferta antes que audiencia',
    texto: `No necesitás audiencia. Necesitás oferta.

Diez conversaciones reales te dicen más que diez mil impresiones. Deslizá para ver los dos caminos y por qué uno te hace vender mientras crecés.`,
    tags: tags('venta') },

  { semana: 3, dia: 'Jueves', tipo: 'Cuadrada', pieza: 'cuadradas/q4.png', titulo: 'Tribuna vacía',
    texto: `Audiencia sin oferta es una tribuna vacía.

Primero la oferta. Después, el ruido.`,
    tags: tags('contenido') },

  { semana: 3, dia: 'Viernes', tipo: 'Reel', pieza: 'video/reels/r5-ia.mp4', titulo: 'La IA acelera',
    texto: `La IA no reemplaza el camino. Lo acelera.

Usala para investigar, para estructurar y para multiplicar una buena idea en quince piezas.

Lo que no se delega: qué vender, a quién y a qué precio. Eso sale de hablar con gente real.`,
    tags: tags('ia') },

  /* ------------------------------ semana 4 ------------------------------ */
  { semana: 4, dia: 'Lunes', tipo: 'Carrusel', pieza: 'carruseles/c5-ia', titulo: 'La IA acelera (carrusel)',
    texto: `Sin criterio, la IA produce más rápido lo que nadie compra.

Deslizá para ver para qué sí y para qué no usarla cuando armás tu producto digital.`,
    tags: tags('ia'), historias: 'historia-s6 (animada)' },

  { semana: 4, dia: 'Martes', tipo: 'Reel', pieza: 'video/reels/r6-dolor.mp4', titulo: 'El dolor que se paga',
    texto: `La gente no compra temas. Compra salidas.

El dolor que paga ya está escrito: en los comentarios de las cuentas grandes, en las reseñas de 3 estrellas, en tus propios mensajes y en el buscador.

Dedicale 30 minutos hoy a uno de los cuatro.`,
    tags: tags('venta') },

  { semana: 4, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/c4-dolor', titulo: 'Encontrá el dolor',
    texto: `Encontrá el dolor que la gente paga por resolver.

Cuatro lugares donde ya está escrito lo que tenés que vender. Guardalo y usalo como checklist.`,
    tags: tags('venta', 'contenido') },

  { semana: 4, dia: 'Jueves', tipo: 'Cuadrada', pieza: 'cuadradas/q2.png', titulo: 'Nadie paga por un PDF',
    texto: `Nadie paga por un PDF. Pagan por un resultado.

Con fecha, con camino y con prueba de que funciona. Eso es una oferta.`,
    tags: tags('venta') },

  { semana: 4, dia: 'Viernes', tipo: 'Reel', pieza: 'video/reels/r3-seis-pasos.mp4', titulo: 'De cero a tu primer producto',
    texto: `De cero a tu primer producto digital. Seis pasos, sin audiencia previa y sin experiencia.

Tu primer producto puede estar listo esta semana. Guardalo y seguinos para el paso a paso.`,
    tags: tags('ia', 'venta') },
];

export const notas = [
  'Horario: probá dos franjas (12 a 13 h y 19 a 21 h) las dos primeras semanas y quedate con la que mejor rinda en las estadísticas de la cuenta.',
  'Los Reels llevan audio propio: subilos con su sonido original. Si se usa un audio en tendencia, bajá la música del video al 20% en el editor de Instagram.',
  'Cuadradas q3 y q5 quedan de reserva para cubrir un día o responder un comentario frecuente.',
  'Historias animadas: publicalas el mismo día que el posteo que acompañan, con el sticker de enlace al posteo.',
];
