/* ------------------------------------------------------------------
   Relatos: Reels con historia, rápidos y pensados para retener.

   Reglas de la serie
   - Algo en pantalla desde el primer cuadro (no hay negro al arrancar).
   - Cortes de ~1 a 2 s, subtítulo palabra por palabra, un golpe cada tanto.
   - Terminan en una frase que empalma con la primera: el loop invita a
     volver a verlo, y las vueltas cuentan como retención.
   - Sin testimonios ni resultados inventados: son parábolas, historias en
     segunda persona o la historia de la marca contada en su manual.

   Cada escena trae `shot` y `cam`: la toma para generar con Higgsfield
   cuando se conecte. Si la escena recibe `bg` (un .mp4), el clip entra de
   fondo automáticamente y el texto queda encima.
   ------------------------------------------------------------------ */

/* estilo común de todas las tomas, para que lo generado parezca de la marca */
export const ESTILO_TOMAS = 'Cinematográfico, casi negro (#0E0E0E), luz cálida dorada de contra (#F0E281 / #A37B3C), ' +
  'partículas doradas en suspensión, poca profundidad de campo, estética premium y sobria. Sin texto, sin logos, sin caras ' +
  'reconocibles.';

export const relatos = [

/* -------------------------------------------------------------- 1 */
{
  id: 'h1-dos-personas', titulo: 'Dos personas, el mismo día', gx: 80,
  scenes: [
    { t: 'words', len: 4, fig: 'camina', text: 'Dos personas arrancan *el mismo día.*',
      shot: 'Dos siluetas caminan en paralelo por una calle vacía al amanecer, a contraluz.', cam: 'travelling lateral lento' },
    { t: 'versus', len: 4, title: ['Misma idea.'], a: { pose: 'compu', label: 'Persona A', text: 'Graba un curso' },
      b: { pose: 'celular', label: 'Persona B', text: 'Habla con 10 personas' },
      shot: 'Pantalla partida: a la izquierda, manos editando video; a la derecha, alguien en una llamada tomando notas.', cam: 'fijo, luz que se enciende del lado derecho' },
    { t: 'day', len: 4, day: [1, 30], fig: 'compu', tono: 'apagado', text: 'A sigue *grabando.*',
      shot: 'Escritorio de noche, café frío, timeline de edición interminable en la pantalla.', cam: 'dolly in lento hacia la pantalla' },
    { t: 'day', len: 4, day: 30, fig: 'pensando', text: 'B ya sabe *qué le piden.*',
      shot: 'Libreta con frases subrayadas en dorado, una mano marca una con un círculo.', cam: 'cenital, leve giro' },
    { t: 'day', len: 4, day: [30, 60], fig: 'cansado', tono: 'apagado', text: 'A lanza. *Silencio.*',
      shot: 'Teléfono boca arriba sobre la mesa, pantalla sin notificaciones, luz que se apaga.', cam: 'plano fijo, zoom muy lento' },
    { t: 'day', len: 4, day: 60, fig: 'festeja', text: 'B lanza a una lista *que lo espera.*',
      shot: 'Una puerta que se abre hacia una luz dorada intensa.', cam: 'dolly in, entra la luz' },
    { t: 'punch', len: 3, text: ['¿La', 'diferencia?'],
      shot: 'Destello dorado que atraviesa el cuadro.', cam: 'crash zoom' },
    { t: 'words', len: 5, fig: 'pensando', text: 'No fue el talento. Fue *el orden.*',
      shot: 'Fichas doradas que se ordenan solas en línea sobre una mesa negra.', cam: 'macro, travelling lateral' },
    { t: 'words', len: 5, kicker: 'Contanos', text: '¿Vos cuál de los dos *sos hoy?*',
      shot: 'Silueta frente a un espejo, mitad en sombra y mitad iluminada en dorado.', cam: 'dolly out lento' },
  ],
},

/* -------------------------------------------------------------- 2 */
{
  id: 'h2-origen', titulo: 'Por qué existe Productos Digitales', gx: 76,
  scenes: [
    { t: 'words', len: 6, fig: 'duda', text: 'Nos dijeron que para vivir de Internet *hacía falta suerte.*',
      shot: 'Una ruleta girando en penumbra, reflejos dorados.', cam: 'órbita lenta' },
    { t: 'words', len: 5, text: 'O un *secreto.* O años de experiencia.',
      shot: 'Una caja fuerte cerrada con una grieta de luz dorada.', cam: 'dolly in' },
    { t: 'punch', len: 3, text: 'Mentira.', gold: false,
      shot: 'La caja fuerte estalla en partículas doradas.', cam: 'crash zoom' },
    { t: 'words', len: 5, fig: 'parado', text: 'Lo que hace falta es *método.*',
      shot: 'Hexágonos dorados que encajan uno con otro formando un camino.', cam: 'cenital, sube despacio' },
    { t: 'words', len: 6, text: 'Detectar un dolor. Armar una oferta. *Venderla.*',
      shot: 'Tres escalones de luz que se encienden uno después del otro.', cam: 'travelling ascendente' },
    { t: 'words', len: 6, fig: 'compu', text: 'Con IA, lo que tomaba meses hoy toma *horas.*',
      shot: 'Reloj de arena cuya arena dorada cae a velocidad acelerada.', cam: 'macro, timelapse' },
    { t: 'words', len: 5, text: 'Por eso existe *Productos Digitales.*',
      shot: 'Hexágono dorado metálico girando lento sobre negro, brillo que lo recorre.', cam: 'órbita lenta' },
    { t: 'logo', len: 9 },
  ],
},

/* -------------------------------------------------------------- 3 */
{
  id: 'h3-idea-hace-meses', titulo: 'Tenés una idea hace meses', gx: 84,
  scenes: [
    { t: 'words', len: 4, fig: 'pensando', text: 'Tenés una idea *hace meses.*',
      shot: 'Una lamparita apagada colgando en un cuarto oscuro, polvo dorado alrededor.', cam: 'dolly in lento' },
    { t: 'words', len: 5, text: 'Y todos los días encontrás una *razón para no empezar.*',
      shot: 'Calendario cuyas hojas vuelan una tras otra.', cam: 'fijo, timelapse' },
    { t: 'dialog', len: 7, kicker: 'Tu cabeza, cada lunes', every: 2, lines: [
      { a: 'ellos', t: 'Todavía no sé lo suficiente.' }, { a: 'ellos', t: 'Primero necesito más seguidores.' },
      { a: 'ellos', t: 'Seguro ya lo hizo alguien.' }],
      shot: 'Silueta sentada en la cama mirando el techo, luz fría de la ventana.', cam: 'cenital, leve rotación' },
    { t: 'punch', len: 3, text: 'Excusas.',
      shot: 'Papeles arrugados cayendo en cámara lenta, contraluz dorado.', cam: 'cámara lenta' },
    { t: 'words', len: 5, text: 'El problema no es la idea. Es *el orden.*',
      shot: 'Piezas de dominó doradas que se acomodan en fila.', cam: 'macro, travelling' },
    { t: 'list', len: 6, title: ['El orden'], gold: [0], items: ['Hablá con 10 personas', 'Contá la promesa', 'Recién ahí, producí'],
      shot: 'Tres luces doradas que se encienden en secuencia en un pasillo oscuro.', cam: 'travelling hacia adelante' },
    { t: 'day', len: 4, day: 1, fig: 'camina', text: 'Hoy es *el día 1.*',
      shot: 'Pies dando el primer paso sobre un piso que se ilumina en dorado.', cam: 'plano bajo, sigue el paso' },
    { t: 'words', len: 4, text: '¿O vas a seguir *con la idea?*',
      shot: 'La lamparita del principio se enciende de golpe.', cam: 'fijo, destello' },
  ],
},

/* -------------------------------------------------------------- 4 */
{
  id: 'h4-seis-meses', titulo: 'Seis meses grabando un curso', gx: 78,
  scenes: [
    { t: 'words', len: 4, fig: 'compu', text: 'Seis meses *grabando un curso.*',
      shot: 'Luz roja de "grabando" encendida en una cámara, escritorio en penumbra.', cam: 'dolly in' },
    { t: 'words', len: 4, text: 'Lo edita. Lo sube. *Lo lanza.*',
      shot: 'Barra de carga que llega al 100% con un brillo dorado.', cam: 'macro sobre pantalla' },
    { t: 'punch', len: 3, text: 'Silencio.', gold: false,
      shot: 'Sala de cine vacía, butacas en penumbra.', cam: 'travelling lento' },
    { t: 'words', len: 5, fig: 'cansado', tono: 'apagado', text: 'Pasa todo el tiempo. Y el error *no fue el curso.*',
      shot: 'Silueta con la cabeza entre las manos frente a la laptop.', cam: 'fijo, contraluz' },
    { t: 'punch', len: 3, text: ['Fue no', 'preguntar.'],
      shot: 'Un signo de pregunta dorado que se ilumina en la oscuridad.', cam: 'crash zoom' },
    { t: 'versus', len: 4, title: ['Dos órdenes'], a: { pose: 'compu', label: 'Primero grabar', text: 'Y rezar' },
      b: { pose: 'celular', label: 'Primero preguntar', text: 'Y después grabar' },
      shot: 'Dos caminos que se bifurcan en un bosque oscuro, uno iluminado en dorado.', cam: 'drone lento hacia el camino iluminado' },
    { t: 'words', len: 5, text: 'Antes de grabar un minuto: *10 conversaciones.*',
      shot: 'Diez sillas vacías en ronda iluminadas desde arriba.', cam: 'cenital' },
    { t: 'words', len: 5, text: 'Si nadie lo quiere gratis, *no lo van a pagar.*',
      shot: 'Una moneda dorada que gira sobre una mesa y cae.', cam: 'macro, cámara lenta' },
    { t: 'words', len: 4, kicker: 'Guardalo', text: 'Antes de tus *seis meses.*',
      shot: 'La luz roja de "grabando" se apaga.', cam: 'fijo' },
  ],
},

/* -------------------------------------------------------------- 5 */
{
  id: 'h5-tres-segundos', titulo: 'Tenés 3 segundos', gx: 86,
  scenes: [
    { t: 'words', len: 3, size: 140, text: 'Tenés *3 segundos.*',
      shot: 'Cronómetro dorado analógico con la aguja corriendo.', cam: 'macro' },
    { t: 'words', len: 2, size: 140, text: 'Ya usaste *uno.*',
      shot: 'La aguja del cronómetro salta un segundo.', cam: 'crash zoom' },
    { t: 'words', len: 5, text: 'Así decide la gente si se queda *o sigue de largo.*',
      shot: 'Un pulgar deslizando un feed a toda velocidad, luz de pantalla en la cara.', cam: 'sobre el hombro' },
    { t: 'words', len: 5, kicker: 'Gancho 1 · la verdad incómoda', upper: false, size: 88,
      text: '"Tu curso no se vende *por esto.*"',
      shot: 'Un reflector que se enciende sobre un escenario vacío.', cam: 'fijo' },
    { t: 'words', len: 5, kicker: 'Gancho 2 · el número concreto', upper: false, size: 88,
      text: '"3 errores que *te cuestan ventas.*"',
      shot: 'Tres fichas doradas caen una a una sobre una mesa negra.', cam: 'cámara lenta' },
    { t: 'words', len: 5, kicker: 'Gancho 3 · el vos directo', upper: false, size: 88,
      text: '"Si tenés una idea hace meses, *mirá esto.*"',
      shot: 'Una mano que señala a cámara, desenfocada, contraluz dorado.', cam: 'dolly in' },
    { t: 'words', len: 4, text: '¿Llegaste hasta acá? *Funcionó.*',
      shot: 'El cronómetro se detiene y brilla.', cam: 'macro' },
    { t: 'words', len: 3, kicker: 'Guardalo', text: 'Para tu *próximo video.*',
      shot: 'La aguja vuelve a cero.', cam: 'fijo' },
  ],
},

/* -------------------------------------------------------------- 6 */
{
  id: 'h6-pov-familia', titulo: 'POV: le explicás a tu familia', gx: 80,
  scenes: [
    { t: 'words', len: 5, kicker: 'POV', text: 'Le explicás a tu familia que *vendés productos digitales.*',
      shot: 'Mesa familiar de domingo vista desde arriba, luz cálida.', cam: 'cenital, gira despacio' },
    { t: 'dialog', len: 8, every: 2, lines: [
      { a: 'ellos', t: '¿Y eso qué es?' }, { a: 'vos', t: 'Vendo lo que sé.' },
      { a: 'ellos', t: '¿Por Internet? ¿Eso es real?' }, { a: 'vos', t: 'Tan real como un libro.' }],
      shot: 'Tazas de café y manos gesticulando sobre la mesa.', cam: 'plano medio, cámara en mano suave' },
    { t: 'dialog', len: 6, every: 2, lines: [
      { a: 'ellos', t: '¿Y quién te va a comprar?' },
      { a: 'vos', t: 'Alguien con el problema que yo ya resolví.' }, { a: 'ellos', t: '…' }],
      shot: 'Primer plano de una taza que se detiene a mitad de camino.', cam: 'fijo' },
    { t: 'words', len: 4, fig: 'festeja', text: '*Silencio* en la mesa.',
      shot: 'La mesa en silencio, un rayo de luz dorada entra por la ventana.', cam: 'dolly in lento' },
    { t: 'words', len: 5, text: 'Lo que sabés, *para alguien vale.*',
      shot: 'Un libro abierto que emite una luz dorada suave.', cam: 'macro' },
    { t: 'words', len: 4, kicker: 'Compartilo', text: 'Mandáselo a ese tío. *Vos sabés cuál.*',
      shot: 'Un teléfono que envía un mensaje, destello dorado.', cam: 'macro sobre pantalla' },
  ],
},

/* -------------------------------------------------------------- 7 */
{
  id: 'h7-30-dias', titulo: '30 días en 20 segundos', gx: 82,
  scenes: [
    { t: 'words', len: 3, fig: 'camina', text: '*30 días* en 20 segundos.',
      shot: 'Calendario de pared cuyas hojas vuelan en timelapse.', cam: 'fijo, timelapse' },
    { t: 'day', len: 3, day: 1, fig: 'celular', text: 'Hablás con *3 personas.*',
      shot: 'Teléfono con una videollamada, luz dorada de lámpara.', cam: 'sobre el hombro' },
    { t: 'day', len: 3, day: [1, 4], fig: 'compu', text: 'Ya son 10. Anotás *sus palabras.*',
      shot: 'Libreta llenándose de notas a mano.', cam: 'cenital' },
    { t: 'day', len: 3, day: [4, 9], fig: 'celular', text: 'Escribís la promesa y *la publicás.*',
      shot: 'Pulgar que toca "publicar", destello dorado.', cam: 'macro' },
    { t: 'day', len: 3, day: [9, 12], fig: 'pensando', text: 'Medís quién *levanta la mano.*',
      shot: 'Manos que se levantan a contraluz en una sala oscura.', cam: 'travelling lento' },
    { t: 'day', len: 3, day: [12, 18], fig: 'compu', text: 'Armás la primera versión *con IA.*',
      shot: 'Líneas de texto dorado que se escriben solas en una pantalla.', cam: 'macro, dolly in' },
    { t: 'day', len: 3, day: [18, 24], fig: 'camina', text: 'Contenido todos los días. *Un ángulo.*',
      shot: 'Una silueta caminando con paso firme por un pasillo iluminado.', cam: 'steadicam siguiendo' },
    { t: 'day', len: 3, day: [24, 30], fig: 'sube', text: 'Abrís la venta. *Con método.*',
      shot: 'Silueta subiendo una escalera hacia una luz dorada.', cam: 'contrapicado, sube' },
    { t: 'words', len: 4, text: 'No es magia. *Es un orden.*',
      shot: 'Hexágonos dorados encajando en un panal perfecto.', cam: 'cenital, zoom out' },
    { t: 'words', len: 3, kicker: 'Guardalo', text: 'Mañana es *el día 1.*',
      shot: 'La primera hoja del calendario, iluminada.', cam: 'fijo' },
  ],
},

/* -------------------------------------------------------------- 8 */
{
  id: 'h8-nadie-te-dice', titulo: 'Nadie te va a decir esto', gx: 88,
  scenes: [
    { t: 'words', len: 3, text: 'Nadie te va a decir *esto.*',
      shot: 'Un dedo sobre los labios en silencio, contraluz dorado.', cam: 'dolly in lento' },
    { t: 'words', len: 4, kicker: '01', text: 'Tu primer producto va a ser *imperfecto.* Está bien.',
      shot: 'Una pieza de cerámica con una grieta reparada en oro.', cam: 'macro, órbita' },
    { t: 'words', len: 4, kicker: '02', text: 'El contenido no vende solo. *La oferta sí.*',
      shot: 'Vidriera iluminada de noche con un solo producto en el centro.', cam: 'travelling lateral' },
    { t: 'words', len: 4, kicker: '03', text: 'Nadie compra en el primer video. *Compran cuando confían.*',
      shot: 'Dos manos que se estrechan en penumbra, luz dorada en el borde.', cam: 'macro, cámara lenta' },
    { t: 'words', len: 4, kicker: '04', text: 'Copiar a los grandes no funciona. *Arrancaron distinto.*',
      shot: 'Huellas en la arena que siguen otras huellas y se desvían.', cam: 'cenital' },
    { t: 'words', len: 4, kicker: '05', text: 'La IA no te va a salvar. *El criterio sí.*',
      shot: 'Un chip dorado junto a una brújula antigua.', cam: 'macro' },
    { t: 'punch', len: 2, text: ['Sin', 'humo.'],
      shot: 'Humo que se disipa y deja ver una luz dorada nítida.', cam: 'fijo, el humo sale de cuadro' },
    { t: 'words', len: 4, kicker: 'Contanos', text: '¿Cuál te dolió *más?*',
      shot: 'El dedo sobre los labios se retira.', cam: 'fijo' },
  ],
},
];
