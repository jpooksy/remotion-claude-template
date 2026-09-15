---
name: remotion-video
description: Orchestrate end-to-end creation of a Remotion product-demo video — SEED through PUBLISH. Enforces the design system as source-of-truth for all UI recreation.
---

# Skill: Remotion Video (Orchestrator)

Run the complete Remotion video creation workflow. 8 phases: SEED → PLAN → DS-EXTRACT → BUILD → RENDER → THUMBNAIL → PUBLISH → FINALIZE. Agents are dispatched for parallelizable work (design-system extraction, composition building, QA, metadata).

## When to use

- User says "new video", "make a video", "let's build a Remotion short", or similar
- User wants to create a product demo, integration short, or UI walkthrough video
- For quick one-off edits to an existing composition, edit the file directly — don't run the full workflow

## Context loading (read once at start)

1. **`CLAUDE.md`** (repo root) — Canonical patterns, design-system workflow, DS tokens, Tailwind→px table, animation patterns, audio volume guide
2. **Project memory** (`~/.claude/projects/.../memory/`) — especially:
   - Design-system-as-sole-source-of-truth (every visual property traces to a real app component)
   - Brand color usage rules (third-party hex only in hook/outro brand name + dashboard semantic)
   - Cinematography defaults (zoom speeds, pan speeds, click timing, safe-zone targeting)
   - Layout continuity (same layout across adjacent screens; no screenFadeIn when content is continuous)
   - Audio discipline (click SFX only on clicks, bubble count matches visual stagger)
   - Studio props cache (remind user to Cmd+J → Reset after data.ts edits)
3. **Existing compositions** — `ls src/compositions/videos/` to see available templates. The `example/` folder is the minimal starting template.

## Calling hierarchy

```
You (main) ─── read ──→ Skill (this file)
     │                       ↑
     └── dispatch ──→ Agents ┘ (agents read skill + CLAUDE.md + app source)
                       ✗
              agents cannot dispatch agents
```

Agents are stateless. Package all context into each agent prompt: source-component paths, slug, screen list, brand data, constraints.

---

## Phase 1: SEED

Interactive with user. Lock all bounded decisions before anything else is done. **Ask everything before building** — iterations during BUILD are expensive.

### Bounded questions (AskUserQuestion — batch in four rounds of 4)

If a new option has no prior example in this repo yet, mark it `(new — no prior example)`.

**Round 1: video shape + platform**

1. **Video type** — `UI walkthrough short` (canonical) / `Terminal/CLI demo` / `Agent + data-app demo` (multi-prompt iteration narrative, drill-down payoff chain, zoomed-terminal hook) / `App showcase tour` / `Custom`
2. **Orientation + duration** — `Vertical 1080×1920, ~30s` / `Vertical 1080×1920, ~60s` / `Landscape 1920×1080, ~60s` / `Landscape 1920×1080, 90s+`
3. **Publishing platforms** (multi-select) — `YouTube Shorts` / `Instagram Reels` / `TikTok` / `LinkedIn post` / `Blog embed`. Drives safe-zone targeting (IG Reels + YT Shorts both have title-overlay areas at screen bottom ~200–250px that must not hide the on-screen input).
4. **Starting template** — `Clone example/` / `Clone your latest short` / `Fresh`

**Round 2: narrative + aesthetic**

5. **Chat/AI conversation turns** (if the video has an AI-assistant panel) — `1 turn` (question → response) / `2 turns` (question → response → follow-up request → build) / `Custom` (free-form)
6. **Response format** per turn — `Plain text` / `Table (structured data)` / `Tool calls + success + link` / `Other`
7. **Dashboard theme** — `Light` / `Dark`
8. **Hook preview element** — what the viewer sees in the first 1–2 seconds. Choices read very differently to the algorithm and the audience:
    - `Live-rendered dashboard preview` — *reads as builder showing work. High retention on YouTube Shorts.*
    - `Terminal/prompt card` — *reads as builder showing work. Strong fit for CLI / agent demos.*
    - `Live 3D / animated scene preview` — *hardest to pattern-match as an ad; viewers can't identify it in the thumb-scroll window. Best for showcase videos where the payoff visual is also the hero.*
    - `Conceptual diagram` (flow chart, tile arrangement) — *communicates a concept fast but reads as ad-coded on Reddit and weak on YouTube Shorts retention. Use only when the diagram IS the point of the video.*
    - `Logos + text only` — *fallback when no live preview exists. Reads as ad-coded by default; mitigate with a strong headline that doesn't sound like a value prop.*

    **Ad-coded vs builder-coded — important framing:** "ad-coded" means the first frame matches the visual grammar of a sponsored pre-roll (dual-logo lockup + value-prop headline). Builder-coded means the first frame looks like someone showing what they made (live UI, terminal, 3D scene). YouTube tolerates ad-coded openers (the algorithm matches them to commercial-intent search queries); Reddit and LinkedIn punish them. If the video is going to multiple platforms, prefer builder-coded — it's the lower-common-denominator that doesn't burn any platform.

    **If the payoff is dramatic enough to BE the hero** (3D scene, animated chart, unusual visual), put it in the hook. Don't save the strongest visual for a later scene.
8b. **Dashboard source** — how the dashboard will be specified. Drives whether PLAN writes a dashboard-spec table and which reference is used:
    - `Spec-only — describe it, Claude renders from your dashboard component vocabulary` *(default — works when KPIs/charts fit the canonical patterns. Example scope: "3 KPIs, line chart of MRR over time, segment donut, segment table.")*
    - `HTML reference — compiled .html file in public/` — *use when the dashboard has custom SVG, unusual layout, or a chart type outside the canonical kinds (line/bar/donut/stacked).*
    - `Component-library pointer — dashboard lives in a live app` *(export the app's dist/index.html and treat as HTML for now)*
    - `Build from scratch against ds-spec only — no dashboard-library influence` — *e.g. a terminal demo with no dashboard*

**Round 3: timing lock** — decisions here become `ANCHORS` in `data.ts` and prevent mid-BUILD timing drift.

9. **Target total runtime (exact)** — `30s (900f @ 30fps)` / `45s (1350f)` / `60s (1800f)` — *max Shorts length, more room for multi-turn chat* / `Custom (long-form ≥90s)`
10. **Hook duration budget** — `5s (150f) — canonical pitch hook with prompt preview` / `8s (240f) — medium, reveal-heavy hook with dashboard preview` / `10–11s (320f) — rich drill-down or three-card hook` / `Custom`
11. **Screen-to-screen transition cadence** — lock one cadence for every swipe/slide in the video; don't re-tune per scene. `15f — snappy, rule #4 default` / `17f — smoother, rule #4 upper bound` / `22f — looser, for hook↔body handoffs at longer distance` / `Custom — state frames + px distance`
12. **Payoff hold duration** — after the final reveal animation completes, how long to rest on the final state before cutting to CTA? `15f (0.5s) — rule #4 default` / `30f (1s) — more breathing room, useful for dense dashboards` / `45f (1.5s) — long-form payoffs only` / `Custom`

**Round 4: interaction + metadata scope**

13. **Number of click beats in the body** — each click = one zoom-for-click + cursor move + highlight + transition. `0 — single reveal payoff` (classic UI walkthrough ending in a dashboard reveal) / `1 — one drill-in (click to detail)` / `2 — drill-and-detail chain` / `3 — full drill-down` / `Custom`
14. **Hero KPI treatment** — does ONE KPI in the dashboard get the triple-effect reveal (count-up + scale bump + color lerp) tied to an ongoing animation? See §Animation patterns. *Not every video has this — only when there's a specific metric that's "the story" of the reveal.* `None — all KPIs at peer treatment` / `Yes` — free-form follow-up: "Name the KPI and the animation it's tied to."
15. **Vertical Shorts thumbnail (1080×1920) approach** — decide now so Phase 6 Part A scope is known. `Custom Thumbnail.tsx — add to BUILD scope` / `YouTube auto-frame — skip Part A` / `Defer decision until after render`. **Note:** Phase 6 Part B (horizontal 1280×720 featured thumbnails) is **always required** regardless of this answer.
16. **YouTube title strategy** — `Search-intent template: "How to X to Y [using AI]"` / `Hook-verbatim: the hook headline IS the title (requires headline ≤35 chars)` / `Competitor-framed: "vs [named alternative]"` / `Defer to PUBLISH phase's metadata agent`

### Free-form prompts

17. **Subject** — Integration name or feature being demoed (e.g., "Acme CRM sync + ROAS calculation using existing ad data")
18. **Brand assets** — Third-party brand's primary hex color + logo file path in `public/`. ALSO ASK: are there additional highlighted phrases in the hook/outro headline beyond the brand name? (e.g. highlight both the brand name and a product concept in different colors). List each `phrase + color`.
19. **Dashboard payoff** — What metrics/visuals appear at the climax. If a reference HTML dashboard exists in `public/`, note its path.
20. **Screen flow** — Confirm the screens (e.g. Hook → Dashboard → Settings → Form → Chat → Payoff → CTA). Trim to what the demo needs.
21. **Screen layout continuity** — `Sharp cuts between screens` / **`Seamless (shared layouts where possible) — recommended`**. If seamless, any region visible in two adjacent screens is rendered by the SAME component in both.
22. **CTA** — Default product signup, or custom.

### Output of SEED

Write `drafts/videos/{slug}/brief.md` capturing all answers. Derive slug from subject. The brief also contains:

- **`ANCHORS` block** derived from Q9–Q12 (runtime, hook, transition cadence, payoff hold) — to be copied into `data.ts` at BUILD time. Example:
  ```ts
  export const ANCHORS = {
    HOOK_START: 0,
    HOOK_END: 240,          // Q10 — hook duration budget
    BODY_START: 240,
    PAYOFF_HOLD_END: 1260,  // last reveal + Q12 (15f default)
    CTA_START: 1260,
    TOTAL: 1350,            // Q9 — target total runtime
    TRANSITION_FRAMES: 15,  // Q11 — one cadence for all swipes
  } as const;
  ```
- **Metadata plan** derived from Q15–Q16 (thumbnail approach + title strategy). If title strategy is `hook-verbatim`, the hook headline gets drafted now and doubles as the Phase 7 title candidate; if `search-intent`, draft 3 title candidates from the subject.

---

## Phase 2: PLAN

### Outline each screen

For each screen in the flow, specify:
- **Purpose** — what the screen demonstrates
- **Duration** — seconds
- **Source components to read** — exact component paths in your app repo
- **Content** — form field values, chart data, specific text
- **Animations** — typing, clicks, cursor moves, chart reveals

### Identify continuity regions

If SEED said "seamless", **list every region that appears in two or more adjacent screens** (e.g. an assistant panel across two screens, browser chrome across all UI screens, a backdrop shared between two screens). Each region → design ONE component used in both places. Don't let the builder render two different layouts that happen to look alike.

### Identify template gaps

Diff the chosen template against the new requirements. What screens need new design-system extraction because they differ from the template? What can be reused as-is?

### Narrative shape: single-reveal vs drill-down chain

Two payoff patterns:

- **Single-reveal dashboard** — one big reveal moment, hold, CTA. Dashboard is the climax.
- **Drill-down chain** — data-app demos chain 3–4 click beats: list view → click item → detail view → click sub-item → detail-detail → click action → final animated state. Each click uses zoom-for-click cinematography; each deeper screen shares layout chrome with its parent. Use for agent / CLI / data-app shorts where iteration is the point — pair with a two-prompt structure (first prompt creates, second refines; the second prompt is what proves the agent iterates on a living app vs. one-shot generators).

### Interaction script (required if SEED Q13 ≥ 1 click)

For every click in the body, fill a row in `outline.md`:

| Screen | Click # | Target | Origin | Peak zoom | Derived (x, y) | Frame |
|---|---|---|---|---|---|---|
| Dashboard v1 | 1 | Row 1 card | 12% 35% | 2.0 | (460, 700) | V1.start + 0 |
| Dashboard v2 | 2 | Detail row | 12% 35% | 2.0 | (520, 840) | V2.start + 0 |

**Each row must include the derivation math in the "Origin + Peak zoom → (x,y)" columns.** This enforces the first-guess derivation rule (§Common iteration pitfalls) at PLAN time, not after a miss during RENDER. If a row can't be filled without seeing the rendered frame, request a rough wireframe from the user before moving to DS-EXTRACT.

### Audio beat plan

For each screen with audio events, fill a row in `outline.md` using volumes from the canonical per-category table in critical rule #5:

| Screen | Event | Count | Volume | Frame offset | Sample |
|---|---|---|---|---|---|
| Dashboard | Tile reveal (bubble) | 6 | 0.15 | start + 15 | bubble.wav |
| Dashboard | Hero KPI count-up | 0 | — | (no SFX) | — |
| Dashboard | Click highlight | 1 | 0.55 | V1.start − 4 | click.wav |

Bubble count MUST match visual tile stagger count (per rule #5). Declare click / bubble / keyboard volumes ONCE in this table and lock for the whole video — no per-scene tuning.

### Dashboard spec (required if SEED Q8b ≠ "Build from scratch against ds-spec only")

For every element in the dashboard payoff, fill a row in `outline.md`. Each element must reference a component from your dashboard component vocabulary — or be flagged as custom and discussed with the user before PLAN is considered complete.

**When source = `Spec-only`:** fill this table via AskUserQuestion iteration with the user. Walk the canonical patterns and confirm each element's shape (label, value, column source, chart type, etc.).
**When source = `HTML reference`:** read the referenced `.html` file and decode it into this table using the component vocabulary as a Rosetta Stone.
**When source = `Component-library pointer`:** fetch `app.json` + `App.tsx` (or exported dist/index.html), then map to the table.

**Dashboard structure table:**

| Section | Description |
|---|---|
| Layout | Grid cols (e.g., 3 KPI tiles row + 2-col chart row) / card ordering / section grouping |
| Palette intent | Accent token, theme (light/dark), sentiment-color usage |
| Shell | Full `ShellLayout + Sidebar` OR bare dashboard panel (no chrome) |

**KPI tiles:**

| # | Label | Value | Sparkline? | Delta | Width |
|---|---|---|---|---|---|
| 1 | MRR (ENTERPRISE) | $4.21M | Yes (12-mo MRR) | +2.3% MoM | 1/3 |
| 2 | Churn rate | 3.1% | No | −0.4pp QoQ | 1/3 |
| 3 | Active accounts | 1,247 | No | +87 QoQ | 1/3 |

**Charts:**

| # | Component | Type | Data shape | Axes | Palette slot |
|---|---|---|---|---|---|
| 1 | Chart | line | `{month, mrr}[]` × 12 | x: month, y: $ | accent |
| 2 | Chart | donut | `{segment, value}[]` × 3 | — | accent / grad2 / ok |

**Tables:**

| # | Component | Columns | Sort | Cap |
|---|---|---|---|---|
| 1 | DataTable | Segment / MRR / Churn % / Accounts | MRR desc | 10 rows |

**Filters + tabs** (if any):

| Component | Options | Default state |
|---|---|---|
| FilterPills | All / Enterprise / Mid-market / SMB | All (active) |
| TabGroup | Overview / Revenue / Churn | Overview |

**Custom / flagged elements:**

List anything outside your canonical patterns here with a note. Example: "custom SVG chart, not in the component library — render as inline SVG using palette colors." If this section has entries, they must be reviewed with the user before BUILD.

Save outline to `drafts/videos/{slug}/outline.md`. The outline's full structure:
1. Screen-by-screen outline (purpose / duration / source paths / content / animations)
2. Continuity regions
3. Template gaps
4. Narrative shape (single-reveal or drill-down chain)
5. Interaction script table (if Q13 ≥ 1)
6. Audio beat plan table
7. Dashboard spec (if Q8b ≠ "Build from scratch against ds-spec only")

---

## Phase 3: DS-EXTRACT

Dispatch the `design-system-extractor` agent to produce a full per-screen UI spec from your app's frontend. This phase is **non-negotiable** — no BUILD happens without a ds-spec.

**Dispatch prompt:**
```
Read the agent definition at .claude/agents/design-system-extractor.md and follow it.

Video slug: {slug}
App repo root: {~/path/to/your-app}
Screens to extract: {list from outline.md}
Source components per screen:
- {screen}: {component path}
- ...

Output: drafts/videos/{slug}/ds-spec.md
```

The agent produces per-screen tables covering layout, spacing, dimensions, icons (with literal SVG paths), borders, interactive states, typography, and colors via DS token mapping.

After the agent returns, review the ds-spec with the user. If gaps exist, re-dispatch with targeted additions.

---

## Phase 4: BUILD

### Canonical folder pattern for `src/compositions/videos/{slug}/`

New videos (shorts or long-form) MUST conform to this layout:

```
videos/{slug}/
  Composition.tsx    # required — main comp
  data.ts            # required — static data / copy / timings
  schema.ts          # required — zod schema + TS props type, imported by Root.tsx
  Thumbnail.tsx      # optional — only if the video has a custom YouTube thumbnail (see Phase 6)
  components/        # optional — only when decomposition improves readability
```

The folder is `videos/` (not `shorts/`) so long-form landscape videos can live alongside vertical shorts without awkward renaming. Orientation + duration are expressed in `<Composition width height durationInFrames>` props in `Root.tsx`, not in folder structure.

Dispatch the `composition-builder` agent with the ds-spec + brief + outline. The agent consumes everything locked in SEED (timing anchors, interaction script, audio beat plan) and implements against it instead of inventing frame numbers, click coords, or SFX counts.

```
Read the agent definition at .claude/agents/composition-builder.md and follow it.

Video slug: {slug}
Template to clone: src/compositions/videos/{template}/
Brief: drafts/videos/{slug}/brief.md
Outline: drafts/videos/{slug}/outline.md
DS spec: drafts/videos/{slug}/ds-spec.md
Brand data:
  name: {subject/integration name}
  hex: {brand color — hook/outro brand-name ONLY}
  logo: public/{logo filename}
  highlighted phrases: [{phrase, color}, ...]
Screen flow: {from outline.md}
Continuity regions (MUST be same component in both screens): {list from outline.md}
Dashboard theme: {light | dark}
Hook preview: {dashboard | terminal | text-only}
Dashboard reference: {path to reference HTML or "build from scratch"}
Chat conversation turns: {1 | 2 | custom}
Response format per turn: {plain | table | tool-calls | other}

Hard constraints from brief.md (DO NOT invent — copy verbatim into data.ts):
- ANCHORS block (total runtime, hook end, transition frames, payoff hold)
- Interaction script (every click's transform-origin + derived (x,y) + frame)
- Audio beat plan (bubble counts, click SFX timing, volume constants)
- Hero KPI treatment (which KPI, which effects — or "None")
```

Then dispatch `qa-reviewer` before advancing to RENDER. If qa-reviewer returns FAIL, surface specific issues to the user and apply fixes before re-running.

**Verify every screen against ds-spec + reference comp before reporting done.** Do NOT trust the builder agent's self-report. For each completed screen:

1. Open `drafts/videos/{slug}/ds-spec.md` §Screen X and scan the Layout & structure table. Does the built screen have every element listed?
2. Open the corresponding screen in a proven reference comp and compare structure line-by-line. If the reference has a 2-column layout with logo sidebar + form, the new screen should too — unless the ds-spec explicitly says otherwise.
3. Look for shortcut-prone pieces: sidebar avatars, action buttons, cron presets, breadcrumbs, section labels, "Copy ID" buttons, footer multi-button bars. Agents often shortcut to the visible-in-screenshot elements and skip chrome.
4. If anything's missing, dispatch a fix BEFORE reporting to the user. This applies to ALL screens, not just Form.

When building the Hook and Dashboard, keep them in lockstep (critical rule #10). When building chat turns, respect tool-call chip ordering (rule #11). When building the Form, pull real fields from your app (rule #12).

---

## Phase 5: RENDER

1. Run `npx tsc --noEmit` from the repo root — must show zero errors in the new composition's files
2. Ask user to launch `npx remotion studio` and scrub the timeline (golden path + transitions)
3. Apply any iteration fixes from user feedback. Do NOT commit after every tweak — batch to natural breakpoints.
4. When user approves: `npx remotion render {CompositionName} out/{slug}.mp4` (run in background)
5. Confirm output exists in `out/` and file size is reasonable (>5 MB for 30s+ short).

---

## Phase 6: THUMBNAIL

Two thumbnail tracks: **Part A** for vertical Shorts/Reels cover (1080×1920) and **Part B** for horizontal YouTube featured/suggested content (1280×720). Most videos need both — A is the in-feed cover, B is what gets shown in suggested-videos sidebars, mobile feed, and as a long-form YouTube cover.

### Part A — Vertical Shorts thumbnail (1080×1920)

Create `src/compositions/videos/{slug}/Thumbnail.tsx` with these elements:

- **Atmospheric background** — radial-gradient lighting in brand-accent tones on the surface background token
- **Logos row** at top — product + subject logo, constrained with `maxWidth` so wide wordmarks don't overflow
- **Bold headline** — 90–120px font, 900 weight, two lines max, with highlighted phrases
- **One proof card** — a mini UI element showing the video's payoff (e.g., a catalog tree OR a dashboard KPI tile)
- **One interaction card** — the prompt/AI hook card with typed text + blinking cursor span
- **Tagline + accent bar** at bottom (e.g. "USING AI" + accent pill)

Register in Root.tsx:

```tsx
import { {SlugPascalCase}Thumbnail } from "./compositions/videos/{slug}/Thumbnail";

<Still
  id="{CompositionName}-Thumbnail"
  component={ {SlugPascalCase}Thumbnail}
  width={1080}
  height={1920}
/>
```

Render: `npx remotion still {CompositionName}-Thumbnail out/{slug}-thumbnail.png`

Verify the PNG at 1080×1920, ~1.5 MB. Open and spot-check: logos not clipped, headline readable, proof card recognizable.

### Part B — Featured horizontal thumbnails (1280×720) — REQUIRED

These run as YouTube suggested/sidebar content, mobile feed, and as the cover for long-form YouTube videos. They use a face overlay and a different visual language from Part A.

If you maintain a set of featured-thumbnail templates in `src/compositions/featured-thumbnails/`, read that folder's conventions first. Otherwise build from the description below.

#### Step 1: Pull video context

Extract from SEED/PLAN docs:

- **Headline phrase** — 2–3 words ending with `.` (e.g., "Your Data Stack.", "Your Real MRR.", "Your Full ROAS.")
- **Brand subject** — name + brand hex color
- **Hero prompt** — what the user types (e.g., "build me a dashboard", "show my MRR by segment")
- **Tool call** — the assistant action shown (e.g. `create_doc`, `run_query`, `configure_sync`)
- **Hero KPI** — main number for the dashboard preview (plausible, non-round value: `$109K`, `$1.3M`, `342`, `2.1%`)
- **Headshot** — a transparent-background PNG at `public/headshots/{name}.png` (optional)

#### Step 2: Generate THREE variations (required)

Constraints:

- **At least 2** of the 3 variations have a face overlay
- **At least 1** uses a MEGA face (width 480–640)
- **At least 1** uses a smaller face (width 370–430)

Suggested mix:

| Variation | Face size | Visual move |
|---|---|---|
| **V1 — Canonical** | MEGA (480), anchored bottom-left | Terminal → arrow → tilted dashboard with KPIs + bar chart |
| **V2 — Classic** | Smaller (430), slight bottom-bleed | Horizontal flow: terminal → arrow → dashboard card with KPIs + bar chart + leaderboard |
| **V3 — Hero alt** | MEGA or face-less | Simpler / different aesthetic for variety (hero number, or chart-as-background) |

For each variation:

1. **Create** a thumbnail composition file, e.g. `ClaudeCodeThumbnail{Slug}V{N}.tsx` (use a per-video subfolder if generating thumbnails for many videos).
2. **Customize** the brand-specific bits: headline phrase + period, subhead `FROM [BRAND]` with brand accent color, terminal prompt + tool call, dashboard KPI values, accent glow color, face if applicable.
3. **Register** in `Root.tsx` under the `Thumbnails` folder:

```tsx
<Still
  id="Featured-{Slug}-V1"
  component={ {Slug}ThumbnailV1}
  width={1280}
  height={720}
/>
```

4. **Type check**: `npx tsc --noEmit`

#### Step 3: Present in Studio

`npx remotion studio` → Thumbnails folder → show the 3 variations side-by-side. User picks the winner.

#### Step 4: Export the winning variation

```bash
npx remotion still Featured-{Slug}-V{chosen} out/{slug}-featured-thumbnail.png
```

Verify 1280×720, file size in the ~500KB–2MB range, no clipped logos/text.

#### Background-removal helper (if a fresh headshot is needed)

```bash
uv run --with "rembg[cpu]" --with pillow python -c "
from rembg import remove
from PIL import Image
out = remove(Image.open('SRC.png'))
out.save('DEST.png')
"
```

Place the resulting transparent PNG at `public/headshots/{name}.png`.

---

## Phase 7: PUBLISH (YouTube metadata + catalog entry)

Once the user has the MP4 + thumbnail, generate title, description, tags, and (optionally) a catalog entry.

### 1. Draft metadata

Package the video context: duration, screen-by-screen beats, competitor callouts, key numbers, conversation excerpts. If you keep brand voice / positioning / persona docs in a marketing-content repo, read those first so the copy matches your voice.

**Title guidance:**
- Mirror the literal search query the viewer would type — not clever wordplay
- "How to X to Y [using AI]" has ~2x CTR vs. descriptive titles for tutorials
- Name the specific subject and destination (e.g. `Sync Acme to Your Data Lake`, not `Your Analytics`)
- Include `AI` as a modifier when the AI does something meaningful in the video
- ≤60 characters (strict for YouTube Shorts)

**Description guidance:**
- Open with the question the title answers, using the exact keyword phrase
- Describe what the viewer will see
- Competitive framing vs. 2–3 named alternatives
- Structured sections: Links / What You'll Learn / Who Is This For / Hashtags
- Match the format of your currently-best-performing similar video

### 2. Add to your video catalog (optional)

If you maintain a content catalog repo, add an entry there (newest first). Required fields to mirror your existing entries:
- `### {Title}` (matches the YouTube title)
- `<!-- slug: {slug} -->` (matches the composition slug)
- `<!-- id: {YouTube video id} -->` (use `TBD` if not yet published — Phase 8 swaps in the real ID)
- `**URL:**` (`TBD` placeholder OK; Phase 8 swaps real URL)
- `**Published:**` (planned publish date; Phase 8 corrects if delayed)
- `**Type:**` (`YouTube Short (1080×1920, vertical)` OR `YouTube long-form (1920×1080, landscape)`)
- `**Duration:**` (e.g. `0:45`, `1:09`, `1:40`)
- `**Keywords:**` (comma-separated — search-intent terms first, named alternatives next)
- `**Personas:**` (lowercase, comma-separated)
- `**Companion blog / Short / long-form:**` (cross-link format-companions if shipped)
- `**Dashboard doc:**` (path + doc id for the data app, OR `none`)

Then a one-paragraph **`Covers:`** narrative summarizing the full video.

If your catalog repo's main branch is protected, open a PR (`git checkout -b video-{slug}-catalog-entry`, commit, push, `gh pr create`). Otherwise commit directly per your repo's conventions. Commit + push WIP frequently so multi-session work isn't lost.

### 3. Write `drafts/videos/{slug}/publish.md`

Title options (3), final description, tags, hashtags, plus TBD placeholder fields for YouTube URL + catalog ID. This file is what the user references when uploading manually.

---

## Phase 8: FINALIZE (requires user-provided YouTube URL)

**A video is NOT considered finalized until the user provides the YouTube URL after publishing.** This is a hard gate — don't mark the workflow complete or move on to the next video until this step lands.

**Iteration-mode exception:** even if the video was built ad-hoc (no SEED, no PLAN, direct-iteration on existing code), this phase MUST still run in full.

When the user pastes the YouTube URL:

### 1. Update the catalog entry (if you keep one)

Swap the `TBD` URL + video ID placeholders for the real values, and confirm the publish date matches the actual upload date.

### 2. Update `drafts/videos/{slug}/publish.md`

Replace `TBD` placeholders for `**Published:**` and `**Live URL + Video ID**` with the real URL + ID.

### 3. Update `drafts/videos/{slug}/retro.md`

Add the live URL to the retro header (alongside slug, format, duration). If the retro doesn't exist yet (iteration-mode), write it now. Required sections: session map, what iterated, process failures, distilled feedback memories, what landed well, open follow-ups.

### 4. Commit + push repo changes

```bash
git add -A
git commit -m "video: finalize {slug} — published {date}"
git push
```

### 5. Surface candidate memory updates

If iterations in this video's retro point to a new rule (e.g. a repeated correction), propose saving it to project memory before moving on. Discuss with the user — don't auto-write without confirmation.

### 6. Mark complete

Confirm to the user: "{slug} is fully shipped — code, retro, catalog, memory updates all done." Only after all steps land is the video finalized.

---

## Critical rules (pulled from memory — do not relax)

1. **The design system is the sole source of truth.** Every visual property (layout, structure, icons, spacing, states, typography, colors) must trace to a real component in your app. Screenshots are verification only, never source.
2. **Brand colors.** Third-party brand hex is used ONLY in the hook's and outro's brand-name header text. Everything else uses design-system tokens. Dashboard semantic colors (red/green/yellow for up/down/stagnant) and "actual vs claimed" series contrast are exempt. **Hue-separation check** for multi-highlight headlines: when a headline highlights both the brand name AND a product concept (e.g. "Sync Acme to a **data lake**"), pick a token color that contrasts with the brand hue — don't leave both phrases in the same hue family (prefer a purple/green/orange/pink token when the brand is blue, and vice versa).
3. **Layout continuity.** Any region visible in two adjacent screens MUST be rendered by the same component. Don't re-layout content that should feel continuous. If layout is identical across a screen boundary, drop `screenFadeIn` on the new screen (otherwise the viewer sees a "fade re-render").
4. **Cinematography defaults:**
   - Zoom-for-click: 20f zoom-in before click, peak at click, 13–18f zoom-out starting at click+6
   - Full-screen pan: ~27 frames (not 40–50)
   - Assistant-panel zoom: scale ≤1.8 so a ~512px panel fits in the 1080 viewport
   - Input safe-zone: keep on-screen input / click targets above the platform title-overlay area (in vertical, origin y ≈ 1800 puts the input at screen y ≈ 1200; keep terminal-bottom click targets at y ≤ 1500)
   - Screen-to-screen swipe/slide transitions: **15–17 frames** (20f+ feels sluggish, 10f jarring). Start at 15f.
   - Payoff hold: after a reveal/count-up/chart animation completes, hold the final frame **~15f (0.5s)** before cutting.
   - Small inline-target zoom: for left-anchored click targets (names, inline links, cards at x<30%), the default 1.8× centered origin is too weak. Push origin-x to 3–6% and scale to **2.2–2.5**. Reserve 1.8× for panel moves.
5. **Audio discipline.**
   - Click SFX only on clicks — not on form field pastes
   - Bubble SFX count matches visual stagger count (9 tables → 9 bubbles)
   - Click audio `Sequence from={clickFrame - 4}` so attack aligns with visual
   - Keyboard SFX only for actually-typed fields (not paste fields)
   - Background music at top level of AbsoluteFill, volume 0.15
   - **Cap reveal-stagger Sequences at the visual-end frame** (don't let bubbles ring past the last tile): `dur = min(8, revealFinish - bubbleStart)`; drop bubbles where `dur <= 0`.
   - **Canonical per-category volume — pick once per composition and lock it:**

     | Category | Volume | Notes |
     |---|---|---|
     | Background music (no VO) | 0.12–0.18 | default 0.15 |
     | UI clicks | 0.5–0.6 | CTA 0.4 |
     | Keyboard typing | 0.5 | `startFrom={15}` skips leading silence |
     | Bubble / reveal stagger (detail) | 0.07–0.12 | |
     | Bubble / reveal stagger (hero dashboard) | 0.15–0.2 | |
     | Impulse / finale (buzzer, cymbal, airhorn) | 0.12–0.18 | transients are perceptually much louder than bubbles; 0.3+ is too loud |
     | Per-element continuous (swoosh per shot, tick per token) | 0.25–0.40 | scale down as element count rises |

     Don't tune per-scene — clicks sound the same across the video, bubbles sound the same across the video. Declare the level once with a `const`.
   - **Finale / impulse SFX exception:** don't cap `durationInFrames` to the visual-end frame the way you cap bubbles. They're one-shot emphasis — let the natural decay ring out.
   - **Keyboard.wav loop gotcha:** the sample is ~3.2s / ~96 frames; with `startFrom={15}` only ~81 audible frames remain. Any typing Sequence `durationInFrames > 81` needs `loop` on `<Audio>` or the sound dies mid-type.
6. **Static files location.** All assets live in the repo-root `public/` directory (audio, logos, screenshots, icons). `staticFile()` resolves relative to that.
7. **Audio conversion.** `.m4a`/`.mov` → `.wav` via `afconvert -f WAVE -d LEI16 in out.wav` before use.
8. **Studio props cache.** After any `data.ts` change affecting a user-visible value, tell the user to Cmd+J → Reset props in Studio — Studio persists prop overrides per-composition that survive file reloads. If the user reports "I'm still seeing the old value" after a data.ts edit, this is the first thing to check.
9. **Commit cadence.** Don't commit every UI tweak. Batch to natural breakpoints or on explicit user request.
10. **Hook ↔ Dashboard symmetry + Hook ↔ CTA parity.** Two lockstep relationships at the ends of the video:
    - **Hook ↔ Dashboard** — the Hook screen's dashboard-preview tile renders the SAME dashboard composition as the final payoff: same KPIs, same charts, same tables, same layout. Scale / frame for preview context, but content is identical. Treat Hook + Dashboard (+ CTA peek) as one component with a `variant: "preview" | "payoff"` prop, or factor the tile list into a shared source. If Dashboard adds/removes tiles mid-iteration, Hook updates in lockstep. For agent / data-app demos, the hook previews the FINAL payoff (T2), not the intermediate T1 state.
    - **Hook ↔ CTA brand-card parity** — the intro Hook and outro CTA share a brand-name card (logos row + headline + optional button). Values must match across both: logo widths/heights, `+` separator fontSize, headline fontSize, gap values, button padding, animation delays. After any edit to the Hook card, diff intro vs. outro and update both — `replace_all` on shared literals is unreliable across indentation variants. Applies to all hook styles (dashboard-preview, terminal, text-only).
11. **Assistant tool-call chips render BEFORE the response body.** Per turn, the frame order is: (a) user prompt submit → (b) brief "thinking" state → (c) tool-call chip(s) fade in with bubble SFX (stagger ~15–20f per chip) → (d) intro text → (e) result body (table / chart / link) → (f) `View dashboard →` link or equivalent CTA last. All chips are on-screen before intro+result appears. Applies to every turn in a multi-turn conversation.
12. **Integration form fidelity.** Pull the real field set from your app's integration form component + per-type handlers. Don't synthesize inline "✓ Authorized as <email>" chips, connected badges, or OAuth popup modals — those usually aren't in the real UI. The footer button is typically **Authorize** for OAuth integrations and **Save** for API-key integrations. Confirm the exact field set from the source component, don't invent chips.
13. **Terminal scene discipline** (agent / CLI demos):
    - **Reuse chrome verbatim** across scenes. When T2 should match T1 (or the hook terminal), literally reuse the same component with identical zoom scale, transform-origin, padding — don't re-derive positioning.
    - **Grow DOWN only.** Anchor the top at initial y and append new content below. Never center-expand or grow up.
    - **Don't restyle history.** Text from earlier turns renders IDENTICALLY at scene resumption — same opacity, color, font-weight. No auto-dim, no "history styling".
    - **Paste-then-type for setup.** The first terminal action is a pasted setup command + confirmation line, rendered instantly (silent or single click SFX); only AFTER that does the user type the prompt character-by-character with keyboard SFX.
14. **Desktop wallpaper is the global stage.** The macOS desktop wallpaper sits at the bottom layer of the top-level `AbsoluteFill` for the entire composition — hook, body scenes, transitions, CTA. Every foreground element (terminal, dashboard card, assistant panel) sits ON TOP of it. During slide/swipe transitions and zoom-for-click, any exposed edges reveal the wallpaper — do NOT fill with a solid chrome color (`#09090b` and similar). It is not a hook-only decoration.

---

## Animation patterns (promoted from memory)

### Hero KPI triple-effect reveal

Use when ONE KPI is the story of a reveal (final score, total count, headline metric driven by an ongoing animation). The other peer KPIs stay at `scale: 1` with static white text — this is the documented EXCEPTION to rule #10 Dashboard simultaneous-reveal.

Three effects in the same animation window:

1. **Count-up** — linear `interpolate(local, [clickF, animEnd], [0, TARGET])`, rounded.
2. **Scale bump** — 1.0 → **1.8–2.0** → 1.0 across the window (peak held through the middle: `[clickF, clickF+8, animEnd-8, animEnd]`). For SVG KPIs use `<g transform>` so peer badges don't shove.
3. **Color lerp** — text color from a "low" hex to a "high" hex in sync with progress. Default semantic: red `#ef4444` → green `#34d399`. Swap for brand tokens when a specific palette applies.

Scale-alone reads as "something's happening" but doesn't tell the viewer *what*. The color lerp makes the KPI the unambiguous focal point — eyes follow the color before the number.

---

## Common iteration pitfalls (calibrated from retros)

These are gotchas that have burned real iterations. Read before BUILD + before every major iteration pass.

### Audio sample lifecycles

- **`keyboard.wav` is ~3.2s / ~96 frames.** With `startFrom={15}` it only has ~81 audible frames remaining. If a typing Sequence's `durationInFrames` > 81, the sound dies before typing ends. Fix: add `loop` to the `<Audio>` component (the parent Sequence's duration caps the loop).
- **`bubbles.wav` and `click.wav`** fit in typical usage. If a reveal stagger runs beyond ~90 frames, check audibility anyway.

### SFX stale-reference gotcha

When you retime chat events (tool-call frames, submit, link, etc.) by shifting their `localFrame` constants at the top of a component, the **bubble SFX array near the bottom of `Composition.tsx` is often hardcoded with the OLD frame numbers** (e.g. `[330, 350, 365]`) and won't auto-update. Always grep for literal frame numbers after shifting event frames:

```
grep -n "\[3[0-9][0-9], 3[0-9][0-9]" Composition.tsx
grep -n "CHAT\.start + [0-9]" Composition.tsx
```

### Cursor coordinate anchors

Rough visual-viewport anchors that tend to work after iteration. Start from these instead of guessing:

| Target | Approx (x, y) | Context |
|---|---|---|
| Form cron preset chip (rightmost) | (500, 900) | Default Form zoom |
| Form Save button | (720, 1100) | Default Form zoom |
| Assistant "View dashboard →" link | (620, 1140) | Chat 1.8× zoom |
| Sidebar schema caret | (145, 540) | Default sidebar zoom |

**Click coordinates require derivation — on the first guess, not only after a miss.** When writing `toXY: (x, y)` for a cursor-click target:

1. **Before the first guess**, state the visual target + math in the same turn as the edit. Template: *"scene's `transform-origin` is X% Y%, peak zoom Z. At that zoom, target element's center maps to viewport x≈A, y≈B. `toXY: (A, B)`."* If both numbers can't be justified in one sentence, request a screenshot or relative offset instead of guessing.
2. **If the first guess misses**, do NOT pick a new (x, y) blind. Ask for a screenshot at the click frame OR a relative pixel offset. Only pick a new number after one concrete data point beyond "it's wrong."
3. **Hard gate:** no new (x, y) in a commit without either derivation math or a screenshot/offset in the prior turn.

Blind guessing burns user patience faster than it finds the right coordinate.

### Zoom-origin shifts invalidate every click in that scene

`transform-origin` defines the pivot for a scale transform. Changing it translates every child element's on-screen position — so every `toXY` / `fromXY` / cursor anchor in that scene moves too. After editing a scene's `transform-origin`, audit all click coordinates in that scene (and any nested zoom layers that inherit from it) and re-derive them from the new pivot, or request a screenshot at the click frame.

Never ship an origin change without re-checking clicks in the same commit — the clicks appear to work in code review but visibly miss at render time.

### Field-removal cleanup

When the user says "remove field X from the form," two things must change, not one:

1. Delete the entry from `formFields` in `data.ts`
2. Delete the special-case renderer block in the form screen (e.g. `if (f.label === "Replace On No Pk Extraction") { ... return (...) }`)

Leaving step 2 in place is dead code but also leaves unused imports (switch tokens, etc.) that may trip tsc's `noUnusedLocals`.

### Frame reference ambiguity

When the user gives a frame number for timing changes, confirm whether it's absolute (timeline) or screen-local (`S.X.start + N`). When in doubt, state the interpretation before editing.

### Terminology swaps need a grep pass

If the user says "rename X to Y" (e.g. "data lake" → "data warehouse"), grep every case/spacing variant (`data lake`, `Data Lake`, `DATA_LAKE`, `dataLake`, `DataLakeScreen`). Separate user-visible strings (change) from code identifiers (leave).

### Dashboard reveal variants

Two patterns:

- **Staggered** (each element on its own bubble-SFX beat)
- **Simultaneous** (all elements start + end at same frame, bubbles still stagger)

Simultaneous: set all springs' `delay` to the same value (e.g. `S.DASHBOARD.start + 15`) AND all to the same `durationInFrames` (e.g. 55) so they start AND end together. Individual springs still need their own instance (cardSpring, numSpring, barSpring, lineSpring, rowFade, sectionFade). Bubble SFX can still stagger the AUDIO (`+ i*5`) — that's orthogonal to the visual reveal.

**Count-up gotcha — use linear `interpolate`, not spring.** Even with shared springs, KPI tiles FEEL like they end later because spring easing is asymptotic: the last 10–20% of progress takes a disproportionate share of duration, so integer count-up lingers visibly ("$4.18M → $4.21M") after bars/lines/tables have stopped. Fix: use a LINEAR `interpolate()` for the number-progress param ending at ~55% of the tile duration. Tile fade/translate still runs to `DELAY + DURATION` via the shared spring — only the number settles earlier.

```tsx
const numSpring = interpolate(
  frame - DASHBOARD_SPRING_DELAY,
  [0, Math.round(DASHBOARD_SPRING_DURATION * 0.55)],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
);
```

### Scoped edits — don't cascade across sibling scenes

When the user scopes a change to one specific screen ("update T2", "the chart at the end", "the outro"), do NOT touch sibling or earlier instances of the same component — even if they share the same props, and even if the shared-prop change would be "cleaner". Shared components (one `TerminalWindow` used across T1/T2/T3) are good for continuity but edits leak.

If a prop change would cascade across scenes, EITHER:
1. Duplicate the component and edit only the target scene's copy, OR
2. Parameterize by scene via an explicit prop (e.g. `variant: "t1" | "t2"`, `showPlayButton: boolean`).

When in doubt, STOP and ask: "this will affect T1 and T2 both — do you want that, or should I parameterize?" Cheaper than a revert round.

### Per-video retros

Read the most recent video's retro under `drafts/videos/{slug}/retro.md` before SEEDing the next one. Catches "here's what iterated last time."
