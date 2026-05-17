// UI/UX audit screenshot capture. Drives Chromium via Playwright against a
// running server, captures full-page + per-section shots at desktop and
// mobile widths. Screenshots are written OUTSIDE the repo (../.ui-audit).
//
// Usage: node scripts/ui-audit.mjs [baseUrl]
//   baseUrl defaults to http://localhost:4321
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseUrl = process.argv[2] || 'http://localhost:4321';
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', '..', '.ui-audit');
await mkdir(outDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

// Sections to scroll to + capture in the viewport (anchor id → label).
const sections = ['top', 'work', 'about', 'experience', 'contact'];

const browser = await chromium.launch();

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

  // 'commit' resolves the moment the navigation response is received,
  // before any parsing — robust against the heavy WebGL page making
  // load/networkidle/domcontentloaded hang. Retry a few times for the
  // intermittent Chromium-on-Windows navigation flakiness.
  let navigated = false;
  for (let attempt = 1; attempt <= 4 && !navigated; attempt++) {
    try {
      await page.goto(baseUrl, { waitUntil: 'commit', timeout: 20000 });
      navigated = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`  goto attempt ${attempt} failed: ${err.message.split('\n')[0]}`);
      if (attempt === 4) throw err;
      await page.waitForTimeout(1000);
    }
  }
  // Generous settle window for textures, fonts, hydration, and reveals.
  await page.waitForTimeout(6000);

  // Per-section viewport screenshots. (fullPage capture removed — it
  // doesn't fire scroll-reveals and times out on the tall WebGL page.)
  for (const id of sections) {
    await page.evaluate((anchor) => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo(0, 0);
    }, id);
    await page.waitForTimeout(2600);
    await page.screenshot({
      path: resolve(outDir, `${vp.name}-${id}.png`),
      fullPage: false,
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `[${vp.name}] captured. console errors: ${
      consoleErrors.length ? '\n  - ' + consoleErrors.join('\n  - ') : 'none'
    }`
  );

  await ctx.close();
}

await browser.close();
// eslint-disable-next-line no-console
console.log(`\nScreenshots written to: ${outDir}`);
