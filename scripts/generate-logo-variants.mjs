// Recolours the editable master logo (scripts/assets/good-noise-logo-master.svg
// — "GOOD NOISE" wordmark, traced as multiple path groups; the signal-mark
// arcs have been removed from the brand) into the four canonical brand
// colours from src/styles/gn-tokens.css, and rasterises each to a
// transparent PNG. The wordmark's original fill (#0E2218) is replaced with
// a single colour per variant — monochrome, matching how every existing
// good-noise-logo-*.svg in the repo works (one flat colour per file).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'src/assets/logo');
const MASTER_PATH = path.join(ROOT, 'scripts/assets/good-noise-logo-master.svg');

const WORDMARK_FILL = '#0E2218';

// Exact hex values from src/styles/gn-tokens.css — do not eyeball these.
const VARIANTS = [
  { name: 'orange', hex: '#FF4A00' },
  { name: 'blue', hex: '#6FD3FF' },
  { name: 'black', hex: '#14120F' },
  { name: 'cream', hex: '#F4F0E6' },
];

const master = readFileSync(MASTER_PATH, 'utf8');
if (!master.includes(WORDMARK_FILL)) {
  throw new Error('Master SVG fill has changed — update WORDMARK_FILL.');
}

const viewBoxMatch = master.match(/viewBox="([^"]+)"/)[1];
const [, , vbW, vbH] = viewBoxMatch.split(' ').map(Number);

const browser = await chromium.launch();
const RASTER_SCALE = 4; // ~3376x2144 for an 844x536 viewBox — matches the existing PNGs' resolution ballpark

for (const { name, hex } of VARIANTS) {
  const recoloured = master
    .replaceAll(`fill="${WORDMARK_FILL}"`, `fill="${hex}"`)
    .replace(/color="#0E2218"/, `color="${hex}"`)
    .replace(/<title>[^<]*<\/title>/, '<title>Good Noise</title>');

  const svgPath = path.join(OUT_DIR, `good-noise-logo-${name}.svg`);
  writeFileSync(svgPath, recoloured, 'utf8');

  const page = await browser.newPage({
    viewport: { width: Math.round(vbW * RASTER_SCALE), height: Math.round(vbH * RASTER_SCALE) },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html><head><style>
    * { margin:0; padding:0; }
    html,body { width:100%; height:100%; background:transparent; }
    svg { display:block; width:100%; height:100%; }
  </style></head><body>${recoloured}</body></html>`);
  const pngPath = path.join(OUT_DIR, `good-noise-logo-${name}.png`);
  await page.screenshot({ path: pngPath, omitBackground: true });
  await page.close();

  console.log(`good-noise-logo-${name}.svg / .png -> ${hex}`);
}

await browser.close();
console.log('\nDone.');
