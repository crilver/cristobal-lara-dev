// One-shot script — converts source JPGs to WebP for the Lanyard card,
// including a background-removal pass for NWeb1 (dark-bg studio shot).
// Run with: node scripts/convert-headshots.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const sourceRoot = resolve(projectRoot, '..', 'work-evidence', 'Extras', 'Profesional pictures');
const outDir = resolve(projectRoot, 'public', 'headshots');

await mkdir(outDir, { recursive: true });

/**
 * Remove the dark studio background from a portrait by flood-filling from
 * each of the four corners. Pixels reachable from a corner via a
 * color-distance ≤ `tolerance` path are marked fully transparent; pixels
 * inside the subject that happen to share the bg color (e.g. dark hair,
 * black shirt squares) are NOT eaten because they're not connected to a
 * corner through a continuous dark region.
 *
 * Soft edge: after flood fill, the alpha mask is morphologically dilated
 * by one pixel and gaussian-blurred so the subject outline blends instead
 * of showing a hard saw-edge.
 */
async function removeDarkBg(inputPath, outputPath, { tolerance = 32 } = {}) {
  // Decode to raw RGBA so we can edit pixels directly.
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = info.channels; // 4 after ensureAlpha
  const pixels = Buffer.from(data); // mutable copy

  // Sample 16×16 patches at each corner, average them as the bg reference.
  const samplePatch = (cx, cy, size = 16) => {
    let r = 0, g = 0, b = 0, count = 0;
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const i = (y * w + x) * channels;
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
    }
    return [r / count, g / count, b / count];
  };
  const corners = [
    samplePatch(0, 0),
    samplePatch(w - 16, 0),
    samplePatch(0, h - 16),
    samplePatch(w - 16, h - 16),
  ];
  const bg = [
    corners.reduce((s, c) => s + c[0], 0) / 4,
    corners.reduce((s, c) => s + c[1], 0) / 4,
    corners.reduce((s, c) => s + c[2], 0) / 4,
  ];
  // eslint-disable-next-line no-console
  console.log(`  bg color sampled: rgb(${bg.map((v) => Math.round(v)).join(', ')})`);

  // Flood-fill from corners. Use a Uint8Array as visited mask.
  const visited = new Uint8Array(w * h);
  const stack = [];
  const seedIfBg = (x, y) => {
    const idx = y * w + x;
    if (visited[idx]) return;
    const pi = idx * channels;
    const dr = pixels[pi] - bg[0];
    const dg = pixels[pi + 1] - bg[1];
    const db = pixels[pi + 2] - bg[2];
    if (Math.sqrt(dr * dr + dg * dg + db * db) > tolerance) return;
    visited[idx] = 1;
    stack.push(idx);
  };
  // Seed from every corner.
  seedIfBg(0, 0);
  seedIfBg(w - 1, 0);
  seedIfBg(0, h - 1);
  seedIfBg(w - 1, h - 1);

  // Iterative DFS.
  while (stack.length) {
    const idx = stack.pop();
    const x = idx % w;
    const y = (idx - x) / w;
    if (x > 0) seedIfBg(x - 1, y);
    if (x < w - 1) seedIfBg(x + 1, y);
    if (y > 0) seedIfBg(x, y - 1);
    if (y < h - 1) seedIfBg(x, y + 1);
  }

  // Zero alpha on every flood-filled pixel.
  for (let i = 0; i < visited.length; i++) {
    if (visited[i]) pixels[i * channels + 3] = 0;
  }

  // Soft edge pass: dilate the bg mask by 1px and feather it.
  // Find edge pixels (transparent next to opaque) and set their alpha to a
  // mid value so the boundary fades instead of clipping.
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (!visited[idx]) continue; // we only feather from transparent into opaque
      // Neighbours
      const nIdx = [idx - 1, idx + 1, idx - w, idx + w];
      const hasOpaqueNeighbour = nIdx.some((n) => !visited[n]);
      if (hasOpaqueNeighbour) {
        pixels[idx * channels + 3] = 64; // soft fringe
      }
    }
  }

  await sharp(pixels, { raw: { width: w, height: h, channels } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outputPath);
}

/**
 * Cropped + resized WebP, no bg removal. Used for the bright-bg variant
 * (kept around in case we want a light-theme alternative later).
 */
async function plainResize(inputPath, outputPath, { width, height, position = 'top' }) {
  await sharp(inputPath)
    .resize(width, height, { fit: 'cover', position })
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

// --- Outputs ---

// Single transparent portrait of Cristobal, used as the card photo for
// BOTH themes. Card draws it centered over its own gradient bg.
const NWEB = resolve(sourceRoot, 'NWeb1.jpg');
const BWEB = resolve(sourceRoot, 'BWeb1.jpg');

console.log('Removing dark bg from NWeb1.jpg → cristobal-card.webp …');
await removeDarkBg(NWEB, resolve(outDir, 'cristobal-card.webp'));
console.log('  ✓ done');

// Keep the simple cropped variants around for other surfaces (About, OG meta, etc).
console.log('Resizing portraits …');
await plainResize(NWEB, resolve(outDir, 'cristobal-dark.webp'), { width: 900, height: 1200, position: 'top' });
await plainResize(BWEB, resolve(outDir, 'cristobal-light.webp'), { width: 900, height: 1200, position: 'top' });
console.log('  ✓ done');
