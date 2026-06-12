# Original Package Audit

> HISTORICAL PRE-v35 AUDIT. Findings and scope decisions here describe the original package. Use `V35_RUNTIME_AUDIT.md` for the repaired current package.

Audited package: `mamilas(1).zip`
Audit date: 2026-06-08

## Verdict

The supplied package was organized but not model-adapted or production-clean. Its strongest parts were source integrity, path separation, start-frame anchoring and explicit output formats. Its main weakness was context architecture: repeated policy, cross-agent contamination and missing current production behavior.

## Agent findings

- Seven GPT files and seven Claude files existed.
- Every GPT file was byte-identical to its Claude counterpart.
- Daily production actually needs four agents: IDEA, IMAGE, MOTION and SUNO.
- MASTER, PROOF and CLIENT duplicated checks better enforced inside the four production stages.
- IMAGE and MOTION had strong lock language but insufficient explicit treatment of the premium outer world, local teaching material, environmental breath, Text Modes and duration mismatch.
- IDEA used scene prescriptions but lacked a hard agent-authored visual-beat method and a reliable resolution rule.
- Motion emphasized one event but not the required “one primary event plus a breathing world” balance.

## Knowledge findings

- Ten shared knowledge files totaled roughly 51 KB; the combined file was 51,416 bytes.
- The full authority paragraph appeared in nine files.
- The final-install note appeared in eight files.
- The same knowledge was intended for every role, exposing SUNO to image/tag rules and non-image agents to irrelevant engine-specific detail.
- Critical rules existed but were diluted by repetition and outdated assumptions.
- Missing or weak concepts included: `AGENT-AUTHORED VISUAL BEAT`, environmental breath, Text Modes, duration mismatch, explicit manual character override propagation and a complete Arcane/painterly 3D branch.

## Site findings

- Smoke test: pass.
- Stress test: 70 pass, 1 fail; the supplied README claimed 71 pass, 0 fail.
- Deterministic golden hash: `f4c40999`; the package declared `6634ff9d`.
- Reset/undo failed exact restoration.
- Default semantic fallback could create malformed dominants from arbitrary source fragments.
- A final scene could remain `Build / Proof` rather than resolve.
- A 120-scene neutral test assigned the first ten scenes the same `Build / Proof` function, confirming classifier/fallback flattening.

## Rebuild decisions

- Keep only four daily agents.
- Write separate GPT and Claude instructions.
- Give each agent one dedicated knowledge bundle.
- Repeat only the small core required for independent retrieval.
- Embed QA into each role rather than creating a separate checker dependency.
- Preserve the site unchanged and document its defects instead of hiding them by changing expected test values.
