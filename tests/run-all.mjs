// GATE: golden + smoke + interact. Exit non-zero if any fails.
// The MAMILAS "altın kural": run this after every change; if golden moves on a
// behavior-preserving change, REVERT.
import { run as gold } from './gold.mjs';
import { run as smoke } from './smoke.mjs';
import { run as interact } from './interact.mjs';

const update = process.argv.includes('--update');

console.log('=== GOLDEN ===');
const g = await gold({ update });
console.log('\n=== SMOKE ===');
const s = await smoke();
console.log('\n=== INTERACT ===');
const i = await interact();

const ok = g.ok && s.ok && i.ok;
console.log(
  `\n=== GATE ${ok ? 'PASS ✅' : 'FAIL ❌'} ===  ` +
    `golden=${g.ok ? 'ok' : 'FAIL'}(${g.hash}) smoke=${s.pass}/${s.total} interact=${i.fails} errors`
);
process.exit(ok ? 0 : 1);
