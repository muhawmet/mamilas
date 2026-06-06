// GOLDEN: serialize the output of every text/data-producing function across a
// fixed battery (decode + ingest + per-path brief/agent/qa/quantum/release/
// audit/golden/csv/repair), hash with the app's own hash32, compare to GOLD0.
//
// Behavior-preserving refactors MUST keep this hash constant. `--update` mints
// a new baseline (only do this deliberately when output is intended to change).
import fs from 'fs';
import { withPage, isMain } from './harness.mjs';
import { BRIEFS, ROLES, SPLIT_MODES, ADAPT, REPAIR_TYPES } from './battery.mjs';

const GOLD_FILE = new URL('./GOLD0.txt', import.meta.url);

// Runs INSIDE the browser. Only `cfg` and window globals are available.
function collector(cfg) {
  const SEP = '␟';
  const KV = '␞';
  const out = [];
  const push = (label, val) =>
    out.push(label + KV + (typeof val === 'string' ? val : JSON.stringify(val)));
  const S = window.S;
  const paths = window.DATA.paths.map((p) => p.id);

  // 1) decode: brief -> {path, project, reason}  (pure)
  for (const b of cfg.BRIEFS) {
    const d = window.decodeBrief(b.raw);
    push('decode:' + b.name, { path: d.path, project: d.project && d.project.id, reason: d.reason });
  }

  // 2) ingest: brief x splitMode x adapt -> scenes + report (lossless contract)
  for (const b of cfg.BRIEFS) {
    for (const m of cfg.SPLIT_MODES) {
      for (const a of cfg.ADAPT) {
        S.briefRaw = b.raw;
        S.splitMode = m;
        S.adapt15 = a;
        window.ingestRaw();
        const scenes = S.scenes.map((s) => ({
          id: s.id,
          source: s.source,
          ss: s.sourceStart,
          se: s.sourceEnd,
          sh: s.sourceHash,
          sl: s.sourceLen,
        }));
        push('ingest:' + b.name + ':' + m + ':' + a, { scenes, report: S.ingestReport });
      }
    }
  }

  // Stable scene set for the per-path text outputs below.
  S.briefRaw = cfg.BRIEFS[0].raw;
  S.splitMode = 'auto';
  S.adapt15 = true;
  window.ingestRaw();

  // 3) per path (coherent state) x hybridMode -> all text generators
  for (const pid of paths) {
    window.setPath(pid);
    for (const hy of [false, true]) {
      S.hybridMode = hy;
      const t = 'path:' + pid + ':hy' + hy;
      const brief = window.buildBrief();
      push(t + ':brief', brief);
      for (const role of cfg.ROLES) push(t + ':agent:' + role, window.agentPacket(role));
      push(t + ':qa', window.qaScore(brief));
      push(t + ':quantum', window.quantumReportText());
      push(t + ':release', window.releaseText());
      push(t + ':audit', window.auditText());
      push(t + ':golden', window.goldenText());
      push(t + ':csv', window.csvScenes());
      for (const rt of cfg.REPAIR_TYPES) {
        S.repairType = rt;
        push(t + ':repair:' + rt, window.repairText());
      }
    }
  }

  const blob = out.join(SEP);
  return { gold: window.hash32(blob), n: out.length, bytes: blob.length };
}

export async function run({ update = false } = {}) {
  const { result, errors } = await withPage('mamilas.html', async (page) =>
    page.evaluate(collector, { BRIEFS, ROLES, SPLIT_MODES, ADAPT, REPAIR_TYPES })
  );
  console.log(`golden: sections=${result.n} bytes=${result.bytes} hash=${result.gold}`);
  if (errors.length) {
    console.error('  page errors during golden run:');
    errors.forEach((e) => console.error('   ' + e));
    return { ok: false, hash: result.gold, reason: 'page errors' };
  }
  if (update) {
    fs.writeFileSync(GOLD_FILE, result.gold + '\n');
    console.log('GOLD0 baseline written:', result.gold);
    return { ok: true, hash: result.gold, updated: true };
  }
  if (!fs.existsSync(GOLD_FILE)) {
    console.error('GOLD0.txt missing — run `npm run test:gold:update` to mint the baseline.');
    return { ok: false, hash: result.gold, reason: 'no baseline' };
  }
  const expected = fs.readFileSync(GOLD_FILE, 'utf8').trim();
  if (expected === result.gold) {
    console.log('GOLDEN OK ==', expected);
    return { ok: true, hash: result.gold };
  }
  console.error(`GOLDEN MISMATCH\n  expected ${expected}\n  actual   ${result.gold}`);
  return { ok: false, hash: result.gold, expected, reason: 'mismatch' };
}

if (isMain(import.meta.url)) {
  const update = process.argv.includes('--update');
  run({ update }).then((r) => process.exit(r.ok ? 0 : 1));
}
