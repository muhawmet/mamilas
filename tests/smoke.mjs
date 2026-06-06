// SMOKE: every route in SCREENS must render into #app without throwing and
// produce non-trivial markup. Target: 20/20 (or however many routes exist).
import { withPage, isMain } from './harness.mjs';

export async function run() {
  const { result, errors } = await withPage('mamilas.html', async (page) =>
    page.evaluate(() => {
      const routes = window.SCREENS.map((s) => s[0]);
      const res = [];
      for (const r of routes) {
        let ok = true;
        let err = '';
        let len = 0;
        try {
          window.setRoute(r);
          window.render();
          const app = document.querySelector('#app');
          len = app ? app.innerHTML.length : 0;
          ok = len > 50;
          if (!ok) err = 'empty/short render (' + len + ')';
        } catch (e) {
          ok = false;
          err = e.message;
        }
        res.push({ route: r, ok, err, len });
      }
      return res;
    })
  );

  const total = result.length;
  const pass = result.filter((r) => r.ok).length;
  for (const r of result) if (!r.ok) console.error('  FAIL', r.route, '-', r.err);
  if (errors.length) errors.forEach((e) => console.error('  ' + e));
  console.log(`SMOKE ${pass}/${total}`);
  return { ok: pass === total && errors.length === 0, pass, total };
}

if (isMain(import.meta.url)) run().then((r) => process.exit(r.ok ? 0 : 1));
