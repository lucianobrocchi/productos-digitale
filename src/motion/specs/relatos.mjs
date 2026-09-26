/* ------------------------------------------------------------------
   Relatos: Reels con historia, rápidos y pensados para retener.
   Versión 2 (motion v2, ver src/motion/scenes2.mjs).

   Reglas de la serie
   - Algo en pantalla desde el primer cuadro (no hay negro al arrancar).
   - Cortes de ~1,5 a 2,5 s, cada uno con su transición; la tipografía
     entra letra por letra y un golpe en oro rompe el patrón.
   - Terminan en una frase que empalma con la primera: el loop invita a
     volver a verlo, y las vueltas cuentan como retención.
   - Sin testimonios ni resultados inventados: son parábolas, historias en
     segunda persona o la historia de la marca contada en su manual.

   Tipos de escena: kin (tipografía cinética; mode 'stack' o 'swap'),
   impact (golpe en oro), split (pantalla partida), odo (contador de días),
   chat (celular en 3D), stage (el personaje en el piso hexagonal),
   listx (lista en tarjetas), logo (cierre de marca).
   `tr` fuerza la transición de entrada: whip, zoom, hex, bars, push,
   glitch o cut. Sin `tr`, se elige una que no se repita.

   El personaje (fig) toma poses con resorte: keys = [[segundo, pose]],
   walk = [desde, hasta] para caminar, x = [desde, hasta] para moverse.
   Poses: parado, pensando, celular, camina, festeja, duda, cansado, sube, compu.

   Cada escena trae `shot` y `cam`: la toma para generar con Higgsfield.
   Si existe assets/tomas/<relato>/<NN>.mp4, entra de fondo solo.
   ------------------------------------------------------------------ */

/* estilo común de todas las tomas, para que lo generado parezca de la marca */
export const ESTILO_TOMAS = 'Cinematográfico, casi negro (#0E0E0E), luz cálida dorada de contra (#F0E281 / #A37B3C), ' +
  'partículas doradas en suspensión, poca profundidad de campo, estética premium y sobria. Sin texto, sin logos, sin caras ' +
  'reconocibles.';

export const relatos = [

/* -------------------------------------------------------------- 1 */
{
  id: 'h1-dos-personas', titulo: 'Dos personas, el mismo día',
  scenes: [
    { t: 'stage', len: 4, text: 'Dos personas | arrancan | *el mismo día.*', scroll: 360, figSize: 560,
      figs: [{ pose: 'camina', dx: -170, walk: [0, 2.2] }, { pose: 'camina', dx: 150, walk: [0, 2.2, 1.05] }],
      shot: 'Dos siluetas caminan en paralelo por una calle vacía al amanecer, a contraluz.', cam: 'travelling lateral lento' },
    { t: 'split', len: 5, title: 'Misma | *idea.*', bAt: 1.1, tr: 'whip',
      a: { pose: 'compu', tono: 'apagado', label: 'Persona A', text: 'Graba un curso' },
      b: { pose: 'celular', celular: true, label: 'Persona B', text: 'Habla con 10 personas', keys: [[1.6, 'pensando'], [2.2, 'celular']] },
      shot: 'Pantalla partida: a la izquierda, manos editando video; a la derecha, alguien en una llamada tomando notas.', cam: 'fijo, luz que se enciende del lado derecho' },
    { t: 'odo', len: 4, day: [1, 30], tone: 'apagado', fig: { pose: 'compu', tono: 'apagado' }, text: 'A sigue | *grabando.*', tr: 'bars',
      shot: 'Escritorio de noche, café frío, timeline de edición interminable en la pantalla.', cam: 'dolly in lento hacia la pantalla' },
    { t: 'odo', len: 4, day: 30, side: 'left', fig: { pose: 'celular', celular: true, keys: [[1.1, 'pensando']] }, text: 'B ya sabe | *qué le piden.*', tr: 'push',
      shot: 'Libreta con frases subrayadas en dorado, una mano marca una con un círculo.', cam: 'cenital, leve giro' },
    { t: 'odo', len: 4, day: [30, 60], tone: 'apagado', fig: { pose: 'compu', tono: 'apagado', keys: [[1, 'cansado', 'springSoft', .6]] }, text: 'A lanza. | *Silencio.*', tr: 'whip',
      shot: 'Teléfono boca arriba sobre la mesa, pantalla sin notificaciones, luz que se apaga.', cam: 'plano fijo, zoom muy lento' },
    { t: 'odo', len: 4, day: 60, side: 'left', fig: { pose: 'parado', keys: [[.45, 'festeja', 'springHard', .55]] }, text: 'B lanza a una lista | *que lo espera.*', tr: 'hex',
      shot: 'Una puerta que se abre hacia una luz dorada intensa.', cam: 'dolly in, entra la luz' },
    { t: 'impact', len: 3, text: ['¿La', 'diferencia?'],
      shot: 'Destello dorado que atraviesa el cuadro.', cam: 'crash zoom' },
    { t: 'kin', len: 5, text: 'No fue | el talento. | Fue *el orden.*', tr: 'zoom',
      shot: 'Fichas doradas que se ordenan solas en línea sobre una mesa negra.', cam: 'macro, travelling lateral' },
    { t: 'kin', len: 5, kicker: 'Contanos', text: '¿Vos cuál | de los dos | *sos hoy?*', fig: { pose: 'pensando' }, figSize: 480, tr: 'push',
      shot: 'Silueta frente a un espejo, mitad en sombra y mitad iluminada en dorado.', cam: 'dolly out lento' },
  ],
},

/* -------------------------------------------------------------- 2 */
{
  id: 'h2-origen', titulo: 'Por qué existe Productos Digitales',
  scenes: [
    { t: 'kin', len: 6, text: 'Nos dijeron | que para vivir de Internet | *hacía falta suerte.*', fig: { pose: 'duda' }, figSize: 520,
      shot: 'Una ruleta girando en penumbra, reflejos dorados.', cam: 'órbita lenta' },
    { t: 'kin', len: 5, mode: 'swap', text: 'O un *secreto.* | O años | de experiencia.', tr: 'whip',
      shot: 'Una caja fuerte cerrada con una grieta de luz dorada.', cam: 'dolly in' },
    { t: 'impact', len: 3, text: 'Mentira.',
      shot: 'La caja fuerte estalla en partículas doradas.', cam: 'crash zoom' },
    { t: 'stage', len: 6, text: 'Lo que hace falta | es *método.*', scroll: 260, tr: 'zoom',
      figs: [{ pose: 'camina', walk: [0, 1.5], x: [-360, 0, 0, 1.5], keys: [[1.55, 'parado', 'springSoft', .5]] }],
      shot: 'Hexágonos dorados que encajan uno con otro formando un camino.', cam: 'cenital, sube despacio' },
    { t: 'listx', len: 6, title: 'El *método*', items: ['Detectar un dolor', 'Armar una oferta', 'Venderla'], tr: 'bars',
      shot: 'Tres escalones de luz que se encienden uno después del otro.', cam: 'travelling ascendente' },
    { t: 'kin', len: 6, text: 'Con IA, | lo que tomaba meses | hoy toma *horas.*', fig: { pose: 'compu' }, figSize: 520, tr: 'push',
      shot: 'Reloj de arena cuya arena dorada cae a velocidad acelerada.', cam: 'macro, timelapse' },
    { t: 'kin', len: 5, text: 'Por eso existe | *Productos | Digitales.*', echoWord: 'PD', tr: 'whip',
      shot: 'Hexágono dorado metálico girando lento sobre negro, brillo que lo recorre.', cam: 'órbita lenta' },
    { t: 'logo', len: 9 },
  ],
},

/* -------------------------------------------------------------- 3 */
{
  id: 'h3-idea-hace-meses', titulo: 'Tenés una idea hace meses',
  scenes: [
    { t: 'kin', len: 4, text: 'Tenés una idea | *hace meses.*', fig: { pose: 'pensando' }, figSize: 560,
      shot: 'Una lamparita apagada colgando en un cuarto oscuro, polvo dorado alrededor.', cam: 'dolly in lento' },
    { t: 'kin', len: 5, mode: 'swap', text: 'Y todos los días | encontrás una razón | *para no empezar.*', tr: 'push',
      shot: 'Calendario cuyas hojas vuelan una tras otra.', cam: 'fijo, timelapse' },
    { t: 'chat', len: 8, header: 'Tu cabeza', status: 'cada lunes, 23:47', every: 1.1, tr: 'zoom', lines: [
      { a: 'ellos', t: 'Todavía no sé lo suficiente.' }, { a: 'ellos', t: 'Primero necesito más seguidores.' },
      { a: 'ellos', t: 'Seguro ya lo hizo alguien.' }],
      shot: 'Silueta sentada en la cama mirando el techo, luz fría de la ventana.', cam: 'cenital, leve rotación' },
    { t: 'impact', len: 3, text: 'Excusas.',
      shot: 'Papeles arrugados cayendo en cámara lenta, contraluz dorado.', cam: 'cámara lenta' },
    { t: 'kin', len: 5, text: 'El problema | no es la idea. | Es *el orden.*', tr: 'glitch',
      shot: 'Piezas de dominó doradas que se acomodan en fila.', cam: 'macro, travelling' },
    { t: 'listx', len: 6, title: 'El *orden*', items: ['Hablá con 10 personas', 'Contá la promesa', 'Recién ahí, producí'], tr: 'bars',
      shot: 'Tres luces doradas que se encienden en secuencia en un pasillo oscuro.', cam: 'travelling hacia adelante' },
    { t: 'stage', len: 4, text: 'Hoy es | *el día 1.*', scroll: 300, tr: 'hex',
      figs: [{ pose: 'camina', walk: [0, 2] }],
      shot: 'Pies dando el primer paso sobre un piso que se ilumina en dorado.', cam: 'plano bajo, sigue el paso' },
    { t: 'kin', len: 4, text: '¿O vas a seguir | *con la idea?*', fig: { pose: 'pensando' }, figSize: 480, tr: 'whip',
      shot: 'La lamparita del principio se enciende de golpe.', cam: 'fijo, destello' },
  ],
},

/* -------------------------------------------------------------- 4 */
{
  id: 'h4-seis-meses', titulo: 'Seis meses grabando un curso',
  scenes: [
    { t: 'odo', len: 5, day: [1, 180], max: 180, roll: 1.5, fig: { pose: 'compu' }, text: 'Seis meses | *grabando un curso.*',
      shot: 'Luz roja de "grabando" encendida en una cámara, escritorio en penumbra.', cam: 'dolly in' },
    { t: 'kin', len: 4, mode: 'swap', text: 'Lo edita. | Lo sube. | *Lo lanza.*', tr: 'whip',
      shot: 'Barra de carga que llega al 100% con un brillo dorado.', cam: 'macro sobre pantalla' },
    { t: 'impact', len: 3, text: 'Silencio.',
      shot: 'Sala de cine vacía, butacas en penumbra.', cam: 'travelling lento' },
    { t: 'kin', len: 5, text: 'Pasa el tiempo. | Y el error | *no fue el curso.*', fig: { pose: 'cansado', tono: 'apagado' }, figSize: 480, tr: 'zoom',
      shot: 'Silueta con la cabeza entre las manos frente a la laptop.', cam: 'fijo, contraluz' },
    { t: 'impact', len: 3, text: ['Fue no', 'preguntar.'],
      shot: 'Un signo de pregunta dorado que se ilumina en la oscuridad.', cam: 'crash zoom' },
    { t: 'split', len: 5, title: 'Dos | *órdenes*', bAt: 1.1, tr: 'glitch',
      a: { pose: 'compu', tono: 'apagado', label: 'Primero grabar', text: 'Y rezar' },
      b: { pose: 'celular', celular: true, label: 'Primero preguntar', text: 'Y después grabar', keys: [[2, 'festeja', 'springHard', .5]] },
      shot: 'Dos caminos que se bifurcan en un bosque oscuro, uno iluminado en dorado.', cam: 'drone lento hacia el camino iluminado' },
    { t: 'kin', len: 5, text: 'Antes de grabar | un minuto: | *10 conversaciones.*', fig: { pose: 'celular', celular: true }, figSize: 480, tr: 'bars',
      shot: 'Diez sillas vacías en ronda iluminadas desde arriba.', cam: 'cenital' },
    { t: 'kin', len: 5, text: 'Si nadie lo quiere | gratis, | *no lo van a pagar.*', tr: 'push',
      shot: 'Una moneda dorada que gira sobre una mesa y cae.', cam: 'macro, cámara lenta' },
    { t: 'kin', len: 4, kicker: 'Guardalo', text: 'Antes de tus | *seis meses.*', tr: 'hex',
      shot: 'La luz roja de "grabando" se apaga.', cam: 'fijo' },
  ],
},

/* -------------------------------------------------------------- 5 */
{
  id: 'h5-tres-segundos', titulo: 'Tenés 3 segundos',
  scenes: [
    { t: 'kin', len: 3, mode: 'swap', max: 330, text: 'Tenés | *3 segundos.*',
      shot: 'Cronómetro dorado analógico con la aguja corriendo.', cam: 'macro' },
    { t: 'impact', len: 2, text: ['Ya usaste', 'uno.'],
      shot: 'La aguja del cronómetro salta un segundo.', cam: 'crash zoom' },
    { t: 'kin', len: 5, text: 'Así decide la gente | si se queda | *o sigue de largo.*', tr: 'zoom',
      shot: 'Un pulgar deslizando un feed a toda velocidad, luz de pantalla en la cara.', cam: 'sobre el hombro' },
    { t: 'kin', len: 5, num: 1, kicker: 'La verdad incómoda', upper: false, max: 170, text: '"Tu curso | no se vende | *por esto.*"', tr: 'push',
      shot: 'Un reflector que se enciende sobre un escenario vacío.', cam: 'fijo' },
    { t: 'kin', len: 5, num: 2, kicker: 'El número concreto', upper: false, max: 170, text: '"3 errores | que te cuestan | *ventas.*"', tr: 'push',
      shot: 'Tres fichas doradas caen una a una sobre una mesa negra.', cam: 'cámara lenta' },
    { t: 'kin', len: 5, num: 3, kicker: 'El vos directo', upper: false, max: 170, text: '"Si tenés una idea | hace meses, | *mirá esto.*"', tr: 'push',
      shot: 'Una mano que señala a cámara, desenfocada, contraluz dorado.', cam: 'dolly in' },
    { t: 'impact', len: 3, text: ['¿Llegaste', 'hasta acá?'], sub: 'Funcionó.',
      shot: 'El cronómetro se detiene y brilla.', cam: 'macro' },
    { t: 'kin', len: 3, kicker: 'Guardalo', text: 'Para tu | *próximo video.*', tr: 'hex',
      shot: 'La aguja vuelve a cero.', cam: 'fijo' },
  ],
},

/* -------------------------------------------------------------- 6 */
{
  id: 'h6-pov-familia', titulo: 'POV: le explicás a tu familia',
  scenes: [
    { t: 'kin', len: 5, kicker: 'POV', text: 'Le explicás | a tu familia | que vendés | *productos digitales.*',
      shot: 'Mesa familiar de domingo vista desde arriba, luz cálida.', cam: 'cenital, gira despacio' },
    { t: 'chat', len: 15, header: 'Familia', status: 'domingo, 14:05', every: 1.0, tr: 'zoom', lines: [
      { a: 'ellos', t: '¿Y eso qué es?' }, { a: 'vos', t: 'Vendo lo que sé.' },
      { a: 'ellos', t: '¿Por Internet? ¿Eso es real?' }, { a: 'vos', t: 'Tan real como un libro.' },
      { a: 'ellos', t: '¿Y quién te va a comprar?' }, { a: 'vos', t: 'Alguien con el problema que yo ya resolví.' },
      { a: 'ellos', t: '…' }],
      shot: 'Tazas de café y manos gesticulando sobre la mesa.', cam: 'plano medio, cámara en mano suave' },
    { t: 'stage', len: 4, text: '*Silencio* | en la mesa.', figs: [{ pose: 'parado', keys: [[.6, 'festeja', 'springHard', .55]] }], tr: 'hex',
      shot: 'La mesa en silencio, un rayo de luz dorada entra por la ventana.', cam: 'dolly in lento' },
    { t: 'kin', len: 5, text: 'Lo que sabés, | *para alguien | vale.*', tr: 'whip',
      shot: 'Un libro abierto que emite una luz dorada suave.', cam: 'macro' },
    { t: 'kin', len: 4, kicker: 'Compartilo', text: 'Mandáselo | a ese tío. | *Vos sabés cuál.*', tr: 'bars',
      shot: 'Un teléfono que envía un mensaje, destello dorado.', cam: 'macro sobre pantalla' },
  ],
},

/* -------------------------------------------------------------- 7 */
{
  id: 'h7-30-dias', titulo: '30 días en 20 segundos',
  scenes: [
    { t: 'stage', len: 3, text: '*30 días* | en 20 segundos.', scroll: 300, figs: [{ pose: 'camina', walk: [0, 1.6, 1.3] }],
      shot: 'Calendario de pared cuyas hojas vuelan en timelapse.', cam: 'fijo, timelapse' },
    { t: 'odo', len: 3, day: 1, max: 30, fig: { pose: 'celular', celular: true }, text: 'Hablás con | *3 personas.*', tr: 'whip',
      shot: 'Teléfono con una videollamada, luz dorada de lámpara.', cam: 'sobre el hombro' },
    { t: 'odo', len: 3, day: [1, 4], max: 30, side: 'left', fig: { pose: 'compu' }, text: 'Ya son 10. | Anotás *sus palabras.*', tr: 'push',
      shot: 'Libreta llenándose de notas a mano.', cam: 'cenital' },
    { t: 'odo', len: 3, day: [4, 9], max: 30, fig: { pose: 'celular', celular: true }, text: 'Escribís la promesa | y *la publicás.*', tr: 'whip',
      shot: 'Pulgar que toca "publicar", destello dorado.', cam: 'macro' },
    { t: 'odo', len: 3, day: [9, 12], max: 30, side: 'left', fig: { pose: 'pensando' }, text: 'Medís quién | *levanta la mano.*', tr: 'push',
      shot: 'Manos que se levantan a contraluz en una sala oscura.', cam: 'travelling lento' },
    { t: 'odo', len: 3, day: [12, 18], max: 30, fig: { pose: 'compu' }, text: 'Armás la primera | versión *con IA.*', tr: 'whip',
      shot: 'Líneas de texto dorado que se escriben solas en una pantalla.', cam: 'macro, dolly in' },
    { t: 'odo', len: 3, day: [18, 24], max: 30, side: 'left', fig: { pose: 'camina', walk: [0, 1.5, 1.3] }, text: 'Contenido todos los días. | *Un ángulo.*', tr: 'push',
      shot: 'Una silueta caminando con paso firme por un pasillo iluminado.', cam: 'steadicam siguiendo' },
    { t: 'odo', len: 3, day: [24, 30], max: 30, fig: { pose: 'parado', keys: [[.6, 'festeja', 'springHard', .5]] }, text: 'Abrís la venta. | *Con método.*', tr: 'hex',
      shot: 'Silueta subiendo una escalera hacia una luz dorada.', cam: 'contrapicado, sube' },
    { t: 'impact', len: 3, text: 'No es magia.', sub: 'Es un orden.',
      shot: 'Hexágonos dorados encajando en un panal perfecto.', cam: 'cenital, zoom out' },
    { t: 'kin', len: 3, kicker: 'Guardalo', text: 'Mañana es | *el día 1.*', tr: 'zoom',
      shot: 'La primera hoja del calendario, iluminada.', cam: 'fijo' },
  ],
},

/* -------------------------------------------------------------- 8 */
{
  id: 'h8-nadie-te-dice', titulo: 'Nadie te va a decir esto',
  scenes: [
    { t: 'kin', len: 3, text: 'Nadie te va | a decir | *esto.*',
      shot: 'Un dedo sobre los labios en silencio, contraluz dorado.', cam: 'dolly in lento' },
    { t: 'kin', len: 4, num: 1, max: 170, text: 'Tu primer producto | va a ser *imperfecto.* | Está bien.', tr: 'push',
      shot: 'Una pieza de cerámica con una grieta reparada en oro.', cam: 'macro, órbita' },
    { t: 'kin', len: 4, num: 2, max: 170, text: 'El contenido | no vende solo. | *La oferta sí.*', tr: 'push',
      shot: 'Vidriera iluminada de noche con un solo producto en el centro.', cam: 'travelling lateral' },
    { t: 'kin', len: 4, num: 3, max: 170, text: 'Nadie compra | en el primer video. | Compran | *cuando confían.*', tr: 'push',
      shot: 'Dos manos que se estrechan en penumbra, luz dorada en el borde.', cam: 'macro, cámara lenta' },
    { t: 'kin', len: 4, num: 4, max: 170, text: 'Copiar a los grandes | no funciona. | *Arrancaron distinto.*', tr: 'push',
      shot: 'Huellas en la arena que siguen otras huellas y se desvían.', cam: 'cenital' },
    { t: 'kin', len: 4, num: 5, max: 170, text: 'La IA | no te va a salvar. | *El criterio sí.*', tr: 'push',
      shot: 'Un chip dorado junto a una brújula antigua.', cam: 'macro' },
    { t: 'impact', len: 2, text: ['Sin', 'humo.'],
      shot: 'Humo que se disipa y deja ver una luz dorada nítida.', cam: 'fijo, el humo sale de cuadro' },
    { t: 'kin', len: 4, kicker: 'Contanos', text: '¿Cuál te dolió | *más?*', tr: 'glitch',
      shot: 'El dedo sobre los labios se retira.', cam: 'fijo' },
  ],
},
];
