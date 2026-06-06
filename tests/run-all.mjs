// GATE: golden + smoke + interact. Exit non-zero if any fails.
// The MAMILAS "altın kural": run this after every change; if golden moves on a
// behavior-preserving change, REVERT.
import fs from 'fs';
import { run as gold } from './gold.mjs';
import { run as smoke } from './smoke.mjs';
import { run as interact } from './interact.mjs';
import { assemble, TARGET } from '../build.mjs';

const update = process.argv.includes('--update');

// src/ is the source of truth: assembling it must reproduce the shipped
// mamilas.html byte-for-byte (catches a hand-edited mamilas.html or an
// un-rebuilt src/ before the behavior tests run against the file).
console.log('=== BUILD SYNC ===');
const built = assemble();
const onDisk = fs.readFileSync(TARGET, 'utf8');
const synced = built === onDisk;
console.log(synced ? 'BUILD SYNC OK (src/ -> mamilas.html byte-identical)' : 'BUILD OUT OF SYNC ❌ (run npm run build)');

console.log('\n=== GOLDEN ===');
const g = await gold({ update });
console.log('\n=== SMOKE ===');
const s = await smoke();
console.log('\n=== INTERACT ===');
const i = await interact();

const ok = synced && g.ok && s.ok && i.ok;
console.log(
  `\n=== GATE ${ok ? 'PASS ✅' : 'FAIL ❌'} ===  ` +
    `sync=${synced ? 'ok' : 'FAIL'} golden=${g.ok ? 'ok' : 'FAIL'}(${g.hash}) smoke=${s.pass}/${s.total} interact=${i.fails} errors`
);
process.exit(ok ? 0 : 1);
