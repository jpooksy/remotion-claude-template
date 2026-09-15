# Sync map — {slug}

**Single source of truth** for audio-cue → frame → visual-event mapping.
Timing changes go HERE first; every timing constant in the composition must
trace back to a row in this table.

Source: <transcript.txt / audio.srt> (<take name>, <length>). At 30fps:
`frame = seconds × 30`. Total: <N>f (<N/30>s).

## ANCHORS

```
HOOK_END: …    F1_END: …    F2_END: …    TOTAL: …
```

## Cue table

| Audio cue | ~sec | Frame | Visual event |
|---|---|---|---|
| "<opening line>" | 0.0 | 0 | Hook headline pops |
| "<phrase>" | | | <event> |

## Talking-head overlay

Dodge-path plan (see `src/components/TalkingHead.tsx`):

- f0–18: pop in big (<left, top, width>) beside the hook headline
- f<N>: glide to corner PiP (width ~432)
- f<N>: dodge to <corner> while <UI region> is active
- fades out 20f before footage end
