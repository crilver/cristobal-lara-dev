// One-shot script — converts the BWeb / NWeb source JPGs to WebP at the
// sizes the Lanyard card uses. Run with: node scripts/convert-headshots.mjs
// Re-run any time the source headshots change.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const sourceRoot = resolve(projectRoot, '..', 'work-evidence', 'Extras', 'Profesional pictures');
const outDir = resolve(projectRoot, 'public', 'headshots');

await mkdir(outDir, { recursive: true });

const variants = [
  // Square crops for the Lanyard card photo well (520×520 in-canvas).
  // 800px gives 2× anisotropic headroom on retina.
  { src: 'BWeb1.jpg', out: 'cristobal-light-card.webp', width: 800, height: 800, fit: 'cover', position: 'top' },
  { src: 'NWeb1.jpg', out: 'cristobal-dark-card.webp', width: 800, height: 800, fit: 'cover', position: 'top' },
  // Portrait crops in case other surfaces want full body.
  { src: 'BWeb1.jpg', out: 'cristobal-light.webp', width: 900, height: 1200, fit: 'cover', position: 'top' },
  { src: 'NWeb1.jpg', out: 'cristobal-dark.webp', width: 900, height: 1200, fit: 'cover', position: 'top' },
];

for (const v of variants) {
  const inPath = resolve(sourceRoot, v.src);
  const outPath = resolve(outDir, v.out);
  await sharp(inPath)
    .resize(v.width, v.height, { fit: v.fit, position: v.position })
    .webp({ quality: 90, effort: 6 })
    .toFile(outPath);
  // eslint-disable-next-line no-console
  console.log(`✓ ${v.src} → public/headshots/${v.out}`);
}
