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
  /* ------------------------ semanas 5 a 8: clases ------------------------
     Cada clase sale dos veces, separada: el Reel busca alcance y el
     carrusel busca guardados. La versión 16:9 va a YouTube el mismo día. */
  { semana: 5, dia: 'Lunes', tipo: 'Reel', pieza: 'video/clases/k1-economia-digital.mp4', titulo: 'La nueva economía digital',
    texto: `Lo que sabés ya se puede vender.

Cinco claves de la nueva economía digital: se hace una vez y se vende muchas, la IA bajó el costo de crear, no competís con todo Internet, lo que sabés vale para alguien y lo que no cambió: la gente paga por un resultado.

La oportunidad es real. El atajo, no. ¿Qué sabés vos que otro necesita?`,
    tags: tags('ia'), youtube: 'video/clases/k1-economia-digital-16x9.mp4' },
  { semana: 5, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/k3-principios-marketing', titulo: '7 principios (carrusel)',
    texto: `Los 7 principios del marketing digital, para tener a mano.

La placa 9 los junta todos en una pantalla. Guardalo y usalo antes de publicar.`,
    tags: tags('contenido') },
  { semana: 5, dia: 'Viernes', tipo: 'Reel', pieza: 'video/clases/k2-mentalidad.mp4', titulo: 'Mentalidad para arrancar de cero',
    texto: `El que arranca de cero no pierde por falta de talento. Pierde por abandonar.

Seis ideas para sostener el proceso cuando todavía no hay resultados. La última es la más importante: un paso por vez.

Fe en el proceso, foco en el paso.`,
    tags: tags('contenido'), youtube: 'video/clases/k2-mentalidad-16x9.mp4' },

  { semana: 6, dia: 'Lunes', tipo: 'Reel', pieza: 'video/clases/k3-principios-marketing.mp4', titulo: '7 principios del marketing digital',
    texto: `7 principios del marketing digital, sin humo.

Un dolor. Una persona. Una promesa. Prueba. Un ángulo. Orgánico para confiar y anuncios para escalar. Y siempre un próximo paso.

Guardalo y usalo en tu próxima publicación.`,
    tags: tags('contenido'), youtube: 'video/clases/k3-principios-marketing-16x9.mp4' },
  { semana: 6, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/k1-economia-digital', titulo: 'La nueva economía digital (carrusel)',
    texto: `La nueva economía digital en nueve placas.

Guardalo y releelo antes de decidir qué vas a vender.`,
    tags: tags('ia') },
  { semana: 6, dia: 'Viernes', tipo: 'Reel', pieza: 'video/clases/k4-oferta.mp4', titulo: 'La oferta que se vende',
    texto: `Nadie compra tu curso. Compran tu oferta.

La frase para escribir la tuya:
Ayudo a [quién] a [resultado] en [tiempo] sin [lo que temen].

Escribí la tuya en comentarios.`,
    tags: tags('venta'), youtube: 'video/clases/k4-oferta-16x9.mp4' },

  { semana: 7, dia: 'Lunes', tipo: 'Reel', pieza: 'video/clases/k5-plan-30-dias.mp4', titulo: 'Un plan de 30 días',
    texto: `De idea a primera venta: un plan de 30 días.

Semana 1, investigar. Semana 2, validar. Semana 3, construir. Semana 4, vender.

No es una promesa: es un orden. Guardalo y arrancá el lunes.`,
    tags: tags('venta'), youtube: 'video/clases/k5-plan-30-dias-16x9.mp4' },
  { semana: 7, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/k2-mentalidad', titulo: 'Mentalidad (carrusel)',
    texto: `Mentalidad para arrancar de cero, en un carrusel.

Guardalo para el día que tengas ganas de largar.`,
    tags: tags('contenido') },
  { semana: 7, dia: 'Viernes', tipo: 'Reel', pieza: 'video/clases/k6-prompts-ia.mp4', titulo: '5 prompts de IA',
    texto: `5 prompts para crear tu producto con IA: para encontrar el dolor, definir la promesa, estructurar, guionar y crear contenido.

Copialos, pero revisá todo lo que te devuelve. La IA acelera; el criterio lo ponés vos.`,
    tags: tags('ia'), youtube: 'video/clases/k6-prompts-ia-16x9.mp4' },

  { semana: 8, dia: 'Lunes', tipo: 'Carrusel', pieza: 'carruseles/k4-oferta', titulo: 'La oferta que se vende (carrusel)',
    texto: `La oferta que se vende: la fórmula, qué tiene que incluir, cómo pensar el precio y cómo sacarle el riesgo a la primera compra.

Guardalo para cuando armes la tuya.`,
    tags: tags('venta') },
  { semana: 8, dia: 'Miércoles', tipo: 'Carrusel', pieza: 'carruseles/k5-plan-30-dias', titulo: 'El plan de 30 días (carrusel)',
    texto: `El plan de 30 días, semana por semana.

Guardalo y marcá en qué semana estás.`,
    tags: tags('venta') },
  { semana: 8, dia: 'Viernes', tipo: 'Carrusel', pieza: 'carruseles/k6-prompts-ia', titulo: '5 prompts de IA (carrusel)',
    texto: `Los 5 prompts completos, listos para copiar.

Guardalo y probalos esta semana.`,
    tags: tags('ia') },
  /* --------------------- semanas 9 y 10: relatos ---------------------
     Buscan alcance: la historia está en el video, el texto acompaña corto. */
  { semana: 9, dia: 'Lunes', tipo: 'Reel', pieza: 'video/relatos/h2-origen.mp4', titulo: 'Por qué existe Productos Digitales',
    texto: `Nos dijeron que para vivir de Internet hacía falta suerte. O un secreto. O años de experiencia.

Lo que hace falta es método. Por eso existimos.`, tags: tags('ia') },
  { semana: 9, dia: 'Martes', tipo: 'Reel', pieza: 'video/relatos/h5-tres-segundos.mp4', titulo: 'Tenés 3 segundos',
    texto: `Tres ganchos para tu próximo video. Si llegaste hasta acá, funcionó.

Guardalo para cuando grabes.`, tags: tags('contenido') },
  { semana: 9, dia: 'Miércoles', tipo: 'Reel', pieza: 'video/relatos/h1-dos-personas.mp4', titulo: 'Dos personas, el mismo día',
    texto: `Dos personas arrancan el mismo día, con la misma idea. Una graba primero. La otra pregunta primero.

No fue el talento: fue el orden. ¿Vos cuál de los dos sos hoy?`, tags: tags('venta') },
  { semana: 9, dia: 'Jueves', tipo: 'Reel', pieza: 'video/relatos/h6-pov-familia.mp4', titulo: 'POV: le explicás a tu familia',
    texto: `POV: le explicás a tu familia a qué te dedicás.

Mandáselo a ese tío. Vos sabés cuál.`, tags: tags('contenido') },
  { semana: 9, dia: 'Viernes', tipo: 'Reel', pieza: 'video/relatos/h3-idea-hace-meses.mp4', titulo: 'Tenés una idea hace meses',
    texto: `Tenés una idea hace meses y todos los días aparece una razón para no empezar.

El problema no es la idea: es el orden. Hoy puede ser el día 1.`, tags: tags('venta') },
  { semana: 10, dia: 'Lunes', tipo: 'Reel', pieza: 'video/relatos/h4-seis-meses.mp4', titulo: 'Seis meses grabando un curso',
    texto: `Seis meses grabando un curso para lanzarlo al silencio. Pasa todo el tiempo.

Antes de grabar un minuto: 10 conversaciones. Guardalo antes de tus seis meses.`, tags: tags('venta') },
  { semana: 10, dia: 'Miércoles', tipo: 'Reel', pieza: 'video/relatos/h7-30-dias.mp4', titulo: '30 días en 20 segundos',
    texto: `30 días en 20 segundos. No es magia: es un orden.

Guardalo. Mañana puede ser el día 1.`, tags: tags('ia', 'venta') },
  { semana: 10, dia: 'Viernes', tipo: 'Reel', pieza: 'video/relatos/h8-nadie-te-dice.mp4', titulo: 'Nadie te va a decir esto',
    texto: `Cinco verdades sin humo sobre vender productos digitales.

¿Cuál te dolió más? Contanos.`, tags: tags('contenido') },
];

export const notas = [
  'Semanas 9 y 10: los Relatos. Buscan alcance, así que el texto va corto y la historia la cuenta el video. Terminan en loop: no los cortes antes.',
  'Semanas 5 a 8: las clases. Cada una tiene su versión 16:9 para YouTube (y su miniatura): subila el mismo día que el Reel.',
  'Horario: probá dos franjas (12 a 13 h y 19 a 21 h) las dos primeras semanas y quedate con la que mejor rinda en las estadísticas de la cuenta.',
  'Los Reels llevan audio propio: subilos con su sonido original. Si se usa un audio en tendencia, bajá la música del video al 20% en el editor de Instagram.',
  'Cuadradas q3 y q5 quedan de reserva para cubrir un día o responder un comentario frecuente.',
  'Historias animadas: publicalas el mismo día que el posteo que acompañan, con el sticker de enlace al posteo.',
];
