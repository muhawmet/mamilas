# MAMILAS PRIME v36 — Production-Validation Report

Date: 2026-06-10
Working copy: `/Users/Muhammet/Desktop/mamişş/work/v36` (cloned byte-identical from v35)
Source/snapshot: untouched and verified immutable.

## Scope

This is a production-validation cycle, not an implementation cycle. Goal: drive realistic
customer briefs through the live decoder + adaptive recommender, judge **recommendation
quality** (not just correctness), and collect any genuinely misclassified Reference DNA.
No v35 source change was made — none was justified (see Verdict).

## Step 1 — v35 baseline re-verified (all green)

| Check | Result |
|---|---|
| `v35_runtime_test.js` | PASS — 0 failures (25 projects, 17 paths, 172 refs, 27 visuals, 18 materials) |
| `v35_static_test.js` | PASS — 12/12 agent+knowledge files ≤ 8000 B |
| `v35_regression_test.js` vs snapshot | PASS — 172/27/18 canonical fields byte-equivalent |
| `SHA256SUMS.txt` (37 files) | PASS — all OK |
| `mamilas_v35.html` | `18b0414c…` matches handoff |
| `MAMILAS_PRIME_v35.zip` | `994d1b92…` matches handoff |
| Snapshot + immutable source | both `f55a3d5a…`, byte-identical |
| ZIP integrity / standalone == site | no errors / byte-identical |

## Step 2 — Brief-driven validation

Harness: `v36_brief_validation.js` (loads the site through the same DOM shim as the v35
harness, runs `applyDecoder` then inspects register, the v35 recommender, and the
selected/effective/suppressed ref partition). Results: `v36_brief_validation_results.json`.

14 realistic Turkish briefs: 3 education, 2 real-commercial, 2 product, 2 institutional,
2 stylized, plus 3 deliberate keyword-collision edge probes.

**Result: 0 flags. 11/11 expected-path briefs decoded correctly. 100% source coverage on
all 14. Effective/suppressed ref partition healthy on every brief (no leaks, no empty
exports).**

### Decoder strength confirmed

The authoritative path resolution is a **weighted, ranked scoring decoder** (the
"Codex final decoder", min score ≥ 4), not the naive sequential keyword `decodeBrief`.
This is why the three keyword-collision probes resolved by *subject weight*, not last-match:

| Edge brief (colliding keywords) | Resolved path | Judgment |
|---|---|---|
| eğitim + ürün + logo | `ANIMATION_EDU` (education) | Correct — the subject is a school lesson |
| moda + belgesel + doğal ışık | `FASHION_EDITORIAL` | Defensible — fashion is subject, documentary is style |
| otomobil + reels + instagram | `AUTOMOTIVE_MOBILITY` | Correct — automotive is subject, reels is format |

## Step 3 — Reference-DNA misclassification audit

**No genuinely misclassified Reference DNA found in this brief set.**

The one suspicious recommendation — "Beauty Skincare — Skin Glow Grammar" surfacing for an
**automotive** brief — was investigated and is **intentional**: that ref's original
`bestPaths` explicitly contains `AUTOMOTIVE_MOBILITY` (glossy-paint / specular skin-glow
crossover). It is correct technical data, not a grouping error. Per the safe-continuation
rules, ref `cat/use/dna/avoid/bestPaths` was **not** changed.

## Step 4 — Recommendation-quality observations (candidates, NOT defects)

Subjective wording/precedence notes for a future tuning pass. None is a behavioral bug;
each is fully override-able by the user and backed by deterministic taxonomy.

1. **Generic tech brand film → Clinical White primary.** "Genel ticari reklam … teknoloji"
   routes to `TECH_MEDICAL_PRECISION` with primary visual *Klinik Beyaz Hassasiyet*. Correct
   by keyword, but a generic startup brand film may want a warmer commercial look first.
   Candidate: soften the `teknoloji` weight or offer a commercial-studio alternative higher.
2. **Outdoor civic event → Warm Interior primary.** "Belediye 23 Nisan … etkinlik" → primary
   visual *Sıcak İç Mekân*, while a 23 Nisan event is usually outdoor/civic. Candidate:
   prefer a civic/outdoor visual as primary for `event_real`.

These are recorded as evidence only. Promoting either requires: (a) confirmation it is a
real user-hesitation point, (b) a regression test, (c) an audit + changelog entry — per the
handoff's "promote only proven behavioral improvements" rule.

## Verdict

- v35 is intact and fully re-verified; source and snapshot untouched.
- The decoder and adaptive recommender behave correctly and with good quality across all
  five required brief families and three collision probes.
- No proven behavioral defect → no v35 source edit in this cycle.
- Deliverables added to the v36 copy only: `v36_brief_validation.js`,
  `v36_brief_validation_results.json`, this report, and `00_CHANGELOG_v36.md`.

## Reproduce

```bash
cd "/Users/Muhammet/Desktop/mamişş/work/v36"
node 05_TESTS_AND_REPORTS/v35_runtime_test.js 01_SITE/mamilas.html
node 05_TESTS_AND_REPORTS/v35_static_test.js
node 05_TESTS_AND_REPORTS/v35_regression_test.js \
  "/Users/Muhammet/Desktop/mamişş/source_snapshot/files/mamilas.html" \
  01_SITE/mamilas.html
node 05_TESTS_AND_REPORTS/v36_brief_validation.js 01_SITE/mamilas.html
```
