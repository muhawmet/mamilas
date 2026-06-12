# Build Validation

> HISTORICAL PRE-v35 VALIDATION. File sizes, hashes and the “site unchanged” statement below are retained as input evidence only. Use `v35_static_results.json` and `TEST_REPORT_v35.txt` for current validation.

## File lengths

- `02_GPT_AGENTS/01_IDEA_GPT.md`: 3846 characters.
- `02_GPT_AGENTS/02_IMAGE_GPT.md`: 3877 characters.
- `02_GPT_AGENTS/03_MOTION_GPT.md`: 5465 characters.
- `02_GPT_AGENTS/04_SUNO_GPT.md`: 2253 characters.
- `03_CLAUDE_AGENTS/01_IDEA_CLAUDE.md`: 3426 characters.
- `03_CLAUDE_AGENTS/02_IMAGE_CLAUDE.md`: 3332 characters.
- `03_CLAUDE_AGENTS/03_MOTION_CLAUDE.md`: 5152 characters.
- `03_CLAUDE_AGENTS/04_SUNO_CLAUDE.md`: 1904 characters.
- `04_AGENT_KNOWLEDGE/01_IDEA_KNOWLEDGE.md`: 7052 characters.
- `04_AGENT_KNOWLEDGE/02_IMAGE_KNOWLEDGE.md`: 7617 characters.
- `04_AGENT_KNOWLEDGE/03_MOTION_KNOWLEDGE.md`: 7815 characters.
- `04_AGENT_KNOWLEDGE/04_SUNO_KNOWLEDGE.md`: 6360 characters.

## Structural checks

- GPT production agents: 4
- Claude production agents: 4
- Agent-specific knowledge bundles: 4
- Every instruction file is below 8,000 characters.
- Every knowledge bundle is below 8,000 characters.
- GPT and Claude counterpart files are not identical.
- Motion GPT, Claude and knowledge use the same canonical schema.
- Motion V2 forbids multiple independently directed actions.
- Static required-section tests: PASS.
- Site copied unchanged: yes.
