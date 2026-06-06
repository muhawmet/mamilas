// INTERACT: exercise every [onclick] handler on every route with faithful
// browser semantics, from a clean restored state. Two failure classes:
//   - dead handler: attribute present but el.onclick === null (browser could not
//     compile it — e.g. a syntax error from a raw newline in the inline string)
//   - runtime throw: the compiled handler throws when invoked
// This is the environment's analog of the local "939-button" interaction test.
// Target: 0 errors.
import { withPage, isMain } from './harness.mjs';

export async function run() {
  const { result, errors } = await withPage('mamilas.html', async (page) =>
    page.evaluate(() => {
      const routes = window.SCREENS.map((s) => s[0]);
      // Clean snapshot of default state; restored in-place before each handler so
      // handlers don't corrupt each other (window.S is the live app reference).
      const snap = JSON.parse(JSON.stringify(window.S));
      const restore = () => {
        for (const k of Object.keys(window.S)) delete window.S[k];
        Object.assign(window.S, JSON.parse(JSON.stringify(snap)));
      };
      const ev = { preventDefault() {}, stopPropagation() {}, target: {}, currentTarget: {} };

      let buttons = 0;
      let dead = 0;
      let threw = 0;
      const failList = [];
      const note = (s) => {
        if (failList.length < 25) failList.push(s);
      };

      for (const r of routes) {
        restore();
        window.setRoute(r);
        window.render();
        const count = document.querySelectorAll('#app [onclick]').length;
        for (let k = 0; k < count; k++) {
          restore();
          window.setRoute(r);
          window.render();
          const el = document.querySelectorAll('#app [onclick]')[k];
          if (!el) continue;
          buttons++;
          const attr = (el.getAttribute('onclick') || '').slice(0, 70);
          if (typeof el.onclick !== 'function') {
            dead++;
            note('DEAD ' + r + ' :: ' + attr);
            continue;
          }
          try {
            el.onclick.call(el, ev); // browser-compiled handler, real inline scope
          } catch (e) {
            threw++;
            note('THROW ' + r + ' :: ' + attr + ' -> ' + e.message);
          }
        }
      }
      return { buttons, dead, threw, fails: dead + threw, failList };
    })
  );

  for (const f of result.failList) console.error('  ' + f);
  if (errors.length) errors.forEach((e) => console.error('  ' + e));
  console.log(
    `INTERACT buttons=${result.buttons} dead=${result.dead} threw=${result.threw} errors=${result.fails}`
  );
  return { ok: result.fails === 0, buttons: result.buttons, fails: result.fails };
}

if (isMain(import.meta.url)) run().then((r) => process.exit(r.ok ? 0 : 1));
