# remotion-claude-template

Make custom, high-quality product showcase videos **in code** — [Remotion](https://remotion.dev) compositions driven by a [Claude Code](https://claude.com/claude-code) agent workflow, instead of screen recordings stitched together in an editor.

The core idea: recreate your product's UI pixel-for-pixel in React by treating **your app's own frontend repo (your design system) as the single source of truth**. A set of Claude Code agents and a `remotion-video` skill drive the workflow from planning through publish — including narrated cuts with a talking-head speaker overlay synced to your recording.

> 🎬 Video walkthrough of the full workflow: *coming soon*

This is a template. Point it at your own product, drop your logos and audio into `public/`, fill `src/constants/` with your tokens, and start producing.

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm
- [Claude Code](https://claude.com/claude-code) (for the agent workflow — everything also works by hand)

### Setup

```bash
git clone https://github.com/jpooksy/remotion-claude-template.git
cd remotion-claude-template
npm install
npx remotion studio       # Opens Remotion Studio at localhost:3000
```

Studio lets you browse compositions in the sidebar, scrub the timeline, and preview any frame. `staticFile()` resolves assets relative to the repo-root `public/` directory.

### Render

```bash
# Render a composition to mp4
npx remotion render Example out/Example.mp4

# Single frame (visual spot-check)
npx remotion still Example out/check.png --frame=60
```

---

## The workflow in four steps

1. **Set up Remotion with Claude Code.** Clone this repo and run `claude` from its root. `CLAUDE.md`, the `remotion-video` skill, and the agents in `.claude/agents/` give a fresh session everything it needs — the workflow, the conventions, and the pitfalls already learned.

2. **Connect your product's frontend repo.** Clone your app's UI repo as a sibling directory and tell the workflow where it lives. Claude reads your real components — Tailwind classes, design tokens, spacing, icons — and recreates screens in React with exact values. This is what makes video creation truly programmatic: no screen recording, no clipping, every frame reproducible and editable. *(No repo access? Start with screenshots for an MVP — but connect the repo long-term; screenshots can only be verified against, not extracted from.)*

3. **Plan the video.** Write a brief (who it's for, what's in it, the steps shown, the value/outcome), an outline (per-screen plan, every click's frame and coordinates derived at plan time), and a script. Templates in `drafts/videos/_template/`.

4. **Record and sync.** Read the teleprompter script on camera, then re-time the composition to your recording via a `sync-map.md` cue table — the audio becomes the source of truth, and every visual beat lands on its spoken line. The speaker overlay is `src/components/TalkingHead.tsx`. Full recipe: [`docs/narrated-workflow.md`](docs/narrated-workflow.md).

---

## Project Structure

```
.
  package.json                             # Remotion project manifest
  remotion.config.ts                       # Codec, concurrency, Tailwind
  CLAUDE.md                                # Agent context — conventions, patterns, rules
  public/
    audio/README.md                        # Expected audio layout (bring your own — see licensing note)
    logos/                                 # Your brand + integration logos
  src/
    Root.tsx                               # Composition registry (all IDs)
    constants/
      colors.ts                            # Design-system tokens (placeholder set — swap in yours)
      fonts.ts                             # Font loading
    components/                            # Reusable building blocks
                                           #   Arrow, CategoryCard, FadeIn, GlowText,
                                           #   SourceCard, TerminalWindow, TalkingHead
    compositions/
      videos/                              # One folder per video
        example/                           # Minimal terminal-style demo (starting template)
          Composition.tsx                  # Top-level composition component
          data.ts                          # Static data (screens, timing, copy)
          schema.ts                        # Zod schema for props
  drafts/
    _writing-rules.md                      # Script voice + banned-phrase rules
    videos/_template/                      # brief / outline / script / sync-map skeletons
  docs/
    narrated-workflow.md                   # Record → sync-map → re-time → speaker overlay
  .claude/
    skills/remotion-video/SKILL.md         # Canonical multi-phase workflow — start here
    agents/
      design-system-extractor.md           # Extracts per-screen UI spec from your app's components
      composition-builder.md               # Builds the composition from ds-spec + brief
      qa-reviewer.md                       # Reviews the composition against the ds-spec
      landscape-bridge.md                  # Plans a landscape companion to a vertical short (or vice versa)
  scripts/
    convert-ds-icons.mjs                   # Extracts icon SVGs from your app into src/icons/
  out/                                     # Rendered mp4s + thumbnails (gitignored)
```

---

## Adding a Video

The canonical workflow is the **`remotion-video` skill**. From Claude Code running in this repo, say `"new video"` and Claude will load `.claude/skills/remotion-video/SKILL.md` and run the multi-phase workflow:

**SEED → PLAN → DS-EXTRACT → BUILD → RENDER → THUMBNAIL → PUBLISH → FINALIZE**

The skill dispatches agents (`design-system-extractor`, `composition-builder`, `qa-reviewer`) for parallelizable work, enforces the design system as the sole source of truth for UI recreation, and writes planning + retro docs to `drafts/videos/{slug}/`.

Critical rules the skill enforces (see `SKILL.md` for the full list):
- Every visual property (layout, color, typography, spacing, iconography) must trace to a real component in your app, not to screenshots or memory.
- Third-party brand colors are used only in hook/outro headline text; everything else uses your design-system tokens.
- Any region visible across two adjacent screens must be rendered by the same component (no re-renders at scene boundaries).
- Click SFX fire only on actual clicks, keyboard SFX only on typed (not pasted) text, and each SFX category has one canonical volume locked for the whole video.
- Hold ~15 frames after a payoff animation before transitioning; use 15–17f for screen-to-screen swipe transitions.

To do it by hand instead: copy `src/compositions/videos/example/`, update `data.ts` and `Composition.tsx`, and register the new composition in `src/Root.tsx`.

---

## Point the workflow at your product

The `remotion-video` skill and agents read from **your product's frontend repo** as the source of truth for UI-screen recreation. Clone it somewhere accessible and tell the workflow where it lives:

```
~/path/to/remotion-claude-template/   ← this template
~/path/to/your-app/                   ← your product's frontend (source of truth for UI screens)
```

Your app's components drive UI-screen recreation via the `design-system-extractor` agent and `scripts/convert-ds-icons.mjs`. If your product also renders dashboards from a shared component library, point the workflow at that library as a second source of truth for the dashboard payoff (see CLAUDE.md → "Dashboards").

## Audio

Music and SFX are **not** bundled — stock-music licenses are per-account and don't permit redistribution. See [`public/audio/README.md`](public/audio/README.md) for the expected file layout, volume conventions, and how to keep license proofs.

## License

[MIT](LICENSE)
