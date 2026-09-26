#!/usr/bin/env python3
"""Reduce las piezas renderizadas al tamaño exacto de entrega y arma las
hojas de contacto de cada carrusel para revisarlas de un vistazo."""

import glob
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'out')

# Se renderiza a 2x y se reduce: el antialias de la tipografía grande y de
# los trazos con resplandor queda bastante más limpio que a 1x.
DESTINO = {(2160, 2700): (1080, 1350),   # carrusel / post vertical 4:5
           (2160, 2160): (1080, 1080),   # cuadrada 1:1
           (2160, 3840): (1080, 1920),   # historia 9:16
           (3840, 2160): (1920, 1080)}   # portada 16:9


def reducir():
    n = 0
    for f in sorted(glob.glob(os.path.join(OUT, '**', '*.png'), recursive=True)):
        im = Image.open(f)
        destino = DESTINO.get(im.size)
        if destino is None:
            continue                      # ya está en tamaño final
        im.convert('RGB').resize(destino, Image.LANCZOS).save(f, optimize=True)
        n += 1
    return n


def hojas_de_contacto():
    """Una tira horizontal por carrusel, en orden de deslizamiento."""
    hechas = []
    for carpeta in sorted(glob.glob(os.path.join(OUT, 'carruseles', '*'))):
        files = sorted(glob.glob(os.path.join(carpeta, '*.png')))
        if not files:
            continue
        miniaturas = []
        for f in files:
            im = Image.open(f)
            im.thumbnail((360, 450), Image.LANCZOS)
            miniaturas.append(im)
        gap, borde = 16, 24
        W = sum(i.width for i in miniaturas) + gap * (len(miniaturas) - 1) + borde * 2
        H = max(i.height for i in miniaturas) + borde * 2
        hoja = Image.new('RGB', (W, H), (14, 14, 14))
        x = borde
        for i in miniaturas:
            hoja.paste(i, (x, borde))
            x += i.width + gap
        dest = os.path.join(OUT, 'hojas-de-contacto',
                            os.path.basename(carpeta) + '.png')
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        hoja.save(dest, optimize=True)
        hechas.append((os.path.basename(carpeta), len(files)))
    return hechas


if __name__ == '__main__':
    print(f'{reducir()} piezas reducidas al tamaño de entrega')
    for nombre, n in hojas_de_contacto():
        print(f'  hoja de contacto · {nombre}: {n} placas')
    total = len(glob.glob(os.path.join(OUT, '**', '*.png'), recursive=True))
    peso = sum(os.path.getsize(f) for f in
               glob.glob(os.path.join(OUT, '**', '*.png'), recursive=True)) / 1e6
    print(f'{total} archivos en out/ · {peso:.1f} MB')
