import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:4399';
const out = 'C:\\Users\\cris_\\Desktop\\My Website\\.ui-audit';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 700 } });
let ok = false;
for (let i = 0; i < 4 && !ok; i++) {
  try { await page.goto(base, { waitUntil: 'commit', timeout: 15000 }); ok = true; }
  catch (e) { console.log('retry', i, e.message); }
}
await page.waitForTimeout(6000);
const footerTop = await page.evaluate(() => {
  const f = document.querySelector('footer');
  return Math.round(f.getBoundingClientRect().top + window.scrollY);
});
await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 320)), footerTop);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}\\spacing-footer.png` });
await browser.close();
console.log('footer shot done; footerTop=', footerTop);
