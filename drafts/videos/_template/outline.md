# Outline — {slug}

> Per-screen plan derived from `brief.md`. Produced by the PLAN phase.

## Screens

For each screen/beat:

### <Screen name> (frames X–Y)

- **Purpose:** <what this beat proves>
- **Source components:** <paths in your app's frontend repo that DS-EXTRACT must read>
- **Content:** <what's on screen — use diverse, realistic data, not values named after the feature>
- **Animations:** <reveals, counters, cursor moves>

## Interaction script

Every click, derived at plan time (`frame = seconds × fps`):

| # | Frame | Action | Target (x, y) | Zoom origin |
|---|---|---|---|---|
| 1 | | click <element> | | |

## Audio beat plan

| Frame | Event | Sample | Volume |
|---|---|---|---|
| | click | click.wav | 0.25 |
| | typing | keyboard.wav | 0.22 |
| | data cascade | bubbles-loop.wav | 0.10 |

## Continuity regions

Regions visible across adjacent screens that must be rendered by the same
component (no re-mounts at scene boundaries): <list>
