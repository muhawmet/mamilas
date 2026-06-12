# Research Basis

Checked on 2026-06-08 against official OpenAI and Anthropic guidance.

## Principles used

- Model families and snapshots benefit from different prompting approaches; do not assume one prompt is optimal everywhere.
- Use clear role, authority, workflow, constraints and output contracts.
- Establish eval baselines before optimizing cost or complexity.
- Prefer specialized agents only when prompt logic benefits from separation; otherwise avoid unnecessary orchestration.
- Context is finite: curate high-utility tokens and remove dead harness assumptions.
- Claude benefits from explicit structural boundaries and precise output formats.
- Current capable models should be trusted to plan, use context and verify work without excessive step-by-step micromanagement.

## Official sources reviewed

- OpenAI, “Prompt engineering”
- OpenAI, “A practical guide to building agents”
- OpenAI, “Introducing GPT-5.5”
- Anthropic, “Effective context engineering for AI agents”
- Anthropic, “Building Effective AI Agents”
- Anthropic, “Increase output consistency”
- Anthropic, “Scaling Managed Agents: Decoupling the brain from the hands”
