#!/usr/bin/env python3
"""
Identidad sonora de Productos Digitales, sintetizada desde cero.

Todo el audio es original (osciladores, ruido y filtros), así que no hay
licencias de música que pagar ni reclamos de copyright en Instagram,
TikTok o YouTube.

- Tonalidad: La menor. Progresión Am9 · Fmaj7 · Cmaj7 · G6, a 120 BPM:
  oscura pero ascendente, como el oro sobre negro de la marca.
- Logo sonoro: tres campanas FM en quinta y octava (La · Mi · La) sobre
  un impacto grave. Es la firma que cierra cada pieza.
- Glitch sonoro: el mismo gesto que el isotipo, en audio.
"""

import json
import os
import sys

import numpy as np
import pyloudnorm as pyln
from scipy import signal
from scipy.io import wavfile

SR = 48000
BPM = 120


def n_of(sec):
    return int(round(sec * SR))


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def pan(mono, p):
    """Paneo de potencia constante. p en [-1, 1]."""
    a = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)], axis=1)


def lp(x, fc, order=2):
    sos = signal.butter(order, min(fc, SR * .45), 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def hp(x, fc, order=2):
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, min(hi, SR * .45)], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def add(buf, clip, at):
    """Suma un clip (mono o estéreo) en el buffer estéreo a partir de `at` segundos."""
    if clip.ndim == 1:
        clip = np.stack([clip, clip], axis=1)
    i = n_of(at)
    if i >= len(buf):
        return
    if i < 0:
        clip = clip[-i:]
        i = 0
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[:j - i]


RNG = np.random.default_rng(7)


def noise(n):
    return RNG.standard_normal(n)


# ------------------------------------------------------------ reverberación

def make_ir(dur=2.6, bright=.45, seed=3):
    r = np.random.default_rng(seed)
    t = np.arange(n_of(dur)) / SR
    ir = np.zeros((len(t), 2))
    for ch in range(2):
        n = r.standard_normal(len(t))
        dark = lp(n, 2400) * np.exp(-t / (dur * .36))
        light = hp(n, 3000) * np.exp(-t / (dur * .08)) * bright
        ir[:, ch] = dark + light
    ir[:n_of(.012)] = 0                                    # pre-delay
    return ir / np.sqrt((ir ** 2).sum() / 2)


IR_HALL = make_ir(2.8, .35)
IR_ROOM = make_ir(1.1, .6, seed=5)


def reverb(x, ir=IR_HALL, wet=.25):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    out = np.zeros((len(x) + len(ir) - 1, 2))
    for ch in range(2):
        out[:, ch] = signal.fftconvolve(x[:, ch], ir[:, ch])
    out[:len(x)] = out[:len(x)] * wet + x * (1 - wet * .5)
    out[len(x):] *= wet
    return out


# ------------------------------------------------------------- instrumentos

def kick(level=1.0):
    n = n_of(.45)
    t = np.arange(n) / SR
    f = 44 + 110 * np.exp(-t / .035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / .16)
    click = hp(noise(n), 2500) * np.exp(-t / .004) * .25
    return np.tanh((body + click) * 1.6) * level * .9


def hat(open_=False, level=1.0):
    n = n_of(.28 if open_ else .06)
    t = np.arange(n) / SR
    x = hp(noise(n), 7500, 4) * np.exp(-t / (.07 if open_ else .012))
    return x * level * .32


def clap(level=1.0):
    n = n_of(.35)
    t = np.arange(n) / SR
    burst = np.zeros(n)
    for k, d in enumerate((0, .011, .022)):
        i = n_of(d)
        m = n_of(.012) if k < 2 else n
        seg = np.exp(-np.arange(m) / SR / (.006 if k < 2 else .09))
        burst[i:i + m] += seg[:n - i] if i + m > n else seg
    x = bp(noise(n), 900, 3200) * burst
    return x * level * .55


def sub(freq, dur, level=1.0):
    n = n_of(dur)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + .18 * np.sin(4 * np.pi * freq * t)
    env = np.minimum(1, t / .02) * np.minimum(1, (dur - t) / .08).clip(0)
    return x * env * level * .5


def pad_note(freq, dur, bright=1400, level=1.0, rel=.9):
    n = n_of(dur + rel)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for det, p in ((-.09, -.7), (0, 0), (.1, .7)):         # tres sierras desafinadas
        f = freq * 2 ** (det / 12)
        saw = signal.sawtooth(2 * np.pi * f * t + RNG.random() * 6.28)
        out += pan(saw, p)
    att = np.minimum(1, t / .55)
    relv = np.clip((dur + rel - t) / rel, 0, 1)
    env = att * np.minimum(1, relv) ** 1.5
    out = lp(out, bright, 2) * env[:, None]
    return out * level * .085


def pluck(freq, level=1.0, dec=.32):
    n = n_of(dec * 3)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * freq * 2 * t) * 1.2 * np.exp(-t / .05)
    x = np.sin(2 * np.pi * freq * t + mod) * np.exp(-t / dec)
    x += .3 * np.sin(2 * np.pi * freq * 2.001 * t) * np.exp(-t / (dec * .5))
    return x * level * .16


def bell(freq, dur=3.2, level=1.0):
    """Campana FM: portadora f, moduladora a 3,5·f con índice que decae."""
    n = n_of(dur)
    t = np.arange(n) / SR
    idx = 3.2 * np.exp(-t / .35) + .4
    x = np.sin(2 * np.pi * freq * t + idx * np.sin(2 * np.pi * freq * 3.5 * t))
    x += .35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / .5)
    env = np.minimum(1, t / .003) * np.exp(-t / (dur * .32))
    return x * env * level * .22


# ------------------------------------------------------------------- efectos

def whoosh(dur=.8, level=1.0, up=True, p0=-.8, p1=.8):
    n = n_of(dur)
    x = noise(n)
    f, tt, Z = signal.stft(x, SR, nperseg=1024)
    k = tt / tt[-1]
    shape = np.sin(np.pi * k) ** 1.5
    center = 250 * (30 ** (k if up else 1 - k))           # barrido logarítmico
    band = np.exp(-((np.log(f[:, None] + 1) - np.log(center[None, :])) ** 2) / .35)
    _, y = signal.istft(Z * band * shape[None, :], SR, nperseg=1024)
    y = y[:n]
    y /= np.abs(y).max() + 1e-9
    pans = np.linspace(p0, p1, n)
    a = (pans + 1) * np.pi / 4
    st = np.stack([y * np.cos(a), y * np.sin(a)], axis=1)
    return st * level * .5


def riser(dur=2.0, level=1.0):
    n = n_of(dur)
    t = np.arange(n) / SR
    k = t / dur
    ns = noise(n)
    f, tt, Z = signal.stft(ns, SR, nperseg=1024)
    cut = 400 * (25 ** (tt / tt[-1]))
    mask = 1 / (1 + (f[:, None] / cut[None, :]) ** 4)
    _, y = signal.istft(Z * mask, SR, nperseg=1024)
    y = y[:n] / (np.abs(y).max() + 1e-9)
    tone_f = 180 * 2 ** (k * 3)
    tone = np.sin(2 * np.pi * np.cumsum(tone_f) / SR) * .35
    env = k ** 2.2
    x = (y * .8 + tone) * env
    return np.stack([x * .95, x], axis=1) * level * .42


def impact(level=1.0):
    n = n_of(2.2)
    t = np.arange(n) / SR
    f = 34 + 40 * np.exp(-t / .12)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .55)
    crack = lp(noise(n), 3500) * np.exp(-t / .05) * .5
    x = np.tanh((boom * 1.3 + crack) * 1.4)
    return reverb(x * level * .75, IR_HALL, .3)


def tick(level=1.0, freq=2400):
    n = n_of(.05)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t / .008)
    x += hp(noise(n), 4000) * np.exp(-t / .002) * .4
    return x * level * .3


def glitch_sfx(dur=.34, level=1.0, seed=1):
    """Tartamudeo digital: ruido muestreado y retenido, recorte de bits y pulsos."""
    r = np.random.default_rng(seed)
    n = n_of(dur)
    out = np.zeros(n)
    i = 0
    while i < n:
        seg = n_of(r.uniform(.012, .045))
        kind = r.integers(0, 3)
        tt = np.arange(seg) / SR
        if kind == 0:                                     # ruido retenido
            hold = int(r.integers(8, 90))
            base = r.standard_normal(seg // hold + 2)
            s = np.repeat(base, hold)[:seg]
        elif kind == 1:                                   # pulso cuadrado
            s = np.sign(np.sin(2 * np.pi * r.uniform(180, 1400) * tt))
        else:                                             # silencio
            s = np.zeros(seg)
        s = np.round(s * 4) / 4                           # recorte de bits
        out[i:i + seg] = s[:max(0, min(seg, n - i))]
        i += seg
    out = hp(out, 150) * np.exp(-np.arange(n) / SR / (dur * .8))
    st = np.stack([out * r.uniform(.6, 1), out * r.uniform(.6, 1)], axis=1)
    return st * level * .28


def sonic_logo(level=1.0):
    """La firma: impacto grave + La5 · Mi6 · La6 en campana, con cola larga."""
    buf = np.zeros((n_of(4.6), 2))
    add(buf, impact(.9), 0)
    for k, (m, p) in enumerate(((81, -.35), (88, .35), (93, 0))):
        add(buf, pan(bell(midi(m), 3.4, .95 - k * .12), p), k * .14)
    # colchón: quinta abierta La-Mi que respira debajo
    for m in (57, 64, 69):
        add(buf, pad_note(midi(m), 1.6, 2600, .9, 1.4), .02)
    wet = reverb(buf, IR_HALL, .42)[:len(buf)]
    return wet * level


def sub_drop(level=1.0):
    """808 que cae: el peso debajo de un golpe."""
    n = n_of(1.1)
    t = np.arange(n) / SR
    f = 38 + 70 * np.exp(-t / .06)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .42)
    x = np.tanh(x * 1.6) * .9
    return np.stack([x, x], axis=1) * level * .6


def swish(level=1.0, dur=.22, up=True):
    """Aire corto y brillante para movimientos chicos (tarjetas, líneas)."""
    n = n_of(dur)
    k = np.arange(n) / n
    x = bp(noise(n), 1800, 9000) * np.sin(np.pi * k) ** 2
    y = hp(x, 2500 if up else 1200)
    return np.stack([y * (1 - k * .5), y * (.5 + k * .5)], axis=1) * level * .35


def whip(level=1.0):
    """Barrido de cámara: ruido que pasa de izquierda a derecha con un sube-baja rápido."""
    return whoosh(.32, level * 1.1, True, -.95, .95) + whoosh(.32, level * .5, False, .9, -.9) * .4


def shimmer(level=1.0):
    """Brillo metálico: campanitas agudas en La mayor que caen en cascada."""
    buf = np.zeros((n_of(1.6), 2))
    for k, m in enumerate((93, 97, 100, 105)):
        add(buf, pan(bell(midi(m), 1.2, .5 - k * .07), -.5 + k * .33), k * .045)
    return reverb(buf, IR_HALL, .5)[:len(buf)] * level * 1.5


def pop(level=1.0, freq=700):
    """Burbuja de chat: blip con subida de tono."""
    n = n_of(.09)
    t = np.arange(n) / SR
    f = freq * (1 + 1.2 * (t / .09))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .03)
    return np.stack([x, x], axis=1) * level * .35


SFX = {
    'sub': lambda c: sub_drop(c.get('level', 1)),
    'swish': lambda c: swish(c.get('level', 1), c.get('len', .22)),
    'whip': lambda c: whip(c.get('level', 1)),
    'shimmer': lambda c: shimmer(c.get('level', 1)),
    'pop': lambda c: pop(c.get('level', 1), c.get('freq', 700)),
    'whoosh': lambda c: whoosh(c.get('len', .8), c.get('level', 1), c.get('up', True)),
    'riser': lambda c: riser(c.get('len', 2.0), c.get('level', 1)),
    'hit': lambda c: impact(c.get('level', .8)),
    'tick': lambda c: tick(c.get('level', 1), c.get('freq', 2400)),
    'glitch': lambda c: glitch_sfx(c.get('len', .34), c.get('level', 1), c.get('seed', 1)),
    'logo': lambda c: sonic_logo(c.get('level', 1)),
}

# ---------------------------------------------------------------- la música

# Am9 · Fmaj7 · Cmaj7 · G6  (una por compás)
PROG = [
    (45, [60, 64, 67, 71]),        # La   · Do Mi Sol Si
    (41, [57, 60, 64, 65]),        # Fa   · La Do Mi Fa
    (48, [55, 59, 60, 64]),        # Do   · Sol Si Do Mi
    (43, [59, 62, 64, 67]),        # Sol  · Si Re Mi Sol
]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]


def energy_at(sections, t):
    e = 0
    for s in sections:
        if s['t0'] <= t < s['t1']:
            e = s['e']
    return e


def music(dur, sections, bpm=BPM, level=1.0):
    beat = 60 / bpm
    bar = beat * 4
    n = n_of(dur + 3)
    drums = np.zeros((n, 2))
    bass = np.zeros((n, 2))
    pads = np.zeros((n, 2))
    arps = np.zeros((n, 2))
    duck = np.ones(n)
    nbars = int(np.ceil(dur / bar))

    for b in range(nbars):
        t0 = b * bar
        root, chord = PROG[b % 4]
        e_bar = energy_at(sections, t0 + .01)
        bright = [900, 1300, 1900, 2800][e_bar]
        for m in chord:
            add(pads, pad_note(midi(m), bar, bright, (1.45, 1.0, 1.0, 1.15)[e_bar]), t0)
        if e_bar >= 1:
            add(pads, pad_note(midi(chord[-1] + 12), bar, bright * .8, .35), t0)
        for s in range(4):                                  # pulso por negra
            t = t0 + s * beat
            if t >= dur:
                break
            e = energy_at(sections, t + .001)
            if e >= 1:
                add(bass, sub(midi(root - 12), beat * .92, .9 if e < 2 else 1), t)
            four = e >= 2 or (e == 1 and s in (0, 2))
            if four:
                k = kick(.75 if e == 1 else 1)
                add(drums, k, t)
                i = n_of(t)
                env = 1 - .6 * np.exp(-np.arange(n_of(.3)) / SR / .09)
                j = min(n, i + len(env))
                duck[i:j] = np.minimum(duck[i:j], env[:j - i])
            if e >= 2 and s in (1, 3):
                add(drums, reverb(clap(.8), IR_ROOM, .3), t)
            if e >= 1:                                       # corcheas / semicorcheas de hat
                steps = 4 if e >= 2 else 2
                for h in range(steps):
                    th = t + h * beat / steps + (beat / steps * .08 if h % 2 else 0)
                    lvl = (.55 if h % 2 else .32) * (1 if e >= 2 else .7)
                    add(drums, pan(hat(False, lvl), .25), th)
            if e >= 2:                                       # arpegio dorado
                steps = 4 if e >= 3 else 2
                for a in range(steps):
                    ta = t + a * beat / steps
                    note = chord[ARP[(s * steps + a) % len(ARP)]] + 12
                    add(arps, pan(pluck(midi(note), .8), .4 * np.sin(ta * 1.3)), ta)

    duck = np.stack([duck, duck], axis=1)
    mix = (drums * .9 + bass * duck * .95 + pads * duck * 1.0 +
           reverb(arps, IR_HALL, .45)[:n] * .8)
    mix = hp(mix, 28)
    return mix * level


# ------------------------------------------------------------------- master

def master(x, target=-14.0):
    meter = pyln.Meter(SR)
    loud = meter.integrated_loudness(x)
    if np.isfinite(loud):
        x = x * 10 ** ((target - loud) / 20)
    # limitador suave con techo en -1 dBFS
    ceil = 10 ** (-1 / 20)
    x = np.tanh(x / ceil) * ceil
    return x


def render(spec, out):
    dur = spec['dur']
    buf = np.zeros((n_of(dur + 5), 2))
    if spec.get('music', True):
        m = music(dur, spec.get('sections', [{'t0': 0, 't1': dur, 'e': 2}]),
                  spec.get('bpm', BPM), spec.get('musicLevel', .55))
        end = spec.get('musicEnd')
        if end is not None:                                # la música cede lugar al logo sonoro
            a, b = n_of(max(0, end - .5)), n_of(end + .25)
            m[a:b] *= np.linspace(1, 0, b - a)[:, None] ** 1.5
            m[b:] = 0
        add(buf, m, 0)
    for c in spec.get('cues', []):
        f = SFX.get(c['type'])
        if f:
            add(buf, f(c), c['t'])
    buf = buf[:n_of(dur)]
    fade = n_of(min(.6, dur * .1))                         # salida limpia
    buf[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    buf = master(buf, spec.get('lufs', -14.0))
    wavfile.write(out, SR, (buf * 32767).astype(np.int16))
    return out


if __name__ == '__main__':
    # uso: synth.py spec.json salida.wav   |   synth.py lote.json   (lista de {spec, out})
    if len(sys.argv) == 3:
        render(json.load(open(sys.argv[1])), sys.argv[2])
    else:
        for job in json.load(open(sys.argv[1])):
            render(job['spec'], job['out'])
            print('  ♪', os.path.basename(job['out']), flush=True)
