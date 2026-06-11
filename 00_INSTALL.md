# MAMILAS PRIME v37 — Installation

Baseline: 2026-06-11 v37

## Concept: doctor → prescription → pharmacy

- The user is the doctor.
- The site (`mamilas.html`) writes the prescription: the FINAL BRIEF. That export is the
  ONLY interface between the site and the agents.
- The four agents are the pharmacy: they execute the prescription with maximum craft and
  zero re-diagnosis. A wrong dispense (path contamination, lost source text, broken lock)
  ruins the film even when the output looks beautiful — so agents BLOCK on a contradictory
  brief instead of guessing.

Ignore any agent text embedded inside the site UI (old `agentPacket` install checklist,
`MAMILAS_KNOWLEDGE_ALL.md` references, MASTER/PROOF/CLIENT agents). These files are the
only agent brain.

## Install four production agents

1. IDEA   — concept + scene architecture (the only inventing stage)
2. IMAGE  — Nano Banana 2 start frames
3. MOTION — Kling 3.0 i2v blocks
4. SUNO   — Suno v5.5 music bed

Do not install MASTER, PROOF or CLIENT as daily agents; their useful checks are embedded
in the production agents' SELF-CHECK sections.

## GPT setup

For each GPT:
- Paste the matching file from `02_GPT_AGENTS` into Instructions.
- Upload only its matching file from `04_AGENT_KNOWLEDGE` as Knowledge.
- Do not attach another specialist's knowledge.

## Claude setup

For each Claude Project:
- Use the matching file from `03_CLAUDE_AGENTS` as the project instruction.
- Add only the matching knowledge file from `04_AGENT_KNOWLEDGE` to project knowledge.
- Supply Final Brief, scene source and approved images as task context per conversation,
  never as permanent knowledge.

### Usage economy (Claude)

v37 agents are written to protect your usage budget:
- Production output is single-pass, all scenes in one message, no preamble/closing text.
- Agents never echo the brief or source text back; they reference [text#] IDs.
- Reasoning happens silently; only the deliverable is printed.
- A missing or contradictory brief costs one line (`BLOCKED: ...`), not a wasted full
  generation.

To help from your side: paste the Final Brief once per conversation (not per request),
batch all scenes into one request, and start a new conversation per project so old
context does not bloat every turn.

## Operating order

`SITE FINAL BRIEF → IDEA → IMAGE → approved images → MOTION → SUNO`

IDEA is optional only when the Final Brief already contains a complete source-bound Scene
Dossier. IMAGE and MOTION may infer scene craft but may not replace project, path or
world locks.

## v37 reinstall

Replace all four production-agent instructions and all four matching knowledge files.
Do not keep v36 or older instructions or knowledge attached beside v37 files.

v37 changes:
- Prescription protocol in every agent: brief-first, one-line BLOCKED on contradiction,
  fresh-prescription session hygiene.
- Output discipline + silent self-check in every agent (quality and usage economy).
- Single consistent version across instructions and knowledge (no v34/v35 drift).
- Knowledge CORE LAWS unified, including the v35 canonical text states
  (EXACT / TURKISH_GENERATED / NO_TEXT) and effective Reference DNA rules.

## File policy

Each agent receives one high-signal knowledge file. Shared CORE LAWS are repeated in each
file on purpose, so retrieval never needs to join several files.
