# Static Agent Tests

> HISTORICAL PRE-v35 STATIC TEST. Use `v35_static_results.json` and `TEST_REPORT_v35.txt` for the current agent/knowledge contracts.

Overall pass: `True`

- `02_GPT_AGENTS/01_IDEA_GPT.md`: 3846 chars; under 8000=True; missing=[].
- `02_GPT_AGENTS/02_IMAGE_GPT.md`: 3877 chars; under 8000=True; missing=[].
- `02_GPT_AGENTS/03_MOTION_GPT.md`: 5465 chars; under 8000=True; missing=[].
- `02_GPT_AGENTS/04_SUNO_GPT.md`: 2253 chars; under 8000=True; missing=[].
- `03_CLAUDE_AGENTS/01_IDEA_CLAUDE.md`: 3426 chars; under 8000=True; missing=[].
- `03_CLAUDE_AGENTS/02_IMAGE_CLAUDE.md`: 3332 chars; under 8000=True; missing=[].
- `03_CLAUDE_AGENTS/03_MOTION_CLAUDE.md`: 5152 chars; under 8000=True; missing=[].
- `03_CLAUDE_AGENTS/04_SUNO_CLAUDE.md`: 1904 chars; under 8000=True; missing=[].

## GPT/Claude separation

- IDEA: identical=False; GPT=3846; Claude=3426.
- IMAGE: identical=False; GPT=3877; Claude=3332.
- MOTION: identical=False; GPT=5465; Claude=5152.
- SUNO: identical=False; GPT=2253; Claude=1904.

## Knowledge bundles

- `04_AGENT_KNOWLEDGE/01_IDEA_KNOWLEDGE.md`: 7052 chars; under 8000=True; core=True; role heading=True.
- `04_AGENT_KNOWLEDGE/02_IMAGE_KNOWLEDGE.md`: 7617 chars; under 8000=True; core=True; role heading=True.
- `04_AGENT_KNOWLEDGE/03_MOTION_KNOWLEDGE.md`: 7815 chars; under 8000=True; core=True; role heading=True.
- `04_AGENT_KNOWLEDGE/04_SUNO_KNOWLEDGE.md`: 6360 chars; under 8000=True; core=True; role heading=True.

## Motion V2 consistency

- canonical_schema_in_all: `True`
- zero_or_one_passive_response: `True`
- no_two_or_three_reactions: `True`
- one_event_chain_defined: `True`
- source_override_security: `True`
- production_audit_modes: `True`
- specialist_scope_locked: `True`
