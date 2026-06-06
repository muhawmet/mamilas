// Deterministic build: assemble the single self-contained mamilas.html from the
// modular sources in src/. The shipped artifact stays one offline file (file://);
// development happens in the smaller src/ files.
//
//   src/index.html  shell with /*__MAMILAS_CSS__*/ and /*__MAMILAS_JS__*/ markers
//   src/styles.css  the <style> contents
//   src/data.js     DATA model + KEY/SCREENS + derived classification consts
//   src/core.js     all core functions + window export
//   src/patch-2026-05-28.js  the dated quality-patch IIFE + boot calls
//
// JS concatenation order is data -> core -> patch (must match the original).
// Markers are replaced with a function replacer so literal `$` in CSS/JS
// (e.g. template-literal `${...}`) is never treated as a replacement pattern.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Assemble the full HTML in memory (no side effects).
export function assemble() {
  const css = read('src/styles.css');
  const js = read('src/data.js') + read('src/core.js') + read('src/patch-2026-05-28.js');
  return read('src/index.html')
    .replace('/*__MAMILAS_CSS__*/', () => css)
    .replace('/*__MAMILAS_JS__*/', () => js);
}

export const TARGET = path.join(ROOT, 'mamilas.html');

// Only write when run directly (node build.mjs), not when imported.
if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  const out = assemble();
  fs.writeFileSync(TARGET, out);
  console.log(`built mamilas.html: ${out.length} bytes`);
}
