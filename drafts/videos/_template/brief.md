# Brief — {slug}

> Locked decisions for this video. Fill every section before PLAN.
> Produced by the SEED phase of `.claude/skills/remotion-video/SKILL.md`.

## Subject

- **What is being showcased:** <product / feature set / announcement>
- **Who it's for:** <audience — technical? buyers? end users?>
- **Value / outcome for the viewer:** <what they can do after watching>

## Shape

| Decision | Value |
|---|---|
| Video type | <product demo / feature walkthrough / launch> |
| Orientation × duration | <1920×1080 @ 30fps, ~Ns> / <1080×1920, ~Ns> |
| Platforms | <YouTube / LinkedIn / X / Shorts> |
| Narrated or silent | <narrated (talking-head PiP) / silent> |
| Starting template | <existing composition to copy> |

## Beats

| Beat | ~Duration | Content |
|---|---|---|
| HOOK | | |
| <feature 1> | | |
| <feature 2> | | |
| OUTRO / CTA | | |

## Draft ANCHORS

Estimated frame boundaries (re-timed to the recording later for narrated cuts):

```ts
export const ANCHORS = {
  HOOK_END: 0,
  // ...
  TOTAL: 0,
} as const;
```

## Brand assets

- Logos in `public/logos/`: <files>
- Brand hexes: <primary #……, accent #……> (brand colors only in hook/outro; DS tokens everywhere else)
- Design-system source: <path to your app's frontend repo>

## CTA

- <closing line + URL>
