// Generates the site's global metadata assets (favicons, apple-touch-icon,
// Open Graph / Twitter share image) by compositing the existing cream
// wordmark SVG (src/assets/logo/good-noise-logo-cream.svg — itself derived
// from scripts/assets/good-noise-logo-master.svg by generate-logo-variants.mjs)
// onto a solid --gn-ink (#14120F) background. Mirrors the previous
// forest-green favicon's proportions: logo centered with generous padding,
// scale bound by whichever canvas dimension is tighter so it works for both
// square icons and the wide 1200x630 OG image.
//
// Requires ImageMagick (`magick`) on PATH to assemble the multi-resolution
// favicon.ico from the generated PNGs.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const LOGO_SVG_PATH = path.join(ROOT, 'src/assets/logo/good-noise-logo-cream.svg');
const OUT_DIR = path.join(ROOT, 'public');

const INK = '#14120F';
const PAD = 0.18; // fraction of canvas reserved as margin on each side

const logoSvg = readFileSync(LOGO_SVG_PATH, 'utf8');
const [, , vbW, vbH] = logoSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);

const TARGETS = [
  { name: 'favicon-16x16.png', w: 16, h: 16 },
  { name: 'favicon-32x32.png', w: 32, h: 32 },
  { name: 'favicon-48x48.png', w: 48, h: 48 }, // intermediate, only for building the .ico
  { name: 'favicon-192x192.png', w: 192, h: 192 },
  { name: 'favicon-512x512.png', w: 512, h: 512 },
  { name: 'apple-touch-icon.png', w: 180, h: 180 },
  { name: 'og-image.png', w: 1200, h: 630 },
];

const browser = await chromium.launch();

for (const { name, w, h } of TARGETS) {
  const maxContentW = w * (1 - 2 * PAD);
  const maxContentH = h * (1 - 2 * PAD);
  const scale = Math.min(maxContentW / vbW, maxContentH / vbH);
  const contentW = vbW * scale;
  const contentH = vbH * scale;

  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html><head><style>
    * { margin:0; padding:0; }
    html,body { width:100%; height:100%; background:${INK}; }
    body { display:flex; align-items:center; justify-content:center; }
    .logo { width:${contentW}px; height:${contentH}px; }
    svg { display:block; width:100%; height:100%; }
  </style></head><body><div class="logo">${logoSvg}</div></body></html>`);
  await page.screenshot({ path: path.join(OUT_DIR, name) });
  await page.close();
  console.log(`${name} <- ${w}x${h}, logo ${Math.round(contentW)}x${Math.round(contentH)}`);
}

await browser.close();

// Assemble the multi-resolution favicon.ico from the 16/32/48 PNGs.
const icoSources = ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png']
  .map((n) => path.join(OUT_DIR, n));
execSync(`magick ${icoSources.join(' ')} ${path.join(OUT_DIR, 'favicon.ico')}`);
console.log('favicon.ico <- 16/32/48');

console.log('\nDone.');
