// Shared Playwright harness: serves mamilas.html over a local http server,
// opens it in headless Chromium, waits for the app globals, and runs the given
// in-page test function. Captures uncaught page errors and console errors.
//
// The app exposes its functions on `window` via Object.assign(window,{...}),
// so page.evaluate can call buildBrief(), ingestRaw(), setRoute(), etc. directly.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Playwright is installed globally in this environment; fall back to that path.
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node22/lib/node_modules/playwright/index.js'));
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/' || p === '') p = '/mamilas.html';
    const fp = path.join(ROOT, p);
    if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const ext = path.extname(fp);
    const ct =
      ext === '.html' ? 'text/html'
      : ext === '.js' || ext === '.mjs' ? 'text/javascript'
      : ext === '.css' ? 'text/css'
      : 'text/plain';
    res.writeHead(200, { 'content-type': ct + '; charset=utf-8' });
    fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/**
 * @param {string} file  file to load (default mamilas.html)
 * @param {(page:any, ctx:{errors:string[],consoleErrors:string[]})=>Promise<any>} fn
 * @returns {Promise<{result:any, errors:string[], consoleErrors:string[]}>}
 */
export async function withPage(file, fn) {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const consoleErrors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push('console.error: ' + m.text());
    });
    await page.goto(`http://127.0.0.1:${port}/${file || 'mamilas.html'}`, { waitUntil: 'load' });
    await page.waitForFunction(
      'window.S && window.render && window.DATA && window.buildBrief',
      null,
      { timeout: 15000 }
    );
    const result = await fn(page, { errors, consoleErrors });
    return { result, errors, consoleErrors };
  } finally {
    await browser.close();
    server.close();
  }
}

// True when this module's file was run directly (node x.mjs), not imported.
export function isMain(metaUrl) {
  return fileURLToPath(metaUrl) === path.resolve(process.argv[1] || '');
}
