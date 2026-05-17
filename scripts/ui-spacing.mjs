import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4399';
const out = 'C:\\Users\\cris_\\Desktop\\My Website\\.ui-audit';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let ok = false;
for (let i = 0; i < 4 && !ok; i++) {
  try {
    await page.goto(base, { waitUntil: 'commit', timeout: 15000 });
    ok = true;
  } catch (e) {
    console.log('retry goto', i, e.message);
  }
}
await page.waitForTimeout(6000);

// Scroll to the very bottom
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2500);

// Measure section boundaries + trailing gap
const metrics = await page.evaluate(() => {
  const docH = document.documentElement.scrollHeight;
  const sections = [...document.querySelectorAll('section')].map((s) => {
    const r = s.getBoundingClientRect();
    return {
      id: s.id || '(none)',
      top: Math.round(r.top + window.scrollY),
      bottom: Math.round(r.bottom + window.scrollY),
      height: Math.round(r.height),
    };
  });
  const footer = document.querySelector('footer');
  const fr = footer ? footer.getBoundingClientRect() : null;
  const footerBottom = fr ? Math.round(fr.bottom + window.scrollY) : null;
  return {
    docH,
    sections,
    footerBottom,
    trailingGap: footerBottom != null ? docH - footerBottom : null,
  };
});

console.log(JSON.stringify(metrics, null, 2));

await page.screenshot({ path: `${out}\\spacing-pagebottom.png` });

// Capture each inter-section boundary: scroll so the boundary sits mid-viewport
const boundaries = [];
for (let i = 0; i < metrics.sections.length - 1; i++) {
  boundaries.push({
    label: `${metrics.sections[i].id}__${metrics.sections[i + 1].id}`,
    y: metrics.sections[i].bottom,
  });
}
for (const b of boundaries) {
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 450)), b.y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}\\spacing-${b.label}.png` });
}

await browser.close();
console.log('done');
