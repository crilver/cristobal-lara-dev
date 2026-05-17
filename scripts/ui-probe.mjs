// Targeted probe: do the hero CTAs actually navigate, and what's the
// hero→Work transition look like? Usage: node scripts/ui-probe.mjs <baseUrl>
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4330';
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', '..', '.ui-audit');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (let a = 1; a <= 4; a++) {
  try {
    await page.goto(baseUrl, { waitUntil: 'commit', timeout: 20000 });
    break;
  } catch (e) {
    if (a === 4) throw e;
    await page.waitForTimeout(1000);
  }
}
await page.waitForTimeout(6000);

async function testCTA(label) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => ({ y: window.scrollY, hash: location.hash }));
  // Find the link by its visible text.
  const link = page.getByRole('link', { name: new RegExp(label, 'i') }).first();
  const count = await link.count();
  if (!count) {
    console.log(`  "${label}": NO matching link found`);
    return;
  }
  const href = await link.getAttribute('href');

  // 1) Normal click (strict actionability).
  let normalErr = '';
  await link.click({ timeout: 4000 }).catch((e) => (normalErr = e.message.split('\n')[0]));
  await page.waitForTimeout(1200);
  let s = await page.evaluate(() => ({ y: window.scrollY, hash: location.hash }));
  const normalWorked = s.y !== before.y || s.hash !== before.hash;

  // Reset.
  await page.evaluate(() => { history.replaceState(null, '', location.pathname); window.scrollTo(0, 0); });
  await page.waitForTimeout(500);

  // 2) Force click (bypasses actionability/stability).
  await link.click({ force: true, timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(1200);
  s = await page.evaluate(() => ({ y: window.scrollY, hash: location.hash }));
  const forceWorked = s.y !== before.y || s.hash !== before.hash;

  console.log(
    `  "${label}" href=${href}\n` +
      `      normal click: ${normalWorked ? 'WORKS' : 'NO EFFECT'}${normalErr ? ' (' + normalErr + ')' : ''}\n` +
      `      force  click: ${forceWorked ? 'WORKS' : 'NO EFFECT'}`
  );
}

console.log('CTA navigation test:');
await testCTA('Browse work');
await testCTA('Get in touch');

// Capture the hero→Work boundary: scroll to just past the hero.
await page.evaluate(() => {
  const hero = document.getElementById('top');
  if (hero) window.scrollTo(0, hero.offsetHeight - 380);
});
await page.waitForTimeout(1500);
await page.screenshot({ path: resolve(outDir, 'probe-hero-work-boundary.png') });
console.log(`\nBoundary screenshot: ${resolve(outDir, 'probe-hero-work-boundary.png')}`);

await browser.close();
