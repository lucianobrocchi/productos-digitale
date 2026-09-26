# Productos Digitales — sistema de contenido

Piezas fijas, video, sonido y un kit de edición para **Productos Digitales**,
construidos sobre el Manual de Identidad y el logo vectorial oficial. Todo se
genera por código: se edita el copy, se vuelve a correr y salen los archivos
listos para publicar.

---

## Qué hay

### Clases — `out/video/clases/` y `out/carruseles/k*/`

Piezas largas de valor, de 45 a 65 segundos, sobre los temas de las portadas
del Drive (Introducción, Mentalidad, Principios del marketing digital, La
nueva economía digital). Cada clase sale en **Reel 9:16**, en **video 16:9
para YouTube** con su **miniatura**, y en **carrusel**.

| Clase | Formato |
|---|---|
| La nueva economía digital | 5 claves con ejemplo + qué se puede vender |
| Mentalidad para arrancar de cero | 6 ideas + repaso para guardar |
| 7 principios del marketing digital | un principio por escena + los 7 en una pantalla |
| La oferta que se vende | la fórmula que se completa en pantalla + qué incluir + precio y riesgo |
| Un plan de 30 días | línea de tiempo + una semana por escena |
| 5 prompts para crear tu producto con IA | cada prompt se escribe en pantalla, listo para copiar |

Los videos llevan barra de progreso (retiene hasta el final) y el contador
"2 de 7" en cada punto. Guiones en `src/motion/specs/clases.mjs`; el carrusel
sale de los mismos datos, así video y carrusel no se desincronizan.

**Qué es de la marca y qué no.** Los temas, el tono y el enfoque (método, IA
como acelerador, orgánico + anuncios) salen del manual y de las portadas. Los
consejos concretos son buenas prácticas generales que encajan con su misión:
no son su programa ni prometen resultados. Cuando tengamos su temario real,
se reescriben en `clases.mjs` y se regenera todo.

### Relatos — `out/video/relatos/`

Ocho Reels con historia, de 14 a 23 segundos, hechos para **alcance**: más
rápidos que las clases y con un protagonista, un personaje dorado dibujado
con la misma línea que las ilustraciones (`src/figure.mjs`, 9 poses).

| Relato | Gancho |
|---|---|
| Dos personas, el mismo día | la misma idea, dos caminos: uno graba un curso, el otro pregunta primero |
| Por qué existe Productos Digitales | la historia de la marca, del manual, en 22 segundos |
| Tenés una idea hace meses | la voz que frena, en globos de chat |
| Seis meses grabando un curso | lo que pasa cuando nadie lo pidió |
| Tenés 3 segundos | el gancho, explicado con el propio gancho |
| POV: le explicás a tu familia | lo que ellos escuchan y lo que vos hacés |
| 30 días en 20 segundos | un contador de días con el personaje avanzando |
| Nadie te va a decir esto | 5 verdades en golpes de un segundo |

**Pensados para retener.** Hay texto desde el primer cuadro (sin negro de
arranque), subtítulo palabra por palabra, cortes de uno a dos segundos, un
golpe de pantalla cada tanto y un final que empalma con el principio para que
el video se vuelva a ver. No son testimonios: son parábolas, historias en
segunda persona o la historia de la marca contada en su manual.

**Listos para Higgsfield.** Cada escena trae la toma que habría que generar
(`shot`) y el movimiento de cámara (`cam`). Están todas en
`out/higgsfield/tomas.md` (y `tomas.json`), con un estilo común para que lo
generado parezca de la marca. Al generar una toma, se guarda como
`assets/tomas/<relato>/<NN>.mp4` (NN = número de escena) y se corre
`node scripts/video/build.mjs relatos`: el clip entra de fondo solo, oscurecido
para que el texto se lea, y el sonido no cambia.

### Audiovisual — `out/video/`

| Pieza | Medida | Cantidad | Carpeta |
|---|---|---|---|
| Reels con música y sonido | 1080 × 1920 | 7 | `reels/` |
| Manifiesto de marca horizontal | 1920 × 1080 | 1 | `reels/` |
| Logo animado con logo sonoro | 16:9 · 9:16 · 1:1 | 3 | `logo/` |
| Historias animadas | 1080 × 1920 · 7 s | 6 | `historias/` |
| Portadas de carrusel en movimiento | 1080 × 1350 · 6 s | 5 | `portadas/` |
| Portadas 16:9 en movimiento | 1920 × 1080 · 6 s | 4 | `portadas/` |
| Ilustraciones en loop | 1080 × 1080 · 4,5 s | 16 | `loops/` |

Todos en H.264 + AAC, 30 fps, audio a −14 LUFS (el nivel que normalizan
Instagram, TikTok y YouTube). Cada video tiene su póster `.jpg` al lado.

Los Reels:

0. **Manifiesto** — con las frases del manual: "No hace falta experiencia… Lo que hace falta es método."
1. **No te falta talento** — el orden correcto de los 6 pasos
2. **5 mentiras sobre vivir de Internet** — cada mito se tacha con glitch
3. **De cero a tu primer producto** — los 6 pasos, uno por escena
4. **Oferta antes que audiencia** — cifra animada + los dos caminos
5. **La IA acelera, no reemplaza**
6. **El dolor que la gente paga**

### Kit de edición — `out/video/kit/`

Overlays con **fondo transparente** para poner encima de videos filmados:
logo animado, zócalo de nombre (16:9 y 9:16), transición glitch (16:9 y
9:16), cierre "Seguinos" y "Guardá este video".

- `.mov` — PNG con alfa y con su sonido. Para Premiere, After Effects,
  DaVinci Resolve y Final Cut.
- `.webm` — VP9 con alfa. Para web y editores de celular.

El zócalo dice "Nombre Apellido / Fundador": se cambia en
`src/motion/specs/kit.mjs` y se regenera.

### Sonido — `out/audio/`

Todo sintetizado desde cero (osciladores, ruido y filtros): **no hay
licencias que pagar ni reclamos de copyright** en ninguna plataforma.

- **Logo sonoro** — impacto grave + tres campanas La · Mi · La. Cierra cada pieza.
- **4 bases musicales** de 64 s en loop exacto: calma, pulso, groove y una
  subida que recorre las cuatro intensidades. La menor, 120 BPM,
  progresión Am9 · Fmaj7 · Cmaj7 · G6.
- **10 efectos**: whooshes, risers, impacto, ticks y glitches.

### Piezas fijas — `out/`

| Formato | Medida | Cantidad | Carpeta |
|---|---|---|---|
| Carruseles (4:5) | 1080 × 1350 | 5 carruseles · 37 placas | `carruseles/` |
| Historias (9:16) | 1080 × 1920 | 6 | `historias/` |
| Cuadradas / citas (1:1) | 1080 × 1080 | 5 | `cuadradas/` |
| Portadas y miniaturas (16:9) | 1920 × 1080 | 4 | `portadas/` |
| Destacadas de Instagram | 1080 × 1920 | 8 + vista en el perfil | `destacadas/` |

**Destacadas.** El manual dice que las destacadas usan la galería de íconos de
la marca (p. 26). Esa página no se pudo bajar del Drive, así que por ahora van
íconos provisorios con la misma lógica: trazo grueso dentro del hexágono
metálico oficial. "Nosotros" lleva el badge oficial tal cual. Cuando tengamos
sus íconos se reemplazan en `scripts/destacadas.mjs` y se corre de nuevo.

---

## Decisiones de marca

**Logo.** Sale en vectores del `LogosVectorizados.ai` (que es un PDF de 9
páginas). El hexágono, las dos mitades del monograma y las 149 franjas
verticales del glitch se animan por separado: el glitch que el manual
describe "sobre el cruce" del isotipo es el gesto central del movimiento.
El degradado metálico del hexágono está muestreado del original
(`#AF7C38` → `#EAD77A` → `#DAAE4A`).

**Color.** La paleta oficial: `#12171E`, `#A37B3C`, `#F0E281`, `#F2F2F2`.
El fondo de pantalla usa `#0E0E0E`, el negro exacto de las portadas del Drive.

**Tipografía.** El manual pide *Neue Haas Grotesk Display Pro*, que es de
licencia paga. Se usa **Inter** con el interletrado cerrado. Si compran la
licencia se cambia en un solo lugar: `src/brand.css`.

**Ilustración.** 16 dibujos vectoriales originales, trazo dorado sobre negro,
todos levantados sobre la geometría del isotipo.

**Movimiento.** Todo corre sobre una grilla de 120 BPM: los cortes caen en el
tiempo fuerte y el audio se genera con las mismas marcas de tiempo, así que
música y animación calzan al frame.

**Zonas seguras.** En los Reels el texto evita el 14% superior, el 22%
inferior y los 120 px de la derecha, donde Instagram y TikTok ponen su interfaz.

**Tono.** El del manual: transparente, directo, sin humo. El copy no usa
cifras inventadas.

---

## Cómo se regenera

```bash
npm run build           # piezas fijas
npm run video           # todo lo audiovisual (logo, reels, relatos, clases, historias, portadas, loops, kit)
npm run audio           # biblioteca de música y efectos
npm run gallery         # galería de revisión
node scripts/render.mjs clases   # solo los carruseles de las clases
```

Para un solo grupo: `node scripts/video/build.mjs reels` (o `relatos`, `clases`,
`logo`, `historias`, `portadas`, `citas`, `loops`, `kit`). Las destacadas:
`node scripts/destacadas.mjs`.

- **Copy de las piezas fijas** → `src/content.mjs`
- **Guiones de los Reels** → `src/motion/specs/reels.mjs`
- **Guiones de las clases** → `src/motion/specs/clases.mjs`
- **Guiones de los relatos y sus tomas** → `src/motion/specs/relatos.mjs`
- **Personaje** → `src/figure.mjs`
- **Plan de publicación** → `src/plan.mjs` (10 semanas, se exporta a `out/plan-de-publicacion.md`)
- **Escenas y compositor** → `src/motion/scenes.mjs`
- **Motor de animación** → `src/motion/engine.js`
- **Síntesis de sonido** → `scripts/audio/synth.py`
- **Color y tipografía** → `src/brand.css`

Requiere Node 22 con Playwright, Python 3 con `numpy scipy pyloudnorm
pillow pymupdf imageio-ffmpeg`, y ffmpeg.

---

## Pendiente de ustedes

- **Confirmar "Lo que hace falta es método" como frase principal.** Está en el
  manual, en la historia de la marca, pero no figura como slogan oficial.
- **Su oferta real y su temario.** Qué venden, a quién, a qué precio y a dónde
  mandar a la gente (link o palabra clave por DM). Con eso las llamadas a la
  acción dejan de ser genéricas.
- **Resultados y testimonios reales**, para las piezas de prueba social. No
  se inventan.
- **"El método de 6 pasos"** (carrusel 1 y Reel 3) se presenta como *el*
  método: si la marca enseña otro, hay que ajustarlo.
- **El usuario de Instagram.** Las piezas llevan `@productosdigitales` como
  marcador, en una constante arriba de `src/content.mjs`.
- **El nombre del zócalo** del kit de edición.
- **La licencia de Neue Haas Grotesk**, si quieren la tipografía exacta.
- **La galería de íconos del manual (p. 26)**, para recrearla en este estilo
  y usarla en las destacadas y en las piezas.
- **Voz en off.** Los Reels están hechos para verse sin sonido y la música
  los sostiene, pero si alguien de la marca graba la voz, entra encima sin
  tocar nada.

---

## Origen de los materiales

`assets-drive/` es la descarga de la carpeta *Productos Digitales* de Google
Drive: portadas, avatar, logo sin fondo y logos vectorizados. Falta
`ManualDeIdentidad-PD.pdf` (42,6 MB): el conector de Drive corta en 10 MB y
la red del entorno bloquea `drive.google.com`. Se leyó completo y queda en el
Drive.
