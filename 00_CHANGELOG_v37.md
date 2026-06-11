# MAMILAS PRIME v37 — Changelog

Date: 2026-06-11
Scope: full rewrite of all agent instructions and knowledge files. The site is untouched;
its FINAL BRIEF export remains the only site↔agent interface.

## Why

The v34–v36 package had a split brain: polished agent files on disk, plus a stale inline
`agentPacket` blob and a wrong install checklist inside the site (referencing
`MAMILAS_KNOWLEDGE_ALL.md` and `01..07_INSTRUCTIONS.md`, which do not exist). Version
labels drifted (files titled v34 carrying V35 contracts inside a v36 package). Claude
agents were GPT copies wrapped in XML, with no usage discipline — costly on Claude plans.

v37 declares the file set the only agent brain and rewrites it around one model:
**doctor (user) → prescription (Final Brief) → pharmacy (agents)**.

## Changed

### All eight agent instructions (GPT + Claude)

- New PRESCRIPTION PROTOCOL: work only from the in-conversation Final Brief + direct user
  words; one-line request when the brief is missing; one-line `BLOCKED: <lock A> vs
  <lock B>` on contradictions instead of guessing; fresh-prescription session hygiene
  (no stale path/world/reference/genre carry-over).
- New OUTPUT DISCIPLINE: single-pass production output, all scenes in one message, no
  preamble, no brief/source echo, no closing notes. Protects quality and usage budget.
- New SELF-CHECK: silent pre-send verification per role (register purity, ID coverage,
  text states, vocabulary bans, hold/settle, render-lock verbatim...). Fix-in-place,
  never send-then-correct — avoids paid second passes.
- Version unified to PRIME v37 everywhere; the v35 canonical contract content (text
  states, effective DNA) is merged into the body instead of dangling as a mislabeled
  appendix.
- Claude versions keep XML tags and add silent-reasoning guidance; GPT versions are
  content-identical in markdown, so quality no longer depends on platform choice.

### All four knowledge files

- CORE LAWS rewritten once and applied uniformly: prescription model, dual authority
  order (creative locks + instruction conflict), source integrity, stage ownership,
  session hygiene, path grammar, Reference DNA, Aras+Defne preset, unified visible-text
  states (EXACT / TURKISH_GENERATED / NO_TEXT — replacing the parallel old "text modes"
  list), batch and quality law.
- Role knowledge preserved where it was already strong (Motion V3 grammar, Suno
  narration pocket, Image material truth) and tightened.
- IMAGE knowledge gains a worked weak-vs-strong prompt contrast; IDEA knowledge keeps
  its weak-vs-strong visual-beat contrast and adds the "your vagueness becomes their
  guess" handoff rule.
- MOTION knowledge restructured under the same CORE LAWS header as the other three;
  canonical output schema unchanged from V3 and now mirrored verbatim in both Motion
  instructions (the v35 instruction block anatomy and knowledge schema previously
  disagreed).

### Install

- `00_INSTALL.md` rewritten: pharmacist concept, explicit instruction to ignore the
  site's embedded agent text, Claude usage-economy section (one brief per conversation,
  batch scenes, fresh conversation per project).

## Not changed

- `mamilas.html` (site runtime) — out of scope for this revision.
- Operating order: SITE FINAL BRIEF → IDEA → IMAGE → approved images → MOTION → SUNO.
- Engines: Nano Banana 2 / Kling 3.0 / Suno v5.5.
