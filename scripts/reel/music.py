#!/usr/bin/env python3
"""Render an original 43-second instrumental for Bhoomika's portfolio reel.

No recordings, samples, or downloaded assets are used. The notes, synthesis,
arrangement, and transition sounds are generated here. Requires Python 3,
NumPy, and FFmpeg (for loudness measurement and mastering).

Example:
    python3 scripts/reel/music.py --output /tmp/bhoomika-reel-render/music.wav
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import wave

import numpy as np


SAMPLE_RATE = 48_000
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 43
SCENE_CUTS = [0, 3, 7, 10, 18, 21, 24, 27, 35, 43]
RNG = np.random.default_rng(20261020)
MIX = np.zeros((round(SAMPLE_RATE * DURATION), 2), dtype=np.float64)


def frequency(midi: float) -> float:
    return 440 * 2 ** ((midi - 69) / 12)


def timeline(seconds: float) -> np.ndarray:
    return np.arange(round(SAMPLE_RATE * seconds), dtype=np.float64) / SAMPLE_RATE


def soften_edges(signal: np.ndarray, attack: float = 0.006, release: float = 0.12):
    attack_samples = min(len(signal), max(2, round(attack * SAMPLE_RATE)))
    release_samples = min(len(signal), max(2, round(release * SAMPLE_RATE)))
    signal[:attack_samples] *= np.sin(np.linspace(0, np.pi / 2, attack_samples)) ** 2
    signal[-release_samples:] *= np.cos(np.linspace(0, np.pi / 2, release_samples)) ** 2
    return signal


def add(signal: np.ndarray, at: float, gain: float, pan: float = 0, echo: bool = False):
    """Equal-power pan, with quiet cross-panned diffusion for the tonal voices."""
    for delay, attenuation, position in (
        [(0, 1, pan), (0.225, 0.13, -pan * 0.7), (0.375, 0.08, pan * 0.4)]
        if echo else [(0, 1, pan)]
    ):
        start = round((at + delay) * SAMPLE_RATE)
        begin = max(0, -start)
        start = max(0, start)
        count = min(len(signal) - begin, len(MIX) - start)
        if count <= 0:
            continue
        angle = (position + 1) * np.pi / 4
        stereo = np.array([math.cos(angle), math.sin(angle)])
        MIX[start:start + count] += (
            signal[begin:begin + count, None] * stereo * gain * attenuation
        )


def key(midi: float, seconds: float = 1.4, velvet: bool = False) -> np.ndarray:
    """Rounded plucked electric keys: short upper partials, soft long body."""
    t = timeline(seconds)
    f = frequency(midi)
    body = (
        np.sin(2 * np.pi * f * t) * np.exp(-t / (0.72 if velvet else 0.42))
        + 0.23 * np.sin(2 * np.pi * f * 2.002 * t) * np.exp(-t / 0.19)
        + 0.07 * np.sin(2 * np.pi * f * 3.001 * t) * np.exp(-t / 0.1)
        + 0.035 * np.sin(2 * np.pi * f * 4.004 * t) * np.exp(-t / 0.055)
    )
    body += 0.13 * np.sin(2 * np.pi * f * 1.0018 * t) * np.exp(-t / 0.58)
    return soften_edges(body, 0.009, 0.2)


def pad(midi: float, seconds: float, phase: float) -> np.ndarray:
    t = timeline(seconds)
    f = frequency(midi)
    sound = (
        np.sin(2 * np.pi * f * t + phase)
        + 0.22 * np.sin(2 * np.pi * 2 * f * t + phase)
        + 0.17 * np.sin(2 * np.pi * f * 1.0013 * t + phase + 0.5)
    )
    sound *= 0.84 + 0.08 * np.sin(2 * np.pi * 0.3 * t + phase)
    return soften_edges(sound, 0.55, 0.72)


def bass(midi: float, seconds: float) -> np.ndarray:
    t = timeline(seconds)
    f = frequency(midi)
    sound = (
        np.sin(2 * np.pi * f * t)
        + 0.15 * np.sin(2 * np.pi * 2 * f * t)
        + 0.055 * np.sin(2 * np.pi * 3 * f * t)
    ) * np.exp(-t / 0.65)
    return soften_edges(sound, 0.018, 0.11)


def band_noise(seconds: float, narrow: bool = False) -> np.ndarray:
    noise = RNG.normal(0, 1, round(seconds * SAMPLE_RATE))
    # Subtract a slower low-pass from a faster one: soft, band-limited texture.
    fast_size, slow_size = (13, 90) if narrow else (6, 31)
    fast = np.convolve(noise, np.ones(fast_size) / fast_size, mode="same")
    slow = np.convolve(noise, np.ones(slow_size) / slow_size, mode="same")
    return (fast - slow) * 2.4


def kick() -> np.ndarray:
    t = timeline(0.39)
    phase = 2 * np.pi * (46 * t + 100 * 0.018 * (1 - np.exp(-t / 0.018)))
    sound = np.sin(phase) * np.exp(-t / 0.105)
    return soften_edges(sound, 0.003, 0.06)


def brush() -> np.ndarray:
    t = timeline(0.19)
    sound = (
        band_noise(0.19) * np.exp(-t / 0.039)
        + 0.18 * np.sin(2 * np.pi * 178 * t) * np.exp(-t / 0.033)
    )
    return soften_edges(sound, 0.005, 0.04)


def shaker() -> np.ndarray:
    t = timeline(0.085)
    sound = band_noise(0.085) * np.exp(-t / 0.018)
    return soften_edges(sound, 0.004, 0.025)


def whoosh(at: float, gain: float):
    seconds = 0.62
    t = timeline(seconds)
    sound = band_noise(seconds, narrow=True)
    sound *= np.sin(np.pi * t / seconds) ** 3
    add(sound, at - 0.46, gain, -0.22)
    add(sound, at - 0.42, gain * 0.45, 0.35)


def transition_chime(at: float, note: int, gain: float = 0.07):
    add(key(note, 1.7, velvet=True), at + 0.012, gain, -0.3, echo=True)
    add(key(note + 7, 1.4), at + 0.105, gain * 0.55, 0.35, echo=True)


def compose():
    # Original D-minor/add9 progression. A 120 BPM grid supports half-second edits.
    progression = [(38, [62, 65, 69, 76]), (34, [62, 65, 69, 72]),
                   (41, [60, 65, 69, 76]), (36, [60, 64, 67, 74])]
    for bar in range(22):
        at = bar * BAR
        root, notes = progression[(bar // 2) % 4]
        if 34 <= at < 36:
            continue
        ending = at >= 36
        calm = 21 <= at < 24
        for i, note in enumerate(notes):
            add(pad(note - 12, BAR + .4, i * .6), at,
                .019 if ending else .016, (i - 1.5) * .35)
        for beat in range(4):
            tick = at + beat * BEAT
            if tick >= 42:
                continue
            add(bass(root + (7 if beat == 3 else 0), .42), tick,
                .12 if ending or calm else .18)
            if not ending and not calm:
                add(kick(), tick, .32 if beat % 2 == 0 else .20)
                if beat % 2:
                    add(brush(), tick, .13, .12)
                add(shaker(), tick + .25, .048, -.3 if beat % 2 else .3)
            elif beat == 0:
                add(kick(), tick, .16)
        for i, beat in enumerate([0, .5, 1.5, 2, 2.5, 3.5]):
            if ending and i % 2:
                continue
            note = notes[(i + bar) % 4] + (12 if 27 <= at < 34 else 0)
            add(key(note, .8, velvet=ending), at + beat * BEAT,
                .075 if calm else .11, (-.5, .4, -.15)[i % 3], echo=True)
    # Editorial impacts, light mechanical snaps and short pencil-like textures.
    for at in [.25, 1.25, 3, 4.25, 5.25, 7, 8, 10, 12.5, 14.5, 18, 19.5,
               21, 24, 25.5, 27, 29.5, 32, 35, 36.5, 37.1]:
        add(kick(), at, .30)
        add(soften_edges(band_noise(.07) * np.exp(-timeline(.07) / .012), .001, .015),
            at, .085, .1)
    for cut in SCENE_CUTS[1:-1]:
        whoosh(cut, .052)
    for at in [3.05, 3.35, 3.65]:
        sound = band_noise(.16, narrow=True) * np.sin(np.pi * timeline(.16) / .16) ** 2
        add(sound, at, .045, -.2)
    for at in [0, .15, 8.8, 19.8, 42.2, 42.7]:
        add(soften_edges(band_noise(.025), .001, .018), at, .055, .2)
    transition_chime(35.25, 74, .11)
    # A short vacuum before the signature. Sample envelope, not a hard mute cut.
    a, b = round(34.55 * SAMPLE_RATE), round(35.03 * SAMPLE_RATE)
    MIX[a:b] *= .035
    n = round(.08 * SAMPLE_RATE)
    MIX[a-n:a] *= np.linspace(1, .035, n)[:, None]
    MIX[b:b+n] *= np.linspace(.035, 1, n)[:, None]
    MIX[:240] *= np.linspace(0, 1, 240)[:, None]
    MIX[-round(.25*SAMPLE_RATE):] *= np.linspace(1, 0, round(.25*SAMPLE_RATE))[:, None]
    MIX[:] -= MIX.mean(axis=0)
    MIX[:] *= .80 / max(float(np.max(np.abs(MIX))), 1e-9)
    MIX[:48] *= np.linspace(0, 1, 48)[:, None]
    MIX[-48:] *= np.linspace(1, 0, 48)[:, None]


def ffmpeg_run(ffmpeg: str, args: list[str]) -> str:
    command = [ffmpeg, "-hide_banner", "-nostdin", *args]
    result = subprocess.run(command, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode:
        raise RuntimeError(f"FFmpeg failed:\n{result.stderr}")
    return result.stderr


def loudness_json(log: str) -> dict:
    matches = re.findall(r'\{\s*"input_i".*?\}', log, re.S)
    if not matches:
        raise RuntimeError(f"Could not read loudness measurements:\n{log}")
    return json.loads(matches[-1])


def render(output: Path, ffmpeg: str):
    compose()
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="bhoomika-music-") as temporary:
        raw = Path(temporary) / "unmastered.wav"
        with wave.open(str(raw), "wb") as audio:
            audio.setnchannels(2)
            audio.setsampwidth(2)
            audio.setframerate(SAMPLE_RATE)
            audio.writeframes(np.round(MIX * 32767).astype("<i2").tobytes())
        measurement = loudness_json(ffmpeg_run(ffmpeg, [
            "-i", str(raw),
            "-af", "loudnorm=I=-17:TP=-1.5:LRA=9:print_format=json",
            "-f", "null", "-",
        ]))
        master = (
            "loudnorm=I=-17:TP=-1.5:LRA=9:"
            f"measured_I={measurement['input_i']}:"
            f"measured_TP={measurement['input_tp']}:"
            f"measured_LRA={measurement['input_lra']}:"
            f"measured_thresh={measurement['input_thresh']}:"
            f"offset={measurement['target_offset']}:linear=true:print_format=json"
        )
        ffmpeg_run(ffmpeg, [
            "-y", "-i", str(raw), "-af", master,
            "-ar", str(SAMPLE_RATE), "-ac", "2", "-c:a", "pcm_s24le",
            "-metadata", "title=I Make Ideas Move — Original Portfolio Score",
            "-metadata", "comment=Original procedural composition; no sampled recordings.",
            str(output),
        ])
    measured = loudness_json(ffmpeg_run(ffmpeg, [
        "-i", str(output), "-af", "loudnorm=I=-17:TP=-1.5:LRA=9:print_format=json",
        "-f", "null", "-",
    ]))
    # A fresh measurement reports the actual file values under the input keys.
    info = {
        "output": str(output.resolve()),
        "duration_seconds": DURATION,
        "sample_rate": SAMPLE_RATE,
        "channels": 2,
        "pcm_bits": 24,
        "bpm": BPM,
        "bars": 21.5,
        "integrated_lufs": float(measured["input_i"]),
        "true_peak_dbtp": float(measured["input_tp"]),
        "loudness_range_lu": float(measured["input_lra"]),
        "auditioned": False,
    }
    if not -18 <= info["integrated_lufs"] <= -16:
        raise RuntimeError(f"Loudness outside requested range: {info}")
    if info["true_peak_dbtp"] >= -1:
        raise RuntimeError(f"True peak exceeds requested ceiling: {info}")
    print(json.dumps(info, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output", type=Path, default=Path("/tmp/bhoomika-reel-render/music.wav")
    )
    parser.add_argument(
        "--ffmpeg",
        default=shutil.which("ffmpeg")
        or str(Path(__file__).resolve().parents[2] / "node_modules/ffmpeg-static/ffmpeg"),
    )
    arguments = parser.parse_args()
    render(arguments.output, arguments.ffmpeg)
