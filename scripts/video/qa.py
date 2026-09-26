#!/usr/bin/env python3
"""Control de calidad de los videos terminados: medidas, fps, streams,
sonoridad integrada y picos. Marca todo lo que se salga de lo esperado."""

import glob
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
V = os.path.join(ROOT, 'out', 'video')


def probe(f):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', f], capture_output=True, text=True).stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', out)
    dur = int(d[1]) * 3600 + int(d[2]) * 60 + float(d[3]) if d else 0
    vs = re.search(r'Video: (\w+).*?, (\d+)x(\d+)', out)
    fps = re.search(r'([\d.]+) fps', out)
    aud = 'Audio:' in out
    return {'dur': dur, 'codec': vs[1] if vs else None, 'w': int(vs[2]) if vs else 0,
            'h': int(vs[3]) if vs else 0, 'fps': float(fps[1]) if fps else 0, 'audio': aud}


def loud(f):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f, '-af', 'ebur128=peak=true',
                          '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = re.findall(r'I:\s+(-?[\d.]+) LUFS', out)
    p = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', out)
    return (float(i[-1]) if i else None, float(p[-1]) if p else None)


if __name__ == '__main__':
    files = sorted(glob.glob(os.path.join(V, '**', '*.mp4'), recursive=True)
                   + glob.glob(os.path.join(V, '**', '*.mov'), recursive=True))
    files = [f for f in files if '.silent.' not in f]
    problemas, filas = [], []
    for f in files:
        r = probe(f)
        rel = os.path.relpath(f, V)
        lu, pk = loud(f) if r['audio'] else (None, None)
        size = os.path.getsize(f) / 1e6
        filas.append((rel, r, lu, pk, size))
        if r['fps'] and abs(r['fps'] - 30) > .01:
            problemas.append(f'{rel}: {r["fps"]} fps')
        if r['audio'] and lu is not None and not (-16.5 <= lu <= -13):
            problemas.append(f'{rel}: sonoridad {lu} LUFS')
        if r['audio'] and pk is not None and pk > -0.5:
            problemas.append(f'{rel}: pico {pk} dBFS')
        if 'loops/' not in rel and not r['audio']:
            problemas.append(f'{rel}: sin audio')
        if size > 15 and not rel.endswith('.mov'):
            problemas.append(f'{rel}: {size:.1f} MB supera 15 MB')
        poster = re.sub(r'\.(mp4|mov)$', '.jpg', f)
        if not os.path.exists(poster):
            problemas.append(f'{rel}: falta póster')
    for rel, r, lu, pk, size in filas:
        a = f'{lu:6.1f} LUFS {pk:5.1f} dBFS' if lu is not None else '      sin audio      '
        print(f'{rel:42s} {r["w"]}x{r["h"]:<5} {r["dur"]:5.1f}s {r["codec"]:6s} {a}  {size:5.1f} MB')
    total = sum(x[4] for x in filas)
    print(f'\n{len(filas)} archivos · {total:.0f} MB')
    print('PROBLEMAS:' if problemas else 'Sin problemas.')
    for p in problemas:
        print('  -', p)
    sys.exit(1 if problemas else 0)
