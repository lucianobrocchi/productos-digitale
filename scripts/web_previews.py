#!/usr/bin/env python3
"""Vistas previas livianas para la galería publicada.

La galería tiene un tope de 256 MB por versión. Los archivos de entrega
(PNG y video 1080p) quedan en out/; acá se generan en build/web/:
- cada pieza fija en JPG de calidad 90, que en pantalla no se distingue,
- los videos 16:9 de las clases en 720p,
- los relatos verticales en 720 × 1280.
"""

import glob
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'out')
WEB = os.path.join(ROOT, 'build', 'web')


def jpg(png):
    rel = os.path.relpath(png, OUT)
    dest = os.path.join(WEB, rel[:-4] + '.jpg')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    Image.open(png).convert('RGB').save(dest, quality=90, optimize=True, progressive=True)
    return os.path.getsize(png), os.path.getsize(dest)


def v720(mp4, vf='scale=1280:-2'):
    rel = os.path.relpath(mp4, OUT)
    dest = os.path.join(WEB, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-vf', vf,
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p',
                    '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '160k', dest], check=True)
    return os.path.getsize(mp4), os.path.getsize(dest)


if __name__ == '__main__':
    pngs = [p for d in ('carruseles', 'historias', 'cuadradas', 'portadas', 'destacadas')
            for p in glob.glob(os.path.join(OUT, d, '**', '*.png'), recursive=True)]
    pngs += glob.glob(os.path.join(OUT, 'iconos', '*.png'))       # las láminas; los íconos sueltos van en PNG con alfa
    with ThreadPoolExecutor(4) as ex:
        r = list(ex.map(jpg, pngs))
    print(f'{len(r)} piezas fijas: {sum(a for a, _ in r) / 1e6:.0f} MB en PNG → {sum(b for _, b in r) / 1e6:.0f} MB en JPG')
    vids = sorted(glob.glob(os.path.join(OUT, 'video', 'clases', 'k*-16x9.mp4')))
    with ThreadPoolExecutor(2) as ex:
        r = list(ex.map(v720, vids))
    print(f'{len(r)} clases 16:9: {sum(a for a, _ in r) / 1e6:.0f} MB → {sum(b for _, b in r) / 1e6:.0f} MB en 720p')
    vids = sorted(glob.glob(os.path.join(OUT, 'video', 'relatos', '*.mp4')))
    with ThreadPoolExecutor(2) as ex:
        r = list(ex.map(lambda v: v720(v, 'scale=720:-2'), vids))
    print(f'{len(r)} relatos: {sum(a for a, _ in r) / 1e6:.0f} MB → {sum(b for _, b in r) / 1e6:.0f} MB en 720 × 1280')
