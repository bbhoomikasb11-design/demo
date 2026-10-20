#!/usr/bin/env python3
"""Render an original 60-second instrumental for Bhoomika's portfolio reel.

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
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = BAR * 25
SCENE_CUTS = [0, 4.8, 9.6, 14.4, 21.6, 28.8, 36, 43.2, 48, 55.2, 60]
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
    # Dmaj9, Bm7/add9, Gmaj9, Asus2/4 -> Aadd9. Two bars per chord.
    progression = [
        (38, [62, 66, 69, 73, 76]),
        (38, [62, 66, 69, 73, 76]),
        (35, [62, 66, 69, 71, 73]),
        (35, [62, 66, 69, 71, 73]),
        (31, [59, 62, 66, 69, 74]),
        (31, [59, 62, 66, 69, 74]),
        (33, [62, 64, 69, 71, 74]),
        (33, [61, 64, 69, 71, 76]),
    ]
    # Original restrained eight-bar melody; beat, MIDI note, note length in beats.
    melody = [
        [(0.5, 78, 0.8), (2, 76, 1.1), (3.5, 73, 0.7)],
        [(1, 74, 0.8), (2.5, 76, 1.1)],
        [(0, 73, 1.3), (2, 71, 0.7), (3, 69, 0.8)],
        [(0.5, 71, 1), (2.5, 73, 1.2)],
        [(0, 74, 1.4), (2, 78, 0.7), (3, 76, 0.8)],
        [(0.5, 74, 1.3), (2.5, 71, 1.1)],
        [(0.5, 69, 0.8), (2, 71, 0.8), (3, 74, 0.8)],
        [(0.5, 73, 1.1), (2.5, 76, 1.2)],
    ]
    kick_sample = kick()
    arp_positions = [(0, 0), (0.75, 2), (1.5, 1), (2, 3), (2.75, 2), (3.5, 4)]
    for bar in range(25):
        at = bar * BAR
        root, notes = progression[bar % 8] if bar < 24 else progression[0]
        outro = bar >= 23
        breakdown = 12 <= bar < 15
        for index, note in enumerate(notes[:4]):
            add(
                pad(note - 12, BAR + 0.6, index * 0.7),
                at, 0.027 if not outro else 0.024,
                [-0.62, -0.22, 0.25, 0.63][index],
            )
        if bar == 24:
            for index, note in enumerate(notes):
                add(key(note, 2.35, velvet=True), at + index * 0.055,
                    0.105, (index - 2) * 0.22, echo=True)
            add(bass(root, 1.65), at, 0.11)
            continue

        # Intro and mid-reel breakdown leave space for text; the ending opens up.
        positions = arp_positions[::2] if bar < 2 or breakdown or outro else arp_positions
        for index, (beat, chord_index) in enumerate(positions):
            note = notes[chord_index]
            gain = (0.115 if index % 2 == 0 else 0.09)
            gain *= float(RNG.uniform(0.9, 1.05))
            add(key(note, 1.35), at + beat * BEAT, gain,
                [-0.5, 0.34, -0.2, 0.5, 0.12, -0.36][index], echo=True)

        if bar >= 2:
            add(bass(root, 0.9), at, 0.19 if not breakdown else 0.13)
            if not breakdown and not outro:
                add(bass(root, 0.45), at + 1.5 * BEAT, 0.10)
                add(bass(root + 7, 0.6), at + 2.5 * BEAT, 0.125)
                add(bass(root, 0.35), at + 3.5 * BEAT, 0.08)

        if bar >= 4 and not breakdown and not outro:
            for beat, gain in [(0, 0.24), (2, 0.18)]:
                add(kick_sample, at + beat * BEAT, gain)
            for beat in (1, 3):
                add(brush(), at + beat * BEAT + 0.008, 0.075, 0.14)
            # Four quiet off-beat shakers per bar; no continuous hat wash.
            for beat in (0.5, 1.5, 2.5, 3.5):
                add(shaker(), at + beat * BEAT, 0.035, -0.35)
        elif 2 <= bar < 4 or 15 <= bar < 16:
            add(kick_sample, at, 0.19)

        # Melody enters after the identity, pauses at the middle, then returns.
        if (4 <= bar < 12) or (16 <= bar < 23):
            for beat, note, length in melody[(bar - 4) % 8]:
                add(key(note, max(1.15, length * BEAT + 0.5), velvet=True),
                    at + beat * BEAT, 0.105, 0.12, echo=True)
        elif bar == 23:
            for beat, note in [(0, 76), (1.5, 73), (3, 74)]:
                add(key(note, 1.8, velvet=True), at + beat * BEAT,
                    0.09, 0.12, echo=True)

    # Soft accents are timed to editorial cuts, with fewer chimes than cuts.
    for cut in SCENE_CUTS[1:-1]:
        whoosh(cut, 0.023 if cut in [9.6, 36, 48, 55.2] else 0.014)
    for cut, note in [(4.8, 74), (14.4, 78), (28.8, 74), (43.2, 78), (55.2, 76)]:
        transition_chime(cut, note, 0.06 if cut != 55.2 else 0.075)

    fade_in = round(0.6 * SAMPLE_RATE)
    fade_out = round(1.5 * SAMPLE_RATE)
    MIX[:fade_in] *= np.sin(np.linspace(0, np.pi / 2, fade_in))[:, None] ** 2
    MIX[-fade_out:] *= np.cos(np.linspace(0, np.pi / 2, fade_out))[:, None] ** 2
    # Remove tiny oscillator DC bias and retain comfortable pre-master headroom.
    MIX[:] -= MIX.mean(axis=0)
    MIX[:] *= 0.80 / max(float(np.max(np.abs(MIX))), 1e-9)
    # Keep both endpoints exactly silent, including after DC removal.
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
            "-metadata", "title=Making Things Make Sense — Original Portfolio Bed",
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
        "bars": 25,
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
