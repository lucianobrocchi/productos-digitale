# Productos Digitales — sistema de contenido

Piezas fijas, video, sonido y un kit de edición para **Productos Digitales**,
construidos sobre el Manual de Identidad y el logo vectorial oficial. Todo se
genera por código: se edita el copy, se vuelve a correr y salen los archivos
listos para publicar.

---

## Qué hay

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
npm run video           # todo lo audiovisual (logo, reels, historias, portadas, loops, kit)
npm run audio           # biblioteca de música y efectos
npm run gallery         # galería de revisión
```

Para un solo grupo: `node scripts/video/build.mjs reels` (o `logo`,
`historias`, `portadas`, `loops`, `kit`).

- **Copy de las piezas fijas** → `src/content.mjs`
- **Guiones de los Reels** → `src/motion/specs/reels.mjs`
- **Escenas y compositor** → `src/motion/scenes.mjs`
- **Motor de animación** → `src/motion/engine.js`
- **Síntesis de sonido** → `scripts/audio/synth.py`
- **Color y tipografía** → `src/brand.css`

Requiere Node 22 con Playwright, Python 3 con `numpy scipy pyloudnorm
pillow pymupdf imageio-ffmpeg`, y ffmpeg.

---

## Pendiente de ustedes

- **El usuario de Instagram.** Las piezas llevan `@productosdigitales` como
  marcador, en una constante arriba de `src/content.mjs`.
- **El nombre del zócalo** del kit de edición.
- **La licencia de Neue Haas Grotesk**, si quieren la tipografía exacta.
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
