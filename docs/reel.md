# Personal introduction reel

A 60-second, 1920 × 1080, 30 fps introduction with original motion graphics, animated text, and an original instrumental score. The homepage uses a user-controlled player; the MP4 is also independently downloadable.

## Reference and adaptation

The complete visual sequence of Kree8’s 87.875-second homepage reel was reviewed through sequential frames, supplemented with closer transition samples. Its conversation-led opening, floating interface previews, kinetic type, alternating light/dark chapters, and closing contact card informed the structure. No reference footage, music, branding, or testimonials were reused. The reference soundtrack was not audibly analyzed.

This version uses Bhoomika’s forest, sage, and ivory palette with a lavender ClearHead chapter. Interface illustrations communicate the supplied project concepts; they are not recordings of the applications and are labeled accordingly.

## Chapters

| Time | Story |
| --- | --- |
| 0–4.8 s | A “what if?” becomes something real |
| 4.8–9.6 s | Bhoomika, Bengaluru, AI & Data Science |
| 9.6–14.4 s | Product design, development, AI |
| 14.4–21.6 s | CampusMesh |
| 21.6–28.8 s | ClearHead |
| 28.8–36 s | AdaptUI |
| 36–43.2 s | SplitGrid |
| 43.2–48 s | SafeScan, MediMatch, AI Smart Store Assistant |
| 48–55.2 s | Education and experience |
| 55.2–60 s | Tagline, contact, availability |

## Editing and rendering

The delivered files are in `public/media/`. They work without running the generators.

To regenerate, install the Node dependencies and Python 3 with NumPy:

```sh
npm install
python3 -m pip install -r scripts/reel/requirements.txt
npm run reel:preview
npm run reel:render
```

`render.mjs` owns scene copy, vector drawing, timing, transitions, and the poster. `music.py` synthesizes a deterministic 100 BPM, 25-bar D-major composition from oscillators and seeded noise, with no sampled or downloaded music. Rendering uses the project’s FFmpeg binary and the self-hosted Manrope font.

The renderer caches its WAV under the system temporary directory in `bhoomika-reel-render/music.wav`. To regenerate music after editing the score, remove that cached WAV before rendering, or run `music.py --output PATH --ffmpeg PATH` directly. Only the compressed MP4 ships.

The source WAV measures −17.0 LUFS integrated and −2.13 dBTP, with a 0.6-second fade-in and 1.5-second fade-out. These are measured checks; the score has not been audibly auditioned by the agent.

## Player behavior

No autoplay or looping. Playback pauses when the page is hidden or the player leaves the viewport. Controls include play/pause/replay, seeking, mute, optional English captions, fullscreen, and download. A complete text alternative is available under “Read the story.” Reduced-motion preferences disable control animation; the video itself plays only on request.
