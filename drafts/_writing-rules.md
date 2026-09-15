# Writing rules — video scripts

Global rules that apply to every `drafts/videos/<id>/script.md`. When drafting or revising a script, sanity-check against this list before recording.

---

## Banned phrases (cut on sight)

These sound markety, generic, or aspirational without carrying information:

- "every pixel is yours" / "control of every single pixel"
- "one platform, one agent, one conversation" (any all-in-one slogan)
- "the [tool] that locks you in"
- "powerful," "seamless," "seamlessly," "delightful"
- "robust," "world-class," "best-in-class," "next-gen"
- "supercharge," "unlock the power of"
- "imagine if you could…" (any speculative framing)
- "the future of [X]"

If the drafting agent uses any of these, replace with a concrete claim or cut entirely.

## Tone

- **Casual technical.** the narrator's voice — light "so" / "now" / "and" transitions. Occasional "honestly" / "ngl" / "yeah" is fine and lands.
- **Lowercase i is okay** in conversational lines (Slack/LinkedIn voice).
- **Contractions:** "I'm gonna," "you'll," "it's" — preferred over formal.
- **Em-dashes are fine** but not every sentence — don't over-rely.
- **Specifics over adjectives.** "67% true shooting" beats "really efficient." "Five-minute minimum interval" beats "fast scheduling."

## Section punchlines

Every section should end with a concrete data point, name, or number. Examples of the shape that works:

- "sixty-seven percent true shooting"
- "a sixty-point game and a shot-selection chart"
- "every data point, in three-D"
- "five hundred connectors"
- "that's one command"

Avoid ending a section on an abstract claim ("...which makes it really powerful").

## CTA energy

Drop in energy at the end. Drier, declarative. Don't oversell.

Bad: "If you're ready to transform your data stack, we'd love to power your journey."
Good: "If you're interested, we'd love to get you set up. See the link in the description to learn more."

## Product terminology — avoid overload

- **Watch overloaded words.** If a term means two different things in your product (e.g. a scheduled job vs. the UI that lists scheduled jobs), pick distinct words for each in a script so the viewer isn't guessing which one you mean.
- **Distinguish "connector" from "integration"** if your product uses both — one is usually the data source, the other the connected account. For non-technical audiences "connector" reads cleaner; technical audiences understand both.
- **"Claude Code"** is two words, both capitalized. The agent. NOT "Claude" alone (which usually refers to the LLM).
- **"MCP"** stays uppercase. First mention can expand to "Model Context Protocol" if the audience is non-technical; otherwise leave abbreviated.
- **Capitalize your product name consistently** and spell it the same way every time — don't drift between "Acme," "Acme.app," and "the Acme platform."

## Numbers + quantities

- **Spell out** small numbers (one through nine) when they're the *content* of a sentence: "five or six tools," "one command."
- **Use digits** for stats and proper nouns: "67% true shooting," "60-point game," "15 attempts" (prefer digits when the number is the data point).
- **Time and dates:** "10am Pacific" not "10:00 AM PST" in narration. Save the formal version for on-screen text.

## What to skip on first draft

If a script section feels like filler, cut it. Common offenders:
- "Let me explain why this matters…"
- "First, a bit of context…"
- "Now, you might be wondering…"
- Recap of what you just said

Get to the point. The video is the proof.

## Banned but salvageable

Some phrases are banned in the *raw* form but work with specifics. Pattern: replace abstract praise with a concrete fact.

| Banned | Salvage |
|---|---|
| "It's really powerful" | "one governed model gives every team the same answer" |
| "Easy to use" | "one command and Claude has access to 40+ tools" |
| "Production-ready" | "runs on cron with run history, logs, and a 5-minute minimum interval" |

## Approval checklist before recording

- [ ] No banned phrases (search the list above)
- [ ] Each section ends on a punchline (concrete data / number / name)
- [ ] Overloaded product terms disambiguated
- [ ] Talking-head voice — read it aloud, sounds like you
- [ ] CTA is dry, not sales-y
- [ ] Estimated runtime fits target (~150 wpm baseline)

---

## See also

- `drafts/videos/{slug}/script.md` — the pre-recording version (planned)
- A narrated cut adds section markers + audio-frame annotations to the same script after recording
- Project memory notes on the audio-first workflow, for when a script feeds a narrated cut
