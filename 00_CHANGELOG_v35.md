# MAMILAS PRIME v35 - Canonical Recipe and Agent Chain Repair

Date: 2026-06-10

## Canonical state authority

- Added one final v35 state authority inside the active v34 private scope.
- Project, Path, decoder and Recipe actions now resolve the same Project/Path/Visual World/Teaching Material/Reference/Palette recipe.
- Removed stale Teaching Material inheritance across education presets.
- Direct `STYLIZED_PREMIUM` path selection no longer retains Pixar/clay state.
- Real projects deterministically reset character budget to zero; animated projects reset it to 25.
- Presets and Paths now reset inactive material, style engine and hybrid state, producing the same canonical tuple from different poisoned starting states.
- Visual and Teaching setters enforce register ownership; rejected selections cannot mutate state.

## Reference DNA

- Separated selected UI refs from register-compatible effective export refs.
- Incompatible refs remain visible in Recipe but have zero effect on directives and exports unless hybrid mode is explicitly active.
- Added purpose metadata for all 172 runtime refs without changing canonical `cat/use/dna/avoid/bestPaths` data.
- Split the 48-ref Game Art Direction pool across game, action, premium, product and location purposes.

## Turkish visible-text lock

- Added scene text states: `EXACT`, `TURKISH_GENERATED`, `NO_TEXT`.
- Exact visible text is detected from scene fields and explicit quoted/labeled source phrases.
- Technical prompts stay English while all newly generated visible writing is required to be meaningful Turkish.
- User text, brands, logos, product names and proper nouns remain character-for-character exact.
- Motion freezes visible glyphs; unauthorized English writing, pseudo-text, translation and re-typesetting are Proof failures.

## Recipe and agents

- Rebuilt Recipe as a Turkish purpose-led adaptive UI with recommendations, reasons, micro-guides and export-suppression labels.
- Added Turkish display names and curated Turkish micro-guides for all 27 Visual Worlds and 18 Teaching Materials.
- Added Turkish display names for all 17 palettes and removed stale visible v34 labels from the shell and Final Brief.
- Added Teaching Material topic subgroups and DNA-family subgroups for large Reference purpose clusters.
- Recommendations now include a primary choice plus up to two alternatives for Visual, Teaching and Reference fields.
- Aligned all GPT/Claude production agents and all knowledge files with v35 canonical state, effective refs and visible-text rules.
- Added executable v35 runtime and static package tests.

## Intentional output changes

- Final briefs and agent packets now include the Turkish visible-text contract.
- Incompatible Reference DNA no longer contributes to final directives.
- Project/Path transitions now produce deterministic recipe state instead of retaining user state from a previous preset.
