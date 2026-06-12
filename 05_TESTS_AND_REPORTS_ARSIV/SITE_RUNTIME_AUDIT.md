# Supplied Site Runtime Audit

> HISTORICAL v34 INPUT AUDIT. This file documents the pre-v35 supplied site and does not describe the repaired current runtime. Use `V35_RUNTIME_AUDIT.md` and `TEST_REPORT_v35.txt` for current authority.

Test date: 2026-06-08

The site was executed headlessly from the supplied HTML. The rebuilt agent/knowledge package does not modify the site.

## Verified harness results

- Smoke: `True`; 20 routes; missing functions: 0.
- Stress: 70 pass, 1 fail, 0 uncaught errors.
- Stress failure: `Reset & undo :: undo restores exact state undo=true exact=false`.
- Golden result: `f4c40999`.
- Package-declared expected golden: `6634ff9d`.
- The golden mismatch was reproduced in three fresh browser contexts; it is deterministic.

## Final Brief findings

- Source coverage remained 100% in the executed cases, including adversarial source text and large batches.
- The default compiler can generate malformed dominant subjects by extracting arbitrary source fragments, for example `çGelişme sahnesi fikrin`.
- The default three-scene final scene remains `Build / Proof` instead of a resolution/signature function.
- The site contains strong source-security language, but that does not repair weak semantic scene inference.
- The supplied GPT/Claude agents should therefore treat the Final Brief as locks plus evidence, not blindly amplify malformed semantic fallbacks. The rebuilt IDEA agent is responsible for replacing generic or malformed scene craft while preserving source/path/world locks.

## Scope decision

- Site HTML copied unchanged to avoid mixing a high-risk 789 KB application rewrite into the agent/knowledge rebuild.
- Golden hash and undo defects are not hidden by updating expected values.
- A separate site patch should fix the reset/undo binding/state restoration and replace fallback semantic extraction/function assignment, then intentionally regenerate the golden baseline.

## Custom limit cases

- `minimum_one_line`: scenes=1, coverage=100%, brief=10118 chars, first IDs=['text#0001'], last ID=text#0001.
- `explicit_id_3100`: scenes=2, coverage=100%, brief=11801 chars, first IDs=['text#3100', 'text#3101'], last ID=text#3101.
- `prompt_injection_source`: scenes=2, coverage=100%, brief=11841 chars, first IDs=['text#0001', 'text#0002'], last ID=text#0002.
- `product_path`: scenes=1, coverage=100%, brief=9793 chars, first IDs=['text#0001'], last ID=text#0001.
- `max_120_scene`: scenes=120, coverage=100%, brief=210074 chars, first IDs=['text#0001', 'text#0002', 'text#0003'], last ID=text#0120.

Raw results: `site_runtime_results.json`.
