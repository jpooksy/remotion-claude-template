# Audio assets — bring your own

**No audio yet? Ship silent.** Everything in this template works with zero
audio files — just omit the `<Audio>` tags from your composition (the
`example/` composition does exactly this). Add music/SFX later when you've
licensed tracks; the volume conventions below apply from then on.

Audio files are not bundled with this template because stock-music licenses
(Adobe Stock, Artlist, Epidemic Sound, …) are per-account and don't permit
redistribution in a public repo. Source and license your own tracks, then
drop them in using this layout, which the compositions and docs assume:

```
public/audio/
├── music/
│   ├── licenses.md          # keep proof of license per track (see below)
│   └── *.wav                # background beds, named by mood
│       e.g. bright-corporate.wav, driving-electronic.wav
└── sfx/
    ├── click.wav            # mouse click (volume 0.25 in narrated cuts)
    ├── keyboard.wav         # typing loop (0.22)
    ├── bubbles.wav          # single data pop (0.05–0.10)
    ├── bubbles-loop.wav     # sustained data cascade (0.10)
    └── swoosh.wav           # panel slides / transitions (0.18)
```

Convert `.m4a`/`.mov` audio to `.wav` before use:

```bash
afconvert -f WAVE -d LEI16 input.m4a output.wav
```

## Track selection notes (from production use)

- **Narrated long-form**: brighter, corporate-uplifting beds sit best under a
  voice at volume **0.04**. High-energy/frantic tracks compete with narration.
- **Silent shorts (≤60s)**: higher-energy tracks work; music at **0.15**.
- Use `startFrom={N}` on the `<Audio>` tag to skip a soft attack at the head
  of a file so the bed is audible from frame 0.

## licenses.md convention

For every track, record: filename on disk, original track name, author,
asset ID, license ID, and acquisition date. Licenses are typically
per-account — keep the proof next to the files.
