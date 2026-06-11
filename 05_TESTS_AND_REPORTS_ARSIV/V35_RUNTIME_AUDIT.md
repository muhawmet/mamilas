# MAMILAS PRIME v35 Runtime Audit

Date: 2026-06-10

## Scope and source protection

- Immutable source: `/Users/Muhammet/Desktop/files`
- Byte-identical snapshot: `/Users/Muhammet/Desktop/mamişş/source_snapshot/files`
- Working package: `/Users/Muhammet/Desktop/mamişş/work/package`
- All implementation writes were restricted to the working package.

## Defects found beyond the original Recipe UI plan

1. Project changes retained the previous `teachingMaterial`. A prior `blocks` selection survived into Science, Turkish, Values, History and Stylized presets.
2. Direct Path selection and Project selection did not resolve the same recipe. `setPath('STYLIZED_PREMIUM')` could retain `pixar_feature` and `clay`.
3. Real/animation character budget could survive a register change.
4. The old `/tmp/smoke.js` executed a stale `/tmp/mamilas.js` and applied decoder results incompletely, producing misleading clay-leak reports.
5. The previous V32 layer had real-path reference suppression, but the final v34 `dnaDirectives()` read selected refs directly and bypassed it.
6. The supplied Recipe redesign plan proposed a separate IIFE that could not access private v34 helpers.
7. Runtime ref count was 172, not the older 140/149 assumptions.

## v35 implementation

- Added canonical Project/Path/decoder/Recipe state resolution inside the active v34 scope.
- Added `selectedRefs`, `effectiveRefs` and `suppressedRefs`.
- Added eight Turkish purpose clusters to all 27 visuals, 18 materials and 172 refs.
- Added adaptive Recipe recommendations and Turkish micro-guides.
- Added Turkish Recipe labels for all projects, 27 Visual Worlds and 18 Teaching Materials.
- Added Teaching topic subgroups and DNA-family subgroups for large Reference clusters.
- Added Turkish palette display names and removed stale visible v34 shell/Final Brief version labels.
- Added `EXACT`, `TURKISH_GENERATED` and `NO_TEXT` visible-text states to image, motion, brief, agent and Proof contracts.
- Added exact-text extraction for explicit quoted/labeled visible writing inside source scenes.
- Updated eight production-agent files and four knowledge files.

## Verification

- `node --check`: PASS.
- Runtime load and route render harness: PASS.
- Counts: 17 paths, 25 projects, 172 refs, 27 visuals, 18 materials.
- 25 poisoned-state Project transitions: PASS.
- 17 poisoned-state Path transitions: PASS.
- 25 Project and 17 Path canonical tuples compared from two different poisoned starting states: PASS.
- Decoder and 100% source-ingest scenarios: PASS.
- Real-path incompatible-ref suppression and hybrid override: PASS.
- All 172 refs partitioned and export-checked in REAL, STY and EDU contexts: PASS.
- Snapshot-to-v35 canonical technical-data regression for paths/projects/worlds/palettes, 172 refs, 27 visuals and 18 materials: byte-equivalent selected fields, PASS.
- Final brief, image, motion, Suno, image-agent and motion-agent outputs generated for all 25 projects: PASS.
- Purpose coverage and 48 Game-ref split: PASS.
- Turkish generated text, exact text, no-text and motion freeze: PASS.
- Quoted/labeled source exact-text extraction and bulk image/motion propagation: PASS.
- Max-three refs, setter register locks, and Reference selection ownership: PASS.
- Turkish Recipe labels, 45 Turkish micro-guides, Teaching subgroups, DNA-family subgroups and 1-3 adaptive suggestions: PASS.
- Agent packet Path and Turkish visible-text locks: PASS.
- Static agent/knowledge contract and 8,000-byte limits: PASS.
- In-app Browser visual smoke through localhost: PASS. Recipe EDU/REAL behavior, Prompt Lab expanded text locks, Final visible-text lock, v35 shell labels and desktop layout were verified.

Executable results:

- `v35_runtime_test.js` / `v35_runtime_results.json`
- `v35_static_test.js` / `v35_static_results.json`
- `v35_regression_test.js` / `v35_regression_results.json`
- `v35_data_dump.js`

## Residual risk

- Purpose assignment is deterministic taxonomy, not semantic AI classification. It is safe for export because it changes UI grouping and recommendation order only.
- Purpose assignment and recommendations remain deterministic; users can still freely override compatible choices.
