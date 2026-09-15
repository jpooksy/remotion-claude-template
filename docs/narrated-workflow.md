# Narrated cut: record → sync → re-time

How to turn a silent composition into a narrated video with a speaker overlay,
where every visual beat lands exactly on the spoken line. The core principle:
**the recording is the source of truth for timing.** You build the visuals to
a draft timeline, record the narration once, then re-time the visuals to the
audio — never the other way around.

## 1. Write the script to the beat structure

- Author `drafts/videos/{slug}/script.md`: section-by-section narration
  (HOOK / feature beats / OUTRO) with a "visual anchors" list per section
  mapping spoken phrases to on-screen events.
- Derive `script-recording.md`: the narration as clean prose only — no
  frame numbers, no anchors — for reading aloud.
- Budget ~150 words per minute of target runtime. Check the script against
  `drafts/_writing-rules.md` before recording.

## 2. Build the silent draft cut

Build the full composition against estimated frame ranges, held in a single
`ANCHORS` const:

```ts
export const ANCHORS = {
  HOOK_END: 375,
  F1_END: 1150,
  F2_END: 1515,
  F3_END: 2985,
  TOTAL: 3420,
} as const;
```

Gate scenes by frame range (`frame >= ANCHORS.HOOK_END && frame < ANCHORS.F1_END`)
rather than nesting `<Sequence>`s — a flat timeline makes global re-timing a
constants-only change.

## 3. Record

- Record a 16:9 face crop (1280×720 is plenty) reading the recording
  script. One continuous take reads far better than stitched takes.
- Save the file into `public/` (e.g. `public/talking-head.mp4`) and export a
  transcript or SRT with timestamps.

## 4. Build the sync map

Create `drafts/videos/{slug}/sync-map.md` — the **single source of truth**
for timing. It is a table mapping each audio cue to a frame and a visual
event (`frame = seconds × fps`, 30fps here):

| Audio cue | ~sec | Frame | Visual event |
|---|---|---|---|
| "Let me show you…" | 0.0 | 0 | Hook headline pops |
| "click the Data button" | 16.3 | 490 | Cursor glide starts; click at 510 |
| "watch the speed" | 32.7 | 983 | Row cascade + counter spin start |

Every timing constant in the composition must trace back to a row in this
table. When timing changes, change the sync map first, then the constants.

## 5. Re-time the composition

- Set `TOTAL` = footage frames + a short tail (the overlay fades out 20f
  before the footage ends).
- Update `ANCHORS` and every sub-beat constant (click frames, panel
  timelines, cursor segments) from the cue table.
- Visuals should land ON or a few frames AFTER the spoken cue — the ear
  leads the eye. Never let a payoff animation fire before its line.

## 6. Add the speaker overlay

Use `src/components/TalkingHead.tsx`. Pattern from production use:

- Enter big (width ~768 on a 1920×1080 frame) beside the hook headline,
  then glide down to a corner PiP (width ~432) as the first screen flies in.
- Give it a **dodge path**: keyframes that slide the PiP to whichever corner
  is idle at each beat, so it never covers the UI the narration points at.
- Render it last in the tree (it carries `zIndex: 60`).
- The footage audio IS the narration track (`volume: 1.0`). Do not add a
  separate voice `<Audio>`.

```tsx
<TalkingHead
  src="talking-head.mp4"
  videoDurationInFrames={3384}
  keyframes={[
    { frame: 225, left: 1120, top: 270, width: 768 }, // big, hook
    { frame: 255, left: 1448, top: 797, width: 432 }, // corner PiP
    { frame: 555, left: 1448, top: 797, width: 432 }, // hold
    { frame: 585, left: 40, top: 797, width: 432 },   // dodge left while panel owns the right
  ]}
/>
```

## 7. Voice-dominant audio profile

With narration at 1.0, everything else ducks:

| Sound | Volume | Notes |
|---|---|---|
| Narration (footage audio) | 1.0 | The anchor — never duck it |
| Background music | 0.04 | Bright/corporate bed; `startFrom` to trim a soft attack; 60f fade at the end |
| Click SFX | 0.25 | Only on actual cursor clicks |
| Keyboard SFX | 0.22 | Only while text visibly types (not pastes) |
| Data/bubble SFX | 0.05–0.10 | Counters, cascades, chip pops |
| Swoosh/transition | 0.18 | Panel slides, chip entries |

(For a silent cut with no narration, raise music to 0.15.)

## Audio files

Music and SFX are **not** bundled in this template (license restrictions) —
see `public/audio/README.md` for the expected file layout and how to source
and license your own tracks.
