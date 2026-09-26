# Productos Digitales — piezas de contenido

Sistema de piezas para redes de **Productos Digitales**, construido sobre el
Manual de Identidad de la marca. Todo lo que hay acá se genera por código: se
edita el copy, se vuelve a correr y salen los PNG listos para publicar.

---

## Qué hay

| Formato | Medida | Cantidad | Carpeta |
|---|---|---|---|
| Carruseles (4:5) | 1080 × 1350 | 5 carruseles · 37 placas | `out/carruseles/` |
| Historias (9:16) | 1080 × 1920 | 6 | `out/historias/` |
| Cuadradas / citas (1:1) | 1080 × 1080 | 5 | `out/cuadradas/` |
| Portadas y miniaturas (16:9) | 1920 × 1080 | 4 | `out/portadas/` |

**52 piezas.** Además, una tira de revisión por carrusel en
`out/hojas-de-contacto/` para verlos en orden de deslizamiento.

### Los cinco carruseles

1. **`c1-metodo`** — De cero a tu primer producto digital (el método en 6 pasos)
2. **`c2-mentiras`** — 5 mentiras sobre vivir de Internet
3. **`c3-oferta`** — No necesitás audiencia. Necesitás oferta.
4. **`c4-dolor`** — Encontrá el dolor que la gente paga por resolver
5. **`c5-ia`** — La IA no reemplaza el camino. Lo acelera.

---

## Decisiones de marca

Todo sale del manual. Lo que tuve que resolver y conviene que revisen:

**Color.** La paleta oficial completa: `#12171E` negro profundo, `#A37B3C`
dorado, `#F0E281` dorado claro, `#F2F2F2` neutro. El fondo de pantalla usa
`#0E0E0E`, que es el negro exacto muestreado de las portadas oficiales del
Drive, un punto por debajo del `#12171E` de imprenta.

**Tipografía.** El manual pide *Neue Haas Grotesk Display Pro* (Bold para
titulares, Regular para texto), que es una licencia paga. Las piezas usan
**Inter** — la grotesca neutra libre más cercana — con el interletrado cerrado
para imitar el color tipográfico de la Neue Haas. Si compran la licencia, se
cambia en un solo lugar: `src/brand.css`. Nada más se toca.

**Logo.** El Drive trae el lockup en negro y el avatar en blanco sobre
hexágono oscuro, pero no la versión para fondo negro que usan las portadas
(hexágono dorado + texto claro). La reconstruí en `brand/logo/` respetando las
proporciones exactas del archivo original: hexágono de 267 × 241, texto de
862 × 242, separación de 40 px.

**Ilustración.** Esto es lo que más se despega de lo que había. Las portadas
oficiales usan fotografía y render 3D; acá hay **16 ilustraciones originales
dibujadas en vectores**, trazo dorado sobre negro, todas construidas sobre la
misma geometría que arma el isotipo: hexágono regular de vértices a 0°, 60°,
120°… y esquinas redondeadas. El hexágono vuelve como nodo, como sello y como
retícula de fondo. Se ven todas juntas en `build/sheet.png`.

**Tono.** El del manual: transparente y directo, sin humo, cercano, profesional
y motivador. Español rioplatense, que es como habla la marca.

---

## Para cambiar algo

```bash
npm run build          # render + reducción a tamaño de entrega
npm run sheet          # hoja de contacto de las ilustraciones
```

- **Copy** → `src/content.mjs`. Está todo ahí, separado del diseño.
- **Color, tipografía, espaciado** → `src/brand.css`.
- **Ilustraciones** → `src/illus.mjs`.
- **Composición de cada tipo de placa** → `scripts/render.mjs`.

Los titulares se componen en líneas fijas y un script reduce el cuerpo hasta
que la línea más ancha entra en la caja: se puede reescribir el copy sin que
se rompa ninguna pieza.

---

## Pendiente de ustedes

- **El usuario de Instagram.** Las piezas llevan `@productosdigitales` como
  marcador. Está en una sola constante, arriba de `src/content.mjs`.
- **La licencia de Neue Haas Grotesk**, si quieren la tipografía exacta del
  manual.

---

## Origen de los materiales

`assets-drive/` es la descarga de la carpeta *Productos Digitales* de Google
Drive: las cuatro portadas, el avatar, el logo sin fondo y los logos
vectorizados. `LogosVectorizados.ai` es en realidad un PDF de 9 páginas, así
que va también copiado como `.pdf` para poder abrirlo sin Illustrator.

Falta un archivo: **`ManualDeIdentidad-PD.pdf` (42,6 MB)**. El conector de
Drive corta las descargas en 10 MB y la política de red del entorno bloquea
`drive.google.com`, así que el binario no se pudo traer. Sí se leyó completo:
todas las decisiones de este repo —paleta, tipografía, construcción del
isotipo, tono— salen de sus 30 páginas. Queda en el Drive.
