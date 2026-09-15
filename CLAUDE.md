# Remotion Video Project

Remotion-based video compositions for product marketing content (shorts, product demos, thumbnails). These videos recreate a product UI pixel-for-pixel using **your product's frontend repo (your design system) as the single source of truth**.

This is a reusable template. Wire it to your own product by pointing the design-system workflow below at your app's real components and filling `src/constants/` with your tokens.

## Development

```bash
# All commands run from the repo root.

# Start Remotion Studio
npx remotion studio

# TypeScript check
npx tsc --noEmit

# Render a specific composition
npx remotion render Example out/example.mp4
```

**Session setup (for Claude):** on a fresh clone, handle the setup for the user — if `node_modules/` is missing, run `npm install`; when the user wants to see a composition, launch `npx remotion studio` for them (background it and share the localhost URL). Don't make the user remember these commands.

## Project Structure

```
.
├── CLAUDE.md                      # This file
├── package.json                   # Remotion project manifest
├── remotion.config.ts
├── public/                        # Static assets (audio, logos, screenshots, icons)
├── src/
│   ├── Root.tsx                   # Main composition registry
│   ├── constants/
│   │   ├── colors.ts              # Design-system color tokens
│   │   └── fonts.ts               # FONT_FAMILY, MONO_FONT
│   ├── components/                # Reusable building blocks
│   │   │                          #   Arrow, CategoryCard, FadeIn, GlowText,
│   │   │                          #   SourceCard, TerminalWindow, TalkingHead
│   │   └── ...
│   └── compositions/
│       └── videos/                # One folder per video
│           └── example/           # Minimal terminal-style demo (starting template)
├── drafts/                        # Per-video briefs, outlines, ds-specs, retros, publish metadata
├── scripts/                       # convert-ds-icons.mjs
└── out/                           # Rendered mp4s + thumbnails (gitignored)

# Sibling repo you provide (not part of this template):
~/path/to/your-app/                # Your product's frontend (source of truth for UI recreation)
```

## Design System: Source of Truth

**Your product's frontend repo is the authoritative source for all UI recreation.** Screenshots from the running app are for visual verification only — never build UI from screenshots alone.

### Why the frontend repo, not screenshots

Every screen in these videos is a Remotion (React) recreation of a real component in your app. Extract exact values from the app's Tailwind classes and CSS variables to ensure pixel-accurate rendering:

- **Dimensions**: Sidebar widths, padding, margins, icon sizes
- **Colors**: Background, border, text colors via design tokens
- **Typography**: Font sizes, weights, line heights, letter spacing
- **Spacing**: Gaps, margins, padding between elements
- **Border radii**: Card corners, button shapes, input fields
- **Component structure**: Layout hierarchy, flex directions, alignment

### The design-system-to-Remotion workflow

1. **Read the source component** for the screen you're building (the real Vue/React/Svelte component in your app repo)
2. **Extract Tailwind classes** from the template (e.g., `p-6` = 24px, `text-sm` = 14px, `rounded-md` = 6px)
3. **Map to design tokens** — many apps use CSS custom properties (e.g., `bg-surface-nested`). Find the hex values in your app's CSS/theme file, or use the tokens already extracted into `src/constants/colors.ts`
4. **Convert to React inline styles** — translate Tailwind → px values → React `style` objects
5. **Verify against a screenshot** of the actual app to catch any gaps

### Tailwind-to-Pixel Mapping

Reference conversions used across compositions. If your app uses a custom Tailwind scale (non-default sizes like `text-2sm` = 13px or `14.5rem` = 232px), pull those from your app's `tailwind.config.*` — never assume the defaults.

| Tailwind | px |
|----------|-----|
| `p-1` | 4px |
| `gap-2` | 8px |
| `p-3` | 12px |
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-lg` | 18px |
| `size-5` | 20px |
| `p-6` | 24px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
| `h-9` | 36px |
| `p-12` | 48px |
| `w-64` | 256px |

### Design-system color tokens

Keep every color the UI needs in `src/constants/colors.ts` and reference the token constants instead of inlining hexes. The template ships a dark-theme token set as a starting point (replace the hexes with your own):

| Token | Example value | Role |
|-------|---------------|------|
| accent | `#0A99FF` | Accent — links, buttons, highlights |
| primary | `#F5F5F5` | Primary text |
| secondary | `#B8B8B8` | Secondary text |
| tertiary | `#7A7A7A` | Captions, muted text |
| muted | `#3D3D3D` | Borders, dividers |
| bgColor | `#111111` | Page background |
| surface | `#141414` | Card backgrounds |
| nested | `#0A0A0A` | Input backgrounds |
| borderSecondary | `#292929` | Input/card borders |

Token groups live in `src/constants/colors.ts`. **Never hardcode a hex value that exists as a token** — use the constant.

### Icons

Icon components live in `src/icons/` (create this as you extract icons). Use `scripts/convert-ds-icons.mjs` to pull SVGs out of your app's icon set into React components, so sidebar/nav items use the real production icons rather than emoji or unicode characters.

### UI recreation rules

1. **Every component traces back to a source file** in your app — sidebar, cards, forms, navigation, badges, inputs
2. **Read the source component BEFORE writing React** — don't guess layouts
3. **Icons** use extracted icon components or SVG paths, never emoji/unicode
4. **List/table content** uses diverse, realistic names — not values named after the feature being demoed
5. **Reference the token constants** in `src/constants/colors.ts` for every color

### Recreating desktop UI at vertical scale

Desktop px values (14px labels, 56px headers) are illegibly small on a 1080×1920 frame. Don't inflate individual values — recreate the panel at its native px dimensions, then scale the whole panel wrapper (e.g. `transform: scale(2)`, `transformOrigin: "top left"`). This keeps every extracted value traceable to the ds-spec while staying legible.

## Dashboards (optional second source of truth)

If your product renders dashboards from a shared component library (a runtime of `KpiCard`, `DataTable`, chart, `Select`, etc.), treat that library as a second source of truth the same way you treat the frontend repo: recreate each dashboard element as one of its canonical components, drive every color from your token constants, and keep chart configs JSON-serializable if your build pipeline strips function formatters. If you have no such library, build dashboards directly against your design-system spec.

---

## Composition Architecture (UI Walkthrough Shorts)

Each short follows this pattern (see `example/` as the starting template):

| File | Purpose |
|------|---------|
| `schema.ts` | Zod schema for all props (screen durations, colors, data) |
| `data.ts` | Default prop values |
| `Composition.tsx` | All components: Hook, Screens, CTA, desktop wrapper, cursor |

**Screen flow** (typical for a mature walkthrough short): Hook → Dashboard → Settings → Form → Chat → Payoff → CTA. The shipped `example/` is deliberately minimal — a single screen — so use whatever screens your demo needs.

**Key helpers** — patterns to implement per composition as your video calls for them (keep them duplicated and self-contained per composition; the minimal `example/` doesn't include them):
- `computeScreenTimings()` — converts duration props to `{ start, end }` ranges
- `buildAppColors()` — maps props to an `AppColors` object
- `getMouseState()` / `MOUSE_SEGMENTS` — cursor position + click animations
- `screenFadeIn()` / `zoomForClick()` — transition utilities
- `animateNumber()` — counts formatted numbers from 0 (handles `$`, commas)

### Registration

Register new compositions in `src/Root.tsx`:
- Import component, schema, default props
- Add `<Composition>` inside the matching `<Folder>` block
- Compute `durationInFrames` from screen durations — via `calculateMetadata` when duration derives from props, or a static exported total (like `example/`'s `EXAMPLE_TOTAL_FRAMES`) for fixed-duration compositions
- Set FPS 30, dimensions per format (vertical 1080×1920 or landscape 1920×1080)

### Creating a new short

1. **Read your app** for any screens that differ from the template
2. Copy `example/` (or your latest short) as the starting template
3. Find-replace brand names, colors, logo references
4. Update form fields and data in `data.ts`
5. Check for leftover `filter: "invert(1)"` on logos that don't need it
6. For small (32×32) card icons, use colored letter squares (not wordmark logos)
7. Register in `Root.tsx`

## Composition Architecture (Long-Form Landscape Videos)

1920×1080 long-form videos for YouTube long-form, LinkedIn, X. **Different format, different conventions** — don't carry over Shorts patterns directly.

### Top-level structure

Three scenes:
1. **Hook** — logos + 3-line headline LEFT, hero visual RIGHT. Tiles emerge from an emit point → hold → peel UP to a persistent top progress bar
2. **MainScene** — persistent split-screen (e.g., terminal pane LEFT, app pane RIGHT). A single `<MainScene>` component owns pane layout state machine + app state machine. Pane sizes animate via direct geometry (`{left, top, w, h}` rects), not camera transforms
3. **CTA** — same headline LEFT, hero visual RIGHT (mirror animation: bar tiles peel DOWN into the hero visual)

### Pane layout

Named states like `LAYOUT_WIDE`, `LAYOUT_ZOOM_TERM`, `LAYOUT_ZOOM_APP`. `paneLayoutAt(localFrame)` returns interpolated `{term, app}` rects for the current beat. Both panes share the same chrome treatment: `border: 3px solid rgba(255,255,255,0.3)` + matching boxShadow at all camera states.

### Persistent top progress bar

A multi-stage bar mapping to your video's beats (choose your own stage labels). Owned by a single component that handles three modes: hero visual (hook), bar (main), hero visual (CTA outro). Each segment fills L→R as that stage's work happens, and pops with a colored ring + scale bounce on completion (= when the next stage's content first mounts).

### Active segment width rebalance

When a bar segment is active (0 < progress < 1), it gets visually larger. **Use width rebalance, not scale transform** — compute weights `1 + 0.30 × activeAmt` per segment and distribute total bar width proportionally. Other segments shrink slightly to make room. This keeps neighbors from overlapping the active segment (which scale transforms cause).

Pop-on-completion is a separate transient effect (transform: scale 1 → 1.30 → 1.0 over 24f + expanding colored ring). Pop briefly overlaps neighbors during the ~5-frame peak; that's intentional emphasis.

### Pane fly-in (hook → main transition)

MainScene's parent Sequence starts `MAIN_FLY_IN_OFFSET` frames (typically 24) BEFORE hookEnd. During the offset window, panes scale 0.12 → 1.0 (cubic-out) with opacity 0 → 1 ramp; transformOrigin is each pane's own center so they grow in place.

**Frame alignment rule (CRITICAL):** when MainScene's parent Sequence uses an offset, **MainScene and all child components reading `useCurrentFrame()` must subtract that offset** when comparing against frame-related props (e.g., `screenStart`, `clickFrame`). Two classes of bug come from missing this:
- A dashboard component reads `useCurrentFrame()` (Sequence-local) but receives `screenStart` from MainScene's beat-local clock. Without `frame = useCurrentFrame() - MAIN_FLY_IN_OFFSET`, all click-target glow timing fires `MAIN_FLY_IN_OFFSET` frames early (glow shows before the cursor click).
- Passing `startFrame={0}` to a screen makes it think it has been mounted for thousands of frames, so pop animations "complete" before the screen ever shows.

Always pass a screen `startFrame={screenStart}` AND subtract the parent's fly-in offset inside any component that reads `useCurrentFrame()`. Also: every internal `<Sequence from={X}>` inside MainScene must add `MAIN_FLY_IN_OFFSET` to `X` (since `from` is relative to MainScene's parent Sequence start).

### Audio energy

Landscape videos run longer (60–180s) and reward smoother / brighter background tracks. Aggressive high-energy tracks compete with the typing/narration focus on long-form; brighter / corporate-uplifting tracks sit better.

### Typography ratios

- Headline fontSize ~96 on a 1080-tall frame (~9% of vertical). Vertical Shorts use ~108–120 on a 1920-tall frame (same proportional weight).
- Headline lineHeight ~1.35 for long-form (looser, breathes). Vertical Shorts use ~1.08–1.15 (tighter, punchy).
- Logos→line1 gap < line-to-line gap so the headline reads as one cohesive block.

### Cursor coords

Pane-relative (internal coords for ZOOM states, e.g. 1660×888). The cursor overlay adds the active pane's `{left, top}` to translate to absolute. Coords stay stable across camera states because internal content is rendered at fixed full size and clipped.

### Creating a new landscape video

1. Identify target platforms (YouTube long-form? LinkedIn? Both?)
2. Pick a duration range (60s, 90s, 120s, 180s) — drives pacing budget
3. Decide split-screen vs full-frame (split-screen is the landscape default for product/demo content)
4. Pick the persistent header treatment (progress bar? logo lockup? nothing?)
5. THEN start beat planning. Skipping these reliably leads to rework.

## Static Assets

- **All assets live in the repo-root `public/` directory** — audio, logos, screenshots, icons
- `staticFile()` resolves from the cwd where `remotion studio` was launched (the repo root)
- Convert `.m4a` and `.mov` audio to `.wav` before use: `afconvert -f WAVE -d LEI16 input.m4a output.wav`

### Logo reference

Keep brand logos in `public/`. Notes that recur:
- Black-on-transparent logos need `filter: "invert(1)"` on dark backgrounds; light-on-transparent logos don't.
- Wide wordmarks are usually too wide for small icon slots — use a colored letter square for 32×32 card icons instead.
- Dark monochrome logos may need their fill changed to a light color (e.g. `#F5F5F5`) for dark backgrounds.

## Animation Patterns

- **Bar charts**: `width: row.pct * spring` with staggered delays (`i * 4` frames)
- **Number counting**: `animateNumber(formatted, spring)` — larger numbers need faster springs to finish simultaneously
- **Bubble sounds**: a short bubble sample synced to data-viz animations, volume 0.08–0.2 depending on context
- **Section reveals**: staggered `sectionFade(delay)` with spring-based opacity + translateY
- **Springs**: bouncy (`damping: 12, stiffness: 80`) for content reveals; high damping (`200`) for subtle UI entrances
- **Form fields**: sequential typing with blinking cursor; instant paste for secure fields (show `••••`)

## Dashboard Design Discipline

- **Bar / chart palette**: cohesive, NOT rainbow. Primary chart uses the accent token; secondary uses neutral grey. Don't assign per-bar brand colors.
- **KPI numbers**: uniform color. Don't accent individual KPIs unless one is the explicit "hero KPI" with a coordinated triple-effect reveal.
- **Dashboard header**: prefer an actual logo image over colored text badges.
- **Whitespace fill**: when a dashboard has dead space, add a secondary table (e.g., "Recent Activity" below a primary table), using the same cohesive palette.

## Hook & CTA

- Use a desktop-wallpaper-style background, not flat color (build a small `DesktopWallpaper` component for your brand — the template doesn't ship one)
- Show relevant logos (e.g., your product + the integration/subject)
- Dashboard preview uses a browser-shell border: `border: 3px solid rgba(255,255,255,0.3)`
- Prefer a live dashboard component over a static screenshot (enables animated bars/numbers)
- Keep equal top and bottom margins so the composition reads as balanced

## Audio Volume Guide

| Sound | Volume | Usage |
|-------|--------|-------|
| Background music | 0.15 | Full duration |
| Keyboard typing | 0.5 | During typing animations |
| Click | 0.5-0.6 | Mouse click events |
| Bubbles (main dashboard) | 0.15-0.2 | Bar chart / number animations |
| Bubbles (hook preview) | 0.07-0.1 | Hook dashboard preview |
| Bubbles (data tables) | 0.08 | Schema/table reveals |

These are the levels for **silent cuts**. For narrated cuts (voice on top), use the voice-dominant profile in `docs/narrated-workflow.md`: narration 1.0, music 0.04, click 0.25, keyboard 0.22, bubbles 0.05–0.10.

## Narrated Cuts (talking-head speaker overlay)

For videos narrated by a recorded speaker: build the silent cut to a draft timeline, record against the clean-prose recording script, then re-time the composition to the recording via a `sync-map.md` cue table (audio is the source of truth). The overlay component is `src/components/TalkingHead.tsx` (pop-in, dodge-path keyframes, end fade; footage audio carries the voice at 1.0). Full recipe: `docs/narrated-workflow.md`.

## Agents

Three subagents automate the heavy lifting (see `.claude/agents/`):

- **`design-system-extractor`** — reads your app's frontend components and produces a per-screen UI spec (`drafts/videos/{slug}/ds-spec.md`) covering layout, spacing, typography, icons, states, and colors.
- **`composition-builder`** — builds a new composition from a template + the ds-spec + brand data, and registers it in `Root.tsx`.
- **`qa-reviewer`** — validates a composition against the ds-spec, TypeScript, and project rules before rendering.

The `remotion-video` skill (`.claude/skills/remotion-video/SKILL.md`) orchestrates these across the full SEED → PUBLISH workflow.
