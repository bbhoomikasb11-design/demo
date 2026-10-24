# I MAKE IDEAS MOVE

The homepage film is 43 seconds, 1920 × 1080, 24 fps, H.264 with stereo AAC audio. It tells one idea’s journey through typography, a sketch, a dimensional object, authentic interfaces, code, and Bhoomika’s signature. It starts only on user request.

## Reference and identity

The supplied `/Users/bhoomika/Downloads/Bhoomika-S-Introduction.mp4` was byte-identical to the previous homepage film (SHA-256 `e4eaf77fd788b9ae41cf0d8b48c1ef31988498acef78799850e3f573f0c18c8f`). Sequential frames across its complete 60-second duration and its source renderer informed the revision. Its illustrative interfaces are replaced with real frontend captures.

Dominant sampled background pixels: cream `#f3f4ed` at 1 second and sage `#e2ebda` at 17 seconds. Deep sage `#244d3e` and ink `#234638` preserve the original renderer’s identity. Butter yellow `#e9dda0` is reserved for emphasis, a cursor and connecting rules. Shading stays within the sage family. The user approved original colors within genuine screenshots; their interfaces remain ungraded.

## Timeline

| Time | Sequence |
| --- | --- |
| 0–3 s | Cursor, IDEAS impact, fragments, EVERYWHERE |
| 3–7 s | Geometric sketch extrudes into a rotating modular object; MY BRAIN DOESN’T DO STATIC |
| 7–10 s | Typographic grid reveals BHOOMIKA S., AI & DATA SCIENCE and DESIGN × CODE × IDEAS; a circular letter portal opens |
| 10–18 s | Authentic CampusMesh search/filter and login interfaces; no invented listings or map activity |
| 18–21 s | Existing AdaptUI profile rows assemble, then the complete popup returns |
| 21–24 s | ClearHead’s original interface settles into a calmer composition |
| 24–27 s | SplitGrid landing and Create Group screens assemble through a grid |
| 27–35 s | THINK / DESIGN / BUILD montage: authentic interfaces, SafeScan design and SplitGrid source code; collapse to a point |
| 35–43 s | The object returns; I MAKE IDEAS MOVE, Bhoomika’s name and disciplines; reserved URL area and closing cursor |

The lower-right closing area is intentionally left available for a confirmed portfolio URL. No placeholder or invented address is rendered.

## Editable production

- `scripts/reel/render.mjs`: exact typography, scene timings, projected 3D object, orthographic interface planes, masks, short shutter integration on fast transitions, poster and MP4 encoder.
- `scripts/reel/music.py`: original 120 BPM electronic score, warm synthesized bass/keys, percussion, cursor clicks, sketch textures, snaps, whooshes and impacts. A near-silent interval at 34.55–35.03 seconds precedes the signature. No recordings or downloaded music are used.
- `scripts/reel/assets/`: genuine interface captures, code excerpt and detailed provenance. These are not served as website assets.
- `public/media/`: delivered MP4, JPEG poster and matching VTT captions.
- `src/components/ReelPlayer.jsx`: player, 43-second cover information, full text alternative, controls and download name.

Install the existing locked dependencies and NumPy, then run:

```sh
npm ci
python3 -m pip install -r scripts/reel/requirements.txt
npm run reel:preview
npm run reel:render
```

Preview writes a 26-frame storyboard and full-size review frames under `.impeccable/review/ideas-move/`. Rendering always regenerates the score and encodes into a temporary file before replacing the homepage media after a successful encode. No stale audio cache is reused. The website can play the shipped files without any generators installed.

The master WAV measures −17.16 LUFS integrated, −1.50 dBTP and 3.9 LU loudness range. Audio was measured programmatically; it has not been audibly auditioned by the agent.

## Player behavior

Playback never autoplays or loops. It pauses when hidden or outside the viewport, while fullscreen playback remains available. Controls include play/pause/replay, seeking, mute, English captions, fullscreen and download. “Read the story” provides a text alternative. Reduced-motion preferences remove control animation; the film itself runs only when explicitly played.
