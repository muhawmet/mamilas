# Agent Design Rationale

## Decision

Use four specialized production agents. GPT and Claude receive different instruction files. Each agent receives one dedicated knowledge bundle containing a compact shared core plus only its stage-specific knowledge.

## Why the supplied package was rebuilt

- GPT and Claude instructions were byte-identical; there was no model-family adaptation.
- Ten shared knowledge files repeated the same authority paragraph nine times and the same install note eight times.
- A 51,416-byte combined file diluted critical production laws and increased cross-stage contamination.
- Visual Beat, environmental breath, Text Mode, duration mismatch and manual character override were absent or too weak.
- Seven installed roles conflicted with the user's actual four-agent workflow.

## Current prompting principles applied

- Keep instructions clear, structured and evaluation-ready.
- Give a precise output contract and examples only where they add discriminative value.
- Separate stable policy from volatile task context.
- Minimize context to the highest-utility tokens.
- Let capable current models plan and verify silently instead of micromanaging every reasoning step.
- Use model-specific structure: concise imperative execution for GPT; explicit tagged boundaries and context roles for Claude.
- Build evals around source integrity, path fidelity, output shape and production failure modes.

## What is deliberately repeated

Authority, source security, path grammar, Reference DNA, character scope and Text Modes appear in each knowledge bundle so one file is sufficient. No agent must retrieve another file to reconstruct a critical law.
