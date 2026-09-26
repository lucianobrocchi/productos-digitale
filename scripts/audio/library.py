#!/usr/bin/env python3
"""Biblioteca de sonido para el equipo: bases musicales de 60 s en tres
intensidades, el logo sonoro y los efectos sueltos, en WAV y MP3."""

import os
import subprocess
import sys

import numpy as np
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(__file__))
import synth as S  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'out', 'audio')


def write(x, path, lufs=-14.0):
    x = S.master(x, lufs) if lufs is not None else x / (np.abs(x).max() + 1e-9) * 10 ** (-1 / 20)
    wavfile.write(path, S.SR, (x * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', path,
                    '-c:a', 'libmp3lame', '-b:a', '256k', path[:-4] + '.mp3'], check=True)


def loopable(m, dur):
    """Corta en compás exacto y cruza la cola con el comienzo para que el loop no salte."""
    n = S.n_of(dur)
    x = m[:n].copy()
    tail = m[n:n + S.n_of(1.5)]
    k = len(tail)
    x[:k] += tail * np.linspace(1, 0, k)[:, None]
    return x


BASES = {
    # nombre: secciones (t0, t1, energía)
    'base-1-calma': [(0, 64, 0)],
    'base-2-pulso': [(0, 64, 1)],
    'base-3-groove': [(0, 64, 2)],
    'base-4-subida': [(0, 16, 0), (16, 32, 1), (32, 48, 2), (48, 64, 3)],
}

if __name__ == '__main__':
    os.makedirs(os.path.join(OUT, 'musica'), exist_ok=True)
    os.makedirs(os.path.join(OUT, 'efectos'), exist_ok=True)
    for name, secs in BASES.items():
        m = S.music(64, [{'t0': a, 't1': b, 'e': e} for a, b, e in secs], level=.6)
        x = loopable(m, 64) if len(secs) == 1 else m[:S.n_of(64)]
        if len(secs) > 1:                                    # la subida termina con el logo sonoro
            x[-S.n_of(.6):] *= np.linspace(1, 0, S.n_of(.6))[:, None]
        write(x, os.path.join(OUT, 'musica', name + '.wav'))
        print('  ♪', name)

    fx = {
        'logo-sonoro': (S.sonic_logo(), -14),
        'whoosh-subida': (S.whoosh(.8), None),
        'whoosh-bajada': (S.whoosh(.8, up=False, p0=.8, p1=-.8), None),
        'riser-2s': (S.riser(2.0), None),
        'riser-4s': (S.riser(4.0), None),
        'impacto': (S.impact(), None),
        'tick': (S.tick(), None),
        'tick-agudo': (S.tick(freq=3200), None),
        'glitch-corto': (S.glitch_sfx(.2, seed=2), None),
        'glitch-largo': (S.glitch_sfx(.6, seed=5), None),
    }
    for f in os.listdir(os.path.join(OUT, 'efectos')):      # limpia la versión de prueba
        os.remove(os.path.join(OUT, 'efectos', f))
    for name, (x, lufs) in fx.items():
        if x.ndim == 1:
            x = np.stack([x, x], axis=1)
        write(x, os.path.join(OUT, 'efectos', name + '.wav'), lufs)
        print('  ♪', name)
