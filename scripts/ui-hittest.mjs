// Diagnostic: what element is actually at the hero CTA coordinates, and
// what's its pointer-events chain? Usage: node scripts/ui-hittest.mjs <url>
import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4332';
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
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);

const report = await page.evaluate(() => {
  const findLink = (txt) =>
    [...document.querySelectorAll('a')].find((a) =>
      a.textContent.trim().toLowerCase().includes(txt)
    );
  const probe = (label, txt) => {
    const link = findLink(txt);
    if (!link) return { label, found: false };
    const r = link.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const topEl = document.elementFromPoint(cx, cy);
    // Walk up from link, collect pointer-events of each ancestor.
    const chain = [];
    let n = link;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n);
      chain.push(
        `${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}${
          n.className && typeof n.className === 'string'
            ? '.' + n.className.split(' ').slice(0, 2).join('.')
            : ''
        } [pe:${cs.pointerEvents} z:${cs.zIndex} pos:${cs.position}]`
      );
      n = n.parentElement;
    }
    // Identify the topmost element + its chain to body.
    const topChain = [];
    let t = topEl;
    while (t && t !== document.body) {
      const cs = getComputedStyle(t);
      topChain.push(
        `${t.tagName.toLowerCase()}${t.id ? '#' + t.id : ''}${
          t.className && typeof t.className === 'string'
            ? '.' + t.className.split(' ').slice(0, 2).join('.')
            : ''
        } [pe:${cs.pointerEvents} z:${cs.zIndex}]`
      );
      t = t.parentElement;
    }
    return {
      label,
      found: true,
      rect: { x: Math.round(cx), y: Math.round(cy), w: Math.round(r.width), h: Math.round(r.height) },
      topElementIsLinkOrChild: link.contains(topEl) || topEl === link,
      topElement: topEl
        ? `${topEl.tagName.toLowerCase()}${topEl.id ? '#' + topEl.id : ''}${
            topEl.className && typeof topEl.className === 'string'
              ? '.' + topEl.className.split(' ').slice(0, 3).join('.')
              : ''
          }`
        : 'none',
      topChain,
      linkAncestryPointerEvents: chain,
    };
  };
  return [probe('Browse work', 'browse work'), probe('Get in touch', 'get in touch')];
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
